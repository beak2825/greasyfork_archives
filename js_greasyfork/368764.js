// ==UserScript==
// @name         PT Level Helper
// @namespace    https://xsky123.com/
// @version      0.2
// @description  A simple way to help you know when you will level up
// @author       XSky123
// @match       *://u2.dmhy.org/userdetails*
// @match       *://totheglory.im/userdetails*
// @match       *://hdcmct.org/userdetails*
// @match       *://tp.m-team.cc/userdetails*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368764/PT%20Level%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/368764/PT%20Level%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function show_next_upgrade() {

        let site = get_site_name();
        let register_time = get_register_time();
        let level = get_current_level(site);
        let next_level = load_next_level(site, level);
        let next_level_info = load_level_data(site, next_level);
        let next_download = next_level_info['down'];
        let next_upload = get_next_upload(next_level_info);
        let upgrade_time = add_weeks(register_time, next_level_info['weeks']);
        let current_upload = get_upload(site);
        let current_download = get_download(site);


        write_upgrade_time(site, next_level, upgrade_time);
        write_traffic(site, current_upload, next_upload, next_level);
        write_traffic(site, current_download, next_download, next_level, "download");
        write_ratio(site, next_level_info['ratio'], next_level);
    }

    function write_upgrade_time(site, next_level, upgrade_time) {
        let now = new Date();
        let ksr = document.querySelectorAll('td.rowhead');
        let ksp;
        let target;
        ksr.forEach(function (ksp) {
            if (ksp.innerText.match('日期')) {
                target = ksp;
            }
        });

        let upgrade_info = document.createElement("span");
        let upgrade_info_html;
        if (upgrade_time > now) {
            let rest_time = get_time_diff(now, upgrade_time, "day");
            let rest_time_str = get_next_upgrade_txt(rest_time);
            upgrade_info_html = ` 升级至<strong>${next_level}</strong>还需要<strong>${rest_time_str}</strong>`;
        } else {
            upgrade_info_html = ` 已满足升级至<strong>${next_level}</strong>的时间要求`;
        }
        upgrade_info.innerHTML = upgrade_info_html;
        target.nextSibling.appendChild(upgrade_info);

    }

    function write_traffic(site, current_value, next_value, next_level, type = "upload") {
        switch (site) {
            case "ttg":
                write_traffic_for_ttg(current_value, next_value, next_level, type);
                break;
            default:
                write_traffic_for_normal_nexusphp(current_value, next_value, next_level, type);
        }
    }

    function write_traffic_for_ttg(current_value, next_value, next_level, type = "upload") {
        let target;
        let origin_html;

        if (type === "upload") {
            target = $("td.rowhead:contains('上传'):first").next();
        } else {
            target = $("td.rowhead:contains('下载'):first").next();
        }

        origin_html = target.html();
        if (next_value > current_value) {
            origin_html += ` 距离下一等级<strong>${next_level}</strong>还有<strong>${number_format(next_value - current_value, 2)} GB</strong>`;
        } else {
            origin_html += ` 已满足升级至<strong>${next_level}</strong>的流量要求`;
        }

        target.html(origin_html);

    }

    function write_traffic_for_normal_nexusphp(current_value, next_value, next_level, type = "upload") {
        /* This part of code was inspired by popcorner@DUTPT.
         * Thanks to his advice, code here has been greatly simplified and normalized.
         */
        let ksr = document.querySelectorAll('td.embedded>strong');
        let ksp;
        let ksl;
        if (type === "upload") {
            ksr.forEach(function (ksp) {
                if (ksp.innerText === '上传量' || ksp.innerHTML === '上傳量') {
                    ksl = ksp
                }
            });
        } else {
            ksr.forEach(function (ksp) {
                if (ksp.innerText === '下载量' || ksp.innerHTML === '下載量') {
                    ksl = ksp
                }
            });
        }
        let upgrade_info;
        if (next_value > current_value) {
            upgrade_info = ` 距离下一等级<strong>${next_level}</strong>还有<strong>${number_format(next_value - current_value, 2)} GB</strong> `;
        } else {
            upgrade_info = ` 已满足升级至<strong>${next_level}</strong>的流量要求 `;
        }

        ksl.parentElement.insertAdjacentHTML('beforeend', upgrade_info);

    }

    function write_ratio(site, next_ratio, next_level) {
        let current_ratio;

        switch (site){
            case "ttg":
                let target = $("td.rowhead:contains('分享率'):first").next();
                let origin_html = target.html();
                current_ratio = Number(target.text());

                if (next_level > current_ratio) {
                    origin_html += ` 下一等级<strong>${next_level}</strong>需要达到分享率<strong>${next_ratio}</strong>`;
                } else {
                    origin_html += ` 已满足升级至<strong>${next_level}</strong>的分享率要求`;
                }

                target.html(origin_html);
                break;
            default:
                let ksr = document.querySelectorAll('td.embedded>strong');
                let ksp;
                let ksl;
                ksr.forEach(function (ksp) {
                    if (ksp.innerText === '分享率') {
                        ksl = ksp
                    }
                });

                current_ratio = Number(ksl.nextElementSibling.innerText);
                let ratio_text;
                if (current_ratio < next_ratio) {
                    ratio_text = ` 下一等级<strong>${next_level}</strong>需要达到分享率<strong>${next_ratio}</strong> `;
                }else{
                    ratio_text = ` 已满足升级至<strong>${next_level}</strong>的分享率要求 `;
                }
                ksl.nextElementSibling.insertAdjacentHTML('beforeend', ratio_text);
        }
    }

    function get_current_user_personal_page_url(site){
        let ksr;
        let user_url;
        switch (site){
            case "ttg":
                ksr = document.querySelector('span.smallfont');
               break;
            default:
                ksr = document.querySelector('span.medium');
        }

        user_url = ksr.firstElementChild.firstElementChild.href;
        return user_url;
    }

    function get_site_name() {
        let domain = window.location.host;
        let site_name = "";
        switch (domain) {
            case "u2.dmhy.org":
                site_name = "u2";
                break;
            case "totheglory.im":
                site_name = "ttg";
                break;
            case "hdcmct.org":
                site_name = "cmct";
                break;
            case "tp.m-team.cc":
                site_name = "mt";
                break;
        }
        console.log(`Sitename: ${site_name}`);
        return site_name;
    }

    function get_register_time() {
        let html = document.body.innerHTML;
        let reg_time_pattern = /日期.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/;
        let reg_time = html.match(reg_time_pattern);
        let reg_time_value = reg_time[1];

        console.log(`Register at: ${reg_time_value}`);
        return new Date(reg_time_value);
    }

    function get_current_level(site) {
        let level_value;
        let html;
        let level_pattern;
        let level;
        switch (site) {
            case "ttg":
                html = document.body.innerHTML;
                level_pattern = /等级.*?\">(.*?)</;
                level = html.match(level_pattern);
                level_value = level[1];

                break;
            case "mt":
                html = document.body.innerHTML;
                level_pattern = /等級.*?\<img alt=\"(.*?)\//;
                level = html.match(level_pattern);
                level_value = level[1];
                break;

            default:
                html = document.body.innerHTML;
                level_pattern = /等级.*?\<img alt=\"(.*?)\"/;
                level = html.match(level_pattern);
                level_value = level[1];

        }

        console.log(`Level: ${level_value}`);
        return level_value;

    }

    function get_upload(site){
        return get_traffic(site);
    }

    function get_download(site){
        return get_traffic(site, "download");
    }

    function get_traffic(site, type="upload"){
        let traffic_data;
        switch (site){
            case "ttg":
                traffic_data = get_traffic_from_ttg(type);
                break;
            default:
                traffic_data = get_traffic_form_normal_nexusphp(type);
        }
        return all_tani_to_GB(traffic_data[0], traffic_data[1]);
    }

    function get_traffic_from_ttg(type){
        let ksr = document.querySelectorAll('td.rowhead');
        let ksp;
        let ksl;
        let raw_traffic_text;
        let parsed_traffic;
        let traffic_value;
        let traffic_tani;
        let traffic_pattern = /(\d+\.\d+) (\w{2,3})/;

        ksr.forEach(function (ksp) {
            if (type === 'download') {
                if (ksp.innerText === '下载量') {
                    ksl = ksp;
                }
            } else{
                if (ksp.innerText === '上传量') {
                    ksl = ksp;
                }
            }
        });

        raw_traffic_text = ksl.nextElementSibling.firstChild.textContent;
        parsed_traffic = raw_traffic_text.match(traffic_pattern);
        traffic_value = parsed_traffic[1];
        traffic_tani = parsed_traffic[2];

        return [traffic_value, traffic_tani];
    }

    function get_traffic_form_normal_nexusphp(type){
        let ksr = document.querySelectorAll('td.embedded>strong');
        let ksp;
        let ksl;
        let raw_traffic_text;
        let parsed_traffic;
        let traffic_value;
        let traffic_tani;
        let traffic_pattern = /(\d+\.\d+) (\w{2,3})/;
        ksr.forEach(function (ksp) {
            if (type === 'download'){
                if (ksp.innerText === '下载量' || ksp.innerHTML === '下載量') {
                    ksl = ksp;
                }
            }else {
                if (ksp.innerText === '上传量' || ksp.innerHTML === '上傳量') {
                    ksl = ksp;
                }
            }
        });
        raw_traffic_text = ksl.nextSibling.textContent;
        parsed_traffic = raw_traffic_text.match(traffic_pattern);
        traffic_value = parsed_traffic[1];
        traffic_tani = parsed_traffic[2];

        return [traffic_value, traffic_tani];


    }

    function get_next_upload(next_level_info) {
        let next_upload = 0;
        let next_upload_by_ratio = next_level_info['down'] * next_level_info['ratio'];
        if (next_level_info.hasOwnProperty('up')) {
            next_upload = ((next_upload > next_upload_by_ratio) ? next_upload : next_upload_by_ratio);
        } else {
            next_upload = next_upload_by_ratio;
        }
        console.log(`Next Upload Value: ${next_upload}`);
        return next_upload;
    }

    function get_next_upgrade_txt(rest_time_by_day) {
        let days = Math.floor(rest_time_by_day);
        let origin_hours = (rest_time_by_day - days) * 24;
        let hours = Math.floor(origin_hours);
        let minutes = Math.floor((rest_time_by_day - days) * 60 * 24 - hours * 60);
        return `${days}天${hours}小时${minutes}分`;
    }

    function get_time_diff(time_before, time_after, tani) {
        let diff = time_after.getTime() - time_before.getTime();
        let MICROSECONDS_PER_DAY = 86400000;
        let MICROSECONDS_PER_HOUR = 3600000;
        switch (tani) {
            case "day":
                return diff / MICROSECONDS_PER_DAY;

            case "hour":
                return diff / MICROSECONDS_PER_HOUR;


        }

    }

    function add_weeks(time_obj, n) {
        let new_date = new Date(time_obj);
        new_date.setDate(time_obj.getDate() + n * 7);
        return new_date;
    }

    function all_tani_to_GB(value, tani) {// 「tani」 は 「たんい」（単位）である。
        switch (tani) {
            case "TB":
                return Number(value) * 1000;


            case "TiB":
                return Number(value) * 1024;


            case "GB":
            case "GiB":
                return Number(value);


            case "MB":
                return Number(value) / 1000;


            case "MiB":
                return Number(value) / 1024;


            case "PB":
                return Number(value) * 1000 * 1000;


            case "PiB":
                return Number(value) * 1024 * 1024;


            case "KB":
                return Number(value) / 1000 / 1000;


            case "KiB":
                return Number(value) / 1024 / 1024;

        }
        return null;
    }

    function number_format(number, decimals, dec_point, thousands_sep, roundtag) {
        /*
        * code from: http://www.css88.com/archives/7324
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
        * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
        * */
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        roundtag = roundtag || "ceil"; //"ceil","floor","round"
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {

                var k = Math.pow(10, prec);
                console.log();

                return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    function load_next_level(site, current_level) {
        let data = {};
        switch (site) {
            case "u2":
                data = {
                    "路人": "御宅族",
                    "御宅族": "宅修士",
                    "宅修士": "宅教士",
                    "宅教士": "宅传教士",
                    "宅传教士": "宅护法",
                    "宅护法": "宅贤者",
                    "宅贤者": "宅圣",
                    "宅圣": "宅神"
                };
                break;
            case "ttg":
                data = {
                    "Byte": "KiloByte",
                    "KiloByte": "MegaByte",
                    "MegaByte": "GigaByte",
                    "GigaByte": "TeraByte",
                    "TeraByte": "PetaByte",
                    "PetaByte": "ExaByte",
                    "ExaByte": "ZettaByte",
                    "ZettaByte": "YottaByte",
                    "YottaByte": "BrontoByte",
                    "BrontoByte": "NonaByte",
                    "NonaByte": "DoggaByte"
                };
                break;
            case "cmct":
                data = {
                    "新手": "入门",
                    "入门": "发烧",
                    "发烧": "着迷",
                    "着迷": "狂热",
                    "狂热": "资深",
                    "资深": "大师",
                    "大师": "宗师",
                    "宗师": "骨灰",
                    "骨灰": "神仙"
                };
                break;
            case "mt":
                data = {
                    "小卒": "捕頭",
                    "捕頭": "知縣",
                    "知縣": "通判",
                    "通判": "知州",
                    "知州": "府丞",
                    "府丞": "府尹",
                    "府尹": "總督",
                    "總督": "大臣"
                };
                break;
        }

        if (data.hasOwnProperty(current_level)) {

            console.log(`Next level: ${data[current_level]}`);
            return data[current_level];
        }
        console.warn(`Can not find next level of ${current_level}.`);
        return null;
    }

    function load_level_data(site, level) {
        let data = {};
        switch (site) {
            case "u2":
                data = {
                    "御宅族": {
                        "title_en": "Power User",
                        "weeks": 4,
                        "down": 50,
                        "ratio": 1.05
                    },
                    "宅修士": {
                        "title_en": "Elite User",
                        "weeks": 8,
                        "down": 120,
                        "ratio": 1.55
                    },
                    "宅教士": {
                        "title_en": "Crazy User",
                        "weeks": 15,
                        "down": 300,
                        "ratio": 2.05
                    },
                    "宅传教士": {
                        "title_en": "Insane User",
                        "weeks": 25,
                        "down": 500,
                        "ratio": 2.55
                    },
                    "宅护法": {
                        "title_en": "Veteran User",
                        "weeks": 40,
                        "down": 750,
                        "ratio": 3.05
                    },
                    "宅贤者": {
                        "title_en": "Extreme User",
                        "weeks": 60,
                        "down": 1024,
                        "ratio": 3.55
                    },
                    "宅圣": {
                        "title_en": "Ultimate User",
                        "weeks": 80,
                        "down": 1536,
                        "ratio": 4.05
                    },
                    "宅神": {
                        "title_en": "Nexus Master",
                        "weeks": 100,
                        "down": 3072,
                        "ratio": 4.55
                    }
                };
                break;
            case "ttg":
                data = {
                    "KiloByte": {
                        "title_en": "KiloByte",
                        "weeks": 5,
                        "down": 60,
                        "ratio": 1.1
                    },
                    "MegaByte": {
                        "title_en": "MegaByte",
                        "weeks": 8,
                        "down": 150,
                        "ratio": 2
                    },
                    "GigaByte": {
                        "title_en": "GigaByte",
                        "weeks": 8,
                        "down": 250,
                        "ratio": 2
                    },
                    "TeraByte": {
                        "title_en": "TeraByte",
                        "weeks": 8,
                        "down": 500,
                        "ratio": 2.5
                    },
                    "PetaByte": {
                        "title_en": "PetaByte",
                        "weeks": 16,
                        "down": 750,
                        "ratio": 2.5
                    },
                    "ExaByte": {
                        "title_en": "ExaByte",
                        "weeks": 24,
                        "down": 1000,
                        "ratio": 3
                    },
                    "ZettaByte": {
                        "title_en": "ZettaByte",
                        "weeks": 24,
                        "down": 1500,
                        "ratio": 3.5
                    },
                    "YottaByte": {
                        "title_en": "YottaByte",
                        "weeks": 24,
                        "down": 2500,
                        "ratio": 4
                    },
                    "BrontoByte": {
                        "title_en": "BrontoByte",
                        "weeks": 32,
                        "down": 3500,
                        "ratio": 5
                    },
                    "NonaByte": {
                        "title_en": "NonaByte",
                        "weeks": 48,
                        "down": 5000,
                        "up": 50000,
                        "ratio": 6
                    },
                    "DoggaByte": {
                        "title_en": "DoggaByte",
                        "weeks": 48,
                        "down": 10000,
                        "up": 100000,
                        "ratio": 6
                    }
                };
                break;
            case "cmct":
                data = {
                    "入门": {
                        "title_en": "Power User",
                        "weeks": 5,
                        "down": 20,
                        "up": 50,
                        "ratio": 1.1
                    },
                    "发烧": {
                        "title_en": "Elite User",
                        "weeks": 10,
                        "down": 50,
                        "up": 100,
                        "ratio": 1.2
                    },
                    "着迷": {
                        "title_en": "Crazy User",
                        "weeks": 15,
                        "down": 100,
                        "up": 300,
                        "ratio": 1.2
                    },
                    "狂热": {
                        "title_en": "Insane User",
                        "weeks": 20,
                        "down": 200,
                        "up": 800,
                        "ratio": 1.2
                    },
                    "资深": {
                        "title_en": "Veteran User",
                        "weeks": 25,
                        "down": 500,
                        "up": 2000,
                        "ratio": 1.2
                    },
                    "大师": {
                        "title_en": "Extreme User",
                        "weeks": 25,
                        "down": 1000,
                        "up": 5000,
                        "ratio": 1.5
                    },
                    "宗师": {
                        "title_en": "Ultimate User",
                        "weeks": 30,
                        "down": 2000,
                        "up": 10000,
                        "ratio": 1.5
                    },
                    "骨灰": {
                        "title_en": "Nexus Master",
                        "weeks": 30,
                        "down": 4000,
                        "up": 20000,
                        "ratio": 1.5
                    },
                    "神仙": {
                        "title_en": "Nexus God",
                        "weeks": 50,
                        "down": 10000,
                        "up": 100000,
                        "ratio": 2
                    }
                };
                break;
            case "mt":
                data = {
                    "捕頭": {
                        "title_en": "Power User",
                        "weeks": 4,
                        "down": 200,
                        "ratio": 2
                    },
                    "知縣": {
                        "title_en": "Elite User",
                        "weeks": 8,
                        "down": 400,
                        "ratio": 3
                    },
                    "通判": {
                        "title_en": "Crazy User",
                        "weeks": 12,
                        "down": 500,
                        "ratio": 4
                    },
                    "知州": {
                        "title_en": "Insane User",
                        "weeks": 16,
                        "down": 800,
                        "ratio": 5
                    },
                    "府丞": {
                        "title_en": "Veteran User",
                        "weeks": 20,
                        "down": 1000,
                        "ratio": 6
                    },
                    "府尹": {
                        "title_en": "Extreme User",
                        "weeks": 24,
                        "down": 2000,
                        "ratio": 7
                    },
                    "總督": {
                        "title_en": "Ultimate User",
                        "weeks": 28,
                        "down": 2500,
                        "ratio": 8
                    },
                    "大臣": {
                        "title_en": "Nexus Master",
                        "weeks": 32,
                        "down": 3000,
                        "ratio": 9
                    }
                };
                break;
        }
        if (data.hasOwnProperty(level)) {
            return data[level];
        }
        return null;
    }

    show_next_upgrade();
})();