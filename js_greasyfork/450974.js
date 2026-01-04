// ==UserScript==
// @name            Yapi生成interface
// @description     跳转到接口页面后，打开控制台，刷新一次网页即可打印
// @match           https://yapi.hellobike.cn/*
// @version         0.1.0
// @namespace       https://greasyfork.org/users/956038
// @require         https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/450974/Yapi%E7%94%9F%E6%88%90interface.user.js
// @updateURL https://update.greasyfork.org/scripts/450974/Yapi%E7%94%9F%E6%88%90interface.meta.js
// ==/UserScript==

/* jshint esversion:6 */
(function () {

    /** 根据空格数量缩进 */
const indentSpace = (num) => {
  return [...Array(num)].map((_) => ' ').join('');
}

/** 构建单条属性，如果接口没有备注，则不显示注释 */
const makeSingleProperty=(indent, key, description, other) => {
  return `${description && `\n${indentSpace(indent)}/** ${description} */`}
${indentSpace(indent)}${key}: ${other}`
}

/** 根据类型不同构建单条属性，如果是对象，会递归到数字、字符串、布尔才停止 */
const parseObj2Type = (val, key, indent, description) => {
  const {type} = val;
  /** 如果是对象 */
  if (type === 'object') {
    const {properties: objProperties} = val;
    return makeSingleProperty(indent, key, description, `{${properties2Type(objProperties, indent+2)}\n${indentSpace(indent)}}`)
  }
  /** 如果是数字 */
  if (type === 'number' || type === 'integer') {
    return makeSingleProperty(indent, key, description, 'number')
  }
  /** 如果是字符串 */
  if (type === 'string') {
    return makeSingleProperty(indent, key, description, 'string')
  }
  /** 如果是布尔 */
  if (type === 'boolean') {
    return makeSingleProperty(indent, key, description, 'boolean')
  }
}

/** 遍历全部属性 */
const properties2Type = (properties, indent=2) => {
  const keys = Object.keys(properties);
  return keys.map((key) => {
    const val = properties[key];
    const {type, description = ''} = val;
    let currentResult = '';
    if (type === 'array') {// 数组需要特殊做处理
      const {items} = val;
      currentResult += `${parseObj2Type(items, key, indent, description)}[]`
    } else {
      currentResult += parseObj2Type(val, key, indent, description);
    }
    return currentResult
  }).join('');
}

/** 转换Query */
const query2Type = (queries) => {
  return queries.map((query) => makeSingleProperty(2, query.name, query.desc, 'string')).join(',')
}

/** 接口数据提取action（不一定准确） */
const actionFromApiData = (apiData) => {
  const {title, path} = apiData;
  let action = '';
  if (title.includes('.')) {
    [, action] = title.match(/(.*?)\(/) || [];
  }
  if (path.includes('.')) {
    action = path;
  }
  return action
}

/** 接口title提取注释部分 */
const markFromApiData = (apiData) => {
  const {title} = apiData;
  const [, mark] = title.match(/\((.*?)\)/) || [];
  return mark;
} 

/** 接口path转换为方法名, platform: pmsweb, pmsadmin, pmsh5, rentcarh5 */
const pathToFuncName = (apiData, platform) => {
  if (['pmsweb', 'pmsh5', 'rentcarh5'].includes(platform)) {
    return actionFromApiData(apiData)
      .split('.')
      .filter((word) => !!word)
      .map((word, idx) => idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }
  if (platform === 'pmsadmin') {
    return apiData.path
      .split('/')
      .filter((word) => !!word)
      .map((word, idx) => idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }
}

/** 接口path转化为interface名 */
const pathToInterfaceName = (apiData, platform) => {
  if (['pmsweb', 'pmsh5', 'rentcarh5'].includes(platform)) {
    return actionFromApiData(apiData).split('.').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }
  if (platform === 'pmsadmin') {
    return apiData.path.split('/').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }
}

/** api.ts方法的注释 */
const remarkForApiTs = (apiData) => {
  return `/**
 * ${markFromApiData(apiData)}
 * @yapi ${window.location.href}
 */`
}

/** 输出interface.ts */
const outputInterfactTs = (apiData, platform) => {
  const {req_body_other = '{}', res_body = '{}', req_query = []} = apiData;
  const {properties: reqProperties = []} = JSON.parse(req_body_other);
  const {properties: resProperties = []} = JSON.parse(res_body);
  console.log(`interface.ts
${req_query.length>0 ? `
/** ${markFromApiData(apiData)}请求参数 */
export interface ${pathToInterfaceName(apiData, platform)}ParamsType {
  ${query2Type(req_query)}
}` : ''}

/** ${markFromApiData(apiData)}请求参数 */
export interface ${pathToInterfaceName(apiData, platform)}ParamsType {${properties2Type(reqProperties)}
}

/** ${markFromApiData(apiData)}响应参数 */
export interface ${pathToInterfaceName(apiData, platform)}Type {${properties2Type(resProperties)}
}
  `)
}

/** 输出商户后台 api.ts | interface.ts */
const outputPmsWebCode = (apiData) => {
  console.groupCollapsed('商户后台AppRentCarPmsWeb代码')
  outputInterfactTs(apiData, 'pmsweb');
  console.log(`api.ts

import { post } from 'base/api/axios';
import config from '@/env.config';

const API = \`\${config.RENTCARPMS_API}/api\`;

${remarkForApiTs(apiData)}
export function ${pathToFuncName(apiData, 'pmsweb')}(
  params: ${pathToInterfaceName(apiData, 'pmsweb')}ParamsType,
): Promise<${pathToInterfaceName(apiData, 'pmsweb')}Type> {
  return post(API, '${actionFromApiData(apiData)}', params).then((res) => res.data);
}
`)
  console.groupEnd();
}

/** 输出供给后台 api.ts | interface.ts */
const outputPmsAdminCode = (apiData) => {
  console.groupCollapsed('供给后台AppRentCarAdminWeb代码');
  outputInterfactTs(apiData, 'pmsadmin');
  console.log(`api.ts

import Ax from 'base/api/axios';
import config from '@/env.config';

const API = config.RENTCAR_API;

${remarkForApiTs(apiData)}
export function ${pathToFuncName(apiData, 'pmsadmin')}(
  params: ${pathToInterfaceName(apiData, 'pmsadmin')}ParamsType,
): Promise<${pathToInterfaceName(apiData, 'pmsadmin')}Type> {
  return Ax.post<${pathToInterfaceName(apiData, 'pmsadmin')}Type>(\`\${API}${apiData.path}\`, { ...params }).then((res) => res.data);
}
  `)
  console.groupEnd();
}

/** 输出小程序 api.ts | interface.ts */
const outputPmsH5Code = (apiData) => {
  console.groupCollapsed('小程序AppRentCarPmsH5代码');
  outputInterfactTs(apiData, 'pmsh5');
  console.log(`api.ts

import { post } from '.';

${remarkForApiTs(apiData)}
export function ${pathToFuncName(apiData, 'pmsh5')}(
  params: ${pathToInterfaceName(apiData, 'pmsh5')}ParamsType,
  ExtParams: BaseParamsExt = {},
) {
  return post<${pathToInterfaceName(apiData, 'pmsh5')}Type>(ExtParams)({
    action: '${actionFromApiData(apiData)}',
    ...params,
  }).then((res) => res.data);
}
  `)
  console.groupEnd();
}

/** 输出C端h5 api.ts | interface.ts */
const outputRentCarH5Code = (apiData) => {
  console.groupCollapsed('C端AppRentCarH5代码');
  outputInterfactTs(apiData, 'rentcarh5');
  console.log(`api.ts

import { post } from './base';

${remarkForApiTs(apiData)}
export function ${pathToFuncName(apiData, 'rentcarh5')}(
  data: ${pathToInterfaceName(apiData, 'rentcarh5')}ParamsType,
): Promise<${pathToInterfaceName(apiData, 'rentcarh5')}Type> {
  return post(data, '${actionFromApiData(apiData)}', true);
}
  `)
console.groupEnd();
}

const [, id] = window.location.href.match(/https:\/\/yapi.hellobike.cn\/project\/\d+\/interface\/api\/(\d+)/) || [];
if (id) {
  fetch(`https://yapi.hellobike.cn/api/interface/get?id=${id}`).then(function(response) {
    response.json().then((json) => {
      /** 输出商户后台代码 */
      outputPmsWebCode(json.data);
      /** 输出供给后台代码 */
      outputPmsAdminCode(json.data);
      /** 输出小程序代码 */
      outputPmsH5Code(json.data);
      /** 输出C端h5代码 */
      outputRentCarH5Code(json.data);
    });
  })
}
})()