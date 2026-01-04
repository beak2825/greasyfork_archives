// ==UserScript==
// @name         小程序日志辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  小程序事件日志查询的辅助工具
// @author       Cme
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.19/lodash.js
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.8.32/dayjs.min.js
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @match        https://wedata.weixin.qq.com/*
// @match       https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @connect      *
// @run-at      context-menu
// @run-at      document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465652/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%97%A5%E5%BF%97%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/465652/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%97%A5%E5%BF%97%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
'use strict';
let style = `
.diy-tool {
	background: rgb(0,206,139);
	background: linear-gradient(90deg, rgba(0,206,139,1) 0%, rgba(0,212,255,1) 100%);
}
.flex-style {
	display: flex;
	align-items: center;
	justify-content: center;
}
.functions-list {
	justify-content: space-evenly;
	flex-flow: wrap;
}
.function-item {
	flex: 1;
	height: 50px;
	white-space: nowrap;
}
.result-content {
	max-height: 40vh;
}
.result-list {
	display: flex;
	flex-direction: column;
}
.json-document {
  padding: 1em 2em;
}
ul.json-dict, ol.json-array {
  list-style-type: none;
  margin: 0 0 0 1px;
  border-left: 1px dotted #ccc;
  padding-left: 2em;
}
.json-string {
  color: #0B7500;
}
.json-literal {
  color: #1A01CC;
  font-weight: bold;
}

/* Toggle button */
a.json-toggle {
  position: relative;
  color: inherit;
  text-decoration: none;
}
a.json-toggle:focus {
  outline: none;
}
a.json-toggle:before {
  font-size: 1.1em;
  color: #c0c0c0;
  content: "\\25BC";
  position: absolute;
  display: inline-block;
  width: 1em;
  text-align: center;
  line-height: 1em;
  left: -1.2em;
}
a.json-toggle:hover:before {
  color: #aaa;
}
a.json-toggle.collapsed:before {
  transform: rotate(-90deg);
}
a.json-placeholder {
  color: #aaa;
  padding: 0 1em;
  text-decoration: none;
}
a.json-placeholder:hover {
  text-decoration: underline;
}
.hidden {
	height: 0;
	padding: 0;
	overflow: hidden;
}
.config-content {
	flex-flow: wrap;
	flex-direction: column;
	align-items: flex-start;
}
.config-module::before {
    content: attr(data-title);
    position: absolute;
    top: -23px;
    font-weight: bold;
}
.config-module {
    flex: 1;
    flex-wrap: wrap;
    width: 100%;
    display: flex;
    background: rgb(0 206 139 / 10%);
    margin-top: 35px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    position: relative;
}
.config-items {
	min-height: 50px;
	width: 100%;
	justify-content: flex-start;
}
.config-title {
	font-weight: 600;
	margin-right: 20px;
	flex-shrink: 0;
	width: 98px;
	text-align: left;
}
.old-log {
    padding: 0!important;
    text-decoration: none;
}
.diy-page:hover .diy-page-img {
 display: flex
}
.diy-page-img {
    display:none;
    background: #10AEFF;
    position: absolute;
    width: 150px;
    height: 324px;
    left: calc(100% + 10px);
    padding: 4px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 4px;
    z-index:1;
}
.diy-page-img::after {
content: '';
width: 0;
height: 0;
border-right: 50px solid skyblue;
border-top: 50px solid transparent;
border-bottom: 50px solid transparent;
 position: absolute;
 left: -50px;
 top:50%;
 transform: translateY(-50%);
}
`
GM_addElement('script', {
	src: 'https://cdn.jsdelivr.net/npm/sweetalert2@11',
	type: 'text/javascript'
});
GM_addElement('link', {
	src: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
});
// GM_addElement(document.getElementsByTagName('HTML')[0], 'style', {
// 	textContent: style
// });
GM_addStyle(style);
let initSetting = {
	filters: {
		requestUrl: '', //统计接口请求次数的目标接口
		timeout: 5, // 统计接口请求耗时的预设值
		collapsed: false, // 格式化默认展开
		rootCollapsable: false, // 根层级默认展开
	},
	results: {
		jsonView: false, //是否展示json
	}
}
let filters = {},
	results = {};
let lock = null;
let HTML = "";
let traceInfo = {
    status: false, //是否生效
    startTraceId: "" // 初级traceId
}

function freshValue() {
   document.getElementsByClassName('wrap_3_H1pthMEy')[0] && (document.getElementsByClassName('wrap_3_H1pthMEy')[0].style.display = 'block');
	let storage = GM_getValue('setting');
	let res = (storage && JSON.parse(storage)) || initSetting; // 获取配置数据
	filters = res.filters;
	results = res.results;
    checkEnv();
}
// 添加入口按钮
function addButton() {
    checkEnv();
    GM_addElement(document.getElementById("realtime-query-panel").firstChild, 'button', {
        class: 'weui-desktop-btn weui-desktop-btn_primary diy-tool',
        textContent: '辅助工具',
        style: 'margin-left:20px'
    });
    let ele = document.getElementsByClassName('diy-tool')[0];
    ele.addEventListener("click", function() {
        // showSettingDialog()
        FunctionsPanel();
    })
}

function initListener() {
	let openid = document.getElementById('openid');
	let requestTime = document.getElementById('requestTime');
	let requestCount = document.getElementById('requestCount');
	let reg = document.getElementById('reg');
	let reset = document.getElementById('reset');
	let viewHistory = document.getElementById('viewHistory');

    openid?.addEventListener("click", function() {
		Swal.close();
		openIdResult();
	})
	requestTime?.addEventListener("click", function() {
		Swal.close();
		apiTime();
	})
	requestCount?.addEventListener("click", function() {
		Swal.close();
		apiCount();
	})
	reg?.addEventListener("click", function() {
		Swal.close();
		evalData();
	})
	reset?.addEventListener("click", function() {
		Swal.close();
		resets();
	})
    viewHistory?.addEventListener("click", function() {
		Swal.close();
		viewHistoryFun();
	})
}

function randomNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomColor(opacity = 1) {
	let min = 0;
	let max = 255;
	return `rgba(${randomNum(min,max)},${randomNum(min,max)},${randomNum(min,max)}, ${opacity})`
}
// 将数据json格式化
function dealJson(options) {
	let res = ''
	try {
		res = eval('(' + decodeURIComponent(options) + ')');
	} catch (err) {
		res = options
	}
	return res;
}
function iconType(typeTxt) {
    let Elements = {
        DF_enterEvent: '<svg class="icon" style="width: 2em;height: 2em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" p-id="1495"><path d="M835.584 63.488q26.624 0 49.664 10.24t40.448 27.648 27.648 40.448 10.24 49.664l0 641.024q0 26.624-10.24 49.664t-27.648 40.448-40.448 27.648-49.664 10.24l-448.512 0q-26.624 0-49.664-10.24t-40.448-27.648-27.648-40.448-10.24-49.664l0-192.512 128 0 0 192.512 448.512 0 0-641.024-448.512 0 0 192.512-128 0 0-192.512q0-26.624 10.24-49.664t27.648-40.448 40.448-27.648 49.664-10.24l448.512 0zM513.024 614.4q0-19.456-9.728-28.672t-24.064-9.216l-378.88 0q-14.336 0-25.088-7.68t-10.752-26.112l0-52.224q0-29.696 9.216-37.376t35.84-7.68l31.744 0q24.576 0 58.368 0.512t73.728 1.024 77.312 1.024 69.12 0.512l51.2 0q22.528 0 32.256-16.384t9.728-35.84l0-49.152q0-20.48 8.704-25.6t26.112 9.216 47.104 32.768 61.952 37.888 62.976 38.4 49.152 34.304q14.336 11.264 14.336 30.72t-11.264 28.672q-16.384 14.336-44.544 32.256t-59.392 36.864-60.928 37.376-48.128 33.792q-23.552 19.456-34.816 19.968t-11.264-30.208l0-49.152z" p-id="1496"></path></svg>',
        DF_elementClick: '<svg class="icon" style="width: 2em;height: 2em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" p-id="6497"><path d="M775.779 418.172l-2.051 0c-15.159 0-27.6 4.355-39.583 11.771-10.486-30.584-37.159-52.615-71.513-52.615-15.16 0-29.638 4.354-41.62 11.77-10.487-30.583-37.172-52.615-71.527-52.615-13.399 0-25.85 3.357-36.873 9.255l0-78.691c0-42.861-32.418-77.606-75.59-77.606-43.173 0-78.17 34.745-78.17 77.606l0 301.282-47.49-47.295c-30.528-30.306-84.558-25.992-110.55 0s-43.038 78.308-5.818 115.528l218.306 216.875c4.504 4.471 9.455 8.2 14.663 11.353 39.803 32.47 85.412 51.692 181.857 51.692 220.324 0 240.728-118.865 240.728-265.492L850.548 495.777C850.547 452.917 818.952 418.172 775.779 418.172zM809.403 650.988c0 124.069-0.593 224.647-199.585 224.647-84.298 0-134.907-18.796-173.246-56.858L229.904 613.455c-18.285-18.285-13.687-41.664 1.282-56.633 14.968-14.968 42.441-15.486 56.902-1.131 0 0 36.259 36.045 67.498 67.1 23.641 23.502 44.408 44.145 44.408 44.145l0-391.72c0-20.302 16.578-36.76 37.028-36.76 20.449 0 34.448 16.459 34.448 36.76l0 249.154 0.415 0c-0.27 1.32-0.415 2.685-0.415 4.085 0 11.278 9.21 20.423 20.571 20.423 11.36 0 20.57-9.144 20.57-20.423 0-1.4-0.144-2.765-0.415-4.085l0.415 0L512.611 422.257c0-20.302 14.795-36.761 35.245-36.761 0 0 36.232-0.49 36.232 36.761l0 134.787 0.415 0c-0.27 1.321-0.415 2.686-0.415 4.085 0 11.279 9.21 20.423 20.57 20.423 11.361 0 20.571-9.143 20.571-20.423 0-1.399-0.144-2.764-0.415-4.085l0.415 0 0-93.942c0-20.303 14.559-36.762 35.01-36.762 0 0 36.983 2.303 36.983 36.762l0 118.449 0.415 0c-0.269 1.32-0.415 2.686-0.415 4.085 0 11.279 9.21 20.423 20.571 20.423s20.055-9.143 20.055-20.423c0-1.399-0.136-2.765-0.392-4.085l0.392 0 0-80.872c0-20.302 15.255-36.761 35.704-36.761 0 0 35.851-1.45 35.851 36.761C809.403 500.679 809.403 617.954 809.403 650.988zM328.307 382.755l0-68.631c-6.531-14.641-10.24-30.817-10.24-47.884 0-65.037 52.723-117.76 117.76-117.76s117.76 52.723 117.76 117.76c0 8.884-1.05 17.509-2.935 25.82 14.812 0.578 28.176 6.726 37.904 16.597 3.771-13.518 5.99-27.685 5.99-42.417 0-87.658-71.062-158.72-158.72-158.72s-158.72 71.062-158.72 158.72C277.107 312.36 296.898 353.755 328.307 382.755z" p-id="6498"></path></svg>',
        DF_exposureEvent: '<svg class="icon" style="width: 2em;height: 2em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" p-id="11915"><path d="M819.2 341.333333a34.133333 34.133333 0 0 1 34.133333 34.133334v375.466666a34.133333 34.133333 0 0 1-34.133333 34.133334H204.8a34.133333 34.133333 0 0 1-34.133333-34.133334V375.466667a34.133333 34.133333 0 0 1 34.133333-34.133334h34.133333v-34.133333a34.133333 34.133333 0 0 1 34.133334-34.133333h85.333333a34.133333 34.133333 0 0 1 34.133333 34.133333v34.133333h153.6l13.448534-58.811733A34.133333 34.133333 0 0 1 592.861867 256h179.626666a34.133333 34.133333 0 0 1 33.28 26.5216L819.2 341.333333z m0 358.4H597.333333a17.066667 17.066667 0 0 1 0-34.133333h221.866667v-51.2H648.533333a17.066667 17.066667 0 0 1 0-34.133333h170.666667V392.533333a17.066667 17.066667 0 0 0-17.066667-17.066666H221.866667a17.066667 17.066667 0 0 0-17.066667 17.066666v341.333334a17.066667 17.066667 0 0 0 17.066667 17.066666h580.266666a17.066667 17.066667 0 0 0 17.066667-17.066666v-34.133334zM290.133333 307.2a17.066667 17.066667 0 0 0-17.066666 17.066667v17.066666h85.333333v-17.066666a17.066667 17.066667 0 0 0-17.066667-17.066667h-51.2z m319.488-17.066667a17.066667 17.066667 0 0 0-16.1792 11.6736L580.266667 341.333333h204.8l-13.175467-39.5264a17.066667 17.066667 0 0 0-16.196267-11.6736h-146.056533zM426.666667 699.733333a136.533333 136.533333 0 1 1 0-273.066666 136.533333 136.533333 0 0 1 0 273.066666z m0-68.266666a68.266667 68.266667 0 1 0 0-136.533334 68.266667 68.266667 0 0 0 0 136.533334z m256-221.866667h85.333333a17.066667 17.066667 0 0 1 17.066667 17.066667v17.066666a17.066667 17.066667 0 0 1-17.066667 17.066667h-85.333333a17.066667 17.066667 0 0 1-17.066667-17.066667v-17.066666a17.066667 17.066667 0 0 1 17.066667-17.066667z" fill="#D8D8D8" p-id="11916"></path></svg>',
        DF_pageView: '<svg class="icon" style="width: 2em;height: 2em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1042 1024" version="1.1" p-id="24825"><path d="M581.632 697.344l126.976 0 0 194.56q0 33.792-10.24 58.88t-27.136 40.96-39.424 23.552-48.128 7.68l-452.608 0q-24.576 0-48.128-9.728t-41.472-27.136-29.184-40.96-11.264-52.224l0-706.56q0-24.576 11.776-47.104t30.208-39.936 40.96-28.16 45.056-10.752l449.536 0q26.624 0 50.176 11.776t41.472 29.696 28.16 40.448 10.24 44.032l0 188.416-126.976 0 1.024-195.584-452.608 0-1.024 713.728 452.608 0 0-195.584zM1021.952 505.856q37.888 30.72 2.048 60.416-20.48 15.36-44.544 37.888t-50.176 46.592-51.712 47.616-47.104 40.96q-23.552 18.432-40.448 18.432t-16.896-24.576q2.048-14.336 0.512-35.84t-1.536-36.864q0-17.408-12.288-21.504t-29.696-4.096l-40.96 0-62.464 0q-34.816 0-73.216-0.512t-73.216-0.512l-62.464 0-41.984 0q-8.192 0-17.92-1.536t-17.408-6.656-12.288-14.336-4.608-23.552q0-19.456-0.512-46.08t0.512-47.104q0-27.648 13.312-37.888t43.008-9.216l33.792 0 59.392 0q32.768 0 70.144 0.512t71.168 0.512l61.44 0 38.912 0q25.6 1.024 43.52-4.096t17.92-22.528q0-14.336 1.024-32.256t1.024-32.256q0-23.552 12.8-29.696t32.256 9.216q19.456 16.384 45.568 38.4t52.736 45.056 52.736 45.568 47.616 39.936z" p-id="24826"></path></svg>',
        DF_behavior: '<svg class="icon" style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7789"><path d="M992.544 595.296a31.968 31.968 0 0 0-45.248 0l-201.376 201.376-95.04-95.04a31.968 31.968 0 1 0-45.248 45.248l117.664 117.664a31.968 31.968 0 0 0 45.248 0l224-224a31.968 31.968 0 0 0 0-45.248zM800 352a32 32 0 0 0-32-32H256a32 32 0 0 0 0 64h512a32 32 0 0 0 32-32zM256 544a32 32 0 0 0 0 64h288a32 32 0 0 0 0-64H256zM771.104 928H195.04C175.904 928 160 911.68 160 891.072V132.928C160 112.32 175.904 96 195.04 96h633.92C848.096 96 864 112.32 864 132.928v350.528a32 32 0 0 0 64 0V132.928C928 77.376 883.84 32 828.96 32H195.04C140.16 32 96 77.376 96 132.928v758.144C96 946.624 140.16 992 195.04 992h576.064a32 32 0 0 0 0-64z" p-id="7790"></path></svg>'
    }
    return Elements[typeTxt];
}
var richPageName = ({path, name}) => {
    if(!__PG_RMK__?.[path]?.remark_url) return name  || '';
   return`<div class="weui-desktop-popover__wrp" extclass="img-preview" style="display: inline-block;">
    <span class="diy-page" style="position: relative">
            <div style="color: rgb(87, 107, 149);" class="diy-page-name">${name}</div>
            <img src="${__PG_RMK__[path].remark_url}" class="diy-page-img">
    </span>
</div>`
}
// 摘捡需要的字段数据
function pickData({track_type, track_datas, track_timestamp}) {
    let str = ''
    let {df_pagename, df_pageUrl, df_prepagename, df_prepageUrl, df_modulename, df_elementname} = track_datas;
    let types = {
        "DF_enterEvent": "进入了",
        "DF_elementClick": "点击了",
        "DF_pageView": "离开了",
        "DF_exposureEvent": "曝光了",
         "DF_behavior": "执行了"
    }
    if(track_type == "DF_enterEvent" ){
        if(df_prepageUrl) str += richPageName({name:df_prepagename,path:df_prepageUrl});
        else str += `<span title="${divTitle(track_datas)}">启动小程序</span>`
        str += `<span title="${divTitle(track_datas)}">${types[track_type]}</span>` + richPageName({name:df_pagename,path:df_pageUrl})
    }else if( track_type == "DF_pageView" ){
         str += `<span title="${divTitle(track_datas)}">${types[track_type]}</span>` + richPageName({name:df_pagename,path:df_pageUrl})
    }else {
        str += richPageName({name:df_pagename,path:df_pageUrl}) + `<span title="${divTitle(track_datas)}">${types[track_type] + (df_modulename ? df_modulename + "模块" : "") + (df_modulename && df_elementname ? "下的" : "") + (df_elementname ? "元素：" + df_elementname : "")}</span>`
    }

    return{
        "icon": iconType(track_type),
        "text": str,
        "事件类型：": track_type,
        "timestamp": track_timestamp,
        "当前页面路径：": df_pageUrl,
        "当前页面名称：": df_pagename,
        "上页面路径：": df_prepageUrl,
        "上页面名称：": df_prepagename,
        "模块名称：": df_modulename,
        "元素名称：": df_elementname,
        "datas": track_datas
    }
}
function divTitle(datas){
    let result = []
    for(let item in datas){
        result.push(`${item}--->>>${datas[item]}`)
    }
    return result.join("\n")
}
// 有traceId的时候的处理方案
// function formatToTree(ary, pid, pidName = 'parentId') {
//     return ary.filter((item) => {
//         return pid === undefined ? item.track_parentid === "" : item.track_parentid === pid
//     }).map((item) => {
//         item.children = formatToTree(ary, item.track_trace);
//         return item;
//     })
// }
function formatToTree(ary, pid, pidName = 'track_parentid') {
    return ary.filter((item) => item[pidName] === pid).map((item) => {
        item.children = formatToTree(ary, item.track_trace);
        return item;
    });
}
function test(e){
    console.log(e)
}
// 有traceId的时候html处理
function traceWhitHtml(list, str = ''){
    if(list.length == 0){
        return str;
    }else if(list.length ==1){
        let {icon, text, datas} = pickData(list[0]);
        str += `<div class="trace-items">${icon}${text}</div>`
        return traceWhitHtml(list[0].children, str);
    }else {
        list = list.sort((a,b) => new Date(a.track_timestamp || a.track_datas.df_activitytime).getTime() - new Date(b.track_timestamp || b.track_datas.df_activitytime).getTime())
        for(let ii of list){
            let {icon, text, datas} = pickData(ii);
          str += `<div class="trace-item" data-time="${datas.df_activitytime}">${icon}${text}
           ${traceWhitHtml(ii.children)}
          </div>`
        }
       return str;
    }
}
// 没有traceId的时候的处理方案
function dealDataWithoutTraceid(keys, viewObj){
    let HTML_Str = "";
    keys = keys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    for(let key of keys){
        HTML_Str += `<div class="history-time" style="background:${randomColor()}">${key}</div>`
        let list = viewObj[key]?.sort((a,b)=> new Date(a.timestamp ? parseInt(a.timestamp) : a.datas.df_activitytime).getTime() - new Date(b.timestamp ? parseInt(b.timestamp) : b.datas.df_activitytime).getTime());
        for(let item of list){
            let {icon, text, datas, timestamp} = item;
            HTML_Str += `<div class="history-items">${icon}${text}</div>`
        }
    }
    return `<div class="trace-items">${HTML_Str}</div>`;
}
// 梳理用户浏览足迹，仅仅针对埋点类型数据
function viewHistoryFun() {
    let datas = document.getElementsByClassName("logitem_3jpgWXCKDU") || [];
    let viewObj = {};
    let keys = [];
    let tempList = [];
    let hasTraceId = traceInfo.status;
    let HTML_Str = ""
    for (let items of datas) {
        // 过滤异常值已经非埋点类型数据
		if (items.innerHTML == " event_value ") continue;
		let {
			wxdata_perf_extra_info1, // 请求入参等信息
			wxdata_perf_extra_info2, // 返回体
			wxdata_perf_extra_info3, // 设备、场景、用户基础信息等等
            track_datas,// 埋点数据
            track_platform,//埋点平台
            track_env,//埋点环境
            track_type, //埋点事件类型
            track_trace,// traceId
            track_parentid,//父级traceId
            track_timestamp//毫秒级时间戳
		} = dealJson(items.innerHTML);
		if (!track_type) continue;
        !track_trace && (hasTraceId = false);
        try{
         if(track_datas){
             // 格式化完整数据
             track_datas = dealJson(track_datas);
             // traceId情况下的数据收集；一旦发现没有traceId，仅使用老版本方式进行足迹排序
             hasTraceId && tempList.push({
                 track_datas,// 埋点数据
                 track_platform,//埋点平台
                 track_env,//埋点环境
                 track_type, //埋点事件类型
                 track_trace,
                 track_parentid,
                 track_timestamp
             });
             // 没有traceId情况下收集数据
             !keys.includes(track_datas.df_activitytime) && keys.push(track_datas.df_activitytime);
             if(!viewObj[track_datas.df_activitytime]) viewObj[track_datas.df_activitytime] = [pickData({track_type, track_datas,track_timestamp})]
             else viewObj[track_datas.df_activitytime].push(pickData({track_type, track_datas,track_timestamp}));
         }
        }catch(err){}
    }
    if(hasTraceId){
        let resultList = formatToTree(tempList, traceInfo.startTraceId);
        console.log(resultList)
        HTML_Str = resultList.length<= 1 ? `<div class="trace-item">${traceWhitHtml(resultList)}</div>` : traceWhitHtml(resultList);
    }else {
        if(traceInfo.status) window.alert("因部分记录缺失traceId，本次改用事件时间排序");
        HTML_Str = dealDataWithoutTraceid(keys, viewObj);
    }
    let style = `
    .history-popop {
        width:80%
    }
    .history-content {
        height: 60vh;
        width:100%;
        text-align: left;
        display: flex;
        justify-content: space-between;
        overflow-x:auto
    }
    .history-time {
    color: white;
    font-size: 20px;
    border-radius: 10px;
    padding: 0 10px;
    width: fit-content;
    }
    .history-items {
       margin-left: 20px;
       line-height: 25px;
    }
    .trace-item::before{
    content: attr(data-time);
    }
    .trace-item {
    display: flex;
    min-width: 45%;
    flex-direction: column;
    }
    .trace-items {

    }
	`
    GM_addStyle(style)
	Swal.fire({
		title: `浏览足迹（部分顺序会有异常）`,
		showClass: {
			popup: 'animate__animated animate__fadeInDown history-popop'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp'
		},
		html: `
		<div class="history-content">
			${HTML_Str}
		</div>
		`,
		showDenyButton: true,
		denyButtonText: `返回`,
		confirmButtonText: '关闭'
	}).then((result) => {
		if (result.isDenied) {
			FunctionsPanel()
		}
	});
}
// 将数据折叠
function evalData() {
	let datas = document.getElementsByClassName("logitem_3jpgWXCKDU") || [];
    let index = 0;
    let viewObj = {}
	for (let items of datas) {
        index ++;
		if (items.innerHTML == " event_value ") continue;
		let {
			wxdata_perf_extra_info1, // 请求入参等信息
			wxdata_perf_extra_info2, // 返回体
			wxdata_perf_extra_info3, // 设备、场景、用户基础信息等等
            track_datas,// 埋点数据
            track_platform,//埋点平台
            track_env,//埋点环境
            track_type, //埋点事件类型
            track_parentid,//父traceid
            track_trace, //traceid
            track_timestamp, //事件时间戳
		} = dealJson(items.innerHTML);
		try {
            if(track_datas){
                track_datas = dealJson(track_datas);
                // 根据时间排列
                let className = "json-" + new Date(track_datas.df_activitytime).getTime() + '-' + index ;
                let element = document.getElementsByClassName(className);
                if (element && element.length) {
                    element[0].setAttribute("class", className + ' json-document');
                } else {
                    let ele = document.createElement("div");
                    ele.className = className;
                    items.parentNode.appendChild(ele);
                    $("." + className).jsonViewer({
                        track_parentid,
                        track_trace,
                        track_platform,
                        track_env,
                        track_type,
                        track_datas,
                        track_timestamp
                    },{
                        collapsed: false,
                        rootCollapsable: false,
                    });
                }
            }else if(wxdata_perf_extra_info1){
                let requestInfo = {},responseInfo = {},baseInfo = {};
                wxdata_perf_extra_info1.split("#").map(item => {
                    let index = item.indexOf("=");
                    let key = item.slice(0, index);
                    let val = dealJson(item.slice(index + 1, item.length));
                    item && (requestInfo[key] = val);
                });
                responseInfo = dealJson(wxdata_perf_extra_info2);
                wxdata_perf_extra_info3.split("#").map(item => {
                    let index = item.indexOf("=");
                    let key = item.slice(0, index);
                    let val = dealJson(item.slice(index + 1, item.length));
                    item && (baseInfo[key] = val);
                });
                let className = "json-" + baseInfo.timestamp;
                let element = document.getElementsByClassName(className);
                if (element && element.length) {
                    element[0].setAttribute("class", className + ' json-document');
                } else {
                    let ele = document.createElement("div");
                    ele.className = className;
                    items.parentNode.appendChild(ele);
                    $("." + className).jsonViewer({
                        requestInfo,
                        responseInfo,
                        baseInfo
                    });
                }
            }
			items.setAttribute("class", "logitem_3jpgWXCKDU hidden");
		} catch (err) {}
	}
}
// 重置数据展示方式
function resets() {
	let datas = document.getElementsByClassName("logitem_3jpgWXCKDU") || [];
	for (let items of datas) {
		items.setAttribute("class", "logitem_3jpgWXCKDU");
		let jsonClass = items.parentElement.lastElementChild.getAttribute("class");
		if (jsonClass.indexOf("json-document") >= 0 && jsonClass.indexOf("hidden") < 0) {
			items.parentElement.lastElementChild.setAttribute("class", jsonClass + " hidden")
		}
		// let nodes = items.parentNode.childNodes;
		// if(nodes.length > 1){
		// 	items.parentNode.removeChild(nodes[1]);
		// }
	}
}
// 统计接口耗时
function apiTime() {
	var datas = document.getElementsByClassName("logitem_3jpgWXCKDU") || [];
	let time = filters.timeout || 5;
	let HTML_Str = '';
	let count = 0;
	for (let item of datas) {
		let list = [];
		let info = '';
		if (item.innerHTML !== ' event_value ') {
			item.innerHTML.replace(/(#timestamp=|requestTimeStamp":)[0-9]+\d/g, (res) => {
				list.push(res.split(list.length ? ":" : "=")[1])
			})
			if (list[1] && list[0]) {
				let num = Math.abs((list[0] - list[1])) / 1000
				if (num >= time) {
					item.innerHTML.replace(/(#requestUrl=)[0-9a-zA-Z:\/\/.]*/g, (r1) => {
						info = r1.split("=")[1]
					})
					let openid = item.parentNode.parentElement.parentNode.firstChild.getElementsByClassName(
						"openid_1UqzQDgj70")[0].firstChild.innerHTML
					let T = new Date(parseInt(list[0]));
					HTML_Str += `
						<div class="api-result" style="background:${randomColor(0.4)}">
							<div class="api-name flex-style">${info.replace("https://m.dongfangfuli.com", "")}</div>
							<div class="api-times flex-style">
								<div class="api-times-items"><span class="time-span">请求时间</span>${list[0]}</div>
								<div class="api-times-items"><span class="time-span">响应时间</span>${list[1]}</div>
								<div class="api-times-items"><span class="time-span">记录时间</span>${T.getHours()}:${T.getMinutes()}</div>
								<div class="api-times-items"><span class="time-span">请求耗时</span>${num}</div>
							</div>
						</div>
					`
					count++;
				}
			}
		}
	};
	let style = `
	.api-result {
		user-select: text;
		border-radius: 10px;
		margin-bottom: 10px;
	}
	.api-openid {
		display: flex;
		padding: 0 20px;
		margin: 10px 0;
	}
	.api-name {
		height:50px
	}
	.api-times {

	}
	.api-times-items {

	}
	.time-span {
		font-weight: 600
	}
	.local {
		flex:1
	}
	`
	GM_addStyle(style)
	Swal.fire({
		title: `不小于${time}秒有${count}条请求记录`,
		showClass: {
			popup: 'animate__animated animate__fadeInDown'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp'
		},
		html: `
		<div class="result-content">
			<div class="result-list">
			${HTML_Str}
			</div>
		</div>
		`,
		showDenyButton: true,
		denyButtonText: `返回`,
		confirmButtonText: '关闭'
	}).then((result) => {
		if (result.isDenied) {
			FunctionsPanel()
		}
	});
}
// 统计openid
function openIdResult() {
	var objs = {};
	var lists = document.getElementsByClassName("openid_1UqzQDgj70");
	for (let i of lists) {
		let key = i.firstChild.innerHTML
		if (key && key != 'openid') {
			if (objs[key]) objs[key]++;
			else objs[key] = 1
		}
	}
	let num = 0;
    let consoleStr = '';
	let HTML_str = '';
	for (let it in objs) {
        consoleStr += it + '<br/>'
		num++
		HTML_str += `
		<div class="openid-items flex-style" style="color:${randomColor()};order:-${objs[it]}">
			<div class="openid-key">${it}</div>
			<div class="openid-num">${objs[it]}</div>
		</div>`
	}
	let style = `
	.openid-items {
		height: 30px;
		justify-content: space-between;
	}
	.openid-key {
		font-size: 20px;
		font-weight: 600;
		user-select: text
	}
	.openid-num {
		font-size: 20px;
		font-weight: 600;
	}
	`
	GM_addStyle(style)
	Swal.fire({
		title: `共计${num}人、次`,
		showClass: {
			popup: 'animate__animated animate__fadeInDown'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp'
		},
		html: `
		<div class="result-content">
			<div class="result-list">
			${HTML_str}
			</div>
		</div>
		`,
		showDenyButton: true,
		denyButtonText: `返回`,
		confirmButtonText: '关闭'
	}).then((result) => {
		if (result.isDenied) {
			FunctionsPanel()
		}
	})
}
// 统计接口调用次数
function apiCount() {
	var datas = document.getElementsByClassName("logitem_3jpgWXCKDU") || [];
	let apis = {};
	let count = 0;
	let HTML_Str = '';
	for (let item of datas) {
		let url = '';
		if (item.innerHTML !== ' event_value ') {
			item.innerHTML.replace(/(#requestUrl=)[0-9a-zA-Z:\/\/.]*/g, (r1) => {
				url = r1.split("=")[1]
			})
			if (!filters.requestUrl || (filters.requestUrl && filters.requestUrl == url)) {
				let openid = item.parentNode.parentElement.parentNode.firstChild.getElementsByClassName(
					"openid_1UqzQDgj70")[0].firstChild.innerHTML;
				if (apis[url]) {
					apis[url].push(openid)
				} else {
					apis[url] = [openid]
				}
			}
		}
	};
	for (let item in apis) {
		count++;
		HTML_Str += `
		<div class="api-count-result" style="background:${randomColor(0.4)}">
			<div class="api-count-name flex-style">${item}</div>
			<div class="api-count-times flex-style">
				<div class="api-count-times-items"><span class="time-count-span">请求次数：</span>${apis[item].length}</div>
				<div class="api-count-times-items"><span class="time-count-span">请求人数：</span>${Array.from(new Set(apis[item])).length}</div>
			</div>
		</div>
		`
	}
	let style = `
	.api-count-result {
		user-select: text;
		border-radius: 10px;
		margin-bottom: 10px;
		padding: 10px;
	}
	.api-count-openid {
		display: flex;
		padding: 0 20px;
		margin: 10px 0;
	}
	.api-count-name {
		height:50px
	}
	.api-count-times {

	}
	.api-count-times-items {
		margin-right: 20px;
	}
	.time-count-span {
		font-weight: 600
	}
	`
	GM_addStyle(style)
	Swal.fire({
		title: filters.requestUrl ? filters.requestUrl + ' 接口请求记录' : count + '个接口请求记录',
		showClass: {
			popup: 'animate__animated animate__fadeInDown'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp'
		},
		html: `
		<div class="result-content">
			<div class="result-list">
			${HTML_Str}
			</div>
		</div>
		`,
		showDenyButton: true,
		denyButtonText: `返回`,
		confirmButtonText: '关闭'
	}).then((result) => {
		if (result.isDenied) {
			FunctionsPanel()
		}
	});
}
// 功能面板
function FunctionsPanel() {
	let token = GM_getValue('token');
	let element = "";
	if (token) {
		// element = `<a href="https://mp.weixin.qq.com/wxamp/userlog/list?token=${token}&lang=zh_CN" target="_blank" class="function-item swal2-confirm swal2-styled old-log flex-style">老版本日志</a>`
	}
	Swal.fire({
		// title: "功能类目",
		html: `
			  <div class="flex-style functions-list">
				<button type="button" class="function-item swal2-confirm swal2-styled" id="openid">统计openid</button>
                ${HTML}
				<button type="button" class="function-item swal2-confirm swal2-styled" id="reg">格式化数据</button>
				<button type="button" class="function-item swal2-confirm swal2-styled" id="reset">重置</button>
                ${element}
			  </div>
			`,
		showCancelButton: true,
		cancelButtonText: '关闭',
		confirmButtonText: '配置'
	}).then(({
		isConfirmed,
		isDismissed
	}) => {
		isConfirmed && showSettingDialog()
	});
	initListener();
}
// 设置面板
function showSettingDialog() {
	Swal.fire({
		title: "配置信息",
		html: `
			<div class="config-content flex-style">
               <div class="config-module" data-title="接口操作">
                  <div class="flex-style config-items">
                       <span class="config-title">目标接口：</span>
                       <textarea id="requestUrl" rows="5" cols="60" style="display: flex">${filters.requestUrl}</textarea>
                  </div>
                  <div class="flex-style config-items">
                       <span class="config-title">超时阈值：</span>
                       <input id="timeout" value="${filters.timeout}" type="number" label="timeout" name="timeout" style="width:50px;display: flex" />秒
                  </div>
               </div>
               <div class="config-module" data-title="数据格式化">
                  <div class="flex-style config-items">
                       <span class="config-title">根节点：</span>
                       <select id="rootCollapsable">
                           <option value="0">展开</option>
                           <option value="1">折叠</option>
                       </select>
                  </div>
                  <div class="flex-style config-items"> <span class="config-title">子节点：</span>
                       <select id="collapsed">
                           <option value="0">展开</option>
                           <option value="1">折叠</option>
                       </select>
                  </div>
               </div>
               <div class="config-module" data-title="浏览足迹">
                  <div class="flex-style config-items">
                       <span class="config-title">TraceId追踪：</span>
                       <select id="useTraceId">
                           <option value="0">不启用</option>
                           <option value="1">启用</option>
                       </select>
                  </div>
                  <div class="flex-style config-items">
                       <span class="config-title">初始TraceId：</span>
                       <input id="parentTraceId" value="${traceInfo.startTraceId}" type="text" placeholder="仅traceId启用追踪时可用" label="parentTraceId" name="parentTraceId" style="width:200px;display: flex" />
                  </div>
               </div>
			</div>
			`,
		confirmButtonText: "保存"
	}).then(({
		isConfirmed,
		isDismissed
	}) => {
		if (isConfirmed) {
			let requestUrl = document.getElementById("requestUrl").value;
			let timeout = document.getElementById("timeout").value || filters.timeout || 5;
			let collapsed = Boolean(Number(document.getElementById("collapsed").value));
			let rootCollapsable = Boolean(Number(document.getElementById("rootCollapsable").value));
            let useTraceId = Boolean(Number(document.getElementById("useTraceId").value));
			let parentTraceId = document.getElementById("parentTraceId").value || "";
			let res = {
				filters: {
					requestUrl,
					timeout,
					collapsed,
					rootCollapsable
				},
				results: filters.results
			}
			GM_setValue('setting', JSON.stringify(res));
           traceInfo. status = useTraceId;
           traceInfo. startTraceId = parentTraceId;
			freshValue();
			FunctionsPanel();
		}
	});
	let collapsed = filters.collapsed ? "1" : "0";
	let rootCollapsable = filters.rootCollapsable ? "1" : "0";
	let useTraceId = traceInfo. status ? "1" : "0";
	$("#collapsed").find(`option[value='${collapsed}']`).attr("selected", true);
	$("#rootCollapsable").find(`option[value='${rootCollapsable}']`).attr("selected", true);
	$("#useTraceId").find(`option[value='${useTraceId}']`).attr("selected", true);
}
function checkEnv(){
    let queryBtn = document.getElementById("realtime-query-panel").firstChild.firstChild;
    queryBtn?.addEventListener("click", function() {
        HTML = '';
        let openid = document.getElementsByClassName('weui-desktop-form__input')[7].value;
        let type = document.getElementsByClassName('weui-desktop-form__dropdown__search')[2].value.replace(/[\n|\t| ]/g, '')
        if(type == '基础监控'){
            HTML += `<button type="button" class="function-item swal2-confirm swal2-styled" id="requestTime">统计接口耗时(>=${filters.timeout})秒</button>
				<button type="button" class="function-item swal2-confirm swal2-styled" id="requestCount">统计接口调用次数</button>`
        }else if(openid && type == '埋点'){
            HTML += `<button type="button" class="function-item swal2-confirm swal2-styled" id="viewHistory">浏览足迹</button>`
        }
    })
}
// 初始化
function start() {
	if (lock) return;
	lock = setTimeout(() => {
		clearTimeout(lock);
		lock = null;
		freshValue();
		addButton();
		JsonFun();
	}, 1000);
}

