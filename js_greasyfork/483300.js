// ==UserScript==
// @name         NovelAI 自定义连点器
// @namespace    https://novelai.net
// @match        https://novelai.net/image
// @icon         https://novelai.net/_next/static/media/goose_blue.1580a990.svg
// @license      MIT
// @version      2.8
// @author       Takoro
// @description  自定义点击间隔以及插入随机值，[重复Seed/消耗Anlas]防呆，禁用Generate Variations，请勿滥用，频率请自行斟酌，不负责高频率使用后果，粗制滥造还望海涵。少代码部分参考：LigHT。
// @downloadURL https://update.greasyfork.org/scripts/483300/NovelAI%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%9E%E7%82%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/483300/NovelAI%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%9E%E7%82%B9%E5%99%A8.meta.js
// ==/UserScript==

console.log("NovelAI 自定义连点器 ver2.8");

// 目标按钮class
var button_class;

var loopTime = 6000;
var randomTime = 1000;
var tmpTime;
var anlasConsume;

// 计时器
var interval;

// 位移坐标计算
var initX, initY, containerX, containerY;

// xpath路径
// 按钮 /html/body/div[1]/div[2]/div[4]/div[1]/div[5]/button
// 按钮内div /html/body/div[1]/div[2]/div[4]/div[1]/div[5]/button/div

var xpathExpression = "//button[span[text()='Generate 1 Image']]";

var anlasXpath =
    "/html/body/div[2]/div[2]/div[3]/div[3]/div[1]/div[1]/div[5]/button/div/div[1]/span";
var seedXpath =
    "/html/body/div[2]/div[2]/div[3]/div[3]/div[1]/div[1]/div[5]/div/div/div/div[3]/button/span";

// 目标元素验证
var targetElement;

function resetSeed() {
    let seedSpan = document.evaluate(
        seedXpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
    let event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
    });
    seedSpan.dispatchEvent(event);
}

function elmClick(elmXpath) {
    let button = document.evaluate(
        elmXpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if(button){
        let event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        });
        button.dispatchEvent(event);}
    else{
        //     console.log("元素未找到！");
    }
}

