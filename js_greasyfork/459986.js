// ==UserScript==
// @name        automatic_insert_totp_code
// @namespace   Violentmonkey Scripts
// @match       https://access.ynu.edu.cn/shterm/login?tokenRequest
// @grant       none
// @version     0.2.2
// @author      liudonghua123
// @license     MIT
// @description 10/19/2021, 3:22:51 PM
// @downloadURL https://update.greasyfork.org/scripts/459986/automatic_insert_totp_code.user.js
// @updateURL https://update.greasyfork.org/scripts/459986/automatic_insert_totp_code.meta.js
// ==/UserScript==

// https://stackoverflow.com/questions/5132488/how-can-i-insert-a-script-into-html-head-dynamically-using-javascript

const dynamicAddScript = (url) => {
    return new Promise(function(resolve, reject){
      const script = document.createElement('script');
      script.onload = resolve;
      script.onerror = reject;
      script.src = url;
      document.head.appendChild(script);
    });
}

function sleep(time){
   return new Promise(function(resolve){
     setTimeout(resolve, time);
   });
}

// https://github.com/yeojz/otplib
//dynamicAddScript('https://unpkg.com/@otplib/preset-browser@^12.0.0/buffer.js');
//dynamicAddScript('https://unpkg.com/@otplib/preset-browser@^12.0.0/index.js');
//window.otplib.totp.generate('EXGVVAJJ4SI2AEEX')
//
// https://github.com/LanceGin/jsotp
// no browser support ?

// const totp_secret = 'REPLACE_YOUR_TOTP_SECRET_HERE'
// Execute the following js code to config the totp secret
// localStorage.secret = 'REPLACE_YOUR_TOTP_SECRET_HERE'

(async function process(secret) {
  // https://github.com/hectorm/otpauth
  // 
  // ERR_CONNECTION_RESET
  // await dynamicAddScript('https://cdn.jsdelivr.net/npm/otpauth/dist/otpauth.umd.min.js');
  // 
  // https://unpkg.com/
  // You may also use a semver range or a tag instead of a fixed version number, or omit the version/tag entirely to use the latest tag.
  // await dynamicAddScript('https://unpkg.com/otpauth/dist/otpauth.umd.min.js');
  await dynamicAddScript('https://cdnjs.cloudflare.com/ajax/libs/otpauth/9.2.1/otpauth.umd.min.js');
  // await sleep(1000);
  const totp = new OTPAuth.TOTP({
      // issuer: 'access.ynu.edu.cn',
      // label: 'access.ynu.edu.cn',
      // algorithm: 'SHA1',
      // digits: 6,
      // period: 30,
      secret, // or "OTPAuth.Secret.fromBase32('NB2W45DFOIZA')"
  });
  // Generate a token.
  let token = totp.generate();
  console.info(`totp.generate code ${token}`);
  document.querySelector('#loginDiv > div > section.login_dynamic_code_wrap > form > div.form-group.form-control.dynamic_code > input[type=password]').value = token;
})(localStorage.secret);
