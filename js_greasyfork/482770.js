// ==UserScript==
// @name         石之家楼层显示fflogs数据
// @description  队伍招募时便捷查询，请勿滥用
// @version      2024.8.19.2
// @icon         https://ff14risingstones.web.sdo.com/pc/favicon.ico
// @namespace    https://github.com/UnluckyNinja
// @homepage     https://github.com/UnluckyNinja/risingstone-fflogs
// @author       UnluckyNinja
// @match        https://ff14risingstones.web.sdo.com/pc/index.html
// @connect      fflogs.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @sandbox      raw
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/482770/%E7%9F%B3%E4%B9%8B%E5%AE%B6%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BAfflogs%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/482770/%E7%9F%B3%E4%B9%8B%E5%AE%B6%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BAfflogs%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

GM_addStyle(`td img {
  box-sizing: content-box;
}
.simple-tooltip-container {
  position: relative;
}
.simple-tooltip-content {
  display: none;
  position: absolute;
  top: 75%;
  right: 10%;
  width: 200px;
  background-color: #000;
  z-index: 99;
  padding: .75rem;
  flex-direction: column;
  border: 1px solid #555;
  white-space: normal;
}
.simple-tooltip-content:hover,
.simple-tooltip-visible-content:hover + .simple-tooltip-content {
  display: flex;
}
.not-locked-message {
  display: none;
  font-size: 10px;
  color: #a0a0a0 !important;
  white-space: nowrap;
  margin-left: 10px;
}
.boss-icon {
  width: 24px;
  height: 24px;
  border: 1px solid #555555;
  margin-right: 3px;
  vertical-align: -9px;
}
.zone-boss-cell {
  font-size: 14px;
  font-weight: 700;
}
th,
td {
  white-space: nowrap;
}
.tiny-icon,
.partner-icon {
  width: 18px !important;
  height: 18px !important;
  border: 1px solid #555555;
  margin: 0 2px;
  vertical-align: -6px;
  --size:18 !important;
}
.partner-icon {
  margin-right: 4px !important;
}
.artifact {
  color: #e5cc80 !important;
}
.legendary {
  color: #ff8000 !important;
}
.astounding {
  color: #e268a8 !important;
}
.magnificent {
  color: #be8200 !important;
}
.epic {
  color: #a335ee !important;
}
.rare {
  color: #0070ff !important;
}
.uncommon {
  color: #1eff00 !important;
}
.uncommon-muted {
  color: #48c238 !important;
}
.common {
  color: #666 !important;
}
.common-white {
  color: #e1f2f5 !important;
}
td UIForeground,
td UIGlow {
  display: none;
}
td .aura {
  width: auto !important;
  border: 0 !important;
}
td .aura-filter-link .aura {
  height: 24px;
}
td .LimitBreak,
td .LimitBreak.do-not-change-color-on-hover:hover {
  color: #2599be !important;
}
td .LimitBreak-behind-text,
td .LimitBreak-bg {
  background-color: #2599be !important;
}
td .LimitBreak:hover {
  color: #35a9ce !important;
}
td .Scholar,
td .Scholar.do-not-change-color-on-hover:hover {
  color: #8657ff !important;
}
td .Scholar:hover {
  color: #a677ff !important;
}
td .Scholar-behind-text,
td .Scholar-bg {
  background-color: #8657ff !important;
}
td .Astrologian,
td .Astrologian.do-not-change-color-on-hover:hover {
  color: #ffe74a !important;
}
td .Astrologian:hover {
  color: #fff75a !important;
}
td .Astrologian-bg {
  background-color: #ffe74a !important;
}
td .Astrologian-behind-text {
  background-color: #ab9400 !important;
}
td .Monk,
td .Monk.do-not-change-color-on-hover:hover,
td .Pugilist,
td .Pugilist.do-not-change-color-on-hover:hover {
  color: #d69c00 !important;
}
td .Monk-behind-text,
td .Monk-bg,
td .Pugilist-behind-text,
td .Pugilist-bg {
  background-color: #d69c00 !important;
}
td .Monk:hover,
td .Pugilist:hover {
  color: #e6ac00 !important;
}
td .Ninja,
td .Ninja.do-not-change-color-on-hover:hover,
td .Rogue,
td .Rogue.do-not-change-color-on-hover:hover {
  color: #af1964 !important;
}
td .Ninja-behind-text,
td .Ninja-bg,
td .Rogue-behind-text,
td .Rogue-bg {
  background-color: #af1964 !important;
}
td .Ninja:hover,
td .Rogue:hover {
  color: #bf2974 !important;
}
td .Conjurer,
td .Conjurer.do-not-change-color-on-hover:hover,
td .WhiteMage,
td .WhiteMage.do-not-change-color-on-hover:hover {
  color: #fff0dc !important;
}
td .Conjurer-bg,
td .WhiteMage-bg {
  background-color: #fff0dc !important;
}
td .Conjurer-behind-text,
td .WhiteMage-behind-text {
  background-color: #afa08c !important;
}
td .Conjurer:hover,
td .WhiteMage:hover {
  color: #fff !important;
}
td .DarkKnight,
td .DarkKnight.do-not-change-color-on-hover:hover {
  color: #d126cc !important;
}
td .DarkKnight-bg {
  background-color: #d126cc !important;
}
td .DarkKnight-behind-text {
  background-color: #681366 !important;
}
td .DarkKnight:hover {
  color: #e034dc !important;
}
td .Gladiator,
td .Gladiator.do-not-change-color-on-hover:hover,
td .Paladin,
td .Paladin.do-not-change-color-on-hover:hover {
  color: #a8d2e6 !important;
}
td .Gladiator-bg,
td .Paladin-bg {
  background-color: #a8d2e6 !important;
}
td .Gladiator-behind-text,
td .Paladin-behind-text {
  background-color: #588296 !important;
}
td .Paladin:hover {
  color: #b8e2f6 !important;
}
td .Archer,
td .Archer.do-not-change-color-on-hover:hover,
td .Bard,
td .Bard.do-not-change-color-on-hover:hover {
  color: #91ba5e !important;
}
td .Archer-behind-text,
td .Archer-bg,
td .Bard-behind-text,
td .Bard-bg {
  background-color: #91ba5e !important;
}
td .Archer:hover,
td .Bard:hover {
  color: #abd478 !important;
}
td .Dragoon,
td .Dragoon.do-not-change-color-on-hover:hover,
td .Lancer,
td .Lancer.do-not-change-color-on-hover:hover {
  color: #4164cd !important;
}
td .Dragoon-behind-text,
td .Dragoon-bg,
td .Lancer-behind-text,
td .Lancer-bg {
  background-color: #4164cd !important;
}
td .Dragoon:hover,
td .Lancer:hover {
  color: #5174dd !important;
}
td .Marauder,
td .Marauder.do-not-change-color-on-hover:hover,
td .Warrior,
td .Warrior.do-not-change-color-on-hover:hover {
  color: #cf2621 !important;
}
td .Marauder-behind-text,
td .Marauder-bg,
td .Warrior-behind-text,
td .Warrior-bg {
  background-color: #cf2621 !important;
}
td .Marauder:hover,
td .Warrior:hover {
  color: #ff4641 !important;
}
td .Machinist,
td .Machinist.do-not-change-color-on-hover:hover {
  color: #6ee1d6 !important;
}
td .Machinist-behind-text,
td .Machinist-bg {
  background-color: #6ee1d6 !important;
}
td .Machinist:hover {
  color: #7ef1e6 !important;
}
td .Arcanist,
td .Arcanist.do-not-change-color-on-hover:hover,
td .Arcanist:hover,
td .Summoner,
td .Summoner.do-not-change-color-on-hover:hover,
td .Summoner:hover {
  color: #2d9b78 !important;
}
td .Arcanist-behind-text,
td .Arcanist-bg,
td .Summoner-behind-text,
td .Summoner-bg {
  background-color: #2d9b78 !important;
}
td .BlackMage,
td .BlackMage.do-not-change-color-on-hover:hover,
td .Thaumaturge,
td .Thaumaturge.do-not-change-color-on-hover:hover {
  color: #a579d6 !important;
}
td .BlackMage-behind-text,
td .BlackMage-bg,
td .Thaumaturge-behind-text,
td .Thaumaturge-bg {
  background-color: #a579d6 !important;
}
td .BlackMage:hover,
td .Thaumaturge:hover {
  color: #b589e6 !important;
}
td .Reaper,
td .Reaper.do-not-change-color-on-hover:hover,
td .Reaper:hover {
  color: #965a90 !important;
}
td .Reaper-behind-text,
td .Reaper-bg {
  background-color: #965a90 !important;
}
td .RedMage,
td .RedMage.do-not-change-color-on-hover:hover {
  color: #e87b7b !important;
}
td .RedMage-behind-text,
td .RedMage-bg {
  background-color: #e87b7b !important;
}
td .RedMage:hover {
  color: #e89b9b !important;
}
td .Sage,
td .Sage.do-not-change-color-on-hover:hover {
  color: #80a0f0 !important;
}
td .Sage-behind-text,
td .Sage-bg {
  background-color: #80a0f0 !important;
}
td .Sage:hover {
  color: #90b0ff !important;
}
td .Samurai,
td .Samurai.do-not-change-color-on-hover:hover {
  color: #e46d04 !important;
}
td .Samurai-behind-text,
td .Samurai-bg {
  background-color: #e46d04 !important;
}
td .Samurai:hover {
  color: #f48db4 !important;
}
td .Dancer,
td .Dancer.do-not-change-color-on-hover:hover {
  color: #e2b0af !important;
}
td .Dancer-behind-text,
td .Dancer-bg {
  background-color: #e2b0af !important;
}
td .Dancer:hover {
  color: #f2c0bf !important;
}
td .Gunbreaker,
td .Gunbreaker.do-not-change-color-on-hover:hover {
  color: #998d50 !important;
}
td .Gunbreaker-behind-text,
td .Gunbreaker-bg {
  background-color: #796d30 !important;
}
td .Gunbreaker:hover {
  color: #796d30 !important;
}
td .BlueMage,
td .BlueMage.do-not-change-color-on-hover:hover,
td .BlueMage:hover {
  color: #2459ff !important;
}
td .BlueMage-behind-text,
td .BlueMage-bg {
  background-color: #2459ff !important;
}
td .Viper,
td .Viper.do-not-change-color-on-hover:hover {
  color: #108210 !important;
}
td .Viper-behind-text,
td .Viper-bg {
  background-color: #108210 !important;
}
td .Viper:hover {
  color: #30a230 !important;
}
td .Pictomancer,
td .Pictomancer.do-not-change-color-on-hover:hover {
  color: #fc92e1 !important;
}
td .Pictomancer-behind-text,
td .Pictomancer-bg {
  background-color: #fc92e1 !important;
}
td .Pictomancer:hover {
  color: #ffa2f1 !important;
}
td .sprite {
  object-fit: cover;
}
td .actor-sprite-Arcanist {
  object-position: calc(0px*var(--size))0;
}
td .actor-sprite-Archer {
  object-position: calc(-1px*var(--size))0;
}
td .actor-sprite-Astrologian {
  object-position: calc(-2px*var(--size))0;
}
td .actor-sprite-Bard {
  object-position: calc(-3px*var(--size))0;
}
td .actor-sprite-BlackMage {
  object-position: calc(-4px*var(--size))0;
}
td .actor-sprite-BlueMage {
  object-position: calc(-5px*var(--size))0;
}
td .actor-sprite-Boss {
  object-position: calc(-6px*var(--size))0;
}
td .actor-sprite-Conjurer {
  object-position: calc(-7px*var(--size))0;
}
td .actor-sprite-Dancer {
  object-position: calc(-8px*var(--size))0;
}
td .actor-sprite-DarkKnight {
  object-position: calc(-9px*var(--size))0;
}
td .actor-sprite-Dragoon {
  object-position: calc(-10px*var(--size))0;
}
td .actor-sprite-Gladiator {
  object-position: calc(-11px*var(--size))0;
}
td .actor-sprite-Gunbreaker {
  object-position: calc(-12px*var(--size))0;
}
td .actor-sprite-Lancer {
  object-position: calc(-13px*var(--size))0;
}
td .actor-sprite-LimitBreak {
  object-position: calc(-14px*var(--size))0;
}
td .actor-sprite-Machinist {
  object-position: calc(-15px*var(--size))0;
}
td .actor-sprite-Marauder {
  object-position: calc(-16px*var(--size))0;
}
td .actor-sprite-Monk {
  object-position: calc(-17px*var(--size))0;
}
td .actor-sprite-NPC {
  object-position: calc(-18px*var(--size))0;
}
td .actor-sprite-Ninja {
  object-position: calc(-19px*var(--size))0;
}
td .actor-sprite-Paladin {
  object-position: calc(-20px*var(--size))0;
}
td .actor-sprite-Pet {
  object-position: calc(-21px*var(--size))0;
}
td .actor-sprite-Pictomancer {
  object-position: calc(-22px*var(--size))0;
}
td .actor-sprite-Pugilist {
  object-position: calc(-23px*var(--size))0;
}
td .actor-sprite-Reaper {
  object-position: calc(-24px*var(--size))0;
}
td .actor-sprite-RedMage {
  object-position: calc(-25px*var(--size))0;
}
td .actor-sprite-Rogue {
  object-position: calc(-26px*var(--size))0;
}
td .actor-sprite-Sage {
  object-position: calc(-27px*var(--size))0;
}
td .actor-sprite-Samurai {
  object-position: calc(-28px*var(--size))0;
}
td .actor-sprite-Scholar {
  object-position: calc(-29px*var(--size))0;
}
td .actor-sprite-Summoner {
  object-position: calc(-30px*var(--size))0;
}
td .actor-sprite-Thaumaturge {
  object-position: calc(-31px*var(--size))0;
}
td .actor-sprite-Viper {
  object-position: calc(-32px*var(--size))0;
}
td .actor-sprite-Warrior {
  object-position: calc(-33px*var(--size))0;
}
td .actor-sprite-WhiteMage {
  object-position: calc(-34px*var(--size))0;
}
td .actor-sprite-Arcanist-secondary {
  object-position: calc(0px*var(--size))0;
}
td .actor-sprite-Archer-secondary {
  object-position: calc(-1px*var(--size))0;
}
td .actor-sprite-Astrologian-secondary {
  object-position: calc(-2px*var(--size))0;
}
td .actor-sprite-Bard-secondary {
  object-position: calc(-3px*var(--size))0;
}
td .actor-sprite-BlackMage-secondary {
  object-position: calc(-4px*var(--size))0;
}
td .actor-sprite-Conjurer-secondary {
  object-position: calc(-5px*var(--size))0;
}
td .actor-sprite-Dancer-secondary {
  object-position: calc(-6px*var(--size))0;
}
td .actor-sprite-DarkKnight-secondary {
  object-position: calc(-7px*var(--size))0;
}
td .actor-sprite-Dragoon-secondary {
  object-position: calc(-8px*var(--size))0;
}
td .actor-sprite-Gladiator-secondary {
  object-position: calc(-9px*var(--size))0;
}
td .actor-sprite-Gunbreaker-secondary {
  object-position: calc(-10px*var(--size))0;
}
td .actor-sprite-Lancer-secondary {
  object-position: calc(-11px*var(--size))0;
}
td .actor-sprite-Machinist-secondary {
  object-position: calc(-12px*var(--size))0;
}
td .actor-sprite-Marauder-secondary {
  object-position: calc(-13px*var(--size))0;
}
td .actor-sprite-Monk-secondary {
  object-position: calc(-14px*var(--size))0;
}
td .actor-sprite-Ninja-secondary {
  object-position: calc(-15px*var(--size))0;
}
td .actor-sprite-Paladin-secondary {
  object-position: calc(-16px*var(--size))0;
}
td .actor-sprite-Pugilist-secondary {
  object-position: calc(-17px*var(--size))0;
}
td .actor-sprite-Reaper-secondary {
  object-position: calc(-18px*var(--size))0;
}
td .actor-sprite-RedMage-secondary {
  object-position: calc(-19px*var(--size))0;
}
td .actor-sprite-Rogue-secondary {
  object-position: calc(-20px*var(--size))0;
}
td .actor-sprite-Role-1-secondary {
  object-position: calc(-21px*var(--size))0;
}
td .actor-sprite-Role-2-secondary {
  object-position: calc(-22px*var(--size))0;
}
td .actor-sprite-Role-3-secondary {
  object-position: calc(-23px*var(--size))0;
}
td .actor-sprite-Role-4-secondary {
  object-position: calc(-24px*var(--size))0;
}
td .actor-sprite-Role-5-secondary {
  object-position: calc(-25px*var(--size))0;
}
td .actor-sprite-Sage-secondary {
  object-position: calc(-26px*var(--size))0;
}
td .actor-sprite-Samurai-secondary {
  object-position: calc(-27px*var(--size))0;
}
td .actor-sprite-Scholar-secondary {
  object-position: calc(-28px*var(--size))0;
}
td .actor-sprite-Summoner-secondary {
  object-position: calc(-29px*var(--size))0;
}
td .actor-sprite-Thaumaturge-secondary {
  object-position: calc(-30px*var(--size))0;
}
td .actor-sprite-Warrior-secondary {
  object-position: calc(-31px*var(--size))0;
}
td .actor-sprite-WhiteMage-secondary {
  object-position: calc(-32px*var(--size))0;
}
td .actor-sprite-Pictomancer-secondary {
  object-position: calc(-33px*var(--size))0;
}
td .actor-sprite-Viper-secondary {
  object-position: calc(-34px*var(--size))0;
}
.trigger[data-v-ed6c51cc] {
  position: relative;
  background-color: transparent;
  overflow: hidden;
  z-index: 1;
}
.trigger[data-v-ed6c51cc]:after {
  content: " ";
  background-color: #87cefa;
  position: absolute;
  right: 100%;
  width: 100%;
  height: 100%;
  transition: right 0s;
  z-index: -1;
}
.trigger[data-v-ed6c51cc]:hover:after {
  right: 0%;
  transition: right .5s linear;
}
[data-v-ed6c51cc],
[data-v-ed6c51cc]:before,
[data-v-ed6c51cc]:after {
  --un-rotate:0;
  --un-rotate-x:0;
  --un-rotate-y:0;
  --un-rotate-z:0;
  --un-scale-x:1;
  --un-scale-y:1;
  --un-scale-z:1;
  --un-skew-x:0;
  --un-skew-y:0;
  --un-translate-x:0;
  --un-translate-y:0;
  --un-translate-z:0;
  --un-pan-x: ;
  --un-pan-y: ;
  --un-pinch-zoom: ;
  --un-scroll-snap-strictness:proximity;
  --un-ordinal: ;
  --un-slashed-zero: ;
  --un-numeric-figure: ;
  --un-numeric-spacing: ;
  --un-numeric-fraction: ;
  --un-border-spacing-x:0;
  --un-border-spacing-y:0;
  --un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);
  --un-ring-shadow:0 0 rgb(0 0 0 / 0);
  --un-shadow-inset: ;
  --un-shadow:0 0 rgb(0 0 0 / 0);
  --un-ring-inset: ;
  --un-ring-offset-width:0px;
  --un-ring-offset-color:#fff;
  --un-ring-width:0px;
  --un-ring-color:rgb(147 197 253 / .5);
  --un-blur: ;
  --un-brightness: ;
  --un-contrast: ;
  --un-drop-shadow: ;
  --un-grayscale: ;
  --un-hue-rotate: ;
  --un-invert: ;
  --un-saturate: ;
  --un-sepia: ;
  --un-backdrop-blur: ;
  --un-backdrop-brightness: ;
  --un-backdrop-contrast: ;
  --un-backdrop-grayscale: ;
  --un-backdrop-hue-rotate: ;
  --un-backdrop-invert: ;
  --un-backdrop-opacity: ;
  --un-backdrop-saturate: ;
  --un-backdrop-sepia: ;
}
[data-v-ed6c51cc]::backdrop {
  --un-rotate:0;
  --un-rotate-x:0;
  --un-rotate-y:0;
  --un-rotate-z:0;
  --un-scale-x:1;
  --un-scale-y:1;
  --un-scale-z:1;
  --un-skew-x:0;
  --un-skew-y:0;
  --un-translate-x:0;
  --un-translate-y:0;
  --un-translate-z:0;
  --un-pan-x: ;
  --un-pan-y: ;
  --un-pinch-zoom: ;
  --un-scroll-snap-strictness:proximity;
  --un-ordinal: ;
  --un-slashed-zero: ;
  --un-numeric-figure: ;
  --un-numeric-spacing: ;
  --un-numeric-fraction: ;
  --un-border-spacing-x:0;
  --un-border-spacing-y:0;
  --un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);
  --un-ring-shadow:0 0 rgb(0 0 0 / 0);
  --un-shadow-inset: ;
  --un-shadow:0 0 rgb(0 0 0 / 0);
  --un-ring-inset: ;
  --un-ring-offset-width:0px;
  --un-ring-offset-color:#fff;
  --un-ring-width:0px;
  --un-ring-color:rgb(147 197 253 / .5);
  --un-blur: ;
  --un-brightness: ;
  --un-contrast: ;
  --un-drop-shadow: ;
  --un-grayscale: ;
  --un-hue-rotate: ;
  --un-invert: ;
  --un-saturate: ;
  --un-sepia: ;
  --un-backdrop-blur: ;
  --un-backdrop-brightness: ;
  --un-backdrop-contrast: ;
  --un-backdrop-grayscale: ;
  --un-backdrop-hue-rotate: ;
  --un-backdrop-invert: ;
  --un-backdrop-opacity: ;
  --un-backdrop-saturate: ;
  --un-backdrop-sepia: ;
}
.absolute[data-v-ed6c51cc] {
  position: absolute;
}
.relative[data-v-ed6c51cc] {
  position: relative;
}
.left-0[data-v-ed6c51cc] {
  left: 0;
}
.top-0[data-v-ed6c51cc] {
  top: 0;
}
.z-10[data-v-ed6c51cc] {
  z-index: 10;
}
.z-20[data-v-ed6c51cc] {
  z-index: 20;
}
.mx-2[data-v-ed6c51cc] {
  margin-left: .5rem;
  margin-right: .5rem;
}
.hidden[data-v-ed6c51cc] {
  display: none;
}
.table[data-v-ed6c51cc] {
  display: table;
}
.cursor-pointer[data-v-ed6c51cc] {
  cursor: pointer;
}
.border[data-v-ed6c51cc] {
  border-width: 1px;
}
.rounded[data-v-ed6c51cc] {
  border-radius: .25rem;
}
.border-solid[data-v-ed6c51cc] {
  border-style: solid;
}
.bg-white[data-v-ed6c51cc] {
  --un-bg-opacity:1;
  background-color: rgb(255 255 255 / var(--un-bg-opacity));
}
.p-2[data-v-ed6c51cc] {
  padding: .5rem;
}
.text-cyan-7[data-v-ed6c51cc] {
  --un-text-opacity:1;
  color: rgb(14 116 144 / var(--un-text-opacity));
}
.font-bold[data-v-ed6c51cc] {
  font-weight: 700;
}
.transition[data-v-ed6c51cc] {
  transition-property:
    color,
    background-color,
    border-color,
    outline-color,
    text-decoration-color,
    fill,
    stroke,
    opacity,
    box-shadow,
    transform,
    filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-duration: .15s;
}
`);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: !0 });
(function() {
  "use strict";
  /**
  * @vue/shared v3.4.38
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function makeMap(str, expectsLowerCase) {
    const set2 = new Set(str.split(","));
    return (val) => set2.has(val);
  }
  __name(makeMap, "makeMap");
  const EMPTY_OBJ = {}, EMPTY_ARR = [], NOOP = /* @__PURE__ */ __name(() => {
  }, "NOOP"), NO = /* @__PURE__ */ __name(() => !1, "NO"), isOn = /* @__PURE__ */ __name((key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97), "isOn"), isModelListener = /* @__PURE__ */ __name((key) => key.startsWith("onUpdate:"), "isModelListener"), extend = Object.assign, remove = /* @__PURE__ */ __name((arr, el) => {
    const i = arr.indexOf(el);
    i > -1 && arr.splice(i, 1);
  }, "remove"), hasOwnProperty$1 = Object.prototype.hasOwnProperty, hasOwn = /* @__PURE__ */ __name((val, key) => hasOwnProperty$1.call(val, key), "hasOwn"), isArray = Array.isArray, isMap = /* @__PURE__ */ __name((val) => toTypeString(val) === "[object Map]", "isMap"), isSet = /* @__PURE__ */ __name((val) => toTypeString(val) === "[object Set]", "isSet"), isFunction = /* @__PURE__ */ __name((val) => typeof val == "function", "isFunction"), isString = /* @__PURE__ */ __name((val) => typeof val == "string", "isString"), isSymbol = /* @__PURE__ */ __name((val) => typeof val == "symbol", "isSymbol"), isObject$1 = /* @__PURE__ */ __name((val) => val !== null && typeof val == "object", "isObject$1"), isPromise = /* @__PURE__ */ __name((val) => (isObject$1(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch), "isPromise"), objectToString = Object.prototype.toString, toTypeString = /* @__PURE__ */ __name((value) => objectToString.call(value), "toTypeString"), toRawType = /* @__PURE__ */ __name((value) => toTypeString(value).slice(8, -1), "toRawType"), isPlainObject = /* @__PURE__ */ __name((val) => toTypeString(val) === "[object Object]", "isPlainObject"), isIntegerKey = /* @__PURE__ */ __name((key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key, "isIntegerKey"), isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  ), cacheStringFunction = /* @__PURE__ */ __name((fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => cache[str] || (cache[str] = fn(str));
  }, "cacheStringFunction"), camelizeRE = /-(\w)/g, camelize = cacheStringFunction((str) => str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "")), hyphenateRE = /\B([A-Z])/g, hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  ), capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1)), toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ""), hasChanged = /* @__PURE__ */ __name((value, oldValue) => !Object.is(value, oldValue), "hasChanged"), invokeArrayFns = /* @__PURE__ */ __name((fns, ...arg) => {
    for (let i = 0; i < fns.length; i++)
      fns[i](...arg);
  }, "invokeArrayFns"), def = /* @__PURE__ */ __name((obj, key, value, writable = !1) => {
    Object.defineProperty(obj, key, {
      configurable: !0,
      enumerable: !1,
      writable,
      value
    });
  }, "def"), looseToNumber = /* @__PURE__ */ __name((val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  }, "looseToNumber");
  let _globalThis;
  const getGlobalThis = /* @__PURE__ */ __name(() => _globalThis || (_globalThis = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {}), "getGlobalThis");
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i], normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized)
          for (const key in normalized)
            res[key] = normalized[key];
      }
      return res;
    } else if (isString(value) || isObject$1(value))
      return value;
  }
  __name(normalizeStyle, "normalizeStyle");
  const listDelimiterRE = /;(?![^(]*\))/g, propertyDelimiterRE = /:([^]+)/, styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    return cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    }), ret;
  }
  __name(parseStringStyle, "parseStringStyle");
  function normalizeClass(value) {
    let res = "";
    if (isString(value))
      res = value;
    else if (isArray(value))
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        normalized && (res += normalized + " ");
      }
    else if (isObject$1(value))
      for (const name in value)
        value[name] && (res += name + " ");
    return res.trim();
  }
  __name(normalizeClass, "normalizeClass");
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  __name(includeBooleanAttr, "includeBooleanAttr");
  const isRef$1 = /* @__PURE__ */ __name((val) => !!(val && val.__v_isRef === !0), "isRef$1"), toDisplayString = /* @__PURE__ */ __name((val) => isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val), "toDisplayString"), replacer = /* @__PURE__ */ __name((_key, val) => isRef$1(val) ? replacer(_key, val.value) : isMap(val) ? {
    [`Map(${val.size})`]: [...val.entries()].reduce(
      (entries, [key, val2], i) => (entries[stringifySymbol(key, i) + " =>"] = val2, entries),
      {}
    )
  } : isSet(val) ? {
    [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
  } : isSymbol(val) ? stringifySymbol(val) : isObject$1(val) && !isArray(val) && !isPlainObject(val) ? String(val) : val, "replacer"), stringifySymbol = /* @__PURE__ */ __name((v, i = "") => {
    var _a;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  }, "stringifySymbol");
  /**
  * @vue/reactivity v3.4.38
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  let activeEffectScope;
  const _EffectScope = class _EffectScope {
    constructor(detached = !1) {
      this.detached = detached, this._active = !0, this.effects = [], this.cleanups = [], this.parent = activeEffectScope, !detached && activeEffectScope && (this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1);
    }
    get active() {
      return this._active;
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          return activeEffectScope = this, fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      activeEffectScope = this;
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      activeEffectScope = this.parent;
    }
    stop(fromParent) {
      if (this._active) {
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++)
          this.effects[i].stop();
        for (i = 0, l = this.cleanups.length; i < l; i++)
          this.cleanups[i]();
        if (this.scopes)
          for (i = 0, l = this.scopes.length; i < l; i++)
            this.scopes[i].stop(!0);
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          last && last !== this && (this.parent.scopes[this.index] = last, last.index = this.index);
        }
        this.parent = void 0, this._active = !1;
      }
    }
  };
  __name(_EffectScope, "EffectScope");
  let EffectScope = _EffectScope;
  function recordEffectScope(effect2, scope = activeEffectScope) {
    scope && scope.active && scope.effects.push(effect2);
  }
  __name(recordEffectScope, "recordEffectScope");
  function getCurrentScope() {
    return activeEffectScope;
  }
  __name(getCurrentScope, "getCurrentScope");
  function onScopeDispose(fn) {
    activeEffectScope && activeEffectScope.cleanups.push(fn);
  }
  __name(onScopeDispose, "onScopeDispose");
  let activeEffect;
  const _ReactiveEffect = class _ReactiveEffect {
    constructor(fn, trigger2, scheduler, scope) {
      this.fn = fn, this.trigger = trigger2, this.scheduler = scheduler, this.active = !0, this.deps = [], this._dirtyLevel = 4, this._trackId = 0, this._runnings = 0, this._shouldSchedule = !1, this._depsLength = 0, recordEffectScope(this, scope);
    }
    get dirty() {
      if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
        this._dirtyLevel = 1, pauseTracking();
        for (let i = 0; i < this._depsLength; i++) {
          const dep = this.deps[i];
          if (dep.computed && (triggerComputed(dep.computed), this._dirtyLevel >= 4))
            break;
        }
        this._dirtyLevel === 1 && (this._dirtyLevel = 0), resetTracking();
      }
      return this._dirtyLevel >= 4;
    }
    set dirty(v) {
      this._dirtyLevel = v ? 4 : 0;
    }
    run() {
      if (this._dirtyLevel = 0, !this.active)
        return this.fn();
      let lastShouldTrack = shouldTrack, lastEffect = activeEffect;
      try {
        return shouldTrack = !0, activeEffect = this, this._runnings++, preCleanupEffect(this), this.fn();
      } finally {
        postCleanupEffect(this), this._runnings--, activeEffect = lastEffect, shouldTrack = lastShouldTrack;
      }
    }
    stop() {
      this.active && (preCleanupEffect(this), postCleanupEffect(this), this.onStop && this.onStop(), this.active = !1);
    }
  };
  __name(_ReactiveEffect, "ReactiveEffect");
  let ReactiveEffect = _ReactiveEffect;
  function triggerComputed(computed2) {
    return computed2.value;
  }
  __name(triggerComputed, "triggerComputed");
  function preCleanupEffect(effect2) {
    effect2._trackId++, effect2._depsLength = 0;
  }
  __name(preCleanupEffect, "preCleanupEffect");
  function postCleanupEffect(effect2) {
    if (effect2.deps.length > effect2._depsLength) {
      for (let i = effect2._depsLength; i < effect2.deps.length; i++)
        cleanupDepEffect(effect2.deps[i], effect2);
      effect2.deps.length = effect2._depsLength;
    }
  }
  __name(postCleanupEffect, "postCleanupEffect");
  function cleanupDepEffect(dep, effect2) {
    const trackId = dep.get(effect2);
    trackId !== void 0 && effect2._trackId !== trackId && (dep.delete(effect2), dep.size === 0 && dep.cleanup());
  }
  __name(cleanupDepEffect, "cleanupDepEffect");
  let shouldTrack = !0, pauseScheduleStack = 0;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack), shouldTrack = !1;
  }
  __name(pauseTracking, "pauseTracking");
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? !0 : last;
  }
  __name(resetTracking, "resetTracking");
  function pauseScheduling() {
    pauseScheduleStack++;
  }
  __name(pauseScheduling, "pauseScheduling");
  function resetScheduling() {
    for (pauseScheduleStack--; !pauseScheduleStack && queueEffectSchedulers.length; )
      queueEffectSchedulers.shift()();
  }
  __name(resetScheduling, "resetScheduling");
  function trackEffect(effect2, dep, debuggerEventExtraInfo) {
    if (dep.get(effect2) !== effect2._trackId) {
      dep.set(effect2, effect2._trackId);
      const oldDep = effect2.deps[effect2._depsLength];
      oldDep !== dep ? (oldDep && cleanupDepEffect(oldDep, effect2), effect2.deps[effect2._depsLength++] = dep) : effect2._depsLength++;
    }
  }
  __name(trackEffect, "trackEffect");
  const queueEffectSchedulers = [];
  function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
    pauseScheduling();
    for (const effect2 of dep.keys()) {
      let tracking;
      effect2._dirtyLevel < dirtyLevel && (tracking ?? (tracking = dep.get(effect2) === effect2._trackId)) && (effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0), effect2._dirtyLevel = dirtyLevel), effect2._shouldSchedule && (tracking ?? (tracking = dep.get(effect2) === effect2._trackId)) && (effect2.trigger(), (!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2 && (effect2._shouldSchedule = !1, effect2.scheduler && queueEffectSchedulers.push(effect2.scheduler)));
    }
    resetScheduling();
  }
  __name(triggerEffects, "triggerEffects");
  const createDep = /* @__PURE__ */ __name((cleanup, computed2) => {
    const dep = /* @__PURE__ */ new Map();
    return dep.cleanup = cleanup, dep.computed = computed2, dep;
  }, "createDep"), targetMap = /* @__PURE__ */ new WeakMap(), ITERATE_KEY = Symbol(""), MAP_KEY_ITERATE_KEY = Symbol("");
  function track(target, type, key) {
    if (shouldTrack && activeEffect) {
      let depsMap = targetMap.get(target);
      depsMap || targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      let dep = depsMap.get(key);
      dep || depsMap.set(key, dep = createDep(() => depsMap.delete(key))), trackEffect(
        activeEffect,
        dep
      );
    }
  }
  __name(track, "track");
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
      return;
    let deps = [];
    if (type === "clear")
      deps = [...depsMap.values()];
    else if (key === "length" && isArray(target)) {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        (key2 === "length" || !isSymbol(key2) && key2 >= newLength) && deps.push(dep);
      });
    } else
      switch (key !== void 0 && deps.push(depsMap.get(key)), type) {
        case "add":
          isArray(target) ? isIntegerKey(key) && deps.push(depsMap.get("length")) : (deps.push(depsMap.get(ITERATE_KEY)), isMap(target) && deps.push(depsMap.get(MAP_KEY_ITERATE_KEY)));
          break;
        case "delete":
          isArray(target) || (deps.push(depsMap.get(ITERATE_KEY)), isMap(target) && deps.push(depsMap.get(MAP_KEY_ITERATE_KEY)));
          break;
        case "set":
          isMap(target) && deps.push(depsMap.get(ITERATE_KEY));
          break;
      }
    pauseScheduling();
    for (const dep of deps)
      dep && triggerEffects(
        dep,
        4
      );
    resetScheduling();
  }
  __name(trigger, "trigger");
  const isNonTrackableKeys = /* @__PURE__ */ makeMap("__proto__,__v_isRef,__isVue"), builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  ), arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    return ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++)
          track(arr, "get", i + "");
        const res = arr[key](...args);
        return res === -1 || res === !1 ? arr[key](...args.map(toRaw)) : res;
      };
    }), ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking(), pauseScheduling();
        const res = toRaw(this)[key].apply(this, args);
        return resetScheduling(), resetTracking(), res;
      };
    }), instrumentations;
  }
  __name(createArrayInstrumentations, "createArrayInstrumentations");
  function hasOwnProperty(key) {
    isSymbol(key) || (key = String(key));
    const obj = toRaw(this);
    return track(obj, "has", key), obj.hasOwnProperty(key);
  }
  __name(hasOwnProperty, "hasOwnProperty");
  const _BaseReactiveHandler = class _BaseReactiveHandler {
    constructor(_isReadonly = !1, _isShallow = !1) {
      this._isReadonly = _isReadonly, this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive")
        return !isReadonly2;
      if (key === "__v_isReadonly")
        return isReadonly2;
      if (key === "__v_isShallow")
        return isShallow2;
      if (key === "__v_raw")
        return receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver) ? target : void 0;
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        if (targetIsArray && hasOwn(arrayInstrumentations, key))
          return Reflect.get(arrayInstrumentations, key, receiver);
        if (key === "hasOwnProperty")
          return hasOwnProperty;
      }
      const res = Reflect.get(target, key, receiver);
      return (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) || (isReadonly2 || track(target, "get", key), isShallow2) ? res : isRef(res) ? targetIsArray && isIntegerKey(key) ? res : res.value : isObject$1(res) ? isReadonly2 ? readonly(res) : reactive(res) : res;
    }
  };
  __name(_BaseReactiveHandler, "BaseReactiveHandler");
  let BaseReactiveHandler = _BaseReactiveHandler;
  const _MutableReactiveHandler = class _MutableReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = !1) {
      super(!1, isShallow2);
    }
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (!this._isShallow) {
        const isOldValueReadonly = isReadonly(oldValue);
        if (!isShallow(value) && !isReadonly(value) && (oldValue = toRaw(oldValue), value = toRaw(value)), !isArray(target) && isRef(oldValue) && !isRef(value))
          return isOldValueReadonly ? !1 : (oldValue.value = value, !0);
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key), result = Reflect.set(target, key, value, receiver);
      return target === toRaw(receiver) && (hadKey ? hasChanged(value, oldValue) && trigger(target, "set", key, value) : trigger(target, "add", key, value)), result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      return result && hadKey && trigger(target, "delete", key, void 0), result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      return (!isSymbol(key) || !builtInSymbols.has(key)) && track(target, "has", key), result;
    }
    ownKeys(target) {
      return track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      ), Reflect.ownKeys(target);
    }
  };
  __name(_MutableReactiveHandler, "MutableReactiveHandler");
  let MutableReactiveHandler = _MutableReactiveHandler;
  const _ReadonlyReactiveHandler = class _ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = !1) {
      super(!0, isShallow2);
    }
    set(target, key) {
      return !0;
    }
    deleteProperty(target, key) {
      return !0;
    }
  };
  __name(_ReadonlyReactiveHandler, "ReadonlyReactiveHandler");
  let ReadonlyReactiveHandler = _ReadonlyReactiveHandler;
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler(), readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(), shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
    !0
  ), shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(!0), toShallow = /* @__PURE__ */ __name((value) => value, "toShallow"), getProto = /* @__PURE__ */ __name((v) => Reflect.getPrototypeOf(v), "getProto");
  function get(target, key, isReadonly2 = !1, isShallow2 = !1) {
    target = target.__v_raw;
    const rawTarget = toRaw(target), rawKey = toRaw(key);
    isReadonly2 || (hasChanged(key, rawKey) && track(rawTarget, "get", key), track(rawTarget, "get", rawKey));
    const { has: has2 } = getProto(rawTarget), wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    if (has2.call(rawTarget, key))
      return wrap(target.get(key));
    if (has2.call(rawTarget, rawKey))
      return wrap(target.get(rawKey));
    target !== rawTarget && target.get(key);
  }
  __name(get, "get");
  function has(key, isReadonly2 = !1) {
    const target = this.__v_raw, rawTarget = toRaw(target), rawKey = toRaw(key);
    return isReadonly2 || (hasChanged(key, rawKey) && track(rawTarget, "has", key), track(rawTarget, "has", rawKey)), key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  __name(has, "has");
  function size(target, isReadonly2 = !1) {
    return target = target.__v_raw, !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY), Reflect.get(target, "size", target);
  }
  __name(size, "size");
  function add(value, _isShallow = !1) {
    !_isShallow && !isShallow(value) && !isReadonly(value) && (value = toRaw(value));
    const target = toRaw(this);
    return getProto(target).has.call(target, value) || (target.add(value), trigger(target, "add", value, value)), this;
  }
  __name(add, "add");
  function set(key, value, _isShallow = !1) {
    !_isShallow && !isShallow(value) && !isReadonly(value) && (value = toRaw(value));
    const target = toRaw(this), { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    hadKey || (key = toRaw(key), hadKey = has2.call(target, key));
    const oldValue = get2.call(target, key);
    return target.set(key, value), hadKey ? hasChanged(value, oldValue) && trigger(target, "set", key, value) : trigger(target, "add", key, value), this;
  }
  __name(set, "set");
  function deleteEntry(key) {
    const target = toRaw(this), { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    hadKey || (key = toRaw(key), hadKey = has2.call(target, key)), get2 && get2.call(target, key);
    const result = target.delete(key);
    return hadKey && trigger(target, "delete", key, void 0), result;
  }
  __name(deleteEntry, "deleteEntry");
  function clear() {
    const target = toRaw(this), hadItems = target.size !== 0, result = target.clear();
    return hadItems && trigger(target, "clear", void 0, void 0), result;
  }
  __name(clear, "clear");
  function createForEach(isReadonly2, isShallow2) {
    return /* @__PURE__ */ __name(function(callback, thisArg) {
      const observed = this, target = observed.__v_raw, rawTarget = toRaw(target), wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      return !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY), target.forEach((value, key) => callback.call(thisArg, wrap(value), wrap(key), observed));
    }, "forEach");
  }
  __name(createForEach, "createForEach");
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this.__v_raw, rawTarget = toRaw(target), targetIsMap = isMap(rawTarget), isPair = method === "entries" || method === Symbol.iterator && targetIsMap, isKeyOnly = method === "keys" && targetIsMap, innerIterator = target[method](...args), wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      return !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      ), {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  __name(createIterableMethod, "createIterableMethod");
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? !1 : type === "clear" ? void 0 : this;
    };
  }
  __name(createReadonlyMethod, "createReadonlyMethod");
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get(this, key);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set,
      delete: deleteEntry,
      clear,
      forEach: createForEach(!1, !1)
    }, shallowInstrumentations2 = {
      get(key) {
        return get(this, key, !1, !0);
      },
      get size() {
        return size(this);
      },
      has,
      add(value) {
        return add.call(this, value, !0);
      },
      set(key, value) {
        return set.call(this, key, value, !0);
      },
      delete: deleteEntry,
      clear,
      forEach: createForEach(!1, !0)
    }, readonlyInstrumentations2 = {
      get(key) {
        return get(this, key, !0);
      },
      get size() {
        return size(this, !0);
      },
      has(key) {
        return has.call(this, key, !0);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(!0, !1)
    }, shallowReadonlyInstrumentations2 = {
      get(key) {
        return get(this, key, !0, !0);
      },
      get size() {
        return size(this, !0);
      },
      has(key) {
        return has.call(this, key, !0);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(!0, !0)
    };
    return [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ].forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(method, !1, !1), readonlyInstrumentations2[method] = createIterableMethod(method, !0, !1), shallowInstrumentations2[method] = createIterableMethod(method, !1, !0), shallowReadonlyInstrumentations2[method] = createIterableMethod(
        method,
        !0,
        !0
      );
    }), [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  __name(createInstrumentations, "createInstrumentations");
  const [
    mutableInstrumentations,
    readonlyInstrumentations,
    shallowInstrumentations,
    shallowReadonlyInstrumentations
  ] = /* @__PURE__ */ createInstrumentations();
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => key === "__v_isReactive" ? !isReadonly2 : key === "__v_isReadonly" ? isReadonly2 : key === "__v_raw" ? target : Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  }
  __name(createInstrumentationGetter, "createInstrumentationGetter");
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(!1, !1)
  }, shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(!1, !0)
  }, readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(!0, !1)
  }, shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(!0, !0)
  }, reactiveMap = /* @__PURE__ */ new WeakMap(), shallowReactiveMap = /* @__PURE__ */ new WeakMap(), readonlyMap = /* @__PURE__ */ new WeakMap(), shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  __name(targetTypeMap, "targetTypeMap");
  function getTargetType(value) {
    return value.__v_skip || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  __name(getTargetType, "getTargetType");
  function reactive(target) {
    return isReadonly(target) ? target : createReactiveObject(
      target,
      !1,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  __name(reactive, "reactive");
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      !1,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  __name(shallowReactive, "shallowReactive");
  function readonly(target) {
    return createReactiveObject(
      target,
      !0,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  __name(readonly, "readonly");
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      !0,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  __name(shallowReadonly, "shallowReadonly");
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject$1(target) || target.__v_raw && !(isReadonly2 && target.__v_isReactive))
      return target;
    const existingProxy = proxyMap.get(target);
    if (existingProxy)
      return existingProxy;
    const targetType = getTargetType(target);
    if (targetType === 0)
      return target;
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    return proxyMap.set(target, proxy), proxy;
  }
  __name(createReactiveObject, "createReactiveObject");
  function isReactive(value) {
    return isReadonly(value) ? isReactive(value.__v_raw) : !!(value && value.__v_isReactive);
  }
  __name(isReactive, "isReactive");
  function isReadonly(value) {
    return !!(value && value.__v_isReadonly);
  }
  __name(isReadonly, "isReadonly");
  function isShallow(value) {
    return !!(value && value.__v_isShallow);
  }
  __name(isShallow, "isShallow");
  function isProxy(value) {
    return value ? !!value.__v_raw : !1;
  }
  __name(isProxy, "isProxy");
  function toRaw(observed) {
    const raw = observed && observed.__v_raw;
    return raw ? toRaw(raw) : observed;
  }
  __name(toRaw, "toRaw");
  function markRaw(value) {
    return Object.isExtensible(value) && def(value, "__v_skip", !0), value;
  }
  __name(markRaw, "markRaw");
  const toReactive = /* @__PURE__ */ __name((value) => isObject$1(value) ? reactive(value) : value, "toReactive"), toReadonly = /* @__PURE__ */ __name((value) => isObject$1(value) ? readonly(value) : value, "toReadonly"), _ComputedRefImpl = class _ComputedRefImpl {
    constructor(getter, _setter, isReadonly2, isSSR) {
      this.getter = getter, this._setter = _setter, this.dep = void 0, this.__v_isRef = !0, this.__v_isReadonly = !1, this.effect = new ReactiveEffect(
        () => getter(this._value),
        () => triggerRefValue(
          this,
          this.effect._dirtyLevel === 2 ? 2 : 3
        )
      ), this.effect.computed = this, this.effect.active = this._cacheable = !isSSR, this.__v_isReadonly = isReadonly2;
    }
    get value() {
      const self2 = toRaw(this);
      return (!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run()) && triggerRefValue(self2, 4), trackRefValue(self2), self2.effect._dirtyLevel >= 2 && triggerRefValue(self2, 2), self2._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
    // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
    get _dirty() {
      return this.effect.dirty;
    }
    set _dirty(v) {
      this.effect.dirty = v;
    }
    // #endregion
  };
  __name(_ComputedRefImpl, "ComputedRefImpl");
  let ComputedRefImpl = _ComputedRefImpl;
  function computed$1(getterOrOptions, debugOptions, isSSR = !1) {
    let getter, setter;
    const onlyGetter = isFunction(getterOrOptions);
    return onlyGetter ? (getter = getterOrOptions, setter = NOOP) : (getter = getterOrOptions.get, setter = getterOrOptions.set), new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  }
  __name(computed$1, "computed$1");
  function trackRefValue(ref2) {
    var _a;
    shouldTrack && activeEffect && (ref2 = toRaw(ref2), trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      )
    ));
  }
  __name(trackRefValue, "trackRefValue");
  function triggerRefValue(ref2, dirtyLevel = 4, newVal, oldVal) {
    ref2 = toRaw(ref2);
    const dep = ref2.dep;
    dep && triggerEffects(
      dep,
      dirtyLevel
    );
  }
  __name(triggerRefValue, "triggerRefValue");
  function isRef(r) {
    return !!(r && r.__v_isRef === !0);
  }
  __name(isRef, "isRef");
  function ref(value) {
    return createRef(value, !1);
  }
  __name(ref, "ref");
  function createRef(rawValue, shallow) {
    return isRef(rawValue) ? rawValue : new RefImpl(rawValue, shallow);
  }
  __name(createRef, "createRef");
  const _RefImpl = class _RefImpl {
    constructor(value, __v_isShallow) {
      this.__v_isShallow = __v_isShallow, this.dep = void 0, this.__v_isRef = !0, this._rawValue = __v_isShallow ? value : toRaw(value), this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
      return trackRefValue(this), this._value;
    }
    set value(newVal) {
      const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
      newVal = useDirectValue ? newVal : toRaw(newVal), hasChanged(newVal, this._rawValue) && (this._rawValue, this._rawValue = newVal, this._value = useDirectValue ? newVal : toReactive(newVal), triggerRefValue(this, 4));
    }
  };
  __name(_RefImpl, "RefImpl");
  let RefImpl = _RefImpl;
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  __name(unref, "unref");
  const shallowUnwrapHandlers = {
    get: /* @__PURE__ */ __name((target, key, receiver) => unref(Reflect.get(target, key, receiver)), "get"),
    set: /* @__PURE__ */ __name((target, key, value, receiver) => {
      const oldValue = target[key];
      return isRef(oldValue) && !isRef(value) ? (oldValue.value = value, !0) : Reflect.set(target, key, value, receiver);
    }, "set")
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  __name(proxyRefs, "proxyRefs");
  /**
  * @vue/runtime-core v3.4.38
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const stack = [];
  let isWarning = !1;
  function warn$1(msg, ...args) {
    if (isWarning) return;
    isWarning = !0, pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null, appWarnHandler = instance && instance.appContext.config.warnHandler, trace = getComponentTrace();
    if (appWarnHandler)
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          // eslint-disable-next-line no-restricted-syntax
          msg + args.map((a) => {
            var _a, _b;
            return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
          }).join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join(`
`),
          trace
        ]
      );
    else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      trace.length && warnArgs.push(`
`, ...formatTrace(trace)), console.warn(...warnArgs);
    }
    resetTracking(), isWarning = !1;
  }
  __name(warn$1, "warn$1");
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode)
      return [];
    const normalizedStack = [];
    for (; currentVNode; ) {
      const last = normalizedStack[0];
      last && last.vnode === currentVNode ? last.recurseCount++ : normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  __name(getComponentTrace, "getComponentTrace");
  function formatTrace(trace) {
    const logs = [];
    return trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    }), logs;
  }
  __name(formatTrace, "formatTrace");
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : "", isRoot = vnode.component ? vnode.component.parent == null : !1, open = ` at <${formatComponentName(
      vnode.component,
      vnode.type,
      isRoot
    )}`, close = ">" + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  __name(formatTraceEntry, "formatTraceEntry");
  function formatProps(props) {
    const res = [], keys = Object.keys(props);
    return keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    }), keys.length > 3 && res.push(" ..."), res;
  }
  __name(formatProps, "formatProps");
  function formatProp(key, value, raw) {
    return isString(value) ? (value = JSON.stringify(value), raw ? value : [`${key}=${value}`]) : typeof value == "number" || typeof value == "boolean" || value == null ? raw ? value : [`${key}=${value}`] : isRef(value) ? (value = formatProp(key, toRaw(value.value), !0), raw ? value : [`${key}=Ref<`, value, ">"]) : isFunction(value) ? [`${key}=fn${value.name ? `<${value.name}>` : ""}`] : (value = toRaw(value), raw ? value : [`${key}=`, value]);
  }
  __name(formatProp, "formatProp");
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  __name(callWithErrorHandling, "callWithErrorHandling");
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      return res && isPromise(res) && res.catch((err) => {
        handleError(err, instance, type);
      }), res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++)
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      return values;
    }
  }
  __name(callWithAsyncErrorHandling, "callWithAsyncErrorHandling");
  function handleError(err, instance, type, throwInDev = !0) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy, errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
      for (; cur; ) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++)
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === !1)
              return;
        }
        cur = cur.parent;
      }
      const appErrorHandler = instance.appContext.config.errorHandler;
      if (appErrorHandler) {
        pauseTracking(), callWithErrorHandling(
          appErrorHandler,
          null,
          10,
          [err, exposedInstance, errorInfo]
        ), resetTracking();
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev);
  }
  __name(handleError, "handleError");
  function logError(err, type, contextVNode, throwInDev = !0) {
    console.error(err);
  }
  __name(logError, "logError");
  let isFlushing = !1, isFlushPending = !1;
  const queue = [];
  let flushIndex = 0;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null, postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  __name(nextTick, "nextTick");
  function findInsertionIndex(id) {
    let start = flushIndex + 1, end = queue.length;
    for (; start < end; ) {
      const middle = start + end >>> 1, middleJob = queue[middle], middleJobId = getId(middleJob);
      middleJobId < id || middleJobId === id && middleJob.pre ? start = middle + 1 : end = middle;
    }
    return start;
  }
  __name(findInsertionIndex, "findInsertionIndex");
  function queueJob(job) {
    (!queue.length || !queue.includes(
      job,
      isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
    )) && (job.id == null ? queue.push(job) : queue.splice(findInsertionIndex(job.id), 0, job), queueFlush());
  }
  __name(queueJob, "queueJob");
  function queueFlush() {
    !isFlushing && !isFlushPending && (isFlushPending = !0, currentFlushPromise = resolvedPromise.then(flushJobs));
  }
  __name(queueFlush, "queueFlush");
  function invalidateJob(job) {
    const i = queue.indexOf(job);
    i > flushIndex && queue.splice(i, 1);
  }
  __name(invalidateJob, "invalidateJob");
  function queuePostFlushCb(cb) {
    isArray(cb) ? pendingPostFlushCbs.push(...cb) : (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) && pendingPostFlushCbs.push(cb), queueFlush();
  }
  __name(queuePostFlushCb, "queuePostFlushCb");
  function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.pre) {
        if (instance && cb.id !== instance.uid)
          continue;
        queue.splice(i, 1), i--, cb();
      }
    }
  }
  __name(flushPreFlushCbs, "flushPreFlushCbs");
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      if (pendingPostFlushCbs.length = 0, activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      for (activePostFlushCbs = deduped, postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        cb.active !== !1 && cb();
      }
      activePostFlushCbs = null, postFlushIndex = 0;
    }
  }
  __name(flushPostFlushCbs, "flushPostFlushCbs");
  const getId = /* @__PURE__ */ __name((job) => job.id == null ? 1 / 0 : job.id, "getId"), comparator = /* @__PURE__ */ __name((a, b) => {
    const diff = getId(a) - getId(b);
    if (diff === 0) {
      if (a.pre && !b.pre) return -1;
      if (b.pre && !a.pre) return 1;
    }
    return diff;
  }, "comparator");
  function flushJobs(seen) {
    isFlushPending = !1, isFlushing = !0, queue.sort(comparator);
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        job && job.active !== !1 && callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
      }
    } finally {
      flushIndex = 0, queue.length = 0, flushPostFlushCbs(), isFlushing = !1, currentFlushPromise = null, (queue.length || pendingPostFlushCbs.length) && flushJobs();
    }
  }
  __name(flushJobs, "flushJobs");
  let currentRenderingInstance = null, currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    return currentRenderingInstance = instance, currentScopeId = instance && instance.type.__scopeId || null, prev;
  }
  __name(setCurrentRenderingInstance, "setCurrentRenderingInstance");
  function pushScopeId(id) {
    currentScopeId = id;
  }
  __name(pushScopeId, "pushScopeId");
  function popScopeId() {
    currentScopeId = null;
  }
  __name(popScopeId, "popScopeId");
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx || fn._n)
      return fn;
    const renderFnWithContext = /* @__PURE__ */ __name((...args) => {
      renderFnWithContext._d && setBlockTracking(-1);
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance), renderFnWithContext._d && setBlockTracking(1);
      }
      return res;
    }, "renderFnWithContext");
    return renderFnWithContext._n = !0, renderFnWithContext._c = !0, renderFnWithContext._d = !0, renderFnWithContext;
  }
  __name(withCtx, "withCtx");
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null)
      return vnode;
    const instance = getComponentPublicInstance(currentRenderingInstance), bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      dir && (isFunction(dir) && (dir = {
        mounted: dir,
        updated: dir
      }), dir.deep && traverse(value), bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      }));
    }
    return vnode;
  }
  __name(withDirectives, "withDirectives");
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs, oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      oldBindings && (binding.oldValue = oldBindings[i].value);
      let hook = binding.dir[name];
      hook && (pauseTracking(), callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]), resetTracking());
    }
  }
  __name(invokeDirectiveHook, "invokeDirectiveHook");
  function setTransitionHooks(vnode, hooks) {
    vnode.shapeFlag & 6 && vnode.component ? setTransitionHooks(vnode.component.subTree, hooks) : vnode.shapeFlag & 128 ? (vnode.ssContent.transition = hooks.clone(vnode.ssContent), vnode.ssFallback.transition = hooks.clone(vnode.ssFallback)) : vnode.transition = hooks;
  }
  __name(setTransitionHooks, "setTransitionHooks");
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (
      // #8326: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      extend({ name: options.name }, extraOptions, { setup: options })
    ) : options;
  }
  __name(defineComponent, "defineComponent");
  const isAsyncWrapper = /* @__PURE__ */ __name((i) => !!i.type.__asyncLoader, "isAsyncWrapper"), isKeepAlive = /* @__PURE__ */ __name((vnode) => vnode.type.__isKeepAlive, "isKeepAlive");
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  __name(onActivated, "onActivated");
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  __name(onDeactivated, "onDeactivated");
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      for (; current; ) {
        if (current.isDeactivated)
          return;
        current = current.parent;
      }
      return hook();
    });
    if (injectHook(type, wrappedHook, target), target) {
      let current = target.parent;
      for (; current && current.parent; )
        isKeepAlive(current.parent.vnode) && injectToKeepAliveRoot(wrappedHook, type, target, current), current = current.parent;
    }
  }
  __name(registerKeepAliveHook, "registerKeepAliveHook");
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      !0
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  __name(injectToKeepAliveRoot, "injectToKeepAliveRoot");
  function injectHook(type, hook, target = currentInstance, prepend = !1) {
    if (target) {
      const hooks = target[type] || (target[type] = []), wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        pauseTracking();
        const reset = setCurrentInstance(target), res = callWithAsyncErrorHandling(hook, target, type, args);
        return reset(), resetTracking(), res;
      });
      return prepend ? hooks.unshift(wrappedHook) : hooks.push(wrappedHook), wrappedHook;
    }
  }
  __name(injectHook, "injectHook");
  const createHook = /* @__PURE__ */ __name((lifecycle) => (hook, target = currentInstance) => {
    (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target);
  }, "createHook"), onBeforeMount = createHook("bm"), onMounted = createHook("m"), onBeforeUpdate = createHook("bu"), onUpdated = createHook("u"), onBeforeUnmount = createHook("bum"), onUnmounted = createHook("um"), onServerPrefetch = createHook("sp"), onRenderTriggered = createHook(
    "rtg"
  ), onRenderTracked = createHook(
    "rtc"
  );
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  __name(onErrorCaptured, "onErrorCaptured");
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc"), getPublicInstance = /* @__PURE__ */ __name((i) => i ? isStatefulComponent(i) ? getComponentPublicInstance(i) : getPublicInstance(i.parent) : null, "getPublicInstance"), publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: /* @__PURE__ */ __name((i) => i, "$"),
      $el: /* @__PURE__ */ __name((i) => i.vnode.el, "$el"),
      $data: /* @__PURE__ */ __name((i) => i.data, "$data"),
      $props: /* @__PURE__ */ __name((i) => i.props, "$props"),
      $attrs: /* @__PURE__ */ __name((i) => i.attrs, "$attrs"),
      $slots: /* @__PURE__ */ __name((i) => i.slots, "$slots"),
      $refs: /* @__PURE__ */ __name((i) => i.refs, "$refs"),
      $parent: /* @__PURE__ */ __name((i) => getPublicInstance(i.parent), "$parent"),
      $root: /* @__PURE__ */ __name((i) => getPublicInstance(i.root), "$root"),
      $emit: /* @__PURE__ */ __name((i) => i.emit, "$emit"),
      $options: /* @__PURE__ */ __name((i) => resolveMergedOptions(i), "$options"),
      $forceUpdate: /* @__PURE__ */ __name((i) => i.f || (i.f = () => {
        i.effect.dirty = !0, queueJob(i.update);
      }), "$forceUpdate"),
      $nextTick: /* @__PURE__ */ __name((i) => i.n || (i.n = nextTick.bind(i.proxy)), "$nextTick"),
      $watch: /* @__PURE__ */ __name((i) => instanceWatch.bind(i), "$watch")
    })
  ), hasSetupBinding = /* @__PURE__ */ __name((state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key), "hasSetupBinding"), PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip")
        return !0;
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0)
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        else {
          if (hasSetupBinding(setupState, key))
            return accessCache[key] = 1, setupState[key];
          if (data !== EMPTY_OBJ && hasOwn(data, key))
            return accessCache[key] = 2, data[key];
          if (
            // only cache other properties when instance has declared (thus stable)
            // props
            (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
          )
            return accessCache[key] = 3, props[key];
          if (ctx !== EMPTY_OBJ && hasOwn(ctx, key))
            return accessCache[key] = 4, ctx[key];
          shouldCacheAccess && (accessCache[key] = 0);
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter)
        return key === "$attrs" && track(instance.attrs, "get", ""), publicGetter(instance);
      if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      )
        return cssModule;
      if (ctx !== EMPTY_OBJ && hasOwn(ctx, key))
        return accessCache[key] = 4, ctx[key];
      if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      )
        return globalProperties[key];
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      return hasSetupBinding(setupState, key) ? (setupState[key] = value, !0) : data !== EMPTY_OBJ && hasOwn(data, key) ? (data[key] = value, !0) : hasOwn(instance.props, key) || key[0] === "$" && key.slice(1) in instance ? !1 : (ctx[key] = value, !0);
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, propsOptions }
    }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      return descriptor.get != null ? target._.accessCache[key] = 0 : hasOwn(descriptor, "value") && this.set(target, key, descriptor.value, null), Reflect.defineProperty(target, key, descriptor);
    }
  };
  function normalizePropsOrEmits(props) {
    return isArray(props) ? props.reduce(
      (normalized, p2) => (normalized[p2] = null, normalized),
      {}
    ) : props;
  }
  __name(normalizePropsOrEmits, "normalizePropsOrEmits");
  let shouldCacheAccess = !0;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance), publicThis = instance.proxy, ctx = instance.ctx;
    shouldCacheAccess = !1, options.beforeCreate && callHook(options.beforeCreate, instance, "bc");
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    if (injectOptions && resolveInjections(injectOptions, ctx, null), methods)
      for (const key in methods) {
        const methodHandler = methods[key];
        isFunction(methodHandler) && (ctx[key] = methodHandler.bind(publicThis));
      }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      isObject$1(data) && (instance.data = reactive(data));
    }
    if (shouldCacheAccess = !0, computedOptions)
      for (const key in computedOptions) {
        const opt = computedOptions[key], get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP, set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP, c = computed({
          get: get2,
          set: set2
        });
        Object.defineProperty(ctx, key, {
          enumerable: !0,
          configurable: !0,
          get: /* @__PURE__ */ __name(() => c.value, "get"),
          set: /* @__PURE__ */ __name((v) => c.value = v, "set")
        });
      }
    if (watchOptions)
      for (const key in watchOptions)
        createWatcher(watchOptions[key], ctx, publicThis, key);
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    created && callHook(created, instance, "c");
    function registerLifecycleHook(register, hook) {
      isArray(hook) ? hook.forEach((_hook) => register(_hook.bind(publicThis))) : hook && register(hook.bind(publicThis));
    }
    if (__name(registerLifecycleHook, "registerLifecycleHook"), registerLifecycleHook(onBeforeMount, beforeMount), registerLifecycleHook(onMounted, mounted), registerLifecycleHook(onBeforeUpdate, beforeUpdate), registerLifecycleHook(onUpdated, updated), registerLifecycleHook(onActivated, activated), registerLifecycleHook(onDeactivated, deactivated), registerLifecycleHook(onErrorCaptured, errorCaptured), registerLifecycleHook(onRenderTracked, renderTracked), registerLifecycleHook(onRenderTriggered, renderTriggered), registerLifecycleHook(onBeforeUnmount, beforeUnmount), registerLifecycleHook(onUnmounted, unmounted), registerLifecycleHook(onServerPrefetch, serverPrefetch), isArray(expose))
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: /* @__PURE__ */ __name(() => publicThis[key], "get"),
            set: /* @__PURE__ */ __name((val) => publicThis[key] = val, "set")
          });
        });
      } else instance.exposed || (instance.exposed = {});
    render && instance.render === NOOP && (instance.render = render), inheritAttrs != null && (instance.inheritAttrs = inheritAttrs), components && (instance.components = components), directives && (instance.directives = directives);
  }
  __name(applyOptions, "applyOptions");
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    isArray(injectOptions) && (injectOptions = normalizeInject(injectOptions));
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      isObject$1(opt) ? "default" in opt ? injected = inject(
        opt.from || key,
        opt.default,
        !0
      ) : injected = inject(opt.from || key) : injected = inject(opt), isRef(injected) ? Object.defineProperty(ctx, key, {
        enumerable: !0,
        configurable: !0,
        get: /* @__PURE__ */ __name(() => injected.value, "get"),
        set: /* @__PURE__ */ __name((v) => injected.value = v, "set")
      }) : ctx[key] = injected;
    }
  }
  __name(resolveInjections, "resolveInjections");
  function callHook(hook, instance, type) {
    callWithAsyncErrorHandling(
      isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type
    );
  }
  __name(callHook, "callHook");
  function createWatcher(raw, ctx, publicThis, key) {
    const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      isFunction(handler) && watch(getter, handler);
    } else if (isFunction(raw))
      watch(getter, raw.bind(publicThis));
    else if (isObject$1(raw))
      if (isArray(raw))
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        isFunction(handler) && watch(getter, handler, raw);
      }
  }
  __name(createWatcher, "createWatcher");
  function resolveMergedOptions(instance) {
    const base = instance.type, { mixins, extends: extendsOptions } = base, {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext, cached = cache.get(base);
    let resolved;
    return cached ? resolved = cached : !globalMixins.length && !mixins && !extendsOptions ? resolved = base : (resolved = {}, globalMixins.length && globalMixins.forEach(
      (m) => mergeOptions(resolved, m, optionMergeStrategies, !0)
    ), mergeOptions(resolved, base, optionMergeStrategies)), isObject$1(base) && cache.set(base, resolved), resolved;
  }
  __name(resolveMergedOptions, "resolveMergedOptions");
  function mergeOptions(to, from, strats, asMixin = !1) {
    const { mixins, extends: extendsOptions } = from;
    extendsOptions && mergeOptions(to, extendsOptions, strats, !0), mixins && mixins.forEach(
      (m) => mergeOptions(to, m, strats, !0)
    );
    for (const key in from)
      if (!(asMixin && key === "expose")) {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    return to;
  }
  __name(mergeOptions, "mergeOptions");
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    return from ? to ? /* @__PURE__ */ __name(function() {
      return extend(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    }, "mergedDataFn") : from : to;
  }
  __name(mergeDataFn, "mergeDataFn");
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  __name(mergeInject, "mergeInject");
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++)
        res[raw[i]] = raw[i];
      return res;
    }
    return raw;
  }
  __name(normalizeInject, "normalizeInject");
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  __name(mergeAsArray, "mergeAsArray");
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  __name(mergeObjectOptions, "mergeObjectOptions");
  function mergeEmitsOrPropsOptions(to, from) {
    return to ? isArray(to) && isArray(from) ? [.../* @__PURE__ */ new Set([...to, ...from])] : extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from ?? {})
    ) : from;
  }
  __name(mergeEmitsOrPropsOptions, "mergeEmitsOrPropsOptions");
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from)
      merged[key] = mergeAsArray(to[key], from[key]);
    return merged;
  }
  __name(mergeWatchOptions, "mergeWatchOptions");
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: !1,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  __name(createAppContext, "createAppContext");
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return /* @__PURE__ */ __name(function(rootComponent, rootProps = null) {
      isFunction(rootComponent) || (rootComponent = extend({}, rootComponent)), rootProps != null && !isObject$1(rootProps) && (rootProps = null);
      const context = createAppContext(), installedPlugins = /* @__PURE__ */ new WeakSet();
      let isMounted = !1;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          return installedPlugins.has(plugin) || (plugin && isFunction(plugin.install) ? (installedPlugins.add(plugin), plugin.install(app, ...options)) : isFunction(plugin) && (installedPlugins.add(plugin), plugin(app, ...options))), app;
        },
        mixin(mixin) {
          return context.mixins.includes(mixin) || context.mixins.push(mixin), app;
        },
        component(name, component) {
          return component ? (context.components[name] = component, app) : context.components[name];
        },
        directive(name, directive) {
          return directive ? (context.directives[name] = directive, app) : context.directives[name];
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const vnode = createVNode(rootComponent, rootProps);
            return vnode.appContext = context, namespace === !0 ? namespace = "svg" : namespace === !1 && (namespace = void 0), isHydrate && hydrate ? hydrate(vnode, rootContainer) : render(vnode, rootContainer, namespace), isMounted = !0, app._container = rootContainer, rootContainer.__vue_app__ = app, getComponentPublicInstance(vnode.component);
          }
        },
        unmount() {
          isMounted && (render(null, app._container), delete app._container.__vue_app__);
        },
        provide(key, value) {
          return context.provides[key] = value, app;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app;
    }, "createApp");
  }
  __name(createAppAPI, "createAppAPI");
  let currentApp = null;
  function provide(key, value) {
    if (currentInstance) {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      parentProvides === provides && (provides = currentInstance.provides = Object.create(parentProvides)), provides[key] = value;
    }
  }
  __name(provide, "provide");
  function inject(key, defaultValue, treatDefaultAsFactory = !1) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance || currentApp) {
      const provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides)
        return provides[key];
      if (arguments.length > 1)
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    }
  }
  __name(inject, "inject");
  const internalObjectProto = {}, createInternalObject = /* @__PURE__ */ __name(() => Object.create(internalObjectProto), "createInternalObject"), isInternalObject = /* @__PURE__ */ __name((obj) => Object.getPrototypeOf(obj) === internalObjectProto, "isInternalObject");
  function initProps(instance, rawProps, isStateful, isSSR = !1) {
    const props = {}, attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null), setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0])
      key in props || (props[key] = void 0);
    isStateful ? instance.props = isSSR ? props : shallowReactive(props) : instance.type.props ? instance.props = props : instance.props = attrs, instance.attrs = attrs;
  }
  __name(initProps, "initProps");
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance, rawCurrentProps = toRaw(props), [options] = instance.propsOptions;
    let hasAttrsChanged = !1;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key))
            continue;
          const value = rawProps[key];
          if (options)
            if (hasOwn(attrs, key))
              value !== attrs[key] && (attrs[key] = value, hasAttrsChanged = !0);
            else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                !1
              );
            }
          else
            value !== attrs[key] && (attrs[key] = value, hasAttrsChanged = !0);
        }
      }
    } else {
      setFullProps(instance, rawProps, props, attrs) && (hasAttrsChanged = !0);
      let kebabKey;
      for (const key in rawCurrentProps)
        (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) && (options ? rawPrevProps && // for camelCase
        (rawPrevProps[key] !== void 0 || // for kebab-case
        rawPrevProps[kebabKey] !== void 0) && (props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          void 0,
          instance,
          !0
        )) : delete props[key]);
      if (attrs !== rawCurrentProps)
        for (const key in attrs)
          (!rawProps || !hasOwn(rawProps, key)) && (delete attrs[key], hasAttrsChanged = !0);
    }
    hasAttrsChanged && trigger(instance.attrs, "set", "");
  }
  __name(updateProps, "updateProps");
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = !1, rawCastValues;
    if (rawProps)
      for (let key in rawProps) {
        if (isReservedProp(key))
          continue;
        const value = rawProps[key];
        let camelKey;
        options && hasOwn(options, camelKey = camelize(key)) ? !needCastKeys || !needCastKeys.includes(camelKey) ? props[camelKey] = value : (rawCastValues || (rawCastValues = {}))[camelKey] = value : isEmitListener(instance.emitsOptions, key) || (!(key in attrs) || value !== attrs[key]) && (attrs[key] = value, hasAttrsChanged = !0);
      }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props), castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  __name(setFullProps, "setFullProps");
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults)
            value = propsDefaults[key];
          else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            ), reset();
          }
        } else
          value = defaultValue;
      }
      opt[
        0
        /* shouldCast */
      ] && (isAbsent && !hasDefault ? value = !1 : opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key)) && (value = !0));
    }
    return value;
  }
  __name(resolvePropValue, "resolvePropValue");
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = !1) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache, cached = cache.get(comp);
    if (cached)
      return cached;
    const raw = comp.props, normalized = {}, needCastKeys = [];
    let hasExtends = !1;
    if (!isFunction(comp)) {
      const extendProps = /* @__PURE__ */ __name((raw2) => {
        hasExtends = !0;
        const [props, keys] = normalizePropsOptions(raw2, appContext, !0);
        extend(normalized, props), keys && needCastKeys.push(...keys);
      }, "extendProps");
      !asMixin && appContext.mixins.length && appContext.mixins.forEach(extendProps), comp.extends && extendProps(comp.extends), comp.mixins && comp.mixins.forEach(extendProps);
    }
    if (!raw && !hasExtends)
      return isObject$1(comp) && cache.set(comp, EMPTY_ARR), EMPTY_ARR;
    if (isArray(raw))
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        validatePropName(normalizedKey) && (normalized[normalizedKey] = EMPTY_OBJ);
      }
    else if (raw)
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key], prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt), propType = prop.type;
          let shouldCast = !1, shouldCastTrue = !0;
          if (isArray(propType))
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index], typeName = isFunction(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = !0;
                break;
              } else typeName === "String" && (shouldCastTrue = !1);
            }
          else
            shouldCast = isFunction(propType) && propType.name === "Boolean";
          prop[
            0
            /* shouldCast */
          ] = shouldCast, prop[
            1
            /* shouldCastTrue */
          ] = shouldCastTrue, (shouldCast || hasOwn(prop, "default")) && needCastKeys.push(normalizedKey);
        }
      }
    const res = [normalized, needCastKeys];
    return isObject$1(comp) && cache.set(comp, res), res;
  }
  __name(normalizePropsOptions, "normalizePropsOptions");
  function validatePropName(key) {
    return key[0] !== "$" && !isReservedProp(key);
  }
  __name(validatePropName, "validatePropName");
  const isInternalKey = /* @__PURE__ */ __name((key) => key[0] === "_" || key === "$stable", "isInternalKey"), normalizeSlotValue = /* @__PURE__ */ __name((value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)], "normalizeSlotValue"), normalizeSlot = /* @__PURE__ */ __name((key, rawSlot, ctx) => {
    if (rawSlot._n)
      return rawSlot;
    const normalized = withCtx((...args) => normalizeSlotValue(rawSlot(...args)), ctx);
    return normalized._c = !1, normalized;
  }, "normalizeSlot"), normalizeObjectSlots = /* @__PURE__ */ __name((rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (isFunction(value))
        slots[key] = normalizeSlot(key, value, ctx);
      else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  }, "normalizeObjectSlots"), normalizeVNodeSlots = /* @__PURE__ */ __name((instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  }, "normalizeVNodeSlots"), assignSlots = /* @__PURE__ */ __name((slots, children, optimized) => {
    for (const key in children)
      (optimized || key !== "_") && (slots[key] = children[key]);
  }, "assignSlots"), initSlots = /* @__PURE__ */ __name((instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      type ? (assignSlots(slots, children, optimized), optimized && def(slots, "_", type, !0)) : normalizeObjectSlots(children, slots);
    } else children && normalizeVNodeSlots(instance, children);
  }, "initSlots"), updateSlots = /* @__PURE__ */ __name((instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = !0, deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      type ? optimized && type === 1 ? needDeletionCheck = !1 : assignSlots(slots, children, optimized) : (needDeletionCheck = !children.$stable, normalizeObjectSlots(children, slots)), deletionComparisonTarget = children;
    } else children && (normalizeVNodeSlots(instance, children), deletionComparisonTarget = { default: 1 });
    if (needDeletionCheck)
      for (const key in slots)
        !isInternalKey(key) && deletionComparisonTarget[key] == null && delete slots[key];
  }, "updateSlots");
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = !1) {
    if (isArray(rawRef)) {
      rawRef.forEach(
        (r, i) => setRef(
          r,
          oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount)
      return;
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el, value = isUnmount ? null : refValue, { i: owner, r: ref3 } = rawRef, oldRef = oldRawRef && oldRawRef.r, refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs, setupState = owner.setupState;
    if (oldRef != null && oldRef !== ref3 && (isString(oldRef) ? (refs[oldRef] = null, hasOwn(setupState, oldRef) && (setupState[oldRef] = null)) : isRef(oldRef) && (oldRef.value = null)), isFunction(ref3))
      callWithErrorHandling(ref3, owner, 12, [value, refs]);
    else {
      const _isString = isString(ref3), _isRef = isRef(ref3);
      if (_isString || _isRef) {
        const doSet = /* @__PURE__ */ __name(() => {
          if (rawRef.f) {
            const existing = _isString ? hasOwn(setupState, ref3) ? setupState[ref3] : refs[ref3] : ref3.value;
            isUnmount ? isArray(existing) && remove(existing, refValue) : isArray(existing) ? existing.includes(refValue) || existing.push(refValue) : _isString ? (refs[ref3] = [refValue], hasOwn(setupState, ref3) && (setupState[ref3] = refs[ref3])) : (ref3.value = [refValue], rawRef.k && (refs[rawRef.k] = ref3.value));
          } else _isString ? (refs[ref3] = value, hasOwn(setupState, ref3) && (setupState[ref3] = value)) : _isRef && (ref3.value = value, rawRef.k && (refs[rawRef.k] = value));
        }, "doSet");
        value ? (doSet.id = -1, queuePostRenderEffect(doSet, parentSuspense)) : doSet();
      }
    }
  }
  __name(setRef, "setRef");
  const TeleportEndKey = Symbol("_vte"), isTeleport = /* @__PURE__ */ __name((type) => type.__isTeleport, "isTeleport"), queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  __name(createRenderer, "createRenderer");
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = !0;
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options, patch = /* @__PURE__ */ __name((n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2)
        return;
      n1 && !isSameVNodeType(n1, n2) && (anchor = getNextHostNode(n1), unmount(n1, parentComponent, parentSuspense, !0), n1 = null), n2.patchFlag === -2 && (optimized = !1, n2.dynamicChildren = null);
      const { type, ref: ref3, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          n1 == null && mountStaticNode(n2, container, anchor, namespace);
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          shapeFlag & 1 ? processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          ) : shapeFlag & 6 ? processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          ) : (shapeFlag & 64 || shapeFlag & 128) && type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
      }
      ref3 != null && parentComponent && setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }, "patch"), processText = /* @__PURE__ */ __name((n1, n2, container, anchor) => {
      if (n1 == null)
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      else {
        const el = n2.el = n1.el;
        n2.children !== n1.children && hostSetText(el, n2.children);
      }
    }, "processText"), processCommentNode = /* @__PURE__ */ __name((n1, n2, container, anchor) => {
      n1 == null ? hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      ) : n2.el = n1.el;
    }, "processCommentNode"), mountStaticNode = /* @__PURE__ */ __name((n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
    }, "mountStaticNode"), moveStaticNode = /* @__PURE__ */ __name(({ el, anchor }, container, nextSibling) => {
      let next;
      for (; el && el !== anchor; )
        next = hostNextSibling(el), hostInsert(el, container, nextSibling), el = next;
      hostInsert(anchor, container, nextSibling);
    }, "moveStaticNode"), removeStaticNode = /* @__PURE__ */ __name(({ el, anchor }) => {
      let next;
      for (; el && el !== anchor; )
        next = hostNextSibling(el), hostRemove(el), el = next;
      hostRemove(anchor);
    }, "removeStaticNode"), processElement = /* @__PURE__ */ __name((n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.type === "svg" ? namespace = "svg" : n2.type === "math" && (namespace = "mathml"), n1 == null ? mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      ) : patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }, "processElement"), mountElement = /* @__PURE__ */ __name((vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el, vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      if (el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      ), shapeFlag & 8 ? hostSetElementText(el, vnode.children) : shapeFlag & 16 && mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      ), dirs && invokeDirectiveHook(vnode, null, parentComponent, "created"), setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent), props) {
        for (const key in props)
          key !== "value" && !isReservedProp(key) && hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        "value" in props && hostPatchProp(el, "value", null, props.value, namespace), (vnodeHook = props.onVnodeBeforeMount) && invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      dirs && invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      needCallTransitionHooks && transition.beforeEnter(el), hostInsert(el, container, anchor), ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) && queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode), needCallTransitionHooks && transition.enter(el), dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }, "mountElement"), setScopeId = /* @__PURE__ */ __name((el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId && hostSetScopeId(el, scopeId), slotScopeIds)
        for (let i = 0; i < slotScopeIds.length; i++)
          hostSetScopeId(el, slotScopeIds[i]);
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    }, "setScopeId"), mountChildren = /* @__PURE__ */ __name((children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }, "mountChildren"), patchElement = /* @__PURE__ */ __name((n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ, newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      if (parentComponent && toggleRecurse(parentComponent, !1), (vnodeHook = newProps.onVnodeBeforeUpdate) && invokeVNodeHook(vnodeHook, parentComponent, n2, n1), dirs && invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate"), parentComponent && toggleRecurse(parentComponent, !0), (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) && hostSetElementText(el, ""), dynamicChildren ? patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      ) : optimized || patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        !1
      ), patchFlag > 0) {
        if (patchFlag & 16)
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        else if (patchFlag & 2 && oldProps.class !== newProps.class && hostPatchProp(el, "class", null, newProps.class, namespace), patchFlag & 4 && hostPatchProp(el, "style", oldProps.style, newProps.style, namespace), patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i], prev = oldProps[key], next = newProps[key];
            (next !== prev || key === "value") && hostPatchProp(el, key, prev, next, namespace, parentComponent);
          }
        }
        patchFlag & 1 && n1.children !== n2.children && hostSetElementText(el, n2.children);
      } else !optimized && dynamicChildren == null && patchProps(el, oldProps, newProps, parentComponent, namespace);
      ((vnodeHook = newProps.onVnodeUpdated) || dirs) && queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1), dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }, "patchElement"), patchBlockChildren = /* @__PURE__ */ __name((oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i], newVNode = newChildren[i], container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & 70) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          !0
        );
      }
    }, "patchBlockChildren"), patchProps = /* @__PURE__ */ __name((el, oldProps, newProps, parentComponent, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ)
          for (const key in oldProps)
            !isReservedProp(key) && !(key in newProps) && hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
        for (const key in newProps) {
          if (isReservedProp(key)) continue;
          const next = newProps[key], prev = oldProps[key];
          next !== prev && key !== "value" && hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
        "value" in newProps && hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }, "patchProps"), processFragment = /* @__PURE__ */ __name((n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText(""), fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      fragmentSlotScopeIds && (slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds), n1 == null ? (hostInsert(fragmentStartAnchor, container, anchor), hostInsert(fragmentEndAnchor, container, anchor), mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      )) : patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren ? (patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        container,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds
      ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
      //  get moved around. Make sure all root level vnodes inherit el.
      // #2134 or if it's a component root, it may also get moved around
      // as the component is being moved.
      (n2.key != null || parentComponent && n2 === parentComponent.subTree) && traverseStaticChildren(
        n1,
        n2,
        !0
        /* shallow */
      )) : patchChildren(
        n1,
        n2,
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }, "processFragment"), processComponent = /* @__PURE__ */ __name((n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds, n1 == null ? n2.shapeFlag & 512 ? parentComponent.ctx.activate(
        n2,
        container,
        anchor,
        namespace,
        optimized
      ) : mountComponent(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        optimized
      ) : updateComponent(n1, n2, optimized);
    }, "processComponent"), mountComponent = /* @__PURE__ */ __name((initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (isKeepAlive(initialVNode) && (instance.ctx.renderer = internals), setupComponent(instance, !1, optimized), instance.asyncDep) {
        if (parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized), !initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }
      } else
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
    }, "mountComponent"), updateComponent = /* @__PURE__ */ __name((n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized))
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else
          instance.next = n2, invalidateJob(instance.update), instance.effect.dirty = !0, instance.update();
      else
        n2.el = n1.el, instance.vnode = n2;
    }, "updateComponent"), setupRenderEffect = /* @__PURE__ */ __name((instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
      const componentUpdateFn = /* @__PURE__ */ __name(() => {
        if (instance.isMounted) {
          let { next, bu, u, parent, vnode } = instance;
          {
            const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
            if (nonHydratedAsyncRoot) {
              next && (next.el = vnode.el, updateComponentPreRender(instance, next, optimized)), nonHydratedAsyncRoot.asyncDep.then(() => {
                instance.isUnmounted || componentUpdateFn();
              });
              return;
            }
          }
          let originNext = next, vnodeHook;
          toggleRecurse(instance, !1), next ? (next.el = vnode.el, updateComponentPreRender(instance, next, optimized)) : next = vnode, bu && invokeArrayFns(bu), (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) && invokeVNodeHook(vnodeHook, parent, next, vnode), toggleRecurse(instance, !0);
          const nextTree = renderComponentRoot(instance), prevTree = instance.subTree;
          instance.subTree = nextTree, patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          ), next.el = nextTree.el, originNext === null && updateHOCHostEl(instance, nextTree.el), u && queuePostRenderEffect(u, parentSuspense), (vnodeHook = next.props && next.props.onVnodeUpdated) && queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        } else {
          let vnodeHook;
          const { el, props } = initialVNode, { bm, m, parent } = instance, isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          if (toggleRecurse(instance, !1), bm && invokeArrayFns(bm), !isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount) && invokeVNodeHook(vnodeHook, parent, initialVNode), toggleRecurse(instance, !0), el && hydrateNode) {
            const hydrateSubTree = /* @__PURE__ */ __name(() => {
              instance.subTree = renderComponentRoot(instance), hydrateNode(
                el,
                instance.subTree,
                instance,
                parentSuspense,
                null
              );
            }, "hydrateSubTree");
            isAsyncWrapperVNode ? initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            ) : hydrateSubTree();
          } else {
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            ), initialVNode.el = subTree.el;
          }
          if (m && queuePostRenderEffect(m, parentSuspense), !isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) && instance.a && queuePostRenderEffect(instance.a, parentSuspense), instance.isMounted = !0, initialVNode = container = anchor = null;
        }
      }, "componentUpdateFn"), effect2 = instance.effect = new ReactiveEffect(
        componentUpdateFn,
        NOOP,
        () => queueJob(update),
        instance.scope
        // track it in component's effect scope
      ), update = instance.update = () => {
        effect2.dirty && effect2.run();
      };
      update.i = instance, update.id = instance.uid, toggleRecurse(instance, !0), update();
    }, "setupRenderEffect"), updateComponentPreRender = /* @__PURE__ */ __name((instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode, instance.next = null, updateProps(instance, nextVNode.props, prevProps, optimized), updateSlots(instance, nextVNode.children, optimized), pauseTracking(), flushPreFlushCbs(instance), resetTracking();
    }, "updateComponentPreRender"), patchChildren = /* @__PURE__ */ __name((n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = !1) => {
      const c1 = n1 && n1.children, prevShapeFlag = n1 ? n1.shapeFlag : 0, c2 = n2.children, { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      shapeFlag & 8 ? (prevShapeFlag & 16 && unmountChildren(c1, parentComponent, parentSuspense), c2 !== c1 && hostSetElementText(container, c2)) : prevShapeFlag & 16 ? shapeFlag & 16 ? patchKeyedChildren(
        c1,
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      ) : unmountChildren(c1, parentComponent, parentSuspense, !0) : (prevShapeFlag & 8 && hostSetElementText(container, ""), shapeFlag & 16 && mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      ));
    }, "patchChildren"), patchUnkeyedChildren = /* @__PURE__ */ __name((c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR, c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length, newLength = c2.length, commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      oldLength > newLength ? unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        !0,
        !1,
        commonLength
      ) : mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }, "patchUnkeyedChildren"), patchKeyedChildren = /* @__PURE__ */ __name((c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1, e2 = l2 - 1;
      for (; i <= e1 && i <= e2; ) {
        const n1 = c1[i], n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2))
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        else
          break;
        i++;
      }
      for (; i <= e1 && i <= e2; ) {
        const n1 = c1[e1], n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2))
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        else
          break;
        e1--, e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1, anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          for (; i <= e2; )
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            ), i++;
        }
      } else if (i > e2)
        for (; i <= e1; )
          unmount(c1[i], parentComponent, parentSuspense, !0), i++;
      else {
        const s1 = i, s2 = i, keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          nextChild.key != null && keyToNewIndexMap.set(nextChild.key, i);
        }
        let j, patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = !1, maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, !0);
            continue;
          }
          let newIndex;
          if (prevChild.key != null)
            newIndex = keyToNewIndexMap.get(prevChild.key);
          else
            for (j = s2; j <= e2; j++)
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
          newIndex === void 0 ? unmount(prevChild, parentComponent, parentSuspense, !0) : (newIndexToOldIndexMap[newIndex - s2] = i + 1, newIndex >= maxNewIndexSoFar ? maxNewIndexSoFar = newIndex : moved = !0, patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          ), patched++);
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        for (j = increasingNewIndexSequence.length - 1, i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i, nextChild = c2[nextIndex], anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          newIndexToOldIndexMap[i] === 0 ? patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          ) : moved && (j < 0 || i !== increasingNewIndexSequence[j] ? move(nextChild, container, anchor, 2) : j--);
        }
      }
    }, "patchKeyedChildren"), move = /* @__PURE__ */ __name((vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++)
          move(children[i], container, anchor, moveType);
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      if (moveType !== 2 && shapeFlag & 1 && transition)
        if (moveType === 0)
          transition.beforeEnter(el), hostInsert(el, container, anchor), queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        else {
          const { leave, delayLeave, afterLeave } = transition, remove22 = /* @__PURE__ */ __name(() => hostInsert(el, container, anchor), "remove22"), performLeave = /* @__PURE__ */ __name(() => {
            leave(el, () => {
              remove22(), afterLeave && afterLeave();
            });
          }, "performLeave");
          delayLeave ? delayLeave(el, remove22, performLeave) : performLeave();
        }
      else
        hostInsert(el, container, anchor);
    }, "move"), unmount = /* @__PURE__ */ __name((vnode, parentComponent, parentSuspense, doRemove = !1, optimized = !1) => {
      const {
        type,
        props,
        ref: ref3,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2 && (optimized = !1), ref3 != null && setRef(ref3, null, parentSuspense, vnode, !0), cacheIndex != null && (parentComponent.renderCache[cacheIndex] = void 0), shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs, shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount) && invokeVNodeHook(vnodeHook, parentComponent, vnode), shapeFlag & 6)
        unmountComponent(vnode.component, parentSuspense, doRemove);
      else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount"), shapeFlag & 64 ? vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        ) : dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64) ? unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          !1,
          !0
        ) : (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) && unmountChildren(children, parentComponent, parentSuspense), doRemove && remove2(vnode);
      }
      (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) && queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode), shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }, "unmount"), remove2 = /* @__PURE__ */ __name((vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        removeFragment(el, anchor);
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = /* @__PURE__ */ __name(() => {
        hostRemove(el), transition && !transition.persisted && transition.afterLeave && transition.afterLeave();
      }, "performRemove");
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition, performLeave = /* @__PURE__ */ __name(() => leave(el, performRemove), "performLeave");
        delayLeave ? delayLeave(vnode.el, performRemove, performLeave) : performLeave();
      } else
        performRemove();
    }, "remove2"), removeFragment = /* @__PURE__ */ __name((cur, end) => {
      let next;
      for (; cur !== end; )
        next = hostNextSibling(cur), hostRemove(cur), cur = next;
      hostRemove(end);
    }, "removeFragment"), unmountComponent = /* @__PURE__ */ __name((instance, parentSuspense, doRemove) => {
      const { bum, scope, update, subTree, um, m, a } = instance;
      invalidateMount(m), invalidateMount(a), bum && invokeArrayFns(bum), scope.stop(), update && (update.active = !1, unmount(subTree, instance, parentSuspense, doRemove)), um && queuePostRenderEffect(um, parentSuspense), queuePostRenderEffect(() => {
        instance.isUnmounted = !0;
      }, parentSuspense), parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId && (parentSuspense.deps--, parentSuspense.deps === 0 && parentSuspense.resolve());
    }, "unmountComponent"), unmountChildren = /* @__PURE__ */ __name((children, parentComponent, parentSuspense, doRemove = !1, optimized = !1, start = 0) => {
      for (let i = start; i < children.length; i++)
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }, "unmountChildren"), getNextHostNode = /* @__PURE__ */ __name((vnode) => {
      if (vnode.shapeFlag & 6)
        return getNextHostNode(vnode.component.subTree);
      if (vnode.shapeFlag & 128)
        return vnode.suspense.next();
      const el = hostNextSibling(vnode.anchor || vnode.el), teleportEnd = el && el[TeleportEndKey];
      return teleportEnd ? hostNextSibling(teleportEnd) : el;
    }, "getNextHostNode");
    let isFlushing2 = !1;
    const render = /* @__PURE__ */ __name((vnode, container, namespace) => {
      vnode == null ? container._vnode && unmount(container._vnode, null, null, !0) : patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      ), container._vnode = vnode, isFlushing2 || (isFlushing2 = !0, flushPreFlushCbs(), flushPostFlushCbs(), isFlushing2 = !1);
    }, "render"), internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate, hydrateNode;
    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }
  __name(baseCreateRenderer, "baseCreateRenderer");
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  __name(resolveChildrenNamespace, "resolveChildrenNamespace");
  function toggleRecurse({ effect: effect2, update }, allowed) {
    effect2.allowRecurse = update.allowRecurse = allowed;
  }
  __name(toggleRecurse, "toggleRecurse");
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  __name(needTransition, "needTransition");
  function traverseStaticChildren(n1, n2, shallow = !1) {
    const ch1 = n1.children, ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2))
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        c2.shapeFlag & 1 && !c2.dynamicChildren && ((c2.patchFlag <= 0 || c2.patchFlag === 32) && (c2 = ch2[i] = cloneIfMounted(ch2[i]), c2.el = c1.el), !shallow && c2.patchFlag !== -2 && traverseStaticChildren(c1, c2)), c2.type === Text && (c2.el = c1.el);
      }
  }
  __name(traverseStaticChildren, "traverseStaticChildren");
  function getSequence(arr) {
    const p2 = arr.slice(), result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        if (j = result[result.length - 1], arr[j] < arrI) {
          p2[i] = j, result.push(i);
          continue;
        }
        for (u = 0, v = result.length - 1; u < v; )
          c = u + v >> 1, arr[result[c]] < arrI ? u = c + 1 : v = c;
        arrI < arr[result[u]] && (u > 0 && (p2[i] = result[u - 1]), result[u] = i);
      }
    }
    for (u = result.length, v = result[u - 1]; u-- > 0; )
      result[u] = v, v = p2[v];
    return result;
  }
  __name(getSequence, "getSequence");
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent)
      return subComponent.asyncDep && !subComponent.asyncResolved ? subComponent : locateNonHydratedAsyncRoot(subComponent);
  }
  __name(locateNonHydratedAsyncRoot, "locateNonHydratedAsyncRoot");
  function invalidateMount(hooks) {
    if (hooks)
      for (let i = 0; i < hooks.length; i++) hooks[i].active = !1;
  }
  __name(invalidateMount, "invalidateMount");
  const ssrContextKey = Symbol.for("v-scx"), useSSRContext = /* @__PURE__ */ __name(() => inject(ssrContextKey), "useSSRContext"), INITIAL_WATCHER_VALUE = {};
  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }
  __name(watch, "watch");
  function doWatch(source, cb, {
    immediate,
    deep,
    flush,
    once,
    onTrack,
    onTrigger
  } = EMPTY_OBJ) {
    if (cb && once) {
      const _cb = cb;
      cb = /* @__PURE__ */ __name((...args) => {
        _cb(...args), unwatch();
      }, "cb");
    }
    const instance = currentInstance, reactiveGetter = /* @__PURE__ */ __name((source2) => deep === !0 ? source2 : (
      // for deep: false, only traverse root-level properties
      traverse(source2, deep === !1 ? 1 : void 0)
    ), "reactiveGetter");
    let getter, forceTrigger = !1, isMultiSource = !1;
    if (isRef(source) ? (getter = /* @__PURE__ */ __name(() => source.value, "getter"), forceTrigger = isShallow(source)) : isReactive(source) ? (getter = /* @__PURE__ */ __name(() => reactiveGetter(source), "getter"), forceTrigger = !0) : isArray(source) ? (isMultiSource = !0, forceTrigger = source.some((s) => isReactive(s) || isShallow(s)), getter = /* @__PURE__ */ __name(() => source.map((s) => {
      if (isRef(s))
        return s.value;
      if (isReactive(s))
        return reactiveGetter(s);
      if (isFunction(s))
        return callWithErrorHandling(s, instance, 2);
    }), "getter")) : isFunction(source) ? cb ? getter = /* @__PURE__ */ __name(() => callWithErrorHandling(source, instance, 2), "getter") : getter = /* @__PURE__ */ __name(() => (cleanup && cleanup(), callWithAsyncErrorHandling(
      source,
      instance,
      3,
      [onCleanup]
    )), "getter") : getter = NOOP, cb && deep) {
      const baseGetter = getter;
      getter = /* @__PURE__ */ __name(() => traverse(baseGetter()), "getter");
    }
    let cleanup, onCleanup = /* @__PURE__ */ __name((fn) => {
      cleanup = effect2.onStop = () => {
        callWithErrorHandling(fn, instance, 4), cleanup = effect2.onStop = void 0;
      };
    }, "onCleanup"), ssrCleanup;
    if (isInSSRComponentSetup)
      if (onCleanup = NOOP, cb ? immediate && callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]) : getter(), flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else
        return NOOP;
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = /* @__PURE__ */ __name(() => {
      if (!(!effect2.active || !effect2.dirty))
        if (cb) {
          const newValue = effect2.run();
          (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) && (cleanup && cleanup(), callWithAsyncErrorHandling(cb, instance, 3, [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            onCleanup
          ]), oldValue = newValue);
        } else
          effect2.run();
    }, "job");
    job.allowRecurse = !!cb;
    let scheduler;
    flush === "sync" ? scheduler = job : flush === "post" ? scheduler = /* @__PURE__ */ __name(() => queuePostRenderEffect(job, instance && instance.suspense), "scheduler") : (job.pre = !0, instance && (job.id = instance.uid), scheduler = /* @__PURE__ */ __name(() => queueJob(job), "scheduler"));
    const effect2 = new ReactiveEffect(getter, NOOP, scheduler), scope = getCurrentScope(), unwatch = /* @__PURE__ */ __name(() => {
      effect2.stop(), scope && remove(scope.effects, effect2);
    }, "unwatch");
    return cb ? immediate ? job() : oldValue = effect2.run() : flush === "post" ? queuePostRenderEffect(
      effect2.run.bind(effect2),
      instance && instance.suspense
    ) : effect2.run(), ssrCleanup && ssrCleanup.push(unwatch), unwatch;
  }
  __name(doWatch, "doWatch");
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy, getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    isFunction(value) ? cb = value : (cb = value.handler, options = value);
    const reset = setCurrentInstance(this), res = doWatch(getter, cb.bind(publicThis), options);
    return reset(), res;
  }
  __name(instanceWatch, "instanceWatch");
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i = 0; i < segments.length && cur; i++)
        cur = cur[segments[i]];
      return cur;
    };
  }
  __name(createPathGetter, "createPathGetter");
  function traverse(value, depth = 1 / 0, seen) {
    if (depth <= 0 || !isObject$1(value) || value.__v_skip || (seen = seen || /* @__PURE__ */ new Set(), seen.has(value)))
      return value;
    if (seen.add(value), depth--, isRef(value))
      traverse(value.value, depth, seen);
    else if (isArray(value))
      for (let i = 0; i < value.length; i++)
        traverse(value[i], depth, seen);
    else if (isSet(value) || isMap(value))
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    else if (isPlainObject(value)) {
      for (const key in value)
        traverse(value[key], depth, seen);
      for (const key of Object.getOwnPropertySymbols(value))
        Object.prototype.propertyIsEnumerable.call(value, key) && traverse(value[key], depth, seen);
    }
    return value;
  }
  __name(traverse, "traverse");
  const getModelModifiers = /* @__PURE__ */ __name((props, modelName) => modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`], "getModelModifiers");
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props = instance.vnode.props || EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:"), modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
    modifiers && (modifiers.trim && (args = rawArgs.map((a) => isString(a) ? a.trim() : a)), modifiers.number && (args = rawArgs.map(looseToNumber)));
    let handlerName, handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    !handler && isModelListener2 && (handler = props[handlerName = toHandlerKey(hyphenate(event))]), handler && callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
    const onceHandler = props[handlerName + "Once"];
    if (onceHandler) {
      if (!instance.emitted)
        instance.emitted = {};
      else if (instance.emitted[handlerName])
        return;
      instance.emitted[handlerName] = !0, callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  __name(emit, "emit");
  function normalizeEmitsOptions(comp, appContext, asMixin = !1) {
    const cache = appContext.emitsCache, cached = cache.get(comp);
    if (cached !== void 0)
      return cached;
    const raw = comp.emits;
    let normalized = {}, hasExtends = !1;
    if (!isFunction(comp)) {
      const extendEmits = /* @__PURE__ */ __name((raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, !0);
        normalizedFromExtend && (hasExtends = !0, extend(normalized, normalizedFromExtend));
      }, "extendEmits");
      !asMixin && appContext.mixins.length && appContext.mixins.forEach(extendEmits), comp.extends && extendEmits(comp.extends), comp.mixins && comp.mixins.forEach(extendEmits);
    }
    return !raw && !hasExtends ? (isObject$1(comp) && cache.set(comp, null), null) : (isArray(raw) ? raw.forEach((key) => normalized[key] = null) : extend(normalized, raw), isObject$1(comp) && cache.set(comp, normalized), normalized);
  }
  __name(normalizeEmitsOptions, "normalizeEmitsOptions");
  function isEmitListener(options, key) {
    return !options || !isOn(key) ? !1 : (key = key.slice(2).replace(/Once$/, ""), hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key));
  }
  __name(isEmitListener, "isEmitListener");
  function markAttrsAccessed() {
  }
  __name(markAttrsAccessed, "markAttrsAccessed");
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render,
      renderCache,
      props,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance, prev = setCurrentRenderingInstance(instance);
    let result, fallthroughAttrs;
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy, thisProxy = proxyToUse;
        result = normalizeVNode(
          render.call(
            thisProxy,
            proxyToUse,
            renderCache,
            props,
            setupState,
            data,
            ctx
          )
        ), fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        result = normalizeVNode(
          render2.length > 1 ? render2(
            props,
            { attrs, slots, emit: emit2 }
          ) : render2(
            props,
            null
          )
        ), fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0, handleError(err, instance, 1), result = createVNode(Comment);
    }
    let root = result;
    if (fallthroughAttrs && inheritAttrs !== !1) {
      const keys = Object.keys(fallthroughAttrs), { shapeFlag } = root;
      keys.length && shapeFlag & 7 && (propsOptions && keys.some(isModelListener) && (fallthroughAttrs = filterModelListeners(
        fallthroughAttrs,
        propsOptions
      )), root = cloneVNode(root, fallthroughAttrs, !1, !0));
    }
    return vnode.dirs && (root = cloneVNode(root, null, !1, !0), root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs), vnode.transition && (root.transition = vnode.transition), result = root, setCurrentRenderingInstance(prev), result;
  }
  __name(renderComponentRoot, "renderComponentRoot");
  const getFunctionalFallthrough = /* @__PURE__ */ __name((attrs) => {
    let res;
    for (const key in attrs)
      (key === "class" || key === "style" || isOn(key)) && ((res || (res = {}))[key] = attrs[key]);
    return res;
  }, "getFunctionalFallthrough"), filterModelListeners = /* @__PURE__ */ __name((attrs, props) => {
    const res = {};
    for (const key in attrs)
      (!isModelListener(key) || !(key.slice(9) in props)) && (res[key] = attrs[key]);
    return res;
  }, "filterModelListeners");
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode, { props: nextProps, children: nextChildren, patchFlag } = nextVNode, emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition)
      return !0;
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024)
        return !0;
      if (patchFlag & 16)
        return prevProps ? hasPropsChanged(prevProps, nextProps, emits) : !!nextProps;
      if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key))
            return !0;
        }
      }
    } else
      return (prevChildren || nextChildren) && (!nextChildren || !nextChildren.$stable) ? !0 : prevProps === nextProps ? !1 : prevProps ? nextProps ? hasPropsChanged(prevProps, nextProps, emits) : !0 : !!nextProps;
    return !1;
  }
  __name(shouldUpdateComponent, "shouldUpdateComponent");
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length)
      return !0;
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key))
        return !0;
    }
    return !1;
  }
  __name(hasPropsChanged, "hasPropsChanged");
  function updateHOCHostEl({ vnode, parent }, el) {
    for (; parent; ) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode && (root.el = vnode.el), root === vnode)
        (vnode = parent.vnode).el = el, parent = parent.parent;
      else
        break;
    }
  }
  __name(updateHOCHostEl, "updateHOCHostEl");
  const isSuspense = /* @__PURE__ */ __name((type) => type.__isSuspense, "isSuspense");
  function queueEffectWithSuspense(fn, suspense) {
    suspense && suspense.pendingBranch ? isArray(fn) ? suspense.effects.push(...fn) : suspense.effects.push(fn) : queuePostFlushCb(fn);
  }
  __name(queueEffectWithSuspense, "queueEffectWithSuspense");
  const Fragment = Symbol.for("v-fgt"), Text = Symbol.for("v-txt"), Comment = Symbol.for("v-cmt"), Static = Symbol.for("v-stc"), blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = !1) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  __name(openBlock, "openBlock");
  function closeBlock() {
    blockStack.pop(), currentBlock = blockStack[blockStack.length - 1] || null;
  }
  __name(closeBlock, "closeBlock");
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value) {
    isBlockTreeEnabled += value, value < 0 && currentBlock && (currentBlock.hasOnce = !0);
  }
  __name(setBlockTracking, "setBlockTracking");
  function setupBlock(vnode) {
    return vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null, closeBlock(), isBlockTreeEnabled > 0 && currentBlock && currentBlock.push(vnode), vnode;
  }
  __name(setupBlock, "setupBlock");
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        !0
      )
    );
  }
  __name(createElementBlock, "createElementBlock");
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        !0
      )
    );
  }
  __name(createBlock, "createBlock");
  function isVNode(value) {
    return value ? value.__v_isVNode === !0 : !1;
  }
  __name(isVNode, "isVNode");
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  __name(isSameVNodeType, "isSameVNodeType");
  const normalizeKey = /* @__PURE__ */ __name(({ key }) => key ?? null, "normalizeKey"), normalizeRef = /* @__PURE__ */ __name(({
    ref: ref3,
    ref_key,
    ref_for
  }) => (typeof ref3 == "number" && (ref3 = "" + ref3), ref3 != null ? isString(ref3) || isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null), "normalizeRef");
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = !1, needFullChildrenNormalization = !1) {
    const vnode = {
      __v_isVNode: !0,
      __v_skip: !0,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetStart: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    return needFullChildrenNormalization ? (normalizeChildren(vnode, children), shapeFlag & 128 && type.normalize(vnode)) : children && (vnode.shapeFlag |= isString(children) ? 8 : 16), isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32 && currentBlock.push(vnode), vnode;
  }
  __name(createBaseVNode, "createBaseVNode");
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = !1) {
    if ((!type || type === NULL_DYNAMIC_COMPONENT) && (type = Comment), isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        !0
        /* mergeRef: true */
      );
      return children && normalizeChildren(cloned, children), isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (cloned.shapeFlag & 6 ? currentBlock[currentBlock.indexOf(type)] = cloned : currentBlock.push(cloned)), cloned.patchFlag = -2, cloned;
    }
    if (isClassComponent(type) && (type = type.__vccOpts), props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      klass && !isString(klass) && (props.class = normalizeClass(klass)), isObject$1(style) && (isProxy(style) && !isArray(style) && (style = extend({}, style)), props.style = normalizeStyle(style));
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      !0
    );
  }
  __name(_createVNode, "_createVNode");
  function guardReactiveProps(props) {
    return props ? isProxy(props) || isInternalObject(props) ? extend({}, props) : props : null;
  }
  __name(guardReactiveProps, "guardReactiveProps");
  function cloneVNode(vnode, extraProps, mergeRef = !1, cloneTransition = !1) {
    const { props, ref: ref3, patchFlag, children, transition } = vnode, mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props, cloned = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    return transition && cloneTransition && setTransitionHooks(
      cloned,
      transition.clone(cloned)
    ), cloned;
  }
  __name(cloneVNode, "cloneVNode");
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  __name(createTextVNode, "createTextVNode");
  function createCommentVNode(text = "", asBlock = !1) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  __name(createCommentVNode, "createCommentVNode");
  function normalizeVNode(child) {
    return child == null || typeof child == "boolean" ? createVNode(Comment) : isArray(child) ? createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    ) : typeof child == "object" ? cloneIfMounted(child) : createVNode(Text, null, String(child));
  }
  __name(normalizeVNode, "normalizeVNode");
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  __name(cloneIfMounted, "cloneIfMounted");
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null)
      children = null;
    else if (isArray(children))
      type = 16;
    else if (typeof children == "object")
      if (shapeFlag & 65) {
        const slot = children.default;
        slot && (slot._c && (slot._d = !1), normalizeChildren(vnode, slot()), slot._c && (slot._d = !0));
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        !slotFlag && !isInternalObject(children) ? children._ctx = currentRenderingInstance : slotFlag === 3 && currentRenderingInstance && (currentRenderingInstance.slots._ === 1 ? children._ = 1 : (children._ = 2, vnode.patchFlag |= 1024));
      }
    else isFunction(children) ? (children = { default: children, _ctx: currentRenderingInstance }, type = 32) : (children = String(children), shapeFlag & 64 ? (type = 16, children = [createTextVNode(children)]) : type = 8);
    vnode.children = children, vnode.shapeFlag |= type;
  }
  __name(normalizeChildren, "normalizeChildren");
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge)
        if (key === "class")
          ret.class !== toMerge.class && (ret.class = normalizeClass([ret.class, toMerge.class]));
        else if (key === "style")
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        else if (isOn(key)) {
          const existing = ret[key], incoming = toMerge[key];
          incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming)) && (ret[key] = existing ? [].concat(existing, incoming) : incoming);
        } else key !== "" && (ret[key] = toMerge[key]);
    }
    return ret;
  }
  __name(mergeProps, "mergeProps");
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  __name(invokeVNodeHook, "invokeVNodeHook");
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type, appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext, instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      scope: new EffectScope(
        !0
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    return instance.ctx = { _: instance }, instance.root = parent ? parent.root : instance, instance.emit = emit.bind(null, instance), vnode.ce && vnode.ce(instance), instance;
  }
  __name(createComponentInstance, "createComponentInstance");
  let currentInstance = null, internalSetCurrentInstance, setInSSRSetupState;
  {
    const g = getGlobalThis(), registerGlobalSetter = /* @__PURE__ */ __name((key, setter) => {
      let setters;
      return (setters = g[key]) || (setters = g[key] = []), setters.push(setter), (v) => {
        setters.length > 1 ? setters.forEach((set2) => set2(v)) : setters[0](v);
      };
    }, "registerGlobalSetter");
    internalSetCurrentInstance = registerGlobalSetter(
      "__VUE_INSTANCE_SETTERS__",
      (v) => currentInstance = v
    ), setInSSRSetupState = registerGlobalSetter(
      "__VUE_SSR_SETTERS__",
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = /* @__PURE__ */ __name((instance) => {
    const prev = currentInstance;
    return internalSetCurrentInstance(instance), instance.scope.on(), () => {
      instance.scope.off(), internalSetCurrentInstance(prev);
    };
  }, "setCurrentInstance"), unsetCurrentInstance = /* @__PURE__ */ __name(() => {
    currentInstance && currentInstance.scope.off(), internalSetCurrentInstance(null);
  }, "unsetCurrentInstance");
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  __name(isStatefulComponent, "isStatefulComponent");
  let isInSSRComponentSetup = !1;
  function setupComponent(instance, isSSR = !1, optimized = !1) {
    isSSR && setInSSRSetupState(isSSR);
    const { props, children } = instance.vnode, isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR), initSlots(instance, children, optimized);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    return isSSR && setInSSRSetupState(!1), setupResult;
  }
  __name(setupComponent, "setupComponent");
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    instance.accessCache = /* @__PURE__ */ Object.create(null), instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null, reset = setCurrentInstance(instance);
      pauseTracking();
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          instance.props,
          setupContext
        ]
      );
      if (resetTracking(), reset(), isPromise(setupResult)) {
        if (setupResult.then(unsetCurrentInstance, unsetCurrentInstance), isSSR)
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        instance.asyncDep = setupResult;
      } else
        handleSetupResult(instance, setupResult, isSSR);
    } else
      finishComponentSetup(instance, isSSR);
  }
  __name(setupStatefulComponent, "setupStatefulComponent");
  function handleSetupResult(instance, setupResult, isSSR) {
    isFunction(setupResult) ? instance.type.__ssrInlineRender ? instance.ssrRender = setupResult : instance.render = setupResult : isObject$1(setupResult) && (instance.setupState = proxyRefs(setupResult)), finishComponentSetup(instance, isSSR);
  }
  __name(handleSetupResult, "handleSetupResult");
  let compile;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      if (!isSSR && compile && !Component.render) {
        const template = Component.template || resolveMergedOptions(instance).template;
        if (template) {
          const { isCustomElement, compilerOptions } = instance.appContext.config, { delimiters, compilerOptions: componentCompilerOptions } = Component, finalCompilerOptions = extend(
            extend(
              {
                isCustomElement,
                delimiters
              },
              compilerOptions
            ),
            componentCompilerOptions
          );
          Component.render = compile(template, finalCompilerOptions);
        }
      }
      instance.render = Component.render || NOOP;
    }
    {
      const reset = setCurrentInstance(instance);
      pauseTracking();
      try {
        applyOptions(instance);
      } finally {
        resetTracking(), reset();
      }
    }
  }
  __name(finishComponentSetup, "finishComponentSetup");
  const attrsProxyHandlers = {
    get(target, key) {
      return track(target, "get", ""), target[key];
    }
  };
  function createSetupContext(instance) {
    const expose = /* @__PURE__ */ __name((exposed) => {
      instance.exposed = exposed || {};
    }, "expose");
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
  __name(createSetupContext, "createSetupContext");
  function getComponentPublicInstance(instance) {
    return instance.exposed ? instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target)
          return target[key];
        if (key in publicPropertiesMap)
          return publicPropertiesMap[key](instance);
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    })) : instance.proxy;
  }
  __name(getComponentPublicInstance, "getComponentPublicInstance");
  const classifyRE = /(?:^|[-_])(\w)/g, classify = /* @__PURE__ */ __name((str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, ""), "classify");
  function getComponentName(Component, includeInferred = !0) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  __name(getComponentName, "getComponentName");
  function formatComponentName(instance, Component, isRoot = !1) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      match && (name = match[1]);
    }
    if (!name && instance && instance.parent) {
      const inferFromRegistry = /* @__PURE__ */ __name((registry) => {
        for (const key in registry)
          if (registry[key] === Component)
            return key;
      }, "inferFromRegistry");
      name = inferFromRegistry(
        instance.components || instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? "App" : "Anonymous";
  }
  __name(formatComponentName, "formatComponentName");
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  __name(isClassComponent, "isClassComponent");
  const computed = /* @__PURE__ */ __name((getterOrOptions, debugOptions) => computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup), "computed"), version = "3.4.38";
  /**
  * @vue/runtime-dom v3.4.38
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const svgNS = "http://www.w3.org/2000/svg", mathmlNS = "http://www.w3.org/1998/Math/MathML", doc = typeof document < "u" ? document : null, templateContainer = doc && /* @__PURE__ */ doc.createElement("template"), nodeOps = {
    insert: /* @__PURE__ */ __name((child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    }, "insert"),
    remove: /* @__PURE__ */ __name((child) => {
      const parent = child.parentNode;
      parent && parent.removeChild(child);
    }, "remove"),
    createElement: /* @__PURE__ */ __name((tag, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
      return tag === "select" && props && props.multiple != null && el.setAttribute("multiple", props.multiple), el;
    }, "createElement"),
    createText: /* @__PURE__ */ __name((text) => doc.createTextNode(text), "createText"),
    createComment: /* @__PURE__ */ __name((text) => doc.createComment(text), "createComment"),
    setText: /* @__PURE__ */ __name((node, text) => {
      node.nodeValue = text;
    }, "setText"),
    setElementText: /* @__PURE__ */ __name((el, text) => {
      el.textContent = text;
    }, "setElementText"),
    parentNode: /* @__PURE__ */ __name((node) => node.parentNode, "parentNode"),
    nextSibling: /* @__PURE__ */ __name((node) => node.nextSibling, "nextSibling"),
    querySelector: /* @__PURE__ */ __name((selector) => doc.querySelector(selector), "querySelector"),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling))
        for (; parent.insertBefore(start.cloneNode(!0), anchor), !(start === end || !(start = start.nextSibling)); )
          ;
      else {
        templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          for (; wrapper.firstChild; )
            template.appendChild(wrapper.firstChild);
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  }, vtcKey = Symbol("_vtc");
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    transitionClasses && (value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ")), value == null ? el.removeAttribute("class") : isSVG ? el.setAttribute("class", value) : el.className = value;
  }
  __name(patchClass, "patchClass");
  const vShowOriginalDisplay = Symbol("_vod"), vShowHidden = Symbol("_vsh"), vShow = {
    beforeMount(el, { value }, { transition }) {
      el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display, transition && value ? transition.beforeEnter(el) : setDisplay(el, value);
    },
    mounted(el, { value }, { transition }) {
      transition && value && transition.enter(el);
    },
    updated(el, { value, oldValue }, { transition }) {
      !value != !oldValue && (transition ? value ? (transition.beforeEnter(el), setDisplay(el, !0), transition.enter(el)) : transition.leave(el, () => {
        setDisplay(el, !1);
      }) : setDisplay(el, value));
    },
    beforeUnmount(el, { value }) {
      setDisplay(el, value);
    }
  };
  function setDisplay(el, value) {
    el.style.display = value ? el[vShowOriginalDisplay] : "none", el[vShowHidden] = !value;
  }
  __name(setDisplay, "setDisplay");
  const CSS_VAR_TEXT = Symbol(""), displayRE = /(^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style, isCssString = isString(next);
    let hasControlledDisplay = !1;
    if (next && !isCssString) {
      if (prev)
        if (isString(prev))
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            next[key] == null && setStyle(style, key, "");
          }
        else
          for (const key in prev)
            next[key] == null && setStyle(style, key, "");
      for (const key in next)
        key === "display" && (hasControlledDisplay = !0), setStyle(style, key, next[key]);
    } else if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        cssVarText && (next += ";" + cssVarText), style.cssText = next, hasControlledDisplay = displayRE.test(next);
      }
    } else prev && el.removeAttribute("style");
    vShowOriginalDisplay in el && (el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "", el[vShowHidden] && (style.display = "none"));
  }
  __name(patchStyle, "patchStyle");
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray(val))
      val.forEach((v) => setStyle(style, name, v));
    else if (val == null && (val = ""), name.startsWith("--"))
      style.setProperty(name, val);
    else {
      const prefixed = autoPrefix(style, name);
      importantRE.test(val) ? style.setProperty(
        hyphenate(prefixed),
        val.replace(importantRE, ""),
        "important"
      ) : style[prefixed] = val;
    }
  }
  __name(setStyle, "setStyle");
  const prefixes = ["Webkit", "Moz", "ms"], prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached)
      return cached;
    let name = camelize(rawName);
    if (name !== "filter" && name in style)
      return prefixCache[rawName] = name;
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style)
        return prefixCache[rawName] = prefixed;
    }
    return rawName;
  }
  __name(autoPrefix, "autoPrefix");
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
    isSVG && key.startsWith("xlink:") ? value == null ? el.removeAttributeNS(xlinkNS, key.slice(6, key.length)) : el.setAttributeNS(xlinkNS, key, value) : value == null || isBoolean && !includeBooleanAttr(value) ? el.removeAttribute(key) : el.setAttribute(
      key,
      isBoolean ? "" : isSymbol(value) ? String(value) : value
    );
  }
  __name(patchAttr, "patchAttr");
  function patchDOMProp(el, key, value, parentComponent) {
    if (key === "innerHTML" || key === "textContent") {
      if (value == null) return;
      el[key] = value;
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value, newValue = value == null ? "" : String(value);
      (oldValue !== newValue || !("_value" in el)) && (el.value = newValue), value == null && el.removeAttribute(key), el._value = value;
      return;
    }
    let needRemove = !1;
    if (value === "" || value == null) {
      const type = typeof el[key];
      type === "boolean" ? value = includeBooleanAttr(value) : value == null && type === "string" ? (value = "", needRemove = !0) : type === "number" && (value = 0, needRemove = !0);
    }
    try {
      el[key] = value;
    } catch {
    }
    needRemove && el.removeAttribute(key);
  }
  __name(patchDOMProp, "patchDOMProp");
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  __name(addEventListener, "addEventListener");
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  __name(removeEventListener, "removeEventListener");
  const veiKey = Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {}), existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker)
      existingInvoker.value = nextValue;
    else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(
          nextValue,
          instance
        );
        addEventListener(el, name, invoker, options);
      } else existingInvoker && (removeEventListener(el, name, existingInvoker, options), invokers[rawName] = void 0);
    }
  }
  __name(patchEvent, "patchEvent");
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m;
      for (; m = name.match(optionsModifierRE); )
        name = name.slice(0, name.length - m[0].length), options[m[0].toLowerCase()] = !0;
    }
    return [name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2)), options];
  }
  __name(parseName, "parseName");
  let cachedNow = 0;
  const p = /* @__PURE__ */ Promise.resolve(), getNow = /* @__PURE__ */ __name(() => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now()), "getNow");
  function createInvoker(initialValue, instance) {
    const invoker = /* @__PURE__ */ __name((e) => {
      if (!e._vts)
        e._vts = Date.now();
      else if (e._vts <= invoker.attached)
        return;
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    }, "invoker");
    return invoker.value = initialValue, invoker.attached = getNow(), invoker;
  }
  __name(createInvoker, "createInvoker");
  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      const originalStop = e.stopImmediatePropagation;
      return e.stopImmediatePropagation = () => {
        originalStop.call(e), e._stopped = !0;
      }, value.map(
        (fn) => (e2) => !e2._stopped && fn && fn(e2)
      );
    } else
      return value;
  }
  __name(patchStopImmediatePropagation, "patchStopImmediatePropagation");
  const isNativeOn = /* @__PURE__ */ __name((key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123, "isNativeOn"), patchProp = /* @__PURE__ */ __name((el, key, prevValue, nextValue, namespace, parentComponent) => {
    const isSVG = namespace === "svg";
    key === "class" ? patchClass(el, nextValue, isSVG) : key === "style" ? patchStyle(el, prevValue, nextValue) : isOn(key) ? isModelListener(key) || patchEvent(el, key, prevValue, nextValue, parentComponent) : (key[0] === "." ? (key = key.slice(1), !0) : key[0] === "^" ? (key = key.slice(1), !1) : shouldSetAsProp(el, key, nextValue, isSVG)) ? (patchDOMProp(el, key, nextValue), !el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected") && patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value")) : (key === "true-value" ? el._trueValue = nextValue : key === "false-value" && (el._falseValue = nextValue), patchAttr(el, key, nextValue, isSVG));
  }, "patchProp");
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG)
      return !!(key === "innerHTML" || key === "textContent" || key in el && isNativeOn(key) && isFunction(value));
    if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "form" || key === "list" && el.tagName === "INPUT" || key === "type" && el.tagName === "TEXTAREA")
      return !1;
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE")
        return !1;
    }
    return isNativeOn(key) && isString(value) ? !1 : key in el;
  }
  __name(shouldSetAsProp, "shouldSetAsProp");
  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  __name(ensureRenderer, "ensureRenderer");
  const createApp = /* @__PURE__ */ __name((...args) => {
    const app = ensureRenderer().createApp(...args), { mount } = app;
    return app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container) return;
      const component = app._component;
      !isFunction(component) && !component.render && !component.template && (component.template = container.innerHTML), container.innerHTML = "";
      const proxy = mount(container, !1, resolveRootNamespace(container));
      return container instanceof Element && (container.removeAttribute("v-cloak"), container.setAttribute("data-v-app", "")), proxy;
    }, app;
  }, "createApp");
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement)
      return "svg";
    if (typeof MathMLElement == "function" && container instanceof MathMLElement)
      return "mathml";
  }
  __name(resolveRootNamespace, "resolveRootNamespace");
  function normalizeContainer(container) {
    return isString(container) ? document.querySelector(container) : container;
  }
  __name(normalizeContainer, "normalizeContainer");
  const parser = new DOMParser(), gameVersions = [
    { children: [
      { id: "54", name: "万魔殿 荒天之狱" },
      { id: "49", name: "万魔殿 炼净之狱" },
      { id: "44", name: "万魔殿 边境之狱" },
      { id: "53", name: "欧米茄绝境验证战" },
      { id: "45", name: "幻想龙诗绝境战" },
      { id: "43", name: "绝境战（旧版本）" },
      { id: "55", name: "讨伐歼灭战 III：高难度" },
      { id: "50", name: "讨伐歼灭战：高难度 II" },
      { id: "42", name: "讨伐歼灭战：高难度 I" },
      { id: "46", name: "幻巧战" },
      { id: "51", name: "迷宫挑战（异闻）" },
      { id: "41", name: "迷宫挑战 (90级)" },
      { id: "56", name: "荣华神域塔利亚" },
      { id: "52", name: "喜悦神域欧芙洛绪涅" },
      { id: "47", name: "灿烂神域阿格莱亚" },
      { id: "48", name: "女王古殿贡希尔德神庙" }
    ], name: "晓月之终途" },
    { children: [
      { id: "38", name: "伊甸希望乐园：再生之章" },
      { id: "33", name: "伊甸希望乐园：共鸣之章" },
      { id: "29", name: "伊甸希望乐园：觉醒之章" },
      { id: "32", name: "绝境战（暗影之逆焰）" },
      { id: "30", name: "绝境战 (红莲之狂潮)" },
      { id: "37", name: "讨伐歼灭战 III：高难度" },
      { id: "34", name: "讨伐歼灭战 II：高难度" },
      { id: "28", name: "讨伐歼灭战 I：高难度" },
      { id: "36", name: "幻巧战" },
      { id: "27", name: "迷宫挑战(80级)" },
      { id: "40", name: "希望之炮台：“塔”" },
      { id: "35", name: "人偶军事基地" },
      { id: "31", name: "复制工厂废墟" },
      { id: "39", name: "女王古殿贡希尔德神庙" }
    ], name: "暗影之逆焰" }
  ];
  let token = null, signature = null;
  function getLogsProfileURL(serverName, charName) {
    return `https://cn.fflogs.com/character/CN/${serverName}/${charName}`;
  }
  __name(getLogsProfileURL, "getLogsProfileURL");
  async function getCharacterID(serverName, charName) {
    const text = (await GM.xmlHttpRequest({
      url: `https://cn.fflogs.com/character/CN/${serverName}/${charName}`,
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,en-GB;q=0.5,ja;q=0.4",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
        origin: "https://cn.fflogs.com/",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      method: "GET"
    }).catch((e) => console.error(e))).responseText, t = text.match(/<meta name="csrf-token" content="(\w+)">/);
    t ? (token = encodeURIComponent(t[1]), console.log(token)) : console.error("未找到token，后续请求可能无法成功");
    const s = text.match(/function loadZoneTable\(\)\s?{(?:.|\n)*?'&signature='\s?\+\s?'(\w+)'/);
    t ? (signature = s[1], console.log(signature)) : console.error("未找到signature，后续请求可能无法成功");
    const match = text.match(/var characterID\s?=\s?(\d+);/);
    return match ? match[1] : null;
  }
  __name(getCharacterID, "getCharacterID");
  async function getCharacterLogsData(charID, zoneID, dpsType = "rdps") {
    if (!token) throw new Error("未获取到有效token，无法进行请求");
    const text = (await GM.xmlHttpRequest({
      url: `https://cn.fflogs.com/character/rankings-zone/${charID}/dps/3/${zoneID}/0/5000/0/-1/Any/rankings/0/0?dpstype=${dpsType}&class=Any&signature=${signature}`,
      headers: {
        accept: "text/html, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,en-GB;q=0.5,ja;q=0.4",
        origin: "https://cn.fflogs.com/",
        referer: "https://cn.fflogs.com/",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      data: `_token=${token}`,
      method: "POST"
    }).catch((e) => console.error(e))).responseText, doc2 = parser.parseFromString(text, "text/html");
    doc2.querySelectorAll("a").forEach((ele) => {
      ele.onclick = null, ele.style.pointerEvents = "none";
    });
    const table = doc2.querySelector("table[id]");
    return table || null;
  }
  __name(getCharacterLogsData, "getCharacterLogsData");
  function tryOnScopeDispose(fn) {
    return getCurrentScope() ? (onScopeDispose(fn), !0) : !1;
  }
  __name(tryOnScopeDispose, "tryOnScopeDispose");
  function toValue(r) {
    return typeof r == "function" ? r() : unref(r);
  }
  __name(toValue, "toValue");
  const isClient = typeof window < "u" && typeof document < "u";
  typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
  const toString = Object.prototype.toString, isObject = /* @__PURE__ */ __name((val) => toString.call(val) === "[object Object]", "isObject"), noop = /* @__PURE__ */ __name(() => {
  }, "noop");
  function unrefElement(elRef) {
    var _a;
    const plain = toValue(elRef);
    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
  }
  __name(unrefElement, "unrefElement");
  const defaultWindow = isClient ? window : void 0;
  function useEventListener(...args) {
    let target, events2, listeners, options;
    if (typeof args[0] == "string" || Array.isArray(args[0]) ? ([events2, listeners, options] = args, target = defaultWindow) : [target, events2, listeners, options] = args, !target)
      return noop;
    Array.isArray(events2) || (events2 = [events2]), Array.isArray(listeners) || (listeners = [listeners]);
    const cleanups = [], cleanup = /* @__PURE__ */ __name(() => {
      cleanups.forEach((fn) => fn()), cleanups.length = 0;
    }, "cleanup"), register = /* @__PURE__ */ __name((el, event, listener, options2) => (el.addEventListener(event, listener, options2), () => el.removeEventListener(event, listener, options2)), "register"), stopWatch = watch(
      () => [unrefElement(target), toValue(options)],
      ([el, options2]) => {
        if (cleanup(), !el)
          return;
        const optionsClone = isObject(options2) ? { ...options2 } : options2;
        cleanups.push(
          ...events2.flatMap((event) => listeners.map((listener) => register(el, event, listener, optionsClone)))
        );
      },
      { immediate: !0, flush: "post" }
    ), stop = /* @__PURE__ */ __name(() => {
      stopWatch(), cleanup();
    }, "stop");
    return tryOnScopeDispose(stop), stop;
  }
  __name(useEventListener, "useEventListener");
  function useElementHover(el, options = {}) {
    const {
      delayEnter = 0,
      delayLeave = 0,
      window: window2 = defaultWindow
    } = options, isHovered = ref(!1);
    let timer;
    const toggle = /* @__PURE__ */ __name((entering) => {
      const delay = entering ? delayEnter : delayLeave;
      timer && (clearTimeout(timer), timer = void 0), delay ? timer = setTimeout(() => isHovered.value = entering, delay) : isHovered.value = entering;
    }, "toggle");
    return window2 && (useEventListener(el, "mouseenter", () => toggle(!0), { passive: !0 }), useEventListener(el, "mouseleave", () => toggle(!1), { passive: !0 })), isHovered;
  }
  __name(useElementHover, "useElementHover");
  const _withScopeId = /* @__PURE__ */ __name((n) => (pushScopeId("data-v-ed6c51cc"), n = n(), popScopeId(), n), "_withScopeId"), _hoisted_1 = { class: "trigger text-cyan-7 cursor-pointer" }, _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "font-bold" }, " 服务器： ", -1)), _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("br", null, null, -1)), _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "font-bold" }, "角色名：", -1)), _hoisted_5 = ["href"], App = /* @__PURE__ */ (/* @__PURE__ */ __name((sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props)
      target[key] = val;
    return target;
  }, "_export_sfc"))(/* @__PURE__ */ defineComponent({
    __name: "App",
    props: {
      charName: { default: "" },
      serverName: { default: "" }
    },
    setup(__props) {
      const props = __props, compRoot = ref(null), panel = ref(null), rootHovered = useElementHover(compRoot, { delayEnter: 500 }), panelHovered = useElementHover(panel, { delayLeave: 200 }), propsValid = computed(() => props.charName && props.serverName), displayPanel = computed(() => propsValid.value && (rootHovered.value || panelHovered.value)), promise = ref(null), status = ref("正在查询数据……"), fetched = ref(!1), table = ref(null);
      return watch(displayPanel, (newVal) => {
        newVal === !0 && !promise.value && (promise.value = getCharacterID(props.serverName, props.charName).then((ID) => {
          if (!ID)
            throw status.value = "未查询到该角色的记录", new Error("Not found");
          return getCharacterLogsData(ID, gameVersions[0].children[0].id);
        }).then((parsedTable) => {
          if (!parsedTable) {
            status.value = "未请求到数据", fetched.value = !0;
            return;
          }
          status.value = "", fetched.value = !0, table.value.appendChild(parsedTable);
        }));
      }), (_ctx, _cache) => (openBlock(), createElementBlock("div", {
        ref_key: "compRoot",
        ref: compRoot,
        class: "relative mx-2"
      }, [
        createBaseVNode("div", _hoisted_1, toDisplayString(unref(propsValid) ? "鼠标悬浮此处查看FFlogs数据" : "未能识别角色名或服务器"), 1),
        withDirectives(createBaseVNode("div", {
          ref_key: "panel",
          ref: panel,
          class: "absolute left-0 top-0 border border-solid rounded p-2 bg-white z-10"
        }, [
          createBaseVNode("div", null, [
            _hoisted_2,
            createTextVNode(" " + toDisplayString(props.serverName) + " ", 1),
            _hoisted_3,
            _hoisted_4,
            createTextVNode(" " + toDisplayString(props.charName), 1)
          ]),
          createBaseVNode("div", null, toDisplayString(unref(status)), 1),
          unref(fetched) ? (openBlock(), createElementBlock("a", {
            key: 0,
            href: unref(getLogsProfileURL)(props.serverName, props.charName),
            target: "_blank"
          }, "查看角色FFlogs主页", 8, _hoisted_5)) : createCommentVNode("", !0),
          createBaseVNode("div", {
            ref_key: "table",
            ref: table,
            class: "relative bg-white z-20"
          }, null, 512)
        ], 512), [
          [vShow, unref(displayPanel)]
        ])
      ], 512));
    }
  }), [["__scopeId", "data-v-ed6c51cc"]]);
  function insertInstances(commentEle2) {
    var _a, _b;
    const children = commentEle2.querySelectorAll("div.flex.alcenter:has(~ div.dobans)");
    for (let child of children) {
      const ins = document.createElement("div");
      child.appendChild(ins);
      const charName = (_a = child.querySelector("div.name span.cursor")) == null ? void 0 : _a.textContent, serverName = (_b = child.querySelector("span.group")) == null ? void 0 : _b.textContent;
      charName && serverName && createApp(App, {
        charName,
        serverName
      }).mount(ins);
    }
  }
  __name(insertInstances, "insertInstances");
  function insertInstanceAtOP(target) {
    var _a, _b;
    const ins = document.createElement("div");
    target.appendChild(ins);
    const charName = (_a = target.querySelector("span:nth-child(1)")) == null ? void 0 : _a.textContent, serverName = (_b = target.querySelector("span:nth-child(2) > span > span:nth-child(2)")) == null ? void 0 : _b.textContent;
    charName && serverName && createApp(App, {
      charName,
      serverName
    }).mount(ins);
  }
  __name(insertInstanceAtOP, "insertInstanceAtOP");
  const observer = new MutationObserver((mutations, obs) => {
    for (const m of mutations)
      if (m.type === "childList") {
        console.log("监听到评论列表更新");
        for (const child of m.addedNodes)
          child.nodeType & child.ELEMENT_NODE && insertInstances(child);
      }
  }), rootObserver = new MutationObserver((mutations, obs) => {
    outer:
      for (const m of mutations)
        if (m.target.nodeType === Node.ELEMENT_NODE) {
          for (const child of m.addedNodes) {
            if (child.nodeType !== Node.ELEMENT_NODE) continue;
            const e = child, e1 = e.querySelector("#comment");
            e1 && (console.log("监听到评论列表出现"), insertInstances(e1), observer.observe(e1, {
              childList: !0,
              subtree: !0
            }));
            const e2 = e.querySelector("div.detail div.flex.alcenter");
            e2 && (console.log("监听到主楼出现"), insertInstanceAtOP(e2));
          }
          for (const child of m.removedNodes) {
            if (child.nodeType !== Node.ELEMENT_NODE) continue;
            if (child.querySelector("#comment")) {
              console.log("监听到评论列表被移除，停止原先的监听评论列表"), observer.disconnect();
              break outer;
            }
          }
        }
  });
  console.log("油猴石之家脚本已运行");
  const commentEle = document.querySelector("#comment");
  commentEle && (console.log("找到评论列表元素，处理已有评论"), insertInstances(commentEle), observer.observe(commentEle, {
    childList: !0,
    subtree: !0
  }));
  const opEle = document.querySelector("div.detail div.flex.alcenter");
  opEle && (console.log("已找到并处理主楼"), insertInstanceAtOP(opEle)), rootObserver.observe(document.body, {
    attributes: !0,
    childList: !0,
    subtree: !0
  });
})();
