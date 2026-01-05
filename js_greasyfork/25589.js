// ==UserScript==
// @name         ScrapTF Raffle Killer
// @version      0.1
// @description  try to take over the crapTF Raffles and get b4nned!
// @author       spyfly
// @match        https://scrap.tf/raffles*
// @grant        GM_openInTab
// @namespace https://greasyfork.org/users/62425
// @downloadURL https://update.greasyfork.org/scripts/25589/ScrapTF%20Raffle%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/25589/ScrapTF%20Raffle%20Killer.meta.js
// ==/UserScript==

(function() {
    if (window.location == "https://scrap.tf/raffles"){
        scrollDown();
    } else {
        if (document.getElementById("raffle-enter").getElementsByTagName("i18n")[0].innerHTML == "Enter Raffle"){
            document.getElementById("raffle-enter").click();
        } else {
            window.close();
        }
    }
    function openRaffle(i){
        var newI = i + 1;
        if (i !== document.getElementsByClassName("panel-raffle").length){
            if (document.getElementsByClassName("panel-raffle")[i].style.opacity == ""){
                GM_openInTab(document.getElementsByClassName("panel-raffle")[i].getElementsByTagName("a")[0].href, true);
                setTimeout(function(){ openRaffle(newI); }, 3000 + Math.floor((Math.random() * 2000) + 1));
            } else {
                openRaffle(newI);
            }
        }
    }
    function scrollDown(){
        if (document.getElementsByClassName("pag-done")[0].innerHTML == "That's all, no more!"){
            window.scrollTo(0,0);
            openRaffle(0);
        } else {
            window.scrollTo(0,document.body.scrollHeight);
            setTimeout(function(){ scrollDown(); }, 100);
        }
    }
})();