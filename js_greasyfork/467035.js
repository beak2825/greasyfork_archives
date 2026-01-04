// ==UserScript==
// @name         Dm
// @namespace    http://one.damingone.com/
// @version      0.13.1
// @description  Dm_Tx
// @author       Dm
// @match        *://pay.qq.com/h5/shop.shtml*
// @match        *://pay.qq.com/h5/index.shtml*
// @match        *://pay.qq.com/midas/minipay_v2/views/cpay/game.shtml*
// @match        *://www.douyin.com/pay*
// @match        *://tp-pay.snssdk.com/*
// @match        *://gamepay.163.com/*
// @connect      *
// @license      MIT
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.5/base64.js
// @resource     CxSecretsFont https://static.muketool.com/scripts/cx/v2/fonts/cxsecret.json
// @resource     Layui https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/css/layui.min.css
// @resource     LayuiIconFont-woff2 https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.woff2
// @resource     LayuiIconFont-woff https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.woff
// @resource     LayuiIconFont-ttf https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.ttf
// @downloadURL https://update.greasyfork.org/scripts/467035/Dm.user.js
// @updateURL https://update.greasyfork.org/scripts/467035/Dm.meta.js
// ==/UserScript==


//针对那些没有技术的，或者说不要脸的，只会抄袭的人，你就是一傻逼，看什么，说的就是你，只会偷，除了偷东西，你还会干什么呢？

var _self = unsafeWindow,
    url = location.pathname,
    top = _self;

GM_addStyle(`
@import url(${GM_getResourceURL('Layui')});
`);

GM_addStyle(`
@font-face {
font-family: 'layui-icon';
src: url(${GM_getResourceURL('LayuiIconFont-woff2')}) format('woff2'),
 url(${GM_getResourceURL('LayuiIconFont-woff')}.woff) format('woff'),
 url(${GM_getResourceURL('LayuiIconFont-ttf')}) format('truetype');
font-weight: normal;
font-style: normal;
}

`);

var $ = _self.jQuery || top.jQuery,
    parent = _self == top ? self : _self.parent,
    Ext = _self.Ext || parent.Ext || {},
    UE = _self.UE,
    Base64 = self.Base64,
    vjs = _self.videojs;



function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
    }
}
var resp;
var res_data;
var web_url;
var process;

addXMLRequestCallback( function( xhr ) {
    xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            // console.log( xhr.responseURL );
            if ( xhr.responseURL.search("(.*?)/v1/r/(.*?)/mobile_save") != -1 ) {
                //console.log(xhr.responseURL);
                //console.log(xhr.response);
                //alert(xhr.response);
                resp = JSON.parse(xhr.response);
                //console.log(Base64.encode(xhr.response));
                if(resp.ret == 0){
                    res_data = xhr.response;
                    upload_info(res_data);
                }
            }else if ( xhr.responseURL.search("(.*?)/v1/r/(.*?)/web_save") != -1 ) {
                //console.log(xhr.responseURL);
                //console.log(xhr.response);
                //alert(xhr.response);
                resp = JSON.parse(xhr.response);
                //console.log(Base64.encode(xhr.response));
                if(resp.ret == 0){
                    res_data = xhr.response;
                    upload_info_web(res_data);
                }
            }else if ( xhr.responseURL.search("(.*?)/common_api/internal/create_pay_url") != -1 ) {
                //console.log(xhr.responseURL);
                //console.log(xhr.response);
                //alert(xhr.response);
                resp = JSON.parse(xhr.response);
                //console.log(Base64.encode(xhr.response));
                res_data = xhr.response;
                upload_info_wy(res_data);
            }else if( xhr.responseURL.search("(.*?)/gateway-cashier2/tp/cashier/trade_create") != -1 ){
                //console.log(xhr.response);
                resp = JSON.parse(xhr.response);
                //console.log(Base64.encode(xhr.response));
                if(resp.code == "CA0000"){
                    setTimeout(function(){
                        process = resp.process;
                        web_url = window.location.href;
                        res_data = xhr.response;
                        upload_info(web_url + "|" + process);
                    },"2000");
                }
            }
        }
    });

});

