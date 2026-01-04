// ==UserScript==
// @name         OGame DataProcessing
// @namespace    http://tampermonkey.net/
// @version      1.25.10
// @description  Allows you to quickly and conveniently view all information about the player/alliance through the search by Name/ID/Coodinates gamer and Name/ID/Tag of the alliance respectively. Highlights activity on planets and moons
// @author       mentor-27
// @website      https://github.com/mentor-27
// @license      Apache2.0
// @match        *.ogame.gameforge.com/game/index.php*
// @downloadURL https://update.greasyfork.org/scripts/450648/OGame%20DataProcessing.user.js
// @updateURL https://update.greasyfork.org/scripts/450648/OGame%20DataProcessing.meta.js
// ==/UserScript==

function checkIfWindowIsFrame() {
    if (window.frameElement) return false
}

checkIfWindowIsFrame();

let opacityTimer;
if (localStorage.getItem("probesToSpy") == null) localStorage.setItem("probesToSpy", "5");
let universeId = location.href.match(/s(\d{3})/)[1];

async function getData(url) {
    const resp = await fetch(url);
    let text = await resp.text();
    return new window.DOMParser().parseFromString(text, "text/xml");
}

let fetchedPlayerData,
    fetchedUniverse,
    fetchedPlayers,
    fetchedAlliances,
    fetchedPlayersHighscores = [],
    fetchedAlliancesHighscores = [];
let playerData = {},
    universe = [],
    players = [],
    alliances = []
    // playersHighscores = [],
    // alliancesHighscores = [];

getData(
    `https://s${universeId}-ru.ogame.gameforge.com/api/playerData.xml?id=${unsafeWindow.playerId}`
).then((resp) => {
    fetchedPlayerData = resp;
});
getData(`https://s${universeId}-ru.ogame.gameforge.com/api/universe.xml`).then(
    (resp) => {
        fetchedUniverse = resp.querySelectorAll("planet");
    }
);
getData(`https://s${universeId}-ru.ogame.gameforge.com/api/players.xml`).then(
    (resp) => {
        fetchedPlayers = resp.querySelectorAll("player");
    }
);
getData(`https://s${universeId}-ru.ogame.gameforge.com/api/alliances.xml`).then(
    (resp) => {
        fetchedAlliances = resp.querySelectorAll("alliance");
    }
);
for (let i = 0; i < 8; i++) {
    getData(
        `https://s${universeId}-ru.ogame.gameforge.com/api/highscore.xml?category=1&type=${i}`
    ).then((resp) => {
        fetchedPlayersHighscores[i] = resp.querySelectorAll("player");
    });
    getData(
        `https://s${universeId}-ru.ogame.gameforge.com/api/highscore.xml?category=2&type=${i}`
    ).then((resp) => {
        fetchedAlliancesHighscores[i] = resp.querySelectorAll("alliance");
    });
}

function fnCreateElement(tag, attributes = {}, content = null) {
    const elem = document.createElement(tag);
    if (Object.keys(attributes).length !== 0) {
        for (let key in attributes) elem.setAttribute(key, attributes[key]);
    }
    if (content) elem.innerText = content;
    return elem;
}

