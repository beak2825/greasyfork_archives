// ==UserScript==
// @name         JijaTrading
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @require     https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js
// @description  multi live search for poe trade site
// @author       paaadj
// @match        https://www.pathofexile.com/trade/search/*/*
// @match        https://www.pathofexile.com/trade/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471854/JijaTrading.user.js
// @updateURL https://update.greasyfork.org/scripts/471854/JijaTrading.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function getStyles() {
        var styles = `
    /* Стили для панели */
    #panel {
      position: fixed;
      top: 0;
      right: -400px; /* Панель начинается за пределами экрана */
      width: 400px; /* Изменяем ширину панели на 500px */
      height: 100%;
      background-color: rgba(10, 10, 10, 0.8);
      padding: 20px;
      transition: right 0.3s; /* Анимация при сдвиге влево */
      z-index: 1000;
      overflow-y: auto;
      font-family: "FontinSmallcaps",sans-serif;
      color: rgb(255, 255, 255);
    }
    #panel::-webkit-scrollbar {
      width: 0;
    }

    /* Стили для кнопки открытия панели */
    #openPanelBtn {
      position: fixed;
      top: 50%;
      right: 0;
      background-color: rgba(29, 29, 29);
      padding: 10px;
      cursor: pointer;
      font-family: "FontinSmallcaps",sans-serif;
      color: rgb(255, 255, 255);
      border: 1px solid rgb(76, 76, 125);
      display: inline-flex;
      align-items: center;
    }

    /* Стили для кнопки закрытия панели */
    #closePanelBtn {
      position: absolute;
      top: 15px;
      width: 25px;
      height: 25px;
      background-color: #f44336;
      color: #fff;
      cursor: pointer;
      font-size: 20px;
    }

    /* Стили для подстраиваемого содержимого */
    .body {
      transition: margin-right 0.3s; /* Анимация при смещении содержимого */
    }

    /* Стили для подстраиваемого содержимого при открытой панели */
    .body.panel-open {
      margin-right: 500px; /* Смещаем содержимое влево при открытой панели */
    }

    /* Стили для выбора профиля */
    #profileSelect {
      width: 100%;
      margin-bottom: 10px;
      width: 100%; /* Ширина селектора на 100% */
      font-size: 18px;
      padding: 8px;
      border: 1px solid #000;
      border-radius: 0;
      background: #1e2124;
      transition: width 0.3s ease, height 0.3s ease;
      outline: none;
    }
    .modalBackground {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Полупрозрачный фон */
  z-index: 10000; /* Поместите modalBackground ниже модального окна, чтобы обработчик событий не блокировал кнопки внутри модального окна */
}
    /* Стили для модального окна */
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      z-index: 1001;
      font-family: "FontinSmallcaps",sans-serif;
      background-color: rgba(20, 20, 20, 0.8);
    }
    .modal input {
      display: block;
      margin-bottom: 10px;
      width: 100%;
      padding: 8px;
      font-size: 14px;
      background-color: rgb(30, 33, 36);
      outline: none;
      border: none;

    }
    .modal button {
      margin-right: 10px;
    }
    .trashBtn {
      background-color: transparent;
      border: none;
    }
    #deleteDiv {
      position: absolute;
      right: 0;
      top: 7px;
    }
    .listItem {
      overflow-y: visible;
      border-bottom: 1px solid rgba(76, 76, 125, 0.4);
      position: relative;
    }
    .listItem a{
      color: white !important;
    }

    .profileDataContainer {
      //padding-right: 5px;
      max-height: 300px;
      border: 1px solid rgb(76, 76, 125);
      //padding: 8px;
    }
    .profileDataContainer h2 {
      color: white !important;
      padding: 8px;
      background-color: rgb(15, 48, 77);
      border-color: rgb(76, 76, 125)
    }
    /* Стили для скроллбара */
    .profileDataContainer::-webkit-scrollbar {
      width: 3px; /* Ширина скроллбара */
      background-color: #f0f0f0; /* Цвет фона скроллбара */
    }

    /* Стили для трека скроллбара (фоновой части) */
    .profileDataContainer::-webkit-scrollbar-track {
      border-radius: 3px; /* Радиус скругления углов трека */
    }

    /* Стили для ползунка скроллбара */
    .profileDataContainer::-webkit-scrollbar-thumb {
      background-color: #1c1c1c; /* Цвет ползунка скроллбара */
      border-radius: 5px; /* Радиус скругления углов ползунка */
    }

    .profileDataContainer h2 {
      position: sticky;
      top: 0;
      z-index: 10001;
    }

    #addLinkButton {
      margin-top: 10px;
    }
    #addSetButton {
      margin-top: 10px;
    }

    #profileSelect option.active {
      background-color: yellow;
    }
    .liDiv {
      position: relative;
    }

    .liDiv a{
      position: absolute;
      top: 7px;
      left: 8px;
    }

    .JijaTrading {
      top: 0;
      position: absolute;
      height: 50px;
      width: 100%;
    }

    .jijaTitle {
      position: absolute;
      top: 0;
      left: 100px; /* Задаем отступ слева для логотипа */
      height: 50px; /* Задаем высоту для логотипа */
      line-height: 50px; /* Задаем высоту строки для вертикального центрирования текста */
      font-size: 24px; /* Задаем размер шрифта для логотипа */
      color: #fff; /* Задаем цвет текста логотипа */
    }

    #jijaDiv {
      position: relative;
    }

    #jijaContent {
      position: absolute;
      top: 50px;
      width: 365px;
    }

    .jija-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .jijaBtn {
      display: inline-block;
      padding: 8px 16px;
      background-color: #1c1c1c;
      color: #d4d4d4;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
      width: 30%;
    }

    .jijaModalBtn {
      display: inline-block;
      padding: 8px 16px;
      background-color: #1c1c1c;
      color: #d4d4d4;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }

    .jijaModalBtn:hover {
       background-color: #2c2c2c;
      color: #f0f0f0;
    }

    .jijaModalBtn:active {
      background-color: #0c0c0c;
      color: #f0f0f0;
    }

    #deleteSetButton {
    margin-top: 10px;
}

    .jijaStart {
      display: inline-block;
      padding: 8px 16px;
      background-color: #0f304d;
      border-color: #4c4c7d;
      color: #d4d4d4;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
      margin-right: 8px;
      width: 100%;
    }
    .jijaStart:disabled {
      background-color: #808080;
      color: #999;
      cursor: not-allowed;
    }

    .jijaStart:not(:disabled):hover {
      background-color: #133d62;
      border-color: #4c4c7d;
      color: #f0f0f0;
    }

    .jijaStart:active {
      background-color: #0f304d;
      border-color: #4c4c7d;
      color: #f0f0f0;
    }

    .jijaBtn:hover {
       background-color: #2c2c2c;
      color: #f0f0f0;
    }

    .jijaBtn:active {
      background-color: #0c0c0c;
      color: #f0f0f0;
    }

    #startLiveSearchButton {
      margin-top: 10px;
    }

    #imgBottom {
      position: absolute;
      bottom: 30px;
      right: 100px;
    }
`
    return styles;
    }

    const websockets = [];

    let live = false;

    // При загрузке скрипта, получаем данные из хранилища и преобразуем обратно в Map
    const storedProfilesData = GM_getValue('profilesMap', null);

    let profilesMap = new Map

    if (storedProfilesData){
        // Преобразуем массив обратно в Map
        profilesMap = new Map(JSON.parse(storedProfilesData));
    }

    //текущий выбранный профиль
    let currentProfile = GM_getValue('currentProfile', null);

    let isAddItemModalOpen = false
    const profileSelect = document.createElement("select");


    function createLiveSearch(link) {

        let e = app.$el.children[6].__vue__;
        let t = e.current.localId;
        let liveconnection = new WebSocket(link);
        liveconnection.onmessage = function (n) {
            console.log(n);
            var i = JSON.parse(n.data);
            if (i.auth){
                e.$store.commit("setLiveSearchStatus", "searching");
                websockets.push(liveconnection);
            }
            else if (i.new) {
                i = i.new;
                var r = _.uniqueId("result_");
                return e.$store.commit("addSearchResult", {
                    localId: t,
                    resultId: r,
                    id: e.current.id,
                    result: i,
                    total: i.length
                }),
                    e.$root.notify(i.length),
                    void e.$store.commit("incrementActiveUnreadHits")
            }
        }
        liveconnection.onerror = function(t) {
            e.$root.$refs.toastr.Add({
                title: e.translate("Live Search error"),
                msg: e.translate("An error occurred while connecting"),
                type: "error",
                progressbar: !0,
                timeout: 5e3
            })
        }
    }

    function liveSearch() {
        if (live) {
            websockets.forEach(ws => {
                ws.close();
            })
            websockets.length = 0;
            live = false;
            const startBtn = document.querySelector('#startLiveSearchButton');
            startBtn.innerHTML = "Start Live Search";
        }
        else {
            let resultset = document.querySelectorAll('.resultset');
            if (resultset){
                resultset.forEach(rs => {rs.innerHTML = ""});
            }
            else{
                alert("Click the search button");
            }
            if(currentProfile){
                this.disabled = true;
                profilesMap.get(currentProfile).forEach((data, profileName) => {
                    let link = "wss://www.pathofexile.com/api/trade/live/Ancestor/" + data.link;
                    createLiveSearch(link);
                });
                live = true;
                const startBtn = document.querySelector('#startLiveSearchButton');
                startBtn.innerHTML = "Stop Live Search";
            }
            setTimeout(() => {
                this.disabled = false;
            }, 3000);
        }
    }

    function addSidePanel() {
        // Функция для открытия панели
        function openPanel() {
            panel.style.right = "0"; // Открываем панель (сдвигаем влево)
            openPanelBtn.style.display = "none"; // Прячем кнопку "Открыть панель"
            document.body.classList.add("panel-open"); // Добавляем класс для подстраиваемого содержимого
        }

        // Функция для закрытия панели
        function closePanel() {
            panel.style.right = "-500px"; // Закрываем панель (сдвигаем за пределы экрана)
            openPanelBtn.style.display = "inline-flex"; // Показываем кнопку "Открыть панель"
            document.body.classList.remove("panel-open"); // Удаляем класс для подстраиваемого содержимого
        }

        function isValidLink(link) {
            const baseUrl = "https://www.pathofexile.com/trade/";
            if (link.startsWith(baseUrl)) {
                const parts = link.split("/");
                // Проверяем, что ссылка содержит хотя бы 6 элементов
                if (parts.length >= 7) {
                    return true;
                }
            }
            return false;
        }

        function isItemAlreadyAdded(link) {
            const currentProfileData = profilesMap.get(currentProfile);

            if (currentProfileData) {
                return currentProfileData.some((item) => item.link === link);
            }

            return false;
        }

        // Функция для отображения модального окна
        function showModalLink() {
            if(!isAddItemModalOpen && currentProfile){
                // Создаем элемент <div> для модального окна
                const modal = document.createElement("div");
                modal.className = "modal";

                // Создаем элемент <input> для ввода названия
                const nameInput = document.createElement("input");
                nameInput.type = "text";
                nameInput.maxLength = 35;
                nameInput.placeholder = "Item Title";

                // Создаем кнопку для подтверждения добавления
                const addButton = document.createElement("button");
                addButton.innerText = "Add new item";
                addButton.addEventListener("click", () => {
                    const profileName = profileSelect.value;
                    const profileData = profilesMap.get(profileName);
                    if (profileName.length <= 35) {
                        if (profileData) {
                            const name = nameInput.value.trim();
                            let link = location.href;
                            if (name && isValidLink(link)) {
                                const parts = link.split('/');
                                link = parts[parts.length - 1];
                                if (isItemAlreadyAdded(link)){
                                    alert('Item already added to this profile');
                                    return;
                                }
                                profileData.push({ name, link });
                                displaySelectedProfileData();
                                closeModal();
                            }
                            else{
                                alert("Incorrect link");
                            }
                        }
                    }
                    else {
                        alert("Title length should not exceed 35 characters.");
                    }
                });

                // Создаем кнопку для закрытия модального окна
                const closeButton = document.createElement("button");
                closeButton.innerText = "Close";
                closeButton.classList.add('jijaModalBtn')
                addButton.classList.add('jijaModalBtn')
                closeButton.addEventListener("click", closeModal);

                // Добавляем элементы в модальное окно
                modal.appendChild(nameInput);
                modal.appendChild(addButton);
                modal.appendChild(closeButton);

                const modalBack = document.createElement('div');
                modalBack.classList.add('modalBackground');

                modalBack.appendChild(modal);
                // Добавляем модальное окно на страницу
                document.body.appendChild(modalBack);
                isAddItemModalOpen = true;
            }
        }
        // Функция для отображения модального окна
        function showModalSet() {
            if (!isAddItemModalOpen) {
                // Создаем элемент <div> для модального окна
                const modal = document.createElement("div");
                modal.className = "modal";

                // Создаем элемент <input> для ввода названия
                const nameInput = document.createElement("input");
                nameInput.type = "text";
                nameInput.maxLength = 35;
                nameInput.placeholder = "Set Title";

                // Создаем кнопку для подтверждения добавления
                const addButton = document.createElement("button");
                addButton.innerText = "Add new set";
                addButton.addEventListener("click", () => {
                    const name = nameInput.value.trim();
                    if (name.length <= 35){
                        // Проверяем, что имя не пустое и такого сета еще нет
                        if (name && !profilesMap.has(name)) {
                            const newEmptyProfileData = [];
                            profilesMap.set(name, newEmptyProfileData);
                            displaySelectedProfileData();
                            profileSelect.value = name;
                            displaySelectedProfileData();
                            closeModal(); // Закрываем модальное окно после добавления
                        } else {
                            alert("Incorrect title of set or set with similar title already exists");
                        }
                    }
                    else {
                        alert("Title length should not exceed 35 characters.");
                    }
                });

                // Создаем кнопку для закрытия модального окна
                const closeButton = document.createElement("button");
                closeButton.innerText = "Close";
                closeButton.addEventListener("click", closeModal);

                // Добавляем элементы в модальное окно
                modal.appendChild(nameInput);
                modal.appendChild(addButton);
                modal.appendChild(closeButton);

                addButton.classList.add('jijaModalBtn');
                closeButton.classList.add('jijaModalBtn');

                const modalBack = document.createElement('div');
                modalBack.classList.add('modalBackground');
                modalBack.appendChild(modal);
                // Добавляем модальное окно на страницу
                document.body.appendChild(modalBack);
                isAddItemModalOpen = true;
            }
        }
        // Функция для закрытия модального окна
        function closeModal() {
            const modal = document.querySelector(".modalBackground");
            if (modal) {
                modal.remove();
            }
            isAddItemModalOpen = false;
        }

        // Создаем панель
        const panel = document.createElement("div");
        panel.id = "panel";
        document.body.appendChild(panel);

        // Создаем кнопку открытия панели
        const openPanelBtn = document.createElement("div");
        openPanelBtn.id = "openPanelBtn";
        openPanelBtn.addEventListener("click", openPanel);
        document.body.appendChild(openPanelBtn);

        // Создаем кнопку закрытия панели
        const closePanelBtn = document.createElement("div");
        closePanelBtn.id = "closePanelBtn";
        closePanelBtn.addEventListener("click", closePanel);
        document.body.classList.add("body");

        profileSelect.id = "profileSelect";

        // Заполняем <select> опциями на основе ключей в Map
        profilesMap.forEach((data, profileName) => {
            const option = document.createElement("option");
            option.value = profileName;
            option.innerText = profileName;
            profileSelect.appendChild(option);
        });

        // Создаем элемент <div> для отображения данных выбранного профиля
        const profileDataContainer = document.createElement("div");
        profileDataContainer.classList.add("profileDataContainer");

        // Функция для сохранения данных в хранилище Tampermonkey
        function saveToStorage() {
            const JSONset = JSON.stringify(Array.from(profilesMap.entries()))
            GM_setValue('profilesMap', JSONset);
            GM_setValue('currentProfile', currentProfile);
        }

        // Функция для отображения данных выбранного профиля
        function displaySelectedProfileData() {
            currentProfile = profileSelect.value;
            // Очищаем содержимое контейнера перед обновлением данных
            profileDataContainer.innerHTML = '';

            profileSelect.innerHTML = '';
            profilesMap.forEach((data, profileName) => {
                const option = document.createElement("option");
                option.value = profileName;
                option.innerText = profileName;
                profileSelect.appendChild(option);
            });
            profileSelect.value = currentProfile;

            // Если Map не содержит данные для выбранного профиля, выводим сообщение
            if (!currentProfile) {
                const message = document.createElement('p');
                message.innerText = "No profiles available ";
                profileDataContainer.appendChild(message);
            } else {
                const profileHeader = document.createElement('h2');
                profileHeader.innerText = `Profile: ${currentProfile}`;
                const selectedProfileData = profilesMap.get(currentProfile);
                const itemsList = document.createElement('ul');
                if (selectedProfileData.length == 0){
                    const listItem = document.createElement('li');
                    listItem.classList.add("listItem");
                    listItem.innerHTML = "There is no items";
                    itemsList.appendChild(listItem);
                }
                selectedProfileData.forEach((item) => {
                    const listItem = document.createElement('li');
                    listItem.classList.add("listItem");
                    const itemLink = document.createElement('a');
                    itemLink.href = "https://www.pathofexile.com/trade/search/Ancestor/" + item.link;
                    itemLink.innerText = item.name;
                    const deleteButton = document.createElement('button');
                    deleteButton.innerText = '🗑️';
                    deleteButton.addEventListener('click', () => {
                        // При клике на кнопку "Удалить" удаляем ссылку из профиля
                        const index = selectedProfileData.findIndex((el) => el.link === item.link);
                        if (index !== -1) {
                            selectedProfileData.splice(index, 1);
                            // После удаления обновляем данные в хранилище
                            saveToStorage();
                            // Перерисовываем список ссылок
                            displaySelectedProfileData();
                        }
                    });
                    deleteButton.classList = ("trashBtn");
                    const deleteDiv = document.createElement('div');
                    deleteDiv.id = "deleteDiv";

                    const liDiv = document.createElement('div');
                    liDiv.classList.add("liDiv");
                    liDiv.style.height = "30px";
                    liDiv.appendChild(itemLink);
                    deleteDiv.appendChild(deleteButton);
                    liDiv.appendChild(deleteDiv);
                    listItem.appendChild(liDiv);
                    itemsList.appendChild(listItem);
                });

                profileDataContainer.appendChild(profileHeader);
                profileDataContainer.appendChild(itemsList);
                if (profileDataContainer.scrollHeight > 300) {
                    profileDataContainer.style.overflowY = "scroll";;
                } else {
                    profileDataContainer.style.overflowY = "visible";
                }
            }
            saveToStorage();
        }

        function deleteSet() {
            const options = profileSelect.options;
            let firstProfileOption = null;
            if (options[0].value !== currentProfile) {
                firstProfileOption = options[0].value;
            } else if (options.length > 1) {
                firstProfileOption = options[1].value;
            }
            profilesMap.delete(currentProfile);
            profileSelect.value = firstProfileOption;
            displaySelectedProfileData();
        }

        // Добавляем обработчик события на изменение выбранного профиля
        profileSelect.addEventListener("change", displaySelectedProfileData);

        const addLinkButton = document.createElement('button');
        addLinkButton.id = "addLinkButton";
        addLinkButton.innerHTML = "Add item";
        addLinkButton.addEventListener("click", showModalLink);

        const addSetButton = document.createElement('button');
        addSetButton.id = "addSetButton";
        addSetButton.innerHTML = "Add set";
        addSetButton.addEventListener("click", showModalSet);

        const deleteSetButton = document.createElement('button');
        deleteSetButton.id = "deleteSetButton";
        deleteSetButton.innerHTML = "Delete set";
        deleteSetButton.addEventListener("click", deleteSet);

        const startLiveSearchButton = document.createElement('button');
        startLiveSearchButton.id = "startLiveSearchButton";
        startLiveSearchButton.innerHTML = "Start Live Search";
        startLiveSearchButton.addEventListener("click", liveSearch);

        const JijaTrading = document.createElement('div');
        JijaTrading.classList.add('JijaTrading');
        const title = document.createElement('div');
        const logo = document.createElement('img');
        logo.src = "https://cdn.7tv.app/emote/60bcb44f7229037ee386d1ab/4x.webp"
        logo.style.width = "30px";
        logo.style.height = "30px";
        logo.style.marginRight = "8px";
        title.appendChild(logo);
        const titleText = document.createElement('span');
        titleText.innerHTML = "JijaTrading";
        title.appendChild(titleText);
        title.classList.add("jijaTitle");
        const jijaDiv = document.createElement('div');
        jijaDiv.id = "jijaDiv";
        jijaDiv.appendChild(title);

        JijaTrading.appendChild(jijaDiv);

        function createArrowSVG() {
            // Создаем элемент <svg> с указанными атрибутами
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "25");
            svg.setAttribute("height", "25");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("style", "display: block; margin: auto;");

            // Создаем элемент <path> с указанными атрибутами для отрисовки стрелки
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M15 12l-5-5-1.41 1.41L12.17 12l-3.59 3.59L10 17l5-5z");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "2");

            // Добавляем элемент <path> в элемент <svg>
            svg.appendChild(path);

            return svg;
        }

        function createArrowOpenSVG(){
            // Создаем элемент <svg> с указанными атрибутами
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "25");
            svg.setAttribute("height", "25");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("style", "display: block; margin: auto;");

            // Создаем элемент <g> для применения преобразования
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("transform", "rotate(180 12 12)"); // Применяем поворот на 180 градусов относительно центра

            // Создаем элемент <path> с указанными атрибутами для отрисовки стрелки
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M15 12l-5-5-1.41 1.41L12.17 12l-3.59 3.59L10 17l5-5z");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "2");

            // Добавляем элемент <path> в элемент <g>
            g.appendChild(path);
            // Добавляем элемент <g> в элемент <svg>
            svg.appendChild(g);

            return svg;
        }

        openPanelBtn.appendChild(createArrowOpenSVG());
        const openImg = document.createElement('img');
        openImg.src = "https://cdn.7tv.app/emote/60bcb44f7229037ee386d1ab/4x.webp"
        openImg.style.width = "30px";
        openImg.style.height = "30px";
        openPanelBtn.appendChild(openImg);

        closePanelBtn.appendChild(createArrowSVG());
        jijaDiv.appendChild(closePanelBtn);

        const jijaContent = document.createElement('div');
        jijaContent.id = "jijaContent";

        panel.appendChild(JijaTrading);
        // Добавляем <select> и контейнер с данными на панель
        jijaContent.appendChild(profileSelect);
        jijaContent.appendChild(profileDataContainer);
        addLinkButton.classList.add('jijaBtn');
        addSetButton.classList.add('jijaBtn');
        deleteSetButton.classList.add('jijaBtn');
        startLiveSearchButton.classList.add('jijaStart');

        const imgBottom = document.createElement('img');
        imgBottom.id = "imgBottom";
        imgBottom.src = "https://cdn.7tv.app/emote/62bdd040e7f2da3bb019beb6/4x.webp";

        const jijaContainer = document.createElement('div');
        jijaContainer.classList.add('jija-container');
        jijaContainer.appendChild(addLinkButton);
        jijaContainer.appendChild(addSetButton);
        jijaContainer.appendChild(deleteSetButton);
        jijaContent.appendChild(jijaContainer);
        jijaContent.appendChild(startLiveSearchButton);
        panel.appendChild(imgBottom);


        panel.appendChild(jijaContent);

        // Вызываем функцию для отображения данных выбранного профиля при инициализации скрипта
        if(currentProfile){
            profileSelect.value = currentProfile;
        }
        displaySelectedProfileData();
        if (profileDataContainer.scrollHeight >= 290) {
            profileDataContainer.style.overflowY = "scroll";;
        } else {
            profileDataContainer.style.overflowY = "visible";
        }


    }//конец addSidePanel

    function init() {
        addSidePanel();
        GM_addStyle(getStyles());
    }
    // Функция, которая будет выполняться после загрузки страницы
    function afterPageLoad() {
        // Ваши действия после загрузки страницы
        init();
    }

    // Функция для проверки готовности страницы
    function isPageLoaded() {
        return document.readyState === 'complete';
    }

    // Ожидаем полной загрузки страницы
    function waitForPageLoad() {
        if (isPageLoaded()) {
            afterPageLoad();
        } else {
            // Если страница еще не загружена, ждем 100 миллисекунд и проверяем снова
            setTimeout(waitForPageLoad, 100);
        }
    }
    // Запускаем ожидание загрузки страницы
    waitForPageLoad();
})();


