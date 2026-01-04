// ==UserScript==
// @name         FMP BestSeats
// @version      0.2
// @description  计算座位
// @match        https://footballmanagerproject.com/Economy/Stadium
// @match        https://www.footballmanagerproject.com/Economy/Stadium
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/521191/FMP%20BestSeats.user.js
// @updateURL https://update.greasyfork.org/scripts/521191/FMP%20BestSeats.meta.js
// ==/UserScript==

const SeatType = ['vip','cov','sea','sta'];

const TimeCost = {
    vip: 40,
    cov: 20,
    sea: 10,
    sta: 5
}

const MoneyCost ={
    vip: 12,
    cov: 4,
    sea: 2,
    sta: 1
}

function SeatsTime(type,newseats,oldseats) {
    return Math.round(1 + TimeCost[type] * Math.abs(newseats - oldseats) / 1000);
}

function SeatsCost(type,newseats,oldseats) {
    return Math.ceil(0.15 * (Math.pow(newseats, 2.0)- Math.pow(oldseats, 2.0))
                     *Math.pow(MoneyCost[type],2.0) * 4.5 / 32400) * 2500;
}

function BestTimeSeats(type,days) {
    return Math.floor((days-0.5-1/10000000000)*1000/TimeCost[type]);
}

function BestCostsSeats(type,oldseats) {
    const MostCondition= Array.from({ length: 700 }, (_, i) => i + 1);
    const Calculate = MostCondition.map(num =>Math.ceil(0.15 * (Math.pow(num+oldseats, 2.0)- Math.pow(oldseats, 2.0))
                                                           *Math.pow(MoneyCost[type],2.0) * 4.5 / 32400)/num);
    const minValue = Math.min(...Calculate);
    const minIndices = Calculate.reduce((indices, num, index) => {
        if (num === minValue) {
            indices.push(index+1);
        }
        return indices;
    }, []);
    return minIndices;
}

function generateTable(headers, values) {
    let tableHTML = '<table class="skilltable" border="1"><tbody>';

    // 确保 headers 和 values 数组长度相同
    for (let i = 0; i < headers.length; i++) {
        tableHTML += '<tr>';
        tableHTML += `<th>${headers[i]}</th>`; // 第一列的表头

        values[i].forEach(value => {
            tableHTML += `<td>${value}</td>`; // 数据单元格
        });

        tableHTML += '</tr>';
    }

    tableHTML += '</tbody></table>';
    return tableHTML; // 返回生成的表格 HTML 字符串
}

function TableValue(type,seats,oldseats) {
    const Newseats = seats.map(seat => {
        return seat+oldseats;
    });
    const Cost = Newseats.map(newseats => {
        return (SeatsCost(type,newseats,oldseats)/1000).toFixed(1);
    });
    const Time = Newseats.map(newseats => {
        return SeatsTime(type,newseats,oldseats);
    });
    const AvgCost = seats.map(seat=> {
        return (SeatsCost(type,oldseats+seat,oldseats)/seat/1000).toFixed(2);
    });
    return [Newseats,Cost,AvgCost,Time];
}

const TableHeader = ['座位','费用(K)','平均<br>费用(K)','时间(D)'];