const dataPanelStyle = fnCreateElement("style", { type: "text/css" });
dataPanelStyle.innerHTML = `
    #dataWrapper {
        position: fixed;
        display: block;
        background: url(https://gf3.geo.gfsrv.net/cdnea/bd764e9b39a1a48ad708039fda1bde.gif) repeat-y;
        width: 222px;
        height: fit-content;
        max-width: 222px;
        z-index: 2;
        transition: opacity 2s;
        transition-timing-function: cubic-bezier(0, .75, .5, 1);
        z-index: 3000;
    }
    #dataHeader {
        cursor: grab;
        position: relative;
        display: flex;
        flex-direction: row;
        align-content: space-around;
        justify-content: space-evenly;
        align-items: center;
        background: url("https://gf1.geo.gfsrv.net/cdnfe/b9de2f5b06c823d628d22c4067ee35.gif") no-repeat;
        background-size: 222px 40px;
        height: 40px;
        width: 222px;
    }
    #dataIconBoxCategory {
        display: flex;
        position: relative;
        left: 35px;
        z-index: 4;
    }
    #dataIconBoxType {
        display: flex;
        position: relative;
        left: 44px;
        transition: left .5s;
        z-index: 3;
    }
    #dataIconBoxTypeSmall {
        display: flex;
        position: relative;
        left: -30px;
        z-index: 0;
    }
    .dataIcon {
        position: relative;
        background: url("https://gf3.geo.gfsrv.net/cdne9/1fd57fa51cdb81035382943e635348.gif");
        background-size: 129.6px 43.2px;
        height: 21.6px;
        width: 21.6px;
        margin: 2.2px 1.5px 0px;
        border-radius: 3px;
        cursor: pointer;
        opacity: 1;
        left: 0;
        transition-property: opacity, left;
        transition-duration: .2s;
    }
    #dataIBCPlayer:hover,
    #dataRBPlayer:checked ~ #dataIBCPlayer {
        background-position: 0px 21.6px;
        box-shadow: 0px 0px 4px #0bf;
    }
    #dataRBPlayer:checked ~ #dataIBCPlayer::after,
    #dataRBAlliance:checked ~ #dataIBCAlliance::after,
    #dataRBPoints:checked ~ #dataIBTPoints::after,
    #dataRBEconomics:checked ~ #dataIBTEconomics::after,
    #dataRBResearch:checked ~ #dataIBTResearch::after,
    #dataRBWeapons:checked ~ #dataIBTWeapons::after {
        border-bottom: 1px solid;
        content: '';
        display: block;
        margin: 0 auto;
        position: relative;
        top: 23px;
        width: 16px;
    }
    #dataRBPlayer:checked ~ #dataIBCPlayer::after {
        border-color: #0bf;
    }
    #dataRBAlliance:checked ~ #dataIBCAlliance::after {
        border-color: #0fc;
    }
    #dataRBPoints:checked ~ #dataIBTPoints::after {
        border-color: #ff0;
    }
    #dataRBEconomics:checked ~ #dataIBTEconomics::after {
        border-color: #fff;
    }
    #dataRBResearch:checked ~ #dataIBTResearch::after {
        border-color: #af0;
    }
    #dataRBWeapons:checked ~ #dataIBTWeapons::after {
        border-color: #f20;
    }
    #dataIBCAlliance {
        background-position-x: -21.6px;
    }
    #dataIBCAlliance:hover,
    #dataRBAlliance:checked ~ #dataIBCAlliance {
        background-position: -21.6px 21.6px;
        box-shadow: 0px 0px 4px #0fc;
    }
    #dataIBTPoints {
        background-position-x: -43.2px;
    }
    #dataIBTPoints:hover,
    #dataRBPoints:checked ~ #dataIBTPoints {
        background-position: -43.2px 21.6px;
        box-shadow: 0px 0px 4px #ff0;
    }
    #dataIBTEconomics {
        background-position-x: -108px;
    }
    #dataIBTEconomics:hover,
    #dataRBEconomics:checked ~ #dataIBTEconomics {
        background-position: -108px 21.6px;
        box-shadow: 0px 0px 4px #fff;
    }
    #dataIBTResearch{
        background-position-x: -86.4px;
    }
    #dataIBTResearch:hover,
    #dataRBResearch:checked ~ #dataIBTResearch {
        background-position: -86.4px 21.6px;
        box-shadow: 0px 0px 4px #af0;
    }
    #dataIBTWeapons {
        background-position-x: -64.8px;
    }
    #dataIBTWeapons:hover,
    #dataRBWeapons:checked ~ #dataIBTWeapons {
        background-position: -64.8px 21.6px;
        box-shadow: 0px 0px 4px #f20;
    }
    .dataIcon_small {
        display: inline-block;
        position: relative;
        background: url("https://gf1.geo.gfsrv.net/cdnc4/6f6b7e29edf86992b7e7162f23789a.png");
        background-size: 133px 17px;
        height: 17px;
        width: 17px;
        margin: 3px 1.5px 0px;
        border-radius: 1px;
        cursor: pointer;
    }
    #dataIBTsCollected {
        background-position-x: 0px;
        opacity: 0;
    }
    #dataIBTsCollected:hover,
    #dataRBCollected:checked ~ #dataIBTsCollected {
        background-position-x: -66.5px;
        box-shadow: 0px 0px 4px #f20;
    }
    #dataRBCollected:checked ~ #dataIBTsCollected::after,
    #dataRBDestroyed:checked ~ #dataIBTsDestroyed::after,
    #dataRBLost:checked ~ #dataIBTsLost::after,
    #dataRBHonor:checked ~ #dataIBTsHonor::after {
        border-bottom: 1px solid #f20;
        content: '';
        display: block;
        margin: 0 auto;
        position: relative;
        top: 20.5px;
        width: 12.5px;
    }
    #dataIBTsDestroyed {
        background-position-x: -33.05px;
        opacity: 0;
    }
    #dataIBTsDestroyed:hover,
    #dataRBDestroyed:checked ~ #dataIBTsDestroyed {
        background-position-x: -99.55px;
        box-shadow: 0px 0px 4px #f20;
    }
    #dataIBTsLost {
        background-position-x: -16.5px;
        opacity: 0;
    }
    #dataIBTsLost:hover,
    #dataRBLost:checked ~ #dataIBTsLost {
        background-position-x: -83px;
        box-shadow: 0px 0px 4px #f20;
    }
    #dataIBTsHonor {
        background-position-x: -49.5px;
        opacity: 0;
    }
    #dataIBTsHonor:hover,
    #dataRBHonor:checked ~ #dataIBTsHonor {
        background-position-x: -116px;
        box-shadow: 0px 0px 4px #f20;
    }
    #dataBackground {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        background: -webkit-linear-gradient(top, #171d23 0%, #101419 100%);
        border: 1px solid #171d23;
        border-radius: 3px;
        margin: 2px 15px -13px;
        padding: 0px 10px 10px;
        min-height: 50px;
        height: fit-content;
        text-align: center;
        transition: height .3s;
    }
    #dataRequestBlock {
        margin: 0px 0px 10px;
    }
    #dataResponseBlock {
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-height: calc(100vh - 250px);
        overflow-y: overlay;
    }
    .dataResponseLines {
        width: 140px;
        line-height: 17px;
        margin: 1px 5px;
        background: #243342;
        border-bottom: solid 1px #6f9fc8;
        border-left: solid 1px #104c71;
        border-radius: 0px 6px 0px 8px;
        color: white;
        font-family: Verdana;
        font-size: 11px;
        padding: 0 0 2px 1px;
        cursor: pointer;
        transition: background .15s;
    }
    .dataResponseLines:hover {
        background: #4ca1af;
    }
    .dataHs {
        cursor: default;
        display: flex;
        justify-content: flex-start;
        margin-left: 4px;
        padding: 2px 0;
        text-align: left;
        border-bottom: 1px solid #283840;
        align-items: center;
        flex-direction: row;
        transition: all .3s;
        width: 95%;
    }
    .dataHs span {
        color: white;
    }
    .dataImg1 {
        display: block;
        position: relative;
        background: url("https://gf3.geo.gfsrv.net/cdne9/1fd57fa51cdb81035382943e635348.gif");
        background-size: 121.5px 40.5px;
        height: 20.25px;
        width: 20.25px;
        margin: 0 5px;
    }
    .dataImg2 {
        display: block;
        position: relative;
        background: url("https://gf3.geo.gfsrv.net/cdne7/882b3dfe72735e799afcff6e107f73.png");
        background-size: 280px 20.25px;
        height: 20.25px;
        width: 20.25px;
        margin: 0 5px;
    }
    .imgType0 {
        background-position-x: -40.5px;
    }
    .imgType1 {
        background-position-x: -101.25px;
    }
    .imgType2 {
        background-position-x: -81px;
    }
    .imgType3 {
        background-position-x: -60.75px;
    }
    .imgType4 {
        background-position-x: -19.65px;
    }
    .imgType5 {
        background-position-x: 0px;
    }
    .imgType6 {
        background-position-x: -39.3px;
    }
    .imgType7 {
        background-position-x: -58.85px;
    }
    .dataPlanetList {
        background: linear-gradient(135deg, #323c4c 0%,#3a4759 12%,#435166 25%,#2f3247 39%,#1d232c 50%,#000000 51%,#0b0d11 60%,#1c222b 76%,#12161c 91%,#0c0f13 100%);
        border-radius: 12px;
        display: block;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        height: fit-content;
        margin: 2px 5px;
        padding: 3px;
        position: relative;
        text-align: center;
        width: 100px;
    }
    .dataPlanetList:first-of-type {
        background: linear-gradient(135deg, #959595 0%,#0d0d0d 46%,#010101 50%,#0a0a0a 53%,#4e4e4e 76%,#383838 87%,#1b1b1b 100%);
    }
    .dataPlayersList {
        background: linear-gradient(135deg, #323c4c 0%,#3a4759 12%,#435166 25%,#2f3247 39%,#1d232c 50%,#000000 51%,#0b0d11 60%,#1c222b 76%,#12161c 91%,#0c0f13 100%);
        border-radius: 12px;
        display: block;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        height: fit-content;
        margin: 2px 5px;
        padding: 3px;
        position: relative;
        text-align: center;
        width: 100px;
        color: white;
        font-size: 11px;
        cursor: pointer;
    }
    .dataPlayersList:hover {
        background: linear-gradient(135deg, #f2f6f8 0%,#d8e1e7 50%,#b5c6d0 51%,#e0eff9 100%);
    }
    .dataBlock {
        background: #00000080;
        border-radius: 9px;
        box-shadow: 0 0 5px #00000080 inset;
        color: white;
        display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-evenly;
        font-weight: bold;
        height: fit-content;
        padding: 2px 3px 3px;
        position: relative;
        word-break: break-word;
    }
    .posSpan {
        background: #00000040;
        border-radius: 5px;
        font-size: 7px;
        padding: 2px 3px;
    }
    .planetDataIcon {
        background: linear-gradient(135deg, #f2f6f8 0%,#d8e1e7 50%,#b5c6d0 51%,#e0eff9 100%);
        border-radius: 7px;
        display: flex;
            align-items: center;
            justify-content: space-around;
        left: 4px;
        height: 14px;
        width: 14px;
        position: absolute;
        transition: all .3s;
    }
    .planetDataIcon:hover {
        box-shadow: 0 0 5px 0 #000000;
        left: -30px;
        width: 48px;
    }
    .pSpyBtn, .mSpyBtn,
    .pAtkBtn, .mAtkBtn,
    .pTrpBtn, .mTrpBtn {
        border-radius: 5px;
        box-shadow: 0 0 3px 1px #00000080;
        cursor: pointer;
        height: 10px;
        opacity: 0;
        transition: all .2s;
        width: 10px;
        font-size: 8px;
        line-height: 10px;
    }
    .pSpyBtn, .mSpyBtn {
        background: linear-gradient(135deg, #fceabb 0%,#fccd4d 50%,#f8b500 51%,#fbdf93 100%);
        color: #886400;
    }
    .pAtkBtn, .mAtkBtn {
        background: linear-gradient(135deg, #feccb1 0%,#f17432 50%,#ea5507 51%,#fb955e 100%);
        color: #772c04;
    }
    .pTrpBtn, .mTrpBtn {
        background: linear-gradient(135deg, #9dd53a 0%,#a1d54f 50%,#80c217 51%,#7cbc0a 100%);
        color: #3d5e06;
    }
    .pSpyBtn::before,
    .mSpyBtn::before {
        content: 'S';
    }
    .pAtkBtn::before,
    .mAtkBtn::before {
        content: 'A';
    }
    .pTrpBtn::before,
    .mTrpBtn::before {
        content: 'T';
    }
    .pSpyBtn:hover, .mSpyBtn:hover,
    .pAtkBtn:hover, .mAtkBtn:hover,
    .pTrpBtn:hover, .mTrpBtn:hover {
        box-shadow: 0 0 3px 1px #ffffff;
    }
    .cordsBlock {
        cursor: pointer;
        font-size: 11px;
        line-height: 10px;
        padding: 2px 3px;
        transition: all .3s;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
    }
    .cordsBlock:hover {
        border-top: 1px solid #d1d7e1;
        border-bottom: 1px solid #d1d7e1;
    }
    .moonIcon {
        background: linear-gradient(135deg, #f2f6f8 0%,#d8e1e7 50%,#b5c6d0 51%,#e0eff9 100%);
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        right: 4px;
        height: 14px;
        transition: box-shadow .3s;
        width: 14px;
        position: absolute;
        transition: all .3s;
    }
    .moonIcon.noMoonIcon:hover .mSpyBtn,
    .moonIcon.noMoonIcon:hover .mAtkBtn,
    .moonIcon.noMoonIcon:hover .mTrpBtn {
        display: none;
    }
    .planetDataIcon:hover .pSpyBtn,
    .planetDataIcon:hover .pAtkBtn,
    .planetDataIcon:hover .pTrpBtn,
    .moonIcon:hover:not(.noMoonIcon) .mSpyBtn,
    .moonIcon:hover:not(.noMoonIcon) .mAtkBtn,
    .moonIcon:hover:not(.noMoonIcon) .mTrpBtn {
        display: block;
        opacity: 1;
    }
    .moonIcon:hover:not(.noMoonIcon) {
        box-shadow: 0 0 5px 0 #000000;
        right: -30px;
        width: 48px;
    }
    .pActSign, .mActSign {
        color: #886400;
        display: block;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size: 8px;
        position: absolute;
    }
    .planetDataIcon:hover .pActSign,
    .moonIcon:hover .mActSign {
        display: none;
    }
    .noMoonIcon {
        background: #60606060 !important;
        border-radius: 7px;
        box-shadow: 0 0 4px #00000080 inset;
        display: flex;
            align-items: center;
            justify-content: space-around;
        right: 4px;
        height: 14px;
        width: 14px;
        position: absolute;
    }
    .nowActive {
        background: linear-gradient(135deg, #feccb1 0%,#f17432 50%,#ea5507 51%,#fb955e 100%);
    }
    .min15Active {
        background: linear-gradient(135deg, #fceabb 0%,#fccd4d 50%,#f8b500 51%,#fbdf93 100%);
    }
    .nowInactive {
        background: linear-gradient(135deg, #9dd53a 0%,#a1d54f 50%,#80c217 51%,#7cbc0a 100%);
    }
    .alFounder {
        background: linear-gradient(135deg, #959595 0%,#0d0d0d 46%,#010101 50%,#0a0a0a 53%,#4e4e4e 76%,#383838 87%,#1b1b1b 100%);
    }
    #dataPlanets, #dataPlayers {
        display: flex;
            flex-direction: column;
            align-items: center;
        height: fit-content;
        max-height: 400px;
        margin: 5px 0;
        overflow-y: overlay;
        overflow-x: hidden;
    }
    #dataPlanets::-webkit-scrollbar,
    #dataPlayers::-webkit-scrollbar,
    #dataResponseBlock::-webkit-scrollbar {
        background: #0d1014;
        box-shadow: inset 0 0 5px black;
        width: 2px;
    }
    #dataPlanets::-webkit-scrollbar-thumb,
    #dataPlayers::-webkit-scrollbar-thumb,
    #dataResponseBlock::-webkit-scrollbar-thumb {
        background: #28333e;
        border: 1px solid #3c4c5d;
    }
    #dataPlanets::-webkit-scrollbar-thumb:hover,
    #dataPlayers::-webkit-scrollbar-thumb:hover,
    #dataResponseBlock::-webkit-scrollbar-thumb:hover {
        background: #323f4e;
    }
    #dataContentCaption {
        color: #6F9FC8;
        font: bold 10px/27px Verdana,Arial,Helvetica,sans-serif;
        margin: 0;
    }
    #dataInput {
        width: 80%;
        text-align: center;
        font-size: 12px;
        color: rgb(187, 187, 187) !important;
        box-shadow: none !important;
        line-height: 23px !important;
        border-width: 1px !important;
        border-style: solid !important;
        border-color: rgb(58, 72, 86) !important;
        border-image: initial !important;
        border-radius: 3px;
        background: -webkit-linear-gradient(top, rgb(14, 17, 23) 0px, rgb(35, 43, 51) 100%) !important;
        outline: none;
        padding-right: 24px;
        padding-left: 6px;
    }
    #dataInpClrBtn {
        color: grey;
        cursor: pointer;
        display: inline-block;
        font-family: Verdana;
        font-size: 16px;
        font-weight: bold;
        line-height: 14px;
        position: absolute;
        right: 16px;
        top: 33px;
        transform: rotate(45deg);
        transition: color .3s, transform .15s;
    }
    #dataInpClrBtn:hover {
        color: white;
        top: 34px;
        transform: rotate(225deg);
    }
    #dataFooter {
        background: url("https://gf3.geo.gfsrv.net/cdn23/174d5c09f617701fcaf1664a414869.gif") no-repeat;
        height: 21px;
        width: 222px;
    }
    input[type="radio"] {
        display: none;
    }
    .bevel {
        background: #0d1014;
        border: solid 1px #1e262e;
        border-radius: 4px;
        box-shadow: 0 0 5px black inset;
        color: #b8b8b8;
        display: block;
        font-size: 9px;
        height: fit-content;
        margin: 3px 0px 5px;
        padding: 4px;
        position: relative;
        width: 90%;
    }
    .dataResponseLines::before {
        background: linear-gradient(#00000000, #00000000);
    }
    .playersBlock {
        display: flex;
            align-items: center;
            justify-content: space-around;
    }
    #allianceName {
        color: #ffffff;
        cursor: pointer;
        transition: all .3s;
    }
    #allianceName:hover {
        color: #80ffff;
        text-shadow: 0 0 3px 1px #ffffff;
    }
    #dataSetBut {
        background: url("https://gf2.geo.gfsrv.net/cdn16/1bcb107d4cdd48d0878fe850157e46.png");
        background-size: 110px 10px;
        cursor: pointer;
        display: block;
        height: 10px;
        position: absolute;
        right: -16px;
        top: 10px;
        transition: filter .15s;
        width: 10px;
    }
    #dataSetBut:hover {
        filter: brightness(1.5);
    }
    #dataSetCloseBut {
        background: url("https://gf3.geo.gfsrv.net/cdneb/f5f81e8302aaad56c958c033677fb8.png");
        background-position: -206px 0;
        cursor: pointer;
        display: block;
        height: 17px;
        position: absolute;
        right: 10px;
        top: 10px;
        width: 17px;
    }
    #dataSetCloseBut:hover {
        background-position: -206px -17px;
    }
    #dataSettings {
        background: #000000e0;
        border: 2px solid #171d23;
        border-radius: 10px;
        display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        height: 50%;
        margin: 0 9.5%;
        opacity: 0;
        padding: 30px 0;
        position: absolute;
        top: 20%;
        transition: opacity .3s;
        width: 80%;
        z-index: 5;
    }
    #dataSProbeNumCap {
        color: #6F9FC8;
        font: bold 10px Verdana,Arial,Helvetica,sans-serif;
        height: 45px;
        margin: 0;
        text-align: center;
        width: 150px;
    }
    #dataSProbeNum {
        background: -webkit-linear-gradient(top, rgb(14, 17, 23) 0px, rgb(35, 43, 51) 100%) !important;
        border-color: rgb(58, 72, 86) !important;
        border-image: initial !important;
        border-radius: 3px;
        border-style: solid !important;
        border-width: 1px !important;
        box-shadow: none !important;
        color: rgb(187, 187, 187) !important;
        font: bold 12px Verdana, Arial, Helvetica, sans-serif;
        height: 18px;
        line-height: 23px !important;
        outline: none;
        text-align: center;
        width: 30%;
    }
`;

