// ==UserScript==
// @name         GetINNinUR
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Уведомления для чата (откр окна, звук, нотиф)
// @author       iku
// @include      https://help.ticketplan.info/*
// @include      https://help.ticketplan.info/paytravel/agent/reports
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408344/GetINNinUR.user.js
// @updateURL https://update.greasyfork.org/scripts/408344/GetINNinUR.meta.js
// ==/UserScript==

//if (window.location.toString().includes("reports")) {

let cStat = true
let wo = ''
let wo1 = localStorage.getItem('log_in_inbox')
let wok
let objhref// = localStorage.getItem('log_in_panel')
let Oldobjhref = localStorage.getItem('log_in_inbox')

let a = new Date
let h = a.getHours()
let cc = a.getMinutes()
let ccc = a.getSeconds()
let time = h+':'+cc+':'+ccc
console.log(time)
let c = a.getMonth()+1
let b = 11
let d = c !== b

//setInterval(f, 1000)

    //OpenWindow()
    function OpenWindow() {
        //console.log('OpenWindow', wo.window)
        //if (d) {console.log(); return}
        let wo2
        try {
            wo2 = wo.window.location.pathname}
        catch {
            wo2 = undefined
    }
            if (window.opener == null && wo2 == undefined) {
                let upd = document.querySelector(".badge").textContent

                if (upd >= 1) { // иногда возвращает пустое значение "" или null
                    console.log("upd", upd, window.opener == null && wok == undefined)

                    if (document.querySelector('.not-read') == null) {
                        let uv = document.querySelector('#agents-navigation > div > div.navigation-popup.reports-popup.static-popup > div.navigation-header > div.navigation-top-actions.textRight > span > i') // откр панель нотификаций
                        uv.click()
                    }

                    //нечитанный чат
                    let inhref = document.querySelector('.not-read')
                    document.querySelector('#notifications-popup > div.navigation-top > div.navigation-top-actions > div > ul > li:nth-child(1) > span').click()

                    setTimeout(checksnewmsg, 0)
                    function checksnewmsg() {
                        console.log('checksnewmsg')
                        //если есть селектор первого непрочитанного сообщения
                        //if (inhref !== null) {
                        console.log('inhref !== null', time)
                        //let audio = new Audio('https://rinton.ru/uploads/audio/2019-01/40560/rington.mp3');
                        //audio.play()
                        if (document.querySelector('.not-read') !==null) {
                            console.log('objhref!==null')
                            objhref = document.querySelector('.not-read').dataset.object_url
                        }
                        //objhref = inhref.href
                        let proch = document.querySelector('#notifications-popup > div.navigation-top > div.navigation-top-actions > div > ul > li:nth-child(1) > span').click() // Все сообщения теперь прочитаны
                        if (objhref == undefined) {
                            console.log('objhref==undefined')
                            objhref = document.querySelector('.not-read').href
                            CheckAndOpenWindow()
                        }
                        else {CheckAndOpenWindow()}
                        //CheckAndOpenWindow()

                        function CheckAndOpenWindow() {
                            if (localStorage.getItem('ShowSverkaInLog') == 1) {
                                let audio = new Audio('https://rinton.ru/uploads/audio/2019-01/40560/rington.mp3')
                                audio.play()
                            }

                            wo = window.open(objhref,"_blank","width=1250,height=750")
                            console.log('OPEN WINDOW','wo1',wo1,'!==', objhref)
                            /*
                            console.log('CheckAndOpenWindow',time)
                            console.log('Oldobjhref',Oldobjhref,' !==', 'objhref',objhref)
                            console.log(inhref)
                            if (objhref !== Oldobjhref && wo1 !== objhref) {
                                wo = window.open(objhref,"_blank","width=1250,height=750")
                                //wo = window.open(objhref,"_blank","width=1250,height=750")
                                wok = wo.window.location.pathname
                                console.log('OPEN WINDOW','wo1',wo1,'!==', objhref)

                                logstart()
                                function logstart (key, value) {
                                    key = 'log_in_panel'
                                    value = objhref
                                    localStorage.setItem(key, value)
                                    objhref = localStorage.getItem('log_in_panel')
                                }

                                console.log(wok,wo.window)
                                Oldobjhref = objhref
                                setTimeout(checkWo1, 3500)
                                function checkWo1() {
                                    wo1 = wo.window.location.href
                                    proch

                                    logend()
                                    function logend(keye, valuee) {
                                        keye = 'log_in_inbox'
                                        valuee = wo.window.location.href
                                        localStorage.setItem(keye, valuee)
                                        wo1 = localStorage.getItem('log_in_inbox')
                                        console.log('wo1',wo1)
                                    }
                                    //console.log('OPEN WINDOW','wo1',wo1)
                                }
                                c = false
                            }
                            else {
                                console.log('NOT OPEN')
                                if (wo1 !== objhref) {
                                    c = true
                                    //console.log('cif','wo1',wo1,'objhref',objhref)
                                }

                            }
                        */
                        }
                        //}
                    }
                }
                setTimeout(ret, 600)
                function ret() {
                    console.log('ret')
                    return OpenWindow()
                }
            }
        else {
            setTimeout(ret, 600)
            function ret() {
                console.log('ret2')
                return OpenWindow()
            }
        }
    }
    //}


