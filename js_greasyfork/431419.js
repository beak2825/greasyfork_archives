// ==UserScript==
// @name         [Deprecated] Campaign CSS Splitter
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Splits the Theming editor into multiple named fields for easier management and adds syntax highlighting
// @author       Salvatos
// @match        https://kanka.io/*/campaign_styles/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/codemirror@5.62.3/lib/codemirror.min.js
// @require      https://cdn.jsdelivr.net/npm/codemirror@5.62.3/mode/css/css.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.56.0/addon/display/autorefresh.min.js
// @resource     SYNTAX_CSS https://cdn.jsdelivr.net/npm/codemirror@5.62.3/lib/codemirror.css
// @resource     THEME_CSS https://cdn.jsdelivr.net/npm/codemirror@5.62.3/theme/darcula.css
// @downloadURL https://update.greasyfork.org/scripts/431419/%5BDeprecated%5D%20Campaign%20CSS%20Splitter.user.js
// @updateURL https://update.greasyfork.org/scripts/431419/%5BDeprecated%5D%20Campaign%20CSS%20Splitter.meta.js
// ==/UserScript==

/* To change your CodeMirror theme, check out the theme reference demo to find one you like:
https://codemirror.net/demo/theme.html
And replace the @resource URL above linking to darcula.css with the appropriate file from jsdelivr:
https://www.jsdelivr.com/package/npm/codemirror?path=theme
Then change the variable below to reflect the new theme’s name: */
const cmTheme = "darcula";

// Load remote CSS for CodeMirror
GM_addStyle(GM_getResourceText("SYNTAX_CSS"));
GM_addStyle(GM_getResourceText("THEME_CSS"));

GM_addStyle(`
#css-split-toggle, #add-css {
  display: inline-block;
  margin-right: 5px;
  font-size: 13px;
  padding: 5px;
  line-height: 1;
}
.CodeMirror {
  border: 2px solid;
  margin-bottom: 10px;
  resize: vertical;
}
input.css-split {
  font-weight: bold;
  border: 0;
  border-bottom: 1px solid;
}
#css-save {
	position: fixed;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	background-color: #d33724;
	z-index: 1080;
	color: whitesmoke;
	padding: 10px;
	font-weight: bold;
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
}
`);

// Name some useful DOM objects
const formGroup = $('form .form-group:nth-child(2)');
const masterTextarea= $('#css');
const saveButtonText = $('.panel-footer button').html(); // For l10n purposes

// Add a toggle button
$(formGroup).append('<button type="button" id="css-split-toggle" field-status="merged">Split CSS sections</button>');
$("#css-split-toggle").click(splitFields);

