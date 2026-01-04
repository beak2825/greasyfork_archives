// ==UserScript==
// @name         Шаблоны в Баг-трекере
// @namespace    https://greasyfork.org/ru/users/1090548-reyzitwo
// @description  Добавляет в Баг-трекер шаблоны в блок комментария
// @version      1.4
// @author       reyzitwo
// @match        https://vk.com/bug*
// @match        https://vk.ru/bug*
// @icon         https://vk.com/images/icons/favicons/fav_vk_testers.ico
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/472450/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%B2%20%D0%91%D0%B0%D0%B3-%D1%82%D1%80%D0%B5%D0%BA%D0%B5%D1%80%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/472450/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%B2%20%D0%91%D0%B0%D0%B3-%D1%82%D1%80%D0%B5%D0%BA%D0%B5%D1%80%D0%B5.meta.js
// ==/UserScript==

init()

// css
let CSSTemplatesDropDown = `
  .TemplatesDropDown {
    display: block;
    opacity: 0;
    position: absolute;
    overflow: auto;
    height: 290px;
    width: 290px;
    background: var(--vkui--color_background_content);
    box-shadow: var(--page-block-shadow);
    border-radius: var(--vkui--size_border_radius--regular);
    bottom: 50px;
    left: -50px;
    z-index: 3;
    transition: all 0.3s ease;
  }

  .TemplatesDropDown__header {
    padding: 9px 9px 6px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between
  }

  .TemplatesDropDown__title {
    margin: 0;
    color: var(--vkui--color_text_muted);
    font-size: 13px;
  }

  .TemplatesDropDown__not-found-container {
    height: 260px;
    padding: 7px 9px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: var(--vkui--color_text_muted);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    text-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    line-height: 2;
  }

  .TemplatesDropDown__list {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0 0 3px;
  }

  .TemplatesDropDown__item {
    padding: 7px 9px;
    cursor: pointer;
    text-align: left;
    font-size: 1em;
    border: 0;
    background: 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .TemplatesDropDown__item:hover {
    background-color: var(--vkui--color_background_secondary);
  }

  .TemplatesDropDown__item-name {
    margin: 0 0 3px;
    color: var(--vkui--color_text_primary);
    font-weight: 500;
  }

  .TemplatesDropDown__item-content {
    color: var(--vkui--color_text_secondary);
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .TemplatesDropDown__item-icon {
    color: var(--vkui--color_text_secondary);
  }
`;

