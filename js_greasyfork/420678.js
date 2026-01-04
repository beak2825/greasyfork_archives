// ==UserScript==
/*jshint esversion: 6 */
// @name         南+跳转自己域名对应的其他资源网站
// @namespace    http://tampermonkey.net/dva
// @version      1.1.1
// @description  针对不同域名的网站，替换成自己使用的域名再打开。
// @author       Dva
// @match        *://*.south-plus.net/read.php?tid*
// @match        *://*.north-plus.net/read.php?tid*
// @match        *://*.summer-plus.net/read.php?tid*
// @match        *://*.level-plus.net/read.php?tid*
// @match        *://*.south-plus.org/read.php?tid*
// @match        *://*.white-plus.net/read.php?tid*
// @match        *://*.snow-plus.net/read.php?tid*
// @match        *://*.imoutolove.me/read.php?tid*
// @match        *://*.spring-plus.net/read.php?tid*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/420678/%E5%8D%97%2B%E8%B7%B3%E8%BD%AC%E8%87%AA%E5%B7%B1%E5%9F%9F%E5%90%8D%E5%AF%B9%E5%BA%94%E7%9A%84%E5%85%B6%E4%BB%96%E8%B5%84%E6%BA%90%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/420678/%E5%8D%97%2B%E8%B7%B3%E8%BD%AC%E8%87%AA%E5%B7%B1%E5%9F%9F%E5%90%8D%E5%AF%B9%E5%BA%94%E7%9A%84%E5%85%B6%E4%BB%96%E8%B5%84%E6%BA%90%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 把"hjd"冒号右边的双引号里替换成你用的2048域名，把"ch"冒号右边的双引号里替换成你用的村花地址，如果你使用的和我的一样则不用替换
    const doms={
        "hjd":"hp.ytu7.life", //2048网址 https://替换为中间这部分/2048/
        "ch":"www.cunhua.sbs", //村花网址 https://替换为中间这部分/thread/
    };
    const regs={
        "hjd":"2048",
        "ch1":"cunhua",
        "ch2":"huo.wtf",
    }
    const re = /\d{4,}\d/g;

    const aCss = {
        "cursor": "pointer",
        "textDecoration": "none",
        "color": "black",
    }
    const fontCss = {
        "fontWeight": "600",
        "fontFamily": "SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif",
    }
    const lang = {
        "one":"打开",
        "all":"打开所有",
    }

    let readTopic = document.getElementById("read_tpc");
    let links = readTopic.getElementsByTagName("a");
    if(links.length > 0){
        let hasBasic = false;
        for(let l of links){
             if(isBasic(l)){
                 hasBasic = true;
             }
        }
        if(hasBasic){
            //添加打开全部链接的按钮
            let btnCss = {
                "marginLeft":"10px",
                "fontSize":"15px",
                "position":"relative",
            }
            const topic = ele("subject_tpc").parentNode;
            const allBtn = create("a",lang.all);
            wrapEle(allBtn,btnCss)
            allBtn.style.top = "1px"
            allBtn.onclick=function(){
                openAll(links);
            }
            topic.appendChild(allBtn);
            //添加每个打开链接的按钮
            for(let l=0;l<links.length;l++){
                if(isBasic(links[l])){
                    let btn = create("a",lang.one);
                    wrapEle(btn,btnCss)
                    btn.style.top = "-1px"
                    btn.onclick=function(){
                        openSingle(links[l]);
                    };
                    readTopic.insertBefore(btn,links[l].nextSibling);
                }
            }
        }
    }
    //打开全部链接
    function openAll(links){
        for(let link of links){
            openSingle(link)
        }
    }

    //打开单个链接
    function openSingle(link){
        if(isHjd(link)){
            window.open(link.href.replace(link.href.split("/")[2],doms.hjd));
        }else if(isCh(link)){
            window.open("https://"+doms.ch+"/thread-"+link.href.match(re)[0]+"-1-1.html");
        }
    }

    //判断是否是hjd的链接
    function isHjd(link){
        return link.href.split("/")[3]==regs.hjd;
    }

    //判断是否是cunhua
    function isCh(link){
        let reg1 = new RegExp(regs.ch1);
        let reg2 = new RegExp(regs.ch2);
        return reg1.test(link) || reg2.test(link);
    }

    //判断是否是2048或cunhua的帖子
    function isBasic(link){
        return isHjd(link) || isCh(link);
    }
    //设置hover
    function hover(ele, basic = "black", dest = "rgb(52, 152, 219)") {
        ele.onmousemove = function () {
            if (this.style.color == basic) {
                this.style.color = dest;
            }
        }
        ele.onmouseleave = function () {
            if (this.style.color == dest) {
                this.style.color = basic;
            }
        }
    }
    function hovers(eles, basic = "black", dest = "rgb(52, 152, 219)") {
        eles.forEach(ele => {
            hover(ele, basic, dest)
        });
    }
    function create(type, text = null) {
        let ele = document.createElement(type)
        if (text) ele.textContent = text;
        return ele;
    }
    function setCss(ele, styles=null) {
        if(!styles) return;
        for (var i in styles) {
            ele.style[i] = styles[i];
        }
    }
    function setCsses(eles, styles) {
        eles.forEach(ele => {
            setCss(ele, styles)
        });
    }
    function setFont(ele) {
        setCss(ele, fontCss)
    }
    function wrapEle(ele, styles=null, basic = "black", dest = "rgb(52, 152, 219)") {
        setFont(ele)
        setCss(ele, aCss)
        setCss(ele, styles)
        hover(ele, basic, dest)
    }
    function ele(id, parent = null) {
        return parent ? parent.getElementById(id) : document.getElementById(id)
    }
    function eles(name, type = "cls", parent = null) {
        if (parent) {
            switch (type) {
                case "cls":
                    return parent.getElementsByClassName(name);
                case "name":
                    return parent.getElementsByName(name);
                case "tag":
                    return parent.getElementsByTagName(name);
            }
        } else {
            switch (type) {
                case "cls":
                    return document.getElementsByClassName(name);
                case "name":
                    return document.getElementsByName(name);
                case "tag":
                    return document.getElementsByTagName(name);
            }
        }
    }
})();