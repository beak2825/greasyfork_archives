// ==UserScript==
// @name         CFCodereviewer
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Codereview codeforces
// @author       kdzestelov
// @license MIT
// @match        *://*codeforces.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/513464/CFCodereviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/513464/CFCodereviewer.meta.js
// ==/UserScript==

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw7eHpt-69rYbxfpFrcv6n_JGU_jT-tx0p6RdlwKITLn9OojA9tNH60ciaYW3CAQqO46w/exec';

const SUB_RJ_BUTTON_CLASS = "submission-rj-button";
const SUB_AC_BUTTON_CLASS = "submission-ac-button";
const SUB_RG_BUTTON_CLASS = "submission-rejudge-form";
const SUB_COMMENT_SEND_BUTTON_CLASS = "submission-comment-send-form";

function getLast(href) {
    return href.split("/").pop()
}

function getGroupUrl() {
    const url = window.location.href
    const contestIndex = url.indexOf("contest");
    if (contestIndex === -1) return url;
    return url.substring(0, contestIndex);
}

const getContestUrl = () => {
    const url = window.location.href
    const statusIndex = url.indexOf("status");
    if (statusIndex === -1) return url;
    return url.substring(0, statusIndex);
}

function getContestId() {
    const url = window.location.href
    const contestIndex = url.indexOf("contest");
    if (contestIndex === -1) return "";
    return url.substring(contestIndex + 8, contestIndex + 14);
}

function wrap(text) {
    return '[' + text + ']';
}

function getSubRjButton(subId) {
    return $("[submissionid=" + subId + "] ." + SUB_RJ_BUTTON_CLASS);
}

function getSubAcButton(subId) {
    return $("[submissionid=" + subId + "] ." + SUB_AC_BUTTON_CLASS);
}

function getSubRgButton(subId) {
    return $("[submissionid=" + subId + "] ." + SUB_RG_BUTTON_CLASS);
}

function getCommentSubAcButton(subId) {
    return $("tr[data-submission-id=" + subId + "] ." + SUB_COMMENT_SEND_BUTTON_CLASS)
}

// Функция для блокировки всех кнопок выше кода (AC, RJ, RG)
function disableTopButtons(subId) {
    console.log(`[disableTopButtons] Блокирую кнопки для посылки ${subId}`);
    const acButton = getSubAcButton(subId);
    const rjButton = getSubRjButton(subId);
    const rgButton = getSubRgButton(subId);

    const acCount = acButton.length;
    const rjCount = rjButton.length;
    const rgCount = rgButton.length;

    acButton.each(function() {
        this.disabled = true;
        this.style.backgroundColor = "#999";
        this.style.borderColor = "#999";
        this.style.cursor = "not-allowed";
    });

    rjButton.each(function() {
        this.disabled = true;
        this.style.backgroundColor = "#999";
        this.style.borderColor = "#999";
        this.style.cursor = "not-allowed";
    });

    rgButton.each(function() {
        this.disabled = true;
        this.style.backgroundColor = "#999";
        this.style.borderColor = "#999";
        this.style.cursor = "not-allowed";
    });

    console.log(`[disableTopButtons] Заблокировано: AC=${acCount}, RJ=${rjCount}, RG=${rgCount}`);
}

// Функция для разблокировки всех кнопок выше кода
function enableTopButtons(subId) {
    console.log(`[enableTopButtons] Разблокирую кнопки для посылки ${subId}`);
    const acButton = getSubAcButton(subId);
    const rjButton = getSubRjButton(subId);
    const rgButton = getSubRgButton(subId);

    const isAccepted = isSubAccepted(subId);
    const acColor = isAccepted ? "#81D718" : "#13aa52";

    const acCount = acButton.length;
    const rjCount = rjButton.length;
    const rgCount = rgButton.length;

    acButton.each(function() {
        this.disabled = false;
        this.style.backgroundColor = acColor;
        this.style.borderColor = acColor;
        this.style.cursor = "pointer";
    });

    rjButton.each(function() {
        this.disabled = false;
        this.style.backgroundColor = "#EC431A";
        this.style.borderColor = "#EC431A";
        this.style.cursor = "pointer";
    });

    rgButton.each(function() {
        this.disabled = false;
        this.style.backgroundColor = "#176F95";
        this.style.borderColor = "#176F95";
        this.style.cursor = "pointer";
    });

    console.log(`[enableTopButtons] Разблокировано: AC=${acCount}, RJ=${rjCount}, RG=${rgCount}`);
}

function getProblemIndex(subId) {
    return getLast($("tr[data-submission-id=" + subId + "] .status-small a").attr('href'));
}

function getSubRow(subId) {
    return $('tr[data-submission-id="' + subId + '"]')
}

function getHandle(subId) {
    return $("tr[data-submission-id=" + subId + "] .status-party-cell").text().trim();
}

function getAllSubmissionsRow() {
    return $(".status-frame-datatable tbody tr")
}

function getSubmissionRow(subId) {
    return $(".status-frame-datatable tbody tr[data-submission-id=" + subId + "]")
}

function getSubsId() {
    return $(".information-box-link")
}

function getCorrectSubs() {
    return $(".information-box-link .verdict-accepted").parent();
}

function getSubButtons() {
    return $(".submission-action-form");
}

function getSideBar() {
    return $("div[id=sidebar]")
}

function getFilterBox() {
    return $(".status-filter-box");
}

const getSheetSubmissions = () => {
    const fullUrl = SHEET_URL + "?type=get"
    console.log(`[getSheetSubmissions] Начинаю загрузку посылок из Google Sheets`);
    console.log(`[getSheetSubmissions] URL: ${fullUrl}`);
    GM_xmlhttpRequest({
        method: 'GET',
        url: fullUrl,
        onload: (response) => {
            console.log(`[getSheetSubmissions] Получен ответ, status: ${response.status}`);
            if (response.status === 200) {
                try {
                    var submissions = JSON.parse(response.responseText)
                    submissions = JSON.parse(response.responseText)
                    localStorage.setItem("c_status", JSON.stringify(submissions));
                    console.log(`[getSheetSubmissions] Успешно загружено ${submissions.length} посылок:`, submissions);
                } catch (e) {
                    console.error(`[getSheetSubmissions] Ошибка парсинга ответа:`, e);
                    console.error(`[getSheetSubmissions] Ответ:`, response.responseText);
                }
            } else {
                console.error(`[getSheetSubmissions] Ошибка загрузки: status=${response.status}`);
                console.error(`[getSheetSubmissions] Ответ:`, response.responseText);
            }
        },
        onerror: (error) => {
            console.error(`[getSheetSubmissions] Ошибка сети:`, error);
        }
    });
}

const acceptSheetSubmission = (subId, button, type, onSuccess, onError) => {
    const full_url = SHEET_URL + "?type=" + type + "&value=" + subId;
    console.log("acceptSheetSubmission вызвана для subId:", subId, "type:", type, "hasOnSuccess:", !!onSuccess, "hasOnError:", !!onError);
    GM_xmlhttpRequest({
        method: 'GET',
        url: full_url,
        timeout: 5000,
        onload: (response) => {
            console.log("acceptSheetSubmission onload, status:", response.status, "subId:", subId);
            if (response.status === 200) {
                const submissions = getSubmissions();
                if (!submissions.includes(subId)) {
                    submissions.push(subId);
                    localStorage.setItem("c_status", JSON.stringify(submissions));
                }
                if (button) {
                    button.style.backgroundColor = "#81D718";
                    button.style.borderColor = "#81D718";
                    button.innerText = (type === "star" ? "🔥" : "Похвалить");
                }
                if (showed_codes[subId] != null && showed_codes[subId].showed) {
                    showed_codes[subId]["showButton"].click();
                }
                // Вызываем колбэк успеха после всех операций
                console.log("acceptSheetSubmission вызываю onSuccess для subId:", subId);
                if (onSuccess) {
                    try {
                        onSuccess();
                    } catch (e) {
                        console.error("Ошибка в колбэке onSuccess:", e);
                    }
                } else {
                    console.warn("acceptSheetSubmission: onSuccess не предоставлен для subId:", subId);
                }
            } else {
                console.log("acceptSheetSubmission ошибка статуса:", response.status);
                if (button) {
                    button.innerText = "Ошибка!";
                }
                console.error(response);
                // Вызываем колбэк ошибки
                console.log("acceptSheetSubmission вызываю onError для subId:", subId);
                if (onError) {
                    try {
                        onError();
                    } catch (e) {
                        console.error("Ошибка в колбэке onError:", e);
                    }
                } else {
                    console.warn("acceptSheetSubmission: onError не предоставлен для subId:", subId);
                }
            }
        },
        onerror: (error) => {
            console.error("acceptSheetSubmission onerror для subId:", subId, error);
            if (button) {
                button.innerText = "Ошибка!";
            }
            // Вызываем колбэк ошибки
            console.log("acceptSheetSubmission вызываю onError из onerror для subId:", subId);
            if (onError) {
                try {
                    onError();
                } catch (e) {
                    console.error("Ошибка в колбэке onError:", e);
                }
            } else {
                console.warn("acceptSheetSubmission: onError не предоставлен для subId:", subId);
            }
        }
    });
}
const getSubmissions = () => {
    return JSON.parse(localStorage.getItem("c_status") ?? "[]");
};
const isSubAccepted = (subId) => {
    return getSubmissions().includes(subId)
}

