// ==UserScript==
// @name         Torn: Track city shop buys
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Tracks your daily city buys
// @author       Rescender [2526540]
// @match        https://www.torn.com/shops.php?step=*
// @match        https://www.torn.com/bigalgunshop.php
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423974/Torn%3A%20Track%20city%20shop%20buys.user.js
// @updateURL https://update.greasyfork.org/scripts/423974/Torn%3A%20Track%20city%20shop%20buys.meta.js
// ==/UserScript==
// success message

var dailyCityBuys = JSON.parse(GM_getValue("dailyCityBuys", null));

if (!dailyCityBuys) {
    dailyCityBuys = {totalcount:0, items:[], timestamp: new Date().getTime()};
    GM_setValue("dailyCityBuys", JSON.stringify(dailyCityBuys));
} else {
    if (new Date(Date.now()).getUTCDay() != new Date(dailyCityBuys.timestamp).getUTCDay()) {
        GM_setValue("dailyCityBuys", JSON.stringify({totalcount:0, items:[], timestamp: new Date().getTime()}));
    }
}

const observeThis = ".buy-items-wrap";


let count = 0;
let total = 0;
let item = '';
const observer = new MutationObserver((mutations) => {
    let buys = JSON.parse(GM_getValue("dailyCityBuys"));
    mutations.forEach(mut => {
        if(mut.target.className === "count") {
            count = mut.target.innerText;
        }
        if(mut.target.className === "total") {
            total = mut.target.innerText;
        }
        if(mut.target.className === "success") {
            let msg = mut.target.innerText;
            let item = msg.split(' x ')[1].split(' item')[0];

            buys.totalcount = parseInt(buys.totalcount, 10) + parseInt(count, 10);

            if (buys.items.find(i => i.item == item)) {
                var foundItem = buys.items.find(i => i.item == item);
                foundItem.number = parseInt(foundItem.number, 10) + parseInt(count, 10);
            } else {
                buys.items.push({item: item, number: parseInt(count, 10)});
            }
            buys.timestamp = new Date().getTime();
            GM_setValue("dailyCityBuys", JSON.stringify(buys));
            tableCreate();
        }
    });
});

const updateUiTable = function() {
    var buys = JSON.parse(GM_getValue("dailyCityBuys"));
    let node = document.createElement("table");
    node.className = "city_buys";

    buys.items.forEach(item => {
        var newRow = document.createElement("table");
    });

    $(".delimiter-999:last").before(node);
};

function tableCreate(){
    $(".city_buys").remove();
    $(".buys_total").remove();
    var buys = JSON.parse(GM_getValue("dailyCityBuys"));

    let node = document.createElement("table");
    node.className = "city_buys";
    var thead = document.createElement('thead');
    var thr = document.createElement('tr');
    thead.appendChild(thr)
    var th1 = document.createElement('th');
    var th2 = document.createElement('th');
    th1.appendChild(document.createTextNode('Item'));
    th2.appendChild(document.createTextNode('Count'));
    thr.appendChild(th1);
    thr.appendChild(th2);
    node.appendChild(thead);

    var tbdy = document.createElement('tbody');
    for (var i = 0; i < buys.items.length; i++) {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.appendChild(document.createTextNode(buys.items[i].item));
        var td2 = document.createElement('td');
        td2.appendChild(document.createTextNode(buys.items[i].number));
        tr.appendChild(td1)
        tr.appendChild(td2)

        tbdy.appendChild(tr);
    }
    node.appendChild(tbdy);

    $(".delimiter-999:last").before(node);
    $(".city_buys").after(`<div class="buys_total"> Today's purchases: ${buys.totalcount} (${100-buys.totalcount} left)</div>`);
};

GM_addStyle(`
table.city_buys {
  border: 3px solid #1C6EA4;
  background-color: #DCEEBE;
  width: 40%;
  text-align: left;
  border-collapse: collapse;
  position: relative;
  display: inline-table;
}
table.city_buys td, table.city_buys th {
  border: 1px solid #AAAAAA;
  padding: 2px 4px;
}
table.city_buys tbody td {
  font-size: 13px;
}
table.city_buys tr:nth-child(even) {
  background: #D0E4F5;
}
table.city_buys thead {
  background: #1C6EA4;
  background: -moz-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  background: -webkit-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  border-bottom: 2px solid #444444;
}
table.city_buys thead th {
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  border-left: 2px solid #D0E4F5;
}
table.city_buys thead th:first-child {
  border-left: none;
}

table.city_buys tfoot td {
  font-size: 14px;
}
table.city_buys tfoot .links {
  text-align: right;
}
table.city_buys tfoot .links a{
  display: inline-block;
  background: #1C6EA4;
  color: #FFFFFF;
  padding: 2px 8px;
  border-radius: 5px;
}
.buys_total {
  font-size: 18px;
  position: relative;
  display: inline;
}
		`);

(function() {
    'use strict';
    tableCreate();
    observer.observe($(observeThis).get(0), { subtree: true, childList: true });
})();