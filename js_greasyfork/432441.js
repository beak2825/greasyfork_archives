// ==UserScript==
// @name         91热爆视频
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  最新视频 - 91热爆
// @author       You
// @match        *://*.91rb.net/*
// @match        *://*.rb1769.com/*
// @match        *://*.mama71.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/432441/91%E7%83%AD%E7%88%86%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/432441/91%E7%83%AD%E7%88%86%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var img=$('.player-holder img');
    if(img){
        var src=$(img).attr('src');
        console.info($(img).attr('src'));
        var ss=src.substring(src.indexOf("videos_screenshots") + "videos_screenshots".length+1,src.indexOf("preview")-1);
        console.info(ss);
        var aa=ss.substring(ss.indexOf("/")+1);
        var newUrl="https://cust91rb.163cdn.net/hls/videos/"+ss+'/'+aa+".mp4/index.m3u8?sid=";
        console.info(newUrl);

        $('.player-holder .message').append('<br><br><a href="https://cust91rb.163cdn.net/hls/videos/'+ss+'/'+aa+'.mp4/index.m3u8?sid=" target="_blank">播放1</a>');
        $('.player-holder .message').append('&nbsp;<a href="https://cust91rb2.163cdn.net/hls/videos/'+ss+'/'+aa+'.mp4/index.m3u8?sid=" target="_blank">播放2</a>');
        $('.player-holder .message').append('&nbsp;<a href="https://cust91rb2.163cdn.net/hls/videos/'+ss+'/'+aa+'_720p.mp4/index.m3u8?sid=" target="_blank">播放2-720</a>');
        $('.player-holder .message').append('&nbsp;<a href="https://cdn.163cdn.net/hls/contents/videos/'+ss+'/'+aa+'.mp4/index.m3u8?sid=" target="_blank">播放3</a>');
        $('.player-holder .message').append('&nbsp;<a href="https://cdn.163cdn.net/hls/contents/videos/'+ss+'/'+aa+'_720p.mp4/index.m3u8?sid=" target="_blank">播放3-720</a>');
        $('.player-holder .message').append('&nbsp;<a href="https://91rbnet.douyincontent.com/hls/contents/videos/'+ss+'/'+aa+'.mp4/index.m3u8?sid=" target="_blank">播放4</a>');
        $('.player-holder .message').append('&nbsp;<a href="https://91rbnet.douyincontent.com/hls/contents/videos/'+ss+'/'+aa+'_720p.mp4/index.m3u8?sid=" target="_blank">播放4-720</a>');
        $('.player-holder .message').append('&nbsp;<a href="https://91rbnet.douyincontent.com/hls/contents/videos/'+ss+'/'+aa+'_1080p.mp4/index.m3u8?sid=" target="_blank">播放4-1080</a>');

    }else{
        console.info('无需破解');
    }
})();