// ==UserScript==
// @name        知乎推荐流优化
// @namespace   ZhihuFeedOptimization
// @license     GPLv3
// @match       https://www.zhihu.com/
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @version     0.3.9
// @run-at      document-idle
// @author      lisolaris
// @icon        https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @description 优化知乎首页推荐流的内容，如移除灌水用户、按屏蔽词屏蔽等
// @downloadURL https://update.greasyfork.org/scripts/498139/%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E6%B5%81%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/498139/%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E6%B5%81%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(async  function () {
    'use strict';

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const DEFAULTAVATARHASH = "abed1a8c04700ba7d72b45195223e0ff";
    const DEFAULTAVATARHASHEXTENDS = new Set(["e1b6192aa0d8dcf140ba189dea518a4c", "1abe7b115ea0ab9e5dfe334d5a1fef38", "f1be5ed24936a7311e75da3884b2bd6d", "e5aeb4872c80f1b3edccc46617dfe3de", "10b20470e80a6274affe25aeba407dce", "5fc67a2efe2e8f52b40fac8a80da1442", "25ac7c0d6225fc37e7f4419d75895b22"]);

    const RERE = /^\/.+\/$/

    const userChecked = new Set();
    const cardsToBeDeletedWithBannedWord = new Set();
    const cardsToBeDeletedWithDefaultAvatar = new Set();

    const bannedWords = new Set();
    const bannedWordsRegex = new Set();

    var bannedWordsJson = GM_getValue("bannedWords", "[]");
    var bannedWordsRegexJson = GM_getValue("bannedWordsRegex", "[]");

    var errorConfirmed = false;

    if (bannedWordsJson.length)
        for (let word of JSON.parse(bannedWordsJson))
            bannedWords.add(word);
    if (bannedWordsRegexJson.length)
        for (let word of JSON.parse(bannedWordsRegexJson))
            bannedWordsRegex.add(new RegExp(word.slice(1, -1)));

    var newCardsThreshold = parseInt(GM_getValue("newCardsThreshold", "5"));
    var answerCountThreshold = parseInt(GM_getValue("answerCountThreshold", "100"));
    var enableDefaultAvatarFilter = parseInt(GM_getValue("defaultAvatarFilter", "1"));
    var enableUsernameAuxJudgment = parseInt(GM_getValue("usernameAuxJudgment", "1"));
    var enableAutoSendUninterestWithBannedWordCard = parseInt(GM_getValue("autoSendUninterestWithBannedWordCard", "1"));
    var enableUseExtendAvatarDatabase = parseInt(GM_getValue("useExtendAvatarDatabase", "0"));
    var enableRemoveHeadPageThinkingTable = parseInt(GM_getValue("RemoveHeadPageThinkingTable", "0"))

    async function checkIfBannedWordInCard(newCards){
        for (let card of newCards){
            // 等待 并心怀希望 卡片子元素的属性添加完毕后再做检查
            // for (let i=0; i<10 || !card.querySelector("div.ContentItem").hasAttribute("data-za-extra-module"); i++) console.log(`checkIfBannedWordInCard 等待${i}次`);
            // 检查标题是否含有用户屏蔽词
            let cardTitle = card.querySelector("h2").textContent.toLowerCase();

            for (let regex of bannedWordsRegex){
                if (cardTitle.match(regex)){
                    let cardItem = card.querySelector("div.ContentItem");
                    let userId = JSON.parse(cardItem.getAttribute("data-za-extra-module")).card.content.author_member_hash_id;
                    console.log(`%c知乎推荐流优化 待删除列表中加入: ${userId}, 原因: 用户屏蔽正则 ${regex}`, "color:#00A2E8");
                    cardsToBeDeletedWithBannedWord.add(card);
                    return;
                }
            }

            for (let word of bannedWords){
                if (cardTitle.includes(word)){
                    let cardItem = card.querySelector("div.ContentItem");
                    let userId = JSON.parse(cardItem.getAttribute("data-za-extra-module")).card.content.author_member_hash_id;
                    console.log(`%c知乎推荐流优化 待删除列表中加入: ${userId}, 原因: 用户屏蔽词 ${word}`, "color:#00A2E8");
                    cardsToBeDeletedWithBannedWord.add(card);
                    return;
                }
            }
        }
    }

    // 为了获取评论区的用户回答数量 将检查用户信息的部分分离出来
    async function checkIfUserMatchedConditions(userId){
        let userInfo = {"matched": false, "isDefaultAvatar": false, "isDefaultUsername":false, "answerCount": 0};
        let fetchPromises = [];
        // console.log("知乎推荐流优化 查询用户 " + userId);
        fetchPromises.push(
            fetch(`https://api.zhihu.com/people/${userId}/profile?profile_new_version=1`, {credentials: "include"})
                .then(response => response.json())
                .then(data => {
                    // data.error: 大量请求知乎api后被反爬虫识别 需要到所给出的页面中进行真人验证
                    if (data.error){
                        console.log(JSON.stringify(data));
                        if (!errorConfirmed){   // 只弹出一次错误信息窗口
                            if (confirm(`知乎推荐流优化 请求后端接口时发生错误：${data.error.message}`)){
                                errorConfirmed = true;
                                if (data.error.redirect)
                                    window.open(data.error.redirect);
                            }
                        }
                    }
                    else {
                        // console.log("用户 " + userId + " 头像URL " + data.avatar_url_template);
                        // 判定条件: 是默认头像 且 (回答数小于设定阈值 或 (用户是否启用 与 以“知乎用户”为用户名的开头))
                        // 真值表参见说明文档
                        userInfo["isDefaultAvatar"] = data.avatar_url_template.toLowerCase().includes(DEFAULTAVATARHASH);
                        if (enableUseExtendAvatarDatabase)
                            for (let hash of DEFAULTAVATARHASHEXTENDS)
                                userInfo["isDefaultAvatar"] |= data.avatar_url_template.toLowerCase().includes(hash);

                        userInfo["isDefaultUsername"] = data.name.search(/^知乎用户/) == 0;
                        userInfo["answerCount"] = data.answer_count;

                        if (userInfo["isDefaultAvatar"] && (userInfo["answerCount"] < answerCountThreshold || (enableUsernameAuxJudgment && userInfo["isDefaultUsername"])))
                                // if (!(cardType === "article" && data.favorited_count > 50)){
                                userInfo["matched"] = true;
                    }
                })
                .catch(error => {
                    console.error('发生错误：', error);
                })
        );
        await Promise.all(fetchPromises);
        fetchPromises.length = 0;
        return userInfo;
    }

    async function checkIfAuthorDefaultAvatarInCard(newCards){
        for (let card of newCards) {
            // for (let i=0; i<10 || !card.querySelector("div.ContentItem").hasAttribute("data-za-extra-module"); i++) console.log(`checkIfAuthorDefaultAvatarInCard 等待${i}次`);
            if (!card.querySelector("div.ContentItem").hasAttribute("data-za-extra-module"))
                await sleep(500);

            let userId = JSON.parse(card.querySelector("div.ContentItem").getAttribute("data-za-extra-module")).card.content.author_member_hash_id;

            // 此用户已经被检查过/将要检查的卡片已经在待删除列表里 跳过检查
            if (userChecked.has(userId) || cardsToBeDeletedWithBannedWord.has(card) || cardsToBeDeletedWithDefaultAvatar.has(card)) continue;
            else {
                try{
                    let userInfo = checkIfUserMatchedConditions(userId);
                    if (userInfo["matched"]){
                        console.log(`%c知乎推荐流优化 待删除列表中加入: ${userId}, 原因: 默认头像${userInfo["isDefaultUsername"] ? ' 默认用户名': ''}, 用户回答数量: ${userInfo["answerCount"]}`, "color:#00A2E8");
                        cardsToBeDeletedWithDefaultAvatar.add(card);
                    }
                    else userChecked.add(userId.toLowerCase());
                }
                catch (e){
                    console.error(e);
                }
            }
        }
    }

    function removeCard() {
        if (cardsToBeDeletedWithBannedWord.size + cardsToBeDeletedWithDefaultAvatar.size > 0){
            console.log("知乎推荐流优化 开始移除卡片");

            // 研究了一圈似乎js并没有类似python中enumerate()这样的额外赋值枚举功能 先这样写着看看以后能不能找到更好的方法
            for (let cardSet of [cardsToBeDeletedWithBannedWord, cardsToBeDeletedWithDefaultAvatar]){
                for (let card of cardSet){
                    let cardItem = card.querySelector("div.ContentItem");
                    let cardText = card.querySelector("span.RichText.ztext.CopyrightRichText-richText").textContent;
                    const urls = [];
                    if (card.querySelectorAll("meta[itemprop='url']").length != 0){
                        for (let url of card.querySelectorAll("meta[itemprop='url']")){
                            urls.push(url.getAttribute("content"));
                        }
                    }
                    // 经测试不能直接通过xhr请求向知乎api发送不感兴趣 只能通过模拟点击来实现
                    let isAutoSendUninterest = Boolean(cardSet === cardsToBeDeletedWithBannedWord && enableAutoSendUninterestWithBannedWordCard);
                    if (isAutoSendUninterest){
                        const floatLayerMenuObConfig = {attributes: false, childList: true, subtree: false};
                        const floatLayerMenuObserver = new MutationObserver(function(mutationRecords, observer){
                            for (let mutation of mutationRecords){
                                if (mutation.addedNodes.length != 0){
                                    let popWind = mutation.addedNodes[0].querySelector("div.Popover-content");
                                    if (popWind)
                                        for (let button of popWind.querySelectorAll("button"))
                                            if (button.innerText === "不喜欢该内容")
                                                button.click();
                                }
                            }

                            observer.disconnect();
                        });
                        floatLayerMenuObserver.observe(document.body, floatLayerMenuObConfig);
                        // 在开始监视后再点击按钮
                        card.querySelector("button.Button.OptionsButton").click();
                    }
                    console.log(`%c知乎推荐流优化 已移除卡片: ${cardItem.getAttribute("data-zop")}, 原链接: ${JSON.stringify(urls)}, 预览: ${cardText}, 已不感兴趣: ${isAutoSendUninterest ? "是" : "否"}`, "color:#FF00FF");
                    // 不可使用card.remove() 会导致点击首页顶部推荐按钮刷新页面时出错（removeChild()失败）
                    card.setAttribute("hidden", "")
                }
            }
            cardsToBeDeletedWithBannedWord.clear();
            cardsToBeDeletedWithDefaultAvatar.clear();
        }
    }

    async function checkCards(newCards=null){
        var cards;
        if (!newCards) cards = Array.from(document.getElementsByClassName("Card TopstoryItem TopstoryItem-isRecommend"));
        else cards = newCards;

        // for (let c of cards) console.log(c.querySelector('h2').innerText);
        console.log("知乎推荐流优化 检查新获得的推荐卡片列表……");
        checkIfBannedWordInCard(cards);
        if (enableDefaultAvatarFilter)
            checkIfAuthorDefaultAvatarInCard(cards);

        console.log("知乎推荐流优化 完成检查");
        removeCard();
    }

    // 当检查到推荐流列表发生更新时的回调函数
    // 在新增的卡片超过五个后即将新增的卡片传入findDefaultAvatarCard()对作者头像进行检查
    function isNodeAddedCallback(mutationRecords, observer){
        const newAddedCards = new Set();

        for (let mutation of mutationRecords){
            if (mutation.addedNodes.length != 0)
                if (mutation.addedNodes[0].className === "Card TopstoryItem TopstoryItem-isRecommend")
                    newAddedCards.add(mutation.addedNodes[0]);
        }

        if (newAddedCards.size >= newCardsThreshold){
            checkCards(Array.from(newAddedCards));
            newAddedCards.clear();
        }
    }

    // 不知道为什么卡片中data-za-extra-module这个属性会在整个页面的DOM树加载完成后才被添加进去
    // 使用MutationServer对页面中第一个卡片的属性进行监视 待此属性被添加后即对首页的卡片进行检查
    // 由于需要等待页面加载完成（至少第一个ContentItem被加载出来）故不可避免地有感知（能看到卡片突然从眼前消失）
    async function pageReloadCheck(sleepTime){
        console.log(`知乎推荐流优化 等待${sleepTime}ms再开始页面重加载后检查`);
        await sleep(sleepTime);
        const pageReloadCheckObConfig = {attributes: true, childList: false, subtree: false};
        const pageReloadCheckObserver = new MutationObserver(function (mutationRecords, observer){
            for (let mutation of mutationRecords)
                if (mutation.attributeName === "data-za-extra-module"){
                    // console.log(mutation);
                    checkCards();
                    // 仅用于第一次加载/刷新时对页面最顶上的几个卡片进行检查 完成后即停止MutationObserver的监视
                    observer.disconnect();
                }
            }
        );
        const pageReloadCheckContentItemElem = document.querySelector("div.ContentItem");
        pageReloadCheckObserver.observe(pageReloadCheckContentItemElem, pageReloadCheckObConfig);
    }

    // 油猴菜单与初始化日志相关代码 以IIFE函数的形式封装方便折叠
    (function (){
        var menuId_setNewCardsCountThreshold = null;
        var menuId_setAnswerCountThreshold = null;
        var menuId_toggleDefaultAvatarFilter = null;
        var menuId_toggleUsernameAuxJudgment = null;
        var menuId_toggleAutoSendUninterest = null;
        var menuId_toggleUseExtendAvatarDatabase = null;
        var menuId_toggleRemoveHeadPageThinkingTable = null;

        function menuAddBannedWords(){
            let words = prompt("请输入屏蔽词，输入多个时以','分隔: ");
            // console.log("知乎推荐流优化 用户输入: " + words);
            if (words){
                words = words.replaceAll(/\s*/g, "").replaceAll("，", ",");    // \s: 匹配空白字符（空格、制表符、换行符）

                let wordlist = words.split(",");
                let newRegexes = [];
                let newWords = [];

                for (let word of wordlist){
                    if (word.match(RERE)){
                        newRegexes.push(word);
                        bannedWordsRegex.add(new RegExp(word.slice(1, -1)));
                    }
                    else{
                        newWords.push(word);
                        bannedWords.add(word);
                    }
                }

                bannedWordsJson = JSON.stringify(Array.from(bannedWords));
                bannedWordsRegexJson = JSON.stringify(Array.from(bannedWordsRegex).map(x => x.toString()));
                GM_setValue("bannedWords", bannedWordsJson);
                GM_setValue("bannedWordsRegex", bannedWordsRegexJson);

                alert("知乎推荐流优化\n"
                     + (newWords.length > 0 ? `已添加屏蔽词: ${JSON.stringify(newWords)}\n` : "")
                     + (newRegexes.length > 0 ? `已添加正则表达式: ${JSON.stringify(newRegexes)}\n` : "")
                     + `\n当前屏蔽词库: ${bannedWordsJson}\n`
                     + `当前屏蔽正则库: ${bannedWordsRegexJson}\n`);
                console.log("知乎推荐流优化 用户屏蔽词库: " + bannedWordsJson);
                console.log("知乎推荐流优化 用户屏蔽正则库: " + bannedWordsRegexJson);
            }
        }

        function menuRemoveBannedWords(){
            let words = prompt("知乎推荐流优化 请输入要移除的屏蔽词，输入多个时以','分隔: \n可通过输入“清空全部屏蔽词！”来清空已设置的屏蔽词库 ");
            // console.log("知乎推荐流优化 用户输入: " + words);
            if (words){
                if (words === "清空全部屏蔽词！"){
                    if (confirm("知乎推荐流优化 确定要清空屏蔽词列表吗？")){
                        bannedWordsJson = "[]";
                        bannedWordsRegexJson = "[]";
                        bannedWords.clear();
                        bannedWordsRegex.clear();
                        GM_setValue("bannedWords", bannedWordsJson);
                        GM_setValue("bannedWordsRegex", bannedWordsRegexJson);
                        alert("知乎推荐流优化 已清空屏蔽词列表");
                    }
                }
                else{
                    words = words.replaceAll(/\s*/g,"").replaceAll("，", ",");
                    let wordlist = words.split(",");
                    let delWords = [];
                    let delRegexes = [];
                    for (let word of wordlist){
                        if (word.match(RERE)){
                            delRegexes.push(word);
                        }
                        else{
                            delWords.push(word);
                            bannedWords.delete(word);
                        }
                    }

                    if (delRegexes.length)
                        for (let re of bannedWordsRegex)
                            if (delRegexes.includes(re.toString()))
                                bannedWordsRegex.delete(re)

                    bannedWordsJson = JSON.stringify([...bannedWords])
                    bannedWordsRegexJson = JSON.stringify([...bannedWordsRegex].map(x => x.toString()));
                    GM_setValue("bannedWords", bannedWordsJson);
                    GM_setValue("bannedWordsRegex", bannedWordsRegexJson);

                    alert("知乎推荐流优化\n"
                        + (delWords.length > 0 ? `已删除屏蔽词: ${JSON.stringify(delWords)}\n` : "")
                        + (delRegexes.length > 0 ? `已删除正则表达式: ${JSON.stringify(delRegexes)}\n` : "")
                        + `\n当前屏蔽词库: ${bannedWordsJson}\n`
                        + `当前屏蔽正则库: ${bannedWordsRegexJson}\n`);
                }
                console.log("知乎推荐流优化 用户屏蔽词库: " + bannedWordsJson);
                console.log("知乎推荐流优化 用户屏蔽正则库: " + bannedWordsRegexJson);
            }
        }

        function menuSetAnswerCountThreshold(){
            let threshold = prompt("知乎推荐流优化 请输入数值: \n答案数量阈值用于确定是否移除使用默认头像，但有较多回答数的账号生产的内容", answerCountThreshold);
            if (!isNaN(parseInt(threshold))){
                GM_setValue("answerCountThreshold", parseInt(threshold));
                answerCountThreshold = parseInt(threshold);
                menuUpdateVariableMenuInOrder();
            }
        }

        function menuSetNewCardsCountThreshold(){
            let threshold = prompt("知乎推荐流优化 请输入数值: \n新卡片数量阈值用于设定下滑刷新内容时需要多少新卡片来触发移除机制", newCardsThreshold);
            if (!isNaN(parseInt(threshold))){
                GM_setValue("newCardsThreshold", parseInt(threshold));
                newCardsThreshold = parseInt(threshold);
                menuUpdateVariableMenuInOrder();
            }
        }

        function menuToggleDefaultAvatarFilter(){
            enableDefaultAvatarFilter = !enableDefaultAvatarFilter;
            GM_setValue("defaultAvatarFilter", (enableDefaultAvatarFilter ? 1 : 0));
            menuUpdateVariableMenuInOrder();
        }

        function menuToggleUsernameAuxJudgment(){
            enableUsernameAuxJudgment = !enableUsernameAuxJudgment;
            GM_setValue("usernameAuxJudgment", (enableUsernameAuxJudgment ? 1 : 0));
            menuUpdateVariableMenuInOrder();
        }

        function menuToggleAutoSendUninterest(){
            enableAutoSendUninterestWithBannedWordCard = !enableAutoSendUninterestWithBannedWordCard;
            GM_setValue("autoSendUninterestWithBannedWordCard", (enableAutoSendUninterestWithBannedWordCard ? 1 : 0));
            menuUpdateVariableMenuInOrder();
        }

        function menuToggleUseExtendAvatarDatabase(){
            enableUseExtendAvatarDatabase = !enableUseExtendAvatarDatabase;
            GM_setValue("useExtendAvatarDatabase", (enableUseExtendAvatarDatabase ? 1 : 0));
            menuUpdateVariableMenuInOrder();
        }

        function menutoggleRemoveHeadPageThinkingTable(){
            enableRemoveHeadPageThinkingTable = !enableRemoveHeadPageThinkingTable;
            GM_setValue("RemoveHeadPageThinkingTable", (enableRemoveHeadPageThinkingTable ? 1 : 0));
            if (enableRemoveHeadPageThinkingTable){
                document.querySelector("div.WriteArea.Card").setAttribute("hidden", "");
                console.log("%c知乎推荐流优化 已隐藏首页顶部想法编辑栏", "color:#FF00FF");
            }
            else{
                document.querySelector("div.WriteArea.Card").removeAttribute("hidden");
                console.log("%c知乎推荐流优化 已取消隐藏首页顶部想法编辑栏", "color:#21E589");
            }
            menuUpdateVariableMenuInOrder();
        }

        // 用于确保刷新数据后 在脚本管理器菜单里的各个项目顺序是正确的
        function menuUpdateVariableMenuInOrder(){
            GM_unregisterMenuCommand(menuId_setAnswerCountThreshold);
            GM_unregisterMenuCommand(menuId_setNewCardsCountThreshold);
            GM_unregisterMenuCommand(menuId_toggleDefaultAvatarFilter);
            GM_unregisterMenuCommand(menuId_toggleUsernameAuxJudgment);
            GM_unregisterMenuCommand(menuId_toggleAutoSendUninterest);
            GM_unregisterMenuCommand(menuId_toggleUseExtendAvatarDatabase);
            GM_unregisterMenuCommand(menuId_toggleRemoveHeadPageThinkingTable);

            menuId_setNewCardsCountThreshold = GM_registerMenuCommand(`设置新卡片数量阈值（${newCardsThreshold}）`, menuSetNewCardsCountThreshold);
            menuId_toggleAutoSendUninterest = GM_registerMenuCommand(`是否自动点击不感兴趣（${enableAutoSendUninterestWithBannedWordCard ? "是" : "否"}）`, menuToggleAutoSendUninterest, {autoClose: false});
            menuId_toggleDefaultAvatarFilter = GM_registerMenuCommand(`是否启用默认头像屏蔽（${enableDefaultAvatarFilter ? "是" : "否"}）`, menuToggleDefaultAvatarFilter, {autoClose: false});
            if (enableDefaultAvatarFilter){ // 在启用了屏蔽默认头像后才会显示相关菜单
                menuId_setAnswerCountThreshold = GM_registerMenuCommand(` - 设置答案数量阈值（${answerCountThreshold}）`, menuSetAnswerCountThreshold);
                menuId_toggleUsernameAuxJudgment = GM_registerMenuCommand(` - 是否启用用户名辅助判定（${enableUsernameAuxJudgment ? "是" : "否"}）`, menuToggleUsernameAuxJudgment, {autoClose: false});
                menuId_toggleUseExtendAvatarDatabase = GM_registerMenuCommand(`是否使用扩展默认头像库（${enableUseExtendAvatarDatabase ? "是" : "否"}）`, menuToggleUseExtendAvatarDatabase, {autoClose: false});
            }
            menuId_toggleRemoveHeadPageThinkingTable = GM_registerMenuCommand(`是否隐藏首页顶部想法编辑栏（${enableRemoveHeadPageThinkingTable ? "是" : "否"}）`, menutoggleRemoveHeadPageThinkingTable, {autoClose: false});
        }

        GM_registerMenuCommand("添加屏蔽词", menuAddBannedWords);
        GM_registerMenuCommand("删除屏蔽词", menuRemoveBannedWords);
        menuUpdateVariableMenuInOrder();

        console.log("知乎推荐流优化 用户屏蔽词库: " + JSON.parse(bannedWordsJson).join(", "));
        console.log("知乎推荐流优化 用户屏蔽正则库: " + JSON.parse(bannedWordsRegexJson).join(", "));
        console.log("知乎推荐流优化 答案数量阈值: " + answerCountThreshold);
        console.log("知乎推荐流优化 新卡片数量阈值: " + newCardsThreshold);
        console.log("知乎推荐流优化 是否启用默认头像屏蔽: " + (enableDefaultAvatarFilter ? "是" : "否"));
        console.log("知乎推荐流优化 是否使用用户名作为辅助判断: " + (enableUsernameAuxJudgment ? "是" : "否"));
        console.log("知乎推荐流优化 是否自动对匹配屏蔽词的卡片点击不感兴趣: " + (enableAutoSendUninterestWithBannedWordCard ? "是" : "否"));
        console.log("知乎推荐流优化 是否使用扩展默认头像库: " + (enableUseExtendAvatarDatabase ? "是" : "否"));
        console.log("知乎推荐流优化 是否隐藏首页顶部想法编辑栏: " + (enableRemoveHeadPageThinkingTable ? "是" : "否"));
    })();

    const recomBody = document.querySelector("div.Topstory-recommend");
    const recomButton = document.querySelector("a.TopstoryTabs-link.Topstory-tabsLink.is-active[aria-controls='Topstory-recommend']");

    recomButton.addEventListener("click", (() => pageReloadCheck(1500)));
    const bodyObConfig = {attributes: false, childList: true, subtree: true};
    const bodyObserver = new MutationObserver(isNodeAddedCallback);
    bodyObserver.observe(recomBody, bodyObConfig);
    // setInterval(function() {
    //     console.log(`cardsToBeDeletedWithBannedWord(${cardsToBeDeletedWithBannedWord.size}): ` + JSON.stringify(Array.from(cardsToBeDeletedWithBannedWord)));
    //     console.log(`cardsToBeDeletedWithDefaultAvatar(${cardsToBeDeletedWithDefaultAvatar.size}): ` + JSON.stringify(Array.from(cardsToBeDeletedWithDefaultAvatar)));
    //     console.log(`userChecked(${userChecked.size}): ` + JSON.stringify(Array.from(userChecked)));
    // },
    // 5000);
    console.log(`知乎推荐流优化v${GM.info.script.version} 已加载完成`);

    // 首次加载时间较长 等待后再做检查
    await sleep(1000);
    if (enableRemoveHeadPageThinkingTable){
        document.querySelector("div.WriteArea.Card").setAttribute("hidden", "");
        console.log("%c知乎推荐流优化 已隐藏首页顶部想法编辑栏", "color:#FF00FF");
    }
    checkCards();
})();
