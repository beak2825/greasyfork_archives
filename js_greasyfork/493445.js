// ==UserScript==
// @name         !! ~ Player Joined Notifications &&& Server's Player List ~ !!
// @name:ru      !! ~ Уведомления о присоединении игроков []И[] Список игроков на сервере ~ !!
// @name:vi      !! ~ Thông báo Người chơi tham gia []VÀ[] Danh sách Người chơi trên Máy chủ ~ !!
// @name:zh      !! ~ 玩家加入通知 []和[] 服务器的玩家列表 ~ !!
// @namespace    http://tampermonkey.net/
// @version      2024-04-23
// @description  Find your friends easily in sploop.io! The first script of its type 🤯😁😎✌️. Press Semicolum " ; " to toggle the aesthetic player list and select the theme of your choice!
// @description:ru  Легко находите своих друзей в sploop.io! Первый скрипт такого типа 🤯😁😎✌️. Нажмите точку с запятой " ; ", чтобы переключить эстетический список игроков и выбрать тему по вашему выбору!
// @description:vi  Tìm bạn dễ dàng trong sploop.io! Đây là kịch bản đầu tiên của loại này 🤯😁😎✌️. Nhấn chấm phẩy " ; " để chuyển đổi danh sách người chơi thẩm mỹ và chọn chủ đề theo ý muốn!
// @description:zh  在 sploop.io 中轻松找到你的朋友！这是这种类型的第一个脚本 🤯😁😎✌️。按分号 " ; " 切换美观的玩家列表并选择您喜欢的主题！
// @author       fizzixww
// @match        https://sploop.io/
// @icon         https://i.postimg.cc/Z5WBHzhP/8-d-Sov4iq-FMua-At-VE.png
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/493445/%21%21%20~%20Player%20Joined%20Notifications%20%20Server%27s%20Player%20List%20~%20%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/493445/%21%21%20~%20Player%20Joined%20Notifications%20%20Server%27s%20Player%20List%20~%20%21%21.meta.js
// ==/UserScript==

/*
I wish I could live in a snowy boreal forest and watch the beautiful northern lights every night....
    ` : | | | |:  ||  :     `  :  |  |+|: | : : :|   .        `              .
        ` : | :|  ||  |:  :    `  |  | :| : | : |:   |  .                    :
           .' ':  ||  |:  |  '       ` || | : | |: : |   .  `           .   :.
                  `'  ||  |  ' |   *    ` : | | :| |*|  :   :               :|
          *    *       `  |  : :  |  .      ` ' :| | :| . : :         *   :.||
               .`            | |  |  : .:|       ` | || | : |: |          | ||
        '          .         + `  |  :  .: .         '| | : :| :    .   |:| ||
           .                 .    ` *|  || :       `    | | :| | :      |:| |
   .                .          .        || |.: *          | || : :     :|||
          .            .   . *    .   .  ` |||.  +        + '| |||  .  ||`
       .             *              .     +:`|!             . ||||  :.||`
   +                      .                ..!|*          . | :`||+ |||`
       .                         +      : |||`        .| :| | | |.| ||`     .
         *     +   '               +  :|| |`     :.+. || || | |:`|| `
                              .      .||` .    ..|| | |: '` `| | |`  +
    .       +++                      ||        !|!: `       :| |
                +         .      .    | .      `|||.:      .||    .      .    `
            '                           `|.   .  `:|||   + ||'     `
    __    +      *                         `'       `'|.    `:
  "'  `---"""----....____,..^---`^``----.,.___          `.    `.  .    ____,.,-
      ___,--'""`---"'   ^  ^ ^        ^       """'---,..___ __,..---""'
  --"'                           ^                         ``--..,__
https://i.postimg.cc/kgLVhYn0/8-jo1z9twm6-Kyo-SJf.png
https://i.postimg.cc/Z5WBHzhP/8-d-Sov4iq-FMua-At-VE.png
*/

/*disclaimers:
users with the exact same name will only be written down once. this is why the player list size is smaller than the server size.
When a player leaves, their name will remain on the player list.
If you have any script ideas, dm me on discord: fizzixww
*/

