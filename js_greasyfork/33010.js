// ==UserScript==
// @name         disableCaptchaSatCfdi
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Desabilitar el codigo captcha del portal del SAT!
// @author       Luis Cervantes
// @include      https://verificacfdi.facturaelectronica.sat.gob.mx/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33010/disableCaptchaSatCfdi.user.js
// @updateURL https://update.greasyfork.org/scripts/33010/disableCaptchaSatCfdi.meta.js
// ==/UserScript==

(function() {
  var captha = document.getElementById("ctl00_MainContent_ImgCaptcha");
  var key = document.getElementById("__VIEWSTATE");
  var numbers = document.getElementById("ctl00_MainContent_TxtCaptchaNumbers");
  captha.srcset = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrbPlOApZHXkYy6tOaQurTYwxIqZw-9vBi4n10wfKqPsGPrHWceg";
  captha.width = 140;
  key.value = "y2IIj/V7u0XWt4Y7BD1IERIQGAuhHWCI9BkN4UV1jc5G3SrF9ijHfcNOXxTwWKg/C9fFBH9eGqhNZ6QK1k9kCNCbsX0a92zZ8SkOAP87cRJbTvUfzdXzyr3n38zT4n4hEqufif/keGfjY9e260AFebtFzTHjIOFjE8Gdvg7TkxpyQ8swYd8Y+vVgv0yuv70RZndJYW7RQHqkEb2RVqvsrXTzO2VUgIrihJlWMc0Wf8qeW8RpndQ84H9MEnECb2M3PBglnbM1xFouNlhek3RFrwwqDqNu+72GCWqUjVGdY6zaPcCRuhKl89uLEkHQ8v3NKqfJRA==";
  numbers.value = "2413";
  numbers.disabled = true;
})();