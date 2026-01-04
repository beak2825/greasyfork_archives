// ==UserScript==
// @name        nhentai show Tag in main page
// @name:ja        nhentai show Tag in main page
// @name:zh-TW         nhentai show Tag in main page
// @name:zh-CN        nhentai show Tag in main page
// @namespace   nhentai_display_and_highlight_tag_with_thumbnail
// @supportURL  https://github.com/zhuzemin
// @description nhentai show Tag in main page, and highlight/block tag
// @description:zh-CN nhentai show Tag in main page, and highlight/block tag
// @description:zh-TW  nhentai show Tag in main page, and highlight/block tag
// @description:ja nhentai show Tag in main page, and highlight/block tag
// @include     https://nhentai.net/*
// @include     https://en.nyahentai3.com/*
// @include     https://zh.nyahentai.co/*
// @include     https://ja.nyahentai.net/*
// @include     https://zh.nyahentai.pro/*
// @include     https://ja.nyahentai.org/g/*
// @include     https://zh.nyahentai4.com/g/*
// @include     https://zh.bughentai.com/g/*
// @include     https://zh.bughentai.com/*
// @include     https://nyahentai.club/g/*
// @include     https://nyahentai.club/*
// @include     https://ja.cathentai.com/g/*
// @include     https://ja.cathentai.com/*
// @version     1.53
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src zh.nyahentai4.com
// @connect-src ja.nyahentai.org
// @connect-src zh.nyahentai.pro
// @connect-src ja.nyahentai.net
// @connect-src zh.nyahentai.co
// @connect-src en.nyahentai3.com
// @connect-src nhentai.net
// @connect-src nyahentai.org
// @downloadURL https://update.greasyfork.org/scripts/394936/nhentai%20show%20Tag%20in%20main%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/394936/nhentai%20show%20Tag%20in%20main%20page.meta.js
// ==/UserScript==
var config = {
    'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

// setting User Preferences
function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
        var val = prompt(promtText, GM_getValue(varName, defaultVal));
        if (val === null)  { return; }  // end execution if clicked CANCEL
        // prepare string of variables separated by the separator
        if (sep && val){
            var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
            var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
            //val = val.replace(pat1, sep).replace(pat2, '');
        }
        //val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
        GM_setValue(varName, val);
        // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
        //if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
        //else location.reload();
    });
}

// prepare UserPrefs
setUserPref(
    'highlights',
    'chinese;',
    'Set Highlight Tags',
    `Set highlights, split with ";". Example: "mmf threesome; chinese"`,
    ','
);
setUserPref(
    'BlackList',
    'english;',
    'Set BlackList',
    `Set BlackList, split with ";". Example: "chinese; yaoi"`,
    ','
);


