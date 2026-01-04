// ==UserScript==
// @name         Pixiv 喜欢标签快捷添加
// @namespace    http://tampermonkey.net/
// @version      2025-9-28
// @description  支持将 Pixiv “喜欢的标签”添加到搜索栏
// @author       ctrn43062
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543959/Pixiv%20%E5%96%9C%E6%AC%A2%E6%A0%87%E7%AD%BE%E5%BF%AB%E6%8D%B7%E6%B7%BB%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/543959/Pixiv%20%E5%96%9C%E6%AC%A2%E6%A0%87%E7%AD%BE%E5%BF%AB%E6%8D%B7%E6%B7%BB%E5%8A%A0.meta.js
// ==/UserScript==

/**
 * [终极方案] 通过直接调用组件的 onChange prop 来更新 React input 的值。
 * 这种方法绕过了事件派发，直接与 React 的内部实例交互。
 * @param {HTMLInputElement} element - 目标 input 元素。
 * @param {string} value - 你想要设置的新值。
 */
function setReactValueByFiber(element, value) {
    // 1. 查找附加在 DOM 元素上的 React props 对象
    const reactPropsKey = Object.keys(element).find(key => key.startsWith('__reactProps$'));

    if (!reactPropsKey) {
        console.error("错误: 无法在目标元素上找到 React props。此网站可能使用了不同版本的 React 或有保护措施。");
        return;
    }

    const props = element[reactPropsKey];

    // 2. 检查 onChange 处理器是否存在
    if (!props.onChange) {
        console.error("错误: 目标元素的 props 中没有找到 'onChange' 函数。状态更新可能由父组件处理。");
        return;
    }

    // 3. 更新 input 的 value 属性
    //    这一步至关重要，因为 onChange 函数内部通常会通过 event.target.value 来读取新值
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call(element, value);

    // 4. 创建一个模拟的事件对象
    //    我们不需要派发它，只需要构建一个结构足够让 onChange 函数使用的对象
    const simulatedEvent = {
        target: element,
        currentTarget: element,
    };

    // 5. 直接调用 onChange 函数！
    try {
        props.onChange(simulatedEvent);
        console.log("成功通过直接调用 onChange 更新了 React 状态。");
    } catch (error) {
        console.error("调用 onChange 函数时出错:", error);
    }
}

(function() {
    'use strict';

    const input = document.querySelector('.charcoal-text-field-input')
    const waitForElement = (select, max_try=100, interval=20) => {
        const delay = async () => {
            return new Promise(resolve => {
                setTimeout( () => resolve(), interval)
            }
                              )
        }

        return new Promise(async (resolve, reject) => {
            let el = null

            do {
                console.debug(`Searching ${select}, ${max_try} try remain`)
                await delay(interval)
                el = document.querySelectorAll(select)
            } while ((!el || !el.length) && max_try--)
                resolve(el)
        }
                          )
    }

    input.addEventListener('keydown', (event) => {
        // 检查按下的键是否是 'Enter'
        // event.key 是现代浏览器推荐的用法
        if (event.key === 'Enter') {
            const newValue = input.value
            setReactValueByFiber(input, newValue);
        }
    });

    input.addEventListener('click', async () => {
        const myTags = await waitForElement('.gtm-my-tag-link')

        // assert myTags is not empty
        console.log(myTags)

        myTags.forEach(tag => {
            const container = tag.parentElement
            // 判断是否已有 append 按钮
            if(container.getAttribute('data-append')) {
                return
            }

            // 修改 parent 样式
            Object.assign(container.style, {
                'flex-direction': 'column',
                'justify-content': 'center'
            })

            // 添加 append 按钮
            const appendTagToSearchButton = document.createElement('span')
            appendTagToSearchButton.textContent = '+ Append'
            Object.assign(appendTagToSearchButton.style, {
                'text-align': 'center',
                'margin-top': '4px',
                'cursor': 'pointer',
                'white-space': 'nowrap'
            })
            appendTagToSearchButton.className = tag.className

            appendTagToSearchButton.addEventListener('click', () => {
                const search = document.querySelector('.charcoal-text-field-input')

                const tagText = tag.innerText.split(/\s+/).pop().replace(/^#/, ' ')
                const newValue = search.value + tagText
                search.value = newValue
                search.setAttribute('value', newValue)
            })

            container.setAttribute('data-append', true)
            container.appendChild(appendTagToSearchButton)
        })
    })
})();