// ==UserScript==
// @name         Midnight Cyan Greasyfork 1.3.26 (NO FOUC - NO DELAY !!!! )
// @namespace    http://tampermonkey.net/
// @version      1.3.26
// @description  changes the color theme of the page to cool dark colors.
// @author       Gullampis810
// @license      MIT
// @match        https://greasyfork.org/*
// @icon         https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MjA0MDk1LCJwdXIiOiJibG9iX2lkIn19--e79d532e0eaf011bd04e021c156db81073781d5c/09jtfkuggukgr6-7890n5r5r-ntfftntfn5ryr55ryyr.png?locale=en// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530939/Midnight%20Cyan%20Greasyfork%201326%20%28NO%20FOUC%20-%20NO%20DELAY%20%21%21%21%21%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530939/Midnight%20Cyan%20Greasyfork%201326%20%28NO%20FOUC%20-%20NO%20DELAY%20%21%21%21%21%20%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // весь контент из styles.css (  полная тема с селекторами).
    const themeCSS = `

   body {
    font-family: Arial, sans-serif;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
       transition: transform 0.2s ease-out;
    transform: translateX(33px);
}

.width-constraint {
    left: -25px !important;
    position: relative !important;
}
   html {
     scrollbar-color: auto !important;
  }

 ::-webkit-scrollbar {
    width: 25px;
     background: linear-gradient(54deg, #75490b 0%,#122732 20%, #1b2739 30%, #322133 46%, #73490d 110%) !important; /* Темно-синий градиент */
}

::-webkit-scrollbar-thumb {
      background-color: rgb(29 61 95 / 71%); /* Темно-синий бордер */
      border-radius: 22px;
      border: 3px solid #448adc;  /* Голубо-синий акцент */
      height: 80px;
}

::-webkit-scrollbar-thumb:hover {
      background-color: #1f3454; /* Более светлый голубо-синий при наведении */
}


::-webkit-scrollbar-track {
      background: #2e383900 !important; /* Темно-синяя дорожка */
      border-radius: 0px 0px 8px 0px;
}



   body {
     background: linear-gradient(44deg, #0d141d 88%, #3d2a45 56%, #764a0a 100%);
     background-size: 100% 500%;
 }

.badge-author {
      background-color: #FF9800;
    color: rgb(25 39 70) ! IMPORTANT;
    font-size: 11px !IMPORTANT;
    font-weight: 600 !IMPORTANT;
    padding: 2px 5px;
}

 #main-header {
      background-color: #2A3545;
      background-image: linear-gradient(1deg, #1e2a3c, #463048) !important;
      box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.6) !important;
    padding: .25em 0 !important;
 }

    p#version-note {
    color: #639eb3 !important;
      background: #143b28 !important;
}

ol.linenums {
   background: #0b2718 !important;
}

 li.L1, li.L3, li.L5, li.L7, li.L9 {
   background: #051c0a !important;
}

pre.prettyprint.linenums.wrap.lang-js.prettyprinted {
   background: #915b3b !important;
}



/* Общие стили для всех радио и чекбоксов */
input[type="radio"],
input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border: 2px solid #1C2526; /* Темно-синий бордер */
      border-radius: 50%; /* Круглая форма для радио */
      background-color: #2E3839; /* Темно-синий фон */
    margin: 5px;
    cursor: pointer;
    position: relative;
}

/* Специфично для чекбоксов */
input[type="checkbox"] {
      border-radius: 4px; /* Прямоугольная форма для чекбоксов */
}

/*   hover эффект */
input[type="radio"]:hover,
input[type="checkbox"]:hover {
      border-color: #4A90E2; /* Голубо-синий при наведении */
}

/* Checked состояние */
input[type="radio"]:checked,
input[type="checkbox"]:checked {
      border-color: #4A90E2; /* Голубо-синий бордер */
}

/* Радио-кнопка: внутренний круг при выборе */
input[type="radio"]:checked:after {
    content: '';
    position: absolute;
      width: 10px;
      height: 10px;
      background-color: #28a745;
      border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Чекбокс: галочка при выборе */
input[type="checkbox"]:checked:after {
    content: '✔';
    position: absolute;
    color: #FFFFFF; /* Белая галочка */
    font-size: 14px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Active состояние при нажатии */
input[type="radio"]:active,
input[type="checkbox"]:active {
      border-color: #357ABD; /* Более темный голубо-синий */
      background-color: #357ABD;
}

/* Для required элементов */
input:required {
     box-shadow: 0 0 2px #4A90E2;
      background: #0f151f;
}

/* Специфические стили для каждого ID при необходимости */
#script_script_type_3,
#script_adult_content_self_report,
#script_version_additional_info_0_value_markup_markdown,
#script_version_additional_info_0_value_markup_html {
    vertical-align: middle;
}

.script-description.description {
    font-size: 17px !IMPORTANT;
}

input[type="radio"][name="comment[text_markup]"] {
    appearance: none !important; /* Убираем стандартный вид радиокнопки */
      width: 20px !important; /* Размер кастомной радиокнопки */
      height: 20px !important;
      background-color: #0f151f !important; /* Темный фон */
      border: 2px solid #344b71 !important; /* Граница */
      border-radius: 50% !important; /* Круглая форма */
    cursor: pointer !important; /* Курсор-указатель */
    position: relative !important; /* Для позиционирования псевдоэлемента */
       transition: all 0.3s ease !important; /* Плавные переходы */
    margin: 0 5px 0 0 !important; /* Отступы для выравнивания с label */
    vertical-align: middle !important; /* Выравнивание с текстом */
}

/* Псевдоэлемент для отметки выбора */
input[type="radio"][name="comment[text_markup]"]:checked::after {
    content: '' !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
      width: 10px !important; /* Размер внутренней точки */
      height: 10px !important;
      background-color: #344b71 !important; /* Цвет при выборе */
      border-radius: 50% !important;
    transform: translate(-50%, -50%) !important; /* Центрирование */
}

/* Эффект наведения */
input[type="radio"][name="comment[text_markup]"]:hover:not(:checked) {
      background-color: #141c2a !important; /* Легкое осветление при наведении */
}

/* Состояние фокуса */
input[type="radio"][name="comment[text_markup]"]:focus {
    outline: none !important; /* Убираем стандартный outline */
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.5) !important; /* Тень при фокусе */
}

/* Стили для меток (label) */
input[type="radio"][name="comment[text_markup]"] + label {
    color: #344b71 !important; /* Цвет текста */
    font-size: 16px !important; /* Размер шрифта */
    cursor: pointer !important; /* Курсор-указатель */
    vertical-align: middle !important; /* Выравнивание с радиокнопкой */
       transition: color 0.3s ease !important; /* Плавный переход цвета */
}

/* Метка при выбранной радиокнопке */
input[type="radio"][name="comment[text_markup]"]:checked + label {
    color: #ffffff !important; /* Белый цвет при выборе */
}

/* Эффект наведения на метку */
input[type="radio"][name="comment[text_markup]"] + label:hover {
    color: #ffffff !important; /* Белый цвет при наведении */
}

input[type="radio"][name="comment[discussion][rating]"] {
    appearance: none !important; /* Убираем стандартный вид радиокнопки */
      width: 20px !important; /* Размер кастомной радиокнопки */
      height: 20px !important;
      background-color: #0f151f !important; /* Темный фон */
      border: 2px solid #344b71 !important; /* Граница */
      border-radius: 50% !important; /* Круглая форма */
    cursor: pointer !important; /* Курсор-указатель */
    position: relative !important; /* Для позиционирования псевдоэлемента */
       transition: all 0.3s ease !important; /* Плавные переходы */
    margin: 0 5px 0 0 !important; /* Отступы для выравнивания с label */
    vertical-align: middle !important; /* Выравнивание с текстом */
}

/* Псевдоэлемент для отметки выбора */
input[type="radio"][name="comment[discussion][rating]"]:checked::after {
    content: '' !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
      width: 10px !important; /* Размер внутренней точки */
      height: 10px !important;
      background-color: #344b71 !important; /* Цвет при выборе */
      border-radius: 50% !important;
    transform: translate(-50%, -50%) !important; /* Центрирование */
}

/* Эффект наведения */
input[type="radio"][name="comment[discussion][rating]"]:hover:not(:checked) {
      background-color: #141c2a !important; /* Легкое осветление при наведении */
}

/* Состояние фокуса */
input[type="radio"][name="comment[discussion][rating]"]:focus {
    outline: none !important; /* Убираем стандартный outline */
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.5) !important; /* Тень при фокусе */
}

/* Стили для меток (label) */
input[type="radio"][name="comment[discussion][rating]"] + label {
    color: #344b71 !important; /* Цвет текста */
    font-size: 16px !important; /* Размер шрифта */
    cursor: pointer !important; /* Курсор-указатель */
    vertical-align: middle !important; /* Выравнивание с радиокнопкой */
       transition: color 0.3s ease !important; /* Плавный переход цвета */
}

/* Метка при выбранной радиокнопке */
input[type="radio"][name="comment[discussion][rating]"]:checked + label {
    color: #ffffff !important; /* Белый цвет при выборе */
}

/* Эффект наведения на метку */
input[type="radio"][name="comment[discussion][rating]"] + label:hover {
    color: #ffffff !important; /* Белый цвет при наведении */
}




#comment_attachments {
      background-color: #0f151f !important; /* Темный фон */
    color: #344b71 !important; /* Цвет текста */
      border: 2px solid #344b71 !important; /* Граница */
    padding: 8px 15px !important; /* Отступы */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 16px !important; /* Размер шрифта */
      width: 100% !important; /* Ширина */
    max-width: 300px !important; /* Максимальная ширина */
    cursor: pointer !important; /* Курсор-указатель */
       transition: all 0.3s ease !important; /* Плавные переходы */
}

/* Стили для кнопки "Choose files" внутри input */
#comment_attachments::-webkit-file-upload-button {
      background-color: #344b71 !important; /* Цвет кнопки */
    color: #ffffff !important; /* Белый текст */
      border: none !important; /* Без границы */
    padding: 6px 12px !important; /* Отступы кнопки */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 14px !important; /* Размер шрифта кнопки */
    cursor: pointer !important; /* Курсор-указатель */
       transition:   background-color 0.3s ease !important; /* Плавный переход */
}

/* Эффект наведения на кнопку "Choose files" */
#comment_attachments:hover::-webkit-file-upload-button {
      background-color: #1a2230 !important; /* Чуть светлее при наведении */
}

/* Стили для фокуса */
#comment_attachments:focus {
    outline: none !important; /* Убираем стандартный outline */
      border-color: #344b71 !important; /* Усиливаем цвет границы */
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.5) !important; /* Тень при фокусе */
}

/* Ховер для всего элемента */
#comment_attachments:hover {
      background-color: #141c2a !important; /* Легкое осветление фона */
}



input[type="submit"] {
      background-color: #0f151f;
    color: #3f93b3 !important;
    padding: 12px 24px !important;
      border: none !important;
      border-radius: 4px !important;
    cursor: pointer !important;
    font-size: 16px !important;
    font-weight:   bold !important;
       transition:   background-color 0.3s ease !important;
}

input[type="submit"]:hover {
      background-color: #344b71 !important; /* Более темный зеленый при наведении */
}

input[type="submit"]:disabled {
      background-color: #cccccc !important; /* Серый цвет для отключенной кнопки */
    cursor: not-allowed !important; /* Курсор "запрещено" */
    opacity: 0.7 !important; /* Полупрозрачность */
}




#promoted_script_id {
      background-color: #0f151f !important; /* Темный фон */
    color: #344b71 !important; /* Цвет текста */
      border: 2px solid #344b71 !important; /* Граница среднего тона */
    padding: 10px 15px !important; /* Внутренние отступы */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 16px !important; /* Размер шрифта */
      width: 100% !important; /* Ширина на весь контейнер */
    max-width: 300px !important; /* Максимальная ширина */
    outline: none !important; /* Убираем стандартный outline */
       transition: all 0.3s ease !important; /* Плавные переходы */
}

#promoted_script_id:focus {
      border-color: #344b71 !important; /* Цвет границы при фокусе */
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.5) !important; /* Тень при фокусе */
      background-color: #1a2230 !important; /* Чуть светлее фон при фокусе */
}

#promoted_script_id::placeholder {
    color: #344b71 !important; /* Цвет плейсхолдера */
    opacity: 0.7 !important; /* Прозрачность плейсхолдера */
}

#promoted_script_id:hover:not(:focus) {
      background-color: #141c2a !important; /* Легкое осветление при наведении */
}




#add-synced-additional-info {
      background-color: #344b71 !important; /* Основной цвет фона */
    color: #ffffff !important; /* Белый текст */
    padding: 12px 20px !important; /* Внутренние отступы */
      border: 2px solid #0f151f !important; /* Темная граница */
      border-radius: 6px !important; /* Скругленные углы */
    font-size: 16px !important; /* Размер шрифта */
    font-weight: 500 !important; /* Средняя жирность текста */
    cursor: pointer !important; /* Курсор-указатель */
       transition: all 0.3s ease !important; /* Плавные переходы */
    text-align: center !important; /* Центрирование текста */
}

#add-synced-additional-info:hover {
      background-color: #0f151f !important; /* Темный фон при наведении */
    color: #344b71 !important; /* Цвет текста при наведении */
      border-color: #344b71 !important; /* Цвет границы при наведении */
}

#add-synced-additional-info:focus {
    outline: none !important; /* Убираем стандартный outline */
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.7) !important; /* Тень при фокусе */
}

#add-synced-additional-info:disabled {
      background-color: #344b71 !important; /* Цвет фона при отключении */
    opacity: 0.6 !important; /* Полупрозрачность */
    cursor: not-allowed !important; /* Курсор "запрещено" */
}




/* Общие стили для всех input и select */
input[type="url"],
input[type="number"],
select[name="script[locale_id]"] {
      background-color: #0f151f !important; /* Темный фон */
    color: #344b71 !important; /* Цвет текста */
      border: 2px solid #344b71 !important; /* Граница */
    padding: 10px 15px !important; /* Отступы */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 16px !important; /* Размер шрифта */
      width: 100% !important; /* Ширина */
    max-width: 300px !important; /* Максимальная ширина */
    outline: none !important; /* Убираем outline */
       transition: all 0.3s ease !important; /* Плавные переходы */
}

/* Стили для фокуса */
input[type="url"]:focus,
input[type="number"]:focus,
select[name="script[locale_id]"]:focus {
      border-color: #344b71 !important;
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.5) !important;
      background-color: #1a2230 !important; /* Чуть светлее при фокусе12 */
}

/* Плейсхолдер */
input[type="url"]::placeholder,
input[type="number"]::placeholder {
    color: #344b71 !important;
    opacity: 0.7 !important;
}

/* Ховер */
input[type="url"]:hover:not(:focus),
input[type="number"]:hover:not(:focus),
select[name="script[locale_id]"]:hover:not(:focus) {
      background-color: #141c2a !important; /* Легкое осветление */
}

/* Специфичные стили для input[type="number"] */
input[type="number"] {
 max-width: 100px !important; /* Меньшая ширина для чисел */
 appearance: textfield !important; /* Убираем стрелки в Firefox */
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none !important; /* Убираем стрелки в Chrome */
}

/* Стили для select и option */
select[name="script[locale_id]"] {
    appearance: none !important; /* Убираем стандартный вид */
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'   width='12'   height='12' fill='%23344b71' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E") !important;
      background-repeat: no-repeat !important;
      background-position: right 10px center !important;
    padding-right: 30px !important; /* Отступ для стрелки */
}

select[name="script[locale_id]"] option {
      background-color: #0f151f !important;
    color: #344b71 !important;
}

select[name="script[locale_id]"] option:disabled {
    color: #344b71 !important;
    opacity: 0.5 !important;
}

/* Стили для required полей при ошибке */
input:required:invalid {
      border-color: #712f34 !important; /* Красноватый оттенок для ошибки */
}




.preview-button {
      background-color: #344b71 !important; /* Основной цвет фона */
    color: #ffffff !important; /* Белый текст */
    padding: 10px 20px !important; /* Внутренние отступы */
      border: 2px solid #0f151f !important; /* Темная граница */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 16px !important; /* Размер шрифта */
    font-weight: 500 !important; /* Средняя жирность текста */
    cursor: pointer !important; /* Курсор-указатель */
       transition: all 0.3s ease !important; /* Плавные переходы */
    text-align: center !important; /* Центрирование текста */
}

.preview-button:hover {
      background-color: #0f151f !important; /* Темный фон при наведении */
    color: #344b71 !important; /* Цвет текста при наведении */
      border-color: #344b71 !important; /* Цвет границы при наведении */
}

.preview-button:focus {
    outline: none !important; /* Убираем стандартный outline */
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.7) !important; /* Тень при фокусе */
}

.preview-button:disabled {
      background-color: #344b71 !important; /* Цвет фона при отключении */
    opacity: 0.6 !important; /* Полупрозрачность */
    cursor: not-allowed !important; /* Курсор "запрещено" */
}





#code-upload {
      background-color: #0f151f !important; /* Темный фон */
    color: #344b71 !important; /* Цвет текста */
      border: 2px solid #344b71 !important; /* Граница */
    padding: 8px 15px !important; /* Отступы (меньше, чем у других input) */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 16px !important; /* Размер шрифта */
      width: 100% !important; /* Ширина */
    max-width: 300px !important; /* Максимальная ширина */
    cursor: pointer !important; /* Курсор-указатель */
       transition: all 0.3s ease !important; /* Плавные переходы */
}

/* Стили для кнопки "Choose file" внутри input */
#code-upload::-webkit-file-upload-button {
      background-color: #344b71 !important; /* Цвет кнопки */
    color: #ffffff !important; /* Белый текст */
      border: none !important; /* Без границы */
    padding: 6px 12px !important; /* Отступы кнопки */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 14px !important; /* Размер шрифта кнопки */
    cursor: pointer !important; /* Курсор-указатель */
       transition:   background-color 0.3s ease !important; /* Плавный переход */
}

#code-upload:hover::-webkit-file-upload-button {
      background-color: #1a2230 !important; /* Чуть светлее при наведении */
}

/* Стили для фокуса */
#code-upload:focus {
    outline: none !important; /* Убираем стандартный outline */
      border-color: #344b71 !important;
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.5) !important; /* Тень при фокусе */
}

/* Ховер для всего элемента */
#code-upload:hover {
      background-color: #141c2a !important; /* Легкое осветление */
}





#script_version_attachments {
      background-color: #0f151f !important; /* Темный фон */
    color: #344b71 !important; /* Цвет текста */
      border: 2px solid #344b71 !important; /* Граница */
    padding: 8px 15px !important; /* Отступы (меньше, чем у других input) */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 16px !important; /* Размер шрифта */
      width: 100% !important; /* Ширина */
    max-width: 300px !important; /* Максимальная ширина */
    cursor: pointer !important; /* Курсор-указатель */
       transition: all 0.3s ease !important; /* Плавные переходы */
}

/* Стили для кнопки "Choose files" внутри input */
#script_version_attachments::-webkit-file-upload-button {
      background-color: #344b71 !important; /* Цвет кнопки */
    color: #ffffff !important; /* Белый текст */
      border: none !important; /* Без границы */
    padding: 6px 12px !important; /* Отступы кнопки */
      border-radius: 4px !important; /* Скругленные углы */
    font-size: 14px !important; /* Размер шрифта кнопки */
    cursor: pointer !important; /* Курсор-указатель */
       transition:   background-color 0.3s ease !important; /* Плавный переход */
}

#script_version_attachments:hover::-webkit-file-upload-button {
      background-color: #1a2230 !important; /* Чуть светлее при наведении */
}

/* Стили для фокуса */
#script_version_attachments:focus {
    outline: none !important; /* Убираем стандартный outline */
      border-color: #344b71 !important;
      box-shadow: 0 0 5px rgba(52, 75, 113, 0.5) !important; /* Тень при фокусе */
}

/* Ховер для всего элемента */
#script_version_attachments:hover {
      background-color: #141c2a !important; /* Легкое осветление */
}



/* Контейнер для всех вложений */
.remove-attachments {
    display: flex !important; /* Гибкое расположение элементов */
    flex-wrap: wrap !important; /* Перенос элементов при необходимости */
    gap: 20px !important; /* Отступы между вложениями */
    padding: 10px !important; /* Внутренние отступы контейнера */
}

/* Отдельное вложение */
.remove-attachment {
      background-color: #0f151f !important; /* Темный фон */
      border: 2px solid #344b71 !important; /* Граница */
      border-radius: 4px !important; /* Скругленные углы */
    padding: 10px !important; /* Внутренние отступы */
    display: flex !important; /* Гибкое расположение внутри */
    flex-direction: column !important; /* Вертикальная ориентация */
    align-items: center !important; /* Центрирование по горизонтали */
      width: 200px !important; /* Фиксированная ширина */
}

/* Стили для изображения внутри ссылки */
.remove-attachment a img {
    max-width: 100% !important; /* Ограничение ширины изображения */
      height: auto !important; /* Автоматическая высота */
      border-radius: 4px !important; /* Скругленные углы изображения */
    margin-bottom: 10px !important; /* Отступ снизу */
}

/* Контейнер для чекбокса и метки */
.remove-attachment-selecter {
    display: flex !important; /* Гибкое расположение */
    align-items: center !important; /* Центрирование по вертикали */
    gap: 8px !important; /* Отступ между чекбоксом и меткой */
}

/* Скрытый input (оставляем без стилей, он не виден) */
.remove-attachment-selecter input[type="hidden"] {
    display: none !important;
}

/* Стили для чекбокса */
.remove-attachment-selecter input[type="checkbox"] {
    appearance: none !important; /* Убираем стандартный вид */
      width: 18px !important; /* Размер чекбокса */
      height: 18px !important;
      background-color: #0f151f !important; /* Фон чекбокса */
      border: 2px solid #344b71 !important; /* Граница */
      border-radius: 4px !important; /* Скругленные углы */
    cursor: pointer !important; /* Курсор-указатель */
       transition: all 0.3s ease !important; /* Плавные переходы */
}

.remove-attachment-selecter input[type="checkbox"]:checked {
      background-color: #344b71 !important; /* Цвет при активации */
      border-color: #344b71 !important;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E") !important; /* Галочка */
      background-size: 14px !important; /* Размер галочки */
      background-position: center !important;
      background-repeat: no-repeat !important;
}

.remove-attachment-selecter input[type="checkbox"]:hover:not(:checked) {
      background-color: #141c2a !important; /* Легкое осветление при наведении */
}

/* Стили для метки */
.remove-attachment-selecter .checkbox-label {
    color: #344b71 !important; /* Цвет текста */
    font-size: 14px !important; /* Размер шрифта */
    cursor: pointer !important; /* Курсор-указатель */
       transition: color 0.3s ease !important; /* Плавный переход цвета */
}

.remove-attachment-selecter input[type="checkbox"]:checked + .checkbox-label {
    color: #ffffff !important; /* Белый цвет при активации чекбокса */
}

.remove-attachment-selecter .checkbox-label:hover {
    color: #ffffff !important; /* Белый цвет при наведении */
}
/*accent цвет фона при выделении в редакторе */

.ace-tm .ace_marker-layer .ace_selection {
      background: #29937c5c !important;
}

 /* Li 123456789 */


    /* значок js */
 .badge-js {
      background-color: #FFC107;  /* Жёлтый цвет (можно также использовать #FFFF00 для более яркого жёлтого) */
    color: #000000 !important;  /* Чёрный текст */
    mix-blend-mode: inherit;
}
.rating-icon.rating-icon-good {
      background-color: #2F4F4F !important;  /* Тёмно-зелёный цвет */
    color: #FFFFFF !important;  /* Белый текст для контраста, можно изменить при необходимости */
}

/* Обёртка для input */
.attachment-media-files-e5r6urj6f-upload {
    position: relative !important;
    display: inline-block !important;
      width: 100% !important;
    max-width: 300px !important; /* Можно настроить */
}

/* Скрываем стандартный input */
.attachment-media-files-e5r6urj6f-upload input[type="file"] {
    position: absolute !important;
      width: 100% !important;
      height: 100% !important;
    opacity: 0 !important;
    cursor: pointer !important;
    z-index: 2 !important;
}

/* Стили для кастомной кнопки */
.attachment-media-files-e5r6urj6f-upload label {
    /* Основные размеры и расположение */
    display:   block !important;
      width: 100% !important;
    padding: 12px 16px !important;
      box-sizing:   border-box !important;

    /* Цвета и фон */
      background-color: #ffffff !important;
      border: 2px solid #e0e0e0 !important;
      border-radius: 8px !important;
    color: #333333 !important;

    /* Типографика */
    font-family: 'Arial', sans-serif !important;
    font-size: 16px !important;
    text-align: center !important;

    /* Эффекты */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
       transition: all 0.3s ease !important;
    cursor: pointer !important;
}

/* При наведении */
.attachment-media-files-e5r6urj6f-upload label:hover {
      border-color: #007bff !important;
      box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2) !important;
}

/* При фокусе на input */
.attachment-media-files-e5r6urj6f-upload input[type="file"]:focus + label {
      border-color: #007bff !important;
      background-color: #1e2723 !important;
    color: #ffffff !important;
      box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2) !important;
}

/* Когда файл выбран (опционально) */
.attachment-media-files-e5r6urj6f-upload input[type="file"]:valid + label {
      border-color: #28a745 !important;
}


/* Общий стиль для всех textarea */
textarea[name="script_version[changelog]"],
textarea[name="script_version[additional_info][0][attribute_value]"],
#script_version_changelog,
#script-version-additional-info-0 {
    /* Основные размеры и расположение */
      width: 100%;
    min-height: 120px;
    padding: 12px 16px;
      box-sizing:   border-box;

    /* Цвета и фон */
      background-color: #1e2723;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
    color: #333333;

    /* Типографика */
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    line-height: 1.5;

    /* Эффекты */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
       transition: all 0.3s ease;

    /* Убираем стандартный стиль браузера */
    resize: vertical;
    outline: none;
}

/* При фокусе */
textarea[name="script_version[changelog]"]:focus,
textarea[name="script_version[additional_info][0][attribute_value]"]:focus,
#script_version_changelog:focus,
#script-version-additional-info-0:focus {
      border-color: #007bff;
      box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
      background-color: #0a0f17; /* темно синий */
    color: #ffffff;
}

/* При заполнении (валидное поле) */
textarea[name="script_version[changelog]"]:valid,
textarea[name="script_version[additional_info][0][attribute_value]"]:valid,
#script_version_changelog:valid,
#script-version-additional-info-0:valid {
      border-color: #28a745;
}

/* При ошибке */
textarea[name="script_version[changelog]"]:invalid:focus,
textarea[name="script_version[additional_info][0][attribute_value]"]:invalid:focus,
#script_version_changelog:invalid:focus,
#script-version-additional-info-0:invalid:focus {
      border-color: #dc3545;
      box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2);
}

/* Плейсхолдер */
textarea[name="script_version[changelog]"]::placeholder,
textarea[name="script_version[additional_info][0][attribute_value]"]::placeholder,
#script_version_changelog::placeholder,
#script-version-additional-info-0::placeholder {
    color: #888888;
    opacity: 0.8;
    font-style: italic;
}

/* Стили для формы */
.button_to {
    display: inline-block !important; /* Форма занимает только нужное место */
    margin: 0 !important; /* Убираем внешние отступы */
    padding: 0 !important; /* Убираем внутренние отступы */
}

/* Стили для кнопки внутри формы */
.button_to   button[type="submit"] {
    /* Основные размеры и расположение */
    padding: 10px 20px !important;
      border-radius: 6px !important;
      border: 2px solid #e0e0e0 !important;

    /* Цвета и фон */
      background-color: #1e2723 !important; /* Тёмно-зелёно-серый фон, как в прошлых примерах */
    color: #ffffff !important; /* Белый текст для контраста */

    /* Типографика */
    font-family: 'Arial', sans-serif !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    text-align: center !important;

    /* Эффекты */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
       transition: all 0.3s ease !important;
    cursor: pointer !important;
}

/* При наведении */
.button_to   button[type="submit"]:hover {
      background-color: #2f4f4f !important; /* Чуть светлее тёмно-зелёный для ховер-эффекта */
      border-color: #007bff !important; /* Синий акцент */
      box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3) !important;
}

/* При фокусе */
.button_to   button[type="submit"]:focus {
    outline: none !important;
      border-color: #007bff !important;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3) !important; /* Фокусное кольцо */
}

/* При нажатии */
.button_to   button[type="submit"]:active {
    transform: scale(0.98) !important; /* Лёгкое уменьшение */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
}

/* Скрытый input */
.button_to input[type="hidden"] {
    display: none !important; /* Убеждаемся, что он не виден */
}

.notice {
    /* Основные размеры и расположение */
    padding: 12px 16px !important;
    margin: 10px 0 !important;
      border-radius: 6px !important;

    /* Цвета и фон */
      background-color: #1e2723 !important; /* Тёмно-зелёно-серый фон, как в других элементах */
    color: #ffffff !important; /* Белый текст для контраста */
      border: 1px solid #2f4f4f !important; /* Чуть светлее тёмно-зелёный для границы */

    /* Типографика */
    font-family: 'Arial', sans-serif !important;
    font-size: 16px !important;
    line-height: 1.4 !important;

    /* Эффекты */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
       transition: all 0.3s ease !important;
}

/* При наведении (опционально) */
.notice:hover {
      background-color: #2f4f4f !important; /* Лёгкое осветление фона */
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
}

  /*step 2*
    /* уведомление об ошибках */
 .validation-errors {
      background-color: #6d651e !important;
      border-left: 6px solid #FFEB3B !important;
}

    td {
      background: #1A2535 !important;
      border-radius: 20px !important;
    padding: 10px !important;
 }

    td.ban-text {
    color: #FF5555 !important;
      background-color: rgba(255, 85, 85, 0.2) !important;
 }

      button.lum-next-button.lum-gallery-button,
      button.lum-previous-button.lum-gallery-button {
      background: #2A3545 !important;
 }

 .language-selector-locale {
    padding: 6px;
      border-radius: 25px !important;
      border: solid 2px #4AC2E5 !important;
 }

 .text-content.log-table {
      background: #141D2B !important;
 }

.discussion-meta-item {
    font-size: 14px !IMPORTANT;
    font-weight: 600 !IMPORTANT;
    padding: 2px 5px !IMPORTANT;
}
 .discussion-list.discussion-list-logged-in {
      background: #1E2A3C !important;
      box-shadow: 4px 4px 7px 0px #0A0F1A !important;
 }

 .discussion-list-container.discussion-read {
      background: #253040;
 }

 .list-option-button {
      background: #2A3545 !important;
    color: #4AC2E5 !important;
      border-radius: 30px !important;
 }


a.user-link {
    color: #68b16f !important;
}

 a.script-link {
  color: #4AC2E5 !important;
    box-shadow: 0px 0px 14px 1px #4AC2E5 !important;
    background: #2A3545 !important;
  padding: 1px !important;
    border-radius: 7px !important;
  display: flex !important;
    width: 375px !important;
  position: relative !important;
 }

 .comment-entry {
    /* Основные размеры и расположение */
      width: 100%;
    min-height: 120px;
    padding: 12px 16px;
      box-sizing:   border-box;

    /* Цвета и фон */
      background-color: #1e2723; /* темнозеленый  фон   */
      border: 2px solid #e0e0e0;
      border-radius: 8px;
    color: #333333;

    /* Типографика */
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    line-height: 1.5;

    /* Эффекты */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
       transition: all 0.3s ease;

    /* Убираем стандартный стиль браузера */
    resize: vertical;
    outline: none;
}

/* При фокусе */
.comment-entry:focus {
      border-color: #007bff; /* Синий акцент при фокусе */
      box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
      background-color: #1e2723; /* Твой тёмно-зелёно-серый цвет */
    color: #ffffff; /* Белый текст для читаемости на тёмном фоне */
}

/* При заполнении (валидное поле) */
.comment-entry:valid {
      border-color: #28a745; /* Зелёный для валидного ввода */
}

/* При ошибке (если required не выполнен) */
.comment-entry:invalid:focus {
      border-color: #dc3545; /* Красный при ошибке */
      box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2);
}

/* Плейсхолдер */
.comment-entry::placeholder {
    color: #888888;
    opacity: 0.8;
    font-style: italic;
}

    input[type="search"] {
      box-shadow: inset 0px 0px 14px 1px #0A0F1A;
      background: #2A3545;
    padding: 8px;
      border-radius: 30px;
      border: 2px solid #4AC2E5;
 }

    p#deleted-note {
    color: #FF5555 !important;
 }

 .pagination>*,
 .script-list+.pagination>*,
 .user-list+.pagination>* {
      background-color: #2A3545;
      border-radius: 5px;
 }

 .pagination>a:hover,
 .pagination>a:focus {
      background-color: #4AC2E5;
 }

    a.self-link,
    a.self-link:visited {
    opacity: 1.2;
      background-color: #2A3545;
      border: 2px solid #4AC2E5;
      border-radius: 5px;
 }

    a {
    color: #4AC2E5;
    text-decoration: none;
       transition: all 0.3s ease;
 }
 a:hover {
 color: #FFFFFF;
   background-color: #141D2B;
 padding: 7px 10px;
   border-radius: 5px;
   box-shadow: -1px 9px 9px 0px rgba(0, 0, 0, 0.6);
 }


 .sidebar a {
    display:   block;
    padding: 10px;
    color: #4AC2E5;
      border-radius: 4px;
       transition:   background-color 0.3s ease, color 0.3s ease;
 }

 .sidebar a:hover {
      background-color: #4AC2E5;
    color: #1A2535;
 }

    * {
    color: #E0E5EC !important;
 }

      body, select, input {
      background-color: #141D2B;
      border-radius: 7px;
 }

    code {
      background-color: #2A3545;
 }

 .code-container {
      background: #0F1825;
 }



nav {
    background-color: #141d2b !important;
    padding: 12px !important;
    border-radius: 10px !important;
    border: 2px solid #587597 !important;
}

nav:hover {
    background-color: #203047 !important;
}
.user-content {
     background: linear-gradient(150deg, #101725 10%,#2a1f2c 40%, #1d3739 80%);
     border-top: 1px solid #4ac2e5 !important;
     border-radius: 15px !important;
}
a.toggle-content {
    color: rgb(155, 220, 173) !important;
    border-width: 1px !important;
    border-style: solid !important;
    border-color: rgba(155, 220, 173, 0.5) !important;
    border-image: initial !important;
    border-radius: 35px !important;
    background: rgb(21, 43, 44) !important;
     padding: 3px !important;
}

 .user-content > p:first-child {
    background: linear-gradient(15deg, #43344c 0%, #6e451280 100%);
    padding: 17px;
    border-top: 1px solid #4ac2e5;
}

#additional-info .user-screenshots {
    background: linear-gradient(15deg, #43344c 0%, #6e451280 100%);
    padding: 17px;
    border-top: 1px solid #4ac2e5;
}

 .list-option.list-current {
      border-left: 7px solid #4AC2E5;
      box-shadow: 0 1px 0px 6px rgba(0, 0, 0, 0.1);
      background: linear-gradient(#1A2535, #2A3545);
 }

    form.new_user input[type="submit"] {
    color: #FFFFFF;
      background-color: #2A3545;
      background-image: linear-gradient(#4AC2E5, #1A2535);
 }

 .list-option-group a:hover,
 .list-option-group a:focus {
      background: linear-gradient(#2A3545, #4AC2E5);
    text-decoration: none;
      box-shadow: inset 0 -1px #ddd, inset 0 1px #eee;
 }

 #script-info {
      border: 1px solid #4AC2E5;
      border-radius: 5px;
      background-color: #1A2535;
    margin: 1em 0 0;
      box-shadow: 0px 14px 14px 1px rgba(0, 0, 0, 0.6);
 }

 .form-control textarea:not([rows]),#ace-editor {
      height: 20em;
      background-color: #13161a;
    color: #4AC2E5;
 }

 .previewable textarea {
 margin: 0;
   background-color: #1E2A3C;
 }
 .ace_gutter-cell {
    color: #4AC2E5;
 }

 .ace_folding-enabled {
      background-color: #2A3545;
 }

    a:visited {
    color: #87D8F0;
 }

 .reportable,
 .text-content:last-child,
 .script-list {
      background-color: #1E2A3C;
 }

 .list-option-group ul {
      background-color: #2A3545;
 }

 #add-additional-info,
    input[type="submit"][name="commit"] {
      background-color: #4AC2E5;
    color: #1e2a3c !important;
    padding: 10px 20px;
      border: none;
      border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
       transition:   background-color 0.3s;
 }

    input[type="submit"][name="commit"]:hover {
      background-color: #38A1C2;
 }



 /* Стили скроллбара остаются как у вас, но добавим    transition для ширины (опционально, для дополнительной плавности) */
 textarea#script_version_code::-webkit-scrollbar {
   width: 8px !important;
}

textarea#script_version_code:hover::-webkit-scrollbar {
   width: 35px !important;
 }
body::-webkit-scrollbar-corner {
      background: transparent !important;
}
html::-webkit-scrollbar-corner {
      background: transparent !important;
}

 textarea#script_version_code::-webkit-scrollbar-corner {
      background: transparent !important;
}

 /* Стили скроллбара остаются как у вас, но добавим    transition для ширины (опционально, для дополнительной плавности) */
 .code-container::-webkit-scrollbar {
   width: 35px !important;
}

 .code-container:hover::-webkit-scrollbar {
   width: 35px !important;
 }

/* Стили скроллбара    transition для ширины (опционально, для дополнительной плавности) */
::-webkit-scrollbar {
   width: 35px !important;
   background: linear-gradient(54deg, #1C2526 0%, #2E3839 56%, #0F1415 100%) !important; /* Темно-синий градиент */
    transition:   width 0.2s ease-out; /* Плавное сужение ширины */
}

:hover::-webkit-scrollbar {
   width: 35px !important;
   background: linear-gradient(54deg, #1C2526 0%, #2E3839 56%, #0F1415 100%) !important; /* Темно-синий градиент */
}

::-webkit-scrollbar-thumb {
   background-color: #1C2526; /* Темно-синий бордер */
   border-radius: 22px;
   border: 3px solid #4A90E2;  /* Голубо-синий акцент */
   height: 80px;
}

::-webkit-scrollbar-thumb:hover {
   background-color: #2a88c663; /* Более светлый голубо-синий при наведении */
   border-radius: 22px;
   border: 3px solid #4A90E2;  /* Голубо-синий акцент */
}


::-webkit-scrollbar-thumb:active {
   background-color: #357ABD; /* Более темный голубо-синий при нажатии */
}

::-webkit-scrollbar-track {
   background: #2E3839 !important; /* Темно-синяя дорожка */
   border-radius: 0px 0px 8px 0px;
}


    `;

    // Улучшенная функция: ранний инжект.
    function addStyles() {
        if (document.head) {
            const styleElement = document.createElement('style');
            styleElement.id = 'midnight-cyan-theme';
            styleElement.type = 'text/css';
            styleElement.innerHTML = themeCSS;  // Замените textContent на innerHTML для лучшей поддержки.
            document.head.appendChild(styleElement);
        } else {
            setTimeout(addStyles, 0);  // Fallback для document_start.
        }
    }

    // Force ключевых стилей (топ-5-10 для above-the-fold, адаптируйте под вашу тему).
    function forceStyles() {
        const root = document.documentElement;
        const body = document.body;
        if (root && body) {
            // Пример: force фон/текст/основные блоки.

            /* body.style.setProperty('background', '#001122', 'important');
            body.style.setProperty('color', '#e0e0e0', 'important');
            root.style.setProperty('background', '#001122', 'important'); */

            // Добавьте для .header, .script-list и т.д.: document.querySelector('.header').style.setProperty('color', '#00ffff', 'important');
            // Если селекторов много, ограничьтесь 10: console.log для дебага.
            console.log('[Midnight Cyan] Force применён');
        }
    }

    // Класс на html для specificity.
    if (document.documentElement) {
        document.documentElement.classList.add('midnight-cyan');
    }

    // Hide body.
    if (document.body) {
        document.body.style.visibility = 'hidden';
    }

    // Вызов: инжект + force сразу + frame.
    addStyles();
    forceStyles();
    requestAnimationFrame(() => {
        forceStyles();
        setTimeout(() => {
            if (document.body) {
                document.body.style.visibility = 'visible';
            }
        }, 0);
    });

})(); 


 //   PrettyPrint Syntax Highlighting Fix (Dark VS Code Style) //
