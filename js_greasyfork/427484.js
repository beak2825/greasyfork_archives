// ==UserScript==
// @name         MPP tools
// @description  Room filter/sorting
// @version      0.2.2
// @author       Jakob
// @include      *mppclone.com/*
// @include      *multiplayerpiano.com/*
// @include      *multiplayerpiano.net/*
// @namespace    https://greasyfork.org/users/779512
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427484/MPP%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/427484/MPP%20tools.meta.js
// ==/UserScript==

/* globals MPP, $ */

const filter = /wolf|\brp\b|blm|bts|fna?f|anime|role|autoplay|sans|furry|afton|[üğş]|[一-龯]|[\u3131-\uD79D]|[а-я]|[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/iu;

MPP.client._events.ls.unshift((packet) => {
  packet.u = packet.u.filter(({ _id }) => !filter.test(_id));
  packet.u.sort((a, b) => {
    if (a.banned) return 1;
    if (b.banned) return -1;
    return b.count - a.count;
  });
});
