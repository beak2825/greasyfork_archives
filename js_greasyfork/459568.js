// ==UserScript==
// @name         Sword Gale Online 自動戰鬥
// @namespace    http://tampermonkey.net/
// @version      1.8.0
// @description  自動戰鬥
// @author       Wind
// @match        https://swordgale.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swordgale.online
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/459568/Sword%20Gale%20Online%20%E8%87%AA%E5%8B%95%E6%88%B0%E9%AC%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/459568/Sword%20Gale%20Online%20%E8%87%AA%E5%8B%95%E6%88%B0%E9%AC%A5.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const observers = [];
    const timers = [];
    const subscribeEvents = {};

    const pageScript = {
        "/hunt": () => {
            bindEvent("/hunt", () => {
            });

            createAutoBtn();

            function createAutoBtn(){
                const div = document.querySelector(".css-1myfyhp");
                const divButton = div.cloneNode();

                div.after(divButton);

                const qkButton = document.querySelector(".css-1mgn15s");
                const autoButton = qkButton.cloneNode();
                const autoFightButton = qkButton.cloneNode();

                const numberFight = document.createElement("select");

                var option1 = document.createElement("option");
                var option2 = document.createElement("option");
                var option3 = document.createElement("option");
                var option4 = document.createElement("option");
                var option5 = document.createElement("option");

                option1.value = 5;
                option1.text = 5;

                option2.value = 10;
                option2.text = 10;

                option3.value = 20;
                option3.text = 20;

                option4.value = 30;
                option4.text = 30;

                option5.value = 200;
                option5.text = 200;

                option4.setAttribute('selected', 'selected');

                numberFight.appendChild(option1);
                numberFight.appendChild(option2);
                numberFight.appendChild(option3);
                numberFight.appendChild(option4);
                numberFight.appendChild(option5);
                // numberFight.type = "number";

                autoButton.innerText = "自動趕路"
                autoButton.style.marginLeft = "10px";
                autoButton.setAttribute("class", "auto-btn");
                divButton.append(autoButton);

                autoFightButton.innerText = "自動戰鬥"
                autoFightButton.style.marginLeft = "10px";
                autoFightButton.setAttribute("class", "auto-fight-btn");
                autoButton.after(autoFightButton);

                const newqkButton = document.querySelector(".auto-btn");

                numberFight.setAttribute("class", "number-fight");
                numberFight.style.width = "60px";
                numberFight.style.height = "30px";
                numberFight.style.borderRadius = "8px";
                numberFight.style.marginLeft = "10px";
                numberFight.value = 200;
                numberFight.setAttribute("placeholder", "次數");
                autoButton.before(numberFight);

                const weaponInput = document.createElement("input");
                weaponInput.type = "number";

                // const weaponInput = numberFight.cloneNode();
                weaponInput.setAttribute("class", "number-fight");
                weaponInput.style.width = "60px";
                weaponInput.style.height = "30px";
                weaponInput.style.borderRadius = "8px";
                weaponInput.style.marginLeft = "10px";
                weaponInput.setAttribute("class", "weaponInput");
                weaponInput.setAttribute("placeholder", "耐久");
                weaponInput.value = 50;
                numberFight.after(weaponInput);

                const spInput = weaponInput.cloneNode();
                spInput.setAttribute("class", "spInput");
                spInput.setAttribute("placeholder", "體力");
                spInput.value = 500;
                weaponInput.after(spInput);

                const HpValue = document.querySelectorAll(".css-newptn")[0].innerText;

                const hpInput = weaponInput.cloneNode();
                hpInput.setAttribute("class", "hpInput");
                hpInput.setAttribute("placeholder", "HP");
                hpInput.value = parseInt(parseInt(HpValue.split('/ ')[1].split(' (')[0])*0.9);
                spInput.after(hpInput);

                const floorInput = weaponInput.cloneNode();
                floorInput.setAttribute("class", "floorInput");
                floorInput.setAttribute("placeholder", "層數");
                floorInput.value = 0;
                hpInput.after(floorInput);

                const reasonInput = document.createElement("input");
                reasonInput.style.width = "60px";
                reasonInput.style.height = "30px";
                reasonInput.style.borderRadius = "8px";
                reasonInput.style.marginLeft = "10px";
                reasonInput.type = "text";
                reasonInput.setAttribute("id", "reasonInput");
                reasonInput.setAttribute("class", "reasonInput");
                reasonInput.setAttribute("placeholder", "原因");
                reasonInput.value = "原因";
                autoFightButton.after(reasonInput);

                if(autoButton.getAttribute("disabled") === "") autoButton.removeAttribute("disabled")
                autoButton.onclick = () => {
                    const fightButton = document.querySelector(".css-14jkdoz");
                    const number = document.querySelector(".number-fight").value - 1;
                    const weaponValue = parseInt(document.querySelector(".weaponInput").value);
                    const spValue = parseInt(document.querySelector(".spInput").value);
                    const hpValue = parseInt(document.querySelector(".hpInput").value);
                    const floorValue = parseInt(document.querySelector(".floorInput").value);

                    fightButton.click();

                    var timerIds = [];

                    run();

                    async function run(){
                        let i = 0;

                        while (i < number){
                            var myArray = [11000, 11000, 12000, 12000, 12000, 12500, 13000, 13500, 14000, 14500, 15000];
                            var rand = Math.floor(Math.random()*myArray.length);
                            var sleepTime = myArray[rand];

                            console.log(sleepTime);

                            await sleep(sleepTime);

                            let hp = document.querySelectorAll(".css-1uajn1d")[0].innerText;
                                let sp = document.querySelectorAll(".css-1uajn1d")[1].innerText;

                                hp = parseInt(hp.split('還有')[1].split('點')[0]);
                                sp = parseInt(sp.split('還有')[1].split('點')[0]);

                                console.log("HP：", hp, "，SP：", sp);

                                if(hp < hpValue){
                                    await sound();
                                    document.getElementById("reasonInput").value="HP";

                                    stopTimeouts();

                                    return;
                                }

                                if(sp < spValue){
                                    await sound();
                                    document.getElementById("reasonInput").value="體力";

                                    stopTimeouts();

                                    return;
                                }

                                // let weapen = parseInt(document.querySelectorAll(".css-7sfvbv")[1].innerText);
                                var table = document.querySelectorAll(".chakra-table")[0];
                                var tableInfo = [];
                                var item = "剩餘耐久";

                                for (var k = 0; k < table.rows.length; k++) {
                                    tableInfo[k] = parseInt(table.rows[k].cells[1].innerText);
                                }

                                tableInfo.splice("剩餘耐久", 1);

                                for (var j = 0; j < tableInfo.length; j++) {
                                    if(tableInfo[j] < weaponValue) {
                                        await sound();
                                        document.getElementById("reasonInput").value="耐久";
                                        stopTimeouts();

                                        return;
                                    }
                                }

                                let value = document.querySelectorAll(".css-1cku4x1")[0].innerText;
                                var n = value.includes("爬到了");

                                if(n){
                                    let floor = value.replace(/[^0-9]/ig, "");

                                    if((floorValue !== 0 ) && (floor == floorValue)){
                                        await sound();
                                        document.getElementById("reasonInput").value="到站";

                                        stopTimeouts();

                                        return;
                                    }
                                }

                                fightButton.click();

                                console.log('趕路 第' + i + '次執行');

                                if(i == number){
                                    await sound();
                                    document.getElementById("reasonInput").value="結束";

                                    stopTimeouts();

                                    return;
                                }

                            i++;
                        }

                    };

                    function stopTimeouts(){
                        timerIds.forEach(function(id){
                            clearTimeout(id);
                        }
                    )};

                    function sleep(time){
                        return new Promise((resolve)=>setTimeout(resolve, time));
                    };

                    function sound(){
                        let filter;

                        const equipmentWarnEncode = "JTVCJTdCJTIyY29sb3IlMjIlM0ElMjIlMjM3NkU0RjclMjIlMkMlMjJzb3VuZCUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGY2RuLmRpc2NvcmRhcHAuY29tJTJGYXR0YWNobWVudHMlMkY3MjMxNDMwNTgwMjcxODQxNjklMkYxMTI3Nzc2MzkxNTE4MjI0NDE1JTJGMTA5NjcyOTU3NDU2MzM4MTI4OC5tcDMlMjIlMkMlMjJ2b2x1bWUlMjIlM0EwLjIxJTJDJTIyaXRlbXMlMjIlM0ElNUIlNUQlN0QlNUQ=";
                        console.log(equipmentWarnEncode);
                        try {
                            filter = JSON.parse(decodeURIComponent(atob(equipmentWarnEncode)));
                        } catch (e) {
                            // console.error("parse error", e);
                            filter = [];
                        }
                        console.log(filter);
                        if (filter.length > 0) {
                            const audio = new Audio(filter[0].sound);

                            audio.volume = filter[0].volume;
                            audio.play().catch((err) => console.error(err));
                        }
                    }
                };

                if(autoFightButton.getAttribute("disabled") === "") autoFightButton.removeAttribute("disabled")
                autoFightButton.onclick = () => {
                    const fightButton = document.querySelectorAll(".css-14jkdoz")[1];
                    const number = document.querySelector(".number-fight").value - 1;
                    const weaponValue = parseInt(document.querySelector(".weaponInput").value);
                    const spValue = parseInt(document.querySelector(".spInput").value);
                    const hpValue = parseInt(document.querySelector(".hpInput").value);
                    const floorValue = parseInt(document.querySelector(".floorInput").value);

                    fightButton.click();

                    var timerIds = [];

                    run();

                    async function run(){
                        let i = 0;

                        while (i < number){
                            var myArray = [11000, 11000, 12000, 12000, 12000, 12500, 13000, 13500, 14000, 14500, 15000];
                            var rand = Math.floor(Math.random()*myArray.length);
                            var sleepTime = myArray[rand];

                            console.log(sleepTime);

                            await sleep(sleepTime);

                            let hp = document.querySelectorAll(".css-1uajn1d")[0].innerText;
                                let sp = document.querySelectorAll(".css-1uajn1d")[1].innerText;

                                hp = parseInt(hp.split('還有')[1].split('點')[0]);
                                sp = parseInt(sp.split('還有')[1].split('點')[0]);

                                console.log("HP：", hp, "，SP：", sp);

                                if(hp < hpValue){
                                    await sound();
                                    document.getElementById("reasonInput").value="HP";

                                    stopTimeouts();

                                    return;
                                }

                                if(sp < spValue){
                                    await sound();
                                    document.getElementById("reasonInput").value="體力";

                                    stopTimeouts();

                                    return;
                                }

                                // let weapen = parseInt(document.querySelectorAll(".css-7sfvbv")[1].innerText);
                                var table = document.querySelectorAll(".chakra-table")[0];
                                var tableInfo = [];
                                var item = "剩餘耐久";

                                for (var k = 0; k < table.rows.length; k++) {
                                    tableInfo[k] = parseInt(table.rows[k].cells[1].innerText);
                                }

                                tableInfo.splice("剩餘耐久", 1);

                                for (var j = 0; j < tableInfo.length; j++) {
                                    if(tableInfo[j] < weaponValue) {
                                        await sound();
                                        document.getElementById("reasonInput").value="耐久";

                                        stopTimeouts();

                                        return;
                                    }
                                }

                                let value = document.querySelectorAll(".css-1cku4x1")[0].innerText;
                                var n = value.includes("爬到了");

                                if(n){
                                    let floor = value.replace(/[^0-9]/ig, "");

                                    if((floorValue !== 0 ) && (floor == floorValue)){
                                        await sound();
                                        document.getElementById("reasonInput").value="到站";

                                        stopTimeouts();

                                        return;
                                    }
                                }

                                fightButton.click();

                                console.log('戰鬥 第' + i + '次執行');

                                if(i == number){
                                    await sound();
                                    document.getElementById("reasonInput").value="結束";

                                    stopTimeouts();

                                    return;
                                }

                            i++;
                        }

                    };

                    function stopTimeouts(){
                        timerIds.forEach(function(id){
                            clearTimeout(id);
                        }
                    )};

                    function sleep(time){
                        return new Promise((resolve)=>setTimeout(resolve, time));
                    };

                    function sound(){
                        let filter;

                        const equipmentWarnEncode = "JTVCJTdCJTIyY29sb3IlMjIlM0ElMjIlMjM3NkU0RjclMjIlMkMlMjJzb3VuZCUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGY2RuLmRpc2NvcmRhcHAuY29tJTJGYXR0YWNobWVudHMlMkY3MjMxNDMwNTgwMjcxODQxNjklMkYxMTI3Nzc2MzkxNTE4MjI0NDE1JTJGMTA5NjcyOTU3NDU2MzM4MTI4OC5tcDMlMjIlMkMlMjJ2b2x1bWUlMjIlM0EwLjIxJTJDJTIyaXRlbXMlMjIlM0ElNUIlNUQlN0QlNUQ=";
                        console.log(equipmentWarnEncode);
                        try {
                            filter = JSON.parse(decodeURIComponent(atob(equipmentWarnEncode)));
                        } catch (e) {
                            // console.error("parse error", e);
                            filter = [];
                        }
                        console.log(filter);
                        if (filter.length > 0) {
                            const audio = new Audio(filter[0].sound);

                            audio.volume = filter[0].volume;
                            audio.play().catch((err) => console.error(err));
                        }
                    }
                };
            }

        }
    }

    function subscribeApi(url, event, forever = true) {
        if(!subscribeEvents[url]){
            subscribeEvents[url] = [];
        }
        subscribeEvents[url].push({
            event,
            forever
        });
    }

    function clearSubscribeEvents(){
        Object.keys(subscribeEvents).forEach(key => {
            delete subscribeEvents[key];
        })
    }

    function isMobileDevice() {
        const mobileDevices = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone']
        for (let i = 0; i < mobileDevices.length; i++) {
            if (navigator.userAgent.match(mobileDevices[i])) {
                return true;
            }
        }
        return false
    }

    function regexGetValue(pattern, str) {
        const match = new RegExp(pattern).exec(str);
        if (match) {
            return match.slice(1);
        } else {
            return [];
        }
    }

    function clearObservers() {
        // console.log("clear")
        observers.forEach((observer) => {
            observer.disconnect();
        });
        observers.length = 0;
    }

    function clearTimers() {
        // console.log("clear")
        timers.forEach((timer) => {
            clearInterval(timer);
        });
        timers.length = 0;
    }
    function bindEvent(pathname, timerEvent) {
        const timer = setInterval(() => {
            if (Array.isArray(pathname)) {
                if (
                    pathname.filter((path) => path === location.pathname).length === 0
                ) {
                    clearInterval(timer);
                    return;
                }
            } else {
                if (location.pathname !== pathname) {
                    clearInterval(timer);
                    return;
                }
            }

            timerEvent();
        }, 100);
        timers.push(timer);
    }

    let container;
    let debounce = 0;
    let timer = setInterval(() => {
        container = document.querySelector("#__next");
        if (container) {
            clearInterval(timer);
            if(isMobileDevice() && getSettingByKey("GENERAL.MOBILE_WRAP_NAVBAR")) wrapNavbar()
            // createSettingUI();
            // registerSettingUIEvent();
            loadObserver();
        }else{
            // console.log("test")
        }
    }, 10);

    function loadObserver() {
        const observer = new MutationObserver(function (e) {
            // console.log(e);

            //奇怪的DOM 導致forge UI產生兩次
            if (e.length) {
                let renderDiv = false;
                for(let i = 0; i < e.length; i++){

                    if (
                        (e[i].addedNodes.length && e[i].addedNodes[0].tagName === "DIV") ||
                        (e[i].removedNodes.length && e[i].removedNodes[0].tagName === "DIV")
                    ) {
                        renderDiv = true;
                        // console.log("DOM !!!!", e, location.pathname)
                        // return;
                    }
                }
                if(!renderDiv) return;
            }
            const pathname = location.pathname;
            if (pageScript[pathname]) {
                debounce++;
                setTimeout(() => {
                    debounce--;
                    if (debounce === 0) {
                        //console.log(e);
                        clearObservers();
                        clearTimers();
                        clearSubscribeEvents();

                        pageScript[pathname]();
                    }
                }, 500);
            }
        });
        observer.observe(container, { subtree: false, childList: true });
    }
})();
