// ==UserScript==
// @name         智障中文平台
// @namespace    https://i-learner.com.hk/
// @version      5.0
// @namespace    stupid-platform-ilearner
// @description  Think i-Learner is boring? Not anymore...
// @author       theroyalwhale
// @match        https://*.i-learner.com.hk/htmlexercise/index_new_demo2.php?page=4&*
// @icon         https://chinese3.i-learner.com.hk/buddy_mission/images/t_bug.png
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/441443/%E6%99%BA%E9%9A%9C%E4%B8%AD%E6%96%87%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441443/%E6%99%BA%E9%9A%9C%E4%B8%AD%E6%96%87%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // get all inputs
    var allainas = document.getElementsByTagName("input");
    console.log(allainas);
    // reset button
    var threeval = allainas[2].value;
    // web title
    document.title = "智障中文平台 [v3]";
    // submit button
    var elecheck = document.getElementById("checking").querySelectorAll("img")[0];
    console.log(elecheck);
    elecheck.setAttribute("onclick", "this.src='https://c.tenor.com/u9XnPveDa9AAAAAM/rick-rickroll.gif'");
    elecheck.setAttribute("src", "https://freepngimg.com/thumb/submit_button/25395-2-submit-button.png");
    elecheck.setAttribute("onmouseover", "this.src='https://i.stack.imgur.com/XwdyC.png'");
    elecheck.setAttribute("onmouseout", "this.src='https://freepngimg.com/thumb/submit_button/25395-2-submit-button.png'");
    // real answers button
    var allimags = document.getElementsByTagName("img")[1];
    console.log(allimags);
    allimags.setAttribute("onclick", "checkAnswer();");
    allimags.setAttribute("style", "cursor:pointer");
    // popup picture
    var allaings = document.getElementsByTagName("a")[1];
    console.log(allaings);
    allaings.setAttribute("href", ("https://chinese3.i-learner.com.hk/"+threeval+"/P1.jpg"));
    // mc answers button
    var allimagz = document.getElementsByTagName("img")[0];
    console.log(allimagz);
    allimagz.setAttribute("onclick", "get_MC_ans();var allainas = document.getElementsByTagName('input');for (let i = 0; i < allainas.length; i++) {console.log(allainas[i]);allainas[i].removeAttribute('disabled');allainas[i].setAttribute('enabled', '');}");
    allimagz.setAttribute("style", "cursor:pointer");
    // popup picture two
    var allaingz = document.getElementsByTagName("a")[0];
    console.log(allaingz);
    allaingz.removeAttribute("href");
    // troll music addon
    var audio = new Audio('https://chinese3.i-learner.com.hk/buddy_mission/sound_effect/task_s.mp3');
    audio.play();
    // final alert
    alert("script triggered");
})();