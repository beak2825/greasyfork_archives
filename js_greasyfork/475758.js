// ==UserScript==
// @name         GC "Back To Shop" keyboard control
// @namespace    https://greasyfork.org/en/users/1142431-guribot
// @version      0.1
// @description  Enables using enter key to hit the "Back to Shop" button after purchasing something
// @author       guribot
// @match        https://www.grundos.cafe/buyitem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/475758/GC%20%22Back%20To%20Shop%22%20keyboard%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/475758/GC%20%22Back%20To%20Shop%22%20keyboard%20control.meta.js
// ==/UserScript==

document.addEventListener("keydown", (event) => {
      if (event.keyCode == 13) {
          var $button = $('button.form-control')
          if ($button.size() > 0) {
              $button.eq(0).click()
          }
      }
    });