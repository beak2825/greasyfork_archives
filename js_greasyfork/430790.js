// ==UserScript==
// @name         Depo Summarize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Depo Rent Summary for the past day 
// @author       Naturef
// @match        https://www.lordswm.com/sklad_info.php?id=*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://www.google.com/s2/favicons?domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430790/Depo%20Summarize.user.js
// @updateURL https://update.greasyfork.org/scripts/430790/Depo%20Summarize.meta.js
// ==/UserScript==

let depoLogURL = document.location.toString();
depoLogURL = depoLogURL.split('info').join('log');
depoLogURL += '&page=';
console.log(depoLogURL);
const numDays = 1 ;

let serverTimeZone = "+03:00"

function main()
{
    var logs = document.querySelector('a[href^="sklad_log"]');
    var span = document.createElement('span');
    span.setAttribute("style","text-decoration:underline;cursor:pointer");
    span.innerHTML = '(Summarize Depo)';
    span.onclick = async function()
    {
        document.body.style.cursor = 'wait';
        await getLogsProcessAndShow();
        document.body.style.cursor = 'default';
    };
    logs.parentNode.appendChild(span);
}

async function getLogsProcessAndShow()
{
    let logs = await getLogsForLast(numDays);
    logs = logs.reverse();
    console.log(logs.slice(0,7));
    let processedList = processLogs(logs);
    showList(processedList);
}

main();

function showList(list)
{
    var tab = document.querySelector('table[class="wb"]').firstChild;

    let tr = $("<tr class='wbwhite' colspan='5'></tr>");
    let div = $('<div align="center"><b>Depo Summary</b></div>');
    tr.append(div);

    tab.appendChild(tr[0]);

    let tbl = $("<table cellspacing='20'><tbody id='processedList'><tr><td><b>Art Name</b></td><td><b>Start Time</b></td><td><b>End Time</b></td></tr></tbody></table>");
    tr.append(tbl);
    let tbody = $('#processedList',tbl);

    for(let i = 0 ; i < list.length ; i++)
    {
        let entry = list[i].split('#');
        let tentry = document.createElement('tr');
        tentry.innerHTML = "<td>" + entry[0] + "</td><td>" + entry[1] + "</td><td>" + entry[2] + "</td>";
        tbody.append(tentry);
    }
}

function processLogs(logs)
{
    let len = logs.length
    var map = new Map();
    var finalList = [];

    for(let i = 0 ; i < len ; i++)
    {
        let entry = logs[i];
        let artName = entry.split("'")[1];
        let date = entry.split(" ")[0].split("T").join(" ").split("+")[0];

        // console.log(date, artName);

        if(entry.includes('rented'))
        {
            if(map.has(artName))
            {
                map.get(artName).push(date);
            }
            else
            {
                map.set(artName, [date]);
            }

        }
        else if(entry.includes('returned'))
        {
            if(!map.has(artName))
                continue ;

            let allRentDates = map.get(artName);
            let rentDate = allRentDates.pop();

            if(allRentDates.length == 0)
                map.delete(artName);

            finalList.push(artName + "#" + rentDate + "#" + date);
        }
    }

    finalList.sort();
    console.log(finalList);
    return finalList;
}

async function getLogsForLast(numDays)
{
    var currDate = new Date().getDate();
    let currPage = 0 ;

    let arr = [];

    while(1)
    {
        let logPage = depoLogURL + currPage.toString();
        var el = document.createElement('html');
        el.innerHTML = await request(logPage);
        var foundin = Array.from(el.querySelectorAll('a[href^="pl_info"]')[0].parentNode.childNodes) ;
        foundin = foundin.filter(function (node){ return node.nodeName == '#text' });

        var breakLoop = false ;

        for(let i = 0 ; i < foundin.length - 1 ; i += 2)
        {
            var date = foundin[i].textContent.slice(0, -2).split(" ").join("T").trim() + serverTimeZone ;
            var info = foundin[i+1].textContent;

            let thisDate = new Date(date);
            var diffDays = parseInt((currDate - thisDate.getDate()) / (1000 * 60 * 60 * 24), 10);

            if(diffDays > numDays - 1)
            {
                breakLoop = true;
                break;
            }

            arr.push(date.toString() + " " + info);
        }

        if(breakLoop)
            break;

        currPage++ ;
    }

    return arr;
}

async function request(url)
{
    return new Promise(function(resolve, reject)
                       {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.status)
                }
            }
        }
        xhr.ontimeout = function () {
            reject('timeout')
        }
        xhr.open('get', url, true)
        xhr.send()
    });
}