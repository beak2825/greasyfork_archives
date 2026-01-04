"use strict";
// ==UserScript==
// @name         斗鱼导出送礼记录
// @namespace    https://github.com/qianjiachun
// @version      2021.04.16.01
// @description  导出送礼记录
// @author       小淳
// @match			*://www.douyu.com/member/cp/*
// @require         https://lib.baomitu.com/xlsx/0.16.4/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/410748/%E6%96%97%E9%B1%BC%E5%AF%BC%E5%87%BA%E9%80%81%E7%A4%BC%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/410748/%E6%96%97%E9%B1%BC%E5%AF%BC%E5%87%BA%E9%80%81%E7%A4%BC%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    if (String(window.location.href).indexOf("get_gift_consume") != -1) {
        initConsume();
    } else {
        initProp();
    }
    
})()

function initConsume() {
    initStyles()
    initStylesChange();
    initYuchi();
    initYuwan();
}

function initProp() {
    initStyles()
    initStylesChange();
    initDaoju();
}

function initStyles() {
    let style = document.createElement("style");
    style.appendChild(document.createTextNode(`
    .export-button {
        position: absolute;
        display: inline-block;
        border-radius: 4px;
        text-align: center;
        width: 48px;
        height: 24px;
        background: #ff4444;
        top: 13px;
        margin-left: 54px;
        color: white;
        line-height: 24px;
        cursor: pointer;
    }
    .collect-button {
        position: absolute;
        display: inline-block;
        border-radius: 4px;
        text-align: center;
        width: 48px;
        height: 24px;
        background: #a753b5;
        top: 13px;
        margin-left: 106px;
        color: white;
        line-height: 24px;
        cursor: pointer;
    }
    .noticejs-top{top:0;width:100%!important}.noticejs-top .item{border-radius:0!important;margin:0!important}.noticejs-topRight{top:10px;right:10px}.noticejs-topLeft{top:10px;left:10px}.noticejs-topCenter{top:10px;left:50%;transform:translate(-50%)}.noticejs-middleLeft,.noticejs-middleRight{right:10px;top:50%;transform:translateY(-50%)}.noticejs-middleLeft{left:10px}.noticejs-middleCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.noticejs-bottom{bottom:0;width:100%!important}.noticejs-bottom .item{border-radius:0!important;margin:0!important}.noticejs-bottomRight{bottom:10px;right:10px}.noticejs-bottomLeft{bottom:10px;left:10px}.noticejs-bottomCenter{bottom:10px;left:50%;transform:translate(-50%)}.noticejs{font-family:Helvetica Neue,Helvetica,Arial,sans-serif}.noticejs .item{margin:0 0 10px;border-radius:3px;overflow:hidden}.noticejs .item .close{float:right;font-size:18px;font-weight:700;line-height:1;color:#fff;text-shadow:0 1px 0 #fff;opacity:1;margin-right:7px}.noticejs .item .close:hover{opacity:.5;color:#000}.noticejs .item a{color:#fff;border-bottom:1px dashed #fff}.noticejs .item a,.noticejs .item a:hover{text-decoration:none}.noticejs .success{background-color:#64ce83}.noticejs .success .noticejs-heading{background-color:#3da95c;color:#fff;padding:10px}.noticejs .success .noticejs-body{color:#fff;padding:10px}.noticejs .success .noticejs-body:hover{visibility:visible!important}.noticejs .success .noticejs-content{visibility:visible}.noticejs .info{background-color:#3ea2ff}.noticejs .info .noticejs-heading{background-color:#067cea;color:#fff;padding:10px}.noticejs .info .noticejs-body{color:#fff;padding:10px}.noticejs .info .noticejs-body:hover{visibility:visible!important}.noticejs .info .noticejs-content{visibility:visible}.noticejs .warning{background-color:#ff7f48}.noticejs .warning .noticejs-heading{background-color:#f44e06;color:#fff;padding:10px}.noticejs .warning .noticejs-body{color:#fff;padding:10px}.noticejs .warning .noticejs-body:hover{visibility:visible!important}.noticejs .warning .noticejs-content{visibility:visible}.noticejs .error{background-color:#e74c3c}.noticejs .error .noticejs-heading{background-color:#ba2c1d;color:#fff;padding:10px}.noticejs .error .noticejs-body{color:#fff;padding:10px}.noticejs .error .noticejs-body:hover{visibility:visible!important}.noticejs .error .noticejs-content{visibility:visible}.noticejs .progressbar{width:100%}.noticejs .progressbar .bar{width:1%;height:30px;background-color:#4caf50}.noticejs .success .noticejs-progressbar{width:100%;background-color:#64ce83;margin-top:-1px}.noticejs .success .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#3da95c}.noticejs .info .noticejs-progressbar{width:100%;background-color:#3ea2ff;margin-top:-1px}.noticejs .info .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#067cea}.noticejs .warning .noticejs-progressbar{width:100%;background-color:#ff7f48;margin-top:-1px}.noticejs .warning .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#f44e06}.noticejs .error .noticejs-progressbar{width:100%;background-color:#e74c3c;margin-top:-1px}.noticejs .error .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#ba2c1d}@keyframes noticejs-fadeOut{0%{opacity:1}to{opacity:0}}.noticejs-fadeOut{animation-name:noticejs-fadeOut}@keyframes noticejs-modal-in{to{opacity:.3}}@keyframes noticejs-modal-out{to{opacity:0}}.noticejs-rtl .noticejs-heading{direction:rtl}.noticejs-rtl .close{float:left!important;margin-left:7px;margin-right:0!important}.noticejs-rtl .noticejs-content{direction:rtl}.noticejs{position:fixed;z-index:10050;width:320px}.noticejs ::-webkit-scrollbar{width:8px}.noticejs ::-webkit-scrollbar-button{width:8px;height:5px}.noticejs ::-webkit-scrollbar-track{border-radius:10px}.noticejs ::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.5);border-radius:10px}.noticejs ::-webkit-scrollbar-thumb:hover{background:#fff}.noticejs-modal{position:fixed;width:100%;height:100%;background-color:#000;z-index:10000;opacity:.3;left:0;top:0}.noticejs-modal-open{opacity:0;animation:noticejs-modal-in .3s ease-out}.noticejs-modal-close{animation:noticejs-modal-out .3s ease-out;animation-fill-mode:forwards}
`));
    document.head.appendChild(style);
}