let old = history.pushState
history.pushState = function(...arg) {
	if (arg && arg.length && arg.length > 2 && (arg[2] == '/mp2/realtime-log/data' || arg[2] == '/mp2/report-manage/event/event_monitor')) {
		start();
	}
	return old.call(this, ...arg)
}
let url = location.href;
let token = new URL(url).searchParams.get("token");
if (token) GM_setValue('token', token);
if (url == 'https://wedata.weixin.qq.com/mp2/realtime-log/data' || url.indexOf('https://wedata.weixin.qq.com/mp2/report-manage/event/event_monitor') >= 0) {
	start();
}

function JsonFun() {

	/**
	 * Check if arg is either an array with at least 1 element, or a dict with at least 1 key
	 * @return boolean
	 */
	function isCollapsable(arg) {
		return arg instanceof Object && Object.keys(arg).length > 0;
	}

	/**
	 * Check if a string looks like a URL, based on protocol
	 * This doesn't attempt to validate URLs, there's no use and syntax can be too complex
	 * @return boolean
	 */
	function isUrl(string) {
		var protocols = ['http', 'https', 'ftp', 'ftps'];
		for (var i = 0; i < protocols.length; ++i) {
			if (string.startsWith(protocols[i] + '://')) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Return the input string html escaped
	 * @return string
	 */
	function htmlEscape(s) {
        return s;
		return s.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/'/g, '&apos;')
			.replace(/"/g, '&quot;');
	}

	/**
	 * Transform a json object into html representation
	 * @return string
	 */
	function json2html(json, options) {
		var html = '';
		if (typeof json === 'string') {
			// Escape tags and quotes
			json = htmlEscape(json);

			if (options.withLinks && isUrl(json)) {
				html += '<a href="' + json + '" class="json-string" target="_blank">' + json + '</a>';
			} else {
				// Escape double quotes in the rendered non-URL string.
				json = json.replace(/&quot;/g, '\\&quot;');
				html += '<span class="json-string">"' + json + '"</span>';
			}
		} else if (typeof json === 'number' || typeof json === 'bigint') {
			html += '<span class="json-literal">' + json + '</span>';
		} else if (typeof json === 'boolean') {
			html += '<span class="json-literal">' + json + '</span>';
		} else if (json === null) {
			html += '<span class="json-literal">null</span>';
		} else if (json instanceof Array) {
			if (json.length > 0) {
				html += '[<ol class="json-array">';
				for (var i = 0; i < json.length; ++i) {
					html += '<li>';
					// Add toggle button if item is collapsable
					if (isCollapsable(json[i])) {
						html += '<a href class="json-toggle"></a>';
					}
					html += json2html(json[i], options);
					// Add comma if item is not last
					if (i < json.length - 1) {
						html += ',';
					}
					html += '</li>';
				}
				html += '</ol>]';
			} else {
				html += '[]';
			}
		} else if (typeof json === 'object') {
			// Optional support different libraries for big numbers
			// json.isLosslessNumber: package lossless-json
			// json.toExponential(): packages bignumber.js, big.js, decimal.js, decimal.js-light, others?
			if (options.bigNumbers && (typeof json.toExponential === 'function' || json.isLosslessNumber)) {
				html += '<span class="json-literal">' + json.toString() + '</span>';
			} else {
				var keyCount = Object.keys(json).length;
				if (keyCount > 0) {
					html += '{<ul class="json-dict">';
					for (var key in json) {
						if (Object.prototype.hasOwnProperty.call(json, key)) {
							// define a parameter of the json value first to prevent get null from key when the key changed by the function `htmlEscape(key)`
							let jsonElement = json[key];
							key = htmlEscape(key);
							var keyRepr = options.withQuotes ?
								'<span class="json-string">"' + key + '"</span>' : key;

							html += '<li>';
							// Add toggle button if item is collapsable
							if (isCollapsable(jsonElement)) {
								html += '<a href class="json-toggle">' + keyRepr + '</a>';
							} else {
								html += keyRepr;
							}
							html += ': ' + json2html(jsonElement, options);
							// Add comma if item is not last
							if (--keyCount > 0) {
								html += ',';
							}
							html += '</li>';
						}
					}
					html += '</ul>}';
				} else {
					html += '{}';
				}
			}
		}
		return html;
	}

	/**
	 * jQuery plugin method
	 * @param json: a javascript object
	 * @param options: an optional options hash
	 */
	$.fn.jsonViewer = function(json, options) {
		// Merge user options with default options
		options = Object.assign({}, {
			collapsed: filters.collapsed,
			rootCollapsable: filters.rootCollapsable,
			withQuotes: false,
			withLinks: true,
			bigNumbers: false
		}, options);

		// jQuery chaining
		return this.each(function() {

			// Transform to HTML
			var html = json2html(json, options);
			if (options.rootCollapsable && isCollapsable(json)) {
				html = '<a href class="json-toggle"></a>' + html;
			}

			// Insert HTML in target DOM element
			$(this).html(html);
			$(this).addClass('json-document');

			// Bind click on toggle buttons
			$(this).off('click');
			$(this).on('click', 'a.json-toggle', function() {
				var target = $(this).toggleClass('collapsed').siblings(
					'ul.json-dict, ol.json-array');
				target.toggle();
				if (target.is(':visible')) {
					target.siblings('.json-placeholder').remove();
				} else {
					var count = target.children('li').length;
					var placeholder = count + (count > 1 ? ' items' : ' item');
					target.after('<a href class="json-placeholder">' + placeholder + '</a>');
				}
				return false;
			});

			// Simulate click on toggle button when placeholder is clicked
			$(this).on('click', 'a.json-placeholder', function() {
				$(this).siblings('a.json-toggle').click();
				return false;
			});

			if (options.collapsed == true) {
				// Trigger click to collapse all nodes
				$(this).find('a.json-toggle').click();
			}
		});
	};
};