// ==UserScript==
// @name        Like/Follow/Retweet
// @autor       Hader Araujo
// @namespace    http://tampermonkey.net/
// @description  Like Follow Retweet
// @include     https://twitter.com/intent/*
// @license      MIT
// @version     0.15
// @grant       GM_openInTab
// @grant       window.close
// @downloadURL https://update.greasyfork.org/scripts/458490/LikeFollowRetweet.user.js
// @updateURL https://update.greasyfork.org/scripts/458490/LikeFollowRetweet.meta.js
// ==/UserScript==

var globalDelay = 0
const oneSecond = 1000

function executeWithSleepBegin(delay, func) {
    globalDelay += delay

    setTimeout(() => {        
        func.call()
    }, globalDelay);
    
};

(function () {
    'use strict';

    console.log("inicio");


    executeWithSleepBegin(oneSecond * 3, () => {
        // se tiver popup, clica pra fechar
        if (document.querySelector('#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-1kihuf0.r-18u37iz.r-1pi2tsx.r-1777fci.r-1pjcn9w.r-xr3zp9.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-14lw9ot.r-1867qdf.r-1jgb5lz.r-pm9dpa.r-1ye8kvj.r-1rnoaur.r-13qz1uu > div > div.css-1dbjc4n.r-1awozwy.r-16y2uox > div > div.css-1dbjc4n.r-98ikmy.r-hvns9x > div.css-1dbjc4n.r-13qz1uu > div.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-1ets6dv.r-sdzlij.r-1phboty.r-rs99b7.r-1wzrnnt.r-19yznuf.r-64el8z.r-1ny4l3l.r-1dye5f7.r-o7ynqc.r-6416eg.r-lrvibr') ){
            console.log("popup");
            document.querySelector('#layers > div:nth-child(2) > div > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-1kihuf0.r-18u37iz.r-1pi2tsx.r-1777fci.r-1pjcn9w.r-xr3zp9.r-1xcajam.r-ipm5af.r-g6jmlv > div.css-1dbjc4n.r-14lw9ot.r-1867qdf.r-1jgb5lz.r-pm9dpa.r-1ye8kvj.r-1rnoaur.r-13qz1uu > div > div.css-1dbjc4n.r-1awozwy.r-16y2uox > div > div.css-1dbjc4n.r-98ikmy.r-hvns9x > div.css-1dbjc4n.r-13qz1uu > div.css-18t94o4.css-1dbjc4n.r-1niwhzg.r-1ets6dv.r-sdzlij.r-1phboty.r-rs99b7.r-1wzrnnt.r-19yznuf.r-64el8z.r-1ny4l3l.r-1dye5f7.r-o7ynqc.r-6416eg.r-lrvibr').click()
        }
    })


    executeWithSleepBegin(oneSecond * 3, () => {
        // botao de follow e retwitter - serve para as 2 telas
        if (document.querySelector('#layers > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div:nth-child(2)  div:nth-child(1) ') ){
            console.log("popup de follow e retwitter automatico");
            document.querySelector('#layers > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div:nth-child(2)  div:nth-child(1) ').click()
        }
    })

    executeWithSleepBegin(oneSecond * 3, () => {
        // like
        if (document.querySelector('main > div > div > div > div > div > section > div > div > div  > div > div > div  > article > div  > div  > div  > div:nth-child(3) > div:nth-child(7) > div > div:nth-child(3) > div[data-testid="like"] > div ') ) {
            console.log("like");
            document.querySelector('main > div > div > div > div > div > section > div > div > div  > div > div > div  > article > div  > div  > div  > div:nth-child(3) > div:nth-child(7) > div > div:nth-child(3) > div[data-testid="like"] > div ').click()
        }
    })

    
    executeWithSleepBegin(oneSecond * 3, () => {
        // abrir pagina principal da conta
        if (document.querySelector('main > div > div > div > div> div  > section div:nth-child(2) > div > div > div > div > div > article > div > div > div div:nth-child(2)  > div > div > div > div > div > div:nth-child(2)  > div> div:nth-child(2)  > div > a')) {
            console.log("redirecionar");
            var account = document.querySelector('main > div > div > div > div> div  > section div:nth-child(2) > div > div > div > div > div > article > div > div > div div:nth-child(2)  > div > div > div > div > div > div:nth-child(2)  > div> div:nth-child(2)  > div > a').getAttribute('href');
            var accountLink = 'https://twitter.com/intent/user?screen_name=' + account.substring(1)

            GM_openInTab (accountLink, { active: true, insert: true });
        }
    })
    

    executeWithSleepBegin(oneSecond * 3, () => {
        // ativa notificação
        if (document.querySelector('main > div > div > div > div > div > div:nth-child(3) > div > div > div > div > div > div:nth-child(2) > div:nth-child(3) > div[aria-label="Turn on Tweet notifications"] > div ') ) {
            console.log("ativa notificação");
            document.querySelector('main > div > div > div > div > div > div:nth-child(3) > div > div > div > div > div > div:nth-child(2) > div:nth-child(3) > div[aria-label="Turn on Tweet notifications"] > div ').click()
        //   await sleep(3000);
        }
    })


    executeWithSleepBegin(oneSecond * 7, () => {
        if (window.location.href.includes('twitter.com/intent/tweet?text')) {

            executeWithSleepBegin(oneSecond * 5, () => {
                if (document.querySelector('div[aria-labelledby="modal-header"] > div > div > div > div:nth-child(3) > div:nth-child(2) > div > div  > div > div > div > div:nth-child(2) > div:nth-child(3) > div  > div  > div:nth-child(2) > div:nth-child(4) ') ) {

                    document.querySelector('div[aria-labelledby="modal-header"] > div > div > div > div:nth-child(3) > div:nth-child(2) > div > div  > div > div > div > div:nth-child(2) > div:nth-child(3) > div  > div  > div:nth-child(2) > div:nth-child(4) ').click()
                }
            })
        }
    })

    executeWithSleepBegin(oneSecond * 1, () => {
    window.close();
    })




})();