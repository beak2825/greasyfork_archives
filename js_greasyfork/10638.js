// ==UserScript==
// @name         for SPNP 
// @version      0.4
// @description  skip CAPTCHA
// @author       gg2,KF
// @match        https://apply.spnp.gov.tw/Application.php
// @grant        none
// @namespace    https://greasyfork.org/users/10469
// @require      http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/10638/for%20SPNP.user.js
// @updateURL https://update.greasyfork.org/scripts/10638/for%20SPNP.meta.js
// ==/UserScript==
(function () {

  var now = new Date();
  var orig_target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0);

  var target = new Date(orig_target);
  var $ctrlDiv = $('<div id="ctrlDiv">').css({
    'border': '1px solid #aaa',
    'position': 'fixed',
    'right': 0,
    'bottom': 0
  });

  var $secShift = $('<lable>時間修正(秒) <input type="text" id="secShift" placeholder="ex: -10" value="0"/></lable>').appendTo($ctrlDiv);
  var $enableChx = $('<lable><input type="checkbox" id="enableChx" />開啟自動送出 </lable>').appendTo($ctrlDiv);
  var $timeTxt = $('<b>').text('').css('display', 'none').appendTo($ctrlDiv);
  var $sendTimeTxt = $('<em>').text('將於' + target.toLocaleString() + '自動送出').appendTo($ctrlDiv);

  $enableChx.on('click', function () {
    console.log('auto submit');
    $timeTxt.text(new Date()).show();
    autoclick();
  });

  $secShift.on('change', function () {
    var shift = parseFloat($('#secShift').val()) * 1000;
    console.log(shift);
    target.setTime(orig_target.getTime() + shift);
    console.log(target.getTime(), orig_target.getTime());
    $sendTimeTxt.text('將於' + target.toLocaleString() + '自動送出');
  });
  $ctrlDiv.appendTo('body');

  function autoclick() {
    if (!document.getElementById('enableChx').checked) {
      $timeTxt.hide();
      return;
    }
    $timeTxt.text((new Date()).toLocaleString());
    if ((new Date()).getTime() - target.getTime() < 0) {
      setTimeout(autoclick, 10);
      return;
    }
    document.getElementById('sbn2').click();
    console.log('clicked');
  }

  document.getElementById('sbn2').onclick = function () { return true;};
  document.getElementById('sbn2').style.visibility = 'visible';
  document.getElementById('sbn').style.display = 'none';
  
}) ();
