// ==UserScript==
// @name       YouTube pauser
// @namespace  http://dannywhittaker.com
// @version    0.1
// @description  Pauses youtube videos when they start
// @match      https://www.youtube.com/watch*
// @copyright  2014, You
// @downloadURL https://update.greasyfork.org/scripts/4270/YouTube%20pauser.user.js
// @updateURL https://update.greasyfork.org/scripts/4270/YouTube%20pauser.meta.js
// ==/UserScript==

(function() {
    // Build a worker from an anonymous function body
    var blobURL = URL.createObjectURL(new Blob(['(',

        function() {
            var interval;

            self.addEventListener('message', function(e) {
                switch (e.data) {
                    case 'start':
                        interval = setInterval(function() {
                            self.postMessage('tick');
                        }, 100);
                        break;
                    case 'stop':
                        clearInterval(interval);
                        break;
                };
            }, false);
        }.toString(),

        ')()'
    ], {
        type: 'application/javascript'
    }));
    
    var worker = new Worker(blobURL);

    // Won't be needing this anymore
    URL.revokeObjectURL(blobURL);

    var playerReference;

    var start = new Date().getTime();
    var interval = 50;

    function getPlayerReference() {
        if (!playerReference) {
            playerReference = document.getElementById('movie_player');
        }

        return playerReference;
    }

    function windowIsHidden() {
        return document.hidden;
    }

    function clearInterval() {
        worker.postMessage('stop');
    }

    function fnInterval() {
        if (new Date().getTime() - start > 1000 * 10) {
            clearInterval();
        } else if (!windowIsHidden()) {
            clearInterval();
        } else {
            try {
                var ref = getPlayerReference();
                if (ref && ref.pauseVideo) {
                    ref.pauseVideo();
                }
            } catch (ex) {}
        }
    }

    worker.addEventListener('message', fnInterval);
    worker.postMessage('start');
})();