const acceptSubmission = (subId, button) => {
    const isAlreadyAccepted = isSubAccepted(subId);
    const type = isAlreadyAccepted ? "star" : "accept";
    console.log(`[acceptSubmission] Принимаю посылку ${subId}, тип: ${type}, уже принята: ${isAlreadyAccepted}`);
    acceptSheetSubmission(subId, button, type);
}

const showed_codes = {};

// Единые стили для кнопок в таблице посылок
const submissionButtonStyles = {
    base: {
        border: "1px solid",
        borderRadius: "6px",
        color: "#fff",
        cursor: "pointer",
        fontSize: "1.37rem",
        fontWeight: "500",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
    },
    showCode: {
        backgroundColor: "#176F95",
        borderColor: "#176F95",
        padding: "0.6em 1em",
        marginTop: "4px",
        marginBottom: "4px",
        width: "100%"
    },
    accept: {
        padding: "0.55em 0.9em",
        margin: "5px 5px 0 0",
        width: "59%"
    },
    reject: {
        backgroundColor: "#EC431A",
        borderColor: "#EC431A",
        padding: "0.55em 0.9em",
        width: "37%"
    },
    rejudge: {
        backgroundColor: "#176F95",
        borderColor: "#176F95",
        padding: "0.5em 0.8em",
        margin: "5px 0",
        width: "100%"
    },
    comment: {
        margin: "4px",
        width: "40%",
        padding: "0.55em 0.9em"
    }
};

// Вспомогательная функция для применения стилей кнопок
const applyButtonStyles = (element, ...styleObjs) => {
    styleObjs.forEach(styleObj => Object.assign(element.style, styleObj));
};

function createSubShowButton(subId, lang) {
    const button = document.createElement("button");
    button.className = "submission-show";
    button.innerText = "Показать " + lang;

    applyButtonStyles(button, submissionButtonStyles.base, submissionButtonStyles.showCode);

    button.onclick = (_) => showButtonClick(subId, button);
    return button;
}

function patchCodeSection(subId) {
    const patchLine = (i, line) => {
        line.addEventListener('click', () => {
            if(window.getSelection().toString() != "")
                return;

            // Проверяем, открыто ли плавающее окно комментариев для этой посылки
            const panel = floatingCommentPanels[subId];
            const floatingTextfield = panel && panel.style.display !== "none" ? panel.querySelector("#floating-comment-textfield-" + subId) : null;

            if (floatingTextfield) {
                // Используем плавающее окно, если оно открыто для этой посылки
                const currentText = $(floatingTextfield).val();
                const newLine = currentText.length === 0 ? "" : currentText + "\n";
                $(floatingTextfield).val(newLine + "Строка " + (i + 1) + ": ");

                // Фокусируемся без scrollIntoView, чтобы не смещать панель
                const scrollY = window.scrollY;
                floatingTextfield.focus();
                // Восстанавливаем позицию скролла, если она изменилась
                if (Math.abs(window.scrollY - scrollY) > 1) {
                    window.scrollTo(0, scrollY);
                }
            } else {
                // Используем старое поведение для совместимости
                const text = $("[data-submission-id=" + subId + "] textarea")
                if (text.length > 0) {
                    text.val((text.val().length === 0 ? "" : text.val() + "\n") + "Строка " + (i + 1) + ":" + ' ')
                    var x = window.scrollX, y = window.scrollY;
                    text.focus();
                    window.scrollTo(x, y);
                }
            }
        });
        return line;
    };

    let pretty_code = $('[data-submission-id=' + subId + '] .program-source li');
    const code_lines_count = pretty_code.length

    // Добавляем подсветку при наведении на строки кода
    pretty_code.each((i, line) => {
        patchLine(i, line);
        $(line).css("cursor", "pointer");
        $(line).on("mouseenter", function() {
            $(this).css("backgroundColor", "#e8f0fe");
        });
        $(line).on("mouseleave", function() {
            $(this).css("backgroundColor", "");
        });
    });

    pretty_code = pretty_code.parent().parent();
    pretty_code.before((_) => {
        const lines = document.createElement("pre");
        lines.style.width = '4%';
        lines.style.padding = "0.5em";
        lines.style.display = 'inline-block';
        const lineNs = [...Array(code_lines_count).keys()].map((i) => {
            const line = document.createElement("span");
            line.style.color = 'rgb(153, 153, 153)';
            line.innerText = "[" + (i + 1) + "]";
            line.style.display = "block";
            line.style.textAlign = "right";
            line.style.userSelect = "none";
            line.style.cursor = "pointer";
            return patchLine(i, line);
        })
        lines.append(...lineNs)
        return lines
    })
    pretty_code.css({'display': 'inline-block', 'width': '90%'})
}

function showButtonClick(subId, button) {
    console.log(`[showButtonClick] Клик по кнопке показа кода для посылки ${subId}`);
    if (showed_codes[subId] != null) {
        if (showed_codes[subId].showed == true) {
            console.log(`[showButtonClick] Скрываю код для посылки ${subId}`);
            $(showed_codes[subId].codeSection).hide();
            button.innerText = "Показать код";
            showed_codes[subId].showed = false;
            // Закрываем плавающее окно при скрытии кода
            hideFloatingPanel(subId);
        } else if (showed_codes[subId].showed == false) {
            console.log(`[showButtonClick] Показываю код для посылки ${subId}`);
            $(showed_codes[subId].codeSection).show();
            button.innerText = "Скрыть код";
            showed_codes[subId].showed = true;
            // Открываем плавающее окно при показе кода
            showFloatingPanel(subId);
        }
    } else {
        console.log(`[showButtonClick] Загружаю код для посылки ${subId}`);
        button.innerText = showed_codes[subId] = "Загружаю код..."
        const requestUrl = getContestUrl() + 'submission/' + subId;
        console.log(`[showButtonClick] Запрос кода: ${requestUrl}`);
        $.get(requestUrl, function (html) {
            console.log(`[showButtonClick] Получен HTML для посылки ${subId}`);
            const codeHtml = $(html).find(".SubmissionDetailsFrameRoundBox-" + subId).html()

            if (codeHtml == undefined) {
                console.error(`[showButtonClick] Не удалось найти код для посылки ${subId}`);
                button.innerText = "Ошибка!";
                //location.reload();
                return;
            }

            console.log(`[showButtonClick] Создаю секцию кода для посылки ${subId}`);
            const subCodeSection = createSubCodeSection(subId, codeHtml);

            const subRow = getSubRow(subId);
            subRow.after(subCodeSection)

            prettyPrint(subId);

            patchCodeSection(subId);

            showed_codes[subId] = {
                "showed": true,
                "showButton": button,
                "commentSection": null,
                "codeSection": subCodeSection
            }
            button.innerText = "Скрыть код";
            console.log(`[showButtonClick] Код успешно загружен для посылки ${subId}`);

            // Открываем плавающее окно после загрузки кода
            showFloatingPanel(subId);
        }).fail(function(error) {
            console.error(`[showButtonClick] Ошибка загрузки кода для посылки ${subId}:`, error);
            button.innerText = "Ошибка!";
        });
    }
}

function createSubCodeSection(subId, codeHtml) {
    const trSubCode = document.createElement("tr");
    trSubCode.setAttribute('data-submission-id', subId);
    const tdSubCode = document.createElement("td");
    tdSubCode.setAttribute('colspan', '8');
    tdSubCode.innerHTML = codeHtml;
    tdSubCode.style.textAlign = "start"
    trSubCode.append(tdSubCode);
    return trSubCode;
}

