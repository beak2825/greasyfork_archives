// ==UserScript==
// @name         AutoScript
// @namespace    https://github.com/2phangx-dylan
// @version      2.0
// @description  Auto monitor whole orders.
// @author       dylan
// @match        *csm.fotile.com.cn:4000/service_chs/start.swe*
// @license      GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419823/AutoScript.user.js
// @updateURL https://update.greasyfork.org/scripts/419823/AutoScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var speed = 2;
    var delay = 2000;
    var retryTimes = 10;
    var indexArea = 0;
    var fixedSimple = ["gz", "fs", "zs", "zj"];
    var fixedCenter = ["广州", "佛山", "中山", "湛江"];
    var currentArea = ["广州", "佛山", "中山", "湛江"];
    var msgHeight = 40;
    var msgCounter = Number(sessionStorage.getItem("msgCounter"));
    var idTimeout;
    var playHint = 0;

    var bodyElement = document.getElementsByTagName("body")[0];
    var interfaceCover = document.createElement("textarea");
    interfaceCover.disabled = true;
    interfaceCover.style.position = "fixed";
    interfaceCover.style.left = "0px";
    interfaceCover.style.top = "0px";
    interfaceCover.style.height = "100%";
    interfaceCover.style.width = "100%";
    interfaceCover.style.zIndex = "90";
    interfaceCover.style.resize = "none";
    interfaceCover.style.display = "none";
    interfaceCover.style.backgroundColor = "rgba(239, 239, 239, 0.85)";
    interfaceCover.style.textAlign = "center";
    interfaceCover.style.lineHeight = "500px";
    interfaceCover.style.fontFamily = "Consolas, Microsoft YaHei";
    interfaceCover.style.fontWeight = "400";
    interfaceCover.style.fontSize = "xx-large";

    var startMonitor = document.createElement("button");
    startMonitor.innerHTML = "开始监控";
    startMonitor.style.position = "fixed";
    startMonitor.style.left = "10px";
    startMonitor.style.bottom = "360px";
    startMonitor.style.zIndex = "100";
    startMonitor.style.width = "80px";
    startMonitor.style.fontFamily = "Consolas, Microsoft YaHei";
    startMonitor.style.fontSize = "13px";

    var stopMonitor = document.createElement("button");
    stopMonitor.innerHTML = "停止监控";
    stopMonitor.style.position = "fixed";
    stopMonitor.style.left = "95px";
    stopMonitor.style.bottom = "360px";
    stopMonitor.style.zIndex = "100";
    stopMonitor.style.width = "80px";
    stopMonitor.disabled = true;
    stopMonitor.style.fontFamily = "Consolas, Microsoft YaHei";
    stopMonitor.style.fontSize = "13px";

    var hideMonitor = document.createElement("button");
    hideMonitor.innerHTML = "隐藏控件";
    hideMonitor.style.position = "fixed";
    hideMonitor.style.left = "265px";
    hideMonitor.style.bottom = "360px";
    hideMonitor.style.zIndex = "100";
    hideMonitor.style.width = "80px";
    hideMonitor.style.fontFamily = "Consolas, Microsoft YaHei";
    hideMonitor.style.fontSize = "13px";

    var eraseLog = document.createElement("button");
    eraseLog.innerHTML = "清空日志";
    eraseLog.style.position = "fixed";
    eraseLog.style.left = "180px";
    eraseLog.style.bottom = "360px";
    eraseLog.style.zIndex = "100";
    eraseLog.style.width = "80px";
    eraseLog.style.fontFamily = "Consolas, Microsoft YaHei";
    eraseLog.style.fontSize = "13px";

    var showMonitor = document.createElement("button");
    showMonitor.innerHTML = "显示控件";
    showMonitor.style.position = "fixed";
    showMonitor.style.left = "10px";
    showMonitor.style.bottom = "10px";
    showMonitor.style.zIndex = "100";
    showMonitor.style.width = "80px";
    showMonitor.style.display = "none";
    showMonitor.style.fontFamily = "Consolas, Microsoft YaHei";
    showMonitor.style.fontSize = "13px";

    var displayInfo = document.createElement("div");
    displayInfo.disabled = true;
    displayInfo.style.position = "fixed";
    displayInfo.style.left = "10px";
    displayInfo.style.bottom = "10px";
    displayInfo.style.height = "340px";
    displayInfo.style.width = "323px";
    displayInfo.style.zIndex = "100";
    displayInfo.style.fontFamily = "Consolas, Microsoft YaHei";
    displayInfo.style.fontSize = "14px";
    displayInfo.style.overflow = "auto";
    displayInfo.style.border = "1px solid";
    displayInfo.style.borderRadius = "2px";
    displayInfo.style.borderColor = "rgba(118, 118, 118, 0.3)";
    displayInfo.style.backgroundColor = "rgba(239, 239, 239)";
    displayInfo.style.padding = "2px 5px";
    displayInfo.style.color = "rgb(6, 128, 67)";
    displayInfo.style.fontWeight = "500";

    var audioElement = document.createElement("audio");
    audioElement.style.display = "none";
    audioElement.setAttribute("id", "audioHint");
    var sourceElement = document.createElement("source");
    sourceElement.setAttribute("src", "https://downsc.chinaz.net/files/download/sound1/201206/1583.wav");
    sourceElement.setAttribute("type", "audio/wav");

    audioElement.appendChild(sourceElement);
    bodyElement.appendChild(interfaceCover);
    bodyElement.appendChild(startMonitor);
    bodyElement.appendChild(stopMonitor);
    bodyElement.appendChild(hideMonitor);
    bodyElement.appendChild(eraseLog);
    bodyElement.appendChild(showMonitor);
    bodyElement.appendChild(displayInfo);
    bodyElement.appendChild(audioElement);

    var titleLocation = createTitleDivEle("中心选择", "335px");
    var gzLocation = createCheckBoxEle("广州", "310px", Number(sessionStorage.getItem("gz")) === 0 ? Boolean(1) : Boolean(0));
    var fsLocation = createCheckBoxEle("佛山", "290px", Number(sessionStorage.getItem("fs")) === 0 ? Boolean(1) : Boolean(0));
    var zsLocation = createCheckBoxEle("中山", "270px", Number(sessionStorage.getItem("zs")) === 0 ? Boolean(1) : Boolean(0));
    var zjLocation = createCheckBoxEle("湛江", "250px", Number(sessionStorage.getItem("zj")) === 0 ? Boolean(1) : Boolean(0));
    bodyElement.appendChild(titleLocation);
    bodyElement.appendChild(gzLocation);
    bodyElement.appendChild(fsLocation);
    bodyElement.appendChild(zsLocation);
    bodyElement.appendChild(zjLocation);

    var titleInterval = createTitleDivEle("切换速度", "210px");
    var speedA = createRadioBoxEle("2.0倍", "185px", "speed", "speedClass", "speed1");
    var speedB = createRadioBoxEle("4.0倍", "165px", "speed", "speedClass", "speed2");
    var speedC = createRadioBoxEle("8.0倍", "145px", "speed", "speedClass", "speed3");
    bodyElement.appendChild(titleInterval);
    bodyElement.appendChild(speedA);
    bodyElement.appendChild(speedB);
    bodyElement.appendChild(speedC);

    var titleRequest = createTitleDivEle("等待时间", "105px");
    var requestWaitA = createRadioBoxEle("1.5秒", "80px", "requestWait", "requestWaitClass", "request1");
    var requestWaitB = createRadioBoxEle("2.0秒", "60px", "requestWait", "requestWaitClass", "request2");
    var requestWaitC = createRadioBoxEle("3.0秒", "40px", "requestWait", "requestWaitClass", "request3");
    var requestWaitD = createRadioBoxEle("4.5秒", "20px", "requestWait", "requestWaitClass", "request4");
    bodyElement.appendChild(titleRequest);
    bodyElement.appendChild(requestWaitA);
    bodyElement.appendChild(requestWaitB);
    bodyElement.appendChild(requestWaitC);
    bodyElement.appendChild(requestWaitD);

    var soundSwitch = createCheckBoxEle("提醒", "362px", "soundSwitch", Number(sessionStorage.getItem("soundSwitch")) === 0 ? Boolean(1) : Boolean(0));
    soundSwitch.firstChild.removeAttribute("class");
    soundSwitch.firstChild.setAttribute("id", "soundSwitch");
    bodyElement.appendChild(soundSwitch);

    var locationsElements = document.getElementsByClassName("currentAreaClass");
    for (var x = 0; x < locationsElements.length; x++) {
        locationsElements[x].onclick = function () {
            var locationsNow = document.getElementsByClassName("currentAreaClass");
            var finalLocation = "";
            for (var index = 0; index < locationsNow.length; index++) {
                if (locationsNow[index].checked) {
                    sessionStorage.setItem(fixedSimple[index], "0");
                    if (finalLocation === "") {
                        finalLocation = finalLocation + fixedCenter[index];
                    } else {
                        finalLocation = finalLocation + "/" + fixedCenter[index];
                    }
                } else {
                    sessionStorage.setItem(fixedSimple[index], "1");
                }
            }
            if (finalLocation === "") {
                startMonitor.disabled = true;
                alert("请至少选择监控一个区域！！！")
            } else {
                startMonitor.disabled = false;
            }
            currentArea = finalLocation.split("/");
            console.log("[AutoScript] - Areas changed: " + currentArea.toString());
        }
    }

    var speedElements = document.getElementsByClassName("speedClass");
    for (var y = 0; y < speedElements.length; y++) {
        speedElements[y].onclick = function () {
            sessionStorage.setItem("speed", this.getAttribute("id").replace("speed", ""));
            speed = Number(this.value.replace("倍", ""));
            console.log("[AutoScript] - Areas toggle speed changed: " + speed);
        }
    }

    var requestElements = document.getElementsByClassName("requestWaitClass");
    for (var z = 0; z < requestElements.length; z++) {
        requestElements[z].onclick = function () {
            sessionStorage.setItem("requestWait", this.getAttribute("id").replace("request", ""));
            delay = Number(this.value.replace("秒", "")) * 1000;
            console.log("[AutoScript] - Process interval changed: " + delay + "ms");
        }
    }

    soundSwitch.firstChild.onclick = function () {
        if (this.checked) {
            console.log("[AutoScript] - Hint is on.")
            sessionStorage.setItem("soundSwitch", "0");
        } else {
            console.log("[AutoScript] - Hint is off.")
            sessionStorage.setItem("soundSwitch", "1");
        }
    }

    eraseLog.onclick = function () {
        displayInfo.innerHTML = "";
        msgCounter = 0;
        sessionStorage.setItem("history", "");
        sessionStorage.setItem("msgCounter", "0");
    }

    hideMonitor.onclick = function () {
        hideComponent("part");
    };

    showMonitor.onclick = function () {
        showComponent();
    }

    stopMonitor.onclick = function () {
        window.clearTimeout(idTimeout);
        hideComponent("all")

        interfaceCover.innerHTML = "程序停止中，请稍后...";
        addMessage(getDate() + " 监控服务结束");
        addMessage("==============================");

        var ulNav = document.getElementById("s_sctrl_tabScreen").firstChild;
        var homePageTag = ulNav.getElementsByTagName("li")[0];
        homePageTag.firstChild.click();

        window.setTimeout(function () {
            console.log("[AutoScript] - Stop & Refreshing.")
            sessionStorage.setItem("gz", gzLocation.firstChild.checked === true ? "0" : "1");
            sessionStorage.setItem("fs", fsLocation.firstChild.checked === true ? "0" : "1");
            sessionStorage.setItem("zs", zsLocation.firstChild.checked === true ? "0" : "1");
            sessionStorage.setItem("zj", zjLocation.firstChild.checked === true ? "0" : "1");
            sessionStorage.setItem("soundSwitch", soundSwitch.firstChild.checked === true ? "0" : "1");
            sessionStorage.setItem("history", displayInfo.innerHTML);
            sessionStorage.setItem("msgCounter", String(msgCounter));
            sessionStorage.setItem("processStatus", "stop");
            window.location.reload();
        }, delay);
    }

    startMonitor.onclick = function () {
        sessionStorage.setItem("processStatus", "start");

        bodyElement.style.overflow = "hidden";
        bodyElement.style.cursor = "default";

        interfaceCover.innerHTML = "程序持续运行中...";
        addMessage(getDate() + " 监控服务开始");

        this.innerHTML = "监控中.."
        this.disabled = true;
        stopMonitor.disabled = false;
        hideMonitor.disabled = true;
        eraseLog.disabled = true;
        interfaceCover.style.display = "inline-block";
        gzLocation.firstChild.disabled = true;
        fsLocation.firstChild.disabled = true;
        zsLocation.firstChild.disabled = true;
        zjLocation.firstChild.disabled = true;
        speedA.firstChild.disabled = true;
        speedB.firstChild.disabled = true;
        speedC.firstChild.disabled = true;
        requestWaitA.firstChild.disabled = true;
        requestWaitB.firstChild.disabled = true;
        requestWaitC.firstChild.disabled = true;
        requestWaitD.firstChild.disabled = true;

        main();
    }

    var storedProcess = sessionStorage.getItem("processStatus");
    if (storedProcess === null || storedProcess === "stop") {
        displayInfo.innerHTML = sessionStorage.getItem("history");
    } else {
        displayInfo.innerHTML = sessionStorage.getItem("history");
        addMessage(getDate() + " 用户主动刷新");
        addMessage(getDate() + " 监控服务结束");
        addMessage("==============================");
        sessionStorage.setItem("processStatus", "stop");
    }

    var storedSpeed = sessionStorage.getItem("speed");
    switch (storedSpeed) {
        case "1":
            speedA.firstChild.checked = true;
            speed = 2;
            break;
        case "2":
            speedB.firstChild.checked = true;
            speed = 4;
            break;
        case "3":
            speedC.firstChild.checked = true;
            speed = 8;
            break;
        default:
            speedA.firstChild.checked = true;
            speed = 2;
            sessionStorage.setItem("speed", "1");
    }

    var storedRequest = sessionStorage.getItem("requestWait");
    switch (storedRequest) {
        case "1":
            requestWaitA.firstChild.checked = true;
            delay = 1500;
            break;
        case "2":
            requestWaitB.firstChild.checked = true;
            delay = 2000;
            break;
        case "3":
            requestWaitC.firstChild.checked = true;
            delay = 3000;
            break;
        case "4":
            requestWaitD.firstChild.checked = true;
            delay = 4500;
            break;
        default:
            requestWaitB.firstChild.checked = true;
            delay = 2000;
            sessionStorage.setItem("requestWait", "2");
    }

    var storedSound = sessionStorage.getItem("soundSwitch");
    if (storedSound === "1") {
        soundSwitch.firstChild.checked = false;
    } else {
        soundSwitch.firstChild.checked = true;
    }

    var scriptStartCounter = "";
    var locationsNow = document.getElementsByClassName("currentAreaClass");
    for (var index = 0; index < locationsNow.length; index++) {
        if (locationsNow[index].checked) {
            if (scriptStartCounter === "") {
                scriptStartCounter = scriptStartCounter + fixedCenter[index];
            } else {
                scriptStartCounter = scriptStartCounter + "/" + fixedCenter[index];
            }
        }
    }
    startMonitor.disabled = (scriptStartCounter === "");
    currentArea = scriptStartCounter.split("/");

    displayInfo.scrollTop = msgHeight * msgCounter;

    hideComponent("part");

    console.log("[AutoScript] - Script ready.")
    console.log("[AutoScript] - Monitor areas: " + currentArea.toString());
    console.log("[AutoScript] - Area toggle speed: " + speed + "x");
    console.log("[AutoScript] - Process run interval: " + delay + "ms");

    if (sessionStorage.getItem("reload") === "1") {
        sessionStorage.removeItem("reload");

        console.log("[AutoScript] - Recover from error.")

        bodyElement.style.overflow = "hidden";
        bodyElement.style.cursor = "default";

        interfaceCover.innerHTML = "程序正在从异常中恢复...";

        startMonitor.innerHTML = "监控中.."
        startMonitor.disabled = true;
        stopMonitor.disabled = false;
        hideMonitor.disabled = true;
        eraseLog.disabled = true;
        interfaceCover.style.display = "inline-block";
        gzLocation.firstChild.disabled = true;
        fsLocation.firstChild.disabled = true;
        zsLocation.firstChild.disabled = true;
        zjLocation.firstChild.disabled = true;
        speedA.firstChild.disabled = true;
        speedB.firstChild.disabled = true;
        speedC.firstChild.disabled = true;
        requestWaitA.firstChild.disabled = true;
        requestWaitB.firstChild.disabled = true;
        requestWaitC.firstChild.disabled = true;
        requestWaitD.firstChild.disabled = true;

        showComponent();
        addMessage(getDate() + " 服务恢复中..");

        idTimeout = window.setTimeout(function () {
            addMessage(getDate() + " 恢复成功！");
            addMessage("==============================");
            interfaceCover.innerHTML = "程序持续运行中...";
            addMessage(getDate() + " 监控服务开始");

            main();
        }, delay * speed);
    } else if (sessionStorage.getItem("reload") === "-1") {
        var infoA = sessionStorage.getItem("crashInfoA");
        var infoB = sessionStorage.getItem("crashInfoB");
        var infoC = sessionStorage.getItem("crashInfoC");

        alert("本次会话异常次数到达上限（3次）：\r\n" +
            "第一次异常时间：" + infoA + "\r\n" +
            "第二次异常时间：" + infoB + "\r\n" +
            "第三次异常时间：" + infoC + "\r\n\r\n" +
            "1.网络不佳的情况下，推荐选择较长的“等待时间”；\r\n" +
            "2.如是系统问题，则推荐喝杯茶等待恢复。\r\n\r\n" +
            "点击“确定”以重置异常数据，控件本身无异常，排查以上问题后，可手动再次运行服务。")

        sessionStorage.removeItem("crashInfoA")
        sessionStorage.removeItem("crashInfoB")
        sessionStorage.removeItem("crashInfoC")
        sessionStorage.removeItem("reload");

        addMessage(getDate() + " 异常清理中..");
        showComponent();
        addMessage(getDate() + " 清理成功！");
        addMessage("==============================");
    }

    async function main() {
        console.log("[AutoScript] - Start monitor...");
        console.log("[AutoScript] - Monitor areas: " + currentArea.toString());
        console.log("[AutoScript] - Current monitor area: " + currentArea[indexArea]);
        console.log("[AutoScript] - Area toggle speed: " + speed + "x");
        console.log("[AutoScript] - Process run interval: " + delay + "ms");

        while (await clickA() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickA] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickA");

        while (await clickB() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickB] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickB");

        while (await clickC() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickC] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickC");

        while (await clickD() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickD] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickD");

        while (await clickE() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickE] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickE");

        while (await clickF() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickF] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickF");

        while (await clickG() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickG] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickG");

        while (await clickH() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickH] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickH");

        while (await clickI() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickI] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickI");

        while (await clickJ() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickJ] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickJ");

        while (await clickK() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickK] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickK");

        while (await clickL() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickL] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickL");

        while (await clickM() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickM] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickM");

        while (await clickN() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickN] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickN");

        while (await clickO() !== "success.") {
            if (--retryTimes === 0) {
                console.log("[AutoScript] - [clickO] Connection timeout.");
                errorHandler();
                return;
            }
        }
        resetVar("clickO");

        console.log("[AutoScript] - Monitor finish.")

        idTimeout = window.setTimeout(function () {
            main();
        }, delay * speed);
    }

    async function errorHandler() {
        window.stop();

        window.clearTimeout(idTimeout);
        hideComponent("all")

        interfaceCover.innerHTML = "程序捕捉到网络或系统异常，正在重置服务，请稍后...";
        addMessage(getDate() + " 监控服务结束");
        addMessage("==============================");

        var counter;

        counter = 3;
        while (await pageHome() !== "success.") {
            if (--counter <= 0) {
                // TODO 跳转首页失败后的逻辑，此处跳出循环直接刷新当前页面
                break;
            }
        }

        counter = 3;
        while (await pageRefresh() !== "success.") {
            if (--counter <= 0) {
                interfaceCover.innerHTML = "抱歉！异常处理失败，请手动刷新并重启服务。";
                return;
            }
        }
    }

    function pageHome() {
        return new Promise(resolve => {
            try {
                console.log("[AutoScript] - [pageHome] Requesting homepage.");
                document
                    .getElementById("s_sctrl_tabScreen").firstChild
                    .getElementsByTagName("li")[0].firstChild.click();
                resolve("success.");
            } catch (e) {
                console.log("[AutoScript] - [Error] " + e);
                resolve("failure.");
            }
        })
    }

    function pageRefresh() {
        return new Promise(resolve => {
            window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [pageRefresh] Refreshing system page.");
                    sessionStorage.setItem("gz", gzLocation.firstChild.checked === true ? "0" : "1");
                    sessionStorage.setItem("fs", fsLocation.firstChild.checked === true ? "0" : "1");
                    sessionStorage.setItem("zs", zsLocation.firstChild.checked === true ? "0" : "1");
                    sessionStorage.setItem("zj", zjLocation.firstChild.checked === true ? "0" : "1");
                    sessionStorage.setItem("soundSwitch", soundSwitch.firstChild.checked === true ? "0" : "1");
                    sessionStorage.setItem("history", displayInfo.innerHTML);
                    sessionStorage.setItem("msgCounter", String(msgCounter));
                    sessionStorage.setItem("processStatus", "stop");
                    switch (Number(sessionStorage.getItem("crashTimes"))) {
                        case 0:
                            sessionStorage.setItem("crashTimes", "1");
                            sessionStorage.setItem("crashInfoA", getDate());
                            sessionStorage.setItem("reload", "1");
                            break;
                        case 1:
                            sessionStorage.setItem("crashTimes", "2");
                            sessionStorage.setItem("crashInfoB", getDate());
                            sessionStorage.setItem("reload", "1");
                            break;
                        default:
                            sessionStorage.removeItem("crashTimes");
                            sessionStorage.setItem("crashInfoC", getDate());
                            sessionStorage.setItem("reload", "-1");
                    }
                    window.location.reload();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);

        })
    }

    function clickA() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickA] Targeting function user defined menu.");
                    document
                        .getElementById("s_0").getElementsByClassName("siebui-appmenu-item ui-menubar-item")[5]
                        .lastChild.lastChild.getElementsByTagName("a")[0].click();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickB() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickB] Targeting function for position page.");
                    document
                        .getElementById("s_sctrl_tabView").firstChild
                        .getElementsByTagName("li")[3].firstChild.click();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickC() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickC] Changing position.");
                    var position = document
                        .getElementById("s_1_l").firstChild
                        .getElementsByClassName("ui-state-highlight")[0].lastChild.innerHTML;

                    if (!position.includes(currentArea[indexArea])) {
                        var index = -1;
                        switch (currentArea[indexArea]) {
                            case "广州":
                                index = 1;
                                break;
                            case "佛山":
                                index = 2;
                                break;
                            case "中山":
                                index = 3;
                                break;
                            case "湛江":
                                index = 4;
                                break;
                            default:
                                throw SyntaxError();
                        }

                        document.getElementById("s_1_l").firstChild.getElementsByTagName("tr")[index].click();
                        document.getElementById("s_1_1_0_0_Ctrl").click();
                    }
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickD() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickD] Confirm current position.");
                    var position = document
                        .getElementById("s_1_l").firstChild.getElementsByClassName("ui-state-highlight")[0]
                        .lastChild.innerHTML.replace("广东", "").replace("信息员", "");
                    if (!position.includes(currentArea[indexArea])) {
                        throw SyntaxError();
                    }
                    var fullInfo = getDate() + " " + position;
                    addMessage(fullInfo, 'style="margin-top: 8px; margin-bottom: 2px;"');
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickE() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickE] Jumping to complain session card.");
                    var ulNav = document.getElementById("s_sctrl_tabScreen").firstChild;
                    var targetTag = ulNav.getElementsByTagName("li")[2];

                    targetTag.firstChild.click();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickF() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickF] Requesting normal orders page.");
                    document
                        .getElementById("s_sctrl_tabView").firstChild
                        .getElementsByTagName("li")[0].firstChild.click();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickG() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickG] Requesting today's normal orders page.");
                    var todayUrgent = document.getElementsByName("s_pdq")[0].getElementsByTagName("option")[7];

                    todayUrgent.selected = true;
                    todayUrgent.click();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickH() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickH] Recording first task's logs.");
                    orderCounterA("诉求 - 未处理紧急诉求（本日）: ");
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickI() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickI] Requesting complain orders page.");
                    document
                        .getElementById("s_sctrl_tabView").firstChild
                        .getElementsByTagName("li")[2].firstChild.click();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickJ() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickJ] Requesting today's complain orders page.");
                    var todayUrgent = document.getElementsByName("s_pdq")[0].getElementsByTagName("option")[9];

                    todayUrgent.selected = true;
                    todayUrgent.click();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickK() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickK] Recording second task's logs.");
                    orderCounterB("投诉 - 本日创建的诉求（新建）: ");
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickL() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickL] Requesting urgent orders page.");
                    document
                        .getElementById("s_sctrl_tabView").firstChild
                        .getElementsByTagName("li")[8].firstChild.click();
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickM() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickM] Recording third task's logs.");
                    orderCounterC("催单 - 当日催单诉求（未处理）: ");
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    /**
     * TODO 提示音采用了网络的音源，可能会出现无法加载的情况
     */
    function clickN() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickN] Play hint or not.");
                    if (playHint > 0 && soundSwitch.firstChild.checked) {
                        audioElement.play();
                    }
                    playHint = 0;
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function clickO() {
        return new Promise(resolve => {
            idTimeout = window.setTimeout(function () {
                try {
                    console.log("[AutoScript] - [clickO] Changing area's index.");
                    if (++indexArea >= currentArea.length) {
                        indexArea = 0;
                    }
                    resolve("success.");
                } catch (e) {
                    console.log("[AutoScript] - [Error] " + e);
                    resolve("failure.");
                }
            }, delay);
        })
    }

    function orderCounterA(message) {
        var tbodyElement = document.getElementById("s_1_l").firstChild;
        var orderQuantity = tbodyElement.getElementsByTagName("tr").length - 1;
        if (orderQuantity === 50) {
            throw new Error("Page incorrect.");
        }
        if (orderQuantity > 0) {
            addMessage(message + orderQuantity, 'style="color: rgb(255, 66, 93);"');
            playHint++;
        } else {
            addMessage(message + orderQuantity);
        }
    }

    function orderCounterB(message) {
        var tbodyElement = document.getElementById("s_1_l").firstChild;
        var limitation = tbodyElement.getElementsByTagName("tr").length;
        if (limitation === 51) {
            throw new Error("Page incorrect.");
        }
        if (limitation === 1) {
            addMessage(message + 0);
            return;
        }

        var suffix = "_s_1_l_FT_Process_Status";
        var orderQuantity = 0;
        for (var i = 1; i < limitation; i++) {
            if (document.getElementById(i + suffix).innerHTML === "新建") {
                orderQuantity++;
            }
        }
        if (orderQuantity > 0) {
            addMessage(message + orderQuantity, 'style="color: rgb(255, 66, 93);"');
            playHint++;
        } else {
            addMessage(message + orderQuantity);
        }
    }

    function orderCounterC(message) {
        var columnName = document.getElementById("jqgh_s_1_l_FT_Collection_Result").innerText;
        var tbodyElement = document.getElementById("s_1_l").firstChild;
        var limitation = tbodyElement.getElementsByTagName("tr").length;
        if (columnName === "催单处理结果" && limitation === 1) {
            addMessage(message + 0);
            return;
        }

        var suffix = "_s_1_l_FT_Collection_Result";
        var orderQuantity = 0;
        for (var i = 1; i < limitation; i++) {
            if (document.getElementById(i + suffix).innerHTML === "未处理") {
                orderQuantity++;
            }
        }
        if (orderQuantity > 0) {
            addMessage(message + orderQuantity);
            playHint++;
        } else {
            addMessage(message + orderQuantity);
        }
    }

    function resetVar(thread) {
        console.log("[AutoScript] - [" + thread + "] Successful.");
        retryTimes = 10;
    }

    function createTitleDivEle(title, pixel) {
        var htmlDivElement = document.createElement("div");
        var titleTextNode = document.createTextNode(title);

        htmlDivElement.appendChild(titleTextNode);

        htmlDivElement.style.position = "fixed";
        htmlDivElement.style.left = "353px";
        htmlDivElement.style.bottom = pixel;
        htmlDivElement.style.zIndex = "100";
        htmlDivElement.style.fontFamily = "Consolas, Microsoft YaHei";
        htmlDivElement.style.fontSize = "14px";

        return htmlDivElement;
    }

    /**
     * TODO 此函数非通用函数，其中包括了class属性的配置，待更新为通用函数
     */
    function createCheckBoxEle(location, pixel, checked) {
        var htmlDivElement = document.createElement("div");
        var htmlInputElement = document.createElement("input");
        var locationTextNode = document.createTextNode(location);

        htmlInputElement.setAttribute("type", "checkbox");
        htmlInputElement.setAttribute("value", location);

        htmlDivElement.appendChild(htmlInputElement);
        htmlDivElement.appendChild(locationTextNode);

        htmlInputElement.style.verticalAlign = "bottom";
        htmlInputElement.style.marginRight = "13px";
        htmlInputElement.setAttribute("class", "currentAreaClass");
        htmlInputElement.checked = checked;

        htmlDivElement.style.position = "fixed";
        htmlDivElement.style.left = "350px";
        htmlDivElement.style.bottom = pixel;
        htmlDivElement.style.zIndex = "100";
        htmlDivElement.style.fontFamily = "Consolas, Microsoft YaHei";
        htmlDivElement.style.fontSize = "14px";

        return htmlDivElement;
    }

    function createRadioBoxEle(ele, pixel, name, className, id) {
        var htmlDivElement = document.createElement("div");
        var htmlInputElement = document.createElement("input");
        var locationTextNode = document.createTextNode(ele);

        htmlInputElement.setAttribute("type", "radio");
        htmlInputElement.setAttribute("name", name);
        htmlInputElement.setAttribute("value", ele);
        htmlInputElement.setAttribute("id", id);

        htmlDivElement.appendChild(htmlInputElement);
        htmlDivElement.appendChild(locationTextNode);

        htmlInputElement.style.verticalAlign = "middle";
        htmlInputElement.style.marginLeft = "3px";
        htmlInputElement.style.marginRight = "5px";
        htmlInputElement.style.marginTop = "-2px";
        htmlInputElement.setAttribute("class", className);

        htmlDivElement.style.position = "fixed";
        htmlDivElement.style.left = "350px";
        htmlDivElement.style.bottom = pixel;
        htmlDivElement.style.zIndex = "100";
        htmlDivElement.style.fontFamily = "Consolas, Microsoft YaHei";
        htmlDivElement.style.fontSize = "14px";

        return htmlDivElement;
    }

    function addMessage(message, style) {
        if (style !== null) {
            displayInfo.innerHTML = displayInfo.innerHTML + "<div " + style + ">" + message + "</div>";
        } else {
            displayInfo.innerHTML = displayInfo.innerHTML + "<div>" + message + "</div>";
        }
        displayInfo.scrollTop = msgHeight * ++msgCounter;
        sessionStorage.setItem("history", displayInfo.innerHTML);
        sessionStorage.setItem("msgCounter", String(msgCounter));
    }

    function hideComponent(ele) {
        startMonitor.style.display = "none";
        stopMonitor.style.display = "none";
        hideMonitor.style.display = "none";
        eraseLog.style.display = "none";
        displayInfo.style.display = "none";
        titleLocation.style.display = "none";
        gzLocation.style.display = "none";
        fsLocation.style.display = "none";
        zsLocation.style.display = "none";
        zjLocation.style.display = "none";
        titleInterval.style.display = "none";
        speedA.style.display = "none";
        speedB.style.display = "none";
        speedC.style.display = "none";
        titleRequest.style.display = "none";
        requestWaitA.style.display = "none";
        requestWaitB.style.display = "none";
        requestWaitC.style.display = "none";
        requestWaitD.style.display = "none";
        soundSwitch.style.display = "none";
        if (ele === "part") {
            showMonitor.style.display = "inline-block";
        }
    }

    function showComponent() {
        startMonitor.style.display = "inline-block";
        stopMonitor.style.display = "inline-block";
        hideMonitor.style.display = "inline-block";
        eraseLog.style.display = "inline-block";
        displayInfo.style.display = "inline-block";
        showMonitor.style.display = "none";
        titleLocation.style.display = "inline-block";
        gzLocation.style.display = "inline-block";
        fsLocation.style.display = "inline-block";
        zsLocation.style.display = "inline-block";
        zjLocation.style.display = "inline-block";
        titleInterval.style.display = "inline-block";
        speedA.style.display = "inline-block";
        speedB.style.display = "inline-block";
        speedC.style.display = "inline-block";
        titleRequest.style.display = "inline-block";
        requestWaitA.style.display = "inline-block";
        requestWaitB.style.display = "inline-block";
        requestWaitC.style.display = "inline-block";
        requestWaitD.style.display = "inline-block";
        soundSwitch.style.display = "inline-block";
    }

    function getDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var fullDate = year + "/" + month + "/" + day;

        var hours = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
        var mins = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        var time = hours + ":" + mins;

        return "[" + fullDate + " " + time + "]";
    }
})();