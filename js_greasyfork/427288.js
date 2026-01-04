// ==UserScript==
// @name         德鲁伊被强化了
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  提供运营与开发界面的互跳功能
// @author       燕修
// @match        http://insiopweb.stable.alipay.net/*
// @match        https://insiopweb.alipay.com/*
// @icon         https://www.google.com/s2/favicons?domain=alipay.net
// @require https://greasyfork.org/scripts/415581-jquery%E5%BA%93/code/jquery%E5%BA%93.js?version=866373
// @grant GM_setValue
// @grant GM_getValue
// @license GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/427288/%E5%BE%B7%E9%B2%81%E4%BC%8A%E8%A2%AB%E5%BC%BA%E5%8C%96%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/427288/%E5%BE%B7%E9%B2%81%E4%BC%8A%E8%A2%AB%E5%BC%BA%E5%8C%96%E4%BA%86.meta.js
// ==/UserScript==
// 公用数据
//js模拟触发React DOM点击
function simulateReactClick(element) {
    ['mousedown', 'click', 'mouseup'].forEach(mouseEventType=>element.dispatchEvent(new MouseEvent(mouseEventType,{
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1
    })));
}

var url = document.location.href;
var modeMap = {
    scene: '运营场景管理',
    sceneEdit: '运营场景配置',
    // queryCode 有意义
    adminScene: '开发场景管理',
    template: '开发模板管理',
    // sceneCode  sceneName
    templateEdit: '开发模板配置',
    // templateCode edit sceneCode sceneName
    sceneModule: '运营场景模块管理',
    // sceneCode sceneName keyword
    sceneModuleEdit: '运营场景模块配置',
    // queryCode 数字串
    unsupport: '暂不支持',
}
var envMap = {
    stable: '开发环境',
    prod: '线上环境',
    change: '修改地址',
}
var urlEnvMap = {
    stable: 'http://insiopweb.stable.alipay.net',
    prod: 'https://insiopweb.alipay.com'
}
var urlModeMap = {
    sceneModuleEdit: '/scene/module/edit',
    sceneModule: '/scene/module',
    templateEdit: '/admin/template/edit',
    template: '/admin/template',
    adminScene: '/admin/scene',
    sceneEdit: '/scene/edit',
    scene: '/scene',
    unsupport: '/'
}

var getStorage = () =>{
  let _storage;
   try {
        _storage = JSON.parse(GM_getValue('$_POWER_DRUID_DATA','{}'));
   } catch(e){}
  return _storage;
}
var data = getStorage();

const moduleEditURLMap = data && data.moduleEditURLMap || {};
let logedVersion = data && data.logedVersion || 0 ;

var setStorage = () =>{
   var data = {
       moduleEditURLMap,
       logedVersion
   };
   GM_setValue('$_POWER_DRUID_DATA',JSON.stringify(data));
}

var jumpAndSave = (url)=>{
   setStorage();
   url && (location.href =  url);
}
var getMode = (url)=>{
    for (let name of Object.keys(urlModeMap)) {
        if (url.includes(urlModeMap[name]))
            return name;
    }
}
var mode, env, param;
var updateEnvModeParam = ()=>{
    url = location.href;
    mode = getMode(url);
    env = url.includes('.stable.') ? 'stable' : 'prod';
}
updateEnvModeParam();
cc(mode, env, param)

// 公用数据结束


// 处理更新日志
const upgradeLog = [
  {
      version: 1,
      log: '增加了跳转地址记录功能，现在输入一次可以记录模块编辑线上环境与线下环境跳转的地址，以解决他们querycode不相同的问题',
  }
];


if( logedVersion < upgradeLog[0].version ){
  alert(upgradeLog[0].log);
  logedVersion = upgradeLog[0].version;
  setStorage();
}

