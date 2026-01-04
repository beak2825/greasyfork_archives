// ==UserScript==
// @name Mydealz Enhanced Comment Editor
// @namespace mydealz-enhanced-editor
// @version 1.3
// @description Erweitert den Kommentar-Editor um zusätzliche Formatierungsoptionen
// @match https://www.mydealz.de/*
// @exclude https://www.mydealz.de/*/edit*
// @exclude https://www.mydealz.de/*/add*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522856/Mydealz%20Enhanced%20Comment%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/522856/Mydealz%20Enhanced%20Comment%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForEditor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const editors = document.querySelectorAll('.tools-wrapper .toolbar');
                editors.forEach(editor => {
                    if (!editor.dataset.enhanced) {
                        enhanceEditor(editor);
                        editor.dataset.enhanced = 'true';
                    }
                });
            });
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function zitieren() {
        const p = document.querySelector('[parentcommentid]');
        if (!p) {
            alert('Erst auf "Antworten" klicken\ndann den Zitieren-Button nutzen');
            return;
        }

        const i = p.getAttribute('parentcommentid');
        if (!i) {
            alert('Keine gültige Kommentar ID');
            return;
        }

        fetch("https://www.mydealz.de/graphql", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: 'query comment($id:ID!){comment(id:$id){preparedHtmlContent createdAt createdAtTs}}',
                variables: {id: i}
            })
        })
        .then(r => r.json())
        .then(d => {
            let html = d.data.comment.preparedHtmlContent;
            let imgCount = 1;
            html = html.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, (match,src) => {
                if (!src.includes('.jpg') || !src.split('/').pop().includes('_')) {
                    const newName = `${i}_${imgCount}`;
                    const newSrc = src.replace(/\/([^\/]+)\.jpg/, `/${newName}.jpg`)
                                    .replace(/\/([^\/]+)\/fs\//, `/${newName}/fs/`);
                    imgCount++;
                    return match.replace(src, newSrc);
                }
                return match;
            });

            const t = document.querySelector('textarea[parentcommentid]');
            const e = document.querySelector('.redactor-editor[placeholder^="Antworten"]');
            if (t && e) {
                t.value = html;
                e.innerHTML = html;
                console.log('Inhalt eingefügt');
            } else {
                alert('Editor nicht gefunden');
            }
        })
        .catch(e => alert("Fehler: " + e.message));
    }

    function enhanceEditor(toolbar) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'gap--all-1';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';

        // Zitieren-Button zuerst hinzufügen
        const zitierButton = document.createElement('button');
        zitierButton.type = 'button';
        zitierButton.className = 'button button--type-tag button--mode-light button--square';
        zitierButton.title = 'Originaltext zitieren';
        zitierButton.style.minWidth = '36px';
        zitierButton.style.height = '36px';
        zitierButton.style.padding = '0 4px';
        zitierButton.style.marginRight = '0px';

        const labelSpan = document.createElement('span');
        labelSpan.innerHTML = 'Z';
        labelSpan.style.fontSize = '18px';
        labelSpan.style.lineHeight = '1';

        zitierButton.appendChild(labelSpan);
        zitierButton.addEventListener('click', zitieren);
        buttonContainer.appendChild(zitierButton);

        // Restliche Buttons danach hinzufügen
        addButton(buttonContainer, "bold", "Fett Ctrl+B", "B",
                  {module: "inline", fn: "format", args: ["strong"]});
        addButton(buttonContainer, "strike", "Durchgestrichen", "S",
                  {module: "inline", fn: "format", args: ["del"]});
        addButton(buttonContainer, "italic", "Kursiv Ctrl+I", "I",
                  {module: "inline", fn: "format", args: ["em"]});
        addButton(buttonContainer, "bullet-list", "Liste Ctrl+Shift+8", "•",
                  {module: "list", fn: "toggle", args: ["unorderedlist"]});
        addButton(buttonContainer, "line", "Trennlinie", "-",
                  {module: "line", fn: "insert", args: null});

        const sendButton = toolbar.querySelector('button[disabled]');
        toolbar.insertBefore(buttonContainer, sendButton);
    }


    function addButton(container, icon, title, label, handler) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'button button--type-tag button--mode-light button--square';
        button.title = title;
        button.style.minWidth = '36px';
        button.style.height = '36px';
        button.style.padding = '0 4px';
        button.style.marginRight = '0px';

        const labelSpan = document.createElement('span');
        labelSpan.innerHTML = label;
        labelSpan.style.fontSize = '18px';
        labelSpan.style.lineHeight = '1';

        if (handler) {
            button.setAttribute('data-handler', 'wysiwyg-button popover-close');
            button.setAttribute('data-wysiwyg-button', JSON.stringify(handler));
        }

        button.appendChild(labelSpan);
        container.appendChild(button);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForEditor);
    } else {
        waitForEditor();
    }
})();
