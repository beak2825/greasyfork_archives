// ==UserScript==
// @name         Activity
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  格式化统计分地域活动资源
// @author       qiwip
// @match        https://avatar.mws.sankuai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501816/Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/501816/Activity.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('#app').__vue__.$router.afterHooks.push(()=>{
        var tampermonkeyElement = document.getElementById('tampermonkey');
        if (tampermonkeyElement) {
            tampermonkeyElement.parentNode.removeChild(tampermonkeyElement);
        }

        var url = document.querySelector('#app').__vue__.$router.history.current.path;
        if(url.match(/source\/activity\/card/)){
            const currentQuery = document.querySelector('#app').__vue__.$router.currentRoute.query;
            if (!currentQuery.pageSize) {
                currentQuery.pageSize = '100';
            }
            console.log(currentQuery);
            document.querySelector('#app').__vue__.$router.replace({ query: currentQuery });
        }

        if(url.match(/activity\/(\d+)\/overview/)){
            var activityId = url.match(/activity\/(\d+)\/overview/)[1];
            console.log(activityId)
            var apiUrl = 'https://avatar.mws.sankuai.com/api/v2/avatar/activity/detail/'+ activityId +'/regionDistribution?billingUnit=&orgId=';
            fetch(apiUrl)
                .then(function(response) {
                return response.json();
            })
                .then(function(data) {
                var totalCores = 0;
                var coresByRegion = {};
                var totalCoresAct = 0;
                var coresByRegionAct = {};
                var items = data.data;

                items.forEach(function(item) {
                    if (item.type === 'total') {
                        totalCores = item.estimatedDemands;
                        totalCoresAct = item.actualDemands;
                    } else if (item.type === 'beijing') {
                        coresByRegion['北京'] = item.estimatedDemands;
                        coresByRegionAct['北京'] = item.actualDemands;
                    }else if (item.type === 'shanghai') {
                        coresByRegion['上海'] = item.estimatedDemands;
                        coresByRegionAct['上海'] = item.actualDemands;
                    }else if (item.type === 'cnhl') {
                        coresByRegion['怀来'] = item.estimatedDemands;
                        coresByRegionAct['怀来'] = item.actualDemands;
                    }else {
                        console.log('未知地域'+ item.type);
                    }
                });

                var cores_sum = (totalCores / 10000).toFixed(2);
                var output = '预估共' + cores_sum + 'w核（';
                for (var region in coresByRegion) {
                    var cores = (coresByRegion[region] / 10000).toFixed(2);
                    output += region + cores + 'w核、';
                }
                output = output.slice(0, -1);
                output += '）';

                cores_sum = (totalCoresAct / 10000).toFixed(2);
                var output1 = '报备共' + cores_sum + 'w核（';
                for (var regionAct in coresByRegionAct) {
                    var coresAct = (coresByRegionAct[regionAct] / 10000).toFixed(2);
                    output1 += regionAct + coresAct + 'w核、';
                }
                output1 = output1.slice(0, -1);
                output1 += '）';
                var displayElement = document.createElement('div');
                displayElement.id = 'tampermonkey';
                displayElement.style.cssText = 'position: fixed; top: 40%; left: 50%; transform: translateX(-50%); background-color: transparent; padding: 10px;';
                displayElement.textContent = output + '\n' + output1;
                document.body.appendChild(displayElement);
            })
                .catch(function(error) {
                console.error(error);
            });
        }
    })
})();