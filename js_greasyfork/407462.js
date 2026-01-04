// ==UserScript==
// @name         GGn Description prettify
// @namespace    http://tampermonkey.net/
// @version      0.6.0e
// @description  Helper functions for description formatting
// @author       ZeDoCaixao
// @include      https://gazellegames.net/torrents.php?action=edit*
// @include      https://gazellegames.net/upload.php*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @require      https://greasyfork.org/scripts/370520-super-gm-set-and-get/code/Super%20GM%20set%20and%20get.js?version=614650
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/407462/GGn%20Description%20prettify.user.js
// @updateURL https://update.greasyfork.org/scripts/407462/GGn%20Description%20prettify.meta.js
// ==/UserScript==
/* globals jQuery, $ */

"use strict";

function addButton(id, title, callback, textarea_name) {
    var ascii_id = id
        .split('')
        .map(x=>x.charCodeAt(0)).join('_')
    id = "prettify_"+ascii_id+"_"+textarea_name;

    $('textarea[name="' + textarea_name + '"]')
        .after('<input type="button" id="'+id+'" value="'+title+'"/>');
    $('#'+id).click(callback);
}

function get_textarea_names() {
    if (window.location.pathname == '/torrents.php') {
        if (/action=editgroup/.test(window.location.search)) {
            var textarea_names = ["body"];
        } else {
            var textarea_names = ["release_desc"];
        }
    } else {
        var textarea_names = ["album_desc", "release_desc"];
    }
    return textarea_names;
}

function add_macro(a, textarea_name) {
    return function() {
        return add_macro_args(a, textarea_name);
    }
}

function add_user_macro() {
    var button_name = window.prompt("Enter the button name (i.e. Add About):");
    var macro_text = window.prompt("Enter the macro text (i.e. [align=center][b][u]About the game[/u][/b][/align]):");
    console.log("'button_name' = " + button_name + "'macro_text' = " + macro_text);
    if ((button_name == "") || (macro_text == "")) {
        return;
    } else {
        window.alert("Macro successfully added. Refresh page for changes to take effect.");
    }
    var macros = GM_SuperValue.get("user_macros", {});
    macros[button_name] = macro_text;
    GM_SuperValue.set("user_macros", macros);
}

function clear_macros() {
    GM_SuperValue.set("user_macros", {});
    window.alert("Macros successfully cleared. Refresh page for changes to take effect.");
}

function callback_args(callback, textarea_name) {
    return function() {
        return callback(textarea_name);
    }
}

function redraw(macros) {
    var textarea_names = get_textarea_names();
    for (var textarea_name of textarea_names) {
        for (var key in macros) {
            addButton(key, key, add_macro(macros[key], textarea_name), textarea_name);
        }
        addButton("removejunk", "Remove Junk", callback_args(remove_junk, textarea_name), textarea_name);
        addButton("fixfeatures", "Fix Features", callback_args(fix_features, textarea_name), textarea_name);
        addButton("fixabout", "Fix About", callback_args(fix_about, textarea_name), textarea_name);
        addButton("fixreqs", "Fix SR", callback_args(fix_reqs, textarea_name), textarea_name);
        addButton("addabout", "Add About", callback_args(add_about, textarea_name), textarea_name);
        addButton("fixcaps", "Fix common CAPS", callback_args(fix_caps, textarea_name), textarea_name);
        addButton("makeitgood_1", "MAKE IT GOOD!", callback_args(makeitgood, textarea_name), textarea_name);

        addButton("clear_macros", "Clear ALL Macros", clear_macros, textarea_name);
        addButton("add_macro", "Add Macro", add_user_macro, textarea_name);
    }
}

(function() {
    var macros = GM_SuperValue.get("user_macros", {});
    console.log(macros);

    var textarea_names = ["body", "release_desc"];
    var configured = false;
    for (var textarea_name of textarea_names) {
        waitForKeyElements("textarea#" + textarea_name, (element) => {
            redraw(macros);
            configured = true;
        });
    }
    if (! configured) {
        redraw(macros);
    }
})();

function add_macro_args(macro_text, textarea_name) {
  var el = $('textarea[name="' + textarea_name + '"]');

  var cursorPos = $('textarea[name="' + textarea_name + '"]').prop('selectionStart');
  var v = $('textarea[name="' + textarea_name + '"]').val();
  var textBefore = v.substring(0,  cursorPos);
  var textAfter  = v.substring(cursorPos, v.length);

  $('textarea[name="' + textarea_name + '"]').val(textBefore + macro_text + textAfter);
}

