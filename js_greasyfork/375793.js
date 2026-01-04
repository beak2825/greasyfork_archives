// ==UserScript==
// @name         Check All
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://giveaway.su/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375793/Check%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/375793/Check%20All.meta.js
// ==/UserScript==

var bot = document.createElement("button");
bot.className = "mybot btn-sm btn btn-success";

document.body.appendChild(bot);
bot.style.position = "absolute";
bot.style.right = "130px";
bot.style.top = "600px";
bot.textContent = "Check all";


bot.onclick = function() {


    var b = document.querySelectorAll("button.btn.btn-xs.btn-default");
    var a = document.querySelectorAll("a.btn.btn-xs.btn-default");

    for (var i =1; i < b.length;i++){
        b[i].click();
    }
    console.log(b);
    for ( i =1; i < a.length;i++){
        a[i].href = "#";
        a[i].click();
    }
    console.log(a);

    var dis = document.querySelectorAll("a.btn.btn-success.btn-sm.disabled")[0];
    if (typeof(dis)!=="undefined"){
     dis.classList.remove("disabled");

    }
}
for (var i =0; i < document.scripts.length;i++){
    if(document.scripts[i].textContent==`
            $(document).ready(function() {
                if (typeof adjsData != "undefined") {
                    $("[data-action='adjs']").data("result", adjsData);
                } else {
                    $("[data-action-id='adjs']").removeClass("hidden").find(".btn").removeClass("btn-success");
                }
                $(document).on("click", "button[data-action='adjs']", function() {
                    window.location.reload();
                })
            });
        `){

			document.scripts[i].textContent=`
            $(document).ready(function() {
                if (typeof adjsData != "undefined") {
                    $("[data-action='adjs']").data("result", adjsData);`;


	}
}