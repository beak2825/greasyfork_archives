// ==UserScript==
// @name        E-Hentai / nHentai highlight thumb when open Anthology gallery
// @name:zh-CN        E-Hentai / nHentai highlight thumb when open Anthology gallery
// @name:zh-TW        E-Hentai / nHentai highlight thumb when open Anthology gallery
// @name:ja        E-Hentai / nHentai highlight thumb when open Anthology gallery
// @namespace   E-Hentai_highlight_thumb_when_open_Anthology_gallery_from_tag_artist
// @supportURL  https://github.com/zhuzemin
// @description highlight and navigate to artist work first thumb when open "Anthology gallery" from search page with tag "artist"
// @description:zh-CN highlight and navigate to artist work first thumb when open "Anthology gallery" from search page with tag "artist"
// @description:zh-TW highlight and navigate to artist work first thumb when open "Anthology gallery" from search page with tag "artist"
// @description:ja highlight and navigate to artist work first thumb when open "Anthology gallery" from search page with tag "artist"
// @include     https://exhentai.org/g/*
// @include     https://e-hentai.org/g/*
// @include     https://nhentai.net/g/*
// @include     https://en.nyahentai3.com/g/*
// @include     https://zh.nyahentai.co/g/*
// @include     https://ja.nyahentai.net/g/*
// @include     https://zh.nyahentai.pro/g/*
// @include     https://ja.nyahentai.org/g/*
// @include     https://zh.nyahentai4.com/g/*
// @version     1.43
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @connect-src e-hentai.org
// @connect-src exhentai.org
// @connect-src proud-surf-e590.zhuzemin.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/394266/E-Hentai%20%20nHentai%20highlight%20thumb%20when%20open%20Anthology%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/394266/E-Hentai%20%20nHentai%20highlight%20thumb%20when%20open%20Anthology%20gallery.meta.js
// ==/UserScript==
var config = {
    'debug': false
}
var debug = config.debug ? console.log.bind(console) : function () {
};

//for avoid exhentai login require
var cloudFlareUrl = 'https://proud-surf-e590.zhuzemin.workers.dev/ajax/';

var searchStatus = 0;
class E_hentai {
    constructor(keyword) {
        this.method = 'GET';
        this.url = "https://e-hentai.org/?f_search=" + keyword;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
    }
}
class Exhentai {
    constructor(keyword) {
        this.method = 'GET';
        this.url = "https://exhentai.org/?f_search=" + keyword;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
    }
}
class CloudFlare {
    constructor(keyword) {
        this.method = 'GET';
        this.url = "https://proud-surf-e590.zhuzemin.workers.dev/ajax/https://exhentai.org/?f_search=" + keyword;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
    }
}