let CSSTemplatesSettings = `
  .vkuiPopoutWrapper--fixed {
    z-index: 1501;
  }

  .vkuiPopoutRoot--closing .vkuiPopoutWrapper__container {
    opacity: 0;
    -webkit-transition: opacity .2s cubic-bezier(.3,.3,.5,1);
    transition: opacity .2s cubic-bezier(.3,.3,.5,1);
    -webkit-transition: opacity var(--vkui--animation_duration_m) var(--vkui--animation_easing_default);
    transition: opacity var(--vkui--animation_duration_m) var(--vkui--animation_easing_default)
  }

  .vkuiPopoutWrapper__content {
    align-items: center;
  }

  .TemplatesSettings {
    position: relative;
    width: 500px;
  }

  .TemplatesSettings .box_title_wrap {
    background-color: var(--vkui--color_background_modal);
  }

  .TemplatesSettings__form {
    padding: 25px 40px;
    background: var(--vkui--color_background_content);
  }

  .TemplatesSettings__form-row {
    display: flex;
  }

  .TemplatesSettings__form-row:not(:last-child) {
    margin-bottom: 15px;
  }

  .TemplatesSettings__label {
    display: inline-block;
    color: var(--vkui--color_text_subhead);
    flex-shrink: 0;
    flex-basis: 74px;
    text-align: right;
    line-height: 30px;
    margin-right: 12px;
  }

  .TemplatesSettings__input-container {
    width: 1px;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
  }

  textarea {
    resize: none;
  }

  .TemplatesSettings .TemplatesSettings__input {
    height: 30px;
    word-wrap: unset;
    overflow-x: auto;
  }

  .TemplatesSettings .TemplatesSettings__input, .TemplatesSettings .TemplatesSettings__textarea {
    width: 100%;
    border: 1px solid var(--vkui--color_field_border_alpha);
    background: var(--vkui--color_field_background);
    font-size: 13px;
    line-height: 19px;
    color: var(--vkui--color_text_primary);
    outline: 0;
    border-radius: var(--vkui--size_border_radius--regular);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 4px 9px 5px;
    transition: background-color 0.2s ease;
  }

  .TemplatesSettings div.TemplatesSettings__textarea {
    min-height: 47px;
    max-height: 199px;
    word-break: break-word;
    overflow-y: auto;
  }

  .TemplatesSettings__form .vkuiButton {
    border: 0;
    margin: 0 10px 10px 0!important;
    padding: 7px 16px 8px;
    min-width: 0;
    font-size: 12.5px;
    line-height: 15px;
    outline: 0;
    cursor: pointer;
  }

  .TemplatesSettings__form .Button--secondary {
    background: var(--button_secondary_background);
    color: var(--button_secondary_foreground);
    border-radius: var(--vkui--size_border_radius--regular);
  }

  .TemplatesSettings .box_controls_wrap {
    padding: 14px 25px;
    background-color: var(--vkui--color_background_tertiary);
    border-radius: 0 0 var(--vkui--size_border_radius_paper--regular) var(--vkui--size_border_radius_paper--regular);
    border-top: 1px solid var(--separator_common);
    display: flex;
    justify-content: space-between;
  }

  .Button--tertiary {
    display: inline-block;
    vertical-align: top;
    border-radius: var(--vkui--size_border_radius--regular);
    color: var(--button_tertiary_foreground);
    background: var(--button_tertiary_background);
  }

  .Button--primary {
    background: var(--button_primary_background);
    color: var(--vkui--color_text_contrast_themed);
    border-radius: var(--vkui--size_border_radius--regular);
  }
`

// перезапускаем скрипт после каждого изменения DOM
const observer = new MutationObserver(function() { debounce(init()) });

// настройка MutationObserver на отслеживание изменений в DOM
const observerConfig = { childList: true, subtree: true };
observer.observe(document, observerConfig);

async function init() {
    // проверка, чтобы страница была вида vk.(com|ru)/bugXXXX И на присутствие уже нашей кнопки
    if (!window.location.href.match(/^https:\/\/vk\.(com|ru)\/bug\d+(\?.*)?$/) || document.getElementById("custom_button_templates")) return

    // @todo: миграция, УДАЛИТЬ в версии 1.5
    let storage = localStorage.getItem("UserScript-BT-Templates");
    if (storage) {
        await GM.setValue("UserScript-BT-Templates", storage)
        localStorage.removeItem("UserScript-BT-Templates")
    }

    // иницилизация кнопки
    debounce(initButton());
};

function initButton() {
    try {
        let element = document.createElement("a");
        element.id = "custom_button_templates"
        element.className = "ms_item ms_item_doc _type_templates";
        element.ariaLabel = "Шаблоны";
        element.setAttribute("data-title", "Шаблоны"); // кастомный нейм для аттрибута, поэтому только через метод setAttribute
        element.innerHTML = '<span class="MediaSelector__mediaIcon"><svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><path d="M6.667 4.917a.75.75 0 0 1 .75-.75h9.333a.75.75 0 0 1 0 1.5H7.417a.75.75 0 0 1-.75-.75Zm0 5.083a.75.75 0 0 1 .75-.75h9.333a.75.75 0 0 1 0 1.5H7.417a.75.75 0 0 1-.75-.75Zm0 5.083a.75.75 0 0 1 .75-.75h9.333a.75.75 0 0 1 0 1.5H7.417a.75.75 0 0 1-.75-.75ZM5 10a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 5 10Zm0 5a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 5 15ZM5 5a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 5 5Z"></path></svg></span><span class="blind_label">Шаблоны</span>';

        // события кнопки
        element.addEventListener("mouseenter", function () { initPopout(true) });
        element.addEventListener("mouseleave", function () { initPopout(false) });
        element.addEventListener("click", function () { initPopoutTemplates() });

        document.getElementsByClassName("media_selector clear_fix")[0].appendChild(element);
    } catch {}
}

