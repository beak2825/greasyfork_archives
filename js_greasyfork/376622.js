// ==UserScript==
// @name         RYM group member newline
// @namespace    rym.sux
// @version      1.1.1
// @description  makes the list of group members readable
// @author       wahlp
// @include      https://rateyourmusic.com/artist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376622/RYM%20group%20member%20newline.user.js
// @updateURL https://update.greasyfork.org/scripts/376622/RYM%20group%20member%20newline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elems = document.querySelectorAll("*"),
        res = Array.from(elems).find(v => v.textContent == 'Members');
    if (res) {
        var txt = res.nextElementSibling.innerHTML;
        //gather brackets and commas
        var regex = /\(/g, result, open_brackets = [], closed_brackets = [], commas = [], square_open = [], square_closed = [];
        while ( (result = regex.exec(txt)) ) {
            open_brackets.push(result.index);
        }
        regex = /\)/g;
        while ( (result = regex.exec(txt)) ) {
            closed_brackets.push(result.index);
        }
        regex = /\,/g;
        while ( (result = regex.exec(txt)) ) {
            commas.push(result.index);
        }
        regex = /\[/g;
        while ( (result = regex.exec(txt)) ) {
            square_open.push(result.index);
        }
        regex = /\]/g;
        while ( (result = regex.exec(txt)) ) {
            square_closed.push(result.index);
        }
        //find the commas between brackets and mark them
        for (var i = commas.length - 1; i >= 0; i--){ //looping backwards because adding the br tag changes the index of subsequent text
            var index = commas[i];
            for (var j in open_brackets){
                if (index > open_brackets[j] && index < closed_brackets[j]){ //found comma between matching brackets
                    commas[i] = 0; //mark commas between brackets
                    break; //escape loop to review comma position
                }
            }
            for (var k in square_open){ //same as before but with square brackets
                if (index > square_open[k] && index < square_closed[k]){
                    commas[i] = 0;
                    break;
                }
            }
            if (commas[i] != 0){ // unmarked comma is outside brackets
                txt = txt.slice(0,commas[i]+1) + '<br>' + txt.slice(commas[i]+1);
            }
        }
        res.nextElementSibling.innerHTML = txt;
        var useless_float = document.getElementsByClassName('dfp_300_float_right')[0];
        useless_float.parentNode.removeChild(useless_float);
    }

})();