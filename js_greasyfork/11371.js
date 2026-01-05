// ==UserScript==
// @name         User Counter
// @namespace    http://your.homepage/
// @version      1.3
// @description  Counts the users
// @author       Anon
// @match        https://epicmafia.com/user/498650
// @downloadURL https://update.greasyfork.org/scripts/11371/User%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/11371/User%20Counter.meta.js
// ==/UserScript==

unsafeWindow.userCount = {};

function countUsers() {
    $(".time_right").remove();
    var usersText = $(".question_content");
    for (var i = 0; i < usersText.length; i++) {
        userCount[usersText[i].textContent] = true;
    }
    delete userCount["I'm compiling a list of really good em players. I'll send you their names as I think of them."];
    console.log(userCount);
    console.log(Object.keys(userCount).length);
}

setTimeout(function() {
    $("[ng-click*='loadUnanswered']").click(function() {
        setTimeout(function() {
            countUsers();
            $(".pull_rt").click(function() {
                setTimeout(countUsers, 500);
            });
        }, 500);
    });
}, 500);