// отображение попаута над кнопкой
function initPopout(isDisplay) {
    let popout = document.getElementById("custom_popout_templates")
    if (popout) {
        return popout.style.opacity = isDisplay ? 1 : 0
    }

    popout = document.createElement("div");
    popout.id = "custom_popout_templates"
    popout.className = "tt_w tt_black tt_down"
    popout.style = `position: absolute; opacity: ${isDisplay ? 1 : 0}; bottom: 50px; left: 75px; pointer-events: auto; display: ${isDisplay ? 'block' : 'none'}; transition: all 0.3s ease;`
    popout.innerHTML = `<div class="tt_text">Шаблоны</div>`
    document.getElementById("bt_report_one_section").appendChild(popout);
}

// открытие самого попаута с шаблоннами
async function initPopoutTemplates(renderNewList) {
    let element = document.getElementById("TemplatesDropDown")

    if (element) {
        if (element.style.display === "none") {
            element.style.display = "block"
            setTimeout(() => element.style.opacity = 1, 1) // 1ms чтобы успело отрендариться
        } else {
            element.style.opacity = 0
            setTimeout(() => element.style.display = "none", 301)
        }
        return
    }

    addGlobalStyle(CSSTemplatesDropDown);

    element = document.createElement("div")
    element.id = "TemplatesDropDown"
    element.className = "TemplatesDropDown"
    element.innerHTML = `<header id="TemplatesDropDown__open-settings-1" class="TemplatesDropDown__header"><h2 class="TemplatesDropDown__title">Шаблоны</h2><a role="button" class="TemplatesDropDown__setting-button">Настроить</a></header> <div id="TemplatesDropDown__render-elements"></div>`
    document.getElementById("bt_report_one_section").appendChild(element);

    await getListTemplates()
    setTimeout(() => element.style.opacity = 1, 1) // 1ms чтобы успело отрендариться

    const settings = [document.getElementById("TemplatesDropDown__open-settings-1"), document.getElementById("TemplatesDropDown__open-settings-2")]
    settings.map((el) => {
        try {
            el.addEventListener("click", function() { initPopoutTemplates(); renderSettingTemplate(true); })
        } catch {}
    })
}

