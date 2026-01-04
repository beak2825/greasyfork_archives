// ==UserScript==
// @name         MH: Floating Islands HUD Enhancer
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.7.1
// @description  See more thing on your floating islands HUD!
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/419909/MH%3A%20Floating%20Islands%20HUD%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/419909/MH%3A%20Floating%20Islands%20HUD%20Enhancer.meta.js
// ==/UserScript==
$(document).ready(function() {
    const debug = localStorage.getItem('ws.debug');
    if (user.environment_name == 'Floating Islands') {
        if (debug == true) {
            console.log('FI Script Started');
        }
        loadFunction()
    } else {
        if (debug == true) {
            console.log('Not in the FI');
        }
    }
});

function loadFunction() {
    updateAndRender();
    setTimeout(renderSkyMap, 100);
}

$(document).ajaxComplete(function(event,xhr,options){
    //console.log(options.url);
    if (options.url == 'https://www.mousehuntgame.com/managers/ajax/mice/getstat.php') {
        //console.log('mice');
    } else if (options.url == 'https://www.mousehuntgame.com/managers/ajax/users/userInventory.php') {
        //console.log('items');
    } else {
        // console.log('some other ajax');
        if (user.environment_name == 'Floating Islands') {
            loadFunction();
        }
    }
});

//HUD Code
function updateAndRender() {
    hg.utils.UserInventory.getItem('empyrean_codex_page_stat_item', function(data) {
        localStorage.setItem('ws.fi.numPages', data.quantity);
        hg.utils.UserInventory.getItem('floating_islands_cloud_gem_stat_item', function(data) {
            localStorage.setItem('ws.fi.numGlass', data.quantity);
            hg.utils.UserInventory.getItem('floating_islands_sky_ore_stat_item', function(data) {
                localStorage.setItem('ws.fi.numOre', data.quantity);
                renderHUD();
            }, true);
        }, true);
    }, true);
}

function renderHUD() {
    const ShowPages = localStorage.getItem('ws.fi.showPages');
    let empyreanPages = $('.floatingIslandsHUD-statItem[data-item-type="empyrean_codex_page_stat_item"]');
    if (empyreanPages.length > 0 ) {
    } else {
        const itemContainer = $('.floatingIslandsHUD-statItemContainer');
        const statItem = $(itemContainer).find('.floatingIslandsHUD-statItem[data-item-type="bottled_wind_stat_item"]');
        let empyreanPages = $(statItem ).clone().appendTo(itemContainer);
        $(empyreanPages).find('.floatingIslandsHUD-item-image.bottled_wind_stat_item').removeClass('bottled_wind_stat_item').addClass('empyrean_codex_page_stat_item');
        $(empyreanPages).find('*').removeAttr('data-item-type').attr('data-item-type', 'empyrean_codex_page_stat_item');
        $(empyreanPages).removeAttr('data-item-type').attr('data-item-type', 'empyrean_codex_page_stat_item');
        $(empyreanPages).find('.floatingIslandsHUD-inventoryBag-item-name').text('Empyrean Codex Page');
        const pageCount = parseInt(localStorage.getItem('ws.fi.numPages'),10);
        $(empyreanPages).find('.floatingIslandsHUD-statItem-quantity.quantity').text(pageCount);
        empyreanPages.removeAttr("href").removeAttr("onclick");
        $('.floatingIslandsHUD-item-image.empyrean_codex_page_stat_item').css({
            'background-image': 'url(https://www.mousehuntgame.com/images/items/stats/5d8cf4e7ab765abc5b4a72c44bae6b98.gif?cv=2)',
        });
        $(empyreanPages).find('.floatingIslandsHUD-state.floatingIslandsHUD-island').text('Empyrean Codex Page');
    }
    if (ShowPages == "Y") {
        $(empyreanPages).removeClass('hidden');
    } else {
        $(empyreanPages).addClass('hidden');
    }
    //Hide Wind on islands not launchpad
    if (user.quests.QuestFloatingIslands.hunting_site_atts.hunts_remaining != null) {
        $('.floatingIslandsHUD-statItem.mousehuntTooltipParent').filter('[data-item-type=bottled_wind_stat_item]').hide();
    }
    //wind on maybe
    const useWind = localStorage.getItem('ws.fi.useWind');
    const numWind = parseInt($('.floatingIslandsHUD-statItem-quantity.quantity').filter('[data-item-type=bottled_wind_stat_item]').text(),10);
    if (useWind == 'yes') {
        if (user.quests.QuestFloatingIslands.hunting_site_atts.is_fuel_enabled) {
            localStorage.setItem('ws.fi.useWind', 'no');
        } else {
            if (numWind > 0 ) {
                hg.views.HeadsUpDisplayFloatingIslandsView.toggleFuel();
            }
        }
    }
    //Hide retreat button if the warden/paragon is not caught already
    if (user.quests.QuestFloatingIslands.hunting_site_atts.has_defeated_enemy) {
        $('.floatingIslandsHUD-retreatButton').show();
    } else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_enemy_encounter) {
        $('.floatingIslandsHUD-retreatButton').hide();
    } else if (user.quests.QuestFloatingIslands.hunting_site_atts.has_encountered_enemy) {
        $('.floatingIslandsHUD-retreatButton').show();
    } else {
        $('.floatingIslandsHUD-retreatButton').hide();
    }
    showOreGlass();
    showBossProgress();
}
$(document).on('click', '.floatingIslandsHUD-statItem[data-item-type="empyrean_codex_page_stat_item"]', function() {
    hg.views.ItemView.show('empyrean_codex_page_stat_item');
    //hg.views.ItemView.show($(this).attr('data-type'))
})

