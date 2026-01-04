/**
MIT License

Copyright (c) 2018+, Kiran Murmu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/
// ==UserScript==
// @name            Auto Close Twitch Ads
// @namespace       https://github.com/kiranmurmuone
// @description     Close, mute or hide Twitch video ads automatically while watching a stream!
// @copyright       2018+, Kiran Murmu
// @match           *://*.twitch.tv/*
// @author          kiranmurmuone
// @version         1.3.95
// @source          https://github.com/kiranmurmuone/auto-close-twitch-ads
// @license         MIT
// @grant           GM_info
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/373292/Auto%20Close%20Twitch%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/373292/Auto%20Close%20Twitch%20Ads.meta.js
// ==/UserScript==

(function() { var _video = {interval: 250, duration: 5, skipped: true, hidden: false, muted: true, console: true, present: null, advert: null,
player: null, dstyle: null, addstyle: function (_key) { if (typeof GM_addStyle !== 'undefined' && typeof _key === 'string') { GM_addStyle(
'.player-ad-notice > p {display: ' + _key + ';}'); return true; } return false; }, scriptName: function (_key) { if (typeof GM_info !== 'undefined') {
if (_key) { return GM_info.script.name.replace(new RegExp(' ', 'g'), '-'); } else { return GM_info.script.name; }} return 'undefined'; }, volume: null,
playerQuery: 'div.player-video video', styleSheet: '.player-ad-notice > p {display: none;}', unmuted: 'mute-button', dstyleQuery:
'div.js-ima-ads-container.ima-ads-container', presentQuery: 'div.persistent-player.tw-border-radius-none', volumeQuery:
'button.player-button.player-button--volume span', advertQuery: 'div.js-ima-ads-container.ima-ads-container video', setStore: function(_key, _val) {
if (typeof GM_setValue !== 'undefined') { return GM_setValue(_key, _val); } return _val; }, getStore: function(_key, _val) {
if (typeof GM_getValue !== 'undefined') { return GM_getValue(_key, _val); } return _val; }, delStore: function(_key) {
if (typeof GM_deleteValue !== 'undefined') { return GM_deleteValue(_key); } return 'undefined'; }}; _video.duration = _video.getStore(_video.scriptName(true) +
'.duration', _video.duration); _video.skipped = _video.getStore(_video.scriptName(true) + '.skipped', _video.skipped); _video.hidden = _video.getStore(
_video.scriptName(true) + '.hidden', _video.hidden); _video.muted = _video.getStore(_video.scriptName(true) + '.muted', _video.muted);
function noticeAd() { _video.present = document.querySelector(_video.presentQuery); if (typeof _video.present !== 'undefined' && _video.present) {
_video.volume = document.querySelector(_video.volumeQuery); _video.dstyle = document.querySelector(_video.dstyleQuery);
_video.advert = document.querySelector(_video.advertQuery); _video.player = document.querySelector(_video.playerQuery);
if (typeof _video.dstyle !== 'undefined' && _video.dstyle) { if (_video.hidden && !_video.dstyle.style.display) { _video.dstyle.style.display = 'none';
if (typeof _video.addstyle !== 'undefined') { if (_video.addstyle('none') && _video.console) { console.log(_video.scriptName() + ': video ad hidden.');
}} }} if ((typeof _video.volume !== 'undefined' && _video.volume) && (typeof _video.advert !== 'undefined' && _video.advert) &&
(typeof _video.player !== 'undefined' && _video.player)) { if (_video.muted && !_video.advert.muted && _video.advert.volume) {
_video.advert.muted = true; _video.advert.volume = 0; if (_video.player.muted && _video.volume.className === _video.unmuted) { _video.player.muted = false;}
if (_video.console) { console.log(_video.scriptName() + ': video ad muted.'); }} if (_video.skipped && _video.advert.duration && _video.advert.src) {
if (_video.advert.currentTime !== _video.advert.duration && _video.advert.currentTime >= (_video.duration ? _video.duration + 1 : 0)) {
_video.advert.currentTime = _video.advert.duration; if (_video.console) { console.log(_video.scriptName() + ': video ad skipped.');}} }} }}
setInterval(noticeAd, _video.interval); if (typeof GM_registerMenuCommand !== 'undefined') { GM_registerMenuCommand(_video.scriptName() +
': Set video ad duration.', function() { var _wait = parseInt( prompt('Current video ad duration is ' + _video.duration +
' sec. Enter new duration value, 0 means no ads.')); if (!isNaN(_wait)) { _video.duration = _wait; _video.setStore(_video.scriptName(true) +
'.duration', _video.duration); }}); GM_registerMenuCommand(_video.scriptName() + ': ' + (_video.skipped ? 'Disable' : 'Enable') +
' video ad skip.', function() { _video.setStore(_video.scriptName(true) + '.skipped', !_video.skipped); location.reload(); });
GM_registerMenuCommand(_video.scriptName() + ': ' + (_video.hidden ? 'Disable' : 'Enable') + ' video ad hide.', function() {
_video.setStore(_video.scriptName(true) + '.hidden', !_video.hidden); if (!_video.hidden) { _video.setStore(_video.scriptName(true) + '.muted',
!_video.hidden);} location.reload(); }); GM_registerMenuCommand(_video.scriptName() + ': ' + (_video.muted ? 'Disable' : 'Enable') + ' video ad mute.',
function() { _video.setStore(_video.scriptName(true) + '.muted', !_video.muted); location.reload(); }); GM_registerMenuCommand(_video.scriptName() +
': Restore default setting.', function() { _video.delStore(_video.scriptName(true) + '.duration'); _video.delStore(_video.scriptName(true) + '.skipped');
_video.delStore(_video.scriptName(true) + '.hidden'); _video.delStore(_video.scriptName(true) + '.muted'); location.reload(); }) ;} })();
