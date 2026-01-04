// ==UserScript==
// @name         星立方成绩单-全部变为114
// @version      0.6
// @description  全部变为114!
// @author       XJ王大哥
// @match        https://test.k12media.cn:8000/tqweb/report/NewStudentReport.a?showStudentScoreReport
// @match        https://test.k12media.cn:8000/tqweb/report/NewStudentReport.a?doShowStudentReport&test_id=*
// @icon         https://static.codemao.cn/coco/player/unstable/HJAMfQEZa.image/webp?hash=Fv4GHArs7jQjzIUa-39-Yww-9cTI
// @grant        none
// @namespace https://greasyfork.org/users/1151674
// @downloadURL https://update.greasyfork.org/scripts/477172/%E6%98%9F%E7%AB%8B%E6%96%B9%E6%88%90%E7%BB%A9%E5%8D%95-%E5%85%A8%E9%83%A8%E5%8F%98%E4%B8%BA114.user.js
// @updateURL https://update.greasyfork.org/scripts/477172/%E6%98%9F%E7%AB%8B%E6%96%B9%E6%88%90%E7%BB%A9%E5%8D%95-%E5%85%A8%E9%83%A8%E5%8F%98%E4%B8%BA114.meta.js
// ==/UserScript==

let url = new URL(location.href);

document.querySelectorAll(".br_line[align=right]").forEach(v => v.innerText = 114);

if (url.searchParams.get('doShowStudentReport') === '') {
    let 层次 = document.querySelector("#tableForReport > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > div > div > div > table:nth-child(8) > tbody > tr > td.stu_rpt_content > span");
    let 综述_图片 = document.querySelector("#tableForReport > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > div > div > div > table:nth-child(8) > tbody > tr > td:nth-child(2) > fieldset > img");

    层次.innerText = '114514层次';
    层次.setAttribute('class', 'red_txt');

    综述_图片.src = 'https://static.codemao.cn/coco/player/unstable/HJAMfQEZa.image/webp?hash=Fv4GHArs7jQjzIUa-39-Yww-9cTI';
    综述_图片.style.width = '300px';
}