// ==UserScript==
// @name         Grundo's Cafe - Neomail Addict
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Render standard Neoboards smilies in Neomail interface.
// @author       baileyb (GC user bailey)
// @match        http*://www.grundos.cafe/neomessages/replymessage/*
// @match        http*://grundos.cafe/neomessages/replymessage/*
// @match        http*://www.grundos.cafe/neomessages/sendmessage/*
// @match        http*://grundos.cafe/neomessages/sendmessage/*
// @match        http*://www.grundos.cafe/neomessages/viewmessage/*
// @match        http*://grundos.cafe/neomessages/viewmessage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465543/Grundo%27s%20Cafe%20-%20Neomail%20Addict.user.js
// @updateURL https://update.greasyfork.org/scripts/465543/Grundo%27s%20Cafe%20-%20Neomail%20Addict.meta.js
// ==/UserScript==

/**
 * Build image tag.
 * @param {String} src
 * @returns {String}
 */
function buildImage(src) {
    return `<img src="${src}">`
}

const messages = document.querySelectorAll('.message_old > p, .message_write > p');

const smilies = {
    ':)': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/smiley.gif',
    ':(': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/sad.gif',
    ':K': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/vampire.gif',
    'B)': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/sunglasses.gif',
    ':o': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/oh.gif',
    ':P': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/tongue.gif',
    ';)': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/winking.gif',
    ':*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/kisskiss.gif',
    ':D': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/grin.gif',
    '0:-)': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/angel.gif',
    '*clap*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/clap.gif',
    '*cough*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/cough.gif',
    '*angry*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/angry.gif',
    '*complain*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/complain.gif',
    '*moneybag*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/moneybag.gif',
    '*star*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/star.gif',
    '*yarr*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/yarr.gif',
    '*carrot*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/carrot.gif',
    '*codestone*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/codestone.gif',
    '*dubloon*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/dubloon.gif',
    '*coltzan*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/coltzan.gif',
    '*feepit*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/feepit.gif',
    '*facepalm*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/facepalm.gif',
    '*weewoo*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/weewoo.gif',
    '*happiness*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/happinessfaerie.gif',
    '*babypb*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/babypb.gif',
    '*faeriepb*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/faeriepb.gif',
    '*piratepb*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/piratepb.gif',
    '*dariganpb*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/dariganpb.gif',
    '*mootix*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/mootix.gif',
    '*larnikin*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/larnikin.gif',
    '*pinchit*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/pinchit.gif',
    '*kadoatie*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/kadoatie.gif',
    '*kadoatery*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/kadoatery.gif',
    '*suap*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/suap.gif',
    '*bgc*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/bgc.gif',
    '*fyora*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/fyora.gif',
    '*noil*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/noil.gif',
    '*holler*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/holler.gif',
    '*discoholler*': 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/boards/emoticons/discoholler.gif'
};

(function() {
    'use strict';

    messages.forEach(message => {
        for (const [key, value] of Object.entries(smilies)) {
            message.innerHTML = message.innerHTML.replace(key, buildImage(value));
        }
    });
})();