async function getListTemplates() {
    let storage = await GM.getValue("UserScript-BT-Templates");

    if (!storage || storage.length === 0) {
        return renderListTemplates('<div class="TemplatesDropDown__not-found-container"><span>У вас пока нет шаблонов</span><span id="TemplatesDropDown__open-settings-2" class="Link">Добавить шаблон</span></div>')
    }

    let templates = document.createElement("ul")
    templates.className = "TemplatesDropDown__list"

    let renderElements = storage.map((el) => {
        if (!el.title || !el.value) return

        const template = document.createElement("li")
        const text = replaceTextParams(el.value)
        template.addEventListener("click", function () { document.getElementById("bt_comment_form_text").value = text; initPopoutTemplates() });
        template.className = "TemplatesDropDown__item"
        template.innerHTML = `<div style="overflow: hidden"><h3 class="TemplatesDropDown__item-name">${el.title}</h3><div class="TemplatesDropDown__item-content">${text}</div></div>`

        const iconEdit = document.createElement("div")
        iconEdit.className = `TemplatesDropDown__item-icon`
        iconEdit.innerHTML = '<svg aria-hidden="true" display="block" class=" Icon Icon--24 Icon--w-24 Icon--h-24 Icon--pen_outline_24 " viewBox="0 0 24 24" width="20" height="20" style="width: 20px;height: 20px; fill: currentColor;"><path fill-rule="evenodd" d="m14.26 7.478-9.038 9.037a1.1 1.1 0 0 0-.322.778V19a.1.1 0 0 0 .1.1h1.707a1.1 1.1 0 0 0 .778-.322l9.037-9.037-2.263-2.263Zm1.272-1.273 2.263 2.263 1.131-1.131a.6.6 0 0 0 0-.849l-1.414-1.414a.6.6 0 0 0-.849 0l-1.13 1.131ZM3.95 15.242 15.391 3.801a2.4 2.4 0 0 1 3.394 0l1.414 1.414a2.4 2.4 0 0 1 0 3.394L8.758 20.051a2.9 2.9 0 0 1-2.05.849H5A1.9 1.9 0 0 1 3.1 19v-1.707a2.9 2.9 0 0 1 .85-2.05Z" clip-rule="evenodd"></path></svg>'
        iconEdit.addEventListener("click", function(event) {
            event.stopPropagation();
            initPopoutTemplates();

            GM.setValue("UserScript-BT-EditTemplates", el)
            renderSettingTemplate()
        })

        template.appendChild(iconEdit)
        templates.appendChild(template)

        return el
    })

    if (renderElements.filter((el) => el).length === 0) {
        return renderListTemplates('<div class="TemplatesDropDown__not-found-container"><span>У вас пока нет шаблонов</span><span id="TemplatesDropDown__open-settings-2" class="Link">Добавить шаблон</span></div>')
    }

    return renderListTemplates(templates)
}

function renderListTemplates(element) {
    const renderElements = document.getElementById("TemplatesDropDown__render-elements")
    if (!renderElements) return
    renderElements.innerHTML = '';

    // если добавить список шаблонов через innerHTML, то все прослушиватели ивентов пропадут
    if (typeof element === "object") {
        renderElements.appendChild(element)
    } else {
        renderElements.innerHTML = element
    }
}

function renderSettingTemplate(isDisplay) {
    addGlobalStyle(CSSTemplatesSettings);
    setTimeout(() => initVKUIPopoutRoot(), 1)
}

async function deleteTemplate(id, closePopout) {
    let array = await GM.getValue("UserScript-BT-Templates")
    array = array ?? []

    let index = array.findIndex((el) => el.id === id)
    id = id.split("-")[1]
    if (index === -1) {
        unsafeWindow.Notifier.showEvent({ title: `Шаблон #${id}`, text: "Ошибка, шаблон не найден" })
    } else {
        array.splice(index, 1)
        GM.setValue("UserScript-BT-Templates", array)
        closePopout()
        getListTemplates()

        unsafeWindow.Notifier.showEvent({ title: `Шаблон #${id}`, text: "Успешное удаление" })
    }
}

