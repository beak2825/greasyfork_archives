// ==UserScript==
// @name         NetSchool Tweaks
// @namespace    https://greasyfork.org/users/843419
// @description  Дополнительные инструменты для NetSchool / NetCity (Сетевой Город. Образование)
// @version      1.0.5
// @author       Zgoly
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ir-tech.ru
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489435/NetSchool%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/489435/NetSchool%20Tweaks.meta.js
// ==/UserScript==

try {
    console.log(language.Generic.Calendar.kTitle1, 'найден, NetSchool Tweaks активен')
} catch {
    return
}

let autoLogin = GM_getValue('autoLogin', false)
let loginName = GM_getValue('loginName', 'Пользователь')
let password = GM_getValue('password', '12345678')
let schoolId = GM_getValue('schoolId', 0)
let autoSkip = GM_getValue('autoSkip', true)

let rowsSortMode = GM_getValue('rowsSortMode', 0)
let marksSortMode = GM_getValue('marksSortMode', 0)

let dot = '•'
let dotMark = 2

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) return resolve(document.querySelector(selector))

        let observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect()
                resolve(document.querySelector(selector))
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })
    })
}

if (autoLogin && window.location.pathname.startsWith('/authorize')) {
    function runAngularAction() {
        try {
            angular.element(document.body).scope().$$childTail.$ctrl.loginStrategiesService.loginWithLoginPassCheck(loginName, password, schoolId, null, { 'idpBindUser': 1 })
        } catch {
            requestAnimationFrame(runAngularAction)
        }
    }

    runAngularAction()
}

waitForElement('ns-modal').then((element) => {
    if (autoSkip && element.getAttribute('header') == language.Generic.Login.kTitleSecurityWarning) {
        element.querySelector('button').click()
        console.log('Модальное окно предупреждения о безопасности пропущено')
    }
})

function nstSwitch(parentElement) {
    let label = document.createElement('label')
    label.classList.add('nst-switch')

    let input = document.createElement('input')
    input.type = 'checkbox'
    input.classList.add('nst-hide')

    let div = document.createElement('div')

    label.append(input)
    label.append(div)

    parentElement.append(label)

    return input
}

function nstModal(headlineText, contentHTML, showSaveButton = true) {
    return new Promise((resolve, reject) => {
        let dialog = document.createElement('dialog')
        dialog.classList.add('nst-dialog')

        let dialogWrapper = document.createElement('div')
        dialogWrapper.classList.add('nst-dialog-wrapper')
        dialog.append(dialogWrapper)

        let headline = document.createElement('p')
        headline.classList.add('nst-headline')
        headline.textContent = headlineText
        dialogWrapper.append(headline)

        let dialogAutofocus = document.createElement('input')
        dialogAutofocus.autofocus = 'autofocus'
        dialogAutofocus.style.display = 'none'
        dialogWrapper.append(dialogAutofocus)

        let content = document.createElement('div')
        content.classList.add('nst-content')
        content.append(contentHTML)
        dialogWrapper.append(content)

        let actions = document.createElement('div')
        actions.classList.add('nst-actions')

        let closeButton = document.createElement('button')
        closeButton.classList.add('nst-close')
        closeButton.textContent = 'Закрыть'
        closeButton.addEventListener('click', () => closeDialog(false))
        actions.append(closeButton)

        if (showSaveButton) {
            let saveButton = document.createElement('button')
            saveButton.classList.add('nst-save')
            saveButton.textContent = 'Сохранить'
            saveButton.addEventListener('click', () => closeDialog(true))
            actions.append(saveButton)
        }

        dialogWrapper.append(actions)

        document.body.append(dialog)

        dialog.showModal()
        // Убираем фокус с поля ввода
        document.activeElement.blur()

        document.body.classList.add('nst-no-scroll')

        function closeDialog(result = false) {
            dialog.classList.add('nst-hide-dialog')

            setTimeout(() => {
                dialog.remove()
                if (document.getElementsByTagName('dialog').length < 1) document.body.classList.remove('nst-no-scroll')
            }, 500)

            resolve(result)
        }

        contentHTML.closeDialog = closeDialog

        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                closeDialog(false)
            }
        })

        dialog.addEventListener('close', () => closeDialog())
        dialog.addEventListener('error', reject)
    })
}

let settings = document.createElement('li')
let settingsLink = document.createElement('a')
settings.append(settingsLink)

let settingsBody = document.createElement('span')
settingsBody.classList.add('cb-settings')
settingsLink.append(settingsBody)

let settingsIcon = document.createElement('i')
settingsIcon.classList.add('icon-gear', 'nst-settings-icon')
settingsBody.append(settingsIcon)

