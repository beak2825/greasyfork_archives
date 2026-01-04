// ==UserScript==
// @name         users-trade
// @namespace    https://wallex.ir/
// @version      2.0
// @description  Append users-trade to side menu!
// @author       You
// @include      https://wallex.ir/app*
// @icon         https://www.google.com/s2/favicons?domain=wallex.ir
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/429605/users-trade.user.js
// @updateURL https://update.greasyfork.org/scripts/429605/users-trade.meta.js
// ==/UserScript==

(function() {
    let a = document.querySelector('#app > aside > section > ul > li:nth-child(1) > a > span');

    if (a.innerText === "سفارش ها") {
        let new_li = document.createElement('li');
        new_li.innerHTML = '<a href="/app/new-user-trades"> <i class="fa fa-align-right"></i> <span>معاملات کاربران</span> </a>'
        let a = document.querySelector('#app > aside > section > ul');
        a.appendChild(new_li)
    }
    else{
        console.log('Not Sbaqeri')
    }

})();