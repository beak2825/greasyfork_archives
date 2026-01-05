// ==UserScript==
// @name         Xkcd Forums Time Delta
// @version      0.1
// @description  Finds the time since the previous post or a specified time
// @author       Faubi
// @grant        none
// @match        http://forums.xkcd.com/*
// @match        http://fora.xkcd.com/*
// @match        http://forums3.xkcd.com/*
// @match        http://echochamber.me/*
// @namespace    FaubiScripts
// @downloadURL https://update.greasyfork.org/scripts/12956/Xkcd%20Forums%20Time%20Delta.user.js
// @updateURL https://update.greasyfork.org/scripts/12956/Xkcd%20Forums%20Time%20Delta.meta.js
// ==/UserScript==

function get_date(element) {
    return new Date(/» (.*) [A-Z]{3} /.exec(element.textContent)[1]);
}

function append_dif(element, time1, time2, label) { 
    var w = Math.floor((time1 - time2)/1000);
    var days = Math.floor(w/86400);
    var hours = Math.floor(w/3600)%24;
    var minutes = Math.floor(w/60)%60;
    var seconds = w%60;
    var pList = element.parentNode.getElementsByClassName('delta');
    if (pList.length > 0) {
        element.parentNode.removeChild(pList[0]);
    } else {
        element.parentNode.appendChild(document.createElement('hr'));
    }
    var p = document.createElement('p');       
    p.innerHTML = 'Time since ' + label + ': ' + days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds';
    p.classList.add('delta');
    element.parentNode.appendChild(p);
}

authors = document.getElementsByClassName('author');
for (var i=0;i<authors.length;i++) {
    (function(){
        var author = authors[i];
        if (i>=1) {
            var prevauthor = authors[i-1];
            var button = document.createElement('input');
            button.type = 'button';
            button.style['line-height']='1.2em';
            button.style['margin-left'] = '5px';
            button.style['margin-right'] = '0px';
            button.classList.add('button2');
            button.value = 'ΔPrevious';
            button.addEventListener('click', function(){
                append_dif(author, get_date(author), get_date(prevauthor), 'previous post');            
            });
            author.appendChild(button);
        }
        var button2 = document.createElement('input');
        button2.type = 'button';
        button2.style['line-height']='1.2em';
        button2.style['margin-left'] = '5px';
        button2.classList.add('button2');
        button2.value = 'ΔInput';
        button2.addEventListener('click', function(){
            append_dif(author, get_date(author), new Date(prompt('Enter the date to compare to')), 'inputted time');
        });
        author.appendChild(button2);
        
    })();
}
    