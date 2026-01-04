// ==UserScript==
// @name         【FSU 24年3月底临时版】EAFC FUT WEB 增强器 
// @namespace    https://futcd.com/
// @version      24.13.20240327.02
// @description  FC网页版更新后无法使用FSU，所幸有大佬发现简单修改后就可以临时用用，分享给大家。我并非FSU原作者，也非这个修改方法的发现者，只是一位普通的fc爱好者，在他们工作的基础上给大家临时的提供了一个方法。后续仍然在等待FSU作者的官方更新。
// @author       FSU原作者Futcd_kcka ，临时版本修改者B站 大棒居-杨大棒
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @require      https://cdn.staticfile.org/lodash.js/4.17.21/lodash.min.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJ/ElEQVR4nO2dfbRVRRmHHxRNxDBNQlCWSqQ3MgOzUsNSCmOR5CIM+iJcZbhSpGWJSCpiUIvKzDJcoRCGRJlUrK5laloKSqRSkHx5L9GqqFiBukjFoAv98bunS+fMPmdmz+zZe9/O8w+LzZx3hv07Zz7eeeedHvv376eas+burnlWMHoBZwIXAAOAE4AewDbgb8DPgceB5/JqoA2rrulV86xnDu3woQ9wLTAJ6Fen3BRgF/AD4EbgL9k3LQwH5d0ABz4NtAFXU1+MCn2AS4DNwOeBg7NrWjjKIMi7gJXALcBrUnz+cOB6YCPwoXDNyoYiC/J64IfAL4C3B7D3OmAp8BBwXgB7mVBEQQ4B5gAbgPdnYH8E8DAwH+ifgX0viibIeNTnXxuhrsloTPpUhLqsKYogI4AVwN3ASRHr7Q3cBqwHPhyx3kTyFmQg6joeAobn2I4hwHeBVmBoju3IVZCrgHbUdRSFC4DfAjcDr8qjAXkIMg7YBHwFODSH+m24EthCDuNLTEHejKawy4BTItablqPR+LIGOD9WpTEEOQKYBzyJFnllYxhwP3AP8pllStaCVNwdlwWy9zTwReB24IU65fYBi5Efa2Wgui+iyw3TO5DNGrISZAxa2N0CHBvA3g7gE8Ab0RrlUmAwsNVQ9gU0a5oEzALOAd6LXCe+vAK5YbYAnwxgr4bQgrQAy4GfINdHCOYit8e3q55vB6Yays9E3+QD+RkSaTrwYoA29UO/0l8Sxq3zX0IJ8krUlWwELgxksxU4A5gBPJ9QxvQL+X0dm19GE4pvebWsi3NRlzgfOD6EwRCCXIamsTMC2ALNakYD7wOealD2MMOz2l2f/2Ubms6eBdzn3Dozk9E7uNLXkI8gI4FH0AxqgG9D0O7e1Wh6bPuiTO23/T/9Ggk/CfiD5Wfq0RstKB8A3pPWSBpBTgQWdFb8jrQVV/Ed4GS0WIzN4s66vwTsCWBvJNpCXgi8wfXDroLcCDyDZjwhaAXOBi5GM6m86ACuQZOSBYFsfhxN07+OxlgrbAU5Fg1eM9F+hS9bgY+gcWJVAHuh2Iqms+8kXLumIm/yMJvCNoIMANYRZnq3B5iNZjpLA9jbF8CGiUfRL3cKml77MhBNVs5sVLCRIIcAq4G+ARq1BC3mZgJ7A9iD5OlwKOYBr0XT5Y4A9lYCx9Ur0EiQxfjPr1ehvY6JwJ89bVUzJrA9Ey+iBWUL8CNPWwejRXMi9QQZCnzQo/KdKAznbOAxDzsmjkJuka8FtluPdrR1MBqNCWk5HU21jdQT5JspK9xPl7tjYUobSZwIfAP5km4IbNuW+4BT0WC9K6WNm5L+IUmQAaQbxJegPncGYcM4hwF3oQXcFegXkje3AoNIt3Y6BrldakgSZJxjBX9HHtWJmP1LaXkbis1aA3wUxe8WiZ10eReedPzseNPDpNjeMxwMP4vGmxDTwwrvRuPPhIA2s2QN8BbgN51/2tBiepgkyCCHxowinBgT0F5HzMjCowjXvZ6Lou/7WJQ1zl6TuqxjLBvwK+AJy7L1uBg5+75PXDFGo8j4LWh30zfo4iUUcW/DEaaHSYLYroBXW5Yz0RNN/9YBi9B4EZupKBh7ENrd3NL57EgPmw9aljO+4yRBak/xmHnZstyBHIkWWs8Ad6Jt2bx4vurvxyNnYBuKL667qk7AtvszvmPfDSqXAz89gOvQAmsucUNGk0hyh/RFe/dtwOccbXo5X2OeoLoX9dllohfwBdSV3W35Ga+peaxAuVMonxgHcolD2VIIMiRSPVnh4p22HX+NxBIkzeBfJEJtFzQkliBe35r/J/I+H9KkiqYgBaMpSMGIJUhm0eKR+JdD2bSbVkA8QTZFqicrjnYo6xXFGWulvh45EiuRfNWzrh6GZyYqi64O5KK4EG0VZ815aIewjeQvcQda2XvF98Z0nSzOwOZStDl0IFlMsQ9CMVqZU/ZB3bRgK0WSmSTKLohpZ64pSI6YuqdSewXKLoiJokWmONEdBWn+QnLENKg3fyE54rUqLiIx1yFvoiulhm+3sg+F0ZhOcmW1d/EoOm6dNIvbixLWjMPjvcYS5CTgd5HqyoLV6FSVDZeTPlA9Wpd1eqR6ssIlXrnac+BEkiChB8aXAtuLzeEOZV0ckTX4BsrZUuqpaEzKPsvqdjQFKRhNQQpGUxA7onmQm4LY0SjDUDCagtjRGquipiCNuQMd5omCryBZ5RqJRb3//xKUgcI10bOXLy3Jl2W7Ui+1qxt4teHZ7cgXVS9VYD1MWe6sSfqG2M4qTvOpvAB8r/PPPSgb3BB0CjitGGCfw974jpN+Ic9aGh2FAsP+alm+aCxCp4ifQ7kYQzDRspzx5rWkX8gfLY0eim42KDNPE06MZdjnKTbWmSTIOodGtKC7P051+Ex3oy+67sIlJUm76WGSID92bNBw1O/egHkR1Z29vZeiEFPXC2GMebOSBNlMupxQs9CJ1epDkt1u7xvdNbIeJWV2TTTwMo6CAHzGsZIK/dFiajVKXgbh0o4XgcEoQ1Er6Q+zziZhDVdvT/0BlCMw7VVEb0WZ5NYRJ0I9aw5DNyNM87SzDaVlN9JopX4R/smFTyOicy4jJqNUIL5iQIM8kY0E2U6+l3XlzXCUpWg+SvXqywR0x1UiNr6sJ1BCs9Jc8BuAgciXtYIwWYr+DYzFInWTrXPxKZQ17q70bSoFPVGCnE0o83YI7kUZj5bbFHbx9u4EPoaypj3u2qoSMAmNE7NxC/tJog1dHTsGhzOWadzvj6CMpVOAP6X4fNEYjlK/3kmYlFG7UFbWFtwX2F77IfM6K72ZYq3EbdtyHMoBvAI5SUOwBL2TuaTcK/LdoNoNfBYtkGzzSWWNTaKb6ahLuSJQnZUrxieiJJipCbWFuwmlJR+LZ2xrAOqdEx8LrEXf4BBro3bkJhpJoHE19J76cpRU+Crgn4Ft2zKL2oyfLcBPUTL9UJtqN6HjFUHTqWcV5PBVlOkzdVi+Byeg2dJ16JabRej2uFAZ7ZYiV9A0MogpyPJ8yA7URy9A+dFHZlhXNf3R9DUka9F4memGXIwwoLXoct/xaCAtG/9Ah3CGEmF3NGZc1j3IDT+d+vfYFonKOHFbrApjB8p1oOuDBqOr8orK/cjdMY2w1240JK/Ixe0o3/s5FCtIYiO6OW4UCn6ITt6hpCvpupoiVORHGnajTNZDiBjHayJvQSosRLdtXp9D3beiW4ESd/FiUhRBQAdD56BFXIg7DhvxIOoyp+Lp7ghJkQSpsJmuW0BD3E1STTu6zfN81GUWiiIKUqEVBUpMRndc+bIXdYknE+6+2+AUWZAKd6CX6LMWqKyB5lCsrYIayiAIyFF5OUqiuczhcw+jDajxKICv8MRMPhOCDcAH0M7eaGAE0I+uAOcdaI3zGNrL3pBDG734D+mntpkNC0pxAAAAAElFTkSuQmCC
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      ea.com
// @connect      futbin.com
// @connect      futbin.org
// @connect      futcd.com
// @connect      fut.gg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490964/%E3%80%90FSU%2024%E5%B9%B43%E6%9C%88%E5%BA%95%E4%B8%B4%E6%97%B6%E7%89%88%E3%80%91EAFC%20FUT%20WEB%20%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490964/%E3%80%90FSU%2024%E5%B9%B43%E6%9C%88%E5%BA%95%E4%B8%B4%E6%97%B6%E7%89%88%E3%80%91EAFC%20FUT%20WEB%20%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("lodash")):"function"==typeof define&&define.amd?define(["lodash"],t):t((e=e||self)._)}(this,(function(e){"use strict";(e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e).mixin({multicombinations:function(t,n){var i=e.values(t),f=function(e,t){if(--t<0)return[[]];var n=[];e=e.slice();for(var i=function(){var i=e[0];f(e,t).forEach((function(e){e.unshift(i),n.push(e)})),e.shift()};e.length;)i();return n};return f(i,n)}})}));
    var events = {},info = {},cntlr = {},html = {},call = {},set = {},pdb = {},lock = {},build = {};
    info = {
        "task":{"obj":{"stat":{},"html":"","source":[]},"sbc":{"stat":{},"html":""}},
        "base":{"state":false,"platform":"pc","price":{},"sId":"","localization":"",autoLoad:true,"ratings":{},"input":true,"promo":0,"template":false,"losauction":false,"savesquad":false,"packcoin":{}},
        "criteria":{},
        "roster":{"state":false,"data":{},"page":-1,"element":{},"thousand":{"lowest":99}},
        "language":2,
        "localization":{},
        "quick":{},
        "market":{"ts":0,"mb":[]},
        "range":[46,99],
        "build":{"league":true,"rare":true,"untradeable":true,"ignorepos":true},
        "league":{2012:'中超',61:'英乙',60:'英甲',14:'英冠',13:'英超',2208:'英丙',2149:'印超',32:'意乙',31:'意甲',54:'西乙',53:'西甲',68:'土超',50:'苏超',308:'葡超',39:'美职联',17:'法乙',16:'法甲',20:'德乙',19:'德甲',2076:'德丙',2118:'传奇',353:'阿甲'},
        "setfield":{"card":["pos","price","other","club","low","accele"],"player":["auction","futbin","getprice","loas","uatoclub","transfertoclub"],"sbc":["top","right","quick","duplicate","records","input","icount","template","templatemode","market","sback","cback","dupfill","autofill","squadcmpl","conceptbuy","meetsreq"],"info":["obj","sbc","sbcf","sbcs","pack","squad","skipanimation","sbcagain","packagain"]},
        "set":{},
        "lock":[],
        "douagain":{"sbc":0,"pack":0},
        "formation":{27:[0,5,5,5,12,10,10,16,25,18,25],
            5:[0,3,5,5,7,14,14,23,27,25,25],
            21:[0,3,5,5,7,12,18,14,18,16,25],
            31:[0,2,5,5,5,8,14,10,14,25,25],
            22:[0,5,5,5,12,14,10,14,16,25,25],
            23:[0,5,5,5,12,14,14,16,25,18,25],
            24:[0,5,5,5,12,14,14,16,21,25,21],
            1:[0,3,5,5,7,12,10,16,14,25,25],
            7:[0,3,5,5,7,14,14,14,21,25,21],
            29:[0,2,5,5,5,8,14,14,25,18,25],
            14:[0,3,5,5,7,12,10,16,25,18,25],
            15:[0,3,5,5,7,14,10,14,25,18,25],
            4:[0,3,5,5,7,10,10,12,18,16,25],
            9:[0,3,5,5,7,14,10,14,23,25,27],
            10:[0,3,5,5,7,10,14,10,23,25,27],
            11:[0,3,5,5,7,14,18,14,23,25,27],
            12:[0,3,5,5,7,14,10,14,23,21,27],
            17:[0,3,5,5,7,12,10,10,16,25,25]
        }
    };
    cntlr = {
        "current":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();},
        "right":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._rightController._currentController},
        "left":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._leftController},
    };
    events.notice = function(text,type){
        services.Notification.queue([fy(text),type])
    };
    events.init =  async function(){
        set.init();
        build.init();
        lock.init();
        let history_a = JSON.parse(GM_getValue("history","[]")),history_b = [];
        if(history_a && typeof history_a === 'object'){
            history_b = history_a;
        }
        console.log(history_b)
        info.market.mb = history_b;
        info.market.ts = Date.now();
        info.base.sId = services.Authentication.sessionUtas.id;
        
        info.base.year = APP_YEAR_SHORT;
        MAX_NEW_ITEMS = 100;
        console.log(info.language)
        GM_xmlhttpRequest({
            method:"GET",
            url:"https://futcd.com/data/fsuupdata.json",
            timeout:8000,
            headers: {
                "Content-type": "application/json"
            },
            onload:function(res){
                let urlText = fy("top.readme");
                let urlLink = "https://mfrasi851i.feishu.cn/wiki/wikcng1Ih7fFRidBfMdNS9SrucR";
                if(res.status == 404){
                    events.notice("notice.upgradefailed",2);
                }else{
                    let data = JSON.parse(res.response);
                    let myVersion = Number(GM_info.script.version) || 0;
                    if(data["version"] > myVersion){
                        urlText = fy("top.upgrade");
                        urlLink = data["updateURL"];
                        events.notice("notice.upgradeconfirm",1);
                    }
                }
                getAppMain()._FCHeader.getView().__easportsLink.insertAdjacentHTML('afterend', `<a class="header_explain" href="${urlLink}" target="_blank">${urlText}</a>`);
            },
            onerror:function(){
                events.notice("notice.upgrade.failed",2);
            }
        })
        let user = services.User.getUser().getSelectedPersona();
        if(user.isXbox || user.isPlaystation || user.isStadia){
            info.base.platform = "ps";
        }
        services.User.maxAllowedAuctions = 100;
        GM_xmlhttpRequest({
            method:"GET",
            url:"https://futcd.com/data/futpricenew.json",
            headers: {
                "Content-type": "application/json",
                "Cache-Control": "max-age=3600"
            },
            onload:function(res){
                let data = JSON.parse(res.response);
                if(info.base.platform == "pc"){
                    info.base.price = data["pc"];
                }else{
                    info.base.price = data["tv"];
                }
            },
        });
        GM_xmlhttpRequest({
            method:"GET",
            url:"https://futcd.com/data/futpackcoin.json?2411",
            headers: {
                "Content-type": "application/json",
                "Cache-Control": "max-age=3600"
            },
            onload:function(res){
                info.base.packcoin = JSON.parse(res.response)
            },
        });
        let lb = events.createButton(
            new UTButtonControl(),
            fy("loadingclose.text"),
            async(e) => {
                events.hideLoader()
            },
            "fsu-loading-close"
        )
        info.base.close = lb;
        document.querySelector(".ut-click-shield").append(info.base.close.__root);
        info.base.localization = services.Localization.repository._collection;
        //获取目标信息
        services.Objectives.objectivesDAO.getCategories().observe(cntlr.current(), function(e, t) {
            e.unobserve(cntlr.current());
            if(t.success && t.response && !JSUtils.isString(t.response)){
                let nowDate = Math.round(new Date().getTime()/1000),
                objJson = {reward:"",new:{"-1":0}},rewardJson = {pack: 0, player: 0};
                for (const cat of t.response.categories) {
                    for (const group of cat.getGroups()) {
                        let tempJson = {"f":0,"e":0}
                        if(group.type !== 2){
                            if(group.startTime >= nowDate - 86400 && group.startTime < nowDate){
                                tempJson.f = 1;
                                objJson.new["-1"]++;
                                if(objJson.new.hasOwnProperty(cat.id)){
                                    objJson.new[cat.id]++;
                                }else{
                                    objJson.new[cat.id] = 1;
                                }
                                if(group?.rewards){
                                    for (let award of group.rewards.awards) {
                                        if(rewardJson.pack == 0 && award.isPack){
                                            rewardJson.pack++;
                                        }
                                        if(rewardJson.player == 0 && award.isItem && award.item.isPlayer()){
                                            rewardJson.player++;
                                        }
                                    }
                                }
                                if(group.objectivesNumber){
                                    for (let objective of group.getObjectives()) {
                                        for (let award of objective.rewards.awards) {
                                            if(rewardJson.pack == 0 && award.isPack){
                                                rewardJson.pack++;
                                            }
                                            if(rewardJson.player == 0 && award.isItem && award.item.isPlayer()){
                                                rewardJson.player++;
                                            }
                                        }
                                    }
                                }
                            }
                            if(group.endTime <= nowDate + 86400 && group.endTime !== 0){
                                tempJson.e = 1;
                            }
                        }
                        objJson[group.compositeId] = tempJson;
                    }
                }
                let reward = [];
                if(rewardJson["player"] > 0){
                    reward.push(fy("task.player"))
                }
                if(rewardJson["pack"] > 0){
                    reward.push(fy("task.pack"))
                }
                objJson.reward = reward.join("、");
                info.task.obj.stat = objJson;
                info.task.obj.source = t.response.categories;
                info.task.obj.html = events.taskHtml(objJson.new["-1"],objJson.reward);
            }
        })
        GM_xmlhttpRequest({
            method:"GET",
            url:"https://futcd.com/data/futsbc.json",
            headers: {
                "Content-type": "application/json",
                "Cache-Control": "max-age=3600"
            },
            onload:function(res){
                let sbcJson = JSON.parse(res.response);
                info.task.sbc.stat = sbcJson;
                info.task.sbc.html = events.taskHtml(sbcJson.new["0"],sbcJson.reward);
            },
        })

        GM_xmlhttpRequest({
            method:"GET",
            url:"https://futcd.com/data/promo.json",
            headers: {
                "Content-type": "application/json",
                "Cache-Control": "max-age=3600"
            },
            onload:function(res){
                info.base.promo = JSON.parse(res.response);
            },
        })
        await events.reloadPlayers();
        events.notice("notice.succeeded",0);
    };
    //获取缓存球员数据
    events.getItemBy = (type,queryOptions,insertData,replaceData) => {
        let players = replaceData ? replaceData : repositories.Item.club.items,
        ratingOrder = queryOptions.hasOwnProperty("LTrating") ? "desc" : "asc";
        for (let [k,v] of Object.entries(queryOptions)) {
            players = players.filter(i => {
                if(i.type === 'player' && i.loans === -1 && i.academy == null){
                    switch(k){
                        case "rs":
                            switch(v){
                                case 0:
                                    return i.rating >= 0 && i.rating <= 64 && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                case 1:
                                    return i.rating >= 65 && i.rating <= 74 && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                case 2:
                                    return i.rating >= 75 && i.rating <= 83 && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                default:
                                    return i.rating >= 0 && i.rating <= 99;
                            }
                        case "gs":
                            return v ? i.groups.includes(4) : i.groups.length == 0;
                        case "levelId":
                            switch(v){
                                case 3:
                                    return i.isSpecial();
                                case 0:
                                    return i.isBronzeRating() && !i.isSpecial();
                                case 1:
                                    return i.isSilverRating() && !i.isSpecial();
                                case 2:
                                    return i.isGoldRating() && !i.isSpecial();
                            }
                        case "BTWrating":
                            if(v[0] > v[1]){
                                ratingOrder = "desc";
                                return i.rating >= v[1] && i.rating <= v[0];
                            }else{
                                return i.rating >= v[0] && i.rating <= v[1];
                            }
                        case "bepos":
                            return i.basePossiblePositions.includes(v);
                        case "lock":
                            if(v){
                                return info.lock.includes(i.id);
                            }else{
                                return !info.lock.includes(i.id);
                            }
                        case "quality":
                            switch(v){
                                case "=1" && "<=1":
                                    return i.isBronzeRating();
                                case "=2":
                                    return i.isSilverRating();
                                case "=3" && ">=3":
                                    return i.isGoldRating();
                                case ">=1" && "<=3":
                                    return true;
                                case ">=2":
                                    return i.isSilverRating() || i.isGoldRating();
                                case "<=2":
                                    return i.isSilverRating() || i.isBronzeRating();
                                default:
                                    return true;
                            }
                        default:
                            if(/NE/.test(k)){
                                let rk = k.replace(/NE/, '');
                                return v instanceof Array ? !v.includes(i[rk]) : i[rk] !== v;
                            }else if(/GT/.test(k)){
                                let rk = k.replace(/GT/, '');
                                return v instanceof Array ? i[rk] >= Math.max(...v) : i[rk] >= v;
                            }else if(/LT/.test(k)){
                                let rk = k.replace(/LT/, '');
                                return v instanceof Array ? i[rk] <= Math.min(...v) : i[rk] <= v;
                            }else{
                                return v instanceof Array ? v.includes(i[k]) : i[k] === v;
                            }
                    }
                } 
            });
        }
        players = _.orderBy(players,["rating","untradeable","rareflag","_itemPriceLimits.minimum","_itemPriceLimits.maximum"],[`${ratingOrder}`,"desc","asc","asc","asc"]);
        if(insertData && !replaceData){
            let tIds = [...new Set(insertData.map(i => {if(i.isDuplicate() && !i.isLoaned() && i.isPlayer()){return i.duplicateId}}))];
            for (let i of tIds) {
                let ix = players.findIndex(it => it.id === i);
                if(ix !== -1){
                    let tItem = players.splice(ix, 1)[0];
                    players.unshift(tItem);
                }
            }
        }
        if(type == 1){
            return players.map(member => member.definitionId);
        }else if(type == 2){
            return players;
        }
    }
    //计算球员加速模式
    events.countPlayerAccele = (h,ag,ac,st) => {
        let type = 4,diff = Math.abs(ag - st);
        if(diff >= 20){
            if(ag >= 80 && ac >= 80 && h <= 175){
                type = 1;
            }else if(st >= 80 && ac >= 55 && h >= 188){
                type = 7;
            }
        }else if(diff >= 12){
            if(ag >= 70 && ac >= 80 && h <= 182){
                type = 2;
            }else if(st >= 75 && ac >= 55 && h >= 183){
                type = 6;
            }
        }else if(diff >= 4){
            if(ag >= 65 && ac >= 70 && h <= 182){
                type = 3;
            }else if(st >= 65 && ac >= 40 && h >= 181){
                type = 5;
            }
        }
        return type;
    }
    //首页任务奖励显示
    events.taskHtml = function(number,text){
        let html = "<div>{Number}</div><div>{reward}</div>";
        if(number > 0){
            html = html.replace("{Number}",fy("task.added") + number);
        }else{
            html = html.replace("fsu-task","fsu-task no");
            html = html.replace("{Number}",fy("task.noadded"));
        }
        if(text == "、"){
            text = "";
        }
        let reward = text;
        reward = reward.replace("组合包",fy("task.pack"));
        reward = reward.replace("球员",fy("task.player"));
        html = html.replace("{reward}",reward);
        return html;
    };
    //加载loading界面
    events.showLoader = () => {
        document.querySelector(".ut-click-shield").classList.add("showing","fsu-loading");
        document.querySelector(".loaderIcon").style.display = "block";
    };
    
    //隐藏loading界面
    events.hideLoader = () => {
        document.querySelector(".ut-click-shield").classList.remove("showing","fsu-loading");
        document.querySelector(".loaderIcon").style.display = "none";
        if(info.base.template){
            info.base.template = false;
            isPhone() ? cntlr.current()._view._fsuSquad.setInteractionState(1) : cntlr.right().getView()._fsuSquad.setInteractionState(1);
        }
        if(info.base.losauction){
            info.base.losauction = false;
            if(isPhone()){
                events.notice("notice.phoneloas",0)
            }
        }
        events.changeLoadingText("loadingclose.text");
    };
    //本地化文本显示程序
    const fy = function(p){
        let t = "";
        if(Array.isArray(p)){
            t = info.localization[p.shift()][info.language];
            let s = p.slice();
            for (let n in s) {
                t = t.replace(`%${Number(n) + 1}`,`${s[n]}`);
            }
        }else if(p.indexOf("{") !== -1){
            t = p;
            let pa = p.match(/{(.*?)}/g);
            for (let i of pa) {
                let pf = i.match(/{(.*?)}/)[1];
                if(info.localization.hasOwnProperty(pf)){
                    t = t.replace(i,info.localization[pf][info.language]);
                }
            }
        }else{
            t = info.localization.hasOwnProperty(p) ? info.localization[p][info.language] : p;
        }
        return t;
    }
    //本地化文本内容
    info.localization = {
        "price.btntext":["查询价格","查詢價格","Check Price"],
        "price.formatno":["无数据","沒有數據","No Data"],
        "price.formatcompany":["万","萬","ten thousand"],
        "price.now":["球员低价","最低價格","Low Price"],
        "price.low":["评分低价","評分最低價格","Rating Price"],
        "price.last":["购买价格","購入價格","Bought Price"],
        "duplicate.swap":["可发送俱乐部","可以送到球會","Can be Sent to Club"],
        "duplicate.not":["队内不可交易","球會球員無法交易","Club Players are Untradeable"],
        "duplicate.yes":["队内可交易","球會球員可交易","Club Players are Tradable"],
        "duplicate.nodata":["无队内数据","沒有球員數據","No Club Players Data"],
        "duplicate.lowprice":["评分低价:","評分最低價格:","Rating Price "],
        "top.readme":["【FSU】插件使用说明","【FSU】插件使用說明","【FSU】Plugin Instructions"],
        "top.upgrade":["有新版FSU插件可升级","有新版本的FSU插件可更新","There is a new version of the FSU plugin that can be upgraded"],
        "notice.upgradefailed":["查询新版本失败","查詢新版本失敗","Query new version failed"],
        "notice.upgradeconfirm":["有新版本点击顶部链接查看","有新版本點擊頂部鏈接查看","There is a new version, click the top link to view"],
        "notice.uasreset":["已重新载入列表 请重新进入查看","已重新載入列表 請重新進入查看","The list has been reloaded, please re-enter to view"],
        "notice.priceloading":["开始读取价格数据 请稍等","開始讀取價格數據 請稍等","Start reading price data, please wait"],
        "notice.loaderror":["读取数据失败 请检查网络","讀取數據失敗 請檢查網絡","Failed to read data, please check the network"],
        "notice.succeeded":["FSU插件加载成功","FSU插件載入成功","FSU plugin loaded successfully"],
        "notice.duplicateloading":["开始读取重复球员数据 请稍等","開始讀取重複球員數據 請稍等","Start reading duplicate player data, please wait"],
        "notice.quicksearch":["使用快捷添加 直接沿用上次配置搜索球员","使用快捷增加球員 直接沿用上次配置搜索球員","Use the shortcut to add, directly follow the last configuration to search for players"],
        "notice.appointloading":["开始读取指定条件球员 请稍等","開始讀取指定條件球員 請稍等","Start reading the specified condition player, please wait a moment"],
        "notice.noduplicate":["已无重复球员","已經沒有重複球員","no duplicate player"],
        "notice.quickauction":["球员将按照最低售价作为即买价挂出","球員將按最低價格列在轉會市場上","Players will be listed at the lowest selling price as an immediate purchase price"],
        "task.player":["球员","球員","Player"],
        "task.pack":["组合包","組合包","Pack"],
        "task.added":["今日新增：","今日新增：","Added today "],
        "task.noadded":["今日无新增","今日沒有新增","No new additions today"],
        "task.new":["新","新","New"],
        "task.expire":["即将到期","即將過期","Expiring"],
        "task.nodata":["无数据请过段时间重新进入WEBAPP再查看","沒有數據請過段時間重新進入WEBAPP再查看","No data, please re-enter WEBAPP after a while to check"],
        "sbc.price":["造价预估：","製作價格：","Cost estimate:"],
        "sbc.topprice":["预估造价","製作價格","Estimate"],
        "sbc.topsquad":["阵容价值","球隊價格","Squad"],
        "sbc.like":["值得做：","贊成：","Thumbs Up："],
        "sbc.dislike":["不值得：","反對：","Thumbs Down："],
        "sbc.consult":["抄作业","參考方案","See Plan"],
        "sbc.count":["算评分","計算評分","Calculate Score"],
        "sbc.duplicates":["重复球员名单","重複球員名單","Duplicate Players List"],
        "sbc.qucikdupes":["重","重","D"],
        "sbc.appoint":["指定条件球员名单","指定條件球員名單","Specified conditions Player list"],
        "sbc.addduplicate":["添加重复球员","新增重複球員","Add Duplicate Players"],
        "sbc.swapduplicate":["替换为重复球员","交換為重複球員","Swap Duplicate Players"],
        "sbc.notduplicate":["无重复球员","沒有重複球員","No Duplicate Players"],
        "sbc.addquick":["快捷添加球员","快速新增球員","Quick Add Player"],
        "sbc.swapquick":["快捷替换球员","快速交換球員","Quick Swap Player"],
        "sbc.watchplayer":["查看球员","查看球員","Watch Player"],
        "uasreset.btntext":["重载名单","重新載入名單","Reload List"],
        "sbc.filtert":["筛选","篩選","Filter"],
        "sbc.filter0":["全部","全部","All"],
        "sbc.filter1":["新增","新增","New"],
        "sbc.filter2":["临期","即期","Expiring"],
        "sbc.filter3":["高评价","高評價","Approval"],
        "loadingclose.text":["数据载入 如卡顿点此关闭","數據載入中 如長時間未響應 請點擊此處關閉","If you encounter stuck, click here to close"],
        "quicklist.gotofutbin":["前往FUTBIN查看","前往FUTBIN查看","Go to FUTBIN"],
        "quicklist.auction":["按低价快速拍卖","使用最低價格列入轉會","Quick Auction at Low Price"],
        "pack.promo":["特殊球员","特殊球員","PROMO"],
        "emptylist.t":["处理后无符合条件球员","處理後無符合條件球員","No eligible players after processing"],
        "emptylist.c":["请改变条件或翻页查看","請改變條件或翻頁查看","Please change the criteria or flip the page to view"],
        "set.title":["FSU设置","FSU設定","FSU Settings"],
        "set.card.title":["球员卡信息","球員卡資訊","Player Card Information"],
        "set.card.pos":["额外位置","額外位置","Extra Position"],
        "set.card.price":["球员价格","球員價格","Player Price"],
        "set.card.other":["其他属性","其他屬性","Other Attributes"],
        "set.card.club":["俱乐部内球员","俱樂部內球員","Club Players"],
        "set.card.low":["评分低价","評分低價","Low Rating Price"],
        "set.sbc.title":["SBC操作","SBC 操作","SBC Operations"],
        "set.sbc.top":["阵容顶部按钮","陣容頂部按鈕","Top Buttons"],
        "set.sbc.right":["阵容右侧按钮","陣容右側按鈕","Right-side Buttons"],
        "set.sbc.quick":["快捷添加球员","快速添加球員","Quick Add Players"],
        "set.sbc.duplicate":["重复球员填充","重複球員填充","Fill with Duplicate Players"],
        "set.sbc.records":["选项记录","選項記錄","Option Records"],
        "set.sbc.input":["信息输入检索","資訊輸入檢索","Information Input Search"],
        "set.info.title":["信息展示","資訊展示","Information Display"],
        "set.info.obj":["目标顶部显示","目標頂部顯示","Objective top display"],
        "set.info.sbc":["SBC顶部显示","SBC頂部顯示","SBC top display"],
        "set.info.sbcf":["SBC筛选","SBC篩選","SBC Filters"],
        "set.info.sbcs":["SBC子任务","SBC子任務","SBC Subtasks"],
        "set.info.pack":["球员包可开球员","球員包可開球員","Pack PROMO"],
        "set.info.squad":["阵容价值","陣容價值","Squad Value"],
        "set.style.title":["球员卡信息样式","球員卡資訊樣式","Player Card Information Style"],
        "set.style.new":["随品质变化","隨品質變化","Varies with Quality"],
        "set.style.old":["纯色样式","純色樣式","Solid Color Style"],
        "set.player.title":["选中球员操作","選中球員操作","Select Player Action"],
        "set.player.auction":["按低价快速拍卖","按低價快速拍賣","Quick Auction at Low Price"],
        "set.player.futbin":["前往FUTBIN查看","前往FUTBIN查看","Go to FUTBIN for Details"],
        "quicklist.getprice":["查询拍卖低价","查詢拍賣低價","Search for Auction Price"],
        "quicklist.getpricey":["刷新拍卖低价","重新整理拍賣低價","Refresh Auction Price"],
        "set.player.getprice":["查询拍卖低价","查詢拍賣低價","Search for Auction Price"],
        "quicklist.getpricelt":["最低价","最低價","Lowest price"],
        "quicklist.getpriceload":["读取中","讀取中","Loading"],
        "sbc.swaprating":["替换为同评分","替換為同評分","Replace with the same rating"],
        "sbc.squadfill":["SBC方案填充","SBC方案填充","SBC squad autofill"],
        "notice.templateload":["读取SBC方案并比价中 请稍后","讀取SBC方案並比價中 請稍後","Reading SBC squad and comparing prices. Please wait."],
        "notice.templateerror":["阵容保存失败 请重新尝试","陣容儲存失敗 請重新嘗試","Failed to save the squad. Please try again."],
        "notice.templatesuccess":["阵容填充成功","陣容填充成功","Squad Filled Successfully"],
        "notice.templatezero":["无可加载方案 请稍后再试","無可載入的方案 請稍後再試","Squad failed to save, please try again"],
        "set.sbc.template":["SBC方案填充","SBC方案填充","SBC squad autofill"],
        "notice.marketsetmax":["已修改优化搜索信息可直接搜索 如无结果请返回调整参数","已修改優化搜尋資訊，可直接搜尋。如無結果，請返回調整參數。","Optimizations have been made to the search information. You can now search directly. If there are no results, please return and adjust the parameters."],
        "set.sbc.market":["假想球员拍卖搜索优化","假想球员拍賣搜尋優化","Fantasy Player Auction Search Optimization"],
        "notice.auctionsuccess":["%1 挂牌 %2 成功","%1 掛牌 %2 成功","%1 listed %2 successfully."],
        "notice.auctionnoplayer":["%1 没有找到球员","%1 沒有找到球員","%1 player not found."],
        "notice.auctionlimits":["%1 FUTBIN价格超出球员限价","%1 FUTBIN價格超出球員限價","The FUTBIN price for %1 exceeds player limit."],
        "notice.auctionmax":["已达到拍卖行上限","已達到拍賣行上限","Auction house limit reached."],
        "losa.all":["全选","全選","Select All"],
        "losa.select":["已选球员","已選球員","Selected"],
        "losa.price":["共计可售","共計可售","Total"],
        "loas.button":["拍卖所选球员","拍賣所選球員","Auction Selected Players"],
        "loas.popupt":["球员批量挂拍卖提示","球員批量掛拍賣提示","Bulk Auction Listing Reminder for Players"],
        "loas.popupm":["已选择本列表中 %1 个球员拍卖价格大致为 %2 ，请点击确认开始陆续上架拍卖，途中可点击加载图标下文字取消。","已選擇本列表中 %1 個球員拍賣價格大致為 %2 ，請點擊確認開始陸續上架拍賣，途中可點擊加載圖標下文字取消。","You have selected approximately %1 players from this list, with an estimated auction price of %2. Please click confirm to start listing them for auction one by one. You can click the text below the loading icon to cancel during the process."],
        "loas.variation":["本版块批量拍卖选择球员调整为 %1 个","本版塊批量拍賣選擇球員調整為 %1 個","Batch auction selection of players in this section is adjusted to %1"],
        "loas.start":["程序开始批量售卖球员 预计耗费 %1 秒","程式開始批量售賣球員 預計耗費 %1 秒","The program starts to sell players in bulk, which is expected to take %1 of seconds"],
        "loadingclose.template1":["读取SBC方案列表中 请稍后","讀取SBC方案列表中 請稍後","Read the list of SBC schemes, please wait"],
        "loadingclose.template2":["正在读取方案 %1 阵容 剩余 %2 方案 点此可结束程序","正在讀取和比對方案 %1 陣容 剩餘 %2 方案 點此可結束程式","Reading and comparing plan %1 lineup, remaining %2 plans, click here to end the program"],
        "loadingclose.loas":["正在挂牌第 %1 个球员 剩余 %2 个 点此可结束程序","正在掛牌第 %1 個球員 剩餘 %2 個 點此可結束程式","The %1 players are being listed, and the remaining %2, click here to end the program"],
        "set.player.loas":["批量拍卖球员","批量拍賣球員","Bulk Auction Players"],
        "notice.squaderror":["方案读取失败 可能是FUTBIN无作业方案 请稍后再试","方案讀取失敗 可能是FUTBIN無作業方案 請稍後再試","Scheme reading failed, it may be that FUTBIN has no job scheme, please try again later"],
        "set.getdoc":["查看设置说明","檢視設定說明","View setup instructions"],
        "builder.league":["排除指定联赛球员","排除指定聯賽球員","Exclude designated league"],
        "builder.rare":["排除周最佳球员","排除周最佳球員","Exclude TOTW"],
        "notice.phoneloas":["请注意手机端挂牌后需重新进入拍卖清单才会刷新显示。","請注意手機端掛牌後需重新進入拍賣清單才會重新整理顯示。","Please note that after listing on the mobile terminal, you need to re-enter the auction list before refreshing the display."],
        "notice.builder":["通过排除后球员数量已不足以填充阵容，如需要请调整条件再次搜索。","通過排除後球員數量已不足以填充陣容，如需要請調整條件再次搜尋。","The number of players after exclusion is no longer sufficient to fill the lineup, please adjust the criteria to search again if necessary."],
        "notice.conceptdiff":["发现所购买的假想球员有多个版本，已经将非搜索版本的亮度。","發現所購買的假想球員有多個版本，已經將非搜尋版本的亮度。","Found that there are multiple versions of the purchased hypothetical player, the brightness of the non-searched version has been added."],
        "notice.packback":["已无未分配球员 自动返回","已無未分配球員 自動返回","No unassigned players, automatically return"],
        "sbc.swapchem":["替换为默契球员","替換為默契球員","Swap Chemistry Players"],
        "notice.notchemplayer":["俱乐部中没有满足当前默契需求的球员","俱樂部中沒有滿足當前默契需求的球員","there are no players in the club who meet the current chemistry needs"],
        "sbc.addchem":["添加默契球员","新增默契球員","Add Chemistry Players"],
        "notice.chemplayerloading":["开始读取满足默契球员 请稍等","開始讀取滿足默契球員 請稍等","Start reading Meet chemistry players, please wait"],
        "sbc.chemplayer":["默契球员名单","默契球員名單","Chemistry Players List"],
        "notice.noplayer":["已无指定条件球员","已無指定條件球員","No conditions specified player"],
        "squadback.popupt":["阵容回退提示","陣容回退提示","Squad Back Tip"],
        "squadback.popupm":["请注意，阵容回退后将无法再返回到此阵容，还可回退 %1 次。","請注意，陣容回退後將無法再返回到此陣容，還可回退 %1 次。","Note that the squad will no longer be able to return to this lineup after retreating, and can go back %1 times."],
        "sbc.squadback":["退","退","B"],
        "notice.nosquad":["已无操作记录 无法法回退","已無操作記錄 無法法回退","There is no operation record and cannot be rolled back"],
        "tile.settitle":["插件配置","外掛配置","Plugin configuration"],
        "tile.settext":["配置FSU功能开关","配置FSU功能開關","Configure FSU function switch"],
        "tile.infotitle":["使用说明","使用說明","Instructions for use"],
        "tile.infotext":["查看插件使用说明","檢視外掛使用說明","View plugin instructions"],
        "tile.fbtitle":["问题反馈","問題反饋","Problem feedback"],
        "tile.fbtext":["有问题请尽快反馈","有問題請儘快反饋","If you have any questions, please give feedback ASAP."],
        "set.sbc.cback":["假想球员购买自动分配","假想球员购买自动分配","Hypothetical player purchase automatic distribution"],
        "set.sbc.sback":["阵容回退","阵容回退","lineup fallback"],
        "swaptradable.btntext":["批量交换可交易","批量交换可交易","Bulk exchange tradable"],
        "swaptradable.popupt":["批量交换队内可交易球员","批量交换队内可交易球员","Batch exchange of tradable players within the team"],
        "swaptradable.popupm":["点击确定可将未分配中球员与队内可交易球员交换，共可交换 %1 个。","点击确定可将未分配中球员与队内可交易球员交换，共可交换 %1 个。","Click OK to exchange unassigned players with tradable players in the team, for a total of %1 players."],
        "notice.swaptsuccess":["%1 交换成功","%1 交换成功","%1 exchange successful"],
        "notice.swapterror":["%1 交换失败 程序暂停","%1 交换失败 程序暂停","%1 exchange failed, program paused"],
        "loadingclose.swapt":["正在交换第 %1 个球员 剩余 %2 个","正在交换第 %1 个球员 剩余 %2 个","Swap %1 player,%2 remaining"],
        "set.player.swapt":["未分配批量交换可交易","未分配批量交換可交易","Unallocated Bulk Exchange Tradable"],
        "set.sbc.dupfill":["重复球员填充阵容","重複球員填充陣容","Repeat player fill squad"],
        "dupfill.btntext":["重复球员填充阵容","重複球員填充陣容","Repeat player fill squad"],
        "autofill.btntext":["一键填充(优先重复)","一鍵填充(優先重複)","One-click fill (priority repeat)"],
        "set.sbc.icount":["搜索球员数量显示","搜尋球員數量顯示","Search number of players displayed"],
        "set.sbc.autofill":["一键填充球员","一鍵填充球員","One-click fill player"],
        "completion.btntext":["一键补全阵容","一鍵補全陣容","One-click complete lineup"],
        "set.sbc.completion":["一键补全阵容","一鍵補全陣容","One-click complete lineup"],
        "notice.setsuccess":["设置保存成功","設定儲存成功","Settings saved successfully"],
        "notice.seterror":["设置保存失败 请检查","設定儲存失敗 請檢查","Settings failed to save, please check"],
        "shieldlea.btntext":["排除联赛设置","排除聯賽設定","Exclude league settings"],
        "shieldlea.placeholder":["请输入联赛数字ID和英文逗号","請輸入聯賽數字ID和英文逗號","Please enter the league number ID and English comma"],
        "squadcmpl.btntext":["阵容补全(优先重复)","陣容補全(優先重複)","Squad completion (priority repeat)"],
        "squadcmpl.popupt":["阵容补全提示","陣容補全提示","Squad Completion Tips"],
        "squadcmpl.placeholder":["请填入评分和英文逗号组合","請填入評分和英文逗號組合","Please fill in the combination of ratings and English commas"],
        "squadcmpl.placeholder_zero":["无需填充空位","無需填充空位","No need to fill gaps"],
        "squadcmpl.error":["输入填充评分格式不匹配 无法填充指定评分","輸入填充評分格式不匹配 無法填充指定評分","The input fill score format does not match, and the specified score cannot be filled"],
        "set.sbc.squadcmpl":["阵容补全功能","陣容補全功能","Squad completion"],
        "notice.ldatasuccess":["球员数据已全部加载成功","球員資料已全部載入成功","All player data has been loaded successfully"],
        "notice.ldataerror":["球员数据加载失败 请重刷新页面加载 否则核心功能无法使用","球員資料載入失敗 請重重新整理頁面載入 否則核心功能無法使用","Player data loading failed, please refresh the page to load, otherwise the core functions cannot be used"],
        "loadingclose.ldata":["正在读取球员数据（%1/%2）请耐心等待","正在讀取球員資料（%1/%2）請耐心等待","Reading player data (%1/%2) please be patient"],
        "uatoclub.btntext":["直接发送%1个至俱乐部","直接傳送%1個至俱樂部","Send %1 directly to the club"],
        "uatoclub.success":["直接发送俱乐部成功","直接傳送俱樂部成功","Send directly to the club successfully"],
        "uatoclub.error":["直接发送俱乐部失败 请进入页面自行分配","直接傳送俱樂部失敗 請進入頁面自行分配","Failed to send the club directly, please enter the page to assign it yourself."],
        "set.info.skipanimation":["跳过开包动画","跳過開包動畫","Skip the package animation"],
        "builder.untradeable":["仅限不可交易球员","僅限不可交易球員","Only Untradeable"],
        "set.player.uatoclub":["未分配外部发送至俱乐部","未分配外部傳送至俱樂部","Unassigned external send to club"],
        "douagain.sbctile.title":["快速SBC","快速SBC","Fast SBC"],
        "douagain.packtile.title":["快速开包","快速開包","Quick unpacking"],
        "douagain.sbctile.text":["请先打开或完成SBC","請先開啟或完成SBC","Please open or complete SBC"],
        "douagain.packtile.text":["请先进行开包","請先進行開包","Please open the package first"],
        "douagain.error":["出现程序错误无法打开，请重新完成SBC以便继续。","出現程式錯誤無法開啟，請重新完成SBC以便繼續。","A program error failed to open, please complete the SBC again to continue."],
        "douagain.sbctile.state1":["已做%1个","已做%1個","%1 done"],
        "douagain.sbctile.state2":["可做%1个","可做%1個","Can do %1"],
        "douagain.sbctile.state3":["已完成","已完成","Completed"],
        "set.info.sbcagain":["商店快速SBC","商店快速SBC","Store Express SBC"],
        "set.info.packagain":["商店快速开包","商店快速開包","Store quick open pack"],
        "sbc.infocount":["已完成 %1 个","已完成 %1 個","%1 completed"],
        "notice.dupfilldiff":["请注意因存在于阵容或屏蔽条件未能全部填充球员","請注意因存在於陣容或遮蔽條件未能全部填充球員","Please note that players are not fully filled due to presence in the lineup or shielding conditions"],
        "screenshot.text":["未分配共计 %1 名球员 总价 %2","未分配共計 %1 名球員 總價 %2","Unassigned total %1 players, total price %2"],
        "packcoin.text":["商店价值：","商店價值：","Store value:"],
        "sbcrange.title":["评分范围","評分範圍","ratings range"],
        "sbcrange.to":["至","至","to"],
        "tile.gptitle":["重载球员","載入球員","Overload player"],
        "tile.gptext":["如有问题可重载入球员","如有問題可重新載入球員","If there is a problem, you can reload the player."],
        "player.accelerate1":["爆发型","爆發型","Explosive"],
        "player.accelerate2":["偏爆发型","偏爆發型","Mostly Explosive"],
        "player.accelerate3":["爆发控制型","爆發控制型","Controlled Explosive"],
        "player.accelerate4":["控制型","控制型","Controlled"],
        "player.accelerate5":["持久控制型","持久控制型","Controlled Explosive"],
        "player.accelerate6":["偏持久型","偏持久型","Mostly Lengthy"],
        "player.accelerate7":["持久型","持久型","Lengthy"],
        "set.card.accele":["加速类型（大卡显示）","加速型別（大卡顯示）","AcceleRATE(large card display)"],
        "notice.basesbc":["需要完成初始SBC才可显示更多SBC任务","需要完成初始SBC才可顯示更多SBC任務","The initial SBC needs to be completed to show more SBC tasks"],
        "builder.ignorepos":["忽略球员位置","忽略球員位置","Ignore player position"],
        "transfertoclub.popupt":["发送球员提示","傳送球員提示","Send player tips"],
        "transfertoclub.popupm":["是否要将列表中 %1 名球员发送到俱乐部","是否要將列表中 %1 名球員傳送到俱樂部","Do you want to send %1 players in the list to the club"],
        "readauction.error":["读取球员拍卖信息失败，请重试。","讀取球員拍賣資訊失敗，請重試。","Failed to read player auction information, please try again."],
        "buyplayer.success":["购买球员 %1 成功，花费 %2 。","購買球員 %1 成功，花費 %2 。","Purchase player %1 successfully, cost %2."],
        "buyplayer.error":["购买球员 %1 失败，%2请稍后再试。","購買球員 %1 失敗，%2請稍後再試。","Purchase of player %1 failed,%2 please try again later."],
        "buyplayer.error.child1":["被其他用户购买，","被其他使用者購買，","Purchased by other users,"],
        "buyplayer.error.child2":["金币不足，","金幣不足，","Not enough gold coins,"],
        "buyplayer.error.child3":["无拍卖信息，","無拍賣資訊，","No auction information,"],
        "buyplayer.error.child4":["购买超时，","購買超時，","Purchase timed out,"],
        "buyplayer.error.child5":["未分配物品过多，","未分配物品過多，","Too many unallocated items,"],
        "buyplayer.sendclub.success":["购买球员 %1 发送俱乐部成功","購買球員 %1 傳送球隊成功","Buy player %1 send team successfully"],
        "buyplayer.sendclub.error":["购买球员 %1 发送俱乐部失败","購買球員 %1 傳送球隊失敗","Failed to buy player %1 to send team"],
        "readauction.loadingclose":["正在读取最新FUT价格","正在讀取最新FUT價格","Reading the latest FUT prices"],
        "readauction.loadingclose2":["正在读取拍卖信息","正在讀取拍賣資訊","Reading auction information"],
        "buyplayer.loadingclose":["正在尝试购买球员","正在嘗試購買球員","Trying to buy players"],
        "conceptbuy.btntext":["直接购买此球员","直接購買此球員","Buy this player directly"],
        "set.sbc.conceptbuy":["假想球员直接购买","概念球員直接購買","Concept player direct purchase"],
        "set.player.transfertoclub":["转会发送俱乐部","轉會傳送俱樂部","Transfer sending club"],
        "transfertoclub.unable":["%1个球员因重复无法发送","%1個球員因重複無法傳送","%1 player could not be sent due to duplication"],
        "numberofqueries.btntext":["查询价格次数","查詢價格次數","Number of price inquiries"],
        "numberofqueries.popupm":["此处影响在购买球员的查询次数，初次使用futbin读取价格，其后每次按照搜索出结果进行下次查询价格，查询价格变化按照拍卖价格+、-变化，可自行在拍卖输入价格点击+、-后查看，具体规则请阅读说明文档。<br>默认配置为5次，最低可设置为1次，不建议次数过多。","此處影響在購買球員的查詢次數，初次使用futbin讀取價格，其後每次按照搜尋出結果進行下次查詢價格，查詢價格變化按照拍賣價格+、-變化，可自行在拍賣輸入價格點選+、-後檢視，具體規則請閱讀說明文件。<br>預設配置為5次，最低可設定為1次，不建議次數過多。","This affects the number of inquiries in the purchase of players. Use futbin to read the price for the first time, and then check the price for the next time according to the search results. The query price changes according to the auction price + and -. You can enter the price in the auction by yourself and click + and -. Please read the description document for specific rules. < br > The default configuration is 5 times, and the minimum can be set to 1 time. It is not recommended to use too many times."],
        "numberofqueries.placeholder":["请输入数字 为空重置为5次","請輸入數字 為空重置為5次","Please enter a number, entering empty will reset to 5 times"],
        "settingsbutton.phone":["说明、联赛、询价","說明、聯賽、詢價","desc、league、query"],
        "notice.lockplayer":["锁定球员成功","鎖定球員成功","Lock player successfully"],
        "notice.unlockplayer":["解锁球员成功","解鎖球員成功","Unlock Player Success"],
        "locked.unlock":["解锁","解鎖","Unlock"],
        "locked.lock":["锁定","鎖定","lock"],
        "locked.tile":["锁定球员","鎖定球員","Lock player"],
        "locked.navtilte":["锁定球员列表","鎖定球員列表","Lock player list"],
        "pack.filter0":["可交易组合包","可交易組合包","Tradeable Pack"],
        "history.title":["搜索历史：","搜尋歷史：","Search history"],
        "consult.popupt":["请输入导入方案ID或网址","請輸入匯入方案ID或網址","Please enter the import squad ID or URL"],
        "consult.popupm":["支持导入FUTBIN和FUT.GG两个网站的SBC方案ID或网址，为空则默认读取FUTBIN价格最低的5个方案进行计算。","支援匯入FUTBIN和FUT.GG兩個網站的SBC方案ID或網址，為空則預設讀取FUTBIN價格最低的5個方案進行計算。","Support import FUTBIN and FUT.GG the SBC squad ID or URL of the two websites. If it is empty, read the 5 schemes with the lowest FUTBIN price by default for calculation."],
        "consult.placeholder":["在此填入方案ID或网址","在此填入方案ID或網址","Enter the squad ID or URL here"],
        "consult.error":["未能识别到有效的方案ID或网址，请重新输入。","未能識別到有效的方案ID或網址，請重新輸入。","Could not identify a valid squad ID or URL, please re-enter."],
        "meetsreq.btntext":["替换为满足需求球员","替換為滿足需求球員","Swap Meets Requirements Players"],
        "set.sbc.meetsreq":["替换满足需求球员","替換滿足需求球員","Swap Meets Requirements Players"],
        "meetsreq.error":["俱乐部中没有满足可替换的满足需求球员","俱樂部中沒有滿足可替換的滿足需求球員","There are no replaceable meet requirements players in the club"],
        "set.sbc.templatemode":["SBC方案填充输入模式","SBC方案填充輸入模式","SBC squad populate input mode"],
        "readauction.loadingclose3":["正在读取价格 %1","正在讀取價格 %1","Reading price %1"],
        "squadcmpl.popupm":["阵容补全即会将假想球员替换为同评分球员、空位替换为所填评分。请填入评分需要数字，以英文逗号组合，单个评分将会替换所有空位，多个将替换指定个数空位。","陣容補全即會將假想球員替換為同評分球員、空位替換為所填評分。請填入評分需要數字，以英文逗號組合，單個評分將會替換所有空位，多個將替換指定個數空位。","Lineup completion will replace hypothetical players with players of the same rating, and vacancies with the filled rating. Please fill in the numbers required for the rating, combined with English commas, a single rating will replace all vacancies, and multiple will replace the specified number of vacancies."],
        "squadcmpl.popupmsup":["模拟计算结果可能略有偏差，可点击按钮前往网站进行自由计算。","模擬計算結果可能略有偏差，可點選按鈕前往網站進行自由計算。","The simulation results may be slightly biased, and you can click the button to go to the website for free calculation."],
        "shieldlea.popupm":["默认排除五大联赛，如想调整请从使用说明中找到对应的联赛ID填入。多个ID使用英文逗号分割，否则保存失败。为空恢复为默认设置","預設排除五大聯賽，如想調整請從使用說明中找到對應的聯賽ID填入。多個ID使用英文逗號分割，否則儲存失敗。為空恢復為預設設定","The five major leagues are excluded by default. If you want to adjust it, please find the corresponding league ID from the instructions and fill it in. Multiple IDs are separated by English commas, otherwise the save fails. If it is empty, restore it to the default settings"],
        "popupButtonsText.44401":["前往网站计算","前往網站計算","Go to the website to calculate"],
        "popupButtonsText.44402":["前往查看ID列表","前往檢視ID列表","Go to view ID list"],
        "squadcmpl.simulatedsuccess":["此次模拟补全后阵容评分： %1 ，预估填充球员价值： %2 。","此次模擬補全後陣容評分： %1 ，預估填充球員價值： %2 。","Lineup score after this simulation completion: %1 , estimated fill player value: %2 ."],
        "squadcmpl.simulatederror":["无法模拟补全出阵容，请填充球员、调整排除选项或进入网站计算。","無法模擬補全出陣容，請填充球員、調整排除選項或進入網站計算。","The full lineup cannot be simulated. Please fill in players, adjust exclusion options, or enter the website for calculations."],
        "packfilter.total":["共计：%1   价值：%2","共計：%1   價值：%2","Total:%1   Value:%2"],
        "chemistrylist.setpos":["仅显示 %1","僅顯示 %1","Show only %1"],
        "chemistrylist.setall":["显示全部","顯示全部","Show all"],
        "requirements.addbtn":["添加 %1","新增 %1","Add %1"],
        "requirements.swapbtn":["替换为 %1","替換為 %1","Swap %1"],
        "squadcmpl.popupmsupallconcept":["此次将尝试替换假想球员，不会考虑挑战要求，如无法替换代表无此评分球员。","此次將嘗試替換概念球員，不會考慮挑戰條件，如無法替換代表無此評分球員。","This time, attempts will be made to replace concept players, without considering challenge requirements. If a player cannot be replaced, it means that the player does not have this rating."],
        "sbcrange.concepttitle":["假想搜索无评分范围","概念搜尋無評分範圍","Concept Search No Rating Range"],
        "searchconcept.sameclub":["搜索同俱乐部假想球员","搜尋同俱樂部概念球員","Search concept from the same club"],
        "searchconcept.sameleague":["搜索同联赛同地区假想球员","搜尋同聯賽同地區概念球員","Search concept in the same league and nation"],
        "notice.searchconceptloading":["开始搜索指定条件假想球员","開始搜尋指定條件概念球員","Start searching for specified concept players"],
        "subsbcaward.title":["奖励价值：","獎勵價值：","Reward value:"],
        "subsbcaward.nope":["无法计算","無法計算","Can't count"],
        "sbc.quciktransfers":["转","轉","T"],
        "sbc.onlycmpltext":["保留阵容补全仅为方便查看所需评分","保留陣容補全僅為方便檢視所需評分","Keep the squad complete for convenience only to view the required rating"],
    }
    //固话的HTML内容
    html = {
        "priceBtn":"<button class=\"flat pagination fsu-getprice\" id=\"getprice\">{price.btntext}</button>",
        "priceBtn2":"<button class=\"btn-standard section-header-btn mini call-to-action fsu-getprice\" id=\"getprice\">{price.btntext}</button>",
        "taskBar":"<div class=\"fsu-task-bar\">{Number}</div>",
        "sbcInfo":"<div class=\"fsu-sbc-info\"><div class=\"currency-coins\">{sbc.price}{price}</div><div><span>{sbc.like}{up}</span><span>{sbc.dislike}{down}</span></div></div>",
        "consultBtn":"<a href=\"https://www.futbin.com/squad-building-challenges/ALL/{sbcId}\" target=\"_blank\" class=\"fsu-consult fsu-sbcButton\">{sbc.consult}</a>",
        "countBtn":"<a id=\"goToCount\" href=\"javascript:void(0)\" class=\"fsu-count\">{sbc.count}</a>",
        "searchInput":"<input type=\"text\" class=\"fsu-input\" placeholder=\"{text}\" maxlength=\"50\">",
        "uasBtn":"<button class=\"btn-standard section-header-btn mini call-to-action fsu-getprice\" id=\"uasreset\">{uasreset.btntext}</button>",
    };
    info.base.sytle = ".tns-horizontal.tns-subpixel>.tns-item{position: relative;}button.notevents{pointer-events: none;color: #a4a9b4;}.btn-standard.section-header-btn.mini.call-to-action.fsu-getprice{margin-left: 1rem;}.btn-standard.section-header-btn.mini.call-to-action.fsu-getprice:hover{background-color:#e9dfcd}.view-modal-container.form-modal header .fsu-getprice{position: absolute;top: .5rem;left: 0;height: 2rem;line-height: 2rem;}.fsu-task-bar{position: absolute;right: .2rem;top: 0;}.ut-sbc-set-tile-view.production-tagged .tileHeader::before{display:none;}.fsu-task{display: flex;justify-content: space-between;padding: 0.5rem;background-color: #d31332;}.fsu-task.no{background-color: #d313325c;}.task-expire{background-color: #d313325c;height: 2rem;line-height: 2rem;text-align: center;}a.header_explain{color: #a2a2a2;text-decoration: none;line-height: 3rem;}a.header_explain:hover{color: #ffffff;}.ut-fifa-header-view{display: flex;justify-content: space-between;}    .fsu-loading-close{display: none;position: absolute;bottom: 38%;z-index: 999;}.fsu-loading .fsu-loading-close{display: block;}          .fsu-task-bar-favorite{background-color: rgb(255,86,48);right: 0.2rem;top: 2px;color: #ffffff;padding: 0 6px;border-radius: 4px;line-height: 1.2rem;position: absolute;}                                                     .fsu-sbc-info{padding: 0.5rem;background-color: #d313325c;display: flex;font-family: UltimateTeamCondensed,sans-serif;justify-content: space-between;font-size: 1rem;}.fsu-sbc-info div{width: 50%;}.fsu-sbc-info div:last-child{display: flex;justify-content: space-around;}.fsu-sbc-info .currency-coins::after{font-size:16px}                .rewards-footer li{position: relative;}.fsu-sbc-vplayer {position: absolute;bottom: .25rem;right:0;background-color: #8A6E2C;padding: .5rem;color: #15191d;line-height: 1rem;font-size: 16px;}.fsu-sbc-vplayer:hover{background-color: #f6b803;}                 @media screen and (min-width:1280px) and (max-width:1441px) {.ut-split-view {padding:0;}.ut-split-view>.ut-content {max-height:100%;}}            .fsu-squad-pBox{display:flex}.fsu-squad-pWrap{margin:.5em}.fsu-squad-pTitle{width:100%;word-break:keep-all;font-size:.8em;display:block;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}.fsu-squad-pValue{font-family:UltimateTeamCondensed,sans-serif;font-weight:400;font-size:1.125em;text-overflow:ellipsis;white-space:nowrap;line-height: 1.8rem;}.fsu-squad-pValue.currency-coins::after{font-size:1rem;margin-left:.2em !important;margin-top:-.2em !important}.fsu-squad-pTitle .plus{color:#36b84b;padding-left:.1rem}.fsu-squad-pTitle .minus{color:#d21433;padding-left:.1rem}         li.with-icon.hide {display: none;}                      .fsu-input{border: 0 !important;background-color: rgba(0,0,0,0) !important;padding-left: 0 !important;font-family: UltimateTeamCondensed,sans-serif;font-size: 1em;color: #f8eede;}                  .fsu-quick{position:absolute;top:100%;width:100%;display:flex;align-items:center;font-family:UltimateTeam,sans-serif;justify-content:center;margin-top:.2rem}.fsu-quick.top .fsu-quick-list{display:flex;align-items:center}.fsu-quick-list .im{height:1.8rem;line-height:1.8rem;cursor:pointer;background-color:#2b3540;font-family:UltimateTeam,sans-serif;border-radius:4px;padding:0 .2rem;font-size:1rem;font-weight:900;color:#f2f2f2;overflow: hidden;}.fsu-quick-list .im:hover{background-color:#394754}.fsu-quick-list.other .im{background-color:#f8eede;color:#ef6405;font-weight:500;margin-left:.3rem;text-align:center;}.fsu-quick-list.other .im:hover{background-color:#f5efe6}.fsu-quick-list .im span{font-size:.8rem;font-weight:300;color:#a4a9b4}.fsu-quick-list.left .im{margin-right:.3rem}.fsu-quick-list.right .im{margin-left:.3rem}.fsu-quick-inr{font-size:.8rem;margin:0 .3rem}.fsu-quick.right{position:absolute;top:50%;width:2rem;display:block;right:0%;z-index:3;-webkit-transform:translateY(-50%) !important;transform:translateY(-50%) !important}.phone .fsu-quick.right{top:8rem;-webkit-transform:translateY(0%) !important;transform:translateY(0%) !important}.fsu-quick.right .fsu-quick-list .im{width:1.4rem;margin-bottom:.2rem;text-align:center}.fsu-quick.right .fsu-quick-list .im.disabled{background-color:#30302e;color:#656563}.entityContainer>.name.untradeable{color:#f6b803}                                      .fsu-promo-box{flex:auto;display:flex;justify-content:flex-end}.landscape button.currency.fsu-promo{margin-top:-.25rem;text-align:justify;padding:.25rem .5rem;width:6.6rem;color:#f2f2f2;background-color:#556c95}.landscape button.currency.fsu-promo:hover{background-color:#ef6405}.landscape button.currency.fsu-promo .text{font-size:2rem;font-weight:600;height:2rem;line-height:2rem}.landscape button.currency.fsu-promo .subtext{font-size:.6rem;line-height:1rem;font-weight:600;text-transform:uppercase}.landscape button.currency.fsu-promo::after{background-image:url(https://www.ea.com/ea-sports-fc/ultimate-team/web-app/images/Items/small_item_totw_gold.png) !important;background-position:center;background-repeat:no-repeat;background-size:contain;content:'';height:3rem;transform:translateY(-50%);position:absolute;width:3rem;top:50%;right:0}                                  .phone .fsu-sbc-info{font-size:.875rem}.phone .fsu-task{display:block;font-size:.875rem}.phone .fsu-price-box.right > div .value{font-size:1rem;margin-top:.2rem}.phone .fsu-price-box.right > div .title{font-size:.875rem}.phone button.currency.fsu-promo{line-height:1.6rem;padding:0 .3rem;height:3rem}.phone button.currency.fsu-promo .subtext{display:block;font-size:.6rem;line-height:1rem;text-transform:uppercase}.phone .fsu-player-other > div{font-size:0.6rem}.phone .small.player .fsu-cards-price{font-size:.6rem}.phone .small.player .fsu-cards-price{font-size:.6rem}.phone .small.player .fsu-cards-price::after{font-size:.875rem}.phone .fsu-cards.fsu-cards-attr{font-size:.6rem}.phone .fsu-quick-list .im{font-size:.875rem}                                              .ut-pinned-item .listFUTItem.has-auction-data .fsu-player-other{margin-top:0 !important;top:.8rem;right:.2rem;position:absolute;z-index:2}        .fsu-sbcfilter-box{align-items:center;background-color:#394754;display:flex;justify-content:center;padding:1rem;z-index:10}.fsu-sbcfilter-option{align-items:center;box-sizing:border-box;display:flex;flex:1;max-width:300px}.fsu-sbcfilter-option .ut-drop-down-control{margin-left:1rem;flex:1}             .fsu-cards-pos.old>div,div:not(.small)>.fsu-cards-attr.old>div{background-color:#0040A6}.small.player .fsu-price-box{font-size:.875rem}.large.player .fsu-price-box{font-size:1rem}.fsu-price-box.old{background-color:#0f1417;color:#a4a9b4;border:0}.small>.fsu-cards-attr.old{background-color:#0040A6}                         .fsu-setbox{display: grid;grid-template-columns: repeat(3, minmax(0, 1fr));}.phone .fsu-setbox{display: grid;grid-template-columns: repeat(1, minmax(0, 1fr));}                                  .btn-standard.mini.fsu-reward-but{height:2rem;line-height:2rem;position:absolute;top:.2rem;left:50%;transform:translateX(-50%)}.btn-standard.mini.fsu-reward-but.pcr{bottom:1.9rem;top:auto}           .btn-standard.mini.fsu-pickspc{line-height:2rem;height:2rem;margin:.5rem auto 0 auto}.ut-image-button-control.back-btn.fsu-picksback{height:100%;width:3rem;position:absolute;left:0;font-size:1.6rem}                       .fsu-fcount{position:absolute;right:0.5rem;height:1.4rem;top:.8rem;line-height:1.5rem;padding:0 .4rem;border-radius:.2rem;z-index:1;background-color: #264A35;}        .ut-squad-building-set-status-label-view.refresh.sbccount::before {content:'\\E0AA';color: #36b84b;}.phone .fsu-store-tile .ut-tile-content-graphic-info .description{display:block;}        .fsu-range button{margin:0}                                                               .fsu-price-box{font-family:UltimateTeamCondensed,sans-serif}.fsu-price-box.right{position:absolute;right:0%;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);display:flex;align-items:center}.fsu-price-box.right>div{background-color:#162C1A;color: #ffffff;padding:0.5rem;text-align:center;border-radius:4px;margin-top:0;display:block}.fsu-price-box.right>div .title{color:#a4a9b4;padding:0;font-size:1rem;line-height:1rem}.fsu-price-box.right>div .title span.plus{color:#36b84b;font-weight:500;padding-left:.2rem}.fsu-price-box.right>div .title span.minus{color:#d21433;font-weight:500;padding-left:.2rem}.fsu-price-box.right>div .value{font-size:1.2rem;margin-top:.5rem;line-height:1.2rem}.fsu-price-val[data-value='0']{display:none !important}.fsu-price-val .currency-coins::after{font-size:1rem;margin-top:-3px}.fsu-price-box.bottom{padding-left:6.3rem;margin:.2rem 0rem}.fsu-price-box.bottom>div{display:flex;align-items:center;font-size:0.9375rem}.fsu-price-box.bottom>div .title{color:#a4a9b4;margin-right:.2rem}.fsu-price-box.bottom .fsu-price-val .currency-coins::after{font-size:inherit}.fsu-price-box.trf{position:absolute;left:54%;margin-top:.2rem}.fsu-price-box.trf .fsu-price-val{display:flex;align-items:center;background-color:#162C1A;color: #ffffff;text-align:center;border-radius:4px;padding:0 .3rem;height:20px}.fsu-price-box.trf .fsu-price-val .title{font-size:.875rem;margin-right:.2rem}.fsu-price-box.trf .fsu-price-val .currency-coins::after{margin-top:-2px}.fsu-price-box.top{position:absolute;right:0%;top:8%;display:flex;align-items:center}.fsu-price-box.top>div{display:flex;align-items:center;background-color:#162C1A;color: #ffffff;padding:.1rem 0.5rem;text-align:center;border-radius:4px}.fsu-price-box.top>div .title{font-size:0.875rem;margin-right:0.5rem}.fsu-price-last{margin-right:.5rem}.fsu-player-other{display:flex;margin-top:.2rem;font-family:UltimateTeamCondensed,sans-serif;font-size:1rem;line-height:1rem}.fsu-price-box.top+.fsu-player-other{margin-top:.4rem}.fsu-player-other>div{background-color:#3B4754;color:#a4a9b4;padding:0.1rem 0.5rem;text-align:center;border-radius:20px;font-size:0.9rem;margin-right:0.5rem;white-space:nowrap}.fsu-player-other>div.swap{background-color:#36b84b;color:#201e20}.fsu-player-other>div.not{background-color:#8A6E2C;color:#201e20}.fsu-player-other>div.yes{background-color:#264A35;color:#201e20}.large.player+.fsu-player-other{justify-content:center}.large.player+.fsu-player-other>div{margin-right:0rem}.fsu-player-other .currency-coins::after{font-size:.875rem;margin-top:-1px;margin-left:2px !important}@media (max-width:1130px){.has-auction-data .fsu-player-other{margin-top:5rem !important}.has-auction-data .fsu-price-box.trf{margin-top:5rem !important;left:auto;right:3%}}                                                                    .fsu-cards-lea-small,.fsu-cards-accele-large,.fsu-cards-price{position:absolute;z-index:2;font-family:UltimateTeamCondensed,sans-serif;font-weight:300;text-align:center;width:1.6rem;top:25%}.fsu-cards-lea-small{bottom:8%;height:16%;font-size:70%;width:100%;top:auto;font-weight:500;line-height:1}.fsu-cards-lea-small~.playStyle,.ut-squad-pitch-view:not(.sbc) .fsu-cards-lea-small{display:none !important}.specials .fsu-cards-lea-small{bottom:10%}.fsu-cards-accele-large,.fsu-cards-price{width:auto !important;padding:0 0.2rem;left:50%;-webkit-transform:translateX(-50%) !important;transform:translateX(-50%) !important;white-space:nowrap;background-color:#13151d;border:1px solid;border-radius:5px}.fsu-cards-accele-large{bottom:0;top:auto !important}.fsu-cards-price{top:0 !important}.fsu-cards-price::after{font-size:1rem}.ut-squad-pitch-view:not(.sbc) .fsu-cards-lea-small~.playStyle{display:block !important}.fsu-cards-attr,.fsu-cards-pos{position:absolute;z-index:2;font-family:UltimateTeamCondensed,sans-serif;font-weight:300;text-align:center;top:25%;display:flex;flex-direction:column;gap:1px}.fsu-cards-attr div,.fsu-cards-pos div{border:1px solid;border-color:inherit;background-color:#13151d;line-height:100%;border-radius:5px;color:#fcfcf7;width:1.4rem;white-space:nowrap;}.large.player~.fsu-cards-attr,.large.player .fsu-cards-attr,.ut-tactics-instruction-menu-view  .fsu-cards-attr{left:calc(50% + 76px - 0.8rem);font-size:14px;gap:4px}.large.player~.fsu-cards-attr div,.large.player .fsu-cards-attr div{width:1.6rem}.small.player~.fsu-cards-attr{left:5.2rem;font-size:12px}.reward.small .small.player~.fsu-cards-attr{left:calc(50% + 42px);top:20%}.reward.small .small.player~.fsu-cards-pos{left:calc(50% - 66px);top:20%;font-size:12px}.ut-squad-slot-view .small.player~.fsu-cards-attr{left:auto;right:-.2rem}.large.player~.fsu-cards-pos,.large.player .fsu-cards-pos,.ut-tactics-instruction-menu-view  .fsu-cards-pos{left:calc(50% - 76px - .8rem);font-size:14px;gap:4px}.ut-squad-slot-view .small.player~.fsu-cards-pos{flex-direction:row;font-size:12px;top:auto;bottom:-1.2rem;left:50%;transform:translate(-50%,0)}.ut-squad-slot-dock-view .ut-squad-slot-view .small.player~.fsu-cards-pos{bottom:-.6rem}.ut-store-xray-pack-details-view .large.player~.fsu-cards-attr{left:calc(50% + 76px - 2rem)}.ut-store-article-pack-graphic-view--option .large.player~.fsu-cards-pos{left:calc(50% - 76px - .4rem)}.large.player .fsu-cards-attr{right:0;left:auto;}.large.player .fsu-cards-pos{right:auto;left:0;}                                       .ut-image-button-control.filter-btn.fsu-transfer::after{content:'\\E0C1';font-size:1.6rem}.ut-image-button-control.filter-btn.fsu-club::after{content:'\\E04A';font-size:1.6rem}.ut-image-button-control.filter-btn.fsu-swap::after{content:'\\E08D';font-size:1.4rem}.ut-image-button-control.filter-btn.fsu-refresh::after{content:'\\E0AC';font-size:1.4rem}.filter-btn.fsu-swap,.filter-btn.fsu-transfer,.filter-btn.fsu-club,.filter-btn.fsu-refresh{margin-left:1rem}                                  .fsu-akb .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip{font-family:UltimateTeam-Icons,sans-serif;font-style:normal;font-variant:normal;font-weight:400;text-transform:none;flex-shrink:0;font-size:1em;text-decoration:none;text-align:center;line-height:1.5rem;transition:color .3s,bottom .3s,top .3s}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip::before,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip::before{content:'\\E049';color:#3a4755}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--grip::before,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--grip::before{content:'\\E02C';color:#36b94b}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--track,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--track{background-color:#36b94b}.fsu-akb .ut-toggle-cell-view>.ut-toggle-cell-view--label{display:none}.fsu-akb .ut-toggle-cell-view{position:absolute;z-index:10;transform:scale(0.7);top:-.2rem;left:-.5rem;padding:0 1rem 1rem 0;cursor:pointer}.fsu-akb-title{align-items:center;background-color:#2b3540;display:flex;justify-content:space-between;padding:.75rem .5rem;border-top:solid 1px #556c95}.fsu-akb-left{display:flex;align-items:center}.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip{transition:color .3s,left .3s,right .3s}.fsu-akb-left>div{padding:0 .675rem 0 0}.fsu-akb-left>div:last-child{padding-right:0}                  body.landscape.futweb{min-height: 38rem;}.ut-tab-bar-item-notif ~ .fsu-task-bar{top: auto;bottom: 0;}               .ut-club-hub-view .tile.fsu-lock .tileContent:before { content:'\\E097'; }                            .fsu-objnew{background:#ff0000;z-index:2;position:absolute;left:0;top:1rem;transform:rotate(-45deg);transform-origin:0 100%;padding:6px 10px;width:3.2rem;text-align:center}              .fsu-lockbtn{padding:0 10px;position:absolute;right:2rem;bottom:0;z-index:2;margin:2rem 0 .8rem 2rem;}.fsu-lockbtn::before{font-family:UltimateTeam-Icons,sans-serif;padding-right:.4rem;content:'';display:inline-block;vertical-align:middle;background-size:100% auto;background-repeat:no-repeat}.fsu-lockbtn.unlock::before{content:'\\E0C4'}.fsu-lockbtn.lock::before{content:'\\E097'}.fsu-lockbtn.unlock{background-color:#fcfcf7;color:#151616}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.locked,html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.untradeable{padding-right:2.7em}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.locked::before,html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.untradeable::before{right:1.4em}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked::after{font-family:UltimateTeam-Icons,sans-serif;color:#d31332;margin-top:2px;position:absolute;width:1.1em;content:'\\E097';right:0}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked{padding-right:1.4em}html[dir=ltr] :not(.phone) .listFUTItem .entityContainer>.name.fsulocked.untradeable { max-width: 42%; }        .fsu-cardlock{position:absolute;height:.9rem;width:.9rem;right:0;bottom:5%;z-index:2;background-color:#222426;border:1px solid #333d47;border-radius:100%;text-align:center;box-shadow:0 1px 3px #000;font-size:10.8px}.fsu-cardlock::before{font-family:UltimateTeam-Icons,sans-serif;content:'\\E097';display:inline-block;vertical-align:middle;background-size:100% auto;color:#d31332;background-repeat:no-repeat}                            .filter-btn.fsu-eligibilitysearch{height:1.8rem;width:1.8rem;position:absolute;right:0}.ut-image-button-control.filter-btn.fsu-eligibilitysearch::after{font-size:1.4rem;content:'\\E098'}                  .item.player>.fsu-cards-rating{position:absolute;left:50%;top:50%;font-size:5rem;transform:translate(-50%,-50%)}.large.item.player>.fsu-cards-rating{font-size:7rem}.item.player.ut-item-loading>.fsu-cards-rating{opacity:1}.item.player.ut-item-loaded>.fsu-cards-rating{opacity:0}                        .fsu-chemistryfilter{position:absolute;right:.5rem;top:.5rem;}                          .ut-list-active-tag-view .label-container.fsu-inclubtag{background-color:#0b96ff}.ut-list-active-tag-view .label-container.fsu-inclubtag::after{border-color:#0b96ff}"


    //获取futbin信息
    function getFutbin(url){
        return new Promise(res => {
            GM_xmlhttpRequest({
                method:"GET",
                url:url,
                headers: {
                    "Content-type": "application/json"
                },
                onload:function(response){
                    if(response.status == 404){
                        events.notice("notice.loaderror",2);
                        if(document.querySelector(".ut-click-shield").classList.contains("showing")){
                            events.hideLoader()
                        }
                        return;
                    }
                    res(JSON.parse(response.response))
                },
                onerror:function(){
                    events.notice("notice.loaderror",2);
                    if(document.querySelector(".ut-click-shield").classList.contains("showing")){
                        events.hideLoader()
                    }
                }
            })
        })
    };

    call.view = {
        card:UTPlayerItemView.prototype.renderItem,
        squad:UTBaseSquadSplitViewController.prototype.viewDidAppear,
        unassigned:UTUnassignedItemsViewController.prototype.renderView,
        pack:UTStorePackDetailsView.prototype._generate,
        build:UTSquadBuilderViewController.prototype.viewDidAppear,
        market:UTMarketSearchView.prototype._generate,
        setting:UTAppSettingsView.prototype._generate,
        picks:UTPlayerPicksView.prototype.setItems,
        picksSelect:UTPlayerPicksView.prototype.selectPickOption,
        squadRating:UTSquadEntity.prototype._calculateRating,
        transfer:UTTransferListViewController.prototype._renderView,
        clubHub:UTClubHubView.prototype.clearTileContent,
        academySlot:UTAcademySlotItemDetailsViewController.prototype.renderView
    }
    UTPlayerPicksView.prototype.setItems = function(t, r){
        call.view.picks.call(this,t,r)
        let pa = this.playerPickViews;
        let back = events.createButton(
            new UTImageButtonControl(),
            "",
            (e) => {
                if(isPhone()){
                    this.hide();
                    this.__root.classList.add("fade-out");
                    cntlr.current()._view._playerPicksTile._tapDetected(this);
                }else{
                    this._superview._triggerActions(UTModalContainerView.Event.SHIELDPRESS)
                }
            },
            "back-btn fsu-picksback"
        )
        this._fsuback = back;
        this.__title.parentNode.insertBefore(this._fsuback.__root, this.__title);
        if(pa.length == t.length && !isPhone() && info.set.player_futbin){
            t.forEach(function(v, i) {
                if(v.isPlayer()){
                    let b = events.createButton(
                        new UTStandardButtonControl(),
                        fy("quicklist.gotofutbin"),
                        (e) => {events.openFutbinPlayerUrl(e);},
                        "call-to-action mini fsu-pickspc"
                    )
                    b.__root.setAttribute("data-id",v.definitionId);
                    b.__root.setAttribute("data-name",v._staticData.name);
                    pa[i]._fsuPlayer = b;
                    pa[i].__root.appendChild(pa[i]._fsuPlayer.__root);
                }
            });
        }
    }
    UTPlayerPicksView.prototype.selectPickOption = function(t, e, i){
        call.view.picksSelect.call(this,t,e,i)
        if(e.isPlayer() && isPhone() && info.set.player_futbin){
            let b = events.createButton(
                new UTStandardButtonControl(),
                fy("quicklist.gotofutbin"),
                (e) => {events.openFutbinPlayerUrl(e);},
                "call-to-action mini fsu-pickspc"
            )
            b.__root.setAttribute("data-id",e.definitionId);
            b.__root.setAttribute("data-name",e._staticData.name);
            this.phoneLargeItem._fsuPlayer = b;
            let old = this.phoneLargeItem.__optionContainer.getElementsByClassName("fsu-pickspc");
            while (old.length > 0) {
                old[0].parentNode.removeChild(old[0]);
            }
            this.phoneLargeItem.__optionContainer
            .appendChild(this.phoneLargeItem._fsuPlayer.__root);
        }
    }
    UTSquadBuilderViewController.prototype.viewDidAppear = function() {
        call.view.build.call(this)
        if(this.squad.isSBC()){
            this._view.getSortDropDown().setIndexById(3);

            this._view._fsuleague = events.createToggle(
                `${fy(`builder.league`)}(${info.set.shield_league.length})`,
                async(e) => {
                    build.set("league",e.getToggleState())
                }
            )
            this._view._fsuleague.toggle(info.build.league);
            this._view._searchOptions.__root.appendChild(this._view._fsuleague.__root);

            this._view._fsurare = events.createToggle(
                fy(`builder.rare`),
                async(e) => {
                    build.set("rare",e.getToggleState())
                }
            )
            this._view._fsurare.toggle(info.build.rare);
            this._view._searchOptions.__root.appendChild(this._view._fsurare.__root);


            this._view._fsupos = events.createToggle(
                fy(`builder.ignorepos`),
                async(e) => {
                    build.set("ignorepos",e.getToggleState())
                }
            )
            this._view._fsupos.toggle(info.build.ignorepos);
            this._view._searchOptions.__root.appendChild(this._view._fsupos.__root);
            
        }
    }
    UTPlayerItemView.prototype.renderItem = function (p, t) {
        call.view.card.call(this, p, t);
        if (p.isValid()) {
            setTimeout(() => {
                //卡片样式 0新版 1旧版
                let stc = info.set.card_style == 1 ? "old" : "new" ;
                let ct = t.getExpColorMap(p.getTier());
                let cr = info.set.card_style == 1 ? `rgb(0,64,166)` : `rgb(${ct.dividers.r},${ct.dividers.g},${ct.dividers.b})` ;
                let cf = `rgb(${ct.footer.r},${ct.footer.g},${ct.footer.b})`;

                //位置区块添加

                let otherPos = p.possiblePositions.filter((z) => {return z !== p.preferredPosition}).map((z) => {return UTLocalizationUtil.positionIdToName(z, services.Localization)})
                let fcp = document.createElement("div");

                let controller = cntlr.current();
                fcp.classList.add("fsu-cards","fsu-cards-pos",stc);
                fcp.style.borderColor = cr;
                fcp.setAttribute('data-id',p.id);
                fcp.innerHTML = otherPos.map((z) => {return `<div>${z}</div>`}).join(``);
                this._fsuCardPos = fcp;

                //额外属性区块
                let pwork = ["?","M","L","H"];
                let fca = document.createElement("div");
                fca.classList.add("fsu-cards","fsu-cards-attr",stc);
                fca.style.borderColor = cr;
                fca.innerHTML = `<div>${p.isLeftFoot() ? "L" : "R"}</div><div>${pwork[p.getOffensiveWorkRate() + 1]}/${pwork[p.getDefensiveWorkRate() + 1]}</div><div>${p.getSkillMoves()}/${p.getWeakFoot()}</div>`;
                this._fsuCardAttr = fca;

                //价格区块
                let pp = info.roster.data.hasOwnProperty(p.definitionId) ? info.roster.data[p.definitionId].prices[info.base.platform].LCPrice : "0";

                let fcpr = document.createElement("div");
                fcpr.classList.add("fsu-cards-price","fsu-price-box","fsu-price-val","fsu-cards","currency-coins",stc);
                fcpr.setAttribute('data-id',p.definitionId);
                fcpr.setAttribute('data-value',pp);
                fcpr.style.borderColor = cr;
                if(p.untradeable && !p.getAuctionData().isSold()){
                    fcpr.style.color = "#f7b702";
                }
                fcpr.innerText = pp;
                this._fsuCardPrice = fcpr;

                let fcr = document.createElement("div");
                fcr.classList.add("fsu-cards-rating","fsu-cards");
                fcr.style.color = info.set.card_style == 1 ? `#656563` : `rgb(${ct.dividers.r},${ct.dividers.g},${ct.dividers.b})`;
                fcr.textContent = p.rating;
                this._fsuCardRating = fcr;

                let fcpb = document.createElement("div");
                fcpb.classList.add("fsu-price-box");
                fcpb.setAttribute('data-id',p.definitionId);
                let plast = "",ptl ="";
                if(p.lastSalePrice !== 0){
                    plast = `<div class="fsu-price-last"><div class="title">${fy("price.last")}</div><div class="value currency-coins">${p.lastSalePrice.toLocaleString()}</div></div>`;
                    ptl = Number(pp) ? events.priceLastDiff(pp.replace(/,/g, ''),p.lastSalePrice) : "<span></span>";
                }
                fcpb.innerHTML = `${isPhone() ? "" : plast}<div class="fsu-price-val" ${p.untradeable && !p.getAuctionData().isSold() ? 'style="color:#f7b702"' : ""} data-value="${pp}" ${isPhone() && p.lastSalePrice !== 0 ? "data-last=" + p.lastSalePrice.toLocaleString() : ""}><div class="title">${fy("price.now")}${ptl}</div><div class="value currency-coins">${pp}</div></div>`;
                this._fsuCardPriceBox = fcpb;

                let plow = info.base.price.hasOwnProperty(p.rating) ? `<div class="fsu-other-low currency-coins">${fy("duplicate.lowprice")}${Number(info.base.price[p.rating]["p"]).toLocaleString()}</div>` : `<span class="fsu-other-low"></span>`;
                
                let pOtherPos = otherPos.length ? `<div class="fsu-other-pos">${otherPos.join(" / ")}</div>` : `<span class="fsu-other-pos"></span>`;

                let pe = -1,sp = events.getItemBy(2,{"definitionId":p.definitionId});
                if(sp.length == 1){
                    pe = sp[0].untradeable ? 0 : 1;
                }
                if(p.duplicateId){
                    if(services.Item.itemDao.itemRepo.club.items._collection.hasOwnProperty(p.duplicateId)){
                        pe = services.Item.itemDao.itemRepo.club.items._collection[p.duplicateId].untradeable ? 0 : 1;
                    }
                }else{
                    if(info.roster.thousand.hasOwnProperty(p.definitionId)){
                        pe = info.roster.thousand[p.definitionId].untradeable ? 0 : 1;
                    }
                }
                let pd = "";
                if(pe == -1){
                    if(p.duplicateId !== 0){
                        pd = `<div class="fsu-other-dup">${fy("duplicate.nodata")}</div>`;
                    }else{
                        pd = `<div class="fsu-other-dup swap">${fy("duplicate.swap")}</div>`;
                    }
                }else if(pe == 0){
                    pd = `<div class="fsu-other-dup not">${fy("duplicate.not")}</div>`;
                }else{
                    pd = `<div class="fsu-other-dup yes">${fy("duplicate.yes")}</div>`;
                }

                let fco = document.createElement("div");
                fco.classList.add("fsu-player-other","fsu-cards");
                fco.innerHTML = `${pd}${pOtherPos}${plow}`;
                this._fsuCardOther = fco;

                
                if(!p.isGK() && info.set.card_accele && p.getMetaData()){
                    let fcAccele = document.createElement("div");
                    fcAccele.classList.add("fsu-cards-accele-large","fsu-cards");
                    fcAccele.style.borderColor = cr;
                    fcAccele.innerHTML = fy(`player.accelerate${events.countPlayerAccele(p.getMetaData().height,p.getMetaData().attributes[2].rating,p.getMetaData().attributes[0].rating,p.getMetaData().attributes[6].rating)}`);
                    this._fsuCardAccele = fcAccele;
                }

                let pId = p.id ? p.id : p.definitionId;
                let playerLock = info.lock.includes(p.id);
                if(!this.__root) return;
                if(!this.__root.querySelector("span[p-id]")){
                    let fpi = document.createElement("span");
                    fpi.setAttribute('p-id',pId);
                    fpi.style.display = "none";
                    this._fsuCardPid = fpi;
                    this.__root.append(this._fsuCardPid);
                }else{
                    this.__root.querySelector("span[p-id]").setAttribute('p-id',pId);
                }
                if(!this.__root.parentNode.classList.contains("CompareDetails")){
                    this.__root.parentNode.querySelectorAll(".fsu-cards").forEach(e => e.remove());
                }
                if(this.__root.classList.contains("small")){
                    let sp = `span[p-id="${pId}"]`;
                    let pm = {
                        1:`.itemList > .listFUTItem.won ${sp}`,
                        2:`.itemList > .listFUTItem.has-auction-data ${sp}`,
                        3:`.itemList > .listFUTItem ${sp}`,
                        //拍卖行
                        7:`.SearchResults .paginated-item-list .listFUTItem.has-auction-data ${sp}`,
                        //替换球员上部
                        5:`.ut-pinned-item.has-iterator .listFUTItem ${sp}`,
                        //比较价格上部
                        6:`.ut-pinned-item .listFUTItem ${sp}`,
                        //比较价格
                        //普通样式
                        8:`.ut-club-search-results-view .paginated-item-list .listFUTItem ${sp}`,
                        //俱乐部

                        10:`.paginated-item-list .listFUTItem ${sp}`,
                        21:`.ut-squad-pitch-view.sbc ${sp}`,
                        22:`.ut-squad-pitch-view ${sp}`,
                        23:`.ut-squad-slot-dock-view.sbc ${sp}`,
                        24:`.ut-squad-slot-dock-view ${sp}`,
                        25:`.reward.small ${sp}`,

                    }
                    let cs = 0;
                    for (let i in pm) {
                        if(document.querySelector(pm[i])){
                            if(!document.querySelector(pm[i]).parentNode.querySelectorAll(".fsu-cards").length){
                                cs = Number(i);
                                break
                            }
                        }
                    }
                    if(cs == 7 && document.querySelector(".icon-transfer.selected")) cs = 4;
                    if(cs == 8 && document.querySelector(".icon-club.selected")) cs = 9;
                    if(cs == 2 && controller.className == "UTWatchListViewController") cs = 11;
                    if(cs == 8 && controller.className == "UTAcademyPlayerFromClubViewController") cs = 3;
                    //console.log(cs)
                    if(cs !== 0){
                        //位置区块添加
                        //额外属性区块
                        this.__root.after(this._fsuCardAttr);
                        if([21,22,23,24,25].includes(cs)){
                            this.__root.after(this._fsuCardPos);
                            if([21,23].includes(cs) && info.lock.includes(pId)){
                                let cardLock = document.createElement("div");
                                cardLock.classList.add("fsu-cards","fsu-cardlock");
                                this.__root.after(cardLock);
                            }
                        }
                        if([5,21,22,23,24,25].includes(cs)){
                            this.__root.prepend(this._fsuCardPrice);
                        }else{
                            let pbc = "right";
                            if([1,2,4,7,11].includes(cs)){
                                pbc = "top";
                                if(isPhone()){
                                    this.getRootElement().parentNode.querySelector(".name").style.width = "25%";
                                }
                            }
                            this._fsuCardPriceBox.classList.add(pbc);
                            if(cs == 4 || cs == 7 || cs == 11){
                                this._fsuCardPriceBox.querySelector(".fsu-price-last")?.remove();
                                this._fsuCardPriceBox.querySelector(".title span")?.remove();
                                this.__root.parentNode.append(this._fsuCardPriceBox);
                            }else if(cs == 6 || cs == 8){
                                this.__root.prepend(this._fsuCardPrice);
                            }else{
                                this.__root.after(this._fsuCardPriceBox);
                            }

                            if(cs == 4 || cs == 6) this._fsuCardOther.querySelector(".fsu-other-low").remove();
                            if(cs == 1 || cs == 8  || cs == 9) this._fsuCardOther.querySelector(".fsu-other-dup").remove();
                            if(![7].includes(cs)){
                                this.__root.parentNode.append(this._fsuCardOther);
                            }
                        }
                        if([8,9].includes(cs) && playerLock){
                            this.getRootElement().parentNode.querySelector(".name").classList.add("fsulocked")
                        }

                        //阵容刷新后购买失败标识添加
                        if(controller.className.includes("UTSBCSquad") && cs == 21 && "_fsuBuyEroor" in controller._squad && controller._squad._fsuBuyEroor.includes(pId) && p.concept){
                            let parentElement = this.getRootElement().parentNode;
                            if(parentElement.querySelector(".fsu-cards-buyerror") == null){
                                parentElement.insertBefore(events.getBuyErrorTipsHtml(), this.getRootElement());
                            }
                        }
                    }
                }else{
                    let cardParen = this.__root.parentElement;
                    if(!("_fsuLock" in this) && p.loans == -1 && !p.concept && p.state == ItemState.FREE && !p.isDuplicate()){
                        this._fsuLock = events.createButton(
                            new UTStandardButtonControl(),
                            playerLock ? fy("locked.unlock") : fy("locked.lock"),
                            (e) => {
                                lock.save(e.id);
                                let playerLock = info.lock.includes(e.id);
                                e.setText(playerLock ? fy("locked.unlock") : fy("locked.lock"));
                                e.getRootElement().classList.remove("unlock","lock");
                                e.getRootElement().classList.add(playerLock ? "unlock" : "lock");
                                if(!isPhone()){
                                    if("_fsuLock" in cntlr.left()){
                                        cntlr.left()._requestItems(false);
                                    }
                                    cntlr.left().refreshList()
                                }
                            },
                            `fsu-lockbtn ${playerLock ? "unlock" : "lock"} ${isPhone() ? "" : "mini"}`
                        )
                        this._fsuLock.id = p.id;
                        let classNameRegex = /ClubSearchResult|UTSquad|UTSBCSquad/;
                        if((classNameRegex.test(controller.className) || (isPhone() && controller.className == `ItemDetailsViewController`)) && document.querySelector(`.slider span[p-id="${p.id}"]`) && !cardParen.classList.contains("reward")){
                            cardParen.insertBefore(this._fsuLock.getRootElement(),cardParen.firstChild)
                        }
                        
                    }
                    if(cardParen.querySelectorAll(".player").length > 1){
                        this.__root.prepend(this._fsuCardPos);
                        this.__root.prepend(this._fsuCardAttr);
                    }else{
                        this.__root.after(this._fsuCardPos);
                        this.__root.after(this._fsuCardAttr);
                    }
                    this.__root.prepend(this._fsuCardPrice);
                    if("_fsuCardAccele" in this){
                        this.__root.prepend(this._fsuCardAccele);
                    }
                    if(cardParen.classList.contains('player-pick-option')){
                        cardParen.style.position = "relative";
                        cardParen.style.padding = "0 1.2rem";
                        this._fsuCardOther.querySelector(".fsu-other-low").remove();
                        this._fsuCardOther.querySelector(".fsu-other-pos").remove();
                        this.__root.after(this._fsuCardOther)
                    }

                    //大卡预览处增加购买失败描述
                    if("_squad" in controller && "_fsuBuyEroor" in controller._squad && controller._squad._fsuBuyEroor.includes(pId) && p.concept && cardParen.classList.contains("tns-item")){
                        if(cardParen.querySelector(".fsu-cards-buyerror") == null){
                            this.getRootElement().appendChild(events.getBuyErrorTipsHtml())
                        }
                    }

                    //战术编辑处调整大卡片的属性显示错误。
                    if((cardParen.classList.contains("ut-tactics-instruction-menu-view--item-container") || cardParen.classList.contains("main-reward")) && cardParen.classList.length === 1){
                        cardParen.style.position = "relative";
                    }
                }
                
                this.__root.appendChild(this._fsuCardRating);
                if(!info.set.card_pos){
                    this._fsuCardPos.remove();
                }
                if(!info.set.card_price){
                    this._fsuCardPriceBox.remove();
                    this._fsuCardPrice.remove();
                }
                if(!info.set.card_other){
                    this._fsuCardAttr.remove();
                }
                if(!info.set.card_low){
                    this._fsuCardOther.querySelector(".fsu-other-low")?.remove();
                }
                if(!info.set.card_club){
                    this._fsuCardOther.querySelector(".fsu-other-dup")?.remove();
                }
            }, 10);
        };
    };
    call.plist = {
        sectioned:UTSectionedItemListView.prototype.addItems,
        paginated:UTPaginatedItemListView.prototype.renderItems,
        storeReveal:UTStoreRevealModalListView.prototype.addItems,
        picks:UTPlayerPicksViewController.prototype.viewDidAppear,
        club:UTClubRepository.prototype.removeClubItem,
        squadSet:UTSquadEntity.prototype.setPlayers,
        squadGR:UTSquadEntity.prototype.getRating,
        squad:UTSquadOverviewViewController.prototype.viewDidAppear,
        clubSelectItem:UTSelectItemFromClubViewController.prototype.updateItemList
    }
    call.other = {
        uaTile:UTUnassignedTileView.prototype.setNumberOfItems,
        store:{
            setPacks:UTStoreView.prototype.setPacks,
            openPack:UTStoreViewController.prototype.eOpenPack,
            setCategory:UTStoreViewController.prototype.setCategory
        },
        requestItems:UTSelectItemFromClubViewController.prototype.requestItems,
        market:{
            eSearch:UTMarketSearchFiltersView.prototype.eSearchButtonSelected,
            setFilter:UTMarketSearchFiltersView.prototype.setFilters,
        },
        rewards:{
            base:UTRewardsCarouselView.prototype.setupRewards,
            campaign:UTCampaignRewardsCarouselView.prototype.setupRewards,
            campaigns:UTCampaignRewardsCarouselView.prototype.setupCampaignRewards,
            selection:UTRewardSelectionChoiceViewController.prototype.viewDidAppear,
            popupTapped:UTGameRewardsViewController.prototype.onButtonTapped
        },
        SBCSetDealloc:UTSBCSetTileView.prototype.dealloc
    }

    //SBC任务创建奖励canvas未删除导致内存占用过高临时处理办法。
    UTSBCSetTileView.prototype.dealloc = function(...args) {
        _.map(this.getSubviews(),i => { 
            if(i.className == "UTLargePlayerItemView"){
                console.log("SBC奖励销毁")
                i.dealloc()
            }
        })
        call.other.SBCSetDealloc.call(this, ...args);
    }


    UTSquadOverviewViewController.prototype.viewDidAppear = function() {
        call.plist.squad.call(this);
        let p = this._squad._players.map(function (i) {if(i._item.type == "player" && !info.roster.data.hasOwnProperty(i._item.definitionId)){return i._item.definitionId}}).filter(i => i > 0);
        events.loadPlayerPrice(p);


        if(this._squad.isSBC()){
            let sp = this._view;
            if(sp.hasOwnProperty("_fsuQuickRight")){
                sp._fsuQuickRight.remove()
            }
            if(sp.hasOwnProperty("_fsuQuickTop")){
                sp._fsuQuickTop.remove()
            }
            if(sp.hasOwnProperty("_detailsButton") && isPhone()){
                sp._detailsButton.__root.style.zIndex = 999;
            }
            let e = this._challenge.eligibilityRequirements;
            let t = 0;
            let th = document.createElement("div");
            th.classList.add("fsu-quick","top")
            sp._fsuQuickTop = th;
            let to = document.createElement("div");
            to.classList.add("fsu-quick-list","other");
            sp._fsuQuickOther = to;
            sp._fsuRlist = {};
            
            for (let i of e) {
                if(i.kvPairs._collection.hasOwnProperty(19)){
                    t = i.kvPairs._collection[19][0];
                    sp._fsuCount = events.createButton(
                        new UTButtonControl(),
                        fy("sbc.count"),
                        (e) => {events.squadCount(e);},
                        "im"
                    )
                    sp._fsuCount.__root.setAttribute("data-r",t);
                    sp._fsuQuickOther.append(sp._fsuCount.__root);
                }
                if(i.kvPairs._collection.hasOwnProperty(35)){
                    sp._fsuConsult = events.createButton(
                        new UTButtonControl(),
                        fy("sbc.consult"),
                        (e) => {events.squadConsult(e);},
                        "im"
                    )
                    sp._fsuConsult.__root.setAttribute("data-id",this._challenge.id);
                    sp._fsuQuickOther.append(sp._fsuConsult.__root);
                }
            }

            let y = t !== 0 ? t : 75;
            let rh = document.createElement("div");
            rh.classList.add("fsu-quick","right");
            rh.innerHTML = `<div class="fsu-quick-list"></div>`;
            sp._fsuQuickRight = rh;
            let yl = [],
            ylLimit = isPhone() ? [4,8] : [5,10];
            for (let i = 1; i < 11; i++) {
                if(events.getDedupPlayers(events.getItemBy(1,{"rating":y-i}),this._squad.getPlayers()).length){
                    yl.push(y-i);
                }
                if(yl.length == ylLimit[0]){
                    break;
                }
            }
            for (let i = 0; i < 99-y; i++) {
                if(events.getDedupPlayers(events.getItemBy(1,{"rating":y+i}),this._squad.getPlayers()).length){
                    yl.unshift(y+i);
                }
                if(yl.length == ylLimit[1]){
                    break;
                }
            }
            if(t !== 0 && yl.length){
                let ts = document.createElement("div");
                ts.classList.add("fsu-quick-list","left");
                sp._fsuQuickTop.append(ts);
                // sp._fsuQuickTop.append(events.createDF(`<div class="fsu-quick-inr">OR</div>`));
                let ratPlus = `${Number(yl[0]) + 1}`,
                ratPlusBut = events.createButton(
                    new UTButtonControl(),
                    "",
                    (e) => {events.SBCSetRatingPlayers(e);},
                    "im"
                )
                ratPlusBut.__root.innerHTML = `<span> >= </span>${ratPlus}`;
                ratPlusBut.__root.setAttribute("data-r",`${ratPlus}GT`);
                sp._fsuRlist[`t_${ratPlus}+`] = ratPlusBut;
                sp._fsuQuickTop.querySelector(`.left`).append(ratPlusBut.__root);

                let ratMinus = `${Number(yl[yl.length - 1]) - 1}`,
                ratMinusBut = events.createButton(
                    new UTButtonControl(),
                    "",
                    (e) => {events.SBCSetRatingPlayers(e);},
                    "im"
                )
                ratMinusBut.__root.innerHTML = `<span> <= </span>${ratMinus}`;
                ratMinusBut.__root.setAttribute("data-r",`${ratMinus}LT`);
                sp._fsuRlist[`t_${ratMinus}-`] = ratMinusBut;
                sp._fsuQuickTop.querySelector(`.left`).append(ratMinusBut.__root);
                if(ratMinus > 80 && t > 80){
                    let ratGold = `GOLD`,
                    ratGoldBut = events.createButton(
                        new UTButtonControl(),
                        "",
                        (e) => {events.SBCSetRatingPlayers(e);},
                        "im"
                    )
                    ratGoldBut.__root.innerHTML = `75<span>-</span>80`;
                    ratGoldBut.__root.setAttribute("data-r",`GOLD`);
                    sp._fsuRlist[`t_${ratGold}`] = ratGoldBut;
                    sp._fsuQuickTop.querySelector(`.left`).append(ratGoldBut.__root);
                }
            }
            if(sp._fsuQuickOther.innerHTML !== ""){
                sp._fsuQuickTop.append(sp._fsuQuickOther);
            }
            sp._summaryPanel.__root.append(sp._fsuQuickTop)
            //初始载入保存阵容
            if(!isPhone() || !this._squad.hasOwnProperty("_fsuOldSquad")){
                events.saveOldSquad(this._squad,false,true);
            }
            info.douagain.sbc = this._set.id;
            for (let i of yl) {
                let n = `r_${i}`
                let r = events.createButton(
                    new UTButtonControl(),
                    i,
                    (e) => {events.SBCSetRatingPlayers(e);},
                    "im"
                );
                r.__root.setAttribute("data-r",i);
                sp._fsuRlist[n] = r;
                sp._fsuQuickRight.querySelector(".fsu-quick-list").append(sp._fsuRlist[n].__root);
            }

            let quickUnassignedBtn = events.createButton(
                new UTButtonControl(),
                fy("sbc.qucikdupes"),
                (e) => {events.SBCSetRatingPlayers(e);},
                "im"
            );
            quickUnassignedBtn.__root.setAttribute("data-r","d");
            sp._fsuRlist["r_d"] = quickUnassignedBtn;
            quickUnassignedBtn.setInteractionState(!1)
            sp._fsuQuickRight.querySelector(".fsu-quick-list").append(quickUnassignedBtn.getRootElement());
            
            //开始判断是否需要屏蔽重复按钮
            let unassignedIds = _.uniq(_.map(repositories.Item.getUnassignedItems(), `definitionId`));
            if(unassignedIds.length){
                if(events.getDedupPlayers(events.getItemBy(2,{definitionId:unassignedIds}),this._squad.getPlayers()).length){
                    quickUnassignedBtn.setInteractionState(1)
                }
            }

            //转会名单搜索功能
            let quickTransfersBtn = events.createButton(
                new UTButtonControl(),
                fy("sbc.quciktransfers"),
                (e) => {
                    events.SBCSetRatingPlayers(e);
                },
                "im"
            );
            quickTransfersBtn.__root.setAttribute("data-r","t");
            sp._fsuRlist["r_t"] = quickTransfersBtn;
            quickTransfersBtn.setInteractionState(!1)
            sp._fsuQuickRight.querySelector(".fsu-quick-list").append(quickTransfersBtn.getRootElement());
            console.log(quickTransfersBtn,p)
            
            //开始判断是否需要屏蔽搜索按钮
            let transferIds = _.uniq(_.map(repositories.Item.getTransferItems(),i => {if(i.getAuctionData().isInactive()){ return i.definitionId}}).filter(Boolean));
            if(transferIds.length){
                if(events.getDedupPlayers(events.getItemBy(2,{definitionId:transferIds}),this._squad.getPlayers()).length){
                    quickTransfersBtn.setInteractionState(1)
                }
            }

            //阵容回退按钮
            if(info.set.sbc_sback){
                let rb = events.createButton(
                    new UTButtonControl(),
                    fy("sbc.squadback"),
                    (e) => {
                        let c = e._challenge.squad._fsuOldSquadCount;
                        if(c){
                            events.popup(
                                fy("squadback.popupt"),
                                fy(["squadback.popupm",c]),
                                (t) => {
                                    if(t === 2){
                                        events.showLoader();
                                        let s = e._challenge.squad._fsuOldSquad[c - 1]
                                        events.saveSquad(e._challenge,e._challenge.squad,s,[]);
                                        e._challenge.squad._fsuOldSquadCount--;
                                        e._challenge.squad._fsuOldSquad.pop();
                                    }
                                }
                            )
                        }else{
                            events.notice("notice.nosquad",2);
                        }
                    },
                    "im"
                );
                rb._challenge = this._challenge;
                sp._fsuRlist["r_b"] = rb;
                sp._fsuQuickRight.querySelector(".fsu-quick-list").append(sp._fsuRlist["r_b"].__root);
            }

            sp._summaryPanel.__root.after(sp._fsuQuickRight);
            if(!info.set.sbc_top){
                sp._fsuQuickTop.remove();
            }
            if(!info.set.sbc_right){
                sp._fsuQuickRight.remove();
            }
        }
    }
    //分个形式(拍卖行待售、待分配)球员列表 读取球员列表查询价格
    UTSectionedItemListView.prototype.addItems = function(t, e, i, r) {
        call.plist.sectioned.call(this,t, e, i, r);
        let p = this.listRows.map(function (i) {if(i.data.type == "player" && !info.roster.data.hasOwnProperty(i.data.definitionId)){return i.data.definitionId}}).filter(Boolean);
        events.loadPlayerPrice(p,this);
        if(info.set.player_loas && services.User.getUser().tradeAccess == TradeAccessLevel.ALLOWED && cntlr.current().getNavigationTitle() !== services.Localization.localize("navbar.label.watchlist") && (cntlr.current().getNavigationTitle() !== services.Localization.localize("navbar.label.assigncards") || repositories.Item.getPileSize(ItemPile.TRANSFER) - repositories.Item.numItemsInCache(ItemPile.TRANSFER) > 0)){
            let pn = 0,pr = {},ln = 0;
            for (let n of this.listRows) {
                if(!n.data.untradeable && n.data.loans == -1 && n.data.type == "player" && !n.data._auction.isClosedTrade() && !n.data._auction.isActiveTrade()){
                    pn++;
                    n.__root.classList.add("fsu-akb");
                    n._fsuLosAuction = events.createToggle(
                        "",
                        async(e) => {
                            if(e.getToggleState()){
                                e._parent._fsuAkbCurrent++;
                                e._parent._fsuAkbArray[e._id] = e;
                            }else{
                                e._parent._fsuAkbCurrent--;
                                delete e._parent._fsuAkbArray[e._id];
                            }
                            e._parent._fsuAkbToggle.toggle(e._parent._fsuAkbCurrent == e._parent._fsuAkbNumber);
                            events.losAuctionCount(e._parent,1)
                        },
                        ""
                    )
                    n._fsuLosAuction.toggle(1);
                    n._fsuLosAuction._parent = this;
                    pr[n.data.id] = n._fsuLosAuction;
                    n._fsuLosAuction._id = n.data.id;
                    n._fsuLosAuction._pId = n.data.definitionId;
                    n._fsuLosAuction._l = ln;
                    n._fsuLosAuction.setInteractionState(0);
                    n.__root.insertBefore(n._fsuLosAuction.__root,n.__root.firstChild)
                }
                ln++;
            }
            if(pn){
                let b = document.createElement("div");
                b.classList.add("fsu-akb-left");
                this._fsuAkbToggle = events.createToggle(
                    fy("losa.all"),
                    async(e) => {
                        let sf = e.getToggleState() ? true : false;
                        e._parent._fsuAkbCurrent = sf ? e._parent._fsuAkbNumber : 0;
                        e._parent._fsuAkbArray = {};
                        for (let n of e._parent.listRows) {
                            if(n.hasOwnProperty("_fsuLosAuction") && n._fsuLosAuction._interactionState){
                                n._fsuLosAuction.toggle(sf)
                                if(sf){
                                    if(n.hasOwnProperty("_fsuLosAuction")){
                                        if(events.getCachePrice(n._fsuLosAuction._pId,2)){
                                            e._parent._fsuAkbArray[n._fsuLosAuction._id] = n._fsuLosAuction;
                                        }
                                    }
                                }
                            }
                        }
                        events.losAuctionCount(e._parent,1)
                    },
                    ""
                )
                this._fsuAkbToggle.toggle(1);
                this._fsuAkbToggle.setInteractionState(0);
                this._fsuAkbToggle._parent = this;
                b.appendChild(this._fsuAkbToggle.__root);

                let bnd = document.createElement("div");
                bnd.insertAdjacentHTML('beforeend', `${fy("losa.select")} `);
                let bns = document.createElement("span");
                bns.classList.add("fsu-akb-num");
                bns.innerText = `${pn}`;
                bnd.appendChild(bns);
                bnd.insertAdjacentHTML('beforeend', `/`);
                let bnn = document.createElement("span");
                bnn.classList.add("fsu-akb-max");
                bnn.innerText = `${pn}`;
                bnd.appendChild(bnn);
                b.appendChild(bnd);

                let bpd = document.createElement("div");
                bpd.insertAdjacentHTML('beforeend', `${fy("losa.price")} `);
                let bpp = document.createElement("span");
                bpp.classList.add("fsu-akb-price","currency-coins");
                bpp.innerText = `0`;
                bpd.appendChild(bpp);
                b.appendChild(bpd);
                this._fsuAkbArray = pr;
                this._fsuAkbCurrent = pn;
                this._fsuAkbNumber = pn;
                this._fsuAkb = document.createElement("div");
                this._fsuAkb.classList.add("fsu-akb-title");
                this._fsuAkb.appendChild(b);

                this._fsuAkbButton = events.createButton(
                    new UTStandardButtonControl(),
                    fy("loas.button"),
                    (e) => {
                        events.popup(
                            fy("loas.popupt"),
                            fy(["loas.popupm",e._parent._fsuAkb.querySelector(".fsu-akb-num").innerText,e._parent._fsuAkb.querySelector(".fsu-akb-price").innerText]),
                            (t) => {
                                if(t === 2){
                                    events.losAuctionSell(e);
                                }
                            }
                        )
                    },
                    "btn-standard section-header-btn mini"
                )
                this._fsuAkbButton.setInteractionState(0);
                this._fsuAkbButton._parent = this;

                this._fsuAkb.appendChild(this._fsuAkbButton.__root);
                this._header.__root.after(this._fsuAkb);
                events.losAuctionCount(this,0);
            }
        }
    }
    events.popup = (t,m,c,o,i,n,s) => {
        if(!o){
            o =  [
                { labelEnum: enums.UIDialogOptions.OK },
                { labelEnum: enums.UIDialogOptions.CANCEL },
            ]
        }
        let mp = new EADialogViewController({
            dialogOptions: o,
            message: m,
            title: t,
            type: EADialogView.Type.MESSAGE
        });
        mp.init();
        mp.modalDisplayDimensions.minWidth = "300px";
        mp.onExit.observe(this, function (e, z) {
            e.unobserve(this);
            if(i){
                c.call(this,z,mp._fsuInput)
            }else{
                c.call(this,z)
            }
        });
        gPopupClickShield.setActivePopup(mp);
        _.flatMap(mp.getView().dialogOptions,(v,i) => {
            if(v.__text.innerHTML == "*"){
                v.setText(fy(`popupButtonsText.${mp.options[i].labelEnum}`))
            }
        })
        if(i){
            let pt = new UTTextInputControl;
            pt.init();
            if(i.constructor == Array){
                if(i.length > 0){
                    pt.setPlaceholder(i[0]);
                }
                if(i.length > 1){
                    pt.setValue(i[1]);
                }
            }else if(i.constructor == String){
                pt.setPlaceholder(i);
            }
            pt.__root.style.margin = ".5rem 0";
            pt.setInteractionState(n);
            mp._fsuInput = pt;
            mp._view.__msg.appendChild(mp._fsuInput.__root);
            if(s){
                mp._view.__msg.appendChild(events.createDF(s));
            }
        }
    }
    events.wait = (min,max) => {
        let delay = Math.floor(Math.random() * (max * 1000 - min * 1000 + 1)) + min * 1000;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    events.changeLoadingText = (t) =>{
        document.querySelector('.fsu-loading-close').innerHTML = fy(t);
    }
    //批量挂拍卖
    events.losAuctionSell = async(e) => {
        e.setInteractionState(0);
        info.base.losauction = true;
        events.showLoader();
        let a = e._parent._fsuAkbArray,b = e._parent._fsuAkbCurrent,pn = 0;
        events.notice(["loas.start",`${b}`,`${b * 5}`],1);
        for (let n in a) {
            if(!info.base.losauction){
                break;
            }
            pn++;
            events.changeLoadingText(["loadingclose.loas",`${pn}`,`${b - pn}`]);
            await events.playerToAuction(n,events.getCachePrice(a[n]._pId,1));
            console.log(a[n]._l)
            if(isPhone()){
                a[n].toggle(false);
                e._parent.listRows[a[n]._l].hide();
                e._parent._fsuAkbCurrent--;
                e._parent._fsuAkbNumber--;
                delete e._parent._fsuAkbArray[a[n]._id];
                events.losAuctionCount(e._parent)
            }
            await events.wait(2,4);
        }
        events.hideLoader();
        info.base.losauction = false;
        e.setInteractionState(e._parent._fsuAkbCurrent);
        let currentController = isPhone() ? cntlr.current() : cntlr.left();
        if(currentController.className == "UTUnassignedItemsViewController"){
            await services.Item.itemDao.itemRepo.unassigned.reset();
            await currentController.getUnassignedItems()
        }else{
            currentController.refreshList()
        }
    }
    events.getCachePrice = (i,t) => {
        if(t == 1){
            let price = 0;
            if(i in info.roster.data){
                let untreated = info.roster.data[i].prices[info.base.platform].LCPrice;
                price = isNaN(untreated) ? Number((untreated).replace(/,/g, "")) : Number(untreated);
            }
            return price;
        }else{
            return info.roster.data.hasOwnProperty(i) && events.getCachePrice(i,1) !== 0;
        }
    }
    events.losAuctionCount = (e,t) => {
        if(e.hasOwnProperty("_fsuAkbCurrent") && e.hasOwnProperty("_fsuAkbNumber") && e.hasOwnProperty("_fsuAkbArray")){
            let pn = 0,qs = {};
            for (let n in e._fsuAkbArray) {
                let p = events.getCachePrice(e._fsuAkbArray[n]._pId,1),j = events.getCachePrice(e._fsuAkbArray[n]._pId,2);
                pn += p;
                if(!j){
                    e._fsuAkbArray[n].setInteractionState(0);
                }else if(j && p == 0){
                    e._fsuAkbArray[n].setInteractionState(0);
                    e._fsuAkbCurrent--;
                    e._fsuAkbNumber--;
                    delete e._fsuAkbArray[n];
                }else{
                    e._fsuAkbArray[n].setInteractionState(1);
                }
            }
            e._fsuAkb.querySelector(".fsu-akb-num").innerText = e._fsuAkbCurrent;
            e._fsuAkb.querySelector(".fsu-akb-max").innerText = e._fsuAkbNumber;
            e._fsuAkb.querySelector(".fsu-akb-price").innerText = pn.toLocaleString();
            if(pn){
                e._fsuAkbButton.setInteractionState(1);
                e._fsuAkbToggle.setInteractionState(1);
            }else if(pn == 0){
                e._fsuAkbButton.setInteractionState(0);
            }
        }
        if(document.querySelector(".fsu-screenshot")){
            let view = isPhone() ? cntlr.current() : cntlr.left(),
            price = view.getViewModel().getSectionItems().map(i => {
                if(!i.isLoaned() && i.isPlayer()){
                    return events.getCachePrice(i.definitionId,1);
                }
            }).filter(Boolean);

            view._view.__root.querySelector(".fsu-screenshot h2 span.text").textContent = fy(["screenshot.text",price.length,price.reduce((a, b) => a + b, 0).toLocaleString()])
        }
    }
    //列表形式(右侧、拍卖行搜索结果、俱乐部)球员列表 读取球员列表查询价格
    UTPaginatedItemListView.prototype.renderItems = function(t) {
        call.plist.paginated.call(this,t);
        let p = this.listRows.map(function (i) {
            if(i.data.type == "player"){
                if(!info.roster.data.hasOwnProperty(i.data.definitionId)){
                    return i.data.definitionId
                }else{
                    //价格高亮显示
                    let np = events.getCachePrice(i.data.definitionId,1);
                    if(np && i.data.getAuctionData().buyNowPrice <= np){
                        i.__auctionBuyValue.style.backgroundColor = "#36b84b"
                    }
                }
            }
        }).filter(Boolean);
        events.loadPlayerPrice(p);
        let c = cntlr.current(),csbc = false;
        if(isPhone()){
            if(c.hasOwnProperty("_squad") && c._squad && c._squad.isSBC()){
                csbc = true;
            }
        }else{
            if(c.hasOwnProperty("_rightController") && c._rightController){
                c = cntlr.right()._parentViewController;
            }
            if(c.hasOwnProperty("_squad") && c._squad.isSBC()){
                csbc = true;
            }
        }
        if(!isPhone() && c.hasOwnProperty("_rightController") && c._rightController){
            c = cntlr.right()._parentViewController;
        }
        if(csbc){
            if(c.getNavigationTitle() == services.Localization.localize("navbar.label.clubsearch")){
                let s = [];
                if(c._fsuFillArray.length && c._currentController.searchCriteria.defId.length && this.listRows.length){
                    s = this.listRows.map(i => {
                        if(c._currentController.searchCriteria.defId.includes(i.data.definitionId)){
                            return i.data.definitionId
                        }else{
                            i.hide()
                        }
                    }).filter(Boolean);
                    if(!s.length){
                        this.__itemList.prepend(events.createDF(`<div class="ut-no-results-view"><div class="contents"><span class="no-results-icon"></span><h2>${fy("emptylist.t")}</h2><p>${fy("emptylist.c")}</p></div></div>`));
                    }else{
                        if(this.__itemList.querySelector(".ut-no-results-view")){
                            this.__itemList.querySelector(".ut-no-results-view").remove()
                        }
                    }
                }
            }else{
                //假想球员搜索结果排除其他版本项目
                let pn = this._targets._collection.rowselect[0].target;
                if(info.set.sbc_market && pn.hasOwnProperty("pinnedItemView") && pn.pinnedItemView && pn.pinnedItemView.itemCell.data.concept){
                    let z = 0;
                    let pi = pn.pinnedItemView.itemCell.data.definitionId;
                    this.listRows.forEach(function(i) {
                        if(i.data.definitionId !== pi){
                            i.__root.style.filter = "brightness(0.5)";
                            z++;
                        }
                    })
                    if(z && !isPhone()){
                        events.notice("notice.conceptdiff",1)
                    }
                }
            }
        }
    }

    //球员预览包打开 读取球员列表查询价格
    UTStoreRevealModalListView.prototype.addItems = function(e, t, i, o) {
        call.plist.storeReveal.call(this, e, t, i, o);
        let p = e.map(function (it) {if(it.type == "player" && !info.roster.data.hasOwnProperty(it.definitionId)){return it.definitionId}}).filter(Boolean);
        events.loadPlayerPrice(p);
    }

    //球员挑选包打开 读取球员列表查询价格
    UTPlayerPicksViewController.prototype.viewDidAppear = function() {
        call.plist.picks.call(this);
        let p = this.picks.map(function (i) {if(i.type == "player" && !info.roster.data.hasOwnProperty(i.definitionId)){return i.definitionId}}).filter(Boolean);
        events.loadPlayerPrice(p);
    }

    //俱乐部卖掉球员 移除在阵容列表内球员 以便计算重复效果
    UTClubRepository.prototype.removeClubItem = function(t) {
        call.plist.club.call(this,t);
        if(info.roster.thousand.hasOwnProperty(t.definitionId)){
            delete(info.roster.thousand[t.definitionId]);
        }
    }

    //阵容评分获取 每次球员变化都会获取 主要计算阵容整体价格
    UTSquadEntity.prototype.getRating = function() {
        let r = call.plist.squadGR.call(this);
        let p = [];
        for (let i of this.getFieldPlayers()) {
            let id = i._item.definitionId;
            if(id > 0 && info.roster.data.hasOwnProperty(id)){
                p.push(id)
            }
        }
        events.squadTotal(this.getFieldPlayers().map(function (i) {if(info.roster.data.hasOwnProperty(i._item.definitionId)){return i._item.definitionId}}).filter(i => i > 0));
        return r;
    }

    //阵容的总价格计算填充 需要传递阵容球员ID列表(数组)
    events.squadTotal = (p) => {
        let e = document.getElementById("squadTotal");
        if(e){
            let n = 0;
            for (let i of p) {
                n += events.getCachePrice(i,1);
            }
            e.innerText = n.toLocaleString();
            if(n !== 0 && document.getElementById("sbcPrice")){
                let p = e.parentNode.querySelector(".fsu-squad-pTitle");
                if(p.querySelector("span")){
                    p.querySelector("span").remove();
                }
                p.append(events.createDF(events.priceLastDiff(n,document.getElementById("sbcPrice").innerText.replace(/,/g, ''))))
            }
        }
    }

    //差价计算 需要传递购买价格和预估价格
    events.priceLastDiff = (p,l) => {
        let n = ((Number(p)*0.95/Number(l)-1)*100).toFixed(0);
        if (!isFinite(n)) {
            n = 0;
        }
        let v = ("+" + n +"%").replace("+-","-");
        return v.indexOf("+") != -1 ? `<span class="plus">${v}</span>` : `<span class="minus">${v}</span>`;
    }

    //球员价格读取 需要传递球员ID列表(数组)
    events.loadPlayerPrice = async(list,el) => {
        if(list.length > 0){
            let la = Array.from(new Set(list));
            let pu = [];
            let gr = Math.ceil(la.length / 23);
            console.log(la)
            for (let i = 0; i < gr; i++) {
                let lt = la.splice(-23).join();
                pu.push(`https://www.futbin.com/${info.base.year}/playerPrices?player=&rids=${lt}`)
            }
            for (let k in pu) {
                let t = await getFutbin(pu[k]);
                info.roster.data = Object.assign(info.roster.data,t);
                for (let k in t) {
                    let e = document.querySelectorAll(`.fsu-price-box[data-id='${k}']`);
                    let p = t[k].prices[info.base.platform].LCPrice;
                    if(e.length > 0){
                        for (let i of e) {
                            if(i.classList.contains("fsu-price-val")){
                                i.setAttribute("data-value",p);
                                i.innerText = p;
                            }else{
                                i.querySelector(".fsu-price-val").setAttribute("data-value",p);
                                i.querySelector(".fsu-price-val .value").innerText = p;
                            }
                            let lastPriceName = isPhone() ? '[data-last]' : '.fsu-price-last';
                            if(i.querySelectorAll(lastPriceName).length > 0){
                                i.querySelector(".fsu-price-val .title span").outerHTML = events.priceLastDiff(p.replace(/,/g, ''),isPhone() ? i.querySelector(lastPriceName).getAttribute("data-last").replace(/,/g, '') : i.querySelector(lastPriceName).innerText.replace(/,/g, ''));
                            }
                        }
                    }
                }
            }
            if(document.getElementById("squadTotal")){
                events.squadTotal(cntlr.current()._squad.getFieldPlayers().map(function (i) {return i._item.definitionId}).filter(i => i > 0));
            }
        }
        if(el){
            events.losAuctionCount(el,0)
        }
    }

    //阵容页面显示 添加阵容价值部分
    UTBaseSquadSplitViewController.prototype.viewDidAppear = function(){
        call.view.squad.call(this);

        if(info.set.info_squad){
            let p = this._squad.getPlayers().map(function (i) {if(i._item.type == "player" && !info.roster.data.hasOwnProperty(i._item.definitionId)){return i._item.definitionId}}).filter(i => i > 0);


            this._getLeftController().getView().getSummaryPanel().getRootElement().querySelector(`.ut-squad-summary-info${this.className == "UTSBCSquadSplitViewController" ? "--right" : ""}`).after(events.createDF(`<div class="fsu-squad-pBox"><div class="fsu-squad-pWrap"><span class="fsu-squad-pTitle">${fy("sbc.topsquad")}</span><span id="squadTotal" class="fsu-squad-pValue currency-coins">0</span></div></div>`))

            if(!p.length){
                events.squadTotal(this._squad.getFieldPlayers().map(function (i) {if(info.roster.data.hasOwnProperty(i._item.definitionId)){return i._item.definitionId}}).filter(i => i > 0));
            }


            if(this._squad.isSBC()){
                let si;
                if(info.task.sbc.stat.hasOwnProperty(this._set.id)){
                    if(this._set.challengesCount == 1){
                        si = info.task.sbc.stat.hasOwnProperty(this._set.id) ? info.task.sbc.stat[this._set.id] : -1;
                    }else{
                        si = info.task.sbc.stat[this._set.id].hasOwnProperty("c") ? info.task.sbc.stat[this._set.id].c[this._challengeId] : -1;
                    }
                }else{
                    si = -1;
                }
                if(si !== -1 && !document.getElementById("sbcPrice")){
                    this._getLeftController().getView().getRootElement().querySelector(".fsu-squad-pBox .fsu-squad-pWrap").after(events.createDF(`<div class="fsu-squad-pWrap"><span class="fsu-squad-pTitle">${fy("sbc.topprice")}</span><span id="sbcPrice" class="fsu-squad-pValue currency-coins">${Number(info.base.platform == "pc" ? si.pc : si.tv).toLocaleString()}</span></div>`))
                }
            }
        }
    }
    call.task = {
        sbcT:UTSBCHubView.prototype.populateTiles,
        sbcC:UTSBCChallengesViewController.prototype.viewDidAppear,
        sbcN:UTSBCHubView.prototype.populateNavigation,
        objN:UTObjectivesHubView.prototype.setupNavigation,
        objG:UTObjectiveCategoryView.prototype.setCategoryGroups,
        home:UTHomeHubView.prototype._generate,
        objSetNum:UTObjectivesHubTileView.prototype.setNumUnclaimedObjectives,
        sbcSetDate:UTSBCSetTileView.prototype.setData,
        subTableRender:UTSBCChallengeTableRowView.prototype.render,
        rewardList:UTSBCGroupRewardListView.prototype.setRewards
    }



    //点击子任务后给包添加价格
    UTSBCGroupRewardListView.prototype.setRewards = function(e, o) {
        call.task.rewardList.call(this,e,o)
        _.map(e,(item,index) =>{
            if(item.isPack){
                let packCoinValue = info.base.packcoin?.[item.value];
                if(packCoinValue){
                    let packBox = events.createElementWithConfig("div", {
                        textContent:`${fy("packcoin.text")}${(packCoinValue * item.count).toLocaleString()}`,
                        classList: ['currency-coins']
                    });
                    this.__rewardList.querySelector(`li:nth-child(${index+1})`).querySelector(".rowContent").appendChild(packBox);
                }
            }
        })
    }

    //给子任务TABLE样式添加ID
    UTSBCChallengeTableRowView.prototype.render = function(e) {
        call.task.subTableRender.call(this,e)
        this._fsuSubSet = e;
    }
    //生成奖励信息时报错处理
    UTSBCSetTileView.prototype.setData = function(e) {
        call.task.sbcSetDate.call(this,e);
        if(_.isArray(e.awards) && !(e.awards.length)){
            this.data.awards = null;
        }
    }


    events.squadCount = (e) => {
        let t = Number(e.__root.getAttribute("data-r"));
        let pa = cntlr.current()._squad.getFieldPlayers().map(i => {if(!i.isBrick() && i.item.rating && !i.item.concept){return i.item.rating}}).filter(Boolean),pr = "";
        if(pa.length > 0){
            pr = "&ratings=" + pa.join(",");
        }
        let dli = [...new Set(events.getItemBy(2,{"NEdatabaseId":cntlr.current()._squad.getFieldPlayers().map(i => i.item.databaseId).filter(Boolean)}).map(i => {return i.rating}))],
        br = t > 84 ? 70 : t < 61 ? 46 : t - 15,
        cs = Array.from({ length: 30 }, (_, i) => i + br).filter(n => !dli.includes(n)),
        l = cs.length ? `&lock=${cs.join(",")}` : "";
        GM_openInTab(`https://futcd.com/sbc.html?target=${t}${pr}${l}`, { active: true, insert: true, setParent :true });
    }
    events.squadConsult = (e) => {
        let i = e.__root.getAttribute("data-id");
        GM_openInTab(`https://www.futbin.com/squad-building-challenges/ALL/${i}/list`, { active: true, insert: true, setParent :true });
    }
    //SBC阵容填充指定评分 需要元素携带data-r(评分)，切换球员填充状态为3
    events.SBCSetRatingPlayers = async(e) => {
        let phone = isPhone();
        //判断当前的选择，如果有遮挡就关闭
        if(phone){
            if(cntlr.current().className == "UTSBCSquadDetailPanelViewController"){
                cntlr.current().getNavigationController()._eBackButtonTapped();
                await events.wait(0.3,0.3);
            }else if(cntlr.current().className == "UTSBCSquadOverviewViewController"){
                gPopupClickShield.onRequestBack();
                await events.wait(0.3,0.3);
            }
        }
        //创建各种参数
        let queryType = e.__root.getAttribute('data-r'),
            currentController = phone ? cntlr.current() : cntlr.left(),
            currentView = currentController.getView(),
            currentSquad = currentController._squad,
            selectSlot = 0,
            pendingPlayers,
            querySort = 3,
            needFind = true;

        
        if(e.getRootElement().tagName == "BUTTON" && e.getRootElement().classList.length < 3){
            needFind = false;
        }
        
        switch(queryType){
            case "d":
                pendingPlayers = repositories.Item.getUnassignedItems().map( i => { if(i.isDuplicate() && !i.isLoaned() && i.isPlayer()){return i.definitionId}});
                break;
            case "t":
                pendingPlayers = events.getItemBy(2,{definitionId:_.uniq(_.map(repositories.Item.getTransferItems(),i => {if(i.getAuctionData().isInactive()){ return i.definitionId}}).filter(Boolean))});
                break;
            case "GOLD":
                pendingPlayers = events.getItemBy(2,{"rs":2});
                break;
            case "conceptsearch":
                querySort = 2;
                break;
            case "eligibilitysearch":
                pendingPlayers = events.getItemBy(2,e.criteria);
                break;
            default:
                let queryObject = {"rating":Number(queryType)};
                if(/GT/.test(queryType)){
                    queryObject = {"GTrating":Number(queryType.replace(/GT$/, ""))}
                }else if(/LT/.test(queryType)){
                    queryObject = {"LTrating":Number(queryType.replace(/LT$/, ""))}
                    querySort = 2;
                }
                pendingPlayers = events.getItemBy(2,queryObject)
                break;
        }
        let resultPlayers = []
        if(queryType !== "conceptsearch"){
            resultPlayers = events.getDedupPlayers(pendingPlayers,currentSquad.getPlayers());
            if(!resultPlayers.length){
                events.notice("notice.noplayer",2)
                return;
            }
        }else{
            resultPlayers = e.criteria;
        }
        
        //点击选中位置
        if(needFind){
            let slotIndex = _.find(currentSquad.getNonBrickSlots(), item => !item.isValid() && !item.isBrick())?.index;
            if(slotIndex){
                selectSlot = slotIndex;
            }else if(!phone && currentView.getSelectedSlot()){
                selectSlot = currentView.getSelectedSlot().getIndex();
            }
            await currentView.selectSlot(selectSlot);
            await currentView.getSelectedSlot()._tapDetected();
        }


        let detailsController = phone ? cntlr.current()._rootController : cntlr.right();
        if(queryType == "d"){
            if(detailsController.panelView._fsuUn._interactionState){
                await detailsController.panelView._fsuUn._tapDetected();
            }else{
                events.notice("notice.noduplicate",2);
            }
        }else{
            events.sbcQuerySetFillAttr(detailsController._parentViewController,queryType == "conceptsearch" ? 9 : 5,resultPlayers,querySort)
            if(detailsController?.panelView){
                await detailsController.panelView._btnAddSwap._tapDetected(this);
            }
        }
    }
    events.sbcQuerySetFillAttr = (element,type,players,sort) => {
        if (type !== false) {
            element._fsuFillType = type;
        }
        element._fsuFillArray = players.length || _.isObject(players) ? players : [];
        element._fsuFillRange =  players.length ? [_.minBy(players, 'rating').rating,_.maxBy(players, 'rating').rating] :  [46,99];
        if (sort !== false) {
            element._fsuFillSort = sort;
        }
    }
    //取出排重后的ID列表
    events.getDedupPlayers = (s,p) => {
        let dp = p.map( i => {
            return i.item.databaseId
        }).filter(Boolean);
        let r = s.map( i => {
            if(typeof i === 'object'){
                if(!dp.includes(i.databaseId)){
                    return i;
                }
            }else{
                if(!dp.includes(i)){
                    return i;
                }
            }
        }).filter(Boolean);
        return r;
    };
    //SBC填充导航题头 加载导航额外信息
    UTSBCHubView.prototype.populateNavigation = function(e, t) {
        call.task.sbcN.call(this, e, t);
        setTimeout(() => {
            if(info.set.info_sbc){
                for (let i = 0; i < e.length; i++) {
                    let data = e[i],tap = this._SBCCategoriesTM.items[i],count = 0,expiry = 0;
                    for (let si of data.setIds) {
                        if(info.task.sbc.stat?.[si]){
                            if (info.task.sbc.stat?.[si].f === "1") {
                                count++;
                            }
                            if(info.task.sbc.stat?.[si].e === "1") {
                                expiry++; 
                            }
                        }
                    }
                    if(count){
                        tap.__root.append(events.createDF(fy(html.taskBar).replace("{Number}",`+${count}`)));
                    }
                    if(data.isFavourite && expiry){
                        tap.__root.append(events.createDF(`<div class="fsu-task-bar-favorite">${expiry}</div>`));
                    }
                }
            }
        },10);
    }

    //SBC填充任务列表 每次切换类型都重新填充 加载任务额外信息
    UTSBCHubView.prototype.populateTiles = function(e, t) {
        call.task.sbcT.call(this, e, t);
        if(info.set.info_sbc){
            let l = this.sbcSetTiles;
            for (let i of l) {
                events.sbcInfoFill(i.data.id,i);
            }
            if(t){
                if(t.isFavourite){
                    let f = t.setIds;
                    let se = 0;
                    for (let si of f) {
                        if(info.task["sbc"].stat.hasOwnProperty(si)){
                            if(info.task["sbc"].stat[si].e == "1") se++;
                        }
                    }
                    let el = this._SBCCategoriesTM.items[1].__root;
                    if(el.querySelector(".fsu-task-bar-favorite")){
                        el.querySelector(".fsu-task-bar-favorite").remove();
                    }
                    if(se > 0){
                        el.append(events.createDF(`<div class="fsu-task-bar-favorite">${se}</div>`));
                    }
                }
            }else{
                events.notice("notice.basesbc",0);
            }
        }

        if(Object.keys(info.task.sbc.stat).length && info.set.info_sbcf && t){
            if(!this.hasOwnProperty("_fsuSbcFilter")){
                this._fsuSbcFilter = new UTDropDownControl();
                let fa = [];
                for (let i = 0; i < 4; i++) {
                    fa.push(new UTDataProviderEntryDTO(i,i,fy(`sbc.filter${i}`)))
                }
                this._fsuSbcFilter.init();
                this._fsuSbcFilter.setOptions(fa);
                this._fsuSbcFilter._parent = this;
                this._fsuSbcFilter.addTarget(this._fsuSbcFilter, (e) => {
                    events.sbcFilter(e);
                    e._parent._fsuSbcFilterId = e.getId();
                }, EventType.CHANGE);
                let b = document.createElement("div");
                b.classList.add("fsu-sbcfilter-box");
                let o = document.createElement("div");
                o.classList.add("fsu-sbcfilter-option");
                let s = document.createElement("div");
                s.innerText = fy(`sbc.filtert`);
                o.appendChild(s);
                o.appendChild(this._fsuSbcFilter.__root);
                b.appendChild(o);
                this._SBCCategoriesTM.__root.after(b);
                this._fsuSbcFilterType = t.id;
                this._fsuSbcFilterId = 0;
            }else{
                if(t.id !== this._fsuSbcFilterType){
                    this._fsuSbcFilterType = t.id;
                    this._fsuSbcFilterId = 0;
                }
                setTimeout(() => {
                    this._fsuSbcFilter.setIndexById(this._fsuSbcFilterId);
                    events.sbcFilter(this._fsuSbcFilter);
                }, 200);
            }
        }
    }
    events.sbcFilter = e => {
        let t = cntlr.current()._view.sbcSetTiles,g = e.getIndex();
        for (let i of t) {
            let y = true,d = i.data.id;
            if(info.task.sbc.stat.hasOwnProperty(d)){
                let s = info.task.sbc.stat[d];
                if(g == 1 && s.f !== "1") y = false;
                if(g == 2 && s.e !== "1") y = false;
                if(g == 3){
                    let n = parseFloat(s.u);
                    if(!isNaN(n)){
                        if(n < 65) y = false;
                    }else{
                        y = false
                    }
                }
            }
            y ? i.show() : i.hide();
        }
    }
    //SBC子任务列表展示 填充额外信息和读取价格
    UTSBCChallengesViewController.prototype.viewDidAppear = function() {
        call.task.sbcC.call(this);
        if(info.set.info_sbcs){
            events.sbcSubPrice(this.sbset.id,this.getView()._challengeRows);

            //子任务添加查看球员按钮
            if(_.isArray(this.sbset.awards)){
                _.map(this.sbset.awards,(item,index) =>{
                    if(item.isItem && item.item.isPlayer()){
                        let btn = events.createButton(
                            new UTStandardButtonControl(),
                            fy("sbc.watchplayer"),
                            (e) => {events.openFutbinPlayerUrl(e);},
                            "mini"
                        )
                        btn.getRootElement().style.marginRight = "2rem";
                        btn.getRootElement().setAttribute("data-id",item.value);
                        btn.getRootElement().setAttribute("data-name",`${item.item.getStaticData().name}`);
                        this.getView()._setInfo._rewards.__rewardList.querySelector(`li:nth-child(${index+1})`).appendChild(btn.getRootElement())
                    }
                })
            }
        }
    }

    //打开futbin球员链接，需要元素携带data-id（球员id）和data-name（球员全称）
    events.openFutbinPlayerUrl = async(e) => {
        events.showLoader();
        let di = e.__root.getAttribute('data-id');
        let n = e.__root.getAttribute('data-name').normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/ø/g, "o");
        let u = `https://www.futbin.org/futbin/api/searchPlayersByName?playername=${n}&year=${info.base.year}`;
        let d = await getFutbin(u);
        let fi = "";
        for (let i of d.data) {
            if(i.resource_id == di){
                fi = i.ID;
                break;
            }
        }
        events.hideLoader();
        GM_openInTab(`https://www.futbin.com/${info.base.year}/player/${fi}/`, { active: true, insert: true, setParent :true });
    };
    //SBC信息填充，需要传递sbcid和需填充的元素
    events.sbcInfoFill = (d,e) => {
        if(!info.task.sbc.stat.hasOwnProperty(d)) return;
        let s = info.task.sbc.stat[d];
        if(s !== undefined){
            if(e.hasOwnProperty("__tileTitle") && s.f == "1"){
                e.getRootElement().style.position = 'relative';
                e.getRootElement().insertBefore(events.createDF(`<div class='fsu-objnew'>${fy("task.new")}</div>`), e.getRootElement().firstChild);
            }
            if(!e.__root.querySelector(".task-expire") && "data" in e && !e.data.isComplete()){
                let expireTime = e.data.endTime - Math.round(new Date() / 1000);
                e.__root.prepend(events.createDF(`${expireTime < 86400 && !e.data.notExpirable ? "<div class='task-expire'>" + fy("task.expire") + "</div>" : ""}`));
            }
        }
        if('data' in e && e.data.repeatabilityMode !== "NON_REPEATABLE"){
            let countBox = events.createElementWithConfig("div",{
                classList: ['ut-squad-building-set-status-label-view','refresh','sbccount']
            })
            let count = e.data.timesCompleted;
            let countText = events.createElementWithConfig("span",{
                classList: ['text'],
                textContent:fy(["sbc.infocount",count]),
                style:{
                    paddingLeft:".5rem"
                }
            })
            if(count == 0){
                countBox.style.opacity = ".5";
            }
            countBox.appendChild(countText);
            let targetElement = e._progressBar.getRootElement()
            targetElement.parentNode.insertBefore(countBox, targetElement.nextSibling);
        }
        if(e._interactionState && !e.__root.querySelector(".fsu-sbc-info")){
            let p = s.type == "7" ? "0" : info.base.platform == "pc" ? s.pc : s.tv;
            e.__root.lastChild.before(events.createDF(fy(html.sbcInfo).replace("{price}",Number(p).toLocaleString()).replace("{up}",s.u).replace("{down}",s.d)))
        }
        if("data" in e && e.data.awards && e.data.awards.length == 1){
            if(e.data.awards[0].isPack){
                let reward = e.data.awards[0];
                let packCoinValue = info.base.packcoin?.[reward.value];
                if(packCoinValue){
                    let packBox = events.createElementWithConfig("div", {
                        style:{
                            position:"absolute",
                            bottom:"0",
                            backgroundColor:"rgb(0 0 0 / 60%)",
                            width:"100%",
                            textAlign:"center",
                            padding:".2rem 0"
                        }
                    });
                    let packTitle = events.createElementWithConfig("div", {
                        textContent:_.replace(_.replace(fy("packcoin.text"),":",""),"：","")
                    });
                    packBox.appendChild(packTitle)
                    let packCoin = events.createElementWithConfig("div", {
                        classList: ['currency-coins'],
                        textContent:(packCoinValue * reward.count).toLocaleString()
                    });
                    packBox.appendChild(packCoin)

                    e.__mainReward.querySelector(".ut-pack-graphic-view").appendChild(packBox);
                }
            }
            
        }
    }
    //字符串转换html对象
    events.createDF = (t) => {
        let f = document.createRange().createContextualFragment(t);
        return f;
    }

    events.sbcSubPrice = async(id,e) => {
        if(info.task.sbc.stat[id]){
            if(!info.task.sbc.stat[id].hasOwnProperty("c")){
                let u = `https://www.futbin.org/futbin/api/getChallengesBySetId?set_id=${id}`;
                let d = await getFutbin(u);
                info.task.sbc.stat[id].c = {};
                for (let i of d.data) {
                    let j = {"tv":i.price.ps,"pc":i.price.pc};
                    info.task.sbc.stat[id].c[i.challengeId] = j;
                }
            }
            if(info.task.sbc.stat[id].hasOwnProperty("c")){
                for (let i of e) {
                    if("_fsuSubSet" in i){
                        let sId = i._fsuSubSet.id,
                        box = events.createElementWithConfig("div",{
                            style:{
                                display:"flex",
                                flexDirection:"row"
                            }
                        }),
                        priceValue = Number(info.base.platform == "pc" ? info.task.sbc.stat[id].c[sId].pc : info.task.sbc.stat[id].c[sId].tv).toLocaleString(),
                        price = events.createElementWithConfig("span",{
                            textContent:`${fy("sbc.price")}${priceValue}`,
                            classList:['currency-coins']
                        });
                        box.appendChild(price);

                        let sAwards = i._fsuSubSet.awards,
                            packCoin = 0;
                        _.map(sAwards,item => {
                            if(item.isPack){
                                let packCoinValue = info.base.packcoin?.[item.value];
                                if(packCoinValue){
                                    packCoin += packCoinValue * item.count;
                                }
                            }
                        })
                        let award = events.createElementWithConfig("span",{
                            textContent:`${fy("subsbcaward.title")}${packCoin ? packCoin.toLocaleString() : fy("subsbcaward.nope")}`,
                            classList:[`${packCoin ? 'currency-coins' : 'no'}`],
                            style:{
                                marginLeft:"2rem",
                            }
                        })
                        box.appendChild(award);

                        if(isPhone()){
                            box.style.flexDirection = "column";
                            award.style.marginLeft = "0";
                        }

                        i.__rowTitle.insertAdjacentElement('afterend',box);
                    }
                }
            }
        }
    }

    call.panel = {
        default:UTDefaultActionPanelView.prototype._generate,
        auction:UTAuctionActionPanelView.prototype._generate,
        slot:UTSlotActionPanelView.prototype._generate,
        transfer:UTTransferActionPanelView.prototype._generate,
        quickRender:UTQuickListPanelViewController.prototype.renderView,
        quick:UTQuickListPanelView.prototype._generate,
        loan:UTDuplicateLoanActionPanelView.prototype._generate,
        sbc:UTSBCSquadDetailPanelView.prototype.render,
        market:UTMarketSearchFiltersView.prototype.setPinnedItem,
        reward:UTRewardSelectionChoiceView.prototype.expandRewardSet
    }
    UTMarketSearchFiltersView.prototype.setPinnedItem = function(e, t) {
        call.panel.market.call(this,e,t)
        let sbc = isPhone() ? cntlr.current()._squadContext.squad.isSBC() : cntlr.current()._squad.isSBC();
        if(e.definitionId && sbc && info.set.sbc_market && e.concept){
            let p = events.getCachePrice(e.definitionId,1),v = this._maxBuyNowPriceRow._currencyInput,f = this._searchFilters.filters;
            if(f[1].setId == "rarity" && f[1].getValue() == -1){
                f[1].setIndexByValue(e.rareflag);
            }
            if(f[2].setId == "position" && f[2].getIndex() !== 0){
                f[2].setIndex(0)
            }
            if(v.getValue() == 0){
                if(pdb.hasOwnProperty(e.definitionId)){
                    v.setValue(pdb[e.definitionId]);
                    if(!isPhone()){
                        events.notice("notice.marketsetmax",1);
                    }
                }else if(p !== 0){
                    v.setValue(p);
                    if(!isPhone()){
                        events.notice("notice.marketsetmax",1);
                    }
                }
            }
        }
    }
    UTQuickListPanelViewController.prototype.renderView = function () {
        call.panel.quickRender.call(this);
        events.detailsButtonSet(this)
    };

    UTRewardSelectionChoiceView.prototype.expandRewardSet = function(e,t) {
        call.panel.reward.call(this,e,t);
        let reward = t.rewards.find(i => i.count),tn = this._rewardsCarousel._tnsCarousel.__root;
        if(reward.isItem && reward.item.isPlayer() && info.set.player_futbin && tn.classList.length === 2 && tn.classList.contains("slider") && tn.classList.contains("rewards-slider-container")){
            let player = reward.item;
            this._fsuPlayer = events.createButton(
                new UTStandardButtonControl(),
                fy("quicklist.gotofutbin"),
                (e) => {events.openFutbinPlayerUrl(e);},
                "call-to-action mini fsu-reward-but"
            )
            if(!isPhone()){
                this._fsuPlayer.__root.classList.add("pcr")
            }
            this._fsuPlayer.__root.setAttribute("data-id",player.definitionId);
            this._fsuPlayer.__root.setAttribute("data-name",player._staticData.name);
            tn.querySelector(".reward").appendChild(this._fsuPlayer.__root);
        }
    }
    UTQuickListPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.quick.call(this, ...args);
            events.detailsButtonQuick(this)
        }
    };
    UTDefaultActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.default.call(this, ...args);
            events.detailsButtonAction(this)
        }
    };

    UTDuplicateLoanActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.loan.call(this, ...args);
            events.detailsButtonAction(this)
        }
    }
    UTAuctionActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.auction.call(this, ...args);
            events.detailsButtonAction(this)
        }
    };
    UTSlotActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.slot.call(this, ...args);
            events.detailsButtonAction(this)
        }
    };
    UTTransferActionPanelView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.panel.transfer.call(this, ...args);
            events.detailsButtonAction(this)
        }
    };
    events.conceptBuyBack = (w) =>{
        let a = w.panelView || w._panel;
        a._sendClubButton._tapDetected(this);
        if(isPhone()){
            let p = w._parentViewController,cv,cn;
            for (let [n,v] of p._childViewControllers.entries()) {
                if(v.className == "UTSBCSquadOverviewViewController"){
                    cv = v;
                    cn = n;
                }
            }
            p.popToViewController(cv,cn)
        }else{
            cntlr.current()._ePitchTapped()
        }
    }
    events.detailsButtonSet = (e) => {
        if(!isPhone() && !cntlr.current()._rightController) return;
        let w = isPhone() ? cntlr.current() : cntlr.right();
        if(w.hasOwnProperty("_rootController")) w = w._rootController;
        let a = w.panelView || w._panel;
        if(!a){
            return;
        }
        if(e.item.isPlayer()){
            let pid = e.item.definitionId || 0;
            //假想球员购买按钮
            if(pid && e.item.concept && "_fsuConceptBuy" in a && events.getCachePrice(pid) && info.set.sbc_conceptbuy){
                a._fsuConceptBuy.player = e.item;
                a._fsuConceptBuy.setSubtext(events.getCachePrice(pid,1));
                a._fsuConceptBuy.displayCurrencyIcon(!0);
                a._fsuConceptBuy.setInteractionState(!0);
                a._fsuConceptBuy.show();
            }
            //假想球员购买直接发送到俱乐部并返回阵容
            if(a.hasOwnProperty("_sendClubButton") && w._squadContext && a._sendClubButton.isInteractionEnabled() && e.item.definitionId == w._squadContext.squad.getPlayer(w._squadContext.slotIndex).item.definitionId && w._squadContext.squad.getPlayer(w._squadContext.slotIndex).item.concept && info.set.sbc_cback){
                events.conceptBuyBack(w);
                return;
            }
            if(pid && a.hasOwnProperty("_fsuPlayer")){
                a._fsuPlayer.__root.setAttribute("data-id",pid);
                a._fsuPlayer.__root.setAttribute("data-name",`${e.item._staticData.name}`);
                a._fsuPlayer.setDisplay(1);
                if(!info.set.player_futbin){
                    a._fsuPlayer.hide();
                }
            }
            if(pid && a.hasOwnProperty("_fsuGP")){
                a._fsuGP.__root.setAttribute("data-id",pid);
                if(pdb.hasOwnProperty(pid)){
                    a._fsuGP.setText(fy("quicklist.getpricey"));
                    a._fsuGP.setSubtext(pdb[pid]);
                    a._fsuGP.displayCurrencyIcon(!0);
                }
            }
            e._view._fsuAuction.__subtext.setAttribute('data-id',pid);
            e._view._fsuAuction.__subtext.setAttribute('data-i',e.item.id || 0);
            if(events.getCachePrice(pid)){
                let lp = info.roster.data[pid].prices[info.base.platform].LCPrice;
                if(lp && lp !== "0"){
                    e._view._fsuAuction.setSubtext(lp);
                    e._view._fsuAuction.setInteractionState(1);
                    if(a.hasOwnProperty("_fsuGP")){
                        a._fsuGP.__root.setAttribute("data-p",lp);
                        a._fsuGP.show();
                    }
                }else{
                    e._view._fsuAuction.setSubtext(lp);
                    e._view._fsuAuction.setInteractionState(0);
                }
            }
            if(!info.set.player_auction){
                e._view._fsuAuction.hide();
            }
            if(a.hasOwnProperty("_fsuRat") && e.item.rating > 0){
                a._fsuRat.__root.setAttribute("data-r",e.item.rating);
                a._fsuRat.setInteractionState(1);
                a._fsuRat.show();
            }
        }else{
            e._view._fsuAuction.setDisplay(!1);
        }
        if(!info.set.player_getprice || services.User.getUser().tradeAccess !== TradeAccessLevel.ALLOWED){
            a._fsuGP.hide();
        }
        if(a.hasOwnProperty("_fsuSwap") && a.hasOwnProperty("_fsuUn")){
            if(e.item.id){
                a._fsuSwap.__text.innerText = fy("sbc.swapquick");
                a._fsuUn.__text.innerText = fy("sbc.swapduplicate");
                a._fsuChem.__text.innerText = fy("sbc.swapchem");
            }else{
                a._fsuSwap.__text.innerText = fy("sbc.addquick");
                a._fsuUn.__text.innerText = fy("sbc.addduplicate");
                a._fsuChem.__text.innerText = fy("sbc.addchem");
            }
            if(Object.keys(info.criteria).length){
                a._fsuSwap.setInteractionState(1);
            }


            let ul = cntlr.current()._squad._players.map(function (i) {if(i.item.definitionId > 0){return i.item.definitionId}}).filter(Boolean);
            let rul = services.Item.itemDao.itemRepo.getUnassignedItems().map(i => {
                if (i.isDuplicate() && !i.isLoaned() && i.isPlayer()) {
                    if(ul.length){
                        if(ul.indexOf(i.definitionId) == -1){
                            return i.definitionId
                        }
                    }else{
                        return i.definitionId
                    }
                }
            }).filter(Boolean);
            if(rul.length){
                a._fsuUn.setInteractionState(1);
            }else{
                a._fsuUn.__text.innerText = fy("sbc.notduplicate")
            }
            if(!info.set.sbc_quick){
                a._fsuSwap.hide();
            }
            if(!info.set.sbc_duplicate){
                a._fsuUn.hide();
            }

            //SBC状态置为0
            if(w.hasOwnProperty("_parentViewController") && w._parentViewController){
                events.sbcQuerySetFillAttr(w._parentViewController,0,false,3)
            }
            
            //默契球员按钮判断
            if(w.hasOwnProperty("_challenge") && w._viewmodel.getIndex() < 11 && w._squad.getFieldPlayers().filter(i => i.getItem().rating > 0).length){
                let c = 0,r = 0,q = 0;
                for (let se of w._challenge.eligibilityRequirements) {
                    if(se.getFirstKey() === 35){
                        c = se.getFirstValue(35)
                    }
                    if(se.getFirstKey() === 19){
                        r = se.getFirstValue(19)
                    }
                    if(se.getFirstKey() === 3){
                        q = `${se.scope == 0 ? ">=" : se.scope == 1 ? "<=" : "="}${se.getFirstValue(3)}`
                        
                    }
                }
                if(c){
                    a._fsuChem.show();
                    a._fsuChem.__root.setAttribute("data-c",c);
                    a._fsuChem.__root.setAttribute("data-r",r);
                    a._fsuChem.__root.setAttribute("data-q",q);
                    a._fsuChem._parent = w;
                }
            }
            if(w.hasOwnProperty("_challenge") && w._challenge.meetsRequirements() && info.set.sbc_meetsreq && w._viewmodel.getIndex() < 11){
                a._fsuMeets.show();
                a._fsuMeets._parent = w;
            }
        }

        //插入假想球员搜索按钮
        if(!("_fsuConceptSearch" in a) && "_squad" in w && w._squad.isSBC() && e.item.isPlayer() && e.item.concept){
            let btnBox = events.createElementWithConfig("div",{
                classList:["ut-button-group"]
            })
            a._fsuConceptSearch = [];
            let btnSetting = {club:[`teamId:club`,`leagueId:league`],league:[`leagueId:league`,`nationId:nation`]};
            _.map(btnSetting,function(value, key) {
                let btn = events.createButton(
                    new UTGroupButtonControl(),
                    fy(`searchconcept.same${key}`),
                    async(e) => {
                        events.SBCSetRatingPlayers(e);
                    },
                    ""
                )
                btn.getRootElement().setAttribute("data-r","conceptsearch");
                btn.criteria = {}
                _.map(value,attrKey => {
                    let cKey = attrKey.split(":");
                    btn.criteria[cKey[1]] = e.item[cKey[0]];
                })
                a._fsuConceptSearch.push(btn);
                btnBox.appendChild(btn.getRootElement());
            });
            a._fsuConceptSearchBox = btnBox;
            a._fsuButtons.insertAdjacentElement('afterend', btnBox);
        }

        //插入挑战需求购买按钮
        if(!("_fsuRequests" in a) && "_squad" in w && w._squad.isSBC() && "_fsuRequests" in w._squad && e.item.isPlayer()){
            let btnBox = events.createElementWithConfig("div",{
                classList:["ut-button-group"]
            })
            a._fsuRequests = [];
            _.map(w._squad._fsuRequests,(i) => {
                let btn = events.createButton(
                    new UTGroupButtonControl(),
                    fy([`requirements.${e.item.id ? "swap" : "add"}btn`,i.name]),
                    async(e) => {
                        events.SBCSetRatingPlayers(e);
                    },
                    ""
                )
                btn.criteria = i.criteria;
                btn.getRootElement().setAttribute("data-r","eligibilitysearch");
                btn.setSubtext(`${w._challenge.getRequirementCounter(i.value)}/${i.value.count}`);
                a._fsuRequests.push(btn);
                btnBox.appendChild(btn.getRootElement());
            })
            a._fsuRequestsBox = btnBox;
            a._fsuButtons.insertAdjacentElement('afterend', btnBox);
        }
    }
    
    events.requirementsToText = (e) => {
        let L10n = services.Localization;
        let text = ``;
        let rKey = e.getFirstKey();
        let rIds = e.getValue(rKey);
        function combine(t) {
            return _.map(t, function(value, index, array) {
                return index < array.length - 1 ? value + " " + _.toUpper(L10n.localize("label.general.or")) : value;
            }).join(" ");
        }
        switch(rKey){
            case SBCEligibilityKey.CLUB_ID:
                text = combine(_.uniq(_.map(rIds, (value) => {
                    return UTLocalizationUtil.teamIdToAbbr15(value, L10n)
                })))
                break;
            case SBCEligibilityKey.LEAGUE_ID:
                text = combine(_.map(rIds, (value) => {
                    return UTLocalizationUtil.leagueIdToName(value, L10n)
                }))
                break;
            case SBCEligibilityKey.NATION_ID:
                text = combine(_.map(rIds, (value) => {
                    return UTLocalizationUtil.nationIdToName(value, L10n)
                }))
                break;
            case SBCEligibilityKey.PLAYER_RARITY:
                text = combine(_.map(rIds, (value) => {
                    return L10n.localize(`item.raretype${value}`)
                }))
                break;
            default:
                text = e.getValue(e.getFirstKey()).join();
        }
        return text;
    }
    events.detailsButtonQuick = (e) => {
        let pa = events.createButton(
            new UTGroupButtonControl(),
            fy("quicklist.auction"),
            (e) => {
                events.showLoader();
                let p = Number(e.__subtext.innerText.replace(/,/g, '')),i = Number(e.__subtext.getAttribute("data-i"));
                events.playerToAuction(i,p);
                events.hideLoader();
            },
            "accordian fsuBuy"
        )
        pa.setSubtext(0);
        pa.displayCurrencyIcon(!0);
        pa.setInteractionState(!1);
        e._fsuAuction = pa;
        e._btnToggle.__root.after(e._fsuAuction.__root);
    }
    //添加fut默认按钮
    events.createButton = (s,t,b,c) => {
        const btn = s;
        btn.init();
        btn.addTarget(btn, b.bind(btn), EventType.TAP);
        btn.setText(t);
        if(c){
            const cl = c.split(" ").filter(Boolean);
            for (let ci of cl) btn.getRootElement().classList.add(ci);
        }
        return btn;
    }

    //添加fut滑动切换选项
    events.createToggle = (t,b) => {
        const te = new UTToggleCellView;
        te.init();
        te.addTarget(te, b.bind(te), EventType.TAP);
        te.setLabel(t);
        return te;
    }
    //添加futHome块
    events.createTile = (a,b,c) => {
        const t = new UTGraphicalInfoTileView;
        t.__root.classList.add("col-1-3");
        t.loadContentView();
        t.__tileContent.querySelector(".image").remove()
        t.init();
        t.addTarget(t, c.bind(t), EventType.TAP);
        t.setTitle(a);
        t.setDescription(b);
        return t;
    }

    events.detailsButtonAction = (e) =>{
        let fb = events.createButton(
            new UTGroupButtonControl(),
            fy("quicklist.gotofutbin"),
            (e) => {events.openFutbinPlayerUrl(e);},
            "more"
        )
        fb.setDisplay(!1)
        e._fsuPlayer = fb;
        let pb = e._playerBioButton || e._btnPlayerBio;
        pb.__root.after(e._fsuPlayer.__root);
        let fg = events.createButton(
            new UTGroupButtonControl(),
            fy("quicklist.getprice"),
            (e) => {events.getAuction(e);},
            "accordian fsuGP"
        )
        fg.hide();
        e._fsuGP = fg;
        let pg = e._btnDiscard || e._findRelatedButton || e._btnSearchMarket || e._discardButton;
        if(pg){
            pg.__root.after(e._fsuGP.__root);
        }
        if(e.hasOwnProperty("_btnAddSwap") && cntlr.current()._squad.isSBC()){
            let fbg = document.createElement("div");
            fbg.classList.add("ut-button-group");

            e._fsuConceptBuy = events.createButton(
                new UTGroupButtonControl(),
                fy("conceptbuy.btntext"),
                async(e) => {
                    events.buyPlayer(e.player,e._parent);
                },
                ""
            )
            e._fsuConceptBuy._parent = e;
            e._fsuConceptBuy.setInteractionState(!1);
            e._fsuConceptBuy.hide();
            fbg.appendChild(e._fsuConceptBuy.__root);


            let fq = events.createButton(
                new UTGroupButtonControl(),
                "quickSwap",
                async() => {
                    let b = isPhone() ? cntlr.current()._rootController : cntlr.right();
                    events.sbcQuerySetFillAttr(b._parentViewController,1,[],3)
                    b.panelView._btnAddSwap._tapDetected(this);
                    console.log("快捷添加状态变为",1)
                },
                ""
            )
            fq.setInteractionState(!1);
            e._fsuSwap = fq;
            fbg.appendChild(e._fsuSwap.__root);

            let fu = events.createButton(
                new UTGroupButtonControl(),
                "unassigned",
                async() => {
                    let b = isPhone() ? cntlr.current()._rootController : cntlr.right();
                    let p = events.getDedupPlayers(events.getItemBy(2,{"definitionId":services.Item.itemDao.itemRepo.getUnassignedItems().map( i => { if(i.isDuplicate() && !i.isLoaned() && i.isPlayer()){return i.definitionId}})}),b.squad.getPlayers());
                    if(p.length){
                        events.sbcQuerySetFillAttr(b._parentViewController,3,p,3)
                        b.panelView._btnAddSwap._tapDetected(this);
                    }else{
                        events.notice("notice.noplayer",2);
                    }
                },
                ""
            )
            fu.setInteractionState(!1);
            e._fsuUn = fu;
            fbg.appendChild(e._fsuUn.__root);

            let fr = events.createButton(
                new UTGroupButtonControl(),
                fy("sbc.swaprating"),
                (e) => {events.SBCSetRatingPlayers(e);},
                ""
            )
            fr.setInteractionState(!1);
            fr.hide();
            e._fsuRat = fr;
            fbg.appendChild(e._fsuRat.__root);

            let fcm = events.createButton(
                new UTGroupButtonControl(),
                fy("sbc.swapchem"),
                (e) => {events.SBCSetChemPlayers(e);},
                ""
            )
            fcm.hide();
            e._fsuChem = fcm;
            fbg.appendChild(e._fsuChem.__root);
            


            let fcmr = events.createButton(
                new UTGroupButtonControl(),
                fy("meetsreq.btntext"),
                (e) => {events.SBCSetMeetsPlayers(e);},
                ""
            )
            fcmr.hide();
            e._fsuMeets = fcmr;
            fbg.appendChild(e._fsuMeets.__root);


            e._fsuButtons = fbg;
            e.__itemActions.before(e._fsuButtons)
            

            
        }
    }
    //满足条件球员读取程序
    events.SBCSetMeetsPlayers = async(e) => {
        let newChallenge = events.createVirtualChallenge(e._parent._challenge);
        let defList = e._parent._challenge.squad.getPlayers().map(i => {return i.getItem().definitionId}).filter(Boolean);
        let search = {"NEdatabaseId":defList};
        let shortlist = events.getItemBy(2,search);
        let playerIndex = e._parent._viewmodel.current().getIndex();
        let currentList = newChallenge.squad.getPlayers().map(i => {return i.getItem()});
        let resultList = [];
        for (let player of shortlist) {
            currentList[playerIndex] = player;
            newChallenge.squad.setPlayers(currentList);
            if(newChallenge.meetsRequirements()){
                resultList.push(player)
            }
        }
        if(resultList.length > 0){
            let b = isPhone() ? cntlr.current()._rootController : cntlr.right();
            events.sbcQuerySetFillAttr(b._parentViewController,7,resultList,3)
            await b.panelView._btnAddSwap._tapDetected(this);
        }else{
            events.notice("meetsreq.error",2);
        }
    }
    //默契球员读取程序
    events.SBCSetChemPlayers = async(e) => {
        let needChem = Number(e.__root.getAttribute('data-c'));
        let needRating = Number(e.__root.getAttribute('data-r'));
        let needQuality = e.__root.getAttribute('data-q');
        let needPos = e._parent._viewmodel.current().generalPosition;
        let playerIndex = e._parent._viewmodel.current().getIndex();
        let isPlayer = e._parent._viewmodel.current().isValid();
        let playerChem = e._parent._viewmodel.current().chemistry;
        let currentList = e._parent._squad.getFieldPlayers().map(i => {return i.item});
        let defList = e._parent._viewmodel.values().map(i => {return i.item.definitionId});
        let search = {"NEdatabaseId":defList,"bepos":needPos};
        let currentChem = e._parent._squad.getChemistry();
        // if(needRating){
        //     search.BTWrating = [needRating-5,needRating+5]
        // }
        if(needQuality != "0"){
            search.quality = needQuality
        }
        let shortlist = events.getItemBy(2,search);
        let squad = e._parent._squad;
        let formation = squad.getFormation();
        let manager = squad.getManager().item;
        let resultList = [];
        for (let player of shortlist) {
            currentList[playerIndex] = player;
            let chemResult = squad.chemCalculator.calculate(formation, currentList, manager);
            let countChem = chemResult.chemistry;
            let changePlayerChem = chemResult.getSlotChemistry(playerIndex).value();
            let playerChemAdjust = playerChem == 3 ? 2 : playerChem;
            let playerChemNeed = isPlayer ? changePlayerChem >= playerChemAdjust : changePlayerChem > playerChemAdjust;
            if(countChem >= needChem || (countChem >= currentChem && playerChemNeed)){
                resultList.push(player);
            }
        }
        if(resultList.length > 0){
            let b = isPhone() ? cntlr.current()._rootController : cntlr.right();
            events.sbcQuerySetFillAttr(b._parentViewController,7,resultList,3)
            await b.panelView._btnAddSwap._tapDetected(this);
        }else{
            events.notice("notice.notchemplayer",2);
        }
    }
    events.playerQuickAuction = async(e) => {
        let p = Number(e.__subtext.innerText.replace(/,/g, ''));
        if(!p) return;
        let w = isPhone() ? cntlr.current() : cntlr.right();
        await w._quickListPanel._view._bidNumericStepper.setValue(p);
        await w._quickListPanel._view._buyNowNumericStepper.setValue(p);
        await w._quickListPanel._view._listButton._tapDetected(this);
        events.notice("notice.quickauction",1);
    }

    UTObjectivesHubView.prototype.setupNavigation = function(e) {
        call.task.objN.call(this,e)
        let t = this._objectivesTM.items;
        if(!info.task.obj || !Object.keys(info.task.obj.stat).length){return}
        for (let i of t) {
            if(info.task.obj.stat.new.hasOwnProperty(i.id)){
                if(!info.set.info_obj) return;
                i.__root.append(events.createDF(fy(html.taskBar).replace("{Number}",`+${info.task.obj.stat.new[i.id]}`)))
            }
        }
    }

    UTObjectiveCategoryView.prototype.setCategoryGroups = function(i, e, o, n) {
        call.task.objG.call(this ,i, e, o, n)
        let g = this.groups;
        for (let i of g) {
            if(!info.task.obj || !Object.keys(info.task.obj.stat).length){return}
            if(info.task.obj.stat[i.id].f){
                i.getRootElement().insertBefore(events.createDF(`<div class="fsu-objnew">${fy("task.new")}</div>`), i.getRootElement().firstChild);
            }
            if(info.task.obj.stat[i.id].e){
                i.__title.parentNode.after(events.createDF(`<div class="task-expire">${fy("task.expire")}</div>`))
            }
            let item = e.find(z => z.compositeId == i.id)
            if(item && item.rewards.rewards.length && item.rewards.rewards.length == 1){
                let reward = item.rewards.rewards[0];
                let rewardText =  UTLocalizationUtil.buildRewardString(reward,services.Localization);
                if(reward.isXP || reward.isCoin){
                    rewardText = `${reward.value} ${rewardText}`;
                }
                let rewardHtml = events.createElementWithConfig("div", {
                    style: {
                        marginLeft:".5rem",
                        fontSize:"12px"
                    }
                });
                let rewardTextHtml = events.createElementWithConfig("div", {
                    textContent: rewardText,
                });
                rewardHtml.appendChild(rewardTextHtml)
                if(reward.isPack){
                    let packCoinValue = info.base.packcoin?.[reward.value];
                    if(packCoinValue){
                        let packCoin = events.createElementWithConfig("span", {
                            classList: ['currency-coins'],
                            textContent: `${fy("packcoin.text")}${(packCoinValue *  reward.count).toLocaleString()}`,
                        });
                        rewardHtml.appendChild(packCoin)
                    }
                }
                i.__rewards.querySelector("li").appendChild(rewardHtml)
            }
        }
    }
    UTHomeHubView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.task.home.call(this, ...args);
            GM_addStyle(info.base.sytle);
            let locale = services.Messages.messagesDAO.authDelegate.sessionUtas.locale;
            if(locale.language == "zh"){
                info.language = locale.variant == "Hans" ? 0 : 1;
            }
            console.log(fy("tile.settitle"))
            this._fsuSet = events.createTile(
                fy("tile.settitle"),
                fy("tile.settext"),
                (e) => {
                    var n = cntlr.current().getNavigationController();
                    if(n){
                        var t = new fsuSC();
                        n.pushViewController(t);
                    }
                }
            )
            this._sbcTile.__root.after(this._fsuSet.__root);
            this._fsuInfo = events.createTile(
                fy("tile.infotitle"),
                fy("tile.infotext"),
                (e) => {
                    GM_openInTab(`https://mfrasi851i.feishu.cn/wiki/wikcng1Ih7fFRidBfMdNS9SrucR`, { active: true, insert: true, setParent :true });
                }
            )
            this._fsuSet.__root.after(this._fsuInfo.__root);
            this._fsuGP = events.createTile(
                fy("tile.gptitle"),
                fy("tile.gptext"),
                (e) => {
                    events.reloadPlayers(e._parent);
                }
            )
            this._fsuGP._parent = this;
            this._fsuInfo.__root.after(this._fsuGP.__root);

            events.init();
        }
    };
    events.reloadPlayers = async(e) =>{
        await services.Club.getStats().observe(cntlr.current(),async function _onGetStats(e, t) {
            e.unobserve(e);
            t.success ? t.response.stats.forEach(async function(e) {
                if(e.type == 'players'){
                    if(e.count !== services.Club.clubDao.clubRepo.items.length){
                        events.showLoader();
                        let playersCount = isPhone() ? 200 : 200;
                        let playersPage = Math.ceil(e.count / playersCount);
                        for (let i = 0; i < playersPage; i++) {
                            let playersCriteria = new UTSearchCriteriaDTO();
                            playersCriteria.type = "player";
                            playersCriteria.sortBy = "ovr";
                            playersCriteria.sort = "desc";
                            playersCriteria.count = playersCount;
                            playersCriteria.offset = i * playersCount;
                            events.changeLoadingText(["loadingclose.ldata",`${i}`,`${playersPage}`]);
                            try {
                                const searchResult = await new Promise((resolve, reject) => {
                                    services.Club.search(playersCriteria).observe(e, (p, t) => {
                                        if (p.unobserve(p), t.success && JSUtils.isObject(t.response)) {
                                            resolve(t.response);
                                        } else {
                                            reject(new Error("Search operation failed"));
                                        }
                                    });
                                });
                                await events.wait(0.2,0.5)
                            } catch (error) {
                                console.error("Search error:", error);
                                services.Notification.queue([services.Localization.localize("notification.club.failedToLoad"), UINotificationType.NEGATIVE]);
                                const navController = e.getNavigationController();
                                if (navController) {
                                    navController.popViewController(true);
                                }
                            }
                        }
                        events.hideLoader();
                        info.base.state = true;
                        events.notice("notice.ldatasuccess",0);
                        if(cntlr.current().className == "UTHomeHubViewController" && info.task.obj.html && !cntlr.current()._view._objectivesTile.__root.querySelector(".fsu-task") && cntlr.current()._view._objectivesTile.__tileContent.querySelector(".ut-tile-view--subtitle")){
                            cntlr.current()._view._objectivesTile.__tileContent.before(
                                events.createDF(`<div class="fsu-task">${info.task.obj.html}</div>`)
                            )
                        }
                        if(cntlr.current().className == "UTHomeHubViewController" && info.task.sbc.html && !cntlr.current()._view._sbcTile.__root.querySelector(".fsu-task") && cntlr.current()._view._sbcTile.__tileContent.querySelector(".ut-tile-content-graphic-info")){
                            cntlr.current()._view._sbcTile.__tileContent.before(
                                events.createDF(`<div class="fsu-task">${info.task.sbc.html}</div>`)
                            )
                        }
                    }
                }
            }) : NetworkErrorManager.checkCriticalStatus(response.status) && NetworkErrorManager.handleStatus(response.status) && events.hideLoader() && events.notice("notice.ldataerror",2);
        }); 
    }
    UTHomeHubView.prototype.getObjectivesTile = function() {
        if(info.task.obj.html && !this._objectivesTile.__root.querySelector(".fsu-task") && info.set.info_obj){
            this._objectivesTile.__tileContent.before(
                events.createDF(`<div class="fsu-task">${info.task.obj.html}</div>`)
            )
        }
        return this._objectivesTile
    }
    
    //首页目标区域数字更新
    UTObjectivesHubTileView.prototype.setNumUnclaimedObjectives = function(e) {
        call.task.objSetNum.call(this,e);
        let currentNumber = this.getContentView().__unclaimedRewardsBubble.textContent == "" ? 0 : Number(this.getContentView().__unclaimedRewardsBubble.textContent);
        let rewardsNumber = services.Objectives.objectivesRepository.getActiveCampaign().remainingRewards ? services.Objectives.objectivesRepository.getActiveCampaign().remainingRewards : 0;
        let categories = info.task.obj.source;
        if(services.Objectives.objectivesRepository.getCategories().length){
            categories = services.Objectives.objectivesRepository.getCategories();
            info.task.obj.source = categories;
        }
        for (const i of categories) {
            rewardsNumber += i.countNumberOfUnclaimedRewards();
        }
        if(rewardsNumber && rewardsNumber !== currentNumber){
            this.setNumUnclaimedObjectives(rewardsNumber);
        }
    }


    UTHomeHubView.prototype.getSBCTile = function() {
        if(info.set.info_sbc && info.task.sbc.html && !this._sbcTile.__root.querySelector(".fsu-task")){
            this._sbcTile.__tileContent.before(
                events.createDF(`<div class="fsu-task">${info.task.sbc.html}</div>`)
            )
        }
        return this._sbcTile
    }
    call.search = {
        club:{
            viewDid:UTClubSearchFiltersViewController.prototype.viewDidAppear,
            modeChange:UTClubSearchFiltersViewController.prototype.onSearchModeChanged,
            setChemDiff:UTClubSearchResultsView.prototype.setItemsWithChemDiff
        },
        filters:UTItemSearchView.prototype.setFilters ,
        result:UTPaginatedItemListView.prototype.setPaginationState,
        dropdownOpen:UTDropDownControl.prototype.open,
        request:UTClubSearchResultsViewController.prototype._requestItems
    };
    UTClubSearchFiltersViewController.prototype.viewDidAppear = function() {
        call.search.club.viewDid.call(this)
        if(this.squad.isActive() || this.squad.isDream()){
            if(!("_fsuSortInit" in this.getView())){
                this.getView()._sortDropDown.setIndexById(2);
                this.getView()._fsuSortInit = true;
            }
        }
        if("_fsuFillType" in this._parentViewController){
            if(this.squad.isSBC() || this.squad.isActive() || this.squad.isDream()){
                events.searchFill(this);
            }
        }
    }

    //改变为假想球员后禁止评分部分调整
    UTClubSearchFiltersViewController.prototype.onSearchModeChanged = function(t,e) {
        call.search.club.modeChange.call(this,t,e);
        if(this.squad.isSBC){
            let state = (e == 'club'),
            view = this.getView();
            if("_fsuRatBox" in view){
                view._fsuRatBox.querySelector("h4").textContent = fy(state ? "sbcrange.title" : "sbcrange.concepttitle");
                view._fsuRatHigh.setInteractionState(state);
                view._fsuRatLow.setInteractionState(state);
                view._fsuRatClear.setInteractionState(state);
                if(!state){
                    view._fsuRatLow._decrementBtn.setInteractionState(state);
                    view._fsuRatLow._incrementBtn
                    .setInteractionState(state);
                    view._fsuRatHigh._decrementBtn.setInteractionState(state);
                    view._fsuRatHigh._incrementBtn
                    .setInteractionState(state);
                }
            }
        }
    }

    //列表化学差异处给在俱乐部的球员上tag
    UTClubSearchResultsView.prototype.setItemsWithChemDiff = function(t,a,s,l,c) {
        call.search.club.setChemDiff.call(this,t,a,s,l,c);
        _.map(t,(player,index) => {
            if(player.concept && !(this.activeSquad.containsItem(player,!0)) && events.getItemBy(1,{definitionId:player.definitionId}).length){
                console.log(player)
                let tag = new UTListActiveTagView;
                tag.setIconClass("club");
                tag.getRootElement().querySelector(".label-container").classList.add("fsu-inclubtag");
                this._list.getRows()[index].__rowContent.appendChild(tag.getRootElement())
                this._list.getRows()[index].addClass("is-active");
            }
        })
    }

    UTItemSearchView.prototype.setFilters = function(e, t) {
        call.search.filters.call(this,e, t)
        if(e.searchCriteria.type == "player" && !isPhone()){
            events.searchInput(this)
        }
        //选项球员数量统计
        if(e.searchCriteria.type == "player" && e.searchFeature == "club" && info.set.sbc_icount){
            let sn = ["nation","league","club","level","rarity","position"];
            for (let i of sn) {
                this.searchFilters.get(i)._inputFill = this.searchFilters;
                if(isPhone() && !cntlr.current()._fsuFillType%2){
                    events.clubSearchSetCount(this.searchFilters.get(i));
                }
            }
        }
    }
    events.clubSearchSetCount = (e) => {
        if(e.hasOwnProperty("_inputFill")){
            let k = {"nation":"nationId","league":"leagueId","club":"teamId","level":"levelId","rarity":"rareflag","position":"bepos"},
            c = k[e.setId],
            s = {"loans":-1};
            let view = isPhone() ? cntlr.current() : cntlr.right();
            for (let i in k) {
                if(i !== e.setId && e._inputFill.get(i).id !== -1){
                    s[k[i]] = e._inputFill.get(i).id;
                }
            }
            let otherData = false
            if(view && view.className !== "UTSquadBuilderViewController"){
                if(view?.squad?.isSBC() || view?._squad?.isSBC()){
                    let fsuRatView = "_fsuRatLow" in view ? view : "_fsuRatLow" in view.getView() ? view.getView() : "_fsuRatLow" in view.getParentViewController() ? view.getParentViewController() : null;
                    if(fsuRatView){
                        if("_fsuRatLow" in fsuRatView && "_fsuRatHigh" in fsuRatView){
                            s["BTWrating"] = [fsuRatView._fsuRatLow.getValue(),fsuRatView._fsuRatHigh.getValue()]
                        }
                    }
                    let fsuFillView = "_fsuFillArray" in view ? view : "_fsuFillArray" in view.getView() ? view.getView() : "_fsuFillArray" in view.getParentViewController() ? view.getParentViewController() : null;
                    if(fsuFillView){
                        if(fsuFillView._fsuFillType >= 3){
                            otherData = fsuFillView._fsuFillArray;
                        }
                    }
                }
            }
            let r = events.getItemBy(2,s,false,otherData).map(i => {
                if(c == "levelId"){
                    if(i.isSpecial()){
                        return 3;
                    }else{
                        if(i.isBronzeRating()){
                            return 0;
                        }else if(i.isSilverRating()){
                            return 1;
                        }else{
                            return 2;
                        }
                    }
                }else{
                    return i[c]
                }
            }),
            cm = new Map(),
            ca = [];
            for (let i of r) {
                cm.set(i, (cm.get(i) || 0) + 1); 
            }
            let l = isPhone() ? e.__picker.querySelectorAll("option") : e.__list.querySelectorAll("li");
            for (let [i, v] of l.entries()) {
                let id = e.options[i].id,ct = cm.get(id);
                if(ct){
                    if(isPhone()){
                        v.append(events.createDF(`(${ct})`));
                    }else{
                        v.style.position = "relative";
                        v.append(events.createDF(`<span class="fsu-fcount">${ct}</span>`));
                    }
                    ca.push(ct);
                }else{
                   ca.push(0); 
                }
            }
            if(e.hasOwnProperty(`_fsu${e.setId}`)){
                e[`_fsu${e.setId}`]["_oCount"] = ca;
            }
        }
    }
    //PC下添加数量
    UTDropDownControl.prototype.open = function(){
        call.search.dropdownOpen.call(this)
        events.clubSearchSetCount(this)
    }
    events.searchFill = async(e) =>{
        let c = e.viewmodel.searchCriteria,t = e._parentViewController._fsuFillType,
            p = e._parentViewController._fsuFillArray,
            fs = e._parentViewController._fsuFillSort || 3,
            r = "_fsuFillRange" in e._parentViewController ? e._parentViewController._fsuFillRange : [46,99];

        if(e.squad.isSBC() && "_fsuRatLow" in e._view == false && "_fsuRatHigh" in e._view == false &&  t%2 !== 1){
            let ratHeader = events.createElementWithConfig("div", {
                classList: ["fsu-range"],
                style: {
                    alignItems:"center",
                    display:"flex",
                    justifyContent:"space-between",
                    margin:".5rem 0 1rem 0"
                },
            });
            let ratTitle = events.createElementWithConfig("h4",{
                textContent:fy("sbcrange.title")
            })
            ratHeader.appendChild(ratTitle)
            let ratClear = new UTFlatButtonControl();
            ratClear.init()
            ratClear.setText(services.Localization.localize("search.button.clear"));
            ratClear.addTarget(this, (e) => {
                e._parent._fsuRatLow.setValue(e._parent._fsuRatLow.getMinValue())
                e._parent._fsuRatLow.updateIncrementDecrementButtonInteractionStates();
                e._parent._fsuRatHigh.setValue(e._parent._fsuRatHigh.getMaxValue())
                e._parent._fsuRatHigh.updateIncrementDecrementButtonInteractionStates();
                info.range = [46,99]
            }, EventType.TAP)
            ratClear._parent = e._view;
            e._view._fsuRatClear = ratClear;
            ratHeader.appendChild(e._view._fsuRatClear.__root);
            e._view._fsuRatBox = ratHeader;
            let targetElement = e._view._searchOptions.getRootElement();
            targetElement.parentNode.insertBefore(ratHeader, targetElement.nextSibling);
            let ratBox = events.createElementWithConfig("div", {
                classList: ["fsu-range"],
                style: {
                    display:"flex",
                    gap:"0 .5rem",
                    alignItems:"center",
                    marginBottom:"1rem"
                },
            });
            let ratLow = new UTNumberInputSpinnerControl();
            ratLow.setValue(t == 0 ? info.range[0] : r[0]);
            ratLow.setLimits(r[0],r[1]);
            ratLow.init();
            ratLow.updateIncrementDecrementButtonInteractionStates();
            e._view._fsuRatLow = ratLow;
            ratBox.appendChild(e._view._fsuRatLow.__root);
            ratBox.appendChild(events.createElementWithConfig("span", {
                classList: ["price-filter"],
                textContent: fy("sbcrange.to"),
            }));
            let ratHigh = new UTNumberInputSpinnerControl();
            ratHigh.setValue(t == 0 ? info.range[1] : r[1]);
            ratHigh.setLimits(r[0],r[1]);
            ratHigh.init();
            ratHigh.updateIncrementDecrementButtonInteractionStates();
            e._view._fsuRatHigh = ratHigh;
            ratBox.appendChild(e._view._fsuRatHigh.__root);
            ratHeader.parentNode.insertBefore(ratBox, ratHeader.nextSibling);
        }
        if(t !== 1 && t%2 == 1){
            let s = new UTSearchCriteriaDTO(),
                not,
                sort = _.split(_.replace(_.toLower(SearchSortID[fs]),"rating","ovr"), '_');
            s._type = "player";
            s.count = 21;
            switch(t){
                case 3:
                    s.sortBy = Object.keys(info.criteria).length ? info.criteria.sortBy : sort[0];
                    s._sort = Object.keys(info.criteria).length ? info.criteria._sort : sort[1];
                    not = "notice.duplicateloading";
                    break
                case 5:
                    s.sortBy = sort[0];
                    s._sort = sort[1];
                    not = "notice.appointloading";
                    break
                case 7:
                    s.sortBy = sort[0];
                    s._sort = sort[1];
                    not = "notice.chemplayerloading";
                    break
                case 9:
                    s.sortBy = sort[0];
                    s._sort = sort[1];
                    e.clubSearchType = "dream";
                    _.map(p,(value,key) => {
                        s[key] = value;
                    })
                    not = "notice.searchconceptloading";
                    break
            }
            await e.setSearchCriteria(s);
            console.log(e)
            await e._view.getSearchButton()._tapDetected(this);
            events.notice(not,1);
            return;
        }

        if(t && t%2 == 0){
            let pn = "";
            switch(t){
                case 4:
                    pn = fy("sbc.duplicates");
                    break
                case 6:
                    pn = fy("sbc.appoint");
                    break
                case 8:
                    pn = fy("sbc.chemplayer");
                    break
            }
            if("_fsuFilterBtn" in e._parentViewController){
                delete e._parentViewController._fsuFilterBtn
            }
            await e._view.getPlayerNameSearch()._playerNameInput.setValue(pn);
            await e._view.getPlayerNameSearch()._playerNameInput.setInteractionState(0);
            let sortId = SearchSortID[_.toUpper(`${_.replace(c.sortBy,"ovr","rating")}_${c.sort}`)];
            if(e._view.getSortDropDown().getId() !== sortId){
                e._view.getSortDropDown().setIndexById(sortId);
            }
            return;
        }
        

        console.log("开始判断进行填充选项","此时的saveCriteria为：",info.criteria)
        if(Object.keys(info.criteria).length == 0 && t == 0){
            await e._view.getSortDropDown().setIndexById(2);
        }else{
            if(!info.set.sbc_records) return;
            //交易选项匹配判断
            c._untradeables = info.criteria._untradeables;
            if(info.criteria._untradeables == "true"){
                await e._view.getSortOptions().toggles._collection["sort-untradeable"].toggle(true);
            }else{
                await e._view.getSortOptions().toggles._collection["sort-untradeable"].toggle(false);
            }
            //排除队伍选项匹配判断
            if(cntlr.current().className == `UTSquadSplitViewController`){
                c.excludeDefIds = [];
            }else{
                c.excludeDefIds = info.criteria.excludeDefIds;
                if(info.criteria.excludeDefIds.length > 0){
                    await e._view.getSortOptions().toggles._collection["sort-exclude-squad"].toggle(true);
                }else{
                    await e._view.getSortOptions().toggles._collection["sort-exclude-squad"].toggle(false);
                }
            }
            //排序条件选项匹配判断
            if(info.criteria.sortBy !== c.sortBy || info.criteria._sort !== c._sort){
                let sort = ["valuedesc","valueasc","ovrdesc","ovrasc","recentdesc"]
                for (let i = 0; i < sort.length; i++) {
                    if(info.criteria.sortBy + info.criteria._sort == sort[i]){
                        await e._view.getSortDropDown().setIndexById(i);
                        break;
                    }
                }
            }
            //品质条件选项匹配判断
            if(info.criteria.level !== c.level){
                for (const v of e._view._filterContainer.filters[0].options) {
                    if(v.value == info.criteria.level){
                        await e._view._filterContainer.filters[0].setIndexById(v.id);
                        break;
                    }
                }
            }
            //稀有条件选项匹配判断
            if(info.criteria.rarities !== c.rarities){
                if(info.criteria.rarities.length == 1){
                    await e._view._filterContainer.filters[1].setIndexById(info.criteria.rarities[0])
                }
            }
            //位置条件选项匹配判断
            if(info.criteria._position == "any"){
                await e._view._filterContainer.filters[2].setIndexById(-1)
            }else{
                let posId = -1;
                let slot = isPhone() ? cntlr.current().getCurrentController().iterator : cntlr.right().iterator;
                if(slot){
                    posId = slot.get(slot.getIndex()).generalPosition;
                }
                await e._view._filterContainer.filters[2].setIndexById(posId)
            }
            if(info.criteria.nation !== c.nation){
                await e._view._filterContainer.filters[4].setIndexById(info.criteria.nation)
            }
            if(info.criteria.league !== c.league){
                await e._view._filterContainer.filters[5].setIndexById(info.criteria.league)
            }
            if(info.criteria.club !== c.club){
                await e._view._filterContainer.filters[6].setIndexById(info.criteria.club)
            }
            if(t == 1){
                setTimeout(() => {
                    e._view.getSearchButton()._tapDetected(this);
                }, 50);
                events.notice("notice.quicksearch",1);
                console.log("快捷添加状态变为",0)
                return;
            }
        }
    }

    UTPaginatedItemListView.prototype.setPaginationState = function(t, e) {
        call.search.result.call(this , t ,e)
        if(this._interactionState){
            if(cntlr.current().hasOwnProperty("_squad")){
                if(cntlr.current()._squad.isSBC()){
                    let w;
                    if(isPhone()){
                        w = cntlr.current()._currentController;
                    }else{
                        w = cntlr.right();
                    }
                    if(w.searchCriteria){
                        if(w.getParentViewController()._fsuFillType == 0){
                            info.criteria = JSON.parse(JSON.stringify(w.searchCriteria));
                        }
                    }
                }
            }
        }
    }
    events.searchInput = (c) => {
        if(!info.set.sbc_input) return;
        for (let i of ["club","nation","league"]) {
            let s = c.searchFilters._collection[i];
            let a = s.options.map(e => e.label);
            s.__root.setAttribute("data-f",i);
            let st = s.__label.innerText;
            s.__label.innerHTML = "";
            s.__label.style.marginRight = 0
            0;
            s.__list.style.height = "14rem";
            s.__list.style.backgroundColor = "#171826";
            s.__list.setAttribute("data-f",i);
            let ip = document.createElement("input");
            ip.classList.remove("ut-text-input-control");
            ip.classList.add("fsu-input");
            if(st == services.Localization.localize(`sbc.requirements.subType.${i}`)){
                ip.setAttribute("placeholder",st);
            }else{
                ip.setAttribute("value",st);
            }
            ip.setAttribute("maxlength","50");
            ip.setAttribute("data-f",i);
            ip._oData = a;
            ip.addEventListener('compositionstart', events.searchInputEvent);
            ip.addEventListener('compositionend', events.searchInputEvent);
            ip.addEventListener('input', events.searchInputEvent);
            ip.addEventListener('blur', events.searchInputEvent);
            ip.addEventListener('focus', events.searchInputEvent);
            s[`_fsu${i}`] = ip;
            s.__label.append(s[`_fsu${i}`]);
        }
    }
    events.searchInputEvent = (e) => {
        let iz = cntlr.current()._view;
        if(cntlr.current().hasOwnProperty("_rightController")){
            iz = cntlr.right()._view;
        }
        if(e.type == "compositionstart"){
            info.base.input = false;
        }
        if(e.type == "compositionend"){
            info.base.input = true;
        }
        if(e.type == "input"){
            setTimeout(() => {
                if(info.base.input){
                    let v = e.target.value;
                    let f = e.target.getAttribute("data-f");
                    let z = iz.hasOwnProperty("_filterContainer") ? iz._filterContainer.searchFilters._collection[f] : iz._searchFilters.searchFilters._collection[f];
                    let p = `ul[data-f='${f}'] li`;
                    if(!z.isOpen){
                        z.open()
                    }
                    e.target._oData.forEach(function(el, i) {
                        let a = document.querySelectorAll(p)[i],c = info.set.sbc_icount && "_oCount" in e.target ? (e.target._oCount[i] >= Number(v) ? true : false) : false;
                        if(el.includes(v) || c){
                            a.classList.remove("hide");
                        }else{
                            a.classList.add("hide");
                        }
                    })
                }
            }, 0);
        }
        if(e.type == "blur"){
            let v = e.target.value;
            let f = e.target.getAttribute("data-f");
            let z = iz.hasOwnProperty("_filterContainer") ? iz._filterContainer.searchFilters._collection[f] : iz._searchFilters.searchFilters._collection[f];
            if(v !== z.label){
                if(z.id == -1){
                    e.target.value = "";
                }else{
                    e.target.value = z.label;
                }
            }
        }
        if(e.type == "focus"){
            e.target.value = "";
        }
    }
    //转会列表界面
    UTTransferListViewController.prototype._renderView = function(...args) {
        call.view.transfer.call(this, ...args);
        let sectionKey = [UTTransferSectionListViewModel.SECTION.UNSOLD,UTTransferSectionListViewModel.SECTION.AVAILABLE];
        for (const key of sectionKey) {
            let controller = this.getView().getSection(key);
            let list = controller.listRows;
            if(list.length){
                let solePlayers = list.filter(i => i.data.duplicateId == 0);
                if(solePlayers.length && info.set.player_transfertoclub){
                    //console.log(solePlayers)
                    controller._fsuSendClub = events.createButton(
                        new UTImageButtonControl(),
                        "",
                        async(e) => {
                            e.parent.getView().setInteractionState(!1);
                            events.popup(
                                fy("transfertoclub.popupt"),
                                fy(["transfertoclub.popupm",e.list.length]),
                                (t) => {
                                    if(t === 2){
                                        events.transferToClub(e.parent,e.list);
                                    }else{
                                        e.parent.getView().setInteractionState(!0);
                                    }
                                }
                            )
                        },
                        "filter-btn fsu-club"
                    )
                    controller._fsuSendClub.list = solePlayers.map(i => {return i.data});
                    controller._fsuSendClub.parent = this;
                    controller._header.getRootElement().appendChild(controller._fsuSendClub.getRootElement());
                }
            }
        }
    }

    //转会名单发送球员后调用事件
    events.transferToClub = (controller,list) => {
        services.Item.move(list, ItemPile.CLUB).observe(controller, (e,t) => {
                if (e.unobserve(controller),
                t.success) {
                    let i = t.data.itemIds.length , o = 1 < i ? services.Localization.localize("notification.item.allToClub", [i]) : services.Localization.localize("notification.item.oneToClub");
                    services.Notification.queue([o, UINotificationType.NEUTRAL]);
                    if(i < list.length){
                        events.notice(["transfertoclub.unable",list.length - i],2)
                    }
                    if(isPhone()){
                        controller.refreshList()
                    }
            }else{
                t.data.untradeableSwap ? services.Notification.queue([services.Localization.localize("notification.item.moveFailed"), UINotificationType.NEGATIVE]) : (services.Notification.queue([services.Localization.localize("notification.item.moveFailed"), UINotificationType.NEGATIVE]),
                NetworkErrorManager.handleStatus(t.status))
            }
        })
    }
    //未分配界面
    UTUnassignedItemsViewController.prototype.renderView = function(...args) {
        call.view.unassigned.call(this, ...args);
        //生成头部
        let UTSPrice = 0;
        let UTSPlayer = this.getViewModel().getSectionItems().map(i => {
            if(!i.isLoaned() && i.isPlayer()){
                UTSPrice += events.getCachePrice(i.definitionId,1);
                return i
            }
        }).filter(Boolean);
        if(UTSPlayer.length){
            let UTSSection = document.createElement('section');
            UTSSection.classList.add("sectioned-item-list","fsu-screenshot")
            let UTSheader = document.createElement('header');
            UTSheader.classList.add("ut-section-header-view");
            UTSSection.appendChild(UTSheader);
            let UTSH2 = document.createElement('h2');
            UTSH2.classList.add("title");
            UTSH2.style.fontSize = "1.3rem";
            UTSheader.appendChild(UTSH2);
            let UTSText = document.createElement('span');
            UTSText.classList.add("text");
            UTSH2.appendChild(UTSText);
            let UTSCoins = document.createElement('span');
            UTSCoins.classList.add("currency-coins");
            UTSH2.appendChild(UTSCoins);
            UTSText.textContent = fy(["screenshot.text",UTSPlayer.length,UTSPrice.toLocaleString()])
            this._view.__root.insertBefore(UTSSection, this._view.__root.firstChild);
        }
        //快捷按钮调出
        //可交换页面
        let itemSection = this.getView().getSection(UTUnassignedItemsViewModel.SECTION.ITEMS);
        if(itemSection){
            let items = this.getViewModel().getStorableSection();
            let vacancy = repositories.Item.numItemsInCache(ItemPile.TRANSFER) + items.length <= repositories.Item.getPileSize(ItemPile.TRANSFER);
            if(0 < items.length && vacancy && this.getViewModel().hasTradeableItems()){
                this._view._fsuTransfer = events.createButton(
                    new UTImageButtonControl(),
                    "",
                    async(e) => {
                        this.sendStorablesToTransferList();
                    },
                    "filter-btn fsu-transfer"
                )
                itemSection._header.getRootElement().appendChild(this._view._fsuTransfer.getRootElement())
            }
            if(this.getViewModel().hasMovableItems()){
                this._view._fsuClub = events.createButton(
                    new UTImageButtonControl(),
                    "",
                    async(e) => {
                        this.storeInClub();
                    },
                    "filter-btn fsu-club"
                )
                itemSection._header.getRootElement().appendChild(this._view._fsuClub.getRootElement())
            }
        }

        let duplicateSection = this.getView().getSection(UTUnassignedItemsViewModel.SECTION.DUPLICATES);
        if(duplicateSection){
            if(this.getViewModel().hasTradeableDuplicates()){
                let items = this.getViewModel().getDuplicateSection();
                let vacancy = repositories.Item.numItemsInCache(ItemPile.TRANSFER) + items.length <= repositories.Item.getPileSize(ItemPile.TRANSFER);
                if(0 < items.length && vacancy){
                    this._view._fsuDupTransfer = events.createButton(
                        new UTImageButtonControl(),
                        "",
                        async(e) => {
                            this.sendDuplicatesToTransferList();
                        },
                        "filter-btn fsu-transfer"
                    )
                    duplicateSection._header.getRootElement().appendChild(this._view._fsuDupTransfer.getRootElement())
                }
            }
            let duplicatePlayerId = duplicateSection.listRows.map(i => {return i.data.duplicateId});
            let duplicatePlayer = events.getItemBy(2,{"id":duplicatePlayerId}).filter(i => !i.untradeable);
            if(duplicatePlayer.length){
                this._view._fsuSwap = events.createButton(
                    new UTImageButtonControl(),
                    "",
                    async(e) => {
                        this.confirmSwapUntradeablesTapped();
                    },
                    "filter-btn fsu-swap"
                )
                duplicateSection._header.getRootElement().appendChild(this._view._fsuSwap.getRootElement())
            }
        }

        if(duplicateSection || itemSection){
            this._view._fsuRefresh = events.createButton(
                new UTImageButtonControl(),
                "",
                async(e) => {
                    await services.Item.itemDao.itemRepo.unassigned.reset();
                    await e.parent.getUnassignedItems();
                    events.notice("notice.uasreset",0);
                },
                "filter-btn fsu-refresh"
            )
            this._view._fsuRefresh.parent = this;
            let targetElement = (itemSection || duplicateSection)?._header?.getRootElement();
            if (targetElement) {
                targetElement.appendChild(this._view._fsuRefresh.getRootElement());
            }
        }
        //未分配为0直接返回
        setTimeout(() => {
            if(this.getViewModel() && this.getViewModel().length === 0 && !document.querySelector(".player-picks-modal")){
                if(isPhone()){
                    this._parentViewController._backButton._tapDetected(this)
                }else{
                    this._parentViewController._parentViewController._backButton._tapDetected(this)
                }
                events.notice("notice.packback",1);
            }
        },800);
    }

    //SBC无须排列创建队伍
    UTSquadBuilderViewModel.prototype.generatePlayerCollection = function (e,o,n) {
        let c = 0;
        let ls = info.build.league ? info.set.shield_league : [];
        let rs = info.build.rare ? [3] : [];
        let p = o.filter(item => !ls.includes(item.leagueId) && !rs.includes(item.rareflag))
        let v = 0;
        for (let i = 0; i < 11; i++) {
            if(!n.getSlot(i).isValid() && !n.getSlot(i).isBrick()){
                v++;
            }
        }
        if(p.length < v && (ls.length || rs.length)){
            events.notice("notice.builder",2)
        }
        let r = this;
        let pa = e.map(function (_, t) {
            var i = n ? n.getSlot(t) : null;
            return i && (i.isValid() || i.isBrick()) ?
                i.getItem() :
                info.build.ignorepos ? 
                p[c++] : r.getBestPlayerForPos(_, p);
        })
        events.loadPlayerPrice(pa.map(function (i) {if(i){return i.definitionId}}).filter(i => i > 0))
        return pa;
    };
    //拍卖优化部分代码加载
    UTMarketSearchView.prototype._generate = function(...args) {
        if (!this._generated) {
            call.view.market.call(this,...args)
        }
    }

    //商店可开特殊球员数量显示加载
    UTStorePackDetailsView.prototype._generate = function(...args) {
        if (!this._generated) {
            call.view.pack.call(this,...args)
            if(info.base.promo && info.set.info_pack && "n" in info.base.promo){
                let f = events.createButton(
                    new UTCurrencyButtonControl(),
                    info.base.promo.n,
                    (e) => {
                        let openUrl = "u" in info.base.promo ? info.base.promo.u : "https://www.futbin.com/home-tab/latest-promo";
                        GM_openInTab(openUrl, { active: true, insert: true, setParent :true });
                    },
                    "fsu-promo"
                )
                f.setSubText(fy("pack.promo"))
                this._fsuPromo = f;
                this._fsuPromoBox = document.createElement("div");
                this._fsuPromoBox.classList.add("fsu-promo-box");
                this._fsuPromoBox.append(this._fsuPromo.__root);
                this.__root.querySelector(".ut-store-pack-details-view--pack-counts").append(this._fsuPromoBox)
            }
        }
    }


    //配置页面创建

    const fsuSV = function (t) {
        EAView.call(this);
    };
    JSUtils.inherits(fsuSV, EAView);
    fsuSV.prototype._generate = function _generate() {
        if (!this._generated) {
            let w = document.createElement("div");
            w.classList.add("ut-club-search-filters-view");
            let e = document.createElement("div");
            e.classList.add("ut-pinned-list-container","ut-content-container");
            this.__content = document.createElement("div");
            this.__content.classList.add("ut-content");
            let i = document.createElement("div");
            i.classList.add("ut-pinned-list");

            let ics = document.createElement("div");
            ics.classList.add("sort-filter-container");
            let icst = document.createElement("h4");
            icst.textContent = fy("set.style.title");
            ics.appendChild(icst);
            let icsb = document.createElement("div");
            icsb.classList.add("fsu-setbox");
            this._cStyle = {};
            this._cStyle.new = events.createToggle(
                fy(`set.style.new`),
                async(e) => {
                    set.save("card_style", e.getToggleState() ? 2 : 1);
                    cntlr.current().getView()._cStyle.old.toggle();
                }
            )
            icsb.appendChild(this._cStyle.new.getRootElement());
            this._cStyle.old = events.createToggle(
                fy(`set.style.old`),
                async(e) => {
                    set.save("card_style", e.getToggleState() ? 1 : 2);
                    cntlr.current().getView()._cStyle.new.toggle();
                }
            )
            icsb.appendChild(this._cStyle.old.getRootElement());

            (info.set.card_style == 1 ? this._cStyle.old : this._cStyle.new).toggle(1);

            ics.appendChild(icsb);
            i.appendChild(ics);

            for (let n in info.setfield) {
                let l = document.createElement("div");
                l.classList.add("sort-filter-container");
                let lt = document.createElement("h4");
                lt.textContent = fy(`set.${n}.title`);
                l.appendChild(lt);
                let lb = document.createElement("div");
                lb.classList.add("fsu-setbox");
                this[`_${n}`] = {};
                for (let i of info.setfield[n]) {
                    this[`_${n}`][i] = set.addToggle(n,i);
                    lb.appendChild(this[`_${n}`][i].getRootElement())
                }
                l.appendChild(lb);
                i.appendChild(l);
            }


            this.__content.appendChild(i);
            let b = document.createElement("div");
            b.classList.add("button-container");


            let buttonText = fy("settingsbutton.phone").split("、");
            this._fsuinfo = events.createButton(
                new UTStandardButtonControl(),
                isPhone() ? buttonText[0] : fy("set.getdoc"),
                () => {
                    GM_openInTab(`https://mfrasi851i.feishu.cn/wiki/OLNswCYQciVKw8k9iaAcmOY1nmf`, { active: true, insert: true, setParent :true });
                },
                "call-to-action"
            )
            b.appendChild(this._fsuinfo.__root);

            this._fsushield = events.createButton(
                new UTStandardButtonControl(),
                isPhone() ? buttonText[1] : fy("shieldlea.btntext"),
                () => {
                    events.popup(
                        fy("shieldlea.btntext"),
                        fy("shieldlea.popupm"),
                        (t,i) => {
                            if(t === 2){
                                let v = i.getValue() ,reg = /^\d+(,\d+)*$/;
                                if(reg.test(v)){
                                    let a = v.split(',').map(i => {return Number(i)}).filter(Boolean);
                                    set.save("shield_league",a)
                                }else if(v == ""){
                                    set.save("shield_league",[31,16,13,19,53])
                                }else{
                                    events.notice(fy("notice.seterror"),2)
                                }
                            }
                            if(t === 44402){
                                GM_openInTab(`https://mfrasi851i.feishu.cn/wiki/Hx8KwfYznimX8KkpK0icaEm4nYc#UbN2dpki5o23C9xKuRBcETK3nhg`, { active: true, insert: true, setParent :true });
                            }
                        }
                        ,
                        [
                            { labelEnum: enums.UIDialogOptions.OK },
                            { labelEnum: 44402 },
                            { labelEnum: enums.UIDialogOptions.CANCEL }]
                        ,
                        [fy("shieldlea.placeholder"),info.set.shield_league],
                        true
                    )
                },
                "call-to-action"
            )
            b.appendChild(this._fsushield.__root);
            
            this._fsuqueries = events.createButton(
                new UTStandardButtonControl(),
                isPhone() ? buttonText[2] : fy("numberofqueries.btntext"),
                () => {
                    events.popup(
                        fy("numberofqueries.btntext"),
                        fy("numberofqueries.popupm"),
                        (t,i) => {
                            if(t === 2){
                                let v = i.getValue();
                                if (!isNaN(v) && parseFloat(v) !== 0) {
                                    set.save("queries_number",Number(v))
                                }else if(v == ""){
                                    set.save("queries_number",5)
                                }else{
                                    events.notice(fy("notice.seterror"),2)
                                }
                            }
                        }
                        ,false,
                        [fy("numberofqueries.placeholder"),info.set.queries_number],
                        true
                    )
                },
                "call-to-action"
            )
            b.appendChild(this._fsuqueries.__root);


            this.__content.appendChild(b);
            e.appendChild(this.__content);
            w.appendChild(e);
            this.__root = w;
            this._generated = !0;
        }
    }
    set.addToggle = function(na,nb){
        let e = events.createToggle(
            fy(`set.${na}.${nb}`),
            async(e) => {
                set.save(`${na}_${nb}` , e.getToggleState() ? true : false);
            }
        )
        e._sName = `${na}_${nb}`;
        if(info.set[`${na}_${nb}`]){
            e.toggle(1);
        }
        return e;
    }
    const fsuSC = function (t) {
        EAViewController.call(this);
    };
    JSUtils.inherits(fsuSC, EAViewController);
    fsuSC.prototype._getViewInstanceFromData = function () {
        return new fsuSV();
    };
    fsuSC.prototype.viewDidAppear = function () {
        this.getNavigationController().setNavigationVisibility(true, true);
    };
    fsuSC.prototype.getNavigationTitle = function () {
        return fy("set.title");
    };
    
    set.init = function(){
        let a = JSON.parse(GM_getValue("set","{}")),b = {};
        if(a && typeof a === 'object'){
            b = a;
        }
        if(!b.hasOwnProperty("card_style")){
            b["card_style"] = 2;
        }
        for (let n in info.setfield) {
            for (let i of info.setfield[n]) {
                let c = `${n}_${i}`;
                if(!b.hasOwnProperty(c)){
                    b[c] = true;
                }
            }
        }
        if(!b.hasOwnProperty("shield_league")){
            b["shield_league"] = [31,16,13,19,53];
        }
        if(!b.hasOwnProperty("queries_number")){
            b["queries_number"] = 5;
        }
        console.log(b)
        info.set = b;
    }
    set.save = function(s,r){
        info.set[s] = r;
        GM_setValue("set",JSON.stringify(info.set));
        events.notice(fy("notice.setsuccess"),0)
    };
    //拍卖查询价格
    events.getAuction = async function(e){
        e.setInteractionState(0);
        e.__root.querySelector("span.btn-subtext").textContent = fy("quicklist.getpriceload");
        let id = e.__root.getAttribute("data-id"),p = e.__root.getAttribute("data-p").replace(/,/g, ""),p_result,p_arr = [],p_cm = {},p_cmarr = [],s = Number(p);
        p_result = await getAuctionPrice(id,p);
        p_arr = p_result.map(i => i.buyNowPrice) || [];
        if (p_result.length == 0) {
            for (let i = 0; i < 5; i++) {
                s = UTCurrencyInputControl.getIncrementAboveVal(s);
                console.log(`第${i}次循环，当前查询价格${s}`)
                let p_r =  await getAuctionPrice(id,s);
                p_r.map(i => {
                    p_arr.push(i.buyNowPrice);
                });
                if(p_r.length > 0){
                    break;
                }
            }
        } else if (p_result.length == 21) {
            for (let i = 0; i < 5; i++) {
                s = UTCurrencyInputControl.getIncrementBelowVal(s);
                console.log(`第${i}次循环，当前查询价格${s}`)
                let p_r =  await getAuctionPrice(id,s);
                p_r.map(i => {
                    p_arr.push(i.buyNowPrice);
                });
                if(p_r.length < 21){
                    break;
                }
            }
        }
        for (let i of p_arr) {
            p_cm[i] = p_cm[i] ? p_cm[i] + 1 : 1;
        }
        p_cm = Object.fromEntries(Object.entries(p_cm).slice(0, 3));
        if(Object.keys(p_cm).length){
            pdb[id] = Object.entries(p_cm)[0][0].toLocaleString('en-US', { style: 'decimal' });
            let p_e = document.querySelector(`button.fsuGP[data-id='${id}']`)
            if(p_e){
                p_e.querySelector("span.btn-subtext").textContent = pdb[id].toLocaleString();
                p_e.querySelector("span.btn-subtext").classList.add("currency-coins");
                let n = 0;
                for (let i in p_cm) {
                    n++;
                    let l_e = events.createButton(
                        new UTGroupButtonControl(),
                        `${fy("quicklist.getpricelt")} ${n}`,
                        () => {},
                        "accordian fsuGPL"
                    )
                    l_e.__subtext.textContent = i.toLocaleString();
                    l_e.displayCurrencyIcon(!0);
                    let l_es = document.createElement("span");
                    l_es.textContent = ` ×${p_cm[i]}`;
                    l_e.__subtext.appendChild(l_es);
                    l_e.setInteractionState(0);
                    p_e.parentNode.appendChild(l_e.__root)
                }
            }
        }
    }
    function getAuctionPrice(i,p){
        return new Promise(res => {
            GM_xmlhttpRequest({
                method:"GET",
                url:`https://utas.mob.v2.fut.ea.com/ut/game/fc24/transfermarket?num=21&start=0&type=player&maskedDefId=${i}&maxb=${p}`,
                headers: {
                    "Content-type": "application/json",
                    "X-UT-SID": info.base.sId
                },
                onload:function(response){
                    if(response.status == 404 || response.status == 401){
                        info.base.sId = services.Authentication.sessionUtas.id;
                        events.notice("notice.loaderror",2);
                    }else{
                        res(JSON.parse(response.response).auctionInfo)
                    }
                },
                onerror:function(){
                    events.notice("notice.loaderror",2);
                }
            })
        })
    };


    //假想球员购买
    events.buyPlayer = async (player,view) => {
        events.showLoader();
        let defId = 0,playerName ="",state = true;
        if(Number.isInteger(player)){
            defId = player;
            playerName = repositories.Item.getStaticDataByDefId(defId).name;
        }else if(typeof player == "object" && player.isPlayer()){
            defId = player.definitionId;
            playerName = player.getStaticData().name
        }
        if(!defId){
            return;
        }
        if(repositories.Item.numItemsInCache(ItemPile.PURCHASED) >= MAX_NEW_ITEMS){
            events.notice(["buyplayer.error",playerName,fy("buyplayer.error.child5")],2);
            state = false;
        }else{
            let priceList = await events.readAuctionPrices(player);
            priceList.sort((a, b) => b._auction.buyNowPrice - a._auction.buyNowPrice);
            console.log(priceList)
            events.changeLoadingText("buyplayer.loadingclose");
            if(!priceList || priceList.length == 0){
                events.notice(["buyplayer.error",playerName,fy("buyplayer.error.child3")],2);
                state = false;
            }else{
                let currentPlayer = priceList[priceList.length - 1];
                let currentData = currentPlayer.getAuctionData();
                if(!currentData.canBuy(services.User.getUser().getCurrency(GameCurrency.COINS).amount)){
                    events.notice(["buyplayer.error",playerName,fy("buyplayer.error.child2")],2);
                    state = false;
                }else{
                    if(0 < currentData.getSecondsRemaining()){
                        return new Promise(async (resolve) => {
                            events.sendPinEvents("Item - Detail View");
                            services.Item.bid(currentPlayer,currentPlayer._auction.buyNowPrice).observe(this, async function (sender, data) {
                                if(data.success){
                                    events.notice(["buyplayer.success",playerName,currentPlayer._auction.buyNowPrice],0);
                                    services.Item.move(currentPlayer, ItemPile.CLUB).observe(this, (e,t) => {
                                        if (e.unobserve(this),t.success) {
                                            events.notice(["buyplayer.sendclub.success",playerName],0);
                                            if(isPhone()){
                                                let controller = cntlr.current();
                                                if(controller.className ==  'UTSquadItemDetailsNavigationController'){
                                                    controller.getParentViewController()._eBackButtonTapped()
                                                }
                                            }
                                        }else{
                                            events.notice(["buyplayer.sendclub.error",playerName],2);
                                            state = false;
                                        }
                                        events.hideLoader();
                                    })
                                }else{
                                    let denied = data.error && data.error.code === UtasErrorCode.PERMISSION_DENIED
                                    events.notice(["buyplayer.error",playerName,`${denied ? fy("buyplayer.error.child1") : ""}`],2);
                                    state = false;
                                    events.cardAddBuyErrorTips(defId);
                                    if(view){
                                        view.getSuperview().items._collection[view.getSuperview().items._index].render(player)
                                    }
                                    events.hideLoader();
                                }
                            })
                            resolve();
                        })
                    }else{
                        events.notice(["buyplayer.error",playerName,fy("buyplayer.error.child4")],2);
                        state = false;
                    }
                }
            }
            
        }
        if(!state){
            events.cardAddBuyErrorTips(defId);
            if(view){
                view.getSuperview().items._collection[view.getSuperview().items._index].render(player)
            }
        }
        events.hideLoader();
    };

    //购买失败添加标识
    events.cardAddBuyErrorTips = (defId) => {
        let squad = cntlr.current()._squad;
        if(!("_fsuBuyEroor" in squad)){
            squad._fsuBuyEroor = [];
        }
        if (!_.includes(squad._fsuBuyEroor,defId)) {
            squad._fsuBuyEroor.push(defId);
        }
        if(!isPhone()){
            _.map(squad._fsuBuyEroor,i => {
                if(document.querySelector(`.fsu-cards-buyerror[data-id="${i}"]`) == null && document.querySelector(`.fsu-cards-price[data-id="${i}"]`) !== null){
                    let buyErrorElement = events.getBuyErrorTipsHtml();
                    let targetElement = document.querySelector(`.ut-squad-slot-view .concept .fsu-cards-price[data-id="${i}"]`).parentNode;
                    let parentElement = targetElement.parentNode;
                    if(parentElement.querySelector(".fsu-cards-buyerror") == null){
                        parentElement.insertBefore(buyErrorElement, targetElement);
                    }
                }
            })
        }
    }
    events.getBuyErrorTipsHtml = () => {
        let buyError = events.createElementWithConfig("div",{
            classList:["ut-squad-slot-chemistry-points-view","item","fsu-cards","fsu-cards-buyerror"],
            style:{
                left:"auto",
                right:"1%",
                color:"#fae8e6",
                backgroundColor:"#d31332",
                borderColor:"#d6675d"
            }
        })
        let buyErrorIcon = events.createElementWithConfig("div",{
            classList:["ut-squad-slot-chemistry-points-view--container","chemstyle","icon_untradeable"]
        })
        buyError.appendChild(buyErrorIcon);
        return buyError;
    }
    events.readAuctionPrices = async(player,price) => {
        events.changeLoadingText("readauction.loadingclose");
        let attempts = "queries_number" in info.set ? info.set.queries_number : 5;
        let defId = Number.isInteger(player) ? player : typeof player == "object" && "definitionId" in player ? player.definitionId : Number(player);
        let searchCriteria = new UTSearchCriteriaDTO();
        searchCriteria.defId = [defId];
        searchCriteria.type = SearchType.PLAYER;
        searchCriteria.category = SearchCategory.ANY;
        let searchModel = new UTBucketedItemSearchViewModel();
        searchModel.searchFeature = ItemSearchFeature.MARKET;
        searchModel.defaultSearchCriteria.type = searchCriteria.type;
        searchModel.defaultSearchCriteria.category = searchCriteria.category;
        searchModel.updateSearchCriteria(searchCriteria);
        let result = [];
        if(searchCriteria.defId.length){
            let queried = [];
            if(price){
                searchCriteria.maxBuy = Number(price);
            }else{
                let playerPrice = await getFutbin(`https://www.futbin.com/${info.base.year}/playerPrices?player=${defId}`);
                if(!playerPrice){
                    return;
                }
                info.roster.data[defId] = playerPrice[defId];
                searchCriteria.maxBuy = events.getCachePrice(defId,1);
            }
            searchModel.updateSearchCriteria(searchCriteria);
            events.changeLoadingText("readauction.loadingclose2");
            while (attempts --> 0) {
                events.changeLoadingText(["readauction.loadingclose3",`${searchModel.searchCriteria.maxBuy.toLocaleString()}`]);
                if(queried.includes(searchModel.searchCriteria.maxBuy)){
                    break;
                }
                services.Item.clearTransferMarketCache();
                let response = await events.searchTransferMarket(searchModel.searchCriteria, 1);
                if(response.success){
                    events.sendPinEvents("Transfer Market Results - List View");
                    result = result.concat(response.data.items);
                    let currentQuery = searchCriteria.maxBuy;
                    queried.push(currentQuery)
                    if(response.data.items.length == 0){
                        currentQuery = UTCurrencyInputControl.getIncrementAboveVal(currentQuery);
                    }else if(response.data.items.length == 21){
                        currentQuery = UTCurrencyInputControl.getIncrementBelowVal(currentQuery);
                    }else{
                        break;
                    }
                    searchCriteria.maxBuy = currentQuery;
                    searchModel.updateSearchCriteria(searchCriteria);
                }else{
                    events.notice("readauction.error",2);
                    break;
                }
                if(attempts > 0){
                    await events.wait(0.2,0.5)
                }
            }
        }
        return result;
    }
    events.searchTransferMarket = (criteria,type) => {
        return new Promise(async (resolve) => {
            services.Item.searchTransferMarket(criteria, type).observe(this,async function (sender, response) {
                resolve(response);
            });
        })
    }
    events.sendPinEvents = (pageId) => {
        services.PIN.sendData(PINEventType.PAGE_VIEW, {type: PIN_PAGEVIEW_EVT_TYPE,pgid: pageId,});
    };
    UTSBCSquadDetailPanelView.prototype.render = function(e, t, i, o) {
        call.panel.sbc.call(this,e, t, i, o)
        if(!this._fsuSquad && info.set.sbc_template){
            let b = events.createButton(
                new UTStandardButtonControl(),
                fy("sbc.squadfill"),
                (e) => {
                    if(info.set.sbc_templatemode){
                        events.popup(
                            fy("consult.popupt"),
                            fy("consult.popupm"),
                            (t,i) => {
                                if(t === 2){
                                    let v = i.getValue();
                                    if(v == ""){
                                        events.getTemplate(e,1);
                                    }else{
                                        let futBinRegex = /www.futbin.com\/\d{2}\/squad\/\d{9}|^\d{9}$/;
                                        let futGGRegex = /www.fut.gg\/\d{2}\/squad-builder\/\S{8}-\S{4}-\S{4}-\S{4}-\S{12}|^\S{8}-\S{4}-\S{4}-\S{4}-\S{12}$/;
                                        if(futGGRegex.test(v)){
                                            let pattern = /\S{8}-\S{4}-\S{4}-\S{4}-\S{12}/;
                                            let sId = v.match(pattern);
                                            events.getTemplate(e,3,sId[0]);
                                        }else if(futBinRegex.test(v)){
                                            let pattern = /\d{9}/;
                                            let sId = v.match(pattern);
                                            events.getTemplate(e,2,sId[0]);
                                        }else{
                                            events.notice("consult.error",2);
                                        }
                                    }
                                }
                            }
                            ,false,
                            [fy("consult.placeholder"),""],
                            true
                        )
                    }else{
                        events.getTemplate(e,1);
                    }
                },
                "call-to-action"
            )
            b.__root.setAttribute("data-id",e.id);
            this._fsuSquad = b;
            this._fsuSquad.challenge = e;
            this._btnSquadBuilder.__root.after(this._fsuSquad.__root);
        }

        //计算所需条件
        let sc = 11 - e.squad.getAllBrickIndices().length,gf = [],gfall = {},targetRting = 0,needChem = false;
        for (let i of e.eligibilityRequirements) {
            let fk = i.getFirstKey(),fv = i.getFirstValue(fk),gfs = {"t":{},"c":i.count};
            if(fk == SBCEligibilityKey.PLAYER_QUALITY){
                gfs.t["rs"] = fv - 1;
                gfall["rs"] = fv - 1;
            }
            if(fk == SBCEligibilityKey.PLAYER_RARITY){
                gfs.t["rareflag"] = fv;
            }
            if(fk == SBCEligibilityKey.PLAYER_RARITY_GROUP && fv == 4){
                gfs.t["gs"] = true;
                gfall["gs"] = false;
            }
            if(fk == SBCEligibilityKey.PLAYER_LEVEL){
                gfs.t["rs"] = fv - 1;
            }
            if(fk == SBCEligibilityKey.TEAM_RATING){
                gf = [];
                targetRting = fv;
            }
            if(fk == SBCEligibilityKey.CHEMISTRY_POINTS){
                needChem = true;
            }
            if(Object.keys(gfs.t).length){
                gf.push(gfs)
            }
        }
        if(gf.length){
            gf.sort((a, b) => b.c - a.c);
            //处理球员数量
            let ac = gf.filter(i => i.c == -1).length,gc = sc;
            if(ac > 1){
                gf = [];
            }else if(ac == 1){
                for (let i of gf) {
                    if(i.c == -1){
                        i.c = gc
                    }else{
                        gc = gc - i.c;
                    }
                }
            }
            if(Object.keys(gfall).length){
                for (let i of gf) {
                    let keys = Object.keys(gfall).filter(k => !(k in i.t));
                    for (let key of keys) {
                        i.t[key] = gfall[key];
                    }
                }
            }
            if(gc < 0){
                gf = {};
            }
        }

        //一键填充和重复球员填充判断
        if(!this._fsuleague){
            this._fsuleague = events.createToggle(
                `${fy(`builder.league`)}(${info.set.shield_league.length})`,
                async(e) => {
                    build.set("league",e.getToggleState())
                }
            )
            this._fsuleague.toggle(info.build.league);
            this._challengeDetails._requirements.__root.appendChild(this._fsuleague.__root);
            this._fsuleague.hide();
        }
        if(!this._fsurare){
            this._fsurare = events.createToggle(
                fy(`builder.rare`),
                async(e) => {
                    build.set("rare",e.getToggleState())
                }
            )
            this._fsurare.toggle(info.build.rare);
            this._challengeDetails._requirements.__root.appendChild(this._fsurare.__root);
            this._fsurare.hide();
        }
        if(!this._fsuou){
            this._fsuou = events.createToggle(
                fy(`builder.untradeable`),
                async(e) => {
                    build.set("untradeable",e.getToggleState())
                }
            )
            this._fsuou.toggle(info.build.untradeable);
            this._challengeDetails._requirements.__root.appendChild(this._fsuou.__root);
            this._fsuou.hide();
        }
        if(!this._fsupos){
            this._fsupos = events.createToggle(
                fy(`builder.ignorepos`),
                async(e) => {
                    build.set("ignorepos",e.getToggleState())
                }
            )
            this._fsupos.toggle(info.build.ignorepos);
            this._challengeDetails._requirements.__root.appendChild(this._fsupos.__root);
            this._fsupos.hide();
        }
        if(Object.keys(gf).length){
            if(!this._fsuAutoFill && info.set.sbc_autofill){   
                let b = events.createButton(
                    new UTStandardButtonControl(),
                    fy("autofill.btntext"),
                    (e) => {
                        let pl = [],gtb = [];
                        for (let i of e._gf) {
                            let gf = JSON.parse(JSON.stringify(i.t));
                            if(info.build.league){
                                gf["NEleagueId"] = info.set.shield_league;
                            }
                            if(info.build.rare){
                                gf["NErareflag"] = 3;
                            }
                            if(info.build.untradeable){
                                gf["untradeable"] = true;
                            }
                            if(gtb.length){
                                gf["NEdatabaseId"] = gtb;
                            }
                            gf["lock"] = false;
                            let z = events.getItemBy(2,gf,services.Item.itemDao.itemRepo.getUnassignedItems()).slice(0,i.c);
                            gtb = gtb.concat(z.map( i => {return i.databaseId}))
                            pl = pl.concat(z)
                        }
                        if(pl.length){
                            events.playerListFillSquad(e._parent,pl,1);
                        }else{
                            e.setInteractionState(0)
                            events.notice("notice.noplayer",2)
                        }
                    },
                    "mini call-to-action"
                )
                b.__root.style.width = '100%';
                b._gf = gf;
                b._parent = e;
                this._fsuAutoFill = b;
                this._challengeDetails._requirements.__root.appendChild(this._fsuAutoFill.__root);
                this._fsuleague.show();
                this._fsurare.show();
                this._fsuou.show();
                this._fsupos.show();
            }
        }else if(!this._fsuDupFill && info.set.sbc_dupfill && repositories.Item.getUnassignedItems().length){
            let b = events.createButton(
                new UTStandardButtonControl(),
                fy("dupfill.btntext"),
                (e) => {
                    let gf = {"id":[...new Set(repositories.Item.getUnassignedItems().map(i => {if(i.isDuplicate() && !i.isLoaned() && i.isPlayer()){return i.duplicateId}}))]};
                    if(info.build.league){
                        gf["NEleagueId"] = info.set.shield_league;
                    }
                    if(info.build.rare){
                        gf["NErareflag"] = 3;
                    }
                    if(info.build.untradeable){
                        gf["untradeable"] = true;
                    }
                    gf["lock"] = false;
                    let up = events.getItemBy(2,gf);
                    if(up.length){
                        if(repositories.Item.getUnassignedItems().filter(i => {return i.duplicateId}).length > up.length){
                            events.notice("notice.dupfilldiff",1)
                        }
                        events.playerListFillSquad(e._parent,up,1)
                    }else{
                        e.setInteractionState(0)
                        events.notice("notice.noplayer",2)
                    }
                },
                "mini call-to-action"
            )
            b.__root.style.width = '100%';
            b._parent = e;
            this._fsuDupFill = b;
            this._challengeDetails._requirements.__root.appendChild(this._fsuDupFill.__root);
            this._fsuleague.show();
            this._fsurare.show();
            this._fsuou.show();
            this._fsupos.show();
        }
        if(info.set.sbc_dupfill && this._fsuDupFill && !services.Item.itemDao.itemRepo.getUnassignedItems().length){
            this._fsuDupFill.setDisplay(0);
        }
        //阵容补全
        if(!this._fsuSquadCmpl && info.set.sbc_squadcmpl && targetRting){
            let b = events.createButton(
                new UTStandardButtonControl(),
                fy("squadcmpl.btntext"),
                (e) => {
                    console.log(e._parent)
                    let va = e._parent.squad.getNumOfRequiredPlayers() - e._parent.squad.getFieldPlayers().filter(i => i.isValid()).length,
                    fillRating = events.needRatingsCount(e._parent.squad,e._target),
                    inputText = fillRating[0].length && e._target ? [fy("squadcmpl.placeholder"),fillRating[0].length == "0" && va == 0 ? "" : fillRating[0].join(`,`)] : fy(va ? "squadcmpl.placeholder" : "squadcmpl.placeholder_zero"),
                    popupBtns = e._target && info.set.sbc_top ? [{ labelEnum: enums.UIDialogOptions.OK },{ labelEnum: 44401 },{ labelEnum: enums.UIDialogOptions.CANCEL },] : false;
                    events.popup(
                        fy("squadcmpl.popupt"),
                        fy("squadcmpl.popupm"),
                        (t,i) => {
                            if(t === 2){
                                let v = i.getValue() ,reg = /^\d{2}(\+|\-|-\d{2}|)(,\d{2}(\+|\-|-\d{2}|))*$/ ,a = [];
                                if(reg.test(v)){
                                    a = v.split(',');
                                    let p = events.getRatingPlayers(e._parent.squad,e._parent.eligibilityRequirements,a);
                                    events.playerListFillSquad(e._parent,p,2)
                                }else if(v == ""){
                                    let p = events.getRatingPlayers(e._parent.squad,e._parent.eligibilityRequirements,[]);
                                    events.playerListFillSquad(e._parent,p,2)
                                }else{
                                    events.notice(fy("squadcmpl.error"),2)
                                }
                            }
                            if(t === 44401){
                                let btn = isPhone() ? cntlr.current().getView()._fsuCount : cntlr.left().getView()._fsuCount;
                                btn._tapDetected();
                            }
                        },
                        popupBtns,
                        inputText,
                        va,
                        fy(va ? "squadcmpl.popupmsup" : "squadcmpl.popupmsupallconcept")
                    )
                    if(fillRating[0].length){
                        events.notice(["squadcmpl.simulatedsuccess",`${fillRating[2]}`,`${fillRating[1].toLocaleString()}`],0)
                    }else if(va){
                        events.notice("squadcmpl.simulatederror",2)
                    }
                },
                "mini call-to-action"
            )
            b.__root.style.width = '100%';
            b.__root.style.marginTop = '.675rem';
            b._parent = e;
            b._target = targetRting;
            this._fsuSquadCmpl = b;
            this._challengeDetails._requirements.__root.appendChild(this._fsuSquadCmpl.__root);
            this._fsuleague.show();
            this._fsurare.show();
            this._fsupos.show();
            this._fsuou.show();
        }
        if(needChem){
            if("_fsuAutoFill" in this){
                this._fsuAutoFill.hide();
            }
            if("_fsuDupFill" in this){
                this._fsuDupFill.hide();
            }
            this._fsuleague.hide();
            this._fsurare.hide();
            this._fsupos.hide();
            this._fsuou.hide();
            if("_fsuSquadCmpl" in this && this.getRootElement().querySelector(".fsu-onlycmpltext") == null){
                let only = events.createElementWithConfig("div", {
                    textContent:fy("sbc.onlycmpltext"),
                    classList:["fsu-onlycmpltext"],
                    style:{
                        textAlign:"center"
                    }
                });
                this._fsuSquadCmpl.getRootElement().parentNode.insertBefore(only, this._fsuSquadCmpl.getRootElement().nextSibling);
            }
        }
    }
    //指定ID填充SBC
    events.playerListFillSquad = (challenge,list,type) => {
        events.showLoader();
        let playerlist = [],substitute = Array.from(list);

        let squadFormation = repositories.Squad.getFormation(challenge.formation);
        let squadBuild = new UTSquadBuilderViewModel();
        let squadBestPos = squadFormation.generalPositions.concat(Array(12).fill(-1));
        
        playerlist = squadBestPos.map(function(e, t) {
            let i = challenge.squad ? challenge.squad.getSlot(t) : null;
            if(!i || i.isBrick()){
                if(substitute.length && substitute[0].rating == 0){
                    substitute.shift();
                }
                return null;
            }else{
                if(info.build.ignorepos || e == -1 || type == 2){
                    return substitute.shift();
                }else{
                    if(substitute.length){
                        if(substitute[0].basePossiblePositions.includes(e)){
                            return substitute.shift()
                        }else{
                            return squadBuild.getBestPlayerForPos(e,substitute)
                        }
                    }else{
                        return null;
                    }
                }
            }
        })
        events.loadPlayerPrice(playerlist.map(i => {if(i && i.definitionId){return i.definitionId}}).filter(Boolean))
        events.saveSquad(challenge,challenge.squad,playerlist,[]);
        events.hideLoader();
        events.saveOldSquad(challenge.squad,false);
        
    }
    //阵容智能填充
    events.getTemplate = async function(e,type,sId){
        e.setInteractionState(0);
        let squadPos = e.challenge.squad.getFieldPlayers().map(i => { return i.isBrick() ? null : i.getGeneralPosition()});
        events.showLoader();
        events.changeLoadingText("loadingclose.template1");
        info.base.template = true;
        events.notice("notice.templateload",1);
        let planCount = 0;
        let resultSquad = [];
        let resultCount = 0;
        let resultValue = 0;
        let resultId = 0;
        let refePlan = [];
        if(type == 1){

            let list = await getSbcSquad(e.challenge.id,type);
            if(list && list.length == 0){
                return;
            }
            refePlan = list.slice(0, 5).map(item => item.id);
        }else{
            refePlan.push(sId);
        }
        for (let planId of refePlan) {
            planCount++;
            events.changeLoadingText(["loadingclose.template2",`${planCount}`,`${refePlan.length - planCount}`]);
            if(!info.base.template){return};
            let planSquad = await getSbcSquad(planId,type == 1 ? 2 : type);
            let ownedPlayer = 0;
            let surplusValue = 0;
            let createSquad = new Array(11);
            let copySquadPos = JSON.parse(JSON.stringify(e.challenge.squad.getFormation().generalPositions));
            for (let i = 0; i < createSquad.length; i++) {
                let formationId = e.challenge.squad.getFormation().id;
                let posIndex = i;
                if(formationId in info.formation){
                    posIndex = copySquadPos.lastIndexOf(info.formation[formationId][i]);
                    copySquadPos[posIndex] = null;
                }
                if(type == 3){
                    if("data" in planSquad && "activeGroupPositions" in planSquad.data && i in planSquad.data.activeGroupPositions){
                        let player = new UTItemEntity();
                        player.definitionId = planSquad.data.activeGroupPositions[i].playerEaId;
                        player.stackCount = 1;
                        let cachePlayer = events.getItemBy(2,{"definitionId":player.definitionId})[0];
                        if(cachePlayer){
                            player.id = cachePlayer.id;
                            player.concept = false;
                        }else{
                            player.id = player.definitionId;
                            player.concept = true;
                        }
                        createSquad[posIndex] = player;
                    }else{
                        createSquad[posIndex] = null;
                    }
                }else{
                    let planIndex = `cardlid${11 - i}`;
                    if(squadPos[posIndex] !== null){
                        if(planIndex in planSquad){
                            let player = new UTItemEntity();
                            let planPlayer = planSquad[planIndex];
                            player.definitionId = planPlayer.Player_Resource;
                            player.stackCount = 1;
                            let cachePlayer = events.getItemBy(2,{"definitionId":planPlayer.Player_Resource})[0];
                            if(cachePlayer){
                                player.id = cachePlayer.id;
                                player.concept = false;
                                ownedPlayer++;
                            }else{
                                player.id = planPlayer.Player_Resource;
                                player.concept = true;
                                surplusValue += planPlayer.price;
                            }
                            createSquad[posIndex] = player;
                        }else{
                            createSquad[posIndex] = null;
                        }
                    }else{
                        createSquad[posIndex] = null;
                    }
                }
            }
            //console.log(`阵容效果：`,createSquad,`拥有球员：`,ownedPlayer,`剩余需花费：`,surplusValue,`阵容id:`,planId)
            if(resultSquad.length == 0 || surplusValue < resultValue || (surplusValue == resultValue && ownedPlayer > resultCount)){
                resultSquad = createSquad;
                resultCount = ownedPlayer;
                resultValue = surplusValue;
                resultId = planId;
            }
        }
        console.log(`最终结果：阵容：`,resultSquad,`拥有球员：`,resultCount,`剩余需花费：`,resultValue,`阵容id:`,resultId)
        if(!info.base.template){return};
        await events.saveSquad(e.challenge,e.challenge.squad,resultSquad,resultSquad.map(i => {if(i && !info.roster.data.hasOwnProperty(i.definitionId)){return i.definitionId}}).filter(Boolean));
        events.saveOldSquad(e.challenge.squad,false)
    }
    //阵容方案保存

    events.saveSquad = async(c,s,l,a) => {
        info.base.savesquad = true;
        s.removeAllItems();
        s.setPlayers(l, true);
        await services.SBC.saveChallenge(c).observe(
            this,
            async function (z, d) {
                if (!d.success) {
                    events.notice("notice.templateerror",2);
                    s.removeAllItems();
                    info.base.savesquad = false;
                    events.hideLoader();
                }
                services.SBC.loadChallengeData(c).observe(
                    this,
                    async function (z, {response:{squad}}) {
                        events.hideLoader();
                        let ps = squad._players.map((p) => p._item);
                        c.squad.setPlayers(ps, true);
                        c.onDataChange.notify({squad});
                        info.base.savesquad = false;
                        if(isPhone() && cntlr.current().className !== "UTSBCSquadOverviewViewController"){
                            setTimeout(() => {
                                cntlr.current()._parentViewController._eBackButtonTapped()
                            },500);
                        }
                        events.notice("notice.templatesuccess",0);
                        events.loadPlayerPrice(a);
                        let view = isPhone() ? cntlr.current().getView() : cntlr.left().getView();
                        console.log(view._interactionState)
                        if(!view._interactionState){
                            view.setInteractionState(!0)
                        }
                    }
                );
            }
        );
        
    }
    UTSBCService.prototype.loadChallengeData = function (r) {
        var s = this,
            a = new EAObservable();
        return (
            this.sbcDAO
            .loadChallenge(r.id, r.isInProgress())
            .observe(this, function (t, e) {
                t.unobserve(s);
                a.notify(e);
            }),
            a
        );
    };
    function getSbcSquad(i,t){
        let p = info.base.platform == "pc" ? "PC" : "PS";
        let u = t == 1 ? `https://www.futbin.org/futbin/api/getChallengeTopSquads?chal_id=${i}&platform=${p}` : t == 2 ? `https://www.futbin.org/futbin/api/getSquadByID?squadId=${i}` : `https://www.fut.gg/api/squads/${i}`;
        return new Promise(res => {
            GM_xmlhttpRequest({
                method:"GET",
                url:u,
                headers: {
                    "Content-type": "application/json"
                },
                onload:function(response){
                    if(response.status == 404 || response.status == 401){
                        events.notice("notice.loaderror",2);
                        events.hideLoader();
                    }else{
                        let data = JSON.parse(response.response)[t == 2 ? "squad_data" : "data"];
                        if(data){
                            res(data)
                        }else{
                            events.notice("notice.squaderror",2);
                            events.hideLoader();
                        }
                    }
                },
                onerror: function(error) {
                    console.error('请求出错:', error);
                    events.notice("notice.loaderror",2);
                    events.hideLoader();
                }
            })
        })
    };

    UTAppSettingsView.prototype._generate = function (...args) {
        if (!this._generated) {
            call.view.setting.call(this,...args)
            let g = document.createElement("div");
            g.classList.add("ut-button-group");
            this._fsuSet = events.createButton(
                new UTGroupButtonControl(),
                `FSU ${services.Localization.localize("button.settings")}`,
                async(e) => {
                    var n = cntlr.current().getNavigationController();
                    if(n){
                        var t = new fsuSC();
                        n.pushViewController(t);
                    }
                },
                "more"
            )
            g.appendChild(this._fsuSet.getRootElement());
            this.__topGroup.after(g);
        }
    }
    
    //球员挂拍卖
    events.playerToAuction = async (d,p) =>{
        let i = services.Item.itemDao.itemRepo.transfer.get(d) || services.Item.itemDao.itemRepo.unassigned.get(d) || services.Item.itemDao.itemRepo.club.items.get(d);
        let t = services.Item.itemDao.itemRepo.transfer._collection.hasOwnProperty(d);
        if(i){
            if((repositories.Item.getPileSize(ItemPile.TRANSFER) - repositories.Item.numItemsInCache(ItemPile.TRANSFER) > 0 || t) && p){
                await events.playerGetLimits(i);
                if(i.hasPriceLimits()){
                    if(p < i._itemPriceLimits.minimum || p > i._itemPriceLimits.maximum){
                        events.notice(["notice.auctionlimits",i._staticData
                        .name],2)
                        return;
                    }
                }
                let lp = UTCurrencyInputControl.getIncrementBelowVal(p);
                await services.Item.list(i,lp,p,3600).observe(cntlr.current(), async (e,t) => {
                    if (e.unobserve(cntlr.current()),t.success){
                        events.notice(["notice.auctionsuccess",i._staticData.name,p],0)
                    }else{
                        let ix = t.error ? t.error.code : t.status;
                        if (NetworkErrorManager.checkCriticalStatus(ix))
                            NetworkErrorManager.handleStatus(ix);
                        else {
                            let o = void 0;
                            switch (ix) {
                            case HttpStatusCode.FORBIDDEN:
                                o = "popup.error.list.forbidden.message";
                                break;
                            case UtasErrorCode.PERMISSION_DENIED:
                                o = "popup.error.list.PermissionDenied";
                                break;
                            case UtasErrorCode.STATE_INVALID:
                                o = "popup.error.list.InvalidState";
                                break;
                            case UtasErrorCode.DESTINATION_FULL:
                                o = "popup.error.tradetoken.SellItemTradePileFull";
                                break;
                            case UtasErrorCode.CARD_IN_TRADE:
                                o = "popup.error.tradetoken.ItemInTradeOffer";
                                break;
                            default:
                                o = "popup.error.list.InvalidState"
                            }
                            services.Notification.queue([services.Localization.localize(o), UINotificationType.NEGATIVE])
                        }
                    }
                })
                
            }else{
                events.notice("notice.auctionmax",2)
                return false;
            }
        }else{
            events.notice(["notice.auctionnoplayer",d],2)
        }
    }

    //重置拍卖行信息
    events.playerGetLimits = async(i) => {
        return new Promise((resolve) => {
            if (i.hasPriceLimits()) {
                resolve();
              return;
            }
            services.Item.requestMarketData(i).observe(
                this,
                async function (sender, response) {
                    resolve();
                }
            );
        });
    }

    UTSelectItemFromClubViewController.prototype.updateItemList = function(t) {
        call.plist.clubSelectItem.call(this,t)
        //填充状态重置为0判断
        if(this._parentViewController._fsuFillType){
            if(this._parentViewController._fsuFillType%2){
                this._parentViewController._fsuFillType++;
                if(t.length == 0){
                    events.notice("notice.noplayer",2);
                    services.Item.itemDao.itemRepo.unassigned.reset();
                }
            }
        }
    }

    call.squad = {
        "setPlayers":UTSquadEntity.prototype.setPlayers,
        "swapPlayers":UTSquadEntity.prototype.swapPlayersByIndex,
        "addItem":UTSquadEntity.prototype.addItemToSlot,
        "removeItem":UTSquadEntity.prototype.removeItemFromSlot,
        "removeAll":UTSquadEntity.prototype.removeAllItems,
        "submitted":UTSBCSquadOverviewViewController.prototype._onChallengeSubmitted,
        "requirements":UTSBCChallengeRequirementsView.prototype.renderChallengeRequirements
    }



    //SBC阵容默契读取程序
    UTSBCChallengeRequirementsView.prototype.renderChallengeRequirements = function(n, r) {
        call.squad.requirements.call(this,n,r)
        setTimeout(() => {
            if(cntlr.current().className.includes("UTSBCSquad")){
                let view = this;
                let ratingEligibility = n.eligibilityRequirements.filter((i) => i.getFirstKey() == 19);
                let requests = [];
                n.eligibilityRequirements.forEach(function(item,index){
                    let eKey = item.getFirstKey();
                    let eValue = item.getValue(eKey);
                    let criteria = {};
                    let requestObject = {};
                    switch (eKey) {
                        case 12:
                            criteria.teamId = eValue;
                            break;
                        case 11:
                            criteria.leagueId = eValue;
                            break;
                        case 10:
                            criteria.nationId = eValue;
                            break;
                        case 18:
                            criteria.rareflag = eValue;
                            break;
                        default:
                            break;
                    }
                    if(Object.keys(criteria).length >= 1 && "__requirements" in view){
                        if(ratingEligibility.length){
                            criteria.GTrating = ratingEligibility[0].getFirstValue(19) - 10;
                        }
                        let eLi = view.__requirements.querySelectorAll("li")[index];
                        let but =  events.createButton(
                            new UTImageButtonControl(),
                            "",
                            (e) => {
                                events.SBCSetRatingPlayers(e);
                            },
                            "filter-btn fsu-eligibilitysearch"
                        )
                        but.getRootElement().setAttribute("data-r",`eligibilitysearch`);
                        criteria.lock = false;
                        but.criteria = criteria;
                        eLi.style.paddingRight = "2rem";
                        eLi.appendChild(but.getRootElement())
                        requestObject.criteria = criteria;
                        requestObject.value = item;
                        requestObject.name = events.requirementsToText(item);
                        requests.push(requestObject);
                    }
                })
                if(requests.length){
                    n.squad._fsuRequests = requests;
                }
            }
        },50);
    }
    UTSquadEntity.prototype.swapPlayersByIndex = function(t, e) {
        call.squad.swapPlayers.call(this,t,e)
        events.saveOldSquad(this,true)
    }
    UTSquadEntity.prototype.addItemToSlot = function(t, e) {
        call.squad.addItem.call(this,t,e)
        if(this.isSBC()){
            let op = this._fsuOldSquad[this._fsuOldSquadCount][t];
            if(op.definitionId == e.definitionId && op.concept == true){
                this._fsuOldSquad[this._fsuOldSquadCount][t] = e;
            }else{
                events.saveOldSquad(this,true)
            }
        }
    }
    UTSquadEntity.prototype.removeItemFromSlot = function(t) {
        call.squad.removeItem.call(this,t)
        events.saveOldSquad(this,true)
    }
    UTSquadEntity.prototype.removeAllItems = function(t) {
        call.squad.removeAll.call(this,t)
        events.saveOldSquad(this,true)
    }
    UTSquadEntity.prototype.setPlayers = function(t, e) {
        call.squad.setPlayers.call(this,t,e)
        events.saveOldSquad(this,true)
    }

    //读取阵容保存
    events.saveOldSquad = (s,t,c) => {
        if(s.isSBC() && (!info.base.savesquad || !t)){
            if(!s.hasOwnProperty("_fsuOldSquad") || c){
                s._fsuOldSquad = [];
                s._fsuOldSquadCount = -1;
            }
            let pl = s.getPlayers().map(i => { return i.getItem()});
            if(s._fsuOldSquadCount == -1 || s._fsuOldSquad[s._fsuOldSquadCount].map( i => { return i.id}).join() !== pl.map( i => { return i.id}).join()){
                //console.log("保存阵容",s._fsuOldSquadCount,pl);
                s._fsuOldSquadCount++;
                s._fsuOldSquad.push(pl);
                if(isPhone() && cntlr.current().className == "UTSquadItemDetailsNavigationController"){
                    setTimeout(() => {
                        cntlr.current()._parentViewController._eBackButtonTapped()
                    },500);
                }
            }
        }
    }
    events.getRatingPlayers = (squad,eligibility,ratings) => {
        let playerlist = [],ratingsList = ratings ? Array.from(ratings) : [];
        let Exclusionlist = squad.getPlayers().map((i => {if( i.item.rating && !i.item.concept){return i.item.databaseId}})).filter(Boolean);
        let formation = squad.getFormation();
        let eligibilityChemistry = 0;
        for (let i of eligibility) {
            if(i.getFirstKey() == 35){
                eligibilityChemistry = i.getFirstValue(35);
            }
        }
        let buildSquad = formation.generalPositions.concat(Array(12).fill(-1));
        let manager = squad.getManager().item;
        let criteria = {"NEdatabaseId":Exclusionlist,"NEleagueId":info.build.league ? info.set.shield_league : [],"NErareflag":info.build.rare ? 3 : -1,"lock":false};
        if(info.build.untradeable){
            criteria["untradeable"] = true;
        }
        buildSquad.forEach(function(e, t) {
            let i = squad ? squad.getSlot(t) : null;
            let player = i.getItem();
            if(i && !i.isBrick()){
                if(i.isValid()){
                    //有填充的
                    if(player.concept){
                        //幻想球员
                        let need = JSON.parse(JSON.stringify(criteria));
                        need.rating = player.rating;
                        if(eligibilityChemistry || !info.build.ignorepos){
                            need.bepos = i.getGeneralPosition()
                        }
                        let shortlist = events.getItemBy(2,need,repositories.Item.getUnassignedItems());
                        if(shortlist.length){
                            if(eligibilityChemistry){
                                for (let p of shortlist) {
                                    let fieldPlayers = squad.getFieldPlayers().map(function(t) {return t.item});
                                    playerlist.forEach(function(e, t) {
                                        fieldPlayers[t] = e;
                                    })
                                    fieldPlayers[t] = p;
                                    if(squad.chemCalculator.calculate(formation, fieldPlayers, manager).chemistry >= eligibilityChemistry){
                                        Exclusionlist.push(p.databaseId);
                                        playerlist.push(p);
                                        return;
                                    }
                                }
                            }else{
                                Exclusionlist.push(shortlist[0].databaseId);
                                playerlist.push(shortlist[0]);
                                return;
                            }
                        }
                    }
                }else{
                    //没有填充是空位
                    if(ratingsList.length){
                        //还有填充评分
                        let target;
                        if(ratings.length == 1){
                            target = ratingsList[0];
                        }else{
                            target = ratingsList.shift();
                        }
                        let need = JSON.parse(JSON.stringify(criteria));
                        if(!info.build.ignorepos && e !== -1){
                            need.bepos = i.getGeneralPosition()
                        }
                        if(/^\d{2}$/.test(target)){
                            need.rating = Number(target);
                        }else if(/^\d{2}\+$/.test(target)){
                            need.GTrating = Number(target.replace(/\D/g, ""));
                        }else if(/^\d{2}\-$/.test(target)){
                            need.LTrating = Number(target.replace(/\D/g, ""));
                        }else if(/^\d{2}\-\d{2}$/.test(target)){
                            need.BTWrating = target.split("-").map(x => parseInt(x));
                        }
                        let shortlist = events.getItemBy(2,need,services.Item.itemDao.itemRepo.getUnassignedItems());
                        if(shortlist.length){
                            playerlist.push(shortlist[0]);
                            Exclusionlist.push(shortlist[0].databaseId);
                            return;
                        }
                    }
                }
            }
            playerlist.push(player);
        });
        console.log(playerlist)
        return playerlist;
        // let ea = s.getPlayers().map((i => {if( i.item.rating && !i.item.concept){return i.item.databaseId}})).filter(Boolean),
        // fp = s.getPlayers().map( i => {if(!i.isBrick()){return i.item}}),
        // ra = r ? Array.from(r) : []
        // ,rpl = [];
        // for (let i of fp) {
        //     let ri = i,sr = 0;
        //     if(ri){
        //         if(ri.concept){
        //             sr = i.rating;
        //         }else if(ri.rating == 0 && ra.length){
        //             if(r.length == 1){
        //                 sr = ra[0];
        //             }else{
        //                 sr = ra.shift();
        //             }
        //         }
        //     }else if(ra.length){
        //         if(r.length == 1){
        //             sr = ra[0];
        //         }else{
        //             sr = ra.shift();
        //         }
        //     }
            
        //     if(sr){
                
        //         if(/^\d{2}$/.test(sr)){
        //             criteria["rating"] = Number(sr);
        //         }else if(/^\d{2}\+$/.test(sr)){
        //             criteria["GTrating"] = Number(sr.replace(/\D/g, ""));
        //         }else if(/^\d{2}\-$/.test(sr)){
        //             criteria["LTrating"] = Number(sr.replace(/\D/g, ""));
        //         }else if(/^\d{2}\-\d{2}$/.test(sr)){
        //             criteria["BTWrating"] = sr.split("-").map(x => parseInt(x));
        //         }
        //         let tp = events.getItemBy(2,criteria,services.Item.itemDao.itemRepo.getUnassignedItems());
        //         if(tp.length){
        //             ri = tp[0];
        //             ea.push(tp[0].databaseId);
        //         }
        //     }
        //     console.log(ri.databaseId)
        //     rpl.push(ri)
        // }
        // return rpl;
    }

    //未分配名单读取
    UTUnassignedTileView.prototype.setNumberOfItems = function(e) {
        call.other.uaTile.call(this,e)
        let ball = this.__root.querySelectorAll('.btn-standard');
        ball.forEach(b => b.remove());
        let type = 1;
        let item = _.filter(repositories.Item.getUnassignedItems(), item => {
            const repeat = events.getItemBy(1, { id: item.duplicateId });
            if(repeat.length === 0 && item.isDuplicate() && info.base.state){
                type = 2;
            }
            return (item.isPlayer() && repeat.length === 0) || (!item.isPlayer() && !item.isDuplicate() && !item.isMiscItem());
        });
        if(item.length && info.set.player_uatoclub && info.base.state){
            let b = events.createButton(
                new UTStandardButtonControl(),
                fy(["uatoclub.btntext",item.length]),
                (e) => {
                    e.setInteractionState(0);
                    async function setUnassignedToClub(items){
                        await events.wait(0.2,0.5)
                        console.log(items)
                        services.Item.move(items,ItemPile.CLUB).observe(cntlr.current(),(a, b) => {
                                if (a.unobserve(cntlr.current()), b.success) {
                                    events.notice("uatoclub.success",0)
                                    if(cntlr.current().className == 'UTStoreHubViewController'){
                                        cntlr.current().getUnassignedItems();
                                    }else if(cntlr.current().className == 'UTHomeHubViewController'){
                                        cntlr.current()._nUnassignedItemAdded()
                                    }else if(cntlr.current().className == 'UTStorePackViewController'){
                                        if(repositories.Item.getUnassignedItems().length){
                                            e._parent.setNumberOfItems(repositories.Item.getUnassignedItems().length);
                                            e.hide()
                                        }else{
                                            e._parent.hide()
                                        }
                                    }else{
                                        services.Item.requestUnassignedItems()
                                    }
                                } else {
                                    events.notice("uatoclub.error",2)
                                }
                            }
                        );
                    }
                    if(e._fsuType == 1){
                        setUnassignedToClub(e._fsuItem)
                    }else{
                        services.Item.itemDao.itemRepo.unassigned.reset();
                        services.Item.requestUnassignedItems().observe(cntlr.current(), (p, t) => {
                            p.unobserve(cntlr.current());
                            if(t.success){
                                let defIds = _.map(e._fsuItem,"definitionId")
                                console.log(_.filter(t.response.items,i => _.includes(defIds, i.definitionId)));
                                setUnassignedToClub(_.filter(t.response.items,i => _.includes(defIds, i.definitionId)))
                            }else{
                                events.notice("uatoclub.error",2)
                            }
                        })
                    }
                    console.log(1)
                    e.setInteractionState(1);
                },
                "call-to-action mini"
            )
            b._fsuItem = item;
            b._fsuType = type;
            b._parent = this;
            b.__root.style.marginLeft = "2rem";
            b.__root.style.zIndex = "2";
            this.__label.after(b.__root)
        }
    }
    UTStoreView.prototype.setPacks = function(e, t, i, o) {
        call.other.store.setPacks.call(this,e, t, i, o)
        setTimeout(() => {
            let viewmodel = cntlr.current().viewmodel,
            packTileExists = "_fsuPackTile" in this,
            SBCTileExists = "_fsuSBCTile" in this,
            packFilter = "_fsufilter" in this,
            unassignedTile = "_fsuUnassignedTile" in this,
            itemListElement = this.__itemList,
            unassignedItems = repositories.Item.getUnassignedItems().length,
            HideAndShow = this.getStoreCategory() == 'mypacks';
            if(HideAndShow){
                this.storePacks.forEach((item) => {
                    if(info.base.packcoin.hasOwnProperty(item.articleId) && !item.getRootElement().querySelector(".fsu-packprice")){
                        let packCoinBox = document.createElement("p");
                        packCoinBox.classList.add("ut-store-pack-details-view--description","currency-coins","fsu-packprice");
                        packCoinBox.textContent = `${fy("packcoin.text")}${info.base.packcoin[item.articleId].toLocaleString()}`;
                        item.__articleDesc.parentNode.insertBefore(packCoinBox, item.__articleDesc)
                    }
                })
                if(e.length){
                    let filterOptionCount = {};
                    for (const i of e) {
                        if(i.id in filterOptionCount){
                            filterOptionCount[i.id].count++;
                        }else{
                            filterOptionCount[i.id] = {
                                count:1,
                                name:services.Localization.localize(i.packName),
                                value:info.base.packcoin.hasOwnProperty(i.id) ? info.base.packcoin[i.id] : 0
                            };
                        }
                    }
                    this._fsufilterOptionCount = filterOptionCount;
                }
            }
            
            if(packFilter){
                if(this.getStoreCategory() == "mypacks" && e.length){
                    this._fsufilter.style.display = "flex";
                    let filterOptionId = this._fsufilterOption.getId();
                    let filterOptionArray = [];
                    let filterStart = 2;
                    let tradeableCount = this.__itemList.querySelectorAll(".is-tradeable").length;
                    let packTotal = _.sumBy(_.values(this._fsufilterOptionCount), 'count');
                    let packValue = _.sum(_.map(this._fsufilterOptionCount,(i) => { return i.count * i.value}));
                    filterOptionArray.push(new UTDataProviderEntryDTO(-1,-1,fy(`sbc.filter0`)))
                    filterOptionArray.push(new UTDataProviderEntryDTO(0,0,fy([`packfilter.total`,packTotal,packValue.toLocaleString()])))
                    if(tradeableCount){
                        filterOptionArray.push(new UTDataProviderEntryDTO(1,1,`${fy(`pack.filter0`)}×${tradeableCount}`))
                        filterStart = 3;
                    }
                    for (const key in this._fsufilterOptionCount) {
                        const value = this._fsufilterOptionCount[key];
                        let dto = new UTDataProviderEntryDTO(Number(key),Number(key),`${value.name}×${value.count}`)
                        filterOptionArray.splice(filterStart, 0, dto);
                    }

                    this._fsufilterOption.setOptions(filterOptionArray);
                    if(filterOptionId in this._fsufilterOptionCount){
                        this._fsufilterOption.setIndexById(filterOptionId)
                    }else{
                        this._fsufilterOption.setIndexById(filterOptionId == 1 ? 1 : -1)
                    }
                }else{
                    this._fsufilter.style.display = "none";
                }
            }else{
                if(e.length){
                    let filterOptionArray = [];
                    let filterOption = new UTDropDownControl();
                    let filterStart = 2;
                    let tradeableCount = this.__itemList.querySelectorAll(".is-tradeable").length;
                    let packTotal = _.sumBy(_.values(this._fsufilterOptionCount), 'count');
                    let packValue = _.sum(_.map(this._fsufilterOptionCount,(i) => { return i.count * i.value}));
                    filterOptionArray.push(new UTDataProviderEntryDTO(-1,-1,fy(`sbc.filter0`)))
                    filterOptionArray.push(new UTDataProviderEntryDTO(0,0,fy([`packfilter.total`,packTotal,packValue.toLocaleString()])))
                    if(tradeableCount){
                        filterOptionArray.push(new UTDataProviderEntryDTO(1,1,`${fy(`pack.filter0`)}×${tradeableCount}`))
                        filterStart = 3;
                    }
                    for (const key in this._fsufilterOptionCount) {
                        const value = this._fsufilterOptionCount[key];
                        let dto = new UTDataProviderEntryDTO(Number(key),Number(key),`${value.name}×${value.count}`)
                        filterOptionArray.splice(filterStart, 0, dto);
                    }
                    filterOption.init();
                    filterOption.setOptions(filterOptionArray);
                    filterOption._parent = this;
                    filterOption.addTarget(filterOption, (e) => {
                        let filterId = e.getId();
                        if(filterId == 0){
                            e.setIndex(0);
                            return;
                        }
                        e._parent.storePacks.forEach((i) => {
                            if(i.articleId == filterId || filterId == -1 || (filterId == 1 && i.getRootElement().classList.contains('is-tradeable'))){
                                i.show();
                            }else{
                                i.hide();
                            }
                            if(filterId == -1){
                                e._parent.__itemList.addEventListener(EventType.SCROLL, e._parent.debounceCallback, !1)
                            }else{
                                e._parent.__itemList.removeEventListener(EventType.SCROLL, e._parent.debounceCallback, !1)
                            }
                        })
                    }, EventType.CHANGE);
                    this._fsufilterOption = filterOption;
                    this._fsufilter = events.createElementWithConfig("div",{
                        classList:["fsu-sbcfilter-box"],
                        style:{
                            zIndex:"3"
                        }
                    })
                    let filterOptionBox = events.createElementWithConfig("div",{
                        classList:["fsu-sbcfilter-option"]
                    })
                    let filterText = events.createElementWithConfig("div",{
                        textContent:fy(`sbc.filtert`)
                    })
                    filterOptionBox.appendChild(filterText);
                    filterOptionBox.appendChild(this._fsufilterOption.__root);
                    this._fsufilter.appendChild(filterOptionBox);
                    let targetElement = this._navigation.getRootElement();
                    targetElement.parentNode.insertBefore(this._fsufilter, targetElement.nextSibling);
                    this._fsufilter.style.display = HideAndShow ? "flex" : "none";
                }
            }
            if(packTileExists || SBCTileExists){
                if(packTileExists){
                    this._fsuPackTile.setInteractionState(0);
                    events.setPackTileText(this._fsuPackTile);
                    this._fsuPackTile[HideAndShow ? 'show' : 'hide']();
                }
                if(SBCTileExists){
                    this._fsuSBCTile.setInteractionState(0);
                    events.judgmentSbcCount(this._fsuSBCTile);
                    this._fsuSBCTile[HideAndShow ? 'show' : 'hide']();
                }
            }else{
                let tileBox = document.createElement("div");
                tileBox.classList.add("ut-store-bundle-details-view");
                tileBox.style.cssText = "display: flex;background: none; border: none; justify-content: space-between;";
                let tileStyle = info.set.info_packagain && info.set.info_sbcagain ? `margin:0;` : `margin:0;flex-basis: 100%;max-width: 100%;`,
                tileClass = info.set.info_packagain && info.set.info_sbcagain ? "col-1-2" : "col-1-1";
                if(info.set.info_packagain){
                    let packTile = events.createTile(
                        fy("douagain.packtile.title"),
                        fy("douagain.packtile.text"),
                        (e) => {
                            let current = cntlr.current();
                            let pack = current.viewmodel.getPacks('mypacks').filter(i => i.id == info.douagain.pack).pop();
                            current.eOpenPack(
                                current.getView(),
                                UTStorePackDetailsView.Event.OPEN,
                                {"articleId":pack.id,"tradable":pack.tradable}
                            )
                        }
                    )
                    packTile.__root.classList.remove("col-1-3");
                    packTile.__root.classList.add(tileClass,"fsu-store-tile");
                    packTile.__root.style.cssText = tileStyle;
                    packTile[HideAndShow ? 'show' : 'hide']();
                    events.setPackTileText(packTile);
                    tileBox.appendChild(packTile.__root);
                    this._fsuPackTile = packTile;
                    this._fsuPackTile[HideAndShow ? 'show' : 'hide']();
                }
                if(info.set.info_sbcagain){
                    let sbcTile = events.createTile(
                        fy("douagain.sbctile.title"),
                        fy("douagain.sbctile.text"),
                        (e) => {
                            if(info.douagain.sbc){
                                events.goToSBC(services.SBC.repository.getSetById(info.douagain.sbc));
                            }else{
                                events.notice("douagain.error",2);
                            }
                        }
                    )
                    sbcTile.__root.classList.remove("col-1-3");
                    sbcTile.__root.classList.add(tileClass,"fsu-store-tile");
                    sbcTile.__root.style.cssText = tileStyle;
                    sbcTile[HideAndShow ? 'show' : 'hide']();
                    sbcTile.setInteractionState(0);
                    events.judgmentSbcCount(sbcTile);
                    tileBox.appendChild(sbcTile.__root);
                    this._fsuSBCTile = sbcTile;
                    this._fsuSBCTile[HideAndShow ? 'show' : 'hide']();
                }
                if(info.set.info_packagain || info.set.info_sbcagain){
                    itemListElement.insertBefore(tileBox, itemListElement.firstChild);
                }
            }
            if(!unassignedTile && unassignedItems){
                let tileBox = document.createElement("div");
                tileBox.classList.add("ut-store-pack-details-view");
                tileBox.style.padding = 0;
                let uTile = new UTUnassignedTileView();
                uTile.getRootElement().style.margin = 0;
                tileBox.appendChild(uTile.getRootElement());
                uTile.init();
                uTile.setNumberOfItems(unassignedItems);
                this._fsuUnassignedTile = uTile;
                this._fsuUnassignedTile.addTarget(
                    this._fsuUnassignedTile,
                    (e) => {
                        TelemetryManager.trackEvent(TelemetryManager.Sections.STORE, TelemetryManager.Categories.BUTTON_PRESS, "Store - Unassigned Tile"),
                        cntlr.current().gotoUnassigned()
                    },
                    EventType.TAP
                )
                itemListElement.insertBefore(tileBox, itemListElement.firstChild);
            }
            if(unassignedTile){
                if(unassignedItems){
                    this._fsuUnassignedTile.setNumberOfItems(unassignedItems);
                    this._fsuUnassignedTile.show();
                }else{
                    this._fsuUnassignedTile.hide();
                }
            }
        }, 50)
    }
    //计算总评的公式
    events.needRatingsCount = (squad,target) => {
        let ratings = _.map(_.filter(squad.getFieldPlayers(),(i) => { return i.item.isValid()}),"item.rating"),
            brick = squad.getAllBrickIndices().length,
            ratingId = _.map(_.filter(squad.getFieldPlayers(),(i) => { return i.item.isValid()}),"item.databaseId"),
            criteria = {"NEdatabaseId":ratingId,"NEteamId":114605,"NEleagueId":2118,lock:false},
            lackNumber = 11 - brick - ratings.length,
            basisRating = 0,
            result = [],
            fillNumber = 5;
        if(info.build.league){
            criteria["NEleagueId"] = info.set.shield_league;
        }
        if(info.build.rare){
            criteria["NErareflag"] = 3;
        }
        if(info.build.untradeable){
            criteria["untradeable"] = true;
        }
        let haveRatingsOriginal = _.map(events.getItemBy(2,criteria), 'rating'),
            haveRatingsCount = _.countBy(haveRatingsOriginal),
            haveRatings = _.uniq(haveRatingsOriginal).sort((a, b) => b - a),
            lackSimulation = Array.from({length: haveRatings.length}, (_e, i) => Array.from({length: lackNumber}, () => haveRatings[i]));
        if(lackNumber <= 3){
            fillNumber = 9;
        }else if(lackNumber == 4){
            fillNumber = 8;
        }else if(lackNumber == 5){
            fillNumber = 7;
        }else if(lackNumber == 6){
            fillNumber = 6;
        }
        let fillOffset = Math.floor(fillNumber/2) - 1;
        _.flatMap(lackSimulation,(i) => {
            if(events.teamRatingCount(_.concat(ratings,i)) >= target && i.length){
                basisRating = i[0];
            }
        })
        let simulated = _.multicombinations(_.slice(haveRatings,_.indexOf(haveRatings, basisRating) - fillOffset,_.indexOf(haveRatings, basisRating) + fillNumber - fillOffset), lackNumber),
        totalValue = 0,
        sumRating = 0,
        score = 0;
        _.flatMap(simulated,(i) => {
            let simulatedCount = events.teamRatingCount(_.concat(ratings,i));
            if(simulatedCount >= target){
                let simulatedSumRating = _.sum(i);
                let simulatedSatisfy = true;
                let simulatedTotalValue = _.sum(_.flatMap(_.countBy(i),(value, key) => {
                    let result = 1,
                    priceKey = parseInt(key),
                    minPriceRating = Math.min(...Object.keys(info.base.price)),
                    maxPriceRating = Math.max(...Object.keys(info.base.price));
                    if(priceKey < minPriceRating){
                        result = priceKey < 70 ? 300 : 400;
                    }else if(priceKey > maxPriceRating){
                        result = parseInt(info.base.price[maxPriceRating].p);
                        _.times(priceKey - maxPriceRating, () => {
                            result *= 1.5;
                        });
                    }else{
                        result = parseInt(info.base.price[priceKey].p);
                    }
                    if(haveRatingsCount[priceKey] < value){
                        simulatedSatisfy = false;
                    }
                    return result * value;
                }))
                if(((totalValue == 0 || simulatedTotalValue < totalValue) || (simulatedTotalValue == totalValue && simulatedSumRating < sumRating)) && simulatedSatisfy){
                    result = i;
                    score = simulatedCount;
                    totalValue = simulatedTotalValue;
                    sumRating = simulatedSumRating;
                }
            }
        })
        return [result,totalValue,score]
    }
    events.teamRatingCount = (ratings) => {
        let results = 0;
        let sum = _.sum(ratings);
        let avg = sum / 11;
        _.flatMap(ratings,function(value, key) {
            if (value > avg) {
                sum += parseFloat(value - avg);
            }
        })
        results = Math.floor(Math.round(sum) / 11);
        if(isNaN(results)){
            results = 0;
        }
        return results;
    }
    events.goToSBC = (SBCSetEntity) => {
        let controller = cntlr.current(),
        view = controller.getView(),
        eventText = UTSBCHubView.Event.TILE_SELECTED,
        r;
        view.setInteractionState(!1);
        services.SBC.requestChallengesForSet(SBCSetEntity).observe(controller, (e, t) => {
            if (e.unobserve(controller),t.success && 0 < t.data.challenges.length){
                if (SBCSetEntity.hidden){
                    r = t.data.challenges[0],
                    services.SBC.loadChallenge(r).observe(controller, (ee,tt) => {
                        if (ee.unobserve(controller),tt.success){
                            var i = controller.getNavigationController();
                            if (i) {
                                if(!SBCSetEntity.getChallenge(r.id).squad){
                                    SBCSetEntity.getChallenge(r.id).update(r);
                                }
                                var o = isPhone() ? new UTSBCSquadOverviewViewController : new UTSBCSquadSplitViewController;
                                o.initWithSBCSet(SBCSetEntity, r.id),
                                i.pushViewController(o)
                            }
                        }else{
                            let n = ee.error && tt.error.code === UtasErrorCode.SERVICE_IS_DISABLED ? "sbc.notification.disabled" : "notification.sbcChallenges.failedToLoad";
                            services.Notification.queue([services.Localization.localize(n), UINotificationType.NEGATIVE])
                        }
                        view.setInteractionState(!0)
                    });
                }else {
                    let i = controller.getNavigationController();
                    if (i) {
                        let o = new UTSBCChallengesViewController;
                        o.initWithSBCSet(SBCSetEntity),
                        i.pushViewController(o, !0)
                    }
                    view.setInteractionState(!0)
                }
            }else if(NetworkErrorManager.checkCriticalStatus(t.status)){
                NetworkErrorManager.handleStatus(t.status);
            }else {
                let n = t.error && t.error.code === UtasErrorCode.SERVICE_IS_DISABLED ? "sbc.notification.disabled" : "notification.sbcChallenges.failedToLoad";
                s.setInteractionState(!0),
                services.Notification.queue([services.Localization.localize(n), UINotificationType.NEGATIVE])
            }
        })
    }
    events.setPackTileText = (packTile) => {
        if(!info.douagain.pack){
            packTile.setInteractionState(0);
            packTile.setDescription(fy("douagain.packtile.text"))
        }else{
            let pack = services.Store.storeDao.storeRepo.myPacks.values().filter(i => i.id == info.douagain.pack);
            if(pack.length){
                packTile.setInteractionState(1);
                packTile.setDescription(`${services.Localization.localize(pack[0].packName)} (${pack.length})`)
            }else{
                packTile.setInteractionState(0);
                packTile.setDescription(fy("douagain.packtile.text"))
            }
        }
    }
    events.judgmentSbcCount = (SBCTile) => {
        if(services.SBC.repository.getSets().length){
            events.setSbcTileText(SBCTile);
        }else{
            services.SBC.requestSets().observe(this, (e, t) => {
                if (e.unobserve(this),
                t.success) {
                    events.setSbcTileText(SBCTile);
                } else if (NetworkErrorManager.checkCriticalStatus(t.status))
                    NetworkErrorManager.handleStatus(t.status);
                else {
                    var o = t.error && t.error.code === UtasErrorCode.SERVICE_IS_DISABLED ? "sbc.notification.disabled" : "notification.sbcSets.failedToLoad";
                    services.Notification.queue([services.Localization.localize(o), UINotificationType.NEGATIVE]);
                }
            })
        }
    }
    events.setSbcTileText = (SBCTile) => {
        let SBC = services.SBC.repository.getSetById(info.douagain.sbc),
        SBCCountText = "";
        if(SBC){
            if(SBC.isComplete()){
                info.douagain.sbc = 0;
            }else{
                if(!SBC.isSingleChallenge){
                    if(!SBC.timesCompleted){
                        SBCTile.setInteractionState(1);
                    }else{
                        if(SBC.challengesCount > SBC.challengesCompletedCount){
                            SBCCountText = `(${SBC.challengesCompletedCount}/${SBC.challengesCount})`;
                            SBCTile.setInteractionState(1);
                        }else{
                            SBCCountText = `(${fy("douagain.sbctile.state3")})`;
                            SBCTile.setInteractionState(0);
                        }
                    }
                }else{
                    if(SBC.repeats){
                        let residual = SBC.repeats - SBC.timesCompleted;
                        SBCCountText = `(${fy(["douagain.sbctile.state2",residual])})`;
                        if(residual){
                            SBCTile.setInteractionState(1);
                        }else{
                            SBCTile.setInteractionState(0);
                        }
                    }else{
                        SBCCountText = `(${fy(["douagain.sbctile.state1",SBC.timesCompleted])})`;
                        SBCTile.setInteractionState(1);
                    }
                }
                SBCTile.setDescription(`${SBC.name} ${SBCCountText}`);
            }
        }
    }
    //开包动画
    UTPackAnimationViewController.prototype.runAnimation = function() {
        if (!this.running) {
            this.running = !0;
            var e = this.getView()
              , t = services.Configuration.getItemRarity(this.presentedItem);
            e.setPackTier(this.packTier),
            e.generateItem(this.presentedItem);
            if(!info.set.info_skipanimation){
                e.runAnimation(this.presentedItem, t);
            }
            this.animationTimeout = window.setTimeout(this.runCallback.bind(this), info.set.info_skipanimation ? 0 : 4500)
        }
    }
    //开包设置再次开包
    UTStoreViewController.prototype.eOpenPack = function(p, e, t) {
        call.other.store.openPack.call(this,p, e, t)
        let i,d = null === (i = this.viewmodel) || void 0 === i ? void 0 : i.getPackById(t.articleId, e === UTStorePackDetailsView.Event.OPEN, JSUtils.isBoolean(t.tradable) ? t.tradable : void 0);
        if(d.isMyPack){
            if(services.Store.storeDao.storeRepo.myPacks.values().filter(i => i.id == d.id).length > 1){
                info.douagain.pack = d.id;
            }else{
                if(!services.Store.storeDao.storeRepo.myPacks.values().filter(i => i.id == info.douagain.pack).length){
                    info.douagain.pack = 0;
                }
            }
        }
    }
    //获得包和SBC进行存储
    UTSBCSquadOverviewViewController.prototype._onChallengeSubmitted = function _onChallengeSubmitted(e, t) {
        call.squad.submitted.call(this,e,t)
        if(t.success && t.data.setId){
            let s = services.SBC.repository.getSetById(t.data.setId);
            if(s && Object.keys(s).length){
                info.douagain.sbc = t.data.setId;
            }
            //sbc得包不改变快捷开包
            // let p = s.isSingleChallenge ? s.awards.map(i => {if(i.isPack){ return i.value}}).filter(Boolean).pop() : s.getChallenge(t.data.challengeId).awards.map(i => {if(i.isPack){ return i.value}}).filter(Boolean).pop();
            // if(services.Store.storeDao.storeRepo.myPacks.values().filter(i => i.id == p).length){
            //     info.douagain.pack = p;
            // }
        }
    }
    // UTRewardsCarouselView.prototype.generatePackGraphicView = function(t) {
    //     let r = call.other.rewardsPack.call(this,t)
    //     console.log(this,t,r)
    //     if(info.base.packcoin.hasOwnProperty(t.value) && this?.__root){
    //         let packCoinBox = document.createElement("p");
    //         packCoinBox.classList.add("currency-coins");
    //         // this.__root.querySelector(".reward").appendChild(packCoinBox)
    //         console.log(this.__root)
    //     }
    //     return r;
    // }

    UTSelectItemFromClubViewController.prototype.requestItems = function() {
        if(this.clubViewModel.canShowPage() && !this.clubViewModel.shouldRequestItems()){
            this.updateItemList(this.clubViewModel.getPageItems())
        }else{
            let method = true,resultPlayers;
            if(this.squad.isSBC()){
                let searchView = this?.getParentViewController()?.getPreviousController()._view,
                type = this.getParentViewController()._fsuFillType,
                players = _.clone(this.getParentViewController()._fsuFillArray),
                sort = _.split(_.replace(_.toLower(SearchSortID[this.getParentViewController()._fsuFillSort]),"rating","ovr"), '_'),
                range;
                if(searchView && _.isArray(players)){
                    if("_fsuRatLow" in searchView && "_fsuRatHigh" in searchView){
                        range = [searchView._fsuRatLow.getValue(),searchView._fsuRatHigh.getValue()];
                    }else{
                        range =  info.range;
                    }
                    if((range.join("") !== "4699" && type < 3) || (type > 3 && type%2 == 0)){
                        method = false;
                        if(info.range.join("") !== range.join("") && type == 0){
                            info.range = range
                        }
                        if(type < 3){
                            players = events.getDedupPlayers(events.getItemBy(2,{"BTWrating":range}),this.squad.getPlayers())
                        }else if("_fsuFilterBtn" in this.getParentViewController() && "_type" in this.getParentViewController()._fsuFilterBtn && !this.getParentViewController()._fsuFilterBtn_type){
                            players = this.clubViewModel.getItemList();
                        }else{
                            players = players.map(i => {if(i.rating >= range[0] && i.rating <= range[1]){return i}}).filter(Boolean)
                        }
                        let repository = new UTItemRepository();
                        for (const i of players) {
                            repository.set(i.id,i);
                        }
                        resultPlayers = repository.search(this.searchCriteria);
                    }else if(type%2 == 1 && type > 1){
                        method = false;
                        resultPlayers = players;
                    }
                }

                //当未选择位置时出现匹配当前位置的选项
                if(this.searchCriteria.position == "any" && this.getView().pinnedItemView.getRootElement().querySelector(".fsu-chemistryfilter") == null){
                    
                    let originalPlayers = resultPlayers;
                    let pinnedView = this.getView().pinnedItemView.getRootElement();
                    let slotIndex = this.slotIndex;
                    let slotPos =  slotIndex > 10 ? 0 : this.squad.getFormation().getPosition(slotIndex);
                    let filterPlayers = slotIndex > 10 ? originalPlayers : _.filter(originalPlayers, obj => _.includes(obj.possiblePositions, slotPos.typeId));

                    if(filterPlayers && filterPlayers.length && filterPlayers.length < originalPlayers.length){
                        let buttonType = filterPlayers.length < originalPlayers.length;
                        let buttonText = buttonType ? [`chemistrylist.setpos`,slotPos.typeName] : `chemistrylist.setall`;
                        let button = events.createButton(
                            new UTStandardButtonControl(),
                            fy(buttonText),
                            (e) => {
                                e.setInteractionState(0);
                                if(e._type){
                                    e._type = false;
                                    let filterPlayers = _.filter(e._current.clubViewModel.getItemList(), obj => _.includes(obj.possiblePositions, e._pos.typeId));
                                    e._parent._currentController.clubViewModel.resetCollection(filterPlayers);
                                    e._parent._currentController.requestItems();
                                    e.setText(fy(`chemistrylist.setall`));
                                }else{
                                    e._type = true;
                                    e._parent._currentController.clubViewModel.resetCollection(e._parent._fsuFillArray);
                                    e._parent._currentController.requestItems();
                                    e.setText(fy([`chemistrylist.setpos`,e._pos.typeName]));
                                }
                                e.setInteractionState(1);
                            },
                            "btn-standard call-to-action mini fsu-chemistryfilter"
                        )
                        button._type = buttonType;
                        button._criteria = this.searchCriteria;
                        button._pos = slotPos;
                        button._current = this;
                        button._parent = this.getParentViewController();
                        this.getParentViewController()._fsuFilterBtn = button;
                        pinnedView.appendChild(button.getRootElement());
                    }
                }
            }
            
            
            // console.log(this.searchCriteria)
            // console.log(resultPlayers)
            // console.log(range)
            // console.log(method)
            if(method){
                call.other.requestItems.call(this);
            }else{
                this.handleItemRetrieval(resultPlayers,true)
            }
            
        }
    }
    //获得奖励弹窗点击效果
    UTGameRewardsViewController.prototype.onButtonTapped = function(e, t, i) {
        call.other.rewards.popupTapped.call(this,e,t,i)
        if(this.hasPackReward && cntlr.current().className == "UTStorePackViewController" && cntlr.current().getView().getStoreCategory() == 'mypacks'){
            cntlr.current().getStorePacks()
        }
    }
    UTCampaignRewardsCarouselView.prototype.setupRewards = function(e) {
        call.other.rewards.campaign.call(this,e)
        if(e.length){
            const rewardElement = this?.__root?.querySelectorAll(".objective-reward-label");
            if(rewardElement && rewardElement.length == e.length){
                for (let i = 0; i < e.length; i++){
                    let reward = e[i],packCoinValue = info.base.packcoin?.[reward.value];
                    if(reward.isPack && packCoinValue){
                        let packCoin = events.createElementWithConfig("span", {
                            classList: ['currency-coins'],
                            textContent: `${fy("packcoin.text")}${(packCoinValue *  reward.count).toLocaleString()}`,
                        });
                        rewardElement[i].appendChild(document.createElement("br"));
                        rewardElement[i].appendChild(packCoin);
                    }
                }
            }
        }
    }
    events.createElementWithConfig = (tag, config)  => {
        const element = document.createElement(tag);
        Object.keys(config).forEach(key => {
            if (key === 'classList') {
                config[key].forEach(className => element.classList.add(className));
            } else if (key === 'style') {
                Object.keys(config['style']).forEach(styleName => {
                    element.style[styleName] = config['style'][styleName];
                });
            } else {
                element[key] = config[key];
            }
        });
        return element;
    }
    UTCampaignRewardsCarouselView.prototype.setupCampaignRewards = function(e) {
        call.other.rewards.campaigns.call(this,e)
        if(e.length){
            const rewardElement = this?.__root?.querySelectorAll(".objective-reward-label");
            if(rewardElement && rewardElement.length == e.length){
                for (let i = 0; i < e.length; i++){
                    if(e[i].rewards.length == 1){
                        let reward = e[i].rewards[0],packCoinValue = info.base.packcoin?.[e[i].rewards[0].value];
                        if(reward.isPack && packCoinValue){
                            let packCoin = events.createElementWithConfig("span", {
                                classList: ['currency-coins'],
                                textContent: `${fy("packcoin.text")}${(packCoinValue *  e[i].rewards[0].count).toLocaleString()}`,
                            });
                            rewardElement[i].appendChild(document.createElement("br"));
                            rewardElement[i].appendChild(packCoin);
                        }
                    }
                }
            }
        }
    }

    UTRewardSelectionChoiceViewController.prototype.viewDidAppear = function() {
        call.other.rewards.selection.call(this)
        console.log(this)
        let isSelected = this.selectedRewardIndex == -1 ? false : true;
        let reward = [];
        if(isSelected){
            reward = Array.from(this.rewardSets).flatMap(rewardSet => rewardSet.awards);
        }else{
            reward = this.rewardSets.map((set) => set.awards[0]);
        }
        let rewardElement = this.getView().__rewardTiles.querySelectorAll(isSelected ? ".textField" : ".main-description")
        console.log(reward,rewardElement)
        if(reward.length == rewardElement.length){
            for (let i = 0; i < rewardElement.length; i++) {
                let e = rewardElement[i],r = reward[i],packCoinValue = info.base.packcoin?.[r.value];
                if(!e.querySelector("span.currency-coins") && r.isPack && packCoinValue){
                    let packCoin = events.createElementWithConfig("span", {
                        classList: ['currency-coins'],
                        textContent: `${fy("packcoin.text")}${(packCoinValue *  r.count).toLocaleString()}`,
                    });
                    e.style.height = "auto";
                    e.appendChild(document.createElement("br"));
                    e.appendChild(packCoin);
                }
                
            }
        }
    }
    UTRewardsCarouselView.prototype.setupRewards = function(t) {
        call.other.rewards.base.call(this,t)
        if(t.length){
            const rootElement = this?.__root,packCoinValue = info.base.packcoin?.[t[0].value];
            if(t[0].isPack && packCoinValue && rootElement){
                let target = rootElement.querySelector(".textField");
                let packCoin = events.createElementWithConfig("span", {
                    classList: ['currency-coins'],
                    textContent: `${fy("packcoin.text")}${(packCoinValue *  t[0].count).toLocaleString()}`,
                });
                target.style.height = "auto";
                target.appendChild(document.createElement("br"));
                target.appendChild(packCoin);
            }
        }
    }


    //创建俱乐部按钮
    UTClubHubView.prototype.clearTileContent = function(...args) {
        call.view.clubHub.call(this);
        console.log(this)
        if("_fsuLockTile" in this){
            this.addTileStats(this._fsuLockTile,info.lock.length);
        }else{
            let lockTile = new UTTileView();
            lockTile.getRootElement().classList.add("col-1-3-md");
            lockTile.getRootElement().classList.add("col-1-2");
            lockTile.getRootElement().classList.add("fsu-lock");
            lockTile.init();
            lockTile.title = fy("locked.tile");
            lockTile._parent = this;
            this._fsuLockTile = lockTile;
            this._fsuLockTile.addTarget(this,
                (e) => {
                    events.goToLockPlayers(e._parent)
                },EventType.TAP)
            this.addTileStats(this._fsuLockTile,info.lock.length);
            this.getRootElement().querySelector("div.grid").appendChild(this._fsuLockTile.getRootElement());
        }
    }
    events.goToLockPlayers = (e) => {
        console.log(e)
        let nav = cntlr.current().getNavigationController();
        if(nav){
            let criteria = new UTSearchCriteriaDTO;
            criteria.type = SearchType.PLAYER;
            criteria.type = SearchType.PLAYER;
            let controller = isPhone() ? new UTClubSearchResultsViewController : new controllers.club.ClubSearchResultsLandscape;
            controller.initWithSearchCriteria(criteria);
            if(isPhone()){
                controller._fsuLock = true;
            }else{
                controller._listController._fsuLock = true;
            }
            nav.pushViewController(controller);
        }
    }
    //读取显示锁定球员
    UTClubSearchResultsViewController.prototype._requestItems = function(r) {
        if("_fsuLock" in this && this._fsuLock){
            var s = this;
            s.getNavigationController().setNavigationTitle(fy("locked.navtilte"))
            void 0 === r && (r = !1);
            var e = this.getView().getSubTypesDropDown()
                , t = new UTSearchCriteriaDTO;
            t.update(this.searchCriteria),
            0 < e.length && (t.subtypes = [e.id]),
            services.Club.search(t).observe(this, function(e, t) {
                var i;
                if (e.unobserve(s),
                s.clubViewModel && t.success && JSUtils.isObject(t.response)) {
                    console.log(t)
                var o = s.clubViewModel.getIndex()
                    , n = s.searchCriteria.sortBy === SearchSortType.RECENCY
                    , p = t.response.items.filter( i => info.lock.includes(i.id));
                s.clubViewModel.sortByRecency = n,
                s.clubViewModel.sort = s.searchCriteria.sort,
                s.clubViewModel.sortType = s.searchCriteria.sortBy,
                s.clubViewModel.removeArray(t.response.items),
                s.clubViewModel.addArray(p),
                s.clubViewModel.isFull = t.response.retrievedAll,
                s.clubViewModel.setIndex(o),
                s.updateItemList(s.clubViewModel.getPageItems(), !r)
                } else
                services.Notification.queue([services.Localization.localize("notification.club.failedToLoad"), UINotificationType.NEGATIVE]),
                null === (i = s.getNavigationController()) || void 0 === i || i.popViewController(!0)
            })
        }else{
            call.search.request.call(this,r)
        }
    }
    //搜索球员时抓取所搜索的球员内容
    UTMarketSearchFiltersView.prototype.eSearchButtonSelected = function(e, t, i) {
        call.other.market.eSearch.call(this,e,t,i)
        if(cntlr.current().className == "UTMarketSearchFiltersViewController"){
            let criteria = JSON.parse(JSON.stringify(cntlr.current()._viewmodel.searchCriteria));
            if(criteria.maskedDefId){
                let criteriaText = JSON.stringify(Object.values(criteria));
                let repeat = 1;
                info.market.mb.forEach((element, index) => {
                    if (JSON.stringify(element) == criteriaText) {
                        info.market.mb.splice(index, 1);
                        repeat = index;
                    }
                });
                info.market.mb.unshift(Object.values(criteria));
                info.market.mb.splice(6);
                if(repeat){
                    info.market.ts = Date.now();
                }
                console.log(info.market)
                GM_setValue("history",JSON.stringify(info.market.mb));
            }
        }
    }

    //转会搜索球员时添加历史名单。
    UTMarketSearchFiltersView.prototype.setFilters = function(e, t) {
        call.other.market.setFilter.call(this,e,t)
        if(e.searchBucket == 0 && e.showCategoryTab){
            console.log(info.market)
            if(!("_fsuHistory" in this)){
                this._fsuHistory = {};
                this._fsuHistory.ts = 0;
                let element = document.createElement("div");
                element.classList.add("search-prices");
                let eheader = document.createElement("div");
                eheader.classList.add("search-price-header");
                element.appendChild(eheader)
                let eheadertext = document.createElement("h1");
                eheadertext.textContent = fy("history.title");
                eheader.appendChild(eheadertext);
                let ebody = document.createElement("div");
                ebody.classList.add("fsu-historybox");
                element.appendChild(ebody)
                this._fsuHistory.element = element;
                this._fsuHistory.btns = [];
                this.getRootElement().querySelector(".ut-pinned-list").appendChild(this._fsuHistory.element)
            }
            if(this._fsuHistory.element.style.display == "none"){
                this._fsuHistory.element.style.display = "block";
            }
            if(this._fsuHistory.ts !== info.market.ts){
                this._fsuHistory.btns.length = 0;
                this._fsuHistory.element.querySelector(".fsu-historybox").innerHTML = "";
                let criteriaKeys = Object.keys(e.searchCriteria);
                
                for (const i of info.market.mb) {
                    let info = repositories.Item.getStaticDataByDefId(i[criteriaKeys.indexOf("maskedDefId")])
                    let btn = events.createButton(
                        new UTStandardButtonControl(),
                        `${info.name} - ${info.rating}`,
                        async(e) => {
                            console.log(e.criteria)
                            let current = cntlr.current()._viewmodel.searchCriteria;
                            let keys = Object.keys(current);
                            if(!(keys.length - e.criteria.length)){
                                keys.forEach(function(value, index) {
                                    let condition = false;
                                    if (Array.isArray(current[value])) {
                                        condition = current[value].length !== e.criteria[index].length;
                                    } else {
                                        condition = current[value] !== e.criteria[index];
                                    }
                                    if(condition){
                                        console.log(`${value}，目前的元素 ${current[value]}，存储值为 ${e.criteria[index]}`);
                                        current[value] = e.criteria[index];
                                    }
                                });
                                cntlr.current().getView().eSearchButtonSelected();
                            }
                        },
                        "mini"
                    )
                    btn.getRootElement().style.width = "100%";
                    btn.criteria = i;
                    this._fsuHistory.btns.push(btn);
                    let eblock = document.createElement("div");
                    eblock.classList.add("price-filter");
                    eblock.appendChild(btn.getRootElement());
                    let elable = document.createElement("div");
                    elable.style.textAlign = "center";
                    elable.style.color = "#9E9E9E";
                    let bid = [];
                    if(i[criteriaKeys.indexOf("minBid")] + i[criteriaKeys.indexOf("maxBid")] > 0){
                        bid = [i[criteriaKeys.indexOf("minBid")],i[criteriaKeys.indexOf("maxBid")],"auctioninfo.bidprice"]
                    }else{
                        bid = [i[criteriaKeys.indexOf("minBuy")],i[criteriaKeys.indexOf("maxBuy")],"auctioninfo.buynowprice"]
                    }
                    let defaultText = services.Localization.localize("search.comboBoxDefaultValue");
                    elable.textContent = `${services.Localization.localize(bid[2])}${bid[0] ? bid[0] : defaultText} - ${bid[1] ? bid[1] : defaultText}`;
                    eblock.appendChild(elable);
                    this._fsuHistory.element.querySelector(".fsu-historybox").appendChild(eblock);
                }
                this._fsuHistory.ts = info.market.ts;
            }
        }else if("_fsuHistory" in this){
            this._fsuHistory.element.style.display = "none";
        }
    }
    
    //进化球员搜索界面
    UTAcademySlotItemDetailsViewController.prototype.renderView = function(...args) {
        call.view.academySlot.call(this, ...args);
        console.log(this)
        if("_fsuGoToFutbin" in this.getView()){
            if(this.viewmodel.getSelectedSlot().hasPreviewPlayer()){
                this.getView()._fsuGoToFutbin.hide()
            }else{
                this.getView()._fsuGoToFutbin.show()
            }
        }else{
            let id = this.viewmodel.getSelectedSlot().id,
                t = this.getView().__ctaButtonContainer,
                b = events.createButton(
                    new UTStandardButtonControl(),
                    fy("quicklist.gotofutbin"),
                    (e) => {
                        GM_openInTab(`https://www.futbin.com/evolutions/${e.id}/`, { active: true, insert: true, setParent :true });
                    },
                    "expanded preview-player fsu-academyFutbin"
                );
            b.id = id;
            this.getView()._fsuGoToFutbin = b;
            let styleElement = document.createElement('style');
            styleElement.textContent = '.fsu-academyFutbin::before { content:"\\E0DF" !important}';
            document.head.appendChild(styleElement);
            t.insertBefore(b.getRootElement(), t.firstChild);
        }

    }


    //商店页面设置标题
    UTStoreViewController.prototype.setCategory = function(e) {
        call.other.store.setCategory.call(this,e)
        if(this.viewmodel !== void 0){
            let searchCategoryIds = _.map(
                _.filter(this.viewmodel.categories, obj => 
                    obj.localizedName === 'FUT_STORE_CAT_SPECIAL_NAME' || obj.localizedName === 'FUT_STORE_CAT_GLOBAL_L'
                ),'categoryId'
            );
            _.map(this.getView()._navigation.items,item => {
                if(searchCategoryIds.includes(item.id)){
                    let coinsPack = _.filter(this.viewmodel.getCategoryArticles(item.id), pack => _.isEqual(pack.state, 'active') && _.size(pack.prices._collection) === 1 &&
                    _.has(pack.prices._collection, 'COINS'))
                    if(coinsPack.length){
                        item.addNotificationBubble(coinsPack.length);
                    }
                }
            })
        }
    }
    events.createVirtualChallenge = (c) =>{
        let challengeInfo = {
            assetId:"virtual",
            description: "virtual",
            eligibilityOperation: c.eligibilityOperation,
            endTime: c.endTime,
            formation: c.squad.getFormation().name,
            id: 888888,
            name: "virtual",
            priority: c.priority,
            repeatable: c.repeatable,
            requirements: c.eligibilityRequirements,
            rewards: [],
            setId: 888888,
            status: c.status,
            timesCompleted: c.timesCompleted,
            type: c.type
        };
        let newChallenge = new UTSBCChallengeEntity(challengeInfo);
        let squadInfo = {
            chemistry:0,
            id:888888,
            formation:c.squad.getFormation().name,
            manager:[new UTNullItemEntity()],
            players:[],
            rating:0
        }
        for (let i = 0; i < 23; i++) {
            squadInfo.players.push({
                index:i,
                itemData: new UTItemEntity()
            })
        }
        let brickIndices = undefined;
        if(c.squad.simpleBrickIndices.length){
            brickIndices = [];
            for (let i = 0; i < 11; i++) {
                brickIndices.push({
                    index:i,
                    playerType: c.squad.simpleBrickIndices.includes(i) ? "BRICK" : "DEFAULT"
                })
            }
        }
        let newSquad = new UTSquadEntity(
            factories.Squad.generateSBCSquadConstructorOptions(squadInfo,services.SBC.sbcDAO.factory,brickIndices),
            services.Squad.squadDao,
            new UTSquadChemCalculatorUtils(services.Chemistry,repositories.TeamConfig)
        )
        newSquad.setPlayers(c.squad.getPlayers().map(i => {return i.getItem()}),true)
        newChallenge.squad = newSquad;
        return newChallenge;
    }

    lock.init = function(){
        let a = JSON.parse(GM_getValue("lock","[]")),b = [];
        if(a && typeof a === 'object'){
            b = a;
        }
        console.log(b)
        info.lock = b;
    }
    lock.save = function(v){
        if(info.lock.includes(v)){
            info.lock.splice(info.lock.indexOf(v), 1);
            events.notice(fy("notice.unlockplayer"),0)
        }else{
            info.lock.push(v)
            events.notice(fy("notice.lockplayer"),0)
        }
        GM_setValue("lock",JSON.stringify(info.lock));
    };
    build.init = () => {
        let a = JSON.parse(GM_getValue("build","{}"));
        _.merge(info.build, a);
        console.log(info.build)
    }
    build.set = (s,r) => {
        info.build[s] = r;
        console.log(info.build)
        GM_setValue("build",JSON.stringify(info.build));
    }
    unsafeWindow.call = call;
    unsafeWindow.info = info;
    unsafeWindow.cntlr = cntlr;
    unsafeWindow.events = events;
    unsafeWindow._ = _;
})();
