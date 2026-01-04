// ==UserScript==
// @name         [Mwi]Guild Details Display
// @name:zh-CN   [银河奶牛]钉钉
// @name:zh-TW   [银河奶牛]公会数据显示
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  Display more detailed data on the guild page.
// @description:zh-cn 在公会页面显示更详细的数据
// @description:zh-tw 在公会页面显示更详细的数据
// @author       Truth_Light
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @match        https://www.milkywayidle.com/game?characterId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500750/%5BMwi%5DGuild%20Details%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/500750/%5BMwi%5DGuild%20Details%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const userLanguage = navigator.language || navigator.userLanguage;
    const isZH = userLanguage.startsWith("zh");
    const updataDealy = 24*60*60*1000; //数据更新时限
    let rateXPDayMap = {};
    function formatPrice(value) {
        const isNegative = value < 0;
        value = Math.abs(value);

        if (value >= 1000000) {
            return (isNegative ? '-' : '') + (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (isNegative ? '-' : '') + (value / 1000).toFixed(1) + 'K';
        } else {
            return (isNegative ? '-' : '') + value.toFixed(0).toString();
        }
    }

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            return handleMessage(message);
        }
    }

    function handleMessage(message) {
        try {
            let obj = JSON.parse(message);
            if (obj && obj.type === "guild_updated") {
                const Guild_ID = obj.guild.id;
                let storedData = JSON.parse(localStorage.getItem("Guild_Data")) || {};

                // 判断是否已经存在旧数据
                if (storedData[Guild_ID] && storedData[Guild_ID].guild_updated && storedData[Guild_ID].guild_updated.old.updatedAt) {
                    const oldUpdatedAt = new Date(storedData[Guild_ID].guild_updated.new.updatedAt);
                    const newUpdatedAt = new Date(obj.guild.updatedAt);

                    // 计算时间差（单位：毫秒）
                    const timeDifference = newUpdatedAt - oldUpdatedAt;

                    if (timeDifference >= updataDealy) {
                        // 更新老数据为新数据
                        storedData[Guild_ID].guild_updated.old = storedData[Guild_ID].guild_updated.new;
                        // 更新新数据为当前数据
                        storedData[Guild_ID].guild_updated.new = {
                            experience: obj.guild.experience,
                            level: obj.guild.level,
                            updatedAt: obj.guild.updatedAt
                        };
                    } else {
                        // 仅更新新数据
                        storedData[Guild_ID].guild_updated.new = {
                            experience: obj.guild.experience,
                            level: obj.guild.level,
                            updatedAt: obj.guild.updatedAt
                        };
                    }
                    //计算Δ
                    const Delta = {
                        Delta_Xp: storedData[Guild_ID].guild_updated.new.experience - storedData[Guild_ID].guild_updated.old.experience,
                        Delta_Level: storedData[Guild_ID].guild_updated.new.level - storedData[Guild_ID].guild_updated.old.level,
                        Delta_Time: (newUpdatedAt - new Date(storedData[Guild_ID].guild_updated.old.updatedAt)) / 1000, // 转换为秒
                        Rate_XP_Hours: (3600*(obj.guild.experience - storedData[Guild_ID].guild_updated.old.experience)/((newUpdatedAt - new Date(storedData[Guild_ID].guild_updated.old.updatedAt)) / 1000)).toFixed(2)
                    };
                    storedData[Guild_ID].guild_updated.Delta = Delta;

                    const Guild_TotalXp_div = document.querySelectorAll(".GuildPanel_value__Hm2I9")[1];
                    if (Guild_TotalXp_div) {
                        const xpText = isZH ? "经验值 / 小时" : "XP / Hour";

                        Guild_TotalXp_div.insertAdjacentHTML(
                            "afterend",
                            `<div>${formatPrice(Delta.Rate_XP_Hours)} ${xpText}</div>`
                        );
                        const Guild_NeedXp_div = document.querySelectorAll(".GuildPanel_value__Hm2I9")[2];
                        if (Guild_NeedXp_div) {
                            const Guild_NeedXp = document.querySelectorAll(".GuildPanel_value__Hm2I9")[2].textContent.replace(/,/g, '');
                            const Time = TimeReset(Guild_NeedXp/Delta.Rate_XP_Hours);
                            Guild_NeedXp_div.insertAdjacentHTML(
                                "afterend", // 使用 "afterend" 在元素的后面插入内容
                                `<div>${Time}</div>`
                        );
                        }
                    }
                } else {
                    // 如果没有旧数据，则直接添加新数据
                    storedData[Guild_ID] = {
                        guild_name: obj.guild.name,
                        guild_updated: {
                            old: {
                                experience: obj.guild.experience,
                                level: obj.guild.level,
                                updatedAt: obj.guild.updatedAt
                            },
                            new: {},
                        }
                    };
                }

                // 存储更新后的数据到 localStorage
                localStorage.setItem("Guild_Data", JSON.stringify(storedData));
            } else if (obj && obj.type === "guild_characters_updated") {
                let storedData = JSON.parse(localStorage.getItem("Guild_Data")) || {};
                for (const key in obj.guildSharableCharacterMap) {
                    if (obj.guildSharableCharacterMap.hasOwnProperty(key)) {
                        const Guild_ID = obj.guildCharacterMap[key].guildID;
                        const name = obj.guildSharableCharacterMap[key].name;
                        const newUpdatedAt = new Date();
                        storedData[Guild_ID].guild_player = storedData[Guild_ID].guild_player || {};
                        if (storedData[Guild_ID] && storedData[Guild_ID].guild_player && storedData[Guild_ID].guild_player[name] && storedData[Guild_ID].guild_player[name].old && storedData[Guild_ID].guild_player[name].old.updatedAt) {
                            const oldUpdatedAt = new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)
                            const timeDifference = newUpdatedAt - oldUpdatedAt
                            if (timeDifference >= updataDealy) {
                                // 更新老数据为新数据
                                storedData[Guild_ID].guild_player[name].old = storedData[Guild_ID].guild_player[name].new;
                                // 更新新数据为当前数据
                                storedData[Guild_ID].guild_player[name].new = {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                };
                            } else {
                                // 仅更新新数据
                                storedData[Guild_ID].guild_player[name].new = {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                };
                            }
                            //计算Δ
                            const Delta = {
                                Delta_Time:(newUpdatedAt - new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)) / 1000,
                                Delta_Xp: storedData[Guild_ID].guild_player[name].new.guildExperience - storedData[Guild_ID].guild_player[name].old.guildExperience,
                                Rate_XP_Day: (24*3600*(obj.guildCharacterMap[key].guildExperience - storedData[Guild_ID].guild_player[name].old.guildExperience)/((newUpdatedAt - new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)) / 1000)).toFixed(2)
                            };
                            storedData[Guild_ID].guild_player[name].Delta = Delta;
                            rateXPDayMap[name] = Delta.Rate_XP_Day;
                        }else {
                            storedData[Guild_ID].guild_player[name] = {
                                old: {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                },
                                new:{}
                            };
                        }
                    }

                }
                //console.log("测试数据",storedData);
                //console.log("guild_characters_updated", obj);
                updateExperienceDisplay(rateXPDayMap);
                localStorage.setItem("Guild_Data", JSON.stringify(storedData));
            }




        } catch (error) {
            console.error("Error processing message:", error);
        }
        return message;
    }


    function TimeReset(hours) {
        const totalMinutes = hours * 60;
        const days = Math.floor(totalMinutes / (24 * 60));
        const yudays = totalMinutes % (24 * 60);
        const hrs = Math.floor(yudays / 60);
        const minutes = Math.floor(yudays % 60);
        const dtext = isZH ? "天" : "d";
        const htext = isZH ? "时" : "h";
        const mtext = isZH ? "分" : "m";
        return `${days}${dtext} ${hrs}${htext} ${minutes}${mtext}`;
    }

    function updateExperienceDisplay(rateXPDayMap) {
        const trElements = document.querySelectorAll(".GuildPanel_membersTable__1NwIX tbody tr");
        const idleuser_list = [];
        const dtext = isZH ? "天" : "d";

        // 将 rateXPDayMap 转换为数组并排序
        const sortedMembers = Object.entries(rateXPDayMap)
        .map(([name, XPdata]) => ({ name, XPdata }))
        .sort((a, b) => b.XPdata - a.XPdata);

        sortedMembers.forEach(({ name, XPdata }) => {
            trElements.forEach(tr => {
                const nameElement = tr.querySelector(".CharacterName_name__1amXp");
                const experienceElement = tr.querySelector("td:nth-child(3) > div");
                const activityElement = tr.querySelector('.GuildPanel_activity__9vshh');

                if (nameElement && nameElement.textContent.trim() === name) {
                    if (activityElement.childElementCount === 0) {
                        idleuser_list.push(nameElement.textContent.trim());
                    }

                    if (experienceElement) {
                        const newDiv = document.createElement('div');
                        newDiv.textContent = `${formatPrice(XPdata)}/${dtext}`;

                        // 计算颜色
                        const rank = sortedMembers.findIndex(member => member.name === name);
                        const hue = 120 - (rank * (120 / (sortedMembers.length - 1)));
                        newDiv.style.color = `hsl(${hue}, 100%, 50%)`;

                        experienceElement.insertAdjacentElement('afterend', newDiv);
                    }
                    return;
                }
            });
        });

        update_idleuser_tb(idleuser_list);
    }

    function update_idleuser_tb(idleuser_list) {
        const targetElement = document.querySelector('.GuildPanel_noticeMessage__3Txji');
        if (!targetElement) {
            console.error('公会标语元素未找到！');
            return;
        }
        const clonedElement = targetElement.cloneNode(true);

        const namesText = idleuser_list.join(', ');
        clonedElement.innerHTML = '';
        clonedElement.textContent = isZH ? `闲置的成员：${namesText}` : `Idle User : ${namesText}`;
        clonedElement.style.color = '#ffcc00';

        // 设置复制元素的高度为原元素的25%
        const originalStyle = window.getComputedStyle(targetElement);
        const originalHeight = originalStyle.height;
        const originalMinHeight = originalStyle.minHeight;
        clonedElement.style.height = `25%`;
        clonedElement.style.minHeight = `25%`; // 也设置最小高度
        targetElement.parentElement.appendChild(clonedElement);
    }

    hookWS();

})();
