// ==UserScript==
// @name         Overleaf fileswitcher (no longer maintained)
// @namespace    http://tampermonkey.net/
// @version      1.22
// @license      apache2
// @description  Custom hotkeys for switching between files on overleaf.com
// @author       Aditya Sriram
// @match        https://www.overleaf.com/project/*
// @grant        none
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.1/mousetrap.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.1/plugins/global-bind/mousetrap-global-bind.min.js
// @downloadURL https://update.greasyfork.org/scripts/387109/Overleaf%20fileswitcher%20%28no%20longer%20maintained%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387109/Overleaf%20fileswitcher%20%28no%20longer%20maintained%29.meta.js
// ==/UserScript==

(function($, undefined) {
    // list of allowed extensions (skip files that don't match)
    var filetypes = ['tex', 'bib', 'txt', 'pdf', 'cls', 'sty', 'png/jpg'];
    var allow_ext = ['tex', 'bib', 'txt']; // in lowercase
    var prev_file = undefined;
    var cur_file = undefined;
    var allow_all_types = false;

    var shortcuts = {};

    function keybindg(key, desc, func) {
        shortcuts[key] = desc;
        Mousetrap.bindGlobal(key, function() {
            console.log("triggered " + key);
            func();
        });
    }

    function getFileName(i,e) {
        if (typeof(e) === "undefined") e = i;
        return $(e).find('span.ng-binding').eq(0).text().trim();
    }

    function getFilePath(file) {
        var parents = file.parents('file-entity');
        return parents.map(getFileName).get().reverse();
    }

    function matchExtension(i, f) {
        var fname = getFileName(f);
        if (allow_all_types) return true;
        for (var exts of allow_ext) {
            for (var ext of exts.split("/")) {
                if (fname.toLowerCase().endsWith(ext))
                    return true;
            }
        }
        return false;
    }

    function getFileList() {
        return $('file-entity:not(:has(div[ng-controller]))');
    }

    function getCurrentFile() {
        var files = getFileList();
        var current = files.filter(':has(.selected)');
        if (current.length == 0) {
            return undefined;
        } else {
            return current.eq(0);
        }
    }

    function resizePanes() {
        $('a.custom-toggler-west')[0].click();
        $('a.custom-toggler-west')[0].click();
    }

    function dispFile(file) {
        var filename = getFileName(file);
        var filepath = getFilePath(file);
        $('#monkey-filename').text("/" + filepath.concat(filename).join("/"));
    }

    function focusFile(file) {
        prev_file = cur_file;
        file.find('li:not(.ng-scope)').eq(0).click(); // click li to focus file
        cur_file = file;
        dispFile(file);
        resizePanes();
    }

    function switchFile(n) {
        var files = getFileList();
        files = files.filter(matchExtension);

        var curidx = files.index(getCurrentFile());
        if (curidx < 0) {
            curidx = 0;
            console.log('no filtered file selected, falling back to first file');
        }

        var newidx = curidx+n;
        if (newidx >= files.length) newidx = 0;
        if (newidx < 0) newidx = files.length-1;

        var newfile = files.eq(newidx);
        focusFile(newfile);
    }

    function encloser(cmd) {
        var fn = function(editor) {
            var selection = editor.getSelection();
            if (selection.isEmpty()) {
                editor.insert("\\" + cmd + "{}");
                return editor.navigateLeft(1);
            }
            var text = editor.getCopyText();
            return editor.insert("\\" + cmd + "{" + text + "}");
        }
        return fn;
    }

    function fileTypeSelector() {
        var cursetting = filetypes.map((s,i) => i+1+". "+((allow_ext.includes(s) || allow_all_types) ? s + '*' : s));
        var ans = prompt("Select the file types to allow or type 'all'\n" + cursetting.join("\n"));
        if (ans && ans.trim().length > 0) {
            allow_all_types = (ans.trim() == "all");
            allow_ext = [];
            for (var c of ans) {
                if ('0123456789'.includes(c) !== -1 && parseInt(c) <= filetypes.length)
                    allow_ext.push(filetypes[parseInt(c)-1]);
            }
        }
    }

    function init() {
        console.log("activating custom overleaf hotkeys...");
        var editor = ace.edit($('.ace-editor-body')[0]);
        //console.log(editor);
        // replace italics hotkey function with custom emphasize function
        editor.commands.byName['italics'].exec = encloser('emph');
        // ctrl-m to insert '\text'
        editor.commands.addCommand({
            name: "mathmode",
            bindKey: {
                win: "Ctrl-M",
                mac: "Command-M"
            },
            exec: encloser('text'),
            readOnly: !1
        });

        // add span to display file path
        $('span.name.ng-binding').parent().after('<span id="monkey-filename" style="color:white;"></span>');
        // on click filepath, show filetype selector
        $('#monkey-filename').css("cursor", "pointer").click(fileTypeSelector);

        prev_file = cur_file = getCurrentFile();
        dispFile(getCurrentFile());

        // add eventlistener to detect file change due to manual user click
        $('aside.file-tree').on('click', 'file-entity li.ng-scope', function() {
            if (getFileName(getCurrentFile()) != getFileName(cur_file)) {
                console.log("manual file change detected");
                prev_file = cur_file;
                cur_file = getCurrentFile();
                dispFile(getCurrentFile());
            }
        });

        keybindg('ctrl+shift+pageup', 'Previous File', function() {switchFile(-1);});
        keybindg('ctrl+shift+pagedown', 'Next File', function() {switchFile(+1);});
        keybindg('ctrl+shift+,', 'Previous File', function() {switchFile(-1);});
        keybindg('ctrl+shift+.', 'Next File', function() {switchFile(1);});
        keybindg('ctrl+shift+/', 'Past File', function() {focusFile(prev_file);});
        console.log('hotkeys:', JSON.parse(JSON.stringify(shortcuts)));
    }

    function wait_to_load(callback) {
        if ($('.loading-screen-brand').length > 0) {
            console.log("still loading");
            window.setTimeout(wait_to_load, 500, callback);
        } else {
            console.log("detected loading completion");
            window.setTimeout(callback, 200);
        }
    }

    $(document).ready(function() {
        wait_to_load(init);
    });

})(window.jQuery.noConflict(true));
