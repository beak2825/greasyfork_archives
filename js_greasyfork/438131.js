// ==UserScript==
// @name        Invidious (inv.nadeko.net) embed
// @description Replace YouTube embeds with inv.nadeko.net embeds.
// @author      Backend & SkauOfArcadia
// @homepage    https://codeberg.org/mthsk/userscripts/src/branch/master/invidious-embed
// @include     *
// @exclude     *://*.youtube.com/*
// @exclude     *://*.google.com/*
// @exclude     *://turntable.fm/*
// @exclude     *://web.archive.org/web/*
// @exclude     *://*/embed/*
// @exclude     *://*/watch?v=*
// @inject-into content
// @version     2025.03
// @grant       none
// @allFrames   true
// @namespace https://greasyfork.org/users/751327
// @downloadURL https://update.greasyfork.org/scripts/438131/Invidious%20%28invnadekonet%29%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/438131/Invidious%20%28invnadekonet%29%20embed.meta.js
// ==/UserScript==
(function() {
    "use strict";
    const instance = "inv.nadeko.net";
    const a = -1; //defines autoplay value on the initial page load
    const b = -1; //defines autoplay for embedded videos that appear on page interaction
    // -1 = will only autoplay if the embed has the "autoplay=1" parameter
    // 0 = disables autoplay
    // 1 = enables autoplay
    const dash = false; //defines if the quality=dash parameter will be used

    var observer = new MutationObserver(mutate);
    observer.observe(document, {
        childList: true,
        attributes: true,
        subtree: true
    });

    function mutate() {
        go(b);
    }

    function go(auto) {
        let frames = document.body.querySelectorAll('iframe[src], embed[src]');
        frames = Object.values(frames).filter(youtubeiFrame);

        for (let i = 0; i < frames.length; i++) {
            let frame = frames[i];
            let invid = frame.src;
            let params = new URLSearchParams();
            if (invid.indexOf('?') !== -1) {
                params = new URLSearchParams(invid.substring(invid.indexOf('?') + 1).split('#')[0]);
                invid = invid.split('?')[0];
            } else if (invid.indexOf('&') !== -1) {
                params = new URLSearchParams(invid.substring(invid.indexOf('&') + 1).split('#')[0]);
                invid = invid.split('&')[0];
            }
            params.delete('controls');

            if (params.get('v'))
            {
                invid = 'https://' + instance + '/embed/' + params.get('v');
                params.delete('v');
            }
            else if (invid.toLowerCase().indexOf('/embed/') !== -1)
            {
                invid = 'https://' + instance + '/embed/' + invid.substring(invid.toLowerCase().indexOf('/embed/') + 7).split('/')[0].split(';')[0];
            }
            else if (invid.toLowerCase().indexOf('/v/') !== -1)
            {
                invid = 'https://' + instance + '/embed/' + invid.substring(invid.toLowerCase().indexOf('/v/') + 3).split('/')[0].split(';')[0];
            }
            else
                invid = 'https://' + instance + '/' + invid.split('/')[3].split(';')[0];

            if (auto !== -1) {
                params.set('autoplay', auto);
            } else if (!params.get('autoplay')) {
                params.set('autoplay', 0);
            }

            if ((parseInt(frame.width, 10) <= 4 || parseInt(frame.style.width, 10) <= 4)
            && (parseInt(frame.height, 10) <= 4 || parseInt(frame.style.height, 10) <= 4)
            && params.get('autoplay') === '1') {
                params.set('listen', 1);
            }

            if(dash){ params.set('quality', 'dash'); }

            invid += '?' + params;
            frame.setAttribute('src', invid);

            if (frame.hasAttribute('srcdoc')) { frame.removeAttribute('srcdoc'); }

            if (frame.tagName.toLowerCase() === 'embed'){
                let newframe = document.createElement('iframe');
                newframe.innerHTML = frame.innerHTML;
                frame.getAttributeNames().forEach(attrName => { newframe.setAttribute(attrName, frame.getAttribute(attrName)); });
                frame.parentNode.replaceChild(newframe, frame);
            }
        }

        //Replace thumbnail embeds
        let thumbs = document.body.querySelectorAll('img[src*="img.youtube.com"], img[src*="i.ytimg.com"]');

        for (let x = 0; x < thumbs.length; x++)
        {
            let thumb = thumbs[x];
            let thumbsrc = new URL(thumb.src);

            if (thumbsrc.hostname === "img.youtube.com" || thumbsrc.hostname === "i.ytimg.com")
            {
                thumb.getAttributeNames().forEach(attrName => {
                  if (attrName !== 'src' && thumb.getAttribute(attrName).indexOf(thumbsrc.hostname) !== -1)
                      thumb.setAttribute(attrName, thumb.getAttribute(attrName).replace(thumbsrc.hostname, instance));
                });

                thumb.setAttribute('src', thumbsrc.protocol + '//' + instance + thumbsrc.pathname + thumbsrc.search + thumbsrc.hash);
            }
        }
    }

    function youtubeiFrame(el) {
        try {
            let url = new URL(el.src);
            return (url.hostname === "youtube.com" || url.hostname.endsWith(".youtube.com")
                   || url.hostname === "youtube-nocookie.com" || url.hostname.endsWith(".youtube-nocookie.com")
                   || url.hostname === "youtu.be" || url.hostname.endsWith(".youtu.be"));
        } catch (_) {
            return false;
        }
    }

    go(a);
})();