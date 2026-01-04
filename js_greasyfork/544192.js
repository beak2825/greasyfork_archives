// ==UserScript==
// @name                榭洛科特的背包 Beta
// @version             0.2.4
// @author              Alk
// @license             GPL-3.0
// @description         榭洛科特的背包测试版
// @match               https://*.granbluefantasy.jp/*
// @match               https://gbf.game.mbga.jp/*
// @grant               unsafeWindow
// @grant               GM_registerMenuCommand
// @grant               GM_setValue
// @grant               GM_getValue
// @run-at              document-start
// @namespace           https://greasyfork.org/users/1455240
// @icon                https://raw.githubusercontent.com/enorsona/thirdparty/refs/heads/master/sherurotes_carrybag.ico
// @downloadURL https://update.greasyfork.org/scripts/544192/%E6%A6%AD%E6%B4%9B%E7%A7%91%E7%89%B9%E7%9A%84%E8%83%8C%E5%8C%85%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/544192/%E6%A6%AD%E6%B4%9B%E7%A7%91%E7%89%B9%E7%9A%84%E8%83%8C%E5%8C%85%20Beta.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置默认值
    const defaults = {
        refresh_attack: true,
        hide_left_sb: false,
        hide_right_sb: false,
        refresh_koenig_dekret: false,
        refresh_coronal_ejection: false,
        refresh_secret_triad: false,
        hunter_mode: false,
        contribution: 1800000,
        enable_filter: false,
        enable_auto_auto: false,
        filter_by_asc: false,
        hide_hp_less_than: 50,
        hide_member_more_than: 8,
        replace_refresh_with_back: false,
        allow_auto_redirect: false,
        auto_redirect_hash: '',
        random_factor_1: 20,
        random_factor_2: 25,
        random_factor_3: 25,
        hunt_mode_ratio: 100,
        normal_mode_ratio: 100,
        current_hash: '',
    };

    // 战斗结果 JSON 文件名集合
    const battleSet = new Set([
        'normal_attack_result.json',
        'ability_result.json',
        'fatal_chain_result.json',
        'summon_result.json'
    ]);

    // 获取配置值
    function getCfg(key) {
        return GM_getValue(key, defaults[key]);
    }

    // 切换配置并刷新页面
    function toggleCfg(key) {
        const val = !getCfg(key);
        GM_setValue(key, val);
        // 切换后立即刷新以生效
        window.location.reload();
    }

    function setHash(hash = location.hash) {
        GM_setValue('auto_redirect_hash', hash);
        window.location.reload();
    }

    function setHunterMode() {
        // 切换猎金模式
        const curr = getCfg('hunter_mode');
        GM_setValue('hunter_mode', !curr);
        setHash(!curr === true ? '#quest/assist' : '');

        // 应用配置到其他部分
        const settings = ['refresh_attack', 'refresh_koenig_dekret', 'refresh_coronal_ejection', 'refresh_secret_triad', 'allow_auto_redirect'];
        settings.forEach(setting => {
            GM_setValue(setting, !curr);
        })
        window.location.reload();
    }

    // 注册右键菜单
    const labels = {
        refresh_attack: '攻击后自动刷新',
        hide_left_sb: '关闭左侧边栏',
        hide_right_sb: '关闭右侧边栏',
        refresh_koenig_dekret: '帝王法令刷新',
        refresh_coronal_ejection: '日冕喷发刷新',
        refresh_secret_triad: '万事皆三刷新',
        hunter_mode: '猎金模式',
        contribution: '贡献',
        enable_filter: '开启筛选模式',
        filter_by_asc: '根据血量筛选',
        replace_refresh_with_back: '替换刷新为后退',
        allow_auto_redirect: '自动跳转',
        auto_redirect_hash: '自动跳转目标'
    };
    Object.entries(labels).forEach(([key, label]) => {
        if (key === 'auto_redirect_hash') {
            GM_registerMenuCommand(
                `${label}：${getCfg(key)}`,
                () => setHash()
            );
        } else if (key === 'hunter_mode') {
            GM_registerMenuCommand(
                `${label}：${getCfg(key) ? '已开启' : '已关闭'}`,
                () => setHunterMode()
            );
        } else if (key === 'contribution') {
            GM_registerMenuCommand(
                `${label}：${getCfg(key)}`,
                () => {
                }
            );
        } else if (key === 'filter_by_asc') {
            GM_registerMenuCommand(
                `${label}：${getCfg(key) ? '血量少' : '血量多'} `,
                () => toggleCfg(key)
            );
        } else {
            GM_registerMenuCommand(
                `${label}：${getCfg(key) ? '已开启' : '已关闭'}`,
                () => toggleCfg(key)
            );
        }
    });

    // 页面加载后隐藏侧栏
    window.addEventListener('load', () => {
        if (!/mobile/.test(navigator.userAgent.toLowerCase())) {
            if (getCfg('hide_left_sb')) {
                document.body.firstElementChild?.firstElementChild?.remove();
            }
        }
        if (getCfg('hide_right_sb')) {
            document.querySelector('#submenu')?.remove();
        }
    });

    function isResult() {
        const hash = location.hash.split('/')[0];
        return hash === '#result_multi' || hash === '#result';
    }

    function tryAutoRedirect() {
        const target = GM_getValue('auto_redirect_hash', defaults.auto_redirect_hash);
        if (target) {
            window.open(`${location.origin}/${target}`, '_self');
        }
    }

    function ratio_random(value, hunt_mode) {
        if (hunt_mode) {
            return Math.random() * (defaults.hunt_mode_ratio / 100 * value);
        } else {
            return Math.random() * (defaults.normal_mode_ratio / 100 * 3 * value);
        }
    }

    function random() {
        const hunt_mode = getCfg('hunter_mode');
        const rand1 = ratio_random(defaults.random_factor_1, hunt_mode);
        const rand2 = ratio_random(defaults.random_factor_2, hunt_mode);
        const rand3 = ratio_random(defaults.random_factor_3, hunt_mode);

        return rand1 + rand2 + rand3;
    }

    function auto_click(hash, query, first_call = false) {
        if (first_call) {
            defaults.current_hash = location.hash;
        }

        // 保持在指定 hash 页面
        if (!location.hash.includes(hash) || location.hash !== defaults.current_hash) return;

        const btn = document.querySelector(query);
        if (!btn) {
            // 按钮尚未出现，稍后重试
            return setTimeout(() => auto_click(hash, query), random());
        }

        if (query === '.btn-auto') {
            const attack = document.querySelector('.btn-attack-start');
            if (attack && attack.classList.contains('display-on')) {
                // 攻击按钮出现后点击
                return setTimeout(() => {
                    $(query).trigger(jQuery.Event("tap"));
                    auto_click(hash, query); // 继续执行
                }, random());
            } else {
                // 持续检查攻击按钮
                return setTimeout(() => auto_click(hash, query), random());
            }
        }

        if (query === '.btn-usual-ok') {
            const beforeHref = location.href;
            return setTimeout(() => {
                $(query).trigger(jQuery.Event("tap"));

                setTimeout(() => {
                    if (location.href === beforeHref) {
                        // 未跳转，可能点击无效，重试
                        auto_click(hash, query);
                    }
                }, 500); // 等待跳转生效，可根据需要调整延迟
            }, random());
        }

        // 默认点击流程
        return setTimeout(() => {
            $(query).trigger(jQuery.Event("tap"));
        }, random());
    }


    function timed_tryAutoRedirect() {
        const hunt_mode = getCfg('hunter_mode');
        const allow_redirect = getCfg('allow_auto_redirect');
        if (hunt_mode) {
            hide_them();
            checkContribution();
        }
        if (defaults.enable_auto_auto === true) {
            auto_click('#raid', '.btn-auto', true);
            auto_click('supporter', '.btn-usual-ok', true);
        }
        if (allow_redirect === true) {
            if (isResult()) {
                setTimeout(tryAutoRedirect, random());
            }
        }
    }

    function hide_them() {
        const is_assist = location.hash.includes('#quest/assist');
        const enabled = getCfg('enabled_filter');
        if (is_assist === false || enabled === false) return;
        const run = () => {
            const li = document.querySelector('.prt-search-list');
            if (!li) return;
            const targets = li.querySelectorAll('.btn-multi-raid.lis-raid.search');
            if (targets) {
                if (targets.length === 0) return;
                targets.forEach((i) => {
                    const percentage = parseInt(i.querySelector('.prt-raid-gauge-inner').style.width);
                    const members = parseInt(i.querySelector('.prt-flees-in').innerText);
                    const less_than = getCfg('hide_hp_less_than');
                    const more_than = getCfg('hide_member_more_than');
                    if (percentage < less_than || members > more_than) {
                        i.remove();
                    }
                })
            }
            const children = Array.from(li.children);
            children.sort((a, b) => {
                const a_hp = parseInt(a.querySelector('.prt-raid-gauge-inner').style.width);
                const b_hp = parseInt(b.querySelector('.prt-raid-gauge-inner').style.width);
                const use_asc = getCfg('filter_by_asc');
                return use_asc ? a_hp - b_hp : b_hp - a_hp;
            })
            children.forEach(child => li.appendChild(child));
        }
        window.hide_them = setInterval(run, 100);
    }

    window.addEventListener('DOMContentLoaded', timed_tryAutoRedirect);
    window.addEventListener('popstate', timed_tryAutoRedirect);
    window.addEventListener('unload', () => {
        clearInterval(window.hide_them);
        clearInterval(window.auto_auto);
    });

    // 跳转控制
    function reload() {
        if (getCfg('replace_refresh_with_back')) return goBack();
        setTimeout(() => location.reload(), random());
    }

    function goBack() {
        setTimeout(() => history.go(-1), random());
    }

    function checkContribution() {
        const contribution = document.querySelector('div.lis-user:nth-child(1) > div:nth-child(4)');
        if (!location.hash.includes('#raid')) return;
        console.log(contribution);
        if (!getCfg('hunter_mode')) return;
        if (contribution) {
            const contribution_number = parseInt(contribution.innerText);
            if (contribution_number > getCfg('contribution')) {
                tryAutoRedirect();
            }
        } else {
            setTimeout(checkContribution, 200);
        }
    }

    // 战斗处理逻辑
    function handleBattle(scenario, urlKey) {
        const winObj = scenario.find(o => o.cmd === 'win');
        const winStatus = winObj
            ? (winObj.is_last_raid === 1 ? 'raid' : 'battle')
            : 'continue';

        if (winStatus === 'raid') return goBack();
        if (winStatus === 'battle') return reload();
        if (urlKey === 'normal_attack_result.json' && getCfg('refresh_attack')) return reload();

        if (urlKey === 'ability_result.json' || urlKey === 'summon_result.json') {
            const ability = scenario.find(o => o.cmd === 'ability');
            if (ability) {
                if ((getCfg('refresh_koenig_dekret') && ability.name === 'ケーニヒ・ベシュテレン') ||
                    (getCfg('refresh_coronal_ejection') && ability.name.includes('攻撃行動') && ability.name.includes('２回')) ||
                    (getCfg('refresh_secret_triad') && ability.name === 'シークレットトライアド')) {
                    return reload();
                }
            }
        }
    }

    // 拦截 XHR
    const origSend = unsafeWindow.XMLHttpRequest.prototype.send;
    unsafeWindow.XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', () => {
            try {
                const url = new URL(this.responseURL);
                const key = url.pathname.split('/')[3];
                if (!battleSet.has(key)) return;
                const resp = JSON.parse(this.responseText);
                const scenario = resp.scenario || resp;
                handleBattle(scenario, key);
            } catch (e) {
                console.warn('脚本出错：', e);
            }
        });
        origSend.apply(this, args);
    };
})();