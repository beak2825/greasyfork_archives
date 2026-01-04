// ==UserScript==
// @name         Red Leaves Games Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  Red Leaves Games Section Helper
// @author       Rey5,zhoubanxian
// @match        https://*.leaves.red/gamedb.php?action=new*
// @match        https://*.leaves.red/gamedb.php?action=edit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leaves.red
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/470480/Red%20Leaves%20Games%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/470480/Red%20Leaves%20Games%20Assistant.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const table = document.querySelector('table.game');
    const EL = ElementPlus.ElMessage;
    const EM = ElementPlus.ElMessageBox;
    const scriptVer = GM_info.script.version;

    let [btn_id, input_id] = [0, 0];
    function tr(d1, d2, at_row = 0) {
        let newRow = table.insertRow(at_row);
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        cell1.className = 'rowhead nowrap';
        cell2.className = 'rowfollow';
        cell1.innerHTML = d1;
        cell2.innerHTML = d2;
    }
    function btn(name, id = "") {
        id = id ?? `_rl_btn_${btn_id++}`;
        return `<button aria-disabled="false" id="${id}" type="button" class="el-button button-new-tag _rl_game_button"><span>${name}</span></button>`;

    }
    function t(vars, ...arg) {
        let res = '';
        vars.forEach(f => {
            if (typeof f === 'function') {
                res += f(...arg);
            } else res += f
        });
        return res;

    }
    function genres_to_category(gl) {
        if (gl.includes('Fighting') || gl.includes('格斗')) return 429;
        if (gl.includes('Music') || gl.includes('音乐')) return 430;
        if (gl.includes('Platformer') || gl.includes('平台')) return 431;
        if (gl.includes('Sports') || gl.includes('运动')) return 433;
        if (gl.includes('Third-Person Shooter') || gl.includes('第三人称射击游戏')) return 432;
        if (gl.includes('FPS') || gl.includes('FPS')) return 432;
        if (gl.includes('Strategy') || gl.includes('策略')) return 434;
        if (gl.includes('Simulation') || gl.includes('模拟')) return 438;
        if (gl.includes('Adventure') || gl.includes('冒险')) return 437;
        if (gl.includes('RPG') || gl.includes('角色扮演')) return 436;
        if (gl.includes('Action') || gl.includes('动作')) return 428;
        return 435;
    }

    function input(placeholder = '输入内容', id = "", type = 'text') {
        id = id ?? `_rl_input_${input_id++}`;
        return `<div class="el-input__wrapper"><input class="el-input__inner _rl_game_input" style="width:450px;" type="text" autocomplete="off" tabindex="0" placeholder="${placeholder}" id="${id}"></div>`;

    }
    function on(selector = '', fn, e = 'click') {
        const el = document.querySelector(selector);
        if (el) {
            switch (e) {
                case 'click':
                    el.onclick = () => fn(el);
                    break;
            }
        }
    }
    function get_appid(url) {
        return !isNaN(parseInt(url)) ? parseInt(url) : ((url) => {
            let match = /\/(\d+)\b/.exec(url)
            return match && match[1] ? match[1] : null;
        })(url);
    }
    const space = (n) => '&nbsp;'.repeat(n);
    const s = space;
    const _eo = { showIcon: true };
    const info = (t) => EL.info({ message: t, ..._eo });
    const success = (t) => EL.success({ message: t, ..._eo });
    const error = (t) => EL.error({ message: t, ..._eo });
    const get_text = (s) => document.querySelector(s).innerText;
    const get = (s, t = 'value') => document.querySelector(s)[t];
    const steam_api_url = 'https://store.steampowered.com/api/appdetails/?appids=';
    const dot_get = (obj, path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, obj);
    const attemp = (fn) => { try { fn.apply() } catch { } };

    tr('Steam或IndieNova数据填写', t([
        input('Steam/IndieNova商店页面地址', '_rl_steam_input'),
        s(3),
        btn('获取', '_rl_steam_fetch')
    ]));
    if (__RL_GAME__.form.url) document.querySelector('#_rl_steam_input').value = __RL_GAME__.form.url
    success(`RLGame脚本已成功加载,当前版本 ${scriptVer}`);
    on('#_rl_steam_fetch', (e) => {
        if (get('#_rl_steam_input').indexOf('steam') !== -1) {
            let appid = get_appid(get('#_rl_steam_input'));
            info(`开始获取数据,appid = ${appid}`)
            GM_xmlhttpRequest({
                method: "GET",
                url: steam_api_url + `${appid}&l=english`,
                onload: function (response) {
                    // 处理响应数据
                    var data = JSON.parse(response.responseText);
                    var appData = Object.values(data)[0];
                    if (appData.success === true) {
                        const form = __RL_GAME__.form;
                        const game = appData.data;
                        success('成功获取到数据')
                        form.title = game.name;
                        form.achievements = dot_get(game, 'achievements.total');
                        form.genres = game.genres.map(i => i.description);
                        form.categories = game.categories.map(i => i.description);
                        attemp(() => { form.description = '<p>' + game.short_description + '</p>' + game.detailed_description + '<br>'; })
                        let pc_req, mac_req, lnx_req, _data;
                        if (pc_req = dot_get(game, 'pc_requirements.minimum'))
                            form.description += '<br><h3>PC Minimum Requirements</h3>' + pc_req;
                        if (mac_req = dot_get(game, 'mac_requirements.minimum'))
                            form.description += '<br><h3>MAC Minimum Requirements</h3>' + mac_req;
                        if (lnx_req = dot_get(game, 'linux_requirements.minimum'))
                            form.description += '<br><h3>Linux Minimum Requirements</h3>' + lnx_req;
                        form.category = genres_to_category(form.cateogires + form.genres).toString();
                        form.platforms = [];
                        if (dot_get(game, 'platforms.windows')) form.platforms.push('WIN');
                        if (dot_get(game, 'platforms.mac')) form.platforms.push('MAC');
                        if (dot_get(game, 'platforms.linux')) form.platforms.push('LNX');
                        if (_data = dot_get(game, 'publishers')) form.publisher = _data;
                        console.log(_data)
                        if (_data = dot_get(game, 'developers')) form.developers = _data;
                        const filterAndTrim = (input) => input.split(',').map(item => item.trim().replace(/<[^>]+>.*$/g, '')).filter(item => item !== '');
                        const formatDate = inputDate => new Date(inputDate).toISOString().split('T')[0];

                        if (_data = dot_get(game, 'supported_languages')) form.languages = filterAndTrim(_data);
                        if (_data = dot_get(game, 'release_date.date')) form.published = formatDate(_data);

                        form.url = `https://store.steampowered.com/app/${appid}`;
                        form.image = dot_get(game, 'header_image') ?? null;
                        form.meta_score = dot_get(game, 'metacritic.score') ?? null;
                        if (game.screenshots) {
                            const dealWithScreenShot = s => s.path_full.replace(/\?t=\d+$/, '');
                            form.screenshots = game.screenshots.map(dealWithScreenShot).join("\n")
                        }
                        if (game.movies) {
                            const dealWithMovie = s => `${s.name},${s.webm.max.replace(/\?t=\d+$/, '')}`
                            form.promo_url = game.movies.map(dealWithMovie).join("\n")
                        }
                        success('表单填写完成，等待刷新视图')
                        setTimeout(() => {
                            __RL_GAME__.update()
                            success('视图刷新完毕')
                        }, 1000);
                    } else {
                        return error('获取数据失败')
                    }
                }
            });
            GM_xmlhttpRequest({
                method: "GET",
                url: steam_api_url + `${appid}&l=chinese`,
                onload: function (response) {
                    // 处理响应数据
                    var data = JSON.parse(response.responseText);
                    var appData = Object.values(data)[0];
                    if (appData.success === true) {
                        const form = __RL_GAME__.form;
                        const game = appData.data;
                        success('成功获取到中文数据')
                        if (!form.aliases.includes(game.name) && form.title.trim() != game.name.trim()) form.aliases.push(game.name);
                        form.cn_description = '<p>' + game.short_description + '</p>' + game.detailed_description + '<br>';
                        let pc_req, mac_req, lnx_req;
                        if (pc_req = dot_get(game, 'pc_requirements.minimum'))
                            form.cn_description += '<br><h3>PC最低运行要求</h3>' + pc_req;
                        if (mac_req = dot_get(game, 'mac_requirements.minimum'))
                            form.cn_description += '<br><h3>MAC最低运行要求</h3>' + mac_req;
                        if (lnx_req = dot_get(game, 'linux_requirements.minimum'))
                            form.cn_description += '<br><h3>Linxu最低运行要求</h3>' + lnx_req;

                    } else {
                        return error('获取中文数据失败')
                    }
                }
            });
        }
        if (get('#_rl_steam_input').indexOf('indienova') !== -1) {
            let url = get('#_rl_steam_input')
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    const form = __RL_GAME__.form;
                    success('成功获取到数据')
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(response.responseText, "text/html");
                    const images = htmlDoc.querySelectorAll("img");
                    images.forEach(img => {
                        img.setAttribute("src", img.getAttribute("src").replace(/^\/\//, "https://"));
                        img.setAttribute("referrerpolicy", "no-referrer");
                    });

                    var titleElement = htmlDoc.querySelector('.game-db-title h1');
                    var childNodes = titleElement.childNodes;
                    var cn_title = '';
                    var en_title = '';
                    for (var i = 0; i < childNodes.length; i++) {
                        var node = childNodes[i];
                        if (node.nodeType === Node.TEXT_NODE) {
                            cn_title += node.textContent.trim();
                        }
                        if (node.nodeName === 'SPAN') {
                            en_title = node.textContent.trim();
                        }
                    }
                    form.title = en_title;
                    form.aliases.push(cn_title)
                    success('中、英标题装载完成')
                    form.cn_description = htmlDoc.querySelector('div article').textContent;
                    success('简介装载完成')
                    form.developers = [htmlDoc.querySelector('#tabs-devpub > div > div:nth-child(1) > ul > li > a').textContent];
                    form.publisher = [htmlDoc.querySelector('#tabs-devpub > div > div:nth-child(2) > ul > li > a').textContent];
                    success('开发、发行商装载完成')
                    const category = htmlDoc.querySelectorAll("#tabs-intro > div.row > div:nth-child(1) > p:nth-child(1) > a");
                    const categoryText = Array.from(category).map(category => category.textContent.trim()).join(",");
                    form.category = genres_to_category(categoryText).toString()
                    success('标签装载完成')
                    const genres = htmlDoc.querySelectorAll("#tabs-intro > div.row > div:nth-child(2) > p:nth-child(2) > a");
                    form.genres = Array.from(genres).map(genres => genres.textContent.trim());
                    const platformElements = htmlDoc.querySelectorAll('.gamedb-platform-text');
                    form.platforms = [];
                    platformElements.forEach(element => {
                        if (element.textContent == 'Windows') form.platforms.push('WIN');
                        if (element.textContent == 'Mac') form.platforms.push('MAC');
                        if (element.textContent == 'Linux') form.platforms.push('LNX');
                        if (element.textContent == 'PlayStation') form.platforms.push('PS');
                        if (element.textContent == 'PlayStation 3') form.platforms.push('PS3');
                        if (element.textContent == 'PlayStation 4 (PS4)') form.platforms.push('PS4');
                        if (element.textContent == 'PlayStation 5 (PS5)') form.platforms.push('PS5');
                        if (element.textContent == 'XBOX') form.platforms.push('XBOX');
                        if (element.textContent == 'XBOX360') form.platforms.push('XBOX360');
                        if (element.textContent == 'Nintendo Switch') form.platforms.push('NS');
                        if (element.textContent == 'Android (安卓)') form.platforms.push('ANDROID');
                        if (element.textContent == 'iOS') form.platforms.push('iPhone');
                    });
                    success('适用平台装载完成')
                    form.published = htmlDoc.querySelector('#indienova-gamedb > div:nth-child(4) > div > div.col-sm-5.col-md-4 > ul > li:nth-child(1) > p > small').textContent;
                    const imagesUrl = htmlDoc.querySelectorAll('#imageSlideShow a');
                    form.promo_url = Array.from(imagesUrl).map(link => link.href).filter(href => href.endsWith('.mp4')).join('\n');
                    form.screenshots = Array.from(imagesUrl).map(link => link.href).filter(href => !href.endsWith('.mp4')).join('\n');
                    form.image = htmlDoc.querySelector('.cover-image.cover-image-fix.hidden-ms.hidden-xs').querySelector('img').src;
                    success('图片、视频资源装载完成')
                    setTimeout(() => {
                        __RL_GAME__.update()
                        success('视图刷新完毕')
                    }, 1000);
                }
            });
        }

    });


    // Your code here...
})();