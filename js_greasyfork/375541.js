// ==UserScript==
// @name         UofT 抢课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant        none
// @include     https://acorn.utoronto.ca/*
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/375541/UofT%20%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/375541/UofT%20%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

var course_code = "csc148"
var t = 1;
var Lec_code = null;
var Tut_code = null;
var Pra_code = null;
$(document).ready(function(){
  $('#typeaheadInput').val(course_code);
  $('#typeaheadInput').trigger('change');
});
var b = $( "#typeahead-search > div.ut-typeahead-container > form > div > div > div" ).select()[0].style.display = "block";
b;

var click_on_result = function(){
    var result = document.getElementsByClassName("ut-typeahead-results-list")[0].getElementsByTagName("li")[t]
    result.click()
    setTimeout(check_course, 500)
}

var check_course = function(){
    var flag = false
    var sections = document.getElementsByClassName("modal-course-container")[0]
    var section = sections.getElementsByClassName("modal_course_enrolment")[0]
    var lecture = section.getElementsByTagName("table")[0]
    var tables;
    if (check_type_exist(lecture)){
        if (Lec_code !== null){
            tables = lecture.getElementsByTagName('tbody')
            for (let i=0;i<tables.length;i++){
                let inp = tables[i].getElementsByTagName('input')[0]
                if (inp.id === Lec_code){
                    inp.click()
                    flag = true
                }
            }
        } else {
            tables = lecture.getElementsByTagName('tbody')
            var re = /\d+ of \d+ available./i ;
            for (let i=0;i<tables.length;i++){
                let text = $('#'+ tables[i].id + ' > tr > td.spaceAvailability > div > div > div > div:nth-child(1) > span')[0].innerText
                if (re.test(text)){
                    let inp = tables[i].getElementsByTagName('input')[0]
                    inp.click()
                    flag = true
                }
            }
        }
       
    } else {
        refresh()
    }

    var tutorial = section.getElementsByTagName("table")[1]
    if (check_type_exist(tutorial)){
        if (Tut_code !== null){
            tables = tutorial.getElementsByTagName('tbody')
            for (let i=0;i<tables.length;i++){
                let inp = tables[i].getElementsByTagName('input')[0]
                if (inp.id === Lec_code){
                    inp.click()
                }
            }
        } else {
            tables = tutorial.getElementsByTagName('tbody')
            for (let i=0;i<tables.length;i++){
                let inp = tables[i].getElementsByTagName('input')[0]
                inp.click()
            }
        }
    }
    var practice = section.getElementsByTagName("table")[2]
    if (check_type_exist(practice)){
        if (Pra_code !== null){
            tables = practice.getElementsByTagName('tbody')
            for (let i=0;i<tables.length;i++){
                let inp = tables[i].getElementsByTagName('input')[0]
                if (inp.id === Lec_code){
                    inp.click()
                }
            }
        } else {
            tables = practice.getElementsByTagName('tbody')
            for (let i=0;i<tables.length;i++){
                let inp = tables[i].getElementsByTagName('input')[0]
                inp.click()
            }
        }
    }
    if (flag){
        let enrolbutton = document.getElementById("enrol")
        if (enrolbutton.disabled === true){
            refresh()
        }else {
            enrolbutton.click()
        }
    }
}



var check_type_exist = function(elem){
    if (elem.getElementsByTagName('tbody').length === 0)return false
    return true
}
var f = false;
var refresh = function(){
    let randomTime = (1 + Math.random())*400
    setTimeout(location.reload(), randomTime)
}
setTimeout(click_on_result, 1000)


