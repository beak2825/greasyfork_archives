// ==UserScript==
// @name         NTHU ccxp OAuth CAPTCHA Solver
// @namespace    https://t510599.github.io/
// @version      1.3
// @description  Solves CAPTCHA in NTHU ccxp OAuth page (https://oauth.ccxp.nthu.edu.tw/v1.1/authorize.php) in purely frontend.
// @author       t510599
// @match        https://oauth.ccxp.nthu.edu.tw/v1.1/authorize.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.nthu.edu.tw
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.2.0/dist/tf.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.2.0/dist/tf-backend-wasm.min.js
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/457625/NTHU%20ccxp%20OAuth%20CAPTCHA%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/457625/NTHU%20ccxp%20OAuth%20CAPTCHA%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let model;
    let captchaCodeInput = document.querySelector("#captcha_code");
    let captchaRefresh = document.querySelector(`a[title="Refresh Image"]`);
    let captchaImage = document.querySelector("#captcha_image");

    let config = {
        width: 150,
        height: 80,
        model: {
            scheme: "indexeddb",
            type: "graph_model",
            version: "202212072153",
        }
    }
    config.model.path = `${config.model.scheme}://${config.model.type}-${config.model.version}`;

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = config.width;
    canvas.height = config.height;

    function convertImageData(data) {
        return tf.browser.fromPixels(data).divNoNan(255);
    }

    function readImage(el) {
        ctx.drawImage(el, 0, 0);
        return convertImageData(ctx.getImageData(0, 0, config.width, config.height));
    }

    async function decaptcha() {
        try {
            let input = readImage(document.querySelector("#captcha_image")).expandDims();
            let execution = model.execute(input, ["Identity:0", "Identity_1:0", "Identity_2:0", "Identity_3:0"]);
            let prediction = await Promise.all(execution.map(tensor => tensor.argMax(-1).data()));
            let code = prediction.join("");

            captchaCodeInput.value = code;
            captchaCodeInput.setCustomValidity('');
        } catch (e) {
            console.error(e);
        }
    }

    (async () => {
        tf.wasm.setWasmPaths("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.2.0/dist/");
        await tf.setBackend('wasm');

        /*
            The model is converted from https://github.com/justin0u0/NTHU-OAuth-Decaptcha/ (Apache-2.0).
        */

        // check local model cache
        let models = Object.keys(await tf.io.listModels());
        // remove outdated model
        models.filter(n => n != config.model.path).forEach(n => {
            console.log(`Removed model cache: ${n}`);
            tf.io.removeModel(n);
        });

        if (!models.includes(config.model.path)) {
            // load model from cloudflare R2
            console.log(`Downloaded new model: ${config.model.path}`);
            model = await tf.loadGraphModel(`https://pub-9229fa536d004383bd8b307217d4dcd1.r2.dev/graph_model/model.json`);
            model.save(config.model.path);
        } else {
            // load model from local cache
            console.log(`Loaded model from local cache: ${config.model.path}`);
            model = await tf.loadGraphModel(config.model.path);
        }

        // first decaptcha
        await decaptcha();

        // decode new captcha
        captchaImage.addEventListener("load", async (ev) => {
            captchaCodeInput.value = "";
            await decaptcha();
        });

        // reload if pressing "R" while focusing on the CAPTCHA code input
        captchaCodeInput.addEventListener("keypress", async (ev) => {
            if (ev.key != "r") return;

            captchaRefresh.click();
        });
    })();
})();