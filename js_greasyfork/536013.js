// ==UserScript==
// @name         スクリプト統合版(仮)
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  統合されたスクリプト(仮)
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @connect      plus-nao.com
// @connect      my-data-repo.vercel.app
// @downloadURL https://update.greasyfork.org/scripts/536013/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E7%B5%B1%E5%90%88%E7%89%88%28%E4%BB%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536013/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E7%B5%B1%E5%90%88%E7%89%88%28%E4%BB%AE%29.meta.js
// ==/UserScript==

(async function () {

    const settingsKeys = [
        "modifyHelpLinks", "enhanceTitleEditor", "titleInputHelper", "costCalculator",
        "directoryCheck", "setupShipping", "enhanceRemarksEditor", "presetTextHelper",
        "autoInsertColor", "enhanceStockTable", "copyMakerStockTable", "enhanceAxisCodeManager",
        "personalMemo", "removeUnwantedImgs","loadAllImages", "dlMergedImgs", "imgSizeCheck", "enhanceNewAlpha",
        "orderStatusCheck", "bulkOrderCheck", "axisReminder", "nonColorSizeReminder",
        "axisCodeErrorCheck", "autoReplaceAxisCode","denpyoUpdateGuard","applyTagStyle","denpyoReflector",
        "jyuchuDateCheck"
    ];

    const settings = {};

    for (const key of settingsKeys) {
        settings[key] = await GM_getValue(key, true);
    }

    GM_registerMenuCommand("設定パネルを表示", () => {
        const oldPanel = document.getElementById("userscript-settings");
        if (oldPanel) oldPanel.remove();

        const host = document.createElement('div');
        host.id = 'tm-shadow-host';
        document.body.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });

        const style = document.createElement("style");
        style.textContent = `
    #userscript-settings input[type="checkbox"] {
      margin: 0 10px 0 0;
      vertical-align: middle;
    }

    #userscript-settings label {
      font-size: 16px;
      font-weight: normal;
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
    }

    #userscript-settings button {
      background-color: #3498db;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }

    #userscript-settings button:hover {
      background-color: #2980b9;
    }

    #userscript-settings button:active {
      background-color: #1f6391;
    }
  `;

        const wrapper = document.createElement("div");
        wrapper.id = "userscript-settings";
        wrapper.style.cssText = `
            position: fixed;
            inset: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
          `;

        function createCheckboxAndDetails(id, labelText, detailsText) {
            return `
          <div style="display: flex; align-items: center; margin-top: 10px; color: #f0f0f0;">
            <label for="${id}" style="margin-right: 10px; display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" id="${id}" style="margin-right: 5px;">
              ${labelText}
            </label>
            <span class="toggleHelpDetails" style="cursor: pointer; color: #aaa;">(?)</span>
          </div>
          <details id="${id}Details" style="font-size: 12px; color: #ccc; margin-left: 1.5em;">
            <summary style="display: none;">詳細</summary>
            <div>${detailsText}</div>
          </details>
        `;
        }

        wrapper.innerHTML = `
          <div style="
            background: #1e1e1e;
            color: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          ">
            <h2 style="margin-top: 0;">スクリプト設定</h2>

            <section style="margin-bottom: 16px;">
              <details id="listingTeam">
                <summary style="font-weight: bold; cursor: pointer;">出品チーム用(仮)</summary>
                <div style="padding-left: 20px; margin-top: 10px;">
                  ${createCheckboxAndDetails('modifyHelpLinks', 'ヘルプリンク更新', 'ヘルプリンクの更新と追加')}
                  ${createCheckboxAndDetails('enhanceTitleEditor', 'タイトルの機能拡張', '入力されている全文をポップアップ表示<br>不要なスペースと重複ワードの検出・削除<br>全角スペースの半角化<br>文字数カウンターを追加<br>ブラウザタブタイトルにコードを記載')}
                  ${createCheckboxAndDetails('titleInputHelper', 'タイトル入力補助', '本登録時にタイトルを送信し収集<br>収集されたデータからワード候補を表示')}
                  ${createCheckboxAndDetails('costCalculator', '原価計算', '仕入れ原価(元)の入力欄に電卓機能を追加')}
                  ${createCheckboxAndDetails('directoryCheck', 'ディレクトリチェック', 'ディレクトリの検索機能を追加<br>現在入力されているディレクトリの詳細を表示<br>存在しないIDや数字以外が入力されている場合は赤枠で表示')}
                  ${createCheckboxAndDetails('setupShipping', '重量と送料設定サポート', '重量欄と送料設定の初期設定を変更<br>送料設定を優先順に並び替え<br>重量欄で計算可能に')}
                  ${createCheckboxAndDetails('enhanceRemarksEditor', '備考欄の機能拡張', '入力されている全文をポップアップで表示<br>文字数カウンターを追加<br>備考欄にヘルプを追加')}
                  ${createCheckboxAndDetails('presetTextHelper', '定型文入力補助', '定型文を各入力欄にペーストする機能')}
                  ${createCheckboxAndDetails('autoInsertColor', 'カラー欄定型文自動入力', 'ページロード時に自動入力')}
                  ${createCheckboxAndDetails('enhanceStockTable', '在庫表機能拡張', '入力中にEnterで下に移動<br>コピペ時の改行に対応<br>各行をナンバリング<br>文字数チェック<br>重複コードチェック')}
                  ${createCheckboxAndDetails('copyMakerStockTable', '在庫表一括コピー(アリババ用)', 'メーカーの在庫表を一括コピーできるボタンを右上に追加<br>おまけ：重量情報を画面右の見やすいところに配置')}
                  ${createCheckboxAndDetails('enhanceAxisCodeManager', '縦横軸コード管理の機能拡張', '改行を含むペーストに対応')}
                  ${createCheckboxAndDetails('personalMemo', 'メモ欄', '自分用のメモ欄をメインページに表示<br>縦横軸管理にも商品コード毎にメモを共有')}
                  ${createCheckboxAndDetails('removeUnwantedImgs', '不要画像削除(アリババ用)', '類似商品やオススメ商品の画像を削除')}
                  ${createCheckboxAndDetails('loadAllImages', '全画像ロード(アリババ用)', '全画像をスクロールする前にロード')}
                  ${createCheckboxAndDetails('dlMergedImgs', '結合画像ダウンロード(アリババ用)', '画像を順番に結合してダウンロードするボタンを追加')}
                  ${createCheckboxAndDetails('imgSizeCheck', 'New α版の画像サイズチェック', '画像の横幅と縦幅を表示<br>サイズに問題がある場合は赤枠で表示')}
                  ${createCheckboxAndDetails('enhanceNewAlpha', 'New α版の機能拡張', 'テンプレ画像をリストから選べるボタンを追加<br>画像拡大機能とその設定機能を歯車としてページ右下に追加')}
                  ${createCheckboxAndDetails('orderStatusCheck', '受発注可不可チェック', '自己チェック用のチェックボックスをメインページ在庫表上部に配置<br>受発注可不可設定画面にリマインダーとして表示')}
                  ${createCheckboxAndDetails('bulkOrderCheck', '一括受発注チェック', '条件に基づいてチェックボックスを一括操作')}
                  ${createCheckboxAndDetails('axisReminder', '縦横軸設定リマインダー', '受発注チェック画面で縦横軸コード管理に飛ぶ新たなボタンを追加')}
                  ${createCheckboxAndDetails('nonColorSizeReminder', 'カラーとサイズ以外リマインダー', '項目名をカラーとサイズ以外にした場合、登録後に通知を表示')}
                </div>
              </details>
            </section>

            <section style="margin-bottom: 16px;">
              <details id="fixTeam">
                <summary style="font-weight: bold; cursor: pointer;">修正チーム用(仮)</summary>
                <div style="padding-left: 20px; margin-top: 10px;">
                  ${createCheckboxAndDetails('axisCodeErrorCheck', '縦横軸コード管理エラーチェック', 'byte数やスペース・記号・機種依存文字を検出<br>いずれかに該当する場合はSKUを追加できないようにする')}
                  ${createCheckboxAndDetails('autoReplaceAxisCode', '縦横軸コード管理のコード自動置換', 'SKU追加時に項目名の入力からコードに自動置換')}
                </div>
              </details>
            </section>

            <section style="margin-bottom: 16px;">
              <details id="conciergeTeam">
                <summary style="font-weight: bold; cursor: pointer;">コンシェルジュ用(仮)</summary>
                <div style="padding-left: 20px; margin-top: 10px;">
                  ${createCheckboxAndDetails('denpyoUpdateGuard', '伝票更新警告機能', '誤操作防止のため納品書印刷済み・印刷待ちの伝票に対して<br>更新前に警告を表示')}
                  ${createCheckboxAndDetails('applyTagStyle', '旧伝票タグ整列', '旧伝票のタグのスタイルを整えてトラディショナルのようにする')}
                  ${createCheckboxAndDetails('denpyoReflector', '複写伝票反映', '複写先とその元に伝票番号をワンクリックで自動入力')}
                  ${createCheckboxAndDetails('jyuchuDateCheck', '受注日チェック', '受注日が6ヶ月以上前の場合は警告を表示<br>再検索ボタンで最新の受注日を検索して開き直す')}
                </div>
              </details>
            </section>

            <div style="text-align: right; margin-top: 20px;">
              <button id="saveSettings">保存</button>
              <button id="closeSettings" style="margin-left: 10px;">閉じる</button>
            </div>
          </div>
        `;

        const modal = wrapper.querySelector("div");

        wrapper.addEventListener("click", function (e) {
            if (!modal.contains(e.target)) {
                wrapper.remove();
            }
        });

        shadow.appendChild(style);
        shadow.appendChild(wrapper);

        shadow.querySelectorAll('.toggleHelpDetails').forEach((btn) => {
            btn.addEventListener('click', () => {
                const parentDiv = btn.closest('div');
                const input = parentDiv?.querySelector('input[type="checkbox"]');
                if (input && input.id) {
                    const details = shadow.getElementById(`${input.id}Details`);
                    if (details) {
                        details.toggleAttribute('open');
                    }
                }
            });
        });

        settingsKeys.forEach(key => {
            const el = shadow.getElementById(key);
            if (el) el.checked = settings[key];
        });

        const saveBtn = shadow.getElementById("saveSettings");
        if (saveBtn) {
            saveBtn.onclick = async () => {
                for (const key of settingsKeys) {
                    const el = shadow.getElementById(key);
                    if (el) {
                        await GM_setValue(key, el.checked);
                    }
                }
                alert("設定を保存しました。\nページリロード後に反映されます。");
            };
        }

        const closeBtn = shadow.getElementById("closeSettings");
        if (closeBtn) {
            closeBtn.onclick = () => host.remove();
        }
    });

    window.addEventListener("message", async (e) => {
        if (e.data?.type === "saveSettings") {
            const newSettings = e.data.data;
            for (const key in newSettings) {
                await GM_setValue(key, newSettings[key]);
            }
        }
    });

    const pageScriptList = [
        {
            pageName: "受発注可不可設定ページ(check)",
            urlPattern: /:\/\/plus-nao\.com\/forests\/[^\/]+\/sku_check\/[^\/]+/,
            scripts: [
                {
                    name: '縦横軸リマインダー',
                    isEnabled: () => settings.axisReminder,
                    run: axisReminder,
                },
                {
                    name: '受発注可不可チェック',
                    isEnabled: () => settings.orderStatusCheck,
                    run: orderStatusCheck,
                },
                {
                    name: '一括受発注チェック',
                    isEnabled: () => settings.bulkOrderCheck,
                    run: bulkOrderCheck,
                },
                {
                    name: 'カラーとサイズ以外リマインダー',
                    isEnabled: () => settings.nonColorSizeReminder,
                    run: nonColorSizeReminder,
                },
            ],
        },
        {
            pageName: "受発注可不可設定ページ(edit)",
            urlPattern: /:\/\/plus-nao\.com\/forests\/[^\/]+\/sku_edit\/[^\/]+/,
            scripts: [
                {
                    name: '一括受発注チェック',
                    isEnabled: () => settings.bulkOrderCheck,
                    run: bulkOrderCheck,
                },
            ],
        },
        {
            pageName: "出品用メインページ(出品前)",
            urlPattern: /^https?:\/\/plus-nao\.com\/forests\/[^/]+\/mainedit\/[^/]*$/,
            scripts: [
                {
                    name: 'ヘルプリンク更新',
                    isEnabled: () => settings.modifyHelpLinks,
                    run: modifyHelpLinks,
                },
                {
                    name: 'タイトル機能拡張',
                    isEnabled: () => settings.enhanceTitleEditor,
                    run: enhanceTitleEditor,
                },
                {
                    name: 'タイトル入力補助',
                    isEnabled: () => settings.titleInputHelper,
                    run: titleInputHelper,
                },
                {
                    name: '原価計算',
                    isEnabled: () => settings.costCalculator,
                    run: costCalculator,
                },
                {
                    name: 'ディレクトリチェック',
                    isEnabled: () => settings.directoryCheck,
                    run: directoryCheck,
                },
                {
                    name: '重量と送料設定サポート',
                    isEnabled: () => settings.setupShipping,
                    run: setupShipping,
                },
                {
                    name: '備考欄機能拡張',
                    isEnabled: () => settings.enhanceRemarksEditor,
                    run: enhanceRemarksEditor,
                },
                {
                    name: '定型文入力補助',
                    isEnabled: () => settings.presetTextHelper,
                    run: presetTextHelper,
                },
                {
                    name: 'カラー欄定型文自動入力',
                    isEnabled: () => settings.autoInsertColor,
                    run: autoInsertColor,
                },
                {
                    name: '在庫表機能拡張',
                    isEnabled: () => settings.enhanceStockTable,
                    run: enhanceStockTable,
                },
                {
                    name: 'メモ欄',
                    isEnabled: () => settings.personalMemo,
                    run: personalMemo,
                },
                {
                    name: '受発注可不可チェック',
                    isEnabled: () => settings.orderStatusCheck,
                    run: orderStatusCheck,
                },
                {
                    name: 'カラーとサイズ以外リマインダー',
                    isEnabled: () => settings.nonColorSizeReminder,
                    run: nonColorSizeReminder,
                },
            ],
        },
        {
            pageName: "出品用メインページ(出品後)",
            urlPattern: /^https?:\/\/plus-nao\.com\/forests\/[^/]+\/registered_mainedit\/.*$/,
            scripts: [
                {
                    name: 'ヘルプリンク更新',
                    isEnabled: () => settings.modifyHelpLinks,
                    run: modifyHelpLinks,
                },
                {
                    name: 'タイトル機能拡張',
                    isEnabled: () => settings.enhanceTitleEditor,
                    run: enhanceTitleEditor,
                },
                {
                    name: 'タイトル入力補助',
                    isEnabled: () => settings.titleInputHelper,
                    run: titleInputHelper,
                },
                {
                    name: '原価計算',
                    isEnabled: () => settings.costCalculator,
                    run: costCalculator,
                },
                {
                    name: 'ディレクトリチェック',
                    isEnabled: () => settings.directoryCheck,
                    run: directoryCheck,
                },
                {
                    name: '重量と送料設定サポート',
                    isEnabled: () => settings.setupShipping,
                    run: setupShipping,
                },
                {
                    name: '備考欄機能拡張',
                    isEnabled: () => settings.enhanceRemarksEditor,
                    run: enhanceRemarksEditor,
                },
                {
                    name: '定型文入力補助',
                    isEnabled: () => settings.presetTextHelper,
                    run: presetTextHelper,
                },
                {
                    name: 'カラー欄定型文自動入力',
                    isEnabled: () => settings.autoInsertColor,
                    run: autoInsertColor,
                },
                {
                    name: '在庫表機能拡張',
                    isEnabled: () => settings.enhanceStockTable,
                    run: enhanceStockTable,
                },
                {
                    name: 'メモ欄',
                    isEnabled: () => settings.personalMemo,
                    run: personalMemo,
                },
                {
                    name: '受発注可不可チェック',
                    isEnabled: () => settings.orderStatusCheck,
                    run: orderStatusCheck,
                },
                {
                    name: 'カラーとサイズ以外リマインダー',
                    isEnabled: () => settings.nonColorSizeReminder,
                    run: nonColorSizeReminder,
                },
            ],
        },
        {
            pageName: "仮登録ページ",
            urlPattern: /^https?:\/\/plus-nao\.com\/forests\/[^/]+\/interim_registration$/,
            scripts: [
                {
                    name: 'modifyHelpLinks',
                    isEnabled: () => settings.modifyHelpLinks,
                    run: modifyHelpLinks,
                },
            ],
        },
        {
            pageName: "縦横軸管理ページ",
            urlPattern: /https?:\/\/starlight\.plusnao\.co\.jp\/goods\/axisCode.*/,
            scripts: [
                {
                    name: '縦横軸コード管理の機能拡張',
                    isEnabled: () => settings.enhanceAxisCodeManager,
                    run: enhanceAxisCodeManager,
                },
                {
                    name: 'メモ欄',
                    isEnabled: () => settings.personalMemo,
                    run: personalMemo,
                },
                {
                    name: '縦横軸コード管理エラーチェック',
                    isEnabled: () => settings.axisCodeErrorCheck,
                    run: axisCodeErrorCheck,
                },
                {
                    name: '縦横軸コード管理のコード自動置換',
                    isEnabled: () => settings.autoReplaceAxisCode,
                    run: autoReplaceAxisCode,
                },
            ],
        },
        {
            pageName: "商品画像設定 (New α)",
            urlPattern: /https?:\/\/starlight\.plusnao\.co\.jp\/goods\/image\/edit\/.*/,
            scripts: [
                {
                    name: 'New α版の画像サイズチェック',
                    isEnabled: () => settings.imgSizeCheck,
                    run: imgSizeCheck,
                },
                {
                    name: 'New α版の機能拡張',
                    isEnabled: () => settings.enhanceNewAlpha,
                    run: enhanceNewAlpha,
                },
            ],
        },
        {
            pageName: "アリババ",
            urlPattern: /https?:\/\/detail\.1688\.com\/offer\/.*/,
            scripts: [
                {
                    name: '在庫表を一括コピー',
                    isEnabled: () => settings.copyMakerStockTable,
                    run: copyMakerStockTable,
                },
                {
                    name: '不要画像削除(アリババ用)',
                    isEnabled: () => settings.removeUnwantedImgs,
                    run: removeUnwantedImgs,
                },
                {
                    name: '全画像ロード(アリババ用)',
                    isEnabled: () => settings.loadAllImages,
                    run: loadAllImages,
                },
                {
                    name: '結合画像ダウンロード(アリババ用)',
                    isEnabled: () => settings.dlMergedImgs,
                    run: dlMergedImgs,
                },
            ],
        },
        {
            pageName: "伝票管理",
            urlPattern: /https?:\/\/main\.next-engine\.com\/Userjyuchu\/jyuchuInp.*/,
            scripts: [
                {
                    name: '伝票更新警告機能',
                    isEnabled: () => settings.denpyoUpdateGuard,
                    run: denpyoUpdateGuard,
                },
                {
                    name: '旧伝票タグ整列',
                    isEnabled: () => settings.applyTagStyle,
                    run: applyTagStyle,
                },
                {
                    name: '複写伝票反映',
                    isEnabled: () => settings.denpyoReflector,
                    run: denpyoReflector,
                },
                {
                    name: '受注日チェック',
                    isEnabled: () => settings.jyuchuDateCheck,
                    run: jyuchuDateCheck,
                },
            ],
        },
    ];

    function runPageScripts() {
        const url = window.location.href;
        for (const page of pageScriptList) {
            if (page.urlPattern.test(url)) {
                console.log(`[ページ検出] ${page.pageName}`);
                page.scripts.forEach(script => {
                    if (script.isEnabled()) {
                        console.log(`実行: ${script.name}`);
                        script.run();
                    } else {
                        console.log(`無効: ${script.name}`);
                    }
                });
                break;
            }
        }
    }

    // 各スクリプト機能
    function modifyHelpLinks() {

        const linksToReplace = [
            {
                oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/765",
                newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E7%99%BA%E9%80%81%E6%96%B9%E6%B3%95%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
            },
            {
                oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/45",
                newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E7%B4%A0%E6%9D%90%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
            },
            {
                oldLink: "http://tk2-217-18298.vs.sakura.ne.jp/boards/5/topics/89",
                newLink: "http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%BD%9C%E6%88%90%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
            }
        ];

        const anchors = document.getElementsByTagName('a');

        for (let i = 0; i < anchors.length; i++) {
            for (let j = 0; j < linksToReplace.length; j++) {
                if (anchors[i].href === linksToReplace[j].oldLink) {
                    anchors[i].href = linksToReplace[j].newLink;
                }
            }
        }

        function createHelpLink(url, text) {
            const container = document.createElement('span');
            container.style.display = 'inline-flex';
            container.style.alignItems = 'center';

            const openingText = document.createTextNode('(=> ');
            const closingText = document.createTextNode(' )');

            const helpLink = document.createElement('a');
            helpLink.href = url;
            helpLink.textContent = text;
            helpLink.target = '_blank';

            container.appendChild(openingText);
            container.appendChild(helpLink);
            container.appendChild(closingText);

            return container;
        }

        if (window.location.href.includes('interim_registration')) {
            const productMasterCodeElement = document.evaluate(
                "//h4[text()='商品マスターコード']",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (productMasterCodeElement) {
                const helpContainer = createHelpLink(
                    'http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E5%95%86%E5%93%81%E3%82%B3%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7',
                    '商品コード一覧'
                );
                productMasterCodeElement.appendChild(helpContainer);
            }
        }

        const table = document.querySelector('table.hontoroku');
        if (table) {
            const targetCell = document.evaluate(
                '//table[@class="hontoroku"]//th[@width="20%" and @scope="row" and contains(., "仕入れ原価(元")]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (targetCell) {
                const helpContainer = createHelpLink(
                    'http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E4%BB%95%E5%85%A5%E3%82%8C%E4%BE%A1%E6%A0%BC%E3%83%98%E3%83%AB%E3%83%97',
                    'ヘルプ'
                );
                targetCell.appendChild(helpContainer);
            }
        }
    }

    function enhanceTitleEditor() {

        document.title += "/" + window.location.href.split('/').pop();

        const MAX_LENGTH = 255;
        let isEditingPopup = false;

        const style = document.createElement('style');
        style.textContent = `
        .cursor-warning {
            color: red;
        }
    `;

        document.head.appendChild(style);

        window.addEventListener('load', function() {
            const targetTd = document.querySelector('td[colspan="3"]:has(input[name="data[TbMainproduct][daihyo_syohin_name]"])');
            if (targetTd) {
                const computedStyle = window.getComputedStyle(targetTd);
                const paddingTop = computedStyle.paddingTop;

                if (paddingTop === '7px') {
                    targetTd.style.position = 'relative';
                    targetTd.style.paddingTop = '30px';
                }
            }

            const inputFieldId = 'TbMainproductDaihyoSyohinName';
            const inputField = document.getElementById(inputFieldId);
            if (!inputField) return;

            const wrapperDiv = document.createElement('div');
            wrapperDiv.style.position = 'relative';
            inputField.parentNode.insertBefore(wrapperDiv, inputField);
            wrapperDiv.appendChild(inputField);
            inputField.style.width = 'calc(100% - 60px)';

            const popupStyle = `
            position: absolute;
            background-color: white;
            border: 2px solid #ccc;
            border-radius: 5px;
            padding: 4px 10px;
            z-index: 1000;
            display: none;
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-sizing: border-box;
            width: calc(100% - 60px);
        `;

            const popup = document.createElement('div');
            popup.className = 'title-popup';
            popup.style.cssText = popupStyle;
            popup.contentEditable = true;
            wrapperDiv.appendChild(popup);

            function syncPopupToInput() {
                const updatedText = popup.textContent.replace(/\n/g, ' ');
                inputField.value = updatedText;
                updateButtonVisibility();
                updateCursorPosition(true);
            }

            function updatePopup() {
                if (inputField === document.activeElement && inputField.value.trim() !== '') {
                    popup.textContent = inputField.value;
                    popup.style.display = 'block';
                    updatePopupText();
                } else {
                    popup.style.display = 'none';
                }
            }

            function updatePopupText() {
                const text = inputField.value;
                popup.textContent = text;
            }

            const popupElement = document.querySelector('#popup');

            const observer = new MutationObserver(function(mutationsList) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (popupElement.style.display === 'none') {
                            popup.style.display = 'none';
                        }
                    }
                }
            });

            if (popupElement) {
                observer.observe(popupElement, { attributes: true });
            }

            document.addEventListener('click', function(event) {
                if (popup.style.display === 'block' &&
                    !popup.contains(event.target) &&
                    !inputField.contains(event.target) &&
                    !event.target.closest('.suggest-popup')) {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        const startContainer = range.startContainer;
                        const endContainer = range.endContainer;

                        if (wrapperDiv.contains(startContainer) || wrapperDiv.contains(endContainer)) {
                            return;
                        }
                    }

                    popup.style.display = 'none';
                    inputField.blur();
                    updateButtonVisibility();
                    updateCursorPosition(false);
                }
            });

            const textObserver = new MutationObserver(() => {
                const updatedText = popup.textContent.replace(/\n/g, ' ');
                inputField.value = updatedText;
                updateCursorPosition(true);
            });

            if (popup) {
                textObserver.observe(popup, { childList: true, subtree: true, characterData: true });
            }

            popup.addEventListener('mouseup', () => {
                updateCursorPosition(true);
            });

            popup.addEventListener('focus', function() {
                isEditingPopup = true;
                updateCursorPosition(true);
            });

            popup.addEventListener('blur', function() {
                if (popup.textContent.length > MAX_LENGTH) {
                    alert(`入力可能な文字数を超えています。256字以降は切り捨てられます。`);
                }

                const updatedText = popup.textContent.replace(/\n/g, ' ');
                popup.textContent = updatedText;
                inputField.value = updatedText;
                validatePopupInput();
                isEditingPopup = false;
                updateCursorPosition(false);
            });

            popup.addEventListener('keydown', function (event) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorOffset = range.startOffset;

                if (event.key === 'Enter') {
                    const beforeCursor = popup.textContent.slice(0, cursorOffset);
                    const afterCursor = popup.textContent.slice(cursorOffset);

                    popup.textContent = beforeCursor + ' ' + afterCursor;

                    const newRange = document.createRange();
                    const firstChild = popup.firstChild;

                    if (firstChild && firstChild.nodeType === 3) {
                        const newCursorPosition = beforeCursor.length + 1;
                        newRange.setStart(firstChild, newCursorPosition);
                        newRange.collapse(true);

                        selection.removeAllRanges();
                        selection.addRange(newRange);

                        setTimeout(() => {
                            updateCursorPosition(document.activeElement === popup, newCursorPosition);
                        }, 0);
                    }

                    inputField.value = popup.textContent;

                    event.preventDefault();
                } else {
                    setTimeout(() => {
                        updateCursorPosition(document.activeElement === popup);
                    }, 0);
                }
            });

            popup.addEventListener('paste', function (event) {
                event.preventDefault();

                const clipboardData = event.clipboardData || window.clipboardData;
                const pasteText = clipboardData.getData('text/plain');

                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorOffset = range.startOffset;

                range.deleteContents();

                const beforeCursor = popup.textContent.slice(0, cursorOffset);
                const afterCursor = popup.textContent.slice(cursorOffset);

                const updatedPasteText = pasteText.replace(/\n/g, ' ');

                popup.textContent = beforeCursor + updatedPasteText + afterCursor;

                const newCursorPosition = beforeCursor.length + updatedPasteText.length;

                const newRange = document.createRange();
                newRange.setStart(popup.firstChild, newCursorPosition);
                newRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(newRange);

                inputField.value = popup.textContent;

                updateButtonVisibility();
                updateCursorPosition(true);
            });

            popup.addEventListener('input', () => {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const startOffset = range.startOffset;
                const startNode = range.startContainer;

                const text = popup.textContent;

                const updatedText = text.replace(/\n/g, ' ');
                inputField.value = updatedText;

                updateButtonVisibility();
                updateCursorPosition(true);

                const newRange = document.createRange();
                newRange.setStart(startNode, Math.min(startOffset, text.length));
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            });

            let lastCursorPosition = null;

            const suggestPopupElements = document.querySelectorAll('.suggest-popup');

            suggestPopupElements.forEach(suggestPopup => {
                suggestPopup.addEventListener('mousedown', (e) => {
                    if (!isEditingPopup) return;
                    e.preventDefault();

                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        lastCursorPosition = {
                            node: range.startContainer,
                            offset: range.startOffset,
                        };
                    }
                });

                suggestPopup.addEventListener('click', (e) => {
                    if (!isEditingPopup) return;
                    if (e.target.classList.contains('add-word-button')) return;

                    if (lastCursorPosition) {
                        const selection = window.getSelection();
                        const newRange = document.createRange();
                        newRange.setStart(lastCursorPosition.node, lastCursorPosition.offset);
                        newRange.collapse(true);

                        selection.removeAllRanges();
                        selection.addRange(newRange);

                        updateCursorPosition(true);
                    }
                });
            });

            function updateInputField() {
                inputField.value = popup.textContent;
                updateButtonVisibility();
                updateCursorPosition(true);
            }

            function updateInputFieldCursorFromPopup() {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const offset = range.startOffset;
                const text = popup.textContent;
                const cursorPos = getCharacterOffsetFromPopup(text, offset);
                inputField.setSelectionRange(cursorPos, cursorPos);
                inputField.focus();
                updateCursorPosition(true);
            }

            function getCharacterOffsetFromPopup(text, offset) {
                return offset;
            }

            const spaceFixButton = createButton('スペース修正');
            const removeDuplicatesButton = createButton('重複削除');
            const cursorPosition = createCursorPosition();
            wrapperDiv.appendChild(cursorPosition);

            addHighlightStyles();

            if (isRegisteredEditPage()) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.top = '-29px';
                buttonContainer.style.right = '55px';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'row';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.zIndex = '1000';

                inputField.parentNode.style.position = 'relative';
                inputField.parentNode.appendChild(buttonContainer);

                setButtonStyles(removeDuplicatesButton, {
                    backgroundColor: 'transparent',
                    color: '#000000',
                    border: '1px solid #ccc',
                    padding: '0px 7px',
                    marginLeft: '5px',
                    marginTop: '4px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    visibility: 'hidden',
                    transition: 'background-color 0.3s, transform 0.1s',
                });

                setButtonStyles(spaceFixButton, {
                    backgroundColor: 'transparent',
                    color: '#000000',
                    border: '1px solid #ccc',
                    padding: '0px 7px',
                    marginLeft: '5px',
                    marginTop: '4px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    visibility: 'hidden',
                    transition: 'background-color 0.3s, transform 0.1s',
                });

                buttonContainer.appendChild(spaceFixButton);
                buttonContainer.appendChild(removeDuplicatesButton);

                updateButtonVisibility();

            } else if (isMainEditPage()) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.top = '-29px';
                buttonContainer.style.right = '55px';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'row';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.zIndex = '1000';

                inputField.parentNode.style.position = 'relative';
                inputField.parentNode.appendChild(buttonContainer);

                setButtonStyles(removeDuplicatesButton, {
                    backgroundColor: 'transparent',
                    color: '#000000',
                    border: '1px solid #ccc',
                    padding: '0px 7px',
                    marginLeft: '5px',
                    marginTop: '4px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    visibility: 'hidden',
                    transition: 'background-color 0.3s, transform 0.1s',
                });

                setButtonStyles(spaceFixButton, {
                    backgroundColor: 'transparent',
                    color: '#000000',
                    border: '1px solid #ccc',
                    padding: '0px 7px',
                    marginLeft: '5px',
                    marginTop: '4px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    visibility: 'hidden',
                    transition: 'background-color 0.3s, transform 0.1s',
                });

                buttonContainer.appendChild(spaceFixButton);
                buttonContainer.appendChild(removeDuplicatesButton);

                updateButtonVisibility();
            }

            inputField.addEventListener('blur', function() {
                updateCursorPosition(false);
            });
            inputField.addEventListener('focus', function() {
                updatePopup();
                updateCursorPosition(true);
            });
            inputField.addEventListener('input', function() {
                updatePopup();
            });

            inputField.addEventListener('keyup', function() {
                updateCursorPosition(true);
            });
            inputField.addEventListener('click', function() {
                updateCursorPosition(true);
            });

            spaceFixButton.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                handleSpaceFixClick(inputField, spaceFixButton);
                addClickFeedback(spaceFixButton);
            });

            removeDuplicatesButton.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                handleRemoveDuplicatesClick(inputField, removeDuplicatesButton);
                addClickFeedback(removeDuplicatesButton);
            });

            removeDuplicatesButton.addEventListener('mouseover', function() {
                const duplicates = getDuplicateWords(inputField.value);
                if (duplicates.length > 0) {
                    removeDuplicatesButton.title = `重複ワード: ${duplicates.join(', ')}`;
                } else {
                    removeDuplicatesButton.title = '';
                }
            });

            function addClickFeedback(button) {
                button.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
            }

            function attachContainerToElement(container, selector) {
                const targetButton = document.querySelector(selector);
                if (targetButton) {
                    const wrapper = document.createElement('div');
                    wrapper.style.display = 'inline-flex';
                    wrapper.style.alignItems = 'flex-end';

                    targetButton.parentNode.insertBefore(wrapper, targetButton.nextSibling);
                    wrapper.appendChild(targetButton);
                    wrapper.appendChild(container);
                }
            }

            function createButton(textContent) {
                const btn = document.createElement('button');
                btn.textContent = textContent;
                return btn;
            }

            function createCursorPosition() {
                const span = document.createElement('span');
                span.style.marginLeft = '3px';
                span.style.fontSize = '11px';
                span.style.verticalAlign = 'middle';
                return span;
            }

            function addHighlightStyles() {
                const style = document.createElement('style');
                style.innerHTML = `
                .highlight {
                    border: 2px solid #ff0000;
                    background-color: #fff5f5;
                }
            `;
                document.head.appendChild(style);
            }

            function isRegisteredEditPage() {
                return window.location.href.includes('/forests/TbMainproducts/registered_mainedit/') ||
                    window.location.href.includes('/forests/tb_mainproducts/registered_mainedit/');
            }

            function isMainEditPage() {
                return window.location.href.includes('/forests/TbMainproducts/mainedit/') ||
                    window.location.href.includes('/forests/tb_mainproducts/mainedit/');
            }

            function setButtonStyles(button, styles) {
                Object.assign(button.style, styles);

                button.addEventListener('mouseover', function() {
                    button.style.backgroundColor = '#f0f0f0';
                });
                button.addEventListener('mouseout', function() {
                    button.style.backgroundColor = 'transparent';
                });

                button.addEventListener('mousedown', function() {
                    button.style.transform = 'scale(0.95)';
                });
                button.addEventListener('mouseup', function() {
                    button.style.transform = 'scale(1)';
                });
            }

            function attachButtonToElement(button, selector, callback) {
                const targetButton = document.querySelector(selector);
                if (targetButton) {
                    targetButton.parentNode.insertBefore(button, targetButton.nextSibling);
                    callback();
                }
            }

            function attachButtonToElementInTd(button, tagName, includeText1, includeText2, callback) {
                const parentTd = inputField.closest('td');
                if (!parentTd) {
                    return;
                }

                const targetElements = parentTd.getElementsByTagName(tagName);
                for (let i = 0; i < targetElements.length; i++) {
                    if (targetElements[i].innerHTML.includes(includeText1) && targetElements[i].innerHTML.includes(includeText2)) {
                        targetElements[i].appendChild(button);
                        callback();
                        return;
                    }
                }
            }

            function updateCursorPosition(focused, customPosition = null) {
                let position;
                let totalLength;

                if (focused && inputField === document.activeElement) {
                    position = inputField.selectionStart;
                    totalLength = inputField.value.length;
                } else if (focused && popup === document.activeElement) {
                    const selection = window.getSelection();
                    position = customPosition !== null ? customPosition : selection.anchorOffset;
                    totalLength = popup.textContent.length;
                } else {
                    position = 0;
                    totalLength = inputField.value.length;
                }

                cursorPosition.textContent = focused ? `${position}/${totalLength}` : `${totalLength}`;

                if (totalLength > MAX_LENGTH) {
                    cursorPosition.classList.add('cursor-warning');
                } else {
                    cursorPosition.classList.remove('cursor-warning');
                }
            }

            function validatePopupInput() {
                let currentText = popup.textContent;
                currentText = currentText.replace(/\n/g, ' ');
                if (currentText.length > MAX_LENGTH) {
                    currentText = currentText.substring(0, MAX_LENGTH);
                    popup.textContent = currentText;
                    inputField.value = currentText;
                }
            }

            function updateButtonVisibility() {
                if (isEditingPopup) {
                    return;
                }

                const value = inputField.value;
                const hasSpaceIssues = value.match(/\s{2,}|　|^[\s　]+|[\s　]+$/);
                const hasDuplicates = hasDuplicateWords(value);

                if (hasSpaceIssues) {
                    spaceFixButton.style.visibility = 'visible';
                    inputField.classList.add('highlight');
                } else {
                    spaceFixButton.style.visibility = 'hidden';
                }

                if (hasDuplicates) {
                    removeDuplicatesButton.style.visibility = 'visible';
                    inputField.classList.add('highlight');
                } else {
                    removeDuplicatesButton.style.visibility = 'hidden';
                    if (!hasSpaceIssues) {
                        inputField.classList.remove('highlight');
                    }
                }

                updateCursorPosition(document.activeElement === inputField);
            }

            function handleSpaceFixClick(inputField, button) {
                const trimmedValue = inputField.value.trim();
                let processedValue = trimmedValue.replace(/\s{2,}/g, ' ');
                processedValue = processedValue.replace(/　/g, ' ');
                inputField.value = processedValue;
                button.style.visibility = 'hidden';
                updateButtonVisibility();
                updatePopupContent();
                updateCursorPosition(document.activeElement === inputField);
            }

            function updatePopupContent() {
                const text = inputField.value;
                popup.textContent = text;
            }

            function handleRemoveDuplicatesClick(inputField, button) {
                const value = inputField.value;
                const words = value.split(/\s+/);
                const uniqueWords = [...new Set(words)];
                const processedValue = uniqueWords.join(' ');
                if (value !== processedValue) {
                    inputField.value = processedValue;
                    inputField.classList.add('highlight');
                    updatePopupContent();
                } else {
                    inputField.classList.remove('highlight');
                }
                button.style.visibility = 'hidden';
                updateButtonVisibility();
                updateCursorPosition(document.activeElement === inputField);
            }

            function hasDuplicateWords(value) {
                const words = value.split(/\s+/).filter(word => word.trim() !== '');
                const uniqueWords = new Set(words);
                return uniqueWords.size < words.length;
            }

            function getDuplicateWords(value) {
                const words = value.split(/\s+/).filter(word => word.trim() !== '');
                const wordCount = {};
                const duplicates = [];

                words.forEach(word => {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                });

                for (const word in wordCount) {
                    if (wordCount[word] > 1) {
                        duplicates.push(word);
                    }
                }

                return duplicates;
            }
        });
    }

    async function titleInputHelper() {
        const url = 'https://raw.githubusercontent.com/NEL227/my-data-repo/main/data/NGwords.txt';
        const dbName = 'ngWordsDB';
        const storeName = 'ngWordsStore';
        const keyName = 'ngWords';

        let ngWords = [];

        const db = await openDatabase();

        try {
            const cachedData = await getFromDB(db, storeName, keyName);
            const oneDayInMillis = 24 * 60 * 60 * 1000;
            const now = new Date();

            if (cachedData && now - new Date(cachedData.timestamp) <= oneDayInMillis) {
                ngWords = cachedData.words;
            }
        } catch (error) {}

        initMainScript(ngWords);

        try {
            const response = await fetch(url);
            if (response.ok) {
                const text = await response.text();
                const newWords = text.split('\n').map(word => word.trim()).filter(word => word);

                if (JSON.stringify(newWords) !== JSON.stringify(ngWords)) {
                    ngWords = newWords;
                    await saveToDB(db, storeName, { id: keyName, words: ngWords, timestamp: new Date() });
                }
            }
        } catch (error) {}

        function openDatabase() {
            return new Promise((resolve) => {
                const request = indexedDB.open(dbName, 1);
                request.onsuccess = () => resolve(request.result);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' });
                    }
                };
            });
        }

        function getFromDB(db, store, key) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([store], 'readonly');
                const objectStore = transaction.objectStore(store);
                const request = objectStore.get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject();
            });
        }

        function saveToDB(db, store, data) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([store], 'readwrite');
                const objectStore = transaction.objectStore(store);
                const request = objectStore.put(data);
                request.onsuccess = () => resolve();
                request.onerror = () => reject();
            });
        }

        function initMainScript(ngWords) {
            (function() {
                'use strict';

                const jsonURL = 'https://raw.githubusercontent.com/NEL227/my-data-repo/main/data/sorted_data.json';

                GM_addStyle(`
#popup {
    position: fixed;
    top: 1%;
    left: 0.5%;
    width: 400px;
    height: 800px;
    max-width: 100%;
    max-height: 98%;
    background: white;
    border: 1px solid black;
    padding: 10px;
    padding-left: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 10000;
    overflow-y: auto;
    display: none;
    border-radius: 5px;
    box-sizing: border-box;
}

#popup-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    height: 20px;
    position: sticky;
    top: -11px;
    background-color: white;
    z-index: 10;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

#popup-content {
    height: auto;
    overflow-y: visible;
    box-sizing: border-box;
}

#popup-close {
    cursor: pointer;
    background: transparent;
    color: black;
    border: none;
    font-size: 24px;
    padding: 10px;
    position: absolute;
    top: -11px;
    left: 1px;
    line-height: 1;
    border-radius: 5px;
    position: sticky;
    z-index: 11;
}

#popup-content ul {
    padding: 0;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    margin: 0;
}

#popup-content ul li {
    padding: 3px;
    padding-right: 5px;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.add-word-button {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 3px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 5px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: relative;
}

.add-word-button::before {
    content: '📑';
    font-size: 14px;
    display: block;
    position: relative;
    top: -1px;
    left: 1px;
}

.add-word-button::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 34px;
    height: 34px;
    z-index: 0;
}

.add-word-button:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-word-button:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

#show-subwords-button {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 3px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 5px;
    display: block;
    width: 100px;
    text-align: center;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

#show-subwords-button:hover:not(.disabled) {
    background-color: #388E3C;
}

#show-subwords-button:active:not(.disabled) {
    transform: translateY(2px);
}

#show-subwords-button.disabled {
    background-color: #ccc;
    cursor: default;
}

#show-subwords-button.active {
    background-color: #4CAF50;
    color: #ffffff;
    cursor: default;
}

#settings-button {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 3px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 5px;
    margin-top: 5.5px;
}
#settings-button::before {
    content: '⚙️';
    font-size: 14px;
    display: block;
    position: relative;
    top: -0.5px;

}

#settings-button:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#settings-button:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

#settings-popup {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    background: white;
    border: 1px solid black;
    padding: 10px;
    padding-left: 30px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 10001;
    display: none;
    border-radius: 5px;
    box-sizing: border-box;
}

#settings-popup label {
    display: block;
    margin-bottom: 5px;
}

#settings-popup input,
#settings-popup button {
    box-sizing: border-box;
    width: calc(100% - 20px);
    padding: 5px;
    margin-bottom: 10px;
    display: block;
}

#settings-popup button {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: block;
}

#settings-popup button:hover {
    background-color: #388E3C;
}

#settings-popup button:active {
    transform: translateY(2px);
}

td[colspan="3"]:has(input[name="data[TbMainproduct][daihyo_syohin_name]"]) {
    position: relative;
    padding-top: 30px;
}

.button-container {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scale(0.9);
    z-index: 999;
}

#show-subwords-button.disabled.active {
    background-color: #388E3C;
}
    `);

                const popup = document.createElement('div');
                popup.id = 'popup';
                popup.className = 'suggest-popup';
                popup.innerHTML = `
    <button id="popup-close">×</button>
    <div id="popup-header"></div>
    <div id="popup-content"><ul></ul></div>
`;
                document.body.appendChild(popup);

                const settingsButton = document.createElement('button');
                settingsButton.id = 'settings-button';
                settingsButton.title = '設定';
                settingsButton.className = 'add-word-button';

                const settingsPopup = document.createElement('div');
                settingsPopup.id = 'settings-popup';
                settingsPopup.innerHTML = `
    <label for="popup-width">横幅 (px):</label>
    <input type="number" id="popup-width" value="400" step="10" />
    <label for="popup-height">高さ (px):</label>
    <input type="number" id="popup-height" value="800" step="10" />
    <button id="apply-settings">適用</button>
`;
                document.body.appendChild(settingsPopup);

                function fetchJSON(callback) {
                    const cacheLifetime = 24 * 60 * 60 * 1000;

                    getFromIndexedDB()
                        .then(cachedData => {
                        const now = new Date().getTime();

                        if (cachedData && (now - cachedData.timestamp < cacheLifetime)) {
                            callback(cachedData.data);
                        } else {
                            fetch(jsonURL, {
                                method: 'GET',
                                cache: 'no-cache'
                            })
                                .then(response => response.json())
                                .then(data => {
                                saveToIndexedDB(data)
                                    .catch(error => console.error('データの保存中にエラーが発生しました:', error));

                                callback(data);
                            })
                                .catch(error => console.error('JSONデータの取得中にエラーが発生しました:', error));
                        }
                    })
                        .catch(error => console.error('IndexedDBからのデータ取得中にエラーが発生しました:', error));
                }

                function handleData(data) {
                    const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');
                    const inputField2A = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');
                    const inputField2B = document.querySelector('[contenteditable="true"]');
                    let activeInputField2 = inputField2A || inputField2B;
                    const button = document.getElementById('show-subwords-button');

                    const setActiveInputField2 = (field) => {
                        activeInputField2 = field;
                    };

                    [inputField2A, inputField2B].forEach(field => {
                        if (field) {
                            field.addEventListener('focus', () => setActiveInputField2(field));
                        }
                    });

                    if (inputField) {
                        let inputValue = activeInputField2.textContent?.trim() || activeInputField2.value.trim();
                        let words = inputValue.split(/\s+/);
                        let mainWord = '';

                        if (words.length > 0) {
                            mainWord = words[0];

                            if (mainWord.endsWith('用') && words.length > 1) {
                                let secondWord = words[1];

                                if (!secondWord.endsWith('用')) {
                                    mainWord = mainWord + secondWord.replace(/\s+/g, '');
                                }
                            }
                        }

                        if (data[mainWord]) {
                            const popupHeader = document.getElementById('popup-header');
                            if (popupHeader) {
                                popupHeader.textContent = `「${mainWord}」`;
                            }

                            const popupContent = document.getElementById('popup-content').querySelector('ul');

                            const updateSubwords = (currentInputValue) => {
                                const inputWords = currentInputValue.split(/\s+/);

                                const subwords = Object.entries(data[mainWord])
                                .filter(([subword]) => !ngWords.includes(subword))
                                .sort(([, aCount], [, bCount]) => bCount - aCount)
                                .map(([subword]) => {
                                    const existsInInput = inputWords.includes(subword);
                                    return `
                            <li style="color: ${existsInInput ? 'green' : 'black'};">
                                ${subword}
                                <button class="add-word-button" data-word="${subword}"></button>
                            </li>
                        `;
                                })
                                .join('');

                                popupContent.innerHTML = subwords;

                                document.querySelectorAll('.add-word-button').forEach(button => {
                                    button.addEventListener('click', (event) => {
                                        const word = event.target.getAttribute('data-word');

                                        const text = activeInputField2.textContent || activeInputField2.value || '';
                                        const selection = window.getSelection();
                                        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

                                        let start = 0, end = 0;
                                        if (range && activeInputField2.isContentEditable) {
                                            start = range.startOffset;
                                            end = range.endOffset;
                                        } else if (activeInputField2.selectionStart !== undefined) {
                                            start = activeInputField2.selectionStart;
                                            end = activeInputField2.selectionEnd;
                                        }

                                        const before = text.slice(0, start) || '';
                                        const after = text.slice(end) || '';

                                        const needsSpaceBefore = (before && before.length > 0 && before[before.length - 1] !== ' ') || false;
                                        const needsSpaceAfter = (after && after.length > 0 && after[0] !== ' ') || false;

                                        const newValue = before + (needsSpaceBefore ? ' ' : '') + word + (needsSpaceAfter ? ' ' : '') + after;

                                        if (activeInputField2.isContentEditable) {
                                            activeInputField2.textContent = newValue;

                                            const newRange = document.createRange();
                                            newRange.setStart(activeInputField2.firstChild, start + word.length + (needsSpaceBefore ? 1 : 0));
                                            newRange.setEnd(activeInputField2.firstChild, start + word.length + (needsSpaceBefore ? 1 : 0));
                                            selection.removeAllRanges();
                                            selection.addRange(newRange);
                                        } else {
                                            activeInputField2.value = newValue;
                                            activeInputField2.setSelectionRange(start + word.length + (needsSpaceBefore ? 1 : 0), start + word.length + (needsSpaceBefore ? 1 : 0));
                                        }

                                        activeInputField2.focus();
                                        updateSubwords(activeInputField2.textContent?.trim() || activeInputField2.value.trim());
                                    });
                                });
                            };

                            updateSubwords(inputValue);

                            activeInputField2.addEventListener('input', () => {
                                updateSubwords(activeInputField2.textContent?.trim() || activeInputField2.value.trim());
                            });

                            const popup = document.getElementById('popup');
                            if (popup) {
                                popup.style.display = 'block';
                                if (button) {
                                    button.textContent = '表示中';
                                    button.classList.add('disabled', 'active');
                                    button.disabled = true;
                                }
                            }
                        } else {
                            if (button) {
                                button.textContent = '登録なし';
                                button.classList.add('disabled');
                                button.classList.remove('active');
                                button.disabled = true;
                            }
                        }
                    }
                }

                function initDB() {
                    return new Promise((resolve, reject) => {
                        const request = indexedDB.open('jsonCacheDB', 1);

                        request.onupgradeneeded = (event) => {
                            const db = event.target.result;
                            if (!db.objectStoreNames.contains('jsonData')) {
                                db.createObjectStore('jsonData', { keyPath: 'id' });
                            }
                        };

                        request.onsuccess = (event) => {
                            resolve(event.target.result);
                        };

                        request.onerror = (event) => {
                            reject('IndexedDBの初期化に失敗しました');
                        };
                    });
                }

                function saveToIndexedDB(data) {
                    return initDB().then(db => {
                        return new Promise((resolve, reject) => {
                            const transaction = db.transaction(['jsonData'], 'readwrite');
                            const store = transaction.objectStore('jsonData');
                            const cacheData = {
                                id: 'jsonData',
                                timestamp: new Date().getTime(),
                                data: data
                            };
                            store.put(cacheData);

                            transaction.oncomplete = () => resolve();
                            transaction.onerror = () => reject('データの保存に失敗しました');
                        });
                    });
                }

                function getFromIndexedDB() {
                    return initDB().then(db => {
                        return new Promise((resolve, reject) => {
                            const transaction = db.transaction(['jsonData'], 'readonly');
                            const store = transaction.objectStore('jsonData');
                            const request = store.get('jsonData');

                            request.onsuccess = (event) => {
                                resolve(event.target.result);
                            };

                            request.onerror = () => reject('データの取得に失敗しました');
                        });
                    });
                }

                function adjustButtonContainerStyle() {
                    const url = window.location.href;
                    const buttonContainer = document.querySelector('.button-container');

                    if (buttonContainer) {
                        if (url.includes('registered_mainedit')) {
                            buttonContainer.style.bottom = '31.5px';
                            buttonContainer.style.left = `1px`;
                        } else {
                            buttonContainer.style.bottom = '51px';
                            buttonContainer.style.left = `1px`;
                        }
                    }
                }

                function addShowSubwordsButton() {
                    const tdElement = document.querySelector('td[colspan="3"][scope="row"]');
                    const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');

                    if (tdElement && inputField) {
                        const buttonContainer = document.createElement('div');
                        buttonContainer.className = 'button-container';

                        const showSubwordsButton = document.createElement('button');
                        showSubwordsButton.id = 'show-subwords-button';
                        showSubwordsButton.textContent = 'ワード候補';

                        const settingsButton = document.createElement('button');
                        settingsButton.id = 'settings-button';
                        settingsButton.title = '設定';
                        settingsButton.className = 'settings-button';

                        buttonContainer.appendChild(showSubwordsButton);
                        buttonContainer.appendChild(settingsButton);

                        tdElement.appendChild(buttonContainer);

                        adjustButtonContainerStyle();

                        showSubwordsButton.addEventListener('click', (event) => {
                            if (event.isTrusted) {
                                if (!showSubwordsButton.classList.contains('disabled')) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    fetchJSON(data => handleData(data));
                                }
                            }
                        });

                        settingsButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleSettingsPopup();
                        });
                    }
                }

                function toggleSettingsPopup() {
                    const settingsPopup = document.getElementById('settings-popup');
                    if (settingsPopup) {
                        settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
                    }
                }

                function closePopup() {
                    const popup = document.getElementById('popup');
                    const showSubwordsButton = document.getElementById('show-subwords-button');
                    if (popup) {
                        popup.style.display = 'none';
                        if (showSubwordsButton) {
                            showSubwordsButton.textContent = 'ワード候補';
                            showSubwordsButton.classList.remove('disabled', 'active');
                            showSubwordsButton.disabled = false;
                        }
                    }
                }

                function applySettings() {
                    const width = document.getElementById('popup-width').value || 400;
                    const height = document.getElementById('popup-height').value || 800;

                    const popup = document.getElementById('popup');
                    if (popup) {
                        popup.style.width = `${width}px`;
                        popup.style.height = `${height}px`;
                    }

                    localStorage.setItem('popupWidth', width);
                    localStorage.setItem('popupHeight', height);
                }

                function closeSettingsOnClickOutside(event) {
                    const settings = document.getElementById('settings-popup');
                    const settingsButton = document.getElementById('settings-button');
                    if (settings && !settings.contains(event.target) && event.target !== settingsButton) {
                        settings.style.display = 'none';
                    }
                }

                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape') {
                        closePopup();
                    }
                });

                document.addEventListener('click', function(event) {
                    if (event.target.id === 'popup-close') {
                        closePopup();
                    } else if (event.target.id === 'apply-settings') {
                        applySettings();
                    }
                });

                settingsButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleSettingsPopup();
                });

                document.addEventListener('click', closeSettingsOnClickOutside);

                const inputField = document.querySelector('input[name="data[TbMainproduct][daihyo_syohin_name]"]');
                if (inputField) {
                    inputField.addEventListener('input', () => {
                        const button = document.getElementById('show-subwords-button');
                        const popup = document.getElementById('popup');

                        if (button && button.textContent === '登録なし') {
                            button.textContent = 'ワード候補';
                            button.classList.remove('disabled');
                            button.disabled = false;
                        }

                        if (popup && popup.style.display === 'block') {
                            button.textContent = '表示中（更新）';
                            button.classList.remove('disabled');
                            button.classList.add('active');
                            button.disabled = false;
                        }
                    });
                }

                const observer = new MutationObserver((mutationsList, observer) => {
                    mutationsList.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.matches('.title-popup[contenteditable="true"]')) {

                                const checkButtonExistence = () => {
                                    const button = document.getElementById('show-subwords-button');
                                    if (button) {
                                        const popup = document.getElementById('popup');

                                        if (button && button.textContent === '登録なし') {
                                            button.textContent = 'ワード候補';
                                            button.classList.remove('disabled');
                                            button.disabled = false;
                                        }

                                        if (popup && popup.style.display === 'block') {
                                            button.textContent = '表示中（更新）';
                                            button.classList.remove('disabled');
                                            button.classList.add('active');
                                            button.disabled = false;
                                        }

                                        node.addEventListener('input', () => {
                                            if (button && button.textContent === '登録なし') {
                                                button.textContent = 'ワード候補';
                                                button.classList.remove('disabled');
                                                button.disabled = false;
                                            }

                                            if (popup && popup.style.display === 'block') {
                                                button.textContent = '表示中（更新）';
                                                button.classList.remove('disabled');
                                                button.classList.add('active');
                                                button.disabled = false;
                                            }
                                        });

                                        observer.disconnect();
                                    } else {
                                        setTimeout(checkButtonExistence, 100);
                                    }
                                };

                                checkButtonExistence();
                            }
                        });
                    });
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                window.addEventListener('load', () => {
                    addShowSubwordsButton();

                    const savedWidth = localStorage.getItem('popupWidth');
                    const savedHeight = localStorage.getItem('popupHeight');

                    if (savedWidth && savedHeight) {
                        const popup = document.getElementById('popup');
                        if (popup) {
                            popup.style.width = `${savedWidth}px`;
                            popup.style.height = `${savedHeight}px`;
                            document.getElementById('popup-width').value = savedWidth;
                            document.getElementById('popup-height').value = savedHeight;
                        }
                    }

                    fetchJSON(data => {
                    });
                });

                //送信機能
                const API_URL = 'https://my-data-repo.vercel.app/api/github-proxy';

                const INPUT_SELECTOR = '#TbMainproductDaihyoSyohinName';
                const BUTTON_SELECTOR = '#saveAndSkuStock';

                function getFileShaAndContent(callback) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${API_URL}`,
                        onload: function(response) {
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                const sha = data.sha;
                                const existingContent = data.content;
                                callback(sha, existingContent);
                            } else {
                                console.error("ファイルの取得に失敗しました:", response.responseText);
                                callback(null, null);
                            }
                        },
                        onerror: function(error) {
                            console.error("エラーが発生しました:", error);
                            callback(null, null);
                        }
                    });
                }

                function uploadData(retryCount = 0) {
                    const inputElement = document.querySelector(INPUT_SELECTOR);
                    if (inputElement) {
                        const newData = inputElement.value;

                        getFileShaAndContent(function(sha, existingContent) {
                            if (sha !== null) {
                                const updatedContent = existingContent + "\n" + newData;

                                GM_xmlhttpRequest({
                                    method: "PUT",
                                    url: API_URL,
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    data: JSON.stringify({
                                        sha: sha,
                                        newData: updatedContent
                                    }),
                                    onload: function(response) {
                                        if (response.status === 200) {
                                            console.log("データ送信成功");
                                        } else if (response.status === 422 && retryCount < 3) {
                                            console.warn("競合確認...リトライ中");
                                            setTimeout(() => uploadData(retryCount + 1), 1000);
                                        } else {
                                            console.error("データ送信失敗:", response.responseText);
                                        }
                                    },
                                    onerror: function(error) {
                                        console.error("Error:", error);
                                        if (retryCount < 3) {
                                            setTimeout(() => uploadData(retryCount + 1), 1000);
                                        }
                                    }
                                });
                            }
                        });
                    }
                }

                function setupButtonListener() {
                    const buttonElement = document.querySelector(BUTTON_SELECTOR);
                    if (buttonElement) {
                        buttonElement.addEventListener('click', uploadData);
                    }
                }

                setupButtonListener();

            })();
        }
    }

    function costCalculator() {

        const genkaGenInput = document.querySelector('input[name="data[TbMainproduct][genka_tnk_rmb]"]');

        function evaluateExpression(expr) {
            let result = NaN;

            if (expr.trim() === '') return result;

            expr = expr.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
            expr = expr.replace(/＋/g, '+')
                .replace(/－/g, '-')
                .replace(/[×＊]/g, '*')
                .replace(/[÷／]/g, '/')
                .replace(/．/g, '.');

            if (!/^[\d+\-*/().\s]+$/.test(expr)) return result;

            try {
                const maxDecimalPlaces = (expr.match(/\.\d+/g) || []).reduce((max, num) => Math.max(max, num.length - 1), 0);
                const scale = Math.pow(10, maxDecimalPlaces);
                const scaledExpr = `(${expr}) * ${scale}`;
                result = new Function(`return ${scaledExpr}`)() / scale;
                result = Math.round(result * 100) / 100;
            } catch (e) {
                console.error('式の評価に失敗:', e);
            }

            return result;
        }

        if (genkaGenInput) {
            genkaGenInput.placeholder = '原価を計算';
            genkaGenInput.addEventListener('focusout', () => {
                const expr = genkaGenInput.value.trim();
                const result = evaluateExpression(expr);
                if (!isNaN(result)) {
                    genkaGenInput.value = result;
                    genkaGenInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }
    }

    function directoryCheck() {

        GM_addStyle(`
    .paste-button-directory {
        background-color: #ffffff;
        color: #4CAF50;
        border: 1px solid #4CAF50;
        padding: 3px;
        cursor: pointer;
        font-size: 12px;
        border-radius: 6px;
        transition: background-color 0.2s ease, transform 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-left: 5px;
        position: relative;
        vertical-align: middle;
        transform: scale(0.95);
    }

    .paste-button-directory::before {
        content: '📑';
        font-size: 14px;
        display: block;
        position: relative;
        top: -1px;
        left: 1px;
    }

    .paste-button-directory:hover {
        background-color: #4CAF50;
        color: #ffffff;
        transform: scale(0.95) translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .paste-button-directory:active {
        background-color: #388E3C;
        transform: scale(0.95) translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .paste-button-directory::after {
        content: '';
        position: absolute;
        top: -5px;
        right: -5px;
        bottom: -5px;
        left: -5px;
        z-index: 0;
    }
    .help-icon {
    font-size: 13px;
    margin-left: 0;
    cursor: pointer;
    vertical-align: super;
   }
   .help-icon:hover {
       color: #000;
   }
        `);

        const targetInputSelector1 = 'input[name="data[TbMainproduct][YAHOOディレクトリID]"]';
        const targetInputSelector2 = 'input[name="data[TbMainproduct][NEディレクトリID]"]';

        const popupStyle = `
        position: absolute;
        background-color: #f9f9f9;
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 4px 10px;
        z-index: 1001;
        display: none;
    `;

        const createPopup = () => {
            const popup = document.createElement('div');
            popup.setAttribute('style', popupStyle);

            const contentDiv = document.createElement('div');
            popup.appendChild(contentDiv);
            document.body.appendChild(popup);
            return { popup, contentDiv };
        };

        const { popup: popup1, contentDiv: contentDiv1 } = createPopup();
        const { popup: popup2, contentDiv: contentDiv2 } = createPopup();

        const checkInputValue = (inputElement, dataMap) => {
            const value = inputElement.value;
            const isNumeric = /^\d+$/.test(value);
            const hasSpaces = /(^\s|\s$)/.test(value);
            const matches = dataMap[value.trim()] || [];

            if (value !== '' && (hasSpaces || !isNumeric || (matches.length === 0 && value !== ''))) {
                inputElement.style.border = '2px solid red';
            } else {
                inputElement.style.border = '';
            }
        };

        const addInputListener = (selector, dataMap, popup, contentDiv) => {
            const inputElement = document.querySelector(selector);
            if (!inputElement) return;

            const updatePopup = (value) => {
                const matches = dataMap[value.trim()] || [];
                if (matches.length > 0) {
                    contentDiv.innerHTML = matches.map(description => `<div>${description}</div>`).join('');
                    popup.style.display = 'flex';
                    const rect = inputElement.getBoundingClientRect();
                    const popupHeight = popup.offsetHeight;

                    if (selector === targetInputSelector1) {
                        popup.style.top = `${rect.bottom + window.scrollY}px`;
                    } else if (selector === targetInputSelector2) {
                        popup.style.top = `${rect.top + window.scrollY - popupHeight}px`;
                    }
                    popup.style.left = `${rect.left + window.scrollX}px`;
                } else {
                    contentDiv.innerHTML = '';
                    popup.style.display = 'none';
                }
            };

            checkInputValue(inputElement, dataMap);
            let blurTimeout;

            inputElement.addEventListener('focus', function(event) {
                if (blurTimeout) clearTimeout(blurTimeout);
                updatePopup(event.target.value);
            });

            inputElement.addEventListener('input', function(event) {
                updatePopup(event.target.value);
            });

            inputElement.addEventListener('blur', function(event) {
                blurTimeout = setTimeout(() => {
                    popup.style.display = 'none';
                }, 800);
                checkInputValue(event.target, dataMap);
            });

            document.addEventListener('click', function(event) {
                if (!popup.contains(event.target) && !inputElement.contains(event.target)) {
                    popup.style.display = 'none';
                }
            });

            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    popup.style.display = 'none';
                }
            });
        };

        const openIndexedDB = () => {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('DirectoryDB', 1);
                request.onupgradeneeded = function(event) {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains('directories')) {
                        db.createObjectStore('directories', { keyPath: 'id' });
                    }
                };
                request.onsuccess = function(event) {
                    resolve(event.target.result);
                };
                request.onerror = function(event) {
                    console.error('IndexedDBエラー: ' + event.target.errorCode);
                    reject('IndexedDBエラー: ' + event.target.errorCode);
                };
            });
        };

        const getDataFromIndexedDB = (db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['directories'], 'readonly');
                const objectStore = transaction.objectStore('directories');
                const request = objectStore.get('directoryData');
                request.onsuccess = function(event) {
                    resolve(event.target.result);
                };
                request.onerror = function(event) {
                    console.error('IndexedDBからデータ取得中にエラーが発生しました');
                    reject('IndexedDBからデータ取得中にエラーが発生しました');
                };
            });
        };

        const saveDataToIndexedDB = (db, data) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['directories'], 'readwrite');
                const objectStore = transaction.objectStore('directories');

                const request = objectStore.put({ id: 'directoryData', ...data });

                transaction.onerror = (event) => {
                    console.error("IndexedDBへのデータ保存中にエラーが発生しました:", event.target.error);
                    reject(event.target.error);
                };

                transaction.oncomplete = () => {
                    resolve();
                };
            });
        };

        const needsUpdate = (lastUpdated) => {
            const now = Date.now();
            const lastUpdatedDate = new Date(lastUpdated);
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            const lastUpdateDay = lastUpdatedDate.getDay();
            const currentDay = new Date().getDay();

            const lastUpdateWasMonday = lastUpdateDay === 1;
            const todayIsMonday = currentDay === 1;

            return !lastUpdated || (now - lastUpdated > oneWeek) || !lastUpdateWasMonday || todayIsMonday;
        };

        const fetchAndUpdateData = async (db) => {
            try {
                const response = await fetch('https://nel227.github.io/my-data-repo/directories.json');
                const data = await response.json();

                const lastUpdated = data.lastUpdated;

                await saveDataToIndexedDB(db, { data, lastUpdated });
                return { data, lastUpdated };
            } catch (error) {
                console.error("データの取得または保存中にエラーが発生しました:", error);
                return null;
            }
        };

        const fetchData = async () => {
            try {
                const db = await openIndexedDB();
                let directoryData = await getDataFromIndexedDB(db);

                if (!directoryData || needsUpdate(directoryData.lastUpdated)) {
                    directoryData = await fetchAndUpdateData(db);
                }

                if (directoryData && directoryData.data) {
                    const yahooDirectory = directoryData.data.YahooDirectory || {};
                    const neDirectory = directoryData.data.NEDirectory || {};

                    addInputListener(targetInputSelector1, yahooDirectory, popup1, contentDiv1);
                    addInputListener(targetInputSelector2, neDirectory, popup2, contentDiv2);
                } else {
                    console.error('データが正しく取得されませんでした。デフォルトの空データを使用します。');
                    const emptyData = {};
                    addInputListener(targetInputSelector1, emptyData, popup1, contentDiv1);
                    addInputListener(targetInputSelector2, emptyData, popup2, contentDiv2);
                }
            } catch (error) {
                console.error('データの取得中にエラーが発生しました:', error);
            }
        };

        fetchData();

        const createSearchWindow = () => {
            const searchWindow = document.createElement('div');
            searchWindow.setAttribute('style', `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 85vw;
        height: 90vh;
        background-color: #fff;
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 2vh;
        z-index: 10001;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        display: none;
        overflow: hidden;
        transform: translate(-50%, -50%);
    `);

            const idDisplay = document.createElement('div');
            idDisplay.setAttribute('style', `
        font-size: 14px;
        color: #555;
        padding-top: 8.5vh;
        padding-bottom: 2vh;
    `);

            searchWindow.appendChild(idDisplay);

            const getDetailsById = async (id) => {
                const db = await openIndexedDB();
                const directoryData = await getDataFromIndexedDB(db);

                const neDirectory = directoryData.data.NEDirectory || {};
                const yahooDirectory = directoryData.data.YahooDirectory || {};
                const trimmedId = id.trim();

                for (const [key, descriptions] of Object.entries(neDirectory)) {
                    if (key === trimmedId) {
                        return descriptions;
                    }
                }
                for (const [key, descriptions] of Object.entries(yahooDirectory)) {
                    if (key === trimmedId) {
                        return descriptions;
                    }
                }
                return null;
            };

            const updateIdDisplay = async () => {
                const neIdInput = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');
                const yahooIdInput = document.querySelector('input[name="data[TbMainproduct][YAHOOディレクトリID]"]');

                const neId = neIdInput ? neIdInput.value : '未入力';
                const yahooId = yahooIdInput ? yahooIdInput.value : '未入力';

                const neDetails = await getDetailsById(neId);
                const yahooDetails = await getDetailsById(yahooId);

                const formatDetails = (details, id) => {
                    return details ? details.map(path => path.split(' > ').join(' > ')).join('<br>') + ` (ID: ${id})` : '未入力、またはIDが見つかりません。';
                };

                idDisplay.innerHTML = `
        <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding: 5px; margin-bottom: 5px;">
            NE: ${formatDetails(neDetails, neId)}
        </div>
        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding: 5px; margin-bottom: 5px;">
            Ya: ${formatDetails(yahooDetails, yahooId)}
        </div>
    `;
            };

            const addInputListenersNeYahoo = () => {
                const neIdInput = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');
                const yahooIdInput = document.querySelector('input[name="data[TbMainproduct][YAHOOディレクトリID]"]');

                if (neIdInput) {
                    neIdInput.addEventListener('input', updateIdDisplay);
                }
                if (yahooIdInput) {
                    yahooIdInput.addEventListener('input', updateIdDisplay);
                }
            };

            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.setAttribute('style', `
        position: absolute;
        top: -5px;
        right: 0;
        cursor: pointer;
        background: transparent;
        color: black;
        border: none;
        font-size: 24px;
        padding: 10px;
        line-height: 1;
        border-radius: 5px;
        z-index: 1001;
        margin: 0;
        display: block;
    `);

            searchWindow.appendChild(closeButton);

            closeButton.addEventListener('click', () => {
                searchWindow.style.display = 'none';
            });

            const lastUpdatedElement = document.createElement('div');
            lastUpdatedElement.id = 'lastUpdated';
            lastUpdatedElement.setAttribute('style', 'margin-bottom: 10px; font-size: 14px; color: #555;');
            searchWindow.appendChild(lastUpdatedElement);

            const searchInput = document.createElement('input');
            searchInput.setAttribute('type', 'text');
            searchInput.setAttribute('placeholder', '検索キーワード (半角スペースでアンド検索)');
            searchInput.setAttribute('id', 'search-input');
            searchInput.setAttribute('style', `
        position: absolute;
        top: 4.5vh;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 50px);
        padding: 1vh;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 1vh;
        background: #fff;
        z-index: 1002;
    `);

            searchInput.addEventListener('input', (event) => {
                const query = event.target.value;
                updateSearchResults(query);

            });

            const filterContainer = document.createElement('div');
            filterContainer.setAttribute('style', `
        position: absolute;
        top: 9.5vh;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-bottom: 1vh;
        z-index: 1001;
        background: #fff;
        padding: 1vh;
    `);

            const neCheckboxLabel = document.createElement('label');
            neCheckboxLabel.setAttribute('style', `
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding: 3px;
    `);

            const neCheckbox = document.createElement('input');
            neCheckbox.setAttribute('type', 'checkbox');
            neCheckbox.setAttribute('id', 'ne-directory-checkbox');
            neCheckbox.setAttribute('style', 'margin-right: 10px;');
            neCheckbox.checked = true;

            const neLabelText = document.createElement('span');
            neLabelText.textContent = 'NEディレクトリを表示';
            neLabelText.setAttribute('style', `
        position: relative;
        transform: translateY(-3px);
    `);

            neCheckboxLabel.appendChild(neCheckbox);
            neCheckboxLabel.appendChild(neLabelText);

            const yahooCheckboxLabel = document.createElement('label');
            yahooCheckboxLabel.setAttribute('style', `
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding: 3px;
    `);

            const yahooCheckbox = document.createElement('input');
            yahooCheckbox.setAttribute('type', 'checkbox');
            yahooCheckbox.setAttribute('id', 'yahoo-directory-checkbox');
            yahooCheckbox.setAttribute('style', 'margin-right: 10px;');
            yahooCheckbox.checked = true;

            const yahooLabelText = document.createElement('span');
            yahooLabelText.textContent = 'Yahooディレクトリを表示';
            yahooLabelText.setAttribute('style', `
        position: relative;
        transform: translateY(-3px);
    `);

            yahooCheckboxLabel.appendChild(yahooCheckbox);
            yahooCheckboxLabel.appendChild(yahooLabelText);

            filterContainer.appendChild(neCheckboxLabel);
            filterContainer.appendChild(yahooCheckboxLabel);

            neCheckbox.addEventListener('change', () => {
                const searchQuery = document.getElementById('search-input').value;
                updateSearchResults(searchQuery);
            });

            yahooCheckbox.addEventListener('change', () => {
                const searchQuery = document.getElementById('search-input').value;
                updateSearchResults(searchQuery);
            });

            const searchResults = document.createElement('div');
            searchResults.setAttribute('style', `
        position: relative;
        max-height: 66vh;
        font-size: 14px;
        top: -1.2vh;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        overflow-y: auto;
        z-index: 1000;
    `);

            searchWindow.appendChild(closeButton);
            searchWindow.appendChild(searchInput);
            searchWindow.appendChild(filterContainer);
            searchWindow.appendChild(idDisplay);
            searchWindow.appendChild(searchResults);
            document.body.appendChild(searchWindow);

            const applyFilters = () => {
                const neResults = searchResults.querySelectorAll('.NE-result');
                const yahooResults = searchResults.querySelectorAll('.Yahoo-result');
                const neChecked = neCheckbox.checked;
                const yahooChecked = yahooCheckbox.checked;

                let neVisible = false;
                let yahooVisible = false;

                neResults.forEach(result => {
                    if (neChecked) {
                        result.style.display = 'block';
                        neVisible = true;
                    } else {
                        result.style.display = 'none';
                    }
                });

                yahooResults.forEach(result => {
                    if (yahooChecked) {
                        result.style.display = 'block';
                        yahooVisible = true;
                    } else {
                        result.style.display = 'none';
                    }
                });

                const neTitle = searchResults.querySelector('.NE-title');
                if (neTitle) {
                    neTitle.style.display = neVisible ? 'block' : 'none';
                }

                const yahooTitle = searchResults.querySelector('.Yahoo-title');
                if (yahooTitle) {
                    yahooTitle.style.display = yahooVisible ? 'block' : 'none';
                }
            };

            neCheckbox.addEventListener('change', applyFilters);
            yahooCheckbox.addEventListener('change', applyFilters);

            searchResults.addEventListener('click', (event) => {
                if (event.target.classList.contains('paste-button-directory')) {
                    const value = event.target.getAttribute('data-value');
                    const directoryType = event.target.getAttribute('data-directory');

                    let inputSelector = '';

                    if (directoryType === 'yahoo') {
                        inputSelector = 'input[name="data[TbMainproduct][YAHOOディレクトリID]"]';
                    } else if (directoryType === 'ne') {
                        inputSelector = 'input[name="data[TbMainproduct][NEディレクトリID]"]';
                    }

                    const input = document.querySelector(inputSelector);
                    if (input) {
                        input.value = value;

                        let message = event.target.nextElementSibling;
                        if (!message || !message.classList.contains('paste-message')) {
                            message = document.createElement('span');
                            message.className = 'paste-message';
                            message.setAttribute('style', `
                        margin-left: 10px;
                        color: green;
                        font-size: 14px;
                        display: inline-block;
                    `);
                            event.target.parentNode.insertBefore(message, event.target.nextSibling);
                        }
                        updateIdDisplay();
                        message.textContent = 'ペーストが完了しました！'

                        setTimeout(() => {
                            message.textContent = '';
                        }, 1700);
                    }
                }
            });

            return {
                searchWindow,
                searchInput,
                searchResults,
                applyFilters,
                lastUpdatedElement,
                updateIdDisplay,
                addInputListenersNeYahoo
            };
        };

        const { searchWindow, searchInput, searchResults, applyFilters, lastUpdatedElement, updateIdDisplay, addInputListenersNeYahoo } = createSearchWindow();

        const fetchDataAndUpdateUI = async () => {
            const db = await openIndexedDB();
            const directoryData = await getDataFromIndexedDB(db);

            const tooltip = document.createElement('div');
            tooltip.setAttribute('style', `
        position: absolute;
        background: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        display: none;
        z-index: 10002;
    `);

            const lastUpdated = directoryData && directoryData.lastUpdated
            ? new Date(directoryData.lastUpdated).toLocaleString("ja-JP", {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'データなし';

            tooltip.textContent = `ディレクトリ最終更新日時: ${lastUpdated}`;

            document.body.appendChild(tooltip);

            lastUpdatedElement.textContent = '？';
            lastUpdatedElement.style.fontSize = "12px";
            lastUpdatedElement.style.cursor = "pointer";
            lastUpdatedElement.style.display = 'inline-block';
            lastUpdatedElement.style.width = 'auto';
            lastUpdatedElement.style.height = 'auto';
            lastUpdatedElement.style.padding = '0';

            lastUpdatedElement.addEventListener('click', (event) => {
                const rect = lastUpdatedElement.getBoundingClientRect();
                tooltip.style.top = `${rect.bottom + window.scrollY}px`;
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.display = 'block';
            });

            document.addEventListener('click', (event) => {
                if (!lastUpdatedElement.contains(event.target) && !tooltip.contains(event.target)) {
                    tooltip.style.display = 'none';
                }
            });
        };

        const openSearchWindow = async () => {
            searchWindow.style.display = 'block';
            await fetchDataAndUpdateUI();
            await updateIdDisplay();
            addInputListenersNeYahoo();
        };

        const closeSearchWindow = () => {
            searchWindow.style.display = 'none';
        };

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeSearchWindow();
            }
        });

        const performSearch = async (queries, directoryData) => {
            const results = [];
            const lowercaseQueries = queries.map(query => query.toLowerCase().trim());

            for (const [key, descriptions] of Object.entries(directoryData)) {
                descriptions.forEach(description => {
                    if (lowercaseQueries.every(query => description.toLowerCase().includes(query))) {
                        results.push({ key, description: description.trim() });
                    }
                });
            }

            return results;
        };

        const updateSearchResults = async (query) => {
            try {
                const db = await openIndexedDB();
                const directoryData = await getDataFromIndexedDB(db);

                searchResults.innerHTML = '';

                if (directoryData && directoryData.data) {
                    const yahooDirectory = directoryData.data.YahooDirectory || {};
                    const neDirectory = directoryData.data.NEDirectory || {};

                    const queries = query.split(/\s+/).map(q => q.trim()).filter(q => q.length > 0);
                    const excludeQueries = queries.filter(q => q.startsWith('-') && q.length > 1).map(q => q.substring(1));
                    const includeQueries = queries.filter(q => !q.startsWith('-'));

                    const yahooResults = await performSearch(includeQueries, yahooDirectory);
                    const neResults = await performSearch(includeQueries, neDirectory);

                    let isFilteringFullData = false;

                    const filteredYahooResults = yahooResults.filter(result =>
                                                                     !excludeQueries.some(exclude => result.description.includes(exclude))
                                                                    );
                    const filteredNeResults = neResults.filter(result =>
                                                               !excludeQueries.some(exclude => result.description.includes(exclude))
                                                              );

                    let totalResults = 0;

                    const neCheckbox = document.querySelector('#ne-directory-checkbox');
                    const yahooCheckbox = document.querySelector('#yahoo-directory-checkbox');

                    const createClickablePath = (description, isYahooFiltering, highlightPartIndex = null) => {
                        const pathParts = description.split(' > ');

                        const displayPathParts = isYahooFiltering ? pathParts.slice(1) : pathParts;

                        return displayPathParts.map((part, index) => `
        <span class="path-part" data-part="${part}" data-index="${index}" data-description="${description}"
              style="cursor: pointer; ${highlightPartIndex !== null && index <= highlightPartIndex ? 'color: #007bff; font-weight: bold;' : ''}"
              title="ダブルクリックで絞り込み">
            ${part}
        </span>
        ${index < displayPathParts.length - 1 ? ' > ' : ''}
    `).join('');
                    };

                    const addPathClickHandlers = () => {
                        const pathParts = searchResults.querySelectorAll('.path-part');
                        pathParts.forEach(part => {
                            part.addEventListener('dblclick', (event) => {
                                const clickedPart = event.target.getAttribute('data-part');
                                const fullDescription = event.target.getAttribute('data-description');
                                const directory = event.target.closest('.search-result').classList.contains('NE-result') ? 'ne' : 'yahoo';
                                let partIndex = parseInt(event.target.getAttribute('data-index'));

                                if (directory === 'yahoo' && !isFilterActive) {
                                    partIndex -= 1;
                                }

                                filterResultsByPart(clickedPart, fullDescription, partIndex, directory);
                            });
                        });
                    };

                    let isFilterActive = false;

                    const addClearFilterButton = (parentElement, query) => {
                        const clearFilterButton = document.createElement('button');
                        clearFilterButton.innerText = '解除';
                        clearFilterButton.classList.add('clear-filter-button');
                        clearFilterButton.addEventListener('click', () => {
                            updateSearchResults(query);
                            isFilterActive = false;
                        });

                        clearFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                        clearFilterButton.style.border = '1px solid #007bff';
                        clearFilterButton.style.color = '#007bff';
                        clearFilterButton.style.fontSize = '0.85em';
                        clearFilterButton.style.padding = '5px 10px';
                        clearFilterButton.style.cursor = 'pointer';
                        clearFilterButton.style.marginLeft = '15px';
                        clearFilterButton.style.borderRadius = '3px';
                        clearFilterButton.style.transition = 'background-color 0.3s ease, border-color 0.3s ease';

                        clearFilterButton.addEventListener('mouseover', () => {
                            clearFilterButton.style.backgroundColor = 'rgba(230, 230, 250, 0.9)';
                            clearFilterButton.style.borderColor = '#007bff';
                        });
                        clearFilterButton.addEventListener('mouseout', () => {
                            clearFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                            clearFilterButton.style.borderColor = '#007bff';
                        });

                        parentElement.appendChild(clearFilterButton);
                        isFilterActive = true;
                    };

                    const addToggleFilterButton = (parentElement, query, part, fullDescription, partIndex, directory) => {
                        const toggleFilterButton = document.createElement('button');
                        toggleFilterButton.innerText = isFilteringFullData ? '全体から絞り込み中' : '検索結果から絞り込み中';
                        toggleFilterButton.classList.add('toggle-filter-button');

                        toggleFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                        toggleFilterButton.style.border = '1px solid #007bff';
                        toggleFilterButton.style.color = '#007bff';
                        toggleFilterButton.style.fontSize = '0.85em';
                        toggleFilterButton.style.padding = '5px 10px';
                        toggleFilterButton.style.cursor = 'pointer';
                        toggleFilterButton.style.marginLeft = '15px';
                        toggleFilterButton.style.borderRadius = '3px';
                        toggleFilterButton.style.transition = 'background-color 0.3s ease, border-color 0.3s ease';

                        toggleFilterButton.addEventListener('mouseover', () => {
                            toggleFilterButton.style.backgroundColor = 'rgba(230, 230, 250, 0.9)';
                            toggleFilterButton.style.borderColor = '#007bff';
                        });
                        toggleFilterButton.addEventListener('mouseout', () => {
                            toggleFilterButton.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                            toggleFilterButton.style.borderColor = '#007bff';
                        });

                        toggleFilterButton.addEventListener('click', () => {
                            isFilteringFullData = !isFilteringFullData;
                            toggleFilterButton.innerText = isFilteringFullData ? '全体から絞り込み中' : '検索結果から絞り込み中';
                            filterResultsByPart(part, fullDescription, partIndex, directory);
                        });

                        parentElement.appendChild(toggleFilterButton);
                    };

                    const filterResultsByPart = async (part, fullDescription, partIndex, directory) => {
                        const allResults = isFilteringFullData
                        ? (directory === 'ne' ? await performSearch([], neDirectory) : await performSearch([], yahooDirectory))
                        : (directory === 'ne' ? neResults : yahooResults);

                        const pathParts = fullDescription.split(' > ');

                        const filteredPathParts = directory === 'yahoo'
                        ? pathParts.slice(1, parseInt(partIndex) + 2)
                        : pathParts.slice(0, parseInt(partIndex) + 1);

                        const fullPathToMatch = filteredPathParts.join(' > ');

                        const matchingResults = allResults.filter(result => {
                            const resultPathParts = result.description.split(' > ');
                            const adjustedDescription = directory === 'yahoo'
                            ? resultPathParts.slice(1).join(' > ')
                            : result.description;

                            if (directory === 'yahoo') {
                                return adjustedDescription.startsWith(fullPathToMatch);
                            } else {
                                return adjustedDescription.startsWith(fullPathToMatch) &&
                                    (adjustedDescription.length === fullPathToMatch.length || adjustedDescription[fullPathToMatch.length] === ' ');
                            }
                        });

                        if (matchingResults.length > 2000) {
                            searchResults.innerHTML = '<div>検索結果が多すぎるため、表示できません。</div>';
                            const messageElement = searchResults.querySelector('div');
                            addClearFilterButton(messageElement, query);
                            return;
                        }

                        searchResults.innerHTML = `
        ${directory === 'ne' && matchingResults.length > 0 ? `
            <div class="sticky-title NE-title">
                NE ディレクトリの検索結果 (${matchingResults.length}件)
            </div>
            ${matchingResults.map(result => `
                <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                    ${createClickablePath(result.description, false, parseInt(partIndex))} (ID: ${result.key})
                    <button class="paste-button-directory" data-value="${result.key}" data-directory="ne"></button>
                </div>
            `).join('')}
        ` : ''}
${directory === 'yahoo' && matchingResults.length > 0 ? `
    <div class="sticky-title Yahoo-title">
        Yahoo ディレクトリの検索結果 (${matchingResults.length}件)
        <span class="help-icon" title="Yahooディレクトリでは、ダブルクリックで絞り込み中、比較がしやすいように一列目が非表示になります。\n一列目をダブルクリックすると、検索結果に影響を与えず、一列目のみを非表示にできます。\nこの機能でディレクトリの意味が伝わらなくなるケースがあればご報告ください。">?</span>
    </div>
    ${matchingResults.map(result => `
        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
            ${createClickablePath(result.description, true, parseInt(partIndex))} (ID: ${result.key})
            <button class="paste-button-directory" data-value="${result.key}" data-directory="yahoo"></button>
        </div>
    `).join('')}
` : ''}
`;

                        addPathClickHandlers();

                        const titleElement = document.querySelector(`.${directory === 'ne' ? 'NE-title' : 'Yahoo-title'}`);
                        if (titleElement) {
                            addToggleFilterButton(titleElement, query, part, fullDescription, partIndex, directory);
                            addClearFilterButton(titleElement, query);
                        }
                    };

                    if (filteredNeResults.length > 0 && neCheckbox && neCheckbox.checked) {
                        totalResults += filteredNeResults.length;
                    }

                    if (filteredYahooResults.length > 0 && yahooCheckbox && yahooCheckbox.checked) {
                        totalResults += filteredYahooResults.length;
                    }

                    if (totalResults === 0) {
                        searchResults.innerHTML = '<div>検索結果が見つかりませんでした。</div>';
                    } else if (totalResults > 2000) {
                        searchResults.innerHTML = '<div>検索結果が多すぎるため、表示できません。</div>';
                    } else {
                        searchResults.innerHTML = `
                ${filteredNeResults.length > 0 && neCheckbox && neCheckbox.checked ? `
                    <div class="sticky-title NE-title">NE ディレクトリの検索結果 (${filteredNeResults.length}件)</div>
                    ${filteredNeResults.map(result => `
                        <div class="search-result NE-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                            ${createClickablePath(result.description)} (ID: ${result.key})
                            <button class="paste-button-directory" data-value="${result.key}" data-directory="ne"></button>
                        </div>
                    `).join('')}` : ''}
${filteredYahooResults.length > 0 && yahooCheckbox && yahooCheckbox.checked ? `
                    <div class="sticky-title Yahoo-title">
        Yahoo ディレクトリの検索結果 (${filteredYahooResults.length}件)
        <span class="help-icon" title="Yahooディレクトリでは、ダブルクリックで絞り込み中、比較がしやすいように一列目が非表示になります。\n一列目をダブルクリックすると、検索結果に影響を与えず、一列目のみを非表示にできます。\nこの機能でディレクトリの意味が伝わらなくなるケースがあればご報告ください。">?</span>
    </div>
                    ${filteredYahooResults.map(result => `
                        <div class="search-result Yahoo-result" style="border-bottom: 0.5px solid #ddd; padding-bottom: 1px; margin-bottom: 1px;">
                            ${createClickablePath(result.description)} (ID: ${result.key})
                            <button class="paste-button-directory" data-value="${result.key}" data-directory="yahoo"></button>
                        </div>
                    `).join('')}` : ''}
`;

                        addPathClickHandlers();
                    }
                } else {
                    searchResults.innerHTML = '<div>データが正しく取得されませんでした。</div>';
                }
            } catch (error) {
                console.error('検索中にエラーが発生しました:', error);
            }
        };

        GM_addStyle(`
    .sticky-title {
        position: sticky;
        top: -10px;
        left: 0;
        width: calc(100% + 0px);
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        background: #fff;
        z-index: 1001;
        padding: 0.5em 20px;
        font-weight: normal;
        margin: 0;
        color: #993;
        font-family: 'Gill Sans', 'Lucida Grande', Helvetica, Arial, sans-serif;
        font-size: 150%;
        display: block;
        text-align: center;
    }

.sticky-title::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 10px)
    height: 100%;
    background: #fff;
    z-index: -1;
}
`);

        const inputElement = document.querySelector('input[name="data[TbMainproduct][NEディレクトリID]"]');

        const tdElement = inputElement.closest('td');

        const inputDivs = tdElement.querySelectorAll('div.input.text');

        const containerDiv = document.createElement('div');
        containerDiv.setAttribute('style', `
    position: relative;
