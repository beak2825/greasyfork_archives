// ==UserScript==
// @name     New Tumblr Tweaks
// @description Makes small tweaks to the CSS properties and DOM structure of the new Tumblr dashboard to bring it in line with how it was pre-update.
// @author Button
// @version  1.10
// @namespace newTumblrTweaks
// @match    https://www.tumblr.com/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js
// @grant    GM_addStyle
// @run-at   document-start
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/406359/New%20Tumblr%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/406359/New%20Tumblr%20Tweaks.meta.js
// ==/UserScript==
//- The @grant directive is needed to restore the proper sandbox.
console.log ("Tumblr: Tweaked");

var style = $('<style>._22fn0 *, .pOoZl *, ._1Wz4U * { font-size: 14px !important; line-height: 150% !important; } ._22fn0 blockquote ~ .daUfr._24NTO, ._22fn0 ._2m1qj._1pexr:first-child { margin-left: var(--post-padding) !important; border-left: 3px solid rgba(var(--black),.07);} ._22fn0 blockquote:last-of-type ~ .daUfr._24NTO { margin-left: inherit !important; border-left: inherit !important;} ._2m1qj, :not(.daUfr) + ._2m1qj._1pexr { padding-top: inherit;} ._22fn0 ._2m1qj:first-child { margin: 0 !important; } ._2m1qj:first-child + .daUfr._24NTO { margin-top:-5px; } ._2m1qj h2 * { font-size: 20px !important; line-height: 26px !important;} ._2m1qj h1 { font-size: 1.625rem !important; line-height: 1.3077 !important} ._2m1qj small, ._2m1qj small * { font-size: small !important; } </style>');
$('html > head').append(style);

// const apiKey = "5CIOyjHfcrNFlyEJl2D7vnoDTYqV30lNAUaSd4LJKoBFOZOmxp";

waitForKeyElements (":root", removeFlicker);
waitForKeyElements("._1xqFV div span span a div div div img", start);
waitForKeyElements("body", editTrackedTags);

(function(document,found) {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {

            var yourdiv = document.querySelector("._2LUdG");

            if(found && !yourdiv){
                // Was there but is gone, do something
                found = false;

            }

            if(yourdiv){
                // Found it, do something
                found = true;
                let askLink = $("._2LUdG a:contains('Ask')");
                let askURL = askLink.attr("href").split("https://")[1].split(".")[0];
                askLink.click(function(e) {
                    e.preventDefault();
                    let askModal = $(`<div id='dashAskForm' style='width:100%;height:100%;background:rgba(0,0,0,0.35);position:fixed;z-index:999999'><div style='z-index:999999999;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:500px;height:190px;'><iframe src='https://www.tumblr.com/ask_form/${askURL}.tumblr.com' id='ask_form' frameborder='0' height='100%' scrolling='yes' width='100%' style='background: #36465d; padding: 3px; border-radius:3px'></iframe></div></div>`)
                    .hide()
                    .fadeIn(250);
                    $("#glass-container").empty();
                    $("body").prepend(askModal);
                    $("#dashAskForm").click(function() {
                        $(this).fadeOut(250, function() {
                            $(this).remove();
                        });
                    });
                });

            }

        });
    });
    observer.observe(document, { childList: true, subtree: true });
})(document,false);

function editTrackedTags(jNode) {
$("<style type='text/css'> #xtags { margin-bottom: 10px !important; border-bottom: 2px solid rgba(var(--white-on-dark),.13)} .xtag a div span{ color:#9BA3AE !important; fill: #9BA3AE !important} .xkit--react #xkit_button svg {fill: RGB(var(--white-on-dark)) !important;}</style>").appendTo("head");
}

