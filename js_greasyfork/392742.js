// ==UserScript==
// @name         MH: Valour Rift HUD Enhancer
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.3.6
// @description  Changes the text that appears in the Valour Rift hud tooltips to give you the info you actually want to see
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/392742/MH%3A%20Valour%20Rift%20HUD%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/392742/MH%3A%20Valour%20Rift%20HUD%20Enhancer.meta.js
// ==/UserScript==
$(document).ready(function() {
    let page = hg.utils.PageUtil.getCurrentPageTemplateType();
    if ($(".hudLocationContent.rift_valour").get(0)) {
        updateHUD();
    }
});

$('.valourRiftHUD-floorProgress.mousehuntTooltipParent').mouseover(function() {
    updateHUD()
});
$('.valourRiftHUD-huntsRemaining.mousehuntTooltipParent').mouseover(function() {
    updateHUD()
});




function updateHUD(resultString) {
    //How far is the next eclipse floor?
    let floorProg = $('.valourRiftHUD-floorProgress.mousehuntTooltipParent');
    let towerStateA = floorProg.find('.valourRiftHUD-state.tower');
    let stepsTillBoss = calculateSteps('steps');
    let bossProgress = "";
    if ($('.bossProgress').length > 0) {
        bossProgress = $('.bossProgress');
        if (stepsTillBoss == 0) {
            bossProgress.text(" You are on the eclipse floor. Turn on your champion's fire");
        } else if (stepsTillBoss == 1) {
            bossProgress.text('   ' + stepsTillBoss + ' step until the next eclipse floor');
        } else {
            bossProgress.text('   ' + stepsTillBoss + ' steps until the next eclipse floor');
        }
    } else {
        bossProgress = $('<span />').addClass('bossProgress');
        if (stepsTillBoss == 0) {
            bossProgress.text(" You are on the eclipse floor. Turn on your champion's fire");
        } else if (stepsTillBoss == 1) {
            bossProgress.text('   ' + stepsTillBoss + ' step until the next eclipse floor');
        } else {
            bossProgress.text('   ' + stepsTillBoss + ' steps until the next eclipse floor');
        }
        //towerStateA.children().remove();
        //towerStateA.text('');
        //towerStateA.append(bossProgress);
    }
    //
    //Can I make it to the next eclipse floor?
    let huntsRem = $('.valourRiftHUD-huntsRemaining.mousehuntTooltipParent');
    let towerStateB = huntsRem.find('.valourRiftHUD-state.tower');
    let numHuntsRem = parseInt(towerStateB.find('.valourRiftHUD-huntsRemaining-value').text().replace(',', ''), 10);
    if (numHuntsRem == 0) {
        return false
    }
    let SPH = ((stepsTillBoss) / numHuntsRem).toFixed(2);
    let huntToolTip = huntsRem.find('.mousehuntTooltip.tight.right.noEvents');
    let ToolTipText = "";
    if (stepsTillBoss == 0) {
        ToolTipText = 'You are on the eclipse floor now. Good Luck!';
    } else {
        ToolTipText = 'To get to the next eclipse floor, you need a minimum of ' + SPH + ' steps per hunt';
    }
    huntToolTip.text(ToolTipText);
    //
    //What will my tower loot pool look like if I retreat now?
    let UU = $('.valourRiftHUD-activeAugmentations').find('.valourRiftHUD-activeAugmentation.tu.mousehuntTooltipParent').hasClass('active');
    let lootCont = $('.valourRiftHUD-towerLootContainer');
    let sigils = $("[data-item-type|='rift_gaunt_upgrade_a_stat_item']");
    let secrets = $("[data-item-type|='rift_gaunt_upgrade_b_stat_item']");
    let numSigils = parseInt(sigils.first().text().replace(',', ''), 10);
    let numSecrets = parseInt(secrets.first().text().replace(',', ''), 10);
    let cacheSigils = 0;
    let cacheSecrets = 0;
    let retreat = $('.valourRiftHUD-dialog-state.retreat');
    let rewardCache = retreat.find('.valourRiftHUD-dialog-item-name');
    rewardCache.each(function() {
        if ($(this).text() == 'Tower Sigil') {
            cacheSigils = cacheSigils + parseInt($(this).siblings().text().replace(',', ''), 10);
        } else if ($(this).text() == 'Tower Secrets') {
            cacheSecrets = cacheSecrets + parseInt($(this).siblings().text().replace(',', ''), 10);
        }
    });
    let sigilString = (cacheSigils + numSigils) + ' total sigils including cache';
    let secretsString = (cacheSecrets + numSecrets) + ' total secrets including cache';
    let nextFrags = calculateSteps('loot');
    let fragString = '';
    let coreString = '';
    if (UU == true) {
        fragString = 'No fragement drops in ultimate umbra mode';
        coreString = 'The next total eclipse drops ' + nextFrags + ' core(s)';
    } else {
        fragString = 'The next shade drops ' + nextFrags + ' fragment(s)';
        coreString = 'No core drops outside of ultimate umbra mode';
    }
    //
    //Some social commentary courtesy of Warden Slayer
    let retreatButton = $('.valourRiftHUD-retreatButton.mousehuntTooltipParent');
    retreatButton.find('.valourRiftHUD-state.tower').text('  Only mice retreat! Upward to Victory!')
    //
    //
    //How many steps am I averaging per hunt?
    let stepsTaken = $('.valourRiftHUD-stepsTaken.mousehuntTooltipParent');
    let numStepsTaken = parseInt(stepsTaken.find('.valourRiftHUD-stepsTaken-value').text().replace(',', ''), 10);
    let numEclipse = calculateSteps('eclipse');
    let bossExtension = $('.valourRiftHUD-powerUp.boss_extension.mousehuntTooltipParent');
    let siphon = parseInt(bossExtension.find('.valourRiftHUD-powerUp-currentLevel').text().replace(',', ''), 10);
    let SS = $('.valourRiftHUD-activeAugmentations').find('.valourRiftHUD-activeAugmentation.ss.mousehuntTooltipParent');
    //
    let huntLimit = $('.valourRiftHUD-powerUp.hunt_limit.mousehuntTooltipParent');
    let sync = parseInt(huntLimit.find('.valourRiftHUD-powerUp-currentLevel').text().replace(',', ''), 10);
    let totalAvailibleHunts = 0;
    let huntsTaken = 0;
    if (SS.hasClass('active')) {
        totalAvailibleHunts = sync + (numEclipse * siphon * 2);
        huntsTaken = totalAvailibleHunts - numHuntsRem;
    } else {
        totalAvailibleHunts = sync + (numEclipse * siphon);
        huntsTaken = totalAvailibleHunts - numHuntsRem;
    }
    let stepsTakenToolTip = stepsTaken.find('.mousehuntTooltip.tight.right.noEvents');
    let stepsPerHunt = (numStepsTaken / huntsTaken).toFixed(2);
    let stepsString = 'You are averaging ' + stepsPerHunt + ' steps per hunt';
    stepsTakenToolTip.text(stepsString);
    //
    //return
    if (resultString == 'Sigil') {
        return sigilString
    } else if (resultString == 'Secrets') {
        return secretsString
    } else if (resultString == 'Frags') {
        return fragString
    } else if (resultString == 'Cores') {
        return coreString
    } else {
        return false
    }



}
$("[title|='Tower Sigil']").mouseover(function() {
    let huntsRem = $('.valourRiftHUD-huntsRemaining.mousehuntTooltipParent');
    let towerStateB = huntsRem.find('.valourRiftHUD-state.tower');
    let numHuntsRem = parseInt(towerStateB.find('.valourRiftHUD-huntsRemaining-value').text().replace(',', ''), 10);
    if (numHuntsRem > 0) {
        $("[title|='Tower Sigil']").attr('title', updateHUD('Sigil'));
    }
});
$("[title|='Tower Secrets']").mouseover(function() {
    let huntsRem = $('.valourRiftHUD-huntsRemaining.mousehuntTooltipParent');
    let towerStateB = huntsRem.find('.valourRiftHUD-state.tower');
    let numHuntsRem = parseInt(towerStateB.find('.valourRiftHUD-huntsRemaining-value').text().replace(',', ''), 10);
    if (numHuntsRem > 0) {
        $("[title|='Tower Secrets']").attr('title', updateHUD('Secrets'));
    }
})
$("[title|='Fragment of the Eclipse']").mouseover(function() {
    let huntsRem = $('.valourRiftHUD-huntsRemaining.mousehuntTooltipParent');
    let towerStateB = huntsRem.find('.valourRiftHUD-state.tower');
    let numHuntsRem = parseInt(towerStateB.find('.valourRiftHUD-huntsRemaining-value').text().replace(',', ''), 10);
    if (numHuntsRem > 0) {
        $("[title|='Fragment of the Eclipse']").attr('title', updateHUD('Frags'));
    }
})
$("[title|='Core of the Eclipse']").mouseover(function() {
    let huntsRem = $('.valourRiftHUD-huntsRemaining.mousehuntTooltipParent');
    let towerStateB = huntsRem.find('.valourRiftHUD-state.tower');
    let numHuntsRem = parseInt(towerStateB.find('.valourRiftHUD-huntsRemaining-value').text().replace(',', ''), 10);
    if (numHuntsRem > 0) {
        $("[title|='Core of the Eclipse']").attr('title', updateHUD('Cores'));
    }
})


