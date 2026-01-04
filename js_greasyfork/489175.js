// ==UserScript==
// @name         G63-gg
// @namespace    http://www.baidu.com/
// @version      0.12.3
// @description  G63_Tx
// @author       G63
// @match        *://pay.qq.com/h5/index.shtml*
// @include      *://pay.qq.com/h5/shop.shtml?*
// @include      *://pay.qq.com/h5/shop.shtml#*
// @include      *://pay.qq.com/h5/shop.shtml*
// @match        *://pay.qq.com/midas/minipay_v2/views/cpay/game.shtml*
// @match        *://pay.qq.com/paygame/index.shtml*
// @match        *://xinyue.qq.com/*
// @match        *://act.xinyue.qq.com/*
// @match        *://pay.qq.com/midas/minipay_v2/views/cpay/goods.shtml*
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
// @require      https://npm.elemecdn.com/js-base64@3.7.5/base64.js
// @resource     CxSecretsFont https://static.muketool.com/scripts/cx/v2/fonts/cxsecret.json
// @resource     Layui https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/css/layui.min.css
// @resource     LayuiIconFont-woff2 https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.woff2
// @resource     LayuiIconFont-woff https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.woff
// @resource     LayuiIconFont-ttf https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/font/iconfont.ttf
// @downloadURL https://update.greasyfork.org/scripts/489175/G63-gg.user.js
// @updateURL https://update.greasyfork.org/scripts/489175/G63-gg.meta.js
// ==/UserScript==

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
            // console.log('this---',this)
            if(this && this.W &&  this.W.url || this && this.aegisUrl){
                var geturl = "";
                if(this.aegisUrl){
                    geturl = this.aegisUrl;
                }else{
                    geturl = this.W.url;
                }
                console.log('geturl---',geturl)
                   console.log('mobile_save---',geturl.indexOf("/mobile_save"))
                if(geturl  && geturl.indexOf("/web_save")!=-1 || geturl && geturl.indexOf("/mobile_save")!=-1){
                    var getdata =arguments[0];
                    getdata=unescape(getdata);
                   // console.log('arguments[0]---->', getdata);
                    var str= getdata.match(new RegExp(`buy_quantity=(.*?)&`))[1];
                     var str1= getdata.match(new RegExp(`&amt=(.*?)&`))[1];
                    GM_setValue("buy_quantity", str);
                     GM_setValue("adddata", getdata);
                    GM_setValue("amt", str1);
                     console.log('amt=是---->', GM_getValue("amt"),str1);
                    console.log('buy_quantity=是---->', GM_getValue("buy_quantity"),str);
                }
            }
            oldSend.apply(this, arguments);
        }
    }
}
addXMLRequestCallback( function( xhr ) {
    xhr.addEventListener("load", function(){
        if ( xhr.readyState == 4 && xhr.status == 200 ) {
            //https://api.unipay.qq.com/v1/r/1450013297/web_save
            if ( xhr.responseURL.search("(.*?)/v1/(.*?)/(.*?)/mobile_save") != -1 || xhr.responseURL.search("(.*?)/v1/r/(.*?)/web_save") != -1) {
                //console.log(Base64.encode(xhr.response));
                console.log("本次结束")
                // alert(xhr.response);
                           if(GM_getValue("adddata")=="" || GM_getValue("adddata").indexOf('qqwallet:2')==-1){
            console.log('不是qq支付', GM_getValue("adddata"))
                               return;
            }
                var resp = JSON.parse(xhr.response);
                if(resp.ret == 0){
                    resp.buy_quantity=Number(GM_getValue("buy_quantity"));
                    resp.amt=Number(GM_getValue("amt"));
                    console.log('resp',resp)
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


&nbsp&nbsp&nbsp
<label>账号链接：</label><input type="text" id="G63Url" name="G63Url" value="` + (GM_getValue("G63Url") != undefined ? GM_getValue("G63Url") : "") + `" required>




&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button type="button" id="save" onClick="saveClick()">保存</button>
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
<button type="button" id="start" onClick="startClick()">开始</button>




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
                    const test_url = resp.data.gotourl;
                    const replaced_url = test_url.replace('pf=mds_pay-10001896', 'pf=mds_douyu_pay-__mds_douyuprivate_aW9zd2hpdGVsaXN0_wzsq29d');
                    if(resp.data.type==0){
                        // 直接打开
                        if(resp.data.gotourl!=""){
                            top.location.href = replaced_url;
                        }
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