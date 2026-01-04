// ==UserScript==
// @name         BotMenu Client [Indev]
// @name:en      BotMenu Client [Indev]
// @name:ru      БотМеню Клиент [Indev]
// @namespace    https://github.com/Zeroxel/BotMenu/
// @version      5.0
// @description:ru  Интерфейс для управления командами ботов с поддержкой категорий и сортировки
// @description:en  Interface for bot team management with support for categorization and sorting
// @author       gtnntg
// @match        *://multiplayerpiano.net/*
// @match        *://mpp.8448.space/*
// @license      ARC
// @grant        GM_info
// @supportURL   https://github.com/Zeroxel/BotMenu/discussions/categories/bot-menu-client
// @description Интерфейс для управления командами ботов с поддержкой категорий и сортировки
// @downloadURL https://update.greasyfork.org/scripts/530250/BotMenu%20Client%20%5BIndev%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/530250/BotMenu%20Client%20%5BIndev%5D.meta.js
// ==/UserScript==

/*global MPP*/
const useversion = GM_info.script.version;

(function () {
    'use strict';

    const botsData = {}; // Хранение данных ботов { botId: { name, categories, userRank } }
    const botmenu = {
        client: {
            /*
             BotMenu Client -> User
            */
            send(msg,name,id,color) {
                MPP.chat.receive({
                    "m": "a",
                    "t": Date.now(),
                    "a": msg,
                    "p": {
                        "_id": id,
                        "name": name,
                        "color": color,
                        "id": id
                    }
                });
            }
            //---------------
        },
        bot: {
            /*
            BotMenu Client -> BotMenu Server
            */
            send(botId,message) {
                MPP.client.sendArray([{
                    m: "custom",
                    data: {
                        m: "BotMenuClient",
                        language: localStorage.getItem('language'),
                        type: "msg",
                        message:message,
                    },
                    target: { mode: "id" , id: botId},
                }]);
            },
            type(botId, typename) {
                MPP.client.sendArray([{
                    m: "custom",
                    data: {
                        m: "BotMenuClient",
                        language: localStorage.getItem('language'),
                        type: typename,
                    },
                    target: { mode: "id" , id: botId},
                }]);
            },
            //-----------------
            reqcmds() {
                MPP.client.sendArray([{
                    m: "custom",
                    data: {
                        m: "BotMenuClient",
                        language: localStorage.getItem('language'),
                        type: "Requestcommands"
                    },
                    target: { mode: "subscribed" },
                }]);
                botmenu.client.send('Запрос на команды был отправлен всем ботам находящиеся в данной комнате','Bot Menu Client','Bot Menu Client','#0066ff')
            }
        }
    }

    // Создаём контейнер для вкладок и кнопок
    const container = document.createElement('div');
    container.id = 'bot-menu';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '10px';
    container.style.width = '300px';
    container.style.maxHeight = '500px';
    container.style.minHeight = '50px';
    container.style.backgroundColor = '#121212';
    container.style.color = '#fff';
    container.style.border = '1px solid #333';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    container.style.padding = '10px';
    container.style.overflowY = 'auto';
    container.style.zIndex = '10000';
    container.style.display = 'block';
    document.body.appendChild(container);

    // Кнопка сворачивания
    const toggleButton = document.createElement('button');
    toggleButton.innerText = '⮝';
    toggleButton.style.alignSelf = 'flex-end';
    toggleButton.style.backgroundColor = '#333';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.marginBottom = '10px';
    toggleButton.onclick = toggleContainer;
    container.appendChild(toggleButton);

    const QButton = document.createElement('button');
    QButton.innerText = '🔎';
    QButton.style.alignSelf = 'flex';
    QButton.style.backgroundColor = '#333';
    QButton.style.color = '#fff';
    QButton.style.border = 'none';
    QButton.style.borderRadius = '4px';
    QButton.style.marginLeft = '10px';
    QButton.style.cursor = 'pointer';
    QButton.style.marginBottom = '10px';
    QButton.onclick = botmenu.bot.reqcmds;
    container.appendChild(QButton);

    const tabs = document.createElement('div'); // Контейнер для вкладок
    tabs.id = 'bot-tabs';
    tabs.style.display = 'flex';
    tabs.style.flexDirection = 'column';
    tabs.style.flexWrap = 'nowrap';
    tabs.style.marginBottom = '10px';
    container.appendChild(tabs);

    const commandsContainer = document.createElement('div'); // Контейнер для кнопок команд
    commandsContainer.id = 'commands-container';
    commandsContainer.style.display = 'none';
    commandsContainer.style.padding = '10px';
    commandsContainer.style.borderTop = '1px solid #555';
    commandsContainer.style.marginTop = '10px';
    container.appendChild(commandsContainer);

    let isCollapsed = false;

    // Сворачивание/разворачивание контейнера
    function toggleContainer() {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            tabs.style.display = 'none';
            commandsContainer.style.display = 'none';
            toggleButton.innerText = '⮟';
            container.style.maxHeight = '50px';
        } else {
            tabs.style.display = 'flex';
            toggleButton.innerText = '⮝';
            container.style.maxHeight = '500px';
        }
    }


    // Функция для добавления новой вкладки
    function addTab(botId, botName) {
        const tab = document.createElement('button');
        tab.innerText = botName;
        tab.style.padding = '5px 10px';
        tab.style.margin = '5px 5px 0 0';
        tab.style.border = '1px solid #444';
        tab.style.borderRadius = '5px';
        tab.style.backgroundColor = '#2e2e2e';
        tab.style.color = '#fff';
        tab.style.cursor = 'pointer';
        tab.style.flex = '1 0 auto';
        tab.setAttribute('data-id', botId); // Присваиваем data-id для идентификации
        tab.onclick = () => showCommands(botId);
        tabs.appendChild(tab);
    }

    // Функция для отображения команд
    function showCommands(botId) {
        commandsContainer.innerHTML = ''; // Очищаем контейнер команд
        commandsContainer.style.display = 'block'; // Показываем контейнер

        const botData = botsData[botId];
        if (!botData) return; // Если данных нет, выходим

        /* const title = document.createElement('h3');
    title.innerText = `${botData.name}`;
    title.style.marginBottom = '10px';
    commandsContainer.appendChild(title);*/

        // Сортируем категории по позиции
        botData.categories.sort((a, b) => a.position - b.position);

        // Обрабатываем каждую категорию
        botData.categories.forEach((category) => {
            const categoryTitle = document.createElement('h4');
            categoryTitle.innerText = category.name; // Название категории
            categoryTitle.style.marginTop = '10px';
            categoryTitle.style.color = category.categoryColor ? category.categoryColor : '#aaa';
            categoryTitle.style.cursor = 'pointer'; // Добавляем курсор pointer для показа кликабельности

            // Добавляем иконку для показа состояния (свернуто/развернуто)
            const categoryIcon = document.createElement('span');
            categoryIcon.innerText = ' ▼'; // По умолчанию развернуто
            categoryIcon.style.fontSize = '12px';
            categoryTitle.appendChild(categoryIcon);

            commandsContainer.appendChild(categoryTitle);

            // Создаем контейнер для команд категории
            const commandList = document.createElement('div');
            commandList.style.marginLeft = '10px';
            commandsContainer.appendChild(commandList);

            // Добавляем обработчик клика для сворачивания/разворачивания
            categoryTitle.onclick = () => {
                if (commandList.style.display === 'none') {
                    commandList.style.display = 'block';
                    categoryIcon.innerText = ' ▼';
                } else {
                    commandList.style.display = 'none';
                    categoryIcon.innerText = ' ►';
                }
            };

            // Обрабатываем команды внутри категории
            category.commands.forEach((cmd) => {
                const commandBlock = document.createElement('div'); // Блок для команды
                commandBlock.style.display = 'flex';
                commandBlock.style.flexDirection = 'column';
                commandBlock.style.marginBottom = '10px';

                const btn = document.createElement('button'); // Кнопка команды
                btn.innerText = cmd.label;
                btn.title = cmd.description;
                btn.style.padding = '8px';
                btn.style.border = '1px solid #ccc';
                btn.style.borderRadius = '5px';
                btn.style.backgroundColor = !cmd.bcolor ? '#e0e0e0' : cmd.bcolor ;
                btn.style.color = !cmd.color ? '#000' : cmd.color ;
                btn.style.cursor = 'pointer';

                const inputs = []; // Массив для хранения полей ввода

                // Если команда имеет параметры, создаем поля ввода
                if (cmd.parameters && cmd.parameters.length > 0) {
                    cmd.parameters.forEach(param => {
                        const Input = document.createElement('input');
                        Input.type = 'text';
                        Input.placeholder = `Введите ${param}`;
                        Input.style.marginBottom = '5px';
                        Input.style.backgroundColor = '#333';
                        Input.style.color = '#fff';
                        Input.style.borderRadius = '4px';
                        commandBlock.appendChild(Input);
                        inputs.push(Input); // Добавляем поле в массив
                    });
                }

                // Обработчик нажатия на кнопку
                btn.onclick = () => {
                    if (!cmd.message) {
                        let finalCommand = cmd.command; // Изначальная команда

                        // Проверяем, заполнены ли все параметры
                        for (let i = 0; i < inputs.length; i++) {
                            const value = inputs[i].value.trim();
                            if (!value) {
                                botmenu.client.send(`Параметр "${cmd.parameters[i]}" не может быть пустым!`,'Bot Menu Client [Error]','Bot Menu Client','#0066ff')
                                return; // Отменяем выполнение, если параметр пуст
                            }
                            finalCommand = finalCommand.replace(`[${cmd.parameters[i]}]`, value); // Заменяем параметр
                        }

                        // Вставляем готовую команду в чат
                        const chatInput = document.querySelector('#chat-input');
                        if (chatInput) {
                            chatInput.value = finalCommand;
                            chatInput.focus(); // Устанавливаем фокус на чат
                        } else {
                            console.error('Chat input not found!');
                        }}else {
                            let msguser = cmd.message
                            botmenu.bot.send(botId,msguser)
                        }
                };

                commandBlock.appendChild(btn); // Добавляем кнопку в блок команды
                commandList.appendChild(commandBlock); // Добавляем блок команды в контейнер категории
            });
        });
    }

    // Делает контейнер перетаскиваемым
    class BotChatPanel {
        constructor() {
            this.createPanel();
        }

        createPanel() {
            this.panel = document.createElement("div");
            this.panel.id = "bot-chat-panel";
            this.panel.style.position = "fixed";
            this.panel.style.bottom = "20px";
            this.panel.style.right = "20px";
            this.panel.style.width = "300px";
            this.panel.style.height = "400px";
            this.panel.style.background = "#222";
            this.panel.style.color = "#fff";
            this.panel.style.borderRadius = "10px";
            this.panel.style.padding = "10px";
            this.panel.style.overflowY = "auto";
            this.panel.style.display = "none";
            this.panel.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

            const closeButton = document.createElement("button");
            closeButton.innerText = "✖";
            closeButton.style.position = "absolute";
            closeButton.style.top = "5px";
            closeButton.style.right = "5px";
            closeButton.style.background = "transparent";
            closeButton.style.color = "#fff";
            closeButton.style.border = "none";
            closeButton.style.cursor = "pointer";
            closeButton.onclick = () => this.panel.style.display = "none";
            this.panel.appendChild(closeButton);
            document.body.appendChild(this.panel);
        }

        showMessage(botName, botColor, message) {
            const messageDiv = document.createElement("div");
            messageDiv.style.padding = "5px";
            messageDiv.style.borderBottom = "1px solid #444";

            const botLabel = document.createElement("span");
            botLabel.innerText = `[${botName}] `;
            botLabel.style.color = botColor;
            botLabel.style.fontWeight = "bold";

            const textSpan = document.createElement("span");
            textSpan.innerText = message;

            messageDiv.appendChild(botLabel);
            messageDiv.appendChild(textSpan);
            this.panel.appendChild(messageDiv);

            this.panel.style.display = "block";
        }
    }

    // Создаем панель
    const botChat = new BotChatPanel();

    // Функция для обработки сообщений с directsend
    function handleCommandResponse(response) {
        if (response.directsend === "true") {
            botChat.showMessage(response.botName, response.botColor, response.message);
        } else {
            console.log("Обычный ответ в чат", response.message);
        }
    }

    function makeDraggable(element) {
        let offsetX = 0, offsetY = 0, mouseDown = false;

        element.addEventListener('mousedown', (e) => {
            mouseDown = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            mouseDown = false;
        });
    }

    makeDraggable(container);

    // Обработчик входящих сообщений
    MPP.client.on('custom', (data) => {
        if (!data.data || data.data.m !== 'BotMenu') return;

        const { version, botName, botColor, categories, userRank } = data.data;
        const botId = data.p;

        if (!data.data.mode) {
            botmenu.client.send(`[${botName}](${botId}) This bot does not have a Mode `,'Bot Menu Client [Error]','Bot Menu Client','#0066ff')
            return
        }

        if (data.data.mode === 'CSC') {
        if (!botId || !botName || !Array.isArray(categories)) {
            console.debug('Invalid bot data received:', data.data);
            return;
        }
        if (!version) {
            botmenu.client.send(`[${botName}](${botId}) This bot does not have a Version `,'Bot Menu Client [Error]','Bot Menu Client','#0066ff')
            return
        }

        if (version < useversion) {
            botmenu.bot.type(botId , `old.version`);
            botmenu.client.send(`This bot is outdated, if you own it update the bot [${botName}](${botId}) to the latest version.`,'Bot Menu Client [Error]','Bot Menu Client','#0066ff')
            return;
        }

        // Проверяем, есть ли данные для бота
        if (!botsData[botId]) {
            botsData[botId] = { name: botName, categories: [], userRank };

            // Обрабатываем категории
            categories.forEach((category) => {
                const { categoryName, categoryColor, position, commands, requiredRank } = category;

                botsData[botId].categories.push({
                    name: categoryName,
                    categoryColor,
                    position,
                    commands,
                    requiredRank
                });
            });

            addTab(botId, botName); // Добавляем вкладку для бота
            botmenu.client.send(`Данные были получены с ${botName}`,'Bot Menu Client','Bot Menu Client','#0066ff')
            botmenu.bot.type(botId , 'confirm')
        } else {
            // Обновляем существующие данные
            botsData[botId].categories = categories.map((category) => ({
                name: category.categoryName,
                categoryColor: category.categoryColor,
                position: category.position,
                commands: category.commands,
                requiredRank: category.requiredRank
            }));
            botsData[botId].userRank = userRank;
            botmenu.client.send(`Данные бота ${botName} были обновлены`,'Bot Menu Client','Bot Menu Client','#0066ff');
        }
        } else if (data.data.mode === 'MSG' || data.data.mode === ('Message' || 'message')){
            let msg = data.data.message;
            botmenu.client.send(`${msg}`,`${botName}`,`Bot Menu (${botId})`,`${botColor}`);
        }
    });

    // При подключении отправляем +custom
    MPP.client.on('hi', () => {
        MPP.client.sendArray([{ m: '+custom' }]);
    });
})();
