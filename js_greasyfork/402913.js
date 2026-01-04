// ==UserScript==
// @name Twitter.com: un-trim images on hover
// @namespace myfonj
// @version 1.0.17
// @description Reveal cropped portions of content while post is under mouse pointer.
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/402913/Twittercom%3A%20un-trim%20images%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/402913/Twittercom%3A%20un-trim%20images%20on%20hover.meta.js
// ==/UserScript==

(function() {
let css = `
/*
Twitter.com: un-trim images on hover

https://greasyfork.org/en/scripts/402913/versions/new
RIP https://userstyles.org/styles/175427/edit
	

*/
/*
 let the spice flow. over.
*/
div[aria-label^="Timeline: "] > div > div:hover {
	overflow: visible !important;
	z-index: 10;
}
div[aria-label^="Timeline: "] > div > div:hover * {
	overflow: visible !important;
}
/*
 directly hovered position something always above its unhovered siblings
*/
div[aria-label^="Timeline: "] > div > div:hover *:hover {
	z-index: 20;
}
/*
 counters covered by box would be inaccessible, move them above and make 'em transparent ...
*/
div[aria-label^="Timeline: "] > div > div:hover [role="group"],
div[aria-label^="Timeline: "] > div > div:hover [role="link"][data-focusable="true"][href$="/media_tags"] {
	z-index: 30;
	opacity: 0;
}
	

/* tweet actions */
div[aria-label^="Timeline: "] > div > div:hover [role="group"] {
	outline: 20px solid rgba(0, 0, 0, 0.5);
	background-color: rgba(0, 0, 0, 0.5);
}
/*
 ... until hovered
*/
div[aria-label^="Timeline: "] > div > div:hover [role="group"]:hover,
div[aria-label^="Timeline: "] > div > div:hover [role="link"][data-focusable="true"][href$="/media_tags"]:hover {
	opacity: 1 !important;
}

/*
	fix for external link badge text underlayed by illustration producing non-contrasting text
*/
div[aria-label^="Timeline: "] > div > div:hover a[href^="https://t.co/"][href$="?amp=1"][target="_blank"][role="link"][data-focusable="true"][rel=" noopener noreferrer"]:hover {
	background-color: rgba(0, 0, 0, 0.5);
}
/* tweet text */
div[aria-label^="Timeline: "] > div > div [style^="flex-basis"] + div [dir][lang]:hover,
div[aria-label^="Timeline: "] > div > div [style^="flex-basis"]:hover + div [dir][lang] {
	z-index: 30;
	background-color: rgba(0, 0, 0, 0.5);
	border-left: 10px solid transparent;
	margin-left: -10px;
}
/*
 this is it - this *invisible* image just sits there covering div with very same image as background,
 "squeezed" into wrapper. so let's unleash it while invisible to gain some performace 
*/
div[aria-label^="Timeline: "] > div > div [aria-label] > img {
	width: auto !important;
	height: auto !important;
	max-width: calc(100vw - 20em) !important;
	/* too lazy to measure sidebar for now */
	min-width: calc(100%) !important;
	/* sometimes there is small pic that would otherwise downscale */
	outline: 3px solid black;
	z-index: 100 !important;
}
/*
 tadaa, real pic an all its glory. most probably bigger
*/
div[aria-label^="Timeline: "] > div > div:hover [aria-label] > img {
	opacity: 1 !important;
}
div[aria-label^="Timeline: "] > div > div:hover [aria-label] > img:hover {
	box-shadow: rgba(217, 217, 217, 0.2) 0px 0px 10px, rgba(217, 217, 217, 0.25) 0px 3px 6px 3px;
}

/* 2020-06 - avatars in timeline started to follow same principle, so became hover "jumpy"
	since we are zooming them in detail popups anyway, just be dirty and brutal for now
 2021-03-11 switched to super general SRC URL matching logic 
*/
div[aria-label^="Timeline: "]:not(#\\0) [style*="pbs.twimg.com/profile_images"] + img[src*="pbs.twimg.com/profile_images"],
div[aria-label^="Timeline: "]:not(#\\0) [style*="/default_profile_images/"] + img[src*="/default_profile_images/"] {
	display: none !important;
	outline: 1px solid red !important;
}

/*
	Increase size of avatar pictures in hover popup
	this is hell to debug, so please dont't judge
  the popup has bottom/top according relative placement in viewport
 2021-04-06 they removed [tabindex="-1"]
 2021-12-13 they switched to [style*='clip-path: url("#circle-hw-shapeclip-clipconfig")'] mangledness here as well. But OTOH seems we can use way more simple selector for it
*/
[style^="left: "][style*="px; top: "][style$="px;"] [style^="height: "][style*="px; width: "][style$="px;"] {
 width: 192px !important;
 height: 192px !important;
 image-rendering: crisp-edges;
}
/*
follow / following cell (button)
squeeze a bit
*/
[style^="left: "][style*="px; top: "][style$="px;"] [style^="height: "][style*="px; width: "][style$="px;"] + div > * {
 padding: 0 .2em !important;

}

/*
fix video player controls
since it is serious mess, lets adore the emphemeral structure I had to sieve trough:
*/
/*
// for ilustration, where it begins. from here it is just classes copied from devtools
(unreliable I assume) and some hand copied attributes
html
> body> 
  > div#react-root
    > div.css-1dbjc4n.r-13awgt0.r-12vffkv
      > div.css-1dbjc4n.r-13awgt0.r-12vffkv
        > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010
          > main.css-1dbjc4n.r-1habvwh.r-16xksha.r-1wbh5a2
            > div.css-1dbjc4n.r-150rngu.r-16y2uox.r-1wbh5a2.r-33ulu8
              > div.css-1dbjc4n.r-aqfbo4.r-16y2uox
                > div.css-1dbjc4n.r-1oszu61.r-1niwhzg.r-18u37iz.r-16y2uox.r-1wtj0ep.r-2llsf.r-13qz1uu
                  > div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c
                    > div.css-1dbjc4n
                      > div.css-1dbjc4n
                        > div.css-1dbjc4n.r-16y2uox
                          > div.css-1dbjc4n.r-1jgb5lz.r-1ye8kvj.r-13qz1uu
                            > div.css-1dbjc4n
                              > section.css-1dbjc4n
                                > div.css-1dbjc4n[aria-label^="Timeline: "]:not([REM="yup, this is the timeline"])
                                  > div[style^="position: relative; min-height: "][style$="px;"]
                                    > div[style^="position: absolute; width: 100%; transform: translateY("][style$="px); transition: opacity 0.3s ease-out 0s;"]:not([REM="THIS IS ACTUAL POST WRAPPER"])
                                      > div.css-1dbjc4n.r-1ila09b.r-qklmqi.r-1adg3ll.r-1ny4l3l
                                        > div.css-1dbjc4n
                                          > article.css-1dbjc4n.r-1loqt21.r-18u37iz.r-1ny4l3l.r-o7ynqc.r-6416eg
                                            > div.css-1dbjc4n.r-eqz5dr.r-16y2uox.r-1wbh5a2
                                              > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1ny4l3l.r-1udh08x.r-1yt7n81.r-ry3cjt
                                                > div.css-1dbjc4n
                                                  > div.css-1dbjc4n.r-18u37iz
                                                    > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1mi0q7o
                                                      > div.css-1dbjc4n
                                                        > div.css-1dbjc4n
                                                          > div[class]:only-child
                                                            > div[class]:only-child
                                                              > div[class]:only-child
                                                                > div[class]:only-child
                                                                |
_______________________________________________________________/
/ from here on just "reliable" attributes and pseudo-structure
|
> div[style="padding-bottom: 56.25%;"]:first-child
+ div:last-child
  > div[data-testid="placementTracking"]
    > div[data-testid="videoPlayer"]
      > div
        > div[style="padding-bottom: 56.25%;"]:first-child
        + div:last-child
          > div[style="height: 100%; position: relative; transform: translateZ(0px); width: 100%;"]
            > div[style="height: 100%; position: absolute; width: 100%;"]:not([class]):first-child
              > div[style="position: relative; width: 100%; height: 100%; background-color: transparent; overflow: hidden;"]
                > video:not([REM="OMG, here is the video"])
            + div:not([style]):last-child
              > div:not([class]):only-child
                > div:first-child:not([REM="this is the bugger I couldn't push under the video controls"])
                + div:not([class])
                + div:not([class])
                + div:not([class])
                  > div[style="transition-duration: 250ms; transition-property: opacity, height; transition-timing-function: ease; will-change: opacity; opacity: 1;"]
                    > div[class]
                      > div[style="background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.77));"]
                        > div:first-child:not([REM="this is progress / seeker wrapper"])
                        + div:last-child:not([REM="this is video controls wrapper"])
*/

div[style^="padding-bottom: "][style$="%;"]:first-child
+ div:last-child
  > div[data-testid="placementTracking"]
    > div[data-testid="videoPlayer"]
      > div
        > div[style^="padding-bottom: "][style$="%;"]:first-child
        + div:last-child
          > div[style="height: 100%; position: relative; transform: translateZ(0px); width: 100%;"]
            > div[style="height: 100%; position: absolute; width: 100%;"]:not([class]):first-child
            + div:not([style]):last-child
              > div:not([class]):only-child
                > div:first-child:not([REM="this is the bugger I couldn't push under the video controls"])
{
  z-index: 0;
}
/*
[:shivers:]
*/
	
 

/*
§ dim sidebar until hovered
*/
 [data-testid="sidebarColumn"]:not(:hover) {
   opacity: .7
 }

/*
§ old school "inacessible" follow buttons - use primary "white on blue" instead of black on white
*/
div[role="button"][tabindex="0"][aria-label^="Follow @"] {
 background-color: rgb(29, 161, 242) !important;
}
div[role="button"][tabindex="0"][aria-label^="Follow @"]:focus,
div[role="button"][tabindex="0"][aria-label^="Follow @"]:hover {
 background-color: rgb(19, 141, 212) !important;
}
div[role="button"][tabindex="0"][aria-label^="Follow @"] * {
 color: #fff !important;
}

div[role="button"][tabindex="0"][aria-label^="Following @"] {
 background-color: darkgreen !important;
}
div[role="button"][tabindex="0"][aria-label^="Following @"]:hover ,
div[role="button"][tabindex="0"][aria-label^="Following @"]:focus {
 background-color: darkred !important;
}
div[role="button"][tabindex="0"][aria-label^="Following @"] * {
 color: #fff !important;
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
