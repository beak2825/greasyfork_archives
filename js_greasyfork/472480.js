// ==UserScript==
// @name         GitHub Issue 左侧悬浮列表添加编号
// @namespace    http://your.namespace.com
// @version      1.0
// @description  将 GitHub 的 issue 列表页面转换为一个悬浮在网页左侧，点击标题后在右侧打开具体页面，并为左侧列表中的每一项添加编号并高亮显示
// @match        https://github.com/*/issues*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472480/GitHub%20Issue%20%E5%B7%A6%E4%BE%A7%E6%82%AC%E6%B5%AE%E5%88%97%E8%A1%A8%E6%B7%BB%E5%8A%A0%E7%BC%96%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/472480/GitHub%20Issue%20%E5%B7%A6%E4%BE%A7%E6%82%AC%E6%B5%AE%E5%88%97%E8%A1%A8%E6%B7%BB%E5%8A%A0%E7%BC%96%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sidebar = document.createElement('div');
    sidebar.id = 'issue-sidebar';
    document.body.appendChild(sidebar);

    var currentPage = 1;
    var totalIssues = 0;

    var loadButton = document.createElement('button');
    loadButton.textContent = '加载更多';
    loadButton.className = 'load-more-button';
    sidebar.appendChild(loadButton);

    loadButton.addEventListener('click', function() {
        loadIssues();
    });

    loadIssues();

    function loadIssues() {
        loadButton.disabled = true;
        loadButton.textContent = '加载中...';

        var url = `https://github.com${window.location.pathname}?page=${currentPage}&q=is%3Aissue`;
        fetch(url)
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                var issueLinks = doc.querySelectorAll('.js-navigation-open');

                issueLinks.forEach(function(link) {
                    var title = link.innerText;
                    var url = link.href;
                    var issueNumber = ++totalIssues;

                    var listItem = document.createElement('div');
                    listItem.className = 'issue-list-item';
                    listItem.innerHTML = `<span class="issue-number">${issueNumber}</span> ${title}`;

                    listItem.addEventListener('click', function(event) {
                        event.preventDefault();
                        openIssueInRightPane(url);
                    });

                    sidebar.insertBefore(listItem, loadButton);
                });

                currentPage++;
                loadButton.disabled = false;
                loadButton.textContent = '加载更多';
            })
            .catch(function(error) {
                console.error('Failed to load issues:', error);
                loadButton.disabled = false;
                loadButton.textContent = '加载更多';
            });
    }

    GM_addStyle(`
        #issue-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 200px;
            background-color: #f5f5f5;
            overflow-y: scroll;
            padding: 10px;
            z-index: 9999;
        }

        .issue-list-item {
            cursor: pointer;
            margin-bottom: 10px;
        }

        .issue-number {
            display: inline-block;
            padding: 2px 6px;
            background-color: #0366d6;
            color: #fff;
            font-weight: bold;
            margin-right: 5px;
            border-radius: 4px;
        }

        .load-more-button {
            margin-top: 10px;
        }

        #issue-right-pane {
            position: fixed;
            top: 0;
            left: 220px;
            right: 0;
            bottom: 0;
            padding: 10px;
            background-color: #fff;
            z-index: 9998;
            overflow-y: scroll;
            border-left: 1px solid #e1e4e8;
        }
    `);

    function openIssueInRightPane(url) {
        var rightPane = document.getElementById('issue-right-pane');
        if (!rightPane) {
            rightPane = document.createElement('div');
            rightPane.id = 'issue-right-pane';
            document.body.appendChild(rightPane);
        } else {
            rightPane.innerHTML = '';
        }

        fetch(url)
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                rightPane.innerHTML = html;
            })
            .catch(function(error) {
                console.error('Failed to load issue:', error);
            });
    }
})();
