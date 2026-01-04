// ==UserScript==
// @name         #teamtrees Trees Left!?
// @namespace    Go Donate, Plant a Tree
// @version      0.1
// @description  Show how many trees are left until we hit the 20,000,000 tree goal.
// @author       csysadmin
// @match        https://teamtrees.org/*
// @downloadURL https://update.greasyfork.org/scripts/393953/teamtrees%20Trees%20Left%21.user.js
// @updateURL https://update.greasyfork.org/scripts/393953/teamtrees%20Trees%20Left%21.meta.js
// ==/UserScript==

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

(function() {
    setTimeout(function(){
        var nowCount = document.getElementById('totalTrees').innerHTML;
        nowCount = parseFloat(nowCount.replace(/,/g, ''));
        var leftCount = numberWithCommas(20000000 - nowCount);
        document.getElementById('totalTrees').innerHTML = leftCount;
        document.querySelector("body > div.hero-background.mb-0 > div.container > div > div > div > div > div.measure-wrap > span").innerHTML = 'TREES TO GO';
    }, 2000);
})();