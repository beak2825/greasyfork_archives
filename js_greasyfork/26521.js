// ==UserScript==
// @name         custom Stylesheet
// @version      2017.01.14
// @description  add Custom style to page.
// @author       FxDash
// @match        http://*/*
// @match        https://*/*

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/17439
// @downloadURL https://update.greasyfork.org/scripts/26521/custom%20Stylesheet.user.js
// @updateURL https://update.greasyfork.org/scripts/26521/custom%20Stylesheet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 数据源匹配
    let config = GM_getValue('config', []);
    config = config.filter(function(e) {
        return e.apply;
    });

    for (let s of config) {
        if (location.href.match(new RegExp(s.match))) {
            GM_addStyle(s.value);
        }
    }
    // 设置面板
    let setup = function() {
        let d = document,
            flag = 'new',
            gindex = 0;
        let on = function(node, e, f) {
            node.addEventListener(e, f, false);
        };

        let $ = function(s) {
            return d.getElementById('custom-style-' + s);
        };

        if ($('setup')) return;

        let config = GM_getValue('config', []);

        let setupStyle = GM_addStyle('\
            #custom-style-setup * { list-style: none; margin: 0; padding: 0; text-decoration: none; font: 16px/1.2em XHei Intel, Microsoft YaHei; }\
            #custom-style-setup { background-color: #fafafa; position: fixed; top: 0; left: 0; z-index: 11069; width: 100vw; height: 100vh; overflow: hidden; display: flex; }\
            #custom-style-list { flex: 0 0 220px; width: 220px; margin: 27px 0; overflow: auto; }\
            #custom-style-list::-webkit-scrollbar { width: 6px; background-color: rgba(0, 0, 0, 0.25); border-radius: 27px; display: none; }\
            #custom-style-list:hover::-webkit-scrollbar { display: block; }\
            #custom-style-list::-webkit-scrollbar-thumb { width: 6px; background-color: rgba(0, 0, 0, 0.27); border-radius: 27px; }\
            #custom-style-list li { padding: 12px 35px 12px 15px; color: #03A9F4; font-weight: bold; border-bottom: dashed 1px #9e9e9e; }\
            #custom-style-list li.active { color: #795548; }\
            #custom-style-list a:last-child li { border-bottom: none; }\
            #custom-style-list a:first-child li { color: #4CAF50; }\
            #custom-style-info { margin-left: 37px; margin-top: 27px; }\
            #custom-style-info section { margin-bottom: 15px; }\
            #custom-style-info input, #custom-style-rule-value { margin-top: 10px; padding: 0 10px; width: 550px; line-height: 2em; }\
            #custom-style-rule-apply { width: auto !important; }\
            #custom-style-rule-btn a { margin-right: 15px; }\
        ');

        let div = d.createElement('div');
        div.id = 'custom-style-setup';
        d.body.appendChild(div);

        let slist = '',
            sindex = 0;
        for (let c of config) {
            slist += '<a class="custom-style-rule" href="javascript:;" data-id="' + sindex + '"><li>' + c.name + '</li></a>';
            sindex++;
        }

        div.innerHTML = '\
            <div id="custom-style-list">\
                <ul>\
                    <a id="custom-style-rule-add" href="javascript:;"><li>新建样式</li></a>\
                    ' + slist + '\
                </ul>\
            </div>\
            <div id="custom-style-info">\
                <section>\
                    <p><strong>规则命名</strong></p>\
                    <input id="custom-style-rule-name" type="text" name="" value="" placeholder="">\
                </section>\
                <section>\
                    <p><strong>地址匹配（正则）</strong></p>\
                    <input id="custom-style-rule-match" type="text" name="" value="" placeholder="">\
                </section>\
                <section>\
                    <p><strong>自定义样式</strong></p>\
                    <textarea id="custom-style-rule-value" name="" rows="8"></textarea>\
                </section>\
                <section>\
                    <label for="custom-style-rule-apply">\
                        <strong>启用&nbsp;&nbsp;</strong><input id="custom-style-rule-apply" type="checkbox" name="" value="">\
                    </label>\
                </section>\
                <section id="custom-style-rule-btn">\
                    <a id="custom-style-rule-delete" href="javascript:;">删除</a>\
                    <a id="custom-style-rule-cancle" href="javascript:;">取消</a>\
                    <a id="custom-style-rule-save" href="javascript:;">保存</a>\
                </section>\
            </div>\
        ';
        div = null;

        let close = function() {
            if (setupStyle) {
                setupStyle.parentNode.removeChild(setupStyle);
            }
            var div = $('setup');
            div.parentNode.removeChild(div);
        };

        let add = function() {
            if (flag == 'old' && haschange()) {
                if (confirm('确定不保存修改？')) {
                    reset();
                    flag = 'new';
                }
            } else {
                reset();
                flag = 'new';
            }
        };

        let haschange = function() {
            if (!config[gindex]) {
                return false;
            } else if (config[gindex].name != $('rule-name').value || config[gindex].match != $('rule-match').value || config[gindex].value != $('rule-value').value || config[gindex].apply != $('rule-apply').checked) {
                return true;
            } else {
                return false;
            }
        };

        let reset = function() {
            d.querySelectorAll('#custom-style-info input, #custom-style-info textarea').forEach(function(e) {
                e.value = '';
            });
        };

        let del = function() {
            console.log(gindex);
            if (confirm('确认删除？') && config[gindex]) {
                config.splice(gindex, 1);
                GM_setValue('config', config);
                let _this = d.querySelectorAll('.custom-style-rule')[gindex];
                _this.parentNode.removeChild(_this);
                resort();
                reset();
            }
        };

        let choose = function() {
            let index = parseInt(this.getAttribute("data-id"));
            if (flag == 'new' && !confirm('确定不保存？')) {
                return false;
            }

            for (let e of d.querySelectorAll('.custom-style-rule li')) {
                e.className = '';
            }

            this.querySelector('li').className = 'active';
            if (config[index]) {
                gindex = index;
                flag = 'old';
                $('rule-name').value = config[index].name;
                $('rule-match').value = config[index].match;
                $('rule-value').value = config[index].value;
                $('rule-apply').checked = config[index].apply;
            }
        };

        let save = function() {
            if (flag == 'old' && config[gindex]) {
                config[gindex].name = $('rule-name').value;
                config[gindex].match = $('rule-match').value;
                config[gindex].value = $('rule-value').value;
                config[gindex].apply = $('rule-apply').checked;
                GM_setValue('config', config);
                d.querySelector('.custom-style-rule[data-id="' + gindex + '"] li').innerText = $('rule-name').value;
                alert('保存成功');
            } else if (flag == 'new') {
                let _new = {
                    "name": $('rule-name').value,
                    "match": $('rule-match').value,
                    "value": $('rule-value').value,
                    "apply": $('rule-apply').checked
                };

                config.unshift(_new);
                GM_setValue('config', config);

                let li = d.createElement('a');
                li.className = 'custom-style-rule';
                li.href = 'javascript:;';
                li.setAttribute('data-id', 0);
                li.innerHTML = '<li>' + _new.name + '</li>';
                $('list').querySelector('ul').insertBefore(li, $('list').querySelector('.custom-style-rule'));

                resort();

                li.innerHTML = '<li class="active">' + _new.name + '</li>';

                flag = 'old';
                gindex = 0;
                on(li, 'click', choose);
                alert('保存成功');
            } else {
                alert('保存错误');
            }
        };

        let resort = function() {
            let index = 0;
            for (let e of d.querySelectorAll('.custom-style-rule')) {
                e.setAttribute('data-id', index++);
                e.querySelector('li').className = '';
            }
        };

        on($('rule-cancle'), 'click', close);
        on($('rule-save'), 'click', save);
        on($('rule-delete'), 'click', del);
        on($('rule-add'), 'click', add);

        for (let n of d.querySelectorAll('.custom-style-rule')) {
            on(n, 'click', choose);
        }
    };
    GM_registerMenuCommand('添加自定义样式', setup);
})();
