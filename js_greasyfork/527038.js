// ==UserScript==
// @name Rule34.xxx – Dark Enhanced [Ath]
// @namespace athari
// @version 1.0.0
// @description Dark theme for Rule34.xxx. Includes ad blocking, fixed pagination at the bottom, search and back/next navigation at the top.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.rule34.xxx/*
// @downloadURL https://update.greasyfork.org/scripts/527038/Rule34xxx%20%E2%80%93%20Dark%20Enhanced%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/527038/Rule34xxx%20%E2%80%93%20Dark%20Enhanced%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    color-scheme: dark;
    color: #ccc;
  }
  #gdprconsent,
  .exo-native-widget,
  .sidebarRight,
  .image-list ~ br,
  [class^="exo-native-"],
  [src="/images/r34chibi.png"],
  [data-nosnippet] {
    display: none !important;
  }
  body, div, h1, h2, h3, h4, h5, h6, p, ul, li, dd, dt {
    font-family: Segoe UI, sans-serif;
  }
  h1, h2, h3, h4, h5, h6 {
    color: #aaa;
  }
  body {
    background: #111;
  }
  a {
    text-decoration: none;
    &:link {
      color: #88d;
    }
    &:visited {
      color: #77d;
    }
    &:active,
    &:hover {
      color: #aad;
    }
    &.last-page {
      color: #666;
    }
    &.spoiler {
      color: #666;
      background: #666;
      :hover {
        color: #ccc;
      }
    }
    &.blacklisted-tags-disabled {
      color: #666;
    }
  }
  dt.bad {
    color: red;
  }
  h2.wiki-title {
    color: #003dd8;
  }
  input {
    background: revert !important;
    border: revert !important;
    &:focus {
      background: revert !important;
      border: revert !important;
    }
  }

  span.author {
    color: #aaa
  }

  span.date {
    color: #aaa
  }

  span.locked-topic {
    color: #666
  }

  span.post-count {
    color: #aaa
  }

  span.spoiler {
    color: #666;
    background: #666;
  }

  span.spoiler:hover {
    color: #ccc;
  }

  strong.divider {
    color: gray
  }

  textarea:focus {
    background: #ffc
  }

  div.auto_complete {
    background: #fff
  }

  div.auto_complete ul {
    border-color: #888
  }

  div.auto_complete ul li.selected {
    background-color: #ffb
  }

  div.auto_complete ul strong.highlight {
    color: #800
  }

  div.blocked {
    border-color: red;
    background: #fcc;
    color: red
  }

  div#footer {
    color: #ccc
  }

  div#footer > .footer-disabled {
    color: #777
  }

  div#footer > #label {
    color: #777
  }

  div.has-mail {
    border-color: #afa;
    background: #efe
  }

  div.help div.code {
    border-color: green;
    background: #eee
  }

  div.help h4 {
    color: #060
  }

  div.mail .received {
    color: #060
  }

  div.mail .sent {
    color: #600
  }

  div.notice {
    color: red
  }

  div.quote {
    background: #f6f6f6 url(./counter/quote.gif) no-repeat top right;
    border-color: #bababa
  }

  a.original-file-changed#highres {
    color: #0030fa
  }

  div#user-record > table > tbody > tr.positive-record {
    background: #efe
  }

  div#user-record > table > tbody > tr.negative-record {
    background: #fee
  }

  div.tips {
    background: url(topban00.jpg);
    border-bottom-color: #c9def8
  }

  a.original-file-changed#highres {
    color: #0030fa
  }

  div.status-notice {
    border-color: #555;
    background: #333;
  }

  div#user-record > table > tbody > tr.positive-record {
    background: #efe
  }

  div#user-record > table > tbody > tr.negative-record {
    background: #fee
  }

  div#wiki-show > div#body > div#byline {
    color: #666
  }

  div#wiki-diff del {
    background-color: #f88
  }

  div#wiki-diff ins {
    background-color: #8f8
  }

  .obsolete-tag-change {
    color: #000
  }

  .tag-type-artist > a, .tag-type-artist {
    color: #a00
  }

  .tag-type-artist > a:hover, .tag-type-artist:hover {
    color: #9093ff
  }

  .tag-type-character > a, .tag-type-character {
    color: #0a0
  }

  .tag-type-character > a:hover, .tag-type-character:hover {
    color: #9093ff
  }

  .tag-type-copyright > a, .tag-type-copyright {
    color: #a0a
  }

  .tag-type-copyright > a:hover, .tag-type-copyright:hover {
    color: #9093ff
  }

  .tag-type-metadata > a, .tag-type-metadata {
    color: #f80
  }

  .tag-type-metadata > a:hover, .tag-type-metadata:hover {
    color: #fa6
  }

  .tag-count {
    color: #666;
  }

  .added-tags {
    color: #0c0
  }

  .removed-tags {
    color: red
  }

  .added-tags {
    color: #0c0
  }

  .removed-tags {
    color: red
  }

  tr.tableheader, thead tr {
    background: url(topban00.jpg)!important
  }

  table.form th {
    color: #000
  }

  table.highlightable > tbody > tr:hover {
    background: #7fb17e
  }

  table.highlightable th {
    color: #fff
  }

  table.highlightable td {
    border-color: #eee
  }

  table tr.good {
    background: #e6ffe6
  }

  table tr.selected {
    background: #aee!important
  }

  table tr.highlight {
    background: #ffd
  }

  table tr.pending-tag {
    background: #dcf6dc
  }

  table tr:nth-child(odd) {
    background: rgba(50, 50, 50, .1)
  }

  img.flagged {
    border-color: red
  }

  img.has-children {
    border-color: #0f0
  }

  img.has-parent {
    border-color: #cc0
  }

  img.pending {
    border-color: #00f
  }

  img.video {
    border-color: #00f
  }

  div#post-add p#scale {
    color: #999
  }

  div#note-container > div.note-body {
    background: #ffe;
    border-color: #000;
    color: #000
  }

  div#note-container > div.note-body > p.tn {
    color: gray
  }

  tn {
    color: gray
  }

  div#note-container > div.note-box {
    border-color: #000;
    background: #ffe
  }

  div#note-container > div.note-box > div.note-corner {
    background: #000
  }

  div#note-container > div.unsaved {
    background: #fff;
    border-color: red
  }

  div#note-container > div.unsaved > div.note-corner {
    background: red
  }

  div#edit-box {
    background: #fff
  }

  div.response-list > div.post > div.content > div.footer {
    color: #ccc
  }

  div.response-list > div.post > div.content > div.footer a {
    color: #666
  }

  #navbar li.current-page a {
    color: #fff
  }

  hr {
    border-color: hsla(114, 56%, 33%, .3)
  }

  hr.light {
    border-color: hsla(114, 56%, 66%, .2)
  }

  div.mailbody {
    background-color: hsl(0, 100%, 100%, .3);
    border-color: hsla(0, 0%, 93%, .5)
  }

  .awesomeplete > ul > li {
    color: #009
  }

  .awesomplete > ul > li:hover, .awesomplete > ul > li[aria-selected=true] {
    background: #d2ffcd;
    color: #009
  }

  .awesomplete mark {
    background: rgba(255, 255, 0, .7);
    color: #000
  }

  .awesomplete > ul {
    background: #fff
  }

  .awesomplete > ul {
    background: linear-gradient(to bottom right, hsla(114, 55%, 80%, 1), hsla(114, 55%, 80%, 0.8));
    border: 1px solid rgba(0, 0, 0, .3);
    box-shadow: .05em .2em .6em rgba(0, 0, 0, .2)
  }

  table.highlightable > tbody > tr:hover {
    background: #fff2;
  }
  tr.tableheader, thead tr {
    background: #fff4 !important;
  }

  div.quote {
    background: #fff2;
    border-color: #fff3;
  }

  div#header {
    ul:is(#navbar, #subnavbar) {
      li.current-page {
        background: #448;
        a {
          color: #eee;
        }
      }
    }
    ul#subnavbar {
      background: #222;
    }
  }
  div.sidebar {
    color: #668;
  }

  #status-notices {
    display: flex;
    flex-flow: row wrap;
    > br {
      display: none;
    }
  }

  #post-list div#paginator {
    position: fixed;
    inset: auto 0 0 auto;
    margin: 0;
    padding: 8px;
    background: #222;
    border-radius: 4px 0 0 0;
  }
  div#paginator {
    a, b {
      display: inline-block;
      margin: 0 4px;
      padding: 4px 8px;
      min-width: 2ch;
    }
    a:hover {
      background: #aad4;
      color: #aad;
    }
    .manual-page-chooser {
      input {
        padding: 4px 8px;
        background: revert;
      }
    }
  }

  div.tag-search {
    position: absolute;
    inset: 8px auto auto 400px;
    width: auto;
    display: flex;
    flex-flow: row;
    align-items: baseline;
    align-content: center;
    gap: 10px;
    form {
      display: contents;
    }
    input {
      padding: 3px 6px !important;
    }
    input[type=text] {
      width: 500px;
    }
    br {
      display: none;
    }
  }
  
  #post-view {
    img {
      max-width: calc(100vw - 270px);
      width: auto;
      height: auto;
    }
  }

  #navlinksContainer {
    position: absolute;
    inset: 47px 0 auto auto;
    display: flex;
    flex-flow: row;
    align-items: baseline;
    gap: 10px;
    background: none;
    border: none;
    [style="text-align: center"] {
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    a {
      margin: 0;
      padding: 8px;
      background: #222;
      border-radius: 4px 0 0 0;
    }
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
