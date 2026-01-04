// ==UserScript==
// @name         zhid_baidu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baidu.com/
// @match         https://www.baidu.com/?tn=baiduhome_pg
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419067/zhid_baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/419067/zhid_baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("#kw").attr("value","美女脱衣舞");
    $("#su").click();
    $("#kw").bind('input propertychange', function() {
          setblur();
    });
   /* $("#kw").blur(
    function(){
        console.log("1111");
      $("#kw").prop("value","不，你想要的是美女");
    }
    );*/
    function setblur(){
        $("#kw").blur();
    $("#kw").prop("value","不，你想要的是美女");
    }
})();