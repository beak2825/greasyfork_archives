// ==UserScript==
// @name          Reddit: bring back old logo
// @description   Reverts to logo and icon that were before December 2023
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://i.imgur.com/ykdcVrp.png
// @version       1.2.3
// @match         https://www.reddit.com/*
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/482314/Reddit%3A%20bring%20back%20old%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/482314/Reddit%3A%20bring%20back%20old%20logo.meta.js
// ==/UserScript==

/**
 * Hi! Don't change (or even resave) anything here because
 * by doing this in Tampermonkey you will turn off updates
 * of the script (idk about other script managers).
 * This could be restored in settings but it might be hard to find,
 * so better to reinstall the script if you're not sure
 */

(async function() {
  'use strict';

  const DARK_MODE_TEXT_COLOR = '#DADADA';

  const icons = {
    '16': [
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9',
      'hAAABn0lEQVR4AWySA6wdURRFp2ZcRTVi1w1q27YdJ7Vt27YV1HYbfNs2HtY/N+cm',
      'j5Os8d6Hjv9BX6eOMEC4JiQJLkuycF0YaP7xKQLFzYSDQq4A4cm1/zQLJ74fVjSgl',
      'lBT7qvpvb6/ryYqrm1dCcEI98+HQ0vgwlp4eR7GNoE+DlZT27F15YSIzU9jGsOR5S',
      'raPgVenPMZqGagYxsGht6WXtZgSSfYOd08C9WgXw397gt0zbHdhv41YGYHoT1sHg+',
      'vLkL0L4j8AY+Pw9phMKUFTG0N/apjDZKMgcu4sqwLpMVCdgoU5kJpIfaAsmIozIH0',
      'OEiOhKVdsJm4Ag3yMgDg8kbYMEqFpUVyPxpu7ASAgmxY2SPAIEnQtEyXAb48gUfHw',
      'FUJleVwew98uA8Ab276jzPJ10TjuH0qVFZARRnE/ddohTl6X14Kbhfsm+ffyGu+MZ',
      'quD6kPl9ZDThr8/2CiKf/fa3nXt8PQhiFj9C2S+dC/po7v3Gp4ehqeCWaJlnfT1FX',
      'sW6Swq9zbUjUcfJBaXPlhIqmZidjs/Bgq5oGenQGmGkYQ+gIA9QAAAABJRU5ErkJggg=='
    ].join(''),

    '32': [
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr',
      '0AAAD5UlEQVR4Aa3XA5BcSxTG8Xm2XyEuxba1+2Lbtm3btm3btm3bdjK7//dN3b1V',
      '6d07ySCn6rc77tPudvkS5HJ9I0mlkyyWo/JY3BEey+GI9zpIEvnGFXCYBWeX8XJZw',
      'oTPcMtFGSdZ5JtAC48jg+WeEKC7MlBi+lt4Vtkl4UKQwmWbZPC18HxyTvjCTkvo5w',
      'rP5nfh/0mohESwn9tyGU5Jhk/1+U7BZ6FSPzUsGgrjWkLrUCgXA9rnhaUjoVdZyPN',
      'N5O9tltiRC/9aBgt+JzCzO+xfDfMHwJ4VcHQLPLwFAI9uK8FUTi3RW77+OIEcAY/2',
      'tZNhSF3I6YLCv0KDNHBmHwA8uAF1kjslcFcyW4XnVu2teY7ffV/0DziwFtrkMvu/c',
      'UaY3B465De7wDREvvbUPplcCqj566WE49ugXCwVbr5HiDEInVySpK6I5TXM51rbP5',
      'xTBtWALXMgz3dmgb5xS0NPAosEm2Mt7KYt9hd0yAcze8CKMXDhEFw6BgsHw8iGVv8',
      'X+Mn8jt01uRxN8CRw1LGmVeNB/yrQPBuUiwljm8PJnfD2FY4RHg5PH1gzoX9lND6s',
      'AdihAJSJ7i2JI54EHkepeZNMVs0Anj2AKyfA/R6f4+1razreuwYf3sPJXWi8OHXRY',
      '08C7ii1XzwMx3j9Ap7cgzC3QwuEwcsn8P4djjGjm1MCbt8TuHcVuhWHmolh3ZTIpc',
      'PKcdAwLQytC0/vEyVm9fCawOMoCTRMB5ePY8SmWXrvG8jugla5zLHw6hk0ymy9l+d',
      '72LUMI66dRr/plMAjTwKHBUNOUU0gPOqPaLVjdm9r0Nnh/gAjG1mLTq2kcPUkRoxq',
      'AiGOg/Cw8zQMkfb54d0bjLhzGU7vhjcviRLPHsLu5XD5GEaEhUGfCt4SGOtJoL3jO',
      'NCuxqWjBB13r0DNRE7N/0EauCIOkBcc14JxLazmteP5Y5jdCw5vMlvn/Vs4uhVmdI',
      'fHd8y1YWpnyPWVU+0vSGJ7Kx7rmEDh32HZSGsug/V/+wIYWB0GVLP6XRhYw7J1vpW',
      'M3fRrJkKJf70tQgPkq4/PgHe8JjG6Cep/cz04ux92LbHosV4DsLdhazcs9o+3/eG2',
      'pI98IBnoZQOSr6B2MpjYBg5vRPPcXIz0WCumtTNO6WgdQnJ9bdbc1N2u/cdJxJSt3',
      'rffCIV/s5LpUhSt+VIFuhaDuimhyO/OZ0HTOonh7VyYUU77dQgVY9fM9UnHJfXnTs',
      'YhjkkE77hk8fVukF42C19AuKyXVP7ejmJJb7krBOiOdJcYwVxOM8kQuSRuH49aF2S',
      'gpP+St+Qk0lAmyBHM6/kjOSzjpIEk9rXg/wEYGM5JXiwPQwAAAABJRU5ErkJggg=='
    ].join(''),

    '96': [
      'data:image/png;base64,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'
    ].join(''),
  };

  const svgs = {
    logo: {
      viewBox: '0 0 20 20',
      innerHTML: [
        '<g><circle fill="#FF4500" cx="10" cy="10" r="10"></circle><path f',
        'ill="#FFF" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.',
        '85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,',
        '0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2',
        ',11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82',
        ',5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a',
        '1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.7',
        '7,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0',
        ',0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0',
        '.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"></path></g>'
      ].join(''),
    },

    name: {
      viewBox: '0 0 57 18',
      innerHTML: [
        '<path d="M54.63,16.52V7.68h1a1,1,0,0,0,1.09-1V6.65a1,1,0,0,0-.93-',
        '1.12H54.63V3.88a1.23,1.23,0,0,0-1.12-1.23,1.2,1.2,0,0,0-1.27,1.11',
        'V5.55h-1a1,1,0,0,0-1.09,1v.07a1,1,0,0,0,.93,1.12h1.13v8.81a1.19,1',
        '.19,0,0,0,1.19,1.19h0a1.19,1.19,0,0,0,1.25-1.12A.17.17,0,0,0,54.6',
        '3,16.52Z"></path><circle fill="#FF4500" cx="47.26" cy="3.44" r="2',
        '.12"></circle><path d="M48.44,7.81a1.19,1.19,0,1,0-2.38,0h0v8.71a',
        '1.19,1.19,0,0,0,2.38,0Z"></path><path d="M30.84,1.19A1.19,1.19,0,',
        '0,0,29.65,0h0a1.19,1.19,0,0,0-1.19,1.19V6.51a4.11,4.11,0,0,0-3-1.',
        '21c-3.1,0-5.69,2.85-5.69,6.35S22.28,18,25.42,18a4.26,4.26,0,0,0,3',
        '.1-1.23,1.17,1.17,0,0,0,1.47.8,1.2,1.2,0,0,0,.85-1.05ZM25.41,15.6',
        '4c-1.83,0-3.32-1.77-3.32-4s1.48-4,3.32-4,3.31,1.78,3.31,4-1.47,3.',
        '95-3.3,3.95Z"></path><path d="M43.28,1.19A1.19,1.19,0,0,0,42.09,0',
        'h0a1.18,1.18,0,0,0-1.18,1.19h0V6.51a4.15,4.15,0,0,0-3-1.21c-3.1,0',
        '-5.69,2.85-5.69,6.35S34.72,18,37.86,18A4.26,4.26,0,0,0,41,16.77a1',
        '.17,1.17,0,0,0,1.47.8,1.19,1.19,0,0,0,.85-1.05ZM37.85,15.64c-1.83',
        ',0-3.31-1.77-3.31-4s1.47-4,3.31-4,3.31,1.78,3.31,4-1.47,3.95-3.3,',
        '3.95Z"></path><path d="M17.27,12.44a1.49,1.49,0,0,0,1.59-1.38v-.1',
        '5a4.81,4.81,0,0,0-.1-.85A5.83,5.83,0,0,0,13.25,5.3c-3.1,0-5.69,2.',
        '85-5.69,6.35S10.11,18,13.25,18a5.66,5.66,0,0,0,4.39-1.84,1.23,1.2',
        '3,0,0,0-.08-1.74l-.11-.09a1.29,1.29,0,0,0-1.58.17,3.91,3.91,0,0,1',
        '-2.62,1.12A3.54,3.54,0,0,1,10,12.44h7.27Zm-4-4.76a3.41,3.41,0,0,1',
        ',3.09,2.64H10.14A3.41,3.41,0,0,1,13.24,7.68Z"></path><path d="M7.',
        '68,6.53a1.19,1.19,0,0,0-1-1.18A4.56,4.56,0,0,0,2.39,6.91V6.75A1.2',
        ',1.2,0,0,0,0,6.75v9.77a1.23,1.23,0,0,0,1.12,1.24,1.19,1.19,0,0,0,',
        '1.26-1.1.66.66,0,0,0,0-.14v-5A3.62,3.62,0,0,1,5.81,7.7a4.87,4.87,',
        '0,0,1,.54,0h.24A1.18,1.18,0,0,0,7.68,6.53Z"></path></g>'
      ].join(''),
    },
  };

  const q = {
    logoSvg: [
      // main
      'svg._1O4jTk-dZ-VIxsCuYB6OR8',

      // recap page, maybe somewhere else
      'a#reddit-logo > span.pr-0.flex.items-center > svg',

      // mobile useragent layout
      'faceplate-tracker[noun="reddit_logo"] > a#reddit-logo > svg',
    ].join(', '),

    nameSvg: [
      // main
      'svg._1bWuGs_1sq4Pqy099x_yy-',

      // recap page, maybe somewhere else
      'a#reddit-logo > span.hidden.items-center > svg',
    ].join(', '),
  };

  let logoSvgNode, nameSvgNode;

  function setNameSvgNodeToDarkMode(node) {
    for (const child of node.children) {
      if (child.localName === 'path') {
        child.setAttribute('fill', DARK_MODE_TEXT_COLOR);
      }
    }
  }

  function setNameSvgNodeToLightMode(node) {
    for (const child of node.children) {
      if (
        child.localName === 'path' &&
        child.attributes.fill?.value === DARK_MODE_TEXT_COLOR
      ) {
        child.removeAttribute('fill');
      }
    }
  }

  const fixSvgNode = (() => {
    // is needed to avoid possible endless loop
    const nodesToSkip = new Set();

    return (node, newSvg) => {
      if (nodesToSkip.has(node)) return;

      nodesToSkip.add(node);
      node.innerHTML = newSvg.innerHTML;
      node.setAttribute('viewBox', newSvg.viewBox);

      const nodeObs = new MutationObserver((mutations, observer) => {
        node.innerHTML = newSvg.innerHTML;

        // check only for dark because light svg is default
        if (isItDarkMode() && node === nameSvgNode) {
          setNameSvgNodeToDarkMode(node);
        }

        observer.takeRecords();
      });

      nodeObs.observe(node, { childList: true });

      // same as above
      if (isItDarkMode() && node === nameSvgNode) {
        setNameSvgNodeToDarkMode(node);
      }
    }
  })();

  await waitForDocumentElement();

  const documentObs = new MutationObserver((mutations) => {
    if (!nameSvgNode) return;

    mutations.forEach((mutationRecord) => {
      if (mutationRecord.attributeName === 'class') {
        try {
          if (isItDarkMode()) {
            setNameSvgNodeToDarkMode(nameSvgNode);
          } else {
            setNameSvgNodeToLightMode(nameSvgNode);
          }
        } catch(e) {
          console.error(e);
        }
      }
    });
  });

  documentObs.observe(document.documentElement, { attributes: true });

  document.arrive('a[aria-label="Home"]', { existing: true }, (homeBtn) => {
    logoSvgNode = homeBtn.querySelector(q.logoSvg);
    nameSvgNode = homeBtn.querySelector(q.nameSvg);

    if (logoSvgNode) fixSvgNode(logoSvgNode, svgs.logo);
    if (nameSvgNode) fixSvgNode(nameSvgNode, svgs.name);

    const homeBtnObs = new MutationObserver((mutations) => {
      mutations.forEach((mutationRecord) => {
        for (const node of mutationRecord.addedNodes) {
          if (!node.matches) continue;

          if (node.matches(q.logoSvg)) {
            fixSvgNode(node, svgs.logo);
            logoSvgNode = node;
          } else {
            const childNode = node.querySelector(q.logoSvg);

            if (childNode) {
              fixSvgNode(childNode, svgs.logo);
              logoSvgNode = node;
            }
          }

          if (node.matches(q.nameSvg)) {
            fixSvgNode(node, svgs.name);
            nameSvgNode = node;
          } else {
            const childNode = node.querySelector(q.nameSvg);

            if (childNode) {
              fixSvgNode(childNode, svgs.name);
              nameSvgNode = node;
            }
          }
        }
      });
    });

    homeBtnObs.observe(homeBtn, { childList: true });
  });

  await waitForBodyElement();

  for (const [size, base64] of Object.entries(icons)) {
    const link = document.createElement('link');

    link.rel = 'icon';
    link.type = 'image/png';
    link.sizes = `${size}x${size}`;
    link.href = base64;

    document.head.appendChild(link);
  }

  // utils ===================================================================

  function isItDarkMode() {
    if (document.documentElement.classList.contains('theme-dark')) {
      return true;
    }
    else if (document.documentElement.classList.contains('theme-light')) {
      return false;
    }

    throw new Error('Can\'t figure out is it dark or light mode');
  }

  async function waitForBodyElement() {
    return new Promise((resolve) => {
      (function trackerLoop() {
        if (!document.body) return setTimeout(trackerLoop);
        resolve();
      }());
    });
  }

  async function waitForDocumentElement() {
    return new Promise((resolve) => {
      (function trackerLoop() {
        if (!document.documentElement) return setTimeout(trackerLoop);
        resolve();
      }());
    });
  }

})();