const dataWrapper = fnCreateElement("div", { id: "dataWrapper" }); //, style: 'opacity: .5;'
const dataHeader = fnCreateElement("div", { id: "dataHeader" });
const dataRBPlayer = fnCreateElement("input", {
    id: "dataRBPlayer",
    type: "radio",
    name: "category",
    infoCategory: "1",
});
const dataRBAlliance = fnCreateElement("input", {
    id: "dataRBAlliance",
    type: "radio",
    name: "category",
    infoCategory: "2",
});
const dataRBPoints = fnCreateElement("input", {
    id: "dataRBPoints",
    type: "radio",
    name: "type",
    infoType: "0",
});
const dataRBEconomics = fnCreateElement("input", {
    id: "dataRBEconomics",
    type: "radio",
    name: "type",
    infoType: "1",
});
const dataRBResearch = fnCreateElement("input", {
    id: "dataRBResearch",
    type: "radio",
    name: "type",
    infoType: "2",
});
const dataRBWeapons = fnCreateElement("input", {
    id: "dataRBWeapons",
    type: "radio",
    name: "type",
    infoType: "3",
});
const dataRBCollected = fnCreateElement("input", {
    id: "dataRBCollected",
    type: "radio",
    name: "type",
    infoType: "5",
});
const dataRBDestroyed = fnCreateElement("input", {
    id: "dataRBDestroyed",
    type: "radio",
    name: "type",
    infoType: "6",
});
const dataRBLost = fnCreateElement("input", {
    id: "dataRBLost",
    type: "radio",
    name: "type",
    infoType: "4",
});
const dataRBHonor = fnCreateElement("input", {
    id: "dataRBHonor",
    type: "radio",
    name: "type",
    infoType: "7",
});
const dataIconBoxCategory = fnCreateElement("div", {
    id: "dataIconBoxCategory",
});
const dataIBCPlayer = fnCreateElement("div", {
    id: "dataIBCPlayer",
    class: "dataIcon",
    onclick: "dataRBPlayer.click()",
});
const dataIBCAlliance = fnCreateElement("div", {
    id: "dataIBCAlliance",
    class: "dataIcon",
    onclick: "dataRBAlliance.click()",
});
const dataIconBoxType = fnCreateElement("div", { id: "dataIconBoxType" });
const dataIBTPoints = fnCreateElement("div", {
    id: "dataIBTPoints",
    class: "dataIcon",
    onclick: "dataRBPoints.click()",
});
const dataIBTEconomics = fnCreateElement("div", {
    id: "dataIBTEconomics",
    class: "dataIcon",
    onclick: "dataRBEconomics.click()",
});
const dataIBTResearch = fnCreateElement("div", {
    id: "dataIBTResearch",
    class: "dataIcon",
    onclick: "dataRBResearch.click()",
});
const dataIBTWeapons = fnCreateElement("div", {
    id: "dataIBTWeapons",
    class: "dataIcon",
    onclick: "dataRBWeapons.click()",
});
const dataIconBoxTypeSmall = fnCreateElement("div", {
    id: "dataIconBoxTypeSmall",
});
const dataIBTsCollected = fnCreateElement("div", {
    id: "dataIBTsCollected",
    class: "dataIcon_small",
    onclick: "dataRBCollected.click()",
});
const dataIBTsDestroyed = fnCreateElement("div", {
    id: "dataIBTsDestroyed",
    class: "dataIcon_small",
    onclick: "dataRBDestroyed.click()",
});
const dataIBTsLost = fnCreateElement("div", {
    id: "dataIBTsLost",
    class: "dataIcon_small",
    onclick: "dataRBLost.click()",
});
const dataIBTsHonor = fnCreateElement("div", {
    id: "dataIBTsHonor",
    class: "dataIcon_small",
    onclick: "dataRBHonor.click()",
});
const dataBackground = fnCreateElement("div", { id: "dataBackground" });
const dataRequestBlock = fnCreateElement("div", { id: "dataRequestBlock" });
const dataContentCaption = fnCreateElement("h3", {
    id: "dataContentCaption",
    title: "Формат координат:\n1:256:8\n1 256 8\n1.256.8",
});
const dataInput = fnCreateElement("input", {
    id: "dataInput",
    type: "text",
    autocomplete: "off",
});
const dataInpClrBtn = fnCreateElement("div", { id: "dataInpClrBtn" }, '+');
const dataResponseBlock = fnCreateElement("div", { id: "dataResponseBlock" });
const dataFooter = fnCreateElement("div", { id: "dataFooter" });
const dataSetBut = fnCreateElement("div", { id: "dataSetBut" });
const dataSetCloseBut = fnCreateElement("div", { id: "dataSetCloseBut" });
const dataSettings = fnCreateElement("div", { id: "dataSettings" });
const dataSProbeNumCap = fnCreateElement("p", { id: "dataSProbeNumCap" }, 'Количество зондов для шпионажа:');
const dataSProbeNum = fnCreateElement("input", {
    id: "dataSProbeNum",
    type: "text",
    value: localStorage.getItem("probesToSpy"),
});

