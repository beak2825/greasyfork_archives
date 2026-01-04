// ==UserScript==
// @name         Hide stackoverflow.com privacy panel
// @name:zh-CN   隐藏Stackoverflow左下角Cookie固定弹窗  
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Many websites show panel on the left down corner to ask us to accept cookies. But it will connect google API which is NOT reachable from our country,
//               and the panel will never disappear. This simple script will hide the panel directly without any tips!
// @description:zh-CN 你好
// @author       Andy Cui
// @match        *://superuser.com/*
// @match        *://stackoverflow.com/*
// @match        *://askubuntu.com/*
// @match        *://serverfault.com/*
// @match        *://*.stackexchange.com/*

// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
/* globals jQuery, $, waitForKeyElements */
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426258/Hide%20stackoverflowcom%20privacy%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/426258/Hide%20stackoverflowcom%20privacy%20panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    // find the div，some conditions
    /*
    class:
    ps-fixed z-nav-fixed

    z-index:

    5050 or other value greater than 1000 ???

    p content
    Your privacy

    Button

    Accept all cookies
    Customize settings

    */

    var panels = $('.ps-fixed.z-nav-fixed')
    if (panels.length < 1) return;

    panels.each(function () {
        var panel = $(this)

        var zindex = panel.css('z-index')
        if (zindex < 1000) return;


        // !!! Hide it
        panel.css("display", "none")
        return;

/*
     // more conditions ???
     const keywords = ["Your privacy",
                      "accept",
                      "cookie",
                      "cookies",
                      ]
     var pArr = panel.children('p')

     var matchsArr = []
     pArr.each(function (){
       var p = $(this)
       var text = p.text().toLowerCase()
       $(keywords).each(function (){
           debugger
         var aKeyword = this.toLowerCase()
         if (text.includes(aKeyword)) {
          var pair = [text, aKeyword]
          matchsArr.push(pair)
         }
       })
     })
     console.log(matchsArr)


     // buttons

 */

    })
})();