function makeitgood(textarea_name) {
    fix_caps(textarea_name);
    remove_junk(textarea_name);
    fix_features(textarea_name);
    fix_about(textarea_name);
    fix_reqs(textarea_name);
    add_about(textarea_name);
}

function fix_caps(textarea_name) {
    var el = $('textarea[name="' + textarea_name + '"]');
    var res = el.val()
        .replace("KEY FEATURES", "KEY FEATURES")
        .replace("FEATURES", "Features")
        .replace("MINIMUM", "Minimum")
        .replace("RECOMMENDED", "Recommended");
    el.val(res);
}

function add_about(textarea_name) {
    var el = $('textarea[name="'+ textarea_name + '"]');
    var about = "[align=center][b][u]About the game[/u][/b][/align]";
    if (el.val().indexOf(about) == -1) {
        el.val(about + "\n" + el.val());
    }
}

function remove_junk(textarea_name) {
    var el = $('textarea[name="' + textarea_name + '"]');
    var res = el.val()
        .replace(/™/g, "")
        .replace(/©/g, "")
        .replace(/®/g, "");
    el.val(res);
}

function get_reqs(textarea_name) {
    return $('textarea[name="' + textarea_name + '"]').val()
        .split("[quote]")[1]
        .split("[/quote]")[0]
        .replace(/.*System requirements.*/gi, "");
}

function set_reqs(s, textarea_name) {
    var el = $('textarea[name="' + textarea_name + '"]');
    var desc = el.val().split("[quote]")[0];
    if ($('.welcome .username').html() != "LinkinsRepeater") {
        if (s.indexOf("[b]Minimum") == 0) { s = "\n" + s; }
    }
    el.val(desc + "[quote][align=center][b][u]System Requirements[/u][/b][/align]\n" + s + "[/quote]");
}

function removebb(s) {
    return s
        .replace("[b]", "")
        .replace("[i]", "")
        .replace("[u]", "")
        .replace("[align]", "")
        .replace("[align=center]", "")
        .replace("[/b]", "")
        .replace("[/i]", "")
        .replace("[/u]", "")
        .replace("[/align]", "")
        .replace("[*]", "");
}

function fix_about(textarea_name) {
    var lines = $('textarea[name="' + textarea_name + '"]').val().split("\n");
    var newcont = "";
    lines.forEach(function(s) {
        s = s.trim();
        var z = s.replace(":", "");
        if (removebb(z).toLowerCase() == "about the game"
           || removebb(z).toLowerCase() == "about this game") {
            s = "[align=center][b][u]About the game[/u][/b][/align]";
        }
        newcont += s + "\n";
    });
    $('textarea[name="' + textarea_name + '"]').val(newcont.trim());
}

function fix_features(textarea_name) {
    var lines = $('textarea[name="' + textarea_name + '"]').val().split("\n");
    var newcont = "";
    lines.forEach(function(s) {
        s = s.trim();
        var z = s.replace(":", "");
        if (removebb(z) == "Features") {
            s = "[align=center][b][u]Features[/u][/b][/align]";
        }
        if (removebb(z) == "Key Features"
           || removebb(z) == "Key features") {
            s = "[align=center][b][u]Key Features[/u][/b][/align]";
        }
        newcont += s + "\n";
    });
    $('textarea[name="' + textarea_name + '"]').val(newcont.trim());
}

function normald(s) {
    if (s.indexOf("[b]Minimum") != -1
       || s.trim().replace(/:$/, "") == "Minimum"
       || s.indexOf("[b]Recommended") != -1
       || s.trim().replace(/:$/, "") == "Recommended") {
        return "[b]"+removebb(s).trim().replace(/:$/, "")+"[/b]";
    }
    s = removebb(s).trim();
    if (s == "") {return "";}
    if (s == "undefined") {return "";}
    s = "[*][b]" + s.replace(":", "[/b]: ");
    return s.replace("  ", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ");
}

function fix_reqs(textarea_name) {
    var reqs = get_reqs(textarea_name).split('\n');
    var newreqs = "";
    reqs.forEach(function(r){ newreqs = newreqs + normald(r) + "\n"; });
    set_reqs(newreqs.trim(), textarea_name);
}
