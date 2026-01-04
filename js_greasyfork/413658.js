// ==UserScript==
// @name           Insel Monarchie Keys
// @namespace      http://stefanweidemann.de/im-keys.js
// @description    Insel Monarchie Keys - Tastaturbedienung für Insel Monarchie
// @include        http://*.insel-monarchie.de/*
// @version        1.2.18.10.2020
// @downloadURL https://update.greasyfork.org/scripts/413658/Insel%20Monarchie%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/413658/Insel%20Monarchie%20Keys.meta.js
// ==/UserScript==

/*Copyright (C) 2020 Stefan Weidemann*/


window.addEventListener(
    'load',
    function() {
        function addLabel(obj, text) {
            label = document.createElement("span");
            label.style.color = "#000";
            label.style.backgroundColor = "#FFF";
            label.style.border = "1px solid red";
            label.style.borderRadius = "20%";
            label.innerHTML = text;
            label.style.position = "absolute";
            obj.parentNode.insertBefore(label, obj.nextSibling);
        }

        var _page = document.location.href;
        var $_links = document.getElementsByTagName("a");
        var _keys = new Array(40),
            _keycodes = new Array( /*F1..F12*/ 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
                /*1-9,0*/
                49, 50, 51, 52, 53, 54, 55, 56, 57, 48,
                /*q-p*/
                81, 87, 69, 82, 84, 90, 85, 73, 79, 80,
                /*a-f*/
                65, 83, 68, 70);
        var keymodes = new Array(40);
        var res = new Array(6);
        var ctrl = false;
        var bkeys = "1234567890qwertzuiopasdf";

        for ($i = 0; $i < keymodes.length; $i++) {
            keymodes[$i] = 0;
        }
        for ($i = 0; $i < 12; $i++) {
            keymodes[$i] = 1;
        }

        /*
        for($_i=0; $_i<$_links.length;$_i++) {
          if ($_links[$_i].href.indexOf("isle_back")>0) 
            _keys[0] = $_links[$_i].href;
          if ($_links[$_i].href.indexOf("isle_forward")>0) 
            _keys[1] = $_links[$_i].href;
        }
        */

        // Ressourcen lesen
        tables = document.getElementsByTagName("table");
        restbl = tables[8].getElementsByTagName("td");
        for (i = 0; i < 6; i++) {
            res[i] = restbl[4 + 2 * i].innerHTML;
        }

        // Linke Navigation
        tables = document.getElementsByTagName("table");
        navLinks = tables[5].getElementsByTagName("a");
        for ($_i = 0;
            ($_i < navLinks.length) && ($_i < 10); $_i++) {
            addLabel(navLinks[$_i], "F" + ($_i + 1));
            _keys[$_i] = navLinks[$_i].href;
        }

        // obere Navigation
        navLinks = tables[8].getElementsByTagName("a");
        for ($_i = 0;
            ($_i < navLinks.length) && ($_i < 2); $_i++) {
            addLabel(navLinks[$_i], "F" + ($_i + 11));
            _keys[$_i + 10] = navLinks[$_i].href;
        }

        // Gebäude
        if (_page.indexOf("building") > 0) {
            navLinks = tables[10].getElementsByTagName("form");
            for ($_i = 0;
                ($_i < navLinks.length) && ($_i < 10); $_i++) {
                addLabel(navLinks[$_i], bkeys.substr($_i, 1));
                _keys[$_i + 12] = navLinks[$_i];
                keymodes[$_i + 12] = 2;
            }
        }

        // Forschung
        if (_page.indexOf("forschung") > 0) {
            navLinks = tables[10].getElementsByTagName("form");
            for ($_i = 0;
                ($_i < navLinks.length) && ($_i < 10); $_i++) {
                addLabel(navLinks[$_i], bkeys.substr($_i, 1));
                _keys[$_i + 12] = navLinks[$_i];
                keymodes[$_i + 12] = 2;
            }
        }

        // Kaserne / Einwohner
        if (_page.indexOf("people.php") > 0) {
            navLinks = tables[10].getElementsByTagName("form");
            for ($_i = 0;
                ($_i < navLinks.length) && ($_i < 10); $_i++) {
                addLabel(navLinks[$_i], bkeys.substr($_i, 1));
                _keys[$_i + 12] = navLinks[$_i];
                keymodes[$_i + 12] = 2;
            }
        }

        // Schiffe / Bau
        if (_page.indexOf("werft.php") > 0) {
            navLinks = tables[10].getElementsByTagName("form");
            for ($_i = 0;
                ($_i < navLinks.length) && ($_i < 10); $_i++) {
                addLabel(navLinks[$_i], bkeys.substr($_i, 1));
                _keys[$_i + 12] = navLinks[$_i];
                keymodes[$_i + 12] = 2;
            }
        }

        // Hafen Links oben

        if (_page.indexOf("hafen.php") > 0) {
            navLinks = tables[10].getElementsByTagName("a");
            for ($_i = 0;
                ($_i < navLinks.length) && ($_i < 3); $_i++) {
                addLabel(navLinks[$_i], bkeys.substr($_i + 20, 1));
                _keys[$_i + 32] = navLinks[$_i];
                keymodes[$_i + 32] = 1;
            }
        }



        document.addEventListener("keyup", function(ev) {
            if (ev.keyCode == 17) ctrl = false;
            page = document.location.href;
            for ($_i = 0; $_i < _keycodes.length; $_i++)
                if ((_keycodes[$_i] == ev.keyCode) && (keymodes[$_i] > 0)) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    if (keymodes[$_i] == 1) {
                        document.location.href = _keys[$_i];
                    }
                    if (keymodes[$_i] == 2) {
                        _keys[$_i].submit();
                    }
                    if (keymodes[$_i] == 3) {
                        _keys[$_i].getElementsByTagName("input")[0].select();
                        _keys[$_i].getElementsByTagName("input")[0].focus();
                    }
                }
        }, true);

        document.addEventListener("keydown", function(ev) {
            if (ev.keyCode == 17) ctrl = true;
            for ($_i = 0; $_i < _keycodes.length; $_i++)
                if ((_keycodes[$_i] == ev.keyCode) && (keymodes[$_i] > 0)) {
                    ev.stopPropagation();
                    ev.preventDefault();
                }
        }, true);
    },
    true);