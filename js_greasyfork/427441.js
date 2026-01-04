// ==UserScript==
// @name            AcFun 屏蔽弹幕发送人
// @name            acfun-block-danmaku-sender
// @namespace       https://github.com/NiaoBlush/acfun-block-danmaku-sender
// @version         1.1
// @description     acfun 在视频窗口屏蔽弹幕发送人
// @author          NiaoBlush
// @license         MIT
// @namespace       https://github.com/NiaoBlush/acfun-block-danmaku-sender
// @supportURL      https://github.com/NiaoBlush/acfun-block-danmaku-sender
// @grant           none
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @include         https://www.acfun.cn/*
// @downloadURL https://update.greasyfork.org/scripts/427441/AcFun%20%E5%B1%8F%E8%94%BD%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/427441/AcFun%20%E5%B1%8F%E8%94%BD%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E4%BA%BA.meta.js
// ==/UserScript==


(function () {
    "use strict";
    var $ = window.$;
    addBtn();
    addStyle();

    function addBtn() {

        const containerPluginsInner = $(".container-plugins-inner");
        containerPluginsInner.bind("DOMNodeInserted", function (e) {
            const contextMenu = $(e.target);
            if (contextMenu.hasClass("context-menu")) {
                // console.log("contextMenu created");
                containerPluginsInner.unbind("DOMNodeInserted");
                contextMenu.bind("DOMNodeInserted", onMenuCreated);
            }
        });
    }

    function onMenuCreated(e) {
        const menu = $(e.target);
        const user = menu.data("user");
        const message = menu.data("message");
        const blockUserBtn = $("<span class='btn-tm-block-user'>用户</span>");
        blockUserBtn.css("width", "78px");
        menu.children(".danmaku-operate").append(blockUserBtn);
        blockUserBtn.click(function () {
            // console.log(user, message);

            $(".options-control-select>div[data-value='user']").trigger("click");
            $(".filter-input-wrap>input.filter-input").val(user);
            $(".btn-danmaku-filter-add").trigger("click");
            $(".filter-input-wrap>input.filter-input").val("");
        });

    }

    function addStyle() {
        const value = "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUzICg3MjUyMCkgLSBodHRwczovL3NrZXRjaGFwcC5jb20gLS0+CiAgICA8dGl0bGU+aWNvbl9waW5nYml5b25naHU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iaWNvbl9waW5nYml5b25naHUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnPgogICAgICAgICAgICA8ZyBpZD0i5YiX6KGoaWNvbi3moIXmoLwtIiBvcGFjaXR5PSIwIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLliJfooahpY29uLeagheagvC1jb3B5LTMiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cC01Ij4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IummlumhtXRhYi3moIXmoLwiIHN0cm9rZS13aWR0aD0iMC41Ij4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLlm77moIfmoIXmoLzvvI0yNDBweCI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue6vyIgb3BhY2l0eT0iMC40MDEyMyIgc3Ryb2tlPSIjNEE0QTRBIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTksMCBMOSwxOCIgaWQ9IkxpbmUiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYsMCBMNiwxOCIgaWQ9IkxpbmUiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEuMjI3MjcyNzMsMCBMMS4yMjcyNzI3MywxOCIgaWQ9IkxpbmUiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLDAgTDEyLDE4IiBpZD0iTGluZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTYuNzcyNzI3MywwIEwxNi43NzI3MjczLDE4IiBpZD0iTGluZSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTcuOTI1LDEyIEwtNC4yNjMyNTY0MWUtMTUsMTIiIGlkPSJMaW5lIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4Ljk2MjUwMCwgMTIuMDAwMDAwKSBzY2FsZSgtMSwgLTEpIHRyYW5zbGF0ZSgtOC45NjI1MDAsIC0xMi4wMDAwMDApICI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTcuOTI1LDE2Ljc3MjcyNzMgTC02LjM5NDg4NDYyZS0xNCwxNi43NzI3MjczIiBpZD0iTGluZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC45NjI1MDAsIDE2Ljc3MjcyNykgc2NhbGUoLTEsIC0xKSB0cmFuc2xhdGUoLTguOTYyNTAwLCAtMTYuNzcyNzI3KSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE3LjkyNSw5IEwtNC4yNjMyNTY0MWUtMTUsOSIgaWQ9IkxpbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDguOTYyNTAwLCA5LjAwMDAwMCkgc2NhbGUoLTEsIC0xKSB0cmFuc2xhdGUoLTguOTYyNTAwLCAtOS4wMDAwMDApICI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTcuOTI1LDYgTC00LjI2MzI1NjQxZS0xNSw2IiBpZD0iTGluZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOC45NjI1MDAsIDYuMDAwMDAwKSBzY2FsZSgtMSwgLTEpIHRyYW5zbGF0ZSgtOC45NjI1MDAsIC02LjAwMDAwMCkgIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNy45MjUsMS4yMjcyNzI3MyBMLTIuODQyMTcwOTRlLTE0LDEuMjI3MjcyNzMiIGlkPSJMaW5lIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4Ljk2MjUwMCwgMS4yMjcyNzMpIHNjYWxlKC0xLCAtMSkgdHJhbnNsYXRlKC04Ljk2MjUwMCwgLTEuMjI3MjczKSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTAsMCBMMTgsMTgiIGlkPSJMaW5lIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDAgTDE4LDE4IiBpZD0iTGluZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4wMDAwMDAsIDkuMDAwMDAwKSBzY2FsZSgtMSwgMSkgdHJhbnNsYXRlKC05LjAwMDAwMCwgLTkuMDAwMDAwKSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IuagheagvCIgb3BhY2l0eT0iMC45NzYyMTM3MjgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMDkwOTA5LCAxLjA5MDkwOSkiIHN0cm9rZT0iIzlCOUI5QiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Iuato+WchiIgY3g9IjcuOTA5MDkwOTEiIGN5PSI3LjkwOTA5MDkxIiByPSI3LjUyMjcyNzI3Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9Iuato+aWueW9oiIgeD0iMS4yMDQ1NDU0NSIgeT0iMS4yMDQ1NDU0NSIgd2lkdGg9IjEzLjQwOTA5MDkiIGhlaWdodD0iMTMuNDA5MDkwOSIgcng9IjAuNTQ1NDU0NTQ1Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnq5bnn6nlvaIiIHg9IjIuMDIyNzI3MjciIHk9IjAuMzg2MzYzNjM2IiB3aWR0aD0iMTEuNzcyNzI3MyIgaGVpZ2h0PSIxNS4wNDU0NTQ1IiByeD0iMC41NDU0NTQ1NDUiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIuMDIyNzI3MjcsMC42ODk2MzQ1OTQgTDIuMDIyNzI3MjcsMTUuMTI4NTQ3MiBDMi4wMjI3MjcyNywxNS4yOTkxMjQ1IDIuMTUzNTc2NjQsMTUuNDMxODE4MiAyLjMxNTkwNjYsMTUuNDMxODE4MiBMMTMuNTAyMjc1MiwxNS40MzE4MTgyIEMxMy42NjIwMTA0LDE1LjQzMTgxODIgMTMuNzk1NDU0NSwxNS4yOTYyMzMyIDEzLjc5NTQ1NDUsMTUuMTI4NTQ3MiBMMTMuNzk1NDU0NSwwLjY4OTYzNDU5NCBDMTMuNzk1NDU0NSwwLjUxOTA1NzMzMyAxMy42NjQ2MDUyLDAuMzg2MzYzNjM2IDEzLjUwMjI3NTIsMC4zODYzNjM2MzYgTDIuMzE1OTA2NiwwLjM4NjM2MzYzNiBDMi4xNTYxNzE0NCwwLjM4NjM2MzYzNiAyLjAyMjcyNzI3LDAuNTIxOTQ4NjI1IDIuMDIyNzI3MjcsMC42ODk2MzQ1OTQgWiIgaWQ9IuaoquefqeW9oiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy45MDkwOTEsIDcuOTA5MDkxKSBzY2FsZSgtMSwgLTEpIHJvdGF0ZSg5MC4wMDAwMDApIHRyYW5zbGF0ZSgtNy45MDkwOTEsIC03LjkwOTA5MSkgIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuS4reW/g+WchiIgY3g9IjcuOTA5MDkwOTEiIGN5PSI3LjkwOTA5MDkxIiByPSIzLjQzMTgxODE4Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgZmlsbD0iI0ZENEM1QyIgb3BhY2l0eT0iMC4xIiB4PSIxLjIyNzI3MjczIiB5PSIxLjIyNzI3MjczIiB3aWR0aD0iMTUuNTQ1NDU0NSIgaGVpZ2h0PSIxNS41NDU0NTQ1Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDxnIGlkPSLliIbnu4QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuNjg3NTAwLCAxLjEzNjcwOSkiPgogICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2iIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMS40IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGN4PSI3LjMxMjUiIGN5PSI3Ljg2MzI5MTQiIHI9IjcuMzEyNSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3LjM3NTk0MSwgNy45MjY3MzIpIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtNy4zNzU5NDEsIC03LjkyNjczMikgIiB4PSI2LjY3NTk0MDY1IiB5PSIwLjA1MTczMjA1MzYiIHdpZHRoPSIxLjQiIGhlaWdodD0iMTUuNzUiPjwvcmVjdD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+) no-repeat;";
        const style = $(`
            <style class="add-by-script">
            .btn-tm-block-user::before {
                background: ${value}
                display: inline-block;
                content: '';
                width: 18px;
                height: 18px;
                vertical-align: text-bottom;
                position: absolute;
                top: 50%;
                left: 15px;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
            }
            </style>
            `);
        $("head").append(style);

    }

})();

