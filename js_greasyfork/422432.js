// ==UserScript==
// @name         Echo360 Download
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Download single echo360 video
// @author       breakertt
// @match        https://echo360.org.uk/media/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422432/Echo360%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/422432/Echo360%20Download.meta.js
// ==/UserScript==

(function() {
setTimeout(function() {
    const body = document.getElementsByTagName("body")[0];
    const filename = document.getElementsByTagName("title")[0].innerText;

    var regex_url = /(https:\\\/\\\/content.*)s1_av.m3u8/g;
    var url = body.innerHTML.match(regex_url)[0];
    url = url.replace(/\\\//g, '/');
    url = url.replace(/s1_av.*/, 'hd1.mp4');
    url = url.replace(/s0_a.*/, 'hd1.mp4');

    var player_controls_cc = document.getElementById("player-controls-cc");
    var player_controls = player_controls_cc.parentElement;
    var newButton = `<a  id="player-controls-download" href="tracks/CFKZ.mp3" download="tracks/CFKZ.mp3" style=""><button aria-pressed="false" data-test-id="toggle-show-transcript" type="button" data-test-component="Button" class="sc-cugefK hYWkDV sc-iwsKbI bgBVbH sc-htpNat kvKcMV"><svg class="sc-bZQynM lnqVmQ" data-test-name="transcript" data-test-component="Icon" viewBox="0 0 24 22" role="img"><path fill="white" d="M15.608,6.262h-2.338v0.935h2.338c0.516,0,0.934,0.418,0.934,0.935v8.879c0,0.517-0.418,0.935-0.934,0.935H4.392c-0.516,0-0.935-0.418-0.935-0.935V8.131c0-0.516,0.419-0.935,0.935-0.935h2.336V6.262H4.392c-1.032,0-1.869,0.837-1.869,1.869v8.879c0,1.031,0.837,1.869,1.869,1.869h11.216c1.031,0,1.869-0.838,1.869-1.869V8.131C17.478,7.099,16.64,6.262,15.608,6.262z M9.513,11.973c0.017,0.082,0.047,0.162,0.109,0.226c0.104,0.106,0.243,0.143,0.378,0.126c0.135,0.017,0.274-0.02,0.377-0.126c0.064-0.065,0.097-0.147,0.115-0.231l1.708-1.751c0.178-0.183,0.178-0.479,0-0.662c-0.178-0.182-0.467-0.182-0.645,0l-1.101,1.129V1.588c0-0.258-0.204-0.467-0.456-0.467c-0.252,0-0.456,0.209-0.456,0.467v9.094L8.443,9.553c-0.178-0.182-0.467-0.182-0.645,0c-0.178,0.184-0.178,0.479,0,0.662L9.513,11.973z"></path></svg><span class="sc-gzVnrw cTGEaO">Download</span></button></a>`
    player_controls.innerHTML = newButton + player_controls.innerHTML;
    var player_controls_download = document.getElementById("player-controls-download");

    player_controls_download.href = url;
    player_controls_download.download = filename;
}, 3000);
})();