// 处理待发布
var dealPublic = (param)=>{
    if (!param || !param.insiopPlusInfoModuleName)
        return;
    const _list = $(".ant-table-tbody tr");
    for (let row in _list) {
        const list = $(_list[row]).children();
        for (let col in list) {
            if (list[col].innerText === param.insiopPlusInfoModuleName) {
                for (let col in list) {
                    if (list[col].innerText === '发布') {
                        simulateReactClick(list[col].firstChild.firstChild.firstChild);
                    }
                }
            }
        }
    }
}
// 注入逻辑
var injectPlugin = ()=>{
    $("#insiop-plus-panel").remove();
    $("#insiop-plus-css").length || loadCss();
    loadPanel();
    //给所有Dom提供触发方法
    document.__proto__.__proto__.__proto__.reactClick = function() {
        simulateReactClick(this);
    }
}
var doAfterLoad = (fn,condition)=>{
    var inject = setInterval(()=>{
        if (condition ? condition() : $('[class^=contentRight]').length) {
            fn();
            clearInterval(inject);
        }
    }
    , 100);
}
doAfterLoad(()=>{
    injectPlugin()
}
)
if (mode === 'sceneModule') {
    doAfterLoad(()=>{
        var param = getQuery(url);
        dealPublic(param);
    }
    , ()=>{
        if ($('.ant-table-tbody tr').length > 1)
            return true;
        return false;
    }
    )
}
$(window).on('hashchange', ()=>{
    updateEnvModeParam();
    injectPlugin();
}
);
$(window).on('popstate', ()=>{
    updateEnvModeParam();
    injectPlugin();

}
);
// 注入逻辑结束

// 公用函数
function cc(...arg) {
    console.log(' ========= ');
    console.log('德鲁伊Plus[日志]：', ...arg);
    console.log(' ========= ');
}
function getQuery(url) {
    if (!url)
        url = document.location.href + '';
    let query = {};
    if (url.indexOf("?") != -1) {
        url = url.split("?")[1];
        let str = decodeURI(url);
        // 获取url中"?"符后的字串(包括问号)
        const pairs = str.split("&");
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split("=");
            query[pair[0]] = pair[1];
        }
    }
    return query;
    // 返回对象
}
function getPureUrl(url) {
    url += '';
    if (url.indexOf("?") != -1) {
        return url.split("?")[0];
    }
    return url
}
function getUrlWithParam(url, param) {
    let result = getPureUrl(url);
    result += '?'
    for (let name in param) {
        result += `${name}=${param[name]}&`
    }
    result = result.substring(0, result.length - 1);
    cc('result', result);
    return result;
}

var urlReplace = (find,target)=>{
    return document.location.href.replace(find, target)
}

var getUrlWithoutQueryCode = (url,param)=>{
    url = getPureUrl(url);
    delete param.queryCode;
    url = getUrlWithParam(url, param);
    return url;
}

var itemFn = {
    switchEnv: (targetEnv)=>{
        const ismoduleEdit = mode === 'sceneModuleEdit';
        if(ismoduleEdit){
            if(targetEnv == 'change'|| !moduleEditURLMap[url]){
                const targetUrl = prompt('请输入要切换对应环境的地址，只需设置一次即可存储双向跳转');
                moduleEditURLMap[url] =  targetUrl;
                moduleEditURLMap[targetUrl] = url;
            }
          jumpAndSave(moduleEditURLMap[url]);
          return;
        }
        let targetUrl;
        var param = getQuery(url);
        if (targetEnv == 'stable') {
            targetUrl = url.replace(urlEnvMap.prod, urlEnvMap.stable)
        }
        if (targetEnv == 'prod') {
            targetUrl = url.replace(urlEnvMap.stable, urlEnvMap.prod)
        }
        jumpAndSave(targetUrl);
    }
    ,
    switchMode: (targetMode)=>{
        var param = getQuery(url);
        const targetUrl = getUrlWithParam(location.origin + urlModeMap[targetMode], param);
        cc(targetUrl);
        jumpAndSave(targetUrl);
    }
    ,
    handlePublish: ()=>{
        var param = getQuery($('.ant-breadcrumb > span:nth-child(2) a').attr('href'));
        param.insiopPlusInfoModuleName = $('.ant-breadcrumb > span:last-child>span>span').text();
        const targetUrl = getUrlWithParam(location.origin + urlModeMap['sceneModule'], param);
        cc(targetUrl);
        jumpAndSave(targetUrl);
    }
}

