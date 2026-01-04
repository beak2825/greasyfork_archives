// ==UserScript==
// @name         微博原图
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  访问新浪微博图片的URL时会自动跳转到原图
// @author       halfasec
// @match        *.sinaimg.cn/*
// @match        *.weibo.com/*
// @match        *.imgur.com/*
// @match        *pbs.twimg.com/*
// @match        *cdn.discordapp.com/*
// @grant        none
// @license      ODbL
// @downloadURL https://update.greasyfork.org/scripts/34662/%E5%BE%AE%E5%8D%9A%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/34662/%E5%BE%AE%E5%8D%9A%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var originalLocator=window.location.href;
    console.log(originalLocator);
    var flagwbLarge=(/thumbnail|thumb150|mw600|mw690|mw1024|small|bmiddle|orj360|thumb180|mw2000/.test(originalLocator)&&/sinaimg.cn/.test(originalLocator));
    var flagtwLarge=(/&name=/.test(originalLocator)&&(/&name=orig/.test(originalLocator))||/:orig/.test(originalLocator)||/\?name=orig/.test(originalLocator));
    var flagtwGifThumb=(/pbs.twimg.com\/tweet_video/.test(originalLocator));
    console.log(flagwbLarge);
    console.log(flagtwLarge);
    console.log(flagtwGifThumb);
    if(flagwbLarge){
    var fixedLocator=originalLocator.replace(/thumbnail|thumb150|mw600|mw690|mw1024|small|bmiddle|orj360|thumb180|mw2000/, "large");
    console.log(fixedLocator);
    window.location.href=fixedLocator;
    }
    if(!flagtwLarge&&/twimg.com\/media/.test(originalLocator)){
    var fixedtwLocator=originalLocator.replace(/&name=[\s\S]*/, "&name=orig").replace(/:small|:large/,":orig").replace(/\.jpg$/,".jpg:orig");
    console.log(fixedtwLocator);
    window.location.href=fixedtwLocator;
    }
    if(flagtwGifThumb){
    var fixedtwGifLocator=originalLocator.replace(/https:\/\/pbs.twimg.com\/tweet_video_thumb/,"https://video.twimg.com/tweet_video").replace(/\?format=[\s\S]*/,".mp4")
    console.log(fixedtwGifLocator);
    window.location.href=fixedtwGifLocator;
    }
    window.addEventListener('keydown', event => {
      if (event.keyCode == 115) { // F4
        //var searchLocator="https://www.google.com/searchbyimage?sbisrc=cr_1_5_2&image_url="+window.location.href; //传统Google识图
        var searchLocator="https://lens.google.com/uploadbyurl?url="+window.location.href; //GoogleLens识图
        window.location.href=searchLocator;
      } });
})();