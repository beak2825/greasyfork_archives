// ==UserScript==
// @name         Eagle Eye Cheat
// @namespace    http://114.215.125.102/eagleEye/
// @version      0.2
// @description  啦啦啦啦啦啦
// @author       Jesse Zhu
// @match        http://114.215.125.102/eagleEye/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17092/Eagle%20Eye%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/17092/Eagle%20Eye%20Cheat.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$('body').prepend("<button id=\"cheat\">Cheat!</button>");

$('#cheat').on('click', function(){
    var total = $('#J_Area1 div').length;
    var a = $('#J_Area1 div');
    var b = $('#J_Area2 div');
    for(var i=0; i<total; i++){
        if(a[i].outerHTML != b[i].outerHTML){
            $('[data-index=' + i + ']:eq(0)').click();
            break;
        }
    }
});