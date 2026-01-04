// ==UserScript==
// @name         [hwm]_multiple_people_send
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Paste names and gold amounts to send gold in bulk to multiple people
// @author       Hapkoman
// @match        https://www.lordswm.com/transfer.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508901/%5Bhwm%5D_multiple_people_send.user.js
// @updateURL https://update.greasyfork.org/scripts/508901/%5Bhwm%5D_multiple_people_send.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get transfer sign
    let sign = document.getElementsByName("sign")[0].value;
    //main interface
    let mainContainer = document.createElement('div');
    mainContainer.id = "multi_send_container";
    mainContainer.style.cssText = "width:100%;height:150px";
    mainContainer.innerHTML = "<div>"
    + "<button id='multi_send_start'>Send gold to following people</button>"
    +" </div>"
    + "<div style='max-height: 250px; overflow: auto;'>"
    + "<input id='multi_send_trans_desc' placeholder='Transaction description' type='text'>"
    + "<textarea placeholder='PlayerName[tab]GoldAmount' id='multi_send_input'></textarea>"
    + "</div>";
    document.body.appendChild(mainContainer);

    //get reference to the text input area
    let inputElement = document.getElementById("multi_send_input");

    //setup listener on the start button
    document.getElementById("multi_send_start").onclick = function(){start();};

    function start(){
        let textValue = inputElement.value.trim();
        if (textValue.length < 3){
            alert("Empty input");
            return;
        }
        let description = document.getElementById("multi_send_trans_desc").value;
        //get each row from text input
        let rows = textValue.split("\n");
        for (let i = 0; i < rows.length; i++){
            let [nick, gold] = rows[i].split("\t");
            setTimeout(function(){
                sendGold([nick, gold, description]);
                //sendGold("nick="+encodeURIComponent(nick.trim())+"&gold="+gold.trim()+"&wood=0&ore=0&mercury=0&sulphur=0&crystal=0&gem=0&desc="+encodeURIComponent(description)+"&sign="+sign);
            }, i*300);
        }
    };

    function sendGold(params){
        fetch('transfer.php', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: new URLSearchParams({
                'nick': params[0].trim(),
                'gold': params[1],
                'wood': 0,
                'ore': 0,
                'mercury': 0,
                'sulphur': 0,
                'crystal': 0,
                'gem': 0,
                'desc': params[2].trim(),
                'sign': sign
            })
        });
        return;
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "transfer.php");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhttp.onreadystatechange = afterSend;
        xhttp.send(params);
        console.log(params);
        function afterSend() {
        if (xhttp.readyState == 4) {
        console.log(xhttp);
            if (xhttp.status == 200) {

            }
        }

        }
    };

})();