var itemBuild = (type,options)=>{
    var temp;
    if (!options.id) {
        options.id = options.fnName
    }
    switch (type) {
    case 'btn':
        temp = `<button ##ID## ##CLASS##>${options.content}</button>`;
        temp = temp.replace('##ID##', `id="${options.id}"`).replace('##CLASS##', 'class="ant-btn ant-btn-primary insiop-plus-middle"');
        break;
    case 'state':
        temp = `<span class="ant-tag insiop-plus-tag ${options.color ? options.color : 'ant-tag-blue'}">${options.content}</span>${options.break ? '<br/>' : ''}`
        break;
    default:
    case 'select':
        temp = `<select ##ID##  ##CLASS## > ${options.options.map(item=>`<option value="${item.value}" ${item.value === options.default ? 'selected' : ''}>${item.label}</option>`).join('')}
                    </select>`;
        temp = temp.replace('##ID##', `id="${options.id}"`).replace('##CLASS##', 'class="ant-select-selection ant-select-selection--single insiop-plus-select"');
        break;
    }
    return [temp, {
        ...options,
        type
    }];
}

// 公用函数 结束

// 业务逻辑

var loadCss = ()=>{
    $('body').append(`<style id="insiop-plus-css">
    #insiop-plus-panel{
        height: 64px;
        width: 400px;
        background: #ffffff;
        border: #e4e3e3 solid 1px;
        padding: 13px;
        border-radius: 0 0 10px 10px;
        position: absolute;
        top: 0;
        right: 600px;
        z-index: 9999;
        display: flex;
        justify-content: center;
        flex-direction: row;
    }
    #insiop-plus-panel.stable{
        width: 500px;
    }
    #insiop-plus-entry{
        height: 20px;
        width: 20px;
        background: #ffffff;
        border: #f1a700 solid 1px;
        color: #f1a700;
        position: absolute;
        top: 0;
        right: 593px;
        text-align: center;
        line-height: 15px;
        z-index: 99999;
        cursor: pointer;
    }
    .insiop-plus-tag {
        height:20px;
    }
    .insiop-plus-select{
        margin-right:20px;
        min-width: 130px;
        align-self: center;
    }
    #insiop-plus-close{
        color: #333333;
        position: absolute;
        top: 0;
        right: 10px;
        cursor: pointer;
    }
    .insiop-plus-middle{
       align-self: center;
    }
    </style>`);
}

var loadPanel = ()=>{
    $('#insiop-plus-entry').remove();
    const ismoduleEdit = mode === 'sceneModuleEdit';
    const modeList = Object.keys(modeMap);
    const modeOptions = modeList.map(item=>{
        return {
            value: item,
            label: modeMap[item]
        }
    }
    );
    const envList = ismoduleEdit?['stable', 'prod','change']:['stable', 'prod'];
    const envOptions = envList.map(item=>{
        return {
            value: item,
            label: envMap[item]
        }
    }
    );

    const hasModuleEditMap = ismoduleEdit && url && !!moduleEditURLMap[url];
    const panelItems = [//         itemBuild('state',{content:modeMap[mode],color:'ant-tag-green'}),
    //         itemBuild('state',{content:envMap[env],break:true}),
    itemBuild('select', {
        fnName: 'switchMode',
        id: 'switchMode',
        options: modeOptions,
        default: mode
    }), itemBuild('select', {
        fnName: 'switchEnv',
        id: 'switchEnv',
        options: envOptions,
        default: env
    }),hasModuleEditMap? itemBuild('state',{
        content: '可切换',
        color:'ant-tag-green insiop-plus-middle',
    }) : ['', ''],
        env === 'stable' && ismoduleEdit ? itemBuild('btn', {
        content: '一键发布',
        fnName: 'handlePublish'
    }) : ['', ''], // itemBuild('btn',{content:'切换模式',fnName:'switchMode'}),
    ]
    const panelEl = panelItems.map(item=>item[0]);
    const isStable = env === 'stable';
    $('body').append(`<div id="insiop-plus-panel" class="${isStable ? 'stable' : ''}">${panelEl.join('')}<div id="insiop-plus-close">X</div></div>`)
    panelItems.map(item=>{
        let {id, fnName, type} = item[1];
        if (['btn'].includes(type)) {
            $('#' + id).click(itemFn[fnName])
        }
        ;if (['select'].includes(type)) {
            $('#' + id).change(function() {
                var value = $(this).children('option:selected').val();
                itemFn[fnName](value);
            });
        }

    }
    );
    $('#insiop-plus-close').click(()=>{
        $('#insiop-plus-panel').remove();
        $('body').append(`<div id="insiop-plus-entry">+</div>`);
        $('#insiop-plus-entry').click(loadPanel);
    }
    )

}
// 业务逻辑结束










