// ==UserScript==
// @name         Fuck ReCaptcha
// @namespace    http://www.nextgenupdate.com/forums/members/155496-sloth.html
// @version      1.1
// @description  Reveal Captcha Token for Complete ReCaptchas!
// @author       Sloth - NGU
// @match      *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38215/Fuck%20ReCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/38215/Fuck%20ReCaptcha.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reCapTimer = setInterval(fuckReCaptcha, 1000);
})();
function fuckReCaptcha() {
       if(document.getElementsByClassName('g-recaptcha').length > 0) {
           if(document.getElementById('fuckReCaptchaButton') === null) {
               var head  = document.getElementsByTagName('head')[0];
               var link  = document.createElement('link');
               link.id   = 'bootstrapcss';
               link.rel  = 'stylesheet';
               link.type = 'text/css';
               link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css';
               link.media = 'all';
               head.appendChild(link);
               var button = document.createElement('input');
               button.value = 'Reload ReCaptcha (To get new token)';
               button.id = 'fuckReCaptchaButton';
               button.style = 'width: 304px;';
               button.onclick = 'reloadReCaptcha()';
               document.getElementsByClassName('g-recaptcha')[0].prepend(button);
               document.getElementById('fuckReCaptchaButton').classList.add('btn');
               document.getElementById('fuckReCaptchaButton').classList.add('btn-danger');
               button.addEventListener('click', reloadReCaptcha);
           }
           document.getElementById('g-recaptcha-response').style.display = '';
           document.getElementById('g-recaptcha-response').style.height = '100px';
           document.getElementById('g-recaptcha-response').style.position = 'absolute';
   }
}
function reloadReCaptcha() {
    document.getElementById('g-recaptcha-response').value = '';
    if(document.getElementsByClassName('g-recaptcha').length > 0) {
        document.getElementsByClassName('g-recaptcha')[0].getElementsByTagName('iframe')[0].src = document.getElementsByClassName('g-recaptcha')[0].getElementsByTagName('iframe')[0].src;
    }
    return false;
}