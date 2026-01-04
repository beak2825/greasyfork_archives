// ==UserScript==
// @name         YT音量滾輪+++
// @namespace    https://greasyfork.org/users/649
// @version      1.1.12
// @description  Use the scroll wheel to adjust volume of youtube videos
// @author       Adrien Pyke
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://www.youtube.com/favicon.ico
// @require      https://cdn.jsdelivr.net/gh/kufii/My-UserScripts@22210afba13acf7303fc91590b8265faf3c7eda7/libs/gm_config.js
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @require      https://cdn.jsdelivr.net/gh/kufii/quick-query.js@2993f91ae90f3b2aff4af7e9ce0b08504f5c8060/dist/window/qq.js

// @downloadURL https://update.greasyfork.org/scripts/523377/YT%E9%9F%B3%E9%87%8F%E6%BB%BE%E8%BC%AA%2B%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/523377/YT%E9%9F%B3%E9%87%8F%E6%BB%BE%E8%BC%AA%2B%2B%2B.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const { q } = window.QuickQuery;

  const Util = {
    bound: (num, min, max) => Math.max(Math.min(num, max), min)
  };

  const Config = GM_config([
    { key: 'reverse', label: 'Reverse Scroll', default: false, type: 'bool' },
    {
      key: 'horizontal',
      label: 'Use Horizontal Scroll',
      default: false,
      type: 'bool'
    },
    {
      key: 'step',
      label: 'Change By',
      default: 2,
      type: 'number',
      min: 1,
      max: 100
    },
    { key: 'hud', label: 'Display HUD', default: true, type: 'bool' },
    {
      key: 'requireShift',
      label: 'Only handle scroll if holding "Shift" key',
      default: false,
      type: 'bool'
    }
  ]);
  GM_registerMenuCommand('Youtube Scroll Volume Settings', Config.setup);

  let config = Config.load();
  Config.onsave = newConf => (config = newConf);

  GM_addStyle(/* css */ `
		.YSV_hud {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			//align-items: center;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			opacity: 0;
			transition: opacity 0ms ease 0s;
			z-index: 999;
			pointer-events: none;
		}
		.YSV_bar {
			background-color: #000a;
			border: 2px solid white;
			width: 15%;
			max-width: 600px;
			margin-bottom: 0%;
      margin-left: 10%;
		}
		.YSV_progress {
			transition: width 0ms ease-out 0s;
			background-color: #888;
			height: 25px;
		}
		.YSV_text {
			position: absolute;
			text-align: center;
			line-height: 25px;
      font-size:25px;
			width: 15%;
			max-width: 600px;
			color: white;
		}
	`);

  const createHud = () => {
    const hud = document.createElement('div');
    hud.classList.add('YSV_hud');
    hud.innerHTML =
      '<div class="YSV_bar"><div class="YSV_text"></div><div class="YSV_progress"></div></div>';
    return hud;
  };

  waitForElems({
    sel: 'ytd-player',
    onmatch(node) {
      let id;

      const hud = createHud();
      const progress = q(hud).q('.YSV_progress');
      const text = q(hud).q('.YSV_text');
      node.appendChild(hud);

      const showHud = volume => {
        clearTimeout(id);
        progress.style.width = `${volume}%`;
        text.innerHTML = `${volume}%`;
        hud.style.opacity = 1;
        id = setTimeout(() => (hud.style.opacity = 0), 100);
      };

      node.onwheel = e => {
        if (config.requireShift && !e.shiftKey) return;
        const player = node.getPlayer();
        const dir =
          ((config.horizontal ? -e.deltaX : e.deltaY) > 0 ? -1 : 1) *
          (config.reverse ? -1 : 1);

        const vol = Util.bound(player.getVolume() + config.step * dir, 0, 100);
        if (vol > 0 && player.isMuted()) player.unMute();
        player.setVolume(vol);
        if (config.hud) showHud(vol);

        e.preventDefault();
        e.stopImmediatePropagation();
      };
    }
  });
})();
/*增加trustedTypes才可執行*/
if (typeof trustedTypes !== 'undefined' && trustedTypes.defaultPolicy === null) {
  let s = s => s, [p, q, r] = [s, s, s]; s = trustedTypes;
  s.createPolicy('default', { createHTML: s => p(s), createScriptURL: s => q(s), createScript: s => r(s) });
  s.$Ω = s.createPolicy;
  s.createPolicy = function (a, b) {
    if (a === 'default' && s) {
      s = 0;
      const { createHTML: x, createScriptURL: y, createScript: z } = b;
      x && (p = x);
      y && (q = y);
      z && (r = z);
      return this.defaultPolicy;
    }
    return this.$Ω(...arguments);
  };
}