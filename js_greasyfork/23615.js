// ==UserScript==
// @name        Steam Coupons BBcode
// @namespace   https://greasyfork.org/users/34380
// @version     20231111
// @description 批量提取Steam库存优惠券信息，生成表格。（含steamDB、进包、卡牌链接）
// @supportURL  https://keylol.com/t218559-1-1
// @match       https://steamcommunity.com/id/*/inventory*
// @match       https://steamcommunity.com/profiles/*/inventory*
// @connect     steamdb.keylol.com
// @connect     store.steampowered.com
// @connect     gitee.com
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/23615/Steam%20Coupons%20BBcode.user.js
// @updateURL https://update.greasyfork.org/scripts/23615/Steam%20Coupons%20BBcode.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //Styles
    document.querySelector('head').insertAdjacentHTML('beforeend', `<style>
        #coupon-popup {
            width: 100%;
            position: fixed;
            top: 50px;
            justify-content: center;
            display: none;
            z-index: 404;
            pointer-events: none;
        }
        .position-left {
            justify-content: flex-start!important;
        }
        #btn-popup-position {
            width: 40px;
            flex-grow: 0!important;
        }
        #coupon-popup-bg {
            display: flex;
            flex-direction: column;
        }
        #coupon-popup-btn {
            display: flex;
            background-color: #000000;
            pointer-events: auto;
        }
        #coupon-popup-btn > button {
            text-align: center;
            flex-grow: 1;
            letter-spacing: 1px;
        }
        #coupon-popup-text {
            width: 928px;
            height: 300px;
            color: #d7d8d9;
            background-color: #152731;
            pointer-events: auto;
        }
        #coupon-preview {
            max-width: 1010px;
            margin: 0px auto 10px;
            color: #ebebeb;
            background-color: #152731;
        }
        #coupon-preview label {
            padding: 2px;
            margin-right: 3px;
        }
        #coupon-preview label:hover {
            box-shadow: 0px 0px 1px 2px #67c1f5;
            background: linear-gradient( -60deg, #417a9b 5%,#67c1f5 95%);
        }
        #coupon-table {
            width: 100%;
            margin-top: 5px;
            border: 1px solid #C6C4C2;
            border-collapse: collapse;
        }
        #coupon-table td,th {
            height: 24px;
            text-indent: 5px;
            border-color: #C6C4C2;
            border-width: 1px;
            border-style: solid dotted solid dotted;
        }
        #coupon-table th {
            cursor: pointer;
        }
        #coupon-table tr:hover {
            background-color: rgba(255,255,255,0.2);
        }
        #coupon-table td[data-game] span{
            width: 0px;
            z-index: 1;
            float: right;
            position: relative;
            margin-top:-5px;
            display: none;
        }
        #coupon-table td[data-game] img {
            position: absolute;
            margin-top: 27px;
            margin-left: -3px;
        }
        #coupon-table td[data-game]:hover span{
            display: inherit;
        }
        .hidden1,.hidden2,.hidden3 {
            display: none;
        }
        .lower,.wishlist {
            background-color: rgba(0,105,153,0.7);
        }
        .owned {
            background-color: rgba(92,138,0,0.7);
        }
    </style>`);

    document.querySelector('body').insertAdjacentHTML('afterbegin', `
        <div id="coupon-popup">
            <div id="coupon-popup-bg">
                <div id="coupon-popup-btn">
                    <button id="btn-popup-position" class="btnv6_blue_hoverfade">«</button>
                    <button id="btn-popup-names" class="btnv6_blue_hoverfade btn_small"><span>只看游戏名</span></button>
                    <button id="btn-popup-bbcode" class="btnv6_blue_hoverfade btn_small"><span>优惠券表格代码</span></button>
                    <button id="btn-popup-preview" class="btnv6_blue_hoverfade btn_small"><span>预览表格</span></button>
                    <button id="btn-popup-ownwish" class="btnv6_blue_hoverfade btn_small"><span>更新预览模式蓝绿</span></button>
                    <button id="btn-popup-close" class="btnv6_blue_hoverfade btn_small"><span>关闭</span></button>
                </div>
                <textarea id="coupon-popup-text">包含的游戏数量等于已加载时，即加载完成。\n游戏蓝绿每 14 天更新一次，可加载时手动更新，之后再点"优惠券表格代码"。\n等待加载完成，再点"优惠券表格代码"\n复制此文本框内的代码，到论坛粘贴发帖即可。\n超时 10 秒自动重加载，依然无效可再次点击“获取优惠券表格”运行。</textarea>
            </div>
        </div>
    `);



    document.querySelector('.profile_small_header_text').insertAdjacentHTML('beforeend', `
        <a id="btn-run-scbb" class="btnv6_blue_hoverfade btn_small"><span>获取优惠券表格</span></a>
        <span id="scbb-status" style="display:none;">
            <a id="coupon-feedback" class="btnv6_blue_hoverfade btn_small" href="https://keylol.com/forum.php?mod=viewthread&tid=218559&&ordertype=1" target="_blank"><span>反馈</span></a>
            <span title="忽略没有查看按钮的无效券，合并同款游戏不同折扣。"><span id="coupon-total">0</span>张不重复优惠券，包含<span id="coupon-list">0</span>款游戏，已加载<span id="coupon-loaded">0</span>款</span>
        </span>
    `);

    document.querySelector(".profile_small_header_bg").insertAdjacentHTML('afterend', `
        <div id="coupon-preview" style="display:none;">
            <span id="checkbox-cols">
                <label><input id="cb-cut" type="checkbox" value="cut"></input>史低</label>
                <label><input id="cb-origin" type="checkbox" value="origin"></input>原价</label>
                <label><input id="cb-region-us" type="checkbox" value="region-us"></input>美元</label>
                <label><input id="cb-region-cn" type="checkbox" value="region-cn"></input>人民币</label>
                <label><input id="cb-region-hk" type="checkbox" value="region-hk"></input>港币</label>
                <label><input id="cb-region-tw" type="checkbox" value="region-tw"></input>新台币</label>
                <label><input id="cb-region-ru" type="checkbox" value="region-ru"></input>卢布</label>
                <label><input id="cb-region-ar" type="checkbox" value="region-ar"></input>比索</label>
                <label><input id="cb-tr-remove" type="checkbox" value="tr-remove"></input>隐藏按钮</label>
            </span>
            <span id="checkbox-rows">
                <label><input id="cb-tr-higher" type="checkbox" value="tr-higher"></input>高于史低</label>
                <label><input id="cb-tr-not-wishlist" type="checkbox" value="tr-not-wishlist"></input>非愿望单</label>
                <label><input id="cb-tr-owned" type="checkbox" value="tr-owned"></input>已拥有</label>
                <label><input id="cb-preview" type="checkbox" value="preview"></input>预览表格</label>
            </span>
            <table id="coupon-table" class="preview">
                <thead>
                    <tr class="tr-header">
                        <th class="tr-remove hidden2"><span>隐藏</span></th>
                        <th data-col="discount" data-reverse="1">折扣</th>
                        <th class="cut hidden2" data-col="cut" data-reverse="-1">史低</th>
                        <th data-col="game" data-reverse="-1">游戏</th>
                        <th class="region-us origin hidden1 hidden2" data-col="priceus" data-reverse="-1">原价US</th>
                        <th class="region-us hidden2" data-col="couponus" data-reverse="-1">折后US</th>
                        <th class="region-us hidden2" data-col="lowestus" data-reverse="-1">史低US</th>
                        <th class="region-cn origin hidden1 hidden2" data-col="pricecn" data-reverse="-1">原价CN</th>
                        <th class="region-cn hidden2" data-col="couponcn" data-reverse="-1">折后CN</th>
                        <th class="region-cn hidden2" data-col="lowestcn" data-reverse="-1">史低CN</th>
                        <th class="region-hk origin hidden1 hidden2" data-col="pricehk" data-reverse="-1">原价HK</th>
                        <th class="region-hk hidden2" data-col="couponhk" data-reverse="-1">折后HK</th>
                        <th class="region-hk hidden2" data-col="lowesthk" data-reverse="-1">史低HK</th>
                        <th class="region-tw origin hidden1 hidden2" data-col="pricetw" data-reverse="-1">原价TW</th>
                        <th class="region-tw hidden2" data-col="coupontw" data-reverse="-1">折后TW</th>
                        <th class="region-tw hidden2" data-col="lowesttw" data-reverse="-1">史低TW</th>
                        <th class="region-ru origin hidden1 hidden2" data-col="priceru" data-reverse="-1">原价RU</th>
                        <th class="region-ru hidden2" data-col="couponru" data-reverse="-1">折后RU</th>
                        <th class="region-ru hidden2" data-col="lowestru" data-reverse="-1">史低RU</th>
                        <th class="region-ar origin hidden1 hidden2" data-col="pricear" data-reverse="-1">原价AR</th>
                        <th class="region-ar hidden2" data-col="couponar" data-reverse="-1">折后AR</th>
                        <th class="region-ar hidden2" data-col="lowestar" data-reverse="-1">史低AR</th>
                        <th data-col="bundle" data-reverse="-1">进包</th>
                        <th data-col="card" data-reverse="-1">卡牌</th>
                        <th data-col="deadline" data-reverse="-1">有效期</th>
                    </tr>
                </thead><tbody></tbody>
            </table>
        </div>
    `);

    async function xhr(xhr_data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: xhr_data.url,
                responseType: xhr_data.type,
                timeout: 9100,
                onload: (res) => {
                    if (res.status == 502) {
                        console.log(502, xhr_data.url + '? 等待 10 秒。');
                        setTimeout(() => { resolve(xhr(xhr_data)); }, 10000);
                    } else if (res.status == 429) {
                        console.log(429, xhr_data.url + '访问过多等待 5 分钟。');
                        setTimeout(() => { resolve(xhr(xhr_data)); }, 300000);
                    } else {
                        resolve(res);
                    }
                },
                onerror: reject,
                ontimeout: () => { console.log('timeout', xhr_data.url); resolve(xhr(xhr_data)); }
            });
        });
    }

    let inv;
    let is_load_done = false;
    const date_sec = Math.trunc((new Date()).getTime() / 1000);

    async function main() {
        if (!inv) {
            updateOwnWish(false);
            const times = await checkUpdateTime();
            for (const time of times) {
                await updateStorage(time);
            }
            inv = new Inventory();
        }
        // console.log('等待 10 秒，第一次加载前时间间隔。');
        // await new Promise(resolve => setTimeout(resolve, 10000));
        if (!Array.isArray(inv.coupons)) {
            for (let is_continue = true; is_continue;) {
                const data = await inv.getCoupons();
                inv.saveCoupons(data);
                // console.log('等待 10 秒，每次加载库存时间间隔。');
                // await new Promise(resolve => setTimeout(resolve, 10000));
                if (data.last_assetid) {
                    inv.param = "&start_assetid=" + data.last_assetid;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    inv.sortCoupons();
                    is_continue = false;
                }
            }
        }

        if (!is_load_done) {
            let loaded = 0;
            for (const coupon of inv.coupons) {
                const is_stored = coupon.checkStorage();
                if (!is_stored) {
                    try {
                        await coupon.getGameAppid();
                        const data = await coupon.getAppidData();
                        await coupon.saveSubJson(data);
                    } catch (e) {
                        console.log('待处理原因跳过优惠券', coupon, e);
                    }
                }
                loaded += 1;
                $J("#coupon-loaded").text(loaded);
            }
            is_load_done = true;
        }
    }

    function updateOwnWish(is_force) {
        const time_userdata = GM_getValue("time_userdata", 0);
        if ((date_sec - time_userdata) > 1209600 || is_force) {
            xhr({ url: "https://store.steampowered.com/dynamicstore/userdata/", type: "json" }).then((res) => {
                const data = res.response;
                if (data.rgOwnedApps.length) {
                    wishlist = data.rgWishlist;
                    owned_apps = data.rgOwnedApps;
                    owned_subs = data.rgOwnedPackages;
                    GM_setValue("wishlist", data.rgWishlist);
                    GM_setValue("owned_apps", data.rgOwnedApps);
                    GM_setValue("owned_subs", data.rgOwnedPackages);
                    GM_setValue("time_userdata", date_sec);
                    $J('#coupon-popup-text').val('游戏蓝绿更新完成。');
                } else {
                    $J('#coupon-popup-text').val('商店未登录，不能更新游戏蓝绿。');
                }
            });
        }
    }

    function checkUpdateTime() {
        return new Promise((resolve, reject) => {
            xhr({ url: "https://gitee.com/mouse040429/steam-coupons-database/raw/main/updatetime", type: "json" }).then((res) => {
                if (GM_getValue("time_format", 0) !== res.response.format) {
                    GM_listValues().map(GM_deleteValue);
                    GM_setValue("time_format", res.response.format);
                }

                let times = res.response.packs;
                let time_storage = GM_getValue("time_storage", 0);
                times.splice(0, times.indexOf(time_storage) + 1);
                resolve(times);
            }).catch((e) => { reject(e); });
        });
    }

    function updateStorage(time) {
        return new Promise((resolve, reject) => {
            xhr({ url: "https://gitee.com/mouse040429/steam-coupons-database/raw/main/updatepacks/" + time, type: "json" }).then((res) => {
                const subs_json = res.response;
                for (const [k, o] of Object.entries(subs_json)) {
                    GM_setValue(k, o);
                }
                GM_setValue("time_storage", time);
                resolve('updateStorage');
            }).catch((e) => { reject(e); });
        });
    }

    class Inventory {
        constructor() {
            this.url = 'https://steamcommunity.com/inventory/' + UserYou.GetSteamId() + '/753/3?l=schinese&count=5000';
            this.coupons = {};
            this.total = 0;
            this.list = 0;
            this.param = '';
        }
        getCoupons(param) {
            return new Promise((resolve, reject) => {
                xhr({ "url": this.url + this.param, type: "json" }).then((res) => {
                    resolve(res.response);
                }).catch((e) => { reject(e); });
            });
        }
        saveCoupons(data) {
            for (const des of data.descriptions) {
                if (des.actions) {
                    const name = des.name.match(/(\d+)% - (.+)/) || des.descriptions[0].val().match(/(\d+)% - (.+)/);
                    const discount = parseInt(name[1], 10);
                    const subs = des.actions[0].link.replace(/^https?:\/\/store\.steampowered\.com\/search\/\?list_of_subs=/, "");

                    if (subs in this.coupons) {
                        if (this.coupons[subs].discount < discount) {
                            this.coupons[subs].discount = discount;
                        }
                    } else {
                        const expiration = des.item_expiration;
                        const exp_date = new Date(expiration);
                        this.coupons[subs] = new Coupon(discount, exp_date.getTime(), name[2], subs.split(","))
                        this.list += 1;
                    }
                    this.total += 1;
                }
            }
            $J("#coupon-total").text(this.total);
            $J("#coupon-list").text(this.list);
        }
        sortCoupons() {
            this.coupons = Object.values(this.coupons);
            this.coupons.sort(function (a, b) {
                return b.discount - a.discount;
            });
        }
    };




    class Coupon {
        constructor(discount, exp_date, name, subs) {
            this.discount = discount;
            this.exp_date = exp_date;
            this.name = name;
            this.subs = subs;
            this.subid = null;
            this.appid = null;
        }

        checkStorage() {
            for (const sub of this.subs) {
                const sub_json = GM_getValue(sub);
                if (sub_json) {
                    this.subid = parseInt(sub, 10);
                    this.appid = sub_json.id;
                    return true;
                }
            }

            this.subid = parseInt(this.subs[0], 10);
            return false;
        }

        getGameAppid() {
            const that = this;
            return new Promise((resolve, reject) => {
                const generator = generateSequence();
                generator.next();

                function* generateSequence() {
                    for (const sub of that.subs) {
                        yield xhr({ url: "https://store.steampowered.com/api/packagedetails?packageids=" + sub + "&cc=us", type: "json" }).then((res) => {
                            const package_json = res.response[sub];
                            if (package_json.data && package_json.data.apps) {
                                that.subid = sub;
                                that.appid = package_json.data.apps[0].id;
                                resolve('getGameAppid');
                            } else {
                                if (generator.next().done == true) {
                                    throw "优惠券 " + that.name + " https://store.steampowered.com/api/packagedetails?packageids=" + sub + "&cc=us 没有 appid。";
                                }
                            }
                        }).catch((e) => { reject(e); });
                    }
                }
            });
        }

        getAppidData() {
            const that = this;
            return new Promise((resolve, reject) => {
                xhr({ url: "https://steamdb.keylol.com/app/" + that.appid + "/data.js?v=38", type: '' }).then((res) => {
                    const data = res.response.match(/proc\((.*)\)/);
                    if (data) {
                        resolve(data[1]);
                    } else {
                        throw "优惠券 " + that.name + ", " + that.subid + " 数据有误 https://steamdb.keylol.com/app/" + that.appid + "/data.js?v=38";
                    }
                }).catch((e) => { reject(e); });
            });
        }

        saveSubJson(app_data) {
            const app_json = JSON.parse(app_data);
            const price_steam = app_json.price_steam ? app_json.price_steam : {};
            const history = app_json.price_history || {};
            const his_price = history.price || {};
            const his_lowest = history.lowest || {};
            const his_steam = history.steam || {};
            const bundles = history.bundles || { "url": "" };
            const plain = bundles.url.replace("https:\/\/isthereanydeal.com\/game\/", "").replace("\/info\/", "").replace("http://isthereanydeal.com/specials/#/page:game/info?plain=", "");
            const card = app_json.card ? "有" : "无";

            const sub_json = {
                "id": this.appid,
                "cut": his_steam.cut || (his_price.store == "Steam" ? his_price.cut : his_steam.cut),
                "us": parseFloat(price_steam.orig || price_steam.price || (his_price.store == "Steam" ? (his_price.orig || his_price.price) : (his_lowest.store == "Steam" ? (his_lowest.orig || his_lowest.price) : price_steam.price))),
                "cn": his_steam.cn,
                "hk": his_steam.hk,
                "tw": his_steam.tw,
                "ru": his_steam.ru,
                "ar": his_steam.ar,
                "cnt": bundles.count,
                "pln": plain,
                "crd": card
            };
            GM_setValue(this.subid, sub_json);
        }

    }


    const popup = document.querySelector('#coupon-popup');
    const popup_btns = popup.querySelector('#coupon-popup-btn');
    const popup_text = popup.querySelector('#coupon-popup-text');

    const preview = document.querySelector('#coupon-preview');
    const cb_cols = preview.querySelector('#checkbox-cols');
    const cb_rows = preview.querySelector('#checkbox-rows');
    const table = preview.querySelector('#coupon-table');
    const tbody = table.querySelector('tbody');



    // 标记游戏蓝绿
    let wishlist = GM_getValue("wishlist", []);
    let owned_apps = GM_getValue("owned_apps", []);
    let owned_subs = GM_getValue("owned_subs", []);

    // btn2优惠券表格
    let bbcode = '';
    let bbc_names = [];
    let html = '';

    function toTable() {
        if (bbcode == '' && is_load_done) {
            for (const coupon of inv.coupons) {
                const discount = coupon.discount;
                const name = coupon.name;
                const subid = coupon.subid;
                const appid = coupon.appid;

                const CCS = ['us', 'cn', 'hk', 'tw', 'ru', 'ar'];
                const [class_tr_ownwish, class_td_ownwish] = checkOwnWish();

                const table = newTableCols();
                const bbc_tds = [table.discount.bbc, table.cut.bbc, table.name.bbc, table.cn.bbc, table.cn.lowest_bbc, table.hk.bbc, table.tw.bbc, table.ru.bbc, table.ar.bbc, table.bundle.bbc, table.card.bbc, table.expire.bbc];
                bbcode = bbcode + '[tr][td]' + bbc_tds.join('[/td][td]') + '[/td][/tr]\n';

                const html_remove = `<td class="tr-remove hidden2"><button class="btn-remove" type="button"><</button></td>`;
                const html_tds = [table.html_tr, html_remove, table.discount.html, table.cut.html, table.name.html, table.us.html, table.cn.html, table.hk.html, table.tw.html, table.ru.html, table.ar.html, table.bundle.html, table.card.html, table.expire.html];
                html = html + html_tds.join('') + '</tr>';
                bbc_names.push(table.name.bbc);

                function newTableCols() {
                    const json = GM_getValue(subid, {});
                    const len = Object.keys(json).length;
                    const is_lower = json.cut <= discount;
                    const appid = json.id;

                    const obj = {};
                    obj.html_tr = `<tr class="${is_lower ? '' : 'tr-higher'} ${class_tr_ownwish}">`;
                    obj.discount = newDiscount(is_lower);
                    obj.cut = newCut(json.cut);
                    obj.name = newName(len);
                    obj.bundle = newBundle(json.cnt, json.pln);
                    obj.card = newCard(len, json.crd);
                    obj.expire = newTime();

                    CCS.forEach((cc) => {
                        obj[cc] = newPrice(cc, json[cc], json.cut, is_lower);
                    });
                    obj.cn.lowest_bbc = len ? `[url=https://steamdb.info/app/${appid}]¥${obj.cn.lowest || '-'}[/url]` : `[url=https://steamdb.info/sub/${subid}/apps/]¥-[/url]`;
                    return obj;
                }

                function newDiscount(is_lower) {
                    return {
                        "bbc": is_lower ? `[backcolor=Wheat]-${discount}%[/backcolor]` : `-${discount}%`,
                        "html": `<td class="${is_lower ? ' lower' : ''}" data-discount="${discount}">-${discount}%</td>`
                    }
                }

                function newCut(cut) {
                    return {
                        "bbc": `-${cut || '-'}%`,
                        "html": `<td class="cut hidden2" data-cut="${(cut || 0)}">-${(cut || "-")}%</td>`
                    };
                }

                function newName(len) {
                    const name_int = (name.toLowerCase().replace(/[^a-z\d]*/g, "") + "000").substring(0, 4);
                    const name_sum = parseInt(name_int, 36);
                    const ele_a = `<a target="_blank" href="https://store.steampowered.com/${len ? 'app/' + appid : 'sub/' + subid}">${name}</a>`
                    return {
                        "bbc": `[url=https://store.steampowered.com/${len ? 'app/' + appid : 'sub/' + subid}/]${name}[/url]`,
                        "html": `<td class="${class_td_ownwish}" data-game="${name_sum}">${ele_a}<span><img src="https://media.st.dl.pinyuncloud.com/steam/apps/${appid}/header.jpg"></span></td>`
                    }
                }

                function newBundle(count, plain) {
                    return {
                        "bbc": count > 0 ? `[url=https://isthereanydeal.com/game/${plain}/info/]${count}[/url]` : (count == 0 ? `[backcolor=Wheat][url=https://isthereanydeal.com/game/${plain}/info/]${count}[/url][/backcolor]` : '-'),
                        "html": `<td data-bundle="${(count || 0)}"><a target="_blank" href="https://isthereanydeal.com/game/${plain}/info/">${(count == null ? "-" : count)}</a></td>`
                    };
                }

                function newCard(len, card) {
                    return {
                        "bbc": len ? `[url=https://www.steamcardexchange.net/index.php?gamepage-appid-${appid}]${card || '-'}[/url]` : '-',
                        "html": `<td data-card="${(card == "无" ? 1 : 0)}"><a target="_blank" href="https://www.steamcardexchange.net/index.php?gamepage-appid-${appid}">${(card || "-")}</a></td>`
                    };
                }

                function newTime() {
                    const date = new Date((coupon.exp_date + 8 * 60 * 60 * 1000));
                    const matched = date.toJSON().match(/\d+-(\d+-\d+)T(\d+):/);
                    const date_cn = matched[1] + "," + matched[2] + "时";
                    return {
                        "bbc": date_cn,
                        "html": `<td data-deadline="${coupon.exp_date}">${date_cn}</td>`
                    };
                }

                function newPrice(cc, price, cut, is_lower) {
                    const symbol = { 'cn': '¥', 'ru': '₽' };
                    const coupon = price ? minDigit(cc, Math.floor((100 - discount) * price) / 100) : 0;
                    const lowest = price ? minDigit(cc, Math.floor((100 - cut) * price) / 100) : 0;
                    return {
                        "origin": price,
                        "coupon": coupon,
                        "lowest": lowest,
                        "bbc": is_lower ? `[backcolor=Wheat]${symbol[cc] || ''}${coupon || '-'}[/backcolor]` : `${symbol[cc] || ''}${coupon || '-'}`,
                        "html": `<td class="region-${cc} origin hidden1 hidden2" data-price${cc}="${(price || 0)}">${(price || "-")}</td>
                            <td class="region-${cc} hidden2${is_lower ? ' lower' : ''}" data-coupon${cc}="${coupon}">${(coupon || "-")}</td>
                            <td class="region-${cc} hidden2" data-lowest${cc}="${lowest}"><a target="_blank" href="https://steamdb.info/app/${appid}">${(lowest || "-")}</a></td>`
                    };
                }

                function checkOwnWish() {
                    if (appid) {
                        if (owned_apps.includes(appid)) {
                            return [" tr-not-wishlist tr-owned", "owned"];
                        } else if (wishlist.includes(appid)) {
                            return ["", "wishlist"];
                        }
                    } else if (!appid && owned_subs.includes(subid)) {
                        return [" tr-not-wishlist tr-owned", "owned"];
                    }
                    return [" tr-not-wishlist", ""];
                }

                function minDigit(cc, num) {
                    const INTCCS = ['tw', 'ru'];
                    if (Number.isInteger(num)) {
                        return num;
                    } else if (INTCCS.includes(cc)) {
                        return Math.floor(num);
                    } else {
                        return num.toFixed(1);
                    }
                }
            }

            bbc_names = bbc_names.join("\n");
            tbody.innerHTML = html;

            const cb_col_checkeds = GM_getValue("cb_checked", ["cb-cut", "cb-origin", "cb-region-cn"]);
            cb_col_checkeds.forEach((v) => {
                cb_cols.querySelector("#" + v).dispatchEvent(new MouseEvent("click", { bubbles: true }));
            });

            const cb_row_checkeds = ['cb-tr-higher', 'cb-tr-not-wishlist', 'cb-tr-owned', 'cb-preview'];
            cb_row_checkeds.forEach((v) => {
                cb_rows.querySelector("#" + v).checked = true;
            });

        }
        popup_text.value = "[table]\n[tr][td]折扣[/td][td]史低[/td][td]游戏[/td][td]折后CN[/td][td]史低[/td][td]折后HK[/td][td]折后TW[/td][td]折后RU[/td][td]折后AR[/td][td]进包[/td][td]卡牌[/td][td]有效期[/td][/tr]\n" + bbcode + "[/table]";
    }

    // 弹出框功能
    popup_btns.querySelector('#btn-popup-position').addEventListener('click', (event) => {
        event.target.innerText = event.target.innerText == '«' ? '»' : '«';
        popup.classList.toggle('position-left');
    });
    popup_btns.querySelector('#btn-popup-names').addEventListener('click', () => { popup_text.value = bbc_names; });
    popup_btns.querySelector('#btn-popup-bbcode').addEventListener('click', toTable);
    popup_btns.querySelector('#btn-popup-preview').addEventListener('click', () => { preview.style.display = 'inherit'; });
    popup_btns.querySelector('#btn-popup-ownwish').addEventListener('click', () => { updateOwnWish(true); });
    popup_btns.querySelector('#btn-popup-close').addEventListener('click', () => { popup.style.display = 'none'; });

    document.querySelector('#btn-run-scbb').addEventListener('click', () => {
        main();
        window.scrollTo(0, 140);
        document.querySelector("#scbb-status").style.display = 'inline';
        popup.style.display = 'flex';
    });


    //预览功能 - 多选框
    cb_cols.addEventListener('click', (event) => {
        if (event.target.nodeName == 'INPUT') {
            const value = event.target.value;
            if (value == 'origin') {
                preview.querySelectorAll('.' + value).forEach((node) => { node.classList.toggle('hidden1'); });
            } else {
                preview.querySelectorAll('.' + value).forEach((node) => { node.classList.toggle('hidden2'); });
            }

            if (is_load_done) {
                let checkeds = [];
                cb_cols.querySelectorAll("input:checked").forEach((node) => {
                    checkeds.push(node.id);
                });
                GM_setValue("cb_checked", checkeds);
            }
        }
    });

    cb_rows.addEventListener('click', (event) => {
        if (event.target.nodeName == 'INPUT') {
            const hidden = {
                'tr-higher': 'hidden1',
                'tr-not-wishlist': 'hidden2',
                'tr-owned': 'hidden3',
                'preview': 'hidden1'
            }
            const value = event.target.value;
            preview.querySelectorAll('.' + value).forEach((node) => { node.classList.toggle(hidden[value]); });
        }
    });

    //预览功能 - 表格标题排序和"隐藏"列

    table.querySelector('thead > tr').addEventListener('click', function (event) {
        const target = event.target;
        if (target.nodeName == 'TH') {
            const col = target.getAttribute('data-col');
            let reverse = target.getAttribute('data-reverse');
            let sorted;
            if (reverse == 0) {
                sorted = Array.from(tbody.querySelectorAll('tr')).sort((a, b) => b.querySelector('td[data-' + col + ']').getAttribute('data-' + col) - a.querySelector('td[data-' + col + ']').getAttribute('data-' + col));
                const siblings = this.querySelectorAll('[data-reverse="1"]');
                target.setAttribute('data-reverse', '1');
                siblings.forEach((node) => { node.setAttribute('data-reverse', '0'); });
            } else {
                sorted = Array.from(tbody.querySelectorAll('tr')).sort((a, b) => a.querySelector('td[data-' + col + ']').getAttribute('data-' + col) - b.querySelector('td[data-' + col + ']').getAttribute('data-' + col));
                const siblings = this.querySelectorAll('[data-reverse="0"]');
                target.setAttribute('data-reverse', '0');
                siblings.forEach((node) => { node.setAttribute('data-reverse', '1'); });
            }
            sorted.forEach((node)=>{
                tbody.insertAdjacentElement('beforeend', node);
            });
        }
    });

    tbody.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-remove')) {
            event.target.parentNode.parentNode.remove();
        }
    });
})();