const createCommentSection = (subId) => {
    console.log(`[createCommentSection] Создаю секцию комментариев для посылки ${subId}`);
    const subAcButton = getSubAcButton(subId)[0];
    const isAccepted = isSubAccepted(subId);
    const submissionType = isAccepted ? "star" : "accept";
    const commentTextfield = createCommentTextfield()
    const commentAcButton = commentSendButtonTemplate(subId, (isAccepted ? "Похвалить" : "Принять") + " с комментарием", (isAccepted ? "#81D718" : "#13aa52"), (subId, button) => {
        const text = $(commentTextfield).val();
        console.log(`[createCommentSection] Клик по кнопке "Принять с комментарием" для посылки ${subId}, текст комментария: "${text}"`);
        // Блокируем кнопки выше кода при нажатии
        disableTopButtons(subId);

        if (text.length === 0) {
            console.log(`[createCommentSection] Принимаю посылку ${subId} без комментария`);
            button.innerText = "Принимаю...";
            button.disabled = true;
            acceptSheetSubmission(subId, subAcButton, submissionType,
                () => {
                    // Успешное выполнение - разблокируем кнопки
                    console.log(`[createCommentSection] Посылка ${subId} успешно принята`);
                    enableTopButtons(subId);
                },
                () => {
                    // Ошибка - разблокируем кнопки
                    console.log(`[createCommentSection] Ошибка при принятии посылки ${subId}`);
                    enableTopButtons(subId);
                    button.innerText = "Ошибка!";
                    button.disabled = false;
                    button.style.backgroundColor = "#999";
                }
            );
        } else {
            console.log(`[createCommentSection] Отправляю комментарий для посылки ${subId}`);
            button.innerText = "Отправляю...";
            button.disabled = true;
            const name = getHandle(subId)
            const postUrl = getGroupUrl() + 'data/newAnnouncement';
            const postData = {
                contestId: getContestId(),
                englishText: "",
                russianText: text,
                submittedProblemIndex: getProblemIndex(subId),
                targetUserHandle: name,
                announceInPairContest: true,
            };
            console.log(`[createCommentSection] POST запрос на отправку комментария: ${postUrl}`, postData);
            $.post(postUrl, postData, () => {
                console.log(`[createCommentSection] Комментарий успешно отправлен для посылки ${subId}`);
                button.innerText = "Отправлено!";
                acceptSubmission(subId, subAcButton);
                // Разблокируем кнопки после успешной отправки
                enableTopButtons(subId);
            }).fail(function(error) {
                console.error(`[createCommentSection] Ошибка при отправке комментария для посылки ${subId}:`, error);
                button.innerText = "Ошибка!";
                button.disabled = false;
                button.style.backgroundColor = "#999";
                // Разблокируем кнопки выше кода при ошибке
                enableTopButtons(subId);
            });
        }
    })
    const commentRjButton = commentSendButtonTemplate(subId, "Отклонить с комментарием", "#EC431A", (subId, button) => {
        const text = $(commentTextfield).val();
        if (text.length > 0) {
            console.log(`[createCommentSection] Клик по кнопке "Отклонить с комментарием" для посылки ${subId}, текст комментария: "${text}"`);
            // Блокируем кнопки выше кода при нажатии
            disableTopButtons(subId);

            button.innerText = "Отклоняю...";
            button.disabled = true;
            const name = getHandle(subId)
            const problem = getProblemIndex(subId)
            const postUrl = getGroupUrl() + 'data/newAnnouncement';
            const postData = {
                contestId: getContestId(),
                englishText: "",
                russianText: text,
                submittedProblemIndex: getProblemIndex(subId),
                targetUserHandle: name,
                announceInPairContest: true,
            };
            console.log(`[createCommentSection] POST запрос на отправку комментария при отклонении: ${postUrl}`, postData);
            $.post(postUrl, postData, () => {
                console.log(`[createCommentSection] Комментарий отправлен, начинаю отклонение посылки ${subId}`);
                rejectSub(subId);
                if (showed_codes[subId] != null) {
                    $(showed_codes[subId]["codeSection"]).hide();
                }
                const params = new URLSearchParams({
                    type: "rj",
                    name: name,
                    comment: "Пришел новый реджект! \n\n Комментарий к посылке по задаче " + problem + ":\n\n" + text,
                });
                const full_url = SHEET_URL + "?" + params;
                console.log(`[createCommentSection] Отправляю данные в Google Sheets для реджекта: ${full_url}`);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: full_url,
                    timeout: 5000,
                    onload: (response) => {
                        console.log(`[createCommentSection] Ответ от Google Sheets для реджекта, status: ${response.status}`);
                        if (response.status === 200) {
                            console.log(`[createCommentSection] Реджект успешно отправлен в Google Sheets для посылки ${subId}`);
                            button.innerText = "Отклонено";
                            // Разблокируем кнопки после успешной отправки (хотя они уже должны быть удалены rejectSub)
                        } else {
                            console.error(`[createCommentSection] Ошибка отправки реджекта в Google Sheets: status=${response.status}`);
                            button.innerText = "Ошибка!";
                            button.disabled = false;
                            button.style.backgroundColor = "#999";
                            // Разблокируем кнопки выше кода при ошибке
                            enableTopButtons(subId);
                            console.error(response);
                        }
                    },
                    onerror: (error) => {
                        console.error(`[createCommentSection] Ошибка сети при отправке реджекта в Google Sheets:`, error);
                        button.innerText = "Ошибка!";
                        button.disabled = false;
                        button.style.backgroundColor = "#999";
                        // Разблокируем кнопки выше кода при ошибке
                        enableTopButtons(subId);
                    }
                });
                console.log("Url to send comment: " + full_url);
            }).fail(function(error) {
                console.error(`[createCommentSection] Ошибка при отправке комментария при отклонении для посылки ${subId}:`, error);
                button.innerText = "Ошибка!";
                button.disabled = false;
                button.style.backgroundColor = "#999";
                // Разблокируем кнопки выше кода при ошибке
                enableTopButtons(subId);
            });
        }
    });

    commentTextfield.addEventListener("keyup", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            commentRjButton.click();
        }
    });

    const trSection = document.createElement("tr");
    trSection.setAttribute('data-submission-id', subId);
    const tdSection = document.createElement("td");
    tdSection.setAttribute('colspan', '8');

    const tdSectionTitle = document.createElement("div");
    tdSectionTitle.className = "caption titled";
    tdSectionTitle.innerText = "→ Комментарий";

    // Стили заголовка секции
    Object.assign(tdSectionTitle.style, {
        textAlign: "left",
        color: "#3B5998",
        fontWeight: "600",
        fontSize: "1.3rem",
        marginBottom: "0.5em",
        paddingLeft: "0.3em"
    });

    tdSection.append(tdSectionTitle, commentTextfield, commentAcButton, commentRjButton);
    trSection.append(tdSection);
    return trSection;
}

function createCommentTextfield() {
    const textField = document.createElement("textarea");
    textField.name = "russianText";
    textField.className = "bottom-space-small monospaced";
    textField.placeholder = "Комментарий для участника...";

    // Стили текстового поля
    Object.assign(textField.style, {
        width: "80rem",
        height: "5rem",
        margin: "4px",
        padding: "0.6em",
        border: "1px solid #d0d0d0",
        borderRadius: "6px",
        fontSize: "1.24rem",
        fontFamily: "monospace",
        resize: "vertical",
        transition: "border-color 0.2s ease"
    });

    // Эффект фокуса
    textField.addEventListener("focus", () => {
        textField.style.borderColor = "#3B5998";
        textField.style.outline = "none";
    });

    textField.addEventListener("blur", () => {
        textField.style.borderColor = "#d0d0d0";
    });

    return textField;
}

const commentSendButtonTemplate = (subId, text, color, action) => {
    const button = document.createElement("button");
    button.className = SUB_COMMENT_SEND_BUTTON_CLASS;
    button.innerText = text;

    applyButtonStyles(button, submissionButtonStyles.base);
    button.style.margin = "4px";
    button.style.width = "40%";
    button.style.padding = "0.45em 0.7em";
    button.style.backgroundColor = color;
    button.style.borderColor = color;

    button.onclick = () => action(subId, button);
    return button;
}

const acButtonTemplate = (subId, action, text) => {
    const acButton = document.createElement("button");
    acButton.className = SUB_AC_BUTTON_CLASS;
    acButton.innerText = text !== undefined ? text : (isSubAccepted(subId) ? "Похвалить" : "AC");

    const color = (isSubAccepted(subId) ? "#81D718" : "#13aa52");
    applyButtonStyles(acButton, submissionButtonStyles.base, submissionButtonStyles.accept);
    acButton.style.backgroundColor = color;
    acButton.style.borderColor = color;

    acButton.onclick = (_) => action(subId, acButton);
    return acButton;
}

const createAcButton = (template, subId, ...args) => {
    return template(subId, (subId, button) => {
        button.innerText = "Подтверждаю...";
        button.style.borderColor = "gray";
        button.style.backgroundColor = "gray";
        acceptSubmission(subId, button);
    }, ...args);
}

const createRjButton = (subId, text, action) => {
    const rjButton = document.createElement("button");
    rjButton.className = SUB_RJ_BUTTON_CLASS;
    rjButton.innerText = text;

    applyButtonStyles(rjButton, submissionButtonStyles.base, submissionButtonStyles.reject);

    rjButton.onclick = (_) => action(subId, rjButton);
    return rjButton;
}

const createRgButton = (subId) => {
    const button = document.createElement("button");
    button.className = SUB_RG_BUTTON_CLASS;
    button.innerText = "Перетестировать";

    applyButtonStyles(button, submissionButtonStyles.base, submissionButtonStyles.rejudge);

    button.onclick = (_) => {
        console.log(`[createRgButton] Клик по кнопке "Перетестировать" для посылки ${subId}`);
        const requestUrl = getContestUrl() + 'submission/' + subId;
        const data = {action: "rejudge", submissionId: subId};
        console.log(`[createRgButton] Отправляю POST запрос на перетестирование: ${requestUrl}`, data);
        $.post(requestUrl, data, (response) => {
            console.log(`[createRgButton] Перетестирование успешно запущено для посылки ${subId}, перезагружаю страницу`);
            location.reload();
        }).fail(function(error) {
            console.error(`[createRgButton] Ошибка при перетестировании посылки ${subId}:`, error);
            button.innerText = "Ошибка!";
        });
        button.innerText = "Тестирую...";
    };
    return button;
}

