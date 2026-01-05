// ==UserScript==
// @name        Excellent Advisor Evaluation in Minghsin University (ry) Auto clicked
// @name:zh-TW  明新科技大學績優導師問卷調查自動填寫
// @author      HybridGlucose
// @namespace   https://github.com/HybridGlucose
// @description:zh-TW 自動填寫問卷，但是只會全部選非常同意XD
// @include     http://sss.must.edu.tw/que_stdQue_new.asp*
// @version     1
// @grant       none
// @run-at      document-end
// @license     GPL version 3
// @description 自動填寫問卷，但是只會全部選非常同意XD
// @downloadURL https://update.greasyfork.org/scripts/17920/Excellent%20Advisor%20Evaluation%20in%20Minghsin%20University%20%28ry%29%20Auto%20clicked.user.js
// @updateURL https://update.greasyfork.org/scripts/17920/Excellent%20Advisor%20Evaluation%20in%20Minghsin%20University%20%28ry%29%20Auto%20clicked.meta.js
// ==/UserScript==
(
function ()
{
  
  for(var i=1; i<11; i++ )
  {
    radselect(i);
  }

function radselect(num)
{
  var radio = eval("document.questionary.rad" + num);
  radio.value = 5;
}
}
)();