function calculateSteps(hinge) {
    let towerState = $('.valourRiftHUD-state.tower');
    let stepsTaken = parseInt(towerState.find('.valourRiftHUD-stepsTaken-value').text().replace(',', ''), 10);
    let stepsRem = 0;
    let nextFrags = 0;
    let numEclipse = 0;
    if (stepsTaken < 140) {
        stepsRem = 140 - stepsTaken;
        nextFrags = 1;
        numEclipse = 0;
    } else if (stepsTaken == 140) {
        nextFrags = 1;
        numEclipse = 0;
    } else if (stepsTaken < 351) {
        stepsRem = 351 - stepsTaken;
        nextFrags = 3;
        numEclipse = 1;
    } else if (stepsTaken == 351) {
        nextFrags = 3;
        numEclipse = 1;
    } else if (stepsTaken < 632) {
        stepsRem = 632 - stepsTaken;
        nextFrags = 5;
        numEclipse = 2;
    } else if (stepsTaken == 632) {
        nextFrags = 5;
        numEclipse = 2;
    } else if (stepsTaken < 983) {
        stepsRem = 983 - stepsTaken;
        nextFrags = 7;
        numEclipse = 3;
    } else if (stepsTaken == 983) {
        nextFrags = 7;
        numEclipse = 3;
    } else if (stepsTaken < 1404) {
        stepsRem = 1404 - stepsTaken;
        nextFrags = 9;
        numEclipse = 4;
    } else if (stepsTaken == 1404) {
        nextFrags = 9;
        numEclipse = 4;
    } else if (stepsTaken < 1895) {
        stepsRem = 1895 - stepsTaken;
        nextFrags = 11;
        numEclipse = 5;
    } else if (stepsTaken == 1895) {
        nextFrags = 11;
        numEclipse = 5;
    } else if (stepsTaken < 2456) {
        stepsRem = 2456 - stepsTaken;
        nextFrags = 13;
        numEclipse = 6;
    } else if (stepsTaken == 2456) {
        nextFrags = 13;
        numEclipse = 6;
    } else if (stepsTaken < 3087) {
        stepsRem = 3087 - stepsTaken;
        nextFrags = 15;
        numEclipse = 7;
    } else if (stepsTaken == 3087) {
        nextFrags = 15;
        numEclipse = 7;
    } else if (stepsTaken < 3788) {
        stepsRem = 3788 - stepsTaken;
        nextFrags = 17;
        numEclipse = 8;
    } else if (stepsTaken == 3788) {
        nextFrags = 17;
        numEclipse = 8;
    } else if (stepsTaken < 4559) {
        stepsRem = 4559 - stepsTaken;
        nextFrags = 19;
        numEclipse = 9;
    } else if (stepsTaken == 4559) {
        nextFrags = 19;
        numEclipse = 9;
    } else if (stepsTaken < 5400) {
        stepsRem = 5400 - stepsTaken;
        nextFrags = 22;
        numEclipse = 10;
    } else if (stepsTaken == 5400) {
        nextFrags = 22;
        numEclipse = 10;
    } else if (stepsTaken < 6311) {
        stepsRem = 6311 - stepsTaken;
        nextFrags = 25;
        numEclipse = 11;
    } else if (stepsTaken == 6311) {
        nextFrags = 25;
        numEclipse = 11;
    } else if (stepsTaken < 7292) {
        stepsRem = 7292 - stepsTaken;
        nextFrags = 28;
        numEclipse = 12;
    } else if (stepsTaken == 7292) {
        nextFrags = 28;
        numEclipse = 12;
    } else if (stepsTaken < 8343) {
        stepsRem = 8343 - stepsTaken;
        nextFrags = 31;
        numEclipse = 13;
    } else if (stepsTaken == 8343) {
        nextFrags = 31;
        numEclipse = 13;
    } else if (stepsTaken < 9464) {
        stepsRem = 9464 - stepsTaken;
        nextFrags = 34;
        numEclipse = 14;
    } else if (stepsTaken == 9464) {
        nextFrags = 34;
        numEclipse = 14;
    } else if (stepsTaken < 10655) {
        stepsRem = 10655 - stepsTaken;
        nextFrags = 37;
        numEclipse = 15;
    } else if (stepsTaken == 10655) {
        nextFrags = 37;
        numEclipse = 15;
    } else if (stepsTaken < 11916) {
        stepsRem = 11916 - stepsTaken;
        nextFrags = 40;
        numEclipse = 16;
    } else if (stepsTaken == 11916) {
        nextFrags = 40;
        numEclipse = 16;
    } else if (stepsTaken < 13247) {
        stepsRem = 13247 - stepsTaken;
        nextFrags = 43;
        numEclipse = 17;
    } else if (stepsTaken == 13247) {
        nextFrags = 43;
        numEclipse = 17;
    } else if (stepsTaken < 14648) {
        stepsRem = 14648 - stepsTaken;
        nextFrags = 46;
        numEclipse = 18;
    } else if (stepsTaken == 14648) {
        nextFrags = 43;
        numEclipse = 18;
    } else if (stepsTaken < 16119) {
        stepsRem = 16119 - stepsTaken;
        nextFrags = 46;
        numEclipse = 19;
    } else if (stepsTaken == 16119) {
        nextFrags = 46;
        numEclipse = 19;
    } else if (stepsTaken < 17660) {
        stepsRem = 17660 - stepsTaken;
        nextFrags = 49;
        numEclipse = 20;
    } else if (stepsTaken == 17660) {
        nextFrags = 49;
        numEclipse = 20;
    } else if (stepsTaken < 19271) {
        stepsRem = 19271 - stepsTaken;
        nextFrags = 52;
        numEclipse = 21;
    } else if (stepsTaken == 19271) {
        nextFrags = 52;
        numEclipse = 21;
    } else if (stepsTaken < 20952) {
        stepsRem = 20952 - stepsTaken;
        nextFrags = 55;
        numEclipse = 22;
    } else if (stepsTaken == 20952) {
        nextFrags = 55;
        numEclipse = 22;
    } else if (stepsTaken < 22703) {
        stepsRem = 22703 - stepsTaken;
        nextFrags = 58;
        numEclipse = 23;
    } else if (stepsTaken == 22703) {
        nextFrags = 58;
        numEclipse = 23;
    } else if (stepsTaken < 24524) {
        stepsRem = 24524 - stepsTaken;
        nextFrags = 61;
        numEclipse = 24;
    } else if (stepsTaken == 24524) {
        nextFrags = 61;
        numEclipse = 24;
    }
    if (hinge == 'steps') {
        return stepsRem
    } else if (hinge == 'eclipse') {
        return numEclipse
    } else {
        return nextFrags
    }
}
//high five friends
