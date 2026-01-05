// ==UserScript==
// @name         Steam Play Next
// @namespace    https://greasyfork.org/users/34380
// @version      20231012
// @description  接下来畅玩。导入分类文件，随机挑选库存游戏。
// @supportURL   https://keylol.com/t218559-1-1
// @match        https://store.steampowered.com/app/*
// @run-at       document-idle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/28397/Steam%20Play%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/28397/Steam%20Play%20Next.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.querySelector('head').insertAdjacentHTML('beforeend', `<style>
            #spn-setting { max-width:940px; margin:auto;  display:flex; flex-wrap:wrap; font-size:16px; }
            #spn-setting, #spn-option { outline:auto; }
            #spn-setting input[type="checkbox"] { margin-right:3px; }
            #spn-option { width:370px; }
            #spn-option > div { margin:5px 0px 10px 5px; }
            #spn-option input[type="text"] { margin-right:10px;  padding:1px 5px; }
            #spn-option input[type="number"] { width:50px; margin:0px 5px;  padding:1px 5px; }
            #spn-option button { margin-right:10px;  padding:0px 5px; font-size:14px; }
            #items-cbs { width:fit-content; }
            #appid-cancel-ignored { width:110px; }
            #tags-container { width:calc(100% - 370px); min-width:330px; }
            #tags-edit-btns { margin:5px 0px 0px 10px; }
            #tags-edit-btns > button { margin:0px 20px 10px 0px; padding:0px 10px; font-size:14px; }
            #tags-getapplist { margin:0px 0px 0px 10px; }
            #tags-getapplist > * { margin:0px 0px 10px 0px; }
            #tags-cbs { max-width:536px; margin:0px 0px 5px 10px; column-count:2; }
            #tags-cbs > label, #items-cbs > label { display:block; padding:2px 0px 2px 0px; word-wrap:break-word; }
            #tags-cbs > label:hover, #items-cbs > label:hover { background-color:gray; }
            #spn-fixed { width:100%; position:fixed; bottom:0; z-index:403; }
            #spn-fixed > div { max-width:940px; margin:auto; display:flex; align-items:end; flex-wrap:wrap-reverse; }
            #log-img img { width:100%; margin:3px 0px;}
            .spn-log-auto { color:red; }
            #ignore-or-skip > div { width:calc(50% - 130px); max-width:32px; height:75px; }
            #ignore-or-skip > button { width:122px; min-width:80px; height:75px; font-size:xx-large; }
            .hidden-setting { height:34px; overflow:hidden; }
            div[data-featuretarget="events-row"] { word-wrap:break-word; white-space:pre-wrap; color:#ddd; }
            div[data-featuretarget="events-row"] details { margin:3px 0px; }
            div[data-featuretarget="events-row"] summary { background-color:rgba(84, 107, 115,0.5); }
            div[data-featuretarget="events-row"] summary:hover { background-color:#2b6384; }
            div[data-featuretarget="events-row"] img { width:100%; }
            .glance_tags.popular_tags { display:contents; }
        </style>
        <style id="spn-hide0"></style>
        <style id="spn-hide1"></style>
        <style id="spn-style01">
            #spn-log { width:calc(50% - 480px); max-width:400px; height:100%; position:fixed; right:calc(50% + 475px); }
            #log-txt { height:40%; font-size:14px; padding:5px; overflow-y:scroll; background-color:#334051; }
            #log-txt:hover { width:995px; word-wrap:break-word; }
            #log-img { height:60%; overflow-y:scroll; }
            #ignore-or-skip { position:fixed; left:calc(50% + 475px); top:calc(65% - 225px); }
        </style>`);

    const tab_grid = document.querySelector('#tabletGrid');
    tab_grid.insertAdjacentHTML('afterbegin', `
        <div id="spn-setting" class="hidden-setting">
            <div id="spn-option">
                <div><button id="btn-collapse-setting">展开折叠设置</button><input id="input-sharedconfig" type="file"/></div>
                <div>预加载 3～9 个游戏<input id="num-preload" type="number" value="3" min="3" max="9" title="不用改，除非多次快速地点跳过"></div>
                <div>
                    <input id="appid-cancel-ignored" type="text" placeholder="取消忽略的 appid" value="" min="0" step="1" />
                    <button id="btn-cancel-ignored" type="button">取消这个忽略</button>
                    <button id="btn-clear-ignored" type="button">清除全部忽略</button>
                </div>
                <div><label><input id="cb-toggle-style" type="checkbox" />切换风格</label></div>
                <div><label><input id="cb-offline" type="checkbox" />下架游戏加入永远忽略</label></div>
                <div><label><input id="cb-played" type="checkbox" />跳过已玩</label> 时间大于<input id="time-skip" type="number" value="20" min="0" step="0.1" />小时</div>
                <div id="items-cbs">
                    <button id="btn-items-save">保存隐藏项</button>
                    <button id="btn-items-all">全选</button>
                    <button id="btn-items-reverse">反选</button>
                    <label><input class="item-cb" type="checkbox" value=".queue_overflow_ctn" />隐藏查看您的队列</label>
                    <label><input class="item-cb" type="checkbox" value=".referring_curator_ctn" />隐藏鉴赏家评测</label>
                    <label><input class="item-cb" type="checkbox" value="#purchase_note" />隐藏购买注意事项</label>
                    <label><input class="item-cb" type="checkbox" value=".game_area_comingsoon" />隐藏即将推出</label>
                    <label><input class="item-cb" type="checkbox" value="#earlyAccessHeader" />隐藏抢先体验游戏</label>
                    <label><input class="item-cb" type="checkbox" value=".game_area_purchase_game" />隐藏Demo或免费下载</label>
                    <label><input class="item-cb" type="checkbox" value=".game_area_purchase_game_wrapper:not(:has(.package_contents))" />隐藏购买本体</label>
                    <label><input class="item-cb" type="checkbox" value=".game_area_purchase_game_wrapper:not(.dynamic_bundle_description)" />隐藏购买礼包</label>
                    <label><input class="item-cb" type="checkbox" value=".game_area_purchase_game_wrapper.dynamic_bundle_description" />隐藏购买捆绑包</label>
                    <label><input class="item-cb" type="checkbox" value="#gameAreaDLCSection" />隐藏DLC</label>
                    <label><input class="item-cb" type="checkbox" value='div[data-featuretarget="events-row"]' />隐藏近期活动与公告</label>
                    <label><input class="item-cb" type="checkbox" value=".early_access_banner" />隐藏查看所有讨论</label>
                    <label><input class="item-cb" type="checkbox" value="#game_area_reviews" />隐藏官方评测</label>
                    <label><input class="item-cb" type="checkbox" value=".game_area_description:not(#game_area_description):not(#game_area_reviews)" />隐藏官方推荐内容</label>
                    <label><input class="item-cb" type="checkbox" value="#aboutThisGame" />隐藏关于这款游戏</label>
                    <label><input class="item-cb" type="checkbox" value="#game_area_content_descriptors" />隐藏成人内容描述</label>
                    <label><input class="item-cb" type="checkbox" value=".sys_req" />隐藏系统需求</label>
                    <label><input class="item-cb" type="checkbox" value=".steam_curators_block" />隐藏鉴赏家点评</label>
                    <label><input class="item-cb" type="checkbox" value=".responsive_apppage_details_right.heading,.recommendation_reasons" />隐藏您对这款游戏感兴趣吗</label>
                    <label><input class="item-cb" type="checkbox" value="#category_block" />隐藏特色功能</label>
                    <label><input class="item-cb" type="checkbox" value=".responsive_apppage_details_right:has(#LanguagesHeader)" />隐藏语言支持</label>
                    <label><input class="item-cb" type="checkbox" value="#achievement_block" />隐藏成就</label>
                    <label><input class="item-cb" type="checkbox" value="#appDetailsUnderlinedLinks" />隐藏右下官方链接</label>
                    <label><input class="item-cb" type="checkbox" value="#apppage_metacritic_block" />隐藏metacritic评测</label>
                    <label><input class="item-cb" type="checkbox" value="#awardsTable" />隐藏奖项</label>
                </div>
            </div>
            <div id="tags-container">
                <div id="tags-edit-btns">
                    <button id="btn-tags-save">保存</button>
                    <button id="btn-tags-all">全选</button>
                    <button id="btn-tags-reverse">反选</button>
                    <button id="btn-reload">重新加载</button>
                    <button id="btn-tags-appids">输出游戏列表</button>
                    <label><input id="cb-two-column" type="checkbox" checked="" />分列</label>
                </div>
                <div id="tags-getapplist" style="display:none;">
                    <p>要获取 appid 对应的游戏名，需要先下载 GetAppList 文件，然后点击下面的“浏览”按钮添加文件，最后点“输出游戏名列表”，大小约 10MB。https://api.steampowered.com/ISteamApps/GetAppList/v2</p>
                    <input id="input-getapplist" type="file" ><button id="btn-tags-names">输出游戏名列表</button>
                </div>
                <div id="tags-cbs">拖放 sharedconfig 文件到这里</div>
            </div>
        </div>
        <div id="spn-fixed" style="display:none;"><div>
            <div id="spn-log"><div id="log-txt"></div><div id="log-img"></div></div>
            <div id="ignore-or-skip">
                <div></div><button id="game-skip" class="btnv6_lightblue_blue btnv6_border_2px" type="button">跳过</button>
                <div></div><button id="game-ignore" class="btnv6_lightblue_blue btnv6_border_2px" type="button">忽略</button>
            </div>
        </div></div>
    `);

    // left option
    const spn_setting = tab_grid.querySelector('#spn-setting');
    const spn_option = spn_setting.querySelector('#spn-option');

    spn_option.querySelector('#btn-collapse-setting').addEventListener('click', () => {
        spn_setting.classList.toggle('hidden-setting');
    });

    spn_option.querySelector('#btn-clear-ignored').addEventListener('click', () => {
        GM_setValue('apps_ignored', []);
    });
    spn_option.querySelector('#btn-cancel-ignored').addEventListener('click', () => {
        const appid = spn_setting.querySelector('#appid-cancel-ignored').value;
        const index = apps_ignored.indexOf(parseInt(appid, 10));
        if (index > -1) {
            apps_ignored.splice(index, 1);
            GM_setValue('apps_ignored', apps_ignored);
        }
    });

    spn_option.querySelector('#cb-toggle-style').addEventListener('click', function () {
        const style0 = `#spn-log { width:calc(50% - 480px); max-width:400px; height:100%; position:fixed; right:calc(50% + 475px); }
            #log-txt { height:40%; font-size:14px; padding:5px; overflow-y:scroll; background-color:#334051; }
            #log-txt:hover { width:995px; word-wrap:break-word; }
            #log-img { height:60%; overflow-y:scroll; }
            #ignore-or-skip { position:fixed; left:calc(50% + 475px); top:calc(65% - 225px); }`;
        const style1 = `#spn-log { width:calc(100% - 160px); max-width: 616px; }
            #log-txt { height:75px; font-size:14px; padding:5px; overflow-y:scroll; background-color:#334051; }
            #log-txt:hover { height:380px; word-wrap:break-word; }
            #log-img { width:calc(50% - 480px); max-width:400px; height:100%; position:fixed; right:calc(50% + 475px); overflow-y:scroll; }
            #ignore-or-skip { width:calc(100% - 616px); max-width:324px;  display:flex; backdrop-filter:blur(20px); }`;
        document.querySelector('head > #spn-style01').innerText = this.checked ? style1 : style0;
    });

    // checkbox hidden
    const items_cbs = spn_option.querySelector('#items-cbs');
    items_cbs.addEventListener('click', function (event) {
        if (event.target.className == 'item-cb') {
            updateStyleHide();
        }
    });

    items_cbs.querySelector('#btn-items-save').addEventListener('click', () => {
        const checkeds = [];
        items_cbs.querySelectorAll('.item-cb:checked').forEach(cb => {
            checkeds.push(cb.value);
        });
        GM_setValue('item_checkeds', checkeds);
    });

    items_cbs.querySelector('#btn-items-all').addEventListener('click', () => {
        items_cbs.querySelectorAll('.item-cb:not(:checked)').forEach(cb => {
            cb.checked = true;
        });
        updateStyleHide();
    });

    items_cbs.querySelector('#btn-items-reverse').addEventListener('click', () => {
        items_cbs.querySelectorAll('.item-cb').forEach(cb => {
            cb.checked = !cb.checked;
        });
        updateStyleHide();
    });

    function updateStyleHide() {
        const checkeds = [];
        const hidden_cbs = items_cbs.querySelectorAll('.item-cb');
        hidden_cbs.forEach(cb => {
            if (cb.checked) {
                checkeds.push(cb.value);
            }
        });
        document.querySelector('head > #spn-hide1').innerText = checkeds.join(',') + '{display:none;}';
    }

    // right tags
    const tags_container = spn_setting.querySelector('#tags-container');
    const tags_edit_btns = tags_container.querySelector('#tags-edit-btns');
    const tags_cbs = tags_container.querySelector('#tags-cbs');
    tags_edit_btns.querySelector('#btn-tags-save').addEventListener('click', () => {
        let tag_checkeds = [];
        tags_cbs.querySelectorAll('.tag-cb:checked').forEach(cb => {
            tag_checkeds.push(cb.value);
        });
        GM_setValue("tag_checkeds", tag_checkeds);
    });

    tags_edit_btns.querySelector('#btn-tags-all').addEventListener('click', () => {
        tags_cbs.querySelectorAll('.tag-cb:not(:checked)').forEach(cb => {
            cb.checked = true;
        });
    });

    tags_edit_btns.querySelector('#btn-tags-reverse').addEventListener('click', () => {
        tags_cbs.querySelectorAll('.tag-cb').forEach(cb => {
            cb.checked = !cb.checked;
        });
    });

    tags_edit_btns.querySelector('#cb-two-column').addEventListener('click', function () {
        tags_cbs.style.columnCount = this.checked ? 2 : 1;
    });

    tags_edit_btns.querySelector('#btn-tags-appids').addEventListener('click', function () {
        tags_container.querySelector('#tags-getapplist').style.display = '';
        let str = '';
        tags_cbs.querySelectorAll('.tag-cb:checked').forEach((cb) => {
            str = `${str}<p>${cb.value} 里的游戏：</p><p>${catalog[cb.value]}</p>`
        });
        logTxt(str);
    });

    // reload
    tags_edit_btns.querySelector('#btn-reload').addEventListener('click', () => {
        let tag_checkeds = [];
        tags_cbs.querySelectorAll('.tag-cb:checked').forEach((cb) => {
            tag_checkeds.push(cb.value);
        });

        apps = [];
        tag_checkeds.forEach((tag) => {
            catalog[tag].forEach((appid) => {
                if (!apps.includes(appid)) {
                    apps.push(appid);
                }
            });
        });

        apps = shuffle(apps);
        logTxt('<p>开始加载</p>');

        index_g = 0;
        index_l = 0;
        apps_div0 = [];
        const num_preload = parseInt(document.querySelector('#num-preload').value, 10);
        const t = setInterval(() => {
            if (apps_div0.length < num_preload && index_g < apps.length) {
                getNext(index_g);
            } else {
                clearInterval(t);
            }
        }, 2000);
        loadNext(0);
    });

    // right getapplist
    const applist = {};
    tags_container.querySelector("#input-getapplist").addEventListener("change", (event) => {
        event.target.files[0].text().then((res) => {
            const json = JSON.parse(res);
            json.applist.apps.forEach((app) => {
                applist[app.appid] = app.name;
            });
        });
    });

    tags_container.querySelector("#btn-tags-names").addEventListener("click", (event) => {
        const arr = [];
        let str = '';
        tags_cbs.querySelectorAll('.tag-cb:checked').forEach((cb) => {
            str = `${str}<p>${cb.value} 里的游戏：</p>`;
            catalog[cb.value].forEach((appid) => {
                console.log(applist[appid]);
                const aname = applist[appid];
                if (aname) {
                    const code = (aname.toLowerCase().replace(/[^a-z\d]*/g, "") + "000").substring(0, 4);
                    arr.push([parseInt(code, 36), `<p><a href="https://store.steampowered.com/app/${appid}" target="_blank">${aname}<a></p>`]);
                } else {
                    arr.push([0, `<p><a href="https://store.steampowered.com/app/${appid}" target="_blank">${appid}<a></p>`]);
                }
            });
            arr.sort((a, b) => {
                return a[0] - b[0];
            });
            arr.forEach((item) => {
                str = str + item[1];
            });
        });
        logTxt(str);
    });

    // input file
    const input_sc = spn_option.querySelector("#input-sharedconfig");
    input_sc.addEventListener("change", (event) => {
        loadFileSc(event.target.files[0]);
    });

    tags_container.addEventListener("dragover", (event) => { event.preventDefault(); });
    tags_container.addEventListener("drop", (event) => {
        event.preventDefault();
        const dt = event.dataTransfer;
        input_sc.files = dt.files;
        loadFileSc(dt.files[0]);
    });

    let catalog;
    function loadFileSc(file) {
        spn_fixed.style.display = '';
        const item_checkeds = GM_getValue('item_checkeds', []);
        const style_str = item_checkeds.join(',');
        document.querySelector('head > #spn-hide0').innerText = `/*库中已有，评测，全系列，相关产品，类似产品，，点数市场，分享嵌入，超小屏遮挡*/.game_area_already_owned, .game_area_play_stats, .franchise_notice, #franchise_block, #recommended_block, #responsive_apppage_reviewblock_ctn, .responsive_apppage_details_right:has(.communitylink_points_shop_images), #shareEmbedRow, .newmodal_background, #reviewSettingsPopupCtn{ display:none; }`;
        document.querySelector('head > #spn-hide1').innerText = style_str + '{display:none!important;}';
        item_checkeds.forEach((item) => {
            items_cbs.querySelector(`label > input[value='${item}']`).checked = true;
        });

        tags_cbs.innerHTML = "";
        catalog = { "未分类": [] };
        file.text().then((res) => {
            const file_apps = strToObj(res).Software.valve.steam.apps;
            const appids = Object.keys(file_apps);
            appids.forEach(appid => {
                if (!file_apps[appid].hidden) {
                    const tags_obj = file_apps[appid].tags;
                    if (file_apps[appid].tags) {
                        const tags = Object.values(tags_obj);
                        tags.forEach(tag => {
                            if (!(tag in catalog)) {
                                catalog[tag] = [];
                            }
                            catalog[tag].push(appid);
                        });
                    } else { catalog["未分类"].push(appid); }
                }
            });

            catalog = formatCatalog(catalog);

            let str2 = '';
            const tag_checkeds = GM_getValue('tag_checkeds', []);
            const len = tag_checkeds.length;
            const tags = Object.keys(catalog);
            tags.sort();
            tags.forEach(tag => {
                const is_checked = !len || tag_checkeds.includes(tag);
                str2 = str2 + `<label title="${tag}"><input class="tag-cb" type="checkbox" value="${tag}" ${is_checked ? "checked" : ""} />${tag}(${catalog[tag].length})</label>`;
            });
            tags_cbs.insertAdjacentHTML('beforeend', str2);

            function formatCatalog(catalog) {
                const cata = {};
                Object.keys(catalog).forEach(tag => {
                    cata[tag.replace(/"/g, "'")] = catalog[tag];
                });
                return cata;
            }

            function strToObj(str) {
                const reg = /.*[\r\n]{1,2}/g;
                const r_key = /[\s]+"(\S+)"(.*)/;
                const r_value = /[\s]+"(.+)"\s*$/;
                const r_cbrace = /[\s]+}/;
                let result;
                return newNode();

                function newNode() {
                    const node = {};
                    let mat_kv;
                    let mat_v;
                    while (result = reg.exec(str)) {
                        if (mat_kv = result[0].match(r_key)) {
                            if (mat_v = mat_kv[2].match(r_value)) {
                                node[mat_kv[1]] = mat_v[1];
                            } else {
                                node[mat_kv[1]] = newNode();
                            }
                        } else if (result[0].match(r_cbrace)) {
                            return node;
                        }
                    }
                    return node;
                }
            }
        });
    }

    const cb_offline = spn_setting.querySelector('#cb-offline');
    const cb_played = spn_setting.querySelector('#cb-played');
    const time_skip = spn_setting.querySelector('#time-skip');

    let apps = [];
    const apps_ignored = GM_getValue('apps_ignored', []);
    const apps_skipped = [];
    let index_g = 0;
    let index_l = 0;

    let apps_div0 = [];
    const div1 = document.querySelector('.game_title_area');
    const div2 = document.querySelector('.game_media_and_summary_ctn');
    const div3 = document.querySelector('.page_content[data-panel="[]"]');
    const div4 = document.querySelector('#app_reviews_hash');

    function getNext(index) {
        if (!(index < apps.length)) { return; }
        index_g++;
        const appid = apps[index];
        $J.get('https://store.steampowered.com/app/' + appid, function (data) {
            const html = (new DOMParser()).parseFromString(data, 'text/html');
            const title = html.title;
            const div0 = html.querySelector('#tabletGrid > .page_content_ctn');
            if (div0) {
                if (!cb_played.checked) {
                    pushDiv0(appid, div0);
                } else {
                    const time_played = div0.querySelector('.recommendation_reasons > .info:first-child').innerText.replace(',', '').match(/(\d+(\.\d)?)/);
                    if (!time_played || (parseFloat(time_played[1]) < parseFloat(time_skip.value))) {
                        pushDiv0(appid, div0);
                    } else {
                        const aname = div0.querySelector('#appHubAppName').innerText;
                        autoSkip(0, appid, aname, time_played[1]);
                    }
                }
            } else if (title == '欢迎来到 Steam') {
                autoSkip(1, appid, title);
            } else if (title == '站点错误') {
                autoSkip(2, appid, title);
            } else if (html.querySelector('.age_gate')) {
                autoSkip(3, appid, title);
            }
        });
    }

    function pushDiv0(appid, div0) {
        $J.get('https://store.steampowered.com/feeds/news/app/' + appid + '/?cc=CN&l=schinese', function (xml) {
            let str = '<h2>近期活动与公告</h2>';
            xml.querySelectorAll('item').forEach((item) => {
                const date = (new Date(item.querySelector('pubDate').textContent)).toLocaleDateString();
                const title = item.querySelector('title').textContent;
                const description = item.querySelector('description').textContent;
                const content = description.replace(/clan\.st\.dl\.eccdnx\.com/g, "clan.cloudflare.steamstatic.com");
                str = str + `<details><summary>${date}   ${title}</summary><div>${content}</div></details>`
            });
            div0.querySelector('div[data-featuretarget="events-row"]').innerHTML = str;
            div0.querySelectorAll('.app_tag').forEach((tag) => { tag.style = ''; });
            apps_div0.push(div0);
        });
    }

    function loadNext(index) {
        if (!(index < apps.length)) { logTxt('<p>已全部加载</p>'); return; }
        const div0 = apps_div0[index];
        if (div0) {
            index_l++;
            div1.innerHTML = div0.querySelector('.game_title_area').innerHTML;
            div2.innerHTML = div0.querySelector('.game_media_and_summary_ctn').innerHTML;
            div3.innerHTML = div0.querySelector('.page_content[data-panel="[]"]').innerHTML;
            div4.innerHTML = div0.querySelector('#app_reviews_hash').innerHTML;
            const text = div0.querySelector('#highlight_player_area > script').innerText;
            const str = text.slice(text.indexOf('{'), text.indexOf('}') + 1);
            unsafeWindow.rgScreenshotURLs = JSON.parse(str);
            unsafeWindow.player = new HighlightPlayer({
                elemPlayerArea: 'highlight_player_area',
                elemStrip: 'highlight_strip',
                elemStripScroll: 'highlight_strip_scroll',
                elemSlider: 'highlight_slider',
                rgScreenshotURLs: rgScreenshotURLs
            });
            getNext(index_g);
            setTimeout(() => {
                ClearReviewTypeFilter();
            }, 1000);
        } else {
            setTimeout(() => {
                loadNext(index);
            }, 3000);
        }
    }

    function autoSkip(flag, appid, aname, time) {
        if (flag == 0) {
            logTxt(`<p class="spn-log-auto">[自动跳过] <a href="https://store.steampowered.com/app/${appid}" target="_blank">${aname.replace(/"/g, "'")}</a> 游戏时间：${time} 小时</p>`);
        } else if (flag == 1) {
            if (cb_offline.checked) {
                apps_ignored.push(appid);
                GM_setValue('apps_ignored', apps_ignored);
                logTxt(`<p class="spn-log-auto">[自动忽略] <a href="https://steamdb.info/app/${appid}" target="_blank">${appid}</a> 已下架</p>`);
            } else {
                logTxt(`<p class="spn-log-auto">[自动跳过] <a href="https://steamdb.info/app/${appid}" target="_blank">${appid}</a> 已下架</p>`);
            }
        } else if (flag == 2) {
            logTxt(`<p class="spn-log-auto">[自动跳过] <a href="https://steamdb.info/app/${appid}" target="_blank">${appid}</a> 锁区</p>`);
        } else {
            $J.get('https://store.steampowered.com/api/appdetails?appids=' + appid + '&l=english', function (data) {
                logTxt(`<p class="spn-log-auto">[自动跳过] <a href="https://store.steampowered.com/app/${appid}" target="_blank">${data[appid].data.name}</a> 有限制内容，需验证年龄</p>`);
            });
        }
        logImg(appid);
        apps_skipped.push(appid);
        getNext(index_g);
    }

    // position fixed
    const spn_fixed = tab_grid.querySelector('#spn-fixed');
    const log_txt = spn_fixed.querySelector('#log-txt');
    function logTxt(str) {
        log_txt.insertAdjacentHTML('beforeend', str);
        log_txt.scrollTo(0, log_txt.scrollHeight);
    }
    const log_txt_img = spn_fixed.querySelector('#log-img');
    function logImg(appid) {
        log_txt_img.insertAdjacentHTML('afterbegin', `<a href="https://store.steampowered.com/app/${appid}" target="_blank"><img src="https://media.st.dl.eccdnx.com/steam/apps/${appid}/header.jpg" /></a>`);
    }

    spn_fixed.querySelector('#game-ignore').addEventListener('click', () => {
        window.scrollTo(0, document.querySelector('.page_content_ctn').offsetTop + 8);
        const appid = div1.querySelector('.blockbg > a:nth-last-child(1)').href.match(/\d+/)[0];
        const aname = div1.querySelector('#appHubAppName').innerText;
        logTxt(`<p>[忽略] <a href="https://store.steampowered.com/app/${appid}" target="_blank">${aname.replace(/"/g, "'")}</a></p>`);
        apps_skipped.push(apps[index_g]);
        apps_ignored.push(apps[index_g]);
        GM_setValue('apps_ignored', apps_ignored);
        loadNext(index_l);
    });
    spn_fixed.querySelector('#game-skip').addEventListener('click', () => {
        window.scrollTo(0, document.querySelector('.page_content_ctn').offsetTop + 8);
        const appid = div1.querySelector('.blockbg > a:nth-last-child(1)').href.match(/\d+/)[0];
        const aname = div1.querySelector('#appHubAppName').innerText;
        logTxt(`<p>[跳过] <a href="https://store.steampowered.com/app/${appid}" target="_blank">${aname.replace(/"/g, "'")}</a></p>`);
        apps_skipped.push(apps[index_g]);
        loadNext(index_l);
    });

    function shuffle(array) {
        let m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }
})();