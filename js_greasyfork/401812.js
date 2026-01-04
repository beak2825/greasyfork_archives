// ==UserScript==
// @name         Tranzaxis E-POS
// @namespace    http://tampermonkey.net/
// @version      1.93
// @description  автоматизация+парсинг
// @author       iku
// @match        https://tranzaxis.main.local/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401812/Tranzaxis%20E-POS.user.js
// @updateURL https://update.greasyfork.org/scripts/401812/Tranzaxis%20E-POS.meta.js
// ==/UserScript==

//var switcher = 0

getrnn()
function getrnn() {
    // if (window.location.toString().includes("tranzaxis.main.local/tx/rwtext/file")) {
    console.log('rrwin')
    if (document.querySelector('div#content table:nth-child(5) > tbody > tr:nth-child(5) > td:nth-child(2)') !== null) {
        let rrninwin = document.querySelector('div#content table:nth-child(5) > tbody > tr:nth-child(5) > td:nth-child(2)').textContent
        localStorage.setItem('rrninwin', rrninwin)
        navigator.clipboard.writeText(rrninwin)
            .then(() => {
        })
            .catch(err => {
            console.log('Something went wrong', err);
        });
        let rnnsearch = localStorage.getItem('rrninwin')
        setTimeout(wc, 100); function wc() {window.close()}
    }

}
//}

//---1step