/**
 *  修改网页样式
 */
function initStylesChange() {
    let dom = document.getElementsByClassName("btn-search");
    for (let i = 0; i < dom.length; i++) {
        dom[i].style.marginRight = "110px";
    }
}   

/**
 * 鱼翅
 */
function initYuchi() {
    initYuchi_Dom();
    initYuchi_Func();
}

function initYuchi_Dom() {
    let a = document.createElement("div");
    a.className = "export-button";
    a.id = "export-yuchi";
    a.innerText = "导出";
    let b = document.getElementsByClassName("date-range-row-right");
    b[0].appendChild(a);

    a = document.createElement("div");
    a.className = "collect-button";
    a.id = "collect-yuchi";
    a.innerText = "统计";
    b[0].appendChild(a);
}

function initYuchi_Func() {
    document.getElementById("export-yuchi").addEventListener("click", () => {
        showMessage("正在导出表格...", "info");
        startExport(0);
    })
    document.getElementById("collect-yuchi").addEventListener("click", () => {
        showMessage("正在统计...", "info");
        startCollect(0);
    })
}


/**
 * 鱼丸
 */
function initYuwan() {
    initYuwan_Dom();
    initYuwan_Func();
}

function initYuwan_Dom() {
    let a = document.createElement("div");
    a.className = "export-button";
    a.id = "export-yuwan";
    a.innerText = "导出";
    let b = document.getElementsByClassName("date-range-row-right");
    b[1].appendChild(a);

    a = document.createElement("div");
    a.className = "collect-button";
    a.id = "collect-yuwan";
    a.innerText = "统计";
    b[1].appendChild(a);
}

function initYuwan_Func() {
    document.getElementById("export-yuwan").addEventListener("click", () => {
        showMessage("正在导出表格...", "info");
        startExport(1);
    })
    document.getElementById("collect-yuwan").addEventListener("click", () => {
        showMessage("正在统计...", "info");
        startCollect(1);
    })
}


/**
 * 道具
 */
