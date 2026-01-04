// ==UserScript==
// @name         tessoku_display_difficulty
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  競技プログラミングの鉄則　演習問題集に難易度の星をつける
// @author       kumakumaaaaa
// @match        https://atcoder.jp/contests/tessoku-book/tasks
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453352/tessoku_display_difficulty.user.js
// @updateURL https://update.greasyfork.org/scripts/453352/tessoku_display_difficulty.meta.js
// ==/UserScript==

let id_to_star_num = {
    "A01": 1,
    "A02": 1,
    "A03": 1,
    "A04": 2,
    "A05": 2,
    "A06": 2,
    "A07": 3,
    "A08": 4,
    "A09": 4,
    "A10": 4,
    "A11": 2,
    "A12": 3,
    "A13": 4,
    "A14": 5,
    "A15": 3,
    "A16": 2,
    "A17": 3,
    "A18": 3,
    "A19": 3,
    "A20": 4,
    "A21": 4,
    "A22": 4,
    "A23": 5,
    "A24": 5,
    "A25": 3,
    "A26": 2,
    "A27": 2,
    "A28": 2,
    "A29": 3,
    "A30": 4,
    "A31": 2,
    "A32": 3,
    "A33": 5,
    "A34": 6,
    "A35": 4,
    "A36": 2,
    "A37": 2,
    "A38": 3,
    "A39": 3,
    "A40": 3,
    "A41": 3,
    "A42": 4,
    "A43": 4,
    "A44": 3,
    "A45": 5,
    "A46": 3,
    "A49": 6,
    "A50": 5,
    "A51": 2,
    "A52": 2,
    "A53": 2,
    "A54": 2,
    "A55": 4,
    "A56": 5,
    "A57": 5,
    "A58": 5,
    "A59": 5,
    "A60": 4,
    "A61": 2,
    "A62": 3,
    "A63": 3,
    "A64": 4,
    "A65": 4,
    "A66": 3,
    "A67": 5,
    "A68": 6,
    "A69": 6,
    "A70": 5,
    "A71": 3,
    "A72": 4,
    "A73": 5,
    "A74": 5,
    "A75": 6,
    "A76": 4,
    "A77": 4,

    "B01": 1,
    "B02": 1,
    "B03": 2,
    "B04": 2,
    "B06": 2,
    "B07": 3,
    "B08": 4,
    "B09": 4,
    "B11": 3,
    "B12": 4,
    "B13": 4,
    "B14": 5,
    "B16": 2,
    "B17": 3,
    "B18": 4,
    "B19": 4,
    "B20": 6,
    "B21": 6,
    "B22": 3,
    "B23": 5,
    "B24": 5,
    "B26": 2,
    "B27": 2,
    "B28": 2,
    "B29": 3,
    "B30": 4,
    "B31": 3,
    "B32": 4,
    "B33": 6,
    "B34": 5,
    "B36": 2,
    "B37": 5,
    "B38": 4,
    "B39": 3,
    "B40": 3,
    "B41": 3,
    "B42": 5,
    "B43": 2,
    "B44": 3,
    "B45": 2,
    "B51": 4,
    "B52": 3,
    "B53": 4,
    "B54": 2,
    "B55": 4,
    "B56": 5,
    "B57": 5,
    "B58": 6,
    "B59": 5,
    "B61": 2,
    "B62": 4,
    "B63": 4,
    "B64": 4,
    "B65": 4,
    "B66": 5,
    "B67": 5,
    "B68": 7,
    "B69": 6,

    "C01": 1,
    "C02": 10,
    "C03": 20,
    "C04": 20,
    "C05": 30,
    "C06": 40,
    "C07": 45,
    "C08": 50,
    "C09": 55,
    "C10": 65,
    "C11": 70,
    "C12": 70,
    "C13": 75,
    "C14": 75,
    "C15": 85,
    "C16": 85,
    "C17": 90,
    "C18": 95,
    "C19": 95,
    "C20": 99
};

window.addEventListener('load', function() {
    const problem_list = document.querySelector("#main-container > div.row > div:nth-child(2) > div > table > tbody").rows;
    for (let i = 0; i < problem_list.length; i++) {
        const problem = problem_list[i];
        const problem_id = problem.childNodes[1].innerText;
        const problem_name = problem.childNodes[3].innerText;
        problem.childNodes[3].childNodes[0].childNodes[0].nodeValue = `【☆${id_to_star_num[problem_id]}】 ${problem_name}`;
    };
});

const sort_by_difficulty = () => {
    const table = document.querySelector("#main-container > div.row > div:nth-child(2) > div > table > tbody");
    const tr = [...table.querySelectorAll("tbody > tr")].map((e) => { return { e: e, v:  id_to_star_num[e.childNodes[1].innerText] }; }).sort((a, b) => (a.v < b.v ? -1 : 1));
    while (table.firstChild) {
        table.removeChild(table.firstChild)
    }
    tr.forEach((e) => table.appendChild(e.e));
}

const sort_by_id = () => {
    const table = document.querySelector("#main-container > div.row > div:nth-child(2) > div > table > tbody");
    const tr = [...table.querySelectorAll("tbody > tr")].map((e) => { return { e: e, v: e.childNodes[1].innerText }; }).sort((a, b) => (a.v < b.v ? -1 : 1));
    while (table.firstChild) {
        table.removeChild(table.firstChild)
    }
    tr.forEach((e) => table.appendChild(e.e));
}

let sort_button = document.createElement('button');
sort_button.className = 'btn btn-default';
sort_button.innerText = '難易度順でソート';
let is_sorted_by_id = true;
let a = document.querySelector("#main-container > div.row > div:nth-child(2) > h2");
a.parentNode.insertBefore(sort_button, a.nextSibling);
sort_button.onclick = () => {
    if (is_sorted_by_id) {
        sort_by_difficulty();
        sort_button.innerText = "問題番号でソート";
    }
    else {
        sort_by_id();
        sort_button.innerText = '難易度順でソート';
    }
    is_sorted_by_id = !is_sorted_by_id;
};