(function() {
    'use strict';

    const fizzixwwsCssVariables = `
        :root {
            --bg-gradient-start: #7CCD7C;
            --bg-gradient-end: #3F7A3F;
            --border-color: #4CAF50;
            --scrollbar-color: #4CAF50;
            --text-color: #ffffff;
            --shadow-color: rgba(0, 0, 0, 0.7);
        }
    `;

    var fizzixwwsCssVariablesStyle = document.createElement('style');
    fizzixwwsCssVariablesStyle.textContent = fizzixwwsCssVariables;
    document.head.appendChild(fizzixwwsCssVariablesStyle);

    var xXplayerList = document.createElement('div');
    xXplayerList.className = 'player-list';
    document.body.appendChild(xXplayerList);

    var xXplayerNames = new Set();

    function xXaddPlayerName(name) {
        if (!xXplayerNames.has(name)) {
            var xXplayerNameElement = document.createElement('div');
            xXplayerNameElement.textContent = name;
            xXplayerNameElement.className = 'player-name';
            xXplayerNameElement.style.opacity = '0';
            xXplayerNameElement.style.animationDelay = Math.random() + 's';
            xXplayerList.appendChild(xXplayerNameElement);
            xXplayerNames.add(name);

            setTimeout(() => {
                xXplayerNameElement.style.opacity = '1';
            }, 100);

            xXdisplayJoinNotification(name);
        }
    }

    function xXdisplayJoinNotification(name) {
        var xXnotification = document.createElement('div');
        xXnotification.textContent = `${name} has joined the server!`;
        xXnotification.className = 'join-notification';
        document.body.appendChild(xXnotification);

        var existingNotifications = document.querySelectorAll('.join-notification');
        var topPosition = 20 + existingNotifications.length * 50;
        xXnotification.style.top = `${topPosition}px`;

        setTimeout(() => {
            xXnotification.style.opacity = '1';
        }, 100);

        setTimeout(() => {

            xXnotification.style.opacity = '0';

            existingNotifications.forEach((existingNotification, index) => {
                var newPosition = 20 + index * 50;
                existingNotification.style.transition = 'top 0.3s, opacity 0.5s';
                existingNotification.style.top = `${newPosition}px`;
            });

            setTimeout(() => {
                xXnotification.remove();
            }, 500);
        }, 3000);
    }

    WebSocket.prototype.fizzixwwsRealSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        this.fizzixwwsRealSend(data);
    };

    function fizzixwwsHandleWebSocketMessages(event) {
        try {
            var fizzixwwsMessageData = JSON.parse(event.data);
            if (fizzixwwsMessageData[0] === 33) {

                xXplayerList.innerHTML = '';
                xXplayerNames.clear();

                var players = fizzixwwsMessageData[3];
                if (players.length === 0) {
                    xXaddPlayerName("Server Joined");
                } else {
                    players.forEach(function(player) {
                        var name = player[1];
                        xXaddPlayerName(name);
                    });
                }

                fizzixwwsApplyScrollbarStyling();
            } else if (fizzixwwsMessageData[0] === 32 || fizzixwwsMessageData[0] === 35) {
                var playerName = fizzixwwsMessageData[2];
                xXaddPlayerName(playerName);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

    var fizzixwwsWsProto = WebSocket.prototype;
    var fizzixwwsOrigSend = fizzixwwsWsProto.send;
    var fizzixwwsOrigAddEventListener = fizzixwwsWsProto.addEventListener;

    fizzixwwsWsProto.send = function(data) {
        fizzixwwsOrigSend.apply(this, arguments);
        fizzixwwsOrigAddEventListener.call(this, 'message', fizzixwwsHandleWebSocketMessages);
    };

    setInterval(() => {
        xXplayerList.scrollTop += 1;
    }, 50);

    function fizzixwwsSetPinkTheme() {
        document.documentElement.style.setProperty('--bg-gradient-start', '#FFC6D9');
        document.documentElement.style.setProperty('--bg-gradient-end', '#FF9494');
        document.documentElement.style.setProperty('--border-color', '#FF69B4');
        document.documentElement.style.setProperty('--scrollbar-color', '#FF69B4');
        document.documentElement.style.setProperty('--text-color', '#ffe6fb');
        document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.7)');
    }

    function fizzixwwsSetLightOrangeTheme() {
        document.documentElement.style.setProperty('--bg-gradient-start', '#FFD699');
        document.documentElement.style.setProperty('--bg-gradient-end', '#FFB74D');
        document.documentElement.style.setProperty('--border-color', '#FF9800');
        document.documentElement.style.setProperty('--scrollbar-color', '#FF9800');
        document.documentElement.style.setProperty('--text-color', '#fff1c7');
        document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.7)');
    }

    function fizzixwwsSetSkyeBlueTheme() {
        document.documentElement.style.setProperty('--bg-gradient-start', '#A6DAFF');
        document.documentElement.style.setProperty('--bg-gradient-end', '#77BDFE');
        document.documentElement.style.setProperty('--border-color', '#4FC3F7');
        document.documentElement.style.setProperty('--scrollbar-color', '#4FC3F7');
        document.documentElement.style.setProperty('--text-color', '#cffdff');
        document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.7)');
    }

    function fizzixwwsSetGreenTheme() {
        document.documentElement.style.setProperty('--bg-gradient-start', '#7CCD7C');
        document.documentElement.style.setProperty('--bg-gradient-end', '#3F7A3F');
        document.documentElement.style.setProperty('--border-color', '#4CAF50');
        document.documentElement.style.setProperty('--scrollbar-color', '#4CAF50');
        document.documentElement.style.setProperty('--text-color', '#ddffdb');
        document.documentElement.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.7)');
    }

    var fizzixwwsThemeButtonsContainer = document.createElement('div');
    fizzixwwsThemeButtonsContainer.className = 'theme-buttons-container';
    var pinkButton = fizzixwwsCreateThemeButton('pink-button', fizzixwwsSetPinkTheme);
    var lightOrangeButton = fizzixwwsCreateThemeButton('light-orange-button', fizzixwwsSetLightOrangeTheme);
    var skyeBlueButton = fizzixwwsCreateThemeButton('skye-blue-button', fizzixwwsSetSkyeBlueTheme);
    var greenButton = fizzixwwsCreateThemeButton('green-button', fizzixwwsSetGreenTheme);

    fizzixwwsThemeButtonsContainer.appendChild(pinkButton);
    fizzixwwsThemeButtonsContainer.appendChild(lightOrangeButton);
    fizzixwwsThemeButtonsContainer.appendChild(skyeBlueButton);
    fizzixwwsThemeButtonsContainer.appendChild(greenButton);
    document.body.appendChild(fizzixwwsThemeButtonsContainer);

    function fizzixwwsCreateThemeButton(className, onClick) {
        var button = document.createElement('div');
        button.className = 'theme-button ' + className;
        button.onclick = onClick;
        return button;
    }
    var fizzixwwsTextElement = document.createElement('span');
    var fizzixwwsData = atob('YnkgZml6eml4d3c=');
    fizzixwwsTextElement.textContent = fizzixwwsData;
    fizzixwwsTextElement.style.position = 'absolute';
    fizzixwwsTextElement.style.top = '0';
    fizzixwwsTextElement.style.left = '80px';
    fizzixwwsTextElement.style.zIndex = '9999';
    fizzixwwsTextElement.style.color = 'rgba(0, 0, 0, 0.07)';
    document.body.appendChild(fizzixwwsTextElement);
    var fizzixwwsDisplayToggled = false;
    document.addEventListener('keydown', function(event) {
        if (event.key === ';') {
            if (fizzixwwsDisplayToggled) {
                xXplayerList.style.display = 'block';
                fizzixwwsThemeButtonsContainer.style.display = 'flex';
            } else {
                xXplayerList.style.display = 'none';
                fizzixwwsThemeButtonsContainer.style.display = 'none';
            }
            fizzixwwsDisplayToggled = !fizzixwwsDisplayToggled;
        }
    });

    // Function to apply scrollbar styling only when needed
    function fizzixwwsApplyScrollbarStyling() {
        if (xXplayerList.scrollHeight > xXplayerList.clientHeight) {
            var style = document.createElement('style');
            style.textContent = `
                .player-list::-webkit-scrollbar {
                    width: 10px;
                }

                .player-list::-webkit-scrollbar-thumb {
                    background-color: var(--scrollbar-color);
                    border-radius: 5px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    var fizzixwwsStyle = document.createElement('style');
    fizzixwwsStyle.textContent = `
        .player-list {
            font-family: 'Arial', sans-serif;
            position: fixed;
            top: 10%;
            left: 10%;
            padding: 20px;
            background: linear-gradient(to bottom right, var(--bg-gradient-start), var(--bg-gradient-end));
            border: 12px solid var(--border-color);
            border-radius: 20px;
            overflow: auto;
            max-height: 80%;
            scrollbar-width: thin;
            scrollbar-color: var(--scrollbar-color) transparent;
            animation: sway 10s ease-in-out infinite;
            box-shadow: 0 0 20px var(--shadow-color);
        }

        .player-name {
            margin-bottom: 10px;
            color: var(--text-color);
            font-size: 18px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            animation: fadeIn 1.5s ease-out forwards, idle 5s infinite ease-in-out, pulse 2s infinite ease-in-out;
        }

        @keyframes sway {
            0% {
                transform: rotate(-1deg);
            }
            50% {
                transform: rotate(1deg);
            }
            100% {
                transform: rotate(-1deg);
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes idle {
            0% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-2px);
            }
            100% {
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }

        .theme-buttons-container {
            position: fixed;
            top: 10%;
            left: 5%;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .theme-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            background-image: linear-gradient(to bottom right, var(--bg-gradient-start), var(--bg-gradient-end));
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .theme-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .pink-button { background-image: linear-gradient(to bottom right, #FFC6D9, #FF9494); }
        .light-orange-button { background-image: linear-gradient(to bottom right, #FFD699, #FFB74D); }
        .skye-blue-button { background-image: linear-gradient(to bottom right, #A6DAFF, #77BDFE); }
        .green-button { background-image: linear-gradient(to bottom right, #7CCD7C, #3F7A3F); }

        .join-notification {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.3);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.5s, top 0.3s;
        }
    `;
    document.head.appendChild(fizzixwwsStyle);
})();


//some code by cactus that makes homepage look nice
const idsToDelete = ['game-bottom-content', 'da-left', 'da-right', 'game-left-content-main', "game-right-content-main", "discord", 'alsoTryLink', 'cross-promo'];
idsToDelete.forEach(id => {
    const elementToRemove = document.getElementById(id);
    if (elementToRemove) {
        elementToRemove.parentNode.removeChild(elementToRemove);
    } else {
        console.error(`Element with ID ${id} not found!`);
    }
});
const container = document.getElementById('game-content');
const elementToRealign = document.getElementById('game-middle-main');
const leftOffset = (container.offsetWidth - elementToRealign.offsetWidth) / 2;
elementToRealign.style.left = leftOffset + 'px';

function blur() {
    const homepage = document.getElementById("homepage");
    homepage.style.display = "flex";
    const blurValue = 1.5;
    homepage.style.backdropFilter = `blur(${blurValue}px)`;
}
setTimeout(blur, 2000);

(function() {
    'use strict';

    const styleElement = document.head.appendChild(document.createElement('style'));
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(`#cross-promo, #bottom-wrap, #google_play, #game-left-content-main, #game-bottom-content, #game-right-content-main, #right-content { display: none !important; }`));


    const mainContent = document.querySelector('#main-content');
    mainContent.style.width = '100%';

    const popUi = document.getElementById('pop-ui');
    popUi.style.opacity = '0.7';

    const rankingMiddleMain = document.getElementById('ranking-middle-main');
    rankingMiddleMain.style.height = '380px';

    const rankingRanksContainer = document.getElementById('ranking-ranks-container');
    rankingRanksContainer.style.height = '295px';

    const ranking2MiddleMain = document.getElementById('ranking2-middle-main');
    ranking2MiddleMain.style.height = '380px';

    const rankingRankContainer = document.getElementById('ranking-rank-container');
    rankingRankContainer.style.height = '295px';

    const profileLeftMain = document.getElementById('profile-left-main');
    profileLeftMain.style.width = '650px';

    const changeUsername = document.getElementById('change-username');
    changeUsername.style.width = '200px';

    const popBoxes = document.querySelectorAll('.pop-box');
    popBoxes.forEach((box) => {
        box.style.boxShadow = "inset 0 4px 0 #4e564500, inset 0 -4px 0 #38482500, 0px 2px 0 5px rgb(20 20 20 / 0%), 0px 0px 0 15px rgb(20 20 20 / 0%)";
    });
})();


// hi =)) thanks to bear for teaching me about websockets