// ==UserScript==
// @name         Jaspers Facebook Ad Remover
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  try to take over the world!
// @author       Jasper Stevens
// @match        *://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395724/Jaspers%20Facebook%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/395724/Jaspers%20Facebook%20Ad%20Remover.meta.js
// ==/UserScript==

HideAds();//Remove ads on initial load

window.addEventListener('scroll', () => {
    HideAds();
    //setTimeout(HideAds, 3000);//We don't need to stinkin' timeout
});

function HideAds() {
    //console.log("HideAds is called"); //DEBUG
    //This calls the functions which attempt to remove sponsored posts
    document.querySelectorAll('[id^="hyperfeed_story').forEach(item => removeIfSponsored(item));
    //This line is to be used as an identification mechanism for debug purposes
    //document.querySelectorAll('[id^="hyperfeed_story').forEach(item => { item.querySelectorAll('.p_l3ief1xjb').forEach(child => { item.style="color: red;"; console.log("Removed a sponsored post"); }); item.querySelectorAll('._3nlk').forEach(child => { item.style="color: red;"; console.log("Removed a political sponsored post"); }); });
    //This line attempts to remove all sponsored posts as a one liner
    //document.querySelectorAll('[id^="hyperfeed_story').forEach(item => { item.querySelectorAll('.p_l3ief1xjb').forEach(child => { item.remove(); console.log("Removed a sponsored post"); }); item.querySelectorAll('._3nlk').forEach(child => { item.remove(); console.log("Removed a political sponsored post"); }); });

    var adPane = document.getElementById('pagelet_ego_pane');
    if(adPane != 'undefined' && adPane != null)
    {
        adPane.remove();
        console.log("Removed ad pane");
    }
}

function removeIfSponsored(item)
{

    //r_l3ief0x_z j_l3ief0x_m g_l3ief0x_k <--- These classes are specified on the sponsored text
    item.querySelectorAll('.p_l3ief1xjb').forEach(child => {
        var title = child.parentElement.parentElement.querySelector('h5').innerText;
        item.remove(); console.log(`Removed a sponsored post by: ${title}`);
    });

    if(item != undefined)
    {
        removeIfPoliticalSponsored(item);
    }
}

function removeIfPoliticalSponsored(item) {
    item.querySelectorAll('._3nlk').forEach(child => { item.remove(); console.log(`Removed a political sponsored post`); });
}