function initDaoju() {
    initDaoju_Dom();
    initDaoju_Func();
}

function initDaoju_Dom() {
    let a = document.createElement("div");
    a.className = "export-button";
    a.id = "export-daoju";
    a.innerText = "导出";
    let b = document.getElementsByClassName("date-range-row-right");
    b[0].appendChild(a);

    a = document.createElement("div");
    a.className = "collect-button";
    a.id = "collect-daoju";
    a.innerText = "统计";
    b[0].appendChild(a);
}

function initDaoju_Func() {
    document.getElementById("export-daoju").addEventListener("click", () => {
        showMessage("正在导出表格...", "info");
        startExport(2);
    })
    document.getElementById("collect-daoju").addEventListener("click", () => {
        showMessage("正在统计...", "info");
        startCollect(2);
    })
}



async function startExport(index) {
    let [beginTime, endTime] = String(document.getElementsByClassName("date-range-picker")[index==2?0:index].value).split(" - ");
    beginTime = parseInt(new Date(beginTime + " 00:00:00").getTime() / 1000);
    endTime = parseInt(new Date(endTime + " 23:59:59").getTime() / 1000);
    let type = selectType(index);
    let host = selectApi(index);

    let lastId = "";
    let currentNum = 0;
    let currentPage = 1;
    let total = 0;
    let ret;

    let bianhao = 1;
    let jsonData = [];

    do {
        ret = await queryData(host + "?" + `firstId=&lastId=${lastId}&propType=0&beginTime=${beginTime}&endTime=${endTime}&type=${type}&pageNum=${currentPage}&pageSize=100`)
        if (ret.code == "0") {
            let len = ret.data.details.length;
            if (len == 0) {
                break;
            }
            lastId = ret.data.details[len - 1].id;
            total = Number(ret.data.total);
            currentNum += Number(ret.data.pageSize);

            currentPage++;
            
            
            for (let i = 0; i < ret.data.details.length; i++) {
                let item = ret.data.details[i];
                let tmpObj = {
                    bianhao: bianhao,
                    typeDesc: item.typeDesc,
                    userName: item.userName,
                    roomId: item.roomId,
                    dateline: dateFormat("yyyy年MM月dd日 hh时mm分ss秒", new Date(Number(item.dateline)*1000)),
                    relName: `${ item.relName }×${ item.number }`,
                    profit: Number(item.profit / 100),
                }
                jsonData.push(tmpObj);
                bianhao++;
            }
            
        } else {
            break;
        }
        await sleep(1000);
    } while (currentNum < total);
    if (jsonData.length > 0) {
        let header = ["编号", "消费类型", "主播昵称", "房间号", "消费时间", "消费内容", "消费金额"]
        let body = [];
        for (let i = 0; i < jsonData.length; i++) {
            let temp =[];
            for (let item in jsonData[i]) {
                temp.push(jsonData[i][item]);
            }
            body.push(temp);
        }
        exportJsonToExcel(header, body);
        showMessage("导出完毕", "success");
    } else {
        alert("无数据");
    }
    
}

function selectApi(index) {
    let host = "https://www.douyu.com/member/cp/"
    switch (index) {
        case 0:
            host += "getYcTransactionList";
            break;
        case 1:
            host += "getSilverTransactionList";
            break;
        case 2:
            host += "getPropTransactionList";
            break;
        default:
            host += "getYcTransactionList";
            break;
    }
    return host;
}

function selectType(index) {
    let ret = "";
    switch (index) {
        case 0:
            ret = document.getElementById("yctype").value;
            break;
        case 1:
            ret = document.getElementById("ywtype").value;
            break;
        case 2:
            ret = "";
            break;
        default:
            ret = document.getElementById("yctype").value;
            break;
    }
    return ret;
}

function queryData(url) {
    return new Promise(resolve => {
        fetch(url, {
            method: 'GET',
            mode: 'no-cors',
            credentials: 'include',
        }).then(res => {
            return res.json();
        }).then(ret => {
            resolve(ret);
        })
    })
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)))
}

function exportJsonToExcel(header, body) {
    let aoa = [];
    aoa.push(header, ...body);
    let sheet = XLSX.utils.aoa_to_sheet(aoa);
    openDownloadDialog(sheet2blob(sheet), '下载.xlsx');
}