function upload_info_web(response_data){
    new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://one.damingone.com/api/tx/set_local_pay_youhou_web",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "data=" + Base64.encode(response_data) + "&username=" + (GM_getValue("username") != undefined ? GM_getValue("username") : "") + "&password=" + (GM_getValue("password") != undefined ? GM_getValue("password") : "") + "&id=" + (GM_getValue("land") != undefined ? GM_getValue("land") : "") + "&money=" + (GM_getValue("money") != undefined ? GM_getValue("money") : ""),
            onload(xhr) {
                //console.log(xhr.responseText);
                var resp = JSON.parse(xhr.responseText);
                if(resp.code == 1){
                    alert("产码成功，当前账号剩余产码：" + resp.count );
                }else{
                    alert(resp.msg);
                }
            }
        });
    });
}


function upload_info(response_data){
    new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://one.damingone.com/api/tx/set_local_pay_youhou",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "data=" + Base64.encode(response_data) + "&del_time=" + (GM_getValue("del_time") != undefined ? GM_getValue("del_time") : "0") + "&username=" + (GM_getValue("username") != undefined ? GM_getValue("username") : "") + "&password=" + (GM_getValue("password") != undefined ? GM_getValue("password") : "") + "&id=" + (GM_getValue("land") != undefined ? GM_getValue("land") : "") + "&money=" + (GM_getValue("money") != undefined ? GM_getValue("money") : ""),
            onload(xhr) {
                //console.log(xhr.responseText);
                var resp = JSON.parse(xhr.responseText);
                if(resp.code == 1){
                    alert("产码成功，当前账号剩余产码：" + resp.count );
                    startJob();
                }else{
                    alert(resp.msg);
                }
            }
        });
    });
}

function upload_info_wy(response_data){
    new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://one.damingone.com/api/tx/set_local_pay_youhou",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "data=" + Base64.encode(response_data) + "&del_time=" + (GM_getValue("del_time") != undefined ? GM_getValue("del_time") : "0") + "&username=" + (GM_getValue("username") != undefined ? GM_getValue("username") : "") + "&password=" + (GM_getValue("password") != undefined ? GM_getValue("password") : "") + "&id=" + (GM_getValue("land") != undefined ? GM_getValue("land") : "") + "&money=" + (GM_getValue("money") != undefined ? GM_getValue("money") : ""),
            onload(xhr) {
                //console.log(xhr.responseText);
                var resp = JSON.parse(xhr.responseText);
                if(resp.code == 1){
                    alert("产码成功，当前账号剩余产码：" + resp.count );
                }
            }
        });
    });
}



