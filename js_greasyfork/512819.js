// ==UserScript==
// @name         JavDB 个人收藏系列保存到本地
// @name:zh-CN   JavDB 个人收藏系列保存到本地
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  (JavDB 个人收藏系列保存到本地)
// @description:zh-CN (JavDB 个人收藏系列保存到本地)
// @author       slowFever
// @match        *://*javdb*.com/*
// @icon         https://javdb.com/favicon-32x32.png
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512819/JavDB%20%E4%B8%AA%E4%BA%BA%E6%94%B6%E8%97%8F%E7%B3%BB%E5%88%97%E4%BF%9D%E5%AD%98%E5%88%B0%E6%9C%AC%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/512819/JavDB%20%E4%B8%AA%E4%BA%BA%E6%94%B6%E8%97%8F%E7%B3%BB%E5%88%97%E4%BF%9D%E5%AD%98%E5%88%B0%E6%9C%AC%E5%9C%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const objectElementNodesPool = {
        'head': document.querySelector('head'),
        'series': document.getElementById('series'),
    };

    // let allSeriesData = JSON.parse(localStorage.getItem('seriesData')) || [];
    let allSeriesData = JSON.parse(GM_getValue('seriesData', '[]'));

    /**
     * @description Adds the necessary styles to the page for the operation panel.
     * @returns {void}
     */
    function addStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
          #operation_series {
            position: fixed;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            backdrop-filter: blur(0.5rem) saturate(180%);
            -webkit-backdrop-filter: blur(0.5rem) saturate(180%);
            background-color: rgba(255, 255, 255, 0.55);
            border-top-right-radius: 0.75rem;
            border-bottom-right-radius: 0.75rem;
            transition: all 0.5s;
            z-index: 999999;
          }
        
          #operation_series .wrap {
            padding: 0.9375rem;
            position: relative;
          }
        
          #operation_series .buttons-wrap {
            margin: 0 8px;
          }
        
          #operation_series .toggle-button {
            content: '<';
            position: absolute;
            top: 50%;
            right: -0.8125rem; /* Positioning the button to the right */
            transform: translateY(-50%);
            background-color: #f14668;
            color: #fff;
            width: 1.5625rem;
            height: 1.5625rem;
            line-height: 1.5625rem;
            text-align: center;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            -moz-box-shadow:0px 0px 8px #333333; -webkit-box-shadow:0px 0px 8px #333333; box-shadow:0px 0px 8px #333333;
          }
        
          #operation_series.collapsed {
            left: -18.6875rem; /* Adjust this value based on the width of the #operation_series element */
          }
        
          #operation_series.collapsed .toggle-button::before {
            content: '>';
          }
        
          #operation_series .toggle-button::before {
            content: '<';
          }
        
          #operation_series .series-button, #operation_series .save-local-button {
            width: 7.8125rem;
            height: 3.125rem;
            line-height: 3.125rem;
            font-size: 1rem;
            margin: 0.3125rem auto;
            color: #fff;
            background: #f14668;
            text-align: center;
            border-radius: 0.9375rem;
            font-weight: 600;
            border: none;
            display: block;
            cursor: pointer;
            -moz-box-shadow:0px 0px 3px #333333; -webkit-box-shadow:0px 0px 3px #333333; box-shadow:0px 0px 3px #333333;
          }
        
          #operation_series .series-button:hover, #operation_series .save-local-button:hover{
            -moz-box-shadow:0px 0px 0px #333333; -webkit-box-shadow:0px 0px 0px #333333; box-shadow:0px 0px 0px #333333;
          }
        
          #operation_series .dataResponseBox {
            width: 100%;
            padding: 1.5625rem 0;
          }
        
          #operation_series .dataResponseBox .dataResponse {
            width: 100%;
            text-align: center;
            color: #000;
            margin: 0;
          }
        
          #operation_series .buttons-wrap {
            display: flex;
          }
      `;
        objectElementNodesPool.head.appendChild(style);
    }

    /**
     * @description Creates the operation panel in the DOM.
     * @returns {void}
     */
    function createPanel() {
        const panel = document.createElement('div');
        panel.setAttribute('id', 'operation_series');
        panel.innerHTML = `
            <div class="wrap">
                <button class="toggle-button"></button>
                <div class="dataResponseBox">
                  <p class="dataResponse">请获取数据...</p>
                </div>
                <div class="buttons-wrap">
                    <button class="series-button">获取系列数据</button>
                    <span style="margin: 0 10px"></span>
                    <button class="save-local-button">保存到本地</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        panel.querySelector('.series-button').addEventListener('click', handlePanelButtonClickEvent);
        panel.querySelector('.save-local-button').addEventListener('click', handleSaveLocalButtonClickEvent);
        panel.querySelector('.toggle-button').addEventListener('click', handleToggleButtonClickEvent);
    }

    /**
     * @description Initializes the operation panel and data display.
     * @returns {void}
     */
    function initializePanel() {
        addStyles();
        createPanel();
        updateDataDisplay(allSeriesData);
        setPanelStateFromLocalStorage();
    }

    /**
     * @description setPanelStatusFromLocalStorage.
     * @returns {void}
     */
    function setPanelStateFromLocalStorage() {
        let operationSeries = document.getElementById('operation_series');
        const isExpanded = localStorage.getItem('operationSeriesExpanded') === 'true';

        if (isExpanded) {
            operationSeries.classList.remove('collapsed');
        } else {
            operationSeries.classList.add('collapsed');
        }
    }

    /**
     * @description Retrieves series node data from the DOM.
     * @returns {Array|null} An array of series node data or null if not found.
     */
    function getSeriesNodeData() {
        return objectElementNodesPool.series ? Array.from(objectElementNodesPool.series.querySelectorAll('.box strong')) : null;
    }

    /**
     * @description Removes duplicate items from an array.
     * @param {Array} dataArray - The array to remove duplicates from.
     * @returns {Array} The array with duplicates removed.
     */
    function removeDuplicates(dataArray) {
        const seen = new Set();
        return dataArray.filter(item => {
            if (seen.has(item.content)) {
                return false;
            } else {
                seen.add(item.content);
                return true;
            }
        });
    }

    /**
     * @description Updates the data display in the operation panel.
     * @param {Array} dataArray - The array of data to display.
     * @returns {void}
     */
    function updateDataDisplay(dataArray) {
        let responseBox = document.querySelector('#operation_series .dataResponseBox');
        responseBox.innerHTML = '';
        let p = document.createElement('p');
        p.className = 'dataResponse';
        p.innerHTML = `累计获取到的数据数量：<span style="color: #f14668;">${dataArray.length}</span>`;
        responseBox.appendChild(p);
    }

    /**
     * @description Handles the click event for the "获取系列数据" button.
     * @returns {void}
     */
    function handlePanelButtonClickEvent() {
        const seriesNodeData = getSeriesNodeData();
        if (seriesNodeData) {
            let seriesDataArray = Array.from(seriesNodeData).map(node => ({ content: node.textContent }));
            allSeriesData = allSeriesData.concat(seriesDataArray);
            let uniqueSeriesDataArray = removeDuplicates(allSeriesData);
            updateDataDisplay(uniqueSeriesDataArray);

            GM_setValue('seriesData', JSON.stringify(uniqueSeriesDataArray));
        }
    }

    /**
     * @description Handles the click event for the "保存到本地" button.
     * @returns {void}
     */
    function handleSaveLocalButtonClickEvent() {
        let uniqueSeriesDataArray = removeDuplicates(allSeriesData);
        let seriesDataJson = JSON.stringify({ series: uniqueSeriesDataArray }, null, 2);
        // localStorage.setItem('seriesData', seriesDataJson);

        let blob = new Blob([seriesDataJson], { type: 'application/json' });
        let url = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = url;
        a.download = 'seriesData.json';
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

    /**
     * @description Handles the click event for the "展开/收起" button.
     * @returns {void}
     */
    function handleToggleButtonClickEvent() {
        let operationSeries = document.getElementById('operation_series');
        operationSeries.classList.toggle('collapsed');
        let isCollapsed = operationSeries.classList.contains('collapsed');
        localStorage.setItem('operationSeriesExpanded', !isCollapsed);
    }
    initializePanel();

})();
