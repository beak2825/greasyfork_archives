// ==UserScript==
// @name         3DNexus
// @namespace    https://duelingnexus.com/
// @version      0.7
// @description  Adding perspective view to Nexus.
// @author       part-time roadman#1456
// @include      https://duelingnexus.com/game/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/421627/3DNexus.user.js
// @updateURL https://update.greasyfork.org/scripts/421627/3DNexus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS
    GM_addStyle(`
        #game-field > tbody {
            transform: perspective(30rem) rotateX(
        22deg
        ) scaleX(1.2) translate(0%, -12%);
        }

        #game-field-opponent-hand {
            transform: translate(39%, -680%) scale(0.6) rotate(180deg);
            position: absolute;
        }

        #game-field-player-hand {
            transform: translate(39%, -136%);
            position: absolute;
        }

        #game-field-player-deck {
            transform: translate(500%, 0) scaley(0.8);
        }

        #game-field-player-extra {
            transform: scaley(0.8);
        }

        #game-field-opponent-extra {
            transform: translate(490%, 0);
        }

        #phase-container {
            width: 30px;
            transform: translate(-30%,-50%);
            position: absolute;
            bottom: -4%;
            right: 2%;
        }

        .game-avatar-area.game-avatar-left {
            position: absolute;
            top: 0;
            right: 4%;
            width: 93px;
        }

        .game-avatar-area.game-avatar-right {
            position: absolute;
            top: 12%;
            right: 4%;
            width: 93px;
        }

        #game-player-name, #game-opponent-name {
            position: absolute;
            top: -14%;
            right: 0;
            transform: translate(-74px, 120%);
            text-align: center;
            width: 150px;
            z-index: -2;
            background: #9d4fb7;
            border: 2px solid black;
            border-radius: 5px;
            white-space: nowrap;
        }

        #game-avatar-player-image, #game-avatar-opponent-image {
            border-radius: 50%;
            border: 4px solid #9d4fb7;
        }

        #game-life-player {
            position: absolute;
            display: block;
            transform: translate(-63px, -63px);
            font-family: math;
            font-weight: bold;
        }

        #game-life-opponent {
            position: absolute;
            display: block;
            transform: translate(-63px, -63px);
            font-family: math;
            font-weight: bold;
        }

        .game-life-bar {
            margin-top: 8px;
            background-color: gray;
            height: 15px;
            border-radius: 5px;
            z-index: -1;
            border: none;
            position: absolute;
            top: -14%;
            right: 0;
            transform: translate(-110%, 300%) scaleX(1.3);
        }

        .game-life-bar-part {
            background-color: #c03030;
            border-radius: 5px;
            height: 100%;
        }

        div#game-timer-bar-player, #game-timer-bar-opponent {
            display: none !important;
        }

        #game-timer-player, #game-timer-opponent {
            position: fixed;
            margin-left: -13px;
        }

        .game-field-zone:hover {
            border-radius: 0;
            box-shadow: none;
        }

        .game-field-zone{
            background: none !important;
        }

    }

    @-webkit-keyframes glow
    {
      to
      {
        -webkit-box-shadow: 0 0 2px #ff8400;
        -moz-box-shadow: 0 0 2px #ff8400;
        box-shadow: 0 0 2px #ff8400;
      }
    }

    @-webkit-keyframes glow2
    {
      to
      {
        background-color: #5d259026;
      }
    }


        #game-field > tbody > tr > td > .game-field-zone-content:hover{
            background: #63348e8c;
            -webkit-animation: glow2 0.55s infinite alternate;
        }

        #game-field > tbody > tr > td > .game-field-zone-content{
            background: #21112f82;
          -webkit-transition: all 0s linear 1s;
          -moz-transition: all 0s linear 1s;
          -ms-transition: all 0s linear 1s;
          transition: all 0s linear 1s;
        outline: #ffffff solid 2px;
        }


        #game-field-player-spell1 > div > img,  #game-field-player-spell2 > div > img,  #game-field-player-spell3 > div > img,  #game-field-player-spell4 > div > img,  #game-field-player-spell5 > div > img,
        #game-field-player-monster1 > div > img,  #game-field-player-monster2 > div > img,  #game-field-player-monster3 > div > img,  #game-field-player-monster4 > div > img,  #game-field-player-monster5 > div > img,
        #game-field-opponent-spell1 > div > img,  #game-field-opponent-spell2 > div > img,  #game-field-opponent-spell3 > div > img,  #game-field-opponent-spell4 > div > img,  #game-field-opponent-spell5 > div > img,
        #game-field-opponent-monster1 > div > img,  #game-field-opponent-monster2 > div > img,  #game-field-opponent-monster3 > div > img,  #game-field-opponent-monster4 > div > img,  #game-field-opponent-monster5 > div > img,
        #game-field-opponent-graveyard > div > img, #game-field-opponent-banished > div > img, #game-field-opponent-spell6 > div > img, #game-field-player-graveyard > div > img, #game-field-player-banished > div > img, #game-field-player-spell6 > div > img,
        #game-field-player-deck > div > img, #game-field-opponent-deck > div > img, #game-field-player-extra > div > img, #game-field-opponent-extra > div > img, #game-field-extra-monster1 > div > img, #game-field-extra-monster2 > div > img {
            width: 50%;
            height: 70% !important;
            margin-top: 15%;
        }

        #game-field-player-spell1, #game-field-player-spell2, #game-field-player-spell3, #game-field-player-spell4, #game-field-player-spell5 {
            transform: translateY(-7px);
        }

       #game-field-opponent-spell5 {
            transform: translateY(7px);
        }

        #game-field-opponent-spell4, #game-field-opponent-spell3, #game-field-opponent-spell2, #game-field-opponent-spell1 {
            transform: translate(-102%, 7px);
        }

        #game-field-player-graveyard {
            transform: scaleX(0.6) translate(-24%, 38%);
        }

        #game-field-player-banished {
            transform: scaleX(0.59) translate(-192%, -63%);
        }

        #game-field-player-deck {
            transform: scaleX(0.59) scaleY(1) translate(811%, -65%);
        }

        #game-field-player-extra {
            transform: scaleX(0.6) translate(21%, -65%);
        }

        #game-field-player-spell6 {
            transform: scaleX(0.6) translate(21%, 37%);
        }

        #game-field-opponent-graveyard {
            transform: scaleX(0.6) translate(21%, -45%);
        }

        #game-field-opponent-banished {
            transform: scaleX(0.6) translate(182%, 53%);
        }

        #game-field-opponent-deck {
            transform: scaleX(0.6) translate(20%, 58%);
        }

        #game-field-opponent-extra {
            transform: scaleX(0.6) translate(798%, 58%);
        }

        td#game-field-opponent-spell6 {
            transform: scaleX(0.6) translate(-25%, -44%);
        }

        #game-field-player-graveyard > div > img, #game-field-player-banished > div > img, #game-field-player-deck > div > img, #game-field-player-spell6 > div > img, #game-field-player-extra > div > img,
        #game-field-opponent-graveyard > div > img, #game-field-opponent-banished > div > img, #game-field-opponent-deck > div > img, #game-field-opponent-spell6 > div > img, #game-field-opponent-extra > div > img{
            width: 80%;
        }

button, .engine-text-box, .engine-text-box:focus, #card-description-box {
    border: none !important;
    outline: none !important;
}
    `);

    // 3D Exclusions
    const game = document.getElementById("game-field");
    const divExclusions = document.createElement("div");
    const handPlr = document.getElementById("game-field-player-hand");
    const handOpp = document.getElementById("game-field-opponent-hand");
    const btnDP = document.getElementById("game-dp-button");
    const btnSP = document.getElementById("game-sp-button");
    const btnMP1 = document.getElementById("game-mp1-button");
    const btnBP = document.getElementById("game-bp-button");
    const btnMP2 = document.getElementById("game-mp2-button");
    const btnEP = document.getElementById("game-ep-button");
    const btnCancel = document.getElementById("game-cancel-button");
    const btnForce = document.getElementById("game-force-chain-button");
    const stats = document.getElementsByClassName("game-avatar-area");
    const Exclusions = [handPlr, handOpp];
    const options = document.getElementById("options-area");
    const phaseContainer = document.createElement("div");
    const phaseBtns = [btnDP, btnSP, btnMP1, btnBP, btnMP2, btnEP];

    divExclusions.setAttribute("id", "Exclusions");
    game.appendChild(divExclusions);
    Exclusions.forEach(item => divExclusions.appendChild(item));
    for (let i = 0; i < stats.length; i++) {
       Exclusions.forEach(item => divExclusions.appendChild(stats[i]));
    }
    options.appendChild(btnCancel);
    options.appendChild(btnForce);
    phaseContainer.setAttribute("id", "phase-container");
    divExclusions.appendChild(phaseContainer);
    phaseBtns.forEach(item => phaseContainer.appendChild(item));
})();