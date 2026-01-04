// ==UserScript==
// @name            Vinted dark mode
// @name:fr         Dark mode pour Vinted
// @name:nl         Vinted dark mode
// @name:es         Vinted dark mode
// @description     Apply dark mode to Vinted website
// @description:fr  Appliquer un thème sombre au site Vinted (dark mode)
// @description:nl  SEen donker thema toepassen op de Vinted-site (dark mode)
// @description:es  Aplicar un tema oscuro al sitio de Vinted  (dark mode)
// @namespace       Geekatori
// @match           *://*.vinted.*/*
// @match           *://*.vinted.es/*
// @match           *://*.vinted.fr/*
// @match           *://*.vinted.cz/*
// @match           *://*.vinted.be/*
// @match           *://*.vinted.at/*
// @match           *://*.vinted.hu/*
// @match           *://*.vinted.it/*
// @match           *://*.vinted.lt/*
// @match           *://*.vinted.lu/*
// @match           *://*.vinted.nl/*
// @match           *://*.vinted.pl/*
// @match           *://*.vinted.pt/*
// @match           *://*.vinted.se/*
// @match           *://*.vinted.sk/*
// @match           *://*.vinted.co.uk/*
// @match           *://*.vinted.com/*
// @grant           GM.addStyle
// @version         0.1.5
// @author          Geekatori
// @license         MIT
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/459194/Vinted%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/459194/Vinted%20dark%20mode.meta.js
// ==/UserScript==
  
/*
Not working yet
@match *://*.vinted.ca/*
*/
  
var css = `
  :root {
    --cg7_v2: 23,23,23;
    --cg6_v2: 77,77,77;
    --cg5_v2: 117,117,117;
    --cg4_v2: 153,153,153;
    --cg3_v2: 201,201,201;
    --cg2_v2: 242,242,242;
    --cg1_v2: 255,255,255;
    --primary-light: 0,119,130;
    --primary-medium: 136,212,215;
    --primary-default: 201,240,238;
    --success-light: 40,134,90;
    --success-medium: 138,208,168;
    --success-default: 192,238,208;
    --expose-light: 249,187,66;
    --expose-medium: 255,217,143;
    --expose-default: 255,238,203;
    --warning-light: 208,69,85;
    --warning-medium: 251,169,171;
    --warning-default: 253,220,220;
    --amplified-default: 117,117,117;
    --muted-default: 23,23,23;
    --greyscale-level-7: 23,23,23;
    --greyscale-level-6: 77,77,77;
    --greyscale-level-5: 117,117,117;
    --greyscale-level-4: 153,153,153;
    --greyscale-level-3: 201,201,201;
    --greyscale-level-2: 242,242,242;
    --greyscale-level-1: 255,255,255;
    --primarylightexperimental: 70,70,70;
    --offlineauthenticitydarkexperimental: 237,249,249;
  }
  html,
  body {
    background: RGB(var(--cg7_v2));
  }
  .site {
    background: RGB(var(--cg6_v7));
  }
  .nav-links {
    color: rgb(var(--cg1_v2));
  }
  .web_ui__Button__muted,
  .web_ui__Button__muted.web_ui__Button__inverse.web_ui__Button__filled .web_ui__Button__label {
    color: rgba(var(--amplified-default), 1);
  }
  .web_ui__Text__amplified {
    color: rgba(var(--cg2_v2), 1)
  }
  .web_ui__Tabs__tab {
    color: rgba(var(--cg2_v2), 1);
  }
`;
  
if (typeof GM_addStyle != 'undefined') {
  GM_addStyle(css);
} else if (typeof PRO_addStyle != 'undefined') {
  PRO_addStyle(css);
} else if (typeof addStyle != 'undefined') {
  addStyle(css);
} else {
  var node = document.createElement('style');
  node.type = 'text/css';
  node.appendChild(document.createTextNode(css));
  document.documentElement.appendChild(node);
}

