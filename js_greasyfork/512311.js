// ==UserScript==
// @name         Last Attackers
// @namespace    lastattackers.zero.nao
// @version      0.3
// @description  last attackers
// @author       nao
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @connect      docs.google.com
// @downloadURL https://update.greasyfork.org/scripts/512311/Last%20Attackers.user.js
// @updateURL https://update.greasyfork.org/scripts/512311/Last%20Attackers.meta.js
// ==/UserScript==


// link : https://docs.google.com/spreadsheets/d/1RRxVm4hvPcsJh3MvnjQGcehEZu2z1EeZiYRhDK0Bu5Y/edit?usp=sharing
let api = "";

let wurl = window.location.href;
let attacker_id = wurl.split("XID=")[1];

const sheetId = '1vEo2A4MwwiRo_Go_BybzcLJCeqF-1Kw_uQhKcI3vcMI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'users';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;

function main(){
    getData();


}

async function getData(){
    GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload:async function(response) {
            // console.log(response);
            var rep = response.responseText;

            var jdata = JSON.parse(rep.substr(47).slice(0,-2));
            console.log(jdata);

            for (var row = 0; row < jdata.table.rows.length; row++){
                let rdata = String(jdata.table.rows[row].c[0].v);
                console.log(rdata);
                let rattackers = JSON.parse(jdata.table.rows[row].c[1].v);
                if (rdata == attacker_id){
                    insertData(rattackers);
                    console.log(rattackers);
                    break;
                }

            }





        }
    });
}

async function insertData(li){
    if ($(".main-desc").length == 0){
        setTimeout(function(){
            insertData(li);
        },1000);
        return;
    }

    for (let id of li){
        if (!id){
            continue;
        }
        let status = await $.getJSON(`https://api.torn.com/user/${id}?selections=&key=${api}`);
        status = status.last_action.status;
        let color = "gray";
        if (status == "Idle"){
            color = "yellow";
        }
        else if (status == "Online"){
            color = "green";
        }
        let insertion = `<span><a style="color:${color};" href="https://www.torn.com/profiles.php?XID=${id}">${id} </a></span>`;

        $(".main-desc").append(insertion);
    }

}


main();