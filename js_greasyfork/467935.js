// ==UserScript==
// @name         Challonge智慧大头
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  导出Challonge赛事结果为固定格式的CSV表格
// @author       Kulanx
// @match        https://challonge.com/*
// @connect      api.challonge.com
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @resource     ELEMENT_UI    https://unpkg.com/element-ui/lib/theme-chalk/index.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/467935/Challonge%E6%99%BA%E6%85%A7%E5%A4%A7%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/467935/Challonge%E6%99%BA%E6%85%A7%E5%A4%A7%E5%A4%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let nanoid = (t = 21) => { let e = "", r = crypto.getRandomValues(new Uint8Array(t)); for (; t--;) { let n = 63 & r[t]; e += n < 36 ? n.toString(36) : n < 62 ? (n - 26).toString(36).toUpperCase() : n < 63 ? "_" : "-" } return e };
    const ELEMENT_UI = GM_getResourceText("ELEMENT_UI");
    GM_addStyle(ELEMENT_UI);
 
    $("body").append('<div id="vueroot"></div>');
 
    const vm = new Vue({
        el: "#vueroot",
        template: `
        <div>
        <el-dialog
        title="导出Challonge赛事结果为CSV表格 v1.3.4"
        :visible.sync="dialogVisible"
        :before-close = "handleClose"
        :close-on-click-modal = "false"
        
        width="860px" >
        <el-tooltip content="接口密钥" placement="left-start">
        <span><h3 style="color:#2b303d;">API Key</h3></span>
        </el-tooltip>
        <p>
        获取方式：登录Challonge账号后，从<a href="https://challonge.com/settings/developer">https://challonge.com/settings/developer</a>获得。
        </p>
        <p>
        示例：8ljkjzIs0Wvcc7ZY0Zt7diqEvSqWjGCjmGYe32e0
        </p>
        <br/>
        <el-input v-model="config.apiKeySetTo" placeholder="请输入API Key"></el-input>
        </br></br>
        <hr/>
        <br/>
        <el-tooltip content="从赛事URL获取" placement="left-start">
        <span><h3 style="color:#2b303d;">赛事码</h3></span>
        </el-tooltip>
        <p>常规赛事示例：7oau1ofl（比赛链接为https://challonge.com/zh_CN/7oau1ofl时，赛事码是7oau1ofl。）</p>
        <p>建在"社区"中的赛事示例：511a323c8dc081f3bbd2dc93-6j4kx1bq。获取方式请参考<a href="https://docs.qq.com/doc/DT0NudVJod3RRdXFI">使用说明</a>的“使用Challonge社区”部分。</p>
        <br/>
        <el-input v-model="config.contestUrlSetTo" placeholder="请输入赛事码"></el-input>
        </br></br><hr/>
        <el-tooltip content="未进行的对局设置" placement="left-start">
        <span><h3 style="color:#2b303d;">弃赛/轮空设置</h3></span>
        </el-tooltip>
        <p>Challonge不会记录轮空，由于数据是从接口读取的，所以<b>轮空的胜场需要手动加入</b></p>
        <p>勾选此项可以避免破平表“是否出错”列由于缺少对手而出现“错误”，并不影响胜率计算。</p>
        <el-switch  v-model="config.sudoPlayerSwitch"  active-text="加入0号选手作为占位符"></el-switch>
 
        <span slot="footer" class="dialog-footer">
        <span style="color:darkgrey;">保存后记得刷新一下网页</span>
        <el-button type="primary" @click="saveConfig">保存设置</el-button>
        <el-button type="success" @click="saveCsvFile">下载CSV</el-button>
        </span>
        </el-dialog>
        </div>`,
        data() {
            return {
                dialogVisible: false,
                config: {
                    apiKeySetTo: "",
                    contestUrlSetTo: "",
                    sudoPlayerSwitch: false,
                },
            }
        },
        methods: {
            handleClose() {
                this.$confirm('是否保存当前设置？')
                    .then(_ => {
                        this.saveConfig();
                    })
                    .catch(_ => {
                        this.dialogVisible = false;
                    });
            },
            saveConfig() {
                GM_setValue("config", this.config);
                this.dialogVisible = false;
            },
            saveCsvFile() {
                getCsvFile_outside();
            },
            showDialog() {
                this.dialogVisible = true;
            },
        },
        mounted() {
            var oldConfig = GM_getValue("config");
            if (oldConfig === undefined) {
                GM_setValue("config", this.config);
            } else {
                var newConfigKeys = Object.keys(this.config);
                var setOld = new Set(Object.keys(oldConfig));
                var toBeUpdateKeys = newConfigKeys.filter(a => !setOld.has(a))
                if (toBeUpdateKeys.length != 0) {
                    var that = this;
                    toBeUpdateKeys.forEach(function (key) {
                        oldConfig[key] = that.config[key];
                    })
                }
                this.config = oldConfig;
            }
        },
    })
 
    $('.is-hidden-mobile > .tabbed-navlist.varnish-logged-in').append('<li class="item" id="scriptConfig"><a class="link "></a></li>')
    $('#scriptConfig').children().text("导出结果").click(function (e) {
        vm.showDialog();
        e.preventDefault();
    });
    $('.el-dialog__close').css("color", "black");
    $('.el-dialog__close').text("X");
 
    // Get match list then participants.
    async function getCsvFile_outside() {
        // Get matches
        var matchList = await makeGetRequest(challongeUrl("matches"));
        console.log(challongeUrl("matches"))
 
        // Get participants
        var participants = await makeGetRequest(challongeUrl("participants"));
        console.log(challongeUrl("participants"))
 
        try {
            let m_obj = JSON.parse(matchList);
            let p_obj = JSON.parse(participants);
            generateCsvContent(m_obj, p_obj);
        } catch (e) {
            alert('请输入正确的API Key和赛事码 ' + e);
        }
    }
 
    // player: {
    // id: player_id（UI不可见）,
    // seed: <challonge排序>,
    // name: <选手昵称>,
    // matches: [{opponent:<对手seed>, score:<胜局数>, opponent_score:<负局数>} * 5],
    // count: <参加场数> }
    function generateCsvContent(matches, participants) {
        const results = [];
 
        // Fill in participants with empty matches
        for (const p of participants) {
            const cur = {
                id: p.participant.id,
                seed: p.participant.seed,
                name: p.participant.name,
                count: 0,
                matches: Array(5),
            };
            results.push(cur);
        }
 
        const multipleGames = hasMultipleGames(matches)

        // Fill in matches
        for (const m of matches) {
            fillInSinglePlayer(m.match, results);
        }
 
        console.log('finish parsing');
        console.log(results);
 
        // Generate file content based on the number of games
        let fileContent;
        if (multipleGames) {
            fileContent = multipleGamesResultsToString(results)
        } else {
            fileContent= bo1ResultsToString(results)
        }
        
        console.log(fileContent);
 
        downloadCsv(fileContent);
    }
 
    // Loop through input matches to find a complete game
    // return true if the game is bo3
    // return false otherwise
    function hasMultipleGames(matches) {
        // If the match is not finished, skip
        for (const match of matches) {
            const m = match.match;
            if (m.state === "complete") {
                // Extract player scores from csv_score
                const scores = m.scores_csv.split('-');
                const p1_score = parseInt(scores[0], 10);
                const p2_score = parseInt(scores[1], 10);

                return p1_score > 1 || p2_score > 1
            }
        }
        
        return false;
    }


    // Download a csv file with filename 'challonge.csv'
    // TODO: customize download file name
    function downloadCsv(csvStr) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvStr);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'challonge.csv';
        hiddenElement.click();
    }
 
    // Convert header to a comma seperated string for a bo1 game
    // append each player object as a row of csv
    function bo1ResultsToString(results) {
        // Append header
        const headers = ["编号","参赛人员","参与场数","对手1","得分1","对手2","得分2","对手3","得分3","对手4","得分4","对手5","得分5"];
        let csvContent = headers.join(',') + '\n';
 
        for (const cur of results) {
            csvContent += bo1ResultToRow(cur);
        }
 
        // placeholder for empty rounds
        // Use player 33 if the sudo player switch is on.
        if (vm.config.sudoPlayerSwitch) {
            csvContent += '0,,0,,0,,0,,0,,0,,0'
        }
 
        return csvContent;
    }

    // Convert header to a comma seperated string for a bo1 game
    // append each player object as a row of csv
    function multipleGamesResultsToString(results) {
        // Append header
        const headers = ["编号","参赛人员","参与场数",
                        "对手1","得分1","胜局1","败局1",
                        "对手2","得分2","胜局2","败局2",
                        "对手3","得分3","胜局3","败局3",
                        "对手4","得分4","胜局4","败局4",
                        "对手5","得分5","胜局5","败局5"];
        let csvContent = headers.join(',') + '\n';
 
        for (const cur of results) {
            csvContent += multipleGamesResultToRow(cur);
        }
 
        // placeholder for empty rounds
        // Use player 33 if the sudo player switch is on.
        if (vm.config.sudoPlayerSwitch) {
            csvContent += '0,,0,,0,,,,0,,,,0,,,,0,,,,0'
        }
 
        return csvContent;
    }

    // convert the result object into a csv row
    function bo1ResultToRow(result) {
        let row = result.seed + ',' + result.name + ',' + result.count + ',';
        for (let i = 0; i < result.matches.length; i++) {
            const m = result.matches[i];
            if (m != null) {
                // If match exists
                row += m.opponent + ',' + m.score + ',';
            } else {
                // If match doesn't exist
                // Use player 33 if the sudo player switch is on, empty otherwise.
                if (vm.config.sudoPlayerSwitch) {
                    row += '0,0,';
                } else {
                    row += ',,';
                }
            }
        }
        return row + '\n';
    }

    // convert the result object into a csv row
    function multipleGamesResultToRow(result) {
        let row = result.seed + ',' + result.name + ',' + result.count + ',';
        for (let i = 0; i < result.matches.length; i++) {
            const m = result.matches[i];
            if (m != null) {
                // If match exists
                const isWinner = m.score > m.opponent_score ? 1 : 0;
                row += m.opponent + ',' + isWinner + ',' + m.score + ',' + m.opponent_score + ',';
            } else {
                // If match doesn't exist
                // Use player 33 if the sudo player switch is on, empty otherwise.
                if (vm.config.sudoPlayerSwitch) {
                    row += '0,0,0,0,';
                } else {
                    row += ',,,,';
                }
            }
        }
        return row + '\n';
    }
 
    // Update player match results with the match array
    function fillInSinglePlayer(match, players) {
        // If the match is not finished, skip
        if (match.state != "complete") {
            return;
        }
        
        // Extract player scores from csv_score
        const scores = match.scores_csv.split('-');
        const p1_score = scores[0];
        const p2_score = scores[1];
 
        // Find the corresponding seed to each player
        const p1 = findSeedById(match.player1_id, players);
        let p1Assigned = false;
        const p2 = findSeedById(match.player2_id, players);
        let p2Assigned = false;
        const round = match.round - 1;

        // Assign opponents and scores
        for (let i = 0; i < players.length; i++) {
            let p = players[i];

            // Assign p1
            if (p.seed === p1) {
                p.matches[round] = {"opponent": p2, "score": p1_score, "opponent_score": p2_score};
                p.count += 1;
                p1Assigned = true;
            }

            // Assign p2
            if (p.seed === p2) {
                p.matches[round] = {"opponent": p1, "score": p2_score, "opponent_score": p1_score};
                p.count += 1;
                p2Assigned = true;
            }

            // Return early if both players are found
            if (p1Assigned && p2Assigned) {
                return;
            }
        }
    }
 
    function findSeedById(id, players) {
        for (let i = 0; i < players.length; i++) {
            let p = players[i];
            if (p.id === id) {
                return p.seed;
            }
        }
    }
 
 
    // Input: A data type ("matches" or "participants")
    // Output: https://api.challonge.com/v1/tournaments/{tournament}/{type}.{json|xml}
    function challongeUrl(type) {
        return "https://api.challonge.com/v1/tournaments/" + vm.config.contestUrlSetTo + "/" + type + ".json?api_key=" + vm.config.apiKeySetTo;
    }
 
    // A get request that guarentees eventual completion.
    function makeGetRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 404) {
                        handleError(response);
                        return;
                    }
                    resolve(response.responseText);
                },
                onerror: function(error) {
                    reject(error.responseText)
                },
            });
        });
    }
 
    // Handle API Key error and contest not found error
    function handleError(error) {
        try {
            const errorText = JSON.parse(error.responseText).errors[0];
            if (errorText === "Invalid API key") {
                alert('API Key不存在，请根据说明正确获取喵！');
            } else if (errorText === "Requested tournament not found") {
                alert('赛事不存在或社区赛事码格式不正确。\n社区赛事请参考使用说明的“使用Challonge社区”部分：\nhttps://docs.qq.com/doc/DT0NudVJod3RRdXFI');
            } else if (errorText.startsWith("Requested tournament not found for subdomain")){
                alert('所提供的社区中无法找到对应赛事。\n赛事码格式请参考使用说明中的“使用Challonge社区”部分：\nhttps://docs.qq.com/doc/DT0NudVJod3RRdXFI');
            } else {
                alert("未知错误喵！请联系脚本提供者～" + errorText);
            }
        } catch(e) {
            alert("未知错误喵！请联系脚本提供者～" + error.responseText);
        }
    }
})();