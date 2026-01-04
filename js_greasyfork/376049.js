// ==UserScript==
// @name         steam补充包工具
// @namespace    http://tampermonkey.net/
// @version      4.02
// @description  To dear sbeamer!
// @author       逍遥千寻
// @include      http*://steamcommunity.com/*
// @include      http*://store.steampowered.com/*
// @icon         https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/f4/f41c579d01a4e5fa0f4f91d69cb93896b8478ccf_medium.jpg
// @grant        GM_xmlhttpRequest
// steamcn       https://steamcn.com/suid-457526
// steam         https://steamcommunity.com/id/zhangxuerui/
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/376049/steam%E8%A1%A5%E5%85%85%E5%8C%85%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/376049/steam%E8%A1%A5%E5%85%85%E5%8C%85%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

//页面定位：默认 = 1；补充包 = 2 ；app详情 = 3 ; 软锁游戏 = 4 ; 搜索卡牌页面 = 5
let pageLocation = 1;
let currentAppId;
let currentAppName;
//获取cookie，组装存储key
const cookie = document.cookie;
//存储补充包游戏列表信息
const boosterKey = 'steam_booster';
//缓存卡牌名称对应的信息，可以减少发送请求数量
const cacheKey = 'steam_booster_card_cache';
const sessionId = cookie.split('sessionid=')[1].split(';')[0];
//整个补充包div
let boosterPage = document.getElementsByClassName("booster_creator_area")[0];
//游戏选择器
let gameSelector = document.getElementById("booster_game_selector");
//下方展示部分
let gameForm = document.getElementsByClassName('booster_creator_right')[0];
//游戏详情页
let gameDes = document.getElementsByClassName("leftcol game_description_column")[0];
//是否正在渲染
let drawing = false;
//是否正在查询卡牌
let queryCard = false;

//所有游戏
let backUpOptions = [];
//已收藏游戏
let collectOptions = [];
///未收藏游戏
let outOptions = [];
//补充包队列
let boosterOptions = [];
//黑名单游戏
let blackOptions = [];
//当前可以做补充包的游戏，用于一键做包，只会操作补充包队列的游戏
let availableGame = [];
let doneList = [];
//可以直接根据appid搜索物品信息的游戏
let enableSearchAppList = [];
//游戏管理页面
let searchInfo = '';
let searchResult = [];
let pageNum = 1;
let totalCount = 0;
let pageSize = 10;
let priceData = {};
//该用户存储的补充包信息，包括默认展示类型等
let boosterInfo = {};
//缓存的各个游戏对应的卡牌id信息
let cacheInfo = {};
//市场宝珠价格
let gemsSackPrice = 0;
let marketSack = 0;
let customSack = 0;
//是否正在查询卡牌均价
let queryCardPriceFlag = false;
let interval = 8;
//所有游戏的信息，包括appid/name/price/series/available_at_time
let GAME_INFO;
//按钮样式
const classObj = {
    disableButton: 'btnv6_blue_blue_innerfade btn_medium btn_makepack btn_disabled',
    enableButton: 'btnv6_blue_blue_innerfade btn_medium btn_makepack',
};
const commonButtonStyle = 'height: 26px;width: 44px;margin-right: 8px;';
//游戏操作按钮
const operateButton = {
    outToCollect: {
        text: '收藏',
        style: commonButtonStyle,
        desc: '将游戏移入收藏，暂时不做补充包'
    },
    outToBooster: {
        text: '队列',
        style: commonButtonStyle + 'background:forestgreen',
        desc: '将游戏加入一键做包队列'
    },
    collectToBooster: {
        text: '队列',
        style: commonButtonStyle + 'background:forestgreen',
        desc: '将游戏加入一键做包队列'
    },
    collectToOut: {
        text: '移出',
        style: commonButtonStyle + 'background:darkgoldenrod',
        desc: '将游戏从收藏移出'
    },
    boosterToCollect: {
        text: '收藏',
        style: commonButtonStyle + 'background:mediumsla teblue',
        desc: '将游戏移入收藏，暂时不做补充包'
    },
    boosterToOut: {
        text: '删除',
        style: commonButtonStyle + 'background:chocolate',
        desc: '将游戏由队列移出到全部'
    },
    outToBlack: {
        text: '拉黑',
        style: commonButtonStyle + 'background:black',
        desc: '将游戏加入黑名单，暂不考虑做包'
    },
    blackToOut: {
        text: '移出',
        style: commonButtonStyle + 'background:darkslategrey',
        desc: '将游戏由黑名单移出到全部'
    },
    reset: {
        text: '重置',
        style: commonButtonStyle + 'background:maroon',
        desc: '将此游戏的缓存信息全部删除，用于解决游戏卡牌能否交易发生变更等问题'
    },
};
//卡牌数量对应补充包需要宝石数量
const cardCountToGemsCount = {
    5: 1200,
    6: 1000,
    7: 857,
    8: 750,
    9: 667,
    10: 600,
    11: 545,
    12: 500,
    13: 462,
    14: 429,
    15: 400
}
//消耗宝石数量对应的卡牌数量
const gemsCountToCardCount = {
    1200: 5,
    1000: 6,
    857: 7,
    750: 8,
    667: 9,
    600: 10,
    545: 11,
    500: 12,
    462: 13,
    429: 14,
    400: 15
}


//url中构建参数
function buildParams(url, data) {
    if (data) {
        url = url + "?";
        for (let [key, value] of Object.entries(data)) {
            url = url + key + '=' + value + "&"
        }
        url = url.substring(0, url.lastIndexOf('&'));
    }
    return url;
}

//构建请求参数
function getRequestData(itemId) {
    return {
        country: cacheInfo.areaInfo.country,
        language: cacheInfo.areaInfo.language,
        currency: cacheInfo.areaInfo.currency,
        item_nameid: itemId,
        two_factor: 0
    };
}

//获取可通过appid搜索物品信息的游戏列表
function getEnableSearchAppList() {
    let url = 'https://steamcommunity.com/market/';
    $J.get(url, function (response) {
        let parser = new DOMParser();
        let searchDoc = parser.parseFromString(response,'text/html');
        let searchElement = searchDoc.getElementById('market_advancedsearch_appselect_options_apps');
        for(let child of searchElement.children){
            enableSearchAppList.push(Number(child.id.split('app_option_')[1]))
        }
    })
}

//获取市场上一袋宝珠价格
function getGemsSackPrice() {
    if (marketSack > 0) {
        return
    }
    let sackItemId = cacheInfo.sackItemId;
    if (stringNotBlank(sackItemId) && cacheInfo.areaInfo) {
        GM_xmlhttpRequest({
            method: "GET",
            url: buildParams("https://steamcommunity.com/market/itemordershistogram", getRequestData(sackItemId)),
            headers: {
                "referer": "https://steamcommunity.com/market/listings/753/753",
            },
            cookie: document.cookie,
            onload: function (response) {
                console.info("查询一袋宝珠价格")
                let price = JSON.parse(response.responseText)
                let sellOrder = price.sell_order_graph;
                if (sellOrder && sellOrder.length >= 0) {
                    marketSack = sellOrder[0]['0'];
                    generateAppInfo(currentAppId);
                    generateGameList(pageNum, pageSize, searchResult);
                }
            }
        });
    } else {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://steamcommunity.com/market/listings/753/753-Sack%20of%20Gems",
            onload: function (response) {
                console.info("查询市场上一袋宝珠价格")
                let responseData = response.response
                let data = {
                    country: responseData.match(/g_strCountryCode = "([^"]+)"/)[1],
                    language: responseData.match(/g_strLanguage = "([^"]+)"/)[1],
                    currency: parseInt(responseData.match(/"wallet_currency":(\d+)/)[1]),
                    item_nameid: responseData.match(/Market_LoadOrderSpread\( (\d+)/)[1]
                };
                ///将补充包id放入缓存
                cacheInfo.sackItemId = data.item_nameid;
                //如果没有区域信息，初始化
                if (!cacheInfo.areaInfo || stringBlank(cacheInfo.areaInfo.country)) {
                    cacheInfo.areaInfo.country = data.country;
                    cacheInfo.areaInfo.language = data.language;
                    cacheInfo.areaInfo.currency = data.currency;
                }
                saveStorage(cacheKey, cacheInfo);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: buildParams("https://steamcommunity.com/market/itemordershistogram", data),
                    headers: {
                        "referer": "https://steamcommunity.com/market/listings/753/753",
                    },
                    cookie: document.cookie,
                    onload: function (response) {
                        console.info("查询一袋宝珠价格")
                        let price = JSON.parse(response.responseText)
                        let sellOrder = price.sell_order_graph;
                        if (sellOrder && sellOrder.length >= 0) {
                            marketSack = sellOrder[0]['0'];
                            generateAppInfo(currentAppId);
                            generateGameList(pageNum, pageSize, searchResult)
                        }
                    }
                });
            }
        });
    }
}

//构建补充包市场地址
function buildBoosterUrl(item) {
    if (!item || stringBlank(item.name)) {
        return
    }
    //特殊处理名字中带  / 、&的游戏
    let tempName = item.name.replace(new RegExp('/', 'g'), "-");
    let url = 'https://steamcommunity.com/market/listings/753/' + item.appid + '-' + encodeURIComponent(tempName) + '%20Booster%20Pack';
    url = url.replace(new RegExp('amp%3B', 'g'), '');
    return url
}

//查询当前搜索结果的拆包后三张普通卡牌价格
function queryResultCardPrice(i) {
    console.info(i)
    //判断是否已暂停
    if (queryCardPriceFlag) {
        if (searchResult.length > 0) {
            let item = searchResult[i];
            //判断是否查询过，已查询的直接跳转下一个
            if (getMarketable(item.appid) && (!priceData[item.appid] || !priceData[item.appid].hadQueryCard)) {
                console.info('appid=' + item.appid + ',从缓存查询该游戏卡牌是否可交易:', getMarketable(item.appid))
                computeCardPrice(item.appid);
                //如果后面还有数据，继续查询
                if (i < searchResult.length - 1) {
                    //每次查询间隔默认8s，防止请求过多被steam封禁
                    setTimeout(function () {
                        queryResultCardPrice(i + 1)
                    }, interval * 1000)
                } else {
                    queryCardPriceFlag = false;
                    generateGameList(pageNum, pageSize, searchResult)
                }
            } else {
                if (i < searchResult.length - 1) {
                    queryResultCardPrice(i + 1)
                } else {
                    queryCardPriceFlag = false;
                    generateGameList(pageNum, pageSize, searchResult)
                }
            }
        }
    }
}

