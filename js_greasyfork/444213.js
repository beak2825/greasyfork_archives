// ==UserScript==
// @name           Whatsapp web anti spy
// @name:es        Whatsapp web anti espía
// @namespace      http://tampermonkey.net/
// @description    Add a button to blur/lighten whatsapp web
// @description:es Agrega un botón para difuminar/aclarar whatsapp web
// @version        0.9
// @author         IgnaV
// @match          https://web.whatsapp.com/
// @icon           http://whatsapp.com/favicon.ico
// @license        MIT
// @grant          GM_setValue
// @grant          GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/444213/Whatsapp%20web%20anti%20spy.user.js
// @updateURL https://update.greasyfork.org/scripts/444213/Whatsapp%20web%20anti%20spy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const userLanguage = (navigator.language || navigator.userLanguage).split('-')[0];
    const lang = {
        en: {
            blur: 'Blur'
        },
        es: {
            blur: 'Difuminar'
        }
    };
    const userLang = lang[userLanguage] || lang.en;


    const blurButtonText = `
    <div id="toggle-blur" aria-disabled="false" role="button" tabindex="0" class="_26lC3" title="${userLang.blur}" aria-label="${userLang.blur}" style="filter: blur(1px);">
        <div aria-disabled="false" role="button" tabindex="0" class="_26lC3" title="${userLang.blur}" aria-label="${userLang.blur}">&nbsp;B&nbsp;</div>
    </div>
    `;
    const antiSpyCss = `
        #toggle-blur { font-weight: 800; }
        .blink { animation: blinker 1.2s linear infinite; }
        @keyframes blinker { 50% { opacity: 0; } }
    `;
    const antiSpyStyle = document.createElement('style');
    antiSpyStyle.type = 'text/css';
    antiSpyStyle.appendChild(document.createTextNode(antiSpyCss));
    document.head.appendChild(antiSpyStyle);

    const blurCss = `
        /*** LEFT ZONE ***/

        /* Profile photos */
        ._2i3T7 ._8hzr9.M0JmA.i0jNr:not(:hover) { filter: blur(6px); }
        /* Search box */
        ._2i3T7 ._3yWey:not(:hover) { filter: blur(6px); }
        /* Chat names */
        ._2i3T7 ._3vPI2:not(:hover) { filter: blur(6px); }
        /* Chat last message */
        ._2i3T7 ._37FrU:not(:hover) { filter: blur(6px); }
        /* Chat default user */
        [data-testid="default-user"]:not(:hover) { filter: blur(6px); }
        /* Chat default group */
        [data-testid="default-group"]:not(:hover) { filter: blur(6px); }

        /*** RIGHT ZONE ***/

        /* Chat title */
        ._3xTHG ._2rlF7:not(:hover) { filter: blur(6px); }
        /* Chat participants */
        ._3xTHG .zzgSd._3e6xi:not(:hover) { filter: blur(6px); }
        /* Chat photo */
        ._3xTHG ._8hzr9.M0JmA.i0jNr:not(:hover) { filter: blur(6px); }

        /* Participants names */
        ._3xTHG .hooVq:not(:hover) { filter: blur(3px); }
        /* Chat texts */
        ._3xTHG ._1Gy50:not(:hover) { filter: blur(6px); }
        /* Chat audio */
        ._3xTHG .Y-J7e:not(:hover) { filter: blur(6px); }
        /* Chat preview */
        ._3xTHG .g0rxnol2:not(:hover) { filter: blur(6px); }
        /* Chat filename */
        ._3xTHG .bi2mdrpt.hsk1pqkj.sfeitywo.cqsf3vkf.ajgl1lbb.gfz4du6o.r7fjleex.aja0x350.ln8gz9je.rrq4r3yd:not(:hover) { filter: blur(6px); }
        /* Chat new integrant */
        ._3xTHG ._2ad1k:not(:hover) { filter: blur(6px); }
        /* Chat day */
        ._3xTHG ._1-lf9.NQl4z:not(:hover) { filter: blur(6px); }
        /* Chat hour & checked */
        ._3xTHG ._1WSmF:not(:hover) { filter: blur(6px); }
        /* Chat mention */
        ._3xTHG ._3o5fT:not(:hover) { filter: blur(6px); }
        /* Chat web link */
        ._3xTHG .GAiYx:not(:hover) { filter: blur(6px); }
        /* Chat reactions */
        ._3xTHG .p357zi0d.ktfrpxia.nu7pwgvd.ac2vgrno.sap93d0t.gndfcl4n.bmot90v7.i5tg98hk.jfqm35v0.przvwfww.bdbt56hn.r18xjin9.pz6oj2k2.sa2xs5zj.n58sa971.jht8oeb6.fahkg6u0.hcpeg58q.p6ubcsnv.avd5zzxf.qqik71jn:not(:hover) { filter: blur(6px); }
        /* Images, gifs and videos */
        .jciay5ix.tvf2evcx.oq44ahr5.lb5m6g5c, video.LHFBt, ._22dVC, ._1RPCB, .-tfJt, .lhggkp7q.paaq2zjn.b6yx6y2g.jnl3jror.kk3akd72.ln8gz9je.ppled2lx.m7o6y653.pfv1hzq5.bgtrvtbx.l8dmboli.delct6vn.fnaq8xyt { filter: blur(30px); }
        /* Stickers */
        ._3xTHG ._3BGWx:not(:hover) { filter: blur(30px); }
        /* Chat input text */
        ._3xTHG .p3_M1:not(:hover) { filter: blur(6px); }
        /* Chat share contact name */
        ._3xTHG .i0jNr:not(:hover) { filter: blur(6px); }
    `;
    const blurStyle = document.createElement('style');
    blurStyle.type = 'text/css';
    blurStyle.id = 'blur-style';
    blurStyle.appendChild(document.createTextNode(blurCss));

    let isFirstTime = GM_getValue('isFirstTime', true);

    const blurButton = document.createElement('div');

    const finishGetStarted = () => {
        blurButton.classList.remove('blink');
        document.querySelector('.get-started-dim').style.background = null;
        blurButton.classList.remove('get-started-dim');
        isFirstTime = false;
        GM_setValue('isFirstTime', false);
    }

    blurButton.className = '_2cNrC';
    if (isFirstTime) {
        blurButton.classList.add('get-started-dim');

        var ofs = 0;
        blurButton.classList.add('blink');
    }
    blurButton.innerHTML = blurButtonText;

    const handler = () => {
        const buttonGroup = document.querySelector('#app > div > div > div.ldL67._2i3T7 > header > div._3yZPA > div > span');
        let isBlur = !GM_getValue('isBlur', false);
        buttonGroup.prepend(blurButton);
        const toggleBlurButton = buttonGroup.querySelector('#toggle-blur');
        const toggleBlur = (isFirst=false) => {
            if (!isBlur) {
                toggleBlurButton.style.filter = '';
                document.head.appendChild(blurStyle);
            } else {
                toggleBlurButton.style.filter = 'blur(1px)';
                const style = document.querySelector('#blur-style');
                if (style) {
                    style.remove();
                }
            }
            if (!isFirst && isFirstTime) {
                finishGetStarted();
            }
            isBlur = !isBlur;
            GM_setValue('isBlur', isBlur);
        }
        toggleBlurButton.addEventListener('click', () => toggleBlur());
        toggleBlur(true);
    }

    let attempts = 0;
    const intervalId = setInterval(() => {
        const buttonGroup = document.querySelector('#app > div > div > div.ldL67._2i3T7 > header > div._3yZPA > div > span');
        if (buttonGroup) {
            clearInterval(intervalId);
            handler();
        } else if (attempts < 20) {
            attempts++;
        } else {
            clearInterval(intervalId);
        }
    }, 500);
})();