let html = `
<button type="button" id="show" onClick="showClick()">隐藏配置窗口</button>
<div style="background:white;" id="config">
<br>
&nbsp&nbsp&nbsp
<label>账&nbsp&nbsp&nbsp户：</label><input type="text" id="username" name="username" value="` + (GM_getValue("username") != undefined ? GM_getValue("username") : "") + `" required>
<br>
&nbsp&nbsp&nbsp
<label>密&nbsp&nbsp&nbsp码：</label><input type="text" id="password" name="password" value="` + (GM_getValue("password") != undefined ? GM_getValue("password") : "") + `" required>
<br>
&nbsp&nbsp&nbsp
<label>账号ID:&nbsp&nbsp</label><input type="text" id="land" name="land" value="` + (GM_getValue("land") != undefined ? GM_getValue("land") : "") + `" required>
<br>
&nbsp&nbsp&nbsp
<label>金&nbsp&nbsp&nbsp额：</label><input type="text" id="money" name="money" value="` + (GM_getValue("money") != undefined ? GM_getValue("money") : "") + `" required>
<br>
&nbsp&nbsp&nbsp
<label>时效(分)：</label><input type="text" id="del_time" name="del_time" value="` + (GM_getValue("del_time") != undefined ? GM_getValue("del_time") : "") + `" required>
<br>
<br>
&nbsp&nbsp&nbsp
<button type="button" id="save" onClick="saveClick()">保存</button>
&nbsp&nbsp&nbsp
<button type="button" id="start" onClick="startClick()">开始</button>
&nbsp&nbsp
<button type="button" id="stop" onClick="stopClick()">结束</button>
<br>
<br>
</div>


<script>
function saveClick(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var land = document.getElementById("land").value;
    var money = document.getElementById("money").value;
    var del_time = document.getElementById("del_time").value;
    window.parent.postMessage({type: 'save',username:username,password:password,land:land,money:money,del_time:del_time}, '*');
}
function startClick(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var land = document.getElementById("land").value;
    var money = document.getElementById("money").value;
    var del_time = document.getElementById("del_time").value;
    window.parent.postMessage({type: 'start',username:username,password:password,land:land,money:money,del_time:del_time}, '*');
}
function startClick2(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var land = document.getElementById("land").value;
    var money = document.getElementById("money").value;
    var del_time = document.getElementById("del_time").value;
    window.parent.postMessage({type: 'start2',username:username,password:password,land:land,money:money,del_time:del_time}, '*');
}
function stopClick(){
    window.parent.postMessage({type: 'stop'}, '*');
}
function showClick(){
    var str = document.getElementById("show").innerHTML;
    if(str == "显示配置窗口"){
         document.getElementById("show").innerHTML = "隐藏配置窗口";
    }else{
         document.getElementById("show").innerHTML = "显示配置窗口";
    }
    window.parent.postMessage({type: 'show'}, '*');
}
</script>

`;




top.addEventListener("message", event => {
    if (event.data.type === "save") {
        if(event.data.username == "" || event.data.password == ""){
            alert("请保证账号密码不为空");return;
        }
        GM_setValue("username", event.data.username);
        GM_setValue("password", event.data.password);
        GM_setValue("land", event.data.land);
        GM_setValue("money", event.data.money);
        GM_setValue("del_time", event.data.del_time);
        //console.log(event.data.land);
        alert("保存成功");
    } else if(event.data.type === "start"){
        if(event.data.username == "" || event.data.password == ""){
            alert("请保证账号密码不为空");return;
        }
        GM_setValue("username", event.data.username);
        GM_setValue("password", event.data.password);
        GM_setValue("land", event.data.land);
        GM_setValue("money", event.data.money);
        GM_setValue("del_time", event.data.del_time);
        startJob();
    } else if(event.data.type === "start2"){
        if(event.data.username == "" || event.data.password == ""){
            alert("请保证账号密码不为空");return;
        }
        GM_setValue("username", event.data.username);
        GM_setValue("password", event.data.password);
        GM_setValue("land", event.data.land);
        GM_setValue("money", event.data.money);
        GM_setValue("del_time", event.data.del_time);
        startJob2();
    } else if(event.data.type === "stop"){
        stopJob();
    } else if(event.data.type === "show"){
        showConfig();
    }
}, false);


function showConfig(){
    var elem = top.document.getElementById("iframeNode")
    if(elem.style.height == "31px"){
        elem.style.height = "215px";
    }else{
        elem.style.height = "31px";
    }
}


function startJob(){
    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://one.damingone.com/api/tx/local_pay",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "id=" + (GM_getValue("land") != undefined ? GM_getValue("land") : "") + "&money=" + (GM_getValue("money") != undefined ? GM_getValue("money") : ""),
            onload(xhr) {
                //console.log(xhr.responseText);
                var resp = JSON.parse(xhr.responseText);
                if(resp.code == 1){
                    top.location.href = resp.msg;
                }else{
                    alert(resp.msg);
                }
            }
        });
    });
}

