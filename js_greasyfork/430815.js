// ==UserScript==
// @name         Popcat
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Spam popcat, slowed down to avoid 30 sec over 800 clicks limit
// @author       PoH98
// @match        https://popcat.click
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430815/Popcat.user.js
// @updateURL https://update.greasyfork.org/scripts/430815/Popcat.meta.js
// ==/UserScript==

(function () {
  'use strict';
  Howler.volume(0);
  var total = 0;
  var vue = null;
  var token;
  var script = document.createElement('script');
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
    document.head.appendChild(script);
  function auto() {
    vue = document.getElementById('app').__vue__;
    vue.open = true;
    setTimeout(() => { vue.open = false; }, 25);
    clearInterval(vue.sendStats);
    document.removeEventListener('pointerdown', vue.op);
    document.removeEventListener('keydown', vue.op);

      try{
         fetch(`https://stats.popcat.click/pop?pop_count=800&captcha_token=${makeid(10)}&token=${genRequest()}`,{
          method: 'POST'
         }).then((response) => {
          return response.json();
        }).then((json) => {
          token = json.Token;
          vue.counter = total + 800;
          total += 800;
          setTimeout(auto, 30000);
        }).catch(() => {
          setTimeout(auto,3000);
        })
      }
    catch(err){
       setTimeout(auto,3000);
    }

  }
  setTimeout(auto, 2000);
})();

function genRequest(){
var header = {
  "alg": "HS256",
  "typ": "JWT"
};

var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
var encodedHeader = base64url(stringifiedHeader);
var ip = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
console.log(ip)
var data = {
  "CountryCode": "MY",
  "CountryName": "Malaysia",
  "IP": ip,
  "ID": Math.random(),
  "exp": parseInt(Date.now()) + 10000
};

var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
var encodedData = base64url(stringifiedData);

var token = encodedHeader + "." + encodedData;
    return token;
}
function base64url(source) {
  // Encode in classical base64
  let encodedSource = CryptoJS.enc.Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');

  return encodedSource;
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}