let stp = setTimeout(step1, 1500); //12000 3000
function step1()
{

    let pa = sessionStorage.getItem('ps')
    document.querySelector('tr:nth-child(2) > td:nth-child(1) > div > label').addEventListener('click', savechanges)
    function savechanges(){
        let p = document.querySelector('div > input:nth-child(2)')
        let np = document.querySelector('tr:nth-child(2) > td:nth-child(2) > div > div > table > tbody > tr > td > div > div > input:nth-child(1)')
        if (pa.length > 0)
        {console.log('paste',pa); pa = pa.slice(7,18); let a = document.querySelector('tr:nth-child(2) > td:nth-child(2) > div > div > table > tbody > tr > td > div > div > input:nth-child(1)'); a.value = pa; a.change()}
        if (p !== null)
        {console.log('grab'); let b ='%%7562фывА';let c = 'пцЫаерЫ'; let a = c+p+b; console.log('grab',c,'PPPPPPPPPP',p,b,a); sessionStorage.setItem('ps', a.value) }
    }

    let a = new Date
    let c = a.getMonth()+1
    let b = 11
    let d = true // c !== b

    let tranzakciiniz_ok = setInterval(tranzaciniz_ok, 700); function tranzaciniz_ok() {
        if (document.querySelector("div:nth-child(2) > div > label:nth-child(4)") !==null) {
            console.log('tranzaciniz_ok')
            w1ButtonClickAction()
            clearInterval(tranzakciiniz_ok)
        }}

    let tranzakciii = document.querySelector("tr.rwt-ui-element.rwt-ui-tree-node.rwt-ui-choosable-pointed.rwt-ui-tree-radix-group > td > table > tbody > tr > td:nth-child(2) > div") //транзакции слева
    let tranz = setInterval(tranzaci, 2000); function tranzaci() {
        if
            (document.querySelector("tr.rwt-ui-element.rwt-ui-tree-node.rwt-ui-choosable-pointed.rwt-ui-tree-radix-group > td > table > tbody > tr > td:nth-child(2) > div") !== null)
        {tranzakciii.click(); setTimeout(stp02, 15000); function stp02() {clearInterval(tranz)}}}
    //if (d) {console.log(); return}
    let wzNode = document.createElement ('div');
    wzNode.innerHTML = '<button id="wtm1_SearchBttn" type="button">Настроить фильтр</button>';
    wzNode.setAttribute ('id', 'wtm1_btnContainer');
    document.body.appendChild (wzNode);

    let ab = wzNode.insertAdjacentHTML('beforeend','<button id="wtm2_SearchBttn" type="button"> Собрать данные </button>');
    let vb = wzNode.insertAdjacentHTML('beforeend','<button id="wtm3_SearchBttn" type="button"> Открыть сверку </button>');
    let vbb = wzNode.insertAdjacentHTML('beforeend','<button id="wtm4_SearchBttn" type="button"> Открыть кассовые операции </button>');

    let w1 = document.getElementById ("wtm1_SearchBttn");
    w1.addEventListener ("click", w1ButtonClickAction);
    let w2 = document.getElementById ("wtm2_SearchBttn");
    w2.addEventListener ("click", w2ButtonClickAction);
    let w3 = document.getElementById ("wtm3_SearchBttn");
    w3.addEventListener ("click", w3ButtonClickAction);
    let w4 = document.getElementById ("wtm4_SearchBttn");
    w4.addEventListener ("click", w4ButtonClickAction)

    function w1ButtonClickAction (zwEvent) {
        if (document.querySelector('td:nth-child(2) > div > table > tbody > tr > td.rwt-ui-element.ui-corner-right.last > div > img') !== null)
        {
            //window.speechSynthesis.speak(new SpeechSynthesisUtterance('Выбираю епос, добавляю дату'))
            let filteropen = document.querySelector('td:nth-child(2) > div > table > tbody > tr > td.rwt-ui-element.ui-corner-right.last > div > img').click() // открыть фильтр
            //let filopn = setInterval(filo, 2000);
            let filopn = setTimeout(filo, 650);
            function filo()
            {
                console.log('filopn')
                let i = document.querySelector("div.rwt-ui-element.rwt-list-box.rwt-drop-down > ul").childNodes.length
                let ia = i
                for (i=i-1;i<ia && i>=0;i--) {
                    let a = document.querySelector("div.rwt-ui-element.rwt-list-box.rwt-drop-down > ul").childNodes[i].outerText
                    //console.log(i,a)
                    if (a == "Transaction Filter for E-POS" || a == " Transaction Filter for E-POS") {
                        let a = (i+1)/2
                        console.log('true',i,a)
                        let eposf = document.querySelector(`li:nth-child(${a}) > div`)
                        eposf.click()
                        clearInterval(filopn)
                        break
                    }
                }
                /* OLD CODE CHOOSE tranzaction
let filterepos = document.querySelector('li:nth-child(16) > div').click() // выбрать транзакции для епос
clearInterval(filopn)
*/
            }
            let filop1n = setInterval(filo1, 1200);
            function filo1()
            {
                let filterstartdate = document.querySelector('td > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > table > tbody > tr > td:nth-child(2) > div > img').click() //start date today
                let filterenddate = document.querySelector('tr:nth-child(1) > td:nth-child(4) > div > div > table > tbody > tr > td:nth-child(2) > div > img').click() //end date today
                clearInterval(filop1n)
            }
            //----Контейнер---
            //document.querySelector("td:nth-child(3) > div > label").oncontextmenu - чтобы открыть контейнер ркм
            let whaittabopen = setInterval(tabopn, 1000);
            function tabopn()
            {
                let tabopen = document.querySelector("div.rwt-ui-element.rwt-ui-shadow.rwt-dialog.ui-corner-all.ui-draggable") //- контейнер фильтра открыт
                if (tabopen !== null)
                {
                    console.log('tab')
                    let tabtid = document.querySelector('tr:nth-child(22) > td:nth-child(2) > table > tr > td:nth-child(1) > input[type="checkbox"]')
                    let tabcode = document.querySelector('tr:nth-child(17) > td:nth-child(2) > table > tr > td:nth-child(1) > input[type="checkbox"]')
                    let tabsum = document.querySelector('tr:nth-child(18) > td:nth-child(2) > table > tr > td:nth-child(1) > input[type="checkbox"]')
                    let tabcurr = document.querySelector('tr:nth-child(19) > td:nth-child(2) > table > tr > td:nth-child(1) > input[type="checkbox"]')
                    let tabpan = document.querySelector('tr:nth-child(20) > td:nth-child(2) > table > tr > td:nth-child(1) > input[type="checkbox"]')
                    let tabok = document.querySelector("div.rwt-ui-element.ui-corner-bottom > button:nth-child(2)")

                    if (tabtid.checked == false) {tabtid.click(); console.log('tabtid')}
                    if (tabcode.checked == false) {tabcode.click()}
                    if (tabcurr.checked == false) {tabcurr.click()}
                    if (tabpan.checked == false) {tabpan.click()}
                    if (tabsum.checked == false) {tabsum.click()}
                    tabok.click()

                    //clearInterval(whaittabopen)
                }
            }
        }
        else
        {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('Здесь я не работаю'))
        }
    }
}
//#wtm1_SearchBttn { cursor: pointer; left: 0px; top: 0px}

