// ==UserScript==
// @name         Rock Paper Shotgun Restyler Modified
// @namespace    https://github.com/Amstrad00/rps-restyler-darker
// @version      1.5.10
// @description  Tweaks the styling of Rock Paper Shotgun to be darker.
// @author       Amstrad00
// @match        https://www.rockpapershotgun.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370480/Rock%20Paper%20Shotgun%20Restyler%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/370480/Rock%20Paper%20Shotgun%20Restyler%20Modified.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const d = document;
    const style = d.createElement("style");
    const logo = `data:image/png;base64,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`;
    const green = "#009C7C";
    const purple = "#381A72";
    const logoPurple = "#7C5FB3";
    const searchPurple = "#322450";
    const searchPlaceholder = "#000000";
    const breakingPurple = "#564380";
    const red = "#dd2e2e";
    const oldred = "#c1272c";
    const white = "#F1F0F2";
    const black = "#1a1a1a"
    const doubleblack = "#000000"
    const maxWidth = "1440px";
    style.innerHTML = `
/* use a system font stack instead of custom web fonts */
* { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important; }
i.fa { font-family: FontAwesome !important; }

/* hide ad sections and adblock banner */
.support-us-promo, .leaderboards, .page>aside, .billboard-container, #recommendations, div[id^="sp_message"], div[class^=sp_veil] { display: none !important; }

/* hide the top spotlight */
.above .spotlight { display: none; }

/* hide inline recommendations */
.mormont-recommendations { display: none; }

/* fix page width and background color */
.page { width: ${1440} !important; }
html, body { overflow-x: hidden !important; }
body { background-color: ${black} !important; }

/* restyle breaking section */
.breaking { background-color: ${black} !important; padding: 0.5rem 1rem !important; font-size: 0.75rem !important; }
.breaking p:before { content: "RIGHT NOW:"; font-size: 0.75rem; font-weight: bold; color: white; margin-right: 0.65rem; }
.breaking p { padding: 0 !important; color: ${black} !important; max-width: ${maxWidth} !important; }
.breaking a:link {color: ${oldred} !important; background-color: transparent !important; }
.breaking a:visited {color: ${red} !important; background-color: transparent !important; }

/* rework header */
.header-desktop a.logo {
  width: 17.5% !important;
  height: 8rem !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  display: block;
  background-image: url("${logo}");
}
.header-desktop .container { width: 100% !important; max-width: ${maxWidth} !important; }
.header-desktop a.logo img { display: none !important; }
.header-desktop { background-color: ${doubleblack} !important; height: 10rem !important; padding: 1.25rem !important; background: #21133F; color: #eee !important; border-bottom: 0px !important; }
.header-desktop a { color: ${oldred} } !important;
.header-desktop a.button { color: white !important; }
.header-desktop .primary a:link {color: ${oldred} !important; background-color: transparent !important; }
.header-desktop .primary a:visited {color: ${red} !important; background-color: transparent !important; }
.header-desktop .primary { font-size: .95rem !important; }
.header-desktop .secondary { font-size: .95rem !important; line-height: 1.2 !important; top: -.25rem !important; }
.header-desktop .secondary a:link {color: ${oldred} !important; background-color: transparent !important; }
.header-desktop .secondary a:visited {color: ${red} !important; background-color: transparent !important; }
.header-desktop .search { width: 40% !important; top: 5.25rem !important; right: 0 !important; left: unset !important; }
.header-desktop .search input { background: ${red} !important; border: 0 !important; color: ${white} !important; font-size: 0.825rem !important; }
.header-desktop .search ::placeholder { color: ${searchPlaceholder}; }
.header-desktop .search .button { border-top-left-radius: 0; border-bottom-left-radius: 0; }
.header-desktop .account { right: 0 !important; width: auto !important; top: 0.5rem !important; border-color: ${red} !important; }
.header-desktop .account .button { color: ${white} !important; background-color: ${oldred} important! }
.header-desktop .support-us { right: -1.25rem !important; width: 14rem !important; top: -3.25rem !important; font-weight: bold !important; padding: 0 !important; }
.header-desktop .support-us .button { color: ${white} !important; background-color: ${oldred} !important; border-radius: 0 !important; font-size: 0.75rem !important; padding: 0.5rem 0 !important; height: 2rem; }

/* tweak main content */
main { background-color: ${white} !important; padding-bottom: 0.75rem !important; }
main .above { padding-right: 0 !important; }
main .above .section-title { display: none !important; }
main .above a:link {color: ${oldred} !important; background-color: transparent !important; }
main .above a:visited {color: ${red} !important; background-color: transparent !important; }
#comments { padding-left: 0 !important; }
.comments-container { margin: 0 auto !important; }

/* make buttons & tags red on featured articles */
article.feature img.icon { filter:hue-rotate(25deg) brightness(85%) contrast(120%); }
article.feature .button, article.feature + script + div .button { color:${white} !important; background-color: ${red} !important; }
article.feature + script + div>p a { color: ${red} !important; }

/* make buttons & tags red on premium articles */
article.premium img.icon { filter:hue-rotate(75deg) brightness(155%) contrast(120%); }
article.premium .button, article.premium + script + div .button { color:${white} !important; background-color: ${red} !important; }
article.premium + script + div>p a { color: ${red} !important; }

/* tweak and improve comment coloring */
main .below a:link {color: ${oldred} !important; background-color: transparent !important; }
main .below a:visited {color: ${red} !important; background-color: transparent !important; }
.blog-post .images img, .button { color:${white} !important; border-color: ${oldred} !important; background-color: ${oldred} !important; }
.comment>.details .username { color: black !important; }
.comment>.details .button { border-color: ${oldred} !important; background-color: ${oldred} !important; color:${white} !important; }
.comment>.details .button.outline { background-color: transparent !important; color: ${oldred} !important; }
.comment.premium_user>.details .username, .comment.premium_user>.details .tag { color: ${purple} !important; }
.comment.premium_user>.details .button { border-color: ${oldred} !important; background-color: ${oldred} !important; color:${white} !important; }
.comment.premium_user>.details .button.outline { background-color: transparent !important; color: ${oldred} !important; }
.comment.premium_user.administrator>.details .tag { display: none; }
.comment.administrator { border-color: ${oldred} !important; }
.comment.administrator>.details .username { color: ${oldred} !important; }
.comment.administrator>.details .username:after { content: "(RPS Staff)"; font-weight: normal; margin-left: 0.25rem; }
.comment.administrator>.details .button { border-color: ${oldred} !important; background-color: ${oldred} !important; color:${white} !important; }
.comment.administrator>.details .button.outline { background-color: transparent !important; color: ${oldred} !important; }


/* add very slightly rounded corners to blog images and buttons */
.blog-post .images img, .button { border-radius: 0.125rem; }
.blog-post.feature .images img { border-top-left-radius: 0; }

/* bolden tags */
p.tags a { font-weight: bold; }

/* increase "read more" button size and restyle it */
.blog-post .button:not(.outline), .spotlight-bar .button {
  font-size: 1rem !important;
  padding: 0.6rem !important;
  font-weight: 500 !important;
  width: 100%;
  transition: background-color 0.25s, color 0.25s;
  background-color: #FDFCFF !important;
  border: 0.05rem solid ${oldred};
  color: ${oldred} !important;
}
.blog-post .button:not(.outline):hover, .spotlight-bar .button:hover { background-color: ${oldred} !important; color: white !important; }
.blog-post.feature .button:not(.outline) { border-color: ${red}; color: ${red} !important; }
.blog-post.feature .button:not(.outline):hover { background-color: ${red} !important; color: white !important; }


/* add bigger divider between blog posts */
.blog-post { border-bottom: 1px solid ${oldred} !important; }
.blog-post .tags:after { display: none !important; }
.blog-post.feature { border-color: ${red} !important; }
.blog-post:last-of-type { border: none !important; }

/* add small FEATURE text under featured article logo */
@media screen and (min-width: 1025px) {
.blog-post.feature:before {
  content: "FEATURE";
  position: absolute;
  right: 100%;
  top: 4rem;
  padding: 0.1rem 0.05rem;
  color: ${red};
  font-weight: bold;
}
}

/* various tweaks to below post section */
.have-you-played-widget .button {
  font-size: 1rem !important;
  font-weight: 500rem !important;
  padding: 0.6rem !important;
}
.below { margin-top: 1rem !important; padding-top: 1rem !important; }
.below .section-title { font-size: 1.25rem !important; }
.spotlight-bar .spotlight-bar-item { min-height: 10rem !important; }
.spotlight-bar { margin-bottom: 1rem !important; padding-bottom: 1rem !important; }
.spotlight-bar .button { margin-top: 1rem !important; }
    `;
    d.head.appendChild(style);
})();
