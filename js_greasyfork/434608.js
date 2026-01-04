// ==UserScript==
// @name        Melvor Auto Bury Bones
// @namespace   http://tampermonkey.net/
// @version     0.3
// @description Automatically buries bones so you gain prayer points while keeping inventory clean
// @author      WhackyGirl
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @exclude     https://*.melvoridle.com/index.php
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/434608/Melvor%20Auto%20Bury%20Bones.user.js
// @updateURL https://update.greasyfork.org/scripts/434608/Melvor%20Auto%20Bury%20Bones.meta.js
// ==/UserScript==

var bonesToAutoBury = [];

function injectDomElements() {
    var buryableItemIds = [439, 500, 506, 666, 440, 441];

    let sideBar = document.createElement('div');
    sideBar.style.setProperty('position', 'fixed');
    sideBar.style.setProperty('right', '-230px');
    sideBar.style.setProperty('top', '5rem');
    sideBar.style.setProperty('height', '240px');
    sideBar.style.setProperty('width', '230px');
    sideBar.style.setProperty('overflow', 'auto');
    sideBar.style.setProperty('padding', '15px');
    sideBar.style.setProperty('z-index', '999');
    sideBar.style.setProperty('transition', 'right 500ms ease');
    sideBar.style.setProperty('background-color', '#fcfbf3');
    sideBar.style.setProperty('border-radius', '6px 0 0 6px');

    $('#page-container').append(sideBar);

    $(sideBar).append("<p style='margin-bottom: 5px'><strong>Choose bones to bury:</strong></p>")

    buryableItemIds.forEach(function (boneId, index) {
        $(sideBar).append(
            $(document.createElement('input')).prop({
                name: 'buryable-bones',
                value: items[boneId].name,
                type: 'checkbox'
            }).css("margin-right", "5px")
        ).append(
            $('<img />', {
                src: items[boneId].media,
                width: '20px',
                height: '20px'
            }).css("margin-right", "5px")
        ).append(
            $(document.createElement('label')).html(items[boneId].name)
        ).append(document.createElement('br'));

    });

    let sideBarButton = document.createElement('div');
    sideBarButton.style.setProperty('position', 'absolute');
    sideBarButton.style.setProperty('right', '0');
    sideBarButton.style.setProperty('top', '100px');
    sideBarButton.style.setProperty('display', 'flex');
    sideBarButton.style.setProperty('align-items', 'center');
    sideBarButton.style.setProperty('border-radius', '6px 0 0 6px');
    sideBarButton.style.setProperty('height', '50px');
    sideBarButton.style.setProperty('width', '30px');
    sideBarButton.style.setProperty('z-index', '999');
    sideBarButton.style.setProperty('transition', 'right 500ms ease');
    sideBarButton.style.setProperty('background-color', '#fcfbf3');
    $('#page-container').append(sideBarButton);

    $(sideBarButton).append(
        $('<img />', {
            src: SKILLS[17].media,
            width: '20px',
            height: '20px'
        }).css("margin", "0 auto")
    );

    window.toggleAutoBuryBonesSidebar = () =>  {
        sideBar.style.setProperty('right', sideBar.style.getPropertyValue('right') == '-230px' ? '0' : '-230px');
        sideBarButton.style.setProperty('right', sideBarButton.style.getPropertyValue('right') == '230px' ? '0' : '230px');
    };

    sideBarButton.addEventListener('click', toggleAutoBuryBonesSidebar);

    $("[name='buryable-bones']").each(function( index ) {
        $(this).change(function() {
            if(this.checked) {
                if(!bonesToAutoBury.includes(buryableItemIds[index]))
                    bonesToAutoBury.push(buryableItemIds[index])
            } else {
                bonesToAutoBury = jQuery.grep(bonesToAutoBury, function(value) {
                    return value != buryableItemIds[index];
                });
            }
        });
    });
}

function loadScript() {
    if (confirmedLoaded) {
        // Only load script after game has opened
        clearInterval(scriptLoader);
        injectDomElements();
    }
}

function getBonesData() {
    return bonesToAutoBury;
}

const scriptLoader = setInterval(loadScript, 200);

var autobury = setInterval(() => {
    bank.forEach(function(item, bankID) {
        if(getBonesData().includes(item.id)) {
            const qty = item.qty;
            updateItemInBank(bankID, item.id, -qty);
            player.addPrayerPoints(items[item.id].prayerPoints * qty);
        }
    });
}, 600);