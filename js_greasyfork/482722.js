// ==UserScript==
// @name         SurveyStudio. Импорт ответов на нескольких языках
// @namespace    https://survey-studio.com/
// @version      0.4
// @description
// @author       You
// @match        https://my.survey-studio.com/questionnaire/questions*
// @grant        none
// @description Позволяет импортировать список ответов сразу на нескольких языках
// @downloadURL https://update.greasyfork.org/scripts/482722/SurveyStudio%20%D0%98%D0%BC%D0%BF%D0%BE%D1%80%D1%82%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%B8%D1%85%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/482722/SurveyStudio%20%D0%98%D0%BC%D0%BF%D0%BE%D1%80%D1%82%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D0%BD%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%B8%D1%85%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0%D1%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ajaxComplete(function(event, xhr, settings) {
        if (settings.url.indexOf('question/getroweditor') === -1) return;
        if ($('.qLangImport').length > 0) return;

        let div = document.createElement('div');
        div.classList.add('note-btn-group', 'btn-group');
        div.innerHTML = '<button class="qLangImport note-btn btn btn-light btn-sm" type="button">Добавить язык</button>';

        let $groups = $('div#questionText.summernote, div#questionComment.summernote').parents('div.form-group');
        for (let $g of $groups) {
            let divWithEvent = div.cloneNode(true);

            divWithEvent.addEventListener('click', () => {
                let $editor = $($g).find('.summernote');
                let html = $editor.summernote('code');
                let langs = html.match(/(?<==)\d+(?==)/g);
                let num = langs ? Number(langs.slice(-1)) : 0;

                let emptyStr = '<p><br></p>';
                if (html.endsWith(emptyStr)) {
                    $editor.summernote('code', html.slice(0, html.lastIndexOf(emptyStr)));
                    $editor.summernote('restoreRange'); // чтобы курсор ставился в конце, а не в начале
                }

                $editor.summernote('pasteHTML', `<p>=${num + 1}=&nbsp;</p>`);
                $editor.summernote('focus');
            });

            $($g).find('.note-help').after(divWithEvent);
        }
    });

    $(document).ajaxComplete(function(event, xhr, settings) {
        if (settings.url.indexOf('answerlist/getroweditor') === -1) return;

        document.getElementById("alEditor_importBtn").addEventListener("click", function() {
            if ($('#langImport').length > 0) return;

            $('#answerListEditorImportForm > div.card-footer.d-flex.justify-content-end > button.btn-primary')
                .before('<button class="btn btn-sm btn-light mr-1" type="button" id="langImport">Языки</button>');

            document.getElementById("langImport").addEventListener("click", function() {
                let $txt = $('#answerListImportTextArea');
                let lines = $txt.val().split('\n');
                let answers = [ [], [] ]; // коды ответов, текст на первом языке
                let idx = 1;
                let newLines = [];

                for (let line of lines) {
                    line = line.replace(/(\s|\t)+/g, ' ').trim();
                    if (line.length === 0) {
                        answers.push([]);
                        idx++;
                        continue;
                    }

                    let reCode;
                    let reText;
                    if (!document.getElementById('itemFlag_CodesOnTheRight').checked) {
                        reCode = /^\d+/;
                        reText = reCode.test(line) ? /\s.*/ : /^.*$/;
                    } else {
                        reCode = /\d+$/;
                        reText = reCode.test(line) ? /^.+(?=\s)/ : /^.*$/;
                    }

                    let code = reCode.exec(line);
                    let text = reText.exec(line);
                    if (text === null) {
                        break;
                    }

                    text = text.toString().trim();

                    if (idx === 1) answers[0].push(code === null ? '' : code);
                    answers[idx].push(text);
                }

                let str;
                let langCount = answers.length - 1;
                let codesNum = answers[0].length;

                for (let i = 0; i < codesNum; i++) {
                    let code = answers[0][i];
                    str = code + ' ';

                    for (let j = 1; j < answers.length; j++) {
                        let arr = answers[j];
                        if (arr.length !== codesNum) {
                            alert('Количество строк в языках отличается');
                            return;
                        }

                        let text = arr[i];
                        str += `<p>=${j}= ${text}</p>`;
                    }

                    newLines.push(str);
                }

                $txt.val(newLines.join('\n'));
                document.getElementById('itemFlag_CodesOnTheRight').checked = false;
            });
        });
    });
})();