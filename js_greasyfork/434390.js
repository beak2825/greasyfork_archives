// ==UserScript==
// @name         超星倍速破解
// @namespace    https://enncy.cn
// @version      0.4
// @description  cx 视频倍速破解脚本
// @author       enncy
// @match        **://**/**
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/434390/%E8%B6%85%E6%98%9F%E5%80%8D%E9%80%9F%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/434390/%E8%B6%85%E6%98%9F%E5%80%8D%E9%80%9F%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

       let videojs = unsafeWindow.videojs
       let Ext = unsafeWindow.Ext
       if(videojs && Ext){
           console.log("倍速破解启动")
           console.log("videojs.hook")
           videojs.hook('beforesetup', function(videoEl, options) {
           console.log(options)
           options.playbackRates=[1, 1.25, 1.5, 2,4,8,12,16]
           return options;
           });
           console.log("Ext.define")
           Ext.define("ans.VideoJs",{
               override:"ans.VideoJs",
               constructor: function (b) {
                   b = b || {};
                   var e = this;
                   e.addEvents(["seekstart"]);
                   e.mixins.observable.constructor.call(e, b);
                   var c = videojs(b.videojs, e.params2VideoOpt(b.params), function () {});
                   Ext.fly(b.videojs).on("contextmenu", function (f) {
                       f.preventDefault();
                   });
                   Ext.fly(b.videojs).on("keydown", function (f) {
                       if (f.keyCode == 32 || f.keyCode == 37 || f.keyCode == 39 || f.keyCode == 107) {
                           f.preventDefault();
                       }
                   });
                   if (c.videoJsResolutionSwitcher) {
                       c.on("resolutionchange", function () {
                           var g = c.currentResolution(),
                               f = g.sources ? g.sources[0].res : false;
                           Ext.setCookie("resolution", f);
                       });
                   }
                   //         var a = b.params && b.params.doublespeed ? 2 : 1;
                   //         c.on("ratechange", function () {
                   //             var f = c.playbackRate();
                   //             if (f > a) {
                   //                 c.pause();
                   //                 c.playbackRate(1);
                   //             }
                   //         });
               },
           })
       }
    // Your code here...
})();