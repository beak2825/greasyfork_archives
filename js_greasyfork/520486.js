// ==UserScript==
// @name        zuzhi_YWM
// @namespace   https://greasyfork.org/users/14059
// @description zuzhio
// @include *
// @exclude   https://900464.private.mabangerp.com/*
// @author      setycyas
// @version     0.06
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/520486/zuzhi_YWM.user.js
// @updateURL https://update.greasyfork.org/scripts/520486/zuzhi_YWM.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(window).ready(function(){
              var currentUrl = window.location.href;
            if (!currentUrl.includes('mabangerp')) {
                window.location.href = 'https://900464.private.mabangerp.com/index.php?mod=main.gotoApp&v=v3&menuKey=M0010303';
            }
    });
        window.onload = function() {

               setTimeout(function() {
                  const checkbox = document.getElementById('auto-fahuo');
                   if (!checkbox.checked) {
                       checkbox.click();
                   }
                   document.querySelectorAll('#scan-type button')[1].click();
               }, 2000);
                setTimeout(function() {

                   document.querySelectorAll('#scan-type button')[1].click();
               }, 3000);
            
        };
    // Your code here...
})();