// ==UserScript==
// @name         Drill and Skill
// @version      2.1.2
// @author       Michal Košek
// @match        https://www.drillandskill.com/cs/app/solve
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @description:cs Script pro D&S
// @namespace https://greasyfork.org/users/77285
// @description Script pro D&S
// @downloadURL https://update.greasyfork.org/scripts/24495/Drill%20and%20Skill.user.js
// @updateURL https://update.greasyfork.org/scripts/24495/Drill%20and%20Skill.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //options
    var safe = false;
    //find question type (can only decide between text to text and text to choice)
    function questiontype(){
        if (document.getElementsByClassName("butYellow answer")[0] === undefined){
            return "text";
        }
        else {
            return "choice";
        }
    }
    //retreive answer
    function retreive(){
        return localStorage.getItem(question());
    }
    //store answer
    function store(){
        localStorage.setItem(question(), get());
    }
    //get question
    function question() {
        var leftCol = document.querySelectorAll('.leftCol')[1].innerHTML;
        var start_pos = leftCol.indexOf("<p>")+3;
        var end_pos = leftCol.indexOf("</p>",start_pos);
        return leftCol.substring(start_pos,end_pos);
    }
    //get answer
    function get() {
        var answhole = $.ajax({async:false,url:"https://www.drillandskill.com/cs/app/solve/checkAnswer"}).responseText;
        var start_pos = answhole.indexOf("<br />")+6;
        var end_pos = answhole.indexOf("<br />",start_pos);
        var ans = answhole.substring(start_pos,end_pos);
        if (questiontype() === "text") {
            return ans;
        }
        else {
            return $('div[value='+ans+']').text();
        }
    }
    //post answer
    function post() {
        if (questiontype() === "text") {
            document.getElementsByClassName("answer keypad")[0].value = retreive();
            document.querySelector('.checkAnswer').click();
        }
        else {
            Array.prototype.slice.call(document.getElementsByTagName('div')).filter(el => el.textContent.trim() === retreive().trim())[0].click();
        }
    }
    //restart
    function restart(){
        document.querySelector('.restartTrainerBut').click();
    }
    //check last question
    function qleft() {
        var qcount = document.querySelector('.questionCount').innerHTML;
        var start_pos = qcount.indexOf("div")+4;
        var end_pos = qcount.indexOf("div",start_pos)-2;
        var num = qcount.substring(start_pos,end_pos);
        var current = num.substring(0,num.indexOf("/"));
        window.max = num.substring(num.indexOf("/")+1);
        return max-current;
    }
    //exec
    if (retreive() === null) {
        store();
        restart();
    }
    else {
        if (safe === false) {
            if (qleft() === 0){
                if (questiontype() === "text") {
                    setTimeout(function(){post();},(max*((Math.random()*2000)+4000)));
                }
                else {
                    setTimeout(function(){post();},(max*((Math.random()*1000)+2500)));
                }
            }
            else {
                post();
            }
        }
        else {
            if (questiontype() === "text") {
                document.getElementsByClassName("answer keypad")[0].value = retreive();
            }
            else {
                Array.prototype.slice.call(document.getElementsByTagName('div')).filter(el => el.textContent.trim() === retreive().trim())[0].style.backgroundColor = '#cc00cc';
            }
        }
    }
})();