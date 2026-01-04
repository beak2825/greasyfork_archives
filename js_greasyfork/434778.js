// ==UserScript==
// @name         Surviv.io - Dark Theme (2022)
// @namespace    http://tampermonkey.net/
// @version      2.2.4
// @description  Give surviv.io a new look.
// @author       sk
// @grant        GM_addStyle
// @run-at       document-end
// @match        https://surviv.io/*
// @match        https://surviv2.io/*
// @match        https://2dbattleroyale.com/*
// @match        https://2dbattleroyale.org/*
// @match        https://piearesquared.info/*
// @match        https://thecircleisclosing.com/*
// @match        https://secantsecant.com/*
// @match        https://parmainitiative.com/*
// @match        https://ot38.club/*
// @match        https://drchandlertallow.com/*
// @match        https://rarepotato.com/*
// @match        https://archimedesofsyracuse.info/*
// @match        https://nevelskoygroup.com/*
// @match        https://kugahi.com/*
// @match        https://kugaheavyindustry.com/*
// @match        https://chandlertallowmd.com/*
// @downloadURL https://update.greasyfork.org/scripts/434778/Survivio%20-%20Dark%20Theme%20%282022%29.user.js
// @updateURL https://update.greasyfork.org/scripts/434778/Survivio%20-%20Dark%20Theme%20%282022%29.meta.js
// ==/UserScript==

/**
* Animated logo from iBLiSSIN.
* Inspired by Icehacks Dark theme.
* Please use tampermonkey for better experience.
*/

console.info('%cPlease use tampermonkey to make it work perfectly!', 'font-size:40px; font-weight:bolder; color:#B7B69F');
/* Loadout in team menu */
var loadoutTeam = document.createElement('button');
loadoutTeam.innerHTML = 'Loadout';
loadoutTeam.id = 'loadoutTeam';
loadoutTeam.onclick = function() {document.querySelector('.account-loadout-link').click()};
document.getElementById('team-menu').appendChild(loadoutTeam);

document.querySelector('#background').style = 'background-image:url(https://raw.githubusercontent.com/Samer-Kizi/survivio-mods/main/scripts/img/re-classic.png);filter:brightness(60%)'
document.querySelector('#open-arena-button').querySelector('.btn-open-arena').innerHTML = ''

// Create buttons
var clan = document.createElement('button')
clan.id = 'sk_clan'
clan.className = 'btn-green'
document.querySelector('.currency-block').appendChild(clan)
document.querySelector('#sk_clan').onclick = function() {document.querySelector('#btn-clans-hud').click()}

var support = document.createElement('button')
support.id = 'sk_support'
support.className = 'btn-green'
support.innerHTML = 'Support'
document.querySelector('#start-top-right').appendChild(support)
document.querySelector('#sk_support').onclick = function() {document.querySelector('#btn-support').click()}

var settings = document.createElement('button')
settings.id = 'sk_settings'
settings.className = 'btn-green'
document.querySelector('#start-top-right').appendChild(settings)
document.querySelector('#sk_settings').onclick = function() {document.querySelector('.btn-settings').click()}

var news = document.createElement('button')
news.id = 'sk_news'
news.className = 'btn-green'
document.querySelector('#start-top-right').appendChild(news)
document.querySelector('#sk_news').onclick = function() {document.querySelector('#btn-news').click()}

var discord = document.createElement('button')
discord.id = 'sk_discord'
discord.className = 'btn-green'
discord.innerHTML = 'Discord'
document.querySelector('#free-gp-offer').appendChild(discord)
document.querySelector('#sk_discord').onclick = function() {window.open('https://discord.com/invite/kg7CGfuwp6')}

// Add classes
document.querySelector('#start-row-top').classList.add('center-start-row')
var pass = document.querySelectorAll(".pass-empty-slot");
for (var i = 0; i < pass.length; i++) {
    pass[i].style = 'border: 3px solid #222222!important;background-color: #111111!important;'
}

// Remove #pass-buy-btn > .pass-premium-icon
var passicon = document.querySelector('#pass-buy-btn').querySelectorAll(".pass-premium-icon");
for (var ii = 0; ii < passicon.length; ii++) {
    passicon[ii].remove();
}