//查询单个游戏补充包价格
function querySingleBoosterPrice(item) {
    //如果已有数据，跳过
    if (priceData[item.appid] && priceData[item.appid].hadBooster) {
        return
    }
    let priceInfo = priceData[item.appid] ? priceData[item.appid] : {};
    let boosterInfo = cacheInfo.boosterInfo;
    //取缓存中的补充包信息
    if (boosterInfo && boosterInfo[item.appid]) {
        let booster = boosterInfo[item.appid];
        $J.ajax({
            url: 'https://steamcommunity.com/market/itemordershistogram',
            type: 'GET',
            data: getRequestData(booster.itemId)
        }).success(function (price) {
            console.info("查询补充包价格:", item.appid)
            let buyOrder = price.buy_order_graph;
            priceInfo.hadBooster = true;
            if (buyOrder && buyOrder.length >= 0) {
                priceInfo.buyPrice = buyOrder[0]['0']
            } else {
                priceInfo.buyPrice = '未知';
            }
            generateCreateButton();
            generateGameList(pageNum, pageSize, searchResult)
        }).error(function () {
            generateCreateButton();
            generateGameList(pageNum, pageSize, searchResult)
        })
    } else {
        //缓存中如果没有补充包id，获取并放入缓存
        console.info('查询补充包',item)
        $J.get(buildBoosterUrl(item), function (data) {
            let itemId = data.match(/Market_LoadOrderSpread\( (\d+)/)[1];
            let currency = parseInt(data.match(/"wallet_currency":(\d+)/)[1]);
            let language = data.match(/g_strLanguage = "([^"]+)"/)[1];
            let country = data.match(/g_strCountryCode = "([^"]+)"/)[1];
            $J.ajax({
                url: 'https://steamcommunity.com/market/itemordershistogram',
                type: 'GET',
                data: {
                    country: country,
                    language: language,
                    currency: currency,
                    item_nameid: itemId
                }
            }).success(function (price) {
                console.info("查询补充包价格:", item.appid)
                let buyOrder = price.buy_order_graph;
                priceInfo.hadBooster = true;
                if (buyOrder && buyOrder.length >= 0) {
                    priceInfo.buyPrice = buyOrder[0]['0']
                } else {
                    priceInfo.buyPrice = '未知';
                }
                //构建补充包缓存信息，存入补充包id
                let booster = {};
                booster.itemId = itemId;
                //如果时第一次存放补充包信息，初始化
                if (!cacheInfo.boosterInfo) {
                    cacheInfo.boosterInfo = {}
                }
                //如果没有区域信息，初始化
                if (!cacheInfo.areaInfo) {
                    cacheInfo.areaInfo.country = country;
                    cacheInfo.areaInfo.language = language;
                    cacheInfo.areaInfo.currency = currency;
                }
                cacheInfo.boosterInfo[item.appid] = booster;
                saveStorage(cacheKey, cacheInfo);

                generateCreateButton();
                generateGameList(pageNum, pageSize, searchResult)
            }).error(function () {
                generateCreateButton();
                generateGameList(pageNum, pageSize, searchResult)
            });
        });
    }
    priceData[item.appid] = priceInfo
    //查询销量
    $J.ajax({
        url: 'https://steamcommunity.com/market/priceoverview',
        type: 'GET',
        data: {
            country: cacheInfo.areaInfo.country,
            currency: cacheInfo.areaInfo.currency,
            appid: 753,
            market_hash_name: item.appid + '-' + item.name + ' Booster Pack'
        }
    }).success(function (data) {
        if (data && data.volume) {
            priceInfo.sold = data.volume
        } else {
            priceInfo.sold = 0
        }
        generateCreateButton()
        generateGameList(pageNum, pageSize, searchResult)
    }).error(function () {
        generateCreateButton()
        generateGameList(pageNum, pageSize, searchResult)
    });
}


//查询当前游戏的卡牌是否可以交易,修改为异步
function queryMarketable(appid) {
    console.info("查询是否可交易,appid:", appid)
    let marketable = false;
    let url = 'https://steamcommunity.com/market/search/render/?start=0&count=20&category_753_cardborder[]=tag_cardborder_0&appid=753&category_753_Game[]=tag_app_' + appid;
    $J.get(url, function (response) {
        //卡牌总数
        let cardCount = response.total_count;
        if (!cardCount) {
            return;
        }
        let cardList = $J('<div>' + response.results_html + '</div>');
        let cardUrl = cardList.find('.market_listing_row_link')[0].href;
        $J.get(cardUrl, function (data) {
            marketable = parseInt(data.match(/"marketable":(\d+)/)[1]) === 1;
            let cardCacheItem = cacheInfo.cardInfo[appid] ? cacheInfo.cardInfo[appid] : {};
            cardCacheItem.marketable = marketable;
            cacheInfo.cardInfo[appid] = cardCacheItem;
            saveStorage(cacheKey, cacheInfo);
            generateGameList(pageNum, pageSize, searchResult);
        })
    })
    return marketable;
}

//根据缓存判断某个游戏卡牌是否可交易
function getMarketable(appid) {
    //非补充包页面，默认可交易，查询市场
    if (pageLocation !== 2) {
        return true;
    }
    let cardInfo = cacheInfo.cardInfo;
    let cacheItem = cardInfo ? cardInfo[appid] : {};
    //不可交易，直接返回
    return !(cacheItem && cacheItem.marketable !== undefined && !cacheItem.marketable);
}

//根据appid估算拆包后三张卡牌平均总价，按照最低售价计算
function computeCardPrice(appid) {
    let priceInfo = priceData[appid] ? priceData[appid] : {};
    //防重复
    if (priceInfo.hadQueryCard) {
        generateAppInfo(currentAppId)
        return
    }
    priceData[appid] = priceInfo;

    let cardInfo = cacheInfo.cardInfo;
    let cacheItem = cardInfo ? cardInfo[appid] : {};
    //不可交易，直接返回
    if (!getMarketable(appid)) {
        priceData[appid].hadQueryCard = true;
        return
    }
    if (cacheItem && cacheItem.cardIdList) {
        let count = 0;
        let successCount = 0;
        let totalPrice = 0;
        let totalSellerCount = 0;
        let exceptionInfo = '';
        cacheItem.cardIdList.forEach(id => {
            GM_xmlhttpRequest({
                method: "GET",
                url: buildParams("https://steamcommunity.com/market/itemordershistogram", getRequestData(id)),
                headers: {
                    // "host":"steamcommunity.com",
                    "referer": "https://steamcommunity.com/market/listings/753/" + appid,
                    // "user-agent":navigator.userAgent,
                },
                synchronous: false,
                onload: function (response) {
                    let price = JSON.parse(response.responseText)
                    count++;
                    let minSellPrice = price.lowest_sell_order;
                    let tempDiv = document.createElement('div');
                    tempDiv.innerHTML = price.sell_order_summary;
                    let sellerCountString = tempDiv.querySelector('.market_commodity_orders_header_promote').textContent;
                    if (minSellPrice === undefined || minSellPrice.length === 0) {
                        exceptionInfo = 'Query order afresh,sellOrder is undefined,appid:' + appid + ",cardId:" + id;
                    }else {
                        totalPrice += parseInt(minSellPrice)/100;
                        successCount++;
                    }
                    if (sellerCountString !== undefined && sellerCountString.length > 0){
                        totalSellerCount += parseInt(sellerCountString,10)
                    }
                    if (count === cacheItem.count) {
                        if (cacheItem.marketable === undefined) {
                            queryMarketable(appid);
                        }
                        if (successCount < count) {
                            console.error("卡牌总量:" + count + "，查询成功数量:" + successCount)
                            queryMarketable(appid);
                        }
                        if (successCount === 0 && stringNotBlank(exceptionInfo)) {
                            console.info(exceptionInfo, " appid = ", appid);
                            cacheInfo.cardInfo[appid] = undefined;
                            saveStorage(cacheKey, cacheInfo);
                            computeCardPrice(appid);
                            return;
                        }
                        priceInfo.cardPrice = 3 * (totalPrice / successCount);
                        priceInfo.aveargeSellerCount = totalSellerCount / count;
                        priceData[appid] = priceInfo;
                        priceData[appid].hadQueryCard = true;
                        generateAppInfo(currentAppId);
                        generateGameList(pageNum, pageSize, searchResult);
                    }
                }
            });
        })
    } else {
        if (queryCard) {
            return;
        }
        queryCard = true;

        //查询卡牌是否可交易
        cacheItem = {};
        // cacheItem.marketable = queryMarketable(appid);
        cacheInfo.cardInfo[appid] = cacheItem;
        saveStorage(cacheKey, cacheInfo);
        if (!getMarketable(appid)) {
            priceData[appid].hadQueryCard = true;
            generateGameList(pageNum, pageSize, searchResult);
            queryCard = false;
            return
        }
        //获取所有卡牌
        let url = 'https://steamcommunity.com/market/search/render/?start=0&count=20&category_753_cardborder[]=tag_cardborder_0&appid=753&category_753_Game[]=tag_app_' + appid;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "referer": "https://steamcommunity.com/market/listings/753/" + appid,
            },
            onload: function (response) {
                console.info("查询所有卡牌,appid:", appid);
                let data = JSON.parse(response.response)
                //卡牌总数
                let cardCount = data.total_count
                if (!cardCount) {
                    queryCard = false;
                    return
                }
                //构建缓存信息
                let cardCacheItem = cacheInfo.cardInfo[appid] ? cacheInfo.cardInfo[appid] : {};
                if (cacheItem && cacheItem.madeCount) {
                    cardCacheItem.madeCount = cacheItem.madeCount;
                }
                cardCacheItem.cardIdList = []
                let count = 0;
                let successCount = 0;
                let totalPrice = 0;
                let cardList = $J('<div>' + data.results_html + '</div>');
                cardList.find('.market_listing_row_link').each(function () {
                    let item = $J(this);
                    let link = item.attr('href');
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: link,
                        headers: {
                            "referer": "https://steamcommunity.com/market/listings/753/" + appid,
                        },
                        onload: function (pageData) {
                            let responseData = pageData.response
                            let id = responseData.match(/Market_LoadOrderSpread\( (\d+)/)[1];
                            let data = {
                                country: responseData.match(/g_strCountryCode = "([^"]+)"/)[1],
                                language: responseData.match(/g_strLanguage = "([^"]+)"/)[1],
                                currency: parseInt(responseData.match(/"wallet_currency":(\d+)/)[1]),
                                item_nameid: id
                            };
                            let cardUrl = "https://steamcommunity.com/market/itemordershistogram";
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: buildParams(cardUrl, data),
                                headers: {
                                    "referer": "https://steamcommunity.com/market/listings/753/" + appid,
                                },
                                cookie: document.cookie,
                                onload: function (response) {
                                    let price = JSON.parse(response.responseText)
                                    count++;
                                    let sellOrder = price.sell_order_graph;
                                    //保存游戏名称
                                    cardCacheItem.name = pageData.response.toString().match(/sting_game_name">([^"]+) 集换式卡牌/)[1]
                                    console.info("查询卡牌价格,appName:", cardCacheItem.name, "appid:", appid, ",cardId:", id, ",index:", count)
                                    if (sellOrder && sellOrder.length >= 0 && sellOrder[0]) {
                                        totalPrice += sellOrder[0]['0'];
                                        successCount++;
                                    }
                                    //在缓存中添加卡牌id
                                    cardCacheItem.cardIdList.push(data.item_nameid);
                                    if (cardCount === count) {
                                        if (cacheItem.marketable === undefined) {
                                            queryMarketable(appid);
                                        }
                                        priceInfo.cardPrice = 3 * (totalPrice / successCount);
                                        if (successCount < cardCount) {
                                            console.error("卡牌总量:" + cardCount + "，查询成功数量:" + successCount)
                                        }
                                        priceData[appid] = priceInfo;


                                        currentAppName = cardCacheItem.name
                                        //缓存卡牌id信息等
                                        cacheInfo.areaInfo.country = data.country;
                                        cacheInfo.areaInfo.language = data.language;
                                        cacheInfo.areaInfo.currency = data.currency;

                                        cardCacheItem.count = cardCount;

                                        cacheInfo.cardInfo[appid] = cardCacheItem;
                                        saveStorage(cacheKey, cacheInfo);
                                        queryCard = false;
                                        priceData[appid].hadQueryCard = true;
                                        generateAppInfo(currentAppId)
                                        generateGameList(pageNum, pageSize, searchResult)
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });
    }
    if (boosterInfo.autoQueryBundle !== undefined && boosterInfo.autoQueryBundle){
        querySingleBoosterPrice(GAME_INFO[appid])
    }
}

