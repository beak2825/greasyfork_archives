// ==UserScript==
// @name        ProjEulerProgress
// @namespace   pep
// @description Displays progress
// @include     https://projecteuler.net/progress*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @author      oerpli
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23915/ProjEulerProgress.user.js
// @updateURL https://update.greasyfork.org/scripts/23915/ProjEulerProgress.meta.js
// ==/UserScript==
var regex = new RegExp("Progress: ([0-9]*) \/ ([0-9]*)");
var ach = $(".info a span div").filter(function () {
    return regex.test($(this).text()); 
});

ach.each(function(){
    var str = $(this).text();
    var res = str.match(regex);
    if(res){
        var x1 = 1*res[1];
        var x2 = 1*res[2];
        var gradient = 'linear-gradient(90deg, #cee7b6 ' + (x1/x2*100) +'%, #FFF ' + (x1/x2*100) + '%)';
        $(this).parent().parent().parent().parent().css('background',gradient);
    }
});