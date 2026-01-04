// ==UserScript==
// @name         Platonus - Autocomplete Graduate
// @namespace    scriptomatika
// @author       mouse-karaganda
// @description  Автозаполнение полей выпускника
// @license      MIT
// @match        https://platonus.buketov.edu.kz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=platonus.buketov.edu.kz
// @version      1.4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520600/Platonus%20-%20Autocomplete%20Graduate.user.js
// @updateURL https://update.greasyfork.org/scripts/520600/Platonus%20-%20Autocomplete%20Graduate.meta.js
// ==/UserScript==

(function() {
    let $ = window.jQuery;
    console.log('Userscript run at == ', location.href);

    //Абилова Далила
    let studentList = [
        //(708)774-77-38
        //+7(775)162-19-70
        '1;Абилова;Далила;Руслановна;Abilova;Dalila;970570;;980429450553;01-02-1995;удост. личн;038229264;19-03-2015;КР ІШКІ ІСТЕР МИНИСТРЛІГІ;5B090400;Женский;Азербайджанец;Казахстан;очная;4;каз.;Грант;27-08-2016;427;19-06-2019;386;ЖБ-Б;1387346;27-06-2019;136;19-06-2019'
    ];

    let item = {};

    let itemArray = [
        'number',
        'surname',
        'name',
        'fatherName',
        'surnameEng',
        'nameEng',
        'phone',
        'phoneMobile',
        'numIin',
        'birthday',
        'typeDocument',
        'docNum',
        'dateDoc',
        'icDepartmentType',
        'professionCode',
        'sex',
        'nationality',
        'citizenship',
        'eduForm',
        'eduPeriod',
        'lang',
        'payForm',
        'startOrderDate',
        'startOrderNumber',
        'finishOrderDate',
        'finishOrderNumber',
        'diplomaSeries',
        'diplomaNumber',
        'finishDocDate',
        'protocolNumber',
        'protocolDate',
        'icFinishDate',
        'degree',
        'prevEducation',
        'prevInstitution'
    ];

    let tabs = {
        personalData: 'Личные данные',
        education: 'Образование',
        employment: 'Трудоустройство',
        graduateData: 'Данные о выпускнике',
        internship: 'Практика',
        benefits: 'Льготы'
    };

    let labels = {};

    labels.start = () => {

        //tabs.personalData

        labels[item.surname] = 'Фамилия';
        labels[item.name] = 'Имя';
        labels[item.fatherName] = 'Отчество';
        labels[item.surnameEng] = 'Фамилия транслитом';
        labels[item.nameEng] = 'Имя транслитом';
        labels[item.phone] = 'Домашний телефон';
        labels[item.phoneMobile] = 'Мобильный телефон';
        labels[item.numIin] = 'ИИН';
        labels[item.sex] = 'Пол';
        labels[item.birthday] = 'Дата рождения';
        labels[item.nationality] = 'Национальность';
        labels[item.citizenship] = 'Гражданство';
        labels[item.typeDocument] = 'Документ, удостоверяющий личность';
        labels[item.docNum] = 'Номер документа, удостоверяющего личность';
        labels[item.dateDoc] = 'Дата выдачи документа, удостоверяющего личность';
        labels[item.icFinishDate] = 'Срок действия документа, удостоверяющего личность';
        labels[item.icDepartmentType] = 'Орган, выдавший документ, удостоверяющий личность';

        //tabs.education

        labels[item.degree] = 'Академическая степень';
        labels[item.professionCode] = 'Специальность/Группа образовательных программ';
        labels[item.eduForm] = 'Форма обучения';
        labels[item.lang] = 'Язык обучения';
        labels[item.payForm] = 'Форма оплаты';
        labels[item.prevEducation] = 'учреждения, которое закончил абитуриент';
        labels[item.prevInstitution] = 'Окончил образовательное учреждение';

        //tabs.graduateData

        labels[item.startOrderDate] = 'Дата приказа о зачислении';
        labels[item.startOrderNumber] = 'Номер приказа о зачислении';
        labels[item.finishOrderDate] = 'Дата приказа о выпуске';
        labels[item.finishOrderNumber] = 'Номер приказа об окончании';
        labels[item.diplomaSeries] = 'Серия диплома';
        labels[item.diplomaNumber] = 'Номер диплома';
        labels[item.finishDocDate] = 'Дата выдачи диплома';
        labels[item.protocolNumber] = 'Номер протокола';
        labels[item.protocolDate] = 'Дата протокола';

        //console.log('completer :: labels = ', labels);

        labels.findByText = function(text) {
            for (let index in labels) {
                if (labels[index] == text) {
                    return index;
                }
            }
            return null;
        };
    };

    let globalQueue = {
        content: [],

        add: function(contentMethod, contentParams, contentTime) {
            let newItem = { method: contentMethod };
            if (contentParams) {
                newItem.params = contentParams;
            }
            if (contentTime) {
                newItem.time = contentTime;
            }
            this.addItem(newItem);
        },

        addItem: function(contentItem) {
            this.addRange([ contentItem ]);
        },

        addRange: function(contentList) {
            this.content.push(...contentList);
        },

        clear: function() {
            delete this.content;
            this.content = [];
        },

        start: function() {
            console.log('completer :: globalQueue START = ', this.content);
            let gotoNextQueue = () => {
                if (globalQueue.content.length > 0) {
                    let nextStep = globalQueue.content.shift();
                    let nextParams = (nextStep.params) ? nextStep.params : [];
                    let nextTime = (nextStep.time) ? nextStep.time : completer.oneStepTime;
                    //console.log('completer :: globalQueue params = ', nextParams);
                    if (nextStep.method) {
                        nextStep.method.apply(globalQueue, nextParams);
                    }
                    setTimeout(gotoNextQueue, nextTime);
                }
            };
            gotoNextQueue();
        }
    };

    let completer = {
        maxLoadTime: 120000,
        oneStepTime: 320,
        smallStepTime: 80,
        globalIndex: 0,

        lotusBtnId: 'lotus_completer',
        lotusLogId: 'lotus_log',
        lotusLogRead: 'Чтение студента: ',
        lotusLogWrite: 'Запись из лотуса: ',

        canScrollToTab: true,
        canScrollToInput: true,
        canScrollToCombobox: true,

        insertStyle: function() {
            let styleText = [
                '.completer_button { margin-right: 10px; }',
                '.completer_button.btn-success, .completer_button.btn-success:hover { background-color: #0033cc !important; border-color: #0033cc !important; }',
                '.completer_log { margin-right: 10px; font-size: 12px; max-width: 350px; overflow: hidden; white-space: nowrap; }',
                '.lotus_message { font-size: 12px; float: right; margin-right: 18px; }',
                '.lotus_message span { color: green; }'
            ];
            $('<style type="text/css">').appendTo(document.head)
                .text(styleText.join('\n'));
        },

        log: function(text) {
            completer.lotusLog.html(text);
        },

        createButton: function(mapButton) {
            let outer = $('<li>').attr('id', completer.lotusBtnId)
                .insertBefore(mapButton.parent('li'));

            $('<button>').addClass('btn btn-success completer_button').appendTo(outer)
                .text('Заполнить из лотуса')
                .on('click', completer.clickToButton);

            outer = $('<li>').attr('id', completer.lotusLogId)
                .insertBefore(outer);

            completer.lotusLog = $('<div>').addClass('completer_log').appendTo(outer);
        },

        clickToButton: function() {
            globalQueue.clear();

            globalQueue.add(completer.addLotusMsgAll);

            completer.findStudent();

            if (true) {
                globalQueue.add(completer.log, [completer.lotusLogWrite + 'Начало']);

                // Переходим на вкладку
                completer.gotoNextTab(tabs.personalData);
                completer.gotoNextTab(tabs.education);
                //completer.gotoNextTab(tabs.employment);
                completer.gotoNextTab(tabs.graduateData);
                //completer.gotoNextTab(tabs.internship);
                //completer.gotoNextTab(tabs.benefits);
                globalQueue.add(completer.activateTab, [tabs.personalData]);

                globalQueue.add(completer.log, [completer.lotusLogWrite + 'Готово']);
            }

            globalQueue.start();
        },

        gotoNextTab: function(tabName) {
            globalQueue.add(completer.activateTab, [tabName]);
            tabs[tabName].call(completer);
        },

        setTabPersonalData: function() {
            let stud = completer.studentLotus;
            completer.setValueToTextbox(item.phone, stud[item.phone]);
            completer.setValueToTextbox(item.phoneMobile, completer.getPhoneMobile(stud));

            if (false) {
                completer.setValueToTextbox(item.nameEng, stud[item.nameEng]);
                completer.setValueToTextbox(item.surnameEng, stud[item.surnameEng]);
                completer.setValueToTextbox(item.phone, stud[item.phone]);
                completer.setValueToTextbox(item.phoneMobile, completer.getPhoneMobile(stud));
                completer.setValueToTextbox(item.numIin, completer.getIin(stud));
                completer.setValueToCombobox(item.sex, completer.getSex(stud));
                completer.setValueToDatepicker(item.birthday, stud[item.birthday]);
                completer.setValueToCombobox(item.nationality, completer.getNationality(stud));
                completer.setValueToCombobox(item.citizenship, completer.getCitizenship(stud));
                completer.setValueToCombobox(item.typeDocument, completer.getTypeDocument(stud));
                completer.setValueToTextbox(item.docNum, stud[item.docNum]);
                completer.setValueToDatepicker(item.dateDoc, stud[item.dateDoc]);
                completer.setValueToDatepicker(item.icFinishDate, stud[item.dateDoc]);
                completer.setValueToCombobox(item.icDepartmentType, completer.getDepartmentType(stud));
            }
        },

        setTabEducation: function() {
            let stud = completer.studentLotus;

            completer.setValueToCombobox(item.degree, 'Бакалавр');
            completer.setValueToCombobox(item.professionCode, stud[item.professionCode]);
            completer.setValueToCombobox(item.eduForm, completer.getEduForm(stud));
            completer.setValueToCombobox(item.lang, completer.getLang(stud));
            completer.setValueToCombobox(item.payForm, completer.getPayForm(stud));
            completer.setValueToTextbox(item.prevEducation, 'Карагандинский государственный университет имени Е.А. Букетова');
            completer.setValueToCombobox(item.prevInstitution, 'отечест');
        },

        setTabEmployment: function() {
        },

        setTabGraduateData: function() {
            let stud = completer.studentLotus;

            completer.setValueToDatepicker(item.startOrderDate, stud[item.startOrderDate]);
            completer.setValueToTextbox(item.startOrderNumber, stud[item.startOrderNumber]);
            completer.setValueToDatepicker(item.finishOrderDate, stud[item.finishOrderDate]);
            completer.setValueToTextbox(item.finishOrderNumber, stud[item.finishOrderNumber]);
            completer.setValueToTextbox(item.diplomaSeries, stud[item.diplomaSeries]);
            completer.setValueToTextbox(item.diplomaNumber, stud[item.diplomaNumber]);
            completer.setValueToDatepicker(item.finishDocDate, stud[item.finishDocDate]);
            completer.setValueToTextbox(item.protocolNumber, stud[item.protocolNumber]);
            completer.setValueToDatepicker(item.protocolDate, stud[item.protocolDate]);
        },

        setTabInternship: function() {
        },

        setTabBenefits: function() {
        },

        readStudentPlatonus: function() {
            completer.studentPlatonus = {};

            globalQueue.add(() => {
                console.log('completer :: readStudentPlatonus START');
                completer.log(completer.lotusLogRead + 'Начало');
            });

            globalQueue.add(completer.activateTab, [tabs.personalData]);

            let readFromTab = () => {
                completer.log(completer.lotusLogRead + tabs.personalData);
                let stud = completer.studentPlatonus;

                stud[item.surname] = completer.readFromTextbox(item.surname);
                stud[item.name] = completer.readFromTextbox(item.name);
                stud[item.fatherName] = completer.readFromTextbox(item.fatherName);
                stud[item.nameEng] = completer.readFromTextbox(item.nameEng);
                stud[item.surnameEng] = completer.readFromTextbox(item.surnameEng);
                stud[item.phone] = completer.readFromTextbox(item.phone);
                stud[item.phoneMobile] = completer.readFromTextbox(item.phoneMobile);
                stud[item.numIin] = completer.readFromTextbox(item.numIin);
                stud[item.sex] = completer.readFromCombobox(item.sex);
                stud[item.birthday] = completer.readFromDatepicker(item.birthday);
                stud[item.nationality] = completer.readFromCombobox(item.nationality);
                stud[item.citizenship] = completer.readFromCombobox(item.citizenship);
                stud[item.typeDocument] = completer.readFromCombobox(item.typeDocument);
                stud[item.docNum] = completer.readFromTextbox(item.docNum);
                stud[item.dateDoc] = completer.readFromDatepicker(item.dateDoc);
                stud[item.icFinishDate] = completer.readFromDatepicker(item.icFinishDate);
                stud[item.icDepartmentType] = completer.readFromCombobox(item.icDepartmentType);

                stud[item.phoneMobile] = completer.getPhoneMobile(stud);
            };
            globalQueue.add(readFromTab);

            globalQueue.add(completer.activateTab, [tabs.education]);

            readFromTab = () => {
                completer.log(completer.lotusLogRead + tabs.education);
                let stud = completer.studentPlatonus;

                stud[item.degree] = completer.readFromCombobox(item.degree);
                stud[item.professionCode] = completer.readFromCombobox(item.professionCode);
                stud[item.eduForm] = completer.readFromCombobox(item.eduForm);
                stud[item.lang] = completer.readFromCombobox(item.lang);
                stud[item.payForm] = completer.readFromCombobox(item.payForm);
                stud[item.prevEducation] = completer.readFromTextbox(item.prevEducation);
                stud[item.prevInstitution] = completer.readFromCombobox(item.prevInstitution);
            };
            globalQueue.add(readFromTab);

            //globalQueue.add(completer.activateTab, [tabs.employment]);
            globalQueue.add(completer.activateTab, [tabs.graduateData]);

            readFromTab = () => {
                completer.log(completer.lotusLogRead + tabs.graduateData);
                let stud = completer.studentPlatonus;

                stud[item.startOrderDate] = completer.readFromDatepicker(item.startOrderDate);
                stud[item.startOrderNumber] = completer.readFromTextbox(item.startOrderNumber);
                stud[item.finishOrderDate] = completer.readFromDatepicker(item.finishOrderDate);
                stud[item.finishOrderNumber] = completer.readFromTextbox(item.finishOrderNumber);
                stud[item.diplomaSeries] = completer.readFromTextbox(item.diplomaSeries);
                stud[item.diplomaNumber] = completer.readFromTextbox(item.diplomaNumber);
                stud[item.finishDocDate] = completer.readFromDatepicker(item.finishDocDate);
                stud[item.protocolNumber] = completer.readFromTextbox(item.protocolNumber);
                stud[item.protocolDate] = completer.readFromDatepicker(item.protocolDate);
            };
            globalQueue.add(readFromTab);

            //globalQueue.add(completer.activateTab, [tabs.internship]);
            //globalQueue.add(completer.activateTab, [tabs.benefits]);
            //globalQueue.add(completer.activateTab, [tabs.personalData]);

            globalQueue.add(() => {
                console.log('completer :: readStudentPlatonus END = ', completer.studentPlatonus);
                completer.log(completer.lotusLogRead + 'Готово');
            });

            //globalQueue.start();
        },

        getPhoneMobile: function(stud) {
            let value = stud[item.phoneMobile];

            // Удаляем все знаки, кроме цифр
            value = value.replace(/\D/g, '');
            if (value == '') {
                value = '7010001111';
            } else {
                value = value.replace(/^87/, '77').substring(1, 11);
            }
            console.log('completer :: getPhoneMobile = ', value);
            return value;
        },

        getIin: function(stud) {
            return stud[item.numIin];
        },

        getSex: function(stud) {
            return stud[item.sex].substring(0, 3);
        },

        getNationality: function(stud) {
            return stud[item.nationality].substring(0, 6);
        },

        getCitizenship: function(stud) {
            return stud[item.citizenship].substring(0, 6);
        },

        getLang: function(stud) {
            return stud[item.lang].substring(0, 3);
        },

        getPayForm: function(stud) {
            return stud[item.payForm].substring(0, 4);
        },

        getTypeDocument: function(stud) {
            let value = stud[item.typeDocument].toLowerCase();
            console.log('completer :: getTypeDocument = ', value);

            if (/удост/.test(value)) {
                value = 'удост';
            } else if (/паспорт/.test(value)) {
                value = 'пасп';
            } else if (/свид/.test(value)) {
                value = 'свидет';
            } else {
                value = 'другой';
            }
            return value;
        },

        getDepartmentType: function(stud) {
            let value = stud[item.icDepartmentType].toLowerCase();

            if (/мвд|ішкі.+істер.+мин|іім/.test(value) & /р[кқ]|[кқ]р |[кқ]аза[кқх]стан/.test(value)) {
                value = 'внутрен';
            } else if (/мю | мю/.test(value) & /[кқ]р | р[кқ]|[кқ]аза[кқх]стан/.test(value)) {
                value = 'юстиц';
            } else {
                value = 'другой';
            }
            return value;
        },

        getEduForm: function(stud) {
            let eduForm = stud[item.eduForm].toLowerCase();
            let eduPeriod = stud[item.eduPeriod];
            let space = '';

            if (eduForm.startsWith('очная сокращенная')) {
                space = ' ';
            }
            let value = `${eduForm}${space}(${eduPeriod})`;
            return value;
        },

        findStudent: function() {
            // Сначала читаем старые значения
            if (!completer.studentPlatonus) {
                completer.readStudentPlatonus();
            }

            let findItem = studentList[0];
            let stud = findItem.split(';');
            completer.studentLotus = stud;
        },

        activateTab: function(tabText) {
            let findTab = completer.findTab(tabText);
            if (findTab.length > 0) {
                findTab.eq(0).trigger('click');
                if (completer.canScrollToTab) {
                    completer.scrollToInput(findTab[0]);
                }
            }
        },

        scrollIntoView: function(input) {
            $(input)[0].scrollIntoView({ behavior: 'instant' });
        },

        scrollToInput: function(input) {
            // Добавим высоту верхней планки
            completer.scrollIntoView(input);
            window.scrollBy({
                left: 0,
                top: -66,
                behavior: "instant"
            });
        },

        addLotusMsg: function(oneLabel) {
            if (oneLabel.length > 0) {
                let oneDiv = oneLabel.next('.lotus_message');
                if (oneDiv.length == 0) {
                    let labelText = oneLabel.text().trim();
                    oneDiv = $('<div>').addClass('lotus_message').insertAfter(oneLabel[0])
                        .attr('data-label', labelText);
                }
                oneDiv.text('…');
                return oneDiv;
            }
            return oneLabel;
        },

        addLotusMsgAll: function() {
            let labelList = $('.tab-content label.form-label');
            labelList.each((index, oneLabel) => {
                completer.addLotusMsg($(oneLabel));
            });
        },

        findTab: function(tabText) {
            let tabList = $('ul.nav-tabs button.nav-link');
            //console.log('completer :: tabList = ', tabList);
            let oneTab = tabList.filter((index, tab) => tabText == $(tab).text().trim());
            console.log('completer :: findTab [%o] = ', tabText, oneTab);
            return oneTab;
        },

        findLabel: function(labelText) {
            let labelList = $('.tab-content label.form-label');
            //console.log('completer :: labelList = ', labelList);
            let oneLabel = labelList.filter((index, label) => new RegExp(labelText + '$', 'i').test($(label).text().trim()));
            console.log('completer :: findLabel [%o] = ', labelText, oneLabel);
            return oneLabel;
        },

        findTextbox: function(labelText) {
            // Ищем метку и следующий после неё элемент
            let oneLabel = completer.findLabel(labelText);
            let lotusMsg = completer.addLotusMsg(oneLabel);
            let oneInput = lotusMsg.next('input[type="text"], input:not([type])');
            console.log('completer :: findInput [%o] = ', labelText, oneInput);
            oneInput.data('message', lotusMsg[0]);
            return oneInput;
        },

        findDatepicker: function(labelText) {
            let oneLabel = completer.findLabel(labelText);
            let lotusMsg = completer.addLotusMsg(oneLabel);
            let oneDatepicker = lotusMsg.next('.input-group').find('input[datepicker]');
            console.log('completer :: findDatepicker [%o] = ', labelText, oneDatepicker);
            oneDatepicker.data('message', lotusMsg[0]);
            return oneDatepicker;
        },

        findCombobox: function(labelText) {
            let oneLabel = completer.findLabel(labelText);
            let lotusMsg = completer.addLotusMsg(oneLabel);
            let oneCombobox = lotusMsg.nextAll('select + .select2-container').find('span[role="combobox"]');
            console.log('completer :: findCombobox [%o] = ', labelText, oneCombobox);
            oneCombobox.data('message', lotusMsg[0]);
            return oneCombobox;
        },

        readFromInput: function(inputType, labIndex) {
            let labelText = labels[labIndex];
            let value = '';

            let oneInput = completer.findTextbox(labelText);
            if (oneInput.length > 0) {
                if (completer.canScrollToInput) {
                    completer.scrollIntoView(oneInput);
                }
                value = oneInput[0].value;
            }
            console.log('completer :: readFrom%s [%o] = ', inputType, labelText, value);
            //completer.log(completer.lotusLogRead + labelText);
            return value;
        },

        readFromTextbox: function(labIndex) {
            return completer.readFromInput('Textbox', labIndex);
        },

        readFromDatepicker: function(labIndex) {
            return completer.readFromInput('Datepicker', labIndex);
        },

        readFromCombobox: function(labIndex) {
            let labelText = labels[labIndex];
            let value = '';

            let oneInput = completer.findCombobox(labelText).find('span[role="textbox"]');
            if (oneInput.length > 0) {
                if (completer.canScrollToCombobox) {
                    completer.scrollIntoView(oneInput);
                }
                value = oneInput.text().trim();
            }
            console.log('completer :: readFromCombobox [%o] = ', labelText, value);
            //completer.log(completer.lotusLogRead + labelText);
            return value;
        },

        showOldValue: function(oneInput, oldValue) {
            let oldText = (oldValue == '') ? 'пусто' : oldValue;
            let showMsg = (`Было в платонусе: <span>${oldText}</span>`);
            $(oneInput.data('message')).html(showMsg);
        },

        checkValue: function(inputType, labIndex, newValue) {
            return;
            let oldValue = completer.studentPlatonus[labIndex];
            let lotusValue = completer.studentLotus[labIndex];
            let afterValue = completer['readFrom' + inputType](labIndex);

            if (oldValue != afterValue) {
                completer.showOldValue(oneInput, oldValue);
            }
        },

        writeToInput: function(oneInput, newValue) {
            oneInput.value = newValue;
            oneInput.dispatchEvent(new Event('input'));
            oneInput.dispatchEvent(new Event('blur'));
        },

        setValueToInput: function(inputType, labIndex, newValue) {
            if (newValue == '') {
                return;
            }
            let setValue = () => {
                let labelText = labels[labIndex];
                console.log('completer :: setValueTo%s [%o] = ', inputType, labelText, newValue);
                completer.log(completer.lotusLogWrite + labelText);

                let oneInput = completer['find' + inputType](labelText);
                if (oneInput.length > 0) {
                    if (completer.canScrollToInput) {
                        completer.scrollIntoView(oneInput);
                    }
                    let oldValue = completer.studentPlatonus[labIndex];
                    if (oldValue != newValue) {
                        completer.showOldValue(oneInput, oldValue);
                        completer.writeToInput(oneInput[0], newValue);
                    }
                }
            };
            globalQueue.add(setValue, [], completer.smallStepTime);
            globalQueue.add(completer.checkValue, [inputType, labIndex], completer.smallStepTime);
        },

        setValueToTextbox: function(labIndex, newValue) {
            completer.setValueToInput('Textbox', labIndex, newValue);
        },

        setValueToDatepicker: function(labIndex, newValue) {
            completer.setValueToInput('Datepicker', labIndex, newValue);
        },

        setValueToCombobox: function(labIndex, newValue) {
            if (newValue == '') {
                return;
            }
            let oneInput, oneContainer;
            let labelText = labels[labIndex];

            let getInput = () => {
                oneInput = completer.findCombobox(labelText);
                return (oneInput.length > 0);
            };
            let getContainer = () => {
                if (getInput()) {
                    oneContainer = $(oneInput).parents('.select2-container').nextAll('.select2-container:last-child');
                    return (oneContainer.length > 0);
                }
                return false;
            };

            globalQueue.addRange([{
                method: () => {
                    console.log('completer :: setValueToCombobox [%o] = ', labelText, newValue);
                    completer.log(completer.lotusLogWrite + labelText);

                    // Открываем выпадающий список
                    if (getInput()) {
                        if (completer.canScrollToCombobox) {
                            //completer.scrollToInput(oneInput[0]);
                            completer.scrollIntoView(oneInput);
                        }
                        oneInput[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    }
                }
            }, {
                method: () => {
                    // Заполняем фильтр
                    if (getContainer()) {
                        let filterInput = oneContainer.find('[type="search"]');
                        console.log('completer :: filterInput = ', filterInput);
                        if (filterInput.length > 0) {
                            completer.writeToInput(filterInput[0], newValue.toLowerCase());
                        }
                    }
                }
            }, {
                method: () => {
                    // Выделяем оставшийся пункт
                    if (getContainer()) {
                        let filterList = oneContainer.find('ul[role="listbox"] li');
                        console.log('completer :: filterList = ', filterList);
                        if (filterList.length > 0) {
                            filterList[0].dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        }
                    }
                }
            }, {
                time: completer.smallStepTime,
                method: () => {
                    // Если нужно, покажем старое значение
                    if (getInput()) {
                        let oldValue = completer.studentPlatonus[labIndex];
                        let afterValue = completer.readFromCombobox(labIndex);
                        if (oldValue != afterValue) {
                            completer.showOldValue(oneInput, oldValue);
                        }
                    }
                }
            }]);
        },

        popstateHandler: function() {
            // Ждем кнопку карты
            let mapButton = $('a.btn.btn-primary[href$="/map"]');
            console.log('completer :: popstateHandler [%o] = ', mapButton.length, mapButton);

            if (mapButton.length == 0) {
                let pause = new Date() - completer.popstateStart;
                if (pause > completer.maxLoadTime) {
                    clearInterval(completer.popstateTimer);
                    delete completer.popstateStart;
                    return;
                }
            } else {
                clearInterval(completer.popstateTimer);
                delete completer.popstateStart;
                // Создаем новую кнопку
                completer.createButton(mapButton);
            }
        },

        runPopstate: function(event) {
            completer.clear();

            // Проверяем, какая страница открыта
            let isGraduate = /graduate\/-?\d+/.test(location.href);
            console.log('completer :: runPopstate [%o] = ', isGraduate, location.href);
            if (!isGraduate) {
                return;
            }
            completer.popstateStart = new Date();
            completer.popstateTimer = setInterval(completer.popstateHandler, completer.oneStepTime);
        },

        startLabels: function(event) {
            item = {};
            itemArray.forEach((name, index) => {
                item[name] = index;
            });
            //console.log('completer :: startItem = ', item);

            labels.start();

            tabs[tabs.personalData] = completer.setTabPersonalData;
            tabs[tabs.education] = completer.setTabEducation;
            tabs[tabs.employment] = completer.setTabEmployment;
            tabs[tabs.graduateData] = completer.setTabGraduateData;
            tabs[tabs.internship] = completer.setTabInternship;
            tabs[tabs.benefits] = completer.setTabBenefits;
        },

        clear: function() {
            globalQueue.clear();
            delete completer.studentLotus;
            delete completer.studentPlatonus;
            delete completer.lotusLog;

            // Убираем старую кнопку
            $('#' + completer.lotusLogId).remove();
            $('#' + completer.lotusBtnId).remove();
        },

        start: function() {
            completer.startLabels();
            completer.insertStyle();
            completer.runPopstate();
            //window.addEventListener('popstate', completer.runPopstate);
            $(window).on('popstate', completer.runPopstate);
        }
    };

    completer.start();

    console.log('Platonus - Autocomplete Graduate 💬 1.4');
})();