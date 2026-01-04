// ==UserScript==
// @name         Discord Quest Spoofer
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Automates Discord quest completion
// @author       aamiaa
// @match        *.discord.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530354/Discord%20Quest%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/530354/Discord%20Quest%20Spoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function retryUntilSuccess(interval = 5000) {
        async function attempt() {
            try {
                delete window.$;
                let wpRequire;
                window.webpackChunkdiscord_app.push([[ Math.random() ], {}, (req) => { wpRequire = req; }]);

                let ApplicationStreamingStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getStreamerActiveStreamMetadata).exports.Z;
                let RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getRunningGames).exports.ZP;
                let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getQuest).exports.Z;
                let ChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getAllThreadsForParent).exports.Z;
                let GuildChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getSFWDefaultChannel).exports.ZP;
                let FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.flushWaitQueue).exports.Z;
                let api = Object.values(wpRequire.c).find(x => x?.exports?.tn?.get).exports.tn;

                let quest = [...QuestsStore.quests.values()].find(x => x.id !== "1248385850622869556" && x.userStatus?.enrolledAt && !x.userStatus?.completedAt && new Date(x.config.expiresAt).getTime() > Date.now())
                let isApp = typeof DiscordNative !== "undefined"
                if(!quest) {
                    console.log("You don't have any uncompleted quests!");
                    // If no quest, no need to retry, consider this a "success" for the script's purpose
                    return;
                } else {
                    const pid = Math.floor(Math.random() * 30000) + 1000;
                    
                    const applicationId = quest.config.application.id;
                    const applicationName = quest.config.application.name;
                    const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY"].find(x => quest.config.taskConfig.tasks[x] != null);
                    const secondsNeeded = quest.config.taskConfig.tasks[taskName].target;
                    const secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;

                    if(taskName === "WATCH_VIDEO") {
                        const tolerance = 2, speed = 10;
                        const diff = Math.floor((Date.now() - new Date(quest.userStatus.enrolledAt).getTime())/1000);
                        const startingPoint = Math.min(Math.max(Math.ceil(secondsDone), diff), secondsNeeded);
                        let fn = async () => {
                            for(let i=startingPoint;i<=secondsNeeded;i+=speed) {
                                try {
                                    await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: Math.min(secondsNeeded, i + Math.random())}});
                                } catch(ex) {
                                    console.log("Failed to send increment of", i, ex.message);
                                }
                                await new Promise(resolve => setTimeout(resolve, tolerance * 1000));
                            }
                            if((secondsNeeded-secondsDone)%speed !== 0) {
                                await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: secondsNeeded}});
                            }
                            console.log("Quest completed!");
                        };
                        fn();
                        console.log(`Spoofing video for ${applicationName}. Wait for ${Math.ceil((secondsNeeded - startingPoint)/speed*tolerance)} more seconds.`);
                    } else if(taskName === "PLAY_ON_DESKTOP") {
                        if(!isApp) {
                            console.log("This no longer works in browser for non-video quests. Use the desktop app to complete the", applicationName, "quest!");
                        }
                        
                        // Using a promise here to wait for the API call to complete
                        await api.get({url: `/applications/public?application_ids=${applicationId}`}).then(res => {
                            const appData = res.body[0];
                            const exeName = appData.executables.find(x => x.os === "win32").name.replace(">","");
                            
                            const fakeGame = {
                                cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
                                exeName,
                                exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
                                hidden: false,
                                isLauncher: false,
                                id: applicationId,
                                name: appData.name,
                                pid: pid,
                                pidPath: [pid],
                                processName: appData.name,
                                start: Date.now(),
                            };
                            const realGames = RunningGameStore.getRunningGames();
                            const fakeGames = [fakeGame];
                            const realGetRunningGames = RunningGameStore.getRunningGames;
                            const realGetGameForPID = RunningGameStore.getGameForPID;
                            RunningGameStore.getRunningGames = () => fakeGames;
                            RunningGameStore.getGameForPID = (pid) => fakeGames.find(x => x.pid === pid);
                            FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames});
                            
                            // This part of the code needs to properly signal completion
                            // For simplicity, we'll assume the setup part is the main "attempt"
                            // and the actual quest completion is handled by the dispatcher.
                            // If the quest completion via dispatcher also needs to trigger a retry,
                            // you'd need to re-evaluate the retry logic.
                            let fn = data => {
                                let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                                console.log(`Quest progress: ${progress}/${secondsNeeded}`);
                                
                                if(progress >= secondsNeeded) {
                                    console.log("Quest completed!");
                                    
                                    RunningGameStore.getRunningGames = realGetRunningGames;
                                    RunningGameStore.getGameForPID = realGetGameForPID;
                                    FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: []});
                                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                }
                            };
                            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                            
                            console.log(`Spoofed your game to ${applicationName}. Wait for ${Math.ceil((secondsNeeded - secondsDone) / 60)} more minutes.`);
                        });
                    } else if(taskName === "STREAM_ON_DESKTOP") {
                        if(!isApp) {
                            console.log("This no longer works in browser for non-video quests. Use the desktop app to complete the", applicationName, "quest!");
                        }
                        
                        let realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
                        ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({
                            id: applicationId,
                            pid,
                            sourceName: null
                        });
                        
                        let fn = data => {
                            let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
                            console.log(`Quest progress: ${progress}/${secondsNeeded}`);
                            
                            if(progress >= secondsNeeded) {
                                console.log("Quest completed!");
                                
                                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                            }
                        };
                        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                        
                        console.log(`Spoofed your stream to ${applicationName}. Stream any window in vc for ${Math.ceil((secondsNeeded - secondsDone) / 60)} more minutes.`);
                        console.log("Remember that you need at least 1 other person to be in the vc!");
                    } else if(taskName === "PLAY_ACTIVITY") {
                        const channelId = ChannelStore.getSortedPrivateChannels()[0]?.id ?? Object.values(GuildChannelStore.getAllGuilds()).find(x => x != null && x.VOCAL.length > 0).VOCAL[0].channel.id;
                        const streamKey = `call:${channelId}:1`;
                        
                        // The loop here acts as a long-running process. The `await` ensures it finishes.
                        console.log("Completing quest", applicationName, "-", quest.config.messages.questName);
                        
                        while(true) {
                            const res = await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}});
                            const progress = res.body.progress.PLAY_ACTIVITY.value;
                            console.log(`Quest progress: ${progress}/${secondsNeeded}`);
                            
                            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
                            
                            if(progress >= secondsNeeded) {
                                await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}});
                                break;
                            }
                        }
                        console.log("Quest completed!");
                    }
                }
                // If we reach here, the attempt was successful, so we don't schedule a retry.
                // The script's main purpose for this particular quest is fulfilled.
            } catch (error) {
                console.error("An error occurred during script execution:", error.message, "Retrying in", interval / 1000, "seconds...");
                // Only schedule a retry if an error occurred.
                setTimeout(() => attempt(), interval);
            }
        }

        // Initial call to start the process
        attempt();
    }

    // Start the retry mechanism
    retryUntilSuccess();
})();