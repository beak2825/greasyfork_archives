// ==UserScript==
// @name         MAM Shop Widget
// @namespace    http://tampermonkey.net/
// @require      https://greasyfork.org/scripts/6414-grant-none-shim/code/%22@grant%20none%22%20Shim.js?version=108240
// @version      1.0.9
// @description  shop
// @author       xShirase (code), Mousse (creative input)
// @match        https://www.myanonamouse.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26182/MAM%20Shop%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/26182/MAM%20Shop%20Widget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('head').append('<style id="widgetStyle"></style>');
    function addCSS(tag,str){
        $(tag).text($(tag).text()+str);
    }
    const css = `
#widgetlog{
background-color:black;
color:white;
font-size:10px;
max-height: 100px;
overflow-x:hidden;
overflow-y:auto;
}
#widgetlog p{
font-size:10px;
}

#shopWidget button{
display:block;
margin: 0 auto;
}
#toggleLog, #clearLog{
cursor:pointer;
font-size:10px;
}
#toggleLog:hover{
text-decoration:underline;
}
span.widgetSpan {
    float: left;
    width: 50%;
}
#interval, #maintain {
    width: 50%;
}
#logControls{
    display:none;
}
#widgetlog .debug{
    font-size:8px
}

    `;
    addCSS('#widgetStyle',css);
    const tpl = '<div class="lbc" id="shopWidget"><div class="blockHead"><div class="blockHeadCon"><b>Shop</b></div><div class="bHis"></div></div><div class="blockBody"><div class="blockBodyCon cen"><div><div><span class="widgetSpan">Maintain</span><select id="maintain"><option value=0>0pts</option><option value=2000>2000pts</option><option value=5000>5000pts</option><option value=10000>10000pts</option><option value=49999>49999pts</option></select></div><div><span class="widgetSpan">Interval</span><select id="interval"><option value=1>1min</option><option value=30>30min</option><option value=60>1hr</option><option value=120>2hrs</option><option value=360>6hrs</option><option value=720>12hrs</option><option value=1440>24hrs</option></select></div><button>Start!</button><div id="logControls">Log: <span id="toggleLog">Toggle</span> | <span id="clearLog">Clear</span></div></div><div id="widgetlog"></div></div></div><div class="blockFoot"><span id="widStart">stopped</span></div></div>';
    let interval;

    console.log('load');
    $(tpl).insertAfter('#mainLeft > div:first');
    //check if values && if running
    function checkIfRunning(){
        if(GM_getValue('running')){
            console.log('already running in another tab');
        }else{
            //startInterval();
        }
    }

    function handleBtnClick(e){
        GM_setValue('interval',$('#interval').val());
        GM_setValue('maintain',$('#maintain').val());
        console.log(GM_getValue('interval'),GM_getValue('maintain'));
        startInterval(true);
        $(e.target).hide();
        $('#logControls').show();
    }

    function startInterval(bool){
        if(bool){
            clearInterval(interval);
        }
        $('#widStart').text('running');
        donatePoints();
        setInterval(donatePoints,GM_getValue('interval')*60000);
    }

    function donatePoints(){
        let points;
        let availableBonus;
        console.log(points, availableBonus);
        getBonus((err,bonus)=>{
            log('-- Exchange start --');
            log(new Date().toString().replace(/ GMT.*/,''));
            if(!err){
                log(`<b>${bonus} points</b>`);
                points = bonus-GM_getValue('maintain');
                if(points<500){
                    log('Too low to exchange');
                    log('-- Exchange ended.--');
                }else{
                    availableBonus = points/500;
                    spendPoints(availableBonus);
                }
            }else{
                log('Error');
            }
        });
    }

    function spendPoints(b,p){
        let b2;
        if(!b){
            const points = p-GM_getValue('maintain');
            b2 = points/500;
        }else{
            b2=b;
        }
        if(b2>100){
            bonusBuyCustom(100);
        }else if(b2>20){
            bonusBuyCustom(20);
        }else if(b2>5){
            bonusBuyCustom(5);
        }else if(b2>2.5){
            bonusBuyCustom(2.5);
        }else if(b2>1){
            bonusBuyCustom(1);
        }else if(b2>0.05){
            bonusBuyCustom(0.05);
        }else{
            log('-- Exchange ended.--');
        }
    }

    function bonusBuyCustom(a) {
        $.ajax({
            type: "GET",
            url: "/json/bonusBuy.php/",
            data: {
                spendtype: "upload",
                amount: a
            },
            success: function(b) {
                if (!b.success) {
                    log('<b>No points.</b>');
                } else {
                    updatePointsEtc(b);
                    log(`<b>+${b.amount}GB - ${Math.floor(b.seedbonus)} left</b>`);
                    // log(`<span class="debug">UL: ${b.uploadFancy} R:${b.ratio}</span>`);
                    spendPoints(null,b.seedbonus);
                }
            },
            timeout: 20000,
            error: function(d, b, c) {
                log('error: ',c);
            },
            dataType: "json",
            cache: false
        });
    }

    function getBonus(cb) {
        $.ajax({
            type: "GET",
            url: "/store.php",
            data: {
            },
            success: function(b) {
                cb(null,b.split('currentBonusPoints">')[1].split('<')[0]);
            },
            timeout: 20000,
            error: function(c) {
                cb(c);
            },
            dataType: "html",
            cache: false
        });
    }

    function log(l){
        console.log('widget: ',l);
        $('#widgetlog').append(`<p>${l}</p>`);
    }
    //onbeforeunload running false
    //setinterval checkIfRunning

    if(GM_getValue('interval')){
        $('#interval').val(GM_getValue('interval'));
    }else{
        GM_setValue('maintain',$('#maintain').val());
    }
    if(GM_getValue('maintain')){
        $('#maintain').val(GM_getValue('maintain'));
    }else{
        GM_setValue('maintain',$('#maintain').val());
    }
    checkIfRunning();
    $('body').on('click','#shopWidget button',handleBtnClick);
    $('body').on('click','#toggleLog',e=>$('#widgetlog').toggle());
    $('body').on('click','#clearLog',e=>$('#widgetlog').html(''));
})();
