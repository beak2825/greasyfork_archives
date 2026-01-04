// ==UserScript==
// @name        video_background
// @name:zh-CN         video_background
// @name:zh-TW         video_background
// @name:ja        video_background
// @namespace   video_background
// @supportURL  https://github.com/zhuzemin
// @description:zh-CN  use video as page background
// @description:zh-TW  use video as page background
// @description:ja  use video as page background
// @description use video as page background
// @include     https://*
// @include     http://*
// @exclude     *://*.jpg
// @exclude     *://*.gif
// @exclude     *://*.png
// @exclude     *://*.mp4
// @exclude     *://*.swf
// @exclude     *://*.pdf
// @exclude     https://anime1.me
// @version     1.94
// @grant       GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @connect-src 127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/395910/video_background.user.js
// @updateURL https://update.greasyfork.org/scripts/395910/video_background.meta.js
// ==/UserScript==
var config = {
    'debug':false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};
var host='http://127.0.0.1/';
var bgColor='#D8E0E0';
var rndStart=true;
var videoList;
var dirList;
var urlRoot;
var usedList=[];
var dirCount=0;
var hostname;
var textColorList;
var ytbList;
var ytbEnable;
// prepare UserPrefs
setUserPref(
    'urlRoot',
    host+'******',
    'Set root url',
    `Url from HFS.(.mp4 or dir)`,
    ','
);
setUserPref(
    'ytbPlaylistUrl',
    'https://www.youtube.com/playlist?list=PLmlTcWwPyp188O1lK2fyYA_WFckZNrb0b',
    'Set Youtube Playlist url',
    `Youtube Playlist url`,
    ','
);
/*setUserPref(
    'textBGcolorOpacity',
    '0.95',
    'Set Text BG-Color Opacity',
    `Opacity: `,
    ','
);*/

class ObjectRequest{
    constructor(url) {
        this.method = 'GET';
        this.url = url;
        this.data=null,
            this.headers = {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                //'Accept': 'application/atom+xml,application/xml,text/xml',
                //'Referer': window.location.href,
            };
        this.charset = 'text/plain;charset=utf8';
        this.other=null;
    }
}

