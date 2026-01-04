// ==UserScript==
// @name         Okay listener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  chimes when someone lands
// @author       You
// @match        https://www.torn.com/profiles.php?XID=*
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/414431/Okay%20listener.user.js
// @updateURL https://update.greasyfork.org/scripts/414431/Okay%20listener.meta.js
// ==/UserScript==

unsafeWindow.isOk = true;

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if(this.readyState == 4 && this.responseURL && this.responseURL.match(/https:\/\/www\.torn\.com\/profiles\.php\?step=getProfileData&XID=.+/g)) {
                if(!this.responseText) return;
                var response = JSON.parse(this.responseText);
                if(!response.userStatus || !response.userStatus.status || !response.userStatus.status.type) return;

                if(response.userStatus.status.type === 'ok' && !unsafeWindow.isOk) {
                    console.log('ok!');
                    unsafeWindow.isOk = true;
                    landed();
                    document.title = "!!!ATTACK!!!";
                }
                if(response.userStatus.status.type !== 'ok') {
                    console.log(response.userStatus.status.type);
                    unsafeWindow.isOk = false;
                }
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

function landed() {
    var trackNotificationSoundClip = "https://www.freesound.org/data/previews/72/72128_1028972-lq.mp3";
    var audio = new Audio(trackNotificationSoundClip);
    audio.play();
}