function removeFlicker (jNode) {
    console.log ("Cleaned node: ", jNode);
    jNode.css ({
        "--navy": "54, 70, 93",
        "--font-family": "\"Helvetica Neue\", \"HelveticaNeue\", Helvetica, Arial, \"AppleGothic\", \"Malgun Gothic\", \"Dotum\", \"Gulim\", sans-serif"
    });

//     jNode.css ({
//         "--rgb-white": "255, 255, 255",
//         "--rgb-white-on-dark": "191, 191, 191",
//         "--rgb-black": "68, 68, 68",
//         "--navy": "54, 70, 93",
//         "--red": "#d95e40",
//         "--orange": "#f2992e",
//         "--yellow": "#e8d738",
//         "--green": "#56bc8a",
//         "--blue": "#529ecc",
//         "--purple": "#a77dc2",
//         "--pink": "#748089",
//         "--accent": "#529ecc",
//         "--secondary-accent": "#e5e7ea",
//         "--follow": "#f3f8fb",
//         "--white": "rgb(var(--rgb-white))",
//         "--white-on-dark": "rgb(var(--rgb-white-on-dark))",
//         "--black": "rgb(var(--rgb-black))",
//         "--transparent-white-65": "rgba(var(--rgb-white-on-dark), 0.65)",
//         "--transparent-white-40": "rgba(var(--rgb-white-on-dark), 0.4)",
//         "--transparent-white-25": "rgba(var(--rgb-white-on-dark), 0.25)",
//         "--transparent-white-13": "rgba(var(--rgb-white-on-dark), 0.13)",
//         "--transparent-white-7": "rgba(var(--rgb-white-on-dark), 0.07)",
//         "--gray-65": "rgba(var(--rgb-black), 0.65)",
//         "--gray-40": "rgba(var(--rgb-black), 0.4)",
//         "--gray-25": "rgba(var(--rgb-black), 0.25)",
//         "--gray-13": "rgba(var(--rgb-black), 0.13)",
//         "--gray-7": "rgba(var(--rgb-black), 0.07)",
//         "--font-family": "\"Helvetica Neue\", \"HelveticaNeue\", Helvetica, Arial, \"AppleGothic\", \"Malgun Gothic\", \"Dotum\", \"Gulim\", sans-serif"
//     });

}

function start(jNode) {
    $("document").ready(() => {
    waitForKeyElements ("._1oyP0 aside ._149RG ._2biQz", addSidebar);
    });
}