class Gallery {
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

var GetArtistStartImg = function () {
    debug("Start: GetArtistStartImg");
    let object=null;
    if (document.referrer.includes("/tag/artist:") || window.location.href.includes("#/tag/artist:") || document.referrer.includes("/artist/")) {
        var taglist;
        var links;
        if (document.referrer.includes("/artist/")) {

            taglist = document.querySelector('#tags');
            links = taglist.querySelectorAll("a.tag");
        }
        else {
            taglist = document.querySelector('#taglist');
            links = taglist.querySelectorAll("a");

        }
        for (var link of links) {
            var tag = link.innerText;
            if (tag.includes('anthology')) {
                debug(tag);
                /*var title=document.querySelector("#gn").textContent;
                debug("Title: "+title);
                if(title.toLowerCase().includes("anthology")||(title.toLowerCase().match(/^comic/)!=null)){*/
                var artist;
                if (document.referrer.includes("/artist/")) {
                    artist = document.referrer.match(/\/artist\/([\d\w\-]*)/)[1].replace("-", " ");
                }
                else {
                    try {
                        artist = document.referrer.match(/\/tag\/artist:([\d\w\+]*)/)[1].replace("+", " ");
                    } catch (e) {
                        artist = window.location.href.match(/\/tag\/artist:([\d\w\+]*)/)[1].replace("+", " ");
                    }
                }
                debug("Artist: " + artist);
                var divs = document.querySelectorAll("div.c1");
                for (var div of divs) {
                    var comment = div.querySelector("div.c6");
                    debug(comment);
                    if (comment.innerHTML.toLowerCase().includes(artist)) {
                        /*var links=comment.querySelectorAll("a");
                        debug(links);
                        for(var a of links){
                          var textContent=a.textContent.toLowerCase();
                          if(textContent.includes(artist)){
                            var array=textContent.match(/(\d{1,4})/);
                            debug(array);
                            if(array!=null){
                              var ArtistStartImg=parseInt(array[1]);
                              debug("ArtistStartImg: "+ArtistStartImg);
                              var object={
                                "ArtistStartImg":ArtistStartImg,
                                "artist":artist
                              }
                              return object;
                            }
                          }
                        }*/
                        let ArtistStartImg=null;
                        if (comment.innerHTML.toLowerCase().includes('https://')){
                            let names=comment.innerText.split("…");
                            let count=0;
                            for(let name of names){
                                if(name.match(/\w+/)!=null){
                                    debug('name: '+name);
                                    if(name.toLowerCase().includes(artist)){
                                        debug('count: '+count);
                                        break;
                                    }
                                    count++;
                                }
                            }
                            let urls=comment.querySelectorAll('a');
                            let artistUrl=urls[count];
                            debug('artistUrl: '+artistUrl);
                            ArtistStartImg = artistUrl.href.match(/\d*-(\d{1,4})/)[1];
                        }
                        else{
                            var lines = comment.innerText.split("\n");
                            debug(lines);
                            for (var line of lines) {
                                var line = line.toLowerCase();
                                if (line.includes(artist)) {
                                    var array = line.match(/(\d{1,4})/);
                                    debug(array);
                                    if (array != null) {
                                        ArtistStartImg = parseInt(array[1]);
                                    }
                                }
                            }                        
                        }
                        debug("ArtistStartImg: " + ArtistStartImg);
                        object = {
                            "ArtistStartImg": ArtistStartImg,
                            "artist": artist
                        }
                        break;
                    }
                }
                break;
            }
            else if (link == links[links.length - 1]) {
                debug("End: GetArtistStartImg");
                break;
            }
        }
    }
    return object;
}


GetCurrentPageTotalImg = function () {
    debug("Start: GetCurrentPageTotalImg");
    var divs;
    if (document.referrer.includes("/artist/")) {
        divs = document.querySelectorAll("div.thumb-container");
    }
    else {

        divs = document.querySelectorAll("div.gdtl");
    }
    debug(divs);
    if (divs != null) {
        var CurrentPageTotalImg = divs.length;
        debug("CurrentPageTotalImg: " + CurrentPageTotalImg);
        var object = {
            "CurrentPageTotalImg": CurrentPageTotalImg,
            "divs": divs
        }
        return object;
    }
    debug("End: GetCurrentPageTotalImg");
    return null;
}

CreateStyle = function () {
    debug("Start: CreateStyle");
    var style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
.glowbox {
     background: #4c4c4c; 
    //width: 400px;
    margin: 40px 0 0 40px;
    padding: 10px;
    -moz-box-shadow: 0 0 5px 5px #FFFF00;
    -webkit-box-shadow: 0 0 5px 5px #FFFF00;
    box-shadow: 0 0 5px 5px #FFFF00;
}
`;
    debug("Processing: CreateStyle");
    var head = document.querySelector("head");
    head.insertBefore(style, null);
    debug("End: CreateStyle");
}

init = function () {
    debug("init");
    //nhentai
    if (!/(https:\/\/e(-|x)hentai\.org\/g\/[\d\w]*\/[\d\w]*\/)/.test(window.location.href)) {
        debug("nhentai");
        var info = document.querySelector('#info');
        var title;
        try {
            title = info.querySelector("h2").innerText;

        }
        catch (e) {
            title = info.querySelector("h1").innerText;
        }
        title = encodeURIComponent('"' + title.replace(' ', '+') + '"');
        exhentai = new Exhentai(title);
        e_hentai = new E_hentai(title);
        cloudflare = new CloudFlare(title);
        request(exhentai, SearchGallery);
    }
    var interval = setInterval(function () {
        var cdiv = document.querySelector('#cdiv');
        if (cdiv != null || searchStatus != 0) {
            clearInterval(interval);
            if (cdiv != null) {
                var ObjectArtistStartImg = GetArtistStartImg();
                var ArtistStartImg = ObjectArtistStartImg.ArtistStartImg;
                if (ArtistStartImg != null) {
                    var ObjectCurrentPageTotalImg = GetCurrentPageTotalImg();
                    var CurrentPageTotalImg = ObjectCurrentPageTotalImg.CurrentPageTotalImg;
                    var ArtistStartImgInCurrentPage = ArtistStartImg % CurrentPageTotalImg;
                    if (ArtistStartImgInCurrentPage == 0) {
                        ArtistStartImgInCurrentPage = CurrentPageTotalImg - 1;
                    }
                    else {
                        ArtistStartImgInCurrentPage -= 1;
                    }
                    debug("ArtistStartImgInCurrentPage: " + ArtistStartImgInCurrentPage);
                    //e-hentai
                    if (!document.referrer.includes("/artist/")) {
                        if (window.location.href.includes("#/tag/artist:")) {
                            ArtistStartImg = ArtistStartImgInCurrentPage;
                        }
                        var CorrectPage;
                        if (ArtistStartImg == 0) {
                            CorrectPage = 0;
                        }
                        else {
                            CorrectPage = Math.ceil(ArtistStartImg / CurrentPageTotalImg) - 1;
                        }
                        debug("CorrectPage: " + CorrectPage);
                        if (CorrectPage != 0) {
                            window.location.href += "?p=" + CorrectPage + "#/tag/artist:" + ObjectArtistStartImg.artist;

                        }

                    }
                    CreateStyle();
                    var div = ObjectCurrentPageTotalImg.divs[ArtistStartImgInCurrentPage];
                    var img = div.querySelector("img");
                    img.className += " glowbox";
                    debug(div);
                    div.scrollIntoView();

                }

            }

        }
    }, 2000);
}

window.addEventListener('DOMContentLoaded', init);


function SearchGallery(responseDetails) {
    var responseText = responseDetails.responseText;
    if (responseText != null && responseText.length < 200 || !responseDetails.finalUrl.includes('.workers.dev')) {
        request(cloudflare, SearchGallery);
        return;
    }
    else if (responseText != null && responseText.length < 200 && responseDetails.finalUrl.includes('.workers.dev')) {
        request(e_hentai, SearchGallery);
        return;

    }
    var href = responseText.match(/(https:\/\/e(-|x)hentai\.org\/g\/[\d\w]*\/[\d\w]*\/)/)[1];
    debug("href: " + href);
    if (href != null) {
        /*var dom = new DOMParser().parseFromString(responseText, "text/html");
        var div = dom.getElementsByClassName('itg')[0];
        var href = div.querySelector('a').href;*/
        var url;
        if (responseDetails.finalUrl.includes('.workers.dev')) {
            url = cloudFlareUrl + href;
        }
        else {
            url = href;
        }
        var gallery = new Gallery(url);
        debug("SearchGallery");
        request(gallery, GetComments);
    }
    else {
        searchStatus = 2;
    }
}

function GetComments(responseDetails) {
    var responseText = responseDetails.responseText;
    var dom = new DOMParser().parseFromString(responseText, "text/html");
    var comments = dom.querySelector("#cdiv");
    comments.style.color = "#34495e";
    var content = document.querySelector("#content");
    var related = content.querySelector("#related-container");
    debug("GetComments");
    content.insertBefore(comments, related);
    var link = document.createElement("link");
    link.innerHTML = `<link rel="stylesheet" type="text/css" href="https://e-hentai.org/z/0347/g.css">`;
    var head = document.querySelector("head");
    head.insertBefore(link, null);
    searchStatus = 1;
}
function request(object, func) {
    GM_xmlhttpRequest({
        method: object.method,
        url: object.url,
        headers: object.headers,
        overrideMimeType: object.charset,
        timeout: 60000,
        //synchronous: true
        onload: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails);
        },
        ontimeout: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails);

        },
        ononerror: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails);

        }
    });
}