var init = function () {
    if (window.self === window.top || window.location.href.includes('https://www.youtube.com/embed/')) {
        textBGcolorOpacity = GM_getValue('textBGcolorOpacity');
        if (textBGcolorOpacity == undefined || textBGcolorOpacity == '') {
            textBGcolorOpacity = 0.95;
        }
        else{
            textBGcolorOpacity=parseFloat(textBGcolorOpacity);
        }
        ytbEnable = GM_getValue('ytbEnable');
        if (ytbEnable != undefined) {
            if (ytbEnable == 'true') {
                ytbEnable = true;

            }
            else if (ytbEnable == 'false') {
                ytbEnable = false;
            }
        }
        ytbList = GM_getValue('ytbList');
        if (ytbList == undefined || ytbList == '') {
            ytbList = [];
        }
        urlRoot = GM_getValue('urlRoot');
        if (urlRoot == undefined || urlRoot == '') {
            urlRoot = null;
        }
        videoList = GM_getValue('videoList');
        if (videoList == undefined || videoList == '') {
            videoList = [];
        }
        /*dirList = GM_getValue('dirList');
        if (dirList == undefined || dirList == '') {
            dirList = [];
        }
        debug(dirList);*/
        var blockList = GM_getValue('blockList');
        if (blockList == undefined || blockList == '') {
            blockList = [];
        }
        else {
            blockList= blockList.filter(function(item, pos) {
                return blockList.indexOf(item) == pos;
            })
        }
        debug('blockList: '+blockList);
        textColorList = GM_getValue('textColorList');
        if (textColorList == undefined || textColorList == '') {
            textColorList = [];
        }
        else {
            textColorList= textColorList.filter(function(item, pos) {
                return textColorList.indexOf(item) == pos;
            })
        }
        debug('textColorList: '+textColorList);

        /*var lastTime=GM_getValue('lastTime')||0;
        var present=parseInt(new Date(). getTime()/1000);
        debug(present-parseInt(lastTime));
        if(present-parseInt(lastTime)>86400){
            videoList=[];
            dirList=[];
            GM_setValue('lastTime',present);
            GM_setValue('videoList',JSON.stringify(videoList));
            GM_setValue('dirList',JSON.stringify(dirList));
        }*/
        if (!window.location.href.includes('https://www.youtube.com/embed/')) {

            hostname = getLocation(window.location.href).hostname;
            CreateButton('Text BG-color', function () {
                var index = textColorList.indexOf(hostname);
                var divList = document.querySelectorAll('div');
                if (index == -1) {

                    for (var div of divList) {
                        div.style.backgroundColor = bgColor;
                        //div.style.opacity=textBGcolorOpacity;
                    }
                        textColorList.push(hostname);
                }
                else {
                    for (var div of divList) {
                        div.style.backgroundColor = '';
                        //div.style.opacity=1;
                    }
                    textColorList.splice(index, 1);

                }
                debug('textColorList: '+textColorList);
                GM_setValue('textColorList', textColorList);

            }, 36);
            CreateButton('Clear file list', function () {
                dirList = [];
                videoList = [];
                ytbList = [];
                GM_setValue('videoList', videoList);
                GM_setValue('dirList', dirList);
                GM_setValue('ytbList', ytbList);
            }, 72);

            CreateButton('Add/Del Block List', function (e) {
                var msg;
                var index = blockList.indexOf(hostname);
                if (index > -1) {
                    blockList.splice(index, 1);
                    msg = 'Del Success';
                }
                else {
                    blockList.push(hostname);
                    msg = 'Add Success';
                }
                GM_setValue('blockList', blockList);
                e.target.innerHTML = msg;
                setTimeout(function () {
                    e.target.innerHTML = 'Add/Del Block List';
                }, 1000);
            }, 108);

            CreateButton('Youtube Enable/Disable', function (e) {
                var msg;
                if (ytbEnable) {
                    ytbEnable = false;
                    msg = 'Youtube Disable';
                }
                else {
                    ytbEnable = true;
                    msg = 'Youtube Enable';
                }
                GM_setValue('ytbEnable', ytbEnable);
                e.target.innerHTML = msg;
                setTimeout(function () {
                    e.target.innerHTML = 'Youtube Enable/Disable';
                }, 1000);
            }, 144);

            if (!blockList.includes(hostname)) {
                if (urlRoot != null && !ytbEnable) {
                    urlRoot = urlRoot.replace(/http:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\//, host);
                    if (/\.mp4$/.test(urlRoot)) {
                        insertVideo(urlRoot);
                    }
                    else {
                        if (videoList.length == 0) {
                            //var obj = new ObjectRequest(urlRoot);
                            var obj = new ObjectRequest(urlRoot + '?tpl=list&folders-filter=\\\\&recursive');
                            request(obj, HandleHFS);
                            debug(urlRoot);

                        }
                        else {
                            videoShuffle(insertVideo);

                        }

                    }
                }
                else if (ytbEnable) {
                    if (ytbList.length == 0) {
                        var ytbPlaylistUrl = GM_getValue('ytbPlaylistUrl');
                        if (ytbPlaylistUrl == undefined || ytbPlaylistUrl == '') {
                            ytbPlaylistUrl = null;
                        }
                        if (ytbPlaylistUrl != null) {
                            ytbPlaylistUrl = ytbPlaylistUrl.match(/https:\/\/www.youtube.com\/playlist\?list=(.*)$/);
                            if (ytbPlaylistUrl != null) {
                                ytbPlaylistUrl = ytbPlaylistUrl[1];
                                ytbPlaylistUrl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=' + ytbPlaylistUrl + '&key=AIzaSyAbzugt7o1RRhBVDyPyZxZTeriH-3Ogtkg';

                                debug('ytbPlaylistUrl: ' + ytbPlaylistUrl);
                                var obj = new ObjectRequest(ytbPlaylistUrl);
                                request(obj, function (respObj) {
                                    var json = JSON.parse(respObj.responseText);
                                    debug('json: ' + json);
                                    for (var item of json.items) {
                                        var videoId = item.snippet.resourceId.videoId;
                                        var videoUrl = 'https://www.youtube.com/embed/' + videoId + '?controls=0&autoplay=1&mute=1';
                                        ytbList.push(videoUrl);
                                    }
                                    GM_setValue('ytbList', ytbList);
                                    videoList = ytbList;
                                    videoShuffle(insertYtb);

                                });
                            }

                        }
                    }
                    else {
                        videoList = ytbList;
                        videoShuffle(insertYtb);
                    }
                }
            }

        }
        else if (window.location.href.includes('https://www.youtube.com/embed/')) {
            var video = document.querySelector('video.video-stream.html5-main-video');
                setTimeout(function () {
                        var randomNum = Math.floor(Math.random() * (video.duration - 0));
                        video.currentTime=randomNum;
                },5000);
                var interval=setInterval(function () {
                    if(parseInt(video.currentTime)==parseInt(video.duration)){
                        videoList=ytbList;
                        videoShuffle(insertYtb);
                        clearInterval(interval);

                    }
                },15000);
            var frame=document.querySelector('#video_bg');
            window.addEventListener('message', function (e) {
                debug(e.data);
                if (e.data == "pause") {
                    if(frame!=null){
                        frame.contentWindow.postMessage("pause", "*");
                    }
                    else {
                        video.pause();

                    }

                }
                else if (e.data == 'play') {
                    if(frame!=null){
                        frame.contentWindow.postMessage("play", "*");
                    }
                    else {
                        video.play();
                    }
                }
            });


        }

    }
}
function CreateButton(text,func,positionBtm){
    var btn=document.createElement("button");
    btn.type="button";
    btn.innerHTML=text;
    btn.style=`
  position: fixed;
  right: 0px;
  bottom: `+positionBtm+`px;
  z-index: 10000;
  opacity:0.1;
  `;
    if(positionBtm!=0&&positionBtm!=36){
        btn.style.display='none';
        document.body.firstChild.addEventListener('mouseover',function () {
            btn.style.display='block';
        });
        document.body.firstChild.addEventListener('mouseout',function () {
            setTimeout(function () {
                btn.style.display='none';
            },3000);
        });
    }
    btn.addEventListener('click',func);
    btn.addEventListener('mouseout',function () {
        btn.style.opacity=0.1;

    });
    btn.addEventListener('mouseover',function () {
        btn.style.opacity=1;
    });
    document.body.insertBefore(btn,document.body.firstChild);
}
function HandleHFS(responseObj) {
    if (responseObj.status == 200) {
        var fileList=responseObj.responseText.split('\r\n');
        debug(fileList);
        for(var file of fileList){
            if(/\.mp4$/.test(file)){
                videoList.push(file);
                GM_setValue('videoList',videoList);

            }
        }
        videoShuffle(insertVideo);
    }
}
/*
function HandleHFS(responseObj){
    if(responseObj.status==200){
        if(dirCount!=0){

            dirCount--;
        }
        debug('dirCount: '+dirCount);
        var dom = new DOMParser().parseFromString(responseObj.responseText, "text/html");
        var files = dom.querySelector('#files');
        var trList=files.querySelectorAll("tr");
        for(var tr of trList){
                var a=tr.querySelector('a');
                debug('a.href: '+a.href);
                var url=a.href.replace(/https?:\/\/.*\/([^\/]*((\.mp4)|\/)$)/, function(match, $1, $2, offset, original){ return responseObj.finalUrl+$1;})
            debug('url: '+url);
                if(/\.mp4$/.test(a.textContent)&&!videoList.includes(url)){
                    videoList.push(url);
                    GM_setValue('videoList',JSON.stringify(videoList));
                }
                else if(a.textContent!='Name'){
                    var img=a.querySelector('img');
                    debug(img.src);
                    if(img.src.includes('/~img_folder')){
                        if(dirList.length!=0){
                            debug(dirList)
                            for(var existUrl of dirList){
                                if(existUrl.includes(url)){
                                    break;
                                }
                                else if(existUrl==dirList[dirList.length-1]){
                                    debug('existUrl: '+existUrl+' & '+'url: '+url);
                                    dirCount++;
                                    var obj=new ObjectRequest(url);
                                    dirList.push(url);
                                    GM_setValue('dirList',JSON.stringify(dirList));
                                    request(obj,HandleHFS);



                                }
                            }

                        }
                        else {
                            dirCount++;
                            dirList.push(url);
                            GM_setValue('dirList',JSON.stringify(dirList));
                            var obj=new ObjectRequest(url);
                            request(obj,HandleHFS);

                        }

                    }

                }


            if (tr==trList[trList.length-1]&&dirCount==0) {
                    videoShuffle();
                if (textColorList.includes(hostname)) {
                    var divList=document.querySelectorAll('div');
                    for (var div of divList){
                        div.style.backgroundColor='#D8E0E0';
                    }
                }
            }
        }
        dirCount--;
    }
}
*/
window.addEventListener('DOMContentLoaded', init);
function request(object,func) {

    var retries = 3;
    GM_xmlhttpRequest({
        method: object.method,
        url: object.url,
        data: object.data,
        headers: object.headers,
        overrideMimeType: object.charset,
        timeout:120000,
        //synchronous: true
        onload: function (responseDetails) {
            //debug(responseDetails);
            if (responseDetails.status != 200&&responseDetails.status != 302) {
                // retry
                if (retries--) {          // *** Recurse if we still have retries
                    setTimeout(request,2000);
                    return;
                }
            }
            //Dowork
            func(responseDetails,object.other);
        },
        ontimeout: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails,object.other);

        },
        ononerror: function (responseDetails) {
            debug(responseDetails);
            //Dowork
            func(responseDetails,object.other);

        }
    })
}
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
function videoShuffle(func) {
    debug('videoShuffle');
    debug('videoList: '+videoList);
    for(var used of usedList){

        var index = videoList.indexOf(used);
        if (index > -1) {
           videoList.splice(index, 1);
        }
    }
    var randomNum = Math.floor(Math.random() * (videoList.length - 0));
    if(window.location.href.includes('https://www.youtube.com/embed/')){

        videoList = ytbList;
    }
    var url=videoList[randomNum];
    /*if(rndStart){
        if(ytbEnable&&!window.location.href.includes('https://www.youtube.com/embed/')){
            var videoId=url.match(/https:\/\/www.youtube.com\/embed\/(.*)\?controls=0&autoplay=1&mute=1/);
            videoId=videoId[1];
            var urlVidInfo='https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id='+videoId+'&key=AIzaSyAbzugt7o1RRhBVDyPyZxZTeriH-3Ogtkg';
            var obj=new ObjectRequest(urlVidInfo);
            request(obj,function (respObj) {
                var json=JSON.parse(respObj.responseText);
                for(var item of json.items){
                    if(item.id==videoId){
                        debug(JSON.stringify(json));
                        var duration=item.contentDetails.duration;
                        debug(duration);
                        var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
                        var hours = 0, minutes = 0, seconds = 0, totalseconds;

                        if (reptms.test(duration)) {
                            var matches = reptms.exec(duration);
                            debug(matches);
                            if (matches[1]) hours = Number(matches[1]);
                            if (matches[2]) minutes = Number(matches[2]);
                            if (matches[3]) seconds = Number(matches[3]);
                            totalseconds = hours * 3600  + minutes * 60 + seconds;
                        }
                        randomNum = Math.floor(Math.random() * (totalseconds - 0));
                        url='https://www.youtube.com/embed/'+videoId+'?controls=0&autoplay=1&mute=1&start='+randomNum;
                        debug(url);
                        func(url);
                    }
                }
            })

        }
        else{
            func(url);

        }

    }*/
    func(url);
    if (textColorList.includes(hostname)) {
        var divList=document.querySelectorAll('div');
        for (var div of divList){
            div.style.backgroundColor=bgColor;
            //div.style.opacity=textBGcolorOpacity;
        }
    }

}
function insertVideo(url) {
    debug('insertVideo');
            var video = document.createElement("video");
            video.style = 'width:100%';
            video.src = url;
            video.autoplay = true;
            video.muted=true;
    var div = document.createElement("div");
    div.style = "width:100%;    position: fixed;    top: 0;    left: 0;    z-index: -100;";
    div.insertBefore(video, null);
    debug(url);
    document.body.insertBefore(div, null);

            window.addEventListener("focus", function () {
                video.play();
            });
            window.addEventListener("blur", function () {
                video.pause();
            });
            video.addEventListener('onended',function () {
                document.removeChild(div);
                videoShuffle(insertVideo);
            });
            video.addEventListener('loadeddata', (event) => {
                var randomNum = Math.floor(Math.random() * (video.duration - 0));
                video.currentTime=randomNum;
            });
    usedList.push(url);
}
function getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}
function insertYtb(url) {
    debug('insertYtb');
    if(window.location.href.includes('https://www.youtube.com/embed/')) {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    }
        var iframe = document.createElement("iframe");
    iframe.id='video_bg';
    iframe.style = 'width:100%;height:100%;';
    iframe.src = url;
    iframe.allow = "accelerometer;";
    iframe.frameborder='0';
    var div = document.createElement("div");
    div.style = "width:100%;    height:100%;position: fixed;    top: 0;    left: 0;    z-index: -100;";
    div.insertBefore(iframe, null);
    debug(url);
    document.body.insertBefore(div, null);

    window.addEventListener("focus", function () {
        iframe.contentWindow.postMessage("play", "*");
    });
    window.addEventListener("blur", function () {
        iframe.contentWindow.postMessage("pause", "*");
    });

    usedList.push(url);
}
function iframeRef( frameRef ) {
    return frameRef.contentWindow
        ? frameRef.contentWindow.document
        : frameRef.contentDocument
}