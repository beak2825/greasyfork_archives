// ==UserScript==
// @name        EPIC白嫖小助手
// @description 每1小时检测一次是否有可以白嫖的epic游戏
// @namespace   https://bbs.tampermonkey.net.cn/
// @version     0.1.23
// @author      CodFrm,Cosil
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_closeNotification
// @grant       GM_openInTab
// @grant       GM_getValue
// @grant       GM_setValue
// @storageName   find_epic_free_games
// @connect     store-site-backend-static.ak.epicgames.com
// @connect     www.epicgames.com
// @crontab     * once * * *
// @license     GPLv3
// @match undefined
// @downloadURL https://update.greasyfork.org/scripts/456318/EPIC%E7%99%BD%E5%AB%96%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/456318/EPIC%E7%99%BD%E5%AB%96%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

let url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=zh-Hant&country=CN&allowCountries=CN,HK";

    console.log("开始执行检查 - " + new Date().toLocaleString());
function request(option) {
    return new Promise((resolve, reject) => {
        option.onload = (res) => {
            if (res.status != 200) {
                reject();
            }
            resolve(res)
        };
        option.onerror = () => { reject() };
        GM_xmlhttpRequest(option);
    })
}
function toDataURL(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    // callback(reader.result);
                    resolve(reader.result)
                }
                reader.readAsDataURL(xhr.response);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    })
}

