// ==UserScript==
// @name         VPN F5
// @namespace    https://greasyfork.org/uk/scripts/454484
// @version      0.7
// @description  Підключення до VPN F5
// @author       svolikov
// @license      MT
// @match        https://ra.ukrtelecom.net/vdesk/webtop.eui?webtop=/Common/*
// @match        https://login.microsoftonline.com/*
// @match        https://fs.ukrtelecom.net/adfs/ls/?wfresh=0&wauth=*
// @icon         https://ra.ukrtelecom.net/public/images/modern/general/f5-logo-desktop.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/454484/VPN%20F5.user.js
// @updateURL https://update.greasyfork.org/scripts/454484/VPN%20F5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(window.location.href)
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
//    let encrypted = CryptoJS.AES.encrypt("Перевірка", "password")
//    alert(CryptoJS.AES.decrypt(encrypted, "password").toString(CryptoJS.enc.Utf8))


    const GM_USERMAIL = 'userMail'
    const GM_USERPSW = 'userPsw'
    const GM_METODNUM = 'metodNum'
    const GM_TIMEOUT = 'TimeOut'
    const TIMEOUTDEFAULT = 2000

    let timeout = GM_getValue(GM_TIMEOUT, TIMEOUTDEFAULT);
    /** Меню */
    GM_registerMenuCommand('Очистити', ()=>{clearGMParam()})
    //GM_registerMenuCommand('Очистити адресу', ()=>{clearGMParam(GM_USERMAIL)})
    //GM_registerMenuCommand('Очистити пароль', ()=>{clearGMParam(GM_USERPSW)})
    //GM_registerMenuCommand('Очистити метод', ()=>{clearGMParam(GM_METODNUM)})
    GM_registerMenuCommand('Час очікування, сек', setTimeWait)

    var submitButton
    var inputText

    //    window.onload = function() {
    // Ввід mail
    if (window.location.href.indexOf('https://login.microsoftonline.com/f115c9bc-a9df-48a9-ad8b-4efcb612b77b/') == 0) {
        console.log('Ввід mail')
        setTimeout(() => {
            submitButton = document.getElementById('idSIButton9')
            if (!submitButton) return
            let userMail = GM_getValue(GM_USERMAIL)
            inputText = document.getElementsByName('loginfmt')[0]
            if (userMail) {
                inputText.value = userMail;
                submitButton.focus();
                submitButton.click();
            }
            else {
                submitButton.addEventListener('click', (event) => {
                    GM_setValue(GM_USERMAIL, inputText.value);
                });
            }
        }, timeout);
    }
    //Підтвердження паролю, але не повернення (помилка паролю)
    else if (window.location.href.indexOf('https://fs.ukrtelecom.net/adfs/ls/?wfresh=0&wauth=') == 0) { // encodeURIComponent(
        console.log('Підтвердження паролю')
        setTimeout(() => {
            submitButton = document.getElementById('submitButton')
            if (!submitButton) return
            const psw = unEncrypt(GM_getValue(GM_USERPSW))
            inputText = document.getElementById('userNameInput')
            const passwordInput = document.getElementById('passwordInput')
            //Є пароль але це не помилка паролю
            if (psw && !document.getElementById('errorText').innerText) {
                passwordInput.value = psw
                submitButton.click()
            }else {
                submitButton.addEventListener('click', (event) => {
                    //Зберегти пароль
                    GM_setValue(GM_USERPSW, Encrypt(passwordInput.value))
                    //Зберегти Логін
                    GM_setValue('userMail', inputText.value)
                });
            }
        }, timeout);

    }
    // MS Вибір методу перевірки
    else if (window.location.href == 'https://login.microsoftonline.com/login.srf'){
        console.log('MS Вибір методу перевірки')
        setTimeout(() => {
            let BtmMetodNames = [...document.getElementById('idDiv_SAOTCS_Proofs').getElementsByClassName('table')]
            if (BtmMetodNames.length == 0) return
            // Отримати номер кнопки методу перевірки
            let MetodBtmNum = GM_getValue(GM_METODNUM, -1)
            //console.log('Кнопка #' + MetodBtmNum + ' ' + BtmMetodNames[MetodBtmNum])
            if (MetodBtmNum >= 0 && BtmMetodNames[MetodBtmNum]) {
                //BtmMetodNames[MetodBtmNum].focus()
                BtmMetodNames[MetodBtmNum].click() //.getElementsByTagName('div')[1].click();
            }else {
                //Отримати усі методи перевірки
                for (let i = 0; i < BtmMetodNames.length; i++) {
                    BtmMetodNames[i].dataset.metodnum = i
                    let divs = [...BtmMetodNames[i].getElementsByTagName('div')]
                    divs.forEach((item) => {item.dataset.metodnum = i})
                    BtmMetodNames[i].addEventListener('click', (event) => {
                        //Зберегти метод первірки
                        GM_setValue(GM_METODNUM, event.target.dataset.metodnum);
                    })
                }
            }
        }, timeout);
    }
    //Підтвердження "Не виходити"
    else if (window.location.href == 'https://login.microsoftonline.com/common/SAS/ProcessAuth') {
        console.log('Підтвердження "Не виходити"')
        setTimeout(() => {
            submitButton = document.getElementById('idSIButton9')
            if (!submitButton) return
            submitButton.click();
        }, timeout);
    }
    // Запуск VPN, але не повернення
    else if (window.location.href.indexOf('https://ra.ukrtelecom.net/vdesk/webtop.eui?webtop=/Common/') == 0) {
        console.log('Запуск VPN')
        setTimeout(() => {
            submitButton = document.getElementById('network_access:/Common/Final-kv-sso-KV-USERS-VPN-PROFILE-01')
            if (!submitButton) return
            submitButton.click();
        }, timeout);
    }
    //  }

    function clearGMParam(paramName = null) {
        if (paramName) {
            GM_setValue(paramName, undefined)
        }else {
            timeout = TIMEOUTDEFAULT;
            [GM_USERMAIL, GM_USERPSW, GM_METODNUM, GM_TIMEOUT].forEach((param) => GM_deleteValue(param))
        }
        Swal.fire('Очищено')
    }

    function setTimeWait(){
        let divel = document.createElement("div")
        let selectList = document.createElement("select")
        selectList.id = "timeoutSelect";
        //Create and append the options

        let option
        let tm = [1, 1.5, 2, 3, 5, 7]
        tm.forEach((t)=>{
            option = document.createElement("option")
            option.value = t; option.text = t
            if (t == timeout/1000) option.selected = true
            selectList.appendChild(option)
        })
        //}
        divel.appendChild(selectList)
        divel.appendChild(document.createTextNode(" сек."))

        Swal.fire({
            title: 'Виберіть час очікування',
            showCloseButton: true,
            showCancelButton: true,
            html: divel
        }).then((result) => {
            if (result.isConfirmed) {
                timeout = selectList.value * 1000
                GM_setValue(GM_TIMEOUT, timeout)
            }
        })
    }

    function Encrypt(theText) {
        if(!theText) return undefined;
        let output = new String;
        let Temp = new Array();
        let Temp2 = new Array();
        let TextSize = theText.length;
        for (let i = 0; i < TextSize; i++) {
            let rnd = Math.round(Math.random() * 122) + 68;
            Temp[i] = theText.charCodeAt(i) + rnd;
            Temp2[i] = rnd;
        }
        for (let i = 0; i < TextSize; i++) {
            output += String.fromCharCode(Temp[i], Temp2[i]);
        }
        return output;
    }
    function unEncrypt(theText) {
        if(!theText) return undefined;
        let output = new String;
        let Temp = new Array();
        let Temp2 = new Array();
        let TextSize = theText.length;
        for (let i = 0; i < TextSize; i++) {
            Temp[i] = theText.charCodeAt(i);
            Temp2[i] = theText.charCodeAt(i + 1);
        }
        for (let i = 0; i < TextSize; i = i+2) {
            output += String.fromCharCode(Temp[i] - Temp2[i]);
        }
        return output;
    }
})();