function startJob2(){
    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://one.damingone.com/api/tx/local_pay_new",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "id=" + (GM_getValue("land") != undefined ? GM_getValue("land") : "") + "&money=" + (GM_getValue("money") != undefined ? GM_getValue("money") : ""),
            onload(xhr) {
                //console.log(xhr.responseText);
                var resp = JSON.parse(xhr.responseText);
                if(resp.code == 1){
                    top.location.href = resp.msg;
                }else{
                    alert(resp.msg);
                }
            }
        });
    });
}

function stopJob(){
    top.location.href = "https://pay.qq.com/";
}


function addModal2(html, newPos, footerChildNode = false) {
    let iframeNode = top.document.createElement("iframe");
    iframeNode.id = "iframeNode";
    iframeNode.setAttribute("width", "101%");
    iframeNode.setAttribute("height", "215px");
    iframeNode.setAttribute("style", "height:215px");
    iframeNode.setAttribute("frameborder", "0");
    iframeNode.srcdoc = html;
    let contentNode = createContainer("content-modal", [ iframeNode ]);
    let modal = renderModal(contentNode);
    dragModel(modal);
}

function createContainer(name, childElem) {
    name = name.toLowerCase();
    let elem = top.document.createElement(name);
    elem.style.display = "block";
    elem.id = name.replace("hcsearche", "hcSearche").replace(/\-[a-z]/g, function(w) {
        return w.replace("-", "").toUpperCase();
    });
    if (childElem) {
        if (Array.isArray(childElem) === false) childElem = [ childElem ];
        for (let i = 0; i < childElem.length; i++) elem.appendChild(childElem[i]);
    }
    return elem;
}
function dragModel(drag) {
    const TOP = top;
    drag.onmousedown = function(e) {
        drag.style.cursor = "move";
        e = e || window.event;
        let diffX = e.clientX - drag.offsetLeft;
        let diffY = e.clientY - drag.offsetTop;
        top.onmousemove = function(e) {
            e = e || top.event;
            let left = e.clientX - diffX;
            let top = e.clientY - diffY;
            if (left < 0) {
                left = 0;
            } else if (left > TOP.innerWidth * .95 - drag.offsetWidth) {
                left = TOP.innerWidth * .95 - drag.offsetWidth;
            }
            if (top < 0) {
                top = 0;
            } else if (top > TOP.innerHeight - drag.offsetHeight) {
                top = TOP.innerHeight - drag.offsetHeight;
            }
            drag.style.left = left + "px";
            drag.style.top = top + "px";
            GM_setValue("pos", drag.style.left + "," + drag.style.top);
        };
        top.onmouseup = function(e) {
            drag.style.cursor = "default";
            this.onmousemove = null;
            this.onmouseup = null;
        };
    };
}

function renderModal(childElem, newPos) {
    return render("tag" + rand(1, 100).toString(), "model-id", childElem);
}
function rand(m, n) {
    return Math.ceil(Math.random() * (n - m + 1) + m - 1);
}
function render(tagName, elemId, childElem, isFixed, newPos) {
    let doc = top.document;
    let elem = doc.getElementById(elemId);
    if (elem) {
        elem.innerHTML = "";
    } else {
        elem = doc.createElement(tagName);
        elem.id = elemId;
        doc.body.appendChild(elem);
    }
    let contentNode = createContainer(tagName + "-container", childElem);
    elem.appendChild(contentNode);
    elem.classList.add(elemId);
    elem.style.zIndex = "9999999";
    elem.style.position = "fixed";
    const pos = "30px,30px";
    const posarr = pos.split(",");
    elem.style.left = posarr[0];
    elem.style.top = posarr[1];
    setTimeout(function() {
        elem.classList.add(elemId + "-show");
    }, 10);
    return elem;
}

addModal2(html);