function initVKUIPopoutRoot() {
    window.valuesTemplateSetting = { title: "", value: "" }
    let popout = document.getElementById("TemplatesSettings");

    async function renderEditValues() {
        let template = await GM.getValue("UserScript-BT-EditTemplates")

        if (template) {
            window.valuesTemplateSetting = { ...template };
            document.getElementById("TemplatesSettings__input").value = template.title
            document.getElementById("TemplatesSettings__textarea").value = template.value
        }

        if (window.valuesTemplateSetting && window.valuesTemplateSetting.id) {
            let buttons = document.getElementById("TemplatesSettings-Buttons")
            buttons.children[0].innerHTML = '<button id="TemplatesSettings-ButtonDelete" class="Button Button--size-m Button--negative">Удалить</button>'

            setTimeout(() => {
                const deleteButton = document.getElementById("TemplatesSettings-ButtonDelete")
                deleteButton.addEventListener("click", function() { deleteTemplate(window.valuesTemplateSetting.id, closePopout) })
            }, 1)
        }
    }

    if (popout) {
        renderEditValues()
        return popout.style.display = "block"
    }

    const PopoutRoot = document.createElement("div")
    PopoutRoot.id = "TemplatesSettings";
    PopoutRoot.className = "vkuiPopoutRoot--absolute"
    PopoutRoot.innerHTML = '<div class="vkuiPopoutWrapper vkuiPopoutWrapper--v-center vkuiPopoutWrapper--opened vkuiPopoutWrapper--fixed vkuiPopoutWrapper--masked"><div class="vkuiPopoutWrapper__container"><div id="TemplatesSettings-vkuiPopoutWrapper__overlay" class="vkuiPopoutWrapper__overlay"></div><div class="vkuiPopoutWrapper__content" id="Templates-vkuiPopoutWrapper-content"><div class="TemplatesSettings"><div class="box_title_wrap" style=""><div id="TemplatesSettings-box_x_button" class="box_x_button" aria-label="Закрыть" tabindex="0" role="button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" style="margin-top: -2px;"><path d="M7.54 6.26a.9.9 0 0 0-1.28 1.28L10.73 12l-4.47 4.46a.9.9 0 0 0 1.28 1.28L12 13.27l4.46 4.47a.9.9 0 1 0 1.28-1.28L13.27 12l4.47-4.46a.9.9 0 1 0-1.28-1.28L12 10.73 7.54 6.26Z"></path></svg></div><div class="box_title_controls"></div><div class="box_title">Шаблон</div></div><div class="box_body box_no_buttons" style="display: block; padding: 0px;"><div id="docs_choose_wrap"><form class="TemplatesSettings__form" id="create_template_form"><div class="TemplatesSettings__form-row"><label class="TemplatesSettings__label" for="name">Название:</label><div class="TemplatesSettings__input-container"><input id="TemplatesSettings__input" class="TemplatesSettings__input" autocomplete="off"></input></div></div><div class="TemplatesSettings__form-row"><label class="TemplatesSettings__label" for="text">Текст:</label><div class="TemplatesSettings__input-container"><textarea id="TemplatesSettings__textarea" class="TemplatesSettings__textarea"></textarea></div></div><div class="TemplatesSettings__form-row"><label class="TemplatesSettings__label">Подсказки:</label><div class="TemplatesSettings__input-container"><button type="button" class="Button vkuiButton Button--secondary">Имя</button><button type="button" class="Button vkuiButton Button--secondary">Фамилия</button><button type="button" class="Button vkuiButton Button--secondary">Приветствие</button><button type="button" class="Button vkuiButton Button--secondary">Известные кейсы</button><button type="button" class="Button vkuiButton Button--secondary">Правила оформления</button></div></div></form></div></div><div id="TemplatesSettings-Buttons" class="box_controls_wrap"> <div></div> <div><button id="TemplatesSettings-ButtonClose" class="Button Button--size-m Button--tertiary">Отмена</button><button id="TemplatesSettings-ButtonSave" class="Button Button--size-m Button--primary">Сохранить</button></div></div></div></div></div></div></div>'

    document.body.appendChild(PopoutRoot)

    function closePopout() {
        const PopoutRoot = document.getElementById("TemplatesSettings")
        GM.setValue("UserScript-BT-EditTemplates", { title: "", value: "" })

        PopoutRoot.className += " vkuiPopoutRoot--closing"
        setTimeout(() => {
            document.getElementById("TemplatesSettings-ButtonDelete")?.remove()
            PopoutRoot.style.display = "none"
            PopoutRoot.className = "vkuiPopoutRoot--absolute"
        }, 201)
    }

    setTimeout(() => {
        renderEditValues();

        // ивенты на кнопки закрытия
        const ids = ["TemplatesSettings-vkuiPopoutWrapper__overlay", "TemplatesSettings-box_x_button", "TemplatesSettings-ButtonClose"]
        ids.map((el) => document.getElementById(el).addEventListener("click", function() { closePopout() }))

        const input = document.getElementById("TemplatesSettings__input")
        const textarea = document.getElementById("TemplatesSettings__textarea")

        // ивенты на инпуты
        input.addEventListener("input", (event) => window.valuesTemplateSetting.title = event.target.value);
        textarea.addEventListener("input", (event) => window.valuesTemplateSetting.value = event.target.value);

        // ивенты на подсказки
        const hints = [...document.getElementsByClassName("TemplatesSettings__input-container")[2].childNodes]
        const hintsText = ["{{user.first_name}}", "{{user.last_name}} ", "{{greeting}} ", "{{links.known_problems}} ", "{{links.bugs_rules}} "]
        hints.map((el, index) => el.addEventListener("click", function() {
            const cursorPosition = textarea.selectionStart;
            textarea.setRangeText(hintsText[index], cursorPosition, cursorPosition, "end");
            window.valuesTemplateSetting.value = textarea.value
            textarea.focus()
        }))

        // ивент на сохранение
        document.getElementById("TemplatesSettings-ButtonSave").addEventListener("click", async () => {
            const inputs = [input, textarea]
            let flag = false

            // проверка, что значения в инпутах не пустые
            for (let input of inputs) {
                if (input.value.trim().length === 0) {
                    input.style.backgroundColor = "var(--vkui--color_background_negative_tint)"
                    flag = true
                }
            }

            if (flag) {
                return setTimeout(() => {
                    inputs[0].style.cssText = ""
                    inputs[1].style.cssText = ""
                }, 500)
            }

            let array = await GM.getValue("UserScript-BT-Templates")
            array = array ?? []

            if (window.valuesTemplateSetting.id) {
                const index = array.findIndex((el) => el.id === window.valuesTemplateSetting.id)
                array[index] = window.valuesTemplateSetting
                unsafeWindow.Notifier.showEvent({ title: `Шаблон #${window.valuesTemplateSetting.id.split("-")[1]}`, text: "Успешное редактирование" })
            } else {
                const id = generateRandomString(8)
                array.push({ id: `${unsafeWindow.vk.id}-${id}`, ...window.valuesTemplateSetting })
                unsafeWindow.Notifier.showEvent({ title: `Шаблон #${id}`, text: "Успешное создание" })
            }

            GM.setValue("UserScript-BT-Templates", array)
            getListTemplates()
            closePopout()
        })
    }, 1)
}

