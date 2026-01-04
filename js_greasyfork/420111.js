// ==UserScript==
// @name         Pter Bonus Eater
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.0.10
// @description  consume your bonus immediately
// @author       BbLaCk
// @match        https://pterclub.com/mybonus.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481236/Pter%20Bonus%20Eater.user.js
// @updateURL https://update.greasyfork.org/scripts/481236/Pter%20Bonus%20Eater.meta.js
// ==/UserScript==

const timer = ms => new Promise(res => setTimeout(res, ms));

async function do_wof(times) {
    if (times>10){
        alert('禁止超过10次！');return false}
    for (var i = 1;i <= times;i++){
        fetch("https://pterclub.com/mybonus.php?action=exchange",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:'option=3&submit=交换'
        });
        // console.log(i);
        await timer(750)
        // location.reload()
    }
    alert(`恭喜，你已经兑换了${i-1}次了!`)
}

(function() {
    const target = $("td:contains('3,200')").next().eq(0);
    target.children().replaceWith('<input id="clickme" type="button" value="交换">');
    target.prepend('<input id="multi" value="" type="text">');
    $('#clickme').click(function () {do_wof(parseInt($('#multi').val()))})
    // $('#do').click(function () {do_wof(5)});
})();