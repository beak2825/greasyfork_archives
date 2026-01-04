// ==UserScript==
// @name         alblalblablalb gualaguala nice helper
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  88 excel
// @author       ChaosOp
// @match        https://ourfloatingcastle.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/423509/alblalblablalb%20gualaguala%20nice%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/423509/alblalblablalb%20gualaguala%20nice%20helper.meta.js
// ==/UserScript==

let equipment_type = ["名稱", "類型", "攻擊", "防禦", "挖礦", "耐久"];
let item_type = ["名稱", "數量", "說明"];
let report_type = ["攻方陣營", "攻擊者", "防守者", "時間", "檢視"];

let path = {
    'forge': {
        'inited': false,
        'callback': () => {
            setTimeout(sort_init, 300, item_type);
            setTimeout(forge_init, 300);
        }
    },
    'item': {
        'inited': false,
        'callback': () => {
            setTimeout(sort_init, 300, equipment_type, 0);
            setTimeout(sort_init, 300, item_type, 1);
            setTimeout(sort_init, 300, item_type, 2);
            setInterval(detect, 100);
        }
    },
    'market': {
        'inited': false,
        'callback': () => {
            setInterval(() => {
                let tab = get(".css-1ltezim[tabindex='0']").innerText;
                if (path.market.tab != tab && window.location.pathname.match(/market/)) {
                    path.market.tab = tab;

                    let type_list = Array.apply(0, item_type);
                    if (path.market.tab == "裝備") type_list = Array.apply(0, equipment_type);

                    type_list.splice(2, 0, "價格");
                    setTimeout(sort_init, 200, type_list);
                }
            }, 100);
            setInterval(detect, 100);
        },
        "tab": ""
    },
    'castle': {
        'inited': false,
        'callback': () => {
            setTimeout(sort_init, 300, report_type);
        }
    },
    'report': {
        'inited': false,
        'callback': () => {
            setTimeout(sort_init, 300, report_type);
        }
    }
};

(() => {
    'use strict';

    localStorage.timer_exist = '0';

    setInterval(() => {

        let path_now = window.location.pathname;

        Object.keys(path).forEach((path_name) => {

            if (!path_now.match(path_name)) {
                path[path_name].inited = false;
                if (path[path_name].tab) path[path_name].tab = "";
            }
            else if (!path[path_name].inited) {

                path[path_name].inited = true;
                path[path_name].callback();

            }

        });

    }, 500);
})();

// equipment_info
async function detect() {
    if (!get(".chakra-modal__body").innerHTML) return;
    add_equipment_info();
}

async function add_equipment_info() {

    let text_temp = get(".chakra-modal__body").children;
    if (!get(".chakra-modal__body").innerText.match(/鍛造時間/)) return;
    if (window.location.pathname.match(/items/)) text_temp = text_temp[0].children;
    if (text_temp.inited) return;
    text_temp.inited = true;

    let quality_list = {
        "垃圾般": 0.3,
        '劣質': 0.7,
        '次等': 0.85,
        '普通': 1,
        '上等': 1.2,
        '精良': 1.4,
        '頂級': 1.7,
        '史詩': 2,
        '神話': 2.2525,
        '傳說': 2.6
    };
    let quality;

    let recycle_price = 0;
    Array.apply(null, text_temp).forEach((p, i) => {

        let p_list = ['回收價', '攻擊力', '防禦力', '挖礦力', '耐久度'];
        if (p.innerText.match("品質")) quality = quality_list[text_temp[i].innerText.split("：")[1]];
        else if (p_list.some(p_check => p.innerText.includes(p_check))) {
            let normal_val, raw_val;

            if (p.innerText.match(/[0-9]+/)) {
                raw_val = parseInt(p.innerText.match(/[0-9]+/)[0]);
                normal_val = (raw_val / quality).toFixed(2);

                if (normal_val && !p.innerText.match(`（`)) {
                    recycle_price += raw_val * (p.innerText.match(/耐久度/) ? 0.32 : 0.4);
                    p.innerText += `（${normal_val}）`;

                    if (window.location.pathname.match(/items/)) {
                        let index = find_str_index(text_temp, "鍛造時間");

                        let time_key = text_temp[index].innerText.split("：")[1];

                        if (localStorage[time_key]) {
                            let exp = JSON.parse(localStorage[time_key]).exp_before_craft;
                            if (exp) p.innerText += `（${(normal_val / (1 + 0.02 * Math.pow(exp, 0.5))).toFixed(2)}）`;
                        }

                    }
                }
            }

        }

    });

    if (window.location.pathname.match(/market/)) {
        let body = get(".chakra-modal__body");

        let index = find_str_index(body.children, "品質");
        let node = body.children[index].cloneNode();

        if (!body.innerText.match("回收價")) {
            node.innerText = `回收價：${recycle_price.toFixed(2)}（${(recycle_price / quality).toFixed(2)}）`;
            body.insertBefore(node, body.children[index + 1]);
        }
    }

    if (window.location.pathname.match(/items/)) {

        let body = get(".chakra-modal__body").lastChild;

        let index = find_str_index(body.children, "鍛造時間");
        let separator_node = body.children[index - 2].cloneNode();

        let time_key = body.children[index].innerText.split("：")[1];
        let material, exp_earn;
        if (localStorage[time_key]) {
            ({ material, exp_earn } = JSON.parse(localStorage[time_key]));
        }

        if (!body.children[index + 2]) {

            body.appendChild(separator_node);

            [["增加熟練", exp_earn], ["鍛造材料", material]].forEach((con) => {

                if (!body.innerText.match(con[0])) {
                    let clone_node = body.children[index].cloneNode();
                    clone_node.innerText = `${con[0]}：${con[1] ? con[1] : "未知"}`;
                    body.appendChild(clone_node);
                }

            });
        }

    }


    function find_str_index(table, str) {
        return Array.apply(0, table).findIndex(e => e.innerText.match(str));
    }

}
// equipment_info


