// ==UserScript==
// @name            [.12 Project Endor (Zoltar)] Car Website Evaluation 
// @author          Original by robert ~ mod by Loveable_Cactus ~
// @namespace       https://greasyfork.org/en/users/13168-robert
// @include         *
// @version         1.1
// @grant           none
// @require         http://code.jquery.com/jquery-2.1.4.min.js
// @description:en  Open window, hotkeys
// @description Open window, hotkeys
// @downloadURL https://update.greasyfork.org/scripts/13571/%5B12%20Project%20Endor%20%28Zoltar%29%5D%20Car%20Website%20Evaluation.user.js
// @updateURL https://update.greasyfork.org/scripts/13571/%5B12%20Project%20Endor%20%28Zoltar%29%5D%20Car%20Website%20Evaluation.meta.js
// ==/UserScript==
/*
to add:
- instruction hide
- auto submit
- instant copypaste
- compact layout
- close new window upon submit
*/
if ($("h2:contains('In this HIT, please answer the following')").length)
  runScript();

function runScript()
{
  window.open($("a:contains('http')").text(), "", "_blank");
  var companyNameTextField = window.document.getElementById("name");
  window.addEventListener("message", companyNameListener, false);
  window.onkeydown = function(e)
  {
    // Radio button group 1 - Website Loads Correctly?
    if (e.keyCode === 49) //1 key 
      $('input:radio[name=siteavailable]')[0].checked = true;    
    if (e.keyCode === 50) //2 key
      $('input:radio[name=siteavailable]')[1].checked = true;
  
    // Radio button group 2 - Is new car dealer?
    if (e.keyCode === 81) //Q key 
      $('input:radio[name=isnewcardealer]')[0].checked = true;    
    if (e.keyCode === 87) //W key 
      $('input:radio[name=isnewcardealer]')[1].checked = true; 





    if (e.keyCode === 192 ) // ` = submit
      $("input[type='submit']" ).click();
    if (e.keyCode === 220 ) // \ = submit
      $("input[id='site_availability']" ).click();    
  };
} // end function runScript()

function companyNameListener(l) {companyNameTextField.value = l.data.A;}
$(window).mouseup
(
  function(e) 
  {       
    window.opener.postMessage({A: getSelection().toString()},'*');
  }
);