`);

        inputDivs.forEach(inputDiv => {
            inputDiv.setAttribute('style', `
    width: calc(100% - 40px);
display: inline-block;
`);
            containerDiv.appendChild(inputDiv);
        });

        const searchButton = document.createElement('button');
        searchButton.textContent = '🔍';

        searchButton.setAttribute('style', `
   position: absolute;
top: 50%;
transform: translateY(-50%);
                      right: -2px;
                      background: rgba(255, 255, 255, 0.1);
color: #ffffff;
border: none;
border-radius: 5px;
padding: 10px;
font-size: 16px;
font-weight: bold;
text-align: center;
cursor: pointer;
z-index: 999;
transition: all 0.3s ease-in-out;
`);

        searchButton.addEventListener('mouseover', () => {
            searchButton.style.background = 'rgba(0, 123, 255, 0.3)';
            searchButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
            searchButton.style.transform = 'scale(1.05) translateY(-50%)';
        });

        searchButton.addEventListener('mouseout', () => {
            searchButton.style.background = 'rgba(255, 255, 255, 0)';
            searchButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0)';
            searchButton.style.transform = 'translateY(-50%)';
        });

        searchButton.addEventListener('mousedown', () => {
            searchButton.style.background = 'rgba(0, 123, 255, 0.5)';
            searchButton.style.transform = 'scale(0.95) translateY(-50%)';
        });

        searchButton.addEventListener('mouseup', () => {
            searchButton.style.background = 'rgba(0, 123, 255, 0.3)';
            searchButton.style.transform = 'scale(1.05) translateY(-50%)';
        });

        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openSearchWindow();
            updateIdDisplay();
        });

        containerDiv.appendChild(searchButton);

        tdElement.innerHTML = '';
        tdElement.appendChild(containerDiv);
    }

    function setupShipping() {

        const DB_NAME = 'ShippingDB';
        const STORE_NAME = 'ShippingSettings';
        let db;

        function initialize() {
            const shippingSelect = document.getElementById("TbMainproduct送料設定");
            const weightInput = document.getElementById("TbMainproductWeight");
            const saveButton = document.getElementById("saveAndSkuStock");

            if (shippingSelect) {
                customizeDropDown(shippingSelect);
            }

            if (weightInput && saveButton) {
                initializeMainEditPage(shippingSelect, weightInput, saveButton);
            }
        }

        function initializeMainEditPage(shippingSelect, weightInput, saveButton) {
            const productId = window.location.pathname.split('/').pop();

            const emptyOption = document.createElement('option');
            emptyOption.value = "";
            emptyOption.text = "送料を選択";
            shippingSelect.insertBefore(emptyOption, shippingSelect.firstChild);
            shippingSelect.value = "";

            managePlaceholder(weightInput, '重量を入力');

            function changeButtonStyle() {
                if (shippingSelect.value === "") {
                    saveButton.disabled = true;
                    saveButton.style.cursor = 'not-allowed';
                    saveButton.value = "送料を選択してください";
                } else {
                    saveButton.disabled = false;
                    saveButton.style.cursor = '';
                    saveButton.value = "保存してSKU在庫の設定";
                }
            }

            function loadSavedShipping() {
                getShippingSetting(productId).then(savedShipping => {
                    if (savedShipping) {
                        shippingSelect.value = savedShipping;
                    }

                    changeButtonStyle();

                    if (shippingSelect.value === "") {
                        setTimeout(loadSavedShipping, 200);
                    }
                });
            }

            loadSavedShipping();

            shippingSelect.addEventListener('change', function () {
                changeButtonStyle();
                saveShippingSetting(productId, shippingSelect.value);
            });
        }

        function managePlaceholder(inputElement, placeholder) {
            if (!inputElement) return;

            inputElement.placeholder = placeholder;

            if (inputElement.value === '0') {
                inputElement.value = '';
            }

            inputElement.addEventListener('blur', function () {
                let value = inputElement.value.trim();

                if (value.endsWith('kg')) {
                    value = value.slice(0, -2).trim();
                    let numberValue = parseFloat(value) * 1000;
                    numberValue = Math.ceil(numberValue);
                    inputElement.value = numberValue.toString();
                } else if (value.endsWith('g')) {
                    value = value.slice(0, -1).trim();
                    inputElement.value = value;
                } else {
                    const evaluatedValue = evaluateExpression(value);
                    if (!isNaN(evaluatedValue)) {
                        inputElement.value = evaluatedValue.toString();
                    }
                }
            });
        }

        function evaluateExpression(expr) {
            let result = NaN;

            if (expr.trim() === '') {
                return result;
            }

            expr = expr.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
            expr = expr.replace(/＋/g, '+')
                .replace(/－/g, '-')
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/．/g, '.');

            if (!/^[\d+\-*/().]+$/.test(expr)) {
                return result;
            }

            try {
                const maxDecimalPlaces = (expr.match(/\.\d+/g) || []).reduce((max, num) => {
                    return Math.max(max, num.length - 1);
                }, 0);

                const scalingFactor = Math.pow(10, maxDecimalPlaces);
                const scaledExpr = `(${expr}) * ${scalingFactor}`;
                result = new Function('return ' + scaledExpr)() / scalingFactor;

                result = Math.ceil(result * 100) / 100;

            } catch (error) {
                console.error('無効な式です:', error);
            }
            return result;
        }

        function openDatabase() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, 1);

                request.onupgradeneeded = function (event) {
                    db = event.target.result;
                    db.createObjectStore(STORE_NAME, { keyPath: 'productId' });
                };

                request.onsuccess = function (event) {
                    db = event.target.result;
                    resolve(db);
                };

                request.onerror = function (event) {
                    reject('Database error: ' + event.target.errorCode);
                };
            });
        }

        function saveShippingSetting(productId, shippingValue) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ productId: productId, shippingValue: shippingValue });

                request.onsuccess = function () {
                    resolve();
                };

                request.onerror = function (event) {
                    reject('Save error: ' + event.target.errorCode);
                };
            });
        }

        function getShippingSetting(productId) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(productId);

                request.onsuccess = function (event) {
                    resolve(event.target.result ? event.target.result.shippingValue : null);
                };

                request.onerror = function (event) {
                    reject('Fetch error: ' + event.target.errorCode);
                };
            });
        }

        function customizeDropDown(shippingSelect) {
            const order = [
                "24", "25", "26", "5", "27", "4", "29", "10",
                "11", "12", "13", "22", "14", "15", "16", "17",
                "18", "19", "20", "21", "23", "8", "28", "9"
            ];
            const unusedOptions = ["23", "8", "28", "9"];
            const tooltips = {
                "24": "12cm×23.5cm以内、厚さ1cm以内\n重さ50g以内",
                "25": "3辺の合計が60cm以内、1辺の最長は34cm以内、厚さ2cm以内\n重さ1kg以内",
                "26": "34×25cm以内、厚さ3cm以内\n重さ50g以内",
                "5": "3辺の合計が60cm以内、1辺の最長は34cm以内、厚さ3cm以内\n重さ1kg以内",
                "27": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ50g以内",
                "4": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ100g以内",
                "29": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ150g以内",
                "10": "3辺の合計が90cm以内、1辺の最長は60cm以内\n重さ250g以内",
                "11": "3辺の合計が60cm以内\n重さ20kg以内",
                "12": "3辺の合計が80cm以内\n重さ20kg以内",
                "13": "3辺の合計が100cm以内\n重さ20kg以内",
                "22": "3辺の合計が120cm以内\n重さ20kg以内",
                "14": "3辺の合計が140cm以内\n重さ20kg以内",
                "15": "3辺の合計が160cm以内\n重さ20kg以内",
                "16": "3辺の合計が170cm以内\n重さ20kg以内",
                "17": "3辺の合計が180cm以内\n重さ20kg以内",
                "18": "3辺の合計が200cm以内\n重さ20kg以内",
                "19": "3辺の合計が220cm以内\n重さ20kg以内",
                "20": "3辺の合計が240cm以内\n重さ20kg以内",
                "21": "3辺の合計が260cm以内\n重さ20kg以内"
            };

            const options = Array.from(shippingSelect.options);
            const orderedOptions = order.map(value => options.find(option => option.value === value)).filter(Boolean);

            shippingSelect.innerHTML = '';
            for (let option of orderedOptions) {
                shippingSelect.add(option);
            }

            for (let option of shippingSelect.options) {
                if (tooltips[option.value]) {
                    option.title = tooltips[option.value];
                }

                if (unusedOptions.includes(option.value)) {
                    option.style.color = "#8B0000";
                    option.title = `${tooltips[option.value] || ""} 現在使われていません`.trim();
                }
            }
        }

        window.addEventListener('load', function () {
            openDatabase().then(() => {
                initialize();
            }).catch(error => {
                console.error(error);
            });
        });
    }

    function enhanceRemarksEditor(){

        const helpLinkHTML = `
        (=> <a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E5%82%99%E8%80%83%E6%AC%84%E3%83%98%E3%83%AB%E3%83%97" target="_blank">ヘルプ</a> )
    `;

        const MAX_LENGTH = 255;

        const style = document.createElement('style');
        style.textContent = `
        .cursor-warning {
            color: red;
        }
        .space-settings-button {
            position: absolute;
            font-size: 12px;
            top: -12px;
            right: -10px;
            background: transparent;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 5px;
            cursor: pointer;
        }
        .space-settings-popup {
            position: absolute;
            top: 50px;
            right: 10px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 1000;
            display: none;
        }
        .space-settings-popup label {
            display: block;
        }
    `;
        document.head.appendChild(style);

        window.addEventListener('load', function() {
            const remarksHeader = [...document.querySelectorAll('th[scope="row"]')].find(th => th.textContent.includes("備考"));

            if (remarksHeader) {
                const helpLinkSpan = document.createElement('span');
                helpLinkSpan.innerHTML = helpLinkHTML;
                remarksHeader.appendChild(helpLinkSpan);
            }

            const inputField = document.getElementById('TbMainproduct備考');
            if (!inputField) return;

            const wrapperDiv = document.createElement('div');
            wrapperDiv.style.position = 'relative';
            inputField.parentNode.insertBefore(wrapperDiv, inputField);
            wrapperDiv.appendChild(inputField);
            inputField.style.width = 'calc(100% - 60px)';

            const popupStyle = `
            position: absolute;
            background-color: white;
            border: 2px solid #ccc;
            border-radius: 5px;
            padding: 4px 10px;
            z-index: 1000;
            display: none;
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-sizing: border-box;
            width: calc(100% - 60px);
        `;

            const popup = document.createElement('div');
            popup.className = 'remarks-popup';
            popup.style.cssText = popupStyle;
            popup.contentEditable = true;
            wrapperDiv.appendChild(popup);

            const cursorPosition = createCursorPosition();
            wrapperDiv.appendChild(cursorPosition);

            const settingsButton = document.createElement('button');
            settingsButton.className = 'space-settings-button';
            settingsButton.textContent = '⚙️';
            wrapperDiv.appendChild(settingsButton);

            const settingsPopup = document.createElement('div');
            settingsPopup.className = 'space-settings-popup';
            settingsPopup.innerHTML = `
            <label title="チェックを入れると、入力欄の半角スペースをポップアップ内で改行として表示します。">
            <input type="checkbox" id="spaceAsNewlineToggle">
            半角スペースを改行として表示
            </label>
        `;
            wrapperDiv.appendChild(settingsPopup);

            const spaceAsNewlineToggle = document.getElementById('spaceAsNewlineToggle');
            let spaceAsNewline = localStorage.getItem('spaceAsNewline') === 'true';
            spaceAsNewlineToggle.checked = spaceAsNewline;

            settingsButton.addEventListener('click', (event) => {
                event.preventDefault();
                settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
            });

            spaceAsNewlineToggle.addEventListener('change', () => {
                spaceAsNewline = spaceAsNewlineToggle.checked;
                localStorage.setItem('spaceAsNewline', spaceAsNewline);
                updatePopup();
            });

            function updatePopup() {
                if (inputField === document.activeElement && inputField.value.trim() !== '') {
                    popup.textContent = spaceAsNewline
                        ? inputField.value.replace(/ /g, '\n')
                    : inputField.value;
                    popup.style.display = 'block';
                } else {
                    popup.style.display = 'none';
                }
            }

            function updateCursorPosition(focused, customPosition = null) {
                let position;
                let totalLength;

                if (focused && inputField === document.activeElement) {
                    position = inputField.selectionStart;
                    totalLength = inputField.value.length;
                } else if (focused && popup === document.activeElement) {
                    const selection = window.getSelection();
                    position = customPosition !== null ? customPosition : selection.anchorOffset;
                    totalLength = popup.textContent.length;
                } else {
                    position = 0;
                    totalLength = inputField.value.length;
                }

                cursorPosition.textContent = focused ? `${position}/${totalLength}` : `${totalLength}`;

                if (totalLength > MAX_LENGTH) {
                    cursorPosition.classList.add('cursor-warning');
                } else {
                    cursorPosition.classList.remove('cursor-warning');
                }
            }

            updateCursorPosition(false);

            function createCursorPosition() {
                const span = document.createElement('span');
                span.style.marginLeft = '3px';
                span.style.fontSize = '11px';
                span.style.verticalAlign = 'middle';
                return span;
            }

            function validatePopupInput() {
                let currentText = popup.textContent;
                currentText = currentText.replace(/\n/g, ' ');
                if (currentText.length > MAX_LENGTH) {
                    currentText = currentText.substring(0, MAX_LENGTH);
                    popup.textContent = currentText;
                    inputField.value = currentText;
                }
            }

            let isComposing = false;

            popup.addEventListener('compositionstart', function() {
                isComposing = true;
            });

            popup.addEventListener('compositionupdate', function(event) {
                const updatedText = popup.textContent.replace(/\n/g, ' ');
                inputField.value = updatedText;

                setTimeout(() => {
                    updateCursorPosition(true);
                }, 0);
            });

            popup.addEventListener('compositionend', function(event) {
                isComposing = false;

                const updatedText = popup.textContent.replace(/\n/g, ' ');
                inputField.value = updatedText;

                setTimeout(() => {
                    updateCursorPosition(true);
                }, 0);
            });


            inputField.addEventListener('blur', function() {
                updateCursorPosition(false);
            });

            inputField.addEventListener('keyup', function() {
                updateCursorPosition(true);
            });

            inputField.addEventListener('click', function() {
                updateCursorPosition(true);
            });

            inputField.addEventListener('focus', updatePopup);

            inputField.addEventListener('input', function() {
                updatePopup();
                updateCursorPosition(true);
            });

            let shouldRedraw = false;

            popup.addEventListener('mouseup', () => {
                updateCursorPosition(true);
            });

            popup.addEventListener('focus', function() {
                updateCursorPosition(true);
            });

            popup.addEventListener('blur', function() {
                if (popup.textContent.length > MAX_LENGTH) {
                    alert(`入力可能な文字数を超えています。256字以降は切り捨てられます。`);
                }

                const updatedText = popup.textContent.replace(/\n/g, ' ');
                popup.textContent = updatedText;
                inputField.value = updatedText;
                validatePopupInput();
                updateCursorPosition(false);
            });

            popup.addEventListener('keydown', function (event) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorOffset = range.startOffset;
                const isPopupActive = document.activeElement === popup;
                const targetElement = isPopupActive ? popup : inputField;
                const isLastCharacter = cursorOffset === targetElement.textContent.length;

                if (event.key === 'Enter') {
                    let beforeCursor = targetElement.textContent.slice(0, cursorOffset);
                    let afterCursor = targetElement.textContent.slice(cursorOffset);

                    if (isLastCharacter && !targetElement.textContent.endsWith('\n')) {
                        if (isPopupActive) {
                            targetElement.textContent = beforeCursor + '\n\n' + afterCursor;
                        } else {
                            targetElement.value = beforeCursor + '  ' + afterCursor;
                        }
                    } else {
                        if (isPopupActive) {
                            targetElement.textContent = beforeCursor + '\n' + afterCursor;
                        } else {
                            targetElement.value = beforeCursor + ' ' + afterCursor;
                        }
                    }

                    const newRange = document.createRange();
                    const firstChild = targetElement.firstChild;

                    if (firstChild && firstChild.nodeType === 3) {
                        const newCursorPosition = beforeCursor.length + (isPopupActive ? 1 : 0);
                        newRange.setStart(firstChild, newCursorPosition);
                        newRange.collapse(true);

                        selection.removeAllRanges();
                        selection.addRange(newRange);

                        setTimeout(() => updateCursorPosition(isPopupActive, newCursorPosition), 0);
                    }

                    event.preventDefault();
                } else {
                    setTimeout(() => updateCursorPosition(isPopupActive), 0);
                }
            });

            popup.addEventListener('input', () => {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const startOffset = range.startOffset;
                const startNode = range.startContainer;

                const text = popup.textContent;

                const updatedText = text.replace(/\n/g, ' ');
                inputField.value = updatedText;

                updateCursorPosition(true);

                const newRange = document.createRange();
                newRange.setStart(startNode, Math.min(startOffset, text.length));
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            });

            popup.addEventListener('click', function() {
                updateCursorPosition(true);
            });

            document.addEventListener('click', event => {
                if (window.getSelection().type === "Range") {
                    return;
                }

                if (!popup.contains(event.target) && !inputField.contains(event.target)) {
                    popup.style.display = 'none';
                    inputField.blur();
                }
            });
        });
    }

    function presetTextHelper(){

        GM_addStyle(`
.template-list {
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 5px 10px;
    z-index: 10000;
    position: absolute;
    top: 117px;
    left: -8px;
    width: 480px;
    max-height: 350px;
    overflow: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: none;
}

.template-list div {
    word-break: break-word;
}

.template-div {
    padding-top: 300px;
    padding: 3px 0;
    border-top: 1px solid #ddd;
}

.template-div:first-child {
    border-top: none;
}

.short-text-div {
        flex-grow: 1;
        cursor: pointer;
}

    .template-content {
        height: 0;
        opacity: 0;
        overflow: hidden;
        transition: height 0.3s ease, opacity 0.3s ease;
        font-size: 12px;
        padding-left: 10px;
        color: #333;
    }

    .template-content.show {
        height: auto;
        opacity: 1;
        padding: 5px 0;
    }


.short-text-div, .paste-button-template {
    display: inline-block;

}

.paste-button-template {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 5px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 5px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: relative;
    vertical-align: middle;
    transform: scale(0.95);
    text-align: center;
}

.paste-button-template::before {
    content: '📑';
    font-size: 14px;
    display: block;
    position: relative;
    top: -1px;
    left: 1px;
}

.paste-button-template::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 34px;
    height: 34px;
    z-index: 0;
}

