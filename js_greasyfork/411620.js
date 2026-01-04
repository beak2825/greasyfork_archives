// ==UserScript==
// @name         Zetamac
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://arithmetic.zetamac.com/game*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/411620/Zetamac.user.js
// @updateURL https://update.greasyfork.org/scripts/411620/Zetamac.meta.js
// ==/UserScript==


var input = document.getElementsByClassName("answer")[0];
var character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()`~-_=+[{]} \\ |;: \' \" ,<.>/?", number = "0123456789";

function isNumber(num) {
    for(let j = 0; j < 10; j++) {
        if(num == number.charAt(j)) return true;
    }
    return false;
}

function isChar(char) {
    for(var i = 0; i < character.length; i++) {
        if(char === character[i]) return true;
    }
    return false;
}

function parse() {
    var problem = document.getElementsByClassName("problem")[0].innerHTML;
    var n = 0, m = 0, ans, operator, reached = false;
    for(let i = 0; i < problem.length; i++) {
        var char = problem.charAt(i);
        switch(char) {
            case '+':
                operator = '+';
                reached = true;
                break;
            case '–':
                operator = '–';
                reached = true;
                break;
            case '×':
                operator = '×';
                reached = true;
                break;
            case '÷':
                operator = '÷'
                reached = true;
        }
        if(!isNumber(char)) continue;
        if(reached) m = 10 * m + (char - '0');
        else n = 10 * n + (char - '0');
    }
    switch(operator) {
        case '+':
            ans = n + m;
            break;
        case '–':
            ans = n - m;
            break;
        case '×':
            ans = n * m;
            break;
        case '÷':
            ans = n / m;
    }
    return ans.toString();
}

function checkDelete(key) {
    if(key === "Backspace" || key == "Delete") {
        if(input.value[input.value.length - 1] === undefined) return true;
        if(input.value.length != 0) input.value = input.value.slice(0, -1);
        return false;
    }
}

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
async function display(ans) {
    for (let i = 0; i < ans.length; i++) {
        await sleepNow(75);
        input.value += String(ans.charAt(i));
    }
}

(function() {
    input.addEventListener("keydown",
    function(e) {
        e.preventDefault();
        const key = e.key;
        if(checkDelete(key) || !isChar(key)) return;
        var ans = parse();
        input.value = ans;
        // display(ans)
    } );
})();