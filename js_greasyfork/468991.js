// ==UserScript==
// @name         学生评教【陕科大】
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  没找到俺们陕科大的，自己写了一个 只要点一点自动完成评教，
// @author       PandaAQI
// @match        http://bkjw.sust.edu.cn/eams/quality/stdEvaluate!answer.action?evaluationLesson.*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license        MIT

// @downloadURL https://update.greasyfork.org/scripts/468991/%E5%AD%A6%E7%94%9F%E8%AF%84%E6%95%99%E3%80%90%E9%99%95%E7%A7%91%E5%A4%A7%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/468991/%E5%AD%A6%E7%94%9F%E8%AF%84%E6%95%99%E3%80%90%E9%99%95%E7%A7%91%E5%A4%A7%E3%80%91.meta.js
// ==/UserScript==

(function() {

setTimeout(function(){

    let option_6_13 = document.getElementById( "option_61_3" );
    option_6_13.click();
    let option_81_3 = document.getElementById( "option_81_3" );
    option_81_3.click();
    let option_82_3 = document.getElementById("option_82_3");
    option_82_3 .click();
    let option_83_2 = document.getElementById("option_83_2" );
    option_83_2 .click();
    let option_84_6 = document.getElementById("option_84_6" );
    option_84_6 .click();
    let option_85_6 = document.getElementById("option_85_6");
    option_85_6 .click();
    let option_88_6 = document.getElementById("option_88_6" );
    option_88_6 .click();
    let option_89_6 = document.getElementById("option_89_6" );
    option_89_6 .click();
    let option_87_6 = document.getElementById("option_87_6" );
    option_87_6 .click();
      let option_91_4 = document.getElementById("option_91_4" );
    option_91_4.click();
      let option_93_4 = document.getElementById("option_93_4" );
    option_93_4 .click();
      let option_90_4 = document.getElementById("option_90_4" );
    option_90_4 .click();
      let option_92_9 = document.getElementById("option_92_9" );
    option_92_9 .click();
      let option_101_3 = document.getElementById("option_101_3" );
    option_101_3 .click();
     let option_121_2 = document.getElementById("option_121_2" );
    option_121_2 .click();
      let option_125_2 = document.getElementById("option_125_2" );
    option_125_2 .click();
      let option_122_4 = document.getElementById("option_122_4" );
    option_122_4 .click();
      let option_102_2 = document.getElementById("option_102_2" );
    option_102_2 .click();
      let option_123_1 = document.getElementById("option_123_1" );
    option_123_1 .click();
      let option_124_4 = document.getElementById("option_124_4" );
    option_124_4 .click();
document.querySelector("#question_3 .answer").value='老师挺好，继续加油';
document.querySelector("#question_49 .answer").value='课程挺好，继续加油';
   },3000)
setTimeout(function(){
    let sub = document.getElementById("sub" );
sub.click();
},6000 )
    window.confirm  = ()=>{return 1}
})();