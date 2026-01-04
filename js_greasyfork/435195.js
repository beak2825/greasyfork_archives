// ==UserScript==
// @name        cnki辅助
// @description 自动给知网论文的网页添加标题、一键复制参考文献。本脚本永久开源免费,仅供合法使用,禁止用于任何商业的,侵权的,非法的用途.
// @match *://*.cnki.net/KXReader/*
// @match *://*.cnki.net/KCMS*/*
// @match *://*.cnki.net/kcms*/*
// @match *://*.cnki.net/KNS8/*
// @match *://115.239.174.206:8081/*/KXReader/*
// @match *://115.239.174.206:8081/*/KCMS*/*
// @match *://115.239.174.206:8081/*/kcms*/*
// @match *://115.239.174.206:8081/*/KNS8/*
// @icon         http://cnki.net/favicon.ico
// @require      https://greasyfork.org/scripts/435697-myutils/code/myUtils.js?version=1142271
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @compatible   firefox
// @license      MIT
// @namespace    https://greasyfork.org/users/718683
// @author       runwithfaith
// @version 0.0.1.20231120044401
// @downloadURL https://update.greasyfork.org/scripts/435195/cnki%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/435195/cnki%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
//重构:解耦后只保留拷贝ref功能.如果是ref页,click后复制并提示.否则如果是html页,提供按钮指向iframe
;(function(){
    const sc=GM_setClipboard,n=GM_notification,as=GM_addStyle,
          href=location.href,host=location.host,path=location.pathname;
    as(`*{
            user-select: text !important
        }#GLSearch{
            display:none!important;
        }`);
    if(path.includes("KNS8")){
        as(`html{display:none!important}`);
        onload=document.querySelector('[displaymode="GBTREFER"]').click();
    }else if(path.toLowerCase().includes('kcms')){//学位论文页
        setBottom(document.title=document.title.replace(/\s*\-\s*(中国知网)$/,''));
    }else{//html论文页
        const btn=my.addBtns('ref',()=>{
            const ref=ifr.contentDocument.querySelector('#result').innerText;
            sc(ref)&n({
                title: host,
                text: ref,
                timeout: 3000,
            });
        })[0],//拷贝ref
              ifr=my.append('iframe',btn,'',`src`,document.querySelector('#aexport').href/**/,`scrolling`,"no",`style`,"width: 0;height: 0;");
        document.title=document.querySelector('.title').innerText.replace(/\s/g,'');
        setBottom(document.title);
    }
    function setBottom(txt){
        document.body.insertAdjacentHTML('afterend','<span id="titleSpan" style="background: black;color: white;z-index:999999;position: fixed;bottom: 0px;left: 0px;text-align: left;opacity: 0.7;width: 100%;">'+txt+'<span>');
    }
})();