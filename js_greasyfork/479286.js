// ==UserScript==
// @name         在线表格增强功能
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  在线表格增强插件
// @author       pianpianluoye
// @include      *://*suip.*.com/sctj*
// @include      *://*intuat.*.com/ibss*
// @include      *://*int.*.com/ibss*
// @include      *://10.249.160.144/sctj*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sinopec.com
// @grant        none
// @run-at       document-end
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/479286/%E5%9C%A8%E7%BA%BF%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/479286/%E5%9C%A8%E7%BA%BF%E8%A1%A8%E6%A0%BC%E5%A2%9E%E5%BC%BA%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const lockColor = "#f0f3fb"
    const unlockColor = "#fff"
    const container = "gc-container"
    const containerCls = "js-spread-container"
    const containerDesign = "gc-designer-container"
    const containerDesignCls = "designer-container"
    let isDesigner = false
    let oldColor = []


    const cssText = `        
      /* 按钮样式 */
        .tm-btn {
            display: inline-block;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 400;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            cursor: pointer;
            user-select: none;
            background-color: #1890ff;
            border: 1px solid #1890ff;
            color: #fff;
            border-radius: 4px;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .tm-btn:hover {
            background-color: #40a9ff;
            border-color: #40a9ff;
        }

        /* 模态框样式 */
        .tm-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 960px;
        }

        .tm-modal-content {
            background-color: #fff;
            padding: 12px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
            position: relative;
        }

        .tm-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            cursor: move;
        }

        .tm-modal-title {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
        }

        .tm-modal-close {
            font-size: 20px;
            font-weight: 700;
            line-height: 1;
            color: #000;
            text-shadow: 0 1px 0 #fff;
            opacity: 0.5;
            cursor: pointer;
            transition: all 0.3s;
        }

        .tm-modal-close:hover {
            opacity: 0.8;
        }

        /* 表格样式 */
        .tm-table-container {
            max-height: 300px;
            overflow-y: auto;
            position: relative;
        }

        .tm-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
        }

        .tm-table thead {
            position: sticky;
            top: 0;
            background-color: #fafafa;
            z-index: 1;
        }

        .tm-table th,
        .tm-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #e8e8e8;
            text-align: left;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.85);
            white-space: nowrap;
            position: relative;
        }

        .tm-table th {
            font-weight: 500;
        }

        /* 鼠标经过行的效果 */
        .tm-table tbody tr:hover {
            background-color: #e6f7ff;
        }

        /* 选中行的效果 */
        .tm-table tbody tr.selected {
            background-color: #bae7ff;
        }

        /* 模态框底部按钮样式 */
        .tm-modal-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }

        .tm-modal-footer .tm-btn {
            margin-left: 8px;
        }

        .tm-btn-secondary {
            background-color: #fff;
            border-color: #d9d9d9;
            color: rgba(0, 0, 0, 0.85);
        }

        .tm-btn-secondary:hover {
            background-color: #fff;
            border-color: #40a9ff;
            color: #40a9ff;
        }

        /* 复制图标样式 */
        .tm-copy-icon {
            display: none;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }

        .tm-table td:hover .tm-copy-icon {
            display: inline-block;
        }
        /* 公式单元格样式，超出宽度显示省略号 */
        .tm-formula-cell {
            max-width: 150px; /* 可根据需要调整最大宽度 */
            overflow: hidden;
            text-overflow: ellipsis;
        }
        /* 列宽拖动条样式 */
        .tm-resize-handle {
            position: absolute;
            top: 0;
            right: 0;
            width: 5px;
            height: 100%;
            cursor: col-resize;
        }
      `
    const msg = `
            <div class="ant-message-notice">
            <div class="ant-message-notice-content">
                <div class="ant-message-custom-content ant-message-success">
                    <i aria-label="icon: check-circle" class="anticon anticon-check-circle">
                        <svg viewBox="64 64 896 896" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
                            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                        </svg>
                    </i>
                    <span>右键菜单开启</span>
                </div>
            </div>
        </div>
    `
    const myStyle = document.createElement("style");
    myStyle.textContent = cssText;
    document.head.appendChild(myStyle)

    let addCount = 1

    const enumTypes = {
        0:"任何值",
        1:"整数",
        2:"小数",
        3:"序列",
        4:"日期",
        5:"时间",
        6:"文本长度",
        7:"自定义"
    }

    const enumOperators = {
        0:"等于",
        1:"不等于",
        2:"大于",
        3:"大于等于",
        4:"小于",
        5:"小于等于",
        6:"介于",
        7:"未介于"
    }

    const enumErrorStyle = {
        0:"停止",
        1:"警告",
        2:"信息"
    }

    const enumHighlightType = {
        0:"圆圈",
        1:"折角",
        2:"图标"
    }

    const enumTrueFalse = {
        true:"是",
        false:"否"
    }

    const btnplugin = document.createElement("span");
    btnplugin.classList.add("ant-dropdown-trigger");
    btnplugin.classList.add("action");
    btnplugin.innerHTML = `
        <i class="anticon">
        <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
            <use xlink:href="#iconsetting"></use>
        </svg>
        </i>`;

    const originalMount = Vue.prototype.$mount;
    Vue.prototype.$mount = function() {
        const result = originalMount.apply(this, arguments);
        handleVueInstance(this);
        return result;
    };

    function handleVueInstance(vm) {
        vm.$watch('spreadViewer', (newVal) => {
            if(!isDesigner){
                window.GlobalSpViewer = newVal
                setTimeout(() => {
                    addCustomMenu(newVal.spread)
                }, 1000)
            }
        });
        vm.$watch('spread', (newVal) => {
            if(!isDesigner){
                window.GlobalSp = newVal
        //        addCustomMenu(newVal.spread)
       //         spreadGlobalConfig()
         //       bindNewRowUnlockCell()
            }
        });
        vm.$watch('instance', (newVal) => {
            window.GlobalWps = newVal
            addWpsCustomButton()
        });
        vm.$watch('record', (newVal) => {
            window.GlobalReportForm = newVal
        });
    }

    /* begin：WPS */
    async function addWpsCustomButton() {
        await GlobalWps.ready();
        const app = GlobalWps.Application;
        const controls = await app.CommandBars('ToolsTab').Controls;
        const controlButton = await controls.Add(10);
        controlButton.Caption = '辅助功能';
        controlButton.Picture = 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzQzNjcyODk2MzMyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM4NDQ4IiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTkxMy40MDggMTIyLjg4IDEwOC41NDQgMTIyLjg4bDAgMEM5MC4xMTIgMTIyLjg4IDczLjcyOCAxMzcuMjE2IDczLjcyOCAxNTUuNjQ4TDczLjcyOCA4NjAuMTZsMCAwYzAgMTguNDMyIDE0LjMzNiAzNC44MTYgMzQuODE2IDM0LjgxNmw4MDQuODY0IDAgMCAwYzE4LjQzMiAwIDMyLjc2OC0xNC4zMzYgMzIuNzY4LTM0LjgxNkw5NDYuMTc2IDE1Ny42OTZsMCAwQzk0Ni4xNzYgMTM3LjIxNiA5MzEuODQgMTIyLjg4IDkxMy40MDggMTIyLjg4ek04ODAuNjQgODI3LjM5MiAxNDEuMzEyIDgyNy4zOTIgMTQxLjMxMiAzNjguNjQgODgwLjY0IDM2OC42NCA4ODAuNjQgODI3LjM5MnpNODgwLjY0IDMyOS43MjggMTQxLjMxMiAzMjkuNzI4IDE0MS4zMTIgMTkwLjQ2NCA4ODAuNjQgMTkwLjQ2NCA4ODAuNjQgMzI5LjcyOHoiIHAtaWQ9IjM4NDQ5Ij48L3BhdGg+PHBhdGggZD0iTTMwNS4xNTIgNTQ2LjgxNiAzMDUuMTUyIDU0Ni44MTZjOC4xOTIgNC4wOTYgMTAuMjQgMTQuMzM2IDYuMTQ0IDIyLjUyOC00LjA5NiA4LjE5Mi0xNC4zMzYgMTAuMjQtMjIuNTI4IDYuMTQ0bC0xMTguNzg0LTY3LjU4NEMxNjMuODQgNTAzLjgwOCAxNTkuNzQ0IDQ5My41NjggMTYzLjg0IDQ4NS4zNzZjMi4wNDgtMi4wNDggNC4wOTYtNC4wOTYgNi4xNDQtNi4xNDRsMTE4Ljc4NC02NS41MzZjOC4xOTItNC4wOTYgMTguNDMyLTIuMDQ4IDIyLjUyOCA2LjE0NCA0LjA5NiA4LjE5MiAyLjA0OCAxOC40MzItNi4xNDQgMjIuNTI4bC05NC4yMDggNTMuMjQ4TDMwNS4xNTIgNTQ2LjgxNiAzMDUuMTUyIDU0Ni44MTZ6IiBwLWlkPSIzODQ1MCI+PC9wYXRoPjxwYXRoIGQ9Ik00MzYuMjI0IDM4OS4xMiA0MzYuMjI0IDM4OS4xMmM0LjA5Ni04LjE5MiAxNC4zMzYtMTIuMjg4IDIyLjUyOC04LjE5MiA4LjE5MiA0LjA5NiAxMi4yODggMTQuMzM2IDguMTkyIDIyLjUyOGwtOTIuMTYgMTk0LjU2Yy00LjA5NiA4LjE5Mi0xNC4zMzYgMTIuMjg4LTIyLjUyOCA4LjE5Mi04LjE5Mi00LjA5Ni0xMi4yODgtMTQuMzM2LTguMTkyLTIyLjUyOEw0MzYuMjI0IDM4OS4xMiA0MzYuMjI0IDM4OS4xMnoiIHAtaWQ9IjM4NDUxIj48L3BhdGg+PHBhdGggZD0iTTgyNy4zOTIgMjI1LjI4IDgyNy4zOTIgMjI1LjI4YzE4LjQzMiAwIDMyLjc2OCAxNC4zMzYgMzIuNzY4IDMyLjc2OCAwIDE4LjQzMi0xNC4zMzYgMzIuNzY4LTMyLjc2OCAzMi43NjgtMTguNDMyIDAtMzIuNzY4LTE0LjMzNi0zMi43NjgtMzIuNzY4Qzc5NC42MjQgMjQxLjY2NCA4MDguOTYgMjI1LjI4IDgyNy4zOTIgMjI1LjI4TDgyNy4zOTIgMjI1LjI4eiIgcC1pZD0iMzg0NTIiPjwvcGF0aD48cGF0aCBkPSJNNzQ1LjQ3MiAyMjUuMjggNzQ1LjQ3MiAyMjUuMjhjMTguNDMyIDAgMzIuNzY4IDE0LjMzNiAzMi43NjggMzIuNzY4IDAgMTguNDMyLTE0LjMzNiAzMi43NjgtMzIuNzY4IDMyLjc2OC0xOC40MzIgMC0zMi43NjgtMTQuMzM2LTMyLjc2OC0zMi43NjhDNzEwLjY1NiAyNDEuNjY0IDcyNy4wNCAyMjUuMjggNzQ1LjQ3MiAyMjUuMjhMNzQ1LjQ3MiAyMjUuMjh6IiBwLWlkPSIzODQ1MyI+PC9wYXRoPjxwYXRoIGQ9Ik02NjMuNTUyIDIyNS4yOCA2NjMuNTUyIDIyNS4yOGMxOC40MzIgMCAzMi43NjggMTQuMzM2IDMyLjc2OCAzMi43NjggMCAxOC40MzItMTQuMzM2IDMyLjc2OC0zMi43NjggMzIuNzY4LTE4LjQzMiAwLTMyLjc2OC0xNC4zMzYtMzIuNzY4LTMyLjc2OEM2MjguNzM2IDI0MS42NjQgNjQ1LjEyIDIyNS4yOCA2NjMuNTUyIDIyNS4yOEw2NjMuNTUyIDIyNS4yOHoiIHAtaWQ9IjM4NDU0Ij48L3BhdGg+PHBhdGggZD0iTTc3MC4wNDggODM3LjYzMmMwLTguMTkyIDYuMTQ0LTE0LjMzNiAxNC4zMzYtMTQuMzM2IDguMTkyIDAgMTQuMzM2IDYuMTQ0IDE0LjMzNiAxNC4zMzZsMCAzNi44NjRjMCA4LjE5Mi02LjE0NCAxNC4zMzYtMTQuMzM2IDE0LjMzNmwtMi4wNDggMC02MS40NCAwYy04LjE5MiAwLTE0LjMzNi02LjE0NC0xNC4zMzYtMTQuMzM2bDAgMCAwLTI0LjU3NmMtNC4wOTYtMi4wNDgtOC4xOTItMi4wNDgtMTIuMjg4LTQuMDk2bDAgMCAwIDBjLTQuMDk2LTIuMDQ4LTguMTkyLTQuMDk2LTEyLjI4OC02LjE0NGwtMTguNDMyIDE4LjQzMmMtNi4xNDQgNi4xNDQtMTQuMzM2IDYuMTQ0LTIwLjQ4IDBsMCAwIDAgMC00NS4wNTYtNDUuMDU2Yy02LjE0NC02LjE0NC02LjE0NC0xNC4zMzYgMC0yMC40OGwxOC40MzItMTguNDMyYy0yLjA0OC00LjA5Ni00LjA5Ni04LjE5Mi02LjE0NC0xMi4yODgtMi4wNDgtNC4wOTYtNC4wOTYtOC4xOTItNC4wOTYtMTIuMjg4bC0yNC41NzYgMGMtOC4xOTIgMC0xNC4zMzYtNi4xNDQtMTQuMzM2LTE0LjMzNmwwLTIuMDQ4IDAtNjEuNDRjMC04LjE5MiA2LjE0NC0xNC4zMzYgMTQuMzM2LTE0LjMzNmwwIDAgMjQuNTc2IDBjMi4wNDgtNC4wOTYgMi4wNDgtOC4xOTIgNC4wOTYtMTIuMjg4IDIuMDQ4LTQuMDk2IDQuMDk2LTguMTkyIDYuMTQ0LTEyLjI4OEw1OTguMDE2IDYxNC40Yy02LjE0NC02LjE0NC02LjE0NC0xNC4zMzYgMC0yMC40OGwwIDAgMCAwIDQ1LjA1Ni00NS4wNTZjNi4xNDQtNi4xNDQgMTQuMzM2LTYuMTQ0IDIwLjQ4IDBsMTguNDMyIDE4LjQzMmM0LjA5Ni0yLjA0OCA4LjE5Mi00LjA5NiAxMi4yODgtNi4xNDRsMCAwYzQuMDk2LTIuMDQ4IDguMTkyLTIuMDQ4IDEyLjI4OC00LjA5Nkw3MDYuNTYgNTMyLjQ4YzAtOC4xOTIgNi4xNDQtMTQuMzM2IDE0LjMzNi0xNC4zMzZsMCAwIDYzLjQ4OCAwYzguMTkyIDAgMTQuMzM2IDYuMTQ0IDE0LjMzNiAxNC4zMzZsMCAwIDAgMjQuNTc2YzQuMDk2IDIuMDQ4IDguMTkyIDIuMDQ4IDEyLjI4OCA0LjA5NiA0LjA5NiAyLjA0OCA4LjE5MiA0LjA5NiAxMi4yODggNi4xNDRsMTguNDMyLTE4LjQzMmM2LjE0NC02LjE0NCAxNC4zMzYtNi4xNDQgMjAuNDggMGwwIDAgMCAwIDQ1LjA1NiA0NS4wNTZjNi4xNDQgNi4xNDQgNi4xNDQgMTQuMzM2IDAgMjAuNDhsLTE4LjQzMiAxOC40MzJjMi4wNDggNC4wOTYgNC4wOTYgOC4xOTIgNi4xNDQgMTIuMjg4IDIuMDQ4IDQuMDk2IDQuMDk2IDguMTkyIDQuMDk2IDEyLjI4OEw5MjEuNiA2NTcuNDA4YzguMTkyIDAgMTQuMzM2IDYuMTQ0IDE0LjMzNiAxNC4zMzZsMCAyLjA0OCAwIDYxLjQ0YzAgOC4xOTItNi4xNDQgMTQuMzM2LTE0LjMzNiAxNC4zMzZsLTM0LjgxNiAwYy04LjE5MiAwLTE0LjMzNi02LjE0NC0xNC4zMzYtMTQuMzM2IDAtOC4xOTIgNi4xNDQtMTQuMzM2IDE0LjMzNi0xNC4zMzZsMjIuNTI4IDAgMC0zNC44MTYtMjIuNTI4IDBjLTYuMTQ0IDAtMTIuMjg4LTQuMDk2LTE0LjMzNi0xMC4yNC0yLjA0OC02LjE0NC00LjA5Ni0xMi4yODgtNi4xNDQtMTguNDMyLTIuMDQ4LTYuMTQ0LTYuMTQ0LTEyLjI4OC04LjE5Mi0xNi4zODQtNC4wOTYtNi4xNDQtMi4wNDgtMTIuMjg4IDIuMDQ4LTE4LjQzMmwxNC4zMzYtMTQuMzM2LTI0LjU3Ni0yNC41NzYtMTQuMzM2IDE0LjMzNmMtNC4wOTYgNC4wOTYtMTIuMjg4IDYuMTQ0LTE4LjQzMiAyLjA0OC02LjE0NC00LjA5Ni0xMi4yODgtNi4xNDQtMTguNDMyLTguMTkyLTYuMTQ0LTIuMDQ4LTEyLjI4OC00LjA5Ni0xOC40MzItNi4xNDQtNi4xNDQtMi4wNDgtMTIuMjg4LTYuMTQ0LTEyLjI4OC0xNC4zMzZsMC0yMi41MjgtMzQuODE2IDAgMCAyMi41MjhjMCA2LjE0NC00LjA5NiAxMi4yODgtMTAuMjQgMTQuMzM2LTYuMTQ0IDIuMDQ4LTEyLjI4OCA0LjA5Ni0xOC40MzIgNi4xNDRsMCAwYy02LjE0NCAyLjA0OC0xMi4yODggNi4xNDQtMTguNDMyIDguMTkyLTYuMTQ0IDQuMDk2LTEyLjI4OCAyLjA0OC0xOC40MzItMi4wNDhsLTE0LjMzNi0xNC4zMzYtMjQuNTc2IDI0LjU3NiAxNC4zMzYgMTQuMzM2YzYuMTQ0IDQuMDk2IDYuMTQ0IDEyLjI4OCAyLjA0OCAxOC40MzItNC4wOTYgNi4xNDQtNi4xNDQgMTIuMjg4LTguMTkyIDE4LjQzMi0yLjA0OCA2LjE0NC00LjA5NiAxMi4yODgtNi4xNDQgMTguNDMyLTIuMDQ4IDYuMTQ0LTYuMTQ0IDEyLjI4OC0xNC4zMzYgMTIuMjg4bC0yMi41MjggMCAwIDM0LjgxNiAyMi41MjggMGM2LjE0NCAwIDEyLjI4OCA0LjA5NiAxNC4zMzYgMTAuMjQgMi4wNDggNi4xNDQgNC4wOTYgMTIuMjg4IDYuMTQ0IDE4LjQzMiAyLjA0OCA2LjE0NCA2LjE0NCAxMi4yODggOC4xOTIgMTguNDMyIDQuMDk2IDYuMTQ0IDIuMDQ4IDEyLjI4OC0yLjA0OCAxOC40MzJsLTE2LjM4NCAxNi4zODQgMjQuNTc2IDI0LjU3NiAxNC4zMzYtMTQuMzM2YzQuMDk2LTYuMTQ0IDEyLjI4OC02LjE0NCAxOC40MzItMi4wNDggNi4xNDQgNC4wOTYgMTIuMjg4IDYuMTQ0IDE4LjQzMiA4LjE5MmwwIDBjNi4xNDQgMi4wNDggMTIuMjg4IDQuMDk2IDE4LjQzMiA2LjE0NCA2LjE0NCAyLjA0OCAxMi4yODggNi4xNDQgMTIuMjg4IDE0LjMzNkw3MzMuMTg0IDg2MC4xNmwzNC44MTYgMEw3NjggODM3LjYzMiA3NzAuMDQ4IDgzNy42MzJ6TTc1MS42MTYgNjA4LjI1NiA3NTEuNjE2IDYwOC4yNTZjMzguOTEyIDAgNzMuNzI4IDI0LjU3NiA4OC4wNjQgNTkuMzkyIDQuMDk2IDEyLjI4OCA4LjE5MiAyNC41NzYgOC4xOTIgMzYuODY0IDAgMTIuMjg4LTIuMDQ4IDI0LjU3Ni04LjE5MiAzNi44NjRsMCAwYy0yLjA0OCA2LjE0NC02LjE0NCAxNC4zMzYtMTAuMjQgMjAuNDhsNjEuNDQgNjEuNDRjNi4xNDQgNi4xNDQgNi4xNDQgMTQuMzM2IDAgMjAuNDgtNi4xNDQgNi4xNDQtMTQuMzM2IDYuMTQ0LTIwLjQ4IDBsLTYxLjQ0LTYxLjQ0Yy02LjE0NCA0LjA5Ni0xMi4yODggOC4xOTItMjAuNDggMTIuMjg4LTEyLjI4OCA0LjA5Ni0yNC41NzYgOC4xOTItMzYuODY0IDguMTkyLTEyLjI4OCAwLTI0LjU3Ni0yLjA0OC0zNi44NjQtOC4xOTJsMCAwYy0xMi4yODgtNC4wOTYtMjIuNTI4LTEyLjI4OC0zMC43Mi0yMC40OC0xOC40MzItMTguNDMyLTI4LjY3Mi00My4wMDgtMjguNjcyLTY3LjU4NCAwLTEyLjI4OCAyLjA0OC0yNC41NzYgOC4xOTItMzYuODY0bDAgMGM0LjA5Ni0xMi4yODggMTIuMjg4LTIyLjUyOCAyMC40OC0zMC43MkM3MDIuNDY0IDYxNi40NDggNzI3LjA0IDYwOC4yNTYgNzUxLjYxNiA2MDguMjU2TDc1MS42MTYgNjA4LjI1NnpNNzUxLjYxNiA2MzQuODggNzUxLjYxNiA2MzQuODhjLTE4LjQzMiAwLTM0LjgxNiA2LjE0NC00Ny4xMDQgMjAuNDgtNi4xNDQgNi4xNDQtMTAuMjQgMTIuMjg4LTE0LjMzNiAyMC40OGwwIDBjLTQuMDk2IDguMTkyLTQuMDk2IDE2LjM4NC00LjA5NiAyNi42MjQgMCAyNi42MjQgMTYuMzg0IDUxLjIgNDAuOTYgNjEuNDRsMCAwYzguMTkyIDQuMDk2IDE2LjM4NCA2LjE0NCAyNi42MjQgNi4xNDQgMTAuMjQgMCAxOC40MzItMi4wNDggMjYuNjI0LTYuMTQ0bDAgMGMyNC41NzYtMTAuMjQgNDAuOTYtMzQuODE2IDQwLjk2LTYxLjQ0IDAtOC4xOTItMi4wNDgtMTguNDMyLTQuMDk2LTI2LjYyNGwwIDBDODAyLjgxNiA2NTEuMjY0IDc3OC4yNCA2MzQuODggNzUxLjYxNiA2MzQuODhMNzUxLjYxNiA2MzQuODh6IiBwLWlkPSIzODQ1NSI+PC9wYXRoPjwvc3ZnPg==';
        const popupControls = await controlButton.Controls;
        let enabledStatus = false
        //开启/禁用更多菜单
        const MoreMenus = await app.CommandBars('MoreMenus');
        enabledStatus = await MoreMenus.Enabled
        const btnMoreMenus = await popupControls.Add(1);
        btnMoreMenus.Caption = enabledStatus ? '更多(禁用)': '更多(启用)';
        btnMoreMenus.Picture = 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzQzNjYwOTE0NzYzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjYxMTUiIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4Ij48cGF0aCBkPSJNODYwIDE5MkgxNjRhNCA0IDAgMCAwLTQgNHY2NGE0IDQgMCAwIDAgNCA0aDY5NmE0IDQgMCAwIDAgNC00di02NGE0IDQgMCAwIDAtNC00eiBtMCAyODRIMTY0YTQgNCAwIDAgMC00IDR2NjRhNCA0IDAgMCAwIDQgNGg2OTZhNCA0IDAgMCAwIDQtNHYtNjRhNCA0IDAgMCAwLTQtNHogbTAgMjg0SDE2NGE0IDQgMCAwIDAtNCA0djY0YTQgNCAwIDAgMCA0IDRoNjk2YTQgNCAwIDAgMCA0LTR2LTY0YTQgNCAwIDAgMC00LTR6IiBwLWlkPSI2MTE2Ij48L3BhdGg+PC9zdmc+';
        btnMoreMenus.OnAction = async function(){
            enabledStatus = await MoreMenus.Enabled
            MoreMenus.Enabled = !enabledStatus;
            if(enabledStatus){
                btnMoreMenus.Caption = '更多(启用)';
            }else{
                btnMoreMenus.Caption = '更多(禁用)';
            }
        }
        //开启/禁用限制编辑
        const RestrictEdit = await app.CommandBars('RestrictEdit');
        enabledStatus = await RestrictEdit.Enabled
        const btnRestrictEdit = await popupControls.Add(1);
        RestrictEdit.Visible = true
        btnRestrictEdit.Caption = enabledStatus ? '限制编辑(禁用)' : '限制编辑(启用)';
        btnRestrictEdit.Picture = 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzQzNjcyODMzMjk1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM0NjI4IiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTUxMC41Nzc3NzggMGMtMTIuOCAwLTI1LjYgNC4yNjY2NjctMzYuOTc3Nzc4IDExLjM3Nzc3OEM0NzAuNzU1NTU2IDEyLjggMzkyLjUzMzMzMyA5NS4yODg4ODkgMzE1LjczMzMzMyAxMTMuNzc3Nzc4Yy00OS43Nzc3NzggMTIuOC0xMDUuMjQ0NDQ0IDE0LjIyMjIyMi0xMzIuMjY2NjY3IDE0LjIyMjIyMi0xNy4wNjY2NjcgMC0yNy4wMjIyMjIgMC0yOC40NDQ0NDQgMC0xLjQyMjIyMiAwLTIuODQ0NDQ0IDAtNC4yNjY2NjcgMC0xNy4wNjY2NjcgMC0zMi43MTExMTEgNS42ODg4ODktNDUuNTExMTExIDE3LjA2NjY2N0M5Mi40NDQ0NDQgMTU2LjQ0NDQ0NCA4NS4zMzMzMzMgMTczLjUxMTExMSA4NS4zMzMzMzMgMTkwLjU3Nzc3OGwwIDE2MC43MTExMTFjMCA1OTMuMDY2NjY3IDM5Ni44IDY2OC40NDQ0NDQgNDEzLjg2NjY2NyA2NzEuMjg4ODg5IDQuMjY2NjY3IDAgNy4xMTExMTEgMS40MjIyMjIgMTEuMzc3Nzc4IDEuNDIyMjIyIDQuMjY2NjY3IDAgNy4xMTExMTEgMCAxMS4zNzc3NzgtMS40MjIyMjJDNTM5LjAyMjIyMiAxMDE5LjczMzMzMyA5MzguNjY2NjY3IDk0NC4zNTU1NTYgOTM4LjY2NjY2NyAzNTEuMjg4ODg5TDkzOC42NjY2NjcgMTkwLjU3Nzc3OGMwLTE3LjA2NjY2Ny03LjExMTExMS0zNC4xMzMzMzMtMjEuMzMzMzMzLTQ2LjkzMzMzMy0xMi44LTExLjM3Nzc3OC0yOC40NDQ0NDQtMTcuMDY2NjY3LTQ0LjA4ODg4OS0xNy4wNjY2NjctMS40MjIyMjIgMC0yLjg0NDQ0NCAwLTQuMjY2NjY3IDAtMS40MjIyMjIgMC0xMS4zNzc3NzggMC0yOC40NDQ0NDQgMC0yNy4wMjIyMjIgMC04MS4wNjY2NjctMS40MjIyMjItMTMwLjg0NDQ0NC0xNC4yMjIyMjJDNjQ0LjI2NjY2NyA5OC4xMzMzMzMgNTY4Ljg4ODg4OSAyNS42IDU0Ny41NTU1NTYgMTEuMzc3Nzc4IDUzNi4xNzc3NzggNC4yNjY2NjcgNTIzLjM3Nzc3OCAwIDUxMC41Nzc3NzggMEw1MTAuNTc3Nzc4IDB6IiBmaWxsPSIjRkZDQzIyIiBwLWlkPSIzNDYyOSI+PC9wYXRoPjxwYXRoIGQ9Ik02NDIuODQ0NDQ0IDM1NS41NTU1NTZjLTkuOTU1NTU2IDIuODQ0NDQ0LTE4LjQ4ODg4OS0yLjg0NDQ0NC0yMS4zMzMzMzMtMTIuOGwtNy4xMTExMTEtMjkuODY2NjY3QzU5Ny4zMzMzMzMgMjU2IDU0NC43MTExMTEgMjIxLjg2NjY2NyA0ODMuNTU1NTU2IDIzNy41MTExMTFjLTYxLjE1NTU1NiAxNS42NDQ0NDQtODguMTc3Nzc4IDcyLjUzMzMzMy03Mi41MzMzMzMgMTI5LjQyMjIyMmwxMS4zNzc3NzggNTIuNjIyMjIyYzIuODQ0NDQ0IDguNTMzMzMzLTIuODQ0NDQ0IDE4LjQ4ODg4OS0xMi44IDIxLjMzMzMzMy05Ljk1NTU1NiAyLjg0NDQ0NC0xOC40ODg4ODktMi44NDQ0NDQtMjEuMzMzMzMzLTEyLjhsLTExLjM3Nzc3OC01Mi42MjIyMjJjLTE5LjkxMTExMS03NS4zNzc3NzggMTcuMDY2NjY3LTE1MC43NTU1NTYgOTguMTMzMzMzLTE3Mi4wODg4ODkgNzkuNjQ0NDQ0LTIxLjMzMzMzMyAxNTIuMTc3Nzc4IDI0LjE3Nzc3OCAxNzMuNTExMTExIDEwMC45Nzc3NzhsNy4xMTExMTEgMjkuODY2NjY3QzY1Ny4wNjY2NjcgMzQyLjc1NTU1NiA2NTEuMzc3Nzc4IDM1Mi43MTExMTEgNjQyLjg0NDQ0NCAzNTUuNTU1NTU2eiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMzQ2MzAiPjwvcGF0aD48cGF0aCBkPSJNNjY5Ljg2NjY2NyA3NTMuNzc3Nzc4IDM1NC4xMzMzMzMgNzUzLjc3Nzc3OGMtMzguNCAwLTY5LjY4ODg4OS0zMS4yODg4ODktNjkuNjg4ODg5LTY5LjY4ODg4OUwyODQuNDQ0NDQ0IDQ3Ni40NDQ0NDRjMC0zOC40IDMxLjI4ODg4OS02OS42ODg4ODkgNjkuNjg4ODg5LTY5LjY4ODg4OWwzMTUuNzMzMzMzIDBjMzguNCAwIDY5LjY4ODg4OSAzMS4yODg4ODkgNjkuNjg4ODg5IDY5LjY4ODg4OWwwIDIwNy42NDQ0NDRDNzM5LjU1NTU1NiA3MjIuNDg4ODg5IDcwOC4yNjY2NjcgNzUzLjc3Nzc3OCA2NjkuODY2NjY3IDc1My43Nzc3Nzh6TTM1NC4xMzMzMzMgNDQyLjMxMTExMWMtMTkuOTExMTExIDAtMzUuNTU1NTU2IDE1LjY0NDQ0NC0zNS41NTU1NTYgMzQuMTMzMzMzbDAgMjA3LjY0NDQ0NGMwIDE4LjQ4ODg4OSAxNS42NDQ0NDQgMzQuMTMzMzMzIDM1LjU1NTU1NiAzNC4xMzMzMzNsMzE1LjczMzMzMyAwYzE5LjkxMTExMSAwIDM1LjU1NTU1Ni0xNS42NDQ0NDQgMzUuNTU1NTU2LTM0LjEzMzMzM0w3MDUuNDIyMjIyIDQ3Ni40NDQ0NDRjMC0xOC40ODg4ODktMTUuNjQ0NDQ0LTM0LjEzMzMzMy0zNS41NTU1NTYtMzQuMTMzMzMzTDM1NC4xMzMzMzMgNDQyLjMxMTExMXoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjM0NjMxIj48L3BhdGg+PHBhdGggZD0iTTUxMiA1MTJjMTkuOTExMTExIDAgMzUuNTU1NTU2IDE1LjY0NDQ0NCAzNS41NTU1NTYgMzQuMTMzMzMzIDAgMTguNDg4ODg5LTE1LjY0NDQ0NCAzNC4xMzMzMzMtMzUuNTU1NTU2IDM0LjEzMzMzMy0xOS45MTExMTEgMC0zNS41NTU1NTYtMTUuNjQ0NDQ0LTM1LjU1NTU1Ni0zNC4xMzMzMzNDNDc2LjQ0NDQ0NCA1MjcuNjQ0NDQ0IDQ5Mi4wODg4ODkgNTEyIDUxMiA1MTJ6IiBmaWxsPSIjRkZGRkZGIiBwLWlkPSIzNDYzMiI+PC9wYXRoPjxwYXRoIGQ9Ik01MTIgNTQ2LjEzMzMzM2M5Ljk1NTU1NiAwIDE3LjA2NjY2NyA3LjExMTExMSAxNy4wNjY2NjcgMTcuMDY2NjY3bDAgNjkuNjg4ODg5YzAgOS45NTU1NTYtOC41MzMzMzMgMTcuMDY2NjY3LTE3LjA2NjY2NyAxNy4wNjY2NjctOS45NTU1NTYgMC0xNy4wNjY2NjctNy4xMTExMTEtMTcuMDY2NjY3LTE3LjA2NjY2N2wwLTY5LjY4ODg4OUM0OTQuOTMzMzMzIDU1NC42NjY2NjcgNTAyLjA0NDQ0NCA1NDYuMTMzMzMzIDUxMiA1NDYuMTMzMzMzeiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMzQ2MzMiPjwvcGF0aD48L3N2Zz4='
        btnRestrictEdit.OnAction = async function(){
            enabledStatus = await RestrictEdit.Enabled
            RestrictEdit.Enabled = !enabledStatus;
            if(enabledStatus){
                btnRestrictEdit.Caption = '限制编辑(启用)';
            }else{
                btnRestrictEdit.Caption = '限制编辑(禁用)';
            }
        }
        //只读模式切换
        const btnReadOnly = await popupControls.Add(1);
        enabledStatus = await app.ActiveDocument.ReadOnly;
        const base64ReadOnly = 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzQzNjcyMTgzMDAwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyNDU3IiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTcyNC44NTIzNjQgMzcuMjM2MzY0YzYyLjM3MDkwOSAwIDkzLjEzNzQ1NSA1Ljk1NzgxOCAxMjUuMTYwNzI3IDIzLjA0YTE2NC4xMTkyNzMgMTY0LjExOTI3MyAwIDAgMSA2OC4wNDk0NTQgNjguMDQ5NDU0YzE1Ljk2NTA5MSAyOS44ODIxODIgMjIuMjAyMTgyIDU4LjY0NzI3MyAyMi45NDY5MSAxMTMuMTA1NDU1bDAuMDkzMDkgMTIuMDU1MjcyVjUxMmEzNy4yMzYzNjQgMzcuMjM2MzY0IDAgMCAxLTc0LjE5MzQ1NCA0LjY1NDU0NWwtMC4yNzkyNzMtNC42NTQ1NDVWMjUzLjQ4NjU0NWwtMC4yMzI3MjctMjAuMDE0NTQ1LTAuNzQ0NzI3LTE2Ljc1NjM2NGMtMS42NzU2MzYtMjUuMzY3MjczLTUuNzI1MDkxLTM5LjE0NDcyNy0xMy4yNjU0NTUtNTMuMjQ4YTg5LjY0NjU0NSA4OS42NDY1NDUgMCAwIDAtMzcuNTE1NjM2LTM3LjUxNTYzNmMtMTUuNDk5NjM2LTguMjg1MDkxLTMwLjYyNjkwOS0xMi4zMzQ1NDUtNjEuMjA3MjczLTEzLjY4NDM2NGwtMTguMzM4OTA5LTAuNDY1NDU0LTEwLjQ3MjcyNy0wLjA5MzA5MUgzMDAuMDMybC0yMC4wMTQ1NDUgMC4yMzI3MjdjLTM2LjU4NDcyNyAwLjkzMDkwOS01My4wNjE4MTggNC45ODAzNjQtNzAuMDA0MzY0IDE0LjAxMDE4Mi0xNi4yOTA5MDkgOC43MDQtMjguODExNjM2IDIxLjI3MTI3My0zNy41MTU2MzYgMzcuNTE1NjM2LTguMjg1MDkxIDE1LjQ5OTYzNi0xMi4zMzQ1NDUgMzAuNjI2OTA5LTEzLjY4NDM2NCA2MS4yMDcyNzNsLTAuNDY1NDU1IDE4LjMzODkwOS0wLjA5MzA5MSAxMC40NzI3Mjd2NTE3LjAyNjkxbDAuMjMyNzI4IDIwLjA2MTA5YzAuOTMwOTA5IDM2LjU4NDcyNyA0Ljk4MDM2NCA1My4wNjE4MTggMTQuMDEwMTgyIDY5Ljk1NzgxOSA4LjcwNCAxNi4yOTA5MDkgMjEuMjcxMjczIDI4LjgxMTYzNiAzNy41MTU2MzYgMzcuNTE1NjM2IDE0LjEwMzI3MyA3LjU0MDM2NCAyNy45MjcyNzMgMTEuNTg5ODE4IDUzLjI0OCAxMy4yNjU0NTVsMTYuNzU2MzY0IDAuNzQ0NzI3IDIwLjAxNDU0NSAwLjIzMjcyN0g0MTEuOTI3MjczYTM3LjIzNjM2NCAzNy4yMzYzNjQgMCAwIDEgNC42NTQ1NDUgNzQuMTkzNDU1bC00LjY1NDU0NSAwLjI3OTI3MkgzMDAuMDMyYy02Mi4zNzA5MDkgMC05My4xMzc0NTUtNS45NTc4MTgtMTI1LjE2MDcyNy0yMy4wNGExNjQuMTE5MjczIDE2NC4xMTkyNzMgMCAwIDEtNjguMDQ5NDU1LTY4LjA0OTQ1NGMtMTUuOTY1MDkxLTI5Ljg4MjE4Mi0yMi4yMDIxODItNTguNjQ3MjczLTIyLjk0NjkwOS0xMTMuMTA1NDU1TDgzLjc4MTgxOCA3NzAuNTEzNDU1VjI1My40ODY1NDVjMC02Mi4zNzA5MDkgNS45NTc4MTgtOTMuMTM3NDU1IDIzLjA0LTEyNS4xNjA3MjdhMTY0LjExOTI3MyAxNjQuMTE5MjczIDAgMCAxIDY4LjA0OTQ1NS02OC4wNDk0NTRDMjA0LjggNDQuMzExMjczIDIzMy41MTg1NDUgMzguMDc0MTgyIDI4Ny45NzY3MjcgMzcuMzI5NDU1TDMwMC4wMzIgMzcuMjM2MzY0aDQyNC44MjAzNjR6TTcyMS40NTQ1NDUgNTg2LjQ3MjcyN2M5NC4yNTQ1NDUgMCAxNzkuNTcyMzY0IDYyLjA0NTA5MSAyNTYgMTg2LjE4MTgxOC03Ni40Mjc2MzYgMTI0LjEzNjcyNy0xNjEuNzQ1NDU1IDE4Ni4xODE4MTgtMjU2IDE4Ni4xODE4MTlzLTE3OS41NzIzNjQtNjIuMDQ1MDkxLTI1Ni0xODYuMTgxODE5Yzc2LjQyNzYzNi0xMjQuMTM2NzI3IDE2MS43NDU0NTUtMTg2LjE4MTgxOCAyNTYtMTg2LjE4MTgxOHogbTgyLjMzODkxIDEwMC44MTc0NTVsMi4wOTQ1NDUgNC4xODkwOTFhOTMuMDkwOTA5IDkzLjA5MDkwOSAwIDEgMS0xNzcuMjkxNjM2IDQ2LjE3MzA5MWwtMC4yMzI3MjgtNi44ODg3MjhjMC0xNS42ODU4MTggMy44NjMyNzMtMzAuNDg3MjczIDEwLjcwNTQ1NS00My40MjY5MDktMjYuNDM3ODE4IDE3LjIyMTgxOC01Mi45MjIxODIgNDMuMTk0MTgyLTc5LjQwNjU0NiA3OC43MDgzNjRsLTQuNzk0MTgxIDYuNjA5NDU0IDQuNzk0MTgxIDYuNjA5NDU1YzUxLjI5MzA5MSA2OC43OTQxODIgMTAyLjUzOTYzNiAxMDEuODg4IDE1NC4wNjU0NTUgMTA0Ljg2NjkwOUw3MjEuNDU0NTQ1IDg4NC4zNjM2MzZjNTQuMTMyMzY0IDAgMTA3Ljk4NTQ1NS0zMi44NjEwOTEgMTYxLjc5Mi0xMDUuMDk5NjM2bDQuNzQ3NjM3LTYuNjA5NDU1LTQuNzQ3NjM3LTYuNjA5NDU0Yy0yMy41NTItMzEuNTU3ODE4LTQ3LjA1NzQ1NS01NS42MjE4MTgtNzAuNjU2LTcyLjcwNGwtOC43OTcwOS02LjA1MDkwOXpNNjc0LjkwOTA5MSA2ODQuMjE4MTgyYTQ2LjU0NTQ1NSA0Ni41NDU0NTUgMCAxIDAgMCA5My4wOTA5MDkgNDYuNTQ1NDU1IDQ2LjU0NTQ1NSAwIDAgMCAwLTkzLjA5MDkwOXogbS0yNzAuMzgyNTQ2LTIzLjI3MjcyN2EzNy4yMzYzNjQgMzcuMjM2MzY0IDAgMCAxIDQuNjU0NTQ2IDc0LjE5MzQ1NGwtNC42NTQ1NDYgMC4yNzkyNzNIMzA3LjJhMzcuMjM2MzY0IDM3LjIzNjM2NCAwIDAgMS00LjY1NDU0NS03NC4xOTM0NTVsNC42NTQ1NDUtMC4yNzkyNzJoOTcuMzI2NTQ1eiBtMTMwLjc0NjE4Mi0xODYuMTgxODE5YTM3LjIzNjM2NCAzNy4yMzYzNjQgMCAwIDEgNC42NTQ1NDYgNzQuMTkzNDU1bC00LjY1NDU0NiAwLjI3OTI3M0gzMDcuMmEzNy4yMzYzNjQgMzcuMjM2MzY0IDAgMCAxLTQuNjU0NTQ1LTc0LjE5MzQ1NWw0LjY1NDU0NS0wLjI3OTI3M2gyMjguMDcyNzI3eiBtMTgxLjIwMTQ1NS0xODYuMTgxODE4YTM3LjIzNjM2NCAzNy4yMzYzNjQgMCAwIDEgNC42NTQ1NDUgNzQuMTkzNDU1bC00LjY1NDU0NSAwLjI3OTI3MkgzMDcuMmEzNy4yMzYzNjQgMzcuMjM2MzY0IDAgMCAxLTQuNjU0NTQ1LTc0LjE5MzQ1NGw0LjY1NDU0NS0wLjI3OTI3M2g0MDkuMjc0MTgyeiIgZmlsbD0iIzI2MjYyNiIgcC1pZD0iMTI0NTgiPjwvcGF0aD48L3N2Zz4='
        const base64Edit = 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzQzNjcyMzMwNjE4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0NDQ5IiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTQ3Ny44MTUgMzE4LjU3SDI4NC4yMzNjLTE3LjQgMC0zMi42MjMgMTQuMTM3LTMyLjYyMyAzMS41MzggMCAxNy40IDE0LjEzNyAzMS41MzggMzIuNjIzIDMxLjUzOGgxOTMuNTgyYzE3LjQgMCAzMi42MjMtMTQuMTM4IDMyLjYyMy0zMS41MzgtMS4wODUtMTcuNDAxLTE1LjIyMy0zMS41MzgtMzIuNjIzLTMxLjUzOHoiIHAtaWQ9IjE0NDUwIj48L3BhdGg+PHBhdGggZD0iTTg2My44ODYgMjU0LjQwM2MtMTcuNCAwLTMyLjYyNCAxNC4xMzgtMzIuNjI0IDMxLjUzOHY1NzUuMTM3YzAgMTcuNDAxLTE0LjEzNyAzMS41MzgtMzIuNjI4IDMxLjUzOEgyMjQuMDcyYy0xNy40MDEgMC0zMi42MjktMTQuMTM3LTMyLjYyOS0zMS41MzhWMTU4LjcwM2MwLTE3LjQwMSAxNC4xNDItMzEuNTM4IDMyLjYyOS0zMS41MzhoNDQ3LjMyNGMxNy40IDAgMzIuNjIzLTE0LjE0MyAzMi42MjMtMzEuNTQyIDAtMTcuNDAxLTE0LjEzNy0zMS41MzgtMzIuNjIzLTMxLjUzOEgyMjQuMDcyYy01My4yODggMC05Ni43OTEgNDMuNTAzLTk2Ljc5MSA5NS43MDV2NzAyLjM3NWMwIDUzLjI5MiA0My41MDMgOTUuNzA1IDk2Ljc5MSA5NS43MDVoNTc1LjY1MmM1My4yODggMCA5Ni43ODctNDMuNDk4IDk2Ljc4Ny05NS43MDVWMjg3LjAzMmMtMC4wMDEtMTguNDkxLTE0LjEzOS0zMi42MjktMzIuNjI1LTMyLjYyOXoiIHAtaWQ9IjE0NDUxIj48L3BhdGg+PHBhdGggZD0iTTYwNi4wMTkgNTA5Ljk3NUgyODQuMjMzYy0xNy40IDAtMzEuNTM4IDE0LjEzNy0zMS41MzggMzEuNTM4IDAgMTcuNCAxNC4xMzggMzEuNTM4IDMyLjYyOSAzMS41MzhINjA2LjAyYzE3LjQgMCAzMi42MjMtMTQuMTM4IDMyLjYyMy0zMS41MzggMC0xNy40MDEtMTQuMTM3LTMxLjUzOC0zMi42MjQtMzEuNTM4ek0yNTIuNjk1IDczNS43NjFjMCAxNy40IDE0LjEzOCAzMS41MzggMzIuNjI5IDMxLjUzOGg0NTIuNzQyYzE3LjQgMCAzMi42MjMtMTQuMTM4IDMyLjYyMy0zMS41MzggMC0xNy40MDEtMTQuMTM3LTMxLjUzOC0zMi42MjMtMzEuNTM4SDI4NC4yMzNjLTE3LjQgMC0zMS41MzggMTQuMTM3LTMxLjUzOCAzMS41Mzh6TTk1My4wNjUgMTAuNzk4Yy0xMy4wNTEtMTEuOTYyLTMyLjYyOS0xMS45NjItNDUuNjc5IDBMNTg3LjY1NyAzMjguMzU0Yy0xMy4wNTIgMTEuOTY1LTEzLjA1MiAzMi42MjggMCA0NS42NzkgNi41MjEgNi41MjEgMTQuMTM4IDkuNzg0IDIyLjgzNiA5Ljc4NCA4LjcwMiAwIDE2LjMxNS0zLjI2MyAyMi44NC05Ljc4NEw5NTMuMDY1IDU1LjM4NmMxMy4wNDctMTEuOTY1IDEzLjA0Ny0zMi42MjMgMC00NC41ODh6IiBwLWlkPSIxNDQ1MiI+PC9wYXRoPjwvc3ZnPg=='
        btnReadOnly.Caption = enabledStatus ? '编辑模式' : '只读模式';
        btnReadOnly.Picture = enabledStatus ? base64Edit : base64ReadOnly
        btnReadOnly.OnAction = async function(){
            enabledStatus = await app.ActiveDocument.ReadOnly;
            await app.ActiveDocument.SetReadOnly({
                Value: !enabledStatus,
            });
            if(enabledStatus){
                btnReadOnly.Caption = '只读模式';
                btnReadOnly.Picture = base64ReadOnly
            }else{
                btnReadOnly.Caption = '编辑模式';
                btnReadOnly.Picture = base64Edit
            }
        }
        //启动保护
        const ToggleProtect = await popupControls.Add(1);
        enabledStatus = await app.ActiveDocument.RestrictEditMode
        const base64Protect = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzQ0OTY2MzAwMTQ5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEzODU3IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiPjxwYXRoIGQ9Ik01MTAuNTc3Nzc4IDBjLTEyLjggMC0yNS42IDQuMjY2NjY3LTM2Ljk3Nzc3OCAxMS4zNzc3NzhDNDcwLjc1NTU1NiAxMi44IDM5Mi41MzMzMzMgOTUuMjg4ODg5IDMxNS43MzMzMzMgMTEzLjc3Nzc3OGMtNDkuNzc3Nzc4IDEyLjgtMTA1LjI0NDQ0NCAxNC4yMjIyMjItMTMyLjI2NjY2NyAxNC4yMjIyMjItMTcuMDY2NjY3IDAtMjcuMDIyMjIyIDAtMjguNDQ0NDQ0IDAtMS40MjIyMjIgMC0yLjg0NDQ0NCAwLTQuMjY2NjY3IDAtMTcuMDY2NjY3IDAtMzIuNzExMTExIDUuNjg4ODg5LTQ1LjUxMTExMSAxNy4wNjY2NjdDOTIuNDQ0NDQ0IDE1Ni40NDQ0NDQgODUuMzMzMzMzIDE3My41MTExMTEgODUuMzMzMzMzIDE5MC41Nzc3NzhsMCAxNjAuNzExMTExYzAgNTkzLjA2NjY2NyAzOTYuOCA2NjguNDQ0NDQ0IDQxMy44NjY2NjcgNjcxLjI4ODg4OSA0LjI2NjY2NyAwIDcuMTExMTExIDEuNDIyMjIyIDExLjM3Nzc3OCAxLjQyMjIyMiA0LjI2NjY2NyAwIDcuMTExMTExIDAgMTEuMzc3Nzc4LTEuNDIyMjIyQzUzOS4wMjIyMjIgMTAxOS43MzMzMzMgOTM4LjY2NjY2NyA5NDQuMzU1NTU2IDkzOC42NjY2NjcgMzUxLjI4ODg4OUw5MzguNjY2NjY3IDE5MC41Nzc3NzhjMC0xNy4wNjY2NjctNy4xMTExMTEtMzQuMTMzMzMzLTIxLjMzMzMzMy00Ni45MzMzMzMtMTIuOC0xMS4zNzc3NzgtMjguNDQ0NDQ0LTE3LjA2NjY2Ny00NC4wODg4ODktMTcuMDY2NjY3LTEuNDIyMjIyIDAtMi44NDQ0NDQgMC00LjI2NjY2NyAwLTEuNDIyMjIyIDAtMTEuMzc3Nzc4IDAtMjguNDQ0NDQ0IDAtMjcuMDIyMjIyIDAtODEuMDY2NjY3LTEuNDIyMjIyLTEzMC44NDQ0NDQtMTQuMjIyMjIyQzY0NC4yNjY2NjcgOTguMTMzMzMzIDU2OC44ODg4ODkgMjUuNiA1NDcuNTU1NTU2IDExLjM3Nzc3OCA1MzYuMTc3Nzc4IDQuMjY2NjY3IDUyMy4zNzc3NzggMCA1MTAuNTc3Nzc4IDBMNTEwLjU3Nzc3OCAweiIgZmlsbD0iI0ZGQ0MyMiIgcC1pZD0iMTM4NTgiPjwvcGF0aD48cGF0aCBkPSJNNjQyLjg0NDQ0NCAzNTUuNTU1NTU2Yy05Ljk1NTU1NiAyLjg0NDQ0NC0xOC40ODg4ODktMi44NDQ0NDQtMjEuMzMzMzMzLTEyLjhsLTcuMTExMTExLTI5Ljg2NjY2N0M1OTcuMzMzMzMzIDI1NiA1NDQuNzExMTExIDIyMS44NjY2NjcgNDgzLjU1NTU1NiAyMzcuNTExMTExYy02MS4xNTU1NTYgMTUuNjQ0NDQ0LTg4LjE3Nzc3OCA3Mi41MzMzMzMtNzIuNTMzMzMzIDEyOS40MjIyMjJsMTEuMzc3Nzc4IDUyLjYyMjIyMmMyLjg0NDQ0NCA4LjUzMzMzMy0yLjg0NDQ0NCAxOC40ODg4ODktMTIuOCAyMS4zMzMzMzMtOS45NTU1NTYgMi44NDQ0NDQtMTguNDg4ODg5LTIuODQ0NDQ0LTIxLjMzMzMzMy0xMi44bC0xMS4zNzc3NzgtNTIuNjIyMjIyYy0xOS45MTExMTEtNzUuMzc3Nzc4IDE3LjA2NjY2Ny0xNTAuNzU1NTU2IDk4LjEzMzMzMy0xNzIuMDg4ODg5IDc5LjY0NDQ0NC0yMS4zMzMzMzMgMTUyLjE3Nzc3OCAyNC4xNzc3NzggMTczLjUxMTExMSAxMDAuOTc3Nzc4bDcuMTExMTExIDI5Ljg2NjY2N0M2NTcuMDY2NjY3IDM0Mi43NTU1NTYgNjUxLjM3Nzc3OCAzNTIuNzExMTExIDY0Mi44NDQ0NDQgMzU1LjU1NTU1NnoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjEzODU5Ij48L3BhdGg+PHBhdGggZD0iTTY2OS44NjY2NjcgNzUzLjc3Nzc3OCAzNTQuMTMzMzMzIDc1My43Nzc3NzhjLTM4LjQgMC02OS42ODg4ODktMzEuMjg4ODg5LTY5LjY4ODg4OS02OS42ODg4ODlMMjg0LjQ0NDQ0NCA0NzYuNDQ0NDQ0YzAtMzguNCAzMS4yODg4ODktNjkuNjg4ODg5IDY5LjY4ODg4OS02OS42ODg4ODlsMzE1LjczMzMzMyAwYzM4LjQgMCA2OS42ODg4ODkgMzEuMjg4ODg5IDY5LjY4ODg4OSA2OS42ODg4ODlsMCAyMDcuNjQ0NDQ0QzczOS41NTU1NTYgNzIyLjQ4ODg4OSA3MDguMjY2NjY3IDc1My43Nzc3NzggNjY5Ljg2NjY2NyA3NTMuNzc3Nzc4ek0zNTQuMTMzMzMzIDQ0Mi4zMTExMTFjLTE5LjkxMTExMSAwLTM1LjU1NTU1NiAxNS42NDQ0NDQtMzUuNTU1NTU2IDM0LjEzMzMzM2wwIDIwNy42NDQ0NDRjMCAxOC40ODg4ODkgMTUuNjQ0NDQ0IDM0LjEzMzMzMyAzNS41NTU1NTYgMzQuMTMzMzMzbDMxNS43MzMzMzMgMGMxOS45MTExMTEgMCAzNS41NTU1NTYtMTUuNjQ0NDQ0IDM1LjU1NTU1Ni0zNC4xMzMzMzNMNzA1LjQyMjIyMiA0NzYuNDQ0NDQ0YzAtMTguNDg4ODg5LTE1LjY0NDQ0NC0zNC4xMzMzMzMtMzUuNTU1NTU2LTM0LjEzMzMzM0wzNTQuMTMzMzMzIDQ0Mi4zMTExMTF6IiBmaWxsPSIjRkZGRkZGIiBwLWlkPSIxMzg2MCI+PC9wYXRoPjxwYXRoIGQ9Ik01MTIgNTEyYzE5LjkxMTExMSAwIDM1LjU1NTU1NiAxNS42NDQ0NDQgMzUuNTU1NTU2IDM0LjEzMzMzMyAwIDE4LjQ4ODg4OS0xNS42NDQ0NDQgMzQuMTMzMzMzLTM1LjU1NTU1NiAzNC4xMzMzMzMtMTkuOTExMTExIDAtMzUuNTU1NTU2LTE1LjY0NDQ0NC0zNS41NTU1NTYtMzQuMTMzMzMzQzQ3Ni40NDQ0NDQgNTI3LjY0NDQ0NCA0OTIuMDg4ODg5IDUxMiA1MTIgNTEyeiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMTM4NjEiPjwvcGF0aD48cGF0aCBkPSJNNTEyIDU0Ni4xMzMzMzNjOS45NTU1NTYgMCAxNy4wNjY2NjcgNy4xMTExMTEgMTcuMDY2NjY3IDE3LjA2NjY2N2wwIDY5LjY4ODg4OWMwIDkuOTU1NTU2LTguNTMzMzMzIDE3LjA2NjY2Ny0xNy4wNjY2NjcgMTcuMDY2NjY3LTkuOTU1NTU2IDAtMTcuMDY2NjY3LTcuMTExMTExLTE3LjA2NjY2Ny0xNy4wNjY2NjdsMC02OS42ODg4ODlDNDk0LjkzMzMzMyA1NTQuNjY2NjY3IDUwMi4wNDQ0NDQgNTQ2LjEzMzMzMyA1MTIgNTQ2LjEzMzMzM3oiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjEzODYyIj48L3BhdGg+PC9zdmc+'
        const base64UnProtect = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzQ0OTY2NTA2MTg4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4MTQ3IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiPjxwYXRoIGQ9Ik03NjguMjU0MjIgMHE0OC44MTAzMjggMCA5NC4wNjE1NjkgMTguMzAzODczdDgwLjMzMzY2NCA1MC4zMzU2NSA1Ni40MzY5NDEgNzQuNzQwODE0IDIxLjM1NDUxOCA5MS41MTkzNjRsMCAxNTAuNDk4NTEtMTIzLjA0MjcwMSAwIDAtMTIyLjAyNTgxOXEwLTY0LjA2MzU1NS0zNi4wOTkzMDUtOTkuNjU0NDE5dC05Ny4xMTIyMTQtMzUuNTkwODY0cS01NC45MTE2MTkgMC04OC40Njg3MTkgMzUuNTkwODY0dC0zMy41NTcxIDk5LjY1NDQxOWwwIDEyNC4wNTk1ODMtMTI4LjEyNzExIDAgMC0xNTIuNTMyMjc0cTAtNDguODEwMzI4IDE5LjMyMDc1NS05MS41MTkzNjR0NTMuMzg2Mjk2LTc0Ljc0MDgxNCA4MC4zMzM2NjQtNTAuMzM1NjUgMTAxLjE3OTc0Mi0xOC4zMDM4NzN6TTc2Ni4yMjA0NTcgNjkzLjUxMzQwNmwwIDg3LjQ1MTgzNyAwIDQ3Ljc5MzQ0NnEwIDI3LjQ1NTgwOS05LjY2MDM3NyA1MS44NjA5NzN0LTI2LjQzODkyOCA0MS42OTIxNTUtMzkuNjU4MzkxIDI3LjQ1NTgwOS01MC4zMzU2NSAxMC4xNjg4MThsLTUxNC41NDIyMDUgMHEtMjcuNDU1ODA5IDAtNDkuODI3MjEtOS42NjAzNzd0LTM4LjY0MTUwOS0yNi40Mzg5MjgtMjQuOTEzNjA1LTM5LjE0OTk1LTguNjQzNDk2LTQ3Ljc5MzQ0NmwwLTMyMy4zNjg0MjFxMC0yOC40NzI2OTEgMTkuODI5MTk2LTQ3Ljc5MzQ0NnQ0Ni4yNjgxMjMtMTkuMzIwNzU1bDYyOS40NDk4NTEgMHEyOC40NzI2OTEgMCA0Ny43OTM0NDYgMTkuMzIwNzU1dDE5LjMyMDc1NSA0Ny43OTM0NDZsMCAxNzkuOTg4MDgzeiIgcC1pZD0iMjgxNDgiIGZpbGw9IiMxYWZhMjkiPjwvcGF0aD48L3N2Zz4='
        ToggleProtect.Caption = enabledStatus > 0 ? '停止保护' : '启动保护';
        ToggleProtect.Picture = enabledStatus ? base64UnProtect : base64Protect
        ToggleProtect.OnAction = async function(){
            enabledStatus = await app.ActiveDocument.RestrictEditMode
            if(enabledStatus > 0){
                await app.ActiveDocument.Unprotect('eGidu4AltoWHPV2NcHd')
                ToggleProtect.Caption = '启动保护';
                ToggleProtect.Picture = base64Protect
            }else{
                await app.ActiveDocument.Protect('eGidu4AltoWHPV2NcHd')
                ToggleProtect.Caption = '停止保护';
                ToggleProtect.Picture = base64UnProtect
                await app.ActiveDocument.SetContentControlAuthority('read', [
                    { tag: 'test', access: 'edit' }
                ])
            }
        }
        //设置焦点
        controlButton.SetFocus(true);
    }

    async function SwitchRestrictEditEnabled(isEnabled) {
        await GlobalWps.ready();
        const app = GlobalWps.Application;
        const RestrictEdit = await app.CommandBars('MoreMenus');
        const {taskStatus} = this.state
        console.log(taskStatus)
        if(RestrictEdit){
            console.log(RestrictEdit)
            RestrictEdit.Enabled = isEnabled;
        }
    }


    /* end：WPS */

    /* begin：SpreadJS */

    btnplugin.addEventListener("click", (e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            let sp = getSp()
            if(!isDesigner){
                addCustomMenu(sp)
                hasCustomMenu = true
                let parentDiv = document.querySelector(".ant-message")
                let span
                let div
                let msgTimer
                if(parentDiv){
                    span = parentDiv.querySelector("span")
                    if(span){
                        div = span.querySelector("div")
                        if(div){
                            span.removeChild(div)
                        }
                        div = document.createElement("div")
                        div.innerHTML = msg
                        span.appendChild(div)
                        div.addEventListener("mouseover", function() {
                            clearTimeout(msgTimer)
                        })
                        div.addEventListener("mouseout", function() {
                            msgTimer = setTimeout(function() {
                                span.removeChild(div);
                            }, 2000)
                        })
                    }
                }
                msgTimer = setTimeout(function() {
                    span.removeChild(div)
                }, 2000)
            }
        }, 300)
    },false)

    //setToolBtn(0)

    function setToolBtn(reTryCounts){
        if(reTryCounts <= 50){
            setTimeout(() => {
                let toolbar = document.getElementsByClassName("content-box")[0];
                if(toolbar){
                    let doc = document.head || document.documentElement
                    doc.appendChild(myStyle)
                    toolbar.prepend(btnplugin)
                    reTryCounts = 0
                }
                else{
                    reTryCounts += 1
                    setToolBtn(reTryCounts)
                }
            }, 2000)
        }
    }

    function spreadGlobalConfig(){
        const sp = getSp()
        let sh = sp.getActiveSheet()
        sh.options.isProtected = false
    }

    function bindNewRowUnlockCell(){
        const sp = getSp()
        sp.bind(GC.Spread.Sheets.Events.RowHeightChanged,function(event,data){
            let sh = sp.getActiveSheet()
            console.log(event)
            sh.options.isProtected = false
        })
        sp.bind(GC.Spread.Sheets.Events.SelectionChanged,function(event,data){
            let sh = sp.getActiveSheet()
            event.options.isProtected = false
        })
    }

    function unlockToolBar(){
        const inputBar = document.getElementsByClassName("spread-tool")[0].querySelector("input")
        inputBar.className ="ant-input"
        inputBar.removeAttribute("disabled")
    }

    function lockToolBar(){
        const inputBar = document.getElementsByClassName("spread-tool")[0].querySelector("input")
        inputBar.classList.add ="ant-input-disabled"
        inputBar.setAttribute("disabled", "disabled")
    }

    function setValue(para){
        const sp = getSp()
        stopUpdate(sp)
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        setToolBarValue(sh,!para)
        selCells.forEach((e) => {
            sh.getRange(e.row,e.col,e.rowCount,e.colCount).value(para)
        })
        startUpdate(sp)
    }

    function setFormula(para){
        const sp = getSp()
        stopUpdate(sp)
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        setToolBarValue(sh,!para)
        selCells.forEach((e) => {
            sh.setArrayFormula(e.row,e.col,e.rowCount,e.colCount,para,null)
        })
        startUpdate(sp)
    }

    function cleanDataValidator(){
        const sp = getSp()
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        selCells.forEach((e) => {
            sh.setDataValidator(e.row,e.col,e.rowCount,e.colCount,null)
        })
    }

    function getDataValidator(){
        const sp = getSp()
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        let data = []
        const dvTempHtml = `
        <div class="tm-modal-content">
            <div class="tm-modal-header">
                <h2 class="tm-modal-title">数据校验清单</h2>
                <span class="tm-modal-close">&times;</span>
            </div>
            <div class="tm-table-container">
                <table class="tm-table">
                    <thead>
                        <tr id="tableHeader"></tr>
                    </thead>
                    <tbody id="tableBody"></tbody>
                </table>
            </div>
            <div class="tm-modal-footer">
                <button class="tm-btn" id="okBtn">关闭</button>
            </div>
        </div>
        `
        let container = document.getElementById('dvListModal')
        if(container){container.innerHTML=''}else{
            container = document.createElement("div");
            container.id = 'dvListModal'
            container.classList.add("tm-modal")
        }
        container.innerHTML = dvTempHtml
        document.body.appendChild(container)
        const closeBtn = document.querySelector('.tm-modal-close');
        const okBtn = document.getElementById('okBtn');
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');

        selCells.forEach((e) => {
            for(let i = e.row; i < e.row + e.rowCount;i++){
                for(let j = e.col; j < e.col + e.colCount;j++){
                    let dvObj = {}
                    dvObj.dv = sh.getDataValidator(i,j)
                    if(dvObj.dv){
                        dvObj.rng = getRangeAddress(sh.getCell(i,j))
                        dvObj.inputTitle = dvObj.dv.inputTitle()
                        dvObj.inputMessage = dvObj.dv.inputMessage()
                        dvObj.errorTitle = dvObj.dv.errorTitle()
                        dvObj.errorMessage = dvObj.dv.errorMessage()
                        dvObj.errorStyle = enumErrorStyle[dvObj.dv.errorStyle()]
                        dvObj.dvtype = enumTypes[dvObj.dv.type()]
                        dvObj.comparisonOperator = enumOperators[dvObj.dv.comparisonOperator()]
                        dvObj.highlightStyle = enumHighlightType[dvObj.dv.highlightStyle().type]
                        dvObj.ignoreBlank = enumTrueFalse[dvObj.dv.ignoreBlank()]
                        dvObj.inCellDropdown = enumTrueFalse[dvObj.dv.inCellDropdown()]
                        if(dvObj.dv.type()!==7){
                            dvObj.formulaStr = ""
                        }else{
                            dvObj.formulaStr = dvObj.dv.condition().getFormulaString()? dvObj.dv.condition().getFormulaString() : ""
                        }
                        try {
                            dvObj.validList = dvObj.dv.getValidList() ? dvObj.dv.getValidList(): ""
                        } catch (error) {
                            dvObj.validList = dvObj.dv.condition().getFormulaString() ? dvObj.dv.condition().getFormulaString() : ""
                            dvObj.formulaStr = ""
                        }
                        dvObj.value1 = dvObj.formulaStr || dvObj.validList ? "" :dvObj.dv.value1()
                        dvObj.value2 = dvObj.formulaStr || dvObj.validList ? "" :dvObj.dv.value2()
                        data.push(dvObj)
                    }
                }
            }
        })
        if(data.length){
            const headers = ['序号', '单元格', '提示标题','提示消息', '类型', '操作符', '忽略空值', '提供下拉按钮', '错误类型', '错误标题', '错误消息', '高亮样式', '最小值', '最大值', '公式', '序列'];
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                if (header === '公式') {
                    const resizeHandle = document.createElement('div');
                    resizeHandle.className = 'tm-resize-handle';
                    resizeHandle.addEventListener('mousedown', (e) => {
                        const startX = e.clientX;
                        const startWidth = th.offsetWidth;
                        const onMouseMove = (moveEvent) => {
                            const dx = moveEvent.clientX - startX;
                            th.style.width = `${startWidth + dx}px`;
                            const formulaCells = document.querySelectorAll('.tm-formula-cell');
                            formulaCells.forEach((cell) => {
                                cell.style.maxWidth = `${startWidth + dx}px`;
                            });
                        };
                        const onMouseUp = () => {
                            document.removeEventListener('mousemove', onMouseMove);
                            document.removeEventListener('mouseup', onMouseUp);
                        };
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                    });
                    th.appendChild(resizeHandle);
                }
                tableHeader.appendChild(th);
            });
            let orderNum = 1
            data.forEach(item => {
                const row = document.createElement('tr');
                const values = [orderNum++,item.rng, item.inputTitle,item.inputMessage, item.dvtype, item.comparisonOperator,
                                item.ignoreBlank,item.inCellDropdown,item.errorStyle,item.errorTitle,item.errorMessage,
                                item.highlightStyle,item.value1,item.value2,item.formulaStr,item.validList];
                values.forEach((value,index) => {
                    const td = document.createElement('td');
                    td.textContent = value || '';
                    if(index === 14){
                        td.title = value;
                        const copyIcon = document.createElement('span');
                        copyIcon.className = 'tm-copy-icon';
                        copyIcon.textContent = '📋';
                        copyIcon.addEventListener('click',async function(){
                            const value = td.textContent.replace('📋', '').trim();
                            try {
                                await navigator.clipboard.writeText(value);
                            } catch (err) {
                                console.log(err)
                                const textarea = document.createElement('textarea');
                                textarea.value = value;
                                document.body.appendChild(textarea);
                                textarea.select();
                                document.execCommand('copy');
                                document.body.removeChild(textarea);
                            }
                        })
                        td.appendChild(copyIcon)
                        td.classList.add('tm-formula-cell');
                    }
                    row.appendChild(td);
                });
                tableBody.appendChild(row);
            });

            tableBody.addEventListener('click', function (event) {
                if (event.target.tagName === 'TD') {
                    const rows = tableBody.querySelectorAll('tr');
                    rows.forEach(row => {
                        row.classList.remove('selected');
                    });
                    const clickedRow = event.target.parentNode;
                    clickedRow.classList.add('selected');
                }
            });


        }
        const closeModal = () => {
            container.style.display = 'none';
        };

        let isDragging = false;
        let offsetX, offsetY;
        const modalHeader = document.querySelector('.tm-modal-header')
        const modalFooter = document.querySelector('.tm-modal-footer')
        modalHeader.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
        });

        modalFooter.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
        });

        closeBtn.addEventListener('click', closeModal);
        okBtn.addEventListener('click', closeModal);
        container.style.display = 'block';
    }

    function getRangeAddress(rng){
        let addressValue = GC.Spread.Sheets.CalcEngine.rangeToFormula(rng, 0, 0, GC.Spread.Sheets.CalcEngine.RangeReferenceRelative.allRelative)
        return addressValue
    }

    function lockCell(para){
        const sp = getSp()
        stopUpdate(sp)
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        let bgColor = unlockColor
        if(para){
            bgColor = lockColor
        }
        selCells.forEach((e) => {
            sh.getRange(e.row,e.col,e.rowCount,e.colCount).locked(para)
            sh.getRange(e.row,e.col,e.rowCount,e.colCount).backColor(bgColor)
        })
        startUpdate(sp)
    }

    function isShowFormula(){
        const sp = getSp()
        let sh = sp.getActiveSheet()
        sh.options.showFormulas = !sh.options.showFormulas
        if(sh.options.showFormulas){
            btn10.innerText = "隐藏公式"
        }
        else{
            btn10.innerText = "显示公式"
        }
    }

    function setRowColVisible(para){
        const sp = getSp()
        stopUpdate(sp)
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        selCells.forEach((e) => {
            if((e.row + e.col) == -2){
                sh.getRange(e.row,0,1,sh.getColumnCount()).visible(para)
                sh.getRange(0,e.col,sh.getRowCount(),1).visible(para)
            }
            else {
                sh.getRange(e.row,e.col,e.rowCount,e.colCount).visible(para)
            }
        })
        startUpdate(sp)
    }

    function insertRow(para){
        const sp = getSp()
        stopUpdate(sp)
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        let count = parseInt(para)
        selCells.forEach((e) => {
            sh.addRows(e.row + 1,count)
        })
        startUpdate(sp)
    }

    function insertCol(para){
        const sp = getSp()
        stopUpdate(sp)
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        let count = parseInt(para)
        selCells.forEach((e) => {
            sh.addColumns(e.col + 1,count)
        })
        startUpdate(sp)
    }

    function showValueAndFormula(){
        const sp = getSp()
        const inputBar = document.getElementsByClassName("spread-tool")[0].querySelector("input")
        let inputBarVal = document.getElementsByClassName("spread-tool")[0].querySelector("#inputBarVal")
        inputBar.parentNode.style.display = 'flex'
        let sh = sp.getActiveSheet()
        inputBar.style.width = '50%'
        if(!inputBarVal){
            inputBarVal = inputBar.cloneNode()
            inputBarVal.id = 'inputBarVal'
            inputBarVal.style.width = '50%'
            inputBarVal.classList.add('ant-input-disabled')
            inputBarVal.disabled = 'disabled'
            inputBar.parentNode.appendChild(inputBarVal)
        }
        setToolBarValue(sh,false)
        sh.bind(GC.Spread.Sheets.Events.SelectionChanged,function (sender,rng) {
            setToolBarValue(sh,false)
            sh.options.isProtected = false
        })
    }

    function turnOnFormulaRef(){
        const sp = getSp()
        let sh = sp.getActiveSheet()
        sh.bind(GC.Spread.Sheets.Events.SelectionChanged,function (sender,rng) {
            showPrecedents(sp,sh,rng)
            sh.options.isProtected = false
        })
    }

    function showPrecedents(sp,sh,rng){
        let newChildNodes = []
        let oldChildNodes = []
        let currChildNodes = []
        let colorInfo = {}
        try {
            newChildNodes = sh.getPrecedents(rng.newSelections[0].row, rng.newSelections[0].col)
        } catch (error) {

        }

        try {
            oldChildNodes = sh.getPrecedents(rng.oldSelections[0].row, rng.oldSelections[0].col)
        } catch (error) {

        }

        if(oldColor.length > 0){
            for(let i = 0;i<oldColor.length;i++){
                let tarSh = sp.getSheetFromName(oldColor[i].sh)
                try{
                    tarSh.getRange(oldColor[i].row,oldColor[i].col,oldColor[i].rowCount,oldColor[i].colCount).backColor(oldColor[i].color)
                }
                catch(error){

                }
            }
            oldColor = []
        }
        if (newChildNodes.length > 0) {
            newChildNodes.forEach((e)=>{
                oldColor.push({row:e.row,col:e.col,rowCount:e.rowCount,colCount:e.colCount,color:sh.getCell(e.row,e.col).backColor(),sh:e.sheetName})
                let tarSh = sp.getSheetFromName(e.sheetName)
                tarSh.getRange(e.row,e.col,e.rowCount,e.colCount).backColor('red')
            })
        }
    }

    function setToolBarValue(sh,isClean){
        if (isDesigner){return}
        const inputBar = document.getElementsByClassName("spread-tool")[0].querySelector("input")
        const inputBarVal = document.getElementsByClassName("spread-tool")[0].querySelector("#inputBarVal")
        let row = sh.getActiveRowIndex()
        let col = sh.getActiveColumnIndex()
        if(sh.hasFormula(row,col)){
            isClean ? inputBar.value = "" : inputBar.value = sh.getFormula(row,col)
            if(inputBarVal){
                inputBar.style.width = '50%'
                inputBarVal.value = sh.getValue(row,col)
                inputBarVal.style.width = '50%'
            }
        }else{
            isClean ? inputBar.value = "" : inputBar.value = sh.getValue(row,col)
            if(inputBarVal){
                inputBar.style.width = '50%'
                inputBarVal.style.width = '50%'
                inputBarVal.value = inputBar.value
            }
        }
    }

    function isShowTableHeader(){
        const sp = getSp()
        let sh = sp.getActiveSheet()
        let tables = sh.tables.all()
        //         btn15.innerText = "显示表头"
        for(let i = 0; i < tables.length; i++){
            let startRow = sh.tables.all()[i].startRow()
            if(tables[i].hasHeadersRow()){
                tables[i].showHeader(false)
                //                 btn15.innerText = "显示表头"
                sh.deleteRows(startRow,1)
            }else{
                sh.addRows(startRow,1)
                tables[i].showHeader(true)
                //                 btn15.innerText = "隐藏表头"
            }
        }
    }

    function showIndiDim(){
        const sp = getSp()
        let reportInfoVue = document.querySelector('.form-box').__vue__
        let reportForm = reportInfoVue._data.reportForm
        if(!reportForm){return}
        let uri = "/sctj/api/companyReportVersion/selectAllSheet"
        let xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        let data = JSON.stringify({
            "reportCodeEq":reportForm.reportCode,
            "orgCodeEq": reportForm.orgCode,
            "versionEq":reportForm.version
        })
        let token = getCookie("Spss-Prod-Access-Token") || getCookie("Spss-Test-Access-Token") || getCookie("Spss-Train-Access-Token")
        let refreshToken = getCookie("Spss-Prod-Refresh-Token") || getCookie("Spss-Test-Refresh-Token") || getCookie("Spss-Train-Refresh-Token")
        let resultData={}
        let dataList = []
        if(sp){
            let sh = sp.getActiveSheet()
            let selCells = sh.getSelections()
            let mgcIndex = sh.tables.all()[0].getColumnIndexInTable("materialGroupCode")
            let rowMaterialGroupCode = sh.getValue(selCells[0].row,mgcIndex)
            let colField = sh.tables.all()[0].getColumnDataField(selCells[0].col)
            selCells.forEach((e) => {

            })

            xhr.addEventListener("readystatechange", function() {
                if(this.readyState === 4) {
                    resultData = JSON.parse(this.responseText).data
                    for(let i = 0; i <resultData.length;i++){
                        if(resultData[i].hasOwnProperty("dto") && resultData[i].dto.hasOwnProperty("dataList")){
                            dataList = resultData[i].dto.dataList
                            let r1 = dataList.filter(e=>{return e.materialGroupCode === rowMaterialGroupCode})
                            if(r1.length>0){
                                let resultStr = ""
                                if(r1[0][colField].hasOwnProperty('indicatorCode')){
                                    resultStr += "指标：" + r1[0][colField].indicatorCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('dimensionPeriodCode')){
                                    resultStr += "期间：" + r1[0][colField].dimensionPeriodCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('dimensionConstituteCode')){
                                    resultStr += "产品分类：" + r1[0][colField].dimensionConstituteCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('dimensionBlockCode')){
                                    resultStr += "区块：" + r1[0][colField].dimensionBlockCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('dimensionAreaCode')){
                                    resultStr += "地区：" + r1[0][colField].dimensionAreaCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('dimensionAssessCode')){
                                    resultStr += "评估类型：" + r1[0][colField].dimensionAssessCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('dimensionDistributionCode')){
                                    resultStr += "分销渠道：" + r1[0][colField].dimensionDistributionCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('dimensionPlateCode')){
                                    resultStr += "板块：" + r1[0][colField].dimensionPlateCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('dimensionCooperateCode')){
                                    resultStr += "合作方式：" + r1[0][colField].dimensionCooperateCode + "\n"
                                }
                                if(r1[0][colField].hasOwnProperty('selfFormula')){
                                    resultStr += "自定义公式：" + "\n" + r1[0][colField].selfFormula.type + "\n" + r1[0][colField].selfFormula.dataKey
                                }
                                if(resultStr !=""){
                                    let comment = new GC.Spread.Sheets.Comments.Comment()
                                    comment.text(resultStr)
                                    comment.backColor("yellow")
                                    comment.foreColor("green")
                                    comment.displayMode(GC.Spread.Sheets.Comments.DisplayMode.alwaysShown)
                                    comment.dynamicMove(true)
                                    comment.dynamicSize(true)
                                    comment.lockText(false)
                                    comment.locked(false)
                                    sh.getCell(selCells[0].row,selCells[0].col).comment(comment)
                                }
                            }
                        }
                    }
                }
            })
            xhr.open("POST", uri)
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.setRequestHeader("Authorization", "Bearer " + token)
            xhr.send(data)
        }
    }

    function getCookie(name) {
        let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

    function getRefreshToken(refreshToken){
        let fData = new FormData()
        fData.append("refreshToken",refreshToken)
        let xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                console.log(this.responseText);
            }
        })
        xhr.open("POST", "/sctj/api/auth/refreshToken")
        xhr.send(fData)
    }

    function getSp() {
        let spread
        try {
            if ((spread = GC.Spread.Sheets.findControl(container)) !== null) {
                if (spread !== undefined) {
                    isDesigner = false
                    return spread;
                }
            }
        } catch (error) {

        }

        try {
            if ((spread = GC.Spread.Sheets.findControl(document.getElementsByClassName(containerCls)[0])) !== null) {
                if (spread !== undefined) {
                    isDesigner = false
                    return spread;
                }
            }
        } catch (error) {

        }

        try {
            if ((spread = GC.Spread.Sheets.Designer.findControl(containerDesign)) !== null) {
                if (spread.Spread !== undefined) {
                    isDesigner = true
                    return spread.Spread;
                }
            }
        } catch (error) {

        }

        try {
            if ((spread = GC.Spread.Sheets.Designer.findControl(document.getElementsByClassName(containerDesignCls)[0])) !== null) {
                if (spread.Spread !== undefined) {
                    isDesigner = true
                    return spread.Spread;
                }
            }
        } catch (error) {

        }
    }

    function addCustomMenu(vueSp){
        const sp = vueSp
        let commandManager
        let customMenu = [
            {
                text: '锁定/解锁',
                name: 'zLockOnOff',
                workArea: 'viewport',
                command: "zLockOnOff",
                iconClass:"gc-spread-locked",
                subMenu:[
                    {
                        text: '锁定单元格(Ctrl+L)',
                        name: 'zLockCell',
                        workArea: 'viewport',
                        command: "zLockCell",
                        iconClass: "ribbon-control-dropdown-lockcells"
                    },
                    {
                        text: '解锁单元格(Ctrl+K)',
                        name: 'zUnLockCell',
                        workArea: 'viewport',
                        command: "zUnLockCell",
                        iconClass: "gc-spread-editComment"
                    }
                ]
            },
            {
                text: '清除',
                name: 'zCleanContentFormulaVal',
                workArea: 'viewport',
                command: "zCleanContentFormulaVal",
                subMenu:[
                    {
                        text: '清除值(Ctrl+Shift+G)',
                        name: 'zCleanValue',
                        workArea: 'viewport',
                        command: "zCleanValue",
                        iconClass:"ribbon-button-clear-table-style-element"
                    },
                    {
                        text: '清除公式 (Ctrl+Shift+H)',
                        name: 'zCleanFormula',
                        workArea: 'viewport',
                        command: "zCleanFormula",
                        iconClass: "gc-spread-removeHyperlink"
                    },
                    {
                        text: '清除内容 (Ctrl+Shift+J)',
                        name: 'zCleanContent',
                        workArea: 'viewport',
                        command: "zCleanContent",
                        iconClass:"ribbon-button-clearall"
                    }
                ]
            },
            {
                text: '数据有效性',
                name: 'zDataValidatorMenu',
                workArea: 'viewport',
                command: "zDataValidatorMenu",
                subMenu:[
                    {
                        text: '数据有效性',
                        name: 'zDataValidator',
                        workArea: 'viewport',
                        command: "zDataValidator",
                        iconClass: "ribbon-button-datavalidation"
                    },
                    {
                        text: '清除校验',
                        name: 'zCleanDataValidator',
                        workArea: 'viewport',
                        command: "zCleanDataValidator",
                        iconClass: "ribbon-control-dropdown-clear-rules"
                    },
                ]
            },
            {
                text: '公式',
                name: 'zFormulaMenu',
                workArea: 'viewport',
                command: "zFormulaMenu",
                subMenu:[
                    {
                        text: '显示/隐藏公式(Ctrl+O)',
                        name: 'zShowFormula',
                        workArea: 'viewport',
                        command: "zShowFormula",
                        iconClass: "ribbon-show-formulas"
                    },
                    {
                        text: '工具栏增强(Ctrl+I)',
                        name: 'zShowFormulaVal',
                        workArea: 'viewport',
                        command: "zShowFormulaVal",
                        iconClass: "ribbon-button-textfunction"
                    },
                    {
                        text: '开启公式追踪',
                        name: 'zRefRange',
                        workArea: 'viewport',
                        command: "zRefRange",
                        iconClass: "gc-spread-link"
                    }
                ]
            },
            {
                text: '隐藏/显示',
                name: 'zVisibleMenu',
                workArea: 'viewport',
                command: "zVisibleMenu",
                subMenu:[
                    {
                        text: '隐藏行列(Ctrl+Y)',
                        name: 'zHideRowCol',
                        workArea: 'viewport',
                        command: "zHideRowCol",
                        iconClass: "gc-spread-pivotCollapse"
                    },
                    {
                        text: '取消隐藏(Ctrl+U)',
                        name: 'zShowRowCol',
                        workArea: 'viewport',
                        command: "zShowRowCol",
                        iconClass: "gc-spread-pivotExpand"
                    }
                ]
            },
            {
                text: '插入',
                name: 'zInsertRowCol',
                workArea: 'viewport',
                command: "zInsertRowCol",
                subMenu:[
                    {
                        text: '向后插入列',
                        name: 'zInsertCol',
                        workArea: 'viewport',
                        command: "zInsertCol",
                        iconClass:"gc-spread-tableInsertColumnsRight"
                    },
                    {
                        text: '向下插入行',
                        name: 'zInsertRow',
                        workArea: 'viewport',
                        command: "zInsertRow",
                        iconClass:"gc-spread-tableInsertRowsBelow"
                    }
                ]
            },
            {
                text: '冻结窗格',
                name: 'zFreezePaneMenu',
                workArea: 'viewport',
                command: "zFreezePaneMenu",
                subMenu:[
                    {
                        text: '冻结窗格(Ctrl+E)',
                        name: 'zFreezePane',
                        workArea: 'viewport',
                        command: "zFreezePane",
                        iconClass:"ribbon-button-freezepane"
                    },
                    {
                        text: '冻结底部(Ctrl+B)',
                        name: 'zFreezePaneTail',
                        workArea: 'viewport',
                        command: "zFreezePaneTail",
                        iconClass:"ribbon-button-freezepane"
                    },
                    {
                        text: '取消冻结(Ctrl+M)',
                        name: 'zUnFreezePane',
                        workArea: 'viewport',
                        command: "zUnFreezePane",
                        iconClass:"ribbon-button-unfreezepane"
                    }
                ]
            },
            {
                text: '显示/隐藏表头(Ctrl+P)',
                name: 'zShowTableHeader',
                workArea: 'viewport',
                command: "zShowTableHeader",
                iconClass:"gc-spread-Totals"
            },
            {
                text: '指标维度(Ctrl+Q)',
                name: 'zShowIndiDim',
                workArea: 'viewport',
                command: "zShowIndiDim",
                iconClass:"ribbon-control-dropdown-datalabels-show"
            }
        ]

        if(sp){
            //          解锁单元格
            sp.commandManager().register("zUnLockCell",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zUnLockCell";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        lockCell(false)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            // isCtrl, isShift, isAlt, isMeta
            // ctrl?	boolean	为true时, 命令需要 Ctrl 键; 若 false则不需要
            // shift?	boolean	为true时, 命令需要 Shift 键; 若 false则不需要
            // alt?	boolean	为true时, 命令需要 Alt 键; 若 false则不需要
            // meta?	boolean	为true时, 命令需要Mac上的Command键或Windows上的Windows键；若 false则不需要
            sp.commandManager().setShortcutKey('zUnLockCell', 'K', true, false, false, false)
            //          锁定单元格
            sp.commandManager().register("zLockCell",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zLockCell";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        lockCell(true)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zLockCell', 'L', true, false, false, false)
            //          显示/隐藏公式
            sp.commandManager().register("zShowFormula",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zShowFormula";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        isShowFormula()
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zShowFormula', 'O', true, false, false, false)
            //          工具栏显示公式和值
            sp.commandManager().register("zShowFormulaVal",
                                         {
                canUndo: false,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zShowFormulaVal";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        showValueAndFormula()
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zShowFormulaVal', 'I', true, false, false, false)
            //          公式追踪
            sp.commandManager().register("zRefRange",
                                         {
                canUndo: false,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zRefRange";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        turnOnFormulaRef()
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            //          数据有效性
            sp.commandManager().register("zDataValidator",
                                         {
                canUndo: false,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zDataValidator";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        getDataValidator()
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            //          清除校验
            sp.commandManager().register("zCleanDataValidator",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zCleanDataValidator";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        cleanDataValidator()
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            //          清除值
            sp.commandManager().register("zCleanValue",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zCleanValue";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        setValue(null)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zCleanValue', 'G', true, true, false, false)
            //          清除公式
            sp.commandManager().register("zCleanFormula",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zCleanFormula";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        setFormula(undefined)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zCleanFormula', 'H', true, true, false, false)
            //          清除内容
            sp.commandManager().register("zCleanContent",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zCleanContent";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        setFormula(undefined)
                        setValue(null)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zCleanContent', 'J', true, true, false, false)
            //          隐藏行列
            sp.commandManager().register("zHideRowCol",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zHideRowCol";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        setRowColVisible(false)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zHideRowCol', 'Y', true, false, false, false)
            //          取消隐藏
            sp.commandManager().register("zShowRowCol",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zShowRowCol";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        setRowColVisible(true)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zShowRowCol', 'U', true, false, false, false)
            //          向后插入列
            sp.commandManager().register("zInsertCol",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zInsertCol";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        insertCol(1)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            //          向后插入行
            sp.commandManager().register("zInsertRow",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zInsertRow";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        insertRow(1)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            //          冻结窗格
            sp.commandManager().register("zFreezePane",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zFreezePane";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        setFreezePane(true,1,1,0,0)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zFreezePane', 'E', true, false, false, false)
            //          冻结尾行尾列
            sp.commandManager().register("zFreezePaneTail",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zFreezePaneTail";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        setFreezePane(true,0,0,1,1)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zFreezePaneTail', 'B', true, false, false, false)
            //          取消冻结
            sp.commandManager().register("zUnFreezePane",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zUnFreezePane";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        setFreezePane(false,1,1,1,1)
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zUnFreezePane', 'M', true, false, false, false)
            //          显示/隐藏表头
            sp.commandManager().register("zShowTableHeader",
                                         {
                canUndo: true,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zShowTableHeader";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        isShowTableHeader()
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zShowTableHeader', 'P', true, false, false, false)
            //          指标维度
            sp.commandManager().register("zShowIndiDim",
                                         {
                canUndo: false,
                execute: function (context, options, isUndo) {
                    let Commands = GC.Spread.Sheets.Commands;
                    options.cmd = "zShowIndiDim";
                    if (isUndo) {
                        Commands.undoTransaction(context, options);
                        return true;
                    } else {
                        Commands.startTransaction(context, options);
                        showIndiDim()
                        Commands.endTransaction(context, options);
                        return true;
                    }
                }
            })
            sp.commandManager().setShortcutKey('zShowIndiDim', 'Q', true, false, false, false)
            //          添加菜单
            if(customMenu.length > 0){
                for(let i = 0;i < customMenu.length;i++){
                    sp.contextMenu.menuData.push(customMenu[i])
                }
            }
        }
    }

    function setFreezePane(isFreeze,row,col,trailingRow,trailingCol){
        const sp = getSp()
        let sh = sp.getActiveSheet()
        let selCells = sh.getSelections()
        if(isFreeze){
            if(selCells.length > 0){
                if(row == 1){
                    sh.frozenRowCount(selCells[0].row)
                }
                if(col == 1){
                    sh.frozenColumnCount(selCells[0].col)
                }
                if(trailingRow == 1){
                    if(selCells[0].row != -1){
                        sh.frozenTrailingRowCount(sh.getRowCount() - selCells[0].row)
                    }
                }
                if(trailingCol == 1){
                    if(selCells[0].col != -1){
                        sh.frozenTrailingColumnCount(sh.getColumnCount() - selCells[0].col)
                    }
                }
            }
        }else{
            if(row == 1){
                sh.frozenRowCount(null)
            }
            if(col == 1){
                sh.frozenColumnCount(null)
            }
            if(trailingRow == 1){
                sh.frozenTrailingRowCount(null)
            }
            if(trailingCol == 1){
                sh.frozenTrailingColumnCount(null)
            }
        }
    }

    function stopUpdate(sp){
        sp.suspendPaint()
        sp.suspendEvent()
        sp.suspendCalcService(true)
    }

    function startUpdate(sp){
        sp.resumeCalcService(true)
        sp.resumeEvent()
        sp.resumePaint()
    }

    /* end：SpreadJS */
})();