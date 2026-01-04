// ==UserScript==
// @name         AtCoder Language Filter
// @namespace    https://github.com/morioprog
// @version      1.0.2
// @description  提出言語のフィルタリングと並び替え
// @author       morio_prog
// @match        *://atcoder.jp/contests/*/tasks/*
// @match        *://atcoder.jp/contests/*/submit*
// @match        *://atcoder.jp/contests/*/custom_test*
// @license      CC0
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.12/js/select2.min.js
// @downloadURL https://update.greasyfork.org/scripts/398148/AtCoder%20Language%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/398148/AtCoder%20Language%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_LANGUAGE_KEY = 'defaultLang';
    const SAVED_LANGUAGE_KEY = 'userscript-languagefilter-savedlanguage';

    function moveElementToEndOfParent($ele) {
        const parent = $ele.parent();
        $ele.detach();
        parent.append($ele);
    }

    let defLang = localStorage.getItem(DEFAULT_LANGUAGE_KEY);
    if (defLang) defLang = defLang.replace(/[^0-9]/g, '');
    const $selectLanguage = $('#select-lang select');

    /* Build language-map */
    const optMap = new Map(); // {lang: [value, data-mime]}
    $selectLanguage.children('option').each(function(_, e) {
        const $opt = $(e);
        optMap.set(
            $opt.text(),
            [
                $opt.attr('value'),
                $opt.attr('data-mime'),
            ]
        );
        $(this).remove();
    });

    /* Add button */
    const buttonHtml = `<p><button type="button" class="btn btn-default btn-sm btn-auto-height" data-toggle="modal" data-target="#LangFilterModal">提出言語の選択</button></p>`;
    $('#main-container > div.row > div > form > div > div.editor-buttons').append(buttonHtml);

    /* Add modal */
    const modalHtml = `
<div class="modal fade" id="LangFilterModal" tabindex="-1" role="dialog" aria-labelledby="LangFilterModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="LangFilterModalLabel">提出言語の選択</h4>
            </div>
            <div class="modal-body" id="langfilter-modal">
                <select id="langfilter-select2" multiple="multiple"></select>
            </div>
            <div class="modal-footer">
                <button type="button" id="langfilter-selectall" class="btn btn-info pull-left">Select All</button>
                <button type="button" id="langfilter-clear" class="btn btn-danger pull-left">Clear</button>
                <span id="langfilter-savelabel" style="margin-right:20px;"></span>
                <button type="button" id="langfilter-save" class="btn btn-success">Save changes</button>
            </div>
        </div>
    </div>
</div>`;
    $('body').prepend(modalHtml);

    const $lfsel2 = $('select#langfilter-select2');
    optMap.forEach(function(val, key) {
        $lfsel2.append(
            $('<option>', {
                value: val[0],
                text: key,
            })
        );
    });

    /* Load saved languages */
    let savedLanguage = localStorage.getItem(SAVED_LANGUAGE_KEY);
    let selectedLanguage = [];
    if (savedLanguage) {
        try {
            savedLanguage = JSON.parse(savedLanguage);
        } catch (error) {
            savedLanguage = [];
            console.log(error);
        }
        $.each(savedLanguage, function(_, lang) {
            if (!optMap.has(lang)) return true;
            const val = optMap.get(lang)[0];
            const mim = optMap.get(lang)[1];
            $selectLanguage.append(
                $('<option>', {
                    'value':     val,
                    'data-mime': mim,
                    'text':      lang,
                    'selected':  val == defLang,
                })
            );
            selectedLanguage.push(lang);
            const $opt = $lfsel2.find(`option[value='${val}']`);
            $opt.prop('selected', true);
            moveElementToEndOfParent($opt);
        });
    }

    /* Apply Select2 */
    $lfsel2.select2({
        placeholder: 'Languages',
        theme: 'bootstrap',
    }).on('select2:select', function(evt) {
        const $opt = $(this).children(`option[value=${evt.params.data.id}]`);
        moveElementToEndOfParent($opt);
        $(this).trigger("change");
    });

    const $ul = $('#langfilter-modal > span > span.selection > span > ul.select2-selection__rendered');
    $ul.sortable({
        containment: 'parent',
        update: function() {
            $(this).children("li[title]").each(function(_, li) {
                const $opt = $lfsel2.children('option').filter(function() {
                    return $(this).html() == li.title;
                });
                moveElementToEndOfParent($opt);
            });
        }
    });

    $('#langfilter-clear').on('click', function() {
        $lfsel2.val(null).trigger('change');
    });

    $('#langfilter-selectall').on('click', function() {
        $lfsel2.children('option').prop('selected', true);
        $lfsel2.trigger("change");
    });

    $('#langfilter-save').on('click', function() {
        selectedLanguage = [];
        $ul.children('li.select2-selection__choice').each(function() {
            selectedLanguage.push($(this).text().slice(1));
        });
        if (selectedLanguage.length === 0) {
            $('#langfilter-savelabel').removeClass('text-success');
            $('#langfilter-savelabel').addClass('text-danger');
            $('#langfilter-savelabel').text('Please select at least 1 language!');
        } else {
            localStorage.setItem(SAVED_LANGUAGE_KEY, JSON.stringify(selectedLanguage));
            $('#langfilter-savelabel').removeClass('text-danger');
            $('#langfilter-savelabel').addClass('text-success');
            $('#langfilter-savelabel').text(`Saved (${(new Date()).toLocaleString()})`);
        }
    });

})();