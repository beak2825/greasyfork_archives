// ==UserScript==
// @name         AtCoderScoreHistogram
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  AtCoderの順位表ページに得点分布を表すヒストグラムを追加します。
// @author       hyyk
// @match        https://atcoder.jp/contests/*/standings*
// @require      https://cdnjs.cloudflare.com/ajax/libs/plotly.js/3.0.1/plotly-cartesian.min.js
// @exclude      https://atcoder.jp/contests/*/standings/json
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462131/AtCoderScoreHistogram.user.js
// @updateURL https://update.greasyfork.org/scripts/462131/AtCoderScoreHistogram.meta.js
// ==/UserScript==

$(function () {
    'use strict';

    window.addEventListener('load', function () {
        vueStandings.$watch('standings', function (newStandings, old) {
            if (!newStandings) {
                return;
            }

            if (old === undefined || old == null) {
                setupInterface();
            } else {
                const activeTask = document.querySelector('li.tab.active');
                if (activeTask !== null) {
                    const taskScreenName = activeTask.getAttribute('value');
                    const drawHistogramHandler = createDrawHistogramHandler(taskScreenName);
                    drawHistogramHandler.handleEvent(false);
                }
            }

        }, { deep: true, immediate: true });
    });
});

function processStandings(standings) {
    let processedStandings = { TaskInfo: {} };

    const taskInfo = standings['TaskInfo'];
    const standingsData = standings['StandingsData'];

    for (const task of taskInfo) {
        const taskScreenName = task['TaskScreenName'];
        processedStandings['TaskInfo'][taskScreenName] = task;
        processedStandings['TaskInfo'][taskScreenName]['ResultInfo'] = {};
    }

    for (const user of standingsData) {
        const userName = user['UserScreenName'];
        for (const [taskScreenName, results] of Object.entries(user['TaskResults'])) {
            const score = results['Score'];
            processedStandings['TaskInfo'][taskScreenName]['ResultInfo'][userName] = {
                'Score': score
            };
        }
    }

    return processedStandings;
}

function setupInterface() {
    document.getElementById('vue-standings').insertAdjacentHTML('beforebegin', `
        <button type="button" id="show-or-hide-hist-btn" class="btn btn-default" style="margin-bottom: 1em;margin-top: 1em;">Show/Hide a histogram</button>
        <div id="hist-container" style="margin-bottom: 1em;padding: 1em;background-color: #fff;border: 1px solid #ddd;" hidden>
            <ul id="tab-bar" style="border-bottom: 1px solid #ddd;display: flex;flex-wrap: wrap;padding-left: 0px;"></ul>
            <div id="hist-heading" style="display:flex;">
                <div style="flex:1;margin-right:5px;">
                    <div style="display:flex;align-items:end;flex-wrap:wrap;flex:1;">
                        <div style="margin-right:5px;flex:1">
                            <label for="usernames-input">Usernames</label>
                            <input type="text" name="usernames-input" class="form-control" id="user-names" placeholder="username1, username2, ..." style="min-width:200px;">
                        </div>
                        <button id="hist-update-btn" class="btn btn-primary" style="height:35px;">Update</button>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                        <p id="invalid-users" style="color: red;text-wrap:wrap;min-height:25px;"></p>
                    </div>
                </div>
            </div>
            <div id="hist-area"></div>
        </div>
    `);

    const processedStandings = processStandings(vueStandings.standings);
    const tabBar = document.getElementById('tab-bar');

    for (const [taskScreenName, info] of Object.entries(processedStandings['TaskInfo'])) {
        const assignment = info['Assignment'];
        tabBar.insertAdjacentHTML('beforeend', `
            <li class="tab"
                style="border: 1px solid transparent;list-style: none;margin-bottom: -1px;padding: 0.4em 0.7em;cursor: pointer;color: #337ab7;"
                value="${taskScreenName}">${assignment}
            </li>
        `);
    }

    document.querySelectorAll('li.tab').forEach((tab) => {
        const taskScreenName = tab.getAttribute('value');
        const drawHistogramHandler = createDrawHistogramHandler(taskScreenName);

        tab.addEventListener('click', tabSwitch);
        tab.addEventListener('click', drawHistogramHandler);
    });


    document.getElementById('hist-update-btn').addEventListener('click', function () {
        const activeTab = document.querySelector('li.tab.active')
        if (activeTab !== null) {
            const taskScreenName = activeTab.getAttribute('value');
            const drawHistogramHandler = createDrawHistogramHandler(taskScreenName);
            drawHistogramHandler.handleEvent(false);
        }
    });

    const showOrHideHistogramButton = document.getElementById('show-or-hide-hist-btn');
    const histogramContainer = document.getElementById('hist-container');

    showOrHideHistogramButton.addEventListener('click', function () {
        if (histogramContainer.hasAttribute('hidden') === true) {
            const refreshButton = document.getElementById('refresh');
            if (refreshButton !== null) {
                const histogramHeading = document.getElementById('hist-heading');
                let refreshButtonArea = refreshButton.parentNode;
                refreshButtonArea.setAttribute('style', 'flex: 0.3; text-align: right;');
                refreshButtonArea.querySelector('#last-refresh').setAttribute('style', 'display: block;');

                histogramHeading.insertAdjacentElement('beforeend', refreshButtonArea.parentNode.removeChild(refreshButtonArea));
            }

            histogramContainer.removeAttribute('hidden');

            if (tabBar.firstChild !== null) {
                tabBar.firstElementChild.click();
            }
        } else {
            histogramContainer.setAttribute('hidden', "");
        }
    });
}

