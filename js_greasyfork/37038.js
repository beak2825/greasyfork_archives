// ==UserScript==
// @name     RED Replace Emoticons
// @description    Replaced emoticons!
// @version  1.04
// @grant    none
// @include        http*://*redacted.ch/*
// @namespace https://greasyfork.org/users/162296
// @downloadURL https://update.greasyfork.org/scripts/37038/RED%20Replace%20Emoticons.user.js
// @updateURL https://update.greasyfork.org/scripts/37038/RED%20Replace%20Emoticons.meta.js
// ==/UserScript==

var emoticons = {};
emoticons["https://redacted.ch/static/common/smileys/angry.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/angry.png";
emoticons["https://redacted.ch/static/common/smileys/biggrin.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/biggrin.png";
emoticons["https://redacted.ch/static/common/smileys/blank.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/blank.png";
emoticons["https://redacted.ch/static/common/smileys/blush.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/blush.png";
emoticons["https://redacted.ch/static/common/smileys/cool.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/cool.png";
emoticons["https://redacted.ch/static/common/smileys/creepy.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/creepy.png";
emoticons["https://redacted.ch/static/common/smileys/crying.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/crying.png";
emoticons["https://redacted.ch/static/common/smileys/eyesright.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/eyesright.png";
emoticons["https://redacted.ch/static/common/smileys/frown.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/frown.png";
emoticons["https://redacted.ch/static/common/smileys/heart.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/heart.png";
emoticons["https://redacted.ch/static/common/smileys/hmm.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/hmm.png";
emoticons["https://redacted.ch/static/common/smileys/iloveflac.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/iloveflac.png";
emoticons["https://redacted.ch/static/common/smileys/ilovered.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/ilovered.png";
emoticons["https://redacted.ch/static/common/smileys/lol.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/lol.png";
emoticons["https://redacted.ch/static/common/smileys/ninja.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/ninja.png";
emoticons["https://redacted.ch/static/common/smileys/no.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/no.png";
emoticons["https://redacted.ch/static/common/smileys/nod.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/nod.png";
emoticons["https://redacted.ch/static/common/smileys/ohnoes.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/ohnoes.png";
emoticons["https://redacted.ch/static/common/smileys/ohshit.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/ohshit.png";
emoticons["https://redacted.ch/static/common/smileys/omg.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/omg.png";
emoticons["https://redacted.ch/static/common/smileys/paddle.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/paddle.png";
emoticons["https://redacted.ch/static/common/smileys/sad.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/sad.png";
emoticons["https://redacted.ch/static/common/smileys/shifty.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/shifty-1.png";
emoticons["https://redacted.ch/static/common/smileys/sick.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/sick.png";
emoticons["https://redacted.ch/static/common/smileys/smile.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/smile.png";
emoticons["https://redacted.ch/static/common/smileys/sorry.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/sorry.png";
emoticons["https://redacted.ch/static/common/smileys/thanks.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/thanks.png";
emoticons["https://redacted.ch/static/common/smileys/tongue.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/tongue.png";
emoticons["https://redacted.ch/static/common/smileys/wave.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/wave.png";
emoticons["https://redacted.ch/static/common/smileys/wink.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/wink.png";
emoticons["https://redacted.ch/static/common/smileys/worried.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/worried.png";
emoticons["https://redacted.ch/static/common/smileys/wtf.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/wtf.png";
emoticons["https://redacted.ch/static/common/smileys/wub.gif"] = "https://5.2.77.173/aaaaaaaaa/qh-copy/dev/css/red/rogers/flyingsausages.space/external/Emoticons/72ppi/wub.png";
 


var images = document.getElementsByTagName('img'); 
for(var i = 0; i < images.length; i++) {
    if (emoticons[images[i].src] ) {
    	images[i].src = emoticons[images[i].src];
    }
}
