// ==UserScript==
// @name         NAXA
// @namespace    zero.re.torn
// @version      0.4
// @description  Max Rehab -1
// @author       -zero [2669774]
// @match        https://www.torn.com/index.php?page=rehab
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464927/NAXA.user.js
// @updateURL https://update.greasyfork.org/scripts/464927/NAXA.meta.js
// ==/UserScript==

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
function insert(){
    const button = `<button id='zehab' class='torn-btn'>Zehab</button>`;
    if ($('.rehab-btn-area').length > 0){
        $('.rehab-btn-area').append(button);
        $('#zehab').on('click', rehab);


    }
    else{
        setTimeout(insert,500);
    }

}

function rehab(){
    var dat = JSON.parse($('.range-slider-data').attr('data-percentages'));
    var max = Object.keys(dat)[Object.keys(dat).length-1] -1;


    $.post('https://www.torn.com/travelagency.php?rfcv='+getRFC(), {'amount': max,'step': 'tryRehab','rehab':1},function(response){
        $('.content-title').append(response);
    });


}

(function() {
    'use strict';
    insert();

    // Your code here...
})();