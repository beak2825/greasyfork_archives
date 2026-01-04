// ==UserScript==
// @name         zzrbl.com复制资源链接
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  猪猪字幕官网复制资源链接
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.zzrbl.com/wordpress/?p=*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/425245/zzrblcom%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/425245/zzrblcom%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var RIJUPAO = {
        prefix() {
            return 'SUBPIG猪猪字幕';
        },
        content() {
            return $('.content').html();
        },
        // 匹配前两个 [xxx] 作为标题，并且去掉第二个 [xxx] 里的数字集数
        title() {
            const pat = /(?:\[.+?\]){2}/;
            const res_mat = $('.posttitle').text().match(pat);
            return res_mat
                ? res_mat[0].replace(/\s+\d{1,2}\]/, ']')
                : false;
        },
        matchBaidu(content) {
            const pat = /百度.+?[:：][\s\S]+?href="(?<url>.+?)"[\s\S]+?码[:：](?<code>\w{4})/;
            const res_mat = content.match(pat);
            return res_mat ? res_mat.groups : false;
        },
        arrBaidu(prefix, title, content) {
            const res_baidu = this.matchBaidu(content);
            if (!res_baidu) {
                return [];
            }
            const arr_baidu = [`百度网盘下载(${prefix})：`];
            arr_baidu.push(this.joinDown(title, res_baidu));
            return arr_baidu;
        },
        matchXunlei(content) {
            const pat = /迅雷[\s\S]+?[:：][\s\S]+?href="(?<url>.+?)"[\s\S]+?码[:：](?<code>\w{4})/;
            const res_mat = content.match(pat);
            console.log('res_mat', res_mat);
            return res_mat ? res_mat.groups : false;
        },
        arrXunlei(prefix, title, content) {
            const res_xunlei = this.matchXunlei(content);
            if (!res_xunlei) {
                return [];
            }
            const arr_xunlei = [`迅雷网盘下载(${prefix})：`];
            arr_xunlei.push(this.joinDown(title, res_xunlei));
            return arr_xunlei;
        },
        matchWeiyun(content) {
            const pat = /微云[\s\S]*?[:：][\s\S]+?href="(?<url>.+?)"/;
            const res_mat = content.match(pat);
            console.log('res_mat', res_mat);
            return res_mat ? res_mat.groups : false;
        },
        arrWeiyun(prefix, title, content) {
            const res_weiyun = this.matchWeiyun(content);
            if (!res_weiyun) {
                return [];
            }
            const arr_weiyun = [`微云网盘下载(${prefix})：`];
            arr_weiyun.push(this.joinDown(title, res_weiyun));
            return arr_weiyun;
        },
        joinDown(title, res_mat) {
            const code_text = res_mat.code ? `，提取码：${res_mat.code}。` : '';
            return `<a href="${res_mat.url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${title}</a>${code_text}`;
        },
        joinArr(arr) {
            return arr.join("\n");
        },
        addBtn(arr_baidu) {
            if (!arr_baidu.length) {
                return;
            }
            const $btn_baidu = $('<button class="imzhi_zzrbl_copy_url">复制百度网盘</button>');
            $btn_baidu.attr('data-clipboard-text', this.joinArr(arr_baidu));
            $('.content').append($btn_baidu);
            new ClipboardJS('.imzhi_zzrbl_copy_url');
        },
        addXunlei(arr_xunlei) {
            if (!arr_xunlei.length) {
                return;
            }
            const $btn_xunlei = $('<button class="imzhi_zzrbl_copy_url">复制迅雷网盘</button>');
            $btn_xunlei.attr('data-clipboard-text', this.joinArr(arr_xunlei));
            $('.content').append($btn_xunlei);
            new ClipboardJS('.imzhi_zzrbl_copy_url');
        },
        addWeiyun(arr) {
            if (!arr.length) {
                return;
            }
            const $btn = $('<button class="imzhi_zzrbl_copy_url">复制微云网盘</button>');
            $btn.attr('data-clipboard-text', this.joinArr(arr));
            $('.content').append($btn);
            new ClipboardJS('.imzhi_zzrbl_copy_url');
        },
        init() {
            const prefix = this.prefix();
            const title = this.title();
            const content = this.content();

            const arr_baidu = this.arrBaidu(prefix, title, content);
            this.addBtn(arr_baidu);
            // console.log('arr_baidu', arr_baidu);

            const arr_xunlei = this.arrXunlei(prefix, title, content);
            this.addXunlei(arr_xunlei);
            // console.log('arr_xunlei', arr_xunlei);

            const arr_weiyun = this.arrWeiyun(prefix, title, content);
            this.addWeiyun(arr_weiyun);
        },
    };
    RIJUPAO.init();
})();