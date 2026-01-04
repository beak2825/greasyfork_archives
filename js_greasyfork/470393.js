// ==UserScript==
// @name        Facebook Reel: Video Controls
// @namespace   UserScript
// @match       https://www.facebook.com/*
// @version     0.2.30
// @license     MIT
// @author      CY Fung
// @description Make Facebook Reel: Video Controls
// @run-at      document-start
// @grant       none
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/470393/Facebook%20Reel%3A%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/470393/Facebook%20Reel%3A%20Video%20Controls.meta.js
// ==/UserScript==

(() => {

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentRect.height > 0) {
        document.documentElement.style.setProperty('--frvc-reel-control-height', entry.contentRect.height + 'px');
      }
    }
  });

  let lastXid = "";

  let addCSS = () => {
    if (addCSS.done) return;
    addCSS.done = true;
    document.head.appendChild(document.createElement('style')).textContent = `
    [frvc-might-empty]:empty {
      display: none;
    }
    [frvc-css="cursor-passthrough"] {
      pointer-events: none;
    }
  
    [frvc-css="cursor-passthrough"] [role], [frvc-css="cursor-passthrough"] [tabindex] {
      pointer-events: initial;
    }


    [frvc-css="sized-holder"] {
      height: auto !important;
      box-sizing: border-box !important;
      padding-top: 16px !important;
    }
  
    `

  };

  const setVideoTargetStyles = (videoTarget) => {
    Object.assign(videoTarget.style, {
      'position': 'relative',
      'zIndex': 999,
      'pointerEvents': 'all',
      'height': 'calc(100% - var(--frvc-reel-control-height))'
    });
  };

  const attributeRemoves = (list) => {
    for (const m of list) {
      for (const s of document.querySelectorAll(`[${m}]`)) {
        s.removeAttribute(m);
      }
    }
  };

  let cid = 0;
  let videoCached = null;
  let statusA = 0;

  const videoTargetCacheFn = (evt) => {
    const videoTarget = (evt || 0).target;
    if (videoTarget instanceof HTMLVideoElement) {
      if (videoCached !== videoTarget) {
        if (location.href.indexOf('reel') < 0) return;
        if (!(videoTarget.duration > 0.25)) return;
        if (!videoTarget.closest('div[class][role="button"][tabindex], div[role="main"]')) return;
        videoCached = videoTarget;
      }
      statusA |= 1;
      if ((statusA & 3) === 3) {
        statusA = 0;
        if (!cid) {
          cid = 1;
          Promise.resolve().then(() => {
            delayMain(videoCached);
          });
        }
      }
    }
  }

  document.addEventListener('play',videoTargetCacheFn , true);

  document.addEventListener('durationchange', videoTargetCacheFn, true);

  document.addEventListener('playing', videoTargetCacheFn, true);

  // document.addEventListener('timeupdate', videoTargetCacheFn, true);

  new MutationObserver(()=>{

    if (videoCached) {
      const videoTarget = videoCached;
      if (lastXid && videoTarget.hasAttribute('controls') && document.querySelector(`[frvc-id="sizing_${lastXid}"]`)) {
        return;
      }
      if (!videoTarget.isConnected) return;
      statusA |= 2;
      if ((statusA & 3) === 3) {
        statusA = 0;
        if (!cid) {
          cid = 1;
          Promise.resolve().then(() => {
            delayMain(videoCached);
          });
        }
      }
    }

  }).observe(document, {subtree: true, childList: true});

  const delayMain = (videoTarget) => {
    cid = 0;

    if (location.href.indexOf('reel') < 0) return;

    if (lastXid && videoTarget.hasAttribute('controls') && document.querySelector(`[frvc-id="sizing_${lastXid}"]`)) {
      return;
    }

    try {

      const debugInfo = {};
      Promise.resolve(debugInfo).then(console.debug);

      const videoLayerContainer = videoTarget.closest('div[class][role="button"][tabindex], div[role="main"]');
      debugInfo.videoLayerContainer = videoLayerContainer;
      if (!videoLayerContainer) return;

      videoTarget.setAttribute('controls', '');
      addCSS();


      document.documentElement.style.removeProperty('--frvc-reel-control-height');
      attributeRemoves(['frvc-debug', 'frvc-holder', 'frvc-css', 'frvc-might-empty']);

      setVideoTargetStyles(videoTarget);

      const floatingLayer = [...videoLayerContainer.querySelectorAll('.x10l6tqk.x13vifvy:not(.x1m3v4wt)')].filter(elm => !elm.contains(videoTarget));
      debugInfo.floatingLayer = floatingLayer;

      for (const c of floatingLayer) {
        c.setAttribute("frvc-debug", "clickableHolder-bypass");
      }

      const clickable = videoLayerContainer.querySelectorAll('a[role="link"][href]');
      debugInfo.clickable = clickable;
      const clickableHolder = [...new Set([...clickable].map(e => {
        do {
          if (floatingLayer.includes(e.parentNode)) return e;
        } while ((e = e.parentNode) instanceof HTMLElement);
        return null;
      }))].filter(e => !!e).map(e => {
        const f = (e) => {
          const { firstElementChild, lastElementChild } = e;
          if (firstElementChild === lastElementChild) return f(firstElementChild);
          const validChildren = [...e.children].filter(e => e.firstElementChild !== null);
          if (validChildren.length === 1) return f(validChildren[0]);
          return e;
        }
        return f(e);
      });
      debugInfo.clickableHolder = clickableHolder;
      if (clickableHolder.length === 0) return;

      const xid = `${Math.floor(Math.random() * 29002921 + 29002921).toString(36)}`;

      const clickableHolderSized = [];
      for (const c of clickableHolder) {
        c.setAttribute("frvc-holder", `m_${xid}`);

        const clickable = c.querySelectorAll('a[role="link"][href]');
        const s = new Set();
        for (let e of clickable) {
          if (!e.parentNode) break;
          do {
            if (e.parentNode === c) break;
            s.add(e.parentNode);
          } while ((e = e.parentNode) instanceof HTMLElement);
        }
        for (const p of s) {
          p.setAttribute("frvc-holder", `s_${xid}`);
        }
        const ret = [[c, c.getBoundingClientRect().height, 0]];
        const elements = c.querySelectorAll(`[frvc-holder="s_${xid}"]`);
        let i = 0;
        for (const element of elements) {
          const p = element.getBoundingClientRect();
          ret.push([element, p.height, ++i]);
        }
        ret.sort((a, b) => b[1] - a[1] || a[2] - b[2]);
        clickableHolderSized.push(ret[0][0]);
      }

      for (const s of floatingLayer) {

        Object.assign(s.style, {
          'pointerEvents': 'none'
        });
        s.setAttribute('frvc-css', "cursor-passthrough");

      }

      for (const s of clickable) {

        Object.assign(s.style, {
          'pointerEvents': 'initial'
        });
      }

      const videoElmBRect = videoTarget.getBoundingClientRect();
      let effctiveHolder = null;
      for (const s of clickableHolderSized) {

        if (effctiveHolder === null) {
          const clickableHolderBRect = s.getBoundingClientRect();
          const conditions = {
            bottom: Math.abs(clickableHolderBRect.bottom - videoElmBRect.bottom) < 48,
            top: clickableHolderBRect.top + 1 > videoElmBRect.top,
            left: Math.abs(clickableHolderBRect.left - videoElmBRect.left) < 5,
            right: Math.abs(clickableHolderBRect.right - videoElmBRect.right) < 5
          }
          debugInfo.debug = conditions;
          if (conditions.bottom && conditions.top && conditions.left && conditions.right) {
            effctiveHolder = s;
          }
        }

        Object.assign(s.style, {
          'pointerEvents': 'initial',
        });

      }

      debugInfo.effctiveHolder = effctiveHolder;
      if (effctiveHolder) {
        effctiveHolder.setAttribute("frvc-css", "sized-holder");
        addCSS();
        for (const s of effctiveHolder.querySelectorAll('div[class]:empty')) {
          s.setAttribute('frvc-might-empty', "");
        }
        effctiveHolder.setAttribute("frvc-debug", "sizing");
        lastXid = xid;
        effctiveHolder.setAttribute("frvc-id", `sizing_${lastXid}`);
        resizeObserver.disconnect();
        resizeObserver.observe(effctiveHolder);
      } else {
        console.warn("frvc: sizing element is not found");
      }

    } catch (e) {
      console.error("frvc", e);
    }

  };

})();