.paste-button-template:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.paste-button-template:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.template-button {
    background-color: transparent;
    color: #333;
    border: 1px solid #ccc;
    padding: 4px 10px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: auto;
    width: auto;
    position: absolute;
    bottom: 0;
    left: -170px;
    margin: 0;
}

.template-button::before {
    content: '';
}

.template-button::after {
    content: attr(data-text);
    display: block;
    font-weight: bold;
}

.template-button:hover {
    background-color: #f0f0f0;
    color: #000;
    border-color: #bbb;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.template-button:active {
    background-color: #e0e0e0;
    color: #000;
    border-color: #aaa;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

#content {
    overflow: visible;
}

`);

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const templateListDivs = document.querySelectorAll('.template-list');
                templateListDivs.forEach(function(templateListDiv) {
                    if (templateListDiv.style.display === 'block') {
                        templateListDiv.style.display = 'none';
                    }
                });
            }
        });

        document.addEventListener('click', function(event) {
            const templateListDivs = document.querySelectorAll('.template-list');
            templateListDivs.forEach(function(templateListDiv) {
                if (templateListDiv.style.display === 'block' && !templateListDiv.contains(event.target)) {
                    templateListDiv.style.display = 'none';
                }
            });
        });

        function addTemplateButton(targetTextareaId, templates) {

            const targetTextarea = document.getElementById(targetTextareaId);
            if (!targetTextarea) {
                return;
            }

            const container = targetTextarea.parentElement;
            if (!container) {
                return;
            }

            container.style.position = 'relative';

            if (container.querySelector(`button[data-target="${targetTextareaId}"]`)) {
                return;
            }

            const templateButton = document.createElement('button');
            templateButton.textContent = '定型文一覧を表示';
            templateButton.dataset.target = targetTextareaId;
            templateButton.className = 'template-button';

            const templateListDiv = document.createElement('div');
            templateListDiv.className = 'template-list';
            templateListDiv.dataset.target = targetTextareaId;

            templates.forEach(template => {
                const templateDiv = document.createElement('div');
                templateDiv.className = 'template-div';

                const shortTextDiv = document.createElement('div');
                shortTextDiv.className = 'short-text-div';
                shortTextDiv.textContent = template.shortText;

                const templateContentDiv = document.createElement('div');
                templateContentDiv.className = 'template-content';
                templateContentDiv.textContent = template.fullText;
                templateContentDiv.style.whiteSpace = 'pre-wrap';

                shortTextDiv.addEventListener('click', function() {
                    const isVisible = templateContentDiv.classList.contains('show');
                    if (isVisible) {
                        templateContentDiv.classList.remove('show');
                    } else {
                        templateContentDiv.classList.add('show');
                    }
                });

                const pasteButton = document.createElement('button');
                pasteButton.className = 'paste-button-template';

                pasteButton.addEventListener('click', function(event) {
                    event.stopPropagation();
                    event.preventDefault();

                    const existingText = targetTextarea.value;
                    if (existingText) {
                        targetTextarea.value += '\n' + template.fullText;
                    } else {
                        targetTextarea.value += template.fullText;
                    }

                    templateListDiv.style.display = 'none';
                });

                templateDiv.appendChild(shortTextDiv);
                templateDiv.appendChild(pasteButton);

                templateListDiv.appendChild(templateDiv);
                templateListDiv.appendChild(templateContentDiv);
            });

            function adjustScrollPosition(templateListDiv) {
                const rect = templateListDiv.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                if (rect.top < 0) {
                    window.scrollBy(0, rect.top);
                }

                if (rect.bottom > viewportHeight) {
                    window.scrollBy(0, rect.bottom - viewportHeight);
                }
            }

            templateButton.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();

                const isVisible = templateListDiv.style.display === 'block';
                templateListDiv.style.display = isVisible ? 'none' : 'block';

                if (!isVisible) {
                    adjustScrollPosition(templateListDiv);
                }

            });

            container.appendChild(templateButton);
            container.appendChild(templateListDiv);
        }

        function adjustTemplateListSize() {
            const templateListDiv = document.querySelector('.template-list');
            const maxWidth = 480;

            const templateDivs = templateListDiv.querySelectorAll('div');
            let maxWidthNeeded = maxWidth;

            templateDivs.forEach(div => {
                const divWidth = div.offsetWidth;
                if (divWidth > maxWidthNeeded) {
                    maxWidthNeeded = divWidth;
                }
            });

            templateListDiv.style.width = `${Math.min(maxWidthNeeded, maxWidth)}px`;
        }

        window.addEventListener('load', (event) => {
            const sizeTemplates = [
                { shortText: '【サイズ表提示】', fullText: '画像をご参照ください。' },
                { shortText: '【メンズインナー】', fullText: '商品のタグ表記や在庫表は海外サイズとなっておりますが、\n在庫表の【】内が一般的な日本サイズでございます。' },
                { shortText: '【カップが共通のブラジャー】', fullText: 'カップサイズは〜まで共通です。\nアンダーバストのサイズでお選びください。\n各カップサイズは選択できませんのでご注意ください。' }
            ];

            const colorTemplates = [
                { shortText: '【カラーが選べない場合】', fullText: '※カラーはランダムとなります。色の指定はできませんのでご注意ください。\n　セット商品や複数ご注文いただいた場合でも、全て同じ色の場合もございます。' }
            ];

            const supplementTemplates = [
                { shortText: '【ニット、レース製品、下着、ブラ等】', fullText: '※商品の性質上、手洗いでのお洗濯をお勧めしております。' },
                { shortText: '【色落ちについて】', fullText: '※色落ちする場合がございます。\n　手洗い後、ご着用くださいますようお願い致します。' },
                { shortText: '【タイツ・ストッキング】', fullText: '※稀に織傷がある場合がございます。' },
                { shortText: '【肌に直接貼るアイテム】', fullText: '※肌の弱い方はご使用をお控えください。' },
                { shortText: '【組み立て式／①絶対組み立てる必要があるとき】', fullText: '※ご自身で組み立てる必要がございます※' },
                { shortText: '【組み立て式／②もしかしたら組み立て式かもしれない時】', fullText: '※ご自身での組み立てが必要になる場合もございます※' },
                { shortText: '【透明なプラスチック製品について】', fullText: '傷防止のため、ビニールコーティングしている場合がございますので、\n剥がしてからご使用お願いいたします。' },
                { shortText: '【大型商品】', fullText: '【北海道、沖縄、離島地域にお届けの際は、別途送料が必要になりますので、\n　ご注文前にお問い合わせお願いいたします】' },
                { shortText: '【IQOS製品のアクセサリー】', fullText: '※IQOS本体は付属いたしません。\n※IQOSはフィリップモリスプロダクツS.A.が所有する商標です。\n　本製品は、IQOS純正部品ではありません。\n　純正部品に該当しないアクセサリーは、フィリップモリスプロダクツS.A.の推奨、\n　精査又は支持を一切受けておらず、当該製品に関する一切の責任は、\n　当該製品の販売業者、流通業者、製造業者にあります。\n※無許諾の電子アクセサリーを使用すると、\n　純正IQOSブランド製品の保証が無効になることがあります。' },
                { shortText: '【電池使用商品／簡単に電池を外せる場合】', fullText: '※電池は付属しておりません。' },
                { shortText: '【電池使用商品／簡単に電池を外せない場合】', fullText: '※テスト用電池が入っております。' },
                { shortText: '【殻付き卵の保管用商品】', fullText: '※こちらの製品は、殻付き卵の保管目的でご使用ください。' },
                { shortText: '【対象年齢について／12歳以上】', fullText: '※対象年齢：12歳以上' },
                { shortText: '【対象年齢について／6歳以上】', fullText: '※対象年齢：6歳以上' },
                { shortText: '【火傷しそうな商品について】', fullText: '完全断熱素材ではありませんので、ご使用の際は火傷にご注意ください。' }
            ];

            addTemplateButton('TbMainproductサイズについて', sizeTemplates);
            addTemplateButton('TbMainproductカラーについて', colorTemplates);
            addTemplateButton('TbMainproduct補足説明PC', supplementTemplates);

            adjustTemplateListSize();
        });
    }

    function autoInsertColor(){

        const targetTextAreaId = 'TbMainproductカラーについて';
        const inputText = `生産ロットにより柄の出方や色の濃淡が異なる場合がございます。