const rejectSub = (subId) => {
    console.log(`[rejectSub] Начинаю отклонение посылки ${subId}`);
    const subRjButton = getSubRjButton(subId);
    subRjButton.innerText = "Отклоняю...";
    subRjButton.prop("disabled", true);
    const subAcButton = getSubAcButton(subId);
    const commentSubAcButton = getCommentSubAcButton(subId);
    const requestUrl = getContestUrl() + 'submission/' + subId
    const data = {action: "reject", submissionId: subId}
    console.log(`[rejectSub] Отправляю POST запрос на отклонение: ${requestUrl}`, data);
    $.post(requestUrl, data, function (response) {
        console.log(`[rejectSub] Посылка ${subId} успешно отклонена`);
        $("[submissionid=" + subId + "] .verdict-accepted").remove()
        subAcButton.remove()
        subRjButton.remove()
        commentSubAcButton.remove();
        console.log(`[rejectSub] Удалены кнопки для посылки ${subId}`);
    }).fail(function(error) {
        console.error(`[rejectSub] Ошибка при отклонении посылки ${subId}:`, error);
        subRjButton.innerText = "Ошибка!";
        subRjButton.css("background-color", "#999");
    });
}

const patchSubmissions = () => {
    const subsId = getSubsId();
    const languages = subsId.parent().prev();

    // Перемещаем кнопку "Показать" под задачу
    languages.each((i, languageCell) => {
        const subId = Number($(subsId[i])[0].getAttribute('submissionid'));
        const language = languageCell.textContent.split('(')[0].trim();

        // Находим строку таблицы
        const $row = $(languageCell).closest("tr");
        const taskCell = $row.find("td:nth-child(4)"); // Задача - 4-я колонка

        if (taskCell.length && !taskCell.hasClass("patched")) {
            taskCell.addClass("patched");

            // Добавляем выравнивание по центру для ячейки
            taskCell.css({
                textAlign: "center",
                verticalAlign: "middle"
            });

            // Создаем контейнер для задачи и кнопки
            const container = $("<div>").css({
                display: "flex",
                flexDirection: "column",
                gap: "0.4em",
                alignItems: "center",
                justifyContent: "center",
                width: "100%"
            });

            // Сохраняем оригинальное содержимое задачи
            const taskContent = $("<div>").html(taskCell.html());

            // Создаем кнопку
            const showButton = createSubShowButton(subId, language);

            // Собираем контейнер
            container.append(taskContent, showButton);

            // Заменяем содержимое ячейки задачи
            taskCell.empty().append(container);

            // Очищаем ячейку с языком и оставляем только текст языка
            $(languageCell).empty().text(language);
        }
    });
}

const patchCorrectSubmissions = () => {
    const correctSubs = getCorrectSubs();

    // Стилизуем строки таблицы
    correctSubs.closest("tr").each((i, row) => {
        const $row = $(row);

        // Стили для строки
        $row.css({
            transition: "background-color 0.2s ease"
        });

        // Hover эффект
        $row.hover(
            function() {
                $(this).css("background-color", "#f8f9fa");
            },
            function() {
                $(this).css("background-color", "");
            }
        );

        // Стилизуем ячейки
        $row.find("td").css({
            padding: "0.75em 0.6em",
            verticalAlign: "middle"
        });
    });

    correctSubs.parent().append((i) => {
        const subId = Number($(correctSubs[i]).attr('submissionid'))

        const acButton = createAcButton(acButtonTemplate, subId)
        const rgButton = createRgButton(subId);
        const rjButton = createRjButton(subId, "RJ", (subId, _) => {
            rejectSub(subId);
        });

        return [acButton, rjButton, rgButton]
    })
}

const patchContestSidebar = () => {
    const contestsSidebar = $(".GroupContestsSidebarFrame ul a");

    // Добавляем номера соревнований
    contestsSidebar.before((i) => {
        const contestHref = $(contestsSidebar[i]).attr('href');
        return document.createTextNode(wrap(getLast(contestHref)));
    });

    // Извлекаем все уникальные группы из названий соревнований
    const groups = new Set();
    contestsSidebar.each((i, element) => {
        const text = $(element).text().trim();
        const match = text.match(/\(([^)]+)\)$/); // Ищем текст в скобках в конце
        if (match) {
            groups.add(match[1]);
        }
    });

    if (groups.size > 0) {
        // Создаем фильтр для групп
        const filterContainer = document.createElement("div");
        filterContainer.style.marginBottom = "0.5em";
        filterContainer.style.padding = "0.5em";

        const filterLabel = document.createElement("div");
        filterLabel.style.color = "#3B5998";
        filterLabel.style.fontWeight = "bold";
        filterLabel.style.marginBottom = "0.3em";
        filterLabel.style.fontSize = "1.1rem";
        filterLabel.innerText = "Группа:";

        const filterSelect = document.createElement("select");
        filterSelect.style.width = "100%";
        filterSelect.style.padding = "0.2em";
        filterSelect.style.fontSize = "1.0rem";

        // Добавляем опцию "Все группы"
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.innerText = "Все группы";
        filterSelect.appendChild(allOption);

        // Добавляем опции для каждой группы
        Array.from(groups).sort().forEach(group => {
            const option = document.createElement("option");
            option.value = group;
            option.innerText = group;
            filterSelect.appendChild(option);
        });

        // Загружаем сохраненный фильтр
        const savedGroup = localStorage.getItem("selectedContestGroup") || "all";
        // Проверяем, существует ли сохраненная группа
        const groupExists = savedGroup === "all" || groups.has(savedGroup);
        filterSelect.value = groupExists ? savedGroup : "all";

        // Функция фильтрации
        const filterContests = (selectedGroup) => {
            localStorage.setItem("selectedContestGroup", selectedGroup);
            contestsSidebar.each((i, element) => {
                const listItem = $(element).parent();
                const text = $(element).text().trim();
                const match = text.match(/\(([^)]+)\)$/);

                if (selectedGroup === "all") {
                    listItem.show();
                } else {
                    if (match && match[1] === selectedGroup) {
                        listItem.show();
                    } else {
                        listItem.hide();
                    }
                }
            });
        };

        // Обработчик изменения фильтра
        filterSelect.onchange = () => filterContests(filterSelect.value);

        filterContainer.appendChild(filterLabel);
        filterContainer.appendChild(filterSelect);

        // Вставляем фильтр в конец сайдбара
        $(".GroupContestsSidebarFrame").append(filterContainer);

        // Применяем сохраненный фильтр
        filterContests(groupExists ? savedGroup : "all");
    }
}

const patchSubmission = () => {
    const buttons = getSubButtons()
    if (buttons.length > 0) {
        const subId = Number(getLast(location.pathname));
        const acButton = createAcButton(acButtonTemplate, subId);
        buttons[0].before(acButton);
    }
}

const patchFilterBox = () => {
    const filterBox = getFilterBox();
    const sidebar = getSideBar();
    filterBox.detach().prependTo(sidebar);
    const filterBoxPart = filterBox.find(".status-filter-form-part")[0];

    // Создаем тоггл "Только непроверенные"
    const correctSubsId = getCorrectSubs().map((i, e) => Number($(e).attr("submissionid"))).toArray();
    const filter = (checkbox) => {
        localStorage.setItem("filterPendingSubs", checkbox.checked);
        const filtered = correctSubsId.filter(subId => {
            return !isSubAccepted(subId)
        });
        getAllSubmissionsRow().each((i, e) => {
            const $row = $(e);
            const submissionId = $row.attr('data-submission-id');

            // Пропускаем строки без data-submission-id (например, хедер)
            if (!submissionId) {
                return;
            }

            if (checkbox.checked) {
                if (!filtered.includes(Number(submissionId))) {
                    $row.hide();
                }
            } else {
                $row.show()
            }
        });
    };

    const template = createFilterPendingCheckboxTemplate(filter);
    const toggleContainer = template[0]
    const checkbox = template[1]
    const updateToggleAppearance = template[2]

    checkbox.checked = ('true' === localStorage.getItem("filterPendingSubs") ?? false);
    updateToggleAppearance();
    filter(checkbox);
    filterBoxPart.before(toggleContainer);

    // Получаем все задачи с названиями из оригинального селектора
    const originalSelect = $(".status-filter-box select[name='frameProblemIndex']");
    const problems = [];

    if (originalSelect.length > 0) {
        originalSelect.find("option").each((i, option) => {
            const value = $(option).val();
            const text = $(option).text().trim();
            // Пропускаем "Любая задача"
            if (value && text && value !== "anyProblem") {
                // Убираем букву из начала текста (например, "A - Название" -> "Название")
                const nameOnly = text.replace(/^[A-Z]\s*-\s*/, '');
                problems.push({ letter: value, name: nameOnly });
            }
        });
    }

    // Создаем селектор задач
    if (problems.length > 0) {
        const problemSelector = createProblemSelector(problems);
        filterBoxPart.before(problemSelector);

        // Скрываем оригинальный селектор задач
        originalSelect.parent().parent().hide();
    }

    // Создаем селектор вердикта
    const verdictSelector = createVerdictSelector();
    filterBoxPart.before(verdictSelector);

    // Скрываем оригинальный селектор вердикта
    $(".status-filter-box select[name='verdictName']").parent().parent().hide();
}

