// ==UserScript==
// @name            [.12 Project Endor (Zoltar)]Website Evaluation 
// @author          robert
// @namespace       https://greasyfork.org/en/users/13168-robert
// @include         *
// @version         1.02
// @grant           none
// @require         http://code.jquery.com/jquery-2.1.4.min.js
// @description:en  Open window, hotkeys
// @description Open window, hotkeys
// @downloadURL https://update.greasyfork.org/scripts/11401/%5B12%20Project%20Endor%20%28Zoltar%29%5DWebsite%20Evaluation.user.js
// @updateURL https://update.greasyfork.org/scripts/11401/%5B12%20Project%20Endor%20%28Zoltar%29%5DWebsite%20Evaluation.meta.js
// ==/UserScript==
/*
to add:
- instruction hide
- auto submit
- instant copypaste
- compact layout
- close new window upon submit
*/
if ($("h2:contains('If the website is NOT available, please check the')").length)
  runScript();

function runScript()
{
  window.open($("a:contains('http')").text(), "", "_blank");
  var companyNameTextField = window.document.getElementById("name");
  window.addEventListener("message", companyNameListener, false);
  window.onkeydown = function(e)
  {
    // Radio button group 1
    if (e.keyCode === 49) //1 key 
      $('input:radio[name=business_type]')[0].checked = true;    
    if (e.keyCode === 50) //2 key
      $('input:radio[name=business_type]')[1].checked = true;
    if (e.keyCode === 51) //3 key
      $('input:radio[name=business_type]')[2].checked = true;
    if (e.keyCode === 52) //4 key
      $('input:radio[name=business_type]')[3].checked = true;
    if (e.keyCode === 53) //5 key
      $('input:radio[name=business_type]')[4].checked = true;
    if (e.keyCode === 54) //6 key
      $('input:radio[name=business_type]')[5].checked = true;
		if (e.keyCode === 55) //7 key
      $('input:radio[name=business_type]')[6].checked = true;

    // Radio button group 2
    if (e.keyCode === 81) //Q key 
      $('input:radio[name=physical_storeness]')[0].checked = true;    
    if (e.keyCode === 87) //W key 
      $('input:radio[name=physical_storeness]')[1].checked = true; 
    if (e.keyCode === 69) //E key 
      $('input:radio[name=physical_storeness]')[2].checked = true; 
    if (e.keyCode === 82) //R key 
      $('input:radio[name=physical_storeness]')[3].checked = true; 

    // Radio button group 3
    if (e.keyCode === 65) //A key 
      $('input:radio[name=product_type]')[0].checked = true;    
    if (e.keyCode === 83) //S key 
      $('input:radio[name=product_type]')[1].checked = true;    
    if (e.keyCode === 68) //D key 
      $('input:radio[name=product_type]')[2].checked = true;    
 
    // Radio button group 4
    if (e.keyCode === 90) //Z key 
      $('input:radio[name=consumer_relationship]')[0].checked = true; 
    if (e.keyCode === 88) //X key 
      $('input:radio[name=consumer_relationship]')[1].checked = true; 
    if (e.keyCode === 67) //C key 
      $('input:radio[name=consumer_relationship]')[2].checked = true; 

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