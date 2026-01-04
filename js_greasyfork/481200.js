// ==UserScript==
// @name         Weibo All Hidden
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  批量修改微博可见范围
// @author       Wei
// @match        http*://*weibo.com*
// @match        https://weibo.com/comment/outbox
// @match        https://weibo.com/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481200/Weibo%20All%20Hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/481200/Weibo%20All%20Hidden.meta.js
// ==/UserScript==

class W {
    privateAttributes = [// 0: ref; 1: original event; 2: css; 3: w label
        {name: 'w-group', typ: 3},
        {name: 'w-verify', typ: 3},
        {name: 'w-ref', typ: 0},
        {name: 'w-click', typ: 1},
        {name: 'w-display', typ: 2},
        {name: 'w-weight', typ: 2},
        {name: 'w-height', typ: 2},
    ]

    constructor() {
        this.ref = {}
        this.v2H = []
        this.variable = (v) => {
            setTimeout(() => {
                this.updateHtml();
            }, 1)
            return v;
        }
    }

    init() {
        let wEle = document.getElementsByClassName('w')
        // 判断元素中是否有privateAttributes
        for (let i = 0; i < wEle.length; i++) {
            let ele = wEle[i]
            let group = null
            let verify = false
            this.privateAttributes.forEach((att) => {
                let attValue = ele.getAttribute(att.name)
                if (attValue !== null) {
                    const name = att.name.replace('w-', '')
                    if (att.typ === 0) {        // w-ref
                        this.ref[attValue] = ele
                    } else if (att.typ === 1) { // event
                        let f = eval(attValue)
                        if (group) {
                            group.forEach((item) => {
                                item.addEventListener(name, () => {
                                    f(item.value)
                                }, false)
                            })
                        } else {
                            ele.addEventListener(name, () => {
                                verify ? (window.confirm("确定执行么？") ? f(ele.id) : '') : f(ele.id)
                            }, false)
                        }
                    } else if (att.typ === 2) { // css
                        ele.style[name] = attValue
                    } else if (att.typ === 3) { // group
                        if (name === 'group') group = Array.from(ele.getElementsByClassName(attValue))
                        if (name === 'verify') verify = true;
                    }
                }
                //正则匹配 ele.innerHTML 中是否含有 {{xxx}} 并且ele要为最小元素 匹配所有结果
                let reg = /{{(.*?)}}/g
                let matches;
                let v2HInfo = {
                    element: ele,
                    orgHTML: ele.innerHTML,
                    mv: []
                }
                let matchFlag = false
                while ((matches = reg.exec(ele.innerHTML)) !== null && ele.childElementCount === 0) {
                    matchFlag = true;
                    let match = matches[0]; // 匹配的完整字符串，例如 "{{var1}}"
                    let variable = matches[1];
                    v2HInfo.mv.push({
                        match: match,
                        variable: variable,
                    })
                }
                if (matchFlag) {
                    //console.log(v2HInfo)
                    this.v2H.push(v2HInfo)
                }
            })
        }
        this.updateHtml()
    }

    updateHtml() {
        this.v2H.forEach((v2HInfo) => {
            let orgHTML = v2HInfo.orgHTML
            v2HInfo.mv.forEach((item) => {
                orgHTML = orgHTML.replace(item.match, eval(item.variable))
            })
            v2HInfo.element.innerHTML !== orgHTML ? (v2HInfo.element.innerHTML = orgHTML): ''
        })
    }
}
let w = new W()
let f1 = true
let f2 = true
let userInfo = {
    X_XSRF_TOKEN: null,
    uid: null,
    status: null,
    name: null,
    count: null,
    wbInfo: [],
    wbVisibleInfo: {
        0: 0,
        10: 0,
        2: 0,
        1: 0
    },
    processGet: 0,
    processSkip: 0,
    modifyVisibleType: null,
    modifyVisibleTextList: {
        0: "公开",
        10: "粉丝",
        2: "朋友",
        1: "仅自己",
    },
    processModifyVisible: 0,
    error: "点击查看错误",
    hasWWW: false,


    cmtTotal: 0,
    cmtPublicTotal: 0,
    cmtGet: 0,
};

