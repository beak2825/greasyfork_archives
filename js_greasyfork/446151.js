// ==UserScript==
// @name         大未来小助手
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  录取分数查询助手
// @author       hahaha
// @license      MIT
// @match        http://www.daweilai211.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446151/%E5%A4%A7%E6%9C%AA%E6%9D%A5%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446151/%E5%A4%A7%E6%9C%AA%E6%9D%A5%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("script started");

    // Returns a Promise that resolves after "ms" Milliseconds
    const timer = ms => new Promise(res => setTimeout(res, ms))

    var createHelperButton = () => {
        // “更多”按钮前插入一个按钮
        var button = document.createElement('button');
        button.innerHTML = "显示当前所有专业";
        button.setAttribute('id', "btnShowAllMajors");
        button.onclick = expandAll;
        var header = document.querySelector('#header');
        header.append(button);

        var buttonCp = document.createElement('button');
        buttonCp.innerHTML = "拷贝当前表格";
        buttonCp.style.display = "none";
        buttonCp.onclick = copyTable;
        header.append(buttonCp);

        var buttonAutoAllPages = document.createElement('button');
        buttonAutoAllPages.id = "btn-auto-all-pages";
        buttonAutoAllPages.innerHTML = "添加表格到汇总结果";
        buttonAutoAllPages.onclick = allNextPages;
        header.append(buttonAutoAllPages);

        var buttonCopyResults = document.createElement('button');
        buttonCopyResults.id = "btn-copy-results";
        buttonCopyResults.innerHTML = "拷贝汇总结果";
        buttonCopyResults.onclick = copyResults;
        header.append(buttonCopyResults);

        var results = document.createElement('div');
        results.id = "my-results";
        results.setAttribute("style", "position: fixed; top: 10px; right: 10px; border: 1px solid #00b1f1; background-color: #aaaa; z-index: 9999; display: block; max-height: 400px; max-width:400px; overflow: scroll;");
        // results.innerHTML = "<p>结果</p>"
        results.innerHTML = htmlToElement('<table id="my-result-table"><tbody></tbody></table>').outerHTML;
        document.querySelector('body').prepend(results);
    };

    /**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
    // var td = htmlToElement('<td>foo</td>'),
    //    div = htmlToElement('<div><span>nested</span> <span>stuff</span></div>');

    /**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 */
    function htmlToElements(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.childNodes;
    }
    // var rows = htmlToElements('<tr><td>foo</td></tr><tr><td>bar</td></tr>');

    var expandAll = async () => {
        var tblRows = [...document.querySelectorAll('#xxlb>tbody>tr[id]')];
        // click
        for (var i=0; i<tblRows.length; i++) {
            var elm = tblRows[i]

            console.log(elm);

            showMajor(elm.id);
            await timer(1000);
            var td = elm.nextElementSibling;
            console.log(td);
            var tbl = td.querySelector('table');
            console.log("table:");
            console.log(tbl);
            while(tbl == null) {
                console.log("table is null, wait a sec...");
                await timer(1000);
                tbl = td.querySelector('table');
            }
            console.log("adding new cell to table");

            // remove table header
            var hd = tbl.querySelector('tr.tbhead');
            hd.remove();

            var newTd = document.createElement('td');
            newTd.setAttribute("colspan", "7");
            newTd.setAttribute("style", "display:table-cell");
            newTd.appendChild(tbl);
            elm.appendChild(newTd);
            var btn = document.querySelector('#btnShowAllMajors');
            btn.innerHTML = `显示所有专业(${i+1}/${tblRows.length})`;
        }
        // click last one again to hide the cell
        showMajor(elm.id);

        // display all
        // var tds = [...document.querySelectorAll('#xxlb>tbody>tr>td.tbzytd')];
        // tds.map(elm => {
        //     elm.style = "display:table-cell";
        // });

        // add cells
        var tds = [...document.querySelectorAll('#xxlb>tbody>tr>td.tbzytd')];
        tds.map(elm => {
            var tbl = elm.querySelector('table');
        });
    }

    var copyTable = async () => {
        var tbl = document.querySelector('table[id=xxlb]');
        console.log("processing table", tbl);
        var tblRows = [...tbl.querySelectorAll(':scope > tbody > tr[id]')];
        for (var i=0; i<tblRows.length; i++) {
            var elm = tblRows[i];
            // 院校
            var tdYuanxiao = elm.querySelector('table.majortb td.borderleftnone');
            tdYuanxiao.setAttribute('rowspan', 1);
            var sib = tdYuanxiao.parentElement.nextElementSibling;
            if (sib.children.length == (tdYuanxiao.parentElement.children.length - 1)) {
                sib.prepend(document.createElement('td'));
            }

        }
        // var tbl = document.querySelector('table[id=xxlb]');
        // 隐藏空行
        var emptyRowChildren = tbl.querySelectorAll('td.tbzytd')
        emptyRowChildren.forEach(elm => {
            if (emptyRowChildren[0].parentElement.nodeName.toLowerCase() == 'tr') {
                elm.parentElement.setAttribute("style", "display:none");
            }
        });
        // 只显示学校名称，隐藏其他（选科、城市等）
        var schoolNames = tbl.querySelectorAll('a.schoolname');
        schoolNames.forEach(elm => {
            removeNextSiblings(elm);
        });
        var areaSpans = tbl.querySelectorAll('span.fkarea');
        // console.log("areaSpans", areaSpans);
        areaSpans.forEach(elm => {
            // console.log("parent", elm.parentElement.parentElement);
            elm.parentElement.parentElement.setAttribute("style", "display:none");
        });

        // 加入城市
        var troubleCells = tbl.querySelectorAll('td.flagtd');
        troubleCells.forEach(td => {
            var city = td.previousElementSibling.querySelector('span.fkarea div.value');
            if (city==null) {
                city = td.previousElementSibling.querySelector('span.yxsx').previousElementSibling;
            }
            // console.log("haha city=", city);
            td.innerHTML=city.textContent;
            city.parentElement.setAttribute("style", "display:none");
        });
        // hide header
        var headerRow = tbl.querySelector('tr.tbhead');
        headerRow.setAttribute("style", "display:none");
        await timer(500);
        selectElementContents(tbl);
        alert("已拷贝到剪贴板");
        // 恢复？
        // headerRow.setAttribute("style", null);
        return tbl;
    }

    var allNextPages = async () => {
        var btn = document.querySelector('button#btn-auto-all-pages');

        var resultTbl = document.querySelector('#my-results > table > tbody');

        // await expandAll();
        var tbl = await copyTable();
        var tblRows = tbl.querySelector('tbody');
        console.log("tblRows ", tblRows);
        resultTbl.innerHTML = resultTbl.innerHTML + tblRows.innerHTML
        alert("添加完成");

        return;

        var activeLi = document.querySelector('div#fenyediv ul li.active');
        // there is only one page
        if (activeLi == null) {
            return;
        }
        // there is no next page
        var nextLi = activeLi.nextElementSibling;
        console.log("next page", nextLi);
        while (nextLi) {
            console.log("click...");
            nextLi.querySelector('a').click();
            // document.querySelector('table[id=xxlb]').remove();
            await timer(1000);
            btn.innerHTML = `加入结果(处理${nextLi.textContent}/N页)`
            tbl = await copyTable();
            console.log("new table", tbl);
            tblRows = tbl.querySelector('tbody');
            console.log("tblRows ", tblRows);
            resultTbl.innerHTML = resultTbl.innerHTML + tblRows.innerHTML;
            // alert("appended");

            nextLi = document.querySelector('div#fenyediv ul li.active').nextElementSibling;
            /*

            btn.innerHTML = `加入结果(${nextLi.textContent}/N页)`
            nextLi.querySelector('a').click();
            while(document.querySelectorAll('table#xxlb')) {
                await timer(1000);
            }
            tbl = await copyTable();
            tblRows = tbl.querySelector('tbody');
            resultTbl.innerHTML = resultTbl.innerHTML + tblRows.innerHTML

            nextLi = document.querySelector('div#fenyediv ul li.active').nextElementSibling;
            */
        }
        // MoreConditionSearchV1(3);
    }

    // 拷贝结果表格到剪贴板
    var copyResults = async () => {
        document.querySelector('div#my-results').style.display = "block";
        var tbl = document.querySelector('table[id=my-result-table]');
        selectElementContents(tbl);
        alert("已拷贝到剪贴板");
        return tbl;
    }

    function selectElementContents(el) {
        var body = document.body, range, sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }
        document.execCommand("Copy");
    }

    /**
    * Removes all sibling elements after specified
    * @param {HTMLElement} currentElement
    * @private
    */
    function removeNextSiblings(currentElement) {
        while (!!currentElement.nextElementSibling) {
            currentElement.nextElementSibling.remove();
        }
    }

    /*
    var main = (globalThis.main = () => {
        var urls = getImgUrls();
    });
    */

    // 页码加载完成后创建按钮
    if (location.hostname == 'www.daweilai211.com') {
        window.addEventListener('load', createHelperButton, false);
    }
})();