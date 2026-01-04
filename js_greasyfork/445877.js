// ==UserScript==
// @name         Bilibili赛事预测统计
// @namespace    https://www.bilibili.com/
// @version      0.3
// @icon         https://www.bilibili.com/favicon.ico
// @description  Bilibili赛事预测统计,统计胜场和收益等
// @author       Ethan
// @match        https://www.bilibili.com/v/game/match/competition*
// @grant        unsafeWindow
// @supportURL   https://greasyfork.org/zh-CN/scripts/445877
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
/* globals $ */

// @downloadURL https://update.greasyfork.org/scripts/445877/Bilibili%E8%B5%9B%E4%BA%8B%E9%A2%84%E6%B5%8B%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/445877/Bilibili%E8%B5%9B%E4%BA%8B%E9%A2%84%E6%B5%8B%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $.ajaxSetup({ xhrFields: { withCredentials: true } })

function getPromise(url) {
    return new Promise((resolve, reject) => {
        $.get(url, (data, status) => {
            if (status === "success") {
                resolve(data)
            } else {
                reject(data)
            }
        })
    })
}

$(document).ready(async () => {
    // 获取预测信息
    console.log("获取预测信息...")
    const recordList = []
    let finishedPageNumber = 1
    while (true) {
        const data = await getPromise(`https://api.bilibili.com/x/esports/guess/collection/record?type=2&pn=${finishedPageNumber}&ps=100`)
        if (data.code !== 0) {
            throw "请求失败~"
        } else if (data.data.record !== null) {
            finishedPageNumber += 1
            recordList.push(...data.data.record)
        } else {
            break
        }
    }

    // 统计赛季记录
    const seasonRecord = {}
    for (const record of recordList) {
        const guess = record.guess[0]
        const contest = record.contest
        if (seasonRecord[contest.season.title] === undefined) {
            seasonRecord[contest.season.title] = {
                logo: contest.season.logo,
                totalTime: 0,
                totalStake: 0,
                totalIncome: 0,
                rightTime: 0,
                rightStake: 0,
            }
        }
        const statistics = seasonRecord[contest.season.title]
        statistics.totalTime += 1
        statistics.totalStake += guess.stake
        statistics.totalIncome += guess.income
        if (guess.income !== 0) {
            statistics.rightTime += 1
            statistics.rightStake += guess.stake
        }
    }
    console.log(seasonRecord)

    // 统计总预测记录
    const totalRecord = {
        totalTime: 0,
        totalStake: 0,
        totalIncome: 0,
        rightTime: 0,
        rightStake: 0,
    }
    for (const key in seasonRecord) {
        const season = seasonRecord[key]
        totalRecord.totalTime += season.totalTime
        totalRecord.totalStake += season.totalStake
        totalRecord.totalIncome += season.totalIncome
        totalRecord.rightTime += season.rightTime
        totalRecord.rightStake += season.rightStake
    }
    console.log(totalRecord)

    /* 渲染DOM */
    // 预测历史DOM
    const competitionDom = document.querySelector("#server-game-app > div.competition-home > div.container-box > div.container-right > div.competition-history")

    // 总预测标题
    const totalRecordTitle = competitionDom.children[0].cloneNode(true)
    totalRecordTitle.style.marginTop = "30px"
    totalRecordTitle.children[0].innerText = "总预测"
    competitionDom.appendChild(totalRecordTitle)
    // 总预测内容
    const totalRecordDom = $(`
    <div data-v-0c2783df="" data-v-1a97262b="" style="margin-top: 0px">
        <ul data-v-0c2783df="" class="tab-content"  style="border-top-color: #00a1d6";>
            <li data-v-0c2783df="">
                <div data-v-5f3148a6="" data-v-1a97262b="" class="bili-scroll-box" data-v-0c2783df="" style="height: 108px">
                    <div data-v-5f3148a6="">
                        <div data-v-5458153b="" data-v-1a97262b="" data-v-5f3148a6="">
                            <ul data-v-5458153b="" class="competition-history">
                                <li data-v-5458153b="">
                                    <ul data-v-5458153b="" class="competition-history-infos">
                                        <li data-v-5458153b="">
                                            <a data-v-5458153b="">
                                                <h3 data-v-5458153b="">历史总预测 --Power By Ethan & 赌狗510</h3>
                                                <ul data-v-7b05d613="" data-v-5458153b="" class="competition-history-info">
                                                    <li data-v-7b05d613="">
                                                        <span data-v-7b05d613="">总预测数</span>
                                                        <i data-v-7b05d613="">
                                                            <span data-v-7b05d613="">${totalRecord.totalStake}</span>
                                                            <span data-v-7b05d613="" class="icon-coin"></span>
                                                        </i>
                                                    </li>
                                                    <li data-v-7b05d613="">
                                                        <span data-v-7b05d613="">败场预测</span>
                                                        <i data-v-7b05d613="">
                                                            <span data-v-7b05d613="">${totalRecord.totalStake - totalRecord.rightStake}</span>
                                                            <span data-v-7b05d613="" class="icon-coin"></span>
                                                        </i>
                                                    </li>
                                                    <li data-v-7b05d613="">
                                                        <span data-v-7b05d613="">硬币盈亏</span>
                                                        <i data-v-7b05d613="">
                                                            <span data-v-7b05d613="">${(totalRecord.totalIncome - totalRecord.totalStake).toFixed(2)}</span>
                                                            <span data-v-7b05d613="" class="icon-coin"></span>
                                                        </i>
                                                    </li>
                                                </ul>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="bscroll-vertical-scrollbar" style="position: absolute; z-index: 9999; width: 7px; bottom: 2px; top: 2px; right: 1px; overflow: hidden; display: none">
                        <div
                            class="bscroll-indicator"
                            style="
                                box-sizing: border-box;
                                position: absolute;
                                background: rgba(0, 0, 0, 0.5);
                                border: 1px solid rgba(255, 255, 255, 0.9);
                                border-radius: 3px;
                                width: 100%;
                                transition-duration: 0ms;
                                height: 439px;
                                transform: translateY(0px) translateZ(0px);
                            "
                        ></div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    `)[0]
    competitionDom.appendChild(totalRecordDom)

    // 赛季预测标题
    const seasonRecordTitle = competitionDom.children[0].cloneNode(true)
    seasonRecordTitle.style.marginTop = "30px"
    seasonRecordTitle.children[0].innerText = "赛季预测"
    competitionDom.appendChild(seasonRecordTitle)
    // 赛季预测内容
    const seasonRecordDom = $(`
    <div data-v-0c2783df="" data-v-1a97262b="" style="margin-top: 0px">
        <ul data-v-0c2783df="" class="tab-content"  style="border-top-color: #00a1d6";>
            <li data-v-0c2783df="">
                <div data-v-5f3148a6="" data-v-1a97262b="" class="bili-scroll-box" data-v-0c2783df="">
                    <div data-v-5f3148a6="">
                        <div data-v-5458153b="" data-v-1a97262b="" data-v-5f3148a6="">
                            <ul data-v-5458153b="" class="competition-history">
                                <li data-v-5458153b="">
                                    <ul data-v-5458153b="" class="competition-history-infos">
                                        <!--此处写入li-->
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    `)[0]
    competitionDom.appendChild(seasonRecordDom)
    // 赛季预测元素
    const seasonRecordUlDom = seasonRecordDom.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0]
    for (const key in seasonRecord) {
        const season = seasonRecord[key]
        seasonRecordUlDom.appendChild($(`
            <li data-v-5458153b="">
                <div data-v-5458153b="" class="competition-history-top" style="padding-top: 24px">
                    <h3 data-v-5458153b="">${key}</h3>
                </div>
                <ul data-v-5458153b="" class="competition-history-infos">
                    <li data-v-5458153b=""  style="padding-top: 5px">
                        <a data-v-5458153b="">
                            <ul data-v-7b05d613="" data-v-5458153b="" class="competition-history-info">
                                <li data-v-7b05d613="">
                                    <span data-v-7b05d613="">总场数</span>
                                    <i data-v-7b05d613="">
                                        <span data-v-7b05d613="">${season.totalTime}</span>
                                    </i>
                                </li>
                                <li data-v-7b05d613="">
                                    <span data-v-7b05d613="">胜场数</span>
                                    <i data-v-7b05d613="">
                                        <span data-v-7b05d613="">${season.rightTime}</span>
                                    </i>
                                </li>
                                <li data-v-7b05d613="">
                                    <span data-v-7b05d613="">胜率</span>
                                    <i data-v-7b05d613="">
                                        <span data-v-7b05d613="">${(season.rightTime / season.totalTime * 100).toFixed(2) + "%"}</span>
                                    </i>
                                </li>
                            </ul>
                        </a>
                    </li>
                    <li data-v-5458153b=""  style="padding-top: 5px">
                        <a data-v-5458153b="">
                            <ul data-v-7b05d613="" data-v-5458153b="" class="competition-history-info">
                                <li data-v-7b05d613="">
                                    <span data-v-7b05d613="">总硬币</span>
                                    <i data-v-7b05d613="">
                                        <span data-v-7b05d613="">${season.totalStake}</span>
                                        <span data-v-7b05d613="" class="icon-coin"></span>
                                    </i>
                                </li>
                                <li data-v-7b05d613="">
                                    <span data-v-7b05d613="">败场硬币</span>
                                    <i data-v-7b05d613="">
                                        <span data-v-7b05d613="">${season.totalStake - season.rightStake}</span>
                                        <span data-v-7b05d613="" class="icon-coin"></span>
                                    </i>
                                </li>
                                <li data-v-7b05d613="">
                                    <span data-v-7b05d613="">硬币盈亏</span>
                                    <i data-v-7b05d613="">
                                        <span data-v-7b05d613="">${(season.totalIncome - season.totalStake).toFixed(2)}</span>
                                        <span data-v-7b05d613="" class="icon-coin"></span>
                                    </i>
                                </li>
                            </ul>
                        </a>
                    </li>
                </ul>
            </li>
        `)[0])
    }
})




})();