return new Promise((resolve, reject) => {
    console.log("开始执行检查 - " + new Date().toLocaleString());

    GM_xmlhttpRequest({
        url: url,
        responseType: "json",
        onload: async (resp) => {
            try {
                if (resp.status != 200) {
                    GM_notification({
                        title: "Epic 检测失败",
                        text: "网站检测错误:" + resp.status + "，5分钟后重试"
                    });
                    // 5分钟后重试
                    reject(new CATRetryError("请求失败: " + resp.status, 300));
                    return;
                }

                let games = [];
                let msg = ""
                let elements = resp.response.data.Catalog.searchStore.elements;
                let itemInLibrary = GM_getValue("item_in_library", {});
                // console.log("get::item_in_library", itemInLibrary, Object.keys(itemInLibrary).length);
                //超过10个清空存储
                // itemInLibrary = Object.keys(itemInLibrary).length > 10 ? {} : itemInLibrary;
                console.log("now_item_in_library", itemInLibrary);
                for (const key in elements) {
                    //本身不免费,现在免费了
                    //2022年12月22日活动产品原价是0 elements[key].price.totalPrice.originalPrice &&  
                    if (!elements[key].price.totalPrice.discountPrice) {
                        //Mystery Game 跳过神秘游戏 Mystery Game Day 4
                        // if (elements[key].title == "Mystery Game") {
                        if (elements[key].title.indexOf("Mystery Game") >= 0) {
                            continue;
                        }
                        if (new Date(elements[key].effectiveDate) > new Date()) {
                            //过滤还未发售的游戏
                            continue;
                        }
                        //输出游戏信息
                        console.log(elements[key].title, elements[key].status, Object.keys(itemInLibrary).includes(elements[key].id))

                        //活动还在且未购买
                        if (elements[key].status == "ACTIVE" && !Object.keys(itemInLibrary).includes(elements[key].id)) {// 
                            msg += elements[key].title + "; "
                            let img = "";
                            let imagedata = elements[key].keyImages.find(elem => elem.pageType === "DieselStoreFrontWide");
                            if (!imagedata) {
                                imagedata = elements[key].keyImages[0];
                            }
                            if (imagedata) {
                                img = imagedata.url;
                            }

                            var productSlug = "";
                            if (elements[key].catalogNs.mappings && elements[key].catalogNs.mappings.find(elem => elem.pageType === "productHome")) {
                                productSlug = elements[key].catalogNs.mappings.find(elem => elem.pageType === "productHome").pageSlug;
                            }
                            else if (elements[key]["productSlug"]) {
                                productSlug = elements[key]["productSlug"];
                            } else {
                                GM_notification("epic白嫖失败,获取游戏链接失败!");
                                continue;
                            }

                            switch (elements[key].offerType) {
                                case "BUNDLE":
                                    games.push({
                                        title: elements[key].title,
                                        url: "https://store.epicgames.com/zh-CN/bundles/" + productSlug,
                                        id: elements[key].id,
                                        image: img,
                                    });
                                    break;
                                default:
                                    games.push({
                                        title: elements[key].title,
                                        url: "https://store.epicgames.com/zh-CN/p/" + productSlug,
                                        id: elements[key].id,
                                        image: img,
                                    });
                                    break;
                            }


                        }
                    }
                }
                console.log("found_games", games);
                let parser = new DOMParser();
                console.log("req_start");
                await Promise.all(games.map(game => request({ 
                    url: game.url,
                    headers: { 
                        "accept": "application/json, text/plain, */*", 
                        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,zh-HK;q=0.5,ko;q=0.4,ru;q=0.3,ja;q=0.2", 
                        "priority": "u=1, i", 
                        "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"", 
                        "sec-ch-ua-mobile": "?0", 
                        "sec-ch-ua-platform": "\"Windows\"", 
                        "sec-fetch-dest": "empty", 
                        "sec-fetch-mode": "cors", 
                        "sec-fetch-site": "same-site", 
                        "x-requested-with": "XMLHttpRequest" 
                    },
                    method: "GET",
                    referrer: game.url,
                    referrerPolicy: "no-referrer-when-downgrade",
                    mode: "cors",
                    credentials: "omit"
                }))).then(resArr => {
                    console.log("req_end", resArr);
                    for (let i in resArr) {
                        var html = resArr[i].responseText;
                        var tempElement = document.createElement('div');
                        tempElement.innerHTML = html;


                        // 获取游戏描述等其他信息的代码...
                        var epicClientState = tempElement.querySelector('script').innerText.match(/window\.__REACT_QUERY_INITIAL_QUERIES__\s*=\s*({.*?});/);
                        if (epicClientState) {
                            var parsedEpicClientState = JSON.parse(epicClientState[1]);
                            console.log(parsedEpicClientState);
                            var getCatalogOffer = parsedEpicClientState.queries.filter(t => t.queryKey[0] == "getCatalogOffer");
                            if (getCatalogOffer && getCatalogOffer.length) {

                                games[i].description = getCatalogOffer[0].state.data.Catalog.catalogOffer.title + "_" + getCatalogOffer[0].state.data.Catalog.catalogOffer.description;
                            }
                        }


                        // 方法1：直接检查购买按钮状态
                        const purchaseButton = tempElement.querySelector('[data-testid="purchase-cta-button"] span span');
                        const isInLibrary = purchaseButton && purchaseButton.textContent.trim() === "已在库中";

                        // 方法2：备用检测方法（原有逻辑）
                        let match = /(?<="diesel.common.button.in_library"\s*:\s*")[^,"]+(?=",)/.exec(html);
                        let in_library_ctx = match ? match[0] : "\error";
                        let status = tempElement.querySelector("[data-testid=add-to-cart-cta-button]")?.innerText;

                        // 如果任一方法检测到游戏在库中，则标记为已拥有
                        if (isInLibrary || (in_library_ctx === status)) {
                            itemInLibrary[games[i].id] = games[i].title;
                            console.log("已在库中", games[i].title);
                            continue; // 跳过后续处理
                        }
                    }
                })
                //更新已购列表
                GM_setValue("item_in_library", itemInLibrary);
                console.log("update_value", GM_getValue("item_in_library"));
                //删选已购买
                games = games.filter(game => !Object.keys(itemInLibrary).includes(game.id));
                if (!games.length) {
                    console.log("没有找到可以白嫖的游戏.....");
                    return resolve();
                }
                // console.log(games[0].image);
                for (const key in games) { //转换为base64
                    try {
                        games[key].image = await toDataURL(games[key].image)
                    } catch {
                        games[key].image = "";
                    }
                }
                for (const key in games) {
                    GM_notification({
                        title: "今日白嫖名单-" + games[key].title,
                        text: games[key].description,
                        image: games[key].image,//TODO 图像下载失败会照成消息无法弹出
                        buttons: [{ title: "已白嫖,不在提示" }, { title: "马上去白嫖" }],//只能存在2个
                        onclick(id, btn) {
                            if (btn === 1) {
                                GM_openInTab(games[key].url);
                            } if (btn === 0) {//已白嫖,不在提示
                                itemInLibrary[games[key].id] = games[key].title;
                                //更新已购列表
                                GM_setValue("item_in_library", itemInLibrary);
                            }
                            GM_closeNotification(id);
                            resolve();
                        },
                        timeout: 20 * 1000,
                        ondone(click) {
                            if (!click) {
                                resolve();
                            }
                        }
                    });
                    await new Promise(resolve => setTimeout(resolve, 1000 * 3)); //等待3秒在弹出下一个
                }
            } catch (error) {
                debugger
                console.error("处理数据时出错:", error);
                GM_notification({
                    title: "Epic 检测出错",
                    text: "处理数据时出错，3分钟后重试"
                });
                // 3分钟后重试
                reject(new CATRetryError("处理数据出错: " + error.message, 180));
            }
        },
        onerror: (error) => {
            console.error("网络请求失败:", error);
            GM_notification({
                title: "Epic 网络错误",
                text: "网络请求失败，1分钟后重试"
            });
            // 1分钟后重试
            reject(new CATRetryError("网络请求失败", 60));
        }
    });
});