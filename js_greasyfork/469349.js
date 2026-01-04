// ==UserScript==
// @name         PredictValue
// @namespace    mzblueAD
// @version      0.1
// @description  mz plugin mz增强插件
// @author       bluemz
// @match        https://www.managerzone.com/?p=transfer*
// @match        https://www.managerzone.com/?p=players*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      www.bluemz.cn
// @downloadURL https://update.greasyfork.org/scripts/469349/PredictValue.user.js
// @updateURL https://update.greasyfork.org/scripts/469349/PredictValue.meta.js
// ==/UserScript==

var transferParse = {
    getSeason: function () {
        return [86, 1]
    },
    getID: function (index) {
        let currentUrl = window.location.href;
        var xpathResult
        if (currentUrl.startsWith("https://www.managerzone.com/?p=transfer")) {
            xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/h2/div/span[3]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        } else {
            xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/h2/span[3]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        }
        var dateElement = xpathResult.singleNodeValue;
        if (dateElement) {
            return dateElement.textContent;
        } else {
            return "";
        }
    },
    getAge: function (index) {
        let currentUrl = window.location.href;
        var xpathResult;

        if (currentUrl.startsWith("https://www.managerzone.com/?p=transfer")) {
            xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/div/div/div[1]/table/tbody/tr[1]/td[2]/table/tbody/tr[1]/td[2]/strong', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        } else {
            xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/div/div/div[1]/table[1]/tbody/tr[1]/td[1]/strong', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        }

        var dateElement = xpathResult.singleNodeValue;

        if (dateElement) {
            return parseInt(dateElement.textContent);
        } else {
            return 0;
        }
/*
        var array = dateElement.textContent.replace(/\s/g, '').match(/(\D+)(\d+)/);
        if (array.length !== 3) {
            return -2;
        }
        var birth = array[2];
        var season = transferParse.getSeason()[0];
        var age = season - birth;
        return age;*/
    },
    getNation: function () {
    },

    getSkill: function (index, id) {
        var element = document.querySelector('#thePlayers_' + index)
        var scout = document.querySelector('#GM_scout_' + id);
        var strArray = scout.getAttribute("scout").split(',');//3,9,7,1,6,3
        var scoutList = [];
        strArray.forEach(item => {
            scoutList.push(parseInt(item))
        });
        var spaceArray = scout.getAttribute("scout").replace(/,/g, " ");//3 9 7 1 6 3
        var intArray = strArray.map(str => parseInt(str));

        var skill_boll = [];
        var maxed = []
        for (let i = 0; i < 11; i++) {
            var skill = element.querySelector('#boll_' + i)
            skill_boll[i] = parseInt(skill.getAttribute('skill_bool'));
            var color = skill.getAttribute('maxed_bool');
            if (color === 'green') {
                maxed[i] = 0;
            } else if (color === 'red') {
                maxed[i] = 1;
            } else {
                maxed[i] = -1;
            }
        }

        var value = [];
        value.push(...skill_boll)
        value.push(...scoutList)
        value.push(...maxed)

        return value;


        //console.log("skill", skill_boll, maxed)
        /*var strSkill = "";
        var strMaxed = "";
        for (let i = 0; i < 11; i++) {
            strSkill += skill_boll[i] + ",";
            strMaxed += maxed[i] + ",";
        }

        return strSkill + spaceArray + " " + strMaxed;*/
    },

    getMax: function () {
    },
    getAttr: function (index, id) {
        var attr = transferParse.getSkill(index, id)
        return attr;
    },
    getAsking: function (index) {
        var xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/div/div/div[2]/div/div[1]/table/tbody/tr[4]/td[2]/strong', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;

        var array = dateElement.textContent.replace(/\s/g, '').match(/(\d+)(\D+)/);
        if (array.length !== 3) {
            return -2;
        }
        var asking = array[1];
        return asking;
    },
    getBid: function (index) {
        var xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/div/div/div[2]/div/div[2]/table/tbody/tr/td[1]/table/tbody/tr[1]/td[2]/strong', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;

        var array = dateElement.textContent.replace(/\s/g, '').match(/(\d+)(\D+)/);
        if (array.length !== 3) {
            return -2;
        }
        var bid = array[1];
        return bid;
    },
};


var main = {
    interval: 1 * 1000,
    intervalIds: [],
    predictMap: new Map(),

    load: function () {
        var intervalId = setInterval(function () {
            main.parseAll();
        }, main.interval);
        main.intervalIds.push(intervalId);
    },
    parseAll: function () {
        for (let i = 0; i < 100; i++) {
            var object = main.parseOne(i)
            if (object) {
                //console.log(object)
            } else {
                //console.log('null')
            }
        }
    },
    parseOne: function (index) {
        var id = transferParse.getID(index);
        if (id === '') {
            return;
        }
        var age = transferParse.getAge(index);
        if(age <= 0) {
            return;
        }
        var attr = transferParse.getAttr(index, id);
        var value = [];
        value.push(age);
        value.push(...attr);

        main.predict(id, value);

        return {
            id,
            value
        }
    },
    predict: function (id, value) {

        if (main.predictMap.has(id) == true) {
            main.addPrediction(id, main.predictMap.get(id))
        } else {

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://www.bluemz.cn:8088/predict',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    'id': id,
                    'features': value
                }),
                onload: function (response) {
                    if (response.status >= 200 && response.status < 400) {
                        var resp = JSON.parse(response.responseText)
                        //console.log('Response: ', resp);
                        main.predictMap.set(resp.id, resp.prediction)
                        main.addPrediction(resp.id, resp.prediction)
                    } else {
                        console.log('Error: ', response.status);
                    }
                },
                onerror: function (err) {
                    console.log('Request failed', err);
                }
            });
        }
    },
    addPrediction: function (pid, prediction) {
        if (prediction < 0) {
            prediction = 0;
        }
        let predictionStr = prediction.toString().split("").reverse().join("").match(/.{1,3}/g).join(" ").split("").reverse().join("");
        let predval = `<span id='GM_prediction_${pid}' style="color: clack"> [估价: ${predictionStr} MM] </span>`;
        predval = $(predval)[0];
        document.querySelector(`span#player_id_${pid}.floatRight`).before(predval);
    }

};

(function () {
    'use strict';

    window.onload = function () {
        main.load();
    }
})();


