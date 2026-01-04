// ==UserScript==
// @name        EPIC白嫖小助手
// @description 每1小时检测一次是否有可以白嫖的epic游戏
// @namespace   https://bbs.tampermonkey.net.cn/
// @version     0.1.9
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
// @crontab     0 * * * *
// @license     GPLv3
// @match undefined
// @downloadURL https://update.greasyfork.org/scripts/427822/EPIC%E7%99%BD%E5%AB%96%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427822/EPIC%E7%99%BD%E5%AB%96%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

let url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=zh-Hant&country=CN&allowCountries=CN,HK";

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


return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
        url: url,
        responseType: "json",
        onload: async (resp) => {
            if (resp.status != 200) {
                GM_notification("epic白嫖失败,网站检测错误:" + resp.status);
                resolve();
            } else {
                let games = [];
                let msg = ""
                let elements = resp.response.data.Catalog.searchStore.elements;
                let itemInLibrary = GM_getValue("item_in_library", {});
                console.log("get::item_in_library", itemInLibrary, Object.keys(itemInLibrary).length);
                //超过10个清空存储
                itemInLibrary = Object.keys(itemInLibrary).length > 10 ? {} : itemInLibrary;
                console.log("now_item_in_library", itemInLibrary);
                for (const key in elements) {
                    //本身不免费,现在免费了
                    if (elements[key].price.totalPrice.originalPrice && !elements[key].price.totalPrice.discountPrice) {
                        //活动还在且未购买
                        if (elements[key].status == "ACTIVE" && !Object.keys(itemInLibrary).includes(elements[key].id)) {
                            msg += elements[key].title + "; "
                            let img = "";
                            for (const imgkey in elements[key].keyImages) {
                                if (elements[key].keyImages[imgkey].type == "DieselStoreFrontWide") {
                                    img = elements[key].keyImages[imgkey].url;
                                    break;
                                }
                            }
                            games.push({
                                title: elements[key].title,
                                url: "https://www.epicgames.com/store/zh-Hant/p/" + elements[key].urlSlug,
                                id: elements[key].id,
                                image: img,
                            });
                        }
                    }
                }
                console.log("found_games", games);
                let parser = new DOMParser();
                console.log("req_start");
                await Promise.all(games.map(game => request({ url: game.url }))).then(resArr => {
                    console.log("req_end", resArr);
                    for (let i in resArr) {
                        //已购标识
                        let match = /(?<="diesel.common.button.in_library"\s*:\s*")[^,"]+(?=",)/.exec(resArr[i].responseText);
                        let in_library_ctx = "\error";
                        if (match) {
                            in_library_ctx = match[0];
                        }
                        //购买状态
                        let status = parser.parseFromString(resArr[i].response, "text/html").querySelector("[data-component=PurchaseCTA]")?.innerText;
                        console.log(resArr[i].finalUrl, in_library_ctx, status);
                        if (in_library_ctx === status) {
                            itemInLibrary[games[i].id] = games[i].title;
                        }
                    }
                })
                //更新已购列表
                GM_setValue("item_in_library", itemInLibrary);
                console.log("update_value", GM_getValue("item_in_library"));
                //删选已购买
                games = games.filter(game => !Object.keys(itemInLibrary).includes(game.id));
                if (!games.length) {
                    return resolve();
                }
                console.log(games[0].image);
                GM_notification({
                    title: "今日白嫖名单",
                    text: msg,
                    buttons: [{
                        title: "我知道了"
                    }, { title: "马上去白嫖" }],
                    onclick(id, btn) {
                        if (btn === 1) {
                            for (let key in games) {
                                GM_openInTab(games[key].url);
                            }
                        }
                        GM_closeNotification(id);
                        resolve();
                    },
                    timeout: 10 * 1000,
                    ondone(click, id) {
                        if (!click) {
                            resolve();
                        }
                    }
                });
            }
        },
        onerror() {
            GM_notification("epic白嫖失败,网络异常");
            resolve();
        }
    });
});