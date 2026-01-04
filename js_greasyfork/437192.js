// ==UserScript==
// @name         I-Com Tags
// @namespace    http://tampermonkey.net/
// @version      0.3.6
// @description  See u tags for conversations
// @author       U2POY aka Vladislav Makeka
// @match        *://app.intercom.com/a/apps/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437192/I-Com%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/437192/I-Com%20Tags.meta.js
// ==/UserScript==    {

(function() {
  'use strict';
  var url = document.URL;

  setInterval(checkTags, 100);

  function reset() {
    var url_icom = document.URL;

    checkTags(url_icom);
  }

  function checkTags(url) {
    let url_now = document.URL;
    if (url == url_now) {
      var substring_url = "/inbox/inbox/";
      var result_url = url_now.includes(substring_url);

      if (result_url == true) {

        // b.setAttribute("disabled", "disabled");
        resetName();

        function resetName() {
          document.getElementsByClassName('t__h4')[0].innerHTML = 'Не вижу пока тегов :(';
          var TAGS = document.querySelectorAll('.u__cf > .popover__opener > span > a.ember-view');
            if (TAGS.length > 0) {
                let i = 0;
                var arr = [];
                for (let i = 0; i < TAGS.length; i++) {
                    var goPush = arr.push(TAGS[i].innerHTML + "");
                }
                let mapInfo = arr.join();
                enTer(mapInfo);

              function enTer(text) {
                document.getElementsByClassName('t__h4')[0].innerHTML = text;
              }
            }
        }
      }
    } else {
      reset()
    }
  }

})();