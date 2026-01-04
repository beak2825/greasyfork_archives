// ==UserScript==
// @name         MH: Warpath Wave Calculator
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.3
// @description  Keeps track of remaining wave mice to help you manage the wave.
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/390221/MH%3A%20Warpath%20Wave%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/390221/MH%3A%20Warpath%20Wave%20Calculator.meta.js
// ==/UserScript==
$(document).ready(function() {
    const debug = localStorage.getItem('ws.debug');
    if (user.environment_name == 'Fiery Warpath') {
        if (debug == true) {
            console.log('FW Script Started');
        }
        updateWave();
        renderHUD();
    } else {
        if (debug == true) {
            console.log('Not at the FW');
        }
    }
});

$(document).ajaxComplete(function(){
    if (user.environment_name == 'Fiery Warpath') {
        updateWave();
        renderHUD();
    }
});

function updateWave() {
    const debug = localStorage.getItem('ws.debug');
    let waveRetreat = 0;
    let waveMice = "";
    let remainingWaveMice = {};
    let totalRemaining = 0;
    let streaked = 0;
    let retreatText = "";
    let resultString = "";
    const streak = parseInt($('.warpathHUD-streak-quantity').text(), 10);
    if (debug == true) {
        console.log('Updating Wave...Current Streak:',streak);
    }
    if ($('.warpathHUD.wave_1').get(0)) {
        waveRetreat = 10;
        waveMice = $('.warpathHUD-wave.wave_1').children();
    } else if ($('.warpathHUD.wave_2').get(0)) {
        waveRetreat = 18;
        waveMice = $('.warpathHUD-wave.wave_2').children();
    } else if ($('.warpathHUD.wave_3').get(0)) {
        waveRetreat = 26;
        waveMice = $('.warpathHUD-wave.wave_3').children();
    } else {
        if (debug == true) {
            console.log('Wave 4: Update Stopped');
        }
        return
    }
    if (debug == true) {
        console.log('Wave Retreat@',waveRetreat);
    }
    waveMice.each(function() {
        const thisRemaning = parseInt($(this).find('.warpathHUD-wave-mouse-population').text(), 10);
        let thisStreaked = 0;
        if (thisRemaning >= streak) {
            thisStreaked = streak;
        } else {
            thisStreaked = thisRemaning;
        }
        const thisMouse = new mouseClass(thisRemaning,thisStreaked);
        remainingWaveMice[$(this).attr('data-mouse')] = thisMouse;
        totalRemaining += thisRemaning;
        streaked += thisStreaked;
    })
    if (debug == true) {
        console.log('Mouse Breakdown:',remainingWaveMice);
    }
    const panicMeter = $('.warpathHUD-moraleBar.mousehuntTooltipParent');
    if (totalRemaining > waveRetreat) {
        const retreatingIn = totalRemaining - waveRetreat;
        if (retreatingIn > 1) {
            retreatText = retreatingIn + " catches left";
        } else {
            retreatText = "Last Catch!";
        }
    } else {
        retreatText = "Retreated";
    }
    $(panicMeter).text(retreatText).css({
        'padding': '1px',
        'font-size': '10px',
        'font-weight': 'bold',
        'text-align': 'center'
    });
    if (debug == true) {
        console.log('Retreat Text:',retreatText);
    }
    let highLow = (totalRemaining - streaked) - waveRetreat;
    if (highLow > 0) {
        highLow = '+'+highLow;
    }
    if (retreatText == "Retreated") {
        resultString = "The commanders have retreated";
    } else {
        resultString = "Wave commander cutoff: " + waveRetreat + "\nMice left after commander: " + (totalRemaining - streaked) + " (" + highLow + ")";
    }
    if (debug == true) {
        console.log('Hover Text:',resultString);
    }
    return resultString
}

function mouseClass(remaining,streaked) {
    this.remaining = remaining;
    this.streaked = streaked;
}

$('.warpathHUD-moraleBar.mousehuntTooltipParent').mouseover(function() {
    const title = updateWave();
    $('.warpathHUD-moraleBar.mousehuntTooltipParent').attr('title', title);
    $('.warpathHUD-moraleBar.mousehuntTooltipParent').css('cursor', 'pointer');
});

function renderHUD() {
    let container = $('.warpathHUD-streakContainer');
    if ($('#snipingButton').get(0)) {
        //dont add another button but you may need to update the text/title
    } else {
        const thisButton = document.createElement("button");
        thisButton.id = 'snipingButton';
        $(thisButton).addClass('mousehuntActionButton small');
        const title = 'Copy Snipes';
        $(thisButton).attr('title', title);
        const snipinglText = document.createElement('span');
        $(snipinglText).addClass('travelText').text("Sniping").css({
            'font-size': '12px',
            'top': '-3px',
            'left': '-2px',
        });
        $(thisButton).css({
            'width': '58px',
            'height': '22%',
            'top': '-20px',
            'position': 'absolute',
        });
        $(thisButton).append(snipinglText);
        container.prepend(thisButton);
    }
}

$(document).on('click', '#snipingButton', function() {
    let snipingListingText = "";
    let waveMice = "";
    let price = "";
    if ($('.warpathHUD.wave_1').get(0)) {
        waveMice = "Wave 1";
        price = 'N SB+';
        snipingListingText = "Sniping:"+"\n"+waveMice+' - '+price;
    } else if ($('.warpathHUD.wave_2').get(0)) {
        waveMice = "Wave 2";
        price = 'N SB+';
        snipingListingText = "Sniping:"+"\n"+waveMice+' - '+price;
    } else if ($('.warpathHUD.wave_3').get(0)) {
        waveMice = "Wave 3";
        price = 'N SB+';
        snipingListingText = "Sniping:"+"\n"+waveMice+' - '+price;
    } else {
        waveMice = "Warmonger";
        price = 'N SB+';
        const wardenCount = $('.warpathHUD-wave-mouse.desert_elite_gaurd').find('.warpathHUD-wave-mouse-population').first().text();
        if (wardenCount == 1) {
            snipingListingText = "Sniping:"+"\n"+waveMice+' - '+price+"\n"+wardenCount+" Warden Remaining (N SB+ ea)";
        } else if (wardenCount > 0) {
            snipingListingText = "Sniping:"+"\n"+waveMice+' - '+price+"\n"+wardenCount+" Wardens Remaining (N SB+ ea)";
        } else {
            snipingListingText = "Sniping:"+"\n"+waveMice+' - '+price+' RTC';
        }

    }
    GM_setClipboard(snipingListingText)
})
