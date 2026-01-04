// ==UserScript==
// @name         WordPress 自动选择分类目录
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.rijupao.com/wp-admin/post-new.php
// @match        https://www.rijupao.com/wp-admin/post.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/lodash.js/4.17.19/lodash.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406934/WordPress%20%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%88%86%E7%B1%BB%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/406934/WordPress%20%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%88%86%E7%B1%BB%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

// 避免 WordPress 后台 _ 冲突
window.lodash = _.noConflict();
(function() {
    'use strict';
    const $toggle = $('#category-add-toggle');
    const $button = $('<button/>');
    $button.attr('type', 'button');
    $button.text('自动选择分类');
    $button.click(autoClick);
    $toggle.after($button);

    function autoClick() {
        const $selectit = $('#categorychecklist > .wpseo-term-unchecked > .selectit');
        if (!$selectit.length) {
            alert('没有找到[分类目录]哦!');
            return;
        }

        const text = prompt('输入分类目录(以中/英文逗号分隔,缩写：subpig - SUBPIG猪猪字幕,真实 - 真实事件改编,漫改 - 漫画改编):');
        if (!text) {
            return;
        }
        let arr = lodash.uniq(lodash.map(text.split(/,|，/), trim));
        if (!arr.length) {
            return;
        }
        // 替换缩写
        arr = lodash.map(arr, (arr_item) => {
            switch (arr_item) {
                case 'subpig':
                case 'SUBPIG':
                    return 'SUBPIG猪猪字幕';
                case '真实':
                    return '真实事件改编';
                case '漫改':
                    return '漫画改编';
            }
            return arr_item;
        });
        let selected = [];
        $selectit.each(function(i, el) {
            const $el = $(el);
            const $checkbox = $el.find('[type="checkbox"]');
            const val = $el.text().trim();
            if (arr.indexOf(val) < 0) {
                $checkbox.prop('checked', false);
                return;
            }
            selected.push(val);
            $checkbox.prop('checked', true);
        });

        const unselected = lodash.difference(arr, selected);
        const $newcategory = $('#newcategory');
        const $submit = $('#category-add-submit');
        if (!$newcategory.is(':visible')) {
            $toggle[0].click();
        }
        function addCategory(item) {
            $newcategory.val(item);
            $submit[0].click();
        }
        const promise_all = unselected.map(function(item, i) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    addCategory(item);
                    resolve(item);
                }, i*2500);
            })
        });
        Promise.all(promise_all);
    }

    function trim(str) {
        return str.trim();
    }
})();