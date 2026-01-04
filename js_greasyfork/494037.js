// ==UserScript==
// @name         Oxy's Revive Enabled Checker
// @namespace    oxy.revivechecker.torn
// @version      0.1.5
// @description  Checks an entire faction's member list and only displays members with revives enabled.
// @author       Oxycodone [2306250]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494037/Oxy%27s%20Revive%20Enabled%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/494037/Oxy%27s%20Revive%20Enabled%20Checker.meta.js
// ==/UserScript==


let api = 'XXXXXXXXXXXXXXXXXXXXXXXXXXX';
let revivesEnabled = [];
let factionMembers = [];

async function hasRevivesEnabled(memberId){
    let playerData = await $.getJSON(`https://api.torn.com/user/${memberId}?selections=&key=${api}`);
    return playerData.revivable == "1";
}

async function checkRevive(factionid){
    for (let memberId of factionMembers){
        if (await hasRevivesEnabled(memberId)){
            revivesEnabled.push(memberId);
        }
    }
    console.log(revivesEnabled);
    reviveFilter();
}

async function getFactionData(fid){
    let factionData = await $.getJSON(`https://api.torn.com/faction/${fid}?selections=&key=${api}`);

    for (let memberId in factionData.members){
        factionMembers.push(memberId);
    }

    console.log(factionMembers);
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

async function insertButton(){
    if ($('#zero-revive').length === 0) {
        var factionid = $('.view-wars').attr('href').split("ranked/")[1];
        var but = `<button id="zero-revive" class="torn-btn">Filter Revives</button>`;
        $('.content-title').append(but);
        await getFactionData(factionid);
        $("#zero-revive").on("click", function () {
            checkRevive(factionid);
        });
    }
}

function main(){
    let url = window.location.href;
    if (url.includes("factions.php?step=profile")){
        insertButton();
    }
}
main();

$(window).on('hashchange', function (e) {
    main();
});
