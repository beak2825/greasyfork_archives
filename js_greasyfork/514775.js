// ==UserScript==
// @name         Chain watcher mod
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Watch the chain
// @author       Jox [1714547], Creed [1758059], Heart
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/514775/Chain%20watcher%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/514775/Chain%20watcher%20mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

        GM_addStyle(`.jox-member-your {text-decoration: line-through !important; cursor: not-allowed !important;}
                .jox-faction-your {margin-left: 0px !important}
                .jox-faction-your:after {content: " â›”"; text-decoration: none;}
                .jox-member-enemy {color:red !important; animation: ring2 4s .7s ease-in-out infinite; display:inline-block;}
                .jox-attack-enemy {animation: ring 4s .7s ease-in-out infinite; display:inline-block;}

                .chain-box-timeleft {
font-size: 100px !important;
}
.chain-box-stats-list {
display: none !important;
}
.chain-box-stats-block {
    justify-content: center !important;
}
.inactive{display: none !important;}
.first-in-row {
    height: 100% !important;
    width: 100% !important;}

                @keyframes ring {
                    0% { transform: rotate(0); }
                    1% { transform: rotate(15deg); }
                    3% { transform: rotate(-14deg); }
                    5% { transform: rotate(17deg);  color:red;}
                    7% { transform: rotate(-16deg); }
                    9% { transform: rotate(15deg); }
                    11% { transform: rotate(-14deg); }
                    13% { transform: rotate(13deg); }
                    15% { transform: rotate(-12deg);}
                    17% { transform: rotate(11deg); }
                    19% { transform: rotate(-10deg); }
                    21% { transform: rotate(9deg); }
                    23% { transform: rotate(-8deg); }
                    25% { transform: rotate(7deg); }
                    27% { transform: rotate(-6deg); }
                    29% { transform: rotate(5deg); }
                    31% { transform: rotate(-4deg); }
                    33% { transform: rotate(3deg); }
                    35% { transform: rotate(-2deg); }
                    37% { transform: rotate(1deg); color:#0092d8;}

                    39% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }

                @keyframes ring2 {
                    0% { transform: translateX(0); }
                    % { transform: translateX(7.5px); }
                    3% { transform: translateX(-7px); }
                    5% { transform: translateX(6.5px);  color:red;}
                    7% { transform: translateX(-6px); }
                    9% { transform: translateX(5.5px); }
                    11% { transform: translateX(-5px); }
                    13% { transform: translateX(4.5px); }
                    15% { transform: translateX(-4px);}
                    17% { transform: translateX(3.5px); }
                    19% { transform: translateX(-3px); }
                    21% { transform: translateX(2.5px); }
                    23% { transform: translateX(-2px); }
                    25% { transform: translateX(1.5px); }
                    27% { transform: translateX(-1px); }
                    29% { transform: translateX(0.5px);  color:#0092d8;}

                    39% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }
    `);

    var ctx = null;
    var controls = {};
    var started = false;

    start();

    function start(){
        loadData();
        watchForChainTimer();
        setInterval(markWallMembers, 500);
    }

    function markWallMembers(){
        if(controls.markWallTargets){
            addCustomCss();
        }
        else{
            removeCustomCss();
        }
    }

    function addCustomCss(){
        var memersYour = document.querySelectorAll('.descriptions .faction-war .members-cont .members-list .row-animation.your .member .user.name');
        var factionsYour = document.querySelectorAll('.descriptions .faction-war .members-cont .members-list .row-animation.your .member .user.faction');
        var memersEnemy = document.querySelectorAll('.descriptions .faction-war .members-cont .members-list .row-animation.enemy .member .user.name');
        var attacksEnemy = document.querySelectorAll('.descriptions .faction-war .members-cont .members-list .row-animation.enemy .attack a');

        memersYour.forEach(function(element) {
           element.classList.add('jox-member-your');
        });
/*
        factionsYour.forEach(function(element) {
           element.classList.add('jox-faction-your');
        });
*/
        memersEnemy.forEach(function(element) {
           element.classList.add('jox-member-enemy');
        });

        attacksEnemy.forEach(function(element) {
           element.classList.add('jox-attack-enemy');
        });
    }

    function removeCustomCss(){
        var memersYour = document.querySelectorAll('.descriptions .faction-war .members-cont .members-list .row-animation.your .member .user.name');
        var factionsYour = document.querySelectorAll('.descriptions .faction-war .members-cont .members-list .row-animation.your .member .user.faction');
        var memersEnemy = document.querySelectorAll('.descriptions .faction-war .members-cont .members-list .row-animation.enemy .member .user.name');
        var attacksEnemy = document.querySelectorAll('.descriptions .faction-war .members-cont .members-list .row-animation.enemy .attack a');

        memersYour.forEach(function(element) {
           element.classList.remove('jox-member-your');
        });

        factionsYour.forEach(function(element) {
           element.classList.remove('jox-faction-your');
        });

        memersEnemy.forEach(function(element) {
           element.classList.remove('jox-member-enemy');
        });

        attacksEnemy.forEach(function(element) {
           element.classList.remove('jox-attack-enemy');
        });
    }

    function addCustomCss2(){
     GM_addStyle(`.descriptions .faction-war .members-cont .members-list .row-animation.your .member .user.name {text-decoration: line-through;}
                .descriptions .faction-war .members-cont .members-list .row-animation.your .member .user.faction:after {content: " â›” "; text-decoration: none;}
                .descriptions .faction-war .members-cont .members-list .row-animation.enemy .member .user.name {color:red;}
                .descriptions .faction-war .members-cont .members-list .row-animation.enemy .attack a {animation: ring 4s .7s ease-in-out infinite; display:inline-block;}
                @keyframes ring {
                    0% { transform: rotate(0); }
                    1% { transform: rotate(15deg); }
                    3% { transform: rotate(-14deg); }
                    5% { transform: rotate(17deg);  color:red;}
                    7% { transform: rotate(-16deg); }
                    9% { transform: rotate(15deg); }
                    11% { transform: rotate(-14deg); }
                    13% { transform: rotate(13deg); }
                    15% { transform: rotate(-12deg);}
                    17% { transform: rotate(11deg); }
                    19% { transform: rotate(-10deg); }
                    21% { transform: rotate(9deg); }
                    23% { transform: rotate(-8deg); }
                    25% { transform: rotate(7deg); }
                    27% { transform: rotate(-6deg); }
                    29% { transform: rotate(5deg); }
                    31% { transform: rotate(-4deg); }
                    33% { transform: rotate(3deg); }
                    35% { transform: rotate(-2deg); }
                    37% { transform: rotate(1deg); color:#0092d8;}

                    39% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }
    `);
    }

    function watchForChainTimer() {
        let target = document.getElementById('factions');
        let observer = new MutationObserver(function(mutations) {
            let doApply = false;
            mutations.forEach(function(mutation) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    //console.log(mutation.addedNodes.item(i));
                    if (document.querySelector('.chain-box-timeleft')) {
                        doApply = true;
                        //console.log('Have List of players');
                        break;
                    }
                    else{
                        //console.log('Not a List of players');
                    }
                }

                if (doApply) {
                    applyTracker();
                    observer.disconnect();
                }
            });

        });
        // configuration of the observer:
        //let config = { childList: true, subtree: true };
        let config = { childList: true, subtree: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }

    function applyTracker(){
        //var timer = document.querySelector('.chain-box-timeleft');
        if(!started){
            started = true;
            showForm();
            alertMe();
        }
    }

    function alertMe(){

        var chainInfo = document.querySelector('.chain-box-title');
        var timer = document.querySelector('.chain-box-timeleft');
        var data = timer.innerHTML.split(':');
        var blinkTarget = document.querySelector('.content');

        if((chainInfo.innerHTML == 'Chain active' && controls.watchChain) || controls.test){

            timer.style.backgroundColor = "transparent";
            timer.style.color = 'red';

            var currentTime = Number(data[0]) * 60 + Number(data[1]);
            var alertTIme = controls.minuteAlert * 60 + controls.secundeAlert;

            if((currentTime < alertTIme && currentTime > 0) || controls.test){
                blinkTarget.classList.toggle('chainWatcherPing');

                if(blinkTarget.classList.contains('chainWatcherPing')){
                    blinkTarget.style.backgroundColor = controls.colorAlert;
                    if(controls.beepAlert){
                        beep(controls.beepLength, controls.beepType, controls.beepVolume, function(){});
                    }
                }
                else{
                    blinkTarget.style.backgroundColor = null;
                }
            }
            else{
                blinkTarget.classList.remove('chainWatcherPing');
                blinkTarget.style.backgroundColor = null;
            }
        }
        else{
            timer.style.backgroundColor = null;
            timer.style.color = null;
            blinkTarget.classList.remove('chainWatcherPing');
            blinkTarget.style.backgroundColor = null;
        }

        setTimeout(alertMe, controls.interval);
    }

    var beep = (function () {
        if(ctx && ctx.state && ctx.state !== "running"){
            ctx.resume();
        }
        else{
            ctx = new AudioContext();
        }
        return function (duration, type, volume, finishedCallback) {

            duration = +duration;

            // Only 0-3 are valid types.
            type = (type % 4) || 0;

            var types = ['sine', 'square', 'sawtooth', 'triangle'];

            if (typeof finishedCallback != "function") {
                finishedCallback = function () {};
            }

            var osc = ctx.createOscillator();
            var gainNode = ctx.createGain();

            osc.type = types[type];
            gainNode.gain.value = volume || gainNode.gain.defaultValue;
            //osc.type = "sine";

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start();

            setTimeout(function () {
                osc.stop();
                finishedCallback();
            }, duration);

        };
    })();

    /*****************************************************************************/

    function showForm(){
        //Create container div for widget
        var container = document.createElement('div');
        container.id = 'JoxDiv';

        //Create header
        var header = document.createElement('div');
        header.classList.add('title-black', 'm-top10', 'title-toggle', 'active', 'top-round', 'chain-watcher-header');
        header.innerHTML = 'Chain Watcher'
        header.style.color = 'lime';
        header.onclick = function(e){
            var body = document.querySelector('.chain-watcher-body');
            controls.watcherMinimized = !controls.watcherMinimized;
            if(controls.watcherMinimized){
                body.style.display = 'none';
            }
            else{
                body.style.display = 'flex';
            }
            saveData();
        }

        //Create body
        var body = document.createElement('div');
        body.classList.add('cont-gray10', 'bottom-round', 'cont-toggle', 'unreset', 'chain-watcher-body');
        if(controls.watcherMinimized){
            body.style.display = 'none';
        }
        else{
            body.style.display = 'flex';
        }
        body.style.flexWrap = 'wrap';

        //Add header and body elements
        container.appendChild(header);
        container.appendChild(body);

        //Add items
        var cbWatchChain = document.createElement('input');
        var lblWatchChain = document.createElement('label');
        lblWatchChain.innerHTML = 'Watch Chain';
        lblWatchChain.setAttribute('for','cbWatchChain');
        cbWatchChain.type = 'checkbox';
        cbWatchChain.id = 'cbWatchChain';
        cbWatchChain.name = 'cbWatchChain';
        cbWatchChain.style.margin = '0 5px';
        cbWatchChain.checked = controls.watchChain;
        cbWatchChain.onclick = function(e){
            if(e.target.checked){
                controls.watchChain = true;
            }
            else{
                controls.watchChain = false;
            }

            saveData();
        }
        var p1 = document.createElement('p');
        p1.style.margin = '10px';
        body.appendChild(p1);
        p1.appendChild(cbWatchChain);
        p1.appendChild(lblWatchChain);

        ////////////////////////////////

        var txtAlertTime = document.createElement('input');
        var lblAlertTime = document.createElement('label');
        lblAlertTime.innerHTML = 'Alert time:';
        lblAlertTime.setAttribute('for','txtAlertTime');
        //lblAlertTime.style.margin = '0px 0px 0px 25px';
        txtAlertTime.type = 'text';
        txtAlertTime.id = 'txtAlertTime';
        txtAlertTime.name = 'txtAlertTime';
        txtAlertTime.style.margin = '0 5px';
        txtAlertTime.value = controls.minuteAlert + ':' + controls.secundeAlert;
        txtAlertTime.onchange = function(e){
            var data = txtAlertTime.value.match(/^$|^([0-4]):([0-5][0-9])$/);
            if(data && data.length && data.length == 3){
                controls.minuteAlert = Number(data[1]);
                controls.secundeAlert = Number(data[2]);
                saveData();
            }
            else{
                alert('Set time is in wrong format, it must me in format m:ss in valuse between 0:00 and 4:59');
                txtAlertTime.value = controls.minuteAlert + ':' + controls.secundeAlert;
            }
        }
        var p2 = document.createElement('p');
        p2.style.margin = '10px';
        body.appendChild(p2);
        p2.appendChild(lblAlertTime);
        p2.appendChild(document.createElement('br'));
        p2.appendChild(txtAlertTime);

        ////////////////////////////////

        var cbBeepAlert = document.createElement('input');
        var lblBeepAlert = document.createElement('label');
        lblBeepAlert.innerHTML = 'Beep Alert';
        lblBeepAlert.setAttribute('for','cbBeepAlert');
        cbBeepAlert.type = 'checkbox';
        cbBeepAlert.id = 'cbBeepAlert';
        cbBeepAlert.name = 'cbBeepAlert';
        //cbBeepAlert.style.margin = '0px 5px 0px 25px';
        cbBeepAlert.checked = controls.beepAlert;
        cbBeepAlert.onclick = function(e){
            if(e.target.checked){
                controls.beepAlert = true;
            }
            else{
                controls.beepAlert = false;
            }
            saveData();
        }
        var p3 = document.createElement('p');
        p3.style.margin = '10px';
        body.appendChild(p3);
        p3.appendChild(cbBeepAlert);
        p3.appendChild(lblBeepAlert);

        ////////////////////////////////

        var sldBeepVolume = document.createElement('input');
        var lblBeepVolume = document.createElement('label');
        lblBeepVolume.innerHTML = 'Beep Volume';
        lblBeepVolume.setAttribute('for','sldBeepVolume');
        //lblBeepVolume.style.margin = '0px 5px 0px 25px';
        sldBeepVolume.type = 'range';
        sldBeepVolume.min = 1;
        sldBeepVolume.max = 100;
        sldBeepVolume.value = controls.beepVolume * 100;
        sldBeepVolume.id = 'sldBeepVolume';
        sldBeepVolume.name = 'sldBeepVolume';
        sldBeepVolume.onchange = function(e){
            controls.beepVolume = Number(sldBeepVolume.value) / 100;
            saveData();
        }
        var p4 = document.createElement('p');
        p4.style.margin = '10px';
        body.appendChild(p4);
        p4.appendChild(lblBeepVolume);
        p4.appendChild(document.createElement('br'));
        p4.appendChild(sldBeepVolume);

        ////////////////////////////////

        var clrAlertColor = document.createElement('input');
        var lblAlertColor = document.createElement('label');
        lblAlertColor.innerHTML = 'Alert color';
        lblAlertColor.setAttribute('for','clrAlertColor');
        //lblAlertColor.style.margin = '0px 5px 0px 25px';
        clrAlertColor.type = 'color';
        clrAlertColor.value = controls.color;
        clrAlertColor.id = 'clrAlertColor';
        clrAlertColor.name = 'clrAlertColor';
        clrAlertColor.onchange = function(e){
            controls.color = clrAlertColor.value;
            saveData();
        }
        var p6 = document.createElement('p');
        p6.style.margin = '10px';
        body.appendChild(p6);
        p6.appendChild(lblAlertColor);
        p6.appendChild(document.createElement('br'));
        p6.appendChild(clrAlertColor);

        ////////////////////////////////

        var sldColorOpacity = document.createElement('input');
        var lblColorOpacity = document.createElement('label');
        lblColorOpacity.innerHTML = 'Color opacity';
        lblColorOpacity.setAttribute('for','sldColorOpacity');
        //lblColorOpacity.style.margin = '0px 5px 0px 25px';
        sldColorOpacity.type = 'range';
        sldColorOpacity.min = 1;
        sldColorOpacity.max = 100;
        sldColorOpacity.value = controls.opacity * 100;
        sldColorOpacity.id = 'sldColorOpacity';
        sldColorOpacity.name = 'sldColorOpacity';
        sldColorOpacity.onchange = function(e){
            controls.opacity = Number(sldColorOpacity.value) / 100;
            saveData();
        }
        var p7 = document.createElement('p');
        p7.style.margin = '10px';
        body.appendChild(p7);
        p7.appendChild(lblColorOpacity);
        p7.appendChild(document.createElement('br'));
        p7.appendChild(sldColorOpacity);

        ////////////////////////////////

        var sldInterval = document.createElement('input');
        var lblInterval = document.createElement('label');
        lblInterval.innerHTML = 'Check/Alert Intrval';
        lblInterval.setAttribute('for','sldInterval');
        //lblInterval.style.margin = '0px 5px 0px 25px';
        sldInterval.type = 'range';
        sldInterval.min = 500;
        sldInterval.max = 2000;
        sldInterval.step = 500;
        sldInterval.value = controls.interval;
        sldInterval.id = 'sldInterval';
        sldInterval.name = 'sldInterval';
        sldInterval.onchange = function(e){
            controls.interval = Number(sldInterval.value);
            saveData();
        }
        var p5 = document.createElement('p');
        p5.style.margin = '10px';
        body.appendChild(p5);
        p5.appendChild(lblInterval);
        p5.appendChild(document.createElement('br'));
        p5.appendChild(sldInterval);

        ////////////////////////////////

        var cbTest = document.createElement('input');
        var lblTest = document.createElement('label');
        lblTest.innerHTML = 'Test';
        lblTest.setAttribute('for','cbTest');
        cbTest.type = 'checkbox';
        cbTest.id = 'cbTest';
        cbTest.name = 'cbTest';
        cbTest.style.margin = '0 5px';
        cbTest.checked = controls.test;
        cbTest.onclick = function(e){
            if(e.target.checked){
                controls.test = true;
            }
            else{
                controls.test = false;
            }

            saveData();
        }
        var p8 = document.createElement('p');
        p8.style.margin = '10px';
        body.appendChild(p8);
        p8.appendChild(cbTest);
        p8.appendChild(lblTest);

        ////////////////////////////////

        var cbMartWallTargets = document.createElement('input');
        var lblMartWallTargets = document.createElement('label');
        lblMartWallTargets.innerHTML = 'Mark wall targets';
        lblMartWallTargets.setAttribute('for','cbMartWallTargets');
        cbMartWallTargets.type = 'checkbox';
        cbMartWallTargets.id = 'cbMartWallTargets';
        cbMartWallTargets.name = 'cbMartWallTargets';
        cbMartWallTargets.style.margin = '0 5px';
        cbMartWallTargets.checked = controls.markWallTargets;
        cbMartWallTargets.onclick = function(e){
            if(e.target.checked){
                controls.markWallTargets = true;
            }
            else{
                controls.markWallTargets = false;
            }

            saveData();
        }
        var p9 = document.createElement('p');
        p9.style.margin = '10px';
        body.appendChild(p9);
        p9.appendChild(cbMartWallTargets);
        p9.appendChild(lblMartWallTargets);

        ////////////////////////////////

        //Add message container
        var msgContainer = document.createElement('div');
        msgContainer.id = "JoxMsgContainer";
        msgContainer.classList.add('cont-gray10', 'bottom-round');
        msgContainer.style.backgroundColor = '#e6e6e6';
        msgContainer.style.borderTop = '1px solid #cdcdcd';
        msgContainer.style.marginTop = '-5px';
        msgContainer.style.display = 'none';
        container.appendChild(msgContainer);

        //Add div to page
        insertAfter(container, document.querySelector('#react-root ul.f-war-list'));
    }

    function saveData(){
        //fix colors
        var rgba = hexToRgb(controls.color)
        rgba.a = controls.opacity;
        controls.colorAlert = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
        //Save data
        localStorage.chainWarcher = JSON.stringify(controls);
    }

    function loadData(){
        var savedData = JSON.parse(localStorage.chainWarcher || '{}');

        controls.watcherMinimized = savedData.watcherMinimized || false;

        //Is chain watcher active
        controls.watchChain = (savedData.watchChain === false ? false : true); //to see is chain watcher active or not

        //Time tiriger (set minutes and seconds)
        controls.minuteAlert = savedData.minuteAlert || 2;
        controls.secundeAlert = savedData.secundeAlert || 30;

        //Beep notification
        controls.beepAlert = savedData.beepAlert || false; //true for beep alerts, false to not beep alert
        controls.beepLength = savedData.beepLength || 400; //duration of beep in milisenonds (set more then 50 and 100 less of alert interval value //Default value 400, less annoying value 50 combined with interval 1000
        controls.beepType = savedData.beepType || 0; //valid values 0,1,2,3 (0-sine, 1-square, 2-sawtooth, 3-triangle) //Default value 0
        controls.beepVolume = savedData.beepVolume || 0.5; //0.5 is 50% volume, use 0.01 for really (1%) low volume and 1 for 100% volume

        //What color to display
        controls.color = savedData.color || '#ff0000';
        controls.opacity = savedData.opacity || 0.2;
        var rgba = hexToRgb(controls.color)
        rgba.a = controls.opacity;
        controls.colorAlert = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`; //color pitcker - https://htmlcolors.com/rgba-color //Default color rgba(255, 0, 0, 0.2), less annoying colour rgba(255, 180, 180, 0.2)

        //Alert interval
        controls.interval = savedData.interval || 1000; //time in miliseconts (1 secont = 1000 miliseconds) //Default setup 500, less annoying setup 1000, value over 2000 is not recomanded and that value is not that annoying

        //for test - alway alert no matter of cahin
        controls.test = savedData.test || false;

        //for easy target pick
        controls.markWallTargets = (savedData.markWallTargets === false ? false : true);
    }

    //Helper function for more readability
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
})();