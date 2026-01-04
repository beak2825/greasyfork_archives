// ==UserScript==
// @name         Golang Playground ACE editor
// @namespace    http://masoudd.ir/
// @version      0.5.1
// @description  Make golang play editor usable. With format and theme support.
// @author       masoud_dot_naservand on google's email
// @match        https://play.golang.org/
// @match        https://play.golang.org/p/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL-3.0
// @supportURL   https://codeberg.org/masoudd/Golang_Playground_ACE_editor
// @copyright    2020, masoudd (https://greasyfork.org/en/users/506611-masoudd)
// @copyright    2018, Teeed (https://openuserjs.org/users/Teeed)
// @downloadURL https://update.greasyfork.org/scripts/400646/Golang%20Playground%20ACE%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/400646/Golang%20Playground%20ACE%20editor.meta.js
// ==/UserScript==

/*
    0.5.1:
        - Fix the things play.golang.org broke
        
    0.5:
        - Devided themes to Bright and Dark groups
        - Changed default theme to solarized_light so it looks like the default go playground theme

    0.4:
        - Updated the ace.js from 1.3.3 to 1.4.9
        - Format button now functions
        - Added theme support

    0.3:
        Also applies to code posted on playground.

    0.2:
        Ctrl + Enter executes script.
*/

(function() {
    'use strict';
    var themes = {"Bright": ["chrome", "clouds", "crimson_editor", "dawn", "dreamweaver",
                             "eclipse", "github", "iplastic", "solarized_light", "textmate",
                             "tomorrow", "xcode", "kuroir", "katzenmilch", "sqlserver"],

                  "Dark"  : ["ambiance", "chaos", "clouds_midnight", "cobalt","dracula",
                             "gob", "gruvbox", "idle_fingers", "kr_theme", "merbivore",
                             "merbivore_soft", "mono_industrial", "monokai", "nord_dark",
                             "pastel_on_dark", "solarized_dark", "terminal", "tomorrow_night",
                             "tomorrow_night_blue", "tomorrow_night_bright",
                             "tomorrow_night_eighties","twilight", "vibrant_ink"],
                 };
    var scrpt = document.createElement('script');
    scrpt.src = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.9/ace.min.js'
    scrpt.type = 'text/javascript';
    scrpt.async = true;
    scrpt.onload = function() {
        // need to set basePath because ace.js can't find it in it's own if we are
        // loading it as ace.min.js
        ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.9");
        var wrap = document.getElementById("wrap")

        var linedTextarea = document.querySelector(".linedtextarea");
        linedTextarea.style.display = 'none'

        var codeArea = document.getElementById("code");
        var currentCode = codeArea.value;

        var editorDiv = document.createElement('div')
        editorDiv.id = "newNiceEditorDiv"
        editorDiv.style.width = '100%'
        editorDiv.style.height = '100%'
        wrap.appendChild(editorDiv);

        var editor = ace.edit("newNiceEditorDiv");
        editor.session.setValue(currentCode);
        editor.session.on('change', function(){
            codeArea.value = editor.session.getValue();
        });

        // need to intercept the call to .val on the textArea
        // in ajax callback for format button to update the contents
        // of editor by the formatted code returned
        const originalVal = $.fn.val;
        $.fn.val = function(x) {
            if (this[0].id === 'code' && x) {
                editor.session.setValue(x);
            }
            return originalVal.apply(this, arguments);
        };

        var savedTheme = GM_getValue('theme', false);
        if (!savedTheme) {
            savedTheme = 'solarized_light';
            GM_setValue('theme', savedTheme);
        }
        var themeLabel = document.createElement('label');
        themeLabel.setAttribute('title', 'Theme');
        var select = document.createElement('select');
        select.setAttribute('id', 'themeSelect');
        for (var group in themes) {
            var optGroup = document.createElement('optgroup');
            optGroup.setAttribute('label', group);
            themes[group].forEach(function(theme) {
                var opt = document.createElement('option');
                opt.setAttribute('value', theme);
                if (theme === savedTheme) {
                    opt.setAttribute('selected', 'true');
                }
                opt.text = theme.replace(/_/g, ' ');
                optGroup.appendChild(opt);
            });
            select.appendChild(optGroup);
        }

        themeLabel.appendChild(select);
        document.getElementById('aboutButton').before(themeLabel);
        select.addEventListener('change', function(e) {
            editor.setTheme(`ace/theme/${this.value}`);
            GM_setValue('theme', this.value);
        });
        // observe the editorDiv element for class attribute change, to catch
        // when the new themes apply and set the color and background-color
        // for #output
        const observeConf = {
            attributes: true,
            attributeFilter: ['class'],
        };
        // the closure
        const observer = new MutationObserver(function(mlist, obs) {
            var color = '';
            var backgroundColor = '';
            const output = document.getElementById('output');
            return function(mlist, obs) {
                var cs = getComputedStyle(editorDiv);
                if (color !== cs.color || backgroundColor !== cs.backgroundColor) {
                    color = cs.color;
                    backgroundColor = cs.backgroundColor;
                    output.setAttribute('style', `color: ${color}; background-color: ${backgroundColor}`);
                }
            }
        }());
        observer.observe(editorDiv, observeConf);



        editor.setTheme(`ace/theme/${savedTheme}`);
        editor.session.setMode("ace/mode/golang");

        editorDiv.style.fontSize='16px';

        function doSubmit() {
            document.getElementById('run').click()
        }

        window.addEventListener("keypress", function(e) {
            if(e.ctrlKey && e.key == 'Enter') {
                doSubmit()
            }
        }, false);

    }
    document.head.appendChild(scrpt);



    GM_addStyle ( `
#wrap {
padding: 0;
background: none;
}
select {
    height: 30px;
    border: 1px solid #375EAB;
    font-size: 16px;
    font-family: sans-serif;
    background: #375EAB;
    color: white;
    position: static;
    top: 1px;
    border-radius: 5px;
    padding-left: 1em;
}
`);
})();