function findingButton() {
    let result = document.evaluate(
        xpathExpression,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    targetElement = result.singleNodeValue;
}

function findingAnlas() {
    let result = document.evaluate(
        anlasXpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    anlasConsume = result.singleNodeValue.innerText;
    if (anlasConsume > 0) {
        let continueExecution = confirm("你要消耗Anlas进行瑟瑟吗？");
        if (!continueExecution) {
            return false;
        }
    } else {
        // console.log("未检测到Anlas，默认return ture");
    }
    // console.log("Anlas消耗:" + anlasConsume);
    return true;
}

// 计时循环查找元素，等待页面加载完成
var intervalId = setInterval(function () {
    findingButton();
    if (targetElement) {
        clearInterval(intervalId);
        button_class = targetElement.getAttribute("class");
        console.log("获取到的随机 class 名为：" + button_class);
        createComponent();
    } else {
        console.log("未找到符合条件的元素");
    }
}, 3000);

function createComponent() {
    var container = document.createElement("div");
    container.style.height = "34px";
    container.style.position = "fixed";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.bottom = "90px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.userSelect = "none";
    container.style.zIndex = "999";
    document.body.appendChild(container);

    var button = document.createElement("button");
    button.innerHTML = "Start";
    button.style.backgroundColor = "rgb(34, 37, 63)";
    button.style.color = "rgb(245 243 194)";
    button.style.border = "0.1px solid rgb(245 243 194)";
    button.style.height = "34px";
    button.style.paddingLeft = "10px";
    button.style.paddingRight = "10px";
    button.style.borderRadius = "3px";
    button.style.fontFamily = "Source Sans Pro";
    button.style.fontSize = "15px";
    button.style.userSelect = "none";
    button.style.cursor = "pointer";
    container.appendChild(button);

    var customGenerate = document.createElement("button");
    customGenerate.title = "按下后，清除图生图和重绘，再生成图像同时清除Seed；可以用作单次生成键使用。";
    customGenerate.style.height = "34px";
    customGenerate.style.width = "34px";
    customGenerate.innerHTML = "↺";
    customGenerate.style.color = "rgb(245 243 194)";
    customGenerate.style.backgroundSize = "14px 14px";
    customGenerate.style.backgroundRepeat = "no-repeat";
    customGenerate.style.backgroundPosition = "center";
    customGenerate.style.backgroundColor = "rgb(34, 37, 63)";
    customGenerate.style.border = "0.1px solid rgb(245, 243, 194)";
    customGenerate.style.borderRadius = "3px";
    customGenerate.style.userSelect = "none";
    customGenerate.style.cursor = "pointer";
    container.appendChild(customGenerate);

    var input = document.createElement("input");
    input.type = "number";
    input.placeholder = "间隔: " + parseInt(loopTime / 1000) + "s";
    input.style.width = "70px";
    input.style.height = "34px";
    input.style.padding = "6px 6px 5px 6px";
    input.style.backgroundColor = "rgb(34, 37, 63)";
    input.style.userSelect = "none";
    container.appendChild(input);

    var random = document.createElement("input");
    random.type = "number";
    random.placeholder = "± " + parseInt(randomTime / 1000) + "s";
    random.style.width = "35px";
    random.style.height = "34px";
    random.style.padding = "6px 1px 5px 6px";
    random.style.backgroundColor = "rgb(34, 37, 63)";
    random.style.userSelect = "none";
    container.appendChild(random);

    var buttonGv = document.createElement("button");
    buttonGv.title = "点击后可以禁用Generate Variations，再次点击启用。";
    buttonGv.style.height = "34px";
    buttonGv.style.width = "34px";
    buttonGv.style.backgroundImage =
        'url("/_next/static/media/variations.d35c8a3a.svg")';
    buttonGv.style.backgroundSize = "14px 14px";
    buttonGv.style.backgroundRepeat = "no-repeat";
    buttonGv.style.backgroundPosition = "center";
    buttonGv.style.backgroundColor = "rgb(34, 37, 63)";
    buttonGv.style.border = "0.1px solid rgb(245, 243, 194)";
    buttonGv.style.borderRadius = "3px";
    buttonGv.style.userSelect = "none";
    buttonGv.style.cursor = "pointer";
    container.appendChild(buttonGv);

    var mover = document.createElement("button");
    mover.innerHTML = "↔";
    mover.title = "长按此元素拖动脚本窗口移动。";
    mover.style.display = "flex";
    mover.style.alignItems = "center";
    mover.style.backgroundColor = "rgb(34, 37, 63)";
    mover.style.color = "rgb(245 243 194)";
    mover.style.border = "0.1px solid rgb(245 243 194)";
    mover.style.height = "34px";
    mover.style.paddingLeft = "10px";
    mover.style.paddingRight = "10px";
    mover.style.borderRadius = "3px";
    mover.style.fontFamily = "Source Sans Pro";
    mover.style.fontSize = "20px";
    mover.style.userSelect = "none";
    mover.style.cursor = "pointer";
    container.appendChild(mover);

    mover.addEventListener("mousedown", function (e) {
        initX = e.pageX;
        initY = e.pageY;
        containerX = container.offsetLeft;
        containerY = container.offsetTop;
        document.addEventListener("mousemove", mouseMoveHandler);
    });

    function mouseMoveHandler(e) {
        var moveX = e.pageX - initX;
        var moveY = e.pageY - initY;
        container.style.left = containerX + moveX + "px";
        container.style.top = containerY + moveY + "px";
    }

    document.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", mouseMoveHandler);
    });

    function clickElement() {
        if (getRandomInt(0, 9) % 2 == 0) {
            tmpTime = loopTime + getRandomInt(0, randomTime);
        } else {
            tmpTime = loopTime - getRandomInt(0, randomTime);
        }
        // console.log("下一次点击间隔为:" + tmpTime / 1000);
        var target = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let clickevent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
        });
        // console.log('target:', target);
        if (target) {
            target.dispatchEvent(clickevent);
        } else {
            console.error('target 未定义，选择器可能有误');
        }
        // 在运行一次后清除seed
        resetSeed();
        clearInterval(interval);
        interval = null;
        interval = setInterval(clickElement, tmpTime);
        // console.log("计时器:" + interval);
    }

    button.onclick = function () {
        if (interval) {
            clearInterval(interval);
            interval = null;
            // console.log("计时器销毁:" + interval);
            button.innerHTML = "Start";
        } else {
            if (findingAnlas()) {
                clickElement();
                // console.log("启动计时器:" + tmpTime);
                button.innerHTML = "Pause";
            }
        }
    };

    // gv = Generate Variations
    var disableGv = true;

    setInterval(function () {
        let gvXpath =
            "/html/body/div[2]/div[2]/div[3]/div[3]/div/div[2]/div[4]/div[1]/div/div/div/div[2]/button";
        let gvButton = document.evaluate(
            gvXpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (gvButton !== null) {
            if (disableGv) {
                gvButton.disabled = true;
                buttonGv.style.border = "none";
            } else {
                gvButton.disabled = false;
                buttonGv.style.border = "0.1px solid rgb(245, 243, 194)";
            }
        }
    }, 1000);

    customGenerate.onclick = function () {
        let i2iXpath1 =
            "/html/body/div[2]/div[2]/div[3]/div[3]/div/div[1]/div[3]/div[2]/div/div[2]/div/div/div[1]/div[2]/div/button[2]";
        let i2iXpath =
            "/html/body/div[2]/div[2]/div[3]/div[3]/div/div[1]/div[3]/div[2]/div/div[2]/div/div/div[2]/div/button[2]";
        let inpanitXpath1 =
            "/html/body/div[2]/div[2]/div[3]/div[3]/div/div[1]/div[3]/div[2]/div/div[2]/div/div[1]/div[2]/div/button[2]";
        let inpanitXpath =
            "/html/body/div[2]/div[2]/div[3]/div[3]/div/div[1]/div[3]/div[2]/div/div[2]/div/div/div[2]/div/button[2]";

        if(findingAnlas()){
            elmClick(i2iXpath);
            elmClick(inpanitXpath);
            elmClick(i2iXpath1);
            elmClick(inpanitXpath1);

            setTimeout(function() {
                elmClick(xpathExpression);
            }, 600);
            setTimeout(function() {
                resetSeed();
            }, 1000);
        }

    };

    buttonGv.onclick = function () {
        let gvXpath =
            "/html/body/div[2]/div[2]/div[3]/div[3]/div/div[2]/div[4]/div[1]/div/div/div/div[2]/button";
        let gvButton = document.evaluate(
            gvXpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (disableGv) {
            disableGv = false;
            buttonGv.style.border = "0.1px solid rgb(245, 243, 194)";
        } else {
            disableGv = true;
            buttonGv.style.border = "none";
        }
    };

    input.onchange = function () {
        loopTime = parseInt(input.value) * 1000;
        // console.log("设置间隔:" + loopTime);
        input.value = "";
        input.placeholder = "间隔: " + parseInt(loopTime / 1000) + "s";
    };

    random.onchange = function () {
        randomTime = parseInt(random.value) * 1000;
        // console.log("随机间隔:" + randomTime);
        random.value = "";
        random.placeholder = "± " + parseInt(randomTime / 1000) + "s";
    };

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
