// ==UserScript==
// @name         Append Tracker
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match                 *://rarbg.to/*
// @match                 *://rargb.to/*
// @match                 *://rarbgmirror.org/*
// @match                 *://rarbgmirror.com/*
// @match                 *://rarbgproxy.org/*
// @match                 *://rarbgunblock.com/*
// @match                 *://rarbg.is/*
// @match                 *://rarbgmirror.xyz/*
// @match                 *://rarbg.unblocked.lol/*
// @match                 *://rarbg.unblockall.org/*
// @match                 *://rarbgaccess.org/*
// @match                 *://rarbg2018.org/*
// @match                 *://rarbgtorrents.org/*
// @match                 *://rarbgproxied.org/*
// @match                 *://rarbgget.org/*
// @match                 *://rarbgprx.org/*
// @connect      workers.crazytwo.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/396286/Append%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/396286/Append%20Tracker.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const defaultTrackers = [
        "http://explodie.org:6969/announce",
        "http://h4.trakx.nibba.trade:80/announce",
        "http://mail2.zelenaya.net:80/announce",
        "http://opentracker.i2p.rocks:6969/announce",
        "http://p4p.arenabg.com:1337/announce",
        "http://pow7.com:80/announce",
        "http://retracker.sevstar.net:2710/announce",
        "http://t.acg.rip:6699/announce",
        "http://tracker.acgnx.se:80/announce",
        "http://tracker.bt4g.com:2095/announce",
        "http://tracker.bz:80/announce",
        "http://tracker.gbitt.info:80/announce",
        "http://tracker.gcvchp.com:2710/announce",
        "http://tracker.internetwarriors.net:1337/announce",
        "http://tracker.kamigami.org:2710/announce",
        "http://tracker.lelux.fi:80/announce",
        "http://tracker.nyap2p.com:8080/announce",
        "http://tracker.opentrackr.org:1337/announce",
        "http://tracker.skyts.net:6969/announce",
        "http://tracker.ygsub.com:6969/announce",
        "http://tracker.yoshi210.com:6969/announce",
        "http://tracker.zerobytes.xyz:1337/announce",
        "http://tracker1.itzmx.com:8080/announce",
        "http://tracker2.itzmx.com:6961/announce",
        "http://tracker3.itzmx.com:6961/announce",
        "http://tracker4.itzmx.com:2710/announce",
        "http://trun.tom.ru:80/announce",
        "http://vps02.net.orel.ru:80/announce",
        "http://www.loushao.net:8080/announce",
        "https://tracker.gbitt.info:443/announce",
        "https://tracker.lelux.fi:443/announce",
        "https://tracker.nanoha.org:443/announce",
        "https://tracker.nitrix.me:443/announce",
        "https://tracker.nyaa.tk:443/announce",
        "https://tracker.parrotlinux.org:443/announce",
        "https://tracker.sloppyta.co:443/announce",
        "udp://9.rarbg.me:2710/announce",
        "udp://9.rarbg.to:2710/announce",
        "udp://bt1.archive.org:6969/announce",
        "udp://bt2.54new.com:8080/announce",
        "udp://bt2.archive.org:6969/announce",
        "udp://chihaya.de:6969/announce",
        "udp://chihaya.toss.li:9696/announce",
        "udp://denis.stalker.upeer.me:6969/announce",
        "udp://exodus.desync.com:6969/announce",
        "udp://explodie.org:6969/announce",
        "udp://ipv4.tracker.harry.lu:80/announce",
        "udp://open.demonii.si:1337/announce",
        "udp://open.nyap2p.com:6969/announce",
        "udp://open.stealth.si:80/announce",
        "udp://opentor.org:2710/announce",
        "udp://opentracker.i2p.rocks:6969/announce",
        "udp://p4p.arenabg.com:1337/announce",
        "udp://qg.lorzl.gq:2710/announce",
        "udp://retracker.akado-ural.ru:80/announce",
        "udp://retracker.lanta-net.ru:2710/announce",
        "udp://retracker.netbynet.ru:2710/announce",
        "udp://tr.bangumi.moe:6969/announce",
        "udp://tracker.coppersurfer.tk:6969/announce",
        "udp://tracker.cyberia.is:6969/announce",
        "udp://tracker.dler.org:6969/announce",
        "udp://tracker.ds.is:6969/announce",
        "udp://tracker.filemail.com:6969/announce",
        "udp://tracker.iamhansen.xyz:2000/announce",
        "udp://tracker.internetwarriors.net:1337/announce",
        "udp://tracker.kamigami.org:2710/announce",
        "udp://tracker.leechers-paradise.org:6969/announce",
        "udp://tracker.lelux.fi:6969/announce",
        "udp://tracker.moeking.me:6969/announce",
        "udp://tracker.nyaa.uk:6969/announce",
        "udp://tracker.opentrackr.org:1337/announce",
        "udp://tracker.sbsub.com:2710/announce",
        "udp://tracker.skyts.net:6969/announce",
        "udp://tracker.swateam.org.uk:2710/announce",
        "udp://tracker.tiny-vps.com:6969/announce",
        "udp://tracker.torrent.eu.org:451/announce",
        "udp://tracker.uw0.xyz:6969/announce",
        "udp://tracker.yoshi210.com:6969/announce",
        "udp://tracker.zerobytes.xyz:1337/announce",
        "udp://tracker2.itzmx.com:6961/announce",
        "udp://tracker3.itzmx.com:6961/announce",
        "udp://tracker4.itzmx.com:2710/announce",
        "udp://valakas.rollo.dnsabr.com:2710/announce",
        "udp://www.loushao.net:8080/announce",
        "udp://xxxtor.com:2710/announce",
        "udp://zephir.monocul.us:6969/announce"
    ];

    function hijackClick(target, trackers=defaultTrackers) {
        const result = `${target.href}&tr=${trackers.join('&tr=')}`;

        target.href = result;
        target.innerText = 'click me to copy magnet url';

        target.style = "box-shadow: 0 1px 1px rgba(0,0,0,.33); background-color: #3860bb; color: white; padding: 1rem; display: block; width: 200px; border-radius: 3px; margin: 1rem;text-align: center;";

        target.addEventListener("click", function(event) {
            event.preventDefault();
            const el = document.createElement("textarea");
            el.value = result;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);

            notify('copied!');
        });
    }

    function notify(msg) {
        let msgBalloon = document.querySelector('#msg-balloon');

        if (!msgBalloon) {
            msgBalloon = document.createElement('div');
            msgBalloon.style = `
position: fixed;
top: 0;
right: 0;
width: 200px;
background-color: #3860bb;
color: #efefef;
text-align: center;
padding: 2rem;
font-weight: bold;
`;

            document.body.appendChild(msgBalloon);
        }

        msgBalloon.innerText = msg;
    }

    const delay = ms => new Promise(_ => setTimeout(_, ms));

    const futch = url => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            anonymous: true,
            responseType: 'json',
            onerror: reject,
            ontimeout: reject,
            timeout: 1000,
            onload: ({ response }) => resolve(response)
        })
    });

    Promise.race([
        delay(1000).then(() => Promise.resolve(defaultTrackers)),
        futch('https://workers.crazytwo.com/trackers').then(({ trackers }) => trackers)
    ]).then(trackers => hijackClick(document.querySelector('a[href^="magnet"]'), trackers));
})();
