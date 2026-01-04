// ==UserScript==
// @name         500Play Extras
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  try to take over the world!
// @author       Bazsi15
// @match        https://csgo500.com/*
// @match        https://500play.com/*
// @icon         https://www.google.com/s2/favicons?domain=csgo500.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428735/500Play%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/428735/500Play%20Extras.meta.js
// ==/UserScript==

(function() {
    var settingPanel,maxBet,toggleTrain,toggleTrainStr,toggleTrainLabel,toggleRewards,toggleRewardsLabel,rightNav,style,i=0,defaultmaxbet=400,add_player,hpcont,ta,trainbtn,trainstr,hpreload=0,trainValue,trainValueOld,trainCycle=1;
    function addGui() {
        style = document.createElement('style');
        style.innerHTML = '.maxbetinput {width:3vw !important;background:#27262C;color:#ECDDDF;height:auto !important;outline:none;border:none;} .maxbetinput::-webkit-inner-spin-button {-webkit-appearance: none;margin: 0;} .maxbetinput[type=number] {-moz-appearance:textfield;} .toggleb15 {display:none;margin:2px;} .labelb15 {text-align:center;font-size:0.9375rem;margin-left:0.5vw;padding-left:0px !important;} .toggleb15:checked + .labelb15 {background-color: #C8354F; color: #ECDDDF;} .toggleb15 + .labelb15 {display: inline-block;margin-top: 0px;height:2em;width: 2vw;max-width: 2vw;padding:0.2em;vertical-align:center;color: #000;background-color: rgba(255,255,255,1);border-color: #ddd;transition: all 0.15s;border-radius:0.15em;cursor:pointer;} .labelb15::after {content: none !important;} .labelb15::before {content: none !important;}';
        document.head.appendChild(style);

        settingPanel = document.createElement("div");
        settingPanel.setAttribute('style','position:relative;margin-right:1vw;padding-left:10px;padding-right:10px;padding-top:0.3em;padding-bottom:5px;background:#27262C;box-shadow:inset 0px 0px 1px #000;width:10vw;');

        toggleTrain = document.createElement("input");
        toggleTrain.setAttribute('type','checkbox');
        toggleTrain.setAttribute('name','toggletrain');
        toggleTrain.setAttribute('id','toggletrain');
        toggleTrain.setAttribute('class','toggleb15');
        toggleTrain.setAttribute('style','left:0;position:relative;opacity:1;');
        toggleTrain.checked=true;
        toggleTrainLabel = document.createElement("label");
        toggleTrainLabel.setAttribute('for','toggletrain');
        toggleTrainLabel.setAttribute('class','labelb15');
        toggleTrainLabel.setAttribute('title','Toggle Auto Train');
        toggleTrainLabel.innerHTML="TAT";

        maxBet = document.createElement("input");
        maxBet.setAttribute('style','width:2vw;');
        maxBet.setAttribute('type','number');
        maxBet.setAttribute('name','maxbet');
        maxBet.setAttribute('class','maxbetinput');
        maxBet.value=defaultmaxbet;

        toggleRewards = document.createElement("input");
        toggleRewards.setAttribute('type','checkbox');
        toggleRewards.setAttribute('name','togglerewards');
        toggleRewards.setAttribute('id','togglerewards');
        toggleRewards.setAttribute('class','toggleb15');
        toggleRewards.setAttribute('style','left:0;position:relative;opacity:1;');
        toggleRewards.checked=true;
        toggleRewardsLabel = document.createElement("label");
        toggleRewardsLabel.setAttribute('for','togglerewards');
        toggleRewardsLabel.setAttribute('class','labelb15');
        toggleRewardsLabel.setAttribute('title','Toggle Auto Rewards');
        toggleRewardsLabel.innerHTML="TAR";

        settingPanel.appendChild(maxBet);
        settingPanel.appendChild(toggleTrain);
        settingPanel.appendChild(toggleTrainLabel);
        settingPanel.appendChild(toggleRewards);
        settingPanel.appendChild(toggleRewardsLabel);

        rightNav=document.getElementsByClassName("main-navbar-balance-dropdown")[0]
        rightNav.insertBefore(settingPanel, rightNav.firstChild);
    }

    function autoRewards() {
        if(toggleRewards.checked) {
           var rewardTime=document.getElementsByClassName("cooldown")[1];
           var linksplit=window.location.href.split("/");
            if(linksplit[linksplit.length-1]!="rewards") {
                if(document.getElementsByClassName('navbar-item has-text')[9].innerHTML.includes('notification')) {window.location.href = "/rewards";}
            }
            if(rewardTime!=null) {
                if(linksplit[linksplit.length-1]=="rewards") {
               var rewardTimeSplit = rewardTime.innerText.split(":");
               var rewardTimeHourToSec = rewardTimeSplit[0]*3600;
               //console.log("Hour: "+rewardTimeHourToSec);
               var rewardTimeMinuteToSec = rewardTimeSplit[1]*60;
               //console.log("Minute: "+rewardTimeMinuteToSec);
               var rewardTimeSec = rewardTimeSplit[2]*1;
               var rewardTimeInSec = rewardTimeHourToSec+rewardTimeMinuteToSec+rewardTimeSec;
               if(rewardTimeInSec<=2) {
                   location.reload();
               }
           }
                window.location.href = "/wheel";
           }
            else
            {
               var clickable=document.getElementsByClassName('rewards-wheel-middle-claim')[0].getElementsByTagName('button')[0];
               if(!clickable.disabled) { clickable.click(); }
            }
        }
    }

    function autoTrain() {
        var linksplit=window.location.href.split("/");
        if(linksplit[linksplit.length-1]=="wheel") {
            if(toggleTrain.checked) {
                trainValue=document.getElementsByClassName('train-value')[0].innerText.replace(',','')
            if(trainCycle%20==0) {
                if(trainValueOld!=document.getElementsByClassName('train-value')[0].innerText.replace(',','')) {
                    trainValueOld=document.getElementsByClassName('train-value')[0].innerText.replace(',','')
                }
                else
                {
                    location.reload();
                }
            }
                ta=document.getElementsByClassName('train-actions')[0];
                trainbtn=ta.getElementsByClassName('base-button')[1];
                trainstr=ta.getElementsByClassName('base-button')[1].innerText;
                if(trainstr!='Joined') {/*console.log('Join Train');*/ if(trainValue!=0) {trainbtn.click();}}
                trainCycle++;
            }
        }
    }

    function maxBetSize() {
        var linksplit=window.location.href.split("/");
        if(linksplit[linksplit.length-1]=="roulette") {
            if(parseInt(document.getElementsByClassName('roulette-bet-group')[0].childNodes[0].children[0].children[1].value)>maxBet.value) {
                document.getElementsByClassName('roulette-bet-group')[0].childNodes[0].children[0].children[1].value=maxBet.value;
                console.log("Exceeded your limit"+maxBet.value)
            }
        }
    }

    window.onload = function() {
        addGui();
        setInterval(function() {autoTrain();},1000);
        setInterval(function() {autoRewards();},1000);
        setInterval(function() {maxBetSize();},10);
    };
})();
