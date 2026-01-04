// ==UserScript==
// @name         牛牛战斗助手(已跑路)
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  牛牛组队信息、战力排行
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       xiaoshui
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://niuniu.0xa2c2a.shop/party.html
// @match        https://niuniu.0xa2c2a.shop/player.html
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      niuniu.0xa2c2a.shop
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536234/%E7%89%9B%E7%89%9B%E6%88%98%E6%96%97%E5%8A%A9%E6%89%8B%28%E5%B7%B2%E8%B7%91%E8%B7%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536234/%E7%89%9B%E7%89%9B%E6%88%98%E6%96%97%E5%8A%A9%E6%89%8B%28%E5%B7%B2%E8%B7%91%E8%B7%AF%29.meta.js
// ==/UserScript==

(function() {

    if (document.URL.includes("niuniu.0xa2c2a.shop")){
        localStorage.setItem("niuniu_0xa2c2a_shop_auth","2025-08-19");
        return;
    }
    return;//跑路跑路跑路
    if (document.URL.includes("test.milkywayidle.com") || document.URL.includes("test.milkywayidlecn.com"))return;

    const host = "https://niuniu.0xa2c2a.shop"
    let config={
        sikll_upload: host + "/api/player",
        party_upload:host + "/api/party",
        api_version:"0.0.3"
    }
    let reporter = null;

    // 拦截WS
    function hookWebSocket() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;
        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1) {
                return oriGet.call(this);
            }
            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });
            return handleMessage(message);
        }
    }
    hookWebSocket();

    // WS拦截后处理，主进程
    function handleMessage(message,debug=false) {
        let obj = JSON.parse(message);
        if (obj && obj.type === "init_character_data") {
            // 组队情况
            addPartyButton();
            // 上传初始化登录数据
            uploadInitCharacterData(obj);
        }else if (obj && obj.type === "profile_shared"){
            // 上传玩家面板数据
            uploadProfileShared(obj);
        }
        //other
        return message;
    }
    // 上传玩家面板数据
    function uploadProfileShared(obj){
        let data={};
        let profile = obj.profile;
        data.id=profile?.characterSkills?.[0]?.characterID;
        if((data.id === undefined) || (profile?.sharableCharacter?.gameMode !== "standard")) return;

        let isUploadPlayer = true;
        let scriptNiuniu0xa2c2aShop = localStorage.getItem("scriptNiuniu0xa2c2aShop");
        let localPlayer = null;
        let locatParty = null;
        if(scriptNiuniu0xa2c2aShop){
            scriptNiuniu0xa2c2aShop = JSON.parse(scriptNiuniu0xa2c2aShop);
            localPlayer = scriptNiuniu0xa2c2aShop.player;
            locatParty = scriptNiuniu0xa2c2aShop.party;
        }
        if((Date.now() - localPlayer?.[data.id])/60000 < 60){ // 人物信息页面上传间隔60分钟
            isUploadPlayer = false;
            return;
        } else {
            localPlayer = {...localPlayer,[data.id]:Date.now()};
            localStorage.setItem("scriptNiuniu0xa2c2aShop", JSON.stringify({"player":localPlayer,"party":locatParty}));
        }

        data.name=profile.sharableCharacter.name
        data.weapon = profile.wearableItemMap === null ?null:getWeapon(profile?.wearableItemMap);
        let ranged,attack,power,magic = "";
        for( const item of profile.characterSkills){
            if(item.skillHrid === "/skills/ranged"){
                ranged = item.experience.toFixed();
            }else if(item.skillHrid === "/skills/attack"){
                attack = item.experience.toFixed();
            } else if(item.skillHrid === "/skills/melee"){
                power = item.experience.toFixed();
            }else if(item.skillHrid === "/skills/magic"){
                magic = item.experience.toFixed();
            }
        }
        if(Number(ranged) + Number(attack) + Number(power) + Number(magic) < 791) {
            console.log("小于10级不上传:", data);
            return;
        }
        data.skill=ranged+","+attack+","+power+","+magic;
        console.log("上传player:", data);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: config.sikll_upload,
                headers: {
                    "Content-Type": "application/json",
                    "reporter":reporter,
                    "apiVersion":config.api_version
                },
                data:JSON.stringify(data),
                onload: function (response) {
                    console.log("player 上传成功：",response);
                    resolve();
                },
                onerror: function (error) {
                    localStorage.removeItem('scriptNiuniu0xa2c2aShop');
                    console.error("player 上传失败：",error);
                    reject(error);
                }
            });
        });
    }
    function getWeapon(wearableItemMap){
        let hand = wearableItemMap['/item_locations/main_hand']?.itemHrid
        if(hand === undefined){
            hand = wearableItemMap['/item_locations/two_hand']?.itemHrid
        }
        if(hand === undefined) return null;

        let weapon = hand?.substr(7);
        if (weapon?.includes("_bow") || ["gobo_shooter"].includes(weapon)) {
            return "弓";
        } else if (weapon?.includes("_crossbow") || [].includes(weapon)) {
            return "弩";
        } else if (weapon?.includes("_water_staff") || ["rippling_trident", "frost_staff"].includes(weapon)) {
            return "水法";
        } else if (weapon?.includes("_fire_staff") || ["gobo_boomstick", "blazing_trident", "infernal_battlestaff"].includes(weapon)) {
            return "火法";
        } else if (weapon?.includes("_nature_staff") || ["jackalope_staff", "blooming_trident"].includes(weapon)) {
            return "自然";
        } else if (weapon?.includes("_sword") || ["gobo_slasher", "werewolf_slasher"].includes(weapon)) {
            if (weapon === "cheese_sword") return null;//排除新手村武器奶酪剑
            return "剑";
        } else if (weapon?.includes("_mace") || ["gobo_smasher", "granite_bludgeon", "chaotic_flail"].includes(weapon)) {
            return "锤";
        } else if (weapon?.includes("_spear") || ["gobo_stabber"].includes(weapon)) {
            return "枪";
        } else if (weapon?.includes("_bulwark")) {
            return "盾";
        }
        return null;
    }
    // 上传初始化登录数据
    function uploadInitCharacterData(obj){
        reporter = obj?.character?.id;
        if(obj?.character?.gameMode !== "standard") return;//跳过铁牛
        let isUploadPlayer = true;
        let scriptNiuniu0xa2c2aShop = localStorage.getItem("scriptNiuniu0xa2c2aShop");
        let localPlayer = null;
        let locatParty = null;
        if(scriptNiuniu0xa2c2aShop){
            scriptNiuniu0xa2c2aShop = JSON.parse(scriptNiuniu0xa2c2aShop);
            localPlayer = scriptNiuniu0xa2c2aShop.player;
            locatParty = scriptNiuniu0xa2c2aShop.party;
        }
        if((Date.now() - localPlayer?.[reporter])/60000 < 300){//刷新页面个人信息上传间隔5h
            isUploadPlayer = false;
        } else {
            for(const key in localPlayer){
                if((Date.now() - localPlayer?.[key])/60000 > 300){//清理超过5h的记录
                    delete localPlayer[key];
                }
            }
            localStorage.setItem("scriptNiuniu0xa2c2aShop", JSON.stringify({"player":localPlayer,"party":locatParty}));
        }
        if(isUploadPlayer){
            const fake_profile_shared={}
            fake_profile_shared.type="profile_shared";
            fake_profile_shared.profile={};
            fake_profile_shared.profile.characterSkills=obj.characterSkills;
            fake_profile_shared.profile.combatLevel=obj.combatUnit.combatDetails.combatLevel;
            if(obj.guild){
                fake_profile_shared.profile.guildName=obj.guild.name;
                fake_profile_shared.profile.guildRole=obj.guildCharacterMap[obj.character.id].role;
            }else{
                fake_profile_shared.profile.guildName="";
                fake_profile_shared.profile.guildRole="";
            }
            fake_profile_shared.profile.sharableCharacter=obj.character;
            fake_profile_shared.profile.wearableItemMap={}
            obj.characterItems.forEach(item=>{
                if(item.itemLocationHrid!='/item_locations/inventory'){
                    fake_profile_shared.profile.wearableItemMap[item.itemLocationHrid]=item;
                }
            })
            uploadProfileShared(fake_profile_shared)
        };
        uploadPartyInfo(obj);
    }

    // 上传组队数据
    function uploadPartyInfo(obj){
        let data={};
        if(obj?.partyInfo?.party?.status !== "battling") return;
        const partyInfo = obj?.partyInfo
        data.id=partyInfo.party.id;
        data.map=partyInfo.party.actionHrid.substr(16);
        let difficultyTier = partyInfo?.party?.difficultyTier;
        if((difficultyTier !==null)&& (difficultyTier !== undefined)){
            data.map = data.map + "#" + difficultyTier;
        }

        data.players="";
        for(let k in partyInfo.sharableCharacterMap){
            if(data.players) data.players += ","
            data.players += partyInfo.sharableCharacterMap[k].name
        }

        let isUploadParty = true;
        let scriptNiuniu0xa2c2aShop = localStorage.getItem("scriptNiuniu0xa2c2aShop");
        let localPlayer = null;
        let locatParty = null;
        if(scriptNiuniu0xa2c2aShop){
            scriptNiuniu0xa2c2aShop = JSON.parse(scriptNiuniu0xa2c2aShop);
            localPlayer = scriptNiuniu0xa2c2aShop.player;
            locatParty = scriptNiuniu0xa2c2aShop.party;
        }

        if(isUploadParty && (locatParty !==null)&& (locatParty !== undefined) &&(data.players === locatParty?.players)&&(data.map === locatParty?.map)&& (locatParty?.id === data.id) && ((Date.now() - locatParty?.dateTime)/60000 < 120)){
            isUploadParty = false;
        } else {
            locatParty={"dateTime":Date.now(),...data};
            localStorage.setItem("scriptNiuniu0xa2c2aShop", JSON.stringify({"player":localPlayer,"party":locatParty}));
        }

        if(!isUploadParty) return;
        console.log("上传party：",data);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: config.party_upload,
                headers: {
                    "Content-Type": "application/json",
                    "reporter":reporter,
                    "apiVersion":config.api_version
                },
                data:JSON.stringify(data),
                onload: function (response) {
                    console.log("party 上传成功：",response);
                    resolve();
                },
                onerror: function (error) {
                    localStorage.removeItem('scriptNiuniu0xa2c2aShop');
                    console.error("party 上传失败：", error);
                    reject(error);
                }
            });
        });
    }

    //组队情况
    function addPartyButton() {
        const waitForNavi = () => {
            const targetNode = document.querySelector("div.NavigationBar_minorNavigationLinks__dbxh7"); // 确认这个选择器是否适合你的环境
            const navigationLinks = document.querySelectorAll('div.NavigationBar_minorNavigationLink__31K7Y');
            let toolLink;
            for (let link of navigationLinks) {
                if (link.textContent.includes('插件设置')||link.textContent.includes('Script settings')) {
                    toolLink = link;
                    break;
                }
            }
            if (targetNode&&toolLink) {
                let statsButton = document.createElement("div");
                statsButton.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                statsButton.style.color = toolLink.style.color;
                statsButton.innerHTML = "国人组队情况";
                statsButton.addEventListener("click", () => {
                    window.open("https://niuniu.0xa2c2a.shop/party.html", "_blank");
                });
                // 将按钮添加到目标节点
                targetNode.insertBefore(statsButton, toolLink.nextSibling);
            } else {
                setTimeout(addPartyButton, 200);
            }
        };
        waitForNavi(); // 开始等待目标节点出现
    }

    //菜单
    GM_registerMenuCommand('重置上传间隔', function() {
        localStorage.removeItem('scriptNiuniu0xa2c2aShop');
        alert("重置成功")
    });

})();