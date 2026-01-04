// ==UserScript==
// @name         Faction Timer
// @namespace    factiontimer.zero.torn
// @version      0.2
// @description  modifies fetch response and adds a timer
// @author       -zero [2669774]
// @match       https://www.torn.com/factions.php?step=profile*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473523/Faction%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/473523/Faction%20Timer.meta.js
// ==/UserScript==

//activityLogUserData


let timerEnabled = true;
let mdata = [];
let memberData = {};



const { fetch: origFetch } = window;
window.fetch = async (...args) => {
    console.log("fetch called with args:", args);

    const response = await origFetch(...args);

    if (response.url.includes('/page.php?sid=factionsProfile&step=getInfo&factionId')) {
        //  console.log("REsponseL : "+response);
        mdata = [];

        let clonedResponse = response.clone();
        let clonedJ = await clonedResponse.json();

        for (let member of clonedJ.members) {
            let hosp = member.status.text;
            if (hosp == "Hospital") {
                let memberId = member.userID;
                let time = member.icons.split("data-time='")[1].split("'")[0];
                memberData[memberId] = time;
                time = convert(time);

                member.status.text = time;

            }
            mdata.push(member);
        }

        clonedJ.members = mdata;
        let modifiedResponse = JSON.stringify(clonedJ);

        modifiedResponse = new Response(modifiedResponse, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });

        console.log("Modified");

        return modifiedResponse;



    }



    return response;
};

function convert(t) {
    if (t <= 0){
        return "+ OUT +";
    }
    let hours = Math.floor(t / 3600);
    t = t % 3600;
    let minutes = Math.floor(t / 60);
    t = t % 60;
    let seconds = t;

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (t < 10) {
        t = "0" + t;
    }

    return `${hours}:${minutes}:${t}`;

}

function update() {
    $('.table-row').each(function () {
        let mid = $('div[id$="-user"]', $(this));
        if ($(mid).length == 0) {
            return;
        }

        mid = mid.attr("id").split("_")[0];

        if (memberData[mid]) {
            memberData[mid]--;
            let ntime = convert(memberData[mid]);
            $('.status > span', $(this)).html(ntime);
        }
    });

    $(".members-list > li").each(function(){
        let mid = $('div[id$="-user"]', $(this));
        if ($(mid).length == 0) {
            return;
        }

        mid = mid.attr("id").split("_")[0];
        if (memberData[mid]) {
            let ntime = convert(memberData[mid]);
            $('.status', $(this)).html(ntime);
        }
    });
}

window.onload = () => {
    if (timerEnabled){
        setInterval(update, 1000);

    }

    
}
