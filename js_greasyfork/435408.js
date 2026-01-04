// ==UserScript==
// @name         Auto Claim Twitch Drops
// @version      0.0.15
// @description  Auto claiming Twitch Drops on Twitch Inventory page
// @author       Fermis
// @match        https://www.twitch.tv/*
// @run-at       document-end
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @license      MIT
// @namespace https://greasyfork.org/users/837856
// @downloadURL https://update.greasyfork.org/scripts/435408/Auto%20Claim%20Twitch%20Drops.user.js
// @updateURL https://update.greasyfork.org/scripts/435408/Auto%20Claim%20Twitch%20Drops.meta.js
// ==/UserScript==

const twitchInventoryUrl = 'https://www.twitch.tv/drops/inventory';

var location,
    channelId;

if(window.location.pathname === '/drops/inventory'){
    location = 'inventory';
}else if(window.location.pathname.split('/').length == 2){
    location = 'stream';
}else{
    location = 'other';
}

if(location !== 'other'){
    /*
     *
     *   Auto Claim Twitch Drops
     *
     */
    console.log('Auto Claim Twitch Drops Initialized...');
    if(location === 'stream'){
        __Twitch__pubsubInstances.production._client._primarySocket._socket.addEventListener('message', function (event) {
            // websocket data coming from Twitch
            var data = JSON.parse(event.data);

            // General functions
            var getDisplayDate = function(){
                const date = new Date();
                var [month, day, year, hour, minutes, seconds] = [date.getMonth(), date.getDate(), date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds()];

                var ampm = 'AM';
                if(hour > 12){
                    hour = hour - 12;
                    ampm = 'PM';
                }

                if(minutes.length == 1){
                    minutes = '0' + (minutes+'');
                }

                const displayDate = '[' + [month, day, year].join('/') + ' ' + [hour, minutes].join(':') + ' ' + ampm + '] ';
                return displayDate;
            }

            // stream page functions
            var processDropInventory = function(){
                GM_setValue('processingDrop', '1');
                // open inventory url in new tab
                var inventoryTab = openInventoryTab();
                // just under a minute
                var maxTime = 55000;

                // wait for drop to be claimed and then close the tab
                var checkDropTimer = setInterval(function(){
                    if(GM_getValue('dropClaimed') === '1'){
                        const displayDate = getDisplayDate();
                        console.log(displayDate + 'Drop Claimed');
                        closeInventoryTab(inventoryTab);
                        checkDropTimer = clearInterval(checkDropTimer);
                        GM_setValue('processingDrop', '0');
                    }
                }, 1000);

                setTimeout(function(){
                    if(typeof(checkDropTimer) !== 'undefined'){
                        const displayDate = getDisplayDate();
                        console.log(displayDate + 'Force closed claim drop tab due to time limit reached.');
                        closeInventoryTab(inventoryTab);
                        checkDropTimer = clearInterval(checkDropTimer);
                        GM_setValue('processingDrop', '0');
                    }
                }, maxTime);
            }

            var openInventoryTab = function(){
                GM_setValue('dropClaimed', '0');
                var tab = GM_openInTab(twitchInventoryUrl, false);
                return tab;
            }

            var closeInventoryTab = function(inventoryTab){
                GM_setValue('dropClaimed', '0');
                inventoryTab.close();
                return;
            }

            // reading websocket data to see if drop is ready to be claimed.
            if(typeof(data.type) !== 'undefined' && (data.type).toLowerCase() === 'message'){
                var wsData = data.data;
                // console.log('message data: ', wsData);
                var topic = wsData.topic || '';
                var msgTopic = topic.split('.')[0];
                var dropData;
                switch(msgTopic){
                    case 'user-drop-events':
                        // only process the websockets on the stream the drop is for
                        dropData = JSON.parse(wsData.message);

                        if(dropData.data.channel_id == channelId && typeof(channelId) !== 'undefined'){
                            if(dropData.type === 'drop-progress'){
                                var currentProgress = dropData.data.current_progress_min;
                                var requiredProgress = dropData.data.required_progress_min;

                                var percentCompleted = (((currentProgress/requiredProgress)*100).toFixed(2))*1;
                                var dropTimeRemaining = requiredProgress - currentProgress;
                                var remainingHours =  parseInt((dropTimeRemaining / 60));
                                var remainingMinutes = dropTimeRemaining - (remainingHours * 60);
                                var remainingData = [];

                                if(remainingHours > 0){
                                    var hourStr = remainingHours + ' hour' + (remainingHours > 1 ? 's' : '');
                                    remainingData.push(hourStr);
                                }

                                if(remainingMinutes > 0){
                                    var minuteStr = remainingMinutes + ' minute' + (remainingMinutes > 1 ? 's' : '');
                                    remainingData.push(minuteStr);
                                }

                                var remainingTime = remainingData.join(' and ');
                                const displayDate = getDisplayDate();

                                console.log(displayDate + 'Drop Percent Completed: ', percentCompleted);
                                console.log(displayDate + 'Drop Time Remaining: ', remainingTime);

                                if(currentProgress >= requiredProgress || percentCompleted == 100){
                                    console.log(displayDate + 'Drop ready to claim.');
                                    var dropId = dropData.data.drop_id;
                                    processDropInventory();
                                }
                            }
                        }
                        break;
                    case 'channel-drop-events':
                        dropData = JSON.parse(wsData.message);
                        var dropInstanceId = dropData.drop_instance_id;

                        // console.log('channel-drop-events: ', dropData);
                        break;
                    case 'video-playback-by-id':
                        channelId = topic.split('.')[1];
                        break;
                }
            }
        });
    }else if(location === 'inventory'){
        // only load drop claiming code when processing a drop
        if(GM_getValue('processingDrop') === '1'){
            var reloadPage = function(){
                window.location.reload();
            }

            setInterval(function(){
                const claimButton = '[data-test-selector="DropsCampaignInProgressRewardPresentation-claim-button"]';
                if(!document.querySelector(claimButton)){
                    reloadPage();
                }else{
                    document.querySelector(claimButton).click();
                    GM_setValue('dropClaimed', '1');
                }
            }, 3000);
        }
    }
}