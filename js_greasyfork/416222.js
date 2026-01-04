// ==UserScript==
// @name         Feuerwerk Forum - Farbwechsel invertiert
// @namespace    https://greasyfork.org/users/156194
// @version      0.4
// @description  Farbwechsel Test invertiert
// @author       rabe85
// @match        https://www.feuerwerk-forum.de/thema/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416222/Feuerwerk%20Forum%20-%20Farbwechsel%20invertiert.user.js
// @updateURL https://update.greasyfork.org/scripts/416222/Feuerwerk%20Forum%20-%20Farbwechsel%20invertiert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function farbwechsel() {

        // https://www.w3.org/WAI/GL/wiki/Relative_luminance
        function Luminescence(r, g, b) {

            var rs = r/255;
            var gs = g/255;
            var bs = b/255;
            var rr = 0;
            var gg = 0;
            var bb = 0;

            rs <= 0.03928 ? rr = rs/12.92 : rr = ((rs+0.055)/1.055) ** 2.4;

            gs <= 0.03928 ? gg = gs/12.92 : gg = ((gs+0.055)/1.055) ** 2.4;

            bs <= 0.03928 ? bb = bs/12.92 : bb = ((bs+0.055)/1.055) ** 2.4;

            var lumi = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
            return lumi;
        }

        var farbaenderungen_reset_script_start = document.createElement('script');
        var farbaenderungen_reset_script_function = document.createTextNode('function farbaenderungen_reset(post_id) { var farbaenderungen_reset = 0; var post_farbe_reset0 = document.querySelectorAll(\'span[data-farbaenderung="\' + post_id + \'"]\'); for(var pfr = 0, post_farbe_reset; !!(post_farbe_reset=post_farbe_reset0[pfr]); pfr++) { var post_farbe_reset_style = post_farbe_reset.getAttribute(\'style\'); post_farbe_reset.setAttribute(\'style\', post_farbe_reset_style.substr(0,post_farbe_reset_style.length-25)); farbaenderungen_reset++; } document.getElementById(\'farbaenderungen_set1_\' + post_id).innerHTML = farbaenderungen_reset == 1 ? \'kann\' : \'k&ouml;nnen\'; document.getElementById(\'farbaenderungen_set2_\' + post_id).innerHTML = \' werden\'; document.getElementById(\'farbaenderungen_set3_\' + post_id).innerHTML = \'Ausf&uuml;hren\'; document.getElementById(\'farbaenderungen_set3_\' + post_id).setAttribute(\'onclick\', \'farbaenderungen_set(\' + post_id + \');\'); }');
        farbaenderungen_reset_script_start.appendChild(farbaenderungen_reset_script_function);
        document.head.appendChild(farbaenderungen_reset_script_start);

        var farbaenderungen_set_script_start = document.createElement('script');
        var farbaenderungen_set_script_function = document.createTextNode('function farbaenderungen_set(post_id) { var farbaenderungen_set = 0; var post_farbe_set0 = document.querySelectorAll(\'span[data-farbaenderung="\' + post_id + \'"]\'); for(var pfs = 0, post_farbe_set; !!(post_farbe_set=post_farbe_set0[pfs]); pfs++) { var post_farbe_set_style = post_farbe_set.getAttribute(\'style\'); post_farbe_set.setAttribute(\'style\', post_farbe_set_style + \';color: unset !important;\'); farbaenderungen_set++; } document.getElementById(\'farbaenderungen_set1_\' + post_id).innerHTML = farbaenderungen_set == 1 ? \'wurde\' : \'wurden\'; document.getElementById(\'farbaenderungen_set2_\' + post_id).innerHTML = \'\'; document.getElementById(\'farbaenderungen_set3_\' + post_id).innerHTML = \'R&uuml;ckg&auml;ngig\'; document.getElementById(\'farbaenderungen_set3_\' + post_id).setAttribute(\'onclick\', \'farbaenderungen_reset(\' + post_id + \');\'); }');
        farbaenderungen_set_script_start.appendChild(farbaenderungen_set_script_function);
        document.head.appendChild(farbaenderungen_set_script_start);

        /*
        function farbaenderungen_reset(post_id) {
            var farbaenderungen_reset = 0;
            var post_farbe_reset0 = document.querySelectorAll('span[data-farbaenderung="' + post_id + '"]');
            for(var pfr = 0, post_farbe_reset; !!(post_farbe_reset=post_farbe_reset0[pfr]); pfr++) {
                var post_farbe_reset_style = post_farbe_reset.getAttribute('style');
                post_farbe_reset.setAttribute('style', post_farbe_reset_style.substr(0,post_farbe_reset_style.length-25));
                farbaenderungen_reset++;
            }
            document.getElementById('farbaenderungen_set1_' + post_id).innerHTML = farbaenderungen_reset == 1 ? 'kann' : 'k&ouml;nnen';
            document.getElementById('farbaenderungen_set2_' + post_id).innerHTML = ' werden';
            document.getElementById('farbaenderungen_set3_' + post_id).innerHTML = 'Ausf&uuml;hren';
            document.getElementById('farbaenderungen_set3_' + post_id).setAttribute('onclick', 'farbaenderungen_set(' + post_id + ');');
        }
        function farbaenderungen_set(post_id) {
            var farbaenderungen_set = 0;
            var post_farbe_set0 = document.querySelectorAll('span[data-farbaenderung="' + post_id + '"]');
            for(var pfs = 0, post_farbe_set; !!(post_farbe_set=post_farbe_set0[pfs]); pfs++) {
                var post_farbe_set_style = post_farbe_set.getAttribute('style');
                post_farbe_set.setAttribute('style', post_farbe_set_style + ';color: unset !important;');
                farbaenderungen_set++;
            }
            document.getElementById('farbaenderungen_set1_' + post_id).innerHTML = farbaenderungen_set == 1 ? 'wurde' : 'wurden';
            document.getElementById('farbaenderungen_set2_' + post_id).innerHTML = '';
            document.getElementById('farbaenderungen_set3_' + post_id).innerHTML = 'R&uuml;ckg&auml;ngig';
            document.getElementById('farbaenderungen_set3_' + post_id).setAttribute('onclick', 'farbaenderungen_reset(' + post_id + ');');
        }
        */

        var post_inhalt0 = document.getElementsByClassName('messageInfo primaryContent');
        for(var p = 0, post_inhalt; !!(post_inhalt=post_inhalt0[p]); p++) {

            var farbaenderungen = 0;
            var postid = '';
            postid = post_inhalt.querySelector('a[title="Permalink"]').getAttribute('data-href').split('/')[1];

            var post_span0 = post_inhalt.querySelectorAll('span[style*="color"]');
            for(var s = 0, post_span; !!(post_span=post_span0[s]); s++) {

                if(post_span.length !== 0) {

                    var backgroundcolor = window.getComputedStyle( post_inhalt ,null).getPropertyValue('background-color'); // rgb(0, 0, 0)
                    let sep_backgroundcolor = backgroundcolor.indexOf(',') > -1 ? ',' : ' '; // Choose correct separator
                    backgroundcolor = backgroundcolor.substr(4).split(')')[0].split(sep_backgroundcolor); // Turn 'rgb(r,g,b)' into [r,g,b]
                    var lumi_backgroundcolor = Luminescence(backgroundcolor[0],backgroundcolor[1],backgroundcolor[2]);
                    //alert('bg' + lumi_backgroundcolor);

                    var textcolor = window.getComputedStyle( post_span ,null).getPropertyValue('color'); // rgb(0, 0, 0)
                    let sep_textcolor = textcolor.indexOf(',') > -1 ? ',' : ' '; // Choose correct separator
                    textcolor = textcolor.substr(4).split(')')[0].split(sep_textcolor); // Turn 'rgb(r,g,b)' into [r,g,b]
                    var lumi_textcolor = Luminescence(textcolor[0],textcolor[1],textcolor[2]);
                    //alert('tx' + lumi_textcolor);

                    var ratio = 0;
                    ratio = lumi_backgroundcolor >= lumi_textcolor ? (lumi_backgroundcolor+0.05)/(lumi_textcolor+0.05) : (lumi_textcolor+0.05)/(lumi_backgroundcolor+0.05);

                    //alert(ratio);
                    if(ratio < 2.5) {
                        post_span.setAttribute('data-farbaenderung', postid);
                        farbaenderungen++;
                    }

                }

            }

            var messagedetails = post_inhalt.getElementsByClassName('messageDetails')[0];
            if(messagedetails && farbaenderungen) {
                messagedetails.insertAdjacentHTML('beforeend', '<div id="farbaenderungen_' + postid + '" class="muted"><i class="fa fa-info-circle" aria-hidden="true"></i> Zur besseren Lesbarkeit ' + (farbaenderungen == 1 ? '<span id="farbaenderungen_set1_' + postid + '">kann</span> ' + farbaenderungen + ' Textfarbe' : '<span id="farbaenderungen_set1_' + postid + '">k&ouml;nnen</span> ' + farbaenderungen + ' Textfarben') + ' aus diesem Beitrag entfernt<span id="farbaenderungen_set2_' + postid + '"> werden</span>. <span id="farbaenderungen_set3_' + postid + '" style="cursor: pointer;" onclick="farbaenderungen_set(' + postid + ');">Ausf&uuml;hren</span></div>');
            }

        }

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        farbwechsel();
    } else {
        document.addEventListener('DOMContentLoaded', farbwechsel, false);
    }

})();