function showOreGlass() {
    const oculusLevel = user.quests.QuestFloatingIslands.airship.oculus_level;
    const skyGlass = $('.floatingIslandsHUD-craftingItem.floating_islands_cloud_gem_stat_item').find("[data-item-type=floating_islands_cloud_gem_stat_item]");
    const skyGlassQty = parseInt(localStorage.getItem('ws.fi.numGlass'), 10);
    const skyOre = $('.floatingIslandsHUD-craftingItem.floating_islands_sky_ore_stat_item').find("[data-item-type=floating_islands_sky_ore_stat_item]");
    const skyOreQty = parseInt(localStorage.getItem('ws.fi.numOre'), 10);
    let upgradeCost = 0;
    if (oculusLevel == 1) {
        upgradeCost = 35;
    } else if (oculusLevel == 2) {
        upgradeCost = 150;
    } else if (oculusLevel == 3) {
        upgradeCost = 500;
    } else if (oculusLevel == 4) {
        upgradeCost = '1.2k';
    } else if (oculusLevel == 5) {
        upgradeCost = '2k';
    } else if (oculusLevel == 6) {
        upgradeCost = '3.5k';
    } else if (oculusLevel == 7) {
        upgradeCost = '8k';
    } else if (oculusLevel == 8) {
        upgradeCost = '10k';
    } else if (oculusLevel == 9) {
        upgradeCost = '2.5k';
    }
    $(skyGlass).text(skyGlassQty + '/' + upgradeCost);
    $(skyOre).text(skyOreQty + '/' + upgradeCost);
}

function showBossProgress() {
    const allRemainingHunts = user.quests.QuestFloatingIslands.hunting_site_atts.enemy_encounter_hunts_remaining;
    let warGons = 'Paragon: ';
    if (user.quests.QuestFloatingIslands.hunting_site_atts.has_enemy == null) {
        warGons = 'Enemy: ';
    } else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude == null) {
        warGons = 'Warden: ';
    } else if (user.quests.QuestFloatingIslands.hunting_site_atts.is_vault_island != null) {
        warGons = 'Empress: ';
    }
    $('.floatingIslandsHUD-enemy-state.enemyApproaching:not(.enemyActive)').text(warGons + allRemainingHunts);
}

function renderItemBag() {
    const itemBagBody = $('.floatingIslandsHUD-inventoryBag-itemContainer');
    const empyreanTroves = $('.floatingIslandsHUD-inventoryBag-item[data-item-type="empyrean_floating_loot_cache_convertible"]');
    let empyreanPages = "";
    empyreanPages = $(empyreanTroves).clone().appendTo(itemBagBody)
    $(empyreanPages).removeClass('active').removeClass('inactive');
    const ShowPages = localStorage.getItem('ws.fi.showPages');
    if (ShowPages == "Y") {
        $(empyreanPages).addClass('active');
    } else {
        $(empyreanPages).addClass('inactive');
    }
    $(empyreanPages).find('.floatingIslandsHUD-item-image.empyrean_floating_loot_cache_convertible').removeClass('empyrean_floating_loot_cache_convertible').addClass('empyrean_codex_page_stat_item');
    $('.floatingIslandsHUD-item-image.empyrean_codex_page_stat_item').find('*').removeAttr('data-item-type').attr('data-item-type', 'empyrean_codex_page_stat_item');
    $(empyreanPages).removeAttr('data-item-type').attr('data-item-type', 'empyrean_codex_page_stat_item');
    $(empyreanPages).find('.floatingIslandsHUD-inventoryBag-item-name').text('Empyrean Codex Page');
    const pageCount = parseInt(localStorage.getItem('ws.fi.numPages'),10);
    $(empyreanPages).find('.floatingIslandsHUD-inventoryBag-item-quantity.quantity').text(pageCount);
    $('.floatingIslandsHUD-item-image.empyrean_codex_page_stat_item').css({
        'background-image': 'url(https://www.mousehuntgame.com/images/items/stats/5d8cf4e7ab765abc5b4a72c44bae6b98.gif?cv=2)',
    });
    //
    itemBagBody.children().on('click', function () {hg.views.ItemView.show($(this).attr('data-item-type'))});
}

