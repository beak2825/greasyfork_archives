// ==UserScript==
// @name       FMU Skill Color
// @namespace  https://greasyfork.org/users/63572
// @version    1.0.0
// @description  Skill color change
// @match      *://ultra.trophymanager.com/players*
// @author     Jozi B.
// @copyright  2016 - JB
// @require http://code.jquery.com/jquery-latest.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/22833/FMU%20Skill%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/22833/FMU%20Skill%20Color.meta.js
// ==/UserScript==

$(document).ready(function(){
        $('.skill_table td').each(function(){
            if($(this).text() <1) {
                $(this).css('background-color','transparent');
            }
            else if($(this).text() >= 1 && $(this).text() <30) {
                $(this).css('background-color','#A52728');
            }
            else if($(this).text() >= 30 && $(this).text() <50) {
                $(this).css('background-color','#D0510F');
            }
            else if($(this).text() >= 50 && $(this).text() <75) {
                $(this).css('background-color','#1B6C89');
            }
            else if($(this).text() >= 75 && $(this).text() <90) {
                $(this).css('background-color','#357A21');
            }
            else if($(this).text() >= 90 && $(this).text() <101) {
                $(this).css('background-color','#234f2b');
            }
            else if($(this).text() >=101) {
                $(this).css({'background-color':'#364139','color':'#faec74'});
            }
        });
    });