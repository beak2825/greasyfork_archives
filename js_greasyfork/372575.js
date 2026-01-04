`// ==UserScript==
// @name MicroScatter Cheater Script
// @namespace http://qsysmine.tk/
// @Version 0.1
// @description Press C on microscatter to win
// @author qsysmine
// @match https://quizlet.com/
// @grant none
// @version 0.0.1.20180925181756
// @downloadURL https://update.greasyfork.org/scripts/372575/MicroScatter%20Cheater%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/372575/MicroScatter%20Cheater%20Script.meta.js
// ==/UserScript==

(function() {
var cheatTime = 0;
window.setCheatTime = function(mils) {
cheatTime = mils;
};

var $ = window.jQuery;
var cheat = function() {
    var ids = [];
    var checkhasid = function(id) {
        for(var i in ids) {
            if(ids[i] == id) {
                return true;
            }
        }
        return false;
    };
    setTimeout(function() {
    $('.cell').each(function(index){

        if(checkhasid($(this).attr("data-id"))) $('[data-id="' + $(this).attr("data-id") + '"]').trigger("click")
        if(!checkhasid($(this).attr("data-id"))) ids.push($(this).attr("data-id"));

    });
    }, cheatTime);
};
window.startWithTime = function(mils) {
    setCheatTime(mils);
    $('#start').trigger("click");
    cheat();
};
var z = 0;
$('*').keyup(function(e) {
    if(e.keyCode == 67 && z === 0 && $('#cells').hasClass("started")) {z = 1; cheat();}
});
})();`