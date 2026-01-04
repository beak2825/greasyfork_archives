// ==UserScript==
// @name         V2EX新帖挂件(新版)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  一个简单的V2EX自动签到脚本
// @author       limubai
// @match         *://*.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520297/V2EX%E6%96%B0%E5%B8%96%E6%8C%82%E4%BB%B6%28%E6%96%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520297/V2EX%E6%96%B0%E5%B8%96%E6%8C%82%E4%BB%B6%28%E6%96%B0%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    const RIGHTBAR_SELECTOR = '#Rightbar .box';
    const RSS_URL = `/index.xml`; // v2ex.com/index.xml

    function createElementFromHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild;
    }

    function appendToWrapper(wrapper, html) {
        const element = createElementFromHTML(html);
        wrapper.appendChild(element);
    }

    function createLoadingOverlay(parent) {
        const overlay = document.createElement('div');
        overlay.id = 'loading_frame';
        overlay.innerHTML = 'Loading...';
        overlay.style.cssText =
            'display:block;height:3000px;position: absolute;background: #ffffffd6;width: 100%;vertical-align: middle;z-index: 999;top:47px;padding-top:200px;';
        parent.appendChild(overlay);
        return
    }

    function removeLoadingOverlay() {
        const overlay = document.getElementById('loading_frame');
        if (overlay) overlay.remove();
    }

    async function fetchAndRenderRSS(parent) {
        try {
            removeLoadingOverlay()
            createLoadingOverlay(parent)
            const response = await fetch(RSS_URL);

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const xmlText = await response.text();
            const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');

            const titles = xmlDoc.getElementsByTagName('title');
            const links = xmlDoc.getElementsByTagName('link');

            const newListHTML = generateNewListHTML(titles, links);
            const newList = createElementFromHTML(newListHTML);

            const existingList = parent.querySelector('#new_list');
            if (existingList) parent.removeChild(existingList);

            parent.appendChild(newList);
            removeLoadingOverlay()
        } catch (error) {
            console.error('Failed to fetch or parse RSS feed:', error);
        }
    }

    function generateNewListHTML(titles, links) {
        let html = '<div id="new_list">';
        for (let i = 1; i < titles.length; i++) {
            const pureTitle = titles[i].textContent.replace(/^\[.*?\]/, '');
            const tag = titles[i].textContent.match(/^\[.*?\]/)[0];
            const link = links[i + 1].getAttribute('href');

            html += `<div class="cell" style="position:relative">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tbody>
                        <tr>
                            <td class="topic_type" width="24" valign="middle" align="center" style="color: var(--color-fade);padding: 0 13px;white-space: nowrap;min-width: 66px;position: absolute;transform: scale(0.8);top: -12px;right: 4px;background: var(--box-background-color);">${tag}</td>
                            <td width="10"></td>
                            <td width="auto" valign="middle">
                                <span class="item_rss_new_topic_title">
                                    <a style="text-overflow: -o-ellipsis-lastline;overflow: hidden;text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2;-webkit-box-orient: vertical;" target="_blank" href="${link}">${pureTitle}</a>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
        }
          html += '</div>';
          return html;
      }

        function setupRefreshButton(parent) {
            const refreshButton = parent.querySelector('.refresh_new');
            refreshButton.addEventListener('click', () => {
                fetchAndRenderRSS(parent);
            });
        }

        async function init() {
            const widgetTarget = document.querySelector(RIGHTBAR_SELECTOR);

            if (!widgetTarget) {
                console.error('Widget target not found!');
                return;
            }

            const htmlWrapper = `
            <div class="box" id="sb_v2" style="position:relative;max-height:500px;overflow-x:hidden;overflow-y:scroll">
                <div id="new_head" class="cell" style="background: var(--box-background-color);top: 0;position: sticky;z-index: 999;margin-bottom:14px;">
                    <span class="fade">最近发布主题</span>
                    <span><a class="fade refresh_new" style="margin-left:9px;color:var(--link-color);cursor:pointer">刷新</a></span>
                </div>
            </div>`;

          appendToWrapper(widgetTarget, htmlWrapper);
          const listWrap = widgetTarget.querySelector('#sb_v2');

          fetchAndRenderRSS(listWrap);
          setupRefreshButton(listWrap);
      }

        init();
    })();