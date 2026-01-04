// ==UserScript==
// @name         Colored Shade
// @version      24.12.27.1
// @description  Make connected shaded cell groups colorful to check connectivity.
// @author       Leaving Leaves
// @match        https://puzz.link/p*
// @match        https://pzplus.tck.mn/p*
// @match        https://pzprxs.vercel.app/p*/*
// @match        http://pzv.jp/p*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=puzz.link
// @license      GPL
// @namespace    https://greasyfork.org/users/1192854
// @downloadURL https://update.greasyfork.org/scripts/479410/Colored%20Shade.user.js
// @updateURL https://update.greasyfork.org/scripts/479410/Colored%20Shade.meta.js
// ==/UserScript==

'use strict';
let done = false;
let main = function () {
    if (done) { return; }
    done = true;
    ui.puzzle.config.set("autocmp", true);
    ui.puzzle.config.set("multierr", true);
    ui.puzzle.config.set("irowake", true);
    ui.puzzle.config.set("irowakeblk", true);
    ui.puzzle.config.set("disptype_yajilin", 2);    // better vision of Yajilin
    ui.puzzle.config.set("disptype_bosanowa", 3);    // better vision of Bosanowa
    ["autocmp", "autoerr", "irowake", "irowakeblk"].forEach(type => {
        for (let t in ui.puzzle.config.list[type].variety) { ui.puzzle.config.set(type + "@" + t, true); }
    })
    if (!document.querySelector(".config[data-config='irowake']").getElementsByTagName("input")[0].checked) {
        document.querySelector(".config[data-config='irowake']").getElementsByTagName("input")[0].click();
    }

    localStorage.setItem('pzprv3_config:ui', '{"autocheck_mode":"simple"}');

    const GENRENAME = ui.puzzle.info.en;
    const checklist = ui.puzzle.checker.checklist_normal;
    const isOrthoConnected = checklist.some(f => f.name === "checkConnectShade");
    const isDiagConnected =
        checklist.some(f => f.name === "checkAdjacentShadeCell") &&
        checklist.some(f => f.name === "checkConnectUnshadeRB" || f.name === "checkConnectUnshade");
    // color those Os and Xs
    if (["numexist", "subcircle"].some(str => ui.puzzle.mouse.getInputModeList().includes(str)) && ui.puzzle.painter.getBGCellColor.name === "getBGCellColor_error1") {
        ui.puzzle.painter.getBGCellColor = ui.puzzle.pzpr.common.Graphic.prototype.getBGCellColor_qsub2;
    }
    // better vision of connectivity
    if (isDiagConnected) {
        // for sblkdiag, now it's not often used and may cause confusion
        // if (ui.puzzle.board.sblkdiagmgr) {
        //     ui.puzzle.board.sblkdiagmgr.coloring = true;
        //     ui.puzzle.painter.getShadedCellColor = my_getShadedCellColor;
        // } else {
        let instance = new ui.puzzle.board.klass.AreaShadeGraph();
        instance.enabled = true;
        let board = ui.puzzle.board;
        board.infolist.push(instance);
        board.sblkmgr = instance;
        board.sblkmgr.getSideObjByNodeObj = my_getSideObjByNodeObj;
        board.rebuildInfo();
        // }
    }
    if (isOrthoConnected || isDiagConnected) {
        ui.puzzle.config.list.irowakeblk.val = true;
        ui.puzzle.painter.irowakeblk = true;
        ui.puzzle.board.sblkmgr.coloring = true;
        ui.puzzle.painter.labToRgbStr = (function () {
            let origin_labToRgbStr = ui.puzzle.painter.labToRgbStr;
            return function () {
                arguments[0] = arguments[0] * 0.9; // change l in (l,a,b)
                return origin_labToRgbStr.apply(this, arguments);
            }
        })();
        // make the option visible
        document.querySelector(".config[data-config='irowakeblk']").style = '';
        if (!document.querySelector(".config[data-config='irowakeblk']").getElementsByTagName("input")[0].checked) {
            document.querySelector(".config[data-config='irowakeblk']").getElementsByTagName("input")[0].click();
        }
    }
};
ui.puzzle.on('ready', main, false);
let initTimer = setInterval(() => {
    if (done) {
        clearInterval(initTimer);
        return;
    }
    main();
}, 1000);

function my_getSideObjByNodeObj(c) {
    let bx = c.bx;
    let by = c.by;
    let list = [];
    let board = ui.puzzle.board;
    for (let dx = -2; dx <= 2; dx += 2) {
        for (let dy = -2; dy <= 2; dy += 2) {
            if (dx !== 0 || dy !== 0) {
                list.push(board.getc(bx + dx, by + dy));
            }
        }
    }
    if (list.some(c => c.isnull)) {
        list = list.filter(c => !c.isnull);
        let fn = cc => { if (!list.includes(cc)) list.push(cc); };
        for (let i = board.minbx + 1; i <= board.maxbx - 1; i += 2) {
            fn(board.getc(i, board.minby + 1));
            fn(board.getc(i, board.maxby - 1));
        }
        for (let j = board.minby + 1; j <= board.maxby - 1; j += 2) {
            fn(board.getc(board.minbx + 1, j));
            fn(board.getc(board.maxbx - 1, j));
        }
    }
    list = list.filter(c => board.sblkmgr.isnodevalid(c));
    return list;
}

function my_getShadedCellColor(c) {
    if (c.qans !== 1)
        return null;
    var t = c.error || c.qinfo;
    if (t === 1) { return ui.puzzle.painter.errcolor1; }
    if (t === 2) { return ui.puzzle.painter.errcolor2; }
    if (c.trial) { return ui.puzzle.painter.trialcolor; }
    // change from sblk to blkdiag
    if (ui.puzzle.execConfig("irowakeblk")) { return c.blkdiag.color; }
    return ui.puzzle.painter.shadecolor;
}
