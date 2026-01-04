// ==UserScript==
// @name         国家队球员库
// @namespace    mzblueAT
// @version      0.5.1
// @description  mz plugin 国家队球员导入插件
// @author       bluemz
// @match        https://www.managerzone.com/?p=national_teams&type=u21
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      www.bluemz.cn
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/470883/%E5%9B%BD%E5%AE%B6%E9%98%9F%E7%90%83%E5%91%98%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/470883/%E5%9B%BD%E5%AE%B6%E9%98%9F%E7%90%83%E5%91%98%E5%BA%93.meta.js
// ==/UserScript==

var main = {
    interval: 5 * 1000,
    clickTimeoutId: null,
    parseTimeoutId: null,
    processTimeoutId : null,

    queryPlayersId: function(callback) {

        let con = {
            "age": [20, 21]
        }
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://www.bluemz.cn:3001/api/nation/player/id',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(con),
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    var resp = JSON.parse(response.responseText)
                    //console.log('Response: ', resp.data.list);
                    callback(resp.data.list);
                } else {
                    console.log('Error: ', response.status);
                }
            },
            onerror: function (err) {
                console.log('Request failed', err);
            }
        });
    },

    //return {attr:[1,2,3,4,5,6,7,8,9,...], maxed: [0,0,...]}
    getPlayerSkill: function() {
        const currentTime = new Date().toLocaleString();
        console.log(currentTime + " getPlayerSkill parse skill boll");

        let attr = [];
        let maxed = [];
        // 查找具有player_skills类的表格
        var table = document.querySelector('.player_skills');
        if (table) {
            // 查找每个tr下具有skillval类的td
            var rows = table.querySelectorAll('tr');
            let i = 0;
            rows.forEach(function(row) {
                var skillValCell = row.querySelector('.skillval');
                var boll = skillValCell.querySelector('span');
                //console.log(boll.className);
                var boll_num = parseInt(boll.textContent)
                attr.push(boll_num);
                maxed.push((boll.className === 'maxed')? 1: 0);
            });
        } else {
            console.log('未找到player_skills类的表格');
            return null;
        }
        return {attr, maxed};
    },

    getPlayerId: function() {
        var playerElement = document.querySelector('.player_id_span');
        if (playerElement) {
            return playerElement.textContent;
        } else {
            return "";
        }
    },

    getPlayerAttr: function(pid, callback) {
        //var xpathResult = document.evaluate("/html/body/div[3]/div[3]/div[3]/div[2]/div[2]/div/div[2]/div[5]/div/div/div/div[2]/div/div[1]/table/tbody/tr[3]/td[2]/strong", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        //var dateElement = xpathResult.singleNodeValue;

        const inputElement = document.querySelector('input[name="pid"]');
        inputElement.value = pid;

        clearTimeout(main.clickTimeoutId);

        main.clickTimeoutId = setTimeout(() => {
            const buttonElement = document.getElementById('searchBtn');
            buttonElement.click();
            const currentTime = new Date().toLocaleString();
            console.log(currentTime + " getPlayerAttr Click button");

            clearTimeout(main.parseTimeoutId);
            main.parseTimeoutId = setTimeout(() => {
                let playerId = main.getPlayerId()
                let skill = main.getPlayerSkill()
                callback(playerId, skill)
            }, 3000)

        }, 1000);
    },

    pushPlayerAttr: function(attr) {
        const currentTime = new Date().toLocaleString();
        console.log(currentTime + ' pushPlayerAttr', attr)
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://www.bluemz.cn:3001/api/nation/player/update',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(attr),
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    var resp = JSON.parse(response.responseText)
                    //console.log('Response: ', resp.data.list);
                } else {
                    console.log('Error: ', response.status);
                }
            },
            onerror: function (err) {
                console.log('Request failed', err);
            }
        });
    },

    findPlayers: function() {

        main.queryPlayersId(list => {

            //list = ['220792613','220276339','220061765','220792194','220063482','220062361','221412042','220685544','220780100','221473283','215568895','214448086','215527770','210210037','212805380','215541995','212196283','208747246','214868104','216290388','213991364','211343324','211766763','210924482','212645585','216364012','211036634','211521937','210618923','209564513','218377258','218354558','210843918','211923959','210059102','211094093','213518916','214866908','210456593','213771489','209952259','214618441','213564950','211989354','212169414','209750561','210641143'];

            //console.log(list);
            let i = 0;
            function processPlayer() {

                if (i < list.length) {
                    const currentTime = new Date().toLocaleString();
                    console.log(currentTime + " processPlayer "+list[i]+" ==========");

                    main.getPlayerAttr(list[i], (playerid, skill) => {

                        if (playerid && skill) {
                            let attr_boll = skill.attr
                            let maxed = skill.maxed
                            let total = 0;
                            for (let i = 0; i < 11; i++){
                                total += attr_boll[i];
                            }

                            let attr = {
                                player: {
                                    pid: playerid,
                                    speed: attr_boll[0],
                                    stamina: attr_boll[1],
                                    intelligence: attr_boll[2],
                                    pass: attr_boll[3],
                                    shoot: attr_boll[4],
                                    heading: attr_boll[5],
                                    keeping: attr_boll[6],
                                    control: attr_boll[7],
                                    tackling: attr_boll[8],
                                    aerial: attr_boll[9],
                                    setplay: attr_boll[10],
                                    experience: attr_boll[11],
                                    maxed,
                                    total
                                }
                            }
                            main.pushPlayerAttr(attr);
                        }

                        i++;
                        clearTimeout(main.processTimeoutId);
                        main.processTimeoutId = setTimeout(processPlayer, 2000);
                    });
                } else {
                    //return;
                }
            }
            processPlayer();
        });
    },

    load: function() {
        setTimeout(function() {
            main.findPlayers();
        }, main.interval);
        //main.intervalIds.push(intervalId);
    },
};

(function() {
    'use strict';
    main.load();
})();