if (localStorage.getItem("playerInputChecked") == null)
    localStorage.setItem("playerInputChecked", "true");
else if (localStorage.getItem("playerInputChecked") === "true") {
    dataRBPlayer.checked = true;
    dataRBAlliance.checked = false;
} else if (localStorage.getItem("allianceInputChecked") === "true") {
    dataRBAlliance.checked = true;
    dataRBPlayer.checked = false;
}

let stopper = false;

document.body.appendChild(dataPanelStyle);
document.body.appendChild(dataWrapper);
dataWrapper.appendChild(dataSettings);
dataSettings.appendChild(dataSetCloseBut);
dataSettings.appendChild(dataSProbeNumCap);
dataSettings.appendChild(dataSProbeNum);
dataWrapper.appendChild(dataHeader);
dataHeader.appendChild(dataIconBoxCategory);
dataIconBoxCategory.appendChild(dataRBPlayer);
dataIconBoxCategory.appendChild(dataIBCPlayer);
dataIconBoxCategory.appendChild(dataRBAlliance);
dataIconBoxCategory.appendChild(dataIBCAlliance);
dataHeader.appendChild(dataIconBoxType);
dataIconBoxType.appendChild(dataRBPoints);
dataIconBoxType.appendChild(dataIBTPoints);
dataIconBoxType.appendChild(dataRBEconomics);
dataIconBoxType.appendChild(dataIBTEconomics);
dataIconBoxType.appendChild(dataRBResearch);
dataIconBoxType.appendChild(dataIBTResearch);
dataIconBoxType.appendChild(dataRBWeapons);
dataIconBoxType.appendChild(dataIBTWeapons);
dataHeader.appendChild(dataIconBoxTypeSmall);
dataIconBoxTypeSmall.appendChild(dataRBCollected);
dataIconBoxTypeSmall.appendChild(dataIBTsCollected);
dataIconBoxTypeSmall.appendChild(dataRBDestroyed);
dataIconBoxTypeSmall.appendChild(dataIBTsDestroyed);
dataIconBoxTypeSmall.appendChild(dataRBLost);
dataIconBoxTypeSmall.appendChild(dataIBTsLost);
dataIconBoxTypeSmall.appendChild(dataRBHonor);
dataIconBoxTypeSmall.appendChild(dataIBTsHonor);
dataIconBoxTypeSmall.appendChild(dataSetBut);
dataWrapper.appendChild(dataBackground);
dataBackground.appendChild(dataRequestBlock);
dataBackground.appendChild(dataResponseBlock);
dataRequestBlock.appendChild(dataContentCaption);
dataContentCaption.innerText =
    localStorage.getItem("currCapt") || "Имя/ID игрока/Координаты:";