// #tmw1_SearchBttn { cursor: pointer; left: 77px; top: 22px;}

/*

*/
//----Второй шаг

//Добавляю функцию к активатору
function w2ButtonClickAction (zEvent)
{
    if (document.querySelector('tr:nth-child(2) > td:nth-child(13) > div > div > label') !== null)
    {
        //строки содержание
        let time = document.querySelector('tr:nth-child(2) > td:nth-child(8) > div > div > label').outerText
        let code = document.querySelector('tr:nth-child(2) > td:nth-child(10) > div > div > label').outerText
        let sums = document.querySelector('tr:nth-child(2) > td:nth-child(11) > div > div > label').outerText.replace(/,/g, ".")
        let sum = sums.replace(/\s/g, '')
        let currency = document.querySelector('tr:nth-child(2) > td:nth-child(12) > div > div > label').outerText
        if (currency == '643) Russian rouble') {currency = 'RUB'}
        let pan = document.querySelector('tr:nth-child(2) > td:nth-child(13) > div > div > label').outerText
        let tid = document.querySelector('tr:nth-child(2) > td:nth-child(14) > div > div > label').outerText
        let rnnsearch = document.querySelector('tr:nth-child(5) > td:nth-child(2) > div > div > table > tbody > tr > td.rwt-ui-element.ui-corner-left > div > div > input').value

        let revers = document.querySelector("tr:nth-child(2) > td:nth-child(5) > div > div > label").outerText
        let pokupka = document.querySelector("tr:nth-child(2) > td:nth-child(3) > div > div").outerText


        // ВЗЯТЬ РРН ИЗ ДОМА
        console.log('check rrn')
        if (rnnsearch == "<не задано>") {
            console.log('Беру из дома')
            let secstr = document.querySelector('tr:nth-child(2) > td:nth-child(2) > div > div > label').click()
            setTimeout(opndom, 3500); function opndom() { document.querySelector('div:nth-child(2) > table > tbody > tr > td:nth-child(3) > div > img').click()}
            let getrrnt = setTimeout(getrnn, 7000);
            let step1t = setTimeout(step1, 7600);

        }
        else {step1()}
        // Взять ррн из дома вверху скрипт
        function step1()
        {
            if (localStorage.getItem('rrninwin') !== null) {
                rnnsearch = localStorage.getItem('rrninwin')
                localStorage.removeItem('rrninwin')
            }

            console.log(rnnsearch)
            //копирую данные
            let tim = time
            let c = code
            let s = sum
            let p = pan
            let t = tid
            let r = rnnsearch
            let cu = currency

            let bezopastnost = t.search(/000/)
            if (bezopastnost === 0)
            {
                console.log('OK')
            }
            else
            {
                alert('Внимание! Ошибка парсинга. Нужные поля не найдены или указаны некорректно.'+t); return false
            }
            if (revers == "✔") {revers = "Reversal" ; console.log('скопирован Reversal')}


            let bez2 = /[0-9]/.test(r); //если содержит цифры: '123wadg'=true
            let bez3 = r.length
            if (bez2 && bez3 == 12) {console.log('цифры в р ок')}
            else {alert('Внимание! Ошибка парсинга. Скорее всего rrn не был скопирован или длина его содержания не равна длине ррн'+r); return false}

            let all = [tim+'/-/'+c+'/-/'+s+'/-/'+p+'/-/'+t+'/-/'+r+'/-/'+revers+'/-/'+pokupka+'/-/'+cu]
            console.log(all)

            navigator.clipboard.writeText(all)
                .then(() => {
            })
                .catch(err => {
                console.log('Something went wrong', err);
            });
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('Данные собраны.'))
            //if (pokupka !== "Покупка") {alert('Будь внимателен! Это не покупка, а '+pokupka)}
            //if (document.querySelector("tr:nth-child(3) > td:nth-child(3) > div > div") !==null) {alert('Обнаружено больше двух строк. Важное правило: Данные копируются только со второй верхней строки!')}
            //if (revers == "✔") {alert('Будь внимателен! Это Reversal')}
            //setTimeout(h1, 500); function h1() {window.open('https://adm.appex.ru/tranzaxis/matching/list')}
        }}
    else
    {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Здесь нет данных'))
    }
}

