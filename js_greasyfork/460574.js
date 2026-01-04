// ==UserScript==
// @name         23_feb_battles_evasion
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Если 9 или 0 минут и надеты арты, заходит в инвентарь и снимает их
// @author       You
// @license     GNU GPLv3
// @match       https://www.heroeswm.ru/*
// @match       https://my.lordswm.com/*
// @match       https://www.lordswm.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460574/23_feb_battles_evasion.user.js
// @updateURL https://update.greasyfork.org/scripts/460574/23_feb_battles_evasion.meta.js
// ==/UserScript==
function get_request(url){
    var oReq = new XMLHttpRequest();
    oReq.open("get", url, false);
    oReq.send();
    return oReq.responseText
}
function dressed(){
    let wrapper= document.createElement('div');
    wrapper.innerHTML = get_request("https://"+location.host+"/inventory.php")
    let div_table = wrapper.querySelectorAll("[art_id='0']")
    for(let i = 0; i< div_table.length; i++){
        if (!div_table[i].className.includes("slot_size inv_slot_hover slot")) continue;
        if (div_table[i].children.length>0){
            return true
            break
        }
    }
    return false
}
let loop = ()=>{
    let now = new Date()
    let time_last_digit = now.getMinutes().toString().slice(-1)
    if (time_last_digit=="9"||time_last_digit=="0"){
        if (window.location.href.includes("inventory") ){
            if(dressed()) window.try_undress_all()
        }
        else{
            if (dressed()) window.location = "https://"+location.host+"/inventory.php"
        }
    }
}
loop()
let interval1 = setInterval(loop, 3000)


