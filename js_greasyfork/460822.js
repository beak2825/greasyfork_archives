// ==UserScript==
// @name         faucetparty : Auto Faucet - 0.000035 USDT every 10 Minutes (DOWN)
// @namespace    Auto Claim USDT
// @version      1.5
// @description  https://faucetparty.unclecommon.com/usdt/?r=1984 
// @author       stealtosvra
// @match        https://faucetparty.unclecommon.com/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTeWWgvhl6dHfpaBrjpYRCGFDQKfqACxjXEiFql71RPdMHhcnOIyoixL2GSjP7K9LR_MU&usqp=CAU
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460822/faucetparty%20%3A%20Auto%20Faucet%20-%200000035%20USDT%20every%2010%20Minutes%20%28DOWN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460822/faucetparty%20%3A%20Auto%20Faucet%20-%200000035%20USDT%20every%2010%20Minutes%20%28DOWN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.alert = (msg) => console.log(msg);

(function() {
  const original = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(event, listener, ...rest) {
    const hooked = (event) => {
      const proxy = new Proxy(event, {
         get(target, name) {
             if (name === 'isTrusted') {
                 return true;
             }
             if (typeof target[name] === "function") {
                 return target[name].bind(target);
             }
             return target[name];
         }
      });
      listener(proxy);
    };
    original.call(this, event, hooked, ...rest);
  }
})();


    function hCaptcha() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;}

    let oneMinWait = false;
    setTimeout(() => { oneMinWait = true; }, 600000);

    setInterval(function() {
        if (!oneMinWait) {
            return;
        }
        if (hCaptcha()){
            document.querySelector(".btn.btn-primary.btn-block").click();
        }
    }, 5000);

    function tempBox(options, n){
     return new Promise(async (resolve, reject) => {
          const slave = new BrowserWindow({width: 1, height: 1, show: false});
          var resolved = false;
          const btn = dialog.showMessageBox(slave, options).then((index) => {
               resolved = true;
               resolve(index);
          }).catch(() => {});
          await new Promise((res) => setTimeout(res, n));
          slave.close();
          if (!resolved) reject();
     });
}

})();