function openDownloadDialog(url, saveName)
{
	if(typeof url == 'object' && url instanceof Blob)
	{
		url = URL.createObjectURL(url); // 创建blob地址
	}
	var aLink = document.createElement('a');
	aLink.href = url;
	aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
	var event;
	if(window.MouseEvent) event = new MouseEvent('click');
	else
	{
		event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	}
	aLink.dispatchEvent(event);
}
function sheet2blob(sheet, sheetName) {
	sheetName = sheetName || 'sheet1';
	var workbook = {
		SheetNames: [sheetName],
		Sheets: {}
	};
	workbook.Sheets[sheetName] = sheet;
	// 生成excel的配置项
	var wopts = {
		bookType: 'xlsx', // 要生成的文件类型
		bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
		type: 'binary'
	};
	var wbout = XLSX.write(workbook, wopts);
	var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
	// 字符串转ArrayBuffer
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
	return blob;
}
async function startCollect(index) {
    let [beginTime, endTime] = String(document.getElementsByClassName("date-range-picker")[index==2?0:index].value).split(" - ");
    beginTime = parseInt(new Date(beginTime + " 00:00:00").getTime() / 1000);
    endTime = parseInt(new Date(endTime + " 23:59:59").getTime() / 1000);
    let type = selectType(index);
    let host = selectApi(index);

    let lastId = "";
    let currentNum = 0;
    let currentPage = 1;
    let total = 0;
    let ret;

    let jsonHeader = []; // 表头
    let jsonBody = {}; // 主体


    do {
        ret = await queryData(host + "?" + `firstId=&lastId=${lastId}&propType=0&beginTime=${beginTime}&endTime=${endTime}&type=${type}&pageNum=${currentPage}&pageSize=100`)
        if (ret.code == "0") {
            let len = ret.data.details.length;
            if (len == 0) {
                break;
            }
            lastId = ret.data.details[len - 1].id;
            total = Number(ret.data.total);
            currentNum += Number(ret.data.pageSize);

            currentPage++;
            
            
            for (let i = 0; i < ret.data.details.length; i++) {
                let item = ret.data.details[i];
                // 构造表头
                if (jsonHeader.indexOf(item.relName) == -1) {
                    jsonHeader.push(item.relName);
                }

                // 构造表格
                if (item.userName in jsonBody == false) {
                    jsonBody[item.userName] = {}; // 初始化
                    jsonBody[item.userName]["totalMoney"] = 0;
                    jsonBody[item.userName]["roomId"] = "";
                }
                if (item.relName in jsonBody[item.userName] == false) {
                    jsonBody[item.userName][item.relName] = 0;
                }
                jsonBody[item.userName][item.relName] += Number(item.number);
                jsonBody[item.userName]["totalMoney"] += Number(item.price) * Number(item.number) / 100;
                jsonBody[item.userName]["roomId"] = item.roomId;
            }
            
        } else {
            console.log(ret.msg);
            break;
        }
    } while (currentNum < total);

    let header = createCollectHeader(jsonHeader);
    let body = createCollectBody(jsonHeader, jsonBody);
    exportJsonToExcel(header, body);
    showMessage("统计完毕", "success");
}

function createCollectHeader(jsonHeader) {
    let ret = [];
    ret.push("昵称", "房间号", ...jsonHeader, "金额");
    return ret;
}

function createCollectBody(jsonHeader, jsonBody) {
    let ret = [];
    for (const userName in jsonBody) {
        const userItem = jsonBody[userName];
        let temp = [];
        temp.push(userName);
        temp.push(userItem["roomId"]);

        for (let i = 0; i < jsonHeader.length; i++) {
            if (jsonHeader[i] in userItem) {
                temp.push(userItem[jsonHeader[i]]);
            } else {
                temp.push("");
            }
        }
        temp.push(userItem["totalMoney"]);
        ret.push(temp);
    }
    return ret;
}

function showMessage(msg, type) {
	// type: success[green] error[red] warning[orange] info[blue]
	new NoticeJs({
		text: msg,
		type: type,
		position: 'bottomRight',
	}).show();
}

