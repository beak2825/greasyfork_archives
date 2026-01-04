// ==UserScript==
// @name         MouseHunt - Fix HUD Shadow
// @namespace    http://github.com/hymccord
// @version      0.1.1
// @description  Can't unsee the weird shadow? Now you can!
// @author       Xellis
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.mousehuntgame.com/images/mice/square/6b9bd6acb4a07d560f61e5678e4ff3b5.jpg
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.2.0/mousehunt-utils.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461319/MouseHunt%20-%20Fix%20HUD%20Shadow.user.js
// @updateURL https://update.greasyfork.org/scripts/461319/MouseHunt%20-%20Fix%20HUD%20Shadow.meta.js
// ==/UserScript==

/* global addStyles */

const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAuwAAAA3BAMAAAClaAIKAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAB5QTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtyhvagAAAAp0Uk5TJiUkACMcECEOC8BWQuoAAAFtSURBVHic7dm7SgNBAIXhnXjv3DxBkicQ1KhdQOwFxVoQsRUEwS7gCwgWvq6XXTUz0cyK2fyQc75mi93i8DvGJBZFpEyu9k/d6hK2mzxV9Nsdo+Nv2X3a56QOmcn+eXv2U9ZYqC+9mU91qtuZH441VpfMBa1+KULba2SE6q9kN5O9834/9FoeI6T8CJp99ei/PTHwa8zclIMi/w5l11rye/OTK3rbMhue/xj9nt61/G6mq2/SmxSMp7I/05MUHPmwI9LjvkIP0rCTZD+mB2nYS7Kf0YM07CfZ/ZZ9IYZJdnqPCmdHODvC2RHOjoirr9JzVIyi7Gv0HBWnUfZ1eo6Kyyj7HT1HxYE/pBKij6kb9BodtxPZt+gxOp4msj/SY3Qcflf3v5YWaOzDTvg67g/0Ei0v1fcCF/QONdcjfwfGcHaEsyOcHeHsCGdHODvC2RHOjnB2hLMjnB3h7AhnRzg7wtkRzo5wdoSzI5wd8QpdUG7hbOg+GQAAAABJRU5ErkJggg=="
addStyles(`
  .mousehuntHud-marbleDrawer {
   background: url(https://www.mousehuntgame.com/images/ui/hud/mousehuntHudPedestal.gif?asset_cache_version=2) -37px 0 no-repeat,
     url(https://www.mousehuntgame.com/images/ui/hud/mousehuntHudPedestal.gif?asset_cache_version=2) 723px 0 no-repeat,
     url(${base64Image}) 6px 0 no-repeat,
     url(https://www.mousehuntgame.com/images/ui/backgrounds/hud_bg_blue_repeating.png?asset_cache_version=2) repeat-y bottom center
  }
`);