// ==UserScript==
// @name         百度好看视频下载
// @namespace    http://simpleel.com/
// @version      0.2.3
// @description  下载百度好看的视频，关注微信小程序“晟游礼包”免费领取礼包！
// @author       Toven
// @mail         ttw130@gmail.com
// @supportURL   https://simpleel.com
// @icon         https://sv.baidu.com/favicon.ico
// @match        *://sv.baidu.com/*
// @match        *://haokan.baidu.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @resource icon2 https://simpleel.com/images/qr-game.png
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @compatible   chrome
// @compatible   firefox
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/407114/%E7%99%BE%E5%BA%A6%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/407114/%E7%99%BE%E5%BA%A6%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;
    var $pre = __PRELOADED_STATE__ || window.__PRELOADED_STATE__;

    $(function(){
        init();
    });

    function init(){
        addStyle();
        if ($pre && $pre.curVideoMeta) {
            addVideoDownloader($pre.curVideoMeta)
        }
    }

    function addStyle(){
        GM_addStyle(`
.button-open{display:block;}
.dl-link{color:red;font-weight:bold;}
.share-share{color:#fff}
                    `);
    }

    function addVideoDownloader(video){
        var $anchor = $('<div class="float-right phone"><div class="videoinfo-phone videoinfo-dl"><i class="icon-video icon"></i><span class="share-share">下载视频</span></div></div>');
        var $hoverBox = $('<div class="phone-hoverbox"><div class="phone-hoverbox-inner" style="height:250px;"><img src="https://simpleel.com/images/restartlife.png" style="widht:180px;height:180px"/><div class="phone-right"><h2 class="phone-right-title" style="font-size:20px">手机扫描二维码支持开发者</h2><ul class="phone-right-list"><li class="phone-right-item"><a class="dl-link" href="'+video.playurl+'" target="_blank">直接下载</a></li><li class="phone-right-item">（如果视频在新窗口打开而没有下载，请右键另存为即可）</li></ul><p class="phone-right-text">'+video.title+'</p></div></div></div>');
        $anchor.append($hoverBox).hover(() => {
            $hoverBox.toggleClass('button-open')
        })
        $('div.videoinfo div.videoinfo-text').append($anchor);
          console.log($('div.videoinfo div.videoinfo-text').html());
  }

})();