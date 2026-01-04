// ==UserScript==
// @name         修復Apexlegendsstatus的Total Score計算
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  如題
// @author       You
// @match        https://apexlegendsstatus.com/tournament/organizer/*
// @match        https://apexlegendsstatus.com/tournament/results/*/Overview
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apexlegendsstatus.com
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500506/%E4%BF%AE%E5%BE%A9Apexlegendsstatus%E7%9A%84Total%20Score%E8%A8%88%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/500506/%E4%BF%AE%E5%BE%A9Apexlegendsstatus%E7%9A%84Total%20Score%E8%A8%88%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cssStyles = `
        .custom-settings-button {
            background-color: #ff6347;
            float: right;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: -5px 5px 0px 5px;
        }
        .custom-label {
            font-size: 16px;
            font-weight: bold;
        }
        .custom-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            width: 50%;
            max-width: 600px;
            border-radius: 10px;
            display: none;
            transition: opacity 0.4s, visibility 0.4s;
            z-index: 1001;
        }
        .custom-modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: none;
        }
        .custom-textarea {
            margin: 10px;
            width: 100%;
            height: 200px;
            resize: vertical;
        }
        .custom-save-button {
            margin: -5px 5px 0px 5px;
            padding: 0px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `;

    const getRows = function() {
        let rows = [];
        let table = document.getElementById(exportBtns[0].getAttribute("data-exportTableId"));
        let isFirstRow = true;

        for (let i = 0; i < table.rows.length; i++) {
            let row = [];
            let cells = table.rows[i].cells;

            let replaceWith = isFirstRow ? "Rank" : "";

            for (let j = 0; j < cells.length; j++) {
                row.push(cells[j].innerText.replace('#', replaceWith).trim().replace(',', ''));
            }

            isFirstRow = false;

            rows.push(row);
        }
        return rows;
    }

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = cssStyles;
    document.head.appendChild(styleSheet);


    if (window.location.pathname.startsWith('/tournament/organizer/')) {
        addCopyValuesButton();
    }


    if (window.location.pathname.match(/\/tournament\/results\/.*\/Overview/)) {
        addSettingsButton();
        verifyAndCorrectScores();
    }

    function verifyAndCorrectScores() {
        const matchId = window.location.pathname.split('/')[3];
        const scoringConfig = JSON.parse(localStorage.getItem(`scoringConfig-${matchId}`));
        const rows = getRows();

        rows.forEach(row => {
            let teamName = row[1];
            let totalPlacementScore = 0;
            let totalKillsScore = 0;
            for (let i = 3; i < row.length; i += 2) {
                let placement = parseInt(row[i]);
                let kills = parseInt(row[i + 1]);
                totalPlacementScore += parseInt(scoringConfig[`placement-${placement}`] || 0);
                totalKillsScore += kills * parseInt(scoringConfig['kills']);
            }
            let totalScore = totalPlacementScore + totalKillsScore;

            document.querySelectorAll('#scoreGridExportAnchor .row:not(.recapHeader)').forEach(div => {
                let teamDiv = div.querySelector('p.recapScoreTeamName-team');
                if (teamDiv && teamDiv.textContent.trim() === teamName.trim()) {
                    let scoreDiv = div.children[2];
                    let killsDiv = div.children[3];
                    if (scoreDiv && scoreDiv.textContent !== totalScore.toString()) {
                        scoreDiv.title = '原先分數爲' + scoreDiv.innerText;
                        scoreDiv.textContent = totalScore;
                        scoreDiv.style.color = 'green';
                    }
                    if (killsDiv && killsDiv.textContent !== totalKillsScore.toString()) {
                        killsDiv.title = '原先分數爲' + killsDiv.innerText;
                        killsDiv.textContent = totalKillsScore;
                        killsDiv.style.color = 'green';
                    }
                }
            });
        });


        let divs = Array.from(document.querySelectorAll('#scoreGridExportAnchor .row:not(.recapHeader)'));
        divs.sort((a, b) => {
            let scoreA = a.children[2] ? parseInt(a.children[2].textContent) : 0;
            let scoreB = b.children[2] ? parseInt(b.children[2].textContent) : 0;
            let killsA = a.children[3] ? parseInt(a.children[3].textContent) : 0;
            let killsB = b.children[3] ? parseInt(b.children[3].textContent) : 0;
            return scoreB - scoreA || killsB - killsA;
        });


        const parentDivs = document.querySelectorAll('.col-xxl-6.col-xl-6.col-lg-6.col-md-12.col-sm-12.col-xs-12');
        parentDivs.forEach(div => div.innerHTML = '');


        const headerHTML = '<div class="row g-0 recapHeader"><div class="col-1 d-flex justify-content-center align-items-center">#</div><div class="col-9 d-flex justify-content-center align-items-center"></div><div class="col-1 d-flex justify-content-center align-items-center">Points</div><div class="col-1 d-flex justify-content-center align-items-center">Kills</div></div>';
        parentDivs.forEach(div => div.innerHTML += headerHTML);


        const half = Math.ceil(divs.length / 2);
        divs.forEach((div, index) => {
            if (index < half) {
                parentDivs[0].appendChild(div);
            } else {
                parentDivs[1].appendChild(div);
            }
            div.children[0].textContent = index + 1;
        });
    }

    function addCopyValuesButton() {
        window.addEventListener('load', function() {
            var updateButton = document.getElementById('ScoreUpdate');
            if (updateButton) {
                var copyButton = document.createElement('button');
                copyButton.className = 'als-button-small organizer-notFound smallBtnPadding';
                copyButton.style.cssText = 'background-color: #4caf50; margin-left: 10px;';
                copyButton.innerHTML = '<i class="fa-regular fa-circle-check"></i> 複製數值';
                copyButton.type = 'button';
                updateButton.parentNode.insertBefore(copyButton, updateButton.nextSibling);
                copyButton.addEventListener('click', function() {
                    var form = document.querySelector('form[action="/tournament/local-api/updateScore"]');
                    if (form) {
                        var formData = new FormData(form);
                        var postData = {};
                        formData.forEach(function(value, key) {
                            postData[key] = value;
                        });
                    }

                    var postDataString = JSON.stringify(postData);

                    navigator.clipboard.writeText(postDataString).then(function() {
                        console.log('Data copied to clipboard successfully!');
                    }, function(err) {
                        console.error('Could not copy text: ', err);
                    });
                    copyButton.innerHTML = '<i class="fa-regular fa-circle-check"></i> 成功複製';
                    setTimeout(function() {
                        copyButton.innerHTML = '<i class="fa-regular fa-circle-check"></i> 複製數值';
                }, 800);
            });
            }
        });
    }

    function addSettingsButton() {
        window.addEventListener('load', function() {
            var headerAnchor = document.getElementById('headerAnchor');
            if (headerAnchor) {
                var settingsButton = document.createElement('button');
                settingsButton.className = 'custom-settings-button';
                settingsButton.innerHTML = '<i class="fa fa-cog"></i>';
                headerAnchor.appendChild(settingsButton);
            }

            var backdrop = document.createElement('div');
            backdrop.className = 'custom-modal-backdrop';
            document.body.appendChild(backdrop);

            var modal = document.createElement('div');
            modal.className = 'custom-modal';
            document.body.appendChild(modal);

            var labelAndButtonContainer = document.createElement('div');
            labelAndButtonContainer.className = 'custom-label-and-button';
            modal.appendChild(labelAndButtonContainer);

            var textarea = document.createElement('textarea');
            textarea.className = 'custom-textarea';
            var uniqueKey = 'scoringConfig-' + window.location.pathname.split('/')[3];
            textarea.value = localStorage.getItem(uniqueKey) || '';
            modal.appendChild(textarea);

            var label = document.createElement('label');
            label.className = 'custom-label';
            label.textContent = 'Scoring configuration:';
            labelAndButtonContainer.appendChild(label);

            var saveButton = document.createElement('button');
            saveButton.className = 'custom-save-button';
            saveButton.innerHTML = 'Save';
            saveButton.addEventListener('click', function() {
                localStorage.setItem(uniqueKey, textarea.value);
                saveButton.innerHTML = '儲存成功';
                setTimeout(function() {
                    saveButton.innerHTML = 'Save';
                }, 800);
            });
            labelAndButtonContainer.appendChild(saveButton);

            settingsButton.addEventListener('click', function() {
                modal.style.display = 'block';
                backdrop.style.display = 'block';
                modal.style.opacity = '1';
                modal.style.visibility = 'visible';
                verifyAndCorrectScores();
            });

            backdrop.addEventListener('click', function() {
                modal.style.display = 'none';
                backdrop.style.display = 'none';
            });
        });
    }
})();