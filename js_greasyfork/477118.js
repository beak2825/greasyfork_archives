// ==UserScript==
// @name         oXyZodone
// @namespace    oxyzodone.zero.torn
// @version      0.1.2
// @description  oxycustomcodene
// @author       -zero [2669774]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477118/oXyZodone.user.js
// @updateURL https://update.greasyfork.org/scripts/477118/oXyZodone.meta.js
// ==/UserScript==

let api = 'XXXXXXXXXXXXXXXXXXXXXXXXX';

let links = {
    "PI Vault": "https://www.torn.com/properties.php#/p=options&tab=vault",
    "Faction Vault": "https://www.torn.com/factions.php?step=your#/tab=armoury",
    "Give to User": "https://www.torn.com/factions.php?step=your&type=1#/tab=controls&option=give-to-user",
    "OCs": "https://www.torn.com/factions.php?step=your#/tab=crimes",
    "Travel": "https://www.torn.com/travelagency.php",


};

let revivesEnabled = [];
let factionMembers = [];

let warId = '';
let warStartTime = '';



async function insert() {
    if ($('#zero-revive').length === 0) { // Check if the button doesn't exist
        var factionid = $('.view-wars').attr('href').split("ranked/")[1];
        var but = `<button id="zero-revive" class="torn-btn">Filter Revives</button>`;
        $('.content-title').append(but);

        await getFactionData(factionid);

        $("#zero-revive").on("click", function () {
            checkRevive(factionid);
        });
    }
}



async function hasRevivesEnable(memberId){
    let playerData =await $.getJSON(`https://api.torn.com/user/${memberId}?selections=&key=${api}`);
    if (playerData.revivable == "1"){
        console.log(memberId + " " + playerData.revivable);
        return true;
    }
    return false;
}


async function checkRevive(factionid){
    
    for (let memberId of factionMembers){
        let reviveStatus = await hasRevivesEnable(memberId);

        if (reviveStatus){
            revivesEnabled.push(memberId);
        }

    }
    console.log(revivesEnabled);

    reviveFilter();
}

async function getFactionData(fid){
    let factionData = await $.getJSON(`https://api.torn.com/faction/${fid}?selections=&key=${api}`);

    for (let war in factionData.ranked_wars){
        warId = war;
        warStartTime = factionData.ranked_wars[war].war.start;
    }

    for (let memberId in factionData.members){
        factionMembers.push(memberId);
    }

    console.log(warId +" " +warStartTime);
    console.log(factionMembers);

    if (warStartTime){
        insertStartTime();
    }

}



function insertStartTime() {
    if ($(`div[data-warid="${warId}"]`) && $(`#startime-${warId}`).length === 0) {
        console.log("War start time: " + warStartTime);
        const startTime = new Date(parseInt(warStartTime) * 1000);

        // Format time for EST/EDT/local time in 24-hour format
        const localOptions = {
            weekday: 'long', // Day of the week (e.g., "Sunday")
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false, // 24-hour format
            timeZone: 'America/New_York' // Adjust to your preferred time zone
        };
        const localTime = startTime.toLocaleString('en-US', localOptions);

        // Format time for UTC in 24-hour format
        const utcOptions = {
            weekday: 'long', // Day of the week (e.g., "Sunday")
            timeZone: 'UTC',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false // 24-hour format
        };
        const utcTime = startTime.toLocaleString('en-US', utcOptions);

        // Display both times with a line break between them
        $(`div[data-warid="${warId}"]`).append(`<span id="startime-${warId}">Local Time: ${localTime}<br>UTC: ${utcTime}</span>`);
    } else {
        setTimeout(insertStartTime, 500);
    }
}







function reviveFilter(){
    $('.table-body > li').each(function(){
        let data = $(this).html();
        for (let reviveMember of revivesEnabled){
            if (data.includes(reviveMember)){
                return;
            }
        }
        $(this).remove();
    });
}





function main(){
    let url = window.location.href;
    if (url.includes("factions.php?step=profile")){
        insert();
    }
    insertLinks();   
}
main();

function insertLinks(){
    if ($('.zerolinks').length > 0){
        return;
    }
    let elm = ``;

    for (let linkname in links){
        elm += `<div class="zerolinks"><div><a href="${links[linkname]}" class="desktopLink___SG2RU" i-data="i_0_512_172_23"><span class="svgIconWrap___AMIqR"><svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt " filter="url(#svg_sidebar_mobile)" fill="url(#sidebar_svg_gradient_regular_mobile)" stroke="transparent" stroke-width="0" width="16" height="15" viewBox="0 0 16 15"><path d="m13,12h2l-.8-4h.8v-1h-2v1h.8l-.8,4Zm-8,0h2l-.8-4h.8v-1h-2v1h.8l-.8,4Zm4,0h2l-.8-4h.8v-1h-2v1h.8l-.8,4Zm-8,0h2l-.8-4h.8v-1H1v1h.8l-.8,4Zm.37-7.84c-1.31,1.02-1.03,1.84.63,1.84h12c1.66,0,1.94-.83.63-1.84L8,0,1.37,4.16Zm-.37,8.84l-1,2h16l-1-2H1Z"></path></svg></span><span class="linkName___FoKha">${linkname}</span></a></div></div>`;
    }

    $($('div.toggle-content___BJ9Q9')[0]).append(elm);

}

$(window).on('hashchange', function (e) {
    main();
});