//setTimeout(ShowInn, 500)
function ShowInn() {
    //if (d) {console.log(); return}

    // ОТОБРАЖАЕТ ИНН
    if (window.location.toString().includes("chat")) {
        let baa = document.querySelector('#main')
        baa.addEventListener('click', checkhref)
        checkhref()
        function checkhref() {
            if (document.querySelector('#textArea') == null) {
                //baa.removeEventListener('click', checkhref)
                console.log('checkhref')
                getinn()
            }
        }
        //setTimeout(getinn, 4000)
        async function getinn() {
            console.log('getinn')
            let TSPchatNUM = document.querySelector('div#main span.navigation-user-name.title-small > a').href.split("/").pop()
            console.log('go'+TSPchatNUM)
            let a = await fetch(`https://help.ticketplan.info/agent/profile/${TSPchatNUM}?useMainWrapper=1`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-agent-request": "true",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": `https://help.ticketplan.info/agent/profile/${TSPchatNUM}`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });

            let b = await a.json()
            let firstindex = b.response.output.indexOf('property_28')
            let lastindex = firstindex+150
            let newarr = b.response.output.slice(firstindex,lastindex)
            let lastarr = newarr.lastIndexOf('data-default="')
            let nfi = lastarr+14
            let nli = nfi+12
            let la = newarr.slice(nfi,nli)
            la = la.replace(/[^+\d]/g, '')
            console.log(lastarr,la)

            let k = document.querySelector('#main > div.all.allAgent.allAgentChat.useAttachments > div > div.allAgentContent > div.mainArea > div.title-object-full > div.agent-object-title > div')
            k.insertAdjacentHTML('beforeend',`<text id="textArea" style="margin: 0px; height: 100px; width: 257px; color: blue; readonly">${la}</text>`);

        }
    }
}

/*
    var zNode = document.createElement ('form')
    zNode.innerHTML = '<input type="text" id="formtoinn" placeholder="ИНН/НПС/кодТСП/касса/email/tranzaction/заявка"/>'
    zNode.setAttribute ('id','allforms')
    zNode.style.cssText=`top: 100%; cursor: pointer; position: fixed; top: 30px; left: 0; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px 0px;`
    document.body.appendChild (zNode);
*/
let CheckBoxSverka = document.createElement ('div');
CheckBoxSverka.setAttribute('id','mainjs')
CheckBoxSverka.innerHTML = '<input type="checkbox" id=idCheckBoxSverka ><label>♪♪  Вкл/Выкл звук</label>'
CheckBoxSverka.style.cssText=`top: 100%; cursor: pointer; position: fixed; top: 0px; left: 55%; font-size: 14.8px; opacity: 0.9; z-index: 1100; padding: 0px 0px; color: #6f7379`
document.body.appendChild (CheckBoxSverka);
let CBS = document.querySelector('#idCheckBoxSverka')
CBS.addEventListener('click', CheckCheckBox)

function CheckCheckBox() {
    if (CBS.checked) {
        console.log('Выбран');
        localStorage.setItem('ShowSverkaInLog', 1)
        if (window.opener == null) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Уведомления активированы'))
        }
    }
    else {
        console.log ('Не выбран');
        localStorage.setItem('ShowSverkaInLog', 0)
        if (window.opener == null) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Уведомления деактивированы'))
             }
    }
}

if (localStorage.getItem('ShowSverkaInLog') == 1) {
    CBS.checked = true
    CheckCheckBox()
}
else {
    CheckCheckBox()
}

let CheckBoxSverka1 = document.createElement ('div');
    CheckBoxSverka1.innerHTML = '<input type="checkbox" id=idCheckBoxSverka1 ><label>回 Вкл/Выкл окна</label>'
    document.querySelector('#mainjs').appendChild (CheckBoxSverka1);
    let CBS1 = document.querySelector('#idCheckBoxSverka1')
    CBS1.addEventListener('click', CheckCheckBox1)

/*
let CheckBoxSverka2 = document.createElement ('div');
    CheckBoxSverka2.innerHTML = '<text id=idCheckBoxSverka2 ><label>Показывает ИНН по умолчанию</label>'
    document.querySelector('#mainjs').appendChild (CheckBoxSverka2);
*/


function CheckCheckBox1() {
    //if (d) {console.log(); return}
    if (CBS1.checked) {
        console.log('Выбран');
        localStorage.setItem('Okna', 1)
        if (window.opener == null) {
            OpenWindow()
        //window.speechSynthesis.speak(new SpeechSynthesisUtterance('Окна активированы'))
        }
    }
    else {
        console.log ('Не выбран');
        localStorage.setItem('Okna', 0)
        window.location.reload()
        if (window.opener == null) {
        //window.speechSynthesis.speak(new SpeechSynthesisUtterance('Уведомления деактивированы'))
             }
    }
}

if (localStorage.getItem('Okna') == 1) {
    console.log ('(Okna) == 1)');
    CBS1.checked = true
    CheckCheckBox1()
    ShowInn()
    //OpenWindow()
}
else {
    ShowInn()
    //OpenWindow()
}