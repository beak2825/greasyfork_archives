// ==UserScript==
// @name         netcare axios请求工具
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  使用说明:可使用axios进行请求;
// @author       longfei 30003589
// @require      https://unpkg.com/axios
// @match        *://gdedev.icta138.huawei.com:38443/*
// @match        *://gdesit.icta138.huawei.com:38443/*
// @match        *://netcare-uat.huawei.com/*
// @match        *://netcare.huawei.com/*
// @match        *://netcare-de.gts.huawei.com/*
// @match        *://netcare-mx.gts.huawei.com/*
// @grant        none
// @date         2022-11-11
// @new          2022-11-25 2022-12-16 2023-04-25 2023-04-28 2023-05-11 2023-06-26 2023-07-02 2023-07-04 2023-08-01
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454575/netcare%20axios%E8%AF%B7%E6%B1%82%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/454575/netcare%20axios%E8%AF%B7%E6%B1%82%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
// https://greasyfork.org/zh-CN/scripts/454575-netcare-axios%E8%AF%B7%E6%B1%82%E5%B7%A5%E5%85%B7
(function () {
  'use strict';
  setTimeout(async function () {
    // 添加ows的头信息
    if (!axios.defaults.headers['x-gde-csrf-token']) {
      if (window.csrfToken) {
        axios.defaults.headers['x-gde-csrf-token'] = csrfToken;
      } else {
        axios.defaults.headers['x-gde-csrf-token'] = await fetch('/netcareServer/services/getSysConfig.do')
          .then(r => r.json())
          .then(r => r.csrfToken);
      }
    }
    if (!axios.defaults.headers.csrfToken && location.pathname.startsWith('/p/netcare')) {
      axios.defaults.headers.csrfToken = await fetch('/netcareServer/services/getLoginInfo.do', { method: 'POST' })
        .then(r => r.json())
        .then(r => r.data.csrfToken); // portal请求用
    }
    // 添加axios请求ows的多种方式:
    // 1,axios.post('/$ows/checkIsUniportalAccount', {})
    // 2,axios.post('app.service.cs_nc_uniportal.checkIsUniportalAccount')
    // 3,axios.post('/adc-service/web/rest/v1/legacy/services/getWorkSpaceRelatedCount') gde1.5
    // 4,axios.post('/adc-service/web/rest/v1/services/nc_portal/cs_nc_uniportal/checkIsUniportalAccount', {}) gde2
    // 5,axios.post('/ows/nc_portal/cs_nc_uniportal/checkIsUniportalAccount', {}) gde2 简写
    // 可查sql:
    // 1,axios.post('/adc-studio-model/web/rest/v1/model-instances/queryByTql', { "tql": "select * from \"/NetCareRiskManageService/cs_nc_common_risk/common_risk_clues\" as common_risk_clues limit 20", "project_name": "NetCareRiskManageService" })
    axios.interceptors.request.use(async config => {
      let { url } = config;
      if (url.startsWith('/adc') || url.startsWith('/ows') || url.startsWith('/$ows') || url.startsWith('/netcareServer/') || url.startsWith('app.')) {
        if (url.startsWith('app.') || url.startsWith('/$ows/')) {
          // app.service 原gde 1.5简写方式,遗留资产
          let ser = url.startsWith('app.') ? url.split('.').pop() : url.substring(6);
          config.url = '/adc-service/web/rest/v1/legacy/services/' + ser;
        } else if (url.startsWith('/ows')) {
          // gde 2以上简写方式
          config.url = '/adc-service/web/rest/v1/services' + url.substring(4);
        }
        if (url.startsWith('/adc-model') || url.startsWith('/adc-schedule') || url.startsWith('/adc-studio') || url.startsWith('/adc-asset') || url.startsWith('/adc-intg')) {
          const timeStamp = new Date().getTime();
          let getPageToken = function (url, timeStamp) {
            let tokenUrl = url.indexOf('?') !== -1 ? url.split('?')[0] : url;
            tokenUrl = tokenUrl + timeStamp;
            let getStringHashCode = inputString => {
              if (Array.prototype.reduce) {
                return inputString.split('').reduce((aParams, b) => {
                  let a = aParams;
                  a = (a << 5) - a + b.charCodeAt(0);
                  return a & a;
                }, 0);
              }
              let hash = 0;
              if (inputString.length === 0) {
                return hash;
              }
              for (let i = 0; i < inputString.length; i++) {
                const character = inputString.charCodeAt(i);
                hash = (hash << 5) - hash + character;
                hash = hash & hash;
              }
              return hash;
            };
            const hashCode = getStringHashCode(tokenUrl);
            return hashCode;
          };
          config.headers['x-adc-page-timestamp'] = timeStamp;
          config.headers['x-adc-page-token'] = getPageToken(url, timeStamp);
        }
      }
      return config;
    });
    axios.interceptors.response.use(
      res => {
        return res.data;
      },
      async err => {
        console.error('err: ', err);
        if ([400, 401, 403].includes(err.response.status)) {
          if (err.config.url.includes('/netcareServer')) {
            axios.defaults.headers.csrfToken = await fetch('/netcareServer/services/getLoginInfo.do', { method: 'POST' })
              .then(r => r.json())
              .then(r => r.data.csrfToken);
          } else {
            axios.defaults.headers['x-gde-csrf-token'] = await fetch('/netcareServer/services/getSysConfig.do')
              .then(r => r.json())
              .then(r => r.csrfToken);
          }
        }
        if (axios.lastUrl === err.config.url) {
          return;
        }
        axios({
          url: err.config.url,
          method: err.config.method,
          data: err.config.data,
          headers: { 'Content-Type': err.config.headers['Content-Type'] }
        });
        axios.lastUrl = err.config.url;
      }
    );
  }, 500);
  // 获取全局变量存在glb上
  window._getGlb = () => {
    let iframe = document.createElement('iframe');
    iframe.onload = function() {
      window.glb = {}
      var iframeKeys = iframe.contentWindow;
      Object.keys(window).forEach(function(key) {
        if (!(key in iframeKeys)) {
          glb[key] = window[key]
        }
      });
      iframe.remove()
    }
    iframe.src = 'about:blank';
    document.body.appendChild(iframe);
  }
  // 调试接口服务 url:/../project/module/service或project.module.service
  window._invoke = (url, param) => {
    let arr = url.split(/\.|\//).slice(-3)
    let [project_name, module_name, service_name] = arr;
    return axios.post('/adc-service/web/rest/v1/services/MaintenanceEngineerService/MaintenanceEngineerService/st_service_debug_new', {
      project_name,
      module_name,
      service_name,
      request_body: param
    }).then(res=>{
      let r = res.result.debug_output
      console.log('res:', r)
      window.S && window.S('Output')?.setValue(JSON.stringify(r, null, 4));
      return r;
    })
  }
  // 查tql
  window._invokeTql = async (tql) => {
    // console.time('aaa')
    let res = await axios.post('/adc-service/web/rest/v1/services/MaintenanceEngineerService/MaintenanceEngineerService/tql_query', {tql})
    // console.timeEnd('aaa')
    return res.result
  }
  // 查证书
  window._invokeCert = async (w3, u) => {
    let d
    if (w3?.uniportAccount || w3?.studentUserid || u) {
      d = await _invokeRest('nc_usercenter.Qualification_Management_Netcare.findStudentCertificateList', {"uniportAccount": w3?.uniportAccount || w3})
      _clgTbl(d.text, 'certClassifyThree,grantDate,pcExpiredDate,pcCode')
    } else if (typeof w3 === 'string' && /^[a-z]\d{8}$|^[a-z]wx\d{6,7}$/i.test(w3)) {
      d = await _invokeRest('nc_usercenter.Qualification_Management_Netcare.sync_qualification_certification_from_iLearning', {w3Account: w3})
      _clgTbl(d.content, 'title,startTime,endTime,cerCode')
    } else {
      // 查uniportal账号: { uniportAccount: "xx" }
      // 查w3账号: { studentUserid: "xx" }
      console.log('参数:','{ "uniportAccount": "xxxxxxxxxx"}')
      d = await _invokeRest('nc_usercenter.Qualification_Management_Netcare.findStudentCertificateList', w3)
      _clgTbl(d.text, 'certClassifyThree,grantDate,pcExpiredDate,pcCode')
    }
    return d
  }
  // 出站服务简写
  window._invokeRest = async (url, param) => {
    let arr = url.split(/\.|\//).slice(-3)
    let [project_name, module_name, service_name] = arr;
    let res = await axios.post('/adc-service/web/rest/v1/services/MaintenanceEngineerService/MaintenanceEngineerService/rest_invoke', {
      project_name,module_name, service_name,
      request_body: param
    })
    let d = res.data ? res.data : res
    console.log('data:', d)
    return d
  }
  // 跳转spl页面
  window._toSpl = (url, other) => {
    let host = location.origin
    url = url.split(/\.|\//).slice(-3).join('/')
    if (other) {
      window.open(location.origin + '/adc-web/ui/standalone/index.html#/spl2/' + url)
    }
    window.open(location.origin + '/adc-ui/spl-plus/' + url)
  }
  // 根据url与环境打开新页面
  window._toUrl = (url, env) => {
    let envs = {
      dev: 'https://gdedev.icta138.huawei.com:38443/',
      sit: 'https://gdesit.icta138.huawei.com:38443/',
      uat: 'https://netcare-uat.huawei.com/',
      pro: 'https://netcare.huawei.com/',
      de: 'https://netcare-de.gts.huawei.com/',
      mx: 'https://netcare-mx.gts.huawei.com/'
    }
    let host = (env && envs[env]) || location.origin
    if (url.startsWith('https')) {}
    else if (!url) {
      url = location.href.replace(location.origin, envs[env]?.slice(0, -1) || location.origin)
    } else {
       url = host + url.replace(/^\/+/, '')
    }
    window.open(url)
  }
  // 打开用户信息
  window._toUser = (username = '') => {
    location.href = `/p/netcare/index.html#/iframe/iframe-page/%2Fp%2Fuc%2Findex.html%23%2Fperson%2Fbasic-info%3Fusername=${username}&title=%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF&title_en=User%20Info`
  }
  // 输出指定字段的表格数据
  window._clgTbl = function(arr, filters, consoles) {
    typeof filters === 'string' && (filters = filters.split(',').map(i => i.trim()))
    let tmp = arr.map(itm => filters.reduce((obj,i)=>(obj[i]=itm[i], obj), {}))
    if (consoles === undefined || consoles) {
      console.table(tmp)
    }
    return tmp;
  }
  // 获取ppcc, csc证书日期
  window._getPpccCsc = (account_id) => {
    _invoke('/nc_usercenter/nc_usercenter/get_ppcc_csc_date', { account_id })
  }
  // 同步证书到netcare
  window._syncCsc = (userId) => {
    axios.post('/$ows/sync_csc_currentUser', { userId })
  }
  // 同步证书到wfm https://netcare.huawei.com/adc-ui/spl-plus/nc_usercenter/nc_usercenter/ncuc_send_ppcc_csc_to_wfm_grid_admin
  window._sendCsc = (w3account) => {
    _invoke('/adc-service/web/rest/v1/services/nc_usercenter/nc_usercenter/send_ppcc_csc_to_wfm', { w3account })
  }
  // 查uniportal是否绑定
  window._bindUniportal = async (w3) => {
    let d = {}
    if (/^[a-z]\d{8}$|^[a-z]wx\d{6,7}$/i.test(w3)) {
      d.account_id = w3
    } else {
      d.uniportal = w3
    }
    let r = await axios.post('/$ows/ncuc_get_bind_uniportal_by_admin', d)
    console.log('r:',r)
    return r
  }
  // 查是否有新旧账号绑定
  window._bindAccount = async (w3) => {
    let r = await axios.post('/$ows/ncuc_bind_account_relation_getList_byAccountId', {bind_account: w3})
    console.log('r:',r?.result[0])
    return r
  }
  window._bindAccount2 = async (w3) => {
    let r = await axios.post('/$ows/ncuc_account_relation_active_getList', {account_id: w3})
    console.log('r:',r?.result[0])
    return r
  }
  // 关闭待办
  window._closeTodo = async (task_id) => {
    if (typeof task_id === 'string') {
        task_id = [task_id]
    } else if (task_id?.task_id) {
        task_id = [task_id?.task_id]
    }
    task_id.forEach(i => _invoke('/ows/nc_portal/cs_nc_uniportal/cs_nc_uniportal_inprogress_task_update',{task_id: i?.task_id || i, selected_status:'0'}))
    // Promise.all(task_id.map(i => _invoke('/ows/nc_portal/cs_nc_uniportal/cs_nc_uniportal_inprogress_task_update',{task_id: i?.task_id || i, selected_status:'0'}))).then(r => console.log(r))
  }
  // window._batchReq(arr, fn)
  // 监听hwa页面埋码,打印data
  /* setTimeout(function () {
    if (window.hwa?.q) {
      window._hwa = window.hwa.q.push;
      window.hwa.q.push = function (...args) {
        let [type, code, da] = args[0]
        if (type === 'trackPageView') {
          console.log('data:', da?.data);
        }
        window._hwa.apply(window.hwa.q, args);
      };
    }
  }, 2000);*/
})();
