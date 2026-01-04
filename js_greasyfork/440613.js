// ==UserScript==
// @name         YouTube - Proper Description
// @namespace    q1k
// @version      2.2.7
// @description  Watch page description below the video with proper open/close toggle, instead of a side bar.
// @author       q1k
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @compatible   Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/440613/YouTube%20-%20Proper%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/440613/YouTube%20-%20Proper%20Description.meta.js
// ==/UserScript==

var debug_mode = true;

if(typeof window.isSecureContext !== 'undefined' && window.isSecureContext){
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (string, sink) => string,
            createScript: (string, sink) => string,
            createScriptURL: (string, sink) => string
        });
    }
}
async function findElement(selector) {
    return new Promise(function(resolve) {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(function(mutations) {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}
function watchExistingButtonForChange(oldbutton, newbutton, newbuttontext) {
    if(newbutton.innerText.trim().length>0) {
        return;
    }
    newbuttontext.innerText = oldbutton.innerText.replace("...","").trim();
    var mo = new MutationObserver(function(mutations) {
        if(oldbutton.innerText.trim().length>0) {
            newbuttontext.innerText = oldbutton.innerText.replace("...","").trim();
            mo.disconnect();
        }
    });
    mo.observe(oldbutton, {
        childList: true,
        subtree: true,
        characterData: true
    });
}
var more, less, description;
function addButton(open, idname, button_current) {
    let button_new = document.createElement("div");
    //button.setAttribute("id", idname);
    button_new.setAttribute("class","desc_toggles "+idname);
    button_new.innerHTML = "<div class='desc_text more-button style-scope ytd-video-secondary-info-renderer'></div>";
    let button_new_text = button_new.querySelector(".desc_text");
    button_current.parentNode.appendChild(button_new);
    description = button_current.closest("#description-inline-expander");
    return [button_new, button_new_text];
}

var styles = document.createElement("style");
styles.innerHTML=`
/* remove */
ytd-watch-metadata #description #info-container, ytd-watch-metadata #description ytd-watch-info-text, /*view and date info*/
ytd-watch-metadata #comment-teaser, /*comment teaser*/
ytd-watch-metadata #bottom-row #description-inner #description-interaction {/*click effect on description*/
  display: none !important;
}
/*title and general look*/
ytd-watch-metadata { margin-top: 0; padding-top: 20px;/*2rem;*/ padding-bottom: 16px; border-bottom: 1px solid var(--yt-spec-10-percent-layer); }
ytd-watch-metadata #title h1 { font-family: 'Roboto',sans-serif; line-height: 2.6rem; font-weight: 400; font-size: 1.8rem; max-height: 5.2rem; }

/*moved views/date from #bottom-row #info-container*/
ytd-watch-metadata #title #info { line-height: 2rem; font-size: 1.4rem; font-weight: 400; color: var(--yt-spec-text-secondary); /*#aaa*/ display: initial; }
/**/
ytd-watch-metadata #title #info > *:nth-child(2n) { font-size: 0; }
ytd-watch-metadata #title #info > *:nth-child(2n):before { content: " • "; font-size: 1.4rem; user-select: none; }
ytd-watch-metadata #title #info { display: initial; }
ytd-watch-metadata #title #info > span { display: none; }
ytd-watch-metadata #title #info > * { font-weight: 400; }
ytd-watch-metadata #title #info > a[href*='hashtag'] ~ span { display: inline; }
/**/
ytd-watch-metadata #top-row > #info > * { /*moved views/date from #bottom-row #info-container*/ line-height: 2rem; font-size: 1.4rem; font-weight: 400; color: var(--yt-spec-text-secondary); /*#aaa*/ }
/*ytd-watch-metadata #top-row > #info > *:nth-child(2) { font-size: 0; }
ytd-watch-metadata #top-row > #info > *:nth-child(2):before { content: " • "; font-size: 1.4rem; user-select: none; }*/
/*action buttons top-row*/
ytd-watch-metadata #top-row { display: flex !important; align-items: center; margin: 0 !important; padding-bottom: 5px !important; border-bottom: 1px solid var(--yt-spec-10-percent-layer); /*dark: rgba(255, 255, 255, 0.2), light: rgba(0, 0, 0, 0.1)*/}
ytd-watch-metadata #top-row #actions { margin-top: 0; }
ytd-watch-metadata #top-row #actions #menu ytd-menu-renderer { justify-content: flex-end !important; }

/*views and date - created element populated automatically from #bottom-row #tooltip*/

/*moved channel info #owner from top-row to before bottom-row - profile pic-name, subscribe button, subs number, etc*/
ytd-watch-metadata #owner { margin: 0 0 12px 0 !important; padding: 16px 0 0 0 !important; max-width: none !important; width: auto !important; }
/*general bottom-row look and other fixes*/
ytd-watch-metadata #bottom-row { margin: 0 !important; }
ytd-watch-metadata #bottom-row #description-inner { margin: 0; }
ytd-watch-metadata #bottom-row #description { cursor: auto; background: none !important; border-radius: 0; margin: 0 12px 0 0; margin: 0; /*padding-bottom: 1em;*/ /*border-bottom: 1px solid var(--yt-spec-10-percent-layer);*/ }
/*hide tooltip when hovered date info */
ytd-watch-metadata #bottom-row #description-inner > tp-yt-paper-tooltip[for="info"] { display: none; }
ytd-watch-metadata #bottom-row ytd-text-inline-expander #snippet { -webkit-mask-image: none !important; mask-image: none !important; }

ytd-watch-metadata #owner #avatar { width: 48px; height: 48px; }
ytd-watch-metadata #owner a { line-height: 1; }
ytd-watch-metadata #owner #avatar img { width: 100%; }
ytd-watch-metadata #owner ytd-video-owner-renderer { width: 100%; }

/*
ytd-watch-metadata #bottom-row #description-inner ytd-text-inline-expander[is-expanded][closed="true"] {
  max-height: 60px;
  overflow: hidden;
}
ytd-watch-metadata #bottom-row #description-inner ytd-text-inline-expander[is-expanded]:not([closed="true"]) {
  max-height: none;
}*/

ytd-watch-metadata #description [is-expanded] #ellipsis {
  display: none;
}
ytd-watch-metadata #expand.ytd-text-inline-expander,
ytd-watch-metadata #collapse.ytd-text-inline-expander {
  position: static;
  margin-top: 1rem !important;
  text-transform: uppercase;
  color: var(--yt-spec-text-secondary); /*#aaa*/
  /*font-size: 1.2rem;
  line-height: 1.8rem;*/
}
ytd-watch-metadata #expand.ytd-text-inline-expander paper-ripple,
ytd-watch-metadata #collapse.ytd-text-inline-expander paper-ripple {
  display: none !important;
}

/*******************************************************************/
/*wide show-hide buttons*/
/*ytd-watch-metadata #description #expand,
ytd-watch-metadata #description #collapse { border-color: rgba(0,0,0,0.125); padding-bottom: 0; border-bottom: none; }
[dark] ytd-watch-metadata #description #expand,
[dark] ytd-watch-metadata #description #collapse { border-color: rgba(255,255,255,0.125); }

ytd-watch-metadata #description #expand,
ytd-watch-metadata #description #collapse { margin-left: 0; }
ytd-watch-metadata #description #expand,
ytd-watch-metadata #description #collapse { width: 100%; border-top: 1px solid; border-radius: 0; text-align: center; cursor: pointer; margin-top: 1em; background: linear-gradient(rgba(0,0,0,0.02), transparent); }
[dark] ytd-watch-metadata #description #expand,
[dark] ytd-watch-metadata #description #collapse { background: linear-gradient(rgba(255,255,255,0.02), transparent); }
ytd-watch-metadata #description #expand:hover,
ytd-watch-metadata #description #collapse:hover { background: rgba(0,0,0,0.03); }
[dark] ytd-watch-metadata #description #expand:hover,
[dark] ytd-watch-metadata #description #collapse:hover { background: rgba(255,255,255,0.03); }
[dark] ytd-watch-metadata #description #expand,
[dark] ytd-watch-metadata #description #collapse { margin: 0; padding: 4px; }
ytd-watch-metadata { border-bottom: none; padding-bottom: 0; }
*/
/*
ytd-watch-metadata, ytd-watch-metadata .desc_toggles { border-color: rgba(0,0,0,0.125); padding-bottom: 0; border-bottom: none; }
[dark] ytd-watch-metadata, [dark] ytd-watch-metadata .desc_toggles { border-color: rgba(255,255,255,0.125); }

#description, #description > * { margin-left: 0; }
ytd-watch-metadata .desc_toggles { width: 100%; border-top: 1px solid; border-radius: 0; text-align: center; cursor: pointer; margin-top: 1em; background: linear-gradient(rgba(0,0,0,0.02), transparent); }
[dark] ytd-watch-metadata .desc_toggles { background: linear-gradient(rgba(255,255,255,0.02), transparent); }
ytd-watch-metadata .desc_toggles:hover { background: rgba(0,0,0,0.03); }
[dark] ytd-watch-metadata .desc_toggles:hover { background: rgba(255,255,255,0.03); }
ytd-watch-metadata .desc_toggles .desc_text { margin: 0; padding: 4px; }
*/
/********************************************************************/

/*ytd-watch-metadata { *//*display: none !important;*//* }
#meta-contents[hidden], #info-contents[hidden]{ display: block !important; }*/

ytd-watch-metadata #description .desc_toggles { display: none; cursor: pointer; }

/*ytd-watch-metadata tp-yt-paper-button#expand, ytd-watch-metadata tp-yt-paper-button#collapse, ytd-watch-metadata #description-inline-expander:not([is-expanded]) .description_close, ytd-watch-metadata #description-inline-expander[is-expanded] .description_open, ytd-watch-metadata #description-inline-expander tp-yt-paper-button#expand[hidden] ~ tp-yt-paper-button#collapse[hidden] ~ div.desc_toggles { display: none !important; }
*/
ytd-watch-metadata tp-yt-paper-button#expand, ytd-watch-metadata tp-yt-paper-button#collapse { display: none !important; }

ytd-watch-metadata #description-inline-expander[is-expanded] .description_close, ytd-watch-metadata #description-inline-expander:not([is-expanded]) .description_open { display: block !important; }


/*ytd-video-primary-info-renderer[use-yt-sans20-light] .title.ytd-video-primary-info-renderer { line-height: 2.6rem !important; font-weight: 400 !important; font-size: 1.8rem !important; font-family: "Roboto",sans-serif !important; }
/*#player #cinematics, #player #cinematics canvas { display: none !important; }*/
/**/
/*game info cards*/
[dark] ytd-rich-metadata-renderer[darker-dark-theme] a { background-color: #242424;/*rgba(255,255,255,0.05;*/ }

#description ytd-media-lockup-renderer #description { padding-left: 1em; margin-left: 2px !important; }

/*uploader profile pic*/
#meta #avatar { width: 48px; height: 48px; margin-right: 16px; }
#meta #avatar img { width: 100%; }
/**/


/**/

/**/
ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal { background: transparent !important; }
ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover, #info .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover { /*background: rgba(0,0,0,0.1) !important;*/ }
[dark] ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover, [dark] #info .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover { /*background: rgba(255,255,255,0.1) !important;*/ }
/**/
ytd-watch-metadata ytd-menu-renderer:not(.ytd-video-description-infocards-section-renderer) button, ytd-watch-metadata ytd-button-renderer:not(.ytd-video-description-infocards-section-renderer) yt-button-shape button, ytd-watch-metadata ytd-button-renderer:not(.ytd-video-description-infocards-section-renderer) yt-button-shape a { border-radius: 0 !important; }
ytd-watch-metadata ytd-toggle-button-renderer tp-yt-paper-tooltip #tooltip, #info ytd-button-renderer tp-yt-paper-tooltip #tooltip { width: max-content; }
ytd-watch-metadata #top-level-buttons-computed  button { padding: 0 12px; text-transform: uppercase; }
ytd-watch-metadata #top-level-buttons-computed ytd-button-renderer button { padding: 0 8px; text-transform: uppercase; }
ytd-watch-metadata #top-level-buttons-computed > *:not(:first-child) { margin: 0 0 0 8px; }
ytd-watch-metadata #flexible-item-buttons > * { margin-left: 8px;}
ytd-watch-metadata #flexible-item-buttons  button, ytd-watch-metadata #flexible-item-buttons a { padding: 0 8px; text-transform: uppercase; }
ytd-segmented-like-dislike-button-renderer button { padding: 0 12px !important; }

ytd-watch-metadata ytd-menu-renderer > #button-shape { margin-left: 3px !important; } /*ellipsis menu hidden actions*/

/*fix for Return Youtube Dislikes*/
/*ytd-watch-metadata #top-level-buttons-computed { position: relative; }
ytd-segmented-like-dislike-button-renderer button span#text { margin-left: 6px; }
ytd-watch-metadata ytd-menu-renderer[has-flexible-items] { *//*overflow:unset !important;*//* }
ytd-watch-metadata ytd-segmented-like-dislike-button-renderer { position: relative; }
ytd-watch-metadata ytd-segmented-like-dislike-button-renderer button > .yt-spec-button-shape-next__icon { margin-left: -4px !important}
ytd-watch-metadata ytd-segmented-like-dislike-button-renderer #segmented-dislike-button button { width: auto !important; padding: 0 12px 0 12px !important; }
ytd-watch-metadata .ryd-tooltip { position: absolute; bottom: 0px; margin: 0 !important; top: auto; left: 0; width: 100% !important; /*display: none;*//* }
ytd-watch-metadata ytd-segmented-like-dislike-button-renderer .ryd-tooltip { display: block; }
ytd-watch-metadata #ryd-bar-container { width: 100% !important; }
ytd-watch-metadata #ryd-dislike-tooltip { top: -40px !important; pointer-events: none; }*/

ytd-watch-metadata .ryd-tooltip { position: absolute; margin: 0 !important; bottom: -5px; }
ytd-watch-metadata .ryd-tooltip-bar-container { padding-bottom: 16px; }
ytd-watch-metadata #ryd-dislike-tooltip { top: auto !important; bottom: 0; pointer-events: none; }

/**/
ytd-comments#comments #replies #expander .more-button button,
ytd-comments#comments #replies #expander .less-button button { background: transparent !important; }
ytd-comments#comments #replies #expander .more-button button yt-touch-feedback-shape,
ytd-comments#comments #replies #expander .less-button button yt-touch-feedback-shape { display: none !important; }
/*remove like animation*/
ytd-segmented-like-dislike-button-renderer #segmented-like-button button lottie-component svg > g > g[clip-path*="url(#__lottie_element_"] { transform: matrix(1.0880000591278076,0,0,1.0880000591278076,69.95299530029297,67.9433822631836) !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button lottie-component svg g g g { transform: matrix(1,0,0,1,60,60) !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button lottie-component svg > g > g[clip-path*="url(#__lottie_element_"]:first-child { display: none !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button lottie-component svg g path { fill: #000 !important; stroke: #000; }
[dark] ytd-segmented-like-dislike-button-renderer #segmented-like-button button lottie-component svg g path { fill: #fff !important; stroke: #fff; }

ytd-segmented-like-dislike-button-renderer #segmented-like-button button svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(1) path { d:path(" M25.025999069213867,-4.00600004196167 C25.025999069213867,-4.00600004196167 5.992000102996826,-3.996999979019165 5.992000102996826,-3.996999979019165 C5.992000102996826,-3.996999979019165 11.012999534606934,-22.983999252319336 11.012999534606934,-22.983999252319336 C12.230999946594238,-26.90399932861328 13,-31.94300079345703 8.994000434875488,-31.981000900268555 C7,-32 5,-32 4.021999835968018,-31.007999420166016 C4.021999835968018,-31.007999420166016 -19.993000030517578,-5.03000020980835 -19.993000030517578,-5.03000020980835 C-19.993000030517578,-5.03000020980835 -20.027999877929688,32.025001525878906 -20.027999877929688,32.025001525878906 C-20.027999877929688,32.025001525878906 20.97599983215332,31.986000061035156 20.97599983215332,31.986000061035156 C25.010000228881836,31.986000061035156 26.198999404907227,29.562000274658203 26.99799919128418,25.985000610351562 C26.99799919128418,25.985000610351562 31.972000122070312,4.026000022888184 31.972000122070312,4.026000022888184 C33,-0.6930000185966492 30.392000198364258,-4.00600004196167 25.025999069213867,-4.00600004196167z") !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(3) path { d:path(" M-27.993000030517578,-4.015999794006348 C-27.993000030517578,-4.015999794006348 -36.02799987792969,-3.996999979019165 -36.02799987792969,-3.996999979019165 C-36.02799987792969,-3.996999979019165 -36,31.9950008392334 -36,31.9950008392334 C-36,31.9950008392334 -28.027999877929688,31.976999282836914 -28.027999877929688,31.976999282836914 C-28.027999877929688,31.976999282836914 -27.993000030517578,-4.015999794006348 -27.993000030517578,-4.015999794006348z") !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button[aria-pressed="false"] svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(1),
ytd-segmented-like-dislike-button-renderer #segmented-like-button button[aria-pressed="false"] svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(3) { display: none !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button[aria-pressed="true"] svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(1),
ytd-segmented-like-dislike-button-renderer #segmented-like-button button[aria-pressed="true"] svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(3) { display: block !important; }

ytd-segmented-like-dislike-button-renderer #segmented-like-button button svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(2) path { d:path(" M25.025999069213867,-4.00600004196167 C25.025999069213867,-4.00600004196167 5.992000102996826,-3.996999979019165 5.992000102996826,-3.996999979019165 C5.992000102996826,-3.996999979019165 11.012999534606934,-22.983999252319336 11.012999534606934,-22.983999252319336 C12.230999946594238,-26.90399932861328 13,-31.94300079345703 8.994000434875488,-31.981000900268555 C7,-32 5,-32 4.021999835968018,-31.007999420166016 C4.021999835968018,-31.007999420166016 -19.993000030517578,-5.03000020980835 -19.993000030517578,-5.03000020980835 C-19.993000030517578,-5.03000020980835 -20.027999877929688,32.025001525878906 -20.027999877929688,32.025001525878906 C-20.027999877929688,32.025001525878906 20.97599983215332,31.986000061035156 20.97599983215332,31.986000061035156 C25.010000228881836,31.986000061035156 26.198999404907227,29.562000274658203 26.99799919128418,25.985000610351562 C26.99799919128418,25.985000610351562 31.972000122070312,4.026000022888184 31.972000122070312,4.026000022888184 C33,-0.6930000185966492 30.392000198364258,-4.00600004196167 25.025999069213867,-4.00600004196167z") !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(4) path { d:path(" M-19.986000061035156,-4.03000020980835 C-19.986000061035156,-4.03000020980835 -36.020999908447266,-3.996999979019165 -36.020999908447266,-3.996999979019165 C-36.020999908447266,-3.996999979019165 -36.00199890136719,31.993000030517578 -36.00199890136719,31.993000030517578 C-36.00199890136719,31.993000030517578 -20.030000686645508,32.02299880981445 -20.030000686645508,32.02299880981445 C-20.030000686645508,32.02299880981445 -19.986000061035156,-4.03000020980835 -19.986000061035156,-4.03000020980835z") !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button[aria-pressed="false"] svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(2),
ytd-segmented-like-dislike-button-renderer #segmented-like-button button[aria-pressed="false"] svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(4) { display: block !important; }
ytd-segmented-like-dislike-button-renderer #segmented-like-button button[aria-pressed="true"] svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(2),
ytd-segmented-like-dislike-button-renderer #segmented-like-button button[aria-pressed="true"] svg g g[clip-path*="url(#__lottie_element_"] > :nth-child(4) { display: none !important; }

`;

var styles_channel = document.createElement("style");
styles_channel.innerHTML=`
/*general buttons, light and dark theme*/
#subscribe-button ytd-button-renderer a,
ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer a,
ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer button,
#channel-header-container #meta ~ #buttons ytd-button-renderer a,
#channel-header-container #meta ~ #buttons ytd-button-renderer button,
yt-flexible-actions-view-model button-view-model button
{ border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px;
 background: /*rgb(7,92,211,0.1)*/ transparent !important; border: 1px solid #075cd3 !important; color: #075cd3 !important; }

[dark] #subscribe-button ytd-button-renderer a,
[dark] ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer a,
[dark] ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer button,
[dark] #channel-header-container #meta ~ #buttons ytd-button-renderer a,
[dark] #channel-header-container #meta ~ #buttons ytd-button-renderer button,
yt-flexible-actions-view-model button-view-model button
{ background: /*rgba(62,166,255,0.1)*/ transparent !important; border: 1px solid #3ea6ff !important; color: #3ea6ff !important; }

/*
light{ background: rgba(0,0,0,0.1) !important; border: none !important; color: #000 !important; }
dark{ background: rgba(255,255,255,0.1) !important; border: none !important; color: #aaa !important; }
*/

/*owner buttons*/
#edit-buttons ytd-button-renderer a,
#edit-buttons ytd-button-renderer button,
yt-flexible-actions-view-model button-view-model button
{ letter-spacing: 0.5px; background: rgb(7,92,211,0.1) !important; border: 1px solid #075cd3 !important; color: #075cd3 !important; }
[dark] #edit-buttons ytd-button-renderer a,
[dark] #edit-buttons ytd-button-renderer button,
yt-flexible-actions-view-model button-view-model button
{ background: rgba(62,166,255,0.1) !important; border: 1px solid #3ea6ff !important; color: #3ea6ff !important; }
#sponsor-button ytd-button-renderer button { border-radius: 2px !important; text-transform: uppercase !important; }

/*sub button*/
#subscribe-button ytd-subscribe-button-renderer[subscribed] #subscribe-button-shape button { display: none; }
#subscribe-button ytd-subscribe-button-renderer { width: max-content !important; }
#subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--filled,
#subscribe-button ytd-button-renderer button.yt-spec-button-shape-next--filled,
yt-subscribe-button-view-model button.yt-spec-button-shape-next--filled { background: #c00 !important; color: #fff !important; }
#subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal,
#subscribe-button ytd-button-renderer button.yt-spec-button-shape-next--tonal,
yt-subscribe-button-view-model button.yt-spec-button-shape-next--tonal { background: rgba(0,0,0,0.1) !important; color: #000 !important; }
[dark] #subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal,
[dark] #subscribe-button ytd-button-renderer button.yt-spec-button-shape-next--tonal,
[dark] yt-subscribe-button-view-model button.yt-spec-button-shape-next--tonal { background: rgba(255,255,255,0.1) !important; color: #aaa !important; }
#subscribe ytd-subscribe-button-renderer button,
#subscribe ytd-button-renderer button,
#subscribe-button ytd-subscribe-button-renderer button,
#subscribe-button ytd-button-renderer button,
yt-subscribe-button-view-model button { letter-spacing: 0.5px; border-radius: 2px !important; text-transform: uppercase !important; }
/*animation*/
#subscribe-button ytd-subscribe-button-renderer .smartimation__border,
yt-subscribe-button-view-model yt-touch-feedback-shape,
yt-subscribe-button-view-model [class*="animated-action_"],
#subscribe .animated-action__background-container,
#subscribe-button .animated-action__background-container { border-radius: 2px !important; }
yt-subscribe-button-view-model { width: auto !important; }
#subscribe-button ytd-subscribe-button-renderer button .yt-spec-button-shape-next__icon { margin-left: -6px; margin-right: 6px; }
#subscribe-button ytd-subscribe-button-renderer button .yt-spec-button-shape-next__button-text-content ~ .yt-spec-button-shape-next__button-text-content { display: none; }

/*join/joined button */
#sponsor-button ytd-button-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
yt-flexible-actions-view-model button-view-model button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal
{ background: /*rgb(7,92,211,0.1)*/ transparent !important; border: 1px solid #075cd3 !important; color: #075cd3 !important; }
[dark] #sponsor-button ytd-button-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
[dark] yt-flexible-actions-view-model button-view-model button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal
{ background: /*rgba(62,166,255,0.1)*/ transparent !important; border: 1px solid #3ea6ff !important; color: #3ea6ff !important; }

ytd-watch-metadata ytd-video-owner-renderer #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal,
#channel-header-container #meta ~ #buttons #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal,
yt-flexible-actions-view-model button-view-model button.yt-spec-button-shape-next--tonal
{ background: rgba(0,0,0,0.1) !important; color: #000 !important; border: none !important; }

[dark] ytd-watch-metadata ytd-video-owner-renderer #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal,
[dark] #channel-header-container #meta ~ #buttons #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal,
[dark] yt-flexible-actions-view-model button-view-model button.yt-spec-button-shape-next--tonal
{ background: rgba(255,255,255,0.1) !important; color: #aaa !important; border: none !important; }


/*community button*/
a[href*="/community"] { border-radius: 4px; text-transform: uppercase; }
[dark] a[href*="/community"] { background: rgba(255,255,255,0.125); }
[dark] a[href*="/community"]:hover { background: rgba(255,255,255,0.2); }


`;

/*
var styles_alt = document.createElement("style");
    styles_alt.innerHTML=`
ytd-watch-metadata, ytd-watch-metadata .desc_toggles { border-color: rgba(0,0,0,0.125); padding-bottom: 0; border-bottom: none; }
[dark] ytd-watch-metadata, [dark] ytd-watch-metadata .desc_toggles { border-color: rgba(255,255,255,0.125); }

#description, #description > * { margin-left: 0; }
ytd-watch-metadata .desc_toggles { width: 100%; border-top: 1px solid; border-radius: 0; text-align: center; cursor: pointer; margin-top: 1em; background: linear-gradient(rgba(0,0,0,0.02), transparent); }
[dark] ytd-watch-metadata .desc_toggles { background: linear-gradient(rgba(255,255,255,0.02), transparent); }
ytd-watch-metadata .desc_toggles:hover { background: rgba(0,0,0,0.03); }
[dark] ytd-watch-metadata .desc_toggles:hover { background: rgba(255,255,255,0.03); }
ytd-watch-metadata .desc_toggles .desc_text { margin: 0; padding: 4px; }
`;*/
//document.head.appendChild(styles);
//document.head.appendChild(styles_alt);


//prevent description opening when clicked anywhere on it
Element.prototype._addEventListenerPD = Element.prototype.addEventListener;
Element.prototype.addEventListener = function(a,b,c) {
    if(this.id=="description" && this.classList.contains("ytd-watch-metadata")) {
        return
    }
    this._addEventListenerPD(a,b,c);
    if(!this.eventListenerList) this.eventListenerList = {};
    if(!this.eventListenerList[a]) this.eventListenerList[a] = [];
    this.eventListenerList[a].push(b);
};

var more2;
function expand_button(el){
    //more = el;
    let buttons = addButton(true, "description_open", el);
    more2 = buttons[0];
    buttons[0].addEventListener('click', function(e) {
        description.setAttribute("is-expanded","");
        more.removeAttribute("hidden");
        less.setAttribute("hidden","");
    });
    if(typeof yt !== "undefined")
        yt.msgs_.SHOW_MORE ? buttons[1].innerText=yt.msgs_.SHOW_MORE : buttons[1].innerText = more.innerText.replace("...","").trim();
    watchExistingButtonForChange(el, buttons[0], buttons[1]);
}
function collapse_button(el){
    //less = el;
    let buttons = addButton(false, "description_close", el);
    buttons[0].addEventListener('click', function(e) {
        description.removeAttribute("is-expanded");
        less.removeAttribute("hidden");
        more.setAttribute("hidden","");
    });
    if(typeof yt !== "undefined")
        yt.msgs_.SHOW_LESS ? buttons[1].innerText=yt.msgs_.SHOW_LESS : buttons[1].innerText = less.innerText.replace("...","").trim();
    watchExistingButtonForChange(el, buttons[0], buttons[1]);
}


function watchVideoInfoForChange(info1,custom_info2){
    if(info1.innerText.indexOf('•') > 0) {
        custom_info2.innerText = info1.innerText.split('•')[0].trim() + ' • ' + info1.innerText.split('•')[1].trim();
    } else {
        custom_info2.innerText = info1.innerText.trim();
    }
    var obs = new MutationObserver(function(mutations){
        if(info1.innerText.indexOf('•') > 0) {
            custom_info2.innerText = info1.innerText.split('•')[0].trim() + ' • ' + info1.innerText.split('•')[1].trim();
        } else {
            custom_info2.innerText = info1.innerText.trim();
        }
    });

    obs.observe(info1, {
        childList: true,
        subtree: true,
        characterData: true
    });
}
function createCustomInfo(date_info, top_row){
    let custom_info = document.createElement("span");
    custom_info.setAttribute("id","info");
    custom_info.innerHTML = "<span class='views-and-date'></span>";
    let custom_info2 = custom_info.querySelector(".views-and-date");

    top_row.prepend(custom_info);

    watchVideoInfoForChange(date_info,custom_info2);
}

(async function(){
    document.head.appendChild(styles_channel);
    
    debug_mode && console.log("[YTPD] - searching for elements");
    let watch_metadata = await findElement("ytd-watch-metadata");
    debug_mode && console.log("[YTPD] - found ytd-watch-metadata");
    let top_row = await findElement("ytd-watch-metadata #top-row");
    debug_mode && console.log("[YTPD] - found: #top-row");
    let bottom_row = await findElement("ytd-watch-metadata #bottom-row");
    debug_mode && console.log("[YTPD] - found: #bottom-row");
    let uploader = await findElement("ytd-watch-metadata #owner");
    debug_mode && console.log("[YTPD] - found: #owner");
    let date_info = await findElement("ytd-watch-metadata #bottom-row #description ytd-watch-info-text tp-yt-paper-tooltip #tooltip, ytd-watch-metadata #bottom-row #description > tp-yt-paper-tooltip #tooltip");
    debug_mode && console.log("[YTPD] - found: #tooltip");
    let description_expander = await findElement("ytd-watch-metadata #description #description-inline-expander");
    debug_mode && console.log("[YTPD] - found: #description");
    let teaser_carousel = await findElement("ytd-watch-metadata #bottom-row #teaser-carousel");
    debug_mode && console.log("[YTPD] - found: #teaser-carousel");

    more = await findElement("ytd-watch-metadata ytd-text-inline-expander > #expand");
    debug_mode && console.log("[YTPD] - found: #expand");
    less = await findElement("ytd-watch-metadata ytd-text-inline-expander > #collapse");
    debug_mode && console.log("[YTPD] - found: #collapse");

    expand_button(more);
    collapse_button(less);

    bottom_row.parentNode.insertBefore(uploader, bottom_row); // move uploader info before #bottom-row

    watch_metadata.appendChild(teaser_carousel);

    createCustomInfo(date_info, top_row);

    document.head.appendChild(styles);

    findElement("ytd-watch-metadata > ytd-metadata-row-container-renderer").then(function(el){
        more2.parentNode.insertBefore(el, more2); // move game_info cards inside description
    });
    findElement("#subscribe-button ytd-subscribe-button-renderer[subscribed] yt-button-shape#subscribe-button-shape button .yt-spec-button-shape-next__button-text-content").then(function(el){
        findElement("#subscribe-button ytd-subscribe-button-renderer yt-button-shape:not(#subscribe-button-shape) button .yt-spec-button-shape-next__icon").then(function(el2){
            el2.after(el.cloneNode(true));
        });
    });
    debug_mode && console.log("[YTPD] - done");

})();

