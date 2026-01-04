// ==UserScript==
// @name         手机网页修改器(无痕透明版)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  手机端网页内容无痕修改
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/522902/%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E4%BF%AE%E6%94%B9%E5%99%A8%28%E6%97%A0%E7%97%95%E9%80%8F%E6%98%8E%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522902/%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E4%BF%AE%E6%94%B9%E5%99%A8%28%E6%97%A0%E7%97%95%E9%80%8F%E6%98%8E%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalContent = new Map();
    let modifiedContent = {};
    try {
        modifiedContent = GM_getValue(location.href) || {};
    } catch(e) {
        console.log('Load failed');
        modifiedContent = {};
    }

    function createEditButton() {
        const floatBtn = document.createElement('div');
        floatBtn.id = 'mobileEditContainer';
        floatBtn.innerHTML = `
            <div id="mobileEdit" style="
                position: fixed;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 999999;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                opacity: 0.1;
                transition: opacity 0.3s;
            ">
                <div id="editBtn" style="
                    width: 40px;
                    height: 40px;
                    background: transparent;
                    border: 2px solid rgba(0,0,0,0.2);
                    border-radius: 50%;
                    transition: all 0.3s;
                "></div>
            </div>
        `;
        document.body.appendChild(floatBtn);

        let isEditing = false;
        let isDragging = false;
        let startY;
        let startX;
        
        const mobileEdit = document.getElementById('mobileEdit');
        const editBtn = document.getElementById('editBtn');

        // 触摸时显示按钮
        mobileEdit.addEventListener('touchstart', function(e) {
            mobileEdit.style.opacity = '1';
            startY = e.touches[0].clientY - mobileEdit.offsetTop;
            startX = e.touches[0].clientX - mobileEdit.offsetLeft;
            isDragging = false;
        });

        // 移动时保持显示
        mobileEdit.addEventListener('touchmove', function(e) {
            isDragging = true;
            const newY = e.touches[0].clientY - startY;
            const newX = e.touches[0].clientX - startX;
            
            mobileEdit.style.top = Math.max(0, Math.min(window.innerHeight - 60, newY)) + 'px';
            mobileEdit.style.right = 'auto';
            mobileEdit.style.left = Math.max(0, Math.min(window.innerWidth - 60, newX)) + 'px';
        });

        // 触摸结束后渐隐
        mobileEdit.addEventListener('touchend', function(e) {
            setTimeout(() => {
                mobileEdit.style.opacity = '0.1';
            }, 2000); // 2秒后渐隐

            if (!isDragging) {
                isEditing = !isEditing;
                editBtn.style.backgroundColor = isEditing ? 'rgba(255,0,0,0.2)' : 'transparent';
                editBtn.style.borderColor = isEditing ? 'rgba(255,0,0,0.4)' : 'rgba(0,0,0,0.2)';
                
                if (isEditing) {
                    enableEdit();
                } else {
                    saveChanges();
                    disableEdit();
                }
            }
        });
    }

    function enableEdit() {
        const elements = document.querySelectorAll('p, div:not(#mobileEditContainer), span, h1, h2, h3, h4, h5, li');
        elements.forEach(el => {
            if (!el.closest('#mobileEditContainer')) {
                el.setAttribute('contenteditable', 'true');
                el.style.cursor = 'text';
                if (!originalContent.has(el)) {
                    originalContent.set(el, el.innerHTML);
                }
            }
        });
    }

    function disableEdit() {
        document.querySelectorAll('[contenteditable]').forEach(el => {
            el.removeAttribute('contenteditable');
            el.style.cursor = '';
        });
    }

    function saveChanges() {
        const newContent = {};
        document.querySelectorAll('[contenteditable]').forEach(el => {
            if (el.innerHTML !== originalContent.get(el)) {
                const selector = generateSelector(el);
                if (selector) {
                    newContent[selector] = el.innerHTML;
                }
            }
        });
        
        if (Object.keys(newContent).length > 0) {
            modifiedContent = newContent;
            try {
                GM_setValue(location.href, modifiedContent);
                console.log('Changes saved successfully');
            } catch(e) {
                console.error('Error saving changes:', e);
            }
        }
    }

    function generateSelector(element) {
        try {
            if (element.id) return '#' + element.id;
            
            let path = [];
            let current = element;
            
            while (current && current.tagName) {
                let selector = current.tagName.toLowerCase();
                if (current.className) {
                    selector += '.' + Array.from(current.classList).join('.');
                }
                let siblings = current.parentNode ? Array.from(current.parentNode.children) : [];
                if (siblings.length > 1) {
                    let index = siblings.indexOf(current) + 1;
                    selector += `:nth-child(${index})`;
                }
                path.unshift(selector);
                
                if (path.length >= 3) break;
                current = current.parentNode;
            }
            
            return path.join(' > ');
        } catch(e) {
            console.error('Error generating selector:', e);
            return null;
        }
    }

    function applyModifiedContent() {
        Object.entries(modifiedContent).forEach(([selector, content]) => {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = content;
                }
            } catch(e) {
                console.error('Error applying modification:', e);
            }
        });
    }

    function init() {
        createEditButton();
        applyModifiedContent();
        console.log('Mobile editor initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();