function debounce(func, timeout = 500){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

// Вставляем стили на страницу
function addGlobalStyle(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
}

function replaceTextParams(originalString) {
    let user = document.getElementsByClassName("bt_report_one_author_content")[0].children[0].text.split(" ");
    let greeting = ["Доброе утро", "Добрый день", "Добрый вечер", "Доброй ночи"];
    let links = ["https://vk.com/@testpool-known-problems", "https://vk.cc/bugsrules"]
    let hour = new Date().getUTCHours() + 3; // Получаем текущий час по времени Москве

    let greetingMessage =
      (hour >= 0 && hour < 6) || hour === 24 ? greeting[3] : // ночь
      hour >= 6 && hour < 12 ? greeting[0] : // утро
      hour >= 12 && hour < 16 ? greeting[1] : // день
      greeting[2]; // вечер

    // @todo: переделать в лучший вариант
    let replacedString = originalString.replace(/{{greeting}}/g, greetingMessage);
    replacedString = replacedString.replace(/{{user.first_name}}/g, user[0]);
    replacedString = replacedString.replace(/{{user.last_name}}/g, user[1]);
    replacedString = replacedString.replace(/{{links.known_problems}}/g, links[0]);
    return replacedString.replace(/{{links.bugs_rules}}/g, links[1]);
}