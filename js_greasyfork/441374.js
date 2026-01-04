// ==UserScript==
// @name           去除页面中刺眼的白色
// @namespace      https://greasyfork.org/zh-CN/users/798733-bleu
// @description    支持自定义颜色,修改代码中的 #F6F4EC 为你喜欢的颜色
// @version        1.0.2
// @author         bleu
// @compatible     edge Tampermonkey
// @compatible     chrome Tampermonkey
// @compatible     firefox Tampermonkey
// @license        MIT
// @include        *://*
// @icon           https://fastly.jsdelivr.net/gh/Bleu404/PRPO@latest/png/color.png
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/441374/%E5%8E%BB%E9%99%A4%E9%A1%B5%E9%9D%A2%E4%B8%AD%E5%88%BA%E7%9C%BC%E7%9A%84%E7%99%BD%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/441374/%E5%8E%BB%E9%99%A4%E9%A1%B5%E9%9D%A2%E4%B8%AD%E5%88%BA%E7%9C%BC%E7%9A%84%E7%99%BD%E8%89%B2.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var color = "#F6F4EC";
    var customMode = {
        "greasyfork.org": ["#additional-info",".user-content"],
        "segmentfault.com": ["#root"],
        "www.baidu.com": [".s_form"],
        "baike.baidu.com": [".content-wrapper", ".basic-info.J-basic-info.cmn-clearfix", ".para-title.level-2.J-chapter"],
        "cn.bing.com":["#id_hbfo"],
        "jingyan.baidu.com":["#search-box"],
        "tieba.baidu.com":["#pb_content",".l_post.l_post_bright.j_l_post.clearfix"],
    }
    var customModeDel = {
        "www.acfun.cn": "#ACPlayer",
        "www.bilibili.com": "#bilibiliPlayer",
        "v.qq.com": ".container_inner", 
        "www.iqiyi.com": "#flashOutter",
        "www.youtube.com":".ytp-progress-bar"
    }
    changeAllElementsColor(document);
    fixAutoPage();
    siteChangeColor();
    if(isChangeColor(rgb2hex(document.body.style.backgroundColor))){
        document.body.style.backgroundColor = color;
    }
    function rgb2hex(rgb) {
        if (rgb=="") return [0];
        rgb = rgb.match(/^rgb.?\((\d+),\s*(\d+),\s*(\d+).*\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        if(!rgb)return[0];
        return [hex(rgb[1]),hex(rgb[2]),hex(rgb[3])];
    }
    function isChangeColor(hexcolor){
        return hexcolor.every((item)=>parseInt(item, 16)>0xf0);
    }
    function getRGB(hex,num){
        return 'rgb(' + (parseInt('0x' + hex.slice(1, 3))-num) + ',' + (parseInt('0x' + hex.slice(3, 5))-num)
          + ',' + (parseInt('0x' + hex.slice(5, 7))-num) + ')';
    }
    function changeElementColor(node){
        if (node.style.backgroundColor === getRGB(color,0)||node.getAttribute("type")==="checkbox")return
        if (customModeDel[location.host]) {
            var temp = document.querySelector(customModeDel[location.host]);
            if (temp && temp.contains(node)) {
                return;
            }
        }
        var temo = document.defaultView.getComputedStyle(node, "").getPropertyValue("background-Color");
        if (isChangeColor(rgb2hex(temo))) {
            node.style.setProperty('background', `radial-gradient(${getRGB(color,0)},${getRGB(color,15)})`,'important');
            node.style.setProperty('color','black');
        }
    }
    function changeAllElementsColor(node) {
        var alltags = node.all ? node.all : node.getElementsByTagName("*");
        var len = alltags.length;
        for (var i = 0; i < len; i++) {
            changeElementColor(alltags[i]);
        }
    }
    function fixAutoPage() {
        try {
            var observer = new window.MutationObserver(function (mutations) {
                for (let mutation of mutations) {
                    if (mutation.type === 'childList') {
                        changeAllElementsColor(mutation.target);
                    }
                }
            });
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        } catch (e) {
            console.log("sha diao baidu ! ! ! ! ! !");
            document.addEventListener('DOMNodeInserted', function (mutation) {
                if (!mutation.target.style) {
                    return;
                }
                changeElementColor(mutation.target);
            }, true);
        }
    }
    function siteChangeColor() {
        if (customMode[location.host]) {
            customMode[location.host].forEach((item) => {
                document.querySelectorAll(item).forEach((node) => {
                    node.style.background = `radial-gradient(${getRGB(color,0)},${getRGB(color,15)})`;
                })
            });
        }
    }
})();
