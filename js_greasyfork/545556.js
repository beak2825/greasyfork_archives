// ==UserScript==
// @name         Creatio Context Linker & WebAdmin Helper
// @namespace    https://mangotele.com/
// @version      2.0.0
// @description  Находит контексты в Creatio и создает popup с ссылками. Автоматически включает "Переадресующий (Внешний)" в WebAdmin.
// @author       bespredel
// @match        https://creatio.corp.mango.ru/*
// @match        https://webadmin.by.mgo.su/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545556/Creatio%20Context%20Linker%20%20WebAdmin%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545556/Creatio%20Context%20Linker%20%20WebAdmin%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentDomain = window.location.hostname;
    
    if (currentDomain === 'webadmin.by.mgo.su') {
        initWebAdminHelper();
    } else if (currentDomain === 'creatio.corp.mango.ru') {
        initCreatioHelper();
    }

    function initWebAdminHelper() {
        function enableRedirectingExternal() {
            const menuItems = document.querySelectorAll('li.x-menu-list-item');
            
            for (const item of menuItems) {
                const textSpan = item.querySelector('.x-menu-item-text');
                if (textSpan && textSpan.textContent.includes('Переадресующий (Внешний)')) {
                    if (!item.classList.contains('x-menu-item-checked')) {
                        const link = item.querySelector('a.x-menu-item');
                        if (link) {
                            link.click();
                            console.log('WebAdmin Helper: Включен "Переадресующий (Внешний)"');
                        }
                    }
                    break;
                }
            }
        }

        function moveRedirectingColumn() {
            const calledNumberHeaders = document.querySelectorAll('.x-grid3-td-calledNumber');
            const redirectingHeaders = document.querySelectorAll('.x-grid3-td-redirectingNumberOrig');
            
            if (calledNumberHeaders.length === 0 || redirectingHeaders.length === 0) {
                return;
            }
            
            for (let i = 0; i < Math.min(calledNumberHeaders.length, redirectingHeaders.length); i++) {
                const calledNumberHeader = calledNumberHeaders[i];
                const redirectingHeader = redirectingHeaders[i];
                
                if (calledNumberHeader && redirectingHeader) {
                    const headerRow = calledNumberHeader.closest('tr');
                    const redirectingRow = redirectingHeader.closest('tr');
                    
                    if (headerRow === redirectingRow && calledNumberHeader.nextElementSibling !== redirectingHeader) {
                        calledNumberHeader.insertAdjacentElement('afterend', redirectingHeader);
                        
                        const headerTable = headerRow.closest('table');
                        if (headerTable) {
                            const currentWidth = headerTable.style.width || headerTable.offsetWidth + 'px';
                            const newWidth = parseInt(currentWidth) < 1900 ? '1900px' : currentWidth;
                            headerTable.style.width = newWidth;
                        }
                        
                        console.log('WebAdmin Helper: Переместил колонку "Переадресующий" после "На номер"');
                    }
                }
            }
            
            const calledNumberCells = document.querySelectorAll('td[class*="calledNumber"]');
            const redirectingCells = document.querySelectorAll('td[class*="redirectingNumberOrig"]');
            
            for (let i = 0; i < Math.min(calledNumberCells.length, redirectingCells.length); i++) {
                const calledCell = calledNumberCells[i];
                const redirectingCell = redirectingCells[i];
                
                if (calledCell && redirectingCell) {
                    const cellRow = calledCell.closest('tr');
                    const redirectingCellRow = redirectingCell.closest('tr');
                    
                    if (cellRow === redirectingCellRow && calledCell.nextElementSibling !== redirectingCell) {
                        calledCell.insertAdjacentElement('afterend', redirectingCell);
                    }
                }
            }
        }

        function observeWebAdmin() {
            const observer = new MutationObserver(function(mutations) {
                let shouldCheck = mutations.some(mutation => 
                    mutation.addedNodes.length > 0 || 
                    mutation.type === 'attributes'
                );
                
                if (shouldCheck) {
                    setTimeout(() => {
                        enableRedirectingExternal();
                        moveRedirectingColumn();
                    }, 200);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });

            return observer;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                enableRedirectingExternal();
                moveRedirectingColumn();
                observeWebAdmin();
            });
        } else {
            enableRedirectingExternal();
            moveRedirectingColumn();
            observeWebAdmin();
        }

        setInterval(() => {
            enableRedirectingExternal();
            moveRedirectingColumn();
        }, 5000);
    }

    function initCreatioHelper() {

    let contextPopup = null;
    let foundContexts = new Set();
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    function createPopup() {
        if (contextPopup) return;
        
        contextPopup = document.createElement('div');
        contextPopup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
            border: 1px solid #444;
            border-radius: 12px;
            padding: 0;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1);
            z-index: 10000;
            min-width: 280px;
            max-width: 350px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            color: #e0e0e0;
            backdrop-filter: blur(10px);
            cursor: move;
        `;
        
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(90deg, #3a3a3a 0%, #2a2a2a 100%);
            padding: 12px 16px;
            border-radius: 12px 12px 0 0;
            border-bottom: 1px solid #444;
            font-weight: 600;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;
        
        const title = document.createElement('span');
        title.textContent = '🔗 Найденные контексты';
        title.style.cssText = 'font-size: 14px;';
        
        const closeBtn = document.createElement('span');
        closeBtn.style.cssText = `
            cursor: pointer;
            color: #999;
            font-size: 16px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s ease;
        `;
        closeBtn.textContent = '✕';
        closeBtn.onmouseover = () => {
            closeBtn.style.backgroundColor = '#ff4444';
            closeBtn.style.color = '#fff';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#999';
        };
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            if (contextPopup) {
                contextPopup.remove();
                contextPopup = null;
                foundContexts.clear();
            }
        };
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        contextPopup.appendChild(header);
        
        const contextList = document.createElement('div');
        contextList.id = 'context-list';
        contextList.style.cssText = `
            padding: 12px;
            max-height: 400px;
            overflow-y: auto;
        `;
        contextPopup.appendChild(contextList);
        
        makeDraggable(contextPopup, header);
        document.body.appendChild(contextPopup);
    }

    function makeDraggable(element, handle) {
        handle.onmousedown = (e) => {
            if (e.target === handle.querySelector('span:last-child')) return;
            isDragging = true;
            const rect = element.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        };

        document.onmousemove = (e) => {
            if (!isDragging) return;
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, x)) + 'px';
            element.style.top = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, y)) + 'px';
            element.style.right = 'auto';
        };

        document.onmouseup = () => {
            isDragging = false;
            element.style.cursor = 'move';
        };
    }

    function addContextToPopup(context) {
        if (foundContexts.has(context)) return;
        foundContexts.add(context);
        
        createPopup();
        
        const contextList = document.getElementById('context-list');
        const contextBlock = document.createElement('div');
        contextBlock.style.cssText = `
            background: linear-gradient(135deg, #404040 0%, #2a2a2a 100%);
            border: 1px solid #555;
            border-radius: 8px;
            padding: 12px 16px;
            margin: 8px 0;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            font-weight: 600;
            color: #fff;
            font-size: 14px;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        `;
        
        contextBlock.textContent = context;
        
        contextBlock.onmouseover = () => {
            contextBlock.style.background = 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
            contextBlock.style.borderColor = '#4a90e2';
            contextBlock.style.transform = 'translateY(-2px)';
            contextBlock.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
        };
        
        contextBlock.onmouseout = () => {
            contextBlock.style.background = 'linear-gradient(135deg, #404040 0%, #2a2a2a 100%)';
            contextBlock.style.borderColor = '#555';
            contextBlock.style.transform = 'translateY(0)';
            contextBlock.style.boxShadow = 'none';
        };
        
        contextBlock.onclick = (e) => {
            contextBlock.style.background = 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)';
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = `https://webadmin.by.mgo.su/wa/?context=${context}#p=sswa-module-softplatform-cdrs`;
                link.target = '_blank';
                document.body.appendChild(link);
                
                const event = new MouseEvent('click', {
                    ctrlKey: true,
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                
                link.dispatchEvent(event);
                document.body.removeChild(link);
            }, 150);
        };
        
        contextList.appendChild(contextBlock);
    }

    function findContextsInText(text) {
        const regex = /\b(\d{11})\b/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            const context = match[1];
            if (!context.startsWith('7') && !context.startsWith('8')) {
                addContextToPopup(context);
            }
        }
    }

    function processFields() {
        const textarea1 = document.getElementById('CasePageSymptomsHtmlEdit-el');
        const textarea2 = document.getElementById('CasePageSymptomsHtmlEdit-virtual');
        const emailContent = document.querySelector('.adaptive-text.ignore-collapse');

        if (textarea1 && textarea1.value) {
            findContextsInText(textarea1.value);
        }
        
        if (textarea2 && textarea2.value) {
            findContextsInText(textarea2.value);
        }
        
        if (emailContent) {
            findContextsInText(emailContent.textContent || emailContent.innerText || '');
        }
    }

    function initObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = mutations.some(mutation =>
                mutation.addedNodes.length > 0 ||
                mutation.type === 'attributes' ||
                mutation.type === 'characterData'
            );

            if (shouldProcess) {
                setTimeout(processFields, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });

        return observer;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            processFields();
            initObserver();
        });
    } else {
        processFields();
        initObserver();
    }

    setInterval(processFields, 3000);
    }
})();