お使いのモニターや撮影時の光の加減などにより
画像と実際の商品のカラーが異なる場合もございます。
予告なしにカラーやデザインなどの変更がある場合もございます。`;

        function setTextIfEmpty() {
            const textArea = document.getElementById(targetTextAreaId);
            if (textArea) {
                if (textArea.value.trim() === '') {
                    textArea.value = inputText;
                }
            } else {

            }
        }

        setTimeout(setTextIfEmpty, 1000);

        let skipDialog = false;

        window.addEventListener('load', () => {
            const inputs = document.querySelectorAll('input[type="text"]:not(#daihyo_syohin_code):not(#TbMainproductWeight), input[type="checkbox"]');
            const selects = document.querySelectorAll('select:not(#TbMainproduct送料設定)');
            const textareas = document.querySelectorAll('textarea:not([data-index="0"]):not([data-index="1"]):not([data-index="2"]):not([data-index="3"]):not(#TbMainproductカラーについて)');


            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.dataset.initialValue = input.checked;
                } else {
                    input.dataset.initialValue = input.value;
                }
            });

            selects.forEach(select => {
                select.dataset.initialValue = select.value;
            });

            textareas.forEach(textarea => {
                textarea.dataset.initialValue = textarea.value;
            });

            const buttonIds = ['tempSaveButton', 'saveAndSkuStock', 'registeredSaveAndSkuStock', 'registeredSaveButton'];
            buttonIds.forEach(id => {
                const button = document.getElementById(id);
                if (button) {
                    button.addEventListener('click', () => {
                        skipDialog = true;
                    });
                }
            });

            window.onbeforeunload = function(event) {
                if (skipDialog) {
                    skipDialog = false;
                    return;
                }

                let hasChanges = false;

                for (let input of inputs) {
                    if (input.type === 'checkbox') {
                        if (input.checked !== (input.dataset.initialValue === 'true')) {
                            hasChanges = true;
                            break;
                        }
                    } else {
                        if (input.value !== input.dataset.initialValue) {
                            hasChanges = true;
                            break;
                        }
                    }
                }

                if (!hasChanges) {
                    for (let select of selects) {
                        if (select.value !== select.dataset.initialValue) {
                            hasChanges = true;
                            break;
                        }
                    }
                }

                if (!hasChanges) {
                    for (let textarea of textareas) {
                        if (textarea.value !== textarea.dataset.initialValue) {
                            hasChanges = true;
                            break;
                        }
                    }
                }

                if (hasChanges) {
                    event.preventDefault();
                    event.returnValue = '';
                }
            };
        });
    }

    function enhanceStockTable(){

        function countByteLength(str) {
            let length = 0;
            for (let char of str) {
                length += (char.match(/[^\x00-\xff]/)) ? 2 : 1;
            }
            return length;
        }

        function highlightInputIfExceedsMaxLength(input, maxLength) {
            if (!input) return;
            const isOverLimit = countByteLength(input.value) > maxLength;

            if (isOverLimit) {
                input.classList.add('error-maxlength');
            } else {
                input.classList.remove('error-maxlength');
            }
        }

        function attachEventListeners(input, maxLength) {
            if (!input) return;
            input.addEventListener('input', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                updateButtonState();
            });
            input.addEventListener('paste', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                updateButtonState();
            });
        }

        function highlightDuplicateCodes() {
            const stockSettingTable = document.getElementById('stockSettingTable');
            if (!stockSettingTable) return;

            const codeInputsFirstColumn = stockSettingTable.querySelectorAll('tr td:nth-child(3) input[type="text"]');
            const valuesFirstColumn = {};
            const duplicatesFirstColumn = new Set();

            const codeInputsSecondColumn = stockSettingTable.querySelectorAll('tr td:nth-child(6) input[type="text"]');
            const valuesSecondColumn = {};
            const duplicatesSecondColumn = new Set();

            codeInputsFirstColumn.forEach(input => input.classList.remove('error-duplicate'));

            codeInputsFirstColumn.forEach(input => {
                const value = input.value.trim();
                if (value) {
                    if (valuesFirstColumn[value]) {
                        duplicatesFirstColumn.add(value);
                    } else {
                        valuesFirstColumn[value] = true;
                    }
                }
            });

            codeInputsFirstColumn.forEach(input => {
                if (duplicatesFirstColumn.has(input.value.trim())) {
                    input.classList.add('error-duplicate');
                }
            });

            codeInputsSecondColumn.forEach(input => input.classList.remove('error-duplicate'));

            codeInputsSecondColumn.forEach(input => {
                const value = input.value.trim();
                if (value) {
                    if (valuesSecondColumn[value]) {
                        duplicatesSecondColumn.add(value);
                    } else {
                        valuesSecondColumn[value] = true;
                    }
                }
            });

            codeInputsSecondColumn.forEach(input => {
                if (duplicatesSecondColumn.has(input.value.trim())) {
                    input.classList.add('error-duplicate');
                }
            });
        }

        function initHighlighting() {
            const maxLength = 32;
            const verticalAxisInput = document.getElementById('TbMainproduct縦軸項目名');
            const horizontalAxisInput = document.getElementById('TbMainproduct横軸項目名');
            const inputs = document.querySelectorAll('.hontoroku tr td:nth-child(3) input[type="text"], .hontoroku tr td:nth-child(6) input[type="text"]');

            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    highlightDuplicateCodes();
                });
            });

            attachEventListeners(verticalAxisInput, maxLength);
            attachEventListeners(horizontalAxisInput, maxLength);

            highlightInputIfExceedsMaxLength(verticalAxisInput, maxLength);
            highlightInputIfExceedsMaxLength(horizontalAxisInput, maxLength);

            highlightDuplicateCodes();
        }

        const style = document.createElement('style');
        style.textContent = `
        .error-maxlength {
            border: 2px solid red !important;
        }
        .error-duplicate {
            border: 2px solid #ffa600 !important;
        }
    `;

        document.head.appendChild(style);

        function attachEventListenersForStockSettingTable(input, maxLength, columnType) {
            if (!input) return;

            const performDuplicateCheck = () => {
                if (columnType === 'first') {
                    highlightDuplicateCodes();
                } else if (columnType === 'second') {
                    highlightDuplicateCodes();
                }
            };

            input.addEventListener('input', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });

            input.addEventListener('focus', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });

            input.addEventListener('blur', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });

            input.addEventListener('change', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });

            input.addEventListener('paste', () => {
                highlightInputIfExceedsMaxLength(input, maxLength);
                performDuplicateCheck();
                updateButtonState();
            });
        }

        document.addEventListener('DOMContentLoaded', initHighlighting);


        function highlightInputsInStockSettingTable() {
            const rows = document.querySelectorAll('#stockSettingTable table.hontoroku tr');
            const maxLength = 32;

            rows.forEach((row, index) => {
                if (index > 0 && index <= 20) {
                    const secondColInput = row.querySelector('td:nth-child(2) input');
                    const fifthColInput = row.querySelector('td:nth-child(5) input');

                    attachEventListenersForStockSettingTable(secondColInput, maxLength, 'first');
                    attachEventListenersForStockSettingTable(fifthColInput, maxLength, 'second');

                    highlightInputIfExceedsMaxLength(secondColInput, maxLength);
                    highlightInputIfExceedsMaxLength(fifthColInput, maxLength);
                }
            });

        }

        const getByteLength = (str) => {
            let byteLength = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                byteLength += (charCode > 0x7F) ? 2 : 1;
            }
            return byteLength;
        };

        const highlightInput = (input, headerByteLength) => {
            const inputByteLength = getByteLength(input.value);
            const isOverLimit = (headerByteLength + inputByteLength > 19);
            input.style.border = isOverLimit ? '2px solid red' : '';
            return isOverLimit;
        };

        const highlightInputsBasedOnByteLength = (headerByteLength) => {
            const stockSettingTable = document.getElementById('stockSettingTable');
            if (!stockSettingTable) return;

            const rows = stockSettingTable.querySelectorAll('tr');
            let hasRedBorder = false;

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 6) {
                    const thirdColInput = cells[1].querySelector('input');
                    const sixthColInput = cells[4].querySelector('input');

                    if (thirdColInput) {
                        hasRedBorder = highlightInput(thirdColInput, headerByteLength) || hasRedBorder;
                    }

                    if (sixthColInput) {
                        hasRedBorder = highlightInput(sixthColInput, headerByteLength) || hasRedBorder;
                    }
                }
            });

            return hasRedBorder;
        };

        const updateButtonState = () => {
            const verticalAxisInput = document.getElementById('TbMainproduct縦軸項目名');
            const horizontalAxisInput = document.getElementById('TbMainproduct横軸項目名');
            const thirdColInputs = document.querySelectorAll('#stockSettingTable table.hontoroku tr td:nth-child(3) input');
            const sixthColInputs = document.querySelectorAll('#stockSettingTable table.hontoroku tr td:nth-child(6) input');

            const maxLength = 32;
            const headerTextElement = document.querySelector('h2');
            const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
            const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

            let hasRedBorder = false;
            let buttonMessage = '';

            const inputsToCheck1 = [verticalAxisInput, horizontalAxisInput];
            inputsToCheck1.forEach(input => {
                if (input && countByteLength(input.value) > maxLength) {
                    hasRedBorder = true;
                    buttonMessage = "項目名を全角16(半角32)文字以内にしてください";
                }
            });

            if (!hasRedBorder) {
                const inputsToCheck2 = [...thirdColInputs, ...sixthColInputs];
                inputsToCheck2.forEach(input => {
                    if (input && (headerByteLength + getByteLength(input.value) > 19)) {
                        hasRedBorder = true;
                        buttonMessage = "商品コード+SKUを20文字以内にしてください";
                    }
                });
            }

            const saveButton = document.getElementById('saveAndSkuStock');
            if (saveButton && saveButton.value !== "送料を選択してください") {
                saveButton.disabled = hasRedBorder;
                saveButton.style.cursor = hasRedBorder ? 'not-allowed' : '';
                saveButton.value = hasRedBorder ? buttonMessage : '保存してSKU在庫の設定';
            }

            const registeredSaveButton = document.getElementById('registeredSaveAndSkuStock');
            if (registeredSaveButton && registeredSaveButton.value !== "送料を選択してください") {
                registeredSaveButton.disabled = hasRedBorder;
                registeredSaveButton.style.cursor = hasRedBorder ? 'not-allowed' : '';
                registeredSaveButton.value = hasRedBorder ? buttonMessage : '保存してSKU在庫の設定';
            }
        };

        const stockSettingTable = document.getElementById('stockSettingTable');
        if (stockSettingTable) {
            stockSettingTable.addEventListener('focusout', () => {
                setTimeout(() => {
                    const headerTextElement = document.querySelector('h2');
                    const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
                    const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;
                    highlightInputsBasedOnByteLength(headerByteLength);
                    updateButtonState();
                }, 10);
            });
        }

        const observer = new MutationObserver(() => {
            initHighlighting();
            highlightInputsInStockSettingTable();
            highlightDuplicateCodes();
            const headerTextElement = document.querySelector('h2');
            const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
            const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

            highlightInputsBasedOnByteLength(headerByteLength);
            updateButtonState();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        initHighlighting();
        highlightInputsInStockSettingTable();
        const headerTextElement = document.querySelector('h2');
        const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
        const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

        highlightInputsBasedOnByteLength(headerByteLength);
        updateButtonState();

        const divs = document.querySelectorAll('div');
        for (const div of divs) {
            if (div.textContent.includes("この商品は在庫表の設定変更ができません")) {
                return;
            }
        }

        const columns = {
            many: {
                inputIndex: 1,
                codeOffset: 1
            },
            few: {
                inputIndex: 4,
                codeOffset: 1
            }
        };

        let startIndex, endIndex;

        const url = window.location.href;

        if (url.includes("/forests/TbMainproducts/mainedit/") || url.includes("/forests/tb_mainproducts/mainedit/")) {
            startIndex = 30;
            endIndex = 51;
        } else if (url.includes("/forests/TbMainproducts/registered_mainedit/") || url.includes("/forests/tb_mainproducts/registered_mainedit/")) {
            startIndex = 51;
            endIndex = 72;
        } else {
            return;
        }

        function getInputs(column) {
            return Array.from(document.querySelectorAll(`table.hontoroku tr td:nth-child(${column.inputIndex}) input[type="text"]:not([readonly])`));
        }

        function handleEnterKey(inputs) {
            return function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const currentIndex = inputs.indexOf(this);
                    const nextInput = inputs[currentIndex + 1];
                    if (nextInput) {
                        nextInput.focus();
                    }
                    const event = new Event('change', { bubbles: true });
                    inputs[currentIndex].dispatchEvent(event);
                }
            };
        }

        function handlePaste(inputs) {
            return function(e) {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData('text');
                const lines = pasteData.split('\n').filter(line => line.trim() !== '');
                let currentIndex = inputs.indexOf(this);

                if (lines.length === 0) {
                    return;
                }

                if (lines.length > 1) {
                    setTimeout(() => {
                        lines.forEach((line, i) => {
                            if (currentIndex + i < inputs.length) {
                                const currentInput = inputs[currentIndex + i];
                                currentInput.value = line;

                                currentInput.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        });

                        const lastIndex = Math.min(currentIndex + lines.length - 1, inputs.length - 1);
                        inputs[lastIndex].focus();
                    }, 0);
                } else {
                    const currentInput = inputs[currentIndex];
                    const currentText = currentInput.value;
                    const selectionStart = currentInput.selectionStart;
                    const selectionEnd = currentInput.selectionEnd;

                    const newText = currentText.substring(0, selectionStart) + lines[0] + currentText.substring(selectionEnd);
                    currentInput.value = newText;

                    const newCursorPosition = selectionStart + lines[0].length;
                    currentInput.setSelectionRange(newCursorPosition, newCursorPosition);

                    currentInput.dispatchEvent(new Event('change', { bubbles: true }));
                }

                if (lines.length === 1 && pasteData.endsWith('\n')) {
                    return;
                }
                inputs[Math.min(currentIndex + lines.length - 1, inputs.length - 1)].focus();
            };
        }

        function addEventListenersToInputs(inputs) {
            inputs.forEach(input => {
                input.addEventListener('keydown', handleEnterKey(inputs));
                input.addEventListener('paste', handlePaste(inputs));
            });
        }

        function addRowNumbers(startIndex, endIndex) {
            const tableRows = document.querySelectorAll('table.hontoroku tbody tr');
            tableRows.forEach((row, index) => {
                const th = document.createElement('th');
                th.scope = 'row';
                th.style.textAlign = 'center';
                if (index >= startIndex && index <= endIndex) {
                    if (index === startIndex) {
                        th.innerText = '';
                    } else if (index <= endIndex - 1) {
                        th.innerText = index - startIndex;
                    } else {
                        th.innerText = '';
                    }
                } else {
                    th.style.display = 'none';
                }
                row.insertAdjacentElement('afterbegin', th);
            });
        }

        function focusFirstInput() {
            const firstInput = document.querySelector('table.hontoroku tr td:nth-child(2) input[type="text"]');
            if (firstInput) {
                firstInput.focus();
            }
        }

        function addEnterKeyListener() {
            const verticalInput = document.getElementById('TbMainproduct縦軸項目名');
            if (verticalInput) {
                verticalInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        focusFirstInput();
                    }
                });
            }
        }

        addEnterKeyListener();

        Object.values(columns).forEach(column => {
            const inputs = getInputs(column);
            addEventListenersToInputs(inputs);
        });

        addRowNumbers(startIndex, endIndex);
    }

    function copyMakerStockTable(){

        GM_addStyle(`
    .copyButton {
        position: fixed;
        right: 10px;
        z-index: 1000;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        margin-bottom: 5px;
    }
    .concatButton {
        background-color: gray !important;
        color: white;
        padding: 5px 8px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-family: Arial, sans-serif;
    }
    .concatButton.active {
        background-color: orange !important;
    }
    .checkboxList {
        position: fixed;
        top: 30px;
        right: 10px;
        background-color: white;
        border: 1px solid #ccc;
        padding: 20px;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 2000;
        font-size: 15px;
        min-width: 230px;
    }
    .checkboxList button {
        margin-top: 10px;
        background-color: #28a745;
        color: white;
        padding: 5px 8px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    .checkboxList .cancelButton {
        background-color: #dc3545;

        font-family: Arial, sans-serif;
    }
    .checkboxList label {
        display: block;
        margin-bottom: 5px;
        white-space: nowrap;
    }
    .button-container {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        position: sticky;
        bottom: -20px;
        background-color: white;
        padding: 10px 0;
        border-top: 1px solid #ccc;
    }
    .selectButton {
        background-color: #007bff !important;
        color: white !important;
        padding: 5px 8px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-family: Arial, sans-serif;
    }
    .ok-cancel-container {
        display: flex;
        justify-content: flex-end;
    }
`);

        let isConcatMode = false;

        function toggleConcatMode(button) {
            isConcatMode = !isConcatMode;
            button.classList.toggle('active', isConcatMode);
        }

        function showCheckboxList(columnTexts, callback) {
            let existingList = document.querySelector('.checkboxList');
            if (existingList) {
                document.body.removeChild(existingList);
            }

            const longestTextLength = Math.max(...columnTexts.map(text => text.length));
            const listWidth = Math.max(200, Math.min(600, longestTextLength * 21));

            const listContainer = document.createElement('div');
            listContainer.className = 'checkboxList';
            listContainer.style.width = `${listWidth}px`;

            columnTexts.forEach((text, index) => {
                const label = document.createElement('label');

                const number = document.createTextNode(`${index + 1}. `);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.value = text;

                label.appendChild(number);
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(text));
                listContainer.appendChild(label);
            });

            const selectButton = document.createElement('button');
            selectButton.className = 'selectButton';
            selectButton.innerText = '全解除';

            selectButton.addEventListener('click', () => {
                const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

                checkboxes.forEach(checkbox => {
                    checkbox.checked = !allChecked;
                });

                selectButton.innerText = allChecked ? '全選択' : '全解除';
            });

            listContainer.addEventListener('change', () => {
                const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
                selectButton.innerText = allChecked ? '全解除' : '全選択';
            });

            const concatButton = document.createElement('button');
            concatButton.className = "concatButton";
            concatButton.innerText = '連結';

            isConcatMode = false;
            concatButton.classList.remove('active');

            concatButton.addEventListener('click', () => {
                toggleConcatMode(concatButton);
            });

            const okButton = document.createElement('button');
            okButton.innerText = 'OK';

            okButton.addEventListener('click', () => {
                const selectedItems = Array.from(listContainer.querySelectorAll('input:checked')).map(checkbox => checkbox.value);
                cancelCheckboxList();
                callback(selectedItems);
            });

            const cancelButton = document.createElement('button');
            cancelButton.className = 'cancelButton';
            cancelButton.innerText = '✕';
            document.body.appendChild(cancelButton);

            let tooltipTimeout;
            let tooltip;

            cancelButton.addEventListener('dblclick', () => {
                clearTimeout(tooltipTimeout);
                cancelCheckboxList();
            });

            cancelButton.addEventListener('click', () => {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = setTimeout(showTooltip, 300);
            });

            function showTooltip() {
                if (tooltip) {
                    tooltip.remove();
                }

                tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerText = 'ダブルクリックかEscで閉じる';

                tooltip.style.position = 'absolute';
                tooltip.style.backgroundColor = '#333';
                tooltip.style.color = '#fff';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '12px';
                tooltip.style.zIndex = '10001';
                tooltip.style.fontFamily = 'Arial, sans-serif';

                const buttonRect = cancelButton.getBoundingClientRect();
                const tooltipWidth = 120;

                let tooltipLeft = buttonRect.right + window.scrollX + 5;
                if (tooltipLeft + tooltipWidth > window.innerWidth) {
                    tooltipLeft = buttonRect.left + window.scrollX - tooltipWidth - 5;
                }
                tooltip.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;
                tooltip.style.left = `${tooltipLeft}px`;

                document.body.appendChild(tooltip);

                setTimeout(() => {
                    if (tooltip) tooltip.remove();
                }, 2000);
            }

            const leftContainer = document.createElement('div');
            leftContainer.style.flex = '1';
            leftContainer.appendChild(selectButton);

            const rightContainer = document.createElement('div');
            rightContainer.style.display = 'flex';
            rightContainer.style.gap = '3px';
            rightContainer.appendChild(concatButton);
            rightContainer.appendChild(okButton);
            rightContainer.appendChild(cancelButton);

            const actionButtonsContainer = document.createElement('div');
            actionButtonsContainer.style.display = 'flex';
            actionButtonsContainer.style.justifyContent = 'space-between';
            actionButtonsContainer.style.position = 'sticky';
            actionButtonsContainer.style.bottom = '-30px';
            actionButtonsContainer.style.borderTop = '1px solid #ccc';
            actionButtonsContainer.style.paddingBottom = '20px';
            actionButtonsContainer.style.backgroundColor = '#ffffff';

            actionButtonsContainer.appendChild(leftContainer);
            actionButtonsContainer.appendChild(rightContainer);

            listContainer.appendChild(actionButtonsContainer);

            document.body.appendChild(listContainer);

            function handleEscKey(event) {
                if (event.key === 'Escape') {
                    cancelCheckboxList();
                }
            }
            document.addEventListener('keydown', handleEscKey);

            function cancelCheckboxList() {
                document.body.removeChild(listContainer);
                document.removeEventListener('keydown', handleEscKey);
            }
        }

        function getUniqueItemCount(copyColumn) {
            const columnTexts = new Set();
            document.querySelectorAll(`.next-table .next-table-body .next-table-cell[data-next-table-col="${copyColumn}"]`).forEach(cell => {
                const text = cell.innerText.trim();
                if (text) {
                    columnTexts.add(text);
                }
            });
            return columnTexts.size;
        }

        function addButtons() {
            const headers = document.querySelectorAll('.next-table .next-table-header-inner th .next-table-cell-wrapper');
            let priceColumnIndex = -1;
            headers.forEach((header, index) => {
                const headerText = header.innerText.trim();
                if (headerText.includes('价格')) {
                    priceColumnIndex = index;
                }
            });

            let topPosition = 35;
            headers.forEach((header, index) => {
                const headerText = header.innerText.trim();
                if (index >= priceColumnIndex) {
                    return;
                }

                const button = document.createElement('button');
                button.className = 'copyButton';
                button.style.top = `${topPosition}px`;
                button.innerText = `${headerText}をコピー（0件）`;
                document.body.appendChild(button);

                function updateButtonCount() {
                    const itemCount = getUniqueItemCount(index);
                    button.innerText = `${headerText}をコピー（${itemCount}件）`;
                }

                button.addEventListener('click', () => {
                    const columnTexts = new Set();
                    document.querySelectorAll(`.next-table .next-table-body .next-table-cell[data-next-table-col="${index}"]`).forEach(cell => {
                        const text = cell.innerText.trim();
                        if (text) {
                            columnTexts.add(text);
                        }
                    });

                    showCheckboxList(Array.from(columnTexts), selectedItems => {
                        const separator = isConcatMode ? '、' : '\n';
                        const textToCopy = selectedItems.join(separator);
                        GM_setClipboard(textToCopy);
                        button.innerText = `${selectedItems.length}件コピーしました`;

                        setTimeout(updateButtonCount, 2000);
                    });

                    setTimeout(updateButtonCount, 2000);
                });

                const observer = new MutationObserver(updateButtonCount);
                observer.observe(document.querySelector('.next-table .next-table-body'), { childList: true, subtree: true });

                updateButtonCount();
                topPosition += 50;
            });
        }

        addButtons();

        function initSecondScript() {
            let skuButton, propButton, bulkButton;

            GM_addStyle(`
            .bulkCopyButton {
                position: fixed;
                right: 10px;
                z-index: 1000;
                background-color: #28a745;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                font-family: Arial, sans-serif;
                margin-bottom: 5px;
            }
        `);

            function createButton(id, className, display = 'none') {
                const button = document.createElement("button");
                button.id = id;
                button.className = className;
                button.style.display = display;
                document.body.appendChild(button);
                return button;
            }

            function toggleConcatMode(button) {
                isConcatMode = !isConcatMode;
                button.classList.toggle('active', isConcatMode);
            }

            function showCheckboxList(columnTexts, callback) {
                let existingList = document.querySelector('.checkboxList');
                if (existingList) {
                    document.body.removeChild(existingList);
                }

                const longestTextLength = Math.max(...columnTexts.map(text => text.length));
                const listWidth = Math.max(200, Math.min(600, longestTextLength * 21));

                const listContainer = document.createElement('div');
                listContainer.className = 'checkboxList';
                listContainer.style.width = `${listWidth}px`;

                columnTexts.forEach((text, index) => {
                    const label = document.createElement('label');

                    const number = document.createTextNode(`${index + 1}. `);

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = true;
                    checkbox.value = text;

                    label.appendChild(number);
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(text));
                    listContainer.appendChild(label);
                });

                const selectButton = document.createElement('button');
                selectButton.className = 'selectButton';
                selectButton.innerText = '全解除';

                selectButton.addEventListener('click', () => {
                    const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

                    checkboxes.forEach(checkbox => {
                        checkbox.checked = !allChecked;
                    });

                    selectButton.innerText = allChecked ? '全選択' : '全解除';
                });

                listContainer.addEventListener('change', () => {
                    const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
                    selectButton.innerText = allChecked ? '全解除' : '全選択';
                });

                const concatButton = document.createElement('button');
                concatButton.className = "concatButton";
                concatButton.innerText = '連結';

                isConcatMode = false;
                concatButton.classList.remove('active');

                concatButton.addEventListener('click', () => {
                    toggleConcatMode(concatButton);
                });

                const okButton = document.createElement('button');
                okButton.innerText = 'OK';

                okButton.addEventListener('click', () => {
                    const selectedItems = Array.from(listContainer.querySelectorAll('input:checked')).map(checkbox => checkbox.value);
                    cancelCheckboxList();
                    callback(selectedItems);
                });

                const cancelButton = document.createElement('button');
                cancelButton.className = 'cancelButton';
                cancelButton.innerText = '✕';
                document.body.appendChild(cancelButton);

                let tooltipTimeout;
                let tooltip;

                cancelButton.addEventListener('dblclick', () => {
                    clearTimeout(tooltipTimeout);
                    cancelCheckboxList();
                });

                cancelButton.addEventListener('click', () => {
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = setTimeout(showTooltip, 300);
                });

                function showTooltip() {
                    if (tooltip) {
                        tooltip.remove();
                    }

                    tooltip = document.createElement('div');
                    tooltip.className = 'tooltip';
                    tooltip.innerText = 'ダブルクリックかEscで閉じる';

                    tooltip.style.position = 'absolute';
                    tooltip.style.backgroundColor = '#333';
                    tooltip.style.color = '#fff';
                    tooltip.style.padding = '5px 10px';
                    tooltip.style.borderRadius = '4px';
                    tooltip.style.fontSize = '12px';
                    tooltip.style.zIndex = '10001';
                    tooltip.style.fontFamily = 'Arial, sans-serif';

                    const buttonRect = cancelButton.getBoundingClientRect();
                    const tooltipWidth = 120;

                    let tooltipLeft = buttonRect.right + window.scrollX + 5;
                    if (tooltipLeft + tooltipWidth > window.innerWidth) {
                        tooltipLeft = buttonRect.left + window.scrollX - tooltipWidth - 5;
                    }
                    tooltip.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;
                    tooltip.style.left = `${tooltipLeft}px`;

                    document.body.appendChild(tooltip);

                    setTimeout(() => {
                        if (tooltip) tooltip.remove();
                    }, 2000);
                }

                const leftContainer = document.createElement('div');
                leftContainer.style.flex = '1';
                leftContainer.appendChild(selectButton);

                const rightContainer = document.createElement('div');
                rightContainer.style.display = 'flex';
                rightContainer.style.gap = '3px';
                rightContainer.appendChild(concatButton);
                rightContainer.appendChild(okButton);
                rightContainer.appendChild(cancelButton);

                const actionButtonsContainer = document.createElement('div');
                actionButtonsContainer.style.display = 'flex';
                actionButtonsContainer.style.justifyContent = 'space-between';
                actionButtonsContainer.style.position = 'sticky';
                actionButtonsContainer.style.bottom = '-30px';
                actionButtonsContainer.style.borderTop = '1px solid #ccc';
                actionButtonsContainer.style.paddingBottom = '20px';
                actionButtonsContainer.style.backgroundColor = '#ffffff';

                actionButtonsContainer.appendChild(leftContainer);
                actionButtonsContainer.appendChild(rightContainer);

                listContainer.appendChild(actionButtonsContainer);

                document.body.appendChild(listContainer);

                function handleEscKey(event) {
                    if (event.key === 'Escape') {
                        cancelCheckboxList();
                    }
                }
                document.addEventListener('keydown', handleEscKey);

                function cancelCheckboxList() {
                    document.body.removeChild(listContainer);
                    document.removeEventListener('keydown', handleEscKey);
                }
            }

            function initButtons() {
                let topPosition = 35;

                skuButton = createButton("skuCopyButton", "copyButton");
                propButton = createButton("propCopyButton", "copyButton");

                if (skuButton) {
                    skuButton.style.top = `${topPosition}px`;
                    topPosition += 50;
                }

                if (propButton) {
                    propButton.style.top = `${topPosition}px`;
                    topPosition += 50;
                }

                bulkButton = createButton("bulkCopyButton", "bulkCopyButton", "block");
                bulkButton.style.top = `${topPosition}px`;
                topPosition += 50;

                function updateButtonText() {
                    let propNames = document.querySelectorAll(".sku-prop-module-name");
                    if (propNames.length === 0) {
                        propNames = document.querySelectorAll(".sku-selector-name");
                    }
                    const propTexts = Array.from(propNames).map(el => el.textContent.trim());

                    let skuItems = document.querySelectorAll(".sku-item-name");
                    if (skuItems.length === 0) {
                        skuItems = document.querySelectorAll(".sku-item-name-text");
                    }
                    let propItems = document.querySelectorAll(".prop-name");
                    if (propItems.length === 0) {
                        propItems = document.querySelectorAll(".prop-item-text");
                    }

                    let topPosition = 35;

                    if (propTexts.length >= 2) {
                        const uniquePropItems = Array.from(new Set(Array.from(propItems).map(item => item.textContent.trim()).filter(text => text)));
                        const uniqueSkuItems = Array.from(new Set(Array.from(skuItems).map(item => item.textContent.trim()).filter(text => text)));

                        skuButton.innerText = `${propTexts[0]}をコピー（${uniquePropItems.length}件）`;
                        propButton.innerText = `${propTexts[1]}をコピー（${uniqueSkuItems.length}件）`;
                        skuButton.style.top = `${topPosition}px`;
                        skuButton.style.display = "block";
                        topPosition += 50;
                        propButton.style.top = `${topPosition}px`;
                        propButton.style.display = "block";
                        topPosition += 50;
                    } else {
                        skuButton.style.display = "none";
                        propButton.style.display = "none";
                    }

                    const totalUniqueItems = new Set([...propItems, ...skuItems].map(item => item.textContent.trim()).filter(text => text)).size;
                    bulkButton.innerText = `一括コピー（${totalUniqueItems}件）`;
                    bulkButton.style.top = `${topPosition}px`;
                }

                function copyItems(items, button) {
                    const uniqueItems = Array.from(new Set(Array.from(items).map(item => item.textContent.trim()).filter(text => text)));
                    if (uniqueItems.length > 0) {
                        showCheckboxList(uniqueItems, selectedItems => {
                            const separator = isConcatMode ? '、' : '\n';
                            const textToCopy = selectedItems.join(separator);
                            GM_setClipboard(textToCopy);
                            button.innerText = `${selectedItems.length}件コピーしました`;

                            setTimeout(updateButtonText, 2000);
                        });
                    }
                }

                skuButton.addEventListener("click", () => {
                    copyItems(document.querySelectorAll(".prop-name, .prop-item-text"), skuButton);
                });

                propButton.addEventListener("click", () => {
                    copyItems(document.querySelectorAll(".sku-item-name, .sku-item-name-text"), propButton);
                });

                bulkButton.addEventListener("click", () => {
                    const skuItems = document.querySelectorAll(".sku-item-name, .sku-item-name-text");
                    const propItems = document.querySelectorAll(".prop-name, .prop-item-text");

                    const uniqueSkuItems = Array.from(new Set(Array.from(skuItems).map(item => item.textContent.trim()).filter(text => text)));
                    const uniquePropItems = Array.from(new Set(Array.from(propItems).map(item => item.textContent.trim()).filter(text => text)));

                    showCheckboxList([...uniquePropItems, ...uniqueSkuItems], selectedItems => {
                        const separator = isConcatMode ? '、' : '\n';
                        const textToCopy = selectedItems.join(separator);
                        GM_setClipboard(textToCopy);
                        bulkButton.innerText = `${selectedItems.length}件コピーしました`;

                        setTimeout(updateButtonText, 2000);
                    });
                });

                const debouncedUpdateButtonText = debounce(updateButtonText, 500);
                const observer = new MutationObserver(debouncedUpdateButtonText);
                observer.observe(document.body, { childList: true, subtree: true });

                updateButtonText();
            }

            function debounce(func, wait) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            }

            initButtons();
        }

        window.addEventListener('load', () => {
            const specElement = Array.from(document.querySelectorAll('.next-table .next-table-header-inner th .next-table-cell-wrapper')).find(el => el.textContent.includes('(元)'));
            if (specElement) {
                addButtons();
            } else {
                initSecondScript();
            }
        });

        const style = `
#weight-display {
    position: fixed;
    bottom: 160px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #ddd;
    padding: 10px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    z-index: 1998;
    text-align: center;
    white-space: pre-line;
}
#help-button {
    position: fixed;
    bottom: 205px;
    right: 21px;
    font-size: 12px;
    font-family: Arial, sans-serif;
    cursor: pointer;
    z-index: 1999;
    text-decoration: none;
}
#help-button:hover {
    color: #0056b3;
}
`;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);

        function findWeightColumnIndex() {
            const headerCells = document.querySelectorAll('.od-pc-offer-table thead tr th');
            for (let i = 0; i < headerCells.length; i++) {
                if (headerCells[i].textContent.trim() === '重量(g)') {
                    return i;
                }
            }
            return -1;
        }

        function fetchAllWeightInfo(columnIndex) {
            if (columnIndex === -1) return [];
            const weightCells = document.querySelectorAll(`.od-pc-offer-table tbody tr td:nth-child(${columnIndex + 1})`);
            const weights = Array.from(weightCells).map(cell => {
                const weight = cell.getAttribute('title') || cell.textContent.trim();
                return parseFloat(weight);
            }).filter(value => !isNaN(value));
            return weights;
        }

        function calculateMinMax(weights) {
            if (weights.length === 0) return null;
            const min = Math.min(...weights);
            const max = Math.max(...weights);
            return { min, max };
        }

        const displayDiv = document.createElement('div');
        displayDiv.id = 'weight-display';
        displayDiv.textContent = '重量情報を取得中...';

        const helpButton = document.createElement('div');
        helpButton.id = 'help-button';
        helpButton.textContent = '？';
        helpButton.title = '※この情報はページ下部から取得しています\n　別の場所にある場合は取得できません';

        document.body.appendChild(helpButton);
        document.body.appendChild(displayDiv);

        function updateWeightDisplay() {
            const columnIndex = findWeightColumnIndex();
            if (columnIndex !== -1) {
                const weights = fetchAllWeightInfo(columnIndex);
                const range = calculateMinMax(weights);
                if (range) {
                    if (range.min === range.max) {
                        displayDiv.textContent = `重量(g)\n${range.min}`;
                    } else {
                        displayDiv.textContent = `重量(g)\n${range.min} ～ ${range.max}`;
                    }
                } else {
                    displayDiv.textContent = '重量不明';
                }
            } else {
                displayDiv.textContent = '重量不明';
            }
        }

        function waitForTableAndUpdate() {
            const maxTries = 20;
            let tries = 0;

            const intervalId = setInterval(() => {
                const tableExists = document.querySelector('.od-pc-offer-table thead tr th');
                if (tableExists) {
                    clearInterval(intervalId);
                    updateWeightDisplay();
                } else {
                    tries++;
                    if (tries >= maxTries) {
                        clearInterval(intervalId);
                        displayDiv.textContent = '重量不明';
                    }
                }
            }, 500);
        }

        waitForTableAndUpdate();
    }

    function enhanceAxisCodeManager(){

        function triggerInputEvent(element) {
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }

        function processPastedText(inputElement, pastedText) {
            const lines = pastedText.split('\n').filter(line => line.trim() !== "");

            if (lines.length === 1) {
                const currentPosition = inputElement.selectionStart;
                const currentValue = inputElement.value;

                if (inputElement.selectionStart === 0 && inputElement.selectionEnd === currentValue.length) {
                    inputElement.value = pastedText;
                    inputElement.setSelectionRange(pastedText.length, pastedText.length);
                } else {
                    const newValue = currentValue.slice(0, currentPosition) + pastedText + currentValue.slice(currentPosition);
                    inputElement.value = newValue;
                    inputElement.setSelectionRange(currentPosition + pastedText.length, currentPosition + pastedText.length);
                }
                triggerInputEvent(inputElement);
            } else {
                inputElement.value = lines[0];
                triggerInputEvent(inputElement);

                const columnIndex = Array.from(inputElement.closest('tr').children).indexOf(inputElement.closest('td'));

                for (let i = 1; i < lines.length; i++) {
                    const nextRow = inputElement.closest('tr').nextElementSibling;
                    if (nextRow) {
                        const nextInput = nextRow.children[columnIndex].querySelector('input.form-control');
                        if (nextInput) {
                            nextInput.value = lines[i];
                            triggerInputEvent(nextInput);
                            inputElement = nextInput;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        function handlePaste(event) {
            const pastedText = (event.clipboardData || window.clipboardData).getData('text');

            if (pastedText.includes('\n')) {
                event.preventDefault();
                processPastedText(event.target, pastedText);
            }
        }

        function addPasteListeners() {
            document.querySelectorAll('input.form-control').forEach(input => {
                input.addEventListener('paste', handlePaste);
            });
        }

        function observeDynamicElements() {
            new MutationObserver(() => addPasteListeners()).observe(document.getElementById('axisCode'), { childList: true, subtree: true });
        }

        window.addEventListener('load', () => {
            addPasteListeners();
            observeDynamicElements();
        });
    }

    function personalMemo(){

        let memoBoxChanged = false;
        let otherChanges = false;
        let memoVisible = localStorage.getItem('memoVisible') === 'true';
        const isStarlight = window.location.hostname === 'starlight.plusnao.co.jp';

        if (isStarlight) {
            memoVisible = false;
        }

        let splitMode = localStorage.getItem('splitMode') || 'none';

        const memoDiv = document.createElement('div');
        memoDiv.style.position = 'fixed';
        memoDiv.style.bottom = isStarlight ? '0' : '25px';
        memoDiv.style.right = '5px';
        memoDiv.style.zIndex = '1000';
        memoDiv.style.border = '1px solid #ccc';
        memoDiv.style.backgroundColor = '#EEF7FF';
        memoDiv.style.resize = 'both';
        memoDiv.style.overflow = 'hidden';
        memoDiv.style.borderRadius = '5px';
        memoDiv.style.transform = 'scale(-1)';
        memoDiv.style.display = memoVisible ? 'flex' : 'none';
        memoDiv.style.flexDirection = 'column-reverse';
        memoDiv.style.boxSizing = 'border-box';

        const savedWidth = localStorage.getItem('memoBoxWidth') || '500px';
        const savedHeight = localStorage.getItem('memoBoxHeight') || '500px';
        memoDiv.style.width = savedWidth;
        memoDiv.style.height = savedHeight;

        const memoHeader = document.createElement('div');
        memoHeader.textContent = 'Memo';
        memoHeader.style.fontWeight = 'bold';
        memoHeader.style.textAlign = 'center';
        memoHeader.style.position = 'relative';
        memoHeader.style.padding = isStarlight ? '5px 0' : '5px 0';
        memoHeader.style.cursor = 'default';
        memoHeader.style.transform = 'scale(-1)';

        const memoContainer = document.createElement('div');
        memoContainer.style.flex = '1';
        memoContainer.style.display = 'flex';
        memoContainer.style.flexDirection = 'column';
        memoContainer.style.overflow = 'hidden';
        memoContainer.style.transform = 'scale(-1)';

        function simulatePaste(inputElement, text) {
            if (!text.includes('\n')) {
                text += '\n';
            }

            navigator.clipboard.writeText(text).then(() => {
                inputElement.focus();

                const pasteEvent = new ClipboardEvent('paste', {
                    clipboardData: new DataTransfer()
                });
                pasteEvent.clipboardData.setData('text', text);
                inputElement.dispatchEvent(pasteEvent);
            }).catch(err => {
                console.error('Clipboardへの書き込みに失敗しました:', err);
            });
        }

        function createTextarea(index) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.marginBottom = '5px';

            const textarea = document.createElement('textarea');
            textarea.style.width = '100%';
            textarea.style.height = '100%';
            textarea.style.resize = 'none';
            textarea.style.boxSizing = 'border-box';

            textarea.style.padding = '3px';
            textarea.placeholder = `Area ${index}`;
            textarea.dataset.index = index;

            let productId;
            if (window.location.hostname === 'starlight.plusnao.co.jp') {
                const params = new URLSearchParams(window.location.search);
                productId = params.get('code');
            } else {
                productId = window.location.pathname.split('/').pop();
            }

            let value;

            if (window.location.hostname === 'starlight.plusnao.co.jp') {
                if (index === 0) {
                    value = GM_getValue(`personalMemo-${productId}`, '');
                } else {
                    value = GM_getValue(`personalMemo-${productId}-@${index}`, '');
                }
            } else {
                if (index === 0) {
                    value = localStorage.getItem(`personalMemo-${productId}`) || '';
                    if (value === '') {
                        value = GM_getValue(`personalMemo-@${productId}`, '');
                    }
                } else {
                    value = localStorage.getItem(`personalMemo-${productId}-${index}`) || '';
                    if (value === '') {
                        value = GM_getValue(`personalMemo-${productId}-@${index}`, '');
                    }
                }
            }
            textarea.value = value;

            textarea.addEventListener('input', () => {
                if (window.location.hostname !== 'starlight.plusnao.co.jp') {
                    if (index === 0) {
                        localStorage.setItem(`personalMemo-${productId}`, textarea.value);
                        GM_setValue(`personalMemo-${productId}`, textarea.value);
                    } else {
                        localStorage.setItem(`personalMemo-${productId}-@${index}`, textarea.value);
                        GM_setValue(`personalMemo-${productId}-@${index}`, textarea.value);
                    }
                }
                memoBoxChanged = true;
            });

            textarea.addEventListener('mousedown', (event) => {
                event.stopPropagation();
            });

            const copyButton = document.createElement('button');
            copyButton.textContent = 'コピー';
            copyButton.style.marginTop = '5px';
            copyButton.style.padding = '9px 6px';
            copyButton.style.fontSize = '12px';
            copyButton.style.border = 'none';
            copyButton.style.backgroundColor = '#007bff';
            copyButton.style.color = 'white';
            copyButton.style.borderRadius = '3px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.alignSelf = 'flex-start';

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(textarea.value).then(() => {
                    copyButton.textContent = 'コピーしました';
                    setTimeout(() => {
                        copyButton.textContent = 'コピー';
                    }, 1500);
                }).catch(err => {
                    console.error('コピーに失敗しました: ', err);
                });
            });

            const pasteHorizontalButton = document.createElement('button');
            pasteHorizontalButton.textContent = '横軸ペースト';
            pasteHorizontalButton.style.marginTop = '5px';
            pasteHorizontalButton.style.padding = '9px 6px';
            pasteHorizontalButton.style.fontSize = '12px';
            pasteHorizontalButton.style.border = 'none';
            pasteHorizontalButton.style.backgroundColor = '#28a745';
            pasteHorizontalButton.style.color = 'white';
            pasteHorizontalButton.style.borderRadius = '3px';
            pasteHorizontalButton.style.cursor = 'pointer';
            pasteHorizontalButton.style.alignSelf = 'flex-start';

            pasteHorizontalButton.addEventListener('click', () => {
                const targetHorizontalInput = document.querySelector('table:nth-of-type(1) tbody tr td:nth-child(4) input.form-control');
                if (targetHorizontalInput) {
                    const textToPaste = textarea.value;
                    simulatePaste(targetHorizontalInput, textToPaste);

                    pasteHorizontalButton.textContent = 'ペーストしました';
                    setTimeout(() => {
                        pasteHorizontalButton.textContent = '横軸ペースト';
                    }, 1500);
                }
            });

            const pasteVerticalButton = document.createElement('button');
            pasteVerticalButton.textContent = '縦軸ペースト';
            pasteVerticalButton.style.marginTop = '5px';
            pasteVerticalButton.style.padding = '9px 6px';
            pasteVerticalButton.style.fontSize = '12px';
            pasteVerticalButton.style.border = 'none';
            pasteVerticalButton.style.backgroundColor = '#28a745';
            pasteVerticalButton.style.color = 'white';
            pasteVerticalButton.style.borderRadius = '3px';
            pasteVerticalButton.style.cursor = 'pointer';
            pasteVerticalButton.style.alignSelf = 'flex-start';

            pasteVerticalButton.addEventListener('click', () => {
                const verticalTable = document.querySelectorAll('table')[2];
                const targetVerticalInputs = verticalTable.querySelectorAll('tbody tr td:nth-child(4) input.form-control');

                if (targetVerticalInputs.length > 0) {
                    const textToPaste = textarea.value;

                    targetVerticalInputs.forEach((input, index) => {
                        if (index === 0) {
                            simulatePaste(input, textToPaste);
                        }
                    });

                    pasteVerticalButton.textContent = 'ペーストしました';
                    setTimeout(() => {
                        pasteVerticalButton.textContent = '縦軸ペースト';
                    }, 1500);
                }
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginTop = '1px';

            container.appendChild(textarea);
            if (isStarlight) {
                buttonContainer.appendChild(copyButton);
                buttonContainer.appendChild(pasteHorizontalButton);
                buttonContainer.appendChild(pasteVerticalButton);
                container.appendChild(textarea);
                container.appendChild(buttonContainer);
            }
            return container;
        }

        memoDiv.addEventListener('mouseup', () => {
            if (memoVisible) {
                localStorage.setItem('memoBoxWidth', memoDiv.style.width);
                localStorage.setItem('memoBoxHeight', memoDiv.style.height);
                memoBoxChanged = true;
            }
        });

        function updateMemoLayout() {
            memoContainer.innerHTML = '';
            let textareas;

            switch (splitMode) {
                case 'vertical': {
                    memoContainer.style.flexDirection = 'column';
                    textareas = [createTextarea(0), createTextarea(1)];
                    textareas.forEach((container) => {
                        container.style.flex = '1';
                        memoContainer.appendChild(container);
                    });
                    break;
                }
                case 'horizontal': {
                    memoContainer.style.flexDirection = 'row';
                    textareas = [createTextarea(0), createTextarea(1)];
                    textareas.forEach((container) => {
                        container.style.flex = '1';
                        memoContainer.appendChild(container);
                    });
                    break;
                }
                case 'grid': {
                    memoContainer.style.flexDirection = 'column';
                    const row1 = document.createElement('div');
                    row1.style.display = 'flex';
                    row1.style.flex = '1';
                    row1.style.flexDirection = 'row';
                    row1.style.overflow = 'hidden';

                    const row2 = document.createElement('div');
                    row2.style.display = 'flex';
                    row2.style.flex = '1';
                    row2.style.flexDirection = 'row';
                    row2.style.overflow = 'hidden';

                    textareas = [createTextarea(0), createTextarea(1), createTextarea(2), createTextarea(3)];
                    textareas.forEach((container, index) => {
                        container.style.flex = '1';
                        if (index < 2) row1.appendChild(container);
                        else row2.appendChild(container);
                    });

                    memoContainer.appendChild(row1);
                    memoContainer.appendChild(row2);
                    break;
                }
                default: {
                    const container = createTextarea(0);
                    container.style.height = '100%';
                    container.style.width = '100%';
                    memoContainer.appendChild(container);
                    break;
                }
            }
        }

        const splitButton = document.createElement('button');
        splitButton.textContent = '田';
        splitButton.style.position = 'fixed';
        splitButton.style.top = '5px';
        splitButton.style.right = '30px';
        splitButton.style.zIndex = '1001';
        splitButton.style.padding = '0px 6px';
        splitButton.style.fontSize = '12px';
        splitButton.style.border = 'none';
        splitButton.style.backgroundColor = '#66CCFF';
        splitButton.style.color = '#fff';
        splitButton.style.borderRadius = '3px';
        splitButton.style.cursor = 'pointer';

        splitButton.addEventListener('click', () => {
            switch (splitMode) {
                case 'none':
                    splitMode = 'vertical';
                    break;
                case 'vertical':
                    splitMode = 'horizontal';
                    break;
                case 'horizontal':
                    splitMode = 'grid';
                    break;
                case 'grid':
                    splitMode = 'none';
                    break;
            }
            localStorage.setItem('splitMode', splitMode);
            updateMemoLayout();
        });

        const buttonStyle = `
    #buttonWrapper {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        pointer-events: none;
    }

    #showButton {
        width: 40px;
        height: 40px;
        background: rgba(102, 204, 102, 0.5);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(102, 204, 102, 0.4);
        border-radius: 50%;
        font-size: 26px;
        font-weight: bold;
        font-family: monospace;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        pointer-events: auto;
        transform-origin: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        opacity: 0;
        animation: fadeIn 0.5s forwards;
    }

    #showButton:hover {
        width: 60px;
        height: 60px;
        background: rgba(102, 204, 102, 0.6);
        font-size: 32px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    #showButton:active {
        transform: scale(0.9);
        background: rgba(102, 204, 102, 0.8);
        transition: transform 0.05s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
    }

    @keyframes buttonPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.4) rotate(10deg); }
        100% { transform: scale(1); }
    }

    @keyframes fadeInMemo {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    #showButton.fadeOut {
        animation: fadeOut 0.5s forwards;
    }

    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.5); }
    }
