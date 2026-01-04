// ==UserScript==
// @name         3D点云标准框快捷键JSpart4.6
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  目标检测使用
// @author       iik
// @match        http://renwu.cloud-label.changan.com.cn/tools/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468186/3D%E7%82%B9%E4%BA%91%E6%A0%87%E5%87%86%E6%A1%86%E5%BF%AB%E6%8D%B7%E9%94%AEJSpart46.user.js
// @updateURL https://update.greasyfork.org/scripts/468186/3D%E7%82%B9%E4%BA%91%E6%A0%87%E5%87%86%E6%A1%86%E5%BF%AB%E6%8D%B7%E9%94%AEJSpart46.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 52) {
            executeFunctionxiaoqiche();
            delayedChangexiaoqiche();
        }
        if (event.keyCode === 53) {
            executeFunctionsuv();
            delayedChangesuv();
        }
        if (event.keyCode === 54) {
            executeFunctionerlunche();
            delayedChangeerlunche();
        }
        if (event.keyCode === 55) {
            executeFunctionputongxingren();
            delayedChangeputongxingren();
        }
        if (event.keyCode === 56) {
            executeFunctiondabache();
            delayedChangedabache();
        }
        if (event.keyCode === 57) {
            executeFunctionkache();
            delayedChangekache();
        }
        if (event.keyCode === 48) {
            executeFunctionsanlunche();
            delayedChangesanlunche();
        }
        if (event.keyCode === 113) {
            changeInputOnClickradio_33()
        }
    });


    function triggerInputOnClick(name, value) {
        // Get all inputs with the given name
        let inputs = document.querySelectorAll('input[name="' + name + '"]');

        // Loop through all inputs
        for(let i = 0; i < inputs.length; i++) {
            let input = inputs[i];

            // Check if the input value matches the provided value
            if (input.value == value) {
                // If it matches, trigger click event
                input.click();
                return;
            }
        }
    }
    function triggerInputOnClickradio_33(value){
        triggerInputOnClick("radio_33", value)
    }
    function changeInputOnClickradio_33(){
        if(getCheckedRadioValueradio_33() === null){
            triggerInputOnClickradio_33("0")
        }
        else if(getCheckedRadioValueradio_33() === "0"){
            triggerInputOnClickradio_33("1")
        }
        else if(getCheckedRadioValueradio_33() === "1"){
            triggerInputOnClickradio_33("2")
        }
        else if(getCheckedRadioValueradio_33() === "2"){
            triggerInputOnClickradio_33("0")
        }

    }
    function getCheckedRadioValue(name) {
        // Get all radios with the given name
        let radios = document.querySelectorAll('input[name="' + name + '"]');

        // Loop through all radios
        for(let i = 0; i < radios.length; i++) {
            let radio = radios[i];

            // Check if the radio is checked
            if (radio.checked) {
                // If checked, return its value
                console.log("getCheckedRadioValue:" + radio.value)
                return radio.value;
            }
        }
        console.log(null)
        return null

    }
    function getCheckedRadioValueradio_33(){
        // If no radio is checked, return null
        return getCheckedRadioValue("radio_33");
    }
    function executeFunctionxiaoqiche() {
        // 找到一个span元素，他的值是 '小汽车(car)' 并触发一个点击事件
        var targetSpan = Array.from(document.querySelectorAll("span")).find(span => span.textContent.trim() === '小汽车(car)');
        if (targetSpan) {
            targetSpan.click();
            const selectTagElements = document.querySelectorAll('.select-tag');
            for (let i = 0; i < selectTagElements.length; i++) {
                const childSpanElement = selectTagElements[i].querySelector('span');
                if (childSpanElement) {
                    childSpanElement.textContent += '0';
                }
            }
        }
    }
    function executeFunctionsuv() {
        // 找到一个span元素，他的值是 '小汽车(car)' 并触发一个点击事件
        var targetSpan = Array.from(document.querySelectorAll("span")).find(span => span.textContent.trim() === '小汽车(car)');
        if (targetSpan) {
            targetSpan.click();
            const selectTagElements = document.querySelectorAll('.select-tag');
            for (let i = 0; i < selectTagElements.length; i++) {
                const childSpanElement = selectTagElements[i].querySelector('span');
                if (childSpanElement) {
                    childSpanElement.textContent += '0';
                }
            }
        }
    }
    function executeFunctionerlunche() {
        // 找到一个span元素，他的值是 '二轮车(ridern)' 并触发一个点击事件
        var targetSpan = Array.from(document.querySelectorAll("span")).find(span => span.textContent.trim() === '二轮车(ridern)');
        if (targetSpan) {
            targetSpan.click();
            const selectTagElements = document.querySelectorAll('.select-tag');
            for (let i = 0; i < selectTagElements.length; i++) {
                const childSpanElement = selectTagElements[i].querySelector('span');
                if (childSpanElement) {
                    childSpanElement.textContent += '0';
                }
            }
        }
    }
    function executeFunctionputongxingren() {
        // 找到一个span元素，他的值是 '普通行人 (pedestrian)' 并触发一个点击事件
        var targetSpan = Array.from(document.querySelectorAll("span")).find(span => span.textContent.trim() === '普通行人 (pedestrian)');
        if (targetSpan) {
            targetSpan.click();
            const selectTagElements = document.querySelectorAll('.select-tag');
            for (let i = 0; i < selectTagElements.length; i++) {
                const childSpanElement = selectTagElements[i].querySelector('span');
                if (childSpanElement) {
                    childSpanElement.textContent += '0';
                }
            }
        }
    }
    function executeFunctiondabache() {
        // 找到一个span元素，他的值是 '大巴车(bus)' 并触发一个点击事件
        var targetSpan = Array.from(document.querySelectorAll("span")).find(span => span.textContent.trim() === '大巴车(bus)');
        if (targetSpan) {
            targetSpan.click();
            const selectTagElements = document.querySelectorAll('.select-tag');
            for (let i = 0; i < selectTagElements.length; i++) {
                const childSpanElement = selectTagElements[i].querySelector('span');
                if (childSpanElement) {
                    childSpanElement.textContent += '0';
                }
            }
        }
    }
    function executeFunctionkache() {
        // 找到一个span元素，他的值是 '卡车 (truck)' 并触发一个点击事件
        var targetSpan = Array.from(document.querySelectorAll("span")).find(span => span.textContent.trim() === '卡车 (truck)');
        if (targetSpan) {
            targetSpan.click();
            const selectTagElements = document.querySelectorAll('.select-tag');
            for (let i = 0; i < selectTagElements.length; i++) {
                const childSpanElement = selectTagElements[i].querySelector('span');
                if (childSpanElement) {
                    childSpanElement.textContent += '0';
                }
            }
        }
    }
    function executeFunctionsanlunche() {
        // 找到一个span元素，他的值是 '三轮车 (tricycle)' 并触发一个点击事件
        var targetSpan = Array.from(document.querySelectorAll("span")).find(span => span.textContent.trim() === '三轮车 (tricycle)');
        if (targetSpan) {
            targetSpan.click();
            const selectTagElements = document.querySelectorAll('.select-tag');
            for (let i = 0; i < selectTagElements.length; i++) {
                const childSpanElement = selectTagElements[i].querySelector('span');
                if (childSpanElement) {
                    childSpanElement.textContent += '0';
                }
            }
        }
    }
    function delayedChangexiaoqiche() {
        setTimeout(() => {
            changeValue('height_value', '1.7');
            changeValue('width_value', '1.9');
            changeValue('long_value', '4.91');

            setTimeout(() => {
                triggerClickById();
            }, 200); // 延迟 500 毫秒（半秒）
        }, 300); // 延迟 500 毫秒（半秒）

    }
    function delayedChangesuv() {
        setTimeout(() => {
            changeValue('height_value', '1.7');
            changeValue('width_value', '2.1');
            changeValue('long_value', '5.01');
            setTimeout(() => {
                triggerClickById();
            }, 200); // 延迟 500 毫秒（半秒）
        }, 300); // 延迟 500 毫秒（半秒）
    }
    function delayedChangeerlunche() {
        setTimeout(() => {
            changeValue('height_value', '1.6');
            changeValue('width_value', '0.8');
            changeValue('long_value', '1.81');
            setTimeout(() => {
                triggerClickById();
            }, 200); // 延迟 500 毫秒（半秒）
        }, 300); // 延迟 500 毫秒（半秒）
    }
    function delayedChangeputongxingren() {
        setTimeout(() => {
            changeValue('height_value', '1.7');
            changeValue('width_value', '0.7');
            changeValue('long_value', '0.71');
            setTimeout(() => {
                triggerClickById();
            }, 200); // 延迟 500 毫秒（半秒）
        }, 300); // 延迟 500 毫秒（半秒）
    }
    function delayedChangedabache() {
        setTimeout(() => {
            changeValue('height_value', '3.5');
            changeValue('width_value', '2.6');
            changeValue('long_value', '8.01');
            setTimeout(() => {
                triggerClickById();
            }, 200); // 延迟 500 毫秒（半秒）
        }, 300); // 延迟 500 毫秒（半秒）
    }
    function delayedChangekache() {
        setTimeout(() => {
            changeValue('height_value', '3');
            changeValue('width_value', '2.6');
            changeValue('long_value', '8.01');
            setTimeout(() => {
                triggerClickById();
            }, 200); // 延迟 500 毫秒（半秒）
        }, 300); // 延迟 500 毫秒（半秒）
    }
    function delayedChangesanlunche() {
        setTimeout(() => {
            changeValue('height_value', '1.7');
            changeValue('width_value', '1.5');
            changeValue('long_value', '3.51');
            setTimeout(() => {
                triggerClickById();
            }, 200); // 延迟 500 毫秒（半秒）
        }, 300); // 延迟 500 毫秒（半秒）
    }
    function changeValue(id, newValue) {
        const element = document.getElementById(id);

        if (element) {
            element.value = newValue; // 设置新的值
        } else {
            console.error(`未找到具有 ID "${id}" 的元素`);
        }
    }

    function simulateClick(id) {
        const element = document.getElementById(id);

        if (element) {
            element.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        } else {
            console.error(`未找到具有 ID "${id}" 的元素`);
        }
    }
    // 您可以将此函数绑定到某个特定按键或事件上
    function triggerClick() {
        const elements = document.querySelectorAll('li');

        let elementFound = false;
        let spanText = '';

        for (const element of elements) {
            const classNames = element.className;

            if (classNames.endsWith('active') && classNames.startsWith('mark-li')) {
                console.log(element.className);
                element.click();
                console.log('触发点击事件');

                // 查找当前元素的 div 子元素
                const childDiv = element.querySelector('div');
                if (childDiv) {



                    // 查找具有 'name' 类的 span 子元素
                    const spanElement = childDiv.querySelector('span.name');
                    if (spanElement) {
                        // 获取 span 元素的文本内容并将其作为返回值
                        spanText = spanElement.textContent;
                        console.log('找到 span.name 元素的文本内容:', spanText);
                    } else {
                        console.log('没有找到 span.name 元素');
                    }
                } else {
                    console.log('没有找到 div 子元素');
                }

                elementFound = true;
                break;
            }
        }

        if (!elementFound) {
            console.log('没有找到');
        }

        return spanText;
    }
    function getLongValueById() {
        const inputElement = document.getElementById('long_value');
        if (inputElement) {
            const longValue = inputElement.value;
            console.log('长值:', longValue);
            return longValue;
        } else {
            console.log('没有找到具有 id "long_value" 的 input 元素');
            return '';
        }
    }


    function getWidthValueById() {
        const inputElement = document.getElementById('width_value');
        if (inputElement) {
            const widthValue = inputElement.value;
            console.log('宽值:', widthValue);
            return widthValue;
        } else {
            console.log('没有找到具有 id "width_value" 的 input 元素');
            return '';
        }
    }

    function getHeightValueById() {
        const inputElement = document.getElementById('height_value');
        if (inputElement) {
            const heightValue = inputElement.value;
            console.log('高值:', heightValue);
            return heightValue;
        } else {
            console.log('没有找到具有 id "height_value" 的 input 元素');
            return '';
        }
    }




    function delayedChange() {
        setTimeout(() => {
            const triggerResult = triggerClick();
            const longValue = getLongValueById();
            const widthValue = getWidthValueById();
            const heightValue = getHeightValueById();
            if (triggerResult === '小汽车(car)' && longValue == 4.9 && widthValue == 1.9 && heightValue == 1.7) {
                console.log(`49尺寸ing`);
                changeValue('height_value', '1.7');
                changeValue('width_value', '2.1');
                changeValue('long_value', '5.01');
                triggerClickById();
            }
            else if (triggerResult === '小汽车(car)' && longValue == 5 && widthValue == 2.1 && heightValue == 1.7) {
                console.log(`5尺寸ing`);
                changeValue('height_value', '1.6');
                changeValue('width_value', '1.7');
                changeValue('long_value', '4.01');
                triggerClickById();
            }
            else if (triggerResult === '小汽车(car)' && longValue == 4.0 && widthValue == 1.7 && heightValue == 1.6) {
                console.log(`4尺寸ing`);
                changeValue('height_value', '1.7');
                changeValue('width_value', '1.9');
                changeValue('long_value', '4.91');
                triggerClickById();
            }
            else if (triggerResult === '小汽车(car)' && longValue !== '4.9' && widthValue !== '1.9' && heightValue !== '1.7') {
                console.log(`非标准ing`);
                changeValue('height_value', '1.7');
                changeValue('width_value', '1.9');
                changeValue('long_value', '4.91');
                triggerClickById();
            }



            if (triggerResult === '大巴车(bus)' && longValue == 8.0 && widthValue == 2.6 && heightValue == 3.5) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '12.01');
                changeValue('width_value', '2.6');
                changeValue('height_value', '3.5');
                triggerClickById();
            }
            else if (triggerResult === '大巴车(bus)' && longValue == 12.0 && widthValue == 2.6 && heightValue == 3.5) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '6.01');
                changeValue('width_value', '2.6');
                changeValue('height_value', '3.0');
                triggerClickById();
            }
            else if (triggerResult === '大巴车(bus)' && longValue == 6.0 && widthValue == 2.6 && heightValue == 3.0) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '8.01');
                changeValue('width_value', '2.6');
                changeValue('height_value', '3.5');
                triggerClickById();
            }
            else if (triggerResult === '大巴车(bus)' && longValue !== '8.0' && widthValue !== '2.6' && heightValue !== '3.5') {
                changeValue('long_value', '8.01');
                changeValue('width_value', '2.6');
                changeValue('height_value', '3.5');
                triggerClickById();
            }

            if (triggerResult === '卡车 (truck)' && longValue == 8.0 && widthValue == 2.6 && heightValue == 3.0) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '12.01');
                changeValue('width_value', '2.6');
                changeValue('height_value', '3.0');
                triggerClickById();
            }
            else if (triggerResult === '卡车 (truck)' && longValue == 12.0 && widthValue == 2.6 && heightValue == 3.0) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '6.01');
                changeValue('width_value', '2.6');
                changeValue('height_value', '3.0');
                triggerClickById();
            }
            else if (triggerResult === '卡车 (truck)' && longValue == 6.0 && widthValue == 2.6 && heightValue == 3.0) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '8.01');
                changeValue('width_value', '2.6');
                changeValue('height_value', '3.0');
                triggerClickById();
            }
            else if (triggerResult === '卡车 (truck)' && longValue !== '8.0' && widthValue !== '2.6' && heightValue !== '3.0') {
                changeValue('long_value', '8.01');
                changeValue('width_value', '2.6');
                changeValue('height_value', '3.0');
                triggerClickById();
            }
            if (triggerResult === '普通行人 (pedestrian)' && longValue == 0.7 && widthValue == 0.7 && heightValue == 1.7) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '0.71');
                changeValue('width_value', '0.70');
                changeValue('height_value', '1.0');
                triggerClickById();
            }
            else if (triggerResult === '普通行人 (pedestrian)' && longValue == 0.7 && widthValue == 0.7 && heightValue == 1.0) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '0.71');
                changeValue('width_value', '0.7');
                changeValue('height_value', '1.7');
                triggerClickById();
            }
            else if (triggerResult === '普通行人 (pedestrian)' && longValue !== '0.7' && widthValue !== '0.7' && heightValue !== '1.7') {
                changeValue('long_value', '0.71');
                changeValue('width_value', '0.7');
                changeValue('height_value', '1.7');
                triggerClickById();
            }

            if (triggerResult === '二轮车(ridern)' && longValue !== '1.8' && widthValue !== '0.8' && heightValue !== '1.6') {
                changeValue('long_value', '1.81');
                changeValue('width_value', '0.8');
                changeValue('height_value', '1.6');
                triggerClickById();
            }

            if (triggerResult === '异形车辆(vehicle_else)' && longValue == 6 && widthValue == 2 && heightValue == 3) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '7.01');
                changeValue('width_value', '2.0');
                changeValue('height_value', '3');
                triggerClickById();
            }
            else if (triggerResult === '异形车辆(vehicle_else)' && longValue == 7 && widthValue == 2 && heightValue == 3.0) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '15.01');
                changeValue('width_value', '3');
                changeValue('height_value', '4');
                triggerClickById();
            }
            else if (triggerResult === '异形车辆(vehicle_else)' && longValue == 15 && widthValue == 3 && heightValue == 4) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '10.01');
                changeValue('width_value', '3');
                changeValue('height_value', '3.5');
                triggerClickById();
            }
            else if (triggerResult === '异形车辆(vehicle_else)' && longValue == 10 && widthValue == 3 && heightValue == 3.5) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '6.01');
                changeValue('width_value', '2');
                changeValue('height_value', '4');
                triggerClickById();
            }
            else if (triggerResult === '异形车辆(vehicle_else)' && longValue == 6 && widthValue == 2 && heightValue == 4) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '7.01');
                changeValue('width_value', '2');
                changeValue('height_value', '4');
                triggerClickById();
            }
            else if (triggerResult === '异形车辆(vehicle_else)' && longValue == 7 && widthValue == 2 && heightValue == 4) {
                console.log(`更改尺寸ing`);
                changeValue('long_value', '6.01');
                changeValue('width_value', '2');
                changeValue('height_value', '3');
                triggerClickById();
            }
            else if (triggerResult === '异形车辆(vehicle_else)' && longValue !== '6' && widthValue !== '2' && heightValue !== '3') {
                changeValue('long_value', '6.01');
                changeValue('width_value', '2');
                changeValue('height_value', '3');
                triggerClickById();
            }
            if (triggerResult === '警示柱子 (warningcolumnn)' && longValue !== '0.4' && widthValue !== '0.2' && heightValue !== '0.6') {
                changeValue('long_value', '0.41');
                changeValue('width_value', '0.2');
                changeValue('height_value', '0.6');
                triggerClickById();
            }
            if (triggerResult === '三轮车 (tricycle)' && longValue !== '3.5' && widthValue !== '1.5' && heightValue !== '1.7') {
                changeValue('long_value', '3.51');
                changeValue('width_value', '1.5');
                changeValue('height_value', '1.7');
                triggerClickById();
            }
            if (triggerResult === '三轮车 (tricycle)' && longValue !== '3.5' && widthValue !== '1.5' && heightValue !== '1.7') {
                changeValue('long_value', '3.51');
                changeValue('width_value', '1.5');
                changeValue('height_value', '1.7');
                triggerClickById();
            }
            if (triggerResult === '锥桶 (cone)' && longValue !== '0.4' && widthValue !== '0.4' && heightValue !== '0.8') {
                changeValue('long_value', '0.41');
                changeValue('width_value', '0.4');
                changeValue('height_value', '0.8');
                triggerClickById();
            }
            if (triggerResult === '异形人 (pedestrian_else)' && longValue !== '0.9' && widthValue !== '0.9' && heightValue !== '1.2') {
                changeValue('long_value', '0.91');
                changeValue('width_value', '0.9');
                changeValue('height_value', '1.2');
                triggerClickById();
            }
        }, 300); // 延迟 300 毫秒
    }



    function triggerClickById() {
        const element = document.getElementById("min_long");

        if (element) {
            element.click();
            console.log(`已执行  元素的点击事件`);
        } else {
            console.log(`未找到具有 id "" 的元素`);
        }
    }



    // 在此示例中，我们将功能绑定到 ~ 键
    document.addEventListener('keydown', (event) => {
        if (event.keyCode === 192) {
            delayedChange()


        }
    });
})();
