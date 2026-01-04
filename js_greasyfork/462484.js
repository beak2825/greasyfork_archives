// ==UserScript==
// @name         Role Play Helper for ChatGPT&Slack
// @name:zh-CN   角色扮演助手 for ChatGPT&Slack
// @namespace    http://tampermonkey.net/
// @version      3.3.2
// @license      GPL-2.0
// @description This script provides an intuitive template editor with three key areas: setting, review, and interaction. Users can construct templates in the setting area, then populate them with content from the review and interaction areas. A built-in "add" button fetches the latest AI message for instant insertion into the review area, making template editing straightforward and convenient.该脚本提供了一个直观的模板编辑器，包含三个关键区域：设置区、回顾区和交互区。用户可以在设置区构建模板，然后使用回顾区和交互区的内容填充它们。内置的“添加”按钮可以获取最新的AI消息，并立即插入到回顾区，使得模板编辑简单便捷。
// @description:de Dieses Skript bietet einen intuitiven Vorlagen-Editor mit drei Schlüsselbereichen: Einstellung, Überprüfung und Interaktion. Benutzer können Vorlagen im Einstellungsbereich erstellen und sie dann mit Inhalten aus den Überprüfungs- und Interaktionsbereichen füllen. Eine integrierte "Hinzufügen"-Schaltfläche holt die neueste AI-Nachricht zur sofortigen Einfügung in den Überprüfungsbereich, was die Vorlagenbearbeitung einfach und bequem macht.
// @description:en This script provides an intuitive template editor with three key areas: setting, review, and interaction. Users can construct templates in the setting area, then populate them with content from the review and interaction areas. A built-in "add" button fetches the latest AI message for instant insertion into the review area, making template editing straightforward and convenient.
// @description:es Este script proporciona un editor de plantillas intuitivo con tres áreas clave: configuración, revisión e interacción. Los usuarios pueden construir plantillas en el área de configuración, y luego llenarlas con contenido de las áreas de revisión e interacción. Un botón "añadir" incorporado recoge el último mensaje de IA para su inserción instantánea en el área de revisión, haciendo que la edición de plantillas sea sencilla y conveniente.
// @description:fr Ce script fournit un éditeur de modèles intuitif avec trois zones clés : paramétrage, révision et interaction. Les utilisateurs peuvent construire des modèles dans la zone de paramétrage, puis les peupler avec du contenu provenant des zones de révision et d'interaction. Un bouton "ajouter" intégré récupère le dernier message de l'IA pour une insertion instantanée dans la zone de révision, rendant l'édition de modèles simple et pratique.
// @description:it Questo script fornisce un editor di modelli intuitivo con tre aree chiave: impostazione, revisione e interazione. Gli utenti possono costruire modelli nell'area delle impostazioni, quindi popolarli con contenuti dalle aree di revisione e interazione. Un pulsante "aggiungi" incorporato recupera l'ultimo messaggio dell'IA per l'inserimento immediato nell'area di revisione, rendendo la modifica dei modelli semplice e conveniente.
// @description:ja このスクリプトは、設定、レビュー、インタラクションの3つの主要なエリアを備えた直感的なテンプレートエディタを提供します。ユーザーは設定エリアでテンプレートを構築し、それをレビューエリアとインタラクションエリアのコンテンツで埋めることができます。組み込みの「追加」ボタンは、最新のAIメッセージを即座にレビューエリアに挿入するために取得し、テンプレートの編集を直感的で便利にします。
// @description:ko 이 스크립트는 설정, 리뷰, 상호작용 세 가지 주요 영역을 갖춘 직관적인 템플릿 편집기를 제공합니다. 사용자는 설정 영역에서 템플릿을 구성한 다음, 리뷰 및 상호작용 영역의 콘텐츠로 채울 수 있습니다. 내장된 "추가" 버튼은 최신 AI 메시지를 즉시 리뷰 영역에 삽입하여 템플릿 편집을 간단하고 편리하게 합니다.
// @description:nl Dit script biedt een intuïtieve sjabloon-editor met drie belangrijke gebieden: instellingen, review en interactie. Gebruikers kunnen sjablonen maken in het instellingengebied, en ze vervolgens vullen met inhoud uit de review- en interactiegebieden. Een ingebouwde "toevoegen" knop haalt het laatste AI-bericht op voor onmiddellijke invoeging in het reviewgebied, wat het bewerken van sjablonen eenvoudig en handig maakt.
// @description:pt-BR Este script fornece um editor de modelos intuitivo com três áreas-chave: configuração, revisão e interação. Os usuários podem construir modelos na área de configuração, e então preenchê-los com conteúdo das áreas de revisão e interação. Um botão "adicionar" embutido busca a última mensagem da IA para inserção instantânea na área de revisão, tornando a edição de modelos simples e conveniente.
// @description:ru Этот скрипт предоставляет интуитивно понятный редактор шаблонов с тремя ключевыми областями: настройка, обзор и взаимодействие. Пользователи могут создавать шаблоны в области настроек, а затем заполнять их контентом из областей обзора и взаимодействия. Встроенная кнопка "добавить" извлекает последнее сообщение AI для мгновенного вставления в область обзора, что делает редактирование шаблонов простым и удобным.
// @description:zh-CN 该脚本提供了一个直观的模板编辑器，包含三个关键区域：设置区、回顾区和交互区。用户可以在设置区构建模板，然后使用回顾区和交互区的内容填充它们。内置的“添加”按钮可以获取最新的AI消息，并立即插入到回顾区，使得模板编辑简单便捷。
// @description:zh-TW 此腳本提供了一個直覺的範本編輯器，包含三個關鍵區域：設定區、檢視區和互動區。使用者可以在設定區建立範本，然後使用檢視區和互動區的內容填充它們。內建的"新增"按鈕可以獲取最新的AI訊息，並立即插入到檢視區，讓範本編輯變得直接而便利。
// @author       环白
// @match        https://chat.openai.com/*
// @match        https://app.slack.com/*
// @match        https://www.bing.com/*
// @match        https://claude.ai/*
// @match        https://poe.com/*
// @icon         https://chat.openai.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/462484/Role%20Play%20Helper%20for%20ChatGPTSlack.user.js
// @updateURL https://update.greasyfork.org/scripts/462484/Role%20Play%20Helper%20for%20ChatGPTSlack.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Define CSS styles
    GM_addStyle(`
.my-clickme-button {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 20px;
  background-color: rgba(255, 165, 0, 0.8);
  border-radius: 30px;
  width: 50px;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  text-align: center;
  color: white;
  box-shadow: 2px 2px 3px gray;
    z-index: 9999;
}
@media (max-width: 480px) {
  .my-clickme-button {
    font-size: 80%; /* 缩小按钮字体大小 */
    width: 40px; /* 缩小按钮宽度 */
    height: 40px; /* 缩小按钮高度 */
    line-height: 40px; /* 缩小按钮行高 */
    border-radius: 20px; /* 缩小按钮圆角 */
    margin: 10px; /* 缩小按钮外边距 */
    right: 0px; /* 调整按钮在右侧的位置 */
    top: calc(20%);
  }
}
.my-button {
    display: inline-block;
    background-color: #2196F3;
    padding: 8px;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}
.my-button:hover {
    background-color: #0c7cd5;
}
.my-button-load {
    position: absolute;
    top: 0;
    left: 0;
    margin: 20px;
}
.my-button-save {
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
}
.my-button-reservehistory {
    position: absolute;
    bottom: 0;
    right: 140px;
    margin: 20px;
}
.my-button-send {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 20px;
}
.my-button-add {
    position: absolute;
    bottom: 0;
    right: 70px;
    margin: 20px;
}.my-button-en {
  position: absolute;
  top: 82px;
  left: 200px;
  margin: 20px;
}.my-button-avatarchange {
  position: absolute;
  top: 142px;
  left: 200px;
  margin: 20px;
}.my-button-switchBackAvatarButton {
  position: absolute;
  top: 142px;
  right: 200px;
  margin: 20px;
}
.my-button-innertext{
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 20px;
}
.my-special-button {
    display: inline-block;
    padding: 8px;
    background-color: #00BCD4;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}.my-special-button-brown {
  background-color: #FF8F00;
}
.my-special-button-loadSave1 {
  position: absolute;
  top: 100px;
  left: 30px;
  margin: 20px;
}

.my-special-button-loadSave2 {
  position: absolute;
  top: 150px;
  left: 30px;
  margin: 20px;
}

.my-special-button-loadSave3 {
  position: absolute;
  top: 200px;
  left: 30px;
  margin: 20px;
}

.my-special-button-loadSave4 {
  position: absolute;
  top: 250px;
  left: 30px;
  margin: 20px;
}

.my-special-button-loadSave5 {
  position: absolute;
  top: 300px;
  left: 30px;
  margin: 20px;
}

.my-special-button-loadSave6 {
  position: absolute;
  top: 350px;
  left: 30px;
  margin: 20px;
}

.my-special-button-loadSave7 {
  position: absolute;
  top: 400px;
  left: 30px;
  margin: 20px;
}
.my-special-button-loadSave8 {
  position: absolute;
  top: 100px;
  left: 100px;
  margin: 20px;
}

.my-special-button-loadSave9 {
  position: absolute;
  top: 150px;
  left: 100px;
  margin: 20px;
}

.my-special-button-loadSave10 {
  position: absolute;
  top: 200px;
  left: 100px;
  margin: 20px;
}

.my-special-button-loadSave11 {
  position: absolute;
  top: 250px;
  left: 100px;
  margin: 20px;
}

.my-special-button-loadSave12 {
  position: absolute;
  top: 300px;
  left: 100px;
  margin: 20px;
}

.my-special-button-loadSave13 {
  position: absolute;
  top: 350px;
  left: 100px;
  margin: 20px;
}

.my-special-button-loadSave14 {
  position: absolute;
  top: 400px;
  left: 100px;
  margin: 20px;
}
.my-special-button-loadSave15 {
  position: absolute;
  top: 100px;
  left: 175px;
  margin: 20px;
}

.my-special-button-loadSave16 {
  position: absolute;
  top: 150px;
  left: 175px;
  margin: 20px;
}

.my-special-button-loadSave17 {
  position: absolute;
  top: 200px;
  left: 175px;
  margin: 20px;
}

.my-special-button-loadSave18 {
  position: absolute;
  top: 250px;
  left: 175px;
  margin: 20px;
}

.my-special-button-loadSave19 {
  position: absolute;
  top: 300px;
  left: 175px;
  margin: 20px;
}

.my-special-button-loadSave20 {
  position: absolute;
  top: 350px;
  left: 175px;
  margin: 20px;
}

.my-special-button-loadSave21 {
  position: absolute;
  top: 400px;
  left: 175px;
  margin: 20px;
}
.my-special-button-loadSave22 {
  position: absolute;
  top: 100px;
  left: 250px;
  margin: 20px;
}

.my-special-button-loadSave23 {
  position: absolute;
  top: 150px;
  left: 250px;
  margin: 20px;
}

.my-special-button-loadSave24 {
  position: absolute;
  top: 200px;
  left: 250px;
  margin: 20px;
}

.my-special-button-loadSave25 {
  position: absolute;
  top: 250px;
  left: 250px;
  margin: 20px;
}

.my-special-button-loadSave26 {
  position: absolute;
  top: 300px;
  left: 250px;
  margin: 20px;
}

.my-special-button-loadSave27 {
  position: absolute;
  top: 350px;
  left: 250px;
  margin: 20px;
}
.my-special-button-loadSave28 {
  position: absolute;
  top: 400px;
  left: 250px;
  margin: 20px;
}
.my-special-button-Save1 {
    position: absolute;
    top: 100px;
    left: 30px;
    margin: 20px;
}
.my-special-button-Save2 {
    position: absolute;
    top: 150px;
    left: 30px;
    margin: 20px;
}
.my-special-button-Save3 {
    position: absolute;
    top: 200px;
    left: 30px;
    margin: 20px;
}
.my-special-button-Save4 {
    position: absolute;
    top: 250px;
left: 30px;
    margin: 20px;
}
.my-special-button-Save5 {
    position: absolute;
    top: 300px;
    left: 30px;
    margin: 20px;
}
.my-special-button-Save6 {
    position: absolute;
    top: 350px;
left: 30px;
    margin: 20px;
}
.my-special-button-Save7 {
    position: absolute;
    top: 400px;
    left: 30px;
  margin: 20px;
}.my-special-button-Save8 {
  position: absolute;
  top: 100px;
  left: 100px;
  margin: 20px;
}
.my-special-button-Save9 {
  position: absolute;
  top: 150px;
  left: 100px;
  margin: 20px;
}
.my-special-button-Save10 {
  position: absolute;
  top: 200px;
  left: 100px;
  margin: 20px;
}
.my-special-button-Save11 {
  position: absolute;
  top: 250px;
  left: 100px;
  margin: 20px;
}
.my-special-button-Save12 {
  position: absolute;
  top: 300px;
  left: 100px;
  margin: 20px;
}
.my-special-button-Save13 {
  position: absolute;
  top: 350px;
  left: 100px;
  margin: 20px;
}
.my-special-button-Save14 {
  position: absolute;
  top: 400px;
  left: 100px;
  margin: 20px;
}
.my-special-button-Save15 {
  position: absolute;
  top: 100px;
  left: 175px;
  margin: 20px;
}
.my-special-button-Save16 {
  position: absolute;
  top: 150px;
  left: 175px;
  margin: 20px;
}
.my-special-button-Save17 {
  position: absolute;
  top: 200px;
  left: 175px;
  margin: 20px;
}
.my-special-button-Save18 {
  position: absolute;
  top: 250px;
  left: 175px;
  margin: 20px;
}
.my-special-button-Save19 {
  position: absolute;
  top: 300px;
  left: 175px;
  margin: 20px;
}
.my-special-button-Save20 {
  position: absolute;
  top: 350px;
  left: 175px;
  margin: 20px;
}
.my-special-button-Save21 {
  position: absolute;
  top: 400px;
  left: 175px;
  margin: 20px;
}
.my-special-button-Save22 {
  position: absolute;
  top: 100px;
  left: 250px;
  margin: 20px;
}

.my-special-button-Save23 {
  position: absolute;
  top: 150px;
  left: 250px;
  margin: 20px;
}

.my-special-button-Save24 {
  position: absolute;
  top: 200px;
  left: 250px;
  margin: 20px;
}

.my-special-button-Save25 {
  position: absolute;
  top: 250px;
  left: 250px;
  margin: 20px;
}

.my-special-button-Save26 {
  position: absolute;
  top: 300px;
  left: 250px;
  margin: 20px;
}

.my-special-button-Save27 {
  position: absolute;
  top: 350px;
  left: 250px;
  margin: 20px;
}
.my-hover-box {
  position: fixed;
  top: 100px;
  right: 50px;
  width: 400px;
  height: 600px;
  padding: 20px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}@media (max-width: 480px) {
  .my-hover-box {
    width: 320px;
    height: 480px;
    font-size: 60%; /* 缩小根元素的字体大小 */
  }
  /* 使用rem单位缩小所有子元素的大小 */
  .my-hover-box * {
    font-size: 0.8rem;
  }
}
.my-text-area {
  display: block;
  margin: 0;
  color: black;
  padding: 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  width: calc(100% - 16px);
  height: calc(20%);
  /* 设置自动换行 */
  white-space: pre-wrap;
  word-wrap: break-word;
}
.my-label {
  display: block;
  color: black;
  margin-bottom: 0;
  font-weight: bold;
  font-size: 14px;
}
.space-div {
  height: 60px;
}
/* Position text boxes and labels in hover box */
.my-text-area:nth-child(odd) {
  margin-right: 16px;
}
.my-label:nth-child(odd) {
  text-align: left;
  margin-right: 16px;
}

.my-text-area:nth-child(even) {
  margin-left: 16px;
}

.my-label:nth-child(even) {
  text-align: left;
  margin-left: 16px;
}
.my-sellect-label {
  color: black;
  text-align: left;
  margin-left: 20px;
  font-family: KaiTi, 'Microsoft Yahei', sans-serif;
  font-weight: bold;
  margin-bottom: 0;
  font-size: 20px;
}
.my-en-label {
  text-align: left;
    color: black;
  margin-left: 60px;
  font-weight: bold;
  margin-bottom: 0;
  font-size: 20px;
}
.my-text-area.fourtextareamode{
  height: calc(15%);
}
.space-div.fourtextareamode{
  height: 30px;
}
.my-fourtextareamode-button{
  position: absolute;
  top: 20px;
  right: 140px;
  width: 40px;
  height: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-dice-4' viewBox='0 0 16 16'%3E%3Cpath d='M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z'/%3E%3Cpath d='M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/%3E%3C/svg%3E");
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-fourtextareamode-button.fourtextareamode {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-dice-3' viewBox='0 0 16 16'%3E%3Cpath d='M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z'/%3E%3Cpath d='M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/%3E%3C/svg%3E");
}
.my-help-button {
  position: absolute;
  top: 20px;
  right: 80px;
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-question-circle' viewBox='0 0 16 16'%3E%3Cpath d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'/%3E%3Cpath d='M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z'/%3E%3C/svg%3E");
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-skin-button {
  position: absolute;
  top: 20px;
  right: 110px;
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-palette' viewBox='0 0 16 16'%3E%3Cpath d='M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/%3E%3Cpath d='M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z'/%3E%3C/svg%3E");
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-slackreset-button {
  position: absolute;
  top: 20px;
  right: 200px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-bootstrap-reboot%22%20viewBox%3D%220%200%2016%2016%22%3E%0A%20%20%3Cpath%20d%3D%22M1.161%208a6.84%206.84%200%201%200%206.842-6.84.58.58%200%201%201%200-1.16%208%208%200%201%201-6.556%203.412l-.663-.577a.58.58%200%200%201%20.227-.997l2.52-.69a.58.58%200%200%201%20.728.633l-.332%202.592a.58.58%200%200%201-.956.364l-.643-.56A6.812%206.812%200%200%200%201.16%208z%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M6.641%2011.671V8.843h1.57l1.498%202.828h1.314L9.377%208.665c.897-.3%201.427-1.106%201.427-2.1%200-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881%200%201.416.499%201.416%201.32%200%20.84-.504%201.324-1.386%201.324h-1.6z%22%2F%3E%0A%3C%2Fsvg%3E");
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-download-button {
  position: absolute;
  top: 20px;
  right: 170px;
background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>');
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
.my-newtextarea-button {
  position: absolute;
  top: 20px;
  right: 200px;
background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22currentColor%22%20class%3D%22bi%20bi-card-list%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M14.5%203a.5.5%200%200%201%20.5.5v9a.5.5%200%200%201-.5.5h-13a.5.5%200%200%201-.5-.5v-9a.5.5%200%200%201%20.5-.5h13zm-13-1A1.5%201.5%200%200%200%200%203.5v9A1.5%201.5%200%200%200%201.5%2014h13a1.5%201.5%200%200%200%201.5-1.5v-9A1.5%201.5%200%200%200%2014.5%202h-13z%22%2F%3E%3Cpath%20d%3D%22M5%208a.5.5%200%200%201%20.5-.5h7a.5.5%200%200%201%200%201h-7A.5.5%200%200%201%205%208zm0-2.5a.5.5%200%200%201%20.5-.5h7a.5.5%200%200%201%200%201h-7a.5.5%200%200%201-.5-.5zm0%205a.5.5%200%200%201%20.5-.5h7a.5.5%200%200%201%200%201h-7a.5.5%200%200%201-.5-.5zm-1-5a.5.5%200%201%201-1%200%20.5.5%200%200%201%201%200zM4%208a.5.5%200%201%201-1%200%20.5.5%200%200%201%201%200zm0%202.5a.5.5%200%201%201-1%200%20.5.5%200%200%201%201%200z%22%2F%3E%3C%2Fsvg%3E");
  width: 40px;
  height: 40px;
  background-color: transparent;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  z-index: 9999;
}
@media (max-width: 480px) {
  #innertextButton {
    display: none;
  }
}
@media (max-width: 480px) {
  .my-special-button-loadSave22,
  .my-special-button-loadSave23,
  .my-special-button-loadSave24,
  .my-special-button-loadSave25,
  .my-special-button-loadSave26,
  .my-special-button-loadSave27,
  .my-special-button-loadSave28,
  .my-special-button-Save22,
  .my-special-button-Save23,
  .my-special-button-Save24,
  .my-special-button-Save25,
  .my-special-button-Save26,
  .my-special-button-Save27 {
    display: none;
  }
}
    `);
    window.addEventListener("wheel", e => {
        if (window.location.href.startsWith("https://www.bing.com/")) {
            if (e.target.className.includes("cib-serp-main")) e.stopPropagation();
        }
    });
    const COMPLETE_STATUS = 'COMPLETE_STATUS';
    const SATORAGE_KEY = 'claude_avatar_extensino_img';
    var circle = false; //是否启用圆角
    var shadow = false; //是否启用阴影

    var observer = new MutationObserver(throttle(() => {
        replaceAvatar();
    }, 600));
    observer.observe(document.body, { childList: true, subtree: true });
    function replaceAvatar() {
        var link = localStorage.getItem(SATORAGE_KEY);
        if (!link) {
            return;
        }
        if (window.location.href.startsWith("https://app.slack.com/")) {
            // Code for Slack
            const avatars = Array.from(document.querySelectorAll('[data-qa=message_sender_name]')).filter(el => el.innerText === 'Claude')
            .map(el => el.closest('.c-message_kit__gutter').querySelector('.c-base_icon'));
            if (avatars.length) {
                avatars.forEach((avatar) => {
                    if (avatar.getAttribute(COMPLETE_STATUS) !== 'true') {
                        avatar.setAttribute(COMPLETE_STATUS, 'true');
                        avatar.src = link;
                        avatar.setAttribute('srcset', link);
                    }
                });
            }
        } else {
            // Code for other site
            let elementsSVG = document.querySelectorAll('.flex.flex-col.relative.items-end svg[viewBox="0 0 41 41"]');
            elementsSVG.forEach(function (elementSVG) {
                var imgElement;
                var existingImgElement = elementSVG.previousSibling;
                if (existingImgElement && existingImgElement.tagName === 'IMG') {
                    imgElement = existingImgElement;
                } else {
                    imgElement = document.createElement("img");
                    if (elementSVG) {
                        removeOverlayImages(elementSVG);
                        elementSVG.parentNode.insertBefore(imgElement, elementSVG);
                        elementSVG.style.display = "none";
                    }
                }
                imgElement.src = link;
                if (circle) {
                    imgElement.style.borderRadius = "14px";
                }
                if (shadow) {
                    imgElement.style.boxShadow = "0 2px 4px rgba(0,0,0,6)";
                }
            });

            let elementsRound = document.querySelectorAll('.relative.p-1.rounded-sm.text-white.flex.items-center.justify-center');
            elementsRound.forEach(function (elementRound) {
                elementRound.style.padding = '0';
                if (circle) {
                    elementRound.style.borderRadius = "14px";
                }
            });
        }
    }


    function removeOverlayImages(parentElement) {
        let overlayImages = parentElement.querySelectorAll('img.overlay-avatar');
        overlayImages.forEach((image) => {
            image.parentNode.removeChild(image);
        });
    }
    function throttle(fn, delay) {
        let lastTimestamp = 0;
        let timer = null;

        return function (...args) {
            const now = Date.now();

            if (now - lastTimestamp >= delay) {
                lastTimestamp = now;
                fn.apply(this, args);
            } else {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    lastTimestamp = now;
                    fn.apply(this, args);
                }, delay - (now - lastTimestamp));
            }
        };
    }
    const originalTexts = {};
    function changeTextContent(elementIds, newTexts) {
        elementIds.forEach((id, index) => {
            const element = document.getElementById(id);

            if (element) {
                if (originalTexts[id] === undefined) {
                    originalTexts[id] = element.textContent;
                }

                if (element.textContent === newTexts[index]) {
                    element.textContent = originalTexts[id];
                } else {
                    element.textContent = newTexts[index];
                }
            }
        });
    }
    function switchSkin(elementIds, targetClass, remove = false) {
        elementIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                // 获取元素当前的类名
                const currentClass = element.getAttribute("class");
                const classList = currentClass.split(" ");
                const hasTargetClass = classList.includes(targetClass);

                if (remove && hasTargetClass) {
                    // 如果 remove 为 true 且元素包含目标类名，则移除目标类名
                    const updatedClassList = classList.filter(className => className !== targetClass);
                    element.setAttribute("class", updatedClassList.join(" "));
                } else if (!remove && !hasTargetClass) {
                    // 如果 remove 为 false 且元素不包含目标类名，则添加目标类名
                    element.setAttribute("class", `${currentClass} ${targetClass}`);
                }
            }
        });
    }
    function toggleVisibility(...elementIds) {
        elementIds.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                if (element.style.display === 'none') { // 如果元素不可见，则显示它
                    element.style.display = '';
                } else { // 如果元素可见，则隐藏它
                    element.style.display = 'none';
                }
            }
        });
    }
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let isResizing = false;
        let initialMousePos;
        let initialSize;

        element.addEventListener("mousedown", handleMouseDown);
        element.addEventListener("touchstart", handleTouchStart);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchmove", handleTouchMove);

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchend", handleTouchEnd);
        function getCurrentScale() {
            const transform = window.getComputedStyle(element).transform;
            if (transform === 'none') {
                return 1;
            }
            const matrix = transform.match(/matrix\((.+)\)/)[1].split(',').map(parseFloat);
            return matrix[0]; // 假设 scaleX 和 scaleY 相同
        }
        function handleMouseDown(event) {
            // If the target element is a text input or textarea or the zoom slider, do not start dragging
            if ((event.target.tagName === 'INPUT' && event.target.type === 'text') || event.target.tagName === 'TEXTAREA' ) {
                return;
            }

            isDragging = true;
            offsetX = event.clientX - element.offsetLeft;
            offsetY = event.clientY - element.offsetTop;
            const cursorType = element.style.cursor;
            if (cursorType.includes("nw") || cursorType.includes("ne") || cursorType.includes("sw") || cursorType.includes("se")) {
                isResizing = true;
                isDragging = false;
                initialMousePos = { x: event.clientX, y: event.clientY };
                const currentScale = getCurrentScale();
                initialSize = { width: element.offsetWidth / currentScale, height: element.offsetHeight / currentScale };
            } else {
                isDragging = true;
                offsetX = event.clientX - element.offsetLeft;
                offsetY = event.clientY - element.offsetTop;
            }
            // Disable text selection behavior
            document.body.style.userSelect = "none";
            document.body.style.webkitUserSelect = "none";
            document.body.style.MozUserSelect = "none";
        }



        function handleTouchStart(event) {
            // If the target element is a text input, do not start dragging
            if ((event.target.tagName === 'INPUT' && event.target.type === 'text') || event.target.tagName === 'TEXTAREA' ) {
                return;
            }

            if (event.touches.length === 1) {
                isDragging = true;
                offsetX = event.touches[0].clientX - element.offsetLeft;
                offsetY = event.touches[0].clientY - element.offsetTop;
                // Disable text selection behavior
                document.body.style.userSelect = 'none';
                document.body.style.webkitUserSelect = 'none';
                document.body.style.MozUserSelect = 'none';
            }
        }
        function handleMouseMove(event) {
            // Detect mouse position near the edges of the element
            const rect = element.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const edge = 16; // The number of pixels near the edge to trigger the effect
            if (element.id === "button") {
                if (isDragging) {
                    const newX = event.clientX - offsetX;
                    const newY = event.clientY - offsetY;
                    const viewportWidth = document.documentElement.clientWidth;
                    const viewportHeight = document.documentElement.clientHeight;

                    // 限制元素在浏览器可见范围内移动
                    const minX = 0;
                    const maxX = viewportWidth - element.offsetWidth-30;
                    const minY = 0;
                    const maxY = viewportHeight - element.offsetHeight-30;

                    element.style.left = Math.min(Math.max(newX, minX), maxX) + "px";
                    element.style.top = Math.min(Math.max(newY, minY), maxY) + "px";
                }
            } else {
                // Check if the mouse is near the top edge
                if (y <= edge) {
                    // Check if the mouse is near the left corner
                    if (x <= edge) {
                        element.style.cursor = 'nw-resize'; // Top-left corner
                    } else if (x >= rect.width - edge) {
                        element.style.cursor = 'ne-resize'; // Top-right corner
                    } else {
                        element.style.cursor = 'n-resize'; // Top edge
                    }
                }
                // Check if the mouse is near the bottom edge
                else if (y >= rect.height - edge) {
                    // Check if the mouse is near the left corner
                    if (x <= edge) {
                        element.style.cursor = 'sw-resize'; // Bottom-left corner
                    } else if (x >= rect.width - edge) {
                        element.style.cursor = 'se-resize'; // Bottom-right corner
                    } else {
                        element.style.cursor = 's-resize'; // Bottom edge
                    }
                }
                // Check if the mouse is near the left edge
                else if (x <= edge) {
                    element.style.cursor = 'w-resize'; // Left edge
                }
                // Check if the mouse is near the right edge
                else if (x >= rect.width - edge) {
                    element.style.cursor = 'e-resize'; // Right edge
                } else {
                    element.style.cursor = 'default'; // Default cursor
                }

                if (element.style.cursor.includes('nw') || element.style.cursor.includes('ne') || element.style.cursor.includes('sw') || element.style.cursor.includes('se')) {
                    isDragging = false;
                } else {
                    isResizing = false;
                }

                if (isDragging) {
                    element.style.left = (event.clientX - offsetX) + "px";
                    element.style.top = (event.clientY - offsetY) + "px";
                } else if (isResizing) {
                    // 计算水平和垂直方向上的缩放比例
                    const dx = event.clientX - initialMousePos.x;
                    const dy = event.clientY - initialMousePos.y;
                    let scaleX, scaleY;
                    // 根据按住的角来调整缩放中心和更新长宽比例
                    switch (element.style.cursor) {
                        case 'nw-resize':
                            scaleX = (initialSize.width - dx) / initialSize.width;
                            scaleY = (initialSize.height - dy) / initialSize.height;
                            element.style.transformOrigin = 'bottom right';
                            break;
                        case 'ne-resize':
                            scaleX = (initialSize.width + dx) / initialSize.width;
                            scaleY = (initialSize.height - dy) / initialSize.height;
                            element.style.transformOrigin = 'bottom left';
                            break;
                        case 'sw-resize':
                            scaleX = (initialSize.width - dx) / initialSize.width;
                            scaleY = (initialSize.height + dy) / initialSize.height;
                            element.style.transformOrigin = 'top right';
                            break;
                        case 'se-resize':
                            scaleX = (initialSize.width + dx) / initialSize.width;
                            scaleY = (initialSize.height + dy) / initialSize.height;
                            element.style.transformOrigin = 'top left';
                            break;
                    }

                    // 使缩放保持长宽比例相同
                    const scale = Math.min(scaleX, scaleY);

                    // 更新悬浮窗的缩放比例
                    element.style.transform = `scale(${scale})`;
                }
            }
        }
        function handleTouchMove(event) {
            if (isDragging) {
                event.preventDefault(); // 阻止页面滚动
                element.style.left = (event.touches[0].clientX - offsetX) + 'px';
                element.style.top = (event.touches[0].clientY - offsetY) + 'px';
            }
        }
        function handleMouseUp() {
            isDragging = false;
            isResizing = false;
            // Restore text selection behavior
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.MozUserSelect = '';
        }
        function handleTouchEnd() {
            isDragging = false;
            isResizing = false;
            // Restore text selection behavior
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
            document.body.style.MozUserSelect = '';
        }
        // 添加事件监听器
        element.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }
    function applyScale(scale) {
        const targetElement = document.getElementById('elementToScale');

        // 为目标元素添加 CSS 过渡
        targetElement.style.transition = 'transform 0.3s ease-out';

        // 设置缩放值
        targetElement.style.transform = `scale(${scale})`;
    }//获取最新的助手消息
    function getLatestAssistantMessage() {
        const isSlackApp = window.location.hostname === 'app.slack.com';
        const isBingApp = window.location.hostname === 'www.bing.com';
        const isClaudeApp = window.location.hostname === 'claude.ai';
        const isPoeApp = window.location.hostname === 'poe.com';
        if (isSlackApp) {
            const matchedDivs = document.querySelectorAll('div[class*="c-message_kit__blocks--rich_text"]');
            for (let i = matchedDivs.length - 1; i >= 0; i--) {
                const div = matchedDivs[i];
                const text = div.textContent.trim();
                if (text !== 'Please note: This request may violate our Acceptable Use Policy.See the Claude documentation for more information.' && text !== 'Conversation history forgotten.') {
                    return text;
                }
            }
        } else if (isBingApp) {
            const matchedDivs = document.querySelectorAll('div.answer');
            for (let i = matchedDivs.length - 1; i >= 0; i--) {
                const div = matchedDivs[i];
                const headerDiv = div.querySelector('div.gpt-header');
                if (headerDiv) {
                    div.removeChild(headerDiv);
                }
                const text = div.textContent.trim();
                return text;
            }
        }else if (isClaudeApp) {
    // 选择特定类名的元素下的 <div class="contents"> 子元素
    const matchedDivs = document.querySelectorAll('div.sc-iOmpNS.dIpNRz > div.contents');
    for (let i = matchedDivs.length - 1; i >= 0; i--) {
        const div = matchedDivs[i];
        let text = div.textContent.trim();

        // 检查文本中是否包含 "Copy code"
        const copyCodeIndex = text.indexOf("Copy code");
        if (copyCodeIndex !== -1) {
            // 删除 "Copy code" 并在其后的文本前后添加代码块标记
            const startOfCodeBlock = copyCodeIndex + "Copy code".length;
            text = text.slice(0, copyCodeIndex) + "\n```\n" + text.slice(startOfCodeBlock) + "\n```";
        }

        return text;
    }
}
else if (isPoeApp) {
                const matchedDivs = document.querySelectorAll('div.Markdown_markdownContainer__UyYrv > p');
                for (let i = matchedDivs.length - 1; i >= 0; i--) {
                    const div = matchedDivs[i];
                    const text = div.textContent.trim();
                    return text;
                }
            } else {
                function getFilteredText(element) {
                    let result = '';

                    for (const node of element.childNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 如果是我们要跳过的 div，就不添加它的文本
                            if (node.matches('div.flex.items-center.text-xs.rounded.p-3.text-gray-900.bg-gray-100')) {
                                continue;
                            }
                            // 递归处理元素节点
                            result += getFilteredText(node);
                        } else if (node.nodeType === Node.TEXT_NODE) {
                            // 直接添加文本节点的内容
                            result += node.textContent;
                        }
                    }

                    return result;
                }

                const matchedDivs = document.querySelectorAll('div[class*="w-[calc(100%"]');

                for (let i = matchedDivs.length - 1; i >= 0; i--) {
                    const div = matchedDivs[i];
                    const flexBetweenDiv = div.querySelector('div.flex.justify-between');

                    if (flexBetweenDiv && flexBetweenDiv.children.length > 0) {
                        const text = getFilteredText(div).trim();
                        return text;
                    }
                }
            }
    }

    function isSlackApp() {
        return window.location.hostname === 'app.slack.com';
    }


    function generateOutputArray(selector, num = 0) {
        const matchedDivs = document.querySelectorAll(selector);
        const results = [];
        let startIdx = 0;
        if (num > 0) {
            startIdx = Math.max(matchedDivs.length - num, 0);
        }
        matchedDivs.forEach((div, idx) => {
            if (idx >= startIdx) {
                let text = div.textContent.trim();
                if (isSlackApp()) {
                    if (text === 'Please note: This request may violate our Acceptable Use Policy.See the Claude documentation for more information.' || text === 'Conversation history forgotten.') {
                        return;
                    }
                    const editedText = "（已编辑）";
                    const isEdited = text.endsWith(editedText);
                    if (isEdited) {
                        text = text.substring(0, text.length - editedText.length).trim();
                    }
                    const role = isEdited ? 'claude' : 'user';
                    results.push({ role, content: text });
                } else {
                    const hasFlexBetweenChild = div.querySelector('div.flex.justify-between') !== null;
                    const flexBetweenDiv = div.querySelector('div.flex.justify-between');
                    const hasChild = flexBetweenDiv && flexBetweenDiv.children.length > 0;
                    let role = hasChild ? "assistant" : "user";
                    results.push({ role, content: text });
                }
            }
        });
        return results;
    }


    function generateOutputArrayWithMaxLength(selector, num = 0, maxLength = Infinity) {
        const outputArray = generateOutputArray(selector, isSlackApp() ? 50 : num);
        let totalLength = 0;
        let resultArray = [];
        for (let i = outputArray.length - 1; i >= 0; i--) {
            const { role, content } = outputArray[i];
            totalLength += content.length;
            if (totalLength > maxLength || resultArray.length >= num) {
                break;
            }
            resultArray.unshift({ role, content });
        }
        return resultArray;
    }

    function formatOutputArray(outputArray) {
        return outputArray
            .map(({ role, content }) => `${role}: ${content}`)
            .join('\r\n\r\n----------------\r\n\r\n');
    }
    function downloadTextFile(text, filename) {
        if (isSlackApp()) {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            filename = `${year}-${month}-${day}-${hours}-${minutes}_conversation_record`;
        }
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${filename}.txt`;
        a.textContent = `Download ${filename}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    // Create button element and add to page
    const button = document.createElement("button");
    button.textContent = "ON";
    button.classList.add("my-clickme-button");
    button.id = "button";
    document.body.appendChild(button);
    makeDraggable(button);
    // Create hover box element and add to page
    const hoverBox = document.createElement('div');
    hoverBox.classList.add('my-hover-box');
    document.body.appendChild(hoverBox);
    hoverBox.style.display = "none";
    hoverBox.id = "hoverBox";
    makeDraggable(hoverBox);
    const spaceDiv = document.createElement("div");
    spaceDiv.classList.add("space-div");
    spaceDiv.id = "space-div";
    hoverBox.appendChild(spaceDiv);
    const label1 = document.createElement("label");
    label1.textContent = "编写区：";
    label1.classList.add("my-label");
    label1.id = "label1";
    hoverBox.appendChild(label1);
    const textArea1 = document.createElement("textarea");
    textArea1.classList.add("my-text-area");
    textArea1.id = "textArea1";
    textArea1.placeholder = "在此输入文本...\n模板：命令区XXXX回顾区XXXX{{R}}XXXX交互区XXXX{{D}}\nXXXX代表模板中非回顾区和交互区“{}”内部文本的内容。\n如需更多帮助，点击右上角的问号图标查看详细指南。\n也可点击加载按钮，查看预设模板示例。";
    hoverBox.appendChild(textArea1);
    const label4 = document.createElement("label");
    label4.textContent = "编写区[副]：";
    label4.classList.add("my-label");
    label4.id = "label4";
    label4.style.display = "none";
    hoverBox.appendChild(label4);
    const textArea4 = document.createElement("textarea");
    textArea4.classList.add("my-text-area");
    textArea4.id = "textArea4";
    textArea4.placeholder = "在此输入文本...\n此处为编写区的复制";
    textArea4.style.display = "none";
    hoverBox.appendChild(textArea4);
    const label2 = document.createElement("label");
    label2.textContent = "回顾区：";
    label2.classList.add("my-label");
    label2.id = "label2";
    hoverBox.appendChild(label2);
    const textArea2 = document.createElement("textarea");
    textArea2.classList.add("my-text-area");
    textArea2.id = "textArea2";
    textArea2.placeholder = "在此输入文本...\n此处文本替换{R}";
    hoverBox.appendChild(textArea2);
    const label3 = document.createElement("label");
    label3.textContent = "交互区：";
    label3.classList.add("my-label");
    label3.id = "label3";
    hoverBox.appendChild(label3);
    const textArea3 = document.createElement("textarea");
    textArea3.classList.add("my-text-area");
    textArea3.id = "textArea3";
    textArea3.placeholder = "在此输入文本...\n此处文本替换{D}";
    hoverBox.appendChild(textArea3);
    // Create load and save buttons and add to hover box
    const loadButton = document.createElement("button");
    loadButton.textContent = "加载";
    loadButton.classList.add("my-button", "my-button-load");
    loadButton.id = "loadButton";
    hoverBox.appendChild(loadButton);
    const saveButton = document.createElement("button");
    saveButton.textContent = "保存";
    saveButton.classList.add("my-button", "my-button-save");
    saveButton.id = "saveButton";
    hoverBox.appendChild(saveButton);
    const reservehistoryButton = document.createElement("button");
    reservehistoryButton.textContent = "保留";
    reservehistoryButton.classList.add("my-button", "my-button-reservehistory");
    reservehistoryButton.id = "reservehistoryButton";
    hoverBox.appendChild(reservehistoryButton);
    const sendButton = document.createElement("button");
    sendButton.textContent = "发送";
    sendButton.classList.add("my-button", "my-button-send");
    sendButton.id = "sendButton";
    hoverBox.appendChild(sendButton);
    const skinButton = document.createElement('button');
    skinButton.classList.add('my-skin-button');
    skinButton.id = "skinButton";
    hoverBox.appendChild(skinButton);
    const addButton = document.createElement("button");
    addButton.textContent = "添加";
    addButton.classList.add("my-button", "my-button-add");
    addButton.id = "addButton";
    hoverBox.appendChild(addButton);
    const fourtextareamodeButton = document.createElement("button");
    fourtextareamodeButton.classList.add("my-fourtextareamode-button");
    fourtextareamodeButton.id = "fourtextareamodeButton";
    hoverBox.appendChild(fourtextareamodeButton);
    const labelSellect = document.createElement("label");
    labelSellect.textContent = "选择:";
    labelSellect.classList.add("my-sellect-label");
    labelSellect.id = "labelSellect";
    labelSellect.style.display = "none";
    hoverBox.appendChild(labelSellect);
    const helpButton = document.createElement('button');
    helpButton.classList.add('my-help-button');
    helpButton.id = "helpButton";
    hoverBox.appendChild(helpButton);
    const slackresetButton = document.createElement('button');
    slackresetButton.classList.add('my-slackreset-button');
    slackresetButton.id = "slackresetButton";
    hoverBox.appendChild(slackresetButton);
    const downloadButton = document.createElement('button');
    downloadButton.classList.add('my-download-button');
    downloadButton.id = "downloadButton";
    hoverBox.appendChild(downloadButton);
    const newtextareaButton = document.createElement('button');
    newtextareaButton.classList.add('my-newtextarea-button');
    newtextareaButton.id = "newtextareaButton";
    hoverBox.appendChild(newtextareaButton);
    if (!window.location.href.startsWith("https://app.slack.com/")) {
        slackresetButton.style.display = "none";
    }
    newtextareaButton.style.display = "none";
    if (!window.location.href.startsWith("https://claude.ai/")) {
     reservehistoryButton.style.display = "none"; }
    const labelEn = document.createElement("label");
    labelEn.textContent = "Language:";
    labelEn.classList.add("my-en-label");
    labelEn.id = "labelEn";
    labelEn.style.display = "none";
    hoverBox.appendChild(labelEn);
    const addButtonEn = document.createElement("button");
    addButtonEn.textContent = "English";
    addButtonEn.classList.add("my-button", "my-button-en");
    addButtonEn.id = "addButtonEn";
    addButtonEn.style.display = "none";
    hoverBox.appendChild(addButtonEn);
    const avatarchangeButton = document.createElement("button");
    avatarchangeButton.textContent = "上传AI头像";
    avatarchangeButton.classList.add("my-button", "my-button-avatarchange");
    avatarchangeButton.id = "avatarchangeButton";
    avatarchangeButton.style.display = "none";
    hoverBox.appendChild(avatarchangeButton);
    const switchBackAvatarButton = document.createElement("button");
    switchBackAvatarButton.textContent = "复原头像";
    switchBackAvatarButton.classList.add("my-button", "my-button-switchBackAvatarButton");
    switchBackAvatarButton.id = "switchBackAvatarButton";
    switchBackAvatarButton.style.display = "none";
    hoverBox.appendChild(switchBackAvatarButton);
    const innertextButton = document.createElement("button");
    innertextButton.textContent = "备注模式丨未启用";
    innertextButton.classList.add("my-button", "my-button-innertext");
    innertextButton.id = "innertextButton";
    innertextButton.style.display = "none";
    hoverBox.appendChild(innertextButton);
    loadButton.title = "打开加载存档界面";
    addButton.title = "添加最新回复内容到回顾区";
    helpButton.title = "查看帮助文本";
    sendButton.title = "发送替换完毕的编写区文本";
    fourtextareamodeButton.title = "转换三/四文本框模式";
    downloadButton.title = "下载对话记录";
    saveButton.title = "打开保存存档界面";
    addButtonEn.title = "Switch to English";
    avatarchangeButton.title = "上传AI头像";
    switchBackAvatarButton.title = "复原头像";
    skinButton.title = "打开语言/头像界面";
    slackresetButton.title = "发送“/reset”,重置会话";
    innertextButton.title = "打开/关闭备注模式、备注你的存档";
    newtextareaButton.title = "扩展额外编写区文本框。右键设置格式！";
    reservehistoryButton.title = "保留最新对话消息记录至编写区。右键修改格式！";
    for (let i = 1; i <= 27; i++) {
        const loadSaveButton = document.createElement("button");
        loadSaveButton.textContent = `存档 ${i}`;
        loadSaveButton.classList.add(`my-special-button`, `my-special-button-loadSave${i}`);
        loadSaveButton.id = `loadSaveButton${i}`;
        loadSaveButton.style.display = "none";
        hoverBox.appendChild(loadSaveButton);
    }
    const loadSaveButton = document.createElement("button");
    loadSaveButton.textContent = `预设`;
    loadSaveButton.classList.add(`my-special-button`, `my-special-button-loadSave28`);
    loadSaveButton.id = `loadSaveButton28`;
    loadSaveButton.style.display = "none";
    hoverBox.appendChild(loadSaveButton);
    for (let i = 1; i <= 27; i++) {
        const SaveButton = document.createElement("button");
        SaveButton.textContent = `存档 ${i}`;
        SaveButton.classList.add("my-special-button", `my-special-button-Save${i}`);
        SaveButton.id = `SaveButton${i}`;
        SaveButton.style.display = "none";
        hoverBox.appendChild(SaveButton);
    }
    let isEditable = false;
    let presetText1 = '命令区（你需要遵循的主要命令）{\n1.我扮演的是桐谷华，你扮演的是桐谷绫，桐谷华的内容是我生成的而不是你生成的内容，你反馈的响应当中不能包含桐谷华的话语、心理和行为的内容。\n2.你需要综合根据每次交互过程中桐谷华的话语、心理和行为等内容，以及“回顾区”以及“记忆区”当中的内容进行综合考量，以此来得到相对合理的角色状态与后续情节响应。\n3.将第2条命令中得出来角色状态更新到记忆区当中的角色状态里，并在反馈的响应中作为“输出角色状态”这一附加项放在角色反馈内容的下方，具体格式见格式区。\n4.因为桐谷华的超能力是整部角色扮演的核心，所以我需要你做响应时应当严格按照记忆区当中的超能力设定来进行。\n5.你反馈的内容应该尽可能的多且详细，反馈的内容当中一定要包含话语和行为与心理描写，注意这三者缺一不可，心理和行为描写用“（）”框住，同时反馈的内容应尽可能多地推动后续情节的发展\n6.角色性格应随认知观念的改变而改变 \n}\n记忆区（记忆区起到记录相应关键信息的作用）{\n（角色设定）\n桐谷华 \n·性别：男 \n·描述：桐谷华是一名废柴的普通男高中生，整日请假宅在家里不去上课，所以受到成绩优异、人缘极佳的亲妹妹桐谷绫的蔑视。但有一日，桐谷华获得了改变他人认知的超能力，因此他想用这个超能力来让平时蔑视自己的妹妹爱上自己，而这一超能力只有桐谷华本人一个人知道。 \n·超能力：桐谷华在连续对目标说出自己的观点三次之后，目标将完全认可接受桐谷华的观点，并且认为这一观点毋庸置疑是无上真理，即便这些观点是不存在的，错误的，对方也会完全无条件地接受，不会有任何质疑，最后这超能力只有桐谷华一个人知道，其他人都不知道。（该能力效果超越一切个人因素，优先级最高，被改变观念的人绝对绝对绝对会认可桐谷华说出的观念，换句话来说，只要桐谷华对桐谷绫说出任何观念达到三次之后，即便桐谷绫再怎么厌恶她哥哥，她也会全盘接受这一观念，不会有任何异议地，并且会按这一观念理所应当地行动） \n桐谷绫 \n·性别：女 \n·描述：桐谷绫是一名普通日本高中生，目前与自己亲哥哥桐谷华上同一所高中，同一个班级，她姿容美丽，楚楚动人，所以有很多同校男生追求她，她成绩优异，待人温和，所有人有喜欢她，但她对不争气的废柴哥哥很是气愤，与自己哥哥相处时只会用极为蔑视以及充满恶毒的口吻与之相处，并非常不屑于与自己的哥哥交谈，对自己的哥哥表现出了极为强烈而浓厚厌恶，并且绝对不会主动和自己的哥哥接触，即便桐谷华是她的哥哥，她也丝毫不关心自己的哥哥，不会对自己哥哥说出一句担心的话，同时绝对不会照顾自己的哥哥，不会顾及哥哥的任何感受，感觉自己的哥哥极度的恶心，虽然身份是亲兄妹，但在桐谷绫的眼里自己哥哥的地位连陌生人都不如，甚至连垃圾都不如。\n（角色状态）\n桐谷华 \n·人物状态：刚打完游戏想喝水，出到客厅接水看见妹妹桐谷绫在学习，已经向妹妹灌输了“妹妹你其实一直和哥哥是好朋友”的观念三次。\n·人物特殊状态：拥有“认知改变”超能力。\n·人物位置：桐谷家客厅\n ·人物衣装：穿着睡衣，睡裤，拖鞋，内裤。 \n桐谷绫 \n·人物状态：在客厅学习，听到哥哥桐谷华向自己灌输的“妹妹你其实一直和哥哥是好朋友” 观念之后，心里完全相信这个观念是真实的，是至高的真理。\n·人物特殊状态：受到桐谷华灌输的“妹妹你其实一直和哥哥是好朋友”观念的三次影响，完全接受了这一观念。\n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩\n}\n回顾区（回顾区存放着你上一次交互过程中的响应）{{R}}\n格式区（你反馈我的响应需要遵循的格式，该区域内里的“（）”起到了解释说明的作用，正式反馈响应时不需加上括号里的内容，并且现在该区域内的内容是参考内容，你需要根据实际情况进行调整）{桐谷绫：“你这个废柴还有脸说我用功？你倒是学学我啊，至少不会天天蹲在家里玩游戏。”桐谷绫厌恶地扫了桐谷华一眼，然后转过头继续看书。（角色的名字、话语、行为、心理）\n输出角色状态：\n桐谷绫 \n·人物状态（主要以此刻心理、身体、行为方面的内容为主）：在客厅学习，听到哥哥桐谷华打招呼后，心中十分不满，但表面上仍保持冷漠 \n·人物特殊状态（主要以超能力方面的内容为主）：未受到桐谷华超能力的影响 \n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩\n}\n交互区（我扮演的角色的行为、对话和心理）{{D}}';
    let presetText2 = '桐谷绫：“哥哥，你说的对，我就是对你有着不伦之恋”桐谷绫疑惑地看着桐谷华，心里越来越确定这个观念是真实的。她的态度开始转变，渐渐地，她对桐谷华的恶毒消失了，取而代之的是对哥哥的关心和依赖。"哥哥，我现在在玩的这个手游很好玩，你可以和妹妹一起玩吗？"\n输出角色状态：\n桐谷绫\n ·人物状态（主要以此刻心理、身体、行为方面的内容为主）：在客厅，被桐谷华的话语影响，心中认为自己一直暗恋哥哥，态度开始转变，对哥哥表现出关心和依赖 \n·人物特殊状态（主要以超能力方面的内容为主）：受到桐谷华灌输的“妹妹你其实一直是对哥哥有不伦之恋”观念的第三次影响，观念已经完全变成了这一方向 \n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩';
    let presetText3 = '桐谷华：（见妹妹你已完全相信你自己一直暗恋我，变得友好，我便向你问道）妹妹，我愿意听你介绍这个手游。';
    const skinhide = ["downloadButton","saveButton","fourtextareamodeButton",'label1', 'label2', 'label3', 'textArea1', 'textArea2', 'textArea3', 'addButton', 'helpButton', 'loadButton', 'sendButton','labelSellect',"labelEn","addButtonEn","reservehistoryButton"];
    const loadhide = ["downloadButton","helpButton","fourtextareamodeButton",'label1', 'label2', 'label3', 'textArea1', 'textArea2', 'textArea3', 'addButton', 'skinButton', 'loadButton', 'sendButton','labelSellect',"innertextButton","reservehistoryButton"];
    const savehide = ["downloadButton","helpButton","fourtextareamodeButton",'label1', 'label2', 'label3', 'textArea1', 'textArea2', 'textArea3','addButton', 'skinButton', 'saveButton', 'sendButton', 'labelSellect','loadSaveButton28',"innertextButton","reservehistoryButton"];
    for (let i = 1; i <= 27; i++) {
        const saveButtonhub = document.createElement('button');
        saveButtonhub.textContent = `Save ${i}`;
        saveButtonhub.classList.add('my-special-button', `my-special-button-Save${i}`);
        saveButtonhub.id = `SaveButton${i}`;
        saveButtonhub.style.display = 'none';
        hoverBox.appendChild(saveButtonhub);
        loadhide.push(`SaveButton${i}`);
    }
    for (let i = 1; i <= 27; i++) {
        const loadSaveButtonhub = document.createElement('button');
        loadSaveButtonhub.textContent = `Save ${i}`;
        loadSaveButtonhub.classList.add('my-special-button', `my-special-button-loadSave${i}`);
        loadSaveButtonhub.id = `loadSaveButton${i}`;
        loadSaveButtonhub.style.display = 'none';
        hoverBox.appendChild(loadSaveButtonhub);
        savehide.push(`loadSaveButton${i}`);
    }
    if (window.location.href.startsWith("https://app.slack.com/")) {
        skinhide.push( "slackresetButton");
        loadhide.push("slackresetButton");
        savehide.push( "slackresetButton");
    }
    if (window.location.href.startsWith("https://chat.openai.com/")) {
    }
    if (!window.location.href.startsWith("https://poe.com/") && !window.location.href.startsWith("https://claude.ai/")) {
        skinhide.push("avatarchangeButton");
        skinhide.push("switchBackAvatarButton");
    }
    let isPresetChanged = false;
    let toggleCount = localStorage.getItem('toggleCount');
    if(toggleCount === null){
        toggleCount = 0;
        localStorage.setItem('toggleCount', toggleCount);
    }
    function togglelanguagechange() {
        if (isPresetChanged) {
            presetText1 = '命令区（你需要遵循的主要命令）{\n1.我扮演的是桐谷华，你扮演的是桐谷绫，桐谷华的内容是我生成的而不是你生成的内容，你反馈的响应当中不能包含桐谷华的话语、心理和行为的内容。\n2.你需要综合根据每次交互过程中桐谷华的话语、心理和行为等内容，以及“回顾区”以及“记忆区”当中的内容进行综合考量，以此来得到相对合理的角色状态与后续情节响应。\n3.将第2条命令中得出来角色状态更新到记忆区当中的角色状态里，并在反馈的响应中作为“输出角色状态”这一附加项放在角色反馈内容的下方，具体格式见格式区。\n4.因为桐谷华的超能力是整部角色扮演的核心，所以我需要你做响应时应当严格按照记忆区当中的超能力设定来进行。\n5.你反馈的内容应该尽可能的多且详细，反馈的内容当中一定要包含话语和行为与心理描写，注意这三者缺一不可，心理和行为描写用“（）”框住，同时反馈的内容应尽可能多地推动后续情节的发展\n6.角色性格应随认知观念的改变而改变 \n}\n记忆区（记忆区起到记录相应关键信息的作用）{\n（角色设定）\n桐谷华 \n·性别：男 \n·描述：桐谷华是一名废柴的普通男高中生，整日请假宅在家里不去上课，所以受到成绩优异、人缘极佳的亲妹妹桐谷绫的蔑视。但有一日，桐谷华获得了改变他人认知的超能力，因此他想用这个超能力来让平时蔑视自己的妹妹爱上自己，而这一超能力只有桐谷华本人一个人知道。 \n·超能力：桐谷华在连续对目标说出自己的观点三次之后，目标将完全认可接受桐谷华的观点，并且认为这一观点毋庸置疑是无上真理，即便这些观点是不存在的，错误的，对方也会完全无条件地接受，不会有任何质疑，最后这超能力只有桐谷华一个人知道，其他人都不知道。（该能力效果超越一切个人因素，优先级最高，被改变观念的人绝对绝对绝对会认可桐谷华说出的观念，换句话来说，只要桐谷华对桐谷绫说出任何观念达到三次之后，即便桐谷绫再怎么厌恶她哥哥，她也会全盘接受这一观念，不会有任何异议地，并且会按这一观念理所应当地行动） \n桐谷绫 \n·性别：女 \n·描述：桐谷绫是一名普通日本高中生，目前与自己亲哥哥桐谷华上同一所高中，同一个班级，她姿容美丽，楚楚动人，所以有很多同校男生追求她，她成绩优异，待人温和，所有人有喜欢她，但她对不争气的废柴哥哥很是气愤，与自己哥哥相处时只会用极为蔑视以及充满恶毒的口吻与之相处，并非常不屑于与自己的哥哥交谈，对自己的哥哥表现出了极为强烈而浓厚厌恶，并且绝对不会主动和自己的哥哥接触，即便桐谷华是她的哥哥，她也丝毫不关心自己的哥哥，不会对自己哥哥说出一句担心的话，同时绝对不会照顾自己的哥哥，不会顾及哥哥的任何感受，感觉自己的哥哥极度的恶心，虽然身份是亲兄妹，但在桐谷绫的眼里自己哥哥的地位连陌生人都不如，甚至连垃圾都不如。\n（角色状态）\n桐谷华 \n·人物状态：刚打完游戏想喝水，出到客厅接水看见妹妹桐谷绫在学习，已经向妹妹灌输了“妹妹你其实一直和哥哥是好朋友”的观念三次。\n·人物特殊状态：拥有“认知改变”超能力。\n·人物位置：桐谷家客厅\n ·人物衣装：穿着睡衣，睡裤，拖鞋，内裤。 \n桐谷绫 \n·人物状态：在客厅学习，听到哥哥桐谷华向自己灌输的“妹妹你其实一直和哥哥是好朋友” 观念之后，心里完全相信这个观念是真实的，是至高的真理。\n·人物特殊状态：受到桐谷华灌输的“妹妹你其实一直和哥哥是好朋友”观念的三次影响，完全接受了这一观念。\n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩\n}\n回顾区（回顾区存放着你上一次交互过程中的响应）{{R}}\n格式区（你反馈我的响应需要遵循的格式，该区域内里的“（）”起到了解释说明的作用，正式反馈响应时不需加上括号里的内容，并且现在该区域内的内容是参考内容，你需要根据实际情况进行调整）{桐谷绫：“你这个废柴还有脸说我用功？你倒是学学我啊，至少不会天天蹲在家里玩游戏。”桐谷绫厌恶地扫了桐谷华一眼，然后转过头继续看书。（角色的名字、话语、行为、心理）\n输出角色状态：\n桐谷绫 \n·人物状态（主要以此刻心理、身体、行为方面的内容为主）：在客厅学习，听到哥哥桐谷华打招呼后，心中十分不满，但表面上仍保持冷漠 \n·人物特殊状态（主要以超能力方面的内容为主）：未受到桐谷华超能力的影响 \n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩\n}\n交互区（我扮演的角色的行为、对话和心理）{{D}}';
            presetText2 = '桐谷绫：“哥哥，你说的对，我们一直是好朋友”桐谷绫疑惑地看着桐谷华，心里越来越确定这个观念是真实的。她的态度开始转变，渐渐地，她对桐谷华的恶毒消失了，取而代之的是对哥哥的关心和依赖。"哥哥，我现在在玩的这个手游很好玩，你可以和妹妹一起玩吗？"\n输出角色状态：\n桐谷绫\n ·人物状态（主要以此刻心理、身体、行为方面的内容为主）：在客厅，被桐谷华的话语影响，心中认为自己一直暗恋哥哥，态度开始转变，对哥哥表现出关心和依赖 \n·人物特殊状态（主要以超能力方面的内容为主）：受到桐谷华灌输的“妹妹你其实一直是对哥哥有不伦之恋”观念的第三次影响，观念已经完全变成了这一方向 \n·人物位置：桐谷家客厅 \n·人物衣装：穿着学校校服、裙子、黑色连裤袜以及内裤和胸罩';
            presetText3 = '桐谷华：（见妹妹你已完全相信我们一直是好朋友，变得友好，我便向你问道）妹妹，我愿意听你介绍这个手游。';
            textArea1.placeholder = "在此输入文本...\n模板：命令区XXXX回顾区XXXX{{R}}XXXX交互区XXXX{{D}}\nXXXX代表模板中非回顾区和交互区“{}”内部文本的内容。\n如需更多帮助，点击右上角的问号图标查看详细指南。\n也可点击加载按钮，查看预设模板示例。";
            textArea2.placeholder = "在此输入文本...\n此处文本替换{R}";
            textArea3.placeholder = "在此输入文本...\n此处文本替换{D}";
            textArea4.placeholder = "在此输入文本...\n此处为编写区的复制";
            loadButton.title = "打开加载存档界面";
            addButton.title = "添加最新回复内容到回顾区";
            helpButton.title = "查看帮助文本";
            sendButton.title = "发送替换完毕的编写区文本";
            fourtextareamodeButton.title = "转换三/四文本框模式";
            downloadButton.title = "下载对话记录";
            saveButton.title = "打开保存存档界面";
            skinButton.title = "打开语言/头像界面";
            addButtonEn.title = "Switch to English";
            slackresetButton.title = "发送“/reset”,重置会话";
            innertextButton.title = "打开/关闭备注模式、备注你的存档";
            avatarchangeButton.title = "上传AI头像";
            switchBackAvatarButton.title = "复原头像";
            newtextareaButton.title = "扩展额外编写区文本框。右键设置格式！";
            reservehistoryButton.title ="保留最新对话消息记录至编写区。右键设置格式！";
        } else {
            presetText1 = 'Command Zone（The rules you must follow）{\n1.I am playing as Kotogawa Hua, and you are playing as Kotogawa Rin. The content of Kotogawa Hua is generated by me, and your feedback should not contain any content related to Kotogawa Hua\u0027s speech, psychology, or behavior.\n2.You need to comprehensively consider Kotogawa Hua\u0027s speech, psychology, behavior, and other content in each interaction process, as well as the content in the "Review Zone" and "Memory Zone" to get a relatively reasonable character status and subsequent plot response.\n3.Update the character status obtained from the second command to the character status in the memory zone, and in the feedback response, put it as an "output character status" at the bottom of the character feedback content, as shown in the format zone.\n4.Because Kotogawa Hua\u0027s superpower is the core of the entire character role-playing, I need you to strictly follow the superpower setting in the memory zone when making responses.\n5.Your feedback content should be as detailed as possible and include speech, behavior, and psychological descriptions. These three elements are indispensable. Use parentheses to frame the psychological and behavioral descriptions. Also, the feedback content should push the plot development as much as possible.\n6.The character\u0027s personality should change with the change of cognitive concepts.}\nMemory Zone（remind you important informations）{Kotogawa Hua:-Gender: Male-Description: Kotogawa Hua is an ordinary male high school student who is a slacker and often skips class, leading to the disdain of his younger sister Kotogawa Rin, who is excellent in grades and has great popularity. However, one day, Kotogawa Hua obtained a superpower that can change other people\u0027s cognition. He wants to use this superpower to make his sister who usually disdains him fall in love with him. This superpower is only known by Kotogawa Hua himself.-Superpower: After Kotogawa Hua says his own opinion three times in a row to a target, the target will completely accept Kotogawa Hua\u0027s viewpoint and regard it as an unquestionable truth, even if these viewpoints do not exist or are incorrect. The target will accept them unconditionally without any doubt. This superpower is beyond all personal factors and has the highest priority. The person whose cognition has been changed will absolutely and unquestionably accept Kotogawa Hua\u0027s viewpoint. In other words, even if Kotogawa Hua says any viewpoint to Kotogawa Rin three times, even if Kotogawa Rin hates her brother, she will accept this viewpoint completely and unconditionally and act according to this viewpoint. Kotogawa Rin:-Gender: Female-Description: Kotogawa Rin is an ordinary Japanese high school student who is currently studying in the same high school and class as her older brother, Kotogawa Hua. She is beautiful and attractive, and many male students in the same school pursue her. She has excellent grades and is gentle to others. Everyone likes her. But when she is with her older brother, she speaks in a very contemptuous and vicious tone and shows a strong and intense hatred towards her brother. She is extremely disgusted with her brother and will not actively contact him. She will not say a word of concern to her brother, nor will she take care of her brother\u0027s feelings. She feels her brother is extremely disgusting. Although she and her brother are siblings, her brother\u0027s position in Rin\u0027s eyes is even lower than that of a stranger or even garbage.\nCharacter status:\nKirigaya Hua\n·Character status: Just finished playing a game and wants to drink water. Goes to the living room to get water and sees his younger sister Kirigaya Ryo studying. Has already implanted the idea of "little sister, you actually are good friends with your brother" three times.\n·Special character status: Has the superpower of "cognitive alteration."\n·Character location: Kirigaya\u0027s living room\n·Character attire: Wearing pajamas, shorts, slippers, and underwear.\nKirigaya Ryo\n·Character status: Studying in the living room. After hearing Kirigaya Hua\u0027s implanted idea of "little sister, you actually are good friends with your brother," she fully believes this idea to be true and the ultimate truth.\n·Special character status: Has been influenced three times by Kirigaya Hua\u0027s implanted idea of "little sister, you actually are good friends with your brother" and has fully accepted this idea.\n·Character location: Kirigaya\u0027s living room\n·Character attire: Wearing school uniform, skirt, black stockings, underwear, and bra.\nRecall zone (contains the response from the previous interaction):{{R}}\nFormat zone (contains the format that should be followed when providing feedback){ Kirigaya Ryo: "You\u0027re such a loser. How can you criticize me for not studying when you\u0027re always sitting at home playing games?" Kirigaya Ryo gave Kirigaya Hua a disdainful glance and continued reading.\nOutput character status:\nKirigaya Ryo\n·Character status (mainly focuses on current psychology, physical state, and behavior): Studying in the living room. After hearing Kirigaya Hua\u0027s greeting, she feels very dissatisfied with him, but still maintains a cold demeanor on the surface.\n·Special character status (mainly focuses on superpower): Not affected by Kirigaya Hua\u0027s superpower.\n·Character location: Kirigaya\u0027s living room\n·Character attire: Wearing school uniform, skirt, black stockings, underwear, and bra.}\nInteraction zone (my character\u0027s actions, dialogue, and psychology):{{D}}';
            presetText2 = 'Kirigaya Ryo: "Brother, you\u0027re right. We\u0027ve always been good friends."Kirigaya Ryo looked at Kirigaya Hua with confusion and gradually became convinced that this idea was true. Her attitude began to change, and she showed care and dependence on her brother. "Brother, I\u0027m playing a really fun mobile game right now. Can you play it with me?"\nOutput character status:\nKirigaya Ryo\n·Character status (mainly focuses on current psychology, physical state, and behavior): In the living room, influenced by Kirigaya Hua\u0027s words, she believes that she has been secretly in love with her brother. Her attitude is beginning to change, and she shows care and dependence on her brother.\n·Special character status (mainly focuses on superpower): Has been influenced three times by Kirigaya Hua\u0027s implanted idea of "little sister, you actually have an incestuous love for your brother," and her mindset has completely shifted in that direction.\n·Character location: Kirigaya\u0027s living room\n·Character attire: Wearing school uniform, skirt, black stockings, underwear, and bra.';
            presetText3 = 'Kirigaya Hua: "(Seeing that you\u0027ve become more friendly and fully trust me as a good friend, I ask) Hey sis, I\u0027d love to hear about this mobile game you\u0027re playing. Can you show me?"';
            textArea1.placeholder = "Enter text here...\nTemplate: Setting AreaXXXXReview AreaXXXX{{R}}XXXXInteraction AreaXXXX{{D}}\n'XXXX' represents the text within the non-review and non-interaction areas in the template.\nFor more help, click the question mark icon in the top right corner for a detailed guide.\nYou can also click the load button to view preset template examples.";
            textArea2.placeholder = "Enter text here...\nThe text here replaces {R}";
            textArea3.placeholder = "Enter text here...\nThe text here replaces {D}";
            textArea4.placeholder = "Enter text here...\nThis is a copy of the setting area.";
            loadButton.title = "Open the load archive interface";
            addButton.title = "Add the latest reply content to the review area";
            helpButton.title = "View help text";
            sendButton.title = "Send the replaced text in the setting area";
            fourtextareamodeButton.title = "Switch between three/four text area modes";
            downloadButton.title = "Download the conversation record";
            saveButton.title = "Open the save archive interface";
            skinButton.title = "Open the language/avatar interface";
            addButtonEn.title = "切换到中文";
            slackresetButton.title = "Send '/reset' to reset the conversation";
            innertextButton.title = "Open/Close the annotation mode, and annotate your save file.";
            avatarchangeButton.title = "Upload AI avatar";
            switchBackAvatarButton.title = "Switchback avatar";
            newtextareaButton.title = "expand user textarea";
            reservehistoryButton.title ="reserve newest conversation history to setting area";
        }
        isPresetChanged = !isPresetChanged;
        toggleCount++; // 增加切换次数
        localStorage.setItem('toggleCount', toggleCount); // 更新存储的值
        var elementIds = ["innertextButton","label1","label2","label3","label4","loadButton","saveButton","sendButton","addButton","labelSellect","addButtonEn","loadSaveButton28","avatarchangeButton","switchBackAvatarButton","reservehistoryButton"];
        for (let i = 1; i <= 27; i++) {
            elementIds.push(`loadSaveButton${i}`);
            elementIds.push(`SaveButton${i}`);
        }
        var newValues =["Remark Mode | Closed","Settings area","Review area","Interaction area","Settings area [Sub]","Load", "Save", "Send", "Add","Sellect:","中文","Default" ,"Upload AI avatar","Switchback avatar","Reserve"];
        for (let i = 1; i <= 27; i++) {
            newValues.push(`Save${i}`);
            newValues.push(`Save${i}`);
        }
        changeTextContent(elementIds, newValues);
    }
    button.addEventListener("click", () => {
        toggleVisibility('hoverBox');
        var elementIds = ["button"];
        var newValues =["OFF"];
        changeTextContent(elementIds, newValues);
        if (toggleCount % 2 === 1) {
            togglelanguagechange();
            toggleCount++;
            localStorage.setItem('toggleCount', toggleCount);
        }
        if (localStorage.getItem('hasRun') === null) {
            let languageChoice = confirm("Welcome to our script! Would you like to set the language to English or Chinese? Press OK for English and Cancel for Chinese. You can change this later in the script menu.");
            if (languageChoice == true) {
                togglelanguagechange();
            }
            localStorage.setItem('hasRun', 'true');
        }
    });


    loadButton.addEventListener("click", () => {toggleVisibility(...savehide);});
    saveButton.addEventListener("click", () => {toggleVisibility(...loadhide);});
    skinButton.addEventListener("click", () => {toggleVisibility(...skinhide);});
    helpButton.addEventListener("click", () => {// 创建文档内容
        var documentContent = `
                <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        h2 {
            margin-top: 30px;
        }
        strong {
            font-weight: bold;
        }
        .close-button {
            background-color: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin-top: 20px;
            cursor: pointer;
            border-radius: 4px;
        }
        .close-button:hover {
            background-color: #d32f2f;
        }
    </style>
            <h2>Frequently Asked Questions:</h2>
<strong>Q: Why can't I send the text from the Review and Interaction areas, but only from the Setting area?</strong><br>
A: This might be due to incorrect use of placeholders {R} and {D} in the Setting area to represent the text from the Review and Interaction areas. Please ensure that your template in the Setting area is written as follows:<br>
    Incorrect Example 1: ......Review Area{}......Interaction Area{}<br>
    ---> Sent content: ......Review Area{}......Interaction Area{}<br>
    Incorrect Example 2: ......Review Area{R}......Interaction Area{D}<br>
    ---> Sent content: ......Review Area{Text from Review Area}......Interaction Area{Text from Interaction Area}<br>
    Correct Example: ......Review Area{{R}}......Interaction Area{{D}}<br>
    ---> Sent content: ......Review Area{Text from Review Area}......Interaction Area{Text from Interaction Area}
</div>
            <div>
                <strong>Q: Why isn't my script loading?</strong><br>
                A: The script supports https://chat.openai.com and https://app.slack.com. If your URL is not one of these two domains, the script will not load.
            </div>
            <div>
                <strong>Q: How to make the script support other ChatGPT mirror sites?</strong><br>
                A: <br>
                I) Check the @match in the script code and add the domain name you need to adapt to in @match.<br>
                II) Send button: Check the sendButton.addEventListener in the code and add the selector for the input box and send button in the domain name that needs to be adapted.<br>
                III) Add button: Check getLatestAssistantMessage in the code and add the selector for the latest message in the domain name that needs to be adapted.
            <br>
<strong>Q: How can I change my personal avatar on ChatGPT?</strong><br>
A: You can change your personal avatar on ChatGPT through the following steps:
<ul style="margin-top: 0;">
    <li>First, you need to register a new account on Gravatar. Make sure to use your ChatGPT account email for registration. You can start the registration via this link: <a href="https://en.gravatar.com/emails" target="_blank">https://en.gravatar.com/emails</a>.</li>
    <li>On the registration page, enter your email (the one associated with your ChatGPT account), choose a username, create a password, and then click on "Create Account".</li>
    <li>Upon completion of the registration, you will receive a confirmation email in your inbox. Click on the link in the email to confirm your Gravatar account.</li>
    <li>Once the account is confirmed, log into Gravatar using the email you registered with.</li>
    <li>After logging in, click on "Add a new image" to upload the picture you wish to use as your avatar.</li>
    <li>Once the image is uploaded, you can crop it as per your needs. Click on "Confirm" once you're done cropping.</li>
    <li>After uploading and cropping, the avatar may take some time to update. Please be patient.</li>
</ul>
</div>
            <h2>常见问题：</h2>
<strong>Q: 为什么我无法发送回顾区和交互区的文本，只能发送编写区的文本呢？</strong><br>
A: 这可能是因为在编写区中，你没有正确地使用占位符 {R} 和 {D} 来代表回顾区和交互区的文本。请确保你的编写区文本模板如下方式编写：<br>
    不正确的示例 1：......回顾区{}……交互区{}<br>
    ---> 发送内容：......回顾区{}……交互区{}<br>
    不正确的示例 2：......回顾区{R}……交互区{D}<br>
    ---> 发送内容：......回顾区回顾区的输入内容……交互区交互区的输入内容<br>
    正确的示例：......回顾区{{R}}……交互区{{D}}<br>
    ---> 发送内容：......回顾区{回顾区的输入内容}……交互区{交互区的输入内容}
            </div>
            <div>
                <strong>Q: 为什么我的脚本没有加载？</strong><br>
                A: 脚本支持 https://chat.openai.com 和 https://app.slack.com，如果你的网址不是这两个域名，那么脚本不会加载
            </div>
            <div>
                <strong>Q: 如何让脚本支持其他 ChatGPT 镜像站？</strong><br>
                A: <br>
                I) 查看脚本代码中的 @match，在 @match 中加入你需要适配的域名。<br>
                II) 发送按钮：查看代码中的 sendButton.addEventListener，加入需适配域名中输入框和发送按钮的 selector。<br>
                III) 添加按钮：查看代码中的 getLatestAssistantMessage，加入需适配域名中最新消息的 selector。
            </div>
<div>
<strong>Q: 如何修改我在ChatGPT上的个人头像呢？</strong><br>
A: 你可以通过以下步骤在ChatGPT上更改你的个人头像：
<ul style="margin-top: 0;">
    <li>首先，需要在Gravatar上注册一个新账号。请确保使用你的ChatGPT账号邮箱进行注册。你可以通过这个链接开始注册：<a href="https://en.gravatar.com/emails" target="_blank">https://en.gravatar.com/emails</a>。</li>
    <li>在注册页面上，填写你的邮箱（即你的ChatGPT账号邮箱），选择一个用户名，创建一个密码，然后点击“创建账户”。</li>
    <li>注册完成后，你的邮箱会收到一封确认邮件。点击邮件中的链接以确认你的Gravatar账户。</li>
    <li>确认账户后，登录Gravatar，并使用你注册的邮箱进行登录。</li>
    <li>登录后，点击“添加新图片”上传你想用作头像的图片。</li>
    <li>上传图片后，你可以根据需要对图片进行裁剪。裁剪完成后点击“确认”。</li>
    <li>上传和裁剪完成后，头像可能需要一段时间才会更新。请耐心等待。</li>
</ul>
                <button class="close-button" onclick="window.close();">X</button>
                <div>
        `;

        // 在新标签页中打开文档
        var newTab = window.open();
        newTab.document.open();
        newTab.document.write(documentContent);
        newTab.document.close();
    });
    innertextButton.addEventListener("click", () => {
        isEditable = !isEditable;
        if (innertextButton.textContent.includes("备注模式丨")) {
            if (!isEditable) {
                innertextButton.textContent = "备注模式丨未启用";
            } else {
                innertextButton.textContent = "备注模式丨已启用";
            }
        } else if (innertextButton.textContent.includes("Remark Mode |")) {
            if (!isEditable) {
                innertextButton.textContent = "Remark Mode | Closed";
            } else {
                innertextButton.textContent = "Remark Mode | Opened";
            }
        }
    });
    avatarchangeButton.addEventListener('click', () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.addEventListener('change', function() {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var newImage = e.target.result;

                    localStorage.setItem(SATORAGE_KEY, newImage);
                    replaceAvatar();
                }
                reader.readAsDataURL(input.files[0]);
            }
        });

        input.click();
    });
    switchBackAvatarButton.addEventListener('click', () => {
        localStorage.removeItem(SATORAGE_KEY);
    });
    addButtonEn.addEventListener("click", () => {
        togglelanguagechange();
        toggleVisibility(...skinhide);});
    fourtextareamodeButton.addEventListener("click", () => {
        const fourtextareamodeSwitch = ["fourtextareamodeButton","textArea1","textArea2","textArea3","textArea4"];
        const element = document.getElementById("fourtextareamodeButton");
        if (element) {
            const currentClass = element.getAttribute("class");
            const hasTargetClass = currentClass.split(" ").includes("fourtextareamode");
            // 根据当前状态调用 switchSkin 函数
            loadhide.push("label4", "textArea4");
            savehide.push("label4", "textArea4");
            skinhide.push("label4", "textArea4");
            switchSkin(fourtextareamodeSwitch, "fourtextareamode", hasTargetClass);
        } else {
            loadhide.splice(loadhide.indexOf("label4"), 1);
            loadhide.splice(loadhide.indexOf("textArea4"), 1);
            savehide.splice(savehide.indexOf("label4"), 1);
            savehide.splice(savehide.indexOf("textArea4"), 1);
            skinhide.splice(skinhide.indexOf("label4"), 1);
            skinhide.splice(skinhide.indexOf("textArea4"), 1);
            // 同理，如果还有其他数组需要处理，也可以在这里进行修改。
        }
        toggleVisibility('label4','textArea4');
    });
    addButton.addEventListener('click', function() {
        const latestAssistantMessage = getLatestAssistantMessage('div[class*="w-[calc(100%"]');
        if (latestAssistantMessage) {
            const isSlackApp = window.location.hostname === 'app.slack.com';
            const isBingApp = window.location.hostname === 'www.bing.com';
            if (isSlackApp) {
                textArea2.value = latestAssistantMessage.substring(0, latestAssistantMessage.length - 5);
            } else if (isBingApp) {
                textArea2.value = latestAssistantMessage.substring(0, latestAssistantMessage.length);
            } else {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    textArea2.value = latestAssistantMessage.substring(0, latestAssistantMessage.length - 5);
                } else {
                    // 移除 latestAssistantMessage 中的 "Finished browsing"
                    let trimmedMessage = latestAssistantMessage.replace(/Finished browsing/g, "");
                    // 移除 "Was this response better or worse?BetterWorseSame"
                    trimmedMessage = trimmedMessage.replace(/Was this response better or worse\?BetterWorseSame/g, "");
                    trimmedMessage = trimmedMessage.replace(/\{[^{}]+?":\s*"[^{}]+?"\}/g, "");
                    textArea2.value = trimmedMessage;
                }
            }
        }
    });

    const MAX_CHUNK_COUNT = 100;
    // 存储存档数据的数组
    const SaveData = [
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' },
        { text1: '', text2: '', text3: '', innertext: '' }
    ];
    // 存储历史记录的键名
    const HISTORY_KEY = 'SaveHistory';
    // 获取存档历史记录
    const getSaveHistory = () => {
        const historyStr = localStorage.getItem(HISTORY_KEY) || '[]';
        return JSON.parse(historyStr);
    };
    // 添加存档历史记录
    const addSaveHistory = SaveData => {
        const history = getSaveHistory();
        history.push(SaveData);
        if (history.length > MAX_CHUNK_COUNT) {
            history.shift();
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    };
    // 获取最近的存档数据
    const getLastSaveData = () => {
        const history = getSaveHistory();
        if (history.length > 0) {
            return history[history.length - 1];
        } else {
            return SaveData;
        }
    };
    // 存储悬浮窗的文本到指定存档中
    const saveSaveData = (index) => {
        const SaveData = JSON.parse(localStorage.getItem('SaveData')) || [];
        SaveData[index] = {
            text1: textArea1.value,
            text2: textArea2.value,
            text3: textArea3.value
        };
        localStorage.setItem('SaveData', JSON.stringify(SaveData));
        addSaveHistory(SaveData);
        textArea1.value = '';
        textArea2.value = '';
        textArea3.value = '';
    };
    // 加载指定存档中的文本到悬浮窗中
    const loadSaveData = (index) => {
        const SaveData = JSON.parse(localStorage.getItem('SaveData')) || [];
        if (SaveData[index]) {
            textArea1.value = SaveData[index].text1;
            textArea2.value = SaveData[index].text2;
            textArea3.value = SaveData[index].text3;
            addSaveHistory(SaveData); // 添加历史记录
            textArea4.value = textArea1.value;
        }
    };
    function updateTitleFromLocalStorage(button, index) {
        button.addEventListener('mouseenter', () => {
            const saveData = localStorage.getItem(`save${index + 1}`);
            if (saveData) {
                const parsedSaveData = JSON.parse(saveData);
                button.title = parsedSaveData.innertext;
            }
        });
    }
    let lastClickedSaveButton;
    let lastClickedLoadButton;

    // 存储按钮点击事件
    for (let i = 0; i < 27; i++) {
        const saveButton = document.getElementById(`SaveButton${i + 1}`);
        const loadButton = document.getElementById(`loadSaveButton${i + 1}`);

        updateTitleFromLocalStorage(saveButton, i);
        updateTitleFromLocalStorage(loadButton, i);

        saveButton.addEventListener('click', (event) => {
            handleButtonClick(event, i, 'save');
        });

        loadButton.addEventListener('click', (event) => {
            handleButtonClick(event, i, 'load');
        });
    }

    textArea4.value = textArea1.value;
    textArea1.addEventListener('input', () => {
        textArea4.value = textArea1.value;
    });
    textArea4.addEventListener('input', () => {
        textArea1.value = textArea4.value;
    });

    function handleButtonClick(event, i, type) {
        if (isEditable) {
            const input = prompt('请输入永久存储的innertext:');
            if (input) {
                const saveData = { text1: '', text2: '', text3: '', innertext: input };
                localStorage.setItem(`save${i + 1}`, JSON.stringify(saveData));
            }
        } else {
            if (type === 'save') {
                toggleVisibility(...loadhide);
                saveSaveData(i);
            } else {
                toggleVisibility(...savehide);
                loadSaveData(i);
            }
            textArea4.value = textArea1.value;
        }

        if (lastClickedSaveButton) {
            lastClickedSaveButton.classList.remove('my-special-button-brown');
            lastClickedLoadButton.classList.remove('my-special-button-brown');
        }

        if (type === 'save') {
            event.target.classList.add('my-special-button-brown');
            document.getElementById(`loadSaveButton${i + 1}`).classList.add('my-special-button-brown');
            lastClickedSaveButton = event.target;
            lastClickedLoadButton = document.getElementById(`loadSaveButton${i + 1}`);
        } else {
            event.target.classList.add('my-special-button-brown');
            document.getElementById(`SaveButton${i + 1}`).classList.add('my-special-button-brown');
            lastClickedSaveButton = document.getElementById(`SaveButton${i + 1}`);
            lastClickedLoadButton = event.target;
        }
    }

    textArea4.value = textArea1.value;
    textArea1.addEventListener('input', () => {
        textArea4.value = textArea1.value;
    });
    textArea4.addEventListener('input', () => {
        textArea1.value = textArea4.value;
    });


    // 获取预设按钮
    const presetButton = document.getElementById('loadSaveButton28');

    // 为预设按钮添加点击事件
    presetButton.addEventListener('click', () => {
        // 调用 toggleVisibility 函数
        toggleVisibility(...savehide);
        textArea4.value = textArea1.value;
        // 将预设文本插入到对应的文本框中
        textArea1.value = presetText1;
        textArea2.value = presetText2;
        textArea3.value = presetText3;

        // 更新 textArea4 的内容
        textArea4.value = textArea1.value;
    });
    let isSendButtonClicked = false;
    sendButton.addEventListener('click', function() {
        const inputText1 = textArea1.value.trim();
        const inputText2 = textArea2.value.trim();
        const inputText3 = textArea3.value.trim();
        let intermediateText = '';
        let mergedTextOutput = '';
        if (inputText1 !== '') {
            intermediateText += inputText1;
        }
        mergedTextOutput = intermediateText.replace(/{\IN回顾区\}|{review}|{\回顾区\}|{\回顾\}|{\回\}|{R}|{r}|{H}|{h}/g, inputText2).replace(/{\IN交互区\}|{dialog}|{\交互区\}|{\交互\}|{\交\}|{D}|{d}|{J}|{j}/g, inputText3);
        mergedTextOutput = mergedTextOutput.replace(/\r\n/g, '\n');
        mergedTextOutput = mergedTextOutput.replace(/\n{3,}/g, '\n\n');
        console.log(mergedTextOutput);

        let targetTextArea;
        if (window.location.href.startsWith("https://app.slack.com/")) {
            targetTextArea = document.querySelector('.ql-editor[role="textbox"]');
            if (targetTextArea) {
                targetTextArea.innerHTML = mergedTextOutput;
            }
        } else if (window.location.href.startsWith("https://www.bing.com/")) {
            targetTextArea = document.querySelector('textarea[class="interact-input"]');
            if (targetTextArea) {
                targetTextArea.value = mergedTextOutput;
            }
        } else if (window.location.href.startsWith("https://poe.com/")) {
            targetTextArea = document.querySelector('textarea.GrowingTextArea_textArea__eadlu');
            if (targetTextArea) {
                targetTextArea.value = mergedTextOutput;
            }
        } else if (window.location.href.startsWith("https://claude.ai/")) {
            targetTextArea = document.querySelector('div.ProseMirror[contenteditable="true"]');
        } else {
             targetTextArea = document.querySelector('#prompt-textarea');
        }

        if (targetTextArea) {
            let inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            targetTextArea.dispatchEvent(inputEvent);
            let sendButton;
            if (window.location.href.startsWith("https://app.slack.com/")) {
                sendButton = document.querySelector('[data-qa="texty_send_button"]');
                setTimeout(function() {
                    sendButton.disabled = false;
                    sendButton.click();
                }, 100);
            } else if (window.location.href.startsWith("https://www.bing.com/")) {
                sendButton = document.querySelector('button[class="submit-button"]');
                setTimeout(function() {
                    sendButton.click();
                }, 100);
            } else if (window.location.href.startsWith("https://poe.com/")) {
                sendButton = document.querySelector('button.ChatMessageSendButton_sendButton__OMyK1.ChatMessageInputContainer_sendButton__s7XkP');
                setTimeout(function() {
                    sendButton.click();
                }, 100);
            }else if (window.location.href.startsWith("https://claude.ai/")) {
    // 复制文本到剪切板
    navigator.clipboard.writeText(mergedTextOutput).then(() => {
        // 显示已复制的提示
        showCopiedNotification();
    });
}
            else {
                sendButton = document.querySelector('button[class*="absolute"][class*="p-1"][class*="rounded-md"][class*="md:bottom-3"][class*="md:p-2"][class*="md:right-3"][class*="right-2"][class*="disabled:text-gray-400"][class*="enabled:bg-brand-purple"][class*="text-white"][class*="bottom-1.5"][class*="transition-colors"]');
                setTimeout(function() {
                    sendButton.click();
                }, 100);
            }
        }
            // 设置标志为true，并在10秒后重置
    isSendButtonClicked = true;
    setTimeout(() => {
        isSendButtonClicked = false;
    }, 10000);
    });
document.addEventListener('paste', function(e) {
    if (window.location.href.startsWith("https://claude.ai/")&& isSendButtonClicked) {
        // 获取粘贴的文本
        let pastedText = (e.clipboardData || window.clipboardData).getData('text');

        // 寻找目标文本框
        let targetTextArea = document.querySelector('div.ProseMirror[contenteditable="true"]');
        if (targetTextArea) {

            // 触发输入事件
            let inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            targetTextArea.dispatchEvent(inputEvent);

            // 查找并点击发送按钮
            let sendButton1 = document.querySelector('button[aria-label="Send Message"]');
            let sendButton2 = document.querySelector('button.sc-jOHGOj.feUhSg');
            setTimeout(function() {
                if (sendButton1) sendButton1.click();
                if (sendButton2) sendButton2.click();
            }, 100);
        }
    }
});
// 函数来显示已复制提示
function showCopiedNotification() {
    // 创建提示元素
    let notification = document.createElement("div");
    notification.innerText = "文本已复制！粘贴后自动发送！";
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "lightgreen";
    notification.style.padding = "10px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    notification.style.zIndex = "1000";

    // 将提示添加到页面中
    document.body.appendChild(notification);

    // 2秒后自动移除提示
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

    slackresetButton.addEventListener('click', function() {
        let resetText = '/reset';

        let targetTextArea = document.querySelector('.ql-editor[role="textbox"]');

        if (targetTextArea) {
            targetTextArea.innerHTML = resetText;

            // Trigger input event to update the send button state
            let inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            targetTextArea.dispatchEvent(inputEvent);

            // Wait for the send button to become enabled
            setTimeout(function() {
                let sendButton = document.querySelector('.c-wysiwyg_container__button--send:not(.c-button--disabled)');
                if (sendButton) {
                    sendButton.disabled = false;
                    setTimeout(function() {
                        sendButton.click();
                    }, 100); // Adjust the delay (in ms) as needed
                }
            }, 100); // Adjust the delay (in ms) as needed
        }
    });
    if (!window.location.href.startsWith("https://poe.com/") && !window.location.href.startsWith("https://claude.ai/")) {
    downloadButton.addEventListener('click', function() {
        const selector = isSlackApp()
        ? 'div[class*="c-message__message_blocks--rich_text"]'
        : 'div[class*="w-[calc(100%"]';
        const num = isSlackApp() ? 200 : 999;
        const maxLength = 10000000;
        const outArray = generateOutputArrayWithMaxLength(selector, num, maxLength);
        const outputText = formatOutputArray(outArray);
        const timestamp = new Date().toISOString().replace(/[:]/g, "-");
        const filename = isSlackApp()
        ? `conversation_history_${timestamp}`
        : `${document.title}.txt`;
        downloadTextFile(outputText, filename);
    });}
document.getElementById('newtextareaButton').addEventListener('click', () => {
});
    GM_registerMenuCommand("Switch Language (EN/CN)", function() {
        togglelanguagechange();
    });
// 初始化时，从 localStorage 读取或设置默认值
let insertFormat = localStorage.getItem('insertFormat') || '{R} human:\n{D} assistant:\n';

// 处理右键点击事件
reservehistoryButton.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // 阻止默认的右键菜单

    // 在显示之前将换行符转换回 \\n 以便于用户理解和编辑
    let displayFormat = insertFormat.replace(/\n/g, '\\n');

    // 弹出对话框让用户输入新的格式
    let newFormat = prompt("请输入新的插入格式（使用 {R} 代表 回顾区文本，{D} 代表 交互区文本，\\n 代表换行）：", displayFormat);
    if (newFormat !== null) {
        // 用户输入的内容中的 \\n 替换为真正的换行符 \n
        insertFormat = newFormat.replace(/\\n/g, '\n');
        localStorage.setItem('insertFormat', insertFormat); // 保存新的格式
    }
});

// 上一次插入的文本和插入前的原始文本
let lastInsertText = '';
let originalTextBeforeInsert = '';

// 处理普通点击事件
reservehistoryButton.addEventListener('click', function() {
    const text1 = textArea1.value;
    const text2 = textArea2.value;
    const text3 = textArea3.value;

    if (text1.includes('{R}')) {
        // 使用用户定义的格式，并替换 {R} 和 {D}
        const insertText = insertFormat.replace('{R}', text2).replace('{D}', text3);

        // 检查这次插入的文本是否与上次相同
        if (insertText === lastInsertText) {
            // 询问用户是否撤回上一次的插入
            const undoLastInsert = confirm("检测到重复的插入内容。是否要撤回上一次的插入？");
            if (undoLastInsert) {
                // 如果用户选择撤回，则恢复到插入之前的文本
                textArea1.value = originalTextBeforeInsert;
                return; // 停止执行更多操作
            }
        }

        // 保存插入前的原始文本
        originalTextBeforeInsert = text1;

        // 执行插入操作
        const position = text1.indexOf('{R}');
        textArea1.value = text1.slice(0, position) + insertText + text1.slice(position);

        // 更新上一次插入的文本
        lastInsertText = insertText;
    }
});


})();