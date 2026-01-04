// ==UserScript==
// @name        DGG chat equity
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen
// @match       https://www.destiny.gg/bigscreen*
// @match       https://www.destiny.gg/embed/chat
// @grant       none
// @version     1.0
// @author      mif
// @license     MIT
// @description 2024-11-28, remove subscriptions color from chat - make /tag more clean
// @downloadURL https://update.greasyfork.org/scripts/538948/DGG%20chat%20equity.user.js
// @updateURL https://update.greasyfork.org/scripts/538948/DGG%20chat%20equity.meta.js
// ==/UserScript==

function css_overwrite (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

// Main set
css_overwrite('.user.moderator     { color: #dcdcdc!important; }');   // MODERATOR
css_overwrite('.user.protected     { color: #dcdcdc!important; }');   // PROTECTED
css_overwrite('.user.subscriber    { color: #dcdcdc!important; }');   // SUBSCRIBER
css_overwrite('.user.flair9        { color: #dcdcdc!important; }');   // TWITCHSUB
// css_overwrite('.user.admin         { color: #dcdcdc!important; }');   // ADMIN
css_overwrite('.user.flair12       { color: #dcdcdc!important; }');   // BROADCASTER
css_overwrite('.user.vip           { color: #dcdcdc!important; }');   // VIP
// css_overwrite('.user.bot           { color: #dcdcdc!important; }');   // BOT
css_overwrite('.user.flair11       { color: #dcdcdc!important; }');   // BOT2
css_overwrite('.user.flair13       { color: #dcdcdc!important; }');   // SUB_TIER_1
css_overwrite('.user.flair1        { color: #dcdcdc!important; }');   // SUB_TIER_2
css_overwrite('.user.flair3        { color: #dcdcdc!important; }');   // SUB_TIER_3
css_overwrite('.user.flair8        { color: #dcdcdc!important; }');   // SUB_TIER_4
// Fuck T5 logic
css_overwrite('.user.flair42       { color: #dcdcdc!important; }');   // SUB_TIER_5
css_overwrite('.user.flair42     { background: none!important; }');   // SUB_TIER_5
css_overwrite('.user.flair42      { animation: none!important; }');   // SUB_TIER_5
// AE memes
css_overwrite('.user.flair32       { color: #dcdcdc!important; }');   // AE T1
css_overwrite('.user.flair22       { color: #dcdcdc!important; }');   // AE T2
css_overwrite('.user.flair33       { color: #dcdcdc!important; }');   // AE T5 (T3?)
// AE badges
css_overwrite('.flair.flair32      { display: None!important; }');    // AE T1
css_overwrite('.flair.flair22      { display: None!important; }');    // AE T2
css_overwrite('.flair.flair33      { display: None!important; }');    // AE T5 (T3?)
// Other
css_overwrite('.flair.flair34      { display: None!important; }');    // Conductor flair
css_overwrite('.user.flair18       { color: #dcdcdc!important; }');   // Emote master
// css_overwrite('.user.flair18       { color: #59AEEA!important; }');   // Emote master to T1
