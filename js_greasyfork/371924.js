// ==UserScript==
// @name         SurveyStudio. Удаление ответов по списку
// @namespace    https://www.survey-studio.com/
// @version      0.4
// @description
// @author       Ilya Lovin
// @match        https://survey-studio.com/project/editanswers?*
// @description Позволяет удалять ответы по списку ID
// @downloadURL https://update.greasyfork.org/scripts/371924/SurveyStudio%20%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%BF%D0%BE%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/371924/SurveyStudio%20%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%BF%D0%BE%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D1%83.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var errorCount = 0;
    var idType;

    addDeleteForm();

    $('input[name="id-type"]').click(function() {
        if (this.value == 'SrcAnswerId') {
            $('#qNumberArea').hide();
        } else {
            $('#qNumberArea').show();
        }
    });

    $('#deleteListBtn').click(function() {
        $('#deleteErrMsg').css('color', '#737373');

        errorCount = 0;
        idType = $('input[name="id-type"]:checked').val();

        let list = $('#id-list').val();

        if (!list.length) return false;

        let qNumToDel = parseInt($('#deleteQNumber').val(), 10);

        if (isNaN(qNumToDel)) {
            $('#deleteErrMsg').css('color', 'red');
            return false;
        }

        disableForm(true);
        $("#ajax_loader").show();
        addResultArea();

        for (let value of list.split('\n')) {
            if (!value.length) continue;

            let id = value;

            let response = sendPOST('Action=0&QuestionNumber=' + qNumToDel + '&RowCode=&AnswerCode=&OpenValueNum=&OpenValueTxt=&' + idType + '=' + id);
            let $rows = $(response).find('div > table.table > tbody > tr');

            if (!$rows.length) {
                changeResult(id, '<b>Нет ответов в интервью</b>', true);
                continue;
            }

            let answerId = findAnswer($rows);

            if (answerId === null) {
                changeResult(id, '<b>Ответ не найден</b>', true);
                continue;
            }

            if (idType == 'SrcAnswerId') {
                deleteAnswer(id, id);
            } else {
                deleteAnswer(id, answerId);
            }
        }

        $('#deleteQNumber').val('');
        disableForm(false);
        $("#ajax_loader").hide();
    });

    function disableForm(status) {
        $('#id-list, input[name="id-type"], #deleteQNumber, #deleteListBtn').prop('disabled', status);
    }

    function sendPOST(data) {
        let url = location.href;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);

        return xhr.response;
    }

    function findAnswer($rows) {
        let answerId = parseInt($('td.text-muted:eq(0)', $rows).text(), 10);
        if (isNaN(answerId)) return null;

        return answerId;

        return null;
    }

    function deleteAnswer(id, answerId) {
        // Нужна вся строка запроса, иначе ответ не удаляется (после обновления SurveyStudio теперь точно не ясно)
        let postBody = 'Action=3&QuestionNumber=&RowCode=&AnswerCode=&OpenValueNum=&OpenValueTxt=';
        let typesOfIds = {'SrcRespondentId': '',
                          'SrcContactId': '',
                          'SrcAnswerId': ''
                         };

        typesOfIds[idType] = id;

        for (let i in typesOfIds) {
            postBody += '&' + i + '=' + typesOfIds[i];
        }

        sendPOST(postBody + '&AnswerId=' + answerId);

        changeResult(id, 'Отправлен запрос на удаление ответа ' + answerId);
    }

    function changeResult(id, text, error) {
        document.getElementById('deleteResult').innerHTML += id + ': ' + text + '<br>';

        if (!error) return true;
        errorCount++;

        document.getElementById('deleteResultHeader').innerHTML = 'Результаты удаления: <span style="color: red">ошибок – <b>' + errorCount + '</b></span>';
    }

    function addDeleteForm() {
        $('div.ss-page-header').after('\
<div id="deleteForm" class="card bg-light" style="margin-bottom: 15px">\
    <div class="card-header">\
        Удаление ответов по списку ID\
    </div>\
    <div class="card-body">\
        <div class="card-text" style="padding-bottom: 15px">\
            Эта форма добавлена скриптом, установленным в вашем браузере, и не является частью SurveyStudio. \
Перед каждым использованием проверьте на 1-2 ID, что ответы удаляются корректно. Каждый ID должен быть в новой строке.\
        </div>\
        <div style="display: block; float: left;"><textarea id="id-list" rows="10" cols="20" name="id-list"></textarea></div>\
        <div style="display: block; float: left; margin-left: 10px;">\
            ID в списке:<br>\
            <input name="id-type" type="radio" value="SrcRespondentId" checked> респондентов<br>\
            <input name="id-type" type="radio" value="SrcContactId"> контактов<br>\
            <!--<input name="id-type" type="radio" value="SrcAnswerId"> ответов<br><br>-->\
            <div id="qNumberArea">\
                Номер вопроса:<br>\
                <input id="deleteQNumber" type="number" style="width: 100px"><br>\
                <span class="card-text" id="deleteErrMsg">\
                    <b>Внимательно</b> указывайте номер вопроса!<br>\
                    Операция необратима.<br>\
                    Если ответов несколько – удаляется первый по порядку в таблице.\
                </span>\
            </div>\
        </div>\
    </div>\
    <div class="card-footer d-flex justify-content-end" style="text-align: right;">\
        <button type="submit" class="btn btn-primary btn-sm" id="deleteListBtn">Удалить</button>\
    </div>\
</div>'
);
    }

    function addResultArea() {
        $('#deleteResultPanel').remove();

        $('#deleteForm').after('\
<div id="deleteResultPanel" class="card bg-light" style="margin-bottom: 15px">\
    <div class="card-header">\
        <span id="deleteResultHeader">Результаты удаления:</span>\
    </div>\
    <div id="deleteResult" class="card-body"></div>\
</div>'
);
    }
}());