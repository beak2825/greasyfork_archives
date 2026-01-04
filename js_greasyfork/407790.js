// ==UserScript==
// @name         坦克世界击杀环标伤数据排序 (停止更新)
// @name:en      World of Tanks Kill ring sort
// @namespace    https://github.com/dyxcloud
// @version      0.1.1
// @description  将毛服击杀环的数据进行排序
// @description:en  Sort the data of Russian service kill ring
// @author       dyxlike
// @match        https://lebwa.tv/lebwa-team/marks-of-excellence
// @downloadURL https://update.greasyfork.org/scripts/407790/%E5%9D%A6%E5%85%8B%E4%B8%96%E7%95%8C%E5%87%BB%E6%9D%80%E7%8E%AF%E6%A0%87%E4%BC%A4%E6%95%B0%E6%8D%AE%E6%8E%92%E5%BA%8F%20%28%E5%81%9C%E6%AD%A2%E6%9B%B4%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407790/%E5%9D%A6%E5%85%8B%E4%B8%96%E7%95%8C%E5%87%BB%E6%9D%80%E7%8E%AF%E6%A0%87%E4%BC%A4%E6%95%B0%E6%8D%AE%E6%8E%92%E5%BA%8F%20%28%E5%81%9C%E6%AD%A2%E6%9B%B4%E6%96%B0%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 获取坦克表格行tr列表
     * @returns {HTMLCollection}
     */
    function getRowList() {
        let table = document.querySelector("table[data-vehicle-table] > tbody");
        return table.children;
    }

    /**
     * 降序排序
     * @param {string} type 排序字段
     */
    function sort(type) {
        let markClass; //标伤单元格的class样式
        switch (type) {
            case "65":
                markClass = ".value-0";
                break;
            case "85":
                markClass = ".value-1";
                break;
            case "95":
                markClass = ".value-2";
                break;
            case "100":
                markClass = ".value-3";
                break;
            default:
                return;
        }

        let trArr = getRowList();
        let length = trArr.length;
        for (let i = 1; i < length; i++) {
            let tmpHtml = trArr[i].innerHTML;
            let tmpScore = getScore(trArr[i], markClass);
            let j = i - 1;
            while (j >= 0 && tmpScore > getScore(trArr[j], markClass)) {
                trArr[j + 1].innerHTML = trArr[j].innerHTML;
                j--;
            }
            trArr[j + 1].innerHTML = tmpHtml;
        }
    }


    /**
     * 获取标伤数值
     * @param rowTag
     * @param markClass 标伤单元格的class样式
     * @returns {number}
     */
    function getScore(rowTag, markClass) {
        const reg = /\d+/;
        let param = rowTag.querySelector(markClass).innerHTML;
        if (!reg.test(param)) {
            return 0;
        }
        return param - 0;
    }


    /**
     * 从tasks.gg获取坦克列表
     * @returns {Promise<JSON>}
     */
    function getTaskListJson() {
        const TASK_LIST_URL = "https://tanks.gg/api/list";
        fetch(TASK_LIST_URL)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                JSON_TANKS = myJson.tanks;
            });
    }

    let JSON_TANKS;
    getTaskListJson();

    /**
     * 添加金币车图标 处理表头 表尾
     */
    function addTableHead() {
        let tHead = document.querySelector("table[data-vehicle-table] > thead > tr");
        let thElement = document.createElement('th');
        thElement.className = "text-center";
        thElement.innerHTML = "Gold";
        tHead.appendChild(thElement);
        let tFoot = document.querySelector("table[data-vehicle-table] > tfoot > tr");
        let thFootElement = document.createElement('th');
        thFootElement.className = "text-center";
        thFootElement.innerHTML = "Gold";
        tFoot.appendChild(thFootElement);
    }

    /**
     * 添加金币车图标 处理表体
     */
    function addTableBody() {
        setTimeout(function () {
            let mapStr = '';
            let trArr = getRowList();
            let length = trArr.length;
            for (let i = 0; i < length; i++) {
                let tr = trArr[i];
                //判断是否添加图标
                let tankName = tr.children[3].textContent;
                mapStr += ('"' + tankName + '":"",\n');
                //s系车映射
                let html = tr.children[0].innerHTML;
                if (html.indexOf('ussr_small.png') !== -1) {
                    let enName = USSR_TANKNAME_MAP[tankName];
                    if (enName != null && enName.length > 0) {
                        tr.children[3].textContent = enName;
                        tankName = enName;
                    } else {
                        let titleE = document.querySelector(".title-fine.text-center");
                        titleE.innerHTML += ("\n发现未映射坦克名称:" + tankName);
                    }
                }
                let isGold = false;
                let findInJson = false;
                //其他特殊车辆处理
                if ('FV4202' === tankName) {
                    findInJson = true;
                    isGold = true;
                } else if ('King Tiger (захваченный)' === tankName) {
                    findInJson = true;
                    isGold = true;
                } else {
                    for (let aTankJson of JSON_TANKS) {
                        if (tankName === aTankJson.name) {
                            findInJson = true;
                            if (aTankJson.gold_price > 0) {
                                isGold = true;
                            }
                            break;
                        }
                    }
                }
                if (!findInJson) {
                    let titleE = document.querySelector(".title-fine.text-center");
                    titleE.innerHTML += ("\n发现错误坦克名称:" + tankName);
                }
                let td_element = document.createElement('td');
                td_element.innerHTML = isGold ? "<img src='https://tanks.gg/img/icons/gold.png'  alt />" : "";
                tr.appendChild(td_element);
            }
            console.log(mapStr);
        }, 1500);
    }

    function main() {
        let e65 = document.querySelector("table[data-vehicle-table] > thead > tr > th:nth-child(5)");
        let e85 = document.querySelector("table[data-vehicle-table] > thead > tr > th:nth-child(6)");
        let e95 = document.querySelector("table[data-vehicle-table] > thead > tr > th:nth-child(7)");
        let e100 = document.querySelector("table[data-vehicle-table] > thead > tr > th:nth-child(8)");
        e65.addEventListener('click', function () {
            sort("65");
        });
        e85.addEventListener('click', function () {
            sort("85");
        });
        e95.addEventListener('click', function () {
            sort("95");
        });
        e100.addEventListener('click', function () {
            sort("100");
        });

        addTableHead();

        let eCountry = document.querySelectorAll("input.d-none[type='radio']");
        for (let i = 0; i < eCountry.length; i++) {
            eCountry[i].addEventListener('click', function () {
                addTableBody();
            });
        }
    }

    main();


    // noinspection NonAsciiCharacters,JSNonASCIINames
    const USSR_TANKNAME_MAP = {
        //5
        "СУ-85": "SU-85",
        "СУ-85И": "SU-85I",
        "КВ-1": "KV-1",
        "КВ-220-2": "KV-220-2",
        "КВ-220-2 Бета-Тест": "KV-220-2 Beta Test",
        "Черчилль III": "Churchill III",
        "А-20": "A-20",
        "Т-50": "T-50",
        "Матильда IV": "Matilda IV",
        "Т-34": "T-34",
        "Т-34 экранированный": "T-34 shielded",
        "СУ-122А": "SU-122A",
        //6
        "СУ-100": "SU-100",
        "СУ-100Y": "SU-100Y",
        "КВ-1С": "KV-1S",
        "КВ-2": "KV-2",
        "КВ-2 (Р)": "KV-2 (R)",
        "КВ-85": "KV-85",
        "Объект 244": "Object 244",
        "Т-150": "T-150",
        "МТ-25": "MT-25",
        "Т-50-2": "T-50-2",
        "А-43": "A-43",
        "М4-А2 Шерман Лозы": "Loza's M4-A2 Sherman",
        "Т-34-85": "T-34-85",
        "Т-34-85 Rudy": "T-34-85 Rudy",
        "Т-34-85М": "T-34-85M",
        "СУ-8": "SU-8",
        //7
        "ИСУ-122С": "ISU-122S",
        "СУ-100М1": "SU-100M1",
        "СУ-122-44": "SU-122-44",
        "СУ-152": "SU-152",
        "ИС": "IS",
        "ИС-2": "IS-2",
        "ИС-2 экранированный": "IS-2 shielded",
        "ИС-2М": "IS-2M",
        "КВ-122": "KV-122",
        "КВ-3": "KV-3",
        "ЛТГ": "LTG",
        "А-44": "A-44",
        "КВ-13": "KV-13",
        "Т-43": "T-43",
        "С-51": "S-51",
        "СУ-14-1": "SU-14-1",
        //8
        "ИСУ-130": "ISU-130",
        "ИСУ-152": "ISU-152",
        "ИСУ-152К": "ISU-152K",
        "КВ-4 КТТС": "KV-4 KTTS",
        "СУ-101": "SU-101",
        "СУ-130ПМ": "SU-130PM",
        "Т-103": "T-103",
        "ИС-2-II": "IS-2-II",
        "ИС-3": "IS-3",
        "ИС-3 с МЗ": "IS-3A",
        "ИС-5 (Объект 730)": "IS-5 (Object 730)",
        "ИС-6": "IS-6",
        "ИС-6 Ч": "IS-6 B",
        "ИС-М": "IS-M",
        "КВ-4": "KV-4",
        "КВ-4 Креславского": "KV-4 Kreslavskiy",
        "КВ-5": "KV-5",
        "Объект 252У": "Object 252U",
        "Объект 252У Защитник": "Object 252U Defender",
        "Объект 703 Вариант II": "Object 703 Version II",
        "ЛТ-432": "LT-432",
        "ЛТТБ": "LTTB",
        "Объект 274а": "Object 274a",
        "Объект 416": "Object 416",
        "СТГ": "STG",
        "СТГ Гвардеец": "STG Guard",
        "Т-44": "T-44",
        "Т-44-100": "T-44-100",
        "Т-44-100 (Б)": "T-44-100 (B)",
        "Т-44-100 (К)": "T-44-100 (K)",
        "Т-44-100 (Р)": "T-44-100 (R)",
        "Т-44-100 (У)": "T-44-100 (U)",
        "Т-54 первый образец": "T-54 first prototype",
        "СУ-14-2": "SU-14-2",
        //9
        "Объект 263": "Object 263",
        "Объект 704": "Object 704",
        "ИС-3-II": "IS-3-II",
        "Объект 257": "Object 257",
        "Объект 705": "Object 705",
        "Объект 777 Вариант II": "Object 777 Version II",
        "СТ-I": "ST-I",
        "Т-10": "T-10",
        "Т-54 облегчённый": "T-54 ltwt.",
        "Объект 430": "Object 430",
        "Объект 430 Вариант II": "Object 430 Version II",
        "Т-54": "T-54",
        "212А": "212A",
        //10
        "Объект 268": "Object 268",
        "Объект 268 Вариант 4": "Object 268 Version 4",
        "ИС-4": "IS-4",
        "ИС-7": "IS-7",
        "Объект 260": "Object 260",
        "Объект 277": "Object 277",
        "Объект 279 ранний": "Object 279 early",
        "Объект 705А": "Object 705A",
        "Объект 780": "Object 780",
        "СТ-II": "ST-II",
        "Т-100 ЛТ": "T-100 LT",
        "К-91": "K-91",
        "Объект 140": "Object 140",
        "Объект 430У": "Object 430U",
        "Объект 907": "Object 907",
        "Т-22 ср.": "T-22 medium",
        "Т-62А": "T-62A",
        "Объект 261": "Object 261",
    };
})();
