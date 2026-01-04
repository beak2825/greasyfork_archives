// ==UserScript==
// @name               Jira-SAP
// @name:zh-CN         Jira-SAP
// @description        Jira. Only for SAP internal using.
// @description:zh-CN  Jira。仅供SAP内部使用。
// @namespace          https://github.com/HaleShaw
// @version            1.0.2
// @author             HaleShaw
// @copyright          2021+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-Jira
// @supportURL         https://github.com/HaleShaw/TM-Jira/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               data:image/svg+xml;base64,PHN2ZyBpZD0iTG9nb3MiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzI2ODRmZjt9LmNscy0ye2ZpbGw6dXJsKCNsaW5lYXItZ3JhZGllbnQpO30uY2xzLTN7ZmlsbDp1cmwoI2xpbmVhci1ncmFkaWVudC0yKTt9PC9zdHlsZT48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCIgeDE9IjM4LjExIiB5MT0iMTguNTQiIHgyPSIyMy4xNyIgeTI9IjMzLjQ4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwLjE4IiBzdG9wLWNvbG9yPSIjMDA1MmNjIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjY4NGZmIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudC0yIiB4MT0iNDIuMDciIHkxPSI2MS40NyIgeDI9IjU2Ljk4IiB5Mj0iNDYuNTUiIHhsaW5rOmhyZWY9IiNsaW5lYXItZ3JhZGllbnQiLz48L2RlZnM+PHRpdGxlPmppcmEgc29mdHdhcmUtaWNvbi1ncmFkaWVudC1ibHVlPC90aXRsZT48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03NC4xOCwzOCw0Myw2LjlsLTMtM2gwTDE2LjU4LDI3LjMyaDBMNS44NiwzOGEyLjg2LDIuODYsMCwwLDAsMCw0LjA1TDI3LjI4LDYzLjUxLDQwLDc2LjI1LDYzLjQ3LDUyLjgxbC4zNi0uMzZMNzQuMTgsNDIuMDlBMi44NiwyLjg2LDAsMCwwLDc0LjE4LDM4Wk00MCw1MC43N2wtMTAuNy0xMC43TDQwLDI5LjM3bDEwLjcsMTAuN1oiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik00MCwyOS4zN0ExOCwxOCwwLDAsMSw0MCw0TDE2LjU0LDI3LjM3LDI5LjI4LDQwLjExLDQwLDI5LjM3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTUwLjc1LDQwLDQwLDUwLjc3YTE4LDE4LDAsMCwxLDAsMjUuNDhoMEw2My41LDUyLjc4WiIvPjwvc3ZnPg==
// @match              https://sapjira.wdf.sap.corp/*
// @compatible	       Chrome
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419736/Jira-SAP.user.js
// @updateURL https://update.greasyfork.org/scripts/419736/Jira-SAP.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==
(function () {
    ('use strict');

    const mainStyle = `
        .filterButton {
            text-decoration: none;
            border: 1px solid transparent;
            -webkit-border-radius: 3px 3px 3px 3px;
            border-radius: 3px 3px 3px 3px;
            display: inline-block;
            line-height: 1;
            margin: 0 5px 0 0;
            padding: 7px 10px;
            color: #0052cc;
            cursor: pointer;
        }

        .filterActive {
            background: #344563;
            border-color: transparent;
            color: #fff;
        }

        #cai-webchat-div {
            display: none !important;
        }

        .aui-sidebar-body>header.aui-page-header,
        #announcement-banner,
        #system-help-menu,
        .aui-sidebar-group.aui-sidebar-group-actions.collapsed-scope-filter-container {
            display: none !important;
        }
    `;

    const data = [
        {
            id: 121136,
            name: 'ZongKe',
            fullName: 'Ren Zongke'
        },
        {
            id: 84993,
            name: 'Pu Qiao',
            fullName: 'Pu Qiao'
        },
        {
            id: 91018,
            name: 'Wan Peng',
            fullName: 'Wan Peng'
        },
        {
            id: 115808,
            name: 'Karlie',
            fullName: 'Xie Karlie'
        },
        {
            id: 121139,
            name: 'Zhao Hu',
            fullName: 'Zhao Hu'
        },
        {
            id: 121135,
            name: 'Hale',
            fullName: 'Xiao Hongliang'
        },
        {
            id: 121138,
            name: 'LuMing',
            fullName: 'Zhao Luming'
        },
        {
            id: 121137,
            name: 'Xu Zhen',
            fullName: 'Xu Zhen'
        },
        {
            id: 121134,
            name: 'Shi Lei',
            fullName: 'Shi,lei'
        },
        {
            id: 84994,
            name: 'JinFeng',
            fullName: 'JinFeng'
        },
        {
            id: 85130,
            name: 'ChaoFeng',
            fullName: 'ChaoFeng'
        },
        {
            id: 84988,
            name: 'Roger',
            fullName: 'Roger'
        },
        {
            id: 91908,
            name: 'Bug',
            fullName: 'Bug in progress'
        }
    ];

    const paramName = 'quickFilter';

    main();

    function main() {
        GM_addStyle(mainStyle);
        setInterval(updateTitleTime, 5000);
        updateFilter();
        hideMenu();
    }

    function updateTitleTime() {
        updateTitle();
        updateTime();
    }

    /** Update Title ***********************************************************/
    function updateTitle() {
        const issueId = getIssueId();
        if ('' != issueId) {
            let assignee = getAssignee();
            let title = '' != assignee ? issueId + ' - ' + assignee : issueId;
            document.title = title;
            return;
        }

        for (let i = 0; i < data.length; i++) {
            let str = 'quickFilter=' + data[i].id;
            if (location.href.indexOf(str) != -1) {
                document.title = data[i].name;
                break;
            }
        }
    }

    function updateTime() {
        const dateId = 'log-work-date-logged-date-picker';
        if (document.getElementById(dateId)) {
            let dateTime = document.getElementById(dateId);
            let value = dateTime.value;
            if (value.endsWith('PM')) {
                dateTime.value = value.split(' ')[0] + ' 9:30 AM';
            }
        }
    }

    /** Update Fileter ***********************************************************/
    function updateFilter() {
        let count = 0;
        let flag = false;
        let timerId = setInterval(() => {
            addDD(flag);
            count++;
            if (count > 40 || flag) {
                clearInterval(timerId);
            }
        }, 500);
    }

    function addDD(flag) {
        const workId = 'js-work-quickfilters';
        const planId = 'js-plan-quickfilters';
        if (document.getElementById(workId) || document.getElementById(planId)) {
            let filterFather = document.getElementById(workId)
                ? document.getElementById(workId)
                : document.getElementById(planId);
            const id = getUrlParam(paramName);
            filterFather.innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                let key = data[i].id;
                let ddEle = document.createElement('dd');
                ddEle.setAttribute('data', key);
                ddEle.setAttribute('class', 'filterButton');
                ddEle.textContent = data[i].name;

                if (key == id) {
                    ddEle.className += ' filterActive';
                }

                ddEle.onclick = doFilter(key);
                filterFather.append(ddEle);
            }
            flag = true;
        }
    }

    function doFilter(id) {
        return function () {
            let url = location.href;
            if (url.indexOf(paramName) != -1) {
                const userId = getUrlParam(paramName);
                url = removeUrlParam(paramName);
                if (userId == id) {
                    location.href = url;
                    return;
                }
            }
            location.href = url + '&quickFilter=' + id;
        };
    }

    /**
     * remove the param from url.
     * @param name param name.
     */
    function removeUrlParam(name) {
        var loca = window.location;
        var baseUrl = loca.origin + loca.pathname + '?';
        var query = loca.search.substr(1);
        if (query.indexOf(name) > -1) {
            var obj = {};
            var arr = query.split('&');
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split('=');
                obj[arr[i][0]] = arr[i][1];
            }
            delete obj[name];
            var url =
                baseUrl +
                JSON.stringify(obj)
                    .replace(/[\"\{\}]/g, '')
                    .replace(/\:/g, '=')
                    .replace(/\,/g, '&');
            return url;
        }
    }

    /*
     * Get the param from url.
     * @param name param name.
     */
    function getUrlParam(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    function getIssueId() {
        const reg = new RegExp('(^https://sapjira.wdf.sap.corp/browse/SELFBILLING-)[0-9]*$');
        const url = window.location.href;
        const matches = url.match(reg);
        let id = '';
        if (matches != null) {
            id = matches[0].substr(48);
        }
        return id;
    }

    function getAssignee() {
        let assignee = '';
        document.getElementById('assignee-val').children[0].innerText.trim();
        if (document.getElementById('assignee-val')) {
            const assigneeEle = document.getElementById('assignee-val');
            const text = assigneeEle.children[0].innerText.trim();
            assignee = text.split('(')[0].trim().replaceAll(',', '');

            // Simplify the assignee name.
            for (let i = 0; i < data.length; i++) {
                if (assignee.indexOf(data[i].fullName) != -1) {
                    assignee = data[i].name;
                    break;
                }
            }
        }
        return assignee;
    }

    /** Hide Menu ***********************************************************/
    function hideMenu() {
        const menus = [
            'Releases',
            'Issues',
            'Reports',
            'Components',
            'Xray Reports',
            'Xray Test Repository',
            'Xray Test Plan Board',
            'Automated Steps Library'
        ];
        const menuClassName = 'aui-sidebar-group aui-sidebar-group-tier-one';
        document.getElementsByClassName(menuClassName)[0].children[0].children;
        if (
            document.getElementsByClassName(menuClassName) &&
            document.getElementsByClassName(menuClassName)[0]
        ) {
            if (document.getElementsByClassName(menuClassName)[0].children[0]) {
                let ulEle = document.getElementsByClassName(menuClassName)[0].children[0];
                let liEles = ulEle.children;
                if (liEles) {
                    for (let i = 0; i < liEles.length; i++) {
                        const aEle = liEles[i].children[0];
                        const spans = aEle.children;
                        if (
                            (spans.length == 2 && menus.indexOf(spans[1].textContent) != -1) ||
                            (spans.length == 1 && 'aui-nav-subtree-toggle' == aEle.className)
                        ) {
                            liEles[i].style.display = 'none';
                        }
                    }
                }
            }
        }

        // Hide Bug Analysis Report.
        const spanEles = document.querySelectorAll('span.aui-nav-item-label');
        for (let i = 0; i < spanEles.length; i++) {
            if ('Bug Analysis Report' == spanEles[i].textContent) {
                spanEles[i].parentElement.parentElement.parentElement.parentElement.style.display =
                    'none';
                break;
            }
        }
    }
})();
