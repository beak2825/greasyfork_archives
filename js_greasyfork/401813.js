// ==UserScript==
// @name         cashdeskoperationsOb
// @namespace    http://tampermonkey.net/
// @version      0.57
// @description  Обработчик, форма для вставки. Добавляет данные строки из таблицы транзаксиса в: 1. Все поля подтверждения кассовой операции 2. Поиск по ррн в сверке 3. Поиск по сумме в кассовых операциях
// @author       iku
// @match        https://adm.appex.ru/fiscal/cashdeskoperations/*
// @include      https://adm.appex.ru/fiscal/cashDeskOperations/list
// @include      https://adm.appex.ru/tranzaxis/matching/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401813/cashdeskoperationsOb.user.js
// @updateURL https://update.greasyfork.org/scripts/401813/cashdeskoperationsOb.meta.js
// ==/UserScript==

//увеличил -60 до -80 , добавил createdate и энддейт - проверка соотвествия времени на третьей странице только на второй функции. тест ок.
//Добавил codsverky на запись и получение из SessionStorage fetch запрос на обновления состояния сверки refreshstatussecondpage только на второй функции. тест ок.
//Добавил первичный функционал в кассовые операции AFTERTRAN1. тест ок.
//н Добавил автопоиск в кассовых операциях AFTERTRAN1. тест ок.
//н Добавил проверку тида при нажатии на кнопку Добавить из транзаксиса autochecktid. тест ок.
//н 27082020 Добавил window.location=a
//н 28082020 Добавил
// 0210 Добавить rub

