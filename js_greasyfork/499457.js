// ==UserScript==
// @name         SayAi
// @namespace    http://tampermonkey.net/
// @version      6.8
// @description  空投
// @author       酥哈哈
// @match        *://*.starrynift.art/*
// @match        https://www.baidu.com/
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blockx.fun
// @grant        none
// @match        https://miles.plumenetwork.xyz/nest-staking
// @match        https://miles.plumenetwork.xyz/plume-arc
// @match        https://app.mysticfinance.xyz/en/lend
// @match        https://dev-plume.landx.co/
// @match        https://app.elyfi.world/pools/plumetestnet/10
// @match        https://app.solidviolet.com/tokens/1
// @match        https://adamdefi.io/swap
// @match        https://dev-plume.landx.co/products/xBasket
// @match        https://pentagon.games/sign-in
// @match        https://testnet.musicprotocol.finance/
// @match        https://testnet.kappalending.com/#/market
// @match        https://app.pluralfinance.com/plume-testnet/?signed_in=true
// @match        *://*.blockx.fun/*
// @match        *://*.sidequest.rcade.game/*
// @match        *://*.forge.gg/*
// @match        https://app.pluralfinance.com/plume-testnet/
// @match        *://*.space3.gg/*
// @match        *://*.adamdefi.io/*
// @match        *://*.testnet.kappalending.com/*
// @match        *://*.testnet.zulunetwork.io/*
// @match        https://testnet.zulunetwork.io/lwazi?code=6S4TVJ
// @match        *://*.testnet.grofidex.io/*
// @match        *://*.u2quest.io/*
// @match        *://*.faucet.uniultra.xyz/*
// @match        *://*.testnet.blockfun.io/*
// @match        *://*.miles.plumenetwork.xyz/*
// @match        *://*.plume.ambient.finance/*
// @match        *://*.faucet.plumenetwork.xyz/*
// @match        *://*.miles.plumenetwork.xyz/*
// @match        *://*.theiachat.chainbase.com/*
// @match        *://*.genesis.chainbase.com/*
// @match        *://*.landshare-plume-sandbox.web.app/*
// @match        *://*.plume.kuma.bond/*
// @license MIT
// @match        *://*.app.solidviolet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grofidex.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499457/SayAi.user.js
// @updateURL https://update.greasyfork.org/scripts/499457/SayAi.meta.js
// ==/UserScript==
function generateRandomNumberString(length) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
const invalidEvent = new Event('invalid', { bubbles: true, cancelable: true })
function generateRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