function createVerdictSelector() {
    // Стили
    const styles = {
        container: {
            marginBottom: "0.3em",
            padding: "0.2em 0"
        },
        label: {
            color: "#3B5998",
            fontWeight: "bold",
            marginBottom: "0.4em",
            fontSize: "1.1rem"
        },
        buttonsContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6em"
        },
        button: {
            padding: "0.35em 0.8em",
            border: "1px solid #d0d0d0",
            borderRadius: "6px",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontWeight: "500",
            whiteSpace: "nowrap"
        },
        buttonActive: {
            color: "#ffffff"
        },
        buttonInactive: {
            backgroundColor: "#ffffff",
            color: "#333",
            borderColor: "#d0d0d0"
        },
        buttonHover: {
            backgroundColor: "#e8f0fe"
        }
    };

    // Данные вердиктов
    const verdicts = [
        { value: "anyVerdict", label: "Все", color: "#3B5998" },
        { value: "OK", label: "AC", color: "#13aa52" },
        { value: "WRONG_ANSWER", label: "WA", color: "#e74c3c" },
        { value: "TIME_LIMIT_EXCEEDED", label: "TL/ML", color: "#f39c12" },
        { value: "REJECTED", label: "RJ", color: "#95a5a6" },
    ];

    // Вспомогательная функция для применения стилей
    const applyStyles = (element, ...styleObjs) => {
        styleObjs.forEach(styleObj => Object.assign(element.style, styleObj));
    };

    // Создание основных элементов
    const container = document.createElement("div");
    applyStyles(container, styles.container);

    const label = document.createElement("div");
    applyStyles(label, styles.label);
    label.innerText = "Вердикт:";

    const buttonsContainer = document.createElement("div");
    applyStyles(buttonsContainer, styles.buttonsContainer);

    // Получаем ссылки на элементы формы
    const originalSelect = $(".status-filter-box select[name='verdictName']");
    const submitButton = $(".status-filter-box input[type='submit']");

    // Определяем текущий выбор
    let selectedVerdict = localStorage.getItem("selectedVerdict") || originalSelect.val() || "anyVerdict";

    // Функция обновления стилей кнопок
    const updateButtonStyles = (value) => {
        buttonsContainer.querySelectorAll("button").forEach(btn => {
            const btnValue = btn.getAttribute("data-value");
            const verdict = verdicts.find(v => v.value === btnValue);

            if (btnValue === value) {
                btn.style.backgroundColor = verdict.color;
                btn.style.color = "#ffffff";
                btn.style.borderColor = verdict.color;
            } else {
                applyStyles(btn, styles.buttonInactive);
            }
        });
    };

    // Логика фильтрации
    const filterByVerdict = (value) => {
        selectedVerdict = value;
        localStorage.setItem("selectedVerdict", value);
        updateButtonStyles(value);

        // Применяем фильтр
        if (originalSelect.length > 0) {
            originalSelect.val(value);
            const form = originalSelect.closest("form");
            if (form.length > 0) {
                form.submit();
            } else if (submitButton.length > 0) {
                submitButton.click();
            }
        }
    };

    // Создание кнопки
    const createButton = (verdict) => {
        const button = document.createElement("button");
        button.setAttribute("data-value", verdict.value);
        button.innerText = verdict.label;

        // Применяем базовые стили
        applyStyles(button, styles.button);

        // Применяем стиль в зависимости от выбора
        if (selectedVerdict === verdict.value) {
            button.style.backgroundColor = verdict.color;
            button.style.color = "#ffffff";
            button.style.borderColor = verdict.color;
        } else {
            applyStyles(button, styles.buttonInactive);
        }

        // Обработчики событий
        button.addEventListener("mouseenter", () => {
            if (selectedVerdict !== verdict.value) {
                applyStyles(button, styles.buttonHover);
            }
        });

        button.addEventListener("mouseleave", () => {
            if (selectedVerdict !== verdict.value) {
                applyStyles(button, styles.buttonInactive);
            }
        });

        button.onclick = () => filterByVerdict(verdict.value);

        return button;
    };

    // Сборка DOM
    verdicts.forEach(verdict => {
        buttonsContainer.appendChild(createButton(verdict));
    });

    container.appendChild(label);
    container.appendChild(buttonsContainer);

    return container;
}

function createProblemSelector(problems) {
    // Стили
    const styles = {
        container: {
            marginBottom: "0.3em",
            padding: "0.2em 0"
        },
        label: {
            color: "#3B5998",
            fontWeight: "bold",
            marginBottom: "0.4em",
            fontSize: "1.1rem"
        },
        buttonsContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5em"
        },
        button: {
            padding: "0.35em 0.9em",
            border: "1px solid #d0d0d0",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontWeight: "400",
            textAlign: "left",
            width: "100%"
        },
        buttonActive: {
            backgroundColor: "#3B5998",
            color: "#ffffff",
            borderColor: "#3B5998"
        },
        buttonInactive: {
            backgroundColor: "#ffffff",
            color: "#333",
            borderColor: "#d0d0d0"
        },
        buttonHover: {
            backgroundColor: "#e8f0fe"
        },
        letterSpan: {
            fontWeight: "bold"
        }
    };

    // Вспомогательная функция для применения стилей
    const applyStyles = (element, ...styleObjs) => {
        styleObjs.forEach(styleObj => Object.assign(element.style, styleObj));
    };

    // Создание основных элементов
    const container = document.createElement("div");
    applyStyles(container, styles.container);

    const label = document.createElement("div");
    applyStyles(label, styles.label);
    label.innerText = "Задача:";

    const buttonsContainer = document.createElement("div");
    applyStyles(buttonsContainer, styles.buttonsContainer);

    // Получаем ссылки на элементы формы
    const originalSelect = $(".status-filter-box select[name='frameProblemIndex']");
    const submitButton = $(".status-filter-box input[type='submit']");

    // Определяем текущий выбор
    let selectedLetter = localStorage.getItem("selectedProblemLetter") || originalSelect.val() || "anyProblem";

    // Функция обновления стилей кнопок
    const updateButtonStyles = (letter) => {
        buttonsContainer.querySelectorAll("button").forEach(btn => {
            const btnLetter = btn.getAttribute("data-letter");
            const letterSpan = btn.querySelector("span:first-child");

            if (btnLetter === letter) {
                applyStyles(btn, styles.buttonActive);
                if (letterSpan) letterSpan.style.color = "#ffffff";
            } else {
                applyStyles(btn, styles.buttonInactive);
                if (letterSpan) letterSpan.style.color = "#3B5998";
            }
        });
    };

    // Логика фильтрации
    const filterByProblem = (letter) => {
        selectedLetter = letter;
        localStorage.setItem("selectedProblemLetter", letter);
        updateButtonStyles(letter);

        // Применяем фильтр
        if (originalSelect.length > 0) {
            originalSelect.val(letter);
            const form = originalSelect.closest("form");
            if (form.length > 0) {
                form.submit();
            } else if (submitButton.length > 0) {
                submitButton.click();
            }
        }
    };

    // Создание кнопки
    const createButton = (problem, isAll = false) => {
        const button = document.createElement("button");
        const letter = isAll ? "anyProblem" : problem.letter;
        button.setAttribute("data-letter", letter);

        if (isAll) {
            button.innerText = "Все задачи";
        } else {
            const letterSpan = document.createElement("span");
            applyStyles(letterSpan, styles.letterSpan);
            letterSpan.style.color = selectedLetter === letter ? "#ffffff" : "#3B5998";
            letterSpan.innerText = problem.letter;

            const textSpan = document.createElement("span");
            textSpan.innerText = " - " + problem.name;

            button.appendChild(letterSpan);
            button.appendChild(textSpan);
        }

        // Применяем базовые стили
        applyStyles(button, styles.button);

        // Применяем стиль в зависимости от выбора
        if (selectedLetter === letter) {
            applyStyles(button, styles.buttonActive);
        } else {
            applyStyles(button, styles.buttonInactive);
        }

        // Обработчики событий
        button.addEventListener("mouseenter", () => {
            if (selectedLetter !== letter) {
                applyStyles(button, styles.buttonHover);
            }
        });

        button.addEventListener("mouseleave", () => {
            if (selectedLetter !== letter) {
                applyStyles(button, styles.buttonInactive);
            }
        });

        button.onclick = () => filterByProblem(letter);

        return button;
    };

    // Сборка DOM
    buttonsContainer.appendChild(createButton(null, true));
    problems.forEach(problem => {
        buttonsContainer.appendChild(createButton(problem));
    });

    container.appendChild(label);
    container.appendChild(buttonsContainer);

    return container;
}

