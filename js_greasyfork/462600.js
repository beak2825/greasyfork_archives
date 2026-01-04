// ==UserScript==
// @name         SberHELP
// @namespace    http://tampermonkey.net/
// @version      1.7.4
// @description  Helper for sbermarket
// @author       You
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_cookie
// @grant        GM_setClipboard
// @grant        window.onurlchange
// @match        *://sbermarket.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sbermarket.ru
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462600/SberHELP.user.js
// @updateURL https://update.greasyfork.org/scripts/462600/SberHELP.meta.js
// ==/UserScript==

(function () {
    'use strict';
    class smshubAPI {
        async getBalance() {
            const url = `https://hotstone.ru.net/getbalance`;
            const response = await fetch(url);
            const data = await response.text();
            return data;
        }

        async getNumbersStatus() {
            const url = `https://hotstone.ru.net/getnumbersstatus`;
            const response = await fetch(url);
            const data = await response.text();
            return data;
        }

        async getNumber() {
            const url = `https://hotstone.ru.net/getnumber`;
            const response = await fetch(url);
            const data = await response.text();
            return data;
        }

        async setStatus() {
            const url = `https://hotstone.ru.net/setstatus`;
            const response = await fetch(url);
            const data = await response.text();
            return data;
        }

        async getStatus() {
            const url = `https://hotstone.ru.net/getstatus`;
            const response = await fetch(url);
            const data = await response.text();
            return data;
        }

        async getPrices() {
            const url = `https://hotstone.ru.net/getprices`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }
    }
    const apiKey = '52322Ufc86bf12f661f6a22ae9e14778e7f056';
    const smshub = new smshubAPI();
    setInterval(function () {
        if (window.location.href == 'https://sbermarket.ru/') {
            if (byxpath('/html/body/div[1]/div[2]/div[2]/div/div/div/form/button') && !byid('smshub')) {
                if (byxpath('/html/body/div[1]/div[2]/div[2]/div/div/div/form/button').textContent == 'Получить код в СМС') {
                    byxpath('/html/body/div[1]/div[2]').style = 'z-index: 20 !important;'
                    var div = document.createElement('div')
                    const modal = document.createElement('div')
                    const number = document.createElement('span')
                    number.textContent = '❌нет номера'
                    number.className = 'red'
                    number.style = 'padding:10px;margin:5px'
                    const sms = document.createElement('span')
                    sms.textContent = '❌нет смс'
                    sms.className = 'red'
                    sms.style = 'padding:10px;margin:5px'
                    const balance = document.createElement('span')
                    const butt = document.createElement('button')
                    butt.textContent = '✅купить номер'
                    butt.className = 'green'
                    butt.style = 'padding:10px;margin:5px'
                    const numberul = document.createElement('ul')
                    const numberli = document.createElement('li')
                    const hr = document.createElement('hr')
                    const timer = document.createElement('span')
                    const autorun = document.createElement('input')
                    autorun.type = 'checkbox'
                    autorun.textContent = 'Автозаказ'
                    autorun.addEventListener('click', () => {
                        if (autorun.checked) {
                            sessionStorage.setItem('autorun', 1)
                        }
                        else {
                            sessionStorage.setItem('autorun', 0)
                        }
                    })
                    timer.textContent = '-:-'
                    timer.style = 'padding:10px;margin:5px'
                    modal.style = `
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    z-index: 9999;
                    border-radius: 10px;
                    background: white;
                    font-size:30px;
                    `
                    modal.id = 'smshub'
                    div.appendChild(balance)
                    div.appendChild(timer)
                    div.appendChild(autorun)
                    modal.appendChild(div)
                    modal.appendChild(hr)
                    smshub.getBalance().then(response => {
                        balance.textContent = "💰 " + response.split(':')[1]
                    });
                    div = document.createElement('div')
                    div.appendChild(number)
                    div.appendChild(sms)
                    sms.addEventListener('click', (e) => { GM_setClipboard(sms.textContent) })
                    modal.appendChild(div)
                    modal.appendChild(hr)
                    div = document.createElement('div')
                    div.appendChild(butt)
                    butt.addEventListener('click', (e) => {
                        smshub.getNumber().then(resp => {
                            const data = resp.split(':')
                            number.textContent = data[2]
                            GM_setClipboard(data[2])
                            const actid = data[1]
                            function check() {
                                smshub.getStatus().then(resp => {
                                    if (resp.includes('STATUS_OK')) {
                                        const data = resp.split(':')
                                        sms.textContent = data[1]
                                        sms.className = 'green'
                                        butt.textContent = '✅смс получено'
                                        butt.removeEventListener('click')
                                        clearInterval(inter)
                                        GM_setClipboard(data[1])
                                        var audio = new Audio();
                                        audio.preload = 'auto';
                                        audio.src = 'https://assets.mixkit.co/active_storage/sfx/2870/2870.wav';
                                        audio.addEventListener("canplaythrough", (event) => {
                                            /* аудио может быть воспроизведено; проиграть, если позволяют разрешения */
                                            audio.play();
                                        });
                                    }
                                })
                            }
                            const inter = setInterval(check, 5000)
                            function startTimer(duration, display) {
                                var timer = duration, minutes, seconds;
                                setInterval(function () {
                                    minutes = parseInt(timer / 60, 10);
                                    seconds = parseInt(timer % 60, 10);

                                    minutes = minutes < 10 ? "0" + minutes : minutes;
                                    seconds = seconds < 10 ? "0" + seconds : seconds;

                                    display.textContent = minutes + ":" + seconds;

                                    if (--timer < 0) {
                                        timer = duration;
                                    }
                                }, 1000);
                            }
                            startTimer(20 * 60, timer)
                            sms.textContent = '⏳жду смс...'
                            butt.className = 'red'
                            butt.textContent = '❌отменить'
                            butt.addEventListener('click', (e) => {
                                smshub.setStatus()
                                clearInterval(inter)
                                butt.textContent = '✅купить номер'
                                butt.className = 'green'
                                number.textContent = '❌нет номера'
                                sms.textContent = '❌нет смс'
                                sms.className = 'red'
                                number.className = 'red'
                                window.location.reload()
                            }, { once: true })
                        })
                    }, { once: true })
                    modal.appendChild(div)
                    document.body.appendChild(modal)
                }
            }
        }
    }, 5000);
    setInterval(function () {
        if (window.location.href.includes('user/shipments/')) {
            sessionStorage.setItem("lasturl", window.location.href)
            location.reload();
        }
    }, 60000);
    if (window.location.href == 'https://sbermarket.ru/' && sessionStorage.getItem("lasturl") && !sessionStorage.getItem("muted1") && sessionStorage.getItem("filled")) {
        var audio = new Audio();
        audio.preload = 'auto';
        audio.src = 'https://sadtrombone.com/assets/sound/trombone.ogg';
        audio.addEventListener("canplaythrough", (event) => {
            /* аудио может быть воспроизведено; проиграть, если позволяют разрешения */
            audio.play();
            sessionStorage.setItem("muted1", true)
        });
    }

    setInterval(function () {
        if (window.location.href.includes('user/shipments/') && !sessionStorage.getItem("muted") && byxpath('/html/body/div[1]/div[2]/div[2]/div[2]/div/div/div[1]/div[2]/div[2]').textContent == 'Курьер спешит к вам. Он может позвонить, чтобы уточнить детали доставки') {
            var audio = new Audio();
            audio.preload = 'auto';
            audio.src = 'https://assets.mixkit.co/active_storage/sfx/937/937.wav';
            audio.play();
            if (!document.getElementById('mutebtn')) {
                const but = document.createElement('button')
                but.id = 'mutebtn'
                but.style = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 100px;
                height: 100px;
                z-index: 9999;
                cursor: pointer;
                border-radius: 50px;
                background: none;
                font-size: 70px;
                border: none;`
                but.addEventListener('click', () => { sessionStorage.setItem('muted', true); but.remove() })
                but.textContent = '🔇'
                document.body.appendChild(but)
            }
        }
    }, 10000);
    function addRedClass(element) {
        element.classList.add('red');
    }
    function addGreenClass(element) {
        element.classList.add('green');
    }
    function postRequest(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify(data)
        })
    }
    function fetchOrderData() {
        fetch('https://sbermarket.ru/api/multiretailer_order').then(response => response.json())
            .then(data => {
                console.log(data);
                fetch('https://hotstone.ru.net/addcart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('Error: ' + response.status);
                        }
                    })
                    .then(responseData => {
                        console.log(responseData);
                        // Handle the response data here
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Handle any errors here
                    });
                addGreenClass(saveB);
            })
            .catch(error => {
                console.error(error);
                addRedClass(saveB);// здесь можно обработать ошибку
            });
    }
    function createButtonList() {
        const autorun = sessionStorage.getItem('autorun') == 1
        // Fetch JSON data from URL
        fetch("https://hotstone.ru.net/getcart")
            .then(response => response.json())
            .then(data => {
                // Create <ul> element
                const ul = document.createElement('ul');
                // Iterate over the JSON array elements
                if (autorun) {
                    if (data.slice(-1)[0].shipments.length == 0) {
                        return
                    }
                    loadOrderData(data.slice(-1)[0], true);
                    return
                }
                data.forEach(element => {
                    if (element.shipments.length == 0) {
                        return
                    }
                    // Create <li> element
                    const li = document.createElement('li');

                    // Create button element
                    const button = document.createElement('button');
                    button.classList.add('overflow')
                    var namelist = []
                    element.shipments[0].line_items.forEach(item => { namelist.push(item.name.slice(0, 20)) })
                    button.innerText = namelist.join('\n');

                    // Add click event listener to the button
                    button.addEventListener('click', function () {
                        loadOrderData(element);
                    });

                    // Append button to <li> element
                    li.appendChild(button);

                    // Append <li> element to <ul> element
                    ul.appendChild(li);
                });

                // Return the <ul> element
                openModal2(ul);
            })
            .catch(error => {
                console.log("Error fetching data:", error);
            });
    }

    function loadOrderData(cart, autorun = false) {
        const data = cart || GM_getValue('cart');
        var itemList = data.shipments[0].line_items
        var urllist = []
        itemList.forEach((item) => { urllist.push({ "line_item": { "offer_id": item.offer_id, "packs": item.packs } }) })
        const requests = urllist.map(body => postRequest('https://sbermarket.ru/api/line_items', body));
        Promise.all(requests)
            .then(responses => {
                // Check if all responses are successful
                const allResponsesOk = responses.every(response => response.ok);

                if (allResponsesOk) {
                    console.log('All responses are OK!');
                    addGreenClass(loadB);
                    // Log each response body
                    responses.forEach((response, index) => {
                        response.json().then(data => {
                            console.log(`Response ${index + 1}:`, data);
                        });
                    });
                } else {
                    console.log('Some responses failed.');
                    addRedClass(loadB);
                }
                window.location.reload()
            })
            .catch(error => {
                console.log('Error:', error);
            });

    }
    function setElementValueByName(name, value) {
        var element = document.getElementsByName(name)[0];
        if (element) {
            element.value = value;
        }
    }
    function setElementValueByClass(name, value) {
        var element = document.getElementsByClassName(name)[0];
        if (element) {
            element.value = value;
        }
    }
    function setElementValueById(name, value) {
        var element = document.getElementById(name);
        if (element) {
            element.value = value;
        }
    }
    function setElementContentByName(name, value) {
        var element = document.getElementsByName(name)[0];
        if (element) {
            element.textContent = value;
        }
    }
    function waitForElementByName(id, callback) {
        var element = document.getElementsByName(id)[0];
        if (element) {
            callback(element);
        } else {
            setTimeout(function () {
                waitForElementByName(id, callback);
            }, 500);
        }
    }
    function waitForElementById(id, callback) {
        var element = document.getElementById(id);
        if (element) {
            callback(element);
        } else {
            setTimeout(function () {
                waitForElementByName(id, callback);
            }, 500);
        }
    }
    function byname(name) {
        return document.getElementsByName(name)[0];
    }
    function byid(name) {
        return document.getElementById(name);
    }
    function byclass(name) {
        return document.getElementsByClassName(name)[0];
    };
    function byxpath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function openModal2(content) {
        // Создаем элементы модального окна
        var modal = document.createElement('div');
        var modalContent = document.createElement('div');
        var closeBtn = document.createElement('button');
        var remBtn = document.createElement('button');

        // Добавляем классы к элементам модального окна
        modal.classList.add('modal2');
        modalContent.classList.add('modal-content');
        closeBtn.classList.add('mod-close2');
        closeBtn.innerText = "X"
        remBtn.classList.add('mod-close2');
        remBtn.innerText = "Очистить"
        // Добавляем переданное содержимое в элемент модального окна
        modalContent.appendChild(remBtn);
        modalContent.appendChild(content);

        // Добавляем элементы в модальное окно
        modal.appendChild(modalContent);
        modal.appendChild(closeBtn);

        // Добавляем модальное окно в тело документа
        document.body.appendChild(modal);

        // Закрытие модального окна при клике на кнопку "Закрыть"
        closeBtn.addEventListener('click', function () {
            modal.remove();
        });
        remBtn.addEventListener('click', function () { fetch("https://hotstone.ru.net/remcart"); modalContent.remove() })
    }
    function openModal() {
        const modal = document.querySelector('.modal');
        const sess = byid("sesslist")
        var sessions = GM_getValue('sessions', []);
        var output = ""
        for (var session of sessions.reverse()) {
            output += `<li><button id="${session.id}">${session.date}</button></li>`
        }
        sess.innerHTML = output;
        modal.style.display = 'flex';
    }
    function closeModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';
    }

    function save_sess(e) {
        GM_cookie.list({}, function (cookies, error) {
            if (!error) {
                var sessions = GM_getValue('sessions', []);
                sessions.push({ "id": (new Date).getTimeAlias(), "date": (new Date).toLocaleString(), "cookies": cookies })
                GM_setValue('sessions', sessions);
                addGreenClass(byid("save_s"));
            } else {
                addRedClass(byid("save_s"));
                console.log(error);
            }
        });
    }
    function load_sess(e) {
        if (e.target.tagName == 'BUTTON') {
            const num = e.target.id;
            var sessions = GM_getValue('sessions', []);
            for (var session of sessions) {
                if (num == session.id) {
                    for (const cookie of session.cookies) {
                        GM_cookie.set(cookie, function (error) {
                            if (error) {
                                addRedClass(e.target);
                                console.log(error);
                            } else {
                                addGreenClass(e.target);
                            }
                        });
                    }
                    break;
                }
            }
        }
    }
    function reset_s() {
        var sessions = GM_getValue('sessions', []);
        GM_cookie.list({}, function (cookies, error) {
            for (const item of cookies) {
                GM_cookie.delete({ name: item.name }, function (error) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('Cookie deleted successfully');
                    }
                });
            }
            sessionStorage.clear()
            localStorage.clear()
            location.reload();
        });
    }
    if (window.onurlchange === null) {
        // feature is supported
        window.addEventListener('urlchange', (info) => {
            if (info.url.includes('checkout/order')) {
                fetchOrderData()
            }
            check_search()
            const currentLocation = info.url
            if (currentLocation.includes('order') && !sessionStorage.getItem("is_reloaded")) {
                sessionStorage.setItem("is_reloaded", true);
                window.location.reload()
            }
        });
    }
    function check_search() {
        var info = window.location.href
        if ((info.includes('/c/') || info.includes('/search?')) && (!info.includes('unit_price_asc'))) {
            info = info.replace('&sort=price_asc', '').replace('&sort=popularity', '').replace('&sort=price_desc', '').replace('&sort=unit_price_asc', '')
            if (!info.includes('?')) info += '?'
            info += '&sort=unit_price_asc'
            window.location.href = info
        }
    }
    check_search()
    const client_token = unsafeWindow.dynamicEnvsFromServer.STOREFRONT_API_V3_CLIENT_TOKEN
    function rand_addr() {
        const a = "{\"shopping_context\":{\"shipping_method_kind\":\"by_courier\",\"ship_address\":{\"validity\":0,\"lat\":55.735267,\"lon\":37.748906,\"street\":\"Перовское шоссе\",\"building\":\"10с3\",\"full_address\":\"Перовское шоссе, 10с3\",\"city\":\"Москва\",\"city_in\":\"\",\"short_address\":\"Перовское шоссе, 10с3\",\"reduced_address\":{\"street\":\"ш. Перовское\",\"building\":\"10с3\"}}}}"
        const b = "{\"shopping_context\":{\"shipping_method_kind\":\"by_courier\",\"ship_address\":{\"validity\":0,\"lat\":55.735231,\"lon\":37.747801,\"street\":\"Перовское шоссе\",\"building\":\"10к2с4\",\"full_address\":\"Перовское шоссе, 10к2с4\",\"city\":\"Москва\",\"city_in\":\"\",\"short_address\":\"Перовское шоссе, 10к2с4\",\"reduced_address\":{\"street\":\"ш. Перовское\",\"building\":\"10к2с4\"}}}}"
        const c = "{\"shopping_context\":{\"shipping_method_kind\":\"by_courier\",\"ship_address\":{\"validity\":0,\"lat\":55.734273,\"lon\":37.74878,\"street\":\"3-я Карачаровская улица\",\"building\":\"8А\",\"full_address\":\"3-я Карачаровская улица, 8А\",\"city\":\"Москва\",\"city_in\":\"\",\"short_address\":\"3-я Карачаровская улица, 8А\",\"reduced_address\":{\"street\":\"ул. 3-я Карачаровская\",\"building\":\"8А\"}}}}"
        const d = "{\"shopping_context\":{\"shipping_method_kind\":\"by_courier\",\"ship_address\":{\"validity\":0,\"lat\":55.734805,\"lon\":37.746939,\"street\":\"3-я Карачаровская улица\",\"building\":\"7с2\",\"full_address\":\"3-я Карачаровская улица, 7с2\",\"city\":\"Москва\",\"city_in\":\"\",\"short_address\":\"3-я Карачаровская улица, 7с2\",\"reduced_address\":{\"street\":\"ул. 3-я Карачаровская\",\"building\":\"7с2\"}}}}"
        const e = "{\"shopping_context\":{\"shipping_method_kind\":\"by_courier\",\"ship_address\":{\"validity\":0,\"lat\":55.735839,\"lon\":37.750289,\"street\":\"Перовское шоссе\",\"building\":\"14с4\",\"full_address\":\"Перовское шоссе, 14с4\",\"city\":\"Москва\",\"city_in\":\"\",\"short_address\":\"Перовское шоссе, 14с4\",\"reduced_address\":{\"street\":\"ш. Перовское\",\"building\":\"14с4\"}}}}"
        const f = "{\"shopping_context\":{\"shipping_method_kind\":\"by_courier\",\"ship_address\":{\"validity\":0,\"lat\":55.735135,\"lon\":37.751035,\"street\":\"3-я Карачаровская улица\",\"building\":\"11\",\"full_address\":\"3-я Карачаровская улица, 11\",\"city\":\"Москва\",\"city_in\":\"\",\"short_address\":\"3-я Карачаровская улица, 11\",\"reduced_address\":{\"street\":\"ул. 3-я Карачаровская\",\"building\":\"11\"}}}}"
        const g = "{\"shopping_context\":{\"shipping_method_kind\":\"by_courier\",\"ship_address\":{\"validity\":0,\"lat\":55.733842,\"lon\":37.750685,\"street\":\"3-я Карачаровская улица\",\"building\":\"14к1с2\",\"full_address\":\"3-я Карачаровская улица, 14к1с2\",\"city\":\"Москва\",\"city_in\":\"\",\"short_address\":\"3-я Карачаровская улица, 14к1с2\",\"reduced_address\":{\"street\":\"ул. 3-я Карачаровская\",\"building\":\"14к1с2\"}}}}"
        const arr = [a, b, c, d, e, f, g]
        return arr[Math.floor(arr.length * Math.random())];
    }
    function fill_fetch() {
        const body = rand_addr()
        fetch("https://sbermarket.ru/api/shopping_context", {
            "headers": {
                "client-token": client_token,
                "content-type": "application/json;charset=UTF-8",
            },
            "body": body,
            "method": "PUT",
        }).then(resp => {
            sessionStorage.setItem("filled1", true);
            window.location.reload();
        })
    }
    if (!sessionStorage.getItem("filled1")) {
        fill_fetch()
    }


    document.body.insertAdjacentHTML('beforeend', `  <button id="floating-btn" class="float-btn">🛒</button>
  <div id="menu" class="menu1">
    <ul>
      <li><button id="save">💾 Сохранить корзину</button></li>
      <li><button id="load">♻️ Загрузить корзину</button></li>
      <hr>
      <li><button id="save_s">Сохранить сессию</button></li>
      <li><button id="modal">Список сессий</button></li>
      <hr>
      <li><button id="exit" class="red">Выйти</button></li>
    </ul>
  </div>
  <div id="modclose" class="modal">
  <div class="modal-content">
    <h2>Выбери сессию:</h2>
    <ul id="sesslist">
    </ul>
    <button id="clear_s">Очистить</button>
    <button class="modal-close">X</button>
  </div>
</div>`)

    const floatingBtn = document.getElementById('floating-btn');
    const menu = document.getElementById('menu');
    const saveB = document.getElementById('save')
    const loadB = document.getElementById('load')

    floatingBtn.addEventListener('click', () => {
        menu.classList.toggle('show');
    });
    saveB.addEventListener('click', fetchOrderData);
    loadB.addEventListener('click', createButtonList);
    byid('modal').addEventListener('click', openModal);
    byclass('modal-close').addEventListener('click', closeModal);
    byid('save_s').addEventListener('click', save_sess);
    byid("clear_s").addEventListener('click', () => { GM_setValue('sessions', []); openModal(); });
    byid("sesslist").addEventListener('click', load_sess);
    byid('exit').addEventListener('click', reset_s);

    setTimeout(() => {
        if (sessionStorage.getItem('autorun') == 1) {
            createButtonList()
            sessionStorage.setItem('autorun', 2)
        }
    }, 5000)


    GM_addStyle(`
    .overflow {
    overflow-y:auto;
    max-height: 200px;
    margin:10px;
    }
    .float-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  width: 60px;
  height: 60px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 30px;
  text-align: center;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  outline: none;
}

.float-btn:hover {
  cursor: pointer;
  background-color: #0062cc;
}

.menu1 {
border-radius: 10px;
    position: fixed;
    bottom: 100px;
    left: 20px;
    z-index: 9998;
    width: auto;
    height: 0px;
    background-color: #fff;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.menu1 ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.menu1 li {
  padding: 5px;
}

.menu1 li:last-child {
  border-bottom: none;
}

.menu1 a {
  color: #333;
  text-decoration: none;
}

.menu1.show {
  height: auto;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}
li>button {
width: 100%;
    width: 100%;
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 15px 30px;
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
    font-size: 16px;
    cursor: pointer;
}

li>button:hover {

}
.red {
  background-color: red;
}
.green {
  background-color: green;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
}
.modal2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
}
.mod-close2{
    padding: 10px;
    background: red;
    margin: 20px;
    border-radius: 10px;
    color: white;
    }
.modal-content {
display: flex;
    flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
  text-align: center;
  overflow-y:auto;
}
.modal-close {
margin: 20px;
}
ul {
padding: 0;
}
hr {
margin:0;
}
#sesslist>li {
margin:5px;
}

    @media (orientation: landscape) {

* {
transition: none !important;
}
.DiscountProductsShelf_carousel__t2IF8 {
    padding: 0;
}
.Section_content__GEvsu {
    max-width: 100%;
    padding: 0;
}
.Button_mdSize___etib.Button_iconOnly__CEbiK {
    padding: calc(var(--sizeIndentLg) - 1px);
}
.ProductsGrid_grid__A8o3n {
    grid-gap: 0;

}
.DiscountProductsShelf_root__xT1D_ {
    margin-bottom: 0;
}
.Products_aside__v12a_+.Products_main__vHwR6 {
    padding-left: 0;
    max-width: 100%;
}
.ProductCard_root__K6IZK {

    padding: 0;
}
.Category_header__w816W {
    padding-top: 0;
    padding-bottom: 0;
}
.CategoryHeader_title__Xvsex {
    margin: 0;
}
.ProductCardLink_root__69qxV {
    margin: 0;
    padding: 0;
}
.ProductCard_title__iNsaD {
    margin: 0;
}
.ProductCard_root__K6IZK {
    height: auto;
}
.Products_root__n55WH {
    flex-direction: column;
}
.ProductsFilter_facets__n2w_q {
    margin-top:0;
}
.Paper_outline__3Jjeb {
    border: 0;
}
.ProductsFilter_facets__n2w_q > form {
    display: flex;
    width: 100vw;
    overflow: auto;
}
.ProductCardBadgeGroup_root__XSJe2 {
    margin: 0;
}
.DiscountProductsShelf_titleLink__eM7KP {
    margin: 0;
}
.Filter_expandContent__t46qu.Expand_content__Qb3dj {
    padding-bottom: 0;
}
.Expand_content__Qb3dj {
    padding: 0;
}
.FlatSelectSearch_option__zQ1vc.Label_root__itsfa:not(:last-child) {
    margin-bottom: 0;
}
.Filter_expandTitle__SXLjL.Expand_title__mrimw.Button_root__WicTg {
    padding:0;
}
}
`)
})();