// ==UserScript==
// @name         Zesticles
// @namespace    zero.revive.torn
// @version      0.1.3
// @description  Revive
// @author       -zero [2669774]
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469096/Zesticles.user.js
// @updateURL https://update.greasyfork.org/scripts/469096/Zesticles.meta.js
// ==/UserScript==

var url = window.location.href;
var x = url.split('ID=');

var playerId = x[1].match(/[\d]+/)[0];


function getRFC() {
  var rfc = $.cookie('rfc_v');
  if (!rfc) {
    var cookies = document.cookie.split('; ');
    for (var i in cookies) {
      var cookie = cookies[i].split('=');
      if (cookie[0] == 'rfc_v') {
        return cookie[1];
      }
    }
  }
  return rfc;
}

function addButton() {


    if ($('.title-black').size() > 0 && $('#revivezero').size() < 1) {
        const spa = `<span id="revivezeroresponse" style="font-size: 10px; font-weight: 100;"></span>`;
        const rbutton = `<button id='revivezero' class='torn-btn'>REVIVE</button>`;
        $($('.title-black')[0]).append(rbutton);
        $($('.title-black')[0]).append(spa);

        $('#revivezero').on('click', revive);
    }
    else{
        setTimeout(addButton, 300);
    }
};

function revive(){
    $.post('revive.php?action=revive&step=revive&ID='+playerId+'&text_response=1&rfcv='+getRFC(),function(result){
        let res = JSON.parse(result);
        $("#revivezeroresponse").html(res.msg);
        $("#revivezeroresponse").style.color = res.color;
    });
}


(function() {
    'use strict';

    // Your code here...
    addButton();
})();
