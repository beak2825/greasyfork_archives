// ==UserScript==
// @name         archiveOrgAssistant
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  download books from archive.org 
// @author       mooring@codernote.club
// @match        https://archive.org/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archive.org
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460562/archiveOrgAssistant.user.js
// @updateURL https://update.greasyfork.org/scripts/460562/archiveOrgAssistant.meta.js
// ==/UserScript==

function getConfig(bookid){
    let ele = document.createElement('a');
    let cookies = document.cookie.split('; ');
    let regxp =new RegExp('^(logged-in-user|donation-identifier|logged-in-sig|PHPSESSID|loan-'+bookid+'|br-resume-%40)','i');
    let conf = [
        "DON'T EDIT THIS FILE MANUALLY archive.org book downloader 0.22 by mooring@live.com",
        "get the downloader from https://github.com/mooring/archive.org.book.downloader",
        "then following the constructions",
        "============================================================================",
    ];
    let proxy = '';
    cookies.forEach(i=>{
        if(regxp.test(i)){
            if(i.indexOf('br-resume-')!=-1){
                i = 'br-resume='+i.split('=')[0]
            }
            conf.push(i.replace(/(logged-in-|-identifier)/i,'').replace('-'+bookid,''));
        }
    });
    if(!/\/details\/\w+/i.test(location.pathname)){
        alert("Working on book loan page only");
        return;
    }
    let img = document.querySelector('.BRpagecontainer .BRpageimage');
    if(!img){
        alert("Please fresh page and try again");
        return;
    }
    let url = new URL(img.src);
    let zipm = url.search.match(/=\/(\d+)\/items\//);
    if(url.search.indexOf('&server='+url.hostname) != -1){
        alert("Please borrow the book first!");
        return;
    }
    let title = document.title.split(/\s*:\s*/g).slice(0,-2).join(':').replace(/[\r\n]+/g,' ');
    let lproxy = localStorage.getItem('archiveAssistant_proxy');
    proxy = prompt("Input proxy string like http://127.0.0.1:8899, if no proxy keep it empty", lproxy || '');
    localStorage.setItem('archiveAssistant_proxy', proxy||'');
    conf.push('title='+title);
    conf.push('authority='+url.hostname);
    conf.push('path='+location.pathname);
    conf.push('bookid='+bookid);
    conf.push('zipnum='+(zipm?zipm[1]:'29'));
    conf.push('proxy='+(proxy?proxy.replace(/[\r\n\t\s]+/g,''): ''));
    conf.push("=========================================================");
    conf.push("version: 0.1");
    conf.push("author : https://codernote.club");
    ele.style.display = 'none';
    ele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(conf.join('\n')));
    ele.setAttribute('download', 'config.conf');
    document.body.appendChild(ele);
    ele.click();
    document.body.removeChild(ele);
}

(function() {
    'use strict';
    let bookid = location.pathname.split('/details/')[1].split('/')[0];
    GM_registerMenuCommand("get Configuration", function(evt, keybord){
        let cookie = document.cookie;
        if(/logged-in-sig=[^;]+/.test(cookie) && /logged-in-user=[^;]+/.test(cookie)){
            getConfig(bookid);
        }
    });
    GM_registerMenuCommand("get Downloader", function(evt, keybord){
        window.open('https://github.com/mooring/archive.org.book.downloader');
    });
})();