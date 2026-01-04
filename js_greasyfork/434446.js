// ==UserScript==
// @name         Озвучка новых сообщений в тг
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Озвучивает входящие сообщения в телеграме
// @author       ikupt
// @match        https://web.telegram.org/z/
// @icon         https://www.google.com/s2/favicons?domain=telegram.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434446/%D0%9E%D0%B7%D0%B2%D1%83%D1%87%D0%BA%D0%B0%20%D0%BD%D0%BE%D0%B2%D1%8B%D1%85%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%B2%20%D1%82%D0%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/434446/%D0%9E%D0%B7%D0%B2%D1%83%D1%87%D0%BA%D0%B0%20%D0%BD%D0%BE%D0%B2%D1%8B%D1%85%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%B2%20%D1%82%D0%B3.meta.js
// ==/UserScript==

setInterval(check_while,10000)


function check_while() {
    let data_get_msg = ''
    let old_get_msg = sessionStorage.getItem('undread_msg')
    let count_block_msg = document.querySelector('#LeftColumn-main > div.Transition.zoom-fade > div > div > div.Transition.slide > div.active > div > div').children.length
    //
    console.log('awd1')
    for (let i=0;i<count_block_msg;i++) {
        //console.log(i)
        let unread = document.querySelector(`#LeftColumn-main > div.Transition.zoom-fade > div > div > div.Transition.slide > div.active > div > div > div:nth-child(${i}) > div > div.info > div.subtitle > div > div`)
        if (unread !== null) {
            console.log('awd1')
            if (unread.className == 'Badge pinned unread' ||unread.className == 'Badge unread') {
                let msg = document.querySelector(`#LeftColumn-main > div.Transition.zoom-fade > div > div > div.Transition.slide > div.active > div > div > div:nth-child(${i}) > div > div.info > div.subtitle > p`).textContent
                let author = document.querySelector(`#LeftColumn-main > div.Transition.zoom-fade > div > div > div.Transition.slide > div.active > div > div > div:nth-child(${i}) > div > div.info > div.title`).textContent
                data_get_msg = data_get_msg + data_get_msg + msg + author
                console.log(data_get_msg+'awd1-1')
            }
        }
    }
    sessionStorage.setItem('undread_msg',data_get_msg)


    console.log(data_get_msg+' !== ' +old_get_msg)
    if (data_get_msg !== old_get_msg) {
        console.log('awd2')
        for (let i=0;i<count_block_msg;i++) {

            let unread = document.querySelector(`#LeftColumn-main > div.Transition.zoom-fade > div > div > div.Transition.slide > div.active > div > div > div:nth-child(${i}) > div > div.info > div.subtitle > div > div`)
            if (unread !== null) {
                if (unread.className == 'Badge pinned unread' ||unread.className == 'Badge unread') {
                    console.log('awd3')
                    let msg = document.querySelector(`#LeftColumn-main > div.Transition.zoom-fade > div > div > div.Transition.slide > div.active > div > div > div:nth-child(${i}) > div > div.info > div.subtitle > p`).textContent
                    let author = document.querySelector(`#LeftColumn-main > div.Transition.zoom-fade > div > div > div.Transition.slide > div.active > div > div > div:nth-child(${i}) > div > div.info > div.title`).textContent
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance('Пришло новое сообщение'+author+msg))
                    //sessionStorage.setItem('undread_msg','')
                }
            }
        }
    }
}