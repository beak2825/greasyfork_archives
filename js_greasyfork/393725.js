// ==UserScript==
// @name            TexTage Plus / Enhanced IIDX Chart Viewer
// @name:ja         TexTage Plus / Enhanced IIDX Chart Viewer
// @namespace       https://signo.hatenablog.jp/archive/category/Userscript
// @version         0.1.3
// @description     Add some feature to TexTage
// @description:ja  TexTageにいくつかの機能を追加
// @author          signoiidx
// @match           https://textage.cc/score/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/393725/TexTage%20Plus%20%20Enhanced%20IIDX%20Chart%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/393725/TexTage%20Plus%20%20Enhanced%20IIDX%20Chart%20Viewer.meta.js
// ==/UserScript==
(function () {
        'use strict';
        var url = location.href;
        var regex_dp = /\d{16}/;
        var ran_dp = url.match(regex_dp);
        var ran_dp_st = String(ran_dp);
        var ran_dp_str = ran_dp_st.replace(/0/g, "");
        var regex_sp = /\d{8}/;
        var ran_sp = url.match(regex_sp);
        var ran_sp_st = String(ran_sp);
        var ran_sp_str = ran_sp_st.slice(1);
        var regex_play = /(?=\u003f)../;
        var playstyle = url.match(regex_play);
        var playstyle_st = String(playstyle);
        var playstyle_str = playstyle_st.slice(1);
        // Reference https://hkzo.org/2010/10/greasemonkey-xpath/
        function setRANSP(xpath, html) {
                var e = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                var item = e.snapshotItem(0);
                switch (ran_sp_str) {
                case '7654321':
                        item.innerHTML = '+MIRROR \[' + ran_sp_str + '\]';
                        break; // MIRROR
                case '9999999':
                        break; // S-RAN
                case '0000000':
                        break; // ALL-SCR
                default:
                if (ran_dp_str.slice(7) == '1234567'){ // detect R-RAN
                    item.innerHTML = '+R-RANDOM \[' + ran_sp_str + '\]';
                }else{
                    item.innerHTML = '+RANDOM \[' + ran_sp_str + '\]';
                }
                }
        }
        function setRANDP(xpath, html) {
                var e = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                var item = e.snapshotItem(0);
                var ran_dp_1p = ran_dp_str.slice(0, 7);
                var ran_dp_2p = ran_dp_str.slice(7);
                switch (playstyle_str) {
                case 'F': // FLIP
                        item.innerHTML = '+FLIP';
                        break;
                case 'B': // BATTLE
                        item.innerHTML = '+BATTLE';
                        break;
                default:
                        item.innerHTML = ''; // disable TexTage Vanilla outputs
                        break;
                }
                switch (ran_dp_1p) {
                case '1234567': // DEFAULT (正規)
                        break;
                case '7654321': // MIRROR
                        item.innerHTML = item.innerHTML + '+1P MIR\[' + ran_dp_1p + '\]';
                        break;
                case '9999999': // S-RAN
                        item.innerHTML = item.innerHTML + '+S-RANDOM';
                        break;
                case '': // ALL-SCR, 0 digits were removed by ran_dp_str replacement
                        item.innerHTML = item.innerHTML + '+ALL-SCRATCH';
                        break;
                default:
                        item.innerHTML = item.innerHTML + '+1P RAN \[' + ran_dp_1p + '\]';
                }
                switch (ran_dp_2p) {
                case '1234567': // DEFAULT (正規)
                        break;
                case '7654321': // MIRROR
                        item.innerHTML = item.innerHTML + '+2P MIR\[' + ran_dp_2p + '\]';
                        break;
                case '999999999': // S-RAN
                        break;
                case '': // ALL-SCR
                        break;
                default:
                        item.innerHTML = item.innerHTML + '+2P RAN \[' + ran_dp_2p + '\]';
                }
        }
        if (ran_dp_str != 'null') {
                if (playstyle_str.match(/[DBF]/)) {
                        setRANDP('/html/body/nobr/font/font', ran_dp_str);
                } else {
                        setRANSP('/html/body/nobr/font/font', ran_sp_str);
                }
        }
})();