// ==UserScript==
// @name         Ifunny Username Exploit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes Ifunny username every five seconds
// @author       BackDoorExplorer
// @match        https://ifunny.co/*
// @icon         https://imageproxy.ifunny.co/crop:square,resize:100x,quality:90/user_photos/63fcad6e5b8da8f0137340f004133d5c418bf3fb_0.webp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452452/Ifunny%20Username%20Exploit.user.js
// @updateURL https://update.greasyfork.org/scripts/452452/Ifunny%20Username%20Exploit.meta.js
// ==/UserScript==


//Enter Usernames within the ''
var name1 = ('Example_Username')
var name2 = ('')
var name3 = ('')
var name4 = ('')
var name5 = ('')

//Grabs your current username
const test1 = document.querySelector("#App > div.v9ev > div.xbey > div > div > div > div.Hi31 > form > div:nth-child(2) > div.Ea9k._3CDb.WU\\+u > input").value

//Creates the Run Exploit Button
let btn = document.createElement("button");
btn.innerHTML = "Run Exploit";

//Checks if username was changed, gives message if exploit has failed
btn.onclick = function () {
    if (test1 == document.querySelector("#App > div.v9ev > div.xbey > div > div > div > div.Hi31 > form > div:nth-child(2) > div.Ea9k._3CDb.WU\\+u > input").value){
        alert('Exploit Failed, Reload The Page, Change Your Username And Complete The Captcha. If Captcha Is Not Completed, Exploit Will Not Work');

        //Spams name changes in order to trigger captcha request appon next attempted username change
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name1+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name2+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name3+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name4+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name5+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
    }

    //If exploit was a success, changes name every 5 seconds
    else {
        alert('You have 5 minutes before the Exploit stops working and you will have to redo this again. Exploit will work as long as this tab stays open.');
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name1+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name2+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name3+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name4+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
        setInterval(function () {
	fetch("https://ifunny.co/api/v1/account",
{
  "headers": {
    "accept": "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "same-origin",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "fdf84b17a454e0c964d5d4fc1bfad46d",
    "x-requested-with": "fetch"
  },
  "referrer": "https://ifunny.co/account/edit",
  "referrerPolicy": "same-origin",
  "body": "{\"nick\":\""+name5+"\"}",
  "method": "PATCH",
  "mode": "cors",
  "credentials": "include"
});
}, 500);
    }
}

//Attaches Run Exploit Button to the bottom of the page
window.onload = function() {
     if (location.href == "https://ifunny.co/account/edit") {
document.getElementsByClassName('_3y1U')[0].appendChild(btn);
     }
 }