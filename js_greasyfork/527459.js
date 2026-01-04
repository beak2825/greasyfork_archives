// ==UserScript==
// @name         imgbb uploader
// @namespace    http://shikimori.me/
// @version      1.0
// @description  Загрузчик изображений
// @author       pirate~
// @match        *://shikimori.tld/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527459/imgbb%20uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/527459/imgbb%20uploader.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function insertBBCodeForEditor(editorContainer, imageUrl) {
        var bbcode = '[img]' + imageUrl + '[/img]';
        var field = editorContainer.querySelector('textarea[name="comment[body]"]') || editorContainer.querySelector('input[name="comment[body]"]');
        if (field) {
            if (field.tagName.toLowerCase() === 'textarea') {
                var start = field.selectionStart, end = field.selectionEnd;
                field.value = field.value.slice(0, start) + bbcode + field.value.slice(end);
                field.selectionStart = field.selectionEnd = start + bbcode.length;
                field.focus();
            } else {
                field.value += bbcode;
                field.dispatchEvent(new Event('input', { bubbles: true }));
            }
            return;
        }
        var proseMirror = editorContainer.querySelector('.ProseMirror');
        if (proseMirror) {
            proseMirror.focus();
            document.execCommand('insertText', false, bbcode);
            var hiddenInput = editorContainer.querySelector('input[name="comment[body]"]');
            if (hiddenInput) {
                hiddenInput.value += bbcode;
                hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }
    function createUploadButton(editorContainer, parentElement) {
        var btn = document.createElement('span');
        btn.classList.add('imgbb');
        btn.style.cursor = 'pointer';
        btn.style.color = '#444';
        btn.textContent = '🖼';
        btn.addEventListener('click', function() {
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            fileInput.addEventListener('change', function() {
                if (fileInput.files && fileInput.files[0]) {
                    var file = fileInput.files[0];
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var dataUrl = e.target.result;
                        var base64Index = dataUrl.indexOf('base64,') + 7;
                        var base64Data = dataUrl.substring(base64Index);
                        var formData = new FormData();
                        formData.append('key', '4ac0d36441827bcaa8c91bd70415e6f3');
                        formData.append('image', base64Data);
                        formData.append('name', file.name);
                        fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                insertBBCodeForEditor(editorContainer, data.data.url);
                            } else {
                                alert('Ошибка загрузки: ' + (data.error.message || 'неизвестная ошибка'));
                            }
                        })
                        .catch(error => {
                            console.error('Ошибка запроса:', error);
                            alert('Ошибка загрузки изображения');
                        })
                        .finally(() => { fileInput.remove(); });
                    };
                    reader.readAsDataURL(file);
                }
            });
            fileInput.click();
        });
        parentElement.appendChild(btn);
    }
    function addButtonToEditors() {
        var classicEditors = document.querySelectorAll('.b-shiki_editor:not(.b-shiki_editor-v2)');
        classicEditors.forEach(editor => {
            var controls = editor.querySelector('.editor-controls');
            if (controls && !controls.querySelector('.imgbb')) {
                createUploadButton(editor, controls);
            }
        });
        var v2Editors = document.querySelectorAll('.vue-node');
        v2Editors.forEach(editor => {
            var menubar = editor.querySelector('.menubar');
            if (menubar && !menubar.querySelector('.imgbb')) {
                createUploadButton(editor, menubar);
            }
        });
    }
    document.addEventListener('DOMContentLoaded', addButtonToEditors);
    setInterval(addButtonToEditors, 1000);
})();