//----Третий шаг

function w3ButtonClickAction (zEvent3)
{
    if (document.querySelector('tr:nth-child(2) > td:nth-child(13) > div > div > label') !== null)
    {
        //строки содержание
        let time = document.querySelector('tr:nth-child(2) > td:nth-child(8) > div > div > label').outerText
        let code = document.querySelector('tr:nth-child(2) > td:nth-child(10) > div > div > label').outerText
        let sums = document.querySelector('tr:nth-child(2) > td:nth-child(11) > div > div > label').outerText.replace(/,/g, ".")
        let sum = sums.replace(/\s/g, '')
        let currency = document.querySelector('tr:nth-child(2) > td:nth-child(12) > div > div > label').outerText
        if (currency == '643) Russian rouble') {currency = 'RUB'}
        let pan = document.querySelector('tr:nth-child(2) > td:nth-child(13) > div > div > label').outerText
        let tid = document.querySelector('tr:nth-child(2) > td:nth-child(14) > div > div > label').outerText
        let rnnsearch = document.querySelector('tr:nth-child(5) > td:nth-child(2) > div > div > table > tbody > tr > td.rwt-ui-element.ui-corner-left > div > div > input').value

        let revers = document.querySelector("tr:nth-child(2) > td:nth-child(5) > div > div > label").outerText
        let pokupka = document.querySelector("tr:nth-child(2) > td:nth-child(3) > div > div").outerText


        // ВЗЯТЬ РРН ИЗ ДОМА
        console.log('check rrn')
        if (rnnsearch == "<не задано>") {
            console.log('Беру из дома')
            let secstr = document.querySelector('tr:nth-child(2) > td:nth-child(2) > div > div > label').click()
            setTimeout(opndom, 3500); function opndom() { document.querySelector('div:nth-child(2) > table > tbody > tr > td:nth-child(3) > div > img').click()}
            let getrrnt = setTimeout(getrnn, 7000);
            let step1t = setTimeout(step1, 7600);

        }
        else {step1()}
        // Взять ррн из дома вверху скрипт
        function step1()
        {
            if (localStorage.getItem('rrninwin') !== null) {
                rnnsearch = localStorage.getItem('rrninwin')
                localStorage.removeItem('rrninwin')
            }

            console.log(rnnsearch)
            //копирую данные
            let tim = time
            let c = code
            let s = sum
            let p = pan
            let t = tid
            let r = rnnsearch
            let cu = currency

            let bezopastnost = t.search(/000/)
            if (bezopastnost === 0)
            {
                console.log('OK')
            }
            else
            {
                alert('Внимание! Ошибка парсинга. Нужные поля не найдены или указаны некорректно.'+t); return false
            }
            if (revers == "✔") {revers = "Reversal" ; console.log('скопирован Reversal')}


            let bez2 = /[0-9]/.test(r); //если содержит цифры: '123wadg'=true
            let bez3 = r.length
            if (bez2 && bez3 == 12) {console.log('цифры в р ок')}
            else {alert('Внимание! Ошибка парсинга. Скорее всего rrn не был скопирован или его длина не равна длине ррн'+r); return false}

            let all = [tim+'/-/'+c+'/-/'+s+'/-/'+p+'/-/'+t+'/-/'+r+'/-/'+revers+'/-/'+pokupka+'/-/'+currency]
            console.log(all)

            navigator.clipboard.writeText(all)
                .then(() => {
            })
            //window.speechSynthesis.speak(new SpeechSynthesisUtterance('Данные собраны.'))
            setTimeout(h1, 100); function h1() {window.open('https://adm.appex.ru/tranzaxis/matching/list')}
        }}
    else
    {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Здесь нет данных'))
    }
}


