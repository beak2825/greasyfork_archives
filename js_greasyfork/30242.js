// ==UserScript==
// @name         Myself-bbs.com Player Auto Full Screen
// @name:zh-CN         Myself-bbs.com 自动网页全屏
// @namespace    http://myself-bbs.com/
// @version      0.7
// @description  Auto Full Screen for 云端
// @description:zh-cn  云端自动网页全屏
// @author       TriATK
// @match        http://*.myself-bbs.com/*
// @match        http://myself-bbs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30242/Myself-bbscom%20Player%20Auto%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/30242/Myself-bbscom%20Player%20Auto%20Full%20Screen.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    $(function() {
        var  getUrlVars = function(url){
            var vars = [], hash;
            var hashes = url.slice(url.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };
        var getUrlVar = function(url, name){
            return  getUrlVars(url)[name];
        };
        var videoList = $('.various.google');
        videoList.each(function() {
            var self = $(this);
            if (self) {
                self.fancybox({live: false});
                self.off("click.fb-start");
                self.off('click');
            }
        });
        videoList.click(function(e) {
            e.preventDefault();
            var self = $(this);
            var url = self.data('href');
            var docId = getUrlVar(url, 'docid');
            var videoUrl = (docId === undefined ? url.replace('/preview', '/preview') : 'https://docs.google.com/file/d/'+docId+'/preview');
            window.open(videoUrl, '_blank');
        });
    });
})(jQuery);