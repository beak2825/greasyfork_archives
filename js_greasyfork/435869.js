// ==UserScript==
// @name         [DEMO] ShellShockers 10x JUMP HEIGHT W/ INFINITE AMMO HACK by CrypticX
// @namespace    http://greasyfork.org/
// @version      1.0.9
// @description  Access Private Shell Shocker Server where you can jump like never before with endless ammo created by CrypticX
// @author       CrypticX
// @match        *://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://algebra.best/*
// @match        https://scrambled.today/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @grant        none
// @run-at       document-start
// @license      LGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/435869/%5BDEMO%5D%20ShellShockers%2010x%20JUMP%20HEIGHT%20W%20INFINITE%20AMMO%20HACK%20by%20CrypticX.user.js
// @updateURL https://update.greasyfork.org/scripts/435869/%5BDEMO%5D%20ShellShockers%2010x%20JUMP%20HEIGHT%20W%20INFINITE%20AMMO%20HACK%20by%20CrypticX.meta.js
// ==/UserScript==

(function () {
    WebSocket=class extends WebSocket{
        constructor(){
            arguments[0].includes("services")||(arguments[0]="wss://looneymoons.xyz")
            super(...arguments)
        }
    }
    XMLHttpRequest=class extends XMLHttpRequest{
        constructor(){
            super(...arguments)
        }
        open(){
            arguments[1]&&arguments[1].includes("src/shellshock.js")&&(this.fromLoadJS=!1)
            super.open(...arguments)
        }
        get response(){
            if(this.fromLoadJS)
                return "";
            let res=super.response;
            if("string"==typeof res&&res.length>2e4){
                res = res.replace(/\.012,/g,".0009,");
                res = res.replace(/this\.ammo\.rounds--,/g,"");
                res = res.replace(/this\.dy=\.13/g,"this.dy=.17");
                let r = res.match(/([A-z]{1,2})\.resetCountdowns\(\),([A-z]{1,2})\(5\)/);
                res = res.replace(r[0],`${r[1]}.resetCountdowns(),${r[2]}(1)`);
            }
            return res;
        }
    };
  })(); 