(function() {
    let buy = sessionStorage.getItem('buy');
    let sell = sessionStorage.getItem('sell');
    let staking = sessionStorage.getItem('staking');
    let arcName = sessionStorage.getItem('arcName');
    let arcDes = sessionStorage.getItem('arcDes');
    let solusd = sessionStorage.getItem('solusd');
    let zuluswap = sessionStorage.getItem('zuluswap');
    var falg1 = true;
    var falg2 = true;
    var falg3 = true;
    var falg4 = true;
    var i = 0;
    let result = '';
    'use strict';
    setInterval(() => {
        if (window.location.href == 'https://testnet.grofidex.io/trade' || window.location.href == 'https://testnet.grofidex.io/trade?chain=u2uNebulas'){
            const buyTargetElement = document.querySelector("#swap-currency-input > div._1a5xov70._1qhetbf7._1qhetbf1d._1qhetbf4v._1qhetbf7l._1qhetbf3fm._1qhetbf23g > label > div._1a5xov70._1qhetbf1s6._1qhetbf1mc._1qhetbf1pg._1qhetbf7._1qhetbf1k._1qhetbf4v._1qhetbf3ve._1qhetbf1u4._1qhetbf2rk > input")
            if(buyTargetElement){
                if (buyTargetElement.value<=0) {
                    buyTargetElement.focus();
                    document.execCommand('insertText', false, '1');
                    buyTargetElement.dispatchEvent(invalidEvent);
                    i++;
                }
            }
            if(i==2){
                var sus = document.querySelector("#__next > section > ol > li > div > div > div.sc-jrkPcm.iqWDBF > div")
                if(sus && !falg1){
                    window.open('https://u2quest.io/group/191837?type=campaign&ref=4236134392','_self');
                }
            }
            var value = document.querySelector("#__next > div:nth-child(5) > div > div.sc-hLclGa.sc-fEyylQ.kkKarq.cagFIC > div > div.sc-eDnVMP.sc-gKHVLF.sc-ksJisA.jprOhX.UlmxL.llZPKh > div > h2")
            if(value && value.innerHTML ==="Confirm Buy"){
                falg1 = false;
            }
        }
        if (window.location.href == 'https://miles.plumenetwork.xyz/nest-staking'){
            const stakingTargetElement = document.querySelector("#tabs-\\:r6\\:--tabpanel-0 > div > div.chakra-input__group.css-1oliy19 > div.chakra-numberinput.css-6fsd0v > input")
            if(stakingTargetElement && falg1){
                stakingTargetElement.focus();
                falg1=false;
                document.execCommand('insertText', false, '1');
                stakingTargetElement.dispatchEvent(invalidEvent);
            }
             setTimeout(() => {
                 const stakingTargetElementaf = document.querySelector("#tabs-\\:r6\\:--tabpanel-0 > div > div.chakra-input__group.css-1oliy19 > div.chakra-numberinput.css-6fsd0v > input")
                 if(stakingTargetElementaf){
                     if (stakingTargetElementaf.value !== '1') {
                         falg1=true;
                     }
                  }
             },30000)
        }
        if (window.location.href == 'https://miles.plumenetwork.xyz/plume-arc'){
            const arcNameTargetElement = document.querySelector("#plume-arc > div.css-35jc09 > div.css-lrnuet > div.css-mqdtaw > input")
            if(arcNameTargetElement && falg2){
                falg2=false;
                result = generateRandomNumberString(10);
                sessionStorage.setItem('arcName','5');
                arcNameTargetElement.focus();
                document.execCommand('insertText', false, result);
                arcNameTargetElement.dispatchEvent(invalidEvent);
                setTimeout(() => {
                    const arcNameTargetElementaf = document.querySelector("#plume-arc > div.css-35jc09 > div.css-lrnuet > div.css-mqdtaw > input")
                    if(arcNameTargetElementaf){
                        if (arcNameTargetElementaf.value===null) {
                            falg2=true;
                        }
                    }
                },30000)
            }
            const arcDesTargetElement = document.querySelector("#plume-arc > div.css-35jc09 > div.css-lrnuet > div.css-2rdxv6 > textarea")
            if(arcDesTargetElement && falg3){
                falg3=false;
                result = generateRandomNumberString(15);
                sessionStorage.setItem('arcDes',result);
                arcDesTargetElement.focus();
                document.execCommand('insertText', false, result);
                arcDesTargetElement.dispatchEvent(invalidEvent);
                setTimeout(() => {
                    const arcDesTargetElementaf = document.document.querySelector("#plume-arc > div.css-35jc09 > div.css-lrnuet > div.css-2rdxv6 > textarea")
                    if(arcDesTargetElementaf){
                        if (arcDesTargetElementaf.value===null) {
                            falg3=true;
                        }
                    }
                },30000)
            }
        }
        if (window.location.href == 'https://adamdefi.io/swap'){
            const inputswap = document.querySelector("#__nuxt > div.default-wrap.min-h-screen.pb-24.font-poppins.flex.flex-col.items-stretch > div.main > div > div.panel > div:nth-child(2) > div:nth-child(2) > div.flex-1.pr-2 > input")
            if(inputswap && falg4){
                falg4=false;
                inputswap.focus();
                document.execCommand('insertText', false,generateRandomFloat(0.000015, 0.00002));
                inputswap.dispatchEvent(invalidEvent);
                setTimeout(() => {
                    const inputswap = document.querySelector("#__nuxt > div.default-wrap.min-h-screen.pb-24.font-poppins.flex.flex-col.items-stretch > div.main > div > div.panel > div:nth-child(2) > div:nth-child(2) > div.flex-1.pr-2 > input")
                    if(inputswap){
                        if (inputswap.value===null) {
                            falg4=true;
                        }
                    }
                },30000)
            }
        }
        if (window.location.href == 'https://adamdefi.io/pool/add'){
             const inputswappool = document.querySelector("#__nuxt > div.default-wrap.min-h-screen.pb-24.font-poppins.flex.flex-col.items-stretch > div.main > div > div > div.panel.\\!pt-10 > div.mt-5 > div > div:nth-child(1) > div:nth-child(2) > div.flex-1.pr-2 > input")
            if(inputswappool && falg4){
                falg4=false;
                inputswappool.focus();
                document.execCommand('insertText', false,generateRandomFloat(0.00001, 0.000015));
                inputswappool.dispatchEvent(invalidEvent);
                setTimeout(() => {
                    const inputswappool = document.querySelector("#__nuxt > div.default-wrap.min-h-screen.pb-24.font-poppins.flex.flex-col.items-stretch > div.main > div > div.panel > div:nth-child(2) > div:nth-child(2) > div.flex-1.pr-2 > input")
                    if(inputswappool){
                        if (inputswappool.value===null) {
                            falg4=true;
                        }
                    }
                },30000)
            }
        }
        if (window.location.href == 'https://dev-plume.landx.co/products/xBasket'){
            const inputlandx = document.querySelector("#main-layout > app-products > div > app-x-basket-details > div:nth-child(2) > div > div.statistics__left-block > app-trade-form > div > div.trade__exchange.exchange > div > app-trade-input > div > div.input-filed__select-wrapper > input")
            if(inputlandx && falg4){
                falg4=false;
                inputlandx.focus();
                document.execCommand('insertText', false,generateRandomFloat(1,3));
                inputlandx.dispatchEvent(invalidEvent);
                setTimeout(() => {
                    const inputlandx =document.querySelector("#main-layout > app-products > div > app-x-basket-details > div:nth-child(2) > div > div.statistics__left-block > app-trade-form > div > div.trade__exchange.exchange > div > app-trade-input > div > div.input-filed__select-wrapper > input")
                    if(inputlandx){
                        if (inputlandx.value===null) {
                            falg4=true;
                        }
                    }
                },30000)
            }
        }
        if (window.location.href === 'https://testnet.kappalending.com/#/market') {
            const popup = document.querySelector('.MuiDialogContent-root');
            if (popup) {
                const inputs = popup.querySelectorAll('input');
                inputs.forEach(input => {
                    const inputValue = parseFloat(input.value);
                    if (inputValue <= 0 || isNaN(inputValue)) {
                        input.focus();
                        const randomValue = generateRandomFloat(0.00001, 0.00001);
                        document.execCommand('insertText', false, randomValue.toString());
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }
        }
        if (window.location.href === 'https://app.mysticfinance.xyz/en/lend') {
            const dialogElement = document.querySelector('dialog');
            if (dialogElement) {
                const inputs = dialogElement.querySelectorAll('input');
                inputs.forEach(input => {
                    const inputValue = parseFloat(input.value);
                    if (inputValue <= 0 || isNaN(inputValue)) {
                        input.focus();
                        const randomValue = generateRandomFloat(1, 5);
                        document.execCommand('insertText', false, randomValue.toString());
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }
            const popup = document.querySelector('.MuiDialogContent-root');
            if (popup) {
                const inputs = popup.querySelectorAll('input');
                inputs.forEach(input => {
                    const inputValue = parseFloat(input.value);
                    if (inputValue <= 0 || isNaN(inputValue)) {
                        input.focus();
                        const randomValue = generateRandomFloat(0.00001, 0.00001);
                        document.execCommand('insertText', false, randomValue.toString());
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }
        }
        if (window.location.href === 'https://testnet.musicprotocol.finance/' || window.location.href == 'https://app.solidviolet.com/tokens/1') {
            const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="password"]');
            inputs.forEach(input => {
                if (input.type === 'text' || input.type === 'number' || input.type === 'email' || input.type === 'password') {
                    if(input){
                        const inputValue = parseFloat(input.value);
                        if (inputValue <= 0 || isNaN(inputValue)) {
                            input.focus();
                            const randomValue = generateRandomFloat(0.1, 0.5);
                            document.execCommand('insertText', false, randomValue.toString());
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                }
            });
        }
        if (window.location.href === 'https://app.pluralfinance.com/plume-testnet/?signed_in=true' || window.location.href == 'https://app.elyfi.world/pools/plumetestnet/10' || window.location.href == 'https://app.pluralfinance.com/plume-testnet/') {
            const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="password"]');
            inputs.forEach(input => {
                if (input.type === 'text' || input.type === 'number' || input.type === 'email' || input.type === 'password') {
                    if(input){
                        const inputValue = parseFloat(input.value);
                        if (inputValue <= 0 || isNaN(inputValue)) {
                            input.focus();
                            const randomValue = generateRandomFloat(1, 3);
                            document.execCommand('insertText', false, randomValue.toString());
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                }
            });
        }
    },5000)

})();