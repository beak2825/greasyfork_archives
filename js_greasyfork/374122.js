// ==UserScript==
// @name         Corp QS - TaskPageTools
// @namespace    https://greasyfork.org/ru/scripts/374122-corp-qs-taskpagetools
// @version      2.1.2
// @description  Инструменты страницы "Обращение"
// @author       Alex Yashin
// @resource     https://code.jquery.com/jquery-3.3.1.min.js
// @match        http://www.corp.qsoft.ru/bitrix/admin/ticket_edit.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374122/Corp%20QS%20-%20TaskPageTools.user.js
// @updateURL https://update.greasyfork.org/scripts/374122/Corp%20QS%20-%20TaskPageTools.meta.js
// ==/UserScript==

const TaskPageTools = {

    init: function() {

        this.MessageResque.init();
        this.ResponsibleSearch.init();
    },

    MessageResque: {

        ResqueKey: null,
        Box: null,

        init: function() {

            this.ResqueKey = 'messageResque|' + location.href;
            this.Box = $('#MESSAGE');

            $(this.Box)
                .on('keydown', this.save)
                .on('keypress', this.save)
                .on('keyup', this.save)
                .on('change', this.save)
            ;

            this.load();
        },

        load: function() {

            if (localStorage[TaskPageTools.MessageResque.ResqueKey]) {

                $(TaskPageTools.MessageResque.Box).val(localStorage[TaskPageTools.MessageResque.ResqueKey]);
            }
        },

        save: function() {

            localStorage[TaskPageTools.MessageResque.ResqueKey] = $(TaskPageTools.MessageResque.Box).val();
        },
    },

    ResponsibleSearch: {

        searchBoxTemplate: null,
        removeBtnTemplate: null,

        init: function() {

            $('#txt_findUserInSelectBox').remove();

            this.searchBoxTemplate = '<input type="text" xtype="searchbox" boxof="{{guid}}" placeholder="Поиск">';
            this.removeBtnTemplate = '<button xtype="removebtn" boxof="{{guid}}">[x]</button>';

            this.addSearchBox('#RESPONSIBLE_USER_ID');
            this.addSearchBox('#MULTY_RESPONSIBLE_ID__n0__');
            this.addSearchBox('#TO_TASK_TABLE [name="MULTY_RESPONSIBLE_ID[]"]');

            window['addNewRow_old'] = window['addNewRow'];

            window['addNewRow'] = function(a) {

                addNewRow_old(a);
                if (a == 'TO_TASK_TABLE') {

                    let lastInput = $('#TO_TASK_TABLE [xtype=searchbox]');

                    lastInput = lastInput[lastInput.length - 1];

                    let lastSelect = $('#TO_TASK_TABLE [guid]');
                    lastSelect = lastSelect[lastSelect.length - 1];

                    let guid = TaskPageTools.ResponsibleSearch.guid();

                    $(lastInput).attr('boxof', guid);
                    $(lastSelect).attr('guid', guid);
                    $(lastInput)
                        .on('keydown', TaskPageTools.ResponsibleSearch.search)
                        .on('keypress', TaskPageTools.ResponsibleSearch.search)
                        .on('keyup', TaskPageTools.ResponsibleSearch.search)
                    ;

                    let parentTr = $(lastSelect).parents('tr')[0];

                    $(parentTr).append('<td>' + TaskPageTools.ResponsibleSearch.removeBtnTemplate.replace('{{guid}}', guid) + '</td>');
                    $(parentTr).find('[xtype=removebtn]').on('click', TaskPageTools.ResponsibleSearch.remove);
                }
            }
        },

        guid: function() {

            function s4() {

                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
                ;
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },

        addSearchBox: function(target) {

            $(target).each(function() {
                let guid = TaskPageTools.ResponsibleSearch.guid();
                let NewTarget = TaskPageTools.ResponsibleSearch.searchBoxTemplate.replace('{{guid}}', guid);
                let parentTr = $(this).parents('tr')[0];
                $(this).attr('guid', guid).before(NewTarget);
                $('[xtype=searchbox][boxof='+guid+']')
                    .on('keydown', TaskPageTools.ResponsibleSearch.search)
                    .on('keypress', TaskPageTools.ResponsibleSearch.search)
                    .on('keyup', TaskPageTools.ResponsibleSearch.search)
                ;
                $(parentTr).append('<td>' + TaskPageTools.ResponsibleSearch.removeBtnTemplate.replace('{{guid}}', guid) + '</td>');
                $(parentTr).find('[xtype=removebtn]').on('click', TaskPageTools.ResponsibleSearch.remove);
            });
        },

        search: function(event) {

            let guid = $(this).attr('boxof');
            let value = $(this).val().toUpperCase();

            let toSet = true;

            $('[guid='+guid+'] option').each(function() {

                if (~$(this).text().toUpperCase().indexOf(value)) {

                    $(this).show();

                    if (toSet) {

                        $(this).parent().val($(this).val());
                        toSet = false;
                    }
                }
                else {

                    $(this).hide();
                }
            });
        },

        remove: function(event) {

            event.preventDefault();

            let guid = $(this).attr('boxof');

            $('[guid=' + guid + ']').val('NOT_REF');
        },
    },
};

(function() {
    'use strict';

    TaskPageTools.init();
})();