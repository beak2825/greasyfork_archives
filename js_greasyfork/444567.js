// ==UserScript==
// @name         Hide ATS Trolls Comments
// @version      1.1.0
// @author       metalynx
// @include      https://www.abovetopsecret.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/911202
// @description Hide ATS Troll Comments
// @downloadURL https://update.greasyfork.org/scripts/444567/Hide%20ATS%20Trolls%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/444567/Hide%20ATS%20Trolls%20Comments.meta.js
// ==/UserScript==

(function() {

    //Enter the ATS Trolls user names below. Values must be comma separated and enclosed in quotes as shown below.
    const _ATS_TROLLS = ['PatriotGames4u', 'BernnieJGato'];

    try {

        const t = document.querySelectorAll('.threadpost');
        if (t) {
            for (let k = 0; k < t.length; k++) {
                if (t[k].className === "threadpost flexDisplay") {
                    if (t[k].children.length > 1) {
                        if (t[k].children[1].className === 'miniprofile') {
                            if (t[k].children[1].children) {
                                if (_ATS_TROLLS.indexOf(t[k].children[1].children[0].innerText) !== -1) {
                                    let d = document.getElementById(t[k].id);
                                    d.hidden = true;
                                    d.style.visibility = 'hidden';
                                    d.remove();
                                }
                            }
                        }
                    }
                } else {
                    if (t[k].childNodes) {
                        if (t[k].childNodes[1].childNodes) {
                            if (_ATS_TROLLS.indexOf(t[k].childNodes[1].childNodes[1].innerText) !== -1) {
                                t[k].hidden = true;
                            }
                        }
                    }
                }

            }
        }

    } catch(e) {
        console.log('Hide ATS Trolls Comments Error', e);
    }

})();