 // ==UserScript==
// @name         LocalIpOverlay
// @namespace    *
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        htt*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376210/LocalIpOverlay.user.js
// @updateURL https://update.greasyfork.org/scripts/376210/LocalIpOverlay.meta.js
// ==/UserScript==

 (function () {
         'use strict';

        function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
            //compatibility for firefox and chrome
            var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            var pc = new myPeerConnection({
                iceServers: []
            }),
                noop = function () { },
                localIPs = {},
                ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                key;

            function iterateIP(ip) {
                if (!localIPs[ip]) onNewIP(ip);
                localIPs[ip] = true;
            }

            //create a bogus data channel
            pc.createDataChannel("");

            // create offer and set local description
            pc.createOffer().then(function (sdp) {
                sdp.sdp.split('\n').forEach(function (line) {
                    if (line.indexOf('candidate') < 0) return;
                    line.match(ipRegex).forEach(iterateIP);
                });

                pc.setLocalDescription(sdp, noop, noop);
            }).catch(function (reason) {
                // An error occurred, so handle the failure to connect
            });

            //listen for candidate events
            pc.onicecandidate = function (ice) {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
                ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
            };
        }
        getUserIP(function (ip) {
            var overlay = document.createElement("div");
            overlay.classList.add("local-ip");
            overlay.style.position = "fixed";
            overlay.style.bottom = 0;
            overlay.style.right = 0;
            overlay.style.backgroundColor = "black";
            overlay.style.color = "white";
            overlay.style.fontSize = "20px";
            overlay.style.padding = "10px";
            overlay.style.zIndex = "99999999";
            overlay.style.fontWeight = "bold";
            var dom = ip;
            overlay.innerHTML = dom;
            document.body.append(overlay);
        });
    })();