// ==UserScript==
// @name         zmpt_auto_feed
// @namespace    https://zmpt.cc/
// @version      2.0.0
// @description  ZMPT有声书自动发种脚本，配合AudiobookPTer.py使用，支持主标题保护功能
// @match        https://zmpt.cc/upload.php*
// @match        https://zmpt.club/upload.php*
// @grant        none
//
// 致谢：本脚本部分思路和兼容性处理参考了 auto_feed 油猴脚本
//       https://greasyfork.org/zh-CN/scripts/424132-auto-feed
// @downloadURL https://update.greasyfork.org/scripts/540831/zmpt_auto_feed.user.js
// @updateURL https://update.greasyfork.org/scripts/540831/zmpt_auto_feed.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 日志辅助
    function log(...args) {
        console.log('[zmptcc_auto_feed]', ...args);
    }

    // 解析hash数据
    function parseHashData() {
        if (!location.hash.startsWith("#separator#")) {
            log('未检测到hash数据');
            return null;
        }
        try {
            let b64 = location.hash.replace("#separator#", "");
            let decoded = decodeURIComponent(atob(b64));
            let arr = decoded.split("#linkstr#");
            log('hash arr:', arr);
            let obj = {};
            for (let i = 0; i < arr.length - 1; i += 2) {
                let key = arr[i].trim();
                obj[key] = arr[i + 1];
            }
            log('解析到hash数据', obj);
            return obj;
        } catch (e) {
            alert("自动填充解析失败: " + e);
            log('hash解析失败', e);
            return null;
        }
    }

    // 等待表单主要元素加载
    function waitForForm(callback, timeout = 10000) {
        const start = Date.now();
        function check() {
            if (
                document.querySelector('input[name="name"]') &&
                document.querySelector('textarea[name="descr"]')
            ) {
                callback();
            } else if (Date.now() - start < timeout) {
                setTimeout(check, 100);
            } else {
                log('等待表单超时');
            }
        }
        check();
    }

    // 保护主标题不被torrent文件名覆盖
    function protectMainTitle() {
        if (!window.formData || !window.formData.name) {
            log('没有主标题数据，跳过保护');
            return;
        }

        const originalTitle = window.formData.name;
        log('开始保护主标题:', originalTitle);

        // 查找主标题input
        let nameInput = document.querySelector('input#name') || document.querySelector('input[name="name"]');
        if (!nameInput) {
            log('未找到主标题input');
            return;
        }

        // 检查当前值是否被torrent文件名覆盖
        const currentValue = nameInput.value;
        if (currentValue && currentValue !== originalTitle) {
            log('检测到主标题被覆盖，从', currentValue, '恢复为', originalTitle);

            // 恢复原始标题
            nameInput.value = originalTitle;

            // 触发事件
            if (typeof window.jQuery === 'function') {
                window.jQuery(nameInput).trigger('input').trigger('change');
            } else {
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                nameInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            showTip('主标题已恢复为: ' + originalTitle, 'success');
        } else {
            log('主标题未被覆盖，当前值:', currentValue);
        }

        // 设置定时器，持续保护主标题
        const protectionInterval = setInterval(() => {
            if (nameInput.value !== originalTitle) {
                log('检测到主标题被修改，恢复为:', originalTitle);
                nameInput.value = originalTitle;
                if (typeof window.jQuery === 'function') {
                    window.jQuery(nameInput).trigger('input').trigger('change');
                } else {
                    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                    nameInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }, 2000); // 每2秒检查一次

        // 存储interval ID，以便后续清理
        window.mainTitleProtectionInterval = protectionInterval;

        log('主标题保护已启动，每2秒检查一次');
    }

    // 显示提示信息
    function showTip(message, type = 'info') {
        const tip = document.createElement('div');
        tip.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 16px;
            max-width: 400px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        // 根据类型设置颜色
        switch (type) {
            case 'success':
                tip.style.background = '#52c41a';
                tip.style.color = '#fff';
                break;
            case 'warning':
                tip.style.background = '#faad14';
                tip.style.color = '#fff';
                break;
            case 'error':
                tip.style.background = '#ff4d4f';
                tip.style.color = '#fff';
                break;
            default:
                tip.style.background = '#409EFF';
                tip.style.color = '#fff';
        }

        tip.innerText = message;
        document.body.appendChild(tip);

        // 3秒后自动隐藏
        setTimeout(() => {
            if (tip.parentNode) {
                tip.parentNode.removeChild(tip);
            }
        }, 3000);
    }

    // 站点option映射表（根据页面option补全）
    const mediumMap = {
        "Blu-ray": "1",
        "HDTV": "5",
        "WEB-DL": "10",
        "Remux": "3",
        "Encode": "7",
        "MiniBD": "4",
        "CD": "8",
        "HD DVD": "2",
        "DVDR": "6",
        "其他资料": "12"
    };
    const audioCodecMap = {
        "FLAC": "1",
        "APE": "2",
        "DTS": "3",
        "OGG": "5",
        "AC3": "8",
        "AAC": "6",
        "MP3": "4",
        "ALAC": "9",
        "WAV": "10",
        "Other": "7"
    };

    // 制作组映射表（页面option value与文本一一对应，支持py侧传中文或英文）
    const teamMap = {
        "Other": "5",
        "ZmWeb": "7",
        "ZmPT": "6",
        "ZmMusic": "8",
        "ZmAudio": "11",
        "DYZ-Movie": "9",
        "GodDramas": "10",
        "RL": "12",
        "其它": "5",
        "其他": "5"
    };

    // 匹配选择框的文本或值
    function matchSelectByTextOrValue(sel, val, map) {
        if (!sel) return false;
        // 直接value
        if ([...sel.options].some(opt => opt.value == val)) {
            sel.value = val;
            return true;
        }
        // 映射
        if (map && map[val] && [...sel.options].some(opt => opt.value == map[val])) {
            sel.value = map[val];
            return true;
        }
        // 文本
        for (let opt of sel.options) {
            if (opt.text.replace(/\s/g, '') === String(val).replace(/\s/g, '')) {
                sel.value = opt.value;
                return true;
            }
        }
        return false;
    }

    // 填充类型相关字段
    function fillTypeRelated(formData) {
        // 只要有一个tr[relation=mode_4]是可见的就可以填充
        if (document.querySelector('tr[relation="mode_4"]:not([style*="display: none"])')) {
            // 视频类
            if (formData.medium_sel) {
                let sel = document.querySelector('select[name="medium_sel[4]"]');
                if (sel) sel.value = formData.medium_sel;
            }
            // 分辨率
            if (formData.standard_sel) {
                let sel = document.querySelector('select[name="standard_sel[4]"]');
                if (sel) sel.value = formData.standard_sel;
            }
            // 音频类
            if (formData.audiocodec_sel) {
                let sel = document.querySelector('select[name="audiocodec_sel[4]"]');
                if (sel) sel.value = formData.audiocodec_sel;
            }
            // 制作组
            if (formData.team_sel) {
                let sel = document.querySelector('select[name="team_sel[4]"]');
                if (sel) {
                    let target = String(formData.team_sel).replace(/\s/g, '').toLowerCase();
                    let matched = false;
                    // 1. 先用value匹配
                    for (let opt of sel.options) {
                        if (opt.value === target) {
                            sel.value = String(opt.value);
                            matched = true;
                            break;
                        }
                    }
                    // 2. 用映射表匹配
                    if (!matched && teamMap[formData.team_sel]) {
                        sel.value = String(teamMap[formData.team_sel]);
                        matched = true;
                    }
                    // 3. 用option文本模糊匹配（忽略大小写和空格）
                    if (!matched) {
                        for (let opt of sel.options) {
                            let optText = opt.text.replace(/\s/g, '').toLowerCase();
                            if (optText === target || optText.includes(target) || target.includes(optText)) {
                                sel.value = String(opt.value);
                                matched = true;
                                break;
                            }
                        }
                    }
                    // 4. 日志输出
                    if (!matched) {
                        log('未能自动匹配制作组，页面选项有：', [...sel.options].map(o => [o.value, o.text]));
                        log('传入team_sel:', formData.team_sel);
                    } else {
                        if (typeof window.jQuery === 'function') {
                            window.jQuery(sel).trigger('change');
                        } else {
                            sel.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }
            }
            // 歌手、专辑、年份
            if (formData.singer) {
                let inp = document.querySelector('input[name="custom_fields[4][1]"]');
                if (inp) inp.value = formData.singer;
            }
            if (formData.album) {
                let inp = document.querySelector('input[name="custom_fields[4][2]"]');
                if (inp) inp.value = formData.album;
            }
            if (formData.year) {
                let inp = document.querySelector('input[name="custom_fields[4][3]"]');
                if (inp) inp.value = formData.year;
            }
            // 标签
            if (formData.labels) {
                let labelArr = formData.labels.split(",");
                document.querySelectorAll('input[type="checkbox"][name^="tags"]').forEach(cb => {
                    cb.checked = false;
                });
                labelArr.forEach(id => {
                    document.querySelectorAll('input[type="checkbox"][name^="tags"]').forEach(cb => {
                        if (cb.value == id) cb.checked = true;
                    });
                });
            }
            log('已填充类型相关');
            return true;
        }
        return false;
    }

    // 自动填充ZMPT表单
    function autofillZmpt(formData) {
        log('开始自动填充表单...');

        // 存储表单数据到全局变量，供主标题保护使用
        window.formData = formData;

        // 主标题，延迟填充，确保页面完全渲染后再次赋值
        let nameTries = 0;
        function fillName() {
            let inp = document.querySelector('input#name') || document.querySelector('input[name="name"]');
            if (inp && formData.name) {
                inp.value = formData.name;
                if (typeof window.jQuery === 'function') {
                    window.jQuery(inp).trigger('input').trigger('change');
                } else {
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));
                }
                // 再次延迟赋值，防止被页面js覆盖
                setTimeout(() => {
                    if (inp.value !== formData.name) {
                        inp.value = formData.name;
                        if (typeof window.jQuery === 'function') {
                            window.jQuery(inp).trigger('input').trigger('change');
                        } else {
                            inp.dispatchEvent(new Event('input', { bubbles: true }));
                            inp.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }, 800);
                return true;
            }
            if (++nameTries < 20) setTimeout(fillName, 200);
        }
        fillName();

        // 副标题
        if (formData.small_descr) {
            let inp = document.querySelector('input[name="small_descr"]');
            if (inp) inp.value = formData.small_descr;
        }
        // 简介
        if (formData.descr) {
            let ta = document.querySelector('textarea[name="descr"]');
            if (ta) ta.value = formData.descr;
        }
        // IMDb链接
        if (formData.url) {
            let inp = document.querySelector('input[name="url"]');
            if (inp) inp.value = formData.url;
        }
        // PT-Gen
        if (formData.pt_gen) {
            let inp = document.querySelector('input[name="pt_gen"]');
            if (inp) inp.value = formData.pt_gen;
        }
        // 价格
        if (formData.price) {
            let inp = document.querySelector('input[name="price"]');
            if (inp) inp.value = formData.price;
        }
        // 类型（必须触发change，才能显示依赖项）
        if (formData.type) {
            let sel = document.querySelector('select[name="type"]');
            if (sel && [...sel.options].some(opt => opt.value == formData.type)) {
                sel.value = formData.type;
                if (typeof window.jQuery === 'function') {
                    window.jQuery(sel).trigger('change');
                } else {
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        // 等待"标签"或"质量"相关DOM出现再填充
        let tryCount = 0;
        function waitTypeRelated() {
            let ok = false;
            // 视频类
            if (formData.medium_sel) {
                let sel = document.querySelector('select[name="medium_sel[4]"]');
                if (matchSelectByTextOrValue(sel, formData.medium_sel, mediumMap)) {
                    if (typeof window.jQuery === 'function') {
                        window.jQuery(sel).trigger('change');
                    } else {
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    ok = true;
                }
            }
            // 分辨率
            if (formData.standard_sel) {
                let sel = document.querySelector('select[name="standard_sel[4]"]');
                if (matchSelectByTextOrValue(sel, formData.standard_sel)) {
                    if (typeof window.jQuery === 'function') {
                        window.jQuery(sel).trigger('change');
                    } else {
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    ok = true;
                }
            }
            // 音频类
            if (formData.audiocodec_sel) {
                let sel = document.querySelector('select[name="audiocodec_sel[4]"]');
                if (matchSelectByTextOrValue(sel, formData.audiocodec_sel, audioCodecMap)) {
                    if (typeof window.jQuery === 'function') {
                        window.jQuery(sel).trigger('change');
                    } else {
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    ok = true;
                }
            }
            // 制作组
            if (formData.team_sel) {
                let sel = document.querySelector('select[name="team_sel[4]"]');
                if (sel) {
                    let target = String(formData.team_sel).replace(/\s/g, '').toLowerCase();
                    let matched = false;
                    // 1. 先用value匹配
                    for (let opt of sel.options) {
                        if (opt.value === target) {
                            sel.value = String(opt.value);
                            matched = true;
                            break;
                        }
                    }
                    // 2. 用映射表匹配
                    if (!matched && teamMap[formData.team_sel]) {
                        sel.value = String(teamMap[formData.team_sel]);
                        matched = true;
                    }
                    // 3. 用option文本模糊匹配（忽略大小写和空格）
                    if (!matched) {
                        for (let opt of sel.options) {
                            let optText = opt.text.replace(/\s/g, '').toLowerCase();
                            if (optText === target || optText.includes(target) || target.includes(optText)) {
                                sel.value = String(opt.value);
                                matched = true;
                                break;
                            }
                        }
                    }
                    // 4. 日志输出
                    if (!matched) {
                        log('未能自动匹配制作组，页面选项有：', [...sel.options].map(o => [o.value, o.text]));
                        log('传入team_sel:', formData.team_sel);
                    } else {
                        if (typeof window.jQuery === 'function') {
                            window.jQuery(sel).trigger('change');
                        } else {
                            sel.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        ok = true;
                    }
                }
            }
            // 歌手、专辑、年份
            if (formData.singer) {
                let inp = document.querySelector('input[name="custom_fields[4][1]"]');
                if (inp) inp.value = formData.singer;
            }
            if (formData.album) {
                let inp = document.querySelector('input[name="custom_fields[4][2]"]');
                if (inp) inp.value = formData.album;
            }
            if (formData.year) {
                let inp = document.querySelector('input[name="custom_fields[4][3]"]');
                if (inp) inp.value = formData.year;
            }
            // 标签
            if (formData.labels) {
                let labelArr = formData.labels.split(",");
                document.querySelectorAll('input[type="checkbox"][name^="tags"]').forEach(cb => {
                    cb.checked = false;
                });
                labelArr.forEach(id => {
                    document.querySelectorAll('input[type="checkbox"][name^="tags"]').forEach(cb => {
                        if (cb.value == id) cb.checked = true;
                    });
                });
            }
            if (!ok && tryCount < 30) {
                tryCount++;
                setTimeout(waitTypeRelated, 200);
            }
        }
        waitTypeRelated();

        // 种子位置
        if (formData.pos_state) {
            let sel = document.querySelector('select[name="pos_state"]');
            if (sel && [...sel.options].some(opt => opt.value == formData.pos_state)) {
                sel.value = formData.pos_state;
            }
        }
        // 截止时间
        if (formData.pos_state_until) {
            let inp = document.querySelector('input[name="pos_state_until"]');
            if (inp) inp.value = formData.pos_state_until;
        }
        // 匿名发布
        let cb = document.querySelector('input[name="uplver"]');
        if (cb) cb.checked = (formData.uplver === "yes");

        // 其它常用字段
        if (formData.torrent_name) {
            let inp = document.querySelector('input[name="torrent_name"]');
            if (inp) inp.value = formData.torrent_name;
        }
        if (formData.dburl) {
            let inp = document.querySelector('input[name="dburl"]');
            if (inp) inp.value = formData.dburl;
        }

        // 触发所有input/select/textarea的change
        setTimeout(() => {
            document.querySelectorAll('input,select,textarea').forEach(el => {
                if (typeof window.jQuery === 'function') {
                    window.jQuery(el).trigger('change');
                } else {
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }, 100);

        // 提示
        showTip('已自动填充发种信息', 'success');

        log('自动填充完成');
    }

    // 主函数
    function main() {
        if (!/https:\/\/zmpt\.cc\/upload\.php/.test(location.href)) {
            // 页面不匹配，提示无效
            showTip('自动填充脚本未生效，请检查页面或数据', 'error');
            return;
        }
        let data = parseHashData();
        window.formData = data; // 让 formData 变成全局变量，便于调试
        // 兼容 team 字段
        if (window.formData && !window.formData.team_sel && window.formData.team) {
            window.formData.team_sel = window.formData.team;
        }
        log('window.formData:', window.formData);
        if (window.formData) log('window.formData.team_sel:', window.formData.team_sel, typeof window.formData.team_sel);
        if (!data) {
            // hash数据无效，提示无效
            showTip('自动填充脚本未生效，请检查页面或数据', 'error');
            return;
        }

        // 等待表单加载完成后执行
        waitForForm(() => {
            // 先执行自动填充
            autofillZmpt(data);

            // 启动主标题保护
            setTimeout(() => protectMainTitle(), 1000);
        });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // hash变化监听
    window.addEventListener("hashchange", () => {
        // 清理之前的保护定时器
        if (window.mainTitleProtectionInterval) {
            clearInterval(window.mainTitleProtectionInterval);
            window.mainTitleProtectionInterval = null;
        }
        setTimeout(() => main(), 200);
    });

    // 兼容部分站点 hash 先于 DOMContentLoaded 的情况
    setTimeout(main, 500);
})();