// ==UserScript==
// @name         缴费平台
// @namespace    http://tampermonkey.net/
// @description  武汉理工大学缴费平台马房山学生电费自动选择寝室房间
// @icon         https://www.ygb.sdu.edu.cn/__local/9/E7/0F/331A1B05CAA091F3D0D449F33AC_F12234D9_7045F.png
// @version      0.1
// @author       smili
// @license      MIT
// @match        *://cwsf.whut.edu.cn/nyyPayElecPages51274E035
// @match        *://cwsf.whut.edu.cn/MNetWorkUI/nyyPayElecPages51274E035
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/475794/%E7%BC%B4%E8%B4%B9%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/475794/%E7%BC%B4%E8%B4%B9%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const _ = GM_getValue("_") || {};
    const areaid = _.areaid || "-1";
    const areaEl = $("#areaid");
    const config = ["building", "floorid", "roomid"].map(i => ({
        n: i,
        e: $("#" + i),
        v: _[i] || "-1"
    }));
    GM_registerMenuCommand("保存", () => {
        _.areaid = areaEl.val();
        config.forEach(i => { _[i.n] = i.e.val(); });
        GM_setValue("_", _);
    });
    areaEl.on("DOMNodeInserted", e => {
        if ($(e.originalEvent.target).val() === areaid) {
            areaEl.off("DOMNodeInserted").val(areaid).change();
            for (let i of config) {
                i.e.val(i.v).change();
            }
        }
    });
})();