//制作单个补充包
function createSingleBooster(item) {
    if (!item || !item.appid) {
        return
    }
    $J.ajax({
        url: 'https://steamcommunity.com/tradingcards/ajaxcreatebooster/',
        type: 'POST',
        data: {
            sessionid: sessionId,
            appid: item.appid,
            series: GAME_INFO[item.appid].series,
            tradability_preference: 1
        },
        crossDomain: true,
        xhrFields: {withCredentials: true}
    }).success(function () {
        console.info("制作补充包:", item.appid)
        item.available_at_time = '已完成';
        doneList.push(item.appid.toString());

        //历史制作数量+1
        let cardInfo = cacheInfo.cardInfo;
        let cacheItem = cardInfo[item.appid];
        if (cacheItem) {
            if (isNaN(cacheItem.madeCount)) {
                cacheItem.madeCount = 1;
            } else {
                cacheItem.madeCount = cacheItem.madeCount + 1;
            }
        } else {
            cacheItem = {};
            cacheItem.madeCount = 1;
        }
        cacheItem.lastMade = getCurrentDay()
        cardInfo[item.appid] = cacheItem;
        saveStorage(cacheKey, cacheInfo);

        setUnavailable();
        buildOptions();
        generateCreateButton();
        generateGameList(pageNum, pageSize, searchResult);
    }).error(function () {
        item.available_at_time = '制作失败';
        document.getElementById("createButton").innerHTML = "宝石不足或其他原因";
        generateGameList(pageNum, pageSize, searchResult);
    });
}