function addSidebar(jNode) {
    let blogURL = $("._1xqFV div span span a").attr("title");
    let avatarSet = $("._1xqFV div span span a div div div img").attr("srcset");
    let sidebar = `<div class='_3HoFU' style='--black: #9BA3AE !important; --gray-65: #9BA3AE !important; --secondary-accent: rgba(255, 255, 255, 0.05) !important;'> <div class='rC3Mt' style='background: rgba(255, 255, 255, 0);position: absolute;width: 20%;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;flex-direction: column;max-height: inherit;border-radius: 3px !important;'> <ul class='BuKyu _3rUi0' style='border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style: none;padding: 0;border-bottom: 2px solid rgba(155, 163, 174, 1);margin: 0;'> <li class='_1N6Lo _2U-M4' style='list-style: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style-type: none;cursor: pointer;'> <a class='_1_s4-' href='/likes' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;color: var(--gray-65);display: flex;justify-content: center;text-decoration: none;align-items: center;border-bottom: 1px solid rgba(155, 163, 174, 0.5);padding: 0 20px 7.5px 10px;'> <div class='_2abFB' style='margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;box-sizing: border-box;min-width: 24px;margin-right: 10px;display: flex;justify-content: center;margin-left: 0;'> <svg width='20' height='18' viewBox='0 0 20 18' fill='var(--gray-65)'> <path d='M17.888 1.1C16.953.38 15.87 0 14.758 0c-1.6 0-3.162.76-4.402 2.139-.098.109-.217.249-.358.42a12.862 12.862 0 0 0-.36-.421C8.4.758 6.84 0 5.248 0 4.14 0 3.06.381 2.125 1.1-.608 3.201-.44 6.925 1.14 9.516c2.186 3.59 6.653 7.301 7.526 8.009.38.307.851.474 1.333.474a2.12 2.12 0 0 0 1.332-.473c.873-.71 5.34-4.42 7.526-8.01 1.581-2.597 1.755-6.321-.968-8.418'></path> </svg> </div><div class='_1dLVj' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;box-sizing: border-box;color: var(--white-on-dark);flex: 1;min-height: 41px;align-items: center;padding: 0;'><span class='XcYVy' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;vertical-align: baseline;flex-direction: column;display: flex;justify-content: center;position: relative;flex: 1;font-family: var(--font-family);font-size: 16px;font-weight: 400;line-height: 24px;color: var(--black);padding: 5px 0;'>Likes</span><span class='_3A6x8' style='list-style: none;list-style-type: none;margin: 0;padding: 0;border: none;font: inherit;vertical-align: baseline;display: inline-block;text-align: right;margin-left: 5px;font-family: var(--font-family);font-size: 14px;font-weight: 400;line-height: 21px;color: var(--gray-65);'></span></div></a> </li><li class='_1N6Lo _2U-M4' style='color: var(--black);list-style: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style-type: none;cursor: pointer;'> <a class='_1_s4-' href='/following' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;color: var(--gray-65);display: flex;justify-content: center;text-decoration: none;align-items: center;border-bottom: 1px solid rgba(155, 163, 174, 0.5);padding: 7.5px 20px 7.5px 10px;'> <div class='_2abFB' style='list-style: none;list-style-type: none;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;box-sizing: border-box;min-width: 24px;margin-right: 10px;display: flex;justify-content: center;margin-left: 0;'> <svg viewBox='0 0 20 21' width='20' height='21' fill='var(--gray-65)'> <path d='M11.5 8.8c0-1.5-1.2-2.8-2.6-2.8-1.4 0-2.6 1.3-2.6 2.8 0 1.5 1.2 2.2 2.6 2.2 1.5 0 2.6-.7 2.6-2.2zM5 16.2v.8h7.7v-.8c0-3-1.7-4.2-3.9-4.2C6.7 12 5 13.2 5 16.2zM16 19H2V4h10V2H2C.9 2 0 2.9 0 4v14.9C0 20.1.9 21 2 21h14.2c1.1 0 1.8-.9 1.8-2.1V8h-2v11zm2-17V0h-2v2h-2v2h2v2h2V4h2V2h-2z'></path> </svg> </div><div class='_1dLVj' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;box-sizing: border-box;color: var(--white-on-dark);flex: 1;min-height: 41px;align-items: center;padding: 0;'><span class='XcYVy' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;vertical-align: baseline;flex-direction: column;display: flex;justify-content: center;position: relative;flex: 1;font-family: var(--font-family);font-size: 16px;font-weight: 400;line-height: 24px;color: var(--black);padding: 5px 0;'>Following</span><span class='_3A6x8' style='list-style: none;list-style-type: none;margin: 0;padding: 0;border: none;font: inherit;vertical-align: baseline;display: inline-block;text-align: right;margin-left: 5px;font-family: var(--font-family);font-size: 14px;font-weight: 400;line-height: 21px;color: var(--gray-65);'></span></div></a> </li><li class='_1N6Lo _2U-M4' style='color: var(--black);list-style: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style-type: none;cursor: pointer;'> <a class='_1_s4-' href='/settings' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;color: var(--gray-65);display: flex;justify-content: center;text-decoration: none;align-items: center;padding: 7.5px 20px 7.5px 10px;'> <div class='_2abFB' style='list-style: none;list-style-type: none;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;box-sizing: border-box;min-width: 24px;margin-right: 10px;display: flex;justify-content: center;margin-left: 0;'> <svg width='20' height='20' viewBox='0 0 24 24' fill='var(--gray-65)'> <path d='M24 10.526l-.36-.12-2.94-.962-.78-1.925 1.5-3.248-1.92-1.985-.36.18-2.76 1.444-1.86-.782L13.32 0h-2.58l-.12.421-1.08 2.707-1.86.782L4.5 2.346 2.58 4.33l1.56 3.188-.78 1.925L0 10.586v2.828l.36.12 2.94 1.083.78 1.924-1.5 3.309 1.92 1.985.36-.18 2.76-1.444 1.86.781L10.68 24h2.58l.12-.36 1.08-2.587 1.86-.782 3.18 1.564 1.92-1.985-.18-.361-1.38-2.827.78-1.925 3.3-1.203v-3.008H24zM7.2 11.97c0-2.647 2.16-4.812 4.8-4.812 2.64 0 4.8 2.165 4.8 4.812 0 2.647-2.16 4.812-4.8 4.812-2.64 0-4.8-2.165-4.8-4.812z'></path> </svg> </div><div class='_1dLVj' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;box-sizing: border-box;color: var(--white-on-dark);flex: 1;min-height: 41px;align-items: center;padding: 0;'><span class='XcYVy' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;vertical-align: baseline;flex-direction: column;display: flex;justify-content: center;position: relative;flex: 1;font-family: var(--font-family);font-size: 16px;font-weight: 400;line-height: 24px;color: var(--black);padding: 5px 0;'>Settings</span><span class='_3A6x8' style='list-style: none;list-style-type: none;margin: 0;padding: 0;border: none;font: inherit;vertical-align: baseline;display: inline-block;text-align: right;margin-left: 5px;font-family: var(--font-family);font-size: 14px;font-weight: 400;line-height: 21px;color: var(--gray-65);'></span></div></a> </li></ul> <ul class='BuKyu' style='color: var(--black);border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style: none;padding: 0;margin: 0;'> <div> <li class='_1L5Rq' style='color: var(--black);list-style: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style-type: none;background-color: inherit'> <div class='_2FkHa' style='color: var(--black);list-style: none;list-style-type: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;'> <div class='v-cYJ -as--' style='color: var(--black);list-style: none;list-style-type: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;position: relative;width: 100%;border-bottom-color: var(--gray-13);'> <a href='/blog/${blogURL}' class='_26ExL' style='list-style: none;list-style-type: none;margin: 0;border: none;font: inherit;font-size: 100%;display: flex;align-items: center;word-wrap: break-word;line-height: 1.2;vertical-align: middle;padding: 8px 10px;min-height: 43px;flex-grow: 1;text-decoration: none;color: var(--gray-65);'> <div class='_2FxMi' style='list-style: none;list-style-type: none;word-wrap: break-word;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;align-items: center;max-width: 75%;'> <div class='_1de9y' style='list-style: none;list-style-type: none;word-wrap: break-word;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;margin-right: 11px;'> <div class='_6FocL' style='list-style: none;list-style-type: none;word-wrap: break-word;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;position: relative;'> <div class='_1e2yz' style='list-style: none;list-style-type: none;word-wrap: break-word;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;position: relative;width: 37px;height: 37px;'> <div class='XLjeO _23jVi' style='list-style: none;list-style-type: none;word-wrap: break-word;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;overflow: hidden;height: 100%;width: 100%;border-radius: 3px;'> <div class='_3LljV' style='list-style: none;list-style-type: none;word-wrap: break-word;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;width: 100%;position: relative;line-height: 0;padding-bottom: 100%;'><img class='_28CuW' srcset='${avatarSet}' sizes='37px' alt='Avatar' role='img' style='list-style: none;list-style-type: none;word-wrap: break-word;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;object-fit: cover;position: absolute;left: 0;top: 0;display: block;width: 37px;height: 37px;'></div></div></div></div></div><div class='aI5Fi' style='list-style: none;list-style-type: none;word-wrap: break-word;color: var(--gray-65);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;'> <div class='_1lz5M' style='list-style: none;list-style-type: none;word-wrap: break-word;margin: 0;padding: 0;border: none;font: inherit;vertical-align: baseline;word-break: break-word;text-align: left;font-family: var(--font-family);font-size: 14px;font-weight: 700;line-height: 21px;display: flex;align-items: center;color: var(--black);'><span class='_3sEMj' style='list-style: none;list-style-type: none;word-wrap: break-word;word-break: break-word;text-align: left;color: var(--black);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;'>${blogURL}</span> </div><div class='gAJ39' style='list-style: none;list-style-type: none;word-wrap: break-word;margin: 0;padding: 0;border: none;font: inherit;vertical-align: baseline;word-break: break-word;text-align: left;font-family: var(--font-family);font-size: 14px;font-weight: 400;line-height: 21px;overflow: hidden;text-overflow: ellipsis;hyphens: none;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;color: var(--gray-65);'>Your Blog</div></div></div></a> <div class='waEl0' style='color: var(--black);list-style: none;list-style-type: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;top: 50%;transform: translateY(-50%);position: absolute;right: 0;text-align: right;max-width: 25%;margin-right: 14px;'> <div class='_3fxCO' style='color: var(--black);list-style: none;list-style-type: none;text-align: right;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;flex-direction: row;'> <button class='KeFJu _4Awn9' aria-label='Show Blog Statistics' style='list-style: none;list-style-type: none;margin: 0;padding: 0;border: none;background-color: transparent;cursor: pointer;user-select: none;color: inherit;font: inherit;opacity: 0;transition: opacity .3s .15s;margin-right: 12px;'> <span class='Hi_aW' tabindex='-1' style='list-style: none;list-style-type: none;cursor: pointer;user-select: none;margin: 0;padding: 0;border: none;vertical-align: baseline;color: inherit;font: inherit;display: block;'> <svg width='20' height='20' fill='var(--gray-65)'> <path d='M15 8.015v1.984h6V8.015h-6zm-1.004 5.976H21v-2.014h-7.004v2.014zm2.003 3.982h4.998V15.99H16v1.984zm-6.966-5.93c2.238 0 4.06-1.563 4.06-3.867C13.093 5.875 11.271 4 9.033 4 6.793 4 4.97 5.875 4.97 8.176c.003 2.307 1.825 3.867 4.063 3.867zm-.036 1.93C5.635 13.972 3 16.33 3 19.978 3 20.54 3.43 21 3.96 21h10.077c.528 0 .958-.457.958-1.02 0-3.649-2.635-6.008-5.998-6.008z'></path> </svg> </span> </button> <button class='KeFJu _1wTvv _3rhNX' aria-label='Reorder' style='list-style: none;list-style-type: none;margin: 0;padding: 0;border: none;background-color: transparent;user-select: none;font: inherit;cursor: grabbing;font-family: var(--font-family);font-size: 21px;font-weight: 700;line-height: 32px;color: var(--gray-65);padding-bottom: 0;opacity: 0;transition: opacity .3s .15s;'><span class='Hi_aW' tabindex='-1' style='list-style: none;list-style-type: none;user-select: none;cursor: grabbing;margin: 0;padding: 0;border: none;vertical-align: baseline;color: inherit;font: inherit;display: block;'>::</span></button> </div></div></div><ul class='_1A8vn' style='color: var(--black);border: none;font: inherit;vertical-align: baseline;list-style: none;font-family: var(--font-family);font-size: 14px;font-weight: 400;line-height: 21px;margin: 0 20px 0 55px;padding: 0;overflow: hidden;visibility: visible;max-height: 500px;opacity: 1;transition: max-height 200ms ease 0s, opacity 200ms ease 0s;'> <li style='color: var(--black);visibility: visible;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style: none;'><a href='/blog/${blogURL}' style='visibility: visible;list-style: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;align-items: center;justify-content: space-between;color: var(--black);width: 100%;padding: 3px 4px;box-sizing: border-box;text-decoration: none;'><span style='visibility: visible;list-style: none;color: var(--black);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;'>Posts</span><span class='p6Rz7' style='visibility: visible;list-style: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;color: var(--gray-65);text-align: right;margin-left: 5px;'></span></a></li><li style='color: var(--black);visibility: visible;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style: none;'><a href='/blog/${blogURL}/followers' style='visibility: visible;list-style: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;align-items: center;justify-content: space-between;color: var(--black);width: 100%;padding: 3px 4px;box-sizing: border-box;text-decoration: none;'><span style='visibility: visible;list-style: none;color: var(--black);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;'>Followers</span><span class='p6Rz7' style='visibility: visible;list-style: none;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;color: var(--gray-65);text-align: right;margin-left: 5px;'></span></a></li><li style='color: var(--black);visibility: visible;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style: none;'><a href='/blog/${blogURL}/activity' style='visibility: visible;list-style: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;align-items: center;justify-content: space-between;color: var(--black);width: 100%;padding: 3px 4px;box-sizing: border-box;text-decoration: none;'><span style='visibility: visible;list-style: none;color: var(--black);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;'>Activity</span></a></li><li style='color: var(--black);visibility: visible;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style: none;'><a href='/blog/${blogURL}/drafts' style='visibility: visible;list-style: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;align-items: center;justify-content: space-between;color: var(--black);width: 100%;padding: 3px 4px;box-sizing: border-box;text-decoration: none;'><span style='visibility: visible;list-style: none;color: var(--black);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;'>Drafts</span></a></li><li style='color: var(--black);visibility: visible;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style: none;'><a href='/blog/${blogURL}/queue' style='visibility: visible;list-style: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;align-items: center;justify-content: space-between;color: var(--black);width: 100%;padding: 3px 4px;box-sizing: border-box;text-decoration: none;'><span style='visibility: visible;list-style: none;color: var(--black);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;'>Queue</span></a></li><li style='color: var(--black);visibility: visible;margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;list-style: none;'><a href='https://www.tumblr.com/settings/blog/${blogURL}' style='visibility: visible;list-style: none;margin: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;display: flex;align-items: center;justify-content: space-between;color: var(--black);width: 100%;padding: 3px 4px;box-sizing: border-box;text-decoration: none;'><span style='visibility: visible;list-style: none;color: var(--black);margin: 0;padding: 0;border: none;font: inherit;font-size: 100%;vertical-align: baseline;'>Edit Appearance</span></a></li></ul> </div></li></div></ul> </div></div>`
    if (window.location.href.slice(-9) === "dashboard") {
//         jNode.find(":first-child").remove();
//         console.log(jNode.parent());
        console.log(jNode.parent().parent());
        let sideNode = jNode.parent().parent();
//         for (let i=0;i<sideNode.children.length-1;i++) {
            sideNode.children().last().remove();
        console.log("Removed");
        setTimeout(function() {addBar(blogURL, avatarSet, sidebar, sideNode)}, 1000);


//         sideNode.css("flex", "inherit");
//         $("._1oyP0").html( "<aside>" + sidebar + "</aside>" );
//         $("._1oyP0 aside").css("flex", "inherit");
    }
}

// RGB(var(--white-on-dark))

function addBar(blogURL, avatarSet, sidebar, sideNode) {
    sideNode.append(sidebar);
//     sideNode.css("flex", "inherit");
    console.log("Added");
}