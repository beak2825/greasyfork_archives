// ==UserScript==
// @name         WebRTC IP Tracker
// @namespace    https://shitchell.com/
// @version      0.2
// @description  alerts whenever a WebRTC connection is made and shows its info in the js console
// @author       Shaun Mitchel <shaun@shitchell.com>
// @license      wtfpl
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435913/WebRTC%20IP%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/435913/WebRTC%20IP%20Tracker.meta.js
// ==/UserScript==

var hasAlerted = false;

window.oRTCPeerConnection =
    window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
    const pc = new window.oRTCPeerConnection(...args);

    pc.oaddIceCandidate = pc.addIceCandidate;

    pc.addIceCandidate = function (iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(" ");

        console.log(iceCandidate.candidate);
        const ip = fields[4];
        if (fields[7] === "srflx") {
            getLocation(ip);
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest);
    };
    return pc;
};

let getLocation = async (ip) => {
    let url = `https://ipwhois.app/json/${ip}`;
    console.log("...fetching", url);

    await fetch(url, {referrer: ""}).then((response) =>
                                          response.json().then((json) => {
        let header = `- ${ip} `.padEnd(20, "-");
        let localTime = (new Date()).toLocaleString([], {timeZone: json.timezone})
        let output = `
          ${header}
          Country:  ${json.country}
          Region:   ${json.region}
          City:     ${json.city}
          Coords:   (${json.latitude}, ${json.longitude})
          Timezone: ${json.timezone} (${json.timezone_gmt})
          Time:     ${localTime}
          ISP:      ${json.isp}
          --------------------
          `
        console.log(output);
        if (!hasAlerted) {
            alert(`[WebRTC:${ip}] see console for details`);
            hasAlerted = true;
        }
    })
  );
}