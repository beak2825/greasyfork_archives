// ==UserScript==
// @name         Kirito Tools
// @namespace    yayaKiritoTools
// @version      0.3.17
// @description  mykirito.com 的界面調整，不包含任何自動操作。
// @author       yaya
// @include      https://mykirito.com/*
// @include      https://kirito-1585904519813.appspot.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404006/Kirito%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/404006/Kirito%20Tools.meta.js
// ==/UserScript==

// （詳細資料）顯示其他玩家的轉生點加成
function addPointsToDetail(tableRows, playerData) {
    tableRows[4].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.hp > 0? "(+"+playerData.rattrs.hp*10+")" : ""}</span>`;
    tableRows[5].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.atk > 0? "(+"+playerData.rattrs.atk+")" : ""}</span>`;
    tableRows[6].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.def > 0? "(+"+playerData.rattrs.def+")" : ""}</span>`;
    tableRows[7].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.stm > 0? "(+"+playerData.rattrs.stm+")" : ""}</span>`;
    tableRows[8].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.agi > 0? "(+"+playerData.rattrs.agi+")" : ""}</span>`;
    tableRows[9].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.spd > 0? "(+"+playerData.rattrs.spd+")" : ""}</span>`;
    tableRows[10].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.tec > 0? "(+"+playerData.rattrs.tec+")" : ""}</span>`;
    tableRows[11].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.int > 0? "(+"+playerData.rattrs.int+")" : ""}</span>`;
    tableRows[12].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.lck > 0? "(+"+playerData.rattrs.lck+")" : ""}</span>`;
}

// （能力比對）顯示其他玩家的轉生點加成
function addPointsToCompare(myTr, myData, playerTr, playerData) {
    myTr[6].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.hp > 0? "(+"+myData.rattrs.hp*10+")" : ""}</span>`;
    myTr[7].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.atk > 0? "(+"+myData.rattrs.atk+")" : ""}</span>`;
    myTr[8].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.def > 0? "(+"+myData.rattrs.def+")" : ""}</span>`;
    myTr[9].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.stm > 0? "(+"+myData.rattrs.stm+")" : ""}</span>`;
    myTr[10].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.agi > 0? "(+"+myData.rattrs.agi+")" : ""}</span>`;
    myTr[11].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.spd > 0? "(+"+myData.rattrs.spd+")" : ""}</span>`;
    myTr[12].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.tec > 0? "(+"+myData.rattrs.tec+")" : ""}</span>`;
    myTr[13].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.int > 0? "(+"+myData.rattrs.int+")" : ""}</span>`;
    myTr[14].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${myData.rattrs.lck > 0? "(+"+myData.rattrs.lck+")" : ""}</span>`;

    playerTr[6].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.hp > 0? "(+"+playerData.rattrs.hp*10+")" : ""}</span>`;
    playerTr[7].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.atk > 0? "(+"+playerData.rattrs.atk+")" : ""}</span>`;
    playerTr[8].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.def > 0? "(+"+playerData.rattrs.def+")" : ""}</span>`;
    playerTr[9].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.stm > 0? "(+"+playerData.rattrs.stm+")" : ""}</span>`;
    playerTr[10].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.agi > 0? "(+"+playerData.rattrs.agi+")" : ""}</span>`;
    playerTr[11].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.spd > 0? "(+"+playerData.rattrs.spd+")" : ""}</span>`;
    playerTr[12].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.tec > 0? "(+"+playerData.rattrs.tec+")" : ""}</span>`;
    playerTr[13].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.int > 0? "(+"+playerData.rattrs.int+")" : ""}</span>`;
    playerTr[14].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${playerData.rattrs.lck > 0? "(+"+playerData.rattrs.lck+")" : ""}</span>`;
}

// （戰報）顯示雙方的轉生點加成
function addPointsAndLinkToReport(atkTr, atkData, defTr, defData) {
    atkTr[6].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.hp > 0? "(+"+atkData.rattrs.hp*10+")" : ""}</span>`;
    atkTr[7].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.atk > 0? "(+"+atkData.rattrs.atk+")" : ""}</span>`;
    atkTr[8].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.def > 0? "(+"+atkData.rattrs.def+")" : ""}</span>`;
    atkTr[9].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.stm > 0? "(+"+atkData.rattrs.stm+")" : ""}</span>`;
    atkTr[10].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.agi > 0? "(+"+atkData.rattrs.agi+")" : ""}</span>`;
    atkTr[11].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.spd > 0? "(+"+atkData.rattrs.spd+")" : ""}</span>`;
    atkTr[12].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.tec > 0? "(+"+atkData.rattrs.tec+")" : ""}</span>`;
    atkTr[13].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.int > 0? "(+"+atkData.rattrs.int+")" : ""}</span>`;
    atkTr[14].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${atkData.rattrs.lck > 0? "(+"+atkData.rattrs.lck+")" : ""}</span>`;

    defTr[6].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.hp > 0? "(+"+defData.rattrs.hp*10+")" : ""}</span>`;
    defTr[7].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.atk > 0? "(+"+defData.rattrs.atk+")" : ""}</span>`;
    defTr[8].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.def > 0? "(+"+defData.rattrs.def+")" : ""}</span>`;
    defTr[9].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.stm > 0? "(+"+defData.rattrs.stm+")" : ""}</span>`;
    defTr[10].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.agi > 0? "(+"+defData.rattrs.agi+")" : ""}</span>`;
    defTr[11].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.spd > 0? "(+"+defData.rattrs.spd+")" : ""}</span>`;
    defTr[12].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.tec > 0? "(+"+defData.rattrs.tec+")" : ""}</span>`;
    defTr[13].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.int > 0? "(+"+defData.rattrs.int+")" : ""}</span>`;
    defTr[14].querySelector("td").innerHTML += `<span style="color: rgb(0, 181, 181);"> ${defData.rattrs.lck > 0? "(+"+defData.rattrs.lck+")" : ""}</span>`;
}