function splitFields() {
    // If we're merged (default), we need to split
    if ($("#css-split-toggle").attr("field-status") == "merged") {
        // Place current value of master textarea in a delimiter/block array
        let splitCSS = masterTextarea.val().split(/\/\*†(.*)†\*\//); // Delimiter: "/*† Section name †*/"

        // Hide the master textarea from view
        masterTextarea.hide();

        // Make a sortable container for our blocks
        $('<div id="sortable"></div>').insertBefore("#css-split-toggle");

        // Prepare a global array of CodeMirror instances
        window.cmInstance = new Array();

        // Push content into discrete blocks
        // If we have a delimiter at the top AND content after it, ignore the first array entry since it's empty
        let i = (splitCSS[0] == "" && splitCSS[1] !== "") ? 1 : 0;
        for (; i < splitCSS.length; i++) {
            // Even matches are non-delimiters, create a textarea for each
            if (i % 2 == 0) {
                // Make the code block ID linear to facilitate iteration later on
                let linearid = i/2;

                // Create and populate textarea
                if (i == 0) { // Loose code before the first delimiter, give it a delimiter lest everything fall apart
                    $('#sortable').append(`
                        <div class="sortable-item">
                         <details>
                          <summary>
                           <input class="css-split" value="Untitled" size="30" />&nbsp;
                           <i class="fas fa-arrows-alt ui-sortable-handle" title="Drag and drop to change block ordering"></i>
                          </summary>
                          <textarea id="css-` + linearid + `" class="css-split"></textarea>
                         </details>
                        </div>`);
                }
                else { // A delimiter is already set, just append the textarea
                    $('.sortable-item:last-child details').append('<textarea id="css-' + linearid + '" class="css-split"></textarea>');
                }
                // Set value
                $('#css-' + linearid).val(splitCSS[i].trim());

                // Create a CodeMirror instance from textarea
                cmInstance[linearid] = CodeMirror.fromTextArea($('.sortable-item:last-child details textarea:last-child')[0], {
                    mode: "css",
                    autoRefresh: true,
                    indentWithTabs: true,
                    lineWrapping: true,
                    theme: cmTheme
                });
            }
            // Odd matches are delimiters, create a title for each
            else {
                $('#sortable').append(`
                <div class="sortable-item">
                 <details>
                  <summary>
                   <input class="css-split" value="` + splitCSS[i].trim() + `" size="30" />&nbsp;
                   <i class="fas fa-arrows-alt ui-sortable-handle" title="Drag and drop to change block ordering"></i>
                  </summary>
                 </details>
                </div>`);
            }
        }

        // Switch toggle status
        $("#css-split-toggle").attr("field-status", "split");
        $("#css-split-toggle").html("Merge CSS sections");

        // Add warning to Save button and top of screen (todo: actually prevent saving)
        $('.panel-footer button').html("MERGE YOUR CSS BEFORE SAVING!");
        $('.panel-footer button').prop("disabled", true);
        //$('body').append('<div id="css-save">MERGE YOUR CSS BEFORE SAVING!</div>');

        // Make code blocks sortable via Bootstrap
        $("#sortable").sortable({handle: '.fa-arrows-alt'});

        // Add Section button
        $(formGroup).append('<button type="button" id="add-css">Create new section</button>');
        $("#add-css").click(function() {
            let sectionCounter = $('.sortable-item textarea').length + 1;
            $('#sortable').append(`
                <div class="sortable-item">
                 <details>
                  <summary>
                   <input class="css-split" value="Untitled" size="30" />&nbsp;
                   <i class="fas fa-arrows-alt ui-sortable-handle" title="Drag and drop to change block ordering"></i>
                  </summary>
                  <textarea id="css-` + sectionCounter + `" class="css-split"></textarea>
                 </details>
                </div>`);

            // Create a CodeMirror instance from textarea
            cmInstance[sectionCounter] = CodeMirror.fromTextArea($('.sortable-item:last-child details textarea:last-child')[0], {
                mode: "css",
                autoRefresh: true,
                indentWithTabs: true,
                lineWrapping: true,
                theme: cmTheme
            });
        });
    }
    // If we're split, we need to merge
    else if ($("#css-split-toggle").attr("field-status") == "split") {
        // Combine textareas... and delimiters!
        let merged = '';

        $('.css-split').each(function(){
            if ($(this).is("textarea")) {
                let blockID = $(this).attr('id').split(/-/)[1];

                // Save CM value to its textarea, then grab it and pad it with line breaks
                cmInstance[blockID].save();
                merged += '\n' + cmInstance[blockID].getValue() + '\n\n';
            }
            else if ($(this).is("input")) {
                // If we deleted the title, don't add a delimiter; otherwise add the symbols back in
                if ($(this).val().trim().length > 0) {
                    merged += '/*† ' + $(this).val().trim() + ' †*/';
                }
            }
        });

        // Give the master textarea the combined value and show it after removing the blocks and buttons
        masterTextarea.val(merged.trim());
        $('.sortable-item, #add-css, #css-save').remove();
        masterTextarea.show();

        // Switch toggle status
        $("#css-split-toggle").attr("field-status", "merged");
        $("#css-split-toggle").html("Split CSS sections");

        // Restore Save button (todo: actually prevent saving)
        $('.panel-footer button').html(saveButtonText);
        $('.panel-footer button').prop("disabled", false);
    }
}