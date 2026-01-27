// ==UserScript==
// @name         Floating Page Scroll Assistant
// @name:zh-CN   页面滚动助手
// @name:zh-TW   頁面滾動助手
// @namespace    http://tampermonkey.net/
// @version      1.1.02
// @description  A set of floating buttons on the screen that quickly scroll to the top and bottom of the page, and scroll up/down one page.
// @description:zh-CN  在屏幕上显示一组浮动按钮，帮助用户快速滚动到页面顶部或底部，并支持向上/向下滚动一页的功能。
// @description:zh-TW  在螢幕上顯示一組浮動按鈕，幫助用戶快速滾動到頁面頂部或底部，並支援向上/向下滾動一頁的功能。
// @author       Kamiya Minoru
// @match        *://*/*
// @exclude      *://www.google.com/*
// @exclude      *://www.google.com.tw/*
// @exclude      *://www.google.co.jp/*
// @exclude      https://www.bilibili.com/
// @exclude      https://*.microsoft/*
// @exclude      https://gemini.google.com/*
// @exclude      https://chatgpt.com/*
// @exclude      https://drive.google.com/*
// @exclude      https://www.perplexity.ai/*
// @exclude      https://github.com/copilot*
// @exclude      https://claude.ai/*
// @exclude      https://chat.deepseek.com/*
// @exclude      https://kimi.moonshot.cn/*
// @exclude      https://www.doubao.com/*
// @exclude      https://www.twitch.tv/*
// @exclude      https://www.flaticon.com/*
// @exclude      https://www.windy.com/*
// @exclude      https://*.kingfa.com.cn/*
// @exclude      https://www.accupass.com/event/2510080612504929276220
// @noframes
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527645/Floating%20Page%20Scroll%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/527645/Floating%20Page%20Scroll%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a Trusted Types policy
    const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
        createHTML: (string) => string
    });

    // Create a container for the buttons
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.right = '10px';
    container.style.top = '185px';
    container.style.transform = 'translateY(-50%)';
    container.style.zIndex = '9999999';
    document.body.appendChild(container);

    // Function to create a button
    function createButton(innerHTML, onClick, tooltip) {
        var button = document.createElement('div');
        button.innerHTML = escapeHTMLPolicy.createHTML(innerHTML); // 使用 TrustedHTML
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'transparent';
        button.style.color = 'grey';
        button.style.textAlign = 'center';
        button.style.fontSize = '24px';
        button.style.borderRadius = '50%';
        button.style.userSelect = 'none';
        button.style.marginBottom = '8px';
        button.style.opacity = tooltip === 'Close' || tooltip === 'drag to Move' ? '0.3' : '0.4';
        button.style.transition = 'all 0.3s';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.border = '1px solid grey';
        button.title = tooltip;
        button.addEventListener('click', onClick);
        button.addEventListener('mouseover', function() {
            button.style.opacity = '1';
            button.style.filter = 'drop-shadow(0 0 1px grey)';
            button.style.color = '#FFF';
            if (tooltip === 'Close') {
                button.querySelectorAll('path').forEach(path => {
                    path.style.stroke = 'red';
                    path.style.fill = 'red';
                });
            }
        });
        button.addEventListener('mouseout', function() {
            button.style.opacity = tooltip === 'Close' || tooltip === 'drag to Move' ? '0.3' : '0.4';
            button.style.filter = 'drop-shadow(0 0 0 grey)';
            button.style.color = 'grey';
            if (tooltip === 'Close') {
                button.querySelectorAll('path').forEach(path => {
                    path.style.stroke = '#3276c3';
                    path.style.fill = '#3276c3';
                });
            }
        });
        return button;
    }

    // Create the buttons
    var topButton = createButton('<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 12C21 7.03005 16.9709 3 12 3C7.03006 3 3 7.03005 3 12C3 16.9699 7.03005 21 12 21C16.9709 21 21 16.9699 21 12Z" stroke="#3276c3" stroke-width="2" stroke-linecap="round"></path> <path d="M15 13L12 10L9 13" stroke="#3276c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>', function() {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, "Scroll to Top");
    var pageUpButton = createButton('<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="9" stroke="#3276c3" stroke-width="2" stroke-linecap="round"></circle> <path d="M12 16L12 8M12 8L15 11M12 8L9 11" stroke="#3276c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>', function() {
        window.scrollBy({ top: -window.innerHeight, behavior: 'instant' });
    }, "Page Up");
    var pageDownButton = createButton('<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="9" stroke="#3276c3" stroke-width="2" stroke-linecap="round"></circle> <path d="M12 16L12 8M12 8L15 11M12 8L9 11" stroke="#3276c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>', function() {
        window.scrollBy({ top: window.innerHeight, behavior: 'instant' });
    }, "Page Down");
    var bottomButton = createButton('<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 12C21 7.03005 16.9709 3 12 3C7.03006 3 3 7.03005 3 12C3 16.9699 7.03005 21 12 21C16.9709 21 21 16.9699 21 12Z" stroke="#3276c3" stroke-width="2" stroke-linecap="round"></path> <path d="M15 13L12 10L9 13" stroke="#3276c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>', function() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    }, "Scroll to Bottom");
    var closeButton = createButton('<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289Z" fill="#3276c3"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="#3276c3"></path> </g></svg>', function() {
        container.style.display = 'none';
    }, "Close");

    // Create the drag button
    var dragButton = createButton('<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" fill="#3276c3"></path> <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" fill="#3276c3"></path> <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="#3276c3"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="#3276c3"></path> </g></svg>', function() {}, "drag to Move");
    dragButton.style.cursor = 'grab';

    dragButton.addEventListener('mousedown', function(e) {
        dragButton.style.cursor = 'grabbing';
        var initialX = e.clientX;
        var initialY = e.clientY;
        var initialLeft = container.offsetLeft;
        var initialTop = container.offsetTop;

        function moveAt(pageX, pageY) {
            container.style.left = initialLeft + (pageX - initialX) + 'px';
            container.style.top = initialTop + (pageY - initialY) + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.clientX, event.clientY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', function() {
            dragButton.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', arguments.callee);
        });
    });

    dragButton.ondragstart = function() {
        return false;
    };

    // Append buttons to the container
    container.appendChild(topButton);
    container.appendChild(pageUpButton);
    container.appendChild(pageDownButton);
    container.appendChild(bottomButton);
    container.appendChild(closeButton);
    container.appendChild(dragButton);
})();