dataRequestBlock.appendChild(dataInput);
dataRequestBlock.appendChild(dataInpClrBtn);
dataWrapper.appendChild(dataFooter);

dataWrapper.style.left =
    localStorage.getItem("dataWrapperLeft") == null
        ? "5px"
        : localStorage.getItem("dataWrapperLeft");
dataWrapper.style.top =
    localStorage.getItem("dataWrapperTop") == null
        ? "60px"
        : localStorage.getItem("dataWrapperTop");

function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
        left: box.left,
        top: box.top,
    };
}

dataHeader.onmousedown = (e) => {
    let coords = getCoords(dataWrapper);
    let shiftX = e.clientX - coords.left;
    let shiftY = e.clientY - coords.top;
    dataHeader.style.cursor = "grabbing";
    moveAt(e);
    function moveAt(e) {
        dataWrapper.style.left = e.clientX - shiftX + "px";
        dataWrapper.style.top = e.clientY - shiftY + "px";
    }
    document.onmousemove = (e) => moveAt(e);
    dataHeader.onmouseup = function () {
        localStorage.setItem("dataWrapperLeft", getCoords(dataWrapper).left + "px");
        localStorage.setItem("dataWrapperTop", getCoords(dataWrapper).top + "px");
        dataHeader.removeAttribute("style");
        document.onmousemove = null;
        dataHeader.onmouseup = null;
    };
};

dataHeader.ondragstart = () => false;

dataSetBut.onclick = (e) => {
    e.stopPropagation();
    dataSettings.style.display = "flex";
    setTimeout(() => {
        dataSettings.style.opacity = "1";
    }, 0);
};

dataSetCloseBut.onclick = (e) => {
    e.stopPropagation();
    dataSettings.style.opacity = "0";
    setTimeout(() => {
        dataSettings.style.display = "none";
    }, 300);
};

dataSProbeNum.oninput = () => {
    if (dataSProbeNum.value === "") dataSProbeNum.value = "1";
    dataSProbeNum.value = dataSProbeNum.value.replace(/\D/g, "");
    localStorage.setItem("probesToSpy", dataSProbeNum.value);
};

dataSProbeNum.onwheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) dataSProbeNum.value = +dataSProbeNum.value + 1;
    else dataSProbeNum.value = +dataSProbeNum.value - 1;
    localStorage.setItem("probesToSpy", dataSProbeNum.value);
};

let iframeBlock = fnCreateElement("iframe", {
    style: "display: block; position: absolute; visibility: hidden;",
});
document.body.insertAdjacentElement("afterbegin", iframeBlock);
iframeBlock.src = `https://s${universeId}-ru.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&galaxy=1&system=1`;

let flag = 0;
dataIBTWeapons.onclick = () => {
    dataRBWeapons.checked = true;
    if (flag === 0) {
        dataIBTPoints.style.opacity = 0;
        dataIBTEconomics.style.opacity = 0;
        dataIBTResearch.style.opacity = 0;
        setTimeout(() => {
            dataIconBoxType.style.left = "-29.75px";
            dataIBTsCollected.style.transition = "opacity .2s .2s";
            dataIBTsCollected.style.opacity = 1;
            dataIBTsDestroyed.style.transition = "opacity .2s .15s";
            dataIBTsDestroyed.style.opacity = 1;
            dataIBTsLost.style.transition = "opacity .2s .1s";
            dataIBTsLost.style.opacity = 1;
            dataIBTsHonor.style.transition = "opacity .2s .05s";
            dataIBTsHonor.style.opacity = 1;
            dataIBTPoints.style.visibility = "hidden";
            dataIBTEconomics.style.visibility = "hidden";
            dataIBTResearch.style.visibility = "hidden";
            flag = 1;
        }, 200);
    } else if (flag === 1) {
        dataIconBoxType.style.left = "44px";
        dataIBTsCollected.style.transition = "opacity .2s .05s";
        dataIBTsCollected.style.opacity = 0;
        dataIBTsDestroyed.style.transition = "opacity .2s .1s";
        dataIBTsDestroyed.style.opacity = 0;
        dataIBTsLost.style.transition = "opacity .2s .15s";
        dataIBTsLost.style.opacity = 0;
        dataIBTsHonor.style.transition = "opacity .2s .2s";
        dataIBTsHonor.style.opacity = 0;
        flag = 0;
        setTimeout(() => {
            dataIBTPoints.style.visibility = "visible";
            dataIBTEconomics.style.visibility = "visible";
            dataIBTResearch.style.visibility = "visible";
            dataIBTPoints.style.opacity = 1;
            dataIBTEconomics.style.opacity = 1;
            dataIBTResearch.style.opacity = 1;
        }, 400);
    }
};

dataWrapper.onmouseover = () => {
    dataWrapper.style.opacity = "1";
    clearTimeout(opacityTimer);
};
dataWrapper.onclick = dataWrapper.onmouseover;
dataWrapper.oninput = dataWrapper.onmouseover;
dataWrapper.onmouseout = () => {
    opacityTimer = setTimeout(() => {
        dataWrapper.style.opacity = ".5";
    }, 10000);
};
dataInput.onblur = dataWrapper.onmouseout;

function clearResponseBlock() {
    dataResponseBlock.innerHTML = "";
}

dataInpClrBtn.onclick = () => {
    stopper = true;
    dataInput.value = "";
    dataInput.focus();
    if (dataRBPlayer.checked) {
        localStorage.setItem("playerInput", dataInput.value);
        localStorage.setItem("playerDataShown", "false");
    } else if (dataRBAlliance.checked) {
        localStorage.setItem("allianceInput", dataInput.value);
        localStorage.setItem("allianceDataShown", "false");
    }
    clearResponseBlock();
};