function get(url, data, callback){
    //创建异步对象
    var xhr = null
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if(window.ActiveXObject) {//IE6及以下
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //判断data是否为空
    if(data){
        url=url+'?'+params(data);
    }
    //设置请求行
    xhr.open('get',url);
    //设置请求头(get可以省略)
    xhr.setRequestHeader("x-xsrf-token",userInfo.X_XSRF_TOKEN);
    //注册回调函数
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4&&xhr.status==200){
            //调用传递的回调函数
            callback(xhr.responseText);
        }
    }
    //发送请求主体
    xhr.send(null);
}

function post(url, data, callback){
    //创建异步对象
    var xhr = null
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if(window.ActiveXObject) {//IE6及以下
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    //设置请求行
    xhr.open('post',url);
    //设置请求头(post有数据发送才需要设置请求头)
    //判断是否有数据发送
    xhr.setRequestHeader("x-xsrf-token",userInfo.X_XSRF_TOKEN);
    if(data){
        xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
    }
    //注册回调函数
    xhr.onreadystatechange = function(){
        if(xhr.readyState==4&&xhr.status==200){
            //调用传递的回调函数
            callback(xhr.responseText);
        } else {
            throw new Error('error');
        }
    }
    //发送请求主体
    xhr.send(JSON.stringify(data));
}

let getWb = () => {
    const paramsStr = window.location.href
    userInfo.hasWWW = paramsStr.search('www') === -1 ? '' : 'www.';
    userInfo.uid = paramsStr.split("/").pop();
    get(`https://${userInfo.hasWWW}weibo.com/ajax/profile/info?uid=${userInfo.uid}`, null, (e) => {
        let recvJson = JSON.parse(e);
        console.log(recvJson, recvJson.ok);
        userInfo.status = recvJson.ok;
        userInfo.name = recvJson.data.user.screen_name;
        userInfo.count = recvJson.data.user.statuses_count;
        w.updateHtml();
    })
}

let getAllWbID = () => {
    if (!userInfo.count || !userInfo.status) return;
    const pageCount = Math.ceil(userInfo.count/20);
    userInfo.wbInfo = [];
    userInfo.wbVisibleInfo = {
        0:0,
        10:0,
        2:0,
        1:0
    }
    userInfo.processGet = w.variable(0);


    for (let i = 0; i < pageCount; i++) {
        //for (let i = 0; i < 1; i++) {
        setTimeout(() => {
            get(`https://${userInfo.hasWWW}weibo.com/ajax/statuses/mymblog?uid=${userInfo.uid}&page=${i+1}&feature=0`, null, (e) => {
                let recvJson = JSON.parse(e);
                let dataList = recvJson.data.list;
                for (let j =0; j<dataList.length;j++ ){
                    let item = dataList[j];
                    userInfo.wbInfo.push({
                        id: item.id,
                        visible: item.visible.type,
                        mblogid: item.mblogid
                    })

                    userInfo.wbVisibleInfo[item.visible.type] += 1;
                    userInfo.processGet += 1;
                    w.updateHtml();
                }
            });
        }, 500 * i)
    }
}

let modifyVisible = () => {
    if(userInfo.modifyVisibleType === null) return;
    userInfo.processSkip = 0;
    userInfo.processModifyVisible = 0;
    let wbInfoNeedModify = [];
    let errorIndexList = [];
    for (let i = 0; i <userInfo.count; i++) {
        //for (let i = 0; i < 1; i++) {
        if(String(userInfo.wbInfo[i].visible) === userInfo.modifyVisibleType) {
            userInfo.processSkip += 1;
            userInfo.processModifyVisible += 1;
            w.updateHtml();
            continue;
        } else {
            wbInfoNeedModify.push(i);
            errorIndexList.push(i);
        }
    }
    for (let i = 0; i <wbInfoNeedModify.length; i++) {
        setTimeout(() => {
            try{
                post(`https://${userInfo.hasWWW}weibo.com/ajax/statuses/modifyVisible`, {
                    ids:String(userInfo.wbInfo[wbInfoNeedModify[i]].id),
                    visible:String(userInfo.modifyVisibleType),
                }, (e)=>{
                    userInfo.processModifyVisible += 1;
                    errorIndexList.filter(item => item === wbInfoNeedModify[i]);
                    w.updateHtml();
                })
            } catch (e) {
                userInfo.error += `<br>${e}<a href="https://weibo.com/${userInfo.uid}/${userInfo.wbInfo[errorIndexList[i]].mblogid}">${userInfo.wbInfo[errorIndexList[i]].mblogid}</a>`
                w.updateHtml();
            }
        }, 1000 * i)
    }
    w.updateHtml();
}

let getMyCmt = () => {
    userInfo.cmtGet = 0;
    userInfo.cmtPublicTotal = 0;
    let i = 0
    let g = (nc) => {
        i += 1;
        if (i > 2) return
        get(`https://weibo.com/ajax/message/myCmt${nc ? '?max_id='+nc : ''}`, null, (e)=>{
            let recvJson = JSON.parse(e);
            userInfo.cmtGet += recvJson.data.comments.length;
            userInfo.cmtTotal = w.variable(recvJson.data.total_number);
            recvJson.data.comments.forEach((item)=>{
                // if (item.status.user.verified && item.status.user.verified_type in [0, 2]) {
                //     userInfo.cmtPublicTotal += 1;
                //     console.log(item.text)
                // }
                console.log(item.text, item.status.user.verified, item.status.user.verified_type)
            });
            if (recvJson.data.comments.length > 1) {
                let nextCursor = recvJson.data.next_cursor;
                g(nextCursor)
            }
        })
    };
    g()


}


let initHtml = () => {
    var htmlCode = `
<style>
    .wb-tool {
        width: 300px;
        bottom: 20px;
        right: 20px;
        padding: 10px 10px 8px 10px;
        background-color: #eee;
        z-index: 9999;
        position: fixed;
        overflow: hidden;
        border-radius: 10px;
        transition: all 0.5s;
        box-shadow: 0 0 5px 2px rgba(0, 0, 0, .2);
    }

    .title {
        font-size: 22px;
        font-weight: 600;
        text-align: center;
        margin-top: 5px;
    }

    .note {
        font-size: 14px;
        font-weight: 600;
        color: #EE0000;
    }

    .info {
        font-size: 14px;
        font-weight: 600;
        color: #000;
        margin: 3px 0;
    }

    .btn {
        border: none;
        background-color: #fff;
        width: 100%;
        margin-top: 8px;
        padding: 8px;
        border-radius: 4px;
        transition: all 0.2s;
        display: inline-block;
        cursor: pointer;
    }

    .btn:hover {
        box-shadow: 0 0 5px 2px rgba(0, 0, 255, .2);
    }

    .btn-sm {
        width: 80%;
        margin: 0 10%;
        background-color: #f1f1f1;
    }

    .card {
        width: 100%;
        /*min-height: 100px;*/
        background-color: #fff;
        border-radius: 10px;
        margin-top: 8px;
        overflow: hidden;
        transition: all 0.2s;
    }

    .card-title {
        font-size: 14px;
        font-weight: 600;
        color: #222;
        margin: 5px;
    }

    .card-info {
        margin: 5px;
        font-size: 14px;
        color: #000;
    }

    .error {
        width: calc(100% - 10px);
        height: 92px;
        border-radius: 8px;
        color: red;
        background-color: antiquewhite;
        overflow: auto;
    }


</style>
<div class="w wb-tool">
    <div class="w title">微博工具</div>
    <p class="w note">
        注意事项：
        <br>1. 请谨慎使用，部分操作无法恢复！
        <br>2. "仅自己可见"无法隐藏"快转"的内容！
    </p>
    <div class="w info" id="info-token">Token状态:{{userInfo.X_XSRF_TOKEN?'获取成功':'获取失败'}}</div>
    <div class="w info" id="info-status">状态:{{userInfo.status?'Success':'Error'}}</div>
    <div class="w info" id="info-name">昵称:{{userInfo.name}}</div>
    <div class="w info" id="info-count">总微博数:{{userInfo.count}}</div>
    <button class="w btn" id="showCardModifyVisibleWb" w-click="onCardClick">微博可见范围修改</button>
    <button class="w btn" id="showCardDeletePublicCmt" w-click="onCardClick">微博公开评论删除</button>
    <div class="w card" w-ref="cardMVW" w-height="0">
        <div class="w card-title">微博可见范围修改</div>
        <button class="w btn btn-sm" id="btnGetAllWb" w-verify w-click="getAllWbID">获取全部微博信息</button>
        <div class="w card-info">进度:{{userInfo.processGet}} / {{userInfo.count}}</div>
        <div class="w card-info" id="visibleInfo">
            公开:{{userInfo.wbVisibleInfo[0]}}，粉丝:{{userInfo.wbVisibleInfo[10]}}，
            朋友:{{userInfo.wbVisibleInfo[2]}}，仅自己:{{userInfo.wbVisibleInfo[1]}}
        </div>

        <div class="w card-info" w-group="radio" w-click="(value) => userInfo.modifyVisibleType = w.variable(value)">
            <input name="radio" type="radio" id="public" class="w radio" value="0"/>
            <label for="public">公开</label>

            <input name="radio" type="radio" id="fans" class="w radio" value="10"/>
            <label for="fans">粉丝</label>

            <input name="radio" type="radio" id="friends" class="w radio" value="2"/>
            <label for="friends">朋友</label>

            <input name="radio" type="radio" id="me" class="w radio" value="1"/>
            <label for="me">仅自己</label>
        </div>
        <button class="w btn btn-sm" id="btnModifyVisible" w-verify w-click="modifyVisible">
            全部转换到{{userInfo.modifyVisibleTextList[userInfo.modifyVisibleType]}}
        </button>
        <div class="w card-info" id="processModifyVisible">
            进度:{{userInfo.processModifyVisible}} / {{userInfo.count}}，
            跳过:{{userInfo.processSkip}} / {{userInfo.count}}
        </div>
        <div class="w card-info error" id="error">{{userInfo.error}}</div>
    </div>
    <div class="w card" w-ref="cardDPC" w-height="0">
        <div class="w card-title">微博公开评论删除</div>
        <button class="w btn btn-sm" id="btnGetAllCmt" w-click="getMyCmt">获取公开评论信息</button>
        <div class="w card-info">总共发出评论:{{userInfo.cmtTotal}}</div>
        <div class="w card-info">已经获取评论:{{userInfo.cmtGet}}</div>
        <div class="w card-info">公开评论数:{{userInfo.cmtPublicTotal}}</div>

    </div>
</div>
`;
    let insertElement = document.createElement("div");
    insertElement.innerHTML = htmlCode;
    document.body.append(insertElement);
}

let onCardClick = (id) => {
    console.log(id)
    if (id === 'showCardModifyVisibleWb') {
        w.ref.cardMVW.style.height = (f1) ? '300px' : '0px'
        f1 = !f1
    }
    if (id === 'showCardDeletePublicCmt') {
        w.ref.cardDPC.style.height = (f2) ? '200px' : '0px';
        f2 = !f2
    }
}

(function() {
    'use strict';
    window.onload=function(){
        initHtml();
        w.init()
        getWb();


        // 劫持所有请求获取X__XSRF__TOKEN
        function addXMLRequestCallback(callback) {
            var oldSend, i;
            if (XMLHttpRequest.callbacks) {
                XMLHttpRequest.callbacks.push(callback);
            } else {
                XMLHttpRequest.callbacks = [callback];
                oldSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send = function () {
                    for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                        XMLHttpRequest.callbacks[i](this);
                    }
                    return oldSend.apply(this, arguments);
                };
            }
        }
        XMLHttpRequest.prototype.wrappedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            this.wrappedSetRequestHeader(header, value);
            if(!this.headers) {
                this.headers = {};
            }
            header = header.replaceAll('-', '__')
            this.headers[header] = value;
        }
        let flag = false;
        addXMLRequestCallback(function (xhr) {
            xhr.addEventListener("load", function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if(!flag && xhr.headers.hasOwnProperty('X__XSRF__TOKEN')) {
                        userInfo.X_XSRF_TOKEN = w.variable(xhr.headers.X__XSRF__TOKEN)
                        flag = true;

                    }
                }
            });
        });
    }
})();