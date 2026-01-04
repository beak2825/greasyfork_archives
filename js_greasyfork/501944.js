// ==UserScript==
// @name         Chain Alert
// @namespace    chainalert.zero.nao
// @version      0.1
// @description  chain alert
// @author       nao
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/501944/Chain%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/501944/Chain%20Alert.meta.js
// ==/UserScript==

let alerttime = 90;
let audio = new Audio("https://upload.wikimedia.org/wikipedia/commons/9/98/Beepalert.wav");
let alerts = true;

GM_addStyle(`
#sidebar > div:nth-child(1) > div > div.user-information___VBSOk > div > div.toggle-content___BJ9Q9 > div > div:nth-child(5) > a.chain-bar___vjdPL.bar-desktop___F8PEF > div.bar-stats___E_LqA > p.bar-timeleft___B9RGV {
font-size: 50px;
padding: 15px;
    float: right;
}

#sidebar > div:nth-child(1) > div > div.user-information___VBSOk > div > div.toggle-content___BJ9Q9 > div > div:nth-child(5) > a.chain-bar___vjdPL.bar-desktop___F8PEF > div.bar-stats___E_LqA {
display: contents;
}

#sidebar > div:nth-child(1) > div > div.user-information___VBSOk > div > div.toggle-content___BJ9Q9 > div > div:nth-child(5) > a.chain-bar___vjdPL.bar-desktop___F8PEF
{
overflow: hidden;
}

`);

let targets = [2432412, 2585246, 2491280, 1862874, 2500491, 2707115, 2941622, 1825571, 2902599, 2686537, 1876005, 1890615, 2610586, 2602299, 2181891, 2030267, 2399967];

function check(){
    let time = $("#sidebar > div:nth-child(1) > div > div.user-information___VBSOk > div > div.toggle-content___BJ9Q9 > div > div:nth-child(5) > a.chain-bar___vjdPL.bar-desktop___F8PEF > div.bar-stats___E_LqA > p.bar-timeleft___B9RGV").html();

    time = time.split(":");
    let seconds = parseInt(time[0])*60 + parseInt(time[1]);
    console.log(seconds);
    if (alerts && seconds > 0 && seconds < alerttime){
        alerts = false;
        audio.play();
        
        let target = targets[Math.floor(Math.random()*targets.length)];
        let url = `https://www.torn.com/loader.php?sid=attack&user2ID=${target}`;
        alert("Chain!!");

        window.open(url, "Attack", `width=500,height=700`);
    }

    if (seconds > alerttime){
        alerts = true;
    }


}

setInterval(check, 1000);



$("p.bar-timeleft___B9RGV").on("click", function(e){
    e.stopPropagation();
    let target = targets[Math.floor(Math.random()*targets.length)];
    let url = `https://www.torn.com/loader.php?sid=attack&user2ID=${target}`;
    window.open(url, "Attack", `width=500,height=700,top=${e.clientY + window.screenY},left=${e.clientX + window.screenX + 100}`);
});