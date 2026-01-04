// ==UserScript==
// @name         Stormgain with 2Captcha (Miner)
// @description  Solves Stormgain Miner Captcha (GeeTest) using 2Captcha service
// @version      0.3
// @author       satology
// @namespace    sg2c.satology.onrender.com
// @connect      2captcha.com
// @connect      miner.stormgain.com
// @grant        GM_xmlhttpRequest
// @match        https://app.stormgain.com/crypto-miner/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stormgain.com
// @downloadURL https://update.greasyfork.org/scripts/444560/Stormgain%20with%202Captcha%20%28Miner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444560/Stormgain%20with%202Captcha%20%28Miner%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* Settings */
    const API_KEY = 'YOUR_API_KEY';
    const DISPLAY_UI = true; // Let's you stop the auto process (to solve it manually) and shows some log msgs afterwards
    const COUNTDOWN_SECONDS = 9; // Time to wait before auto solving
    const LOG_TO_CONSOLE = true; // Shows log in console

    let preventStartCountdown = COUNTDOWN_SECONDS;
    let btn_start;
    let statusContainer;
    let statusElm;
    let itv_start;
    let itv_countdown;

    // Old/V3
    // let snd_gt = '';
    // let snd_challenge = '';
    // V4:
    let snd_captcha_id = '';

    let api_req_id = '';

    // Old/V3 Vars:
    // let rsp_challenge = '';
    // let rsp_validate = '';
    // let rsp_seccode = '';
    // V4 vars:
    let rsp_captcha_id = '';
    let rsp_lot_number = '';
    let rsp_pass_token = '';
    let rsp_gen_time = '';
    let rsp_captcha_output = '';

    let sg_token = '';
    let sg_clientId = '';

    let api_in = function() {
        // Old/V3 version:
        // return `https://2captcha.com/in.php?key=${API_KEY}&json=1&method=geetest&gt=${snd_gt}&challenge=${snd_challenge}&pageurl=https://app.stormgain.com/crypto-miner/`;
        // V4:
        return `https://2captcha.com/in.php?key=${API_KEY}&json=1&method=geetest_v4&captcha_id=${snd_captcha_id}&pageurl=https://app.stormgain.com/crypto-miner/`;
    }
    let api_out = function() {
        return `https://2captcha.com/res.php?key=${API_KEY}&json=1&action=get&id=${api_req_id}`;
    };
    let apiResponse = '';

    function logger(title = '', msg = '') {
        if(!LOG_TO_CONSOLE) {
            return;
        }

        console.log("%c" + new Date().toISOString().slice(0, 19).replace("T", " ") + ' > ' + title, "background: yellow; font-size: large");
        console.log(msg);
    }

    function toUI(msg) {
        if (DISPLAY_UI) { document.getElementById("sg2c-msg").innerHTML = msg; }
    }

    async function start() {
        try {
            sg_token = JSON.parse(localStorage.AppStorage).JWTAccessToken;
            logger('', 'JWTAccessToken retireved');
        } catch(err) {
            logger('Unable to retrieve JWTAccessToken', err);
            toUI('Error!');
            return;
        }

        try {
            sg_clientId = [...document.scripts].filter(x => x.textContent.includes('app-config'))[0].innerText.replace("'", "").split('"personCode":')[1].split(",")[0]
            // sg_clientId = Object.keys(JSON.parse(localStorage.AppStorage).clientPrefs)[0];
            toUI('CLientID retireved');
        } catch(err) {
            logger('Unable to retrieve ClientID', err);
            toUI('Error!');
            return;
        }

        let rr = await fetch("https://miner.stormgain.com/api/v1/preactivate", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "authorization": "Token " + sg_token,
                "client-id": sg_clientId
            },
            "referrer": "https://app.stormgain.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        });

        let content = await rr.json();

//        if (content && content.data && content.data.success && content.data.gt && content.data.challenge) {
        if (content && content.data && content.captcha_provider == 'geetest_v4' && content.data.gt) {
            // snd_gt = content.data.gt;
            snd_captcha_id = content.data.gt;
            logger('', 'Challenge data retrieved');
        } else {
            logger('Error retrieving challenge data', content);
            toUI('Error!');
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: api_in(),
            onload: function(response) {
                apiResponse = JSON.parse(this.responseText);
                if (apiResponse.status == 0) {
                    logger('Error in SG with captcha', apiResponse.error_text);
                    toUI('Error!');
                } else {
                    api_req_id = apiResponse.request;
                    logger('Captcha submitted', 'Request ID: ' + api_req_id);
                    toUI('Captcha submitted');
                    setTimeout( () => { getSolved(); }, 15000 );
                }
            },
            onerror: function(e) {
                toUI('Error!');
                logger('Error submitting captcha', e);
            }
        });
    }

    function getSolved() {
        toUI('Waiting for solution...');
        logger('', 'Retrieving solution');
        GM_xmlhttpRequest({
            method: "GET",
            url: api_out(),
            onload: function(response) {
                apiResponse = JSON.parse(this.responseText);
                logger('2C Response when retrieving', apiResponse);

                if (apiResponse.status == 0) {
                    logger('2C Message', apiResponse.request);
                    if (apiResponse.request == 'CAPCHA_NOT_READY') {
                        toUI('Captcha not ready yet...');
                        setTimeout( () => { getSolved(); }, 15000 );
                    } else if (apiResponse.request == 'ERROR_CAPTCHA_UNSOLVABLE') {
                        toUI('Refreshing for retry...');
                        setTimeout( () => { window.location.reload(); }, 2000);
                        return;
                    } else {
                        if (apiResponse.error_text) {
                            toUI('Error: ' + apiResponse.error_text);
                        }
                        if (apiResponse.request) {
                            toUI('Error: ' + apiResponse.request);
                        }
                    }
                } else {
                    // Old/V3 vars:
                    // rsp_challenge = apiResponse.request.geetest_challenge;
                    // rsp_validate = apiResponse.request.geetest_validate;
                    // rsp_seccode = apiResponse.request.geetest_seccode;

                    // V4 Vars:
                    rsp_captcha_id = apiResponse.request.captcha_id;
                    rsp_lot_number = apiResponse.request.lot_number;
                    rsp_pass_token = apiResponse.request.pass_token;
                    rsp_gen_time = apiResponse.request.gen_time;
                    rsp_captcha_output = apiResponse.request.captcha_output;

                    toUI('Results ready. Processing...');
                    //TODO: send to SG
                    // if (rsp_challenge && rsp_validate && rsp_seccode) { // <= old condition
                    if (rsp_captcha_id && rsp_lot_number && rsp_pass_token && rsp_gen_time && rsp_captcha_output) {
                        logger('2C solved the captcha', 'Sending to SG');
                        sendToSg();
                    } else {
                        logger('Something is missing in the response. Not sending it to SG');
                    }
                }
            },
            onerror: function(e) {
                logger('Unexpected error getting solution', e);
                toUI('Error!');
                //TODO: retry in X seconds
            }
        });
    }

    async function sendToSg() {
        logger('Sending to SG');
        let httpData = {
            method: "POST",
            url: "https://miner.stormgain.com/api/v1/activate",
            headers: {
                "accept": "application/json, text/plain, */*",
                "authorization": "Token " + sg_token,
                "client-id": sg_clientId,
                "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryKFzlAnieQFGQSLEZ",
                "cookie": document.cookie,
                "referrer": "https://app.stormgain.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "mode": "cors",
                "credentials": "omit",
            },
            // Old/V3:
            // "data": "------WebKitFormBoundaryGpbvA0qBtFeR1Kuw\r\nContent-Disposition: form-data; name=\"geetest_challenge\"\r\n\r\n" + rsp_challenge + "\r\n------WebKitFormBoundaryGpbvA0qBtFeR1Kuw\r\nContent-Disposition: form-data; name=\"geetest_seccode\"\r\n\r\n" + rsp_seccode + "\r\n------WebKitFormBoundaryGpbvA0qBtFeR1Kuw\r\nContent-Disposition: form-data; name=\"geetest_validate\"\r\n\r\n" + rsp_validate + "\r\n------WebKitFormBoundaryGpbvA0qBtFeR1Kuw--\r\n",
            // Old/V4:
            // "body": "------WebKitFormBoundaryKFzlAnieQFGQSLEZ\r\nContent-Disposition: form-data; name=\"geetest_lot_number\"\r\n\r\                       \r\n------WebKitFormBoundaryKFzlAnieQFGQSLEZ\r\nContent-Disposition: form-data; name=\"geetest_captcha_output\"\r\n\r\n.                         \r\n------WebKitFormBoundaryKFzlAnieQFGQSLEZ\r\nContent-Disposition: form-data; name=\"geetest_pass_token\"\r\n\r\n                      \r\n------WebKitFormBoundaryKFzlAnieQFGQSLEZ\r\nContent-Disposition: form-data; name=\"geetest_gen_time\"\r\n\r\n.         1696613876\r\n------WebKitFormBoundaryKFzlAnieQFGQSLEZ--\r\n",
            "data": "------WebKitFormBoundaryKFzlAnieQFGQSLEZ\r\nContent-Disposition: form-data; name=\"geetest_lot_number\"\r\n\r\n" + rsp_lot_number + "\r\n------WebKitFormBoundaryKFzlAnieQFGQSLEZ\r\nContent-Disposition: form-data; name=\"geetest_captcha_output\"\r\n\r\n" + rsp_captcha_output + "\r\n------WebKitFormBoundaryKFzlAnieQFGQSLEZ\r\nContent-Disposition: form-data; name=\"geetest_pass_token\"\r\n\r\n" + rsp_pass_token + "\r\n------WebKitFormBoundaryKFzlAnieQFGQSLEZ\r\nContent-Disposition: form-data; name=\"geetest_gen_time\"\r\n\r\n" + rsp_gen_time + "\r\n------WebKitFormBoundaryKFzlAnieQFGQSLEZ--\r\n",
            onload: function(response) {
                logger('SG Response', response);
                apiResponse = JSON.parse(this.responseText);
                if (apiResponse.active) {
                    toUI('Success. Refreshing...');
                    logger('SG accepted the solution', 'Refreshing...');
                    setTimeout( () => { window.location.reload(); }, 2000);
                } else {
                    toUI('Error');
                    logger('Something went wrong. Check the SG Response', apiResponse);
                }
            },
            onerror: function(e) {
                logger('Error sending solution to SG', e);
                toUI('Error!');
            }
        };
        // console.log('headers', httpData.headers);
        // console.log('data', httpData.data);
        GM_xmlhttpRequest(httpData);

        return;
    }

    itv_start = setInterval( () => {
        btn_start = document.querySelector('.wrapper .activate');

        if (btn_start) {
            clearInterval(itv_start);
            if (!DISPLAY_UI) {
                start();
                return;
            }

            //load countdown/ui
            statusContainer = btn_start.parentNode.parentNode;
            statusContainer.innerHTML = `<span id="sg2c-msg" class="text-36 leading-9 font-bold text-center sg2c" style="color: #FF9900">Solving in <span id="sg2c-countdown" class="sg2c">${preventStartCountdown}</span>...</span>
            <button id="sg2c-btn" style="background-color: rgb(255, 153, 0)" class="relative inline-flex justify-center items-center flex-shrink-0 bg-accent text-dark-1 text-center select-none cursor-pointer border-none
             self-center rounded px-2 py-2 hover-shadow-big my-5 sg2c"><span class="px-4 text-15 leading-24 font-bold">Stop!, I'll do it manually!</span></button>` + statusContainer.innerHTML
            statusElm = document.getElementById('sg2c-countdown');

            document.getElementById("sg2c-btn").addEventListener("click", function() {
                clearInterval(itv_countdown);
                let elements = document.getElementsByClassName('sg2c');
                for (var element of elements) {
                    element.remove();
                }
                this.innerText = 'Navigate using the menu and come back to the Miner if the button doesn\'t work';
                //this.remove();
                return;
            });
            itv_countdown = setInterval(() => {
                preventStartCountdown = preventStartCountdown-1;
                if (preventStartCountdown < 1) {
                    clearInterval(itv_countdown);
                    document.getElementById("sg2c-btn").remove();
                    document.getElementById("sg2c-msg").innerHTML = 'Started...';
                    start();
                    return;
                }
                if (statusElm) {
                    statusElm.innerText = preventStartCountdown;
                }
            }, 1000);
        }
    }, 1000);
})();