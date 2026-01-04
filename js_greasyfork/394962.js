// ==UserScript==
// @name        nhentai show comments
// @namespace   nhentai_comments
// @supportURL  https://github.com/zhuzemin
// @description nHentai show comment(Comment from Exhentai)
// @include     https://nhentai.net/g/*
// @include     https://en.nyahentai3.com/g/*
// @include     https://zh.nyahentai.co/g/*
// @include     https://ja.nyahentai.net/g/*
// @include     https://zh.nyahentai.pro/g/*
// @version     1.11
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src e-hentai.org
// @connect-src exhentai.org
// @connect-src proud-surf-e590.zhuzemin.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/394962/nhentai%20show%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/394962/nhentai%20show%20comments.meta.js
// ==/UserScript==
var config = {
    'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

class E_hentai{
    constructor(keyword) {
        this.method = 'GET';
        this.url = "https://e-hentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search="+keyword+"&f_apply=Apply+Filter&advsearch=";
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
    }
}
class Exhentai{
    constructor(keyword) {
        this.method = 'GET';
        this.url = "https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search="+keyword+"&f_apply=Apply+Filter&advsearch=";
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
    }
}
class CloudFlare{
    constructor(keyword) {
        this.method = 'GET';
        this.url = "https://proud-surf-e590.zhuzemin.workers.dev/ajax/https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search="+keyword+"&f_apply=Apply+Filter&advsearch=";
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
    }
}

class Gallery{
    constructor(href) {
        this.method = 'GET';
        this.url = href;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
    }
}
var exhentai;
var e_hentai;
var cloudFlareUrl='https://proud-surf-e590.zhuzemin.workers.dev/ajax/';
var init = function () {
    //setInterval(function(){
    var info = document.querySelector('#info');
    var title=info.querySelector("h1").innerText;
    exhentai=new Exhentai(title);
    e_hentai=new E_hentai(title);
    cloudflare=new CloudFlare(title);
    debug("init");
    request(exhentai,SearchGallery);
    //}, 2000)
}

function SearchGallery(responseDetails) {
    var responseText=responseDetails.responseText;
    if(responseText.length<200||responseDetails.finalUrl.includes('.workers.dev')){
        request(cloudflare,SearchGallery);
        return;
    }
    else if(responseText.length<200&&responseDetails.finalUrl.includes('.workers.dev')){
        request(e_hentai,SearchGallery);
        return;

    }
    var href=responseText.match(/(https:\/\/e(-|x)hentai\.org\/g\/[\d\w]*\/[\d\w]*\/)/)[1];
    debug("href: "+href);
    /*var dom = new DOMParser().parseFromString(responseText, "text/html");
    var div = dom.getElementsByClassName('itg')[0];
    var href = div.querySelector('a').href;*/
    var gallery = new Gallery(cloudFlareUrl+href);
    debug("SearchGallery");
    request(gallery,GetComments);
}

function GetComments(responseDetails) {
    var responseText=responseDetails.responseText;
    var dom = new DOMParser().parseFromString(responseText, "text/html");
    var comments=dom.querySelector("#cdiv");
    comments.style.color="#34495e";
    var content=document.querySelector("#content");
    var related=content.querySelector("#related-container");
    debug("GetComments");
    content.insertBefore(comments,related);
    var link=document.createElement("link");
    link.innerHTML=`<link rel="stylesheet" type="text/css" href="https://e-hentai.org/z/0347/g.css">`;
    var head=document.querySelector("head");
    head.insertBefore(link,null);
}
function request(object,func) {
    var retries = 10;
    GM_xmlhttpRequest({
        method: object.method,
        url: object.url,
        headers: object.headers,
        overrideMimeType: object.charset,
        //synchronous: true
        onload: function (responseDetails) {
            if (responseDetails.status != 200) {
                // retry
                if (retries--) {          // *** Recurse if we still have retries
                    setTimeout(request(),2000);
                    return;
                }
            }
            debug(responseDetails);
            //Dowork
            func(responseDetails);
        }
    });
}
window.addEventListener('DOMContentLoaded', init);