CreateStyle=function(){
    debug("Start: CreateStyle");
    var style=document.createElement("style");
    style.setAttribute("type","text/css");
    style.innerHTML=`
.glowbox {
     background: #4c4c4c; 
    //width: 400px;
    //margin: 40px 0 0 40px;
    //padding: 10px;
    -moz-box-shadow: 0 0 5px 5px #FFFF00;
    -webkit-box-shadow: 0 0 5px 5px #FFFF00;
    box-shadow: 0 0 5px 5px #FFFF00;
}
`;
    debug("Processing: CreateStyle");
    var head=document.querySelector("head");
    head.insertBefore(style,null);
    debug("End: CreateStyle");
}
class Gallery{
    constructor(href,other=null) {
        this.method = 'GET';
        this.url = href;
        this.headers = {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': window.location.href,
        };
        this.charset = 'text/plain;charset=utf8';
        this.other=other;
    }
}
var BlackListLast=[];
var highlightsLast=[];
var DivCount;
function HighlightTag(responseDetails,divs){
    //debug("HighlightTag");
    var dom;
    if(responseDetails!=null){
        var responseText=responseDetails.responseText;
        dom = new DOMParser().parseFromString(responseText, "text/html");

    }
    var highlights;
    var BlackList;
    try{
        highlights=GM_getValue("highlights").trim().replace(/;$/,"").split(";");
        BlackList=GM_getValue("BlackList").trim().replace(/;$/,"").split(";");
    }catch(e){
        debug("Not set GM_Value.");
    }
    if (BlackList == undefined||BlackList.length ==0) {
        BlackList = [];
    }
    if (highlights == undefined||highlights.length ==0) {
        highlights = [];
    }
    debug("BlackList: " + BlackList);
    if(responseDetails!=null||JSON.stringify(BlackList)!=JSON.stringify(BlackListLast)||JSON.stringify(highlights)!=JSON.stringify(highlightsLast)){

        var taglist;
        var NewDivs;
        if(responseDetails==null){
            NewDivs = divs;
        }
        else{
            NewDivs=[0];
        }
        //debug("NewDivs.length: "+NewDivs.length);
        for(var i=0;i<NewDivs.length;i++){
            var Break=false;
            var div;
            if(responseDetails!=null){
                div=divs[DivCount];
                taglist = dom.querySelector('#tags');

            }
            else{
                div=divs[i];
                taglist = div.querySelector('#tags');

            }
            //debug(taglist);
            var links = taglist.querySelectorAll("a.tag");
            //debug(links);
            if(responseDetails!=null||JSON.stringify(BlackList)!=JSON.stringify(BlackListLast)){
                for (var link of links) {
                    var tag = link.innerText.toLowerCase().match(/([\w\s]*)/)[1].trim();
                    //debug("Tag: "+tag);
                    for (var BlackWord of BlackList) {
                        if (BlackWord.length > 1) {
                            if (tag == BlackWord.trim()) {
                                debug("BlackWord: " + link.innerText);
                                div.className += " blacklisted";
                                Break=true;
                                break;
                            }
                            else if (link==links[links.length-1]&&BlackWord == BlackList[BlackList.length - 1]) {
                                div.className = div.className.replace(" blacklisted", "");
                            }
                        }
                        else{
                            div.className = div.className.replace(" blacklisted", "");

                        }
                    }
                    if (Break) {
                        break;
                    }
                }

            }
            if(responseDetails!=null||JSON.stringify(highlights)!=JSON.stringify(highlightsLast)){
                for (var link of links) {
                    var tag = link.innerText.toLowerCase().match(/([\w\s]*)/)[1].trim();
                    //debug("Tag: "+tag);
                    for (var highlight of highlights) {
                        if (highlight.length > 1) {
                            //debug("Highlight: "+highlight);
                            if (tag == highlight.trim()) {
                                debug("highlight: " + link.innerText);
                                link.className += " glowbox";
                                break;
                            }
                            else if (highlight == highlights[highlights.length - 1]) {
                                link.className = link.className.replace(" glowbox", "");
                            }
                        }
                        else{
                            link.className = link.className.replace(" glowbox", "");

                        }
                    }
                }

            }

            if(responseDetails!=null) {
                var a = div.querySelector("a");
                a.replaceChild(taglist, a.querySelector("#tags"));
                let favorite=dom.querySelector('a.btn.btn-primary.btn-disabled.tooltip');
                if(favorite!=null){
                    a.insertBefore(favorite,a.lastChild);

                }
                DivCount++;
            }
        }
        if(responseDetails!=null) {

            if (DivCount < divs.length) {
                MainWoker(divs);
            }
        }
        debug("BlackListLast: "+BlackListLast);
        debug("highlightsLast: "+highlightsLast);
        highlightsLast=highlights;
        BlackListLast=BlackList;
    }

}

function MainWoker(divs){
    debug("MainWoker");
    var div=divs[DivCount];
    div.style.maxHeight = "900px";
    div.style.height = "900px";
    var a = div.querySelector("a");
    var img = a.querySelector("img");
    var data_src=img.getAttribute("data-src");
    img.setAttribute("src",data_src);
    div.insertBefore(img, a);
    a.style.overflow = "auto";
    a.style.maxHeight = 900 - img.offsetHeight + "px";
    var caption = a.querySelector("div.caption");
    caption.style.position = "static";
    var taglist = document.createElement("section");
    taglist.setAttribute("id", "tags");
    a.insertBefore(taglist, null);
    var href = div.querySelector('a').href;
    //debug(href);
    var gallery = new Gallery(href);
    gallery.other=divs;
    request(gallery,HighlightTag);

}
var init = function () {
    var LastDivNum=0;
    CreateStyle();
    DivCount=0;
    var html = document.querySelector('html');
    setInterval(function(){
        var divs = html.querySelectorAll('div.gallery');
        //debug("DivNum: "+divs.length);
        if(LastDivNum<divs.length) {
            html.style.height=divs.length/5*900+"px";
            debug("html.style.height: "+html.style.height);
            MainWoker(divs);
        }
        LastDivNum=divs.length;
        HighlightTag(null,divs);
    }, 2000)
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
                    setTimeout(request,2000);
                    return;
                }
            }
            //debug(responseDetails);
            //Dowork
            func(responseDetails,object.other);
        }
    })
}

window.addEventListener('DOMContentLoaded', init);
