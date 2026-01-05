// ==UserScript==
// @name        4chan Waifu Randomizer
// @namespace   95.211.209.53-e85f8079-b847-455f-b080-8467e2977711@sanitysama
// @description An elaborate array of waifus
// @match       *://boards.4chan.org/*
// @exclude     *://boards.4chan.org/*/catalog
// @version     1.3
// @require     http://code.jquery.com/jquery-1.11.1.min.js
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/4921/4chan%20Waifu%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/4921/4chan%20Waifu%20Randomizer.meta.js
// ==/UserScript==
$(document).ready(function() { var images = ['http://i.imgur.com/SkxJ0tO.png', 
    'http://i.imgur.com/wRW51xD.png', 
    'http://i.imgur.com/3wu8y4a.png', 
    'http://i.imgur.com/oVmdrnk.png', 
    'http://i.imgur.com/S37f8wx.png',
    'http://i.imgur.com/ELf92mB.png',
    'http://i.imgur.com/4IHvhx1.png',
    'http://i.imgur.com/qrrYJqH.png',
    'http://i.imgur.com/wZOQgmc.png',
    'http://i.imgur.com/ff1ZCIm.png',
    'http://i.imgur.com/KRxIiKD.png',
    'http://i.imgur.com/jdpytke.png',
    'http://i.imgur.com/uIkmxIf.png',
    'http://i.imgur.com/BPFZsl2.png',
    'http://i.imgur.com/Fhlgc9H.png',
    'http://i.imgur.com/4AvYeSx.png',
    'http://i.imgur.com/4Xgrwqo.png',
    'http://i.imgur.com/uX7WmpZ.png',
    'http://i.imgur.com/F1v9J5u.png',
    'http://i.imgur.com/S4EPTEC.png',
    'http://i.imgur.com/TQ9pJmE.png',
    'http://i.imgur.com/kK1ebxB.png',
    'http://i.imgur.com/PQRhly3.png',
    'http://i.imgur.com/nyniJaD.png',
    'http://i.imgur.com/ztv4xy2.png',
    'http://i.imgur.com/B63PjY1.png',
    'http://i.imgur.com/lnE5eUx.png',
    'http://i.imgur.com/OzPFtlK.png',
    'http://i.imgur.com/5BruA9I.png',
    'http://i.imgur.com/lwK48va.png',
    'http://i.imgur.com/9Ibhwyw.png',
    'http://i.imgur.com/lCTkdej.png',
    'http://i.imgur.com/LJLKmNM.png',
    'http://i.imgur.com/Kgak6Nc.png',
    'http://i.imgur.com/5DKw5ov.png',
    'http://i.imgur.com/UfYZN9S.png',
    'http://i.imgur.com/nJwigMc.png',
    'http://i.imgur.com/jAuqX9k.png',
    'http://i.imgur.com/R0jdfph.png',
    'http://i.imgur.com/YiXUqpF.png',
    'http://i.imgur.com/Y4QoVn0.png',
    'http://i.imgur.com/fDJP0iX.png',
    'http://i.imgur.com/Zu4y55I.png',
    'http://i.imgur.com/8PiRurU.png',
    'http://i.imgur.com/r7QaM5a.png',
    'http://i.imgur.com/LeQSpQ8.png',
    'http://i.imgur.com/NU3A5G4.png',
    'http://i.imgur.com/LiKhCiA.png',
    'http://i.imgur.com/BQogoQg.png',
    'http://i.imgur.com/toGjgRV.png',
    'http://i.imgur.com/teD386S.png',
    'http://i.imgur.com/0mUFw3s.png',
    'http://i.imgur.com/NlAvkOy.png',
    'http://i.imgur.com/LxTM74s.png',
    'http://i.imgur.com/ccC3GRF.png',
    'http://i.imgur.com/RvQH3qK.png',
    'http://i.imgur.com/3UmPDNZ.png',
    'http://i.imgur.com/dWwI2YT.png',
    'http://i.imgur.com/N4THFZv.png',
    'http://i.imgur.com/kcU6o3m.png',
    'http://i.imgur.com/Arv3fXq.png',
    'http://i.imgur.com/qF9wMSr.png',
    'http://i.imgur.com/5AViP5n.png',
    'http://i.imgur.com/Nzbiedt.png',
    'http://i.imgur.com/AjeFba6.png',
    'http://i.imgur.com/IgIII8m.png',
    'http://i.imgur.com/cs70fia.png',
    'http://i.imgur.com/sL2WbVH.png',
    'http://i.imgur.com/nJSrnrl.png',
    'http://i.imgur.com/5VIKn5C.png',
    'http://i.imgur.com/er6Cxfh.png',
    'http://i.imgur.com/65Bz289.png',
    'http://i.imgur.com/CQTIuSy.png',
    'http://i.imgur.com/tv1aJo7.png',
    'http://i.imgur.com/sdMt51B.png', //Teto
    'http://i.imgur.com/CXaFyUD.png',
    'http://i.imgur.com/PdPzMFh.png',
    'http://i.imgur.com/UuMrRqX.png',
];

if(document.title != "4chan - 404 Not Found") {
    $('head').append('<style type="text/css">#waifu{background-image:url(' +
        images[Math.floor(Math.random() * images.length)]
        + ');background-repeat:no-repeat;background-size:contain;background-position:right bottom;position:fixed;min-width:1400px;margin-top:100px;top:0;bottom:-20px;right:-20px;opacity:0.5;z-index:-1}');
    $('body').append('<div id="waifu"> </div>');
}
});

