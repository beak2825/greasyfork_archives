// ==UserScript==
// @name         Flight method detector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/profiles.php?XID=*
// @downloadURL https://update.greasyfork.org/scripts/414430/Flight%20method%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/414430/Flight%20method%20detector.meta.js
// ==/UserScript==

unsafeWindow.flightTypeHidden = true;

// todo factorise code

$(document).ready(initialise)

function initialise() {

    const load = setInterval(function() {
        if(document.getElementsByClassName('empty-block').length) {
            const space = document.getElementsByClassName('empty-block')[0];
            const div = document.createElement("div");
            div.id = "flight-type";
            div.innerHTML = "test";
            div.style.display = "none";
            div.style.paddingTop = "14px";
            div.style.paddingLeft = "10px";
            space.appendChild(div);


            // to do on initial load
            if(document.getElementsByClassName('profile-status')) {
                const status = document.getElementsByClassName('profile-status')[0];
                if(status.className.indexOf('travelling') !== -1) {
                    if(status.className.indexOf('airstrip') !== -1) {
                        div.innerHTML = '<h2><span style="font-size:24px;">Airstrip</span></h2>';
                    } else if(status.className.indexOf('private') !== -1) {
                        div.innerHTML = '<h2><span style="font-size:24px;">WLT</span></h2>';
                    } else {
                        div.innerHTML = '<h2><span style="font-size:24px;">Standard or BCT</span></h2>';
                    }
                    div.style.display = 'block';
                }
            }


            clearInterval(load);
        }
    }, 100);
}


// to listen to future changes
(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if(this.readyState == 4 && this.responseURL && this.responseURL.match(/https:\/\/www\.torn\.com\/profiles\.php\?step=getProfileData&XID=.+/g)) {
                if(!this.responseText) return;
                var response = JSON.parse(this.responseText);
                if(!response.userStatus || !response.userStatus.status) return;

                unsafeWindow.flightTypeHidden = !response.userStatus.status.flightType;
                const x = document.getElementById('flight-type');

                if(response.userStatus.status.flightType === 'airstrip') {
                    x.innerHTML = '<h2><span style="font-size:24px;">Airstrip</span></h2>';
                }

                if(response.userStatus.status.flightType === 'private') {
                    x.innerHTML = '<h2><span style="font-size:24px;">WLT</span></h2>';
                }

                if(response.userStatus.status.flightType === '') {
                    x.innerHTML = '<h2><span style="font-size:24px;">Standard or BCT</span></h2>';
                }

                if(!unsafeWindow.flightTypeHidden) {
                    x.style.display = "block";
                }
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);