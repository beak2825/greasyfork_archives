// ==UserScript==
// @name         [smshub.org] Настройка цен
// @namespace    tuxuuman:smsclub.org:helper
// @version      2.4
// @description  Автоматическая настройка цен сервисов
// @author       tuxuuman<tuxuuman@gmail.com, vk.com/tuxuuman>
// @match        https://agent.smshub.org/dashboard/*
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addElement
// @grant        GM_listValues
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439068/%5Bsmshuborg%5D%20%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%D1%86%D0%B5%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/439068/%5Bsmshuborg%5D%20%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%D1%86%D0%B5%D0%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const logger = {
        log: console.log.bind(console, `[${GM_info.script.name}]`),
        warn: console.warn.bind(console, `[${GM_info.script.name}]`),
        error: console.error.bind(console, `[${GM_info.script.name}]`),
    }

    alert = unsafeWindow.alert.bind(unsafeWindow);
    prompt = unsafeWindow.prompt.bind(unsafeWindow);

    const statusBar = $(`<div style="display: none; background: lightblue; padding: 10px; border: 1px solid black; color: black; position: fixed; right: 25px; bottom: 25px"</div>`);
    $('body').append(statusBar);

    function showStatus(text, type = 'log') {
        if (logger[type]) {
            logger[type]?.("[STATUS]", text);
        } else {
            logger.log("[STATUS]", type, text)
        }
        statusBar.text(text);
        statusBar.show();
    }

    function hideStatus() {
        statusBar.hide();
    }

    function asyncPause(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    function getServices() {
        return fetch("/api.php", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "body": "cat=scripts&act=manageCost&asc=getServicesByOperator&country=0",
            "method": "POST",
        })
            .then(r => r.json())
            .then(r => r.data.map(e => {
            return {
                id: e.service,
                name: e.text.toLowerCase(),
                maxPrice: e.max,
                price: +e.cost,
                minCost: +e.min
            }
        }).filter(s => GM_getValue(s.name)?.mode != "ignore"));
    }

    function getOnlineSimcards() {
        const sp = new URLSearchParams("draw=1&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=desc&start=0&length=100&search%5Bvalue%5D=&search%5Bregex%5D=false&act=simcards&cat=tables&str=onlyOnline&rangeFrom=2022-01-14+14%3A33%3A23&rangeTo=2022-01-22+14%3A33%3A23");
        sp.set('rangeTo', (new Date()).toLocaleString().replace(', ', ' '));
        sp.set('rangeFrom', (new Date(Date.now() - (24 * 60 * 60 * 1000) * 14)).toLocaleString().replace(', ', ' '));

        return fetch("/api.php", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "method": "POST",
            "body": sp
        })
            .then(r => r.json())
            .then(r => r.data?.map(e => ({
            phone: e[0]?.match(/>(\d+)/)?.[1],
            port: e[3]
        })));
    }

    function getSimcardServices(phone) {
        const sp = new URLSearchParams("draw=1&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=desc&start=0&length=100&search%5Bvalue%5D=&search%5Bregex%5D=false&act=agentSimcardTable&cat=tables&str=123456");
        sp.set('str', phone);
        return fetch("/api.php", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "method": "POST",
            "body": sp
        })
            .then(r => r.json())
            .then(r => r.data?.map(e => ({
            id: e[0],
            status: e[4].includes('Отменено') ? 'canceled' : e[4].includes('Успешно') ? 'success' : 'unknown'
        })));
    }

    function dropService(serviceId) {
        const sp = new URLSearchParams("cat=scripts&act=manageSimcards&asc=dropService&activationId=123456");
        sp.set('activationId', serviceId);

        return fetch("/api.php", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            "method": "POST",
            "body": sp
        })
            .then(r => r.json());
        /*
        example response data:
        { msg: "Номер 79019150429, сервис \"hw\" доступен для продажи в данный момент",
        status: "success" }
        */
    }

    // возврат отмененных сервисов в продажу
    async function returnAllCanceledServices() {
        try {
            showStatus("Начинаем возврат сервисов в продажу. Логи можно посмотреть нажав F12");
            await asyncPause(3000);
            const onlineSimcards = await getOnlineSimcards();
            logger.log("Найдено симкарт онлайн:", onlineSimcards);
            showStatus("Симкарт онлайн: " + onlineSimcards.length);

            for (let sim of onlineSimcards) {
                showStatus(`Запрашиваем сервисы для симкарты "${sim.phone}"`);
                const simcardServices = (await getSimcardServices(sim.phone)).filter(s => s.status == 'canceled');
                logger.log("Отмененные сервисы:", simcardServices);
                showStatus(`Найдено "${simcardServices.length}" отключенных сервисов для симкарты "${sim.phone}". Включаем их`);

                for (let service of simcardServices) {
                    const resp = await dropService(service.id);
                    if (resp.status == "success") {
                        showStatus(`Сервис "${service.id}" успешно отключен!`);
                    } else {
                        showStatus(`Не удалось отключить сервис "${service.id}". ${resp.msg}`, 'error');
                    }
                }
            }
            showStatus("Возврат сервисов в продажу завершен!");
        } catch (err) {
            showStatus("Ошибка возвращения сервисов в продажу: " + err.message, "error");
            logger.error(err);
        }
    }

    // сброс цен сервисов на максимальные
    async function resetServices() {
        try {
            showStatus("Начинаем сброс сервисов. Логи можно посмотреть нажав F12");
            await asyncPause(3000);
            const services = await getServices();
            logger.log("Найдены сервисы:", services);

            for (let service of services) {
                showStatus(`Сбрасываем сервис "${service.name}" c "${service.price}" на "${service.maxPrice}"`);

                const body = new FormData();
                body.append('cat', 'scripts');
                body.append('act', 'manageCost');
                body.append('asc', 'setReward');
                body.append('country', '0');
                body.append('service', service.id);
                body.append('cost', service.maxPrice);

                try {
                    await fetch('https://agent.smshub.org/api.php', {
                        method: 'POST',
                        body: body
                    });
                } catch (err) {
                    showStatus("Не удалось сбросить сервис" + service.name, "error");
                    logger.error(err);
                }
            }
            showStatus("Сброс сервисов завершен!");
        } catch (err) {
            showStatus("Сброс сервисов завершен ошибкой: " + err.message, "error");
            logger.error(err);
        }
    }

    // установка минимальных цен сервисов
    async function setMinimalPriceServices() {
        try {
            showStatus("Начинаем установку минимальных цен. Логи можно посмотреть нажав F12");
            await asyncPause(3000);
            const services = await getServices();
            logger.log("Найдены сервисы:", services);

            for (let service of services) {
                const serviceCfg = GM_getValue(service.name);
                let cost = serviceCfg?.mode === "fixed" ? serviceCfg.price : service.minCost;
                if (cost < service.minCost) {
                    cost = service.minCost;
                } else if (cost > service.maxPrice) {
                    cost = service.maxPrice;
                }
                showStatus(`Меняем цену сервиса "${service.name}" c "${service.price}" на "${cost}"`);
                try {
                    const body = new FormData();
                    body.append('cat', 'scripts');
                    body.append('act', 'manageCost');
                    body.append('asc', 'setReward');
                    body.append('country', '0');
                    body.append('service', service.id);
                    body.append('cost', cost);

                    await fetch('https://agent.smshub.org/api.php', {
                        method: 'POST',
                        body: body
                    });

                    logger.log("Настройка сервиса", service.name, "успешно завершена!");
                } catch (err) {
                    showStatus("Ошибка настройки сервиса " + service.name, "error");
                    logger.error(err.message);
                }
            }
            showStatus("Установка минимальных цен завершена!");;
        } catch (err) {
            showStatus("Скрипт завершен ошибкой: " + err.message, "error");
            logger.error(err);
        }
    }

    // процентное имзенение цен сервисов
    async function changePriceServicesPercent(pc) {
        try {
            showStatus("Начинаем процентное изменение цен. Логи можно посмотреть нажав F12");
            await asyncPause(3000);
            const services = await getServices();
            logger.log("Найдены сервисы:", services);

            for (let service of services) {
                const serviceCfg = GM_getValue(service.name);
                let cost = serviceCfg?.mode === "fixed" ? serviceCfg.price : +(service.price * ((pc / 100) + 1)).toFixed(2);

                if (cost < service.minCost) {
                    cost = service.minCost;
                } else if (cost > service.maxPrice) {
                    cost = service.maxPrice;
                }

                showStatus(`Меняем цену сервиса "${service.name}" на ${pc}%, c "${service.price}" на "${cost}"`);

                const body = new FormData();
                body.append('cat', 'scripts');
                body.append('act', 'manageCost');
                body.append('asc', 'setReward');
                body.append('country', '0');
                body.append('service', service.id);
                body.append('cost', cost);

                try {
                    await fetch('https://agent.smshub.org/api.php', {
                        method: 'POST',
                        body: body
                    });
                } catch (err) {
                    logger.warn("Не удалось изменить цену сервиса", service.name);
                    logger.error(err);
                }
            }
            showStatus("Процентное изменение цен завершено!");
        } catch (err) {
            showStatus("Скрипт завершен ошибкой: " + err.message, "error");
            logger.error(err);
        }
    }

    function reloadServices() {
        unsafeWindow.$('#countriesRow>button').click();
    }

    GM_registerMenuCommand("Минимальные цены", async function () {
        await setMinimalPriceServices();
        reloadServices();
        alert("Скрипт завершен!");
    }, "S");

    GM_registerMenuCommand("Сброс сервисов", async function () {
        await resetServices();
        reloadServices();
        alert("Скрипт завершен!");
    }, "R");

    GM_registerMenuCommand("Процентное повышение", async function () {
        let pc = prompt("Введите процент повышения. Можно указать со знаком минус (-10), тогда цены будут понижены", "1");

        if (Number.isNaN(+pc) || pc > 100 || pc < -100) {
            return alert("Ошибка. Нужно вводить число от -100 до 100");
        }
        await changePriceServicesPercent(+pc);
        reloadServices();
        alert("Скрипт завершен!");
    }, "P");

    GM_registerMenuCommand("Возврат в продажу", async () => {
        await returnAllCanceledServices();
        alert("Скрипт завершен!");
    });

    $('body').append(`
<div id="app" class="modal" style="background: rgba(0, 0, 0, 0.5" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Автоматизация</h5>
        <button type="button" class="btn-close" @click="hide" v-if="!started">x</button>
      </div>
      <div class="modal-body">
        <div class="card-text" v-if="!started">
          <div class="card mb-3">
            <div class="card-body">
              <b class="card-title d-block mb-2">Регулировка цен</b>
              <div class="card-text">
                <div class="mb-3">
                  <label class="form-label">
                    Процент изменения
                    (<b>от -100 до 100</b>)
                  </label>
                  <input type="number" max="100" min="-100" step="1" class="form-control" v-model="settings.autoPrice.pc">
                </div>

                <div>
                  <label class="form-label">
                    Периодичность запуска
                    (<b>кол-во минут</b>)
                  </label>
                  <input type="number" max="100" min="-100" step="1" class="form-control" v-model="settings.autoPrice.duration">
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <b class="card-title d-block mb-2">Восстановление сервисов</b>
              <div class="card-text">
                <div class="mb-3">
                  <div class="mb-3">
                    <label class="form-label">
                      Периодичность запуска
                      (<b>кол-во минут</b>)
                    </label>
                    <input type="number" max="100" min="-100" step="1" class="form-control" v-model="settings.resetSerivice.duration">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-success btn-sm mt-3" @dblclick="start" title="Двойной щелчек для активации">Запуск</button>
        </div>
        <div class="card-text" v-else>
          <div>
            <strong>{{statusText}}</strong>
          </div>
          <div class="d-flex justify-content-center mt-3">
            <div class="spinner-border text-primary" role="status">
            </div>
          </div>
          <div class="d-flex justify-content-center mt-3">
            <button class="btn btn-secondary btn-sm" @dblclick="stop" title="Двойной щелчек для активации">Остановить</button>
          </div>

        </div>
      </div>
    </div>
  </div>
    `);

    const app = new Vue({
        el: "#app",
        data: () => ({
            visible: true,
            started: false,
            statusText: "",
            settings: {
                autoPrice: {
                    pc: -10,
                    duration: 30
                },
                resetSerivice: {
                    duration: 60
                }
            },
            tasks: [],
            activeTask: null,
            tasksTimer: null
        }),
        watch: {
            settings: {
                deep: true,
                handler: function(s) {
                    GM_setValue("automatizatorSettings", JSON.stringify(s));
                }
            }
        },
        mounted() {
            try {
                this.settings = JSON.parse(GM_getValue("automatizatorSettings"));
            } catch (err) {
                console.error("Не удалось загрузить настройки автоматизатора");
            }
        },
        methods: {
            show() {
                this.$el.style.display = "block";
            },
            hide() {
                this.$el.style.display = "none";
                this.stop();
            },
            getNextTask() {
                const now = new Date();
                return this.tasks.find((t) => t.date <= now);
            },
            async startTask(task) {
                this.activeTask = task;
                this.$set(task, "startedAt", new Date());
                try {
                    console.log("Запускаем задачу", task.name);
                    if (typeof task?.job == "function") {
                        await task.job();
                    }
                } catch (error) {
                    console.error("Возникла ошибка во время работы задачи", {
                        error,
                        task
                    });
                } finally {
                    this.tasks = this.tasks.filter((t) => t != task);
                    this.activeTask = null;
                    console.log("Завершаем выполнение задачи", task.name);
                }
            },
            stopTasksTimer() {
                clearInterval(this.tasksTimer);
            },
            runTasksTimer() {
                this.stopTasksTimer();
                this.tasksTimer = setInterval(() => {
                    if (!this.activeTask) {
                        const nextTask = this.getNextTask();
                        if (nextTask) {
                            this.startTask(nextTask);
                        } else {
                            const tasksIds = this.tasks.map((t) => t.id);

                            if (!tasksIds.includes("autoPrice")) {
                                this.tasks.push({
                                    id: "autoPrice",
                                    job: () => changePriceServicesPercent(this.settings.autoPrice.pc).finally(() => reloadServices()),
                                    name: "Регулировка цен",
                                    date: new Date(
                                        Date.now() + this.settings.autoPrice.duration * 60 * 1000
                                    )
                                });
                            }

                            if (!tasksIds.includes("resetSerivice")) {
                                this.tasks.push({
                                    id: "resetSerivice",
                                    job: () => returnAllCanceledServices(),
                                    name: "Восстановление сервисов",
                                    date: new Date(
                                        Date.now() + this.settings.resetSerivice.duration * 60 * 1000
                                    )
                                });
                            }

                            const nearTask = this.tasks.sort((a, b) => a.date - b.date)[0];
                            if (nearTask) {
                                this.statusText = `Ближайшая задача "${
                nearTask.name
                            }" будет запущена через ${Math.round(
                                    (nearTask.date.getTime() - Date.now()) / 1000
                                )} сек`;
                            }
                        }
                    } else {
                        this.statusText = `Выполняем задачу "${
            this.activeTask.name
                    }" ${Math.round(
                            (Date.now() - this.activeTask.startedAt.getTime()) / 1000
                        )} сек.`;
                    }
                }, 1000);
            },
            start() {
                this.started = true;
                this.statusText = "Скрипт запущен!";
                this.runTasksTimer();
            },
            stop() {
                this.stopTasksTimer();
                this.tasks = [];
                this.activeTask = null;
                this.started = false;
                this.statusText = "Скрипт отстановлен";
            }
        }
    });

    GM_registerMenuCommand("Автоматизация", () => {
        app.show();
    });

    GM_registerMenuCommand("Сброс настроек", () => {
        if (confirm("Вы уверены что хотите сбрсоить все найстройки?")) {
            GM_listValues().forEach(key => GM_deleteValue(key));
            location.reload();
        }
    });

    function prompt(title, defValue = "") {
        let pEl = $('#promptDialog');

        if (!pEl.length) {
            pEl = $(`
 <div class="modal" tabindex="-1" role="dialog" id="promptDialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="promptTitle">${title}</h5>
      </div>
      <div class="modal-body">
        <textarea class="form-control" id="promptTextarea" rows="3"></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="promptOkBtn">OK</button>
      </div>
    </div>
  </div>
</div>
            `);
            pEl.hide();
            $('body').append(pEl);
        }

        const pTextarea = pEl.find('#promptTextarea');
        pTextarea.val(defValue);
        pEl.find('#promptTitle').text(title);

        return new Promise((res, rej) => {
            pEl.find('#promptOkBtn')[0].onclick = () => {
                pEl.hide();
                res(pTextarea.val());
            }

            pEl.show();
        });
    }


    GM_registerMenuCommand("Экспорт настроек", () => {
        prompt("Экспорт настроек", JSON.stringify(Object.fromEntries((GM_listValues().map(key => [key, GM_getValue(key)])))));
    });

    GM_registerMenuCommand("Импорт настроек", async () => {
        const rawSettings = await prompt("Импорт настроек");
        try {
            const settings = JSON.parse(rawSettings);
            for (let key in settings) {
                GM_setValue(key, settings[key]);
            }
            alert("Настройки успешно импортированы!");
            location.reload();
        } catch (err) {
            alert("Не удалось импортировать настройки. " + err.message);
        }
    });

    $._oldAjax =  $.ajax
    $.ajax = function(cfg) {
        if (cfg.data?.asc == 'getServicesByOperator') {
            const oldSuccess = cfg.success;
            cfg.success = function(data) {
                oldSuccess(data);
                $('.serviceCard').each((_, e) => {
                    const sCard = $(e);
                    const slider = sCard.find('input.sliderClass');
                    const serviceName = sCard.find('img').eq(0).parent().text().toLowerCase();
                    const select = $(`
    <select class="custom-select">
        <option value="default">По умолчанию</option>
        <option value="ignore">Игнорировать</option>
        <option value="fixed">Фиксацированная цена</option>
    </select>`);
                    let serviceCfg = GM_getValue(serviceName);

                    if (!serviceCfg) {
                        serviceCfg = {
                            price: +slider.val(),
                            mode: "default"
                        }
                        GM_setValue(serviceName, serviceCfg);
                    }

                    const fixedPriceInput = $(`<input type="number" class="form-control" value="${serviceCfg.price}"/>`);
                    fixedPriceInput.hide();

                    select.on("change", ({ target }) => {
                        serviceCfg.mode = target.value;
                        switch (target.value) {
                            case "default": {
                                GM_deleteValue(serviceName);
                                fixedPriceInput.hide();
                            } break;

                            case "ignore": {
                                fixedPriceInput.hide();
                            } break;

                            case "fixed": {
                                serviceCfg.price = +fixedPriceInput.val();
                                fixedPriceInput.show();
                            } break;
                        }
                        GM_setValue(serviceName, serviceCfg);
                    });

                    select.val(serviceCfg.mode).change();

                    fixedPriceInput.on("input", (e) => {
                        serviceCfg.price = +e.target.value;
                        GM_setValue(serviceName, serviceCfg);
                    });

                    sCard.append(`<div class="mb-1">Ругилировка цен</div>`).append(select).append(fixedPriceInput);
                })
            }
        }
        return this._oldAjax(cfg);
    }
})();