// CSS
GM_addStyle(`
:root {
  --background : #222222;
  --shadow : #111111;
  --red : #cd3232;
  --redsh : #781e0a;
  --pink : #f2c8f9;
}

input[type="checkbox"], input[type="range"] {
  filter: grayscale(1)!important;
}
input[type=text]:focus {
  border: none!important;
}
.menu-option:focus, .menu-option.focus, .modal-content-shadow, .modal-prestige-body-inner {
  box-shadow: none!important;
}

.btn-green,
.btn-team-option,
#btn-support,
.btn-settings,
.account-details-link-out,
.server-select,
.btn-account-turq,
.btn-account-grey,
.account-details-block,
.btn-login-facebook,
.btn-login-google,
.btn-login-twitch,
.btn-login-discord,
.btn-login-apple,
.btn-login-steam,
.menu-team-autofill-option,
.hide-item,
.copy-item,
.battle-mode,
#battle-start-button,
.battle-type,
#battle-copy-link,
#create-mode,
#create-type,
#create-button,
.region-selected,
.property-selected,
.create-clan-btn,
.reset-btn,
.inspect-btn,
.join-btn,
.discord-button,
.copy-button,
.iap-gp-pack,
.iap-lto-pack,
.btn-market-filter-gray,
.market-item-action-btn,
.btn-cancel-sell,
.contextual-gp-pack,
#btn-game-tabs > .btn-game-container > .btn-game-menu,
#btn-game-tabs > .btn-game-container > .btn-game-menu-selected,
.ui-keybind-container > .btn-game-menu,
#btn-game-resume,
#ui-game-tab-keybinds > .btn-game-menu,
#ui-game-tab-settings > .btn-game-menu,
.ui-stats-player-spectate,
.ui-stats-player-icon,
.btn-blue,
.ui-stats-find-killer,
#btn-spectate-view-stats,
.region-availables,
.properties-availables,
.filter-selected,
.availables-filters,
.search-btn
{
  background-color: var(--background)!important;
  border-bottom: 4px solid var(--shadow)!important;
  box-shadow: none!important;
  -webkit-animation-name: none!important;
}
#modal-banned-user>.modal-content>.modal-footer>.close-footer>.btn-confirm-no:not(:empty),
#btn-help,
.btn-keybind,
.btn-start-option,
.audio-on-icon,
.btn-game-menu,
#ui-modal-keybind-footer>.btn-game-menu,
#keybind-copy,
#modal-no-gp-more,
.finish,
.btn-confirm-no,
.btn-confirm-yes,
.warning-button,
.btn-modal-confirm,
.btn-confirm-sell,
.ui-stats-player-spectate-red,
.ok-button,
.reset-btn,
.private-btn
{
  background-color: var(--red)!important;
  border-bottom: 4px solid var(--redsh)!important;
  box-shadow: none!important;
  -webkit-animation-name: none!important;
}
.account-details-link-out,
.server-select,
.btn-account-turq,
.btn-account-grey,
.btn-login-facebook,
.btn-login-google,
.btn-login-twitch,
.btn-login-discord,
.btn-login-apple,
.btn-login-steam
{
  border-bottom: none!important;
}
.btn-settings {
  margin-bottom: 0px;
}
.account-details-block, .account-buttons-wrapper {
  width: 100%;
  right: 37px;
}
.btn-account-delete {
  background-color: var(--red)!important;
  border-bottom: 4px solid var(--redsh)!important;
  box-shadow: none!important;
}
.account-details-link-out, .crate-gp-icon, .pass-premium-bg, .team-menu-member>.icon-leader, #market-input-price::before {
  background-image: none!important;
}
.account-buttons-wrapper {
  background-color: rgba(0,0,0,.2);
}
.btn-open-arena {
  background-position: center;
  width: 100px;
}
#open-arena-button {
  left: 590px;
}
#sk_clan {
  width: 100px;
  height: 66px;
  pointer-events: all;
  background-image: url(../img/clans/icon-hud.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 22px;
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 5px;
  position: absolute;
  top: var(--side-pad);
  left: 482px;
  transition: all .25s ease;
}
#sk_support {
  width: 232px;
  height: 36px;
  pointer-events: all;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 22px;
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 5px;
  position: absolute;
  top: 60px;
  right: 22px;
  transition: all .25s ease;
  text-align: center;
  font-size: 19px;
  text-decoration: none;
  font-weight: 700;
}
#sk_settings {
  background-image: url(../img/gui/cog.svg);
  background-size: 44px;
  background-position: center;
  background-repeat: no-repeat;
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 5px;
  position: absolute;
  right: 258px;
  width: 50px;
  height: 44px;
  top: var(--side-pad);
  transition: all .25s ease;
}
#sk_news {
  background-image: url(../img/gui/news.svg);
  background-size: 35px;
  background-position: center;
  background-repeat: no-repeat;
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 5px;
  position: absolute;
  right: 312px;
  width: 50px;
  height: 44px;
  top: var(--side-pad);
  transition: all .25s ease;
}
#sk_discord {
  color: #fff;
  background-color: #5865F2!important;
  cursor: pointer;
  text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
  font-weight: 700;
  width: 100%;
  border: none!important;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 18px;
  transition: all .25s ease;
  margin-bottom: 5px;
}
#sk_clan:hover, #sk_support:hover, #sk_settings:hover, #sk_news:hover, #loadoutTeam:hover, #sk_discord:hover {
  filter: brightness(80%);
  transition: all .25s ease;
}
.account-details-block:hover {
  background-color: var(--background)!important;
  border-bottom: 4px solid var(--shadow)!important;
  box-shadow: none!important;
  filter: brightness(80%);
  transition: all .25s ease;
}
.btn-clan-outer, .support-btn-container, .btn-settings, #btn-news, #social-share-block-wrapper, #start-top-left, .pass-xp-buy-btn, .btn-offerwall-container, #boost-warning, .iap-discount {
  display: none!important;
}
.btn-battle {
  -webkit-animation-name: none;
}
#btn-create-team {
  margin-left: 0px;
  width: 100%;
}
.btn-battle-container {
  margin-bottom: -25px;
}
#server-warning {
  background-image: linear-gradient(to right, rgba(112, 210, 36, 0.7), rgba(50, 168, 82, 0.7), rgba(0, 255, 255, 0.7));
  width: 500px;
  padding: 30px;
  line-height: 0;
  border-radius: 20px;
  top: 130px;
  font-size: 20px;
  color: #fff;
}
.notLogged, .btn-team-fill {
  background: none!important;
  box-shadow: none!important;
}
.account-name {
  text-align: center!important;
}
.pass-basic-item, .pass-premium-item, .customize-item-image:not(.customize-item-image>.customize-item-image, #customize-emote-middle>.customize-item-image, #customize-emote-top>.customize-item-image, #customize-emote-right>.customize-item-image, #customize-emote-bottom>.customize-item-image, #customize-emote-left>.customize-item-image, #customize-emote-win>.customize-item-image, #customize-emote-death>.customize-item-image), .iap-item-img, .market-item-img, .items-crate-contains {
  border: 3px solid var(--background)!important;
  background-color: var(--shadow)!important;
}
.item-rarity-style-border, .pass-lock, .option-change-mode, .option-change-type, .modal-header, .modal-footer, .modal-content-right, .item-rarity-style, .body, .battle-summary-header, .modal-header, .market-modal-sell-item-container, .right-market-btn:not(#market-type-selected, #market-rarity-selected, #market-sort-selected, #market-mode-selected), .iap-items-buying, .modal-items-odds, .ui-stats-player-name, .modal-clans-header-inspect, .modal-clans-footer-inspect {
  background-color: var(--background)!important;
}
#modal-prestige-body, #prestige-battle-button.selected, #prestige-create-button.selected, #prestige-spectate-button, #clans-wrapper>.body, #clans-hub-btn.show, #my-clans-btn.show, #new-clan-btn.show, #tournament-btn.show {
  background-color: #141414d0!important;
}
#prestige-battle-button, #prestige-create-button, #prestige-spectate-button, #clans-hub-btn, #my-clans-btn, #new-clan-btn, #tournament-btn {
  background-color: rgba(37, 37, 37, 0.8)!important;
}
.gold-potato-container, .modal-body, #keybind-code-input, #modal-customize-item-header, #modal-customize-list, .clans-background, .modal-prestige-body-inner, .battle-summary-body, .modal-body, .market-container, .iap-modal-price-container, .item-odd, .ui-stats-table-row, .modal-clans-body-inspect, .table-clans .clan-row {
  background-color: var(--shadow)!important;
}
.pass-basic-items>div.golden {
  background: none!important;
  padding: 0px!important
}
#start-row-header {
  top:100px!important;
}
.premium {
  border-top: none!important;
  border-right: none!important;
  border-left: none!important;
  background: var(--background)!important;
  background-clip: border-box!important;
  background-origin: border-box!important;
}
.pass-premium-row {
  background: rgba(0,0,0,.5)!important;
}
#pass-buy-btn {
  background: var(--background)!important;
  height: 60px;
  margin-bottom:0;
  color: var(--pink);
}
.pass-premium-box-timer, .team-link-entry {
  color: var(--pink)!important;
  background: var(--shadow)!important;
  border: 2px solid var(--shadow)!important;
}
#loadoutTeam {
  width: 173px;
  bottom: 37px;
  position: absolute;
  font-size: 20px;
  height: 55px;
  text-shadow: rgba(0, 0, 0, 0.5) 0px 1px 2px;
  font-weight: 800;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 4px solid var(--shadow)!important;
  box-shadow: none;
  right: 364.5px;
  pointer-events: all !important;
  border-radius: 5px;
  background-color: var(--background)!important;
  color: #fff;
  cursor: pointer;
  transition: all .25s ease;
}
.menu-team-autofill-option {
  height: 46px;
}
.team-menu-option {
  height: 36px;
}
#btn-team-leave {
  background: var(--red)!important;
  box-shadow: none!important;
  border-bottom: 4px solid var(--redsh)!important;
  height: 46px;
  line-height: 46px;
}
#team-search-button {
  background-color: var(--red)!important;
  box-shadow: none!important;
  border: none!important;
  height: 41px!important;
  border-radius: 0 5px 5px 0!important;
  margin-right: 0px!important;
}
#squad-boost-perc {
  background: none!important;
  border-radius: 0px!important;
  border: 2px solid var(--red)!important;
  margin-top: -47.5px!important;
  height: 45px!important;
}
#xp-boost-bar {
  background: var(--red)!important;
  height: 47px!important;
  border-radius: 0px!important;
}
.xp-boost-bar-container {
  background: none!important;
  height: 46px!important;
}
.trainee-block, .pass-quest-bar-fill {
  background: var(--red)!important;
}
.table-header {
  background-color: var(--red)!important;
}
.name-self, .member-boost-value {
  color: var(--red)!important;
}
#btn-team-mobile-link-join {
  margin-top: 5px!important;
}
.hide-item, .copy-item {
  border-radius: 5px!important;
  width: 84.5px!important;
}
.hide-item {
  margin-left: 0px!important;
}
::placeholder, #modal-banned-time, #keybind-code-input, .highlight, .stats-golden-text, .search-input, .battle-link-entry, a:hover, a:link, input, #battle-link, .value-text, .iap-lto-time-left-text, .market-item-stats-text > p, #market-input-price::before, .iap-modal-price {
  color: var(--pink)!important;
}
#team-link-input, #team-code, #team-url, .market-modal-price {
  color: var(--pink)!important;
  background: var(--shadow)!important;
  border-radius: 0px!important;
}
#team-link-input {
  margin-left: 0px!important;
  width: 178.5px!important;
}
#team-code {
  margin-left: 45px!important;
  width: 178.5px!important;
}
#btn-team-mobile-link-join {
  margin-left: 14px!important;
}
#btn-help {
  line-height: 43px!important;
}
#ui-modal-keybind-list, #news-block, .market-items-list-container, .market-list-item-container, #ui-stats-contents-inner {
  background-color: rgba(0,0,0,0)!important;
}
#modal-customize-body {
  margin-top: -1px!important;
  margin-bottom: -1px!important;
}
#color-picker-hex {
  border: none!important;
  border-radius: 0px!important;
}
#modal-no-gp-more:hover, .btn-confirm-no:hover, .btn-confirm-yes, .btn-confirm-yes:hover, .battle-mode, .battle-type, #market-modal-confirm-buy-item > span, #market-modal-btn-sell, #market-modal-btn-sell:hover, #squad-boost-value, #team-boost, .modal-footer>.close>.btn-confirm-sell, .modal-footer>.close>.btn-confirm-sell:hover, #open-crate-3, #open-crate-2, #open-crate-1, .iap-price:hover, .iap-price, #btn-start-battle:hover, #btn-start-team:hover, .ui-stats-header-title, .ui-stats-table-row.ui-stats-current div {
  color: white!important;
}
#battle-search-button {
  box-shadow: inset 0 -2px var(--shadow)!important;
  background-color: var(--background)!important;
  background-image: url(https://raw.githubusercontent.com/Samer-Kizi/survivio-mods/main/scripts/img/search.svg)!important;
}
.reset-button {
  box-shadow: inset 0 -2px var(--shadow)!important;
  border-bottom: inset 0 -2px var(--background)!important;
  background-color: var(--background)!important;
  background-image: url(https://raw.githubusercontent.com/Samer-Kizi/survivio-mods/main/scripts/img/reset.svg)!important;
  border-radius: 5px!important;
}
.upload-button {
  box-shadow: inset 0 -2px var(--shadow)!important;
  border-bottom: inset 0 -2px var(--background)!important;
  background-color: var(--background)!important;
  background-image: url(https://raw.githubusercontent.com/Samer-Kizi/survivio-mods/main/scripts/img/edit.svg)!important;
  border-radius: 5px!important;
}
.search-button {
  box-shadow: inset 0 -2px var(--shadow)!important;
  border-bottom: inset 0 -2px var(--background)!important;
  background-color: var(--background)!important;
  background-image: url(https://raw.githubusercontent.com/Samer-Kizi/survivio-mods/main/scripts/img/search.svg)!important;
  border-radius: 5px!important;
}
.btn-change-type-inner {
  width: 99%!important;
}
.copy-button {
  background-image: url(https://surviv.io/img/gui/copy.svg)!important;
}
.discord-button, .warning-button {
  border-radius: 5px!important;
}
#market-items-list {
  width: 100%!important;
  margin-right: -5px!important;
}
.iap-limited-offers {
  background: var(--shadow)!important;
}
#btn-game-tabs > .btn-game-container > .btn-game-menu, #btn-game-tabs > .btn-game-container > .btn-game-menu-selected {
  border: none!important;
  border-color: var(--pink)!important;
}
#ui-stats-info-box {
  background: rgba(0,0,0,0)!important;
}
#ui-stats-bg {
  background: #222222dd!important;
}
#free-gp-offer {
  padding: 40px!important;
  height: auto!important;
}
.filter-group .availables-filters .filter-available.selected {
  background-color: var(--shadow);
  box-shadow: none!important;
  border: none!important;
}
#start-row-header::before {content: """";background-image: url(http://surviv.io/img/surviv_logo_full.svg);position: absolute;height: 100%;width: 100%;background-repeat: no-repeat;background-position: 50%;background-size: inherit;top: 0px;filter: drop-shadow(4px 4px 0px #f00);animation: glitch-loop-1 0.7s infinite ease-in-out;}#start-row-header::after {content: """";background-image: url(http://surviv.io/img/surviv_logo_full.svg);position: absolute;height: 100%;width: 100%;background-repeat: no-repeat;background-position: 50%;background-size: inherit;top: 0px;filter: drop-shadow(5px -5px 0px #00f);animation: glitch-loop-2 0.3s infinite ease-in-out alternate-reverse;}@keyframes glitch-loop-1 {0% { clip-path: inset(100% 100%) }1% { left: -1.0%; clip-path: inset(15% 0% 80% 0%) }5% { left: 0.0%; clip-path: inset(25% 0% 70% 0%) }5.1% { clip-path: inset(100% 100%) }11% { left: 1.0%; clip-path: inset(90% 0% 10% 0%) }15% { left: 0.5%; clip-path: inset(85% 0% -20% 0%) }15.1% { clip-path: inset(100% 100%) }31% { left: -1.0%; clip-path: inset(40% 0% 50% 0%) }35% { left: -0.5%; clip-path: inset(50% 0% 40% 0%) }35.1% { clip-path: inset(100% 100%) }41% { left: -0.5%; clip-path: inset(-500% 0% 95% 0%) }45% { left: 1.5%; clip-path: inset(500% 0% 85% 0%) }45.1% { clip-path: inset(100% 100%) }61% { left: -1.5%; clip-path: inset(40% 0% 50% 0%) }65% { left: 0.5%; clip-path: inset(30% 0% 45% 0%) }65.1% { clip-path: inset(100% 100%) }81% { left: 0.5%; clip-path: inset(66% 0% 11% 0%) }85% { left: 1.0%; clip-path: inset(77% 0% 77% 0%) }85.1% { clip-path: inset(100% 100%) }100% { clip-path: inset(100% 100%) }}@keyframes glitch-loop-2 {0% { clip-path: inset(100% 100%) }1% { left: 1.0%; clip-path: inset(55% 0% 33% 0%) }5% { left: 0.5%; clip-path: inset(66% 0% 33% 0%) }5.1% { clip-path: inset(100% 100%) }11% { left: -1.0%; clip-path: inset(-200% 0% 300% 0%) }15% { left: 0.5%; clip-path: inset(70% 0% 23% 0%) }15.1% { clip-path: inset(100% 100%) }31% { left: 1.0%; clip-path: inset(10% 0% 74% 0%) }35% { left: 0.5%; clip-path: inset(30% 0% 70% 0%) }35.1% { clip-path: inset(100% 100%) }41% { left: 1.0%; clip-path: inset(200% 0% -100% 0%) }45% { left: -1.5%; clip-path: inset(30% 0% 500% 0%) }45.1% { clip-path: inset(100% 100%) }61% { left: 1.5%; clip-path: inset(56% 0% 36% 0%) }65% { left: -0.5%; clip-path: inset(60% 0% 31% 0%) }65.1% { clip-path: inset(100% 100%) }81% { left: -0.5%; clip-path: inset(90% 0% 0% 0%) }85% { left: -1.0%; clip-path: inset(200% 0% 0% 0%) }85.1% { clip-path: inset(100% 100%) }100% { clip-path: inset(100% 100%) }}
`);