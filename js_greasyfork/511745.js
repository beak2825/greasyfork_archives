// ==UserScript==
// @name         useful aternos tools
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  auto_plus_one, randomise_ip, hide_ip
// @author       r!PsAw
// @match        https://aternos.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aternos.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511745/useful%20aternos%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/511745/useful%20aternos%20tools.meta.js
// ==/UserScript==
//const tools = {auto_plus_one: true, randomise_ip: true, hide_ip: true};
let server = {
    status: null,
    players: null,
    ip: null,
    software: null,
    version: null,
}

//BLOCK connect
const originalShowIP = window.showIP;
let isCanceled = false;
function toggleShowIP() {
    if (isCanceled) {
        window.showIP = originalShowIP;
        console.log("showIP() execution restored");
    } else {
        window.showIP = function() {
        };
        console.log("showIP() execution canceled");
    }
    isCanceled = !isCanceled;
}
toggleShowIP();

let old_ip;
let real_ip;
let serverAdressElement = document.querySelector("#ip");
let serverIpElement = document.querySelector("#read-our-tos > main > section > div.page-content.page-server > div.server-ip.mobile-full-width");
let serverIpSide = document.querySelector(`#read-our-tos > div > div.navigation-server.${server.status} > div.navigation-server-info > div.navigation-server-name`);
let editorIp = document.querySelector("#subdomain");
let connectIp;
let ip_modified = false;

function update_server_info(){
    server.status = document.querySelector("#read-our-tos > div > div.navigation-server").classList[1];
    let players = document.querySelector("#read-our-tos > main > section > div.page-content.page-server > div.server-bottom > div.server-bottom-info.server-info > div.live-status > div.live-status-box.js-players-box > div.live-status-box-main > div.live-status-box-value.js-players");
    if(players){
        server.players = players.innerHTML;
        server.software = document.getElementById("software").innerHTML;
        server.version = document.getElementById("version").innerHTML;
    }
    if (real_ip) {
        server.ip = real_ip.trim(); // Trim real_ip if it exists
    } else {
        if (serverIpSide) {
            server.ip = serverIpSide.innerHTML.trim(); // Trim spaces from innerHTML
        }
    }
    serverIpSide = document.querySelector(`#read-our-tos > div > div.navigation-server.${server.status} > div.navigation-server-info > div.navigation-server-name`);
    connectIp = document.querySelector("#theme-switch > dialog > main > div.alert-body > div:nth-child(1)");
    //console.log(server);
}

setInterval(update_server_info, 500);

//ip hider && replacer
function generate_string() {
    let num = Math.floor(Math.random() * 1000001);
    let final = num.toString() + ".aternos.me";
    return final;
}

function hide_ip(){
    if(editorIp){
       if(!ip_modified){
         real_ip = editorIp.innerHTML + '.aternos.me';
         ip_modified = true;
       }
       let final_str = '';
       let length = editorIp.innerHTML.length;
       for (let i = 0; i < length; i++) {
          final_str += '*';
       }
          editorIp.innerHTML = final_str;
       }
}

function replace_ip() {
   //console.log(`running replace_ip old_ip = ${old_ip} real_ip = ${real_ip}`);
   if(serverIpElement && serverAdressElement && serverIpSide){
    //console.log("all elements were found");
    if(!old_ip){
        old_ip = serverIpElement.textContent.split('\n')[2];
        if(!ip_modified){
           real_ip = old_ip;
           ip_modified = true;
        }
    }
    let new_ip = generate_string();
    let innerHTML = serverIpElement.innerHTML;
    if(connectIp){
       let innerHTML2 = connectIp.innerHTML.trim();
       innerHTML2 = innerHTML2.replace(old_ip, new_ip);
       connectIp.innerHTML = innerHTML2;
    }
    innerHTML = innerHTML.replace(old_ip, new_ip);
    serverAdressElement.innerHTML = new_ip;
    serverIpSide.innerHTML = new_ip.split('.')[0];
    serverIpElement.innerHTML = innerHTML;
    old_ip = new_ip;
   }else if(serverIpSide){
       //console.log("one element found");
       let new_ip = generate_string();
       serverIpSide.innerHTML = new_ip.split('.')[0];
       old_ip = new_ip;
   }
   hide_ip();
}

setInterval(replace_ip, 200);

//what type of page?
/*
document.addEventListener("DOMContentLoaded", function () {
    checkPage();
});

let current_page;
function checkPage() {
    let server_subpage_element = document.querySelector("#read-our-tos > main > section > div.page-content");
    let server_selector_element = document.querySelector("#theme-switch > div.body > main > div > div.main-content-wrapper > section > div.page-content.page-servers");

    let server_subpage = server_subpage_element ? server_subpage_element.classList[1].split('-')[1] : null;
    let server_selector = server_selector_element ? server_selector_element.classList[1].split('-')[1] : null;

    if (server_subpage) {
        current_page = server_subpage;
    } else if (server_selector) {
        current_page = server_selector;
    } else {
        current_page = "Unknown Page";
    }
    console.log(current_page);
}
*/

//actual logic

function infinite_server_uptime() {
   if(server.status === "online"){
    let timerElement = document.querySelector("#read-our-tos > main > section > div.page-content.page-server > div.server-status > div.status.online > div > div > div.end-countdown > div.timer > div");

    if (timerElement) {
        let timer = timerElement.innerHTML.trim();

        // Check if the timer value is less than "1:00"
        if (timer < "0:30") {
            let plus_one = document.getElementsByClassName("btn btn-tiny btn-success server-extend-end");
            if (plus_one.length > 0) {
                plus_one[0].click();
            }
        }
    }
   }
}

setInterval(infinite_server_uptime, 500);