function createFilterPendingCheckboxTemplate(action) {
    // Стили
    const styles = {
        container: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.3em 0",
            marginBottom: "0.3em"
        },
        title: {
            color: "#333",
            fontSize: "0.95rem",
            fontWeight: "400"
        },
        checkbox: {
            display: "none"
        },
        toggleLabel: {
            position: "relative",
            display: "inline-block",
            width: "36px",
            height: "20px",
            cursor: "pointer"
        },
        toggleBackground: {
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            borderRadius: "20px",
            transition: "background-color 0.3s ease"
        },
        toggleSlider: {
            position: "absolute",
            top: "2px",
            left: "2px",
            width: "16px",
            height: "16px",
            backgroundColor: "#fff",
            borderRadius: "50%",
            transition: "transform 0.3s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
        }
    };

    // Вспомогательная функция для применения стилей
    const applyStyles = (element, styleObj) => {
        Object.assign(element.style, styleObj);
    };

    // Создание элементов
    const container = document.createElement("div");
    applyStyles(container, styles.container);

    const title = document.createElement("span");
    applyStyles(title, styles.title);
    title.innerText = "Только непроверенные";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "pending-filter-toggle";
    applyStyles(checkbox, styles.checkbox);

    const toggleLabel = document.createElement("label");
    toggleLabel.htmlFor = "pending-filter-toggle";
    applyStyles(toggleLabel, styles.toggleLabel);

    const toggleBackground = document.createElement("span");
    applyStyles(toggleBackground, styles.toggleBackground);
    toggleBackground.style.backgroundColor = "#ccc";

    const toggleSlider = document.createElement("span");
    applyStyles(toggleSlider, styles.toggleSlider);

    // Сборка DOM
    toggleBackground.appendChild(toggleSlider);
    toggleLabel.appendChild(toggleBackground);
    container.appendChild(title);
    container.appendChild(checkbox);
    container.appendChild(toggleLabel);

    // Логика обновления состояния
    const updateToggleAppearance = () => {
        if (checkbox.checked) {
            toggleBackground.style.backgroundColor = "#3B5998";
            toggleSlider.style.transform = "translateX(16px)";
        } else {
            toggleBackground.style.backgroundColor = "#ccc";
            toggleSlider.style.transform = "translateX(0)";
        }
    };

    // Обработчик события
    checkbox.onclick = () => {
        updateToggleAppearance();
        action(checkbox);
    };

    return [container, checkbox, updateToggleAppearance];
}


// Создание плавающих окон для комментариев (по одному на каждую посылку)
const floatingCommentPanels = {}; // { subId: panel }
let positionUpdateAnimationFrame = null;
const panelTargetPositions = {}; // { subId: { top: number } } - целевые позиции для плавного движения

