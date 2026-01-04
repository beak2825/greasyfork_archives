// ==UserScript==
// @name         oXyZodone
// @namespace    oxyzodone.zero.torn
// @version      0.1
// @description  oxycustomcodene
// @author       -zero [2669774]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473151/oXyZodone.user.js
// @updateURL https://update.greasyfork.org/scripts/473151/oXyZodone.meta.js
// ==/UserScript==

let api = '';

let links = {
    "Test": "https://www.torn.com",

};

let revivesEnabled = [];
let factionMembers = [];

let warId = '';
let warStartTime = '';

async function insert(){
    if ($('.view-wars').length == 0){
        setTimeout(insert, 300);
        return;
    }
    var factionid = $('.view-wars').attr('href').split("ranked/")[1];
    var but = `<button id="zero-revive" class="torn-btn">Filter Revives</button>`;
    $('.content-title').append(but);

    await getFactionData(factionid);

    $("#zero-revive").on("click", function(){
        checkRevive(factionid);
    });
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

function insertStartTime(){
    if ($(`div[data-warid="${warId}"]`)){
        console.log("War start time: " + warStartTime);
        if ($(`#startime-${warId}`).length == 0){
            $(`div[data-warid="${warId}"]`).append(`<span id="startime-${warId}">${new Date(parseInt(warStartTime)*1000)}</span>`);

        }
        
    }
    else{
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

    $('div.toggle-content___BJ9Q9').append(elm);

}

$(window).on('hashchange', function (e) {
    main();
});



