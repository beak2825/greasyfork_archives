// ==UserScript==
// @name         掌阅小助手
// @namespace    http://tampermonkey.net/
// @version      v2024.04.11.0917
// @description  书籍快捷信息查询(基于孔夫子旧书网快速显示掌阅书籍信息),专注阅读
// @author       tangyujun
// @match        https://www.ireader.com.cn/index.php*
// @match        *://ireader.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ireader.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491059/%E6%8E%8C%E9%98%85%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491059/%E6%8E%8C%E9%98%85%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function speakTextWithSpeed(text, speed) {
        // 检查浏览器是否支持语音合成
        if ('speechSynthesis' in window) {
            // 创建一个新的语音合成对象
            const speech = new SpeechSynthesisUtterance();
            // 设置要朗读的文本
            speech.text = text;
            // 设置语言（例如，'zh-CN' 代表中文简体）
            speech.lang = 'zh-CN';
            // 设置朗读速度，其中speed是一个介于0.1到10之间的浮点数
            speech.rate = speed;
            // 将语音合成对象添加到语音合成队列中
            window.speechSynthesis.speak(speech);
        } else {
            console.error('当前浏览器不支持语音合成。');
        }
    }

    function clickChapterLink(index) {
        // 选择目标元素
        var chapterLink = document.querySelector(`body > div.fixed > div.chapter > span:nth-child(${index})`);

        if (chapterLink) {
            // 检查是否可以触发点击事件
            if (chapterLink.click) {
                chapterLink.click();
            } else {
                // 创建一个MouseEvent并触发
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                chapterLink.dispatchEvent(event);
            }
        }
    }

    function isAllWhitespace(str) {
        return /^\s*$/.test(str);
    }

    const hoverParagraph = function(paragraph, speech) {
        paragraph.style.opacity = 0.2;
        paragraph.addEventListener('mouseover', function() {
            this.style.opacity = 1;
            this.style.scale = 1.05;
            if(speech){
                // 使用函数朗读文本，并设置播放速度为1.5倍正常速度
                speakTextWithSpeed(paragraph.textContent, 1.8);
            }
        });
        paragraph.addEventListener('mouseout', function() {
            this.style.opacity = 0.2;
            this.style.scale = 1;
            if(speech){
                window.speechSynthesis.cancel();
            }
        });

    };

    // 获取所有的<p class="bodytext">标签
    // var paragraphs = document.querySelectorAll('p.bodytext');
    // 遍历所有的<p>标签并设置透明度
    // paragraphs.forEach(hoverParagraph);
    document.querySelectorAll('p.bodytext').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.bodytext-kt-first-np').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.bodytext-kt-np').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.bodytext-kt-np-1').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.bodytext-kt-last-np').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.bodytext-kt-only-np').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.copyright-text').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.copyright-text1').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.bodytext-no').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.preface-text').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.inscribed-right').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('h6.title-zhongsong').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('h6.title-zhonghei').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('h5.text-title-5').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('h4.text-title-4').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('h4.copyright-title').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('h3.text-title-3').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('h2.text-title-2').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('h1.text-title-1').forEach(function(p){hoverParagraph(p,true)});
    document.querySelectorAll('p.note').forEach(function(p){hoverParagraph(p,false)});
    document.querySelectorAll('pre.code').forEach(function(p){hoverParagraph(p,false)});
    document.querySelectorAll('div.zhangyue-c').forEach(function(p){hoverParagraph(p,false)});



    // 添加按键监听
    document.addEventListener('keydown', function(event) {
        // 检查是否按下了左箭头键
        if (event.keyCode === 37 || event.key === 'ArrowLeft') {
            // 执行点击操作
            clickChapterLink(1);
        }else if(event.keyCode === 39 || event.key === 'ArrowRight') {
            // 检查是否按下了右箭头键
            // 执行点击操作
            clickChapterLink(2);
        }
    });

    document.querySelectorAll("div.header").forEach(function(s){s.remove()});





    // Function to create the styled green box element with the hovered element's text
    function createGreenBox(hoveredElement) {
        const box = document.createElement('div');
        const boxWidth = 600;
        const boxHeight = 600;
        const left = 220;
        const top = 320;

        box.classList.add('styled-green-box');
        box.style.backgroundColor = 'rgba(0, 128, 0, 0.7)';
        box.style.position = 'fixed';
        box.style.pointerEvents = 'none'; // Set to none to allow mouse events to pass through
        box.style.border = '1px solid #8FBC8F';
        box.style.borderRadius = '5px';
        box.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        box.style.padding = '8px 15px';
        box.style.color = 'white';
        box.style.fontSize = '14px';
        box.style.zIndex = '9999';
        box.style.height = `30px`; // Set the width to 100% of the viewport
        box.style.width = `${boxWidth}px`; // Set the width to 100% of the viewport
        box.style.wordWrap = 'break-word';
        box.style.overflow = 'hidden';

        const header = document.createElement('h3');
        header.textContent = hoveredElement.textContent.replace(/[\s\t\n\r]+/g, '');


        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.wordWrap = 'break-word';
        container.style.overflow = 'hidden';
        container.style.height = `1px`; // Set the width to 100% of the viewport
        container.style.width = `${boxWidth}px`; // Set the width to 100% of the viewport

        // 创建iframe元素
        const iframe = document.createElement('iframe');
        iframe.src = `https://search.kongfz.com/product_result/?key=${encodeURIComponent(hoveredElement.textContent.replace(/[\s\t\n\r]+/g, ''))}`;

        iframe.style.visibility = 'hidden';
        iframe.style.border = 'none'; // Remove the iframe default border
        iframe.onload = function() {
            box.style.height = `${boxHeight+30}px`; // Set the width to 100% of the viewport
            container.style.height = `${boxHeight}px`; // Set the width to 100% of the viewport
            iframe.style.visibility = 'visible';
            iframe.style.width = `1200px`;
            iframe.style.height = `${top+boxHeight}px`;
            iframe.style.left = `-${left}px`;
            iframe.style.top = `-${top}px`;
            iframe.style.position = 'absolute';
            iframe.style.boxSizing = 'border-box'; // Ensure the iframe respects the border and padding
        };
        container.appendChild(iframe);

        // 将iframe添加到box中
        box.appendChild(header);
        box.appendChild(container);
        document.body.appendChild(box);
        return box;
    }
    // Function to remove the green box if it exists
    function removeGreenBox(greenBox) {
        if (greenBox && document.body.contains(greenBox)) {
            document.body.removeChild(greenBox);
        }
    }

    // Event listener for mouseover on anchor tags
    document.addEventListener('mouseover', function(e) {
        let hoveredElement;
        if (e.target.tagName === 'A') {
            hoveredElement = e.target;
        }else if(e.target.parentNode.tagName === 'A'){
            hoveredElement = e.target.parentNode;
        }
        if(hoveredElement && !isAllWhitespace(hoveredElement.textContent) && hoveredElement.parentNode && ((hoveredElement.parentNode.classList.contains("bookMess") || hoveredElement.parentNode.classList.contains("bookName"))||(hoveredElement.parentNode.parentNode && hoveredElement.parentNode.parentNode.classList.contains("bookMation")))){
            console.log(hoveredElement.textContent.replace(/[\s\t\n\r]+/g, '').replace("(", " ").replace(")", " ").replace("（", " ").replace("）", " ").replace(":", " ").replace("：", " "));
            let greenBox = document.querySelector('.styled-green-box');
            let mouseMoveHandler = function(mouseEvent) {
                updateGreenBoxPosition(greenBox, mouseEvent.clientX, mouseEvent.clientY);
            };
            let mouseOutHandler = function() {
                removeGreenBox(greenBox);
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseout', mouseOutHandler);
            };

            // Create the box if it doesn't exist
            if (!greenBox) {
                greenBox = createGreenBox(hoveredElement);
            }
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseout', mouseOutHandler);
        }
    }, { passive: true });

    // Function to update the position of the styled green box
    function updateGreenBoxPosition(box, x, y) {
        const boxWidth = box.offsetWidth;
        const boxHeight = box.offsetHeight;
        box.style.left = `${x + 5}px`; // Add a small offset to the right
        box.style.top = `${y + 5}px`; // Add a small offset upwards and adjust for the box height
    }

    let searchForm = document.querySelector('#search_form > input[type=text]');
    if(searchForm && !isAllWhitespace(searchForm.value)){
        const box = document.createElement('div');
        box.style.backgroundColor = 'rgba(250, 250, 250, 0.7)';
        box.style.border = '1px solid #8FBC8F';
        box.style.borderRadius = '5px';
        box.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        box.style.padding = '8px 15px';
        box.style.color = 'white';
        box.style.width = '100%'; // Set the width to 100% of the viewport
        box.style.height = '600px'; // Set the width to 100% of the viewport
        box.style.display = 'flex';
        box.style.justifyContent = 'center';
        box.style.overflow = 'hidden';

        const iframe = document.createElement('iframe');
        iframe.src = `https://search.kongfz.com/item_result/?status=1&key=${encodeURIComponent(searchForm.value)}`;
        iframe.style.width = '934px'; // Set the iframe width to 100%
        iframe.style.border = 'none'; // Remove the iframe default border
        iframe.style.height = '800px'; // Set the iframe height to 100%
        iframe.style.top = '-200px';
        iframe.style.boxSizing = 'border-box';
        iframe.style.position = 'relative';
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function() {
                handleKongfzSearch(iframe)
            });
        } else {
            iframe.onload = function() {
                handleKongfzSearch(iframe)
            };
        }
        let searchResultBox = document.querySelector('body > div.conLayout.cf.search.rConlNav');
        box.appendChild(iframe);
        if(searchResultBox){
            searchResultBox.insertAdjacentElement('afterend', box);
        }
    }

    // Style for the styled green box
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        div.content {
            background-color: white;
        }
        .styled-green-box {
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: rgba(0, 128, 0, 0.7);
            color: white;
            font-size: 14px;
            padding: 8px 15px;
            position: fixed;
            pointer-events: auto;
            max-width: 100%;
            word-wrap: break-word;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
})();