(function() {
    'use strict';

    // CSS-стили в стиле VS Code Dark+
    const styles = `
 .prettyprint {
       color:rgb(201, 163, 81) !important;
       font-size: 15px !important;
  }

 /* Простой текст и идентификаторы */
        .pln {
color: rgb(226, 228, 214) !important;
}

 /* Строки */
        .str {
color: rgb(206, 145, 120) !important;
}

 /* Ключевые слова */
        .kwd {
color: rgb(86, 156, 214) !important;
}

 /* Комментарии */
        .com {
color: rgb(72, 170, 68) !important; font-style: italic !important;
}

 /* Типы */
        .typ {
color: rgb(156, 220, 254) !important;
}

 /* Литералы (числа, булевы) */
        .lit {
color: rgb(197, 134, 192) !important;
}

 /* Пунктуация */
        .pun {
color: rgb(212, 212, 212) !important;
}

 /* Теги */
        .tag {
color: rgb(86, 179, 74) !important;
}

 /* Атрибуты */
        .atn {
color: rgb(197, 134, 192) !important;
}

 /* Значения атрибутов */
        .atv {
color: rgb(206, 145, 120) !important;
}

 /* Декораторы */
        .dec {
color: rgb(156, 220, 254) !important;
}


 /* Открывающие скобки */
     .opn {
        color: rgb(49, 103, 163) !important;
}

 /* Закрывающие скобки */
    .clo {
     color: rgb(197, 107, 173) !important;
}

  .bracket-round {
     color: rgb(37, 150, 190) !important;
 }     /* () - голубой  */
   .bracket-square {
      color:rgb(37, 150, 190) !important;
 }    /* [] - голубой */

    `;

    // Создаём и инжектим стиль
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Если PrettyPrint загружается динамически, наблюдаем за изменениями
    const observer = new MutationObserver(() => {
        if (document.querySelector('.prettyprint')) {
            observer.disconnect(); // Останавливаем, если нашли
        }
    });
    observer.observe(document.body, {
childList: true, subtree: true });
})(); 


