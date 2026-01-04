// ==UserScript==
// @name         Colorize Stock Exchange
// @namespace    bzzt
// @version      20211101
// @description  Colorize Stock Exchange individually, stock by stock
// @author       bzzt [2465413]
// @match        https://www.torn.com/page.php?sid=stocks
// @downloadURL https://update.greasyfork.org/scripts/434803/Colorize%20Stock%20Exchange.user.js
// @updateURL https://update.greasyfork.org/scripts/434803/Colorize%20Stock%20Exchange.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // remove or add the "//" comment marker to enable or disable that line
    // each line has three 'things'
    //    the stock ticker for easy identification,
    //    the color wanted use color name from https://html-color-codes.info/color-names/
    //                     or RGB color code from https://html-color-codes.info/
    //    and the corresponding Torn ID. Change only the color!
    // The default Light mode color is "#f2f2f2", Dark mode is "#333333"
    var stocks = new Array(
//      new Array('ASS', '#f2f2f2', 32),
//      new Array('BAG', '#f2f2f2', 27),
//      new Array('CNC', '#f2f2f2', 10),
//      new Array('ELT', '#f2f2f2', 21),
//      new Array('EVL', '#f2f2f2', 28),
//      new Array('EWM', '#f2f2f2', 19),
//      new Array('FHG', '#f2f2f2', 15),
//      new Array('GRN', '#f2f2f2', 6),
//      new Array('HRG', '#f2f2f2', 22),
//      new Array('IIL', '#f2f2f2', 14),
//      new Array('IOU', '#f2f2f2', 5),
//      new Array('IST', '#f2f2f2', 26),
//      new Array('LAG', '#f2f2f2', 4),
//      new Array('LSC', '#f2f2f2', 17),
//      new Array('MCS', '#f2f2f2', 29),
//      new Array('MSG', '#f2f2f2', 11),
//      new Array('MUN', '#f2f2f2', 24),
//      new Array('PRN', '#f2f2f2', 18),
        new Array('SYM', 'DeepPink', 16),
//      new Array('SYS', '#f2f2f2', 3),
//      new Array('TCB', '#f2f2f2', 2),
//      new Array('TCC', '#f2f2f2', 31),
//      new Array('TCM', '#f2f2f2', 20),
//      new Array('TCP', '#f2f2f2', 13),
//      new Array('TCT', '#f2f2f2', 9),
//      new Array('TGP', '#f2f2f2', 23),
//      new Array('THS', '#f2f2f2', 7),
//      new Array('TMI', '#f2f2f2', 12),
//      new Array('TSB', '#f2f2f2', 1),
//      new Array('WLT', '#f2f2f2', 30),
//      new Array('WSU', '#f2f2f2', 25),
//      new Array('YAZ', '#f2f2f2', 8),
        new Array('---', '#000000', -1) // keep editor happy with a final line lacking the comma
    );
    for (var i = 0; i < stocks.length; i++) {
        var row = document.getElementById(stocks[i][2]);
        row.style = "background-color: " + stocks[i][1];
    }
})();
