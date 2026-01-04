// ==UserScript==
// @author         LetMeBNU
// @name           IMVU.com Peer Review
// @description   Help review products on IMVU, lets you load product into 3d, and submits if no issues.
// @include        https://www.imvu.com/peer_review/
// @version 1.0.0.6
// @namespace https://greasyfork.org/en/users/774845-bryen-bro
// @downloadURL https://update.greasyfork.org/scripts/426844/IMVUcom%20Peer%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/426844/IMVUcom%20Peer%20Review.meta.js
// ==/UserScript==

  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
  script.onload = function() {
      if(jQuery("#view_in_3d").length && jQuery('#step2 #cb_no_issues').length) {
          jQuery('#view_in_3d').click();
          jQuery('#step2 #cb_no_issues').prop('checked', true);
          window.setTimeout("document.getElementById('yui-main').getElementsByTagName('form')[0].submit();", Math.floor(Math.random() * 10) * 1000 + 25000);
      } else if(jQuery('#step2 #cb_no_issues').length) {
          jQuery('#step2 #cb_no_issues').prop('checked', true);
          window.setTimeout("document.getElementById('yui-main').getElementsByTagName('form')[0].submit();", Math.floor(Math.random() * 10) * 1000 + 5000);
      }
      else {
            var audio = new Audio('https://asnft.com/beep.mp3?a');
            audio.play();
      }
  };
  head.appendChild(script);