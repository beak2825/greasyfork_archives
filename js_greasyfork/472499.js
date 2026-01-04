// ==UserScript==
// @name futaba-sp-style
// @namespace http://2chan.net/
// @version 0.2.0
// @description ふたばちゃんねるのスレッド表示のデザインをスマートフォンに最適化します
// @author ame-chan
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/472499/futaba-sp-style.user.js
// @updateURL https://update.greasyfork.org/scripts/472499/futaba-sp-style.meta.js
// ==/UserScript==

(function() {
let css = `* {
  box-sizing: border-box;
}
html {
  font-size: 62.5%;
}
body {
  margin: 0;
  min-width: unset;
  font-size: 1.6rem;
  font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
}
td {
  padding: 0;
  max-width: unset;
}
input,
textarea {
  border: 0;
  border-radius: 4px;
}
input:focus {
  outline: 0;
}
hr {
  margin: 16px 0;
  width: 100%;
  height: 1px;
  outline: 0;
  border: 0;
  border-bottom: 1px solid #800000;
}

/* ヘッダータイトル・検索フォーム */
#hdp {
  height: auto;
}
#tit,
#hml {
  position: static;
  display: flex;
  margin: 0;
  padding: 0;
}
#tit {
  justify-content: center;
  margin: 16px 0 8px;
  line-height: 1;
}
#searchfm {
  display: flex;
}
#hml {
  gap: 8px;
  justify-content: flex-end;
  border: 0;
  border-radius: 4px;
}
#hml input[type=submit] {
  margin: 0;
}
/* 入力フォームfixed */
#futaoptions-resBtn {
  appearance: none;
  visibility: hidden;
  position: fixed;
  top: 8px;
  right: 8px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 40px;
  color: #fff;
  line-height: 1;
  font-size: 1.6rem;
  background-color: #800000;
  border: 0;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s linear;
  z-index: -1;
}
#futaoptions-resBtn.is-sticky {
  visibility: visible;
  opacity: 1;
  z-index: 9999;
}
#futaoptions-resBtn.is-sticky:active {
  opacity: 0.3;
  user-select: none;
}

.futaoptions-form {
  overflow-y: auto;
  position: fixed;
  top: 56px;
  right: 8px;
  visibility: hidden;
  padding: 16px 8px;
  width: calc(100vw - 16px);
  max-height: calc(100vh - (56px + 16px));
  background-color: #ffffee;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s linear;
  z-index: -1;
}
.futaoptions-form.is-visible {
  visibility: visible;
  opacity: 1;
  z-index: 9999;
}
.futaoptions-form #reszb,
.futaoptions-form .ftb2 {
  display: none;
}
.futaoptions-form .ftb2.is-open {
  display: block;
}
#futaoptions-infoBtn {
  display: block;
  margin: 0 0 0 auto;
  width: 60px;
}
.futaoptions-btnWrap {
  display: flex;
  margin: 8px 0 0;
  gap: 8px;
  justify-content: flex-end;
}

/* 入力フォーム */
.ftbl {
  margin: 0 auto;
  width: calc(100vw - 16px) !important;
  border-collapse: collapse;
}
.futaoptions-form .ftbl {
  width: 100% !important;
}
.futaoptions-form .ftbl tbody,
.futaoptions-form .ftbl tr {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
.ftbl tr > td {
  position: relative;
  display: flex;
  align-items: center;
  column-gap: 8px;
}
.ftbl tr > td:has(#oe3[style*="visible"]) {
  height: 135px;
}
.ftbl tr > td input {
  border: 0;
  border-radius: 4px;
}
.ftbl tr > td input[type="submit"] {
  height: 20px;
}
.ftbl tr > td :is(input[type="text"], input[type="password"], #ftxa) {
  border: 1px solid #eee;
}
.ftbl tr > td small {
  font-size: 1rem;
}

/* フォームタイトル */
.ftdc {
  gap: 8px;
  width: 100%;
  white-space: normal;
  font-size: 1.4rem;
}
.futaoptions-form .ftdc {
  padding: 8px 16px;
  line-height: 1;
  border-radius: 4px;
}
/* お絵描き */
#swfContents {
  position: absolute;
  width: 100%;
  min-height: 135px;
  z-index: -1;
}
#swfContents:has(#oe3[style*="visible"]) {
  z-index: 10;
}
#oebtnd {
  display: flex;
  gap: 8px;
  align-items: center;
}
#oebtnud {
  margin: 0;
}
#oe3 {
  display: flex;
  margin: 0;
  width: 100%;
}
#oest1,
#oest2 {
  float: none !important;
}
#oest1 {
  width: calc(100% - 46px);
}
#oejs {
  width: 100%;
  height: 135px;
}
/* コメント */
#ftxa {
  width: 100% !important;
  border: 0;
  border-radius: 4px;
}
#ftxa:focus {
  outline: 0;
}
/* 情報 */
.ftb2 {
  width: 100%;
}
.ftb2 ul {
  padding: 0 0 0 24px;
}
/* スレッド */
.thre {
  margin-top: 16px;
  margin-right: 0;
}
.thre > :is(.rsc, .cnw, .cno) {
  vertical-align: top;
  line-height: 1;
  font-size: 1.3rem !important;
}
.thre > :is(.sod, .cntd) {
  vertical-align: top;
  line-height: 1;
  font-size: 1.2rem !important;
}
.thre > .cntd {
  display: block;
  margin: 0;
  padding: 0 8px;
  width: 100%;
  font-size: 1.6rem !important;
}
.thre table {
  margin: 0;
  padding: 0;
  min-width: unset;
  width: 100%;
  border: 0;
  border-collapse: collapse;
}
.rts {
  display: none;
}
.rtd {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 0;
  padding: 16px 8px;
  max-width: 100vw;
  min-width: unset;
  border-top: 1px solid #ffe;
}
.rtd span {
  vertical-align: top;
  line-height: 1;
  font-size: 1.3rem !important;
}
.rtd :is(.rsc, .cnw, .cno, .sod) {
  margin: 0;
}
.thre > blockquote {
  margin: 0;
  padding: 16px 8px;
  word-break: break-all;
  font-size: 1.6rem;
}
.rtd blockquote {
  margin: 0;
  padding: 0;
  width: 100%;
  word-break: break-all;
  font-size: 1.6rem;
}
.cno,
.sod,
.pdmm,
.pdds,
.hsbn {
  font-size: unset;
}
.rtd .sod {
  font-size: 1.2rem !important;
}
.dmps {
  display: block;
  height: 50px;
}
.cno,
.sod {
  margin: 0;
  padding: 0;
  line-height: 1;
  vertical-align: top;
  font-size: 0.9rem;
}
/* No.ポップアップ */
.pdmm {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 8px;
  border-radius: 4px;
}
.pdms,
.pdmf {
  margin: 0;
  padding: 0;
  line-height: 1;
}
.pdmf {
  margin-top: 8px;
}
.pdmf form {
  display: flex;
  width: 170px;
  flex-wrap: wrap;
  align-items: center;
}
.pdmf input[type="password"] {
  width: 100px;
  border: 1px solid #eee;
}
.pdmf input[name="onlyimgdel"] {
  margin: 0 4px 0 0;
}

/* SP用上下移動ボタン */
.gotop,
.gobtm {
  display: none !important;
}

/* リロード */
#contres {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  left: 0;
  font-size: 1.8rem;
}

/* 広告周り調整 */
body > #ufm + div,
div[style*="width"] {
  overflow-x: hidden !important;
  width: 100vw !important;
}
.footfix,
div[style*="728"][style*="90"] {
  overflow: hidden;
  margin: 0 !important;
  width: 100vw !important;
  height: calc((var(--device-width) / 728) * 90 * 1px) !important;
}
.footfix iframe,
div[style*="728"][style*="90"] iframe {
  transform-origin: 0 0;
  transform: scale(calc(var(--device-width) / 728));
  border: 0;
}
.footfix {
  right: auto !important;
}
:is(div[style*="728"], .tue2):has(:is(iframe[src*="headrect"], iframe[src*="tue3"])) {
  margin: 0 !important;
  width: 100vw !important;
}
div[style*="680"]:has(:is(iframe[src*="hsi1"], iframe[src*="foot4_ab"])),
:is(div[style*="728"], .tue2) > div[style*="610"]:has(iframe[src*="headrect"]) {
  display: flex !important;
  margin: 0 !important;
  width: 100vw !important;
}
:is(div[style*="728"], .tue2) > div[style*="610"] > div[style*="300"][style*="250"] {
  float: none !important;
  margin: 0 !important;
  width: 50vw !important;
  height: calc((300 * 250) / var(--device-width) * 1px) !important;
}
:is(div[style*="728"], .tue2) > div[style*="610"] > div[style*="300"][style*="250"] iframe {
  transform-origin: 0 0;
  transform: scale(calc(300 / var(--device-width)));
  border: 0;
}
div[style*="680"] > div[style*="336"][style*="280"] {
  float: none !important;
  margin: 0 !important;
  width: 50vw !important;
  height: calc((280 / 336) * (var(--device-width) / 2) * 1px) !important;
}
div[style*="680"] > div[style*="336"][style*="280"] iframe {
  transform-origin: 0 0;
  transform: scale(calc((var(--device-width) / 2) / 336));
  border: 0;
}
.tue, .tue2 {
  max-width: 100vw;
}
.tue2 {
  height: auto;
}
.tue2 > div {
  display: flex;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
