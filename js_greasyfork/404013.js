// ==UserScript==
// @name         Optimal Singularity Level
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display the optimal singularity level
// @author       hexy
// @match        https://patcailmemer.github.io/Ordinal-Markup/
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/404013/Optimal%20Singularity%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/404013/Optimal%20Singularity%20Level.meta.js
// ==/UserScript==

function numManifolds(singLevel) {
    return (getSingLevel() + game.manifolds - game.sing.m) - singLevel
}

function getManifoldEffectWSingLevel(singLevel) {
    return (Math.max(1,numManifolds(singLevel)+1)**0.5)*(game.iups[4-1]==1?3:1)*(game.iups[4]==1?1.26:1)
}

function calcBupTotalMultWOFactorWSingLevel(singLevel) {
    return 2*getBoostFromBoosters()*game.assCard[1].mult.toNumber()*(game.aups.includes(1)?getManifoldEffectWSingLevel(singLevel):1)*(1.2**game.dups[2])
}

function calcOptimalSingLevel() {
    let timeForAllFactorShifts=0
    let maxChallengeCompMult=1
    for (let i=1;i<9;i++) {
        timeForAllFactorShifts += calcFactorShiftTime(i)
        if (i != 8) maxChallengeCompMult *= (([9,8,7,4,4,3,2][i-1]+1+(game.upgrades.includes(11)?3:0))*(game.upgrades.includes(1)?2:1))**([0,0.5,0.75,1][game.challengeCompletion[i-1]])
        if (i == 8) maxChallengeCompMult *= getDynamicFactorCap()**getChalCurve([game.chal8Comp])
    }
    let tier3BoostTime = 1/game.boostAuto.toNumber()
    let optimalFBRate = 0
    let optimalSingLevel = 0
    let maxSingLevel = getSingLevel() + game.manifolds - game.sing.m
    for (let singLevel = 1; singLevel <= maxSingLevel; singLevel++) {
        let tier2AutoRate = 1e270*calcBupTotalMultWOFactorWSingLevel(singLevel)*maxChallengeCompMult*calcIncrementyMult(game.maxIncrementyRate.pow(0.9))*(game.aups.includes(4)?Math.log10(Math.log10(1e280)):1)
        let FBRate = (2*singLevel-1)/Math.max(tier3BoostTime,timeForAllFactorShifts+V(27)*3**(singLevel-1)/tier2AutoRate)
        if (FBRate >= optimalFBRate) {
            optimalFBRate = FBRate
            optimalSingLevel = singLevel
        }
    }

    return optimalSingLevel
}

(function() {
    'use strict';

    let optimalSingPara = document.createElement('p')
    optimalSingPara.id = 'optimalSing'
    optimalSingPara.style = 'text-align: center'
    document.getElementById('csubTab5').appendChild(optimalSingPara)

    window.setInterval(function() {
        optimalSingPara.innerText = 'Optimal singularity level: ' + calcOptimalSingLevel()
    }, game.msint)
})();