const createFloatingCommentPanel = (subId) => {
    // Если окно уже существует, убеждаемся что оно в DOM и возвращаем его
    if (floatingCommentPanels[subId]) {
        const existingPanel = floatingCommentPanels[subId];
        // Проверяем, что панель все еще в DOM
        if (document.body.contains(existingPanel)) {
            return existingPanel;
        } else {
            // Если панель была удалена из DOM, удаляем из словаря и создаем новую
            delete floatingCommentPanels[subId];
        }
    }

    const panel = document.createElement("div");
    panel.id = "floating-comment-panel-" + subId;
    panel.setAttribute("data-submission-id", subId);

    // Стили панели (изначальные, будут обновлены при показе)
    Object.assign(panel.style, {
        position: "fixed",
        left: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "320px",
        maxHeight: "80vh",
        backgroundColor: "#ffffff",
        border: "2px solid #3B5998",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: "10000",
        display: "none",
        flexDirection: "column",
        overflow: "hidden"
    });

    // Заголовок панели
    const header = document.createElement("div");
    Object.assign(header.style, {
        backgroundColor: "#3B5998",
        color: "#ffffff",
        padding: "0.8em 1em",
        fontWeight: "600",
        fontSize: "1.1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    });

    const title = document.createElement("span");
    title.id = "floating-panel-title-" + subId;
    title.textContent = "Комментарий к посылке";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.cssText = "background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; padding: 0; width: 24px; height: 24px; line-height: 1;";
    closeBtn.onclick = () => hideFloatingPanel(subId);

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Контейнер для комментариев
    const commentContainer = document.createElement("div");
    commentContainer.id = "floating-comment-container-" + subId;
    Object.assign(commentContainer.style, {
        padding: "1em",
        display: "flex",
        flexDirection: "column",
        gap: "0.8em",
        flex: "1",
        minHeight: "0"
    });

    // Заголовок секции комментариев
    const commentTitle = document.createElement("div");
    commentTitle.textContent = "→ Комментарий";
    Object.assign(commentTitle.style, {
        color: "#3B5998",
        fontWeight: "600",
        fontSize: "1.1rem",
        marginBottom: "0.3em",
        flexShrink: "0"
    });

    // Контейнер для textarea и кнопок, выровненный по нижнему краю
    const inputButtonsWrapper = document.createElement("div");
    Object.assign(inputButtonsWrapper.style, {
        display: "flex",
        flexDirection: "column",
        gap: "0.8em",
        marginTop: "auto",
        flexShrink: "0",
        width: "100%", // Обеспечиваем полную ширину контейнера
        boxSizing: "border-box"
    });

    // Текстовое поле для комментария
    const commentTextfield = createCommentTextfield();
    commentTextfield.id = "floating-comment-textfield-" + subId;

    // Переопределяем стили для правильного выравнивания с кнопками
    Object.assign(commentTextfield.style, {
        width: "100%",
        height: "80px",
        fontSize: "0.95rem",
        margin: "0", // Убираем margin для правильного выравнивания
        padding: "0.6em",
        boxSizing: "border-box", // Учитываем padding в ширине
        outline: "none"
    });

    commentTextfield.setAttribute("tabindex", "0");

    // Контейнер для кнопок
    const buttonsContainer = document.createElement("div");
    buttonsContainer.id = "floating-comment-buttons-container-" + subId;
    Object.assign(buttonsContainer.style, {
        display: "flex",
        gap: "0.5em",
        justifyContent: "space-between",
        width: "100%", // Обеспечиваем одинаковую ширину с textarea
        boxSizing: "border-box"
    });

    // Добавляем textarea и кнопки в обёртку
    inputButtonsWrapper.appendChild(commentTextfield);
    inputButtonsWrapper.appendChild(buttonsContainer);

    commentContainer.appendChild(commentTitle);
    commentContainer.appendChild(inputButtonsWrapper);

    panel.appendChild(header);
    panel.appendChild(commentContainer);

    document.body.appendChild(panel);
    floatingCommentPanels[subId] = panel;

    // Запускаем обновление позиций через requestAnimationFrame для максимальной плавности
    if (!positionUpdateAnimationFrame) {
        const updateLoop = () => {
            updateAllPanelPositions();
            positionUpdateAnimationFrame = requestAnimationFrame(updateLoop);
        };
        positionUpdateAnimationFrame = requestAnimationFrame(updateLoop);
    }

    return panel;
};

// Обновление позиций всех открытых панелей
const updateAllPanelPositions = () => {
    Object.keys(floatingCommentPanels).forEach(subId => {
        const panel = floatingCommentPanels[subId];
        if (panel && panel.style.display !== "none") {
            updatePanelPosition(Number(subId));
        }
    });
};

// Обновление позиции конкретной панели относительно её codeSection
const updatePanelPosition = (subId) => {
    const panel = floatingCommentPanels[subId];
    if (!panel) return;

    const codeData = showed_codes[subId];
    if (!codeData || !codeData.codeSection) {
        // Если кода нет, скрываем панель
        if (panel.style.display !== "none") {
            panel.style.display = "none";
        }
        return;
    }

    const codeSection = $(codeData.codeSection);
    if (!codeSection.length || !codeSection.is(":visible")) {
        panel.style.display = "none";
        return;
    }

    // Получаем позицию блока кода относительно viewport
    const codeRect = codeSection[0].getBoundingClientRect();

    const panelWidth = 320;
    const margin = 20;

    // Позиционируем панель слева от блока кода (с учетом скролла)
    const left = codeRect.left - panelWidth - margin;

    // Если панель не помещается слева, размещаем справа
    if (left < 20) {
        panel.style.left = (codeRect.left + codeRect.width + margin) + "px";
    } else {
        panel.style.left = left + "px";
    }

    // Получаем текущую позицию панели
    const currentTop = parseFloat(panel.style.top) || (codeRect.top + codeRect.height / 2 - 150);

    // Позиционируем по вертикали с логикой следования за границами
    const codeTop = codeRect.top;
    const codeHeight = codeRect.height;
    const codeBottom = codeTop + codeHeight;
    const panelHeight = panel.offsetHeight || 300;
    const viewportCenter = window.innerHeight / 2;

    // Целевая позиция - центр экрана
    let targetTop = viewportCenter - (panelHeight / 2);

    // Определяем, касается ли окно границ блока кода (с учетом движения)
    const panelTop = currentTop;
    const panelBottom = currentTop + panelHeight;

    // Проверяем касание с учетом направления движения
    const tolerance = 3; // Допуск в 3px
    const touchesTop = Math.abs(panelTop - codeTop) < tolerance;
    const touchesBottom = Math.abs(panelBottom - codeBottom) < tolerance;

    // Определяем, стремится ли окно к границе (движется ли в сторону границы)
    const movingTowardTop = (targetTop - currentTop) < 0 && targetTop <= codeTop;
    const movingTowardBottom = (targetTop - currentTop) > 0 && targetTop + panelHeight >= codeBottom;

    // Если окно касается верхней границы или движется к ней - привязываемся к верху
    if (touchesTop || (movingTowardTop && panelTop <= codeTop + tolerance)) {
        targetTop = codeTop;
    }
    // Если окно касается нижней границы или движется к ней - привязываемся к низу
    else if (touchesBottom || (movingTowardBottom && panelBottom >= codeBottom - tolerance)) {
        targetTop = codeBottom - panelHeight;
    }
    // Иначе стремимся к центру экрана, но с ограничениями
    else {
        // Ограничиваем: верх окна не может быть выше верха блока кода
        if (targetTop < codeTop) {
            targetTop = codeTop;
        }
        // Ограничиваем: низ окна не может быть ниже низа блока кода
        if (targetTop + panelHeight > codeBottom) {
            targetTop = codeBottom - panelHeight;
        }
    }

    // Плавная интерполяция к целевой позиции (коэффициент 0.15 для плавности)
    const smoothFactor = 0.15;
    const newTop = currentTop + (targetTop - currentTop) * smoothFactor;

    // Сохраняем целевую позицию для следующего кадра
    panelTargetPositions[subId] = { top: targetTop };

    // Используем fixed позиционирование с координатами относительно viewport
    panel.style.top = newTop + "px";
    panel.style.transform = "none";
};

const showFloatingPanel = (subId) => {
    console.log(`[showFloatingPanel] Показываю плавающее окно для посылки ${subId}`);
    // Создаем или получаем панель для этой посылки
    const panel = createFloatingCommentPanel(subId);

    const title = panel.querySelector("#floating-panel-title-" + subId);
    const commentContainer = panel.querySelector("#floating-comment-container-" + subId);
    const commentTextfield = panel.querySelector("#floating-comment-textfield-" + subId);
    const buttonsContainer = panel.querySelector("#floating-comment-buttons-container-" + subId);

    // Очищаем поле комментария
    if (commentTextfield) {
        commentTextfield.value = "";
    }

    // Обновляем заголовок
    const handle = getHandle(subId);
    const problem = getProblemIndex(subId);
    if (title) {
        title.textContent = `#${subId} - ${handle} (${problem})`;
    }

    // Очищаем старые кнопки и проверяем наличие контейнера
    if (!buttonsContainer) {
        console.error(`[showFloatingPanel] Контейнер кнопок не найден для посылки ${subId}!`);
        return;
    }

    buttonsContainer.innerHTML = "";

    // Создаем кнопки для этой посылки
    const subAcButton = getSubAcButton(subId)[0];
    const isAccepted = isSubAccepted(subId);
    const submissionType = isAccepted ? "star" : "accept";
    console.log(`[showFloatingPanel] Посылка ${subId}: handle=${handle}, problem=${problem}, isAccepted=${isAccepted}, type=${submissionType}`);

    const commentAcButton = commentSendButtonTemplate(subId,
        (isAccepted ? "Похвалить" : "Принять") + " с комментарием",
        (isAccepted ? "#81D718" : "#13aa52"),
        (subId, button) => {
            const text = $(commentTextfield).val();
            console.log(`[showFloatingPanel] Клик по кнопке "Принять с комментарием" для посылки ${subId}, текст комментария: "${text}"`);
            // Блокируем кнопки выше кода при нажатии
            disableTopButtons(subId);

            if (text.length === 0) {
                console.log(`[showFloatingPanel] Принимаю посылку ${subId} без комментария`);
                button.innerText = "Принимаю...";
                button.disabled = true;
                // Не закрываем форму сразу - ждем завершения acceptSubmission
                // Вызываем acceptSheetSubmission с колбэками для закрытия панели
                acceptSheetSubmission(subId, subAcButton, submissionType,
                    () => {
                        // Успешное выполнение - закрываем панель
                        console.log(`[showFloatingPanel] acceptSheetSubmission успешно завершен для посылки ${subId}, закрываем панель`);
                        button.innerText = "Принято!";
                        hideFloatingPanel(subId);
                    },
                    () => {
                        // Ошибка - разблокируем кнопки
                        console.log(`[showFloatingPanel] acceptSheetSubmission завершился с ошибкой для посылки ${subId}`);
                        enableTopButtons(subId);
                        button.innerText = "Ошибка!";
                        button.disabled = false;
                        button.style.backgroundColor = "#999";
                    }
                );
            } else {
                console.log(`[showFloatingPanel] Отправляю комментарий для посылки ${subId}`);
                button.innerText = "Отправляю...";
                button.disabled = true;
                const name = getHandle(subId);
                const problemIndex = getProblemIndex(subId);
                const postUrl = getGroupUrl() + 'data/newAnnouncement';
                const postData = {
                    contestId: getContestId(),
                    englishText: "",
                    russianText: text,
                    submittedProblemIndex: problemIndex,
                    targetUserHandle: name,
                    announceInPairContest: true,
                };
                console.log(`[showFloatingPanel] POST запрос на отправку комментария: ${postUrl}`, postData);
                $.post(postUrl, postData, () => {
                    console.log(`[showFloatingPanel] Комментарий успешно отправлен для посылки ${subId}`);
                    button.innerText = "Отправлено!";
                    acceptSubmission(subId, subAcButton);
                    // Закрываем форму только после успешной отправки
                    hideFloatingPanel(subId);
                }).fail(function(error) {
                    console.error(`[showFloatingPanel] Ошибка при отправке комментария для посылки ${subId}:`, error);
                    button.innerText = "Ошибка!";
                    button.disabled = false;
                    button.style.backgroundColor = "#999";
                    // Разблокируем кнопки выше кода при ошибке
                    enableTopButtons(subId);
                });
            }
        }
    );

    const commentRjButton = commentSendButtonTemplate(subId, "Отклонить с комментарием", "#EC431A", (subId, button) => {
        const text = $(commentTextfield).val();
        if (text.length > 0) {
            console.log(`[showFloatingPanel] Клик по кнопке "Отклонить с комментарием" для посылки ${subId}, текст комментария: "${text}"`);
            // Блокируем кнопки выше кода при нажатии
            disableTopButtons(subId);

            button.innerText = "Отклоняю...";
            button.disabled = true;
            const name = getHandle(subId);
            const problem = getProblemIndex(subId);
            const postUrl = getGroupUrl() + 'data/newAnnouncement';
            const postData = {
                contestId: getContestId(),
                englishText: "",
                russianText: text,
                submittedProblemIndex: getProblemIndex(subId),
                targetUserHandle: name,
                announceInPairContest: true,
            };
            console.log(`[showFloatingPanel] POST запрос на отправку комментария при отклонении: ${postUrl}`, postData);
            $.post(postUrl, postData, () => {
                console.log(`[showFloatingPanel] Комментарий отправлен, начинаю отклонение посылки ${subId}`);
                rejectSub(subId);
                // Не закрываем панель сразу - ждем завершения отправки в Sheet
                const params = new URLSearchParams({
                    type: "rj",
                    name: name,
                    comment: "Пришел новый реджект! \n\n Комментарий к посылке по задаче " + problem + ":\n\n" + text,
                });
                const full_url = SHEET_URL + "?" + params;
                console.log(`[showFloatingPanel] Отправляю данные в Google Sheets для реджекта: ${full_url}`);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: full_url,
                    timeout: 5000,
                    onload: (response) => {
                        console.log(`[showFloatingPanel] Ответ от Google Sheets для реджекта, status: ${response.status}`);
                        if (response.status === 200) {
                            // Закрываем панель только после успешной отправки
                            console.log(`[showFloatingPanel] Реджект успешно отправлен в Google Sheets для посылки ${subId}`);
                            hideFloatingPanel(subId);
                            button.innerText = "Отклонено";
                        } else {
                            console.error(`[showFloatingPanel] Ошибка отправки реджекта в Google Sheets: status=${response.status}`);
                            button.innerText = "Ошибка!";
                            button.disabled = false;
                            button.style.backgroundColor = "#999";
                            // Разблокируем кнопки выше кода при ошибке
                            enableTopButtons(subId);
                            console.error(response);
                        }
                    },
                    onerror: (error) => {
                        console.error(`[showFloatingPanel] Ошибка сети при отправке реджекта в Google Sheets:`, error);
                        button.innerText = "Ошибка!";
                        button.disabled = false;
                        button.style.backgroundColor = "#999";
                        // Разблокируем кнопки выше кода при ошибке
                        enableTopButtons(subId);
                    }
                });
            }).fail(function(error) {
                console.error(`[showFloatingPanel] Ошибка при отправке комментария при отклонении для посылки ${subId}:`, error);
                button.innerText = "Ошибка!";
                button.disabled = false;
                button.style.backgroundColor = "#999";
                // Разблокируем кнопки выше кода при ошибке
                enableTopButtons(subId);
            });
        }
    });

    // Настраиваем стили кнопок для панели
    commentAcButton.style.width = "48%";
    commentRjButton.style.width = "48%";

    // Добавляем обработчик Enter для комментария
    if (commentTextfield) {
        commentTextfield.onkeyup = (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                commentRjButton.click();
            }
        };
    }

    buttonsContainer.appendChild(commentAcButton);
    buttonsContainer.appendChild(commentRjButton);

    // Показываем панель
    panel.style.display = "flex";

    // Обновляем позицию относительно блока кода сразу и через небольшой таймаут
    updatePanelPosition(subId);
    requestAnimationFrame(() => {
        updatePanelPosition(subId);
    });

    // Также обновляем позицию при изменении содержимого панели
    setTimeout(() => {
        updatePanelPosition(subId);
    }, 100);
};

