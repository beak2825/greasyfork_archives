// ==UserScript==
// @name            Redmine issues list sprint view
// @description     Some changes to make redmine issues list appropriate for sprint appearance: highlight status text in issues list; take short user name; hide menu button in row; show / hide filters
// @namespace       RM
// @author          znaler
// @version         0.1
// @name:ru         Представления списка задач redmine для спринта
// @description:ru  Скрипт изменяет некоторые элементы оформления списка задач в редмайн, чтобы он лучше подходил для отображения задач спринта: Подсветка текста статуса в списке задач спринта: сокращение имени пользователя; спрятать колонку с кнопкой меню; ссылка Показать / Скрыть фильтры
// @grant           none
// @match           https://*/projects/*/issues*
// @require         http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/440059/Redmine%20issues%20list%20sprint%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/440059/Redmine%20issues%20list%20sprint%20view.meta.js
// ==/UserScript==

let _ = jQuery.noConflict();


const LANG_LABELS = [
                {
                    "id": "b44819dd-79ee-4415-aede-44c06b0fb50f",
                    "val": [
                        {"lang": "en", "translate": "Filters"},
                        {"lang": "ru", "translate": "Фильтры"}
                    ]
                },{
                    "id": "3b08523d-d420-4f02-a5b2-a5960541add2",
                    "val": [
                        {"lang": "en", "translate": "New"},
                        {"lang": "ru", "translate": "Планируется"}
                    ]
                },{
                    "id": "c85c1135-2ede-47d8-a9d1-f7544f447165",
                    "val": [
                        {"lang": "en", "translate": "Feedback"},
                        {"lang": "ru", "translate": "Обратная связь"}
                    ]
                },{
                    "id": "d331ba73-4065-433d-a5e5-9dfddd686b6d",
                    "val": [
                        {"lang": "en", "translate": "In progress"},
                        {"lang": "ru", "translate": "В работе"}
                    ]
                },{
                    "id": "0e8b4581-348b-477e-b672-e659b8ade46f",
                    "val": [
                        {"lang": "en", "translate": "Resolved"},
                        {"lang": "ru", "translate": "Решена"}
                    ]
                },{
                    "id": "de4822dd-9a7b-4e75-970a-b3fbd6718c97",
                    "val": [
                        {"lang": "en", "translate": "Closed"},
                        {"lang": "ru", "translate": "Выполнена"}
                    ]
                },{
                    "id": "35db18f7-1eef-429f-bcf8-cbfa75bce53b",
                    "val": [
                        {"lang": "en", "translate": "Rejected"},
                        {"lang": "ru", "translate": "Отменена"}
                    ]
                }
            ];

// Detect lang | Определение языка системы
function langDetect() {
    if (_('html').attr("lang") === 'ru') {
        return 'ru';
    } else {
        return 'en';
    }
}

var lng = langDetect();

// Get const label | Получение текста константы в зависимости от языка интерфейса
function getLbl(lang, id) {
    if (LANG_LABELS) {
        let i = LANG_LABELS.length;
        while (i--) {
            if (LANG_LABELS[i].id === id) {
                let j = LANG_LABELS[i].val.length;
                while (j--) {
                    if (LANG_LABELS[i].val[j].lang === lang) {
                        return LANG_LABELS[i].val[j].translate;
                    }
                }
            }
        }
    }
}

// Highlight status text in issues list | Подсветка текста статуса в списке задач
function statusHighlight(i, elem){
  _(elem).css("font-weight", "bold");

  let text = _(elem).text();
  if(text === getLbl(lng, "3b08523d-d420-4f02-a5b2-a5960541add2")) _(elem).css("color", "#e17076");
  if(text === getLbl(lng, "c85c1135-2ede-47d8-a9d1-f7544f447165")) _(elem).css("color", "#eda86c");
  if(text === getLbl(lng, "d331ba73-4065-433d-a5e5-9dfddd686b6d")) _(elem).css("color", "#eda86c");
  if(text === getLbl(lng, "0e8b4581-348b-477e-b672-e659b8ade46f")) _(elem).css("color", "#7bc862");
  if(text === getLbl(lng, "de4822dd-9a7b-4e75-970a-b3fbd6718c97")) _(elem).css("color", "#65aadd");
  if(text === getLbl(lng, "35db18f7-1eef-429f-bcf8-cbfa75bce53b")) _(elem).css("color", "#a695e7");
}

_('.status').each(statusHighlight);


// Take short user name | Сокращение имени пользователя
function takeShortName(i, elem){
  let fullName = _(elem).text()
  let nameParts = _(elem).text().split(" ");
  if (nameParts[1]){
    let shortName = nameParts[1][0] + ". " + nameParts[0];
    _(elem).text(shortName).attr("title", fullName);
  }
}

_('.author a').each(takeShortName);
_('.assigned_to a').each(takeShortName);


// Increase line height | Увеличить высоту строки
_("table td").css("padding-top", "4px").css("padding-bottom", "4px");

// Hide menu button in row | Спрятать колонку с кнопкой меню
_("th.buttons, td.buttons").hide();

// Show / hide filters | Показать / Скрыть фильтры
_(document).ready(function() {
    if ( _('meta[name="description"]').attr("content") === "Redmine") {

        let cls = "hideFilters";

        // Add class to hide elements | Добавление класса для скрытия элементов
        _("#eq-filter-controls").addClass(cls);

        // Add link to change filters appearance | Добавление ссылку для изменения отображения фильтров
        var filtersLink = _("<a>").attr("href", "#")
                                  .attr("id", "hideFilters")
                                  .attr("class", "collapsible")
                                  .css('float', 'left')
                                  .css('padding-right', '10px')
                                  .text(getLbl(lng, "b44819dd-79ee-4415-aede-44c06b0fb50f"));
        _(".contextual").first().append(filtersLink);

        // Link icon change depends on local storage value | Изменить иконку ссылки в зависимости от значения в локальном хранилище
        if (localStorage.hideFiltersAttr === "true") {
            _("." + cls).hide();
            filtersLink.addClass("collapsed");
        }
        // If local storage unavailable or empty set default value | Значение по умолчанию, если локальное хранилище пустое или недоступно
        else {
            localStorage.hideFiltersAttr = false;
        }

        // Hide or show filters by clicking on link | Показываем или скрываем фильтры по нажатию на ссылку
        filtersLink.click(function () {
            if (localStorage.hideFiltersAttr === "false") {
                _("." + cls).hide();
                filtersLink.addClass("collapsed");
                localStorage.hideFiltersAttr = true;
            } else {
                _("." + cls).show();
                filtersLink.removeClass("collapsed");
                localStorage.hideFiltersAttr = false;
            }
        });
    }
})
