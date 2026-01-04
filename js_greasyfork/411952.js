// ==UserScript==
// @name         New admin
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Поиск по коду код ТСП/НПС/ИНН/МК/почта/транзакция/номер заявки/номер заявки у ТО(за счет ориг номера заявки)//код кассовой операции
// @author       iku
// @include        /https://adm.appex.ru/*
// @include        /https://platform.pay.travel/*
// @include        /https://b2c.appex.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411952/New%20admin.user.js
// @updateURL https://update.greasyfork.org/scripts/411952/New%20admin.meta.js
// ==/UserScript==



fqw()

function fqw() {
    function fasd() {
        let nds = new Date
        let milisectime1 = nds.getTime()
        let milisectime = new Date(milisectime1)
        return milisectime
    }

    let amc = new Date
    let site
    let b = 0xb

    let nd = new Date
    let day = nd.getDate().toString()
    let mont = nd.getMonth()+1
    let c = amc.getMonth()+1
    let year = nd.getFullYear().toString()
    let month = mont.toString()
    let d = true //c !== b
    console.log(new Date)

    let nd1 = new Date
    let day1ns = nd1.getDate()+1
    let day1 = day1ns.toString()
    let monthplus1 = nd.getMonth()+2
    let monthminus1 = nd.getMonth().toString()
    if (d) {console.log(); return}

    if(day1 == '32') {
        day1 = '31'
        day = '29'
    }

    let simple_headers = {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "method": "GET",
    }



    var zNode = document.createElement ('form')
    zNode.innerHTML = '<input type="text" id="formtoinn" placeholder="ИНН/НПС/кодТСП/касса/email/tranzaction/заявка"/>'
    zNode.setAttribute ('id','allforms')
    zNode.style.cssText=`top: 100%; cursor: pointer; position: fixed; top: 30px; left: 0; font-size: 12.8px; border: 0px outset black; opacity: 0.9; z-index: 1100; padding: 0px 0px;`
    document.body.appendChild (zNode); //border: 1.5px

    //активировать фрейм ЕКОМ
    if (window.location.toString().includes("https://adm.appex.ru") === true) {
        site = "https://adm.appex.ru"
        f()
    }

    //активировать б2с
    if (window.location.toString().includes("https://b2c.appex.ru/") === true) {
        site = "https://b2c.appex.ru"
        f()
    }

    //активировать ВС
    if (window.location.toString().includes("https://platform.pay.travel/") === true) {
        site = "https://platform.pay.travel"
        f()
    }
    //ИНТЕРФЕЙС РЕКВИЗИТОВ СТАРТ
    function f() {
        console.log('f()')
        let partnercodeonpage = location.href.split("/").pop()
        let balance = window.location.toString().includes("balance")
        let list = window.location.toString().includes("list")
        let worksheet = window.location.toString().includes("/worksheet/")
        let paymentContract = window.location.toString().includes("/paymentContract/")
        let order = window.location.toString().includes("/order/")

        if (window.location.toString().includes("/partner/") === true && list == false && worksheet == false && balance == false && paymentContract == false) {
            document.querySelector('div#wrap h1').innerHTML = `<a text href='https://platform.pay.travel/crm/paymentContract/partner/${partnercodeonpage}' >Реквизиты: открыть ПД`


            //Получить баланс --- можно изменить параметр forceUpdate=true для автообновления баланса
            getbalance()
            async function getbalance() {
                console.log('getbalance', fasd())
                let a1 = await fetch(`${site}/api/partner/balance/current?partnerCode=${partnercodeonpage}&forceUpdate=true&currencyCode=`, simple_headers);
                let b1 = await a1.json()
                let balancesum = b1.actualBalance.amount
                let balancecode = b1.actualBalance.currencyCode
                let balancetime = b1.lastUpdatedAt
                console.log(balancesum,balancecode,balancetime)

                //получить лист изменений баланса
                getbalancelist()
                async function getbalancelist() {
                    console.log('getbalancelist')
                    let a2 = await fetch(`${site}/api/partner/balance/transactions?partnerCode=${partnercodeonpage}&createdAfter=${year}-${monthminus1}-${day}&createdBefor=${year}-${month}-${day1}&pageSize=5&pageIndex=0&transactionType=all`, simple_headers);
                    let b2 = await a2.json()
                    let c6_all = "<pre>" //'На этой платформе движения баланса за последний месяц нет'
                    let c2 = b2.items.forEach(getBalance_mini)
                    //let cb7 = "<pre>"
                    if (b2.items.length == 0) {c6_all = 'На этой платформе движения баланса за последний месяц нет'}

                    function getBalance_mini(element,index) {
                        console.log(b2.items.length,index+1,'ASS')
                        //if (b2.items.length !== 0) {
                        let cb1 = element.createdAt
                        let cb2 = element.description
                        let cb3 = element.destinationAccount.name
                        let cb4 = element.sum.amount
                        let cb5 = element.sum.currencyCode
                        let cb6 = cb1+' '+cb2+' '+cb3+' '+cb4+' '+cb5
                        c6_all += cb6+'\n'
                        if (b2.items.length == index+1)
                        {
                            console.log('ok')
                            c6_all = c6_all.slice(0, -1)

                        }
                        //}
                        //else { c6_all = 'На этой платформе движения баланса за последний месяц нет'}
                    }
                    //let cb8 = "<pre>""</\pre>"

                      //Спойлер
                        setTimeout(bigspoiler, 0)
                        function bigspoiler() {
                            console.log('bigspoiler', fasd())
                            let email = document.querySelector('input[name="emails"]').value
                            let phone = document.querySelector('input[name="phones"]').value
                            let inn = document.querySelector('input[name="inn"]').value
                            let nameorg = document.querySelector('input[name="fullName"]').value
                            let si = document.querySelector('div#content div.col-md-2 > select').selectedIndex
                            let formorg = document.querySelector('div#content div.col-md-2 > select').options[si].outerText
                            let dogovor = document.querySelector('div#content div:nth-child(5) > p').outerText

                            let zNode1 = document.createElement ('div')
                            zNode1.innerHTML = `<text style="font-size: 13pt; width: 100px; color: #b316a3" class="link_spoiler" id="linkSpoiler">Подробнее</text>`
                        document.querySelector('#content > div > div:nth-child(3)').after (zNode1);

                            var text = document.querySelector("#linkSpoiler");
                            let TSP_data = document.querySelector('#content > div > div:nth-child(12)');
                            let rekvizity = document.querySelector('#content > div > div:nth-child(6)');
                            let TSP_lvl = document.querySelector('#content > div > div:nth-child(7)');
                            let interface = document.querySelector('#content > div > div:nth-child(8)');
                            let tags = document.querySelector('#content > div > div:nth-child(9)');
                            let tags1 = document.querySelector("div#content div > div:nth-child(10)");
                            let valuta = document.querySelector("div#content div:nth-child(11) > div > div:nth-child(1)");
                            let mabye = document.querySelector('#content > div > div:nth-child(13)');

                            /*
                        TSP_data.style.display = "block";
                        rekvizity.style.display = "block";
                        TSP_lvl.style.display = "block";
                        interface.style.display = "block";
                        tags.style.display = "block";
                        tags1.style.display = "block";
                        valuta.style.display = "block";
                        */
                            //zNode1.addEventListener('click', Spoiler())
                            document.querySelector('#linkSpoiler').addEventListener('click', Spoiler)

                            ShowSpoilerf()
                            function ShowSpoilerf() {
                                if (localStorage.getItem('Spoiler') == 0) {
                                    Spoiler()
                                }
                                else {
                                    localStorage.setItem('forUsersPre1_check', 0)
                                }
                            }


                            //}
                            //mabye.style.display = "block";
                            function Spoiler() {
                                console.log('Spoiler()')

                                if(rekvizity.style.display == "none") {
                                    TSP_data.style.display = "block";
                                    rekvizity.style.display = "block";
                                    TSP_lvl.style.display = "block";
                                    interface.style.display = "block";
                                    tags.style.display = "block";
                                    tags1.style.display = "block";
                                    valuta.style.display = "block";
                                    //mabye.style.display = "block";

                                    document.querySelector('#linkSpoilerHide').remove()
                                    localStorage.setItem('Spoiler', 1)

                                    //text.innerHTML = 'Скрыть'
                                }
                                else{

                                    if(rekvizity.style.display == "" || rekvizity.style.display == "block") {
                                        TSP_data.style.display = "none";
                                        rekvizity.style.display = "none";
                                        TSP_lvl.style.display = "none";
                                        interface.style.display = "none";
                                        tags.style.display = "none";
                                        tags1.style.display = "none";
                                        valuta.style.display = "none";
                                        //mabye.style.display = "none";
                                        //text.innerHTML = `Данные ТСП: <br\>${email} ${phone} <br\>${inn} ${formorg} ${nameorg}<br\> Статус договора: ${dogovor}`;
                                        let tExt = `<br\>Данные ТСП: <br\>${email} ${phone} <br\>ИНН: ${inn} ${formorg} ${nameorg}<br\> Статус договора: ${dogovor}`
                                    document.querySelector('#linkSpoiler').insertAdjacentHTML('beforeend',`<text id="linkSpoilerHide" style="font-size: 11pt; width: 100px; color: blue"">${tExt}</text>`)
                                        localStorage.setItem('Spoiler', 0)
                                    //document.querySelector('#linkSpoiler').addEventListener('click', Spoiler())
                                }
                                }
                            }
                        }
                        //Спойлер конец

                    //получить лимит по кассе
                    let a3 = await fetch(`${site}/api/fiscal/limit/info?partnerCode=${partnercodeonpage}`, simple_headers)
                    let b3 = await a3.json()
                    let cc1 = b3.actualAmount.amount
                    let cc2 = b3.actualAmount.currencyCode
                    let cc3 = b3.limitValue.amount
                    let cc4 = b3.limitValue.currencyCode

                    let cc5 = 'Остаток по лимиту: '+cc1+' '+cc2+'\nСумма лимита: '+cc3+' '+cc4
                    let cc4_all = "<pre>"+cc5
                    ///

                    ///получить группы ТСП
                    /*
                    let a4 = await fetch(`${site}/api/partnerGroup`, simple_headers)
                    let b4 = await a4.json()
                    let c4_2 = "<pre>"
                    b4.forEach(show_pGroup_mini)

                    function show_pGroup_mini(element, index, code) {
                        //console.log (element,+'11111'+ index,+'11111'+ code)
                        let c4_1 = element.name
                        c4_2 += c4_1+'\n'
                        console.log (c4_2)
                    }
                    */


                    //Найти пользователей СТАРТ
                    search_users()
                    async function search_users() {
                        console.log('search_users', fasd())
                        //Найти каждого пользователя у ТСП
                        let a = await fetch(`${site}/api/user/list?partnerCode=${partnercodeonpage}&pageSize=50&pageIndex=0`, simple_headers);
                        let b = await a.json()
                        let bc = b.items.length
                        let c = b.items.forEach(search_users_getuserinfo)
                        //console.log(c)


                        /*
                        document.querySelector('div#wrap h1').innerHTML = `<a text href='https://platform.pay.travel/crm/paymentContract/partner/${partnercodeonpage}' >Реквизиты: открыть ПД1`
                        setTimeout(del2, 0)
                        function del2() {
                            console.log('del2', fasd())
                            document.querySelector('div#wrap h1').innerHTML = `<a text href='https://platform.pay.travel/crm/paymentContract/partner/${partnercodeonpage}' >Реквизиты: открыть ПД`
                }
                */

                        if(bc == 0) {
                            setTimeout(del, 1600) //2000
                            function del() {
                                console.log('del', fasd())
                                document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<text id="nousers" style="margin: 0px; height: 0px; width: 1000px; color: blue; readonly">У ${partnercodeonpage} нет юзеров</text>`)
                            }
                        }
                        let inDexOne = 0
                        function search_users_getuserinfo(element, index, code) {
                            console.log('func')
                            let usercode = element.code
                            getuserinfo()
                            //Достать данные из пользователя
                            async function getuserinfo() {
                                console.log('getuserinfo', fasd())
                                let a = await fetch(`${site}/api/user?code=${usercode}`, simple_headers);

                                let b = await a.json()
                                let p_type = b.partner.type
                                let u_email = b.email
                                let u_role = b.roles[0]
                                let u_phone = b.phone
                                let d = b.platforms
                                let u_plat = d[index]
                                let e = d.forEach(ShowUsers)

                                //Исправление бага с отрисовкой множества расширенной анкеты
                                setTimeout(del1, 1400) //1400 11.11.2020
                                let forUsersPre
                                let forOrdersPre
                                function del1() {
                                    if(document.querySelector('#R_Anketa') == null) {
                                        console.log('del1 или Показать баланс и РА', fasd())
                                        let inn_op = document.querySelector('input[name="inn"]').value
                                        let name_op = document.querySelector('div#content div:nth-child(2) > div > input[name="name"]').value
                                        document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><a text id="R_Anketa" style="width: 1000px; color: black; readonly" href="${site}/partner/${partnercodeonpage}/worksheet/${p_type}">Расширенная анкета</text><br/>`)
                                        document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><a text id="R_Anketa" style="width: 1000px; color: red; readonly" href="${site}/partner/balance/any">${'На балансе ТСП: '+balancesum+' '+balancecode+' ● Время обновления баланса: '+balancetime}</text><br/>`)
                                        document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><text id="R_Anketa" style="width: 1000px; color: #ff02e5; readonly">${'Лог баланса ИНН: '+inn_op+' '+name_op+': '+c6_all}</text><br/>`)
                                        document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><a text id="R_Anketa" style="width: 1000px; color: #ff02e5; readonly" href="${site}/fiscal/limit/any">${'Кассовый лимит: '}</a></text>${cc4_all}<br/>`)
                                        //document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><a text id="R_Anketa" style="width: 1000px; color: #ff02e5; readonly" href="${site}/partnerGroup">${'Группы ТСП: '}</a></text>${c4_2}<br/>`)
                                        document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><text id="forUsersPre1" style="width: 1000px; color: #ff02e5; readonly" href="${site}/user/list?partnerCode=${partnercodeonpage}">${' Пользователи ТСП: '}</text>`)
                                        //document.querySelector('#forUsersPre1').insertAdjacentHTML('afterbegin',`<input type="checkbox" id=forUsersPre1_check >`)
                                        //forUsersPre = document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<details><summary>Users</summary><text id="forUsersPre1" style="width: 1000px; color: #ff02e5;">${'Пользователи ТСП: '}</text>`) //.appendChild(document.createElement('pre'))
                                        forUsersPre = document.querySelector('#forUsersPre1').appendChild(document.createElement('pre'))
                                        forUsersPre = forUsersPre.setAttribute('id','forUsersPre')
                                        document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><text id="forOrdersPre1" style="width: 1000px; color: #ff02e5; readonly">${'Заявки ТСП: '}</text>`)
                                        //document.querySelector('#forOrdersPre1').insertAdjacentHTML('afterbegin',`<input type="checkbox" id=forOrdersPre1_check >`)
                                        //document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><input type="checkbox" id="forOrdersPre1" style="width: 1000px; color: #ff02e5; ">${'Заявки ТСП: '}</text>`)
                                        //forOrdersPre =document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<details><summary>Orders</summary><text id="forOrdersPre1" style="width: 1000px; color: #ff02e5;">${'Заявки ТСП: '}</text>`)
                                        forOrdersPre = document.querySelector('#forOrdersPre1').appendChild(document.createElement('pre'))
                                        forOrdersPre = forOrdersPre.setAttribute('id','forOrdersPre')
                                        //gospoil https://

                                        /*
                                        let forUsersPre1_check = document.querySelector('#forUsersPre1_check')
                                        forUsersPre1_check.addEventListener('click', forUsersPre1_checkf)

                                        function forUsersPre1_checkf() {
                                            if (document.querySelector('#forUsersPre1_check').checked) {
                                                //console.log('autocheck1');
                                                localStorage.setItem('forUsersPre1_check', 1)
                                                document.querySelector('#forUsersPre').remove()
                                            }
                                            else {
                                                //console.log ('Не autocheck1');
                                                localStorage.setItem('forUsersPre1_check', 0)

                                            }
                                        }


                                        if (localStorage.getItem('forUsersPre1_check') == 1) {
                                            forUsersPre1_check.checked = true
                                            document.querySelector('#forUsersPre').remove()
                                        }



                                        let forOrdersPre1_check = document.querySelector('#forOrdersPre1_check')
                                        forOrdersPre1_check.addEventListener('click', forOrdersPre1_checkf)

                                        function forOrdersPre1_checkf() {
                                            if (document.querySelector('#forOrdersPre1_check').checked) {
                                                //console.log('autocheck1');
                                                localStorage.setItem('forOrdersPre1_check', 1)
                                                document.querySelector('#forOrdersPre').remove()
                                            }
                                            else {
                                                //console.log ('Не autocheck1');
                                                localStorage.setItem('forOrdersPre1_check', 0)

                                            }
                                        }


                                        if (localStorage.getItem('forOrdersPre1_check') == 1) {
                                            forUsersPre1_check.checked = true
                                            document.querySelector('#forOrdersPre').remove()
                                        }

*/

                                    }
                                }

                                //let users_all = '<pre>'
                                function ShowUsers(element, index) {
                                    console.log('func')
                                    if (d[index].isActive) {
                                        let u_plat
                                        let c = 'Платформа: '+d[index].name+' ● Тип ТСП: '+p_type+' ● Почта юзера: '+u_email+' ● Номер юзера: '+u_phone //+'  ◦ Роль юзера:'+u_role //+' '+ usercode
                                        //console.log(c)

                                        let site1
                                        if (d[index].name == 'Виртуальный сейф' || d[index].name == 'Денежные переводы') {
                                            site1 = 'https://platform.pay.travel'
                                        }
                                        if (d[index].name == 'Электронная коммерция') {
                                            site1 = 'https://adm.appex.ru'
                                        }
                                        if (d[index].name == 'B2C Appex') {
                                            site1 = 'https://b2c.appex.ru'
                                        }

                                        //Выводит юзеров
                                        setTimeout(showusers, 1500)
                                        function showusers() {
                                            console.log('del',d[index].name, index)
                                            console.log(d[index])
                                            //users_all += c+'\n'
                                            inDexOne++
                                            if (inDexOne == 1) {
                                                console.log('forUsersPre')
                                                document.querySelector('#forUsersPre').insertAdjacentHTML('beforeend',`<a text id="textArea" style="margin: 0px; height: 0px; width: 1000px; color: blue; readonly" href="${site1}/user/${usercode}">${c}</text>`)
                                            }
                                            else {
                                                //Вернуть если что-то не так = document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/><a text id="textArea" style="margin: 0px; height: 0px; width: 1000px; color: blue; readonly" href="${site1}/user/${usercode}">${c}</text>`)
                                                let showusers = document.querySelector('#forUsersPre').insertAdjacentHTML('beforeend',`<br/><a text id="textArea" style="margin: 0px; height: 0px; width: 1000px; color: blue; readonly" href="${site1}/user/${usercode}">${c}</text>`)
                                                }
                                            console.log('showusers', fasd())
                                        }
                                    }
                                }
                                //document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/>`)
                            }
                        }


                        //GetEcomOrdersFromSeller START
                        GetEcomOrdersFromSeller()
                        //Запросить 20 заявок
                        async function GetEcomOrdersFromSeller() {
                            console.log('GetEcomOrdersFromSeller', fasd()) // 2021-01-25
                            let aa = await fetch(`${site}/api/order/list?billingCode=&referenceOperatorCode=${partnercodeonpage}&createdAfter=2020-06-30&createdBefor=${year}-${month}-${day1}&paidAgency=&isLinked=&onlyWithHolds=false&onlyNoOutPay=&pageSize=20&pageIndex=0`, simple_headers);
                            let bb = await aa.json()
                            let cc = bb.items
                            let c = cc.forEach(GetEcomOrdersFromSellerMini)
                            let indexF = 1
                            //let aw = 2


                            function GetEcomOrdersFromSellerMini(elem, indexF) {
                                indexF++
                                let zOURcode = elem.code
                                let zTOcode = elem.sourceCode
                                let pcode = elem.referenceOperatorCode
                                let price = elem.fullOriginalPrice.amount
                                let priceCurrency = elem.fullOriginalPrice.currencyCode
                                let updateDate = elem.lastUpdatedAt
                                let ccc = '№: '+indexF+' TOcode: '+zTOcode+' OURcode: '+zOURcode+' coast: '+price+' '+priceCurrency+ ' UpdDate: '+updateDate //updateDate 'pcode: '+pcode

                                if (cc.length !== 0) {

                                    let ecom = ''
                                    if (site == "https://adm.appex.ru") {
                                        ecom = '/eCommerce'
                                    }
                                    console.log('elem'+indexF)

                                    //Выводит заявки
                                    setTimeout(showOrders, 1501)
                                    function showOrders() {
                                        console.log('indexF'+indexF)
                                        if (indexF == 1) {
                                            //document.querySelector('div#content div > div:nth-child(1) > div > div').insertAdjacentHTML('beforeend',`<br/>`)
                                            document.querySelector('#forOrdersPre').insertAdjacentHTML('beforeend',`<a text id="list_orders" style="margin: 0px; height: 0px; width: 1000px; color: blue; readonly" href="${site}${ecom}/order/${zOURcode}">${ccc}</text>`)
                                        }
                                        else {
                                            document.querySelector('#forOrdersPre').insertAdjacentHTML('beforeend',`<br/><a text id="list_orders" style="margin: 0px; height: 0px; width: 1000px; color: blue; readonly" href="${site}${ecom}/order/${zOURcode}">${ccc}</text>`)
                                        }
                                    }
                                }
                                else { setTimeout(del2, 1450); function del2() {document.querySelector('#forOrdersPre').insertAdjacentHTML('beforeend',`<br/><a text id="list_orders" style="margin: 0px; height: 0px; width: 1000px; color: blue; readonly">${'Нет заявок, т.к. не является оператором'}</text>`) }}
                            }
                        }
                        // GetEcomOrdersFromSeller END
                    }
                }
            }
        }

        //BIG FUNC search_users END - ИНТЕРФЕЙС РЕКВИЗИТОВ ФИНИШ

        // Интерфейс заявки СТАРТ
        // Условие обновлялки только для заявок!!!!
        if (order && list == false) {
            let wt = setInterval(w_load, 100);
            function w_load(){
                console.log('w_load start')
                var element = document.querySelector('div#loading > img')
                if(document.readyState == "complete" && element == null && document.querySelector('.table.table-condensed') !== null) {
                    clearInterval(wt)
                    setTimeout(f1,100); function f1(){ShowInterfaceZayavka()}
                }
            };

            function ShowInterfaceZayavka() {

                var zNode = document.createElement ('div');
                zNode.innerHTML = '<button id="tm1_SearchBttn" type="button"> Показать чеки </button>';
                zNode.setAttribute ('id', 'tm1_btnContainer');
                zNode.style.cssText=``
                document.querySelector('.table.table-condensed').after (zNode); //document.querySelector('#order > div:nth-child(8)')
                zNode.addEventListener('click',openShowR)

                function openShowR() {
                    let dateOrder = document.querySelector('input#createdAt').value //"04.02.2020"
                    let year_DO = dateOrder.slice(6,10)
                    let month_DO = dateOrder.slice(3,5)
                    let day_DO = dateOrder.slice(0,2)
                    let date_DO = year_DO+'-'+month_DO+'-'+day_DO
                    let TOorder1 = document.querySelector('input#sourceCode')
                    let TOorder = TOorder1.value
                    if (TOorder == '') {TOorder = location.href.split("/").pop()}

                    ShowReceiptInOrder()
                    async function ShowReceiptInOrder() {
                        //console.log(TOorder, site)
                        let a = await fetch(`${site}/api/fiscal/receipt/list?partnerCode=&createdAfter=${date_DO}&createdBefore=${year}-${month}-${day1}&orderCode=${TOorder}&pageSize=50&pageIndex=0`, simple_headers);
                        let b = await a.json()
                        console.log(b)

                        b.items.forEach(ShowReceipt)
                        function ShowReceipt(element, index) {
                            let c = b.items[index].amount.amount
                            let c1 = b.items[index].amount.currencyCode
                            let c2 = b.items[index].code
                            console.log(c,c1, c2)
                            //document.querySelector('#order > div:nth-child(9) > div.col-md-12 > table > tbody')
                            document.querySelector('.table.table-condensed').insertAdjacentHTML('beforeend',`<br/><a text id="R_Anketa" style="width: 1000px; color: black; readonly" href="https://adm.appex.ru/fiscal/receipt/${c2}">${c+' '+c1}</text><br/>`)
                        }
                        if (b.items.length == 0) {alert(`Чеки с номером заказа: ${TOorder} не найдены с ${date_DO} по ${year}-${month}-${day1}. Возможно баг? Попробуй поискать вручную здесь: ${site}/fiscal/receipt/list`)}
                    }
                }
                //
                let external_count = document.querySelector('table > tbody').childElementCount
                console.log('asd',external_count)
                Showexternal()
                async function Showexternal() {
                    let ife = ''
                    if (document.querySelector(`#order > div:nth-child(8) > div > h3`) !==null) {
                        if (document.querySelector(`#order > div:nth-child(8) > div > h3`).outerText == 'Входящие оплаты') {
                            ife = 'div#order div:nth-child(8) > div.col-md-12 > '
                        }
                    }
                    if (document.querySelector('div#order div:nth-child(9) > div.col-md-12 > h3').outerText == 'Входящие оплаты') {
                        ife = 'div#order div:nth-child(9) > div.col-md-12 > '
                    }
                    for (;external_count > 0; external_count--) {
                        console.log('asd',external_count)
                        let external_type = document.querySelector(`${ife}table > tbody > tr:nth-child(${external_count}) > td:nth-child(2)`)
                        if (external_type.textContent !== 'Epos') {console.log('STOP'); return}
                        let external_num = document.querySelector(`table > tbody > tr:nth-child(${external_count}) > td:nth-child(1) > a`).outerText
                        let a = await fetch(`${site}/api/inPayment/external/${external_num}`, simple_headers);
                        let b = await a.json()
                        console.log(b)

                        let date = b.paymentDate
                        let sum = b.paid.amount
                        let curr = b.paid.currencyCode
                        let pan = b.extensions[0].value
                        let ch = b.extensions[1].value
                        let all = date+' '+sum+' '+curr+' '+pan+' '+ch
                        console.log(date,sum,curr,pan,ch,external_count)

                        //document.querySelector('.table.table-condensed').insertAdjacentHTML('beforeend',`<br/><text id="R_Anketa" style="width: 1000px; color: black; readonly">${all}</text><br/>`)
                        //document.querySelector(`div#order tr:nth-child(${external_count}) > td:nth-child(6) > span:nth-child(1)`).append('<br> '+ch+'</br>'+pan) // "<pre>""</\pre>"
                        //document.querySelector(`div#order tr:nth-child(${external_count}) > td:nth-child(6) > span:nth-child(1)`).insertAdjacentHTML('beforeend',`<br/>${ch}<br/>${pan}<br/>`)
                        //document.querySelector(`div#order tr:nth-child(${external_count}) > td:nth-child(6) > span:nth-child(1)`).setAttribute('style','color:green')
                        //2 верхних случая убраны т.к. нет конечного селектора спан на екоме
                        document.querySelector(`div#order tr:nth-child(${external_count}) > td:nth-child(6)`).insertAdjacentHTML('beforeend',`<br/>${ch}<br/>${pan}<br/>`)
                        document.querySelector(`div#order tr:nth-child(${external_count}) > td:nth-child(6)`).setAttribute('style','color:green')
                        //
                    }
                }
            }
        }
        // Интерфейс заявки ФИНИШ


        // ИНТЕРФЕЙС БИЛЛИНГА СТАРТ
        if (window.location.toString().includes("/billing/")) {
            GetLinkToRekvizityFromBilling()
            async function GetLinkToRekvizityFromBilling() {
                let a = await fetch(`${site}/api/billing/${partnercodeonpage}`, simple_headers);
                let b = await a.json()
                let p_code = b.partner.code
                let h1 = document.querySelector('div#wrap h1')
                h1.insertAdjacentHTML('beforeend',`<br/><a text id="textArea" style="font-size: 14pt; width: 100px; color: blue; readonly" href="${site}/partner/${p_code}">Открыть реквизиты</text><br/>`)
            }
        }
        // ИНТЕРФЕЙС БИЛЛИНГА ФИНИШ


        //ИНТЕРФЕЙС ПОИСКОВОЙ КНОПКИ 1 СТАРТ
        document.querySelector("form#allforms").onsubmit = function allforms(event) {
            console.log(new Date)
            let va = document.querySelector("input#formtoinn").value
            let v = va.trim()
            //Содержит код ТСП
            let w = /[A-z]/.test(v) == true && v.includes('@') == false && v.match(/\d/g) == null
            if (v.match(/\d/g) !== null) {
                if (v.match(/\d/g).length < 4) {
                    w = true
                }
                else {
                    w = false
                }
            }
            //let w1 = /[A-z]/.test(v) == true && v.includes('@') == false && v.slice(0,1) !== 'R' && v.match(/\d/g) == null || v.match(/\d/g).length < 5
            event.preventDefault()
            // Содержит код ТСП window.location="http://example.com"
            if (w) {window.location=`${site}/partner/${v}`; return false}
            else {
                console.log(new Date)
                //Содержит код НПС
                if (v.length > 0 && v.length <= 5) {
                    fa()
                    async function fa() {
                        let a = await fetch(`${site}/api/partner/list?type=&npsProvider=${v}&status=&activityType=&pageSize=50&pageIndex=0`, simple_headers);
                        let b = await a.json()
                        let bb = b.items.length
                        let type = b.items
                        let len = b.items.length
                        console.log(len)
                        console.log(type)

                        if (len == 1) {
                            let a = b.items[0].code
                            window.location=`${site}/partner/${a}`
                        }
                        if (len == 2) {
                            let one = b.items[0].type == 'agency'
                            let onecode = b.items[0].code
                            let two = b.items[1].type == 'agency'
                            let twocode = b.items[1].code
                            let choose = confirm('Выбрать ТА?')
                            if (choose && one) {
                                window.location=`${site}/partner/${onecode}`
                            }

                            if (choose && two) {
                                window.location=`${site}/partner/${twocode}`
                            }
                        }
                        if (len > 2) {
                            alert('Сорянба, я нашел слишком много ТСП с таким кодом НПС. Поэтому ничего не покажу')
                        }
                    }
                }
                //Сожержит ИНН по факту от 10 цифр до 12 и может начинаться на 0.
                if (v.length >= 10 && v.slice(0,1) !== '0' && v.includes('@') == false && v.slice(0,1) !== 'R' && /^\d+$/.test(v)) {
                    SearchInn() //fa()
                    async function SearchInn() {
                        let a = await fetch(`${site}/api/partner/list?inn=${v}&type=&status=&forCurrentPlatform=false&activityType=&pageSize=50&pageIndex=0`, simple_headers);
                        let b = await a.json()
                        let bb = b.items.length
                        let type = b.items
                        let len = b.items.length
                        console.log(len)
                        console.log(type)

                        if (len == 1) {
                            let a = b.items[0].code
                            window.location=`${site}/partner/${a}`
                        }
                        if (len == 2) {
                            let one = b.items[0].type// == 'agency'
                            let onecode = b.items[0].code
                            let two = b.items[1].type == 'operator'
                            let twocode = b.items[1].code
                            let choose = confirm('Выбрать ТА?')
                            console.log(choose, one,two)
                            if (choose && one) {
                                window.location=`${site}/partner/${onecode}`
                            }

                            if (choose == false && two) {
                                window.location=`${site}/partner/${twocode}`
                            }
                        }
                        if (len > 2 || len == 0) {
                            alert('Сорянба, слишком много ТСП с таким ИНН или их нет вовсе')
                        }
                    }
                }
                //содержит серийник МК
                if (v.length == 11 && v.slice(0,3) == '000') {
                    f1()
                    async function f1() {
                        let a = await fetch(`${site}/api/fiscal/outlet/cashdesk/list?serial=${v}`, simple_headers);
                        let b = await a.json()
                        console.log(b)
                        if (b.length == 0) {alert('Касса не подключена на этом сайте. Попробуй перейти на https://adm.appex.ru/ и повторить'); return false}
                        let ab = b[0].code
                        console.log(ab)
                        window.open(`https://adm.appex.ru/cashdesk/${ab}`)
                        return false
                    }}

                //Содержит емаил пользователя
                if (v.includes('@')) {
                    f2()
                    async function f2() {
                        let a = await fetch(`${site}/api/user/list?login=${v}&pageSize=50&pageIndex=0`, simple_headers);
                        let b = await a.json()
                        if (b['items'].length == 0) {alert('Пользователь не найден'); return false}
                        let ab = b["items"][0].code
                        console.log(ab)
                        window.location=`${site}/user/${ab}`
                        //return false
                    }}

                //если содержит кассовую операцию
                if (v.includes('op-')) {
                    f2()
                    function f2() {
                        window.location=`${site}/fiscal/cashdeskoperations/${v}`
                        //return false
                    }}

                let fw1 = v.length == 9 && v.slice(0,2) == '19' && v.includes('@') == false
                let fw2 = v.slice(0,1) == '2' && v.length == 9 && v.includes('@') == false
                console.log(fw1, fw2)
                //Содержит транзакцию начинается на 2, 9 цифр // v.includes('@') == false v.length == 9 && v.slice(0,2) == '19' || v.slice(0,1) == '2' && v.length == 9
                if (fw1 || fw2) {
                    f2()
                    async function f2() {
                        let a = await fetch(`${site}/epos/api/admin/transaction/list?pageNumber=0&pageSize=50&code=&tourOperatorCode=&fromDate=&toDate=&withNotSentResults=false&eposTransactionId=${v}`, simple_headers);
                        let b = await a.json()
                        if (b.orders.length == 0) {alert('Транзакция не найдена'); return false}
                        let ab = b.orders[0].proxyOrderId
                        console.log(ab)
                        window.location=`${site}/epos/admin/transaction/${ab}`
                    }}
            }

            //Внутренний номер заявки ВС (везде) И номер входящего платежа
            if (v.length < 11 && v.length > 5 && v.slice(0,3) !== '000' && v.includes('@') == false && v.slice(0,1) !== '2') //v.length == 9 && изменил на костыль: v.length < 11 && v.length > 5 \\\  && v < '191646922'
            {
                fa()
                async function fa() {
                    console.log(site,v) // 2020-08-0
                    let a = await fetch(`${site}/api/order/list?code=${v}&sourceCode=${v}&billingCode=&createdAfter=2019-07-04&createdBefor=${year}-${month}-${day1}5&paidAgency=&isLinked=&onlyWithHolds=false&onlyNoOutPay=&pageSize=20&pageIndex=0`, simple_headers);
                    let b = await a.json()
                    let bb = b.items.length
                    let type = b.items
                    let len = b.items.length
                    console.log(len)
                    console.log(type)

                    let ecom
                    if (site == "https://adm.appex.ru") {
                        ecom = 'eCommerce/'}
                    else {
                        ecom = ''
                    }

                    if (len == 0) {
                        //external_payments() Старт
                        external_payments()
                        async function external_payments() {
                            let external_code
                            try {
                                let a = await fetch(`${site}/api/inPayment/external/${v}`, simple_headers);
                                let b = await a.json()
                                console.log(b)
                                external_code = b.code
                                if (external_code == 'ObjectNotFoundException') {
                                    alert('Нет заявок и входящих платежей с таким идентификатором на этой платформе. Включаю поиск ТСП по ИНН'); return
                                }
                                else {
                                    window.location=`${site}/inpayment/external/${external_code}`
                                }
                            }
                            catch (er) {alert('Ошибка запроса. Нет заявок и входящих платежей с таким идентификатором'); return}
                        }
                        //external_payments() Энд
                    }
                    if (len == 1) {
                        //alert('1')
                        let a = b.items[0].code
                        window.location=`${site}/${ecom}order/${a}`
                    }
                    if (len == 2) {
                        let one = b.items[0].type == 'agency'
                        let onecode = b.items[0].code
                        let two = b.items[1].type == 'agency'
                        let twocode = b.items[1].code
                        let choose = confirm('Выбрать ТА?')
                        if (choose && one) {
                            window.location=`${site}/${ecom}order/${onecode}`
                        }

                        if (choose && two) {
                            window.location=`${site}/${ecom}order/${twocode}`
                        }
                    }
                    if (len > 2) {
                        alert('Очень много заявок')
                    }
                }
                //
                /*
                external_payments()
                async function external_payments() {
                    let a = await fetch(`${site}/api/inPayment/external/${v}`, simple_headers);
                    let b = await a.json()
                    console.log(b)
                    let external_code
                    try {
                        external_code = b.code
                        window.location=`${site}/inpayment/external/${external_code}`
                        }
                    catch (err) {'Нет исходящих оплат с таким номером'}
                }
                */
                //
            }
            /// Если содержит rrn
            if (v.length == 12 && v.includes('@') == false && v.slice(0,2) == '02' || v.slice(0,2) == '03') {
                console.log(new Date)
                RRNSearch()
                async function RRNSearch() {
                    let a = await fetch(`${site}/api/tranzaxis/matching?beginDate=${year}-${monthminus1}-${day}&endDate=${year}-${month}-${day1}&rrn=${v}&status=&pageSize=10&pageIndex=0`, simple_headers);
                    let b = await a.json()
                    console.log(b)
                    if (b.items.length == 0) {
                        alert('Такого РРН нет, ищу ТСП по ИНН');
                        SearchInn() //fa()
                        async function SearchInn() {
                            let a = await fetch(`${site}/api/partner/list?inn=${v}&type=&status=&forCurrentPlatform=false&activityType=&pageSize=50&pageIndex=0`, simple_headers);
                            let b = await a.json()
                            let bb = b.items.length
                            let type = b.items
                            let len = b.items.length
                            console.log(len)
                            console.log(type)
                            if (len == 1) {
                                let a = b.items[0].code
                                window.location=`${site}/partner/${a}`
                        }
                            if (len == 2) {
                                let one = b.items[0].type// == 'agency'
                                let onecode = b.items[0].code
                                let two = b.items[1].type == 'operator'
                                let twocode = b.items[1].code
                                let choose = confirm('Выбрать ТА?')
                                console.log(choose, one,two)
                                if (choose && one) {
                                    window.location=`${site}/partner/${onecode}`
                            }

                                if (choose == false && two) {
                                    window.location=`${site}/partner/${twocode}`
                            }
                            }
                            if (len > 2 || len == 0) {
                                alert('Сорянба, слишком много ТСП с таким ИНН или их нет вовсе')
                            }
                        }
                    }
                    let c = b.items[0].tranzaxisCode
                    window.location=`${site}/tranzaxis/matching/${c}`

                }
            }
            // Если содержит R2805126155787
            if (v.length == 14 && v.slice(0,1) == 'R') {
                openVozvratyTO()
                function openVozvratyTO() {
                    window.location=`${site}/operatorRefund/request/list`
                }
            }
            ////
        }
    }
    //ИНТЕРФЕЙС ПОИСКОВОЙ КНОПКИ 1 ФИНИШ

    //ввести текст
    let a = document.querySelector("input#formtoinn").oninput = function inn() {
        let val = this.value.trim();
        return val
    }

    //ИНТЕРФЕЙС ВЕСЬ БЕЗ ОГРАНИЧЕНИЙ СТАРТ
    //Сверяется

    let CheckBoxSverka = document.createElement ('div');
    CheckBoxSverka.innerHTML = '<input type="checkbox" id=idCheckBoxSverka ><label>.Мониторинг </label>'
    document.querySelector('#allforms').appendChild (CheckBoxSverka);
    let CBS = document.querySelector('#idCheckBoxSverka')
    CBS.addEventListener('click', CheckCheckBox)

    let autocheck = document.createElement ('div');
    autocheck.innerHTML = '<input type="checkbox" id=idautocheck ><label>AutoRefresh Monitoring</label>'
    document.querySelector('#allforms').appendChild (autocheck);
    let autocheck1 = document.querySelector('#idautocheck')
    autocheck1.addEventListener('click', autocheck_stats)

    function autocheck_stats() {
        if (autocheck1.checked) {
            //console.log('autocheck1');
            localStorage.setItem('autocheck1', 1)
            //setTimeout(wlr, 300000); function wlr() { window.location.reload() }
            setInterval(interautocheck, 150000); function interautocheck() { document.querySelector('#textAreaLog').remove(); CheckCheckBox() }
        }
        else {
            //console.log ('Не autocheck1');
            localStorage.setItem('autocheck1', 0)

        }
    }

    if (localStorage.getItem('autocheck1') == 1) {
        autocheck1.checked = true
        autocheck_stats()
    }
    else {
        autocheck_stats()
    }


    ////
    function CheckCheckBox() {
        console.log('CheckCheckBox() '+new Date)
        if (CBS.checked) {
            //console.log('Выбран');
            localStorage.setItem('ShowSverkaInLog', 1)

            var LogArea = document.createElement ('div');
            //{'ИНН: '+inn+'\n'+typeTSP+': '+formorg+' '+nameorg+'\nПодключен способ оплаты СБП.'+'\nДоговор № '+dognum+' от '+dat}
            //`<a text id="textArea" href="https://adm.appex.ru/tranzaxis/matching/${cc}" style="margin: 0px; height: 100px; width: 257px; readonly">${'Лог ррн:\nrrn: '+c+'     '}</a>`; height: 100px; width: 257px;
            LogArea.innerHTML = `<textArea id="textAreaLog" style="margin: 0px; readonly; resize:vertical; width: 145px; height: 590px; font-family: monospace; font-size: smaller;";>`; //350
            LogArea.style.cssText=`position: absolute; bottom: 0; right: 0.8%; font-size: 12.5px; opacity: 0.85; z-index: 1100` //border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px 0px;
            document.body.appendChild (LogArea)

            ShowSverkaInLog()
            ShowSverkaInLog_notMatched()
            ShowOutfoingPayments()
            ReturnPayments()
            ReturnPaymentsTO()
        }
        else {
            //console.log ('Не выбран');
            localStorage.setItem('ShowSverkaInLog', 0)

            1
            var elem = document.getElementById("myDiv");
            2
            document.querySelector('#textAreaLog').remove()
        }
    }

    if (localStorage.getItem('ShowSverkaInLog') == 1) {
        CBS.checked = true
        CheckCheckBox()
    }
    else {
        CheckCheckBox()
    }

    // Мониторинг сверки СТАРТ
    async function ShowSverkaInLog() {
        let a = await fetch(`${site}/api/tranzaxis/matching?beginDate=${year}-${month}-${day}&endDate=${year}-${month}-${day1}&rrn=&status=inProcess&pageSize=50&pageIndex=0`, simple_headers);
        let b = await a.json()
        console.log(b)
        let bil = b.items.length
        let biltake = sessionStorage.getItem('inprocess')
        let bt = bil != biltake
        console.log(bil+' BIL '+biltake+' BILTAKE'+bt)

        if (b.items.length > 0 && bil != biltake) {
            sessionStorage.setItem('inprocess', bil)
            let ca = b.items[0].tranzaxisCode
            //window.speechSynthesis.speak(new SpeechSynthesisUtterance('Открываю новую сверку'))
            //let audio = new Audio('https://rinton.ru/uploads/audio/2019-01/40560/rington.mp3') // опять работа
            if (autocheck1.checked) {
                let audio = new Audio('https://rinton.ru/uploads/audio/2019-01/40561/rington.mp3')
                audio.play()

                setTimeout(wlr, 2000); function wlr() { window.location=`${site}/tranzaxis/matching/${ca}` }
            }
            ;
            //return false
        }
        document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑\nСверяется: ${b.items.length}\n`) // day1
        b.items.forEach(f)

        function f(element, index) {
            let c = element.rrn
            let cc = element.tranzaxisCode
            let ccc = element.tranDate.slice(5,20)
            document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`rrn: ${c+': date: '+ccc}\n`)
        }
    }


    async function ShowSverkaInLog_notMatched() {
        let a = await fetch(`${site}/api/tranzaxis/matching?beginDate=${year}-${monthminus1}-${day}&endDate=${year}-${month}-${day1}&rrn=&status=notMatched&pageSize=50&pageIndex=0`, simple_headers);
        let b = await a.json()
        console.log(b)

        document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑\nНет совпадений: ${b.items.length}\n`) //${b.items.length} day1
        b.items.forEach(f)

        function f(element, index) {
            let c = element.rrn
            let cc = element.tranzaxisCode
            let ccc = element.tranDate.slice(5,20)
            document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`rrn: ${c+': date: '+ccc}\n`)
        }
    }

    //Мониторинг сверки КОНЕЦ



    // Исходящие платежи НАЧАЛО
    async function ShowOutfoingPayments() {
        console.log(day,month,year,day1)
        let a = await fetch(`${site}/api/outPaymentRequest/list?status=inQueue&createdAfter=${year}-${month}-${day}&createdBefor=${year}-${month}-${day1}`, simple_headers);
        let b = await a.json()
        //console.log(a)

        let a5
        document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑\nИсхПлатежи: ${b.length}\n`)
        b.forEach(ShowOutfoingPaymentsMini)

        if (b.length > 40) {
            notifyMe()
            function notifyMe() {
                // поддерживает ли браузер нотиф
                if (!("Notification" in window)) {
                    alert("пропробуй обновить, запустить Хром");
                }
                else if (Notification.permission === "granted") {
                    var notification = new Notification('Исходящая оплата', {
                        body: `Большое количество исходящих платежей, всего:${b.length}`,
                        icon: "https://viza-info.ru/wp-content/uploads/2019/12/coin.gif"
                    });
                }

                else if (Notification.permission !== "denied") {
                    Notification.requestPermission().then(function (permission) {
                        // а потом разрешил. синтаксис: new Notification(title, options)
                        if (permission === "granted") {
                            var notification = new Notification('Исходящая оплата', {
                                body: `Большое количество исходящих платежей, всего:${b.length}`,
                                icon: "https://viza-info.ru/wp-content/uploads/2019/12/coin.gif"
                            })
                            }
                    })}
            }
            //alert(`Большое количество исходящих платежей, всего:${b.length}. Нужно проверить исходящие: ${site}/outPayment/request/list`)
        }
        function ShowOutfoingPaymentsMini(element, index) {
            let a1 = element.attemptsCount
            if (a1 < 2) {return}
            let a2 = element.lastError
            let a3 = element.outPayment.orderCode
            let a4 = element.outPayment.partner.code
            a5 = a1+' '+a2+' '+a3+' '+a4
            //console.log(a5, index)
            if (a1 > 4) {
                document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`👇👇👇👇👇👇👇👇👇👇 ${a5}\n👆👆👆👆👆👆👆👆👆👆\n`) // КРИТИЧНЫЙ Исходящий платеж:
                //notifyMe()
                function notifyMe() {
                    // поддерживает ли браузер нотиф
                    if (!("Notification" in window)) {
                        alert("пропробуй обновить, запустить Хром");
                    }
                    else if (Notification.permission === "granted") {
                        var notification = new Notification('Исходящая оплата', {
                            body: `КРИТИЧНЫЙ Исходящий платеж: ${a5}`,
                            icon: "https://viza-info.ru/wp-content/uploads/2019/12/coin.gif"
                        });
                    }

                    else if (Notification.permission !== "denied") {
                        Notification.requestPermission().then(function (permission) {
                            // а потом разрешил. синтаксис: new Notification(title, options)
                            if (permission === "granted") {
                                var notification = new Notification('Исходящая оплата', {
                                    body: `КРИТИЧНЫЙ Исходящий платеж: ${a5}`,
                                    icon: "https://viza-info.ru/wp-content/uploads/2019/12/coin.gif"
                                })
                                }
                        })}
                }
                //document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`👇👇👇👇👇👇👇👇👇👇 КРИТИЧНЫЙ Исходящий платеж: ${a5}\n👆👆👆👆👆👆👆👆👆👆\n`)
            }
            else { document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`${a5}\n`) }
        }
        //document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`Всего ИсхП: ${b.length}\n`) Исходящие платежи КОНЕЦ
    }
    //Исходящие платежи КОНЕЦ

    //Возвраты на модерации старт
    async function ReturnPayments() {
        let a = await fetch(`${site}/api/refund/list?status=open&createdAfter=${year}-${monthminus1}-${day}&createdBefor=${year}-${month}-${day1}`, simple_headers);
        let b = await a.json()

        let a5
        document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑\nВозвраты на модерации: ${b.length}\n`)
        b.forEach(ShowReturnPaymentsMini)

        function ShowReturnPaymentsMini(element, index) {
            let a1 = element.orderCode
            let a2 = element.refund.amount
            let a3 = element.refund.currencyCode
            a5 = a1+' '+a2+' '+a3
            document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`${a5}\n`)
        }
    }

    async function ReturnPaymentsTO() {
        let a = await fetch(`${site}/api/operatorrefund/request/list?status=opened&createdAfter=${year}-${monthminus1}-${day}&createdBefor=${year}-${month}-${day1}`, simple_headers);
        let b = await a.json()

        let a5
        document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑𓃑\nВозвраты ТО на модерации: ${b.length}\n`)
        b.forEach(ShowReturnPaymentsTOMini)

        function ShowReturnPaymentsTOMini(element, index) {
            let a1 = element.partner.code
            let a2 = element.partner.name
            let a3 = element.createdAt
            let a4 = element.code
            a5 = 'R'+a4
            if (a1 == 'OOOBel-tur' || a1 == 'TKFakel' || a1 == 'Fakel' || a1 == 'Sputnik-Germes' || a1 == 'RechnyeKruizy') {
                //alert('Срочно нужно сделать возврат от ТО!!! https://b2c.appex.ru/operatorRefund/request/list R'+a4)
                document.querySelector('#textAreaLog').setAttribute('style','margin: 0px; readonly; resize:vertical; width: 175px; height: 400px; color:#ff5f00')
                document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥 КРИТИЧНЫЙ ВОЗВРАТ (Без заявления, без удержания т.к. партнер работает напрямую с банком, просто отправить письмо финикам): ${a5}\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥\n`)
            }
            else {
                document.querySelector('#textAreaLog').insertAdjacentHTML('beforeEnd',`Возврат: ${a5}\n`)
            }
        }
    }
    //Возвраты на модерации финиш
    //}
    //ИНТЕРФЕЙС ВЕСЬ БЕЗ ОГРАНИЧЕНИЙ ФИНИШ
}