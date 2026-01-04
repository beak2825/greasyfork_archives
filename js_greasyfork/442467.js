// ==UserScript==
// @name         南加工具
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  for all
// @license      GPLv3
// @author       unascribed
// @match        *://bbs.summer-plus.net/*
// @match        *://www.spring-plus.net/*
// @match        *://www.level-plus.net/*
// @match        *://www.snow-plus.net/*
// @match        *://www.north-plus.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442467/%E5%8D%97%E5%8A%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/442467/%E5%8D%97%E5%8A%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const spIndex = {
        "main": "48",
        "prefix": "thread.php?fid=",
        "suffix": ".html",
        "deliIndex": 3,
    }
    const spPrefix = [
        "south",
        "north",
        "summer",
        "snow",
        "spring",
        "level",

    ]
    const hoverArgs = {
        "basic": "black",
        "dest": "rgb(52, 152, 219)",
    }
    const fontCss = {
        "fontWeight": "600",
        "fontFamily": "SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif",
    }
    const aCss = {
        "cursor": "pointer",
        "textDecoration": "none",
        "color": hoverArgs.basic,
    }
    const regToUse = {
        "bd": {
            "code": "提取码",
            "url": /https:[\w\/\.\?\-_&=]*/g,
            "urlStr": "pan.baidu.com",
            "codeStr": /[\w]*/,
        },
    }
    const webs = {
        "sp": "-plus",
    }
    const sp = {
        "spMsg": "action-read",
        "spRead": "thread",
        "spSell": "tid"
    }
    const spFont = {
        "basic": "rgb(255, 255, 255)",
        "dest": hoverArgs.dest,
    }
    function getSp() {
        if (!matchAny(spPrefix)) return;
        spInit()
        adapt(sp)
    }

    // current url
    const crtUrl = window.location.href

    for (let w in webs) {
        let re = webs[w];
        if (crtUrl.match(re) != null && crtUrl.match(re)[0] === re) {
            let methodName = "get" + w.replace(w[0], w[0].toUpperCase()) + "()"
            try {
                eval(methodName)
            } catch (ignore) {
            }
        }
    }

    function adapt(site) {
        for (let i in site) {
            let re = site[i];
            if (crtUrl.match(re) != null && crtUrl.match(re)[0] === re) {
                eval(i + "()")
            }
        }
    }
    //*********************** south-plus ***********************
    function spInit() {
        let barCss = spBarCss()
        let bar = spBar();
        let stuff = create("span", "main")
        let cp = clearPic(null, "span")
        let scrollBtn = create("span", "fall")
        scrollBtn.style.marginRight = "100px"
        addBefore(bar.bar, [stuff, cp, scrollBtn], bar.son)
        stuff.onclick = function () {
            let crt = window.location.href
            window.location.href = "https://" + crt.split("/")[2] + "/thread.php?fid=48&page=1"
            scrollDown()
        }
        scrollBtn.onclick = function () {
            scrollDown();
        }
        let arr = [scrollBtn, stuff, cp]
        wrapEles(arr, barCss, spFont)
    }
    function spBar() {
        let bar = ele("guide")
        return {
            "bar": bar,
            "son": eles("li", "tag", bar)[0]
        }
    }
    function spBarCss() {
        return {
            "color": "#ffffff",
            "float": "left",
            "marginTop": "7px",
            "display": "inline-block",
            "padding": "0px 10px",
            "fontWeight": "unset",
        }
    }
    //sp message
    function spMsg() {
        let btn = eles("current link5 b")[0]
        setText(btn, "点我跳转")
        let btnCss = {
            "fontSize": "13px",
        }
        wrapEle(btn, merge(btnCss, fontCss))
        btn.onclick = function () {
            gotoArticle()
        }
    }
    function gotoArticle() {
        let re = /http.*\w/g;
        let dest = eles("td1")[3].nextElementSibling;
        let sender = firstChild(eles("td1")[0].nextElementSibling).textContent

        if (sender == "SYSTEM" || sender == "3ccc287a") {
            dest = dest.getElementsByTagName("a")[0].href
        } else {
            dest = dest.textContent.match(re)[0]
        }
        window.open(dest.replace(dest.split("/")[2], crtUrl.split("/")[2]))
    }
    //sp mainpage order
    function spRead() {
        let btnCss = {
            "background": "#D6D6D6 transparent",
            "color": "#333333",
            "height": "18px",
            "padding": ".2em .6em",
            "display": "inline-block",
            "line-height": "16px",
            "fontSize": "12px",
            "cursor": "pointer",
            "textDecoration": "none"
        }
        let p = eles("fl")[6];
        let opts = eles("orderway", "name")[0].options
        for (let i = 0, len = opts.length; i < len; i++) {
            let btn = create("span");
            setText(btn, opts[i].textContent);
            setCss(btn, btnCss)
            p.appendChild(btn)
            btn.onclick = function () {
                spOrder(opts, i)
                scrollDown()
            }
            btn.onmousemove = function () {
                if (this.style.color == "rgb(51, 51, 51)") {
                    this.style.color = "#fff";
                    this.style.background = "#bbbbbb"
                }
            }
            btn.onmouseleave = function () {
                if (this.style.color == "rgb(255, 255, 255)") {
                    this.style.background = ""
                    this.style.color = "#333333";
                    this.style.background = "#D6D6D6 transparent"
                }
            }
        }
    }

    function spOrder(opts, i) {
        opts[i].selected = true;
        eles("btn")[0].click()
    }
    function spSell() {
        let sellLevel = [0, 1, 2, 3, 5]
        let candicates = eles("tpc_content")
        let total = candicates.length
        let p = candicates[total - 1]
        let s = eles("span", "tag", p)[1]
        let btnCss = {
            "display": "inline-block",
            "padding": "4px 8px",
            "position": "relative",
            "top": "35px",
        }
        for (let i = 0, len = sellLevel.length; i < len; i++) {
            let levelBtn = create("a");
            setText(levelBtn, levelBtn.value = sellLevel[i]);
            wrapEle(levelBtn, merge(btnCss, fontCss, aCss))
            p.appendChild(levelBtn)
            levelBtn.onclick = function () {
                doSpSell(levelBtn);
            }
        }
        let sellInput = create("input");
        sellInput.setAttribute("type", "text");
        sellInput.setAttribute("id", "linkInput");
        sellInput.setAttribute('placeholder', 'type link');
        let siCss = {
            "position": "relative",
            "top": "34px",
            "left": "10px",
            "border": "1px solid #3498db",
        }
        setCss(sellInput, merge(siCss, fontCss))
        p.appendChild(sellInput)

        let diyPrice = create("input");
        diyPrice.setAttribute("type", "text");
        let diyCss = {
            "left": "25px",
            "width":"26px",
            "height":"15px",
        }
        setCss(diyPrice, merge(siCss,diyCss))
        p.appendChild(diyPrice)
        diyPrice.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                doSpSell(this)
            }
        })

        let cdcs = eles("tipad")
        let cdcsSize = cdcs.length - 1
        let tipsParent = cdcs[cdcsSize]
        let tipsText = "(复制内容到输入框、再点击左侧的数字，即可生成对应数字价格的出售内容)"
        let diyText = "(自定义价格，在右边的小框中输入价格后按回车)"
        let tips = create("span", tipsText);
        let diyTips = create("span", diyText);
        let tipCss = {
            "position": "relative",
            "top": "-32px",
            "left": "132px",
            "fontSize": "12px",
        }
        let diyTipsCss = {
            "top": "-60px",
            "left": "-47px",
        }
        setCss(tips, tipCss)
        setCss(diyTips, merge(tipCss,diyTipsCss))
        tipsParent.appendChild(tips)
        tipsParent.appendChild(diyTips)

    }
    function doSpSell(btn) {
        let price = btn.value;
        let link = ele("linkInput").value;
        let text = eles("textarea", "tag")[0].value
        if (text) {
            eles("textarea", "tag")[0].value += "\n"
        }
        let msg = "";
        if (link.match(regToUse.bd.urlStr)) {
            let mt = link.match(regToUse.bd.url)
            msg = mt[0] + "\n";
            link = getBdCode(link)
        }
        msg += "[sell=" + price + "]" + link;
        msg += "[/sell]"
        eles("textarea", "tag")[0].value += msg;
    }


    //************* tool *******************
    function scrollBtn(parent = null) {
        let btn = create("a", "fall")
        if (parent) {
            parent.appendChild(btn)
        }
        let btnCss = {
            "marginLeft": "5px",
            "display": "inline-block",
        }
        wrapEle(btn, btnCss)
        btn.onclick = function () {
            scrollDown(900);
        }
        return btn;
    }
    //scroll
    function scrollDown(offset = 1399) {
        document.documentElement.scrollTop = offset;
    }

    function clearPic(parent = null, type = "a") {
        let clear = "clear";
        let resume = "resume";
        let btn = create(type, clear)
        if (parent) {
            parent.appendChild(btn)
        }
        let btnCss = {
            "display": "inline-block",
        }
        let flag = true;
        let oldDisplays = []
        wrapEle(btn, btnCss)
        btn.onclick = function () {
            let imgs = eles("img", "tag");
            let dp = imgs[0].style.display;
            if (!flag && oldDisplays.length > 0) {
                for (let i = 0, len = imgs.length; i < len; i++) {
                    imgs[i].style.display = oldDisplays[i]
                }
                flag = true;
                setText(btn, clear)
            } else {
                if (oldDisplays.length == 0) {
                    for (let i = 0, len = imgs.length; i < len; i++) {
                        oldDisplays.push(imgs[i].style.display);
                    }
                }
                for (let i = 0, len = imgs.length; i < len; i++) {
                    imgs[i].style.display = "none"
                }
                flag = false;
                setText(btn, resume)
            }
        }
        return btn;
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
    //set hover
    function hover(ele, args = hoverArgs) {
        let basic = args.basic;
        let dest = args.dest;
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
    function hovers(eles, args = hoverArgs) {
        eles.forEach(ele => {
            hover(ele, args)
        });
    }
    function setText(ele, name = "login") {
        ele.textContent = name
    }

    function newBtn(text = null) {
        return text ? create("button", text) : create("button", "login");
    }
    function create(type, text = null) {
        let ele = document.createElement(type)
        if (text) ele.textContent = text;
        return ele;
    }
    function setCss(ele, styles = {}) {
        if (!styles) {
            console.log("setCss不能为空!")
        }
        for (let i in styles) {
            ele.style[i] = styles[i];
        }
    }
    function setCsses(eles, styles) {
        eles.forEach(ele => {
            setCss(ele, styles)
        });
    }
    function wrapEle(ele, styles = {}, args = hoverArgs) {
        setCss(ele, merge(fontCss, aCss, styles))
        hover(ele, args)
    }
    function wrapEles(eles, styles = {}, args = hoverArgs) {
        eles.forEach(ele => {
            wrapEle(ele, styles, args)
        })
    }
    function addChildren(parent, children) {
        children.forEach(child => {
            parent.appendChild(child)
        });
    }
    function addBefore(parent, children, before) {
        children.forEach(child => {
            parent.insertBefore(child, before)
        });
    }
    function spGoto(target, needRemoveTail = false, idx = spIndex.deliIndex, deli = "/") {
        gotoUrl(target, needRemoveTail, idx, deli)
    }
    function gotoUrl(target, needRemoveTail, idx, deli) {
        let newUrl = crtUrl.replace(crtUrl.split(deli)[idx], target)
        if (needRemoveTail) {
            newUrl = removeTail(newUrl, target)
        }
        window.location.href = newUrl
    }
    function gotoUrlReg(target, reg) {
        window.location.href = crtUrl.replace(reg, target)
    }
    function removeTail(url, seg) {
        return url.substr(0, url.indexOf(seg) + seg.length)
    }
    function firstChild(p, layer = 1) {
        let temp = p;
        for (let i = 0; i < layer; i++) {
            temp = temp.firstElementChild
        }
        return temp;
    }
    function buildUrl(target, index) {
        return target.prefix + index + target.suffix;
    }
    function matchAny(prefixes) {
        let flag = false;
        prefixes.forEach(prefix => {
            if (crtUrl.match(prefix)) {
                flag = true;
                return;
            }
        });
        return flag;
    }
    function merge() {
        let arr = [...arguments]
        if (arr.length == 1) return arr;
        let target = {}
        arr.forEach(obj => {
            for (let p in obj) {
                target[p] = obj[p]
            }
        });
        return target;
    }
    function getBdCode(link) {
        let idx = link.indexOf(regToUse.bd.code)
        if (idx > -1) {
            link = link.substr(idx)
            return link;
        }
        let lkArr = link.split(" ")
        if (lkArr) {
            let len = lkArr.length
            let matched = 0;
            for (let i = 0; i < len; i++) {
                if (lkArr[i].match(regToUse.bd.codeStr)) {
                    matched = i;
                    break;
                }
            }
            if (matched > 0) {
                link = "";
                for (let i = matched; i < len; i++) {
                    link += lkArr[i]
                }
            }
        }
        return link;
    }
})();