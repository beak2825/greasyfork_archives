// ==UserScript==
// @name         AtCoder Template for ACE Editor
// @by           https://greasyfork.org/ja/scripts/438105-atcoder-template
// @namespace    http://atcoder.jp/
// @version      0.4
// @description  言語ごとにテンプレートを登録して、貼り付けの手間を減らします
// @author       magurofly, yama_can
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submit*
// @match        https://atcoder.jp/contests/*/custom_test*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?domain=atcoder.jp
// @license      CC0 1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/473790/AtCoder%20Template%20for%20ACE%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/473790/AtCoder%20Template%20for%20ACE%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = "0.1";

    const $ = unsafeWindow.$;

    // 設定があればロード
    const config = (() => {
        let data = {};

        {
            const config_json = GM_getValue("config", "{}");
            if (config_json) {
                try {
                    data = JSON.parse(config_json);
                } catch (e) {
                    console.error("AtCoder Template: Invalid JSON", config_json);
                }
            }
        }

        return {
            save() {
                const config_json = JSON.stringify(data);
                GM_setValue("config", config_json);
                console.info("AtCoder Template: saved config");
            },

            delete(key) {
                delete data[key];
                this.save();
            },

            get(key, defaultValue = null) {
                return (key in data) ? data[key] : defaultValue;
            },

            set(key, value) {
                data[key] = value;
                this.save();
            },
        };
    })();

    class View {
        constructor() {
            this.lang = $("#select-lang select[name='data.LanguageId']");

            const btnEditTemplate = $(`<button type="button" class="btn btn-default btn-sm">テンプレートを編集</button>`);
            const btnLoadTemplate = $(`<button type="button" class="btn btn-danger btn-sm">ロード</button>`);
            const group = $(`<div class="btn-group" role="group">`).append(btnEditTemplate, btnLoadTemplate);
            $(".editor-buttons").append($(`<p>`).append(group));

            btnEditTemplate.click(() => {
                const langId = this.lang.val();
                const langLabel = this.lang.find(":selected").text();
                this.openTemplateEditor(langId, langLabel);
            });
            btnLoadTemplate.click(() => {
                if (this.getText()) {
                    if (!confirm("テンプレートを読み込むと、現在のソースは上書きされます。読み込みますか？")) return;
                }
                const langId = this.lang.val();
                if (!this.loadTemplate()) {
                    alert(`言語ID ${langId} のテンプレートは登録されていません`);
                }
            });

            this.modal = $(`<section class="modal fade">`).html(`
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
            <h4 class="modal-title">テンプレートの編集</h4>
        </div>
        <div class="modal-body">
            <div class="row">
                <p class="col"><span id="atcoder-template-desc"></span>テンプレートを編集します</p>
            </div>
            <div class="row">
                <textarea rows="10" id="atcoder-template-editor" class="col" style="margin: 1%; width: 98%; height: 100%; font-family: monospace"></textarea>
            </div>
            <div class="row"><div class="col">
                <button type="button" id="atcoder-template-save" class="btn btn-primary">保存</button>
                <button type="button" id="atcoder-template-delete" class="btn btn-danger">削除</button>
            </div></div>
        </div>
    </div>
</div>
            `);
            this.modal.appendTo(unsafeWindow.document.body);

            // 言語が変更されるたびに loadTemplate する
            // ただし、提出欄が空でない場合はしない
            this.lang.on("change", _e => {
                if (!this.getText()) this.loadTemplate();
            });
            this.loadTemplate();
        }

        // `languageId` で指定した言語 ID に対するテンプレートを提出欄に貼り付ける
        // 返り値: テンプレートが登録されているかどうか
        loadTemplate(languageId = null) {
            languageId = languageId || this.lang.val();
            const template = config.get(languageId);
            if (template != null) {
                this.setText(template);
                return true;
            } else {
                return false;
            }
        }

        setText(text) {
            let options = {
                tabSize: getLS('tab_size') || 2,
                useSoftTabs: false,
                useWorker: false,
            };
            let editor = ace.edit('editor', options);
            editor.getSession().setValue(text)
        }

        getText() {
            let options = {
                tabSize: getLS('tab_size') || 2,
                useSoftTabs: false,
                useWorker: false,
            };
            let editor = ace.edit('editor', options);
            return editor.getSession().getValue()
        }

        openTemplateEditor(languageId, label = languageId) {
            const editor = this.modal.find("#atcoder-template-editor");
            this.modal.find("#atcoder-template-desc").text(`${label} [${languageId}] の`);
            editor.val(config.get(languageId, ""));
            this.modal.find("#atcoder-template-save")[0].onclick = () => {
                console.log("saved", editor.val());
                config.set(languageId, editor.val());
                config.save();
            };
            this.modal.find("#atcoder-template-delete")[0].onclick = () => {
                config.delete(languageId);
                editor.val("");
            };
            this.modal.modal();
        }
    }

    unsafeWindow.AtCoderTemplate = {
        version: VERSION,
        view: new View(),
    };
})();