//sort
function sort_init(type_list, table_i = null) {

    if (!get(".chakra-table").length && !get(".chakra-table").innerHTML) return;

    let table = get(".chakra-table");
    if (table_i != null) table = table[table_i];

    if (!table) return;
    let label_list = Array.apply(null, table.querySelectorAll("th"));
    label_list.forEach((label) => {

        if (!label.innerText.match("↑") && !label.innerText.match("↓")) label.innerText += " ↑";

        label.addEventListener("click", () => {
            let arrow = ["↑", "↓"];
            if (label.innerText.includes("↓")) arrow = arrow.reverse();
            label.innerText = label.innerText.replace(arrow[0], arrow[1]);

            order(label.innerText, type_list, table_i);

        });

        label.style.cursor = "pointer";

    });

}

function order(type, type_list, table_i = null) {

    let comp = (item, base) => item < base;
    if (type.includes("↓")) {
        comp = (item, base) => item > base;
    }

    let order_i = type_list.findIndex((t) => t.split(", ").some(t_part => type.includes(t_part)));

    let table = get(".chakra-table");
    if (table_i != null) table = table[table_i];

    let table_e = Array.apply(null, table.querySelectorAll("tr")).slice(1);

    table_e = quick_sort(table_e, 0, table_e.length - 1, order_i, comp);

    table.lastChild.innerHTML = "";
    table_e.forEach((e) => {
        table.lastChild.appendChild(e);
    });
}

function swap(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
    return arr;
}

function quick_sort(arr, left, right, order_i, comp) {

    if (left >= right) return arr;
    let index = left;

    for (let i = left + 1; i <= right; i++) {

        let base = arr[left].children[order_i].innerText;
        let item = arr[i].children[order_i].innerText;

        [base, item] = [base, item].map((e) => {
            if (e.match(/\-*[0-9]+/) && !e.match(/[%分]/)) e = parseInt(e.match(/\-*[0-9]+/)[0]);
            return e;
        });

        if (comp(item, base)) {
            index++;
            arr = swap(arr, index, i);
        }
    }

    arr = swap(arr, index, left);

    arr = quick_sort(arr, left, index - 1, order_i, comp);
    arr = quick_sort(arr, index + 1, right, order_i, comp);

    return arr;
}
//sort


//forge
function forge_init() {

    let header = {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-CN;q=0.5",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "token": localStorage.token2
        },
        "referrer": "https://ourfloatingcastle.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
    };


    update_forge_exp();

    get(".css-1dwu3of").addEventListener("click", () => {
        localStorage.material_temp = get(".css-14w0bz").innerText.split("\n").join(", ");
        setTimeout(forge_init, 1000);
    });



    if (localStorage.timer_exist === '1') return;

    let timer = setInterval(() => {

        localStorage.timer_exist = '1';
        if (!get(".css-5w5n0l").innerHTML) return;

        get(".css-5w5n0l").addEventListener("click", () => {

            setTimeout(() => {
                fetch("https://api.ourfloatingcastle.com/api/profile", header)
                    .then(res => res.json())
                    .then((data) => {
                        localStorage.added_exp = data.forgeExp - parseInt(localStorage.forge_exp_record);
                    })
                    .then(() => {
                        fetch("https://api.ourfloatingcastle.com/api/items", header)
                            .then(res => res.json())
                            .then((data) => {
                                let last = data.equipments.pop();

                                let splited = last.craftedTime.split("T");

                                let local_time = [
                                    splited[0].slice(0, 4),
                                    splited[0].slice(5, 7),
                                    splited[0].slice(8, 10),
                                    parseInt(splited[1].slice(0, 2)) - (new Date().getTimezoneOffset() / 60),
                                    splited[1].slice(3, 5),
                                    splited[1].slice(6, 8)
                                ].map(e => parseInt(e));

                                local_time = check_time_overflow(local_time);

                                localStorage[local_time] = JSON.stringify({
                                    "exp_before_craft": localStorage.forge_exp_record,
                                    "exp_earn": localStorage.added_exp,
                                    "material": localStorage.material_temp
                                });

                                function check_time_overflow(local_time) {
                                    let months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                                    let carry = [12 + 1, months[local_time[1] - 1] + 1, 24, 60, 60];

                                    for (let i = 5; i > 0; i--) {

                                        while (local_time[i] >= carry[i - 1]) {
                                            local_time[i] -= carry[i - 1];
                                            if (i <= 2) local_time[i]++;
                                            local_time[i - 1] += 1;
                                        }
                                    }

                                    local_time = local_time.map((data) => {
                                        let data_length = data.toString().length;
                                        if (data_length == 1) data = `0${data}`;
                                        return data;
                                    });

                                    return `${local_time[1]}/${local_time[2]} ${local_time[3]}:${local_time[4]}:${local_time[5]}`;
                                }

                            });
                    });

            }, 1000);

        });

        localStorage.timer_exist = '0';
        clearInterval(timer);
    }, 100);


    function update_forge_exp() {
        fetch("https://api.ourfloatingcastle.com/api/profile", header)
            .then((res) => res.json())
            .then((data) => {
                localStorage.forge_exp_record = data.forgeExp;
            });
    }
}
//forge




function get(selector, ref = document) {
    let node_list = ref.querySelectorAll(selector);
    if (node_list.length != 1) return node_list;
    else return node_list[0];
}

