// ==UserScript==
// @name         cursors.io 300 bots hack
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        http://cursors.io/
// @match        http://kursors.io/
// @match        http://cursors.io/?editor
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423246/cursorsio%20300%20bots%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/423246/cursorsio%20300%20bots%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

"use strict"

// Beta client for the Zursor Master project
// Please do not paste this script itself into tampermonkey or cursors.io, instead please use the tampermonkey extension that I have provided here: https://pastebin.com/krbGjJ9v
// Especially since this script is still in development, the tampermonkey extension provided is automatically updated
// update as of oct. 13, 2020: Script has been updated to avoid any CORB/CORS errors. Change the __ip variable to the new server ip when it updates. Get the server ip by going to the 'Network' tab in inspect element, go to the 'WS' tab, and refresh the page. DM me on discord at 8y8x#5342 if the script should be updated
window.zM = {};
window.zMDK = {};
async function wait(ms = 1000) {
    setTimeout(()=>{return new Promise(async resolve => resolve());},ms);
}
window.D = document;
let __ip = '128.199.12.58';
(async function(styles, init, cfg, dependencies, elements) {
    zM.dependenciesLoaded = 0b000000;
    zM.version = '0.2';

    zM.cfg = cfg.raw;
    zM.createConfig = cfg.createConfig;
    zM.saveConfig = cfg.saveConfig;
    zM.getConfig = cfg.getConfig;

    zM.returnAfterUndeployed = false;
    zM.antiIdle = true;

    // load developer kit for plugins
    // it isn't exactly done yet, I plan to only do it once I'm mostly done the whole script- and it's stable and everything
    /**
     * Tools for modifying the localStorage configuration
     *
     * .generate() - creates a default config, returns the result. Optionally, you can put the object pointer as a parameter.
     * .save() - saves the parameter provided. Returns true/false dependant if errors occur.
     * .get() - returns the saved config. Optionally, you can put the object pointer as a  parameter.
     */
    zMDK.config = {
        generate: cfg.createConfig,
        save: cfg.saveConfig,
        get: cfg.getConfig
    }

    // some useful shortcuts
    window.head = D.head,
    window.body = D.body;

    // disable all elements on page
    var temp = [];
    temp = body.getElementsByTagName('*');
    for (var i = 0; i < temp.length; ++i) temp[i].style.display = 'none';

    // delete all header elements
    head.innerHTML = '<title>Loading...</title>';

    // add a container
    temp = D.createElement('div');
    temp.style.cssText = 'background:linear-gradient(45deg, rgba(33,33,33,1) 0%, rgba(66,66,66,1) 100%);position:fixed;top:0px;left:0px;width:100vw;height:100vh;';
    temp.id = 'zM-container'
    body.appendChild(temp);

    zM.el = zMDK.elements = {};
    zM.el.container = temp;

    zM.fleet = [];
    zM.fSel = NaN; // NaN for news

    temp = styles();

    zM.el.style = {
        fleetTopbarContainer: temp[0]
    }

    zM.pos = {
        mouseX: 400,
        mouseY: 300,
        lastMouseX: 400,
        lastMouseY: 300
    }

    zM.useWallhack = true;

    zM.ease = function(n, o, upd) {
        var dist = n - o,
            prog = (Date.now() - upd) / 100,
            maxMin = Math.min(Math.max(0, prog), 1);

        return o + (maxMin ** 2 * (3 - 2 * maxMin)) * dist;
    }

    zM.isLoading = false;

    zM.game = {
        m28nCursorsIP: `${__ip}:2828`
    }

    zM.asyncWaitUntil = async function(toEval) {
        return new Promise(resolve => {
            var temp = setInterval(()=>{if (eval(toEval)) resolve(), clearInterval(temp);},1);
        });
    }

    zM.origin = (location.hostname === 'cursors.io' || location.href.startsWith('file:///')) ? 'cursors' : location.hostname === 'kursors.io' ? 'kursors' : 'localhost';

    zM.movement = 1;

    // I decided to load the loading bars before the loading API therefore it works for when the script is starting first
    var temp = [D.createElement('div'), D.createElement('div'), D.createElement('div'), D.createElement('div')];

    temp[0].className = 'zM-loading-outer';
    zM.el.container.appendChild(temp[0]);

    temp[1].className = 'zM-loading-title';
    temp[0].appendChild(temp[1]);
    temp[1].textContent = 'Loading...'

    temp[2].className = 'zM-loading-bar-outer';
    temp[0].appendChild(temp[2]);

    temp[3].className = 'zM-loading-bar-fill';
    temp[2].appendChild(temp[3]);

    zM.el.loadingOuter = temp.shift();
    zM.el.loadingTitle = temp.shift();
    zM.el.loadingBarFill = temp.pop();

    // loading bar API
    zM.setLoadingWidth = function(width = 50) {
        zM.el.loadingBarFill.style.width = 'calc(' + width + '%' + ' - 10px)';
    }

    zM.showLoading = function() {
        zM.el.loadingOuter.style.display = 'block';
        D.getElementsByTagName('title')[0].textContent = 'Loading...';
    }

    zM.hideLoading = function() {
        zM.el.loadingOuter.style.display = 'none';
        D.getElementsByTagName('title')[0].textContent = 'zM / No fleets yet';
    }

    zM.setLoadingTitle = function(title) {
        zM.el.loadingTitle.textContent = title;
    }

    zM.clickQueue = 0;

    zM.updateTabs = function() { // updates fleet tabs
        zM.el.fleetTopbarOuter.innerHTML = '';
        zM.el.fleetTopbarContainer.innerHTML = '';
        zM.el.fleetTopbarOuter.appendChild(zM.el.fleetTopbarContainer);
        zM.el.fleetTopbarOuter.appendChild(zM.el.fleetTopbarAdd);
        zM.el.fleetTopbarAdd.appendChild(zM.el.fleetTopbarAddImg);
        zM.el.fleetTopbarOuter.appendChild(zM.el.fleetTopbarHint);

        for (var i = 0; i < zM.fleet.length; ++i) {
            var f = zM.fleet[i];
            zM.fleet[i].el.container.style.display = 'none';
            zM.el.fleetTopbarContainer.innerHTML += `<div style="position: absolute;    top: 0px;    left: ${100/zM.fleet.length*i}%;    width: ${100/zM.fleet.length}%;    height: 35px;    border-right: 1px solid #fffc;    background-color: ${i === zM.fSel ? '#fff3' : '#fff0'};transition: 0.3s;"><div style="position: absolute;    top: 0px;    left: 0px;    width: 100%;    height: 35px;    background-color: #0000;    transition: 0.3s;" onmouseenter="this.style.backgroundColor = '#0003';" onmouseout="this.style.backgroundColor = '#0000'" onclick="zM.fSel = ${i}; zM.updateTabs()"><div style="color:#fffc;font-family:\'Nova Flat\',Montserrat,sans-serif;font-weight:300;padding:8px;pointer-events:none;white-space:nowrap;overflow-x:hidden;user-select:none;">${zM.fSel === i ? '(Selected)' : ''} #${i} / (${f.botsOpened}/${f.maxBots}) / ${f.name}</div></div></div>`;
        }

        zM.fleet[zM.fSel].updateTabs();
    }

    zM.createFleet = function(ip, port, ipv6, startbots, maxbots, name) {
        var nF;
        var temp2 = function() {
            clearInterval(temp[2]);
            clearInterval(temp[3]);
            clearInterval(temp[4]);
            zM.setLoadingWidth(0);
            zM.setLoadingTitle('Server isn\'t a valid cursors.io server.');
            nF.bots.forEach(X => X.socket.close());
            setTimeout(zM.hideLoading, 2000);
        };
        var temp = [
            setInterval(() => {
                if (!zM.isLoading) clearInterval(temp[0]), zM.isLoading = true, temp[1]();
            }, 50),

            function() {
                zM.el.fleetTopbarHint.style.display = 'none';
                zM.el.fleetPromptOuter.style.display = 'none';
                zM.setLoadingWidth(0);
                zM.setLoadingTitle('Creating fleet object...');
                zM.showLoading();



                nF = new zM.Fleet(ip, port, ipv6, startbots, maxbots, name);

                zM.fSel = zM.fleet.push(nF) - 1;

                nF.createGUI(zM.el.container)
                temp[2] = setInterval(() => {
                    zM.setLoadingTitle('Connecting bots ('+nF.botsOpened+'/'+startbots+')');
                    zM.setLoadingWidth(100/startbots*nF.botsPinged);
                    if (nF.verified === false) temp2();
                    else if (startbots <= nF.botsPinged) {
                        clearInterval(temp[2]);
                        setTimeout(async ()=>{
                            zM.isLoading = false;
                            zM.hideLoading(),
                            zM.updateTabs(),
                            zM.el.game.style.display = 'block';
                            await zM.asyncWaitUntil('!(Date.now() % 50)');
                            nF.startTickLoop();
                        }, 800);
                    }
                }, 50);
            }
        ]
    }

    // get IP
    if (window.m28n) {
        m28n.findServerPreference('cursors', (err, end  ) => {
            if (err) {
                console.error(err);
            } else {
                zM.game.m28nCursorsIP = (end.ipv4 || ('[' + end.ipv6 + ']')) + ':2828';
            }
        });
    }







    zM.clog = [

        //
        //
        // Beta v0.2
        //
        // VVVVVVVVV

        {
            type: 'title',
            msg: 'Beta v0.2'
        },
        {
            type: 'desc',
            msg: 'I added several new improvements, mostly to the GUI, a full list is below:<br><br>'
        },
        {
            type: 'desc',
            msg: '• Added a changelog and a little information thingy at the bottom right. I plan to make it contain more information soon'
        },
        {
            type: 'desc',
            msg: '• Cursor movements are now synchronized, they should no longer split up'
        },
        {
            type: 'desc',
            msg: '• Script now loads the Nova Flat font used'
        },
    ];






    //dependencies.forEach(i => zM.el.container.appendChild(temp = D.createElement('script'), temp.src = 'http://pastebin.com/raw/'+i, temp));
    dependencies.forEach(eval);

    zM.setLoadingWidth(0);
    zM.showLoading();
    zM.setLoadingTitle('Loading dependencies...');
    temp = setInterval(() => {
        if (zM.dependenciesLoaded == 0b111111) {
            zM.setLoadingWidth(100);
            clearInterval(temp);
            elements.forEach(i => i(zM.el.container));
            head.getElementsByTagName('title')[0].textContent = 'zM / No fleets yet' // run all element functions
            setTimeout(zM.hideLoading,800);
        } else {
            var done = 0;
            for (var i = 0; i < temp.length; ++i) {
                done += (zM.dependenciesLoaded & 2**i) ? 1 : 0;
            }
            zM.setLoadingWidth((100 / 16 * done) | 0);
        }
    }, 50);

    init();
})(
    function() { // add <style>
        var out = [];
        var temp = [ // fleet topbar
            '.zM-' + 'fleet-topbar-outer {',
            '   position: fixed;    top: 0px;    left: 0px;',
            '   width: 100vw;    height: 35px;',
            '   background-color: rgba(0,0,0,.2);',
            '}',
            '',
            '.zM-' + 'fleet-topbar-container {',
            '   position: fixed;    top: 0px;    left: 0px;',
            '   width: calc(100vw - 45px);    height: 35px;',
            '}',
            '',
            '.zM-' + 'fleet-topbar-tab {',
            '   display: inline-block;',
            '}',
            '',
            '.zM-' + 'fleet-topbar-add {',
            '   position: fixed;    top: 0px;    right: 0px;',
            '   width: 45px;    height: 35px;',
            '   background-color: rgba(0,0,0,.0);',
            '   transition: 0.3s;',
            '   cursor: pointer;    user-select: none;',
            '}',
            '',
            '.zM-' + 'fleet-topbar-add:hover {',
            '   background-color: rgba(0,0,0,.2)',
            '}',
            '',
            '.zM-' + 'fleet-topbar-hint {',
            '   color: rgba(255, 255, 255, .3);',
            '   text-align: right;    font-family: Montserrat, sans-serif;',
            '   font-weight: 200;    font-size: 14px;',
            '   padding-right: 55px;',
            '   padding-top: 8px;    user-select: none;',
            D.createElement('style')
        ];
        // adds style element to "out"
        out[out.push(temp.pop()) - 1].innerHTML = temp.join('\n');

        // --------------------------------------------------------

        var temp = [ // fleet prompt
            '.zM-' + 'fleet-prompt-outer {',
            '   position: fixed;    top: 85px;    left: 50px;',
            '   width: calc( 100vw - 100px );    height: calc( 100vh - 135px );',
            '   background-color: #0003;   display: none;    border-radius: 20px;    z-index: 5000;',
            '}',
            '',
            '.zM-' + 'fleet-prompt-container {',
            '   position: fixed;    top: 85px;    left: calc( 50vw - 300px );',
            '   width: 600px; height: calc( 100vh - 135px );',
            '}',
            '',
            '.zM-' + 'fleet-prompt-title {',
            '   text-align: center;    font-family: \'Nova Flat\', Montserrat, sans-serif;    font-weight: 300;',
            '   color: rgba(255, 255, 255, .8);    font-size: 24px;    padding-top: 10px;    user-select: none;',
            '}',
            '',
            '.zM-' + 'fleet-prompt-entry {',
            '   width: 580px;    height: 50px;    ',
            '   background-color: rgba(0, 0, 0, .1);',
            '   border-radius: 10px;',
            '   margin-left: 10px;    margin-top: 10px;',
            '}',
            '',
            '.zM-' + 'fleet-prompt-opt {',
            '   text-align: right;    color: rgba(255, 255, 255, .5);    font-family: \'Nova Flat\', Montserrat, sans-serif;',
            '   font-weight: 300;    font-size: 14px;',
            '   padding-right: 20px;    padding-top: 16px;    width: 280px;    display: inline-block;    user-select: none;',
            '}',
            '',
            '.zM-' + 'fleet-prompt-create {',
                'position: absolute;    bottom: 10px;    left: 95px;',
                'width: 200px;    height: 20px;',
                'background-color: #0c6;    font-family: \'Nova Flat\', Montserrat, sans-serif;',
                'font-size: 16px;    font-weight: 300;    color: #0008;    text-align: center;',
                'border-top-left-radius: 10px;    border-bottom-left-radius: 10px;    user-select: none;    cursor: pointer;',
            '}',
            '',
            '.zM-' + 'fleet-prompt-cancel {',
                'position: absolute;    bottom: 10px;    left: 305px;',
                'width: 200px;    height: 20px;',
                'background-color: #666;    font-family: \'Nova Flat\', Montserrat, sans-serif;',
                'font-size: 16px;    font-weight: 300;    color: #0008;    text-align: center;',
                'border-top-right-radius: 10px;    border-bottom-right-radius: 10px;    user-select: none;    cursor: pointer;',
            '}',
            D.createElement('style')
        ];
        // adds style element to "out"
        out[out.push(temp.pop()) - 1].innerHTML = temp.join('\n');

        // --------------------------------------------------------

        var temp = [ // loading bar stuff
            '.zM-' + 'loading-outer {',
                'position: fixed;    top: 0px;    left: 0px;',
                'width: 100vw;    height: 100vh;    background: linear-gradient(45deg, rgba(33,33,33,1) 0%, rgba(66,66,66,1) 100%);',
                'z-index: 50000;    display: none;',
            '}',
            '',
            '.zM-' + 'loading-title {',
                'position: fixed;    top: calc(50vh - 32px);    left: 50vw;',
                'color: #fffb;    font-family: Montserrat, sans-serif;    font-weight: 300;    font-size: 24px;',
                'transform: translateX(-50%);    z-index: 50001;    user-select: none;',
            '}',
            '',
            '.zM-' + 'loading-bar-outer {',
                'position: fixed;    top: 50vh;    left: calc(50vw - 200px);',
                'width: 400px;    height: 30px;    background-color: #0003;    border-radius: 15px;',
            '}',
            '',
            '.zM-' + 'loading-bar-fill {',
                'width: 0%;    height: 20px;    background-color: #3c5;    border-radius: 10px;    margin: 5px;    transition: 0.5s;',
            '}',
            D.createElement('style')
        ];
        // adds style element to "out"
        out[out.push(temp.pop()) - 1].innerHTML = temp.join('\n');

        // --------------------------------------------------------

        var temp = [ // fleet page
            '.zM-' + 'fleet-gui-container {',
                'position: fixed;    top: 35px;    left: 0px;    width: 100vw;    height: calc(100vh - 35px);    z-index:1000;',
            '}',
            '',
            '.zM-' + 'fleet-gui-topbarOuter {',
                'position: fixed;    top: 35px;    left: 0px;    width: 100vw;    height: 35px;    background-color: #0002;    z-index:1001;',
            '}',
            '',
            '.zM-' + 'fleet-gui-topbar {',
                'position: fixed;    top: 35px;    left: 0px;    width: calc(100vw - 45px);    height: 35px;    z-index:1002;',
            '}',
            '',
            '.zM-' + 'fleet-gui-tabNew {',
                'position: fixed;    top: 35px;    right: 0px;    width: 45px;    height: 35px;    background-color: #0000;    transition: 0.3s;    z-index:1003;    cursor: pointer;',
            '}',
            '',
            '.zM-' + 'fleet-gui-tabNew:hover {',
            '   background-color: rgba(0,0,0,.2)',
            '}',
            '',
            '.zM-' + 'fleet-gui-tabNewImg {',
                'position: fixed;    top: 35px;    right: 0px;    width: 45px;    height: 35px;    pointer-events: none;    z-index:1004;    user-select:none;',
            '}',
            D.createElement('style')
        ];
        // adds style element to "out"
        out[out.push(temp.pop()) - 1].innerHTML = temp.join('\n');

        // --------------------------------------------------------

        var temp = [ // news page
            '.zM-' + 'news-outer {',
                'position: fixed;    top: 35px;    left: 0px;    width: 100vw;    height: calc(100vh - 35px);    z-index: 9000;',
            '}',
            '',
            '.zM-' + 'news-container {',
                'position: absolute;    top: calc(50vh - 190px);    left: calc(50vw - 500px);    width: 1000px;    height: 380px;    z-index 9001;',
            '}',
            '',
            '.zM-' + 'news-page-top {',
                'z-index: 9002;',
                'width: 1000px; margin-left: 0px; margin-bottom: 10px;    height: 120px;    background-color: #0003;    border-top-left-radius: 75px;    border-top-right-radius: 75px;',
            '}',
            '',
            '.zM-' + 'news-page-mid {',
                'z-index: 9002;',
                'width: 1000px; margin-left: 0px; margin-bottom: 10px;    height: 120px;    background-color: #0003',
            '}',
            '',
            '.zM-' + 'news-page-bottom {',
                'z-index: 9002;',
                'width: 1000px; margin-left: 0px; margin-bottom: 10px;    height: 120px;    background-color: #0003;    border-bottom-left-radius: 75px;    border-bottom-right-radius: 75px;',
            '}',
            '',
            D.createElement('style')
        ];
        // adds style element to "out"
        out[out.push(temp.pop()) - 1].innerHTML = temp.join('\n');

        // --------------------------------------------------------

        var temp = [ // game
            '.zM-' + 'game {',
                'position: fixed;    top: 80px;    left: 10px;    width: 800px;    height: 600px;    background-color: #fff;    z-index: 9000;    display: none;    cursor: none;',
            '}',
            D.createElement('style')
        ];
        // adds style element to "out"
        out[out.push(temp.pop()) - 1].innerHTML = temp.join('\n');

        // --------------------------------------------------------

        var temp = [ // bottom-right info area
            '.zM-' + 'info-outer {',
                'position: fixed; bottom: 10px; right: 10px; width: 200px; height: 40px; background-color: #0003; border-radius: 20px; z-index: 20000;',
            '}',
            '',
            '.zM-' + 'info-ver {',
                'position: absolute; top: 10px; left: 10px; font-family: Montserrat, sans-serif; color: #fff8; user-select: none; z-index: 20001;',
            '}',
            '',
            '.zM-' + 'info-clog-button-outer {',
                'position: absolute; top: 5px; right: 5px; width: 120px; height: 30px; background-color: #0003; user-select: none; z-index: 20002; border-radius: 15px; cursor: pointer;',
            '}',
            '',
            '.zM-' + 'info-clog-button {',
                'position: absolute; top: 8px; left: 12px; font-size: 12px; color: #fff8; user-select: none; z-index: 20003; pointer-events: none; font-family: Montserrat;',
            '}',
            D.createElement('style')
        ];
        // adds style element to "out"
        out[out.push(temp.pop()) - 1].innerHTML = temp.join('\n');

        // --------------------------------------------------------

        var temp = [ // changelog area
            '.zM-' + 'clog-outer {',
                'position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; background:linear-gradient(45deg, rgba(33,33,33,1) 0%, rgba(66,66,66,1) 100%); z-index: 15000; display: none;',
            '}',
            '',
            '.zM-' + 'clog-container {',
                'position: fixed; top: 50px; left: calc(50vw - 400px); width: 800px; height: calc(100vh - 100px); background-color: #0003; border-radius: 50px; z-index: 15001;',
            '}',
            '',
            '.zM-' + 'clog-title {',
                'color: #fffc; font-family: Montserrat; font-weight: 300; font-size: 36px; z-index: 15002; margin-bottom: 20px; margin-left: 30px; margin-top: 30px; user-select: none;',
            '}',
            '',
            '.zM-' + 'clog-desc {',
                'color: #fff8; font-family: Montserrat; font-weight: 400; font-size: 14px; z-index: 15002; margin-bottom: 10px; margin-left: 30px; user-select: none;',
            '}',
            '',
            '.zM-' + 'clog-close {',
                'position: fixed; top: 0px; right: 0px; width: 45px; height: 35px; cursor: pointer; user-select: none;',
            '}',
            '',
            D.createElement('style')
        ];
        // adds style element to "out"
        out[out.push(temp.pop()) - 1].innerHTML = temp.join('\n');

        for (var i = 0; i < out.length; ++i) head.appendChild(out[i]);
        return out;
    },
    function() { // initialize, start different tasks
        zM.promptFleet = function() {
            if (isNaN(zM.fSel)) {
                zM.el.newsOuter.style.display = 'none';
            } else {
                var temp = parseInt(zM.fSel);
                var f = zM.fleet[temp];
                if (f) {
                    f.el.container.style.display = 'none';
                }
            }
            zM.el.game.style.display = 'none';
            zM.el.fleetPromptOuter.style.display = 'block';
        }

        zM.zWs = new WebSocket('ws://localhost:2882');

    },
    (function(cfg) { // loads configuration
        function createConfig(x) { // "x" is a pointer to the variable to change

            if (!x.keybinds) {
                x.keybinds = []
            }

            return x;
        }
        function saveConfig(x) {
            try {
                var out = JSON.stringify(x);
                localStorage.setItem('zM', btoa(out));

                return true;
            } catch(err) {
                switch (true) {
                    case err instanceof TypeError: {
                        console.error('[CFG Loader] Error with saving the configuration');
                    }


                    default: { // other unhandled errors
                        console.error('[CFG Loader] Error with loading the configuration: Unhandled error occured');
                    }
                }

                console.debug(err);

                return false;
            }
        }
        function getConfig(x) {
            try {
                var out = localStorage.getItem('zM'); // null
                if (!out) throw 'Undefined storage';
                out = atob(out); // DOMException errors
                out = JSON.parse(out); // SyntaxErrors
                if (x) x = out;
                return out;
            } catch(err) {
                switch (true) {
                    case err instanceof DOMException: { // atob error, invalid configuration
                        console.error('[CFG Loader] Error with loading the configuration: Configuration was incorrectly saved');
                    } break;


                    case err instanceof SyntaxError: { // JSON errors return syntax errors for some reason
                        console.error('[CFG Loader] Error with loading the configuration: Configuration is not an object');
                    } break;
                    default: { // other unhandled errors
                        console.error('[CFG Loader] Error with loading the configuration: Unhandled error occured');
                    }
                }

                console.debug(err);

                if (x) x = {};
                return null;
            }
        }
        if (cfg === null) { // if the localstorage has been erased or script has never been used before
            cfg = {};
            createConfig(cfg);
        } else {
            try {
                cfg = getConfig(cfg);
                if (!cfg) saveConfig((createConfig(cfg), cfg));
            } catch(err) {
                switch (true) {
                    case err instanceof DOMException: { // atob error, invalid configuration
                        console.error('[CFG Loader] Error with loading the configuration: Configuration was incorrectly saved');
                    } break;


                    case err instanceof SyntaxError: { // JSON errors return syntax errors for some reason
                        console.error('[CFG Loader] Error with loading the configuration: Configuration is not an object');
                    } break;
                    default: { // other unhandled errors
                        console.error('[CFG Loader] Error with loading the configuration: Unhandled error occured');
                    }
                }

                console.debug(err);

                // technically these functions don't need to be placed in each other, they use pointers anyway
                cfg = {};
                saveConfig(createConfig(cfg));
            }
        }

        return {
            raw: cfg,
            getConfig: getConfig,
            saveConfig: saveConfig,
            createConfig: createConfig
        }
    })(localStorage.getItem('zM')),

    // ---
    // list of dependencies (pastebin) below
    // edit as of oct. 13, 2020: pastebin now uses CORS and doesn't allow requests, so the scripts are now embedded here instead
    // ---
    [
        /* zM external images */
        `zM.dependenciesLoaded |= 0b000001;

        window.zMIMG = {
            add: {img:null,uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAjCAYAAAAAEIPqAAAAc0lEQVRYR+2VSQoAIAwDzf8fXRE8FqF1ozCetYQxSdUKHhXU3BD96tcgDekFAeyBPX7aw8xM0lEbHh3mwUH0pAJp7EF7OARGQ2QXS6YOCSJBJIjBxLHGWeNBy+xev97TuwK994i+QRXSr6hCGtJBAiUrrwPx1zwkY3UoxAAAAABJRU5ErkJggg=="},
            close: {img:null,uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAjCAYAAAAAEIPqAAAAu0lEQVRYR+2VUQrAIAxD7f0P7fBDGLLZtKSCkP0a18czbtYufOxC5iboU6cm0zK9MaB6qB6qx6kOVJvuvXczgy91NL/yw4M8wSgImtvNo0GPIR6Qt+6JmetU6B04C3jMoEN/gTOBy6Df4GzgUmik42iHy74e64un4WtMr6BscPpF/ANkglOhPTBvHe04DRoFQnPlf8QoSDR/7OuBHnUmR6tHZnh2j6Cz5qL7ZDpqLJuX6ay56D6ZjhrL5h8i/mQkg2UCqwAAAABJRU5ErkJggg=="},
            cursor: {img:null,uri:"data:image/png;base64,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"},
            public: {img:null,uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAeCAYAAADHJYVoAAABrElEQVRIS7WWvU7DQBCEZw3hR6KhAImSnpqSiseghzcCet4OBSEh8R8bjb3jrM4kurOTk1Z27OSb3XN21oYtLtsiG//B47VmingE6TwVlECxUATynPELYM8zJjCN7GIivALA+PZfHwGoPRZ+lFCWgOCE7gDYNbP35qEGbttbxwAIZjU/pQIRPgMwM7O3Fs7VCZx6NayoSEBwZk34PoBXPDZ4vgFOnnqBMwAfLpItEOF8iAcAXgRn2lMEUvghgHmETxHIgo8VyIaPESiClwoUw0sERsFzBbLg7d9x1Vo22qf3AbuZXdgM4FVVzev7RdtESYY93szQNJ1JhnNaxVfo4npt5qGBrt1j6DMKdiphDHYvg+e0CX5nmLmZzeUtdlcxwysvkzCWLIfkkdckom1ZDVeHOvjS/ZxQlSy47FiOKaGVe955S7cu3N8JYzYpXN5OEW2VwIMHunRF4JzeHrIWXNsSh0YUaaGKgZ/7iKP1coDwyyqbAn3JyT8znbPt58Ek8oyZNe+p5EmTiCDNUA4OBtdGZqgmfzwSvpHpH7do4+8t8fls5Y1rjTuNu/UHX28RMaWkZ08AAAAASUVORK5CYII='},
            movement: {img:null,uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAeCAYAAADHJYVoAAABr0lEQVRIS7WWzU7CUBCFz1TxJ3HjxsSle9cuXfkowL5Pwh6eEWNiIv5BzYE5dWjF3NuWJpNeSvnOzC1zpoYjHnZENv6Cx2tVH/EI0ropKIFsoQjkmvEN4MwzJrAZycVEeAGA8em/vgKw8Vj7WUJJAoITegLg1MzeNpMJbD4n4BoAwazmK1cgwkcARmb2SjgPF7jxalhRloDgzJrwcwAv1XQKzGZAWUrgFsDKRZIFIpwP8QLAcw1n+j0EmvBLAMs9eA+BNHhHgXR4B4E8eKZAPjxDoBs8USANXpYH2z002rv3AbuZtlG14EVRLNfj8a6J9jOsBcwMVbUzybCmVXyELt78n/lvAz25x9BnFOxUwhjsXgbXtAne087czJbylmKxYIaPXiZhLFkOyTOvSUTbchiuDnXwg/s5oSpZcNmxHFNCB/d86y2+uffu74QxmyZc3k4RbZXArQdauyKAO3p7yFpwbUscGlFkC1W0/NxHHK2XA4Q3q2wK1CU3/pvNObv93JpEnjGz5ncqudckIkgzlIODwWOQGarJH8+EDzL94xYN/t4Sn89R3riS3kVybvoBL+YcMQOUqAIAAAAASUVORK5CYII='},
            local: {img:null,uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAeCAYAAADHJYVoAAABrklEQVRIS7WWvU7DQBCEZw3hR6KhCBIlPTUlFY9BD28E9Hk7ZISExH9sNGbH2dgY3dmJpZUvif3N7jk7a8MWD9siG3/B43f1FPEI0rorKIFsoQjkmvENYM8zJrAbycVEeAGA8el3HwGoPJZ+llCSgOCE7gDYNbPX6r6G3TT3HwMgmNV85QpE+AzAzMxeCOfhAideDSvKEhCcWRO+D+C5fgBw/Qgs5hI4BfDmIskCEc6HeADgqYUz/QkCXfghgHINPkEgDT5SIB0+QiAPnimQD88QGAdPFEiDL+aD7R4a7d37gN1M26h78KIoyuVd9dtE6xm2AmaGuvYuXq1pFR+hi6v/M1810JV7DH1GwU4ljMHuZXBNm+A1/czNrJS3FLdNhpdeJmEsWQ7JM7+TiLZlGK4OdfCF+zmhKllw2bEcU0KDe954i2/uufs7YcymC5e3U0RbJXDvgbauCOCM3h6yFlzbEodGFGmgip6f+4ij9XKA8GKVTYG25M5/sztnm8+9SeQZM2v+ppInTSKCNEM5OBg8NjJDNfnjmfCNTP+4RRt/b4nPZytvXEnvIjkX/QBfbxExMnV8VAAAAABJRU5ErkJggg=='},
            follow: {img:null,uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAeCAYAAADHJYVoAAABwklEQVRIS7WWS07DQBBEawzhE7FBgkgs2bMBJJasWHAQYM9JWAcukkvAPfgEISGFf4zK6YpaY4xm4sRSy5PEedU9dlc7YIFHWCAbf8H9d2UbcQ/SOhaUQLaQB3LN+AawYhkTGEdyMR5eAGB82r83AIwtfuwsoSQBwQldArAcQhidPxzgevuWgE0ABLOar1wBD+8A6IQQXgnnYQI9q4YVZQkIzqwJXwXwcvF4iKutAS6fTiWwA+DNRJIFPJw3cQ3As+DMvo1ADF8HMPTwNgJJ8FkFkuGzCGTBcwWy4TkCM8FTBRrh/e4Ao+6ky/k4Nh2u0d6tD9jNtI2yBi+KYnh2v181UZThlB9CQFlOTNKtaRUfrovH/26La6AT8xj6jIKdShiD3cvgmjbBa+qZhxCG8pab3h0zPLYyCWPJckie+Z1EtC3NcHWogY/MzwlVyYLLjuWYEmrc88pbbHP3zN8JYzYxXN5OEW2VwLUbOnVFALv0dpe14NoWPzS8SAVV1PzcRhytlwOEF6tsCkxLjh7NeM5Wn2uTyDJm1vxNJbeaRARphnJwMHjMZYZq8vsz4XOZ/n6L5v7e4u/PQt64kt5Fci76BTTHKDGf8J1/AAAAAElFTkSuQmCC'},
            admin: {img:null,uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAeCAYAAADHJYVoAAAB80lEQVRIS7WWuW7CUBBF7zghi5QmBZFSUlpKaaVMlc+ghvwDNXXKADWf494fgYgiRSIrftF1ZuDhBdkslkbez515z++OBUfc5IhslMH9a24fcR9kx3lBE2gs5AN5zPgFcKYZE5iP2sX48AAA41vfvgKQaix1b0K1BAxO6AmAUxFZpCMH6WfvXwMgmNX8NBXw4S0ALRF5J5ybCtxoNayokYDBmTXh5wDe3BhAdwZM2yZwC+BDRWoL+HBO4gWA1xWc6e8hkIdfApi7uAeEw/WkJQNINOF5owrqwYndQWAL/BnAYvOTayhQCo/jGGEYln7LSZIgiqJaQ1QK78UOw3J2JjhIgEmUvbp1DnaC1xWoBWemVZtWwIX2qeuAq5m24QrwIAjm6csSs+4/rj0F0N80ShGBc7qK18e0ii9vFaelmWPsMrgHflSPoc9YcKUSxuDqZfCYNsFnipmLyNyNWBUgTwEzfNAyCWPJ5pDc85qJ2LBUw7lCmbmC79XPCbWSDW52bI5pQpVjnnmLTt6d+jthzCYPN2+niA2VgQsTunJFAB16u5e1wW1Y/Kbhi2RQi4Kfa4uj9bKB8GErmwKrknOfZr7PZueFTqQZM2ves5L36kQEWQ9l42BwO0gPtc7v7wk/SPf3h+jg/y3+/Bzlj6vanXa88we7KRoxQlE4ggAAAABJRU5ErkJggg=='}
        }

        for (var i in zMIMG) {
            if (zMIMG.hasOwnProperty(i)) {
                zMIMG[i].img = new Image();
                zMIMG[i].img.src = zMIMG[i].uri;
            }
        }`,
        /* zM fleet class */
        `zM.dependenciesLoaded |= 0b000010;

        zM.Fleet = class {
            constructor (ip, port, ipv6, maxbots, startbots, name) {
                console.log(startbots);
                this.ip = ip;
                this.port = port;
                this.maxBots = maxbots;
                this.startBots = startbots;
                this.name = name;
                this.ipv6 = ipv6;
                this.cSel = 0;

                this.wsIp = 'ws://' + (this.ipv6?'['+this.ip+']':this.ip) + ':' + this.port;

                this.bots = [];

                this.ids = [];

                this.botsPinged = 0;
                this.botsOpened = 0;
                this.botsIds = 0;
                this.botsLevels = 0;
                this.botsBusy = 0;
                this.botsDeployed = 0;
                this.botsUpdated = 0;
                this.verified = true;

                this.isHelping = false;

                this.el = {};

                this.helpers = [];

                var extF = this;

                this.helpIndex = 0;

                this.helpLoop = setInterval(()=>{
                    ++this.helpIndex;
                    if (this.isHelping && this.helpers.length > 0) {
                        for (var i = 0; i < this.helpers.length; ++i) {
                            this.helpers[i].toHelp = [];
                            this.helpers[i].helping = true;
                            if (this.helpers[i].socket.readyState != 1) this.helpers.splice(i--, 1);
                        }
                        var todo = [];
                        var obj = this.bots[this.cSel].obj;
                        for (var i = 0; i < obj.length; ++i) {
                            if (obj[i].type === 4) todo.push(obj[i]);
                        }
                        var amount = todo.length / this.helpers.length;
                        var j = 0;
                        var count = amount;
                        for (var i = 0; i < this.helpers.length; ++i) {
                            for (; j < count | 0; ++j) {
                                var obj = todo[j];
                                var moves = zM.path(this.helpers[i].realX, this.helpers[i].realY, obj.x + (obj.w>>1), obj.y + (obj.h>>1), this.helpers[i].obj, this.helpers[i].grid);
                                if ((this.helpers[i].realX === obj.x + (obj.w>>1) && this.helpers[i].realY === obj.y + (obj.h>>1)) ? true : moves.length > 1) this.helpers[i].toHelp.push(todo[j]);
                            }
                            count += amount;
                        }
                        var f = this;
                        if (this.isHelping) for (var j = 0; j < this.helpers.length; ++j) {
                            var index = this.helpIndex % this.helpers[j].toHelp.length;
                            if (isNaN(index)) index = this.helpIndex % this.helpers[0].toHelp.length; // has nothing to do, copy off other bots
                            if (isNaN(index)) index = 0; // still undefined, no buttons at all
                            console.log(j, this.helpers[j]);
                            console.log(index, this.helpers[j].toHelp[index]);
                            if (this.helpers[j].toHelp.length <= index) continue;
                            var moves = zM.path(this.helpers[j].realX, this.helpers[j].realY, this.helpers[j].toHelp[index].x + (this.helpers[j].toHelp[index].w>>1), this.helpers[j].toHelp[index].y + (this.helpers[j].toHelp[index].h>>1), this.helpers[j].obj, this.helpers[j].grid);
                            moves.forEach(Y => {
                                zM.packet.moveSocket([this.helpers[j].socket], Y[0], Y[1], [this.helpers[j]]);
                            });
                            for (var k = 0; k < 10; ++k) zM.packet.clickSocket([this.helpers[j].socket], this.helpers[j].toHelp[index].x + (this.helpers[j].toHelp[index].w>>1), this.helpers[j].toHelp[index].y + (this.helpers[j].toHelp[index].h>>1), [this.helpers[j]])
                        }
                    }
                },300);

                this.elTemplate = {
                    tab: '<div style="width: '
                }

                setTimeout(()=>{for (var i = 0; i < startbots; ++i) this.bots.push(new zM.Bot(this));},300);
            }

            createGUI(c) {
                var temp = this.el = {
                    container: D.createElement('div'),
                    topbarOuter: D.createElement('div'),
                    topbar: D.createElement('div'),
                    tabNew: D.createElement('div'),
                    tabNewImg: D.createElement('img')
                }

                temp.container.className = 'zM-fleet-gui-container';
                c.appendChild(temp.container);

                temp.topbarOuter.className = 'zM-fleet-gui-topbarOuter';
                temp.container.appendChild(temp.topbarOuter);

                temp.topbar.className = 'zM-fleet-gui-topbar';
                temp.topbarOuter.appendChild(temp.topbar);

                temp.tabNew.className = 'zM-fleet-gui-tabNew';
                temp.topbarOuter.appendChild(temp.tabNew);

                temp.tabNewImg.className = 'zM-fleet-gui-tabNewImg';
                temp.tabNewImg.src = zMIMG.add.uri;
                temp.tabNew.appendChild(temp.tabNewImg);

                temp.tabNew.addEventListener('click', ev => {
                    this.bots.push(new zM.Bot(this));
                });

                this.updateTabs();
            }

            updateTabs() {
                this.el.container.style.display = 'block';
                this.el.topbar.innerHTML = '';
                this.el.topbarOuter.appendChild(this.el.tabNew);
                this.el.tabNew.appendChild(this.el.tabNewImg);
                var nb = [];
                for (var i = 0; i < this.bots.length; ++i) {
                    if (this.bots[i].socket.readyState == 1) nb.push(this.bots[i]);
                }
                for (var i = 0; i < nb.length; ++i) {
                    var b = nb[i];
                    this.el.topbar.innerHTML += \`<div style="position: absolute;    top: 0px;    left: \${100/nb.length*i}%;    width: \${100/nb.length}%;    height: 35px;    border-right: 1px solid #fffc;    background-color: \${i === this.cSel ? '#fff3' : '#fff0'};transition: 0.3s;"><div style="position: absolute;    top: 0px;    left: 0px;    width: 100%;    height: 35px;    background-color: #0000;    transition: 0.3s;" onmouseenter="this.style.backgroundColor = '#0003';" onmouseout="this.style.backgroundColor = '#0000'" onclick="zM.fleet[zM.fSel].cSel = \${i}; zM.fleet[zM.fSel].updateTabs()"><div style="color:#fffc;font-family:\'Nova Flat\',Montserrat,sans-serif;font-weight:300;padding:8px;pointer-events:none;white-space:nowrap;overflow-x:hidden;user-select:none;">\${eval(\`zM.fleet[zM.fSel].cSel === \${i} ? '(Selected)' : ''\`)} #\${i} / ID \${b.id} / LVL \${b.level}</div></div></div>\`;
                }
            }

            /* depreciated, only solves for selected bot
            startTickLoop() {
                this.tickLoop = setInterval(()=>{
                    var b = this.bots[this.cSel];

                    var toMove = [];
                    for (var i = 0; i < this.bots.length; ++i) {
                        if (this.bots[i].level === b.level) if (zM.useWallhack) toMove.push(this.bots[i].socket);
                    }

                    if (zM.useWallhack) {
                        var moves = zM.path(b.realX, b.realY, zM.pos.mouseX>>1, zM.pos.mouseY>>1, b.obj);
                        moves.forEach(Y => {
                            zM.packet.moveSocket(toMove, Y[0], Y[1]);
                        });
                    } else {
                        zM.packet.moveSocket(toMove, zM.pos.mouseX>>1, zM.pos.mouseY>>1);
                    }

                    for (;-1<zM.clickQueue;--zM.clickQueue) zM.packet.clickSocket(toMove, zM.pos.mouseX>>1, zM.pos.mouseY>>1);

                    if (zM.drawing) zM.packet.drawSocket(toMove, zM.pos.lastMouseX>>1, zM.pos.lastMouseY>>1, zM.pos.mouseX>>1, zM.pos.mouseY>>1);

                    zM.pos.lastMouseX = zM.pos.mouseX;
                    zM.pos.lastMouseY = zM.pos.mouseY;
                }, 50);
            }*/

            // alternative, solves for each bot- causes lots of lag without grid
            startTickLoop() {
                this.tickLoop = setInterval(()=>{
                    for (var i = 0; i < zM.fleet.length; ++i) {
                        if (zM.fleet[i] === this) break;
                    }

                    if (i !== zM.fSel) return;
                    var b = this.bots[this.cSel];

                    var toMoveSocket = [];
                    var toMove = [];
                    for (var i = 0; i < this.bots.length; ++i) {
                        // disconnect after 90 min of AFK, should bypass any bans from AFKing
                        if (Date.now() - this.bots[i].packets.lastSent > 5400000) this.bots[i].socket.close();
                        if (
                            this.bots[i].level === b.level &&
                            !this.bots[i].helping && !this.bots[i].deployed
                        ) toMove.push(this.bots[i]), toMoveSocket.push(this.bots[i].socket);
                    }

                    if (zM.movement) {
                        if (zM.useWallhack) {
                            // solve first
                            toMove.forEach(X => {
                                // random here is anti-idle disconnect
                                if (!(X.realX === zM.pos.mouseX>>1 && X.realY === zM.pos.mouseY>>1) || (Math.random() >= 0.99 && zM.antiIdle)) {
                                    var moves = zM.path(X.realX, X.realY, zM.pos.mouseX>>1, zM.pos.mouseY>>1, b.obj, b.grid);
                                    X.toDo = moves;
                                    X.realX = zM.pos.mouseX>>1;
                                    X.realY = zM.pos.mouseY>>1;
                                }
                            });

                            // then send packets synchronized, all together
                            var count = 0;
                            for (var i = 0; i < toMove.length; ++i) count = Math.max(count, toMove[i].toDo.length);
                            for (var i = 0; i < count; ++i) {
                                toMove.forEach(X => {
                                    if (i >= X.toDo.length) return;
                                    zM.packet.moveSocket([X.socket], X.toDo[i][0], X.toDo[i][1], [X]);
                                });
                            }
                        } else {
                            zM.packet.moveSocket(toMoveSocket, zM.pos.mouseX>>1, zM.pos.mouseY>>1, toMove);
                        }
                    } else {
                        if (zM.clickQueue >= 1) {
                            toMove.forEach(X => {
                                var moves = zM.path(X.realX, X.realY, zM.pos.mouseX>>1, zM.pos.mouseY>>1, b.obj, b.grid);
                                moves.forEach(Y => {
                                    zM.packet.moveSocket([X.socket], Y[0], Y[1], [X]);
                                });
                            });
                        }
                        if (zM.antiIdle) {
                            toMove.forEach(X => {
                                // random here is anti-idle disconnect, if movement is disabled.
                                if (Date.now() - X.packets.lastSent > 10000) zM.packet.moveSocket([X.socket], X.realX, X.realY, [X]);
                            });
                        }
                    }

                    for (;0<zM.clickQueue;--zM.clickQueue) zM.packet.clickSocket(toMoveSocket, zM.pos.mouseX>>1, zM.pos.mouseY>>1, toMove);

                    if (zM.drawing && zM.movement) zM.packet.drawSocket(toMoveSocket, zM.pos.lastMouseX>>1, zM.pos.lastMouseY>>1, zM.pos.mouseX>>1, zM.pos.mouseY>>1, toMove);

                    zM.pos.lastMouseX = zM.pos.mouseX;
                    zM.pos.lastMouseY = zM.pos.mouseY;
                }, 50);
            }
        }`,
        /* zM bot class */
        `zM.dependenciesLoaded |= 0b000100

        zM.Bot = class {
            constructor (fleet) {
                this.fleet = fleet;

                this.socket = new WebSocket(this.fleet.wsIp);
                this.socket.binaryType = 'arraybuffer';

                this.opened = false;
                this.isOpen = false;

                this.level = -1;
                this.id = -1;

                this.obj = [];
                this.players = [];
                this.clicks = [];
                this.drawings = [];

                this.realX = 400;
                this.realY = 300;

                this.local = 0;

                this.packets = {
                    receivedTotal: 0,
                    sentTotal: 0,
                    receivedPS: 0,
                    sentPS: 0
                }

                this.toHelp = [];
                this.toDo = [];

                this.timestampStart = 0;

                this.helping = false;
                this.deployed = false;

                this.prevLevels = [];

                this.socket.addEventListener('open', () => {
                    ++this.fleet.botsOpened;
                    this.opened = true;
                    this.isOpen = true;
                    ++this.fleet.botsPinged;
                    zM.updateTabs();
                });

                this.socket.addEventListener('close', () => {
                    if (this.opened) {
                        --this.fleet.botsOpened;
                        var i = this.fleet.ids.indexOf(this.id);
                        if (i != -1) this.fleet.ids.splice(i, 1);
                    }
                    else ++this.fleet.botsPinged;
                    this.isOpen = false;

                    for (var i = 0; i < this.fleet.bots.length; ++i) if (this.fleet.bots[i] == this) { console.log('y'); this.fleet.bots.splice(i,1); break; }

                    zM.updateTabs();
                });

                this.socket.addEventListener('message', ev => {
                    var buf = ev.data,
                        dat = new DataView(buf);

                    ++this.packets.receivedTotal;
                    ++this.packets.receivedPS;
                    setTimeout(()=>{--this.packets.receivedPS},1000);

                    var type = dat.getUint8(0);
                    if (type === 0) this.id = dat.getUint32(1, 1), ++this.fleet.botsIds, this.fleet.ids.push(this.id);
                    else if (type === 1) {
                        var out = zM.parse.cursors(buf, 1);
                        this.local = out.shift();
                        var players = out.shift();
                        var idsHere = [];
                        // create players for all new ids
                        for (var i = 0; i < players.length; ++i) {
                            if (players[i].id === this.id) this.realX = players[i].x, this.realY = players[i].y;
                            var index = -1;
                            for (var j = 0; j < this.players.length; ++j) {
                                if (this.players[j].id === players[i].id) {index = j; break;}
                            }
                            if (index === -1) this.players.push({
                                x: players[i].x,
                                y: players[i].y,
                                lastUpdate: Date.now(),
                                ox: players[i].x,
                                oy: players[i].y,
                                id: players[i].id
                            });
                        }
                        for (var i = 0; i < players.length; ++i) {
                            for (var j = 0; j < this.players.length; ++j) {
                                if (this.players[j].id === players[i].id) {
                                    this.players[j].ox = zM.ease(this.players[j].x, this.players[j].ox, this.players[j].lastUpdate);
                                    this.players[j].oy = zM.ease(this.players[j].y, this.players[j].oy, this.players[j].lastUpdate);
                                    this.players[j].x = players[i].x;
                                    this.players[j].y = players[i].y;
                                    this.players[j].lastUpdate = Date.now();
                                    idsHere.push(players[i].id);
                                }
                            }
                        }
                        var nPl = [];
                        for (var i = 0; i < idsHere.length; ++i) {
                            for (var j = 0; j < this.players.length; ++j) {
                                if (idsHere[i] === this.players[j].id) nPl.push(this.players[j]);
                            }
                        }

                        this.players = nPl;
                        var off = out.shift();

                        out = zM.parse.clicks(buf, off);
                        for (;0 < out[0].length;) {
                            this.clicks.push(out[0].shift());
                        }

                        off = out.pop();

                        out = zM.parse.remove(buf, off);
                        for (var i = 0; i < out[0].length; ++i) {
                            for (var j = 0; j < this.obj.length; ++j) {
                                if (this.obj[j].id === out[0][i]) {this.obj.splice(j, 1); break;}
                            }
                        }

                        off = out.pop();

                        out = zM.parse.objects(buf, off);
                        var obj = zM.parse.objData(out.shift());

                        for (var i = 0; i < obj.length; ++i) {
                            var index = -1;
                            for (var j = 0; j < this.obj.length; ++j) {
                                if (this.obj[j].id === obj[i].id) {index = j; break;};
                            }
                            if (index === -1) this.obj.push(obj[i]);
                            else this.obj[j] = obj[i];
                        }

                        off = out.pop();

                        out = zM.parse.drawing(buf, off);

                        for (var i = 0; i < out[0].length; ++i) {
                            var todo = out[0][i];
                            this.drawings.push(todo);
                        }

                        this.online = dat.getUint32(dat.byteLength-4, true);

                    } else if (type === 4) {
                        if (this.level === -1) ++this.fleet.botsLevels;

                        this.drawings = [];

                        this.realX = dat.getUint16(1, true);
                        this.realY = dat.getUint16(3, true);

                        var objdata = zM.parse.objects(buf, 5);
                        this.obj = zM.parse.objData(objdata[0]);

                        var grid = 100;
                        for (var i = 0; i < this.obj.length; ++i) {
                            if (grid <= 1) {grid = 1; break;}
                            if (this.obj[i].type === 1) if (
                                (this.obj[i].x/grid|0) != (this.obj[i].x/grid) ||
                                (this.obj[i].y/grid|0) != (this.obj[i].y/grid) ||
                                (this.obj[i].w/grid|0) != (this.obj[i].w/grid) ||
                                (this.obj[i].h/grid|0) != (this.obj[i].h/grid)
                            ) --grid, i = -1;
                        }

                        this.grid = grid;

                        var compare = [];
                        for (var i = 0; i < this.obj.length; ++i) {
                            var o = this.obj[i];
                            if (o.type === 0) {
                                compare.push({
                                    x: o.x,
                                    y: o.y,
                                    size: o.size,
                                    content: o.content
                                });
                            } else if (o.type === 1) {
                                if (o.color === '#000000') compare.push({
                                    x: o.x,
                                    y: o.y,
                                    w: o.w,
                                    h: o.h
                                });
                            } else if (o.type === 2) {
                                compare.push({
                                    x: o.x,
                                    y: o.y,
                                    w: o.w,
                                    h: o.h,
                                    isBad: o.isBad
                                });
                            } else {
                                compare.push({
                                    x: o.x,
                                    y: o.y,
                                    w: o.w,
                                    h: o.h,
                                    color: o.color
                                });
                            }
                        }
                        compare = JSON.stringify(compare);
                        var i = this.prevLevels.indexOf(compare);
                        if (i != -1) this.level = i;
                        else ++this.level, this.prevLevels.push(compare);

                        this.fleet.updateTabs();
                    } else if (type === 5) {
                        this.realX = dat.getUint16(1, true);
                        this.realY = dat.getUint16(3, true);
                    }
                });
            }
        }`,

        `zM.dependenciesLoaded |= 0b001000;
        let ctx;

        zM.reqLoad = function() {
            zM.r = {
                fps: 0,
                hudText: function(text, x, y, subLength = 0, color = '#fff') {
                    ctx.font = '12px "Nova Flat"';
                    ctx.globalAlpha = .5;
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#000';
                    ctx.strokeText(text, x-ctx.measureText(text).width*subLength, y);

                    ctx.globalAlpha = 1;
                    ctx.fillStyle = color;
                    ctx.fillText(text, x-ctx.measureText(text).width*subLength, y);
                },
                infLvl: 5
            }
            ctx = zM.el.game.getContext('2d');
        }

        zM.reqDo = function() {
            ctx.clearRect(0, 0, 800, 600);

            if (isNaN(zM.fSel)) {
                ctx.font = '60px "Nova Flat"';
                ctx.fillStyle = '#000';
                var t = 'No fleet selected';
                ctx.fillText(t, 400 - ctx.measureText(t).width/2, 330);
            } else if (!zM.fleet[zM.fSel]) {
                ctx.font = '60px "Nova Flat"';
                ctx.fillStyle = '#000';
                var t = 'Undefined fleet selected';
                ctx.fillText(t, 400 - ctx.measureText(t).width/2, 330);
            } else if (!zM.fleet[zM.fSel].bots[zM.fleet[zM.fSel].cSel]) { // you can get this if the bot no longer exists (or an invalid bot selected state)
                ctx.font = '60px "Nova Flat"';
                ctx.fillStyle = '#000';
                var t = 'Lost connection to server';
                ctx.fillText(t, 400 - ctx.measureText(t).width/2, 330);
            } else {
                var b = zM.fleet[zM.fSel].bots[zM.fleet[zM.fSel].cSel];

                if (b.socket.readyState == WebSocket.CONNECTING) {
                    ctx.font = '60px "Nova Flat"';
                    ctx.fillStyle = '#000';
                    var t = 'Connecting';
                    ctx.fillText(t, 400 - ctx.measureText(t).width/2, 330);
                } else { // we don't need to handle closed states, the bot will be gone
                    for (var i = 0; i < b.obj.length; ++i) {
                        var o = b.obj[i];
                        switch (o.type) {
                            case 0:
                                ctx.globalAlpha = 1;
                                ctx.font = o.size + 'px "Nova Flat"';
                                ctx.fillStyle = '#000';
                                var x = o.x*2;
                                if (o.isCentered) x -= ctx.measureText(o.content).width/2;
                                ctx.fillText(o.content, x, o.y*2);
                                break;
                            case 1:
                                ctx.globalAlpha = 1;
                                ctx.fillStyle = o.color;
                                ctx.fillRect(o.x*2, o.y*2, o.w*2, o.h*2);
                                ctx.globalAlpha = .2;
                                ctx.strokeStyle = '#000';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(o.x*2+1, o.y*2+1, o.w*2-2, o.h*2-2);
                                break;
                            case 2:
                                ctx.globalAlpha = .2;
                                ctx.fillStyle = o.isBad?'#f00':'#0f0';
                                ctx.fillRect(o.x*2, o.y*2, o.w*2, o.h*2);
                                break;
                            case 3:
                                ctx.globalAlpha = .2;
                                ctx.fillStyle = o.color;
                                ctx.fillRect(o.x*2, o.y*2, o.w*2, o.h*2);
                                ctx.font = '24px "Nova Flat"';
                                ctx.fillStyle = '#000';
                                ctx.globalAlpha = .5;
                                ctx.fillText(o.count, o.x*2 + o.w - ctx.measureText(o.count).width/2, o.y*2+o.h+9);
                                break;
                            case 4:
                                ctx.globalAlpha = 1;
                                ctx.fillStyle = o.color;
                                ctx.fillRect(o.x*2, o.y*2, o.w*2, o.h*2);

                                ctx.globalAlpha = .2;
                                ctx.fillStyle = '#000';
                                ctx.fillRect(o.x*2, o.y*2, o.w*2, o.h*2);

                                ctx.globalAlpha = 1;
                                ctx.fillStyle = o.color;
                                ctx.fillRect(o.x*2+8, o.y*2+8, o.w*2-16, o.h*2-16);

                                var l = Date.now() - o.lastClickAt > 150 ? 8 : 16;

                                ctx.globalAlpha = .2;
                                ctx.lineWidth = 1;
                                ctx.strokeStyle = '#000';
                                ctx.beginPath(),

                                ctx.moveTo(o.x*2+1, o.y*2+1),
                                ctx.lineTo(o.x*2+o.w*2-2, o.y*2+1),
                                ctx.lineTo(o.x*2+o.w*2-2, o.y*2+o.h*2-2),
                                ctx.lineTo(o.x*2+1, o.y*2+o.h*2-2),
                                ctx.lineTo(o.x*2+1, o.y*2+1);

                                ctx.lineTo(o.x*2+1+l, o.y*2+1+l);

                                ctx.moveTo(o.x*2+o.w*2-2, o.y*2+1),
                                ctx.lineTo(o.x*2+o.w*2-2-l, o.y*2+1+l);

                                ctx.moveTo(o.x*2+o.w*2-2, o.y*2+o.h*2-2);
                                ctx.lineTo(o.x*2+o.w*2-2-l, o.y*2+o.h*2-2-l);

                                ctx.moveTo(o.x*2+1, o.y*2+o.h*2-2),
                                ctx.lineTo(o.x*2+1+l, o.y*2+o.h*2-2-l);

                                ctx.moveTo(o.x*2+l, o.y*2+l),
                                ctx.lineTo(o.x*2+o.w*2-l, o.y*2+l),
                                ctx.lineTo(o.x*2+o.w*2-l, o.y*2+o.h*2-l),
                                ctx.lineTo(o.x*2+l, o.y*2+o.h*2-l),
                                ctx.lineTo(o.x*2+l, o.y*2+l);

                                ctx.stroke();

                                ctx.fillStyle = '#000';
                                ctx.globalAlpha = .5;
                                ctx.font = '24px "Nova Flat"';
                                ctx.fillText(o.count, o.x*2 + o.w - ctx.measureText(o.count).width/2, o.y*2+o.h+9);
                        }
                    }

                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1.5;
                    for (var i = 0; i < b.clicks.length; ++i) {
                        if (typeof b.clicks[i] === 'object') {
                            if (Date.now() - b.clicks[i].time > 500) b.clicks.splice(i--, 1);
                            else {
                                ctx.beginPath(),
                                ctx.globalAlpha = .5 - (Date.now() - b.clicks[i].time)/1000;
                                var radius = (Date.now() - b.clicks[i].time)/20;
                                if (radius < 0.1) radius = 0.1 // Anti-crash failsafe
                                ctx.arc(b.clicks[i].x*2, b.clicks[i].y*2, radius, 0, 2*Math.PI);
                                ctx.stroke();
                            }
                        }
                    }

                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = .3;
                    for (var i = 0; i < b.drawings.length; ++i) {
                        if (typeof b.drawings[i] === 'object') {
                            if (Date.now() - b.drawings[i].time > 10000) b.drawings.splice(i--, 1);
                            else {
                                ctx.beginPath(),
                                ctx.moveTo(b.drawings[i].x*2, b.drawings[i].y*2);
                                ctx.lineTo(b.drawings[i].x2*2, b.drawings[i].y2*2);
                                ctx.stroke();
                            }
                        }
                    }

                    ctx.globalAlpha = 1;
                    ctx.font = '12px "Nova Flat"';
                    for (var i = 0; i < b.players.length; ++i) {
                        var img;
                        if (zM.fleet[zM.fSel].ids.indexOf(b.players[i].id) != -1) {
                            for (var j = 0; i < zM.fleet[zM.fSel].bots.length; ++j) {
                                if (zM.fleet[zM.fSel].bots[j]) if (zM.fleet[zM.fSel].bots[j].id == b.players[i].id) break;
                            }
                            if (j < zM.fleet[zM.fSel].bots.length) {
                                if (zM.fleet[zM.fSel].bots[j].helping || zM.fleet[zM.fSel].bots[j].deployed) img = zMIMG.movement.img;
                                else img = zMIMG.local.img;
                            } else img = zMIMG.local.img;
                        } else img = zMIMG.cursor.img;
                        var x = zM.ease(b.players[i].x, b.players[i].ox, b.players[i].lastUpdate)*2;
                        var y = zM.ease(b.players[i].y, b.players[i].oy, b.players[i].lastUpdate)*2;
                        ctx.drawImage(img, x-4, y-5);
                        x += 5;
                        y-= 2;
                        if (x + ctx.measureText(\`\${b.players[i].id}\`).width > 790) x = 790 - ctx.measureText(\`\${b.players[i].id}\`).width;
                        if (y - 12 < 10) y = 22;
                        zM.r.hudText(\`\${b.players[i].id}\`, x, y);
                    }

                    switch (zM.r.infLvl) {
                        case 5:
                            zM.r.hudText(\`Received (tp/ps) \${b.packets.receivedTotal} / \${b.packets.receivedPS}\`, 790, 22, 1);
                            zM.r.hudText(\`Sent (tp/ps) \${b.packets.sentTotal} / \${b.packets.sentPS}\`, 790, 36, 1);
                        case 4:
                        case 3:
                        case 2:
                            zM.r.hudText(\`Level \${b.level}\`, 10, 36);
                        case 1:
                            zM.r.hudText(
                                b.local < 30 ? 'Use shift+click to draw ('+b.local+' > 0)' :
                                b.local < 100 ? 'Too many cursors, drawing is disabled ('+b.local+' > 30)' :
                                b.local < 1010 ? 'Too many cursors, not all cursors are shown ('+b.local+' > 100)' :
                                'Use shift+click to draw ('+b.local+' > 1010)'
                            , 10, 590);

                            zM.r.hudText(\`\${b.online} players online\`, 790, 590, 1);
                        case 0:
                    }
                }
            }

            if (zM.r.infLvl >= 2) zM.r.hudText('FPS ' + zM.r.fps,10,22);

            ctx.fillStyle = zM.movement?'#ff0':'#f00';
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(zM.pos.mouseX+3, zM.pos.mouseY+6);
            ctx.arc(zM.pos.mouseX+3, zM.pos.mouseY+6, 20, 0, 2*Math.PI);
            ctx.fill();

            ctx.globalAlpha = 1;
            ctx.drawImage(zMIMG.cursor.img, zM.pos.mouseX-4, zM.pos.mouseY-5);


            zM.reqAfter();
        }

        zM.reqAfter = function() {
            ++zM.r.fps;
            requestAnimationFrame(zM.reqDo);
            setTimeout(()=>{--zM.r.fps},1000);
        }`,

        /* zM packet parsing */
        `zM.dependenciesLoaded |= 0b010000;

        zM.parse = {
            /**
             * Returns an array as [local, players, offset]
             */
            cursors: function(buffer, offset) {
                var dat = new DataView(buffer);
                var local = dat.getUint16(offset, true);

                offset += 2;

                var players = [];
                for (var i = 0; i < local; ++i) {
                    players.push({
                        id: dat.getUint32(offset, true),
                        x: dat.getUint16(offset + 4, true),
                        y: dat.getUint16(offset + 6, true),
                    });
                    offset += 8;
                }

                return [local, players, offset];
            },

            /**
             * Returns an array as [clicks, offset]
             */
            clicks: function(buffer, offset) {
                var dat = new DataView(buffer);

                var count = dat.getUint16(offset, true);
                var clicks = [];

                offset += 2;
                for (var i = 0; i < count; ++i) {
                    clicks.push({
                        x: dat.getUint16(offset, true),
                        y: dat.getUint16(offset + 2, true),
                        time: Date.now()
                    });
                    offset += 4;
                }

                return [clicks, offset];
            },

            /**
             * Returns an array as [clicks, offset]
             */
            drawing: function(buffer, offset) {
                var dat = new DataView(buffer);

                var count = dat.getUint16(offset, true);
                var drawings = [];

                offset += 2;
                for (var i = 0; i < count; ++i) {
                    drawings.push({
                        x: dat.getUint16(offset, true),
                        y: dat.getUint16(offset + 2, true),
                        x2: dat.getUint16(offset + 4, true),
                        y2: dat.getUint16(offset + 6, true),
                        time: Date.now()
                    });
                    offset += 8;
                }

                return [drawings, offset];
            },

            /**
             * Returns an array as [ids, offset]
             */
            remove: function(buffer, offset) {
                var dat = new DataView(buffer);

                var count = dat.getUint16(offset, true);
                var ids = [];

                offset += 2;
                for (var i = 0; i < count; ++i) {
                    ids.push(dat.getUint32(offset, true));
                    offset += 4;
                }

                return [ids, offset];
            },

            /**
             * Parses objdata (string) and outputs as objects.
             */
            objData: function(objdata) {
                var obj = objdata;
                var nObj = [];

                for (var i = 0; i < obj.length; ++i) {
                    var nO = {};
                    obj[i] = obj[i].split(/\\.+/g);
                    nO.id = parseInt(obj[i].shift());
                    var type = obj[i].shift();
                    switch (type) {
                        case '0':
                            nO.type = 0;
                            nO.x = parseInt(obj[i].shift());
                            nO.y = parseInt(obj[i].shift());
                            nO.size = parseInt(obj[i].shift());
                            nO.isCentered = obj[i].shift() === 'false'?false:true;

                            nO.content = obj[i].join('');
                            break;
                        case '1':
                            nO.type = 1;
                            nO.x = parseInt(obj[i].shift());
                            nO.y = parseInt(obj[i].shift());
                            nO.w = parseInt(obj[i].shift());
                            nO.h = parseInt(obj[i].shift());
                            nO.color = obj[i].shift();
                            break;
                        case '2':
                            nO.type = 2;
                            nO.x = parseInt(obj[i].shift());
                            nO.y = parseInt(obj[i].shift());
                            nO.w = parseInt(obj[i].shift());
                            nO.h = parseInt(obj[i].shift());
                            nO.isBad = obj[i].shift()==='false'?false:true;
                            break;
                        case '3':
                            nO.type = 3;
                            nO.x = parseInt(obj[i].shift());
                            nO.y = parseInt(obj[i].shift());
                            nO.w = parseInt(obj[i].shift());
                            nO.h = parseInt(obj[i].shift());
                            nO.count = parseInt(obj[i].shift());
                            nO.color = obj[i].shift();
                            break;
                        case '4':
                            nO.type = 4;
                            nO.x = parseInt(obj[i].shift());
                            nO.y = parseInt(obj[i].shift());
                            nO.w = parseInt(obj[i].shift());
                            nO.h = parseInt(obj[i].shift());
                            nO.count = parseInt(obj[i].shift());
                            nO.color = obj[i].shift();
                            nO.lastClickAt = 0;
                            break;
                    }

                    nObj.push(nO);
                }

                return nObj;
            },

            /**
             * Returns an array as [objdata, offset]
             * objdata is required to be further parsed with zM.parse.objData()
             */
            objects: function(buffer, offset) {
                var dat = new DataView(buffer);

                var count = dat.getUint16(offset, true);
                var objdata = [];

                offset += 2;
                for (var i = 0; i < count; ++i) {
                    var id = dat.getUint32(offset, true);
                    offset += 4;
                    var type = dat.getUint8(offset);
                    var objdat = id+'.';
                    ++offset;
                    switch (type) {
                        case 0:
                            objdat += '0.';
                            objdat += \`\${dat.getUint16(offset, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+2, true)}.\`;
                            objdat += \`\${dat.getUint8(offset+4)}.\`;
                            objdat += \`\${!!dat.getUint8(offset+5)}.\`;
                            offset += 5;
                            for (;1;) if (dat.getUint8(++offset) != 0) objdat += String.fromCharCode(dat.getUint8(offset));
                                      else break;

                            ++offset;
                            break;
                        case 1:
                            objdat += '1.';
                            objdat += \`\${dat.getUint16(offset, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+2, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+4, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+6, true)}.\`;
                            var color = dat.getUint32(offset+8, true).toString(16);
                            for (; color.length < 6;) color = '0' + color;
                            objdat += '#' + color + '.';

                            offset += 12;

                            break;

                        case 2:
                            objdat += '2.';
                            objdat += \`\${dat.getUint16(offset, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+2, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+4, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+6, true)}.\`;
                            objdat += \`\${!!dat.getUint8(offset+8)}.\`;
                            offset += 9;
                            break;

                        case 3:
                            objdat += '3.';
                            objdat += \`\${dat.getUint16(offset, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+2, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+4, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+6, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+8, true)}.\`;
                            var color = dat.getUint32(offset+10, true).toString(16);
                            for (; color.length < 6;) color = '0' + color;
                            objdat += '#' + color + '.';

                            offset += 14;
                            break;

                        case 4:
                            objdat += '4.';
                            objdat += \`\${dat.getUint16(offset, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+2, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+4, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+6, true)}.\`;
                            objdat += \`\${dat.getUint16(offset+8, true)}.\`;
                            var color = dat.getUint32(offset+10, true).toString(16);
                            for (; color.length < 6;) color = '0' + color;
                            objdat += '#' + color + '.';
                            offset += 14;
                            break;
                    }
                    objdata.push(objdat);
                }

                return [objdata, offset];
            }
        }

        zM.packet = {
            /**
             *
             * @param {array} sockets Array of sockets to move
             */
            moveSocket(sockets, x, y, bots) {
                var buf = new ArrayBuffer(9),
                    dat = new DataView(buf);

                dat.setUint8(0, 1);
                dat.setUint16(1, x, true);
                dat.setUint16(3, y, true);
                dat.setUint32(5, -1, true);
                sockets.forEach(X => typeof X.send === 'function' && X.send(buf));
                bots.forEach(X => {
                    ++X.packets.sentTotal;
                    ++X.packets.sentPS;
                    setTimeout(()=>{--X.packets.sentPS},1000);
                    X.packets.lastSent = Date.now();
                });
            },

            /**
             *
             * @param {array} sockets Array of sockets to click with
             */
            clickSocket(sockets, x, y, bots) {
                var buf = new ArrayBuffer(9),
                    dat = new DataView(buf);

                dat.setUint8(0, 2);
                dat.setUint16(1, x, true);
                dat.setUint16(3, y, true);
                dat.setUint32(5, -1, true);
                sockets.forEach(X => typeof X.send === 'function' && X.send(buf));
                bots.forEach(X => {
                    ++X.packets.sentTotal;
                    ++X.packets.sentPS;
                    setTimeout(()=>{--X.packets.sentPS},1000);
                    X.packets.lastSent = Date.now();
                });
            },

            /**
             *
             * @param {array} sockets Array of sockets to draw with
             */
            drawSocket(sockets, x, y, x2, y2, bots) {
                var buf = new ArrayBuffer(9),
                    dat = new DataView(buf);

                dat.setUint8(0, 3);
                dat.setUint16(1, x, true);
                dat.setUint16(3, y, true);
                dat.setUint16(5, x2, true);
                dat.setUint16(7, y2, true);
                sockets.forEach(X => typeof X.send === 'function' && (X.send(buf)));
                bots.forEach(X => {
                    ++X.packets.sentTotal;
                    ++X.packets.sentPS;
                    setTimeout(()=>{--X.packets.sentPS},1000);
                    X.packets.lastSent = Date.now();
                });
            }
        }`,
        /* zM Pathfinder */
        `zM.dependenciesLoaded |= 0b100000;

        var visit = [];

        zM.dos = function(dx, dy, items, gridSpace) {
            var gridX = 400/gridSpace,
                gridY = 300/gridSpace;
            var grid = [];
            visit = [];
            for (var i = 0; i < gridY; i++) {
                grid[i] = [];
                visit[i] = [];
                for (var j = 0; j < gridX; j++) grid[i][j] = 0, visit[i][j] = 0;
            }
            items.forEach(function(d) {
                if (d.type === 1) {
                    for (var i = 0; i < d.h; i+=gridSpace) {
                        for (var j = 0; j < d.w; j+=gridSpace) {
                            grid[(d.y+i)/gridSpace][(d.x+j)/gridSpace] = 3;
                        }
                    }
                }
            });
            var bfs = [[dx,dy]],
                bfs2 = [];
            while (bfs.length) {
                bfs.forEach(function(dat) {
                    var x = dat[0],
                        y = dat[1];
                    if (grid[y][x] == 3) return;
                    grid[y][x] = 3;
                    for (var X = x + 1; X < gridX && !(grid[y][X] & 1); X++) {
                        grid[y][X] |= 1;
                        if (!visit[y][X]) {
                            visit[y][X] = [x, y], bfs2.push([X, y]);
                        }
                    }
                    for (var X = x - 1; X >= 0 && !(grid[y][X] & 1); X--) {
                        grid[y][X] |= 1;
                        if (!visit[y][X]) {
                            visit[y][X] = [x, y], bfs2.push([X, y]);
                        }
                    }
                    for (var Y = y + 1; Y < gridY && !(grid[Y][x] & 2); Y++) {
                        grid[Y][x] |= 2;
                        if (!visit[Y][x]) {
                            visit[Y][x] = [x, y], bfs2.push([x, Y]);
                        }
                    }
                    for (var Y = y - 1; Y >= 0 && !(grid[Y][x] & 2); Y--) {
                        grid[Y][x] |= 2;
                        if (!visit[Y][x]) {
                            visit[Y][x] = [x, y], bfs2.push([x, Y]);
                        }
                    }
                });
                bfs = bfs2;
                bfs2 = [];
            }
        }

        zM.path = function(ox, oy, dx, dy, items, grid) {

            var rdx = dx, rdy = dy;
            ox /= grid;
            oy /= grid;
            dx /= grid;
            dy /= grid;

            ox |= 0;
            oy |= 0;
            dx |= 0;
            dy |= 0;

            var mov = [];
            if (!(ox == dx && oy == dy)) {
                zM.dos(ox,oy,items,grid);
                var xy2 = [dx,dy];
                while (visit[xy2[1]][xy2[0]]) {
                    mov.push(xy2);
                    xy2 = visit[xy2[1]][xy2[0]];
                }

                mov.reverse();
            }

            for (var i = 0; i < mov.length; ++i) {
                mov[i][0] *= grid;
                mov[i][0] += grid/2;
                mov[i][1] *= grid;
                mov[i][1] += grid/2;
            }
            mov.push([rdx, rdy]);
            return mov;
        }`
    ],

    // ---
    // add elements from functions below:
    // ---

[
    function(c) {
        var temp = [D.createElement('link')];
        temp[0].href = 'https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400';
        temp[0].rel = 'stylesheet';
        head.appendChild(temp[0]);

        temp[1] = D.createElement('link');
        temp[1].href = 'https://fonts.googleapis.com/css?family=Nova+Flat&display=swap';
        temp[1].rel = 'stylesheet';
        head.appendChild(temp[1]);
    },
    function(c) { // news area (null fleet selected)
        var temp = [D.createElement('div')];
        temp[0].className = 'zM-news-outer';

        temp[1] = D.createElement('div');
        temp[1].className = 'zM-news-container';
        temp[0].appendChild(temp[1]);

        temp[2] = D.createElement('div');
        temp[2].className = 'zM-news-page-top';
        temp[1].appendChild(temp[2]);

        temp[3] = D.createElement('div');
        temp[3].className = 'zM-news-page-mid';
        temp[1].appendChild(temp[3]);

        temp[4] = D.createElement('div');
        temp[4].className = 'zM-news-page-bottom';
        temp[1].appendChild(temp[4]);

        zM.el.newsOuter = temp[0];
        zM.el.newsPageTop = temp[2];
        zM.el.newsPageMid = temp[3];
        zM.el.newsPageBottom = temp[4];
        c.appendChild(temp[0]);
    },
    function(c) { // fleet prompt
        var temp = [D.createElement('div')];
        temp[0].className = 'zM-fleet-prompt-outer';

        temp[1] = D.createElement('div');
        temp[1].className = 'zM-fleet-prompt-container';
        temp[0].appendChild(temp[1]);

        temp[2] = D.createElement('div');
        temp[2].className = 'zM-fleet-prompt-title';
        temp[2].textContent = 'Create new fleet';
        temp[1].appendChild(temp[2]);


        temp[3] = D.createElement('div');
        temp[3].className = 'zM-fleet-prompt-entry';
        temp[1].appendChild(temp[3]);

        temp[4] = D.createElement('div');
        temp[4].className = 'zM-fleet-prompt-opt';
        temp[4].textContent = 'Use premade IPs'
        temp[3].appendChild(temp[4]);

        temp[5] = D.createElement('input');
        temp[5].type = 'checkbox';
        temp[5].checked = true;
        temp[5].addEventListener('change', () => {
            if (temp[5].checked) {
                temp[6].style.display = 'block';
                temp[10].style.display = 'none';
                temp[13].style.display = 'none';
                temp[16].style.display = 'none';
                if (temp[12].value + ':' + temp[15].value === `${ip}:2828`) temp[8].value = "0";
                else if (temp[12].value + ':' + temp[15].value === 'kursors.io/ws:8080') temp[8].value = "1";
                else if (temp[12].value + ':' + temp[15].value === 'localhost:9004') temp[8].value = "2";
            } else {
                temp[6].style.display = 'none';
                temp[10].style.display = 'block';
                temp[13].style.display = 'block';
                temp[16].style.display = 'block';

                // set input values
                switch (temp[8].value) {
                    case "0": {
                        temp[12].value = __ip;
                        temp[15].value = '2828';
                        break;
                    }
                    case "1": {
                        temp[12].value = 'kursors.io/ws';
                        temp[15].value = '8080';
                        break;
                    }
                    case "2": {
                        temp[12].value = 'localhost';
                        temp[15].value = '9004';
                        break;
                    }
                }

                temp[18].checked = false;
            }
        })
        temp[3].appendChild(temp[5]);


        temp[6] = D.createElement('div');
        temp[6].className = 'zM-fleet-prompt-entry';
        temp[1].appendChild(temp[6]);

        temp[7] = D.createElement('div');
        temp[7].className = 'zM-fleet-prompt-opt';
        temp[7].textContent = 'Select an IP to connect to:'
        temp[6].appendChild(temp[7]);

        // dropdown
        temp[8] = D.createElement('select');
        temp[8].style.outline = 'none';
        temp[6].appendChild(temp[8]);

        temp[9] = [D.createElement('option'), D.createElement('option'), D.createElement('option')];
        temp[9][0].value = "0";
        temp[9][0].textContent = `cursors.io ${__ip}:2828)`;
        temp[9][1].value = "1";
        temp[9][1].textContent = 'kursors.io (kursors.io/ws:8080)';
        temp[9][2].value = "2";
        temp[9][2].textContent = 'local server (localhost:9004)';

        temp[9].forEach(X => temp[8].appendChild(X));

        temp[10] = D.createElement('div');
        temp[10].className = 'zM-fleet-prompt-entry';
        temp[10].style.display = 'none';
        temp[1].appendChild(temp[10]);

        temp[11] = D.createElement('div');
        temp[11].className = 'zM-fleet-prompt-opt';
        temp[11].textContent = 'IP address:'
        temp[10].appendChild(temp[11]);
        temp[12] = D.createElement('input');
        temp[12].type = 'text';
        temp[12].style.outline = 'none';
        temp[12].width = 200;
        temp[10].appendChild(temp[12]);

        temp[13] = D.createElement('div');
        temp[13].className = 'zM-fleet-prompt-entry';
        temp[13].style.display = 'none';
        temp[1].appendChild(temp[13]);

        temp[14] = D.createElement('div');
        temp[14].className = 'zM-fleet-prompt-opt';
        temp[14].textContent = 'Port:'
        temp[13].appendChild(temp[14]);
        temp[15] = D.createElement('input');
        temp[15].type = 'text';
        temp[15].style.outline = 'none';
        temp[15].width = 200;
        temp[13].appendChild(temp[15]);

        temp[16] = D.createElement('div');
        temp[16].className = 'zM-fleet-prompt-entry';
        temp[16].style.display = 'none';
        temp[1].appendChild(temp[16]);

        temp[17] = D.createElement('div');
        temp[17].className = 'zM-fleet-prompt-opt';
        temp[17].textContent = 'Using IPv6:'
        temp[16].appendChild(temp[17]);
        temp[18] = D.createElement('input');
        temp[18].type = 'checkbox';
        temp[18].style.outline = 'none';
        temp[16].appendChild(temp[18]);

        // max bots
        temp[19] = D.createElement('div');
        temp[19].className = 'zM-fleet-prompt-entry';
        temp[1].appendChild(temp[19]);

        temp[20] = D.createElement('div');
        temp[20].className = 'zM-fleet-prompt-opt';
        temp[20].textContent = 'Maximum bots to this fleet:';
        temp[19].appendChild(temp[20]);

        temp[21] = D.createElement('input');
        temp[21].type = 'number';
        temp[19].appendChild(temp[21]);
        temp[21].addEventListener('change', ev => {
            var num = Math.min(100, Math.max(parseInt(temp[21].value), 0));
            if (isNaN(num)) num = 3;
            temp[21].value = num;
        });



        if (zM.origin === 'cursors') temp[21].value = 3;
        else temp[21].value = 20;


        // start bots
        temp[22] = D.createElement('div');
        temp[22].className = 'zM-fleet-prompt-entry';
        temp[1].appendChild(temp[22]);

        temp[23] = D.createElement('div');
        temp[23].className = 'zM-fleet-prompt-opt';
        temp[23].textContent = 'Start with # bots:';
        temp[22].appendChild(temp[23]);

        temp[24] = D.createElement('input');
        temp[24].type = 'number';
        temp[22].appendChild(temp[24]);
        temp[24].addEventListener('change', ev => {
            var num = Math.min(100, Math.max(parseInt(temp[24].value), 0));
            if (isNaN(num)) num = 3;
            temp[24].value = num;
        });

        if (zM.origin === 'cursors') temp[24].value = 3;
        else temp[24].value = 20;


        // zursor username
        temp[25] = D.createElement('div');
        temp[25].className = 'zM-fleet-prompt-entry';
        temp[1].appendChild(temp[25]);

        temp[26] = D.createElement('div');
        temp[26].className = 'zM-fleet-prompt-opt';
        temp[26].textContent = 'Fleet name (public):';
        temp[25].appendChild(temp[26]);

        temp[27] = D.createElement('input');
        temp[27].type = 'text';
        temp[25].appendChild(temp[27]);


        // confirmation buttons
        temp[28] = D.createElement('div');
        temp[28].className = 'zM-fleet-prompt-create';
        temp[28].textContent = 'Create fleet';
        temp[1].appendChild(temp[28]);

        temp[29] = D.createElement('div');
        temp[29].className = 'zM-fleet-prompt-cancel';
        temp[29].textContent = 'Cancel';
        temp[1].appendChild(temp[29]);

        temp[29].addEventListener('click', ev => {
            temp[0].style.display = 'none';
            if (isNaN(zM.fSel)) zM.el.newsOuter.style.display = 'block';
            else zM.updateTabs();
        });

        temp[28].addEventListener('click', () => {
            var ip, port, ipv6 = false;

            if (!temp[5].checked) ip = temp[12].value, port = temp[15].value, ipv6 = temp[18].checked;
            else {
                switch (temp[8].value) {
                    case "0": ip = __ip; port = '2828'; break;
                    case "1": ip = 'kursors.io/ws'; port = '8080'; break;
                    default: ip = 'localhost'; port = '9004'; break;
                }
            }

            var maxBots = parseInt(temp[21].value),
                startBots = parseInt(temp[24].value);

            var name = temp[27].value;
            if (name.length === 0) name = 'Unnamed fleet';
            zM.createFleet(ip, port, ipv6, maxBots, startBots, name);
        });



        // give temp to zM.el
        zM.el.fleetPromptOuter = temp[0];
        zM.el.fleetPromptContainer = temp[1];
        c.appendChild(temp[0]);
    },
    function(c) { // fleet topbar
        var temp = [D.createElement('div')];
        temp[0].className = 'zM-fleet-topbar-outer';
        c.appendChild(temp[0]);
        temp[4] = D.createElement('div');
        temp[4].className = 'zM-fleet-topbar-container';
        temp[0].appendChild(temp[4]);


        temp[1] = D.createElement('div');
        temp[1].className = 'zM-fleet-topbar-add';
        temp[4].appendChild(temp[1]);
        temp[1].addEventListener('click', ev => {
            zM.promptFleet();
        });


        temp[2] = D.createElement('img');
        temp[2].src = zMIMG.add.uri;
        temp[2].width = 45, temp[2].height = 35, temp[2].style.cssText = 'position:absolute;top:0px;left:0px;opacity:0.8;'
        temp[1].appendChild(temp[2]);


        temp[3] = D.createElement('div');
        temp[3].className = 'zM-fleet-topbar-hint';
        temp[3].textContent = 'Add fleet here to start playing';
        temp[0].appendChild(temp[3]);


        // give temp to zM.el
        zM.el.fleetTopbarOuter = temp.shift();
        zM.el.fleetTopbarContainer = temp.pop();
        zM.el.fleetTopbarAdd = temp.shift();
        zM.el.fleetTopbarAddImg = temp.shift();
        zM.el.fleetTopbarHint = temp.shift();
    },
    function(c) {
        var temp = document.createElement('canvas');

        temp.className = 'zM-game';
        temp.width = 800;
        temp.height = 600;
        c.appendChild(temp);

        temp.addEventListener('mousemove', ev => {
            zM.pos.mouseX = ev.offsetX;
            zM.pos.mouseY = ev.offsetY;
        });

        temp.addEventListener('mousedown', ev => {
            if (ev.shiftKey || ev.ctrlKey) zM.drawing = true;
            else {
                ++zM.clickQueue;
            }
        });

        temp.addEventListener('mouseup', ev => {
            zM.drawing = false;
        });

        addEventListener('keydown', ev => {
            if (isNaN(zM.fSel)) return;
            console.log(ev.key);
            switch (ev.key) {
                // all possible keys that can be drawn
                case 'A':
                case 'a':case 'B':case 'b':case 'C':case 'c':
                case 'D':case 'd':case 'E':case 'e':case 'F':
                case 'f':case 'G':case 'g':case 'H':case 'h':
                case 'I':case 'i':case 'J':case 'j':case 'K':
                case 'k':case 'L':case 'l':case 'M':case 'm':
                case 'N':case 'n':case 'O':case 'o':case 'P':
                case 'p':case 'Q':case 'q':case 'R':case 'r':
                case 'S':case 's':case 'T':case 't':case 'U':
                case 'u':case 'V':case 'v':case 'W':case 'w':
                case 'X':case 'x':case 'Y':case 'y':case 'Z':
                case 'z':case '1':case '2':case '3':case '4':
                case '5':case '6':case '7':case '8':case '9':
                case '0':case '!':case '@':case '#':case '$':
                case '%':case '^':case '&':case '*':case '(':
                case ')':case '`':case '~':case '-':case '_':
                case '=':case '+':case '[':case ']':case '{':
                case '}':case '\\':case '|':case ';':case ':':
                case '\'':case '"':case '.':case ',':case '<':
                case '>':case '/':case '?':

                case '¡':
                case '¢':case '£':case '¤':case '¥':case '¦':
                case '§':case '¨':case '©':case 'ª':case '«':
                case '¬':case '®':case '¯':case '°':case '±':
                case '²':case '³':case '´':case 'µ':case '¶':
                case '·':case '¸':case '¹':case 'º':case '»':
                case '¼':case '½':case '¾':case '¿':

                case 'À':
                case 'Á':case 'Â':case 'Ã':case 'Ä':case 'Å':
                case 'Æ':case 'Ç':case 'È':case 'É':case 'Ê':
                case 'Ë':case 'Ì':case 'Í':case 'Î':case 'Ï':
                case 'Ð':case 'Ñ':case 'Ò':case 'Ó':case 'Ô':
                case 'Õ':case 'Ö':case 'Ø':case 'Ù':case 'Ú':
                case 'Û':case 'Ü':case 'Ý':case 'Þ':case 'ß':
                case 'à':case 'á':case 'â':case 'ã':case 'ä':
                case 'å':case 'æ':case 'ç':case 'è':case 'é':
                case 'ê':case 'ë':case 'ì':case 'í':case 'î':
                case 'ï':case 'ð':case 'ñ':case 'ò':case 'ó':
                case 'ô':case 'õ':case 'ö':case 'ø':case 'ù':
                case 'ú':case 'û':case 'ü':case 'ý':case 'þ':
                case 'ÿ':
                    //zM.fleet[zM.fSel].
                    break;

                case 'F1':
                    ev.preventDefault();
                    zM.movement ^= 1;
                    break;

                case 'F2':
                    var f = zM.fleet[zM.fSel];
                    ev.preventDefault();
                    var i = 0;
                    for (; i < f.bots.length; ++i) {
                        if (f.bots[i]) if (!f.bots[i].deployed && !f.bots[i].helping && i !== f.cSel && f.bots[i].level === f.bots[f.cSel].level) break;
                    }
                    if (f.bots[i]) {
                        var b = f.bots[i];
                        b.deployed = true;
                    }
                    break;

                case 'F3':
                    var f = zM.fleet[zM.fSel];
                    ev.preventDefault();
                    var i = 0;
                    for (; i < f.bots.length; ++i) {
                        if (f.bots[i]) if (f.bots[i].deployed && f.bots[i].level === f.bots[f.cSel].level) break;
                    }
                    if (i < f.bots.length) {
                        var b = f.bots[i];
                        var s = f.bots[f.cSel];
                        b.deployed = false;

                        if (zM.returnAfterUndeployed) {
                            var moves = zM.path(b.realX, b.realY, s.realX, s.realY, b.obj, b.grid);
                            moves.forEach(Y => {
                                zM.packet.moveSocket([b.socket], Y[0], Y[1], [b]);
                            });
                        }
                    }
                    break;

                case 'F4':
                    ev.preventDefault();
                    var f = zM.fleet[zM.fSel];
                    if (f.isHelping) break;
                    f.isHelping = true;
                    var helpers = [];
                    for (var i = 0; i < f.bots.length; ++i) {
                        console.log(!f.bots[i].helping && !f.bots[i].deployed && i !== f.cSel && f.bots[i].level === f.bots[f.cSel].level);
                        console.log('1 ' + !f.bots[i].helping);
                        console.log('2 ' + !f.bots[i].deployed);
                        console.log('3 ' + (i !== f.cSel));
                        console.log('4 ' + (f.bots[i].level === f.bots[f.cSel].level));
                        if (f.bots[i]) if (!f.bots[i].helping && !f.bots[i].deployed && i !== f.cSel && f.bots[i].level === f.bots[f.cSel].level) helpers.push(f.bots[i]);
                    }
                    f.helpers = helpers;
                    break;

                case 'F5':
                    ev.preventDefault();
                    for (var i = 0; i < zM.fleet[zM.fSel].helpers.length; ++i) {
                        zM.fleet[zM.fSel].helpers[i].helping = false;
                    }
                    zM.fleet[zM.fSel].helpers = [];
                    zM.fleet[zM.fSel].isHelping = false;
                    break;
            }
        });

        zM.el.game = temp;

        zM.reqLoad();

        zM.reqDo();
    },

    function(c) {
        var temp = [D.createElement('div')];

        temp[0].className = 'zM-info-outer';
        c.appendChild(temp[0]);

        temp[1] = D.createElement('div');
        temp[1].className = 'zM-info-ver';
        temp[1].textContent = 'v' + zM.version;
        temp[0].appendChild(temp[1]);

        temp[2] = D.createElement('div');
        temp[2].className = 'zM-info-clog-button-outer';
        temp[0].appendChild(temp[2]);

        temp[3] = D.createElement('div');
        temp[3].className = 'zM-info-clog-button';
        temp[3].textContent = 'view changelog';
        temp[2].appendChild(temp[3]);




        temp[4] = D.createElement('div');
        temp[4].className = 'zM-clog-outer';
        c.appendChild(temp[4]);

        temp[5] = D.createElement('div');
        temp[5].className = 'zM-clog-container';
        temp[4].appendChild(temp[5]);


        temp[6] = D.createElement('div');
        temp[6].className = 'zM-clog-close';
        temp[4].appendChild(temp[6]);

        temp[7] = D.createElement('img');
        temp[7].src = zMIMG.close.uri;
        temp[6].appendChild(temp[7]);


        zM.el.clogOuter = temp[4];
        zM.el.clogContainer = temp[5];

        temp[2].addEventListener('click', ev => {
            zM.el.clogOuter.style.display = 'block';
        });
        temp[6].addEventListener('click', ev => {
            zM.el.clogOuter.style.display = 'none';
        });


        var out = [];
        for (var i = 0; i < zM.clog.length; ++i) {
            var temp = D.createElement('div');
            if (zM.clog[i].type === 'title') {
                temp.className = 'zM-clog-title';
                temp.innerHTML = zM.clog[i].msg;
                out.push(temp);
            } else {
                temp.className = 'zM-clog-desc';
                temp.innerHTML = zM.clog[i].msg;
                out.push(temp);
            }
        }

        out.forEach(X => zM.el.clogContainer.appendChild(X));
    }
]
);
})();