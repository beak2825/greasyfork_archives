// ==UserScript==
// @name         UHL Scoreboard
// @version      2.4
// @description  Wow. Old code, but working scoreboard
// @author       darius
// @match        https://www.haxball.com/play*
// @grant        none
// @namespace    uhlscoreboardseason5
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507368/UHL%20Scoreboard.user.js
// @updateURL https://update.greasyfork.org/scripts/507368/UHL%20Scoreboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settingsMoved = false;
    let scoreboardSettingsCreated = false;
    let addMinutesToTimer = 0;
    let swapGoals = false;
    let addedGoalsToTheLeftTeam = 0;
    let addedGoalsToTheRightTeam = 0;

    // Функція для перевірки і модифікації елементів
    function checkAndModifyElements() {
        // Видалення div з класом rightbar на головній сторінці
        const rightbar = document.querySelector('.rightbar');
        if (rightbar) {
            rightbar.remove();
        }

        // Отримання iframe з класом gameframe
        const iframe = document.querySelector('.gameframe');
        if (iframe) {
            // Спроба доступу до документу iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // Приховування div з класом bar-container всередині iframe
            const barContainer = iframeDoc.querySelector('.bar-container');
            if (barContainer) {
                barContainer.style.display = "none";
            }

            if (document.body.classList.contains('hb-playing') && iframeDoc.querySelector('.showing-room-view')) {
                const streamerSettings = document.createElement('button');
                streamerSettings.setAttribute('data-hook', 'scoreboard-settings');
                streamerSettings.textContent = 'Scoreboard';
                streamerSettings.addEventListener('click', function() {
                    const scoreboardSettingsContainer = iframeDoc.querySelector('div[data-hook="popups"].scoreboard-popups');
                    scoreboardSettingsContainer.style.display = 'flex';
        });

                if (!scoreboardSettingsCreated) {
                    createScoreboardSettings();
                    scoreboardSettingsCreated = true;
                }

                const linkBtn = iframeDoc.querySelector('button[data-hook="link-btn"]');
                const settingsToMove = iframeDoc.querySelector('.buttons button[data-hook="settings"]'); // Змініть на ваш клас або id
                const settingsText = document.createElement('span');
                if (!settingsMoved) {
                    settingsText.textContent = "Settings";
                    settingsToMove.appendChild(settingsText);
                    iframeDoc.querySelector('.sound-button-container').style.marginRight = '0px';
                    settingsMoved = true;
                }

                if (settingsToMove && linkBtn) {
                    // Знайти новий контейнер, куди ви хочете перемістити div
                    const menuContainer = iframeDoc.querySelector('div.header-btns'); // Змініть на ваш id контейнера

                    if (menuContainer) {
                        // Перемістити div в новий контейнер
                        menuContainer.insertBefore(streamerSettings, linkBtn);
                        menuContainer.insertBefore(settingsToMove, streamerSettings);
                    }
                }

                const topButtonsChecking = iframeDoc.querySelectorAll('.buttons');
                topButtonsChecking[3].style.display = 'flex';

                const ping = iframeDoc.querySelector('p[data-hook="ping"]');
                ping.style.display = 'flex';
                const fps = iframeDoc.querySelector('p[data-hook="fps"]');
                fps.style.display = 'flex';
                const pingGraph = iframeDoc.querySelector('div.graph');
                pingGraph.style.display = 'flex';
                const pingViewDiv = iframeDoc.querySelector('div.stats-view');
                pingViewDiv.style.backgroundColor = 'rgba(26,33,37,.3)';

                const menuButtonCheck = iframeDoc.querySelector('button[data-hook="menu"]');
                menuButtonCheck.style.display = 'none';

            } else if (!iframeDoc.querySelector('.showing-room-view')) {
                const topButtonsChecking = iframeDoc.querySelectorAll('.buttons');
                topButtonsChecking.forEach(div => {
                    if (div.querySelector('button[data-hook="menu"]')) {
                        div.style.display = 'none';
                    }
                });
                const ping = iframeDoc.querySelector('p[data-hook="ping"]');
                ping.style.display = 'none';
                const fps = iframeDoc.querySelector('p[data-hook="fps"]');
                fps.style.display = 'none';
                const pingGraph = iframeDoc.querySelector('div.graph');
                pingGraph.style.display = 'none';
                const pingViewDiv = iframeDoc.querySelector('div.stats-view');
                pingViewDiv.style.backgroundColor = 'transparent';
            } else {
                scoreboardSettingsCreated = false;
                settingsMoved = false;
                addMinutesToTimer = 0;
            }
        }
    }

    function createScoreboardSettings() {
        const scoreboard = document.createElement('div');
        scoreboard.setAttribute('data-hook', 'popups');
        scoreboard.style.display = 'none';
        scoreboard.className = 'scoreboard-popups';
        // Отримання iframe з класом gameframe
        const iframe = document.querySelector('.gameframe');
        if (iframe) {
            // Спроба доступу до документу iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const gameView = iframeDoc.querySelector('.game-view');
            gameView.appendChild(scoreboard);
            scoreboard.innerHTML = `
        <div class="dialog settings-view scoreboard-view">
   <h1>Scoreboard Settings</h1>
   <button data-hook="close">Close</button>
   <div class="tabcontents">
      <div class="section selected" data-hook="scoreboardsec">
        <div data-hook="sb-left-team-logo">Left team logo:
          <select data-hook="chatbgmode">
              <option value="red.png">Select team</option>
              <option value="4_raky_i_tolias.png">4 раки і толяс</option>
              <option value="okay_team.png">Okay Team</option>
              <option value="ratas.png">Ratas</option>
              <option value="sim_23.png">Sim 23</option>
              <option value="salo_team.png">Sало Team</option>
              <option value="tothemoon.png">ToTheMoon</option>
              <option value="young_raky.png">Young Raky</option>
              <option value="agov_team.png">АГОВ ТЕАМ</option>
              <option value="zhmerynka_city.png">Жмеринка Сіті</option>
              <option value="zhmerynka_united.png">Жмеринка Юнайтед</option>
              <option value="kurochky.png">Курочки</option>
              <option value="mriya.png">Мрія</option>
              <option value="severnaia_bratva.png">Северная братва</option>
              <option value="hk_triuki.png">ХК ТРЮКІ</option>
          </select>
        </div>
        <div data-hook="sb-right-team-logo">Right team logo:
          <select data-hook="chatbgmode">
              <option value="blue.png">Select team</option>
              <option value="4_raky_i_tolias.png">4 раки і толяс</option>
              <option value="okay_team.png">Okay Team</option>
              <option value="ratas.png">Ratas</option>
              <option value="sim_23.png">Sim 23</option>
              <option value="salo_team.png">Sало Team</option>
              <option value="tothemoon.png">ToTheMoon</option>
              <option value="young_raky.png">Young Raky</option>
              <option value="agov_team.png">АГОВ ТЕАМ</option>
              <option value="zhmerynka_city.png">Жмеринка Сіті</option>
              <option value="zhmerynka_united.png">Жмеринка Юнайтед</option>
              <option value="kurochky.png">Курочки</option>
              <option value="mriya.png">Мрія</option>
              <option value="severnaia_bratva.png">Северная братва</option>
              <option value="hk_triuki.png">ХК ТРЮКІ</option>
          </select>
        </div>
        <div data-hook="sb-add-goals-to-left-team">Add goals to the left team:<input data-hook="input-left-team-goals" type="number" value=0></div>
        <div data-hook="sb-add-goals-to-right-team">Add goals to the right team:<input data-hook="input-right-team-goals" type="number" value=0></div>
        <div data-hook="sb-add-minutes-to-timer">Add minutes to the timer:<input data-hook="input-timer-minutes" type="number" value=0></div>
        <div data-hook="sb-swap-goals"><button data-hook="sb-swap-goals-btn">Swap the goals (for the 2nd half)</button><p data-hook="goals-swapped-text">Зараз голи зараховуються звичайно</p></div>
      </div>
   </div>
</div>
            `;
            const closeBtn = iframeDoc.querySelector('.scoreboard-view button[data-hook="close"]');
            closeBtn.addEventListener('click', function() {
                const scoreboardSettingsContainer = iframeDoc.querySelector('div[data-hook="popups"].scoreboard-popups');
                scoreboardSettingsContainer.style.display = 'none';
            });

            const selectLeft = iframeDoc.querySelector('.scoreboard-view [data-hook="sb-left-team-logo"] [data-hook="chatbgmode"]');
            selectLeft.addEventListener('change', function() {
                document.body.querySelector('img.left-logo').setAttribute('src', `https://raw.githubusercontent.com/dariusua/UHL8/main/${selectLeft.value}`);
            });

            const selectRight = iframeDoc.querySelector('.scoreboard-view [data-hook="sb-right-team-logo"] [data-hook="chatbgmode"]');
            selectRight.addEventListener('change', function() {
                document.body.querySelector('img.right-logo').setAttribute('src', `https://raw.githubusercontent.com/dariusua/UHL8/main/${selectRight.value}`);
            });

            const addMinutesToTimerSetting = iframeDoc.querySelector('.scoreboard-view [data-hook="sb-add-minutes-to-timer"] [data-hook="input-timer-minutes"]');
            addMinutesToTimerSetting.addEventListener('input', function() {
                if (addMinutesToTimerSetting.value != "") addMinutesToTimer = parseInt(addMinutesToTimerSetting.value)
                else {
                    addMinutesToTimerSetting.value = 0
                }
            });

            const swapGoalsButton = iframeDoc.querySelector('button[data-hook="sb-swap-goals-btn"]');
            swapGoalsButton.addEventListener('click', function() {
                swapGoals = !swapGoals;
                let swapGoalsText = iframeDoc.querySelector('p[data-hook="goals-swapped-text"]');
                if (swapGoals) swapGoalsText.textContent = "Зараз голи зараховуються дзеркально"
                else swapGoalsText.textContent = "Зараз голи зараховуються звичайно"
            });

            const addGoalsToTheLeftTeam = iframeDoc.querySelector('[data-hook="input-left-team-goals"]');
            addGoalsToTheLeftTeam.addEventListener('input', function() {
                if (addGoalsToTheLeftTeam.value != "") addedGoalsToTheLeftTeam = parseInt(addGoalsToTheLeftTeam.value)
                else {
                    addGoalsToTheLeftTeam.value = 0
                }
            });

            const addGoalsToTheRightTeam = iframeDoc.querySelector('[data-hook="input-right-team-goals"]');
            addGoalsToTheRightTeam.addEventListener('input', function() {
                if (addGoalsToTheRightTeam.value != "") addedGoalsToTheRightTeam = parseInt(addGoalsToTheRightTeam.value)
                else {
                    addGoalsToTheRightTeam.value = 0
                }
            });
        }
    }

    // Перевірка наявності класу hb-playing у body
    function updateScoreboardVisibility() {
        const body = document.body;
        const scoreboard = document.querySelector('#UHLTopBar');
        // Отримання iframe з класом gameframe
        const iframe = document.querySelector('.gameframe');
        if (iframe) {
            // Спроба доступу до документу iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const gameStateView = iframeDoc.querySelector('.game-state-view');

            // Перевірка умов для видимості scoreboard
            const shouldShowScoreboard = body.classList.contains('hb-playing') &&
                  gameStateView;

            if (shouldShowScoreboard) {
                if (scoreboard) {
                    scoreboard.style.display = 'flex'; // Показати scoreboard
                }
            } else {
                if (scoreboard) {
                    scoreboard.style.display = 'none'; // Сховати scoreboard
                }
            }
        }
    }

    setInterval(() => {
        checkAndModifyElements();
        updateScoreboardVisibility();
    }, 50);

    const topBarHeight = 70; // Set the height of the top bar

    // Raw URLs for the font files
    const nasalizationFontURL = 'https://github.com/dariusua/UHL8/blob/main/nasalization.otf';
    const neuropoliticalFontURL = 'https://raw.githubusercontent.com/dariusua/UHL8/main/neuropolitical.ttf';
    const phonkFontURL = 'https://raw.githubusercontent.com/dariusua/UHL8/main/Phonk.otf';

    const gradientFirst = '#027dfe'
    const gradientSecond = '#00c0fe'

    const BACKGROUND_URL = 'https://raw.githubusercontent.com/dariusua/UHL8/refs/heads/main/8_season_bg2.png';

    // Function to modify the game frame and add a custom top bar
    function createScoreboard() {
        const gameFrame = document.querySelector('.gameframe');

        if (gameFrame) {
            // Add custom fonts using @font-face
            const fontStyle = document.createElement('style');
            fontStyle.textContent = `
                @font-face {
                    font-family: 'Nasalization';
                    src: url('${nasalizationFontURL}') format('opentype');
                    font-weight: normal;
                    font-style: normal;
                }
                @font-face {
                    font-family: 'Neuropolitical';
                    src: url('${neuropoliticalFontURL}') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
                @font-face {
                    font-family: 'Phonk';
                    src: url('${phonkFontURL}') format('opentype');
                    font-weight: normal;
                    font-style: normal;
                }
            `;
            document.head.appendChild(fontStyle);

            // Create the top bar
            const topBar = document.createElement('div');
            topBar.id = 'UHLTopBar';
            topBar.style.position = 'absolute';
            topBar.style.top = '0';
            topBar.style.left = '0';
            topBar.style.width = '100%';
            topBar.style.height = `${topBarHeight}px`; // Use variable for height
            topBar.style.background = `url(${BACKGROUND_URL}) top center/cover no-repeat`;
            topBar.style.zIndex = '1000'; // Ensure it is on top
            topBar.style.display = 'none';
            topBar.style.alignItems = 'center';
            topBar.style.boxShadow = '0px 1px 24px 0px rgba(0,0,0,0.4)';

            // Section 1: UHL TV text
            const uhlTvText = document.createElement('div');
            uhlTvText.textContent = 'UHL TV';
            uhlTvText.style.color = '#ff62cd';
            uhlTvText.style.fontWeight = 'bold';
            uhlTvText.style.width = '30%'; // Occupies 1/4 of the width
            uhlTvText.style.textAlign = 'center';
            uhlTvText.style.fontFamily = "'Phonk', sans-serif"; // Apply Phonk font
            uhlTvText.style.fontSize = '40px'; // Increase text size
            uhlTvText.style.textShadow = '2px 2px 6px rgba(0,0,0,0.5)';

            // Section 2: Scoreboard
            const scoreboard = document.createElement('div');
            scoreboard.style.background = `url(${BACKGROUND_URL}) bottom center / cover no-repeat`,
            scoreboard.style.position = 'relative';
            scoreboard.style.color = 'white';
            scoreboard.style.height = `${topBarHeight + 45}px`; // Extend down by 45px
            scoreboard.style.bottom = '-22px'; // Pull down 22px from the top bar
            scoreboard.style.border = '3px solid rgba(255, 98, 205, 0.9)';
            scoreboard.style.borderRadius = '0 0 45px 45px'; // Rounded bottom corners
            scoreboard.style.display = 'flex';
            scoreboard.style.justifyContent = 'center';
            scoreboard.style.alignItems = 'center';
            scoreboard.style.width = '40%'; // Occupies 2/4 of the width
            scoreboard.style.padding = '0 40px'; // Reduced padding to move logos closer to the score
            scoreboard.style.margin = '0 auto'; // Center it horizontally
            scoreboard.style.fontFamily = "'Neuropolitical', sans-serif"; // Apply Neuropolitical font
            scoreboard.style.fontSize = '60px'; // Increase text size for score

            // Team logos and score
            const teamLogo1 = document.createElement('img');
            teamLogo1.className = "left-logo"
            teamLogo1.style.height = '100px'; // Set the height to 80px
            teamLogo1.style.width = 'auto'; // Set the width to auto
            teamLogo1.style.marginLeft = '15%'; // Adjust margin to 15% to make logos closer to score
            teamLogo1.style.borderRadius = '10px';

            const score = document.createElement('div');
            score.style.textAlign = 'center';
            score.style.color = '#ff62cd';
            score.style.fontSize = '70px'; // Increase font size to 60px
            score.style.width = 'auto'; // Set width to auto to fit the text
            score.style.wordSpacing = '40px';
            score.style.display = 'flex';

            const leftScore = document.createElement('span');
            leftScore.id = 'leftScore';
            leftScore.textContent = '0';
            leftScore.style.width = '150px';
            const betweenScore = document.createElement('span');
            betweenScore.textContent = '-';
            const rightScore = document.createElement('span');
            rightScore.id = 'rightScore';
            rightScore.textContent = '0';
            rightScore.style.width = '150px';

            score.appendChild(leftScore);
            score.appendChild(betweenScore);
            score.appendChild(rightScore);

            const teamLogo2 = document.createElement('img');
            teamLogo2.className = "right-logo"
            teamLogo2.style.height = '100px'; // Set the height to 80px
            teamLogo2.style.width = 'auto'; // Set the width to auto
            teamLogo2.style.marginRight = '15%'; // Adjust margin to 15% to make logos closer to score
            teamLogo2.style.borderRadius = '10px';

            scoreboard.appendChild(teamLogo1);
            scoreboard.appendChild(score);
            scoreboard.appendChild(teamLogo2);

            // Section 3: Timer
            const timer = document.createElement('div');
            timer.id = 'timer';
            timer.textContent = '00:00';
            timer.style.color = '#ff57d1';
            timer.style.width = '30%'; // Occupies 1/4 of the width
            timer.style.textAlign = 'center';
            timer.style.fontFamily = "'Nasalization', sans-serif"; // Apply Nasalization font
            timer.style.fontSize = '40px'; // Increase text size

            // Append sections to the top bar
            topBar.appendChild(uhlTvText);
            topBar.appendChild(scoreboard);
            topBar.appendChild(timer);

            // Adjust the game frame
            gameFrame.style.position = 'absolute';
            gameFrame.style.top = `${topBarHeight}px`; // Position it below the top bar
            gameFrame.style.height = `calc(100% - ${topBarHeight}px)`; // Adjust the height to be 70px less

            // Append the top bar to the body
            document.body.appendChild(topBar);
        }
    }

    // Функція для оновлення рахунку і таймера
    function updateScoresAndTimer() {
        var iframe = document.querySelector("iframe.gameframe");

        if (iframe) {
            try {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                var redScoreDiv = iframeDoc.querySelector('div[data-hook="red-score"]');
                var blueScoreDiv = iframeDoc.querySelector('div[data-hook="blue-score"]');
                var gameTimerView = iframeDoc.querySelector('.game-timer-view');
                var startGameBtn = iframeDoc.querySelector('button[data-hook="start-btn"]');

                if (startGameBtn && !startGameBtn.hasAttribute('hidden')) {
                    document.querySelector('#leftScore').textContent = parseInt(addedGoalsToTheLeftTeam);
                    document.querySelector('#rightScore').textContent = parseInt(addedGoalsToTheRightTeam);
                    var minutes1 = parseInt(addMinutesToTimer);
                    if (minutes1 < 10) {
                        minutes1 = `0${minutes1}`
                    }
                    document.getElementById('timer').textContent = `${minutes1}:00`;
                } else {
                    if (redScoreDiv && blueScoreDiv && gameTimerView) {
                        // Отримати значення з div
                        var redScore = redScoreDiv.textContent.trim();
                        var blueScore = blueScoreDiv.textContent.trim();

                        // Оновити текст рахунку
                        document.querySelector('#leftScore').textContent = parseInt((!swapGoals ? redScore : blueScore)) + parseInt(addedGoalsToTheLeftTeam);
                        document.querySelector('#rightScore').textContent = parseInt((!swapGoals ? blueScore : redScore)) + parseInt(addedGoalsToTheRightTeam);


                        // Отримати значення таймера з span елементів
                        var digits = gameTimerView.querySelectorAll('.digit');
                        if (digits.length === 4) {
                            var minutes = `${digits[0].textContent}${digits[1].textContent}`;
                            minutes = parseInt(minutes) + parseInt(addMinutesToTimer)
                            if (minutes < 10) {
                                minutes = `0${minutes}`
                            }
                            var seconds = `${digits[2].textContent}${digits[3].textContent}`;
                            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
                        }
                    }
                }
            } catch (error) {
                console.error('Помилка доступу до iframe:', error);
            }
        } else {
            console.error('Iframe не знайдено');
        }
    }

    // Створення таблиці рахунку при завантаженні сторінки
    createScoreboard();

    // Оновлювати рахунок і таймер кожні 100 мс
    setInterval(updateScoresAndTimer, 100);
})();