//获取当前时间,格式:2021-01-01
function getCurrentDay() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${date}`;
}

//获取当前时间,格式:2021-01-01 12:00:00
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

//循环制作补充包
function createBooster(index) {
    if (availableGame.length === 0) {
        return
    }
    if (index === 0) {
        //重复点击直接返回
        if (document.getElementById("createButton").innerHTML === '正在制作') {
            return
        } else {
            document.getElementById("createButton").innerHTML = "正在制作"
        }
    }
    let item = availableGame[index];

    //不可交易的包，跳过
    if (!getMarketable(item.value)) {
        console.info("卡牌不可交易，跳过 appid = ", item.value);
        if (index + 1 < availableGame.length) {
            createBooster(index + 1)
        } else {
            setUnavailable();
            buildOptions();
            generateCreateButton();
            generateGameList(pageNum, pageSize, searchResult);
        }
    } else {
        $J.ajax({
            url: 'https://steamcommunity.com/tradingcards/ajaxcreatebooster/',
            type: 'POST',
            data: {
                sessionid: sessionId,
                appid: item.value,
                series: GAME_INFO[item.value].series,
                tradability_preference: 1
            },
            crossDomain: true,
            xhrFields: {withCredentials: true}
        }).success(function () {
            console.info("制作补充包成功 appid = ", item.value);
            doneList.push(item.value);

            //将对应补充包置为 已完成
            for (let searchItem of searchResult) {
                if (searchItem && searchItem.appid.toString() === item.value.toString()) {
                    searchItem.available_at_time = '已完成';
                }
            }

            //历史制作数量+1
            let cardInfo = cacheInfo.cardInfo;
            let cacheItem = cardInfo[item.value];
            if (cacheItem) {
                if (isNaN(cacheItem.madeCount)) {
                    cacheItem.madeCount = 1;
                } else {
                    cacheItem.madeCount = cacheItem.madeCount + 1;
                }
            } else {
                cacheItem = {};
                cacheItem.madeCount = 1;
            }
            cardInfo[item.value] = cacheItem;
            saveStorage(cacheKey, cacheInfo);

            if (index + 1 < availableGame.length) {
                createBooster(index + 1)
            } else {
                setUnavailable();
                buildOptions();
                generateCreateButton();
                generateGameList(pageNum, pageSize, searchResult);
            }
        }).error(function () {
            document.getElementById("createButton").innerHTML = "宝石不足或其他原因"
        });
    }
}

//制包成功后将对应option设置为unavailable
function setUnavailable() {
    if (doneList && doneList.length > 0) {
        for (let i = 0; i < backUpOptions.length; i++) {
            if (doneList.indexOf(backUpOptions[i].value) > -1) {
                backUpOptions[i].setAttribute("class", "unavailable")
            }
        }
    }
}

//判断字符串是否为空，不为空是true，为空是false
function stringNotBlank(value) {
    return !stringBlank(value);
}

//判断字符串是否为空，为空是true，不为空是false
function stringBlank(value) {
    return !value || value.trim() === '';
}

//将所有未收藏游戏移入黑名单
function toBlack() {
    if (!outOptions || outOptions.length === 0) {
        return
    }
    outOptions.map(function (item) {
        if (boosterInfo.black.indexOf(item.value) === -1) {
            operateGame(item.value, "outToBlack")
        }
    })
}

//执行搜索
function doSearch() {
    //只要执行搜索，首先暂停查询
    queryCardPriceFlag = false;

    let inputValue = document.getElementById('searchInput').value;
    let typeSelect = document.getElementById('typeSelect');
    let pageSizeValue = document.getElementById('pageSizeInput').value;
    let sourceSelect = document.getElementById('sourceSelect');


    if (pageSizeValue && !isNaN(pageSizeValue) && /(^[1-9]\d*$)/.test(pageSizeValue) && pageSizeValue !== boosterInfo.pageSize) {
        pageSize = parseInt(pageSizeValue);
        boosterInfo.pageSize = pageSize;
        saveStorage(boosterKey, boosterInfo)
    }

    if (stringNotBlank(inputValue)) {
        searchInfo = inputValue.trim()
    } else {
        searchInfo = ''
    }
    if (boosterInfo.typeIndex !== typeSelect.selectedIndex) {
        boosterInfo.typeIndex = typeSelect.selectedIndex;
        saveStorage(boosterKey, boosterInfo)
    }

    //如果是自定义价格，保存
    if (sourceSelect.selectedIndex === 1) {
        let gemPriceInputValue = document.getElementById('gemPriceInput').value;
        if (gemPriceInputValue && !isNaN(gemPriceInputValue)) {
            boosterInfo.sourceIndex = 1;
            boosterInfo.customPrice = gemPriceInputValue;
            saveStorage(boosterKey, boosterInfo)
            customSack = gemPriceInputValue
        }
    } else {
        boosterInfo.sourceIndex = 0;
        saveStorage(boosterKey, boosterInfo)
    }

    saveCustomizeInterval();

    searchResult = [];
    let tempGameInfo = {};

    if (boosterInfo.typeIndex === 0) {
        backUpOptions.map(function (item) {
            tempGameInfo[item.value] = GAME_INFO[item.value]
        })
    } else if (boosterInfo.typeIndex === 1) {
        boosterOptions.map(function (item) {
            tempGameInfo[item.value] = GAME_INFO[item.value]
        })
    } else if (boosterInfo.typeIndex === 2) {
        collectOptions.map(function (item) {
            tempGameInfo[item.value] = GAME_INFO[item.value]
        })
    } else if (boosterInfo.typeIndex === 3) {
        outOptions.map(function (item) {
            tempGameInfo[item.value] = GAME_INFO[item.value]
        })
    } else if (boosterInfo.typeIndex === 4) {
        blackOptions.map(function (item) {
            tempGameInfo[item.value] = GAME_INFO[item.value]
        })
    }

    if (stringBlank(searchInfo)) {
        for (let key in tempGameInfo) {
            searchResult.push(tempGameInfo[key])
        }
    } else {
        //支持大小写不敏感匹配、appid匹配、多个字符串匹配
        for (let key in tempGameInfo) {
            if (searchInfo.indexOf(' ') !== -1) {
                let match = true;
                let keyWordArray = searchInfo.split(' ');
                for (let i = 0; i < keyWordArray.length; i++) {
                    if (tempGameInfo[key].name.toUpperCase().indexOf(keyWordArray[i].trim().toUpperCase()) === -1) {
                        match = false;
                        break
                    }
                }
                if (match) {
                    searchResult.push(tempGameInfo[key])
                }
            } else if (searchInfo === tempGameInfo[key].appid.toString() || tempGameInfo[key].name.toUpperCase().indexOf(searchInfo.toUpperCase()) > -1) {
                searchResult.push(tempGameInfo[key])
            }
        }
    }
    pageNum = 1;
    generateGameList(pageNum, pageSize, searchResult)
}

//构建市场搜索链接
function buildMarketUrl(name, appid) {
    if (enableSearchAppList.indexOf(appid) > -1){
        return 'https://steamcommunity.com/market/search?appid=' + appid
    }else {
        if (stringBlank(name)) {
            return 'https://store.steampowered.com/'
        } else {
            let searchUrl = 'https://steamcommunity.com/market/search?q=';
            let keyArray = name.split(' ');
            searchUrl += keyArray[0];
            for (let i = 1; i < keyArray.length; i++) {
                searchUrl = searchUrl + '+' + keyArray[i]
            }
            searchUrl = searchUrl.replace(new RegExp('&amp;', 'g'), '%26');
            return searchUrl
        }
    }
}

//保存自定义查询卡牌价格时间间隔
function saveCustomizeInterval() {
    let intervalValue = document.getElementById('timeInterval').value;
    if (intervalValue && !isNaN(intervalValue) && intervalValue >= 1 && intervalValue !== interval) {
        boosterInfo.timeInterval = intervalValue;
        saveStorage(boosterKey, boosterInfo);
        interval = intervalValue
    }
}

//查询当前游戏多少张卡牌
function getCardCount(currentAppId) {
    if (!currentAppId) {
        return 0;
    }
    //如果已有缓存，直接返回
    if (cacheInfo && cacheInfo.cardInfo && cacheInfo.cardInfo[currentAppId]) {
        return cacheInfo.cardInfo[currentAppId].count;
    }
    let url = 'https://steamcommunity.com/market/search/render/?start=0&count=20&category_753_cardborder[]=tag_cardborder_0&appid=753&category_753_Game[]=tag_app_' + currentAppId;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            "referer": "https://steamcommunity.com/market/listings/753/" + currentAppId,
        },
        onload: function (response) {
            let data = JSON.parse(response.response)
            let cardCount = data.total_count
            if (!cardCount) {
                return
            }
            //构建缓存信息
            let cardCacheItem = {};
            cardCacheItem.count = cardCount;
            cacheInfo.cardInfo[currentAppId] = cardCacheItem;
            saveStorage(cacheKey, cacheInfo);
            return cardCount;
        }
    })
}

//计算当前游戏补充包成本
function getBoosterCost(currentAppId) {
    if (marketSack <= 0) {
        return "宝珠成本未知"
    }
    let cardCount = getCardCount(currentAppId);
    if (cardCount <= 0) {
        return "卡牌数量未知"
    }
    let gemsCount = cardCountToGemsCount[cardCount];
    if (gemsCount === undefined) {
        return "未知游戏类型"
    }
    let cost = parseInt(gemsCount) / 1000 * marketSack;
    if (!isNaN(cost)) {
        return parseFloat(cost.toFixed(2));
    } else {
        return "计算错误"
    }
}

//渲染市场搜索页面，用红色标注卡牌
function generateSearchMarket() {
    let result = document.getElementsByClassName("market_listing_game_name");
    if (pageLocation === 5 && result !== null && result.length !== 0) {
        for (let i = 0; i < result.length; i++) {
            let item = result[i]
            if (item.innerText.indexOf('集换式卡牌') !== -1 && item.parentNode.parentNode.className === 'market_listing_row market_recent_listing_row market_listing_searchresult') {
                item.parentNode.parentNode.parentNode.setAttribute('target', '_blank');
                if (item.innerText.indexOf('闪亮') !== -1) {
                    item.setAttribute('style', 'color:yellow;');
                    item.parentNode.parentNode.getElementsByClassName("market_listing_num_listings_qty")[0].setAttribute('style', 'color:yellow;');
                } else {
                    item.setAttribute('style', 'color:red;');
                    item.parentNode.parentNode.getElementsByClassName("market_listing_num_listings_qty")[0].setAttribute('style', 'color:red;');
                }
            }
        }
    }
    setTimeout(function () {
        generateSearchMarket()
    }, 300)
}


//渲染游戏详情页补充包信息
function generateAppInfo(currentAppId) {
    if (pageLocation === 4) {
        gameDes = document.getElementById("error_box")
    }
    if (!gameDes) {
        return;
    }
    if (drawing) {
        return;
    }
    drawing = true;
    if (document.getElementById("boosterInfo")) {
        gameDes.removeChild(document.getElementById("boosterInfo"))
    }

    let boosterInfo = document.createElement('div');
    boosterInfo.setAttribute('id', 'boosterInfo');
    boosterInfo.setAttribute('style', 'height:40px;width:100%;margin-bottom:12px');

    let marketPriceInfo = document.createElement('span');
    marketPriceInfo.innerHTML = '一袋宝珠：' + marketSack;
    marketPriceInfo.setAttribute('title', '当前市场一袋补充包最低售价');

    let cardCount = document.createElement('span');
    cardCount.innerHTML = '此游戏卡牌：' + getCardCount(currentAppId);
    cardCount.setAttribute('title', '当前游戏一套卡牌数量');
    cardCount.setAttribute('style', 'display: inline-block; margin-left: 8px');

    let costInfo = document.createElement('span');
    let cost = getBoosterCost(currentAppId);
    costInfo.innerHTML = '成本：' + cost;
    costInfo.setAttribute('title', '按照市场宝珠价格计算制作此游戏一个补充包成本');
    costInfo.setAttribute('style', 'display: inline-block; margin-left: 8px');


    //计算当前补充包的三张卡牌均价
    if (!priceData[currentAppId] || !priceData[currentAppId].cardPrice) {
        computeCardPrice(currentAppId);
    }
    let cardPrice = document.createElement('span');
    let tempCardPrice = priceData[currentAppId].cardPrice;
    if (!isNaN(tempCardPrice)) {
        tempCardPrice = (tempCardPrice / 1.15).toFixed(2);
        cardPrice.innerHTML = '售价：' + tempCardPrice;
        if (cost > 0 && tempCardPrice > cost) {
            cardPrice.setAttribute('style', 'display: inline-block; margin-left: 8px;color:red');
        } else {
            cardPrice.setAttribute('style', 'display: inline-block; margin-left: 8px');
        }
    }
    cardPrice.setAttribute('title', '拆包后三张卡牌均价总和，即一个补充包平均拆包后卖出价格（税后）');

    let marketInfo = document.createElement('a');
    marketInfo.innerHTML = '游戏物品';
    marketInfo.setAttribute('href', buildMarketUrl(currentAppName,currentAppId));
    marketInfo.setAttribute('style', 'display: inline-block; margin-left: 8px');
    marketInfo.setAttribute('target', '_blank');

    let boosterUrl = document.createElement('a');
    boosterUrl.innerHTML = '做包';
    boosterUrl.setAttribute('href', 'https://steamcommunity.com//tradingcards/boostercreator/');
    boosterUrl.setAttribute('style', 'display: inline-block; margin-left: 8px');
    boosterUrl.setAttribute('target', '_blank');

    let marketUrl = document.createElement('a');
    marketUrl.innerHTML = '解决软锁';
    marketUrl.setAttribute('title', '进入单独查看价格页面，可将软锁游戏加入购物车');
    marketUrl.setAttribute('href', 'https://store.steampowered.com/widget/' + currentAppId);
    marketUrl.setAttribute('style', 'display: inline-block; margin-left: 8px');
    marketUrl.setAttribute('target', '_blank');

    boosterInfo.appendChild(marketPriceInfo);
    boosterInfo.appendChild(cardCount);
    boosterInfo.appendChild(costInfo);
    boosterInfo.appendChild(cardPrice);
    boosterInfo.appendChild(marketInfo);
    boosterInfo.appendChild(boosterUrl);
    boosterInfo.appendChild(marketUrl);

    gameDes.insertBefore(boosterInfo, gameDes.firstChild);
    drawing = false;
}


//生成游戏列表
function generateGameList(pageNum, pageSize, searchResult) {
    //不是补充包页面，返回
    if (!gameForm) {
        return;
    }
    //重新生成，删除旧数据
    for (let i = gameForm.childNodes.length - 1; i >= 0; i--) {
        gameForm.removeChild(gameForm.childNodes[i]);
    }
    gameForm.setAttribute('style', 'width:860px;');

    //补充包成本展示
    let gemsDiv = document.createElement('div');
    gemsDiv.setAttribute('style', 'width:100%;margin-bottom:12px');

    //计算当前展示页的起始位置
    let startIndex = (pageNum - 1) * pageSize;

    //选择成本提示
    let boosterCost = document.createElement('span');
    boosterCost.setAttribute('title', '选择你一袋宝珠成本，用于计算制作补充包是否可以获利');
    boosterCost.innerHTML = '一袋宝珠成本： ';

    //下拉选择使用市场价还是自定义价格
    let sourceSelect = document.createElement('select');
    sourceSelect.setAttribute('style', 'margin-right:22px;width:130px');
    sourceSelect.setAttribute('id', 'sourceSelect');

    let customOption = document.createElement('option');
    customOption.setAttribute('value', '2');
    customOption.innerHTML = '自定义价格';

    let marketOption = document.createElement('option');
    marketOption.setAttribute('value', '1');
    marketOption.innerHTML = '市场价格';

    sourceSelect.add(marketOption);
    sourceSelect.add(customOption);

    sourceSelect.selectedIndex = boosterInfo.sourceIndex;
    sourceSelect.onchange = function () {
        doSearch();
    };

    let customPriceInfo = document.createElement('span');
    customPriceInfo.innerHTML = '自定义成本: ';
    customPriceInfo.setAttribute('style', 'margin-left: 12px;')
    customPriceInfo.setAttribute('title', '你自己的一袋补充包购买成本');


    //自定义价格输入框
    let gemPriceInput = document.createElement('input');
    gemPriceInput.setAttribute('id', 'gemPriceInput');
    gemPriceInput.setAttribute('title', '只有宝珠成本选择‘自定义价格’时输入才会生效');
    gemPriceInput.setAttribute('style', 'background-color: rgba( 103, 193, 245, 0.2 ); color: #fff; border: 1px solid #000;border-radius: 3px; width: 30px;padding: 5px;');
    gemPriceInput.value = boosterInfo.customPrice;
    gemPriceInput.onchange = function () {
        doSearch()
    };

    let marketPriceInfo = document.createElement('a');
    marketPriceInfo.innerHTML = '市场价格：' + marketSack;
    marketPriceInfo.setAttribute('title', '当前市场一袋宝珠最低售价，点击进入宝珠市场页面');
    marketPriceInfo.setAttribute('target', '_blank');
    marketPriceInfo.setAttribute('href', 'https://steamcommunity.com/market/listings/753/753-Sack%20of%20Gems');
    marketPriceInfo.setAttribute('style', 'display: inline-block;text-decoration:underline;cursor: pointer;color:#8F98A0')


    let blackButton = document.createElement('button');
    blackButton.innerHTML = '一键拉黑';
    blackButton.setAttribute('class', outOptions.length > 0 ? classObj.enableButton : classObj.disableButton);
    blackButton.setAttribute('title', '将所有未收藏游戏移入黑名单');
    blackButton.setAttribute('style', 'margin-left: 15px;width: 90px; height: 26px;');
    blackButton.onclick = function () {
        toBlack()
    };
    //查询当前搜索结果卡牌均价
    let autoQueryPrice = document.createElement('button');
    autoQueryPrice.innerHTML = queryCardPriceFlag ? '暂停查询' : '自动查询';
    autoQueryPrice.setAttribute('class', classObj.enableButton);
    autoQueryPrice.setAttribute('style', 'width: 90px; height: 26px;float: right');
    autoQueryPrice.setAttribute('title', queryCardPriceFlag ? "点击将暂停自动查询" : "点击从当前页开始自动查询当前所有搜索结果的三张卡牌均价，已查询或不可交易卡牌会跳过，请勿重复快速点击");
    if (queryCardPriceFlag) {
        autoQueryPrice.onclick = function () {
            queryCardPriceFlag = false;
            saveCustomizeInterval();
            generateGameList(pageNum, pageSize, searchResult);
        };
    } else {
        autoQueryPrice.onclick = function () {
            queryCardPriceFlag = true;
            saveCustomizeInterval();
            generateGameList(pageNum, pageSize, searchResult);
            queryResultCardPrice(startIndex);
        };
    }
    //自动查询补充包
    let autoQueryBundleInfo = document.createElement('span');
    autoQueryBundleInfo.setAttribute('style', 'margin-left: 15px');
    autoQueryBundleInfo.setAttribute('title', '自动查询卡牌价格时是否同时查询补充包价格');
    autoQueryBundleInfo.innerHTML = '查询补充包:';

    let autoQueryBundle = document.createElement('input');
    autoQueryBundle.setAttribute('type','checkbox')
    autoQueryBundle.setAttribute('style','background-color: rgba( 103, 193, 245, 0.2 ); color: #fff; border: 1px solid #000;border-radius: 3px; width: 15px;padding: 5px;height:10px')
    autoQueryBundle.value = 'checked';
    autoQueryBundle.checked = boosterInfo.autoQueryBundle === undefined ?  false : boosterInfo.autoQueryBundle;
    autoQueryBundle.onclick = function (){
        if (autoQueryBundle.checked) {
            boosterInfo.autoQueryBundle = true;
        } else {
            boosterInfo.autoQueryBundle = false;
        }
        saveStorage(boosterKey,boosterInfo)
    }

    //查询间隔提示
    let timeIntervalInfo = document.createElement('span');
    timeIntervalInfo.setAttribute('style', 'margin-left: 10px');
    timeIntervalInfo.setAttribute('title', '自动查询卡牌发送请求间隔，单位s，第一次查询建议不低于8。查询后会生成缓存，之后可以设置为3，加快速度又不会被封禁');
    timeIntervalInfo.innerHTML = '请求间隔:';

    //自定义查询时间间隔
    let timeInterval = document.createElement('input');
    timeInterval.setAttribute('id', 'timeInterval');
    timeInterval.setAttribute('style', 'margin-left: 15px;background-color: rgba( 103, 193, 245, 0.2 ); color: #fff; border: 1px solid #000;border-radius: 3px; width: 30px;padding: 5px;');
    timeInterval.value = boosterInfo.timeInterval;
    timeInterval.onchange = function () {
        doSearch();
    };

    gemsDiv.appendChild(boosterCost);
    gemsDiv.appendChild(sourceSelect);
    gemsDiv.appendChild(marketPriceInfo);
    gemsDiv.appendChild(customPriceInfo);
    gemsDiv.appendChild(gemPriceInput);
    gemsDiv.appendChild(autoQueryBundleInfo);
    gemsDiv.appendChild(autoQueryBundle);
    gemsDiv.appendChild(timeIntervalInfo);
    gemsDiv.appendChild(timeInterval);
    gemsDiv.appendChild(autoQueryPrice);
    // 0代表使用市场价，1代表使用自定义
    if (boosterInfo.sourceIndex === 1) {
        gemsSackPrice = customSack;
    } else {
        gemsSackPrice = marketSack;
    }
    if (boosterInfo.typeIndex === 3) {
        gemsDiv.appendChild(blackButton);
    }

    //搜索输入框
    let searchInput = document.createElement('input');
    searchInput.onchange = function () {
        doSearch()
    };
    searchInput.setAttribute('id', 'searchInput');
    searchInput.setAttribute('style', 'background-color: rgba( 103, 193, 245, 0.2 ); color: #fff; border: 1px solid #000;border-radius: 3px; width: 240px;padding: 5px;');
    if (searchInfo && searchInfo.trim() !== '') {
        searchInput.value = searchInfo
    }

    let typeInfo = document.createElement('span');
    typeInfo.setAttribute('style', 'margin-left: 30px');
    typeInfo.innerHTML = '库选择:';
    typeInfo.setAttribute('title', '选择从哪一个列表里面进行查询');


    //搜索类型选择
    let typeSelect = document.createElement('select');
    let allOption = document.createElement('option');
    allOption.setAttribute('value', 'all');
    allOption.innerHTML = '全部';
    let boosterOption = document.createElement('option');
    boosterOption.setAttribute('value', 'booster');
    boosterOption.innerHTML = '队列';
    let filterOption = document.createElement('option');
    filterOption.setAttribute('value', 'filter');
    filterOption.innerHTML = '收藏';
    let outOption = document.createElement('option');
    outOption.setAttribute('value', 'out');
    outOption.innerHTML = '未收藏';
    let blackOption = document.createElement('option');
    blackOption.setAttribute('value', 'black');
    blackOption.innerHTML = '黑名单';

    typeSelect.add(allOption);
    typeSelect.add(boosterOption);
    typeSelect.add(filterOption);
    typeSelect.add(outOption);
    typeSelect.add(blackOption);

    typeSelect.selectedIndex = boosterInfo.typeIndex;
    typeSelect.setAttribute('style', 'margin-left:30px;width:100px');
    typeSelect.setAttribute('id', 'typeSelect');
    typeSelect.onchange = function () {
        doSearch();
    };

    let pageSizeInfo = document.createElement('span');
    pageSizeInfo.setAttribute('style', 'margin-left: 30px');
    pageSizeInfo.innerHTML = '每页数量:';
    pageSizeInfo.setAttribute('title', '每页展示的数据量，输入1-50的数字，点击搜索按钮后生效');

    //页面size输入框
    let pageSizeInput = document.createElement('input');
    pageSizeInput.setAttribute('id', 'pageSizeInput');
    pageSizeInput.setAttribute('style', 'margin-left: 15px;background-color: rgba( 103, 193, 245, 0.2 ); color: #fff; border: 1px solid #000;border-radius: 3px; width: 60px;padding: 5px;');
    pageSizeInput.setAttribute('title', '输入每页数量，默认10');
    pageSizeInput.value = pageSize;
    pageSizeInput.onchange = function () {
        doSearch();
    };

    //搜索按钮
    let searchButton = document.createElement('button');
    searchButton.setAttribute('id', 'searchButton');
    searchButton.innerHTML = '搜索';
    searchButton.setAttribute('style', 'border-radius: 2px; border: none;padding: 1px;cursor: pointer;color: #67c1f5 !important;background: rgba( 103, 193, 245, 0.2 );height: 26px;width: 90px;float: right;margin-bottom: 32px;');
    searchButton.onclick = function () {
        doSearch()
    };
    gameForm.appendChild(gemsDiv);
    gameForm.appendChild(searchInput);
    gameForm.appendChild(typeInfo);
    gameForm.appendChild(typeSelect);
    gameForm.appendChild(pageSizeInfo);
    gameForm.appendChild(pageSizeInput)
    gameForm.appendChild(searchButton);

    let table = document.createElement('table');
    table.setAttribute('style', 'width: 100%;overflow-x:auto;white-space: nowrap');
    let th1 = document.createElement('th');
    th1.innerHTML = '游戏';
    th1.setAttribute('style', 'width:122px');
    th1.setAttribute('title', '点击可以跳转到市场对应游戏的物品列表');
    let th2 = document.createElement('th');
    th2.innerHTML = '名称';
    th2.setAttribute('style', 'width:150px');
    let th3 = document.createElement('th');
    th3.innerHTML = '状态';
    th3.setAttribute('style', 'width:80px');
    let th4 = document.createElement('th');
    th4.innerHTML = '宝石';
    th4.setAttribute('style', 'width:80px');
    th4.setAttribute('title', '此游戏制作一个补充包需要的宝石数量(此游戏总卡牌数量)');
    let th5 = document.createElement('th');
    th5.innerHTML = '成本';
    th5.setAttribute('style', 'width:40px');
    th5.setAttribute('title', '按照直接购买宝石价格计算');
    let th6 = document.createElement('th');
    th6.innerHTML = '均价';
    th6.setAttribute('style', 'width:40px');
    th6.setAttribute('title', '拆包后三张普通卡牌均价(最低售价计算,税后)');
    let th7 = document.createElement('th');
    th7.innerHTML = '卖单';
    th7.setAttribute('style', 'width:40px');
    th7.setAttribute('title', '按最低卖单卖出税后收入，按照15%税率粗略计算，高于成本会变黄');
    let th8 = document.createElement('th');
    th8.innerHTML = '买单';
    th8.setAttribute('style', 'width:40px');
    th8.setAttribute('title', '按买单直接卖出税后收入，按照15%税率粗略计算，高于成本会变黄');
    let th9 = document.createElement('th');
    th9.innerHTML = '利润率';
    th9.setAttribute('style', 'width:60px');
    th9.setAttribute('title', '三张卡牌总价税后 / 成本 ');
    let th10 = document.createElement('th');
    th10.innerHTML = '销量';
    th10.setAttribute('style', 'width:40px');
    th10.setAttribute('title', '补充包日销量');
    let th11 = document.createElement('th');
    // th11.setAttribute('style', 'position: sticky;right: 0');
    th11.innerHTML = '操作';

    let th12 = document.createElement('th');
    th12.setAttribute('style', 'width:40px');
    th12.setAttribute('title', '此包历史制作次数 ');
    th12.innerHTML = '制作量';

    let th13 = document.createElement('th');
    th13.setAttribute('style', 'width:40px');
    th13.setAttribute('title', '补充包最高买单税后价格 ');
    th13.innerHTML = '包价';

    let th14 = document.createElement('th');
    th14.setAttribute('style', 'width:40px');
    th14.setAttribute('title', '上次制作补充包的时间');
    th14.innerHTML = '上次制作';

    let th15 = document.createElement('th');
    th15.innerHTML = '平均卖单量';
    th15.setAttribute('style', 'width:40px');
    th15.setAttribute('title', '该游戏所有普通卡牌平均卖单数量');

    let tableHead = document.createElement('thead');
    let tableHeadTr = document.createElement('tr');

    tableHeadTr.appendChild(th1);
    tableHeadTr.appendChild(th2);
    tableHeadTr.appendChild(th3);
    tableHeadTr.appendChild(th4);
    tableHeadTr.appendChild(th5);
    tableHeadTr.appendChild(th6);
    tableHeadTr.appendChild(th15);
    // thead.appendChild(th7);
    // thead.appendChild(th8);
    tableHeadTr.appendChild(th9);
    tableHeadTr.appendChild(th13);
    tableHeadTr.appendChild(th10);
    tableHeadTr.appendChild(th12);
    tableHeadTr.appendChild(th14);
    tableHeadTr.appendChild(th11);

    tableHead.appendChild(tableHeadTr);
    table.appendChild(tableHead);
    let tbody = document.createElement('tbody');
    tbody.setAttribute('style','width: 100%;overflow-x:auto;')

    if (searchResult.length > 0) {
        for (let i = startIndex; i < searchResult.length && i < startIndex + pageSize; i++) {
            let item = searchResult[i];
            let tr = document.createElement('tr');
            tr.setAttribute('style', 'height:60px');

            //游戏缩略图，点击跳转到市场
            let img = document.createElement('img');
            img.setAttribute('src', 'https://steamcdn-a.akamaihd.net/steam/apps/' + item.appid + '/capsule_sm_120.jpg');
            let imgDiv = document.createElement('a');
            imgDiv.appendChild(img)

            //游戏名称
            let name = document.createElement('a');
            name.innerHTML = item.name;
            name.setAttribute('style', 'display: inline-block;overflow: hidden;text-overflow: ellipsis;max-width: 135px;color:#8F98A0');

            //制作冷却
            let availableTime = document.createElement('td');
            let numberTest = /[0-9]/;
            if (!item.available_at_time) {
                if (cacheInfo.cardInfo[item.appid] && cacheInfo.cardInfo[item.appid].marketable !== undefined && !cacheInfo.cardInfo[item.appid].marketable) {
                    availableTime.innerHTML = '不可交易';
                    availableTime.setAttribute('title', '此游戏卡牌已不可在市场交易');
                    availableTime.setAttribute('style', 'color:red')
                } else {
                    availableTime.innerHTML = '可制作';
                    availableTime.setAttribute('title', '点击制作此游戏补充包');
                    availableTime.setAttribute('style', 'color:yellow;text-decoration:underline;cursor: pointer')
                    availableTime.onclick = function () {
                        createSingleBooster(item)
                    }
                }
            } else if (numberTest.test(item.available_at_time)) {
                availableTime.innerHTML = item.available_at_time;
                availableTime.setAttribute('title', '下次可制作补充包时间');
            } else {
                availableTime.innerHTML = item.available_at_time;
            }

            //补充包需要宝石数
            let price = document.createElement('td');
            price.innerHTML = item['price'] + "(" + gemsCountToCardCount[item['price']] + ")";

            //制作成本
            let cost = document.createElement('td');
            let costPrice = 0.00;
            if (gemsSackPrice > 0) {
                let tempCost = item['price'] / 1000 * gemsSackPrice;
                if (!isNaN(tempCost)) {
                    costPrice = parseFloat(tempCost.toFixed(2));
                    cost.innerHTML = costPrice.toString()
                }
            }
            let priceTd = document.createElement('td');
            priceTd.appendChild(price)

            //最低卖单价格
            let sellPrice = document.createElement('td');
            sellPrice.setAttribute('title', '市场最低售价税后收入，高于成本会变黄');

            //补充包最高买单价格
            let bundleBuyPrice = document.createElement('td');
            bundleBuyPrice.setAttribute('title', '市场最高买价税后收入，高于成本会变黄');

            //利润率，（最低卖单税后-成本）/ 成本
            let profitRate = document.createElement('td');
            profitRate.setAttribute('title', '利润率，（最低卖单税后-成本）/ 成本');

            //补充包日销量
            let bundleSoldCount = document.createElement('td');

            //税后三张卡牌均价如果高于成本，红色
            let cardPrice = document.createElement('td');
            let sellerCount = document.createElement('td');
            if (!getMarketable(item.appid)) {
                cardPrice.innerHTML = '无';
            } else if (priceData[item.appid] && priceData[item.appid].hadQueryCard) {
                let tempCardPrice = priceData[item.appid].cardPrice;
                if (!isNaN(tempCardPrice)) {
                    tempCardPrice = (tempCardPrice / 1.15).toFixed(2);
                    cardPrice.innerHTML = tempCardPrice;
                    if (costPrice > 0 && tempCardPrice > costPrice) {
                        cardPrice.setAttribute('style', 'color:red');
                    }
                    //如果有成本价，渲染利润率
                    if (costPrice > 0) {
                        let rate = (tempCardPrice - costPrice) / costPrice;
                        profitRate.innerHTML = (Math.round(rate * 10000) / 100).toFixed(2) + '%';
                        if (rate > 0) {
                            profitRate.setAttribute('style', 'color:red')
                        }
                    }
                } else {
                    cardPrice.innerHTML = '未知';
                }

                if (!isNaN(priceData[item.appid].aveargeSellerCount)) {
                    sellerCount.innerHTML = priceData[item.appid].aveargeSellerCount.toFixed(2);
                }
            } else {
                cardPrice.innerHTML = '查询';
                cardPrice.setAttribute('title', '查询请求较多，点击后需要稍等片刻');
                cardPrice.setAttribute('style', 'text-decoration:underline;cursor: pointer');
                cardPrice.onclick = function () {
                    computeCardPrice(item.appid)
                };
            }

            //如果已查询补充包价格，渲染
            if (!getMarketable(item.appid)) {
                bundleBuyPrice.innerHTML = '无';
            } else if (priceData[item.appid] && priceData[item.appid].hadBooster) {
                let boosterBuyPrice = priceData[item.appid].buyPrice;
                bundleSoldCount.innerHTML = priceData[item.appid].sold !== undefined ? priceData[item.appid].sold : 0;
                if (!isNaN(boosterBuyPrice)) {
                    boosterBuyPrice = (boosterBuyPrice / 1.15).toFixed(2);
                    bundleBuyPrice.innerHTML = boosterBuyPrice;
                    if (costPrice > 0 && boosterBuyPrice > costPrice) {
                        bundleBuyPrice.setAttribute('style', 'color:yellow');
                    }
                } else {
                    bundleBuyPrice.innerHTML = '未知';
                }
            } else {
                bundleBuyPrice.innerHTML = '查询';
                bundleBuyPrice.setAttribute('title', '查询当前补充包最高买单价格，展示税后');
                bundleBuyPrice.setAttribute('style', 'text-decoration:underline;cursor: pointer');
                bundleBuyPrice.onclick = function () {
                    querySingleBoosterPrice(item)
                };
            }

            //历史制作总量
            let madeCount = document.createElement('td');
            let lastMade = document.createElement('td');
            if (cacheInfo.cardInfo[item.appid]) {
                if (cacheInfo.cardInfo[item.appid].madeCount) {
                    madeCount.innerHTML = cacheInfo.cardInfo[item.appid].madeCount;
                } else {
                    madeCount.innerHTML = 0;
                }
                if (cacheInfo.cardInfo[item.appid].lastMade){
                    lastMade.innerHTML = cacheInfo.cardInfo[item.appid].lastMade
                }
            } else {
                madeCount.innerHTML = 0;
            }

            //收藏、移除、移入收藏、加入队列、彻底删除等操作
            let button1;
            let button2;
            let button3;
            if (boosterInfo.game.indexOf(item.appid.toString()) > -1) {
                button1 = generateOperateButton(item, 'boosterToCollect');
                button2 = generateOperateButton(item, 'boosterToOut')
            } else if (boosterInfo.collect.indexOf(item.appid.toString()) > -1) {
                button1 = generateOperateButton(item, 'collectToBooster');
                button2 = generateOperateButton(item, 'collectToOut')
            } else if (boosterInfo.black.indexOf(item.appid.toString()) > -1) {
                button3 = generateOperateButton(item, 'blackToOut');
            } else {
                button1 = generateOperateButton(item, 'outToBooster');
                button2 = generateOperateButton(item, 'outToCollect');
                button3 = generateOperateButton(item, 'outToBlack');

            }
            let button4 = generateOperateButton(item, 'reset');

            let operate = document.createElement('td');
            // operate.setAttribute('style', 'position: sticky;right: 0');

            tr.appendChild(generateTd(imgDiv,'点击进入此游戏物品的市场页面',buildMarketUrl(item.name,item.appid)));
            tr.appendChild(generateTd(name,item.name,'https://store.steampowered.com/app/' + item.appid));
            tr.appendChild(generateTd(availableTime,undefined,undefined));
            tr.appendChild(generateTd(price,undefined,undefined));
            tr.appendChild(generateTd(cost,undefined,undefined));
            tr.appendChild(generateTd(cardPrice,undefined,undefined))
            tr.appendChild(generateTd(sellerCount,undefined,undefined))
            // tr.appendChild(sellPrice);
            tr.appendChild(generateTd(profitRate,undefined,undefined));
            tr.appendChild(generateTd(bundleBuyPrice,undefined,undefined));
            tr.appendChild(generateTd(bundleSoldCount,'补充包日销量',undefined));
            tr.appendChild(generateTd(madeCount,'有记录的此游戏做包总次数',undefined));
            tr.appendChild(generateTd(lastMade,'上次制作时间',undefined));
            if (button1) {
                operate.appendChild(button1);
            }
            if (button2) {
                operate.appendChild(button2)
            }
            if (button3) {
                operate.appendChild(button3)
            }
            operate.appendChild(button4)
            tr.appendChild(operate);
            tbody.appendChild(tr)
        }
    }
    table.appendChild(tbody);

    let tableDiv = document.createElement('div');
    tableDiv.setAttribute('style','width:860px;overflow-x: auto;')
    tableDiv.appendChild(table)
    gameForm.appendChild(tableDiv);

    //计算页数
    totalCount = Math.ceil(searchResult.length / pageSize);

    //上一页按钮
    let beforeButton = document.createElement('button');
    beforeButton.setAttribute('id', 'beforeButton');
    beforeButton.innerHTML = '上一页';

    beforeButton.setAttribute('class', pageNum === 1 ? classObj.disableButton : classObj.enableButton);
    beforeButton.setAttribute('style', 'height: 25px;margin-right: 30px;width: 80px;');
    beforeButton.onclick = function () {
        beforePage()
    };
    gameForm.appendChild(beforeButton);

    let pageSpan = document.createElement('span');
    pageSpan.innerHTML = '共 ' + searchResult.length + ' 个结果， ' + pageNum + ' / ' + totalCount;
    gameForm.appendChild(pageSpan);

    //下一页按钮
    let afterButton = document.createElement('button');
    afterButton.setAttribute('id', 'afterButton');
    afterButton.innerHTML = '下一页';
    afterButton.setAttribute('class', pageNum === totalCount ? classObj.disableButton : classObj.enableButton);
    afterButton.setAttribute('style', 'height: 25px;margin-left: 30px;width: 80px;');
    afterButton.onclick = function () {
        afterPage()
    };
    gameForm.appendChild(afterButton);

    //跳转页输入
    let jumpInput = document.createElement('input');
    jumpInput.setAttribute('id', 'jumpInput');
    jumpInput.setAttribute('style', 'background-color: rgba( 103, 193, 245, 0.2 );color: #fff;border: 1px solid #000;border-radius: 3px;width: 60px;padding: 5px;margin-left: 30px;');
    jumpInput.onchange = function () {
        jumpPage();
    };
    gameForm.appendChild(jumpInput);
    //跳转按钮
    let jumpButton = document.createElement('button');
    jumpButton.setAttribute('id', 'jumpButton');
    jumpButton.innerHTML = '跳转';
    jumpButton.setAttribute('class', classObj.enableButton);
    jumpButton.setAttribute('style', 'height: 25px;margin-left: 30px;width: 80px;');
    jumpButton.onclick = function () {
        jumpPage();
    };
    gameForm.appendChild(jumpButton);
}

function generateTd(element,title,link){
    let tempTd = document.createElement('td');
    tempTd.appendChild(element)
    if (title !== undefined){
        tempTd.setAttribute('title',title)
    }
    if (link !== undefined){
        element.setAttribute('href',link)
        element.setAttribute('target','_blank')
    }
    return tempTd
}

//生成操作按钮
function generateOperateButton(item, type) {
    let button = document.createElement('button');
    button.innerHTML = operateButton[type].text;
    button.setAttribute('class', classObj.enableButton);
    button.setAttribute('style', operateButton[type].style);
    button.setAttribute('id', item.appid.toString() + '+' + type);
    button.setAttribute('title', operateButton[type].desc);
    button.onclick = function () {
        operateGame(item.appid.toString(), type)
    };
    return button
}

//跳转到指定页
function jumpPage() {
    let jumpNum = document.getElementById('jumpInput').value;
    if (isNaN(jumpNum) || stringBlank(jumpNum) || parseInt(jumpNum) < 1) {
        return
    }
    pageNum = parseInt(jumpNum);
    if (pageNum > totalCount) {
        pageNum = 1
    }
    document.getElementById('jumpInput').value = '';
    generateGameList(pageNum, pageSize, searchResult)
}

//上一页
function beforePage() {
    if (pageNum < 2) {
        return
    }
    pageNum = pageNum - 1;
    generateGameList(pageNum, pageSize, searchResult)
}

//下一页
function afterPage() {
    if (pageNum > totalCount - 1) {
        return
    }
    pageNum = pageNum + 1;
    generateGameList(pageNum, pageSize, searchResult)
}

//生成一键做包等
function generateCreateButton() {
    //每次删除后重新创建
    let tempCreate = document.getElementById('createButton');
    if (tempCreate !== null) {
        tempCreate.parentNode.removeChild(tempCreate)
    }
    let tempConvert = document.getElementById('convertButton');
    if (tempConvert !== null) {
        tempConvert.parentNode.removeChild(tempConvert)
    }

    //更新下拉列表
    // noinspection JSAnnotator
    gameSelector.options.length = 0;
    if (boosterInfo.filter) {
        boosterOptions.map((item) => {
            gameSelector.add(item)
        })
    } else {
        backUpOptions.map((item) => {
            gameSelector.add(item)
        })
    }

    //绘制创建按钮
    let createButton = document.createElement('button');
    createButton.setAttribute('title', '只操作补充包队列的游戏（并且自动跳过其中不可交易的游戏）');
    createButton.setAttribute('id', 'createButton');
    createButton.onclick = function () {
        document.getElementById("createButton").setAttribute('class', classObj.disableButton);
        doneList = [];
        createBooster(0)
    };
    let totalCost = countGemsCost();
    if (availableGame.length === 0 || totalCost === 0) {
        createButton.innerHTML = '队列全部冷却中';
        createButton.setAttribute('class', classObj.disableButton)
    } else {
        createButton.innerHTML = '一键制作 ' + availableGame.length + ' 个补充包' + ' ( ' + totalCost + ' ) ';
        createButton.setAttribute('class', classObj.enableButton)
    }
    createButton.setAttribute('style', 'height: 29px; margin-top: 16px;width: 208px;');
    document.getElementsByClassName('booster_game_selector')[0].appendChild(createButton);
    //绘制转换按钮
    let convertButton = document.createElement('button');
    convertButton.setAttribute('id', 'convertButton');
    convertButton.setAttribute('class', classObj.enableButton);
    convertButton.innerHTML = boosterInfo.filter ? '展示全部' : '展示队列';
    convertButton.setAttribute('style', 'height: 29px; margin-top: 16px;width: 80px;margin-left:12px');
    convertButton.onclick = function () {
        boosterInfo.filter = !boosterInfo.filter;
        saveStorage(boosterKey, boosterInfo);
        generateCreateButton()
    };
    document.getElementsByClassName('booster_game_selector')[0].appendChild(convertButton);
}

function notice(message,time) {
    let noticeElement = document.getElementById("notice");
    noticeElement.textContent = message;
    noticeElement.style.display = "block";
    setTimeout(function() {
        noticeElement.style.display = "none";
    }, time === undefined ? 1000 : time);
}


//生成常用工具栏
function generateCommonTool() {
    let toolWindow = document.createElement('div');
    toolWindow.setAttribute('id', 'toolWindow');
    toolWindow.setAttribute('style', 'height:40px;width:100%');

    //常用跳转链接
    let toInventory = generateToolLink('我的库存', document.getElementsByClassName('goostatus_right')[0].childNodes[3].childNodes[1].getAttribute('href'), 8);
    let toMarket = generateToolLink('市场', 'https://steamcommunity.com/market/', 18);
    let steamdb = generateToolLink('steamdb', 'https://steamdb.info', 18);
    let keylol = generateToolLink('其乐', 'https://keylol.com', 18);
    let exportData = generateToolLink('导出', undefined, 18);
    exportData.setAttribute('title', '导出补充包配置数据到剪贴板')
    exportData.onclick = function () {
        let totalData = {}
        totalData[boosterKey] = getStorage(boosterKey)
        totalData[cacheKey] = getStorage(cacheKey)
        navigator.clipboard.writeText(JSON.stringify(totalData))
        notice('补充包数据已复制到剪贴板',1000)
    }
    let importData = generateToolLink('导入', undefined, 18);
    importData.setAttribute('title', '导入补充包数据配置,会覆盖现有数据')
    importData.onclick = function () {
        let data = prompt('请粘贴补充包数据');
        try {
            if (data != null) {
                let totalData = JSON.parse(data);
                if (totalData[boosterKey] !== undefined) {
                    boosterInfo = totalData[boosterKey];
                    saveStorage(boosterKey, boosterInfo);
                }
                if (totalData[cacheKey] !== undefined) {
                    cacheInfo = totalData[cacheKey];
                    saveStorage(cacheKey, cacheInfo);
                }
                notice('导入成功,请刷新页面',1000)
            } else {
                notice('未输入任何信息',1000)
            }
        } catch (e) {
            alert("输入格式不合法,请参考导出功能数据")
        }
    }

    toolWindow.append(toInventory);
    toolWindow.append(toMarket);
    toolWindow.append(steamdb);
    toolWindow.append(keylol);
    toolWindow.append(exportData);
    toolWindow.append(importData);

    boosterPage.insertBefore(toolWindow, gameForm)
}




/**
 * 生成跳转小工具
 * @param name 名称
 * @param link 目标地址
 * @param left 左侧margin
 * @returns {HTMLAnchorElement}
 */
function generateToolLink(name, link, left) {
    let aTag = document.createElement('a');
    aTag.innerHTML = name;
    aTag.setAttribute('style', 'color:green;text-decoration:underline;margin-left:' + left + 'px');
    if (link !== undefined) {
        aTag.setAttribute('href', link);
        aTag.setAttribute('target', '_blank');
    }
    return aTag;
}


//计算一键做包需要的宝石数
function countGemsCost() {
    let totalCost = 0;
    if (availableGame.length > 0) {
        availableGame.map(function (item) {
            if (getMarketable(item.value) && GAME_INFO[item.value] && GAME_INFO[item.value]['price']) {
                totalCost += parseInt(GAME_INFO[item.value]['price'])
            }
        })
    }
    return totalCost
}

//初始化/收藏/移除等操作时，重新构建下拉数据
function buildOptions() {
    collectOptions = [];
    boosterOptions = [];
    availableGame = [];
    outOptions = [];
    blackOptions = [];
    for (let i = 0; i < backUpOptions.length; i++) {
        let item = backUpOptions[i];
        if (item.value) {
            if (boosterInfo.game.indexOf(item.value) > -1) {
                boosterOptions.push(item);
                if (item.getAttribute("class") === "available") {
                    availableGame.push(item)
                }
            } else if (boosterInfo.collect.indexOf(item.value) > -1) {
                collectOptions.push(item)
            } else if (boosterInfo.black.indexOf(item.value) > -1) {
                blackOptions.push(item)
            } else {
                outOptions.push(item)
            }
        }
    }
}

//对游戏的收藏、删除等操作
function operateGame(appid, type) {
    switch (type) {
        case 'outToCollect':
            if (boosterInfo.collect.indexOf(appid) > -1) {
                return
            } else {
                boosterInfo.collect.push(appid)
            }
            break;
        case 'outToBooster':
            if (boosterInfo.game.indexOf(appid) > -1) {
                return
            } else {
                boosterInfo.game.push(appid)
            }
            break;
        case 'collectToOut':
            if (boosterInfo.collect.indexOf(appid) === -1) {
                return
            } else {
                boosterInfo.collect.splice(boosterInfo.collect.indexOf(appid), 1)
            }
            break;
        case 'collectToBooster':
            if (boosterInfo.collect.indexOf(appid) === -1) {
                return
            } else {
                boosterInfo.collect.splice(boosterInfo.collect.indexOf(appid), 1);
                boosterInfo.game.push(appid)
            }
            break;
        case 'boosterToOut':
            if (boosterInfo.game.indexOf(appid) === -1) {
                return
            } else {
                boosterInfo.game.splice(boosterInfo.game.indexOf(appid), 1)
            }
            break;
        case 'boosterToCollect':
            if (boosterInfo.game.indexOf(appid) === -1) {
                return
            } else {
                boosterInfo.game.splice(boosterInfo.game.indexOf(appid), 1);
                boosterInfo.collect.push(appid)
            }
            break;
        case 'outToBlack':
            if (boosterInfo.black.indexOf(appid) > -1) {
                return
            } else {
                boosterInfo.black.push(appid)
            }
            break;
        case 'blackToOut':
            if (boosterInfo.black.indexOf(appid) === -1) {
                return
            } else {
                boosterInfo.black.splice(boosterInfo.black.indexOf(appid), 1);
            }
            break;
        case 'reset':
            cacheInfo.cardInfo[appid] = undefined;
            saveStorage(cacheKey, cacheInfo)
            break;
        default:
            return
    }
    saveStorage(boosterKey, boosterInfo);
    //刷新下拉列表，重新生成按钮和表单
    buildOptions();
    generateCreateButton();
    generateGameList(pageNum, pageSize, searchResult)
}

//从localStorage取值，判断是不是合法的json，如果不是，清除缓存
function getStorage(key) {
    let config = localStorage.getItem(key);
    try {
        if (typeof JSON.parse(config) == "object") {
            return JSON.parse(config);
        } else {
            localStorage.removeItem(key);
            return null;
        }
    } catch (e) {
        localStorage.removeItem(key);
        return null;
    }
}

//将值存入从localStorage
function saveStorage(key, item) {
    localStorage.setItem(key, JSON.stringify(item))
}

//补充包页面初始化
function initBooster() {
    //初始化css
    let domStyle = document.createElement('style');
    domStyle.type = 'text/css';
    domStyle.rel = 'stylesheet';
    domStyle.appendChild(document.createTextNode(initStyle()));
    boosterPage.appendChild(domStyle);

    GAME_INFO = CBoosterCreatorPage.sm_rgBoosterData;
    //没有可以做补充包的游戏，直接返回
    if (!gameSelector || gameSelector.length === 0) {
        return
    }
    let selectOption = document.getElementsByClassName("booster_option")
    if (selectOption) {
        selectOption[0].parentNode.removeChild(selectOption[0])
    }
    //查询宝珠价格，用于计算成本
    getGemsSackPrice();
    //初始化可直接根据appid搜索物品的游戏列表
    getEnableSearchAppList();

    //删除默认展示
    for (let i = gameForm.childNodes.length - 1; i >= 0; i--) {
        gameForm.removeChild(gameForm.childNodes[i]);
    }
    //删除下拉列表第一个‘请选择’
    if (stringBlank(gameSelector.options[0].value)) {
        gameSelector.options.remove(0)
    }
    //从localStorage取用户自定义值，默认为空
    boosterInfo = getStorage(boosterKey);
    if (!boosterInfo) {
        boosterInfo = {
            game: [],
            collect: [],
            black: [],
            filter: true,
            typeIndex: 0,
            sourceIndex: 0,
            customPrice: 2.7,
            timeInterval: 8,
            autoQueryBundle : false
        }
    }
    if (!boosterInfo.game) {
        boosterInfo.game = []
    }
    if (!boosterInfo.collect) {
        boosterInfo.collect = []
    }
    if (!boosterInfo.black) {
        boosterInfo.black = []
    }
    if (boosterInfo.pageSize) {
        pageSize = parseInt(boosterInfo.pageSize)
    }
    if (boosterInfo.customPrice) {
        customSack = boosterInfo.customPrice
    } else {
        boosterInfo.customPrice = 1.6
    }
    if (boosterInfo.timeInterval) {
        interval = boosterInfo.timeInterval
    } else {
        boosterInfo.timeInterval = 8
    }

    //默认将所有信息加入搜索结果
    for (let key in GAME_INFO) {
        searchResult.push(GAME_INFO[key])
    }
    //每个游戏都放入backUpOptions
    for (let i = 0; i < gameSelector.length; i++) {
        backUpOptions.push(gameSelector.options[i])
    }

    //构建collectOptions、boosterOptions、availableGame等
    buildOptions();
    //生成一键制作补充包等按钮
    generateCreateButton();
    //生成常用工具栏
    generateCommonTool();
    //生成下部游戏列表展示
    generateGameList(pageNum, pageSize, searchResult);
    //如果保存的搜索类型不是默认，首先执行一次搜索
    if (boosterInfo.typeIndex !== 0) {
        doSearch()
    }
    //生成提示框div
    let notice = document.createElement('div')
    notice.setAttribute('id', 'notice');
    notice.setAttribute('style', 'position:fixed;top:50%;left:50%;transform: translate(-50%, -50%);padding: 15px 20px;color: orange;border-radius: 5px;display: none;');
    boosterPage.append(notice)
}

//游戏详情页面初始化
function initApp() {
    //查询宝珠价格，用于计算成本
    getGemsSackPrice();
    if (cacheInfo && cacheInfo.cardInfo && cacheInfo.cardInfo[currentAppId] && cacheInfo.cardInfo[currentAppId].name) {
        currentAppName = cacheInfo.cardInfo[currentAppId].name;
    }
}

//全局style修改
function initStyle() {
    return `
            ::-webkit-scrollbar{
                height:30px
            }
            `
}

//初始化数据
function init() {
    console.info("匹配到脚本")

    //取缓存的游戏对应卡牌id值，减少查询缓存
    if (getStorage(cacheKey) == null) {
        cacheInfo = {};
        cacheInfo.cardInfo = {};
        cacheInfo.areaInfo = {};
        cacheInfo.boosterInfo = {};
        cacheInfo.sackItemId = '';
        saveStorage(cacheKey, cacheInfo);
    } else {
        cacheInfo = getStorage(cacheKey);
    }

    let boosterPattern = new RegExp("http[s]?://steamcommunity.com/*tradingcards/boostercreator");
    let appPattern = new RegExp("http[s]?://store.steampowered.com/app/[1-9]*/*");
    let lockAppPattern = new RegExp("http[s]?://store.steampowered.com/agecheck/app/[1-9]*/*");
    let marketPattern = new RegExp("http[s]?://steamcommunity.com/market/*");
    if (boosterPattern.test(window.location.href)) {
        pageLocation = 2;
        initBooster();
    } else if (appPattern.test(window.location.href)) {
        pageLocation = 3;
        currentAppId = window.location.href.match(/app\/(\d+)/)[1];
        currentAppName = document.getElementsByClassName("apphub_AppName")[0].innerHTML
        initApp();
    } else if (lockAppPattern.test(window.location.href)) {
        pageLocation = 4;
        currentAppId = window.location.href.match(/app\/(\d+)/)[1];
        initApp();
    } else if (marketPattern.test(window.location.href)) {
        pageLocation = 5;
        generateSearchMarket();
    }
}

//执行初始化工作
init();