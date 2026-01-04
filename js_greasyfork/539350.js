// ==UserScript==
// @name         Redirect on Archived.moe
// @version      1.0
// @namespace    Redirect on Archived.moe
// @description  Redirect images and videos from Archived.moe to the proper URL.
// @author       NecRaul
// @license      MIT; https://github.com/NecRaul/archived.moe-redirect/blob/main/LICENSE
// @match        *://archived.moe/*/
// @match        *://archived.moe/*/thread/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archived.moe
// @downloadURL https://update.greasyfork.org/scripts/539350/Redirect%20on%20Archivedmoe.user.js
// @updateURL https://update.greasyfork.org/scripts/539350/Redirect%20on%20Archivedmoe.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const domains = {
    // archive.4plebs.org
    adv: ["archive.4plebs.org", false],
    hr: ["archive.4plebs.org", false],
    o: ["archive.4plebs.org", false],
    pol: ["archive.4plebs.org", false],
    s4s: ["archive.4plebs.org", false],
    sp: ["archive.4plebs.org", false],
    tg: ["archive.4plebs.org", false],
    trv: ["archive.4plebs.org", false],
    tv: ["archive.4plebs.org", false],
    x: ["archive.4plebs.org", false],

    // archiveofsins.com
    h: ["archiveofsins.com", false],
    hc: ["archiveofsins.com", false],
    hm: ["archiveofsins.com", false],
    i: ["archiveofsins.com", false],
    lgbt: ["archiveofsins.com", false],
    r: ["archiveofsins.com", false],
    s: ["archiveofsins.com", false],
    soc: ["archiveofsins.com", false],
    t: ["archiveofsins.com", false],
    u: ["archiveofsins.com", false],

    // boards.fireden.net
    cm: ["boards.fireden.net", false],
    y: ["boards.fireden.net", false],

    // thebarchive.com
    b: ["thebarchive.com", false],
    bant: ["thebarchive.com", false],

    // warosu.org
    3: ["warosu.org", false],
    biz: ["warosu.org", false],
    ck: ["warosu.org", false],
    diy: ["warosu.org", false],
    fa: ["warosu.org", false],
    ic: ["warosu.org", false],
    jp: ["warosu.org", false],
    lit: ["warosu.org", false],
    sci: ["warosu.org", false],

    // arch.b4k.dev
    v: ["arch.b4k.dev", true],
    vg: ["arch.b4k.dev", true],
    vm: ["arch.b4k.dev", true],
    vmg: ["arch.b4k.dev", true],
    vp: ["arch.b4k.dev", true],
    vrpg: ["arch.b4k.dev", true],
    vst: ["arch.b4k.dev", true],

    // archive.palanq.win
    c: ["archive.palanq.win", true],
    e: ["archive.palanq.win", true],
    n: ["archive.palanq.win", true],
    news: ["archive.palanq.win", true],
    out: ["archive.palanq.win", true],
    p: ["archive.palanq.win", true],
    pw: ["archive.palanq.win", true],
    toy: ["archive.palanq.win", true],
    vt: ["archive.palanq.win", true],
    w: ["archive.palanq.win", true],
    wg: ["archive.palanq.win", true],
    wsr: ["archive.palanq.win", true],

    // desuarchive.org
    a: ["desuarchive.org", true],
    aco: ["desuarchive.org", true],
    an: ["desuarchive.org", true],
    cgl: ["desuarchive.org", true],
    co: ["desuarchive.org", true],
    d: ["desuarchive.org", true],
    fit: ["desuarchive.org", true],
    g: ["desuarchive.org", true],
    his: ["desuarchive.org", true],
    int: ["desuarchive.org", true],
    k: ["desuarchive.org", true],
    m: ["desuarchive.org", true],
    mlp: ["desuarchive.org", true],
    mu: ["desuarchive.org", true],
    qa: ["desuarchive.org", true],
    r9k: ["desuarchive.org", true],
    trash: ["desuarchive.org", true],
    vr: ["desuarchive.org", true],
    wsg: ["desuarchive.org", true],
  };

  const board = window.location.pathname.split("/")[1];

  const config = domains[board];

  if (!config) return;

  const [domain, slice] = config;

  document.querySelectorAll(".thread_image_link").forEach((link) => {
    const match = link.href.match(/\/redirect\/(\d+)(\.\w+)$/);
    if (!match) return;

    let filename = match[1];
    const extension = match[2];

    if (slice) filename = filename.slice(0, 13);

    link.href = `https://${domain}/${board}/full_image/${filename}${extension}`;
  });
})();
