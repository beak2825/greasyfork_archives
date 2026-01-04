// ==UserScript==
// @name         HWM-UI-UX-MOD-1180
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mod
// @author       achepta, mod Vlady Lesh
// @match        http://*/*
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/425656/HWM-UI-UX-MOD-1180.user.js
// @updateURL https://update.greasyfork.org/scripts/425656/HWM-UI-UX-MOD-1180.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    if (/cgame/.test(location.href)) {
        return
    }

    class LocalizedTextMap {
        constructor() {
            this.allTexts = new Map()
        }

        addText(localizedText) {
            this.allTexts[localizedText.id] = localizedText
        }

        getTranslation(id, locale) {
            return this.allTexts[id][locale]
        }
    }

    class LocalizedText {
        constructor(id, en = null, ru = null, ua = null) {
            this.id = id;
            this.en = en;
            this.ru = ru;
            this.ua = ua;
        }
    }

    let allTexts = getAllTexts()
    let defaultSettings = getDefaultSettings()

    let language = /lordswm/.test(location.href) ? "en" : navigator.language.includes("uk") ? "ua" : "ru"
    let settings = {}
    let headerInfo = {}
    let timersInfo = {}
    let host = location.host;
    let my_sign = get("my_sign", null)
    if (!my_sign) {
        setMySign()
    }

    loadSettings();
    loadTimersInfo();

    if (settings['isDarkTheme'] && !/war\.php/.test(location.href)) {
        // applyDarkTheme()
    }
    document.addEventListener("DOMContentLoaded", () => {
        if (!/war\.php/.test(location.href)) {
            processPage()
            addStyle();
            processHeader()
            drawNewHeader()
            processSettings();
            addMenu();
        } else {
            processBattle()
        }
    });


    function addStyle() {
        document.body.insertAdjacentHTML("beforeend", getStyles())
    }

    function addMenu() {
        $('hwm_header_settings_button').addEventListener('click', handleOnSettingsButtonClick);
    }


    // logic
    function processSettings() {
        if (settings.isTimeWithSeconds) {
            showTimeWithSeconds()
        }
        if (settings.isShowTimers) {
            showTimers()
        }
        if (settings.isQuickFactionChange) {
            showFactions()
        }
    }

    function processHeader() {
        headerInfo.logo = getHeaderLogo()
        headerInfo.mana_amount = getManaAmount()
        headerInfo.notifications = getHeaderNotifications()
        headerInfo.homeColor = getHomeButtonColor()
        headerInfo.battleColor = getBattleButtonColor()
        headerInfo.resources = getHeaderResources()
        headerInfo.online = getHwmOnline()
    }

    function getHeaderLogo() {
        return document.querySelector("div.sh_logo > img").src
    }

    function getManaAmount() {
        return $('mana_amount').textContent
    }

    function getHeaderNotifications() {
        return Array.from(document.getElementsByClassName("NotificationIcon"))
    }

    function getHomeButtonColor() {
        return document.querySelector("#MenuHome").offsetParent.classList.value.split("_").slice(-1)[0]
    }

    function getBattleButtonColor() {
        return document.querySelector("#MenuBattles").offsetParent.classList.value.split("_").slice(-1)[0]
    }

    function getHeaderResources() {
        let resources = {}
        let resourceDivs = document.querySelectorAll("div.sh_ResourcesItem")
        Array.from(resourceDivs).forEach(item => {
            let resName = getResNameFromImage(item.firstChild.src)
            resources[resName] = item.lastChild.textContent
        })
        return resources
    }

    function getResNameFromImage(src) {
        return src.match(/(\w+)\.png/)[1]
    }

    function getHwmOnline() {
        return document.querySelector("div.sh_extra.sh_extra_right > div.mm_extra_separator").nextElementSibling.textContent
    }

    function drawNewHeader() {
        removeElement($('hwm_header'))
        document.body.insertAdjacentHTML('afterbegin', getNewHeaderTemplate())
        $(`notifications`).insertAdjacentHTML("beforeend", getNotificationsTemplate())
        $(`ResourcesPanel`).insertAdjacentHTML("beforeend", getResourcesTemplate())

        let heartData = document.body.textContent.match(/top_line_draw_canvas_heart\((\d{1,3}), (\d{1,3}), (\d{1,3})(\.\d{1,9})?\);/)
        let top_line_draw_canvas_heart = function (heart_param, max_heart_param, time_heart_param) {
            let heart = heart_param;
            let time_heart = time_heart_param;

            function draw() {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.scale(1, 1);
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.shadowBlur = 0;
                context.clearRect(0, 0, h_width, h_height);
                context.translate(h_width / 2, h_height / 2);
                context.scale(siz / 100, siz / 100);
                context.drawImage(image2, -h_width / 2, -h_height / 2);
                context.clearRect(-h_width / 2, -h_height / 2 + 5, h_width, (100 - perc) * 25 / 100 * 2);
                context.drawImage(image1, -h_width / 2, -h_height / 2);
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.scale(1, 1);
            }

            function run_top_line_heart_timer() {
                perc = Math.min(100, Math.floor(heart + 100 / time_heart * ((new Date().getTime() - startTime) / 1000)));
                if (perc !== perc_old) {
                    document.getElementById("health_amount").innerHTML = perc;
                    perc_old = perc;
                }
                if (perc === 100) {
                    siz -= plus;
                    if (siz > 90) {
                        plus = plus * 1.03;
                    } else {
                        plus = -2;
                    }
                    if (siz > 100) {
                        plus = 0.4;
                        siz = 100;
                    }
                }
                draw();
                window.setTimeout(run_top_line_heart_timer, timer_interval);
            }

            function check_all_load() {
                if (image_loader === 2) {
                    run_top_line_heart_timer();
                }
            }

            let startTime = new Date().getTime();
            let h_width = 64;
            let h_height = 64;
            let theCanvas = document.getElementById("my_heart");
            let timer_interval = 40;

            if (!theCanvas || !theCanvas.getContext) return;
            let context = theCanvas.getContext("2d");
            let image1 = new Image();
            let image2 = new Image();
            let image_loader = 0;
            let siz = 100;
            let plus = 0.4;
            let perc = 0;

            image1.onload = function () {
                image_loader++
                check_all_load();
            }

            image2.onload = function () {
                image_loader++
                check_all_load();
            }
            let perc_old = -1;
            image1.src = top_line_im_server_url + "i/health_n_empty.png";
            image2.src = top_line_im_server_url + "i/health_n.png";
        }
        top_line_draw_canvas_heart(parseInt(heartData[1]), parseInt(heartData[2]), parseInt(heartData[3]))
        unsafeWindow.top_line_add_events_listeners()
    }

    function showTimeWithSeconds() {
        let hwmDate = hwmDateToHuman(getHwmDate());
        let timePlace = $('hwm_time');
        timePlace.innerHTML = hwmDate
        setTimeout(showTimeWithSeconds, 1000)
    }

    function showTimers() {
        $('timers_container').innerHTML = getTimersTemplate()
        setTimeout(showTimers, 1000)
    }

    function showFactions() {
        let allClasses = [
            [1, 'Рыцарь', 0, 'r1.png', 1],
            [1, 'Рыцарь света', 1, 'r101.png', 101],
            [2, 'Некромант', 0, 'r2.png', 2],
            [2, 'Некромант - повелитель смерти', 1, 'r102.png', 102],
            [3, 'Маг', 0, 'r3.png', 3],
            [3, 'Маг - разрушитель', 1, 'r103.png', 103],
            [4, 'Эльф', 0, 'r4.png', 4],
            [4, 'Эльф - заклинатель', 1, 'r104.png', 104],
            [5, 'Варвар', 0, 'r5.png', 5],
            [5, 'Варвар крови', 1, 'r105.png', 105],
            [5, 'Варвар - шаман', 2, 'r205.png', 205],
            [6, 'Темный эльф', 0, 'r6.png', 6],
            [6, 'Темный эльф - укротитель', 1, 'r106.png', 106],
            [7, 'Демон', 0, 'r7.png', 7],
            [7, 'Демон тьмы', 1, 'r107.png', 107],
            [8, 'Гном', 0, 'r8.png', 8],
            [8, 'Гном огня', 1, 'r108.png', 108],
            [9, 'Степной варвар', 0, 'r9.png', 9],
            [10, 'Фараон', 0, 'r10.png', 10]
        ];
        let factions_container = $('factions_container')
        allClasses.forEach((clazz, index) => {
            let factionIcon = `<div id="fc${index}">
									<img class="faction-icon-mod" src="https://dcdn.heroeswm.ru/i/f/${allClasses[index][3]}?v=1.1" alt="${allClasses[index][1]}">
								</div>`
            factions_container.insertAdjacentHTML("beforeend", factionIcon)
            $(`fc${index}`).addEventListener("click", () => {
                changeFactionAndClass(allClasses[index][4]);
            });
        })
    }

    function changeFactionAndClass(fr) {
        doGet(`https://${host}/castle.php?change_clr_to=${fr}&sign=${my_sign}`, () => {
            location.reload()
        });
    }

    function applyDarkTheme() {
        document.head.insertAdjacentHTML("beforeend", getDarkStyles())

    }

    function showEmptyBackground() {
        document.body.insertAdjacentHTML('beforeend', getEmptyBackgroundTemplate());
        $('empty_background').addEventListener('click', handleOnBackgroundClick);
    }

    function hideEmptyBackground() {
        removeElement($('empty_background'))
    }

    function showSettings() {
        document.body.insertAdjacentHTML('beforeend', getSettingsTemplate())
        fillSettings()
    }

    function fillSettings() {
        let settingsField = $('hwm_header_settings');
        for (const [key, value] of Object.entries(settings)) {
            settingsField.insertAdjacentHTML("beforeend",
                `<div id="${key}">
                            <input id="${key}_checkbox" type="checkbox" ${value ? ' checked' : ''}>
                            <label for="${key}_checkbox">${getTranslation(key)}</label>
                        </div>
                    `)
            $(`${key}`).addEventListener('click', () => {
                handleSettingsChange(key)
            })
        }
    }

    function hideSettings() {
        removeElement($('hwm_header_settings'))
    }

    function processButtonDropDown(buttonInfo) {
        if (buttonInfo.id === "MenuInventory" || buttonInfo.id === "Menu1180" || buttonInfo.id === "MenuTavern" ) {
            return
        }
        let target = $(buttonInfo.id + "_expandable")
        if (buttonInfo.id === "MenuBattles") {
            Array.from(target.getElementsByTagName('a')).slice(8).forEach(item => {
                buttonInfo.dropDown.push([item.textContent, item.href, true])
            })
        }
        target.innerHTML = ''
        buttonInfo.dropDown.forEach(item => {
            if (item.length > 2) {
                target.insertAdjacentHTML('beforeend', `<a href="${item[1]}" style="text-decoration:none;"><div class="sh_dd_container_red">${item[0]}</div></a>`)
            } else {
                target.insertAdjacentHTML('beforeend', `<a href="${item[1]}" style="text-decoration:none;"><div>${getTranslation(item[0])}</div></a>`)
            }
        })
        target.insertAdjacentHTML("beforeend", `<img src="https://dcdn.heroeswm.ru/i/new_top/mm_dd_decorM.png" class="mm_decor2" alt="">`)
        target.insertAdjacentHTML("beforeend", `<img src="https://dcdn.heroeswm.ru/i/new_top/mm_dd_decorT.png" class="mm_decor3" alt="">`)
    }

    function processPage() {
        if (/home/.test(location.href)) {
            let isPremium = document.body.innerHTML.match(/star.gif/)
            timersInfo.isPremium = !!isPremium
        }
        if (/object_do/.test(location.href)) {
            if (document.body.textContent.match(/(successfully|устроены)/)) {
                timersInfo.labor_guild_timer_data = getHwmDate()
            }
        }

        if (/mod_workbench/.test(location.href)) {
            if (document.body.textContent.match(/(Under repair|В ремонте)/)) {
                let totalTimeLeftInMillis = 0;
                let timeMatches = document.body.textContent.match(/В ремонте: еще (\d{1,2} ч\. )?(\d{1,2} мин)/)
                if (!timeMatches) {
                    timeMatches = document.body.textContent.match(/Under repair another (\d{1,2} h\. )?(\d{1,2} min)/)

                }
                if (timeMatches[1]) {
                    totalTimeLeftInMillis += (timeMatches[1].match(/\d{1,2}/) - 0) * 3600 * 1000
                }
                if (timeMatches[2]) {
                    totalTimeLeftInMillis += (timeMatches[2].match(/\d{1,2}/) - 0 + 1) * 60 * 1000
                }
                timersInfo.smith_guild_timer_data = new Date(getHwmDate().getTime() + totalTimeLeftInMillis)
            }
        }
         if (/mercenary_guild/.test(location.href)) {
            if (document.body.textContent.match(/(Come back in|Приходи через )/)) {
                let totalTimeLeftInMillis = 0;
                let timeMatches = document.body.textContent.match(/Приходи через (\d{1,2} мин)/)
                if (!timeMatches) {
                    timeMatches = document.body.textContent.match(/Come back in (\d{1,2} min)/)

                }
                if (timeMatches[1]) {
                    totalTimeLeftInMillis += (timeMatches[1].match(/\d{1,2}/) - 0 + 1) * 60 * 1000
                }
                timersInfo.mercenary_guild_timer_data = new Date(getHwmDate().getTime() + totalTimeLeftInMillis)
            }
        }
        if (timersInfo.leader_guild_timer_data && !timersInfo.leader_guild_timer_data.timeSet) {
            timersInfo.leader_guild_timer_data.timeSet = getHwmDate()
        } else if (timersInfo.thief_guild_timer_data && !timersInfo.thief_guild_timer_data.timeSet) {
            timersInfo.thief_guild_timer_data.timeSet = getHwmDate()
        } else if (timersInfo.hunt_guild_timer_data && !timersInfo.hunt_guild_timer_data.timeSet) {
            timersInfo.hunt_guild_timer_data.timeSet = getHwmDate()
        }
        set("timers_data", timersInfo)
    }

    function processBattle() {
        let battleData = unsafeWindow.run_all.toString()
        let battleType = battleData.match(/btype\|(\d{1,10})/)[1]
        let battlePlayer = battleData.match(/plid1\|(\d{1,10})/)[1]
        let battleId = new URLSearchParams(window.location.search).get("warid")
        if (battlePlayer === getCookie("pl_id")) {
            if (battleType === "127") {
                if ("leader_guild_timer_data" in timersInfo) {
                    if (timersInfo.leader_guild_timer_data.battleId < battleId) {
                        timersInfo.leader_guild_timer_data = {"battleId": battleId}
                    }
                } else {
                    timersInfo.leader_guild_timer_data = {"battleId": battleId}
                }
            } else if (battleType === "66") {
                if ("thief_guild_timer_data" in timersInfo) {
                    if (timersInfo.thief_guild_timer_data.battleId < battleId) {
                        timersInfo.thief_guild_timer_data = {"battleId": battleId}
                    }
                } else {
                    timersInfo.thief_guild_timer_data = {"battleId": battleId}
                }
            } else if (battleType === "0") {
                if ("hunt_guild_timer_data" in timersInfo) {
                    if (timersInfo.hunt_guild_timer_data.battleId < battleId) {
                        timersInfo.hunt_guild_timer_data = {"battleId": battleId}
                    }
                } else {
                    timersInfo.hunt_guild_timer_data = {"battleId": battleId}
                }
            }
            set("timers_data", timersInfo)
        }
    }

    // listeners
    function handleOnSettingsButtonClick() {
        showEmptyBackground();
        showSettings();
    }

    function handleOnBackgroundClick() {
        hideEmptyBackground();
        hideSettings();
    }

    function handleSettingsChange(key) {
        settings[key] = $(`${key}_checkbox`).checked
        set('hwm_header_settings', settings)
    }

    // templates
    function getSettingsButtonTemplate() {
        return `
            <img
                id="hwm_header_settings_button"
                src="https://dcdn3.heroeswm.ru/i/combat/btn_settings.png?v=8"
                height="18"
                alt="Header settings"
                style="position: relative; filter: drop-shadow(0.01rem 0.01rem 0 black) drop-shadow(-0.01rem -0.01rem 0 black); transform: rotate(22.5deg)"
                title="Header settings"
            >`
    }

    function getEmptyBackgroundTemplate() {
        return `
        <div id="empty_background" style="
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: ${getScrollHeight()};
            background: #000000;
            opacity: 0.5;
            z-index: 1100;
        "></div>
        `
    }

    function getSettingsTemplate() {
        return `
        <div id="hwm_header_settings" style="
            position: absolute;
            left: ${(getClientWidth() - 600) / 2}px;
            top: ${window.pageYOffset + 155}px;
            width: 600px;
            background: #F6F3EA;
            z-index: 1101;
        ">

        </div>
        `
    }

    function getNewHeaderTemplate() {
        return `
        <div id="new_header">
    <div class="top_line">
        <div class="top_left_container">
<!--            <div class="top_left_left">-->
<!--            </div>-->
            <div class="top_wing_middle">
                <div id="notifications"></div>
            </div>
            <div class="top_left_right">
                <div id="heart_container">
                    <div class="sh_HMResIconBlock">
                        <canvas width="64px" height="64px" id="my_heart"/>
                    </div>
                    <div style="display: none;" id="health_amount">100</div>
                </div>
            </div>
        </div>
        <div class="top_resource_container" id="top_resource_container">
            <div id="ResourcesPanel" class="sh_ResourcesPanel">

            </div>
        </div>
        <div class="top_right_container">
            <div class="top_right_left">
                <div id="mana_container">
                    <div class="sh_HMResIconBlock mana"></div>
                    <div class="mana_animation"></div>
                    <div style="display: none" id="mana_amount">${headerInfo.mana_amount}</div>
                </div>
            </div>
            <div class="top_wing_middle">
                <div class="time_online_radio_container">
                    <div id="hwm_time"></div>
                    <div class="mm_extra_separator"></div>
                    <div id="hwm_online">${headerInfo['online']} online</div>
                    <div class="mm_extra_separator"></div>
                    <div class="mm_extra_radio" onclick="hwm_top_line_open_radio(620, 400);return false;"></div>
                    <div class="mm_extra_separator"></div>
                    <div id="">${getSettingsButtonTemplate()}</div>
                </div>
            </div>
<!--            <div class="top_right_right">-->

<!--            </div>-->
        </div>
    </div>
    <div class="new_header_menu">
<!--        <img src="https://dcdn.heroeswm.ru/i/new_top/mm_decor1.png" class="mm_decor1">-->
        <div class="left_dragon">
<!--            <img height="70px" src="https://i.pinimg.com/originals/6c/2e/0b/6c2e0be6ebdad0e7f4bc86bc1f10e451.png">-->
        </div>
        <div class="middle_menus">
            <div class="timers_container" id="timers_container"></div>
            <div class="common_menu_container">
                ${getMenuButtonsTemplate()}
            </div>
            <div class="timers_container" id="factions_container" style="margin-top: 10px;"></div>
        </div>

        <div class="right_dragon">
<!--            <img height="70px" src="https://i.imgur.com/oqyVp7G.png">-->
        </div>
    </div>
</div>
        `
    }

    function getNotificationsTemplate() {
        return headerInfo['notifications'].reduce((result, current) => {
            return result + `<a href="${current.parentElement.parentElement.href}">${current.outerHTML.toString()}</a>`
        }, "")
    }

    function getResourcesTemplate() {
        let newResources = []
        let resourceLinks = getResourceLinks()
        for (const [key, value] of Object.entries(headerInfo['resources'])) {
            let template = `
            <div class="sh_ResourcesItem">
                <a href="${resourceLinks[key]}">
                    <img class="sh_ResourcesItem_icon" src="https://dcdn.heroeswm.ru/i/r/48/${key}.png?v=3.23de65" alt="${key}" title="${key}">
                </a>
            <span class="select_auto_enabled">${value}</span></div>
            `
            newResources.push(template)
        }
        return newResources.join(`<div class="mm_rp_separator"></div>`)
    }

    function getMenuButtonsTemplate() {
        let buttonsToShow = getAvailableButtons()
        return buttonsToShow.reduce((result, current) => result + getMenuButtonHTML(current), "")
    }

    function getAvailableButtons() {
        let buttons = []
        for (const [key, value] of Object.entries(getButtonInfos())) {
            if (settings[key]) {
                buttons.push(value)
            }
        }
        return buttons
    }

    function getMenuButtonHTML(buttonInfo) {
        processButtonDropDown(buttonInfo)
        let buttonInside
        if (settings['isTextButtons']) {
            buttonInside = `<div class="menu_button_text">${getTranslation(buttonInfo.id)}</div>`
        } else {
            buttonInside = `<img class="mm_item_icon" src="${buttonInfo.image}" alt="${buttonInfo.id}">`
        }
        let buttonColor
        if (headerInfo['homeColor'] === 'red') {
            buttonColor = 'red'
        } else if (headerInfo['battleColor'] === 'orange' && buttonInfo.id === "MenuBattles") {
            buttonColor = 'orange'
        } else if (headerInfo['battleColor'] === 'red' && buttonInfo.id === "MenuBattles") {
            buttonColor = 'red'
        } else {
            buttonColor = 'blue'
        }
        return `
        <div class="mm_item mm_item_${buttonColor} ${settings.isTextButtons ? "small_text_button" : ""}">
            <a href="${buttonInfo.href}">
                <div class="mm_item_inside ${settings.isTextButtons ? "small_text_inside" : ""}" id="${buttonInfo.id}">
                    ${buttonInside}
                </div>
            </a>
        </div>
        `
    }

    function getTimersTemplate() {
        let isPremium = timersInfo.isPremium ? timersInfo.isPremium : false
        let result = ''
        if (timersInfo.labor_guild_timer_data) {
            let timeCount = 60
            result += getTimerButtonTemplate("labor_guild", getRemainingTime(timersInfo.labor_guild_timer_data, timeCount))
        } else {
            result += getTimerButtonTemplate("labor_guild", "00:00")
        }

        if (timersInfo.hunt_guild_timer_data && timersInfo.hunt_guild_timer_data.timeSet) {
            let timeCount = isPremium ? 28 : 40
            result += getTimerButtonTemplate("hunt_guild", getRemainingTime(timersInfo.hunt_guild_timer_data.timeSet, timeCount))
        } else {
            result += getTimerButtonTemplate("hunt_guild", "00:00")
        }

        if (timersInfo.mercenary_guild_timer_data) {
            result += getTimerButtonTemplate("mercenary_guild", secondsToHumanDate((new Date(timersInfo.mercenary_guild_timer_data).getTime()-getHwmDate().getTime())/1000))
        } else {
            result += getTimerButtonTemplate("mercenary_guild", "00:00")
        }

        if (timersInfo.thief_guild_timer_data && timersInfo.thief_guild_timer_data.timeSet) {
            let timeCount = isPremium ? 42 : 60
            result += getTimerButtonTemplate("thief_guild", getRemainingTime(timersInfo.thief_guild_timer_data.timeSet, timeCount))
        } else {
            result += getTimerButtonTemplate("thief_guild", "00:00")
        }

        if (timersInfo.leader_guild_timer_data && timersInfo.leader_guild_timer_data.timeSet) {
            let timeCount = 180
            result += getTimerButtonTemplate("leader_guild", getRemainingTime(timersInfo.leader_guild_timer_data.timeSet, timeCount))
        } else {
            result += getTimerButtonTemplate("leader_guild", "00:00")
        }

        if (timersInfo.smith_guild_timer_data) {
            result += getTimerButtonTemplate("smith_guild", secondsToHumanDate((new Date(timersInfo.smith_guild_timer_data).getTime()-getHwmDate().getTime())/1000))
        } else {
            result += getTimerButtonTemplate("smith_guild", "00:00")
        }
        return result
    }



    function getTimerButtonTemplate(name, time) {
        return `
            <div class="mm_item mm_item_blue small_text_button">
                <a href="${getGuildLink()[name]}" style="text-decoration: none">
                    <div class="menu_button_text">${getTranslation(name)} ${time}</div>
                </a>
            </div>
        `

    }

    function getRemainingTime(timeSet, timeCount) {
        let hwmDate = getHwmDate()
        let timeSetHwm = new Date(timeSet)
        return secondsToHumanDate(diffDateInSeconds(timeSetHwm, hwmDate) + timeCount * 60)
    }

    function diffDateInSeconds(dt1, dt2) {
        return Math.round((dt1.getTime() - dt2.getTime()) / 1000);
    }

    // helpers
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function doGet(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            onload: function (res) {
                callback(new DOMParser().parseFromString(res.responseText, "text/html"))
            }
        });
    }

    function doPost(url, params, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: params,
            onload: callback,
        });
    }

    function removeElement(element) {
        element.parentNode.removeChild(element)
    }

    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }

    function get(key, def) {
        let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
        return result == null ? def : result;

    }

    function set(key, val) {
        localStorage[key] = JSON.stringify(val);
    }

    function getScrollHeight() {
        return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    }

    function getClientWidth() {
        return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
    }

    function findAll(regexPattern, sourceString) {
        let output = []
        let match
        let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
        while (match = regexPatternWithGlobal.exec(sourceString)) {
            delete match.input
            output.push(match)
        }
        return output
    }

    function sortByKey(array, key) {
        return array.sort((a, b) => {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function getHwmDate() {
        let today = new Date();
        let localOffset = -(today.getTimezoneOffset() / 60);
        let destinationOffset = +3;

        let offset = destinationOffset - localOffset;
        return new Date(new Date().getTime() + offset * 3600 * 1000)

    }

    function hwmDateToHuman(hwmDate) {
        let hours = hwmDate.getHours().toString().length === 1
            ? "0" + hwmDate.getHours().toString()
            : hwmDate.getHours().toString()
        let minutes = hwmDate.getMinutes().toString().length === 1
            ? "0" + hwmDate.getMinutes().toString()
            : hwmDate.getMinutes().toString()
        let seconds = hwmDate.getSeconds().toString().length === 1
            ? "0" + hwmDate.getSeconds().toString()
            : hwmDate.getSeconds().toString()
        return hours + ":" + minutes + ":" + seconds
    }

    function secondsToHumanDate(seconds) {
        if (seconds < 0) {
            return "00:00"
        }
        let hours = ~~(seconds / 3600);
        let minutes = ~~((seconds % 3600) / 60);
        let secs = ~~seconds % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";
        if (hours > 0) {
            ret += "" + hours + ":" + (minutes < 10 ? "0" : "");
        }
        ret += "" + minutes + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    function getTranslation(textId) {
        return allTexts.getTranslation(textId, language)
    }

    function loadSettings() {
        settings = get('hwm_header_settings', defaultSettings)
        for (const [key, value] of Object.entries(defaultSettings)) {
            if (settings[key] === undefined) {
                settings[key] = value
            }
        }
    }

    function loadTimersInfo() {
        timersInfo = get('timers_data', {})
    }

    function setMySign() {
        doGet(`https://${host}/shop.php`, (docc) => {
            set("my_sign", docc.body.innerHTML.match(/sign=([a-z0-9]+)/)[1])
        })
    }

    function getAllTexts() {
        let texts = new LocalizedTextMap()
        texts.addText(new LocalizedText("isTimeWithSeconds", "Show time with seconds", "Показывать время с секундами", "Показувати час з секундами"))
        texts.addText(new LocalizedText("isShowTimers", "Show guilds' timers", "Показывать таймеры гильдий", "Показувати таймери гільдій"))
        texts.addText(new LocalizedText("isDarkTheme", "Dark theme", "Темная тема", "Темна тема"))
        texts.addText(new LocalizedText("isTextButtons", "Show old text buttons", "Старые текстовые кнопки", "Старі текстові кнопки"))
        texts.addText(new LocalizedText("isHomeButton", "Home", "Персонаж", "Персонаж"))
        texts.addText(new LocalizedText("isInventoryButton", "Inventory", "Инвентарь", "Інвентар"))
        texts.addText(new LocalizedText("is1180Button", "clan 1180", "Паутина", "Павутина"))
        texts.addText(new LocalizedText("isMapButton", "Map", "Карта", "Мапа"))
        texts.addText(new LocalizedText("isBattleButton", "Battles", "Битвы", "Побоїща"))
        texts.addText(new LocalizedText("isTavernButton", "Tavern", "Таверна", "Корчма"))
        texts.addText(new LocalizedText("isRouletteButton", "Roulette", "Рулетка", "Лохотрон"))
        texts.addText(new LocalizedText("isLeaderboardButton", "Leaderboards", "Рейтинг", "Рейтинг"))
        texts.addText(new LocalizedText("isForumButton", "Forum", "Форум", "Симпозіум"))
        texts.addText(new LocalizedText("isChatButton", "Chat", "Чат", "Толковище"))
        texts.addText(new LocalizedText("isQuickFactionChange", "Quick faction and classes change", "Быстрая смена фракций и классов", "Швидка зміна фракцій"))
        texts.addText(new LocalizedText("MenuHome", "Home", "Персонаж", "Персонаж"))
        texts.addText(new LocalizedText("MenuInventory", "Inventory", "Инвентарь", "Інвентар"))
        texts.addText(new LocalizedText("MenuMap", "clan 1180", "Паутина", "Павутина"))
        texts.addText(new LocalizedText("Menu1180", "Map", "Карта", "Мапа"))
        texts.addText(new LocalizedText("MenuBattles", "Battles", "Битвы", "Побоїща"))
        texts.addText(new LocalizedText("MenuTavern", "Tavern", "Таверна", "Корчма"))
        texts.addText(new LocalizedText("MenuRoulette", "Roulette", "Рулетка", "Лохотрон"))
        texts.addText(new LocalizedText("MenuStat", "Leaderboards", "Рейтинг", "Рейтинг"))
        texts.addText(new LocalizedText("MenuForum", "Forum", "Форум", "Симпозіум"))
        texts.addText(new LocalizedText("MenuChat", "Chat", "Чат", "Толковище"))
        texts.addText(new LocalizedText("myself", "Myself", "Персонаж", "Персонаж"))
        texts.addText(new LocalizedText("inventory", "Inventory", "Инвентарь", "Інвентар"))
        texts.addText(new LocalizedText("shop", "Artifact shop", "Магазин", "Крамничка"))
        texts.addText(new LocalizedText("auction", "Market", "Рынок", "Базар"))
        texts.addText(new LocalizedText("choose_army", "Recruiting", "Набор армии", "Набір армії"))
        texts.addText(new LocalizedText("castle", "Castle", "Замок", "Замок"))
        texts.addText(new LocalizedText("skills", "Talents", "Навыки", "Навички"))
        texts.addText(new LocalizedText("mailbox", "Mailbox", "Почта", "Повідомленна"))
        texts.addText(new LocalizedText("transfer", "Transfer", "Передача ресурсов", "Передача ресурсів"))
        texts.addText(new LocalizedText("facility1", "Mining", "Добыча", "Видобуток"))
        texts.addText(new LocalizedText("facility2", "Machining", "Обработка", "Обробка"))
        texts.addText(new LocalizedText("facility3", "Production", "Производство", "Виробництво"))
        texts.addText(new LocalizedText("houses", "Public services", "Дома", "Послуги"))
        texts.addText(new LocalizedText("one_to_one", "Duels", "Дуэли", "Дуелі"))
        texts.addText(new LocalizedText("many_to_many", "Group battles", "Групповые бои", "Групові бої"))
        texts.addText(new LocalizedText("guild_pvp", "Commanders' guild", "Гильдия тактиков", "Гільдія тактиків"))
        texts.addText(new LocalizedText("guild_task", "Watchers' guild", "Гильдия стражей", "Гільдія вартових"))
        texts.addText(new LocalizedText("guild_leader", "Leaders guild", "Гильдия лидеров", "Гільдія лідерів"))
        texts.addText(new LocalizedText("clanwars", "Clan wars", "Бои за территории", "Бої за території"))
        texts.addText(new LocalizedText("tournaments", "Tournaments", "Турниры", "Турніри"))
        texts.addText(new LocalizedText("spin_history", "Spin history", "История игр", "Історія випадінь"))
        texts.addText(new LocalizedText("lucky_boxes", "Chests of abundance", "Редкие ларцы", "Рідкісні скриньки"))
        texts.addText(new LocalizedText("top_heroes", "Top warriors", "Рейтинг воинов", "Рейтинг воїнів"))
        texts.addText(new LocalizedText("top_clans", "Top clans", "Рейтинг кланов", "Рейтинг кланів"))
        texts.addText(new LocalizedText("top_hunters", "Top hunters", "Рейтинг охотников", "Рейтинг мисливців"))
        texts.addText(new LocalizedText("top_mercenaries", "Top mercenaries", "Рейтинг наемников", "Рейтинг найманців"))
        texts.addText(new LocalizedText("top_shareholders", "Top shareholders", "Рейтинг акционеров", "Рейтинг акціонерів"))
        texts.addText(new LocalizedText("personal_records", "My hunt records", "Мои охоты", "Мої полювання"))
        texts.addText(new LocalizedText("general_forum", "General forum", "Общий форум", "Загальний форум"))
        texts.addText(new LocalizedText("help_forum", "Q&A forum", "Помощь по игре", "Допомога по грі"))
        texts.addText(new LocalizedText("trade_forum", "Trade forums", "Торговый форум", "Торговий форум"))
        texts.addText(new LocalizedText("reference", "About the game", "Об игре", "Про гру"))
        texts.addText(new LocalizedText("hwm_newspaper", "Daily news", "Новостная лента", "Стрічка новин"))
        texts.addText(new LocalizedText("chat_1", "Inquiry", "Комната вопросов", "Кімната питань"))
        texts.addText(new LocalizedText("chat_2", "Common", "Общая комната", "Загальна кімната"))
        texts.addText(new LocalizedText("chat_3", "Merchant", "Торговая палата", "Торгова палата"))
        texts.addText(new LocalizedText("chat_4", "Roulette", "Рулетка", "Рулетка"))
        texts.addText(new LocalizedText("chat_5", "Tavern", "Карты", "Пасьянс"))
        texts.addText(new LocalizedText("labor_guild", "LG", "ГР", "ГР"))
        texts.addText(new LocalizedText("leader_guild", "LeG", "ГЛ", "ГЛ"))
        texts.addText(new LocalizedText("hunt_guild", "HG", "ГО", "ГО"))
        texts.addText(new LocalizedText("thief_guild", "TG", "ГВ", "ГВ"))
        texts.addText(new LocalizedText("smith_guild", "SG", "ГК", "ГК"))
        texts.addText(new LocalizedText("mercenary_guild", "MG", "ГН", "ГН"))
        texts.addText(new LocalizedText("battle_log", "Combat log", "Протокол боев", "Протокол боев"))
        texts.addText(new LocalizedText("transfer_log", "Transfer log", "Протокол передач", "Протокол передач"))
        texts.addText(new LocalizedText("clan_control", "Control", "Управление", "Управління"))
        texts.addText(new LocalizedText("clan_members", "Members", "Состав", "Особистий склад"))
        texts.addText(new LocalizedText("clan_invites", "Iinvites", "Приглашения", "Запрощення"))
        texts.addText(new LocalizedText("clan_balance", "Balance", "Счет клана", "Рахунок клану"))
        texts.addText(new LocalizedText("clan_glory", "Clan glory", "Боевая слава", "Бойова слава"))
        texts.addText(new LocalizedText("clan_bplan", "Military policy", "Военная политика", "воєнна політика"))
        texts.addText(new LocalizedText("clan_broadcast", "Broadcast", "Рассылка", "Розсилка"))
        texts.addText(new LocalizedText("sklad_info", "Clan warehouse", "Склад клана", "Склад клану"))
        texts.addText(new LocalizedText("", "", "", ""))
        return texts
    }

    function getDefaultSettings() {
        return {
            "isTimeWithSeconds": true,
            "isShowTimers": true,
/*             "isDarkTheme": false, */
            "isTextButtons": false,
            "isHomeButton": true,
            "isInventoryButton": false,
            "is1180Button": true,
            "isMapButton": true,
            "isBattleButton": true,
            "isTavernButton": true,
            "isRouletteButton": true,
            "isLeaderboardButton": true,
            "isForumButton": true,
            "isChatButton": true,
            "isQuickFactionChange": true,
        }
    }

    function getButtonInfos() {
        return {
            "isHomeButton": {
                "image": "https://dcdn.heroeswm.ru/i/new_top/_panelCharacter.png",
                "id": "MenuHome",
                "href": "home.php",
                "dropDown": [
                    ["myself", `pl_info.php?id=${getCookie("pl_id")}`],
                    ["inventory", "inventory.php"],
                    ["shop", "shop.php"],
                    ["auction", "auction.php"],
                    ["choose_army", "army.php"],
                    ["castle", "castle.php"],
                    ["skills", "skillwheel.php"],
                    ["mailbox", "sms.php"],
                    ["transfer", "transfer.php"],
                    ["battle_log", `pl_warlog.php?id=${getCookie("pl_id")}`],
                    ["transfer_log", `pl_transfers.php?id=${getCookie("pl_id")}`],
                ]
            },
            "isInventoryButton": {
                "image": "https://dcdn.heroeswm.ru/i/mobile_view/icons/_panelInventory.png",
                "id": "MenuInventory",
                "href": "inventory.php",
                "dropDown": []
            },
            "isMapButton": {
                "image": "https://dcdn.heroeswm.ru/i/new_top/_panelMap.png",
                "id": "Menu1180",
                "href": "map.php",
                "dropDown": [
                    ["facility1", "map.php?st=mn"],
                    ["facility2", "map.php?st=fc"],
                    ["facility3", "map.php?st=sh"],
                    ["houses", "map.php?st=hs"],
                ]
            },
            "is1180Button": {
                "image": "https://dcdn.heroeswm.ru/i_clans/l_1180.gif",
                "id": "MenuMap",
                "href": "clan_info.php?id=1180",
                "dropDown": [
                    ["clan_control", "clan_control.php?id=1180"],
                    ["clan_members", "clan_members.php?id=1180"],
                    ["clan_invites", "clan_invites.php?id=1180"],
                    ["clan_balance", "clan_balance.php?id=1180"],
                    ["clan_glory", "clan_glory.php?id=1180"],
                    ["clan_bplan", "clan_bplan.php?id=1180"],
                    ["clan_broadcast", "clan_broadcast.php?id=1180"],
                    ["sklad_info", "sklad_info.php?id=12"],
                ]
            },
            "isBattleButton": {
                "image": "https://dcdn.heroeswm.ru/i/new_top/_panelBattles.png",
                "id": "MenuBattles",
                "href": "bselect.php",
                "dropDown": [
                    ["one_to_one", "one_to_one.php"],
                    ["many_to_many", "group_wars.php"],
                    ["guild_pvp", "pvp_guild.php"],
                    ["guild_task", "task_guild.php"],
                    ["guild_leader", "leader_guild.php"],
                    ["clanwars", "mapwars.php"],
                    ["tournaments", "tournaments.php"],
                ]
            },
            "isTavernButton": {
                "image": "https://dcdn.heroeswm.ru/i/new_top/_panelTavern.png",
                "id": "MenuTavern",
                "href": "tavern.php",
                "dropDown": []
            },
            "isRouletteButton": {
                "image": "https://dcdn.heroeswm.ru/i/new_top/_panelRoulette.png",
                "id": "MenuRoulette",
                "href": "roulette.php",
                "dropDown": [
                    ["spin_history", "allroul.php"],
                    ["lucky_boxes", "gift_box_log.php"],

                ]
            },
            "isLeaderboardButton": {
                "image": "https://dcdn.heroeswm.ru/i/new_top/_panelRate.png",
                "id": "MenuStat",
                "href": "plstats.php",
                "dropDown": [
                    ["top_heroes", "plstats.php"],
                    ["top_clans", "clanstat.php"],
                    ["top_hunters", "plstats_hunters.php"],
                    ["top_mercenaries", "plstats_merc.php"],
                    ["top_shareholders", "sholders_stat.php"],
                    ["personal_records", `pl_hunter_stat.php?id=${getCookie("pl_id")}`],

                ]
            },
            "isForumButton": {
                "image": "https://dcdn.heroeswm.ru/i/new_top/_panelForum.png",
                "id": "MenuForum",
                "href": "forum.php",
                "dropDown": [
                    ["general_forum", "forum_thread.php?id=2"],
                    ["help_forum", "forum_thread.php?id=10"],
                    ["trade_forum", "forum.php#t1"],
                    ["reference", "help.php"],
                    ["hwm_newspaper", "https://daily.heroeswm.ru/"],

                ]
            },
            "isChatButton": {
                "image": "https://dcdn.heroeswm.ru/i/new_top/_panelChat.png",
                "id": "MenuChat",
                "href": "frames.php",
                "dropDown": [
                    ["chat_1", "frames.php?room=0"],
                    ["chat_2", "frames.php?room=1"],
                    ["chat_3", "frames.php?room=2"],
                    ["chat_4", "frames.php?room=3"],
                    ["chat_5", "frames.php?room=4"],
                ]
            },
        }
    }

    function getResourceLinks() {
        return {
            "gold": "roulette.php",
            "wood": "auction.php?cat=res&sort=0&type=1",
            "ore": "auction.php?cat=res&sort=0&type=2",
            "mercury": "auction.php?cat=res&sort=0&type=3",
            "sulfur": "auction.php?cat=res&sort=0&type=4",
            "crystals": "auction.php?cat=res&sort=0&type=5",
            "gems": "auction.php?cat=res&sort=0&type=6",
            "diamonds": "hwm_donate_page_new.php",
        }
    }

    function getGuildLink() {
        return {
            "labor_guild": "map.php",
            "leader_guild": "leader_guild.php",
            "hunt_guild": "map.php",
            "thief_guild": "map.php",
            "smith_guild": "mod_workbench.php?type=repair",
            "mercenary_guild": "mercenary_guild.php"
        }
    }

    function getStyles() {
        return `
        <style>
    body {
        margin: 0;
        padding: 0;
    }

    #new_header {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .top_line {
        width: 100%;
        height: 32px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }

    .top_left_container, .top_right_container {
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        flex-grow: 1;
    }

    .top_left_left {
        height: 100%;
        width: 52px;
        background-image: url("https://dcdn.heroeswm.ru/i/new_top/extra_bg_side2.png");
        background-size: 256px 32px;
        background-repeat: no-repeat;
    }

    .top_left_right {
        min-width: 100px;
        background: url("https://dcdn.heroeswm.ru/i/new_top/extra_bg_side1.png") no-repeat top right;
        background-size: 256px 32px;

    }

    /*#logo_container {*/
    /*    position: relative;*/
    /*}*/

    /*.logo {*/
    /*    max-width: 128px;*/
    /*    max-height: 64px;*/
    /*}*/
    #notifications {
        height: 32px;
        float: right;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        margin-right: 10%;
    }

    #heart_container {
        background-image: url("https://dcdn.heroeswm.ru/i/new_top/mm_rp_health.png");
        background-size: contain;
        width: 32px;
        height: 32px;
        margin: auto;
    }

    #heart_container:hover #health_amount {
        display: initial !important;
        position: absolute;
        color: white;
        transform: translate(10%, -100%);
        text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;

    }

    .sh_HMResIconBlock {
        position: relative;
        left: 15px;
        top: 15px;
    }

    .health_animation {
        position: relative;
		animation: health_animation 2.5s ease-in-out infinite both;

    }
    @keyframes health_animation {
	  from {
		-webkit-transform: scale(1);
				transform: scale(1);
		-webkit-transform-origin: center center;
				transform-origin: center center;
		-webkit-animation-timing-function: ease-out;
				animation-timing-function: ease-out;
	  }
	  10% {
		-webkit-transform: scale(0.91);
				transform: scale(0.91);
		-webkit-animation-timing-function: ease-in;
				animation-timing-function: ease-in;
	  }
	  17% {
		-webkit-transform: scale(0.98);
				transform: scale(0.98);
		-webkit-animation-timing-function: ease-out;
				animation-timing-function: ease-out;
	  }
	  33% {
		-webkit-transform: scale(0.87);
				transform: scale(0.87);
		-webkit-animation-timing-function: ease-in;
				animation-timing-function: ease-in;
	  }
	  45% {
		-webkit-transform: scale(1);
				transform: scale(1);
		-webkit-animation-timing-function: ease-out;
				animation-timing-function: ease-out;
	  }
	}


    #my_heart {
        width: 27px;
        height: 27px;
    }

    #mana_container {
        background-image: url("https://dcdn.heroeswm.ru/i/new_top/mm_rp_mana.png");
        background-size: contain;
        width: 32px;
        height: 32px;
        margin: auto;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        overflow: hidden;
    }

    .mana_animation {
        position: relative;
        grid-column-start: 1;
        grid-row-start: 1;
        z-index: 4;
    }

    .mana {
        grid-column-start: 1;
        grid-row-start: 1;
        z-index: 3;
    }

    #mana_amount {
        grid-column-start: 1;
        grid-row-start: 1;
        z-index: 5;
        margin: auto;
        color: white;
    }

    #mana_container:hover #mana_amount {
        display: initial !important;
        color: white;
        text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
    }

    .top_right_right {
        width: 52px;
        background: url("https://dcdn.heroeswm.ru/i/new_top/extra_bg_side2.png") no-repeat top right;
        background-size: 256px 32px;
    }

    .top_right_left {
        min-width: 100px;
        background: url("https://dcdn.heroeswm.ru/i/new_top/extra_bg_side1.png") no-repeat top left;
        background-size: 256px 32px;
    }

    .top_wing_middle {
        min-width: 175px;
        width: 100%;
        background: url("https://dcdn.heroeswm.ru/i/new_top/extra_bg_mid.png") repeat-x top left;
        background-size: 32px;
    }

    .time_online_radio_container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        margin-left: 10%;

    }

    #hwm_time, #hwm_online {
        color: #ccb89f;
    }

    .top_resource_container {
        background: url("https://dcdn.heroeswm.ru/i/new_top/rp_bg_mid.png");
        background-size: contain;
    }

    .new_header_menu {
        background: url("https://dcdn.heroeswm.ru/i/new_top/mm_dd_tile.jpg");
        min-height: 70px;
        padding: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
    .common_menu_container {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .timers_container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .mm_item {
        margin: 0;
    }
    .mm_item + .mm_item {

        margin-left: 5px;
    }

    .left_dragon, .right_dragon {
    }
    .left_dragon {
        transform: scaleX(-1);
    }
.mm_item_icon {
    width: 40px;
    height: auto;
}
    .middle_menus {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 8px;
        margin-top: 8px;
    }

    .menu_button_text {
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fad49f;
        font-weight: bold;
    }

    .small_text_button {
        height:24px;
    }

    .small_text_inside {
        height:24px;
    }

    .faction-icon {
    	vertical-align: middle;
    	width: 24px;
    	cursor: pointer;
    }
    .faction-icon-mod {
    vertical-align: middle;
    cursor: pointer;
    width: 20px!important;
    height: 20px!important;
    padding: 2px;
    margin: 0px 1px;
    border-radius: 16px;
    -webkit-border-radius: 16px;
    -moz-border-radius: 16px;
    background-color: #40362b;
    border: 1px solid #aa8b56;
}
    }
</style>
        `
    }

    function getDarkStyles() {
        let mainTextColor = `#d0d0d0`
        return `
        <style>
			body {
				background: #1f2023 !important;
			}
			td, .forum > td {
				color: ${mainTextColor} !important;
				background-image: none !important;
			}
			font {
				color: ${mainTextColor} !important;
				opacity: 0.65;
			}
			a, .forum > a {
				color: ${mainTextColor} !important;
				/*opacity: 0.87;*/
			}
			div {
				color: #121212;
			}
			.txt {
				color: ${mainTextColor};
				/*opacity: 0.87;*/
			}
			.pi {
				color: ${mainTextColor};
				/*opacity: 0.87;*/
			}
			.wblight, .wb2, .wb td{
				background-color: #2d2f34;
			}
			.wbwhite {
				background-color: #383b40;
			}
			table.table3, table.table3 th {
				background-color: #383b40;
			}
			.forum tr:not(.second) > td {
				background-color: #383b40 !important;
			}
			table.forum tr.message_footer td {
				background-color: #27292d !important;
			}
			.forum span, .second {
				background-color: #2d2f34 !important;
			}
			#home_2 {
				color: ${mainTextColor};
			}
			#hwm_for_zoom {
				background-color: #27292d !important;
			}
			#hwm_for_zoom * {
				color: ${mainTextColor};
			}
			.dark_seconds {
				color: #a50909;
			}
			* {
				border-color: #55565d !important;
			}
			table td.tlight {
				background-color: #2d2f34 !important;
				background-image: none;
			}
			table td.twhite {
				background-color: #383b40 !important;
				background-image: none;
			}
			#pa,#pd, #pp, #pk, #pl, #pm, #pi, #ap, #sc {
				color: ${mainTextColor} !important;
			}
			.container_block, .inv_note {
				background-color: #363636;
				color: ${mainTextColor} !important;
			}
			.container_block div {
				color: ${mainTextColor} !important;
			}
			.inv_note_kukla {
				background-color: #565654;
			}
			.inv_buttons_to_right div {
				color: #121212 !important;
			}
        </style>
        `
    }
})(window);