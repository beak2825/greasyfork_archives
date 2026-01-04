// ==UserScript==
// @name         sucem_glgj_enhance
// @namespace    http://esclt.net/
// @version      0.2.2
// @description  增强业务管理系统 管理工具 页面的功能
// @author       janken.wang@hotmail.com
// @match        http://10.0.0.205/sl/glgj.jsp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427493/sucem_glgj_enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/427493/sucem_glgj_enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** Page communicate with html document
    **/
    class Page {
        constructor(htmlDocument) {
            this.document = htmlDocument
            this.btnPositionSelector = '#minmax > tbody > tr > td > table > tbody > tr:nth-child(3) > td'
            this.tableSelector = "#minmax > tbody > tr > td > table > tbody"
        }

        /** addQueryButton insert queryBtn node to the html document
        **/
        addQueryButton(queryBtn) {
            this.document.querySelector(this.btnPositionSelector).appendChild(queryBtn)
        }

        /** addResultCell insert the cell in the table on page
        **/
        addResultCell(cell) {
            const table = this.document.querySelector(this.tableSelector)
            const row = this.document.createElement('tr').appendChild(cell)
            table.insertBefore(row, table.childNodes[5])
        }

        /** queryTmh return the 'tmh' input value from html document
        **/
        findTmh() {
            return this.document.querySelector('#tmh').value
        }
    }

    /** 同办业务的相关组件
     ** 包括：
     **  1. 业务信息查询按钮
     **  2. 显示业务信息的单元格
    **/
    class GroupBusiness {

        constructor(htmlDocument, queryPage, queryFunc) {
            this.document = htmlDocument;
            this.page = queryPage
            this.queryFunc = queryFunc
        }

        _initQueryButton() {
            const btn = this.document.createElement('button')
            btn.innerText = '查询业务信息'
            btn.style.padding = '2px 6px'
            btn.addEventListener('click', evt => {
                evt.preventDefault()
                const tmh = this.page.findTmh()
                if (tmh) {
                    this.queryFunc(tmh).then(res => res.text()).then( data => {
                        this._showResult(this._parseResponseText(data))
                    })
                }
            })

            this.page.addQueryButton(btn)
            this.queryBtn = btn
        }

        _initResultCell() {
            const cell = this.document.createElement('td')
            cell.id = "resultCell"
            cell.colSpan = 5
            // cell.style.border = "1px blue solid"
            cell.appendChild(this.document.createElement('div'))
            this.page.addResultCell(cell)

            this.cell = cell
        }

        _parseResponseText(data) {
            const p = new DOMParser();
            const h = p.parseFromString(data, 'text/html');
            return h.querySelector('#minmax > tbody > tr:nth-child(2) > td > table');
        }

        _showResult(data) {
            this.cell.replaceChild(data, this.cell.firstChild)
        }

        /** addToPage add all component to the page
        **/
        addToPage() {
            this._initQueryButton()
            this._initResultCell()
        }
    }

    /** queryInfo query the server with tmh value.
         ** return parsed the html reponse.
         ** this method is a private.
        **/
    const queryInfo = (tmh) => {
        const payload = `hpzl=02&hphm=${tmh}&cxbutton=查询`;

        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return fetch('do?act=showcx', {
            body: payload,
            method: 'POST',
            headers: headers,
            redirect: 'follow'
        })
    }

    const groupPage = new Page(document)
    const groupCompo = new GroupBusiness(document, groupPage, queryInfo)
    groupCompo.addToPage()
})();