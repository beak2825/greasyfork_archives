// ==UserScript==
// @name         Nighty-night Google Translate
// @namespace    https://github.com/KeyWeeUsr/Userscripts
// @version      3.1
// @description  Translate at night comfortably!
// @author       Peter Badida
// @copyright    2016+, Peter Badida
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage     https://github.com/KeyWeeUsr/Userscripts/tree/master/Nighty-night-Google-Translate
// @supportURL   https://github.com/KeyWeeUsr/Userscripts/issues
// @icon         https://translate.google.com/favicon.ico
// @include      https://*translate.google.*/*
// @include      https://notifications.google.com/u/0/widget*origin=https%3A%2F%2Ftranslate.google.*
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ACVM74AYCXVWQ
// @downloadURL https://update.greasyfork.org/scripts/17474/Nighty-night%20Google%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/17474/Nighty-night%20Google%20Translate.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function () {
var bg_black = '#111111';
var bg_dark = '#191919';
var bg_medium = '#222222';
var modals = '#333333';
var text = '#393939';
var bg_light = '#696969';
var light = '#777777';
var highlight = '#F1F1F1';

var css = "\
/*TOOLBAR*/\
/*gt-appbar is the text under the top-left Google*/\
div#gt-appbar, div#gt-appbar > div > div {\
    background-color: {bg_dark} !important;\
    background: {bg_dark} !important;\
    border: 0;\
}\
div#gb > div > div+div > div > a > span, span.gb_Qb {\
    background-image: none;\
    display: inline !important;\
}\
div#gb > div > div+div > div > a > span:after {\
    content: 'Google';\
}\
div#gb > div > div+div > div > a {\
    text-decoration: none;\
    font-size: 200%;\
}\
div.gb_je>.gb_R {\
    line-height: 60px;\
}\
/*prefered lang + Chrome suggestion toolbar*/\
body > div > div {\
    background-color: {bg_medium} !important;\
}\
\
/*TEXT*/\
div#spelling-correction, div.gt-ex-text, span.gt-syn-span,\
div.goog-toolbar-button, .goog-toolbar-menu-button,\
div.gt-revert-correct-message, span#gt-feedback-caption,\
div.gt-src-cc-normal, span#gt-ovfl-xlt-more,\
div#gt-src-is-list > div > div {\
    color: {light} !important;\
}\
a, textarea#source, .vt-dismiss {\
    color: {light} !important;\
}\
\
/*TEXT DEFINITIONS*/\
span.gt-card-ttl-txt, div.gt-def-row, span.gt-rw-span {\
    color: {light} !important;\
}\
/*'See also' suggestions*/\
div#gt-text-top > div+div+div+div > div+div > div > div > \
div+div+div+div+div > div+div > div {\
    color: {light} !important;\
}\
span.gt-cd-cl {\
    text-decoration: underline;\
    color: {light} !important;\
}\
\
/*TEXT TRANSLATIONS*/\
span.gt-baf-word-clickable {\
    color: {light} !important;\
}\
\
span.gt-baf-hl {\
    color: {highlight} !important;\
}\
\
/*MENU*/\
div.jfk-button-standard, div.jfk-button-standard:focus,\
div.goog-flat-menu-button {\
    color: {text};\
    background-image: none !important;\
    background-color: {bg_light} !important;\
    border-color: {bg_light};\
}\
div.goog-menuitem-content {\
    color: {light} !important;\
}\
div.goog-menuitem-highlight,\
div#gt-sl-gms-menu .goog-menuitem-group .goog-menuitem-highlight,\
div#gt-tl-gms-menu .goog-menuitem-group .goog-menuitem-highlight {\
    background-color: {bg_medium} !important;\
    border-color: {bg_medium} !important;\
}\
div.goog-menuitem-emphasize-highlight {\
    background-color: {bg_medium} !important;\
}\
div.goog-option-selected {\
    background-color: {bg_medium} !important;\
}\
input#gt-submit:hover {\
    background-color: {highlight} !important;\
    background-image: none !important;\
}\
div.jfk-button-checked, div.goog-flat-menu-button-hover,\
div.goog-flat-menu-button-open {\
    background-color: {highlight} !important;\
    background-image: none !important;\
}\
div#gt-sl-gms-menu, div#gt-tl-gms-menu {\
    background-color: {text} !important;\
}\
\
/*BACKGROUNDS*/\
div#gt-ft-res {\
    background-color: {bg_black} !important;\
    border: 0;\
}\
body, div#gt-text-c, div#gt-text-top, div#gt-lc {\
    background-color: {bg_medium} !important;\
    background: {bg_medium} !important;\
}\
select#gt-sl, select#gt-tl {\
    background-color: {text} !important;\
    background: {text} !important;\
}\
select#gt-sl:hover, select#gt-tl:hover {\
    background: {highlight} !important;\
}\
div.gt-is, div#gt-ovfl {\
    background-color: {modals};\
    border-style: none;\
}\
div.gt-is-itm-hover {\
    background-color: {bg_medium};\
}\
div.gt-is-tr-on .gt-is-ld-top, div.gt-is-tr-on .gt-is-ld {\
    border-top: 1px solid {light} !important;\
}\
div.gt-hl-layer {\
    background-color: {bg_medium} !important;\
    border: 0 !important;\
}\
\
/*BORDERS*/\
div#gt-src-wrap, div.goog-menuseparator, div.goog-toolbar-separator {\
    border-color: {light} !important;\
}\
span#result_box, div#gt-res-wrap {\
    border-color: {light};\
    color: {light};\
    background: transparent !important;\
}\
.goog-toolbar-menu-button-focused, .goog-flat-menu-button-focused {\
    border: 1px solid transparent !important;\
}\
\
/*BLUE LINKS BUTTONS*/\
button.jfk-button-action, input.jfk-button-action, div.jfk-button-action {\
    color: {text};\
    background-image: none !important;\
    background-color: {bg_light} !important;\
    border-color: {bg_light};\
}\
div.jfk-button-hover {\
    color: {text};\
    background-color: {highlight} !important;\
    background-image: none !important;\
    border-color: {bg_light};\
}\
\
/*PHRASEBOOK*/\
input#gt-pb-sb, div.pbdel-button {\
    color: {text};\
    background-image: none !important;\
    background-color: {bg_light} !important;\
    border-color: {bg_light};\
}\
div.pbdel-button:hover, button#gt-pb-sbt:hover {\
    background-color: {highlight} !important;\
    background-image: none !important;\
}\
div#pb-tool {\
    background-color: {bg_medium} !important;\
    background: {bg_medium} !important;\
    border: 0;\
}\
div#pb-st-menu, div#pb-ls-menu {\
    background-color: {modals} !important;\
}\
tr.nolabel {\
    background-color: {modals} !important;\
    background: {modals} !important;\
    border-top: 1px solid {light} !important;\
}\
div#pb-sp-del, #gt-pb-tb, #gt-pb-tb tr {\
    border: 0 !important;\
}\
div#pb-tb-c, table#gt-pb-tb{\
    border-color: {light};\
    color: {light} !important;\
    background: transparent !important;\
}\
\
/*INPUTTOOLS*/\
li.ita-kd-menuitem, span.ita-kd-menuitem-inputtool-name {\
    color: {light} !important;\
}\
span.ita-kd-inputtools-div, div.ita-kd-separator {\
    color: {text}; background-image: none !important;\
    background-color: transparent !important;\
    border-color: {bg_light};\
}\
div.ita-hwt-candidate, div.ita-hwt-backspace,\
div.ita-hwt-jfk-standard, div.ita-hwt-jfk-action {\
    color: {text}; background-image: none !important;\
    background-color: {light} !important;\
    border-color: {bg_light};\
}\
div.ita-hwt-candidate-hover, div.ita-hwt-jfk-hover,\
div.ita-hwt-backspace:hover {\
    background-color: {highlight} !important;\
    background-image: none !important;\
}\
li.ita-kd-menuitem-hover {\
    background-color: {bg_medium} !important;\
    color: {bg_light} !important;\
}\
div.ita-hwt-buttons, div.ita-hwt-candidates {\
    border-top: 1px solid {light} !important;\
}\
div.ita-hwt-buttons {\
    background-color: {bg_medium} !important;\
    background: {bg_medium} !important;\
}\
ul.ita-kd-dropdown-menu {\
    background-color: {modals} !important;\
}\
div.ita-hwt-ime, div.ita-hwt-candidates {\
    background-color: {bg_light};\
}\
div.ita-hwt-close {\
    background-color: {text} !important;\
}\
div.ita-hwt-grip {\
    opacity: 0.1;\
}\
div.ita-hwt-grip:hover, div.ita-hwt-close:hover {\
    background-color: {bg_light} !important;\
    opacity: 0.5;\
}\
div.ita-hwt-ime-st {\
    background-color: {text} !important;\
    border-color: {light};\
}\
button.vk-btn {\
    color: {text};\
    background-image: none !important;\
    background-color: {bg_light} !important;\
    border-color: {bg_light};\
}\
button.vk-sf-a, button.vk-sf-s {\
    color: {text};\
    background-image: none !important;\
    background-color: {highlight} !important;\
    border-color: {bg_light};\
}\
button.vk-sf-h {\
    background-color: {highlight} !important;\
    background-image: none !important;\
}\
div.vk-box {\
    background-color: {bg_medium} !important;\
}\
\
/*APPS*/\
/*#gbwa is the 'app' icon on the right left panel*/\
div#gbwa > div+div > ul {\
    background-color: {modals} !important;\
}\
div#gbwa > div+div, div#gbwa > div+div > a {\
    background-color: {bg_medium} !important;\
    background: {bg_medium} !important;\
}\
div#gbwa > div+div > span {\
    border-bottom: 1px solid {light} !important;\
}\
/*disappeared?*/\
div.MNn0h {\
    background-color: {bg_medium} !important;\
    background: {bg_medium} !important;\
}\
/*app icon's border*/\
div#gbwa > div+div > ul > li:hover > a {\
    border: 1px solid {bg_medium} !important;\
}\
/*app icon's (under)title*/\
div#gbwa > div+div > ul > li:hover > a > span+span {\
    background: {bg_medium} !important;\
}\
\
/*NOTIFICATIONS*/\
/*#gbsfw is the notifications panel, but selecting it\
trough div > div ... syntax cripples the toolbar colors\
when translating a whole website*/\
body > div > div > div > div > div+div, div#gbsfw, \
body > div > div > div > div+div > div+div+div > div+div {\
    border: 1px solid transparent;\
    border-color: transparent !important;\
    background: {modals} !important;\
    background-color: {modals} !important;\
}\
body > c-wiz {\
    background-color: {modals} !important;\
}\
body > c-wiz > div > c-wiz > c-wiz > div {\
    background-color: {text} !important;\
    background: {text} !important;\
    color: {light} !important;\
}\
body > c-wiz > div > c-wiz > div > c-wiz > div > div > div, \
body > c-wiz > div > c-wiz > div > c-wiz > div > div, \
body > c-wiz > div > c-wiz > c-wiz > div > div, \
body > c-wiz > div > c-wiz > div > c-wiz > div {\
    color: {light} !important;\
}\
\
/*USERPANEL*/\
div#gb > div > div > div+div > div+div+div+div > div+div > div > div > div {\
    color: {light} !important;\
}\
div#gb > div > div {\
    background-color: {bg_black} !important;\
    border: 0;\
}\
div#gb > div > div > div+div > div+div+div+div > div+div > div > div > a {\
    background: {bg_light} !important;\
    border-color: {bg_light} !important;\
    color: {text} !important;\
}\
div#gb > div > div > div+div > div+div+div+div > div+div > div > div\
 > a:hover {\
    background-color: {highlight} !important;\
    background-image: none !important;\
}\
div#gb > div > div > div+div > div+div+div+div > div+div,\
div#gb > div > div > div+div > div+div+div+div > div+div > div+div+div {\
    background-color: {bg_medium} !important;\
    background: {bg_medium} !important;\
}\
div#gb > div > div > div+div > div+div+div+div > div+div > div > a:focus {\
    outline: none;\
}\
\
/*SHARE*/\
div.jfk-bubble {\
    background-color: {text};\
    border-color: {light} !important;\
}\
div.share-panel{\
    background: none;\
}\
div.share-panel>h3 {\
    color: {light} !important;\
}\
\
/*ARROWS*/\
div.cd-exp-ar {\
    background-color: {bg_light};\
}\
div.cd-exp-ar:after {\
    border-top: 16px solid {bg_medium};\
}\
div.cd-exp-ar:before {\
    border-top:16px solid {bg_light};\
}\
div.jfk-bubble-arrowimplafter {\
    border-color: {light} transparent !important;\
}\
div#gb > div > div > div+div > div+div+div+div > div > div+div,\
div#gb > div > div > div+div > div+div > div > a+div+div {\
    border-bottom-color: {modals} !important;\
}\
\
/*TRANSLATION ALTERNATIVES*/\
div.goog-menu {\
    background: {text};\
}\
div.alt-menu .gt-edit-menuitem {\
    background: {bg_medium} !important;\
}\
input#alt-input-text {\
    color: {text};\
    background-color: {bg_light} !important;\
    border-color: {bg_light};\
}\
textarea#contribute-target {\
    color: {light} !important;\
}\
div.st-stp1-text, div.cp-promo-bottom {\
    background: {bg_light} !important;\
    border-color: {bg_light};\
}\
div.cp-promo-link-text {\
    color: {text} !important;\
}\
div#gt-res-wrap, div#gt-res-wrap.focus {\
    border-color: {light} !important;\
}\
/*Miscellaneous*/\
div.contentframe {\
    color: inherit;\
    background: 0;\
    background-color: transparent;\
}\
div#t-new-user {\
    display: none;\
}\
div.gt-baf-sep {\
    border-bottom: 1px solid {light} !important;\
}\
input:focus {\
    border-color: {light} !important;\
}\
img#kwu_av:hover {\
    opacity: 1 !important;\
}\
\
/*TRANSLATE WEBPAGE*/\
form > fieldset+fieldset > div > div {\
    background: {bg_light} !important;\
}\
form > div > button {\
    background: {modals} !important;\
}\
\
/*GT day survey*/\
div.gt-hats-tt {\
    color: {light} !important;\
}\
div.gt-hats {\
    border: 0 !important;\
    background-color: {bg_medium} !important;\
}\
div.gt-hats-t {\
    border: 0 !important;\
}\
\
";
css = css.replace(new RegExp('{bg_black}', 'gi'), bg_black);
css = css.replace(new RegExp('{bg_dark}', 'gi'), bg_dark);
css = css.replace(new RegExp('{bg_medium}', 'gi'), bg_medium);
css = css.replace(new RegExp('{modals}', 'gi'), modals);
css = css.replace(new RegExp('{text}', 'gi'), text);
css = css.replace(new RegExp('{bg_light}', 'gi'), bg_light);
css = css.replace(new RegExp('{light}', 'gi'), light);
css = css.replace(new RegExp('{highlight}', 'gi'), highlight);

// Change CSS after DOM is loaded
window.onload = function() {
    var head_tag = document.getElementsByTagName('head')[0];
    var style_tag = document.createElement('style');
    style_tag.setAttribute('type', 'text/css');
    style_tag.textContent = css;
    head_tag.appendChild(style_tag);
}
var panel=document.getElementById('gt-lang-right');
var av_style = 'position: relative; opacity: 0.3; float: right; \
right: 4px; border-radius: 5px;';
var av='<a href="https://github.com/KeyWeeUsr/Userscripts"><img id="kwu_av" \
src="https://github.com/identicons/KeyWeeUsr.png" width="28" \
style="' + av_style + '"></img></a>';
panel.insertAdjacentHTML('afterbegin', av);
})();
/*
Notify me if there's something missing/undesirable.
*/
