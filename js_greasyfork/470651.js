// ==UserScript==
// @name         wows_mark_ships
// @namespace    http://tampermonkey.net/
// @version      2025.01.10.1
// @description  wows mark owned ships
// @author       jacky
// @license      MIT
// @match        https://armory.worldofwarships.asia/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldofwarships.asia
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.4.0/jquery.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470651/wows_mark_ships.user.js
// @updateURL https://update.greasyfork.org/scripts/470651/wows_mark_ships.meta.js
// ==/UserScript==

window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);
var ships=[], flags=[], crews=[];

const { fetch: _fetch } = window;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await _fetch(resource, config);
    // https://vortex.worldofwarships.asia/api/inventory/
    // https://vortex.worldofwarships.asia/api/get_lootbox/
    var m = /api\/(inventory|get_lootbox)/.exec(resource);
    if (m){
        try {

            const _json = await response.clone().json();
            switch (m[1]){
                case 'inventory':
                    parse(_json);
                    break;

                case 'get_lootbox':
                    loot(_json);
                    break;
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    return response;
};

function parse(data){
    if (data.status == "ok") {
        if (ships.length > 0){
            $.each(ships, function(k, v) {
                if (data.data.ships.indexOf(v) > -1){
                    $(`#${v}`).css("background-color","green");
                }
            });
        }
        if (flags.length > 0){
            var a = JSON.stringify(data.data.permoflages);
            $.each(flags, function(k, v) {
                var b = JSON.stringify(v);
                if (a.indexOf(b) > -1){
                    $(`#${v[0]}`).css("background-color","green");
                }
            });
        }

        if (crews.length > 0){
            $.each(crews, function(k, v) {
                if (data.data.storage[v]){
                    $(`#${v}`).css("background-color","green");
                }
            });
        }
    }
}

function loot(data){
    if (data.data.slots && data.data.slots.length > 0) {
        if ($('#a').length > 0)
            $('#a').empty();
        else {
            if ($('.BundlePage_rightContent').length == 0)
                $('.BundlePage_content').append('<div class="BundlePage_rightContent"></div>');
            else
                $('.BundlePage_rightContent').empty();
            $('.BundlePage_rightContent').append('<table id="a"></table>');
        }
        ships = [], flags = [], crews = [];
        $.each(data.data.slots, function() {
            $.each(this.valuableRewards, function() {
                $.each(this.rewards, function(k, v) {
                    var d = v.additionalData;
                    switch (v.type){
                        case 'ship':
                            $('#a').append(`<tr id="${v.id}"><td>${v.id}</td><td>${d.title}</td><td>${d.level}</td><td>${d.nation.localization.mark.zhSg}</td><td>${d.type.localization.mark.zhSg}</td><td>${d.isPremium}</td></tr>`);
                            ships.push(v.id);
                            break;

                        case 'crew':
                            $('#a').append(`<tr id="${v.id}"><td>${v.id}</td><td>${d.title}</td><td>${v.crewLevel}</td><td>${v.shipId}</td><td>${d.nation.localization.mark.zhSg}</td><td>${d.hasSampleVo}</td></tr>`);
                            crews.push(v.id);
                            break;

                        default:
                            $('#a').append(`<tr id="${v.id}"><td>${v.type}</td><td>${v.id}<br>${d.title}</td><td>${d.ship.id}<br>${d.ship.title}</td><td>${d.ship.level}</td><td>${d.ship.type}<br>${d.ship.nation}</td><td>${d.ship.isPremium}</td></tr>`);
                            flags.push([v.id, d.ship.id]);
                            break;
                    }
                });
            });
        });
    }
}



function DOM_ContentReady () {
    GM_addStyle("table{border:solid 1px white;border-collapse:collapse;font-size:16px !important;}");
    GM_addStyle("td{border:solid 1px white;border-collapse:collapse;padding-left:5px;padding-right:5px;color:white !important;}");
}

function pageFullyLoaded () {

}
