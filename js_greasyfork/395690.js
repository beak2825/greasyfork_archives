// ==UserScript==
// @name        eyny_highlight_720p
// @name:zh-CN         eyny_highlight_720p
// @name:zh-TW         eyny_highlight_720p
// @namespace   eyny_highlight_720p
// @supportURL  https://github.com/zhuzemin
// @description video.eyny.com highlight 720p video
// @description:zh-TW  video.eyny.com highlight 720p video
// @description:zh-CN video.eyny.com highlight 720p video
// @include     http://video.eyny.com/channel/*
// @include     http://video.eyny.com/*/playlist?list=*
// @include     http://video.eyny.com/*/tag/*
// @include     http://video.eyny.com/playlist?list=*
// @include     http://video.eyny.com/tag/*
// @version     1.21
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src video.eyny.com
// @downloadURL https://update.greasyfork.org/scripts/395690/eyny_highlight_720p.user.js
// @updateURL https://update.greasyfork.org/scripts/395690/eyny_highlight_720p.meta.js
// ==/UserScript==
var config = {
    'debug':false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};

class ObjectRequest{
    constructor(href) {
        this.method = 'GET';
        this.url = href;
        this.data=null,
            this.headers = {
                'User-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0',
                //'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Referer': window.location.href,
            };
        this.charset = 'text/plain;charset=utf8';
        this.other=null;
    }
}

var count=0;

function MainWorker(){
    var img_boxs=document.querySelectorAll("td.img_box");
    for(var img_box of img_boxs){
        var resolution=img_box.querySelectorAll("font")[1].innerText;
        if(resolution=="720"){
            debug("Highlight.");
            img_box.querySelector('p').className+=" glowbox";
        }
    }
}
function HandlePlaylist(divs) {
    debug(count);
    var img_box=divs[count];
    var img_div_width=img_box.querySelector('div.img_div_width');
    debug(img_div_width);
    var img_div_height=img_div_width.querySelector('div.img_div_height');
    debug(img_div_height);
    var href=img_div_height.querySelector("a").href;
    debug(href);
    var obj=new ObjectRequest(href);
    request(obj,function (responseDetails) {
        var responseText=responseDetails.responseText;
        var dom = new DOMParser().parseFromString(responseText, "text/html");
        var fixwidths=dom.querySelectorAll('div.fixwidth');
        debug("fixwidths.length: "+fixwidths.length);
        if(fixwidths.length==3) {
            var Playlist = fixwidths[2];
            var Sub_img_boxs = Playlist.querySelectorAll("td.img_box");
            for (var Sub_img_box of Sub_img_boxs) {
                var resolution = Sub_img_box.querySelectorAll("font")[1].innerText;
                if (resolution == "720") {
                    debug("Highlight.");
                    img_box.className += " glowbox";
                    break;
                }
            }
        }
        if(count<divs.length){
            count++;
            HandlePlaylist(divs);
        }

    });

}
var init = function () {
    debug("init");
    CreateStyle();
    if(/http:\/\/video\.eyny\.com\/(\w*\/)?tag\//.test(window.location.href)){
        var fixwidths=document.querySelectorAll('div.fixwidth');
        if(fixwidths.length==4){
            var Playlist=fixwidths[2];
            var img_boxs=Playlist.querySelectorAll("td.img_box");
            debug("img_boxs.length: "+img_boxs.length);
            HandlePlaylist(img_boxs);
        }
    }
    MainWorker();
}
window.addEventListener('DOMContentLoaded', init);

function request(object,func) {
    var retries = 3;
    debug(object.url);
    try {


        GM_xmlhttpRequest({
            method: object.method,
            url: object.url,
            data: object.data,
            headers: object.headers,
            overrideMimeType: object.charset,
            timeout: 120000,
            //synchronous: true
            onload: function (responseDetails) {
                debug(responseDetails);
                if (responseDetails.status != 200 && responseDetails.status != 302) {
                    // retry
                    if (retries--) {          // *** Recurse if we still have retries
                        setTimeout(request, 2000);
                        return;
                    }
                }
                //Dowork
                func(responseDetails, object.other);
            },
            ontimeout: function (responseDetails) {
                debug(responseDetails);
                //Dowork
                func(responseDetails, object.other);

            },
            ononerror: function (responseDetails) {
                debug(responseDetails);
                //Dowork
                func(responseDetails, object.other);

            }
        })
    }
    catch(e){
        debug("Error: "+e)
    }
}

function CreateStyle(){
    debug("Start: CreateStyle");
    var style=document.createElement("style");
    style.setAttribute("type","text/css");
    style.innerHTML=`
.glowbox {
     //background: #4c4c4c; 
    //width: 400px;
    margin: 40px 0 0 40px;
    padding: 10px;
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
