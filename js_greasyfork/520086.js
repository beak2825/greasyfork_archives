// ==UserScript==
// @name         AutoFlag
// @version      0.1
// @description  Auto Farmení vlajek přes šlechtu
// @author       AlweR
// @match        https://*.divokekmeny.cz/game.php?village=*&screen=train&mode=mass_decommission
// @match        https://*.divokekmeny.cz/game.php?village=*&screen=train&mode=mass
// @match        https://*.divokekmeny.cz/game.php?village=*&screen=train&mode=success&action=train_mass&page=-1
// @icon         https://www.google.com/s2/favicons?domain=divokekmeny.cz

// @grant        none
// @namespace https://greasyfork.org/users/1015401
// @downloadURL https://update.greasyfork.org/scripts/520086/AutoFlag.user.js
// @updateURL https://update.greasyfork.org/scripts/520086/AutoFlag.meta.js
// ==/UserScript==
(function() {
    console.log("start");
    var pos = 1;
    var pos2 = 4;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mode = urlParams.get('mode');
    console.log(mode);
    if(mode == "success")
    {

        console.log("succ");
        console.log(queryString);
        var r = gotoNext("mass_decommission", queryString);
        console.log(r);
    }
    if(mode != "mass")
    {
        pos = pos-1;
        pos2 = pos2-1;
    }

    var btns = document.getElementsByClassName("btn");
    var insertButton = btns[pos];
    var confirmButton = btns[pos2];
    insertButton.click();
    console.log("click");
    setTimeout(function()
    {
        confirmButton.click();
        var btns2 = document.getElementsByClassName("btn-confirm-yes");
        btns2[0].click();
        console.log("submit");
        if(mode == "mass")
        {
            setTimeout(gotoNext("mass_decommission", queryString),getRandom(7200000,7200999));
        }
        else if(mode == "mass_decommission")
        {
            setTimeout(gotoNext("mass", queryString),getRandom(3000000,3000999));
        }
    }, 2000);
})();

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
function gotoNext(mode_s, search) {
    var str = replaceQueryParam('mode', mode_s, search)
    const urlParams = new URLSearchParams(str);
    urlParams.delete("action");
    urlParams.delete("page");




    window.location = window.location.pathname + str;
}

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}