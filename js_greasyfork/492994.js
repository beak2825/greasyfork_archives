// ==UserScript==
// @name         🌐全国图书馆参考咨询联盟🔍📘一键查询电子版图书✔️
// @namespace    https://greasyfork.org/scripts/492994
// @version      0.3.5
// @description  全国图书馆参考咨询联盟【一键查询电子版图书】为搜索红太狼的平底锅的朋友新加功能，显示dxid、等为用于图书文献、图书互助、图书资源查询、群组找书等场景；全方位助力您下载各类书籍显示大学数字图书馆国际合作计划(cadal)的书号-ssno，可以直接显示文献的读秀ssid号或dxid进行互助，pdf电子版，图书代找，图书电子版，PC、手机、MAC、苹果设备都可用一键查询超星龙岩东莞图书馆深圳图书馆广东图书馆获取书籍电子版PDF,图书馆有最新2024年的书籍，豆瓣读书，百度网盘图书pdf互助，图书分享，pan.baidu.com。
// @author       mobi2024
// @icon         data:image/image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdM35j1PA+raf398IAAAAAZLC2xWWxNY4oa6uPItoUECObVk/jGNEMYVvZBcAAAAAAAAAAAAAAAAAAAAA+fz8UlrF+d9pzP2DAAAAAH+ntyB7X02BklUsxaphLvO5bzz+uW89/KxoOOuYYjvBb1RAfJycnBIAAAAAAAAAAO76++tlzfr/S8f9naamqj9pOx/HnUgB/9BwF//klEH/77Ju/++zcf/kmEn/z3Ie/6BOCf90Vj+9s7O6JQAAAADd9vnniN/7/xO2/exNWlfmnkAA/8ZvEP/pnCr/1qVL/7SUX961kWPW2KJU/uidMP/feQn/kjsA/3ReUbKZmaoP1fP4kafo9/8fx///PoSQ/8ldAP+sbhb/zJEc/K6Wc5Sff2AIkm1JB66PfGvVlTPz24cQ9shiB/ZmLQn3kYuOVt30+S2o4un2S73p/w+18v+qfjH/pGcO/5RtKOCaioUwn39gCI5xVQmVf2oMrYtxYaR9X26ad2BthWNYcY59fT3MzMwFrtnfh1mChP8gt+7/QbC5/6xwEv+BYS3woHYvr7KAM6m2gzmruYY1qbqIPJmtejqWp2w4l5NZNJdtVEp8AAAAAL/c4yRZUTPdc5B6/w/I//9xlGz/m2Yc/6Z2Hf/Jhxj/yocZ/8SACf/JhgT/y38A/8plAP+iPQD/Uzcq0AAAAAB/f38MWUs8sZloDf9zvbn/Fbrl/317Vt6ojINSq5KDRqiMd0mff2pSp2ob5sd3AP/LagT/lkIB/2FPSKIAAAAAAAAAAXlxc4OMVxL/0KRN/1rG4/8bpdHxlJGUUQAAAAAAAAAAs6KXR7l4HvnPgxj/1IAe/4FLE/+Jg4ZdAAAAAAAAAACfpKotd11F28aIPv/XuoL/Wcjs/yWbw+ybhGKmtIRapLiLT+/UmUT/3Z1M/7yAOf9/a1bExsbUEgAAAAAAAAAAAAAAAJ6eoVSAZUzt16Rt/+zRqP901fP/T7nR/8m1hP/yvH7/6MCM/82kc/+Ea1Pesq2tNaqqqgMAAAAAAAAAAAAAAAAAAAAAenZ6RXxuZMDGp4v/7tW6/4/Z9f9Vw/H/tMjI/8anjO6BbV+mlYWFMAAAAACZzMwFAAAAAAAAAAAAAAAAAAAAAAAAAABdXV0WdnZ2R4l6dHuXhHqbZoORlF264rVTnsa+lbTHKQAAAAAAAAAAndjrDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbUlJB2ZmMwVtttsOluT6OH3Y/Ghhx/xpUMH8VnbN+V0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @match        *://book.ucdrs.superlib.net/search*
// @match        *://book.ucdrs.superlib.net/views/specific/*
// @require      https://code.jquery.com/jquery-3.6.1.slim.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492994/%F0%9F%8C%90%E5%85%A8%E5%9B%BD%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8F%82%E8%80%83%E5%92%A8%E8%AF%A2%E8%81%94%E7%9B%9F%F0%9F%94%8D%F0%9F%93%98%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%E7%94%B5%E5%AD%90%E7%89%88%E5%9B%BE%E4%B9%A6%E2%9C%94%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/492994/%F0%9F%8C%90%E5%85%A8%E5%9B%BD%E5%9B%BE%E4%B9%A6%E9%A6%86%E5%8F%82%E8%80%83%E5%92%A8%E8%AF%A2%E8%81%94%E7%9B%9F%F0%9F%94%8D%F0%9F%93%98%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%E7%94%B5%E5%AD%90%E7%89%88%E5%9B%BE%E4%B9%A6%E2%9C%94%EF%B8%8F.meta.js
// ==/UserScript==