document.addEventListener('readystatechange', () => {
    // playerData <
    playerData.id = window.playerId;
    playerData.name = window.playerName;
    playerData.serverId = fetchedPlayerData
        .querySelector("playerData")
        .getAttribute("serverId");
    playerData.planets = [];
    playerData.alliance = {};
    for (let item of fetchedPlayerData.querySelectorAll("planet")) {
        playerData.planets.push({
            id: item.id,
            name: item.attributes.name.value,
            coords: {
                raw: item.attributes.coords.value,
                gal: item.attributes.coords.value.match(/^\d/g)[0],
                sys: item.attributes.coords.value.match(/:(\d{1,3}):/)[1],
                pos: item.attributes.coords.value.match(/\d{1,2}$/g)[0],
            },
        });
    }
    // > playerData
    // universe <
    fetchedUniverse.forEach((planet, i) => {
        universe[i] = {
            id: planet.id,
            player: planet.attributes.player.value,
            name: planet.attributes.name.value,
            coords: {
                raw: planet.attributes.coords.value,
                gal: planet.attributes.coords.value.match(/^\d/g)[0],
                sys: planet.attributes.coords.value.match(/:(\d{1,3}):/)[1],
                pos: planet.attributes.coords.value.match(/\d{1,2}$/g)[0],
            },
            moon: planet.firstChild && {
                id: planet.firstChild.attributes.id.value,
                name: planet.firstChild.attributes.name.value,
                size: planet.firstChild.attributes.size.value,
            },
        };
    });
    // > universe
    // players <
    fetchedPlayers.forEach((item, i) => {
        players[i] = {
            id: item.id,
            name: item.attributes.name.value,
            status: item.attributes.status && item.attributes.status.value,
            alliance: {},
            planets: universe.filter((planet) => planet.player === item.id),
        };
    });
    // > players
    // alliances <
    fetchedAlliances.forEach((item, i) => {
        alliances[i] = {
            id: item.id,
            name: item.attributes.name.value,
            tag: item.attributes.tag.value,
            founder: players.find(
                (player) => player.id === item.attributes.founder.value
            ),
            foundDate: new Date(+item.attributes.foundDate.value * 1000),
            players: [],
            homePage: item.attributes.homepage && item.attributes.homepage.value,
            logo: item.attributes.logo && item.attributes.logo.value,
        };
        item.childNodes.forEach((elem) =>
            alliances[i].players.push(
                ...players.filter((player) => player.id === elem.id)
            )
        ); // players for alliance
    });
    // > alliances
    // players highscores <
    // console.log(fetchedPlayersHighscores[0][0]);
    // > players highscores
    // linking data <
    playerData.alliance = alliances.filter(
        (alliance) => alliance.id === fetchedPlayerData.querySelector("alliance")?.id
    )[0];
    universe.forEach((planet) => {
        let tempPlrId = Array.from(fetchedUniverse).filter(
            (elem) => elem.id === planet.id
        )[0].attributes.player.value;
        planet.player = players.filter((player) => player.id === tempPlrId)[0];
    });
    players.forEach((player) => {
        let currentAllianceId = Array.from(fetchedAlliances).filter(
            (alliance) =>
                alliance.id ===
                Array.from(alliance.childNodes).filter((plr) => plr.id === player.id)[0]
                    ?.parentNode.id
        )[0]?.id;
        player.alliance = alliances.filter(
            (alliance) => alliance.id === currentAllianceId
        )[0];
    });
    // > linking data
    // console.log('playerData', playerData);
    // console.log('universe', universe);
    // console.log('players', players);
    // console.log('alliances', alliances);

    if (dataRBPlayer.checked) {
        dataInput.value = localStorage.getItem("playerInput");
        if (localStorage.getItem("playerDataShown") === "true")
            createLineDetails(
                players.filter((player) => player.name === dataInput.value)[0],
                1
            );
        else fillSearchResult(players, 1);
    } else if (dataRBAlliance.checked) {
        dataInput.value = localStorage.getItem("allianceInput");
        if (localStorage.getItem("allianceDataShown") === "true") {
            let currentAlliance = alliances.filter(
                (alliance) => alliance.name === dataInput.value
            )[0];
            let currentPlayers = currentAlliance.players;
            let currentFounder = currentAlliance.founder.name;
            createLineDetails(currentAlliance, 2, currentPlayers, currentFounder);
        } else fillSearchResult(alliances, 2);
    }

    dataIBCPlayer.onclick = (e) => {
        e.stopPropagation();
        dataRBPlayer.checked = true;
        dataContentCaption.innerText = "Имя/ID игрока/Координаты:";
        localStorage.setItem("currCapt", "Имя/ID игрока/Координаты:");
        localStorage.setItem("playerInputChecked", "true");
        localStorage.setItem("allianceInputChecked", "false");
        dataInput.value = localStorage.getItem("playerInput");
        clearResponseBlock();
        if (localStorage.getItem("playerDataShown") === "true") {
            createLineDetails(
                players.filter((player) => player.name === dataInput.value)[0],
                1
            );
        }
        else fillSearchResult(players, 1);
        dataInput.focus();
    };

    dataIBCAlliance.onclick = (e) => {
        e.stopPropagation();
        dataRBAlliance.checked = true;
        dataContentCaption.innerText = "Название/тэг/ID альянса:";
        localStorage.setItem("currCapt", "Название/тэг/ID альянса:");
        localStorage.setItem("allianceInputChecked", "true");
        localStorage.setItem("playerInputChecked", "false");
        dataInput.value = localStorage.getItem("allianceInput");
        clearResponseBlock();
        if (localStorage.getItem("allianceDataShown") === "true") {
            let currentAlliance = alliances.filter(
                (alliance) => alliance.name === dataInput.value
            )[0];
            let currentPlayers = currentAlliance.players;
            let currentFounder = currentAlliance.founder.name;
            createLineDetails(currentAlliance, 2, currentPlayers, currentFounder);
        } else fillSearchResult(alliances, 2);
        dataInput.focus();
    };

    dataInput.oninput = () => {
        if (dataRBPlayer.checked) {
            localStorage.setItem("playerInput", dataInput.value);
            localStorage.setItem("playerDataShown", "false");
            fillSearchResult(players, 1);
        } else if (dataRBAlliance.checked) {
            localStorage.setItem("allianceInput", dataInput.value);
            localStorage.setItem("allianceDataShown", "false");
            fillSearchResult(alliances, 2);
        }
    };

    function fillSearchResult(data, mode) {
        let regExp = new RegExp(dataInput.value, "gi");
        let cordsExp = /^(\d)[\s:.](\d{1,3})[\s:.]([1-9][0-6]?)$/;
        let resArray = [];
        switch (mode) {
            case 1:
                data.forEach((item) => {
                    if (item.name.match(regExp) || item.id.match(regExp))
                        resArray.push(item.name);
                });
                if (dataInput.value.match(cordsExp)) {
                    let currentCoords = `${dataInput.value.match(cordsExp)[1]}:${dataInput.value.match(cordsExp)[2]
                        }:${dataInput.value.match(cordsExp)[3]}`;
                    let currentPlayer = universe.filter(
                        (planet) => planet.coords.raw === currentCoords
                    )[0]?.player;
                    currentPlayer
                        ? resArray.push(
                            data.filter((item) => item.id === currentPlayer.id)[0]?.name
                        )
                        : (resArray = []);
                    createRespLines(resArray); // array of string
                    break;
                }
                createRespLines(resArray); // array of string
                break;
            case 2:
                data.forEach((item) => {
                    if (
                        item.name.match(regExp) ||
                        item.tag.match(regExp) ||
                        item.id.match(regExp)
                    )
                        resArray.push(item.name);
                });
                createRespLines(resArray); // array of string
                break;
        }
    }

    function createRespLines(arr) {
        clearResponseBlock();
        let u = [];
        for (let i in arr) {
            u[i] = fnCreateElement("div", { class: "dataResponseLines" }, arr[i]);
            let status = players.filter((player) => player.name === arr[i])[0]?.status;
            if (status) {
                if (status.match(/a/)) u[i].style.color = "#f48406";
                else if (status.match(/b/)) u[i].style.textDecoration = "line-through";
                else if (status.match(/v/)) u[i].style.color = "aqua";
                else if (status.match(/i/)) u[i].style.color = "#7e7e7e";
                else if (status.match(/I/)) u[i].style.color = "#5f5f5f";
            }
            u[i].onclick = (e) => {
                dataInput.value = e.target.innerText;
                if (dataRBPlayer.checked) {
                    localStorage.setItem("playerInput", dataInput.value);
                    localStorage.setItem("playerDataShown", "true");
                    clearResponseBlock();
                    let currentPlayer = players.filter(
                        (player) => player.name === e.target.innerText
                    )[0];
                    createLineDetails(currentPlayer, 1);
                } else if (dataRBAlliance.checked) {
                    localStorage.setItem("allianceInput", dataInput.value);
                    localStorage.setItem("allianceDataShown", "true");
                    let currentAlliance = alliances.filter(
                        (alliance) => alliance.name === e.target.innerText
                    )[0];
                    let currentPlayers = currentAlliance.players;
                    let currentFounder = currentAlliance.founder.name;
                    clearResponseBlock();
                    createLineDetails(currentAlliance, 2, currentPlayers, currentFounder);
                }
            };
            dataInput.value !== ""
                ? dataResponseBlock.appendChild(u[i])
                : clearResponseBlock();
        }
    }

    function showAlliance(handler) {
        dataInput.value = handler.target.innerText;
        dataContentCaption.innerText = "Название/тэг/ID альянса:";
        localStorage.setItem("currCapt", "Название/тэг/ID альянса:");
        localStorage.setItem("allianceInputChecked", "true");
        localStorage.setItem("playerInputChecked", "false");
        localStorage.setItem("allianceInput", dataInput.value);
        localStorage.setItem("allianceDataShown", "true");
        let currentAlliance = alliances.filter(
            (alliance) => alliance.name === handler.target.innerText
        )[0];
        let currentPlayers = currentAlliance.players;
        let currentFounder = currentAlliance.founder.name;
        clearResponseBlock();
        createLineDetails(currentAlliance, 2, currentPlayers, currentFounder);
    }

    function createLineDetails(obj, mode, allys = null, founder = null) {
        stopper = false;
        let bevel = fnCreateElement("div", { id: "bevel", class: "bevel" });
        dataResponseBlock.appendChild(bevel);
        if (mode === 1) {
            let playerIdBlock = fnCreateElement("div", {
                id: "playerIdBlock",
                style: "cursor: default;",
            });
            playerIdBlock.innerHTML = `<p>ID: <span style="color: white;">${obj.id}</span></p>`;
            bevel.appendChild(playerIdBlock);
            if (obj.alliance?.id) {
                let allianceLabel = fnCreateElement("div", {
                    id: "allianceLabel",
                    style: "display: flex; justify-content: center;",
                });
                let allianceSign = fnCreateElement("div", {
                    id: "allianceSign",
                    style: "cursor: default; margin-right: 4px;",
                }, "Альянс:");
                let allianceName = fnCreateElement("div", {
                    id: "allianceName",
                    title: `ID: ${obj.alliance.id}\nТег: ${obj.alliance.tag}`,
                }, obj.alliance.name);
                allianceName.onclick = (e) => {
                    dataRBAlliance.checked = true;
                    showAlliance(e);
                };
                allianceLabel.appendChild(allianceSign);
                allianceLabel.appendChild(allianceName);
                bevel.appendChild(allianceLabel);
            }
            let playerInfoBlock = fnCreateElement("div", { id: "dataStats" });
            bevel.appendChild(playerInfoBlock);
            let hs = [],
                imgs = [];
            for (let i = 0; i < 8; i++) {
                getData(
                    `https://s${universeId}-ru.ogame.gameforge.com/api/highscore.xml?category=1&type=${i}`
                ).then((data) => {
                    hs[i] = fnCreateElement("div", { class: `dataHs hsType${i}` });
                    imgs[i] =
                        i < 4
                            ? fnCreateElement("div", { class: `dataImg1 imgType${i}` })
                            : fnCreateElement("div", { class: `dataImg2 imgType${i}` });
                    hs[i].appendChild(imgs[i]);
                    hs[i].insertAdjacentHTML(
                        "beforeend",
                        `<div style="display: flex; flex-direction: column;"><p><span>${data
                            .querySelector(`player[id="${obj.id}"]`)
                            .getAttribute("position")}</span> место</p>
                        <p><span>${data
                            .querySelector(`player[id="${obj.id}"]`)
                            .getAttribute("score")
                            .toLocaleString()}</span> очков</p></div>`
                    );
                    playerInfoBlock.appendChild(hs[i]);
                });
            }
            getData(
                `https://s${universeId}-ru.ogame.gameforge.com/api/highscore.xml?category=1&type=3`
            ).then((data) => {
                let shipsAmount = +data
                    .querySelector(`player[id="${obj.id}"]`)
                    .getAttribute("ships");
                if (shipsAmount)
                    playerInfoBlock.insertAdjacentHTML(
                        "afterend",
                        `<p style="cursor: default; padding-top: 3px;">Корабли:&nbsp;<span style="color: white;">${shipsAmount.toLocaleString()}</span></p>`
                    );
                else
                    playerInfoBlock.insertAdjacentHTML(
                        "afterend",
                        '<p style="padding-top: 3px;">Нет кораблей</p>'
                    );
            });
            let planetsBlock = fnCreateElement("div", { id: "dataPlanets" });
            bevel.appendChild(planetsBlock);
            getData(
                `https://s${universeId}-ru.ogame.gameforge.com/api/universe.xml`
            ).then((data) => {
                let p = [],
                    pt = [],
                    mn = [],
                    crd = [],
                    pAS = [],
                    mAS = [];
                let planets = data.querySelectorAll(`planet[player="${obj.id}"]`);
                planetsBlock.insertAdjacentHTML(
                    "afterbegin",
                    `<p style="cursor: default; margin: 3px 0;">Количество планет ${planets.length}:</p>`
                );
                for (let i = 0; i < planets.length; i++) {
                    p[i] = fnCreateElement("div", { class: "dataPlanetList" });
                    let dataBlock = fnCreateElement("div", { class: "dataBlock" });
                    pt[i] = fnCreateElement("div", { class: "planetDataIcon" });
                    pAS[i] = fnCreateElement("span", { class: "pActSign" });
                    let pSpyBtn = fnCreateElement("div", { class: "pSpyBtn" });
                    pSpyBtn.title = "Шпионаж";
                    pSpyBtn.onclick = (e) => {
                        let cords;
                        let probeNum = +localStorage.getItem("probesToSpy");
                        cords = e.target.parentNode.nextSibling.textContent;
                        sendShipsWithPopup(
                            6,
                            +cords.split(":")[0],
                            +cords.split(":")[1],
                            +cords.split(":")[2],
                            0,
                            probeNum
                        );
                    };
                    let pAtkBtn = fnCreateElement("div", { class: "pAtkBtn" });
                    pAtkBtn.title = "Атака";
                    pAtkBtn.onclick = (e) => {
                        let cords;
                        cords = e.target.parentNode.nextSibling.textContent;
                        location.href = `https://s${universeId}-ru.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch&galaxy=${cords.split(":")[0]
                            }&system=${cords.split(":")[1]}&position=${cords.split(":")[2]
                            }&type=1&mission=1`;
                    };
                    let pTrpBtn = fnCreateElement("div", { class: "pTrpBtn" });
                    pTrpBtn.title = "Транспорт";
                    pTrpBtn.onclick = (e) => {
                        let cords;
                        cords = e.target.parentNode.nextSibling.textContent;
                        location.href = `https://s${universeId}-ru.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch&galaxy=${cords.split(":")[0]
                            }&system=${cords.split(":")[1]}&position=${cords.split(":")[2]
                            }&type=1&mission=3`;
                    };
                    crd[i] = fnCreateElement("span", {
                        class: "cordsBlock",
                        title: "Удерживайте Ctrl или Alt для открытия в новом окне",
                    });
                    mn[i] = fnCreateElement("div", { class: "moonIcon" });
                    mAS[i] = fnCreateElement("span", { class: "mActSign" });
                    let mTrpBtn = fnCreateElement("div", { class: "mTrpBtn" });
                    mTrpBtn.title = pTrpBtn.title;
                    mTrpBtn.onclick = (e) => {
                        let cords;
                        cords = e.target.parentNode.previousSibling.textContent;
                        location.href = `https://s${universeId}-ru.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch&galaxy=${cords.split(":")[0]
                            }&system=${cords.split(":")[1]}&position=${cords.split(":")[2]
                            }&type=3&mission=3`;
                    };
                    let mAtkBtn = fnCreateElement("div", { class: "mAtkBtn" });
                    mAtkBtn.title = pAtkBtn.title;
                    mAtkBtn.onclick = (e) => {
                        let cords;
                        cords = e.target.parentNode.previousSibling.textContent;
                        location.href = `https://s${universeId}-ru.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch&galaxy=${cords.split(":")[0]
                            }&system=${cords.split(":")[1]}&position=${cords.split(":")[2]
                            }&type=3&mission=1`;
                    };
                    let mSpyBtn = fnCreateElement("div", { class: "mSpyBtn" });
                    mSpyBtn.title = pSpyBtn.title;
                    mSpyBtn.onclick = (e) => {
                        let cords;
                        let probeNum = +localStorage.getItem("probesToSpy");
                        cords = e.target.parentNode.previousSibling.textContent;
                        sendShipsWithPopup(
                            6,
                            +cords.split(":")[0],
                            +cords.split(":")[1],
                            +cords.split(":")[2],
                            3,
                            probeNum
                        );
                    };
                    p[i].appendChild(dataBlock);
                    dataBlock.appendChild(pt[i]);
                    pt[i].appendChild(pTrpBtn);
                    pt[i].appendChild(pAtkBtn);
                    pt[i].appendChild(pSpyBtn);
                    pt[i].appendChild(pAS[i]);
                    dataBlock.appendChild(crd[i]);
                    dataBlock.appendChild(mn[i]);
                    mn[i].appendChild(mAS[i]);
                    mn[i].appendChild(mSpyBtn);
                    mn[i].appendChild(mAtkBtn);
                    mn[i].appendChild(mTrpBtn);
                    crd[i].innerText = planets[i].getAttribute("coords");
                    pt[i].title = `Имя: ${planets[i].getAttribute("name")}\nID: ${planets[i].id
                        }`;
                    if (planets[i].hasChildNodes())
                        mn[i].title = `Имя: ${planets[i].firstElementChild.getAttribute(
                            "name"
                        )}\nID: ${planets[i].firstElementChild.id}\nДиаметр: ${planets[
                            i
                        ].firstElementChild.getAttribute("size")} км`;
                    else mn[i].classList.add("noMoonIcon");
                    crd[i].onmouseup = (e) => {
                        e.stopPropagation();
                        let url = `https://s${universeId}-ru.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&galaxy=${e.target.textContent.match(/^\d/)[0]
                            }&system=${e.target.textContent.match(/:(\d{1,3}):/)[1]}`;
                        if (e.metaKey || e.ctrlKey) window.open(url);
                        else if (e.button === 0) location.href = url;
                    };
                    planetsBlock.appendChild(p[i]);
                }

                async function getSysData(ifrm, gal, sys) {
                    let resp = await ifrm.contentWindow.$.post(
                        ifrm.contentWindow.galaxyContentLink,
                        { galaxy: gal, system: sys },
                        ifrm.contentWindow.renderContentGalaxy
                    );
                    let data = JSON.parse(resp);
                    return data.system.galaxyContent;
                }

                if (!window.frameElement) {
                    for (let i = 0; i < p.length; i++) {
                        let galaxy = obj.planets[i].coords.gal;
                        let system = obj.planets[i].coords.sys;
                        let position = obj.planets[i].coords.pos;
                        getSysData(iframeBlock, galaxy, system).then((sysData) => {
                            let currentPlanet = sysData[position - 1].planets[0];
                            if (currentPlanet.activity.showActivity) {
                                if (currentPlanet.activity.idleTime <= 15)
                                    pt[i].classList.add("nowActive");
                                else {
                                    pt[i].classList.add("min15Active");
                                    pAS[i].innerText = currentPlanet.activity.idleTime;
                                }
                            } else pt[i].classList.add("nowInactive");
                            let currentMoon = sysData[position - 1].planets.filter(
                                (planet) => planet.planetType === 3
                            )[0];
                            if (currentMoon) {
                                mn[i].classList.remove("noMoonIcon");
                                if (!currentMoon.activity.showActivity)
                                    mn[i].classList.add("nowInactive");
                                else if (currentMoon.activity.idleTime <= 15)
                                    mn[i].classList.add("nowActive");
                                else if (currentMoon.activity.idleTime > 15) {
                                    mn[i].classList.add("min15Active");
                                    mAS[i].innerText = currentMoon.activity.idleTime;
                                }
                            }
                        });
                    }
                }
            });
        } else if (mode === 2) {
            let allianceInfoBlock = fnCreateElement("div", {
                id: "allianceInfoBlock",
            });
            allianceInfoBlock.innerHTML = `<p>ID: <span style="color: white;">${obj.id}</span></p>\n<p>Тег: <span style="color: white;">${obj.tag}</span></p>`;
            let dataPlayers = fnCreateElement("div", { id: "dataPlayers" });
            bevel.appendChild(allianceInfoBlock);
            bevel.appendChild(dataPlayers);
            dataPlayers.insertAdjacentHTML(
                "afterbegin",
                `<p style="margin: 3px 0;">Количество игроков ${allys.length}:</p>`
            );
            let u = [];
            for (let i = 0; i < allys.length; i++) {
                u[i] = fnCreateElement("div", { class: "dataPlayersList" });
                let dataBlock = fnCreateElement("div", { class: "dataBlock" });
                u[i].appendChild(dataBlock);
                if (allys[i].name === founder) u[i].classList.add("alFounder");
                let status = players.filter((player) => player.id === allys[i].id)[0]
                    .status;
                if (status) {
                    if (status.match(/a/)) dataBlock.style.color = "#f48406";
                    else if (status.match(/b/))
                        dataBlock.style.textDecoration = "line-through";
                    else if (status.match(/v/)) dataBlock.style.color = "aqua";
                    else if (status.match(/i/)) dataBlock.style.color = "#7e7e7e";
                    else if (status.match(/I/)) dataBlock.style.color = "#5f5f5f";
                }

                getData(
                    `https://s${universeId}-ru.ogame.gameforge.com/api/players.xml`
                ).then((data1) => {
                    getData(
                        `https://s${universeId}-ru.ogame.gameforge.com/api/highscore.xml?category=1&type=0`
                    ).then((data2) => {
                        let pos = data2.querySelector(`player[id="${allys[i].id}"]`);
                        pos == null ? (pos = "-") : (pos = pos.getAttribute("position"));
                        dataBlock.innerHTML = `<span class="posSpan">${pos != null ? pos : "x"
                            }</span>${data1
                                .querySelector(`player[id="${allys[i].id}"]`)
                                .getAttribute("name")}`;
                    });
                });

                u[i].onclick = (e) => {
                    e.stopPropagation();
                    localStorage.setItem("playerInput", e.target.firstChild.nextSibling.textContent);
                    dataIBCPlayer.click();
                    dataInput.oninput();
                };
                let playersBlock = fnCreateElement("div", {
                    id: "playersBlock",
                    class: "playersBlock",
                });
                playersBlock.appendChild(u[i]);
                dataPlayers.appendChild(playersBlock);
            }
            let hs = [],
                imgs = [];
            for (let i = 0; i < 8; i++) {
                getData(
                    `https://s${universeId}-ru.ogame.gameforge.com/api/highscore.xml?category=2&type=${i}`
                ).then((data) => {
                    hs[i] = fnCreateElement("div", { class: `dataHs hsType${i}` });
                    imgs[i] =
                        i < 4
                            ? fnCreateElement("div", { class: `dataImg1 imgType${i}` })
                            : fnCreateElement("div", { class: `dataImg2 imgType${i}` });
                    hs[i].appendChild(imgs[i]);
                    hs[i].insertAdjacentHTML(
                        "beforeend",
                        `<div style="display: flex; flex-direction: column;"><p><span>${data
                            .querySelector(`alliance[id="${obj.id}"]`)
                            .getAttribute("position")}</span> место</p>
                        <p><span>${(+data
                            .querySelector(`alliance[id="${obj.id}"]`)
                            .getAttribute("score")).toLocaleString(
                                "ru"
                            )}</span> очков</p></div>`
                    );
                    allianceInfoBlock.appendChild(hs[i]);
                });
            }
        }
    }
});