$(document).on('click', '.floatingIslandsHUD-inventoryBagButton.mousehuntTooltipParent', function() {
    renderItemBag();
})
$(document).on('click', '.floatingIslandsHUD-inventoryBag-item-toggleButton[data-item-type="empyrean_codex_page_stat_item"]', function() {
    const empyreanPages = $('.floatingIslandsHUD-inventoryBag-item[data-item-type="empyrean_codex_page_stat_item"]');
    if (empyreanPages.hasClass('inactive')) {
        empyreanPages.removeClass('inactive').addClass('active');
        localStorage.setItem('ws.fi.showPages',"Y");
    } else if (empyreanPages.hasClass('active')) {
        empyreanPages.removeClass('active').addClass('inactive');
        localStorage.setItem('ws.fi.showPages',"");
    } else {
        empyreanPages.addClass('active');
        localStorage.setItem('ws.fi.showPages',"Y");
    }
})

//Paragon Overlay
function renderSkyMap() {
    drawParagons()
    //         const body = $('.floatingIslandsAdventureBoard-container.paragon.loading.skyMap');
    //          $(body).removeAttr("href").removeAttr("onclick");
    //             const trapLibrary = $('.floatingIslandsAdventureBoard-trapLibrary-text:not(.wind)');
    //             let useWindDiv = $('.floatingIslandsAdventureBoard-trapLibrary-text.wind');
    //             if ($(useWindDiv).length == 0) {
    //                 useWindDiv = $(trapLibrary).clone().appendTo(body);
    //                 $(useWindDiv).addClass('wind');
    //             }
    //             let useWindCb = $(useWindDiv).find('.floatingIslandsAdventureBoard-trapLibrary-checkbox');
    //             $(useWindCb).addClass('wind');
    //             $(useWindDiv).children().empty().append(useWindCb).append("Use Wind");
    //         forceWind();
}

function forceWind() {
    const windBox = $('.floatingIslandsAdventureBoard-trapLibrary-checkbox.wind');
    const useWind = localStorage.getItem('ws.fi.useWind');
    if (useWind == 'yes') {
        $(windBox).prop('checked',true)
    } else {
        $(windBox).prop('checked',false)
    }
}

// $(document).on('click', '.floatingIslandsAdventureBoard-trapLibrary-text:not(.wind)', function() {
//     if ($('.floatingIslandsAdventureBoard-trapLibrary').hasClass('disabled')){
//     } else {
//         hg.views.FloatingIslandsAdventureBoardView.toggleUseSavedSetup()
//         setTimeout(forceWind, 500)
//     }
// })
// $(document).on('click', '.floatingIslandsAdventureBoard-trapLibrary-text.wind', function() {
//     const windBox = $('.floatingIslandsAdventureBoard-trapLibrary-checkbox.wind');
//     const useWind = localStorage.getItem('ws.fi.useWind');
//     if ($('.floatingIslandsAdventureBoard-trapLibrary').hasClass('disabled')){
//     } else {
//         if (useWind == 'yes') {
//             $(windBox).prop('checked',false)
//             localStorage.setItem('ws.fi.useWind', 'no')
//         } else {
//             $(windBox).prop('checked',true)
//             localStorage.setItem('ws.fi.useWind', 'yes')
//         }
//     }
// })

function drawParagons() {
    const overlayCont = $('.floatingIslandsAdventureBoard-container');
    if (overlayCont.length == 1) {
        const allParagons = $('.floatingIslandsHUD-powerType:not(.fipcmask)');
        $(allParagons).each(function(e){
            const thisParagon = $(this);
            hg.utils.MouseUtil.getMouse(thisParagon.context.classList[1]+'_paragon', function(resp,) {
                setTimeout(function(){thisParagon.text(resp.num_catches); }, (10-e)*35);
            })
        })
    }
    $('.floatingIslandsHUD-powerType').css({
        'font-size': '14x',
        'font-weight': 'bold',
        'color': 'blue',
    });
}


