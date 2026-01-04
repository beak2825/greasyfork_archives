// ==UserScript==
// @name         Sryth reroller
// @version      1.12
// @author       Yoyó
// @description  Rerolls the starting stats of your character in Sryth, until you get at least the score you set.
// @match        http://www.sryth.com/game/index.php*
// @icon         https://i.ibb.co/Y7W0Zwd/pinkieemote.png
// @namespace    https://greasyfork.org/users/390287
// @downloadURL https://update.greasyfork.org/scripts/392172/Sryth%20reroller.user.js
// @updateURL https://update.greasyfork.org/scripts/392172/Sryth%20reroller.meta.js
// ==/UserScript==

//manual settings
var yo_num = 10; //script will stop when average stats (displayed on the page) is at least this much. Not worth setting to 20. ;)
var yo_timer = 1000 //timer in milliseconds, default 1000, lower it here if you want it to be faster, but your PC might not handle it correctly
//manual settings over

var yo_force = 0;
var yo_times_run = 0;
var yo_rrBtn;
yo_gg();

function yo_gg(){
    var yo_chk = window.setInterval(function(){
        yo_rrBtn = document.getElementById("fmain").contentWindow.document.querySelector('input[value="REROLL STATS"');
        if(yo_rrBtn){
            clearInterval(yo_chk);
            yo_chkNum();
        }
    },100);
}

function yo_chkNum(){
    let yo_statAvgStat = parseInt(document.getElementById("fmain").contentWindow.document.querySelectorAll('table.table_basic b')[11].innerHTML);
    yo_times_run++;
    if (yo_statAvgStat < yo_num || yo_force) { //reroll if not good
        yo_force = 0;
        yo_rrBtn.click();
        let yo_timeOut = setTimeout(yo_gg,yo_timer);
    } else {
        if (!document.getElementById("fmain").contentWindow.document.getElementById("yo_input")) {
            if(yo_times_run > 1 && yo_num != 10){
                alert("Searched for average stats of " + yo_num + "\nFound one with " + yo_statAvgStat);
            }
            yo_createSettings(yo_rrBtn);
        }
    }
}

function yo_createSettings(btn){
    let yo_si = document.createElement("input");
    yo_si.id = "yo_input";
    yo_si.value = yo_num;
    yo_si.type = "number";
    yo_si.setAttribute("style","width: 40px");
    btn.insertAdjacentElement("beforebegin",yo_si);
    let yo_sb = document.createElement("button");
    yo_sb.id = "yo_inpbutt";
    yo_sb.innerHTML = "Go";
    yo_sb.setAttribute("style","width: 30px;height: 22px;padding: 0px;");
    yo_sb.addEventListener("click",yo_clicked);
    btn.insertAdjacentElement("beforebegin",yo_sb);
}
function yo_clicked(){
    let numin = parseInt(document.getElementById("fmain").contentWindow.document.getElementById("yo_input").value);
    if(numin < 10 || numin > 20) {
        let yo_inpbutt = document.getElementById("fmain").contentWindow.document.getElementById("yo_inpbutt");
        yo_inpbutt.style.color = "red";
        let yo_timeout = setTimeout(function(){yo_inpbutt.style.color = "black"},500);
    } else {
        yo_num = numin;
        yo_force = 1;
        yo_chkNum();
    }
}