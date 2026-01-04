// ==UserScript==
// @name         SD-Webui附加网络面板样式修改
// @namespace    https://container-z.art/
// @version      1.0.3
// @description  Additional Network Panel Style Modifications for SD-Webui
// @author       Container_Z
// @match        *://localhost:*/*
// @match        *://127.0.0.1:*/*
// @icon         https://container-z.art/assets/img/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462006/SD-Webui%E9%99%84%E5%8A%A0%E7%BD%91%E7%BB%9C%E9%9D%A2%E6%9D%BF%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/462006/SD-Webui%E9%99%84%E5%8A%A0%E7%BD%91%E7%BB%9C%E9%9D%A2%E6%9D%BF%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
var card_height = "12em";//卡片高度设置，留空则不修改
var card_width = "10em";//卡片宽度设置，留空则不修改
var card_info = "10px";//卡片描述文本的字体大小，留空则不修改'
var card_info_max_height = "75%";//描述文本的高度限制，留空则不修改

// ==============================样式初始化===================================
var inputcss = [
".extra-network-thumbs .card:hover .actions .name,.extra-network-thumbs .actions .name,.extra-network-cards .card .actions .name{max-height: "+card_info_max_height+"!important;font-size: "+card_info+"!important;}",//卡片文字描述不得高于卡片自身高度的百分之多少，并设置文字尺寸，
".extra-network-thumbs .card,.extra-network-cards .card {height: "+card_height+"!important;width: "+card_width+"!important;}",//修改卡片自身尺寸
].join("\n");

// ===============================样式注入=====================================
var metaList = document.getElementsByTagName("meta");
for (var i = 0; i < metaList.length; i++) {
    if (metaList[i].getAttribute("property") == "og:title"&&metaList[i].getAttribute("content") == "Stable Diffusion") {
        addstyle(inputcss,"cardstyle");
    }
}
// ===========================样式的加载与删除==================================
function addstyle(css,id)
{
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;
    style.innerHTML=css;
    if (document.getElementsByTagName('gradio-app').item(0).shadowRoot) {
        document.getElementsByTagName('gradio-app').item(0).shadowRoot.appendChild(style);
    } else {
        document.getElementsByTagName('gradio-app').item(0).appendChild(style);
    }
}

function delstyle(id)
{
    if (document.getElementsByTagName('gradio-app').item(0).shadowRoot) {
        document.getElementsByTagName('gradio-app').item(0).shadowRoot.removeChild(document.getElementById(id));
    } else {
        document.getElementsByTagName('gradio-app').item(0).removeChild(document.getElementById(id));
    }
}
// ================================快捷键设置=====================================
document.onkeydown = onKeyDown;
function onKeyDown()
{
    if ( window.event.ctrlKey && window.event.altKey) {//ctrl+alt快速开关卡片
        if (document.getElementsByTagName('gradio-app').item(0).shadowRoot) {
            document.getElementsByTagName('gradio-app').item(0).shadowRoot.getElementById("txt2img_extra_networks").click();
        } else {
            document.getElementsByTagName('gradio-app').item(0).getElementById("txt2img_extra_networks").click();
        }
    }
}
})();

