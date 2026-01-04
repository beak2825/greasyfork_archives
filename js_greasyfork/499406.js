// ==UserScript==
// @name         问卷星_大塘卫生院专供
// @namespace    https:www.yowayimono.cn
// @version      0.4.1
// @description  用于大塘卫生院问卷调查
// @author       Yowayimono
// @match        https://www.wjx.cn/*
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/499406/%E9%97%AE%E5%8D%B7%E6%98%9F_%E5%A4%A7%E5%A1%98%E5%8D%AB%E7%94%9F%E9%99%A2%E4%B8%93%E4%BE%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/499406/%E9%97%AE%E5%8D%B7%E6%98%9F_%E5%A4%A7%E5%A1%98%E5%8D%AB%E7%94%9F%E9%99%A2%E4%B8%93%E4%BE%9B.meta.js
// ==/UserScript==

sessionStorage.clear();

(function() {
    'use strict';
    var url = "https://www.wjx.cn/vm/hS5amYI.aspx";
    if (window.location.href.includes("https://www.wjx.cn/wjx/join/complete")) {
        window.location.href = url;
    }

    var socre = [9,9.7, 9.5, 8, 8.8, 8.9,9.3, 9.4, 8.5,9.6];
    var appraise = [
        "医护人员服务态度非常好，让人感到温馨和安心。",
        "医院环境干净整洁，医护人员专业且细心。",
        "医生耐心解答我的疑问，让我对治疗充满信心。",
        "护士的服务态度非常亲切，让我感到非常满意。",
        "医院的医疗设备先进，医生的诊断准确。",
        "医护人员的服务效率高，让我节省了很多时间。",
        "医院的就诊流程清晰，服务人员态度友好。",
        "医生的治疗方案专业，护士的护理工作细致。",
        "医院的环境舒适，医护人员的服务态度让人感到温暖。",
        "医生的医术高超，护士的服务态度让人感到放心。",
        "医院的医疗服务周到，医护人员的沟通能力很强。",
        "医生的治疗效果显著，护士的护理工作到位。",
        "医院的就诊环境安静，医护人员的服务态度让人感到舒适。",
        "医生的诊断准确，护士的护理工作专业。",
        "医院的医疗服务态度好，医护人员的服务效率高。",
        "医生的治疗方案合理，护士的护理工作细心。",
        "医院的就诊流程简单，医护人员的服务态度让人满意。",
        "医生的医术精湛，护士的服务态度让人感到温馨。",
        "医院的医疗服务专业，医护人员的服务态度让人感到尊重。",
        "医生的治疗方案周到，护士的护理工作专业。",
        "医院的就诊环境舒适，医护人员的服务态度让人感到安心。",
        "医生的诊断准确，护士的护理工作细心。",
        "医院的医疗服务态度好，医护人员的服务效率高。",
        "医生的治疗方案专业，护士的护理工作到位。",
        "医院的就诊流程清晰，医护人员的服务态度让人感到满意。",
        "医生的医术高超，护士的服务态度让人感到放心。",
        "医院的医疗服务周到，医护人员的沟通能力很强。",
        "医生的治疗效果显著，护士的护理工作专业。",
        "医院的就诊环境安静，医护人员的服务态度让人感到舒适。",
        "医生的诊断准确，护士的护理工作细心。",
        "医院的医疗服务态度好，医护人员的服务效率高。",
        "医生的治疗方案合理，护士的护理工作专业。",
        "医院的就诊流程简单，医护人员的服务态度让人感到满意。",
        "医生的医术精湛，护士的服务态度让人感到温馨。",
        "医院的医疗服务专业，医护人员的服务态度让人感到尊重。",
        "医生的治疗方案周到，护士的护理工作细心。",
        "医院的就诊环境舒适，医护人员的服务态度让人感到安心。",
        "医生的诊断准确，护士的护理工作专业。",
        "医院的医疗服务态度好，医护人员的服务效率高。",
        "医生的治疗方案专业，护士的护理工作到位。",
        "医院的就诊流程清晰，医护人员的服务态度让人感到满意。"
    ];

    function generateChinesePhoneNumbers(count) {
        const phoneNumbers = [];
        const prefixes = ['131', '132', '133', '134', '135', '136', '137', '138', '139', '147', '150', '151', '152', '153', '155', '156', '157', '158', '159', '166', '170', '171', '172', '173','167', '176', '177', '178', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];

        for (let i = 0; i < count; i++) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const suffix = Math.floor(Math.random() * 90000000) + 10000000; // 8 位随机数字
            const phoneNumber = prefix + suffix.toString();
            phoneNumbers.push(phoneNumber);
        }

        return phoneNumbers;
    }

    const phones = generateChinesePhoneNumbers(100);

    clearCookies();

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clearCookies() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        }
    }

    function doNext() {
        var nextButton = document.getElementById("divNext").querySelector("a");
        nextButton.click();
    }

    doNext();

    function setRandomInputValue(inputId, valueArray) {
        var inputElement = document.getElementById(inputId);
        var randomIndex = getRandomNumber(0, valueArray.length - 1);
        inputElement.value = valueArray[randomIndex];
        console.log("设置的值:", valueArray[randomIndex]);
    }

    setRandomInputValue("q1", phones);

    doNext();

    clickLayButton();

    function clickRandomRadio(container) {
        var radioElements = container.getElementsByClassName("ui-radio");
        var randomIndex = getRandomNumber(0, radioElements.length - 2);
        radioElements[randomIndex].click();
    }

    function clickLayButton() {
        var lay = document.getElementsByClassName("layui-layer-btn0");
        if (lay.length > 0) {
            lay[0].click();
        }
    }

    function setInputValue(div, value) {
        var ins = div.querySelectorAll("input");
        if (ins.length > 0) {
            ins[0].value = value;
        }
    }

    var questions = document.getElementsByClassName("field ui-field-contain");

    clickRandomRadio(questions[1]);

    var labelDivs = questions[2].getElementsByClassName("ui-radio");
    for (var i = 0; i < labelDivs.length; i++) {
        var tmp = labelDivs[i];
        var d = tmp.getElementsByClassName("label")[0];
        var text = d.textContent.trim();
        if (text === "乡镇卫生院") {
            console.log(text);
            tmp.click();
            var labelDivs2 = questions[4].getElementsByClassName("ui-radio");
            labelDivs2[2].click();
        }
    }

    function setAge(div) {
        const ageInput = div.querySelectorAll("input");
        const randomAge = getRandomNumber(15, 70);
        ageInput[0].value = randomAge;
        console.log(`设置 ${div} 的年龄为 ${randomAge}`);
    }

    setAge(questions[6]);

    clickRandomRadio(questions[7]);
    clickRandomRadio(questions[8]);
    clickRandomRadio(questions[9]);
    clickRandomRadio(questions[10]);
    clickRandomRadio(questions[11]);
    clickRandomRadio(questions[12]);
    clickRandomRadio(questions[13]);

    var ins2 = questions[15].querySelectorAll("input");
    var ind1 = getRandomNumber(0,appraise.length + 160);
    //ins2[0].value = appraise[ind1];

    if (appraise[ind1]!== undefined) {
        ins2[0].value = appraise[ind1];
    } else {
        console.log("ind2 is undefined, skipping assignment.");
    }

    var ins3 = questions[14].querySelectorAll("input");
    var ind2 = getRandomNumber(0, socre.length + 30);

    if (socre[ind2]!== undefined) {
        ins3[0].value = socre[ind2];
    } else {
        console.log("ind2 is undefined, skipping assignment.");
    }

    // 从 localStorage 中获取提交次数和上次提交日期
    let submissionCount = parseInt(localStorage.getItem('submissionCount')) || 0;
    let lastSubmissionDate = localStorage.getItem('lastSubmissionDate');
    let currentDate = new Date().toDateString();

    // 如果日期发生变化，重置提交次数
    if (lastSubmissionDate !== currentDate) {
        submissionCount = 0;
        localStorage.setItem('lastSubmissionDate', currentDate);
    }

    // 创建一个显示提交次数的元素
    const submissionCountElement = document.createElement('div');
    submissionCountElement.style.position = 'fixed';
    submissionCountElement.style.top = '10px';
    submissionCountElement.style.left = '10px';
    submissionCountElement.style.backgroundColor = 'white';
    submissionCountElement.style.border = '1px solid black';
    submissionCountElement.style.padding = '5px';
    submissionCountElement.style.zIndex = '1000';
    submissionCountElement.textContent = `今日提交次数${submissionCount}`;
    document.body.appendChild(submissionCountElement);

    async function submit() {
        submissionCount++; // 每次提交时增加计数器
        localStorage.setItem('submissionCount', submissionCount); // 保存提交次数到 localStorage
        submissionCountElement.textContent = `提交次数: ${submissionCount}`; // 更新显示的提交次数

        await new Promise((resolve) => {
            setTimeout(() => {
                const nextBtn = document.evaluate('//*[@id="ctlNext"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (nextBtn) {
                    nextBtn.click();
                    resolve();
                }
            }, 5000);
        });

        await new Promise((resolve) => {
            setTimeout(() => {
                document.querySelector('#rectMask').click();
                resolve();
            }, 2000);
        });

        await new Promise((resolve) => {
            setTimeout(() => {
                simulateSliderVerification();
                resolve();
            }, 4000);
        });

        await new Promise((resolve) => {
            setTimeout(() => {
                window.location.reload(); // 刷新页面
                resolve();
            }, 5000);
        });
    }

    async function simulateSliderVerification() {
        const slider = document.querySelector('#nc_1__scale_text > span');
        if (slider.textContent.startsWith('请按住滑块')) {
            const width = slider.offsetWidth;
            const eventOptions = { bubbles: true, cancelable: true };
            const dragStartEvent = new MouseEvent('mousedown', eventOptions);
            const dragEndEvent = new MouseEvent('mouseup', eventOptions);
            const steps = 10;
            const stepWidth = width / steps;
            let currX = stepWidth / 2;
            slider.dispatchEvent(dragStartEvent);
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            for (let i = 0; i < steps; i++) {
                const randomTime = Math.random() * 100 + 50;
                slider.dispatchEvent(new MouseEvent('mousemove', Object.assign({ clientX: currX }, eventOptions)));
                currX += stepWidth;
                await delay(randomTime);
            }
            slider.dispatchEvent(dragEndEvent);
            console.log("滑动完成");
        }
    }

    const targetUrl = 'https://www.wjx.cn/wjx/join/completemobile2.aspx';

    window.addEventListener('load', function() {
        if (window.location.href.includes(targetUrl)) {
            captureScreenshot();
        }
    });

    function captureScreenshot() {
        html2canvas(document.body).then(function(canvas) {
            var dataURL = canvas.toDataURL('image/png');
            GM_download(dataURL, 'screenshot.png');
        });
    }
    function getTimeOut() {
    return 16000 + Math.floor(Math.random() * 14000); // 16 秒到 30 秒之间的随机时间
}
    
    var timeOut = getTimeOut();
    console.log(timeOut);

    // 确保每次提交时都调用 submit 函数
    setInterval(submit, timeOut); // 每 15 秒提交一次
})();