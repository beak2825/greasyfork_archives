// ==UserScript==
// @name         better luogu
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  ???
// @author       Undercraft
// @match        https://www.luogu.com.cn/user*
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/506066/better%20luogu.user.js
// @updateURL https://update.greasyfork.org/scripts/506066/better%20luogu.meta.js
// ==/UserScript==

var colors = ['rgb(191, 191, 191)', 'rgb(254, 76, 97)', 'rgb(243, 156, 17)', 'rgb(255, 193, 22)', 'rgb(82, 196, 26)', 'rgb(52, 152, 219)', 'rgb(157, 61, 207)', 'rgb(14, 29, 105)'];

$(window).load(function(){
    'use strict';
    var problems = [];
    for(var passed of window._feInjection.currentData.passedProblems) problems.push({pid: passed.pid, dif: passed.difficulty, rendered: false});
    for(var tryed of window._feInjection.currentData.submittedProblems) problems.push({pid: tryed.pid, dif: tryed.difficulty, rendered: false});

    var button = document.createElement("div");
    button.style.backgroundColor = "#fff";
    button.style.boxShadow = "0 1px 3px rgba(26,26,26,.1)"
    button.style.padding = "1.3em"
    $(".side").append(button);

    var h3Text = document.createElement("h3");
    h3Text.style.fontWeight = "normal"
    h3Text.style.fontSize = "1.125em"
    h3Text.style.marginTop = "0"
    h3Text.style.marginBottom = ".5em"
    h3Text.style.fontFamily = "inherit"
    h3Text.style.lineHeight = "1.2"
    h3Text.innerText = "手动刷新"
    button.append(h3Text);

    var btn = document.createElement("button");
    btn.style = "border-color: #3085d6;border-width: 1px;background-color: #3085d6;border-radius: 5px;color: white;box-shadow: none;";
    btn.innerText = "刷新";
    button.append(btn);
    btn.onclick = () => {
        for(var i = 0;i < problems.length;i++) problems[i].rendered = false;
    }

    setInterval(() => {
        if(window.location.href.split("#").length == 2 && window.location.href.split("#")[1] == 'practice'){
            for(var i = 0;i < problems.length;i++) if(!problems[i].rendered) {
                var elements = document.querySelectorAll('a');
                for(var el of elements) if(el.textContent == problems[i].pid) {
                    if (el.classList) el.classList.remove("color-default");
                    else el.className = el.className.replace('color-default',  ' ');
                    problems[i].rendered = true;
                    el.style.color = colors[problems[i].dif];
                    break;
                }
            }
        }else for(var j = 0;j < problems.length;j++) problems[j].rendered = false;
    }, 1000);
});

