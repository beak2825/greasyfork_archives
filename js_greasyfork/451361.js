// ==UserScript==
// @name         Прогресс персонажа
// @namespace    isnt
// @version      1.1.2
// @description  Отображение очков на странице персонажа
// @author       isnt
// @include     /^https:\/\/((www|qrator|my)(\.heroeswm\.ru|\.lordswm\.com))\/pl_info\.php.*/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451361/%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%B6%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/451361/%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%B6%D0%B0.meta.js
// ==/UserScript==
(function() {
    "use strict";
    let lvl = getXp(`/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[1]/td[1]/table/tbody/tr/td[1]/b/text()`);
    lvl = Number(lvl.replace(/\(.+\)./, '').replace(/[^+\d]/g, ''));
    let potionFrac = [0,
        0,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        8,
        9,
        10,
        10,
        11,
        12,
        12,
        12,
        13,
        13,
        13,
        13,
        14,
        14,
        15
    ];

    let lvlProgress = [0,
        0,
        0,
        3,
        3,
        7,
        10,
        13,
        17,
        20,
        25,
        29,
        35,
        41,
        48,
        58,
        68,
        77,
        84,
        90,
        96,
        101,
        108,
        114,
        120,
        126
    ];

    function getI(xpath, elem) {
        return document.evaluate(xpath, (!elem ? document : elem), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }

    function getXp(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null).stringValue;
    }

    function checkTable() {
        let check = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(1) > td > b");
        if (check.innerText.indexOf('Кланы') !== -1) {
            return 3;
        } else {
            return 2;
        }
    }

    function roulStat() {
        let bet = getXp(`/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[4]/td[2]/b[1]`);
        bet = Number(bet.replace(/\(.+\)./, '').replace(/[^+\d]/g, ''));
        let win = getXp(`/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[4]/td[2]/b[2]`);
        win = Number(win.replace(/\(.+\)./, '').replace(/[^+\d]/g, ''));
        let profit = win - bet;
        let nf = new Intl.NumberFormat('en-US');
        let elem = getI(`/html/body/center/table/tbody/tr/td/table[1]/tbody/tr[4]/td[2]/br[2]`);
        if (elem.snapshotLength == 1) {
            let el = elem.snapshotItem(0);
            let elemSum = document.createElement('div');
            elemSum.style = "border-bottom: 1px solid; margin-bottom: 10px;padding: 0 0 5px;width: max-content;";
            elemSum.innerHTML += `&nbsp;&nbsp;Прибыль в рулетке: <b style="color: ${(profit < 0) ? '#bf2020' : '#098d26'};">${nf.format(profit)}</b>`;
            el.after(elemSum);
        }
    }
    roulStat();

    function statsAll() {
        let re = /(Рыцарь:|Некромант:|Маг:|Эльф:|Варвар:|Темный эльф:|Демон:|Гном:|Степной варвар:|Фараон:|Гильдия Охотников:|Гильдия Рабочих:|Гильдия Воров:|Гильдия Рейнджеров:|Гильдия Наемников:|Гильдия Тактиков:|Гильдия Стражей:|Гильдия Искателей:|Гильдия Лидеров:) ([0-9]+)/g;
        let doc = document.body.innerText;
        doc = doc.match(re);
        let stats = doc.map(function(x) {
            return Number(x.replace(/\D/g, ''));
        });
        let SUM_STATS = 0;
        let GO = stats[10];
        let check = checkTable();
        let GR = stats[11];
        let GV = stats[12];
        let GRj = stats[13];
        let GN = stats[14];
        let GT = stats[15];
        let GS = stats[16];
        let GI = stats[17];
        let GL = stats[18];
        let umkaAll = [];
        for (let i = 0; i < 10; i++) {
            umkaAll.push(stats[i]);
        }
        let c = umkaAll.reduce((partialSum, a) => partialSum + a, 0) * 0.25;
        let b = rSum(c);
        SUM_STATS += numRound(c) - b
        let HEAD_UM = (Math.max.apply(null, umkaAll) > potionFrac[lvl]) ? Math.max.apply(null, umkaAll) : potionFrac[lvl];
        if (HEAD_UM == 1) {
            SUM_STATS += 1;
        } else if (HEAD_UM == 2) {
            SUM_STATS += 2;
        } else if (HEAD_UM == 3) {
            SUM_STATS += 2.5;
        } else if (HEAD_UM == 4) {
            SUM_STATS += 4;
        } else if (HEAD_UM == 5) {
            SUM_STATS += 5.5;
        } else if (HEAD_UM == 6) {
            SUM_STATS += 6.5;
        } else if (HEAD_UM == 7) {
            SUM_STATS += 9;
        } else if (HEAD_UM == 8) {
            SUM_STATS += 11.5;
        } else if (HEAD_UM == 9) {
            SUM_STATS += 16;
        } else if (HEAD_UM == 10) {
            SUM_STATS += 21;
        } else if (HEAD_UM == 11) {
            SUM_STATS += 27;
        } else if (HEAD_UM == 12) {
            SUM_STATS += 33;
        } else if (HEAD_UM == 13) {
            SUM_STATS += 35;
        } else if (HEAD_UM == 14) {
            SUM_STATS += 36.5;
        }
        let pers = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > a");
        //Гильдия охотников
        SUM_STATS += GO;
        //Гильдия рабочих
        if (GR >= 2 && GR < 4) {
            SUM_STATS += 1;
        } else if (GR >= 4 && GR < 6) {
            SUM_STATS += 2;
        } else if (GR >= 6 && GR < 8) {
            SUM_STATS += 3;
        } else if (GR >= 8 && GR < 10) {
            SUM_STATS += 4;
        } else if (GR >= 10 && GR < 12) {
            SUM_STATS += 5;
        } else if (GR >= 12 && GR < 14) {
            SUM_STATS += 6;
        } else if (GR >= 14 && GR < 16) {
            SUM_STATS += 7;
        } else if (GR >= 16 && GR < 18) {
            SUM_STATS += 8;
        }
        //Гильдия воров и рейнджеров
        if (GV > GRj) {
            SUM_STATS += GV / 2;
        } else if (GV < GRj) {
            SUM_STATS += GRj / 2;
        } else if (GV == GRj && GV !== 0) {
            SUM_STATS += GV / 2;
        } else {
            SUM_STATS += 0;
        }
        //Гильдия наёмников
        if (GN >= 2 && GN < 4) {
            SUM_STATS += 1;
        } else if (GN >= 4 && GN < 6) {
            SUM_STATS += 2;
        } else if (GN >= 6 && GN < 8) {
            SUM_STATS += 3;
        } else if (GN == 8) {
            SUM_STATS += 4;
        } else if (GN == 9) {
            SUM_STATS += 5;
        } else if (GN == 10) {
            SUM_STATS += 6;
        } else if (GN == 11) {
            SUM_STATS += 7;
        } else if (GN == 12) {
            SUM_STATS += 8;
        } else if (GN == 13) {
            SUM_STATS += 9;
        } else if (GN == 14) {
            SUM_STATS += 10;
        } else if (GN == 15) {
            SUM_STATS += 11;
        }
        //Гильдия тактиков
        if (GT >= 2 && GT < 4) {
            SUM_STATS += 1;
        } else if (GT == 4) {
            SUM_STATS += 2;
        } else if (GT == 5) {
            SUM_STATS += 3;
        } else if (GT == 6) {
            SUM_STATS += 4;
        } else if (GT == 7) {
            SUM_STATS += 5;
        } else if (GT == 8) {
            SUM_STATS += 6;
        } else if (GT == 9) {
            SUM_STATS += 7;
        } else if (GT == 10) {
            SUM_STATS += 8;
        } else if (GT == 11) {
            SUM_STATS += 9;
        } else if (GT == 12) {
            SUM_STATS += 10;
        } else if (GT == 13) {
            SUM_STATS += 11;
        }
        //Гильдия стражей
        if (GS <= 7) {
            SUM_STATS += GS;
        } else if (GS >= 8) {
            SUM_STATS += GS - 0.5;
        }
        //Гильдия искателей
        SUM_STATS += GI;
        //Гильдия лидеров
        if (GL >= 9 && GL < 14) {
            SUM_STATS += 0.5;
        } else if (GL == 14) {
            SUM_STATS += 1;
        }
        //Образ
        if (pers !== null) {
            let boy = (/.$/).exec(pers.href);
            let girl = (/..$/).exec(pers.href);
            if (boy[0] === 'a' || girl[0] === 'aw' || pers.href.indexOf('premium') == -1) {
                SUM_STATS += 1;
            }
        }
        //Сумма умений
        return SUM_STATS;
    }

    function numRound(x) {
        return Math.round((x + Number.EPSILON) * 20) / 20;
    }

    function rSum(i) {
        if (Number.isInteger(numRound(i) - 0.75)) {
            return 0.75;
        } else if (Number.isInteger(numRound(i) - 0.5)) {
            return 0.5;
        } else if (Number.isInteger(numRound(i) - 0.25)) {
            return 0.25;
        } else {
            return 0;
        }
    }

    function sumStats() {
        let check = checkTable();
        let sum = statsAll();

        function procentExp() {
            let test = '';
            if(sum <= lvlProgress[lvl+1]+2) test = 0;
                else if(sum > lvlProgress[lvl+1]+2 && sum <= lvlProgress[lvl+2]) test = (sum-(lvlProgress[lvl+1]+2))/0.32;
                else if(sum > lvlProgress[lvl+2] && sum <= lvlProgress[lvl+3]) test = (sum - (lvlProgress[lvl+2]))/0.021+25;
                // else if(sum > lvlProgress[lvl+3] && sum <= lvlProgress[lvl+4]) test = (sum - (lvlProgress[lvl+2]))/0.021+25;
            return test;
        }
        procentExp()
        let elem = getI(`/html/body/center/table/tbody/tr/td/table[${check}]/tbody/tr[2]/td[2]/div[2]`);
        if (elem.snapshotLength == 1) {
            let el = elem.snapshotItem(0);
            let elemSum = document.createElement('div');
            elemSum.innerHTML += `<br><span style='display: flex;'>&nbsp;&nbsp;<b>Прогресс персонажа: ${numRound(sum)}</b></span>
                                   <span style='display: flex; font-size: 12px; color: #786e60;'>&nbsp;&nbsp;Дополнительный опыт: ${Math.floor(procentExp())}%</span>`;
            el.after(elemSum);
        }
    }
    sumStats();
})();