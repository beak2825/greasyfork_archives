// ==UserScript==
// @name        Twitter Media Puller
// @namespace   https://greasyfork.org/en/users/306263-one-hit
// @description spits out potential media for single twitter posts.
// @include     https://twitter.com*/status/*
// @version     1.0.0
// @downloadURL https://update.greasyfork.org/scripts/384001/Twitter%20Media%20Puller.user.js
// @updateURL https://update.greasyfork.org/scripts/384001/Twitter%20Media%20Puller.meta.js
// ==/UserScript==

try {

    let twitterId = document.location.href.split('/').pop().split('?').shift();

    let twitterRegex = new RegExp(twitterId+'\.json$', 'i');

    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if(this.readyState === 4){
                    if(this.responseURL.match(twitterRegex)){
                        let video_data = JSON.parse(this.responseText);
                        console.log(video_data);
                        if(video_data.track && video_data.track.playbackUrl){
                            console.log('source found');
                            console.log(video_data.track.playbackUrl);
                        }
                    }
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

} catch (err) {
    alert(err.toString());
}