const hideFloatingPanel = (subId) => {
    console.log(`[hideFloatingPanel] Скрываю плавающее окно для посылки ${subId}`);
    const panel = floatingCommentPanels[subId];
    if (panel) {
        panel.style.display = "none";

        // Отключаем ResizeObserver, если он был создан
        if (panel._resizeObserver) {
            panel._resizeObserver.disconnect();
            panel._resizeObserver = null;
        }

        // Удаляем панель из словаря
        delete floatingCommentPanels[subId];

        // Удаляем панель из DOM
        panel.remove();

        // Останавливаем анимацию обновления, если больше нет открытых панелей
        const remainingPanels = Object.keys(floatingCommentPanels).length;
        if (remainingPanels === 0 && positionUpdateAnimationFrame) {
            console.log(`[hideFloatingPanel] Останавливаю анимацию обновления позиций (нет открытых панелей)`);
            cancelAnimationFrame(positionUpdateAnimationFrame);
            positionUpdateAnimationFrame = null;
        } else {
            console.log(`[hideFloatingPanel] Осталось открытых панелей: ${remainingPanels}`);
        }

        // Удаляем целевую позицию
        delete panelTargetPositions[subId];
        console.log(`[hideFloatingPanel] Плавающее окно успешно скрыто для посылки ${subId}`);
    } else {
        console.warn(`[hideFloatingPanel] Панель для посылки ${subId} не найдена`);
    }
};


// Стилизация таблицы посылок
const styleSubmissionsTable = () => {
    const table = $(".status-frame-datatable");

    // Стили для таблицы
    table.css({
        borderCollapse: "separate",
        borderSpacing: "0",
        width: "100%"
    });

    // Находим и скрываем заголовки (они в tbody как tr.first-row)
    table.find("tr.first-row th").each(function() {
        const headerText = $(this).text().trim();
        if (headerText === "Когда") {
            $(this).hide();
        }
        if (headerText === "Язык") {
            $(this).hide();
        }
        if (headerText === "Время") {
            $(this).attr("colspan", "2");
            $(this).text("Ресурсы");
        }
        if (headerText === "Память") {
            $(this).hide();
        }
    });

    // Стилизуем заголовки таблицы
    table.find("tr.first-row th:visible").css({
        backgroundColor: "#f5f5f5",
        color: "#333",
        fontWeight: "600",
        fontSize: "1.24rem",
        padding: "0.85em 0.6em",
        borderBottom: "2px solid #d0d0d0",
        textAlign: "center"
    });

    // Стилизуем все строки (пропускаем строку с заголовками)
    table.find("tbody tr").not(".first-row").each(function() {
        const $row = $(this);

        // Добавляем тонкую границу между строками
        $row.find("td").css({
            borderBottom: "1px solid #f0f0f0",
            fontSize: "1.24rem"
        });

        // Стилизуем вердикт "Полное решение"
        $row.find(".verdict-accepted").css({
            fontWeight: "600",
            color: "#13aa52",
            fontSize: "1.3rem"
        });

        // Обрабатываем все ячейки строки
        const allCells = $row.find("td");

        // Размещаем время посылки под номером (первая ячейка)
        const submissionCell = allCells.eq(0); // № - первая ячейка
        const whenCell = allCells.eq(1);       // Когда - вторая ячейка
        const langCell = allCells.eq(4);       // Язык - пятая ячейка

        // Обрабатываем номер и время
        if (submissionCell.length && whenCell.length && !submissionCell.hasClass("number-patched")) {
            submissionCell.addClass("number-patched");

            // Добавляем выравнивание по центру для ячейки
            submissionCell.css({
                textAlign: "center",
                verticalAlign: "middle"
            });

            const submissionLink = submissionCell.find("a"); // Ссылка с номером посылки
            const timeText = whenCell.text().trim();

            if (submissionLink.length && timeText) {
                // Создаем контейнер для номера и времени
                const container = $("<div>").css({
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3em",
                    alignItems: "center",
                    justifyContent: "center"
                });

                // Стилизуем номер посылки
                const linkWrapper = $("<div>").css({
                    fontWeight: "500",
                    color: "#3B5998",
                    fontSize: "1.24rem"
                });
                linkWrapper.append(submissionLink.clone());

                // Создаем чипс для времени
                const timeChip = $("<div>").css({
                    backgroundColor: "#f5f5f5",
                    color: "#666",
                    padding: "0.2em 0.5em",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    whiteSpace: "nowrap"
                }).text(timeText);

                container.append(linkWrapper, timeChip);

                // Заменяем содержимое ячейки с номером
                submissionCell.empty().append(container);
            }
        }

        // Скрываем ячейку "Когда"
        if (whenCell.length) {
            whenCell.hide();
        }

        // Скрываем ячейку "Язык"
        if (langCell.length) {
            langCell.hide();
        }

        // Объединяем время и память в чипсы "Ресурсы"
        // Находим последние две ячейки (время и память)
        const timeCell = allCells.eq(-2); // Предпоследняя ячейка - время
        const memoryCell = allCells.eq(-1); // Последняя ячейка - память

        if (timeCell.length && memoryCell.length &&
            !timeCell.hasClass("merged") && !memoryCell.hasClass("merged")) {
            const timeText = timeCell.text().trim();
            const memoryText = memoryCell.text().trim();

            // Создаем контейнер для чипсов ресурсов
            const chipsContainer = $("<div>").css({
                display: "flex",
                flexDirection: "column",
                gap: "0.4em",
                justifyContent: "center",
                alignItems: "center"
            });

            // Создаем чипс для времени
            const timeChip = $("<span>").css({
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                padding: "0.3em 0.7em",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: "500",
                fontFamily: "monospace",
                whiteSpace: "nowrap"
            }).text(timeText);

            // Создаем чипс для памяти
            const memoryChip = $("<span>").css({
                backgroundColor: "#f3e5f5",
                color: "#7b1fa2",
                padding: "0.3em 0.7em",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: "500",
                fontFamily: "monospace",
                whiteSpace: "nowrap"
            }).text(memoryText);

            chipsContainer.append(timeChip, memoryChip);

            // Объединяем ячейки
            timeCell.attr("colspan", "2");
            timeCell.empty().append(chipsContainer);
            timeCell.addClass("merged");
            memoryCell.hide();
            memoryCell.addClass("merged");
        }
    });

    // Добавляем визуальный эффект при наведении на строки
    table.find("tbody tr").not(".first-row").each(function() {
        const $row = $(this);
        if (!$row.hasClass("hover-enabled")) {
            $row.addClass("hover-enabled");
            $row.css("cursor", "pointer");

            $row.on("mouseenter", function() {
                $(this).css("backgroundColor", "#f8f9fa");
            });

            $row.on("mouseleave", function() {
                $(this).css("backgroundColor", "");
            });
        }
    });
};

(function () {
    getSheetSubmissions();

    try {
        patchContestSidebar();
    } catch (e) {
        console.error(e);
    }

    try {
        patchFilterBox();
    } catch (e) {
        console.error(e);
    }

    try {
        patchCorrectSubmissions();
    } catch (e) {
        console.error(e);
    }

    try {
        patchSubmissions();
    } catch (e) {
        console.error(e);
    }

    try {
        patchSubmission();
    } catch (e) {
        console.error(e);
    }

    try {
        styleSubmissionsTable();
    } catch (e) {
        console.error(e);
    }

    // Добавляем обработчик Escape для закрытия всех панелей
    try {
        $(document).on("keydown", function(e) {
            if (e.key === "Escape") {
                // Закрываем все открытые панели
                Object.keys(floatingCommentPanels).forEach(subId => {
                    const panel = floatingCommentPanels[subId];
                    if (panel && panel.style.display !== "none") {
                        hideFloatingPanel(Number(subId));
                    }
                });
            }
        });

        // Добавляем обработчик скролла для обновления позиций панелей
        let scrollTimeout = null;
        $(window).on("scroll resize", function() {
            // Используем throttling для оптимизации
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                updateAllPanelPositions();
            }, 10);
        });

        // Также обновляем при изменении размера документа (например, при изменении размера таблицы)
        const mutationObserver = new MutationObserver(() => {
            updateAllPanelPositions();
        });

        // Наблюдаем за изменениями в таблице
        const table = $(".status-frame-datatable");
        if (table.length) {
            mutationObserver.observe(table[0], {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
    } catch (e) {
        console.error("Ошибка при инициализации плавающих окон:", e);
    }
})();