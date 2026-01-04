// ==UserScript==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @name         pkuElective自动翻页
// @version      0.1
// @description  no description
// @author       test12345
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/*
// @grant        none
// @license      MIT
// @namespace    test12345
// @downloadURL https://update.greasyfork.org/scripts/440262/pkuElective%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/440262/pkuElective%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

'use strict';

const headersOfCurrentPage = Object.fromEntries(new Map(document.location.search.slice(1).split('&').map(x => x.split('='))));
const studentId = headersOfCurrentPage.xh;

async function main(){
    const electiveTable = $("table.datagrid")[0];
    const tableHeader = electiveTable.children[0].children[0];
    function parseTable(table){
        const linesInTable = Array.prototype.slice.call(table.children[0].children);
        const pageInformation = linesInTable.at(-1).children[0].childNodes[0].data.split(' '); // ['Page', '*', 'of', '*']
        return {
            pageId: parseInt(pageInformation[1]),
            pageNumber: parseInt(pageInformation[3]),
            content: linesInTable.slice(1,-2),
        }
    }
    const pageNumber = parseTable(electiveTable).pageNumber;
    let allPageTableBody = Array(pageNumber), promiseList = [];
    for(let i=0;i<pageNumber;++i){
        promiseList.push(
            $.get(`https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/supplement.jsp?netui_pagesize=electableListGrid%3B20&xh=${studentId}&netui_row=electableListGrid%3B` + (20*i))
            .done((data) => {
                const parsedTable = parseTable($('table.datagrid',data)[0]);
                allPageTableBody[parsedTable.pageId - 1] = parsedTable.content;
            })
        );
    }
    await Promise.all(promiseList);
    $(electiveTable).html('<table><tbody>' + '<tr class="datagrid-header">' + $(tableHeader).html() + '</tr>' +
                          allPageTableBody.flat().map((x, index) => `<tr class="${(index & 1)? 'datagrid-odd' : 'datagrid-even'}">` + $(x).html() + '</tr>').join('') +
                          '</table></tbody>');
};

main();