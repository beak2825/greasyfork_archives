// ==UserScript==
// @name         ecology9助手
// @namespace     niansi
// @version      1.0.3
// @description  ecology9助手，便捷操作ecology9系统，包括打开ecode、移动端、SQL缓存管理等功能
// @author       廿四
// @match        http*://*/wui/*
// @match        http*://*/spa/*
// @icon         https://www.weaver.com.cn/img/favicon.ico
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/504504/ecology9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/504504/ecology9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        ecode: true,
        mobilePage: true,
        cacheMonitor: true
    };

    function addCssIfNotExists(url) {
        const urlWithoutQuery = url.split('?')[0];
        const links = document.head.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            const linkHrefWithoutQuery = links[i].href.split('?')[0];
            if (linkHrefWithoutQuery.includes(urlWithoutQuery)) {
                return;
            }
        }
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = url;
        document.head.appendChild(linkElement);
    }

    var isShowInfoCard = false;

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        Object.assign(button.style, {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        return button;
    }

    function createInfoCard(workflowInfo, modeInfo) {
        const card = document.createElement('div');
        Object.assign(card.style, {
            position: 'fixed',
            bottom: '50px',
            right: '10px',
            width: '300px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            zIndex: '1000'
        });

        const createSection = (title, data) => {
            const section = document.createElement('div');

            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = title;
            section.appendChild(sectionTitle);

            const sectionContent = document.createElement('div');
            sectionContent.style.overflowY = 'auto';

            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    const infoItem = document.createElement('p');
                    infoItem.textContent = `${key}: ${value}`;
                    sectionContent.appendChild(infoItem);
                }
            } else {
                const infoItem = document.createElement('p');
                infoItem.textContent = '无可用信息';
                sectionContent.appendChild(infoItem);
            }

            section.appendChild(sectionContent);
            return section;
        };

        if (workflowInfo) {
            card.appendChild(createSection('流程信息', {
                '请求ID.requestid': workflowInfo.requestid,
                '流程ID.workflowid': workflowInfo.workflowid,
                '节点ID.nodeid': workflowInfo.nodeid,
                '表单ID.formid': workflowInfo.formid
            }));
        }

        if (modeInfo) {
            card.appendChild(createSection('建模信息', {
                '数据ID.billid': modeInfo.billid,
                '显示类型.type': modeInfo.type,
                '模块ID.modeId': modeInfo.modeId,
                '表单ID.formId': modeInfo.formId,
                '模块名称.modeName': modeInfo.modeName,
                '模块标题.modeTitle': modeInfo.modeTitle
            }));
        }

        if (!workflowInfo && !modeInfo) {
            card.appendChild(createSection('无可用信息', null));
        }

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        Object.assign(closeButton.style, {
            width: '100%',
            padding: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
        });

        closeButton.onclick = () => {
            isShowInfoCard = false;
            document.body.removeChild(card);
        };

        card.appendChild(closeButton);
        document.body.appendChild(card);
    }

    function InterceptNetworkRequest() {
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && this.status === 200 && url.includes('/api/ec/dev/table/datas')) {
                    const dataKey = new URLSearchParams(this.responseURL).get('dataKey');
                    if (dataKey) {
                        displayDebugButton(dataKey);
                    }
                }
            })
            return originalXHROpen.apply(this, [method, url, ...args]);
        }

        const originalFetch = window.fetch;
        window.fetch = function(resource, config) {
            if (config && config.method === 'POST' && config.headers) {
                const params = new URLSearchParams(config.body);
                const dataKey = params.get('dataKey');
                if (dataKey) {
                    displayDebugButton(dataKey);
                }
            }

            return originalFetch.apply(this, arguments)
              .then(res => {
                  if (res.url.includes('/api/ec/dev/table/datas') && res.status === 200) {
                      res.clone().text().then(text => {
                          const params = new URLSearchParams(text);
                          const dataKey = params.get('dataKey');
                          if (dataKey) {
                              displayDebugButton(dataKey);
                          }
                      })
                  }
                  return res;
              })
        }
    }

    function displayDebugButton(dataKey) {
        const debugButton = document.getElementById('debugButton');
        debugButton.onclick = () => window.open(`/api/ec/dev/table/getxml?dataKey=${dataKey}`, '_blank');

        debugButton.style.backgroundColor = `#2196F3`
        debugButton.style.cursor = 'pointer';

        let count = 0;
        const blinkInterval = setInterval(() => {
            debugButton.style.backgroundColor = count % 2 === 0 ? 'gray' : '#2196F3';
            count++;
            if (count >= 10) {
                clearInterval(blinkInterval);
            }
        }, 500)

        setTimeout(() => {
            debugButton.onclick = null;
            debugButton.style.cursor = 'not-allowed';
            debugButton.style.backgroundColor = 'gray';
        }, 10000)
    }

    function main() {
        addCssIfNotExists('/spa/theme/static/index.css');
        addCssIfNotExists('/cloudstore/resource/pc/com/v1/ecCom.min.css');

        const togglecard = document.createElement('div');
        Object.assign(togglecard.style, {
            position: 'fixed',
            bottom: '50px',
            right: '10px',
            width: '200px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            zIndex: '1000',
            display: 'none'
        });

        if (config.ecode) {
            togglecard.appendChild(createButton('打开ecode', () => window.open('/ecode', '_blank')));
        }

        if (config.mobilePage) {
            togglecard.appendChild(createButton('打开移动端', () => window.open('/spa/em/mobile.html', '_blank')));
        }

        if (config.cacheMonitor) {
            togglecard.appendChild(createButton('SQL缓存管理', () => window.open('/commcache/cacheMonitor.jsp', '_blank')));
        }

        const allButtonContainer = document.createElement('div');
        Object.assign(allButtonContainer.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1001'
        });

        const toggleButton = document.createElement('div');
        const toggleiconElement = document.createElement('i');
        toggleiconElement.className = 'icon-New-Flow-menu';
        toggleButton.appendChild(toggleiconElement);

        Object.assign(toggleButton.style, {
            width: '30px',
            height: '30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            marginLeft: '10px'
        });
        toggleButton.onclick = () => {
            togglecard.style.display = togglecard.style.display === 'none' ? 'block' : 'none';
        };

        const debugButton = document.createElement('div');
        const debugiconElement = document.createElement('i');
        debugiconElement.className = 'icon-coms02-coms-preview';
        debugButton.appendChild(debugiconElement);

        debugButton.id = 'debugButton';
        Object.assign(debugButton.style, {
            width: '30px',
            height: '30px',
            backgroundColor: 'gray',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'not-allowed',
            marginLeft: '10px'
        });

        const infoButton = document.createElement('div');
        const infoiconElement = document.createElement('i');
        infoiconElement.className = 'icon-coms02-Version';
        infoButton.appendChild(infoiconElement);

        infoButton.id = 'infoButton';
        Object.assign(infoButton.style, {
            width: '30px',
            height: '30px',
            backgroundColor: '#14b8a6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            cursor: 'pointer',
            marginLeft: '10px'
        });

        infoButton.onclick = () => {
            if (isShowInfoCard) {
                return;
            }
            isShowInfoCard = true;
            const workflowInfo = (typeof wfform !== 'undefined' && wfform !== null && typeof wfform.getBaseInfo === 'function') ? wfform.getBaseInfo() : null;
            const modeInfo = (typeof ModeForm !== 'undefined' && ModeForm !== null && typeof ModeForm.getCardUrlInfo === 'function') ? ModeForm.getCardUrlInfo() : null;
            togglecard.style.display = 'none'
            createInfoCard(workflowInfo, modeInfo);
        };

        allButtonContainer.appendChild(debugButton);
        allButtonContainer.appendChild(infoButton);
        allButtonContainer.appendChild(toggleButton);

        document.body.appendChild(togglecard);
        document.body.appendChild(allButtonContainer);

        InterceptNetworkRequest();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