//============ copy bttn script =======//

(() => {
  const DEBOUNCE_DELAY = 500;
  let timeoutId;

  const init = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const wrapLabel = document.querySelector('label[for="wrap-lines"]');
      if (!wrapLabel) return;

      if (document.querySelector('#copy-code-btn')) return;

      const btn = document.createElement('button');
      btn.id = 'copy-code-btn';
      btn.title = 'Копировать код';
      btn.style.marginLeft = '8px';
      btn.style.cursor = 'pointer';
      btn.style.border = 'none';
      btn.style.background = 'none';
      btn.style.padding = '0';
      btn.style.display = 'inline-flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.verticalAlign = 'middle';

      // svg иконка копирования
      const copySvg = `
        <svg id="copy-icon" xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4
          a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`;

      btn.innerHTML = copySvg;
      wrapLabel.insertAdjacentElement('afterend', btn);

      const setCopiedIcon = () => {
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg"
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="green" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>`;
        setTimeout(() => (btn.innerHTML = copySvg), 1500);
      };

      btn.addEventListener('mouseenter', () => {
        btn.style.color = '#555';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.color = '';
      });

      btn.addEventListener('click', () => {
        const codeContainer = document.querySelector('.code-container pre');
        if (!codeContainer) return;

        const text = Array.from(codeContainer.querySelectorAll('li'))
          .map(li => li.innerText)
          .join('\n')
          .trim();

        navigator.clipboard.writeText(text)
          .then(setCopiedIcon)
          .catch(err => console.error('Ошибка копирования:', err));
      });
    }, DEBOUNCE_DELAY);
  };

  init();

  const observer = new MutationObserver(init);
  observer.observe(document.body, {
childList: true, subtree: true });
})();




//============ hide-user-content-quote.js =======//

(function () {
    'use strict';

    function init() {
        document.querySelectorAll('.comment-meta').forEach(meta => {
            // Предотвращаем добавление кнопки несколько раз (на случай динамической загрузки)
            if (meta.querySelector('a.toggle-content')) return;

            const commentDiv = meta.closest('div[id^="comment-"]');
            if (!commentDiv) return;

            const commentId = commentDiv.id;
            const userContent = commentDiv.querySelector('.user-content');
            if (!userContent) return;

            const quoteLink = meta.querySelector('a.quote-comment');
            if (!quoteLink) return;

            const quoteItem = quoteLink.parentElement;

            // Создаём новую кнопку
            const toggleItem = document.createElement('div');
            toggleItem.className = 'comment-meta-item';

            const toggleLink = document.createElement('a');
            toggleLink.href = '#';
            toggleLink.className = 'toggle-content';
            toggleLink.style.cursor = 'pointer';
            toggleItem.appendChild(toggleLink);

            // Вставляем кнопку сразу после элемента Quote
            quoteItem.parentNode.insertBefore(toggleItem, quoteItem.nextSibling);

            // Настраиваем стили для анимации и обрезки
             userContent.style.transition = 'height 0.3s ease';

            // Ключ для localStorage (уникальный для каждого комментария)
            const storageKey = 'usercontent-collapse-' + commentId;

            // По умолчанию свёрнуто. Состояние сохраняется только для развёрнутого.
            let isCollapsed = localStorage.getItem(storageKey) !== 'expanded';

            // Устанавливаем начальное состояние
            userContent.style.height = isCollapsed ? '30px' : '860px';
            toggleLink.textContent = isCollapsed ? ' Show response' : ' Hide response';

            // Обработчик клика
            toggleLink.addEventListener('click', function (e) {
                e.preventDefault();

                isCollapsed = !isCollapsed;

                userContent.style.height = isCollapsed ? '30px' : '860px';
                toggleLink.textContent = isCollapsed ? ' Show response' : ' Hide response';

                if (isCollapsed) {
                    localStorage.removeItem(storageKey);
                } else {
                    localStorage.setItem(storageKey, 'expanded');
                }
            });
        });
    }

    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();