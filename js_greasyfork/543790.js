// ==UserScript==
// @name         KFSU
// @namespace    https://github.com/Simeagol
// @version      0.04
// @description  EAFC 한국 유저들을 위한 한글화 FSU!
// @author       Simeagol
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easysbc.io/evolutions*
// @match        https://www.futbin.com/*
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/lodash.js/4.17.21/lodash.min.js
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      ea.com
// @connect      futbin.com
// @connect      futbin.org
// @connect      futnext.com
// @connect      fut.gg
// @connect      fut.to
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543790/KFSU.user.js
// @updateURL https://update.greasyfork.org/scripts/543790/KFSU.meta.js
// ==/UserScript==

(function () {
    'use strict';
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("lodash")):"function"==typeof define&&define.amd?define(["lodash"],t):t((e=e||self)._)}(this,(function(e){"use strict";(e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e).mixin({multicombinations:function(t,n){var i=e.values(t),f=function(e,t){if(--t<0)return[[]];var n=[];e=e.slice();for(var i=function(){var i=e[0];f(e,t).forEach((function(e){e.unshift(i),n.push(e)})),e.shift()};e.length;)i();return n};return f(i,n)}})}));





    function futweb() {
        var events = {},info = {},cntlr = {},html = {},call = {},set = {},pdb = {},lock = {},build = {},SBCCount = {};
        info = {
            "task":{"obj":{"stat":{},"html":"","source":[]},"sbc":{"stat":{},"html":""}},
            "base":{"state":false,"platform":"pc","price":{},"sId":"","localization":"",autoLoad:true,"ratings":{},"input":true,"promo":0,"savesquad":false,"packcoin":{},"packreturns":{},"oddo":{},"fastsbc":{},"fastsbctips":false,"imgDB":null,"imgCache":{}},
            "squad":{},
            "meta":{},
            "api":{},
            "nave":{},
            "SBCCount":{},
            "bodytypetext":["UKN","A&L","A&N","A&S","T&L","T&N","T&S","S&L","S&N","S&S","UKN","VT&L","U&L","U&N","U&S","UKN"],
            "criteria":{},
            "run":{"template":false,"losauction":false,"bulkbuy":false},
            "roster":{"state":false,"data":{},"ea":{},"page":-1,"element":{},"thousand":{"lowest":99}},
            "language":2,
            "localization":{},
            "quick":{},
            "market":{"ts":0,"mb":[]},
            "range":[46,99],
            "build":{"league":true,"flag":false,"untradeable":true,"ignorepos":true,"academy":false,"strictlypcik":true,"comprare":true,"comprange":true,"firststorage":true},
            "league":{2012:'中超',61:'英乙',60:'英甲',14:'英冠',13:'英超',2208:'英丙',2149:'印超',32:'意乙',31:'意甲',54:'西乙',53:'西甲',68:'土超',50:'苏超',308:'葡超',39:'美职联',17:'法乙',16:'法甲',20:'德乙',19:'德甲',2076:'德丙',2118:'传奇',353:'阿甲'},
            "setfield":{"card":["pos","price","other","club","low","meta"],"player":["auction","futbin","getprice","loas","uatoclub","transfertoclub","pickbest"],"sbc":["top","right","quick","duplicate","records","input","icount","template","templatemode","market","sback","cback","dupfill","autofill","squadcmpl","conceptbuy","meetsreq","headentrance"],"info":["obj","sbc","sbcf","sbcs","pack","squad","skipanimation","sbcagain","packagain"]},
            "set":{},
            "lock":[],
            "autobuy":{"controller":null,"infoViews":{},"logView":{},"log":[]},
            "douagain":{"sbc":0,"pack":0,"SBCList":[]},
            "formation":{
                "343": [0,5,5,5,12,14,14,16,23,25,27],
                "352": [0,5,5,5,12,10,10,16,25,18,25],
                "424": [0,3,5,5,7,14,14,23,27,25,25],
                "433": [0,3,5,5,7,14,14,14,23,25,27],
                "442": [0,3,5,5,7,12,14,14,16,25,25],
                "451": [0,3,5,5,7,12,18,14,18,16,25],
                "523": [0,3,5,5,5,7,14,14,23,25,27],
                "532": [0,3,5,5,5,7,14,10,14,25,25],
                "541": [0,3,5,5,5,7,12,14,14,16,25],
                "3142": [0,5,5,5,12,14,10,14,16,25,25],
                "3412": [0,5,5,5,12,14,14,16,25,18,25],
                "3421": [0,5,5,5,12,14,14,16,18,25,18],
                "4132": [0,3,5,5,7,12,10,16,14,25,25],
                "4141": [0,3,5,5,7,10,12,14,14,16,25],
                "4213": [0,3,5,5,7,10,10,18,23,25,27],
                "4222": [0,3,5,5,7,10,10,18,18,25,25],
                "4231": [0,3,5,5,7,10,10,18,18,18,25],
                "4312": [0,3,5,5,7,14,14,14,18,25,25],
                "4321": [0,3,5,5,7,14,14,14,18,25,18],
                "5212": [0,3,5,5,5,7,14,14,25,18,25],
                "41212": [0,3,5,5,7,12,10,16,25,18,25],
                "41212-2": [0,3,5,5,7,14,10,14,25,18,25],
                "4231-2": [0,3,5,5,7,10,10,12,18,16,25],
                "433-2": [0,3,5,5,7,14,10,14,23,25,27],
                "433-3": [0,3,5,5,7,10,14,10,23,25,27],
                "433-4": [0,3,5,5,7,14,18,14,23,25,27],
                "4411-2": [0,3,5,5,7,12,14,14,16,18,25],
                "442-2": [0,3,5,5,7,12,10,10,16,25,25],
                "451-2": [0,3,5,5,7,12,14,14,14,16,25]
            }
        };
        cntlr = {
            "current":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();},
            "right":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController().rightController.currentController},
            "left":function(){return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController().leftController},
        };
        events.notice = function(text,type){
            services.Notification.queue([fy(text),type])
        };
        events.init =  async function(){
            SBCCount.init();
            set.init();
            build.init();
            lock.init();
            info.myPacksSort = GM_getValue("packsSort", "desc");

            let history_a = JSON.parse(GM_getValue("history","[]")),history_b = [];
            if (history_a && _.isArray(history_a)) {
                let newSize = _.size(new UTSearchCriteriaDTO());
                let filteredMembers = _.filter(history_a, item => _.isArray(item) && item.length === newSize);
                history_b = _.concat(history_b, filteredMembers);
            }
            console.log(history_b)
            info.market.mb = history_b;
            info.market.ts = Date.now();
            info.base.sId = services.Authentication.utasSession.id;

            info.base.year = APP_YEAR_SHORT;
            MAX_NEW_ITEMS = 100;

            const cutoff = Math.floor(info.market.ts / 1000) - 168 * 3600; // 168 小时前时间戳
            info.ggr = JSON.parse(GM_getValue("ggr", "{}"));
            // 遍历并删除过期项
            for (const [id, data] of Object.entries(info.ggr)) {
                const time = parseInt(data.time, 10); // 解析字符串为数字
                if (isNaN(time) || time < cutoff) {
                    delete info.ggr[id];
                }
            }
            // 保存回去
            GM_setValue("ggr", JSON.stringify(info.ggr));

            GM_xmlhttpRequest({
                method:"GET",
                url:"https://api.fut.to/25/updata.json",
                timeout:8000,
                headers: {
                    "Content-type": "application/json",
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                onload:function(res){
                    let urlText = fy("top.readme");
                    let urlLink = "https://mfrasi851i.feishu.cn/wiki/wikcng1Ih7fFRidBfMdNS9SrucR";
                    if(res.status == 404){
                        events.notice("notice.upgradefailed",2);
                    }else{
                        let data = JSON.parse(res.response);
                        // 업그레이드 알림 비활성화
                        //let myVersion = Number(GM_info.script.version) || 0;
                        // if(data["version"] > myVersion){
                        //     urlText = fy("top.upgrade");
                        //     urlLink = "https://greasyfork.org/ko/scripts/543790-kfsu";
                        //     events.notice("notice.upgradeconfirm",1);
                        // }
                        if(_.size(data["api"])){
                            info.api = data["api"];
                            if(_.has(info.api,"meta")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/25/meta.json?${info.api.meta}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload:function(res){
                                        let metaJson = JSON.parse(res.response);
                                        _.map(metaJson,(s,k) => {
                                            if(k !== "updata" && k !== "rank"){
                                                info.meta[k] = {};
                                                info.meta[k]["bodytype"] = s[0];
                                                let remainingArray = _.tail(s);
                                                info.meta[k]["meta"] = _.chunk(remainingArray, 2);
                                            }else{
                                                info.meta[k] = s;
                                            }
                                        })
                                        console.log(`meta加载完毕！`)
                                    },
                                })
                            }
                            if(_.has(info.api,"fastsbc")){
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: `https://api.fut.to/25/fast.json?${info.api.fastsbc}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload: function(res) {
                                        _.forEach(JSON.parse(res.responseText),(i,k) => {
                                            let nowTime = Math.floor(Date.now() / 1000);
                                            if(i.t > nowTime){
                                                info.base.fastsbc[k] = i.g;
                                            }
                                        })
                                    }
                                });

                            }
                            if(_.has(info.api,"pack")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/25/pack.json?${info.api.pack}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload:function(res){
                                        info.base.oddo = JSON.parse(res.response)
                                    },
                                });

                            }
                            if(_.has(info.api,"sbc")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/25/sbc.json?${info.api.sbc}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload:function(res){
                                        let sbcJson = JSON.parse(res.response);
                                        info.task.sbc.stat = sbcJson;
                                        let sbcRewardArray = _.map(sbcJson.reward,i => {
                                            return i == 1 ? fy("task.player") :  i == 2 ? fy("task.pack") : '';
                                        })
                                        info.task.sbc.html = events.taskHtml(sbcJson.new.length,sbcRewardArray.join("、"));
                                    },
                                });

                            }
                            if(_.has(info.api,"futbin_e")){
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: `https://api.fut.to/25/futbin_e.json?${info.api.futbin_e}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload: function(res) {
                                        GM_setValue("futbin_e",res.response);
                                    }
                                });

                            }
                            if(_.has(info.api,"ggrating")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/25/ggrating.json?${info.api.ggrating}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload:function(res){
                                        info.GGRRAR = JSON.parse(res.response);
                                        console.log(`GGRRAR加载完毕！`)
                                    },
                                })
                            }
                        }
                    }
                    getAppMain()._FCHeader.getView().__easportsLink.insertAdjacentHTML('afterend', `<a class="header_explain" href="https://www.fmkorea.com/fifa_series" target="_blank">FC갤</a>`);
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

            //读取商店评分低价信息
            GM_xmlhttpRequest({
                method:"GET",
                url:`https://www.futbin.org/futbin/api/getSTCCheapest?platform=${info.base.platform == "pc" ? "PC" : "PS"}`,
                headers: {
                    "Content-type": "application/json",
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache"
                },
                onload:function(res){
                    let data = JSON.parse(res.response);
                    let priceJson = {};
                    let lowRating = 99;
                    let baseLowPrice = 0;
                    let highRating = 0;
                    let baseHighPrice = 0;
                    _.map(data.data.players,i => {
                        if(i.data.players.length){
                            let rating = i.data.data.rating;
                            const firstFivePrices = _.map(_.take(i.data.players, 5), 'LCPrice');
                            const averagePrice = _.mean(firstFivePrices);
                            let price = Math.round(averagePrice);
                            price = price < 600 ? 600 : price;
                            if(rating < lowRating){
                                lowRating = rating;
                                baseLowPrice = price;
                            }
                            if(rating > highRating){
                                highRating = rating;
                                baseHighPrice = price;
                            }
                            priceJson[rating] = price;
                        }
                    })
                    priceJson["low"] = lowRating;
                    priceJson["high"] = highRating + 1;
                    //24.18 防止白银评分比黄金评分价格高：计算程序
                    function distributeValues(startKey, endKey, startValue, endValue) {
                        const keyCount = endKey - startKey + 1; // 键的数量
                        const totalDifference = endValue - startValue; // 总差值
                        const step = Math.floor(totalDifference / keyCount); // 每个键的差值
                        const remainder = totalDifference % keyCount; // 剩余的差值

                        // 使用 lodash 的 range 生成键的范围
                        _.range(startKey, endKey + 1).forEach((key, index) => {
                            priceJson[key] = startValue + step * index;
                            if (index < remainder) {
                                priceJson[key] += 1; // 分配剩余的差值
                            }
                        });
                    }

                    distributeValues(75, priceJson["low"] - 1, 550, priceJson[priceJson["low"]]);

                    // 分配 65 到 74
                    distributeValues(65, 74, 400, 550);

                    // 分配 45 到 64
                    distributeValues(45, 64, 200, 400);

                    let highRatings = _.range(highRating + 1, 100);
                    _.map(highRatings,i => {
                        baseHighPrice = UTCurrencyInputControl.getIncrementAboveVal(baseHighPrice * 1.2);
                        priceJson[i] = baseHighPrice;
                    })
                    info.base.price = priceJson;
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
                    objNewJson = {
                        new:[],
                        catNew:{},
                        expiry:[],
                        catExpiry:{},
                        reward:[],
                        catReward:0
                    }

                    _.map(t.response.categories,cat => {
                        objNewJson.catNew[cat.id] = 0;
                        objNewJson.catExpiry[cat.id] = 0;
                        objNewJson.catReward += cat.countNumberOfUnclaimedRewards();
                        _.map(cat.getGroups(),g => {
                            if(g.type !== 2){
                                let oId = g.compositeId;
                                if(g.startTime >= nowDate - 86400 && g.startTime < nowDate){
                                    objNewJson.new.push(oId);
                                    objNewJson.catNew[cat.id]++;

                                    if(g?.rewards){
                                        let rewards = _.concat(_.cloneDeep(g.rewards.rewards),_.flatten(_.map(g.objectives.values(),"rewards.rewards")));
                                        console.log(rewards);
                                        if(rewards.length){
                                            _.map(rewards,r => {
                                                if(r.isPack || (r.isItem && r.item.isMiscItem())){
                                                    objNewJson.reward.push(fy("task.pack"))
                                                }
                                                if(r.isItem && r.item.isPlayer()){
                                                    objNewJson.reward.push(fy("task.pack"))
                                                }
                                                if(r.isXP){
                                                    objNewJson.reward.push("XP")
                                                }
                                            })
                                        }
                                    }
                                }
                                if(g.endTime <= nowDate + 86400 && g.endTime !== 0){
                                    objNewJson.expiry.push(oId);
                                    objNewJson.catExpiry[cat.id]++;
                                }
                            }
                        })
                    })
                    objNewJson.reward = _.uniq(objNewJson.reward);
                    info.task.obj.stat = objNewJson;
                    info.task.obj.source = t.response.categories;
                    info.task.obj.html = events.taskHtml(objNewJson.new.length,objNewJson.reward.join("、"));
                }
            })
            await events.reloadPlayers();

            //24.18 可进化标识：读取进化任务数据
            //25.02 修复进化任务加载不全的问题
            if(repositories.Academy.isCacheExpired()){
                let academyDTO = new UTAcademySlotSearchCriteriaDTO;
                academyDTO.count = 40;
                services.Academy.requestAcademyHub(academyDTO).observe(cntlr.current(), function(e, t) {
                    e.unobserve(cntlr.current());
                    GM_setValue("academy",JSON.stringify({}));
                    if(t.success && t.data && !JSUtils.isString(t.data)){
                        _.map(t.data.categories,c => {
                            let DTO = new UTAcademySlotSearchCriteriaDTO;
                            DTO.categoryId = c.id;
                            DTO.count = 40;
                            services.Academy.requestSlotsByCategory(DTO).observe(cntlr.current(), function(ee, tt) {
                                ee.unobserve(cntlr.current());
                                if(tt.success && tt.data && !JSUtils.isString(tt.data)){
                                    let academyCache = JSON.parse(GM_getValue("academy","{}"));
                                    _.map(tt.data.slots,s => {
                                        academyCache[s.id] = {
                                            "name": s.slotName,
                                            "status": s.status == AcademySlotState.NOT_STARTED ? 1 : 0,
                                            "time": s.endTimePurchaseVisibility
                                        }
                                    })
                                    GM_setValue("academy",JSON.stringify(academyCache));
                                }
                            })
                        })
                    }
                })
            }
            info.squad = _.cloneDeep(repositories.Squad.squads.get(services.User.getUser().selectedPersona).get(services.Squad.activeSquad));
            console.log(info.squad)
        };
        //获取缓存球员数据
        events.getItemBy = (type,queryOptions,insertData,replaceData) => {
            let players = replaceData ? replaceData : _.concat(repositories.Item.club.items.values(),repositories.Item.getStorageItems()),
            ratingOrder = queryOptions.hasOwnProperty("LTrating") ? "desc" : "asc",
            specialOrder = [],
            firstStorage = 0,
            currentSquad;
            if(queryOptions.hasOwnProperty("os") && _.isArray(queryOptions.os)){
                specialOrder = queryOptions.os;
                delete queryOptions.os;
                //24.18 阵容挑选优先：1、优先非特殊球员，2、黄金范围优先非稀有
            }
            if(!("unlimited" in queryOptions) || ("unlimited" in queryOptions && !queryOptions.unlimited)){
                players = players.filter(i => { return i.isPlayer() && i.loans === -1 && !i.isEnrolledInAcademy() && i.endTime == -1})
            }else{
                players = players.filter(i => { return i.isPlayer()})
            }
            delete queryOptions.unlimited;


            if(_.has(queryOptions,"firststorage")){
                firstStorage = queryOptions.firststorage ? 1 : 2;
                delete queryOptions.firststorage;
            }

            //移除阵容生成阵容
            if(_.has(queryOptions,"removeSquad")){
                let tempSquad = repositories.Squad.squads.get(services.User.getUser().selectedPersona);
                if(tempSquad){
                    info.squad = tempSquad.get(services.Squad.activeSquad)
                }
                currentSquad = info.squad
            }

            for (let [k,v] of Object.entries(queryOptions)) {
                players = players.filter(i => {
                    switch(k){
                        case "rs":
                            switch(v){
                                case 0:
                                    return i.rating >= 0 && i.rating <= 64 && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                case 1:
                                    return i.rating >= 65 && i.rating <= 74 && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                case 2:
                                    return i.rating >= 75 && i.rating <= info.set.goldenrange && (!i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014);
                                case 9:
                                    return !i.isSpecial() || i.leagueId == 1003  || i.leagueId == 1014;
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
                        case "removeSquad":
                            return !currentSquad.containsItem(i)
                        default:
                            if(/NE/.test(k)){
                                let rk = k.replace(/NE/, '');
                                return _.isArray(v) ? !v.includes(i[rk]) : i[rk] !== v;
                            }else if(/GT/.test(k)){
                                let rk = k.replace(/GT/, '');
                                return _.isArray(v) ? i[rk] >= Math.max(...v) : i[rk] >= v;
                            }else if(/LT/.test(k)){
                                let rk = k.replace(/LT/, '');
                                return _.isArray(v) ? i[rk] <= Math.min(...v) : i[rk] <= v;
                            }else{
                                if(_.isArray(i[k])){
                                    return _.isArray(v) ? _.intersection(i[k], v).length === v.length : _.includes(i[k], v);
                                }else{
                                    return _.isArray(v) ? v.includes(i[k]) : i[k] === v;
                                }
                            }
                    }
                });
            }

            //25.21 白银和青铜优先普通再稀有
            const sortItemPresence = (p) => {
                const item = repositories.Item.storage.get(p.id);
                return item ? 0 : 1;
            };

            const isMixBronzeAndSilver = _.isEqual(queryOptions.rareflag, [0, 1]) &&
                (queryOptions.rs == 0 || queryOptions.rs == 1);

            const sortField = isMixBronzeAndSilver
                ? ["rareflag", "rating", sortItemPresence, "untradeable", "_itemPriceLimits.minimum", "_itemPriceLimits.maximum"]
                : ["rating", sortItemPresence, "untradeable", "rareflag", "_itemPriceLimits.minimum", "_itemPriceLimits.maximum"];

            const sortOrder = isMixBronzeAndSilver
                ? ["asc", ratingOrder, "asc", "desc", "asc", "asc"]
                : [ratingOrder, "asc", "desc", "asc", "asc", "asc"];
                
            players = _.orderBy(players, sortField, sortOrder);

            if(specialOrder.length && players.length){
                if(_.includes(specialOrder, 1)){
                    let tempPlayers = _.values(_.groupBy(players,"rating")),resultPlayers = [];
                    if(ratingOrder == "desc"){
                        tempPlayers = _.reverse(tempPlayers);
                    }
                    _.forEach(tempPlayers,i => {
                        let tempResult = [],special = [],normal = [];
                        _.forEach(i,si => {
                            if(!si.isSpecial() || si.leagueId == 1003  || si.leagueId == 1014){
                                normal.push(si);
                            }else{
                                special.push(si);
                            }
                        })
                        tempResult = _.concat(normal, special);
                        resultPlayers  = _.concat(resultPlayers, tempResult);
                    })
                    players = resultPlayers;
                }
                if(_.includes(specialOrder, 2)){
                    function customSort(a, b) {
                        const rareFlagsOrder = {1: 0, 53: 1, 52: 2};
                        const rareFlagA = rareFlagsOrder[a?.rareflag] !== undefined ? rareFlagsOrder[a.rareflag] : Number.MAX_SAFE_INTEGER;
                        const rareFlagB = rareFlagsOrder[b?.rareflag] !== undefined ? rareFlagsOrder[b.rareflag] : Number.MAX_SAFE_INTEGER;
                        if (rareFlagA === rareFlagB) {
                            return 0;
                        }
                        return rareFlagA - rareFlagB;
                    }
                    let tempPlayers = _.values(_.groupBy(players,"rating")),resultPlayers = [];
                    if(ratingOrder == "desc"){
                        tempPlayers = _.reverse(tempPlayers);
                    }
                    _.forEach(tempPlayers,i => {
                        let tempResult = [];
                        if(i[0].rating >= 75 && i[0].rating <= info.set.goldenrange){
                            tempResult = _.sortBy(i, customSort);
                            if(!_.includes(specialOrder, 1)){
                                tempResult = _.orderBy(tempResult,"untradeable","desc");
                            }
                        }else{
                            tempResult = i;
                        }
                        resultPlayers  = _.concat(resultPlayers, tempResult);
                    })
                    players = resultPlayers;
                }
            }


            if(firstStorage == 1){
                //将仓库球员排在前列
                players = _.orderBy(players, [
                    (player) => {
                    const item = repositories.Item.storage.get(player.id);
                    return item ? 0 : 1;
                    }
                ], ["asc"]);
            }

            if(insertData && !replaceData){
                console.log("查询球员时有插入数据")
                let insertPlayerIds = _.map(_.filter(insertData,i => {
                    return !i.isLimitedUse() && i.isPlayer() && i.isDuplicate()
                }),"duplicateId")
                players = _.orderBy(players, [
                    (player) => {
                    return _.includes(insertPlayerIds,player.id) ? 0 : 1;
                    }
                ], ["asc"]);
            }

            if(firstStorage !== 0){
                //25.09 调换顺序 移除重复的球员
                players = _.uniqBy(players, 'definitionId');
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
            if(info.run.template){
                info.run.template = false;
                isPhone() ? cntlr.current().getView()._fsuSquad.setInteractionState(1) : cntlr.right().getView()._fsuSquad.setInteractionState(1);
            }
            if(info.run.losauction){
                info.run.losauction = false;
                if(isPhone()){
                    events.notice("notice.phoneloas",0)
                }
            }
            if(info.run.bulkbuy){
                info.run.bulkbuy = false;
            }
            if(info.run.openPacks){
                info.run.openPacks = false;
            }
            events.changeLoadingText("loadingclose.text");
        };
        //本地化文本显示程序
        const fy = function(p){
            let t = "";
            if(Array.isArray(p)){
                let copyP = _.cloneDeep(p);
                t = info.localization[copyP.shift()][info.language];
                let s = copyP.slice();
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
            "price.btntext":["查询价格","查詢價格","Check Price","가격 조회"],
            "price.formatno":["无数据","沒有數據","No Data","데이터 없음"],
            "price.formatcompany":["万","萬","ten thousand","만"],
            "price.now":["球员低价","最低價格","Low Price","최저가"],
            "price.low":["评分低价","評分最低價格","Rating Price","등급 최저가"],
            "price.last":["购买价格","購入價格","Bought Price","구매가"],
            "duplicate.swap":["可发送俱乐部","可以送到球會","Can be Sent to Club","클럽으로 보낼 수 있음"],
            "duplicate.not":["队内不可交易","球會球員無法交易","Club Players are Untradeable","클럽 선수는 거래 불가"],
            "duplicate.yes":["队内可交易","球會球員可交易","Club Players are Tradable","클럽 선수는 거래 가능"],
            "duplicate.nodata":["无队内数据","沒有球員數據","No Club Players Data","클럽 선수 데이터 없음"],
            "duplicate.lowprice":["评分低价:","評分最低價格:","Rating Price ","등급 최저가: "],
            "top.readme":["【FSU】插件使用说明","【FSU】插件使用說明","【FSU】Plugin Instructions","FSU 사용 설명법 (중국어)"],
            "top.upgrade":["有新版FSU插件可升级","有新版本的FSU插件可更新","There is a new version of the FSU plugin that can be upgraded","새로운 버전의 FSU 플러그인을 업그레이드할 수 있습니다"],
            "notice.upgradefailed":["查询新版本失败","查詢新版本失敗","Query new version failed","새 버전 조회 실패"],
            "notice.upgradeconfirm":["有新版本点击顶部链接查看","有新版本點擊頂部鏈接查看","There is a new version, click the top link to view","새 버전이 있습니다. 상단 링크를 클릭하여 확인하세요"],
            "notice.uasreset":["已重新载入列表","已重新載入列表","The list has been reloaded","목록이 다시 로드되었습니다"],
            "notice.priceloading":["开始读取价格数据 请稍等","開始讀取價格數據 請稍等","Start reading price data, please wait","가격 데이터 읽기 시작, 잠시 기다려 주세요"],
            "notice.loaderror":["读取数据失败 请检查网络","讀取數據失敗 請檢查網絡","Failed to read data, please check the network","데이터 읽기 실패, 네트워크를 확인해 주세요"],
            "notice.succeeded":["FSU插件加载成功","FSU插件載入成功","FSU plugin loaded successfully","FSU 플러그인 로드 성공"],
            "notice.duplicateloading":["开始读取重复球员数据 请稍等","開始讀取重複球員數據 請稍等","Start reading duplicate player data, please wait","중복 선수 데이터 읽기 시작, 잠시 기다려 주세요"],
            "notice.quicksearch":["使用快捷添加 直接沿用上次配置搜索球员","使用快捷增加球員 直接沿用上次配置搜索球員","Use the shortcut to add, directly follow the last configuration to search for players","빠른 추가 사용, 마지막 설정으로 선수 검색"],
            "notice.appointloading":["开始读取指定条件球员 请稍等","開始讀取指定條件球員 請稍等","Start reading the specified condition player, please wait a moment","지정 조건 선수 읽기 시작, 잠시 기다려 주세요"],
            "notice.noduplicate":["已无重复球员","已經沒有重複球員","no duplicate player","중복 선수 없음"],
            "notice.quickauction":["球员将按照最低售价作为即买价挂出","球員將按最低價格列在轉會市場上","Players will be listed at the lowest selling price as an immediate purchase price","선수들이 최저 판매가로 즉시 구매가로 올라갑니다"],
            "task.player":["球员","球員","Player","선수"],
            "task.pack":["组合包","組合包","Pack","팩"],
            "task.added":["今日新增：","今日新增：","Added today ","오늘 추가: "],
            "task.noadded":["今日无新增","今日沒有新增","No new additions today","오늘 새로 추가된 것 없음"],
            "task.new":["新","新","New","추가"],
            "task.expire":["即将到期","即將過期","Expiring","곧만료"],
            "task.nodata":["无数据请过段时间重新进入WEBAPP再查看","沒有數據請過段時間重新進入WEBAPP再查看","No data, please re-enter WEBAPP after a while to check","데이터 없음, 잠시 후 WEBAPP에 다시 입장하여 확인해 주세요"],
            "sbc.price":["造价预估：","製作價格：","Cost estimate:","제작 비용 예상: "],
            "sbc.topprice":["预估造价","製作價格","Estimate","예상"],
            "sbc.topsquad":["阵容价值","球隊價格","Squad","스쿼드"],
            "sbc.like":["值得做：","贊成：","Thumbs Up：","추천: "],
            "sbc.dislike":["不值得：","反對：","Thumbs Down：","비추천: "],
            "sbc.consult":["抄作业","參考方案","See Plan","방안 보기"],
            "sbc.count":["算评分","計算評分","Calculate Score","점수 계산"],
            "sbc.duplicates":["重复球员名单","重複球員名單","Duplicate Players List","중복 선수 목록"],
            "sbc.qucikdupes":["重","重","D","중"],
            "sbc.appoint":["指定条件球员名单","指定條件球員名單","Specified conditions Player list","지정 조건 선수 목록"],
            "sbc.addduplicate":["添加重复球员","新增重複球員","Add Duplicate Players","중복 선수 추가"],
            "sbc.swapduplicate":["替换为重复球员","交換為重複球員","Swap Duplicate Players","중복 선수로 교체"],
            "sbc.notduplicate":["无重复球员","沒有重複球員","No Duplicate Players","중복 선수 없음"],
            "sbc.addquick":["快捷添加球员","快速新增球員","Quick Add Player","빠른 선수 추가"],
            "sbc.swapquick":["快捷替换球员","快速交換球員","Quick Swap Player","빠른 선수 교체"],
            "sbc.watchplayer":["查看球员","查看球員","Watch Player","선수 보기"],
            "uasreset.btntext":["重载名单","重新載入名單","Reload List","목록 다시 로드"],
            "sbc.filtert":["筛选","篩選","Filter","필터"],
            "sbc.filter0":["全部","全部","All","전체"],
            "sbc.filter1":["新增","新增","New","추가"],
            "sbc.filter2":["临期","即期","Expiring","곧만료"],
            "sbc.filter3":["高评价","高評價","Approval","높은 평가"],
            "loadingclose.text":["数据载入 如卡顿点此关闭","數據載入中 如長時間未響應 請點擊此處關閉","If you encounter stuck, click here to close","데이터 로딩 중, 멈춤 현상이 있으면 여기를 클릭하여 닫기"],
            "quicklist.gotofutbin":["前往FUTBIN查看","前往FUTBIN查看","Go to FUTBIN","FUTBIN으로 이동"],
            "quicklist.auction":["按低价快速拍卖","使用最低價格列入轉會","Quick Auction at Low Price","최저가로 바로 올리기"],
            "emptylist.t":["处理后无符合条件球员","處理後無符合條件球員","No eligible players after processing","처리 후 조건에 맞는 선수 없음"],
            "emptylist.c":["请改变条件或翻页查看","請改變條件或翻頁查看","Please change the criteria or flip the page to view","조건을 변경하거나 페이지를 넘겨서 보세요"],
            "set.title":["FSU设置","FSU設定","FSU Settings","FSU 설정"],
            "set.card.title":["球员卡信息","球員卡資訊","Player Card Information","선수 카드 정보"],
            "set.card.pos":["额外位置","額外位置","Extra Position","추가 포지션"],
            "set.card.price":["球员价格","球員價格","Player Price","선수 가격"],
            "set.card.other":["其他属性","其他屬性","Other Attributes","기타 속성"],
            "set.card.club":["俱乐部内球员","俱樂部內球員","Club Players","클럽 내 선수"],
            "set.card.low":["评分低价","評分低價","Low Rating Price","등급 최저가"],
            "set.sbc.title":["SBC操作","SBC 操作","SBC Operations","SBC 작업"],
            "set.sbc.top":["阵容顶部按钮","陣容頂部按鈕","Top Buttons","스쿼드 상단 버튼"],
            "set.sbc.right":["阵容右侧按钮","陣容右側按鈕","Right-side Buttons","스쿼드 우측 버튼"],
            "set.sbc.quick":["快捷添加球员","快速添加球員","Quick Add Players","빠른 선수 추가"],
            "set.sbc.duplicate":["重复球员填充","重複球員填充","Fill with Duplicate Players","중복 선수로 채우기"],
            "set.sbc.records":["选项记录","選項記錄","Option Records","옵션 기록"],
            "set.sbc.input":["信息输入检索","資訊輸入檢索","Information Input Search","정보 입력 검색"],
            "set.info.title":["信息展示","資訊展示","Information Display","정보 표시"],
            "set.info.obj":["目标顶部显示","目標頂部顯示","Objective top display","목표 상단 표시"],
            "set.info.sbc":["SBC顶部显示","SBC頂部顯示","SBC top display","SBC 상단 표시"],
            "set.info.sbcf":["SBC筛选","SBC篩選","SBC Filters","SBC 필터"],
            "set.info.sbcs":["SBC子任务","SBC子任務","SBC Subtasks","SBC 하위 작업"],
            "set.info.pack":["球员包可开球员","球員包可開球員","Pack PROMO","팩 프로모"],
            "set.info.squad":["阵容价值","陣容價值","Squad Value","스쿼드 가치"],
            "set.style.title":["球员卡信息样式","球員卡資訊樣式","Player Card Information Style","선수 카드 정보 스타일"],
            "set.style.new":["随品质变化","隨品質變化","Varies with Quality","품질에 따라 변화"],
            "set.style.old":["纯色样式","純色樣式","Solid Color Style","단색 스타일"],
            "set.player.title":["选中球员操作","選中球員操作","Select Player Action","선택된 선수 작업"],
            "set.player.auction":["按低价快速拍卖","按低價快速拍賣","Quick Auction at Low Price","최저가로 빠른 경매"],
            "set.player.futbin":["前往FUTBIN查看","前往FUTBIN查看","Go to FUTBIN for Details","자세한 내용은 FUTBIN으로 이동"],
            "quicklist.getprice":["查询拍卖低价","查詢拍賣低價","Search for Auction Price","경매 가격 조회"],
            "quicklist.getpricey":["刷新拍卖低价","重新整理拍賣低價","Refresh Auction Price","경매 가격 새로고침"],
            "set.player.getprice":["查询拍卖低价","查詢拍賣低價","Search for Auction Price","경매 가격 조회"],
            "quicklist.getpricelt":["最低价","最低價","Lowest price","최저가"],
            "quicklist.getpriceload":["读取中","讀取中","Loading","로딩 중"],
            "sbc.swaprating":["替换为同评分","替換為同評分","Replace with the same rating","동일 등급으로 교체"],
            "sbc.squadfill":["SBC方案填充","SBC方案填充","SBC squad autofill","SBC 스쿼드 자동 채우기"],
            "notice.templateload":["读取SBC方案并比价中 请稍后","讀取SBC方案並比價中 請稍後","Reading SBC squad and comparing prices. Please wait.","SBC 방안 읽기 및 가격 비교 중, 잠시 기다려 주세요"],
            "notice.templateerror":["阵容保存失败 请重新尝试","陣容儲存失敗 請重新嘗試","Failed to save the squad. Please try again.","스쿼드 저장 실패, 다시 시도해 주세요"],
            "notice.templatesuccess":["阵容填充成功","陣容填充成功","Squad Filled Successfully","스쿼드 채우기 성공"],
            "notice.templatezero":["无可加载方案 请稍后再试","無可載入的方案 請稍後再試","Squad failed to save, please try again","로드할 방안이 없습니다. 나중에 다시 시도해 주세요"],
            "set.sbc.template":["SBC方案填充","SBC方案填充","SBC squad autofill","SBC 스쿼드 자동 채우기"],
            "notice.marketsetmax":["已修改优化搜索信息可直接搜索 如无结果请返回调整参数","已修改優化搜尋資訊，可直接搜尋。如無結果，請返回調整參數。","Optimizations have been made to the search information. You can now search directly. If there are no results, please return and adjust the parameters.","검색 정보가 최적화되어 직접 검색할 수 있습니다. 결과가 없으면 돌아가서 매개변수를 조정해 주세요"],
            "set.sbc.market":["假想球员拍卖搜索优化","假想球员拍賣搜尋優化","Fantasy Player Auction Search Optimization","가상 선수 경매 검색 최적화"],
            "notice.auctionsuccess":["%1 挂牌 %2 成功","%1 掛牌 %2 成功","%1 listed %2 successfully.","%1 등록 %2 성공"],
            "notice.auctionnoplayer":["%1 没有找到球员","%1 沒有找到球員","%1 player not found.","%1 선수를 찾을 수 없음"],
            "notice.auctionlimits":["%1 FUTBIN价格超出球员限价","%1 FUTBIN價格超出球員限價","The FUTBIN price for %1 exceeds player limit.","%1 FUTBIN 가격이 선수 한도를 초과함"],
            "notice.auctionmax":["已达到拍卖行上限","已達到拍賣行上限","Auction house limit reached.","경매장 한도에 도달"],
            "losa.all":["全选","全選","Select All","전체 선택"],
            "losa.select":["已选球员","已選球員","Selected","선택됨"],
            "losa.price":["共计可售","共計可售","Total","총 판매 가능"],
            "loas.button":["拍卖所选球员","拍賣所選球員","Auction Selected Players","선택된 선수 경매"],
            "loas.popupt":["球员批量挂拍卖提示","球員批量掛拍賣提示","Bulk Auction Listing Reminder for Players","선수 일괄 경매 등록 알림"],
            "loas.popupm":["已选择本列表中 %1 个球员拍卖价格大致为 %2 ，请点击确认开始陆续上架拍卖，途中可点击加载图标下文字取消。","已選擇本列表中 %1 個球員拍賣價格大致為 %2 ，請點擊確認開始陸續上架拍賣，途中可點擊加載圖標下文字取消。","You have selected approximately %1 players from this list, with an estimated auction price of %2. Please click confirm to start listing them for auction one by one. You can click the text below the loading icon to cancel during the process.","이 목록에서 약 %1명의 선수를 선택했으며, 예상 경매 가격은 %2입니다. 확인을 클릭하여 순차적으로 경매에 등록을 시작하세요. 진행 중에 로딩 아이콘 아래 텍스트를 클릭하여 취소할 수 있습니다"],
            "loas.variation":["本版块批量拍卖选择球员调整为 %1 个","本版塊批量拍賣選擇球員調整為 %1 個","Batch auction selection of players in this section is adjusted to %1","이 섹션의 일괄 경매 선택 선수가 %1명으로 조정됨"],
            "loas.start":["程序开始批量售卖球员 预计耗费 %1 秒","程式開始批量售賣球員 預計耗費 %1 秒","The program starts to sell players in bulk, which is expected to take %1 of seconds","프로그램이 선수 일괄 판매를 시작하며, 예상 소요 시간은 %1초입니다"],
            "loadingclose.template1":["读取SBC方案列表中 请稍后","讀取SBC方案列表中 請稍後","Read the list of SBC schemes, please wait","SBC 방안 목록 읽는 중, 잠시 기다려 주세요"],
            "loadingclose.template2":["正在读取方案 %1 阵容 剩余 %2 方案 点此可结束程序","正在讀取和比對方案 %1 陣容 剩餘 %2 方案 點此可結束程式","Reading and comparing plan %1 lineup, remaining %2 plans, click here to end the program","방안 %1 스쿼드 읽기 및 비교 중, 남은 %2 방안, 여기를 클릭하여 프로그램 종료"],
            "loadingclose.loas":["正在挂牌第 %1 个球员 剩余 %2 个 点此可结束程序","正在掛牌第 %1 個球員 剩餘 %2 個 點此可結束程式","The %1 players are being listed, and the remaining %2, click here to end the program","%1번째 선수 등록 중, 남은 %2명, 여기를 클릭하여 프로그램 종료"],
            "set.player.loas":["批量拍卖球员","批量拍賣球員","Bulk Auction Players","선수 일괄 경매"],
            "notice.squaderror":["方案读取失败 可能是FUTBIN无作业方案 请稍后再试","方案讀取失敗 可能是FUTBIN無作業方案 請稍後再試","Scheme reading failed, it may be that FUTBIN has no job scheme, please try again later","방안 읽기 실패, FUTBIN에 작업 방안이 없을 수 있습니다. 나중에 다시 시도해 주세요"],
            "set.getdoc":["查看设置说明","檢視設定說明","View setup instructions","설정 설명 보기"],
            "builder.league":["排除指定联赛球员","排除指定聯賽球員","Exclude designated league","지정 리그 제외"],
            "notice.phoneloas":["请注意手机端挂牌后需重新进入拍卖清单才会刷新显示。","請注意手機端掛牌後需重新進入拍賣清單才會重新整理顯示。","Please note that after listing on the mobile terminal, you need to re-enter the auction list before refreshing the display.","모바일에서 등록 후 경매 목록에 다시 입장해야 새로고침됩니다"],
            "notice.builder":["通过排除后球员数量已不足以填充阵容，如需要请调整条件再次搜索。","通過排除後球員數量已不足以填充陣容，如需要請調整條件再次搜尋。","The number of players after exclusion is no longer sufficient to fill the lineup, please adjust the criteria to search again if necessary.","제외 후 선수 수가 스쿼드를 채우기에 부족합니다. 필요시 조건을 조정하여 다시 검색해 주세요"],
            "notice.conceptdiff":["发现所购买的假想球员有多个版本，已经将非搜索版本的亮度。","發現所購買的假想球員有多個版本，已經將非搜尋版本的亮度。","Found that there are multiple versions of the purchased hypothetical player, the brightness of the non-searched version has been added.","구매한 가상 선수에 여러 버전이 있음을 발견했으며, 검색되지 않은 버전의 밝기가 추가되었습니다"],
            "notice.packback":["已无未分配球员 自动返回","已無未分配球員 自動返回","No unassigned players, automatically return","미할당 선수 없음, 자동 반환"],
            "sbc.swapchem":["替换为默契球员","替換為默契球員","Swap Chemistry Players","케미스트리 선수로 교체"],
            "notice.notchemplayer":["俱乐部中没有满足当前默契需求的球员","俱樂部中沒有滿足當前默契需求的球員","there are no players in the club who meet the current chemistry needs","클럽에 현재 케미스트리 요구사항을 충족하는 선수가 없습니다"],
            "sbc.addchem":["添加默契球员","新增默契球員","Add Chemistry Players","케미스트리 선수 추가"],
            "notice.chemplayerloading":["开始读取满足默契球员 请稍等","開始讀取滿足默契球員 請稍等","Start reading Meet chemistry players, please wait","케미스트리 요구사항을 충족하는 선수 읽기 시작, 잠시 기다려 주세요"],
            "sbc.chemplayer":["默契球员名单","默契球員名單","Chemistry Players List","케미스트리 선수 목록"],
            "notice.noplayer":["已无指定条件球员","已無指定條件球員","No conditions specified player","지정 조건 선수 없음"],
            "squadback.popupt":["阵容回退提示","陣容回退提示","Squad Back Tip","스쿼드 되돌리기 팁"],
            "squadback.popupm":["请注意，阵容回退后将无法再返回到此阵容，还可回退 %1 次。","請注意，陣容回退後將無法再返回到此陣容，還可回退 %1 次。","Note that the squad will no longer be able to return to this lineup after retreating, and can go back %1 times.","주의: 스쿼드를 되돌린 후에는 이 스쿼드로 다시 돌아갈 수 없으며, %1번 더 되돌릴 수 있습니다"],
            "sbc.squadback":["退","退","B","되돌리기"],
            "notice.nosquad":["已无操作记录 无法法回退","已無操作記錄 無法法回退","There is no operation record and cannot be rolled back","작업 기록이 없어 되돌릴 수 없습니다"],
            "tile.settitle":["插件配置","外掛配置","Plugin configuration","플러그인 설정"],
            "tile.settext":["配置FSU功能开关","配置FSU功能開關","Configure FSU function switch","FSU 기능 스위치 설정"],
            "set.sbc.cback":["假想球员购买自动分配","假想球员购买自动分配","Hypothetical player purchase automatic distribution","가상 선수 구매 자동 배정"],
            "set.sbc.sback":["阵容回退","阵容回退","lineup fallback","스쿼드 되돌리기"],
            "swaptradable.btntext":["批量交换可交易","批量交换可交易","Bulk exchange tradable","거래 가능 일괄 교환"],
            "swaptradable.popupt":["批量交换队内可交易球员","批量交换队内可交易球员","Batch exchange of tradable players within the team","팀 내 거래 가능 선수 일괄 교환"],
            "swaptradable.popupm":["点击确定可将未分配中球员与队内可交易球员交换，共可交换 %1 个。","点击确定可将未分配中球员与队内可交易球员交换，共可交换 %1 个。","Click OK to exchange unassigned players with tradable players in the team, for a total of %1 players.","확인을 클릭하면 미할당 선수와 팀 내 거래 가능 선수를 교환할 수 있으며, 총 %1명을 교환할 수 있습니다"],
            "notice.swaptsuccess":["%1 交换成功","%1 交换成功","%1 exchange successful","%1 교환 성공"],
            "notice.swapterror":["%1 交换失败 程序暂停","%1 交换失败 程序暂停","%1 exchange failed, program paused","%1 교환 실패, 프로그램 일시 정지"],
            "loadingclose.swapt":["正在交换第 %1 个球员 剩余 %2 个","正在交换第 %1 个球员 剩余 %2 个","Swap %1 player,%2 remaining","%1번째 선수 교환 중, %2명 남음"],
            "set.player.swapt":["未分配批量交换可交易","未分配批量交換可交易","Unallocated Bulk Exchange Tradable","미할당 일괄 교환 가능"],
            "set.sbc.dupfill":["重复球员填充阵容","重複球員填充陣容","Repeat player fill squad","중복 선수로 스쿼드 채우기"],
            "dupfill.btntext":["重复球员填充阵容","重複球員填充陣容","Repeat player fill squad","중복 선수로 스쿼드 채우기"],
            "autofill.btntext":["一键填充(优先重复)","一鍵填充(優先重複)","One-click fill (priority repeat)","원클릭 채우기(중복 우선)"],
            "set.sbc.icount":["搜索球员数量显示","搜尋球員數量顯示","Search number of players displayed","검색된 선수 수 표시"],
            "set.sbc.autofill":["一键填充球员","一鍵填充球員","One-click fill player","원클릭 선수 채우기"],
            "completion.btntext":["一键补全阵容","一鍵補全陣容","One-click complete lineup","원클릭 스쿼드 완성"],
            "set.sbc.completion":["一键补全阵容","一鍵補全陣容","One-click complete lineup","원클릭 스쿼드 완성"],
            "notice.setsuccess":["设置保存成功","設定儲存成功","Settings saved successfully","설정 저장 성공"],
            "notice.seterror":["设置保存失败 请检查","設定儲存失敗 請檢查","Settings failed to save, please check","설정 저장 실패, 확인해 주세요"],
            "shieldlea.btntext":["排除联赛设置","排除聯賽設定","Exclude league settings","리그 제외 설정"],
            "shieldlea.placeholder":["请输入联赛数字ID和英文逗号","請輸入聯賽數字ID和英文逗號","Please enter the league number ID and English comma","리그 숫자 ID와 영문 쉼표를 입력해 주세요"],
            "squadcmpl.btntext":["阵容补全(优先重复)","陣容補全(優先重複)","Squad completion (priority repeat)","스쿼드 완성(중복 우선)"],
            "squadcmpl.popupt":["阵容补全提示","陣容補全提示","Squad Completion Tips","스쿼드 완성 팁"],
            "squadcmpl.placeholder":["请填入评分和英文逗号组合","請填入評分和英文逗號組合","Please fill in the combination of ratings and English commas","등급과 영문 쉼표 조합을 입력해 주세요"],
            "squadcmpl.placeholder_zero":["无需填充空位","無需填充空位","No need to fill gaps","빈 자리를 채울 필요 없음"],
            "squadcmpl.error":["输入填充评分格式不匹配 无法填充指定评分","輸入填充評分格式不匹配 無法填充指定評分","The input fill score format does not match, and the specified score cannot be filled","입력된 채우기 점수 형식이 일치하지 않아 지정된 점수를 채울 수 없습니다"],
            "set.sbc.squadcmpl":["阵容补全功能","陣容補全功能","Squad completion","스쿼드 완성 기능"],
            "notice.ldatasuccess":["球员数据已全部加载成功","球員資料已全部載入成功","All player data has been loaded successfully","모든 선수 데이터가 성공적으로 로드되었습니다"],
            "notice.ldataerror":["球员数据加载失败 请重刷新页面加载 否则核心功能无法使用","球員資料載入失敗 請重重新整理頁面載入 否則核心功能無法使用","Player data loading failed, please refresh the page to load, otherwise the core functions cannot be used","선수 데이터 로드 실패, 페이지를 새로고침하여 로드해 주세요. 그렇지 않으면 핵심 기능을 사용할 수 없습니다"],
            "loadingclose.ldata":["正在读取球员数据（%1/%2）请耐心等待","正在讀取球員資料（%1/%2）請耐心等待","Reading player data (%1/%2) please be patient","선수 데이터 읽는 중(%1/%2) 기다려 주세요"],
            "uatoclub.btntext":["直接发送%1个至俱乐部","直接傳送%1個至俱樂部","Send %1 directly to the club","%1명을 클럽으로 직접 전송"],
            "uatoclub.success":["直接发送俱乐部成功","直接傳送俱樂部成功","Send directly to the club successfully","클럽으로 직접 전송 성공"],
            "uatoclub.error":["直接发送俱乐部失败 请进入页面自行分配","直接傳送俱樂部失敗 請進入頁面自行分配","Failed to send the club directly, please enter the page to assign it yourself.","클럽으로 직접 전송 실패, 페이지에 입장하여 직접 배정해 주세요"],
            "set.info.skipanimation":["跳过开包动画","跳過開包動畫","Skip the package animation","팩 열기 애니메이션 건너뛰기"],
            "builder.untradeable":["仅限不可交易球员","僅限不可交易球員","Only Untradeable","거래 불가 선수만"],
            "set.player.uatoclub":["未分配外部发送至俱乐部","未分配外部傳送至俱樂部","Unassigned external send to club","미할당 외부를 클럽으로 전송"],
            "douagain.sbctile.title":["快速SBC","快速SBC","Fast SBC","빠른 SBC"],
            "douagain.packtile.title":["快速开包","快速開包","Quick unpacking","빠른 팩 열기"],
            "douagain.sbctile.text":["请先打开或完成SBC","請先開啟或完成SBC","Please open or complete SBC","먼저 SBC를 열거나 완료해 주세요"],
            "douagain.packtile.text":["请先进行开包","請先進行開包","Please open the package first","먼저 팩을 열어주세요"],
            "douagain.error":["出现程序错误无法打开，请重新完成SBC以便继续。","出現程式錯誤無法開啟，請重新完成SBC以便繼續。","A program error failed to open, please complete the SBC again to continue.","프로그램 오류로 열 수 없습니다. 계속하려면 SBC를 다시 완료해 주세요"],
            "douagain.sbctile.state1":["已做%1个","已做%1個","%1 done","%1개 완료"],
            "douagain.sbctile.state2":["可做%1个","可做%1個","Can do %1","%1개 가능"],
            "douagain.sbctile.state3":["已完成","已完成","Completed","완료됨"],
            "set.info.sbcagain":["商店快速SBC","商店快速SBC","Store Express SBC","상점 빠른 SBC"],
            "set.info.packagain":["商店快速开包","商店快速開包","Store quick open pack","상점 빠른 팩 열기"],
            "sbc.infocount":["已完成 %1 个","已完成 %1 個","%1 completed","%1개 완료"],
            "notice.dupfilldiff":["请注意因存在于阵容或屏蔽条件未能全部填充球员","請注意因存在於陣容或遮蔽條件未能全部填充球員","Please note that players are not fully filled due to presence in the lineup or shielding conditions","스쿼드에 존재하거나 차단 조건으로 인해 모든 선수를 채우지 못했습니다"],
            "screenshot.text":["未分配共计 %1 名球员 总价 %2","未分配共計 %1 名球員 總價 %2","Unassigned total %1 players, total price %2","미할당 총 %1명 선수, 총 가격 %2"],
            "packcoin.text":["商店价值：","商店價值：","Store value:","상점 가치: "],
            "sbcrange.title":["评分范围","評分範圍","ratings range","등급 범위"],
            "sbcrange.to":["至","至","to","~"],
            "tile.gptitle":["重载球员","載入球員","Overload player","선수 다시 로드"],
            "tile.gptext":["如有问题可重载入球员","如有問題可重新載入球員","If there is a problem, you can reload the player.","문제가 있으면 선수를 다시 로드할 수 있습니다"],
            "notice.basesbc":["需要完成初始SBC才可显示更多SBC任务","需要完成初始SBC才可顯示更多SBC任務","The initial SBC needs to be completed to show more SBC tasks","더 많은 SBC 작업을 표시하려면 초기 SBC를 완료해야 합니다"],
            "builder.ignorepos":["忽略球员位置","忽略球員位置","Ignore player position","선수 포지션 무시"],
            "transfertoclub.popupt":["发送球员提示","傳送球員提示","Send player tips","선수 전송 팁"],
            "transfertoclub.popupm":["是否要将列表中 %1 名球员发送到俱乐部","是否要將列表中 %1 名球員傳送到俱樂部","Do you want to send %1 players in the list to the club","목록의 %1명 선수를 클럽으로 보내시겠습니까"],
            "readauction.error":["读取球员拍卖信息失败，请重试。","讀取球員拍賣資訊失敗，請重試。","Failed to read player auction information, please try again.","선수 경매 정보 읽기 실패, 다시 시도해 주세요"],
            "buyplayer.success":["购买球员 %1 成功，花费 %2 。","購買球員 %1 成功，花費 %2 。","Purchase player %1 successfully, cost %2.","선수 %1 구매 성공, 비용 %2"],
            "buyplayer.error":["购买球员 %1 失败，%2请稍后再试。","購買球員 %1 失敗，%2請稍後再試。","Purchase of player %1 failed,%2 please try again later.","선수 %1 구매 실패, %2 나중에 다시 시도해 주세요"],
            "buyplayer.error.child1":["被其他用户购买，","被其他使用者購買，","Purchased by other users,","다른 사용자가 구매함, "],
            "buyplayer.error.child2":["金币不足，","金幣不足，","Not enough gold coins,","코인 부족, "],
            "buyplayer.error.child3":["无拍卖信息，","無拍賣資訊，","No auction information,","경매 정보 없음, "],
            "buyplayer.error.child4":["购买超时，","購買超時，","Purchase timed out,","구매 시간 초과, "],
            "buyplayer.error.child5":["未分配物品过多，","未分配物品過多，","Too many unallocated items,","미할당 아이템이 너무 많음, "],
            "buyplayer.sendclub.success":["购买球员 %1 发送俱乐部成功","購買球員 %1 傳送球隊成功","Buy player %1 send team successfully","선수 %1 구매 후 팀 전송 성공"],
            "buyplayer.sendclub.error":["购买球员 %1 发送俱乐部失败","購買球員 %1 傳送球隊失敗","Failed to buy player %1 to send team","선수 %1 구매 후 팀 전송 실패"],
            "readauction.loadingclose":["正在读取最新FUT价格","正在讀取最新FUT價格","Reading the latest FUT prices","최신 FUT 가격 읽는 중"],
            "readauction.loadingclose2":["正在读取拍卖信息","正在讀取拍賣資訊","Reading auction information","경매 정보 읽는 중"],
            "buyplayer.loadingclose":["正在尝试购买球员","正在嘗試購買球員","Trying to buy players","선수 구매 시도 중"],
            "conceptbuy.btntext":["直接购买此球员","直接購買此球員","Buy this player directly","이 선수 직접 구매"],
            "set.sbc.conceptbuy":["假想球员直接购买","概念球員直接購買","Concept player direct purchase","컨셉 선수 직접 구매"],
            "set.player.transfertoclub":["转会发送俱乐部","轉會傳送俱樂部","Transfer sending club","이적 후 클럽으로 전송"],
            "transfertoclub.unable":["%1个球员因重复无法发送","%1個球員因重複無法傳送","%1 player could not be sent due to duplication","%1명의 선수가 중복으로 인해 전송할 수 없음"],
            "numberofqueries.btntext":["查询价格次数","查詢價格次數","Number of price inquiries","가격 조회 횟수"],
            "numberofqueries.popupm":["此处影响在购买球员的查询次数，初次使用futbin读取价格，其后每次按照搜索出结果进行下次查询价格，查询价格变化按照拍卖价格+、-变化，可自行在拍卖输入价格点击+、-后查看，具体规则请阅读说明文档。<br>默认配置为5次，最低可设置为1次，不建议次数过多。","此處影響在購買球員的查詢次數，初次使用futbin讀取價格，其後每次按照搜尋出結果進行下次查詢價格，查詢價格變化按照拍賣價格+、-變化，可自行在拍賣輸入價格點選+、-後檢視，具體規則請閱讀說明文件。<br>預設配置為5次，最低可設定為1次，不建議次數過多。","This affects the number of inquiries in the purchase of players. Use futbin to read the price for the first time, and then check the price for the next time according to the search results. The query price changes according to the auction price + and -. You can enter the price in the auction by yourself and click + and -. Please read the description document for specific rules. < br > The default configuration is 5 times, and the minimum can be set to 1 time. It is not recommended to use too many times.","이는 선수 구매 시 조회 횟수에 영향을 줍니다. 처음에는 futbin을 사용하여 가격을 읽고, 이후에는 검색 결과에 따라 다음 가격을 조회합니다. 조회 가격 변화는 경매 가격 +, -에 따라 변화하며, 경매에서 직접 가격을 입력하고 +, -를 클릭한 후 확인할 수 있습니다. 구체적인 규칙은 설명서를 읽어주세요.<br>기본 설정은 5회이며, 최소 1회로 설정할 수 있습니다. 너무 많은 횟수는 권장하지 않습니다"],
            "numberofqueries.placeholder":["请输入数字 为空重置为5次","請輸入數字 為空重置為5次","Please enter a number, entering empty will reset to 5 times","숫자를 입력해 주세요. 비어있으면 5회로 재설정됩니다"],
            "settingsbutton.phone":["说明、入口、询价","說明、入口、詢價","desc、entrance、query","설명, 입구, 가격 조회"],
            "notice.lockplayer":["锁定球员成功","鎖定球員成功","Lock player successfully","선수 잠금 성공"],
            "notice.unlockplayer":["解锁球员成功","解鎖球員成功","Unlock Player Success","선수 잠금 해제 성공"],
            "locked.unlock":["解锁","解鎖","Unlock","잠금 해제"],
            "locked.lock":["锁定","鎖定","lock","잠금"],
            "locked.tile":["锁定球员","鎖定球員","Lock player","선수 잠금"],
            "locked.navtilte":["锁定球员列表","鎖定球員列表","Lock player list","잠금된 선수 목록"],
            "pack.filter0":["可交易组合包","可交易組合包","Tradeable Pack","거래 가능 팩"],
            "history.title":["搜索历史：","搜尋歷史：","Search history","검색 기록: "],
            "consult.popupt":["请输入导入方案ID或网址","請輸入匯入方案ID或網址","Please enter the import squad ID or URL","가져올 방안 ID 또는 URL을 입력해 주세요"],
            "consult.popupm":["支持导入FUTBIN和FUT.GG两个网站的SBC方案ID或网址，为空则默认读取FUTBIN价格最低的5个方案进行计算。","支援匯入FUTBIN和FUT.GG兩個網站的SBC方案ID或網址，為空則預設讀取FUTBIN價格最低的5個方案進行計算。","Support import FUTBIN and FUT.GG the SBC squad ID or URL of the two websites. If it is empty, read the 5 schemes with the lowest FUTBIN price by default for calculation.","FUTBIN과 FUT.GG 두 웹사이트의 SBC 방안 ID 또는 URL 가져오기를 지원합니다. 비어있으면 기본적으로 FUTBIN 가격이 가장 낮은 5개 방안을 읽어 계산합니다"],
            "consult.placeholder":["在此填入方案ID或网址","在此填入方案ID或網址","Enter the squad ID or URL here","여기에 방안 ID 또는 URL을 입력하세요"],
            "consult.error":["未能识别到有效的方案ID或网址，请重新输入。","未能識別到有效的方案ID或網址，請重新輸入。","Could not identify a valid squad ID or URL, please re-enter.","유효한 방안 ID 또는 URL을 인식할 수 없습니다. 다시 입력해 주세요"],
            "meetsreq.btntext":["替换为满足需求球员","替換為滿足需求球員","Swap Meets Requirements Players","요구사항을 충족하는 선수로 교체"],
            "set.sbc.meetsreq":["替换满足需求球员","替換滿足需求球員","Swap Meets Requirements Players","요구사항을 충족하는 선수로 교체"],
            "meetsreq.error":["俱乐部中没有满足可替换的满足需求球员","俱樂部中沒有滿足可替換的滿足需求球員","There are no replaceable meet requirements players in the club","클럽에 교체 가능한 요구사항 충족 선수가 없습니다"],
            "set.sbc.templatemode":["SBC方案填充输入模式","SBC方案填充輸入模式","SBC squad populate input mode","SBC 방안 채우기 입력 모드"],
            "readauction.loadingclose3":["正在读取价格 %1","正在讀取價格 %1","Reading price %1","가격 %1 읽는 중"],
            "squadcmpl.popupm":["阵容补全即会将假想球员替换为同评分球员、空位替换为所填评分。请填入评分需要数字，以英文逗号组合，单个评分将会替换所有空位，多个将替换指定个数空位。","陣容補全即會將假想球員替換為同評分球員、空位替換為所填評分。請填入評分需要數字，以英文逗號組合，單個評分將會替換所有空位，多個將替換指定個數空位。","Lineup completion will replace hypothetical players with players of the same rating, and vacancies with the filled rating. Please fill in the numbers required for the rating, combined with English commas, a single rating will replace all vacancies, and multiple will replace the specified number of vacancies.","스쿼드 완성은 가상 선수를 동일 등급 선수로, 빈 자리를 입력된 등급으로 교체합니다. 등급에 필요한 숫자를 영문 쉼표와 함께 입력해 주세요. 단일 등급은 모든 빈 자리를 교체하고, 여러 개는 지정된 수의 빈 자리를 교체합니다"],
            "squadcmpl.popupmsup":["模拟计算结果可能略有偏差，可点击按钮前往网站进行自由计算。","模擬計算結果可能略有偏差，可點選按鈕前往網站進行自由計算。","The simulation results may be slightly biased, and you can click the button to go to the website for free calculation.","시뮬레이션 계산 결과에 약간의 편차가 있을 수 있으며, 버튼을 클릭하여 웹사이트에서 자유롭게 계산할 수 있습니다"],
            "shieldlea.popupm":["此处为排除的联赛设置（需开启排除联赛按钮才生效），点击右侧可切换状态，开关旁为此联赛球员数。","此處為排除的聯賽設定（需開啟排除聯賽按鈕才生效），點選右側可切換狀態，開關旁為此聯賽球員數。","Here is the excluded league setting (you need to turn on the excluded league button to take effect), click on the right to switch the status, and the number of players in this league is next to the switch.","여기는 제외된 리그 설정입니다(리그 제외 버튼을 켜야 효과가 있음). 오른쪽을 클릭하여 상태를 전환할 수 있으며, 스위치 옆에는 이 리그의 선수 수가 표시됩니다"],
            "popupButtonsText.44401":["前往网站计算","前往網站計算","Go to the website to calculate","웹사이트로 이동하여 계산"],
            "squadcmpl.simulatedsuccess":["此次模拟补全后阵容评分： %1 ，预估填充球员价值： %2 。","此次模擬補全後陣容評分： %1 ，預估填充球員價值： %2 。","Lineup score after this simulation completion: %1 , estimated fill player value: %2 .","이번 시뮬레이션 완성 후 스쿼드 점수: %1, 예상 채우기 선수 가치: %2"],
            "squadcmpl.simulatederror":["无法模拟补全出阵容，请填充球员、调整排除选项或进入网站计算。","無法模擬補全出陣容，請填充球員、調整排除選項或進入網站計算。","The full lineup cannot be simulated. Please fill in players, adjust exclusion options, or enter the website for calculations.","전체 스쿼드를 시뮬레이션할 수 없습니다. 선수를 채우거나, 제외 옵션을 조정하거나, 웹사이트에서 계산해 주세요"],
            "packfilter.total":["共计：%1   预估：%2","共計：%1   預估：%2","Total:%1   Estimated:%2","총계: %1   예상: %2"],
            "requirements.addbtn":["添加 %1","新增 %1","Add %1","%1 추가"],
            "requirements.swapbtn":["替换为 %1","替換為 %1","Swap %1","%1로 교체"],
            "squadcmpl.popupmsupallconcept":["此次将尝试替换假想球员，不会考虑挑战要求，如无法替换代表无此评分球员。","此次將嘗試替換概念球員，不會考慮挑戰條件，如無法替換代表無此評分球員。","This time, attempts will be made to replace concept players, without considering challenge requirements. If a player cannot be replaced, it means that the player does not have this rating.","이번에는 컨셉 선수를 교체하려고 시도하며, 챌린지 요구사항은 고려하지 않습니다. 교체할 수 없다면 해당 등급의 선수가 없다는 의미입니다"],
            "sbcrange.concepttitle":["假想搜索无评分范围","概念搜尋無評分範圍","Concept Search No Rating Range","컨셉 검색 등급 범위 없음"],
            "searchconcept.sameclub":["搜索同俱乐部假想球员","搜尋同俱樂部概念球員","Search concept from the same club","같은 클럽의 컨셉 선수 검색"],
            "searchconcept.sameleague":["搜索同联赛同地区假想球员","搜尋同聯賽同地區概念球員","Search concept in the same league and nation","같은 리그 같은 국가의 컨셉 선수 검색"],
            "notice.searchconceptloading":["开始搜索指定条件假想球员","開始搜尋指定條件概念球員","Start searching for specified concept players","지정 조건의 컨셉 선수 검색 시작"],
            "subsbcaward.title":["奖励价值：","獎勵價值：","Reward value:","보상 가치: "],
            "subsbcaward.nope":["无法计算","無法計算","Can't count","계산할 수 없음"],
            "sbc.quciktransfers":["转","轉","T","이"],
            "sbc.onlycmpltext":["保留阵容补全仅为方便查看所需评分","保留陣容補全僅為方便檢視所需評分","Keep the squad complete for convenience only to view the required rating","필요한 등급을 편리하게 보기 위해서만 스쿼드 완성을 유지"],
            "set.player.pickbest":["球员挑选最佳提示","球員挑選最佳提示","Player Pick Best Tips","선수 선택 최고 팁"],
            "set.sbc.headentrance":["顶部SBC入口","頂部SBC入口","Top SBC Entrance","상단 SBC 입구"],
            "playerignore.popupt":["SBC忽略球员配置","SBC忽略球員配置","SBC ignore player configuration","SBC 선수 무시 설정"],
            "playerignore.popupm":["配置点击调整后即保存，影响一键填充、阵容补全等处代码，切记谨慎选择。","配置點選調整後即儲存，影響一鍵填充、陣容補全等處程式碼，切記謹慎選擇。","The configuration is saved after clicking Adjust, which affects the code of one-click filling, lineup completion, etc. Remember to choose carefully.","설정은 조정을 클릭한 후 저장되며, 원클릭 채우기, 스쿼드 완성 등의 코드에 영향을 줍니다. 신중하게 선택하는 것을 잊지 마세요"],
            "playerignore.button":["排除球员配置","排除球員配置","Exclude player configuration","선수 제외 설정"],
            "popupButtonsText.44403":["关闭","關閉","close","닫기"],
            "builder.academy":["排除进化球员","排除進化球員","Exclude Evolution","진화 선수 제외"],
            "builder.strictlypcik":["球员挑选严格普通和稀有","球員挑選嚴格普通和稀有","Player Pick SBC Strictly Common and Rare","선수 선택 SBC 엄격한 일반 및 레어"],
            "headentrance.numberset":["顶部入口数量配置","頂部入口數量配置","Top entrance number","상단 입구 수량 설정"],
            "popupButtonsText.44404":["前往设置排除联赛","前往設定排除聯賽","Go to Settings Exclusion League","리그 제외 설정으로 이동"],
            "popupButtonsText.44405":["前往设置黄金球员范围","前往設定黃金球員範圍","Go to Set Golden Player Range","골드 선수 범위 설정으로 이동"],
            "goldenplayer.popupmt":["黄金球员范围设置","黃金球員範圍設定","Golden Player Range Settings","골드 선수 범위 설정"],
            "goldenplayer.popupm":["默认黄金球员最高为83，如想设定请填入后点击确定，最小值为76。为空则恢复默认值。","預設黃金球員最高為83，如想設定請填入後點選確定，最小值為76。為空則恢復預設值。","The default gold player is up to 83. If you want to set it, please fill in and click OK. The minimum value is 76. If it is empty, restore the default value.","기본 골드 선수는 최대 83입니다. 설정하려면 입력 후 확인을 클릭하세요. 최소값은 76입니다. 비어있으면 기본값으로 복원됩니다"],
            "goldenplayer.placeholder":["请输入两位数字、最低76、最高99","請輸入兩位數字、最低76、最高99","Please enter two digits, minimum 76, maximum 99","두 자리 숫자를 입력해 주세요. 최소 76, 최대 99"],
            "headentrance.popupmt":["顶部SBC入口数量设置","頂部SBC入口數量設定","Top SBC Entry Quantity Settings","상단 SBC 입구 수량 설정"],
            "headentrance.popupm":["默认电脑端为5个、手机端为3个，请输入数字改变数量，最高不能超过8个。为空则恢复默认值。","預設電腦端為5個、手機端為3個，請輸入數字改變數量，最高不能超過8個。為空則恢復預設值。","The default is 5 on the computer and 3 on the mobile phone. Please enter the number to change the number, and the maximum cannot exceed 8. If it is empty, restore the default value.","기본값은 컴퓨터에서 5개, 모바일에서 3개입니다. 숫자를 입력하여 수량을 변경하세요. 최대 8개를 초과할 수 없습니다. 비어있으면 기본값으로 복원됩니다"],
            "headentrance.placeholder":["请输入1位数字、最低为1、最高为8","請輸入1位數字、最低為1、最高為8","Please enter 1 digit, minimum 1, maximum 8","1자리 숫자를 입력해 주세요. 최소 1, 최대 8"],
            "sbc.swapgold":["快速替换为同评分黄金","快速替換為同評分黃金","Quickly replace with gold of the same rating","동일 등급의 골드로 빠르게 교체"],
            "bibconcept.btntext":["批量购买假想球员","批量購買假想球員","Buy concept players in bulk","컨셉 선수 일괄 구매"],
            "readauction.progress":["购买进度：%1/%2","購買進度：%1/%2","Purchase progress:%1/%2","구매 진행률: %1/%2"],
            "buyplayer.getinfo.error":["读取球员信息失败，请重试。","讀取球員資訊失敗，請重試。","Reading player information failed. Please try again.","선수 정보 읽기 실패, 다시 시도해 주세요"],
            "buyplayer.bibresults":["批量购买结束，成功 %1 个，失败 %2 个，共花费%3。","批量購買結束，成功 %1 個，失敗 %2 個，共花費%3。","Bulk purchase completed, %1 successful, %2 failed, total cost %3.","일괄 구매 완료, 성공 %1개, 실패 %2개, 총 비용 %3"],
            "builder.ignorepos.short":["忽略位置","忽略位置","Ignore position","포지션 무시"],
            "builder.goldenrange.short":["黄金范围：≤%1","黃金範圍：≤%1","Gold Range:≤%1","골드 범위: ≤%1"],
            "builder.strictlypcik.short":["严格稀有普通","嚴格稀有普通","Strictly rare common","엄격한 레어 일반"],
            "builder.comprange":["阵容补全黄金范围（75-%1）内优先稀有","陣容補全黃金範圍（75-%1）內優先稀有","Squad Completion Priority Rare within Gold Range (75-%1)","골드 범위(75-%1) 내에서 스쿼드 완성 우선 레어"],
            "builder.comprange.short":["≤%1优先稀有","≤%1優先稀有","≤%1 Priority Rare","≤%1 우선 레어"],
            "builder.comprare":["阵容补全优先非特殊球员","陣容補全優先非特殊球員","Squad Completion Priority Non-Special Players","스쿼드 완성 우선 비특수 선수"],
            "builder.comprare.short":["优先非特殊","優先非特殊","Priority non-special","우선 비특수"],
            "academy.btntext":["查看 %1 进化","檢視 %1 進化","View %1 Evolution","%1 진화 보기"],
            "academy.freetips":["免费进化","免費進化","Free Evolution","무료 진화"],
            "academy.bio.add":["+ %1","+ %1","+ %1","+ %1"],
            "academy.bio.change":["变化","變化","change","변화"],
            "academy.bio.upgrade":["升级","升級","upgrade","업그레이드"],
            "academy.bio.new":["新增","新增","new","새로 추가"],
            "loas.input":["可填入修改挂牌时间","可填入修改掛牌時間","You can fill in to modify the listing time.","등록 시간을 수정하여 입력할 수 있습니다"],
            "loas.input.tips":["请按小时为基准填入，默认和1为1小时、3为3小时、6为6小时、12为12小时、24为1天、72为3天，不支持其他时间。","請按小時為基準填入，預設和1為1小時、3為3小時、6為6小時、12為12小時、24為1天、72為3天，不支援其他時間。","Please fill in the hours as the basis, the default and 1 is 1 hour, 3 is 3 hours, 6 is 6 hours, 12 is 12 hours, 24 is 1 day, 72 is 3 days, other times are not supported.","시간을 기준으로 입력해 주세요. 기본값과 1은 1시간, 3은 3시간, 6은 6시간, 12는 12시간, 24는 1일, 72는 3일이며, 다른 시간은 지원되지 않습니다"],
            "loas.input.error":["填入挂牌时间错误，请务必按照说明填写。","填入掛牌時間錯誤，請務必按照說明填寫。","Fill in the wrong listing time, please be sure to follow the instructions.","등록 시간 입력 오류, 반드시 설명에 따라 작성해 주세요"],
            "returns.text":["平均回报：","平均回報：","Avg Returns:","평균 수익: "],
            "notice.submitrepeat":["阵容中有未分配不可交易版本，将自动替换并提交阵容。","陣容中有未分配不可交易版本，將自動替換並提交陣容。","If there is an unassigned non-tradable version in the lineup, it will be automatically replaced and submitted.","스쿼드에 미할당 거래 불가 버전이 있으면 자동으로 교체되어 제출됩니다"],
            "fastsbc.popupt":["快速任务提示","快速任務提示","Quick SBC Tip","빠른 SBC 팁"],
            "fastsbc.popupm":["此模式将快速执行指定SBC，优先未分配和进行排除选项，不会识别未分配可交易替换功能。此为实验功能谨慎使用，过量可能导致BAN提交等不知名惩罚，且可能提交掉你的有价值球员。确认后本次使用插件将不再提示。","此模式將快速執行指定SBC，優先未分配和進行排除選項，不會識別未分配可交易替換功能。此為實驗功能謹慎使用，過量可能導致BAN提交等不知名懲罰，且可能提交掉你的有價值球員。確認後本次使用外掛將不再提示。","This mode will quickly execute the specified SBC, give priority to unassigned and exclude options, and will not recognize unassigned tradable replacements. This is an experimental feature to use with caution. Excessive use may lead to unknown penalties such as BAN submission, and may submit your valuable players. After confirmation, this use of the plugin will no longer prompt.","이 모드는 지정된 SBC를 빠르게 실행하며, 미할당을 우선하고 제외 옵션을 진행하며, 미할당 거래 가능 교체 기능을 인식하지 않습니다. 이는 실험적 기능이므로 신중하게 사용하세요. 과도한 사용은 BAN 제출 등 알 수 없는 처벌을 받을 수 있으며, 가치 있는 선수를 제출할 수 있습니다. 확인 후 이번 플러그인 사용 시 더 이상 알림이 표시되지 않습니다"],
            "fastsbc.success":["快速任务成功，请适度使用切勿过于频繁。","快速任務成功，請適度使用切勿過於頻繁。","The quick SBC is successful, please use it in moderation and not too frequently.","빠른 SBC 성공, 적당히 사용하고 너무 자주 사용하지 마세요"],
            "fastsbc.title":["重复球员可快速完成 %1 个SBC","重複球員可快速完成 %1 個SBC","Repeat players can quickly complete %1 SBC","중복 선수로 %1개 SBC를 빠르게 완성할 수 있습니다"],
            "fastsbc.sbcbtntext":["一键完成(%1)","一鍵完成(%1)","Completion(%1)","원클릭 완성(%1)"],
            "players.bodytype_1":["中等偏瘦的通用体型","中等偏瘦的通用體型","Average and lean universal body type","평균 키에 마른 범용 체형"],
            "players.bodytype_2":["中等正常的通用体型","中等正常的通用體型","Average and normal universal body type","평균 키에 보통 범용 체형"],
            "players.bodytype_3":["中等结实的通用体型","中等結實的通用體型","Average and stocky universal body type","평균 키에 건장한 범용 체형"],
            "players.bodytype_4":["高个偏瘦的通用体型","高個偏瘦的通用體型","Tall and lean universal body type","큰 키에 마른 범용 체형"],
            "players.bodytype_5":["高个正常的通用体型","高個正常的通用體型","Tall and normal universal body type","큰 키에 보통 범용 체형"],
            "players.bodytype_6":["高个结实的通用体型","高個結實的通用體型","Tall and stocky universal body type","큰 키에 건장한 범용 체형"],
            "players.bodytype_7":["矮个偏瘦的通用体型","矮個偏瘦的通用體型","Short and lean universal body type","작은 키에 마른 범용 체형"],
            "players.bodytype_8":["矮个正常的通用体型","矮個正常的通用體型","Short and normal universal body type","작은 키에 보통 범용 체형"],
            "players.bodytype_9":["矮个结实的通用体型","矮個結實的通用體型","Short and stocky universal body type","작은 키에 건장한 범용 체형"],
            "players.bodytype_15":["未知体型","未知體型","Unknown body type ","알 수 없는 체형 "],
            "players.bodytype_11":["非常高且瘦的通用体型","非常高且瘦的通用體型","Very tall and lean universal body type","매우 큰 키에 마른 범용 체형"],
            "players.bodytype_12":["偏瘦的定制体型","偏瘦的定製體型","Lean unique body type","마른 고유 체형"],
            "players.bodytype_13":["正常的定制体型","正常的定製體型","Normal unique body type","보통 고유 체형"],
            "players.bodytype_14":["结实的定制体型","結實的定製體型","Stocky unique body type","건장한 고유 체형"],
            "plyers.bodytype.popupm":["当前模型【%1】其表现为：%2，代表视觉感受的宽度和高度。可以理解为矮的腿短盘带好、高的腿长拦截好、瘦的窄灵活、壮的宽能撞。<br/><br/>定制体型不用高低区分都是扫描球员，静止时可能差距不大，但在运动中会更丝滑流畅或拥有专属击球、拦截、花式等动作。","當前模型【%1】其表現為：%2，代表視覺感受的寬度和高度。可以理解為矮的腿短盤帶好、高的腿長攔截好、瘦的窄靈活、壯的寬能撞。<br/><br/>定製體型不用高低區分都是掃描球員，靜止時可能差距不大，但在運動中會更絲滑流暢或擁有專屬擊球、攔截、花式等動作。","The body type [ %1 ] behaves as: %2 , which represents the width and height of visual perception. It can be understood as short legs with good dribbling, tall legs with good interception, lean narrow and flexible, and stocky wide can hit.<br/><br/>Unique body type does not need to be distinguished between tall and short. It may not look that different, but it will be silkier and smoother in motion or have exclusive hitting, intercepting, fancy and other actions.","체형 [%1]의 특성: %2, 이는 시각적 인식의 폭과 높이를 나타냅니다. 키 작은 선수는 다리가 짧아 드리블이 좋고, 키 큰 선수는 다리가 길어 인터셉트가 좋으며, 마른 선수는 좁고 유연하고, 건장한 선수는 넓어서 몸싸움이 좋다고 이해할 수 있습니다.<br/><br/>고유 체형은 키 크고 작음을 구분할 필요가 없으며 모두 스캔된 선수입니다. 정지 상태에서는 차이가 크지 않을 수 있지만, 움직일 때 더 부드럽고 매끄럽거나 전용 슈팅, 인터셉트, 기술 등의 동작을 가집니다"],
            "plyers.bodytype.popupt":["球员模型说明","球員模型說明","Player body type description","선수 체형 설명"],
            "plyers.relo.popupt":["球员职责评级说明","球員職責評級說明","Player Role Rating Description","선수 역할 등급 설명"],
            "popupButtonsText.44406":["前往 Easysbc 查看","前往 Easysbc 檢視","Go to Easysbc to view","Easysbc로 이동하여 보기"],
            "fastsbc.entertips":["进入后可快速完成","進入後可快速完成","Quick completion upon entry","입장 후 빠른 완성"],
            "fastsbc.error_1":["提交失败，SBC无次数。","提交失敗，SBC無次數。","Submit failed, SBC no number of times.","제출 실패, SBC 횟수 없음"],
            "fastsbc.error_2":["提交失败，SBC无法完成，需完成关联任务重置。","提交失敗，SBC無法完成，需完成關聯任務重置。","Submit failed, the SBC cannot be completed, and the associated task reset needs to be completed.","제출 실패, SBC를 완료할 수 없으며, 연관된 작업 재설정을 완료해야 함"],
            "fastsbc.error_3":["提示失败，满足条件球员不足。","提示失敗，滿足條件球員不足。","Submit failed, insufficient players meet the conditions.","제출 실패, 조건을 충족하는 선수 부족"],
            "fastsbc.error_4":["提交失败，交换可交易球员失败，请重试。","提交失敗，交換可交易球員失敗，請重試。","Submit failed, exchange of tradable players failed, please try again.","제출 실패, 거래 가능 선수 교환 실패, 다시 시도해 주세요"],
            "set.card.meta":["球员元评分&排名","球員元評分&排名","Player Meta Rating & Rank","선수 메타 등급 및 순위"],
            "fastsbc.error_5":["提交失败，大概率是BAN SBC，请过段时间再试。","提交失敗，大概率是BAN SBC，請過段時間再試。","Submit failed, most likely BAN SBC, please try again after a while.","제출 실패, SBC BAN 가능성이 높음, 잠시 후 다시 시도해 주세요"],
            "sbccount.btntext":["SBC计数：%1","SBC計數：%1","SBC count: %1","SBC 카운트: %1"],
            "sbccount.popupt":["SBC计数说明","SBC計數說明","SBC Counting Instructions","SBC 카운트 설명"],
            "sbccount.popupm":["此处仅计算插件运行状态下运行设备当日提交的SBC数量，请自行斟酌是否继续提交SBC。<br/>目前传闻是1小时内超过90个即有可能被禁止提交SBC，等待1到24小时解禁，具体规则EA未披露。","此處僅計算外掛執行狀態下執行裝置當日提交的SBC數量，請自行斟酌是否繼續提交SBC。<br/>目前傳聞是1小時內超過90個即有可能被禁止提交SBC，等待1到24小時解禁，具體規則EA未披露。","Here only the number of SBC submitted by the running device on the day when the plug-in is running is calculated. Please decide whether to continue submitting SBC. <br/> At present, it is rumored that more than 90 SBC submissions may be banned within 1 hours, and wait 1 to 24 hours for the ban to be lifted.","여기서는 플러그인 실행 상태에서 실행 장치가 당일 제출한 SBC 수량만 계산됩니다. SBC 제출을 계속할지 여부를 스스로 판단해 주세요.<br/>현재 소문에 따르면 1시간 내에 90개 이상 제출하면 SBC 제출이 금지될 수 있으며, 1~24시간 대기 후 해제됩니다"],
            "meta.role.unknown":["未知","未知","Unknown","알 수 없음"],
            "plyers.relo.popupm":["推荐职责【%1】，搭配默契风格【%2】，职责概述：<br/><br/>%3<br/><br/>%4<br/><br/>同职责满默契度级别：%5（%6），各级别含义：S（前1-10）、A（11-50）、B（51-100）、C（101-300）、D代表其他，门将因较少只到C级，？代表无数据。<br/><br/>仅评分前3000名的数据，+和++代表额外的熟悉度，可点击下方按钮前往查看。","推薦職責【%1】，搭配默契風格【%2】，職責概述：<br/><br/>%3<br/><br/>%4<br/><br/>同職責滿默契度級別：%5（%6），各級別含義：S（前1-10）、A（11-50）、B（51-100）、C（101-300）、D代表其他，門將因較少只到C級，？代表無資料。<br/><br/>僅評分前3000名的資料，+和++代表額外的熟悉度，可點選下方按鈕前往檢視。","Recommended player role [%1], with tacit chemistry style [%2], overview of responsibilities: <br/><br/>%3<br/><br/>%4<br/><br/>Same role and  3 Chemistry points level:%5(%6), meaning at all levels: S(1-10) , A(11-50) , B(51-100) , C(101-300) , D for remaining, the GK is only at level C due to less, ? means no data. <br/><br/>Only the data of the top 3,000 are ratings, + and ++ represent additional familiarity, you can click the button below to view.","추천 선수 역할 [%1], 팀 케미스트리 스타일 [%2], 역할 개요: <br/><br/>%3<br/><br/>%4<br/><br/>동일 역할 만점 케미스트리 레벨:%5(%6), 각 레벨 의미: S(1-10위), A(11-50위), B(51-100위), C(101-300위), D는 기타, 골키퍼는 수가 적어 C급까지만, ?는 데이터 없음을 의미. <br/><br/>상위 3,000명의 등급 데이터만, +와 ++는 추가 숙련도를 나타내며, 아래 버튼을 클릭하여 확인할 수 있습니다"],
            "plyers.relo.popupm.v1":["可调整侧重点：%1，请根据球员属性信息自行设置。","可調整側重點：%1，請根據球員屬性資訊自行設定。","Adjustable Variations:%1, please set it yourself according to player attribute information.","조정 가능한 변형:%1, 선수 속성 정보에 따라 직접 설정해 주세요"],
            "plyers.relo.popupm.v2":["职责可能在不同的位置存在，请根据位置、熟悉度等信息自行选择，并根据球员属性信息选择侧重点。","職責可能在不同的位置存在，請根據位置、熟悉度等資訊自行選擇，並根據球員屬性資訊選擇側重點。","Role may exist in different positions, please choose your own according to the positions, familiarity and other information, and choose the variations according to the player attribute information.","역할은 다른 포지션에 존재할 수 있으니, 포지션, 숙련도 등의 정보에 따라 직접 선택하고, 선수 속성 정보에 따라 변형을 선택해 주세요"],
            "storage.tile":["SBC仓库","SBC倉庫","SBC Storage","SBC 창고"],
            "storage.navtilte":["SBC仓库球员列表","SBC倉庫球員列表","SBC Storage player list","SBC 창고 선수 목록"],
            "storage.setclub.text":["共计 %1 名球员可发送回俱乐部","共計 %1 名球員可傳送回俱樂部","A total of %1 players can be sent back to the club","총 %1명의 선수를 클럽으로 다시 보낼 수 있습니다"],
            "storage.setclub.button":["批量发送","批量傳送","Bulk Send","일괄 전송"],
            "sbc.qucikstorage":["仓","倉","S","창"],
            "tile.dodotitle":["插件讨论","外掛討論","plugin discussion","플러그인 토론"],
            "tile.dodotext":["欢迎反馈和讨论","歡迎反饋和討論","We welcome feedback and discussion","피드백과 토론을 환영합니다"],
            "trypack.button.text":["试一下","試一下","Try it.","시도해보기"],
            "trypack.button.subtext":["模拟开包","模擬開包","simulated","시뮬레이션"],
            "trypack.foot.info1_1":["售价：","售價：","Price:","가격: "],
            "trypack.foot.info1_2":["本次模拟开包共 %1 个球员、 %2 个特殊版本","本次模擬開包共 %1 個球員、 %2 個特殊版本","This simulation total of %1 players, including %2 special","이번 시뮬레이션 총 %1명 선수, %2명 특수 선수 포함"],
            "trypack.foot.info2_1":["本包预期回报：","本包預期回報：","Average Returns:","평균 수익: "],
            "trypack.foot.info2_2":["本次开包价值：","本次開包價值：","This value:","이번 가치: "],
            "trypack.foot.info2_3":["对比预期：","對比預期：","Difference：","차이: "],
            "trypack.foot.info3":["此功能是通过EA公示概率模拟出的开启后获得的球员效果，此过程中不会与EA有数据交互，不会对你此后开包有所影响，仅供娱乐、切勿当真。","此功能是通過EA公示概率模擬出的開啟後獲得的球員效果，此過程中不會與EA有資料互動，不會對你此後開包有所影響，僅供娛樂、切勿當真。","This function is a player effect obtained after opening simulated by EA's publicity probability. It is for entertainment only and should not be taken seriously.","이 기능은 EA 공개 확률로 시뮬레이션된 개봉 후 얻는 선수 효과입니다. 오락용으로만 사용하며 진지하게 받아들이지 마세요"],
            "trypack.popup.suffix":["（模拟开包）","（模擬開包）","(Simulate)","(시뮬레이션)"],
            "trypack.button.again":["再来一次","再來一次","Try Again","다시 시도"],
            "builder.firststorage":["优先使用球员仓库球员","優先使用球員倉庫球員","Priority to use player storage players","선수 창고 선수 우선 사용"],
            "builder.firststorage.short":["优先仓库球员","優先倉庫球員","Priority storage","우선 창고"],
            "listfilter.title_1":["评分排序","評分排序","Rating Sort","등급 정렬"],
            "listfilter.title_2":["范围","範圍","Scope","범위"],
            "listfilter.title_3":["位置","位置","Position","포지션"],
            "listfilter.title_4":["默契排序","默契排序","Chem Sort","케미스트리 정렬"],
            "listfilter.text.all":["全部","全部","ALL","전체"],
            "listfilter.text.only":["仅%1","僅%1","%1 only","%1만"],
            "listfilter.text.storage":["仓库","倉庫","Storage","창고"],
            "listfilter.text.asc":["升序","升序","ASC","오름차순"],
            "listfilter.text.desc":["降序","降序","DESC","내림차순"],
            "listfilter.text.club":["俱乐部","球會","Club","클럽"],
            "fastsbc.nosbcdata":["快速SBC：首次需进入SBC页面读取信息后才会显示","快速SBC：首次需進入SBC頁面讀取資訊後才會顯示","Quick SBC: It will not be displayed until you enter the SBC page to read the information for the first time.","빠른 SBC: 처음 SBC 페이지에 입장하여 정보를 읽기 전까지는 표시되지 않습니다"],
            "academy.btntext2":["查看可进化任务","檢視可進化任務","View Evolutions","진화 보기"],
            "shieldflag.btntext":["可使用特殊球员设置","可使用特殊球員設定","Use Rarity Player Settings","희귀도 선수 설정 사용"],
            "shieldflag.popupm":["此处开启将会使用此稀有度的球员（需开启可使用特殊球员按钮才可生效），点击右侧可切换状态，开关旁为此稀有度球员数。","此處開啟將會使用此稀有度的球員（需開啟可使用特殊球員按鈕才可生效），點選右側可切換狀態，開關旁為此稀有度球員數。","Open the player who will use this rarity here (you need to turn on the button to use rarity players to take effect), click on the right to switch the status, and the number of players with this rarity next to the switch.","여기서 이 희귀도를 사용할 선수를 열 수 있습니다(희귀도 선수 사용 버튼을 켜야 효과가 있음). 오른쪽을 클릭하여 상태를 전환할 수 있으며, 스위치 옆에는 이 희귀도의 선수 수가 표시됩니다"],
            "builder.flag":["可使用特殊球员","可使用特殊球員","Use Rarity Player","희귀도 선수 사용"],
            "builder.flag.short":["可使用特殊(%1)","可使用特殊(%1)","Use Rarity(%1)","희귀도 사용(%1)"],
            "builder.league.short":["排除联赛(%1)","排除聯賽(%1)","Exclude league(%1)","리그 제외(%1)"],
            "builder.untradeable.short":["排除可交易","排除可交易","Exclude tradable","거래 가능 제외"],
            "builder.academy.short":["排除进化","排除進化","Exclude evolution","진화 제외"],
            "popupButtonsText.44407":["前往设置可使用特殊球员","前往設定可使用特殊球員","Go to Settings Use Rarity Player","희귀도 선수 사용 설정으로 이동"],
            "valuableplayer.popupt":["珍贵球员提示","珍貴球員提示","Priceless player tips","소중한 선수 팁"],
            "valuableplayer.popupm":["发现提交阵容中拥有 %1 名珍贵球员（红色价格）显示，请决定是否继续提交。","發現提交陣容中擁有 %1 名珍貴球員（紅色價格）顯示，請決定是否繼續提交。","If the submitted lineup contains %1 valuable players (indicated in red), please decide whether to proceed with the submission.","제출할 스쿼드에 %1명의 소중한 선수(빨간색으로 표시)가 포함되어 있습니다. 제출을 진행할지 결정해 주세요"],
            "popupButtonsText.44408":["继续","繼續","Continue","계속"],
            "popupButtonsText.44409":["放弃","放棄","Give up","포기"],
            "sbcneedslist.popupt":["SBC需求球员统计","SBC需求球員統計","SBC required player statistics.","SBC 필요 선수 통계"],
            "sbcneedslist.popupm":["请注意此处计算不会计算周黑或特殊需求，仅计算每个需求阵容评分的SBC。<br>计算结果和价值均依托于评分FUTBIN最低价值，可能和实际使用略有偏差，仅供参考现有库存与实际完成的差异。","請注意此處計算不會計算周黑或特殊需求，僅計算每個需求陣容評分的SBC。<br>計算結果和價值均依託於評分FUTBIN最低價值，可能和實際使用略有偏差，僅供參考現有庫存與實際完成的差異。","Please note that the calculations here will not include TOTW or special requests, only the SBC of each demand lineup score.<br>The calculation results and value are based on the lowest value of the FUTBIN score, which may slightly deviate from the actual use, and are for reference only for the difference between the existing inventory and the actual completion.","여기서의 계산은 TOTW나 특수 요구사항을 포함하지 않으며, 각 요구 스쿼드 점수의 SBC만 계산합니다.<br>계산 결과와 가치는 FUTBIN 점수의 최저값을 기준으로 하며, 실제 사용과 약간의 편차가 있을 수 있고, 기존 보유량과 실제 완성의 차이만 참고용입니다"],
            "popupButtonsText.44410":["下载欠缺球员数量（txt）","下載欠缺球員數量（txt）","Download the number of missing players (txt).","부족한 선수 수량 다운로드 (txt)"],
            "sbcneedslist.title_1":["评分","評分","Rating","등급"],
            "sbcneedslist.title_2":["需求","需求","Need","필요"],
            "sbcneedslist.title_3":["已有","已有","Hold","보유"],
            "sbcneedslist.title_4":["欠缺","欠缺","Lack","부족"],
            "sbcneedslist.title_5":["欠缺价格","欠缺價格","Lack of price","부족 가격"],
            "sbcneedslist.total":["总","總","Total","총 판매 가능"],
            "sbcneedslist.btn":["需求数量计算","需求數量計算","Need calculation","필요량 계산"],
            "fastsbc.add":["添加为快捷任务","新增為快捷任務","Add Fast SBC","빠른 SBC 추가"],
            "fastsbc.del":["取消快捷任务","取消快捷任務","Cancel Fast SBC","빠른 SBC 취소"],
            "notice.addfastsbc":["添加快捷任务（%1）成功","新增快捷任務（%1）成功","Adding Fast SBC (%1) was successful.","빠른 SBC (%1) 추가 성공"],
            "notice.delfastsbc":["取消快捷任务（%1）成功","取消快捷任務（%1）成功","Canceling Fast SBC (%1) was successful.","빠른 SBC (%1) 취소 성공"],
            "realprob.popupt":["%1 - 真实概率","%1 - 真實概率","%1 - Real Probability","%1 - 실제 확률"],
            "realprob.popupm":["此处为拉取FUTNEXT真实开包后的数据，可能与EA公布概率差距较大，数据仅供参考。<br>EA概率可能存在其未公布或无法匹配到，请见谅。","此處為拉取FUTNEXT真實開包後的資料，可能與EA公佈概率差距較大，資料僅供參考。<br>EA概率可能存在其未公佈或無法匹配到，請見諒。","This section pulls data from the real opening of FUTNEXT packs, which may significantly differ from the probabilities announced by EA. The data is provided for reference only. <br>EA may have unannounced or unmatched probabilities; please understand.","이 섹션은 FUTNEXT의 실제 팩 개봉 데이터를 가져오며, EA가 발표한 확률과 크게 다를 수 있습니다. 데이터는 참고용으로만 제공됩니다. <br>EA는 발표하지 않았거나 일치하지 않는 확률이 있을 수 있으니 양해 바랍니다"],
            "realprob.title_1":["稀有度","稀有度","Rarity","희귀도"],
            "realprob.title_2":["EA概率","EA概率","EA probability","EA 확률"],
            "realprob.title_3":["真实概率","真實概率","Real probability","실제 확률"],
            "realprob.title_4":["需要开启","需要開啟","Need to open","개봉 필요"],
            "realprob.btn":["真实概率","真實概率","Real Prob","실제 확률"],
            "autobuy.nav.tilte":["球员自动购买","球員自動購買","Player Auto-Buy","선수 자동 구매"],
            "autobuy.noresult.title":["请先搜索球员","請先搜尋球員","Search for players first","먼저 선수를 검색하세요"],
            "autobuy.noresult.text":["在上方输入名称搜索","在上方輸入名稱搜尋","Type player name above to search","위에 선수 이름을 입력하여 검색"],
            "autobuy.noselected.notice":["请输入并选择后再搜索","請輸入並選擇後再搜尋","Please enter and select before searching","검색 전에 입력하고 선택해 주세요"],
            "autobuy.tile.title":["球员自动购买","球員自動購買","Player Auto-Buy","선수 자동 구매"],
            "autobuy.tile.content":["测试版，如出现问题请停止使用。","測試版，如出現問題請停止使用。","Please stop using the test version if any issues arise.","문제가 발생하면 테스트 버전 사용을 중단해 주세요"],
            "autobuy.tabs.text0":["操作","操作","Operation","작업"],
            "autobuy.tabs.text1":["信息","日誌","Log","로그"],
            "autobuy.info.title":["购买信息","購買資訊","Purchase information","구매 정보"],
            "autobuy.info.mintext":["最低购买价格","最低購買價格","Min price","최저 가격"],
            "autobuy.info.maxtext":["最高购买价格","最高購買價格","Max price","최고 가격"],
            "autobuy.info.numtext":["购买数量","購買數量","Quantity","수량"],
            "autobuy.list.title0":["最新挂牌","最新掛牌","Latest shelf","최신 등록"],
            "autobuy.list.title1":["最新成交","最新成交","Latest trade","최신 거래"],
            "autobuy.list.text0":["无近期记录","無近期記錄","No record","기록 없음"],
            "autobuy.list.text1":["奖励物品","獎勵物品","Reward items","보상 아이템"],
            "autobuy.list.text2":["不可交易","不可交易","Untradeable","거래 불가"],
            "autobuy.info.setprice":["使用最近挂牌","使用最近掛牌","Use latest listing","최근 등록 사용"],
            "autobuy.info.gotosales":["查看拍卖历史","檢視拍賣歷史","Auctions history","경매 기록"],
            "fastsbc.tab.text":["快速完成","快速完成","Fast","빠른"],
            "builder.sabfirstcommon":["青铜和白银球员优先普通","青銅和白銀球員優先普通","Bronze/Silver: common first","브론즈/실버: 일반 우선"],
            "openpack.unassigned.notice":["有未分配球员，请先分配后再尝试开包。","有未分配球員，請先分配後再嘗試開包。","You have unassigned players. Please assign them before opening a pack.","미할당 선수가 있습니다. 팩을 열기 전에 먼저 배정해 주세요"],
            "openpack.openerror.notice":["开包失败，错误代码：%1，请重新进入商店刷新列表。","開包失敗，錯誤代碼：%1，請重新進入商店刷新列表。","Pack opening failed (Error code: %1). Please return to the Store and refresh the list.","팩 열기 실패 (오류 코드: %1). 상점으로 돌아가서 목록을 새로고침해 주세요"],
            "openpack.progress.loadertext1":["正在打开 %1","正在打開 %1","Opening %1 ...","%1 여는 중..."],
            "openpack.progress.loadertext2":["开启进度 %1/%2 点击此处可暂停程序","開啟進度 %1/%2，點擊此處可暫停程序","Opening progress %1/%2 . Tap to pause.","열기 진행률 %1/%2. 탭하여 일시정지"],
            "openpack.packnotenough.notice":["当前 %1 共计 %2 个，无法开启 %3 个。","當前 %1 共計 %2 個，無法開啟 %3 個。","Insufficient %1: %2 available, but %3 required.","%1 부족: %2개 보유, %3개 필요"],
            "openpack.result.popupt":["开包结果 - %1","開包結果 - %1","Pack Opening Result - %1","팩 열기 결과 - %1"],
            "openpack.result.popupm1":["共开启 %1 个球员包（%2个未开启），分配俱乐部 %3 个、SBC仓库 %4 个，%5 个特别球员，最高评分 %6 。","共開啟 %1 個球員包（尚有 %2 個未開啟），已分配至俱樂部 %3 個、SBC 倉庫 %4 個，%5 名特別球員，最高評分為 %6。","Opened %1 player packs (%2 not opened), assigned %3 to Club, %4 to SBC storage, %5 special players, with a highest rating of %6.","%1개 선수 팩 열기 완료 (%2개 미개봉), 클럽에 %3개, SBC 창고에 %4개 배정, 특수 선수 %5명, 최고 등급 %6"],
            "openpack.result.popupm2":["上方将展示最多20位球员，优先展示特别品质和高评分的球员，其余球员球员将不会展示，请去俱乐部或SBC仓库自行查看。","上方將展示最多 20 位球員，優先展示具備特殊品質與高評分的球員，其餘球員將不予顯示，請前往俱樂部或 SBC 倉庫自行查看。","Up to 20 players will be displayed above, prioritizing special quality and high-rated players. Other players will not be shown — please check your Club or SBC storage for the rest.","위에 최대 20명의 선수가 표시되며, 특수 품질과 고등급 선수를 우선 표시합니다. 다른 선수들은 표시되지 않으니 클럽이나 SBC 창고에서 확인해 주세요"],
            "openpack.storebtn.text":["批量打开","批量開啟","Bulk Open","일괄 열기"],
            "openpack.storebtn.subtext":["自动分配球员","自動分配球員","Auto Assign Players","선수 자동 배정"],
            "openpack.storebtn.popupt":["批量打开提示 - %1","批量開啟提示 - %1","Bulk Open Notice - %1","일괄 열기 알림 - %1"],
            "openpack.storebtn.popupm":["批量开启将会自动开启指定球员包，非重复球员保存至俱乐部，重复且评分高于 %1(黄金范围) 的球员保存至SBC仓库，无法分配则弹出未分配列表并停止程序。<br><br>批量开启数量（默认为全部）：","批量開啟將會自動開啟指定的球員包，非重複球員將保存至俱樂部，重複且評分高於 %1（黃金範圍） 的球員將保存至 SBC 倉庫，若無法分配，將彈出未分配列表並停止程序。<br><br>批量開啟數量（預設為全部）：","Bulk opening will automatically open the selected player packs.<br>Non-duplicate players will be sent to your Club.<br>Duplicate players with a rating above %1 (Gold range) will be sent to SBC storage.<br>If any players cannot be assigned, the unassigned list will be displayed and the process will stop.<br><br>Number of packs to open (default is all):","일괄 열기는 선택된 선수 팩을 자동으로 엽니다.<br>중복되지 않은 선수는 클럽으로 보내집니다.<br>%1 등급 이상(골드 범위)의 중복 선수는 SBC 창고로 보내집니다.<br>배정할 수 없는 선수가 있으면 미할당 목록이 표시되고 프로세스가 중단됩니다.<br><br>열 팩 수량 (기본값은 전체):"],
            "sort.desc":["由高到低","由高至低","Descending","내림차순"],
            "sort.asc":["由低到高","由低至高","Ascending","오름차순"],
            "packssort.switch.notice":["切换 %1 排序为按包回报价值 %2 排序","切換 %1 排序為依據包回報價值的 %2 排序","Switch %1 sorting to %2 sorting based on pack returns","팩 수익을 기준으로 %1 정렬을 %2 정렬로 전환"],
            "allsendclub.button.text":["领取并发送球员至俱乐部","領取並發送球員至俱樂部","Claim and Send Players to Club","선수 수령 및 클럽으로 전송"],
        }
        //固话的HTML内容
        html = {
            "priceBtn":"<button class=\"flat pagination fsu-getprice\" id=\"getprice\">{price.btntext}</button>",
            "priceBtn2":"<button class=\"btn-standard section-header-btn mini call-to-action fsu-getprice\" id=\"getprice\">{price.btntext}</button>",
            "sbcInfo":"<div class=\"fsu-sbc-info\"><div class=\"currency-coins\">{sbc.price}{price}</div><div><span>{sbc.like}{up}</span><span>{sbc.dislike}{down}</span></div></div>",
            "consultBtn":"<a href=\"https://www.futbin.com/squad-building-challenges/ALL/{sbcId}\" target=\"_blank\" class=\"fsu-consult fsu-sbcButton\">{sbc.consult}</a>",
            "countBtn":"<a id=\"goToCount\" href=\"javascript:void(0)\" class=\"fsu-count\">{sbc.count}</a>",
            "searchInput":"<input type=\"text\" class=\"fsu-input\" placeholder=\"{text}\" maxlength=\"50\">",
            "uasBtn":"<button class=\"btn-standard section-header-btn mini call-to-action fsu-getprice\" id=\"uasreset\">{uasreset.btntext}</button>",
        };
        info.base.sytle = ".tns-horizontal.tns-subpixel>.tns-item{position: relative;}button.notevents{pointer-events: none;color: #a4a9b4;}.btn-standard.section-header-btn.mini.call-to-action.fsu-getprice{margin-left: 1rem;}.btn-standard.section-header-btn.mini.call-to-action.fsu-getprice:hover{background-color:#e9dfcd}.view-modal-container.form-modal header .fsu-getprice{position: absolute;top: .5rem;left: 0;height: 2rem;line-height: 2rem;}.ut-sbc-set-tile-view.production-tagged .tileHeader::before{display:none;}.fsu-task{display: flex;justify-content: space-between;padding: 0.5rem;background-color: #d31332;}.fsu-task.no{background-color: #d313325c;}.task-expire{background-color: #d313325c;height: 2rem;line-height: 2rem;text-align: center;}a.header_explain{color: #a2a2a2;text-decoration: none;line-height: 3rem;padding-left: 16px;}a.header_explain:hover{color: #ffffff;}.ut-fifa-header-view{display: flex;justify-content: space-between;}    .fsu-loading-close{display: none;position: absolute;bottom: 38%;z-index: 999;}.fsu-loading .fsu-loading-close{display: block;text-align: center;}                                                               .fsu-sbc-info{padding: 0.5rem;background-color: #d313325c;display: flex;font-family: UltimateTeamCondensed,sans-serif;justify-content: space-between;font-size: 1rem;}.fsu-sbc-info div{width: 50%;}.fsu-sbc-info div:last-child{display: flex;justify-content: space-around;}.fsu-sbc-info .currency-coins::after{font-size:16px}                .rewards-footer li{position: relative;}.fsu-sbc-vplayer {position: absolute;bottom: .25rem;right:0;background-color: #8A6E2C;padding: .5rem;color: #15191d;line-height: 1rem;font-size: 16px;}.fsu-sbc-vplayer:hover{background-color: #f6b803;}                 @media screen and (min-width:1280px) and (max-width:1441px) {.ut-split-view {padding:0;}.ut-split-view>.ut-content {max-height:100%;}}            .fsu-squad-pBox{display:flex}.fsu-squad-pWrap{margin:.5em}.fsu-squad-pTitle{width:100%;word-break:keep-all;font-size:.8em;display:block;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}.fsu-squad-pValue{font-family:UltimateTeamCondensed,sans-serif;font-weight:400;font-size:1.125em;text-overflow:ellipsis;white-space:nowrap;line-height: 1.8rem;}.fsu-squad-pValue.currency-coins::after{font-size:1rem;margin-left:.2em !important;margin-top:-.2em !important}.fsu-squad-pTitle .plus{color:#36b84b;padding-left:.1rem}.fsu-squad-pTitle .minus{color:#d21433;padding-left:.1rem}         li.with-icon.hide {display: none;}                      .fsu-input{border: 0 !important;background-color: rgba(0,0,0,0) !important;padding-left: 0 !important;font-family: UltimateTeamCondensed,sans-serif;font-size: 1em;color: #f8eede;}                  .fsu-quick{position:absolute;top:100%;width:100%;display:flex;align-items:center;font-family:UltimateTeam,sans-serif;justify-content:center;margin-top:.2rem}.fsu-quick.top .fsu-quick-list{display:flex;align-items:center}.fsu-quick-list .im{height:1.8rem;line-height:1.8rem;cursor:pointer;background-color:#2b3540;font-family:UltimateTeam,sans-serif;border-radius:4px;padding:0 .2rem;font-size:1rem;font-weight:900;color:#f2f2f2;overflow: hidden;}.fsu-quick-list .im:hover{background-color:#394754}.fsu-quick-list.other .im{background-color:#f8eede;color:#ef6405;font-weight:500;margin-left:.3rem;text-align:center;}.fsu-quick-list.other .im:hover{background-color:#f5efe6}.fsu-quick-list .im span{font-size:.8rem;font-weight:300;color:#a4a9b4}.fsu-quick-list.left .im{margin-right:.3rem}.fsu-quick-list.right .im{margin-left:.3rem}.fsu-quick-inr{font-size:.8rem;margin:0 .3rem}.fsu-quick.right{position:absolute;top:50%;width:2rem;display:block;right:0%;z-index:3;-webkit-transform:translateY(-50%) !important;transform:translateY(-50%) !important}.phone .fsu-quick.right{top:8rem;-webkit-transform:translateY(0%) !important;transform:translateY(0%) !important}.fsu-quick.right .fsu-quick-list .im{width:1.4rem;margin-bottom:.2rem;text-align:center}.fsu-quick.right .fsu-quick-list .im.disabled{background-color:#30302e;color:#656563}.entityContainer>.name.untradeable{color:#f6b803}                                  .phone .fsu-sbc-info{font-size:.875rem}.phone .fsu-task{display:block;font-size:.875rem}.phone .fsu-price-box.right > div .value{font-size:1rem;margin-top:.2rem}.phone .fsu-price-box.right > div .title{font-size:.875rem}.phone .fsu-player-other > div{font-size:0.6rem}.phone .small.player .fsu-cards-price{font-size:.8rem}.phone .small.player .fsu-cards-price::after{font-size:.875rem}.phone .fsu-cards.fsu-cards-attr{font-size:.6rem}.phone .fsu-quick-list .im{font-size:.875rem}                                              .ut-pinned-item .listFUTItem.has-auction-data .fsu-player-other{margin-top:0 !important;top:.8rem;right:.2rem;position:absolute;z-index:2}        .fsu-sbcfilter-box{align-items:center;background-color:#394754;display:flex;justify-content:center;padding:1rem;z-index:10}.fsu-sbcfilter-option{align-items:center;box-sizing:border-box;display:flex;flex:1;max-width:300px}.fsu-sbcfilter-option .ut-drop-down-control{margin-left:1rem;flex:1}             .fsu-cards-pos.old>div,div:not(.small)>.fsu-cards-attr.old>div{background-color:#0040A6}.small.player .fsu-price-box{font-size:80%;padding:0 .1rem;}.large.player .fsu-price-box{font-size:1rem}.fsu-price-box.old{background-color:#0f1417;color:#a4a9b4;border:0}.small>.fsu-cards-attr.old{background-color:#0040A6}                         .fsu-setbox{display: grid;grid-template-columns: repeat(3, minmax(0, 1fr));}.phone .fsu-setbox{display: grid;grid-template-columns: repeat(1, minmax(0, 1fr));}                                  .btn-standard.mini.fsu-reward-but{height:2rem;line-height:2rem;position:absolute;top:.2rem;left:50%;transform:translateX(-50%)}.btn-standard.mini.fsu-reward-but.pcr{bottom:1.9rem;top:auto}           .btn-standard.mini.fsu-pickspc{line-height:2rem;height:2rem;margin:.5rem auto 0 auto}.ut-image-button-control.back-btn.fsu-picksback{height:100%;width:3rem;position:absolute;left:0;font-size:1.6rem}                       .fsu-fcount{position:absolute;right:0.5rem;height:1.4rem;top:.8rem;line-height:1.5rem;padding:0 .4rem;border-radius:.2rem;z-index:1;background-color: #264A35;}        .ut-squad-building-set-status-label-view.refresh.sbccount::before {content:'\\E0B6';color: #36b84b;}.phone .fsu-store-tile .ut-tile-content-graphic-info .description{display:block;}        .fsu-range button{margin:0}                                                               .fsu-price-box{font-family:UltimateTeamCondensed,sans-serif}.fsu-price-box.right{position:absolute;right:0%;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);display:flex;align-items:center}.fsu-price-box.right>div{background-color:#162C1A;color: #ffffff;padding:0.5rem;text-align:center;border-radius:4px;margin-top:0;display:block}.fsu-price-box.right>div .title{color:#a4a9b4;padding:0;font-size:1rem;line-height:1rem}.fsu-price-box.right>div .title span.plus{color:#36b84b;font-weight:500;padding-left:.2rem}.fsu-price-box.right>div .title span.minus{color:#d21433;font-weight:500;padding-left:.2rem}.fsu-price-box.right>div .value{font-size:1.2rem;margin-top:.5rem;line-height:1.2rem}.fsu-price-val[data-value='0']{display:none !important}.fsu-price-val .currency-coins::after{font-size:1rem;margin-top:-3px}.fsu-price-box.bottom{padding-left:6.3rem;margin:.2rem 0rem}.fsu-price-box.bottom>div{display:flex;align-items:center;font-size:0.9375rem}.fsu-price-box.bottom>div .title{color:#a4a9b4;margin-right:.2rem}.fsu-price-box.bottom .fsu-price-val .currency-coins::after{font-size:inherit}.fsu-price-box.trf{position:absolute;left:54%;margin-top:.2rem}.fsu-price-box.trf .fsu-price-val{display:flex;align-items:center;background-color:#162C1A;color: #ffffff;text-align:center;border-radius:4px;padding:0 .3rem;height:20px}.fsu-price-box.trf .fsu-price-val .title{font-size:.875rem;margin-right:.2rem}.fsu-price-box.trf .fsu-price-val .currency-coins::after{margin-top:-2px}.fsu-price-box.top{position:absolute;right:0%;top:8%;display:flex;align-items:center}.fsu-price-box.top>div{display:flex;align-items:center;background-color:#162C1A;color: #ffffff;padding:.1rem 0.5rem;text-align:center;border-radius:4px}.fsu-price-box.top>div .title{font-size:0.875rem;margin-right:0.5rem}.fsu-price-last{margin-right:.5rem}.fsu-player-other{display:flex;margin-top:.2rem;font-family:UltimateTeamCondensed,sans-serif;font-size:.8rem;line-height:1rem}.fsu-price-box.top+.fsu-player-other{margin-top:.4rem}.fsu-player-other>div{background-color:#3B4754;color:#a4a9b4;padding:0.1rem 0.5rem;text-align:center;border-radius:20px;font-size:inherit;line-height:inherit;margin-right:0.5rem;white-space:nowrap}.fsu-player-other>div.swap{background-color:#36b84b;color:#201e20}.fsu-player-other>div.not{background-color:#8A6E2C;color:#201e20}.fsu-player-other>div.storage{background-color:#f6b803;color:#201e20}.fsu-player-other>div.yes{background-color:#264A35;color:#201e20}.large.player+.fsu-player-other{justify-content:center}.large.player+.fsu-player-other>div{margin-right:0rem}.fsu-player-other .currency-coins::after{font-size:.875rem;margin-top:-1px;margin-left:2px !important}@media (max-width:1130px){.has-auction-data .fsu-player-other{margin-top:5rem !important}.has-auction-data .fsu-price-box.trf{margin-top:5rem !important;left:auto;right:3%}}                                                                    .fsu-cards-lea-small,.fsu-cards-accele-large,.fsu-cards-meta,.fsu-cards-price{position:absolute;z-index:2;font-family:UltimateTeamCondensed,sans-serif;font-weight:300;text-align:center;width:1.6rem;top:25%}.fsu-cards-lea-small{bottom:8%;height:16%;font-size:70%;width:100%;top:auto;font-weight:500;line-height:1}.fsu-cards-lea-small~.playStyle,.ut-squad-pitch-view:not(.sbc) .fsu-cards-lea-small{display:none !important}.specials .fsu-cards-lea-small{bottom:10%}.fsu-cards-accele-large,.fsu-cards-meta,.fsu-cards-price{width:auto !important;padding:0 0.2rem;left:50%;-webkit-transform:translateX(-50%) !important;transform:translateX(-50%) !important;white-space:nowrap;background-color:#13151d;border:1px solid;border-radius:5px}.fsu-cards-accele-large,.fsu-cards-meta{bottom:0;top:auto !important}.fsu-cards-price{color:#fff;top:0 !important}.fsu-cards-price::after{font-size:80%;margin-left:.1rem;}.ut-squad-pitch-view:not(.sbc) .fsu-cards-lea-small~.playStyle{display:block !important}.fsu-cards-attr,.fsu-cards-pos{position:absolute;z-index:2;font-family:UltimateTeamCondensed,sans-serif;font-weight:300;text-align:center;top:25%;display:flex;flex-direction:column;gap:1px}.fsu-cards-attr div,.fsu-cards-pos div{border:1px solid;border-color:inherit;background-color:#13151d;line-height:100%;border-radius:5px;color:#fcfcf7;width:1.2rem;white-space:nowrap;}.large.player~.fsu-cards-attr,.large.player .fsu-cards-attr,.ut-tactics-instruction-menu-view  .fsu-cards-attr{left:calc(50% + 76px - 0.8rem);font-size:14px;gap:4px}.large.player~.fsu-cards-attr div,.large.player .fsu-cards-attr div,.large.player~.fsu-cards-pos div,.large.player .fsu-cards-pos div{width:1.6rem}.small.player~.fsu-cards-attr{left:4.4rem;font-size:10px}.reward.small .small.player~.fsu-cards-attr{left:calc(50% + 42px);top:20%}.reward.small .small.player~.fsu-cards-pos{left:calc(50% - 66px);top:20%;font-size:12px}.ut-squad-slot-view .small.player~.fsu-cards-attr{left:auto;right:-.2rem}.large.player~.fsu-cards-pos,.large.player .fsu-cards-pos,.ut-tactics-instruction-menu-view  .fsu-cards-pos{left:calc(50% - 76px - .8rem);font-size:14px;gap:4px}.ut-squad-slot-view .small.player~.fsu-cards-pos{flex-direction:row;font-size:10px;top:auto;bottom:-1.6rem;left:50%;transform:translate(-50%,0)}.ut-squad-slot-dock-view .ut-squad-slot-view .small.player~.fsu-cards-pos{bottom:-.6rem}.ut-store-xray-pack-details-view .large.player~.fsu-cards-attr{left:calc(50% + 76px - 2rem)}.ut-store-article-pack-graphic-view--option .large.player~.fsu-cards-pos{left:calc(50% - 76px - .4rem)}.large.player .fsu-cards-attr{right:0;left:auto;}.large.player .fsu-cards-pos{right:auto;left:0;}       .fsu-akb .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip{font-family:UltimateTeam-Icons,sans-serif;font-style:normal;font-variant:normal;font-weight:400;text-transform:none;flex-shrink:0;font-size:1em;text-decoration:none;text-align:center;line-height:1.5rem;transition:color .3s,bottom .3s,top .3s}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip::before,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip::before{content:'\\E051';color:#3a4755}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--grip::before,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--grip::before{content:'\\E02F';color:#36b94b}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--track,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--track{background-color:#36b94b}.fsu-akb .ut-toggle-cell-view>.ut-toggle-cell-view--label{display:none}.fsu-akb .ut-toggle-cell-view{position:absolute;z-index:10;transform:scale(0.7);top:-.2rem;left:-.5rem;padding:0 1rem 1rem 0;cursor:pointer}.fsu-akb-title{align-items:center;background-color:#2b3540;display:flex;justify-content:space-between;padding:.75rem .5rem;border-top:solid 1px #556c95}.fsu-akb-left{display:flex;align-items:center}.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip{transition:color .3s,left .3s,right .3s}.fsu-akb-left>div{padding:0 .675rem 0 0}.fsu-akb-left>div:last-child{padding-right:0}                  body.landscape.futweb{min-height: 38rem;}               .ut-club-hub-view .tile.fsu-lock .tileContent:before { content:'\\E09D'; }                            .fsu-objnew{background:#ff0000;z-index:2;position:absolute;left:0;top:1rem;transform:rotate(-45deg);transform-origin:0 100%;padding:6px 10px;width:3.2rem;text-align:center}              .fsu-lockbtn{padding:0 10px;position:absolute;right:2rem;bottom:0;z-index:2;margin:2rem 0 .8rem 2rem;}.fsu-lockbtn::before{font-family:UltimateTeam-Icons,sans-serif;padding-right:.4rem;content:'';display:inline-block;vertical-align:middle;background-size:100% auto;background-repeat:no-repeat}.fsu-lockbtn.unlock::before{content:'\\E0AA'}.fsu-lockbtn.lock::before{content:'\\E09D'}.fsu-lockbtn.unlock{background-color:#fcfcf7;color:#151616}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.locked,html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.untradeable{padding-right:2.7em}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.locked::before,html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.untradeable::before{right:1.4em}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked::after{font-family:UltimateTeam-Icons,sans-serif;color:#d31332;margin-top:2px;position:absolute;width:1.1em;content:'\\E09D';right:0}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked{padding-right:1.4em}html[dir=ltr] :not(.phone) .listFUTItem .entityContainer>.name.fsulocked.untradeable { max-width: 42%; }        .fsu-cardlock{position:absolute;height:.9rem;width:.9rem;right:0;bottom:5%;z-index:2;background-color:#222426;border:1px solid #333d47;border-radius:100%;text-align:center;box-shadow:0 1px 3px #000;font-size:10.8px}.fsu-cardlock::before{font-family:UltimateTeam-Icons,sans-serif;content:'\\E09D';display:inline-block;vertical-align:middle;background-size:100% auto;color:#d31332;background-repeat:no-repeat}                            .filter-btn.fsu-eligibilitysearch{height:1.8rem;width:1.8rem;position:absolute;right:0}.ut-image-button-control.filter-btn.fsu-eligibilitysearch::after{font-size:1.4rem;content:'\\E09E'}                  .item.player>.fsu-cards-rating{position:absolute;left:50%;top:50%;font-size:5rem;transform:translate(-50%,-50%)}.large.item.player>.fsu-cards-rating{font-size:7rem}.item.player.ut-item-loading>.fsu-cards-rating{opacity:1}.item.player.ut-item-loaded>.fsu-cards-rating{opacity:0}                        .fsu-chemistryfilter{position:absolute;right:.5rem;top:.5rem;}                          .ut-list-active-tag-view .label-container.fsu-inclubtag{background-color:#0b96ff}.ut-list-active-tag-view .label-container.fsu-inclubtag::after{border-color:#0b96ff}                                           .fsu-optionbest{position:relative}.fsu-optionbest > span,.fsu-optionbest > .player-pick-option,.fsu-optionbest > .fsu-pickspc{position:relative;z-index:1}.fsu-optionbest >.no-favorites-tile{position:absolute;max-width:100%;height:120%;width:100%;margin:-15% 0 0 0;z-index:0;top:0px;right:0px;padding:0;background-image: url(https://www.ea.com/ea-sports-fc/ultimate-team/web-app/content/25E4CDAE-799B-45BE-B257-667FDCDE8044/2025/fut/dynamicObjectives/groups/f4c231d9-a38c-44a4-a932-87af2136cca5/group_background.png);}.fsu-optionbest > .no-favorites-tile::before{font-size:2.2rem;height:2.2rem;width:2.2rem;line-height:2.2rem;}.fsu-optionbest > .player-pick-option.selected ~ .no-favorites-tile::before{display:none}                      .fsu-navsbc{height:80%;justify-content:flex-end;margin-right:1rem;flex: 0 0 auto;}.fsu-navsbc button{margin:-0.25rem;width:60px;}.phone .fsu-navsbc{margin-right:.25rem}.phone .fsu-navsbc button{margin:-.1rem}    .fsu-shownavsbc .ut-navigation-button-control{width:3rem}.fsu-shownavsbc .title{flex:1 0;position:relative !important;width:auto !important;text-align:left !important;padding:0 0 0 0.5rem !important}.fsu-shownavsbc .fsu-navsbc{height:3rem}.fsu-shownavsbc .ut-iteminfochange-button-control{display:none}.fsu-shownavsbc .fsu-navsbc button{width:2.6rem}        .phone .fsu-optionbest > .no-favorites-tile{height:108%;margin:-4% 0 0 0;border-radius:10px}.phone .fsu-optionbest > .no-favorites-tile::before{font-size:1rem;height:1rem;width:1rem;line-height:1rem;margin:.25rem}                .fsu-cards-attr div.fsu-academytips{display:flex;align-content:center;justify-content:center;background:linear-gradient(to bottom,#00A7CC 0,#007D99 100%);color:#0f1010;box-shadow:0 1px 1px 0 rgba(0,0,0,.5);border:none}.fsu-academytips-icon{height:0}                              .fsu-academytips-icon::before,.ut-store-pack-details-view--description.fsu-packprice:before,.fsu-cards-price.fsu-unassigned:before{font-family:UltimateTeam-Icons,sans-serif;font-style:normal;font-variant:normal;font-weight:400;text-decoration:none;text-transform:none}.fsu-academytips-icon::before{content:'\\E001'}.ut-store-pack-details-view--description.fsu-packprice:before{color:#f7b702;display:inline-block;content:'\\E096';margin-right:.25rem}.fsu-cards-price.fsu-unassigned:before{content:'\\E0B8';display:inline-block;margin-right:.3em;vertical-align:middle;color:#f7b702}                                      .fsu-cards-meta{padding:0;display:flex;font-family:UltimateTeam,sans-serif;font-size:.8rem;height:1rem;align-items:center;z-index:5;cursor:pointer;}.fsu-cards-meta > div{margin-right:.2rem}.fsu-cards-meta > div:first-child{border-radius:4px 0 0 4px;height:1rem;width:1rem;font-weight:900;}                                button.currency.call-to-action.fsu-challengefastbtn{height:2.6rem;line-height:1.4rem;padding:0px 1rem;font-size:1rem}button.currency.call-to-action.fsu-challengefastbtn > span{display: block !important;}button.currency.call-to-action.fsu-challengefastbtn .subtext{font-size:80%;line-height:1rem;color:#a6a6a6;}.ut-sbc-challenge-table-row-view .fsu-challengefastbtn{width:70%}@media (min-width:768px){.ut-sbc-challenge-table-row-view .fsu-challengefastbtn{width:60%}}.ut-sbc-challenge-table-row-view.selected button.currency.call-to-action.fsu-challengefastbtn{background-color:#222426;color:#fcfcf7}.ut-sbc-challenge-table-row-view.selected button.currency.call-to-action.fsu-challengefastbtn.hover{background-color:#575753}.ut-sbc-challenge-table-row-view button.currency.call-to-action.fsu-challengefastbtn.disabled{background-color:#575753;color:#30312f}                                     .fsu-navsbccount{padding:.2em 0;margin-right:.5rem;align-items:center;display:flex;justify-content:flex-end}.fsu-navsbccount::after{background-position:right top;content:'';background-repeat:no-repeat;background-size:100%;display:inline-block;height:1em;vertical-align:middle;width:1em;background-image:url(https://www.ea.com/ea-sports-fc/ultimate-team/web-app/images/sbc/logo_SBC_home_tile.png);margin-top:-.15em;margin-left:.3em}                                .ut-image-button-control.filter-btn.fsu-transfer::after{content:'\\E0D6';font-size:1.6rem}.ut-image-button-control.filter-btn.fsu-club::after{content:'\\E052';font-size:1.6rem}.ut-image-button-control.filter-btn.fsu-swap::after{content:'\\E092';font-size:1.4rem}.ut-image-button-control.filter-btn.fsu-refresh::after{content:'\\E0B8';font-size:1.4rem}.ut-image-button-control.filter-btn.fsu-storage::after{content:'\\E0BD';font-size:1.4rem}.filter-btn.fsu-swap,.filter-btn.fsu-transfer,.filter-btn.fsu-club,.filter-btn.fsu-storage,.filter-btn.fsu-refresh{margin-left:1rem;width:3rem;height:3rem}                             .fsu-task-bar{position:absolute;right:.2rem;top:.3rem;font-size:.9rem}.fsu-task-bar.expiry{bottom:.3rem;top:auto;opacity:.6}.ut-tab-bar-item-notif~.fsu-task-bar{top:auto;bottom:.3rem}.ut-tab-bar-item-notif~.fsu-task-bar~.fsu-task-bar{display:none}               .ut-club-hub-view .tile.fsu-storage .tileContent:before { content:'\\E0BD'; }                          .ut-list-active-tag-view .label-container.fsu-instoragetag,.listFUTItem.hover .ut-list-active-tag-view .label-container.fsu-instoragetag{background-color:#f19be6}.ut-list-active-tag-view .label-container.fsu-instoragetag::after,.listFUTItem.hover .ut-list-active-tag-view .label-container.fsu-instoragetag::after{border-top-color:#f19be6}                                                      .fsu-trypack-box{position:absolute;right:0;}.landscape button.currency.fsu-trypack{border-radius:.8rem;margin-top:-.3rem;text-align:justify;padding:.25rem .5rem;width:auto;color:#f2f2f2;background-color:#556c95;padding-right:2.8rem;border-radius:1rem}.landscape button.currency.fsu-trypack:hover{background-color:#ef6405}.landscape button.currency.fsu-trypack .text{font-size:1.4rem;font-weight:600;height:2rem;line-height:2rem}.landscape button.currency.fsu-trypack .subtext{font-size:.8rem;line-height:1rem;text-transform:uppercase}.landscape button.currency.fsu-trypack::after{background-image:url(https://www.ea.com/ea-sports-fc/ultimate-team/web-app/content/25E4CDAE-799B-45BE-B257-667FDCDE8044/2025/fut/sbc/companion/sets/images/sbc_set_image_1000061-20d83475-aa5a.png) !important;background-position:center;background-repeat:no-repeat;background-size:contain;content:'';height:3.8rem;transform:translateY(-50%);position:absolute;width:3.8rem;top:50%;right:-.5rem}.phone .fsu-trypack-box{position:initial;}.phone button.currency.fsu-trypack{line-height:1.6rem;padding:0 .3rem;height:3rem;border-radius:.5rem;background-color:#ef6405}.phone button.currency.fsu-trypack .subtext{display:block;font-size:.8rem;line-height:1rem;text-transform:uppercase}                               .listfilter-btn{padding:0;width:100%;height:1.6rem;line-height:1.8rem;border-radius:.4rem;font-size:.9rem}                                                 .ut-player-picks-view .carousel-indicator-dots.fsu-pickbest li{width:16px;height:16px;text-align:center;overflow:hidden}.ut-player-picks-view .carousel-indicator-dots.fsu-pickbest li.active{transform:scale(1.4)}.ut-player-picks-view .carousel-indicator-dots.fsu-pickbest li.best::after{content:'\\E0C6';font-family:UltimateTeam-Icons,sans-serif;font-style:normal;font-variant:normal;font-weight:400;text-decoration:none;text-transform:none;color:#07f468;font-size:1rem;line-height:1.1rem}.ut-player-picks-view .carousel-indicator-dots.fsu-pickbest li.best.active::after{color:#fd4821}                                     .ut-button-group button.more.fsu-open::after{-webkit-transform:rotate(0deg) !important;transform:rotate(0deg) !important}                                                                .fsu-sbcNeedsBody,.fsu-realProdBody{height:30vh;overflow-y:auto}.fsu-sbcNeedsTitle,.fsu-sbcNeedsBodyItem,.fsu-realProdTitle,.fsu-realProdBodyItem{display:flex}.fsu-sbcNeedsTitle,.fsu-realProdTitle{padding:.5rem 1rem;background-color:#30312f;font-size:1rem}.fsu-sbcNeedsBodyItem,.fsu-realProdBodyItem{padding:.75rem 1rem;align-items:center;background-color:#18191b;font-size:1em}.fsu-sbcNeedsBodyItem:nth-of-type(even),.fsu-realProdBodyItem:nth-of-type(even){background-color:#212224}.fsu-sbcNeedsTitle div,.fsu-sbcNeedsBodyItem div{width:18%}.fsu-realProdTitle div,.fsu-realProdBodyItem div{width:20%}.fsu-sbcNeedsTitle div:last-child,.fsu-sbcNeedsBodyItem div:last-child{width:28%;text-align:right}.fsu-realProdTitle div:first-child,.fsu-realProdBodyItem div:first-child{width:40%}"


        //24.18 修改请求fut链接报错提示
        events.getFutbinUrl = async (url) => {
            try {
                const futBinResponse = await events.externalRequest("GET",url);
                const futBinJson = JSON.parse(futBinResponse);
                return futBinJson;
            } catch (error) {
                events.notice(fy("notice.loaderror") + error,2);
                events.hideLoader();
                throw error;
            }
        }


        //25.01 新的获取价格接口
        events.getPriceForUrl = async (data) => {
            console.log(data)
            try {
                let priceJson = {};
                if(info.base.platform !== "pc"){
                    let params = data.join("%2C")
                    const response = await events.externalRequest("GET","https://www.fut.gg/api/fut/player-prices/25/?ids=" + params);
                    const originalJson = JSON.parse(response);
                    _.map(originalJson.data,i => {
                        let p = i.price
                        if(p){
                            priceJson[i.eaId] = {
                                "n":p,
                                "t":p == -1 ? "0" : p.toLocaleString()
                            }
                        }
                    })

                    //无数据补0
                    _.map(data,i => {
                        if(!(_.has(priceJson,i))){
                            priceJson[i] = {
                                "n": 0,
                                "t": "0"
                            }
                        }
                    })

                }else{
                    const response = await events.externalRequest("POST","https://trackerapi.futnext.com/track/getPrices",JSON.stringify(data));
                    const originalJson = JSON.parse(response);
                    _.map(originalJson,i => {
                        if(i.prices.length){
                            let p = i.prices[0].price
                            priceJson[i.definitionId] = {
                                "n": p,
                                "t": p == -1 ? "0" : p.toLocaleString()
                            }
                        }
                    })

                    //无数据补0
                    _.map(data.items,i => {
                        if(!(_.has(priceJson,i.definitionId))){
                            priceJson[i.definitionId] = {
                                "n": 0,
                                "t": "0"
                            }
                        }
                    })
                }
                return priceJson;
            } catch (error) {
                events.notice(fy("notice.loaderror") + error,2);
                events.hideLoader();
                throw error;
            }
        }


        events.externalRequest = (method, url , body , cType) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    data: body ? body : null,
                    headers:{
                        "Content-Type": cType ? cType : "application/json"
                    },
                    onload: (res) => {
                        if (res.status !== 200 && res.status !== 201) {
                            reject(res.status);
                        }
                        resolve(res.response);
                    },
                    onerror: (error) => {
                        console.error("Request failed:", error);
                        if (error.status) {
                            reject(error.status);
                        } else {
                            reject("Unknown error occurred");
                        }
                    }
                });
            });
        };
        call.view = {
            card:UTPlayerItemView.prototype.renderItem,
            miscItem:UTMiscItemView.prototype.renderItem,
            squad:UTBaseSquadSplitViewController.prototype.viewDidAppear,
            unassigned:UTUnassignedItemsViewController.prototype.renderView,
            build:UTSquadBuilderViewController.prototype.viewDidAppear,
            market:UTMarketSearchView.prototype._generate,
            setting:UTAppSettingsView.prototype._generate,
            squadRating:UTSquadEntity.prototype._calculateRating,
            transfer:UTTransferListViewController.prototype._renderView,
            clubHub:UTClubHubView.prototype.clearTileContent,
            academySlot:UTAcademySlotItemDetailsViewController.prototype.renderView,
            nav:UTGameFlowNavigationController.prototype.viewDidAppear,
            ea:EAViewController.prototype.viewDidAppear,
            push:UTGameFlowNavigationController.prototype.didPush,
            login:UTLoginView.prototype._generate,
            tacticsRole:UTTacticsRoleSelectViewController.prototype.viewDidAppear,
            transferMarket:UTTransferMarketPaginationViewModel.prototype.startAuctionUpdates,
            unassignedRenderSection:UTUnassignedItemsView.prototype.renderSection,
            unassignedUpdateUDSO:UTUnassignedItemsViewController.prototype.updateUntradeableDuplicateSectionOptions
        }


        //25.02 显示可放至仓库数量
        UTUnassignedItemsViewController.prototype.updateUntradeableDuplicateSectionOptions = function (...args) {
            call.view.unassignedUpdateUDSO.call(this, ...args);
            let section = this.getView().getSection(UTUnassignedItemsViewModel.SECTION.UNTRADABLEDUPLICATES);
            if(section && this.viewmodel){
                if("_fsuSendClubCount" in section){
                    section._header.__subtext.appendChild(section._fsuSendClubCount)
                }
            }
        }
        //25.02 未分配快捷按钮添加
        UTUnassignedItemsView.prototype.renderSection = function(e, t, i) {
            call.view.unassignedRenderSection.call(this,e,t,i);
            let section = this.sections[t];
            let controller = _.find(this.eventDelegates, ed => {
                return ed.className && ed.className.includes('UTUnassigned') && ed.className.includes('Controller');
            });
            if(t == UTUnassignedItemsViewModel.SECTION.ITEMS){
                let tradable = _.filter(e,i => {
                    return i.loans == -1 && i.type == "player" && !i.untradeable
                })
                if(tradable.length){
                    if(!(_.has(section,"_fsuTransfer"))){
                        section._fsuTransfer = events.createButton(
                            new UTImageButtonControl(),
                            "",
                            async(e) => {
                                controller.sendStorablesToTransferList();
                            },
                            "filter-btn fsu-transfer"
                        )
                        section._header.getRootElement().appendChild(section._fsuTransfer.getRootElement())
                    }
                }
                let toClubPlayers = _.filter(e,i => {
                    return i.loans == -1 && i.type == "player"
                })
                if(toClubPlayers.length && !(_.has(section,"_fsuClub"))){
                    section._fsuClub = events.createButton(
                        new UTImageButtonControl(),
                        "",
                        async(e) => {
                            controller.storeInClub();
                        },
                        "filter-btn fsu-club"
                    )
                    section._header.getRootElement().appendChild(section._fsuClub.getRootElement())
                }
            }

            if(t == UTUnassignedItemsViewModel.SECTION.DUPLICATES){
                let players = _.filter(e,i => {
                    return i.loans == -1 && i.type == "player"
                })
                if(players.length){
                    if(!(_.has(section,"_fsuTransfer"))){
                        section._fsuTransfer = events.createButton(
                            new UTImageButtonControl(),
                            "",
                            async(e) => {
                                controller.sendDuplicatesToTransferList();
                            },
                            "filter-btn fsu-transfer"
                        )
                        section._header.getRootElement().appendChild(section._fsuTransfer.getRootElement())
                    }
                }
            }

            if(t == UTUnassignedItemsViewModel.SECTION.UNTRADABLEDUPLICATES){
                let players = _.filter(e,i => {
                    return i.loans == -1 && i.type == "player"
                })
                if(players.length){
                    let playerIds = _.map(players,i => {
                        return i.definitionId;
                    })
                    let r = repositories.Item;
                    if(r.numItemsInCache(ItemPile.STORAGE) && !(_.has(section,"_fsuGoToStorage"))){
                        let sendClubPlayers = _.filter(repositories.Item.storage.values(),i => {
                            let clubPlayers = events.getItemBy(1,{"definitionId":i.definitionId},false,repositories.Item.club.items.values());
                            return clubPlayers.length == 0
                        })
                        if(sendClubPlayers.length){
                            section._fsuSendClubCount = events.createElementWithConfig("span",{
                                textContent:`(${sendClubPlayers.length})`,
                                style:{
                                    color:"#36b84b",
                                    paddingLeft:".2rem",
                                    fontSize:"80%"
                                }
                            })
                            section._header.__subtext.appendChild(section._fsuSendClubCount)
                        }

                        section._fsuGoToStorage = events.createButton(
                            new UTStandardButtonControl(),
                            fy(`sbc.watchplayer`),
                            () => {
                                events.goToStoragePlayers()
                            },
                            "call-to-action mini"
                        )
                        section._header.getRootElement().appendChild(section._fsuGoToStorage.getRootElement())
                    }
                    const notif = events.createElementWithConfig("div",{
                        textContent:"ALL",
                        style:{
                            position:"absolute",
                            bottom:"-.2rem",
                            fontSize:".7rem",
                            height:"1rem",
                            lineHeight:"1.1rem",
                            fontWeight:"500",
                            width:"100%",
                            borderRadius:".6rem",
                            backgroundColor:"#151616",
                            color:"#fcfcfc"
                        }
                    })
                    const storageLack = r.getPileSize(ItemPile.STORAGE) - r.numItemsInCache(ItemPile.STORAGE);
                    if(storageLack && storageLack >= playerIds.length && !(_.has(section,"_fsuStorage"))){
                        section._fsuStorage = events.createButton(
                            new UTImageButtonControl(),
                            "",
                            async(e) => {
                                controller.confirmStoreUntradeablesTapped();
                            },
                            "filter-btn fsu-storage"
                        )
                        section._fsuStorage.getRootElement().style.position = "relative";
                        section._fsuStorage.getRootElement().appendChild(notif);
                        section._header.getRootElement().appendChild(section._fsuStorage.getRootElement())
                    }
                    //25.21 高分球员存入仓库按钮
                    const hPlayers = _.orderBy(_.filter(players,i => i.rating > info.set.goldenrange),["rating"],["desc"]);
                    if(storageLack && hPlayers.length && !(_.has(section,"_fsuHighStorage")) && (hPlayers.length < playerIds.length || hPlayers.length > storageLack)){
                        section._fsuHighStorage = events.createButton(
                            new UTImageButtonControl(),
                            "",
                            async(e) => {
                                const controller = isPhone() ? cntlr.current() : cntlr.left();
                                let movePlayers = storageLack < hPlayers.length ? _.take(hPlayers,storageLack) : hPlayers;
                                services.Item.move(movePlayers, ItemPile.STORAGE, !0).observe(controller, controller.onMoveToStorageComplete);
                            },
                            "filter-btn fsu-storage"
                        )
                        let tempNotif = notif.cloneNode(false);
                        tempNotif.textContent = `>${info.set.goldenrange}`;
                        section._fsuHighStorage.getRootElement().style.position = "relative";
                        section._fsuHighStorage.getRootElement().appendChild(tempNotif);
                        section._header.getRootElement().appendChild(section._fsuHighStorage.getRootElement())
                    }
                    let swapPlayerIds = events.getItemBy(1,{"definitionId":playerIds,"untradeable":false});
                    if(swapPlayerIds.length && !(_.has(section,"_fsuSwap"))){
                        section._fsuSwap = events.createButton(
                            new UTImageButtonControl(),
                            "",
                            async(e) => {
                                controller.confirmSwapUntradeablesTapped();
                            },
                            "filter-btn fsu-swap"
                        )
                        section._header.getRootElement().appendChild(section._fsuSwap.getRootElement())
                    }
                }
            }

            if("_fsuScreenshot" in controller){
                if(!controller.getView().getRootElement().querySelector("fsu-screenshot")){
                    controller.getView().getRootElement().prepend(controller._fsuScreenshot.getRootElement())
                }
            }else{
                let sPrice = [];
                let sPlayers = [];
                _.map(controller.viewmodel.values(), i => {
                    if(i.type == "player"){
                        sPlayers.push(i.definitionId)
                        sPrice.push(events.getCachePrice(i.definitionId,1));
                    }
                })
                let sSection = new UTSectionedItemListView();
                sSection.init();
                sSection.getRootElement().classList.add("fsu-screenshot")
                sSection._header.getRootElement().querySelector("h2").style.fontSize = "1.3rem";
                sSection._header.getRootElement().querySelector("h2").classList.add("currency-coins");
                sSection._header.setText(fy(["screenshot.text",sPlayers.length,_.sum(sPrice).toLocaleString()]))
                controller._fsuScreenshot = sSection;
                controller.getView().getRootElement().prepend(controller._fsuScreenshot.getRootElement())
                // if(_.includes(sPrice,0)){
                //     events.loadPlayerInfo(sPlayers,controller)
                // }
            }


            //25.09 添加刷新快捷按钮
            if(!("_fsuRefreshBtn" in controller)){
                controller._fsuRefreshBtn = events.createButton(
                    new UTImageButtonControl(),
                    "",
                    async(e) => {
                        await services.Item.itemDao.itemRepo.unassigned.reset();
                        await controller.getUnassignedItems();
                        events.notice("notice.uasreset",0);
                    },
                    "filter-btn fsu-refresh"
                )
            }
            if(!(this.getRootElement().querySelector(".fsu-refresh"))){
                const target = section._header.getRootElement().querySelector(".filter-btn");
                if(target){
                    target.before(controller._fsuRefreshBtn.getRootElement())
                }
            }

            //25.09 添加快捷任务按钮
            if (t === UTUnassignedItemsViewModel.SECTION.UNTRADABLEDUPLICATES && _.size(info.base.fastsbc) > 0) {
                let fastList = [];
                _.forOwn(info.base.fastsbc, (value, key) => {
                    const c = events.fastSBCQuantity(false, e, value);
                    if (c) {
                        const [cId, sId] = _.map(_.split(key, '#'), _.parseInt);
                        fastList.push({ sId, cId, c, n: key });
                    }
                });
                console.log(fastList)
                if(fastList.length){
                    if(_.size(services.SBC.repository.getSets())){
                        controller._fsuFastList = [];
                        _.forOwn(fastList,i => {
                            const set = services.SBC.repository.getSetById(i.sId);
                            const challenge = set ? set.getChallenge(i.cId) : null;
                            if(set && !set.isComplete() && (challenge == null || !challenge.isCompleted())){
                                let btnTitle = "";
                                if (!_.has(info.base.fastsbc[i.n], "n")) {
                                    if (set.challengesCount === 1) {
                                        info.base.fastsbc[i.n]["n"] = set.name;
                                    } else if (challenge && challenge.name) {
                                        info.base.fastsbc[i.n]["n"] = `${set.name}-${challenge.name}`;
                                    }
                                }

                                btnTitle = _.has(info.base.fastsbc[i.n], "n")
                                    ? `${info.base.fastsbc[i.n].n}`
                                    : `${set.name}-${i.cId}`;

                                console.log(btnTitle);

                                const duplicatePlayerIds = events.getItemBy(1, { id: _.map(e, "duplicateId"), untradeable: false });
                                const swapPlayers = e.filter(item => duplicatePlayerIds.includes(item.definitionId));

                                let fastBtn = events.createButton(
                                    new UTStandardButtonControl(),
                                    "",
                                    (e) => {
                                        function goFastSBC(b){
                                            const btn = b;
                                            if(btn._swap.length){
                                                console.log("有可交换的")
                                                events.showLoader();
                                                services.Item.move(btn._swap, ItemPile.CLUB).observe(cntlr.current(),async (e, t) => {
                                                    if (e.unobserve(cntlr.current()), t.success) {
                                                        services.Item.requestUnassignedItems().observe(cntlr.current(), (ee, tt) => {
                                                            ee.unobserve(cntlr.current());
                                                            if(tt.success){
                                                                events.isSBCCache(btn._sId, btn._cId)
                                                            }else{
                                                                events.notice("fastsbc.error_4",2)
                                                                events.hideLoader();
                                                            }
                                                        })
                                                    }else{
                                                        services.Notification.queue([services.Localization.localize("notification.item.moveFailed"), UINotificationType.NEGATIVE])
                                                    }
                                                });
                                            }else{
                                                events.isSBCCache(btn._sId, btn._cId)
                                            }
                                        }
                                        if (info.base.fastsbctips) {
                                            goFastSBC(e)
                                        } else {
                                            events.popup(
                                                fy("fastsbc.popupt"),
                                                fy("fastsbc.popupm"),
                                                (t) => {
                                                    if (t === 2) {
                                                        info.base.fastsbctips = true;
                                                        goFastSBC(e)
                                                    }
                                                }
                                            )
                                        }
                                    },
                                    "call-to-action"
                                );
                                fastBtn.getRootElement().style.overflow = "visible";
                                fastBtn.getRootElement().style.position = "relative";
                                let fastBtnBox = events.createElementWithConfig("div", {
                                    style:{
                                        display:"flex",
                                        alignItems:"flex-start",
                                        justifyContent:"center",
                                        flexDirection:"column",
                                        height:"2.6rem",
                                        maxWidth:"10rem",
                                        overflow:"hidden",
                                    }
                                })
                                let fastBtnTitle = events.createElementWithConfig("div", {
                                    textContent: btnTitle,
                                    style:{
                                        height:"1.6rem",
                                        lineHeight:"1.6rem",
                                        maxWidth:"10rem",
                                        fontSize:"1rem",
                                        textOverflow:"ellipsis",
                                        overflow:"hidden",
                                        whiteSpace:"nowrap",
                                    }
                                })
                                fastBtnBox.appendChild(fastBtnTitle)
                                let fastBtnText = events.createElementWithConfig("div", {
                                    style:{
                                        height:"1rem",
                                        lineHeight:"1rem",
                                        maxWidth:"10rem",
                                        fontSize:".8rem",
                                        color:"#a6a6a6",
                                    }
                                })
                                fastBtnText.innerHTML = events.getFastSbcSubText(info.base.fastsbc[i.n]);
                                _.forEach(fastBtnText.querySelectorAll("span"), el => {
                                    el.style.margin = "0 .1rem";
                                });
                                fastBtnBox.appendChild(fastBtnText)
                                let fastBtnTips = events.createElementWithConfig("div", {
                                    textContent:i.c,
                                    classList:["ut-tab-bar-item-notif"],
                                    style:{
                                        position:"absolute",
                                        top:"-.2rem",
                                        right:"-.2rem",
                                        fontSize:"1rem",
                                        background:"#36b84b",
                                    }
                                })
                                fastBtn.getRootElement().appendChild(fastBtnTips)
                                fastBtn.getRootElement().appendChild(fastBtnBox)
                                //fastBtn.__currencyLabel.innerHTML = events.getFastSbcSubText(info.base.fastsbc[`${i.cId}#${i.sId}`])

                                fastBtn._sId = i.sId;
                                fastBtn._cId = i.cId;
                                fastBtn._swap = swapPlayers;
                                controller._fsuFastList.push(fastBtn)
                            }
                        })
                        if(_.size(controller._fsuFastList)){
                            let fastBox = events.createElementWithConfig("div", {
                                style:{
                                    display:"flex",
                                    padding:".75rem .5rem",
                                    gap:".6em",
                                    overflowX:"scroll",
                                }
                            })
                            _.forOwn(controller._fsuFastList,b => {
                                fastBox.appendChild(b.getRootElement())
                            })
                            let fastSection = new UTSectionedItemListView();
                            fastSection.init();
                            fastSection.getRootElement().classList.add("fsu-screenshot")
                            fastSection._header.getRootElement().querySelector("h2").style.fontSize = "1.3rem";
                            fastSection._header.setText(fy(["fastsbc.title",_.size(controller._fsuFastList)]))
                            fastSection.getRootElement().appendChild(fastBox);
                            controller._fsuFastSection = fastSection;
                            this.getRootElement().prepend(controller._fsuFastSection.getRootElement())
                        }
                    }else{
                        events.notice("fastsbc.nosbcdata",2);
                    }
                }

            }
        }
        //24.20 lodin页面插入已加载提示
        UTLoginView.prototype._generate = function (...args) {
            if (!this._generated) {
                call.view.login.call(this, ...args);

                let locale = services.Localization.locale;
                // 항상 한국어로 설정
                info.language = 3;
                events.notice("notice.succeeded",0);
                let psBtn = events.createElementWithConfig("div",{
                    textContent:fy("notice.succeeded"),
                    style:{
                        color:"#36b84b"
                    }
                })
                this._linkGettingStarted.getRootElement().parentNode.appendChild(psBtn);
            }
        }
        //24.15 底层界面展示
        EAViewController.prototype.viewDidAppear = function(...args) {
            call.view.ea.call(this,...args);
        }

        //25.01 捕获转会市场收集到的球员价格
        UTTransferMarketPaginationViewModel.prototype.startAuctionUpdates = function(...args) {
            call.view.transferMarket.call(this,...args);
            if(services.Item.marketRepository.pages.length){
                _.map(services.Item.marketRepository.pages,p => {
                    _.map(p.items,i => {
                        if(!(_.has(info.roster.ea,i.definitionId)) || i._marketAverage !== -1){
                            info.roster.ea[i.definitionId] = {
                                "n":i._marketAverage,
                                "t":i._marketAverage !== -1 ? i._marketAverage.toLocaleString() : 0
                            }
                        }
                    })
                })
            }
        }

        //25.01 战术选择界面显示meta评分
        UTTacticsRoleSelectViewController.prototype.viewDidAppear = function(...args) {
            call.view.tacticsRole.call(this,...args);
            let pId = this.tacticsViewModel.getSquad().getSlot(this.tacticsViewModel.getSelectedSlotId()).item.definitionId;
            if(pId && _.has(info.meta,pId)){
                let metas = info.meta[pId].text;
                if(_.size(metas) > 1){
                    _.map(this.getView().roleCellViews,i => {
                        if(_.has(metas,i.id)){
                            let z = events.createElementWithConfig("span",{
                                textContent:`(${metas[i.id].rank} ${metas[i.id].rating} ${services.Localization.localize("playstyles.playstyle" + metas[i.id].chemstyle)})`,
                                style:{
                                    fontSize:"80%",
                                    opacity:".8",
                                    padding:"0 .5rem"
                                }
                            })
                            i.__name.appendChild(z)
                        }
                    })
                }
            }
        }


        //24.15 界面添加显示
        UTGameFlowNavigationController.prototype.didPush = function(e) {
            call.view.push.call(this,e);
            //24.15 SBC阵容界面隐藏头部SBC快捷入口
            if(info.douagain.hasOwnProperty("SBCListHtml") && info.set.sbc_headentrance){
                if(e.className == "UTSBCSquadSplitViewController" || e.className == "UTSBCSquadOverviewViewController" && info.douagain.SBCListHtml.style.display == "flex"){
                    info.douagain.SBCListHtml.style.display = "none";
                }else if(info.douagain.SBCListHtml.style.display == "none"){
                    info.douagain.SBCListHtml.style.display = "flex"
                }
            }
        }

        //24.14 初始化nav插入
        UTGameFlowNavigationController.prototype.viewDidAppear = function(...args) {
            call.view.nav.call(this,...args);
            let nav = this.getView()._navbar;
            if(nav){
                if(nav.className == "UTCurrencyNavigationBarView" && info.set.sbc_headentrance){
                    if(!info.douagain.hasOwnProperty("SBCListHtml")){
                        info.douagain.SBCListHtml = events.createElementWithConfig("div", {
                            classList:["fsu-navsbc"],
                            style:{
                                display:"flex",
                            }
                        })
                    }
                    if(isPhone()){
                        nav.__root.classList.add("fsu-shownavsbc");
                    }
                    nav._fsuSBCList = info.douagain.SBCListHtml;
                    if(nav.__root.querySelector(".view-navbar-currency")){
                        nav.__root.insertBefore(nav._fsuSBCList, nav.__currencies);
                    }
                }
                SBCCount.createElement(this.getView());
            }
        }

        //24.15 球员挑选最佳提示：球员挑选排序
        events.playerSelectionSort = (view,player) => {

            let leagueOrder = [13,53,31,19,16,2221,2222];
            let playerArr = _.map(player,(i,k) => {
                return {
                    p:events.getCachePrice(i.definitionId,1),
                    r:i.rating,
                    f:i.rareflag,
                    k:k,
                    l:_.includes(leagueOrder,i.leagueId) ? _.indexOf(leagueOrder, i.leagueId) : 99999}
            })
            let sortKey = ["r","f","l"],
                sortOrder = ["desc","desc","asc"]
            if(_.isEmpty(_.filter(playerArr, { p: 0 }))){
                sortKey.unshift("p");
                sortOrder.unshift("desc");
            }
            //获取可挑选数量
            let pickNumber = 1
            const pickNumberText = view.__selectedCounter.textContent;

            if(pickNumberText && _.includes(pickNumberText,"/")){
                const pickNumberParts = pickNumberText.split('/');
                const tempNumber = parseInt(pickNumberParts[1], 10);
                if(Number.isInteger(tempNumber) && tempNumber && tempNumber <= playerArr.length){
                    pickNumber = tempNumber
                }
            }


            let bestPlayer = _.take(_.orderBy(playerArr,sortKey,sortOrder), pickNumber);
            console.log(bestPlayer)
            if(bestPlayer.length){
                _.forOwn(bestPlayer,i =>{
                    view.__carouselIndicatorDots.classList.add("fsu-pickbest");
                    view.__carouselIndicatorDots.querySelectorAll("li")[i.k].classList.add("best");
                })
            }
        }


        UTSquadBuilderViewController.prototype.viewDidAppear = function() {
            call.view.build.call(this)
            if(this.squad && this.squad.isSBC()){
                this.getView().getSortDropDown().setIndexById(3);

                this.getView()._fsuleague = events.createToggle(
                    `${fy(`builder.league`)}(${info.set.shield_league.length})`,
                    async(e) => {
                        build.set("league",e.getToggleState())
                    }
                )
                this.getView()._fsuleague.toggle(info.build.league);
                this.getView()._searchOptions.__root.appendChild(this.getView()._fsuleague.__root);


                this.getView()._fsupos = events.createToggle(
                    fy(`builder.ignorepos`),
                    async(e) => {
                        build.set("ignorepos",e.getToggleState())
                    }
                )
                this.getView()._fsupos.toggle(info.build.ignorepos);
                this.getView()._searchOptions.__root.appendChild(this.getView()._fsupos.__root);

            }
        }
        //球员卡信息创建
        UTPlayerItemView.prototype.renderItem = function (p, t) {
            call.view.card.call(this, p, t);
            if (p.isValid()) {
                setTimeout(() => {
                    //卡片样式 0新版 1旧版
                    let stc = info.set.card_style == 1 ? "old" : "new" ;
                    let ct = t.getExpColorMap(p.getTier());
                    let cr = info.set.card_style == 1 ? `rgb(0,64,166)` : `rgb(${ct.dividers.r},${ct.dividers.g},${ct.dividers.b})`;

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
                    let fca = document.createElement("div");
                    fca.classList.add("fsu-cards","fsu-cards-attr",stc);
                    fca.style.borderColor = cr;
                    fca.innerHTML = `<div>${p.isLeftFoot() ? "L" : "R"}</div><div>${p.getSkillMoves()}/${p.getWeakFoot()}</div>`;
                    let pBodyType = events.getPlayerBodyType(p.databaseId);
                    if(pBodyType){
                        this._fsubodytype = events.createButton(
                            new UTButtonControl(),
                            "",
                            async(e) => {
                                events.popup(
                                    fy("plyers.bodytype.popupt"),
                                    fy(["plyers.bodytype.popupm",info.bodytypetext[pBodyType],fy(`players.bodytype_${pBodyType}`)]),
                                    (t) => {
                                    }
                                )
                            },
                            ""
                        )
                        this._fsubodytype.getRootElement().style.cursor = `pointer`;
                        this._fsubodytype.getRootElement().innerHTML = _.replace(info.bodytypetext[pBodyType], '&', `<span style='font-size:80%'>&</span>`);
                        fca.appendChild(this._fsubodytype.getRootElement());
                    }
                    this._fsuCardAttr = fca;

                    //24.18 可进化标识：计算展现标识数据
                    if(p.loans === -1 && !p.isGK()){
                        let academyNumber = 0;
                        _.map(repositories.Academy.getSlots(), v => {
                            if(v.status === AcademySlotState.NOT_STARTED && v.meetsRequirements(p)){
                                _.map(v.eligibilityRequirements,er => {
                                    if(er.attribute == AcademyEligibilityAttribute.OVR && er.scope == 1){
                                        if(p.rating > _.min(er.targets) - 6){
                                            academyNumber++;
                                        }
                                    }
                                })
                            }
                        });
                        if(academyNumber){
                            let academyTips = events.createElementWithConfig("div", {
                                classList:["fsu-academytips"],
                            })
                            academyTips.innerHTML = `<span class="fsu-academytips-icon"></span><span>${academyNumber}</span>`;
                            this._fsuCardAttr.appendChild(academyTips);
                        }

                    }


                    //价格区块
                    let pp = events.getCachePrice(p.definitionId,2);

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

                    /** 25.18 珍贵球员提示 **/
                    let preciousPlayerSquadController = isPhone() ? cntlr.current() : cntlr.left();
                    if(preciousPlayerSquadController?.className == "UTSBCSquadOverviewViewController" && events.getCachePrice(p.definitionId,1)){
                        if(!p.isSpecial() & _.gte(events.getCachePrice(p.definitionId,1), 2 * info.base.price[p.rating])){
                            this._fsuCardPrice.style.backgroundColor = "#9f1d00";
                            preciousPlayerSquadController._fsuValuable = _.union(_.isArray(preciousPlayerSquadController._fsuValuable) ? preciousPlayerSquadController._fsuValuable : [], [p.definitionId]);
                        }
                    }

                    let fcr = document.createElement("div");
                    fcr.classList.add("fsu-cards-rating","fsu-cards");
                    fcr.style.color = info.set.card_style == 1 ? `#656563` : `rgb(${ct.dividers.r},${ct.dividers.g},${ct.dividers.b})`;
                    fcr.textContent = p.rating;
                    this._fsuCardRating = fcr;

                    if(_.has(p,"_fsuPrice") && _.has(p,"_fsuClosing")){
                        let autoBuyPriceBox = events.createElementWithConfig("div", {
                            classList:["fsu-price-box","right"],
                        })
                        let autoBuyPrice = events.createElementWithConfig("div", {
                            classList:["fsu-price-val"],
                            style:{
                                width:"7rem",
                                padding:"0.5rem 0"
                            }
                        })
                        let autoBuyPriceTitle = events.createElementWithConfig("div", {
                            textContent:fy("autobuy.list.title0"),
                            classList:["title"]
                        })
                        let autoBuyPriceValue = events.createElementWithConfig("div", {
                            textContent:p._fsuPrice.toLocaleString(),
                            classList:["value"],
                            style:{
                                fontSize:"1rem"
                            }
                        })
                        autoBuyPrice.appendChild(autoBuyPriceTitle);
                        autoBuyPrice.appendChild(autoBuyPriceValue);
                        autoBuyPriceBox.appendChild(autoBuyPrice);


                        let autoBuyClosing = events.createElementWithConfig("div", {
                            classList:["fsu-price-val"],
                            style:{
                                marginLeft:"1rem",
                                width:"7rem",
                                padding:"0.5rem 0"
                            }
                        })
                        let autoBuyClosingTitle = events.createElementWithConfig("div", {
                            textContent:fy("autobuy.list.title1"),
                            classList:["title"]
                        })
                        let autoBuyClosingValue = events.createElementWithConfig("div", {
                            textContent:p._fsuClosing.toLocaleString(),
                            classList:["value"],
                            style:{
                                fontSize:"1rem"
                            }
                        })
                        autoBuyClosing.appendChild(autoBuyClosingTitle);
                        autoBuyClosing.appendChild(autoBuyClosingValue);
                        autoBuyPriceBox.appendChild(autoBuyClosing);

                        if (p.untradeable) {
                            autoBuyPriceValue.textContent = fy("autobuy.list.text1");
                            autoBuyClosingValue.textContent = fy("autobuy.list.text2");
                            autoBuyPriceValue.style.color = "#f7b702";
                            autoBuyClosingValue.style.color = "#f7b702";
                        } else {
                            if (p._fsuPrice) {
                                autoBuyPriceValue.classList.add("currency-coins");
                                autoBuyPriceValue.style.fontSize = "1.1rem";
                            } else {
                                autoBuyPriceValue.textContent = fy("autobuy.list.text0");
                            }

                            if (p._fsuClosing) {
                                autoBuyClosingValue.classList.add("currency-coins");
                                autoBuyClosingValue.style.fontSize = "1.1rem";
                            } else {
                                autoBuyClosingValue.textContent = fy("autobuy.list.text0");
                            }
                        }

                        this._fsuCardPriceBox = autoBuyPriceBox;
                    }else{
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
                    }


                    let plow = info.base.price.hasOwnProperty(p.rating) && p.rating > info.base.price.low && p.rating < info.base.price.high ? `<div class="fsu-other-low currency-coins">${p.rating} Min : ${Number(info.base.price[p.rating]).toLocaleString()}</div>` : `<span class="fsu-other-low"></span>`;

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

                    if(info.set.card_meta){
                        let playerGGR = events.getPlayerGGR(p);
                        playerGGR["textColor"] = "#0f1010";
                        if(info.set.card_style == 1){
                            playerGGR.gradeColor = `rgb(0,64,166)`;
                            playerGGR.textColor = "#fcfcf7";
                        }
                        this._fsuCardMeta = events.createButton(
                            new UTButtonControl(),
                            "",
                            async(e) => {
                                GM_openInTab(`https://www.fut.gg/players/${p.databaseId}/${info.base.year}-${p.definitionId}/`, { active: true, insert: true, setParent :true });
                            },
                            "item fsu-cards fsu-cards-meta"
                        )
                        this._fsuCardMeta.getRootElement().setAttribute("data-id",p.id);
                        this._fsuCardMeta.getRootElement().setAttribute("data-defid",p.definitionId);
                        this._fsuCardMeta.getRootElement().style.borderColor = playerGGR.gradeColor;
                        let mRk = events.createElementWithConfig("div", {
                            textContent:playerGGR.grade,
                            style:{
                                color:playerGGR.textColor,
                                backgroundColor:playerGGR.gradeColor,
                                lineHeight:`1.1rem`,
                            },
                            classList:["mrk"],
                        })
                        this._fsuCardMeta.getRootElement().appendChild(mRk)
                        let mPr = events.createElementWithConfig("div", {
                            textContent:playerGGR.scoreText,
                            classList:["mpr"],
                        })
                        this._fsuCardMeta.getRootElement().appendChild(mPr)
                        let mRp = events.createElementWithConfig("div", {
                            textContent:playerGGR.posText,
                            classList:["mrp"],
                        })
                        this._fsuCardMeta.getRootElement().appendChild(mRp)
                        if(!_.has(this,`_fsuCardMetaRating`)){
                            this._fsuCardMetaRating = events.createElementWithConfig("div", {
                                textContent:playerGGR.grade,
                                style:{
                                    fontSize:`100%`,
                                    fontWeight:`500`,
                                    marginTop:p.concept ? `0` : `-.3rem`
                                },
                                classList:["fsu-cards-metarating"]
                            })
                            this._fsuCardMetaRating.setAttribute("data-id",p.id);
                            this._fsuCardMetaRating.setAttribute("data-defid",p.definitionId);
                            if(this.__mainViewDiv && this.__mainViewDiv.querySelector(".playerOverview")){
                                this.__mainViewDiv.querySelector(".playerOverview").appendChild(this._fsuCardMetaRating)
                                this.__mainViewDiv.querySelector(".playerOverview").style.top = "24%";
                            }

                        }
                        if(playerGGR.score === 0){
                            this._fsuCardMetaRating.style.display = "none";
                            this._fsuCardMeta.getRootElement().style.display = "none";
                        }
                    }
                    if(false && info.set.card_meta && p.possiblePositions.length){
                        let playerMetaAll = events.getPlayerMetaToText(p);
                        let playerMeta = _.cloneDeep(playerMetaAll[`base`]);
                        playerMeta["rankColor"] = "#0f1010";
                        if(info.set.card_style == 1){
                            playerMeta.rankBg = `rgb(0,64,166)`;
                            playerMeta.rankColor = "#fcfcf7";
                        }
                        let playerFullName = p._staticData.getFullName();
                        let esName = _.join(_.words(playerFullName).map(part => _.lowerCase(part.charAt(0)) + part.slice(1)), '-');
                        this._fsuCardMeta = events.createButton(
                            new UTButtonControl(),
                            "",
                            async(e) => {
                                events.popup(
                                    fy("plyers.relo.popupt"),
                                    events.getPlayerMetaPopupText(playerMeta),
                                    (t) => {
                                        if(t == 44406){
                                            GM_openInTab(`https://www.easysbc.io/players/${esName}/${p.definitionId}?player-role=${playerMeta.eioName}`, { active: true, insert: true, setParent :true });
                                        }
                                    },
                                    [
                                        { labelEnum: 44406 },
                                        { labelEnum: enums.UIDialogOptions.CANCEL }
                                    ]
                                )
                            },
                            ""
                        )
                        this._fsuCardMeta.getRootElement().classList.add("item");
                        this._fsuCardMeta.getRootElement().classList.add("fsu-cards");
                        this._fsuCardMeta.getRootElement().classList.add("fsu-cards-meta");
                        let mRk = events.createElementWithConfig("div", {
                            textContent:playerMeta.rank,
                            style:{
                                color:playerMeta.rankColor,
                                backgroundColor:playerMeta.rankBg,
                                borderColor:cr,
                            }
                        })
                        this._fsuCardMeta.getRootElement().appendChild(mRk)
                        let mPr = events.createElementWithConfig("div", {
                            textContent:playerMeta.name,
                        })
                        this._fsuCardMeta.getRootElement().appendChild(mPr)
                        let mRt = events.createElementWithConfig("div", {
                            textContent:playerMeta.rating,
                        })
                        this._fsuCardMeta.getRootElement().appendChild(mRt)
                        let mCs = events.createElementWithConfig("div", {
                            classList:["playStyle",`chemstyle${playerMeta.chemstyle}`],
                            style:{
                                fontSize:".9rem",
                                marginTop:"-1px",
                            }
                        })
                        this._fsuCardMeta.getRootElement().appendChild(mCs)

                        if(!_.has(this,`_fsuCardMetaRating`)){
                            this._fsuCardMetaRating = events.createElementWithConfig("div", {
                                textContent:playerMeta.rank,
                                style:{
                                    fontSize:`100%`,
                                    fontWeight:`500`,
                                    marginTop:p.concept ? `0` : `-.3rem`
                                }
                            })
                            if(this.__mainViewDiv && this.__mainViewDiv.querySelector(".playerOverview")){
                                this.__mainViewDiv.querySelector(".playerOverview").appendChild(this._fsuCardMetaRating)
                                this.__mainViewDiv.querySelector(".playerOverview").style.top = "24%";
                            }

                        }
                    }
                    if(this.__firstOwner && info.set.card_meta){
                        this.__firstOwner.style.display = `none`;
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
                    if(this.__root.parentNode && !this.__root.parentNode.classList.contains("CompareDetails")){
                        this.__root.parentNode.querySelectorAll(".fsu-cards:not(.reserve)").forEach(e => e.remove());
                    }
                    if(this.__root.classList.contains("small")){
                        let sp = `span[p-id="${pId}"]`;
                        let pm = {
                            1:`.itemList > .listFUTItem.won ${sp}`,
                            2:`.itemList > .listFUTItem.has-auction-data ${sp}`,
                            3:`.itemList > .listFUTItem ${sp}`,
                            //拍卖行
                            4:`.ut-navigation-container-view.ui-layout-right .SearchResults .paginated-item-list .listFUTItem.has-auction-data ${sp}`,
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
                            31:`.player-pick-option .small  ${sp}`
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
                        if(cs == 7 && document.querySelector(".icon-transfer.selected")) cs = 12;
                        if(cs == 8 && (document.querySelector(".icon-club.selected") || document.querySelector(".fsu-aotobuy"))) cs = 9;
                        if(cs == 2 && controller.className == "UTWatchListViewController") cs = 11;
                        if(cs == 8 && controller.className == "UTAcademyPlayerFromClubViewController") cs = 3;
                        if(cs == 6 && document.querySelector(".fsu-autobuy-right")) cs = 13;
                        //console.log(cs)
                        if(cs !== 0){
                            this._fsuCardPrice.setAttribute('data-cs',cs);
                            this._fsuCardPriceBox.setAttribute('data-cs',cs);
                            
                            let parentElement = this.getRootElement().parentNode;

                            if(_.has(this,`_fsubodytype`)){
                                this._fsubodytype.setInteractionState(0)
                            }

                            //位置区块添加
                            //额外属性区块
                            if(![31].includes(cs)){
                                this.__root.after(this._fsuCardAttr);
                            }
                            if(cs == 25){
                                Object.assign(this._fsuCardPos.style, {
                                    top: "36%",
                                    left: "calc(50% - 52px)",
                                    fontSize: "8px",
                                });
                                Object.assign(this._fsuCardAttr.style, {
                                    top: "36%",
                                    left: "calc(50% + 30px)",
                                    fontSize: "8px",
                                });
                            }
                            if([21,22,23,24,25].includes(cs)){
                                this.__root.after(this._fsuCardPos);
                                if([21,23].includes(cs) && info.lock.includes(pId)){
                                    let cardLock = document.createElement("div");
                                    cardLock.classList.add("fsu-cards","fsu-cardlock");
                                    this.__root.after(cardLock);
                                }
                            }
                            if([5,21,22,23,24,25,31].includes(cs)){
                                if(cs == 21 && !p.untradeable){
                                    let uP = _.find(repositories.Item.getUnassignedItems(), (item) => item.definitionId === p.definitionId);
                                    if(uP && uP.untradeable){
                                        this._fsuCardPrice.classList.add("fsu-unassigned")
                                    }
                                }
                                this.__root.prepend(this._fsuCardPrice);
                            }else{
                                let pbc = "right";
                                if([1,2,12,11].includes(cs)){
                                    pbc = "top";
                                    if(isPhone()){
                                        this.getRootElement().parentNode.querySelector(".name").style.width = "25%";
                                    }
                                }
                                this._fsuCardPriceBox.classList.add(pbc);
                                if(cs == 12 || cs == 11){
                                    this._fsuCardPriceBox.querySelector(".fsu-price-last")?.remove();
                                    this._fsuCardPriceBox.querySelector(".title span")?.remove();
                                    this.__root.parentNode.append(this._fsuCardPriceBox);
                                }else if([6,8,7,4,13].includes(cs)){
                                    this.__root.prepend(this._fsuCardPrice);
                                }else{
                                    this.__root.after(this._fsuCardPriceBox);
                                }

                                if(cs == 12 || cs == 6) this._fsuCardOther.querySelector(".fsu-other-low").remove();
                                if(cs == 1 || cs == 8  || cs == 9 || cs == 13) this._fsuCardOther.querySelector(".fsu-other-dup").remove();
                                if(![7,4].includes(cs)){
                                    this.__root.parentNode.append(this._fsuCardOther);
                                }
                                if(cs == 13 && info.autobuy.infoViews[p.definitionId]){
                                    console.log(info.autobuy.infoViews[p.definitionId].goToSalesBtn,info.autobuy.infoViews[p.definitionId].setPriceBtn)
                                    parentElement.querySelector(".fsu-autobuy-btn").remove();
                                    parentElement.appendChild(info.autobuy.infoViews[p.definitionId]._cardBtnBox)
                                }
                            }
                            if([8,9].includes(cs) && playerLock){
                                parentElement.querySelector(".name").classList.add("fsulocked")
                            }


                            if(controller.className.includes("UTSBCSquad") && cs == 21){
                                //阵容刷新后购买失败标识添加
                                if("_fsuBuyEroor" in controller._squad && controller._squad._fsuBuyEroor.includes(pId) && p.concept){
                                    if(parentElement.querySelector(".fsu-cards-buyerror") == null){
                                        parentElement.insertBefore(events.getCardTipsHtml(1), this.getRootElement());
                                    }
                                }

                                //25.02 添加SBC仓库标识
                                if(!p.concept && repositories.Item.storage.get(p.id)){
                                    if(parentElement.querySelector(".fsu-cards-storage") == null){
                                        parentElement.insertBefore(events.getCardTipsHtml(2), this.getRootElement());
                                    }
                                }
                            }

                            //25.21 开包后处理位置显示
                            if (cs === 3 && _.has(p, "storeLoc")) {
                                const dup = this._fsuCardOther.querySelector(".fsu-other-dup");
                                if (dup) {
                                    dup.className = "fsu-other-dup";
                                    const isClub = p.storeLoc === 1;
                                    dup.innerText = isClub ? info.base.localization[`nav.label.club`] : fy(`storage.tile`);
                                    dup.classList.add(isClub ? "swap" : "storage");
                                }
                            }
                        }

                    }else{
                        let cardParen = this.__root.parentElement;
                        if(!cardParen){
                            return;
                        }
                        let isCompare = false;
                        if(document.querySelector(`.CompareDetails .large.player span[p-id="${pId}"]`) && info.set.card_meta){
                            isCompare = true;
                            this._fsuCardAttr.classList.add("reserve")
                            this._fsuCardMeta.getRootElement().classList.add("reserve");
                        }
                        //24.18 修复锁定按钮显示不了的问题
                        if(p.loans == -1 && !p.concept && p.state == ItemState.FREE && !p.isDuplicate() && events.getItemBy(1,{"id":p.id}).length && !isCompare){
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
                                `fsu-cards fsu-lockbtn ${playerLock ? "unlock" : "lock"} ${isPhone() ? "" : "mini"}`
                            )
                            this._fsuLock.id = p.id;
                            cardParen.insertBefore(this._fsuLock.getRootElement(),cardParen.firstChild)
                        }
                        if(cardParen.querySelectorAll(".player").length > 1){
                            if(!isCompare){
                                this.__root.prepend(this._fsuCardPos);
                            }
                            this.__root.prepend(this._fsuCardAttr);
                        }else{
                            this.__root.after(this._fsuCardPos);
                            this.__root.after(this._fsuCardAttr);
                            if(this.__root.parentNode.style.position == ""){
                                this.__root.parentNode.style.position = "relative"
                            }
                        }
                        this.__root.prepend(this._fsuCardPrice);


                        if(_.has(this,"_fsuCardMeta")){
                            this.__root.after(this._fsuCardMeta.getRootElement());
                        }
                        if(cardParen.classList.contains('player-pick-option')){
                            cardParen.style.position = "relative";
                            cardParen.style.padding = "0 1.2rem";
                            this._fsuCardOther.querySelector(".fsu-other-low").remove();
                            this._fsuCardOther.querySelector(".fsu-other-pos").remove();
                            if(!isPhone()){
                                this._fsuCardMeta.getRootElement().style.bottom = "1.4rem";
                            }else{
                                this._fsuCardMeta.getRootElement().style.bottom = "4rem";
                            }
                            this.__root.after(this._fsuCardOther)
                        }

                        //25.02 奖励大卡片状态下meta上移
                        if(cardParen.classList.length == 1 && cardParen.classList.contains('reward')){
                            this._fsuCardMeta.getRootElement().style.bottom = "1.6rem";
                        }



                        //大卡预览处增加购买失败描述
                        if("_squad" in controller && "_fsuBuyEroor" in controller._squad && controller._squad._fsuBuyEroor.includes(pId) && p.concept && cardParen.classList.contains("tns-item")){
                            if(cardParen.querySelector(".fsu-cards-buyerror") == null){
                                this.getRootElement().appendChild(events.getCardTipsHtml(1))
                            }
                        }

                        //25.02 大卡预览增加SBC商店标识
                        if(!p.concept && repositories.Item.storage.get(p.id)){
                            if(cardParen.querySelector(".fsu-cards-storage") == null){
                                this.getRootElement().appendChild(events.getCardTipsHtml(2))
                            }
                        }

                        //战术编辑处调整大卡片的属性显示错误。
                        if((cardParen.classList.contains("ut-tactics-instruction-menu-view--item-container") || cardParen.classList.contains("main-reward")) && cardParen.classList.length === 1){
                            cardParen.style.position = "relative";
                        }

                        //25.01 战术编辑处角色调整
                        if(cardParen.classList.contains("ut-tactics-role-menu-view--item-container")){

                            this._fsuCardAttr.style.left = "auto";
                            this._fsuCardAttr.style.right = ".2rem";

                            this._fsuCardPos.style.left = "auto";
                            this._fsuCardPos.style.right = "124px";

                            this._fsuLock.getRootElement().style.display = "none";

                            this._fsuCardMeta.getRootElement().style.left = "auto";
                            this._fsuCardMeta.getRootElement().style.right = "1rem";
                            this._fsuCardMeta.getRootElement().style.setProperty('transform', 'translateX(0)', 'important');
                            this._fsuCardMeta.getRootElement().style.setProperty('-webkit-transform', 'translateX(0)', 'important');

                        }


                        if(_.has(this,`_fsuCardMetaRating`)){
                            this._fsuCardMetaRating.style.paddingTop = "0.2rem";
                            this._fsuCardMetaRating.style.fontSize = "150%";
                            this._fsuCardMetaRating.style.marginTop = "0";
                            if(this.__mainViewDiv.querySelector(".playerOverview")){
                                this.__mainViewDiv.querySelector(".playerOverview").style.top = "";
                            }
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

        //球员道具信息创建效果
        UTMiscItemView.prototype.renderItem = function(t, e) {
            call.view.miscItem.call(this, t, e);
            if(t.isPlayerPickItem()){
                let pickOddo = events.getOddo(t.definitionId);
                if(pickOddo){
                    if(this.className.includes("Small")){
                        if(cntlr.current().className.includes("Unassigned") && this.getRootElement().parentElement){
                            let oddoBox = events.createElementWithConfig("div", {
                                textContent:`${fy("returns.text")}${pickOddo.toLocaleString()}`,
                                classList: ['currency-coins']
                            });
                            this.getRootElement().parentElement.appendChild(oddoBox);
                        }
                    }else{
                        let oddoBox = events.createElementWithConfig("div", {
                            style:{
                                position:"absolute",
                                bottom:"0",
                                backgroundColor:"rgb(0 0 0 / 60%)",
                                width:"100%",
                                textAlign:"center",
                                padding:".2rem 0",
                                color:"#ffffff",
                                fontSize:"1rem",
                                paddingBottom:".5rem"
                            }
                        });
                        let oddoTitle = events.createElementWithConfig("div", {
                            textContent:_.replace(_.replace(fy("returns.text"),":",""),"：","")
                        });
                        oddoBox.appendChild(oddoTitle)
                        let oddoCoin = events.createElementWithConfig("div", {
                            classList: ['currency-coins'],
                            textContent:pickOddo.toLocaleString()
                        });
                        oddoBox.appendChild(oddoCoin)
                        this.getRootElement().appendChild(oddoBox);
                    }
                }
            }
        }
        call.plist = {
            sectioned:UTSectionedItemListView.prototype.addItems,
            paginated:UTPaginatedItemListView.prototype.renderItems,
            storeReveal:UTStoreRevealModalListView.prototype.addItems,
            club:UTClubRepository.prototype.removeClubItem,
            squadSet:UTSquadEntity.prototype.setPlayers,
            squadGR:UTSquadEntity.prototype.getRating,
            squad:UTSquadOverviewViewController.prototype.viewDidAppear
        }
        call.selectClub = {
            updata:UTSelectItemFromClubViewController.prototype.updateItemList,
            request:UTSelectItemFromClubViewController.prototype.requestItems,
            handle:UTSelectItemFromClubViewController.prototype.handleItemRetrieval
        }
        call.other = {
            uaTile:UTUnassignedTileView.prototype.setNumberOfItems,
            store:{
                setPacks:UTStoreView.prototype.setPacks,
                openPack:UTStoreViewController.prototype.eOpenPack,
                setCategory:UTStoreViewController.prototype.setCategory
            },
            market:{
                eSearch:UTMarketSearchFiltersViewController.prototype.eSearchSelected,
                setFilter:UTMarketSearchFiltersView.prototype.setFilters,
            },
            rewards:{
                choice:UTRewardSelectionChoiceViewController.prototype.viewDidAppear,
                popupTapped:UTGameRewardsViewController.prototype.onButtonTapped,
                objectiveDetail:FCObjectiveDetailsView.prototype.render,
                choiceSet:UTRewardSelectionChoiceView.prototype.expandRewardSet,
                check:{
                    FC:FCGameRewardsViewController.prototype.checkRewards,
                    UT:UTGameRewardsViewController.prototype.checkRewards,
                }
            },
            localize:EALocalizationService.prototype.localize,
            picks:{
                setItems:UTPlayerPicksView.prototype.setCarouselItems
            }
        }



        //25.09 新挑选包界面
        UTPlayerPicksView.prototype.setCarouselItems = function(e) {
            call.other.picks.setItems.call(this,e)
            events.loadPlayerInfo(e,this);

            _.forEach(this._carouselItemsContainer.__carouselItemsContainer.children, (child) => {
                child.style.margin = '1.8rem 1.2rem';
            });


            let futbinBtn = events.createButton(
                new UTStandardButtonControl(),
                fy("quicklist.gotofutbin"),
                (e) => {
                    let index = Number(e._view.__carouselIndicatorDots.querySelector(".active").getAttribute("data-index"))
                    let player = e._player[index];
                    e.getRootElement().setAttribute('data-id', player.definitionId);
                    e.getRootElement().setAttribute('data-name', player.getStaticData().name);
                    events.openFutbinPlayerUrl(e);
                },
                "mini select-btn call-to-action"
            );
            futbinBtn._view = this;
            futbinBtn._player = e;

            let btnBox = events.createElementWithConfig("div",{
                style: {
                    display:"flex"
                }
            })
            btnBox.appendChild(this._selectBtn.getRootElement())
            btnBox.appendChild(futbinBtn.getRootElement())
            this.__chooseContainer.appendChild(btnBox)

            //25.12 手机端缩小以适配
            if(isPhone()){
                this._carouselItemsContainer.getRootElement().style.margin = "-1.5rem 0";
            }else{
                this.getRootElement().style.height  = "auto";
            }

            if(info.set.player_pickbest && e.length){
                events.playerSelectionSort(this,e)
            }


            /** 25.18 firefox浏览器无法挑选最后一个临时解决办法 */
            if(navigator.userAgent.toLowerCase().includes('firefox')){
                let lastDiv = events.createElementWithConfig("div",{
                    classList:["ut-companion-carousel-item-view"],
                    style:{
                        width:"200px",
                        pointerEvents:"none"
                    }
                })
                this._carouselItemsContainer.__carouselItemsContainer.appendChild(lastDiv);
            }
        }

        //25.09 获奖弹窗展示开包概率
        FCGameRewardsViewController.prototype.checkRewards = function(e) {
            call.other.rewards.check.FC.call(this,e);
            console.log(this,e)
        }
        UTGameRewardsViewController.prototype.checkRewards = function(e) {
            call.other.rewards.check.UT.call(this,e);
            _.map(e,(t,i) => {
                if(t.isPack){
                    events.setRewardOddo(this.getView()._rewardsCarousel.getRootElement().querySelectorAll(".reward")[i],t);
                }
            })
        }

        UTSquadOverviewViewController.prototype.viewDidAppear = function() {
            call.plist.squad.call(this);
            
            events.loadPlayerInfo(_.map(this._squad._players,"_item"));


            if(this._squad.isSBC()){


                let sp = this.getView();
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
                let baseRating = 0;
                let listType = 1; //1为普通 2为最低评分模式 3正好评分模式
                let isQuality = false;
                let qualityType = 0;
                let maxRating = 99;
                let th = document.createElement("div");
                th.classList.add("fsu-quick","top")
                sp._fsuQuickTop = th;
                let to = document.createElement("div");
                to.classList.add("fsu-quick-list","other");
                sp._fsuQuickOther = to;
                sp._fsuRlist = {};

                for (let i of e) {
                    if(i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.TEAM_RATING)){
                        baseRating = i.kvPairs._collection[SBCEligibilityKey.TEAM_RATING][0];
                        sp._fsuCount = events.createButton(
                            new UTButtonControl(),
                            fy("sbc.count"),
                            (e) => {events.squadCount(e);},
                            "im"
                        )
                        sp._fsuCount.__root.setAttribute("data-r",baseRating);
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
                    //24.16 交换SBC优化：新加入快捷计算评分类型
                    if(i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.PLAYER_MIN_OVR) && e.length == 1){
                        baseRating = i.kvPairs._collection[SBCEligibilityKey.PLAYER_MIN_OVR][0];
                        listType = 2;
                    }

                    //25.10 加入品质计算
                    if(i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.PLAYER_QUALITY)){
                        qualityType = i.kvPairs._collection[SBCEligibilityKey.PLAYER_QUALITY][0];
                        isQuality = true;
                        if(qualityType == 1){
                            baseRating = 45;
                            maxRating = 63;
                        }else if(qualityType == 2){
                            baseRating = 65;
                            maxRating = 74;
                        }else{
                            baseRating = 75;
                            maxRating = info.set.goldenrange;
                        }
                        listType = 2;
                    }

                    //25.21 加入正好评分球员计算
                    if(i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.PLAYER_EXACT_OVR) && e.length == 1){
                        baseRating = i.kvPairs._collection[SBCEligibilityKey.PLAYER_EXACT_OVR][0];
                        listType = 3;
                    }
                }

                //25.10 判断是否可以快速完成并插入按钮
                if(_.size(info.base.fastsbc) > 0){
                    let sId = this._set.id,
                        cId = this._challenge.id,
                        q = info.base.fastsbc[`${cId}#${sId}`];
                    if(q){
                        console.log(q)
                        let qs = events.fastSBCQuantity(true,_.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.duplicateId !== 0),q);
                        if(qs){

                            let fsBtn = events.createButton(
                                new UTButtonControl(),
                                fy(["fastsbc.sbcbtntext",qs]),
                                (e) => {
                                    if (info.base.fastsbctips) {
                                        events.isSBCCache(e._sId, e._cId)
                                    } else {
                                        events.popup(
                                            fy("fastsbc.popupt"),
                                            fy("fastsbc.popupm"),
                                            (t) => {
                                                if (t === 2) {
                                                    info.base.fastsbctips = true;
                                                    events.isSBCCache(e._sId, e._cId)
                                                }
                                            }
                                        )
                                    }
                                },
                                "im"
                            );
                            fsBtn.__root.style.fontSize = "90%";
                            fsBtn._sId = sId;
                            fsBtn._cId = cId;

                            sp._fsuQuickOther.append(fsBtn.__root);
                            this.getView()._fsuRlist["fs"] = fsBtn;
                        }
                    }
                }


                let ratingStart = baseRating !== 0 ? baseRating : 75;
                let rh = document.createElement("div");
                rh.classList.add("fsu-quick","right");
                rh.innerHTML = `<div class="fsu-quick-list"></div>`;
                sp._fsuQuickRight = rh;
                let ratingArray = [],
                ratingLimit = listType == 1 ? (isPhone() ? [4,8] : [5,10]) : (listType == 2 ? (isPhone() ? [0,8] : [0,10]) : [0,1]);
                for (let i = 1; i < 11; i++) {
                    if(listType == 2 || listType == 3){
                        break;
                    }
                    if(events.getDedupPlayers(events.getItemBy(1,{"rating":ratingStart - i}),this._squad.getPlayers()).length){
                        ratingArray.push(ratingStart-i);
                    }
                    if(ratingArray.length == ratingLimit[0]){
                        break;
                    }
                }
                for (let i = 0; i < maxRating - ratingStart; i++) {
                    if(events.getDedupPlayers(events.getItemBy(1,{"rating":ratingStart + i}),this._squad.getPlayers()).length){
                        ratingArray.unshift(ratingStart + i);
                    }
                    if(ratingArray.length == ratingLimit[1]){
                        break;
                    }
                }
                if(ratingStart !== 0 && ratingArray.length){
                    let ts = document.createElement("div");
                    ts.classList.add("fsu-quick-list","left");
                    sp._fsuQuickTop.append(ts);

                    if(!isQuality && !qualityType){
                        if(listType !== 3){
                            let ratPlus = `${Number(ratingArray[0]) + 1}`,
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
                        }

                        if(listType == 1){
                            let ratMinus = `${Number(ratingArray[ratingArray.length - 1]) - 1}`,
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
                        }
                    }else{
                        let qualityBut = events.createButton(
                            new UTButtonControl(),
                            "",
                            (e) => {events.SBCSetRatingPlayers(e);},
                            "im"
                        )
                        qualityBut.__root.innerHTML = `${ratingStart}<span>-</span>${maxRating}`;
                        qualityBut.__root.setAttribute("data-r",`RS`);
                        qualityBut.__root.setAttribute("data-v",qualityType - 1);
                        sp._fsuRlist[`t_RS_${qualityType - 1}`] = qualityBut;
                        sp._fsuQuickTop.querySelector(`.left`).append(qualityBut.__root);
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

                //24.15 头部快捷入口：进入SBC插入到SBCLIST
                events.SBCListInsertToFront(this._set.id,1);

                for (let i of ratingArray) {
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

                //开始判断是否需要屏蔽搜索按钮
                let transferIds = _.uniq(_.map(repositories.Item.getTransferItems(),i => {if(i.getAuctionData().isInactive()){ return i.definitionId}}).filter(Boolean));
                if(transferIds.length){
                    if(events.getDedupPlayers(events.getItemBy(2,{definitionId:transferIds}),this._squad.getPlayers()).length){
                        quickTransfersBtn.setInteractionState(1)
                    }
                }

                if(repositories.Item.numItemsInCache(ItemPile.STORAGE)){
                    let quickStorageBtn = events.createButton(
                        new UTButtonControl(),
                        fy("sbc.qucikstorage"),
                        (e) => {events.SBCSetRatingPlayers(e);},
                        "im"
                    );
                    quickStorageBtn.__root.setAttribute("data-r","s");
                    //25.21 排序由高于黄金范围改为高于最小仓库评分
                    quickStorageBtn.__root.setAttribute("data-order",ratingStart > _.min(_.map(repositories.Item.getStorageItems(),"rating")) ? "desc" : "asc");
                    sp._fsuRlist["r_s"] = quickStorageBtn;
                    sp._fsuQuickRight.querySelector(".fsu-quick-list").append(quickStorageBtn.getRootElement());
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

            events.loadPlayerInfo(_.map(this.listRows,"data"),this);

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
                                (t,i) => {
                                    if(t === 2){
                                        //24.18 插入批量拍卖时间校正
                                        let v = Number(i.getValue()),vAudit = [0,1,3,6,12,24,72]
                                        if(!_.isNaN(v) && _.includes(vAudit,v)){
                                            events.losAuctionSell(e,v);
                                        }else{
                                            events.notice(fy("loas.input.error"),2)
                                        }
                                    }
                                },
                                false,
                                fy("loas.input"),
                                true,
                                fy("loas.input.tips")
                            )
                        },
                        "btn-standard section-header-btn mini",
                    )
                    this._fsuAkbButton.setInteractionState(0);
                    this._fsuAkbButton._parent = this;

                    this._fsuAkb.appendChild(this._fsuAkbButton.__root);
                    this._header.__root.after(this._fsuAkb);
                    const playerIds = _.chain(this.listRows).filter(row => row.data.type === 'player' && !events.getCachePrice(row.data.definitionId, 3)).map(row => row.data.definitionId).value();
                    if(playerIds.length == 0){
                        events.losAuctionCount(this,0);
                    }
                }
            }
        }

        //25.07 创建拍卖按钮移动出成为单独的实践，以免不激活。
        //24.16 排除球员配置按钮：排除生效事件
        events.ignorePlayerToCriteria = (c) => {
            if(info.build.league){
                c["NEleagueId"] = info.set.shield_league;
            }
            if(info.build.untradeable){
                c["untradeable"] = true;
            }
            if(!_.has(c,"rareflag")){
                c["rareflag"] = [0,1];
                if(info.build.flag){
                    c["rareflag"] = c["rareflag"].concat(info.set.shield_flag);
                }
            }
            if(info.build.academy){
                c["academy"] = null;
            }
            if(info.build.firststorage){
                c["firststorage"] = true;
            }else{
                c["firststorage"] = false;
            }
            c["removeSquad"] = true;
            return c;
        }

        //25.13 排除联赛和不排除品质配置
        events.ignorePlayerTypePopup = (type) => {
            //type 1:联赛、2：品质

            const config = {};
            const typeConfig = {
                1: {
                    title: `shieldlea.btntext`,
                    msg: `shieldlea.popupm`,
                    set: `shield_league`,
                    attribute: `leagueId`,
                    factories: () => factories.DataProvider.getLeagueDP(true).filter(l => l.id !== -1)
                },
                2: {
                    title: `shieldflag.btntext`,
                    msg: `shieldflag.popupm`,
                    set: `shield_flag`,
                    attribute: `rareflag`,
                    factories: () => factories.DataProvider.getItemRarityDP({
                        itemSubTypes: [2],
                        itemTypes: ["player"],
                        quality: "any",
                        tradableOnly: false
                    }).filter(l => l.id !== -1)
                }
            };

            if (type in typeConfig) {
                const { title, msg, set, attribute, factories } = typeConfig[type];
                config.title = title;
                config.msg = msg;
                config.set = set;
                config.attribute = attribute;
                config.factories = factories();
            } else {
                return;
            }

            // 输出结果
            console.log(config);
            let mp = new EADialogViewController({
                dialogOptions: [{ labelEnum: enums.UIDialogOptions.OK }],
                message: fy(config.msg),
                title: fy(config.title),
                type: EADialogView.Type.MESSAGE
            });
            mp.init();
            mp.onExit.observe(mp,(e, z) => {
                e.unobserve(mp);
                events.ignorePlayerPopup();
            });
            gPopupClickShield.setActivePopup(mp);
            _.flatMap(mp.getView().dialogOptions,(v,i) => {
                if(v.__text.innerHTML == "*"){
                    v.setText(fy(`popupButtonsText.${mp.options[i].labelEnum}`))
                }
            })
            mp.getView().__msg.style.padding = "1rem";
            mp.getView().__msg.style.fontSize = "100%";
            mp._fsuToggle = [];
            const playerList = _.countBy(events.getItemBy(2, {}), config.attribute);
            const optionData = _.orderBy(config.factories.map(f => ({
                name: f.label,
                id: f.id,
                count: playerList[f.id] || 0,
                select: _.includes(info.set[config.set],f.id) ? 1 : 0
            })),["select","count"],["desc","desc"]);

            // 输出结果
            console.log(optionData);
            let oBox = events.createElementWithConfig("div",{
                style:{
                    height:"40vh",
                    overflowY:"auto",
                    padding:"1rem",
                    backgroundColor:"#151616",
                    marginTop:"1rem"
                }
            })

            _.forEach(optionData,o => {
                let oToggle = events.createToggle(
                    o.name,
                    async (e) => {
                        if (e.getToggleState()) {
                            if (!_.includes(info.set[config.set], o.id)) {
                                info.set[config.set].push(o.id);
                            }
                        } else {
                            _.pull(info.set[config.set], o.id);
                        }
                        console.log(info.set[config.set])
                        set.save(config.set, info.set[config.set])
                    }
                )
                if(type == 2 && o.id < 2){
                    oToggle.toggle(true);
                    oToggle.setInteractionState(0);
                }else{
                    oToggle.toggle(o.select == 1);
                }
                oToggle.__root.style.paddingLeft = "0";
                oToggle.__root.style.paddingRight = "0";
                oToggle.__root.style.position = "relative";
                let oCount = events.createElementWithConfig("span",{
                    textContent: o.count,
                    style:{
                        position: "absolute",
                        right: "3.6rem",
                        top: ".9rem"
                    }
                })
                oToggle.__root.appendChild(oCount);
                mp._fsuToggle.push(oToggle);
                oBox.appendChild(oToggle.__root);
            })
            mp.getView().__msg.appendChild(oBox);
        }
        //24.16 排除球员配置按钮：弹窗事件
        events.ignorePlayerPopup = () => {
            let mp = new EADialogViewController({
                dialogOptions: [{ labelEnum: 44404 },{ labelEnum: 44407 },{ labelEnum: 44405 },{ labelEnum: 44403 }],
                message: fy(`playerignore.popupm`),
                title: fy(`playerignore.popupt`),
                type: EADialogView.Type.MESSAGE
            });
            mp.init();
            mp.onExit.observe(mp,(e, z) => {
                e.unobserve(mp);
                if(z == 44404){
                    events.ignorePlayerTypePopup(1)
                }else if(z == 44407){
                    events.ignorePlayerTypePopup(2)
                }else if(z == 44405){
                    events.popup(
                        fy("goldenplayer.popupmt"),
                        fy("goldenplayer.popupm"),
                        (t,i) => {
                            if(t === 2){
                                let v = Number(i.getValue());
                                if(!_.isNaN(v) && v > 75 && v < 100){
                                    set.save("goldenrange",v)
                                }else if(v == 0){
                                    set.save("goldenrange",83)
                                }else{
                                    events.notice(fy("notice.seterror"),2)
                                }
                            }
                            events.ignorePlayerPopup()
                        },
                        [
                            { labelEnum: enums.UIDialogOptions.OK },
                            { labelEnum: 44403 }]
                        ,
                        [fy("goldenplayer.placeholder"),info.set.goldenrange],
                        true
                    )
                }
                let view = isPhone() ? cntlr.current().getView() : cntlr.right().getView();
                if(view.className == "UTSBCSquadDetailPanelView"){
                    events.sbcFilterTipsGenerate("_fsuIgnore",view,2,1);
                    events.sbcFilterTipsGenerate("_fsuAutoFill",view,3,1);
                    events.sbcFilterTipsGenerate("_fsuSquadCmpl",view,4,1);
                }
            });
            gPopupClickShield.setActivePopup(mp);
            _.flatMap(mp.getView().dialogOptions,(v,i) => {
                if(v.__text.innerHTML == "*"){
                    v.setText(fy(`popupButtonsText.${mp.options[i].labelEnum}`))
                }
            })
            mp.getView().__msg.style.padding = "1rem";
            mp.getView().__msg.style.fontSize = "100%";
            let buildArray = ["ignorepos","untradeable","league","flag","academy","strictlypcik","comprange","comprare","firststorage"];
            const getText = (b) => {
                const textMap = {
                    league: () => `${fy(`builder.league`)}(${info.set.shield_league.length})`,
                    flag: () => `${fy(`builder.flag`)}(${info.set.shield_flag.length})`,
                    comprange: () => fy([`builder.comprange`, info.set.goldenrange]),
                };

                return textMap[b] ? textMap[b]() : fy(`builder.${b}`);
            };
            _.forEach(buildArray,b => {
                let bText = getText(b);
                let bToggle = events.createToggle(
                    bText,
                    async(e) => {
                        build.set(b,e.getToggleState())
                    }
                )
                bToggle.toggle(info.build[b]);
                bToggle.__root.style.paddingLeft = "0";
                bToggle.__root.style.paddingRight = "0";
                mp.getView().__msg.appendChild(bToggle.__root);
            })
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
                mp.getView().__msg.appendChild(mp._fsuInput.__root);
                if(s){
                    mp.getView().__msg.appendChild(events.createDF(s));
                }
            }
        }
        events.wait = (min,max) => {
            let delay = Math.floor(Math.random() * (max * 1000 - min * 1000 + 1)) + min * 1000;
            return new Promise(resolve => setTimeout(resolve, delay));
        }
        events.changeLoadingText = (t,s) =>{
            //24.18 loading文本插入换行符设置
            let text = fy(t);
            if(s && s !== ""){
                text += `<br>${fy(s)}`;
            }
            document.querySelector('.fsu-loading-close').innerHTML = text;
        }
        //批量挂拍卖
        events.losAuctionSell = async(e,t) => {
            e.setInteractionState(0);
            info.run.losauction = true;
            events.showLoader();
            let a = e._parent._fsuAkbArray,b = e._parent._fsuAkbCurrent,pn = 0,time = t == 0 ? 1 : t;
            events.notice(["loas.start",`${b}`,`${b * 5}`],1);
            for (let n in a) {
                if(!info.run.losauction){
                    break;
                }
                pn++;
                events.changeLoadingText(["loadingclose.loas",`${pn}`,`${b - pn}`]);
                await events.playerToAuction(n,events.getCachePrice(a[n]._pId,1),time);
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
            info.run.losauction = false;
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
            //25.01 修改获取缓存价格模式
            let priceDataKey = "data";
            let priceNum = 0;
            let priceText = "0";
            if(_.has(info.roster[priceDataKey],i)){
                priceNum = info.roster[priceDataKey][i].n;
                priceText = info.roster[priceDataKey][i].t;
            }
            if(t){
                if(t == 1){
                    return priceNum;
                }else if(t == 2){
                    return priceText;
                }else if(t == 3){
                    return _.has(info.roster[priceDataKey],i);
                }
            }else{
                return _.has(info.roster[priceDataKey],i) && priceNum !== 0;
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
        }
        //列表形式(右侧、拍卖行搜索结果、俱乐部)球员列表 读取球员列表查询价格
        UTPaginatedItemListView.prototype.renderItems = function(t) {
            call.plist.paginated.call(this,t);
            this.listRows.map(function (i) {
                if(i.data.type == "player"){
                    //价格高亮显示
                    if(events.getCachePrice(i.data.definitionId)){
                        let np = events.getCachePrice(i.data.definitionId,1);
                        if(np && i.data.getAuctionData().buyNowPrice <= np){
                            i.__auctionBuyValue.style.backgroundColor = "#36b84b"
                        }
                    }
                }
            })

            events.loadPlayerInfo(_.map(this.listRows,"data"));

            let c = cntlr.current(),csbc = false;

            if(isPhone()){
                if(c.hasOwnProperty("_squad") && c._squad && c._squad.isSBC()){
                    csbc = true;
                }
            }else{
                //25.20 球员自动购买 移除右侧球员部分
                if(_.has(c.leftController,"_fsuAutoBuy") && _.has(c,"rightController") && c.rightController){
                    c.removeRightController();
                }

                if(c.hasOwnProperty("rightController") && c.rightController){
                    c = cntlr.right().parentViewController;
                }
                if(c.hasOwnProperty("_squad") && c._squad.isSBC()){
                    csbc = true;
                }
            }
            if(!isPhone() && c.hasOwnProperty("rightController") && c.rightController){
                c = cntlr.right().parentViewController;
            }
            if(csbc){
                if(c.getNavigationTitle() == services.Localization.localize("navbar.label.clubsearch")){
                    let s = [];
                    if(_.has(c,"_fsuFillArray") && c._fsuFillArray.length && c.currentController.searchCriteria.defId.length && this.listRows.length){
                        s = this.listRows.map(i => {
                            if(c.currentController.searchCriteria.defId.includes(i.data.definitionId)){
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
            //25.21 预览包重排序 球员、稀有度、评分
            const showPlayers = _.orderBy(e, [i => i.isPlayer(), "rareflag", "rating"], ["desc", "desc", "desc"]);
            call.plist.storeReveal.call(this, showPlayers, t, i, o);
            events.loadPlayerInfo(e);
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
                if(id > 0 && events.getCachePrice(id)){
                    p.push(id)
                }
            }
            events.squadTotal(this.getFieldPlayers().map(function (i) {if( events.getCachePrice(i._item.definitionId)){return i._item.definitionId}}).filter(i => i > 0));
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


        //25.13 通过FUTBIN获得单一球员价格
        events.getPriceForFubin = async (pid) => {
            try {
                let platform = info.base.platform == "pc" ? "PC" : "PS";
                const response = await events.externalRequest("GET","https://www.futbin.org/futbin/api/25/fetchPriceInformation?playerresource=" + pid + "&platform=" + platform);
                const originalJson = JSON.parse(response);
                const price = originalJson.LCPrice;
                if(price){
                    const priceJson = {
                        "n": price,
                        "t": price == -1 ? "0" : price.toLocaleString()
                    }
                    info.roster.data[pid] = priceJson
                }
            } catch (error) {
                events.notice(fy("notice.loaderror") + error,2);
                events.hideLoader();
                throw error;
            }
        }
        //球员价格读取 需要传递球员ID列表(数组)
        events.loadPlayerInfo = async(items,el) => {
            if(info.set.card_meta){
                const ggrList = _.filter(items, function (i) {
                    return _.has(i,"type") && i.type == "player" && i.rating >= 75 && !_.has(info.ggr,(i.definitionId)) && i.definitionId > 0;
                })
                let ggrChunks = _.chunk(ggrList, 30);
                for (let chunk of ggrChunks) {
                    events.getGGRating(chunk, el);
                }
            }
            const list = _.map(
                _.filter(items, function (i) {
                    return _.has(i,"type") && i.type == "player" && !events.getCachePrice(i.definitionId) && i.definitionId > 0;
                }),"definitionId");
            if(list.length > 0){
                let la = Array.from(new Set(list));
                let pu = [];
                let chunks = _.chunk(la, 23);
                if(info.base.platform !== "pc"){
                    pu = _.cloneDeep(chunks)
                }else{
                    for (let chunk of chunks) {
                        let chunkJson = {
                            "items":[],
                            "platform":info.base.platform
                        }
                        _.map(chunk,c => {
                            chunkJson.items.push({
                                "definitionId": c
                            })
                        })
                        pu.push(chunkJson);
                    }
                }
                for (let k in pu) {
                    let playerPrice;
                    try {
                        playerPrice = await events.getPriceForUrl(pu[k]);
                    }catch(error) {
                        continue;
                    }

                    info.roster.data = Object.assign(info.roster.data,playerPrice);
                    _.map(playerPrice,(v,k) => {
                        let e = document.querySelectorAll(`.fsu-price-box[data-id='${k}']`);
                        if(e.length > 0){
                            for (let i of e) {
                                if(i.classList.contains("fsu-price-val")){
                                    i.setAttribute("data-value",v.t);
                                    i.innerText = v.t;



                                    /** 25.18 珍贵球员提示 **/
                                    let preciousPlayerSquadController = isPhone() ? cntlr.current() : cntlr.left();
                                    if(preciousPlayerSquadController?.className == "UTSBCSquadOverviewViewController"){
                                        let player = events.getItemBy(2,{"definitionId":Number(k)})
                                        if(player.length && !player[0].isSpecial() & _.gte(v.n, 2 * info.base.price[player[0].rating])){
                                            i.style.backgroundColor = "#9f1d00";
                                            preciousPlayerSquadController._fsuValuable = _.union(_.isArray(preciousPlayerSquadController._fsuValuable) ? preciousPlayerSquadController._fsuValuable : [], [Number(k)]);
                                        }
                                    }


                                }else{
                                    i.querySelector(".fsu-price-val").setAttribute("data-value",v.t);
                                    i.querySelector(".fsu-price-val .value").innerText = v.t;
                                }
                                let lastPriceName = isPhone() ? '[data-last]' : '.fsu-price-last';
                                if(i.querySelectorAll(lastPriceName).length > 0){
                                    i.querySelector(".fsu-price-val .title span").outerHTML = events.priceLastDiff(v.n,isPhone() ? i.querySelector(lastPriceName).getAttribute("data-last").replace(/,/g, '') : i.querySelector(lastPriceName).innerText.replace(/,/g, ''));
                                }
                            }
                        }
                    })
                }
                if(document.getElementById("squadTotal")){
                    events.squadTotal(cntlr.current()._squad.getFieldPlayers().map(function (i) {return i._item.definitionId}).filter(i => i > 0));
                }
            }
            if(el){
                //24.15 球员挑选最佳提示：拍卖后重触发挑选事件
                if(el.className == "UTPlayerPicksView" && info.set.player_pickbest){
                    events.playerSelectionSort(el);
                }else if(el.className.includes('UTUnassigned') && el.className.includes('Controller') && "_fsuScreenshot" in el){
                    let sPrice = 0;
                    _.map(list,i => {sPrice += events.getCachePrice(i,1);})
                    el._fsuScreenshot._header.setText(fy(["screenshot.text",list.length,sPrice.toLocaleString()]))
                }else if(el.className == "UTPackOddsViewController" && "_packoddo" in el){
                    let sPrice = 0;
                    _.map(list,i => {sPrice += events.getCachePrice(i,1);})
                    el.getView().getRootElement().querySelector(".trypack-count").innerText = sPrice.toLocaleString();
                    let sDiff = Math.round((sPrice/el._packoddo-1)*100);
                    let diffElement = el.getView().getRootElement().querySelector(".trypack-diff");
                    if(sDiff > 0){
                        diffElement.style.color = "#36b84b"
                        diffElement.textContent = `+${sDiff}%`
                    }else{
                        diffElement.style.color = "#d21433"
                        diffElement.textContent = `${sDiff}%`
                    }

                }else{
                    events.losAuctionCount(el,0)
                }
            }
        }

        //** 25.21 读取GGRating **/
        events.getGGRating = async(list,el) => {
            const now = Math.floor(Date.now() / 1000); // 当前时间（单位：秒）
            const filtered = _.map(list,"definitionId");
            if(filtered.length){
                const response = await events.externalRequest("GET","https://www.fut.gg/api/fut/metarank/players/?ids=" + filtered.join("%2C"));
                const originalJson = JSON.parse(response);
                _.forEach(originalJson.data, (v,k) => {
                    info.ggr[v.eaId] = {
                        "score": v.score,
                        "position": v.position,
                        "time": now
                    }

                    for (let i of list) {
                        let ggrGrade = document.querySelector(`.fsu-cards-metarating[data-id="${i.id}"][data-defid="${i.definitionId}"]`);
                        let ggrBox = document.querySelector(`.fsu-cards-meta[data-id="${i.id}"][data-defid="${i.definitionId}"]`);
                        if(ggrGrade || ggrBox){
                            const ggr = events.getPlayerGGR(i);
                            if(ggr.score){
                                if(ggrGrade){
                                    ggrGrade.innerText = ggr.grade;
                                    ggrGrade.style.display = "block";
                                }
                                if(ggrBox){
                                    const ggrBoxMrk = ggrBox.querySelector(".mrk")
                                    ggrBoxMrk.innerText = ggr.grade;
                                    if(info.set.card_style !== 1){
                                        ggrBoxMrk.style.backgroundColor = ggr.gradeColor;
                                    }
                                    ggrBox.querySelector(".mpr").innerText = ggr.scoreText;
                                    ggrBox.querySelector(".mrp").innerText = ggr.posText;
                                    ggrBox.style.display = "";
                                }
                            }
                        }
                    }
                    
                })
                GM_setValue("ggr", JSON.stringify(info.ggr));

                console.log(el)
            }else{
                console.log("无需要读取的GGRating")
            }
        }
        //** 25.21 读取GGRating **/
        events.getPlayerGGR = (player) => {
            const result = {
                "score": 0,
                "scoreText": "0",
                "grade": "F",
                "pos": 0,
                "posText": "NONE",
                "gradeColor": "rgba(255,255,255,0.8)"
            }
            if(_.has(info.ggr,player.definitionId)){
                const grades = ["S", "A", "B", "C", "D"];
                const gradeColors = [
                    "rgba(255,215,0,0.9)",     // S - 金色
                    "rgba(220,38,38,0.8)",     // A - 红
                    "rgba(251,146,60,0.8)",    // B - 橙
                    "rgba(6,182,212,0.8)",     // C - 青
                    "rgba(34,197,94,0.8)",     // D - 绿
                ];
                result.pos = info.ggr[player.definitionId].position;
                result.posText = services.Localization.localize(`extendedPlayerInfo.positions.position${result.pos}`);
                const isNoAcademy = player.academy == null || (!player.academy._attributes.length && !player.academy._baseTraits.length && !player.academy._iconTraits.length && !player.academy._skillMoves && !player.academy._weakFoot);
                result.score = info.ggr[player.definitionId].score;
                result.scoreText = result.score.toFixed(1);
                if(!isNoAcademy){
                    const ratingMaxScore = info.GGRRAR.rating[result.pos][player.rating];
                    if(player.rating == player._rating){
                        result.score = ratingMaxScore;
                    }else{
                        result.score = ratingMaxScore - (player.rating - player._rating) * 0.02;
                    }
                    result.scoreText = `${result.score.toFixed(1)}*`;
                }
                const customSortedIndex = _.findIndex(info.GGRRAR.rank[result.pos], (value) => value <= result.score);
                if(customSortedIndex !== -1){
                    result.grade = grades[customSortedIndex];
                    result.gradeColor = gradeColors[customSortedIndex];
                }
            }
            return result;
        }

        //阵容页面显示 添加阵容价值部分
        UTBaseSquadSplitViewController.prototype.viewDidAppear = function(){
            call.view.squad.call(this);

            if(info.set.info_squad){
                let p = this._squad.getPlayers().map(function (i) {if(i._item.type == "player" && ! events.getCachePrice(i._item.definitionId)){return i._item.definitionId}}).filter(i => i > 0);


                this.leftController.getView().getSummaryPanel().getRootElement().querySelector(`.ut-squad-summary-info${this.className == "UTSBCSquadSplitViewController" ? "--right" : ""}`).after(events.createDF(`<div class="fsu-squad-pBox"><div class="fsu-squad-pWrap"><span class="fsu-squad-pTitle">${fy("sbc.topsquad")}</span><span id="squadTotal" class="fsu-squad-pValue currency-coins">0</span></div></div>`))

                if(!p.length){
                    events.squadTotal(this._squad.getFieldPlayers().map(function (i) {if(events.getCachePrice(i._item.definitionId)){return i._item.definitionId}}).filter(i => i > 0));
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
                        this.leftController.getView().getRootElement().querySelector(".fsu-squad-pBox .fsu-squad-pWrap").after(events.createDF(`<div class="fsu-squad-pWrap"><span class="fsu-squad-pTitle">${fy("sbc.topprice")}</span><span id="sbcPrice" class="fsu-squad-pValue currency-coins">${Number(info.base.platform == "pc" ? si.pc : si.tv).toLocaleString()}</span></div>`))
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
            objSetTitle:UTObjectivesHubTileView.prototype.setSubtitle,
            sbcSetDate:UTSBCSetTileView.prototype.setData,
            subTableRender:UTSBCChallengeTableRowView.prototype.render,
            rewardList:UTSBCGroupRewardListView.prototype.setRewards,
            seasonSet:FCObjectiveSeasonView.prototype.setCampaign
        }



        //点击子任务后给包添加价格
        //24.20 修改为预估价格
        UTSBCGroupRewardListView.prototype.setRewards = function(e, o) {
            call.task.rewardList.call(this,e,o)
            _.map(e,(item,index) =>{
                if(item.isPack || (item.isItem && item.item && item.item.isPlayerPickItem())){
                    let packCoinValue = events.getOddo(item.value);
                    if(packCoinValue){
                        let packBox = events.createElementWithConfig("div", {
                            textContent:`${fy("returns.text")}${(packCoinValue * item.count).toLocaleString()}`,
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
                selectSlot = _.find(currentSquad.getNonBrickSlots())?.index,
                pendingPlayers,
                querySort = 3,
                needFind = true;


            if(e.getRootElement().tagName == "BUTTON" && e.getRootElement().classList.length < 3){
                needFind = false;
            }

            switch(queryType){
                case "d":
                    pendingPlayers = repositories.Item.getUnassignedItems().map( i => { if(i.isDuplicate() && !i.isLimitedUse() && i.isPlayer()){return i.definitionId}});
                    break;
                case "t":
                    let transferItems = _.filter(repositories.Item.getTransferItems(), (item) => {
                        let auctionData = item.getAuctionData();
                        return auctionData.isInactive() || auctionData.isExpired();
                    });
                    pendingPlayers = events.getItemBy(2,{definitionId:_.uniq(transferItems.map(item => item.definitionId))});
                    break;
                case "s":
                    if(e.__root.getAttribute('data-order') == "desc"){
                        querySort = 2;
                    }
                    pendingPlayers = events.getItemBy(2,{},false,repositories.Item.getStorageItems());
                    break;
                case "RS":
                    pendingPlayers = events.getItemBy(2,{"rs":Number(e.__root.getAttribute('data-v'))});
                    break;
                case "conceptsearch":
                    querySort = 2;
                    break;
                case "eligibilitysearch":
                    pendingPlayers = events.getItemBy(2,e.criteria)
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


            let detailsController = phone ? cntlr.current().rootController : cntlr.right();
            if(queryType == "d"){
                if(detailsController.panelView._fsuUn._interactionState){
                    await detailsController.panelView._fsuUn._tapDetected();
                }else{
                    events.notice("notice.noduplicate",2);
                }
            }else{
                events.sbcQuerySetFillAttr(detailsController.parentViewController,queryType == "conceptsearch" ? 9 : 5,resultPlayers,querySort)
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
            element._fsuFillRange =  players.length ? [_.minBy(players, 'rating').rating,_.maxBy(players, 'rating').rating] :  [_.minBy(events.getItemBy(2,{}), 'rating').rating,_.maxBy(events.getItemBy(2,{}), 'rating').rating];
            element._fsuFillFirst = true;
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
        
        //25.20 快速任务TAB添加
        UTSBCSetsViewModel.prototype.getCategories = function() {
            let original = this.categoriesIterator.values();
            if(!_.some(original, { id: 996 }) && _.size(info.base.fastsbc)){
                let fastNav = new UTSBCCategoryDTO(996,996,fy("fastsbc.tab.text"),SBCCategoryType.SERVER);
                _.forEach(info.base.fastsbc,(i,k) => {
                    fastNav.setIds.push(Number(k.split('#')[1]));
                })
                fastNav.displayable = true;
                this.categoriesIterator.add(fastNav,2);
                original = this.categoriesIterator.values();
            }
            return original;
        }
        //SBC填充导航题头 加载导航额外信息
        UTSBCHubView.prototype.populateNavigation = function(e, t) {
            call.task.sbcN.call(this, e, t);
            setTimeout(() => {
                if(info.set.info_sbc){
                    _.map(e,(i,k) => {
                        let news = _.intersection(info.task.sbc.stat.new, i.setIds);
                        let expirys = _.intersection(info.task.sbc.stat.expiry, i.setIds);
                        if(news.length || expirys.length){
                            let tap = this._SBCCategoriesTM.items[k];
                            if(news.length){
                                tap.__root.append(
                                    events.createElementWithConfig("div",{
                                        textContent:`+ ${news.length}`,
                                        classList:["fsu-task-bar"]
                                    })
                                );
                            }
                            if(expirys.length){
                                tap.__root.append(
                                    events.createElementWithConfig("div",{
                                        textContent:`- ${expirys.length}`,
                                        classList:["fsu-task-bar","expiry"]
                                    })
                                );
                            }
                        }
                    })
                }
            },10);
        }

        //SBC填充任务列表 每次切换类型都重新填充 加载任务额外信息
        UTSBCHubView.prototype.populateTiles = function(e, t) {
            //25.21 SBC排序优化
            //console.log(e,t)
            const newList = _.orderBy(e, [
                item => item.isComplete(),
                item => _.includes(info.task.sbc.stat.new,item.id) || (!_.has(info.task.sbc.stat,item.id) && item.id !== 1),
                item => (info?.task?.sbc?.stat?.[item.id]?.u ?? -Infinity)
            ], ["asc", "desc", "desc"]);
            call.task.sbcT.call(this, newList, t);
            if(info.set.info_sbc){
                let l = this.sbcSetTiles;
                for (let i of l) {
                    events.sbcInfoFill(i.data.id,i);
                }
                if(!(t)){
                    events.notice("notice.basesbc",0);
                }
            }
            let playerArray = _.map(
                _.filter(this.sbcSetTiles, set =>
                  set.data.awards.length && set.data.awards[0].isItem
                ),
                set => set.data.awards[0].item
            );
            if(playerArray.length){
                events.loadPlayerInfo(playerArray);
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
            let t = cntlr.current().getView().sbcSetTiles,g = e.getIndex();
            for (let i of t) {
                let y = true,d = i.data.id;
                if(info.task.sbc.stat.hasOwnProperty(d)){
                    let s = info.task.sbc.stat[d];
                    if(g == 1 && !(_.includes(info.task.sbc.stat.new,d))) y = false;
                    if(g == 2 && !(_.includes(info.task.sbc.stat.expiry,d))) y = false;
                    if(g == 3){
                        let n = parseFloat(s.u);
                        if(!isNaN(n)){
                            if(n < 65) y = false;
                        }else{
                            y = false
                        }
                    }
                }else{
                    y = g == 0;
                }
                y ? i.show() : i.hide();
            }
        }
        //SBC子任务列表展示 填充额外信息和读取价格
        UTSBCChallengesViewController.prototype.viewDidAppear = function() {
            call.task.sbcC.call(this);
            if(info.set.info_sbcs){
                events.sbcSubPrice(this.sbset.id,this.getView());

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

                /** 25.18 添加需求数量计算按钮 */
                let needRatings = _.map(this.sbset.challenges.values(),i => {
                    let rating = 0;
                    if(!i.isCompleted()){
                        _.forEach(i.eligibilityRequirements,e => {
                            if(e.getFirstKey() == SBCEligibilityKey.TEAM_RATING){
                                rating = e.getFirstValue(e.getFirstKey())
                            }
                        })
                    }
                    return rating;
                })
                needRatings = _(needRatings).filter((value) => value !== 0).reverse().value();

                if(needRatings.length > 2){
                    let needBtn = events.createButton(
                        new UTStandardButtonControl(),
                        fy("sbcneedslist.btn"),
                        (e) => {
                            events.showLoader();
                            events.sbcListNeedCount(needRatings,services.SBC.repository.sets.get(this.sbset.id).name);
                        },
                        "mini"
                    )
                    needBtn.getRootElement().style.position = "absolute";
                    needBtn.getRootElement().style.right = "10px";
                    this.getView()._header.getRootElement().appendChild(needBtn.getRootElement())
                }
            }
        }

        //打开futbin球员链接，需要元素携带data-id（球员id）和data-name（球员全称）
        events.openFutbinPlayerUrl = async(e) => {
            events.showLoader();
            let di = e.__root.getAttribute('data-id');
            let n = e.__root.getAttribute('data-name').normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/ø/g, "o");
            let playerUrl;
            try {
                playerUrl = await events.getFutbinUrl(`https://www.futbin.org/futbin/api/searchPlayersByName?playername=${n}&year=${info.base.year}`);
            }catch(error) {
                return;
            }
            let fi = "";
            for (let i of playerUrl.data) {
                if(i.resource_id == di){
                    fi = i.ID;
                    break;
                }
            }
            events.hideLoader();
            GM_openInTab(`https://www.futbin.com/${info.base.year}/player/${fi}/1`, { active: true, insert: true, setParent :true });
        };
        //SBC信息填充，需要传递sbcid和需填充的元素
        events.sbcInfoFill = (d,e) => {
            if(!info.task.sbc.stat.hasOwnProperty(d)) return;
            let s = info.task.sbc.stat[d];
            if(_.has()){

            }
            if(s !== undefined){
                if(e.hasOwnProperty("__tileTitle") && _.includes(info.task.sbc.stat.new,d)){
                    e.getRootElement().style.position = 'relative';
                    e.getRootElement().insertBefore(events.createDF(`<div class='fsu-objnew'>${fy("task.new")}</div>`), e.getRootElement().firstChild);
                }
                if(!e.__root.querySelector(".task-expire") && "data" in e && !e.data.isComplete()){
                    let expireTime = e.data.endTime - Math.round(new Date() / 1000);
                    if(expireTime < 86400 && !e.data.notExpirable){
                        if(!(_.has(info.task.sbc.stat,"expiry"))){
                            info.task.sbc.stat.expiry = [];
                        }
                        if(!(_.includes(info.task.sbc.stat.expiry,d))){
                            info.task.sbc.stat.expiry.push(d)
                        }
                        e.__root.prepend(events.createDF("<div class='task-expire'>" + fy("task.expire") + "</div>"));
                    }
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
                e.getRootElement().querySelector("div.challenge").appendChild(countBox)
            }
            if(!e.data.isComplete()){
                let fastInfo = _.pickBy(info.base.fastsbc, (value, key) => _.includes(key + "#",`#${e.data.id}#`));
                if(_.size(fastInfo)){
                    if(e.data.challengesCount == 1){
                        let fastCount = events.fastSBCQuantity(true,_.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.duplicateId !== 0),_.values(fastInfo)[0]);
                        let fastIds = _.map(_.split(_.keys(fastInfo)[0], '#'),s => parseInt(s));
                        let fastSid = fastIds[1];
                        let fastCid = fastIds[0];
                        fastCount--;

                        e._fsufastsbcbtn = events.createButton(
                            new UTCurrencyButtonControl(),
                            fy(["fastsbc.sbcbtntext",fastCount]),
                            () => {
                                if (info.base.fastsbctips) {
                                    events.isSBCCache(fastSid, fastCid)
                                } else {
                                    events.popup(
                                        fy("fastsbc.popupt"),
                                        fy("fastsbc.popupm"),
                                        (t) => {
                                            if (t === 2) {
                                                info.base.fastsbctips = true;
                                                events.isSBCCache(fastSid, fastCid)
                                            }
                                        }
                                    )
                                }
                            },
                            "call-to-action mini fsu-challengefastbtn"
                        )


                        e._fsufastsbcbtn.__currencyLabel.innerHTML = events.getFastSbcSubText(info.base.fastsbc[`${fastCid}#${fastSid}`])

                        if(fastCount == 0){
                            e._fsufastsbcbtn.setInteractionState(0);
                        }
                    }else{
                        e._fsufastsbcbtn = events.createButton(
                            new UTCurrencyButtonControl(),
                            fy(`fastsbc.entertips`),
                            () => {
                                e._tapDetected();
                            },
                            "call-to-action mini fsu-challengefastbtn"
                        )
                    }
                    e._fsufastsbcbtn.getRootElement().style.width = "100%";

                    e.getRootElement().querySelector(".challenge").appendChild(e._fsufastsbcbtn.getRootElement())

                }
            }
            if(e._interactionState && !e.__root.querySelector(".fsu-sbc-info")){
                let p = s[info.base.platform];
                e.__root.lastChild.before(events.createDF(fy(html.sbcInfo).replace("{price}",Number(p).toLocaleString()).replace("{up}",`${s.u}%`).replace("{down}",`${s.d}%`)))
            }
            if("data" in e && e.data.awards && e.data.awards.length == 1){
                if(e.data.awards[0].isPack){
                    let reward = e.data.awards[0];
                    let packCoinValue = events.getOddo(reward.value);
                    if(packCoinValue){
                        let packBox = events.createElementWithConfig("div", {
                            style:{
                                position:"absolute",
                                bottom:"0",
                                backgroundColor:"rgb(0 0 0 / 60%)",
                                width:"100%",
                                textAlign:"center",
                                padding:".2rem 0",
                            }
                        });
                        let packTitle = events.createElementWithConfig("div", {
                            textContent:_.replace(_.replace(fy("returns.text"),":",""),"：","")
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
        events.getOddo = (t) => {
            if(_.has(info.base.oddo,t)){
                return info.base.oddo[t];
            }else{
                return 0;
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
                    let subPrice;
                    try {
                        subPrice = await events.getFutbinUrl(`https://www.futbin.org/futbin/api/getChallengesBySetId?set_id=${id}`);
                    }catch(error) {
                        return;
                    }
                    if("data" in subPrice){
                        info.task.sbc.stat[id].c = {};
                        for (let i of subPrice.data) {
                            let j = {"tv":i.price.ps,"pc":i.price.pc};
                            info.task.sbc.stat[id].c[i.challengeId] = j;
                        }
                    }
                }
                if(info.task.sbc.stat[id].hasOwnProperty("c")){
                    let sumValue = 0,sumCoin = 0;
                    for (let i of e._challengeRows) {
                        if("_fsuSubSet" in i){
                            let sId = i._fsuSubSet.id,
                            box = events.createElementWithConfig("div",{
                                style:{
                                    display:"flex",
                                    flexDirection:"row"
                                }
                            }),
                            priceValue = Number(info.base.platform == "pc" ? info.task.sbc.stat[id].c[sId].pc : info.task.sbc.stat[id].c[sId].tv),
                            price = events.createElementWithConfig("span",{
                                textContent:`${fy("sbc.price")}${priceValue.toLocaleString()}`,
                                classList:['currency-coins']
                            });
                            sumValue += priceValue;
                            box.appendChild(price);

                            let sAwards = i._fsuSubSet.awards,
                                packCoin = 0;
                            _.forOwn(sAwards,item => {
                                if(item.isPack || (item.isItem && item.item && item.item.isPlayerPickItem())){
                                    let packCoinValue = events.getOddo(item.value);
                                    if(packCoinValue){
                                        packCoin += packCoinValue * item.count;
                                        sumCoin += packCoin;
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

                    let targetElement = e._setInfo.getRootElement().querySelector(".sbc-status-container");
                    if(targetElement.querySelector(".fsu-sub-price") == null){
                        _.forOwn(services.SBC.repository.getSetById(id).awards,r => {
                            if(r.isPack || (r.isItem && r.item && r.item.isPlayerPickItem())){
                                let packCoinValue = events.getOddo(r.value);
                                if(packCoinValue){
                                    sumCoin += packCoinValue;
                                }
                            }
                        })
                        let sumBox = events.createElementWithConfig("div",{
                            classList:["fsu-sub-price"],
                            style:{
                                display:"flex",
                                flexDirection:"row",
                                lineHeight:"2em",
                                width:"100%",
                            }
                        })
                        let sumValueBox = events.createElementWithConfig("span",{
                            textContent:`${fy("sbc.price")}${sumValue.toLocaleString()}`,
                            classList:['currency-coins']
                        })
                        sumBox.appendChild(sumValueBox);
                        let sumCoinBox = events.createElementWithConfig("span",{
                            textContent:`${fy("subsbcaward.title")}${sumCoin ? sumCoin.toLocaleString() : fy("subsbcaward.nope")}`,
                            classList:[`${sumCoin ? 'currency-coins' : 'no'}`],
                            style:{
                                marginLeft:".5rem",
                            }
                        })
                        sumBox.appendChild(sumCoinBox);
                        if(targetElement){
                            targetElement.appendChild(sumBox);
                        }

                        console.log(sumValue,sumCoin)
                    }
                }
            }
            _.forOwn(e._challengeRows,c => {
                if(_.has(c,`_fsuSubSet`)){
                    let sName = `${c._fsuSubSet.id}#${c._fsuSubSet.setId}`
                    if(_.has(info.base.fastsbc,sName)){
                        let fastInfo = info.base.fastsbc[sName];
                        let fastCount = events.fastSBCQuantity(true,_.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.duplicateId !== 0),fastInfo);
                        e._fsufastsbcbtn = events.createButton(
                            new UTCurrencyButtonControl(),
                            fy(["fastsbc.sbcbtntext",fastCount]),
                            () => {
                                if (info.base.fastsbctips) {
                                    events.isSBCCache(c._fsuSubSet.setId, c._fsuSubSet.id)
                                } else {
                                    events.popup(
                                        fy("fastsbc.popupt"),
                                        fy("fastsbc.popupm"),
                                        (t) => {
                                            if (t === 2) {
                                                info.base.fastsbctips = true;
                                                events.isSBCCache(c._fsuSubSet.setId, c._fsuSubSet.id)
                                            }
                                        }
                                    )
                                }
                            },
                            "call-to-action mini fsu-challengefastbtn"
                        )

                        e._fsufastsbcbtn.__currencyLabel.innerHTML = events.getFastSbcSubText(info.base.fastsbc[sName]);
                        if(c._fsuSubSet.isCompleted()){
                            e._fsufastsbcbtn.setInteractionState(0);
                        }
                        c.__rowContent.appendChild(e._fsufastsbcbtn.getRootElement())
                    }
                }
            })
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
            reward:UTRewardSelectionChoiceView.prototype.expandRewardSet,
            bioRender:UTPlayerBioView.prototype.render,

        }

        //24.18 可进化标识：球员预览属性标注
        //25.01 角色分页插入评分
        UTPlayerBioView.prototype.render = function(t, e, i, r){
            call.panel.bioRender.call(this,t,e,i,r)
            if(_.some(cntlr.current().getNavigationController()._childViewControllers, { className: 'UTAcademySlotItemDetailsViewController' })){
                this.fsuAcademy = true;
            }
            if("fsuAcademy" in this && this.fsuAcademy){
                if(e.getMetaData().id !== e.definitionId){
                    let newMeta = repositories.PlayerMeta.get(e.definitionId);
                    if(newMeta){
                        e.setMetaData(newMeta)
                    }else{
                        console.log("尝试载入Meta失败")
                    }
                }
                if(!("fsuAcademyChange" in this)){
                    this.fsuAcademyChange = {};
                    const nowPlayer = _.first(events.getItemBy(2,{"id":e.id}));
                    let infoChange = [],CA = e.academy,attrChange = [],styleChange = [];
                    if(e.rareflag !== nowPlayer.rareflag){
                        infoChange.push({type:0,index:0,value:0,count:true});
                    }
                    const posDiff = e.possiblePositions.length - nowPlayer.possiblePositions.length;
                    if(posDiff){
                        infoChange.push({type:1,index:6,value:posDiff,count:true});
                    }
                    let posAdd = e.possiblePositions.length > 1 ? 1 : 0;
                    const weakFootDiff = e.getWeakFoot() - nowPlayer.getWeakFoot();
                    if(weakFootDiff){
                        infoChange.push({type:1,index:7 + posAdd,value:weakFootDiff,count:true});
                    }
                    const skillMovesDiff = e.getSkillMoves() - nowPlayer.getSkillMoves();
                    if(skillMovesDiff){
                        infoChange.push({type:1,index:8 + posAdd,value:skillMovesDiff,count:true});
                    }
                    if(infoChange.length){
                        this.fsuAcademyChange[0] = infoChange;
                    }
                    const ratingDiff = e.rating - nowPlayer.rating;
                    if(ratingDiff){
                        attrChange.push({type:1,index:0,value:ratingDiff,count:true});
                    }
                    let attrCount = 0,
                        cardAttr = this.__pinnedDiv.querySelectorAll(".player-stats-data-component .value");
                    _.map(e.getAttributes(), (value, index) => {
                        attrCount++;
                        const attribute = value - nowPlayer.getAttribute(index);
                        if(attribute){
                            attrChange.push({type:1,index:attrCount,value:attribute,count:true});
                            if(cardAttr.length == 6){
                                cardAttr[index].style.color = "#00A7CC";
                            }
                        }
                        _.map(e.getSubAttributesByParent(index),sValue => {
                            attrCount++;
                            const subAttributeDiff = e.getSubAttribute(sValue).value() - nowPlayer.getSubAttribute(sValue).value();
                            if(subAttributeDiff){
                                attrChange.push({type:1,index:attrCount,value:subAttributeDiff,count:false});
                            }
                        })
                    });
                    if(attrChange.length){
                        this.fsuAcademyChange[1] = attrChange;
                    }


                    let styleCount = 0;
                    _.map(_.groupBy(e.getPlayStyles(), 'category'),value => {
                        _.map(value,sValue => {
                            const nowStyle = _.find(nowPlayer.getPlayStyles(), { traitId: sValue.traitId });
                            let styleAddType = 0;
                            if(nowStyle){
                                if(sValue.isIcon && !nowStyle.isIcon){
                                    styleAddType = 2;
                                }
                            }else{
                                styleAddType = 3;
                            }
                            if(styleAddType){
                                styleChange.push({type:styleAddType,index:styleCount,value:0,count:true})
                            }
                            styleCount++;
                        })
                    })
                    if(styleChange.length){
                        this.fsuAcademyChange[3] = styleChange;
                    }

                    //插入数字显示
                    _.map(this._navigation.items,i => {
                        if(_.has(this.fsuAcademyChange, i.id)){
                            let count = _.size(_.filter(this.fsuAcademyChange[i.id], { 'count': true }))
                            if(count){
                                i.addNotificationBubble(count)
                                i.notifBubble.__root.style.backgroundColor = "#007D99";
                            }
                        }
                    })

                    //插入价格显示
                    if(_.isObject(this.fsuAcademy)){
                        let coins = this.fsuAcademy.getPrice(GameCurrency.COINS),points = this.fsuAcademy.getPrice(GameCurrency.POINTS);
                        let priceBox = events.createElementWithConfig("div", {
                            classList:["ut-academy-slot-tile-view--prices"],
                        });
                        let titleBox = events.createElementWithConfig("div", {
                            textContent:services.Localization.localize("undoDiscard.row.priceLabel"),
                            style:{
                                paddingRight:".5rem",
                                fontSize:".8rem",
                            }
                        });
                        priceBox.appendChild(titleBox);
                        if(coins){
                            let coinsBox = events.createElementWithConfig("span", {
                                classList:["ut-academy-slot-tile-view--prices-coins"],
                                textContent:services.Localization.localizeNumber(coins)
                            });
                            priceBox.appendChild(coinsBox);
                        }
                        if(points){
                            let pointsBox = events.createElementWithConfig("span", {
                                classList:["ut-academy-slot-tile-view--prices-points"],
                                textContent:services.Localization.localizeNumber(points)
                            });
                            priceBox.appendChild(pointsBox);
                        }
                        if(!coins && !points){
                            let freeBox = events.createElementWithConfig("span", {
                                textContent:fy("academy.freetips")
                            });
                            priceBox.appendChild(freeBox);
                        }
                        this.__pinnedDiv.querySelector(".entityContainer").style.width = "100%";
                        this.__pinnedDiv.querySelector(".entityContainer").appendChild(priceBox);
                    }

                    if(_.isObject(this.fsuAcademy)){
                        this.fsuAcademy.status === AcademySlotState.NOT_STARTED && (this.fsuAcademy.player = new UTNullItemEntity,
                        this.fsuAcademy.levels.forEach(function(e) {
                            return e.boostedPlayer = null
                        }))
                    }
                }
                if(_.has(this,"fsuAcademyChange") && _.has(this.fsuAcademyChange,t)){
                    let changeAttr = this.fsuAcademyChange[t],
                        textType = ["change","add","upgrade","new"],
                        queryType = {"0":"h1","1":".title","3":"span"},
                        attrElement = this.__dataDisplay.querySelectorAll("li");

                    _.map(changeAttr,a => {
                        if(_.has(attrElement,a.index)){
                            let targetElement = attrElement[a.index].querySelector(queryType[t]);
                            let changeElement = events.createElementWithConfig("span", {
                                textContent:fy(a.type == 1 ? [`academy.bio.${textType[a.type]}`,a.value] : `academy.bio.${textType[a.type]}`),
                                style:{
                                    paddingLeft:".2rem",
                                    fontSize:"80%",
                                    color:"#00d1ff"
                                }
                            })
                            targetElement.appendChild(changeElement)
                        }
                    })
                }
            }else{
                if(t == PlayerBioDisplayGroup.ROLES && _.has(info.meta,e.definitionId)){
                    let playerMetaAll = events.getPlayerMetaToText(e);
                    if(_.size(playerMetaAll) > 1){
                        let roleIds = [];
                        let rolePos = [];
                        let tRoles = r;
                        _.map(e.possiblePositions,i => {
                            let pp = [], p = [] , b = [];
                            _.map(UTPlayerRoleVO.getRolesForPositionId(i),t => {
                                if(_.includes(r,t)){
                                    _.find(e.getPlusRoles(),pr => {return pr.type === t && pr.position == i}) ? p.push(t) : _.find(e.getPlusPlusRoles(),pr => {return pr.type === t && pr.position == i}) ? pp.push(t) : b.push(t);
                                    rolePos.push(i)
                                }
                            })
                            roleIds = _.concat(roleIds,_.concat(pp,p,b))
                        })
                        let targetElement = this.__dataDisplay.querySelectorAll(".ut-player-bio-role-cell-view");
                        if(targetElement.length == roleIds.length){
                            _.forEach(targetElement,(el,i) => {
                                if(!_.has(playerMetaAll,roleIds[i])){
                                    return;
                                }
                                let playerMeta = playerMetaAll[roleIds[i]];
                                let playerPos = rolePos[i];
                                let playerFullName = e._staticData.getFullName();
                                let esName = _.join(_.words(playerFullName).map(part => _.lowerCase(part.charAt(0)) + part.slice(1)), '-');
                                let rankColor = "#0f1010";
                                let rBtn = events.createButton(
                                    new UTButtonControl(),
                                    "",
                                    async(q) => {
                                        events.popup(
                                            fy("plyers.relo.popupt"),
                                            events.getPlayerMetaPopupText(playerMeta,playerPos),
                                            (t) => {
                                                if(t == 44406){
                                                    GM_openInTab(`https://www.easysbc.io/players/${esName}/${e.definitionId}?player-role=${playerMeta.eioName}`, { active: true, insert: true, setParent :true });
                                                }
                                            },
                                            [
                                                { labelEnum: 44406 },
                                                { labelEnum: enums.UIDialogOptions.CANCEL }
                                            ]
                                        )
                                    },
                                    ""
                                )
                                rBtn.getRootElement().classList.add("item");
                                rBtn.getRootElement().classList.add("fsu-cards");
                                rBtn.getRootElement().classList.add("fsu-cards-meta");
                                el.style.width = "100%";
                                el.style.position = "relative";
                                rBtn.getRootElement().style.position = "absolute";
                                rBtn.getRootElement().style.right = "0";
                                rBtn.getRootElement().style.left = "auto";
                                rBtn.getRootElement().style.setProperty('transform', 'translateX(0)', 'important');
                                rBtn.getRootElement().style.setProperty('-webkit-transform', 'translateX(0)', 'important');
                                rBtn.getRootElement().style.setProperty('width', '4rem', 'important');
                                let mRk = events.createElementWithConfig("div", {
                                    textContent:playerMeta.rank,
                                    style:{
                                        color:rankColor,
                                        backgroundColor:playerMeta.rankBg,
                                    }
                                })
                                rBtn.getRootElement().appendChild(mRk)
                                let mRt = events.createElementWithConfig("div", {
                                    textContent:playerMeta.rating,
                                    style:{
                                        flex:"auto",
                                    }
                                })
                                rBtn.getRootElement().appendChild(mRt)
                                let mCs = events.createElementWithConfig("div", {
                                    classList:["playStyle",`chemstyle${playerMeta.chemstyle}`],
                                    style:{
                                        fontSize:".9rem",
                                        marginTop:"-1px",
                                    }
                                })
                                rBtn.getRootElement().appendChild(mCs)
                                el.appendChild(rBtn.getRootElement())
                            })
                        }
                    }
                }
            }
        }
        UTMarketSearchFiltersView.prototype.setPinnedItem = function(e, t) {
            call.panel.market.call(this,e,t)
            let sbc = isPhone() ? cntlr.current().squadContext.squad.isSBC() : cntlr.current()._squad.isSBC();
            if(e.definitionId && sbc && info.set.sbc_market && e.concept){
                let p = events.getCachePrice(e.definitionId,1),v = this._maxBuyNowPriceRow._currencyInput._currencyInput,f = this._searchFilters.filters;
                if(f[1].setId == "rarity" && f[1].getValue() == -1){
                    f[1].setIndexByValue(e.rareflag);
                }
                if(f[2].setId == "position" && f[2].getIndex() !== 0){
                    f[2].setIndex(0)
                }
                setTimeout(() => {
                    if(v.getValue() == 0){
                        if(p !== 0){
                            v.setValue(p);
                            console.log(v)
                            if(!isPhone()){
                                events.notice("notice.marketsetmax",1);
                            }
                        }
                    }
                },50);
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
            let a = w.panelView || w.panel;
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
            if(!isPhone() && !cntlr.current().rightController) return;
            let w = isPhone() ? cntlr.current() : cntlr.right();
            if(!w) return;
            if(w.hasOwnProperty("rootController")) w = w.rootController;
            let a = w.panelView || w.panel;
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
                //24.16 修复返回问题
                if(a.hasOwnProperty("_sendClubButton") && w.getParentViewController().className == `UTItemDetailsNavigationController` && w.getParentViewController()._squadContext && a._sendClubButton.isInteractionEnabled() && e.item.definitionId == w.getParentViewController()._squadContext.squad.getPlayer(w.getParentViewController()._squadContext.slotIndex).item.definitionId && w.getParentViewController()._squadContext.squad.getPlayer(w.getParentViewController()._squadContext.slotIndex).item.concept && info.set.sbc_cback){
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
                e.getView()._fsuAuction.__subtext.setAttribute('data-id',pid);
                e.getView()._fsuAuction.__subtext.setAttribute('data-i',e.item.id || 0);
                if(events.getCachePrice(pid)){
                    let lp =  events.getCachePrice(pid,2);
                    if(lp && lp !== "0"){
                        e.getView()._fsuAuction.setSubtext(lp);
                        e.getView()._fsuAuction.setInteractionState(1);
                        if(a.hasOwnProperty("_fsuGP")){
                            a._fsuGP.__root.setAttribute("data-p",lp);
                            a._fsuGP.show();
                        }
                    }else{
                        e.getView()._fsuAuction.setSubtext(lp);
                        e.getView()._fsuAuction.setInteractionState(0);
                    }
                }
                if(!info.set.player_auction){
                    e.getView()._fsuAuction.hide();
                }
                if(a.hasOwnProperty("_fsuRat") && e.item.rating > 0){
                    a._fsuRat.__root.setAttribute("data-r",e.item.rating);
                    a._fsuRat.setInteractionState(1);
                    a._fsuRat.show();
                }

                //24.16 快速替换同评分黄金：按钮显示
                if(a.hasOwnProperty("_fsuQuickGlod") && e.item.rating > 75 && e.item && e.item.isSpecial() && e.item.leagueId !== 1003 && e.item.leagueId !== 1014){
                    let defId = _.map(w.squad.getPlayers(), 'item.definitionId');
                    let tempC = {"rating":e.item.rating,"rs":9,"lock":false};
                    tempC.NEdatabaseId = defId;
                    let goldList = events.getItemBy(2,events.ignorePlayerToCriteria(tempC));
                    if(goldList.length){
                        let playerIndex = _.findIndex(w.squad.getPlayers(),(i) => i.item.definitionId == e.item.definitionId);
                        a._fsuQuickGlod.__root.setAttribute("data-index",playerIndex);


                        a._fsuQuickGlod.oldPlayer = e.item;
                        a._fsuQuickGlod.newPlayer = _.cloneDeep(goldList[0]);
                        a._fsuQuickGlod.challenge = w.challenge;


                        a._fsuQuickGlod.setInteractionState(1);
                        a._fsuQuickGlod.show();

                    }

                }

                //24.18 可进化标识：查看按钮添加
                if(e.item.loans === -1 && e.item.id && e.item.isPlayer() && !a.hasOwnProperty("_fsuAcademyHtml") && !e.item.isGK()){
                    const now = Math.floor(Date.now() / 1000);
                    function getMinNonZeroValue(obj) {
                        const { endTime, endTimePurchaseVisibility } = obj;
                        const nonZeroValues = [endTime, endTimePurchaseVisibility].filter(val => val !== 0);
                        if (nonZeroValues.length === 0) return null;
                        const minVal = Math.min(...nonZeroValues);
                        const diff = minVal - now;
                        return diff;
                    }
                    let academy = [];
                    _.map(repositories.Academy.getSlots(), v => {
                        if(v.status === AcademySlotState.NOT_STARTED && v.meetsRequirements(e.item)){
                            _.map(v.eligibilityRequirements,er => {
                                if(er.attribute == AcademyEligibilityAttribute.OVR && er.scope == 1){
                                    if(e.item.rating > _.min(er.targets) - 6){
                                        let academyMember = {
                                            academy:v,
                                            player:e.item.id,
                                            time:getMinNonZeroValue(v)
                                        }
                                        academy.push(academyMember)
                                    }
                                }
                            })
                        }
                    });
                    a._fsuAcademyHtml = events.createElementWithConfig("div",{
                        classList:["ut-button-group"]
                    })
                    a._fsuAcademyEle = [];
                    if(academy.length){
                        academy = _.sortBy(academy,i => i.time);
                        let academyFrstBut = events.createButton(
                            new UTGroupButtonControl(),
                            fy("academy.btntext2"),
                            (e) => {
                                //console.log(e._parent)
                                e._fsuOpen = !e._fsuOpen;
                                if (e._fsuOpen) {
                                    e.getRootElement().classList.add('fsu-open');
                                } else {
                                    e.getRootElement().classList.remove('fsu-open');
                                }
                                _.forEach(e._parent,(i,k) => {
                                    i.setDisplay(e._fsuOpen)
                                })
                            },
                            "more"
                        )

                        if(a.className == "UTAuctionActionPanelView" || e.item._auction._tradeState == "closed"){
                            academyFrstBut.setInteractionState(0)
                        }
                        a._fsuAcademyHtml.appendChild(academyFrstBut.getRootElement());
                        academyFrstBut._parent = a._fsuAcademyEle;
                        academyFrstBut._fsuOpen = false;
                        _.forEach(academy,i => {
                            let academyBut = events.createButton(
                                new UTGroupButtonControl(),
                                fy(["academy.btntext",i.academy.slotName]),
                                (e) => {
                                    var academyViewmodel = new UTAcademyViewModel(services.Academy);
                                    academyViewmodel.setSlots(repositories.Academy.getSlots());
                                    academyViewmodel.setSelectedSlot(e.academy.id);
                                    var targetView = e.parent;
                                    academyViewmodel.getSlotPreview(e.academy.id,e.player).observe(targetView, function(e, t) {
                                        if (e.unobserve(targetView),t.success && JSUtils.isObject(t.data)) {
                                            let selectedAcademy = t.data.updatedSlot;
                                            let academyBio = new UTPlayerBioViewController;
                                            let boostPlayer = selectedAcademy.levels[selectedAcademy.levels.length - 1].boostedPlayer;
                                            boostPlayer.academy._iconTraits.splice(0, boostPlayer.academy._iconTraits.length, ..._.uniqBy(boostPlayer.academy._iconTraits, 'traitId'));
                                            boostPlayer.academy._baseTraits.splice(0, boostPlayer.academy._baseTraits.length, ..._.uniqBy(boostPlayer.academy._baseTraits, 'traitId'));
                                            const iconTraitIds = new Set(boostPlayer.academy._iconTraits.map(t => t.traitId));
                                            _.remove(boostPlayer.academy._baseTraits, trait => iconTraitIds.has(trait.traitId));
                                            academyBio.initWithItem(boostPlayer);
                                            targetView.getNavigationController();
                                            targetView.getNavigationController().pushViewController(academyBio);
                                            academyBio.getView().fsuAcademy = selectedAcademy;
                                            targetView.getNavigationController().setNavigationTitle(selectedAcademy.slotName);
                                        } else if (!t.success) {
                                            var r = void 0
                                            , s = services.Localization
                                            , a = services.Notification;
                                            (r = NetworkErrorManager.checkCriticalStatus(t.status) ? (NetworkErrorManager.handleStatus(t.status),
                                            s.localize("academy.preview.loaderror")) : t.status === HttpStatusCode.SERVICE_UNAVAILABLE_ERROR || (null === (i = t.error) || void 0 === i ? void 0 : i.code) === UtasErrorCode.SERVICE_IS_DISABLED ? s.localize("academy.feature.disabled") : s.localize("academy.preview.unexpectederror")) && a.queue([r, UINotificationType.NEGATIVE])
                                        }
                                    })
                                },
                                "accordian"
                            )
                            if(i.time){
                                academyBut.setSubtext(services.Localization.localizeAuctionTimeRemaining(i.time))
                            }
                            academyBut.player = i.player;
                            academyBut.academy = i.academy;
                            academyBut.parent = w;
                            academyBut.setDisplay(0);
                            a._fsuAcademyHtml.appendChild(academyBut.getRootElement());
                            a._fsuAcademyEle.push(academyBut)
                        })
                        let targetElement = a?.__itemActions ? a.__itemActions : a?._playerBioButton ? a._playerBioButton.__root.parentNode : false;
                        if(targetElement){
                            targetElement.before(a._fsuAcademyHtml)
                        }
                    }
                }

            }else{
                e.getView()._fsuAuction.setDisplay(!1);
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
                let rul = repositories.Item.getUnassignedItems().map(i => {
                    if (i.isDuplicate() && !i.isLimitedUse() && i.isPlayer()) {
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
                if(w.hasOwnProperty("parentViewController") && w.parentViewController){
                    events.sbcQuerySetFillAttr(w.parentViewController,0,false,3)
                }

                //默契球员按钮判断
                if(w.hasOwnProperty("challenge") && w.viewmodel.getIndex() < 11 && w.squad.getFieldPlayers().filter(i => i.getItem().rating > 0).length){
                    let c = 0,r = 0,q = 0;
                    for (let se of w.challenge.eligibilityRequirements) {
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
                if(w.hasOwnProperty("challenge") && w.challenge.meetsRequirements() && info.set.sbc_meetsreq && w.viewmodel.getIndex() < 11){
                    a._fsuMeets.show();
                    a._fsuMeets._parent = w;
                }
            }

            //插入假想球员搜索按钮
            if(!("_fsuConceptSearch" in a) && "squad" in w && w.squad.isSBC() && e.item.isPlayer() && e.item.concept){
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
            if(!("_fsuRequests" in a) && "squad" in w && w.squad.isSBC() && "_fsuRequests" in w.squad && e.item.isPlayer()){
                let btnBox = events.createElementWithConfig("div",{
                    classList:["ut-button-group"]
                })
                a._fsuRequests = [];
                _.map(w.squad._fsuRequests,(i) => {
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
                    let currentNumber = "",firstKey = i.value.getFirstKey();
                    if(firstKey == SBCEligibilityKey.PLAYER_MIN_OVR || firstKey == SBCEligibilityKey.PLAYER_EXACT_OVR){
                        currentNumber = w.challenge.getNumberOfPlayersByOVR(firstKey,i.value.getFirstValue(firstKey));
                    }else if(firstKey == SBCEligibilityKey.PLAYER_RARITY_GROUP){
                        currentNumber = w.challenge.getNumberOfPlayersByGroup(i.value.getFirstValue(firstKey));
                    }else{
                        currentNumber = w.challenge.getRequirementCounter(i.value);
                    }
                    btn.setSubtext(`${currentNumber}/${i.value.count}`);
                    a._fsuRequests.push(btn);
                    btnBox.appendChild(btn.getRootElement());
                })
                a._fsuRequestsBox = btnBox;
                a._fsuButtons.insertAdjacentElement('afterend', btnBox);
            }

            //25.21 隐藏SBC阵容时选择球员出现的部分按钮
            if("squad" in w && w.squad.isSBC() && e.item.isPlayer()){
                a._btnBio.hide(); //球员简历
                a._btnApplyConsumable.hide(); //使用消耗品
                a._btnDiscard.hide(); //快速出售
                if(e.item.untradeable){
                    a._btnTransfer.hide(); //发送转会市场
                }
                if(!e.item.concept){
                    a._btnSearchMarket.hide(); //比较价格
                    a._btnSearchSlot.hide(); //在转会市场搜索
                }
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
                case SBCEligibilityKey.PLAYER_MIN_OVR:
                    text = combine(_.map(rIds, (value) => {
                        return L10n.localize("sbc.requirements.rating.min.val", [value])
                    }))
                    break;
                case SBCEligibilityKey.PLAYER_RARITY_GROUP:
                    text = combine(_.map(rIds, (value) => {
                        return L10n.localize(`Player_Group_${value}`)
                    }))
                    break;
                case SBCEligibilityKey.PLAYER_EXACT_OVR:
                    text = combine(_.map(rIds, (value) => {
                        return L10n.localize("sbc.requirements.rating.exact.val", [value])
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
                    events.playerToAuction(i,p,1);
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
            let pb = e._bioButton || e._btnBio || e._playerBioButton;
            if(pb){
                pb.__root.after(e._fsuPlayer.__root);
            }
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
                        events.buyConceptPlayer([e.player],e._parent);
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
                        let b = isPhone() ? cntlr.current().rootController : cntlr.right();
                        events.sbcQuerySetFillAttr(b.parentViewController,1,[],3)
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
                        let b = isPhone() ? cntlr.current().rootController : cntlr.right();
                        let p = events.getDedupPlayers(
                            events.getItemBy(
                                2,
                                {
                                    "definitionId": _.map(
                                        _.filter(repositories.Item.getUnassignedItems(),
                                            i => i.isDuplicate() && !i.isLimitedUse() && i.isPlayer()
                                        ),
                                        'definitionId'
                                    ),
                                    "academy": null
                                },
                                false,
                                repositories.Item.club.items.values()
                            ),
                            b.squad.getPlayers()
                        );
                        if(p.length){
                            events.sbcQuerySetFillAttr(b.parentViewController,3,p,3)
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

                //24.16 快速替换同评分黄金：按钮添加
                let qsg = events.createButton(
                    new UTGroupButtonControl(),
                    fy("sbc.swapgold"),
                    (e) => {
                        console.log(e);
                        events.showLoader();
                        let playerIndex = e.challenge.squad._getPlayerSlotByItemId(e.oldPlayer.id).getIndex();
                        let playerList = _.cloneDeep(_.map(e.challenge.squad.getPlayers() , i => i.item));
                        playerList[playerIndex].definitionId = e.newPlayer.definitionId;
                        playerList[playerIndex].id = e.newPlayer.id;
                        console.log(playerList)
                        events.saveSquad(e.challenge,e.challenge.squad,playerList,[]);
                        events.hideLoader();
                        events.saveOldSquad(e.challenge.squad,false);
                        if(!isPhone()){
                            e._parent.getSuperview().items._collection[e._parent.getSuperview().items._index].render(e.newPlayer)
                        }
                    },
                    ""
                )
                qsg.hide();
                qsg._parent = e;
                e._fsuQuickGlod = qsg;
                fbg.appendChild(e._fsuQuickGlod.__root);


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
            let newChallenge = events.createVirtualChallenge(e._parent.challenge);
            let defList = e._parent.challenge.squad.getPlayers().map(i => {return i.getItem().definitionId}).filter(Boolean);
            let search = {"NEdatabaseId":defList};
            let shortlist = events.getItemBy(2,search);
            let playerIndex = e._parent.viewmodel.current().getIndex();
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
                let b = isPhone() ? cntlr.current().rootController : cntlr.right();
                events.sbcQuerySetFillAttr(b.parentViewController,7,resultList,3)
                await b.panelView._btnAddSwap._tapDetected(this);
            }else{
                events.notice("meetsreq.error",2);
            }
        }

        //25.02 整合球员显示
        events.getManyPlayers = (type) => {
            //type 1:俱乐部和仓库 2:未分配重复和仓库
            if(type == 1){
                return _.concat(repositories.Item.club.items.values(),repositories.Item.getStorageItems())
            }else if(type == 2){
                return _.concat(repositories.Item.getUnassignedItems(),repositories.Item.getStorageItems())
            }
        }
        //默契球员读取程序
        events.SBCSetChemPlayers = async(e) => {
            let needChem = Number(e.__root.getAttribute('data-c'));
            let needRating = Number(e.__root.getAttribute('data-r'));
            let needQuality = e.__root.getAttribute('data-q');
            let needPos = e._parent.viewmodel.current().generalPosition;
            let playerIndex = e._parent.viewmodel.current().getIndex();
            let isPlayer = e._parent.viewmodel.current().isValid();
            let playerChem = e._parent.viewmodel.current().chemistry;
            let currentList = e._parent.squad.getFieldPlayers().map(i => {return i.item});
            let defList = e._parent.viewmodel.values().map(i => {return i.item.definitionId});
            let search = {"NEdatabaseId":defList,"bepos":needPos};
            let currentChem = e._parent.squad.getChemistry();
            // if(needRating){
            //     search.BTWrating = [needRating-5,needRating+5]
            // }
            if(needQuality != "0"){
                search.quality = needQuality
            }
            let shortlist = events.getItemBy(2,search);
            let squad = e._parent.squad;
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
                let b = isPhone() ? cntlr.current().rootController : cntlr.right();
                events.sbcQuerySetFillAttr(b.parentViewController,7,resultList,3)
                await b.panelView._btnAddSwap._tapDetected(this);
            }else{
                events.notice("notice.notchemplayer",2);
            }
        }
        events.playerQuickAuction = async(e) => {
            let p = Number(e.__subtext.innerText.replace(/,/g, ''));
            if(!p) return;
            let w = isPhone() ? cntlr.current() : cntlr.right();
            await w._quickListPanel.getView()._bidNumericStepper.setValue(p);
            await w._quickListPanel.getView()._buyNowNumericStepper.setValue(p);
            await w._quickListPanel.getView()._listButton._tapDetected(this);
            events.notice("notice.quickauction",1);
        }

        UTObjectivesHubView.prototype.setupNavigation = function(e) {
            call.task.objN.call(this,e)
            if(!info.task.obj || !Object.keys(info.task.obj.stat).length || !info.set.info_obj){return}


            let t = this._objectivesTM.items;
            info.task.obj.stat.catReward = 0;
            _.map(t,i => {

                if(_.has(i,"notifBubble")){
                    info.task.obj.stat.catReward += _.toInteger(i.notifBubble.getRootElement().textContent)
                }


                if(_.has(info.task.obj.stat.catNew,i.id) && info.task.obj.stat.catNew[i.id] !== 0){
                    i.__root.append(
                        events.createElementWithConfig("div",{
                            textContent:`+ ${info.task.obj.stat.catNew[i.id]}`,
                            classList:["fsu-task-bar"]
                        })
                    );
                }
                if(_.has(info.task.obj.stat.catExpiry,i.id) && info.task.obj.stat.catExpiry[i.id] !== 0){
                    i.__root.append(
                        events.createElementWithConfig("div",{
                            textContent:`- ${info.task.obj.stat.catExpiry[i.id]}`,
                            classList:["fsu-task-bar","expiry"]
                        })
                    );
                }
            })
        }


        //25.01 赛季目标
        FCObjectiveSeasonView.prototype.setCampaign = function(n) {
            call.task.seasonSet.call(this,n)

            _.map(this.levels,i => {
                if(i.levelRewards.length == 1){
                    let levelRewards = i.levelRewards[0].rewards;
                    if(levelRewards.length == 1){
                        let reward = levelRewards[0];
                        if(reward.isPack){
                            events.setRewardOddo(i._rewardsCarousel.getRootElement().querySelector(".reward"),reward);
                        }
                    }
                }
            })
        }
        //目标普通任务（非赛季）奖励信息显示
        //24.20 改为使用预估价值
        UTObjectiveCategoryView.prototype.setCategoryGroups = function(i, e, o, n) {
            call.task.objG.call(this ,i, e, o, n)
            let g = this.groups;
            for (let i of g) {
                if(!info.task.obj || !Object.keys(info.task.obj.stat).length){return}
                if(_.includes(info.task.obj.stat.new,i.id)){
                    i.getRootElement().insertBefore(events.createDF(`<div class="fsu-objnew">${fy("task.new")}</div>`), i.getRootElement().firstChild);
                }
                if(_.includes(info.task.obj.stat.expiry,i.id)){
                    i.__title.parentNode.after(events.createDF(`<div class="task-expire">${fy("task.expire")}</div>`))
                }
                let item = e.find(z => z.compositeId == i.id)
                if(item && item.rewards.rewards.length && item.rewards.rewards.length == 1){
                    let reward = item.rewards.rewards[0];
                    if(reward.isPack || (reward.isItem && reward.item && reward.item.isPlayerPickItem())){
                        let packCoinValue = events.getOddo(reward.value);
                        if(packCoinValue){
                            let packBox = events.createElementWithConfig("div", {
                                style:{
                                    position:"absolute",
                                    bottom:"0",
                                    backgroundColor:"rgb(0 0 0 / 60%)",
                                    width:"100%",
                                    textAlign:"center",
                                    padding:".2rem 0",
                                    fontSize:"0.8rem"
                                }
                            });
                            let packTitle = events.createElementWithConfig("div", {
                                textContent:_.replace(_.replace(fy("returns.text"),":",""),"：","")
                            });
                            packBox.appendChild(packTitle)
                            let packCoin = events.createElementWithConfig("div", {
                                classList: ['currency-coins'],
                                textContent:(packCoinValue *  reward.count).toLocaleString()
                            });
                            packBox.appendChild(packCoin)
                            i._rewardView.__asset.style.position = "relative";
                            i._rewardView.__asset.appendChild(packBox)
                        }
                    }
                }
            }
        }
        UTHomeHubView.prototype._generate = function (...args) {
            if (!this._generated) {
                call.task.home.call(this, ...args);
                GM_addStyle(info.base.sytle);
                console.log(fy("tile.settitle"))
                this._fsuDodo = events.createTile(
                    fy("tile.dodotitle"),
                    fy("tile.dodotext"),
                    (e) => {
                        GM_openInTab(`https://fut.to`, { active: true, insert: true, setParent :true });
                    }
                )
                this._sbcTile.__root.after(this._fsuDodo.__root);
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
                this._fsuDodo.__root.after(this._fsuSet.__root);
                this._fsuGP = events.createTile(
                    fy("tile.gptitle"),
                    fy("tile.gptext"),
                    (e) => {
                        services.Club.clubDao.clubRepo.items.reset();
                        events.reloadPlayers(e._parent);
                    }
                )
                this._fsuGP._parent = this;
                this._fsuSet.__root.after(this._fsuGP.__root);

                events.init();
            }
        };
        events.reloadPlayers = async(e) =>{
            GM_setValue("players",JSON.stringify({}));
            let current = cntlr.current();
            await services.Club.getStats().observe(current,async function _onGetStats(e, t) {
                e.unobserve(current);
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
                                                let playersCache = JSON.parse(GM_getValue("players","{}"));
                                                _.map(t.response.items,i => {
                                                    if(!(_.has(info.roster.ea,i.definitionId)) || i._marketAverage !== -1){
                                                        info.roster.ea[i.definitionId] = {
                                                            "n":i._marketAverage,
                                                            "t":i._marketAverage !== -1 ? i._marketAverage.toLocaleString() : 0
                                                        }
                                                    }
                                                    if(!_.has(i,"academyAttributes")){
                                                        playersCache[i.definitionId] = 1;
                                                    }
                                                })
                                                GM_setValue("players",JSON.stringify(playersCache));
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
                            await services.Item.searchStorageItems(new UTSearchCriteriaDTO()).observe(current, function(e, t) {
                                e.unobserve(current);
                                if(t.success && t.response && !JSUtils.isString(t.response)){
                                    let playersCache = JSON.parse(GM_getValue("players","{}"));
                                    _.map(t.response.items,i => {
                                        if(!_.has(playersCache,i.definitionId) && i.academy == null){
                                            playersCache[i.definitionId] = 2;
                                        }
                                    })
                                    GM_setValue("players",JSON.stringify(playersCache));
                                }
                            });
                            events.hideLoader();
                            info.base.state = true;
                            events.notice("notice.ldatasuccess",0);
                            if(cntlr.current().className == "UTHomeHubViewController" && info.task.obj.html && cntlr.current().getView()._objectivesTile.__tileContent.querySelector(".ut-tile-view--subtitle")){

                                if(!cntlr.current().getView()._objectivesTile.__root.querySelector(".fsu-task")){
                                    cntlr.current().getView()._objectivesTile.__tileContent.before(
                                        events.createDF(`<div class="fsu-task">${info.task.obj.html}</div>`)
                                    )
                                }
                                let objCountElement = cntlr.current().getView()._objectivesTile.getRootElement().querySelector(".fsu-obj-count");
                                if(objCountElement && info.task.obj.stat.catReward){
                                    objCountElement.textContent = info.task.obj.stat.catReward;
                                    objCountElement.style.display = "block";
                                }
                            }
                            if(cntlr.current().className == "UTHomeHubViewController" && info.task.sbc.html && !cntlr.current().getView()._sbcTile.__root.querySelector(".fsu-task") && cntlr.current().getView()._sbcTile.__tileContent.querySelector(".ut-tile-content-graphic-info")){
                                cntlr.current().getView()._sbcTile.__tileContent.before(
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

            //25.01 强制开启目标任务
            console.log(services.Configuration.checkFeatureEnabled(UTServerSettingsRepository.KEY.META_FCAS_ENABLED))
            if(services.Configuration.checkFeatureEnabled(UTServerSettingsRepository.KEY.META_FCAS_ENABLED) == false){
                services.Configuration.serverSettings.setSettingByKey(UTServerSettingsRepository.KEY.META_FCAS_ENABLED,1)
            }
            return this._objectivesTile
        }

        //25.05 修复目标首页更新数字
        UTObjectivesHubTileView.prototype.setSubtitle = function(e) {
            call.task.objSetTitle.call(this,e)
            let objCountElement = this.getRootElement().querySelector(".fsu-obj-count");
            if(!objCountElement){
                let rCountStyle;
                if(isPhone()){
                    rCountStyle = [".5rem",".6rem","1.2rem","1.2rem","1rem","1.2rem"]
                }else{
                    rCountStyle = [".7rem",".7rem","1.4rem","1.4rem","1.2rem","1.4rem"]
                }
                let rCount = events.createElementWithConfig("div",{
                    textContent: info.task.obj.stat.catReward,
                    classList:["ut-tab-bar-item-notif","fsu-obj-count"],
                    style:{
                        position:"absolute",
                        right:rCountStyle[0],
                        top:rCountStyle[1],
                        width:rCountStyle[2],
                        height:rCountStyle[3],
                        fontSize:rCountStyle[4],
                        lineHeight:rCountStyle[5]
                    }
                })
                if(!info.task.obj.stat.catReward){
                    rCount.style.display = "none";
                }
                this.getRootElement().prepend(rCount);
            }else{
                if(info.task.obj.stat.catReward){
                    objCountElement.style.display = "block";
                    objCountElement.textContent = info.task.obj.stat.catReward;
                }else{
                    objCountElement.style.display = "none";
                }
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
            request:UTClubSearchResultsViewController.prototype._requestItems,
            setHeader:UTClubSearchResultsViewController.prototype.setupHeader
        };

        UTClubSearchFiltersViewController.prototype.viewDidAppear = function() {
            call.search.club.viewDid.call(this)
            if(this.squad.isActive() || this.squad.isDream()){
                if(!("_fsuSortInit" in this.getView())){
                    this.getView()._sortDropDown.setIndexById(2);
                    this.getView()._fsuSortInit = true;
                }
            }
            if("_fsuFillType" in this.parentViewController){
                if(this.squad.isSBC() || this.squad.isActive() || this.squad.isDream()){
                    events.searchFill(this);
                }
            }
        }

        //改变为假想球员后禁止评分部分调整
        UTClubSearchFiltersViewController.prototype.onSearchModeChanged = function(t,e) {
            call.search.club.modeChange.call(this,t,e);
        }

        //列表化学差异处给在俱乐部的球员上tag
        UTClubSearchResultsView.prototype.setItemsWithChemDiff = function(t,a,s,l,c) {
            call.search.club.setChemDiff.call(this,t,a,s,l,c);
            _.map(t,(player,index) => {
                let iconName = "";
                let className = "";
                if(!(this.activeSquad.containsItem(player,!0))){
                    if(player.concept){
                        if(events.getItemBy(1,{definitionId:player.definitionId}).length){
                            iconName = "club";
                            className = "fsu-inclubtag";
                        }
                    }
                }

                if(events.getItemBy(1,{"id":player.id},false,repositories.Item.storage.values()).length){
                    iconName = "sbc";
                    className = "fsu-instoragetag";
                }

                if(iconName !== ""){
                    let tag = new UTListActiveTagView;
                    tag.setIconClass(iconName);
                    tag.getRootElement().querySelector(".label-container").classList.add(className);
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
                _.map(this.searchFilters.values(),i => {
                    i._fsuFiltersCount = 1;
                    i.criteria = e;
                    if(isPhone() && !cntlr.current()._fsuFillType%2){
                        events.playerSearchCountShow(i);
                    }
                })
            }
        }

        events.playerSearchCountShow = (e) => {
            if(_.has(e,"_fsuFiltersCount")){
                let filterToPlayer = {"nation":"nationId","league":"leagueId","club":"teamId","rarity":"rareflag","playStyle":"playStyle"},
                    criteriaDefault = {"nation":-1,"league":-1,"club":-1,"rarity":[],"position":"any","level":"any","playStyle":-1},
                    excludeCriteria = _.cloneDeep(e.criteria.searchCriteria);


                let controller = isPhone() ? cntlr.current() : cntlr.current().className == "UTMyClubSearchFiltersViewController" ? cntlr.current() : cntlr.right();

                let basePlayers = [],fsuCriteria = {"unlimited":true},readFillMode = false;


                //判断所处的界面来识别对应的获取基础数据的方式
                if("squad" in controller && controller.squad.isSBC()){

                    if(controller.getParentViewController() && "_fsuFillArray" in controller.getParentViewController() && controller.getParentViewController()._fsuFillArray.length){
                        readFillMode = true;
                        fsuCriteria.unlimited = false;
                    }
                }
                if(readFillMode){
                    basePlayers = controller.getParentViewController()._fsuFillArray;
                }else{
                    //剔除自身的选项
                    let currentFilter = e.setId == "rarity" ? "rarities" : e.setId,
                        currentFilterDefault = criteriaDefault[e.setId];

                    excludeCriteria[currentFilter] = currentFilterDefault;
                    if(e.setId == "position" && excludeCriteria.zone !== -1){
                        excludeCriteria.zone = -1;
                    }
                    basePlayers = repositories.Item.club.search(excludeCriteria)
                }

                if(basePlayers.length){
                    basePlayers = events.getItemBy(2,fsuCriteria,false,basePlayers);
                    let resultMap = new Map(),groupedData = [];
                    if(_.has(filterToPlayer,e.setId)){
                        groupedData = _.groupBy(basePlayers, filterToPlayer[e.setId]);
                    }else if(e.setId == "level"){
                        groupedData = _.groupBy(basePlayers, i => {
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
                        });
                    }else if(e.setId == "position"){
                        let fuzzyPos = {
                            1: 130, 2: 130, 3: 130, 4: 130, 5: 130,
                            6: 130, 7: 130, 8: 130, 9: 131, 10: 131,
                            11: 131, 12: 131, 13: 131, 14: 131, 15: 131,
                            16: 131, 17: 131, 18: 131, 19: 131, 20: 132,
                            21: 132, 22: 132, 23: 132, 24: 132, 25: 132,
                            26: 132, 27: 132
                        },
                            posName = excludeCriteria.preferredPositionOnly ? "preferredPosition" : "possiblePositions";

                        groupedData = basePlayers.reduce((acc, item) => {
                            function posToPa(p,a){
                                a.push(p)
                                if(p > 0){
                                    a.push(fuzzyPos[p])
                                }
                            }
                            let posArray = [];
                            if(excludeCriteria.preferredPositionOnly){
                                posToPa(item.preferredPosition,posArray)
                            }else{
                                item.possiblePositions.forEach(p => {
                                    posToPa(p,posArray)
                                });
                            }
                            _.map(_.uniq(posArray),p => {
                                acc[p] = (acc[p] || 0) + 1;
                            })
                            return acc;
                        }, {});
                    }
                    if(_.size(groupedData)){
                        for (const key in groupedData) {
                            resultMap.set(key, _.isNumber(groupedData[key]) ? groupedData[key] : _.size(groupedData[key]));
                        }
                    }

                    let list = isPhone() ? e.__picker.querySelectorAll("option") : e.__list.querySelectorAll("li"),
                        oCount = [];
                    for (let [index, element] of list.entries()) {
                        let id = e.options[index].id,count = resultMap.get(`${id}`);
                        if(count){
                            if(isPhone()){
                                element.append(events.createDF(`(${count})`));
                            }else{
                                element.style.position = "relative";
                                element.append(events.createDF(`<span class="fsu-fcount">${count}</span>`));
                            }
                            oCount.push(count);
                        }else{
                        oCount.push(0);
                        }
                    }
                    if(e.hasOwnProperty(`_fsu${e.setId}`)){
                        e[`_fsu${e.setId}`]["_oCount"] = oCount;
                    }
                }
            }
        }

        //PC下添加数量
        UTDropDownControl.prototype.open = function(){
            call.search.dropdownOpen.call(this)
            events.playerSearchCountShow(this);
        }
        events.searchFill = async(e) =>{
            let c = e.viewmodel.searchCriteria,t = e.parentViewController._fsuFillType,
                p = e.parentViewController._fsuFillArray,
                fs = e.parentViewController._fsuFillSort || 3,
                r = "_fsuFillRange" in e.parentViewController ? e.parentViewController._fsuFillRange : [45,99];



            if("_fsuFillFirst" in e.parentViewController && e.parentViewController._fsuFillFirst){
                c.ovrMin = r[0]
                c.ovrMax = r[1]
                e.parentViewController._fsuFillFirst = false
            }
            if(t%2 !== 1){

                //25.07 修复搜索评分选择问题
                let SLn = services.Localization,
                    ovrRO = e.getView()._filterContainer._ovrRangeOptions,
                    ovrRD = e.getView()._filterContainer.__ovrRangeDescription;

                ovrRO.initWith(r[0], r[1], SLn.localize("search.ovrRange.input.min"), SLn.localize("search.ovrRange.input.max"))
                ovrRD.textContent = SLn.localize("search.ovrRange.description").replace(/45/, r[0]).replace(/99/, r[1])
                ovrRO.setMinValue(c.ovrMin)
                ovrRO.setMaxValue(c.ovrMax)

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
                await e.getView().getSearchButton()._tapDetected(this);
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
                if("_fsuFilterBtn" in e.parentViewController){
                    delete e.parentViewController._fsuFilterBtn
                }
                await e.getView().getPlayerNameSearch()._playerNameInput.setValue(pn);
                await e.getView().getPlayerNameSearch()._playerNameInput.setInteractionState(0);
                let sortId = SearchSortID[_.toUpper(`${_.replace(c.sortBy,"ovr","rating")}_${c.sort}`)];
                if(e.getView().getSortDropDown().getId() !== sortId){
                    e.getView().getSortDropDown().setIndexById(sortId);
                }
                return;
            }


            console.log("开始判断进行填充选项","此时的saveCriteria为：",info.criteria)
            if(Object.keys(info.criteria).length == 0 && t == 0){
                await e.getView().getSortDropDown().setIndexById(2);
            }else{
                if(!info.set.sbc_records) return;

                /** 25.18 范围选项设置 */
                if(_.has(info.criteria,"clubSearchType")){
                    let CST = _.find(e.getView()._filterContainer.pileFilter.options, o => o.value == info.criteria.clubSearchType);
                    if(CST){
                        await e.getView()._filterContainer.pileFilter.setIndexById(CST.id)
                    }
                }


                //交易选项匹配判断
                c._untradeables = info.criteria._untradeables;
                if(info.criteria._untradeables == "true"){
                    await e.getView().getSortOptions().toggles._collection["sort-untradeable"].toggle(true);
                }else{
                    await e.getView().getSortOptions().toggles._collection["sort-untradeable"].toggle(false);
                }
                //排除队伍选项匹配判断
                if(cntlr.current().className == `UTSquadSplitViewController`){
                    c.excludeDefIds = [];
                }else{
                    c.excludeDefIds = info.criteria.excludeDefIds;
                    if(info.criteria.excludeDefIds.length > 0){
                        await e.getView().getSortOptions().toggles._collection["sort-exclude-squad"].toggle(true);
                    }else{
                        await e.getView().getSortOptions().toggles._collection["sort-exclude-squad"].toggle(false);
                    }
                }
                //排序条件选项匹配判断
                if(info.criteria.sortBy !== c.sortBy || info.criteria._sort !== c._sort){
                    let sort = ["valuedesc","valueasc","ovrdesc","ovrasc","recentdesc"]
                    for (let i = 0; i < sort.length; i++) {
                        if(info.criteria.sortBy + info.criteria._sort == sort[i]){
                            await e.getView().getSortDropDown().setIndexById(i);
                            break;
                        }
                    }
                }
                //品质条件选项匹配判断
                if(info.criteria.level !== c.level){
                    for (const v of e.getView()._filterContainer.filters[0].options) {
                        if(v.value == info.criteria.level){
                            await e.getView()._filterContainer.filters[0].setIndexById(v.id);
                            break;
                        }
                    }
                }
                //稀有条件选项匹配判断
                if(info.criteria.rarities !== c.rarities){
                    if(info.criteria.rarities.length == 1){
                        await e.getView()._filterContainer.filters[1].setIndexById(info.criteria.rarities[0])
                    }
                }
                //位置条件选项匹配判断
                if(info.criteria._position == "any"){
                    await e.getView()._filterContainer.filters[2].setIndexById(-1)
                }else{
                    let posId = -1;
                    let slot = isPhone() ? cntlr.current().getCurrentController().iterator : cntlr.right().iterator;
                    if(slot){
                        posId = slot.get(slot.getIndex()).generalPosition;
                    }
                    await e.getView()._filterContainer.filters[2].setIndexById(posId)
                }
                if(info.criteria.nation !== c.nation){
                    await e.getView()._filterContainer.filters[4].setIndexById(info.criteria.nation)
                }
                if(info.criteria.league !== c.league){
                    await e.getView()._filterContainer.filters[5].setIndexById(info.criteria.league)
                }
                if(info.criteria.club !== c.club){
                    await e.getView()._filterContainer.filters[6].setIndexById(info.criteria.club)
                }
                if(t == 1){
                    setTimeout(() => {
                        e.getView().getSearchButton()._tapDetected(this);
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
                            w = cntlr.current().currentController;
                        }else{
                            w = cntlr.right();
                        }
                        if(w.searchCriteria){
                            if(w.getParentViewController()._fsuFillType == 0){
                                info.criteria = JSON.parse(JSON.stringify(w.searchCriteria));
                                info.criteria.clubSearchType = w.clubSearchType;
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
                if(!s._interactionState){ continue };
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
            let iz = cntlr.current().getView();
            if(cntlr.current().hasOwnProperty("rightController")){
                iz = cntlr.right().getView();
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
        //快速SBC数量检测
        events.fastSBCQuantity = (y,p,o) => {
            let c = [];
            if(!info.build.strictlypcik && events.isEligibleForOneFill(o)){
                let criteriaNumber = o[0].c + o[1].c;
                let gf = {rs:JSON.parse(JSON.stringify(o[0].t.rs))};
                gf = events.ignorePlayerToCriteria(gf);
                let items = y ? events.getItemBy(1,gf,p) : events.getItemBy(1,gf,false,p);
                let tc = _.size(items);
                tc = Math.ceil(tc / criteriaNumber);
                return tc;
            }else{
                _.each(o,os => {
                    let criteria = events.ignorePlayerToCriteria(_.cloneDeep(os.t));
                    criteria.lock = false;
                    let items =  y ? events.getItemBy(1,criteria,p) : events.getItemBy(1,criteria,false,p);
                    let tc = _.size(items);
                    tc = Math.ceil(tc / os.c);
                    c.push(tc)
                })
                return y ? _.min(c) : _.max(c);
            }
        }
        //未分配界面
        UTUnassignedItemsViewController.prototype.renderView = function(...args) {
            call.view.unassigned.call(this, ...args);
            //未分配为0直接返回
            setTimeout(() => {
                if(this.getViewModel() && this.getViewModel().length === 0 && !document.querySelector(".ut-player-picks-view")){
                    if(isPhone()){
                        this.parentViewController.backButton._tapDetected(this)
                    }else{
                        this.parentViewController.parentViewController.backButton._tapDetected(this)
                    }
                    events.notice("notice.packback",1);
                }

                if(this.getViewModel() == null){
                    return;
                }
                //24.15 头部SBC导航：未分配列表时检测无效的包予以隐藏
                let invalidPick = _.filter(this.getViewModel().values(), item => {
                    return item.isPlayerPickItem() && item.id === item.definitionId;
                });
                if(invalidPick.length){
                    _.map(this.getView().sections,section => {
                        _.map(section.listRows,item => {
                            if(item.data.isPlayerPickItem() && item.data.id === item.data.definitionId){
                                item.hide()
                            }
                        })
                    })
                }



            },800);
        }

        //SBC无须排列创建队伍
        UTSquadBuilderViewModel.prototype.generatePlayerCollection = function(e, o, n, r) {
            let c = 0;
            let ls = info.build.league ? info.set.shield_league : [];
            let rs = info.build.rare ? [3] : [];
            let p = o.filter(item => !ls.includes(item.leagueId) && !rs.includes(item.rareflag))
            let v = 0;
            for (let i = 0; i < 11; i++) {
                if(!r.getSlot(i).isValid() && !r.getSlot(i).isBrick()){
                    v++;
                }
            }
            if(p.length < v && (ls.length || rs.length)){
                events.notice("notice.builder",2)
            }
            let s = this;
            let pa = e.map(function (_, t) {
                var i = r ? r.getSlot(t) : null;
                return i && (i.isValid() || i.isBrick()) ?
                    i.getItem() :
                    info.build.ignorepos ?
                    p[c++] : s.getBestPlayerForPos(_, p);
            })
            events.loadPlayerInfo(pa);
            return pa;
        };

        //拍卖优化部分代码加载
        UTMarketSearchView.prototype._generate = function(...args) {
            if (!this._generated) {
                call.view.market.call(this,...args)
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

                //24.16 排除联赛设置入口改为顶部SBC数量设置入口
                this._fsuheadentrance = events.createButton(
                    new UTStandardButtonControl(),
                    isPhone() ? buttonText[1] : fy("headentrance.popupmt"),
                    () => {
                        events.popup(
                            fy("headentrance.popupmt"),
                            fy("headentrance.popupm"),
                            (t,i) => {
                                if(t === 2){
                                    let v = Number(i.getValue());
                                    if(!_.isNaN(v) && v > 0 && v < 9){
                                        set.save("headentrance_number",v)
                                    }else if(v == 0){
                                        set.save("headentrance_number",isPhone() ? 3 : 5)
                                    }else{
                                        events.notice(fy("notice.seterror"),2)
                                    }
                                }
                            }
                            ,
                            [
                                { labelEnum: enums.UIDialogOptions.OK },
                                { labelEnum: enums.UIDialogOptions.CANCEL }]
                            ,
                            [fy("headentrance.placeholder"),info.set.headentrance_number],
                            true
                        )
                    },
                    "call-to-action"
                )
                b.appendChild(this._fsuheadentrance.__root);

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
            if(!b.hasOwnProperty("shield_flag")){
                b["shield_flag"] = [];
            }
            if(!b.hasOwnProperty("queries_number")){
                b["queries_number"] = 5;
            }
            if(!b.hasOwnProperty("headentrance_number")){
                b["headentrance_number"] = isPhone() ? 3 : 5;
            }
            if(!b.hasOwnProperty("goldenrange")){
                b["goldenrange"] = 83;
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
                    url:`https://utas.mob.v4.prd.futc-ext.gcp.ea.com/ut/game/fc25/transfermarket?num=21&start=0&type=player&maskedDefId=${i}&maxb=${p}`,
                    headers: {
                        "Content-type": "application/json",
                        "X-UT-SID": info.base.sId
                    },
                    onload:function(response){
                        if(response.status == 404 || response.status == 401){
                            info.base.sId = services.Authentication.utasSession.id;
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

        //24.18 假想球员批量购买：新购买方法
        events.buyConceptPlayer = async (players, view) => {
            info.run.bulkbuy = true;
            if (repositories.Item.numItemsInCache(ItemPile.PURCHASED) >= MAX_NEW_ITEMS) {
                events.notice(["buyplayer.error", "", fy("buyplayer.error.child5")], 2);
                return;
            }
            events.showLoader();
            let playersNumber = players.length, quantity = 0, cost = 0;
            for (let index = 0; index < playersNumber; index++) {
                if(!info.run.bulkbuy){
                    continue;
                }
                const player = players[index];
                let defId, playerName, buyStatus = false;
                if (Number.isInteger(player)) {
                    defId = player;
                    playerName = repositories.Item.getStaticDataByDefId(defId).name;
                } else if (typeof player == "object" && player.isPlayer()) {
                    defId = player.definitionId;
                    playerName = player.getStaticData().name;
                }
                if (!defId) {
                    events.notice("buyplayer.getinfo.error", 2);
                    continue;
                }
                let loadingInfo = playersNumber == 1 ? "" : ["readauction.progress", index + 1 , playersNumber];
                let priceList = await events.readAuctionPrices(player, false, loadingInfo);
                priceList.sort((a, b) => b._auction.buyNowPrice - a._auction.buyNowPrice);
                console.log(priceList);
                events.changeLoadingText("buyplayer.loadingclose", loadingInfo);
                if (!priceList || priceList.length == 0) {
                    events.notice(["buyplayer.error", playerName, fy("buyplayer.error.child3")], 2);
                } else {
                    let currentPlayer = priceList[priceList.length - 1];
                    let currentData = currentPlayer.getAuctionData();
                    if (!currentData.canBuy(services.User.getUser().getCurrency(GameCurrency.COINS).amount)) {
                        events.notice(["buyplayer.error", playerName, fy("buyplayer.error.child2")], 2);
                    } else {
                        if (0 < currentData.getSecondsRemaining()) {
                            await new Promise((resolve) => {
                                events.sendPinEvents("Item - Detail View");
                                services.Item.bid(currentPlayer, currentPlayer._auction.buyNowPrice).observe(this, async function (sender, data) {
                                    if (data.success) {
                                        events.notice(["buyplayer.success", playerName, currentPlayer._auction.buyNowPrice], 0);
                                        quantity += 1;
                                        cost += currentPlayer._auction.buyNowPrice;
                                        services.Item.move(currentPlayer, ItemPile.CLUB).observe(this, (e, t) => {
                                            if (e.unobserve(this), t.success) {
                                                events.notice(["buyplayer.sendclub.success", playerName], 0);
                                                buyStatus = true;
                                                if (isPhone() && playersNumber == 1) {
                                                    let controller = cntlr.current();
                                                    if (controller.className == 'UTSquadItemDetailsNavigationController') {
                                                        controller.getParentViewController()._eBackButtonTapped();
                                                    }
                                                }
                                                resolve();
                                            } else {
                                                events.notice(["buyplayer.sendclub.error", playerName], 2);
                                                resolve();
                                            }
                                        });
                                    } else {
                                        let denied = data.error && data.error.code === UtasErrorCode.PERMISSION_DENIED;
                                        events.notice(["buyplayer.error", playerName, `${denied ? fy("buyplayer.error.child1") : ""}`], 2);
                                        resolve();
                                    }
                                });
                            });
                        } else {
                            events.notice(["buyplayer.error", playerName, fy("buyplayer.error.child4")], 2);
                        }
                    }
                }
                if(!buyStatus){
                    events.cardAddBuyErrorTips(defId);
                }
                // if (view && playersNumber == 1) {
                //     view.getSuperview().items._collection[view.getSuperview().items._index].render(player)
                // }
                if(playerName !== index){
                    await events.wait(0.5, 1);
                }
            }

            events.hideLoader();
            events.notice(["buyplayer.bibresults", quantity , playersNumber - quantity , cost] , quantity !== playersNumber ? 2 : 0);

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
            console.log(squad._fsuBuyEroor)
            if(!isPhone()){
                _.map(squad._fsuBuyEroor,i => {
                    if(document.querySelector(`.fsu-cards-buyerror[data-id="${i}"]`) == null && document.querySelector(`.fsu-cards-price[data-id="${i}"]`) !== null){
                        let buyErrorElement = events.getCardTipsHtml(1);
                        let targetElement = document.querySelector(`.ut-squad-slot-view .concept .fsu-cards-price[data-id="${i}"]`).parentNode;
                        let parentElement = targetElement.parentNode;
                        if(parentElement.querySelector(".fsu-cards-buyerror") == null){
                            parentElement.insertBefore(buyErrorElement, targetElement);
                        }
                    }
                })
            }
        }
        events.getCardTipsHtml = (type) => {
            //type 1:购买失败 2:SBC仓库
            let tipsClass = type == 1 ? "fsu-cards-buyerror" : "fsu-cards-storage";
            let tipsIcon = type == 1 ? "icon_untradeable" : "icon_sbc";
            let tipsBackgroundColor = type == 1 ? "#d31332" : "#5b167d";
            let tipsBorderColor = type == 1 ? "#d6675d" : "#7c319e";
            let tipsElement = events.createElementWithConfig("div",{
                classList:["ut-squad-slot-chemistry-points-view","item","fsu-cards",tipsClass],
                style:{
                    left:"auto",
                    right:"1%",
                    color:"#fae8e6",
                    backgroundColor:tipsBackgroundColor,
                    borderColor:tipsBorderColor
                }
            })
            let tipsElementIcon = events.createElementWithConfig("div",{
                classList:["ut-squad-slot-chemistry-points-view--container","chemstyle",tipsIcon]
            })
            tipsElement.appendChild(tipsElementIcon);
            return tipsElement;
        }
        events.readAuctionPrices = async(player,price,loadingInfo) => {
            events.changeLoadingText("readauction.loadingclose",loadingInfo);
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
                    try {
                        await events.getPriceForFubin(defId)
                    }catch(error) {
                        return;
                    }
                    searchCriteria.maxBuy = events.getCachePrice(defId,1);
                }
                searchModel.updateSearchCriteria(searchCriteria);
                events.changeLoadingText("readauction.loadingclose2",loadingInfo);
                while (attempts --> 0) {
                    events.changeLoadingText(["readauction.loadingclose3",`${searchModel.searchCriteria.maxBuy.toLocaleString()}`],loadingInfo);
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

        //25.13 一键填充的验证
        events.isEligibleForOneFill = (obj) => {
            const allowedKeys = ['gs', 'rs', 'rareflag'];
            if (_.size(obj) !== 2 || !_.every(obj, o =>
                _.isEqual(_.sortBy(_.keys(o.t)), _.intersection(_.keys(o.t), allowedKeys).sort()))) {
                return false;
            }
            const rsValues = obj.map(o => o.t && o.t.rs).filter(rs => rs !== undefined);
            return rsValues.length === 2 && _.uniq(rsValues).length === 1;
        };

        UTSBCSquadDetailPanelView.prototype.render = function(e, t, i, o) {
            call.panel.sbc.call(this,e, t, i, o)

            //24.18 批量购买假想球员：生成按钮
            if(!this._fsuBIB){
                this._fsuBIB = events.createButton(
                    new UTStandardButtonControl(),
                    fy("bibconcept.btntext"),
                    (e) => {
                        let conceptPlayers = _.map(_.filter(e.challenge.squad.getPlayers(), slot => {
                            return slot.item.concept;
                        }),"item");
                        if(isPhone() && cntlr.current().className !== "UTSBCSquadOverviewViewController"){
                            cntlr.current().parentViewController._eBackButtonTapped();
                        }
                        setTimeout(() => {
                            events.buyConceptPlayer(conceptPlayers);
                        },500);
                    },
                    "mini call-to-action"
                )
                this._fsuBIB.__root.style.width = 'calc(100% - 2rem)';
                this._fsuBIB.__root.style.marginLeft = '1rem';
                this._fsuBIB.__root.style.marginRight = '1rem';
                this._fsuBIB.challenge = e;
                this._challengeDetails.__root.insertBefore(this._fsuBIB.__root, this._challengeDetails.__description.nextSibling);
            }
            this._fsuBIB.hide()
            if(e.squad){
                let conceptList = _.filter(e.squad.getPlayers(), slot => {
                    return slot.item.concept;
                });
                if(conceptList.length){
                    this._fsuBIB.show()
                }
            }



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
                                            let futBinRegex = /www.futbin.com\/\d{2}\/squad\/\d+|^\d+$/;
                                            let futGGRegex = /www.fut.gg\/\d{2}\/squad-builder\/\S{8}-\S{4}-\S{4}-\S{4}-\S{12}|^\S{8}-\S{4}-\S{4}-\S{4}-\S{12}$/;
                                            if(futGGRegex.test(v)){
                                                let pattern = /\S{8}-\S{4}-\S{4}-\S{4}-\S{12}/;
                                                let sId = v.match(pattern);
                                                events.getTemplate(e,3,sId[0]);
                                            }else if(futBinRegex.test(v)){
                                                let pattern = /squad\/(\d+)/;
                                                let sId = v.match(pattern);
                                                events.getTemplate(e,2,sId[1]);
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
            let targetRting = 0,needChem = false,gf = [],isExact = false;

            _.map(e.eligibilityRequirements,r => {

                //25.21 插入恰好评分的判断逻辑
                if([ SBCEligibilityKey.TEAM_RATING, SBCEligibilityKey.PLAYER_EXACT_OVR ].includes(r.getFirstKey())){
                    targetRting = r.getFirstValue(r.getFirstKey());
                }
                if(r.getFirstKey() == SBCEligibilityKey.CHEMISTRY_POINTS){
                    needChem = true;
                }
                if(r.getFirstKey() == SBCEligibilityKey.PLAYER_EXACT_OVR){
                    isExact = true;
                }
            })
            if(targetRting == 0 && !needChem){
                gf = events.oneFillCreationGF(e.eligibilityRequirements,11 - e.squad.getAllBrickIndices().length);
            }
            //一键填充和重复球员填充判断

            //24.16 排除球员配置按钮：生成按钮
            if(!this._fsuIgnore){
                this._fsuIgnore = events.createButton(
                    new UTStandardButtonControl(),
                    fy("playerignore.button"),
                    (e) => {
                        events.ignorePlayerPopup();
                    },
                    "mini"
                )
                this._fsuIgnore.__root.style.width = '100%';
                this._challengeDetails._requirements.__root.appendChild(this._fsuIgnore.__root);
                this._fsuIgnore.hide()
            }
            if(Object.keys(gf).length){

                //25.09 输出快捷任务信息
                console.log("可执行快捷任务信息：")


                /** 25.18 快捷任务进行二次处理 */
                let fastSbcNeedInfo = _.cloneDeep(gf);
                _.remove(fastSbcNeedInfo, (f) => f.c === 0);
                _.forEach(fastSbcNeedInfo,f => {
                    let keyText = _.join(_.keys(f.t),"-");
                    if((keyText == "rareflag-rs" || keyText == "rs-rareflag") && f.t.rareflag == 1 && f.t.rs == 2){
                        f.t = {
                            gs: true,
                            rs: 2
                        }
                    }
                })

                if(fastSbcNeedInfo.length){
                    let fastJson = {};
                    fastJson[`${e.id}#${e.setId}`] = {
                        "g":fastSbcNeedInfo,
                        "t":e.endTime
                    }
                    console.log(fastJson);

                    /** 25.18 快捷任务取消和添加按钮 */

                    const fastSbcName = `${e.id}#${e.setId}`;
                    const fastSbcStats = _.has(info.base.fastsbc,fastSbcName) ? "del" : "add";
                    let fastSbcEditBtn = events.createButton(
                        new UTStandardButtonControl(),
                        fy(`fastsbc.${fastSbcStats}`),
                        (q) => {
                            if(fastSbcStats == "add"){
                                info.base.fastsbc[fastSbcName] = fastSbcNeedInfo;
                            }else{
                                delete info.base.fastsbc[fastSbcName];
                            }
                            cntlr.current().getRootNavigationController().navigationBar.primaryButton._tapDetected(this);
                            events.notice([`notice.${fastSbcStats}fastsbc`,e.name],0);
                        },
                        fastSbcStats == "add" ? "call-to-action" : ""
                    )
                    this._fsuSbcEdit = fastSbcEditBtn;
                    this._btnSquadBuilder.__root.after(this._fsuSbcEdit.__root);
                }


                if(!this._fsuAutoFill && info.set.sbc_autofill){
                    let b = events.createButton(
                        new UTStandardButtonControl(),
                        fy("autofill.btntext"),
                        (e) => {
                            let pl = [],gtb = [];
                            //24.16 排除球员配置按钮：一键填充严格模式应用
                            if(!info.build.strictlypcik && events.isEligibleForOneFill(e._gf)){
                                let criteriaNumber = e._gf[0].c + e._gf[1].c;
                                let gf = {rs:JSON.parse(JSON.stringify(e._gf[0].t.rs))};
                                gf = events.ignorePlayerToCriteria(gf);
                                pl = events.getItemBy(2,gf,repositories.Item.getUnassignedItems()).slice(0,criteriaNumber);
                            }else{
                                for (let i of e._gf) {
                                    let gf = JSON.parse(JSON.stringify(i.t));
                                    gf = events.ignorePlayerToCriteria(gf);
                                    if(gtb.length){
                                        gf["NEdatabaseId"] = gtb;
                                    }
                                    gf["lock"] = false;
                                    let z = events.getItemBy(2,gf,repositories.Item.getUnassignedItems()).slice(0,i.c);
                                    console.log(z)
                                    gtb = gtb.concat(z.map( i => {return i.databaseId}))
                                    pl = pl.concat(z)
                                }
                            }
                            if(pl.length){
                                events.playerListFillSquad(e._parent,pl,2);
                            }else{
                                e.setInteractionState(0)
                                events.notice("notice.noplayer",2)
                            }
                        },
                        "mini call-to-action"
                    )
                    b.__root.style.width = '100%';
                    b.__root.style.marginTop = '.675rem';
                    b._gf = gf;
                    b._parent = e;
                    this._fsuAutoFill = b;
                    this._challengeDetails._requirements.__root.appendChild(this._fsuAutoFill.__root);

                    if(events.isEligibleForOneFill(gf)){
                        this._fsuAutoFill.tipsType = 1;
                    }else if(_.size(gf) == 1){
                        if(gf[0].t.rs == 2){
                            this._fsuAutoFill.tipsType = 2;
                        }else{
                            this._fsuAutoFill.tipsType = 3;
                        }
                    }
                    events.sbcFilterTipsGenerate("_fsuAutoFill",this,3);
                    this._fsuIgnore.show();
                    events.sbcFilterTipsGenerate("_fsuIgnore",this,2);
                }
            }else if(!this._fsuDupFill && info.set.sbc_dupfill && repositories.Item.getUnassignedItems().length){
                let b = events.createButton(
                    new UTStandardButtonControl(),
                    fy("dupfill.btntext"),
                    (e) => {
                        const dupIds = _.map(
                            _.filter(repositories.Item.getUnassignedItems(),
                                p => p.isDuplicate() && p.isPlayer() && !p.isLimitedUse()
                            ),
                            'duplicateId'
                        );
                        let gf = {
                            id:dupIds,
                            lock:false
                        }
                        gf = events.ignorePlayerToCriteria(gf);
                        let up = events.getItemBy(2,gf);
                        if(up.length){
                            if(repositories.Item.getUnassignedItems().filter(i => {return i.duplicateId}).length > up.length){
                                events.notice("notice.dupfilldiff",1)
                            }
                            const slotPlayer = b._parent.squad.getPlayers().filter(slot => slot.item.id !== 0).map(slot => slot.item);
                            events.playerListFillSquad(e._parent,slotPlayer.concat(up),1)
                        }else{
                            e.setInteractionState(0)
                            events.notice("notice.noplayer",2)
                        }
                    },
                    "mini call-to-action"
                )
                b.__root.style.width = '100%';
                b.__root.style.marginTop = '.675rem';
                b._parent = e;
                this._fsuDupFill = b;
                this._challengeDetails._requirements.__root.appendChild(this._fsuDupFill.__root);
                this._fsuIgnore.show();
            }
            if(info.set.sbc_dupfill && this._fsuDupFill && !repositories.Item.getUnassignedItems().length){
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
                        fillRating = events.needRatingsCount(e._target,e._parent.squad),
                        inputText = fy(va ? "squadcmpl.placeholder" : "squadcmpl.placeholder_zero");

                        if(fillRating.length && fillRating[0].lackRatings.length == 0 && fillRating[0].ratings.length && e._target){
                            inputText = [fy("squadcmpl.placeholder"),fillRating.length == "0" && va == 0 ? "" : fillRating[0].ratings.join(`,`)];
                        }

                        if(isExact){
                            inputText = [fy("squadcmpl.placeholder"), targetRting.toString()];
                        }

                        let popupBtns = e._target && info.set.sbc_top ? [{ labelEnum: enums.UIDialogOptions.OK },{ labelEnum: 44401 },{ labelEnum: enums.UIDialogOptions.CANCEL },] : false;
                        events.popup(
                            fy("squadcmpl.popupt"),
                            fy("squadcmpl.popupm"),
                            (t,i) => {
                                if(t === 2){
                                    let v = i.getValue() ,reg = /^\d{2}(\+|\-|-\d{2}|)(,\d{2}(\+|\-|-\d{2}|))*$/ ,a = [];
                                    if(reg.test(v)){
                                        a = v.split(',');
                                        events.showLoader();
                                        let p = events.getRatingPlayers(e._parent.squad,a);
                                        events.playerListFillSquad(e._parent,p,2)
                                    }else if(v == ""){
                                        events.showLoader();
                                        let p = events.getRatingPlayers(e._parent.squad,[]);
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
                        if(fillRating.length && fillRating[0].ratings.length && fillRating[0].lackRatings.length == 0){
                            events.notice(["squadcmpl.simulatedsuccess",`${e._target}`,`${fillRating[0].existValue.toLocaleString()}`],0)
                        }else if(va && !isExact){
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
                events.sbcFilterTipsGenerate("_fsuSquadCmpl",this,4);
                this._fsuIgnore.show();
                events.sbcFilterTipsGenerate("_fsuIgnore",this,2);
            }
            if(needChem){
                if("_fsuAutoFill" in this){
                    this._fsuAutoFill.hide();
                }
                if("_fsuDupFill" in this){
                    this._fsuDupFill.hide();
                }
                events.sbcFilterTipsGenerate("_fsuSquadCmpl",this,1);
            }
        }

        //24.18 挑选和填充额外文字显示：事件
        events.sbcFilterTipsGenerate = (elementName,target,type,mode) => {
            let writeMode = 0;
            if(target.getRootElement().querySelector(`.fsu-filtertips_${type}`) == null){
                writeMode = 1;
            }else if(target.getRootElement().querySelector(`.fsu-filtertips_${type}`) !== null && mode && mode == 1){
                writeMode = 2;
            }
            if(elementName in target && writeMode){
                let text = "";
                if(type == 1){
                    text = fy("sbc.onlycmpltext");
                }else if(type == 2){
                    const options = ["ignorepos","untradeable","league","flag","academy"],optionsResult = [];
                    const optionsTextMap = {
                        league: () => fy([`builder.league.short`, info.set.shield_league.length]),
                        flag: () => fy([`builder.flag.short`, info.set.shield_flag.length]),
                        default: (i) => fy(`builder.${i}.short`)
                    };
                    _.forEach(options,i => {
                        if(info.build[i]){
                            const textFunc = optionsTextMap[i] || optionsTextMap.default;
                            optionsResult.push(textFunc(i));
                        }
                    })
                    if(optionsResult.length){
                        text = `${optionsResult.join("、")}`
                    }
                }else if(type == 3){
                    text = "";
                    if(_.has(target[elementName],"tipsType")){
                        let optionsResult = [];
                        let tipsType = target[elementName].tipsType;
                        if(tipsType < 3){
                            optionsResult.push(fy(["builder.goldenrange.short",info.set.goldenrange]))
                        }
                        if(tipsType == 1 && info.build.strictlypcik){
                            optionsResult.push(fy("builder.strictlypcik.short"))
                        }
                        if(info.build.firststorage){
                            optionsResult.push(fy("builder.firststorage.short"))
                        }
                        if(optionsResult.length){
                            text = optionsResult.join("、");
                        }
                    }
                }else if(type == 4){
                    let optionsResult = [];
                    if(info.build.comprange){
                        optionsResult.push(fy([`builder.comprange.short`,info.set.goldenrange]));
                    }
                    if(info.build.comprare){
                        optionsResult.push(fy(`builder.comprare.short`));
                    }
                    if(info.build.firststorage){
                        optionsResult.push(fy(`builder.firststorage.short`));
                    }
                    if(optionsResult.length){
                        text = optionsResult.join("、");
                    }
                }
                if(writeMode == 1){
                    let tipsElement = events.createElementWithConfig("div", {
                        textContent:text,
                        classList:[`fsu-filtertips_${type}`],
                        style:{
                            textAlign:"center",
                            fontSize:"80%"
                        }
                    })
                    target[elementName].getRootElement().parentNode.insertBefore(tipsElement, target[elementName].getRootElement().nextSibling);
                }else if(writeMode == 2){
                    target.getRootElement().querySelector(`.fsu-filtertips_${type}`).innerText = text;
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
                                let baseFitIndex = squadBuild.findBestFitByPosition(e,substitute)
                                return baseFitIndex == -1 ? null : substitute.splice(baseFitIndex,1)[0];
                            }
                        }else{
                            return null;
                        }
                    }
                }
            })
            events.loadPlayerInfo(playerlist)
            events.saveSquad(challenge,challenge.squad,playerlist,[]);
            //events.hideLoader();
            events.saveOldSquad(challenge.squad,false);

        }
        //阵容智能填充
        events.getTemplate = async function(e,type,sId){
            e.setInteractionState(0);
            let squadPos = e.challenge.squad.getFieldPlayers().map(i => { return i.isBrick() ? null : i.getGeneralPosition()});
            events.showLoader();
            events.changeLoadingText("loadingclose.template1");
            info.run.template = true;
            events.notice("notice.templateload",1);
            let planCount = 0;
            let resultSquad = [];
            let resultCount = 0;
            let resultValue = 0;
            let resultId = 0;
            let refePlan = [];
            if(type == 1){
                let list = await events.getFutbinSbcSquad(e.challenge.id,type);

                //25.04 剔除掉likes低于0的方案
                list = _.filter(list,i => i.likes >= 0);

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
                if(!info.run.template){return};
                let planSquad = await events.getFutbinSbcSquad(planId,type == 1 ? 2 : type);
                if(!planSquad){
                    continue;
                }
                let ownedPlayer = 0;
                let surplusValue = 0;
                let createSquad = new Array(11);
                let copySquadPos = JSON.parse(JSON.stringify(e.challenge.squad.getFormation().generalPositions));
                for (let i = 0; i < createSquad.length; i++) {
                    let posIndex = i;

                    if(type !== 3){
                        if(_.has(info.formation,planSquad.Formation)){
                            posIndex = copySquadPos.lastIndexOf(info.formation[planSquad.Formation][i]);
                            copySquadPos[posIndex] = null;
                        }
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
            if(!info.run.template){return};
            await events.saveSquad(e.challenge,e.challenge.squad,resultSquad);

            events.loadPlayerInfo(resultSquad);

            events.saveOldSquad(e.challenge.squad,false);

            //24.18 批量购买假想球员：填充完判断展示按钮
            if(_.size(_.filter(resultSquad,"concept")) && !isPhone()){
                cntlr.right().getView()._fsuBIB.show();
            }
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
                            if(isPhone() && cntlr.current().className == "UTSBCSquadDetailPanelViewController"){
                                setTimeout(() => {
                                    cntlr.current().parentViewController._eBackButtonTapped()
                                },500);
                            }
                            events.notice("notice.templatesuccess",0);
                            let view = isPhone() ? cntlr.current() : cntlr.left();
                            if(view){
                                console.log(view.getView()._interactionState)
                                if(!view.getView()._interactionState){
                                    view.getView().setInteractionState(!0)
                                }
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

        //24.18 修改请求fut阵容链接报错提示
        events.getFutbinSbcSquad = async(id,type) => {
            let platform = info.base.platform == "pc" ? "PC" : "PS";
            let url = type == 1 ? `https://www.futbin.org/futbin/api/getChallengeTopSquads?chal_id=${id}&platform=${platform}` : type == 2 ? `https://www.futbin.org/futbin/api/getSquadByID?squadId=${id}&platform=${platform}` : `https://www.fut.gg/api/squads/${id}`;

            try {
                const futBinResponse = await events.externalRequest("GET",url);
                const data = JSON.parse(futBinResponse)[type == 2 ? "squad_data" : "data"];
                if(data){
                    //25.02 获取futbin阵容数据后进行价格缓存
                    //25.04 修复价格错误导致的阵容无法被加载
                    if(type == 2){
                        _.map(data,(i,k) => {
                            if(_.includes(k,"cardlid")){
                                let p = i.price !== -1 && i.price ? i.price : 0;
                                info.roster.data[i.playerid] = {
                                    "n": p,
                                    "t": p.toLocaleString()
                                }
                            }
                        })
                    }
                    return data;
                }else{
                    events.notice("notice.squaderror",2);
                    events.hideLoader();
                    return false;
                }
            } catch (error) {
                events.notice(fy("notice.loaderror") + error,2);
                if(document.querySelector(".ut-click-shield").classList.contains("showing")){
                    events.hideLoader()
                }
                throw error;
            }
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
        events.playerToAuction = async (d,p,time) =>{
            let i = services.Item.itemDao.itemRepo.transfer.get(d) || services.Item.itemDao.itemRepo.unassigned.get(d) || services.Item.itemDao.itemRepo.club.items.get(d);
            let t = services.Item.itemDao.itemRepo.transfer._collection.hasOwnProperty(d);
            if(i){

                //25.13 读取futbin最新的价格
                try {
                    await events.getPriceForFubin(i.definitionId)
                }catch(error) {
                    return;
                }
                const price = events.getCachePrice(i.definitionId,1);

                if((repositories.Item.getPileSize(ItemPile.TRANSFER) - repositories.Item.numItemsInCache(ItemPile.TRANSFER) > 0 || t) && price){
                    await events.playerGetLimits(i);
                    if(i.hasPriceLimits()){
                        if(p < i._itemPriceLimits.minimum || p > i._itemPriceLimits.maximum){
                            events.notice(["notice.auctionlimits",i._staticData
                            .name],2)
                            return;
                        }
                    }
                    let lp = UTCurrencyInputControl.getIncrementBelowVal(price);
                    await services.Item.list(i,lp,price,time * 3600).observe(cntlr.current(), async (e,t) => {
                        if (e.unobserve(cntlr.current()),t.success){
                            events.notice(["notice.auctionsuccess",i._staticData.name,price],0)
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
            call.selectClub.updata.call(this,t)
            //填充状态重置为0判断
            if(this.parentViewController._fsuFillType){
                if(this.parentViewController._fsuFillType%2){
                    this.parentViewController._fsuFillType++;
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
            "submit":UTSBCSquadOverviewViewController.prototype._submitChallenge,
            "requirements":UTSBCChallengeRequirementsView.prototype.renderChallengeRequirements
        }



        //SBC阵容默契读取程序
        //24.18 增加最低评分选项
        //24.19 增加任意版本组选项
        UTSBCChallengeRequirementsView.prototype.renderChallengeRequirements = function(n, r) {
            call.squad.requirements.call(this,n,r)
            setTimeout(() => {
                if(cntlr.current().className.includes("UTSBCSquad")){
                    let view = this;
                    let ratingEligibility = n.eligibilityRequirements.filter((i) => i.getFirstKey() == SBCEligibilityKey.TEAM_RATING);
                    let requests = [];
                    n.eligibilityRequirements.forEach(function(item,index){
                        let eKey = item.getFirstKey();
                        let eValue = item.getValue(eKey);
                        let criteria = {};
                        let requestObject = {};
                        switch (eKey) {
                            case SBCEligibilityKey.CLUB_ID:
                                let teamId = [];
                                let teamLinks = repositories.TeamConfig.teamLinks.toJSON();
                                _.map(eValue,tId => {
                                    let tLinks = _.find(Object.values(teamLinks), pair => pair.includes(tId));
                                    if(tLinks){
                                        teamId.push(...tLinks);
                                    }else{
                                        teamId.push(tId);
                                    }
                                })
                                criteria.teamId = teamId;
                                break;
                            case SBCEligibilityKey.LEAGUE_ID:
                                criteria.leagueId = eValue;
                                break;
                            case SBCEligibilityKey.NATION_ID:
                                criteria.nationId = eValue;
                                break;
                            case SBCEligibilityKey.PLAYER_RARITY:
                                criteria.rareflag = eValue;
                                break;
                            case SBCEligibilityKey.PLAYER_MIN_OVR:
                                criteria.GTrating = eValue;
                                break;
                            case SBCEligibilityKey.PLAYER_RARITY_GROUP:
                                criteria.groups = eValue;
                                break;
                            case SBCEligibilityKey.PLAYER_EXACT_OVR:
                                criteria.rating = eValue;
                                break;
                            default:
                                break;
                        }
                        if(Object.keys(criteria).length >= 1 && "__requirements" in view){
                            if(ratingEligibility.length && !_.has(criteria,"GTrating")){
                                const eRating = ratingEligibility[0].getFirstValue(SBCEligibilityKey.TEAM_RATING);
                                if(eRating >= info.set.goldenrange){
                                    criteria.GTrating = eRating - 10;
                                }
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
                    if(requests.length && n.squad){
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
                            cntlr.current().parentViewController._eBackButtonTapped()
                        },500);
                    }
                }
            }
        }
        events.getRatingPlayers = (squad,ratings) => {
            const assignPlayer = (playerlist, shortlist, Exclusionlist, index, pos) => {
                const player = pos !== null ? _.find(shortlist, item => item.basePossiblePositions.includes(pos)) : _.head(shortlist);
                if (player) {
                    playerlist[index] = player;
                    shortlist = _.without(shortlist, player);
                    Exclusionlist.push(player.databaseId);
                }
                return shortlist;
            };

            const buildExclusionList = (players) => {
                return players
                    .map(i => i.item.rating && !i.item.concept ? i.item.databaseId : null)
                    .filter(Boolean);
            };

            const buildConceptConfig = (fieldPlayers) => {
                const conceptConfig = {};
                _.forEach(fieldPlayers, i => {
                    if (i.item.concept) {
                        const rating = i.item.rating;
                        if (!conceptConfig[rating]) {
                            conceptConfig[rating] = { pos: [], index: [] };
                        }
                        conceptConfig[rating].pos.push(i.generalPosition);
                        conceptConfig[rating].index.push(i.index);
                    }
                });
                return conceptConfig;
            };

            const processRatings = (ratingsList, squadVacancy) => {
                const fillConfig = {};
                let completeRatingsList = [];

                const processRating = (rating) => {
                    if (squadVacancy.length) {
                        const headVacancy = _.head(squadVacancy);
                        squadVacancy = _.tail(squadVacancy);

                        if (!fillConfig[rating]) {
                            fillConfig[rating] = {
                                pos: [],
                                index: [],
                                rat: parseInt(rating, 10)
                            };
                        }

                        fillConfig[rating].pos.push(headVacancy.generalPosition);
                        fillConfig[rating].index.push(headVacancy.index);
                    }
                };

                if (ratingsList.length === 1) {
                    completeRatingsList = _.fill(Array(squadVacancy.length), ratingsList[0]);
                } else {
                    completeRatingsList = ratingsList;
                }

                _.forEach(completeRatingsList, processRating);

                return fillConfig;
            };

            const processFillConfig = (fillConfig, criteria, Exclusionlist, playerlist) => {
                _.forEach(fillConfig, (v, k) => {
                    const need = _.cloneDeep(criteria);
                    need.NEdatabaseId = Exclusionlist;
                    const ratingKey = k.includes('+') ? 'GTrating' : k.includes('-') ? 'LTrating' : 'rating';
                    need[ratingKey] = v.rat;

                    let shortlist = events.getItemBy(2, need, repositories.Item.getUnassignedItems());

                    _.forEach(v.index, (i, s) => {
                        if (shortlist.length) {
                            const pos = info.build.ignorepos ? null : v.pos[s];
                            shortlist = assignPlayer(playerlist, shortlist, Exclusionlist, i, pos);
                        }
                    });
                });
            };

            const playerlist = _.map(squad.getPlayers(), "item");
            const ratingsList = ratings ? Array.from(ratings) : [];
            const Exclusionlist = buildExclusionList(squad.getPlayers());
            const criteria = events.ignorePlayerToCriteria({ NEdatabaseId: Exclusionlist, lock: false });

            const conceptConfig = buildConceptConfig(squad.getFieldPlayers());

            _.forEach(conceptConfig, (v, k) => {
                const need = _.cloneDeep(criteria);
                need.rating = Number(k);
                need.NEdatabaseId = Exclusionlist;

                let shortlist = events.getItemBy(2, need, repositories.Item.getUnassignedItems());

                _.forEach(v.index, (i, s) => {
                    if (shortlist.length) {
                        const pos = info.build.ignorepos ? null : v.pos[s];
                        shortlist = assignPlayer(playerlist, shortlist, Exclusionlist, i, pos);
                    }
                });
            });

            if (ratingsList.length) {
                const squadVacancy = _.filter(squad.getPlayers(), i => !i.isValid());
                const fillConfig = processRatings(ratingsList, squadVacancy);

                criteria.os = [
                    info.build.comprare && 1,
                    info.build.comprange && 2
                ].filter(Boolean);

                if (_.size(fillConfig)) {
                    processFillConfig(fillConfig, criteria, Exclusionlist, playerlist);
                }
            }

            console.log(playerlist);
            return playerlist;

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
                                            cntlr.current().nUnassignedItemAdded()
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

        //** 25.21 移除包名多余字符 */
        events.truncateStrict = (text, maxLength = 26, tail = '...') => {
            let width = 0;
            let result = '';
            for (const ch of text) {
                width += ch.charCodeAt(0) > 255 ? 2 : 1;
                if (width > maxLength - tail.length) {
                    return result + tail;
                }
                result += ch;
            }
            return result;
        };
        UTStoreView.prototype.setPacks = function(e, t, i, o) {
            
            //** 25.21 包排重加载 */
            const HideAndShow = this.getStoreCategory() == 'mypacks';
            let showList = [];
            if(HideAndShow){
                const packList = [];
                this._fsuPacks = {};
                for (const ep of e) {
                    if(packList.every((plp) => plp.id !== ep.id)){
                        packList.push(ep);
                        const name = services.Localization.localize(ep.packName)
                        this._fsuPacks[ep.id] = {
                            packId:ep.id,
                            count:1,
                            isPlayers:ep.contentType == 'players',
                            name:events.truncateStrict(name),
                            fullName:name,
                            value:events.getOddo(ep.id)
                        };
                    }else{
                        this._fsuPacks[ep.id].count++;
                    }
                }
                showList = _.orderBy(packList, item => events.getOddo(item.id), info.myPacksSort);
            }else{
                const ONE_DAY = 86400; // 秒
                const now = Math.floor(Date.now() / 1000);

                const sorted = _.orderBy(e, [
                    item => !item.getPrice(GameCurrency.POINTS) && item.getPrice(GameCurrency.COINS) && item.id !== 101,
                    item => item.start && now - item.start <= ONE_DAY,
                    item => 'previewCreateTime' in item,
                    item => {
                        const price = item.getPrice(GameCurrency.COINS) || 1;
                        return events.getOddo(item.id) / price;
                    }
                ], ['desc', 'desc', 'desc', 'desc']);
                showList = sorted;
            }
            call.other.store.setPacks.call(this, showList, t, i, o)

            setTimeout(() => {
                let packTileExists = "_fsuPackTile" in this,
                SBCTileExists = "_fsuSBCTile" in this,
                packFilter = "_fsufilter" in this,
                unassignedTile = "_fsuUnassignedTile" in this,
                itemListElement = this.__itemList,
                unassignedItems = repositories.Item.getUnassignedItems().length;
                this.storePacks.forEach((item) => {
                    const packCoin = events.getOddo(item.articleId);
                    const itemElement = item.getRootElement();
                    if(packCoin && !itemElement.querySelector(".fsu-packprice")){
                        let packCoinBox = document.createElement("p");
                        packCoinBox.classList.add("ut-store-pack-details-view--description","currency-coins","fsu-packprice");
                        packCoinBox.textContent = `${fy("returns.text")}${packCoin.toLocaleString()}`;
                        let packData = repositories.Store.getArticle(item.articleId);
                        if(packData){
                            if(packData.getPrice(GameCurrency.COINS)){
                                let packDiff = Math.round((packCoin/packData.getPrice(GameCurrency.COINS)-1)*100);
                                let packDiffElement = document.createElement("span");
                                packDiffElement.style.paddingLeft = ".3em";
                                if(packDiff > 0){
                                    packDiffElement.style.color = "#36b84b"
                                    packDiffElement.textContent = `(+${packDiff}%)`
                                }else{
                                    packDiffElement.style.color = "#d21433"
                                    packDiffElement.textContent = `(${packDiff}%)`
                                }
                                packCoinBox.appendChild(packDiffElement);
                            }
                        }
                        let packExtraInfo = events.createElementWithConfig("div", {
                            style:{
                                display:isPhone() ? "block" : "flex",
                                justifyContent:"space-between",
                                alignItems:"center",
                            }
                        })
                        packExtraInfo.appendChild(packCoinBox)
                        item._fsuExtraInfo = packExtraInfo;
                        item.__articleDesc.after(item._fsuExtraInfo)
                        let packInfoBox = events.createElementWithConfig("div", {
                            style:{
                                position:"absolute",
                                bottom:"0",
                                backgroundColor:"rgb(0 0 0 / 60%)",
                                width:"100%",
                                textAlign:"center",
                                padding:".2rem 0",
                                color:"#ffffff",
                                fontSize:"1rem",
                            }
                        });
                        let packInfoTitle = events.createElementWithConfig("div", {
                            textContent:_.replace(_.replace(fy("returns.text"),":",""),"：","")
                        });
                        packInfoBox.appendChild(packInfoTitle)
                        let packInfoCoin = events.createElementWithConfig("div", {
                            classList: ['currency-coins'],
                            textContent:packCoin.toLocaleString()
                        });
                        packInfoBox.appendChild(packInfoCoin);
                        if(_.has(item,"_pack")){
                            item._pack.getRootElement().appendChild(packInfoBox);
                        }
                    }
                    let packItem = _.cloneDeep(repositories.Store.catalogArticles.get(item.articleId) || _.find(repositories.Store.myPacks.values(), { id: item.articleId }));
                    
                    if(!packItem.odds.length){
                        packItem.odds = _.cloneDeep(repositories.Store.catalogArticles.get(301).odds)
                    }
                    if(packCoin && !itemElement.querySelector(".fsu-trypack")){itemElement
                        let f = events.createButton(
                            new UTCurrencyButtonControl(),
                            fy("trypack.button.text"),
                            (e) => {
                                e.setInteractionState(0);
                                events.showLoader();
                                events.tryPack(packItem);
                                setTimeout(() => {
                                    e.setInteractionState(1);
                                }, 2000);
                            },
                            "fsu-trypack"
                        )
                        f.setSubText(fy("trypack.button.subtext"))
                        item._fsuTryPack = f;
                        item._fsuTryPackBox = document.createElement("div");
                        item._fsuTryPackBox.classList.add("fsu-trypack-box");
                        item._fsuTryPackBox.append(item._fsuTryPack.__root);
                        let parentElement = item.getRootElement().querySelector(".ut-store-pack-details-view--pack-counts");
                        parentElement.style.position = "relative";
                        parentElement.append(item._fsuTryPackBox)
                    }
                    if(packCoin && !itemElement.querySelector(".fsu-raelprod")){
                        let rp = events.createButton(
                            new UTStandardButtonControl(),
                            fy("realprob.btn"),
                            (e) => {
                                e.setInteractionState(0);
                                events.showLoader();
                                events.raelProbability(packItem);
                                setTimeout(() => {
                                    e.setInteractionState(1);
                                }, 2000);
                            },
                            "fsu-raelprod mini"
                        )
                        rp.getRootElement().style.height = "2rem";
                        rp.getRootElement().style.lineHeight = "2rem";

                        if(isPhone()){
                            rp.getRootElement().style.width = "100%";
                            rp.getRootElement().style.marginBottom = "1rem";
                        }

                        item._fsuRealProd = rp;
                        item._fsuExtraInfo.appendChild(item._fsuRealProd.getRootElement())
                    }
                    if(HideAndShow){
                        const packInfo = this._fsuPacks[item.articleId];
                        if(!itemElement.querySelector(".fsu-packcount")){
                            itemElement.style.position = "relative";
                            let packCount = events.createElementWithConfig("div", {
                                textContent:packInfo.count,
                                classList: ['ut-tab-bar-item-notif','fsu-packcount'],
                                style:{
                                    position:"absolute",
                                    top:"1.4rem",
                                    right:"1rem",
                                    width:"1.6rem",
                                    height:"1.6rem",
                                    textAlign:"center",
                                    fontSize:"1.2rem",
                                    lineHeight:"1.7rem",
                                    zIndex:"1",
                                }
                            });
                            itemElement.appendChild(packCount)
                        }
                        if(packInfo.isPlayers && packInfo.count > 1 && !itemElement.querySelector(".fsu-bulkopen")){
                            //25.21 批量开包按钮
                            let bulkOpenBtn = events.createButton(
                                new UTCurrencyButtonControl(),
                                fy("openpack.storebtn.text") + ` (${packInfo.count})`,
                                (e) => {
                                    //带弹窗的数量选择，此处移除
                                    //events.openPacksConfirmPopup(item.articleId, packInfo.fullName, packInfo.count)
                                    events.showLoader();
                                    events.openPacks(item.articleId, packInfo.fullName, packInfo.count);
                                },
                                "fsu-bulkopen call-to-action"
                            )
                            bulkOpenBtn.__currencyLabel.textContent = fy("openpack.storebtn.subtext")
                            item.__articleActionContainer.prepend(bulkOpenBtn.getRootElement())
                            item.__articleActionContainer.style.gap = "1rem";
                        }
                    }
                })

                if(packFilter){
                    if(HideAndShow && _.size(this._fsuPacks)){
                        this._fsufilter.style.display = "flex";
                        let filterOptionId = this._fsufilterOption.getId();
                        let filterOptionArray = [];
                        let tradeableCount = this.__itemList.querySelectorAll(".is-tradeable").length;
                        let packTotal = _.sumBy(_.values(this._fsuPacks), 'count');
                        let packValue = _.sum(_.map(this._fsuPacks,(i) => { return i.count * i.value}));
                        filterOptionArray.push(new UTDataProviderEntryDTO(-1,-1,fy(`sbc.filter0`)))
                        filterOptionArray.push(new UTDataProviderEntryDTO(0,0,fy([`packfilter.total`,packTotal,packValue.toLocaleString()])))
                        if(tradeableCount){
                            filterOptionArray.push(new UTDataProviderEntryDTO(1,1,`${fy(`pack.filter0`)} × ${tradeableCount}`))
                        }
                        for (const value of _.orderBy(this._fsuPacks,"value",info.myPacksSort)) {
                            const dto = new UTDataProviderEntryDTO(Number(value.packId),Number(value.packId),`${value.name} × ${value.count}`)
                            filterOptionArray.push(dto);
                        }

                        this._fsufilterOption.setOptions(filterOptionArray);
                        if(filterOptionId in this._fsuPacks){
                            this._fsufilterOption.setIndexById(filterOptionId)
                        }else{
                            this._fsufilterOption.setIndexById(filterOptionId == 1 ? 1 : -1)
                        }
                    }else{
                        this._fsufilter.style.display = "none";
                    }
                }else{
                    if(_.size(this._fsuPacks)){
                        let filterOption = new UTDropDownControl();
                        filterOption.init();
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

                        //25.21 包排序按钮添加
                        let packsSortBtn = events.createButton(
                            new UTStandardButtonControl(),
                            ``,
                            (e) => {
                                info.myPacksSort = info.myPacksSort === "desc" ? "asc" : "desc";
                                const isDesc = info.myPacksSort == "desc";
                                const iconElement = e.getRootElement().querySelector(".fut_icon");
                                iconElement.className = "fut_icon";
                                iconElement.classList.add(isDesc ? "icon_arrow" : "icon_chevron");
                                GM_setValue("packsSort",info.myPacksSort);
                                events.notice(fy(["packssort.switch.notice",services.Localization.localize("store.group.mypacks"),fy(`sort.${info.myPacksSort}`)]),0);
                                cntlr.current().getStorePacks();
                            },
                            "mini"
                        )
                        let packsSortBtnIcon = events.createElementWithConfig("span",{
                            classList:["fut_icon",info.myPacksSort === "desc" ? "icon_arrow" : "icon_chevron"]
                        })
                        packsSortBtn.getRootElement().style.marginLeft = "1rem";
                        packsSortBtn.getRootElement().appendChild(packsSortBtnIcon);
                        this._fsufilter.appendChild(packsSortBtn.getRootElement());


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
                //events.writePackReturns(this.storePacks)
            }, 50)
        }
        events.writePackReturns = async(packs) => {
            let ids = _.uniqBy(cntlr.current().getView().storePacks, 'articleId').map(item => item.articleId);
        }

        /** 25.18 SBC整体需求计算 **/
        events.sbcListNeedCount = (needRatings,sbcTitle) => {

            let ratings = [];
            let criteria = {lock:false};
            criteria = events.ignorePlayerToCriteria(criteria);
            delete criteria.firststorage;

            let playersOriginal = _.map(events.getItemBy(2,criteria), 'rating');
            let playersCount = _.countBy(playersOriginal);

            console.log(playersCount)


            _.forEach(needRatings, (value) => {
                let results = events.needRatingsCount(value,false,ratings)
                ratings = _.concat(ratings,results[0].ratings)
            })
            let ratingsCount = _.countBy(ratings);
            let sbcNeeds = [];
            let downloadList = [];
            _.forEach(ratingsCount,(value,key) => {
                let hold = playersCount[key] || 0;
                let coverage = hold >= value ? value : hold;
                let lack = value - coverage;
                let lackValue = lack * info.base.price[key];
                sbcNeeds.unshift({
                    "rating":key,
                    "coverage":coverage,
                    "lack":lack,
                    "lackValue":lackValue,
                    "need":value
                })
                downloadList.unshift(`${key} : ${lack}`)
            })
            const total = sbcNeeds.reduce(
                (acc, item) => {
                    acc.coverage += item.coverage || 0;
                    acc.lack += item.lack || 0;
                    acc.lackValue += item.lackValue || 0;
                    acc.need += item.need || 0;
                    return acc;
                },
                { coverage: 0, lack: 0, lackValue: 0, need: 0 }
            );

            sbcNeeds.unshift({
                rating: fy("sbcneedslist.total"),
                ...total, // 将计算结果展开
            });
            console.log(sbcNeeds)

            events.hideLoader()

            /** 开始绘制弹窗 */
            let mp = new EADialogViewController({
                dialogOptions: [{ labelEnum: 44410 },{ labelEnum: enums.UIDialogOptions.OK }],
                message: fy(`sbcneedslist.popupm`),
                title: fy(`sbcneedslist.popupt`),
                type: EADialogView.Type.MESSAGE
            });
            mp.init();
            mp.onExit.observe(mp,(e, z) => {
                e.unobserve(mp);
                if(z == 44410){
                    const content = downloadList.join('\n');
                    const blob = new Blob([content], { type: 'text/plain' });


                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `${sbcTitle} - Need Ratings List.txt`;

                    link.click();
                    URL.revokeObjectURL(link.href);
                }
            });
            gPopupClickShield.setActivePopup(mp);
            _.flatMap(mp.getView().dialogOptions,(v,i) => {
                if(v.__text.innerHTML == "*"){
                    v.setText(fy(`popupButtonsText.${mp.options[i].labelEnum}`))
                }
            })
            mp.getView().__msg.style.padding = "1rem";
            mp.getView().__msg.style.fontSize = "100%";

            let nBox = events.createElementWithConfig("div",{
                style:{
                    marginTop:"1rem"
                }
            })
            let nBoxTiltle = events.createElementWithConfig("div",{
                className:"fsu-sbcNeedsTitle"
            })
            _.times(5, (index) => {
                nBoxTiltle.appendChild(
                    events.createElementWithConfig("div",{
                        textContent:fy(`sbcneedslist.title_${index + 1}`)
                    })
                )
            });
            nBox.appendChild(nBoxTiltle);

            let nBoxBody = events.createElementWithConfig("div",{
                className:"fsu-sbcNeedsBody"
            })
            _.forEach(sbcNeeds,(item,index) => {
                let nBoxBodyItem = events.createElementWithConfig("div",{
                    className:"fsu-sbcNeedsBodyItem"
                })
                let needKeys = ["rating","need","coverage","lack","lackValue"];
                _.forEach(needKeys,(key) => {
                    nBoxBodyItem.appendChild(
                        events.createElementWithConfig("div",{
                            textContent:key == "lackValue" ? item[key].toLocaleString() : item[key],
                            className:key == "lackValue" ? "currency-coins" : ""
                        })
                    )
                })
                nBoxBody.appendChild(nBoxBodyItem)
            })
            nBox.appendChild(nBoxBody);
            mp.getView().__msg.appendChild(nBox);
        }
        //计算总评的公式
        events.needRatingsCount = (target,squad) => {
            let ratings = [];
            let brick = 0;
            let ratingId = [];

            if(squad){
                ratings = _.map(_.filter(squad.getFieldPlayers(),(i) => { return i.item.isValid()}),"item.rating");
                brick = squad.getAllBrickIndices().length;
                ratingId = _.map(_.filter(squad.getFieldPlayers(),(i) => { return i.item.isValid()}),"item.databaseId");
            }

            let criteria = {"NEdatabaseId":ratingId,lock:false},
                lackNumber = 11 - brick - ratings.length,
                basisRating = 0,
                fillNumber = 5;

            criteria = events.ignorePlayerToCriteria(criteria)
            let haveRatingsOriginal = _.map(events.getItemBy(2,criteria), 'rating');
            let haveRatingsCount = _.countBy(haveRatingsOriginal),
                haveRatings = _.uniq(haveRatingsOriginal).sort((a, b) => b - a);


            if(squad == false){
                haveRatings = _.range(99, 44, -1);
            }

            let lackSimulation = Array.from({length: haveRatings.length}, (_e, i) => Array.from({length: lackNumber}, () => haveRatings[i]));

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
            let sliceStart = _.indexOf(haveRatings, basisRating) - fillOffset;
            sliceStart < 0 ? sliceStart = 0 : sliceStart;
            let sliceEnd = _.indexOf(haveRatings, basisRating) + fillNumber - fillOffset;
            sliceEnd > haveRatings.length? sliceEnd = haveRatings.length : sliceEnd;
            let simulated = _.multicombinations(_.slice(haveRatings,sliceStart,sliceEnd), lackNumber),
                simulatedJson = [];
            _.forEach(simulated,(i,k) => {
                let simulatedCount = events.teamRatingCount(_.concat(ratings,i));
                if(simulatedCount >= target){

                    /** 25.18 填充评分计算重构适配阵容计算 **/
                    let existValue = 0;
                    let lackValue = 0;
                    let lackRatings = [];
                    let existRatings = [];
                    _.flatMap(_.countBy(i),(value, key) => {
                        let rating = parseInt(key),
                            ratingPrice = parseInt(info.base.price[rating]),
                            haveCount = squad == false ? value : haveRatingsCount[rating] || 0;

                        existRatings = _.concat(existRatings, _.times(haveCount, _.constant(rating)));

                        existValue += ratingPrice * (haveCount < value ? haveCount : value);
                        lackValue += haveCount < value ? ratingPrice * (value - haveCount) : 0;

                        if (haveCount < value) {
                            lackRatings = _.concat(lackRatings, _.times(value - haveCount, _.constant(rating)));
                        }
                    })
                    simulatedJson.push({
                        "ratings":i,
                        "sum":_.sum(i),
                        "existValue":existValue,
                        "existRatings":existRatings,
                        "lackValue":lackValue,
                        "lackRatings":lackRatings
                    })
                }
            })
            let sortedArray = _.orderBy(simulatedJson, ['lackValue', 'existValue', 'sum'], ['asc', 'asc', 'asc']);
            let top3Array = _.take(sortedArray, 3);
            return top3Array;
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

        //24.15 头部快捷入口：SBC列表插入最前方
        events.SBCListInsertToFront = (sbcId,type) => {
            if(info.set.sbc_headentrance && info.douagain.hasOwnProperty("SBCListHtml")){
                let SBCIndex = _.indexOf(info.douagain.SBCList, sbcId);
                if(SBCIndex != -1){
                    info.douagain.SBCList.splice(SBCIndex, 1);
                }
                if(type == 1){
                    info.douagain.SBCList.unshift(sbcId);
                }
                if(services.SBC.repository.sets.length){
                    info.douagain.SBCList = _.filter(info.douagain.SBCList,SBCId => !services.SBC.repository.getSetById(SBCId).isComplete());
                    info.douagain.SBCList = info.douagain.SBCList.slice(0, 8);
                    info.douagain.SBCListHtml.innerHTML = ""
                    //24.16 调整为读取配置显示入口数量
                    _.map(info.douagain.SBCList,(item,index) => {
                        let button = events.createButton(
                            new UTImageButtonControl(),
                            "",
                            (e) => {
                                events.goToSBC(services.SBC.repository.getSetById(Number(e.__root.getAttribute("data-SBCId"))));
                            },
                            ""
                        )
                        button.__root.setAttribute("data-SBCId",item);
                        let img = events.createElementWithConfig("img", {
                            style:{
                                height:"100%",
                                width:"auto"
                            }
                        })
                        img.setAttribute("src",AssetLocationUtils.getSquadBuildingSetImageUri(services.SBC.repository.getSetById(item).assetId));
                        button.getRootElement().appendChild(img);
                        if(index >= info.set.headentrance_number){
                            button.__root.style.display = "none";
                        }
                        info.douagain.SBCListHtml.appendChild(button.getRootElement())
                    })
                }
            }
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
                            let o = isPhone() ? new UTSBCChallengesViewController : new UTSBCGroupChallengeSplitViewController;
                            o.initWithSBCSet(SBCSetEntity),
                            i.pushViewController(o, !0)
                            i.setNavigationTitle(SBCSetEntity.name);
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
                if(repositories.Store.myPacks.values().filter(i => i.id == d.id).length > 1){
                    info.douagain.pack = d.id;
                }else{
                    if(!repositories.Store.myPacks.values().filter(i => i.id == info.douagain.pack).length){
                        info.douagain.pack = 0;
                    }
                }
            }
        }


        //一键填充需求生成程序
        //24.20 新插入程序用以手机端快捷按钮判定和快速任务
        events.oneFillCreationGF = (req,miss) => {
            let gf = [],gfall = {};
            _.map(req,i => {
                const fk = i.getFirstKey(), fv = i.getFirstValue(fk), gfs = {"t":{},"c":i.count};
                switch (fk) {
                    case SBCEligibilityKey.PLAYER_QUALITY:
                    case SBCEligibilityKey.PLAYER_LEVEL:
                        gfs.t["rs"] = fv - 1;
                        if (fk === SBCEligibilityKey.PLAYER_QUALITY) gfall["rs"] = fv - 1;
                        break;
                    case SBCEligibilityKey.PLAYER_RARITY:
                        gfs.t["rareflag"] = fv;
                        break;
                    case SBCEligibilityKey.PLAYER_RARITY_GROUP:
                        if (fv === 4) {
                            gfs.t["gs"] = true;
                            gfall["gs"] = false;
                        }
                        break;
                    case SBCEligibilityKey.PLAYER_MIN_OVR:
                        if (req.length === 1) gfs.t["GTrating"] = fv;
                        break;
                    default:
                        break;
                }
                if (!_.isEmpty(gfs.t)) gf.push(gfs);
            });
            if(gf.length){
                gf.sort((a, b) => b.c - a.c);
                //处理球员数量
                let ac = gf.filter(i => i.c == -1).length,gc = miss;
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
            _.map(req,r => {
                if(r.getFirstKey() == SBCEligibilityKey.TEAM_RATING){
                    gf = [];
                }
                if(r.getFirstKey() == SBCEligibilityKey.CHEMISTRY_POINTS){
                    gf = [];
                }
            })
            return gf;
        }

        //SBC任务是否有缓存检测
        events.isSBCCache = (id,cId) => {
            let SBCSetEntity = services.SBC.repository.getSetById(id);
            if(SBCSetEntity){
                events.fastSBC(id,cId)
            }else{
                console.log("执行任务的是否发现没有SBC数据！")
                services.SBC.requestSets().observe(cntlr.current(), function(e, t) {
                    if (e.unobserve(cntlr.current()),
                    t.success && JSUtils.isObject(t.data)) {
                        events.fastSBC(id,cId);
                    } else {
                        var r = t.error ? t.error.code : t.status;
                        NetworkErrorManager.checkCriticalStatus(r) ? NetworkErrorManager.handleStatus(r) : r === UtasErrorCode.SERVICE_IS_DISABLED && services.Configuration.setFeatureEnabled(UTServerSettingsRepository.KEY.SBC_ENABLED, !1)
                    }
                })
            }
        }
        //快速SBC
        //24.20 新插入程序快速完成指定 SBC
        events.fastSBC = async (id,cId) => {
            let controller = events.getCurrent(),
                view = controller.getView(),
                SBCSetEntity = services.SBC.repository.getSetById(id),
                challenge;
            events.showLoader();
            view.setInteractionState(!1);
            services.SBC.requestChallengesForSet(SBCSetEntity).observe(controller, (e, t) => {
                if (e.unobserve(controller),t.success && 0 < t.data.challenges.length){
                    challenge = t.data.challenges.find(challenge => challenge.id === cId),
                    services.SBC.loadChallenge(challenge).observe(controller, async (ee,tt) => {
                        if (ee.unobserve(controller),tt.success){
                            if(!SBCSetEntity.getChallenge(cId).squad){
                                SBCSetEntity.getChallenge(cId).update(challenge);
                            }
                            console.log(SBCSetEntity)
                            let oneFillNeed = info.base.fastsbc[`${cId}#${id}`];
                            if(oneFillNeed && Object.keys(oneFillNeed).length){
                                let fillPlayers = [];
                                if(!info.build.strictlypcik && events.isEligibleForOneFill(oneFillNeed)){
                                    let criteriaNumber = oneFillNeed[0].c + oneFillNeed[1].c;
                                    let tempFillNeed = {rs:JSON.parse(JSON.stringify(oneFillNeed[0].t.rs))};
                                    tempFillNeed = events.ignorePlayerToCriteria(tempFillNeed);
                                    tempFillNeed["lock"] = false;
                                    fillPlayers = events.getItemBy(2,tempFillNeed,repositories.Item.getUnassignedItems()).slice(0,criteriaNumber);
                                }else{
                                    let excludeId = [];
                                    for (let i of oneFillNeed) {
                                        let searchCriteria = JSON.parse(JSON.stringify(i.t));
                                        searchCriteria = events.ignorePlayerToCriteria(searchCriteria);
                                        if(excludeId.length){
                                            searchCriteria["NEdatabaseId"] = excludeId;
                                        }
                                        searchCriteria["lock"] = false;
                                        let searchResults = events.getItemBy(2,searchCriteria,repositories.Item.getUnassignedItems()).slice(0,i.c);
                                        console.log(_.map(searchResults,i => {return i._staticData.name + `_` + i.rating}))

                                        excludeId = excludeId.concat(searchResults.map( i => {return i.databaseId}))
                                        fillPlayers = fillPlayers.concat(searchResults)
                                    }
                                }
                                if(fillPlayers.length == challenge.squad.getNumOfRequiredPlayers()){
                                    events.playerListFillSquad(challenge,fillPlayers,1);
                                    if (challenge.canSubmit()){
                                        if (!services.Configuration.getFeatureSetting(UTServerSettingsRepository.KEY.SBC_ALLOW_UNTRADEABLE) && challenge.hasUntradeableItems()){
                                            utils.PopupManager.showAlert(utils.PopupManager.Alerts.SBC_UNTRADEABLE_NOT_ALLOWED);
                                        }else if(JSUtils.isValid(SBCSetEntity)){
                                            TelemetryManager.trackEvent(TelemetryManager.Sections.SBC, TelemetryManager.Categories.BUTTON_PRESS, "SBC - Submit Challenge");
                                            let t = services.UserSettings.getSBCValidationSkip();
                                            services.SBC.submitChallenge(challenge,SBCSetEntity,t,services.Chemistry.isFeatureEnabled()).observe(controller,(eee,ttt) => {
                                                eee.unobserve(controller);
                                                let newChallenge = SBCSetEntity.getChallenge(challenge.id);
                                                if (ttt.success && newChallenge) {
                                                    if(0 < newChallenge.awards.length){
                                                        var challengeRewards = new UTGameRewardsViewController(newChallenge.awards);
                                                        challengeRewards.init(),
                                                        challengeRewards.modalDisplayDimensions.width = "24em",
                                                        challengeRewards.getView().setSbcChallenge(newChallenge),
                                                        gPopupClickShield.setActivePopup(challengeRewards),
                                                        challengeRewards.onExit.observe(controller, function(e) {
                                                            e.unobserve(controller),
                                                            events.showRewardsView(SBCSetEntity)
                                                        })
                                                    }else{
                                                        ttt.data.setCompleted && events.showRewardsView(SBCSetEntity);
                                                    }
                                                    services.PIN.sendData(PINEventType.PAGE_VIEW, {
                                                        type: PIN_PAGEVIEW_EVT_TYPE,
                                                        pgid: "SBC - Rewards Overlay"
                                                    })
                                                    if(_.includes(controller.className, 'UTUnassignedItems')){
                                                        controller._fsuRefreshBtn._tapDetected();
                                                    }
                                                    if(_.includes(controller.className, 'UTSBCSquad')){
                                                        controller.getNavigationController().popViewController()
                                                    }
                                                    //24.23 在SBC页面完成刷新页面状态避免卡死
                                                    if(_.includes(controller.className, 'UTSBCHub')){
                                                        if(controller.getView()._interactionState == false){
                                                            console.log(`SBC页面状态卡死，给予纠正。`)
                                                            controller.getView().setInteractionState(true);
                                                        }
                                                        controller._requestSBCData()
                                                    }
                                                    //24.23 在SBC小组列表完成率先呢数据

                                                    if(_.includes(controller.className, 'UTSBCChallenges')){
                                                        controller.getView().setSBCSet(controller.sbcViewModel.sbcSet)
                                                        events.sbcSubPrice(controller.sbcViewModel.sbcSet.id,controller.getView())
                                                    }

                                                    events.SBCListInsertToFront(SBCSetEntity.id,1)
                                                    events.notice("fastsbc.success",0)
                                                }else{
                                                    if(ttt.status == 521){
                                                        events.notice("fastsbc.error_5",2)
                                                    }else{
                                                        services.Notification.queue([services.Localization.localize("notification.sbcChallenges.failedToSubmit"), UINotificationType.NEGATIVE])
                                                    }
                                                }
                                            })
                                        }
                                    }else{
                                        utils.PopupManager.showAlert(utils.PopupManager.Alerts.SBC_INELIGIBLE_SQUAD);
                                    }
                                }else{
                                    events.notice("fastsbc.error_3",2)
                                }
                            }else{
                                events.notice("fastsbc.error_1",2)
                            }
                        }else{
                            let errorCode = 1;
                            if(!SBCSetEntity.isComplete() && SBCSetEntity.challengesCount > 1 && challenge.isCompleted()){
                                errorCode == 2;
                            }

                            events.notice(`fastsbc.error_${errorCode}`,2)
                        }
                    });
                    events.hideLoader();
                }else if(NetworkErrorManager.checkCriticalStatus(t.status)){
                    NetworkErrorManager.handleStatus(t.status);
                    events.hideLoader();
                }else {
                    var a = (null === (i = t.error) || void 0 === i ? void 0 : i.code) === UtasErrorCode.SERVICE_IS_DISABLED ? "sbc.notification.disabled" : "notification.sbcChallenges.failedToLoad";
                    l.setInteractionState(!0),
                    services.Notification.queue([services.Localization.localize(a), UINotificationType.NEGATIVE])
                    events.hideLoader();
                }
            })
            view.setInteractionState(!0)
        }
        //根据类型获取当前的view和controller
        events.getCurrent = (type) => {
            let r = cntlr.current();
            if(!isPhone() && _.has(r,"leftController")){
                r = cntlr.left();
            }
            if(type && type == 2){
                r = r.getView()
            }
            return r;
        }
        //SBC完成后的奖励弹窗
        //24.20 新插入在一键完成后出现的弹层
        events.showRewardsView = (set) => {
            var rewardsController = new UTGameRewardsViewController(set.awards);
            rewardsController.init(),
            rewardsController.modalDisplayDimensions.width = "24em";
            rewardsController.getView().setSbcSet(set);
            let challenge = _.first(set.challenges.values());
            let tryAgainBtn;
            const fastInfo = info.base.fastsbc[`${challenge.id}#${set.id}`];
            const controllerType = cntlr.current().className == 'UTSBCHubViewController' ? 1 : (cntlr.current().className.includes('UTUnassignedItems') ? 2 : 0);
            if(controllerType){
                const fastCount = events.fastSBCQuantity(controllerType == 1,_.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.duplicateId !== 0),fastInfo) - 1;
                if(fastInfo && fastCount){
                    tryAgainBtn = events.createButton(
                        new UTCurrencyButtonControl(),
                        fy("trypack.button.again") + `(${fastCount})`,
                        () => {
                            rewardsController.onBackButton();
                            events.isSBCCache(set.id, challenge.id);
                        },
                        "call-to-action fsu-challengefastbtn"
                    )
                    Object.assign(tryAgainBtn.getRootElement().style, {
                        marginTop: ".5rem",
                        width: "100%"
                    });
                    tryAgainBtn.__currencyLabel.innerHTML = events.getFastSbcSubText(fastInfo);
                    rewardsController.getView().getRootElement().querySelector("footer").appendChild(tryAgainBtn.getRootElement());
                }
            }
            //25.21 领取并发送球员到俱乐部按钮添加
            if (controllerType == 2 && !tryAgainBtn) {
                const allArePlayers = _.every(repositories.Item.getUnassignedItems(), i => i.type === ItemType.PLAYER);
                if (allArePlayers) {
                    const duplicateIds = _.map(repositories.Item.getUnassignedItems(),"duplicateId");
                    const clubIds = events.getItemBy(1,{"id":duplicateIds});
                    if(duplicateIds.length === 0 || clubIds.length === 0){
                        console.log("可以全部发送到俱乐部")
                        const allSendClubBtn = events.createButton(
                            new UTStandardButtonControl(),
                            fy("allsendclub.button.text"),
                            () => {
                                let controller = isPhone()? cntlr.current() : cntlr.left();
                                rewardsController.onBackButton();
                                controller.storeInClub();
                            },
                            "call-to-action"
                        )
                        Object.assign(allSendClubBtn.getRootElement().style, {
                            marginTop: ".5rem",
                            width: "100%"
                        });
                        rewardsController.getView().getRootElement().querySelector("footer").appendChild(allSendClubBtn.getRootElement());
                    }
                }
            }
            gPopupClickShield.setActivePopup(rewardsController);
            console.log(rewardsController);
            console.log(set);
            repositories.Item.setDirty(ItemPile.PURCHASED);
            setTimeout(() => {
                console.log(_.first(set.challenges.values()).isCompleted())
                if(tryAgainBtn && _.first(set.challenges.values()).isCompleted()){
                    tryAgainBtn.setInteractionState(0);
                }
            }, 50);
        }
        //提交SBC任务
        //24.20 拦截提交行为，交换重复球员
        UTSBCSquadOverviewViewController.prototype._submitChallenge = function _submitChallenge(e) {
            console.log(this,e)


            /** 25.18 珍贵球员提示 **/
            function valuablePlayerTips(left,controller,e) {
                if(_.has(left,"_fsuValuable") && _.isArray(left._fsuValuable)){
                    let playerCount = _.intersection(left._fsuValuable, _.map(left._squad.getFieldPlayers(),"item.definitionId"));
                    if(playerCount.length > 0){
                        events.popup(
                            fy("valuableplayer.popupt"),
                            fy(["valuableplayer.popupm",playerCount.length]),
                            (t) => {
                                if(t == 44408){
                                    call.squad.submit.call(controller,e);
                                }
                            },
                            [
                                { labelEnum: 44408 },
                                { labelEnum: 44409 }
                            ]
                        )
                    }else{
                        call.squad.submit.call(controller,e);
                    }
                }else{
                    call.squad.submit.call(controller,e);
                }
            }

            let controller = this;
            let pIds = _(this._squad.getFieldPlayers())
            .filter(p => p._item.untradeable === false && p._item.definitionId !== 0)
            .map(p => p._item.definitionId)
            .value();
            let filteredItems = _.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.untradeable && _.includes(pIds, item.definitionId));
            if(filteredItems.length){
                services.Item.move(filteredItems, ItemPile.CLUB).observe(controller,async (e, t) => {
                    if (e.unobserve(controller), t.success) {
                        let oldIds = _.map(t.data.clubDuplicates,"id");
                        let newPlayers = _.map(controller._squad.getPlayers(),p => {
                            let oldIdIndex = _.indexOf(oldIds, p._item.id);
                            if (oldIdIndex === -1) {
                                return p._item;
                            } else {
                                let tItemId = t.data.itemIds[oldIdIndex];
                                let eventResult = events.getItemBy(2, { id: tItemId });
                                if(eventResult.length){
                                    return eventResult[0];
                                }else{
                                    return p._item;
                                }
                            }
                        })
                        console.log(newPlayers)
                        events.showLoader();
                        events.notice("notice.submitrepeat",1);
                        await events.saveSquad(controller._challenge,controller._challenge.squad,newPlayers,[]);
                        valuablePlayerTips(this,controller,e)
                    }else{
                        services.Notification.queue([services.Localization.localize("notification.item.moveFailed"), UINotificationType.NEGATIVE])
                    }
                });
            }else{
                valuablePlayerTips(this,controller,e)
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


                //24.18 头部快捷入口：判断是否sbc无缓存进行重读取
                if(services.SBC.repository.isCacheExpired()){
                    services.SBC.requestSets().observe(cntlr.current(), (e, t) => {
                        if (e.unobserve(cntlr.current()),
                        t.success) {
                            console.log("这里重新读取了SBC列表")
                            if(cntlr.current().className == "UTSBCHubViewController"){
                                console.log("这里刷新了列表")
                                cntlr.current()._requestSBCData()
                            }
                            events.changeHeaderSBCEntrance()
                        }
                    })
                }else{
                    events.changeHeaderSBCEntrance()
                }
            }
        }
        //24.15 头部快捷入口：完成SBC移除无效的SBC任务快捷入口
        events.changeHeaderSBCEntrance = () => {
            let completeId = _.filter(info.douagain.SBCList,SBCId => services.SBC.repository.getSetById(SBCId).isComplete());
            _.map(completeId,SBCId => {
                events.SBCListInsertToFront(SBCId,2)
            })
        }
        UTSelectItemFromClubViewController.prototype.requestItems = function() {
            if(this.clubViewModel.canShowPage() && !this.clubViewModel.shouldRequestItems()){
                this.updateItemList(this.clubViewModel.getPageItems())
            }else{
                let method = true,resultPlayers;
                if(this.squad.isSBC()){
                    let searchView = this?.getParentViewController()?.getPreviousController().getView(),
                    type = this.getParentViewController()._fsuFillType,
                    players = _.clone(this.getParentViewController()._fsuFillArray),
                    sort = _.split(_.replace(_.toLower(SearchSortID[this.getParentViewController()._fsuFillSort]),"rating","ovr"), '_'),
                    range;

                    //25.21 升降序显示错误问题，尤其是仓库按钮。
                    if(this.getParentViewController()._fsuFillSort == 2){
                        players = _.orderBy(players, "rating" , "desc");
                    }
                    if(searchView && _.isArray(players)){
                        if(type > 3 && type%2 == 0){
                            method = false;
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


                }


                // console.log(this.searchCriteria)
                // console.log(resultPlayers)
                // console.log(range)
                // console.log(method)
                if(method){
                    this.searchCriteria.count = 200;
                    call.selectClub.request.call(this);
                }else{
                    this.handleItemRetrieval(resultPlayers,true)
                }

            }
        }

        //25.07 插入筛选项目
        UTSelectItemFromClubViewController.prototype.handleItemRetrieval = function(t, e) {
            call.selectClub.handle.call(this, t, e);

            if(this.squad.isSBC()){
                if(!("_fsulistfilter" in this)){
                    let filterContainer = this.parentViewController.childViewControllers.find(
                    (item) => item.className === `UTClubSearchFiltersViewController`
                    ) || null;
                    let isDream = false;
                    if(filterContainer){
                        isDream = filterContainer.clubSearchType == "dream";
                    }
                    let filterBox = events.createElementWithConfig("div",{
                        classList:["pagingContainer"],
                        style:{
                            padding:".1rem .5rem .1rem 0",
                        }
                    })

                    let fsuListFilter = {};
                    let slotIds = _.map(_.filter(this.squad.getPlayers(), slot => {return slot.item.isPlayer() && slot.item.databaseId}),"item.databaseId");

                    this._fsuInitPlayers = _.cloneDeep(
                        _.filter(t,p => {
                            return !slotIds.includes(p.databaseId);
                        })
                    );
                    let listFilterPos = this.squad.getFormation().getPosition(this.slotIndex)
                    _.times(4,i => {
                        let filterItem = events.createElementWithConfig("div",{
                            style:{
                                flexGrow: 1,
                                flexBasis: 0,
                                marginLeft: ".5rem"
                            }
                        })
                        let filterItemTitle = events.createElementWithConfig("div",{
                            innerText:fy(`listfilter.title_${i+1}`),
                            style:{
                                fontSize:"0.83em",
                                color:"#a6a6a1",
                                marginBottom:".1rem"
                            }
                        })
                        filterItem.appendChild(filterItemTitle)

                        let filterBtn = events.createButton(
                            new UTStandardButtonControl(),
                            "",
                            (e) => {
                                events.listFilterData(e._parent,e._type)
                                console.log(e)
                            },
                            "call-to-action listfilter-btn"
                        )
                        filterBtn._type = i == 1 && isDream ? 5 : i+1;
                        filterBtn._parent = this;
                        filterBtn._title = filterItemTitle;
                        filterBtn._pos = listFilterPos;

                        if(filterBtn._type == 1 || filterBtn._type == 4){
                            filterBtn._text = [
                                fy(`listfilter.text.asc`),
                                fy(`listfilter.text.desc`),
                            ]
                        }
                        if(filterBtn._type == 2){
                            filterBtn._text = [
                                fy(`listfilter.text.all`),
                                fy(["listfilter.text.only",fy("listfilter.text.storage")]),
                            ]
                        }
                        if(filterBtn._type == 5){
                            filterBtn._text = [
                                fy(`listfilter.text.all`),
                                fy(["listfilter.text.only",fy("listfilter.text.club")]),
                            ]
                        }
                        if(filterBtn._type == 3){
                            filterBtn._text = [
                                fy(`listfilter.text.all`),
                                fy(["listfilter.text.only",listFilterPos ? listFilterPos.typeName : "ALL"]),
                            ]
                        }

                        fsuListFilter[filterBtn._type] = filterBtn

                        filterItem.appendChild(filterBtn.getRootElement())
                        filterBox.appendChild(filterItem)
                    })
                    this._fsulistfilter = fsuListFilter
                    if(this._fsuInitPlayers.length == 0){
                        _.map(this._fsulistfilter,f => {
                            f.setText(f._text[0])
                            f.setInteractionState(0)
                        })
                        this.getView()._list.noResultsView.getRootElement().style.height = "calc(100% - 3.5rem)";
                    }else{
                        events.setListFilterTitleAndState(this._fsulistfilter,this._fsuInitPlayers,this._fsuInitPlayers)
                        this.getView()._list.__itemList.style.height = "calc(100% - 7rem)";
                    }
                    this.getView()._list.getRootElement().prepend(filterBox);
                }
            }
        }
        //25.07 设置搜索列表筛选器标题
        events.setListFilterTitleAndState = (element,players,initPlayers) => {

            let parentElement = element[1]._parent;
            //判断评分排序
            let rBtn = element[1];
            let currentRating = _.map(players,"rating");
            if(_.isEqual(currentRating, _.reverse(_.sortBy(currentRating)))){
                rBtn._state = 1;
                rBtn.setText("√" + rBtn._text[1])
            }else if(_.isEqual(currentRating, _.sortBy(currentRating))){
                rBtn._state = 0;
                rBtn.setText("√" + rBtn._text[0])
            }else{
                rBtn._state = 1;
                rBtn.setText("×" + rBtn._text[1])
            }
            if(_.every(currentRating, (num) => num === currentRating[0])){
                rBtn.setInteractionState(0);
            }else{
                rBtn.setInteractionState(1);
            }

            //判断默契排序
            let currentChem;
            let cBtn = element[4];
            if(!("_fsuAllChem" in parentElement)){
                let chems = {};
                let squadPlayers = _.map(parentElement.squad.getPlayers(),s => {
                    return s.index == parentElement.slotIndex ? null : s.item
                })
                let squadFormation = parentElement.squad.getFormation();
                let squadManager = parentElement.squad.getManager().item;
                _.map(players,p => {
                    squadPlayers[parentElement.slotIndex] = p;
                    let chem = parentElement.chemCalculator.calculate(squadFormation,squadPlayers,squadManager)
                    chems[p.id] = chem.chemistry
                })
                parentElement._fsuAllChem = chems
                currentChem = chems
            }else{
                currentChem = _.map(players,p => {return parentElement._fsuAllChem[p.id]});
            }
            if(_.isEqual(currentChem, _.reverse(_.sortBy(currentChem)))){
                cBtn._state = 1;
                cBtn.setText("√" + cBtn._text[1])
            }else if(_.isEqual(currentChem, _.sortBy(currentChem))){
                cBtn._state = 0;
                cBtn.setText("√" + cBtn._text[0])
            }else{
                cBtn._state = 0;
                cBtn.setText("×" + cBtn._text[0])
            }
            if(_.every(currentChem, (num) => num === _.get(_.values(currentChem), 0, null))){
                cBtn.setInteractionState(0);
            }else{
                cBtn.setInteractionState(1);
            }


            //复合判断筛选项
            let scopeKey = _.has(element,2) ? 2 : 5;
            let tBtn = element[scopeKey],pBtn = element[3];
            let fp,afp;
            if(scopeKey == 2){

                if(!("_fsuAllStorage" in parentElement)){
                    afp = _.map(_.filter(initPlayers,p => repositories.Item.storage.get(p.id)),"id");
                    parentElement._fsuAllStorage = afp;
                }else{
                    afp = parentElement._fsuAllStorage;
                }
                fp = _.filter(players,p => _.includes(afp,p.id));

            }else{

                if(!("_fsuAllClub" in parentElement)){
                    let pIds = _.map(initPlayers,"id");
                    afp = events.getItemBy(1,{"definitionId":pIds})
                    parentElement._fsuAllClub = afp;
                }else{
                    afp = parentElement._fsuAllClub;
                }

                fp = _.filter(players,p => _.includes(afp,p.id));
            }

            tBtn._state = players.length == fp.length && players.length !== 0 ? 1 : 0;
            tBtn.setText(tBtn._text[tBtn._state])



            let pp,app;
            if(!("_fsuPosPlayers" in parentElement)){
                app = _.map(_.filter(initPlayers,p => _.includes(p.possiblePositions,pBtn._pos.typeId)),"id");
                parentElement._fsuPosPlayers = app;
            }else{
                app = parentElement._fsuPosPlayers;
            }
            pp = _.filter(players,p => _.includes(app,p.id));

            pBtn._state = players.length == pp.length ? 1 : 0;
            pBtn.setText(pBtn._text[pBtn._state])



            if(afp.length == initPlayers.length || afp.length == 0 || players.length == 0 || (pBtn._state == 1 && fp.length == 0)){
                tBtn.setInteractionState(0);
            }else{
                tBtn.setInteractionState(1);
            }

            if(app.length == initPlayers.length || app.length == 0 || players.length == 0 || (tBtn._state == 1 && pp.length == 0)){
                pBtn.setInteractionState(0);
            }else{
                pBtn.setInteractionState(1);
            }

        }

        //25.07 进行筛选数据
        events.listFilterData = (element,type) => {
            let players = _.cloneDeep(element._fsuInitPlayers);


            const evaluateState = (state, typeNumber) => {
                if (type === typeNumber) {
                return state === 0 ? 1 : 0; // 翻转状态
                }
                return state; // 正常状态
            }

            if(_.has(element._fsulistfilter,3)){
                if(evaluateState(element._fsulistfilter[3]._state,3)){
                    players = _.filter(players,p => _.includes(element._fsuPosPlayers,p.id))
                }
            }

            if(_.has(element._fsulistfilter,2)){
                if(evaluateState(element._fsulistfilter[2]._state,2)){
                    players = _.filter(players,p => _.includes(element._fsuAllStorage,p.id))
                }
            }

            if(_.has(element._fsulistfilter,5)){
                if(evaluateState(element._fsulistfilter[5]._state,5)){
                    players = _.filter(players,p => _.includes(element._fsuAllClub,p.id))
                }
            }



            const getChem = (p) => {
                return element._fsuAllChem[p.id];
            }
            let orderKey = [];
            let orders = [];

            if(_.has(element._fsulistfilter,1)){
                orders.push(evaluateState(element._fsulistfilter[1]._state,1) ? "desc" : "asc")
            }

            if(_.has(element._fsulistfilter,4)){
                orders.push(evaluateState(element._fsulistfilter[4]._state,4) ? "desc" : "asc")
            }

            if(type == 4 || (element._fsulistfilter[4].getRootElement().textContent.includes('√') && type !== 1)){
                orderKey = [getChem,"rating"]
                orders = _.reverse(orders);
            }else{
                orderKey = ["rating",getChem]
            }

            players = _.orderBy(players, orderKey, orders);


            //console.log(players)

            element.clubViewModel.resetCollection(players);
            element.updateItemList(element.clubViewModel.getPageItems());
            element.clubViewModel.isFull = true;
            if(players.length == 0){
                element.getView()._list.__itemList.style.height = "auto";
            }else{
                element.getView()._list.__itemList.style.height = "calc(100% - 7rem)";
            }
            events.setListFilterTitleAndState(element._fsulistfilter,players,element._fsuInitPlayers)

        }

        //获得奖励弹窗点击效果
        UTGameRewardsViewController.prototype.onButtonTapped = function(e, t, i) {
            call.other.rewards.popupTapped.call(this,e,t,i)
            if(this.hasPackReward && cntlr.current().className == "UTStorePackViewController" && cntlr.current().getView().getStoreCategory() == 'mypacks'){
                cntlr.current().getStorePacks()
            }
            if(cntlr.current().className == "UTObjectivesHubViewController"){
                let rewardCount = 0;
                let barElement = cntlr.current().getView()._objectivesTM.getRootElement().querySelectorAll(".ut-tab-bar-item-notif");
                _.map(barElement,i => {
                    console.log(_.toInteger(i.textContent))
                    rewardCount += _.toInteger(i.textContent)
                })
                info.task.obj.stat.catReward = rewardCount;
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



        events.setRewardOddo = (target,reward,type) => {
            //console.log(target,reward)
            let results = 0;
            if(reward.isPack || (reward.isMiscItem && reward.item && reward.item.isPlayerPickItem())){
                let oddo = events.getOddo(reward.value);
                if(oddo){
                    results = oddo * reward.count;
                    if(target){
                        let targetItem = target.querySelector(".ut-pack-graphic-view"),
                            targetType = 1;
                        if(targetItem == null){
                            targetItem = target.querySelector(".player-pick");
                            targetType = 2;
                        }
                        if(targetItem == null){
                            targetItem = target.querySelector(".reward-info .type");
                            targetType = 3;
                        }
                        if(targetItem){
                            let oddoBox;
                            if(targetType == 3){
                                targetItem.appendChild(document.createElement("br"));
                                oddoBox = events.createElementWithConfig("span", {
                                    classList: ['currency-coins'],
                                    textContent:fy("returns.text") + results.toLocaleString()
                                });
                            }else{
                                oddoBox = events.createElementWithConfig("div", {
                                    style:{
                                        position:"absolute",
                                        bottom:"0",
                                        backgroundColor:"rgb(0 0 0 / 60%)",
                                        width:"100%",
                                        textAlign:"center",
                                        padding:".2rem 0",
                                        color:"#ffffff",
                                        fontSize:".8rem",
                                    }
                                });
                                let oddoTitle = events.createElementWithConfig("div", {
                                    textContent:_.replace(_.replace(fy("returns.text"),":",""),"：","")
                                });
                                oddoBox.appendChild(oddoTitle)
                                let oddoCoin = events.createElementWithConfig("div", {
                                    classList: ['currency-coins'],
                                    textContent:results.toLocaleString()
                                });
                                oddoBox.appendChild(oddoCoin);
                                if(targetType == 2){
                                    oddoBox.style.paddingBottom = ".5rem";
                                }
                                if(type == 2){
                                    oddoBox.style.fontSize = "1rem";
                                }
                            }
                            targetItem.appendChild(oddoBox);
                        }
                    }
                }
            }else if(reward.isCoin){
                results = reward.value;
            }
            return results;
        }
        // 25.01 删除
        //赛事列表式奖励展示
        // UTCampaignRewardsCarouselView.prototype.setupRewards = function(e) {
        //     call.other.rewards.campaign.call(this,e)
        //     if(e.length){
        //         let target = this.getRootElement().querySelectorAll('.reward');
        //         _.map(e,(r,i) => {
        //             events.setRewardOddo(target[i],r,1)
        //         })
        //     }
        // }
        //目标赛季奖励列表载入
        // UTCampaignRewardsCarouselView.prototype.setupCampaignRewards = function(e) {
        //     call.other.rewards.campaigns.call(this,e)
        //     if(e.length){
        //         let target = this.getRootElement().querySelectorAll('.reward');
        //         _.map(e,(r,i) => {
        //             events.setRewardOddo(target[i],r.rewards[0],1)
        //         })
        //     }
        // }
        //目标非赛季奖励组预览
        FCObjectiveDetailsView.prototype.render = function(e) {
            call.other.rewards.objectiveDetail.call(this,e)
            //console.log(this,e)
            let sum = 0;
            if(e.rewards.rewards[0].isPack){
                sum = events.setRewardOddo(this._rewardsCarousel.getRootElement().querySelector(".reward"),e.rewards.rewards[0]);
            }
            _.map(this.taskViews,(sView,sIndex) => {
                let sAttr = _.nth(e.objectives.values(),sIndex);
                if(sAttr.rewards.rewards.length == 1 && sAttr.rewards.rewards[0].isPack){
                    sum += events.setRewardOddo(sView._rewardsCarousel.getRootElement().querySelector(".reward"),sAttr.rewards.rewards[0],2);
                }
            })
            if(sum){
                let sumBox = events.createElementWithConfig("span", {
                    textContent:'(',
                    style:{
                        marginLeft:".5rem",
                        fontSize:"1.2rem",
                        color:"#666",
                    }
                });
                let sumText = events.createElementWithConfig("span", {
                    textContent: sum.toLocaleString(),
                    classList: ['currency-coins']
                });
                sumBox.appendChild(sumText);
                sumBox.appendChild(document.createTextNode(')'));
                this.__title.appendChild(sumBox);
            }
        }
        //奖励预览弹窗目录
        UTRewardSelectionChoiceViewController.prototype.viewDidAppear = function() {
            call.other.rewards.choice.call(this)
            let target = this.getView().__rewardTiles.querySelectorAll('.ut-reward-selection');
            _.map(this.rewardSets,(s,i) => {
                let sum = 0;
                _.map(s.rewards,(r,z) => {
                    sum += events.setRewardOddo(z == 0 ? target[i] : false,r,2);
                })

                if(s.rewards.length > 1){
                    let sumBox = events.createElementWithConfig("span", {
                        textContent:'(',
                        style:{
                            marginLeft:".5rem",
                            fontSize:"1.2rem",
                            color:"#666",
                        }
                    });
                    let sumText = events.createElementWithConfig("span", {
                        textContent: sum.toLocaleString(),
                        classList: ['currency-coins']
                    });
                    sumBox.appendChild(sumText);
                    sumBox.appendChild(document.createTextNode(')'));
                    target[i].querySelector(".selection-title-landscape").appendChild(sumBox);
                }
            })
        }
        //奖励预览弹窗 - 奖励被选择
        UTRewardSelectionChoiceView.prototype.expandRewardSet = function(e, t) {
            call.other.rewards.choiceSet.call(this,e,t)
            let target = this.__expandedReward.querySelectorAll('.reward');
            let sum = 0;
            _.map(t.rewards,(r,i) => {
                sum += events.setRewardOddo(target[i],r,2)
            })
            if(t.rewards.length > 1){
                let sumBox = events.createElementWithConfig("span", {
                    textContent:'(',
                    style:{
                        marginLeft:".5rem",
                        fontSize:"1.2rem",
                        color:"#666",
                    }
                });
                let sumText = events.createElementWithConfig("span", {
                    textContent: sum.toLocaleString(),
                    classList: ['currency-coins']
                });
                sumBox.appendChild(sumText);
                sumBox.appendChild(document.createTextNode(')'));
                this.__title.appendChild(sumBox)
            }
        }

        //创建俱乐部按钮
        UTClubHubView.prototype.clearTileContent = function(...args) {
            call.view.clubHub.call(this);

            if (services.Configuration.checkFeatureEnabled(UTServerSettingsRepository.KEY.STORAGE_PILE_ENABLED)) {
                let v = this;
                let e = new UTSearchCriteriaDTO;
                services.Item.searchStorageItems(e).observe(v, function(e, t) {
                    e.unobserve(v);
                    if("_fsuStorageTile" in this){
                        this.addTileStats(this._fsuStorageTile,repositories.Item.numItemsInCache(ItemPile.STORAGE));
                    }else{
                        let storageTile = new UTTileView();
                        storageTile.getRootElement().classList.add("col-1-2");
                        storageTile.getRootElement().classList.add("ut-tile-view--with-gfx");
                        storageTile.getRootElement().classList.add("fsu-storage");
                        storageTile.init();
                        storageTile.title = fy("storage.tile");
                        storageTile._parent = this;
                        this._fsuStorageTile = storageTile;
                        this._fsuStorageTile.addTarget(this,
                            (e) => {
                                events.goToStoragePlayers(e._parent)
                            },EventType.TAP)
                        this.addTileStats(this._fsuStorageTile,repositories.Item.numItemsInCache(ItemPile.STORAGE));
                        this.getRootElement().querySelector("div.grid").appendChild(this._fsuStorageTile.getRootElement());
                    }
                })
            }

            if("_fsuLockTile" in this){
                this.addTileStats(this._fsuLockTile,info.lock.length);
            }else{
                let lockTile = new UTTileView();
                lockTile.getRootElement().classList.add("col-1-2");
                lockTile.getRootElement().classList.add("ut-tile-view--with-gfx");
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

        //25.01 SBC仓库页面
        events.goToStoragePlayers = (e) => {
            let nav = cntlr.current().getNavigationController();
            if(nav){
                let criteria = new UTSearchCriteriaDTO;
                criteria.type = SearchType.PLAYER;
                let controller = isPhone() ? new UTClubSearchResultsViewController : new controllers.club.ClubSearchResultsLandscape;
                controller.initWithSearchCriteria(criteria);
                if(isPhone()){
                    controller._fsuStorage = true;
                }else{
                    controller._listController._fsuStorage = true;
                }
                nav.pushViewController(controller);
            }
        }
        events.goToLockPlayers = (e) => {
            let nav = cntlr.current().getNavigationController();
            if(nav){
                let criteria = new UTSearchCriteriaDTO;
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
                void 0 === r && (r = !1);
                var e = this.getView().getSubTypesDropDown()
                    , t = new UTSearchCriteriaDTO;
                t.update(this.searchCriteria),
                0 < e.length && (t.subtypes = [e.id]),
                services.Club.search(t).observe(this, function(e, t) {
                    var i;
                    if (e.unobserve(s),
                    s.clubViewModel && t.success && JSUtils.isObject(t.response)) {
                        //console.log(t)
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
            }else if("_fsuStorage" in this && this._fsuStorage){
                var s = this;
                void 0 === r && (r = !1);
                var e = this.getView().getSubTypesDropDown()
                    , t = new UTSearchCriteriaDTO;
                t.update(this.searchCriteria),
                0 < e.length && (t.subtypes = [e.id]),
                services.Item.searchStorageItems(t).observe(this, function(e, t) {
                    var i;
                    if (e.unobserve(s),
                    s.clubViewModel && t.success && JSUtils.isObject(t.response)) {
                        //console.log(t)
                    var o = s.clubViewModel.getIndex()
                        , n = s.searchCriteria.sortBy === SearchSortType.RECENCY;
                    s.clubViewModel.sortByRecency = n,
                    s.clubViewModel.sort = s.searchCriteria.sort,
                    s.clubViewModel.sortType = s.searchCriteria.sortBy,
                    s.clubViewModel.removeArray(t.response.items),
                    s.clubViewModel.addArray(t.response.items),
                    s.clubViewModel.isFull = t.response.retrievedAll,
                    s.clubViewModel.setIndex(o),
                    s.updateItemList(s.clubViewModel.getPageItems(), !r)
                    } else
                    services.Notification.queue([services.Localization.localize("notification.club.failedToLoad"), UINotificationType.NEGATIVE]),
                    null === (i = s.getNavigationController()) || void 0 === i || i.popViewController(!0)
                })
            }else if("_fsuAutoBuy" in this && this._fsuAutoBuy){
                //25.20 球员自动购买 写入球员
                this.clubViewModel.resetCollection([]);
                this.clubViewModel.addArray(this._fsuAutoBuyPlayers);
                this.clubViewModel.isFull = true;
                this.clubViewModel.getIndex()
                this.updateItemList(this.clubViewModel.getPageItems(), 1)

                if(this._fsuAutoBuyPlayers.length == 0){
                    this.getView()._list.noResultsView.setHeading(fy("autobuy.noresult.title"))
                    this.getView()._list.noResultsView.setDescription(fy("autobuy.noresult.text"))
                    this.getView()._list.noResultsView._button.hide()
                    this.getView().getRootElement().classList.add("fsu-aotobuy")
                }else{
                    this.getView().header.getButton().hide()

                    //写入队内是否拥有标识
                    _.forEach(this.getView()._list.listRows,(rows) => {
                        const clubPlayers = events.getItemBy(1,{"definitionId":rows.data.definitionId});
                        if(clubPlayers.length > 0){
                            let tag = new UTListActiveTagView;
                            tag.setIconClass("club");
                            rows.setActiveTagComponent(tag);
                            rows.addClass("is-active");
                            rows.__rowContent.appendChild(tag.getRootElement());
                        }
                    })


                }
            }else{
                call.search.request.call(this,r)
            }
        }

        //24.18 修正锁定列表标题的问题
        UTClubSearchResultsViewController.prototype.setupHeader = function(...args) {
            call.search.setHeader.call(this,...args)
            if("_fsuLock" in this && this._fsuLock){
                this.getNavigationController().setNavigationTitle(fy("locked.navtilte"))
            }
            if("_fsuStorage" in this && this._fsuStorage){
                this.getNavigationController().setNavigationTitle(fy("storage.navtilte"))

                let sendClubPlayers = _.filter(repositories.Item.storage.values(),i => {
                    let clubPlayers = events.getItemBy(1,{"definitionId":i.definitionId},false,repositories.Item.club.items.values());
                    return clubPlayers.length == 0
                })
                if(sendClubPlayers.length){
                    let setClubHeader = new UTSectionedTableHeaderView;
                    setClubHeader.init(),
                    setClubHeader.hideActionButton(),
                    setClubHeader.hideBulkActionButton(),
                    setClubHeader.setText(fy([`storage.setclub.text`,sendClubPlayers.length]));
                    let controller = this;
                    let setClubButton = events.createButton(
                        new UTStandardButtonControl(),
                        fy(`storage.setclub.button`),
                        (e) => {
                            events.transferToClub(controller,sendClubPlayers)
                            setClubHeader.hide()
                        },
                        "call-to-action mini"
                    )
                    setClubButton._parent = setClubHeader;
                    setClubHeader.getRootElement().appendChild(setClubButton.getRootElement());

                    this.getView().getRootElement().prepend(setClubHeader.getRootElement())
                }
            }

            //25.20 球员自动购买 设置标题
            if("_fsuAutoBuy" in this && this._fsuAutoBuy && !_.has(this,"_playerNameInput")){
                this.getNavigationController().setNavigationTitle(fy("autobuy.nav.tilte"));


                let searchBox = document.createElement("div");
                searchBox.classList.add("fsu-sbcfilter-box");
                let searchOption = document.createElement("div");
                searchOption.classList.add("fsu-sbcfilter-option");
                searchOption.style.maxWidth = "400px";

                this._playerNameInput = new UTPlayerSearchControl();
                this._playerNameInput.init();
                this._playerNameInput.getRootElement().style.flex = 1;
                searchOption.appendChild(this._playerNameInput.getRootElement());

                this._searchButton = events.createButton(
                    new UTStandardButtonControl(),
                    services.Localization.localize("button.search"),
                    (e) => {
                        if(this._playerNameInput.getSelected()){
                            events.showLoader()
                            events.autoBuySearchPlayer(this._playerNameInput.getSelected(),this)
                        }else{
                            events.notice("autobuy.noselected.notice",2)
                        }
                    },
                    "call-to-action"
                )
                this._searchButton.getRootElement().style.marginLeft = "1rem";
                this._searchButton.getRootElement().style.width = "6rem";
                searchOption.appendChild(this._searchButton.getRootElement());

                searchBox.appendChild(searchOption);

                this.getView().header.getRootElement().after(searchBox);
            }
        }
        //搜索球员时抓取所搜索的球员内容
        UTMarketSearchFiltersViewController.prototype.eSearchSelected = function(e, t, i) {
            call.other.market.eSearch.call(this,e,t,i)
            if(_.includes(this.className, 'UTMarketSearch') && this.pinnedListRowItem == null){
                let criteria = JSON.parse(JSON.stringify(this.viewmodel.searchCriteria));
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

                    _.map(info.market.mb,(item,index) => {
                        let playerInfo = repositories.Item.getStaticDataByDefId(item[criteriaKeys.indexOf("maskedDefId")])
                        if(playerInfo){
                            let btn = events.createButton(
                                new UTStandardButtonControl(),
                                `${playerInfo.name} - ${playerInfo.rating}`,
                                async(e) => {
                                    console.log(e.criteria)
                                    let current = cntlr.current().viewmodel.searchCriteria;
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
                            btn.criteria = item;
                            this._fsuHistory.btns.push(btn);
                            let eblock = document.createElement("div");
                            eblock.classList.add("price-filter");
                            eblock.appendChild(btn.getRootElement());
                            let elable = document.createElement("div");
                            elable.style.textAlign = "center";
                            elable.style.color = "#9E9E9E";
                            let bid = [];
                            if(item[criteriaKeys.indexOf("minBid")] + item[criteriaKeys.indexOf("maxBid")] > 0){
                                bid = [item[criteriaKeys.indexOf("minBid")],item[criteriaKeys.indexOf("maxBid")],"auctioninfo.bidprice"]
                            }else{
                                bid = [item[criteriaKeys.indexOf("minBuy")],item[criteriaKeys.indexOf("maxBuy")],"auctioninfo.buynowprice"]
                            }
                            let defaultText = services.Localization.localize("search.comboBoxDefaultValue");
                            elable.textContent = `${services.Localization.localize(bid[2])}${bid[0] ? bid[0] : defaultText} - ${bid[1] ? bid[1] : defaultText}`;
                            eblock.appendChild(elable);
                            this._fsuHistory.element.querySelector(".fsu-historybox").appendChild(eblock);
                        }
                    })
                    this._fsuHistory.ts = info.market.ts;
                }
            }else if("_fsuHistory" in this){
                this._fsuHistory.element.style.display = "none";
            }
        }

        //进化球员搜索界面
        UTAcademySlotItemDetailsViewController.prototype.renderView = function(...args) {
            call.view.academySlot.call(this, ...args);
            if("_fsuGoToEI" in this.getView()){
                if(this.viewmodel.getSelectedSlot().hasPreviewPlayer()){
                    this.getView()._fsuGoToEI.hide()
                }else{
                    this.getView()._fsuGoToEI.show()
                }
            }else{
                let t = this.getView().__ctaButtonContainer,
                    b = events.createButton(
                        new UTStandardButtonControl(),
                        fy("popupButtonsText.44406"),
                        (e) => {
                            GM_openInTab(`https://www.easysbc.io/evolutions`, { active: true, insert: true, setParent :true });
                        },
                        "expanded preview-player fsu-academyEI"
                    );
                this.getView()._fsuGoToEI = b;
                let styleElement = document.createElement('style');
                styleElement.textContent = '.fsu-academyEI::before { content:"\\E001" !important}';
                document.head.appendChild(styleElement);
                t.insertBefore(b.getRootElement(), t.firstChild);
            }

        }
        //24.15 修复EA错误：SBC中转会搜索无法购买球员
        UTItemDetailsNavigationController.prototype.setSquadContext = function(e) {
            var t = this.getRootController();
            this.squadContext = e;
            t instanceof UTItemDetailsViewController && t.setSquadContext(e);
        }

        //商店页面设置标题
        UTStoreViewController.prototype.setCategory = function(e) {
            call.other.store.setCategory.call(this,e)
            if(this.viewmodel !== void 0){
                let conditions = ['UT_STORE_CAT_S_PFU', 'FUT_STORE_CAT_SPECIAL_NAME', 'FUT_STORE_CAT_PROVISIONS'];
                let searchCategoryIds = _.map(
                    _.filter(this.viewmodel.categories, obj =>
                        conditions.includes(obj.localizedName)
                    ),'categoryId'
                );

                let classic = _.find(this.viewmodel.categories, c => c.localizedName == "FUT_STORE_CAT_CLASSIC_NAME")

                //24.18 修复无法展示纯金币包的问题
                _.forEach(this.getView()._navigation.items,item => {
                    if(searchCategoryIds.includes(item.id)){
                        let coinsPack = _.filter(this.viewmodel.getCategoryArticles(item.id), pack => _.isEqual(pack.state, 'active') && !pack.getPrice(GameCurrency.POINTS) && pack.getPrice(GameCurrency.COINS))
                        if(coinsPack.length){
                            item.addNotificationBubble(coinsPack.length);
                        }
                    }
                    if(item.id == classic.categoryId){
                        //25.04 查询预览包是否预览
                        let xrayPack = _.filter(this.viewmodel.getCategoryArticles(classic.categoryId),pack => _.has(pack,"previewCreateTime") && pack.previewCreateTime == 0)
                        if(xrayPack.length){
                            item.addNotificationBubble(xrayPack.length);
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



        //24.20 临时解决秒数无法显示的问题
        //如修复则进行删除
        EALocalizationService.prototype.localize = function(t, e, i) {
            if(t == "timespan.second"){
                t = "timespan.seconds"
            }
            let text = call.other.localize.call(this,t,e,i);
            return text;
        }

        //24.23 增加读取meta属性
        //25.01 修改变为新meta显示方式
        events.getPlayerMetaToText = (p) => {
            let m;
            let unknown = {
                "base":{
                    "chemstyle":250,
                    "name":fy("meta.role.unknown"),
                    "rank":"?",
                    "rankBg":"rgba(255, 255, 255, 0.8)",
                    "id":-1,
                    "plus":0,
                    "rating":"?"
                }
            }
            if(p.academy){
                return unknown;
            }
            if(!(_.has(info.meta,p.definitionId))){
                info.meta[p.definitionId] = {
                    "text": unknown
                }
            }
            m = info.meta[p.definitionId];
            if(_.has(m,"text")){
                return m.text;
            }else{
                let mt = {};
                let tacticRoles = services.Squad.getTacticRoles().map(function(z) {
                    return z.type
                });
                let tempRole = _.map(p.possiblePositions,i => {
                    return UTPlayerRoleVO.getRolesForPositionId(i);
                })
                let role = _.sortBy(_.uniq(_.intersection(_.flatten(tempRole), tacticRoles)));
                let plus = _.map(p.basePlusRoles,i => {
                    return i.type;
                })
                plus = _.uniq(plus);
                let plusPlus = _.map(p.basePlusPlusRoles,i => {
                    return i.type;
                })
                plusPlus = _.uniq(plusPlus);
                let base = 0;
                let rankText = ["S","A","B","C","D"];
                let rankBgColor = ["rgba(220,38,38,0.8)","rgba(251,146,60,0.8)","rgba(168,85,247,0.8)","rgba(6,182,212,0.8)","rgba(34,197,94,0.8)"];
                let eioNames = ["none","goalkeeper","sweeper_keeper","fullback","wingback","falseback","attacking_wingback","defender","stopper","ball_playing_defender","centre_half","holding","deep_lying_playmaker","box_to_box","playmaker","half_winger","winger","wide_playmaker","wide_midfielder","inside_forward","shadow_striker","target_forward","false_nine","poacher","advanced_forward"]
                _.forEach(role,(r,i) => {
                    if(_.has(m.meta,i)){
                        let rm = {};
                        rm["name"] = UTLocalizationUtil.mapTacticRoleToLocString(r);
                        rm["id"] = r;
                        rm["rating"] = m.meta[i][0];
                        rm["chemstyle"] = m.meta[i][1] + 250;
                        let customSortedIndex = _.findIndex(info.meta.rank[r], (value) => value <= rm["rating"]);
                        let rankIndex = customSortedIndex === -1? info.meta.rank[r].length : customSortedIndex;
                        rm["rank"] = rankText[rankIndex];
                        rm["rankBg"] = rankBgColor[rankIndex];
                        rm["plus"] = 0;
                        rm["eioName"] = eioNames[r];
                        if(_.includes(plus,r)){
                            rm["plus"] = 1;
                        }else if(_.includes(plusPlus,r)){
                            rm["plus"] = 2;
                        }
                        mt[r] = rm;
                        if(base == 0 || rm["rating"] > base || (rm["rating"] == base && rm["plus"] > mt["base"]["plus"])){
                            base = rm["rating"];
                            mt["base"] = rm;
                        }
                    }
                })
                if(_.size(mt)){
                    if(_.has(mt,"base")){
                        let namePlus = "";
                        for (let i = 0; i < mt["base"].plus; i++) {
                            namePlus += '+';
                        }
                        mt["base"].name += namePlus;
                    }
                    info.meta[p.definitionId][`text`] = mt;
                }
                return mt;
            }
        }

        //25.01 新增meta popup文本显示方法
        events.getPlayerMetaPopupText = (meta,pos) => {
            let t = "";
            let v = "";
            let sl = services.Localization;
            let desc = meta.id == -1 ? meta.name : sl.localize(`tactics.roles.role${meta.id}.description`);
            if(pos){
                let vs = UTPlayerRoleVO.getVariationsForRoleAndPositionId(pos,meta.id);
                let vsa = _.map(vs,vt => {
                    return sl.localize("tactics.roles.variation" + vt);
                })
                v = fy(["plyers.relo.popupm.v1",vsa.join("、")])
            }else{
                v = fy("plyers.relo.popupm.v2")
            }
            return fy([
                "plyers.relo.popupm",
                meta.name,
                sl.localize(`playstyles.playstyle${meta.chemstyle}`),
                desc,
                v,
                meta.rank,
                meta.rating
            ])
        }

        //24.23 增加读取模型属性
        events.getPlayerBodyType = (id) => {
            if(_.has(info.meta,id)){
                if(_.has(info.meta[id],`bodytype`)){
                    return info.meta[id][`bodytype`];
                }
            }
            return 0;
        }

        //24.23 增加快捷任务条件展示
        events.getFastSbcSubText = (j) => {
            let e = services.Localization;
            let t = [];
            let i = info.league == 2 ? " " : "";
            _.map(j,sj => {
                let lt = `${sj.c}<span>×</span>`;
                if(_.has(sj.t,"rating")){
                    lt += `${e.localize("squads.rating")}${i}:${i}${sj.t.rating}`;
                }else{
                    if(_.has(sj.t,"gs")){
                        lt += e.localize(`item.raretype${sj.t.gs ? 1 : 0}`);
                    }
                    if(_.has(sj.t,"rs")){
                        lt += i + e.localize(`search.cardLevels.cardLevel${sj.t.rs + 1}`);
                    }
                }
                t.push(lt);
            })
            return t.join("、");
        }



        //24.23 添加拦截器来截获提交的SBC
        const originalSubmitChallenge = UTSBCService.prototype.submitChallenge;
        UTSBCService.prototype.submitChallenge = function(o, a, i, n) {
            let r = originalSubmitChallenge.apply(this, arguments);
            let s = this;
            r.observe(this, function(e,t) {
                e.unobserve(s)
                if(t.success){
                    let DT = events.getStartOfDayTimestamp();
                    if(DT == info.SBCCount.time){
                        info.SBCCount.count += 1;
                    }else{
                        info.SBCCount.time = DT;
                        info.SBCCount.count = 1;
                    }
                    SBCCount.changeCount();
                    GM_setValue("SBCCount",JSON.stringify(info.SBCCount));
                }
            });
            return r;
        };

        //24.23 创建当日的时间戳，进行记录时间
        events.getStartOfDayTimestamp = () => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return now.getTime();
        };

        /** 25.18 真实概率功能 */
        events.raelProbability = async(pack) => {
            let prod = await events.getRealProbability(pack);
            if(prod.length){
                events.hideLoader();
                let mp = new EADialogViewController({
                    dialogOptions: [{ labelEnum: enums.UIDialogOptions.OK }],
                    message: fy(`realprob.popupm`),
                    title: fy(["realprob.popupt",services.Localization.localize(pack.packName)]),
                    type: EADialogView.Type.MESSAGE
                });
                mp.init();
                mp.onExit.observe(mp,(e, z) => {
                    e.unobserve(mp);
                });
                gPopupClickShield.setActivePopup(mp);
                _.flatMap(mp.getView().dialogOptions,(v,i) => {
                    if(v.__text.innerHTML == "*"){
                        v.setText(fy(`popupButtonsText.${mp.options[i].labelEnum}`))
                    }
                })
                mp.getView().__msg.style.padding = "1rem";
                mp.getView().__msg.style.fontSize = "100%";

                let pBox = events.createElementWithConfig("div",{
                    style:{
                        marginTop:"1rem"
                    }
                })
                let pBoxTiltle = events.createElementWithConfig("div",{
                    className:"fsu-realProdTitle"
                })
                _.times(4, (index) => {
                    pBoxTiltle.appendChild(
                        events.createElementWithConfig("div",{
                            textContent:fy(`realprob.title_${index + 1}`)
                        })
                    )
                });
                pBox.appendChild(pBoxTiltle);

                let pBoxBody = events.createElementWithConfig("div",{
                    className:"fsu-realProdBody",
                    style:{
                        height:"auto",
                        maxHeight:"30vh",
                    }
                })
                _.forEach(prod,(item,index) => {
                    let pBoxBodyItem = events.createElementWithConfig("div",{
                        className:"fsu-realProdBodyItem"
                    })
                    let prodKeys = ["name","ea","odds","count"];
                    _.forEach(prodKeys,(key) => {
                        pBoxBodyItem.appendChild(
                            events.createElementWithConfig("div",{
                                textContent:item[key]
                            })
                        )
                    })
                    pBoxBody.appendChild(pBoxBodyItem)
                })
                pBox.appendChild(pBoxBody);
                mp.getView().__msg.appendChild(pBox);

            }else{
                events.hideLoader();
            }
        }

        //25.04 添加模拟开包功能
        events.tryPack = async(pack) => {
            let packJson = await events.getTryPackData(pack);

            //修改本地缓存包的oddo
            info.base.oddo[pack.id] = packJson.packItem.pack.returns.avgReturns

            let itemJson = {
                "id": 0,
                "timestamp": 0,
                "formation": "f433",
                "untradeable": false,
                "assetId": 0,
                "rating": 82,
                "itemType": "player",
                "resourceId": 0,
                "owners": 0,
                "discardValue": 291,
                "cardsubtypeid": 2,
                "lastSalePrice": 0,
                "injuryType": "none",
                "injuryGames": 0,
                "preferredPosition": "RM",
                "statsList": [],
                "lifetimeStats": [],
                "contract": 0,
                "teamid": 115998,
                "rareflag": 0,
                "playStyle": 250,
                "leagueId": 2215,
                "loansInfo": {
                    "loanType": "NONE",
                    "loanValue": 0
                },
                "loyaltyBonus": 1,
                "pile": 0,
                "nation": 21,
                "resourceGameYear": 2025,
                "attributeArray": [],
                "skillmoves": 2,
                "weakfootabilitytypecode": 4,
                "preferredfoot": 1,
                "possiblePositions": [],
                "gender": 1,
                "baseTraits": [],
                "plusRoles": []
            }
            let itemFactory = new UTItemEntityFactory
            let itemEntitys = [];
            let items = _.map(packJson.packItem.items,i => {
                let tempItem = _.cloneDeep(itemJson);
                tempItem.assetId = i.id;
                tempItem.resourceId = i.id;
                tempItem.rating = i.rating;
                tempItem.preferredPosition = _.get(_.find(i.positions, { isPreferred: true }), 'name');
                tempItem.teamid = i.club.id;
                tempItem.leagueId = i.league.id;
                tempItem.nation = i.nation.id;
                tempItem.attributeArray = Object.values(i.attributes);
                tempItem.skillmoves = i.skills - 1;
                tempItem.weakfootabilitytypecode = i.weekFoot;
                tempItem.preferredfoot = i.foot;
                tempItem.possiblePositions = _.map(i.positions,"name");
                tempItem.baseTraits = _.map(_.filter(i.traits, { isIcon: false }), 'id');
                tempItem.iconTraits = _.map(_.filter(i.traits, { isIcon: true }), 'id');
                tempItem.rareflag = i.rarity.id;
                tempItem.untradeable = !pack.tradable;
                return tempItem;
            })
            if(items && items.length){
                console.log(items)
                itemEntitys = _.map(items,i => {return itemFactory.createItem(i)})
            }
            events.tryPackPopup(pack,_.orderBy(itemEntitys,["rareflag","rating"],["desc", "desc"]))
        }

        //25.04 模拟开包程序，创建弹窗
        events.tryPackPopup = async(pack,items) => {
            let tryController = new UTPackOddsViewController;
            tryController.initWithPack(pack);
            tryController.modalDisplayStyle = "form";

            let tryRootView = tryController.getView().getRootElement();
            tryRootView.querySelector(".ut-pack-odds-modal--sections").style.overflow = "hidden";

            tryController.__listBox = events.createElementWithConfig("div",{
                className:"ut-store-reveal-modal-list-view",
                style:{
                    borderRadius:"0",
                }
            })
            tryController.__list = document.createElement("ul");
            tryController.__list.classList.add("itemList");
            tryController.__listBox.appendChild(tryController.__list);

            let clubPlayerIds = events.getItemBy(1,{},false,repositories.Item.club.items.values());
            tryController.listRows = items.map(i => {
                var o = new UTItemTableCellView;
                o.setData(i, void 0, ListItemPriority.DEFAULT);
                if(clubPlayerIds.includes(o.definitionId)){
                    o.addClass(UTStoreRevealModalListView.ListStyle.DUPLICATE)
                }
                o.render();
                tryController.__list.appendChild(o.getRootElement())
                return o
            })

            tryRootView.querySelector(".ut-pack-odds-modal--sections").prepend(tryController.__listBox)

            tryRootView.querySelector("footer").innerHTML = "";


            let sumRare = _.map(items,"rareflag")
            let specialRare = _.filter(sumRare, (num) => num >= 2)

            let footInfo_1 = events.createElementWithConfig("div",{});
            let footInfo_1_paddingLeft = "0";
            if(pack.getPrice(GameCurrency.COINS)){
                footInfo_1.appendChild(events.createElementWithConfig("span",{
                    textContent:fy("trypack.foot.info1_1")
                }));
                footInfo_1.appendChild(events.createElementWithConfig("span",{
                    textContent:pack.getPrice(GameCurrency.COINS).toLocaleString(),
                    classList:["currency-coins"]
                }));
                if(pack.getPrice(GameCurrency.COINS)){
                    footInfo_1.appendChild(events.createElementWithConfig("span",{
                        textContent:pack.getPrice(GameCurrency.COINS).toLocaleString(),
                        classList:["currency-points"],
                        style:{
                            paddingLeft: "0.5rem"
                        }
                    }));
                }
                footInfo_1_paddingLeft = "1rem"
            }

            footInfo_1.appendChild(events.createElementWithConfig("span",{
                textContent:fy(["trypack.foot.info1_2",sumRare.length,specialRare.length]),
                style:{
                    paddingLeft: footInfo_1_paddingLeft
                }
            }));
            tryRootView.querySelector("footer").appendChild(footInfo_1);

            let footInfo_2 = events.createElementWithConfig("div",{
                style:{
                    paddingTop: ".2rem"
                }
            });
            footInfo_2.appendChild(events.createElementWithConfig("span",{
                textContent:fy("trypack.foot.info2_1")
            }));
            let packOddo = events.getOddo(pack.id);
            footInfo_2.appendChild(events.createElementWithConfig("span",{
                textContent:packOddo.toLocaleString(),
                classList:["currency-coins"]
            }));
            footInfo_2.appendChild(events.createElementWithConfig("span",{
                textContent:fy("trypack.foot.info2_2"),
                style:{
                    paddingLeft: "1rem"
                }
            }));
            footInfo_2.appendChild(events.createElementWithConfig("span",{
                textContent:"0",
                classList:["currency-coins","trypack-count"]
            }));
            footInfo_2.appendChild(events.createElementWithConfig("span",{
                textContent:fy("trypack.foot.info2_3"),
                style:{
                    paddingLeft: "1rem"
                }
            }));
            footInfo_2.appendChild(events.createElementWithConfig("span",{
                textContent:"0%",
                classList:["trypack-diff"]
            }));
            tryRootView.querySelector("footer").appendChild(footInfo_2);

            let footInfo_3 = events.createElementWithConfig("div",{
                textContent:fy("trypack.foot.info3"),
                style:{
                    paddingTop: ".2rem",
                    opacity: ".5"
                }
            });
            tryRootView.querySelector("footer").appendChild(footInfo_3);


            let againButton = events.createButton(
                new UTButtonControl(),
                fy("trypack.button.again"),
                async(e) => {
                    tryController.getView()._exitBtn._tapDetected()
                    events.showLoader()
                    // 延迟函数
                    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                    // 随机生成 1000 到 2000 毫秒的延迟时间
                    const randomDelay = _.random(500, 1000);
                    await delay(randomDelay);
                    events.tryPack(pack)
                },
                "btn-standard call-to-action mini"
            )
            againButton.getRootElement().style.marginTop = "1rem"
            againButton.getRootElement().style.cursor = "pointer"
            againButton.setInteractionState(0)
            tryRootView.querySelector("footer").appendChild(againButton.getRootElement())

            tryController._packoddo = packOddo;
            events.loadPlayerInfo(items,tryController)

            let titleSuffix = events.createElementWithConfig("span",{
                textContent:fy("trypack.popup.suffix"),
                style:{
                    color: "#36b84b",
                    fontWeight: "600"
                }
            });
            tryController.getView().__title.appendChild(titleSuffix)
            tryRootView.querySelectorAll('.ut-pack-odds-collapse-section-view').forEach(el => el.remove());
            events.hideLoader()
            cntlr.current().presentViewController(tryController, !0);
            setTimeout(() => {
                againButton.setInteractionState(1);
            }, 2000);
        }

        //25.04 模拟开包程序，获取模拟开包后的数据
        events.getTryPackData = async (pack) => {
            try {
                let packName = services.Localization.localize(pack.packName);
                packName = packName.replace(/\s+/g, '-').replace(/\//g, '&');
                const packOpenResponse = await events.externalRequest("GET",`https://www.futnext.com/pack/${packName}/${pack.id}/open`,false,`text/x-component`);
                let textResponse = packOpenResponse;
                let textStart = textResponse.indexOf("packItem");
                let textEnd = textResponse.indexOf(`"renderItemByDefault`);
                console.log(textStart,textEnd)
                let textResult = _.slice(textResponse, textStart, textEnd).join("");
                textResult = textResult.replace(/\\/g, "")
                textResult = '{"' + textResult + '}';
                textResult = textResult.replace(/,\}/g, '}');
                console.log(JSON.parse(textResult))
                return JSON.parse(textResult);
            } catch (error) {
                events.notice(fy("notice.loaderror") + error,2);
                events.hideLoader();
                throw error;
            }
        }

        /** 25.18 真实开包概率获取 */
        events.getRealProbability = async (pack) => {
            try {
                let packName = services.Localization.localize(pack.packName);
                packName = packName.replace(/\s+/g, '-').replace(/\//g, '&');
                const packResponse = await events.externalRequest("GET",`https://www.futnext.com/pack/${packName}/${pack.id}/`,false,`text/x-component`);
                let textResponse = packResponse;
                let textStart = textResponse.indexOf(`rarityOdds`);
                let textEnd = textResponse.indexOf(`"returns`);

                let textResult = _.slice(textResponse, textStart, textEnd).join("");

                let step1 = textResult.replace(/\\/g, '');
                let step2 = _.slice(step1, step1.indexOf(`[`) + 1, step1.indexOf(`]`)).join("");

                const jsonData = JSON.parse(`[${step2}]`);

                let resultJson = [];
                _.forEach(jsonData,j => {
                    let odds = j.odds * 100;
                    resultJson.push({
                        id: j.rarity.id,
                        odds: `${odds.toFixed(odds >= 0.1 ? 1 : 2)}%`,
                        count: (1 / j.odds).toFixed(0),
                        name: services.Localization.localize("item.raretype" + j.rarity.id)
                    })
                })
                _.forEach(resultJson,r => {
                    let eaOdds = _.find(pack.odds, (item) => item.description.includes(`${r.name} `));
                    if(eaOdds){
                        r.ea = eaOdds.odds;
                    }else{
                        r.ea = "-";
                    }
                })
                console.log(resultJson)
                return resultJson;
            } catch (error) {
                events.notice(fy("notice.loaderror") + error,2);
                events.hideLoader();
                throw error;
            }
        }


        /** 25.20 球员自动购买 界面进入事件 */
        events.goToAutoBuy = (e) => {
            let nav = cntlr.current().getNavigationController();
            if(nav){
                if(info.autobuy.controller){
                    nav.pushViewController(info.autobuy.controller);
                }else{
                    let criteria = new UTSearchCriteriaDTO;
                    criteria.type = SearchType.PLAYER;
                    let controller = isPhone() ? new UTClubSearchResultsViewController : new controllers.club.ClubSearchResultsLandscape;
                    controller.initWithSearchCriteria(criteria);


                    controller.dealloc = function() {
                        info.autobuy.controller = this;
                    }

                    let searchController = isPhone() ? controller : controller._listController;

                    searchController._fsuAutoBuy = true;
                    searchController._fsuAutoBuyPlayers = [];

                    let rightContainer = new UTPlayerBioViewController;
                    rightContainer.initWithItem(new UTItemEntity);
                    rightContainer.isFsuAutoBuy = true;
                    rightContainer.getView().getRootElement().style.width = "40%";
                    rightContainer.getView().addClass("fsu-autobuy-right");
                    rightContainer.getView().isFsuAutoBuy = true;
                    searchController._fsuAutoBuyRight = rightContainer;

                    nav.pushViewController(controller);
                }
            }
        }

        //** 25.20 球员自动购买 球员搜索 */
        events.autoBuySearchPlayer = (inputSelected,controller) => {
            let criteria = new UTSearchCriteriaDTO;
            criteria.count = 200;
            criteria.defId.push(inputSelected.id)
            criteria.sortBy = "ovr"
            services.Item.searchConceptItems(criteria).observe(controller,
                async(e, t)=> {
                    if (e.unobserve(controller),JSUtils.isObject(t.response) && t.response.items) {
                        try {
                            const PlayerName = inputSelected.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/ø/g, "o");
                            const playerData = await events.getFutbinUrl(`https://www.futbin.org/futbin/api/searchPlayersByName?playername=${PlayerName}&year=${info.base.year}`);

                            let players = _.cloneDeep(t.response.items);
                            _.forEach(players,(p) => {
                                p._fsuPrice = 0;
                                p._fsuClosing = 0;
                                p._fsuMin = 0;
                                p._fsuMax = 0;
                                p._fsuFutbinId = "0";
                                let futbinPlayerData = _.find(playerData.data, { resource_id: _.toString(p.definitionId) });
                                if (futbinPlayerData && futbinPlayerData.pc_MaxPrice && futbinPlayerData.ps_MinPrice) {
                                    p.untradeable = false;
                                    p._fsuFutbinId = futbinPlayerData.ID;

                                    5
                                    p._fsuMin = futbinPlayerData[`${info.base.platform}_MinPrice`];
                                    p._fsuMax = futbinPlayerData[`${info.base.platform}_MaxPrice`];
                                    let pClosing = futbinPlayerData[`${info.base.platform}_LCPClosing`]
                                    if(pClosing !== null){
                                        p._fsuClosing = pClosing;
                                    }
                                    let pPrice = futbinPlayerData[`${info.base.platform}_LCPrice`]
                                    if(pPrice !== null){
                                        p._fsuPrice = pPrice;
                                        info.roster.data[p.definitionId] = {
                                            "n": pPrice,
                                            "t": pPrice.toLocaleString(),
                                        }
                                    }
                                }
                                p.concept = false;
                            })
                            controller._fsuAutoBuyPlayers = players;
                            controller.getView().getRootElement().style.width = "60%";
                            controller._requestItems()
                        }catch(error) {
                            console.log(error)
                            return;
                        }
                    }else{
                        NetworkErrorManager.handleStatus(t.status)
                    }
                    events.hideLoader()
                }
            )
        }

        //** 25.20 球员自动购买 球员点击右侧界面拦截 */
        const UTClubSearchResultsViewController_onTableCellSelected = UTClubSearchResultsViewController.prototype.onTableCellSelected;
        UTClubSearchResultsViewController.prototype.onTableCellSelected = function(e, t, i) {
            if (this._fsuAutoBuy) {
                events.autoBuyRightRefresh(this._fsuAutoBuyRight,i.item)
                if (isPhone()) {
                    this.getNavigationController().pushViewController(this.getView()._list._fsuAutoBuyRight);
                }else{
                    _.forEach(e._list.listRows, (rows) => {
                        rows.setSelected(rows.data.definitionId == i.item.definitionId);
                    })
                }
            }else{
                UTClubSearchResultsViewController_onTableCellSelected.call(this, e, t, i);
            }
        }
        events.autoBuyRightRefresh = function(controller, item){
            controller.pinnedItemController.setItem(item)
            controller.pinnedItem = item;
            controller.render()
        }

        //** 25.20 球员自动购买 载入球员右侧页面拦截 */
        const UTClubSearchResultsViewController_refreshPinnedItem = UTClubSearchResultsViewController.prototype.refreshPinnedItem;
        UTClubSearchResultsViewController.prototype.refreshPinnedItem = function() {
            if (this._fsuAutoBuy && this._fsuAutoBuyPlayers.length) {
                events.autoBuyRightRefresh(this._fsuAutoBuyRight,this._fsuAutoBuyPlayers[0]);
            }else{
                UTClubSearchResultsViewController_refreshPinnedItem.call(this);
            }
        }

        //** 25.20 球员自动购买 设置右侧界面拦截 */
        const UTSplitViewController_setRightController = UTSplitViewController.prototype.setRightController;
        UTSplitViewController.prototype.setRightController = function(t, e) {
            const leftController = this.leftController;
            if(leftController && leftController.className && leftController.className == "UTClubSearchResultsViewController" && _.has(leftController,"_fsuAutoBuy")){
                UTSplitViewController_setRightController.call(this, leftController._fsuAutoBuyRight, e);
            }else{
                UTSplitViewController_setRightController.call(this, t, e);
            }
        }

        //** 25.20 球员自动购买 右侧界面tabs创造 */
        const UTPlayerBioView_setupNavigation = UTPlayerBioView.prototype.setupNavigation;
        UTPlayerBioView.prototype.setupNavigation = function(t, e) {
            if(this.isFsuAutoBuy){
                this._navigation.clearTabs(),
                this._navigation.addTab(444101, fy("autobuy.tabs.text0")),
                this._navigation.addTab(444102, fy("autobuy.tabs.text1")),
                this._navigation.setActiveTab(444101),
                this._navigation.addTarget(this, t, EventType.TAP),
                this._navigation.layoutSubviews()
                this._fsuSubviews = {};
            }else{
                UTPlayerBioView_setupNavigation.call(this, t, e);
            }
        }

        //** 25.20 球员自动购买 右侧界面tabs点击事件拦截 */
        const UTPlayerBioView_render = UTPlayerBioView.prototype.render;
        UTPlayerBioView.prototype.render = function(tabId, item, i, r) {
            if(this.isFsuAutoBuy){
                DOMKit.empty(this.__dataDisplay);
                if(tabId == 444101 || !tabId){
                    if (!_.has(info.autobuy.infoViews, item.definitionId)) {
                        info.autobuy.infoViews[item.definitionId] = events.autoBuyCreateInfoView(item);
                    }
                    this.__dataDisplay.appendChild(info.autobuy.infoViews[item.definitionId].getRootElement());
                }else if(tabId == 444102){
                    if(_.isEmpty(info.autobuy.logView)){
                        events.autoBuyCreateLogView();
                    }
                    this.__dataDisplay.appendChild(info.autobuy.logView.getRootElement());
                }
                
            }else{
                UTPlayerBioView_render.call(this, tabId, item, i, r);
            }
        }


        //** 25.20 球员自动购买 创建右侧信息界面 */
        events.autoBuyCreateInfoView = (item) => {
            let view = new EAView;
            let display = view.getRootElement();

            view._item = item;

            let titleBox = events.createElementWithConfig("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    alignItems: "center",
                    boxSizing: "border-box",
                    width: "100%",
                    padding: "1rem",
                }
            })
            let titleText = events.createElementWithConfig("div", {
                textContent: fy("autobuy.info.title"),
                style: {
                    fontSize: "1.2rem",
                }
            })
            titleBox.appendChild(titleText);

            let titleClear = new UTFlatButtonControl;
            titleClear.init();
            titleClear.setText(services.Localization.localize("search.button.clear"));
            titleClear.setInteractionState(!1);
            titleClear.getRootElement().classList.add("camel-case");
            titleBox.appendChild(titleClear.getRootElement());
            view._clearButton = titleClear

            display.appendChild(titleBox);

            let priceBox = events.createElementWithConfig("div", {
                style: {
                    padding: "0 1rem",
                }
            })

            let minBox = events.createElementWithConfig("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }
            })

            let minText = events.createElementWithConfig("div", {
                textContent: fy("autobuy.info.mintext"),
                style: {
                    paddingRight: "1rem",
                }
            })
            minBox.appendChild(minText)

            const minBidPrice = item._fsuMin || AUCTION_MIN_BID;
            const maxBidPrice = item._fsuMax || AUCTION_MAX_BID;

            let minBuy = new UTNumericInputSpinnerControl;
            minBuy.init()
            minBuy.setMinValue(minBidPrice);
            minBuy.setMaxValue(UTCurrencyInputControl.getIncrementBelowVal(maxBidPrice));
            minBox.appendChild(minBuy.getRootElement())
            view._min = minBuy
            priceBox.appendChild(minBox)

            let maxBox = events.createElementWithConfig("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                }
            })

            let maxText = events.createElementWithConfig("div", {
                textContent: fy("autobuy.info.maxtext"),
                style: {
                    paddingRight: "1rem",
                }
            })
            maxBox.appendChild(maxText)

            let maxBuy = new UTNumericInputSpinnerControl;
            maxBuy.init()
            maxBuy.setMinValue(UTCurrencyInputControl.getIncrementAboveVal(minBidPrice));
            maxBuy.setMaxValue(maxBidPrice);
            maxBox.appendChild(maxBuy.getRootElement())
            view._max = maxBuy
            priceBox.appendChild(maxBox)

            titleClear.addTarget(view, () => {
                maxBuy.setValue(0);
                minBuy.setValue(0);
            }, EventType.TAP)

            minBuy.getInput().addTarget(view, () => {
                events.autoBuyRightMinBuyChanged(minBuy, maxBuy, titleClear)
            }, EventType.CHANGE);

            maxBuy.getInput().addTarget(view, () => {
                events.autoBuyRightMaxBuyChanged(minBuy, maxBuy, titleClear)
            }, EventType.CHANGE);

            view.setPriceBtn = events.createButton(
                new UTStandardButtonControl(),
                fy("autobuy.info.setprice"),
                () => {
                    maxBuy.setValue(item._fsuPrice);
                    minBuy.setValue(UTCurrencyInputControl.getIncrementBelowVal(item._fsuPrice));
                },
                "call-to-action mini"
            );
            view.setPriceBtn.setInteractionState(item._fsuPrice);
            view.goToSalesBtn  = events.createButton(
                new UTStandardButtonControl(),
                fy("autobuy.info.gotosales"),
                () => {
                    GM_openInTab(`https://www.futbin.com/${info.base.year}/sales/${item._fsuFutbinId}/${item.getStaticData().name.toLowerCase()}?platform=${info.base.platform}`, { active: true, insert: true, setParent :true });
                },
                "call-to-action mini"
            )

            let btnBox = events.createElementWithConfig("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "end",
                    position: "absolute",
                    top: "0",
                    right: "-1.6rem",
                    flexDirection: "column",
                    height: "100%",
                },
                classList: ["fsu-autobuy-btn"],
            })
            btnBox.appendChild(view.setPriceBtn.getRootElement())
            btnBox.appendChild(view.goToSalesBtn.getRootElement())
            view._cardBtnBox = btnBox;

            display.appendChild(priceBox)

            return view;
        }

        //** 25.20 球员自动购买 创建右侧日志界面 */
        events.autoBuyCreateLogView = (item) => {
            let view = new EAView;
            let display = view.getRootElement();
            info.autobuy.logView = view;
        }

        //** 25.20 球员自动购买 右侧点选信息 */
        events.autoBuyRightRenderInfo = (view, item) => {
            let display = view.__dataDisplay;
            // view.createHeader(display, services.Localization.localize("extendedPlayerInfo.tab.stats"));
            // view.createHeader(display, fy("autobuy.info.title"));
            // view.layoutSubviews()

            let titleBox = events.createElementWithConfig("div",{
                style:{
                    display:"flex",
                    justifyContent:"space-between",
                    overflow:"hidden",
                    alignItems:"center",
                    boxSizing:"border-box",
                    width:"100%",
                    padding:"1rem",
                }
            })
            let titleText = events.createElementWithConfig("div",{
                textContent:fy("autobuy.info.title"),
                style:{
                    fontSize:"1.2rem",
                }
            })
            titleBox.appendChild(titleText)

            let titleClear = new UTFlatButtonControl
            titleClear.init()
            titleClear.setText(services.Localization.localize("search.button.clear"))
            titleClear.setInteractionState(!1)
            titleClear.getRootElement().classList.add("camel-case")
            titleBox.appendChild(titleClear.getRootElement())

            display.appendChild(titleBox)


            let priceBox = events.createElementWithConfig("div",{
                style:{
                    padding:"0 1rem",
                }
            })

            let minBox = events.createElementWithConfig("div",{
                style:{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                }
            })

            let minText = events.createElementWithConfig("div",{
                textContent:fy("autobuy.info.mintext"),
                style:{
                    paddingRight:"1rem",
                }
            })
            minBox.appendChild(minText)

            const minBidPrice = item._fsuMin || AUCTION_MIN_BID;
            const maxBidPrice = item._fsuMax || AUCTION_MAX_BID;

            let minBuy = new UTNumericInputSpinnerControl;
            minBuy.init()
            minBuy.setMinValue(minBidPrice);
            minBuy.setMaxValue(UTCurrencyInputControl.getIncrementBelowVal(maxBidPrice));
            minBox.appendChild(minBuy.getRootElement())
            priceBox.appendChild(minBox)

            let maxBox = events.createElementWithConfig("div",{
                style:{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    marginTop:"1rem",
                }
            })

            let maxText = events.createElementWithConfig("div",{
                textContent:fy("autobuy.info.maxtext"),
                style:{
                    paddingRight:"1rem",
                }
            })
            maxBox.appendChild(maxText)

            let maxBuy = new UTNumericInputSpinnerControl;
            maxBuy.init()
            maxBuy.setMinValue(UTCurrencyInputControl.getIncrementAboveVal(minBidPrice));
            maxBuy.setMaxValue(maxBidPrice);
            maxBox.appendChild(maxBuy.getRootElement())
            priceBox.appendChild(maxBox)

            titleClear.addTarget(view, () => {
                maxBuy.setValue(0);
                minBuy.setValue(0);
            }, EventType.TAP)

            console.log(minBuy,maxBuy)

            minBuy.getInput().addTarget(view, () => {
                events.autoBuyRightMinBuyChanged(minBuy,maxBuy,titleClear)
            }, EventType.CHANGE);

            maxBuy.getInput().addTarget(view, () => {
                events.autoBuyRightMaxBuyChanged(minBuy,maxBuy,titleClear)
            }, EventType.CHANGE);

            display.appendChild(priceBox)
        }

        //** 25.20 球员自动购买 minbuy设置 */
        events.autoBuyRightMinBuyChanged = (eMin,eMax,eClear) =>{
            let min = eMin.getValue(),max = eMax.getValue();
            eClear.setInteractionState(eMin.getMinValue() < min || eMax.getMinValue() < max);
            if(0 !== min && min >= max && min !== eMin.getMinValue()){
                eMax.setValue(UTCurrencyInputControl.getIncrementAboveVal(min));
            }
        }

        //** 25.20 球员自动购买 maxbuy设置 */
        events.autoBuyRightMaxBuyChanged = (eMin,eMax,eClear) =>{
            let min = eMin.getValue(),max = eMax.getValue();
            eClear.setInteractionState(eMin.getMinValue() < min || eMax.getMinValue() < max);
            if(0 !== max && min >= max && min !== eMin.getMinValue()){
                eMin.setValue(UTCurrencyInputControl.getIncrementBelowVal(max));
            }
        }

        //** 25.20 球员自动购买 右侧点选日志 */
        events.autoBuyRightRenderLog = (view, item) => {

        }

        //** 25.20 球员自动购买 右侧界面构造 */

        events.autoBuyCreateItemController = (controller,item) => {

        }

        /** 25.20 球员自动购买 入口创建 */
        const UTTransfersHubView_init = UTTransfersHubView.prototype.init;
        UTTransfersHubView.prototype.init = function() {
            UTTransfersHubView_init.call(this);
            return;
            let autoBuyTile = new UTPlayerPicksTileView();
            autoBuyTile.init();
            autoBuyTile.title = fy("autobuy.tile.title");
            autoBuyTile.__label.innerHTML = fy("autobuy.tile.content");
            autoBuyTile.addClass("col-1-1");
            const hubMessages = services.Messages.messagesRepository.getHubMessages();
            if(hubMessages.length){
                const firstMessage = hubMessages[0];
                if(firstMessage.goToLink == "gotostore"){
                    let img = autoBuyTile.getRootElement().querySelector(".img")
                    img.style.backgroundImage = `url(${firstMessage.bodyImagePath})`;
                    img.style.width = "22rem";
                    img.style.right = "-1rem";
                }
            }
            autoBuyTile.addTarget(
                autoBuyTile,
                (e) => {
                    events.goToAutoBuy();
                },
                EventType.TAP
            )
            this._extLinkTile.getRootElement().after(autoBuyTile.getRootElement());

            this._fsuAutoBuyTile = autoBuyTile;

        }


        /** 25.20 存储头像图片 */
        let UTItemView_requestResource = UTItemView.prototype.requestResource;
        UTItemView.prototype.requestResource = async function (t, e, i, r) {
            /** 注释掉 网页端开放没实际意义 */
            if (false && e === ItemAssetType.MAIN && i.isPlayer() && repositories.Item.club.items.get(i.id)) {
                const imgName = t.split("/").pop().split("?")[0].replace(/\.[^/.]+$/, '');

                // 优先尝试获取缓存的图片
                const imgData = await events.getImageByName(imgName);
                let imgUrl = t;  // 默认使用原始 URL

                if (imgData) {
                    console.log("✅ 从缓存获取", imgName);
                    imgUrl = imgData;  // 使用缓存的图片 URL
                } else {
                    // 如果缓存中没有，网络请求图片并保存
                    const res = await fetch(t);
                    const blob = await res.blob();
                    if (blob.type === "image/png") {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const img = new Image();
                            img.src = reader.result; // 使用 FileReader 的结果（dataURL）

                            img.onload = () => {
                                // 将图像绘制到 canvas 上
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx.drawImage(img, 0, 0);

                                // 压缩图像并获取 dataURL（调整质量）
                                const dataURL = canvas.toDataURL('image/webp', 0.5); // 第二个参数为质量，0 到 1 之间

                                // 存储压缩后的 dataURL
                                events.saveImageToIndexedDB(imgName, dataURL);
                            };
                        };
                        reader.readAsDataURL(blob); // 读取为 dataURL
                    }
                }

                // 统一调用 requestResource，减少重复代码
                UTItemView_requestResource.call(this, imgUrl, e, i, r);
            } else {
                UTItemView_requestResource.call(this, t, e, i, r); // 其他情况调用原始方法
            }
        };

        /** 25.20 打开indexedDB */
        events.getDB = async function () {
            if (info.base.imgDB) return info.base.imgDB;

            return new Promise((resolve, reject) => {
                const request = indexedDB.open('ImageCacheDB', 1);

                request.onupgradeneeded = function (event) {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('images')) {
                        db.createObjectStore('images'); // 默认 key
                    }
                };

                request.onsuccess = function (event) {
                    info.base.imgDB = event.target.result;
                    resolve(info.base.imgDB);
                };

                request.onerror = function (event) {
                    reject(event.target.error);
                };
            });
        }

        /** 25.20 存储图片到indexedDB */
        events.saveImageToIndexedDB = async function(name, dataURL) {
            const db = await events.getDB();

            const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 当前 +30天

            const tx = db.transaction('images', 'readwrite');
            const store = tx.objectStore('images');

            const data = {
                dataURL,
                expiresAt
            };

            store.put(data, name);

            return new Promise((resolve, reject) => {
                tx.oncomplete = () => {
                    console.log(`✅ 已保存图片：${name}`);
                    resolve();
                };
                tx.onerror = reject;
            });
        }

        //** 25.20 获取图片 */
        events.getImageByName = async function (imgName) {
            if (info.base.imgCache[imgName]) {
                return info.base.imgCache[imgName];  // 如果已经缓存了，就直接返回
            }

            const db = await events.getDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('images', 'readonly');
                const store = tx.objectStore('images');
                const req = store.get(imgName);

                req.onsuccess = () => {
                    const result = req.result;
                    if (result && result.dataURL) {
                        // 如果找到了 dataURL，直接返回
                        info.base.imgCache[imgName] = result.dataURL;  // 缓存 dataURL
                        resolve(result.dataURL);  // 返回 data URL
                    } else {
                        resolve(null);  // 没有找到，返回 null
                    }
                };

                req.onerror = reject;
            });
        };

        //** 25.20 删除过期的图片 */
        SBCCount.createElement = (ne) => {
            info.nave = ne;
            if(!_.has(info.nave,"SBCCount")){
                info.nave.SBCCount = events.createButton(
                    new UTButtonControl(),
                    isPhone() ? info.SBCCount.count : fy(["sbccount.btntext",info.SBCCount.count]),
                    async(e) => {
                        events.popup(
                            fy("sbccount.popupt"),
                            fy("sbccount.popupm"),
                            (t) => {
                            }
                        )
                    },
                    isPhone() ? `fsu-navsbccount` : ``
                )
                info.nave.SBCCount.getRootElement().style.cursor = "pointer";
                if(isPhone()){
                    let existingElement = info.nave._navbar.__currencies.firstChild;
                    info.nave._navbar.__currencies.insertBefore(info.nave.SBCCount.getRootElement(),existingElement);
                }else{
                    info.nave._navbar.__clubInfo.querySelector(`.view-navbar-clubinfo-est`).style.display = "none";
                    info.nave._navbar.__clubInfo.querySelector(`.view-navbar-clubinfo-data`).appendChild(info.nave.SBCCount.getRootElement());
                }
            }else{
                info.nave.SBCCount.getRootElement().innerText = isPhone() ? info.SBCCount.count : fy(["sbccount.btntext",info.SBCCount.count])
            }
        };

        //** 25.21 其他界面进入未分配列表 */
        events.goToUnassigned = (controller) => {
            repositories.Item.unassigned.reset();
            services.Item.requestUnassignedItems().observe(controller, (e, t) => {
                if(e.unobserve(controller),t.success && JSUtils.isObject(t.response)){
                    if(0 < t.response.items.length){
                        const nowController = controller && controller instanceof EAViewController ? controller : cntlr.current();
                        UTStoreViewController.prototype.gotoUnassigned.call(nowController);
                    }
                }
            });
        }
        
        //** 25.21 批量开包：开启球员包 */
        events.openPacks = async (packId, packName, packNum) => {
            const controller = cntlr.current();
            repositories.Item.unassigned.reset();
            const unassignedItems = await new Promise((resolve) => {
                services.Item.requestUnassignedItems().observe(controller, (e, t) => {
                    e.unobserve(controller);
                    resolve(t);
                });
            });
            if (unassignedItems.success && JSUtils.isObject(unassignedItems.response)) {
                if(0 < unassignedItems.response.items.length){
                    events.hideLoader();
                    cntlr.current().gotoUnassigned();
                    events.notice(fy("openpack.unassigned.notice"), 2);
                    return;
                }
            }else{
                events.hideLoader();
                errorNotice(unassignedItems);
                return;
            }
            
            function errorNotice(e) {
                const code = e.error?.code || e.status;
                events.notice(fy(["openpack.openerror.notice", code]), 2);
            }

            // 获取包数据
            const storeResult = await new Promise((resolve) => {
                services.Store.getPacks(PurchasePackType.ALL, true, true).observe(controller, (e, t) => {
                    e.unobserve(controller);
                    resolve(t);
                });
            });
        
            if (!storeResult.success || !JSUtils.isObject(storeResult.response)) {
                events.hideLoader();
                errorNotice(storeResult);
                return;
            }
        
            const loadingTitle = ["openpack.progress.loadertext1", packName];
            events.changeLoadingText(loadingTitle);
        
            const allPacks = _.filter(repositories.Store.myPacks.values(), { id: packId });
            if (allPacks.length < packNum) {
                events.notice(fy(["openpack.packnotenough.notice", packName, allPacks.length, packNum]), 2);
                return;
            }
        
            events.showLoader();
            info.run.openPacks = true
            const packs = _.take(allPacks, packNum);
            const assignPlayer = [];
            let packOpened = 0;
            let errorOccurred = false;
        
            const toUnassigned = (showError = false) => {
                if (showError) {
                    services.Notification.queue([
                        services.Localization.localize("notification.item.moveFailed"),
                        UINotificationType.NEGATIVE
                    ]);
                }
                repositories.Store.setDirty();
                cntlr.current().gotoUnassigned();
                popupEnd();
            };
        
            const popupEnd = () => {
                events.hideLoader();
                if (assignPlayer.length) {
                    repositories.Store.setDirty();
                    console.log(assignPlayer);
                    
                    const result = _.reduce(assignPlayer, (acc, e) => {
                        if (e.storeLoc === 1) acc.clubCount++;
                        else if (e.storeLoc === 2) acc.storageCount++;
                    
                        const rating = e.rating;
                        if (rating > acc.playerMaxRating) {
                            acc.playerMaxRating = rating;
                        }
                        if (e.packCount > acc.packCount) {
                            acc.packCount = e.packCount;
                        }
                        return acc;
                    }, {
                        clubCount: 0,
                        storageCount: 0,
                        packCount: 0,
                        playerMaxRating: 0
                    });
                    
                    const { clubCount, storageCount, packCount, playerMaxRating } = result;
                    const showPlayers = _.orderBy(assignPlayer, ["rareflag", "rating"], ["desc", "desc"]).slice(0, 20);
                    const popupText = fy(["openpack.result.popupm1", packCount, packNum - packCount, clubCount, storageCount, showPlayers.length, playerMaxRating]);
                    const popupTitle = fy(["openpack.result.popupt", packName]);
                    events.openPacksResultPopup(popupTitle, popupText, showPlayers);
                }
            };
        
            try {
                for (const [index, pack] of packs.entries()) {
                    if(!info.run.openPacks){
                        break;
                    }
                    events.changeLoadingText(loadingTitle,["openpack.progress.loadertext2", index + 1, packNum]);
        
                    const openResult = await new Promise((resolve) => {
                        pack.open().observe(controller, (e, t) => {
                            e.unobserve(controller);
                            resolve(t);
                        });
                    });
        
                    if (!openResult.success || !JSUtils.isObject(openResult.response)) {
                        errorNotice(openResult);
                        errorOccurred = true;
                        break;
                    }else{
                        events.loadPlayerInfo(openResult.response.items);
                    }
        
                    if (pack instanceof UTStoreItemPackEntity && pack?.isMyPack) {
                        services.User.getUser().decrementNumUnopenedPacks();
                    }
        
                    const logData = {
                        [RevenueAnalytics.Key.CURRENCY]: GameCurrency.COINS,
                        [RevenueAnalytics.Key.TYPE]: pack?.dealType ?? "unknown",
                        [RevenueAnalytics.Key.ID]: pack?.id?.toString() ?? "unknown"
                    };
                    const sdk = unsafeWindow?.services?.revenueSDK;
                    if (sdk?.initialized && typeof sdk.logEvent === "function") {
                        sdk.logEvent(RevenueAnalytics.Event.STORE_PACK_PURCHASED, logData);
                    } else {
                        console.warn("⚠️ revenueSDK 尚未初始化，跳过上报");
                    }
        
                    packOpened++;
        
                    const toClubPlayers = [];
                    const toStoragePlayers = [];
        
                    for (const item of openResult.response.items) {
                        const inClub = events.getItemBy(2, { definitionId: item.definitionId , academy:null}, false, repositories.Item.club.items.values());
        
                        if (inClub.length) {
                            console.log(item.rating,repositories.Item.numItemsInCache(ItemPile.STORAGE),toStoragePlayers.length)
                            if (item.rating > info.set.goldenrange && repositories.Item.numItemsInCache(ItemPile.STORAGE) + toStoragePlayers.length < 100) {
                                item.duplicateId = _.find(inClub).id;
                                item.pile = ItemPile.STORAGE;
                                item.injuryType = PlayerInjury.NONE;
                                toStoragePlayers.push(item);
                            }
                        } else {
                            toClubPlayers.push(item);
                        }
                    }
        
                    if (toClubPlayers.length > 0) {
                        const moveClubResult = await new Promise((resolve) => {
                            services.Item.move(toClubPlayers, ItemPile.CLUB).observe(controller, (e, t) => {
                                e.unobserve(controller);
                                resolve(t);
                            });
                        });
                        if (moveClubResult.success) {
                            assignPlayer.push(...toClubPlayers.map(item => {
                                const copy = _.cloneDeep(item);
                                copy.storeLoc = 1;
                                copy.packCount = index + 1;
                                return copy;
                            }));
                        } else {
                            toUnassigned(true);
                            errorOccurred = true;
                            break;
                        }
                    }

                    if (toStoragePlayers.length > 0) {
                        const moveStorageResult = await new Promise((resolve) => {
                            services.Item.move(toStoragePlayers, ItemPile.STORAGE, !0).observe(controller, (e, t) => {
                                e.unobserve(controller);
                                resolve(t);
                            });
                        });
                        if (moveStorageResult.success) {
                            assignPlayer.push(...toStoragePlayers.map(item => {
                                const copy = _.cloneDeep(item);
                                copy.storeLoc = 2;
                                copy.packCount = index + 1;
                                return copy;
                            }));
                        } else {
                            toUnassigned(true);
                            errorOccurred = true;
                            break;
                        }
                    }
        
                    if (toClubPlayers.length + toStoragePlayers.length !== openResult.response.items.length) {
                        toUnassigned(true);
                        errorOccurred = true;
                        break;
                    }
                    
                    console.log(`✅ 已开包：${pack.id}`, openResult.response.items);
                    await new Promise((resolve) => {
                        const randomDelay = 500 + Math.floor(Math.random() * 1000); // 2000-4000毫秒之间的随机值
                        setTimeout(resolve, randomDelay);
                    });
                }
            } finally {
                events.hideLoader();
                info.run.openPacks = false;
                if (!errorOccurred && packOpened > 0) {
                    popupEnd();
                }
            }
        };

        //** 25.21 批量开包：开包确认弹窗 */
        events.openPacksConfirmPopup = (packId, packName, packCount) => {
            let popupController = new EADialogViewController({
                dialogOptions: [
                    { labelEnum: enums.UIDialogOptions.OK },
                    { labelEnum: enums.UIDialogOptions.CANCEL }
                ],
                message: fy(["openpack.storebtn.popupm",info.set.goldenrange]),
                title: fy(["openpack.storebtn.popupt", packName]),
                type: EADialogView.Type.MESSAGE
            });
            popupController.init();
            let popupView = popupController.getView();
            let numberInput = new UTNumericInputSpinnerControl;
            numberInput.init();
            numberInput._currencyInput.roundToNearestStep = (t) => {
                return t;
            }
            numberInput._currencyInput.increase = function(e) {
                this.value = (JSUtils.isNumber(e) ? e : this.value) + 1;
            };
            
            numberInput._currencyInput.decrease = function(e) {
                this.value = (JSUtils.isNumber(e) ? e : this.value) - 1;
            };
            Object.assign(numberInput.getRootElement().style, {
                height: '3rem',
                width: '80%',
                margin: '2rem auto 1rem'
            });
            Object.assign(numberInput._decrementBtn.getRootElement().style, {
                height: '3rem',
                width: '4rem',
            });
            Object.assign(numberInput._incrementBtn.getRootElement().style, {
                height: '3rem',
                width: '4rem',
            });
            Object.assign(numberInput._currencyInput.getRootElement().style, {
                height: '3rem',
                backgroundImage: 'none',
                backgroundColor: '#222',
                paddingRight: '0',
                textAlign: 'center',
                fontSize: '1.4rem',
            });
            numberInput.setMaxValue(packCount);
            numberInput.setMinValue(1);
            numberInput.setValue(packCount);
            popupView.__msg.appendChild(numberInput.getRootElement())
            popupController.onExit.observe(popupController,(e, z) => {
                e.unobserve(popupController);
                if(z == 2){
                    //console.log(packId, packName, packCount, numberInput.getValue())
                    events.showLoader();
                    events.openPacks(packId, packName, numberInput.getValue());
                }
            });
            console.log(popupView, numberInput)
            gPopupClickShield.setActivePopup(popupController);
        }
        
        //** 25.21 批量开包：球员包结果弹窗 */
        events.openPacksResultPopup = (title, text, players) => {
            let popupController = new EADialogViewController({
                dialogOptions: [{ labelEnum: enums.UIDialogOptions.OK }],
                message: "",
                title: title,
                type: EADialogView.Type.MESSAGE
            });
            popupController.init();
            popupController.onExit.observe(popupController,(e, z) => {
                e.unobserve(popupController);
                if(cntlr.current() instanceof UTStorePackViewController){
                    cntlr.current().getStorePacks(true);
                }
            });
            let popupView = popupController.getView();
            popupView.__msg.remove();
            let popupBox = events.createElementWithConfig("div",{
                style:{
                    padding: "0 1rem 1.5rem 1rem",
                }
            })
            if(players.length){
                popupController.__listBox = events.createElementWithConfig("div",{
                    className:"ut-store-reveal-modal-list-view",
                    style:{
                        borderRadius:"0",
                    }
                })
                popupController.__list = events.createElementWithConfig("ul",{
                    className:"itemList",
                })
                popupController.__listBox.appendChild(popupController.__list);
                popupController.listRows = players.map(i => {
                    var o = new UTItemTableCellView;
                    o.setData(i, void 0, ListItemPriority.DEFAULT);
                    o.render();
                    popupController.__list.appendChild(o.getRootElement())
                    return o
                })
                popupBox.appendChild(popupController.__listBox)
            }
            popupController.__text = events.createElementWithConfig("div",{
                textContent: text,
                style:{
                    paddingTop: ".5rem",
                    fontSize: "1rem"
                }
            })
            popupBox.appendChild(popupController.__text)
            popupController.__desc = events.createElementWithConfig("div",{
                textContent: fy("openpack.result.popupm2"),
                style:{
                    paddingTop: ".5rem",
                    fontSize: "1rem",
                    opacity: ".5"
                }
            })
            popupBox.appendChild(popupController.__desc)
            popupView.getRootElement().querySelector(".ea-dialog-view--body").prepend(popupBox);
            gPopupClickShield.setActivePopup(popupController);
        }

        SBCCount.changeCount = () => {
            if(_.has(info.nave,"SBCCount")){
                info.nave.SBCCount.setText(isPhone() ? info.SBCCount.count : fy(["sbccount.btntext",info.SBCCount.count]))
            }
        };

        SBCCount.init = () => {
            let a = JSON.parse(GM_getValue("SBCCount","{}")),
                DT = events.getStartOfDayTimestamp(),
                b = {
                    count: 0,
                    time: DT
                };
            if(a && typeof a === 'object'){
                if(a.time == DT){
                    b.count = a.count;
                }
            }else{
                GM_setValue("SBCCount",JSON.stringify(b));
            }
            console.log(b)
            info.SBCCount = b;
        }

        lock.init = function(){
            let a = JSON.parse(GM_getValue("lock_25","[]")),b = [];
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
            GM_setValue("lock_25",JSON.stringify(info.lock));
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
            events.notice(fy("notice.setsuccess"),0)
        }
        unsafeWindow.call = call;
        unsafeWindow.info = info;
        unsafeWindow.cntlr = cntlr;
        unsafeWindow.events = events;
        unsafeWindow.fy = fy;

    }

    //EasySBC 联动程序
    function easysbc() {
        var reactNodeSuffix = "";
        var academy = JSON.parse(GM_getValue("academy","{}"));
        var players = JSON.parse(GM_getValue("players","{}"));
        unsafeWindow.academy = academy;
        unsafeWindow.players = players;
        const observer = new MutationObserver(() => {
            if (document.readyState === 'complete' && window._ && _.includes(location.href,"www.easysbc.io/evolutions")) {
                console.log('加载成功');
                console.log("开始");
                if(reactNodeSuffix == ""){
                    let bodyElement = document.getElementById('body');
                    for (const key in bodyElement) {
                        if (key.startsWith('__reactFiber')) {
                        if(bodyElement[key] && _.isObject(bodyElement[key])){
                            reactNodeSuffix = key.replace("__reactFiber", "");
                            break;
                        }
                        }
                    }
                }
                if(reactNodeSuffix !== ""){
                    if(!document.getElementById("fsu-tips") && document.querySelector("section.rounded-t-lg")){
                        let fsuSection = document.createElement('section');
                        fsuSection.classList.add('flex', 'flex-col', 'justify-between', 'w-full', 'border', 'rounded-lg');
                        fsuSection.classList.add('desktop:flex-row', 'desktop:p-2', 'bg-gray-775', 'border-primary-dark');
                        fsuSection.id = 'fsu-tips';

                        let fsuSectionDiv = document.createElement('div');
                        fsuSectionDiv.classList.add('text-secondary', 'w-full', 'text-center', 'md:p-2', 'text-sm');
                        fsuSectionDiv.textContent = "如要确保数据准确，请先使用插件登陆FUTWEB缓存数据后再使用！"
                        fsuSection.appendChild(fsuSectionDiv);
                        document.querySelector("section.rounded-t-lg").after(fsuSection)
                    }
                    if(_.size(academy)){
                        setEvolutionsTitle();
                        if(_.size(academy) && _.size(players)){
                            setPlayerState();
                        }

                        if(location.href.includes("evolution-path=")) {
                            setEvolutionsPathName();
                        }
                    }
                }
            }
        });
        observer.observe(document, { childList: true, subtree: true });


        const setEvolutionsPathName = () => {
            let pathElement = document.querySelector(".max-h-\\[250px\\]");
            if(pathElement && !_.has(pathElement,`setName`)){
                if(pathElement.querySelectorAll("button").length){
                    _.map(pathElement.querySelectorAll("button"),p => {
                        let academyId = p[`__reactFiber${reactNodeSuffix}`].return.key;
                        if(academyId.includes('-')){
                            let lastIndex = academyId.lastIndexOf('-');
                            academyId = academyId.slice(lastIndex + 1);
                        }
                        replaceEvolutionName(p.querySelector("div:not([class])"),p,academyId)
                    })
                    pathElement.setName = true;
                }
            }
        };


        //顶部标题修改为中文
        const setEvolutionsTitle = () => {
            let titleElement = document.querySelectorAll("article.text-evolution-secondary");
            _.map(titleElement,t => {
                if(!_.has(t,`setName`)){
                    let fiber = t[`__reactFiber${reactNodeSuffix}`];
                    replaceEvolutionName(t.querySelector("h2"),t,fiber.return.key)
                    t.setName = true;
                }
            })
        };
        const replaceEvolutionName = (rEl,oEl,id) => {
            let nameSuffix = "";
            let namePrefix = "";
            let name = "";
            if(_.has(academy,id)){
                let academyJson = academy[id];

                namePrefix = academyJson.status == 1 ? "[√]" : "[×]";
                if(academyJson.time){
                    let endDay = Math.floor((academyJson.time - Math.floor(Date.now() / 1000)) / 86400);
                    if(endDay < 8){
                        nameSuffix = "(" + endDay + ")";
                    }
                }
                name = academyJson.name;
                if(!academyJson.status){
                    oEl.style.opacity = ".3";
                }
            }else{
                name = rEl.textContent;
                namePrefix = "[×]";
                oEl.style.opacity = ".3";
            }
            rEl.textContent = namePrefix + name + nameSuffix;
        }
        const setPlayerState = () => {
            let elements = document.querySelectorAll('a');
            _.map(elements,e => {
                if(e.classList.length == 0 && !_.has(e,`setState`)){
                    if(e.querySelector("article")){
                        let playerElements = e.querySelector("article");
                        let playerNameElements = playerElements.querySelector("h3");
                        let playerId = playerElements[`__reactFiber${reactNodeSuffix}`].return.return.key;
                        if(_.has(players,playerId)){
                            playerNameElements.textContent = `[√]` + playerNameElements.textContent;
                        }else{
                            playerNameElements.textContent = `[×]` + playerNameElements.textContent;
                            playerElements.style.opacity = ".5";
                        }
                        let evolutionList = playerElements.querySelectorAll(".bg-evolution-primary");
                        if(evolutionList){
                            _.map(evolutionList,i => {
                                let academyId = i[`__reactFiber${reactNodeSuffix}`].return.return.key;
                                replaceEvolutionName(i,i,academyId)
                            })
                        }
                    }
                    e.setState = true;
                }
            })
        };
    }

    //futbin 联动程序
    function futbin(){
        // 检查页面是否已经完全加载并且URL是否包含特定字符串
    // 监听 DOMContentLoaded 事件，确保在 DOM 加载完成后执行
        var academy = JSON.parse(GM_getValue("academy","{}"));
        var players = JSON.parse(GM_getValue("players","{}"));
        var eIds = JSON.parse(GM_getValue("futbin_e","{}"));

        const evolutionsUrlSetText = (ele) => {
            const eleHref = ele.href;
            const eIdMatch = eleHref.includes("?evo_id") ? eleHref.match(/evo_id\=?(\d+)$/) : eleHref.match(/evolutions\/?(\d+)\//);
            if (eIdMatch && eIdMatch[1]) {
                const feId = eIdMatch[1];
                const eId = eIds[feId];
                let prefix = "";
                let suffix = "";
                let name = "";
                if(eId){
                    const eInfo = academy[eId];
                    if(eInfo){
                        prefix = "[√]";
                        name = eInfo.name;
                        if(eInfo.time){
                            let endDay = Math.floor((eInfo.time - Math.floor(Date.now() / 1000)) / 86400);
                            if(endDay < 8){
                                suffix = "(" + endDay + ")";
                            }
                        }
                    }else{
                        prefix = "[×]";
                        name = ele.textContent;
                        ele.style.opacity = ".5";
                    }
                }else{
                    prefix = "[×]";
                    name = ele.textContent;
                    ele.style.opacity = ".5";
                }
                ele.style.fontSize = "12px";
                ele.style.fontFamily = "Inter, sans-serif;";
                ele.textContent = prefix + name + suffix;
            }
        }

        unsafeWindow.academy = academy;
        unsafeWindow.players = players;
        unsafeWindow.eIds = eIds;

        if (location.href.includes("www.futbin.com/popular/evolutions")) {
            const cards = document.querySelectorAll(".player-card");
            _.forEach(cards,c =>{
                const faceImg = c.querySelector('img:not(.playercard-25-bg)');
                if (faceImg) {
                    const faceSrc = faceImg.src;
                    const idMatch = faceSrc.match(/players\/p?(\d+)\.png/);

                    if (idMatch && idMatch[1]) {
                        const playerId = idMatch[1];
                        const playerName = c.querySelector(".playercard-25-name");
                        if(_.has(players,playerId)){
                            playerName.textContent = `[√]` + playerName.textContent;
                        }else{
                            c.querySelector(".playercard-wrapper").style.opacity = ".5";
                            playerName.textContent =  `[×]` + playerName.textContent;
                        }
                    }
                }
                if(_.size(eIds)){
                    const evolution = c.querySelector(".evolution-name-wrapper > a");
                    if(evolution){
                        evolutionsUrlSetText(evolution)
                    }
                }
            })
            if(_.size(eIds)){
                const evolutionTitleList = document.querySelectorAll(".evolution-selector > a");
                _.forEach(evolutionTitleList,e =>{
                    evolutionsUrlSetText(e)
                })
            }
        }
        if(_.size(eIds)){
            if ((location.href.includes("www.futbin.com/25/player/") && location.href.includes("_")) || location.href.includes("www.futbin.com/25/evolutions/builder")){
                _.forEach(document.querySelectorAll(".evo-price-component > a"),e => {
                    evolutionsUrlSetText(e)
                })
            }
        }
        if(location.href.includes("www.futbin.com/25/player/")){
            const notPlayStyle = document.querySelectorAll(".playStyle-table-icon:not(.active)")
            _.forEach(notPlayStyle,e => {
                e.style.opacity = ".05";
            })

            const activePlayerStyle = document.querySelectorAll(".traits-wrapper-center-desktop .playStyle-table-icon.active")
            const tabButton = document.querySelectorAll("button.player-tab")
            _.forEach(tabButton,e => {
                if(_.includes(e.textContent,"Playstyles")){
                    e.textContent = e.textContent + `(${activePlayerStyle.length})`
                }
            })
        }
    }
    function main(){
        if (_.includes(location.href,"ultimate-team/web-app")) {
            futweb();
        }
        if (_.includes(location.href,"www.easysbc.io/evolutions")) {
            easysbc();
        }
        if (_.includes(location.href,"www.futbin.com")) {
            futbin();
        }
        unsafeWindow._ = _;
    }
    main()
})();