// ==UserScript==
// @name         sandbox server finder [demo]
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  find private sandbox servers by connecting with iframe (use chrome extension for captcha solver)
// @author       r!PsAw
// @match        https://diep.io
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524451/sandbox%20server%20finder%20%5Bdemo%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/524451/sandbox%20server%20finder%20%5Bdemo%5D.meta.js
// ==/UserScript==

//I have to fix the filtering logic between valid and invalid server, because right now it just adds all links

let iframes_count = 0;
let current_num;

function createButtonContainer() {
    const container = window.document.createElement("div");
    container.id = "link-container";
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.width = "300px";
    container.style.height = "400px";
    container.style.overflowY = "scroll";
    container.style.border = "2px solid #ccc";
    container.style.borderRadius = "10px";
    container.style.backgroundColor = "#fff";
    container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    container.style.padding = "10px";
    container.style.zIndex = "10000";

    // Add the container to the document body
    window.document.body.appendChild(container);
}

function new_iframe(link) {
    iframes_count++;

    // Create a container for the iframe
    const iframeContainer = document.createElement("div");
    iframeContainer.style.position = "fixed";
    iframeContainer.style.bottom = "10px";
    iframeContainer.style.right = "10px";
    iframeContainer.style.width = "25%";
    iframeContainer.style.height = "20%";
    iframeContainer.style.border = "2px solid #ccc";
    iframeContainer.style.borderRadius = "10px";
    iframeContainer.style.overflow = "hidden";
    iframeContainer.style.backgroundColor = "#fff";
    iframeContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    iframeContainer.style.zIndex = "10000";

    // Create the iframe
    const iframe = document.createElement("iframe");
    iframe.src = link;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // Add a close button
    const closeButton = document.createElement("button");
    closeButton.id = `close-${iframes_count}`;
    closeButton.innerText = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "5px";
    closeButton.style.border = "none";
    closeButton.style.backgroundColor = "#f44336";
    closeButton.style.color = "#fff";
    closeButton.style.borderRadius = "50%";
    closeButton.style.width = "24px";
    closeButton.style.height = "24px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.style.textAlign = "center";
    closeButton.style.lineHeight = "20px";
    closeButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";

    closeButton.onclick = () => {
        iframes_count--;
        iframeContainer.remove();
    };

    // Append the iframe and close button to the container
    iframeContainer.appendChild(iframe);
    iframeContainer.appendChild(closeButton);

    // Append the container to the document body
    document.body.appendChild(iframeContainer);
}

function is_connected(type){
    switch(type){
        case 'main':
            return !!window.lobby_ip;
            break
        case 'iframe':
            return !!window[1].lobby_ip;
            break
    }
}

function connection_failed(type){
    switch(type){
        case 'main':
            return document.querySelector("#loading-subtitle").classList.contains('active');
            break
        case 'iframe':
            return window[1].document.querySelector("#loading-subtitle").classList.contains('active');
            break
    }
}

//basic function to construct links
function link(baseUrl, lobby, gamemode, team) {
    let str = "";
    str += baseUrl + "?s=" + lobby + "&g=" + gamemode + "&l=" + team;
    return str;
}

function get_baseUrl() {
    return location.origin + location.pathname;
}

function get_your_lobby() {
    return window.lobby_ip.split(".")[0];
}

function get_gamemode() {
    //return window.__common__.active_gamemode;
    return window.lobby_gamemode;
}

function get_team(type) {
    switch(type){
        case 'main':
            return window.__common__.party_link;
            break
        case 'iframe':{
            let str = window[1].__common__.party_link;
            if(!str){
                current_num--;
                return (current_num + 'x0');
            }
            let old_num = Number(str.split('x')[0]);
            let new_num = old_num-1;
            current_num = new_num;
            return (new_num + 'x0');
        }
            break
    }
}

//start
function setup_iframe(){
    let l;
    switch(iframes_count){
        case 0:
            //no iframes are active, so create one with the current link
            l = link(get_baseUrl(), get_your_lobby(), get_gamemode(), get_team('main'));
            new_iframe(l);
            break
        case 1:
            //close previous one to open a new one
            if(is_connected('iframe')){
                l = link(get_baseUrl(), get_your_lobby(), get_gamemode(), get_team('iframe'));
                document.getElementById(`close-${iframes_count}`).click();
                setTimeout(() => {
                    new_iframe(l);
                    watch_iframe();
                }, 250);
            }else{
                setTimeout(setup_iframe, 250);
            }
            break
    }
}

//watch the iframe
function watch_iframe(){
    if(is_connected('iframe')){
        if(connection_failed('iframe')){
            setup_iframe();
        }else{
            add_link();
            setTimeout(setup_iframe, 250);
        }
    }else{
        setTimeout(watch_iframe, 100);
    }
}

//store the links here
let links = new Map();
function add_link() {
    const linkId = links.size + 1;
    const savedLink = link(
        get_baseUrl(),
        get_your_lobby(),
        get_gamemode(),
        current_num + 'x0'
    );

    links.set(linkId, savedLink);
    window.sandbox_links = links;

    // Create a button for the new link
    const button = document.createElement("button");
    button.innerText = `Link ${linkId}`;
    button.style.margin = "5px";
    button.style.padding = "10px";
    button.style.backgroundColor = "#007BFF";
    button.style.color = "#FFF";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.display = "block";
    button.style.width = "90%"; // To fit nicely in the container

    // Add click event to open the link in a new window
    button.onclick = () => {
        window.open(savedLink, "_blank");
    };

    // Add the button to the container
    const container = document.getElementById("link-container");
    if (container) {
        container.appendChild(button);
    } else {
        console.error("Container for buttons not found.");
    }
}

//initialise
function init(){
    if(is_connected('main') && !connection_failed('main')){
        createButtonContainer();
        setTimeout(() => {
            setup_iframe();
            watch_iframe();
        }, 500);
    }else{
        setTimeout(init, 100);
    }
}
init();