// ==UserScript==
// @description Auto refresh
// @name        Auto-refresh
// @namespace   https://health.ny.gov
// @include     https://apps7.health.ny.gov/*
// @version     2
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/423360/Auto-refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/423360/Auto-refresh.meta.js
// ==/UserScript==

if (/No Appointments Available/.test(document.body.innerHTML))
{
  setTimeout( function() { location.reload(); }, 100 );
}
else if (/Select Visit Time/.test(document.body.innerHTML))
{
  //document.querySelectorAll('.btn.btn-primary')[0].click();
  if (/March/.test(document.body.innerHTML)) {
    $("div .col-sm-11:contains('March')").find('.btn.btn-primary')[0].click();
  } else if (/April/.test(document.body.innerHTML)) {
    $("div .col-sm-11:contains('April')").find('.btn.btn-primary')[0].click();
  } else {
    setTimeout( function() { location.reload(); }, 100 );
  }
}
else if (/Select Time/.test(document.body.innerHTML))
{
  document.getElementsByName('preRegTimeSlotID')[0].click();
  document.querySelector('.btn.btn-primary.next-btn').click();
}
