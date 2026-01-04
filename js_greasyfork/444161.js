// ==UserScript==
// @name         AniList - Activity Templates
// @namespace    https://www.youtube.com/c/NurarihyonMaou/
// @version      1.1
// @description  Script that gives you the possibility to create Activity Templates on AniList
// @author       NurarihyonMaou
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/444161/AniList%20-%20Activity%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/444161/AniList%20-%20Activity%20Templates.meta.js
// ==/UserScript==

const $ = window.jQuery;

let currentText = '', templateName = '';
let templates = [], templateID, templatesList;
let markdown_editor, textArea, inputTemplateName, templateSelector;

let plus = '<svg class="svg-inline--fa fa-plus fa-w-14" aria-hidden="true" data-fa-processed="" data-prefix="fa" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z"></path></svg>';
let minus = '<svg class="svg-inline--fa fa-minus fa-w-14" aria-hidden="true" data-fa-processed="" data-prefix="fa" data-icon="minus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M424 318.2c13.3 0 24-10.7 24-24v-76.4c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h400z"></path></svg>';
let save = '<svg class="svg-inline--fa fa-save fa-w-14" aria-hidden="true" data-fa-processed="" data-prefix="fas" data-icon="save" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path></svg>';

let backspace = jQuery.Event("keypress");
backspace.which = 8;

let enter = jQuery.Event("keypress");
backspace.which = 13;

(function init() {
    markdown_editor = document.getElementsByClassName("markdown-editor");

    if (markdown_editor.length > 0) {
        textArea = document.getElementsByClassName("el-textarea__inner")
        $(textArea).after("<input type='text' id='templateName' placeholder='Name Your Template' class='input el-textarea'>");
        
        inputTemplateName = document.getElementById("templateName");
        
        $(markdown_editor).append("<div id='addT' title='Add Template'>" + plus + "</div><div id='removeT' title='Remove Template'>" + minus + "</div><div id='updateT' title='Update Template'>" + save + "</div>");
        $(markdown_editor).append("<select id='templatesList'></select>");

        templateSelector = $("body select#templatesList");

        function loadTemplatesList() {
            if (GM_getValue('templates') != undefined)
                templates = GM_getValue('templates');

            templatesList = "<option value='-1'>Template</option>";

            for (let template = 0; template < templates.length; template++) {
                if (template == templateID) templatesList += "<option value='" + template + "' selected>" + templates[template][0] + "</option>";
                else templatesList += "<option value='" + template + "'>" + templates[template][0] + "</option>";
            }

            $(templateSelector).html(templatesList);
            templatesList = null;
        }

        loadTemplatesList();

        $(inputTemplateName).on('input', function () {
            templateName = $(this).val();
        });

        $(textArea).on('input', function () {
            currentText = $(this).val();
        });

        function loadTemplate(id) {
            templateID = id;
            currentText = templates[id][1];
            templateName = templates[id][0];

            $(textArea).val(templates[id][1]);
            $(inputTemplateName).val(templates[id][0]);
        }

        $(templateSelector).on('click', function () {
            if ($(this).val() == undefined)
                return;

            if ($(this).val() == -1) {
                templateID = null;
                $(textArea).val('');
                $(inputTemplateName).val('');
            }

            else loadTemplate($(this).val());
        });

        $("body div#addT").click(function () {
            if (templateName == '' || currentText == '')
                return;

            templates.push([[templateName], [currentText]]);
            templateID = templates.length - 1;

            GM_setValue("templates", templates);
            loadTemplatesList();
        });

        $("body div#removeT").click(function () {
            if (templateID == null)
                return;

            let deleteConfirmation;
            deleteConfirmation = confirm("Are You sure that You want to delete - " + templates[templateID][0]);

            if (deleteConfirmation == false)
                return;

            templates.splice(templateID, 1);
            templateID = null;
            $(textArea).val('');
            $(inputTemplateName).val('');

            GM_setValue("templates", templates);
            loadTemplatesList();
        });

        $("body div#updateT").click(function () {
            templates[templateID][0] = templateName;
            templates[templateID][1] = currentText;

            GM_setValue("templates", templates);
            loadTemplatesList();
        });

    } else {
        setTimeout(init, 0);
    }
})();