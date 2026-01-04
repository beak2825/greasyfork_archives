// ==UserScript==
// @name        Omnivox Forum Customization
// @namespace   Violentmonkey Scripts
// @match       https://*.omnivox.ca/cvir/cfrm/ForumClasse.aspx
// @version     1.1
// @author      wengh
// @description Make the forum have customizable width
// @require     https://gitcdn.xyz/cdn/odyniec/MonkeyConfig/51456c3a36b9b6febe61d1351de16466c90695d2/monkeyconfig.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/415273/Omnivox%20Forum%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/415273/Omnivox%20Forum%20Customization.meta.js
// ==/UserScript==


let style = null;

function updateWidth (width) {
  if (style != null)
    style.remove();
  
  style = GM_addStyle(`
  link+ table { width: ${width} !important ; }
  .Msg .Msg { width: ${width - 150} !important ; }
  .reWrapper  { width: ${width - 150} !important ; }
  `);
}

var cfg = new MonkeyConfig({
  title: 'Settings',
  menuCommand: true,
  params: {
    width: {
      type: 'number',
      default: 900
    },
  },
  onSave: values => updateWidth(values['width'])
});

updateWidth(cfg.get('width'));