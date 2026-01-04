// ==UserScript==
// @name         Google Font Size Reversion
// @namespace    https://greasyfork.org/users/163468
// @version      0.0.2
// @description  Get back the former font size in google search
// @author       winderica
// @include      http://www.google.*/search*
// @include      https://www.google.*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388722/Google%20Font%20Size%20Reversion.user.js
// @updateURL https://update.greasyfork.org/scripts/388722/Google%20Font%20Size%20Reversion.meta.js
// ==/UserScript==
(() => {
    'use strict';
    const css = `
        .f, .f a:link, .m, .osl a, .st, .r, .rc .s, .P1usbc, .TbwUpd, .knowledge-panel.kp-blk .mod, .c14z5c .mod, .cbphWd {
            line-height: 1.54;
        }
        .g, body, html, input, .std, h1 {
            font-size: small;
        }
        #res h3, #extrares h3, .e2BEnf, .garHBe {
            font-size: 18px;
            line-height: 1.33;
        }
        .g {
            margin-bottom: 26px;
        }
        .iUh30 {
            font-size: 14px;
            line-height: 1.43;
        }
        .r a.fl {
            font-size: 14px;
        }
        .dPAwzb, .dPAwzb a {
            line-height: 1.33;
        }
        .TbwUpd a.fl {
            font-size: 14px;
        }
        .Uekwlc {
            font-size: 13px;
        }
        .LC20lb {
            line-height: 1.33;
        }
        .TbwUpd {
            padding-bottom: 1px;
        }
        .JolIg {
            font-size: 18px;
            line-height: 1.33;
        }
        .kcHZBe {
            line-height: 1.375;
        }
        .gv607c:link, .gv607c:visited {
            line-height: 1.43;
        }
        .fm06If .NA6bn, .HSryR .NA6bn, .c2xzTb .ILfuVd.duSGDe, .c2xzTb .NA6bn.c3biWd {
            font-size: 13px;
            line-height: 1.54;
        }
        .LjTgvd .rjOVwe.ILfuVd {
            font-size: 13px;
        }
    `;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.body.appendChild(style);
})();