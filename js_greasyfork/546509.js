// ==UserScript==
// @name         【FSU】EAFC FUT WEB 增强器
// @namespace    https://futcd.com/
// @version      26.04
// @description  EAFCFUT模式SBC任务便捷操作增强器👍👍👍，模拟开包、额外信息展示、近期低价自动查询、一键挂出球员、跳转FUTBIN、快捷搜索、拍卖行优化等等...👍👍👍
// @author       Futcd_kcka
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easysbc.io/evolutions*
// @match        https://www.futbin.com/*
// @require      https://s4.zstatic.net/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48ZGVmcz48Y2xpcFBhdGggaWQ9Im1hc3Rlcl9zdmcwXzJfMCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMCIvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0idXJsKCNtYXN0ZXJfc3ZnMF8yXzApIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIwIiBmaWxsPSIjMjE3REZGIiBmaWxsLW9wYWNpdHk9IjEiLz48Zz48cGF0aCBkPSJNNS4yNjQwMDAyLDEwLjM1MTk5N0wyNy43MjgwMDEsMTAuMzUxOTk3TDI3LjcyODAwMSwxOC4yODc5OThMMTQuODY0LDE4LjI4Nzk5OEwxNC44NjQsMjkuNDI0TDI1LjgwODAwMSwyOS40MjRMMjUuODA4MDAxLDM3LjM2MDAwMUwxNC44NjQsMzcuMzYwMDAxTDE0Ljg2NCw1NEw1LjI2NDAwMDIsNTRMNS4yNjQwMDAyLDEwLjM1MTk5N1pNNDAuMjcyMDAzLDE4LjI4Nzk5OEwzMC42MDgwMDIsMTguMjg3OTk4TDMwLjYwODAwMiwxMC4zNTE5OTdMNTkuNTM2MDAzLDEwLjM1MTk5N0w1OS41MzYwMDMsMTguMjg3OTk4TDQ5Ljg3MjAwMiwxOC4yODc5OThMNDkuODcyMDAyLDU0TDQwLjI3MjAwMyw1NEw0MC4yNzIwMDMsMTguMjg3OTk4WiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIxIi8+PC9nPjwvZz48L3N2Zz4=
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @connect      ea.com
// @connect      futbin.com
// @connect      futbin.org
// @connect      futcd.com
// @connect      futnext.com
// @connect      fut.gg
// @connect      www.fut.gg
// @connect      fut.to
// @connect      pages.dev
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/431044/%E3%80%90FSU%E3%80%91EAFC%20FUT%20WEB%20%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/431044/%E3%80%90FSU%E3%80%91EAFC%20FUT%20WEB%20%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("lodash")):"function"==typeof define&&define.amd?define(["lodash"],t):t((e=e||self)._)}(this,(function(e){"use strict";(e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e).mixin({multicombinations:function(t,n){var i=e.values(t),f=function(e,t){if(--t<0)return[[]];var n=[];e=e.slice();for(var i=function(){var i=e[0];f(e,t).forEach((function(e){e.unshift(i),n.push(e)})),e.shift()};e.length;)i();return n};return f(i,n)}})}));





    function futweb() {
        var events = {},info = {},cntlr = {},html = {},call = {},set = {},pdb = {},lock = {},build = {},SBCCount = {};
        info = {
            "task":{"obj":{"stat":{},"html":"","source":[]},"sbc":{"stat":{},"html":""}},
            "evolutions":{"new":[], "newCount":0, "html":""},
            "base":{"state":false,"platform":"pc","price":{},"sId":"","localization":"",autoLoad:true,"ratings":{},"input":true,"promo":0,"savesquad":false,"packcoin":{},"packreturns":{},"oddo":{},"fastsbc":{},"fastsbctips":false,"imgDB":null,"imgCache":{}},
            "squad":{},
            "meta":{
                "bodyType": {},
                "baseBodyType": 2,
                "realFace": [],
            },
            "api":{},
            "nave":{},
            "SBCCount":{},
            "bodytypetext":["UKN","L&M","A&M","S&M","L&T","A&T","S&T","L&S","A&S","S&S","UNQ"],
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
            },
            "keyEvents":[],
            "chemstyle": {
                "250": { "1": 3, "11": 3, "22": 3, "28": 3, "20": 3, "19": 3, "27": 3, "2": 3, "13": 3, "15": 3, "9": 3, "21": 3, "24": 3, "25": 3, "6": 3 },
                "251": { "11": 9, "16": 3, "22": 3, "23": 6, "26": 3, "28": 3, "5": 6, "6": 9, "8": 3 },
                "252": { "11": 6, "16": 9, "22": 3, "23": 6, "26": 3, "28": 3, "2": 6, "3": 3, "7": 3, "15": 9 },
                "253": { "11": 6, "16": 3, "22": 9, "23": 3, "28": 3, "12": 3, "20": 9, "19": 3, "27": 6 },
                "254": { "16": 6, "22": 3, "23": 6, "28": 3, "7": 6, "13": 6, "15": 3, "9": 3, "4": 3, "6": 6 },
                "255": { "0": 3, "1": 3, "11": 3, "16": 3, "22": 6, "23": 6, "28": 3, "4": 6, "6": 3, "8": 6 },
                "256": { "12": 3, "14": 6, "20": 3, "19": 6, "27": 9, "2": 9, "7": 6, "15": 3, "9": 3 },
                "257": { "12": 6, "17": 3, "20": 9, "19": 3, "27": 6, "5": 6, "6": 9, "8": 3 },
                "258": { "12": 9, "20": 6, "19": 6, "27": 3, "10": 6, "21": 3, "24": 9, "25": 3 },
                "259": { "11": 3, "22": 3, "23": 6, "12": 3, "17": 6, "20": 3, "19": 6, "7": 3, "13": 6, "15": 3, "9": 3 },
                "260": { "0": 3, "1": 3, "12": 3, "14": 6, "20": 3, "19": 3, "27": 6, "2": 3, "3": 6, "15": 6 },
                "261": { "10": 6, "18": 6, "21": 9, "24": 3, "25": 3, "4": 9, "6": 3, "8": 6 },
                "262": { "2": 6, "7": 3, "13": 3, "15": 6, "9": 3, "10": 3, "21": 6, "24": 9, "25": 6 },
                "263": { "11": 3, "22": 6, "23": 3, "3": 3, "7": 6, "13": 3, "15": 3, "10": 3, "18": 3, "21": 3, "24": 3, "25": 6 },
                "264": { "12": 3, "20": 3, "19": 6, "10": 6, "21": 3, "24": 6, "25": 3, "5": 6, "6": 3, "8": 6 },
                "265": { "0": 3, "1": 3, "10": 3, "18": 3, "21": 3, "24": 6, "25": 6, "4": 6, "6": 6, "8": 3 },
                "266": { "0": 6, "1": 6, "11": 3, "16": 3, "22": 3, "26": 9, "28": 6 },
                "267": { "0": 6, "1": 6, "12": 9, "14": 6, "20": 3, "19": 6, "27": 3 },
                "268": { "0": 6, "1": 6, "10": 3, "18": 6, "21": 3, "24": 3, "25": 9 }
            },
            "chemMap":{
                3: { 9: 9, 6: 6, 3: 3 },
                2: { 9: 6, 6: 4, 3: 2 },
                1: { 9: 3, 6: 2, 3: 1 },
                0: { 9: 0, 6: 0, 3: 0 }
            },
            "inpacks": {"defIds": [], "rarityIds": [], "players": []},
            "dynamicStats": {
                1: ["extendedPlayerInfo.general.overall"], //总评
                2: ["extendedPlayerInfo.tab.traits"], //比赛风格
                3: ["extendedPlayerInfo.positions"], //位置
                4: ["extendedPlayerInfo.tab.roles"], //角色
                5: ["extendedPlayerInfo.saveTechnique.acrobatic", "extendedPlayerInfo.stats.weakfoot"] //花式逆足
            },
            "extraChemKeys": ["full", "nation", "league", "club", "allNation", "allLeague"],
            "priceType": ["ut", "sbc", "ob", "sp"],
            "academy": [],
            "attributes": {
                "pac":{
                    id: PlayerAttribute.ONE,
                    list: [ItemSubAttribute.acceleration, ItemSubAttribute.sprintspeed],
                    weight: [0.45, 0.55]
                },
                "sho":{
                    id: PlayerAttribute.TWO,
                    list: [ItemSubAttribute.positioning, ItemSubAttribute.finishing, ItemSubAttribute.shotpower, ItemSubAttribute.longshots, ItemSubAttribute.volleys, ItemSubAttribute.penalties],
                    weight: [0.05, 0.45, 0.20, 0.20, 0.05, 0.05],
                },
                "pas":{
                    id: PlayerAttribute.THREE,
                    list: [ItemSubAttribute.vision, ItemSubAttribute.crossing, ItemSubAttribute.freekickaccuracy, ItemSubAttribute.shortpassing, ItemSubAttribute.longpassing, ItemSubAttribute.curve],
                    weight: [0.20, 0.20, 0.05, 0.35, 0.15, 0.05],
                },
                "dri":{
                    id: PlayerAttribute.FOUR,
                    list: [ItemSubAttribute.agility, ItemSubAttribute.balance, ItemSubAttribute.reactions, ItemSubAttribute.ballcontrol, ItemSubAttribute.dribbling, ItemSubAttribute.composure],
                    weight: [0.10, 0.05, 0.05, 0.35, 0.40, 0.05],
                },
                "def":{
                    id: PlayerAttribute.FIVE,
                    list: [ItemSubAttribute.interceptions, ItemSubAttribute.headingaccuracy, ItemSubAttribute.marking, ItemSubAttribute.standingtackle, ItemSubAttribute.slidingtackle],
                    weight: [0.20, 0.10, 0.30, 0.30, 0.10],
                },
                "phy":{
                    id: PlayerAttribute.SIX,
                    list: [ItemSubAttribute.jumping, ItemSubAttribute.stamina, ItemSubAttribute.strength, ItemSubAttribute.aggression],
                    weight: [0.05, 0.25, 0.50, 0.20]
                }
            },
            "attributesGK": {
                "div":{
                    id: PlayerAttribute.ONE,
                    list: [ItemSubAttribute.gkdiving],
                    weight: [1],
                },
                "han":{
                    id: PlayerAttribute.TWO,
                    list: [ItemSubAttribute.gkhandling],
                    weight: [1],
                },
                "kic":{
                    id: PlayerAttribute.THREE,
                    list: [ItemSubAttribute.gkkicking],
                    weight: [1],
                },
                "ref":{
                    id: PlayerAttribute.FOUR,
                    list: [ItemSubAttribute.gkreflexes],
                    weight: [1],
                },
                "spd":{
                    id: PlayerAttribute.FIVE,
                    list: [ItemSubAttribute.acceleration, ItemSubAttribute.sprintspeed],
                    weight: [0.45, 0.55]
                },
                "pos":{
                    id: PlayerAttribute.SIX,
                    list: [ItemSubAttribute.gkpositioning],
                    weight: [1],
                }
            },
            "apiPlatform": 1,
            "apiProxy": "",
        };
        cntlr = {
            current() {
                return _appMain
                    ?._rootViewController
                    ?.currentController
                    ?.currentController
                    ?.currentController;
            },
            right() {
                return _appMain
                    ?._rootViewController
                    ?.currentController
                    ?.currentController
                    ?.currentController
                    ?.rightController
                    ?.currentController;
            },
            left() {
                return _appMain
                    ?._rootViewController
                    ?.currentController
                    ?.currentController
                    ?.currentController
                    ?.leftController;
            }
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

            //25.22 修改插入头部SBC列表信息初始化至此处

            let nav = cntlr.current().parentViewController.navigationBar;
            if(nav){
                if(nav instanceof UTCurrencyNavigationBarView && info.set.sbc_headentrance){
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

                        //隐藏顶部俱乐部图标
                        if(nav.rightContainer){
                            nav.rightContainer.style.display = "none";
                        }
                    }
                    nav._fsuSBCList = info.douagain.SBCListHtml;
                    if(nav.__root.querySelector(".view-navbar-currency")){
                        nav.__root.insertBefore(nav._fsuSBCList, nav.__currencies);
                    }
                }
                SBCCount.createElement(cntlr.current().parentViewController.getView());
            }

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
                url:"https://api.fut.to/26/updata.json",
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
                        let myVersion = Number(GM_info.script.version) || 0;
                        if(data["version"] > myVersion){
                            urlText = fy("top.upgrade");
                            urlLink = data["updateURL"];
                            events.notice("notice.upgradeconfirm",1);
                        }
                        if(_.size(data["api"])){
                            info.api = data["api"];
                            if(_.has(info.api,"meta")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/26/meta.json?${info.api.meta}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload:function(res){
                                        let metaJson = JSON.parse(res.response);
                                        if(_.has(metaJson, "bodyType")){
                                            info.meta.bodyType = _.fromPairs(
                                                _.flatMap(metaJson.bodyType, (ids, bodyType) =>
                                                    ids.map(id => [id, Number(bodyType)])
                                                )
                                            );
                                        }
                                        _.has(metaJson, "baseBodyType") && (info.meta.baseBodyType = metaJson.baseBodyType);
                                        _.has(metaJson, "realFace") && (info.meta.realFace = metaJson.realFace);
                                        console.log(`meta加载完毕！`)
                                    },
                                })
                            }
                            if(_.has(info.api,"fastsbc")){
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: `https://api.fut.to/26/fast.json?${info.api.fastsbc}`,
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
                                    url:`https://api.fut.to/26/pack.json?${info.api.pack}`,
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
                                    url:`https://api.fut.to/26/sbc.json?${info.api.sbc}`,
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
                            if(_.has(info.api,"ggrating")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/26/ggrating.json?${info.api.ggrating}`,
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
                            //26.02 加载新进化信息
                            if(_.has(info.api,"evolutions")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/26/evolutions.json?${info.api.evolutions}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload:function(res){
                                        info.evolutions.new = JSON.parse(res.response).new;
                                        console.log(`evolutions加载完毕！`)
                                    },
                                })
                            }
                            //26.04 加载包内球员ids
                            if(_.has(info.api,"inpacks")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/26/inpacks.json?${info.api.inpacks}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload:function(res){
                                        const { defIds, rarityIds } = JSON.parse(res.response);
                                        info.inpacks.defIds = defIds;
                                        info.inpacks.rarityIds = rarityIds;
                                        console.log(`inpacks加载完毕！`)
                                    },
                                })
                            }
                            //26.04 加载其他配置
                            if(_.has(info.api,"inpacks")){
                                GM_xmlhttpRequest({
                                    method:"GET",
                                    url:`https://api.fut.to/26/other.json?${info.api.other}`,
                                    headers: {
                                        "Content-type": "application/json",
                                        "Cache-Control": "max-age=31536000"
                                    },
                                    onload:function(res){
                                        const { dynamic, chem } = JSON.parse(res.response);
                                        info.specialPlayers = {
                                            "dynamic": dynamic,
                                            "DList": Object.entries(dynamic)
                                                .filter(([key, value]) => {
                                                    return value.exp && value.exp > Date.now() / 1000;
                                                })
                                                .map(([key, value]) => Number(key)),
                                            "extraChem": chem,
                                            "ECList": Object.keys(chem).map(key => Number(key))
                                        }
                                        console.log(`other加载完毕！`)
                                    },
                                })
                            }

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

            //26.02 loading文本添加事件
            events.addLoadingElment();
 
            info.base.localization = services.Localization.repository._collection;
            //25.22 获取SBC信息并插入头部导航
            services.SBC.requestSets().observe(getAppMain().getRootViewController(), function(e, t) {
                if (e.unobserve(getAppMain().getRootViewController()),t.success && JSUtils.isObject(t.data)) {
                    let tempSBCList = JSON.parse(GM_getValue("sbclist", "[]")).reverse();
                    tempSBCList.forEach(sbcId => {
                        events.SBCListInsertToFront(sbcId, 1);
                    });
                }
            });
            //26.03 获取商店信息避免SBC直接模拟开包卡死
            services.Store.getPacks(PurchasePackType.ALL, true, true);
            //获取目标信息
            services.Objectives.objectivesDAO.getCategories().observe(getAppMain().getRootViewController(), function(e, t) {
                e.unobserve(getAppMain().getRootViewController());
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
            if(document.querySelectorAll(".app-logo").length){
                console.log("加载了 enhancer！！！")
                info.isEnhancer = true;
                events.enhanceStyleChange();
            }else{
                console.log("没加载 enhancer")
                info.isEnhancer = false;
            }
            await events.reloadPlayers();

            //24.18 可进化标识：读取进化任务数据
            //25.02 修复进化任务加载不全的问题
            if(repositories.Academy.isCacheExpired()){
                let academyDTO = new UTAcademySlotSearchCriteriaDTO;
                academyDTO.count = 40;
                const simpleAcademyTypes = [AcademyStatEnum.RARITY, AcademyStatEnum.COSMETIC_UPGRADE];
                const nowTime = Math.floor(Date.now() / 1000);
                services.Academy.requestAcademyHub(academyDTO).observe(getAppMain().getRootViewController(), function(e, t) {
                    e.unobserve(getAppMain().getRootViewController());
                    GM_setValue("academy",JSON.stringify({}));
                    if(t.success && t.data && !JSUtils.isString(t.data)){
                        _.map(t.data.categories,c => {
                            let DTO = new UTAcademySlotSearchCriteriaDTO;
                            DTO.categoryId = c.id;
                            DTO.count = 40;
                            services.Academy.requestSlotsByCategory(DTO).observe(getAppMain().getRootViewController(), function(ee, tt) {
                                ee.unobserve(getAppMain().getRootViewController());
                                if(tt.success && tt.data && !JSUtils.isString(tt.data)){
                                    info.evolutions.newCount += _.filter(tt.data.slots,i => info.evolutions.new.includes(i.id)).length;
                                    info.evolutions.html = events.taskHtml(info.evolutions.newCount, "")
                                    let academyCache = JSON.parse(GM_getValue("academy","{}"));
                                    
                                    _.map(tt.data.slots,s => {
                                        academyCache[s.id] = {
                                            "name": s.slotName,
                                            "status": s.status == AcademySlotState.NOT_STARTED ? 1 : 0,
                                            "time": s.endTimePurchaseVisibility
                                        }
                                        const rewardCondition =
                                            s.academyTopRewards.length > 1 ||
                                            (
                                                s.academyTopRewards.length === 1 &&
                                                !simpleAcademyTypes.includes(s.academyTopRewards[0].type)
                                            );

                                        const startedOffset = s.status === AcademySlotState.NOT_STARTED ? 0 : 1;
                                        const remainingQuantity = s.numberOfRepetitions - Math.max(s.repetitionIndex, 0) + 1 - startedOffset;
                                        if(remainingQuantity > 0){
                                            let time = -1;
                                            let timeDiff = Infinity;
                                            let timeDiffText = "";
                                            if(_.max(s.endTime, s.endTimePurchaseVisibility) !== 0){
                                                time = _.min(_.filter([s.endTime, s.endTimePurchaseVisibility], v => v && v !== 0));
                                                timeDiff = time - nowTime;
                                                timeDiffText = services.Localization.localizeAuctionTimeRemaining(timeDiff);
                                            }
                                            const allRewards = s.getAllSlotRewards();
                                            info.academy.push(
                                                {
                                                    id: s.id,
                                                    name: s.slotName,
                                                    practical: rewardCondition,
                                                    time: time,
                                                    timeDiff: timeDiff,
                                                    timeDiffText: timeDiffText,
                                                    el: _.cloneDeep(s.eligibilityRequirements),
                                                    attr: allRewards,
                                                    isGK: s.isGkExclusive(),
                                                    attrText: events.academyAddAttr(allRewards, s.isGkExclusive()).map
                                                }
                                            )
                                        }
                                    })
                                    info.academy = _.orderBy(info.academy, "timeDiff");
                                    //console.log(info.academy)
                                    GM_setValue("academy",JSON.stringify(academyCache));
                                    
                                    //26.02 HOME添加进化新任务提示
                                    if(cntlr.current().className == "UTHomeHubViewController" && info.evolutions.newCount > 0){
                                        cntlr.current().getView()._academyTile.getRootElement()?.querySelector(".fsu-task")?.remove();
                                        cntlr.current().getView()._academyTile.__tileContent.before(
                                            events.createDF(`<div class="fsu-task">${info.evolutions.html}</div>`)
                                        )
                                    }
                                }
                            })
                        })
                    }
                })
            }
            info.squad = _.map(repositories.Squad.squads.get(services.User.getUser().selectedPersona).get(services.Squad.activeSquad).getPlayers(),"item.id");
            console.log(info.squad)
        };

        //26.02 添加进化新增显示
        UTHomeHubView.prototype.getAcademyTile = function() {
            if(info.evolutions.newCount > 0 && !this._academyTile.__root.querySelector(".fsu-task")){
                this._academyTile.__tileContent.before(
                    events.createDF(`<div class="fsu-task">${info.evolutions.html}</div>`)
                )
            }
            return this._academyTile
        }

        //26.02 添加loading文本事件
        events.addLoadingElment = () => {
            if(!info.base.close){
                info.base.close = events.createButton(
                    new UTButtonControl(),
                    fy("loadingclose.text"),
                    async(e) => {
                        events.hideLoader()
                    },
                    "fsu-loading-close"
                );
                document.querySelector(".ut-click-shield").append(info.base.close.__root);
            }
        }
        //26.02 添加enhancer兼容部分
        events.enhanceStyleChange = () => {
            GM_addStyle(`
                .has-add-player .filter-btn.fsu-eligibilitysearch{right: 36px}
                .ut-search-filter-control select option{color: #2d2c36}
            `)
        }
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
            //25.22 修复取当前阵容的方式，避免填充球员无法计算出。
            if(_.has(queryOptions,"removeSquad")){
                let tempSquad = repositories.Squad.squads.get(services.User.getUser().selectedPersona);
                if(tempSquad){
                    info.squad = _.map(tempSquad.get(services.Squad.activeSquad).getPlayers(),"item.id")
                }
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
                            return i.groups.includes(4) === v;
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
                        case "includePos":
                            return Array.isArray(v) ? v.some(x => i.possiblePositions.includes(x)) : i.possiblePositions.includes(v);
                        case "excludePos":
                            return Array.isArray(v) ? !v.some(x => i.possiblePositions.includes(x)) : !i.possiblePositions.includes(v);
                        case "maxNumPos":
                            return i.possiblePositions.length <= Array.isArray(v) ? v[0] : v;
                        case "maxNumBasicPlayStyles":
                            return i.getNumBasicPlayStyles() <= Array.isArray(v) ? v[0] : v;
                        case "maxNumPlusPlayStyles":
                            return i.getNumPlusPlayStyles() <= Array.isArray(v) ? v[0] : v;
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
                            return !_.includes(info.squad,i.id);
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

            const isMixBronzeAndSilver = _.isEqual(queryOptions.rareflag, [0, 1]) &&
                (queryOptions.rs == 0 || queryOptions.rs == 1);

            const sortField = isMixBronzeAndSilver
                ? ["rareflag", "rating", "pile", "untradeableCount", "_itemPriceLimits.minimum", "_itemPriceLimits.maximum"]
                : ["rating", "pile", "untradeableCount", "rareflag", "_itemPriceLimits.minimum", "_itemPriceLimits.maximum"];

            const sortOrder = isMixBronzeAndSilver
                ? ["asc", ratingOrder, "desc", "desc", "asc", "asc"]
                : [ratingOrder, "desc", "desc", "asc", "asc", "asc"];
                
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
                                tempResult = _.orderBy(tempResult,"untradeableCount","desc");
                            }
                        }else{
                            tempResult = i;
                        }
                        resultPlayers  = _.concat(resultPlayers, tempResult);
                    })
                    players = resultPlayers;
                }
            }


            if (firstStorage == 1) {
                players = _.orderBy(players, [
                    (player) => {
                        //25.23 增加一个保护措施，超过5评分以内的仓库球员也不会被强制移动到前方。
                        //如果你要修改就修改下面的5
                        const inStorage = repositories.Item.storage.get(player.id);
                        if (!inStorage) return 1; 

                        if (queryOptions && queryOptions.GTrating != null) {
                            return player.rating <= queryOptions.GTrating + 5 ? 0 : 1;
                        }
                        return 0; 
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
                //25.23 调整为基础ID而不是球员ID
                players = _.uniqBy(players, 'databaseId');
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
                if(isPhone()){
                    if(cntlr.current() instanceof UTSBCSquadOverviewViewController){
                        cntlr.current()._fsu.fillSquadBtn.setInteractionState(1);
                    }else if(cntlr.current() instanceof UTSBCSquadDetailPanelViewController){
                        _.forEach(cntlr.current().getNavigationController().childViewControllers, c => {
                            if(c instanceof UTSBCSquadOverviewViewController){
                                c._fsu.fillSquadBtn.setInteractionState(1);
                            }
                        })
                    }
                }else{
                    cntlr.left()._fsu.fillSquadBtn.setInteractionState(1);
                }
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
            "notice.uasreset":["已重新载入列表","已重新載入列表","The list has been reloaded"],
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
            "notice.phoneloas":["请注意手机端挂牌后需重新进入拍卖清单才会刷新显示。","請注意手機端掛牌後需重新進入拍賣清單才會重新整理顯示。","Please note that after listing on the mobile terminal, you need to re-enter the auction list before refreshing the display."],
            "notice.builder":["通过排除后球员数量已不足以填充阵容，如需要请调整条件再次搜索。","通過排除後球員數量已不足以填充陣容，如需要請調整條件再次搜尋。","The number of players after exclusion is no longer sufficient to fill the lineup, please adjust the criteria to search again if necessary."],
            "notice.conceptdiff":["发现所购买的假想球员有多个版本，已经将非搜索版本的亮度。","發現所購買的假想球員有多個版本，已經將非搜尋版本的亮度。","Found that there are multiple versions of the purchased hypothetical player, the brightness of the non-searched version has been added."],
            "notice.packback":["已无未分配球员 自动返回","已無未分配球員 自動返回","No unassigned players, automatically return"],
            "notice.notchemplayer":["俱乐部中没有满足当前默契需求的球员","俱樂部中沒有滿足當前默契需求的球員","there are no players in the club who meet the current chemistry needs"],
            "notice.chemplayerloading":["开始读取满足默契球员 请稍等","開始讀取滿足默契球員 請稍等","Start reading Meet chemistry players, please wait"],
            "sbc.chemplayer":["默契球员名单","默契球員名單","Chemistry Players List"],
            "notice.noplayer":["已无指定条件球员","已無指定條件球員","No conditions specified player"],
            "squadback.popupt":["阵容回退提示","陣容回退提示","Squad Back Tip"],
            "squadback.popupm":["请注意，阵容回退后将无法再返回到此阵容，还可回退 %1 次。","請注意，陣容回退後將無法再返回到此陣容，還可回退 %1 次。","Note that the squad will no longer be able to return to this lineup after retreating, and can go back %1 times."],
            "sbc.squadback":["退","退","B"],
            "notice.nosquad":["已无操作记录 无法法回退","已無操作記錄 無法法回退","There is no operation record and cannot be rolled back"],
            "tile.settitle":["插件配置","外掛配置","Plugin configuration"],
            "tile.settext":["配置FSU功能开关","配置FSU功能開關","Configure FSU function switch"],
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
            "tile.gptitle":["重载数据","重載資料","Reload Data"],
            "tile.gptext": ["如有问题可重新载入", "如有問題可重新載入", "If there are issues, you can reload again"],
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
            "settingsbutton.phone":["说明、入口、询价","說明、入口、詢價","desc、entrance、query"],
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
            "meetsreq.error":["俱乐部中没有满足可替换的满足需求球员","俱樂部中沒有滿足可替換的滿足需求球員","There are no replaceable meet requirements players in the club"],
            "set.sbc.templatemode":["SBC方案填充输入模式","SBC方案填充輸入模式","SBC squad populate input mode"],
            "readauction.loadingclose3":["正在读取价格 %1","正在讀取價格 %1","Reading price %1"],
            "squadcmpl.popupm":["阵容补全即会将假想球员替换为同评分球员、空位替换为所填评分。请填入评分需要数字，以英文逗号组合，单个评分将会替换所有空位，多个将替换指定个数空位。","陣容補全即會將假想球員替換為同評分球員、空位替換為所填評分。請填入評分需要數字，以英文逗號組合，單個評分將會替換所有空位，多個將替換指定個數空位。","Lineup completion will replace hypothetical players with players of the same rating, and vacancies with the filled rating. Please fill in the numbers required for the rating, combined with English commas, a single rating will replace all vacancies, and multiple will replace the specified number of vacancies."],
            "squadcmpl.popupmsup":["模拟计算结果可能略有偏差，可点击按钮前往网站进行自由计算。","模擬計算結果可能略有偏差，可點選按鈕前往網站進行自由計算。","The simulation results may be slightly biased, and you can click the button to go to the website for free calculation."],
            "shieldlea.popupm":["此处为排除的联赛设置（需开启排除联赛按钮才生效），点击右侧可切换状态，开关旁为此联赛球员数。","此處為排除的聯賽設定（需開啟排除聯賽按鈕才生效），點選右側可切換狀態，開關旁為此聯賽球員數。","Here is the excluded league setting (you need to turn on the excluded league button to take effect), click on the right to switch the status, and the number of players in this league is next to the switch."],
            "popupButtonsText.44401":["前往网站计算","前往網站計算","Go to the website to calculate"],
            "squadcmpl.simulatedsuccess":["此次模拟补全后阵容评分： %1 ，预估填充球员价值： %2 。","此次模擬補全後陣容評分： %1 ，預估填充球員價值： %2 。","Lineup score after this simulation completion: %1 , estimated fill player value: %2 ."],
            "squadcmpl.simulatederror":["无法模拟补全出阵容，请填充球员、调整排除选项或进入网站计算。","無法模擬補全出陣容，請填充球員、調整排除選項或進入網站計算。","The full lineup cannot be simulated. Please fill in players, adjust exclusion options, or enter the website for calculations."],
            "packfilter.total":["共计：%1   预估：%2","共計：%1   預估：%2","Total:%1   Estimated:%2"],
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
            "set.player.pickbest":["球员挑选最佳提示","球員挑選最佳提示","Player Pick Best Tips"],
            "set.sbc.headentrance":["顶部SBC入口","頂部SBC入口","Top SBC Entrance"],
            "playerignore.popupt":["SBC忽略球员配置","SBC忽略球員配置","SBC ignore player configuration"],
            "playerignore.popupm":["配置点击调整后即保存，影响一键填充、阵容补全等处代码，切记谨慎选择。","配置點選調整後即儲存，影響一鍵填充、陣容補全等處程式碼，切記謹慎選擇。","The configuration is saved after clicking Adjust, which affects the code of one-click filling, lineup completion, etc. Remember to choose carefully."],
            "playerignore.button":["排除球员配置","排除球員配置","Exclude player configuration"],
            "popupButtonsText.44403":["关闭","關閉","close"],
            "builder.academy":["排除进化球员","排除進化球員","Exclude Evolution"],
            "builder.strictlypcik":["球员挑选严格普通和稀有","球員挑選嚴格普通和稀有","Player Pick SBC Strictly Common and Rare"],
            "headentrance.numberset":["顶部入口数量配置","頂部入口數量配置","Top entrance number"],
            "popupButtonsText.44404":["前往设置排除联赛","前往設定排除聯賽","Go to Settings Exclusion League"],
            "popupButtonsText.44405":["前往设置黄金球员范围","前往設定黃金球員範圍","Go to Set Golden Player Range"],
            "goldenplayer.popupmt":["黄金球员范围设置","黃金球員範圍設定","Golden Player Range Settings"],
            "goldenplayer.popupm":["默认黄金球员最高为83，如想设定请填入后点击确定，最小值为76。为空则恢复默认值。","預設黃金球員最高為83，如想設定請填入後點選確定，最小值為76。為空則恢復預設值。","The default gold player is up to 83. If you want to set it, please fill in and click OK. The minimum value is 76. If it is empty, restore the default value."],
            "goldenplayer.placeholder":["请输入两位数字、最低76、最高99","請輸入兩位數字、最低76、最高99","Please enter two digits, minimum 76, maximum 99"],
            "headentrance.popupmt":["顶部SBC入口数量设置","頂部SBC入口數量設定","Top SBC Entry Quantity Settings"],
            "headentrance.popupm":["默认电脑端为5个、手机端为3个，请输入数字改变数量，最高不能超过8个。为空则恢复默认值。","預設電腦端為5個、手機端為3個，請輸入數字改變數量，最高不能超過8個。為空則恢復預設值。","The default is 5 on the computer and 3 on the mobile phone. Please enter the number to change the number, and the maximum cannot exceed 8. If it is empty, restore the default value."],
            "headentrance.placeholder":["请输入1位数字、最低为1、最高为8","請輸入1位數字、最低為1、最高為8","Please enter 1 digit, minimum 1, maximum 8"],
            "sbc.swapgold":["快速替换为同评分黄金","快速替換為同評分黃金","Quickly replace with gold of the same rating"],
            "bibconcept.btntext":["批量购买假想球员","批量購買假想球員","Buy concept players in bulk"],
            "readauction.progress":["购买进度：%1/%2","購買進度：%1/%2","Purchase progress:%1/%2"],
            "buyplayer.getinfo.error":["读取球员信息失败，请重试。","讀取球員資訊失敗，請重試。","Reading player information failed. Please try again."],
            "buyplayer.bibresults":["批量购买结束，成功 %1 个，失败 %2 个，共花费%3。","批量購買結束，成功 %1 個，失敗 %2 個，共花費%3。","Bulk purchase completed, %1 successful, %2 failed, total cost %3."],
            "builder.ignorepos.short":["忽略位置","忽略位置","Ignore position"],
            "builder.goldenrange.short":["黄金范围：≤%1","黃金範圍：≤%1","Gold Range:≤%1"],
            "builder.strictlypcik.short":["严格稀有普通","嚴格稀有普通","Strictly rare common"],
            "builder.comprange":["阵容补全黄金范围（75-%1）内优先稀有","陣容補全黃金範圍（75-%1）內優先稀有","Squad Completion Priority Rare within Gold Range (75-%1)"],
            "builder.comprange.short":["≤%1优先稀有","≤%1優先稀有","≤%1 Priority Rare"],
            "builder.comprare":["阵容补全优先非特殊球员","陣容補全優先非特殊球員","Squad Completion Priority Non-Special Players"],
            "builder.comprare.short":["优先非特殊","優先非特殊","Priority non-special"],
            "academy.btntext":["查看 %1 进化","檢視 %1 進化","View %1 Evolution"],
            "academy.freetips":["免费进化","免費進化","Free Evolution"],
            "academy.bio.add":["+ %1","+ %1","+ %1"],
            "academy.bio.change":["变化","變化","change"],
            "academy.bio.upgrade":["升级","升級","upgrade"],
            "academy.bio.new":["新增","新增","new"],
            "loas.input":["可填入修改挂牌时间","可填入修改掛牌時間","You can fill in to modify the listing time."],
            "loas.input.tips":["请按小时为基准填入，默认和1为1小时、3为3小时、6为6小时、12为12小时、24为1天、72为3天，不支持其他时间。","請按小時為基準填入，預設和1為1小時、3為3小時、6為6小時、12為12小時、24為1天、72為3天，不支援其他時間。","Please fill in the hours as the basis, the default and 1 is 1 hour, 3 is 3 hours, 6 is 6 hours, 12 is 12 hours, 24 is 1 day, 72 is 3 days, other times are not supported."],
            "loas.input.error":["填入挂牌时间错误，请务必按照说明填写。","填入掛牌時間錯誤，請務必按照說明填寫。","Fill in the wrong listing time, please be sure to follow the instructions."],
            "returns.text":["平均回报：","平均回報：","Avg Returns:"],
            "notice.submitrepeat":["阵容中有未分配不可交易版本，将自动替换并提交阵容。","陣容中有未分配不可交易版本，將自動替換並提交陣容。","If there is an unassigned non-tradable version in the lineup, it will be automatically replaced and submitted."],
            "fastsbc.popupt":["快速任务提示","快速任務提示","Quick SBC Tip"],
            "fastsbc.popupm":["此模式将快速执行指定SBC，优先未分配和进行排除选项，不会识别未分配可交易替换功能。此为实验功能谨慎使用，过量可能导致BAN提交等不知名惩罚，且可能提交掉你的有价值球员。确认后本次使用插件将不再提示。","此模式將快速執行指定SBC，優先未分配和進行排除選項，不會識別未分配可交易替換功能。此為實驗功能謹慎使用，過量可能導致BAN提交等不知名懲罰，且可能提交掉你的有價值球員。確認後本次使用外掛將不再提示。","This mode will quickly execute the specified SBC, give priority to unassigned and exclude options, and will not recognize unassigned tradable replacements. This is an experimental feature to use with caution. Excessive use may lead to unknown penalties such as BAN submission, and may submit your valuable players. After confirmation, this use of the plugin will no longer prompt."],
            "fastsbc.success":["快速任务成功，请适度使用切勿过于频繁。","快速任務成功，請適度使用切勿過於頻繁。","The quick SBC is successful, please use it in moderation and not too frequently."],
            "fastsbc.title":["重复球员可快速完成 %1 个SBC","重複球員可快速完成 %1 個SBC","Repeat players can quickly complete %1 SBC"],
            "fastsbc.sbcbtntext":["一键完成(%1)","一鍵完成(%1)","Completion(%1)"],
            "players.bodytype_1":["瘦中型","瘦中型","Lean Medium"],
            "players.bodytype_2": ["均衡中型", "均衡中型", "Average Medium"],
            "players.bodytype_3": ["壮中型", "壯中型", "Stocky Medium"],
            "players.bodytype_4": ["瘦高型", "瘦高型", "Lean Tall"],
            "players.bodytype_5": ["均衡高型", "均衡高型", "Average Tall"],
            "players.bodytype_6": ["壮高型", "壯高型", "Stocky Tall"],
            "players.bodytype_7": ["瘦小型", "瘦小型", "Lean Short"],
            "players.bodytype_8": ["均衡小型", "均衡小型", "Average Short"],
            "players.bodytype_9": ["壮小型", "壯小型", "Stocky Short"],
            "players.bodytype_10": ["独特体型", "獨特體型", "Unique"],
            "players.realface_0": ["真实脸", "真實臉", "Real Face"],
            "players.realface_1": ["虚拟脸", "虛擬臉", "Generic Face"],
            "notice.players.realface": ["球员 %1 在游戏内的脸型为 %2", "球员 %1 在游戏内的脸型为 %2", "Player %1 in-game face type is %2"],
            "plyers.bodytype.popupm":["当前模型【%1】其表现为：%2，代表视觉感受的宽度和高度。可以理解为矮的腿短盘带好、高的腿长拦截好、瘦的窄灵活、壮的宽能撞。<br/><br/>定制体型不用高低区分都是扫描球员，静止时可能差距不大，但在运动中会更丝滑流畅或拥有专属击球、拦截、花式等动作。","當前模型【%1】其表現為：%2，代表視覺感受的寬度和高度。可以理解為矮的腿短盤帶好、高的腿長攔截好、瘦的窄靈活、壯的寬能撞。<br/><br/>定製體型不用高低區分都是掃描球員，靜止時可能差距不大，但在運動中會更絲滑流暢或擁有專屬擊球、攔截、花式等動作。","The body type [ %1 ] behaves as: %2 , which represents the width and height of visual perception. It can be understood as short legs with good dribbling, tall legs with good interception, lean narrow and flexible, and stocky wide can hit.<br/><br/>Unique body type does not need to be distinguished between tall and short. It may not look that different, but it will be silkier and smoother in motion or have exclusive hitting, intercepting, fancy and other actions."],
            "plyers.bodytype.popupt":["球员模型说明","球員模型說明","Player body type description"],
            "plyers.relo.popupt":["球员职责评级说明","球員職責評級說明","Player Role Rating Description"],
            "popupButtonsText.44406":["前往 Easysbc 查看","前往 Easysbc 檢視","Go to Easysbc to view"],
            "fastsbc.entertips":["进入后可快速完成","進入後可快速完成","Quick completion upon entry"],
            "fastsbc.error_1":["提交失败，SBC无次数。","提交失敗，SBC無次數。","Submit failed, SBC no number of times."],
            "fastsbc.error_2":["提交失败，SBC无法完成，需完成关联任务重置。","提交失敗，SBC無法完成，需完成關聯任務重置。","Submit failed, the SBC cannot be completed, and the associated task reset needs to be completed."],
            "fastsbc.error_3":["提示失败，满足条件球员不足。","提示失敗，滿足條件球員不足。","Submit failed, insufficient players meet the conditions."],
            "fastsbc.error_4":["提交失败，交换可交易球员失败，请重试。","提交失敗，交換可交易球員失敗，請重試。","Submit failed, exchange of tradable players failed, please try again."],
            "set.card.meta":["球员元评分&排名","球員元評分&排名","Player Meta Rating & Rank"],
            "fastsbc.error_5":["提交失败，大概率是BAN SBC，请过段时间再试。","提交失敗，大概率是BAN SBC，請過段時間再試。","Submit failed, most likely BAN SBC, please try again after a while."],
            "sbccount.btntext":["SBC计数：%1","SBC計數：%1","SBC count: %1"],
            "sbccount.popupt":["SBC计数说明","SBC計數說明","SBC Counting Instructions"],
            "sbccount.popupm":["此处仅计算插件运行状态下运行设备当日提交的SBC数量，请自行斟酌是否继续提交SBC。<br/>目前传闻是1小时内超过90个即有可能被禁止提交SBC，等待1到24小时解禁，具体规则EA未披露。","此處僅計算外掛執行狀態下執行裝置當日提交的SBC數量，請自行斟酌是否繼續提交SBC。<br/>目前傳聞是1小時內超過90個即有可能被禁止提交SBC，等待1到24小時解禁，具體規則EA未披露。","Here only the number of SBC submitted by the running device on the day when the plug-in is running is calculated. Please decide whether to continue submitting SBC. <br/> At present, it is rumored that more than 90 SBC submissions may be banned within 1 hours, and wait 1 to 24 hours for the ban to be lifted."],
            "meta.role.unknown":["未知","未知","Unknown"],
            "plyers.relo.popupm":["推荐职责【%1】，搭配默契风格【%2】，职责概述：<br/><br/>%3<br/><br/>%4<br/><br/>同职责满默契度级别：%5（%6），各级别含义：S（前1-10）、A（11-50）、B（51-100）、C（101-300）、D代表其他，门将因较少只到C级，？代表无数据。<br/><br/>仅评分前3000名的数据，+和++代表额外的熟悉度，可点击下方按钮前往查看。","推薦職責【%1】，搭配默契風格【%2】，職責概述：<br/><br/>%3<br/><br/>%4<br/><br/>同職責滿默契度級別：%5（%6），各級別含義：S（前1-10）、A（11-50）、B（51-100）、C（101-300）、D代表其他，門將因較少只到C級，？代表無資料。<br/><br/>僅評分前3000名的資料，+和++代表額外的熟悉度，可點選下方按鈕前往檢視。","Recommended player role [%1], with tacit chemistry style [%2], overview of responsibilities: <br/><br/>%3<br/><br/>%4<br/><br/>Same role and  3 Chemistry points level:%5(%6), meaning at all levels: S(1-10) , A(11-50) , B(51-100) , C(101-300) , D for remaining, the GK is only at level C due to less, ? means no data. <br/><br/>Only the data of the top 3,000 are ratings, + and ++ represent additional familiarity, you can click the button below to view."],
            "plyers.relo.popupm.v1":["可调整侧重点：%1，请根据球员属性信息自行设置。","可調整側重點：%1，請根據球員屬性資訊自行設定。","Adjustable Variations:%1, please set it yourself according to player attribute information."],
            "plyers.relo.popupm.v2":["职责可能在不同的位置存在，请根据位置、熟悉度等信息自行选择，并根据球员属性信息选择侧重点。","職責可能在不同的位置存在，請根據位置、熟悉度等資訊自行選擇，並根據球員屬性資訊選擇側重點。","Role may exist in different positions, please choose your own according to the positions, familiarity and other information, and choose the variations according to the player attribute information."],
            "storage.tile":["SBC仓库","SBC倉庫","SBC Storage"],
            "storage.navtilte":["SBC仓库球员列表","SBC倉庫球員列表","SBC Storage player list"],
            "storage.setclub.text":["共计 %1 名球员可发送回俱乐部","共計 %1 名球員可傳送回俱樂部","A total of %1 players can be sent back to the club"],
            "storage.setclub.button":["批量发送","批量傳送","Bulk Send"],
            "sbc.qucikstorage":["仓","倉","S"],
            "tile.dodotitle":["插件讨论","外掛討論","plugin discussion"],
            "tile.dodotext":["欢迎反馈和讨论","歡迎反饋和討論","We welcome feedback and discussion"],
            "trypack.button.text":["试一下","試一下","Try it."],
            "trypack.button.subtext":["模拟开包","模擬開包","simulated"],
            "trypack.foot.info1_1":["售价：","售價：","Price:"],
            "trypack.foot.info1_2":["本次模拟开包共 %1 个球员、 %2 个特殊版本","本次模擬開包共 %1 個球員、 %2 個特殊版本","This simulation total of %1 players, including %2 special"],
            "trypack.foot.info2_1":["本包预期回报：","本包預期回報：","Average Returns:"],
            "trypack.foot.info2_2":["本次开包价值：","本次開包價值：","This value:"],
            "trypack.foot.info2_3":["对比预期：","對比預期：","Difference："],
            "trypack.foot.info3":["此功能是通过EA公示概率模拟出的开启后获得的球员效果，此过程中不会与EA有数据交互，不会对你此后开包有所影响，仅供娱乐、切勿当真。","此功能是通過EA公示概率模擬出的開啟後獲得的球員效果，此過程中不會與EA有資料互動，不會對你此後開包有所影響，僅供娛樂、切勿當真。","This function is a player effect obtained after opening simulated by EA's publicity probability. It is for entertainment only and should not be taken seriously."],
            "trypack.popup.suffix":["（模拟开包）","（模擬開包）","(Simulate)"],
            "trypack.button.again":["再来一次","再來一次","Try Again"],
            "builder.firststorage":["优先使用球员仓库球员","優先使用球員倉庫球員","Priority to use player storage players"],
            "builder.firststorage.short":["优先仓库球员","優先倉庫球員","Priority storage"],
            "fastsbc.nosbcdata":["快速SBC：首次需进入SBC页面读取信息后才会显示","快速SBC：首次需進入SBC頁面讀取資訊後才會顯示","Quick SBC: It will not be displayed until you enter the SBC page to read the information for the first time."],
            "academy.btntext2":["查看可进化任务","檢視可進化任務","View Evolutions"],
            "shieldflag.btntext":["可使用特殊球员设置","可使用特殊球員設定","Use Rarity Player Settings"],
            "shieldflag.popupm":["此处开启将会使用此稀有度的球员（需开启可使用特殊球员按钮才可生效），点击右侧可切换状态，开关旁为此稀有度球员数。","此處開啟將會使用此稀有度的球員（需開啟可使用特殊球員按鈕才可生效），點選右側可切換狀態，開關旁為此稀有度球員數。","Open the player who will use this rarity here (you need to turn on the button to use rarity players to take effect), click on the right to switch the status, and the number of players with this rarity next to the switch."],
            "builder.flag":["可使用特殊球员","可使用特殊球員","Use Rarity Player"],
            "builder.flag.short":["可使用特殊(%1)","可使用特殊(%1)","Use Rarity(%1)"],
            "builder.league.short":["排除联赛(%1)","排除聯賽(%1)","Exclude league(%1)"],
            "builder.untradeable.short":["排除可交易","排除可交易","Exclude tradable"],
            "builder.academy.short":["排除进化","排除進化","Exclude evolution"],
            "popupButtonsText.44407":["前往设置可使用特殊球员","前往設定可使用特殊球員","Go to Settings Use Rarity Player"],
            "valuableplayer.popupt":["珍贵球员提示","珍貴球員提示","Priceless player tips"],
            "valuableplayer.popupm":["发现提交阵容中拥有 %1 名珍贵球员（红色价格）显示，请决定是否继续提交。","發現提交陣容中擁有 %1 名珍貴球員（紅色價格）顯示，請決定是否繼續提交。","If the submitted lineup contains %1 valuable players (indicated in red), please decide whether to proceed with the submission."],
            "popupButtonsText.44408":["继续","繼續","Continue"],
            "popupButtonsText.44409":["放弃","放棄","Give up"],
            "sbcneedslist.popupt":["SBC需求球员统计","SBC需求球員統計","SBC required player statistics."],
            "sbcneedslist.popupm":["请注意此处计算不会计算周黑或特殊需求，仅计算每个需求阵容评分的SBC。<br>计算结果和价值均依托于评分FUTBIN最低价值，可能和实际使用略有偏差，仅供参考现有库存与实际完成的差异。","請注意此處計算不會計算周黑或特殊需求，僅計算每個需求陣容評分的SBC。<br>計算結果和價值均依託於評分FUTBIN最低價值，可能和實際使用略有偏差，僅供參考現有庫存與實際完成的差異。","Please note that the calculations here will not include TOTW or special requests, only the SBC of each demand lineup score.<br>The calculation results and value are based on the lowest value of the FUTBIN score, which may slightly deviate from the actual use, and are for reference only for the difference between the existing inventory and the actual completion."],
            "popupButtonsText.44410":["下载欠缺球员数量（txt）","下載欠缺球員數量（txt）","Download the number of missing players (txt)."],
            "sbcneedslist.title_1":["评分","評分","Rating"],
            "sbcneedslist.title_2":["需求","需求","Need"],
            "sbcneedslist.title_3":["已有","已有","Hold"],
            "sbcneedslist.title_4":["欠缺","欠缺","Lack"],
            "sbcneedslist.title_5":["欠缺价格","欠缺價格","Lack of price"],
            "sbcneedslist.total":["总","總","Total"],
            "sbcneedslist.btn":["需求数量计算","需求數量計算","Need calculation"],
            "fastsbc.add":["添加为快捷任务","新增為快捷任務","Add Fast SBC"],
            "fastsbc.del":["取消快捷任务","取消快捷任務","Cancel Fast SBC"],
            "notice.addfastsbc":["添加快捷任务（%1）成功","新增快捷任務（%1）成功","Adding Fast SBC (%1) was successful."],
            "notice.delfastsbc":["取消快捷任务（%1）成功","取消快捷任務（%1）成功","Canceling Fast SBC (%1) was successful."],
            "realprob.popupt":["%1 - 真实概率","%1 - 真實概率","%1 - Real Probability"],
            "realprob.popupm":["此处为拉取FUTNEXT真实开包后的数据，可能与EA公布概率差距较大，数据仅供参考。<br>EA概率可能存在其未公布或无法匹配到，请见谅。","此處為拉取FUTNEXT真實開包後的資料，可能與EA公佈概率差距較大，資料僅供參考。<br>EA概率可能存在其未公佈或無法匹配到，請見諒。","This section pulls data from the real opening of FUTNEXT packs, which may significantly differ from the probabilities announced by EA. The data is provided for reference only. <br>EA may have unannounced or unmatched probabilities; please understand."],
            "realprob.title_1":["稀有度","稀有度","Rarity"],
            "realprob.title_2":["EA概率","EA概率","EA probability"],
            "realprob.title_3":["真实概率","真實概率","Real probability"],
            "realprob.title_4":["需要开启","需要開啟","Need to open"],
            "realprob.btn":["真实概率","真實概率","Real Prob"],
            "autobuy.nav.tilte":["球员自动购买","球員自動購買","Player Auto-Buy"],
            "autobuy.noresult.title":["请先搜索球员","請先搜尋球員","Search for players first"],
            "autobuy.noresult.text":["在上方输入名称搜索","在上方輸入名稱搜尋","Type player name above to search"],
            "autobuy.noselected.notice":["请输入并选择后再搜索","請輸入並選擇後再搜尋","Please enter and select before searching"],
            "autobuy.tile.title":["球员自动购买","球員自動購買","Player Auto-Buy"],
            "autobuy.tile.content":["测试版，如出现问题请停止使用。","測試版，如出現問題請停止使用。","Please stop using the test version if any issues arise."],
            "autobuy.tabs.text0":["操作","操作","Operation"],
            "autobuy.tabs.text1":["信息","日誌","Log"],
            "autobuy.info.title":["购买信息","購買資訊","Purchase information"],
            "autobuy.info.mintext":["最低购买价格","最低購買價格","Min price"],
            "autobuy.info.maxtext":["最高购买价格","最高購買價格","Max price"],
            "autobuy.info.numtext":["购买数量","購買數量","Quantity"],
            "autobuy.list.title0":["最新挂牌","最新掛牌","Latest shelf"],
            "autobuy.list.title1":["最新成交","最新成交","Latest trade"],
            "autobuy.list.text0":["无近期记录","無近期記錄","No record"],
            "autobuy.list.text1":["奖励物品","獎勵物品","Reward items"],
            "autobuy.list.text2":["不可交易","不可交易","Untradeable"],
            "autobuy.info.setprice":["使用最近挂牌","使用最近掛牌","Use latest listing"],
            "autobuy.info.gotosales":["查看拍卖历史","檢視拍賣歷史","Auctions history"],
            "fastsbc.tab.text":["快速完成","快速完成","Fast"],
            "builder.sabfirstcommon":["青铜和白银球员优先普通","青銅和白銀球員優先普通","Bronze/Silver: common first"],
            "openpack.unassigned.notice":["有未分配球员，请先分配后再尝试开包。","有未分配球員，請先分配後再嘗試開包。","You have unassigned players. Please assign them before opening a pack."],
            "openpack.openerror.notice":["开包失败，错误代码：%1，请重新进入商店刷新列表。","開包失敗，錯誤代碼：%1，請重新進入商店刷新列表。","Pack opening failed (Error code: %1). Please return to the Store and refresh the list."],
            "openpack.progress.loadertext1":["正在打开 %1","正在打開 %1","Opening %1 ..."],
            "openpack.progress.loadertext2":["开启进度 %1/%2 点击此处可暂停程序","開啟進度 %1/%2，點擊此處可暫停程序","Opening progress %1/%2 . Tap to pause."],
            "openpack.packnotenough.notice":["当前 %1 共计 %2 个，无法开启 %3 个。","當前 %1 共計 %2 個，無法開啟 %3 個。","Insufficient %1: %2 available, but %3 required."],
            "openpack.result.popupt":["开包结果 - %1","開包結果 - %1","Pack Opening Result - %1"],
            "openpack.result.popupm1":["共开启 %1 个球员包（%2个未开启），分配俱乐部 %3 个、SBC仓库 %4 个，%5 个特别球员，最高评分 %6 。","共開啟 %1 個球員包（尚有 %2 個未開啟），已分配至俱樂部 %3 個、SBC 倉庫 %4 個，%5 名特別球員，最高評分為 %6。","Opened %1 player packs (%2 not opened), assigned %3 to Club, %4 to SBC storage, %5 special players, with a highest rating of %6."],
            "openpack.result.popupm2":["上方将展示最多20位球员，优先展示特别品质和高评分的球员，其余球员球员将不会展示，请去俱乐部或SBC仓库自行查看。","上方將展示最多 20 位球員，優先展示具備特殊品質與高評分的球員，其餘球員將不予顯示，請前往俱樂部或 SBC 倉庫自行查看。","Up to 20 players will be displayed above, prioritizing special quality and high-rated players. Other players will not be shown — please check your Club or SBC storage for the rest."],
            "openpack.storebtn.text":["批量打开","批量開啟","Bulk Open"],
            "openpack.storebtn.subtext":["自动分配球员","自動分配球員","Auto Assign Players"],
            "openpack.storebtn.popupt":["批量打开提示 - %1","批量開啟提示 - %1","Bulk Open Notice - %1"],
            "openpack.storebtn.popupm":["批量开启将会自动开启指定球员包，非重复球员保存至俱乐部，重复且评分高于 %1(黄金范围) 的球员保存至SBC仓库，无法分配则弹出未分配列表并停止程序。<br><br>批量开启数量（默认为全部）：","批量開啟將會自動開啟指定的球員包，非重複球員將保存至俱樂部，重複且評分高於 %1（黃金範圍） 的球員將保存至 SBC 倉庫，若無法分配，將彈出未分配列表並停止程序。<br><br>批量開啟數量（預設為全部）：","Bulk opening will automatically open the selected player packs.<br>Non-duplicate players will be sent to your Club.<br>Duplicate players with a rating above %1 (Gold range) will be sent to SBC storage.<br>If any players cannot be assigned, the unassigned list will be displayed and the process will stop.<br><br>Number of packs to open (default is all):"],
            "sort.desc":["由高到低","由高至低","Descending"],
            "sort.asc":["由低到高","由低至高","Ascending"],
            "packssort.switch.notice":["切换 %1 排序为按包回报价值 %2 排序","切換 %1 排序為依據包回報價值的 %2 排序","Switch %1 sorting to %2 sorting based on pack returns"],
            "allsendclub.button.text":["领取并发送球员至俱乐部","領取並發送球員至俱樂部","Claim and Send Players to Club"],
            "accelerate.popupt":["加速类型（满默契）","加速類型（滿默契）","Acceleration Type (Max Chemistry)"],
            "accelerate.popupm":["默契风格：%1  加速类型：%2<br><br>可改变加速类型默契：<br>","默契風格：%1  加速類型：%2<br><br>可改變加速類型的默契風格：<br>","Chemistry Style: %1  Acceleration Type: %2<br><br>Chemistry styles that can change acceleration type:<br>"],
            "accelerate.popupm2":["加速类型带有*标识未载入球员子属性计算存在偏差，可通过点击加速类型标识或球员简历处载入属性后矫正数值。","加速類型帶有 * 標誌表示尚未載入球員子屬性，計算結果可能存在偏差。可點擊加速類型標誌或球員履歷以載入屬性並校正數值。","Acceleration types marked with * indicate that player sub-attributes have not been loaded. This may result in inaccurate calculations. Click the acceleration type label or the player profile to load attributes and correct the values."],
            "accelerate.type.E":["爆发(E)","爆發(E)","Explosive"],
            "accelerate.type.C":["掌控(C)","受控(C)","Controlled"],
            "accelerate.type.L":["漫长(L)","長時(L)","Lengthy"],
            "unassignedlist.refresh.btn":["刷新列表","刷新清單","Refresh List"],
            "pickpreview.popupm":["请注意此处仅为展示挑选球员的预览，并非全部获得。且可能存在数据差异，请以游戏本身效果为准。","請注意，此處僅為展示可挑選球員的預覽，並非實際全部獲得的內容。且可能存在資料差異，請以遊戲內的實際效果為準。","Please note that this is only a preview of the selectable players and does not represent all obtained items. Some data discrepancies may occur; please refer to the in-game results as the final standard."],
            "inpacktile.title":["包内球员","包內球員","In Packs"],
            "inpacktile.desc":["仅为展示，不包含常驻的低概率传奇和英雄。","僅供展示，不包含常駐的低機率傳奇與英雄。","For display only. Does not include permanently available low-probability Icons and Heroes."],
            "player.inclub":["已拥有","已擁有","Owned"],
            "player.noclub":["未拥有","未擁有","Not Owned"],
            "specialtile.title":["特殊品质","特殊品質","Special Quality"],
            "specialtile.desc":["可动态升级或默契提升的品质","可動態升級或默契提升的品質","Qualities with Dynamic Upgrades or Chemistry Boosts"],
            "special.dynamic":["动态升级","動態升級","Dynamic Upgrade"],
            "special.extrachem":["默契提升","Chemistry Boost","Chemistry Boost"],
            "special.dynamic.notice":["该球员是 %1 提升截止剩余：%2 天","該球員為 %1 提升截止剩餘：%2 天","This player is %1, with %2 days remaining until the upgrade deadline."],
            "special.extrachem.notice":["该球员是 %1 额外默契为：%2","該球員為 %1 額外默契為：%2","This player is %1, providing an additional chemistry boost of %2."],
            "special.extrachem.full":["满默契","滿默契","Full Chemistry"],
            "special.extrachem.club":["+%1 俱乐部","+%1 俱樂部","+%1 Club"],
            "special.extrachem.league":["+%1 联赛","+%1 聯賽","+%1 League"],
            "special.extrachem.nation":["+%1 地区","+%1 地區","+%1 Nation"],
            "special.extrachem.allLeague":["+%1 所有联赛","+%1 所有聯賽","+%1 All Leagues"],
            "special.extrachem.allNation":["+%1 所有地区","+%1 所有地區","+%1 All Nations"],
            "loadingclose.template3":["尝试替换假想球员 当前进度：%1/%2 位置：%3 点此结束程序","嘗試替換假想球員 當前進度：%1/%2 位置：%3 點此結束程式","Attempting to replace the concept player Progress: %1/%2 Position: %3 click here to end the program"],
            "substitution.unassigned":["未分配","未分配","Unassigned"],
            "substitution.samerating":["同评分","同評分","Same Rating"],
            "substitution.chemistry":["默契","默契","Chemistry"],
            "substitution.requirement":["满需求","滿需求","Requirement Met"],
            "substitution.sameclub":["同俱乐部","同俱樂部","Same Club"],
            "substitution.samenationandleague":["同地区&联赛","同地區＆聯賽","Same Nation & League"],
            "substitution.swaptitle":["替换为","替換為","Replace With"],
            "substitution.addtitle":["添加为","添加為","Add As"],
            "substitution.swapconcepttitle":["替换假想球员为","替換假想球員為","Replace Concept Player With"],
            "listfilter.title.rating":["评分","評分","Rating"],
            "listfilter.title.scope":["范围","範圍","Scope"],
            "listfilter.title.position":["位置","位置","Position"],
            "listfilter.title.chemistry":["默契","默契","Chemistry"],
            "listfilter.title.quality":["品质","品質","Quality"],"listfilter.sort.asc":["∆ 升序","∆ 升序","∆ ASC"],
            "listfilter.sort.desc":["∇ 降序","∇ 降序","∇ DESC"],
            "listfilter.select.all":["全部","全部","ALL"],
            "listfilter.select.position":["仅%1","僅%1","%1"],
            "listfilter.select.storage":["仓库","倉庫","Storage"],
            "listfilter.select.club":["俱乐部","球會","Club"],
            "listfilter.select.normal":["普通","普通","Normal"],
            "listfilter.select.special":["特殊","特殊","Special"],
            "academy.attr.ovr":["总评","總評","ovr"],
            "academy.attr.ps":["特技","特技","ps"],
            "academy.attr.psplus":["金特技","金特技","ps+"],
            "academy.attr.wf":["逆足","逆足","wf"],
            "academy.attr.sm":["花式","花式","sm"],
            "academy.attr.post":["位置","位置","pos"],
            "academy.attr.role":["角色","角色","role"],
            "academy.attr.rarity":["稀有度","稀有度","rartiy"],
            "academy.attr.cu":["装饰","裝飾","cos"],
            "academy.attr.not":["无提升","無提升","No Boost"],
            "academy.attr.maintips":["*为直接加成的卡面属性，需计算，此处为预估。","*為直接加成的卡面屬性，需計算，此處為預估。","* Direct card boosts require calculation; values are estimated."],
            "academy.attr.pac":["速度","速度","pac"],
            "academy.attr.sho":["射门","射門","sho"],
            "academy.attr.pas":["传球","傳球","pac"],
            "academy.attr.dri":["带球","運球","dri"],
            "academy.attr.def":["防守","防守","def"],
            "academy.attr.phy":["体格","體能","phy"],
            "academy.attr.div":["扑救","撲救","div"],
            "academy.attr.han":["接球","接球","han"],
            "academy.attr.kic":["开球","開球","kic"],
            "academy.attr.ref":["反应","反應","ref"],
            "academy.attr.spd":["速度","速度","spd"],
            "academy.attr.pos":["站位","位置","pos"],
            "academy.attr.tips":["注：属性数值为子属性总和，非卡面属性。","註：屬性數值為子屬性總和，非卡面屬性。","Note: Attribute values are sub-attribute totals, not card attributes."],
            "academy.attr.main":["属性","屬性","attr"],
            "academy.attr.sub":["子属性","子屬性","sub-attr"],
            "academy.attr.load":["基础属性需加载，请点击左侧+按钮。","基礎屬性需載入，請點擊左側 + 按鈕。","Base attributes not loaded. Click the + button on the left."],
            "special.extrachem.popupm":["此处只按照球员当前稀有度判断，不包含已经进化改变稀有度的球员。","此處僅依據球員目前稀有度判斷，不包含已進化改變稀有度的球員。","Based only on the player's current rarity; players changed by Evolutions are excluded."],
            "special.dynamic.popupm":["此处只按照球员本身的稀有度判断，不包含进化为此稀有度的球员。","此處僅依據球員本身稀有度判斷，不包含進化為此稀有度的球員。","Based only on the player's original rarity; players evolved into this rarity are excluded."],
            "apiprroxy.popupt":["设置FUTGG转发","設置FUTGG轉發地址","Set the FUTGG forwarding address"],
            "apiprroxy.popupm":["这里可以设置FUTGG转发地址，切记按照规则设置，否则无法读取价格，留空则清空。","這裡可以設置FUTGG轉發地址，請務必按照規則設置，否則無法讀取價格，留空則清空。","Here you can set the FUTGG forwarding address. Be sure to configure it according to the rules; otherwise, the price will not be read. Leave it blank to clear the setting."],
            "apiprroxy.placeholder":["请输入完整的网址，格式为 https://***/","請輸入完整的網址，格式為https://***/","Please enter the complete URL in the format of https://***/"],
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
        info.base.sytle = ".tns-horizontal.tns-subpixel>.tns-item{position: relative;}button.notevents{pointer-events: none;color: #a4a9b4;}.btn-standard.section-header-btn.mini.call-to-action.fsu-getprice{margin-left: 1rem;}.btn-standard.section-header-btn.mini.call-to-action.fsu-getprice:hover{background-color:#e9dfcd}.view-modal-container.form-modal header .fsu-getprice{position: absolute;top: .5rem;left: 0;height: 2rem;line-height: 2rem;}.ut-sbc-set-tile-view.production-tagged .tileHeader::before{display:none;}a.header_explain{color: #a2a2a2;text-decoration: none;line-height: 3rem;}a.header_explain:hover{color: #ffffff;}.ut-fifa-header-view{display: flex;justify-content: space-between;}    .fsu-loading-close{display: none;position: absolute;bottom: 38%;z-index: 999;}.fsu-loading .fsu-loading-close{display: block;text-align: center;}                                                               .fsu-sbc-info div{width: 50%;}.fsu-sbc-info div:last-child{display: flex;justify-content: space-around;}.fsu-sbc-info .currency-coins::after{font-size:16px}                .rewards-footer li{position: relative;}.fsu-sbc-vplayer {position: absolute;bottom: .25rem;right:0;background-color: #8A6E2C;padding: .5rem;color: #15191d;line-height: 1rem;font-size: 16px;}.fsu-sbc-vplayer:hover{background-color: #f6b803;}                 @media screen and (min-width:1280px) and (max-width:1441px) {.ut-split-view {padding:0;}.ut-split-view>.ut-content {max-height:100%;}}                     li.with-icon.hide {display: none;}                      .fsu-input{border: 0 !important;background-color: rgba(0,0,0,0) !important;padding-left: 0 !important;font-family: UltimateTeamCondensed,sans-serif;font-size: 1em;color: #f8eede;}                  .fsu-quick{position:absolute;top:100%;width:100%;display:flex;align-items:center;font-family:UltimateTeam,sans-serif;justify-content:center;margin-top:.2rem}.fsu-quick.top .fsu-quick-list{display:flex;align-items:center}.fsu-quick-list .im{height:1.8rem;line-height:1.8rem;cursor:pointer;background-color:#2b3540;font-family:UltimateTeam,sans-serif;border-radius:4px;padding:0 .2rem;font-size:1rem;font-weight:900;color:#f2f2f2;overflow: hidden;}.fsu-quick-list .im:hover{background-color:#394754}.fsu-quick-list.other .im{background-color:#f8eede;color:#ef6405;font-weight:500;margin-left:.3rem;text-align:center;}.fsu-quick-list.other .im:hover{background-color:#f5efe6}.fsu-quick-list .im span{font-size:.8rem;font-weight:300;color:#a4a9b4}.fsu-quick-list.left .im{margin-right:.3rem}.fsu-quick-list.right .im{margin-left:.3rem}.fsu-quick-inr{font-size:.8rem;margin:0 .3rem}.fsu-quick.right{position:absolute;top:50%;width:2rem;display:block;right:0%;z-index:3;-webkit-transform:translateY(-50%) !important;transform:translateY(-50%) !important}.phone .fsu-quick.right{top:8rem;-webkit-transform:translateY(0%) !important;transform:translateY(0%) !important}.fsu-quick.right .fsu-quick-list .im{width:1.4rem;margin-bottom:.2rem;text-align:center}.fsu-quick.right .fsu-quick-list .im.disabled{background-color:#30302e;color:#656563}.entityContainer>.name.untradeable{color:#f6b803}                                  .phone .fsu-sbc-info{font-size:.875rem}.phone .fsu-task{display:block;font-size:.875rem}.phone .fsu-price-box.right > div .value{font-size:1rem;margin-top:.2rem}.phone .fsu-price-box.right > div .title{font-size:.875rem}.phone .fsu-player-other > div{font-size:0.6rem}.phone .small.player .fsu-cards-price{font-size:.875rem}.phone .small.player .fsu-cards-price::after{font-size:.875rem}.phone .fsu-cards.fsu-cards-attr{font-size:.6rem}.phone .fsu-quick-list .im{font-size:.875rem}                                              .ut-pinned-item .listFUTItem.has-auction-data .fsu-player-other{margin-top:0 !important;top:.8rem;right:.2rem;position:absolute;z-index:2}        .fsu-sbcfilter-box{align-items:center;background-color:#394754;display:flex;justify-content:center;padding:1rem;z-index:10}.fsu-sbcfilter-option{align-items:center;box-sizing:border-box;display:flex;flex:1;max-width:300px}.fsu-sbcfilter-option .ut-drop-down-control{margin-left:1rem;flex:1}                                .fsu-setbox{display: grid;grid-template-columns: repeat(3, minmax(0, 1fr));}.phone .fsu-setbox{display: grid;grid-template-columns: repeat(1, minmax(0, 1fr));}                                  .btn-standard.mini.fsu-reward-but{height:2rem;line-height:2rem;position:absolute;top:.2rem;left:50%;transform:translateX(-50%)}.btn-standard.mini.fsu-reward-but.pcr{bottom:1.9rem;top:auto}           .btn-standard.mini.fsu-pickspc{line-height:2rem;height:2rem;margin:.5rem auto 0 auto}.ut-image-button-control.back-btn.fsu-picksback{height:100%;width:3rem;position:absolute;left:0;font-size:1.6rem}                       .fsu-fcount{position:absolute;right:0.5rem;height:1.4rem;top:.8rem;line-height:1.5rem;padding:0 .4rem;border-radius:.2rem;z-index:1;background-color: #264A35;}        .phone .fsu-store-tile .ut-tile-content-graphic-info .description{display:block;}        .fsu-range button{margin:0}                                                               .fsu-price-box{font-family:UltimateTeamCondensed,sans-serif}.fsu-price-box.right{position:absolute;right:1rem;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);display:flex;align-items:center}.fsu-price-box.right>div{background-color:#3B4754;color: #ffffff;padding:0.5rem;text-align:center;border-radius:4px;margin-top:0;display:block}.fsu-price-box.right>div .title{color:#a4a9b4;padding:0;font-size:1rem;line-height:1rem}.fsu-price-box.right>div .title span.plus{color:#36b84b;font-weight:500;padding-left:.2rem}.fsu-price-box.right>div .title span.minus{color:#d21433;font-weight:500;padding-left:.2rem}.fsu-price-val .currency-coins::after{font-size:1rem;margin-top:-3px}.fsu-price-box.bottom{padding-left:6.3rem;margin:.2rem 0rem}.fsu-price-box.bottom>div{display:flex;align-items:center;font-size:0.9375rem}.fsu-price-box.bottom>div .title{color:#a4a9b4;margin-right:.2rem}.fsu-price-box.bottom .fsu-price-val .currency-coins::after{font-size:inherit}.fsu-price-box.trf{position:absolute;left:54%;margin-top:.2rem}.fsu-price-box.trf .fsu-price-val{display:flex;align-items:center;background-color:#3B4754;color: #ffffff;text-align:center;border-radius:4px;padding:0 .3rem;height:20px}.fsu-price-box.trf .fsu-price-val .title{font-size:.875rem;margin-right:.2rem}.fsu-price-box.trf .fsu-price-val .currency-coins::after{margin-top:-2px}.fsu-price-box.top{position:absolute;right:0%;top:8%;display:flex;align-items:center}.fsu-price-box.top>div{display:flex;align-items:center;background-color:#3B4754;color: #ffffff;padding:.1rem 0.5rem;text-align:center;border-radius:4px}.fsu-price-box.top>div .title{font-size:0.875rem;margin-right:0.5rem}.fsu-price-last{margin-right:.5rem}.fsu-player-other{display:flex;margin-top:.2rem;font-family:UltimateTeamCondensed,sans-serif;font-size:.8rem;line-height:1rem}.fsu-price-box.top+.fsu-player-other{margin-top:.4rem}                                                                    .fsu-cards-lea-small,.fsu-cards-accele-large,.fsu-cards-meta,.fsu-cards-price{position:absolute;z-index:2;font-family:UltimateTeamCondensed,sans-serif;font-weight:300;text-align:center;width:1.6rem;top:25%}.fsu-cards-lea-small{bottom:8%;height:16%;font-size:70%;width:100%;top:auto;font-weight:500;line-height:1}.fsu-cards-lea-small~.playStyle,.ut-squad-pitch-view:not(.sbc) .fsu-cards-lea-small{display:none !important}.specials .fsu-cards-lea-small{bottom:10%}.fsu-cards-accele-large,.fsu-cards-meta,.fsu-cards-price{width:auto !important;padding:0 0.2rem;left:50%;-webkit-transform:translateX(-50%) !important;transform:translateX(-50%) !important;white-space:nowrap;background-color:#13151d;border:1px solid;border-radius:5px}.fsu-cards-accele-large,.fsu-cards-meta{bottom:0;top:auto !important}.fsu-cards-price{color:#fff;top:0 !important}.ut-squad-pitch-view:not(.sbc) .fsu-cards-lea-small~.playStyle{display:block !important}            .fsu-cards-attr,.fsu-cards-pos{position:absolute;z-index:2;font-family:UltimateTeamCondensed,sans-serif;font-weight:300;text-align:center;top:25%;display:flex;flex-direction:column;gap:2px;transform: scale(0.9);}                .large.player~.fsu-cards-attr,.large.player .fsu-cards-attr,.ut-tactics-instruction-menu-view  .fsu-cards-attr{left:calc(50% + 61px);font-size:14px;gap:4px;transform: scale(1);}           .large.player~.fsu-cards-attr > div,.large.player .fsu-cards-attr > div,.large.player~.fsu-cards-pos > div,.large.player .fsu-cards-pos > div{width:28px;height:16px;line-height:17px}       .small.player~.fsu-cards-attr{left:70px;font-size:12px;top:50%;transform:translateY(-50%) scale(0.9);}.small.player~.fsu-cards-attr > .fsu-bodytype{font-size:11px}                         .reward.small .small.player~.fsu-cards-attr{left:calc(50% + 42px);top:20%}.reward.small .small.player~.fsu-cards-pos{left:calc(50% - 66px);top:20%;font-size:12px}             .ut-squad-slot-view .small.player~.fsu-cards-attr{left:auto;right:-4px}              .large.player~.fsu-cards-pos,.large.player .fsu-cards-pos,.ut-tactics-instruction-menu-view  .fsu-cards-pos{left:calc(50% - 90px);font-size:14px;gap:4px;transform: scale(1);}                  .ut-squad-slot-view .small.player~.fsu-cards-pos{flex-direction:row;font-size:12px;top:auto;bottom:-1.6rem;left:50%;transform:translate(-50%,0)}                   .ut-squad-slot-dock-view .ut-squad-slot-view .small.player~.fsu-cards-pos{bottom:-.6rem}.ut-store-xray-pack-details-view .large.player~.fsu-cards-attr{left:calc(50% + 42px)}.large.player .fsu-cards-attr{right:0;left:auto;}.large.player .fsu-cards-pos{right:auto;left:0;}       .fsu-akb .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip{font-family:UltimateTeam-Icons,sans-serif;font-style:normal;font-variant:normal;font-weight:400;text-transform:none;flex-shrink:0;font-size:1em;text-decoration:none;text-align:center;line-height:1.5rem;transition:color .3s,bottom .3s,top .3s}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip::before,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip::before{content:'\\E051';color:#3a4755}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--grip::before,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--grip::before{content:'\\E02F';color:#36b94b}.fsu-akb .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--track,.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control.toggled:not(.disabled) .ut-toggle-control--track{background-color:#36b94b}.fsu-akb .ut-toggle-cell-view>.ut-toggle-cell-view--label{display:none}.fsu-akb .ut-toggle-cell-view{position:absolute;z-index:10;transform:scale(0.7);padding:0 1rem 1rem 0;cursor:pointer}.fsu-akb-title{align-items:center;background-color:#2b3540;display:flex;justify-content:space-between;padding:.75rem .5rem;border-top:solid 1px #556c95}.fsu-akb-left{display:flex;align-items:center}.fsu-akb-title .ut-toggle-cell-view>.ut-toggle-control .ut-toggle-control--grip{transition:color .3s,left .3s,right .3s}.fsu-akb-left>div{padding:0 .675rem 0 0}.fsu-akb-left>div:last-child{padding-right:0}                  body.landscape.futweb{min-height: 38rem;}                                                         html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.locked,html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.untradeable{padding-right:2.7em}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.locked::before,html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked.untradeable::before{right:1.4em}                                    .filter-btn.fsu-eligibilitysearch{height:1.8rem;width:1.8rem;position:absolute;right:0}.ut-image-button-control.filter-btn.fsu-eligibilitysearch::after{font-size:1rem;content:'\\E09D'}                  .item.player>.fsu-cards-rating{position:absolute;left:50%;top:50%;font-size:5rem;transform:translate(-50%,-50%)}.large.item.player>.fsu-cards-rating{font-size:7rem}.item.player.ut-item-loading>.fsu-cards-rating{opacity:1}.item.player.ut-item-loaded>.fsu-cards-rating{opacity:0}                        .fsu-chemistryfilter{position:absolute;right:.5rem;top:.5rem;}                          .ut-list-active-tag-view .label-container.fsu-inclubtag{background-color:#0b96ff}.ut-list-active-tag-view .label-container.fsu-inclubtag::after{border-color:#0b96ff}                                           .fsu-optionbest{position:relative}.fsu-optionbest > span,.fsu-optionbest > .player-pick-option,.fsu-optionbest > .fsu-pickspc{position:relative;z-index:1}.fsu-optionbest >.no-favorites-tile{position:absolute;max-width:100%;height:120%;width:100%;margin:-15% 0 0 0;z-index:0;top:0px;right:0px;padding:0;background-image: url(https://www.ea.com/ea-sports-fc/ultimate-team/web-app/content/25E4CDAE-799B-45BE-B257-667FDCDE8044/2025/fut/dynamicObjectives/groups/f4c231d9-a38c-44a4-a932-87af2136cca5/group_background.png);}.fsu-optionbest > .no-favorites-tile::before{font-size:2.2rem;height:2.2rem;width:2.2rem;line-height:2.2rem;}.fsu-optionbest > .player-pick-option.selected ~ .no-favorites-tile::before{display:none}                      .fsu-navsbc{height:80%;justify-content:flex-end;margin-right:1rem;flex: 0 0 auto;}.fsu-navsbc button{margin:-0.25rem;width:60px;}.phone .fsu-navsbc{margin-right:.25rem}.phone .fsu-navsbc button{margin:-.1rem}    .fsu-shownavsbc .ut-navigation-button-control{width:3rem}.fsu-shownavsbc .title{flex:1 0;position:relative !important;width:auto !important;text-align:left !important;padding:0 0 0 0.5rem !important}.fsu-shownavsbc .fsu-navsbc{height:3rem}.fsu-shownavsbc .ut-iteminfochange-button-control{display:none}.fsu-shownavsbc .fsu-navsbc button{width:2.6rem}        .phone .fsu-optionbest > .no-favorites-tile{height:108%;margin:-4% 0 0 0;border-radius:10px}.phone .fsu-optionbest > .no-favorites-tile::before{font-size:1rem;height:1rem;width:1rem;line-height:1rem;margin:.25rem}                .fsu-cards-attr div.fsu-academytips{display:flex;align-content:center;justify-content:center;background:linear-gradient(to bottom,#00A7CC 0,#007D99 100%);color:#0f1010;box-shadow:0 1px 1px 0 rgba(0,0,0,.5);border:none}.fsu-academytips-icon{height:0;width:10px;margin-left:-2px;}                              .fsu-academytips-icon::before,.ut-store-pack-details-view--description.fsu-packprice:before,.fsu-cards-price.fsu-unassigned:before{font-family:UltimateTeam-Icons,sans-serif;font-style:normal;font-variant:normal;font-weight:400;text-decoration:none;text-transform:none}.fsu-academytips-icon::before{content:'\\E001'}.ut-store-pack-details-view--description.fsu-packprice:before{color:#f7b702;display:inline-block;content:'\\E096';margin-right:.25rem}.fsu-cards-price.fsu-unassigned:before{content:'\\E0C4';display:inline-block;margin-right:.3em;vertical-align:middle;color:#f7b702}                                      .fsu-cards-meta{padding:0;display:flex;font-family:UltimateTeam,sans-serif;font-size:.8rem;height:1rem;align-items:center;z-index:5;cursor:pointer;}.fsu-cards-meta > div{margin-right:.2rem}.fsu-cards-meta > div:first-child{border-radius:4px 0 0 4px;height:1rem;width:1.6rem;font-weight:900;}                                button.currency.call-to-action.fsu-challengefastbtn{height:2.6rem;line-height:1.4rem;padding:0px 1rem;font-size:1rem}button.currency.call-to-action.fsu-challengefastbtn > span{display: block !important;}button.currency.call-to-action.fsu-challengefastbtn .subtext{font-size:80%;line-height:1rem;color:#a6a6a6;}.ut-sbc-challenge-table-row-view .fsu-challengefastbtn{width:70%}@media (min-width:768px){.ut-sbc-challenge-table-row-view .fsu-challengefastbtn{width:60%}}.ut-sbc-challenge-table-row-view.selected button.currency.call-to-action.fsu-challengefastbtn{background-color:#222426;color:#fcfcf7}.ut-sbc-challenge-table-row-view.selected button.currency.call-to-action.fsu-challengefastbtn.hover{background-color:#575753}.ut-sbc-challenge-table-row-view button.currency.call-to-action.fsu-challengefastbtn.disabled{background-color:#575753;color:#30312f}                                     .fsu-navsbccount{padding:.2em 0;margin-right:.5rem;align-items:center;display:flex;justify-content:flex-end}.fsu-navsbccount::after{background-position:right top;content:'';background-repeat:no-repeat;background-size:100%;display:inline-block;height:1em;vertical-align:middle;width:1em;background-image:url(https://www.ea.com/ea-sports-fc/ultimate-team/web-app/images/sbc/logo_SBC_home_tile.png);margin-top:-.15em;margin-left:.3em}                                .ut-image-button-control.filter-btn.fsu-transfer::after{content:'\\E0E5';font-size:1.6rem}.ut-image-button-control.filter-btn.fsu-club::after{content:'\\E052';font-size:1.6rem}.ut-image-button-control.filter-btn.fsu-swap::after{content:'\\E0E4';font-size:1.4rem}.ut-image-button-control.filter-btn.fsu-refresh::after{content:'\\E0C4';font-size:1.4rem}.ut-image-button-control.filter-btn.fsu-storage::after{content:'\\E0C9';font-size:1.4rem}.filter-btn.fsu-swap,.filter-btn.fsu-transfer,.filter-btn.fsu-club,.filter-btn.fsu-storage,.filter-btn.fsu-refresh{margin-left:1rem;width:3rem;height:3rem}                                            .ut-club-hub-view .tile.fsu-storage .tileContent:before { content:'\\E0C9'; }                          .ut-list-active-tag-view .label-container.fsu-instoragetag,.listFUTItem.hover .ut-list-active-tag-view .label-container.fsu-instoragetag{background-color:#f19be6}.ut-list-active-tag-view .label-container.fsu-instoragetag::after,.listFUTItem.hover .ut-list-active-tag-view .label-container.fsu-instoragetag::after{border-top-color:#f19be6}                                                                                                                                      .ut-player-picks-view .carousel-indicator-dots.fsu-pickbest li{width:16px;height:16px;text-align:center;overflow:hidden}.ut-player-picks-view .carousel-indicator-dots.fsu-pickbest li.active{transform:scale(1.4)}.ut-player-picks-view .carousel-indicator-dots.fsu-pickbest li.best::after{content:'\\E0D4';font-family:UltimateTeam-Icons,sans-serif;font-style:normal;font-variant:normal;font-weight:400;text-decoration:none;text-transform:none;color:#07f468;font-size:1rem;line-height:1.1rem}.ut-player-picks-view .carousel-indicator-dots.fsu-pickbest li.best.active::after{color:#fd4821}                                     .ut-button-group button.more.fsu-open::after{-webkit-transform:rotate(0deg) !important;transform:rotate(0deg) !important}                                                                .fsu-sbcNeedsBody,.fsu-realProdBody{height:30vh;overflow-y:auto}.fsu-sbcNeedsTitle,.fsu-sbcNeedsBodyItem,.fsu-realProdTitle,.fsu-realProdBodyItem{display:flex}.fsu-sbcNeedsTitle,.fsu-realProdTitle{padding:.5rem 1rem;background-color:#30312f;font-size:1rem}.fsu-sbcNeedsBodyItem,.fsu-realProdBodyItem{padding:.75rem 1rem;align-items:center;background-color:#18191b;font-size:1em}.fsu-sbcNeedsBodyItem:nth-of-type(even),.fsu-realProdBodyItem:nth-of-type(even){background-color:#212224}.fsu-sbcNeedsTitle div,.fsu-sbcNeedsBodyItem div{width:18%}.fsu-realProdTitle div,.fsu-realProdBodyItem div{width:20%}.fsu-sbcNeedsTitle div:last-child,.fsu-sbcNeedsBodyItem div:last-child{width:28%;text-align:right}.fsu-realProdTitle div:first-child,.fsu-realProdBodyItem div:first-child{width:40%}                                    .fsu-price-reward::after{font-family:UltimateTeam-Icons,sans-serif;content:'\\E0C9';font-size:94%;color:#fae8e6}.small.player .fsu-price-box{font-size:90%}.large.player .fsu-price-box{font-size:1rem}.small.player .fsu-price-box,.large.player .fsu-price-box{display:flex;justify-content:center;align-items:center}.fsu-price-box.old{background-color:#0f1417;color:#a4a9b4;border:0}.fsu-price-val[data-value='0'][data-type='1']{display:none !important}.fsu-cards-price::after{margin-left:.2em !important;margin-top:0}.large.player .fsu-cards-price.currency-coins::after{margin-top:-.15em}.fsu-price-box.right>div .value{font-size:1.2rem;margin-top:.5rem;line-height:1.2rem;display:flex;justify-content:center;align-items:center}.fsu-price-val .fsu-price-reward::after{margin-left:.3em;font-size:80%;margin-top:-.15em}                              .fsu-cards-foot{position:relative}.fsu-cards-foot::after{content:'';height:3px;width:3px;background-color:var(--fsu-cards-foot-color);display:block;position:absolute;bottom:0px;border-radius:2px}.fsu-cards-foot.l::after{left:0px}.fsu-cards-foot.r::after{right:0px}                    .fsu-cards-attr div,.fsu-cards-pos div{border:1px solid;border-color:inherit;line-height:100%;border-radius:5px;color:var(--fsu-cards-color);background:var(--fsu-cards-background);width:22px;white-space:nowrap;height: 13px;line-height: 15px;}                        .fsu-lockbtn{padding:0 8px !important;min-height:30px !important;position:absolute;right:64px;bottom:0;font-size:0.75rem !important;z-index:2;display:flex;align-items:center}.fsu-lockbtn.lock::before{content:'\\E09C'}.fsu-lockbtn.unlock::before{content:'\\E09C'}.fsu-lockbtn::before{font-family:UltimateTeam-Icons,sans-serif;padding-right:.2rem;content:'';display:block}.fsu-lockbtn.unlock{background-color:#fcfcf7;color:#151616}.fsu-lockbtn.unlock::after{content:'';display:block;position:absolute;left:18px;top:10px;width:2px;height:16px;background:#ff4c4c;transform:rotate(45deg);transform-origin:top center}.ut-club-hub-view .tile.fsu-lock .tileContent:before { content:'\\E09C'; }html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked::after{font-family:UltimateTeam-Icons,sans-serif;color:#d31332;margin-top:2px;position:absolute;width:1.1em;content:'\\E09C';right:0}html[dir=ltr] .listFUTItem .entityContainer>.name.fsulocked{padding-right:1.4em}html[dir=ltr] :not(.phone) .listFUTItem .entityContainer>.name.fsulocked.untradeable { max-width: 42%; }.fsu-cardlock{position:absolute;height:.9rem;width:.9rem;right:0;bottom:5%;z-index:2;background-color:#222426;border:1px solid #333d47;border-radius:100%;text-align:center;box-shadow:0 1px 3px #000;font-size:10.8px}.fsu-cardlock::before{font-family:UltimateTeam-Icons,sans-serif;content:'\\E09C';display:inline-block;vertical-align:middle;background-size:100% auto;color:#d31332;background-repeat:no-repeat}                                  .listfilter-btn{padding:0;width:100%;height:1.6rem;line-height:1.8rem;border-radius:.4rem;font-size:.9rem;min-height:1.6rem}                                      .ut-squad-building-set-status-label-view.refresh.sbccount{display:flex;align-items:center;gap:4px;opacity:0.5}.ut-squad-building-set-status-label-view.refresh.sbccount::before{content:'\\E0C2';color:#36b84b;font-size:14px;line-height:17px}                                                           .fsu-trypack-box{position:absolute;right:0}.landscape button.currency.fsu-trypack{padding:.25rem .5rem;width:auto;color:#f2f2f2;background:#556c95;border-radius:.6rem;align-items:center;display:flex;font-family:UltimateTeam-Icons,sans-serif;min-height:36px}.landscape button.currency.fsu-trypack .text{font-size:1rem;font-weight:600}.landscape button.currency.fsu-trypack::after{content:'\\E0A2';font-size:110%;padding-left:.2rem}.landscape button.currency.fsu-trypack.hover{background:#9e9e99}.phone .fsu-trypack-box{position:relative;}                                .fsu-player-other>div{background:#3B4754;color:#a4a9b4;padding:0.1rem 0.3rem;text-align:center;border-radius:20px;font-size:inherit;line-height:1.5;margin-right:0.5rem;height:1rem;white-space:nowrap}.fsu-player-other>div.swap{background:#36b84b;color:#201e20}.fsu-player-other>div.not{background:#8A6E2C;color:#201e20}.fsu-player-other>div.storage{background:#f6b803;color:#201e20}.fsu-player-other>div.yes{background:#264A35;color:#201e20}.large.player+.fsu-player-other{justify-content:center}.large.player+.fsu-player-other>div{margin-right:0rem}.fsu-player-other .currency-coins::after{font-size:.875rem;margin-top:-3px;margin-left:2px !important}@media (max-width:1130px){.has-auction-data .fsu-player-other{margin-top:5rem !important}.has-auction-data .fsu-price-box.trf{margin-top:5rem !important;left:auto;right:3%}}                                                                                     /*商店数量标识*/.ut-store-hub-view .storehub-tile.packs-tile.highlight[data-num]::after{content:attr(data-num);top:22px;padding:2px 6px;border-radius:4px;line-height:1.2rem;font-size:1.2rem;color:#0c0d0d;height:16px;width:auto}@media (min-width:768px){.ut-store-hub-view .storehub-tile.packs-tile.highlight[data-num]::after{height:20px;font-size:1.4rem;line-height:1.4rem;top:26px;padding:2px 8px}}                         /*旧卡样式去除边框*/.fsu-cards.old div{border:none}                                 /*阵容价值部分*/.fsu-squad-pValue{font-family:UltimateTeamCondensed,sans-serif;font-weight:400;font-size:.875rem;text-overflow:ellipsis;white-space:nowrap}.fsu-squad-pValue.currency-coins::after{font-size:.875rem;margin-left:.2em !important;margin-top:-.2em !important}.fsu-squad-pTitle .plus{color:#36b84b;padding-left:.1rem}.fsu-squad-pTitle .minus{color:#d21433;padding-left:.1rem}                                    /*弹窗球员列表显示优化*/.fsu-popupItemList{display:flex;flex-direction:column;gap:12px}.fsu-popupItemList > .listFUTItem{margin:0 !important}                                           /*改变为公共新标识*/.fsu-newtips{background-color: #ee2208;z-index:2;position:absolute;left:0;top:20px;transform:rotate(-45deg);transform-origin:0 100%;height:36px;line-height:42px;width:80px;text-align:center;font-weight:bold}            /*调整配色*/.fsu-task{display: flex;justify-content: space-between;padding: 0.5rem;background-color: #ee2208;}.fsu-task.no{background-color: #b1570c;}.task-expire{background-color: #b1570c;height: 2rem;line-height: 2rem;text-align: center;}.fsu-sbc-info{padding: 0.5rem;background-color: #2f4a5b;display: flex;font-family: UltimateTeamCondensed,sans-serif;justify-content: space-between;font-size: 1rem;}                        /*导航栏计数标识*/.fsu-tab-count{font-size:14px;align-self:center;padding:4px 6px;background-color: #575753;color:#a6a6a1;line-height:1;border-radius:4px;margin-left:6px}.selected > .fsu-tab-count{background-color: #ee2208;color:#fcfcfc}.selected > .fsu-tab-count.expire{background-color: #aa540c}.phone .fsu-tab-count{padding:2px 3px;font-size:12px;border-radius:3px}                           /*挑选包预览*/.fsu-popupItemList .listFUTItem .entityContainer>.name{padding-top:10px;padding-bottom:0px}html[dir=ltr] .fsu-popupItemList .listFUTItem .entityContainer .item{margin-right:14px}.fsu-popupItemOther{font-size:26px;display:flex;color:#ffffff;width:100%;justify-content:space-between;align-items:center;padding:8px;background-color:#2f4a5b;box-sizing:border-box;gap:12px}.fsu-popupItemOther .btn-standard{width:auto;flex:0;min-width:120px;margin-bottom:0}.fsu-popupItemTrait{display:flex;gap:8px}.phone .fsu-popupItemOther{flex-direction:column}.phone .fsu-popupItemOther .btn-standard{width:100%}.fsu-traitIcon.fut_icon.icon{color:#ffc91f}.fsu-traitIcon.fut_icon.icon_basetrait16{position:relative}.fsu-traitIcon.fut_icon.icon_basetrait16:before{content:'\\E074';z-index:1;position:relative;top:2px;background:#2f4a5b;clip-path:inset(5px 5px 10px 5px)}.fsu-traitIcon.fut_icon.icon_basetrait16::after{content:'\\E031';position:absolute;left:0;z-index:0}.fsu-popupItemList .listFUTItem .rowContent{border-radius:10px}                              /*卡片状态标识配色*/.fsu-cards-buyerror,.fsu-cards-storage,.fsu-cards-unassigned{left:auto !important;right:1% !important;background-color:#5b167d !important;border-color:#7c319e !important;color:#fae8e6 !important}.fsu-cards-buyerror{background-color:#d31332 !important;border-color:#d6675d !important;color:#fae8e6 !important}.fsu-cards-unassigned{background-color:#d19a01 !important;border-color:#DEBA43 !important;color:#FCFBF0 !important}                                             /*未分配快速任务标签*/.fsu-unassigned-fastsbcbox{display:flex;padding:6px 16px;gap:12px;overflow-x:auto}.fsu-unassigned-fastsbcbox .btn-standard{overflow:visible;position:relative;padding:3px 6px;border-radius:6px}.fsu-unassigned-fastsbcinfo{display:flex;align-items:flex-start;justify-content:center;flex-direction:column;max-width:10rem;overflow:hidden}.fsu-unassigned-fastsbcdot{position:absolute;top:-6px;right:-6px;background:#0ff;height:14px;width:14px;line-height:14px}.fsu-unassigned-fastsbctext{line-height:20px;max-width:10rem;font-size:14px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.fsu-unassigned-fastsbctsub{line-height:12px;max-width:10rem;font-size:12px;color:rgb(166,166,166)}.fsu-unassigned-fastsbctsub span{margin:0px 2px}                                                                   /*可开球员tile和特殊品质tile*/.fsu-showPlayerstile header p{padding-top:4px;color:#a6a6a1}.fsu-showPlayerstile .img-box{text-align:center;height:160px}.fsu-showPlayerstile .img-box img{height:auto;width:80%}.fsu-showPlayerstile.fsu-specialTile .img-box img{height:80%;width:auto}.fsu-showPlayerstile.fsu-specialTile .img-box img:first-child{height:70%}.fsu-showPlayerstile.fsu-specialTile .img-box img:last-child{height:70%}.fsu-showPlayerstile .ut-label-view{margin-top:-32px}                               /*包内球员*/.fsu-showPlayers{}.fsu-showPlayersList{grid-template-columns:repeat(auto-fill,300px);display:grid;justify-content:center;gap:30px;padding:48px}.fsu-showPlayersItem{background-color:#2d2c36;border-radius:16px;color:#fcfcfc;padding:16px 16px 48px 16px;overflow:clip;position:relative}.phone .fsu-showPlayersList{padding:8px;gap:8px;grid-template-columns:1fr 1fr}.phone .fsu-showPlayersItem{zoom:0.6}.fsu-showPlayersTrais{display:flex;gap:8px;justify-content:center;font-size:24px;margin:8px 0;padding:8px 0;opacity:0.6}.fsu-showPlayersCard{display:grid;justify-content:center}.fsu-showPlayersBtn{width:100%;margin:0 -16px;border-radius:0;border:none;line-height:32px;position:absolute;bottom:0}.fsu-showPlayersLabel{position:absolute;left:0;top:0;line-height:32px;font-size:14px;color:#0f0f0f;background-color:#0b96ff;padding:0 20px;border-radius:0 0 16px 0}                               /*移除部分界面name的内间距*/.fsu-removeNamePadding ~ div.name{padding-top:14px !important;padding-bottom:0px !important}                                            /*卡组展示*/.fsu-showPlayersItem.fsu-showRarity{display:flex;flex-direction:column;font-size:14px;line-height:14px}.fsu-showRarityCard{display:grid;text-align:center;position:relative;margin-top:-16px}.fsu-showRarityCard img{height:200px;margin:auto}.fsu-showRarityCount{position:absolute;top:138px;width:100%;line-height:32px;font-size:32px;font-family:UltimateTeamCondensed,sans-serif;font-weight:bold}.fsu-showRarityBtns{display:flex;position:absolute;bottom:0;width:100%;margin:0 -16px;gap:1px;background-color:rgba(222,222,216,.25)}.fsu-showRarityBtns > button{flex:1;border:0;border-radius:0;line-height:32px}.fsu-showRarityBtns > button.btn-standard.disabled{background-color:#6a6a65}.fsu-showRarityTips{padding:0 16px;background-color:#0b96ff;color:#0f0f0f;height:32px;line-height:32px;position:absolute;top:0;left:0;border-bottom-right-radius:19px}.fsu-showRarityInfo{padding:16px 0;display:flex;flex-direction:column;gap:4px;font-size:12px;line-height:12px}.fsu-showRarityAttrs,.fsu-showRarityExpiry{display:flex;align-items:center;gap:8px;justify-content:center;flex-wrap:wrap}.fsu-showRarityExpiry{gap:6px}.fsu-showRarityExpiry i{color:#f7b702}.fsu-showRarityAttrs div{padding:4px 8px;background-color:rgba(7,244,104,.4);border-radius:20px}                          /*新SBC右侧快捷列表*/.fsu-substitutionBox{margin:0 16px;padding:12px;display:flex;flex-direction:column;gap:6px}.fsu-substitutionTitle{font-size:12px;line-height:14px}.fsu-substitutionBtns{background:#6a696d;display:flex;justify-content:space-around;font-size:14px;line-height:14px;gap:1px;border-radius:12px;overflow:clip;align-items:center}.fsu-substitutionBtns > button{flex:1;text-align:center;padding:12px 0;background:#504f52;font-size:inherit;line-height:inherit;border-radius:0;border:0;min-height:auto;}.fsu-substitutionTitle:not(:first-of-type) {margin-top: 12px;}                                                    /*新排序筛选*/.fsu-SortFilterBox{display:flex;gap:8px;margin:0px 16px 8px 16px}.fsu-SortFilterItem{flex:1;min-width:0}.fsu-SortFilterTitle{font-size:12px;line-height:14px;margin-bottom:4px;color:#a6a6a1}.fsu-SortFilterBtn{border:none;border-radius:8px;width:100%;min-height:auto;font-size:14px;background:#504f52;padding:8px 0px;white-space:nowrap;line-height:14px;overflow:hidden}.fsu-SortFilterBtn.priority{background: #786735;}                                   /*新阵容价值*/.fsu-SquadValue{position:absolute;right:20px;top:20px;font-family:UltimateTeamCondensed,sans-serif;font-weight:400}.fsu-SquadValueItem{background:#4e4f4dcc;font-size:17px;line-height:18px;padding:8px 10px 6px 10px;border-radius:4px;display:flex;align-items:center;gap:8px;color:#fcfcfc;justify-content:space-between;margin-bottom:10px}.fsu-SquadValueTitle{font-size:14px}.fsu-SquadValuePrice{}.phone .fsu-SquadValue{right:auto;left:14px;top:auto;bottom:62px;text-shadow:2px 2px 3px rgba(0,0,0,.5)}.phone .fsu-SquadValueItem{font-size:15px;line-height:16px;padding:0px;margin-bottom:0px;background:none;margin-top:8px}.phone .fsu-SquadValueTitle{font-size:13px}                               /*新价格显示框*/.fsu-PriceBar{position:absolute;transform:translateX(-50%) scale(0.9) !important;left:50%;z-index:2;font-family:UltimateTeamCondensed,sans-serif;display:flex;gap:8px}.fsu-PriceBarItem{display:flex;align-items:stretch;justify-content:center;background-color:#13151d;border:1px solid #3f444b;font-size:15px;border-radius:4px;overflow:hidden;height:17px;box-shadow:0px 1px 3px rgb(63 68 75 / 40%)}.fsu-PriceBarItem .fsu-PriceValue{display:flex;align-items:center;padding:3px 4px 0px 4px;color:#f7b702}.fsu-PriceBarItem .fsu-PriceType{display:flex;align-items:center;padding:2px 3px 0 1.6px;background-color:#2b3036;color:#a0a0a0;font-size:11px;font-weight:700;font-style:italic;letter-spacing:.4px;text-transform:uppercase}.large.player .fsu-PriceBar{transform:translateX(-50%) scale(1.2) !important;top:4px}.fsu-PriceRightBox{position:absolute;right:16px;z-index:2;transform:translateY(-50%) !important;top:50%;display:flex;gap:16px;font-family:UltimateTeamCondensed,sans-serif}.fsu-PriceRightItem{background-color:#3b4754;border-radius:8px;padding:8px 6px;color:#a4a9b4;display:flex;flex-direction:column;gap:8px;align-items:center}.fsu-PriceRightBox.top{top:16px}.fsu-PriceRightBox.top .fsu-PriceRightItem{flex-direction:row;padding:4px 6px 2px}.fsu-PriceRightBoxTitle{font-size:14px;text-align:center;line-height:14px}.fsu-PriceRightBoxBar{display:flex;justify-content:center;align-items:center}.fsu-PriceRightItem .fsu-PriceValue{font-size:22px;line-height:18px;color:#f7b702}.fsu-PriceRightItem .fsu-PriceType{text-transform:uppercase;font-size:14px;font-weight:500;padding:3px 4px 2.2px 1.6px;background-color:#2b3036;color:#a0a0a0;font-style:italic;margin-left:4px;border-radius:4px;margin-top:-3px}.fsu-PriceBarItem[data-show='0'],.fsu-PriceRightItem[data-show='0']{display:none !important}.fsu-PriceBarItem.tradable .fsu-PriceValue,.fsu-PriceRightItem.tradable .fsu-PriceValue{color:#fcfcfc}.fsu-PriceType[data-content='ut']{font-size:0}.fsu-PriceType[data-content='ut']::after{background-position:right top;content:'';background-repeat:no-repeat;background-size:100%;display:inline-block;height:12px;vertical-align:middle;width:12px;background-image:url(../web-app/images/coinIcon.png);margin-top:-2px;margin-right:-1px}.fsu-PriceBarItem.precious .fsu-PriceType{background-color:#fd7254}.fsu-PriceBarItem.precious{background:#ee2208;border-color:#fd7254}.fsu-PriceRightBoxBar .fsu-PriceType[data-content='ut']{height:16px;width:16px}.fsu-PriceRightBoxBar .fsu-PriceType[data-content='ut']::after{margin-top:0.5px;margin-right:0px;margin-left:2px;height:14px;width:14px}                                /*进化增加属性展示*/.fsu-academyAttribute{font-family:UltimateTeam-Icons,sans-serif;font-size:14px;line-height:16px;color:#80807a}.fsu-academyAttributeIncrease{padding-left:8px;padding-right:4px}.fsu-academyAttributeIncrease span{color:#07f468}.fsu-academyAttributeValue{font-weight:bold;font-size:16px}.fsu-academyAttributeValue.added{color:#0b96ff}.fsu-academyAttributeValue.addedMain{color:#fd4821}                                    /*进化属性显示*/.academieBtn{background:#2d2c36;border-radius:8px;padding:8px 12px 6px 12px;cursor:pointer;margin-bottom:8px;font-family:UltimateTeamCondensed,sans-serif;border:1px solid #2d2c36}.academieBtn.not{opacity:0.5}.academieBtn:hover{border-color:#1fc3c1}.academieBtnTitle{display:flex;align-items:center;justify-content:space-between;line-height:14px;margin-bottom:6px}.academieBtnName{color:#b5b9c3;font-size:14px}.academieBtnTime{font-size:12px;color:#9e9e9a}.academyBoostsBox{display:flex;gap:4px;font-size:12px;line-height:11px;text-transform:uppercase;flex-wrap:wrap;flex-direction:row}.academyBoostsItem{padding:4px 4px 1px 4px;border-radius:4px;font-weight:500;background:#3a4652;color:#d4d8de}.academyBoostsItem span{color:#07f468;font-size:16px;padding-left:2px;font-weight:100}.academyBoostsTips{flex:100%;padding-top:6px;color:#9e9e9a}.academyBtnTips{color:#fd7254;padding:8px 4px;font-size:14px;text-align:center}.academyViewBox{background:#191820;border-radius:8px;padding:8px 12px 6px 12px;margin-bottom:8px;font-family:UltimateTeamCondensed,sans-serif}.academyViewBox .academyBoostsBox{gap:8px;justify-content:center}.academyViewBox .academyBoostsTips{text-align:center}.academyViewBox.itemList{padding:24px 8px 8px;margin:-32px 16px 16px}.academyViewBox.itemList .academyBoostsBox{gap:4px}.academyViewBox.itemList .academyBoostsBox > *{zoom:0.8}                                                     /*CSS*/"


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
                // 1 futgg 2 代理futgg模式 3 futnext
                if([1, 2].includes(info.apiPlatform)){
                    let params = data.join("%2C")
                    let baseUrl = info.apiPlatform === 2 ? `${info.apiProxy}?futggapi=` : "https://www.fut.gg/api/fut/";
                    let platform = info.base.platform === "pc" ? `&platform=${info.base.platform}` : "";
                    const response = await events.externalRequest("GET", `${baseUrl}player-prices/26/?ids=${params}${platform}`);
                    const originalJson = JSON.parse(response);
                    _.map(originalJson.data, i => {
                        if (i.price !== null || i.isExtinct || i.isSbc || i.isObjective || i.premiumSeasonPassLevel !== null || i.standardSeasonPassLevel !== null) {
                            let p = i.price;
                            let price = 0;
                            let type = 0;
                            if (i.isSbc) {
                                type = 1;
                            } else if (i.isObjective) {
                                if (i.premiumSeasonPassLevel !== null || i.standardSeasonPassLevel !== null) {
                                    type = 3;
                                } else {
                                    type = 2;
                                }
                            }
                            if (p && p !== -1) {
                                price = p;
                            }
                            priceJson[i.eaId] = {
                                "n": price,
                                "y": type
                            }
                        } else {
                            console.log("没有这个球员数据:", i.eaId)
                        }
                    })
                }else if(info.apiPlatform === 3){
                    let params = data.join("_")
                    const response = await events.externalRequest("GET","https://enhancer-api.futnext.com/players/prices?ids=" + params + "&platform=" + info.base.platform);
                    const originalJson = JSON.parse(response);
                    _.map(originalJson,i => {
                        if(i.prices.length){
                            let p = i.prices[0]
                            priceJson[i.definitionId] = {
                                "n": p,
                                "y": 0
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
                        'User-Agent': navigator.userAgent,
                        "Content-Type": cType ? cType : "application/json"
                    },
                    onload: (res) => {
                        if (res.status !== 200 && res.status !== 201) {
                            reject(res.status);
                        }
                        resolve(res.responseText);
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
            unassigned:UTUnassignedItemsViewController.prototype.renderView,
            build:UTSquadBuilderViewController.prototype.viewDidAppear,
            market:UTMarketSearchView.prototype._generate,
            setting:UTAppSettingsView.prototype._generate,
            squadRating:UTSquadEntity.prototype._calculateRating,
            transfer:UTTransferListViewController.prototype._renderView,
            clubHub:UTClubHubView.prototype.clearTileContent,
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
            //25.24 卡重复自动刷新
            const duplicateIds = _.filter(
                _.map(this.viewmodel.values(), "duplicateId"),
                id => id !== 0
            );
            if(duplicateIds.length && duplicateIds.length !== events.getItemBy(2,{"id":duplicateIds}).length && section && !this.getView().getSection(UTUnassignedItemsViewModel.SECTION.ITEMS) && !this.getView().getSection(UTUnassignedItemsViewModel.SECTION.DUPLICATES) && _.has(section,"_fsuGoToStorage")){
                const controller = this;
                section._fsuRefreshBtn = events.createButton(
                    new UTStandardButtonControl(),
                    fy("unassignedlist.refresh.btn"),
                    async (e) => {
                        await services.Item.itemDao.itemRepo.unassigned.reset();
                        await controller.getUnassignedItems();
                        events.notice("notice.uasreset", 0);
                    },
                    "call-to-action mini"
                )
                section._fsuRefreshBtn.getRootElement().style.marginLeft = ".5rem";
                section._fsuGoToStorage.getRootElement().after(section._fsuRefreshBtn.getRootElement())
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
                    return i.loans == -1 && i.type == "player" && !i.untradeableCount
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
                            let clubPlayers = events.getItemBy(1,{"definitionId": i.definitionId, "upgrades": null},false,repositories.Item.club.items.values());
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
                    let swapPlayerIds = events.getItemBy(1,{"definitionId":playerIds,"untradeableCount":0});
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
                        sPrice.push(events.getCachePrice(i.definitionId,1).num);
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

                                const duplicatePlayerIds = events.getItemBy(1, { id: _.map(e, "duplicateId"), untradeableCount: 0 });
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
                                let fastBtnBox = events.createElementWithConfig("div", {
                                    classList: "fsu-unassigned-fastsbcinfo"
                                })
                                let fastBtnTitle = events.createElementWithConfig("div", {
                                    textContent: btnTitle,
                                    classList: "fsu-unassigned-fastsbctext"
                                })
                                fastBtnBox.appendChild(fastBtnTitle)
                                let fastBtnText = events.createElementWithConfig("div", {
                                    classList: "fsu-unassigned-fastsbctsub"
                                })
                                fastBtnText.innerHTML = events.getFastSbcSubText(info.base.fastsbc[i.n]);
                                fastBtnBox.appendChild(fastBtnText)
                                let fastBtnTips = events.createElementWithConfig("div", {
                                    textContent:i.c,
                                    classList:["ut-tab-bar-item-notif", "fsu-unassigned-fastsbcdot"],
                                })
                                fastBtn.getRootElement().appendChild(fastBtnTips)
                                fastBtn.getRootElement().appendChild(fastBtnBox)
                                //fastBtn.__currencyLabel.innerHTML = events.getFastSbcSubText(info.base.fastsbc[`${i.cId}#${i.sId}`])

                                fastBtn._sId = i.sId;
                                fastBtn._cId = i.cId;
                                fastBtn._swap = swapPlayers;
                                controller._fsuFastList.push(fastBtn)

                                //25.22 注册快捷键
                                // const keyCount = _.size(info.keyEvent) + 1;
                                // info.keyEvent[keyCount] = fastBtn;
                            }
                        })
                        if(_.size(controller._fsuFastList)){
                            let fastBox = events.createElementWithConfig("div", {
                                classList: "fsu-unassigned-fastsbcbox"
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
                if(locale.language == "zh"){
                    info.language = locale.variant == "Hans" ? 0 : 1;
                }
                events.notice("notice.succeeded",0);
                let psBtn = events.createElementWithConfig("div",{
                    textContent:fy("notice.succeeded"),
                    style:{
                        color:"#36b84b"
                    }
                })

                //读取是否有futgg接口
                const apiProxy = GM_getValue("apiproxy");

                if (_.isString(apiProxy) && !_.isEmpty(apiProxy)) {
                    info.apiProxy = apiProxy;
                }

                //26.04 自动切换价格获取接口的脚本
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://www.fut.gg/api/fut/player-prices/26/?ids=${_.random(20000, 39999)}`,
                    anonymous: false, // 关键：利用当前页面的已存 Cookie
                    headers: {
                        'Accept': 'application/json',
                        'Referer': window.location.origin, // 动态获取当前页面的 origin
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function (res) {
                        if (res.status === 200) {
                            info.apiPlatform = 1; // 使用 futgg API
                        } else {
                            info.apiPlatform = info.apiProxy === "" ? 3 : 2;
                        }
                        console.log("apiPlatform:", info.apiPlatform);
                    },
                    onerror: function (err) {
                        info.apiPlatform = info.apiProxy === "" ? 3 : 2;
                        console.log("apiPlatform:", info.apiPlatform);
                    }
                });


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
            // let pId = this.tacticsViewModel.getSquad().getSlot(this.tacticsViewModel.getSelectedSlotId()).item.definitionId;
            // if(pId && _.has(info.meta,pId)){
            //     let metas = info.meta[pId].text;
            //     if(_.size(metas) > 1){
            //         _.map(this.getView().roleCellViews,i => {
            //             if(_.has(metas,i.id)){
            //                 let z = events.createElementWithConfig("span",{
            //                     textContent:`(${metas[i.id].rank} ${metas[i.id].rating} ${services.Localization.localize("playstyles.playstyle" + metas[i.id].chemstyle)})`,
            //                     style:{
            //                         fontSize:"80%",
            //                         opacity:".8",
            //                         padding:"0 .5rem"
            //                     }
            //                 })
            //                 i.__name.appendChild(z)
            //             }
            //         })
            //     }
            // }
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
        const UTGameFlowNavigationController_viewDidAppear = UTGameFlowNavigationController.prototype.viewDidAppear;
        UTGameFlowNavigationController.prototype.viewDidAppear = function(...args) {
            //26.02 进化：侧边栏进入后插入导航条
            UTGameFlowNavigationController_viewDidAppear.call(this,...args);
            if(this.currentController instanceof UTAcademyHubViewController && this.getView()._navbar == null){
                this.getView().appendNavigationBar(this.navigationBar);
                this.setNavigationVisibility(1,1)
            }
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
                    p:events.getCachePrice(i.definitionId,1).num,
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
                    if(this.__root === null){
                        //空白元素停止加载信息
                        return;
                    }

                    this._fsu ??= {};

                    const parentNode = this.__root.parentNode;
                    const pid = Number(this.__root.querySelector("span[p-id]")?.getAttribute("p-id"));
                    const idx = Number(parentNode?.getAttribute("index")) || 0;

                    if (pid === p.id) {
                        if (this._fsu.squadIndex === idx) return;
                        this._fsu.squadIndex = idx;
                    }

                    const unassignedIds = _.map(repositories.Item.unassigned.values(),"duplicateId");
                    const isSmall = this.__root.classList.contains("small");

                    //卡片样式 0新版 1旧版
                    let stc = info.set.card_style == 1 ? "old" : "new" ;
                    let ct = t.getExpColorMap(p.getTier());
                    const cardColor = info.set.card_style == 1 ? `rgb(255,255,255)` : `rgb(${ct.name.r},${ct.name.g},${ct.name.b})`;
                    const cardBackground = info.set.card_style == 1 ? `rgb(0,64,166)` : `rgb(${ct.background.r},${ct.background.g},${ct.background.b})`; 

                    //位置区块添加

                    let otherPos = p.possiblePositions.filter((z) => {return z !== p.preferredPosition}).map((z) => {return UTLocalizationUtil.positionIdToName(z, services.Localization)})

                    let controller = cntlr.current();

                    let posElement = events.createElementWithConfig("div",{
                        classList:["fsu-cards","fsu-cards-pos",stc],
                        var:{
                            '--fsu-cards-background': cardBackground,
                            '--fsu-cards-color': cardColor,
                        },
                        attributes:{
                            "data-id":p.id
                        }
                    })
                    posElement.innerHTML = events.normalizePositions(otherPos).map((z) => {return `<div>${z}</div>`}).join(``);
                    this._fsu.pos = posElement;

                    //额外属性区块
                    let extraElement = events.createElementWithConfig("div",{
                        classList:["fsu-cards","fsu-cards-attr",stc],
                        var:{
                            '--fsu-cards-foot-color': cardColor,
                            '--fsu-cards-background': cardBackground,
                            '--fsu-cards-color': cardColor,
                        }
                    })
                    let footElement = events.createElementWithConfig("div",{
                        classList:["fsu-cards-foot",p.isLeftFoot() ? "l" : "r"],
                        innerHTML:`<span>${p.getSkillMoves()}/${p.getWeakFoot()}</span>`
                    })
                    extraElement.appendChild(footElement);

                    // 25.22 非门将位置加速类型显示
                    if(!p.isGK() && !isSmall){
                        const isLoadMeta = services.PlayerMetaData.metaDAO.metaRepo.has(p.definitionId);
                        let accele = events.createButton(
                            new UTButtonControl(),
                            events.getAcceleRate(p) + `${isLoadMeta ? "" : "*"}`,
                            async(e) => {
                                events.accelePopup(p)
                            },
                            "fsu-cards-accele"
                        )
                        accele.getRootElement().setAttribute("data-defid",p.definitionId);
                        accele.getRootElement().style.cursor = `pointer`;
                        this._fsu.accele = accele;
                        extraElement.appendChild(accele.getRootElement());
                    }

                    let bodyTypeId = events.getPlayerBodyType(p.definitionId ,p.databaseId ,p.rating);
                    if(bodyTypeId){
                        let bodytype = events.createButton(
                            new UTButtonControl(),
                            "",
                            async(e) => {
                                events.popup(
                                    fy("plyers.bodytype.popupt"),
                                    fy(["plyers.bodytype.popupm",info.bodytypetext[bodyTypeId],fy(`players.bodytype_${bodyTypeId}`)]),
                                    (t) => {
                                    }
                                )
                            },
                            "fsu-bodytype"
                        )
                        bodytype.getRootElement().style.cursor = `pointer`;
                        bodytype.getRootElement().innerHTML = _.replace(info.bodytypetext[bodyTypeId], '&', `<span style='font-size:80%'>&</span>`);
                        this._fsu.bodytype = bodytype;
                        extraElement.appendChild(bodytype.getRootElement());
                    }
                    this._fsu.extra = extraElement;

                    if(!isSmall){
                        let realFace = _.includes(info.meta.realFace, p.definitionId) ? 0 : 1;
                        this._fsu.realFace = events.createButton(
                            new UTButtonControl(),
                            realFace == 0 ? "YES" : "NO",
                            async(e) => {
                                events.notice(fy(["notice.players.realface", p._staticData.name, fy(`players.realface_${realFace}`)]), realFace == 0 ? 0 : 2);
                            },
                            ""
                        )
                        extraElement.appendChild(this._fsu.realFace.getRootElement());
                    }

                    //24.18 可进化标识：计算展现标识数据
                    //26.04 修改为新方法
                    if(p.loans === -1){
                        const academyIds = info.academy
                            .filter(a => a.practical && a.el.every(t => t.meetsRequirements(p)))
                            .map(a => a.id);
                        if(academyIds.length){
                            this._fsu.academyTips = events.createElementWithConfig("div", {
                                innerHTML: `<span class="fsu-academytips-icon"></span><span>${academyIds.length}</span>`,
                                classList:["fsu-academytips"],
                            })
                            this._fsu.academyIds = academyIds;
                            extraElement.appendChild(this._fsu.academyTips);
                        }
                    }


                    //价格区块
                    //25.22 简化重写价格区块显示逻辑
                    const ppValue = events.getCachePrice(p.definitionId,1);
                    const ppInCache = events.getCachePrice(p.definitionId,3);
                    const tradableClass = p.untradeableCount ? "untradeable" : "tradable";
                    const priceElementType = ppInCache ? info.priceType[ppValue.type] : "ut";

                    let priceElement = events.createElementWithConfig("div", {
                        classList:["fsu-PriceBar", "fsu-cards"],
                    });

                    let priceItemElement = events.createElementWithConfig("div", {
                        classList:["fsu-PriceBarItem", "priceItem",  tradableClass ],
                        attributes: {
                            'data-show': ppInCache ? 1 : 0,
                        },
                    });
                    priceElement.appendChild(priceItemElement)
                    priceItemElement.appendChild(
                        events.createElementWithConfig("div", {
                            classList:["fsu-PriceValue"],
                            textContent: ppValue.text
                        })
                    )
                    priceItemElement.appendChild(
                        events.createElementWithConfig("div", {
                            classList:["fsu-PriceType"],
                            textContent: priceElementType,
                            attributes: {
                                'data-content': priceElementType,
                            },
                        })
                    )
                    
                    this._fsu.price = priceElement;
                    this._fsu.priceItem = priceItemElement;

                    this._fsu.ratingBackground = events.createElementWithConfig("div",{
                        textContent: p.rating,
                        classList: ["fsu-cards-rating", "fsu-cards"],
                        style: {
                            color: info.set.card_style == 1 ? `rgb(0,64,166)` : `rgb(${ct.dividers.r},${ct.dividers.g},${ct.dividers.b})`
                        }
                    })


                    let priceBoxElement = events.createElementWithConfig("div",{
                        classList:["fsu-PriceRightBox", "fsu-cards"],
                    });
                    let priceBoxItemElement = events.createElementWithConfig("div",{
                        classList:["fsu-PriceRightItem", "priceItem", tradableClass ],
                        attributes: {
                            'data-show': ppInCache ? 1 : 0,
                        },
                    });
                    priceBoxElement.appendChild(priceBoxItemElement)
                    priceBoxItemElement.appendChild(
                        events.createElementWithConfig("div", {
                            classList:["fsu-PriceRightBoxTitle"],
                            textContent: fy("price.now")
                        })
                    )
                    let priceBoxPriceBar =events.createElementWithConfig("div", {
                        classList:["fsu-PriceRightBoxBar"],
                    })
                    priceBoxItemElement.appendChild(priceBoxPriceBar)
                    priceBoxPriceBar.appendChild(
                        events.createElementWithConfig("div", {
                            classList:["fsu-PriceValue"],
                            textContent: ppValue.text
                        })
                    )
                    priceBoxPriceBar.appendChild(
                        events.createElementWithConfig("div", {
                            classList:["fsu-PriceType"],
                            textContent: priceElementType,
                            attributes: {
                                'data-content': priceElementType,
                            },
                        })
                    )
                    
                    if(p.lastSalePrice){
                        let priceBoxLastItemElement = priceBoxItemElement.cloneNode(true);
                        priceBoxLastItemElement.setAttribute("data-show", 1);
                        priceBoxLastItemElement.classList.remove("untradeable");
                        priceBoxLastItemElement.querySelector(".fsu-PriceRightBoxTitle").textContent = fy("price.last");
                        priceBoxLastItemElement.querySelector(".fsu-PriceValue").textContent = p.lastSalePrice.toLocaleString();
                        let typeElement = priceBoxLastItemElement.querySelector(".fsu-PriceType");
                        typeElement.textContent = "ut";
                        typeElement.setAttribute("data-content", "ut");
                        priceBoxElement.prepend(priceBoxLastItemElement);
                        this._fsu.priceBoxLastItem = priceBoxLastItemElement;
                    }

                    this._fsu.priceBoxBar = priceBoxPriceBar;
                    this._fsu.priceBoxItem = priceBoxItemElement;
                    this._fsu.priceBox = priceBoxElement;

                    

                    


                    //26.04 插入info.roster.element 来替换价格
                    if(!ppInCache){
                        info.roster.element[p.definitionId] ??= [];
                        priceItemElement.setAttribute("data-rating", p.rating)
                        priceItemElement.setAttribute("data-rareflag", p.rareflag)
                        info.roster.element[p.definitionId].push(priceItemElement);
                        info.roster.element[p.definitionId].push(priceBoxItemElement);

                    }


                    let plow = info.base.price.hasOwnProperty(p.rating) && p.rating > info.base.price.low && p.rating < info.base.price.high ? `<div class="fsu-other-low currency-coins">${p.rating} Min: ${Number(info.base.price[p.rating]).toLocaleString()}</div>` : `<span class="fsu-other-low"></span>`;

                    let pOtherPos = otherPos.length ? `<div class="fsu-other-pos">${otherPos.join(" / ")}</div>` : `<span class="fsu-other-pos"></span>`;

                    let pd = "";

                    let pe = -1,sp = events.getItemBy(2,{"definitionId":p.definitionId});
                    if(sp.length == 1){
                        pe = sp[0].untradeableCount ? 0 : 1;
                    }
                    if(p.duplicateId){
                        if(services.Item.itemDao.itemRepo.club.items._collection.hasOwnProperty(p.duplicateId)){
                            pe = services.Item.itemDao.itemRepo.club.items._collection[p.duplicateId].untradeableCount ? 0 : 1;
                        }
                    }else{
                        if(info.roster.thousand.hasOwnProperty(p.definitionId)){
                            pe = info.roster.thousand[p.definitionId].untradeableCount ? 0 : 1;
                        }
                    }
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

                    let otherElement = events.createElementWithConfig("div", {
                        innerHTML: `${pd}${pOtherPos}${plow}`,
                        classList: ["fsu-player-other", "fsu-cards"]
                    })
                    this._fsu.other = otherElement;

                    

                    if(info.set.card_meta && [1, 2].includes(info.apiPlatform) && false){
                        let playerGGR = events.getPlayerGGR(p);
                        playerGGR["textColor"] = "#0f1010";
                        if(info.set.card_style == 1){
                            playerGGR.gradeColor = `rgb(0,64,166)`;
                            playerGGR.textColor = "#fcfcf7";
                        }
                        let metaElement = events.createButton(
                            new UTButtonControl(),
                            "",
                            async(e) => {
                                GM_openInTab(`https://www.fut.gg/players/${p.databaseId}/${info.base.year}-${p.definitionId}/`, { active: true, insert: true, setParent :true });
                            },
                            "item fsu-cards fsu-cards-meta"
                        )
                        this._fsu.meta = metaElement;
                        metaElement.getRootElement().setAttribute("data-id",p.id);
                        metaElement.getRootElement().setAttribute("data-defid",p.definitionId);
                        metaElement.getRootElement().style.borderColor = playerGGR.gradeColor;
                        let mRk = events.createElementWithConfig("div", {
                            textContent:playerGGR.grade,
                            style:{
                                color:playerGGR.textColor,
                                backgroundColor:playerGGR.gradeColor,
                                lineHeight:`1.1rem`,
                            },
                            classList:["mrk"],
                        })
                        metaElement.getRootElement().appendChild(mRk)
                        let mPr = events.createElementWithConfig("div", {
                            textContent:playerGGR.scoreText,
                            classList:["mpr"],
                        })
                        metaElement.getRootElement().appendChild(mPr)
                        let mRp = events.createElementWithConfig("div", {
                            textContent:playerGGR.posText,
                            classList:["mrp"],
                        })
                        metaElement.getRootElement().appendChild(mRp)
                        if(isSmall){
                            let metaRating = events.createElementWithConfig("div", {
                                textContent:playerGGR.grade,
                                classList:["fsu-cards-metarating"],
                                attributes:{
                                    "data-id":p.id,
                                    "data-defid":p.definitionId,
                                }
                            })
                            this._fsu.metaRating = metaRating;
                            extraElement.prepend(metaRating);
                            if(playerGGR.score === 0){
                                metaRating.style.display = "none";
                                metaElement.getRootElement().style.display = "none";
                            }
                        }
                    }

                    //26.04 添加特殊品质的显示按钮
                    if(info.specialPlayers?.DList?.includes(p.rareflag) || info.specialPlayers?.ECList?.includes(p.rareflag)){
                        this._fsu.special = events.createButton(
                            new UTButtonControl(),
                            "",
                            async(e) => {
                                events.noticeSpecialPlayerInfo(p);
                            },
                            "fsu-specialPlayer"
                        )
                        this._fsu.special.getRootElement().innerHTML = `<i class="fut_icon icon_chevron"></i>`;
                        if(isSmall){
                            this._fsu.special.setInteractionState(0)
                        }else{
                            this._fsu.special.getRootElement().style.cursor = `pointer`;
                        }
                        extraElement.prepend(this._fsu.special.getRootElement());
                    }

                    let pId = p.id ? p.id : p.definitionId;
                    let playerLock = info.lock.includes(p.id);
                    if(!this.__root) return;
                    if(!this.__root.querySelector("span[p-id]")){
                        if(parentNode?.classList.contains("ut-squad-slot-view")){
                            this._fsu.squadIndex = Number(parentNode?.getAttribute("index")) || 0;
                        }
                        this._fsu.pId = events.createElementWithConfig("span",{
                            sytle: {
                                display: "none"
                            },
                            attributes:{
                                "p-id": pId
                            }
                        })
                        this.__root.append(this._fsu.pId);
                    }else{
                        this.__root.querySelector("span[p-id]").setAttribute('p-id',pId);
                    }
                    if(parentNode && !parentNode.classList.contains("CompareDetails")){
                        parentNode.querySelectorAll(".fsu-cards:not(.reserve)").forEach(e => e.remove());
                    }
                    
                    if(isSmall){
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

                        //修复进化预览价格覆盖的问题
                        //有问题需要判定，是进化页面再修改
                        if(isPhone() && cs === 3){
                            cs = 8;
                        }
                        //console.log(cs)
                        if(cs !== 0){
                            priceElement.setAttribute('data-cs',cs);
                            priceBoxElement.setAttribute('data-cs',cs);
                            
                            let parentElement = this.getRootElement().parentNode;

                            if(bodyTypeId){
                                this._fsu.bodytype.setInteractionState(0)
                            }

                            //位置区块添加
                            //额外属性区块
                            if(![31].includes(cs)){
                                this.__root.after(extraElement);
                                //26.05 移除部分界面name部分的内边距
                                if([8].includes(cs)){
                                    extraElement.classList.add("fsu-removeNamePadding")
                                }
                            }
                            if(cs == 25){
                                Object.assign(posElement.style, {
                                    top: "36%",
                                    left: "calc(50% - 52px)",
                                    fontSize: "8px",
                                });
                                Object.assign(extraElement.style, {
                                    top: "36%",
                                    left: "calc(50% + 30px)",
                                    fontSize: "8px",
                                });
                            }
                            if([21,22,23,24,25].includes(cs)){
                                this.__root.after(posElement);
                                if([21,23].includes(cs) && info.lock.includes(pId)){
                                    let cardLock = document.createElement("div");
                                    cardLock.classList.add("fsu-cards","fsu-cardlock");
                                    this.__root.after(cardLock);
                                }
                            }
                            if([5,21,22,23,24,25,31].includes(cs)){
                                if(cs == 21){
                                    const posElement = this.__root.parentElement.querySelector(".ut-squad-slot-pedestal-view");
                                    if(posElement){
                                        // 25.22 添加阵容直接移除球员按钮
                                       this._fsu.removeBtn = events.createButton(
                                            new UTImageButtonControl(),
                                            "",
                                            (e) => {
                                                events.showLoader();
                                                let newSquad = _.cloneDeep(_.last(cntlr.current()._squad._fsu.oldSquad));
                                                newSquad = _.map(newSquad, (item) => {
                                                    return item.id === p.id ? new UTItemEntity() : item;
                                                });
                                                events.saveSquad(cntlr.current()._set.challenges.get(cntlr.current()._challengeId),cntlr.current()._squad,newSquad);
                                                events.saveOldSquad(cntlr.current()._squad,false);
                                            },
                                            "fsu-cards exit-btn"
                                        )
                                        Object.assign(this._fsu.removeBtn.getRootElement().style, {
                                            margin: "-6px",
                                            fontSize: "12px",
                                        })
                                        posElement.appendChild(this._fsu.removeBtn.getRootElement())
                                    }
                                    if(!p.untradeableCount){
                                        let uP = _.find(repositories.Item.getUnassignedItems(), (item) => item.definitionId === p.definitionId);
                                        if(uP && uP.untradeableCount){
                                            priceElement.classList.add("fsu-unassigned")
                                        }
                                    }

                                    //珍贵球员判断
                                    if(ppInCache && events.isPrecious(p.rating, p.rareflag, ppValue.num, ppValue.type)){
                                        priceItemElement.classList.add("precious");
                                    }
                                    //添加给元素判断珍贵球员
                                    priceItemElement.setAttribute("data-cs", cs)
                                }
                                this.__root.prepend(priceElement);
                            }else{
                                if([1,2,12,11].includes(cs)){
                                    priceBoxElement.classList.add("top");
                                    if(isPhone()){
                                        this.getRootElement().parentNode.querySelector(".name").style.width = "25%";
                                    }
                                }
                                if([2, 11, 12].includes(cs)){
                                    parentNode.append(priceBoxElement);
                                }else if([6,8,7,4,13].includes(cs)){
                                    this.__root.prepend(priceElement);
                                }else{
                                    this.__root.after(priceBoxElement);
                                }

                                if(cs == 12 || cs == 6) otherElement.querySelector(".fsu-other-low").remove();
                                if(cs == 1 || cs == 8  || cs == 9 || cs == 13) otherElement.querySelector(".fsu-other-dup").remove();
                                if(![7,4].includes(cs)){
                                    parentNode.append(otherElement);
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

                                //25.22 添加未分配列表图标
                                if(!p.concept && _.includes(unassignedIds,p.id)){
                                    if(parentElement.querySelector(".fsu-cards-unassigned") == null){
                                        parentElement.insertBefore(events.getCardTipsHtml(3), this.getRootElement());
                                    }
                                }
                            }

                            //25.21 开包后处理位置显示
                            //26.04 调整显示的逻辑
                            if (cs === 3 && _.has(p, "storeLoc")) {
                                const dup = otherElement.querySelector(".fsu-other-dup");
                                if (dup) {
                                    dup.className = "fsu-other-dup";
                                    if(p.pile == ItemPile.TRANSFER){
                                        dup.classList.add("yes");
                                        dup.innerText = info.base.localization[`navbar.label.tradepile`];
                                    }else if(p.pile == ItemPile.STORAGE){
                                        dup.classList.add("storage");
                                        dup.innerText = fy(`storage.tile`);
                                    }else{
                                        dup.classList.add("swap");
                                        dup.innerText = info.base.localization[`nav.label.club`];
                                    }
                                }
                            }

                            //25.24 在奖励卡添加GGR
                            if(cs == 25 && _.has(this,"_fsuCardMeta")){
                                this._fsu.meta.getRootElement().style.height = ".8rem";
                                this._fsu.meta.getRootElement().style.fontSize = ".6rem";
                                this.__root.after(this._fsu.meta.getRootElement());
                                priceElement.style.fontSize = ".8rem";
                                priceElement.style.marginTop = ".2rem";
                            }
                        }

                    }else{
                        let cardParen = this.__root.parentElement;
                        if(!cardParen){
                            return;
                        }
                        let isCompare = false;
                        if(document.querySelector(`.CompareDetails .large.player span[p-id="${pId}"]`) && info.set.card_meta && [1, 2].includes(info.apiPlatform) && false){
                            isCompare = true;
                            extraElement.classList.add("reserve")
                            this._fsu.meta.getRootElement().classList.add("reserve");
                        }
                        //24.18 修复锁定按钮显示不了的问题
                        if(p.loans == -1 && !p.concept && p.state == ItemState.FREE && !p.isDuplicate() && events.getItemBy(1,{"id":p.id}).length && !isCompare){
                            let lockElement = events.createButton(
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
                                            cntlr.left().refreshList();
                                        }
                                    }
                                },
                                `fsu-cards fsu-lockbtn ${playerLock ? "unlock" : "lock"} ${isPhone() ? "" : "mini"}`
                            )
                            this._fsu.lock = lockElement;
                            lockElement.id = p.id;
                            cardParen.insertBefore(lockElement.getRootElement(),cardParen.firstChild)
                        }
                        if(cardParen.querySelectorAll(".player").length > 1){
                            if(!isCompare){
                                this.__root.prepend(posElement);
                            }
                            this.__root.prepend(extraElement);
                        }else{
                            this.__root.after(posElement);
                            this.__root.after(extraElement);
                            if(parentNode.style.position == ""){
                                parentNode.style.position = "relative"
                            }
                        }
                        this.__root.prepend(priceElement);


                        if(this._fsu?.meta){
                            this.__root.after(this._fsu.meta.getRootElement());
                        }
                        if(cardParen.classList.contains('player-pick-option')){
                            cardParen.style.position = "relative";
                            cardParen.style.padding = "0 1.2rem";
                            otherElement.querySelector(".fsu-other-low").remove();
                            otherElement.querySelector(".fsu-other-pos").remove();
                            if(!isPhone()){
                                this._fsu.meta.getRootElement().style.bottom = "1.4rem";
                            }else{
                                this._fsu.meta.getRootElement().style.bottom = "4rem";
                            }
                            this.__root.after(otherElement)
                        }

                        //25.02 奖励大卡片状态下meta上移
                        if(cardParen.classList.contains('reward')){
                            this._fsu.meta.getRootElement().style.bottom = "2.2rem";
                        }



                        //大卡预览处增加购买失败描述
                        if("_squad" in controller && "_fsuBuyEroor" in controller._squad && controller._squad._fsuBuyEroor.includes(pId) && p.concept && cardParen.classList.contains("tns-item")){
                            if(cardParen.querySelector(".fsu-cards-buyerror") == null){
                                this.getRootElement().appendChild(events.getCardTipsHtml(1))
                            }
                        }

                        //25.02 大卡预览增加SBC仓库标识
                        if(!p.concept && repositories.Item.storage.get(p.id)){
                            if(cardParen.querySelector(".fsu-cards-storage") == null){
                                this.getRootElement().appendChild(events.getCardTipsHtml(2))
                            }
                        }

                        //25.22 大卡预览添加未分配列表图标
                        //26.02 修复图标不显示的问题
                        if(!p.concept && _.includes(unassignedIds,p.id)){
                            if(cardParen.querySelector(".fsu-cards-unassigned") == null){
                                this.getRootElement().appendChild(events.getCardTipsHtml(3))
                            }
                        }

                        //战术编辑处调整大卡片的属性显示错误。
                        if((cardParen.classList.contains("ut-tactics-instruction-menu-view--item-container") || cardParen.classList.contains("main-reward")) && cardParen.classList.length === 1){
                            cardParen.style.position = "relative";
                        }

                        //25.24 SBC或奖励页面添加已拥有标识
                        if(cardParen.classList.contains("main-reward") && cardParen.classList.length === 1){
                            
                        }

                        //25.01 战术编辑处角色调整
                        if(cardParen.classList.contains("ut-tactics-role-menu-view--item-container")){

                            extraElement.style.left = "auto";
                            extraElement.style.right = ".2rem";

                            posElement.style.left = "auto";
                            posElement.style.right = "124px";

                            lockElement.getRootElement().style.display = "none";

                            this._fsu.meta.getRootElement().style.left = "auto";
                            this._fsu.meta.getRootElement().style.right = "1rem";
                            this._fsu.meta.getRootElement().style.setProperty('transform', 'translateX(0)', 'important');
                            this._fsu.meta.getRootElement().style.setProperty('-webkit-transform', 'translateX(0)', 'important');

                        }
                        
                        //26.02 调整进化页面预览效果隐藏评分
                        //26.04 调整进化左右两侧位置显示
                        if(cardParen.querySelector(".ut-academy-slot-item-details-view--carousel-label")){
                            this._fsu.meta.hide();
                            this._fsu.extra.style.top = "15%";
                            this._fsu.pos.style.top = "15%";
                        }
                    }

                    
                    this.__root.appendChild(this._fsu.ratingBackground);
                    if(!info.set.card_pos){
                        posElement.remove();
                    }
                    if(!info.set.card_price){
                        priceBoxElement.remove();
                        priceElement.remove();
                    }
                    if(!info.set.card_other){
                        extraElement.remove();
                    }
                    if(!info.set.card_low){
                        otherElement.querySelector(".fsu-other-low")?.remove();
                    }
                    if(!info.set.card_club){
                        otherElement.querySelector(".fsu-other-dup")?.remove();
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


        //26.04 改用新的快捷球员载入方法
        UTSquadOverviewViewController.prototype.viewDidAppear = function() {
            call.plist.squad.call(this);

            this._fsu ??= {};

            if(info.set.info_squad && !_.has(this._fsu, "squadValueBox")){

                const squadPrice = _.sumBy(this._squad.getFieldPlayers(), i => events.getCachePrice(i.item.definitionId, 1).num);

                let squadValueBox = events.createElementWithConfig("div", {
                    classList: ["fsu-SquadValue"]
                })
                this._fsu.squadValueBox = squadValueBox;
                
                let squadValue = events.createElementWithConfig("div", {
                    classList: ["fsu-SquadValueItem"]
                })
                squadValue.appendChild(
                    events.createElementWithConfig("div", {
                        textContent: fy("sbc.topsquad"),
                        classList: ["fsu-SquadValueTitle"]
                    })
                )
                squadValue.appendChild(
                    events.createElementWithConfig("div", {
                        textContent: squadPrice.toLocaleString(),
                        classList: ["fsu-SquadValuePrice", "currency-coins"],
                        attributes: {
                            "id": "squadValue",
                        }
                    })
                )
                squadValueBox.appendChild(squadValue)
                this._fsu.squadValue = squadValue;


                if(this._squad.isSBC()){

                    const sbcStat = info.task.sbc.stat?.[this._set.id];

                    let price = (this._set.challengesCount === 1)
                        ? sbcStat?.[info.base.platform]
                        : sbcStat?.child?.[this._challenge.id]?.price;

                    price = price || 0;
                    
                    let SBCValue = events.createElementWithConfig("div", {
                        classList: ["fsu-SquadValueItem"]
                    })
                    SBCValue.appendChild(
                        events.createElementWithConfig("div", {
                            textContent: fy("sbc.topprice"),
                            classList: ["fsu-SquadValueTitle"]
                        })
                    )
                    SBCValue.appendChild(
                        events.createElementWithConfig("div", {
                            textContent: price.toLocaleString(),
                            classList: ["fsu-SquadValuePrice", "currency-coins"]
                        })
                    )
                    squadValueBox.appendChild(SBCValue)
                    this._fsu.SBCValue = SBCValue;
                }

                this.getView().getPitch().getRootElement().prepend(squadValueBox)
            }
            
            events.loadPlayerInfo(_.map(this._squad._players,"_item"));



            if(this._squad.isSBC()  && !_.has(this._fsu, "quickTop")){

                if(isPhone()){
                    this.getView()._detailsButton.__root.style.zIndex = 999;
                }
                let eligibility = this._challenge.eligibilityRequirements;
                let baseRating = 0;
                let listType = 1; //1为普通 2为最低评分模式 3正好评分模式
                let isQuality = false;
                let qualityType = 0;
                let maxRating = 99;

                

                const thisController = this;

                if(info.set.sbc_top){
                    this._fsu.baseRating = baseRating;
                    let quickTop = events.createElementWithConfig("div",{
                        classList:["fsu-quick","top"]
                    })
                    this._fsu.quickTop = quickTop;

                    let quickOther = events.createElementWithConfig("div",{
                        classList:["fsu-quick-list","other"]
                    })
                    this._fsu.quickOther = quickOther;
                }

                for (let i of eligibility) {
                    if(this._fsu?.quickOther){
                        
                        //评分计算按钮
                        if(i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.TEAM_RATING)){
                            baseRating = i.kvPairs._collection[SBCEligibilityKey.TEAM_RATING][0];
                            this._fsu.countRating = events.createButton(
                                new UTButtonControl(),
                                fy("sbc.count"),
                                () => {
                                    events.squadCount(baseRating);
                                },
                                "im"
                            )
                            this._fsu?.quickOther.append(this._fsu.countRating.getRootElement());
                        }

                        //抄作业按钮
                        if(i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.CHEMISTRY_POINTS) || i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.ALL_PLAYERS_CHEMISTRY_POINTS)){
                            this._fsu.consult = events.createButton(
                                new UTButtonControl(),
                                fy("sbc.consult"),
                                () => {
                                    GM_openInTab(`https://www.futbin.com/squad-building-challenges/ALL/${this._challenge.id}/list`, { active: true, insert: true, setParent :true });
                                },
                                "im"
                            )
                            this._fsu?.quickOther.append(this._fsu.consult.getRootElement());
                        }
                    }
                    

                    //24.16 交换SBC优化：新加入快捷计算评分类型
                    if(i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.PLAYER_MIN_OVR) && eligibility.length == 1){
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
                    if(i.kvPairs._collection.hasOwnProperty(SBCEligibilityKey.PLAYER_EXACT_OVR) && eligibility.length == 1){
                        baseRating = i.kvPairs._collection[SBCEligibilityKey.PLAYER_EXACT_OVR][0];
                        listType = 3;
                    }
                }

                //25.10 判断是否可以快速完成并插入按钮
                if(_.size(info.base.fastsbc) > 0 && this._fsu?.quickOther){
                    let sId = this._set.id,
                        cId = this._challenge.id,
                        q = info.base.fastsbc[`${cId}#${sId}`];
                    if(q){

                        let qs = events.fastSBCQuantity(true,_.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.duplicateId !== 0),q);
                        if(qs){

                            this._fsu.quicklyBtn = events.createButton(
                                new UTButtonControl(),
                                fy(["fastsbc.sbcbtntext",qs]),
                                () => {
                                    if (info.base.fastsbctips) {
                                        events.isSBCCache(sId, cId)
                                    } else {
                                        events.popup(
                                            fy("fastsbc.popupt"),
                                            fy("fastsbc.popupm"),
                                            (t) => {
                                                if (t === 2) {
                                                    info.base.fastsbctips = true;
                                                    events.isSBCCache(sId, cId)
                                                }
                                            }
                                        )
                                    }
                                },
                                "im"
                            );
                            this._fsu.quicklyBtn.getRootElement().style.fontSize = "90%";
                            this._fsu?.quickOther.append(this._fsu.quicklyBtn.getRootElement());
                        }
                    }
                }


                let ratingStart = baseRating !== 0 ? baseRating : 75;


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
                if(ratingStart !== 0 && ratingArray.length && this._fsu?.quickTop){
                    let quickLeft = events.createElementWithConfig("div",{
                        classList: ["fsu-quick-list","left"]
                    });
                    this._fsu?.quickTop.append(quickLeft);
                    this._fsu.quickLeft = quickLeft;

                    if(!isQuality && !qualityType){
                        if(listType !== 3){
                            let ratPlus = Number(ratingArray[0]) + 1;
                            let leftRatingPlusBtn = events.createButton(
                                new UTButtonControl(),
                                "",
                                () => {
                                    events.squadPositionSelection(
                                        thisController,
                                        {GTrating:ratPlus},
                                        null
                                    )
                                },
                                "im"
                            )
                            leftRatingPlusBtn.getRootElement().innerHTML = `<span> >= </span>${ratPlus}`;
                            this._fsu.leftRatingPlusBtn = leftRatingPlusBtn;
                            quickLeft.append(leftRatingPlusBtn.getRootElement());
                        }

                        if(listType == 1){
                            let ratMinus = Number(ratingArray[ratingArray.length - 1]) - 1;
                            let leftRatingMinusBtn = events.createButton(
                                new UTButtonControl(),
                                "",
                                () => {
                                    events.squadPositionSelection(
                                        thisController,
                                        {LTrating:ratMinus},
                                        null
                                    )
                                },
                                "im"
                            )
                            leftRatingMinusBtn.getRootElement().innerHTML = `<span> <= </span>${ratMinus}`;
                            this._fsu.leftRatingMinusBtn = leftRatingMinusBtn;
                            quickLeft.append(leftRatingMinusBtn.getRootElement());
                        }
                    }else{
                        let leftQalityBtn = events.createButton(
                            new UTButtonControl(),
                            "",
                            () => {
                                events.squadPositionSelection(
                                    thisController,
                                    {rs: qualityType - 1},
                                    null
                                )
                            },
                            "im"
                        )
                        leftQalityBtn.getRootElement().innerHTML = `${ratingStart}<span>-</span>${maxRating}`;
                        this._fsu.leftQalityBtn = leftQalityBtn;
                        quickLeft.append(leftQalityBtn.getRootElement());
                    }
                }
                if(this._fsu?.quickOther.innerHTML !== ""){
                    this._fsu?.quickTop.append(this._fsu?.quickOther);
                }
                //初始载入保存阵容
                if(!isPhone()){
                    events.saveOldSquad(this._squad,false,true);
                }
                info.douagain.sbc = this._set.id;

                //24.15 头部快捷入口：进入SBC插入到SBCLIST
                events.SBCListInsertToFront(this._set.id,1);


                if(info.set.sbc_right){
                    let quickRight = events.createElementWithConfig("div",{
                        classList: ["fsu-quick","right"]
                    });
                    this._fsu.quickRight = quickRight;
                    let quickRightList = events.createElementWithConfig("div",{
                        classList: "fsu-quick-list"
                    });
                    quickRight.appendChild(quickRightList)
                    this._fsu.quickRightList = quickRightList;

                    for (let i of ratingArray) {
                        let rightRatingBtn = events.createButton(
                            new UTButtonControl(),
                            i,
                            () => {
                                events.squadPositionSelection(
                                    thisController,
                                    {rating: i},
                                    null
                                )
                            },
                            "im"
                        );
                        this._fsu[`rightRatingBtn_${i}`] = rightRatingBtn;
                        quickRightList.append(rightRatingBtn.getRootElement());
                    }

                    //未分配按钮
                    if(repositories.Item.numItemsInCache(ItemPile.PURCHASED)){
                        let unassignedBtn = events.createButton(
                            new UTButtonControl(),
                            fy("sbc.qucikdupes"),
                            () => {
                                const squadDefIds = _.map(thisController._squad.getPlayers(),"item.definitionId");
                                const duplicatePlayers = _.map(repositories.Item.unassigned.filter(t => {
                                    return !squadDefIds.includes(t.definitionId)
                                }), "duplicateId")
                                const players = events.getItemBy(2, {"id": duplicatePlayers});
                                if(players.length){
                                    events.squadPositionSelection(
                                        thisController,
                                        null,
                                        players
                                    )
                                }else{
                                    events.notice("notice.noplayer",2);
                                }
                            },
                            "im"
                        );
                        this._fsu.unassignedBtn = unassignedBtn;
                        quickRightList.append(unassignedBtn.getRootElement());
                    }

                    //转会按钮
                    if(repositories.Item.numItemsInCache(ItemPile.TRANSFER)){
                        let transferBtn = events.createButton(
                            new UTButtonControl(),
                            fy("sbc.quciktransfers"),
                            () => {
                                const squadDefIds = _.map(thisController._squad.getPlayers(),"item.definitionId");
                                const duplicatePlayers = _.map(repositories.Item.transfer.filter(t => {
                                    return !squadDefIds.includes(t.definitionId) && t.getAuctionData().isInactive()
                                }), "duplicateId")
                                const players = events.getItemBy(2, {"id": duplicatePlayers});
                                if(players.length){
                                    events.squadPositionSelection(
                                        thisController,
                                        null,
                                        players
                                    )
                                }else{
                                    events.notice("notice.noplayer",2);
                                }
                            },
                            "im"
                        );
                        this._fsu.transferBtn = transferBtn;
                        quickRightList.append(transferBtn.getRootElement());
                    }

                    //仓库按钮
                    if(repositories.Item.numItemsInCache(ItemPile.STORAGE)){
                        let storageBtn = events.createButton(
                            new UTButtonControl(),
                            fy("sbc.qucikstorage"),
                            () => {
                                events.squadPositionSelection(
                                    thisController,
                                    null,
                                    repositories.Item.getStorage().values()
                                )
                            },
                            "im"
                        );
                        this._fsu.storageBtn = storageBtn;
                        quickRightList.append(storageBtn.getRootElement());
                    }

                    //回退按钮
                    if(info.set.sbc_sback){
                        let squadBackBtn = events.createButton(
                            new UTButtonControl(),
                            fy("sbc.squadback"),
                            () => {
                                let count = thisController._squad._fsu.oldSquadCount;
                                if(count){
                                    events.popup(
                                        fy("squadback.popupt"),
                                        fy(["squadback.popupm",count]),
                                        (t) => {
                                            if(t === 2){
                                                events.showLoader();
                                                let squad = thisController._squad._fsu.oldSquad[count - 1]
                                                events.saveSquad(thisController._challenge, thisController._squad, squad, []);
                                                thisController._squad._fsu.oldSquadCount--;
                                                thisController._squad._fsu.oldSquad.pop();
                                            }
                                        }
                                    )
                                }else{
                                    events.notice("notice.nosquad",2);
                                }
                            },
                            "im"
                        );
                        this._fsu.backBtn = squadBackBtn;
                        quickRightList.append(squadBackBtn.getRootElement());
                    }
                    this.getView()._summaryPanel.getRootElement().after(quickRight);
                }

                if(info.set.sbc_top){
                    this.getView()._summaryPanel.getRootElement().append(this._fsu?.quickTop);
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
                    if(!n.data.untradeableCount && n.data.loans == -1 && n.data.type == "player" && !n.data._auction.isClosedTrade() && !n.data._auction.isActiveTrade()){
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
                                            if(events.getCachePrice(n._fsuLosAuction._pId,1).text){
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
        //26.03 修复untradeable无法填充的问题
        events.ignorePlayerToCriteria = (c) => {
            if(info.build.league){
                c["NEleagueId"] = info.set.shield_league;
            }
            if(info.build.untradeable){
                c["tradable"] = false;
            }
            if(!_.has(c,"rareflag")){
                c["rareflag"] = [0,1];
                if(info.build.flag){
                    c["rareflag"] = c["rareflag"].concat(info.set.shield_flag);
                }
            }
            if(info.build.academy){
                c["upgrades"] = null;
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
        events.ignorePlayerPopup = (ignoreTextElment) => {
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
                ignoreTextElment.textContent = events.getIgnoreText();
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
            let message = m;
            if(info.isEnhancer){
                message = document.createElement("div");
                message.innerHTML = m;
            }
            let mp = new EADialogViewController({
                dialogOptions: o,
                message: message,
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
                if(mp.options[i].labelEnum == 2){
                    v.removeClass("text");
                    v.addClass("primary");
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
            //26.02 增加loading元素添加，避免导致无法重载数据
            events.addLoadingElment();
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
                await events.playerToAuction(n,events.getCachePrice(a[n]._pId,1).num,time);
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
            //25.22 重新编写输出方法
            let priceDataKey = "data";
            if(t){
                if(t == 1){
                    const item = _.get(info.roster[priceDataKey], i, {});
                    const priceInfo = {
                        num: item?.n ?? 0,
                        text: item?.n?.toLocaleString() ?? "0",
                        type: item?.y ?? 0,
                    };
                    if(item?.y !== 0 && item?.n == 0){
                        priceInfo.text = "Reward";
                    }
                    return priceInfo;
                }else if(t == 3){
                    return _.has(info.roster[priceDataKey],i);
                }
            }
        }
        events.losAuctionCount = (e,t) => {
            if(e.hasOwnProperty("_fsuAkbCurrent") && e.hasOwnProperty("_fsuAkbNumber") && e.hasOwnProperty("_fsuAkbArray")){
                let pn = 0,qs = {};
                for (let n in e._fsuAkbArray) {
                    const ppValue = events.getCachePrice(e._fsuAkbArray[n]._pId, 1);
                    pn += ppValue.num;
                    if(!ppValue.num){
                        e._fsuAkbArray[n].setInteractionState(0);
                    }else if(ppValue.text && ppValue.num == 0){
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
            this._fsu ??= {};

            //26.04 进化球员显示增加的属性
            const currentController = isPhone() ? cntlr.current() : cntlr.right();
            if(currentController instanceof UTAcademyPlayerFromClubViewController){
                const academyId = currentController.academySlot.id;
                const academyAttr = _.find(info.academy, { id: academyId });
                const currentThis = this;
                if(academyAttr){
                    this.listRows.map(function (i) {
                        i._fsu ??= {};
                        const attrBox = events.createElementWithConfig("div",{
                            classList: ["academyViewBox", "itemList"]
                        });
                        i.getRootElement().after(attrBox);
                        i._fsu.attrBox = attrBox;
                        currentThis._fsu[`attrBox_${i.data.id}`] = attrBox;
                        if(repositories.PlayerMeta.get(i.data.definitionId)){
                            const attrMap = events.academyAttrToList(events.academyAddAttr(academyAttr.attr, academyAttr.isGK, i.data).map);
                            attrBox.appendChild(events.academyAddAttrOutput(attrMap));
                            i._fsu.attrMap = attrMap;
                            currentThis._fsu[`attrMap_${i.data.id}`] = attrMap;
                            if(attrMap.size === 0){
                                attrBox.querySelector(".academyBoostsBox").style.opacity = "0.5";
                            }
                        }else{
                            attrBox.appendChild(events.createElementWithConfig("div",{
                                textContent: fy("academy.attr.load"),
                                classList: ["academyBoostsTips"],
                                style: {
                                    fontSize: "12px",
                                    padding: "0px"
                                }
                            }))
                        }
                    })
                }
            }


            this.listRows.map(function (i) {
                if(i.data.type == "player"){
                    //价格高亮显示
                    if(events.getCachePrice(i.data.definitionId, 3)){
                        let np = events.getCachePrice(i.data.definitionId,1).num;
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
            let totalElement = document.getElementById("squadValue");
            if(totalElement){
                totalElement.innerText = _.sumBy(this.getFieldPlayers(), i => events.getCachePrice(i.item.definitionId, 1).num).toLocaleString();
            }
            return r;
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
                const response = await events.externalRequest("GET",`https://www.futbin.org/futbin/api/${info.base.year}/fetchPriceInformation?playerresource=${pid}&platform=${platform}`);
                const originalJson = JSON.parse(response);
                const price = originalJson.LCPrice ?? 0;
                const priceJson = {
                    n: price,
                    y: (originalJson.MinPrice || originalJson.MaxPrice) ? 0 : 1
                };
                info.roster.data[pid] = priceJson
                return priceJson;
            } catch (error) {
                events.notice(fy("notice.loaderror") + error,2);
                events.hideLoader();
                throw error;
            }
        }
        //球员价格读取 需要传递球员ID列表(数组)
        events.loadPlayerInfo = async(items,el,type) => {
            if(info.set.card_meta && [1, 2].includes(info.apiPlatform) && false){
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
                    return _.has(i,"type") && i.type == "player" && !events.getCachePrice(i.definitionId,3) && i.definitionId > 0;
                }),"definitionId");
            if(list.length > 0){
                let la = Array.from(new Set(list));
                let chunks = _.chunk(la, 23);
                let pu = _.cloneDeep(chunks)
                for (let k in pu) {
                    let playerPrice;
                    try {
                        if(type){
                            playerPrice = Object.fromEntries(
                                await Promise.all(pu[k].map(async i => [i, await events.getPriceForFubin(i)]))
                            );
                            console.log(playerPrice);
                        }else{
                            playerPrice = await events.getPriceForUrl(pu[k]);
                        }
                    }catch(error) {
                        continue;
                    }

                    info.roster.data = Object.assign(info.roster.data,playerPrice);
                    _.map(playerPrice,(v,k) => {

                        if(info.roster.element[k]){
                            const priceJson = events.getCachePrice(k,1);
                            const priceType = info.priceType[priceJson.type];
                            _.map(info.roster.element[k],(i) => {
                                i.setAttribute("data-show", 1);
                                i.querySelector(".fsu-PriceValue").innerText = priceJson.text;
                                const typeElement = i.querySelector(".fsu-PriceType");
                                typeElement.innerText = priceType;
                                typeElement.setAttribute("data-content", priceType);
                                const { cs, rareflag, rating } = i.dataset;
                                if (Number(cs) == 21 && rareflag && rating && events.isPrecious(Number(rating), Number(rareflag), priceJson.num, priceJson.type)) {
                                    i.classList.add("precious");
                                }
                            })
                            info.roster.element[k] = null;
                            delete info.roster.element[k];
                        }

                    })
                }
                let totalElement = document.getElementById("squadValue");
                if(totalElement){
                    totalElement.innerText = _.sumBy(cntlr.current()._squad.getFieldPlayers(), i => events.getCachePrice(i.item.definitionId, 1).num).toLocaleString();
                }
            }
            if(el){
                //24.15 球员挑选最佳提示：拍卖后重触发挑选事件
                if(el.className == "UTPlayerPicksView" && info.set.player_pickbest){
                    events.playerSelectionSort(el);
                }else if(el.className.includes('UTUnassigned') && el.className.includes('Controller') && "_fsuScreenshot" in el){
                    let sPrice = 0;
                    _.map(list,i => {sPrice += events.getCachePrice(i,1).num;})
                    el._fsuScreenshot._header.setText(fy(["screenshot.text",list.length,sPrice.toLocaleString()]))
                }else if(el.className == "UTStorePackRevealModalListViewController" && "_packoddo" in el){
                    let packItemsPriceElements = el.getView().getRootElement().querySelectorAll(".fsu-price-val");
                    const packItesmPrices = _.sumBy(packItemsPriceElements, i => Number(i.getAttribute("data-value")));
                    el.getView().getRootElement().querySelector(".trypack-count").innerText = packItesmPrices.toLocaleString();
                    let sDiff = Math.round((packItesmPrices/el._packoddo-1)*100);
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
            if(!type && list.length > 0){
                let lackPlayers = _.filter(items, function (i) {
                    return _.has(i,"type") && i.type == "player" && !events.getCachePrice(i.definitionId,3) && i.definitionId > 0;
                });
                if(lackPlayers.length){
                    events.loadPlayerInfo(lackPlayers, el, 2);
                }
            }
        }

        //** 25.21 读取GGRating **/
        events.getGGRating = async(list,el) => {
            const now = Math.floor(Date.now() / 1000); // 当前时间（单位：秒）
            const filtered = _.map(list,"definitionId");
            if(filtered.length){
                let baseUrl = info.apiPlatform === 2 ? `${info.apiProxy}?futggapi=` : "https://www.fut.gg/api/fut/";
                const response = await events.externalRequest("GET",baseUrl + "metarank/players/?ids=" + filtered.join("%2C"));
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
                    result.grade = grades[customSortedIndex] + (result.score < player.rating ? " ↓" : " ↑");
                    result.gradeColor = gradeColors[customSortedIndex];
                }
            }
            return result;
        }

        
        call.task = {
            sbcT:UTSBCHubView.prototype.populateTiles,
            sbcN:UTSBCHubView.prototype.populateNavigation,
            objN:UTObjectivesHubView.prototype.setupNavigation,
            objG:UTObjectiveCategoryView.prototype.setCategoryGroups,
            home:UTHomeHubView.prototype._generate,
            objSetTitle:UTObjectivesHubTileView.prototype.setSubtitle,
            sbcSetDate:UTSBCSetTileView.prototype.setData,
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
                        this.__rewardList.querySelector(`li:nth-child(${index+1})`)?.querySelector(".rowContent")?.appendChild(packBox);
                    }
                }
            })
        }

        //给子任务TABLE样式添加ID
        const UTSBCChallengeTableRowView_render = UTSBCChallengeTableRowView.prototype.render;
        UTSBCChallengeTableRowView.prototype.render = function(e) {
            UTSBCChallengeTableRowView_render.call(this,e)
            this._fsu ??= {};
            this._fsu.subSet = e;
        }
        //生成奖励信息时报错处理
        UTSBCSetTileView.prototype.setData = function(e) {
            call.task.sbcSetDate.call(this,e);
        }


        events.squadCount = (reqRating) => {
            let pa = cntlr.current()._squad.getFieldPlayers().map(i => {if(!i.isBrick() && i.item.rating && !i.item.concept){return i.item.rating}}).filter(Boolean),pr = "";
            if(pa.length > 0){
                pr = "&ratings=" + pa.join(",");
            }
            let dli = [...new Set(events.getItemBy(2,{"NEdatabaseId":cntlr.current()._squad.getFieldPlayers().map(i => i.item.databaseId).filter(Boolean)}).map(i => {return i.rating}))],
            br = reqRating > 84 ? 70 : reqRating < 61 ? 46 : reqRating - 15,
            cs = Array.from({ length: 30 }, (_, i) => i + br).filter(n => !dli.includes(n)),
            l = cs.length ? `&lock=${cs.join(",")}` : "";
            GM_openInTab(`https://futcd.com/sbc.html?target=${reqRating}${pr}${l}`, { active: true, insert: true, setParent :true });
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
                let sbcIds = _.chain(info.base.fastsbc).keys().map(k => { const part = k.split('#').pop().trim(); return _.toInteger(part); }).filter(n => _.isInteger(n) && n !== 0).uniq().value();
                let fastNav = new UTSBCCategoryDTO(996,996,`${fy("fastsbc.tab.text")}(${sbcIds.length})`,SBCCategoryType.SERVER);
                fastNav.setIds = sbcIds;
                fastNav.displayable = true;
                this.categoriesIterator.add(fastNav,2);
                original = this.categoriesIterator.values();
            }
            return original;
        }
        //SBC填充导航题头 加载导航额外信息
        //26.02 SBC导航判断类别中已完成的不进行数值展示
        UTSBCHubView.prototype.populateNavigation = function(e, t) {
            call.task.sbcN.call(this, e, t);
            setTimeout(() => {
                if(info.set.info_sbc){
                    _.map(e,(i,k) => {
                        const catNewIds = _.intersection(info.task.sbc.stat.new, i.setIds);
                        const catExpiryIds = _.intersection(info.task.sbc.stat.expiry, i.setIds);
                        if(catNewIds.length || catExpiryIds.length){
                            const realNewCount = _.filter(catNewIds, id =>
                                !services.SBC.repository.getSetById(id).isComplete()
                            ).length;
                            const realExpiryCount = _.filter(catExpiryIds, id =>
                                !services.SBC.repository.getSetById(id).isComplete()
                            ).length;
                            let tap = this._SBCCategoriesTM.items[k];
                            if(realNewCount){
                                events.navigationAddCount(tap, realNewCount);
                            }
                            if(realExpiryCount){
                                events.navigationAddCount(tap, - realExpiryCount);
                            }
                        }
                    })
                }
            },10);
        }

        //26.02 进化：进行排序按照到期时间
        const UTAcademyHubViewController_onRequestHubDataComplete = UTAcademyHubViewController.prototype.onRequestHubDataComplete;
        UTAcademyHubViewController.prototype.onRequestHubDataComplete = function(e, t) {
            t.data.slots = _.orderBy(t.data.slots, [
                item => info.evolutions.new.includes(item.id) ? 0 : 1,
                item => item.endTimePurchaseVisibility === 0 ? Infinity : item.endTimePurchaseVisibility,
                item => item.endTime === 0 ? Infinity : item.endTime
            ], ['asc', 'asc', 'asc']);
            UTAcademyHubViewController_onRequestHubDataComplete.call(this, e, t);
        }
        //26.02 进化：分类选项添加新任务数量
        const UTAcademyHubView_setupTabs = UTAcademyHubView.prototype.setupTabs;
        UTAcademyHubView.prototype.setupTabs = function(e) {
            UTAcademyHubView_setupTabs.call(this, e)
            _.forEach(this._navigation.items, item => { 
                if(item.id !== -1){
                    const academyCategory = _.find(e,i => i.id === item.id);
                    if(academyCategory){
                        const newCount = _.intersection(academyCategory.slotIds, info.evolutions.new).length;
                        if(newCount){
                            events.navigationAddCount(item, newCount);
                        }
                        const expiryAcademy = _.filter(academyCategory.slotIds, id => {
                            let academySlot = repositories.Academy.getSlotById(id)
                            let endTime = academySlot?.status == AcademySlotState.NOT_STARTED ? _.min(
                                _.filter([academySlot.endTime, academySlot.endTimePurchaseVisibility], v => v && v !== 0)
                            ) : academySlot?.endTime;
                            return endTime && endTime - Math.round(new Date() / 1000) < 172800
                        })
                        if(expiryAcademy.length){
                            events.navigationAddCount(item, - expiryAcademy.length);
                        }
                    }
                }
            })
        }
        //26.02 进化：任务添加到期和新标识
        const UTAcademyHubView_generateSlot = UTAcademyHubView.prototype.generateSlot;
        UTAcademyHubView.prototype.generateSlot = function(e) {
            const tileView = UTAcademyHubView_generateSlot.call(this, e);
            const tileViewRoot = tileView.getRootElement();
            tileView._fsu ??= {};
            let isChange = false;
            if(info.evolutions.new.includes(e.id)){
                isChange = true;
                tileView._fsu.new = events.createDF(`<div class='fsu-newtips'>${fy("task.new")}</div>`);
                tileViewRoot.appendChild(tileView._fsu.new);
            }
            const endTime = e.status == AcademySlotState.NOT_STARTED ? _.min(
                _.filter([e.endTime, e.endTimePurchaseVisibility], v => v && v !== 0)
            ) : e.endTime;
            if(endTime && endTime - Math.round(new Date() / 1000) < 172800){
                isChange = true;
                tileView._fsu.expire = events.createDF(`<div class='task-expire'>${fy("task.expire")}</div>`);
                tileViewRoot.prepend(tileView._fsu.expire);
                Object.assign(tileViewRoot.querySelector(".task-expire").style, {
                    position: 'absolute',
                    width: '100%',
                    top: '0',
                    left: '0'
                })
                tileView.__title.style.marginTop = '16px';
            }
            if(isChange){
                tileViewRoot.style.position = 'relative';
                tileViewRoot.style.overflow = 'clip';
            }

            //26.04 添加进化属性
            const attr = _.find(info.academy, { id: e.id });
            if(attr){
                if(attr.attrText.size > 3){
                    tileView._fsu.attr = events.createElementWithConfig("div",{
                        classList: "academyViewBox"
                    });
                    tileView._fsu.attr.appendChild(events.academyAddAttrOutput(attr.attrText));
                    tileView.__description.after(tileView._fsu.attr)
                }
            }
            
            return tileView
        }

        //26.02 进化：修复进化的右侧筛选失效的问题
        const UTAcademyClubSearchView_init = UTAcademyClubSearchView.prototype.init;
        UTAcademyClubSearchView.prototype.init = function(...args) {
            UTAcademyClubSearchView_init.call(this, ...args);
            setTimeout(() => {
                this._searchFilters.getSortDropDown().addTarget(this, this._eDropDownChanged, EventType.CHANGE)
                this._searchFilters.getSortDropDown().setDefaultIndexById(SearchSortID.RATING_DESC, !0)
                this._searchFilters._filterContainer._playerNameSearch = new UTPlayerSearchControl
                this._searchFilters._filterContainer._playerNameSearch.init()
                this._searchFilters._filterContainer.addSubview(this._searchFilters._filterContainer._playerNameSearch)
                this._searchFilters._filterContainer.getRootElement().prepend(this._searchFilters._filterContainer._playerNameSearch.getRootElement())
                this._playerNameSearch = this._searchFilters.getPlayerNameSearch()
                this._playerNameSearch?.addTarget(this, this.eButtonSelected, EventType.CHANGE);
                this._searchFilters.onFilterChange.observe(this, this._eFilterChanged)
                this._searchFilters._filterContainer.show()
                _.forOwn(this._searchFilters._filterContainer.searchFilters._collection, (value, key) => {
                    if(key !== enums.UISearchFilters.CLUB && key !== enums.UISearchFilters.LEAGUE && key !== enums.UISearchFilters.NATION){
                        value.hide()
                    }
                });
            }, 50);
        }
        //26.02 进化：拦截球员搜索部分代码
        //26.03 修复评分条件错误使用GT和LT的问题
        const UTAcademyPlayerFromClubViewController_requestItems = UTAcademyPlayerFromClubViewController.prototype.requestItems;
        UTAcademyPlayerFromClubViewController.prototype.requestItems = function(...args) {
            let localSearch = {},sc = this.searchCriteria;
            if(sc.defId.length){
                localSearch.definitionId = sc.defId;
            }
            if(sc.nation != -1){
                localSearch.nationId = sc.nation;
            }
            if(sc.club != -1){
                localSearch.teamId = sc.club;
            }
            if(sc.league != -1){
                localSearch.leagueId = sc.league;
            }
            if(_.size(localSearch)){
                _.forEach(this.academySlot.eligibilityRequirements, er => {
                    let op = "";
                    if(er.attribute == AcademyEligibilityAttribute.OVR && er.scope < 3){
                        op = er.scope == AcademyEligibilityScope.MAX ? "LT" : "GT";
                        localSearch[`${op}rating`] = er.targets;
                    }
                    if(er.attribute == AcademyEligibilityAttribute.BASE_TRAITS_COUNT){
                        localSearch[`maxNumBasicPlayStyles`] = er.targets;
                    }
                    if(er.attribute == AcademyEligibilityAttribute.ICON_TRAITS_COUNT){
                        localSearch[`maxNumPlusPlayStyles`] = er.targets;
                    }
                    if(er.attribute == AcademyEligibilityAttribute.POSITION){
                        localSearch[`includePos`] = er.targets;
                    }
                    if(er.attribute == AcademyEligibilityAttribute.POSITION_NEGATED){
                        localSearch[`excludePos`] = er.targets;
                    }
                    if(er.attribute == AcademyEligibilityAttribute.POSSIBLE_POSITIONS_COUNT){
                        localSearch[`maxNumPos`] = er.targets;
                    }
                })
                let result = events.getItemBy(2,localSearch, false, repositories.Item.club.items.values())
                console.log(result)
                this.handleItemRetrieval(_.filter(result, player => {return this.academySlot.meetsRequirements(player)}), true)
            }else{
                UTAcademyPlayerFromClubViewController_requestItems.call(this, ...args);
            }
            console.log(this)
        }

        //26.02 分类导航计数添加
        events.navigationAddCount = (e, c) => {
            if(e.className == `EAFilterBarItemView`){
                e.getRootElement().appendChild(
                    events.createElementWithConfig("div",{
                        textContent:c,
                        classList:["fsu-tab-count", Number(c) < 0 ? "expire" : "new"]
                    })
                );
            }
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
        
        const UTSBCChallengesViewController_viewDidAppear = UTSBCChallengesViewController.prototype.viewDidAppear;
        UTSBCChallengesViewController.prototype.viewDidAppear = function() {
            UTSBCChallengesViewController_viewDidAppear.call(this);
            if(info.set.info_sbcs){
                this._fsu ??= {};
                events.sbcSubPrice(this.sbset.id,this.getView());

                //子任务添加查看球员按钮
                if(_.isArray(this.sbset.awards)){
                    _.map(this.sbset.awards, (item, index) => {
                        if (!item.isItem && !item.isPack) return;

                        const li = this.getView()._setInfo._rewards.__rewardList.querySelector(`li:nth-child(${index + 1})`);
                        if (!li) return;

                        const createBtn = (labelKey, onClick, size = "mini") => {
                            const btn = events.createButton(new UTStandardButtonControl(), fy(labelKey), onClick, size);
                            btn.getRootElement().style.marginRight = "2rem";
                            return btn;
                        };

                        let btn;
                        if (item.isItem) {
                            if (item.item.isPlayer()) {
                                btn = createBtn("sbc.watchplayer", (e) => events.openFutbinPlayerUrl(e));
                                btn.getRootElement().setAttribute("data-id", item.value);
                                btn.getRootElement().setAttribute("data-name", item.item.getStaticData().name);
                            } else if (item.item.isPlayerPickItem()) {
                                btn = createBtn("sbc.watchplayer", () => events.fixedPickPopup(item.item));
                            }
                        } else if (item.isPack) {
                            btn = createBtn("trypack.button.subtext", () => {
                                events.showLoader();
                                events.tryPack({
                                    id: item.value,
                                    odds: false,
                                    packName: services.Localization.localize(`FUT_STORE_PACK_${item.value}_NAME`),
                                    tradable: item.tradable
                                });
                            });
                        }

                        btn && li.appendChild(btn.getRootElement());
                        this._fsu.watchBtn = btn;
                    });

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

                if(needRatings.length > 2 && !this._fsu.needBtn){
                    let needBtn = events.createButton(
                        new UTStandardButtonControl(),
                        fy("sbcneedslist.btn"),
                        (e) => {
                            events.showLoader();
                            events.sbcListNeedCount(needRatings,services.SBC.repository.sets.get(this.sbset.id).name);
                        },
                        "mini"
                    )
                    Object.assign(this.getView()._header.__root.style,{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    });
                    this.getView()._header.getRootElement().appendChild(needBtn.getRootElement())
                    this._fsu.needBtn = needBtn;
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
                    e.getRootElement().prepend(events.createDF(`<div class='fsu-newtips'>${fy("task.new")}</div>`));
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
                        e.__root.prepend(events.createDF(`<div class='task-expire'>${fy("task.expire")}</div>`));
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
                })
                if(count !== 0){
                    countBox.style.opacity = "1";
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
                if(e._infoBtn.getRootElement().style.display != "none" && e.data.awards[0]?.item?.isPlayerPickItem()){
                    e._infoBtn.removeTarget(e, e._eCheckMoreInfo, EventType.TAP)
                    e._infoBtn.addTarget(e, () => events.fixedPickPopup(e.data.awards[0].item), EventType.TAP);
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
            e._fsu ??= {};
            const sbcStat = info.task.sbc.stat[id];
            if(sbcStat){
                if(!_.has(sbcStat, "child")){
                    let subPrice;
                    try {
                        subPrice = await events.getFutbinUrl(`https://www.futbin.org/futbin/api/getChallengesBySetId?set_id=${id}`);
                    }catch(error) {
                        return;
                    }
                    if("data" in subPrice){
                        sbcStat.child = {};
                        for (let i of subPrice.data) {
                            let j = {"tv":i.price.ps,"pc":i.price.pc};
                            sbcStat.child[i.challengeId] = j;
                        }
                    }
                }

                if(_.has(sbcStat, "child")){
                    for (let i of e._challengeRows) {
                        if(i?._fsu?.subSet){
                            const sId = i._fsu.subSet.id;
                            const child = sbcStat.child[sId];
                            let box = events.createElementWithConfig("div",{
                                style:{
                                    display:"flex",
                                    flexDirection:"row",
                                    gap: "8px"
                                }
                            });
                            child.price ??= Number(info.base.platform == "pc" ? child.pc : child.tv);
                            box.appendChild(events.createElementWithConfig("span",{
                                textContent:`${fy("sbc.price")}${child.price.toLocaleString()}`,
                                classList:['currency-coins']
                            }));

                            if(!_.has(child, "award")){
                                child.award = 0;
                                _.forOwn(i._fsu.subSet.awards,item => {
                                    if(item.isPack || (item.isItem && item.item && item.item.isPlayerPickItem())){
                                        let packCoinValue = events.getOddo(item.value);
                                        if(packCoinValue){
                                            child.award += packCoinValue * item.count;
                                        }
                                    }
                                })
                            }
                            box.appendChild(events.createElementWithConfig("span",{
                                textContent:`${fy("subsbcaward.title")}${child.award ? child.award.toLocaleString() : fy("subsbcaward.nope")}`,
                                classList:[`${child.award ? 'currency-coins' : 'no'}`]
                            }));

                            if(isPhone()){
                                box.style.flexDirection = "column";
                                box.style.fontSize = "14px";
                            }
                            i._fsu.priceBox = box;
                            i.__rowTitle.insertAdjacentElement('afterend',box);

                            const fast = info.base.fastsbc[`${sId}#${i._fsu.subSet.setId}`];
                            if(fast){
                                const fastCount = events.fastSBCQuantity(true,_.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.duplicateId !== 0),fast);
                                i._fsu.fastBtn = events.createButton(
                                    new UTCurrencyButtonControl(),
                                    fy(["fastsbc.sbcbtntext", fastCount]),
                                    () => {
                                        if (info.base.fastsbctips) {
                                            events.isSBCCache(i._fsu.subSet.setId, sId)
                                        } else {
                                            events.popup(
                                                fy("fastsbc.popupt"),
                                                fy("fastsbc.popupm"),
                                                (t) => {
                                                    if (t === 2) {
                                                        info.base.fastsbctips = true;
                                                        events.isSBCCache(i._fsu.subSet.setId, sId)
                                                    }
                                                }
                                            )
                                        }
                                    },
                                    "call-to-action mini fsu-challengefastbtn"
                                )
                                i._fsu.fastBtn.__currencyLabel.innerHTML = events.getFastSbcSubText(fast);
                                if(i._fsu.subSet.isCompleted()){
                                    i._fsu.fastBtn.setInteractionState(0);
                                }
                                i._progressBar.getRootElement().after(i._fsu.fastBtn.getRootElement());
                            }
                        }
                    }

                    let targetElement = e._setInfo._watchBtn.getRootElement().nextElementSibling;
                    if(targetElement){
                        if(!e._fsu.sumPrice){
                            sbcStat.childPrice ??= _.sumBy(_.values(sbcStat.child), 'price')
                            sbcStat.childAward ??= _.sumBy(_.values(sbcStat.child), 'award')
                            let sumBox = events.createElementWithConfig("div",{
                                classList:["fsu-sub-price"],
                                style:{
                                    display:"flex",
                                    flexDirection:"row",
                                    lineHeight:"2em",
                                    width:"100%",
                                }
                            })
                            sumBox.appendChild(events.createElementWithConfig("span",{
                                textContent:`${fy("sbc.price")}${sbcStat.childPrice.toLocaleString()}`,
                                classList:['currency-coins']
                            }));
                            sumBox.appendChild(events.createElementWithConfig("span",{
                                textContent:`${fy("subsbcaward.title")}${sbcStat.childAward ? sbcStat.childAward.toLocaleString() : fy("subsbcaward.nope")}`,
                                classList:[`${sbcStat.childAward ? 'currency-coins' : 'no'}`],
                                style:{
                                    marginLeft:".5rem",
                                }
                            }));
                            e._fsu.sumPrice = sumBox;
                            if(targetElement){
                                targetElement.appendChild(sumBox);
                            }
                        }
                    }
                }
            }
        }

        call.panel = {
            quickRender:UTQuickListPanelViewController.prototype.renderView,
            market:UTMarketSearchFiltersView.prototype.setPinnedItem,
            reward:UTRewardSelectionChoiceView.prototype.expandRewardSet,
        }


        /** 球员简历页面 */
        //24.18 可进化标识：球员预览属性标注
        //25.01 角色分页插入评分
        //25.20 球员自动购买 右侧界面tabs点击事件拦截
        //26.02 合并原有错误的两个事件
        const UTPlayerBioView_render = UTPlayerBioView.prototype.render;
        UTPlayerBioView.prototype.render = function(t, e, i){
            if(this.isFsuAutoBuy){
                DOMKit.empty(this.__dataDisplay);
                if(t == 444101 || !t){
                    if (!_.has(info.autobuy.infoViews, e.definitionId)) {
                        info.autobuy.infoViews[e.definitionId] = events.autoBuyCreateInfoView(e);
                    }
                    this.__dataDisplay.appendChild(info.autobuy.infoViews[e.definitionId].getRootElement());
                }else if(t == 444102){
                    if(_.isEmpty(info.autobuy.logView)){
                        events.autoBuyCreateLogView();
                    }
                    this.__dataDisplay.appendChild(info.autobuy.logView.getRootElement());
                }
                
            }else{
                UTPlayerBioView_render.call(this, t, e, i);
            }
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
                    const nowPlayer = this.fsuAcademy.nowPlayer;
                    console.log(e, nowPlayer)
                    let infoChange = [],CA = e.academy,attrChange = [],styleChange = [],roleChange = [];
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
                        this.fsuAcademyChange[PlayerBioDisplayGroup.INFO] = infoChange;
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
                        this.fsuAcademyChange[PlayerBioDisplayGroup.ATTRIBUTES] = attrChange;
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
                        this.fsuAcademyChange[PlayerBioDisplayGroup.TRAITS] = styleChange;
                    }

                    let roleCont = 0;
                    const plusRolePos = _.uniq(_.map(e.getPlusRoles(), "position"));
                    _.forEach(e.possiblePositions,posId => {
                        let roleIds = services.Squad.getRoleIdsForPosition(posId);
                        if(!_.includes(nowPlayer.possiblePositions, posId)){
                            _.forEach(roleIds,roleId => {
                                console.log(roleCont, posId, roleId, "新增")
                                roleChange.push({type:1,index:roleCont,value:0,count:true});
                                roleCont++;
                            })
                        }else{
                            if(_.includes(plusRolePos, posId)){
                                let plusPlusRoles = [], 
                                    plusRoles = [], 
                                    baseRoles = [];
                                const getRoleTypes = (player, method, posId) => _.map(_.filter(player[method](), { position: posId }), "type");
                                const posPlusPlusRoles = getRoleTypes(e, "getPlusPlusRoles", posId);
                                const posPlusRoles = getRoleTypes(e, "getPlusRoles", posId);
                                const nowPosPlusPlusRoles = getRoleTypes(nowPlayer, "getPlusPlusRoles", posId);
                                const nowPosPlusRoles = getRoleTypes(nowPlayer, "getPlusRoles", posId);
                                _.forEach(roleIds,roleId => {
                                    if(_.includes(posPlusPlusRoles, roleId)){
                                        plusPlusRoles.push(roleId);
                                        if(!_.includes(nowPosPlusPlusRoles, roleId)){
                                            console.log(roleCont, posId, roleId, "升级")
                                            roleChange.push({type:2,index:roleCont,value:0,count:true});
                                        }
                                    }else if(_.includes(posPlusRoles, roleId)){
                                        plusRoles.push(roleId);
                                        if(!_.includes(nowPosPlusRoles, roleId)){
                                            console.log(roleCont, posId, roleId, "升级")
                                            roleChange.push({type:2,index:roleCont,value:0,count:true});
                                        }
                                    }else{
                                        baseRoles.push(roleId);
                                    }
                                    roleCont++;
                                })
                                
                            }else{
                                _.forEach(roleIds,roleId => {
                                    roleCont++;
                                })
                            }
                        }
                    })
                    if(roleChange.length){
                        this.fsuAcademyChange[PlayerBioDisplayGroup.ROLES] = roleChange;
                    }
                    

                    //插入数字显示
                    _.map(this._navigation.items,i => {
                        if(_.has(this.fsuAcademyChange, i.id)){
                            let count = _.size(_.filter(this.fsuAcademyChange[i.id], { 'count': true }))
                            if(count){
                                i.addNotificationBubble(count)
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
                if(_.has(this,"fsuAcademyChange") && _.has(this.fsuAcademyChange,t) && t !== PlayerBioDisplayGroup.ROLES){
                    let changeAttr = this.fsuAcademyChange[t],
                        textType = ["change","add","upgrade","new"],
                        queryType = {"0":"h1","1":".title","3":"span","4":"span"},
                        attrElement = this.__dataDisplay.querySelectorAll("li");
                    let changeElementTemplate = events.createElementWithConfig("span", {
                        textContent:"",
                        style:{
                            paddingLeft:".2rem",
                            fontSize:"80%",
                            color:"#00d1ff"
                        }
                    })
                    _.map(changeAttr,a => {
                        if(_.has(attrElement,a.index)){
                            let targetElement = attrElement[a.index].querySelector(queryType[t]);
                            let changeElement = changeElementTemplate.cloneNode(true);
                            changeElement.textContent = fy(a.type == 1 ? [`academy.bio.${textType[a.type]}`,a.value] : `academy.bio.${textType[a.type]}`);
                            targetElement.appendChild(changeElement)
                        }
                    })
                }
            }
        }

        /** 球员简历页面-位置选项浏览界面 */
        //26.02 添加
        const UTPlayerBioView_renderPlayerRoles = UTPlayerBioView.prototype.renderPlayerRoles;
        UTPlayerBioView.prototype.renderPlayerRoles = function(item) {
            UTPlayerBioView_renderPlayerRoles.call(this, item)
            if(_.has(this,"fsuAcademyChange") && _.has(this.fsuAcademyChange,PlayerBioDisplayGroup.ROLES)){
                let roleChange = this.fsuAcademyChange[PlayerBioDisplayGroup.ROLES];
                let textType = ["change","add","upgrade","new"];
                let roleElement = this.__dataDisplay.querySelectorAll("span");
                let changeElementTemplate = events.createElementWithConfig("span", {
                    textContent:"",
                    style:{
                        paddingLeft:".2rem",
                        fontSize:"80%",
                        color:"#00d1ff"
                    }
                })
                console.log(roleChange)
                _.forEach(roleChange,change => {
                    if(_.size(roleElement) >= change.index){
                        let targetElement = roleElement[change.index];
                        let changeElement = changeElementTemplate.cloneNode(true);
                        changeElement.textContent = fy(`academy.bio.${textType[change.type]}`);
                        targetElement.appendChild(changeElement);
                        Object.assign(targetElement.style,{
                            width:"100%",
                            alignItems:"center",
                            juestifyContent:"space-between",
                        })
                        let plusElement = targetElement.querySelector(".ut-player-bio-role-cell-view--familiarity");
                        if(plusElement){
                            plusElement.style.flex = "1";
                        }
                        console.log(targetElement)
                    } 
                })
            }
        }

        UTMarketSearchFiltersView.prototype.setPinnedItem = function(e, t) {
            call.panel.market.call(this,e,t)
            let sbc = isPhone() ? cntlr.current().squadContext.squad.isSBC() : cntlr.current()._squad.isSBC();
            if(e.definitionId && sbc && info.set.sbc_market && e.concept){
                let p = events.getCachePrice(e.definitionId,1).num,v = this._maxBuyNowPriceRow._currencyInput._currencyInput,f = this._searchFilters.filters;
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
            //26.04 重写所有按钮逻辑
            if(!isPhone() && !cntlr.current().rightController) return;
            let controller = isPhone() ? cntlr.current() : cntlr.right();
            if(!controller) return;
            if(controller.hasOwnProperty("rootController")) controller = controller.rootController;
            const panelView = controller.panelView || controller.panel;
            if(!panelView){
                return;
            }
            
            const item = e.item;
            //console.log(`界面信息：`, controller, panelView)
            if(item && item.isPlayer()){
                const defId = item.definitionId;
                controller._fsu = {};
                
                //添加添加futbin按钮
                if(defId !== 0){
                    const playerBio = panelView._bioButton || panelView._btnBio || panelView._playerBioButton;
                    if(info.set.player_futbin){
                        let goToFutbin = controller._fsu?.goToFutbin;
                        if(!goToFutbin){
                            goToFutbin = events.createButton(
                                new UTGroupButtonControl(),
                                fy("quicklist.gotofutbin"),
                                (e) => { events.openFutbinPlayerUrl(e); },
                                "more"
                            )
                            controller._fsu.goToFutbin = goToFutbin;
                        }
                        Object.entries({
                            "data-id": defId,
                            "data-name": item._staticData.name,
                        }).forEach(([k, v]) => goToFutbin.getRootElement().setAttribute(k, v));
                        if(playerBio){
                            playerBio.getRootElement().after(goToFutbin.getRootElement());
                        }
                    }

                    //添加进化任务展示
                    let getAcademies = controller._fsu?.getAcademies;
                    if(!getAcademies){
                        getAcademies = events.createButton(
                            new UTGroupButtonControl(),
                            fy("academy.btntext2"),
                            (e) => {
                                const filtered = _.pickBy(e.fsu, (value, key) =>
                                    _.includes(key, `academieBtn_${e.item.id}`)
                                );
                                if(_.size(filtered)){
                                    //console.log(filtered)

                                    _.forEach(filtered, (item) => {
                                        const action = e.isShow ? 'hide' : 'show';
                                        if (item instanceof UTButtonControl) {
                                            item[action]();
                                        } else if (item instanceof Element) {
                                            item.style.display = e.isShow ? 'none' : '';
                                        }
                                    });
                                    
                                    e.isShow = !e.isShow;
                                }else{
                                    const createBtns = () => {
                                        const attrs = e.academies.map(academy => {
                                            const attr = events.academyAddAttr(academy.attr, academy.isGK, item);
                                            const sizeValue = attr.map.size ? 1 : 0;
                                            return {
                                                id: academy.id,
                                                name: academy.name,
                                                time: academy.timeText,
                                                diff: academy.timeDiff,
                                                attr: attr.map,
                                                count: attr.count,
                                                class: attr.map.size === 0 ? "not" : "yes",
                                                size: sizeValue
                                            };
                                        });

                                        const sortedAttrs = _.orderBy(
                                            attrs,
                                            ['size', 'count', 'diff'],
                                            ['desc', 'desc', 'asc']
                                        );

                                        _.forEachRight(sortedAttrs, (academy) => {
                                            let academieBtn = events.createButton(
                                                new UTButtonControl(),
                                                "",
                                                (e) => {
                                                    events.academyPreviewEvolutionAttr(e._fsu.academyId, controller, item)
                                                },
                                                `mini academieBtn accordian ${academy.class}`
                                            );
                                            academieBtn._fsu ??= {};
                                            academieBtn._fsu.academyId = academy.id;
                                            let academieBtnElment = academieBtn.getRootElement();
                                            let academieBtnTitleBox = events.createElementWithConfig("div", {
                                                className: "academieBtnTitle"
                                            });
                                            academieBtnTitleBox.appendChild(
                                                events.createElementWithConfig("div", {
                                                    textContent: academy.name,
                                                    className: "academieBtnName"
                                                })
                                            )
                                            academieBtnTitleBox.appendChild(
                                                events.createElementWithConfig("div", {
                                                    textContent: academy.time,
                                                    className: "academieBtnTime"
                                                })
                                            )
                                            academieBtnElment.appendChild(academieBtnTitleBox);
                                            academieBtnElment.appendChild(events.academyAddAttrOutput(academy.attr))
                                            e.fsu[`academieBtn_${item.id}_${academy.id}`] = academieBtn;
                                            e.getRootElement().after(academieBtn.getRootElement());

                                        })
                                        if (e.academies.length) {
                                            let academyBtnTips = events.createElementWithConfig("div", {
                                                className: "academyBtnTips",
                                                textContent: fy("academy.attr.tips")
                                            });
                                            e.fsu[`academieBtn_${item.id}_tips`] = academyBtnTips;
                                            getAcademies.getRootElement().after(academyBtnTips);
                                        }
                                        e.isShow = true;
                                        events.hideLoader();
                                    }
                                    events.showLoader()
                                    if (!repositories.PlayerMeta.get(item.definitionId)) {
                                        services.PlayerMetaData.updateItemPlayerMeta([item]).observe(controller, function (q, w) {
                                            q.unobserve(controller);
                                            if(w.success){
                                                item.setMetaData(repositories.PlayerMeta.get(item.definitionId));
                                                createBtns();
                                            }else{
                                                events.notice("notice.loaderror", 2)
                                                events.hideLoader()
                                            }
                                        });
                                    }else{
                                        createBtns();
                                    }
                                }
                            },
                            "more"
                        )
                        controller._fsu.getAcademies = getAcademies;
                    }
                    
                    const academies = info.academy
                        .filter(
                            a =>
                                a.practical &&
                                a.el.every(t => t.meetsRequirements(item))
                        )
                        .map(a => {
                            return {
                                id: a.id,
                                name: a.name,
                                isGK: a.isGK,
                                attr: a.attr,
                                timeDiff: a.timeDiff,
                                timeText: a.timeDiffText
                            };
                        });
                    
                    if(academies.length){
                        getAcademies.academies = academies;
                        getAcademies.item = item;
                        getAcademies.fsu = controller._fsu;

                        //移除额外的按钮
                        _.forEach(controller._fsu, (value, key) => {
                            if (_.includes(key, 'academieBtn') && !_.includes(key, `academieBtn_${item.id}`)) {
                                value.destroy();
                                delete controller._fsu[key];
                            }
                        });

                        if(playerBio){
                            playerBio.getRootElement().before(getAcademies.getRootElement());
                        }
                    }
            
                    //添加读取拍卖价格按钮
                    if(info.set.player_getprice && services.User.getUser().tradeAccess === TradeAccessLevel.ALLOWED){
                        let getAuction = controller._fsu?.getAuction;
                        if(!getAuction){
                            getAuction = events.createButton(
                                new UTGroupButtonControl(),
                                fy("quicklist.getprice"),
                                (e) => { 
                                    events.getAuction(e, e.defId);
                                },
                                "accordian"
                            )
                            controller._fsu.getAuction = getAuction;
                        }
                        getAuction.defId = defId;
                        if(_.has(pdb, defId)){
                            getAuction.setText(fy("quicklist.getpricey"));
                            getAuction.setSubtext(pdb[defId]);
                            getAuction.displayCurrencyIcon(!0);
                        }
                        const lastGroup = _.last(panelView.getRootElement().querySelectorAll('.ut-button-group'));
                        lastGroup.appendChild(getAuction.getRootElement());
                    }


                    //添加一键拍卖按钮
                    if(info.set.player_auction && services.User.getUser().tradeAccess === TradeAccessLevel.ALLOWED){

                        let setAuction = controller._fsu?.setAuction;
                        if(!setAuction){
                            setAuction = events.createButton(
                                new UTGroupButtonControl(),
                                fy("quicklist.auction"),
                                (e) => {
                                    events.showLoader();
                                    events.playerToAuction(e.itemId, events.getCachePrice(e.defId, 1).num, 1);
                                    events.hideLoader();
                                },
                                "accordian fsu-setAuction"
                            );
                            controller._fsu.setAuction = setAuction;
                        }
                        setAuction.itemId = item.id;
                        setAuction.defId = defId;
                        setAuction.getRootElement().setAttribute('data-id',defId);
                        const cachePrice = events.getCachePrice(defId, 1);
                        if(cachePrice.num){
                            setAuction.setSubtext(cachePrice.text);
                        }else{
                            setAuction.setSubtext("--");
                        }
                        setAuction.displayCurrencyIcon(!0);
                        let oldSetAuction = e.getView().getRootElement().querySelector('.fsu-setAuction');
                        if(oldSetAuction){
                            oldSetAuction.remove();
                        }
                        e.getView()._btnToggle.getRootElement().after(setAuction.getRootElement());
                    }

                    
                }

                

                if(controller instanceof UTSlotDetailsViewController ){
                    //const panel = panel.getView();
                    //console.log(`球员操作：这里是阵容`);
                    if(controller.squad.isSBC()){
                        //console.log(`球员操作：这里是SBC`);
                        let subBox = controller._fsu?.substitutionBox;
                        if(!(subBox)){
                            subBox = events.createElementWithConfig(
                                "div",
                                {
                                    classList: "fsu-substitutionBox"
                                }
                            )
                            controller._fsu.substitutionBox = subBox;
                        }

                        let normalTitle = controller._fsu?.normalTitle;
                        if(!normalTitle){
                            normalTitle = events.createElementWithConfig(
                                "div",
                                {
                                    textContent: fy("substitution.swaptitle"),
                                    classList: "fsu-substitutionTitle"
                                }
                            )
                            subBox.appendChild(normalTitle);
                            controller._fsu.normalTitle = normalTitle;
                        }

                        let normalBtns = controller._fsu?.normalBtns;
                        if(!normalBtns){
                            normalBtns = events.createElementWithConfig(
                                "div",
                                {
                                    classList: "fsu-substitutionBtns"
                                }
                            )
                            subBox.appendChild(normalBtns)
                            controller._fsu.normalBtns = normalBtns;
                        }

                        let conceptTitle = controller._fsu?.conceptTitle;
                        if(!conceptTitle){
                            conceptTitle = events.createElementWithConfig(
                                "div",
                                {
                                    textContent: fy("substitution.swapconcepttitle"),
                                    classList: "fsu-substitutionTitle"
                                }
                            )
                            subBox.appendChild(conceptTitle);
                            controller._fsu.conceptTitle = conceptTitle;
                        }

                        let conceptBtns = controller._fsu?.conceptBtns;
                        if(!conceptBtns){
                            conceptBtns = events.createElementWithConfig(
                                "div",
                                {
                                    classList: "fsu-substitutionBtns"
                                }
                            )
                            subBox.appendChild(conceptBtns)
                            controller._fsu.conceptBtns = conceptBtns;
                        }

                        normalTitle.textContent = fy(defId !== 0 ? "substitution.swaptitle" : "substitution.addtitle");
                        panelView.getRootElement().querySelector(".ut-item-details--metadata").after(subBox);
                        
                        const squadPlayerDefIds = _.map(controller.squad.getPlayers(),"item.definitionId");


                        //添加未分配重复球员按钮
                        if(repositories.Item.getUnassignedItems().length){
                            const duplicatePlayers = _.map(repositories.Item.unassigned.filter(t => {
                                return !squadPlayerDefIds.includes(t.definitionId)
                            }), "duplicateId")

                            let swapUnassigned = controller._fsu?.swapUnassigned;
                            if(!swapUnassigned){
                                swapUnassigned = events.createButton(
                                    new UTStandardButtonControl(),
                                    fy("substitution.unassigned"),
                                    async(e) => {
                                        let players = events.getItemBy(2, {"id": e.defIds});
                                        if(players.length){
                                            events.SBCDisplayPlayers(controller, null, players);
                                        }else{
                                            events.notice("notice.noplayer",2);
                                        }
                                    },
                                    "accordian"
                                );
                                controller._fsu.swapUnassigned = swapUnassigned;
                            }
                            swapUnassigned.defIds = duplicatePlayers;
                            swapUnassigned.setInteractionState(duplicatePlayers.length);
                            normalBtns.appendChild(swapUnassigned.getRootElement());
                        }

                        if(defId !== 0){
                            //添加同评分按钮
                            let sameRating = controller._fsu?.sameRating;
                            if (!sameRating) {
                                sameRating = events.createButton(
                                    new UTStandardButtonControl(),
                                    fy("substitution.samerating"),
                                    (e) => {
                                        events.SBCDisplayPlayers(controller, {"rating": e.rating});
                                    },
                                    ""
                                );
                                controller._fsu.sameRating = sameRating;
                            }
                            sameRating.rating = item.rating;
                            normalBtns.appendChild(sameRating.getRootElement()); 
                        }


                        if(controller.squad._fsu.hasChemistry){
                            let chemistryPlayers = controller._fsu?.chemistryPlayers;
                            if(!chemistryPlayers){
                                chemistryPlayers = events.createButton(
                                    new UTStandardButtonControl(),
                                    fy("substitution.chemistry"),
                                    (e) => {
                                        const slot = controller.viewmodel.current();
                                        const position = slot.position.typeId;

                                        const criteria = events.getChemistryPlayers(
                                            controller,
                                            controller.squad._chemistry
                                        );

                                        const players = _.flatMap(criteria, c => {
                                            return events.getItemBy(2, {
                                                ...c,
                                                possiblePositions: position
                                            });
                                        });

                                        events.SBCDisplayPlayers(controller, null, players);
                                    },
                                    ""
                                );
                                controller._fsu.chemistryPlayers = chemistryPlayers;
                            }
                            chemistryPlayers.setInteractionState(controller.squad.chemistryVO.getParameterChemistry().filter(i => {return i.contributions > 0}).length);
                            normalBtns.appendChild(chemistryPlayers.getRootElement());



                            if(controller.challenge.meetsRequirements()){
                                let requirementPlayers = controller._fsu?.requirementPlayers;
                                if(!requirementPlayers){
                                    requirementPlayers = events.createButton(
                                        new UTStandardButtonControl(),
                                        fy("substitution.requirement"),
                                        (e) => {
                                            const players = events.SBCSetMeetsPlayers(controller);
                                            if (players.length > 0) {
                                                events.SBCDisplayPlayers(controller, null, players);
                                            } else {
                                                events.notice("meetsreq.error", 2);
                                            }
                                        },
                                        ""
                                    );
                                    controller._fsu.requirementPlayers = requirementPlayers;
                                }
                                normalBtns.appendChild(requirementPlayers.getRootElement()); 
                            }
                        }
                        
                        //隐藏假想按钮
                        if(defId == 0 || !item.concept){
                            conceptTitle.style.display = "none";
                            conceptBtns.style.display = "none";
                        }else if(item.concept){
                            conceptTitle.style.display = "block";
                            conceptBtns.style.display = "flex";

                            let sameClub = controller._fsu?.sameClub;
                            if (!sameClub) {
                                sameClub = events.createButton(
                                    new UTStandardButtonControl(),
                                    fy("substitution.sameclub"),
                                    (e) => {
                                        let criteria = {};
                                        let currentSolt = controller.viewmodel.current();
                                        if(currentSolt.inPossiblePosition){
                                            criteria._position = currentSolt.generalPositionName;
                                        }
                                        if(!currentSolt.item.isSpecial()){
                                            criteria.rarities = [0, 1];
                                        }
                                        criteria.club = currentSolt.item.teamId;
                                        criteria.league = currentSolt.item.leagueId;
                                        criteria.clubSearchType = ItemSearchFeature.CONCEPT;
                                        events.SBCDisplayPlayers(controller, null, null, criteria)
                                    },
                                    ""
                                );
                            }
                            conceptBtns.appendChild(sameClub.getRootElement()); 
                            
                            let sameNationAndLeague = controller._fsu?.sameNationAndLeague;
                            if (!sameNationAndLeague) {
                                sameNationAndLeague = events.createButton(
                                    new UTStandardButtonControl(),
                                    fy("substitution.samenationandleague"),
                                    (e) => {
                                        let criteria = {};
                                        let currentSolt = controller.viewmodel.current();
                                        if(currentSolt.inPossiblePosition){
                                            criteria._position = currentSolt.generalPositionName;
                                        }
                                        if(!currentSolt.item.isSpecial()){
                                            criteria.rarities = [0, 1];
                                        }
                                        criteria.nation = currentSolt.item.nationId;
                                        criteria.league = currentSolt.item.leagueId;
                                        criteria.clubSearchType = ItemSearchFeature.CONCEPT;
                                        events.SBCDisplayPlayers(controller, null, null, criteria)
                                    },
                                    ""
                                );
                            }
                            conceptBtns.appendChild(sameNationAndLeague.getRootElement()); 


                            //假想球员直接购买按钮
                            if(info.set.sbc_conceptbuy){
                                let buyConcept = controller._fsu?.buyConcept;
                                if(!buyConcept){
                                    buyConcept = events.createButton(
                                        new UTGroupButtonControl(),
                                        fy("conceptbuy.btntext"),
                                        (e) => {
                                            events.buyConceptPlayer([item]);
                                        },
                                        "accordian"
                                    )
                                    buyConcept.setSubtext("--");
                                    buyConcept.displayCurrencyIcon(!0);
                                    controller._fsu.buyConcept = buyConcept;
                                }
                                if(events.getCachePrice(defId, 3)){
                                    buyConcept.setSubtext(events.getCachePrice(defId,1).num);
                                }
                                panelView.__itemActions.prepend(buyConcept.getRootElement())
                            }
                        }

                    }
                }
            }
        }

        //26.04 新添加SBC插入球员方式
        events.SBCDisplayPlayers = (controller, fsuCriteria, players, eaCriteria) => {
            let search = new UTSearchCriteriaDTO;
            search.type = SearchType.PLAYER;

            if(eaCriteria){
                _.forEach(eaCriteria, (value, key) => {
                    if (_.has(search, key)) {
                        search[key] = value;
                    }
                });
            }

            let displayPlayers = fsuCriteria
                ? events.getItemBy(2, fsuCriteria)
                : Array.isArray(players) ? players : [];

            let index = controller?.viewmodel?.current()?.index;
            let newController = new UTSelectItemFromClubViewController;
            newController.initWithCriteriaAndSBCChallenge(search, controller.challenge, index);
            if(eaCriteria && _.has(eaCriteria, "clubSearchType")){
                newController.setClubSearchType(eaCriteria.clubSearchType);
            }else{
                newController._fsu = {};
                newController._fsu.displayPlayers = _.uniqBy(displayPlayers, 'id');
                newController._fsu.fsuCriteria = fsuCriteria;
            }
            controller.getNavigationController().pushViewController(newController);
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
        
        //添加fut默认按钮
        events.createButton = (s,t,b,c, style) => {
            const btn = s;
            btn.init();
            btn.addTarget(btn, b.bind(btn), EventType.TAP);
            btn.setText(t);
            if(c){
                const cl = c.split(" ").filter(Boolean);
                for (let ci of cl) btn.getRootElement().classList.add(ci);
            }
            if(style){
                Object.keys(style).forEach(styleName => { btn.getRootElement().style[styleName] = style[styleName]; });
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

        //26.04 默契球员读取
        events.getChemistryPlayers = (controller, targetChemistry) => {
            const players = _.map(controller.squad.getFieldPlayers(), i => {return i.inPossiblePosition ? i.item : {teamId: -1, leagueId: -1, nationId: -1}});
            const idx = controller.viewmodel.current().index;
            const chemistry = events.calculateChemistry(players, idx , true);
            return events.generateCandidateOptions(
                players,
                idx,
                targetChemistry,
                chemistry.meta
            );
        }

        //26.04 生成排列组合
        events.generateCandidateOptions = (players, idx, targetChemistry, meta) => {
            const { nations, leagues, clubs } = meta;

            const result = [];
            const resultKeySet = new Set();

            const pushCandidate = (candidate) => {
                const key = `${candidate.nationId}_${candidate.leagueId}_${candidate.teamId}`;
                if (resultKeySet.has(key)) return true;

                const chem = events.calculateChemistry(players, idx, candidate);
                if (chem.totalChemistry >= targetChemistry) {
                    result.push(candidate);
                    resultKeySet.add(key);
                    return true;
                }
                return false;
            };

            /* ---------- phase 1: 单 nation ---------- */
            const pendingNations = [];
            for (const n of nations) {
                if (!pushCandidate({ nationId: n, leagueId: -1, teamId: -1 })) {
                    pendingNations.push(n);
                }
            }

            /* ---------- phase 2: 单 league ---------- */
            const pendingLeagues = [];
            for (const l of leagues) {
                if (!pushCandidate({ nationId: -1, leagueId: l, teamId: -1 })) {
                    pendingLeagues.push(l);
                }
            }

            const clubLeagueMap = new Map();
            for (const c of clubs) {
                const team = repositories.TeamConfig.getTeam(c);
                if (!team) continue; 
                clubLeagueMap.set(c, team.league);
            }

            const pendingClubs = [];
            for (const c of clubs) {
                const league = clubLeagueMap.get(c);
                if (!pendingLeagues.includes(league)) continue;

                if (!pushCandidate({ nationId: -1, leagueId: league, teamId: c })) {
                    pendingClubs.push(c);
                }
            }

            const successNationLeague = new Map();
            for (const n of pendingNations) {
                for (const l of pendingLeagues) {
                    if (pushCandidate({ nationId: n, leagueId: l, teamId: -1 })) {
                        if (!successNationLeague.has(l)) {
                            successNationLeague.set(l, new Set());
                        }
                        successNationLeague.get(l).add(n);
                    }
                }
            }

            for (const n of pendingNations) {
                for (const c of pendingClubs) {
                    const league = clubLeagueMap.get(c);
                    if (!successNationLeague.get(league)?.has(n)) continue;

                    pushCandidate({
                        nationId: n,
                        leagueId: league,
                        teamId: c
                    });
                }
            }

            return result.map(({ nationId, leagueId, teamId }) => {
                const cleaned = {};

                if (nationId !== -1) cleaned.nationId = nationId;
                if (leagueId !== -1) cleaned.leagueId = leagueId;
                if (teamId !== -1) cleaned.teamId = teamId;

                return cleaned;
            });
        };



        //26.04 默契溢出计算
        events.getChemistryPointsByThreshold = (count, thresholds) => {
            if (count >= thresholds[2]) return 3;
            if (count >= thresholds[1]) return 2;
            if (count >= thresholds[0]) return 1;
            return 0;
        };

        //26.04 快速计算阵容默契值
        events.calculateChemistry = (
            basePlayers,
            index,
            candidate,
            includeMeta = false
        ) => {

            // -------- 参数整理（兼容多种调用方式） --------
            if (typeof index === 'boolean') {
                includeMeta = index;
                index = undefined;
                candidate = undefined;
            } else if (typeof candidate === 'boolean') {
                includeMeta = candidate;
                candidate = undefined;
            }

            const nationCount = {};
            const leagueCount = {};
            const clubCount = {};

            const nationSet = new Set();
            const leagueSet = new Set();
            const clubSet = new Set(); // ✅ 只存 raw teamId

            const getLinkedTeamId = (teamId) =>
                repositories.TeamConfig.teamLinks.get(teamId) || teamId;

            // -------- ① 统计 basePlayers（可排除 index） --------
            basePlayers.forEach((p, i) => {
                if (!p) return;
                if (index !== undefined && i === index) return;

                if (p.nationId !== -1) {
                    nationCount[p.nationId] = (nationCount[p.nationId] || 0) + 1;
                    if (includeMeta) nationSet.add(p.nationId);
                }

                if (p.leagueId !== -1) {
                    leagueCount[p.leagueId] = (leagueCount[p.leagueId] || 0) + 1;
                    if (includeMeta) leagueSet.add(p.leagueId);
                }

                if (p.teamId !== -1) {
                    const linkedTeamId = getLinkedTeamId(p.teamId);
                    clubCount[linkedTeamId] = (clubCount[linkedTeamId] || 0) + 1;

                    if (includeMeta) {
                        clubSet.add(p.teamId); // ✅ 只记录真实 teamId
                    }
                }
            });

            // -------- ② 加 candidate --------
            if (candidate) {
                if (candidate.nationId !== -1) {
                    nationCount[candidate.nationId] =
                        (nationCount[candidate.nationId] || 0) + 1;
                    if (includeMeta) nationSet.add(candidate.nationId);
                }

                if (candidate.leagueId !== -1) {
                    leagueCount[candidate.leagueId] =
                        (leagueCount[candidate.leagueId] || 0) + 1;
                    if (includeMeta) leagueSet.add(candidate.leagueId);
                }

                if (candidate.teamId !== -1) {
                    const linkedTeamId = getLinkedTeamId(candidate.teamId);
                    clubCount[linkedTeamId] =
                        (clubCount[linkedTeamId] || 0) + 1;

                    if (includeMeta) {
                        clubSet.add(candidate.teamId); // ✅ raw
                    }
                }
            }

            // -------- ③ metaId → points --------
            const nationPoints = {};
            const leaguePoints = {};
            const clubPoints = {};

            Object.keys(nationCount).forEach(id => {
                nationPoints[id] = events.getChemistryPointsByThreshold(
                    nationCount[id], [2, 5, 8]
                );
            });

            Object.keys(leagueCount).forEach(id => {
                leaguePoints[id] = events.getChemistryPointsByThreshold(
                    leagueCount[id], [3, 5, 8]
                );
            });

            Object.keys(clubCount).forEach(id => {
                clubPoints[id] = events.getChemistryPointsByThreshold(
                    clubCount[id], [2, 4, 7]
                );
            });

            // -------- ④ 计算 basePlayers chemistry --------
            let totalChemistry = 0;

            basePlayers.forEach((p, i) => {
                if (!p) return;
                if (index !== undefined && i === index) return;

                let chem = 0;

                if (p.nationId !== -1) chem += nationPoints[p.nationId] || 0;
                if (p.leagueId !== -1) chem += leaguePoints[p.leagueId] || 0;
                if (p.teamId !== -1) {
                    chem += clubPoints[getLinkedTeamId(p.teamId)] || 0;
                }

                totalChemistry += Math.min(chem, 3);
            });

            // -------- ⑤ candidate chemistry --------
            let candidateChemistry;

            if (candidate) {
                let chem = 0;

                if (candidate.nationId !== -1) chem += nationPoints[candidate.nationId] || 0;
                if (candidate.leagueId !== -1) chem += leaguePoints[candidate.leagueId] || 0;
                if (candidate.teamId !== -1) {
                    chem += clubPoints[getLinkedTeamId(candidate.teamId)] || 0;
                }

                candidateChemistry = Math.min(chem, 3);
                totalChemistry += candidateChemistry;
            }

            // -------- ⑥ 统一返回 --------
            const result = { totalChemistry };

            if (candidate) {
                result.playerChemistry = candidateChemistry;
            }

            if (includeMeta) {
                result.meta = {
                    nations: Array.from(nationSet),
                    leagues: Array.from(leagueSet),
                    clubs: Array.from(clubSet) // ✅ 真实 teamId
                };
            }

            return result;
        };





        //满足条件球员读取程序
        //26.04 重写方法减少预选范围
        events.SBCSetMeetsPlayers = (controller) => {

            const targetChemistry = controller.squad._fsu.hasChemistry;
            const idx = controller.viewmodel.current().index;
            const playerRating = controller.viewmodel.current().item.rating;
            const excludeList = controller.squad.getPlayers().map(i => {return i.getItem().definitionId}).filter(Boolean);
            const position = controller.viewmodel.current().position.typeId;
            let searchCriteriaList = [];
            let baseCriteria = {
                BTWrating: [playerRating - 10 , playerRating + 10],
                NEdatabaseId: excludeList
            };

            if(targetChemistry){
                const players = _.map(controller.squad.getFieldPlayers(), i => {return i.inPossiblePosition ? i.item : {teamId: -1, leagueId: -1, nationId: -1}});
                const chemistry = events.calculateChemistry(players, idx);

                if(chemistry.totalChemistry < targetChemistry){
                    baseCriteria.possiblePositions = position;
                    let chemistryCriteria = events.getChemistryPlayers(
                        controller,
                        targetChemistry
                    );
                    if(chemistryCriteria.length > 0){
                        searchCriteriaList = chemistryCriteria.map(i => {return {...i, ...baseCriteria}});
                    } else {
                        searchCriteriaList.push(baseCriteria);
                    }
                } else {
                    searchCriteriaList.push(baseCriteria);
                }
            } else {
                if(controller.squad._fsuHasRating){
                    baseCriteria.BTWrating = [playerRating - 5 , playerRating + 5];
                    searchCriteriaList.push(baseCriteria);
                }else{
                    searchCriteriaList.push(baseCriteria);
                }
            }

            let result = _.flatMap(searchCriteriaList, c => {
                return events.getItemBy(2, c);
            });
            result = _.uniqBy(result, 'id');

            //console.log(result)

            
            let newChallenge = events.createVirtualChallenge(controller.challenge);
            let currentList = newChallenge.squad.getPlayers().map(i => {return i.getItem()});
            let resultList = [];
            for (let player of result) {
                currentList[idx] = player;
                newChallenge.squad.setPlayers(currentList);
                if(newChallenge.meetsRequirements()){
                    resultList.push(player)
                }
            }
            return resultList;
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
                    events.navigationAddCount(i, info.task.obj.stat.catNew[i.id]);
                }
                if(_.has(info.task.obj.stat.catExpiry,i.id) && info.task.obj.stat.catExpiry[i.id] !== 0){
                    events.navigationAddCount(i, - info.task.obj.stat.catExpiry[i.id]);
                }
            })
        }


        //25.01 赛季目标
        FCObjectiveSeasonView.prototype.setCampaign = function(n) {
            call.task.seasonSet.call(this,n)
            let playersList = [];
            //25.24 修改奖励信息显示逻辑
            _.forEach(this.levels,i => {
                const rewards = _.flatMap(i.levelRewards, 'rewards');
                const views = i.fcRewardViews;
                if(rewards.length == views.length){
                    _.forEach(rewards,(reward,index) => {
                        if(reward.isPack || (reward.isUtItem && reward.utItem.isPlayerPickItem())){
                            events.setRewardOddo(views[index].getRootElement(),reward);
                        }else if(reward.isPlayer){
                            playersList.push(reward.utItem)
                        }
                    })
                }
            })
            events.loadPlayerInfo(playersList);
        }
        //目标普通任务（非赛季）奖励信息显示
        //24.20 改为使用预估价值
        UTObjectiveCategoryView.prototype.setCategoryGroups = function(i, e, o, n) {
            call.task.objG.call(this ,i, e, o, n)
            let g = this.groups;
            for (let i of g) {
                if(!info.task.obj || !Object.keys(info.task.obj.stat).length){return}
                if(_.includes(info.task.obj.stat.new,i.id)){
                    i.getRootElement().insertBefore(events.createDF(`<div class="fsu-newtips">${fy("task.new")}</div>`), i.getRootElement().firstChild);
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
                        events.waitForClickShieldToHide(() => {
                            try {
                                const cur = cntlr.current(); 
                                if (cur) {
                                    events.init(); // 安全地调用
                                } else {
                                    console.warn("cntlr.current() 为空，跳过初始化");
                                }
                            } catch (e) {
                                console.warn("cntlr.current() 结构未就绪，跳过 events.init()");
                            }
                        });
                    }
                )
                this._fsuGP._parent = this;
                this._fsuSet.__root.after(this._fsuGP.__root);

                events.waitForClickShieldToHide(() => {
                    try {
                        // 尝试访问 currentController，如果不报错说明加载完成
                        const cur = cntlr.current(); // 这里一旦报错就会跳 catch
                        if (cur) {
                            events.init(); // 安全地调用
                        } else {
                            console.warn("cntlr.current() 为空，跳过初始化");
                        }
                    } catch (e) {
                        console.warn("cntlr.current() 结构未就绪，跳过 events.init()");
                    }
                });
            }
        };
        events.reloadPlayers = async(e) =>{
            GM_setValue("players",JSON.stringify({}));
            let current = getAppMain().getRootViewController();
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

        //26.02 HOME添加进化新任务提示
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
                        let z = (iz._filterContainer || iz._searchFilters._filterContainer).searchFilters._collection[f];
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
                let z = (iz._filterContainer || iz._searchFilters._filterContainer).searchFilters._collection[f];
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
                let tempCriterias = _.cloneDeep(o);
                if (
                    !y &&
                    _.size(tempCriterias) === 2 &&
                    _.get(tempCriterias[0], 't.rs') === _.get(tempCriterias[1], 't.rs')
                ) {
                    const [a, b] = tempCriterias;

                    if (_.get(a, 't.gs') === true && !_.has(b.t, 'gs')) {
                        _.set(b, 't.gs', false);
                    } else if (_.get(b, 't.gs') === true && !_.has(a.t, 'gs')) {
                        _.set(a, 't.gs', false);
                    }
                }
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
        events.getAuction = async function(e, defId){
            e.setInteractionState(0);
            e.setSubtext(fy("quicklist.getpriceload"));

            const fbJson = await events.getPriceForFubin(defId);
            let price = fbJson.n;
            let result = await getAuctionPrice(defId, price);
            let priceList = result.map(i => i.buyNowPrice) || [];
            if (result.length == 0) {
                for (let i = 0; i < 5; i++) {
                    price = UTCurrencyInputControl.getIncrementAboveVal(price);
                    console.log(`升价第${i}次循环，当前查询价格${price}`)
                    let tempResult =  await getAuctionPrice(defId, price);
                    tempResult.map(i => {
                        priceList.push(i.buyNowPrice);
                    });
                    if(tempResult.length > 0){
                        break;
                    }
                }
            } else if (result.length == 21) {
                for (let i = 0; i < 5; i++) {
                    price = UTCurrencyInputControl.getIncrementBelowVal(price);
                    console.log(`降价第${i}次循环，当前查询价格${s}`)
                    let tempResult =  await getAuctionPrice(id,s);
                    tempResult.map(i => {
                        priceList.push(i.buyNowPrice);
                    });
                    if(tempResult.length < 21){
                        break;
                    }
                }
            }
            if(priceList.length){
                const priceListJson = _.countBy(priceList);
                const displayPrice = _.fromPairs(
                    _.take(_.toPairs(priceListJson), 3)
                );
                pdb[defId] = Number(_.first(_.keys(displayPrice))).toLocaleString();
                e.setSubtext(pdb[defId]);
                e.displayCurrencyIcon(!0);
                let displayPriceCount = 0;
                _.forEach(displayPrice, (value, key) => { 
                    displayPriceCount++;
                    let displayElement = events.createButton(
                        new UTGroupButtonControl(),
                        `${fy("quicklist.getpricelt")} ${displayPriceCount}`,
                        () => {},
                        "accordian"
                    )
                    displayElement.setInteractionState(0);
                    displayElement.getRootElement().style.fontSize = "87.5%";
                    displayElement.setSubtext(`${Number(key).toLocaleString()} ×${value}`);
                    displayElement.displayCurrencyIcon(!0);
                    e.getRootElement().parentNode.appendChild(displayElement.getRootElement());
                })
            }else{
                e.setSubtext(fy("buyplayer.error.child3").slice(0, -1));
            }
        }
        function getAuctionPrice(i,p){
            return new Promise(res => {
                GM_xmlhttpRequest({
                    method:"GET",
                    url:`https://utas.mob.v5.prd.futc-ext.gcp.ea.com/ut/game/fc26/transfermarket?num=21&start=0&type=player&maskedDefId=${i}&maxb=${p}`,
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
            const configMap = {
                1: {
                    tipsClass: "fsu-cards-buyerror",
                    tipsIcon: "icon_untradeable"
                },
                2: {
                    tipsClass: "fsu-cards-storage",
                    tipsIcon: "icon_sbc"
                },
                3: {
                    tipsClass: "fsu-cards-unassigned",
                    tipsIcon: "icon_undo_discard"
                },
            };
            //type 1:购买失败 2:SBC仓库 3:未分配列表
            const {
                tipsClass,
                tipsIcon,
            } = configMap[type] || configMap[1]; // 默认使用 type=1 配置
            let tipsElement = events.createElementWithConfig("div",{
                classList:["ut-squad-slot-chemistry-points-view","item","fsu-cards",tipsClass]
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
                    searchCriteria.maxBuy = events.getCachePrice(defId,1).num;
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
            // 如果路径不存在则创建，并返回该对象
            const fsu = _.get(e, 'challenge.squad._fsu') || _.set(e, 'challenge.squad._fsu', {});
            
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
                if(fsu && fsu.templatePlan){
                    list = _.reject(list, item => _.includes(fsu.templatePlan, item.id));
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
                        const basicCriteria = events.ignorePlayerToCriteria({});
                        if(squadPos[posIndex] !== null){
                            if(planIndex in planSquad){
                                let player = new UTItemEntity();
                                let planPlayer = planSquad[planIndex];
                                player.definitionId = planPlayer.Player_Resource;
                                player.stackCount = 1;
                                let cachePlayer = _.find(events.getItemBy(2,{...basicCriteria,"definitionId":player.definitionId}));
                                if(cachePlayer){
                                    player = cachePlayer;
                                    ownedPlayer++;
                                }else{
                                    let basePos = _.map(planPlayer.alternativePositions, i => {
                                        return PlayerPosition[i]
                                    })
                                    let preferredPos = PlayerPosition[planPlayer.org_pos];
                                    basePos.push(preferredPos)
                                    player.id = planPlayer.Player_Resource;
                                    player.concept = true;
                                    surplusValue += planPlayer.price;
                                    player._rating = planPlayer.rating;
                                    player.teamId = planPlayer.club;
                                    player.leagueId = planPlayer.league;
                                    player.nationId = planPlayer.nation;
                                    player.preferredPosition = preferredPos;
                                    player.basePossiblePositions = basePos;
                                    player._rareflag = planPlayer.raretype;
                                    if(planPlayer.raretype !== 0){
                                        player.groups.push(4);
                                    }
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

            //26.04 批量替换球员逻辑
            const conceptIndexes = _.flatMap(resultSquad, (v, i) => v?.concept ? [i] : []);
            let ExcludeDefIds = _.map(resultSquad, "databaseId");
            if(conceptIndexes.length){
                console.log("开始尝试替换假想球员！")
                let tempSquad = _.map(resultSquad, i => {return i ? i : new UTItemEntity()});
                let newChallenge = events.createVirtualChallenge(e.challenge);
                newChallenge.squad.setPlayers(tempSquad);
                const sortedConceptIndexes = _.sortBy(
                    conceptIndexes,
                    idx => newChallenge.squad.getPlayer(idx)._chemistry
                );
                for (const index of sortedConceptIndexes) {
                    if (!info.run.template) break;

                    // ===== 添加这一行，让浏览器可以刷新 UI =====
                    await new Promise(r => setTimeout(r, 0));
                    // ========================================

                    let copySquad = _.map(tempSquad, i => i);
                    const conceptPlayer = copySquad[index];

                    const searchMaxRating = Math.min(conceptPlayer.rating + 10, info.set.goldenrange);
                    let searchCriteria = { "NEdatabaseId": ExcludeDefIds, "LTrating": searchMaxRating, lock: false};
                    searchCriteria = events.ignorePlayerToCriteria(searchCriteria);

                    let indexPos = newChallenge.squad.getPlayer(index).generalPosition;

                    events.changeLoadingText([
                        "loadingclose.template3",
                        _.indexOf(sortedConceptIndexes, index) + 1,
                        sortedConceptIndexes.length,
                        PlayerPosition[indexPos]
                    ]);

                    let searchResultsList = _.orderBy(
                        events.getItemBy(2, searchCriteria),
                        [
                            item => item.basePossiblePositions.includes(indexPos),
                            item => item.rating,
                            item => item.teamId === conceptPlayer.teamId,
                            item => item.nationId === conceptPlayer.nationId,
                            item => item.leagueId === conceptPlayer.leagueId
                        ],
                        ['desc', 'asc', 'desc', 'desc', 'desc']
                    );

                    let satisfyPlayers = [];
                    for (let fillPlayer of searchResultsList) {
                        copySquad[index] = fillPlayer;
                        newChallenge.squad.setPlayers(copySquad);

                        if (newChallenge.meetsRequirements()) {
                            satisfyPlayers.push({
                                player: fillPlayer,
                                playerChemistry: newChallenge.squad.getPlayer(index)._chemistry,
                                squadChemistry: newChallenge.squad._chemistry,
                                rating: fillPlayer.rating
                            });
                        }
                    }

                    if (satisfyPlayers.length) {
                        const firstCandidate = _.first(_.orderBy(
                            satisfyPlayers,
                            [
                                item => item.squadChemistry,
                                item => item.playerChemistry,
                                item => item.player.rating
                            ],
                            ['desc', 'desc', 'asc']
                        ));
                        console.log(`${PlayerPosition[indexPos]}第一候选者`, firstCandidate);
                        tempSquad[index] = firstCandidate.player;
                    }
                }

                console.log(`最终阵容`, tempSquad)
                resultSquad = tempSquad;
            }
            
            if(!info.run.template){return};
            await events.saveSquad(e.challenge,e.challenge.squad,resultSquad);
            events.saveOldSquad(e.challenge.squad,false);
            fsu.templatePlan ??= [];
            fsu.templatePlan.push(resultId);

            if(isPhone()){
                cntlr.current().getNavigationController()._eBackButtonTapped()
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
                            
                            events.loadPlayerInfo(ps);
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
                this._fsu ??= {};
                this._fsu.box = events.createElementWithConfig("div", {
                    className: "ut-button-group"
                });
                this._fsu.setBtn = events.createButton(
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
                this._fsu.box.appendChild(this._fsu.setBtn.getRootElement());

                this._fsu.proxyBtn = events.createButton(
                    new UTGroupButtonControl(),
                    fy("apiprroxy.popupt"),
                    async(e) => {
                        events.popup(
                            fy("apiprroxy.popupt"),
                            fy("apiprroxy.popupm"),
                            (t,i) => {
                                if(t === 2){
                                    let v = _.trim(i.getValue());
                                    const urlPattern = /^https:\/\/[^\s/$.?#].[^\s]*$/i;
                                    if (_.isEmpty(v) || urlPattern.test(v)) {
                                        GM_setValue("apiproxy", v);
                                        info.apiProxy = v;
                                        events.notice(fy("notice.setsuccess"), 0);
                                        if (info.apiPlatform !== 1) {
                                            info.apiPlatform = _.isEmpty(v) ? 3 : 2;
                                        }
                                    } else {
                                        // 输入了非空内容但格式错误
                                        events.notice(fy("notice.seterror"), 2);
                                    }
                                }
                            }
                            ,
                            [
                                { labelEnum: enums.UIDialogOptions.OK },
                                { labelEnum: enums.UIDialogOptions.CANCEL }]
                            ,
                            [fy("apiprroxy.placeholder"), info.apiProxy],
                            true
                        )
                    },
                    "more"
                )
                this._fsu.box.appendChild(this._fsu.proxyBtn.getRootElement());
                
                this.__topGroup.after(this._fsu.box);
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
                const price = events.getCachePrice(i.definitionId,1).num;

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
        UTSBCChallengeRequirementsView.prototype.renderChallengeRequirements = function(n, r) {
            call.squad.requirements.call(this,n,r)
            setTimeout(() => {
                const reqItems = this.__requirements?.querySelectorAll("li");
    
                if(reqItems?.length && n?.squadController?._fsu){
                    _.forEach(reqItems, (item, index) => {
                        const btn = n.squadController._fsu[`reqBtn_${index}`];
                        if(btn && !item.hasAttribute("data-el")){
                            item.appendChild(btn.getRootElement());
                            item.setAttribute("data-el", true)
                        }
                    })
                }
            }, 50);
        }
        UTSquadEntity.prototype.swapPlayersByIndex = function(t, e) {
            call.squad.swapPlayers.call(this,t,e)
            events.saveOldSquad(this,true)
        }
        UTSquadEntity.prototype.addItemToSlot = function(t, e) {
            call.squad.addItem.call(this,t,e)
            if(this.isSBC()){
                let op = this._fsu.oldSquad[this._fsu.oldSquadCount][t];
                if(op.definitionId == e.definitionId && op.concept == true){
                    this._fsu.oldSquad[this._fsu.oldSquadCount][t] = e;
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
                const fsu = s._fsu ??= {};
                fsu.oldSquad ??= [];
                fsu.oldSquadCount ??= -1;
                let pl = s.getPlayers().map(i => { return i.getItem()});
                if(fsu.oldSquadCount == -1 || fsu.oldSquad[fsu.oldSquadCount].map( i => { return i.id}).join() !== pl.map( i => { return i.id}).join()){
                    fsu.oldSquadCount++;
                    fsu.oldSquad.push(pl);
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
                    const key = `${ep.id}-${ep.tradable}`;
                    if (!packList.some(plp => `${plp.id}-${plp.tradable}` === key)) {
                        packList.push(ep);
                    }
                    this._fsuPacks[key] ??= (() => {
                        let rawName = services.Localization.localize(ep.packName);
                        const name = ep.tradable ? `*${rawName}` : rawName;
                        return {
                            packId: ep.id,
                            tradable: ep.tradable,
                            count: 0,
                            isPlayers: ep.contentType === 'players',
                            name: events.truncateStrict(name),
                            fullName: name,
                            value: events.getOddo(ep.id)
                        };
                    })();
                    this._fsuPacks[key].count++;
                }
                //console.log(packList, this._fsuPacks)
                showList = _.orderBy(packList, item => events.getOddo(item.id), info.myPacksSort);
            }else{
                const ONE_DAY = 86400; // 秒
                const now = Math.floor(Date.now() / 1000);
                const categoryId = this.getStoreCategory();

                // 25.22 增加新包的new标识
                e.forEach(item => {
                    item.isNew = item.start && now - item.start <= ONE_DAY && categoryId !== 3;
                });

                const sorted = _.orderBy(e, [
                    item => !item.getPrice(GameCurrency.POINTS) && item.getPrice(GameCurrency.COINS) && item.id !== 101,
                    item => item.isNew, // 直接用 isNew 属性
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
                    const packData = repositories.Store.getArticle(item.articleId);
                    
                    // 25.22 添加包的新标签标志
                    if(packData && packData.isNew && !itemElement.querySelector(".fsu-newtips")){
                        let newTips = events.createElementWithConfig("div", {
                            textContent:fy("task.new"),
                            classList:["fsu-newtips"]
                        });
                        itemElement.prepend(newTips);
                        itemElement.style.position = "relative";
                    }


                    if(packCoin && !itemElement.querySelector(".fsu-packprice")){
                        let packCoinBox = document.createElement("p");
                        packCoinBox.classList.add("ut-store-pack-details-view--description","currency-coins","fsu-packprice");
                        packCoinBox.textContent = `${fy("returns.text")}${packCoin.toLocaleString()}`;
                        if(!isPhone()){
                            packCoinBox.style.marginBottom = "0";
                        }
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
                    if(packCoin && !itemElement.querySelector(".fsu-trypack")){itemElement
                        item._fsuTryPack = events.createButton(
                            new UTCurrencyButtonControl(),
                            fy("trypack.button.subtext"),
                            (e) => {
                                e.setInteractionState(0);
                                events.showLoader();
                                events.tryPack(repositories.Store.getArticle(item.articleId));
                                setTimeout(() => {
                                    e.setInteractionState(1);
                                }, 2000);
                            },
                            "fsu-trypack"
                        )
                        item._fsuTryPackBox = document.createElement("div");
                        item._fsuTryPackBox.classList.add("fsu-trypack-box");
                        item._fsuTryPackBox.append(item._fsuTryPack.getRootElement());
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
                                events.raelProbability(packData);
                                setTimeout(() => {
                                    e.setInteractionState(1);
                                }, 2000);
                            },
                            "fsu-raelprod mini"
                        )
                        Object.assign(rp.getRootElement().style, {
                            height: "2rem",
                            lineHeight: "2rem",
                            padding: "0",
                            width: "6rem",
                            flexBasis: "auto",
                            ...(isPhone() && {
                                width: "100%",
                                marginBottom: "1rem",
                            })
                        });

                        item._fsuRealProd = rp;
                        item._fsuExtraInfo.appendChild(item._fsuRealProd.getRootElement())
                    }
                    if(HideAndShow){
                        const packInfo = this._fsuPacks[`${item.articleId}-${!item.__root.classList.contains('is-untradeable')}`];
                        if(packInfo){
                            if (!itemElement.querySelector(".fsu-packcount")) {
                                itemElement.style.position = "relative";
                                let packCount = events.createElementWithConfig("div", {
                                    textContent: packInfo.count,
                                    classList: ['ut-tab-bar-item-notif', 'fsu-packcount'],
                                    style: {
                                        position: "absolute",
                                        top: "1.4rem",
                                        right: "1rem",
                                        width: "1.6rem",
                                        height: "1.6rem",
                                        textAlign: "center",
                                        fontSize: "1.2rem",
                                        lineHeight: "1.7rem",
                                        zIndex: "1",
                                    }
                                });
                                itemElement.appendChild(packCount)
                            }
                            if (packInfo.isPlayers && !itemElement.querySelector(".fsu-bulkopen")) {
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
                    tileBox.style.cssText = "display: flex;background: none; border: none; justify-content: space-between; padding:0;";
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
                classList:"fsu-sbcNeedsTitle"
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
                classList:"fsu-sbcNeedsBody"
            })
            _.forEach(sbcNeeds,(item,index) => {
                let nBoxBodyItem = events.createElementWithConfig("div",{
                    classList:"fsu-sbcNeedsBodyItem"
                })
                let needKeys = ["rating","need","coverage","lack","lackValue"];
                _.forEach(needKeys,(key) => {
                    nBoxBodyItem.appendChild(
                        events.createElementWithConfig("div",{
                            textContent:key == "lackValue" ? item[key].toLocaleString() : item[key],
                            classList:key == "lackValue" ? "currency-coins" : ""
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
                    info.douagain.SBCList = _.filter(info.douagain.SBCList, SBCId => {
                        const set = services.SBC.repository.getSetById(SBCId);
                        return set && !set.isComplete();
                    });
                    info.douagain.SBCList = info.douagain.SBCList.slice(0, info.set.headentrance_number);
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
                GM_setValue("sbclist",JSON.stringify(info.douagain.SBCList));
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
        const UTSVCEOP_CALL= UTStoreViewController.prototype.eOpenPack;
        UTStoreViewController.prototype.eOpenPack = function(p, e, t) {
            UTSVCEOP_CALL.call(this,p, e, t)
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
                if(fastInfo && fastCount >= 1){
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
                
                const preciousCount = left.getView().slotViews.slice(0, 11).reduce((acc, view) => {
                    return acc + (view?.getItemView()?._fsu?.priceItem.classList.contains('precious') ? 1 : 0);
                }, 0);

                if(preciousCount > 0){
                    events.popup(
                        fy("valuableplayer.popupt"),
                        fy(["valuableplayer.popupm", preciousCount]),
                        (t) => {
                            if (t == 44408) {
                                call.squad.submit.call(controller, e);
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
            }

            let controller = this;
            let pIds = _(this._squad.getFieldPlayers())
            .filter(p => p._item.untradeableCount === 0 && p._item.definitionId !== 0)
            .map(p => p._item.definitionId)
            .value();
            let filteredItems = _.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.untradeableCount && _.includes(pIds, item.definitionId));
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
                    const searchView = this?.getParentViewController()?.getPreviousController().getView();
                    const type = this.getParentViewController()._fsuFillType;
                    //25.22 解决同地区假想搜索卡死问题
                    if (![1, 2, 9].includes(type)) {
                        let players = _.clone(this.getParentViewController()._fsuFillArray),
                        sort = _.split(_.replace(_.toLower(SearchSortID[this.getParentViewController()._fsuFillSort]), "rating", "ovr"), '_');

                        //25.21 升降序显示错误问题，尤其是仓库按钮。
                        if (this.getParentViewController()._fsuFillSort == 2) {
                            players = _.orderBy(players, "rating", "desc");
                        }
                        if (searchView && _.isArray(players)) {
                            if (type > 3 && type % 2 == 0) {
                                method = false;
                                let repository = new UTItemRepository();
                                for (const i of players) {
                                    repository.set(i.id, i);
                                }
                                resultPlayers = repository.search(this.searchCriteria);
                            } else if (type % 2 == 1 && type > 1) {
                                method = false;
                                resultPlayers = players;
                            }
                        }
                    }
                }

                if(this?.squad?.isSBC() === true && this?._fsu && this._fsu?.displayPlayers){
                    method = false;
                    resultPlayers = this._fsu.displayPlayers;

                    // 设置头部导航
                    if(isPhone()){
                        this.getNavigationController().setNavigationVisibility(!0, !0)
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
        //26.04 筛选项目重新计算
        UTSelectItemFromClubViewController.prototype.handleItemRetrieval = function(t, e) {
            

            let showItems = t;
            if (this?.squad?.isSBC() === true) {

                //移除阵容中成员
                const baseIds = _.map(this.squad.getPlayers(),"item.databaseId");
                showItems = showItems.filter(
                    i => !baseIds.includes(i.databaseId)
                );

                if(showItems.length){
                    this._fsu ??= {};
                    this._fsu.Players = showItems;

                    //默契度计算
                    const items = _.map(this.squad.getFieldPlayers(), i => {return i.inPossiblePosition ? i.item : {teamId: -1, leagueId: -1, nationId: -1}});;
                    this._fsu.chemistry = {};
                    const baseChemistry = events.calculateChemistry(items, this.slotIndex);
                    const slotPosition = this.squad.getSlot(this.slotIndex).position.typeId;
                    _.forEach(showItems, item => {

                        let chemistry = { squad: baseChemistry.totalChemistry, points: baseChemistry.playerChemistry };

                        if (item.possiblePositions.includes(slotPosition)) {
                            const { totalChemistry: squad, playerChemistry: points } = events.calculateChemistry(items, this.slotIndex, item);
                            chemistry = { squad, points };
                        }

                        this._fsu.chemistry[item.definitionId] = chemistry;
                    });

                    const currentPosition = this.squad.getFormation().getPosition(this.slotIndex);
                    const listControl = {
                        priority: "rating",
                        rating: {
                            type: "sort",
                            visible: true,
                            order: "asc"
                        },
                        chemistry: {
                            type: "sort",
                            visible: true,
                            order: "desc"
                        },
                        position: {
                            type: "filter",
                            id: currentPosition.typeId,
                            name: currentPosition.typeName,
                            visible: true,
                            select: 0,
                        },
                        quality: {
                            type: "filter",
                            visible: true,
                            select: 0
                        },
                        scope: {
                            type: "filter",
                            visible: true,
                            select: 0
                        }
                    };
                    this._fsu.listControl = listControl;

                    //排序计算
                    const { max, min } = showItems.reduce(
                        (acc, { rating }) => {
                            if (rating > acc.max) acc.max = rating;
                            if (rating < acc.min) acc.min = rating;
                            return acc;
                        },
                        { max: -Infinity, min: Infinity }
                    );

                    if(!this.squad._fsu.hasChemistry){
                        listControl.chemistry.visible = false;
                        listControl.chemistry.order = null;
                    } else {
                        listControl.priority = "chemistry";
                    }
                    
                    if(max == min){
                        listControl.rating.visible = false;
                        listControl.rating.order = null;
                    } else {
                        const hasRating = this.squad._fsuHasRating;
                        if(hasRating !== 0){
                            if(max - hasRating < min - hasRating){
                                listControl.rating.order = "desc";
                            }
                        }
                    }
                    
                    //LT和GT强制修正顺序
                    if(this._fsu?.fsuCriteria){
                        if(this._fsu.fsuCriteria?.LTrating){
                            listControl.rating.order = "desc";
                        } else if(this._fsu.fsuCriteria?.GTrating){
                            listControl.rating.order = "asc";
                        }
                    }


                    //计算筛选项
                    let hasCurrentPosition = false;
                    let hasOtherPosition = false;

                    let hasBasicQuality = false;
                    let hasOtherQuality = false;
                    let hasStorage = false;

                    for (const i of showItems) {
                        const match = i.possiblePositions.includes(currentPosition.typeId);

                        if (match) {
                            hasCurrentPosition = true;
                        } else {
                            hasOtherPosition = true;
                        }

                        if ([0, 1].includes(i.rareflag)) {
                            hasBasicQuality = true;
                        } else {
                            hasOtherQuality = true;
                        }

                        if (i.pile === ItemPile.STORAGE) {
                            hasStorage = true;
                        }

                        // 所有状态都已确定，可提前退出
                        if (
                            hasCurrentPosition &&
                            hasOtherPosition &&
                            hasBasicQuality &&
                            hasOtherQuality &&
                            hasStorage
                        ) {
                            break;
                        }
                    }


                    listControl.position.visible = hasCurrentPosition && hasOtherPosition;
                    listControl.quality.visible = hasBasicQuality && hasOtherQuality;
                    listControl.scope.visible = hasStorage;


                    //console.log("筛选排序初始化：", listControl)

                    //显示筛选项
                    if (this.view?._list) {

                        const controller = this;
                        let SortFilterBox = events.createElementWithConfig("div", {
                            classList: "fsu-SortFilterBox"
                        })

                        if(listControl.rating.visible){
                            let ratingSort = events.createElementWithConfig("div", {
                                classList: "fsu-SortFilterItem"
                            })
                            ratingSort.appendChild(events.createElementWithConfig("div", {
                                textContent: fy("listfilter.title.rating"),
                                classList: "fsu-SortFilterTitle"
                            }))
                            let ratingSortBtn = events.createButton(
                                new UTStandardButtonControl(),
                                fy(`listfilter.sort.${listControl.rating.order}`),
                                async(e) => {
                                    if(listControl.priority == "rating"){
                                        listControl.rating.order = listControl.rating.order === "asc" ? "desc" : "asc";
                                        e.setText(fy(`listfilter.sort.${listControl.rating.order}`));
                                    }else{
                                        listControl.priority = "rating";
                                        controller._fsu.chemistrySortBtn.removeClass("priority");
                                        e.addClass("priority");
                                    }
                                    events.listSortFilter(controller, listControl)
                                },
                                "accordian fsu-SortFilterBtn"
                            );
                            ratingSort.appendChild(ratingSortBtn.getRootElement());
                            this._fsu.ratingSort = ratingSort;
                            this._fsu.ratingSortBtn = ratingSortBtn;
                            SortFilterBox.appendChild(ratingSort);
                        }
                        
                        if(listControl.chemistry.visible){
                            let chemistrySort = events.createElementWithConfig("div", {
                                classList: "fsu-SortFilterItem"
                            })
                            chemistrySort.appendChild(events.createElementWithConfig("div", {
                                textContent: fy("listfilter.title.chemistry"),
                                classList: "fsu-SortFilterTitle"
                            }))
                            let chemistrySortBtn = events.createButton(
                                new UTStandardButtonControl(),
                                fy(`listfilter.sort.${listControl.chemistry.order}`),
                                async(e) => {
                                    if(listControl.priority == "chemistry"){
                                        listControl.chemistry.order = listControl.chemistry.order === "asc" ? "desc" : "asc";
                                        e.setText(fy(`listfilter.sort.${listControl.chemistry.order}`));
                                    }else{
                                        listControl.priority = "chemistry";
                                        controller._fsu.ratingSortBtn.removeClass("priority");
                                        e.addClass("priority");
                                    }
                                    events.listSortFilter(controller, listControl)
                                },
                                "accordian fsu-SortFilterBtn"
                            );
                            chemistrySort.appendChild(chemistrySortBtn.getRootElement());
                            this._fsu.chemistrySort = chemistrySort;
                            this._fsu.chemistrySortBtn = chemistrySortBtn;
                            if(listControl.priority == "chemistry"){
                                SortFilterBox.prepend(chemistrySort);
                                chemistrySortBtn.addClass("priority");
                            }else{
                                this._fsu.ratingSortBtn.addClass("priority");
                                SortFilterBox.appendChild(chemistrySort);
                            }
                        }

                        if(listControl.position.visible){
                            let positionFilter = events.createElementWithConfig("div", {
                                classList: "fsu-SortFilterItem"
                            })
                            positionFilter.appendChild(events.createElementWithConfig("div", {
                                textContent: fy("listfilter.title.position"),
                                classList: "fsu-SortFilterTitle"
                            }))
                            let positionFilterBtn = events.createButton(
                                new UTStandardButtonControl(),
                                fy(`listfilter.select.all`),
                                async(e) => {
                                    listControl.position.select = listControl.position.select === 0 ? 1 : 0;
                                    let eTitle = listControl.position.select ? ["listfilter.select.position", listControl.position.name] : "listfilter.select.all";
                                    e.setText(fy(eTitle));
                                    events.listSortFilter(controller, listControl)
                                },
                                "accordian fsu-SortFilterBtn"
                            );
                            positionFilter.appendChild(positionFilterBtn.getRootElement());
                            this._fsu.positionFilter = positionFilter;
                            this._fsu.positionFilterBtn = positionFilterBtn;
                            SortFilterBox.appendChild(positionFilter);
                        }

                        if(listControl.quality.visible){
                            let qualityFilter = events.createElementWithConfig("div", {
                                classList: "fsu-SortFilterItem"
                            })
                            qualityFilter.appendChild(events.createElementWithConfig("div", {
                                textContent: fy("listfilter.title.quality"),
                                classList: "fsu-SortFilterTitle"
                            }))
                            let qualityFilterBtn = events.createButton(
                                new UTStandardButtonControl(),
                                fy(`listfilter.select.all`),
                                async(e) => {
                                    let titleSuffix = ["all", "normal", "special"]
                                    listControl.quality.select = (listControl.quality.select + 1) % 3;
                                    e.setText(fy(`listfilter.select.${titleSuffix[listControl.quality.select]}`));
                                    events.listSortFilter(controller, listControl)
                                },
                                "accordian fsu-SortFilterBtn"
                            );
                            qualityFilter.appendChild(qualityFilterBtn.getRootElement());
                            this._fsu.qualityFilter = qualityFilter;
                            this._fsu.qualityFilterBtn = qualityFilterBtn;
                            SortFilterBox.appendChild(qualityFilter);
                        }

                        if(listControl.scope.visible){
                            let scopeFilter = events.createElementWithConfig("div", {
                                classList: "fsu-SortFilterItem"
                            })
                            scopeFilter.appendChild(events.createElementWithConfig("div", {
                                textContent: fy("listfilter.title.scope"),
                                classList: "fsu-SortFilterTitle"
                            }))
                            let scopeFilterBtn = events.createButton(
                                new UTStandardButtonControl(),
                                fy(`listfilter.select.all`),
                                async(e) => {
                                    let titleSuffix = ["all", "storage", "club"]
                                    listControl.scope.select = (listControl.scope.select + 1) % 3;
                                    e.setText(fy(`listfilter.select.${titleSuffix[listControl.scope.select]}`));
                                    events.listSortFilter(controller, listControl)
                                },
                                "accordian fsu-SortFilterBtn"
                            );
                            scopeFilter.appendChild(scopeFilterBtn.getRootElement());
                            this._fsu.scopeFilter = scopeFilter;
                            this._fsu.scopeFilterBtn = scopeFilterBtn;
                            SortFilterBox.appendChild(scopeFilter);
                        }

                        this._fsu.SortFilterBox = SortFilterBox;
                        this.view._list.getRootElement().before(SortFilterBox);

                        events.listSortFilter(this, listControl);
                        return;
                    }
                }

            }

            call.selectClub.handle.call(this, showItems, e);

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
            if(this.hasPackReward && cntlr.current().className == "UTStorePackViewController"){
                cntlr.current().getStorePacks()
                if(repositories.Store.myPacks.length == 0){
                    events.waitForClickShieldToHide(() => {
                        console.log("加载完成，继续执行");
                        if(repositories.Store.myPacks.length){
                            cntlr.current().getView()._navigation.onItemTapped(cntlr.current().getView()._navigation.items[0])
                        }
                    });
                }
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
        // 25.22 等待loading后回调事件
        events.waitForClickShieldToHide = (callback, timeout = 5000) => {
            const start = Date.now();

            const interval = setInterval(() => {
                if (!gClickShield.isShowing()) {
                    clearInterval(interval);
                    callback(); // 执行后续逻辑
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    console.warn("等待 gClickShield 隐藏超时");
                }
            }, 100); // 每 100ms 检查一次
        }
        
        // 25.22 移除进化重复图标问题
        const UTItemEntityGetPlusPlayStyles = UTItemEntity.prototype.getPlusPlayStyles;
        UTItemEntity.prototype.getPlusPlayStyles = function () {
            const result = UTItemEntityGetPlusPlayStyles.call(this);
            return _.uniqWith(result, (a, b) => a.equals(b));
        };
        // 25.22 加速类型计算
        events.getAcceleRate = (player, chem = 3, styleId = player.playStyle) => {
            const height = player.getMetaData().height;
            const gender = player.gender;
            const acceleration = events.getBoostedAttribute(player, styleId, chem, 0);
            const agility = events.getBoostedAttribute(player, styleId, chem, 2);
            const strength = events.getBoostedAttribute(player, styleId, chem, 6);

            let type;
            if (agility >= 80 && (agility - strength) >= 10 && acceleration >= 65 && height <= (gender ? 162 : 182)) {
                type = 'E'; // Explosive 爆发
            }
            else if (strength >= 65 && (strength - agility) >= 4 && acceleration >= 40 && height >= (gender ? 164 : 183)) {
                type = 'L';  // Lengthy 漫长
            }
            else {
                type = 'C';  // Controlled 掌控
            }
            // console.log(player.id, { height, acceleration, agility, strength , styleId} , type);
            return type;
        }
        // 25.22 加速类型介绍弹窗
        events.accelePopup = (player, isLoadMeta) => {
            let sl = services.Localization;
            gClickShield.showShield(EAClickShieldView.Shield.LOADING);
            const currentStyleId = player.playStyle;
            const styleIds = _.range(250, 269);
            
            services.PlayerMetaData.updateItemPlayerMeta([player]).observe(cntlr.current(), function (t, e) {
                t.unobserve(cntlr.current());
                const acceleToGroup = {};
                styleIds.forEach(styleId => {
                    acceleToGroup[styleId] = events.getAcceleRate(player, 3, styleId);
                });
                const acceleResults = _.groupBy(styleIds, styleId => acceleToGroup[styleId]);
                const currentResult = acceleToGroup[currentStyleId];
                _.forEach(
                    document.querySelectorAll(`.fsu-cards-accele[data-defid="${player.definitionId}"]`),
                    el => {
                        if (el.textContent.includes('*')) {
                            el.textContent = currentResult
                        }
                    }
                );
                const currentStyleText = sl.localize(`playstyles.playstyle${currentStyleId}`);
                const currentResultText = fy(`accelerate.type.${currentResult}`);
                const acceleResultsHtml = [];
                _.forEach(acceleResults, (value, key) => {
                    let resultsHtml = `<div style="display: flex; align-items: center; justify-content: flex-start; gap: 0px 10px; flex-flow: row wrap;"><div class="color: white;">${fy(`accelerate.type.${key}`)} : </div>`
                    _.forEach(value,i => {
                        resultsHtml += `<div class="item" style="display: flex; align-items: center;"><div class="playStyle chemstyle${i}" style="font-size: 18px; margin-right: 6px;"></div><div>${services.Localization.localize(`playstyles.playstyle${i}`)}</div></div>`;
                    })
                    resultsHtml += `</div>`;
                    acceleResultsHtml.push(resultsHtml);
                });
                const accelePopupText = `${fy(["accelerate.popupm",currentStyleText,currentResultText])}${acceleResultsHtml.join("<br>")}<br><br><span style="color:#a4a9b4">${fy("accelerate.popupm2")}</span>`;

                
                events.popup(
                    fy("accelerate.popupt"),
                    accelePopupText,
                    (t) => {
                    }
                )
                // console.log(acceleResults, currentResult, accelePopupText);
                
                gClickShield.hideShield(EAClickShieldView.Shield.LOADING);
            })
        }
        events.getBoostedAttribute = function (player, styleId, chem, attrId) {
            const sid = String(styleId);
            const aid = String(attrId);
            const chemKey = info.chemstyle?.[sid]?.[aid];
            const bonus = chemKey ? (info.chemMap?.[String(chem)]?.[chemKey] || 0) : 0;
            return Math.min(99, player.getSubAttribute(attrId).rating + bonus);
        };


        events.createElementWithConfig = (tag, config) => {
            const element = document.createElement(tag);
            Object.keys(config).forEach(key => {
                if (key === 'classList') {
                    const classes = [].concat(config[key]); 
                    classes.forEach(c => element.classList.add(c));
                } else if (key === 'style') {
                    Object.keys(config['style']).forEach(styleName => { element.style[styleName] = config['style'][styleName]; });
                } else if (key === 'attributes') {
                    Object.entries(config.attributes).forEach(([attr, value]) => {
                        element.setAttribute(attr, value);
                    });
                } else if (key === 'var') {
                    Object.keys(config['var']).forEach(styleName => {
                        element.style.setProperty(styleName, config['var'][styleName]);
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
            if(reward.isPack || (reward.isUtItem && reward.utItem && reward.utItem.isPlayerPickItem())){
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
                    if(this._sbcStorageTile){
                        this.addTileStats(this._sbcStorageTile,repositories.Item.numItemsInCache(ItemPile.STORAGE));
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
                this.addTileStats(this._fsuLockTile,_.size(events.getItemBy(1,{"id":info.lock})));
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
            }else if("_fsuInPacks" in this && this._fsuInPacks){
                events.showLoader()
                const index = this.clubViewModel.getIndex()
                if(info.inpacks.defIds.length === 0){
                    
                }
                this.clubViewModel.resetCollection([]);
                this.clubViewModel.addArray(info.inpacks);
                this.clubViewModel.isFull = true;
                this.clubViewModel.setIndex(index)
                this.updateItemList(this.clubViewModel.getPageItems(), 1)
                events.hideLoader()
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
                    let clubPlayers = events.getItemBy(1,{"definitionId": i.definitionId, "upgrades": null},false,repositories.Item.club.items.values());
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
                    let ebody = events.createElementWithConfig("div", {
                        classList: ["fsu-historybox"],
                        style: {
                            display: "grid",
                            gridTemplateColumns: `repeat(${isPhone() ? 1 : 3},minmax(0,1fr))`,
                            gap: "1.2rem"
                        }
                    })
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
        events.getPlayerBodyType = (id, baseId ,overall) => {
            if(overall >= 65){
                return _.get(info.meta.bodyType, id)
                    || _.get(info.meta.bodyType, baseId)
                    || info.meta.baseBodyType;
            }else{
                return 0;
            }
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
            if(prod.rarity.length){
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
                    classList:"fsu-realProdTitle"
                })
                _.times(4, (index) => {
                    if (!prod.eaOddo && index === 1) return;
                    pBoxTiltle.appendChild(
                        events.createElementWithConfig("div",{
                            textContent:fy(`realprob.title_${index + 1}`)
                        })
                    )
                });
                pBox.appendChild(pBoxTiltle);

                let pBoxBody = events.createElementWithConfig("div",{
                    classList:"fsu-realProdBody",
                    style:{
                        height:"auto",
                        maxHeight:"30vh",
                    }
                })
                _.forEach(prod.rarity,(item,index) => {
                    let pBoxBodyItem = events.createElementWithConfig("div",{
                        classList:"fsu-realProdBodyItem"
                    })
                    let prodKeys = ["name", "odds", "count"];
                    if (prod.eaOddo) {
                        prodKeys.splice(1, 0, "ea"); 
                    }
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

            const items = events.jsonToItemEntity(packJson, !pack.tradable);
            if(items){
                console.log(items)
                events.tryPackPopup(pack,_.orderBy(items,["rareflag","rating"],["desc", "desc"]))
            }else {
                events.notice(fy("notice.loaderror") + "player data error",2);
                events.hideLoader();
            }
        }

        //26.02 futnext数据创建为player item
        events.jsonToItemEntity = (json, isUntradeable) => {
            const baseItem = {
                "assetId": 0,
                "assists": 0,
                "attributeArray": [0, 0, 0, 0, 0, 0],
                "baseTraits": [],
                "cardsubtypeid": 2,
                "contract": 7,
                "discardValue": 0,
                "formation": "f3412",
                "gender": 0,
                "id": 0,
                "injuryGames": 0,
                "injuryType": "none",
                "itemState": "free",
                "itemType": "player",
                "lastSalePrice": 0,
                "leagueId": 0,
                "lifetimeAssists": 0,
                "lifetimeStatsArray": [0, 0, 0, 0, 0],
                "loyaltyBonus": 1,
                "marketDataMaxPrice": 0,
                "marketDataMinPrice": 0,
                "nation": 0,
                "owners": 1,
                "pile": 7,
                "playStyle": 250,
                "plusRoles": [],
                "possiblePositions": [],
                "preferredPosition": "",
                "preferredfoot": 1,
                "rareflag": 0,
                "rating": 0,
                "resourceGameYear": 2026,
                "resourceId": 0,
                "skillmoves": 0,
                "statsArray": [0, 0, 0, 0, 0],
                "teamid": 0,
                "timestamp": 0,
                "untradeable": true,
                "weakfootabilitytypecode": 0
            }
            const items = _.map(json.packItem.items, i => _.assign({}, baseItem, {
                assetId: i.id,
                resourceId: i.id,
                rating: i.rating,
                preferredPosition: _.get(_.find(i.positions, { isPreferred: true }), 'name', ''),
                teamid: _.get(i, 'club.id', 0),
                leagueId: _.get(i, 'league.id', 0),
                nation: _.get(i, 'nation.id', 0),
                attributeArray: _.values(i.attributes || {}),
                skillmoves: (i.skills || 1) - 1,
                weakfootabilitytypecode: i.weekFoot ?? 0,
                preferredfoot: i.foot ?? 1,
                possiblePositions: _.map(i.positions, "name"),
                baseTraits: _.map(_.filter(i.traits, { isIcon: false }), 'id'),
                iconTraits: _.map(_.filter(i.traits, { isIcon: true }), 'id'),
                rareflag: _.get(i, 'rarity.id', 0),
                untradeable: isUntradeable
            }));
            let itemFactory = new UTItemEntityFactory;
            if(items && items.length){
                return _.map(items,i => {return itemFactory.createItem(i)});
            }else{
                return false;
            }
        }

        //25.04 模拟开包程序，创建弹窗
        events.tryPackPopup = async(pack,items) => {
            const storeVM = new UTStoreViewModel(repositories.Store.values(), []);
            let tryPackController = new UTStorePackRevealModalListViewController(true, storeVM.getPackById(10301), storeVM);
            tryPackController.init();
            tryPackController.viewmodel.addArray(items);
            tryPackController.onExit.observe(cntlr.current(), function (e, d, i) {
                e.unobserve(cntlr.current())
                if(cntlr.current().className == `UTStorePackViewController`){
                    cntlr.current().isPreviewingPack = !1;
                    cntlr.current().updateViewCategories();
                    cntlr.current().getView().setInteractionState(!0);
                }
                tryPackController.dealloc();
            })
            tryPackController.getView().__list.classList.add("fsu-popupItemList");
            tryPackController.getView().__footerElement.style.display = "none";

            const sumRare = _.map(items,"rareflag")
            const specialRare = _.filter(sumRare, (num) => num >= 2)

            let tryPackFooter = events.createElementWithConfig("footer",{
                style:{
                    marginTop: "1rem"
                }
            });

            let footInfo_1 = document.createElement("div");
            let footInfo_paddingLeft = "0";
            if(_.has(pack,"categoryId") && pack.getPrice(GameCurrency.COINS)){
                footInfo_1.innerHTML = `<span>${fy("trypack.foot.info1_1")}</span><span class="currency-coins">${pack.getPrice(GameCurrency.COINS).toLocaleString()}</span>`
                if(pack.getPrice(GameCurrency.POINTS)){
                    footInfo_1.insertAdjacentHTML('beforeend', `<span class="currency-points" style="padding-left: 0.5rem;">${pack.getPrice(GameCurrency.POINTS).toLocaleString()}</span>`);
                }
                footInfo_paddingLeft = "1rem"
            }
            footInfo_1.insertAdjacentHTML('beforeend', `<span style="padding-left: ${footInfo_paddingLeft};">${fy(["trypack.foot.info1_2",sumRare.length,specialRare.length])}</span>`);
            tryPackFooter.appendChild(footInfo_1);

            let footInfo_2 = events.createElementWithConfig("div",{
                style:{
                    paddingTop: ".2rem"
                }
            });
            footInfo_2.innerHTML = `<span>${fy("trypack.foot.info2_1")}</span>`
            let packOddo = events.getOddo(pack.id);
            footInfo_2.insertAdjacentHTML('beforeend', `<span class="currency-coins">${packOddo.toLocaleString()}</span><span style="padding-left: 1rem;">${fy("trypack.foot.info2_2")}</span><span class="currency-coins trypack-count">0</span><span style="padding-left: 1rem;">${fy("trypack.foot.info2_3")}</span><span class="trypack-diff">0%</span>`);
            tryPackFooter.appendChild(footInfo_2);

            let footInfo_3 = events.createElementWithConfig("div",{
                textContent:fy("trypack.foot.info3"),
                style:{
                    paddingTop: ".2rem",
                    opacity: ".5"
                }
            });
            tryPackFooter.appendChild(footInfo_3);

            let againButton = events.createButton(
                new UTButtonControl(),
                fy("trypack.button.again"),
                async(e) => {
                    tryPackController.getView()._exitBtn._tapDetected()
                    events.showLoader()
                    // 延迟函数
                    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                    // 随机生成 1000 到 2000 毫秒的延迟时间
                    const randomDelay = _.random(500, 1000);
                    await delay(randomDelay);
                    events.tryPack(pack)
                },
                "btn-standard primary mini"
            )
            againButton.getRootElement().style.marginTop = "1rem"
            againButton.getRootElement().style.cursor = "pointer"
            againButton.setInteractionState(0)
            tryPackFooter.appendChild(againButton.getRootElement())

            tryPackController._packoddo = packOddo;
            events.loadPlayerInfo(items,tryPackController)


            tryPackController.getView().getRootElement().appendChild(tryPackFooter);
            gPopupClickShield.setActivePopup(tryPackController);
            console.log(tryPackController, items)
            tryPackController.getView().setHeader(services.Localization.localize(`FUT_STORE_PACK_${pack.id}_NAME_MOBILE`))
            let titleSuffix = events.createElementWithConfig("span",{
                textContent:fy("trypack.popup.suffix"),
                style:{
                    color: "#36b84b",
                    fontWeight: "600"
                }
            });
            tryPackController.getView().__title.appendChild(titleSuffix)
            events.hideLoader();
            setTimeout(() => {
                againButton.setInteractionState(1);
            }, 2000);
        }

        //25.04 模拟开包程序，获取模拟开包后的数据
        //26.02 兼容Pick包的模拟开包
        events.getTryPackData = async (pack) => {
            try {
                let packId, packName, dir, isPick;
                if(_.has(pack,"odds")){
                    packId = pack.id;
                    packName = services.Localization.localize(pack.packName);
                    dir = "pack";
                    isPick = false;
                }else if(pack.isPlayerPickItem()){
                    packId = pack.id;
                    packName = pack.getStaticData().name;
                    dir = "playerpick";
                    isPick = true;
                }else{
                    throw new Error("pack is not valid");
                }
                packName = packName.replace(/\s+/g, '-').replace(/\//g, '&');
                const packOpenResponse = await events.externalRequest("GET",`https://www.futnext.com/${dir}/${packName}/${pack.id}/open`,false,`text/x-component`);
                let textResponse = packOpenResponse;
                if(isPick){
                    const matches = [...textResponse.matchAll(/https:\/\/cdn\.futnext\.com\/player\/(\d+)\.png/g)];
                    return matches.map(m => Number(m[1]));
                }else{
                    let textStart = textResponse.indexOf("packItem");
                    let textEnd = textResponse.indexOf(`"renderItemByDefault`);
                    console.log(textStart,textEnd)
                    let textResult = _.slice(textResponse, textStart, textEnd).join("");
                    textResult = textResult.replace(/\\/g, "")
                    textResult = '{"' + textResult + '}';
                    textResult = textResult.replace(/,\}/g, '}');
                    console.log(JSON.parse(textResult))
                    return JSON.parse(textResult);
                }
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
                let textStart = textResponse.indexOf(`"rarityOdds`);
                let textEnd = textResponse.indexOf(`},\\"returns`);

                let textResult = _.slice(textResponse, textStart, textEnd).join("");

                let step1 = textResult.replace(/\\/g, '');

                const jsonData = JSON.parse(`{${step1}}`);

                let resultJson = {"rarity":[], "rating":[], "eaOddo": false};
                _.forEach(jsonData.rarityOdds,j => {
                    let odds = j.odds * 100;
                    resultJson.rarity.push({
                        id: j.rarity.id,
                        odds: `${odds.toFixed(odds >= 0.1 ? 1 : 2)}%`,
                        count: (1 / j.odds).toFixed(0),
                        name: services.Localization.localize("item.raretype" + j.rarity.id)
                    })
                })
                if(pack.odds.length){
                    resultJson.eaOddo = true;
                    _.forEach(resultJson.rarity,r => {
                        let eaOdds = _.find(pack.odds, (item) => item.description.includes(`${r.name} `));
                        if(eaOdds){
                            r.ea = eaOdds.odds;
                        }else{
                            r.ea = "-";
                        }
                    })
                }
                _.forEach(jsonData.ratingOdds,j => {
                    let odds = j.odds * 100;
                    resultJson.rating.push({
                        rating: j.rating,
                        odds: `${odds.toFixed(odds >= 0.1 ? 1 : 2)}%`
                    })
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
                                    p.untradeableCount = 0;
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
                    events.openPacksResultPopup(popupTitle, popupText, showPlayers, fy("openpack.result.popupm2"));
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
                    //26.02 修改存储仓库的评分为当前仓库最低值
                    const minStorageRating = _.min(_.map(repositories.Item.storage.values(), 'rating'));
        
                    for (const item of openResult.response.items) {
                        const inClub = events.getItemBy(2, { definitionId: item.definitionId , upgrades:null}, false, repositories.Item.club.items.values());
        
                        if (inClub.length) {
                            if (item.rating >= minStorageRating && repositories.Item.numItemsInCache(ItemPile.STORAGE) + toStoragePlayers.length < 100) {
                                item.duplicateId = _.find(inClub).id;
                                item.pile = ItemPile.PURCHASED;
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
        //26.02 调整样式错乱问题
        events.openPacksResultPopup = (title, text, players, desc) => {
            let popupController = new EADialogViewController({
                dialogOptions: [{ labelEnum: enums.UIDialogOptions.OK }],
                message: "",
                title: title,
                type: EADialogView.Type.MESSAGE
            });
            popupController.init();
            popupController.onExit.observe(popupController,(e, z) => {
                e.unobserve(popupController);
                popupController.dealloc();
                if(cntlr.current() instanceof UTStorePackViewController){
                    cntlr.current().getStorePacks(true);
                }
            });
            popupController._fsu = {};
            let popupView = popupController.getView();
            popupView.__msg.remove();
            popupView.__btnContainer.querySelector("button").classList.remove("text");
            popupView.__btnContainer.querySelector("button").classList.add("primary", "mini");
            let popupBox = document.createElement("div");
            if(players.length){
                popupController._fsu.listBox = events.createElementWithConfig("div",{
                    classList: "ut-store-reveal-modal-list-view",
                    style:{
                        borderRadius:"0",
                        padding: "0",
                    }
                })
                popupController._fsu.list = events.createElementWithConfig("ul",{
                    classList: ["itemList", "fsu-popupItemList"]
                })
                popupController._fsu.listBox.appendChild(popupController._fsu.list);

                players.forEach(i => {
                    var o = new UTItemTableCellView;
                    o.setData(i, void 0, ListItemPriority.DEFAULT);
                    o.render();
                    if(!desc && i._playStyles.length){
                        let popupItemOther = events.createElementWithConfig("div", {
                            classList: "fsu-popupItemOther"
                        })
                        let traitBox = events.createElementWithConfig("div", {
                            classList: "fsu-popupItemTrait"
                        })
                        popupItemOther.appendChild(traitBox);
                        _.map(_.orderBy(i._playStyles, [item => item.isIcon ? 0 : 1, 'category'], ['asc', 'asc']), t => {
                            let classList = ["fut_icon", "fsu-traitIcon"]
                            if(t.isIcon){
                                classList.push(`icon_icontrait${t.traitId}`)
                                classList.push("icon")
                            }else{
                                classList.push(`icon_basetrait${t.traitId}`)
                            }
                            traitBox.appendChild(events.createElementWithConfig("i", {
                                classList: classList
                            }))
                        })
                        let popupItemOtherBtn = events.createButton(
                            new UTButtonControl(),
                            fy("sbc.watchplayer"),
                            (e) => {events.openFutbinPlayerUrl(e);},
                            "btn-standard mini"
                        )
                        popupItemOtherBtn.getRootElement().setAttribute("data-id",i.definitionId);
                        popupItemOtherBtn.getRootElement().setAttribute("data-name",`${i.getStaticData().name}`);
                        popupController._fsu[`popupItemOtherBtn_${i.id}`] = popupItemOtherBtn;
                        popupItemOther.appendChild(popupItemOtherBtn.getRootElement());
                        o.__rowContent.appendChild(popupItemOther)
                        popupController._fsu[`popupItemOther_${i.id}`] = popupItemOther;
                    }
                    popupController._fsu.list.appendChild(o.getRootElement())
                    popupController._fsu[`popupItemView_${i.id}`] = o;
                });
                popupBox.appendChild(popupController._fsu.listBox)
            }
            popupController.__text = events.createElementWithConfig("div",{
                textContent: text,
                style:{
                    paddingTop: ".5rem",
                    fontSize: "1rem"
                }
            })
            popupBox.appendChild(popupController.__text)
            if(desc){
                popupController.__desc = events.createElementWithConfig("div",{
                    textContent: desc,
                    style:{
                        paddingTop: ".5rem",
                        fontSize: "1rem",
                        opacity: ".5"
                    }
                })
                popupBox.appendChild(popupController.__desc)
            }
            events.loadPlayerInfo(players, popupView)
            popupView.getRootElement().querySelector(".ea-dialog-view--body").prepend(popupBox);
            popupController._fsu.popupBox = popupBox;
            gPopupClickShield.setActivePopup(popupController);
        }
        
        //26.02 SBC固定挑选包预览添加
        events.fixedPickPopup = async(pickItem) => {
            events.showLoader();
            let pickIdList = await events.getTryPackData(pickItem);
            console.log(pickIdList)
            if(pickIdList && _.size(pickIdList)){
                let searchCriteria = new UTSearchCriteriaDTO;
                searchCriteria.count = 200;
                searchCriteria.defId = pickIdList;
                services.Item.searchConceptItems(searchCriteria).observe(cntlr.current(), function(e, t) {
                    e.unobserve(cntlr.current());
                    if(t.success){
                        if(t.response.items.length){
                            let resultItems = _.filter(t.response.items, item => {
                                if (_.includes(pickIdList, item.definitionId)) {
                                    item.concept = false;
                                    return true;
                                }
                                return false;
                            });
                            console.log(resultItems)
                            events.openPacksResultPopup(pickItem._staticData.description, fy("pickpreview.popupm"), resultItems);
                        }else{
                            events.notice("没有匹配的球员数据，需EA更新！", 2)
                        }
                    } else {
                        events.notice("读取球员数据失败！", 2)
                    }
                    events.hideLoader();
                })
            }
            // const items = events.jsonToItemEntity(pickJson, pickItem.untradeableCount);
            // if(items){
            //     console.log(items)
            // }else {
            //     events.notice(fy("notice.loaderror") + "player data error",2);
            //     events.hideLoader();
            // }
        }

        

        //26.04 添加可开球员tile
        //26.04 添加特殊品质tile
        const UTStoreHubViewController_onPackLoadComplete = UTStoreHubViewController.prototype.onPackLoadComplete;
        UTStoreHubViewController.prototype.onPackLoadComplete = function(e, t) {
            UTStoreHubViewController_onPackLoadComplete.call(this, e, t);
            let view = this.getView();
            if(info.inpacks.defIds.length && !("_fsuInPacksTile" in view)){
                let inPacksTile = new UTTileView();
                inPacksTile.getRootElement().classList.add("col-1-2", "fsu-showPlayerstile");
                inPacksTile.title = fy("inpacktile.title")
                inPacksTile.__tileTitle.after(
                    events.createElementWithConfig("p", {
                        textContent: fy("inpacktile.desc")
                    })
                )
                inPacksTile.fsuImgBox = events.createElementWithConfig("div", {
                    classList: "img-box"
                })
                let imgSrc = _.find(services.Messages.messagesRepository.hubMessages, {goToLink:"gotostore"})?.bodyImagePath || 'https://www.ea.com/ea-sports-fc/ultimate-team/web-app/images/squad/activeSquadTile_squad.png';
                inPacksTile.fsuImgBox.appendChild(
                    events.createElementWithConfig("img", {
                        src: imgSrc
                    })
                )
                inPacksTile.__tileContent.appendChild(inPacksTile.fsuImgBox);
                inPacksTile.fsuCount = new UTLabelView;
                inPacksTile.fsuCount.setRoundedCorner(UTLabelView.Rounded.TOP_RIGHT);
                inPacksTile.fsuCount.setLabel(services.Localization.localize("tile.label.itemCount", [info.inpacks.defIds.length.toString()]));
                inPacksTile.__tileContent.appendChild(inPacksTile.fsuCount.getRootElement())
                view._fsuInPacksTile = inPacksTile;
                view._fsuInPacksTile.addTarget(view,(e) => {
                    events.goToInPacks(this.getNavigationController())
                },EventType.TAP);
                view._fsuInPacksTile.setInteractionState(true);
                view.__hubGrid.appendChild(view._fsuInPacksTile.getRootElement());
            }
            if(_.has(info, 'specialPlayers') && (_.size(_.get(info, 'specialPlayers.dynamic')) + _.size(_.get(info, 'specialPlayers.extraChem')) > 0) && !("_fsuSpecialTile" in view)){
                let specialTile = new UTTileView();
                specialTile.getRootElement().classList.add("col-1-2", "fsu-showPlayerstile", "fsu-specialTile");
                specialTile.title = fy("specialtile.title")
                specialTile.__tileTitle.after(
                    events.createElementWithConfig("p", {
                        textContent: fy("specialtile.desc")
                    })
                )
                specialTile.fsuImgBox = events.createElementWithConfig("div", {
                    classList: "img-box"
                })
                const keys = _.keys(info.specialPlayers.dynamic);
                const randomKeys = _.sampleSize(keys, 3);
                randomKeys.forEach(key => {
                    const img = events.createElementWithConfig("img", {
                        src: AssetLocationUtils.getFilterImage(AssetLocationUtils.FILTER.RARITY, key)
                    });
                    specialTile.fsuImgBox.appendChild(img);
                });
                specialTile.__tileContent.appendChild(specialTile.fsuImgBox);
                specialTile.fsuCount = new UTLabelView;
                specialTile.fsuCount.setRoundedCorner(UTLabelView.Rounded.TOP_RIGHT);
                specialTile.fsuCount.setLabel(services.Localization.localize("tile.label.itemCount", [_.size(info.specialPlayers.dynamic) + _.size(info.specialPlayers.extraChem)]));
                specialTile.__tileContent.appendChild(specialTile.fsuCount.getRootElement())
                view._fsuSpecialTile = specialTile;
                view._fsuSpecialTile.addTarget(view,(e) => {
                    this.getNavigationController().pushViewController(new specialPlayersController());
                },EventType.TAP);
                view._fsuSpecialTile.setInteractionState(true);
                view.__hubGrid.appendChild(view._fsuSpecialTile.getRootElement());
            }
        }

        //26.04 打开包内球员页面
        events.goToInPacks = async(nav) => {
            if(nav){
                if(info.inpacks.players.length === 0){
                    events.showLoader()
                    let allItems = [];
                    let offset = 0;
                    const limit = 200;
                    while (true) {
                        let done = await new Promise(resolve => {
                            let searchCriteria = new UTSearchCriteriaDTO;
                            searchCriteria.count = limit;
                            searchCriteria.offset = offset;
                            searchCriteria.defId = info.inpacks.defIds;
                            searchCriteria.rarities = info.inpacks.rarityIds;

                            services.Item.searchConceptItems(searchCriteria)
                                .observe(cntlr.current(), function (e, t) {
                                    e.unobserve(cntlr.current());
                                    if (!t.success) {
                                        events.notice("读取球员数据失败！", 2);
                                        return resolve(true); // 结束循环
                                    }

                                    const items = t.response.items || [];
                                    allItems.push(...items);

                                    // 若返回数量 < 200，则说明数据读取结束
                                    if (items.length < limit) {
                                        resolve(true);
                                    } else {
                                        offset += limit;
                                        resolve(false);
                                    }
                                });

                        });
                        if (done) break;
                    }

                    if(allItems.length){
                        _.forEach(info.inpacks.defIds, defId => {
                            let player = _.find(allItems, item => { return item.definitionId === defId })
                            if(player){
                                player.concept = false
                                player.isInPacks = true
                                info.inpacks.players.push(player)
                            }
                        })
                    }

                    events.hideLoader();
                }
                var controller = new inPacksController();
                nav.pushViewController(controller);
            }
        }

        //26.04 包内球员界面创建
        const inPacksControllerView = function (t) {
            EAView.call(this);
        };
        JSUtils.inherits(inPacksControllerView, EAView);
        inPacksControllerView.prototype._generate = function _generate() {
            if (!this._generated) {
                this._fsu ??= {};
                let view = events.createElementWithConfig("div", {
                    classList: "fsu-showPlayers"
                })
                let listBox = events.createElementWithConfig("div", {
                    classList: "fsu-showPlayersList"
                })
                const inClub = events.getItemBy(1, {"definitionId": _.map(info.inpacks.players, "definitionId")});
                _.forEach(info.inpacks.players, player => {
                    let itemViewBox = events.createElementWithConfig("div", {
                        classList: "fsu-showPlayersItem"
                    })
                    
                    let itemViewCard = events.createElementWithConfig("div", {
                        classList: "fsu-showPlayersCard"
                    })
                    let itemView = UTItemViewFactory.createLargeItem(player);
                    itemView.init();
                    itemView.render(player);
                    this._fsu[`itemViews_${player.id}`] = itemView;
                    itemViewCard.appendChild(itemView.getRootElement());
                    itemViewBox.appendChild(itemViewCard);

                    

                    let itemViewTrais = events.createElementWithConfig("div", {
                        classList: "fsu-showPlayersTrais"
                    })
                    _.map(_.orderBy(player._playStyles, [item => item.isIcon ? 0 : 1, 'category'], ['asc', 'asc']), t => {
                        let classList = ["fut_icon", "fsu-traitIcon"]
                        if (t.isIcon) {
                            classList.push(`icon_icontrait${t.traitId}`)
                            classList.push("icon")
                        } else {
                            classList.push(`icon_basetrait${t.traitId}`)
                        }
                        itemViewTrais.appendChild(events.createElementWithConfig("div", {
                            classList: classList
                        }))
                    })
                    itemViewBox.appendChild(itemViewTrais);

                    let itemViewBtn = events.createButton(
                        new UTStandardButtonControl(),
                        fy("quicklist.gotofutbin"),
                        (e) => {events.openFutbinPlayerUrl(e);},
                        "call-to-action mini fsu-showPlayersBtn"
                    )
                    itemViewBtn.getRootElement().setAttribute("data-id",player.definitionId);
                    itemViewBtn.getRootElement().setAttribute("data-name",player._staticData.name);
                    this._fsu[`itemViewBtn_${player.id}`] = itemViewBtn;
                    itemViewBox.appendChild(itemViewBtn.getRootElement());

                    if(_.includes(inClub, player.definitionId)){
                        itemViewBox.appendChild(events.createElementWithConfig("div", {
                            classList: "fsu-showPlayersLabel",
                            textContent: fy("player.inclub")
                        }))
                    }

                    listBox.appendChild(itemViewBox);
                    this._fsu.itemBox = itemViewBox;
                })
                view.appendChild(listBox);
                this._fsu.listBox = listBox;
                this.__root = view;
                events.loadPlayerInfo(info.inpacks.players)
                this._generated = !0;
            }
        }
        inPacksControllerView.prototype.dealloc = function () {
            //清除创建的资源
            events.fsuDispose(this, "_fsu")
            this.__root = null;
        }
        const inPacksController = function (t) {
            EAViewController.call(this);
        };
        JSUtils.inherits(inPacksController, EAViewController);
        inPacksController.prototype._getViewInstanceFromData = function () {
            return new inPacksControllerView();
        };
        inPacksController.prototype.viewDidAppear = function () {
            this.getNavigationController().setNavigationVisibility(true, true);
        };
        inPacksController.prototype.getNavigationTitle = function () {
            return fy("inpacktile.title") + `(${info.inpacks.players.length})`;
        };

        //26.04 特殊品质界面创建
        const specialPlayersControllerView = function (t) {
            EAView.call(this);
        };
        JSUtils.inherits(specialPlayersControllerView, EAView);
        specialPlayersControllerView.prototype._generate = function _generate() {
            if (!this._generated) {
                this._fsu ??= {};
                let view = events.createElementWithConfig("div", {
                    classList: "fsu-showPlayers"
                })
                let SL = services.Localization;
                if(_.size(info.specialPlayers.dynamic)){
                    let dynamic = _.map(info.specialPlayers.dynamic, (v, k) => {
                        const id = Number(k);
                        const count = events.getItemBy(1, { _rareflag: id, loans: -1}, repositories.Item.getTransferItems()).length;
                        return { id, count, ...v };
                    });
                    dynamic = _.orderBy(dynamic, ['count', 'exp'], ['desc', 'desc']);
                    
                    let listBox = events.createElementWithConfig("div", {
                        classList: "fsu-showPlayersList"
                    })
                    _.forEach(dynamic, d => {
                        
                        const nameColor = repositories.Rarity.get(d.id).largeColorMaps.get(0).name;

                        let item = events.createElementWithConfig("div", {
                            classList: ["fsu-showPlayersItem", "fsu-showRarity"]
                        })
                        item.appendChild(events.createElementWithConfig("div", {
                            classList: "fsu-showRarityTips",
                            textContent: fy("special.dynamic")
                        }))
                        let card = events.createElementWithConfig("div", {
                            classList: ["fsu-showRarityCard"]
                        })
                        card.appendChild(events.createElementWithConfig("img", {
                            src: AssetLocationUtils.getFilterImage(AssetLocationUtils.FILTER.RARITY, d.id)
                        }))
                        card.appendChild(events.createElementWithConfig("div", {
                            textContent: SL.localize(`item.raretype${d.id}`)
                        }))
                        card.appendChild(events.createElementWithConfig("div", {
                            textContent: d.count,
                            classList: "fsu-showRarityCount",
                            style: {
                                color: `rgba(${nameColor.r},${nameColor.g},${nameColor.b},1)`
                            }
                        }))
                        item.appendChild(card)

                        let infos = events.createElementWithConfig("div", {
                            classList: "fsu-showRarityInfo"
                        })
                        const days = Math.max(0, Math.ceil((d.exp - Date.now()/1000) / (60 * 60 * 24)));
                        const daysText = days ? SL.localize("auctionduration.day.plural", [days]) : SL.localize("academy.timer.slot.expired");
                        
                        let expiry = events.createElementWithConfig("div", {
                            classList: "fsu-showRarityExpiry"
                        })
                        expiry.innerHTML = `<i class="fut_icon icon_timer_expiry"></i><div>${SL.localize("academy.itemdetails.header.enrollment", [daysText])}</div>`;
                        infos.appendChild(expiry);

                        let attrs = events.createElementWithConfig("div", {
                            classList: "fsu-showRarityAttrs"
                        })
                        _.forEach(d.change, (change) => {
                            let attrText = _.map(info.dynamicStats[`${change}`], c => {
                                return SL.localize(c)
                            })
                            attrs.appendChild(events.createElementWithConfig("div", {
                                textContent: attrText.join(" / ")
                            }))
                        })
                        infos.appendChild(attrs);
                        item.appendChild(infos)

                        let btns = events.createElementWithConfig("div", {
                            classList: "fsu-showRarityBtns"
                        })
                        const btnText = d.count > 0 ? fy("player.inclub") + `(${d.count})` : fy("player.noclub");
                        let clubBtn = events.createButton(
                            new UTStandardButtonControl(),
                            btnText,
                            (e) => {
                                let players = _.cloneDeep(events.getItemBy(2, { _rareflag: d.id, BTWrating:[99, 45], loans: -1}, repositories.Item.getTransferItems()));
                                _.forEach(players , p => {
                                    p.storeLoc = true
                                })
                                events.openPacksResultPopup(SL.localize(`item.raretype${d.id}`), fy("special.dynamic.popupm"), players);
                            },
                            "call-to-action mini"
                        )
                        if(d.count === 0){
                            clubBtn.setInteractionState(0);
                        }
                        this._fsu[`clubBtn_${d.id}`] = clubBtn;

                        btns.appendChild(clubBtn.getRootElement())
                        let futbinBtn = events.createButton(
                            new UTStandardButtonControl(),
                            fy("quicklist.gotofutbin"),
                            (e) => {
                                GM_openInTab(`https://www.futbin.com/${d.url}`, { active: true, insert: true, setParent :true });
                            },
                            "call-to-action mini"
                        )
                        btns.appendChild(futbinBtn.getRootElement())
                        this._fsu[`futbinBtn_${d.id}`] = futbinBtn;

                        item.appendChild(btns)
                        listBox.appendChild(item)
                    })
                    view.appendChild(listBox);
                    this._fsu.listBox = listBox;
                }

                if(_.size(info.specialPlayers.extraChem)){
                    let extraChem = _.map(info.specialPlayers.extraChem, (v, k) => {
                        const id = Number(k);
                        const count = events.getItemBy(1, { rareflag: id, loans: -1 }, repositories.Item.getTransferItems()).length;
                        return { id, count, ...v };
                    });
                    extraChem = _.orderBy(extraChem, ['count'], ['desc']);
                    let chemListBox = events.createElementWithConfig("div", {
                        classList: "fsu-showPlayersList"
                    })
                    _.forEach(extraChem, ec => {
                        
                        const chemNameColor = repositories.Rarity.get(ec.id).largeColorMaps.get(0).name;

                        let item = events.createElementWithConfig("div", {
                            classList: ["fsu-showPlayersItem", "fsu-showRarity"]
                        })
                        item.appendChild(events.createElementWithConfig("div", {
                            classList: "fsu-showRarityTips",
                            textContent: fy("special.extrachem")
                        }))
                        let card = events.createElementWithConfig("div", {
                            classList: ["fsu-showRarityCard"]
                        })
                        card.appendChild(events.createElementWithConfig("img", {
                            src: AssetLocationUtils.getFilterImage(AssetLocationUtils.FILTER.RARITY, ec.id)
                        }))
                        card.appendChild(events.createElementWithConfig("div", {
                            textContent: SL.localize(`item.raretype${ec.id}`)
                        }))
                        card.appendChild(events.createElementWithConfig("div", {
                            textContent: ec.count,
                            classList: "fsu-showRarityCount",
                            style: {
                                color: `rgba(${chemNameColor.r},${chemNameColor.g},${chemNameColor.b},1)`
                            }
                        }))
                        item.appendChild(card)

                        let infos = events.createElementWithConfig("div", {
                            classList: "fsu-showRarityInfo"
                        })

                        let attrs = events.createElementWithConfig("div", {
                            classList: "fsu-showRarityAttrs"
                        })
                        _.forEach(info.extraChemKeys, (cKey) => {
                            if(ec[cKey] !== 0){
                                attrs.appendChild(events.createElementWithConfig("div", {
                                    textContent: fy([`special.extrachem.${cKey}`, ec[cKey]])
                                }))
                            }
                        })
                        infos.appendChild(attrs);
                        item.appendChild(infos)

                        let btns = events.createElementWithConfig("div", {
                            classList: "fsu-showRarityBtns"
                        })
                        const btnText = ec.count > 0 ? fy("player.inclub") + `(${ec.count})` : fy("player.noclub");
                        let clubBtn = events.createButton(
                            new UTStandardButtonControl(),
                            btnText,
                            (e) => {
                                let players = _.cloneDeep(events.getItemBy(2, { rareflag: ec.id, BTWrating:[99, 45], loans: -1 }, repositories.Item.getTransferItems()));
                                _.forEach(players , p => {
                                    p.storeLoc = true
                                })
                                events.openPacksResultPopup(SL.localize(`item.raretype${ec.id}`), fy("special.extrachem.popupm"), players);
                            },
                            "call-to-action mini"
                        )
                        if(ec.count === 0){
                            clubBtn.setInteractionState(0);
                        }
                        btns.appendChild(clubBtn.getRootElement())
                        this._fsu[`clubBtn_${ec.id}`] = clubBtn

                        let futbinBtn = events.createButton(
                            new UTStandardButtonControl(),
                            fy("quicklist.gotofutbin"),
                            (e) => {
                                GM_openInTab(`https://www.futbin.com/${ec.url}`, { active: true, insert: true, setParent :true });
                            },
                            "call-to-action mini"
                        )
                        btns.appendChild(futbinBtn.getRootElement())
                        this._fsu[`futbinBtn_${ec.id}`] = futbinBtn

                        item.appendChild(btns)
                        chemListBox.appendChild(item)
                    })
                    view.appendChild(chemListBox);
                    this._fsu.chemListBox = chemListBox;
        
                }
                this.__root = view;
                this._generated = !0;
            }
        }
        const specialPlayersController = function (t) {
            EAViewController.call(this);
        };
        
        specialPlayersControllerView.prototype.dealloc = function () {
            //清除创建的资源
            events.fsuDispose(this, "_fsu")
            this.__root = null;
        }
        JSUtils.inherits(specialPlayersController, EAViewController);
        specialPlayersController.prototype._getViewInstanceFromData = function () {
            return new specialPlayersControllerView();
        };
        specialPlayersController.prototype.viewDidAppear = function () {
            this.getNavigationController().setNavigationVisibility(true, true);
        };
        specialPlayersController.prototype.getNavigationTitle = function () {
            return fy("specialtile.title");
        };


        //26.04 SBC需求处添加快速完成按钮
        const UTSBCRequirementsView_render = UTSBCRequirementsView.prototype.render;
        UTSBCRequirementsView.prototype.render = function(e, t, i, o) {
            UTSBCRequirementsView_render.call(this, e, t, i, o);
            console.log(this, e, t, i, o)
            const sName = `${e.id}#${e.setId}`;
            this._fsu ??= {};
            if(_.has(info.base.fastsbc,sName)){
                const fastInfo = info.base.fastsbc[sName];
                const fastCount = events.fastSBCQuantity(true,_.filter(repositories.Item.getUnassignedItems(), item => item.isPlayer() && item.duplicateId !== 0),fastInfo);
                let fastSbcBtn = this._fsu.fastSbcBtn;
                if(!fastSbcBtn){
                    fastSbcBtn = events.createButton(
                        new UTCurrencyButtonControl(),
                        fy(["fastsbc.sbcbtntext", fastCount]),
                        (z) => {
                            if (info.base.fastsbctips) {
                                events.isSBCCache(z.setId, z.id)
                            } else {
                                events.popup(
                                    fy("fastsbc.popupt"),
                                    fy("fastsbc.popupm"),
                                    (t) => {
                                        if (t === 2) {
                                            info.base.fastsbctips = true;
                                            events.isSBCCache(z.setId, z.id)
                                        }
                                    }
                                )
                            }
                        },
                        "call-to-action mini fsu-challengefastbtn",
                        {
                            marginTop: "1rem"
                        }
                    )
                    this._fsu.fastSbcBtn = fastSbcBtn;
                }
                fastSbcBtn.show();
                fastSbcBtn.setId = e.setId;
                fastSbcBtn.id = e.id;
                fastSbcBtn.setTitle = fy(["fastsbc.sbcbtntext", fastCount]);
                fastSbcBtn.__currencyLabel.innerHTML = events.getFastSbcSubText(fastInfo);
                if(e.isCompleted() || fastCount === 0){
                    fastSbcBtn.setInteractionState(0);
                }
                this._btnConfirm.getRootElement().after(fastSbcBtn.getRootElement())
            }else{
                this._fsu?.fastSbcBtn?.hide();
            }
        }

        //26.04 通知特殊球员信息
        events.noticeSpecialPlayerInfo = (player) => {
            if(info.specialPlayers?.DList?.includes(player.rareflag)){
                const days = Math.max(0, Math.ceil((info.specialPlayers.dynamic[player.rareflag].exp - Date.now()/1000) / (60 * 60 * 24)));
                events.notice(fy(["special.dynamic.notice", fy("special.dynamic"), days]), 1)
            }
            if(info.specialPlayers?.ECList?.includes(player.rareflag)){
                let extraChemInfo = [];
                _.forEach(info.extraChemKeys, key => {
                    let value = info.specialPlayers.extraChem[player.rareflag][key];
                    if(value > 0){
                        extraChemInfo.push(fy([`special.extrachem.${key}`,  value]));
                    }
                })
                events.notice(fy(["special.extrachem.notice", fy("special.extrachem"), extraChemInfo.join("、")]), 1)
            }
        }

        //26.04 位置合并
        events.normalizePositions = positions => {
            const set = _.uniq(positions);
            if (_.includes(set, 'LB') && _.includes(set, 'RB')) {
                _.pull(set, 'LB', 'RB');
                set.push('LRB');
            }
            if (_.includes(set, 'LM') && _.includes(set, 'RM')) {
                _.pull(set, 'LM', 'RM');
                set.push('LRM');
            }
            if (_.includes(set, 'LW') && _.includes(set, 'RW')) {
                _.pull(set, 'LW', 'RW');
                set.push('LRW');
            }
            return set;
        };

        //26.04 新排序和筛选方法
        events.listSortFilter = (controller, config) => {
            console.log(controller, config)
            let players = controller._fsu.Players.filter(p => {
                if (config.position.visible && config.position.select) {
                    if (!p.possiblePositions.includes(config.position.id)) {
                        return false;
                    }
                }
                if (config.quality.visible && config.quality.select) {
                    if (
                        config.quality.select === 1
                            ? p.rareflag >= 2
                            : p.rareflag < 2
                    ) {
                        return false;
                    }
                }
                if (config.scope.visible && config.scope.select) {
                    const pile =
                        config.scope.select === 1 ? ItemPile.STORAGE : ItemPile.CLUB;
                    if (p.pile !== pile) {
                        return false;
                    }
                }
                return true;
            });
            const sortRules = [];

            if (config.chemistry.order) {
                sortRules.push(
                    {
                        key: p => controller._fsu.chemistry[p.definitionId].squad,
                        order: config.chemistry.order
                    },
                    {
                        key: p => controller._fsu.chemistry[p.definitionId].points,
                        order: config.chemistry.order
                    }
                );
            }

            if (config.rating.order) {
                const ratingRule = {
                    key: "rating",
                    order: config.rating.order
                };

                if (config.priority === "rating") {
                    sortRules.unshift(ratingRule);
                } else {
                    sortRules.push(ratingRule);
                }
            }

            sortRules.push(
                { key: "untradeableCount", order: "desc" },
                { key: "rareflag", order: "asc" },
                { key: "pile", order: "desc" },
                { key: "_itemPriceLimits.minimum", order: "asc" },
                { key: "_itemPriceLimits.maximum", order: "asc" }
            );

            players = _.orderBy(
                players,
                sortRules.map(r => r.key),
                sortRules.map(r => r.order)
            );
            
            controller.clubViewModel.resetCollection(players);
            controller.clubViewModel.isFull = true;
            controller.updateItemList(controller.clubViewModel.getPageItems());
        }

        //26.04 销毁释放资源方法
        events.fsuDispose = function (controller, key) {
            const container = controller?.[key];
            if (!container || typeof container !== "object") return;
            Object.keys(container).forEach(k => {
                const v = container[k];
                if (v instanceof EAView) {
                    v.dealloc();
                } else if (v instanceof Element) {
                    v.isConnected && v.remove();
                }

                container[k] = null;
            });
            controller[key] = null;
        };


        //26.04 界面控制器销毁事件
        const EAViewController_dealloc = EAViewController.prototype.dealloc;
        EAViewController.prototype.dealloc = function (...args) {

            //清除创建的资源
            events.fsuDispose(this, "_fsu")

            //EA本身清除资源
            EAViewController_dealloc.call(this, ...args)
        }
        //26.04 界面视图销毁事件
        const EATargetActionView_dealloc = EATargetActionView.prototype.dealloc;
        EATargetActionView.prototype.dealloc = function (...args) {
            //清除创建的资源
            events.fsuDispose(this, "_fsu")

            //EA本身清除资源
            EATargetActionView_dealloc.call(this, ...args)
        }

        //26.04 卡片销毁事件
        const UTPlayerItemView_dealloc = UTPlayerItemView.prototype.dealloc;
        UTPlayerItemView.prototype.dealloc = function (...args) {

            //清除创建的资源
            events.fsuDispose(this, "_fsu")

            //EA本身清除资源
            UTPlayerItemView_dealloc.call(this, ...args)
        }

        //26.04 阵容选择位置
        events.squadPositionSelection = async(controller, criteria, players) => {
            let squadController = controller;
            //手机端关闭弹窗
            if (isPhone()) {
                //等待书写
            }

            let vacancySlot = _.find(controller._squad.getNonBrickSlots(), slot => !slot.isValid() && !slot.isBrick());
            if(vacancySlot){
                let selectSlotIndex = vacancySlot.index;
                controller.getView().slotViews[selectSlotIndex]._tapDetected()
            }else{
                let currentSelected = controller.getView().getSelectedSlot();
                if(!currentSelected){
                    let selectSlotIndex = _.find(squadController._squad.getNonBrickSlots())?.index;
                    let conceptSlot = _.find(controller._squad.getNonBrickSlots(), slot => slot.isValid() && slot.item.concept);
                    if(conceptSlot){
                        selectSlotIndex = conceptSlot.index;
                    }
                    controller.getView().slotViews[selectSlotIndex]._tapDetected()
                    
                }else{
                    currentSelected._tapDetected()
                }
            }

            

            let attempts = 0;
            const maxAttempts = 20; // 最多尝试 50 次 (约 5 秒)
            while (!((isPhone() ? cntlr.current().currentController : cntlr.right()) instanceof UTSlotDetailsViewController)) {
                if (attempts >= maxAttempts) {
                    console.error("等待超时：目标控制器未出现");
                    return; // 或者抛出错误
                }
                attempts++;
                await events.wait(0.3, 0.3);
            }

            events.SBCDisplayPlayers((isPhone() ? cntlr.current().currentController : cntlr.right()) , criteria, players)
        };


        //26.04 进化增加属性显示
        const UTAcademySlotItemDetailsViewController_renderPopulatedSlot = UTAcademySlotItemDetailsViewController.prototype.renderPopulatedSlot;

        UTAcademySlotItemDetailsViewController.prototype.renderPopulatedSlot = function (e) {
            UTAcademySlotItemDetailsViewController_renderPopulatedSlot.call(this, e);

            const playerId = e.player.id || e.realPlayerId;
            if(playerId <= 0){
                return;
            }
            const index = this.viewmodel.getSelectedLevelIndex();
            const award = _.orderBy(index == 0 ? e.getAllSlotRewards() : e.levels[index - 1].awards,"type");
            const player = index == 0 ? _.last(e.levels).boostedPlayer : e.levels[index - 1].boostedPlayer;
            const boost = index == 0 || index == 1 ? repositories.Item.club.getItem(ItemType.PLAYER, false, playerId) : e.levels[index - 2].boostedPlayer;
            const controller = this;
            this._fsu ??= {};

            const renderUI = () => {
                _.forEach(award, a => {
                    if (a.type >= AcademyStatEnum.PACE && a.type <= AcademyStatEnum.GK_SUB_POSITIONING_SUB) {
                        const titleText = UTAcademyUtils.mapAttributeIdToLocString(a.type);
                        const value = UTAcademyUtils.getPlayerFinalStatValue(player, a);
                        const state = e.levels[a.level - 1].status;
                        let addedText = "no";

                        const sub = _.find(this.panel.upgradeList, i => {
                            return i.__title?.innerText == titleText && !i.__deltaValue.hasAttribute("data-up")
                        })
                        if(sub){
                            let subText = "";
                            if(state === AcademySlotLevelState.COMPLETED){
                                subText = "√"
                            }else{
                                const boostValue = UTAcademyUtils.getPlayerFinalStatValue(boost, a);
                                const plusValue = value - boostValue;
                                if(plusValue > 0){
                                    subText = `${boostValue}+<span>${plusValue}</span>`;
                                }else{
                                    subText = "+0"
                                }
                                plusValue > 0 && (addedText = "added") && a.type <= AcademyStatEnum.PHYSICALITY && (addedText += "Main");
                            }
                            let addValue = events.createElementWithConfig("div",{
                                classList: "fsu-academyAttribute"
                            })
                            addValue.appendChild(
                                events.createElementWithConfig("span", {
                                    innerHTML: `(${subText})`,
                                    classList: "fsu-academyAttributeIncrease"
                                })
                            );
                            addValue.appendChild(
                                events.createElementWithConfig("span", {
                                    textContent: value,
                                    classList: ["fsu-academyAttributeValue", addedText]
                                })
                            );

                            sub.__deltaValue.appendChild(addValue);
                            this._fsu["add_" + a.type] = addValue;
                            sub.__deltaValue.setAttribute("data-up", 1)
                        }
                    }
                });
            };

            // --- 2. 控制执行顺序 ---
            if (!repositories.PlayerMeta.get(boost.definitionId)) {
                services.PlayerMetaData.updateItemPlayerMeta([boost]).observe(controller, function (t, e) {
                    t.unobserve(controller);
                    boost.setMetaData(repositories.PlayerMeta.get(boost.definitionId));
                    renderUI();

                    //重置右侧属性
                    if(!isPhone()){
                        const rightFsu = cntlr.right()?.getView()?._list?._fsu;
                        if(rightFsu){
                            const attrBox = rightFsu[`attrBox_${boost.id}`];
                            if(attrBox){
                                const academyAttr = _.find(info.academy, { id: controller.viewmodel.selectedSlotId });
                                const attrMap = events.academyAttrToList(events.academyAddAttr(academyAttr.attr, academyAttr.isGK, boost).map);
                                attrBox.innerHTML = "";
                                attrBox.appendChild(events.academyAddAttrOutput(attrMap));
                                if(attrMap.size === 0){
                                    attrBox.querySelector(".academyBoostsBox").style.opacity = "0.5";
                                }
                            }
                        }
                    }
                });
            } else {
                renderUI();
            }
        };

        //26.04 修复EA本身的子属性计算错误问题
        const UTItemAcademyStatEntity_getSubAttributeOverride = UTItemAcademyStatEntity.prototype.getSubAttributeOverride;
        UTItemAcademyStatEntity.prototype.getSubAttributeOverride = function(e) {
            const matches = _.filter(this.subattributes, { type: e });
            if (matches.length === 1) {
                return UTItemAcademyStatEntity_getSubAttributeOverride.call(this, e);
            } else if (matches.length > 1) {
                const maxItem = _.maxBy(matches, 'rating');
                return maxItem;
            }
        }

        //26.04 修复EA本身的主属性计算错误问题
        const UTItemAcademyStatEntity_getAttributeOverride = UTItemAcademyStatEntity.prototype.getAttributeOverride;
        UTItemAcademyStatEntity.prototype.getAttributeOverride = function(e) {
            const matches = _.filter(this.attributes, { type: e });
            if (matches.length === 1) {
                return UTItemAcademyStatEntity_getAttributeOverride.call(this, e);
            } else if (matches.length > 1) {
                const maxItem = _.maxBy(matches, 'rating');
                return maxItem;
            }
        }

        //26.04 判断是否是珍贵球员
        events.isPrecious = (rating, flag, price, type) => {
            
            if((Number(flag) === ItemRarity.NONE || Number(flag) === ItemRarity.RARE) && type === 0){
                if(price == 0 || _.gte(price, 2 * info.base.price[rating])){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }

        //26.04 SBC初始化需求内容
        const UTSBCSquadOverviewViewController_initWithSBCSet = UTSBCSquadOverviewViewController.prototype.initWithSBCSet;
        UTSBCSquadOverviewViewController.prototype.initWithSBCSet = function (...args) {
            UTSBCSquadOverviewViewController_initWithSBCSet.call(this, ...args);
            if(this._challenge){
                console.log(this._challenge)
                this._challenge.squadController = this;
                const thisController = this;
                this._fsu ??= {};
                let hasChemistry = 0, hasRating = 0, exactRating = 0;
                this._challenge.eligibilityRequirements.forEach((req, index) => {
                    let reqKey = req.getFirstKey();
                    let reqValue = req.getValue(reqKey);
                    let criteria = {};
                    switch (reqKey) {
                        case SBCEligibilityKey.CLUB_ID:
                            let teamId = [];
                            let teamLinks = Array.from(repositories.TeamConfig.teamLinks);
                            _.map(reqValue, tId => {
                                let tLinks = _.find(teamLinks, pair => pair.includes(tId));
                                if (tLinks) {
                                    teamId.push(...tLinks);
                                } else {
                                    teamId.push(tId);
                                }
                            })
                            criteria.teamId = teamId;
                            break;
                        case SBCEligibilityKey.LEAGUE_ID:
                            criteria.leagueId = reqValue;
                            break;
                        case SBCEligibilityKey.NATION_ID:
                            criteria.nationId = reqValue;
                            break;
                        case SBCEligibilityKey.PLAYER_RARITY:
                            criteria.rareflag = reqValue;
                            break;
                        case SBCEligibilityKey.PLAYER_MIN_OVR:
                            criteria.GTrating = reqValue;
                            break;
                        case SBCEligibilityKey.PLAYER_RARITY_GROUP:
                            criteria.groups = reqValue;
                            break;
                        case SBCEligibilityKey.PLAYER_EXACT_OVR:
                            criteria.rating = reqValue;
                            exactRating = reqValue;
                            break;
                        case SBCEligibilityKey.TEAM_RATING:
                            const rating = [reqValue].flat()[0];
                            if (Number.isFinite(rating)) hasRating = rating;
                            break;
                        case SBCEligibilityKey.CHEMISTRY_POINTS:
                            const chme = [reqValue].flat()[0];
                            if (Number.isFinite(chme)) hasChemistry = chme;
                            break;
                        default:
                            break;
                    }
                    if(_.size(criteria)){
                        this._fsu[`reqBtn_${index}`] = events.createButton(
                            new UTImageButtonControl(),
                            "",
                            (e) => {
                                events.squadPositionSelection(
                                    thisController,
                                    criteria,
                                    null
                                )
                            },
                            "filter-btn fsu-eligibilitysearch"
                        )
                    }
                })
                Object.assign(this._fsu, { hasChemistry, hasRating , exactRating});
                if(this?._squad){
                    this._squad._fsu ??= {};
                    Object.assign(this._squad._fsu, { hasChemistry, hasRating , exactRating});
                }

                //批量购买假想球员生成
                this._fsu.bulkBuyBtn = events.createButton(
                    new UTStandardButtonControl(),
                    fy("bibconcept.btntext"),
                    (e) => {
                        let conceptPlayers = _.map(_.filter(thisController._squad.getPlayers(), slot => {
                            return slot.item.concept;
                        }),"item");
                        if(isPhone() && !(cntlr.current() instanceof UTSBCSquadOverviewViewController)){
                            cntlr.current().parentViewController._eBackButtonTapped();
                        }
                        setTimeout(() => {
                            events.buyConceptPlayer(conceptPlayers);
                        },500);
                    },
                    "mini call-to-action",
                    {
                        width: 'calc(100% - 2rem)',
                        marginLeft: '1rem',
                        marginRight: '1rem',
                    }
                )

                //方案填充按钮
                if(info.set.sbc_template){
                    this._fsu.fillSquadBtn = events.createButton(
                        new UTStandardButtonControl(),
                        fy("sbc.squadfill"),
                        (e) => {
                            if (info.set.sbc_templatemode) {
                                events.popup(
                                    fy("consult.popupt"),
                                    fy("consult.popupm"),
                                    (t,i) => {
                                        if(t === 2){
                                            let v = i.getValue();
                                            if(v == ""){
                                                events.getTemplate(e,1);
                                            }else{
                                                const patterns = {
                                                    gg: /(?:squad-builder\/|^)([a-f0-9-]{36})/, // 匹配 UUID 格式
                                                    bin: /(?:squad\/|^)(\d+)/                 // 匹配纯数字 ID
                                                };

                                                const matchGG = v.match(patterns.gg);
                                                const matchBin = v.match(patterns.bin);

                                                if (matchGG) {
                                                    events.getTemplate(e, 3, matchGG[1]);
                                                } else if (matchBin) {
                                                    events.getTemplate(e, 2, matchBin[1]);
                                                } else {
                                                    events.notice("consult.error", 2);
                                                }
                                            }
                                        }
                                    }
                                    ,false,
                                    [fy("consult.placeholder"),""],
                                    true
                                )
                            } else {
                                events.getTemplate(e, 1);
                            }
                        },
                        "call-to-action"
                    )
                    this._fsu.fillSquadBtn.challenge = this._challenge;
                }
                
                //排除球员配置按钮
                this._fsu.ignoreBtn = events.createButton(
                    new UTStandardButtonControl(),
                    fy("playerignore.button"),
                    (e) => {
                        events.ignorePlayerPopup(e.ignoreTextElment);
                    },
                    "mini call-to-action",
                    {
                        width: 'calc(100% - 1rem)',
                        margin: '.5rem auto',
                    }
                )
                this._fsu.ignoreText = events.createElementWithConfig(
                    "div",
                    {
                        textContent: events.getIgnoreText(),
                        style: {
                            fontSize: "12px",
                            color: "#888",
                            textAlign: "center",
                            margin: ".5rem",
                        }
                    }
                )
                this._fsu.ignoreBtn.ignoreTextElment = this._fsu.ignoreText;

                //一键填充
                let oneFillCriteria = events.oneFillCreationGF(this._challenge.eligibilityRequirements,11 - this._squad.getAllBrickIndices().length);

                if(oneFillCriteria.length){

                    //快捷任务进行二次处理
                    let fastSbcNeedInfo = _.cloneDeep(oneFillCriteria);
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

                    //添加快捷任务
                    if(fastSbcNeedInfo.length){
                        let fastJson = {};
                        fastJson[`${this._challenge.id}#${this._challenge.setId}`] = {
                            "g":fastSbcNeedInfo,
                            "t":this._challenge.endTime
                        }
                        console.log(fastJson);

                        const fastSbcName = `${this._challenge.id}#${this._challenge.setId}`;

                        //26.02 自动添加到快捷任务
                        if(!_.has(info.base.fastsbc, fastSbcName)){
                            info.base.fastsbc[fastSbcName] = fastSbcNeedInfo;
                        }
                        
                        const fastSbcStats = _.has(info.base.fastsbc,fastSbcName) ? "del" : "add";
                        this._fsu.fastSbcStatsBtn = events.createButton(
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
                            fastSbcStats == "add" ? "mini call-to-action" : "mini",
                            {
                                width: 'calc(100% - 1rem)',
                                margin: '.5rem auto',
                            }
                        )
                    }

                    if(info.set.sbc_autofill){
                        //一键填充按钮
                        this._fsu.autoFillBtn = events.createButton(
                            new UTStandardButtonControl(),
                            fy("autofill.btntext"),
                            (e) => {
                                let playerList = [], removeIds = [];
                                //24.16 排除球员配置按钮：一键填充严格模式应用
                                if(!info.build.strictlypcik && events.isEligibleForOneFill(oneFillCriteria)){
                                    let criteriaNumber = oneFillCriteria[0].c + oneFillCriteria[1].c;
                                    let getCriteria = {rs:JSON.parse(JSON.stringify(oneFillCriteria[0].t.rs))};
                                    getCriteria = events.ignorePlayerToCriteria(getCriteria);
                                    playerList = events.getItemBy(2,getCriteria,repositories.Item.getUnassignedItems()).slice(0,criteriaNumber);
                                }else{
                                    for (let i of oneFillCriteria) {
                                        let getCriteria = JSON.parse(JSON.stringify(i.t));
                                        getCriteria = events.ignorePlayerToCriteria(getCriteria);
                                        if(removeIds.length){
                                            getCriteria["NEdatabaseId"] = removeIds;
                                        }
                                        getCriteria["lock"] = false;
                                        let result = events.getItemBy(2, getCriteria, repositories.Item.getUnassignedItems());

                                        let cropping = result.slice(0, i.c);
                                        console.log(cropping,_.map(cropping,"rating"))
                                        removeIds = removeIds.concat(cropping.map( i => {return i.databaseId}))
                                        playerList = playerList.concat(cropping)
                                    }
                                }
                                if(playerList.length){
                                    events.playerListFillSquad(thisController._challenge,playerList,2);
                                }else{
                                    e.setInteractionState(0)
                                    events.notice("notice.noplayer",2)
                                }
                            },
                            "call-to-action"
                        )
                        if(events.isEligibleForOneFill(oneFillCriteria)){
                            this._fsu.autoFillBtn.tipsType = 1;
                        }else if(_.size(oneFillCriteria) == 1){
                            if(oneFillCriteria[0].t.rs == 2){
                                this._fsu.autoFillBtn.tipsType = 2;
                            }else{
                                this._fsu.autoFillBtn.tipsType = 3;
                            }
                        }
                    }
                }else if(info.set.sbc_dupfill && repositories.Item.getUnassignedItems().length){

                    //重复球员填充按钮
                    this._fsu.dupFillBtn = events.createButton(
                        new UTStandardButtonControl(),
                        fy("dupfill.btntext"),
                        (e) => {
                            const dupIds = _.map(
                                _.filter(repositories.Item.getUnassignedItems(),
                                    p => p.isDuplicate() && p.isPlayer() && !p.isLimitedUse()
                                ),
                                'duplicateId'
                            );
                            let criteria = {
                                id:dupIds,
                                lock:false
                            }
                            criteria = events.ignorePlayerToCriteria(criteria);
                            let playerlist = events.getItemBy(2,criteria);
                            if(playerlist.length){
                                if(repositories.Item.getUnassignedItems().filter(i => {return i.duplicateId}).length > playerlist.length){
                                    events.notice("notice.dupfilldiff",1)
                                }
                                const slotPlayer = thisController._squad.getPlayers().filter(slot => slot.item.id !== 0).map(slot => slot.item);
                                events.playerListFillSquad(thisController._challenge, slotPlayer.concat(playerlist), 1)
                            }else{
                                e.setInteractionState(0)
                                events.notice("notice.noplayer",2)
                            }
                        },
                        "call-to-action"
                    )
                }
                
                //阵容补全按钮
                if( info.set.sbc_squadcmpl && hasRating){
                    this._fsu.squadCmplBtn = events.createButton(
                        new UTStandardButtonControl(),
                        fy("squadcmpl.btntext"),
                        (e) => {
                            console.log(thisController._challenge)
                            let va = thisController._squad.getNumOfRequiredPlayers() - thisController._squad.getFieldPlayers().filter(i => i.isValid()).length,
                            fillRating = events.needRatingsCount(hasRating, thisController._squad),
                            inputText = fy(va ? "squadcmpl.placeholder" : "squadcmpl.placeholder_zero");

                            if(fillRating.length && fillRating[0].lackRatings.length == 0 && fillRating[0].ratings.length && hasRating){
                                inputText = [fy("squadcmpl.placeholder"),fillRating.length == "0" && va == 0 ? "" : fillRating[0].ratings.join(`,`)];
                            }

                            if(exactRating){
                                inputText = [fy("squadcmpl.placeholder"), hasRating.toString()];
                            }

                            let popupBtns = hasRating && info.set.sbc_top ? [{ labelEnum: enums.UIDialogOptions.OK },{ labelEnum: 44401 },{ labelEnum: enums.UIDialogOptions.CANCEL },] : false;
                            events.popup(
                                fy("squadcmpl.popupt"),
                                fy("squadcmpl.popupm"),
                                (t,i) => {
                                    if(t === 2){
                                        const value = i.getValue(), 
                                        reg = /^\d{2}([+\-]|-\d{2})?(,\d{2}([+\-]|-\d{2})?)*$/,
                                        isValid = reg.test(value);

                                        if (isValid || value === "") {
                                            const ratings = isValid ? value.split(',') : [];
                                            events.showLoader();
                                            const playerlist = events.getRatingPlayers(thisController._squad, ratings);
                                            events.playerListFillSquad(thisController._challenge, playerlist, 2);
                                        } else {
                                            events.notice(fy("squadcmpl.error"), 2);
                                        }
                                    }
                                    if(t === 44401){
                                        thisController._fsu.countRating._tapDetected();
                                    }
                                },
                                popupBtns,
                                inputText,
                                va,
                                fy(va ? "squadcmpl.popupmsup" : "squadcmpl.popupmsupallconcept")
                            )
                            if(fillRating.length && fillRating[0].ratings.length && fillRating[0].lackRatings.length == 0){
                                events.notice(["squadcmpl.simulatedsuccess",`${hasRating}`,`${fillRating[0].existValue.toLocaleString()}`],0)
                            }else if(va && !exactRating){
                                events.notice("squadcmpl.simulatederror",2)
                            }
                        },
                        "call-to-action"
                    )
                }
            }
        }
        events.getIgnoreText = () => {
            let ignoreTextArray = [];
            ignoreTextArray.push(fy(["builder.goldenrange.short",info.set.goldenrange]))
            const options = ["ignorepos","untradeable","league","flag","academy","strictlypcik","firststorage","comprange","comprare"];
            const optionsTextMap = {
                league: () => fy([`builder.league.short`, info.set.shield_league.length]),
                flag: () => fy([`builder.flag.short`, info.set.shield_flag.length]),
                comprange: () => fy([`builder.comprange.short`,info.set.goldenrange]),
                default: (i) => fy(`builder.${i}.short`)
            };
            _.forEach(options,i => {
                if(info.build[i]){
                    const textFunc = optionsTextMap[i] || optionsTextMap.default;
                    ignoreTextArray.push(textFunc(i));
                }
            })
            return ignoreTextArray.join("、");
        }

        //26.04 信息界面按钮载入
        const UTSBCSquadDetailPanelViewController_initWithSBCSet = UTSBCSquadDetailPanelViewController.prototype.initWithSBCSet;
        UTSBCSquadDetailPanelViewController.prototype.initWithSBCSet = function(...args) {
            UTSBCSquadDetailPanelViewController_initWithSBCSet.call(this, ...args);
            console.log(this)
            console.log(this._challenge.squadController)
            const fsu = this._challenge.squadController._fsu;
            const view = this.getView();
            const squadPlayers =  _.map(this._challenge.squad.getFieldPlayers(), "item")
            const rewardElement = view._challengeDetails._groupRewardList.getRootElement();

            //添加假想购买按钮
            if(_.filter(squadPlayers, "concept").length){
                view._challengeDetails.__description.after(fsu.bulkBuyBtn.getRootElement())
            }

            //添加排除球员选项按钮
            if(fsu?.ignoreBtn){
                rewardElement.appendChild(fsu.ignoreBtn.getRootElement())
                if(fsu?.ignoreText){
                    fsu.ignoreBtn.getRootElement().after(fsu.ignoreText)   
                }
            }

            //添加快捷任务状态按钮
            if(fsu?.fastSbcStatsBtn){
                rewardElement.appendChild(fsu.fastSbcStatsBtn.getRootElement())
            }

            const exchangeElement = view._btnExchange.getRootElement();

            if(fsu.hasChemistry === 0){
                //添加一键填充按钮
                if(info.set.sbc_autofill && fsu?.autoFillBtn){
                    exchangeElement.before(fsu.autoFillBtn.getRootElement())
                }

                //添加重复球员填充按钮
                if(info.set.sbc_dupfill && fsu?.dupFillBtn){
                    exchangeElement.before(fsu.dupFillBtn.getRootElement())
                }

                //添加阵容补全按钮
                if(info.set.sbc_squadcmpl && fsu?.squadCmplBtn){
                    exchangeElement.before(fsu.squadCmplBtn.getRootElement())
                }
                
                //非需求默契状态下
                Object.assign(view._btnSquadBuilder.getRootElement().style,{
                    width: 'calc(100% - 1rem)',
                    margin: '.5rem auto'
                });
                view._btnSquadBuilder.addClass("mini");
                rewardElement.appendChild(view._btnSquadBuilder.getRootElement());

                Object.assign(fsu.fillSquadBtn.getRootElement().style,{
                    width: 'calc(100% - 1rem)',
                    margin: '.5rem auto'
                });
                fsu.fillSquadBtn.addClass("mini");
            }

            //添加方案填充按钮
            if(info.set.sbc_template && fsu?.fillSquadBtn){
                view._btnSquadBuilder.getRootElement().after(fsu.fillSquadBtn.getRootElement());
            }
            
            view._challengeDetails.getRootElement().style.backgroundColor = "#222426";
            exchangeElement.parentNode.style.paddingTop = "1rem";
        };

        //26.04 进化属性展示计算
        events.academyAddAttr = (awards, isGk, player) => {
            // ---------- virtual player ----------
            const virtualPlayer = new UTItemEntity(player);

            virtualPlayer.upgrades = _.cloneDeep(player?.upgrades)
                ?? new UTItemAcademyStatEntity({});
            
            player?.definitionId &&
                virtualPlayer.setMetaData(
                    repositories.PlayerMeta.get(player.definitionId)
                );

            // ---------- result containers ----------
            const faceDiffMap = new Map();
            const upgradeResult = {};

            // ---------- helpers ----------
            const addFaceDiff = (faceKey, diff) => {
                faceDiffMap.set(faceKey, (faceDiffMap.get(faceKey) || 0) + diff);
            };

            const pushUpgrade = (type, vo, faceKey, diff) => {
                if (diff <= 0) return;

                upgradeResult[type] ??= [];
                upgradeResult[type].push(vo);
                virtualPlayer.upgrades[type].push(vo);
                addFaceDiff(faceKey, diff);
            };

            // ---------- stat type guards ----------
            const isSubStat = type =>
                (type >= AcademyStatEnum.ACCELERATION && type <= AcademyStatEnum.PENALTIES) ||
                (type >= AcademyStatEnum.GK_SUB_DIVING && type <= AcademyStatEnum.GK_SUB_POSITIONING_SUB);

            const isFaceStat = type =>
                (type >= AcademyStatEnum.PACE && type <= AcademyStatEnum.PHYSICALITY) ||
                (type >= AcademyStatEnum.GK_DIVING && type <= AcademyStatEnum.GK_POSITIONING);

            // ---------- face config ----------
            const faceStatConfig = isGk ? info.attributesGK : info.attributes;

            // ---------- lookup tables (IMPORTANT) ----------
            const subKeyToFaceKey = {};
            const faceIdToFaceKey = {};

            _.forEach(faceStatConfig, (cfg, faceKey) => {
                faceIdToFaceKey[cfg.id] = faceKey;
                cfg.list?.forEach(subKey => {
                    subKeyToFaceKey[subKey] = faceKey;
                });
            });

            // ---------- main loop ----------
            _.forEach(awards, award => {
                const { type, value, maxValue: max = 99 } = award;

                // ---------- sub attribute ----------
                if (isSubStat(type)) {
                    const subKey = UTAcademyUtils.getSubAttributeByUpgradeId(type);
                    const faceKey = subKeyToFaceKey[subKey];
                    if (!faceKey) return;

                    const current = virtualPlayer.getSubAttribute(subKey)?.rating || 0;
                    const target = Math.min(current + value, max);
                    const diff = target - current;

                    pushUpgrade(
                        'subattributes',
                        new UTPlayerSubAttributeVO(subKey, target),
                        faceKey,
                        diff
                    );
                    return;
                }

                // ---------- face attribute ----------
                if (isFaceStat(type)) {
                    const faceId = UTAcademyUtils.getAttributeByUpgradeId(type);
                    const faceKey = faceIdToFaceKey[faceId];
                    if (!faceKey) return;

                    const stat = events.academyUpdataFaceAttr(
                        virtualPlayer,
                        isGk,
                        faceId,
                        value,
                        max
                    );

                    const totalDiff = _.sumBy(_.values(stat.diffs), 'diff');

                    pushUpgrade(
                        'attributes',
                        new UTPlayerAttributeVO(stat.faceKey, stat.targetFace),
                        faceKey,
                        totalDiff
                    );
                }
            });
            console.log(player, virtualPlayer, awards, faceDiffMap, upgradeResult)

            const attrMap = new Map([
                ["ovr", 0], ["ps", 0], ["psplus", 0],
                ["wf", 0], ["sm", 0], ["post", 0], ["role", 0], ["rarity", 0], ["cu", 0]
            ]);

            const attrIds = isGk ? info.attributesGK : info.attributes;

            const baseKeys = new Set(attrMap.keys());
            const dynamicKeys = new Set();

            // 辅助更新函数
            const update = (key, val) => {
                if (!attrMap.has(key) && !baseKeys.has(key)) {
                    dynamicKeys.add(key); // 记录运行时新增 key
                }
                attrMap.set(key, (attrMap.get(key) || 0) + val);
            };

            const isPlayer = player != null;

            const basicPlayStyles = isPlayer ? _.map(player.getBasicPlayStyles(), "traitId") : [];
            const plusPlayStyles = isPlayer ? _.map(player.getPlusPlayStyles(), "traitId") : [];
            const newAddBasicPlayStyles = [];

            _.forEach(awards, reward => {
                const value = reward.value;
                const type = reward.type;
                const playerValue = UTAcademyUtils.getPlayerFinalStatValue(player, reward);
                const max = reward.maxValue || 99;
                const delta = Math.max(
                    0,
                    isPlayer
                        ? Math.min(playerValue + value, max) - playerValue
                        : value
                );

                switch(true){
                    case (type >= AcademyStatEnum.ACCELERATION && type <= AcademyStatEnum.PENALTIES):
                    case (type >= AcademyStatEnum.GK_SUB_DIVING && type <= AcademyStatEnum.GK_SUB_POSITIONING_SUB):
                        const subKey = _.findKey(attrIds, v => _.includes(v.list, UTAcademyUtils.getSubAttributeByUpgradeId(type)))
                        update(subKey, delta);
                        break;
                    case (type >= AcademyStatEnum.PACE && type <= AcademyStatEnum.PHYSICALITY):
                    case (type >= AcademyStatEnum.GK_DIVING && type <= AcademyStatEnum.GK_POSITIONING):
                        
                        const mainKey = _.findKey(attrIds, v => v.id === UTAcademyUtils.getAttributeByUpgradeId(type))
                        if(isPlayer){
                            const stat = events.academyUpdataFaceAttr(player, isGk, UTAcademyUtils.getAttributeByUpgradeId(type), value, max);
                            const totalDiff = _.sumBy(_.values(stat.diffs), 'diff');
                            update(`${mainKey}`, totalDiff);
                        }else{
                            update(`${mainKey}*`, delta * attrIds[mainKey].list.length);
                        }
                        break;
                    case (type >= AcademyStatEnum.FINISHING_FINESSE_SHOT && type <= AcademyStatEnum.GOAL_KEEPER_DEFLECTOR):
                        let traitId = UTAcademyUtils.getTraitByAcademyEnum(type);
                        if(value === 2){
                            if(plusPlayStyles.length < max && !plusPlayStyles.includes(traitId)){
                                update("psplus", 1);
                                plusPlayStyles.push(traitId)
                                if(basicPlayStyles.includes(traitId)){
                                    _.pull(basicPlayStyles, traitId)
                                    if(newAddBasicPlayStyles.includes(traitId)){
                                        _.pull(newAddBasicPlayStyles, traitId)
                                        update("ps", -1);
                                    }
                                }
                            }
                        }else{
                            if(basicPlayStyles.length < max && !basicPlayStyles.includes(traitId)){
                                update("ps", 1);
                                basicPlayStyles.push(traitId)
                                newAddBasicPlayStyles.push(traitId);
                            }
                        }
                        break;
                    case type === AcademyStatEnum.OVR:
                        update("ovr", delta);
                        break;
                    case type === AcademyStatEnum.RARITY:
                        (!isPlayer || player.rareflag !== value) && attrMap.set("rarity", 1);
                        break;
                    case (type >= AcademyStatEnum.CB && type <= AcademyStatEnum.CF):
                        (!isPlayer || !player.possiblePositions.includes(UTAcademyUtils.mapEvolutionStatToPlayerPosition(type))) && update("post", 1);
                        break;
                    case type === AcademyStatEnum.WEAK_FOOT:
                        update("wf", delta);
                        break;
                    case type === AcademyStatEnum.SKILL_MOVES:
                        update("sm", delta);
                        break;
                    case type === AcademyStatEnum.COSMETIC_UPGRADE:
                        attrMap.set("cu", 1);
                        break;
                    case (type >= AcademyStatEnum.GK_GOALKEEPER && type <= AcademyStatEnum.LW_PLR4):
                        let shouldUpdate = true;
                        if (isPlayer) {
                            const roleId = UTAcademyUtils.getPlayerRoleFromAcademyStatEnum(type);
                            const posId = UTAcademyUtils.mapEvolutionStatToPlayerPosition(type);
                            shouldUpdate =
                                (value === AcademyTacticRoleBonusValue.PLUS_PLUS &&
                                    !player.getPlusPlusRoles().some(r => r.type === roleId && r.position === posId)) ||
                                (value === AcademyTacticRoleBonusValue.PLUS &&
                                    !player.getPlusRoles().some(r => r.type === roleId && r.position === posId));
                        }
                        shouldUpdate && update("role", 1);
                        break;
                    default:
                        break;
                }
            });
            const result = new Map();
            result.set("ovr", attrMap.get("ovr"));
            let statCount = 0;
            for (const key of dynamicKeys) {
                result.set(key, attrMap.get(key));
                statCount += attrMap.get(key);
            }
            for (const [key, val] of attrMap) {
                if (key !== "ovr" && !dynamicKeys.has(key)) {
                    result.set(key, val);
                }
            }
            return {
                map: new Map([...result].filter(([_, v]) => v !== 0)),
                count: statCount
            };
        };

        //26.04 进化属性输出
        events.academyAddAttrOutput = (attrMap) => {
            let notShowNumber = ["rartiy", "cos"];
            let box = events.createElementWithConfig("div",{
                className: "academyBoostsBox"
            });
            if(attrMap.size > 0){
                let hasMain = false;
                for (const [key, value] of attrMap) {
                    let keyText = key;
                    let textSuffix = notShowNumber.includes(key) ? "" : `<span>${value}</span>`;
                    if (key.endsWith("*")) {
                        keyText = key.replace("*", "");
                        hasMain = true;
                        textSuffix = "*" + textSuffix;
                    }
                    box.appendChild(events.createElementWithConfig("div", {
                        innerHTML: `${fy(`academy.attr.${keyText}`)}${textSuffix}`,
                        className: "academyBoostsItem"
                    }));
                }
                if(hasMain){
                    box.appendChild(events.createElementWithConfig("div", {
                        textContent: fy("academy.attr.maintips"),
                        className: "academyBoostsTips"
                    }));
                }
            }else{
                box.appendChild(events.createElementWithConfig("div",{
                    textContent: fy("academy.attr.not"),
                    className: "academyBoostsItem"
                }));
            }
            return box;
        };
        //26.04 进化属性缩减为列表信息
        events.academyAttrToList = (attrMap) => {
            const excludeKeys = new Set([
                "ovr", "ps", "psplus", "wf", "sm",
                "post", "role", "rarity", "cu"
            ]);

            let main = 0;
            let sub = 0;
            const reordered = new Map();

            // 先统计 + 记录需要删除的 key
            for (const [key, value] of attrMap) {
                if (excludeKeys.has(key)){
                    reordered.set(key, value);
                }else{
                    if (key.includes("*")) {
                        main += value;
                    } else {
                        sub += value;
                    }
                }
            }
            // main* 一定在最前
            if (main !== 0) reordered.set("main*", main);
            if (sub !== 0) reordered.set("sub", sub);
            return reordered;
        };
        //26.04 进化大属性计算
        events.academyUpdataFaceAttr = (
            player,
            isGK,
            faceKey,
            increment,
            maxValue
        ) => {
            const attrConfig = isGK ? info.attributesGK : info.attributes;
            const config = _.find(attrConfig, { id: faceKey });
            if (!config) return {};

            const currentFace = player.getAttribute(faceKey);
            if (currentFace >= maxValue) return {};

            const { list, weight } = config;
            const targetFace = _.min([99, maxValue, currentFace + increment]);
            const ratio = currentFace > 0 ? (targetFace - currentFace) / currentFace : 0;

            // 初始缩放
            let updatedSubs = _.map(list, id => {
                const base = player.getSubAttribute(id)?.rating || 0;
                return _.min([99, Math.floor(base * (1 + ratio) + 0.501)]);
            });

            const calcFace = (subs) => _.sum(_.map(subs, (v, i) => v * weight[i]));
            let currentCalcFace = calcFace(updatedSubs);
            let safe = 0;

            // 补偿循环
            while (Math.floor(currentCalcFace + 0.501) < targetFace && safe < 500) {
                safe++;
                for (let i = 0; i < updatedSubs.length; i++) {
                    if (updatedSubs[i] < 99) {
                        updatedSubs[i]++;
                        currentCalcFace = calcFace(updatedSubs);
                        if (Math.floor(currentCalcFace + 0.501) >= targetFace) break;
                    }
                }
            }

            // 构造返回对象
            const diffs = _.reduce(list, (res, id, idx) => {
                const oldVal = player.getSubAttribute(id)?.rating || 0;
                const newVal = updatedSubs[idx];
                if (newVal !== oldVal) {
                    res[id] = { old: oldVal, new: newVal, diff: newVal - oldVal };
                }
                return res;
            }, {});

            return {
                faceKey,
                targetFace,
                diffs
            };
        };

        //26.04 预览进化属性
        events.academyPreviewEvolutionAttr = (id, controller, player) => {
            const academy = new UTAcademyViewModel(services.Academy);
            academy.setSlots(repositories.Academy.getSlots());
            academy.setSelectedSlot(id);
            services.PlayerMetaData.updateItemPlayerMeta([player]).observe(controller, function (q, w) {
                q.unobserve(controller);
                player.setMetaData(repositories.PlayerMeta.get(player.definitionId));
                academy.getSlotPreview(id, player.id).observe(controller, function (e, t) {
                    if (e.unobserve(controller), t.success && JSUtils.isObject(t.data)) {

                        const selectedAcademy = t.data.updatedSlot;
                        const academyBio = new UTPlayerBioViewController;
                        const boostPlayer = selectedAcademy.levels[selectedAcademy.levels.length - 1].boostedPlayer;
                        selectedAcademy.nowPlayer = player;
                        academyBio.initWithItem(boostPlayer);
                        controller.getNavigationController().pushViewController(academyBio);
                        academyBio.getView().fsuAcademy = selectedAcademy;
                        controller.getNavigationController().setNavigationTitle(selectedAcademy.slotName);

                    } else if (!t.success) {
                        events.notice("eroor!", 0)
                    }
                })
            });
            
        };

        //** 代码结尾 **//

        //** 25.22 加入快捷键监控 */
        // document.addEventListener('keydown', (e) => {
        //     if(_.size(info.keyEvent)){
        //         const keyEvent = info.keyEvent[e.key.toLowerCase()];
        //         if(keyEvent){
        //             console.log(e)
        //             console.log(keyEvent)
        //         }
        //     }
        // })

        //** 25.22 注册快捷键 */
        //isConnected 判断清除节点
        events.hotKeysBind = (className ,element ,isDelete) => {
            const index = _.findIndex(info.keyEvent, { className: className });
            const target = _.find(info.keyEvent, { className: className });
            if (index !== -1) {
                if (element) {
                    target.elements.push(element);
                } else {
                    _.forEach(target.elements, member => {
                        if (_.isFunction(member.dealloc)) {
                            member.dealloc();
                        }
                    });
                    if (isDelete) {
                        info.keyEvent.splice(index, 1);
                    } else {
                        target.elements = [];
                        info.keyEvent.splice(index, 1);
                        info.keyEvent.unshift(target);
                    }
                }
            }
        }

        //26.01 商店页面添加组合包数量显示
        const UTStoreHubView_togglePackTileDisplay = UTStoreHubView.prototype.togglePackTileDisplay;
        UTStoreHubView.prototype.togglePackTileDisplay = function (e) {
            UTStoreHubView_togglePackTileDisplay.call(this, e);
            if(e && repositories.Store.myPacks.length){
                console.log(`组合包数量大于0`)
                this._packsTile.getRootElement().setAttribute("data-num",repositories.Store.myPacks.length);
            }
        };

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
            let a = JSON.parse(GM_getValue("lock_26","[]")),b = [];
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
            GM_setValue("lock_26",JSON.stringify(info.lock));
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
        unsafeWindow.GM_addStyle = GM_addStyle;
    }

    function main(){
        if (_.includes(location.href,"ultimate-team/web-app")) {
            futweb();
        }
        unsafeWindow._ = _;
    }
    main()
})();