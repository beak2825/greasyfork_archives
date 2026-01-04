// ==UserScript==
// @name        Split clipboard to FIO
// @namespace   novaposhta
// @include     https://my.novaposhta.ua/newOrder/index*
// @version     1
// @grant       none
// @description kdfjkdfkjdf
// @downloadURL https://update.greasyfork.org/scripts/376010/Split%20clipboard%20to%20FIO.user.js
// @updateURL https://update.greasyfork.org/scripts/376010/Split%20clipboard%20to%20FIO.meta.js
// ==/UserScript==

var run = function () {
  //  alert('dfdfg');
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

    $('input#counterpartyLastName').attr('maxlength', 200);



  $("input#counterpartyLastName").bind("paste", function(e){       
var pastedData = e.originalEvent.clipboardData.getData('text');
var out = pastedData.split(' ');

    $('input#counterpartyFirstName').val(out[1]);
    $('input#counterpartyMiddleName').val(out[2]);
    
    setTimeout(function(){
  $('input#counterpartyLastName').val(out[0]);
}, 100);

  } )

}
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