//баг В ожидании в кассовых операциях, находит похожие за 3 мес раньше
fe()
function fe() {
    var $ = window.jQuery;
    let a = new Date
    let c = a.getMonth()+1
    let b = 11
    let d = c !== b
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button id="tm1_SearchBttn" type="button"> Добaвить из транзаксиса </button>';
    zNode.setAttribute ('id', 'tm1_btnContainer');
    zNode.style.cssText=`top: 100%; cursor: pointer; position: fixed; top: 0; left: 0; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px 0px;`
    document.body.appendChild (zNode);
    var srchBtn = document.getElementById ("tm1_SearchBttn");
    //if (d) {console.log(); return}
    let aws = srchBtn.addEventListener ("click", ButtonClickAction); //AFTERTRAN.thr_pg_aproove_tr
    function ButtonClickAction (zEvent)
    {
        console.log('ButtonClickAction')
        //если в кассовой операции
        if (window.location.toString().includes("fiscal/cashdeskoperations/") === true) //window.location.toString().includes("/inbox/7/-1/-1")
        {
            navigator.clipboard.readText().then(function(data) {
                var $ = window.jQuery;
                console.log("Your string: ", data);
                if(document.querySelector('#cashDeskOperation > div > div > div:nth-child(18) > div > div > button').textContent == "Подтвердить вручную") {document.querySelector('div#cashDeskOperation button').click()}
                let arrcreate = data.split('/-/')
                let arrtime = arrcreate[0] //время
                let arrcode = arrcreate[1] //code
                let arrsum = arrcreate[2] //сумма
                let arrpan = arrcreate[3] //пан
                let arrtid = arrcreate[4] //tid
                let arrrrn = arrcreate[5] //rrn
                let revers = arrcreate[6] //revers
                let vozvrt = arrcreate[7] //pokupkaORvozvrat
                let arrcurrency = arrcreate[8]

                let codsverky = sessionStorage.getItem('codsverky')

                let createdate = document.querySelector("div#entries td:nth-child(6)").outerText
                let enddate = document.querySelector("div#entries td:nth-child(7)").outerText
                if(arrtime > createdate && arrtime < enddate || enddate == "") {

                    console.log('time ok')
                    let tid = $('div#dataEntryApprove div:nth-child(1) > div:nth-child(1) > input').val(arrtid).change();
                    let pan = $('div#dataEntryApprove div:nth-child(2) > div:nth-child(1) > input').val(arrpan).change()
                    let code = $('div#dataEntryApprove div:nth-child(1) > div:nth-child(2) > input').val(arrcode).change()
                    let cardtype = $('div#dataEntryApprove div:nth-child(2) > div:nth-child(2) > input')
                    let visa = arrpan.search(/4/)
                    if (visa === 0) { cardtype.val('VISA').change() }
                    let mir = arrpan.search(/2/)
                    if (mir === 0) { cardtype.val('MIR').change() }
                    if (arrpan.search(/51/) === 0 || arrpan.search(/52/) === 0 || arrpan.search(/53/) === 0 || arrpan.search(/54/) === 0 || arrpan.search(/55/) === 0 ) //MC
                    { cardtype.val('MASTERCARD').change() }
                    console.log('visa'+visa)
                    console.log('mir'+mir)
                    let sum = $('input[name="amount"]').val(arrsum).change(); //.replace(/\s/g, '')
                    let time = $('div#dataEntryApprove div:nth-child(1) > div:nth-child(4) > input').val(arrtime).change();
                    let rrn = $('div#dataEntryApprove div:nth-child(2) > div:nth-child(4) > input').val(arrrrn).change();
                    let currency = $('div#dataEntryApprove select').val()

                    if (arrcurrency !== currency) {alert('Скорее всего валюта не рубли, укажи валюту вручную')
                                                  document.querySelector('div#dataEntryApprove select').setAttribute('style', 'background:red')
                                                  }

                    let bezopastnost = arrtid.search(/000/)
                    if (bezopastnost === 0) {}
                    else {alert('Внимание! Ошибка парсинга. Некорректный тид.'+arrtid)}

                    let bez2 = /^\d+$/.test(arrrrn); // /[0-9]/ содержит цифры: '123wadg<'=true ; /^\d+$/ только цифры
                    let bez3 = arrrrn.length
                    if (bez2 && bez3 == 12) {console.log('цифры в р ок')}
                    else {alert('Внимание! Ошибка парсинга. Некорректный формат ррн'+arrrrn)}

                    if (revers == "Reversal") {alert('Будь внимателен! Это Reversal'); return false}
                    if (vozvrt == "Возврат товара") {alert('Будь внимателен! Это Возврат товара'); return false}

                    if(cardtype.val() == '') {alert('Не указан тип карты, нужно указать')}
                    window.open("https://redmine.ticketplan.info/search?utf8=%E2%9C%93&scope=&q=%2B+"+arrtid+"")
                }
                else {alert('Эта транзакция не походит по времени')}

                document.querySelector('div#dataEntryApprove div:nth-child(3) > div > button').addEventListener ('click' , refreshstatussecondpage)
                function refreshstatussecondpage() {
                    setTimeout(ft, 900)
                    function ft() {
                        console.log('refreshstatussecondpage ok')
                        fetch(`https://adm.appex.ru/api/tranzaxis/matching/${codsverky}/match`, {
                            "headers": {
                                "accept": "application/json, text/javascript, */*; q=0.01",
                                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                                "content-type": "application/json; charset=UTF-8",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-requested-with": "XMLHttpRequest"
                            },
                            "referrer": `https://adm.appex.ru/tranzaxis/matching/${codsverky}`,
                            "referrerPolicy": "no-referrer-when-downgrade",
                            "body": null,
                            "method": "PUT",
                            "mode": "cors",
                            "credentials": "include"
                        });
                    }
                }
            });
        }


        //Если в кассовых операциях
        if (window.location.toString().includes("fiscal/cashDeskOperations/list") === true) //window.location.toString().includes("/inbox/7/-1/-1")
        {
            navigator.clipboard.readText().then(function(data) {
                console.log("Your string: ", data);
                let arrcreate = data.split('/-/')
                let arrsum = arrcreate[2] //сумма
                console.log(arrsum)


                //let sum1 = document.querySelector("input#payment").value = arrsum1.replace(/\s/g, '')
                //sum1.form.sumbit()
                // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js?rq=1
                //var ev2 = new Event('input', { bubbles: true});
                //ev2.simulated = true;
                //document.querySelector('input#payment').value = arrsum1//.replace(/\s/g, '')
                $('input#payment').val(arrsum).change()
                document.querySelector("div#filters button").click()
            });
        }

        //Если в транзакциях
        if (window.location.toString().includes("tranzaxis/matching/list") === true)
        {
            navigator.clipboard.readText().then(function(data) {
                console.log("Your string: ", data);
                let arrcreate = data.split('/-/')
                let arrrrn = arrcreate[5] //сумма
                console.log(arrrrn)

                $('div#filters div:nth-child(3) > div > div:nth-child(2) > input').val(arrrrn).change()
                document.querySelector("div#filters button").click()
            });
        }}

    // AFTERTRAN ВНЕ КНОПКИ
    if (document.referrer == 'https://adm.appex.ru/tranzaxis/matching/list' || window.location.toString().includes("fiscal/cashdeskoperations/") || window.location.toString().includes("tranzaxis/matching/list") && document.referrer.includes('https://tranzaxis.main.local/')){AFTERTRAN()}
    function AFTERTRAN(){

        //страница загружена
        let wt = setInterval(w_load, 100);
        function w_load(){
            console.log('w_load start')
            var element = document.querySelector('div#loading > img')
            if(document.readyState == "complete" && element == null)
            {
                clearInterval(wt)
                setTimeout(f1,550); function f1(){return reffer()}
            }
        };

        let cm = 0
        function reffer() {
            console.log('reffer')
            console.log(cm)
            if (cm == 0 && document.referrer.includes('https://tranzaxis.main.local/') && window.location.toString().includes("tranzaxis/matching/list"))
            {cm = 1; after_w_load()} // для отработки функции один раз  return reffer() == 1
            else {console.log('else1'); cm = 1}
            if (cm <= 1 && document.referrer == 'https://adm.appex.ru/tranzaxis/matching/list' && window.location.toString().includes("tranzaxis/matching/"))
            {cm = 2; second_page()}
            else {console.log('else2'); cm = 2}
            if (cm <= 2 && document.referrer.length == 46 || document.referrer.length == 47)
            {cm = 3; thr_pg_aproove_tr()}
            else {console.log('else3'); cm = 3}
            console.log(cm)
            //setTimeout(f1,100); function f1(){reload_btn()}
        }
        /*
    function reffer() {
    console.log('reffer')
    let cm = 0
    if (document.referrer.includes('https://tranzaxis.main.local/') && window.location.toString().includes("tranzaxis/matching/list"))
    {after_w_load()} // для отработки функции один раз  return reffer() == 1
    //else {after_w_load()}
    if (document.referrer == 'https://adm.appex.ru/tranzaxis/matching/list' && window.location.toString().includes("tranzaxis/matching/"))
    {second_page()}
    if (document.referrer.length == 46)
    {thr_pg_aproove_tr()}
    //setTimeout(f1,100); function f1(){reload_btn()}
}
*/

        function after_w_load() {
            console.log('after_w_load start')
            navigator.clipboard.readText().then(function(data) {
                let arrcreate = data.split('/-/')
                let arrrrn = arrcreate[5]
                console.log(arrrrn)
                $('div#filters div:nth-child(3) > div > div:nth-child(2) > input').val(arrrrn).change() // вставляю из буфера
                setTimeout(f,100); function f(){document.querySelector('div#filters button').click()} //нажимаю обновить
                setTimeout(f1,200); function f1(){reload_btn()}
            })}

        function reload_btn(){
            console.log('reload_btn start')
            if (document.querySelector("div#filters button").outerText == "Обновить") {
                if (document.querySelector("div#list tr:nth-child(2) > td:nth-child(1) > a") == null){
                    //document.querySelector("div#list tr:nth-child(1) > td:nth-child(1) > a").click()
                    let a = document.querySelector("div#list tr:nth-child(1) > td:nth-child(1) > a").href
                    window.location=a
                    setTimeout(f1,100); function f1(){w_load()}
                }
                else {console.log('reload_btn ERROR')}
            }
            else {setTimeout(function(){reload_btn()},100);}
        }

        function second_page(){

            let ab = zNode.insertAdjacentHTML('beforeend','<button id="wtm2_SearchBttn" type="button"> Проверить TID в RM </button>');
            let w2 = document.getElementById ("wtm2_SearchBttn");
            w2.addEventListener ("click", w2ButtonClickAction);
            function w2ButtonClickAction (zwEvent) {
                let redmainrrn = document.querySelector('input#termId').value
                window.open("https://redmine.ticketplan.info/search?utf8=%E2%9C%93&scope=&q=%2B+"+redmainrrn+"");
            }

            console.log('second_page start')
            let i = document.querySelectorAll("div#list strong:nth-child(6)").length // document.querySelectorAll('div#list strong:nth-child(4)').length
            let ia = i
            navigator.clipboard.readText().then(function(data) {
                let arrcreate = data.split('/-/')
                let arrtid = arrcreate[4] //tid
                let revers = arrcreate[6] //revers
                let vozvrt = arrcreate[7]

                sessionStorage.setItem('codsverky', document.querySelector('#code').value)

                for (i=i-1;i<ia && i>=0;i--) {
                    let a = document.querySelectorAll("div#list strong:nth-child(6)")[i].outerText
                    let art = arrcreate[0] // "14.05.2020 12:55:09"
                    let at = arrcreate[0] // "14.05.2020 12:55:09"
                    //first at < a
                    var at1 = new Date();
                    var at2 = at.replace(/^(\d+)\.(\d+)\./, '$2/$1/')
                    let at3 = at1.setTime(Date.parse(at2));
                    let at4 = at1.setSeconds(at1.getSeconds()-80) //-65
                    let at5 = at1.toLocaleTimeString()
                    //second arrtime art > a
                    var art1 = new Date();
                    var art2 = art.replace(/^(\d+)\.(\d+)\./, '$2/$1/')
                    let art3 = art1.setTime(Date.parse(art2));
                    let art4 = art1.setSeconds(art1.getSeconds()+40)
                    let art5 = art1.toLocaleTimeString()
                    //third a
                    var a1 = new Date();
                    var a2 = a.replace(/^(\d+)\.(\d+)\./, '$2/$1/')
                    let a3 = a1.setTime(Date.parse(a2));
                    let a4 = a1.setSeconds(a1.getSeconds())
                    let a5 = a1.toLocaleTimeString()
                    console.log(at5,'<',a5,'---', art5,'>',a5)
                    if (at5 < a5 && art5 > a5) {
                        let a = i+1
                        console.log('true',i,a)
                        let tidfrompage = document.querySelector(`div#list tr:nth-child(${a}) > td:nth-child(4)`).outerText
                        if (tidfrompage == arrtid) {
                            let w = document.querySelector(`div#list tr:nth-child(${a}) > td:nth-child(3)`).outerText
                            if (w == "Ошибка" || w == "В ожидании") {
                                $(`div#list tr:nth-child(${a}) > td:nth-child(1) > a`).attr('id', 'js_injection').parent().parent().css('background-color', 'yellow')
                            }
                        }
                        else {alert('Похоже тид не торт. Проверь, пожалуйста. Тид из буфера: '+arrtid+'. Тид с этой страницы: '+tidfrompage)}
                    }
                    else {console.log(i)}
                }
                if (revers == "Reversal") {alert('Будь внимателен! Это Reversal'); return false}
                if (vozvrt == "Возврат товара") {alert('Будь внимателен! Это Возврат товара'); return false}
                if (document.querySelectorAll(`#js_injection`).length == 1) {document.querySelector('#js_injection').click(); setTimeout(f1,100); function f1(){w_load()}}
            })
        }

        function thr_pg_aproove_tr(){
            console.log('thr_pg_aproove_tr')
            if (window.location.toString().includes("fiscal/cashdeskoperations/") === true && document.querySelector('#cashDeskOperation > div > div > div:nth-child(18) > div > div > button').textContent == "Подтвердить вручную") {
                ButtonClickAction ()
            }
        }
    }

    //BIG FUNC IN CASHDESK
    if (window.location.toString().includes("fiscal/cashDeskOperations/list") && document.referrer.includes('https://tranzaxis.main.local/'))
    {AFTERTRAN1()}
    function AFTERTRAN1(){

        //страница загружена
        let wt = setInterval(w_load, 100);
        function w_load(){
            console.log('w_load start')
            var element = document.querySelector('div#loading > img')
            if(document.readyState == "complete" && element == null)
            {
                clearInterval(wt)
                setTimeout(f1,950); function f1(){return reffer()}
            }
        };

        function reffer() {
            console.log('reffer')
            fp()
            //setTimeout(f1,100); function f1(){reload_btn()}
        }
        function fp() {
            navigator.clipboard.readText().then(function(data) {
                console.log("Your string: ", data);
                let arrcreate = data.split('/-/')
                let arrsum = arrcreate[2] //сумма
                console.log(arrsum)
                $('input#payment').val(arrsum).change()
                document.querySelector("div#filters button").click()
                setTimeout(f1,350); function f1(){reload_btn()}
            });
        }

        function reload_btn(){
            console.log('reload_btn start')
            if (document.querySelector("div#filters button").outerText == "Обновить") {
                let c = document.querySelector('#list > div > div > table > tbody').childElementCount
                let cc = c
                let k = 1
                navigator.clipboard.readText().then(function(data) {
                    let arrcreate = data.split('/-/')
                    let arrtime = arrcreate[0] //время

                    for (;c>0;c--) {
                        let createtime = document.querySelector(`#list > div > div > table > tbody > tr:nth-child(${c}) > td:nth-child(5)`).outerText
                        let endtime = document.querySelector(`#list > div > div > table > tbody > tr:nth-child(${c}) > td:nth-child(6)`).outerText
                        console.log(c, createtime)

                        if (createtime < arrtime && endtime > arrtime || endtime == "" && arrtime.slice(0,2) == createtime.slice(0,2))
                        {
                            console.log(createtime+" < "+arrtime+" && "+endtime+" > "+arrtime+" || "+endtime+" == ")
                            $(`#list > div > div > table > tbody > tr:nth-child(${c}) > td:nth-child(5)`).parent().css('background-color', 'yellow')
                            $(`div#list tr:nth-child(${c}) > td:nth-child(1) > a`).attr('id', 'js_injection')
                        }
                    }
                    if (document.querySelectorAll(`#js_injection`).length == 1) {document.querySelector('#js_injection').click()}
                })
            }
            else {setTimeout(function(){reload_btn()},100);}
        }
    }
};
/*
let createdate = document.querySelector("div#entries td:nth-child(6)").outerText
let enddate = document.querySelector("div#entries td:nth-child(7)").outerText
*/