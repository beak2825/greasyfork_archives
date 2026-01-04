// ==UserScript==
// @name         ChatGPT提示词加载器，本插件由ChatGPT生成 点击右上角圆圈
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Advanced features for chat.openai.com
// @author       You
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473186/ChatGPT%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%8A%A0%E8%BD%BD%E5%99%A8%EF%BC%8C%E6%9C%AC%E6%8F%92%E4%BB%B6%E7%94%B1ChatGPT%E7%94%9F%E6%88%90%20%E7%82%B9%E5%87%BB%E5%8F%B3%E4%B8%8A%E8%A7%92%E5%9C%86%E5%9C%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473186/ChatGPT%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%8A%A0%E8%BD%BD%E5%99%A8%EF%BC%8C%E6%9C%AC%E6%8F%92%E4%BB%B6%E7%94%B1ChatGPT%E7%94%9F%E6%88%90%20%E7%82%B9%E5%87%BB%E5%8F%B3%E4%B8%8A%E8%A7%92%E5%9C%86%E5%9C%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const dataURL = 'https://raw.githubusercontent.com/rockbenben/ChatGPT-Shortcut/main/src/data/prompt_zh.json';
    let blocksData = [];
    let filteredBlocks = [];

    const circle = document.createElement('div');
    circle.id = 'custom-circle';
    document.body.appendChild(circle);


    const panel = document.createElement('div');
    panel.id = 'custom-panel';
    document.body.appendChild(panel);



    GM_addStyle(`

        #custom-circle {
       width: 50px;
    height: 50px;
    /* background: #3F51B5; */
    border-radius: 50%;
    position: fixed;
    top: 70px;
    right: 20px;
    transition: all 0.3s;
    z-index: 9999;
    cursor: pointer;
    border: 7px solid #ececf1;
         }

        #custom-panel {
            display: none;
            position: fixed;
            top: 120px;
            right: 20px;
            width: 710px;
            max-height: 600px;
            overflow-y: auto;
            border-radius: 10%;
            box-shadow: 0 0 15px rgba(0,0,0,.1);
            border-radius: 5px;
            padding: 10px;
            z-index: 9998;
            --tw-shadow: 0 0 15px rgba(0,0,0,.1);
            background: #ffffff;
        }
        #custom-blocks-container {
                padding-top: 10px;
        }

        .tag-button {
            margin: 2px;
            padding: 4px 8px;
            border: none;
            background:  #ececf1;
            border-radius: 5px;
            cursor: pointer;
        }

        .tag-button.selected {
            background: rgba(0, 0, 0, 0.5);
            color: white;
        }

        .block {
            flex: 1;
            max-width: 170px;
            height: 60px;
            margin: 0px 5px;
            padding: 5px;
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            cursor: pointer;
            border-width: 1px;
            font-weight: 600;
          font-size: .875rem;
          font-family: inherit;
        }
        /* 添加鼠标划过样式 */
        .block:hover {
            background-color: rgba(0, 0, 0, 0.1);
         }
         /* 添加点击样式 */
        .block:active {
           background-color: rgba(0, 0, 0, 0.5);
           box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.4);
        }
        /* Add more custom styles here */
    `);

    const tagsSet = new Set();



    GM_xmlhttpRequest({
                method: "GET",
                url: dataURL,
                responseType: "json",
                overrideMimeType: "text/html; charset=UTF-8",
                onload: (response) => {
                    blocksData = response.response;
                    response.response.forEach(block => {
                        block.tags.forEach(tag => tagsSet.add(tag));
                    });
                    renderTags(Array.from(tagsSet));

                    filteredBlocks = blocksData;
                    renderPanel();
                },
                onerror: () => {

                },
            });



    function renderTags(tagsArray) {
        const tagsContainer = document.createElement('div');
        tagsContainer.id = 'custom-tags-container';
        panel.appendChild(tagsContainer);

        tagsArray.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.textContent = tag;
            tagButton.classList.add('tag-button');
            if (tag === 'All') {
                tagButton.classList.add('selected');
            }
            tagButton.addEventListener('click', (event) => {
                event.stopPropagation();
                selectTag(tagButton);
                filterByTag(tag);
            });
            tagsContainer.appendChild(tagButton);
        });
    }

    var evt = document.createEvent('HTMLEvents');//createEvent=创建windows事件
    evt.initEvent('input', true, true);

    function renderPanel() {
        const customBlocksContainer = document.getElementById('custom-blocks-container');

        if (customBlocksContainer) {
            customBlocksContainer.remove();
        }

        const blocksContainer = document.createElement('div');
        blocksContainer.id = 'custom-blocks-container';
        panel.appendChild(blocksContainer);

        filteredBlocks.forEach((block, index) => {
            if (index % 4 === 0) {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.width = '100%';
                row.style.marginBottom = '10px';
                blocksContainer.appendChild(row);
            }

            const blockElement = document.createElement('div');
            blockElement.classList.add('block');
            blockElement.innerHTML = `<h4>${block.zh.title}</h4>`;
            blockElement.addEventListener('click', () => {
                const textarea = document.getElementById('prompt-textarea');
                textarea.value = block.zh.description;
                textarea.dispatchEvent(evt);



                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    view: window,
                    bubbles: true,
                    cancelable: true,
                });
                textarea.dispatchEvent(enterEvent);


                panel.style.display = 'none';
            });

            const row = blocksContainer.lastChild;
            row.appendChild(blockElement);
        });
    }

    function selectTag(tagButton) {
        const tagButtons = document.querySelectorAll('.tag-button');
        tagButtons.forEach(button => {
            button.classList.remove('selected');
        });
        tagButton.classList.add('selected');
    }

    function filterByTag(tag) {

        if (tag === 'All') {
            filteredBlocks = blocksData;
        } else {
            filteredBlocks = blocksData.filter(block => block.tags.includes(tag));
        }
        renderPanel();
    }

    circle.addEventListener('click', () => {
        circle.style.transform = 'scale(0)';
        panel.style.display = 'block';
    });

    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && event.target !== circle) {
            if (panel.style.display === 'block') {
                circle.style.transform = 'scale(1)';
                panel.style.display = 'none';
            }
        }
    });
})();
