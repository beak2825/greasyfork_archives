// ==UserScript==
// @name         Coinhive stopper
// @namespace    http://leond.online
// @version      0.3
// @description  simply stops coinhive's miners
// @author       Timothy Wall
// @match        *://thepiratebay.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33382/Coinhive%20stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/33382/Coinhive%20stopper.meta.js
// ==/UserScript==

/**
 * Functions
 */
const checkMiner = (count) => {
    if (!count) {
        count = 0;
    }
    if (count < 3) {
        if (miner) {
            return true;
        }
        if (!miner) {
            count++;
            setTimeout(checkMiner(count), 10);
        }
    }
    if (count >= 3) {
        if (miner) {
            return true;
        }
        if (!miner) {
            return false;
        }
    }
};

const checkCoinHive = (count) => {
    if (!count) {
        count = 0;
    }
    if (count < 3) {
        if (CoinHive) {
            return true;
        }
        if (!CoinHive) {
            count++;
            setTimeout(checkCoinHive(count), 10);
        }
    }
    if (count >= 3) {
        if (CoinHive) {
            return true;
        }
        if (!CoinHive) {
            return false;
        }
    }
};

const stopMiner = () => {
    if (miner.isRunning()) {
        miner.stop();
        if (!miner.isRunning()) {
            return true;
        }
        if (miner.isRunning()) {
            return false;
        }
    }
    if (checkMiner() && !miner.isRunning) {
        return true;
    }
};

const removeMiner = () => {
    if (miner.isRunning()) {
        console.log('Miner still running');
        return false;
    }
    if (miner) {
        miner = undefined;
        if (!miner) {
            return true;
        }
        if (miner) {
            return false;
        }
    }
};

const removeCoinHive = () => {
    if (CoinHive) {
        CoinHive = undefined;
        if (!CoinHive) {
            return true;
        }
        if (CoinHive) {
            return false;
        }
    }
};

/**
 * Main
 */
window.addEventListener('load', () =>{
    if(checkCoinHive()){
        if(removeCoinHive()){
            console.log('CoinHive Method removed');
        }
    }
    if(checkMiner()){
        if(stopMiner()){
            if(removeMiner()){
                console.log('Miner stopped and method removed');
            }
            if(!removeMiner()){
                console.log('Unable to remove miner method');
            }
        }
        if(!stopMiner()){
            console.log('Unable to stop miner');
        }
    }
    if(!checkMiner()){
        console.log('No Miner Found');
    }
});