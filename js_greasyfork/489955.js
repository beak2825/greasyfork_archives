// ==UserScript==
// @name         z_map_refresh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  not invalid
// @author       You
// @license      none
// @match        https://www.heroeswm.ru/map*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489955/z_map_refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/489955/z_map_refresh.meta.js
// ==/UserScript==
const audioLink = "https://cdn.freesound.org/previews/699/699705_6998976-lq.mp3";
const sound = new Audio(audioLink);
function send_to_server() {
    let status;
    fetch('https://alexdiscordbot.eu.pythonanywhere.com/gv_notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({})
        })
        .then(response => {
            status = response.status
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
    return status
}
const test = document.querySelector('input[value="В засаду!"]');
const status = document.querySelector("#map_right_block_inside > table > tbody > tr:nth-child(2) > td > font");
if (status && status.textContent!== 'Вам нужно полностью восстановить силы и армию для битвы.') {
    document.querySelector("#set_mobile_max_width").style.backgroundColor = "red";
    send_to_server();
}
if (test) {
    document.querySelector("#set_mobile_max_width").style.backgroundColor = "red";
    send_to_server();
}
else {setTimeout(()=>{
    location.reload();

}, 60000);}

function waitFor8s(){
let a;
    a = document.querySelector("#map_right_block_inside > table").querySelector("a");
    if (!a) return;
    console.log(a);
    if (a.textContent.match(/\d+/)[0] === "7") location.reload();
}
setInterval(waitFor8s, 300);