// 檢測是否爲行動裝置。目前已知手機版無法正常查看額外資訊也無法正常觸發通知。
// 由於此腳本涉及請求，避免意料外的狀況，直接避免發送請求應是最穩妥的解法。
// 正規參照：http://detectmobilebrowsers.com/ (2014)
function mobileCheck() {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            check = true;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);

    return check;
};

// 表格底部訊息
// type: (0 正常, 1 錯誤)
function msg(str, type) {
    // 在表格底部添加訊息位
    if (document.querySelectorAll("div#root > div > div > div").length != 0 && document.querySelectorAll("div#us_msgArea").length == 0) {
        let html = `
            <div id="us_msgArea"></div>
        `;
        document.querySelector("div#root > div > div > div").insertAdjacentHTML("beforeend", html);
    }

    let msgArea = document.querySelector("div#us_msgArea");
    msgArea.style.color = (type == 0) ? "green" : "red";
    msgArea.style.textAlign = "right";
    msgArea.innerHTML = `<b>${str}</b>`;

    // 強制讓訊息置於表格底下（不然切換查看模式時會跳到表格上方）
    document.querySelector("div#root > div > div > div").insertAdjacentElement("beforeend", msgArea);
}

// 計算總轉生點數
function calcTotalPoints(rattrs) {
    let total = 0;
    for (let key in rattrs) {
        total += rattrs[key];
    }

    return total;
}

