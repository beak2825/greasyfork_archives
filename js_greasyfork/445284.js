// ==UserScript==
// @name         Rotator Speed
// @namespace    speed.satology
// @version      1.1.9.1
// @author       satology
// @match        https://*.speedsatoshi.com/faucet*
// @match        https://pepperlark.neocities.org/speedsatoshi.html
// @match        https://pepperlark.neocities.org/speedsatoshi.html/clearlog
// @icon         https://www.google.com/s2/favicons?sz=64&domain=speedsatoshi.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @description Claim from SpeedSatoshi's faucets
// @downloadURL https://update.greasyfork.org/scripts/445284/Rotator%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/445284/Rotator%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const USE_LOG = true;
    // const TIMEOUT = 5 * 60 * 1000;
    const landing = 'https://pepperlark.neocities.org/speedsatoshi.html';

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms || 5000));
    const btnSelector = '#claim';

    let activation;
    let faucetList = [
        { coin: 'BTC', url: 'www.speedsatoshi.com', enabled: true },
        { coin: 'ETH', url: 'ethereum.speedsatoshi.com', enabled: true },
        { coin: 'BNB', url: 'binance-coin.speedsatoshi.com', enabled: true },
        { coin: 'BCH', url: 'bitcoin-cash.speedsatoshi.com', enabled: true },
        { coin: 'LTC', url: 'litecoin.speedsatoshi.com', enabled: true },
        { coin: 'DOGE', url: 'dogecoin.speedsatoshi.com', enabled: true },
        { coin: 'TRX', url: 'tron.speedsatoshi.com', enabled: true },
        { coin: 'DGB', url: 'digibyte.speedsatoshi.com', enabled: true }
    ];
    let currentCoin = '';
    let currentHost = (window.location.host == 'speedsatoshi.com' ? 'www.speedsatoshi.com' : window.location.host);

    let scrolled = false;
    let sent = false;

    class Logger {
        static log;
        static listening;
        static async write(msg) {
            if (!USE_LOG) {
                return;
            }

            if (Logger.log == []) {
                await Logger.load();
            }

            if(msg) {
                let last = { ts: 0, msg: '' };
                try { last = Logger.log[Logger.log.length - 1]; } catch (err) { }

                if (!last || last.msg != msg || Date.now() - last.ts > 20000) {
                    Logger.log.push({ ts: Date.now(), msg: msg });
                    Logger.save();
                }
            }
        }
        static clear() {
            Logger.log = [];
            Logger.save();
        }
        static claimOkReader(name, old_value, new_value, remote) {
            if(remote) {
                let newClaim = JSON.parse(new_value);

                // hide previous claims and display the balance
                [...document.querySelectorAll('.coin-msg')].forEach( x => x.innerText= x.getAttribute('data-balance'));
                // msg holder
                let msgHolder = document.querySelector(`#${newClaim.coin}-msg`);
                if (msgHolder) {
                    msgHolder.setAttribute('data-balance', newClaim.balance);
                    msgHolder.innerText = newClaim.msg;
                }
            }
        }
        static refresh(name, old_value, new_value, remote) {
            if(remote) {
                Logger.log = JSON.parse(new_value);
                Logger.show();
            }
        }
        static show() {
            if (!USE_LOG) {
                return;
            }
            if(!Logger.listening) {
                // document.querySelector('head').removeChild(document.querySelector('style'));
                let bodyElm = document.querySelector('body');
                bodyElm.innerHTML = '';
                let divElm = document.createElement('div');
                // divElm.innerHTML = '<p>Click <a href="' + landing + '/clearlog">here</a> to clear the log (only when not claiming)</p><pre style="height: 500px; position: relative; display: block; font-size: 87.5%; overflow: auto;" id="console-log"></pre><input type="checkbox" id="only-claims"><label for="only-claims">Only Claims</label>';
                let divHtml = '<table><tbody>';

                faucetList.forEach( function (f, idx) {
                    divHtml += `<tr>
                    <td><input type="checkbox" id="cbox-${f.coin}" name="coins" value="${f.coin}" ${(f.enabled ? 'checked' : '')}><label for="cbox-${f.coin}">${f.coin}</label></td>
                    <td><span id="${f.coin}-msg" class="coin-msg" style="margin-left: 50px;" data-balance="" data-coin="${f.coin}"></span></td>
                    </tr>`;
                });

                divHtml += '</tbody></table>';
                divHtml += `<p style="text-align:justify;">
                First click <a href="https://ouo.io/uEK5QFX" target="_blank">here</a> to sign up. Select the coins you want to claim, and press the button.
                It will only claim from selected faucets. Next, click or tap on the first faucet icon you selected.
                </p><div style="border:3px solid white;display:inline;"><button id="save-faucets" onclick="this.innerText='Saving...';">Save Faucets</button></div><br>
                <p>
                <a href="https://speedsatoshi.com/faucet/manual" target="_blank"><img name="btc" src="https://i.ibb.co/5WTcT60/logo.png" width="32px" height="32px"></a> -
                <a href="https://ethereum.speedsatoshi.com/faucet/manual" target="_blank"><img name="eth" src="https://i.ibb.co/80MLDkS/logo.png" width="32px" height="32px"></a> -
                <a href="https://binance-coin.speedsatoshi.com/faucet/manual" target="_blank"><img name="bnb" src="https://i.ibb.co/d2hZ16n/logo.png" width="32px" height="32px"></a> -
                <a href="https://bitcoin-cash.speedsatoshi.com/faucet/manual" target="_blank"><img name="bch" src="https://i.ibb.co/7zpd6yz/logo.png" width="32px" height="32px"></a> -
                <a href="https://litecoin.speedsatoshi.com/faucet/manual" target="_blank"><img name="ltc" src="https://i.ibb.co/VNLBwcf/logo.png" width="32px" height="32px"></a> -
                <a href="https://tron.speedsatoshi.com/faucet/manual" target="_blank"><img name="trx" src="https://i.ibb.co/tPLPGkQ/logo.png" width="32px" height="32px"></a> -
                <a href="https://dogecoin.speedsatoshi.com/faucet/manual" target="_blank"><img name="doge" src="https://i.ibb.co/w6GPThJ/logo.png" width="32px" height="32px"></a> -
                <a href="https://digibyte.speedsatoshi.com/faucet/manual" target="_blank"><img name="dgb" src="https://i.ibb.co/Hg1ZvJB/logo.png" width="32px" height="32px"></a>
                </p><br><p>Click <a href="${landing}/clearlog">here</a> to clear the log (only when not claiming)</p>
                <input type="checkbox" id="only-claims"><label for="only-claims">Only Claims</label><pre style="height: 500px; position: relative; display: block; font-size: 87.5%; overflow: auto;" id="console-log"></pre>`;
                divElm.innerHTML = divHtml;
                bodyElm.appendChild(divElm);

                document.querySelector('#only-claims').onchange = function (event) { // agrega una function para cuando cambia el estado del checkbox
                    let preElm = document.querySelector('#console-log'); // toma el elemento pre, que tiene todo el log
                    if (event.target.checked) { // si el checkbox esta seleccionado...
                        window.fullLog = preElm.innerHTML.split('<br>'); // guarda en una variable todo el log, en forma de array (para separarlo en lineas en base a <br>
                        preElm.innerHTML = window.fullLog.filter( x => x.includes('Good job')).join('<br>'); // primero filtra para tomar solo las lineas/elementos del array que tienen 'Good Job', y luego une el resultado con <br>
                    } else { // si el checkbox no esta seleccionado
                        preElm.innerHTML = window.fullLog.join('<br>'); // pisa el contenido de <pre> con el log entero, uniendolo con <br> para hacer los saltos de linea
                    }
                };

                GM_addValueChangeListener("devlog", Logger.refresh);
                GM_addValueChangeListener("last_claim", Logger.claimOkReader);
                Logger.listening = true;
            }

            let logElm = document.querySelector('#console-log');
            logElm.innerHTML = Logger.log.map( function (x) {
                let date = new Date(x.ts);
                return `${date.readable()} - ${x.msg}`
            }).join('<br>');

            if (document.querySelector('#only-claims').checked) { // si esta filtrando...
                window.fullLog = logElm.innerHTML.split('<br>'); // guarda en una variable todo el log, en forma de array (para separarlo en lineas en base a <br>
                logElm.innerHTML = window.fullLog.filter( x => x.includes('Good job')).join('<br>'); // primero filtra para tomar solo las lineas/elementos del array que tienen 'Good Job', y luego une el resultado con <br>
            }

            logElm.scrollTop = logElm.scrollHeight;
        }
        static async load() {
            if (!USE_LOG) {
                return;
            }
            Logger.log = await GM_getValue('devlog');
            if (Logger.log) {
                Logger.log = JSON.parse(Logger.log);
            }
            Logger.log = Logger.log ?? [];
        }
        static save() {
            GM_setValue('devlog', JSON.stringify(Logger.log));
        }
    }

    class FaucetActivation {
        constructor() {}

        update() {
            let btnSave = document.querySelector('#save-faucets');
            if (btnSave.innerText == 'Saving...') {
                let actives = [...document.getElementsByName('coins')];
                actives = actives.filter(cb => cb.checked).map(cb => cb.value);

                faucetList.forEach( function (faucet, idx) {
                    faucetList[idx].enabled = actives.findIndex(y => y == faucet.coin) > -1;
                });
                this.save();
                btnSave.innerText = 'Done! Please refresh';
                return;
            }
        }

        async save() {
            GM_setValue('faucets', JSON.stringify(faucetList));
        }

        async load() {
            let savedFaucetList = await GM_getValue('faucets');
            if (savedFaucetList) {
                savedFaucetList = JSON.parse(savedFaucetList);
                faucetList.forEach( function (elm, idx) {
                    faucetList[idx].enabled = savedFaucetList.findIndex(y => y.coin == elm.coin && y.enabled == true) > -1;
                });
                // faucetList = JSON.parse(savedFaucetList);
            }
            Promise.resolve(true);
        }
    }

    function goNext() {
        let current = faucetList.findIndex( x => x.url == currentHost );
        let nextEnabled = current + 1;

        while(nextEnabled < faucetList.length && !faucetList[nextEnabled].enabled) {
            nextEnabled++;
        }

        if(nextEnabled == faucetList.length) {
            nextEnabled = 0;
            while(nextEnabled < current && !faucetList[nextEnabled].enabled) {
                nextEnabled++;
            }
        }

        let links = document.querySelectorAll('#full td span a');
        if (links.length != 8) {
            //something changed
            Logger.write(`GOTO Link not found. Using url.`);
            window.location.href = linkFor(faucetList[nextEnabled].url);
        } else {
            if (links.length >= nextEnabled) {
                links[nextEnabled].click();
                Logger.write(`GOTO Link clicked`);
                return;
            }
        }
    }

    function linkFor(host) {
        return 'https://' + host + '/faucet/manual';
    }

    function claimedOk() {
        // <p class="alert alert-info alert-padded" role="alert">Good job! You claimed 0.0000000166 BTC from the faucet.</p>
        let elms = [...document.querySelectorAll('p.alert.alert-info.alert-padded')];
        if (elms.length > 0) {
            let found = elms.find( x => x.innerText.includes('Good job') );
            if (found) {
                Logger.write(`claimedOk returning true: ${found.innerText}`);

                // get balance
                let balance = document.querySelector('#balance');
                balance = balance ? balance.innerText : '?';

                let msg = balance ? `${found.innerText} You have ${balance} ${currentCoin}` : Logger.write(`${found.innerText}`);
                GM_setValue('last_claim', JSON.stringify({ coin: currentCoin, msg: msg, balance: balance}));

                return true;
            }
        }
        Logger.write(`claimedOk returning false`);
        return false;
    }

    function tokenError() {
        //<p class="alert alert-danger" role="alert">Invalid token. Refresh the page and try again.</p>
        let elms = [...document.querySelectorAll('p.alert.alert-danger')];
        if (elms.length > 0) {
            let found = elms.find( x => x.innerText.includes('Invalid token. Refresh') );
            if (found) {
                Logger.write(`tokenError returning true: ${found.innerText}`);
                return true;
            }
        }
        Logger.write(`tokenError returning false`);
        return false;
    }

    async function isSolved() {
        Logger.write(`Waiting for captcha`);
        return wait().then( () => {
            let elm = document.querySelector('.h-captcha > iframe');
            if (elm && elm.hasAttribute('data-hcaptcha-response') && elm.getAttribute('data-hcaptcha-response').length > 0) {
                Logger.write(`Captcha solved`);
                return Promise.resolve(true);
            }
            return isSolved();
        });
    }
    function scrollTo(elm) {
        Logger.write(`Scrolling to button`);
        if (typeof(elm) == 'string') {
            document.querySelectorAll(elm)[0].scrollIntoView(false);
        } else {
            elm.scrollIntoView(false);
        }
    }

    let looper, adsHandler;

    Logger.load().then( () => {
        activation = new FaucetActivation();
        activation.load();
        }).then( () => {
        if (window.location.href == landing) {
            Number.prototype.padIt = function () {
                return this.toString().padStart(2, '0');
            }
            Date.prototype.readable = function () {
                return `${this.getDate().padIt()}/${(this.getMonth()+1).padIt()} ${this.getHours().padIt()}:${this.getMinutes().padIt()}:${this.getSeconds().padIt()}`;
            }
            Logger.show();
            setInterval( () => { activation.update(); }, 10000);
            //setInterval( () => { Logger.show(); }, 15000);
        } else if (window.location.href == landing + '/clearlog') {
            document.querySelector('body').innerHTML = 'Please wait...';
            Logger.clear();
            setTimeout( () => {
                window.location.href = landing;
            }, 10000);
        } else {
            let current = faucetList.findIndex( x => x.url == currentHost );
            if (!faucetList[current].enabled) {
                goNext();
                return;
            }
            currentCoin = faucetList[current].coin;

            looper = setInterval( () => {
                if (claimedOk()) {
                    Logger.write(`Moving to next faucet`);
                    //go to next faucet
                    clearInterval(looper);
                    setTimeout( () => { goNext(); }, 3000);
                    return;
                }
                if (tokenError()) {
                    //refresh
                    clearInterval(looper);
                    setTimeout( () => { window.location.reload(); }, 3000);
                    return;
                }
                if(!scrolled) {
                    if(document.querySelector(btnSelector)) {
                        scrollTo(btnSelector);
                        scrolled = true;
                    } else {
                        Logger.write(`Claim button not found yet`);
                        // claim button not found yet
                        return;
                    }
                }

                if (!sent) {
                    clearInterval(looper);
                    isSolved().then( () => {
                        Logger.write(`Submiting`);
                        document.querySelector(btnSelector).parentElement.submit();
                        sent = true;
                    });
                }
            }, 3214);
        }

        adsHandler = setInterval( () => {
            try {
                let elm = null;
                elm = document.querySelector('div[data-name="stitialer"]');
                if (elm) {
                    elm.nextSibling.click();
                }
                elm = document.querySelector('.ex-over-btn');
                if (elm) {
                    elm.click();
                }
            } catch (err) {
            }
        }, 10000);
    });
})();