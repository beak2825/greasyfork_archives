// ==UserScript==
// @name         聚bt秒传链接优化
// @namespace    jason.shaw
// @version      1.3.0
// @description  实现聚bt的115和百度网盘妙传链接，文件名的自动化处理（将完整的名字引入，将密码内嵌），以及关键信息的悬停复制
// @note         1.3.0 版本 修复百度妙传链接正则规则
// @note         1.2.9.1版本 对特殊115内容文件名做扰码处理（解压密码为：pao8.org的115内容做扰码）
// @note         1.2.9版本 对特殊115内容文件名做扰码处理（解压密码为：se114.org的115内容做扰码）
// @note         1.2.8版本 适配jubt网站更换 -》bbs.jubt.live
// @note         1.2.7版本 修复适配网站，将百度秒链，做了一个标题后换行的问题，原关键内容下移一行
// @note         1.2.6版本 优化增强：对多115秒链增加自动创建目录功能（先转存，再转移合并-》自动归入目录）
// @note         1.2.5版本 修正网站中有些115秒链，没有换行，造成多行错误融合的情况,顺道修正了无密码的情况
// @note         1.2.4版本 修正网站中没有秒链区块不存在或者innerText文本不存在，造成过度处理导致内容被过滤的问题
// @note         1.2.3版本 对于jubt bbs，个别秒链并不在pre标签内，增加倒数第四个p的选择
// @note         1.2.2版本 修正磁链超链正则，避免在磁链超链文本化时，匹配过渡（横跨多个链接），顺手支持
// @note         1.2.1版本 修正磁链正则，支持32位密钥，同时兼容&和&amp;，顺手支持pao8.gq
// @note         1.2.0版本 同逻辑支持聚bt姊妹站色聚seju.ga
// @note         1.1.7版本 修复多行秒传链接时，换行被消除的问题，以及正则匹配超过一行问题
// @note         1.1.6版本 百度秒链，个别文件名无扩展名问题
// @note         1.1.5版本 修复磁链超链化尾部问题（支持&dn=...型磁链）
// @note         1.1.4.1版本 支持的网址，排除列表，仅对单页处理
// @note         1.1.4版本 修复部分页面无磁链超链，正则引发假死问题（排除法）
// @note         1.1.3版本 增加过滤主标题中的&避免作为文件名无法保存或者破坏秒传链接
// @note         1.1.2版本 过滤主标题中的/与|#避免作为文件名无法保存或者破坏秒传链接
// @note         1.1版本对已经成为链接的磁链做特别处理，避免破坏原有链接
// @note         1.0版本增加了站内无秒传，但有磁链的处理——文本变链接，同时支持延时悬停复制，并优化了悬停代码
// @author       JasonShaw
// @include      https://bbs.jubt.fun/thread-*.htm
// @include      https://seju.ga/*
// @include      https://www.pao8.live/*
// @include      https://1fuli.top/*
// @icon         https://bbs.jubt.live/favicon.ico
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/427278/%E8%81%9Abt%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/427278/%E8%81%9Abt%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var timer = null;
    var mainTitleObj = document.querySelector('h4.break-all')||document.querySelector('h1.article-title');//兼容
    var mainTitle = mainTitleObj.textContent.trim().replace(/(\s+)|\/|\||#]/g,'-').replace(/&/g,'+');
    hoverDelayCopy(mainTitleObj,500,mainTitle);//增加延时悬停复制功能
    //console.log(mainTitle);
    //处理磁力链
    //#body > div > div > div.col-lg-9.main > div.card.card-thread > div > div.message.break-all
    var messageObj = document.querySelector('div.message.break-all')||document.querySelector('article.article-content');
    //console.log(messageObj.innerHTML);
    //先把已经是链接的磁链文本还原为文本（去超链），然后再统一将问题处理掉
    //magnet:?xt=urn:btih:d694dec90bdeef39de2e898c8ddc165241282992
    if(document.querySelector('a[href^="magnet:?xt=urn:btih:"]')){//先判断是否存在超链的磁力链接，然后再处理，避免卡死
        //console.log(123);
        messageObj.innerHTML = messageObj.innerHTML.replace(/<[Aa]\s+([^<>]*?\s+)*?href\s*=\s*(['"])(magnet:\?xt=urn:btih:.+?)\2(\s+.*?\s*)*?>.+?<\/[Aa]>/gm,'$3');
    }
    //console.log(messageObj.innerHTML);
    messageObj.innerHTML = messageObj.innerHTML.replace(/(magnet:\?xt=urn:btih:[0-9a-zA-Z]{32,40})((&amp;|&)\w+=[^<\s]+)*/gm,'<a href="$1$2" class="magnet">$1$2</a>');
    //console.log(messageObj.innerHTML);
    var magnetsArr = document.querySelectorAll(".magnet");
    //alert(magnetsArr.length);
    for(let i = 0;i < magnetsArr.length; i++){
        //console.log(typeof magnetsArr[i]);
        hoverDelayCopy(magnetsArr[i],500,magnetsArr[i].href);//增加延时悬停复制功能
    }
    //return false;
    //console.log(superlinkObj.innerHTML);

    try {
        var superlinkObj = document.querySelector('pre')||document.querySelector('div.message.break-all p:nth-last-child(4)');//pre.prettyprint
        //console.log(superlinkObj.innerHTML);
        if(!superlinkObj) return false;//如果秒链区块整体不存在，则无需再做处理
        if(superlinkObj.innerHTML == '秒传链接：') superlinkObj = document.querySelector('div.message.break-all p:nth-last-child(3)');//适配网站，将百度秒链，做了一个标题后换行的问题
        var pwObj = superlinkObj.nextElementSibling;
        var pw = pwObj ? pwObj.textContent.trim():'';
        pw = pw.indexOf('密码') > -1? pw :'';
        mainTitle = (pw.indexOf('se114') > -1 || pw.indexOf('pao8') > -1) ? strInsert(mainTitle) : mainTitle;
        if(pwObj) {
            hoverDelayCopy(pwObj,500,pw);//增加延时悬停复制功能
        }
        //console.log(pw);
        //alert(superlinkObj);
        //console.log(superlinkObj.innerHTML);
        //console.log(superlinkObj.innerText);
        //console.log(222);
        if (superlinkObj.innerText !=null) {
            var superLinks = superlinkObj.innerText + '';//隐式将不论 null或者空字符串都转换为字符串，保证trim函数不报错，且.length属性不报错
            if(superLinks.trim().length < 1) return false;//秒链所在区块文本不存在的时，无需再做秒链处理
            //var re115 = /115:\/\/(.*?)(\.[^\|\n]+\|)/gm;
            var re115 = /115:\/\/(.*?)(\.[^\|\n]+\|)(\d+\|[0-9A-Z]+\|[0-9A-Z]+)(\|[^\|\n]+)?/gm;
            var reBd =/(.+#.*#)(.*#)?([^\.\n]*)(\..*)?/gm;
            var arr = superLinks.match(re115);
            if(arr && arr.length > 0){
                if(arr.length == 1){//仅有一个115秒传链接，则替换文件名为主标题+密码
                    superLinks = superLinks.replace(re115,"115://"+mainTitle+"("+pw+")$2$3");
                }
                else {//超过1个115秒传，则替换文件名为原文件名+密码
                    //superLinks = superLinks.replace(re115,"\n115://$1("+pw+")$2").replace(/^\n/,'');
                    superLinks = superLinks.replace(/(?<!\n)115:\/\//g,"\n115://").replace(/^\n/,'');
                    //superLinks = superLinks.replace(re115,"115://$1("+pw+")$2");
                    superLinks = superLinks.replace(re115,"115://$1$2$3|"+mainTitle+"("+pw+")");//在以“|”分割的第四节后增加第五节作为目录，让多个115妙传自动归入同一目录
                }
            }
            //console.log(superLinks);
            arr = superLinks.match(reBd);
            //console.log(arr);
            if(arr && arr.length > 0){
                if(arr.length == 1){//仅有一个百度秒传链接，则替换文件名为主标题+密码
                    superLinks = superLinks.replace(reBd,"$1$2"+mainTitle+"("+pw+")$4");
                } else {//超过1个百度秒传，则替换文件名为原文件名+密码
                    superLinks = superLinks.replace(reBd,"$1$2$3("+pw+")$4");
                }
            }
            superLinks = superLinks.replace(/\(\)/g,'');//如果无密码，则会出现空括号，这里去除掉
            //console.log(superLinks);
            superlinkObj.innerText = superLinks;
            //console.log(superlinkObj.innerHTML);
            GM_setClipboard(superLinks);
            //console.log("秒传链接已复制："+superLinks);
            hoverDelayCopy(superlinkObj,500,superLinks);//增加延时悬停复制功能

        }
    } catch(e){
        console.log(e);
    }
    function hoverDelayCopy(obj,ms,text){
        try{
            //增加延时悬停复制功能，超过500毫秒（0.5s）悬停，则复制，否则不复制,并在复制成功时变粉色示意（后恢复黑色）
            var oBackGround = obj.style.background;
            obj.addEventListener("mouseenter",function(event) {
                clearTimeout(timer);
                timer = setTimeout(function(){
                    GM_setClipboard(text);
                    event.target.style.background = "pink";
                },ms);
            }, false);
            obj.addEventListener("mouseleave",function(event) {
                clearTimeout(timer);
                event.target.style.background = oBackGround;
            }, false);
        } catch(e){console.error(e);}
    }
    function strInsert(str, length, seporator) {
        length = length || 1;//设置默认间隔为 1
        seporator = seporator || "無";//设置默认扰码（分割符）^_^ 逰 泪 覩 徧 寔 寘 刪 获
        let reg = new RegExp("[\a-\z\A-\Z0-9\u4E00-\u9FA5]{1," + length + "}", "g");//中文、英文、数字
        let ma = str.match(reg);
        return ma.join(seporator);
    }

    // console.log(strInsert("张三12e恩爱ee123", 1));

})();