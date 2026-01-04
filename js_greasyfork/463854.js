// ==UserScript==
// @name         MIXFAUCET Auto Claim
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Claim free crypto instant faucetpay payout
// @author       Alkoot
// @match        https://mixfaucet.com/*
// @license      Alkoot
// @antifeature  referral-links
// @downloadURL https://update.greasyfork.org/scripts/463854/MIXFAUCET%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/463854/MIXFAUCET%20Auto%20Claim.meta.js
// ==/UserScript==

// DESCRIPTION
// You will need to install a recaptcha solver link https://greasyfork.org/en/scripts/439683-all-popups-blocker-and-recaptcha-solver
// ABLinks download link: https://pastebin.com/5kJfFcn6

// EDIT lines from 22 to 29 and go to https://mixfaucet.com/bitcoin?r=1KtBcKFTPPrRQkrRfpAD2wga6YxmVe1Tca
// let it run

(function() {
    'use strict';

    var addressbtc = "1KtBcKFTPPrRQkrRfpAD2wga6YxmVe1Tca" //EXAMPLE Put your BTC faucetpay address between ""
    var addressltc = "MW3J92suqJgndHC7y3vq6oFi6U4L6bHVFg" //EXAMPLE Put your LTC faucetpay address between ""
    var addresseth = "0xD4392e3c3d4bC029B3d8697BF370020E1F360C60" //EXAMPLE Put your ETH faucetpay address between ""
   var addressdoge = "DGMyGToY4VXXKcnyVsSJ66vBCWU2gKaVTd" //EXAMPLE Put your DOGE faucetpay address between ""
    var addresstrx = "TQLbpM8twXBFGqVDLBKYwoHpdzhPMtQC3f" //EXAMPLE Put your TRX faucetpay address between ""
    var addressbnb = "0x7D871752a821A49D2428e4989580d1bB0C6e2473" //EXAMPLE Put your BNB faucetpay address between ""
    var addresszec = "t1QDRUfsfkBgjyU2oCPT31F4FSjkm3uPgwa" //EXAMPLE Put your ZEC faucetpay address between ""
    var addresssol = "8ekL8uKp5fyjdnwv3XtmhskTuLZh2pKWoL2ewsQHfJHy" //EXAMPLE Put your SOL faucetpay address between ""




    setInterval(function() {
        if (window.location.href == "https://mixfaucet.com/") {
            window.location.href = "https://mixfaucet.com/bitcoin/";
        }
    }, 5000);


    setInterval(function() {
        if ((document.querySelector("input[type='text']")) && (window.location.href.includes("bitcoin"))) {
            document.querySelector("input[type='text']").value = addressbtc;
        }
    }, 4000);

        setInterval(function() {
        if ((document.querySelector("input[type='text']")) && (window.location.href.includes("ethereum"))) {
            document.querySelector("input[type='text']").value = addresseth;
        }
    }, 4000);

        setInterval(function() {
        if ((document.querySelector("input[type='text']")) && (window.location.href.includes("litecoin"))) {
            document.querySelector("input[type='text']").value = addressltc;
        }
    }, 4000);

            setInterval(function() {
        if ((document.querySelector("input[type='text']")) && (window.location.href.includes("dogecoin"))) {
            document.querySelector("input[type='text']").value = addressdoge;
        }
    }, 4000);

                setInterval(function() {
        if ((document.querySelector("input[type='text']")) && (window.location.href.includes("tron"))) {
            document.querySelector("input[type='text']").value = addresstrx;
        }
    }, 4000);

                    setInterval(function() {
        if ((document.querySelector("input[type='text']")) && (window.location.href.includes("binance"))) {
            document.querySelector("input[type='text']").value = addressbnb;
        }
    }, 4000);

                    setInterval(function() {
        if ((document.querySelector("input[type='text']")) && (window.location.href.includes("zcash"))) {
            document.querySelector("input[type='text']").value = addresszec;
        }
    }, 4000);

                setInterval(function() {
        if ((document.querySelector("input[type='text']")) && (window.location.href.includes("solana"))) {
            document.querySelector("input[type='text']").value = addresssol;
        }
    }, 4000);



        setTimeout(function() {

        let botonclaim = document.querySelector("input[type='submit']")
document.getElementsByClassName("btn btn-block btn-primary my-2")[0].click();
}, 5000); // CLICK LOGIN BUTTON


        setInterval(function() {
        let ABLinks = document.querySelector("#antibotlinks_reset")
        let botonclaim = document.querySelector("input[type='submit']")
        if ((ABLinks && ABLinks.style.display == "")
                && (window.grecaptcha.getResponse().length > 0)) {
                    botonclaim.click();
}}, 2000); // CLAIM IF ABLINKS AND RECAPTCHA SOLVED


setInterval(function() {
        let ABLinks = document.querySelector("#antibotlinks_reset")
        if (ABLinks && ABLinks.style.display !== "") {
           window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }
}, 60000); // REFRESH IF ABLINKS GET LOCKED




            setInterval(function() {
        let success = document.getElementsByClassName("alert alert-success")[0]
        if ((success && success.textContent.includes("was sent")) && (window.location.href.includes("bitcoin"))) {
            window.location.replace(urlltc);
        }}, 3000)

            setInterval(function() {
        let success = document.getElementsByClassName("alert alert-success")[0]
        if ((success && success.textContent.includes("was sent")) && (window.location.href.includes("litecoin"))) {
            window.location.replace(urleth);
        }}, 3000)

            setInterval(function() {
        let success = document.getElementsByClassName("alert alert-success")[0]
        if ((success && success.textContent.includes("was sent")) && (window.location.href.includes("ethereum"))) {
            window.location.replace(urldoge);
        }}, 3000)

            setInterval(function() {
        let success = document.getElementsByClassName("alert alert-success")[0]
        if ((success && success.textContent.includes("was sent")) && (window.location.href.includes("dogecoin"))) {
            window.location.replace(urltrx);
        }}, 3000)

            setInterval(function() {
        let success = document.getElementsByClassName("alert alert-success")[0]
        if ((success && success.textContent.includes("was sent")) && (window.location.href.includes("tron"))) {
            window.location.replace(urlbnb);
        }}, 3000)

            setInterval(function() {
        let success = document.getElementsByClassName("alert alert-success")[0]
        if ((success && success.textContent.includes("was sent")) && (window.location.href.includes("binance"))) {
            window.location.replace(urlzec);
        }}, 3000)

            setInterval(function() {
        let success = document.getElementsByClassName("alert alert-success")[0]
        if ((success && success.textContent.includes("was sent")) && (window.location.href.includes("zcash"))) {
            window.location.replace(urlsol);
        }}, 3000)

            setInterval(function() {
        let success = document.getElementsByClassName("alert alert-success")[0]
        if ((success && success.textContent.includes("was sent")) && (window.location.href.includes("solana"))) {
            window.location.replace(urlbtc);
        }}, 3000)




        setInterval(function() {

        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.innerText.includes("Antibotlinks"))
        || (error && error.innerText.includes("Session invalid"))) {
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }}, 1500);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.outerText.includes("come back") || error && error.outerText.includes("funds") || error && error.outerText.includes("Unknown"))
           && (window.location.href.includes("bitcoin"))) {
            window.location.replace(urlltc);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.outerText.includes("come back") || error && error.outerText.includes("funds"))
           && (window.location.href.includes("litecoin"))) {
            window.location.replace(urleth);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.outerText.includes("come back") || error && error.outerText.includes("funds"))
           && (window.location.href.includes("ethereum"))) {
            window.location.replace(urldoge);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.outerText.includes("come back") || error && error.outerText.includes("funds"))
           && (window.location.href.includes("dogecoin"))) {
            window.location.replace(urltrx);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.outerText.includes("come back") || error && error.outerText.includes("funds"))
           && (window.location.href.includes("tron"))) {
            window.location.replace(urlbnb);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.outerText.includes("come back") || error && error.outerText.includes("funds"))
           && (window.location.href.includes("binance"))) {
            window.location.replace(urlzec);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.outerText.includes("come back") || error && error.outerText.includes("funds"))
           && (window.location.href.includes("zcash"))) {
            window.location.replace(urlsol);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if ((error && error.outerText.includes("come back") || error && error.outerText.includes("funds"))
           && (window.location.href.includes("solana"))) {
            window.location.replace(urlbtc);
        }
    }, 3000);


    var urlbtc = "https://mixfaucet.com/bitcoin?r=1KtBcKFTPPrRQkrRfpAD2wga6YxmVe1Tca"
    var urlltc = "https://mixfaucet.com/litecoin?r=MW3J92suqJgndHC7y3vq6oFi6U4L6bHVFg"
    var urleth = "https://mixfaucet.com/ethereum?r=0xD4392e3c3d4bC029B3d8697BF370020E1F360C60"
    var urldoge = "https://mixfaucet.com/dogecoin?r=DGMyGToY4VXXKcnyVsSJ66vBCWU2gKaVTd"
    var urltrx = "https://mixfaucet.com/tron?r=TQLbpM8twXBFGqVDLBKYwoHpdzhPMtQC3f"
    var urlbnb = "https://mixfaucet.com/binance?r=0x45195c751fc1a8341c4fF867830053Dbf5b2d7C9"
    var urlzec = "https://mixfaucet.com/zcash?r=0x7D871752a821A49D2428e4989580d1bB0C6e2473"
    var urlsol = "https://mixfaucet.com/solana?r=8ekL8uKp5fyjdnwv3XtmhskTuLZh2pKWoL2ewsQHfJHy"


            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if (error && error.outerText.includes("wait")
           && (window.location.href.includes("bitcoin"))) {
            window.location.replace(urlltc);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if (error && error.outerText.includes("wait")
           && (window.location.href.includes("litecoin"))) {
            window.location.replace(urleth);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if (error && error.outerText.includes("wait")
           && (window.location.href.includes("ethereum"))) {
            window.location.replace(urldoge);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if (error && error.outerText.includes("wait")
           && (window.location.href.includes("dogecoin"))) {
            window.location.replace(urltrx);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if (error && error.outerText.includes("wait")
           && (window.location.href.includes("tron"))) {
            window.location.replace(urlbnb);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if (error && error.outerText.includes("wait")
           && (window.location.href.includes("binance"))) {
            window.location.replace(urlzec);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if (error && error.outerText.includes("wait")
           && (window.location.href.includes("zcash"))) {
            window.location.replace(urlsol);
        }
    }, 3000);

            setInterval(function() {
        let error = document.getElementsByClassName('alert alert-danger fade show')[0]
        if (error && error.outerText.includes("wait")
           && (window.location.href.includes("solana"))) {
            window.location.replace(urlbtc);
        }
    }, 3000);


        setInterval(function() {
        if (window.location.href.includes("bitcoin")
        || window.location.href.includes("litecoin")
        || window.location.href.includes("ethereum")
        || window.location.href.includes("zcash")
        || window.location.href.includes("solana")
        || window.location.href.includes("dogecoin")
        || window.location.href.includes("tron")
        || window.location.href.includes("binance")) {
           window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }
    }, 120000);


})();