function w4ButtonClickAction (zEvent3)
{
    if (document.querySelector('tr:nth-child(2) > td:nth-child(13) > div > div > label') !== null)
    {
        //строки содержание
        let time = document.querySelector('tr:nth-child(2) > td:nth-child(8) > div > div > label').outerText
        let code = document.querySelector('tr:nth-child(2) > td:nth-child(10) > div > div > label').outerText
        let sums = document.querySelector('tr:nth-child(2) > td:nth-child(11) > div > div > label').outerText.replace(/,/g, ".")
        let sum = sums.replace(/\s/g, '')
        let currency = document.querySelector('tr:nth-child(2) > td:nth-child(12) > div > div > label').outerText
        if (currency == '643) Russian rouble') {currency = 'RUB'}
        let pan = document.querySelector('tr:nth-child(2) > td:nth-child(13) > div > div > label').outerText
        let tid = document.querySelector('tr:nth-child(2) > td:nth-child(14) > div > div > label').outerText
        let rnnsearch = document.querySelector('tr:nth-child(5) > td:nth-child(2) > div > div > table > tbody > tr > td.rwt-ui-element.ui-corner-left > div > div > input').value

        let revers = document.querySelector("tr:nth-child(2) > td:nth-child(5) > div > div > label").outerText
        let pokupka = document.querySelector("tr:nth-child(2) > td:nth-child(3) > div > div").outerText


        // ВЗЯТЬ РРН ИЗ ДОМА
        console.log('check rrn')
        if (rnnsearch == "<не задано>") {
            console.log('Беру из дома')
            let secstr = document.querySelector('tr:nth-child(2) > td:nth-child(2) > div > div > label').click()
            setTimeout(opndom, 3500); function opndom() { document.querySelector('div:nth-child(2) > table > tbody > tr > td:nth-child(3) > div > img').click()}
            let getrrnt = setTimeout(getrnn, 7000);
            let step1t = setTimeout(step1, 7600);

        }
        else {step1()}
        // Взять ррн из дома вверху скрипт
        function step1()
        {
            if (localStorage.getItem('rrninwin') !== null) {
                rnnsearch = localStorage.getItem('rrninwin')
                localStorage.removeItem('rrninwin')
            }

            console.log(rnnsearch)
            //копирую данные
            let tim = time
            let c = code
            let s = sum
            let p = pan
            let t = tid
            let r = rnnsearch
            let cu = currency

            let bezopastnost = t.search(/000/)
            if (bezopastnost === 0)
            {
                console.log('OK')
            }
            else
            {
                alert('Внимание! Ошибка парсинга. Нужные поля не найдены или указаны некорректно.'+t); return false
            }
            if (revers == "✔") {revers = "Reversal" ; console.log('скопирован Reversal')}


            let bez2 = /[0-9]/.test(r); //если содержит цифры: '123wadg'=true
            let bez3 = r.length
            if (bez2 && bez3 == 12) {console.log('цифры в р ок')}
            else {alert('Внимание! Ошибка парсинга. Скорее всего rrn не был скопирован или его длина не равна длине ррн'+r); return false}

            let all = [tim+'/-/'+c+'/-/'+s+'/-/'+p+'/-/'+t+'/-/'+r+'/-/'+revers+'/-/'+pokupka+'/-/'+cu]
            console.log(all)

            navigator.clipboard.writeText(all)
                .then(() => {
            })
            //window.speechSynthesis.speak(new SpeechSynthesisUtterance('Данные собраны.'))
            setTimeout(h1, 100); function h1() {window.open('https://adm.appex.ru/fiscal/cashDeskOperations/list')}
        }}
    else
    {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Здесь нет данных'))
    }
}


GM_addStyle ( `
#wtm1_btnContainer {
position: fixed;
top: 0px;
left: 0px;
font-size: 5px;
border: 1px outset black;
opacity: 0.9;
z-index: 1100;
padding: 0px 0px;
}

` ); //вкл фильтр left: 15.5%;
//#tm3_SearchBttn { cursor: pointer; left: 18.4%;}
// Открыть кассовые операции left: 18.4%;
