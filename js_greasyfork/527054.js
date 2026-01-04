// ==UserScript==
// @name NpmJS.com – Dark [Ath]
// @namespace athari
// @version 1.1.1
// @description Dark theme for NPM (NpmJS.com). Includes styling of documentation.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.npmjs.com/*
// @downloadURL https://update.greasyfork.org/scripts/527054/NpmJScom%20%E2%80%93%20Dark%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/527054/NpmJScom%20%E2%80%93%20Dark%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    color-scheme: dark;
  }
  
  :root {
    --color-fg-default: #eee; /*262626*/
    --color-fg-muted: #ccc; /*4d4d4d*/
    --color-fg-subtle: #999; /*666666*/
    --color-fg-on-emphasis: #ffffff;
    --color-fg-brand: #cb3837;
    --color-fg-accent: #196cb2;
    --color-fg-success: #107010;
    --color-fg-attention: #886701;
    --color-fg-danger: #bb2e3e;

    --color-bg-default: #111; /*ffffff*/
    --color-bg-subtle: #1f1f1f; /*f7f7f7*/
    --color-bg-inset: #222; /*f2f2f2*/
    --color-bg-emphasis: #262626;
    --color-bg-accent: oklch(from #f2f9ff 0.3 c h); /*f2f9ff*/
    --color-bg-success: oklch(from #dcfdd9 0.3 c h); /*dcfdd9*/
    --color-bg-attention: oklch(from #fff5d8 0.3 c h); /*fff5d8*/
    --color-bg-danger: oklch(from #ffdbdb 0.3 c h); /*ffdbdb*/

    --color-border-default: #444; /*e6e6e6*/
    --color-border-muted: #333; /*f2f2f2*/
    --color-border-strong: #666; /*8f8f8f*/
    --color-border-accent: #afcee9;
    --color-border-accent-emphasis: #0969da;
    --color-border-success: #93d58a;
    --color-border-success-emphasis: #107010;
    --color-border-attention: oklch(from #efd88f 0.5 c h); /*efd88f*/
    --color-border-danger: #f1b8bc;
    
    /* missing wtf?? */
    --color-canvas-default: #111;
    --color-canvas-overlay: #333;
    --color-accent-muted: #334;
    --color-accent-subtle: #223;
    --shadow-floating-small: 1px 1px 2px 2px #0004;

    --color-shadow-large: 0 8px 24px rgba(140, 149, 159, 0.2);

    /*
      Legacy color variables — please avoid!
    */
    --button-green: #00c642;
    --npmRed: #cb3837;
    --npmLightRed: #fb3e44;
    --wombat-red: #cb3837;
    --wombat-red-hover: #c40b0a;
    --wombat-yellow: #ffcd3a;
    --wombat-violet: #8956ff;
    --wombat-purple: #c836c3;
    --wombat-green: #00c642;
    --wombat-teal: #29abe2;
    --blue: #357edd;
    --light-blue: #70b8ff;
    --header-color: #eee;
    --bg: #111;
    --bg-dark: #cb3837;
    --background-color: #000; /*fafafa*/
    --wombat-bg-red: rgba(203, 55, 56, 0.1);

    --code: 'Cascadia Code', 'Fira Mono', 'Andale Mono', 'Consolas', monospace;
    --code-ls: 0px;
    --code-lh: 24px;

    --standardCardTransition: all 0.2s ease;

    --header-letter-spacing: 0.015625em;

    --readme-font-size: 16px;
    --readme-line-height: 1.3;

    --code-font-size: 13px;
    --copy-color: #eee;
    --code-bg: #222;
    --code-box-radius: 2px;

    /* docs */
    --fontStack-monospace: var(--code);
    /*--fgColor-default: #eee;
    --bgColor-default: #111;
    --borderColor-default: #444;
    --borderColor-muted: #333;*/
  }

  :not(#\\0) {
    word-break: normal;
  }

  input {
    color: #eee !important;
    background: #222 !important;
    &::placeholder {
      color: #888 !important;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    span {
      color: inherit !important;
    }
  }

  form#search > .relative {
    border-color: #333 !important;
    > .nowrap {
      background: #222;
    }
  }

  footer {
    background: #000 !important;
    #footer {
      h3 {
        color: #bbb;
      }
      a {
        color: var(--wombat-red);
      }
    }
  }

  .black {
    color: #eee;
  }
  .hover-black:is(:hover, :focus) {
    color: #eee;
  }
  .black-90 {
    color: #ddd;
  }
  .black-80 {
    color: #ccc;
    svg {
      color: inherit;
      g {
        fill: currentcolor;
      }
    }
    button {
      color: inherit;
    }
  }
  .black-70 {
    color: #bbb;
  }
  .black-60 {
    color: #aaa;
  }
  .bg-black-05 {
    background: #222;
  }
  .hover-bg-black-10:is(:hover, :focus) {
    background: #444;
  }
  .b--black-30 {
    border-color: #333;
  }
  .b--black-20 {
    border-color: #2f2f2f;
  }
  .b--black-10 {
    border-color: #222;
  }
  .bg-white {
    background-color: #111;
  }
  .bg-washed-red {
    background-color: #311;
  }

  .button-reset {
    opacity: 0.7;
  }

  #readme {
    color: var(--copy-color);
    line-height: var(--readme-line-height);
    p, li,
    h1, h2, h3, h4, h5, h6,
    strong, em, del, ins, b, i, s,
    code, pre,
    .highlight {
      color: inherit;
    }
    .highlight {
      code, pre {
        font-size: var(--code-font-size);
        .pl-s, .pl-pds, .pl-s .pl-pse .pl-s1, .pl-sr, .pl-sr .pl-cce, .pl-sr .pl-sre, .pl-sr .pl-sra {
          color: oklch(from #032f62 0.6 c h);
        }
        .pl-e, .pl-en {
          color: oklch(from #6f42c1 0.7 c h);
        }
        .pl-c1, .pl-s .pl-v {
          color: oklch(from #005cc5 0.6 c h);
        }
        .pl-smi, .pl-s .pl-s1, .pl-mi, .pl-mb {
          color: oklch(from #24292e 0.8 c h);
        }
        .pl-corl {
          color: oklch(from #032f62 0.7 c h);
        }
        .gutter {
          color: #eee;
          background: #333;
        }
        .source.gfm {
          color: #bbb;
        }
        .gfm .markup.heading {
          color: #eee;
        }
        .markdown {
          .paragraph {
            color: #bbb;
          }
          .heading {
            color: #eee;
          }
        }
        .keyword, .storage, .storage.type {
          color: oklch(from #222 0.9 c h);
        }
        .entity {
          &.name {
            &.function {
              color: oklch(from #900 0.6 c h);
            }
            &.tag {
              color: oklch(from #008080 0.7 c h);
            }
          }
          &.other {
            &.attribute-name {
              color: oklch(from #458 0.7 c h);
            }
          }
        }
        .string {
          color: oklch(from #d14 0.7 c h);
        }
        .variable {
          color: oklch(from #008080 0.7 c h);
        }
        .support:is(.constant, .function, .type) {
          color: oklch(from #458 0.7 c h);
        }
      }
    }
    .editor-colors {
      .keyword,
      .storage,
      .storage.type {
        color: oklch(from #222 0.7 c h);
      }
      .meta.structure.dictionary.json > .string.quoted.double.json,
      .meta.structure.dictionary.json > .string.quoted.double.json .punctuation.string {
        color: oklch(from #000080 0.6 c h);
      }
      .css.support.property-name {
        color: oklch(from #333 0.8 c h);
      }
      .support.constant,
      .support.function,
      .support.type {
        color: oklch(from #458 0.7 c h);
      }
      .variable {
        color: oklch(from #008080 0.7 c h);
      }
      .constant.language {
        color: oklch(from #606aa1 0.7 c h);
      }
    }
    code, pre {
      background: var(--code-bg);
      font-size: var(--code-font-size);
      word-break: normal !important;
    }
    blockquote {
      background: #222;
      border-color: #333;
    }
    table, tr, th, td {
      border-color: #333;
    }
    td {
      background: #111;
      tr:nth-child(even) & {
        background: #181818;
      }
    }
    th {
      background: #222;
    }
  }

  #tabpanel-explore {
    pre {
      filter: invert(1);
      -webkit-text-stroke: 0.5px;
      code {
        font-size: 13px;
      }
    }
  }

  #tabpanel-readme,
  #tabpanel-dependents,
  #tabpanel-dependencies {
    h2.b--black-10,
    h3.b--black-10 {
      color: #eee;
    }
  }

  [aria-labelledby="package-settings_publishingAccess_radiogroup_label"] {
    background: var(--color-bg-subtle);
  }
  [aria-label="Pagination Navigation"] {
    > div > a {
      color: #eee;
      background: #333;
      border-color: #444;
      &:hover {
        background: #444;
      }
      &[aria-current="true"] {
        background: #777;
      }
    }
  }
  [id="pkg-list-exact-match"] {
    background: #334;
  }
  [aria-owns^="package-tab-readme"] {
    > li {
      a {
        &#package-tab-dependencies {
          color: oklch(from #782075 0.6 c h);
        }
        &#package-tab-dependents {
          color: oklch(from #290089 0.6 c h);
        }
        &#package-tab-versions {
          color: oklch(from #146c91 0.6 c h);
        }
      }
      &:not(:has(a[aria-selected="true"])):hover {
        background: #222;
      }
    }
  }
  #main > .center-ns > .bg-washed-red.b--black-10:has(.b--black-10) code.b--black-30 /* deprecated warning */ {
    background: #222;
  }

  /* docs */
  [style="color: rgb(57, 58, 52); background-color: rgb(246, 248, 250);"],
  [style="color:#393A34;background-color:#f6f8fa"] {
    color: var(--copy-color) !important;
    background: var(--code-bg) !important;
  }
  [style="color: rgb(57, 58, 52);"] {
    color: var(--copy-color) !important;
  }
  [style="color:#393A34"] {
    color: oklch(from #393A34 0.8 c h) !important;
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