settingsBody.addEventListener('click', () => {
    let div = document.createElement('div')
    let table = document.createElement('table')

    // Переключатель авто входа
    let autoLoginRow = document.createElement('tr')

    let autoLoginLabelCell = document.createElement('td')

    let autoLoginLabelTitle = document.createElement('div')
    autoLoginLabelTitle.classList.add('nst-label-title')
    autoLoginLabelTitle.textContent = 'Авто вход'
    autoLoginLabelCell.append(autoLoginLabelTitle)

    let autoLoginLabelDescription = document.createElement('div')
    autoLoginLabelDescription.classList.add('nst-label-description')
    autoLoginLabelDescription.textContent = 'Авто вход по логину и паролю.'
    autoLoginLabelCell.append(autoLoginLabelDescription)

    let autoLoginInputCell = document.createElement('td')
    let autoLoginInput = nstSwitch(autoLoginInputCell)
    autoLoginInput.checked = autoLogin

    autoLoginRow.append(autoLoginLabelCell)
    autoLoginRow.append(autoLoginInputCell)

    table.append(autoLoginRow)

    // Поле логина
    let loginNameRow = document.createElement('tr')

    let loginNameLabelCell = document.createElement('td')

    let loginNameLabelTitle = document.createElement('div')
    loginNameLabelTitle.classList.add('nst-label-title')
    loginNameLabelTitle.textContent = 'Логин'
    loginNameLabelCell.append(loginNameLabelTitle)

    let loginNameLabelDescription = document.createElement('div')
    loginNameLabelDescription.classList.add('nst-label-description')
    loginNameLabelDescription.textContent = 'Логин для входа.'
    loginNameLabelCell.append(loginNameLabelDescription)

    let loginNameInputCell = document.createElement('td')
    let loginNameInput = document.createElement('input')
    loginNameInput.type = 'text'
    loginNameInput.value = loginName

    loginNameInputCell.append(loginNameInput)

    loginNameRow.append(loginNameLabelCell)
    loginNameRow.append(loginNameInputCell)

    table.append(loginNameRow)

    // Поле пароля
    let passwordRow = document.createElement('tr')

    let passwordLabelCell = document.createElement('td')

    let passwordLabelTitle = document.createElement('div')
    passwordLabelTitle.classList.add('nst-label-title')
    passwordLabelTitle.textContent = 'Пароль'
    passwordLabelCell.append(passwordLabelTitle)

    let passwordLabelDescription = document.createElement('div')
    passwordLabelDescription.classList.add('nst-label-description')
    passwordLabelDescription.textContent = 'Пароль для входа.'
    passwordLabelCell.append(passwordLabelDescription)

    let passwordInputCell = document.createElement('td')
    let passwordInput = document.createElement('input')
    passwordInput.type = 'password'
    passwordInput.value = password
    passwordInput.addEventListener('focus', () => passwordInput.type = 'text')
    passwordInput.addEventListener('blur', () => passwordInput.type = 'password')

    passwordInputCell.append(passwordInput)

    passwordRow.append(passwordLabelCell)
    passwordRow.append(passwordInputCell)

    table.append(passwordRow)

    // Поле ID школы
    let schoolIdRow = document.createElement('tr')

    let schoolIdLabelCell = document.createElement('td')

    let schoolIdLabelTitle = document.createElement('div')
    schoolIdLabelTitle.classList.add('nst-label-title')
    schoolIdLabelTitle.textContent = 'ID школы'
    schoolIdLabelCell.append(schoolIdLabelTitle)

    let schoolIdLabelDescription = document.createElement('div')
    schoolIdLabelDescription.classList.add('nst-label-description')
    schoolIdLabelDescription.textContent = 'ID школы для входа. Оставьте пустым, если не знаете.'
    schoolIdLabelCell.append(schoolIdLabelDescription)

    let schoolIdInputCell = document.createElement('td')
    let schoolIdInput = document.createElement('input')
    schoolIdInput.type = 'number'
    schoolIdInput.value = schoolId
    schoolIdInput.placeholder = schoolId

    schoolIdInputCell.append(schoolIdInput)

    schoolIdRow.append(schoolIdLabelCell)
    schoolIdRow.append(schoolIdInputCell)

    table.append(schoolIdRow)

    // Переключатель авто пропуска
    let autoSkipRow = document.createElement('tr')

    let autoSkipLabelCell = document.createElement('td')

    let autoSkipLabelTitle = document.createElement('div')
    autoSkipLabelTitle.classList.add('nst-label-title')
    autoSkipLabelTitle.textContent = 'Авто пропуск'
    autoSkipLabelCell.append(autoSkipLabelTitle)

    let autoSkipLabelDescription = document.createElement('div')
    autoSkipLabelDescription.classList.add('nst-label-description')
    autoSkipLabelDescription.textContent = 'Авто пропуск навязчивых уведомлений.'
    autoSkipLabelCell.append(autoSkipLabelDescription)

    let autoSkipInputCell = document.createElement('td')
    let autoSkipInput = nstSwitch(autoSkipInputCell)
    autoSkipInput.checked = autoSkip

    autoSkipRow.append(autoSkipLabelCell)
    autoSkipRow.append(autoSkipInputCell)

    table.append(autoSkipRow)

    function toggleFields() {
        let fields = [loginNameInput, passwordInput, schoolIdInput]
        fields.forEach(field => {
            field.disabled = !autoLoginInput.checked
        })
    }
    toggleFields()
    autoLoginInput.addEventListener('change', toggleFields)

    div.append(table)

    // Сохранение настроек
    nstModal('Настройки', div).then(save => {
        if (save) {
            GM_setValue('autoLogin', autoLoginInput.checked)
            autoLogin = autoLoginInput.checked
            GM_setValue('loginName', loginNameInput.value)
            loginName = loginNameInput.value
            GM_setValue('password', passwordInput.value)
            password = passwordInput.value
            GM_setValue('schoolId', schoolIdInput.value == '' ? appContext.schoolId : schoolIdInput.value)
            schoolId = schoolIdInput.value == '' ? appContext.schoolId : schoolIdInput.value
            GM_setValue('autoSkip', autoSkipInput.checked)
            autoSkip = autoSkipInput.checked
        }
    })

    let previewMarksWrapper = document.createElement('div')
    previewMarksWrapper.classList.add('preview-marks-wrapper')
    div.append(previewMarksWrapper)

    let at = appContext.at
    let weekStart = appContext.weekStart
    let weekEnd = appContext.weekEnd

    // Начало учебного года
    let startDateInput = document.createElement('input')
    startDateInput.type = 'date'
    startDateInput.value = weekStart
    previewMarksWrapper.append(startDateInput)

    // Конец учебного года
    let endDateInput = document.createElement('input')
    endDateInput.type = 'date'
    endDateInput.value = weekEnd
    previewMarksWrapper.append(endDateInput)

    if (weekStart == undefined || weekEnd == undefined) {
        fetch('/webapi/v2/reports/studenttotal', { 'headers': { 'at': at } }).then((response) => {
            return response.json()
        }).then((data) => {
            weekStart = data.filterSources[3].defaultRange.start.substring(0, 10)
            startDateInput.value = weekStart
            weekEnd = data.filterSources[3].defaultRange.end.substring(0, 10)
            endDateInput.value = weekEnd
        })
    }

    // Кнопка предпросмотра оценок
    let previewMarksButton = document.createElement('button')
    previewMarksButton.innerText = 'Предпросмотр оценок'
    previewMarksButton.addEventListener('click', () => {
        let marksTableWrapper = document.createElement('div')
        marksTableWrapper.classList.add('nst-marks-table-wrapper')

        let contentDiv = document.createElement('div')
        contentDiv.classList.add('nst-content')
        contentDiv.append(marksTableWrapper)

        fetch('/webapi/student/diary/init', { 'headers': { 'at': at } }).then((response) => {
            return response.json()
        }).then((data) => {
            let studentId = data.students[0].studentId
            let yearId = appContext.yearId
            let startDate = startDateInput.value
            let endDate = endDateInput.value
            // Запрос дневика
            fetch(`/webapi/student/diary?studentId=${studentId}&weekStart=${startDate}&weekEnd=${endDate}&withLaAssigns=true&yearId=${yearId}`, { 'headers': { 'at': at } }).then((response) => {
                return response.json()
            }).then((data) => {
                // Повторный запрос дневника (с текущей датой для отображения правильной недели, игнорируется)
                let currentDate = date2strf(new Date(), 'yyyy\x01mm\x01dd\x01.')
                fetch(`/webapi/student/diary?studentId=${studentId}&weekStart=${currentDate}&weekEnd=${currentDate}&withLaAssigns=true&yearId=${yearId}`, { 'headers': { 'at': at } })

                let marksTable = document.createElement('table')
                marksTableWrapper.append(marksTable)

                let tableControlsDiv = document.createElement('div')
                tableControlsDiv.classList.add('nst-controls')
                contentDiv.append(tableControlsDiv)

                // Кнопка для выбора режима сортировки
                let sortButton = document.createElement('button')
                sortButton.innerText = 'Сортировать'
                sortButton.addEventListener('click', () => {
                    let sortDiv = document.createElement('div')

                    let sortRowsTitle = document.createElement('p')
                    sortRowsTitle.classList.add('nst-label-title')
                    sortRowsTitle.innerText = 'Сортировка строк'
                    sortDiv.append(sortRowsTitle)

                    let sortRowsOptions = [
                        'Не сортировать',
                        'По имени (по возрастанию)',
                        'По имени (по убыванию)',
                        'По количеству оценок (по возрастанию)',
                        'По количеству оценок (по убыванию)',
                        'По дате (по возрастанию)',
                        'По дате (по убыванию)',
                        'По среднему баллу (по возрастанию)',
                        'По среднему баллу (по убыванию)'
                    ]

                    let selectedSortRowsOption = rowsSortMode

                    sortRowsOptions.forEach((option, index) => {
                        let sortRowsDiv = document.createElement('div')
                        sortRowsDiv.classList.add('nst-radio-wrapper')
                        sortDiv.append(sortRowsDiv)

                        let sortRowsOption = document.createElement('input')
                        sortRowsOption.type = 'radio'
                        sortRowsOption.name = 'sortRows'
                        sortRowsOption.value = index
                        sortRowsOption.id = `sortRows${index}`
                        if (index == rowsSortMode) sortRowsOption.checked = true
                        sortRowsOption.addEventListener('click', () => selectedSortRowsOption = Number(sortRowsOption.value))
                        sortRowsDiv.append(sortRowsOption)

                        let sortRowsOptionLabel = document.createElement('label')
                        sortRowsOptionLabel.htmlFor = `sortRows${index}`
                        sortRowsOptionLabel.innerText = option
                        sortRowsDiv.append(sortRowsOptionLabel)
                    })

                    let sortMarksTitle = document.createElement('p')
                    sortMarksTitle.classList.add('nst-label-title')
                    sortMarksTitle.innerText = 'Сортировка оценок'
                    sortDiv.append(sortMarksTitle)

                    let sortMarksOptions = [
                        'Не сортировать',
                        'По дате (по возрастанию)',
                        'По дате (по убыванию)',
                        'По оценке (по возрастанию)',
                        'По оценке (по убыванию)',
                        'По весу (по возрастанию)',
                        'По весу (по убыванию)'
                    ]

                    let selectedSortMarksOption = marksSortMode

                    sortMarksOptions.forEach((option, index) => {
                        let sortMarksDiv = document.createElement('div')
                        sortMarksDiv.classList.add('nst-radio-wrapper')
                        sortDiv.append(sortMarksDiv)

                        let sortMarksOption = document.createElement('input')
                        sortMarksOption.type = 'radio'
                        sortMarksOption.name = 'sortMarks'
                        sortMarksOption.value = index
                        sortMarksOption.id = `sortMarks${index}`
                        if (index == marksSortMode) sortMarksOption.checked = true
                        sortMarksOption.addEventListener('click', () => selectedSortMarksOption = Number(sortMarksOption.value))
                        sortMarksDiv.append(sortMarksOption)

                        let sortMarksOptionLabel = document.createElement('label')
                        sortMarksOptionLabel.htmlFor = `sortMarks${index}`
                        sortMarksOptionLabel.innerText = option
                        sortMarksDiv.append(sortMarksOptionLabel)
                    })

                    nstModal('Сортировка', sortDiv).then(save => {
                        if (save) {
                            rowsSortMode = selectedSortRowsOption
                            GM_setValue('rowsSortMode', rowsSortMode)
                            marksSortMode = selectedSortMarksOption
                            GM_setValue('marksSortMode', marksSortMode)
                            sortTable()
                        }
                    })
                })

                tableControlsDiv.append(sortButton)

                // Кнопка для выбора
                let selectAllButton = document.createElement('button')
                selectAllButton.innerText = 'Выбрать все'
                selectAllButton.addEventListener('click', () => {
                    for (let row of marksTable.rows) {
                        row.classList.add('nst-row-selected')
                    }
                    updateButtons()
                })
                tableControlsDiv.append(selectAllButton)

                // Кнопка для отмены выбора
                let deselectAllButton = document.createElement('button')
                deselectAllButton.innerText = 'Отменить выбор'
                deselectAllButton.addEventListener('click', () => {
                    for (let row of marksTable.rows) {
                        row.classList.remove('nst-row-selected')
                    }
                    updateButtons()
                })
                tableControlsDiv.append(deselectAllButton)

                // Кнопка для создания строки
                let addRowButton = document.createElement('button')
                addRowButton.innerText = 'Cоздать'
                addRowButton.addEventListener('click', () => {
                    let selectedRows = marksTable.querySelectorAll('.nst-row-selected')
                    let newRow = createRow()
                    if (selectedRows.length > 0) {
                        selectedRows[selectedRows.length - 1].after(newRow)
                        selectedRows.forEach(row => row.classList.remove('nst-row-selected'))
                    } else {
                        marksTable.prepend(newRow)
                    }
                    cookRow(newRow)

                    newRow.classList.add('nst-row-selected')
                    newRow.scrollIntoView({ behavior: "smooth" })
                    updateButtons()
                })
                tableControlsDiv.append(addRowButton)

                // Кнопка для клонирования строки
                let cloneRowButton = document.createElement('button')
                cloneRowButton.innerText = 'Клонировать'
                cloneRowButton.addEventListener('click', () => {
                    let selectedRows = marksTable.querySelectorAll('.nst-row-selected')
                    selectedRows.forEach(row => {
                        let clonedRow = row.cloneNode(true)
                        row.after(clonedRow)
                        cookRow(clonedRow)

                        let marksCell = clonedRow.querySelector('.nst-marks-cell')
                        Array.from(marksCell.children).forEach(markDiv => {
                            cookMark(markDiv)
                        })

                        row.classList.remove('nst-row-selected')
                    })
                    updateButtons()
                })
                tableControlsDiv.append(cloneRowButton)

                // Кнопка для удаления строки
                let removeRowButton = document.createElement('button')
                removeRowButton.innerText = 'Удалить'
                removeRowButton.addEventListener('click', () => {
                    let selectedRows = marksTable.querySelectorAll('.nst-row-selected')
                    selectedRows.forEach(row => row.remove())
                    updateButtons()
                })
                tableControlsDiv.append(removeRowButton)

                // Кнопка для добавления оценки
                let addMarkButton = document.createElement('button')
                addMarkButton.innerText = 'Добавить оценку'
                addMarkButton.addEventListener('click', () => {
                    let selectedRows = marksTable.querySelectorAll('.nst-row-selected')
                    if (selectedRows.length == 0) return

                    let [templateTable, markInput, weightInput] = markModalTemplate(5, 20)

                    nstModal('Добавление оценки', templateTable).then(save => {
                        if (save) {
                            selectedRows.forEach(row => {
                                let mark = createMark(markInput.value, weightInput.value)
                                mark.dataset.assignment = JSON.stringify({ "date": new Date().toLocaleDateString("en-CA") })
                                row.querySelector('.nst-marks-cell').append(mark)
                                cookMark(mark)
                                highlightMark(mark)
                                row.classList.remove('nst-row-selected')
                            })

                            updateButtons()
                        }
                    })
                })
                tableControlsDiv.append(addMarkButton)

                // Функция для создания оценки
                function createMark(mark, weight, fullAssignment = null) {
                    let markDiv = document.createElement('div')
                    if (fullAssignment) markDiv.dataset.assignment = JSON.stringify(fullAssignment)
                    markDiv.classList.add('nst-mark')

                    let markValue = document.createElement('p')
                    markValue.innerText = mark
                    markValue.classList.add('nst-mark-value')
                    markDiv.append(markValue)

                    let weightValue = document.createElement('p')
                    weightValue.innerText = weight
                    weightValue.classList.add('nst-weight-value')
                    markDiv.append(weightValue)

                    return markDiv
                }

                // Функция для создания строки
                function createRow(name = '') {
                    let row = document.createElement('tr')

                    let nameCell = document.createElement('td')
                    let nameInput = document.createElement('input')
                    nameInput.value = name
                    nameInput.classList.add('nst-name-input')
                    nameInput.placeholder = "Имя предмета"
                    nameCell.append(nameInput)
                    row.append(nameCell)

                    let marksCell = document.createElement('td')
                    marksCell.classList.add('nst-marks-cell')
                    row.append(marksCell)

                    let totalCell = document.createElement('td')
                    totalCell.classList.add('nst-total-cell')
                    row.append(totalCell)

                    return row
                }

                // Функция для создания шаблона модального окна
                function markModalTemplate(mark, weight) {
                    let templateTable = document.createElement('table')

                    let markRow = document.createElement('tr')
                    templateTable.append(markRow)

                    let markLabelCell = document.createElement('td')
                    markRow.append(markLabelCell)

                    let markLabelTitle = document.createElement('div')
                    markLabelTitle.classList.add('nst-label-title')
                    markLabelTitle.textContent = 'Оценка'
                    markLabelCell.append(markLabelTitle)

                    let markInputCell = document.createElement('td')
                    markInputCell.classList.add('nst-flex')
                    markRow.append(markInputCell)

                    let markInput = document.createElement('input')
                    markInput.readOnly = true
                    markInput.value = mark
                    markInputCell.append(markInput)

                    let markSelectorsDiv = document.createElement('div')
                    markSelectorsDiv.classList.add('nst-mark-selectors')
                    markInputCell.append(markSelectorsDiv)

                    let marks = ['5', '4', '3', '2', dot]

                    marks.forEach(mark => {
                        let markButton = document.createElement('button')

                        markButton.innerText = mark
                        markButton.addEventListener('click', () => markInput.value = mark)
                        markSelectorsDiv.append(markButton)
                    })

                    let weightRow = document.createElement('tr')
                    templateTable.append(weightRow)

                    let weightLabelCell = document.createElement('td')
                    weightRow.append(weightLabelCell)

                    let weightLabelTitle = document.createElement('div')
                    weightLabelTitle.classList.add('nst-label-title')
                    weightLabelTitle.textContent = 'Вес'
                    weightLabelCell.append(weightLabelTitle)

                    let weightInputCell = document.createElement('td')
                    weightInputCell.classList.add('nst-flex')
                    weightRow.append(weightInputCell)

                    let weightInput = document.createElement('input')
                    weightInput.type = 'number'
                    weightInput.value = weight
                    weightInputCell.append(weightInput)

                    return [templateTable, markInput, weightInput]
                }

                // Подсветка оценки
                /** @param {HTMLDivElement} mark The date */
                function highlightMark(mark) {
                    mark.animate([
                        { opacity: 1 },
                        { opacity: 0 },
                        { opacity: 1 },
                        { opacity: 0 },
                        { opacity: 1 },
                        { opacity: 0 },
                        { opacity: 1 }
                    ], {
                        duration: 3000,
                        fill: 'forwards'
                    })
                    sortTable()
                }

                // Подготовка оценки
                function cookMark(mark) {
                    let markValue = mark.querySelector('.nst-mark-value')
                    let weightValue = mark.querySelector('.nst-weight-value')

                    mark.addEventListener('click', () => {
                        let modalDiv = document.createElement('div')
                        let [templateTable, markInput, weightInput] = markModalTemplate(markValue.innerText, weightValue.innerText)
                        modalDiv.append(templateTable)

                        let controlsDiv = document.createElement('div')
                        controlsDiv.classList.add('nst-controls')
                        modalDiv.append(controlsDiv)

                        let cloneMarkButton = document.createElement('button')
                        cloneMarkButton.innerText = 'Клонировать'
                        controlsDiv.append(cloneMarkButton)
                        cloneMarkButton.addEventListener('click', () => {
                            modalDiv.closeDialog(true)
                            let newMark = mark.cloneNode(true)
                            mark.after(newMark)
                            cookMark(newMark)
                            highlightMark(newMark)
                        })

                        let deleteMarkButton = document.createElement('button')
                        deleteMarkButton.innerText = 'Удалить'
                        controlsDiv.append(deleteMarkButton)
                        deleteMarkButton.addEventListener('click', () => {
                            mark.remove()
                            modalDiv.closeDialog(false)
                        })

                        if (mark.dataset.assignment) {
                            let assignment = JSON.parse(mark.dataset.assignment)

                            if (assignment.mark && assignment.weight) {
                                let restoreMarkButton = document.createElement('button')
                                restoreMarkButton.innerText = 'Восстановить'
                                controlsDiv.append(restoreMarkButton)
                                restoreMarkButton.addEventListener('click', () => {
                                    markInput.value = assignment.mark
                                    weightInput.value = assignment.weight
                                })
                            }

                            let assignmentMarkButton = document.createElement('button')
                            assignmentMarkButton.innerText = 'Подробности'
                            controlsDiv.append(assignmentMarkButton)
                            assignmentMarkButton.addEventListener('click', () => {
                                let assignmentTable = document.createElement('table')

                                let translations = {
                                    'id': 'ID задания',
                                    'assignmentName': 'Тема задания',
                                    'activityName': 'Имя деятельности',
                                    'problemName': 'Название задачи',
                                    'studentId': 'ID ученика',
                                    'subjectGroup.id': 'ID предмета',
                                    'subjectGroup.name': 'Название предмета',
                                    'teachers.0.id': 'ID учителя',
                                    'teachers.0.name': 'Имя учителя',
                                    'productId': 'ID продукта',
                                    'isDeleted': 'Удалено',
                                    'weight': 'Вес',
                                    'date': 'Дата',
                                    'description': 'Описание',
                                    'mark': 'Оценка',
                                    'typeId': 'ID типа задания',
                                    'type': 'Тип задания'
                                }

                                for (let key in assignment) {
                                    let translation = translations[key] || key
                                    let value = assignment[key]
                                    value = value === true ? "Да" : value === false ? "Нет" : value

                                    let assignmentRow = document.createElement('tr')
                                    assignmentTable.append(assignmentRow)

                                    let assignmentLabelCell = document.createElement('td')
                                    assignmentLabelCell.innerText = translation
                                    assignmentRow.append(assignmentLabelCell)

                                    let assignmentInputCell = document.createElement('td')
                                    assignmentInputCell.classList.add('nst-flex')
                                    assignmentRow.append(assignmentInputCell)

                                    let assignmentInput

                                    if (key === 'date') {
                                        assignmentInput = document.createElement('input')
                                        assignmentInput.readOnly = true
                                        assignmentInput.type = 'date'
                                        assignmentInput.value = value
                                    } else if (typeof value === 'number') {
                                        assignmentInput = document.createElement('input')
                                        assignmentInput.readOnly = true
                                        assignmentInput.type = 'number'
                                        assignmentInput.value = value
                                    } else {
                                        assignmentInput = document.createElement('div')
                                        assignmentInput.innerText = value
                                        assignmentInput.classList.add('nst-area')
                                    }

                                    assignmentInputCell.append(assignmentInput)
                                }

                                nstModal('Подробности задания', assignmentTable, false)
                            })
                        }

                        nstModal('Редактирование оценки', modalDiv).then(save => {
                            if (save) {
                                markValue.innerText = markInput.value
                                weightValue.innerText = weightInput.value
                                highlightMark(mark)
                            }
                        })
                    })
                }

                // Обновление состояния кнопок
                function updateButtons() {
                    if (marksTable.querySelectorAll('.nst-row-selected').length > 0) {
                        addMarkButton.disabled = false
                        cloneRowButton.disabled = false
                        removeRowButton.disabled = false
                    } else {
                        addMarkButton.disabled = true
                        cloneRowButton.disabled = true
                        removeRowButton.disabled = true
                    }
                }

                updateButtons()

                function cookRow(row) {
                    let marksCell = row.querySelector('.nst-marks-cell')
                    let totalCell = row.querySelector('.nst-total-cell')

                    // Изменение цвета для оценок и последующий расчет среднего балла
                    function calculateTotalScore() {
                        let markSum = 0
                        let weightSum = 0

                        Array.from(marksCell.children).forEach(markDiv => {
                            let markValue = markDiv.querySelector('.nst-mark-value')
                            let weightValue = markDiv.querySelector('.nst-weight-value')
                            let mark = markValue.innerText.replaceAll(dot, dotMark)
                            let weight = Number(weightValue.innerText)

                            markValue.classList.remove(...['nst-mark-excellent', 'nst-mark-good', 'nst-mark-average', 'nst-mark-bad'])
                            markValue.classList.add(getMarkClass(mark))

                            markSum += mark * weight
                            weightSum += weight
                        })

                        totalCell.innerText = weightSum ? Number((markSum / weightSum).toFixed(2)) : 0
                        totalCell.classList.remove(...['nst-mark-excellent', 'nst-mark-good', 'nst-mark-average', 'nst-mark-bad'])
                        totalCell.classList.add(getMarkClass(totalCell.innerText))
                    }

                    // Получение цвета оценки
                    function getMarkClass(mark) {
                        return Number(mark) >= 4.60 ? 'nst-mark-excellent' : Number(mark) >= 3.60 ? 'nst-mark-good' : Number(mark) >= 2.60 ? 'nst-mark-average' : 'nst-mark-bad'
                    }

                    let observer = new MutationObserver(() => {
                        calculateTotalScore()
                    })
                    observer.observe(marksCell, { childList: true, subtree: true })

                    calculateTotalScore()

                    // Выделение строки при нажатии на балл
                    totalCell.addEventListener('click', () => {
                        row.classList.toggle('nst-row-selected')
                        updateButtons()
                    })
                }

                // Сортировка таблицы
                function sortTable() {
                    let rows = Array.from(marksTable.rows)

                    // Сортировка строк таблицы
                    if (rowsSortMode != 0) {
                        rows.sort((rowA, rowB) => {
                            let nameA = rowA.querySelector('.nst-name-input').value
                            let nameB = rowB.querySelector('.nst-name-input').value
                            let marksA = rowA.querySelectorAll('.nst-mark')
                            let marksB = rowB.querySelectorAll('.nst-mark')
                            let totalA = Number(rowA.querySelector('.nst-total-cell').innerText)
                            let totalB = Number(rowB.querySelector('.nst-total-cell').innerText)
                            let dateA = marksA.length > 0 ? JSON.parse(marksA[0].dataset.assignment).date : null
                            let dateB = marksB.length > 0 ? JSON.parse(marksB[0].dataset.assignment).date : null

                            switch (rowsSortMode) {
                                case 2: return nameB.localeCompare(nameA)
                                case 3: return marksA.length - marksB.length
                                case 4: return marksB.length - marksA.length
                                case 5: return dateA > dateB ? 1 : (dateA < dateB ? -1 : 0)
                                case 6: return dateA < dateB ? 1 : (dateA > dateB ? -1 : 0)
                                case 7: return totalA - totalB
                                case 8: return totalB - totalA
                                default: return nameA.localeCompare(nameB)
                            }
                        })

                        // Обновление таблицы
                        for (let row of rows) marksTable.appendChild(row)
                    }

                    // Сортировка оценок в каждой строке
                    if (marksSortMode != 0) {
                        for (let row of rows) {
                            let marks = Array.from(row.querySelectorAll('.nst-mark'))

                            marks.sort((markA, markB) => {
                                let dateA = JSON.parse(markA.dataset.assignment).date
                                let dateB = JSON.parse(markB.dataset.assignment).date
                                let valueA = markA.querySelector('.nst-mark-value').innerText === dot ? dotMark : Number(markA.querySelector('.nst-mark-value').innerText)
                                let valueB = markB.querySelector('.nst-mark-value').innerText === dot ? dotMark : Number(markB.querySelector('.nst-mark-value').innerText)
                                let weightA = Number(markA.querySelector('.nst-weight-value').innerText)
                                let weightB = Number(markB.querySelector('.nst-weight-value').innerText)

                                switch (marksSortMode) {
                                    case 2: return dateA < dateB ? 1 : (dateA > dateB ? -1 : 0)
                                    case 3: return valueA - valueB
                                    case 4: return valueB - valueA
                                    case 5: return weightA - weightB
                                    case 6: return weightB - weightA
                                    default: return dateA > dateB ? 1 : (dateA < dateB ? -1 : 0)
                                }
                            })

                            // Обновление строки
                            let marksContainer = row.querySelector('.nst-marks-cell')
                            for (let mark of marks) marksContainer.appendChild(mark)
                        }
                    }
                }

                // Функция для подготовки данных для отправки
                function flattenJson(json) {
                    let result = {}

                    function flatten(obj, prefix = '') {
                        for (let key in obj) {
                            if (typeof obj[key] === 'object' && obj[key] !== null) {
                                flatten(obj[key], prefix + key + '.')
                            } else {
                                result[prefix + key] = obj[key]
                            }
                        }
                    }

                    flatten(json)
                    return result
                }

                fetch('/webapi/grade/assignment/types').then((response) => {
                    return response.json()
                }).then((types) => {
                    let promises = []
                    for (let day of data.weekDays) {
                        for (let lesson of day.lessons) {
                            if (Array.isArray(lesson.assignments)) {
                                for (let assignment of lesson.assignments) {
                                    if (assignment.mark) {
                                        let promise = fetch(`/webapi/student/diary/assigns/${assignment.id}`, { 'headers': { 'at': at } }).then((response) => {
                                            return response.json()
                                        }).then((fullAssignment) => {

                                            // Модификация данных в удобный формат
                                            fullAssignment.mark = assignment.mark.mark
                                            if (fullAssignment.mark == null) fullAssignment.mark = dot
                                            fullAssignment.studentId = assignment.mark.studentId
                                            fullAssignment.typeId = assignment.typeId
                                            fullAssignment.date = fullAssignment.date.substring(0, 10)

                                            let item = types.find(data => data.id == fullAssignment.typeId)
                                            fullAssignment.type = item.name

                                            fullAssignment = flattenJson(fullAssignment)

                                            // Удаление ненужных полей
                                            for (let key in fullAssignment) {
                                                if (fullAssignment[key] == null) delete fullAssignment[key]
                                            }

                                            // Объявление / создание ряда
                                            let row = Array.from(marksTable.rows).find(r => r.querySelector('.nst-name-input').value == lesson.subjectName)
                                            if (!row) {
                                                row = createRow(lesson.subjectName)
                                                marksTable.append(row)
                                                cookRow(row)
                                            }

                                            // Добавление оценки
                                            let createdMark = createMark(fullAssignment.mark, fullAssignment.weight, fullAssignment)
                                            row.querySelector('.nst-marks-cell').append(createdMark)
                                            cookMark(createdMark)
                                            createdMark.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000 })

                                            return fullAssignment
                                        })
                                        promises.push(promise)
                                    }
                                }
                            }
                        }
                    }
                    return Promise.all(promises)
                }).then(() => {
                    sortTable()
                }).catch(err => nstModal('Произошла ошибка', err, false))
            }).catch(err => nstModal('Произошла ошибка', err, false))
        }).catch(err => nstModal('Произошла ошибка', err, false))

        nstModal('Предпросмотр оценок', contentDiv, false)
    })
    previewMarksWrapper.append(previewMarksButton)
})