`;

        const styleElement = document.createElement('style');
        styleElement.innerHTML = buttonStyle;
        document.head.appendChild(styleElement);

        const wrapper = document.createElement('div');
        wrapper.id = 'buttonWrapper';

        const showButton = document.createElement('button');
        showButton.id = 'showButton';
        showButton.textContent = '＋';
        wrapper.appendChild(showButton);

        const hideButton = document.createElement('button');
        hideButton.textContent = '‐';
        hideButton.style.position = 'fixed';
        hideButton.style.top = '5px';
        hideButton.style.right = '5px';
        hideButton.style.zIndex = '1001';
        hideButton.style.transform = 'scale(-1)';
        hideButton.style.padding = '0px 6px';
        hideButton.style.fontSize = '12px';
        hideButton.style.border = 'none';
        hideButton.style.backgroundColor = '#FF6666';
        hideButton.style.color = '#fff';
        hideButton.style.borderRadius = '3px';
        hideButton.style.cursor = 'pointer';
        hideButton.style.display = memoVisible ? 'block' : 'none';

        memoDiv.style.display = memoVisible ? 'flex' : 'none';
        showButton.style.display = memoVisible ? 'none' : 'block';

        hideButton.addEventListener('click', () => {
            memoVisible = false;
            memoDiv.style.display = 'none';
            hideButton.style.display = 'none';
            showButton.style.display = 'block';
            localStorage.setItem('memoVisible', memoVisible);
            document.body.removeEventListener('click', handleClickOutside);
        });

        showButton.addEventListener('click', () => {
            showButton.style.animation = 'buttonPop 0.5s';

            setTimeout(() => {
                memoVisible = !memoVisible;

                setTimeout(() => {
                    memoDiv.style.display = memoVisible ? 'flex' : 'none';
                }, 70);

                hideButton.style.display = memoVisible ? 'block' : 'none';

                if (memoVisible) {
                    showButton.classList.add('fadeOut');
                    setTimeout(() => {
                        showButton.style.display = 'none';
                    }, 70);

                    document.body.addEventListener('click', handleClickOutside);
                } else {
                    showButton.classList.remove('fadeOut');
                    showButton.style.display = 'block';
                    showButton.style.opacity = '1';

                    document.body.removeEventListener('click', handleClickOutside);
                }

                localStorage.setItem('memoVisible', memoVisible);
            }, 70);
        });


        hideButton.addEventListener('click', () => {
            memoVisible = false;
            memoDiv.style.display = 'none';
            hideButton.style.display = 'none';

            showButton.style.display = 'block';
            showButton.classList.remove('fadeOut');
            showButton.style.opacity = '1';

            localStorage.setItem('memoVisible', memoVisible);

            if (isStarlight) {
                if (memoVisible) {
                    document.body.addEventListener('click', handleClickOutside);
                } else {
                    document.body.removeEventListener('click', handleClickOutside);
                }
            }
        });

        memoHeader.appendChild(splitButton);
        memoHeader.appendChild(hideButton);
        memoDiv.appendChild(memoHeader);
        memoDiv.appendChild(memoContainer);

        document.body.appendChild(memoDiv);
        document.body.appendChild(wrapper);

        updateMemoLayout();

        window.addEventListener('resize', () => {
            if (memoVisible) {
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const newWidth = Math.min(parseInt(memoDiv.style.width), windowWidth - 20) + 'px';
                const newHeight = Math.min(parseInt(memoDiv.style.height), windowHeight - 50) + 'px';

                memoDiv.style.width = newWidth;
                memoDiv.style.height = newHeight;
            }
        });

        document.body.addEventListener('input', (event) => {
            if (event.target.closest('textarea')) {
                memoBoxChanged = true;
            } else {
                otherChanges = true;
            }
        });

        const buttonIds = ['tempSaveButton', 'saveAndSkuStock', 'registeredSaveAndSkuStock', 'registeredSaveButton'];
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                });
            }
        });

        if (isStarlight) {
            let productId = new URLSearchParams(window.location.search).get('code');

            const observer = new MutationObserver(() => {
                const params = new URLSearchParams(window.location.search);
                const newProductId = params.get('code');

                if (newProductId !== productId) {
                    productId = newProductId;
                    updateMemoLayout();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        function handleClickOutside(event) {
            if (isStarlight && memoVisible && !memoDiv.contains(event.target) && !showButton.contains(event.target)) {
                memoVisible = false;
                memoDiv.style.display = 'none';
                hideButton.style.display = 'none';

                showButton.style.display = 'block';
                showButton.classList.remove('fadeOut');
                showButton.style.opacity = '1';

                localStorage.setItem('memoVisible', memoVisible);

                document.removeEventListener('click', handleClickOutside);
                document.addEventListener('click', handleClickOutside);
            }
        }

        document.addEventListener('click', handleClickOutside);
    }

    function removeUnwantedImgs(){

        let isScriptActive = false;
        let isHighlightActive = true;

        const selectorsToRemove = [
            '.sdmap-dynamic-offer-list',
            '.od-pc-offer-recommend',
            '.od-pc-offer-combi-recommend',
            '.od-pc-offer-top-sales',
            '.cht-recommends-detail',
            '.m-auto',
            '.activity-banner-img',
            'div[data-darksite-inline-background-image]',
            'div[style*="background-color: #ffffff;"]',
            'div[id="hd_0_container_0"] > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2)',
            'div[align="hunpi-bf-3690"][style*="width: 790px;"]',
            'a[href^="http://detail.1688.com/offer/"]',
            'div[style*="border-radius: 30px"][style*="width: 60px"][style*="height: 60px"]',
            'map',
            'area[href]',
            'div[style*="width: 164px;"][style*="height: 108px;"][style*="position: absolute;"][style*="top: 22px;"][style*="right: -82px;"][style*="z-index: 1;"]',
            'div[style*="height: 82px;"][style*="width: 162px;"]',
            'img[style*="height: 14px"][style*="margin: 0px"][style*="padding: 0px"]',
        ];

        function removeElements() {
            if (!isScriptActive) return;

            const tables = document.querySelectorAll('table[border="0"]');
            tables.forEach((table) => {
                const productImages = table.querySelectorAll('.desc-img-loaded');
                let shouldRemoveTable = false;

                productImages.forEach((img) => {
                    const width = img.offsetWidth;
                    if (width <= 301) {
                        shouldRemoveTable = true;
                    }
                });

                if (shouldRemoveTable) {
                    table.remove();
                }
            });

            selectorsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element) => {
                    if (!element.closest('div.sku-item-wrapper') && !element.closest('div[style="width: 790px; position: relative;"]')) {
                        element.remove();
                    }
                });
            });

            const descImages = document.querySelectorAll('.desc-img-loaded');
            descImages.forEach((img) => {
                const width = img.offsetWidth;
                const height = img.offsetHeight;
                if (width <= 200 && height <= 200) {
                    img.remove();
                }
            });

            const specialDivs = document.querySelectorAll('div[style*="background: url"][style*="width: 164px"][style*="height: 108px"]');
            specialDivs.forEach((div) => {
                div.remove();
            });

            const toggleButton = document.getElementById('toggleButton');
            toggleButton.innerText = '削除済み';
            toggleButton.style.backgroundColor = '#B0BEC5';
            toggleButton.style.cursor = 'default';
            toggleButton.disabled = true;
        }

        function highlightElements() {
            if (!isHighlightActive) return;

            const tables = document.querySelectorAll('table[border="0"]');
            tables.forEach((table) => {
                const productImages = table.querySelectorAll('.desc-img-loaded');
                let shouldHighlightTable = false;

                productImages.forEach((img) => {
                    const width = img.offsetWidth;
                    if (width <= 301) {
                        shouldHighlightTable = true;
                    }
                });

                if (shouldHighlightTable) {
                    table.style.position = 'relative';
                    const overlay = document.createElement('div');
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                    overlay.style.pointerEvents = 'none';
                    overlay.classList.add('highlight-overlay');
                    table.appendChild(overlay);
                }
            });

            selectorsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element) => {
                    if (!element.classList.contains('highlight-overlay')) {
                        element.style.position = 'relative';
                        const overlay = document.createElement('div');
                        overlay.style.position = 'absolute';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.width = '100%';
                        overlay.style.height = '100%';
                        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                        overlay.style.pointerEvents = 'none';
                        overlay.classList.add('highlight-overlay');
                        element.appendChild(overlay);
                    }
                });
            });

            const imgElements = document.querySelectorAll('img[usemap]');
            imgElements.forEach((imgElement) => {
                if (!imgElement.classList.contains('highlight-overlay')) {
                    imgElement.style.position = 'relative';
                    const overlay = document.createElement('div');
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(0, 0, 255, 0.3)';
                    overlay.style.pointerEvents = 'none';
                    overlay.classList.add('highlight-overlay');
                    imgElement.appendChild(overlay);
                }
            });

            highlightMapAreas();
        }

        function highlightMapAreas() {
            const areas = document.querySelectorAll('area[href]');
            areas.forEach((area) => {
                const coords = area.coords.split(',').map(Number);
                const img = document.querySelector(`img[usemap="#${area.parentElement.name}"]`);

                if (img && coords.length === 4) {
                    const overlay = document.createElement('div');
                    overlay.style.position = 'absolute';
                    overlay.style.top = `${coords[1]}px`;
                    overlay.style.left = `${coords[0]}px`;
                    overlay.style.width = `${coords[2] - coords[0]}px`;
                    overlay.style.height = `${coords[3] - coords[1]}px`;
                    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                    overlay.style.pointerEvents = 'none';
                    overlay.classList.add('highlight-overlay');
                    img.parentElement.appendChild(overlay);
                }
            });
        }

        function removeHighlight() {
            const overlays = document.querySelectorAll('.highlight-overlay');
            overlays.forEach(overlay => {
                overlay.remove();
            });
        }

        function toggleScript() {
            isScriptActive = !isScriptActive;
            const toggleButton = document.getElementById('toggleButton');

            if (isScriptActive) {
                removeElements();
            }
        }

        function toggleHighlight() {
            isHighlightActive = !isHighlightActive;
            const highlightButton = document.getElementById('highlightButton');

            if (isHighlightActive) {
                highlightButton.innerText = 'ハイライト停止';
                highlightElements();
            } else {
                highlightButton.innerText = 'ハイライト開始';
                removeHighlight();
            }
        }

        function createToggleButton() {
            const button = document.createElement('button');
            button.id = 'toggleButton';
            button.innerText = '画像を削除';
            button.style.position = 'fixed';
            button.style.bottom = '70px';
            button.style.right = '20px';
            button.style.zIndex = '1000';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'not-allowed';
            button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
            button.style.fontSize = '14px';
            button.style.fontFamily = 'Arial, sans-serif';
            button.disabled = true;

            button.addEventListener('click', toggleScript);

            document.body.appendChild(button);
        }

        function createHighlightButton() {
            const button = document.createElement('button');
            button.id = 'highlightButton';
            button.innerText = 'ハイライト停止';
            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.zIndex = '1000';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#FF9800';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'not-allowed';
            button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
            button.style.fontSize = '14px';
            button.style.fontFamily = 'Arial, sans-serif';
            button.disabled = true;

            button.addEventListener('click', toggleHighlight);

            document.body.appendChild(button);
        }

        window.addEventListener('load', () => {
            highlightElements();
            const toggleButton = document.getElementById('toggleButton');
            const highlightButton = document.getElementById('highlightButton');

            toggleButton.disabled = false;
            toggleButton.style.cursor = 'pointer';

            highlightButton.disabled = false;
            highlightButton.style.cursor = 'pointer';
        });

        createToggleButton();
        createHighlightButton();
    }

    function loadAllImages() {
        (function () {
            function fixImage(img) {
                const lazySrc =
                      img.getAttribute('data-lazyload-src') ||
                      img.getAttribute('data-src') ||
                      img.getAttribute('data-origin') ||
                      img.getAttribute('data-lazysrc') ||
                      img.getAttribute('data-original') ||
                      img.src;

                if (!lazySrc) return;

                img.src = lazySrc;

                img.removeAttribute('data-lazyload-src');
                img.removeAttribute('data-src');
                img.removeAttribute('data-origin');
                img.removeAttribute('data-lazysrc');
                img.removeAttribute('data-original');

                img.style.setProperty('width', 'auto', 'important');
                img.style.setProperty('height', 'auto', 'important');
                img.style.setProperty('opacity', '1', 'important');
                img.style.setProperty('visibility', 'visible', 'important');

                const observer = new MutationObserver(() => {
                    if (img.src !== lazySrc) {
                        img.src = lazySrc;
                    }
                });
                observer.observe(img, { attributes: true, attributeFilter: ['src'] });
            }

            function loadImages() {
                document.querySelectorAll('.content-detail img, img.desc-img-no-load').forEach(fixImage);
            }

            function disableScrollHandlers() {
                window.onscroll = null;
                document.onscroll = null;
                window.addEventListener(
                    'scroll',
                    function (e) {
                        e.stopImmediatePropagation();
                    },
                    true
                );
            }

            function run() {
                loadImages();
                disableScrollHandlers();
            }

            if (document.readyState === 'complete') {
                run();
            } else {
                window.addEventListener('load', run);
            }
        })();
    }

    function dlMergedImgs(){

        GM_addStyle(`
        #downloadMergedImageButton {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 5px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            cursor: pointer;
            z-index: 9999;
        }
        #downloadMergedImageButton.processing {
            background-color: #FFA500;
            cursor: not-allowed;
        }
        #downloadMergedImageButton.complete {
            background-color: #008CBA;
        }
        #downloadMergedImageButton:hover:not(.processing) {
            background-color: #45a049;
        }

        .content-detail {
            position: relative !important;
        }
        .content-detail img {
            display: block !important;
            margin: 0 auto !important;
        }
        .content-detail .overlay-line {
            position: absolute !important;
            left: 0 !important;
            height: 2px !important;
            background-color: transparent !important;
            border-top: 2px dotted #FF6347 !important;
            z-index: 8 !important;
        }

    `);

        const button = document.createElement('button');
        button.id = 'downloadMergedImageButton';
        button.textContent = '結合画像 ⬇️';
        document.body.appendChild(button);

        function addOverlayLines() {
            const container = document.querySelector('.content-detail');
            if (!container) return;

            const images = container.querySelectorAll('img');
            for (let i = 0; i < images.length - 1; i++) {
                const currentImage = images[i];
                const nextImage = images[i + 1];

                const gap = nextImage.offsetTop - (currentImage.offsetTop + currentImage.offsetHeight);

                if (gap <= 10) {
                    const overlay = document.createElement('div');
                    overlay.className = 'overlay-line';
                    overlay.style.top = `${currentImage.offsetTop + currentImage.offsetHeight}px`;
                    overlay.style.width = `${currentImage.offsetWidth}px`;
                    container.appendChild(overlay);
                }
            }
        }

        button.addEventListener('click', async () => {
            if (button.classList.contains('processing')) return;

            button.textContent = '処理中…';
            button.classList.add('processing');

            const images = document.querySelectorAll('.content-detail img');
            if (images.length === 0) {
                button.textContent = '画像が見つかりません';
                button.classList.remove('processing');
                return;
            }

            document.querySelectorAll('.content-detail .overlay-line').forEach((line) => line.remove());

            const loadedImages = [];
            for (const img of images) {
                const imgUrl = img.src || img.dataset.src;
                if (imgUrl) {
                    try {
                        const image = await loadImage(imgUrl);
                        loadedImages.push(image);
                    } catch (err) {
                        console.error('画像のロードに失敗:', imgUrl, err);
                    }
                }
            }

            if (loadedImages.length === 0) {
                button.textContent = 'ロード失敗';
                button.classList.remove('processing');
                return;
            }

            const mergedCanvas = mergeImages(loadedImages);
            if (!mergedCanvas) {
                button.textContent = '結合失敗';
                button.classList.remove('processing');
                return;
            }

            const link = document.createElement('a');
            link.download = 'merged_image.jpg';
            link.href = mergedCanvas.toDataURL('image/jpeg');
            link.click();

            button.textContent = 'ダウンロード開始！';
            button.classList.remove('processing');
            button.classList.add('complete');

            setTimeout(() => {
                button.textContent = '結合画像 ⬇️';
                button.classList.remove('complete');
            }, 3000);
        });

        function loadImage(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = (err) => reject(err);
                img.src = url;
            });
        }

        function mergeImages(images) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            const width = Math.max(...images.map((img) => img.width));
            const totalHeight = images.reduce((sum, img) => sum + img.height, 0);
            canvas.width = width;
            canvas.height = totalHeight;

            let yOffset = 0;
            for (const img of images) {
                context.drawImage(img, 0, yOffset, img.width, img.height);
                yOffset += img.height;
            }

            return canvas;
        }

        function updateOverlayLines() {
            const container = document.querySelector('.content-detail');
            if (!container) return;

            container.querySelectorAll('.overlay-line').forEach((line) => line.remove());

            const images = container.querySelectorAll('img');
            for (let i = 0; i < images.length - 1; i++) {
                const currentImage = images[i];
                const nextImage = images[i + 1];

                const gap = nextImage.offsetTop - (currentImage.offsetTop + currentImage.offsetHeight);

                if (gap <= 10) {
                    const overlay = document.createElement('div');
                    overlay.className = 'overlay-line';
                    overlay.style.top = `${currentImage.offsetTop + currentImage.offsetHeight - container.scrollTop}px`;
                    overlay.style.width = `${currentImage.offsetWidth}px`;
                    container.appendChild(overlay);
                }
            }
        }

        document.addEventListener('scroll', updateOverlayLines);

        window.addEventListener('load', () => {
            window.setTimeout(() => {
                addOverlayLines();
            }, 500);
        });
    }

    function imgSizeCheck(){

        var allImages = [];
        var targetElement = document.querySelector('.col-xs-4.col-sm-6.col-md-5.col-lg-4');
        var hasRedBorder = false;

        function checkForImages(node) {
            if (node.nodeType === 1 && node.tagName === 'IMG') {
                if (node.complete) {
                    processImage(node);
                } else {
                    node.addEventListener('load', function() {
                        processImage(node);
                    });
                }
            } else if (node.nodeType === 1 && node.hasChildNodes()) {
                node.childNodes.forEach(checkForImages);
            }
        }

        function processImage(img) {
            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                setTimeout(() => processImage(img), 100);
                return;
            }

            if (isExcludedStructure(img)) {
                return;
            }

            removeExistingSizeInfo(img);
            displayImageSize(img);
            updateImageList();
            addRedBorderIfNeeded();
            updateButtonDisplay();
        }

        function isExcludedStructure(img) {
            return img.closest('ul.list-group') !== null;
        }

        function removeExistingSizeInfo(img) {
            var parent = img.parentNode;
            var existingSizeInfo = parent.querySelector('.size-info');
            if (existingSizeInfo) {
                parent.removeChild(existingSizeInfo);
            }
        }

        function displayImageSize(img) {
            var sizeInfo = document.createElement('div');
            sizeInfo.className = 'size-info';
            sizeInfo.textContent = img.naturalWidth + '×' + img.naturalHeight;

            var parent = img.parentNode;
            parent.style.position = 'relative';
            parent.appendChild(sizeInfo);
        }

        function updateImageList() {
            allImages = [];
            var images = targetElement.querySelectorAll('img');
            images.forEach(img => {
                if (img.naturalWidth !== 0 && img.naturalHeight !== 0) {
                    allImages.push({
                        element: img,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });
                }
            });
        }

        function addRedBorderIfNeeded() {
            hasRedBorder = false;

            if (allImages.length < 2) {
                allImages.forEach(img => {
                    var redBorder = img.width < 500 || img.height / img.width > 1.5;
                    img.element.style.border = redBorder ? '2px solid red' : 'none';
                    if (redBorder) hasRedBorder = true;
                });
                return;
            }

            var minWidth = Math.min(...allImages.map(img => img.width));
            var maxWidth = Math.max(...allImages.map(img => img.width));
            var widthDifference = maxWidth / minWidth > 2;

            allImages.forEach(img => {
                var redBorder = img.width < 500 ||
                    (widthDifference && (img.width === minWidth || img.width === maxWidth)) ||
                    (img.height / img.width > 1.5);
                img.element.style.border = redBorder ? '2px solid red' : 'none';
                if (redBorder) hasRedBorder = true;
            });
        }

        function updateButtonDisplay() {
            const targetButton = document.querySelector('button.btn.btn-primary.btn-lg.fullWidth.vMiddle.mb10');
            if (!targetButton) return;

            if (hasRedBorder) {
                targetButton.innerHTML = `⚠️注意⚠️ サイズ修正が必要な画像があります<br><i class="fa fa-floppy-o"></i> 強制的に保存する`;

                const originalClickHandler = targetButton.onclick;
                const existingOverlayButton = targetButton.parentElement.querySelector('.overlay-button');
                if (existingOverlayButton) {
                    existingOverlayButton.remove();
                }

                const overlayButton = document.createElement('button');
                overlayButton.classList.add('overlay-button');
                targetButton.parentElement.appendChild(overlayButton);

                overlayButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    showCustomAlert(
                        'サイズの修正が必要な画像がありますが、本当にこのまま保存しますか？',
                        function() {
                            if (originalClickHandler) {
                                originalClickHandler.call(targetButton);
                            } else {
                                targetButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            }
                        }
                    );
                }, true);
            } else {
                targetButton.innerHTML = '<i class="fa fa-floppy-o"></i> 保存';
                const overlayButton = targetButton.parentElement.querySelector('.overlay-button');
                if (overlayButton) {
                    overlayButton.remove();
                }
            }
        }

        function showCustomAlert(message, onConfirm) {
            const overlay = document.createElement('div');
            overlay.classList.add('custom-alert-overlay');

            const alertBox = document.createElement('div');
            alertBox.classList.add('custom-alert-box');

            const title = document.createElement('div');
            title.classList.add('custom-alert-title');
            title.textContent = '⚠️ 警告 ⚠️';
            alertBox.appendChild(title);

            const alertMessage = document.createElement('div');
            alertMessage.classList.add('custom-alert-message');
            alertMessage.textContent = message;
            alertBox.appendChild(alertMessage);

            const confirmButton = document.createElement('button');
            confirmButton.classList.add('custom-alert-button');
            confirmButton.textContent = 'このまま保存する';
            confirmButton.addEventListener('click', function() {
                document.body.removeChild(overlay);
                if (onConfirm) onConfirm();
            });
            alertBox.appendChild(confirmButton);

            const cancelButton = document.createElement('button');
            cancelButton.classList.add('custom-alert-button');
            cancelButton.textContent = 'キャンセル';
            cancelButton.addEventListener('click', function() {
                document.body.removeChild(overlay);
            });
            alertBox.appendChild(cancelButton);

            overlay.appendChild(alertBox);
            document.body.appendChild(overlay);
        }

        function init() {
            targetElement.querySelectorAll('img').forEach(checkForImages);

            updateImageList();
            addRedBorderIfNeeded();
            updateButtonDisplay();

            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            checkForImages(node);
                        });
                    }
                    if (mutation.removedNodes.length || mutation.type === 'attributes') {
                        updateImageList();
                        addRedBorderIfNeeded();
                        if (mutation.target.tagName === 'IMG') {
                            processImage(mutation.target);
                        }
                        updateButtonDisplay();
                    }
                });
            });

            observer.observe(targetElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
        }

        const style = document.createElement('style');
        style.textContent = `
        .col-lg-1-5.col-md-3.col-sm-4.col-xs-12.mb10.grid-img { margin-bottom: 1px !important; }
        .size-info {
            position: absolute;
            bottom: 35px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 12px;
            padding: 1px 4px;
            text-align: center;
            pointer-events: none;
            border-radius: 5px;
        }
        .custom-alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .custom-alert-box {
            background-color: #cccccc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-family: sans-serif;
            width: 300px;
        }
        .custom-alert-title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
        }
        .custom-alert-message {
            margin-bottom: 20px;
            font-size: 14px;
        }
        .custom-alert-button {
            padding: 8px 16px;
            margin: 5px;
            border: 1px solid #000;
            border-radius: 5px;
            background-color: #f0f0f0;
            font-size: 14px;
            cursor: pointer;
        }
        .custom-alert-button:hover { background-color: #e0e0e0; }
        .overlay-button {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: 10001;
            cursor: pointer;
            border: none;
            outline: none;
        }
    `;
        document.head.appendChild(style);

        if (targetElement) {
            init();
        }
    }

    function enhanceNewAlpha(){

        const css = `
        .zoomed-image {
            position: absolute;
            border: 7px solid #191919;
            z-index: 10000;
            pointer-events: none;
            display: none;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s;
        }

        .settings-icon {
            position: fixed;
            right: 20px;
            bottom: 20px;
            font-size: 24px;
            cursor: pointer;
            z-index: 1001;
        }

        .settings-menu {
            position: fixed;
            right: 20px;
            bottom: 60px;
            border: 1px solid #ccc;
            background: white;
            padding: 10px;
            box-shadow: 0px 0px 5px rgba(0,0,0,0.5);
            display: none;
            z-index: 1002;
            max-width: 300px;
        }

        .settings-label {
            margin-bottom: 10px;
            font-weight: bold;
        }

        .settings-input-label {
            font-weight: normal;
            margin-right: 10px;
            white-space: nowrap;
        }

        .settings-input-label.shift-right {
            margin-right: 18.5px;
        }

        .settings-input {
            width: 80px;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            vertical-align: middle;
        }

        .mode-option {
            cursor: pointer;
            padding: 5px;
            border: 1px solid #ccc;
            margin-bottom: 5px;
            text-align: center;
            background: #fff;
            color: black;
            transition: background 0.3s;
        }

        .mode-option.hover {
            background: #f1f1f1;
        }

        .mode-option.selected {
            background: #007bff;
            color: white;
        }

        .zoom-position-option {
            cursor: pointer;
            padding: 5px;
            border: 1px solid #ccc;
            margin-bottom: 5px;
            text-align: center;
            background: #fff;
            color: black;
            transition: background 0.3s;
        }

        .zoom-position-option.hover {
            background: #f1f1f1;
        }

        .zoom-position-option.selected {
            background: #007bff;
            color: white;
        }

        .settings-input {
            width: 60px;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            margin-right: 5px;
        }

        .settings-input-label {
            font-weight: normal;
            margin-right: 20px;
        }

        .transparency-slider {
            width: 100%;
            margin-top: 10px;
        }

        .reset-button {
            cursor: pointer;
            padding: 10px;
            border: 1px solid;
            background: #4CAF50;
            color: white;
            text-align: center;
            margin-top: 10px;
            transition: background 0.3s, border 0.3s;
        }

        .reset-button:hover {
            background: #45a049;
            border-color: #45a049;
        }

        .reset-button.disabled {
            background: #e0e0e0;
            border-color: #bbb;
            color: #555;
            cursor: default;
        }

        .reset-button.enabled {
            background: #4CAF50;
            border-color: #4CAF50;
        }

    `;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        //タブタイトル変更
        let path = window.location.pathname;
        let productID = path.split('/').pop();
        document.title = `${productID} / Plusnao Web System`;

        // テンプレ画像機能
        var newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.className = 'btn btn-sm btn-default';
        newButton.innerHTML = '<i class="fa fa-new-icon"></i>テンプレート画像';

        var defaultStyles = {
            webkitTextSizeAdjust: '100%',
            webkitTapHighlightColor: 'rgba(0,0,0,0)',
            boxSizing: 'border-box',
            margin: '0 5px',
            font: 'inherit',
            overflow: 'visible',
            textTransform: 'none',
            webkitAppearance: 'button',
            fontFamily: 'inherit',
            display: 'inline-block',
            marginBottom: '0',
            fontWeight: '400',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            touchAction: 'manipulation',
            cursor: 'pointer',
            userSelect: 'none',
            backgroundImage: 'none',
            border: '1px solid transparent',
            color: '#333',
            backgroundColor: '#fff',
            borderColor: '#ccc',
            padding: '5px 10px',
            fontSize: '12px',
            lineHeight: '1.5',
            borderRadius: '3px',
            outline: 'none'
        };

        var pressedStyles = {
            backgroundColor: '#e6e6e6',
            borderColor: '#adadad',
            outline: '5px auto -webkit-focus-ring-color',
            outlineOffset: '-2px'
        };

        function applyStyles(element, styles) {
            for (var property in styles) {
                if (styles.hasOwnProperty(property)) {
                    element.style[property] = styles[property];
                }
            }
        }

        function handleEscKey(event) {
            if (event.key === 'Escape') {
                var existingModal = document.querySelector('#image-modal');
                if (existingModal) {
                    document.body.removeChild(existingModal);
                    applyStyles(newButton, defaultStyles);
                }
            }
        }

        function showModalWithImages(imageUrls) {
            var existingModal = document.querySelector('#image-modal');
            if (existingModal) {
                document.body.removeChild(existingModal);
                applyStyles(newButton, defaultStyles);
                return;
            }

            var modal = document.createElement('div');
            modal.id = 'image-modal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.right = '10px';
            modal.style.transform = 'translateY(-50%)';
            modal.style.width = '400px';
            modal.style.backgroundColor = '#fff';
            modal.style.padding = '20px';
            modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            modal.style.zIndex = '1000';
            modal.style.borderRadius = '5px';
            modal.style.overflowY = 'auto';
            modal.style.maxHeight = '90%';
            modal.style.display = 'grid';
            modal.style.gridTemplateColumns = 'repeat(4, 1fr)';
            modal.style.gap = '10px';
            modal.style.border = '2px solid #ccc';

            imageUrls.forEach(function(url) {
                var img = document.createElement('img');
                img.src = url;
                img.draggable = true;
                img.className = 'w80 img-thumbnail';
                img.title = '';
                img.style.display = 'block';
                img.style.marginBottom = '10px';
                img.style.cursor = 'pointer';
                modal.appendChild(img);

                img.addEventListener('dblclick', function() {
                    var uploadArea = document.querySelector('#uploadArea');
                    if (uploadArea) {
                        fetch(url)
                            .then(res => res.blob())
                            .then(blob => {
                            var file = new File([blob], url.split('/').pop(), { type: blob.type });

                            var dataTransfer = new DataTransfer();
                            dataTransfer.items.add(file);

                            ['dragenter', 'dragover', 'drop'].forEach(eventType => {
                                var event = new DragEvent(eventType, {
                                    bubbles: true,
                                    cancelable: true,
                                    dataTransfer: dataTransfer
                                });
                                uploadArea.dispatchEvent(event);
                            });
                        });
                    }
                });
            });

            var closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.gridColumn = 'span 4';
            closeButton.style.marginTop = '10px';
            closeButton.style.padding = '5px 10px';
            closeButton.style.border = 'none';
            closeButton.style.backgroundColor = '#c9302c';
            closeButton.style.color = '#fff';
            closeButton.style.borderRadius = '3px';
            closeButton.style.cursor = 'pointer';

            closeButton.addEventListener('click', function() {
                document.body.removeChild(modal);
                applyStyles(newButton, defaultStyles);
            });

            modal.appendChild(closeButton);
            document.body.appendChild(modal);
            applyStyles(newButton, pressedStyles);

            window.addEventListener('keydown', handleEscKey);
        }

        newButton.addEventListener('click', function() {
            var existingModal = document.querySelector('#image-modal');
            if (existingModal) {
                document.body.removeChild(existingModal);
                applyStyles(newButton, defaultStyles);
                return;
            }

            var repoOwner = 'NEL227';
            var repoName = 'my-data-repo';
            var directoryPath = 'images';

            fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directoryPath}`)
                .then(response => response.json())
                .then(data => {
                var imageUrls = data.filter(file => file.type === 'file' && file.name.match(/\.jpg$/i))
                .map(file => file.download_url);
                showModalWithImages(imageUrls);
            });
        });

        var uploadSpan = document.querySelector('.panel-heading .clearfix .pull-left.inputHeight');
        uploadSpan.parentNode.insertBefore(newButton, uploadSpan.nextSibling);

        //画像拡大機能
        let zoomMode = localStorage.getItem('zoomMode') || 'ctrlHover';
        let zoomPosition = localStorage.getItem('zoomPosition') || 'mouse';
        let maxWidth = localStorage.getItem('maxWidth') || 600;
        let maxHeight = localStorage.getItem('maxHeight') || 600;
        let zoomOpacity = localStorage.getItem('zoomOpacity') || 100;
        let delay = localStorage.getItem('delay') || 350;
        const defaultWidth = 600;
        const defaultHeight = 600;
        const defaultOpacity = 100;
        let ctrlPressed = false;
        let hoveredImage = null;
        let lastMouseEvent = null;
        let zoomTimeout = null;
        let mouseOnImage = false;
        let currentImage = null;
        let lastImage = null;
        let clickHandled = false;
        let clickDuringDelay = false;
        let firstZoom = false;

        const zoomedImage = document.createElement('img');
        zoomedImage.className = 'zoomed-image';
        zoomedImage.style.opacity = zoomOpacity / 100;
        document.body.appendChild(zoomedImage);

        function createSettingsMenu() {
            const settingsIcon = document.createElement('div');
            settingsIcon.innerHTML = '⚙️';
            settingsIcon.className = 'settings-icon';
            document.body.appendChild(settingsIcon);

            const settingsMenu = document.createElement('div');
            settingsMenu.className = 'settings-menu';
            settingsMenu.style.display = 'none';
            document.body.appendChild(settingsMenu);

            const zoomModeLabel = document.createElement('div');
            zoomModeLabel.innerText = '拡大モード';
            zoomModeLabel.className = 'settings-label';
            settingsMenu.appendChild(zoomModeLabel);

            const modes = [
                { id: 'always', text: '常に拡大（Ctrlやクリックで非表示）' },
                { id: 'ctrlHover', text: 'Ctrlを押しながら拡大' },
                { id: 'noZoom', text: '拡大しない' }
            ];

            modes.forEach(mode => {
                const modeOption = document.createElement('div');
                modeOption.innerText = mode.text;
                modeOption.className = 'mode-option';
                modeOption.dataset.mode = mode.id;

                if (mode.id === zoomMode) {
                    modeOption.classList.add('selected');
                }

                modeOption.onmouseover = () => {
                    modeOption.classList.add('hover');
                };

                modeOption.onmouseout = () => {
                    modeOption.classList.remove('hover');
                };

                modeOption.onclick = () => {
                    zoomMode = mode.id;
                    localStorage.setItem('zoomMode', zoomMode);
                    updateZoomMode();
                    updateSelectedOptions();
                };

                settingsMenu.appendChild(modeOption);
            });

            const zoomPositionLabel = document.createElement('div');
            zoomPositionLabel.innerText = '拡大画像の表示位置';
            zoomPositionLabel.className = 'settings-label';
            zoomPositionLabel.style.marginTop = '10px';
            zoomPositionLabel.style.marginBottom = '10px';
            settingsMenu.appendChild(zoomPositionLabel);

            const positions = [
                { id: 'mouse', text: 'カーソル' },
                { id: 'right', text: '画面隅' }
            ];

            positions.forEach(position => {
                const positionOption = document.createElement('div');
                positionOption.innerText = position.text;
                positionOption.className = 'zoom-position-option';
                positionOption.dataset.position = position.id;

                if (position.id === zoomPosition) {
                    positionOption.classList.add('selected');
                }

                positionOption.onmouseover = () => {
                    positionOption.classList.add('hover');
                };

                positionOption.onmouseout = () => {
                    positionOption.classList.remove('hover');
                };

                positionOption.onclick = () => {
                    zoomPosition = position.id;
                    localStorage.setItem('zoomPosition', zoomPosition);
                    updateSelectedOptions();
                };

                settingsMenu.appendChild(positionOption);
            });

            const maxSizeLabel = document.createElement('div');
            maxSizeLabel.innerText = '拡大サイズ（最大）';
            maxSizeLabel.className = 'settings-label';
            maxSizeLabel.style.marginTop = '10px';
            settingsMenu.appendChild(maxSizeLabel);

            const sizeContainer = document.createElement('div');
            sizeContainer.style.display = 'flex';
            sizeContainer.style.marginTop = '10px';

            const maxWidthLabel = document.createElement('span');
            maxWidthLabel.innerText = '横：';
            maxWidthLabel.className = 'settings-input-label';
            maxWidthLabel.style.paddingTop = '6px';
            sizeContainer.appendChild(maxWidthLabel);

            const maxWidthInput = document.createElement('input');
            maxWidthInput.type = 'number';
            maxWidthInput.value = maxWidth;
            maxWidthInput.className = 'settings-input';
            maxWidthInput.min = '50';
            maxWidthInput.max = '3000';
            maxWidthInput.step = '50';
            maxWidthInput.addEventListener('input', () => {
                maxWidth = maxWidthInput.value;
                localStorage.setItem('maxWidth', maxWidth);
                updateZoomSize();
                zoomedImage.style.display = 'none';
            });
            sizeContainer.appendChild(maxWidthInput);

            const maxHeightLabel = document.createElement('span');
            maxHeightLabel.innerText = '縦：';
            maxHeightLabel.className = 'settings-input-label';
            maxHeightLabel.style.paddingTop = '6px';
            maxHeightLabel.style.marginLeft = '13px';
            sizeContainer.appendChild(maxHeightLabel);

            const maxHeightInput = document.createElement('input');
            maxHeightInput.type = 'number';
            maxHeightInput.value = maxHeight;
            maxHeightInput.className = 'settings-input';
            maxHeightInput.min = '50';
            maxHeightInput.max = '3000';
            maxHeightInput.step = '50';
            maxHeightInput.addEventListener('input', () => {
                maxHeight = maxHeightInput.value;
                localStorage.setItem('maxHeight', maxHeight);
                updateZoomSize();
                zoomedImage.style.display = 'none';
            });
            sizeContainer.appendChild(maxHeightInput);

            settingsMenu.appendChild(sizeContainer);

            const delayContainer = document.createElement('div');
            delayContainer.style.display = 'flex';
            delayContainer.style.marginTop = '10px';
            const delayLabel = document.createElement('span');
            delayLabel.innerText = '拡大までの遅延（ms）：';
            delayLabel.style.fontWeight = 'bold';
            delayLabel.className = 'settings-input-label';
            delayLabel.style.paddingTop = '6px';
            delayContainer.appendChild(delayLabel);

            const delayInput = document.createElement('input');
            delayInput.type = 'number';
            delayInput.value = delay;
            delayInput.className = 'settings-input';
            delayInput.min = '0';
            delayInput.max = '5000';
            delayInput.step = '50';
            delayInput.addEventListener('input', () => {
                delay = delayInput.value;
                localStorage.setItem('delay', delay);
            });
            delayContainer.appendChild(delayInput);

            settingsMenu.appendChild(delayContainer);

            const transparencyLabel = document.createElement('div');
            transparencyLabel.innerText = '拡大画像の不透明度';
            transparencyLabel.className = 'settings-label';
            transparencyLabel.style.marginTop = '10px';
            settingsMenu.appendChild(transparencyLabel);

            const transparencySlider = document.createElement('input');
            transparencySlider.type = 'range';
            transparencySlider.className = 'transparency-slider';
            transparencySlider.min = '0';
            transparencySlider.max = '100';
            transparencySlider.value = zoomOpacity;

            const tooltip = document.createElement('div');
            tooltip.className = 'slider-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '2px 5px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.display = 'none';
            tooltip.style.zIndex = '10000';
            document.body.appendChild(tooltip);

            transparencySlider.addEventListener('input', (event) => {
                zoomOpacity = transparencySlider.value;
                localStorage.setItem('zoomOpacity', zoomOpacity);
                zoomedImage.style.opacity = zoomOpacity / 100;

                const rect = transparencySlider.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX + (transparencySlider.value / transparencySlider.max) * rect.width - 15}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 25}px`;
                tooltip.innerText = `${zoomOpacity}%`;
                tooltip.style.display = 'block';
            });

            transparencySlider.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });

            settingsMenu.appendChild(transparencySlider);

            const defaultWidth = 600;
            const defaultHeight = 600;
            const defaultDelay = 350;

            const resetButton = document.createElement('div');
            resetButton.innerText = '拡大サイズと遅延をデフォルトに戻す';
            resetButton.className = 'reset-button';

            function updateResetButtonState() {
                const currentWidth = parseInt(maxWidthInput.value, 10);
                const currentHeight = parseInt(maxHeightInput.value, 10);
                const currentDelay = parseInt(delayInput.value, 10);

                if (currentWidth !== defaultWidth || currentHeight !== defaultHeight || currentDelay !== defaultDelay) {
                    resetButton.classList.remove('disabled');
                    resetButton.classList.add('enabled');
                } else {
                    resetButton.classList.remove('enabled');
                    resetButton.classList.add('disabled');
                }
            }

            resetButton.onclick = () => {
                maxWidth = defaultWidth;
                maxHeight = defaultHeight;
                delay = defaultDelay;
                localStorage.setItem('maxWidth', maxWidth);
                localStorage.setItem('maxHeight', maxHeight);
                localStorage.setItem('delay', delay);
                maxWidthInput.value = maxWidth;
                maxHeightInput.value = maxHeight;
                delayInput.value = delay;
                updateZoomSize();
                zoomedImage.style.opacity = zoomOpacity / 100;
                updateResetButtonState();
            };

            maxWidthInput.addEventListener('input', updateResetButtonState);
            maxHeightInput.addEventListener('input', updateResetButtonState);
            delayInput.addEventListener('input', updateResetButtonState);

            settingsMenu.appendChild(resetButton);
            updateResetButtonState();

            updateSelectedOptions();
            settingsIcon.onclick = () => {
                settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
            };

            document.addEventListener('mouseenter', () => {
                if (zoomMode === 'always') {
                    zoomTimeout = setTimeout(() => {
                        if (!clickDuringDelay) {
                            zoomedImage.style.display = 'block';
                        }
                    }, delay);
                }
            });

            document.addEventListener('mousedown', (event) => {
                if (zoomMode === 'always' && event.button === 0) {
                    clearTimeout(zoomTimeout);
                    clickDuringDelay = true;

                    zoomedImage.style.display = 'none';
                }
            });

            document.addEventListener('mouseup', (event) => {
                if (zoomMode === 'always' && event.button === 0) {
                    zoomedImage.style.display = 'none';
                }
            });

            document.addEventListener('mouseleave', () => {
                clearTimeout(zoomTimeout);
                clickDuringDelay = false;
                zoomedImage.style.display = 'none';
            });

            document.addEventListener('mousemove', () => {
                if (clickDuringDelay) {
                    clickDuringDelay = false;
                }
            });

            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            document.addEventListener('mouseout', onMouseOut);
        }

        function updateZoomMode() {
            if (zoomMode === 'noZoom') {
                zoomedImage.style.display = 'none';
            } else {
                zoomedImage.style.display = 'block';
            }
        }

        function updateZoomSize() {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const maxAllowedWidth = windowWidth * 0.9;
            const maxAllowedHeight = windowHeight * 0.98;

            const finalWidth = Math.min(maxWidth, maxAllowedWidth);
            const finalHeight = Math.min(maxHeight, maxAllowedHeight);

            zoomedImage.style.maxWidth = finalWidth + 'px';
            zoomedImage.style.maxHeight = finalHeight + 'px';
        }

        function updateSelectedOptions() {
            const modeOptions = document.querySelectorAll('.mode-option');
            modeOptions.forEach(option => {
                if (option.dataset.mode === zoomMode) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });

            const inputs = document.querySelectorAll('.settings-input, .settings-label, .transparency-slider, .reset-button');
            const positionOptions = document.querySelectorAll('.zoom-position-option');
            positionOptions.forEach(option => {
                if (option.dataset.position === zoomPosition) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });

            const labels = document.querySelectorAll('.settings-input-label');
            let delayLabel, delayInput;

            labels.forEach(label => {
                if (label.textContent.includes('拡大までの遅延（ms）：')) {
                    delayLabel = label;
                    delayInput = label.nextElementSibling;
                }
            });

            if (zoomMode === 'noZoom') {
                labels.forEach(label => {
                    if (label.innerText !== '拡大モード') {
                        label.style.display = 'none';
                    }
                });

                positionOptions.forEach(option => {
                    option.style.display = 'none';
                });

                inputs.forEach(input => {
                    input.style.display = 'none';
                });

            } else {
                labels.forEach(label => {
                    label.style.display = 'block';
                });

                positionOptions.forEach(option => {
                    option.style.display = 'block';
                });

                inputs.forEach(input => {
                    input.style.display = 'block';
                });

                if (zoomMode === 'ctrlHover') {
                    labels.forEach(label => {
                        if (label.textContent.includes('拡大までの遅延（ms）：')) {
                            label.style.display = 'none';
                            label.nextElementSibling.style.display = 'none';
                        }
                    });
                }
            }

            updateZoomMode();
            updateZoomPosition();

            zoomedImage.style.display = 'none';
        }

        function onMouseMove(event) {
            lastMouseEvent = event;

            if (zoomMode === 'always') {
                if (ctrlPressed || event.buttons !== 0) {
                    clearTimeout(zoomTimeout);
                    zoomedImage.style.display = 'none';
                    if (currentImage) {
                        currentImage.style.opacity = '';
                    }
                    currentImage = null;
                    return;
                }

                if (!firstZoom) {
                    clearTimeout(zoomTimeout);
                    if (event.target.tagName === 'IMG') {
                        currentImage = event.target;
                        hoveredImage = event.target;
                        zoomedImage.src = event.target.src;
                        event.target.style.opacity = '0.5';

                        zoomTimeout = setTimeout(() => {
                            zoomedImage.style.display = 'block';
                            updateZoomPosition();
                            if (zoomPosition === 'mouse') {
                                adjustZoomPosition(event);
                            }
                            currentImage.style.opacity = '';
                            firstZoom = true;
                        }, delay);
                    } else {
                        zoomedImage.style.display = 'none';
                        if (currentImage) {
                            currentImage.style.opacity = '';
                        }
                        currentImage = null;
                    }
                } else {
                    if (event.target.tagName === 'IMG') {
                        currentImage = event.target;
                        hoveredImage = event.target;
                        zoomedImage.src = event.target.src;
                        zoomedImage.style.display = 'block';
                        updateZoomPosition();
                        if (zoomPosition === 'mouse') {
                            adjustZoomPosition(event);
                        }
                        currentImage.style.opacity = '';
                    } else {
                        zoomedImage.style.display = 'none';
                        if (currentImage) {
                            currentImage.style.opacity = '';
                        }
                        currentImage = null;
                    }
                }
                return;
            }

            if (zoomMode === 'ctrlHover' && ctrlPressed) {
                if (event.target.tagName === 'IMG') {
                    clearTimeout(zoomTimeout);
                    currentImage = event.target;
                    hoveredImage = event.target;
                    zoomedImage.src = event.target.src;
                    event.target.style.opacity = '0.5';

                    zoomedImage.style.display = 'block';
                    updateZoomPosition();
                    if (zoomPosition === 'mouse') {
                        adjustZoomPosition(event);
                    }
                    currentImage.style.opacity = '';
                } else {
                    zoomedImage.style.display = 'none';
                    if (currentImage) {
                        currentImage.style.opacity = '';
                    }
                    currentImage = null;
                }
                return;
            }

            if (zoomMode === 'ctrlHover' && !ctrlPressed) {
                clearTimeout(zoomTimeout);
                zoomedImage.style.display = 'none';
                if (currentImage) {
                    currentImage.style.opacity = '';
                }
                currentImage = null;
                return;
            }

            if (zoomMode === 'always' || (zoomMode === 'ctrlHover' && ctrlPressed)) {
                if (event.target.tagName === 'IMG') {
                    if (clickHandled) {
                        if (lastImage !== event.target) {
                            clearTimeout(zoomTimeout);
                            currentImage = event.target;
                            hoveredImage = event.target;
                            zoomedImage.src = event.target.src;
                            event.target.style.opacity = '0.5';

                            zoomTimeout = setTimeout(() => {
                                zoomedImage.style.display = 'block';
                                updateZoomPosition();
                                if (zoomPosition === 'mouse') {
                                    adjustZoomPosition(event);
                                }
                                currentImage.style.opacity = '';
                                lastImage = event.target;
                                clickHandled = false;
                                firstZoom = false;
                            }, firstZoom ? delay : 0);

                        }
                    } else {
                        if (currentImage !== event.target) {
                            clearTimeout(zoomTimeout);
                            currentImage = event.target;
                            hoveredImage = event.target;
                            zoomedImage.src = event.target.src;
                            event.target.style.opacity = '0.5';

                            zoomTimeout = setTimeout(() => {
                                zoomedImage.style.display = 'block';
                                updateZoomPosition();
                                if (zoomPosition === 'mouse') {
                                    adjustZoomPosition(event);
                                }
                                currentImage.style.opacity = '';
                            }, firstZoom ? delay : 0);
                        } else {
                            if (zoomMode === 'always' && !ctrlPressed && event.buttons === 0) {
                                mouseOnImage = true;
                                clearTimeout(zoomTimeout);
                                zoomTimeout = setTimeout(() => {
                                    zoomedImage.style.display = 'block';
                                    updateZoomPosition();
                                    if (zoomPosition === 'mouse') {
                                        adjustZoomPosition(event);
                                    }
                                    currentImage.style.opacity = '';
                                }, firstZoom ? delay : 0);
                            } else if (zoomMode === 'ctrlHover' && ctrlPressed) {
                                zoomedImage.style.display = 'block';
                                updateZoomPosition();
                                if (zoomPosition === 'mouse') {
                                    adjustZoomPosition(event);
                                }
                                currentImage.style.opacity = '';
                            }
                        }
                    }
                } else {
                    clearTimeout(zoomTimeout);
                    zoomedImage.style.display = 'none';
                    if (currentImage) {
                        currentImage.style.opacity = '';
                    }
                    currentImage = null;
                    mouseOnImage = false;
                }

                if (ctrlPressed && zoomMode === 'always' && currentImage) {
                    currentImage.style.opacity = '';
                }

                if (zoomedImage.style.display === 'block') {
                    updateZoomPosition();
                    if (zoomPosition === 'mouse') {
                        adjustZoomPosition(event);
                    }
                }
            } else {
                clearTimeout(zoomTimeout);
                zoomedImage.style.display = 'none';
                if (currentImage) {
                    currentImage.style.opacity = '';
                }
                currentImage = null;
                mouseOnImage = false;
            }
        }

        function adjustZoomPosition(event) {
            if (zoomPosition === 'right') {
                return;
            }

            const zoomWidth = zoomedImage.clientWidth;
            const zoomHeight = zoomedImage.clientHeight;

            let top = event.pageY + 15;
            let left = event.pageX + 25;

            const maxTop = window.innerHeight - zoomHeight - 20;
            const maxLeft = window.innerWidth - zoomWidth - 20;

            if (left + zoomWidth > window.innerWidth) {
                left = event.pageX - zoomWidth - 25;
            }

            if (top > maxTop) {
                top = maxTop;
            }
            if (top < 0) {
                top = 0;
            }
            if (left > maxLeft) {
                left = maxLeft;
            }
            if (left < 0) {
                left = 0;
            }

            zoomedImage.style.top = top + 'px';
            zoomedImage.style.left = left + 'px';
            zoomedImage.style.right = 'auto';
        }

        const imageModal = document.getElementById('image-modal');

        let isMouseOverModal = false;

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.id === 'image-modal') {
                        setupImageModalEvents(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        function setupImageModalEvents(imageModal) {
            imageModal.addEventListener('mouseenter', () => {
                isMouseOverModal = true;
                updateZoomPosition();
            });

            imageModal.addEventListener('mouseleave', () => {
                isMouseOverModal = false;
                updateZoomPosition();
            });
        }

        function updateZoomPosition() {
            if (zoomPosition === 'right') {
                if (isMouseOverModal) {
                    zoomedImage.style.left = '10px';
                    zoomedImage.style.right = 'auto';
                    zoomedImage.style.top = '10px';
                    zoomedImage.style.bottom = 'auto';
                } else {
                    zoomedImage.style.left = 'auto';
                    zoomedImage.style.right = '10px';
                    zoomedImage.style.top = '10px';
                    zoomedImage.style.bottom = 'auto';
                }
            } else if (zoomPosition === 'mouse') {
                zoomedImage.style.left = '0';
                zoomedImage.style.right = 'auto';
                zoomedImage.style.top = 'auto';
                zoomedImage.style.bottom = 'auto';
            }
        }

        function onMouseDown(event) {
            if (zoomMode === 'always') {
                firstZoom = false;
                event.target.style.opacity = '';
            }
        }

        function onMouseOut(event) {
            if (event.target.tagName === 'IMG') {
                event.target.style.opacity = '';
                clearTimeout(zoomTimeout);
                zoomedImage.style.display = 'none';
            }
        }

        function onKeyDown(event) {
            if (event.key === 'Control') {
                ctrlPressed = true;
                if (zoomMode === 'always') {
                    zoomedImage.style.display = 'none';
                    clearTimeout(zoomTimeout);
                } else if (zoomMode === 'ctrlHover' && lastMouseEvent && lastMouseEvent.target.tagName === 'IMG') {
                    onMouseMove(lastMouseEvent);
                }
            }
        }

        function onKeyUp(event) {
            if (event.key === 'Control') {
                ctrlPressed = false;
                if (zoomMode === 'always' && hoveredImage) {
                    zoomedImage.src = hoveredImage.src;
                    zoomedImage.style.display = 'block';
                    if (lastMouseEvent) {
                        onMouseMove(lastMouseEvent);
                    }
                } else if (zoomMode === 'ctrlHover') {
                    zoomedImage.style.display = 'none';
                }
            }
        }

        createSettingsMenu();
        updateZoomMode();
        updateZoomSize();
        updateZoomPosition();
    }

    function orderStatusCheck(){

        const url = window.location.href;
        const codeMatch = url.match(/\/([^\/]+)$/);
        const code = codeMatch ? codeMatch[1] : null;
        if (!code) return;

        const stockStatusKey = 'outOfStockStatus_' + code;

        if (url.includes('/mainedit/') || url.includes('/registered_mainedit/')) {
            const targetTable = document.getElementById('stockSettingTable');
            if (!targetTable) return;

            const container = document.createElement('div');
            container.style.marginBottom = '10px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '10px';

            const checkbox1 = document.createElement('input');
            checkbox1.type = 'checkbox';
            checkbox1.id = 'outOfStock';
            checkbox1.style.transform = 'scale(1.1)';
            checkbox1.style.margin = '0';

            const label1 = document.createElement('label');
            label1.htmlFor = 'outOfStock';
            label1.textContent = '欠品あり';
            label1.style.fontSize = '1.1em';

            const checkbox2 = document.createElement('input');
            checkbox2.type = 'checkbox';
            checkbox2.id = 'inStock';
            checkbox2.style.transform = 'scale(1.1)';
            checkbox2.style.margin = '0';

            const label2 = document.createElement('label');
            label2.htmlFor = 'inStock';
            label2.textContent = '欠品なし';
            label2.style.fontSize = '1.1em';

            container.appendChild(checkbox1);
            container.appendChild(label1);
            container.appendChild(checkbox2);
            container.appendChild(label2);

            targetTable.parentNode.insertBefore(container, targetTable);

            const savedStatus = sessionStorage.getItem(stockStatusKey);
            if (savedStatus === 'true') checkbox1.checked = true;
            if (savedStatus === 'false') checkbox2.checked = true;

            checkbox1.addEventListener('change', () => {
                if (checkbox1.checked) {
                    checkbox2.checked = false;
                    sessionStorage.setItem(stockStatusKey, 'true');
                } else if (!checkbox2.checked) {
                    sessionStorage.removeItem(stockStatusKey);
                }
            });

            checkbox2.addEventListener('change', () => {
                if (checkbox2.checked) {
                    checkbox1.checked = false;
                    sessionStorage.setItem(stockStatusKey, 'false');
                } else if (!checkbox1.checked) {
                    sessionStorage.removeItem(stockStatusKey);
                }
            });
        }

        if (url.includes('/sku_check/')) {
            const saved = sessionStorage.getItem(stockStatusKey);
            const formDot = document.querySelector('.formdot');
            if (!formDot) return;

            const display = document.createElement('div');
            display.textContent = `[${code}] 欠品状態: ` + (
                saved === 'true' ? 'あり' :
                saved === 'false' ? 'なし' :
                '未選択'
            );
            display.style.marginBottom = '10px';
            display.style.fontWeight = 'bold';
            display.style.textAlign = 'right';
            display.style.color =
                saved === 'true' ? 'red' :
            saved === 'false' ? 'green' :
            'gray';

            formDot.parentNode.insertBefore(display, formDot);

            window.addEventListener('beforeunload', () => {
                sessionStorage.removeItem(stockStatusKey);
            });
        }
    }

    function bulkOrderCheck(){

        let selectedHorizontal = [];
        let selectedVertical = [];

        let horizontalAxisNames = [];
        let verticalAxisNames = [];

        const rows = document.querySelectorAll('table.formdot tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 3) {
                const horizontal = cells[2].textContent.trim();
                const vertical = cells[3].textContent.trim();

                if (horizontal && !horizontalAxisNames.includes(horizontal)) {
                    horizontalAxisNames.push(horizontal);
                }
                if (vertical && !verticalAxisNames.includes(vertical)) {
                    verticalAxisNames.push(vertical);
                }
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'custom-button-container';
        document.body.appendChild(buttonContainer);

        createAxisButtons('横軸', horizontalAxisNames, 'horizontal', buttonContainer);
        createAxisButtons('縦軸', verticalAxisNames, 'vertical', buttonContainer);

        const onOffContainer = document.createElement('div');
        onOffContainer.id = 'on-off-container';
        buttonContainer.appendChild(onOffContainer);

        const onButton = createActionButton('オン', () => toggleCheckboxes(true));
        const offButton = createActionButton('オフ', () => toggleCheckboxes(false));
        onOffContainer.appendChild(onButton);
        onOffContainer.appendChild(offButton);

        const hideButton = document.createElement('button');
        hideButton.textContent = '-';
        hideButton.id = 'hide-button';
        buttonContainer.appendChild(hideButton);
        hideButton.onclick = hideContainer;

        const showButton = document.createElement('button');
        showButton.textContent = '+';
        showButton.id = 'show-button';
        showButton.style.position = 'fixed';
        showButton.style.right = '25px';
        showButton.style.top = '50%';
        showButton.style.transform = 'translateY(-50%)';
        document.body.appendChild(showButton);
        showButton.onclick = showContainer;

        const configButton = document.createElement('button');
        configButton.textContent = '⚙';
        configButton.id = 'config-button';
        buttonContainer.appendChild(configButton);

        configButton.onclick = () => {
            const isHidden = toggleRememberStateButton.style.display === 'none';
            toggleRememberStateButton.style.display = isHidden ? 'block' : 'none';
        };

        const toggleRememberStateButton = document.createElement('button');
        toggleRememberStateButton.textContent = getRememberState() ? '表示状態の記憶: オン' : '表示状態の記憶: オフ';
        toggleRememberStateButton.id = 'toggle-remember-state';
        toggleRememberStateButton.style.display = 'none';
        toggleRememberStateButton.style.position = 'absolute';
        toggleRememberStateButton.style.bottom = '-24px';
        toggleRememberStateButton.style.left = '-2px';
        toggleRememberStateButton.title = 'オン: リロード時は最後の表示状態を維持\nオフ: リロード時は常に展開';
        buttonContainer.appendChild(toggleRememberStateButton);
        toggleRememberStateButton.onclick = toggleRememberState;

        window.addEventListener('load', restoreState);

        function createAxisButtons(label, axisNames, axis, container) {
            const axisContainer = document.createElement('div');
            axisContainer.classList.add('axis-container');

            const axisLabel = document.createElement('div');
            axisLabel.textContent = label;
            axisLabel.classList.add('axis-label');
            axisContainer.appendChild(axisLabel);

            axisNames.forEach(name => {
                const button = document.createElement('button');
                button.textContent = name;
                button.classList.add('axis-button');
                button.dataset.axis = axis;
                button.dataset.name = name;
                button.onclick = () => toggleSelection(button, axis, name);
                axisContainer.appendChild(button);
            });

            container.appendChild(axisContainer);
        }

        function toggleSelection(button, axis, name) {
            if (axis === 'horizontal') {
                if (selectedHorizontal.includes(name)) {
                    selectedHorizontal = selectedHorizontal.filter(item => item !== name);
                } else {
                    selectedHorizontal.push(name);
                }
            } else if (axis === 'vertical') {
                if (selectedVertical.includes(name)) {
                    selectedVertical = selectedVertical.filter(item => item !== name);
                } else {
                    selectedVertical.push(name);
                }
            }
            updateButtonStyles();
        }

        function updateButtonStyles() {
            document.querySelectorAll('.axis-button[data-axis="horizontal"]').forEach(button => {
                button.classList.toggle('selected', selectedHorizontal.includes(button.dataset.name));
            });
            document.querySelectorAll('.axis-button[data-axis="vertical"]').forEach(button => {
                button.classList.toggle('selected', selectedVertical.includes(button.dataset.name));
            });
        }

        function toggleCheckboxes(state) {
            let feedbackMessage = '';

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const checkbox = row.querySelector('td input[type="checkbox"]');
                if (cells.length > 3 && checkbox) {
                    const horizontal = cells[2].textContent.trim();
                    const vertical = cells[3].textContent.trim();

                    if (selectedHorizontal.length > 0 && selectedVertical.length > 0) {
                        if (selectedHorizontal.includes(horizontal) && selectedVertical.includes(vertical)) {
                            checkbox.checked = state;
                            feedbackMessage = `「${selectedHorizontal.join('」「')}」 と 「${selectedVertical.join('」「')}」 の条件に一致する項目を変更しました。`;
                        }
                    } else if (selectedHorizontal.length > 0 && selectedVertical.length === 0) {
                        if (selectedHorizontal.includes(horizontal)) {
                            checkbox.checked = state;
                            feedbackMessage = `「${selectedHorizontal.join('」「')}」 に一致する項目を変更しました。`;
                        }
                    } else if (selectedVertical.length > 0 && selectedHorizontal.length === 0) {
                        if (selectedVertical.includes(vertical)) {
                            checkbox.checked = state;
                            feedbackMessage = `「${selectedVertical.join('」「')}」 に一致する項目を変更しました。`;
                        }
                    }
                }
            });

            if (!feedbackMessage) {
                feedbackMessage = '選択条件がありません。';
            }

            displayFeedback(feedbackMessage);
        }

        function createActionButton(label, callback) {
            const button = document.createElement('button');
            button.textContent = label;
            button.classList.add('on-off-button');
            button.onclick = callback;
            return button;
        }

        function displayFeedback(message) {
            let feedbackDiv = document.getElementById('feedback-message');

            if (!feedbackDiv) {
                feedbackDiv = document.createElement('div');
                feedbackDiv.id = 'feedback-message';
                document.body.appendChild(feedbackDiv);
            }

            feedbackDiv.textContent = message;
            feedbackDiv.style.display = 'block';

            setTimeout(() => {
                feedbackDiv.style.display = 'none';
            }, 3000);
        }

        function hideContainer() {
            const container = document.getElementById('custom-button-container');
            const showButton = document.getElementById('show-button');
            container.style.display = 'none';
            showButton.style.display = 'block';
            if (getRememberState()) {
                localStorage.setItem('buttonContainerState', 'hidden');
            }
        }

        function showContainer() {
            const container = document.getElementById('custom-button-container');
            const showButton = document.getElementById('show-button');
            container.style.display = 'grid';
            showButton.style.display = 'none';
            if (getRememberState()) {
                localStorage.setItem('buttonContainerState', 'visible');
            }
        }

        function restoreState() {
            if (getRememberState()) {
                const savedState = localStorage.getItem('buttonContainerState');
                const container = document.getElementById('custom-button-container');
                const showButton = document.getElementById('show-button');

                if (savedState === 'hidden') {
                    container.style.display = 'none';
                    showButton.style.display = 'block';
                } else {
                    container.style.display = 'grid';
                    showButton.style.display = 'none';
                }
            }
        }

        function toggleRememberState() {
            const currentState = getRememberState();
            localStorage.setItem('rememberState', currentState ? 'false' : 'true');
            toggleRememberStateButton.textContent = currentState ? '表示状態の記憶: オフ' : '表示状態の記憶: オン';
        }

        function getRememberState() {
            return localStorage.getItem('rememberState') !== 'false';
        }

        GM_addStyle(`
        #custom-button-container {
            position: fixed;
            top: 50%;
            right: 10px;
            min-width: 150px;
            transform: translateY(-50%);
            background-color: #fff;
            padding: 10px 20px;
            border: 1px solid #ccc;
            z-index: 1000;
            display: grid;
            grid-template-columns: 1fr 1fr;
            max-height: 90vh;
        }

        .axis-container {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding-bottom: 45px;
            max-height: 80vh;
        }

        .axis-label {
            margin-bottom: 3px;
            font-weight: bold;
            text-align: center;
        }

        .axis-button {
            margin: 3px;
            background-color: gray;
            color: white;
            border: none;
            padding: 3px 10px;
            cursor: pointer;
            text-align: center;
        }

        .axis-button.selected {
            background-color: #205668;
            color: white;
        }

        .axis-button:hover {
            background-color: #888;
        }

        .axis-button.selected:hover {
            background-color: #205668 !important;
        }

        #on-off-container {
            position: fixed;
            bottom: 0;
            left: 10px;
            right: 10px;
            background-color: #ffffff;
            padding: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            border-top: 1px solid #ccc;
            z-index: 1001;
        }

        .on-off-button {
            background-color: #4c72af;
            color: white;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            transition: transform 0.1s ease, background-color 0.1s ease, box-shadow 0.1s ease;
        }

        .on-off-button:last-child {
            background-color: #f44336;
        }

        .on-off-button:active {
            transform: scale(0.95);
            background-color: #3b5a8e;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .on-off-button:last-child:active {
            background-color: #d32f2f;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .on-off-button:hover {
            background-color: #3c80b5;
            transition: background-color 0.3s;
        }

        .on-off-button:last-child:hover {
            background-color: #e53935;
            transition: background-color 0.3s;
        }

        #feedback-message {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1002;
        }

        #hide-button {
            position: absolute;
            top: 0;
            left: 0;
            background-color: #ccc;
            color: white;
            border: none;
            padding: 2px 7px;
            cursor: pointer;
        }

        #config-button {
            position: absolute;
            top: 0;
            left: 22px;
            background-color: #ccc;
            color: white;
            border: none;
            padding: 1px 4px;
            cursor: pointer;
        }

        #hide-button, #config-button {
            position: absolute;
            background-color: #ccc;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
        }

        #hide-button:hover, #config-button:hover {
            background-color: #888;
            color: #fff;
        }

        #show-button {
            width: 40px;
            height: 40px;
            background: rgba(102, 204, 102, 0.5);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(102, 204, 102, 0.4);
            border-radius: 50%;
            font-size: 26px;
            font-weight: bold;
            color: #fff;
            display: none;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            pointer-events: auto;
            transform-origin: center;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            opacity: 0;
            animation: fadeIn 0.5s forwards;
        }

        #show-button:hover {
            transform: scale(1.5);
            background: rgba(102, 204, 102, 0.8);
            font-size: 32px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        #showButton:active {
            transform: scale(1.35);
            background: rgba(102, 204, 102, 0.8);
            transition: transform 0.05s ease;
        }

        #showButton.fadeOut {
            animation: fadeOut 0.5s forwards;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.5); }
        }
    `);
    }

    function axisReminder() {

        const targetPattern = /:\/\/plus-nao\.com\/forests\/[^\/]+\/sku_check\/[^\/]+/;
        if (!targetPattern.test(window.location.href)) {
            return;
        }

        let currentUrl = window.location.href;
        let code = currentUrl.split('/').pop();
        let axisLink = `https://starlight.plusnao.co.jp/goods/axisCode?code=${code}`;

        let saveButton = document.querySelector('.submit input[value="保存して出品完了"]');
        if (saveButton) {
            let axisButton = document.createElement('input');
            axisButton.type = 'button';
            axisButton.value = '保存して縦横軸設定を開く';
            axisButton.style.background = '#D6DADE';
            axisButton.style.border = '1px solid #6C808C';
            axisButton.style.color = '#6C808C';
            axisButton.style.padding = '4px 8px';
            axisButton.style.textDecoration = 'none';
            axisButton.style.minWidth = '0';
            axisButton.style.fontWeight = 'normal';
            axisButton.style.display = 'inline-block';
            axisButton.style.width = 'auto';
            axisButton.style.marginLeft = '10px';
            axisButton.style.fontSize = '110%';

            axisButton.addEventListener('mouseover', function () {
                axisButton.style.background = '-webkit-gradient(linear, left top, left bottom, from(#f7f7e1), to(#eeeca9))';
                axisButton.style.color = '#ffffff';
                axisButton.style.border = '1px solid #454D6B';
            });

            axisButton.addEventListener('mouseout', function () {
                axisButton.style.background = '#D6DADE';
                axisButton.style.color = '#6C808C';
                axisButton.style.border = '1px solid #6C808C';
            });

            axisButton.addEventListener('click', function () {
                window.open(axisLink, '_blank');
                saveButton.click();
            });

            saveButton.style.display = 'inline-block';
            saveButton.style.width = 'auto';
            saveButton.style.fontSize = '110%';

            saveButton.parentElement.appendChild(axisButton);
        }
    }

    function nonColorSizeReminder(){

        const targets = ['TbMainproduct縦軸項目名', 'TbMainproduct横軸項目名'];
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/1lLqUNM6SidsgvMvzn9Do6f7CFBuuYcZW7S18y4ubUFY/edit?pli=1&gid=1996423860';
        const storageKeyPrefix = 'NotColorSizeInputQueue_';
        const initialValuesKeyPrefix = 'InitialInputValues_';
        const savedTextKeyPrefix = 'SavedHeaderText_';

        function getStorageKey(pageUrl, keyPrefix) {
            return `${keyPrefix}${encodeURIComponent(pageUrl)}`;
        }

        function getInitialValues(pageUrl) {
            try {
                const initialValues = localStorage.getItem(getStorageKey(pageUrl, initialValuesKeyPrefix));
                return initialValues ? JSON.parse(initialValues) : {};
            } catch (error) {
                return {};
            }
        }

        function getSavedHeaderText() {
            try {
                const savedText = localStorage.getItem(savedTextKeyPrefix) || '';
                return savedText;
            } catch (error) {
                return '';
            }
        }

        function saveInputAndHeader(value) {
            const pageUrl = window.location.href;
            const inputQueueKey = getStorageKey(pageUrl, storageKeyPrefix);
            const headerText = document.querySelector('h2').textContent;
            const match = headerText.match(/\[(.*?)\]/);
            const extractedText = match ? match[1] : 'ID無し';

            let inputQueue = JSON.parse(localStorage.getItem(inputQueueKey)) || [];
            inputQueue.push({ header: extractedText, input: value });
            if (inputQueue.length > 10) {
                inputQueue.shift();
            }

            try {
                localStorage.setItem(inputQueueKey, JSON.stringify(inputQueue));
                const savedHeaderText = getSavedHeaderText();
                const newHeaderText = savedHeaderText ? `${savedHeaderText}, ${extractedText}` : extractedText;
                localStorage.setItem(savedTextKeyPrefix, newHeaderText);
            } catch (error) {
            }
        }

        function showNotificationIfNeeded() {
            const savedHeaderText = getSavedHeaderText();

            if (savedHeaderText) {
                const uniqueHeaders = [...new Set(savedHeaderText.split(', ').filter(header => header))];
                const headersText = uniqueHeaders
                .map(header => `<span style="font-family: Verdana; font-size: 10pt; color: #000000;">${header}</span>`)
                .join('<br>');

                const message = `
                ${headersText}<br>
                <span style="font-family: Verdana;">項目名にカラーとサイズ以外が入力されました</span>
            `;

                showCustomNotification(message);
            }
        }

        function showCustomNotification(message) {
            let existingNotification = document.getElementById('custom-notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.id = 'custom-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '10px';
            notification.style.right = '10px';
            notification.style.padding = '12px';
            notification.style.backgroundColor = '#e3f2fd';
            notification.style.color = '#0d47a1';
            notification.style.border = '1px solid #90caf9';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = 10001;
            notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            notification.style.lineHeight = '1.5';

            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '2px';
            closeButton.style.right = '2px';
            closeButton.style.border = 'none';
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = '#0d47a1';
            closeButton.style.fontSize = '24px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.width = '40px';
            closeButton.style.height = '40px';
            closeButton.style.lineHeight = '40px';
            closeButton.style.textAlign = 'center';
            closeButton.style.padding = '0';
            closeButton.addEventListener('click', () => {
                notification.remove();
                try {
                    localStorage.removeItem(savedTextKeyPrefix);
                } catch (error) {
                }
            });

            notification.innerHTML = `
            <p style="margin: 0; font-family: Verdana;">${message}</p>
            <a href="${sheetUrl}" target="_blank" style="color: #1e88e5;">「カラーとサイズ以外にした場合」</a>を新しく開く
        `;
            notification.appendChild(closeButton);
            document.body.appendChild(notification);
        }

        function checkInput(changedFields) {
            const pageUrl = window.location.href;
            let foundInput = false;

            if (!Array.isArray(changedFields)) {
                changedFields = [];
            }

            changedFields.forEach(id => {
                const inputField = document.getElementById(id);
                if (inputField) {
                    const value = inputField.value.trim();

                    if (value !== 'カラー' && value !== 'サイズ' && value !== '-' && value !== '--' && value.trim() !== '') {
                        saveInputAndHeader(value);
                        foundInput = true;
                    }
                }
            });

            if (foundInput) {
                showNotificationIfNeeded();
            }
        }

        function initializeInitialValues() {
            const pageUrl = window.location.href;
            let initialValues = getInitialValues(pageUrl);

            targets.forEach(targetId => {
                const inputElement = document.getElementById(targetId);
                if (inputElement) {
                    initialValues[targetId] = inputElement.value.trim();
                }
            });

            try {
                localStorage.setItem(getStorageKey(pageUrl, initialValuesKeyPrefix), JSON.stringify(initialValues));
            } catch (error) {
            }
        }

        function handleButtonClick(buttonId, isSaveAndSkuStock) {
            const pageUrl = window.location.href;
            const initialValues = getInitialValues(pageUrl);

            let changedFields = [];
            targets.forEach(targetId => {
                const inputElement = document.getElementById(targetId);
                if (inputElement) {
                    const value = inputElement.value.trim();
                    const initialValue = initialValues[targetId] || '';

                    if (isSaveAndSkuStock) {
                        changedFields.push(targetId);
                    } else if (value !== initialValue) {
                        changedFields.push(targetId);
                    }
                }
            });

            checkInput(changedFields);
        }

        document.addEventListener('DOMContentLoaded', () => {
            initializeInitialValues();

            const registeredSaveButton = document.getElementById('registeredSaveButton');
            const registeredSaveAndSkuStock = document.getElementById('registeredSaveAndSkuStock');
            const saveAndSkuStock = document.getElementById('saveAndSkuStock');

            if (registeredSaveButton) {
                registeredSaveButton.addEventListener('click', () => handleButtonClick('registeredSaveButton', false));
            }

            if (registeredSaveAndSkuStock) {
                registeredSaveAndSkuStock.addEventListener('click', () => handleButtonClick('registeredSaveAndSkuStock', false));
            }

            if (saveAndSkuStock) {
                saveAndSkuStock.addEventListener('click', () => handleButtonClick('saveAndSkuStock', true));
            }

            showNotificationIfNeeded();
        });
    }

    function axisCodeErrorCheck(){

        let currentCode = '';
        let saveButton = null;
        let modalSaveButtons = [];
        const alertBoxId = 'custom-alert-box';
        let alertTypesSet = new Set();

        function countByte(str) {
            if (!str) return 0;
            let length = 0;
            for (let char of str) {
                length += (char.match(/[^\x00-\xff]/)) ? 2 : 1;
            }
            return length;
        }

        function containsSpace(str) {
            return /[\u0020\u3000]/.test(str || '');
        }

        function containsSymbols(str) {
            return /['&<>=+\*\/\]\[\\㎜㎝㎞㎎㎏㏄]/.test(str || '');
        }

        function hasInvalidChar(str) {
            const allowedCharsOnly = /^[a-zA-Z0-9\- 　]*$/;
            return !allowedCharsOnly.test(str || '');
        }

        function highlightAxis(str) {
            return countByte(str) >= 33 || containsSpace(str) || containsSymbols(str);
        }

        function highlightCode(inputValue) {
            const combined = (currentCode || '') + (inputValue || '');

            return countByte(combined) >= 21 || containsSpace(combined) || hasInvalidChar(inputValue);
        }

        function applyHighlight(input, conditionFn, color) {
            if (!input || typeof input.value !== 'string') return;

            const value = input.value;
            const combined = (currentCode || '') + value;
            const hasInvalid = hasInvalidChar(value);

            let shouldHighlight = false;

            try {
                shouldHighlight = conditionFn(value);
                input.style.border = shouldHighlight ? `2px solid red` : '';
            } catch (e) {}

            if (!shouldHighlight) {
                if (countByte(value) < 33) alertTypesSet.delete('over33');
                if (countByte(combined) < 21) alertTypesSet.delete('over21');
                if (!containsSpace(value)) alertTypesSet.delete('space');
                if (!containsSymbols(value)) alertTypesSet.delete('symbol');
                if (!hasInvalid) alertTypesSet.delete('invalidChar');
            }

            if (shouldHighlight) {
                if (countByte(value) >= 33) alertTypesSet.add('over33');
                if (countByte(combined) >= 21) alertTypesSet.add('over21');
                if (containsSpace(value)) alertTypesSet.add('space');
                if (containsSymbols(value)) alertTypesSet.add('symbol');
                if (hasInvalid) alertTypesSet.add('invalidChar');
            }

            updateAlertMessages();
        }


        function updateSaveButtonsState() {
            try {
                const hasBadInput = Array.from(document.querySelectorAll('input.form-control')).some(input =>
                                                                                                     input &&
                                                                                                     typeof input.style.border === 'string' &&
                                                                                                     (
                    input.style.border.includes('red') ||
                    input.style.border.includes('blue')
                )
                                                                                                    );

                if (saveButton) {
                    saveButton.disabled = hasBadInput;
                }

                modalSaveButtons.forEach(btn => {
                    btn.disabled = hasBadInput;
                });
            } catch (e) {
            }
        }

        const style = document.createElement('style');
        style.innerHTML = `
        #${alertBoxId} {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f8d7da;
            border: 1px solid #e57373;
            border-radius: 12px;
            padding: 15px 20px;
            z-index: 9999;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            font-size: 14px;
            max-width: 400px;
            line-height: 1.6;
            color: #721c24;
            font-family: "Helvetica Neue", Arial, sans-serif;
        }

        #${alertBoxId} span {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 30px;
            height: 30px;
            background-color: #f44336;
            color: #fff;
            text-align: center;
            line-height: 30px;
            border-radius: 50%;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s, transform 0.2s;
        }

        #${alertBoxId} span:hover {
            background-color: #d32f2f;
            transform: scale(1.1);
        }

        #${alertBoxId} div {
            margin-bottom: 5px;
            margin-top: 5px;
        }
    `;

        document.head.appendChild(style);

        function updateAlertMessages() {
            let alertBox = document.getElementById(alertBoxId);

            const messages = [];
            if (alertTypesSet.has('space')) messages.push('・コード、または項目名にスペースが含まれています。');
            if (alertTypesSet.has('symbol')) messages.push('・項目名に機種依存文字か半角記号が含まれています。');
            if (alertTypesSet.has('over33')) messages.push('・項目名が32byteを超えています。<br>　32byte以内に収めてください。');
            if (alertTypesSet.has('over21')) messages.push('・代表商品コード+SKUが20byteを超えています。<br>　20byte以内に収めてください。');
            if (alertTypesSet.has('invalidChar')) messages.push('・コードに使用できない文字が含まれています。');

            if (messages.length === 0) {
                if (alertBox) {
                    alertBox.remove();
                }
                return;
            }

            if (!alertBox) {
                alertBox = document.createElement('div');
                alertBox.id = alertBoxId;
                document.body.appendChild(alertBox);
            }

            let newMessagesHTML = messages.map(msg => `<div>${msg}</div>`).join('');
            alertBox.innerHTML = `<span onclick="this.parentNode.remove()">×</span>` + newMessagesHTML;
        }

        function recalculateAllAlerts() {
            alertTypesSet.clear();

            document.querySelectorAll('table.table-bordered tbody tr').forEach(tr => {
                const axisInput = tr?.children?.[1]?.querySelector('input.form-control');
                if (axisInput) {
                    const value = axisInput.value || '';
                    if (countByte(value) >= 33) alertTypesSet.add('over33');
                    if (containsSpace(value)) alertTypesSet.add('space');
                    if (containsSymbols(value)) alertTypesSet.add('symbol');
                }
            });

            document.querySelectorAll('div.modal-content').forEach(modal => {
                const inputs = modal.querySelectorAll('input.form-control');
                if (inputs.length > 0) {
                    const first = inputs[0]?.value || '';
                    const second = inputs[1]?.value || '';

                    if (countByte(currentCode + first) >= 21) alertTypesSet.add('over21');

                    if (countByte(second) >= 33) alertTypesSet.add('over33');

                    if (containsSpace(first)) alertTypesSet.add('space');
                    if (containsSpace(second)) alertTypesSet.add('space');

                    if (containsSymbols(second)) alertTypesSet.add('symbol');
                    if (hasInvalidChar(first)) alertTypesSet.add('invalidChar');

                }
            });

            updateAlertMessages();
            updateSaveButtonsState();
        }

        function attachListeners(input, conditionFn) {
            if (!input || input.dataset.hasListener) return;

            const handler = () => {
                applyHighlight(input, conditionFn);
                recalculateAllAlerts();
                updateSaveButtonsState();
            };

            input.addEventListener('input', handler);
            handler();
            input.dataset.hasListener = 'true';
        }

        function extractCodeFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            currentCode = urlParams.get('code') || '';
        }

        function detectSaveButtons() {
            const buttons = document.querySelectorAll('div.row10.mb10 button.btn.btn-primary');
            saveButton = Array.from(buttons).find(btn => btn.textContent.includes('項目名保存')) || null;

            modalSaveButtons = Array.from(document.querySelectorAll('div.modal-footer button.btn-primary'))
                .filter(btn => btn.textContent.includes('保存'));
        }

        function highlightInputs() {
            try {
                extractCodeFromUrl();
                detectSaveButtons();

                const modal = document.getElementById('modalAxisCodeInsertForm');
                const isModalVisible = modal && modal.style.display === 'block';

                if (!isModalVisible) {
                    document.querySelectorAll('table.table-bordered tbody tr').forEach(tr => {
                        const axisInput = tr?.children?.[1]?.querySelector('input.form-control');
                        if (axisInput) {
                            attachListeners(axisInput, highlightAxis);
                        }
                    });
                }

                document.querySelectorAll('div.modal-content').forEach(modal => {
                    const modalInputs = modal.querySelectorAll('input.form-control');
                    const codeInput = modalInputs[0];
                    const axisInput = modalInputs[1];

                    if (codeInput) attachListeners(codeInput, highlightCode);
                    if (axisInput) attachListeners(axisInput, highlightAxis);
                });
            } catch (e) {}
        }

        function clearModalHighlights(modal) {
            if (!modal) return;
            modal.querySelectorAll('input.form-control').forEach(input => {
                input.style.border = '';
            });
        }

        function observeDynamicElements() {
            new MutationObserver(() => {
                highlightInputs();
            }).observe(document.body, {
                childList: true,
                subtree: true
            });

            observeModalDisplayState();
        }

        function observeModalDisplayState() {
            const modal = document.getElementById('modalAxisCodeInsertForm');
            if (!modal) return;

            let previousDisplay = modal.style.display;

            new MutationObserver(() => {
                const currentDisplay = modal.style.display;

                if (previousDisplay !== currentDisplay) {
                    previousDisplay = currentDisplay;

                    if (currentDisplay === 'none') {
                        clearModalHighlights(modal);
                        recalculateAllAlerts();
                        updateSaveButtonsState();
                    } else {
                        highlightInputs();
                        recalculateAllAlerts();
                        updateSaveButtonsState();
                    }
                }
            }).observe(modal, {
                attributes: true,
                attributeFilter: ['style']
            });
        }

        window.addEventListener('load', () => {
            highlightInputs();
            observeDynamicElements();
        });
    }

    function autoReplaceAxisCode(){

        let tableData = [];
        let warningMessage = '置換データを読み込んでいます...';
        let warningColor = 'black';
        let isLoaded = false;

        const updateWarnings = () => {
            document.querySelectorAll('.replace-warning-message').forEach(span => {
                span.innerHTML = warningMessage;
                span.style.color = warningColor;
            });
        };

        const loadReplacementData = () => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://plus-nao.com/forests/TbStockReplaceWord',
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const rows = doc.querySelectorAll('.listdot100par tr');

                    tableData = [];
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length > 1) {
                            tableData.push({
                                key: cells[0].textContent.trim(),
                                value: cells[1].textContent.trim()
                            });
                        }
                    });

                    tableData.sort((a, b) => b.key.length - a.key.length);

                    if (tableData.length > 0) {
                        warningMessage = '';
                        warningColor = 'black';
                        isLoaded = true;
                    } else {
                        warningMessage = '置換データの読み込みに失敗しました<br>(plus-nao.comにログインが必要な場合があります)';
                        warningColor = 'red';
                    }

                    updateWarnings();
                },
                onerror: function () {
                    warningMessage = '置換データの取得中にエラーが発生しました';
                    warningColor = 'red';
                    updateWarnings();
                },
                ontimeout: function () {
                    warningMessage = '置換データの取得がタイムアウトしました';
                    warningColor = 'red';
                    updateWarnings();
                }
            });
        };

        const modalObserver = new MutationObserver(() => {
            document.querySelectorAll('div.modal-content').forEach(modal => {
                const inputs = modal.querySelectorAll('input.form-control');
                if (inputs.length > 1) {
                    const codeInput = inputs[0];
                    const axisInput = inputs[1];

                    if (!axisInput.dataset.listenerAdded) {
                        axisInput.dataset.listenerAdded = 'true';

                        let messageSpan = document.createElement('span');
                        messageSpan.className = 'replace-warning-message';
                        messageSpan.textContent = warningMessage;
                        messageSpan.style.marginLeft = '10px';
                        messageSpan.style.color = warningColor;
                        messageSpan.style.fontSize = '12px';
                        messageSpan.style.display = 'inline-block';
                        messageSpan.style.maxWidth = '250px';
                        messageSpan.style.verticalAlign = 'middle';
                        axisInput.parentElement.appendChild(messageSpan);

                        axisInput.addEventListener('input', () => {
                            const original = axisInput.value.trim();

                            if (!original) {
                                codeInput.value = '';
                            } else {
                                const exclusionPattern = /【[^【】]*】/g;
                                const filteredText = original.replace(exclusionPattern, '');

                                let replaced = filteredText;
                                for (const { key, value } of tableData) {
                                    replaced = replaced.replaceAll(key, value);
                                }

                                replaced = replaced.replaceAll('×', 'x');

                                replaced = replaced.replace(/[^a-zA-Z0-9\-]/g, '');

                                codeInput.value = replaced;
                            }

                            const inputEvent = new Event('input', {
                                bubbles: true,
                                cancelable: true
                            });
                            codeInput.dispatchEvent(inputEvent);
                        });

                        updateWarnings();
                    }
                }
            });
        });

        modalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        loadReplacementData();

    }

    function denpyoUpdateGuard(){

        function isBusinessHours() {
            const now = new Date();
            const nowJST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
            const day = nowJST.getDay();
            const hour = nowJST.getHours();
            const isWeekday = day >= 1 && day <= 5;
            const isWorkHours = hour >= 6 && hour < 19;
            return isWeekday && isWorkHours;
        }

        function createOverlayButton(original) {
            let overlay = document.getElementById('overlay_syusei_btn');
            if (overlay) return overlay;

            const clone = original.cloneNode(true);
            clone.id = 'overlay_syusei_btn';

            clone.style.position = 'absolute';
            clone.style.zIndex = 9999;
            clone.style.cursor = 'pointer';
            clone.style.userSelect = 'none';

            original.style.position = original.style.position || 'relative';
            original.style.zIndex = 1;
            original.style.pointerEvents = 'none';

            document.body.appendChild(clone);

            return clone;
        }

        function updateOverlayPosition(original, overlay) {
            const rect = original.getBoundingClientRect();
            overlay.style.top = window.scrollY + rect.top + 'px';
            overlay.style.left = window.scrollX + rect.left + 'px';
            overlay.style.height = rect.height + 'px';

            overlay.style.display = 'inline-flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.whiteSpace = 'nowrap';
            overlay.style.fontSize = window.getComputedStyle(original).fontSize;
            overlay.style.lineHeight = rect.height + 'px';
        }

        function setupOverlayBehavior(value, original, overlay) {
            const denpyoInput = document.getElementById('jyuchu_denpyo_no');
            if (!denpyoInput) return;

            const updateOverlay = () => {
                const denpyoVal = denpyoInput.value.trim();

                if (denpyoVal === '') {
                    overlay.style.display = 'none';
                    original.style.pointerEvents = 'auto';
                    return;
                }

                overlay.replaceWith(overlay.cloneNode(true));
                overlay = document.getElementById('overlay_syusei_btn');
                if (!overlay) return;

                overlay.onclick = null;
                overlay.removeEventListener('click', overlay._clickHandler);
                delete overlay._clickHandler;

                if (value === "40") {
                    overlay.textContent = '⚠️更新禁止⚠️';
                    overlay.style.backgroundColor = "#ffcccc";
                    overlay.style.color = "#aa0000";
                    overlay.style.border = "1px solid #aa0000";
                    overlay.style.fontWeight = "bold";

                    overlay.style.display = 'flex';
                    overlay.style.alignItems = 'center';
                    overlay.style.justifyContent = 'center';
                    overlay.style.lineHeight = 'normal';

                    const clickHandler = async function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        const msg1 = "⚠️この伝票は『納品書印刷済み』です⚠️\n本当に更新しますか？";
                        const msg2 = "更新を実行すると情報が変更される可能性があります。\n本当によろしいですか？";

                        if (!(await showConfirmationModal(msg1))) return;
                        if (!(await showConfirmationModal(msg2))) return;

                        original.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    };

                    overlay.addEventListener('click', clickHandler);
                    overlay._clickHandler = clickHandler;

                } else if (value === "20") {
                    overlay.textContent = '伝票更新⚠️';
                    overlay.style.backgroundColor = '';
                    overlay.style.color = '';
                    overlay.style.border = '';
                    overlay.style.fontWeight = '';

                    overlay.style.display = 'flex';
                    overlay.style.alignItems = 'center';
                    overlay.style.justifyContent = 'center';
                    overlay.style.lineHeight = 'normal';

                    const clickHandler = async function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        if (isBusinessHours()) {
                            const msg = "⚠️この伝票は『納品書印刷待ち』の状態です⚠️\n本当に更新しますか？";
                            if (!(await showConfirmationModal(msg))) return;
                        }

                        original.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    };

                    overlay.addEventListener('click', clickHandler);
                    overlay._clickHandler = clickHandler;

                } else {
                    overlay.style.display = 'none';
                    original.style.pointerEvents = 'auto';
                }
            };

            updateOverlay();
            denpyoInput.addEventListener('input', updateOverlay);
        }

        function showConfirmationModal(message) {
            return new Promise((resolve) => {
                const existing = document.getElementById('custom-confirm-overlay');
                if (existing) existing.remove();

                const overlay = document.createElement('div');
                overlay.id = 'custom-confirm-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                overlay.style.zIndex = '9999';
                overlay.style.display = 'flex';
                overlay.style.alignItems = 'center';
                overlay.style.justifyContent = 'center';

                const modal = document.createElement('div');
                modal.id = 'custom-confirm';
                modal.style.background = '#fff0f0';
                modal.style.border = '3px solid #aa0000';
                modal.style.padding = '30px 20px';
                modal.style.borderRadius = '10px';
                modal.style.textAlign = 'center';
                modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.7)';
                modal.style.maxWidth = '90%';
                modal.style.minWidth = '320px';
                modal.style.fontSize = '18px';
                modal.style.fontWeight = 'bold';
                modal.style.color = '#aa0000';

                const msg = document.createElement('div');
                msg.innerText = message;
                msg.style.marginBottom = '25px';
                msg.style.whiteSpace = 'pre-line';

                const buttonWrapper = document.createElement('div');
                buttonWrapper.style.display = 'flex';
                buttonWrapper.style.justifyContent = 'center';
                buttonWrapper.style.gap = '20px';

                const baseBtnStyle = `
            padding: 10px 20px;
            min-width: 120px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            white-space: nowrap;
        `;

                const ok = document.createElement('button');
                ok.innerText = 'OK';
                ok.style = baseBtnStyle + 'background-color: #aa0000; color: white;';
                ok.onclick = () => {
                    overlay.remove();
                    resolve(true);
                };

                const cancel = document.createElement('button');
                cancel.innerText = 'キャンセル';
                cancel.style = baseBtnStyle + 'background-color: #ccc; color: black;';
                cancel.onclick = () => {
                    overlay.remove();
                    resolve(false);
                };

                buttonWrapper.appendChild(ok);
                buttonWrapper.appendChild(cancel);
                modal.appendChild(msg);
                modal.appendChild(buttonWrapper);
                overlay.appendChild(modal);
                document.body.appendChild(overlay);
            });
        }


        window.addEventListener('load', function () {
            const original = document.getElementById('syusei_btn');
            const select = document.getElementById('jyuchu_jyotai_kbn');
            const denpyoInput = document.getElementById('jyuchu_denpyo_no');

            if (!original || !select || !denpyoInput) {
                return;
            }

            let overlay = createOverlayButton(original);
            updateOverlayPosition(original, overlay);
            setupOverlayBehavior(select.value, original, overlay);

            select.addEventListener('change', function () {
                setupOverlayBehavior(this.value, original, overlay);
            });

            window.addEventListener('scroll', () => updateOverlayPosition(original, overlay));
            window.addEventListener('resize', () => updateOverlayPosition(original, overlay));

            let previousDenpyoValue = denpyoInput.value;
            let previousSelectValue = select.value;

            setInterval(() => {
                const currentDenpyoValue = denpyoInput.value;
                const currentSelectValue = select.value;

                if (currentDenpyoValue !== previousDenpyoValue || currentSelectValue !== previousSelectValue) {
                    previousDenpyoValue = currentDenpyoValue;
                    previousSelectValue = currentSelectValue;
                    setupOverlayBehavior(currentSelectValue, original, overlay);
                }
            }, 500);
        });
    }

    function applyTagStyle(){

        function addCustomStyles() {
            if (document.getElementById('custom-tag-input-style')) return;

            const style = document.createElement('style');
            style.id = 'custom-tag-input-style';
            style.textContent = `
            #tag_input.custom-style {
                -webkit-text-size-adjust: 100%;
                --color-capturing: #8f8;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                color: #333333;
                font-size: 11px;
                line-height: 18px;
                box-sizing: border-box;
                padding: 3px 6px 2px 6px;
                width: 100%;
                background-color: #fdfdfd;
                border-right: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                border-left: 1px solid #ccc;
                letter-spacing: 0;
                position: relative;
            }
            #tag_input.custom-style a {
                -webkit-text-size-adjust: 100%;
                --color-capturing: #8f8;
                font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                font-size: 11px;
                box-sizing: border-box;
                color: #000;
                border: 1px solid #000;
                border-radius: 9px;
                display: inline-block;
                font-weight: bold;
                letter-spacing: normal;
                line-height: 1.2;
                margin-bottom: 4px;
                margin-right: 4px;
                text-decoration: none;
                padding: 1px 4px;
                outline: none;
                word-break: break-all;
                cursor: pointer;
                user-select: none;
                background-color: transparent;
                transition: background-color 0.2s ease;
            }
            #tag_input.custom-style a.selected-tag {
                background-color: #d0f0c0;
            }
        `;
            document.head.appendChild(style);
        }

        function isOldStyle() {
            const items = document.querySelectorAll('ul.sub_menu li.style-change');
            for (const item of items) {
                if (item.getAttribute('data-style-id') === '0' && item.classList.contains('style-checked')) {
                    return true;
                }
            }
            return false;
        }

        function getSelectedTags() {
            const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
            if (!jyuchuTagTextarea) return [];
            const rawText = jyuchuTagTextarea.value || '';
            const matches = rawText.match(/\[([^\]]+)\]/g);
            if (!matches) return [];
            const tags = matches.map(s => s.replace(/^\[|\]$/g, '').trim()).filter(s => s.length > 0);
            return tags;
        }

        function applyCustomStyle() {
            const tagInput = document.getElementById('tag_input');

            tagInput.classList.add('custom-style');

            const selectedTags = getSelectedTags();

            const anchors = tagInput.querySelectorAll('a');
            anchors.forEach(a => {
                const text = a.textContent.trim();

                if (selectedTags.includes(text)) {
                    a.classList.add('selected-tag');
                } else {
                    a.classList.remove('selected-tag');
                }

                if (!a.dataset.listenerAdded) {
                    a.addEventListener('click', () => {
                        const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
                        if (!jyuchuTagTextarea) return;
                        const event = new Event('input', { bubbles: true });
                        jyuchuTagTextarea.dispatchEvent(event);
                    });
                    a.dataset.listenerAdded = 'true';
                }
            });
        }

        window.addEventListener('load', () => {
            if (isOldStyle()) {
                addCustomStyles();
                applyCustomStyle();

                const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
                if (jyuchuTagTextarea) {
                    jyuchuTagTextarea.addEventListener('input', () => {
                        applyCustomStyle();
                    });
                }
            }
        });
    }

    function denpyoReflector(){

        const OLD_KEY = 'jyuchu_denpyo_no_old';
        const NEW_KEY = 'jyuchu_denpyo_no';
        const FLAG_KEY = 'update_flag';

        window.addEventListener('load', () => {
            const myDenpyo = document.getElementById('jyuchu_denpyo_no')?.value;
            if (!myDenpyo) return;

            const oldVal = localStorage.getItem(NEW_KEY);
            if (oldVal && oldVal !== myDenpyo) {
                localStorage.setItem(OLD_KEY, oldVal);
            }
            localStorage.setItem(NEW_KEY, myDenpyo);

            addReflectButton();

            let lastValue = myDenpyo;
            setInterval(() => {
                const currentValue = document.getElementById('jyuchu_denpyo_no')?.value;
                if (currentValue && currentValue !== lastValue) {
                    const oldVal = localStorage.getItem(NEW_KEY);
                    if (oldVal && oldVal !== currentValue) {
                        localStorage.setItem(OLD_KEY, oldVal);
                    }
                    localStorage.setItem(NEW_KEY, currentValue);
                    lastValue = currentValue;
                }
            }, 500);
        });

        window.addEventListener('storage', (event) => {
            if (event.key === FLAG_KEY) {
                const myDenpyo = document.getElementById('jyuchu_denpyo_no')?.value;
                if (!myDenpyo) return;

                reflectDenpyo(myDenpyo);
            }
        });

        function getTodayDate() {
            const date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            const jstDate = new Date(utc + (9 * 60 * 60000));
            const mm = String(jstDate.getMonth() + 1).padStart(2, '0');
            const dd = String(jstDate.getDate()).padStart(2, '0');
            return `${mm}/${dd}`;
        }

        function reflectDenpyo(myDenpyo) {
            const textarea = document.getElementById('sagyosya_ran');

            const oldVal = localStorage.getItem(OLD_KEY) || '';
            const newVal = localStorage.getItem(NEW_KEY) || '';

            const oldLine = (oldVal === myDenpyo || !oldVal) ? '' : `元伝：${oldVal}`;
            const newLine = (newVal === myDenpyo || !newVal) ? '' : `${getTodayDate()} 複写：${newVal}`;
            const lines = [oldLine, newLine].filter(line => line !== '');

            const existingText = textarea.value || '';
            const newText = lines.join('\n');
            if (!newText) return;

            const cleanedText = existingText
            .split('\n')
            .filter(line => !(line.includes(oldVal) || line.includes(newVal)))
            .join('\n');

            textarea.value = [newText, cleanedText].filter(Boolean).join('\n');
        }

        function addReflectButton() {
            const targetTd = document.querySelector('#jyuyou_check_head td.group_head');

            const button = document.createElement('button');
            button.textContent = '複写反映';
            Object.assign(button.style, {
                position: 'absolute',
                top: '0',
                right: '95px',
                minWidth: '0',
                width: 'auto',
                fontSize: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                zIndex: 1000,
            });

            targetTd.style.position = 'relative';
            targetTd.appendChild(button);

            button.addEventListener('click', () => {
                event.preventDefault();
                event.stopPropagation();

                localStorage.setItem(FLAG_KEY, Date.now().toString());
                const myDenpyo = document.getElementById('jyuchu_denpyo_no')?.value;
                if (myDenpyo) reflectDenpyo(myDenpyo);
            });
        }
    }

    function jyuchuDateCheck(){

        window.addEventListener('load', () => {
            const inputDate = document.getElementById('jyuchu_bi');
            if (!inputDate) return;

            const checkDate = () => {
                const dateStr = inputDate.value;
                const dateParts = dateStr.split('/');
                if (dateParts.length !== 3) return;

                const jyuchuDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                const now = new Date();
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

                if (jyuchuDate < sixMonthsAgo) {
                    showWarningBox();
                } else {
                    const existingBox = document.getElementById('jyuchu_warning_box');
                    if (existingBox) {
                        existingBox.remove();
                    }
                }
            };

            const showWarningBox = () => {
                if (document.getElementById('jyuchu_warning_box')) return;

                const box = document.createElement('div');
                box.id = 'jyuchu_warning_box';
                box.style.cssText = `
               position: fixed;
               top: 100px;
               left: 50%;
               transform: translateX(-50%);
               background-color: #fff3cd;
               color: #856404;
               border: 1px solid #ffeeba;
               padding: 16px 24px 16px 24px;
               font-weight: bold;
               font-size: 16px;
               text-align: center;
               border-radius: 8px;
               z-index: 99999;
               box-shadow: 0 4px 12px rgba(0,0,0,0.2);
           `;

                const closeBtn = document.createElement('button');
                closeBtn.textContent = '×';
                closeBtn.style.cssText = `
               position: absolute;
               top: 4px;
               right: 4px;
               width: 28px;
               height: 28px;
               background: transparent;
               border: none;
               font-size: 24px;
               font-weight: bold;
               color: #856404;
               cursor: pointer;
               line-height: 28px;
               padding: 0;
               user-select: none;
               text-align: center;
           `;
                closeBtn.onclick = () => {
                    box.remove();
                };
                box.style.position = 'fixed';
                box.style.paddingTop = '16px';
                box.appendChild(closeBtn);

                const message = document.createElement('div');
                message.innerHTML = `
                この伝票の受注日は <strong>6ヶ月以上前</strong> の日付です。<br>
                再検索をお願いします。<br><br>
            `;
                box.appendChild(message);

                const btn = document.createElement('button');
                btn.textContent = '再検索';
                btn.style.cssText = 'padding: 8px 16px; font-size: 14px; cursor: pointer; white-space: nowrap;';
                btn.onclick = reseach;

                box.appendChild(btn);
                document.body.appendChild(box);
            };

            const reseach = () => {
                const menuLink = document.getElementById('sub_menu_03_01_lnk');
                if (menuLink) menuLink.click();

                const denpyoInput = document.getElementById('jyuchu_denpyo_no');
                const searchInput = document.getElementById('sea_jyuchu_search_field02');
                const searchButton = document.getElementById('ne_dlg_btn2_searchJyuchuDlg');

                if (!denpyoInput || !searchInput || !searchButton) return alert('必要な要素が見つかりません');

                const denpyoValue = denpyoInput.value.trim();
                if (!denpyoValue) return alert('伝票番号が空です');

                searchInput.value = denpyoValue;
                searchButton.click();

                const observer = new MutationObserver(() => {
                    const table = document.getElementById('searchJyuchu_tablene_table');
                    if (!table) return;

                    const rows = table.querySelectorAll('tbody tr');
                    if (rows.length < 2) return;

                    const targetCell = rows[1].querySelector('td');
                    if (targetCell) {
                        const dblClickEvent = new MouseEvent('dblclick', { bubbles: true });
                        targetCell.dispatchEvent(dblClickEvent);
                        observer.disconnect();

                        let lastDenpyo = denpyoInput.value;
                        const checkInterval = setInterval(() => {
                            const currentDenpyo = denpyoInput.value;
                            if (currentDenpyo && currentDenpyo !== lastDenpyo) {
                                lastDenpyo = currentDenpyo;
                                checkDate();
                            }
                        }, 1000);
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            };

            checkDate();
        });
    }

    runPageScripts();

})();