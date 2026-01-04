// ==UserScript==
// @name           Count_leadpoints
// @namespace      profcrow
// @author         Professor Crow
// @description    Подсчет лидерства вражеских армий ГЛ
// @version        0.15
// @homepage       https://greasyfork.org/ru/scripts/376751-count-leadpoints
// @encoding       utf-8
// @include        https://www.heroeswm.ru/leader_guild.php*
// @include        http://178.248.235.15/leader_guild.php*
// @grant          GM_xmlhttpRequest
// @grant          GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/376751/Count_leadpoints.user.js
// @updateURL https://update.greasyfork.org/scripts/376751/Count_leadpoints.meta.js
// ==/UserScript==

if (!this.GM_xmlhttpRequest) {
    this.GM_xmlhttpRequest=GM.xmlHttpRequest
}


countLeadpoints();
function countLeadpoints(){
    const is_ressurect = document.body.innerHTML.includes("редких существ");

    let table;
    if(is_ressurect) table = document.querySelectorAll("table.wb")[1];
    else table = document.querySelector("table.wb");

    if (table != null){
        const tasks = table.querySelectorAll("tbody tr");
        [1, 5, 9].forEach((i)=>{
            const task = tasks[i];
            const creatures = task.querySelectorAll(".cre_creature");
            let promises = []
            creatures.forEach((creatureDIV) => {
                const creatureHREF = creatureDIV.querySelector("a").href;
                const creatureName = creatureDIV.querySelector("img").title;
                const count = parseInt(creatureDIV.querySelector("#add_now_count").innerHTML);
                promises.push(getPricePromise(creatureHREF, creatureName, count));
            });
            Promise.all(promises).then(prices => addResultToNode(task, countPrice(prices)),
                                       err => addResultToNode(task, err));
        });
    }

    function getPricePromise(creatureHREF, creatureName, count){
        return new Promise(function (resolve, reject){
            GM_xmlhttpRequest({
                method: "GET",
                url: creatureHREF,
                onload: (res) =>{
                    let creatureDOM = new DOMParser().parseFromString(res.responseText, "text/html");
                    let leadDIV = creatureDOM.querySelectorAll("div.scroll_content_half")[9];
                    let price = leadDIV.querySelector("div").innerHTML.replace(",","");
                    price == "?" ?
                        resolve({"known":false, "name":creatureName, "count":count}) :
                    resolve({"known":true, "price":parseInt(price), "count":count});
                },
                onerror: () => {reject("XHR_ERR")}
            });
        });
    }

    function countPrice(units){
        let unknowns = [];
        let sum = 0;
        units.forEach((unit)=>{
            if (unit.known) sum += unit.count * unit.price;
            else unknowns.push(unit);
        })
        let unknownsObj = unknowns.reduce((acc, item) => {
            const name = item.name;
            if(!(name in acc)){acc[name] = 0}
            acc[name] += item.count;
            return acc;
        }, {})

        let result = `Известно: <b>${sum}</b> лидерства`;
        if (unknowns.length > 0){
            result += "<br>Неизвестно: ";
            let unknownsStringWithCount = []
            for (let name in unknownsObj){
                unknownsStringWithCount.push(`${name}(${unknownsObj[name]})`);
            }
            result += unknownsStringWithCount.join(", ");
        }
        return result;
    }

    function addResultToNode(node, result){
        var parent = node.querySelector("td");
        parent.insertAdjacentHTML('beforeend', result);
    }
}