// ==UserScript==
// @name         720定制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  快速修改上下超链接
// @author       小智
// @match        https://www.720yun.com/my/edit/tour/*
// @grant        none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/512675/720%E5%AE%9A%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/512675/720%E5%AE%9A%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局延时设置为0.3秒
    const delay = 300;

        // 创建一个提示框
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#0055ff'; // 浅蓝色背景
        toast.style.color = '#fff'; // 白色文字
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '8px'; // 圆角边框
        toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // 轻微阴影
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease-in-out';

        document.body.appendChild(toast);
        toast.style.opacity = '1'; // 显示提示框

        // 自动消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500); // 等待过渡效果结束后再移除
        }, 1500); // 3秒后消失
    }

        // 监听整个文档的双击事件
    document.addEventListener('dblclick', function(event) {
        // 检查被双击的元素是否包含文本
        if (event.target instanceof HTMLElement && event.target.textContent.trim() !== '') {
            // 使用 navigator.clipboard API 复制文本
            navigator.clipboard.writeText(event.target.textContent.trim())
            .then(() => {
                console.log('文本已成功复制到剪贴板');
                showToast('成功复制到剪贴板！');
            })
            .catch(err => {
                console.error('复制文本失败:', err);
                showToast('复制失败！');
            });
        }
    });

    function addXButton(label, callback) {
        var button = document.createElement('button');
        button.textContent = label;
        button.style.cssText = `
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #0055ff;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            position: fixed;
            top: 10px;
            left: 82%;
            z-index: 9999;
        `;
        button.onmouseenter = function() {
            button.style.backgroundColor = '#45a049';
        };
        button.onmouseleave = function() {
            button.style.backgroundColor = '#0055ff';
        };
        button.onclick = callback;
        document.body.appendChild(button);
    }

    function addSButton(label, callback) {
        var button = document.createElement('button');
        button.textContent = label;
        button.style.cssText = `
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #0055ff;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            position: fixed;
            top: 10px;
            left: 77%;
            z-index: 9999;
        `;
        button.onmouseenter = function() {
            button.style.backgroundColor = '#45a049';
        };
        button.onmouseleave = function() {
            button.style.backgroundColor = '#0055ff';
        };
        button.onclick = callback;
        document.body.appendChild(button);
    }

    function addCustomButtonWithInputs(label, callback) {
        var container = document.createElement('div');
        container.id = "customButtonContainer";
        document.body.appendChild(container);
        container.style.cssText = `
            position: fixed;
            top: 5px;
            right: 24%;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 6px;
            background-color: #f0f0f0;
            padding: 3px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        var input1 = document.createElement('input');
        input1.type = 'number'; // 确保输入的是数字
        input1.placeholder = '热点顺序';
        input1.style.width = '150px';
        input1.style.height = '40px';
        input1.style.padding = '0 10px';
        container.appendChild(input1);

        var input2 = document.createElement('input');
        input2.type = 'text';
        input2.placeholder = '点位名称';
        input2.style.width = '150px';
        input2.style.height = '40px';
        input2.style.padding = '0 10px';
        container.appendChild(input2);

        var button = document.createElement('button');
        button.textContent = label;
        button.style.cssText = `
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #0055ff;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            outline: none;
        `;
        button.onmouseenter = function() {
            button.style.backgroundColor = '#45a049';
        };
        button.onmouseleave = function() {
            button.style.backgroundColor = '#0055ff';
        };
        button.onclick = function() {
            var param1 = parseInt(input1.value, 10); // 转换为整数
            var param2 = input2.value;
            if (!isNaN(param1)) {
                param1 -= 1; // 自动减1
                callback(param1, param2);
            } else {
                console.log('请输入有效的数字');
            }
        };
        container.appendChild(button);
    }

    // 添加延时点击函数
    function delayedClick(selectors, index, callback) {
          // 使用 querySelectorAll 查找所有匹配的元素
    const elements = document.querySelectorAll(selectors);

    // 根据 index 获取特定元素
    const element = elements[index];

    // 检查是否找到元素
    if (element) {
        // 模拟点击元素
        element.click();
        console.log('成功模拟点击', selectors, '索引:', index);

        // 设置延迟后执行回调（如果提供了回调）
        setTimeout(function() {
            if (callback) callback();
        }, delay);
    } else {
        console.log('没有找到匹配的元素', selectors, '索引:', index);
    }
    }

    function addEventListener(positions) {
        var parentElements = document.querySelectorAll('div.relative.ml-10.h-80.w-80.flex-shrink-0.rounded.border-2.border-transparent.focus\\:outline-none');
        var specificImageElements = document.querySelectorAll('.Image-bQSkvr.hyFyhU.h-full.w-full.rounded.ring-2.ring-orange');

        specificImageElements.forEach(function(img) {
            var parentArray = Array.from(parentElements);
            var parentIndex = parentArray.findIndex(function(parent) {
                return parent.contains(img);
            });
            if (parentIndex !== -1) {
                positions.push(parentIndex);
            }
        });

        console.log('特定图片元素在父元素集合中的位置:', positions);
    }



    addXButton('下个热点', function() {
        delayedClick('a[href$="hotspot"]', 0, function() {
            var positions = [];
            addEventListener(positions);
            var relativeDivs = document.querySelectorAll('.mx-10.truncate.text-base.text-white');

            if (relativeDivs.length > 0) {
                delayedClick('.mx-10.truncate.text-base.text-white', 0, function() {
                    delayedClick('.mt-5 .Button-jTjrsS.fToPnQ', 0, function() {

                        var divElements = document.querySelectorAll('.relative.h-80.w-80.flex-shrink-0.rounded.border-2.border-transparent.focus\\:outline-none.cursor-pointer');

                        if (divElements.length === 0) {
                            console.log('没有找到匹配的 div 元素');
                        } else {
                            if (positions.length > 0) {
                                var indexToClick = positions[0] + 1; // 使用第一个有效的索引
                                if (indexToClick >= divElements.length) {
                                    indexToClick = 0; // 如果索引超出数组范围，使用0
                                }
                                var divToClick = divElements[indexToClick]; // 点击的 div 元素


                                if (divToClick) {
                                    divToClick.click();
                                    console.log('成功点击', positions[0], '------', divToClick);
                                    setTimeout(function() {
                                        var divElementsbutton = document.querySelectorAll('.Button-jTjrsS.fToPnQ.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base');

                                        var confirmButton;
                                        divElementsbutton.forEach(function(button) {
                                            if (button.textContent.trim() === '确认操作') {
                                                confirmButton = button;
                                            }
                                        });

                                        if (confirmButton) {
                                            confirmButton.click();
                                            console.log('确认操作---按钮被点击');
                                            setTimeout(function() {
                                                var wcDiv = document.querySelector('.Button-jTjrsS.fToPnQ.block.w-full.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base');

                                                if (wcDiv) {
                                                    wcDiv.click();
                                                    console.log('完成设置---按钮被点击');
                                                    setTimeout(function() {
                                                        var buttonSelector = '.Button-jTjrsS.fToPnQ.ml-10.flex-shrink-0.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base';
                                                        var wdDiv = document.querySelector(buttonSelector);

                                                        if (wdDiv) {
                                                            wdDiv.click();
                                                            console.log('保存---按钮被点击');
                                                        } else {
                                                            console.log('保存---没有找到按钮');
                                                        }
                                                    }, delay);
                                                } else {
                                                    console.log('完成设置---没有找到按钮');
                                                }
                                            }, delay);
                                        } else {
                                            console.log('没有找到文本为“确认操作”的按钮');
                                        }
                                    }, delay);
                                } else {
                                    console.log('没有找到对应的 div 元素');
                                }
                            } else {
                                console.log('没有有效的 positions 索引');
                            }
                        }
                    });
                });
            } else {
                console.log('没有找到匹配的元素');
            }
        });
    });

    addSButton('上个热点', function() {
        delayedClick('a[href$="hotspot"]', 0, function() {
            var positions = [];
            addEventListener(positions);
            var relativeDivs = document.querySelectorAll('.mx-10.truncate.text-base.text-white');

            if (relativeDivs.length > 0) {
                delayedClick('.mx-10.truncate.text-base.text-white', 1, function() {
                    delayedClick('.mt-5 .Button-jTjrsS.fToPnQ', 0, function() {

                        var divElements = document.querySelectorAll('.relative.h-80.w-80.flex-shrink-0.rounded.border-2.border-transparent.focus\\:outline-none.cursor-pointer');

                        if (divElements.length === 0) {
                            console.log('没有找到匹配的 div 元素');
                        } else {
                            if (positions.length > 0) {
                                var indexToClick = positions[0] - 1; // 使用第一个有效的索引
                                if (indexToClick == -1) {
                                    indexToClick = 0; // 如果索引超出数组范围，使用0
                                }
                                var divToClick = divElements[indexToClick]; // 点击的 div 元素


                                if (divToClick) {
                                    divToClick.click();
                                    console.log('成功点击', positions[0], '------', divToClick);
                                    setTimeout(function() {
                                        var divElementsbutton = document.querySelectorAll('.Button-jTjrsS.fToPnQ.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base');

                                        var confirmButton;
                                        divElementsbutton.forEach(function(button) {
                                            if (button.textContent.trim() === '确认操作') {
                                                confirmButton = button;
                                            }
                                        });

                                        if (confirmButton) {
                                            confirmButton.click();
                                            console.log('确认操作---按钮被点击');
                                            setTimeout(function() {
                                                var wcDiv = document.querySelector('.Button-jTjrsS.fToPnQ.block.w-full.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base');

                                                if (wcDiv) {
                                                    wcDiv.click();
                                                    console.log('完成设置---按钮被点击');
                                                    setTimeout(function() {
                                                        var buttonSelector = '.Button-jTjrsS.fToPnQ.ml-10.flex-shrink-0.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base';
                                                        var wdDiv = document.querySelector(buttonSelector);

                                                        if (wdDiv) {
                                                            wdDiv.click();
                                                            console.log('保存---按钮被点击');
                                                        } else {
                                                            console.log('保存---没有找到按钮');
                                                        }
                                                    }, delay);
                                                } else {
                                                    console.log('完成设置---没有找到按钮');
                                                }
                                            }, delay);
                                        } else {
                                            console.log('没有找到文本为“确认操作”的按钮');
                                        }
                                    }, delay);
                                } else {
                                    console.log('没有找到对应的 div 元素');
                                }
                            } else {
                                console.log('没有有效的 positions 索引');
                            }
                        }
                    });
                });
            } else {
                console.log('没有找到匹配的元素');
            }
        });
    });

    addCustomButtonWithInputs('执行', function(param1, param2) {
        console.log('按钮被点击，参数1:', param1, '参数2:', param2);
        delayedClick('a[href$="hotspot"]', 0, function() {
            var positions = [];
            addEventListener(positions);
            var relativeDivs = document.querySelectorAll('.mx-10.truncate.text-base.text-white');
            if (relativeDivs.length > 0) {
                delayedClick('.mx-10.truncate.text-base.text-white', param1, function() {
                    delayedClick('.mt-5 .Button-jTjrsS.fToPnQ',0, function() {
                        var divElements = document.querySelectorAll('.relative.h-80.w-80.flex-shrink-0.rounded.border-2.border-transparent.focus\\:outline-none.cursor-pointer');
                        if (divElements.length === 0) {
                            console.log('没有找到匹配的 div 元素');
                        } else {
                            if (positions.length > 0) {
                                var matchedIndex = -1;
                                for (let i = 0; i < divElements.length; i++) {
                                    const textContent = divElements[i].querySelector('.text-white').textContent;
                                    if (textContent === param2) {
                                        matchedIndex = i;
                                        break;
                                    }
                                }
                                    var indexToClick = matchedIndex !== -1 ? matchedIndex : 0;
                                    var divToClick = divElements[indexToClick];

                                if (divToClick) {
                                    divToClick.click();
                                    console.log('成功点击', positions[0], '------', divToClick);
                                    setTimeout(function() {
                                        var divElementsbutton = document.querySelectorAll('.Button-jTjrsS.fToPnQ.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base');
                                        var confirmButton;
                                        divElementsbutton.forEach(function(button) {
                                            if (button.textContent.trim() === '确认操作') {
                                                confirmButton = button;
                                            }
                                        });
                                        if (confirmButton) {
                                            confirmButton.click();
                                            console.log('确认操作---按钮被点击');
                                            setTimeout(function() {
                                                var wcDiv = document.querySelector('.Button-jTjrsS.fToPnQ.block.w-full.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base');
                                                if (wcDiv) {
                                                    wcDiv.click();
                                                    console.log('完成设置---按钮被点击');
                                                    setTimeout(function() {
                                                        var buttonSelector = '.Button-jTjrsS.fToPnQ.ml-10.flex-shrink-0.flex.items-center.justify-center.rounded.outline-none.focus\\:outline-none.px-10.text-white.bg-blue.hover\\:bg-blue-active.h-30.text-base';
                                                        var wdDiv = document.querySelector(buttonSelector);
                                                        if (wdDiv) {
                                                            wdDiv.click();
                                                            console.log('保存---按钮被点击');
                                                        } else {
                                                            console.log('保存---没有找到按钮');
                                                        }
                                                    }, delay);
                                                } else {
                                                    console.log('完成设置---没有找到按钮');
                                                }
                                            }, delay);
                                        } else {
                                            console.log('没有找到文本为“确认操作”的按钮');
                                        }
                                    }, delay);
                                } else {
                                    console.log('没有找到对应的 div 元素');
                                }
                            } else {
                                console.log('没有有效的 positions 索引');
                            }
                        }
                    });
                });
            } else {
                console.log('没有找到匹配的元素');
            }
        });
    });

})();