(function() {
    'use strict';
    //cost
    const costDiv = document.createElement('div');
    costDiv.className = 'fmpx board flexbox box';
    costDiv.style.flexGrow = 1;
    costDiv.style.flexBasis = '400px';

    const costTitleDiv = document.createElement('div');
    costTitleDiv.className = 'title';
    const costMainDiv = document.createElement('div');
    costMainDiv.className = 'main';
    costMainDiv.textContent = '最优花费';
    costTitleDiv.appendChild(costMainDiv)
    costDiv.appendChild(costTitleDiv);

    const costInfoDiv = document.createElement('div');
    costInfoDiv.className = 'bestseats';
    costInfoDiv.style.color = 'white';
    costDiv.appendChild(costInfoDiv);
    //time
    const timeDiv = document.createElement('div');
    timeDiv.className = 'fmpx board flexbox box';
    timeDiv.style.flexGrow = 1;
    timeDiv.style.flexBasis = '400px';

    const timeTitleDiv = document.createElement('div');
    timeTitleDiv.className = 'title';
    const timeMainDiv = document.createElement('div');
    timeMainDiv.className = 'main';
    timeMainDiv.textContent = '最优时间';
    timeTitleDiv.appendChild(timeMainDiv)
    timeDiv.appendChild(timeTitleDiv);

    const timeInfoDiv = document.createElement('div');
    timeInfoDiv.className = 'bestseats';
    timeInfoDiv.style.color = 'white';
    timeDiv.appendChild(timeInfoDiv);

    const targetElement = document.getElementsByClassName('d-flex flex-row flex-wrap');
    targetElement[0].appendChild(costDiv);
    targetElement[0].appendChild(timeDiv);

    //get oldseat
    $.getJSON({
        "url": ("/DB/Record?handler=TeamYouthTeams"),
        "datatype": "json",
        "contentType": "application/json",
        "type": "GET",
    },function (results) {
        console.log(results);
        $.getJSON({
            "url": ("/Economy/Stadium?handler=StadiumData&id=" + results.actualTeamID),
            "datatype": "json",
            "contentType": "application/json",
            "type": "GET"
        },function (ajaxResults) {
            console.log(ajaxResults);
            const OldSeats=ajaxResults.stadium.stands;
            OldSeats.sea=OldSeats.std;
            delete OldSeats.tot;
            delete OldSeats.std;
            const BestCosts=SeatType.map(type => {
                const oldSeat = OldSeats[type];
                return BestCostsSeats(type, oldSeat);
            });
            costInfoDiv.innerHTML+='VIP专座';
            costInfoDiv.innerHTML += '<br>'
            costInfoDiv.innerHTML+=generateTable(TableHeader,TableValue(SeatType[0],BestCosts[0],OldSeats[SeatType[0]]));
            costInfoDiv.innerHTML += '<br>'
            costInfoDiv.innerHTML+='有顶坐席';
            costInfoDiv.innerHTML += '<br>'
            costInfoDiv.innerHTML+=generateTable(TableHeader,TableValue(SeatType[1],BestCosts[1],OldSeats[SeatType[1]]));
            costInfoDiv.innerHTML += '<br>'
            costInfoDiv.innerHTML+='座位';
            costInfoDiv.innerHTML += '<br>'
            costInfoDiv.innerHTML+=generateTable(TableHeader,TableValue(SeatType[2],BestCosts[2],OldSeats[SeatType[2]]));
            costInfoDiv.innerHTML += '<br>'
            costInfoDiv.innerHTML+='站位';
            costInfoDiv.innerHTML += '<br>'
            costInfoDiv.innerHTML+=generateTable(TableHeader,TableValue(SeatType[3],BestCosts[3],OldSeats[SeatType[3]]));
            const Days = Array.from({ length: 15 }, (_, i) => i + 1);
            const BestTimes=SeatType.map(type => {
                const DaysSeat = Days.map(day =>{
                    return BestTimeSeats(type,day);
                });
                return DaysSeat;
            });
            timeInfoDiv.innerHTML+='VIP专座';
            timeInfoDiv.innerHTML += '<br>'
            timeInfoDiv.innerHTML+=generateTable(TableHeader,TableValue(SeatType[0],BestTimes[0],OldSeats[SeatType[0]]));
            timeInfoDiv.innerHTML += '<br>'
            timeInfoDiv.innerHTML+='有顶坐席';
            timeInfoDiv.innerHTML += '<br>'
            timeInfoDiv.innerHTML+=generateTable(TableHeader,TableValue(SeatType[1],BestTimes[1],OldSeats[SeatType[1]]));
            timeInfoDiv.innerHTML += '<br>'
            timeInfoDiv.innerHTML+='座位';
            timeInfoDiv.innerHTML += '<br>'
            timeInfoDiv.innerHTML+=generateTable(TableHeader,TableValue(SeatType[2],BestTimes[2],OldSeats[SeatType[2]]));
            timeInfoDiv.innerHTML += '<br>'
            timeInfoDiv.innerHTML+='站位';
            timeInfoDiv.innerHTML += '<br>'
            timeInfoDiv.innerHTML+=generateTable(TableHeader,TableValue(SeatType[3],BestTimes[3],OldSeats[SeatType[3]]));
        });
    });
})();