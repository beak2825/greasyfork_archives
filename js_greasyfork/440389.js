// ==UserScript==
// @name         图书馆SS显示
// @namespace    book.ucdrs
// @version      0.4.0
// @description  查询全国图书馆参考咨询联盟中图书的SS, 并生成文件名
// @author       wenmin92
// @match        *://book.ucdrs.superlib.net/search*
// @match        *://book.ucdrs.superlib.net/views/specific/*
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440389/%E5%9B%BE%E4%B9%A6%E9%A6%86SS%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/440389/%E5%9B%BE%E4%B9%A6%E9%A6%86SS%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


function insertBefore(parent, prefix, content, nodeType = 'dd') {
    const html = `<${nodeType} class="custom-field">
        <span style="user-select:none">${prefix}</span><span style="user-select:all">${content}</span>
    </${nodeType}>`
    $(parent).prepend(html);
}

function insertAfter(parent, prefix, content, nodeType = 'dd') {
    const html = `<${nodeType} class="custom-field">
        <span style="user-select:none">${prefix}</span><span style="user-select:all">${content}</span>
    </${nodeType}>`
    $(parent).append(html);
}

function makeFileName() {
    let name = document.querySelector('#paper_one > input[name=title]').value;
    if (/第.版/.test(name)) {
        name = name.replace(/\s*(第.版)\s*/, ' ($1)');
    }
    const content = document.querySelector('#paper_one > input[name=content]').value;
    let author = content.match(/【作　者】(.*)\n/)?.[1].replace(/；|，/g, ', ').replace(/（(.{1,3})）/g, '[$1]').replace(/（(.{3,}?)）/g, '') ?? 'null';
    let publisher = content.match(/【出版项】(.*)\n/)?.[1].replace(/^.*?：/, '').match(/(.*?),/)[1] ?? 'null';
    let publishDate = content.match(/【出版项】(.*)\n/)?.[1].replace(/^.*?：/, '').match(/,([\d.]+)/)[1] ?? 'null';
    let pages = content.match(/【形态项】(\d+)/)?.[1] ?? 'null';
    return `${name}, ${author}, ${publisher}, ${publishDate}, ${pages}P`;
}

function insertCleanISBN(parent) {
    const content = document.querySelector('#paper_one > input[name=content]').value;
    const cleanISBN = content.match(/【ISBN号】([-\dxX]*)\n/)[1].replace(/-/g, '');
    const elISBN = Array.from(parent.children).find(it => it.textContent.includes('【ISBN号】'));
    elISBN?.append(` (${cleanISBN})`);
}

function doSpecific() {
    const el = document.querySelector('script[language]:not([src])');
    const bookInfo = document.querySelector('.tubox dl');

    if (el) {
        insertBefore(bookInfo, '【文件名】', makeFileName());
        const ss = el.innerText.match(/ssn=(\d{3,})/)?.[1];
        let dx = ''
        if (ss) {
            insertBefore(bookInfo, '【SS】', ss);
        } else if(dx = location.href.match(/dxNumber=(\d+)/)?.[1]) {
            insertBefore(bookInfo, '【DX】', dx);
        }
        insertCleanISBN(bookInfo);
    }
}

function doSearch() {
    document.querySelectorAll('td[id="b_img"]').forEach(item => {
        const ss = item.parentElement.querySelector('input[name*="ssid"]').value;
        if (ss) {
            insertAfter($(item).next(), 'SS:', ss);
        } else {
            const dxNumber = item
                .querySelector('a[href*="dxNumber"]')
                .getAttribute('href')
                .match(/dxNumber=(\d+)/)?.[1];
            dxNumber && insertAfter($(item).next(), 'DX:', dxNumber);
        }
    });
}

function showChangeYearBtn() {
    const yearSection = Array.from(document.querySelectorAll('#leftcat')).find(it => it.innerHTML.includes('年代'));

    // 整理容器中已有的内容
    yearSection.innerHTML = yearSection.innerHTML.replace(/(&nbsp;){3,}/g, '&nbsp;&nbsp;').replace('</a>&nbsp;&nbsp;<a', '</a><br>&nbsp;&nbsp;<a');

    // 只有在查看特定年份时才显示按钮
    if (!location.href.includes('year=')) {
        return;
    }

    const year = parseInt(yearSection.innerHTML.match(/\d{4}/)[0]);

    // 添加按钮
    const buttons = document.createElement('div');

    buttons.style.cssText = 'display: inline-block; margin-left: 8px;';
    const btnPrev = document.createElement('span');
    btnPrev.style.cssText = 'cursor: pointer; color: #fff; background-color: cadetblue; padding: 1px 3px; border-radius: 2px; margin: 0px 2px; font-weight: bold;';
    btnPrev.addEventListener('click', () => {
        location = location.href.replace(/year=\d{4}/, `year=${year - 1}`).replace(/&Pages=\d+/, '&Pages=1');;
    });
    btnPrev.innerHTML = '&lt;';
    buttons.append(btnPrev);

    const btnNext = document.createElement('span');
    btnNext.style.cssText = 'cursor: pointer; color: #fff; background-color: cadetblue; padding: 1px 3px; border-radius: 2px; margin: 0px 2px; font-weight: bold;';
    btnNext.addEventListener('click', () => {
        location = location.href.replace(/year=\d{4}/, `year=${year + 1}`).replace(/&Pages=\d+/, '&Pages=1');
    });
    btnNext.innerHTML = '&gt;';
    buttons.append(btnNext);

    yearSection.append(buttons)
}


if (location.href.includes('/views/specific/')) {
    doSpecific();
} else if (location.href.includes('/search')) {
    doSearch();
    showChangeYearBtn();
}