function dateFormat(fmt, date) {
	let o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"q+": Math.floor((date.getMonth() + 3) / 3),
		"S": date.getMilliseconds()
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/*
    Notice.js
*/
(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==='object'&&typeof module==='object')module.exports=factory();else if(typeof define==='function'&&define.amd)define("NoticeJs",[],factory);else if(typeof exports==='object')exports["NoticeJs"]=factory();else root["NoticeJs"]=factory()})(typeof self!=='undefined'?self:this,function(){return(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{configurable:false,enumerable:true,get:getter})}};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module['default']}:function getModuleExports(){return module};__webpack_require__.d(getter,'a',getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="dist/";return __webpack_require__(__webpack_require__.s=2)})([(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var noticeJsModalClassName=exports.noticeJsModalClassName='noticejs-modal';var closeAnimation=exports.closeAnimation='noticejs-fadeOut';var Defaults=exports.Defaults={title:'',text:'',type:'success',position:'topRight',timeout:30,progressBar:true,closeWith:['button'],animation:null,modal:false,scroll:{maxHeight:300,showOnHover:true},rtl:false,callbacks:{beforeShow:[],onShow:[],afterShow:[],onClose:[],afterClose:[],onClick:[],onHover:[],onTemplate:[]}}}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.appendNoticeJs=exports.addListener=exports.CloseItem=exports.AddModal=undefined;exports.getCallback=getCallback;var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}var options=API.Defaults;function getCallback(ref,eventName){if(ref.callbacks.hasOwnProperty(eventName)){ref.callbacks[eventName].forEach(function(cb){if(typeof cb==='function'){cb.apply(ref)}})}}var AddModal=exports.AddModal=function AddModal(){if(document.getElementsByClassName(API.noticeJsModalClassName).length<=0){var element=document.createElement('div');element.classList.add(API.noticeJsModalClassName);element.classList.add('noticejs-modal-open');document.body.appendChild(element);setTimeout(function(){element.className=API.noticeJsModalClassName},200)}};var CloseItem=exports.CloseItem=function CloseItem(item){getCallback(options,'onClose');if(options.animation!==null&&options.animation.close!==null){item.className+=' '+options.animation.close}setTimeout(function(){item.remove()},200);if(options.modal===true&&document.querySelectorAll("[noticejs-modal='true']").length>=1){document.querySelector('.noticejs-modal').className+=' noticejs-modal-close';setTimeout(function(){document.querySelector('.noticejs-modal').remove()},500)}var position='.'+item.closest('.noticejs').className.replace('noticejs','').trim();setTimeout(function(){if(document.querySelectorAll(position+' .item').length<=0){let p=document.querySelector(position);if(p!=null){p.remove()}}},500)};var addListener=exports.addListener=function addListener(item){if(options.closeWith.includes('button')){item.querySelector('.close').addEventListener('click',function(){CloseItem(item)})}if(options.closeWith.includes('click')){item.style.cursor='pointer';item.addEventListener('click',function(e){if(e.target.className!=='close'){getCallback(options,'onClick');CloseItem(item)}})}else{item.addEventListener('click',function(e){if(e.target.className!=='close'){getCallback(options,'onClick')}})}item.addEventListener('mouseover',function(){getCallback(options,'onHover')})};var appendNoticeJs=exports.appendNoticeJs=function appendNoticeJs(noticeJsHeader,noticeJsBody,noticeJsProgressBar){var target_class='.noticejs-'+options.position;var noticeJsItem=document.createElement('div');noticeJsItem.classList.add('item');noticeJsItem.classList.add(options.type);if(options.rtl===true){noticeJsItem.classList.add('noticejs-rtl')}if(noticeJsHeader&&noticeJsHeader!==''){noticeJsItem.appendChild(noticeJsHeader)}noticeJsItem.appendChild(noticeJsBody);if(noticeJsProgressBar&&noticeJsProgressBar!==''){noticeJsItem.appendChild(noticeJsProgressBar)}if(['top','bottom'].includes(options.position)){document.querySelector(target_class).innerHTML=''}if(options.animation!==null&&options.animation.open!==null){noticeJsItem.className+=' '+options.animation.open}if(options.modal===true){noticeJsItem.setAttribute('noticejs-modal','true');AddModal()}addListener(noticeJsItem,options.closeWith);getCallback(options,'beforeShow');getCallback(options,'onShow');document.querySelector(target_class).appendChild(noticeJsItem);getCallback(options,'afterShow');return noticeJsItem}}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _noticejs=__webpack_require__(3);var _noticejs2=_interopRequireDefault(_noticejs);var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);var _components=__webpack_require__(4);var _helpers=__webpack_require__(1);var helper=_interopRequireWildcard(_helpers);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var NoticeJs=function(){function NoticeJs(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,NoticeJs);this.options=Object.assign(API.Defaults,options);this.component=new _components.Components();this.on('beforeShow',this.options.callbacks.beforeShow);this.on('onShow',this.options.callbacks.onShow);this.on('afterShow',this.options.callbacks.afterShow);this.on('onClose',this.options.callbacks.onClose);this.on('afterClose',this.options.callbacks.afterClose);this.on('onClick',this.options.callbacks.onClick);this.on('onHover',this.options.callbacks.onHover);return this}_createClass(NoticeJs,[{key:'show',value:function show(){var container=this.component.createContainer();if(document.querySelector('.noticejs-'+this.options.position)===null){document.body.appendChild(container)}var noticeJsHeader=void 0;var noticeJsBody=void 0;var noticeJsProgressBar=void 0;noticeJsHeader=this.component.createHeader(this.options.title,this.options.closeWith);noticeJsBody=this.component.createBody(this.options.text);if(this.options.progressBar===true){noticeJsProgressBar=this.component.createProgressBar()}var noticeJs=helper.appendNoticeJs(noticeJsHeader,noticeJsBody,noticeJsProgressBar);return noticeJs}},{key:'on',value:function on(eventName){var cb=arguments.length>1&&arguments[1]!==undefined?arguments[1]:function(){};if(typeof cb==='function'&&this.options.callbacks.hasOwnProperty(eventName)){this.options.callbacks[eventName].push(cb)}return this}}]);return NoticeJs}();exports.default=NoticeJs;module.exports=exports['default']}),(function(module,exports){}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.Components=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);var _helpers=__webpack_require__(1);var helper=_interopRequireWildcard(_helpers);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var options=API.Defaults;var Components=exports.Components=function(){function Components(){_classCallCheck(this,Components)}_createClass(Components,[{key:'createContainer',value:function createContainer(){var element_class='noticejs-'+options.position;var element=document.createElement('div');element.classList.add('noticejs');element.classList.add(element_class);return element}},{key:'createHeader',value:function createHeader(){var element=void 0;if(options.title&&options.title!==''){element=document.createElement('div');element.setAttribute('class','noticejs-heading');element.textContent=options.title}if(options.closeWith.includes('button')){var close=document.createElement('div');close.setAttribute('class','close');close.innerHTML='&times;';if(element){element.appendChild(close)}else{element=close}}return element}},{key:'createBody',value:function createBody(){var element=document.createElement('div');element.setAttribute('class','noticejs-body');var content=document.createElement('div');content.setAttribute('class','noticejs-content');content.innerHTML=options.text;element.appendChild(content);if(options.scroll!==null&&options.scroll.maxHeight!==''){element.style.overflowY='auto';element.style.maxHeight=options.scroll.maxHeight+'px';if(options.scroll.showOnHover===true){element.style.visibility='hidden'}}return element}},{key:'createProgressBar',value:function createProgressBar(){var element=document.createElement('div');element.setAttribute('class','noticejs-progressbar');var bar=document.createElement('div');bar.setAttribute('class','noticejs-bar');element.appendChild(bar);if(options.progressBar===true&&typeof options.timeout!=='boolean'&&options.timeout!==false){var frame=function frame(){if(width<=0){clearInterval(id);var item=element.closest('div.item');if(options.animation!==null&&options.animation.close!==null){item.className=item.className.replace(new RegExp('(?:^|\\s)'+options.animation.open+'(?:\\s|$)'),' ');item.className+=' '+options.animation.close;var close_time=parseInt(options.timeout)+500;setTimeout(function(){helper.CloseItem(item)},close_time)}else{helper.CloseItem(item)}}else{width--;bar.style.width=width+'%'}};var width=100;var id=setInterval(frame,options.timeout)}return element}}]);return Components}()})])});