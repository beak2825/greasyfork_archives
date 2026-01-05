// ==UserScript==
// @name         Myself-bbs.com HTML5 Player
// @namespace    http://myself-bbs.com/
// @version      0.7
// @description  HTML5 Player for 云端
// @author       Deloz
// @match        http://*.myself-bbs.com/*
// @match        http://myself-bbs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22136/Myself-bbscom%20HTML5%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/22136/Myself-bbscom%20HTML5%20Player.meta.js
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
            var videoUrl = (docId === undefined ? url.replace('/preview', '/view') : 'https://docs.google.com/file/d/'+docId+'/view');
            window.open(videoUrl, '_blank');
        });
    });
})(jQuery);