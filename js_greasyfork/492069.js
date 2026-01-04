// ==UserScript==
// @name         Arb Helper
// @namespace    arb_helper_lzt
// @version      0.5
// @description  Скрипт позволяет легко создавать обжалование решений модераторов в жалобах
// @author       seuyh
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https://zelenka.guru/seuyh/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492069/Arb%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492069/Arb%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addAppealButton() {
        var targetLink = document.querySelector("#pageDescription > a:nth-child(1)");

        if (targetLink && (targetLink.getAttribute("href") === "forums/801/" || targetLink.getAttribute("href") === "forums/803/")) {
            var titleBar = document.querySelector("#content > div > div > div.titleBar");

            if (titleBar) {
                var appealButton = document.createElement("button");
                appealButton.textContent = "Обжаловать";
                appealButton.addEventListener("click", openModal);
                appealButton.style.bottom = "10px";
                appealButton.style.right = "90px";
                appealButton.style.padding = "10px";
                appealButton.style.backgroundColor = "#4CAF50";
                appealButton.style.border = "none";
                appealButton.style.color = "white";
                appealButton.style.transition = "background-color 0.3s";
                appealButton.addEventListener("mouseover", function() {
                    this.style.backgroundColor = "#357a38";
                });
                appealButton.addEventListener("mouseout", function() {
                    this.style.backgroundColor = "#4CAF50";
                });
                titleBar.appendChild(appealButton);
            }
        }
    }

    function openModal() {
        var overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        overlay.style.zIndex = "9000";
        overlay.addEventListener("click", closeModal);
        document.body.appendChild(overlay);

        var modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "50%";
        modal.style.left = "50%";
        modal.style.transform = "translate(-50%, -50%)";
        modal.style.width = "500px";
        modal.style.height = "auto";
        modal.style.maxHeight = "90%";
        modal.style.overflowY = "auto";
        modal.style.backgroundColor = "#303030";
        modal.style.color = "rgb(214, 214, 214)";
        modal.style.border = "1px solid #ccc";
        modal.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
        modal.style.padding = "20px";
        modal.style.zIndex = "9001";

        var modalTitle = document.createElement("h2");
        modalTitle.textContent = "Обжаловать решение";
        modalTitle.style.textAlign = "center";
        modalTitle.style.marginBottom = "20px";
        modalTitle.style.fontSize = "18px";
        modal.appendChild(modalTitle);

        var select1 = createSelect("verdictSelect", ["Чье решение обжалуем?"]);
        select1.style.marginBottom = "10px";
        modal.appendChild(select1);

        var notifyCheckbox = createCheckbox("notifyCheckbox", "Оповещать подписчиков?");
        notifyCheckbox.style.marginBottom = "10px";
        notifyCheckbox.style.marginLeft = "20px";
        modal.appendChild(notifyCheckbox);

        var hideTeamCheckbox = createCheckbox("hideTeamCheckbox", "Хайд для команды форума?");
        hideTeamCheckbox.style.marginBottom = "10px";
        hideTeamCheckbox.style.marginLeft = "20px";
        modal.appendChild(hideTeamCheckbox);

        var descriptionLabel = createLabel("Краткое описание обжалования");
        var descriptionTextarea = createTextarea("descriptionTextarea");
        descriptionTextarea.style.marginBottom = "10px";
        modal.appendChild(descriptionLabel);
        modal.appendChild(descriptionTextarea);

        var evidenceLabel = createLabel("Доказательства");
        var evidenceTextarea = createTextarea("evidenceTextarea");
        evidenceTextarea.style.marginBottom = "20px";
        modal.appendChild(evidenceLabel);
        modal.appendChild(evidenceTextarea);

        fetchUserListAndPopulateSelect(select1);

        var appealButton = document.createElement("button");
        appealButton.textContent = "Обжаловать";
        appealButton.addEventListener("click", openConfirmationModal);
        appealButton.style.position = "absolute";
        appealButton.style.bottom = "5px";
        appealButton.style.right = "10px";
        appealButton.style.padding = "10px";
        appealButton.style.backgroundColor = "#4CAF50";
        appealButton.style.border = "none";
        appealButton.style.color = "white";
        appealButton.style.transition = "background-color 0.3s";
        appealButton.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#357a38";
        });
        appealButton.addEventListener("mouseout", function() {
            this.style.backgroundColor = "#4CAF50";
        });
        modal.appendChild(appealButton);

        addSettingsButtonToModal(modal);

        document.body.appendChild(modal);

        function closeModal() {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        }
    }
    function addSettingsButtonToModal(modal) {
        var settingsButton = document.createElement("button");
        settingsButton.textContent = "Настройки";
        settingsButton.addEventListener("click", openSettingsModal);
        settingsButton.style.position = "absolute";
        settingsButton.style.top = "10px";
        settingsButton.style.right = "10px";
        settingsButton.style.padding = "10px";
        settingsButton.style.backgroundColor = "#4CAF50";
        settingsButton.style.border = "none";
        settingsButton.style.color = "white";
        settingsButton.style.transition = "background-color 0.3s";
        settingsButton.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#357a38";
        });
        settingsButton.addEventListener("mouseout", function() {
            this.style.backgroundColor = "#4CAF50";
        });
        modal.appendChild(settingsButton);
    }

    function openSettingsModal() {
        var overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        overlay.style.zIndex = "10000";
        overlay.addEventListener("click", closeSettingsModal);
        document.body.appendChild(overlay);

        var settingsModal = document.createElement("div");
        settingsModal.style.position = "fixed";
        settingsModal.style.top = "50%";
        settingsModal.style.left = "50%";
        settingsModal.style.transform = "translate(-50%, -50%)";
        settingsModal.style.width = "350px";
        settingsModal.style.height = "auto";
        settingsModal.style.maxHeight = "90%";
        settingsModal.style.overflowY = "auto";
        settingsModal.style.backgroundColor = "#303030";
        settingsModal.style.color = "rgb(214, 214, 214)";
        settingsModal.style.border = "1px solid #ccc";
        settingsModal.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
        settingsModal.style.padding = "20px";
        settingsModal.style.zIndex = "10001";

        var settingsTitle = document.createElement("h2");
        settingsTitle.textContent = "Настройки";
        settingsTitle.style.textAlign = "center";
        settingsTitle.style.marginBottom = "20px";
        settingsTitle.style.fontSize = "14px";
        settingsModal.appendChild(settingsTitle);

        var tokenLabel = createLabel("Введите токен:");
        var tokenInput = document.createElement("input");
        tokenInput.type = "text";
        tokenInput.id = "tokenInput";
        tokenInput.style.width = "90%";
        tokenInput.style.padding = "5px";
        tokenInput.style.fontSize = "12px";
        tokenInput.style.color = "rgb(214, 214, 214)";
        tokenInput.style.backgroundColor = "#303030";
        tokenInput.style.border = "2px solid rgb(46,97,74)";
        tokenInput.style.borderRadius = "2px";
        tokenInput.style.marginBottom = "10px";
        tokenInput.style.marginLeft = "10px";
        tokenInput.value = GM_getValue("token", "");
        settingsModal.appendChild(tokenLabel);
        settingsModal.appendChild(tokenInput);

        var saveButton = document.createElement("button");
        saveButton.textContent = "Сохранить";
        saveButton.addEventListener("click", saveToken);
        saveButton.style.position = "absolute";
        saveButton.style.right = "5px";
        saveButton.style.padding = "6.2px";
        saveButton.style.backgroundColor = "#4CAF50";
        saveButton.style.border = "none";
        saveButton.style.color = "white";
        saveButton.style.transition = "background-color 0.3s";
        saveButton.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#357a38";
        });
        saveButton.addEventListener("mouseout", function() {
            this.style.backgroundColor = "#4CAF50";
        });
        settingsModal.appendChild(saveButton);

        document.body.appendChild(settingsModal);

        function closeSettingsModal() {
            document.body.removeChild(settingsModal);
            document.body.removeChild(overlay);
        }

        function saveToken() {
            var token = document.getElementById("tokenInput").value;
            GM_setValue("token", token);
            closeSettingsModal();
            window.location.reload();
        }
    }

    function fetchUserListAndPopulateSelect(select) {
        const threadId = window.location.pathname.split('/')[2];
        const token = GM_getValue("token", "");
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${token}`
            }
        };

        fetch(`https://api.zelenka.guru/posts?thread_id=${threadId}&post_ids=&order=natural`, options)
            .then(response => response.json())
            .then(response => {
                const posts = response.posts;
                const thread = response.thread;
                const posters = new Set();

                posts.forEach(post => {
                    posters.add(post.poster_username);
                });

                const creatorUsername = thread.creator_username;
                posters.delete(creatorUsername);

                posters.forEach(poster => {
                    var option = document.createElement("option");
                    option.value = poster;
                    option.textContent = poster;
                    select.appendChild(option);
                });
            })
            .catch(err => {
            console.error(err);
            alert("Убедитесь, что у вас установлен верный токен");
        });
    }

    function openConfirmationModal() {
        var selectedUser = document.querySelector("#verdictSelect").value;
        if (selectedUser === "Чье решение обжалуем?") {
            var originalColor = document.querySelector("#verdictSelect").style.color;
            document.querySelector("#verdictSelect").style.color = "red";

            setTimeout(function() {
            document.querySelector("#verdictSelect").style.color = originalColor;
            }, 2000);
            return;
        }

        var confirmationOverlay = document.createElement("div");
        confirmationOverlay.style.position = "fixed";
        confirmationOverlay.style.top = "0";
        confirmationOverlay.style.left = "0";
        confirmationOverlay.style.width = "100%";
        confirmationOverlay.style.height = "100%";
        confirmationOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        confirmationOverlay.style.zIndex = "10000";
        confirmationOverlay.addEventListener("click", closeConfirmationModal);
        document.body.appendChild(confirmationOverlay);

        var confirmationModal = document.createElement("div");
        confirmationModal.style.position = "fixed";
        confirmationModal.style.top = "50%";
        confirmationModal.style.left = "50%";
        confirmationModal.style.transform = "translate(-50%, -50%)";
        confirmationModal.style.width = "500px";
        confirmationModal.style.height = "auto";
        confirmationModal.style.maxHeight = "80%";
        confirmationModal.style.overflowY = "auto";
        confirmationModal.style.backgroundColor = "#303030";
        confirmationModal.style.color = "rgb(214, 214, 214)";
        confirmationModal.style.border = "1px solid #ccc";
        confirmationModal.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
        confirmationModal.style.padding = "20px";
        confirmationModal.style.zIndex = "10001";

        var confirmationTitle = document.createElement("h2");
        confirmationTitle.textContent = "Обжалование решения " + selectedUser;
        confirmationTitle.style.textAlign = "center";
        confirmationTitle.style.marginBottom = "20px";
        confirmationTitle.style.fontSize = "18px";
        confirmationModal.appendChild(confirmationTitle);

        var notify = document.querySelector("#notifyCheckbox").checked ? "да" : "нет";
        var hideTeam = document.querySelector("#hideTeamCheckbox").checked ? "да" : "нет";
        var description = document.querySelector("#descriptionTextarea").value.trim() !== "" ? "Заполнено" : "НЕ заполнено";
        var evidence = document.querySelector("#evidenceTextarea").value.trim() !== "" ? "Заполнено" : "НЕ заполнено";

        var notifyText = document.createElement("p");
        notifyText.textContent = "Оповещать подписчиков: " + notify;
        confirmationModal.appendChild(notifyText);

        var hideTeamText = document.createElement("p");
        hideTeamText.textContent = "Хайд для команды форума: " + hideTeam;
        confirmationModal.appendChild(hideTeamText);

        var descriptionText = document.createElement("p");
        descriptionText.textContent = "Краткое описание: " + description;
        if (description === "НЕ заполнено") {
            descriptionText.style.color = "red";
        }
        confirmationModal.appendChild(descriptionText);

        var evidenceText = document.createElement("p");
        evidenceText.textContent = "Доказательства: " + evidence;
        if (evidence === "НЕ заполнено") {
            evidenceText.style.color = "red";
        }
        confirmationModal.appendChild(evidenceText);

        var closeButton = document.createElement("button");
        closeButton.textContent = "Закрыть";
        closeButton.addEventListener("click", closeConfirmationModal);
        closeButton.style.position = "absolute";
        closeButton.style.bottom = "10px";
        closeButton.style.right = "10px";
        closeButton.style.padding = "7px";
        closeButton.style.backgroundColor = "#4CAF50";
        closeButton.style.border = "none";
        closeButton.style.color = "white";
        closeButton.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#357a38";
        });
        closeButton.addEventListener("mouseout", function() {
            this.style.backgroundColor = "#4CAF50";
        });
        confirmationModal.appendChild(closeButton);

        var placeButton = document.createElement("button");
        placeButton.textContent = "Разместить";
        placeButton.addEventListener("click", function() {
    var selectedUser = document.querySelector("#verdictSelect").value;
    if (selectedUser === "Чье решение обжалуем?") {
        var originalColor = document.querySelector("#verdictSelect").style.color;
        document.querySelector("#verdictSelect").style.color = "red";

        setTimeout(function() {
            document.querySelector("#verdictSelect").style.color = originalColor;
        }, 2000);
        return;
    }

    var notify = document.querySelector("#notifyCheckbox").checked ? "0" : "1";
    var hideTeam = document.querySelector("#hideTeamCheckbox").checked ? "[club=align=left]" : "";
    var description = document.querySelector("#descriptionTextarea").value.trim();
    var evidence = document.querySelector("#evidenceTextarea").value.trim();

    var url = window.location.href;
    var bodyContent = `${hideTeam}1. Ссылка на обжалуемую жалобу: ${url}\n\n2. Краткое описание обжалования: ${description}\n\n3. Доказательства: ${evidence}${hideTeam ? "[/club]" : ""}`;
    const token = GM_getValue("token", "");
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            authorization: `Bearer ${token}`
        },
        body: new URLSearchParams({
            'post_body': bodyContent,
            'forum_id': '801',
            'title': `Обжалование решения ${selectedUser}`,
            'prefix_id[]': '93',
            'reply_group': '2',
            'hide_contacts': '0',
            'allow_ask_hidden_content': '0',
            'dont_alert_followers': notify
        })
    };

    fetch('https://api.zelenka.guru/threads', options)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        alert("Обжалование размещено (Проверьте размещение, так как этот статус не всегда верный)");
        window.location.href = 'https://zelenka.guru/forums/801/';
    })
    .catch(err => {
        console.error(err);
        alert("Ошибка размещения. Попробуйте еще раз");
    });
});

        placeButton.style.position = "absolute";
        placeButton.style.bottom = "10px";
        placeButton.style.right = "90px";
        placeButton.style.padding = "10px";
        placeButton.style.backgroundColor = "#4CAF50";
        placeButton.style.border = "none";
        placeButton.style.color = "white";
        placeButton.style.transition = "background-color 0.3s";
        placeButton.addEventListener("mouseover", function() {
            this.style.backgroundColor = "#357a38";
        });
        placeButton.addEventListener("mouseout", function() {
            this.style.backgroundColor = "#4CAF50";
        });
        confirmationModal.appendChild(placeButton);

        function closeConfirmationModal() {
            document.body.removeChild(confirmationModal);
            document.body.removeChild(confirmationOverlay);
        }

        document.body.appendChild(confirmationModal);
    }

    function createSelect(id, options) {
        var select = document.createElement("select");
        select.name = id;
        select.id = id;
        select.style.width = "90%";
        select.style.padding = "10px";
        select.style.fontSize = "14px";
        select.style.color = "rgb(214, 214, 214)";
        select.style.backgroundColor = "#303030";
        select.style.border = "2px solid rgb(46,97,74)";
        select.style.borderRadius = "5px";
        select.style.marginBottom = "10px";
        select.style.marginLeft = "20px";
        options.forEach(optionText => {
            var option = document.createElement("option");
            option.textContent = optionText;
            select.appendChild(option);
        });
        return select;
    }

    function createCheckbox(id, labelText) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = id;
        checkbox.id = id;

        var label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;

        var div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.appendChild(checkbox);
        div.appendChild(label);
        return div;
    }

    function createLabel(labelText) {
        var label = document.createElement("label");
        label.textContent = labelText;
        label.style.display = "block";
        label.style.marginTop = "10px";
        label.style.width = "90%";
        label.style.marginLeft = "20px";
        return label;
    }

    function createTextarea(id) {
        var textarea = document.createElement("textarea");
        textarea.id = id;
        textarea.style.width = "90%";
        textarea.style.minHeight = "100px";
        textarea.style.marginTop = "5px";
        textarea.style.padding = "10px";
        textarea.style.fontSize = "14px";
        textarea.style.color = "rgb(214, 214, 214)";
        textarea.style.backgroundColor = "#303030";
        textarea.style.border = "2px solid rgb(46,97,74)";
        textarea.style.borderRadius = "5px";
        textarea.style.resize = "none";
        textarea.style.marginLeft = "20px";
        textarea.style.wordWrap = "break-word";
        textarea.style.overflowX = "auto";
        return textarea;
    }


    window.addEventListener("load", addAppealButton);



})();