(async function () {
    'use strict';

    // 調整介面：使導航欄維持在頁面上方
    let root = document.querySelector("div#root");
    let navbar = document.querySelector("div#root > nav");
    let navbarHeight = navbar.offsetHeight;
    root.style.paddingTop = `calc(${navbarHeight}px + 18px)`; // height + margin bottom
    navbar.style.position = "fixed";
    navbar.style.top = "0";

    // 必須是非行動裝置
    if (!mobileCheck()) {
        let frontend = await fetch("https://mykirito.com").then(r => r.text()).then(t => {
            return t.match(/frontend\.[0-9a-f]{8}.js/)[0];
        });
        let cds = await fetch(`https://mykirito.com/${frontend}`).then(r => r.text()).then(t => {
            return t.match(/;var\ .+?(\d\+?e\d);var\ .+?(\d+?e\d);var\ .+?(\d+?e\d);var\ .+?(\d+?e\d)/);
        });
        let token = localStorage.getItem("token");
        let myData = await fetch("https://mykirito.com/api/my-kirito", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "token": token
            },
            "referrer": "https://mykirito.com/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        }).then(r =>
            r.json()
        );

        let cdChallenge = cds[1] - 0;
        let cdChallengeRed = cds[2] - 0;
        let cdDoAction = cds[3] - 0;
        let notificationSeconds = 20;
        let levelExp = [0, 30, 60, 100, 150, 200, 250, 300, 370, 450, 500, 650, 800, 950, 1200, 1450, 1700, 1950, 2200, 2500, 2800, 3100, 3400, 3700, 4000, 4400, 4800, 5200, 5600, 6000, 6500, 7000, 7500, 8000, 8500, 9100, 9700, 10300, 11000, 11800, 12600, 13500, 14400, 15300, 16200, 17100, 18000, 19000, 20000, 21000, 23000, 25000, 27000, 29000, 31000, 33000, 35000, 37000, 39000, 41000, 44000, 47000, 53000, 56000, 59000, 62000, 65000, 68000, 71000, 74000];

        document.querySelector("div#root").insertAdjacentHTML("afterend", `<div id="us_customSpace"></div>`);

        if (Notification.permission == "default") {
            Notification.requestPermission();
        }
        if (GM_getValue("NotifiTime") == undefined) {
            GM_setValue("NotifiTime", "-1");
        }if (GM_getValue("NotidiTime") == undefined) {
            GM_setValue("NotidiTime", "-1");
        }

        let url = "";
        let lastUrl = "";
        setInterval(window.onload = async function () {
            url = location.href;

            if (GM_getValue("NotifiTime") != "-1" && Date.now() > GM_getValue("NotifiTime")) {
                new Notification(`還剩 ${notificationSeconds} 秒左右冷卻就結束了，可以準備打架啦！`);
                GM_setValue("NotifiTime", "-1");
            }else if (GM_getValue("NotidiTime") != "-1" && Date.now() > GM_getValue("NotidiTime")) {
                new Notification(`還剩 ${notificationSeconds} 秒左右冷卻就結束了，可以準備行動啦！`);
                GM_setValue("NotidiTime", "-1");
            }

            if (url.includes("profile")) {
                // 在其他玩家頁面
                if (url != lastUrl) {
                    lastUrl = url;

                    let playerId = url.match(/\/([0-9a-zA-Z]+?)$/)[1];
                    let buttonTypes = document.querySelectorAll("div#root > div > div > div:nth-child(1) > button");

                    let playerData = await fetch(`https://mykirito.com/api/profile/${playerId}`, {
                        "headers": {
                            "token": token
                        }
                    }).then(
                        r => r.json()
                    ).then(
                        t => t.profile
                    ).catch(error => {
                        msg("錯誤：請求玩家資料失敗", 1);
                        return;
                    });

                    // 哪個按鈕禁止點擊就表示在哪個查看類型
                    let myTr, playerTr;
                    if (buttonTypes[0].disabled) {
                        // （初始化、詳細資料）顯示其他玩家的轉生點加成
                        playerTr = document.querySelectorAll("div#root > div > div > div:nth-child(1) > table tr");
                        addPointsToDetail(playerTr, playerData);

                        let defPts = calcTotalPoints(playerData.rattrs);
                        msg(`轉生點資料解析完成，玩家總點數為（${defPts}）`, 0);
                    } else {
                        // （初始化、能力比對）顯示其他玩家的轉生點加成
                        myTr = document.querySelectorAll("div#root > div > div > div:nth-child(1) > div > table:nth-child(1) tr");
                        playerTr = document.querySelectorAll("div#root > div > div > div:nth-child(1) > div > table:nth-child(2) tr");
                        addPointsToCompare(myTr, myData, playerTr, playerData);

                        let atkPts = calcTotalPoints(myData.rattrs);
                        let defPts = calcTotalPoints(playerData.rattrs);
                        msg(`轉生點資料解析完成，雙方總點數為（${atkPts}, ${defPts}）`, 0);
                    }

                    // 事件監聽：切換查看類型的兩個按鈕
                    buttonTypes[0].addEventListener("click", function () {
                        let id = setInterval(() => {
                            try {
                                let tableRows = document.querySelectorAll("div#root > div > div > div:nth-child(1) > table tr");
                                addPointsToDetail(tableRows, playerData);

                                let defPts = calcTotalPoints(playerData.rattrs);
                                msg(`轉生點資料解析完成，玩家總點數為（${defPts}）`, 0);

                                if (document.querySelectorAll("div#root > div > div > div:nth-child(1) > table tr span").length > 0) {
                                    clearInterval(id);
                                }
                            } catch (e) {}
                        }, 100);
                    });
                    buttonTypes[1].addEventListener("click", function () {
                        let id = setInterval(() => {
                            try {
                                playerTr = document.querySelectorAll("div#root > div > div > div:nth-child(1) > div > table:nth-child(2) tr");
                                addPointsToCompare(myTr, myData, playerTr, playerData);

                                let atkPts = calcTotalPoints(myData.rattrs);
                                let defPts = calcTotalPoints(playerData.rattrs);
                                msg(`轉生點資料解析完成，雙方總點數為（${atkPts}, ${defPts}）`, 0);

                                if (document.querySelectorAll("div#root > div > div > div:nth-child(1) > div > table:nth-child(2) tr span").length > 0) {
                                    clearInterval(id);
                                }
                            } catch (e) {}
                        }, 100);
                    });


                    // 事件監聽：打架的四個按鈕
                    let buttons = document.querySelectorAll("div#root > div > div > div:nth-child(2) > div:nth-last-child(1) button");
                    buttons.forEach(button => {
                        button.addEventListener("click", async () => {
                            if (!button.disabled) {
                                let start = Date.now();

                                let color = await fetch("https://mykirito.com/api/my-kirito", {
                                    "headers": {
                                        "accept": "application/json, text/plain, */*",
                                        "token": token
                                    },
                                    "referrer": "https://mykirito.com/",
                                    "referrerPolicy": "no-referrer-when-downgrade",
                                    "body": null,
                                    "method": "GET",
                                    "mode": "cors",
                                    "credentials": "omit"
                                }).then(r =>
                                    r.json()
                                ).then(j =>
                                    j.color
                                );

                                let end = Date.now();
                                if (color == "red") {
                                    let time = Date.now() + cdChallengeRed - (notificationSeconds * 1000) - (end - start);
                                    GM_setValue("NotifiTime", time);
                                    console.log("Notifi reg - R" + (cdChallengeRed - (notificationSeconds * 1000) - (end - start)));
                                } else {
                                    let time = Date.now() + cdChallenge - (notificationSeconds * 1000) - (end - start);
                                    GM_setValue("NotifiTime", time);
                                    console.log("Notifi reg - N" + (cdChallenge - (notificationSeconds * 1000) - (end - start)));
                                }
                            }
                        });
                    });
                }
            } else if (url.match(/https:\/\/mykirito\.com\/?$/)) {
                // 在首頁
                if (url != lastUrl) {
                    lastUrl = url;

                    let expTd = document.querySelector("div#root > div > div:nth-child(1) > div:nth-child(1) > table tr:nth-child(4) > td:nth-child(4)");
                    let nextLevelReq = levelExp[myData.lv];

                    // 僅在等級變更時才需要更新資料（這裡靠原經驗值判斷）
                    if (expTd.innerText >= nextLevelReq) {
                        myData = await fetch("https://mykirito.com/api/my-kirito", {
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "token": token
                            },
                            "referrer": "https://mykirito.com/",
                            "referrerPolicy": "no-referrer-when-downgrade",
                            "body": null,
                            "method": "GET",
                            "mode": "cors",
                            "credentials": "omit"
                        }).then(r =>
                            r.json()
                        );

                        nextLevelReq = levelExp[myData.lv];
                    }

                    expTd.innerText += ` / ${nextLevelReq}`;

                    // 事件監聽：行動的多個按鈕
                    let buttons1 = document.querySelectorAll("div#root > div > div > div:nth-child(4) > button");
                    let i;
                    for (i=0;i<7;i++){
                        buttons1[i].addEventListener("click", async () => {
                            if (!buttons1[i].disabled) {
                                let time1 = Date.now() + cdDoAction - (notificationSeconds * 1000);
                                GM_setValue("NotidiTime", time1);
                                console.log("Notidi reg - N" + (cdDoAction - (notificationSeconds * 1000)));
                            }
                        });
                    }
                }
            } else if (url.match(/report\/[0-9a-f]+$/)) {
                // 在戰報頁面
                if (url != lastUrl) {
                    lastUrl = url;

                    let reportId = url.match(/report\/([0-9a-f]+)$/)[1];
                    let reportJson = await fetch(`https://storage.googleapis.com/kirito-1585904519813.appspot.com/reports2/${reportId}.json`).then(r => r.json());

                    let attackerTableRows = document.querySelectorAll("div#root > div > div > div > div > table:nth-child(1) tr");
                    let defenderTableRows = document.querySelectorAll("div#root > div > div > div > div > table:nth-child(2) tr");
                    // PlayerName: 4th, Abilities: 7th ~ 15th.

                    attackerTableRows[3].querySelector("td").innerHTML = `<a href="https://mykirito.com/profile/${reportJson.a.uid}">${reportJson.a.nickname}</a>`;
                    defenderTableRows[3].querySelector("td").innerHTML = `<a href="https://mykirito.com/profile/${reportJson.b.uid}">${reportJson.b.nickname}</a>`;

                    let attackerData, defenderData;
                    if (myData._id == reportJson.a.uid) {
                        // 當自己為攻擊方時
                        let playerId = reportJson.b.uid;
                        attackerData = myData;
                        defenderData = await fetch(`https://mykirito.com/api/profile/${playerId}`, {
                            "headers": {
                                "token": token
                            }
                        }).then(
                            r => r.json()
                        ).then(
                            j => j.profile
                        ).catch(error => {
                            msg("錯誤：請求玩家資料失敗", 1);
                            return;
                        });
                    } else if (myData._id == reportJson.b.uid) {
                        // 當自己為防禦方時
                        let playerId = reportJson.a.uid;
                        attackerData = await fetch(`https://mykirito.com/api/profile/${playerId}`, {
                            "headers": {
                                "token": token
                            }
                        }).then(
                            r => r.json()
                        ).then(
                            j => j.profile
                        ).catch(error => {
                            msg("錯誤：請求玩家資料失敗", 1);
                            return;
                        });
                        defenderData = myData;
                    } else {
                        // 檢視別人的戰報
                        let atkId = reportJson.a.uid;
                        let defId = reportJson.b.uid;

                        attackerData = await await fetch(`https://mykirito.com/api/profile/${atkId}`, {
                            "headers": {
                                "token": token
                            }
                        }).then(
                            r => r.json()
                        ).then(
                            j => j.profile
                        ).catch(error => {
                            msg("錯誤：請求攻擊方玩家資料失敗", 1);
                            return;
                        });
                        defenderData = await fetch(`https://mykirito.com/api/profile/${defId}`, {
                            "headers": {
                                "token": token
                            }
                        }).then(
                            r => r.json()
                        ).then(
                            j => j.profile
                        ).catch(error => {
                            msg("錯誤：請求防禦方玩家資料失敗", 1);
                            return;
                        });
                    }

                    addPointsAndLinkToReport(attackerTableRows, attackerData, defenderTableRows, defenderData);

                    let atkPts = calcTotalPoints(attackerData.rattrs);
                    let defPts = calcTotalPoints(defenderData.rattrs);
                    msg(`轉生點資料解析完成，雙方總點數為（${atkPts}, ${defPts}）`, 0);
                }
            } else {
                lastUrl = "";
            }
        }, 100);
    } else {
        console.log("這個腳本的查看對手配點與對戰提醒的功能不支援行動裝置");
    }
})();