waitForElement('.top-right-menu').then((element) => {
    element.prepend(settings)
})

GM_addStyle(`
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');

:root {
    --nst-primary: #64a0c8;
    --nst-secondary: #415f78;
    --nst-tertiary: #374b5f;
    --nst-quaternary: #232a32;
    --nst-quinary: #1a1c1e;
    --nst-senary: #141618;

    --nst-text-primary: #c8e6ff;
    --nst-text-secondary: #aadcff;
    --nst-text-tertiary: #87afc8;
}

.nst-no-scroll {
    touch-action: none;
    overflow: hidden;
}

.nst-flex {
    display: flex;
    flex-direction: column;
}

.nst-flex input {
    flex: 1;
}

.nst-settings-icon {
    display: flex !important;
    justify-content: center;
    color: white;
    scale: 0.75;
}

.nst-dialog {
    border: none;
    outline: none;
    background: var(--nst-quinary);
    border-radius: 32px;
    box-shadow: rgba(0, 0, 0, 0.25) 0 0 25px;
    padding: 0;
}

.nst-dialog-wrapper {
    display: flex;
    flex-direction: column;
    padding: 24px;
    max-height: calc(100vh - 48px);
    max-width: calc(100vw - 48px);
}

.nst-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.nst-dialog .preview-marks-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 16px;
    gap: 8px;
}

.nst-dialog * {
    font-family: 'Nunito';
    color: var(--nst-text-secondary);
}

.nst-dialog .nst-headline:first-child {
    margin-top: 0px;
}

.nst-dialog .nst-headline {
    color: var(--nst-text-primary);
    font-size: 1.5em;
    margin: 0px;
    margin-bottom: 16px;
}

.nst-dialog .nst-actions {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.nst-dialog button {
    cursor: pointer;
    color: var(--button-color);
    border-radius: 28px;
    padding: 12px;
    margin: 0;
    border: none;
    outline: none;
    transition: 0.2s;
    background: var(--nst-quaternary);
}

.nst-dialog button:not([disabled]):hover {
    background: var(--nst-tertiary);
}

.nst-dialog button:not([disabled]):active {
    background: var(--nst-secondary);
}

.nst-dialog button[disabled] {
    opacity: 0.5;
    cursor: default;
}

.nst-dialog input {
    text-shadow: none;
    box-shadow: none;
    line-height: normal;
    border: 2px solid var(--nst-tertiary);
    color: var(--nst-text-secondary);
    border-radius: 16px;
    padding: 12px;
    background: var(--nst-quaternary);
    transition: 0.2s;
}

.nst-dialog :not(.preview-marks-wrapper) > input {
    width: 100%;
    min-width: 100px;
}

.nst-dialog input::-webkit-outer-spin-button,
.nst-dialog input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.nst-dialog input[disabled] {
    border: 2px solid var(--nst-tertiary);
    opacity: 0.5;
}

.nst-dialog input[disabled]:hover,
.nst-dialog input[disabled]:focus,
.nst-dialog input[disabled]:active {
    border: 2px solid transparent;
    border-radius: 16px;
    color: var(--nst-text-secondary);
    box-shadow: none;
    padding: 12px;
}

.nst-dialog input:hover {
    border: 2px solid transparent;
    color: var(--nst-text-secondary);
    box-shadow: none;
}

.nst-dialog input:focus,
.nst-dialog input:active {
    border: 2px solid transparent;
    color: var(--nst-text-secondary);
    background: var(--nst-tertiary);
    box-shadow: none;
}

.nst-dialog .nst-radio-wrapper {
    padding: 4px;
}

.nst-dialog input[type="radio"] {
    display: none;
}

.nst-dialog input[type="radio"] + label {
    padding-left: 20px;
}

.nst-dialog input[type="radio"] + label:before {
    content: "";
    display: inline-block;
    position: absolute;
    margin: 2px;
    left: 22px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid var(--nst-tertiary);
    background: var(--nst-quaternary);
}

.nst-dialog input[type="radio"]:checked + label:before {
    background-color: var(--nst-primary);
    border-color: var(--nst-primary);
}

.nst-dialog .nst-area {
    border-radius: 16px;
    background: var(--nst-quaternary);
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
}

.nst-dialog .nst-switch {
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
    margin: 0;
}

.nst-dialog .nst-switch .nst-hide {
    opacity: 0;
    width: 0;
    height: 0;
}

.nst-dialog .nst-switch div {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--nst-quaternary);
    border: 2px solid var(--nst-tertiary);
    border-radius: 24px;
    transition: .4s;
}

.nst-dialog .nst-switch div:before {
    position: absolute;
    content: "";
    height: 1.2em;
    width: 1.2em;
    left: calc(0.4em - 2px);
    top: calc(0.4em - 2px);
    background: var(--nst-tertiary);
    border-radius: 50%;
    transition: .4s;
}

.nst-dialog .nst-switch input:checked + div {
    background: var(--nst-primary);
    border: 2px solid transparent;
}

.nst-dialog .nst-switch input:checked + div:before {
    transform: translateX(1.4em);
    background: rgba(0, 0, 0, 0.5);
}

.nst-dialog table {
    margin-left: auto;
    margin-right: auto;
}

.nst-dialog td {
    padding: 8px;
    position: relative;
}

.nst-total-cell {
    right: 0;
    position: sticky !important;
    cursor: pointer;
    background: var(--nst-quinary);
    transition: 0.1s;
}

.nst-dialog tr {
    transition: 0.2s;
}

.nst-dialog tr.nst-row-selected {
    background: var(--nst-quaternary);
}

tr.nst-row-selected .nst-total-cell:last-child {
    background: inherit;
}

.nst-dialog .nst-marks-table-wrapper {
    overflow: auto;
    margin-left: auto;
    margin-right: auto;
    border-radius: 24px;
    max-width: 100%;
}

.nst-dialog .nst-marks-table-wrapper table {
    margin-left: initial;
    margin-right: initial;
}

.nst-marks-cell {
    display: flex;
}

.nst-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 8px;
    padding-top: 8px;
}

.nst-controls button {
    flex-grow: 1;
}

.nst-dialog[open] {
    animation: nst-show-dialog 0.5s forwards;
}

.nst-dialog.nst-hide-dialog {
    animation: nst-hide-dialog 0.5s forwards;
}

@keyframes nst-show-dialog {
    from {
        opacity: 0;
        transform: scale(0.5);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes nst-hide-dialog {
    to {
        opacity: 0;
        transform: scale(0.5);
    }
}

.nst-dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    animation: none;
}

.nst-dialog[open]::backdrop {
    animation: nst-show-opacity 0.5s forwards;
}

.nst-dialog.nst-hide-dialog::backdrop {
    animation: nst-hide-opacity 0.5s forwards;
}

@keyframes nst-show-opacity {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes nst-hide-opacity {
    to {
        opacity: 0;
    }
}

.nst-label-title {
    font-size: 18px;
}

.nst-label-description {
    font-size: 12px;
    color: var(--nst-text-tertiary);
}

.nst-mark {
    min-width: 24px;
    display: flex;
    flex-flow: column wrap;
    align-items: stretch;
    cursor: pointer;
}

.nst-mark-selectors {
    display: flex;
    gap: 8px;
    padding-top: 8px;
    justify-content: space-between;
}

.nst-mark p {
    text-align: center;
    margin: 0px;
}

.nst-mark p:first-child {
    font-size: large;
}

.nst-mark p:nth-child(2) {
    color: gray;
    font-size: x-small;
}

.nst-mark-highlight {
    animation: nst-mark-highlight 3s forwards;
}

@keyframes nst-mark-highlight {
    0% {
        opacity: 1;
    } 16% {
        opacity: 0;
    } 32% {
        opacity: 1;
    } 48% {
        opacity: 0;
    } 64% {
        opacity: 1;
    } 80% {
        opacity: 0;
    } 96% {
        opacity: 1;
    }
}

.nst-mark-excellent {
    color: #96e400;
}

.nst-mark-good {
    color: #00c8ff;
}

.nst-mark-average {
    color: #f09600;
}

.nst-mark-bad {
    color: #ff3232;
}

.nst-dialog ::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

.nst-dialog ::-webkit-scrollbar-track {
  background: var(--nst-senary);
  border-radius: 10px;
}

.nst-dialog ::-webkit-scrollbar-corner {
  background: transparent;
}

.nst-dialog ::-webkit-scrollbar-thumb {
  background-color: var(--nst-quaternary);
  border: 4px solid var(--nst-senary);
  border-radius: 10px;
}

.nst-dialog ::-webkit-scrollbar-thumb:hover {
  background-color: var(--nst-tertiary);
}

.nst-dialog ::-webkit-scrollbar-thumb:active {
  background-color: var(--nst-secondary);
}
`)