// ==UserScript==
// @name         Whalinvest - Open/Close all box
// @namespace    Whalinvest
// @version      0.2.7.1
// @description  Improve display the bots of the bag
// @author       Mini#8586
// @match        https://app.whalinvest.com/*
// @icon         https://www.google.com/s2/favicons?domain=whalinvest.com
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/436526/Whalinvest%20-%20OpenClose%20all%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/436526/Whalinvest%20-%20OpenClose%20all%20box.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //Params area
    const CONTAINER_SELECTOR = `#root > div.container-fluid.pt-5 > div > section.col-sm-12.col-md-7 > div > section > div:nth-child(2)`;
    const PAIR_SELECTOR = `#root > div.container-fluid.pt-5 > div > section.col-sm-12.col-md-7 > div > section > div:nth-child(2) .card .card-header div.mb-1 span.ms-2.align-middle`;
    const CONTAINER_FILTERS = `#root > div.container-fluid.pt-5 > div > section.col-sm-12.col-md-7 > div > section > div:nth-child(1) > div.col-12.col-sm-8 > section`;
    const DOWN_TAG = `svg.fw-bold.ms-1.text-danger`;
    const UP_TAG = `svg.fw-bold.ms-1.text-success`;
    const GAINS_TOTAL = "section:nth-child(1) > h3.mb-0.fw-bold"
    const DELAY_INTERVAL_DETECT = 2500;
    const NAME = "Whalinvest - Open/Close all box";
    const UP_COLOR = "#0EAD69";
    const DOWN_COLOR = "#CC2936";
    const LEFT_MENU = "#root > div.container-fluid.pt-5 > div > section.col-sm-12.col-md-7 > div > section > div.row.mb-3 > div"
    const IMPOTS = true;
    const NEONS = true;

    const i18n = {
        'fr-FR': {
            btnOpen: "Ouvrir les cartes",
            btnClose: "Fermer les cartes",
            noFilters: "Pas de filtre",
            noCompatibility: `Script ${NAME} n'est pas charger ca non compatible avec le navigateur IE`,
            bagCreationDate: "Date de création :",
            afterTax: "Après taxes",
            pfu: "Cette information n'est valable que pour les résidents français en utilisant la méthode PFU.",
            graphBreakdownStrategiesTitle: "Répartition des stratégies",
            graphBreakdownTimeFramesTitle: "Répartition des TimeFrames",
            graphDefaultTitle: "Tokens dans le wallet",
            btnDisplayPaire: "Afficher toutes les paires avec disponibilité à 0",
            homePage : "Tableau de bord"

        },
        'en-EN': {
            btnOpen: "Open all cards",
            btnClose: "Close all cards",
            noFilters: "No filter",
            noCompatibility: `Script ${NAME} not loaded because not compatible on IE Browser`,
            bagCreationDate: "Creation date :",
            afterTax: "After taxes",
            pfu: "This information is only valid for French residents using the PFU method.",
            graphBreakdownStrategiesTitle: "Breakdown of strategies",
            graphBreakdownTimeFramesTitle: "Breakdown of TimeFrames",
            graphDefaultTitle: "Tokens in the wallet",
            btnDisplayPaire: "Display all pairs with disponibility as 0",
            homePage : "Dashboard"
        }
    }
    //Change key for other language
    const CURRENT_RESX = i18n["fr-FR"];

    class WebsiteTools {
        _urlGetBag = "https://api.whalinvest.com/bag";
        _cookie = this.GetCookie("appWhalinvestSession");
        constructor() {
            let _this = this;
            _this.loadHref = null;
            setTimeout(function () {
                setInterval(() => {
                    if (_this.loadHref === null || _this.loadHref != window.location.href) {
                        _this.loadHref = window.location.href;
                        _this.displayEmptyPairs();
                        _this.switchBags();
                    }
                }, DELAY_INTERVAL_DETECT)
            }, 4000)
        }
        displayEmptyPairs() {
            let _this = this;
            if (typeof (_this.displayBtn) === "undefined") {
                _this.displayBtn = document.createElement("div");
                _this.displayBtn.classList = 'col-12 border-top';
                _this.displayBtn.innerHTML = `<a class="btn btn-link btn-sm text-decoration-none me-2 w-100">${CURRENT_RESX.btnDisplayPaire}</a>`;
                $(_this.displayBtn).click(() => { $(".wallet > div.col-12.border-top").each((k, values) => $(values).css("display", "initial")); _this.displayBtn.style.display = "none"; });
                $(".wallet").append(this.displayBtn);
                $(".wallet > div.col-12.border-top").each((k, values) => $(values).css("display", $($(values)?.find("p.text-success")?.html()?.split(": ")).last()[0] == 0 ? "none" : "initial"))
            }
        }
        GetCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
        switchBags(){
            let _this = this;
            if(typeof(_this.selectBag) !== "undefined"){
                $(_this.selectBag).detach();
                _this.selectBag = undefined;
            }
            const POSITION_SELECTOR = '#root > div.container-fluid.pt-5 > div > section.col-sm-12.col-md-3 > section.left-menu.mb-2';
            _this.selectBag = document.createElement("select");
            _this.selectBag.classList = "form-select form-select-sm d-inline w-auto mt-2 mb-3";
            $(_this.selectBag).change(()=> window.location.href = _this.selectBag.value)
            var homePage = new Option( CURRENT_RESX.homePage );
            _this.selectBag.add(homePage);

            homePage.value = 'https://app.whalinvest.com/bag';

            $.ajax({
                url: _this._urlGetBag,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + _this._cookie
                },
                success: function (d) {
                   var listOfBags = d
                   .data.map((v)=> [v.id, v.label]);
                   for (let i = 0; i < listOfBags.length; i++) {
                    _this.selectBag.add(new Option(listOfBags[i][1],"/bag/" + listOfBags[i][0],false,$(window.location.pathname.split('/')).last()[0] === `${listOfBags[i][0]}`));

                    $(POSITION_SELECTOR).before(_this.selectBag);
                };
                }
            });
        }
    }
    //Plugin
    class BagsTools {
        constructor() {
            let _this = this;
            if (_this.isIE()) {
                window.console.warn(CURRENT_RESX.noCompatibility);
                return void (0);
            }

            setTimeout(function () {

                _this.btnOpen = document.createElement("button");
                _this.btnOpen.type = "button";
                _this.btnOpen.classList = "btn btn-primary ms-1 mt-2";
                _this.btnOpen.id = `t_${new Date().getMilliseconds()}`
                _this.btnOpen.innerHTML = `<span class="align-middle me-1">${CURRENT_RESX.btnOpen}</span>`;
                $(_this.btnOpen).click(() => { _this.openAllBox(true); });
                _this.btnClose = document.createElement("button");
                _this.btnClose.type = "button";
                _this.btnClose.classList = "btn btn-primary ms-1 mt-2";
                _this.btnClose.innerHTML = `<span class="align-middle me-1">${CURRENT_RESX.btnClose}</span>`;
                _this.btnClose.style.display = "none";
                $(_this.btnClose).click(() => { _this.openAllBox(false); });
                _this.btnDown = document.createElement("button");
                _this.btnDown.type = "button";
                _this.btnDown.classList = "btn btn-primary ms-1 mt-2";
                _this.btnDown.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="fw-bold ms-1 text-danger" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path></svg> <span class="align-middle me-1" id="countDown"></span>`;
                $(_this.btnDown).click(() => _this.openAllBox(true, 2));
                _this.btnUp = document.createElement("button");
                _this.btnUp.type = "button";
                _this.btnUp.classList = "btn btn-primary ms-1 mt-2";
                _this.btnUp.id = "upCards";
                _this.btnUp.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="fw-bold ms-1 text-success" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg> <span class="align-middle me-1" id="countUp"></span>`;
                $(_this.btnUp).click(() => _this.openAllBox(true, 1));
                _this.btnNeutral = document.createElement("button");
                _this.btnNeutral.type = "button";
                _this.btnNeutral.classList = "btn btn-primary ms-1 mt-2";
                _this.btnNeutral.id = "";
                _this.btnNeutral.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="fw-bold ms-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M505.04 442.66l-99.71-99.69c-4.5-4.5-10.6-7-17-7h-16.3c27.6-35.3 44-79.69 44-127.99C416.03 93.09 322.92 0 208.02 0S0 93.09 0 207.98s93.11 207.98 208.02 207.98c48.3 0 92.71-16.4 128.01-44v16.3c0 6.4 2.5 12.5 7 17l99.71 99.69c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.59.1-33.99zm-297.02-90.7c-79.54 0-144-64.34-144-143.98 0-79.53 64.35-143.98 144-143.98 79.54 0 144 64.34 144 143.98 0 79.53-64.35 143.98-144 143.98zm27.11-152.54l-45.01-13.5c-5.16-1.55-8.77-6.78-8.77-12.73 0-7.27 5.3-13.19 11.8-13.19h28.11c4.56 0 8.96 1.29 12.82 3.72 3.24 2.03 7.36 1.91 10.13-.73l11.75-11.21c3.53-3.37 3.33-9.21-.57-12.14-9.1-6.83-20.08-10.77-31.37-11.35V112c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v16.12c-23.63.63-42.68 20.55-42.68 45.07 0 19.97 12.99 37.81 31.58 43.39l45.01 13.5c5.16 1.55 8.77 6.78 8.77 12.73 0 7.27-5.3 13.19-11.8 13.19h-28.1c-4.56 0-8.96-1.29-12.82-3.72-3.24-2.03-7.36-1.91-10.13.73l-11.75 11.21c-3.53 3.37-3.33 9.21.57 12.14 9.1 6.83 20.08 10.77 31.37 11.35V304c0 4.42 3.58 8 8 8h16c4.42 0 8-3.58 8-8v-16.12c23.63-.63 42.68-20.54 42.68-45.07 0-19.97-12.99-37.81-31.59-43.39z"></path></svg><span class="align-middle me-1" id="countUp"></span>`;
                $(_this.btnNeutral).click(() => _this.openAllBox(true, 3));

                setInterval(() => {
                    if ($(`#${_this.btnOpen.id}`).length !== 1 && window.location.href.match("/bag/[0-9]{0,9000}") != null) {
                        $(CONTAINER_FILTERS).append(_this.btnOpen);
                        $(CONTAINER_FILTERS).append(_this.btnClose);
                        $(CONTAINER_FILTERS).append(_this.btnNeutral);
                        $(CONTAINER_FILTERS).append(_this.btnUp);
                        $(CONTAINER_FILTERS).append(_this.btnDown);
                        _this.colorCards();
                        _this.countUpDown();
                        _this.filtersChange();
                        _this.filtersPair(false, true);
                    }
                }, DELAY_INTERVAL_DETECT);
            }, 4000);
        }

        toggle(displayClose = false) {
            let _this = this;
            if (displayClose) {
                $(_this.btnOpen).show();
                $(_this.btnClose).hide();
            } else {
                $(_this.btnOpen).hide();
                $(_this.btnClose).show();
            }
        }
        openAllBox(open, isUp = null) {
            let _this = this;
            if (isUp !== null) {
                $(`${CONTAINER_SELECTOR} .card`).parent().hide();
                _this.toggle(true);
                _this.filtersPair(true);

                if (isUp === 1) {
                    $(`${CONTAINER_SELECTOR} .card`).parent().has(DOWN_TAG).hide();
                    $(`${CONTAINER_SELECTOR} .card`).parent().has(UP_TAG).show();

                } else if (isUp === 2) {
                    $(`${CONTAINER_SELECTOR} .card`).parent().has(UP_TAG).hide();
                    $(`${CONTAINER_SELECTOR} .card`).parent().has(DOWN_TAG).show();
                } else if (isUp === 3) {
                    $(`${CONTAINER_SELECTOR} .card`).each((k, v) => {
                        if ($(v).parent().has(UP_TAG).length === 0 && $(v).parent().has(DOWN_TAG).length === 0) {
                            $(v).parent().show();
                        }
                    })
                }
            } else {
                $(`${CONTAINER_SELECTOR} .card`).parent().show();
                _this.filtersPair(false);
                _this.toggle(!open);
            }
            $(`.card-body div.flex-row-reverse button[aria-expanded=${open ? "false]" : "true]"}`).each((k, v) => { $(v).click(); });
        }
        countUpDown() {
            let _this = this;
            $(_this.btnUp).find("span").html(`(${$(`${CONTAINER_SELECTOR} .card`).parent().has(UP_TAG).length})`);
            $(_this.btnDown).find("span").html(`(${$(`${CONTAINER_SELECTOR} .card`).parent().has(DOWN_TAG).length})`);
            $(_this.btnNeutral).find("span").html(`(${$(`${CONTAINER_SELECTOR} .card .card-body`).length - $(`${CONTAINER_SELECTOR} .card`).parent().has(DOWN_TAG).length - $(`${CONTAINER_SELECTOR} .card`).parent().has(UP_TAG).length})`);
        }
        colorCards() {
            if (NEONS) {
                $(`${CONTAINER_SELECTOR} .card`).has(UP_TAG).each((k, v) => { $(v).css("box-shadow", "0 0 15px " + UP_COLOR); });
                $(`${CONTAINER_SELECTOR} .card`).has(DOWN_TAG).each((k, v) => { $(v).css("box-shadow", "0 0 15px " + DOWN_COLOR); });
                $(`${CONTAINER_SELECTOR} .card`).css("margin-top", "10px");
            }
            else {
                $(`${CONTAINER_SELECTOR} .card`).has(UP_TAG).each((k, v) => { $(v).css("background-color", UP_COLOR); });
                $(`${CONTAINER_SELECTOR} .card`).has(DOWN_TAG).each((k, v) => { $(v).css("background-color", DOWN_COLOR); });
                $(`${CONTAINER_SELECTOR} .card .card-body span.text-danger`).parent().addClass("badge bg-secondary badge-light").css("font-size", "0.85em");
                $(`${CONTAINER_SELECTOR} .card .card-body span.text-success`).parent().addClass("badge bg-secondary badge-light").css("font-size", "0.85em");
                $(`${CONTAINER_SELECTOR} .card .card-body .mt-2.fw-bold.text-success`).addClass("badge bg-secondary badge-light").css("font-size", "0.85em");
            }
        }
        filtersChange() {
            let _this = this;
            setInterval(function () {
                _this.colorCards();
                _this.countUpDown();
            }, DELAY_INTERVAL_DETECT);
        }
        filtersPair(reset = false, createBtn = false) {
            let _this = this;
            if (reset) {
                $(_this.selectPaire.options)[0].selected = true;
                return void (0);
            }
            var _showHidePair = (pairkey) => {
                $(PAIR_SELECTOR).parents(".card").parent().hide();
                if (pairkey === "null") {
                    $(PAIR_SELECTOR).parents(".card").parent().show();
                }
                $(PAIR_SELECTOR).each((k, v) => {
                    if ($(v).html() === pairkey) {
                        $(v).parents(".card").parent().show();
                    }
                });
            };
            if (createBtn) {
                _this.selectPaire = document.createElement("select");
                _this.selectPaire.classList = "form-select form-select-sm d-inline w-25 ms-1";
                var listOfPair = $(PAIR_SELECTOR).map((idx, el) => {
                    return [el.innerText];
                }).sort();
                var noFiltersOption = new Option(CURRENT_RESX.noFilters);
                noFiltersOption.value = null;
                _this.selectPaire.add(noFiltersOption);
                for (let i = 0; i < listOfPair.length; i++) {
                    _this.selectPaire.add(new Option(listOfPair[i]));
                };

                $(CONTAINER_FILTERS).append(_this.selectPaire);
                $(_this.selectPaire).change(function () {
                    _showHidePair($(this).val());
                });
            } else {
                _showHidePair($(_this.selectPaire).val());
            }
        }
        isIE() {
            const ua = navigator.userAgent;
            return ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1;
        }
    };

    class HomeTools {
        _urlGetBag = "https://api.whalinvest.com/bag";
        _urlBot = `https://api.whalinvest.com/bag/*/bots`;
        _bagsPosBots = null;
        _homeCardSelector = "#root > div.container-fluid.pt-5 > div > section.col-sm-12.col-md-7 > div > section > div:nth-child(2) .card-body";
        _cookie = this.GetCookie("appWhalinvestSession");
        graphStratEl = null;
        graphTimeframesEl = null;
        constructor() {
            let _this = this;
            setTimeout(function () {
                setInterval(() => {
                    if (window.location.href.match("/bag$") != null) {
                        _this.GetInfosBag();
                        //_this.DisplayTaxe();
                    }
                }, DELAY_INTERVAL_DETECT);
            }, 4000);

        }

        GetInfosBag() {
            let _this = this;
            if ($(_this._homeCardSelector).find(".creationDate").length != 0) return void (0);

            $.ajax({
                url: _this._urlGetBag,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + _this._cookie
                },
                success: function (d) {
                    _this._bagsPosBots = d.data;
                    $(_this._homeCardSelector).each((k, v) => {
                        $(v).find('span').first().append(`</br><small class="align-middle fw-bold ms-2 text-muted creationDate" style="font-size: 0.675em;">${CURRENT_RESX.bagCreationDate} ${new Date(d.data[k].createdAt).toDateString()} ${new Date(d.data[k].createdAt).toTimeString().replaceAll(" ", "").replace(",", " : ").split("G")[0]}</small>`);
                    });
                    //_this.DisplayGraph(d);
                    _this.GetInfosBot();
                }
            });

        }
        GetInfosBot() {
            let _this = this;
            if (_this._bagsPosBots === null || _this._bagsPosBots.length <= 0) return void (0);

            for (let index = 0; index < _this._bagsPosBots.length; index++) {
                const element = _this._bagsPosBots[index];
                let botUrg = _this._urlBot.replace("*", element.id)
                $.ajax({
                    url: botUrg,
                    type: 'GET',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + _this._cookie
                    },
                    success: function (d) {
                        _this._bagsPosBots[index].bots = d.data
                    }
                });
            }
            window.kk = _this._bagsPosBots;


        }
        GetCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
        //From @Thomas🚀#6243
        DisplayTaxe() {
            if ($(GAINS_TOTAL + "> span").length == 0 && IMPOTS) {
                $.ajax({
                    url: "https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT",
                    type: "GET",
                    contentType: "application/json",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    success: function (data) {
                        const price = parseFloat(data["price"], 10);
                        const gain_to_float = parseFloat($(GAINS_TOTAL).text().replace("$", ""), 10);
                        const gain_apres_impots = gain_to_float - (30 / 100) * gain_to_float;
                        const gain_apres_impots_eur = gain_apres_impots / price;
                        $(GAINS_TOTAL).append(`<br>
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="30"><rect width="45" height="30" fill="#ED2939"/><rect width="30" height="30" fill="#fff"/><rect width="15" height="30" fill="#002395"/></svg>
                    <span>${CURRENT_RESX.afterTax} : ${gain_apres_impots_eur.toFixed(2)}€ (-30%)</span>
                    <br>
                    <span>${CURRENT_RESX.pfu}</span>
                    `);
                        $(GAINS_TOTAL + "> span").css("font-size", "0.85em");
                        $(GAINS_TOTAL + "> span:nth-child(5)").css("font-size", "0.50em");
                    }
                });
            }
        }
        //From @Thomas🚀#6243
        DisplayGraph(data) {
            const targetPushGraph = $(LEFT_MENU).parents(".row.mb-2").first();
            let newGraphCardContainer = document.createElement("div");
            newGraphCardContainer.classList = "col-12 mt-3";
            newGraphCardContainer.style = "max-height:340px;";
            newGraphCardContainer.id = "GraphContainer";
            newGraphCardContainer.innerHTML = `<div class="card text-center">
            <div class="card-body row">
                <div class="col">
                    <h3>${CURRENT_RESX.graphBreakdownStrategiesTitle}</h3>
                    <div style="position: relative; width: 250px;margin:auto;">
                        <canvas id="strategies-chart" height="235"></canvas>
                    </div>
                </div>
                <div class="col">
                    <h3>${CURRENT_RESX.graphBreakdownTimeFramesTitle}</h3>
                    <div style="position: relative; width: 250px;margin:auto;">
                        <canvas id="tf-chart" height="235"></canvas>
                    </div>
                    </div>
                </div>
            </div>`;
            $("#GraphContainer").detach();
            targetPushGraph.append(newGraphCardContainer);
            let _this = this;
            let strats = {};
            let tickerInterval = {}
            for (let i = 0; i < data['data'].length; i++) {
                data["data"][i]['bots'].forEach(element => {
                    if (tickerInterval[element['tickerInterval']] == undefined) {
                        tickerInterval[element['tickerInterval']] = 1;
                    }
                    else {
                        tickerInterval[element['tickerInterval']]++;
                    }
                    if (strats[element['strategy']] == undefined) {
                        strats[element['strategy']] = 1;
                    }
                    else {
                        strats[element['strategy']]++;
                    }
                });
            }
            var ctx_strats = document.getElementById('strategies-chart').getContext('2d');
            _this.graphStratEl = new Chart(ctx_strats, {
                type: 'doughnut',
                options: {
                    responsive: true
                },
                data: {
                    labels: Object.keys(strats),
                    datasets: [{
                        label: CURRENT_RESX.graphDefaultTitle,
                        data: Object.values(strats),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
            });
            var ctx_tf = document.getElementById('tf-chart').getContext('2d');
            _this.graphTimeframesEl = new Chart(ctx_tf, {
                type: 'doughnut',
                options: {
                    responsive: true
                },
                data: {
                    labels: Object.keys(tickerInterval),
                    datasets: [{
                        label: CURRENT_RESX.graphDefaultTitle,
                        data: Object.values(tickerInterval),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
            });
        }
    };

    //Start plugin inner bag
    new BagsTools();
    //Start plugin dashboard
    new HomeTools();
    //Start plugin for all page
    new WebsiteTools();

})();