function insertBefore(parent, prefix, content, nodeType = 'dd') {
    const html = `<${nodeType} class="custom-field">
        <span style="user-select:none">${prefix}</span><span style="user-select:all">${content}</span><a target="_blank" href="https://eebook.net/so/?ie=utf-8&name=${content}">查看电子版图书</a>
    </${nodeType}>`
    $(parent).prepend(html);}
function isbnorg(parent, prefix, content, nodeType = 'dd') {
const html = `<a target="_blank" href="https://eebook.net/so/?ie=utf-8&name=${content}"><font color="#0000FF">点击查询电子图书</font></a>`
$(parent).append(html);}

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
    return `${name}`;////#${author}, ${publisher}, ${publishDate}, ${pages}P
}
function insertCleanISBN(parent) {
    const content = document.querySelector('#paper_one > input[name=content]').value;
    const cleanISBN = content.match(/【ISBN号】([-\dxX]*)\n/)[1].replace(/-/g, '');
    const elISBN = Array.from(parent.children).find(it => it.textContent.includes('【ISBN号】'));
    elISBN?.append(`(${cleanISBN})`);
    if (content) {isbnorg(elISBN, '', cleanISBN);}
}
function doSpecific() {
    const el = document.querySelector('script[language]:not([src])');
    const bookInfo = document.querySelector('.tubox dl');
    if (el) {
        insertBefore(bookInfo, '【书名】', makeFileName());
        const ss = el.innerText.match(/ssn=(\d{3,})/)?.[1];
        let dx = ''
        if (ss) {
            insertBefore(bookInfo, '【SS】', ss);
        } else if(dx = location.href.match(/dxNumber=(\d+)/)?.[1]) {
            insertBefore(bookInfo, '【DXID】', dx);
        }
        insertCleanISBN(bookInfo);
    }
}
function doSearch() {
    document.querySelectorAll('td[id="b_img"]').forEach(item => {
//const ss = item.parentElement.querySelector('input[name*="dxid"]').value;
const dxNumber = item.parentElement.querySelector('input[name*="url"]').value;
var dxNumbers =dxNumber.replace(/<\/?[^>]*>/g, '');//过滤所有的html标签
///修复SSID
function getQueryParam(dxNumbers, param) {
  const pattern = new RegExp(`[?&]${param}=([^&]+)`);
  const match = pattern.exec(dxNumbers);
  return match ? decodeURIComponent(match[1]) : null;
}
const DXIDA = getQueryParam(dxNumbers, 'dxNumber'); // 返回 'value1'
///修复SSID
if (dxNumber) {
            isbnorg($(item).next(), '', DXIDA);
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