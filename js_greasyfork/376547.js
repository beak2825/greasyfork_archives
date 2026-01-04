// ==UserScript==
// @name        Philip Driessen
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Lazy and Smart Workers
// @author       M C KRISH
// @match        https://www.mturkcontent.com/dynamic/hit?*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js


// @downloadURL https://update.greasyfork.org/scripts/376547/Philip%20Driessen.user.js
// @updateURL https://update.greasyfork.org/scripts/376547/Philip%20Driessen.meta.js
// ==/UserScript==


document.body.innerHTML = document.body.innerHTML.replace('>Next', 'id="nxt">Next');

var $j = jQuery.noConflict(true);
var num = Math.floor((Math.random() * 3) + 4);
$(document).ready(
    function() {
//$j(':radio[value= 5]')[2].trigger('click');

        $j('input[name=page0_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page0_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page0_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page0_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page1_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page1_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page1_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page1_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page2_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page2_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page2_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page2_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page3_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page3_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page3_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page3_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page4_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page4_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page4_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page4_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page5_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page5_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page5_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page5_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page6_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page6_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page6_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page6_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page7_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page7_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page7_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page7_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page8_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page8_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page8_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page8_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page9_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page9_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page9_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page9_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page10_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page10_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page10_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page10_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page11_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page11_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page11_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page11_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page12_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page12_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page12_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page12_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page13_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page13_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page13_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page13_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page14_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page14_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page14_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page14_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page15_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page15_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page15_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page15_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page16_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page16_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page16_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//        $j('input[name=page16_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page17_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page17_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page17_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page17_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page18_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page18_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page18_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page18_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

        $j('input[name=page19_item176]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page19_item162]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
        $j('input[name=page19_item226]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');
//                $j('input[name=page19_item179]:radio[value= '+ Math.floor((Math.random() * 3) + 4) +']').trigger('click');

//        $j(':radio[value= '+ Math.floor((Math.random() * 4) + 4) +']').trigger('click');
//        $j(':radio[value= '+ Math.floor((Math.random() * 4) + 4) +']')[3].trigger('click');





//        $j('input:radio[name=page0_item264]')[5].trigger('click');
//        $j(':radio[value=5]').trigger('click');
//        $j(':radio[value=not]').trigger('click');

    });
//$j('input:radio[name=question-ad-task5]')[1].checked = true;
//$j('input:radio[name=question-loading-task5]')[1].checked = true;
//$j('input:radio[name=question-pornographic-task5]')[1].checked = true;
//$j('input:radio[name=question-cutoff-task5]')[1].checked = true;
//$j('input:radio[name=question-popup-task5]')[0].checked = true;
//$j('input:radio[name=question-captcha-task5]')[0].checked = true;
//$j('input:radio[name=question-error-task5]')[0].checked = true;

        window.onkeyup = function(e) {
      var key = e.keyCode ? e.keyCode : e.which;
      if (key == 17) {
            //document.getElementById("submitButton").focus();

      }else if (key == 65) {
            document.getElementById("nxt").click();
                }else if (key == 39) {
            document.getElementById("nxt").click();
                }
};
