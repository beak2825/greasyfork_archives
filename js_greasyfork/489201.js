// ==UserScript==
// @name         蓝湖导出 unocss-preset-weapp
// @namespace    http://tampermonkey.net/
// @version      2025-11-13
// @description  用于将蓝湖的样式转换成 unocss-preset-weapp 适用的样式!
// @author       haiyulu
// @match        https://lanhuapp.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lanhuapp.com
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/489201/%E8%93%9D%E6%B9%96%E5%AF%BC%E5%87%BA%20unocss-preset-weapp.user.js
// @updateURL https://update.greasyfork.org/scripts/489201/%E8%93%9D%E6%B9%96%E5%AF%BC%E5%87%BA%20unocss-preset-weapp.meta.js
// ==/UserScript==


const propertyAtomCssMap = {
    width: 'w',
    height: 'h',
    background: 'bg',
    'border-radius': 'rounded',
    color: 'color',
    'line-height': 'font-leading',
    'font-size': 'text',
    'font-weight': 'fw',
    'text-align': 'text',
    /** border-custom-1-fff */
    'border': 'border',
    /** shadow-[0px_4px_4px_0px_rgba(237,_0,_0,_1)] */
    'box-shadow': 'shadow'
}

function rgbaToHex(rgba) {
    const parts = rgba.substring(rgba.indexOf("(")).split(","),
          r = parseInt(parts[0].substring(1)),
          g = parseInt(parts[1]),
          b = parseInt(parts[2]),
          a = parseFloat(parts[3].substring(0, parts[3].length - 1));

    const hex = `[#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}]/${a * 100}`;
    return hex;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
        console.log('文本已成功复制到剪贴板');
    })
        .catch(err => {
        console.error('复制文本到剪贴板失败: ', err);
    });
}

// linear-gradient(90deg,#FF184B 0%,#FF4300 100%)
const degMap = {
    '0': 'gradient-to-b',
    '90': 'gradient-to-r',
    '180': 'gradient-to-t',
    '270': 'gradient-to-l',
}
const linearGradientRegexp = /^linear-gradient\((\d+)deg,(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\s\d+%,(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\s\d+%\)$/
function handleBgLinearGradient(text) {
    return text.replace(linearGradientRegexp, (match, p1, p2, p3) => {
        return `${degMap[p1]} from-${p2} to-${p3}`
    })
}


function showToast(text) {
    var toast = document.getElementById('unocssTips');
    toast.innerHTML = text;
    toast.style.visibility = 'visible';
    setTimeout(function () {
        toast.style.visibility = 'hidden';
    }, 2000);
}

(function () {
    'use strict';
    window.onload = () => {
        var popup = document.createElement('div');
        popup.innerHTML = 'Hello World';
        popup.style.position = 'fixed';
        popup.style.top = '10%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#fff';
        popup.style.color = 'red';
        popup.style.padding = '20px';
        popup.style.border = '1px solid #ccc';
        popup.style.zIndex = '9999';
        popup.style.visibility = 'hidden';
        popup.id = 'unocssTips'

        // 添加弹窗到页面
        document.body.appendChild(popup);
    }

    addEventListener('mousedown', function (event) {

        if (event.target.closest('.layer_box')) {
            var button = document.createElement("button");
            button.innerHTML = "获取unocss样式";
            button.style.backgroundColor = "#2878ff";
            button.style.width = "256px";
            button.style.height = "40px";
            button.style.borderRadius = "100px";
            button.style.color = "#fff";
            button.style.margin = "0 auto";
            button.style.zIndex = '99999'
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.id = 'copy-unocss'

            button.addEventListener("click", function () {
                // 在这里添加按钮点击后的操作
                const father = [...document.getElementsByClassName(" language-css")[1].childNodes].filter(item => {
                    if (item.innerHTML) {
                        return item.innerHTML !== ';' && item.innerHTML !== ':'
                    }
                    if (item.nodeName === "#text") {
                        return !item.textContent.includes("\n")
                    }
                    return true
                })
                // const propertyList = father.filter(item => item.innerHTML)
                // const valueList = father.filter(item => item.nodeName === "#text")
                let prevKey = ''
                /** {
                    "width": "174rpx",
                    "height": "64rpx",
                    "background": "rgba(255,255,255,0.6)",
                    "border-radius": "50rpx",
                    "border": "1rpx solid rgba(151,151,151,0.2)"
                } */
                const beforeHandleResultObj = father.reduce((prev, curv) => {
                    if (curv.className === 'token property') {
                        prevKey = curv.innerHTML
                        return {
                            ...prev,
                            [prevKey]: ''
                        }
                    }
                    if (curv.className === 'token function') {
                        return {
                            ...prev,
                            [prevKey]: `${prev[prevKey]}${['border', 'linear-gradient', 'box-shadow'].includes(prevKey) ? ' ' : ''}${curv.innerHTML}`
                        }
                    }
                    if (curv.className === 'token punctuation') {
                        const result = {
                            ...prev,
                            [prevKey]: `${prev[prevKey]}${curv.innerHTML}`
                        }
                        if (curv.innerHTML === ')') prevKey = ''
                        return result
                    }

                    if (curv.nodeName === "#text") {
                        return {
                            ...prev,
                            [prevKey]: `${prev[prevKey]}${curv.data.trim()}`
                        }
                    }   
                    return prev
                }, {})
                const valueHandleMap = {
                    /** value = '1px solid #fff' */ 
                    'border': (value) => {
                        const handleValue = (value) => value.map((item, index) => {
                            if(index === 0) return item
                            return item.includes('rgba') ? `border-${rgbaToHex(item)}` : `border-${item}`
                        }).join(' ')
                        return typeof value === 'string' ? handleValue(value.split(' ')) : handleValue(value)
                    } ,
                    /** value = "0rpx -1rpx 10rpx 0rpx rgba(0,0,0,0.2)" */
                    'box-shadow': (value) => `[${value.replaceAll(' ', '_')}]`,
                    'background': (value) => value.includes('linear-gradient') ? handleBgLinearGradient(value) : value,
                    'border-radius': (value) => value.includes(' ') ? `[${value.replaceAll(' ', '_')}]` : value,
                }
                const targetList = Object.keys(beforeHandleResultObj).map((label) => {
                    if(['font-family', 'font-style', ','].includes(label)) return null
                    let value = beforeHandleResultObj[label]
                    if(['background', 'color'].includes(label) && value.includes('rgba')) {
                        value = rgbaToHex(value)
                    }
                    if(valueHandleMap[label]) {
                        value = valueHandleMap[label](value)
                    }
                    if(propertyAtomCssMap[label]) {
                        label = propertyAtomCssMap[label]
                    }
                    return { label, value }
                }).filter(item => item)

                const result = targetList.map(item => `${item.label}-${item.value.replaceAll('#', 'hex-')}`).join(' ')
                console.warn(targetList, result)
                copyToClipboard(result);
                showToast(`复制成功, 结果为：${result}`)
            });
            setTimeout(() => {
                if(document.getElementById('copy-unocss')) return;

                document.getElementsByClassName("annotation_item code_detail")[0].appendChild(button)
            }, 1000)
        }
    });


})();
