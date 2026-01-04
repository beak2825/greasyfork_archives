// ==UserScript==
// @name         WaniKani Markdown Notes
// @namespace    rfindley
// @description  Allows you to write Markdown in the notes, which will be rendered as HTML when the page loads.
// @version      1.4
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/1.3.0/showdown.min.js
// @include      https://www.wanikani.com/level*
// @include      https://www.wanikani.com/radical*
// @include      https://www.wanikani.com/kanji*
// @include      https://www.wanikani.com/vocabulary*
// @include      https://www.wanikani.com/review/session*
// @copyright    2013, Jeshua
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380377/WaniKani%20Markdown%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/380377/WaniKani%20Markdown%20Notes.meta.js
// ==/UserScript==

wkmdnotes = {};

(function() {
    
    /**
    * Render the given markdown text.
    */
    function render(text) {
        // Do some custom replacements.
        text = text.replace(/#k#/g, '<span class="kanji-highlight highlight-kanji" rel="tooltip" data-original-title="Kanji">');
        text = text.replace(/#\/k#/g, '</span>');

        text = text.replace(/#c#/g, '<span class="radical-highlight highlight-radical" rel="tooltip" data-original-title="Radical">');
        text = text.replace(/#\/c#/g, '</span>');

        text = text.replace(/#r#/g, '<span class="reading-highlight highlight-reading" rel="tooltip" data-original-title="Reading">');
        text = text.replace(/#\/r#/g, '</span>');

        text = text.replace(/#v#/g, '<span class="vocabulary-highlight highlight-vocabulary" rel="tooltip" data-original-title="Vocabulary">');
        text = text.replace(/#\/v#/g, '</span>');

        text = text.replace(/#kan#/g, '<span class="kanji-highlight highlight-kanji" rel="tooltip" data-original-title="Kanji">');
        text = text.replace(/#\/kan#/g, '</span>');

        text = text.replace(/#rad#/g, '<span class="radical-highlight highlight-radical" rel="tooltip" data-original-title="Radical">');
        text = text.replace(/#\/rad#/g, '</span>');

        text = text.replace(/#read#/g, '<span class="reading-highlight highlight-reading" rel="tooltip" data-original-title="Reading">');
        text = text.replace(/#\/read#/g, '</span>');

        text = text.replace(/#voc#/g, '<span class="vocabulary-highlight highlight-vocabulary" rel="tooltip" data-original-title="Vocabulary">');
        text = text.replace(/#\/voc#/g, '</span>');

        // Render the rest as markdown.
        return (new showdown.Converter()).makeHtml(text);
    }

    /**
    * Find all of the tooltips in the given container and tooltipify them.
    */
    function activateTooltips(container) {
        if (container.tooltip) {
            container.find('span[rel="tooltip"]').tooltip();
        }
    }

    /**
    * Setup the given note field with the required callbacks.
    */
    function setupNoteField(note) {
        // Save the markdown and render the content.
        var html = note.html();
        if (typeof html === 'undefined') html = '';
        note.data('noteContent', html.replace(/<br>/g,'\n'));
        note.html(render(html));
        activateTooltips(note);

        note.click(function(e) {
            if (e.target.tagName.toLowerCase() === 'textarea') {
                return;
            }

            // If the target is the div, they are going from display --> edit.
            if (e.target.tagName.toLowerCase() !== 'button') {
                var interval = setInterval(function() {
                    // If we can find a textarea, they must have clicked to edit the text field.
                    // So, we want to display the markdown content.
                    if (note.find('textarea')) {
                        clearInterval(interval);
                        if (note.data('noteContent') === 'Click to add note') {
                            note.find('textarea').val('');
                        } else {
                            note.find('textarea').val(note.data('noteContent'));
                        }
                    }
                }, 50);
            } 

            // Otherwise, they are going from edit --> display.
            else {
                var textarea = note.find('textarea');
                var str = textarea.val().replace(/\n/g,'\n');
                textarea.html(str);
                var interval = setInterval(function() {
                    // Keep waiting until there is no text area. Then, save the changed markdown
                    // value to the data. Also re-render the note.
                    if (note.find('textarea').length === 0) {
                        clearInterval(interval);
                        note.data('noteContent', note.html().replace(/<br>/g,'\n'));
                        note.html(render(note.html()));
                        activateTooltips(note);
                    }
                }, 50);
            }        
        });
    }
    
    function main() {
        // Convert the text in the meaning note.
        var noteFields = ['.note-meaning', '.note-reading'];
        $.each(noteFields, function(i, noteSelector) {
            // During reviews, we have to wait for the field to be added to the dom first.
            // Then, we can add a listener to the note selector.
            $('#option-item-info').click(function() {
                var interval = setInterval(function() {
                    if ($(noteSelector).length !== 0) {
                        clearInterval(interval);
                        setupNoteField($(noteSelector));
                    }
                }, 50);
            });

            // Setup the note field if it is on the page already.
            setupNoteField($(noteSelector));
        });
    }
    
    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        main();
    else
        window.addEventListener("load", main, false);
})(wkmdnotes);