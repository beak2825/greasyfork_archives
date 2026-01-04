// ==UserScript==
// @name         for figma client journey
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Считает и записывает клики, секунды, записывает данные по: кейсу, фио и отделению. Старт кликов и секунд начинается с нажатия на поле макета,сохранение в хранилище после нажатия на кнопку Обнулить. Выгрузка из хранилища на кнопку Сохранить.
// @author       You
// @match        https://www.figma.com/proto/*
// @icon         https://www.google.com/s2/favicons?domain=figma.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433247/for%20figma%20client%20journey.user.js
// @updateURL https://update.greasyfork.org/scripts/433247/for%20figma%20client%20journey.meta.js
// ==/UserScript==


//zNode.style.cssText = `cursor: pointer; position: fixed; top: 120px; left: 0px; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px; display: grid; grid-template-columns: 1fr;`

page_start()
let stop_second = 1
let second_interval
let click_count = 0
let inc = 0
//проверяю загружена ли страница
function page_start() {
    if (document.querySelector('#react-page > div > div > div.progress_bar--outer--3EVoD > div.progress_bar--centerContainer--1Ed_5') == null) {
        start_opros()
    }
    else {
        setTimeout(page_start,1000)
    }
}

function start_opros() {

    let personalyty = document.createElement('div')
    personalyty.innerHTML =  `                                                          \
    <div id="personalyty">                                               \
    <form> \
        <div id="msg"></div> \
        <input type="text" placeholder="Номер кейса" id="Case" value="">   \
        <input type="text" placeholder="Отделение" id="otdelenye" value="">   \
        <input type="text" placeholder="ФИО" id="fio" value="">   \
        <button id="btn_dowload_log" type="button">Скачать</button>   \
        <text id="click_count" type="text" style="color: white;background: black;">${click_count}</text>   \
        <button id="btn_counter" type="button">Обнулить</button>   \
    </form>                                                                   \
    </div>                                                                    \
`;
    personalyty.style.cssText = `cursor: pointer;position: fixed;top: 1px;left: 300px;font-size: 12.8px;border: 1.5px outset black;opacity: 0.3;z-index: 1100;padding: 0px;display: grid;grid-template-columns: 1fr;`
    document.body.appendChild (personalyty)

    document.querySelector('#viewerContainer > div > div > canvas').style.cursor = 'default'
    document.querySelector('#viewerContainer > div > div > canvas').addEventListener ("click", counter);

    document.querySelector('#personalyty').addEventListener('mouseover',a)

    function a() {
        document.querySelector('#viewerContainer > div > div > canvas').style.opacity = 0.001
    }

    document.querySelector('#personalyty').addEventListener('mouseout',as)

    function as() {
        document.querySelector('#viewerContainer > div > div > canvas').style.opacity = 1
    }


    /*
    document.querySelector('#personalyty').addEventListener('click',f)
    function f() {
        //document.querySelector('#viewerContainer > div > div > canvas').style.opacity = 0.001
    }
    document.querySelector('#react-page > div > div > div.prototype--documentationContainer--JPUjj > div') .firstElementChild.addEventListener('click', fa)

    function fa() {
        //document.querySelector('#viewerContainer > div > div > canvas').style.opacity = 1
    }
    */


    function counter() {
        click_count++
        document.querySelector('#click_count').textContent = click_count
        if (click_count == 1) {
            secfunc()
        }

    }

    function secfunc() {
        if (stop_second == 0) {
            console.log('stop1')
            clearInterval(second_interval)
            return
        }
        second_interval = setInterval(secundomer, 1000)

        function secundomer() {
            second++
        }
    }

    document.querySelector('#btn_counter').addEventListener ("click", btn_counter_to_null);

    function btn_counter_to_null() {
        stop_second = 0
        secfunc()
        inc++
        writelog()
    }

    let second = 0

    function writelog() {
        let otdelenye = document.querySelector('#otdelenye').value
        let fio = document.querySelector('#fio').value
        let Case = document.querySelector('#Case').value
        let date = new Date
        let date_date = date.toLocaleDateString()
        let time = date.toTimeString().slice(0, 5)
        let new_log = 'Дата: ' + date_date + ' Время: ' + time +' Отделение: ' +otdelenye + ' Респондент: ' + fio + ' Кейс №: '+ Case + ' Кликов: ' + click_count + ' Секунд: ' + second + ' Инкремент: ' + inc+ '\n'
        let old_log = localStorage.getItem('opros')
        if (localStorage.getItem('opros') !== null) {
            localStorage.setItem('opros', old_log+new_log)
        }
        else {
            localStorage.setItem('opros', new_log)
        }

        console.log(old_log+new_log)

        click_count = 0
        //click_count++
        document.querySelector('#click_count').textContent = 0
        second = 0
        stop_second = 1


        document.querySelector('#btn_dowload_log').addEventListener ("click", download_log)
        function download_log() {
            let data = localStorage.getItem('opros')
            let filename = 'figma_kiv'

            download(data,filename)
            function download(data, filename, type) {
                var file = new Blob([data], {type: type});
                if (window.navigator.msSaveOrOpenBlob) // IE10+
                    window.navigator.msSaveOrOpenBlob(file, filename);
                else { // Others
                    var a = document.createElement("a"),
                        url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            }
        }

    }

}