function createDrawHistogramHandler(taskScreenName) {
    return {
        taskScreenName: taskScreenName,
        histogramArea: 'hist-area',
        processedStandings: processStandings(vueStandings.standings),
        handleEvent: drawHistogram
    };
}

function tabSwitch() {
    const activeTab = document.querySelector('li.tab.active')
    if (activeTab !== null) {
        activeTab.classList.remove('active');
        activeTab.setAttribute('style', 'border: 1px solid transparent;list-style: none;margin-bottom: -1px;padding: 0.4em 0.7em;cursor: pointer;color: #337ab7;')
    }

    this.classList.add('active');
    this.setAttribute('style', 'border: 1px solid transparent;list-style: none;margin-bottom: -1px;padding: 0.4em 0.7em;cursor: pointer;color: #337ab7;border-left: 1px solid #ccc;border-right: 1px solid #ccc;border-top: 1px solid #ccc;border-bottom: 1px solid #fff;background-color: #fff;');
}

function formatScore(maxScore, num, sigfig) {
  const units = [
    { value: 1e15, suffix: 'Q' }, // quadrillion
    { value: 1e12, suffix: 'T' }, // trillion
    { value: 1e9, suffix: 'B' },  // billion
    { value: 1e6, suffix: 'M' },  // million
    { value: 1e3, suffix: 'K' }   // thousand
  ];

  for (const unit of units) {
    if (maxScore >= unit.value) {
      const scaled = num / unit.value;
      return `${formatWithSigFig(scaled, sigfig)}${unit.suffix}`;
    }
  }

  // 1000未満はそのまま表示（整数）
  return num.toString();
}

// 有効数字n桁でフォーマットする関数
function formatWithSigFig(num, sigFig) {
  if (num === 0) return '0';
  const digits = Math.ceil(Math.log10(Math.abs(num)));
  const decimals = Math.max(sigFig - digits, 0);
  return num.toFixed(decimals);
}

function drawHistogram(isNewPlot=true) {
    const userNames = document.getElementById('user-names').value;

    const taskInfo = this.processedStandings['TaskInfo'][this.taskScreenName];
    const taskAssignment = taskInfo['Assignment'];

    let scores = [];
    for (const userName in taskInfo['ResultInfo']) {
        scores.push(taskInfo['ResultInfo'][userName]['Score']);
    }

    const maxScore = scores.reduce((a,b) =>{return Math.max(a,b);}) / 100

    const layout = {
        font: { size: 14 },
        plot_bgcolor: "rgb(250, 250, 250)",
        xaxis: {
            title: {
                text: "Score"
            },
            minallowed:0
        },
        yaxis: {
            title: {
                text: "Frequency"
            },
            minallowed:0
        },
        title: this.histogramArea === 'hist-for-png' ? 'Problem ' + taskAssignment : '',
        shapes: [],
        autosize: true,
        margin: {
            t: 30,
        },
        height: 350,
        uirevision: "true",
    };

    const traceOfScore = {
        x: scores.map(x => x / 100),
        type: "histogram",
        name: "cumulative",
        marker: {
            color: "#c4ecec",
            line: {
                color: "#000000",
                width: 0.03
            }
        },
        nbinsx: 30
    };

    const data = [traceOfScore];
    const config = { responsive: true, modeBarButtonsToRemove: ['select2d','lasso2d'] };

    layout.annotations = [];

    if (userNames !== '') {
        const colors = [
            "#ff1111",
            "#0011a3",
            "#bfbf00",
            "#a55111",
            "#000fff",
            "#999999",
            "#ff00ff",
            "#dd0000",
            "#ff7777",
            "#000000",
        ];
        const userNameList = Array.from(new Set(userNames.split(',').map(s => s.trim())));
        const resultInfo = taskInfo['ResultInfo'];

        let userNameListLength = userNameList.length;
        let loop = 0;
        let invalidUsers = [];

        for (const userName of userNameList) {
            if (!(userName in resultInfo)) {
                invalidUsers.push(userName);
                userNameListLength--;
            }
        }

        for (const userName of userNameList) {
            if (!(userName in resultInfo)) {
                continue;
            }

            const userLine = {
                type: "line",
                x0: resultInfo[userName]['Score'] / 100,
                y0: 0,
                x1: resultInfo[userName]['Score'] / 100,
                y1: 1,
                yref: "paper",
                line: {
                    color: colors[loop],
                    width: 1.8
                }
            };

            const annotation = {
                showarrow: true,
                text: userName + '<br>' + formatScore(maxScore, resultInfo[userName]['Score'] / 100, 4),
                x: resultInfo[userName]['Score'] / 100,
                yref: "paper",
                y: loop / userNameListLength,
                ax: 5,
                align: "left",
                xanchor: "left",
                yanchor: "bottom",
                font: {
                    color: colors[loop],
                    size: 12
                }
            };

            layout["shapes"].push(userLine);
            layout.annotations.push(annotation);
            loop++;
        }

        if (invalidUsers.length !== 0) {
            document.getElementById('invalid-users').textContent = 'Invalid usernames: ' + invalidUsers.join(', ');
        } else {
            document.getElementById('invalid-users').textContent = ''
        }
    }

    isNewPlot ? Plotly.newPlot(this.histogramArea, data, layout, config) : Plotly.react(this.histogramArea, data, layout, config);
}
