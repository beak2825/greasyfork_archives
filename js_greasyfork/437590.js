// ==UserScript==
// @name         RM labeller
// @version      0.0.4
// @description  ML based riddle master answering bot. Help novice to answer pony problem when encounter riddle master challenge.
// @homepage     https://rdma.ooguy.com
// @include      http*://hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/*
// @connect      rdma.ooguy.com
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM.notification
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// @namespace https://greasyfork.org/users/756324
// @downloadURL https://update.greasyfork.org/scripts/437590/RM%20labeller.user.js
// @updateURL https://update.greasyfork.org/scripts/437590/RM%20labeller.meta.js
// ==/UserScript==
var GM_notification = GM_notification || GM.notification;
//You can specify these two parameter in local storage.
/*var extend_submit_interval = 5;//delay time for extand waiting when dom has focused at "expecting submit time"*/


if (document.getElementById('riddlecounter')) {
    var image_url = document.getElementById('riddleimage').childNodes[0].src; // riddlebot
    window.addEventListener('load', function(event) { //need to wait for riddlebot to complete download
        var xhr = new Request(image_url, {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'only-if-cached',
            mode: 'same-origin'
        });
        fetch(xhr).then(response => {
            if (response.status === 200) {
                return response.blob();
            }
            else {
                //throw new Error('Cache not usable');
                console.warn('[RMA]WARNING: Can not use cache');
                GM_notification('INFO: Can not use cache', 'Riddle Master Assistant', 'https://webrdm.herokuapp.com/favicon.ico');
                var xhr_nocache = new Request(image_url, {
                    method: 'GET',
                    credentials: 'same-origin',
                    cache: 'force-cache',
                    mode: 'same-origin'
                });
                fetch(xhr_nocache).then(response_nocache => {
                    if (response_nocache.status === 200) {
                        return response_nocache.blob();
                    }
                    else {
                        console.error('[RMA]ERROR: Cannot get riddlebot');
                        //alert('[RMA]ERROR: Cannot get riddlebot');
                        throw new Error('Cannot get riddlebot');
                    }
                });
            }
        }).then(imgData => {
            GM.xmlHttpRequest({
                method: 'POST',
                timeout: 15000,
                url: 'https://rdma.ooguy.com/desv2',
                onload: function(response) {
                    console.log('Image sent. Server: ' + response.responseText)
                },
                onerror: function() {
                    GM_notification('ERROR: Send request error', 'Riddle Master Assistant', 'https://webrdm.herokuapp.com/favicon.ico');
                    console.error('[RMA]ERROR: Send request error');
                },
                ontimeout: function() {
                    GM_notification('TIMEOUT: Server not respond', 'Riddle Master Assistant', 'https://webrdm.herokuapp.com/favicon.ico');
                    console.error('[RMA]TIMEOUT: Server does not respond');
                },
                binary: true,
                data: imgData,
                headers: {
                    'Content-Type': 'image/jpeg'
                }
            });
        });
    });
    var submit = document.getElementById('riddlesubmit')
    var form = document.getElementById('riddleform')
    submit.addEventListener('click', event => {
        var answer = new FormData(form)
        GM.xmlHttpRequest({
            method: 'POST',
            timeout: 15000,
            url: 'https://rdma.ooguy.com/ansv',
            onload: function(response) {
                console.log('Answer sent. Server: ' + response.responseText)
            },
            onerror: function() {
                GM_notification('ERROR: Send request error', 'Riddle Master Assistant', 'https://webrdm.herokuapp.com/favicon.ico');
                console.error('[RMA]ERROR: Send request error');
            },
            ontimeout: function() {
                GM_notification('TIMEOUT: Server not respond', 'Riddle Master Assistant', 'https://webrdm.herokuapp.com/favicon.ico');
                console.error('[RMA]TIMEOUT: Server does not respond');
            },
            data: answer
        })
    })
}