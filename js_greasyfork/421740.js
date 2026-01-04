// ==UserScript==
// @name         Bubble.am logowanie hashem
// @namespace    https://discord.gg/p56aQHNU9U
// @version      1.0
// @description  Umożliwia logowanie za pomocą "user_hash" po wciśnięciu klawisza "H" i wyświetla hash danego konta po wciśnięciu klawisza "J"
// @author       enderror
// @match        *://bubble.am/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421740/Bubbleam%20logowanie%20hashem.user.js
// @updateURL https://update.greasyfork.org/scripts/421740/Bubbleam%20logowanie%20hashem.meta.js
// ==/UserScript==

function getCookie(name) {
    let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value, days) {
    const d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}

function login(text, hash) {
    const result = window.prompt(text, hash);

    if(result === null) return;
    if(result.length !== 40 || result === "") return alert("Niepoprawny hash!"), login("Wprowadź poniżej hash użytkownika:\n\nUWAGA! Po wprowadzeniu poprawnego hasha i naciśnięciu OK nastąpi odświeżenie strony.", "");

    deleteCookie("user_hash");
    deleteCookie("PHPSESSID");
    setCookie("user_hash", result, 30);

    window.location.reload();
}

function keydown(e) {
    const chat = document.querySelector("#chat_textbox"), battleChat = document.querySelector("#battle_chat");
    if(chat === document.activeElement || battleChat === document.activeElement) return;

    if(e.keyCode === 72) {
        login("Wprowadź poniżej hash użytkownika:\n\nUWAGA! Po wprowadzeniu poprawnego hasha i naciśnięciu OK nastąpi odświeżenie strony.");
    } else if(e.keyCode === 74) {
        const user_hash = getCookie("user_hash");
        user_hash !== null ? window.prompt(`Twój user_hash znajduje się poniżej w polu tekstowym.\n\nUWAGA! Pamiętaj aby nikomu bezmyślnie go nie podawać.`, user_hash) : alert("Podgląd wartości user_hash jest możliwy tylko wtedy gdy jesteś zalogowany/a.")
    }
}

document.addEventListener("keydown", keydown);

console.log("Created by DD7");