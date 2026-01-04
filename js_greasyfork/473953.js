// ==UserScript==
// @name         Voxiom Translator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description:ru-RU Русификатор веб-игры Voxiom.io. Данная версия переводчика еще не окончена, но большая часть контента уже была переведена.
// @description  Script for translation into Russian Voxiom.io. This version of the translator is not finished yet, but most of the content has already been translated. More languages will be added in the future
// @author       SuperA001 and TheMasterRob4ig
// @match        https://voxiom.io/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voxiom.io
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473953/Voxiom%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/473953/Voxiom%20Translator.meta.js
// ==/UserScript==

function trUpdate(words) {//Функция обновления перевода каждые 100 мс
     for (let classes in words) {
         let translations = words[classes]
         document.querySelectorAll(classes).forEach(element => {
             for (let key in translations) {
                 if (element.textContent.trim() === key) {
                     const translationData = translations[key]
                     element.textContent = translationData
                     if (typeof translationData === 'object') {
                         const imgElement = document.createElement('img')
                         imgElement.src = translationData.src
                         const textElement = document.createElement('span')
                         textElement.textContent = translationData.text
                         element.innerHTML = ''
                         element.appendChild(imgElement)
                         element.appendChild(textElement)
                     }
                 }
             }
         })
     }
 }
 fetch('https://raw.githubusercontent.com/SuperA001/Voxiom-translator/main/translator.json') //получение перевода из json
     .then(response => response.json())
     .then(data => {
         trUpdate(data.translations)
         setInterval(() => trUpdate(data.translations), 100)
     })
 fetch("https://raw.githubusercontent.com/TheMasterRob4ig/VoxiomTranslated/main/style.css")//стиль для некоторых элементов, изменяется их размер возвращается к исходому состоянию
     .then(response => response.text())
     .then(data => {
         const styleElement = document.createElement("style")
         styleElement.textContent = data
         document.head.appendChild(styleElement)
     })
