// ==UserScript==
// @name         学习视频加速
// @namespace    http://github.com/chengchenrui
// @version      0.1
// @description  加速
// @author       ccr
// @match        https://ceair.jiker.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiker.com
// @grant        none
// @license MIT  
// @require https://code.jquery.com/jquery-2.1.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/444619/%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/444619/%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  $(() => {
    $("body").append(`
            <dev id='video_set' style="position:fixed;right:10px;top:10px;z-index:9999;background:red">
                <span>倍速</span>
                <select id='play_rate'>
                  <option value ="1" selected>1</option>
                  <option value ="1.25">1.25</option>
                  <option value="1.5">1.5</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
            </dev>
        `);

    // alert($("#play_rate option:selected").val())

    $("#play_rate").on("change", function () {
      console.log("select改变了");
      var vs = this.value;
      //var vs = $('#play_rate option:selected').val();
      //alert(vs)
      if (vs <= 5) {
        document.querySelector("video").playbackRate = vs;
      } else {
        alert("最大为5");
      }
    });
  });
  // Your code here...
})();
