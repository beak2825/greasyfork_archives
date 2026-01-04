// ==UserScript==
// @name        ToC as side bar
// @namespace   https://franklinyu.name
// @match       https://wiki.archlinux.org/title/*
// @exclude     https://wiki.archlinux.org/title/Special:*
// @grant       GM_addStyle
// @version     0.3
// @author      Franklin Yu
// @description Restrict width and move Table of Content to the right side.
// @downloadURL https://update.greasyfork.org/scripts/397288/ToC%20as%20side%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/397288/ToC%20as%20side%20bar.meta.js
// ==/UserScript==

function main() {
  const toc = document.getElementById('toc')
  const container = document.getElementById('mw-content-text')
  if (!toc) {
    console.info('ToC not found.')
    return
  }

  // TODO: find out why it broke on Firefox.
  if (navigator.userAgent.indexOf('Chrome') === -1) {
    console.warn('Only Chrome is supported now.')
  } else {
    container.append(toc)
  }

  GM_addStyle(`
  #mw-content-text {
    display: flex;
  }
  .mw-parser-output {
    max-width: 850px;
  }
  #mw-content-text > #toc {
    position: sticky;
    top: 10px;
    margin-left: 10px;
    max-height: 95vh;
  }
  #toc > ul {
    max-height: 90vh;
    overflow: auto;
  }
  `)
}

// When there is a Wikitable, typically it would be very wide. Examples:
//   - https://wiki.archlinux.org/title/XDG_Base_Directory
//   - https://wiki.archlinux.org/title/Arch_boot_process
//
// TODO: allow pages where all tables are small
if (document.getElementsByClassName('wikitable').length === 0) {
  main()
}

// QA: To test this page, visit following sites
//   - simple example https://wiki.archlinux.org/title/KVM
//   - long ToC https://wiki.archlinux.org/title/QEMU
//   - Wikitable https://wiki.archlinux.org/title/XDG_Base_Directory
