// ==UserScript==
// @name         【通用-跳转】跳转电脑版
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  用于一些网站自动跳转电脑版
// @author       You
// @match        *://finance.sina.cn/*
// @match        *://k.sina.cn/*
// @match        *://news.sina.cn/*
// @match        *://*.sina.cn/*

// @match        *://m.pipaw.com/*
// @match        *://m.kalvin.cn/*

// @match        *://wap.gamersky.com/*

// @match        *://3g.ali213.net/*
// @match        *://mip.ali213.net/*

// @match        *://m.diyiyou.com/*

// @match        *://m.sohu.com/*

// @match        *://m.news.4399.com/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473574/%E3%80%90%E9%80%9A%E7%94%A8-%E8%B7%B3%E8%BD%AC%E3%80%91%E8%B7%B3%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473574/%E3%80%90%E9%80%9A%E7%94%A8-%E8%B7%B3%E8%BD%AC%E3%80%91%E8%B7%B3%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let url = window.location.href;
    let domain = document.domain;

    let pcUrl = "";

    //*************************************************************************************
    //----------------------------------------函数：匹配规则
    //*************************************************************************************

    function getPcUrl() {
        //新浪
        //https://news.sina.cn/2023-08-21/detail-imzhycna5519710.d.html
        //https://news.sina.com.cn/gov/xlxw/2023-08-21/doc-imzhycna5519710.shtml
        ///["']?__webURL["']?:["']?(.*?)["']?/
        if (domain.includes('sina.cn')) {
            console.log('[跳转电脑版] 新浪');
            let webURL = "";

            let scripts = document.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                let script = scripts[i];
                let scriptText = script.innerHTML;
                console.log('scriptText的内容为：' + scriptText);

                // 判断是否包含__webURL
                if (scriptText && scriptText.includes('__webURL')) {
                    // 提取__webURL的内容
                    /*
                    let start = scriptText.indexOf('"__webURL":"') + 12;
                    let end = scriptText.indexOf('","', start);
                    webURL = scriptText.substring(start, end);
                    */

                    //"__webURL":"https:\/\/news.sina.com.cn\/gov\/xlxw\/2023-08-21\/doc-imzhycna5519710.shtml",
                    webURL = /["']?__webURL["']?\s*:\s*(.*?),/.exec(scriptText);

                    console.log('__webURL的内容为：' + webURL[1]);


                    break;//跳出循环
                }
                else {
                    console.log('无__webURL');
                }
            }

            pcUrl = webURL[1]
                .replace(/\\/g, "")
                .replace(/\"/g, "")
                .replace(/\'/g, "");
        }



        //琵琶网
        //http://m.pipaw.com/xin/520410.html
        //http://www.pipaw.com/xin/520410.html
        else if (domain.includes('m.pipaw.com')) {
            console.log('[跳转电脑版] 琵琶网');
            pcUrl = url
                .replace("m.pipaw.com","www.pipaw.com");

        }

        //琵咖绿茵手游站
        //https://m.kalvin.cn/gl/45240.html
        //https://www.kalvin.cn/gl/45240.html
        else if (domain.match('m.kalvin.cn')) {
            console.log('[跳转电脑版] 咖绿茵手游站');
            pcUrl = url
                .replace('m.kalvin.cn','www.kalvin.cn');

        }



        //游民星空、游侠网、第一手游网、4399
        //https://wap.gamersky.com/news/Content-1635505.html
        //https://www.gamersky.com/news/202308/1635505.shtml
        else if (domain.match(
            /(wap.gamersky.com|(3g|mip).ali213.net|m.diyiyou.com|m.news.4399.com)/
        )) {
            console.log('[跳转电脑版] 游民星空、游侠网、第一手游网、4399');
            // 根据rel="canonical"查找link元素
            var canonicalLinkCanonical = document.querySelector('head link[rel="canonical"]');

            // 获取href属性的值
            var hrefContentCanonical = canonicalLinkCanonical.getAttribute('href');

            pcUrl = hrefContentCanonical;
        }







    }
    console.log('[跳转电脑版] url：'+url);
    console.log('[跳转电脑版] pcUrl：'+pcUrl);



    //*************************************************************************************
    //----------------------------------------函数：运行
    //*************************************************************************************
    function goPcUrl() {
        if (url !== pcUrl && pcUrl !== "") {
            window.location.replace(pcUrl);
        }
        else if (url !== pcUrl && pcUrl === ""){
            getPcUrl();
        }
        else if (pcUrl === ""){
            console.log('[跳转电脑版] 获取pcUrl失败');
        }
    }


    //*************************************************************************************
    //----------------------------------------函数：右下按键样式
    //*************************************************************************************
    function addButton(innerHTML, bottom, onClick) {
        var mybutton = document.createElement("div");
        var body = document.querySelector("body");
        body.appendChild(mybutton);
        mybutton.innerHTML = innerHTML;
        mybutton.style.position = "fixed";
        mybutton.style.bottom = bottom;
        mybutton.style.right = "10px";
        mybutton.style.width = "50px";
        mybutton.style.height = "50px";
        mybutton.style.background = "black";
        mybutton.style.opacity = "0.75";
        mybutton.style.color = "white";
        mybutton.style.textAlign = "center";
        mybutton.style.lineHeight = "50px";
        mybutton.style.cursor = "pointer";
        mybutton.style.zIndex = "999999";
        // 设置点击事件
        mybutton.onclick = onClick;
    }


    //*************************************************************************************
    //----------------------------------------调用按钮
    //*************************************************************************************
    addButton("goPC", "150px", function() {
        setInterval(goPcUrl, 1000);
    });




})();


