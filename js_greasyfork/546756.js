// ==UserScript==
// @name         [2025-E23] WADM Auto Inputter (RC6-Beta3)
// @namespace    http://tampermonkey.net/
// @version      RC6-Beta3
// @description  Auto input for Amazon EHS waste donation
// @author       You
// @match        https://fe.ehs-amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546756/%5B2025-E23%5D%20WADM%20Auto%20Inputter%20%28RC6-Beta3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546756/%5B2025-E23%5D%20WADM%20Auto%20Inputter%20%28RC6-Beta3%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let csvData = null;
    let isRunning = false;
    let currentRow = 2; // A2セルから開始
    let containerEditorCompleted = false; // Container Editorの処理完了フラグ
    let containerEditorStarted = false; // Container Editorの開始フラグ
    let scriptInstanceId = null; // スクリプトインスタンスID

    // データベースCSV（埋め込み）
    const databaseCSV = `1300000,1
1300030,1
1300031,1
1310012,1
1310013,1
1321000,1
0210000,2
0200007,4
0200008,4
0200009,4
0200011,4
0200005,6
0200006,7
0200002,8
0200004,8
0200010,8
1200002,9
1200001,10
1200003,10
1200029,10
1200030,10
1210000,10
2522004,11
2522013,11
0900000,12
0500000,13
0500001,13
0600000,14
0600004,14
0600008,14
0600009,14
0600027,14
0600028,14
0600029,14
0600104,14
0604000,14
0604001,14
0605000,14
0605001,14
0600002,15
0600007,15
0600006,16
0600003,17
0600001,18
0600005,19
3500000,20
3520000,20
2100001,21
2100002,21
2200000,21
2200001,21
2200002,21
2200003,21
3600000,21
0800000,22
0800001,23`;

    let database = null;

    // スクリプトの重複実行チェック
    function checkDuplicateExecution() {
        const currentTime = Date.now();
        const scriptKey = 'wadm_auto_inputter_active';
        const lastActiveTime = localStorage.getItem(scriptKey);

        // 他のインスタンスが5分以内にアクティブだった場合
        if (lastActiveTime && (currentTime - parseInt(lastActiveTime)) < 300000) {
            return new Promise((resolve) => {
                if (confirm('他のタブまたはウィンドウで起動中のAustinがあるようです。誤動作の原因となるので、他のタブまたはウィンドウのAustinは閉じてください。閉じましたら、OKボタンを押して、ご覧になっていたページをリロードしてください。')) {
                    // ユーザーがOKを押した場合、ページをリロード
                    location.reload();
                    resolve(false);
                } else {
                    resolve(false);
                }
            });
        }

        // 新しいインスタンスIDを生成
        scriptInstanceId = currentTime.toString();
        localStorage.setItem(scriptKey, currentTime.toString());

        // 定期的にアクティブ状態を更新
        setInterval(() => {
            localStorage.setItem(scriptKey, Date.now().toString());
        }, 60000); // 1分ごとに更新

        // ページが閉じられる際にクリーンアップ
        window.addEventListener('beforeunload', () => {
            localStorage.removeItem(scriptKey);
        });

        return Promise.resolve(true);
    }

    // Escキーでスクリプト停止
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('スクリプトを停止しました');
            isRunning = false;
            containerEditorCompleted = true; // 停止時はフラグもセット
            containerEditorStarted = true;
        }
    });

    // データベース初期化
    function initializeDatabase() {
        database = {};
        const lines = databaseCSV.trim().split('\n');
        for (let line of lines) {
            const [code, index] = line.split(',');
            database[code.trim()] = parseInt(index.trim());
        }
        console.log('データベース初期化完了:', database);
    }

    // CSVファイル読み込み用のUI作成（検索ページのみ）
    function createFileInput() {
        // 現在のURLを確認
        if (!window.location.href.includes('/waste-and-donations/search')) {
            console.log('CSVファイル選択UIは検索ページでのみ有効です');
            return;
        }

        const fileInputDiv = document.createElement('div');
        fileInputDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: white;
            border: 2px solid #ccc;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.marginRight = '10px';

        const loadButton = document.createElement('button');
        loadButton.textContent = 'CSVを読み込む';
        loadButton.onclick = () => handleFileLoad(fileInput.files[0]);

        fileInputDiv.appendChild(fileInput);
        fileInputDiv.appendChild(loadButton);
        document.body.appendChild(fileInputDiv);
    }

    // CSVファイルの読み込み処理（Shift-JIS対応）
    function handleFileLoad(file) {
        if (!file) {
            alert('ファイルを選択してください');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Shift-JISでデコード
                const arrayBuffer = e.target.result;
                const decoder = new TextDecoder('shift_jis');
                const csvText = decoder.decode(arrayBuffer);

                console.log('CSV読み込み完了（生データ）:', csvText.substring(0, 200) + '...');

                // CSV解析
                csvData = parseCSV(csvText);
                console.log('CSV解析完了:', csvData);

                // CSVファイル検証
                if (!validateCSV(csvData)) {
                    return; // エラーの場合は処理停止
                }

                console.log('CSV検証完了');
                // フラグをリセット（新しいCSVが読み込まれた場合）
                containerEditorCompleted = false;
                containerEditorStarted = false;
                startAutomation();

            } catch (error) {
                console.error('CSV読み込みエラー:', error);
                alert(`CSVファイルの読み込みに失敗しました: ${error.message}`);
            }
        };

        reader.onerror = function() {
            alert('ファイル読み込みエラーが発生しました');
        };

        // ArrayBufferとして読み込み（Shift-JISデコード用）
        reader.readAsArrayBuffer(file);
    }

    // CSV解析
    function parseCSV(text) {
        const lines = text.split('\n');
        const result = [];
        for (let line of lines) {
            // 空行をスキップ
            if (line.trim() === '') continue;

            const row = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
            result.push(row);
        }
        return result;
    }

    // CSVファイル検証
    function validateCSV(data) {
        // データが存在するかチェック
        if (!data || data.length === 0) {
            alert('CSVファイルが空です');
            return false;
        }

        // 最初の行が存在し、A1セルに値があるかチェック
        if (data.length === 0 || !data[0] || data[0].length === 0) {
            alert('CSVファイルの形式が正しくありません');
            return false;
        }

        // A1セルの値をチェック
        const a1Value = data[0][0];
        console.log('A1セル値:', a1Value);

        if (a1Value !== 'マニフェスト番号／予約番号') {
            alert('電子マニフェストのCSVファイルではないようです');
            return false;
        }

        // 最低限の行数チェック（ヘッダー + データが1行以上）
        if (data.length < 2) {
            alert('CSVファイルにデータが含まれていません');
            return false;
        }

        // 必要な列数チェック（AU列=47列目まで必要）
        if (!data[1] || data[1].length < 47) {
            console.warn('CSVファイルの列数が少ない可能性があります（推奨: 47列以上）');
        }

        return true;
    }

    // 重量データを取得（AP2→BQ2→DJ2の順で優先）
    function getWeightValue(rowData) {
        // AP2セル（42列目、インデックス41）
        const ap2Value = rowData[41] || '';
        if (ap2Value.trim() !== '') {
            console.log('重量データ取得: AP2セル =', ap2Value);
            return ap2Value.trim();
        }

        // BQ2セル（69列目、インデックス68）
        const bq2Value = rowData[68] || '';
        if (bq2Value.trim() !== '') {
            console.log('重量データ取得: BQ2セル =', bq2Value);
            return bq2Value.trim();
        }

        // DJ2セル（114列目、インデックス113）
        const dj2Value = rowData[113] || '';
        if (dj2Value.trim() !== '') {
            console.log('重量データ取得: DJ2セル =', dj2Value);
            return dj2Value.trim();
        }

        console.warn('重量データが見つかりません（AP2, BQ2, DJ2すべて空欄）');
        return '';
    }

    // 日付変換: yyyy/m/d → mm/dd/yyyy
    function convertDateFormat(dateString) {
        if (!dateString || dateString.trim() === '') {
            return '';
        }

        try {
            // yyyy/m/d または yyyy/mm/dd 形式を解析
            const parts = dateString.trim().split('/');
            if (parts.length !== 3) {
                console.warn('日付形式が不正です:', dateString);
                return dateString;
            }

            const year = parts[0];
            const month = parts[1].padStart(2, '0'); // 月を2桁にパディング
            const day = parts[2].padStart(2, '0'); // 日を2桁にパディング

            const convertedDate = `${month}/${day}/${year}`;
            console.log('日付変換:', dateString, '→', convertedDate);
            return convertedDate;
        } catch (error) {
            console.error('日付変換エラー:', error);
            return dateString;
        }
    }

    // CA2セルから会社名の先頭4バイトを取得
    function getCompanyPrefix(cellValue) {
        if (!cellValue || cellValue.trim() === '') {
            return '';
        }

        const companyName = cellValue.trim();
        console.log('会社名セル値:', companyName);

        if (companyName.startsWith('株式会社')) {
            // "株式会社"の場合は5-8文字目を取得
            const prefix = companyName.substring(4, 8);
            console.log('会社名プレフィックス（株式会社除去）:', prefix);
            return prefix;
        } else {
            // それ以外は先頭4文字
            const prefix = companyName.substring(0, 4);
            console.log('会社名プレフィックス（先頭4文字）:', prefix);
            return prefix;
        }
    }

    // 完了メッセージを表示
    function showCompletionMessage() {
        // カスタムスタイルのアラートを作成
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 20000;
            background: #4CAF50;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            min-width: 300px;
        `;
        messageDiv.textContent = '自動入力が完了しました。マニフェストを添付してください。';

        // オーバーレイを作成
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 19999;
        `;

        // OKボタンを作成
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.cssText = `
            margin-top: 15px;
            padding: 8px 20px;
            background: white;
            color: #4CAF50;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
        `;

        okButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(messageDiv);
        };

        messageDiv.appendChild(okButton);
        document.body.appendChild(overlay);
        document.body.appendChild(messageDiv);

        // オーバーレイクリックでも閉じる
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(messageDiv);
        };
    }

    // 要素が表示されるまで待機
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                if (!isRunning) {
                    reject(new Error('スクリプトが停止されました'));
                    return;
                }

                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`要素が見つかりません: ${selector}`));
                    return;
                }

                setTimeout(check, 100);
            }
            check();
        });
    }

    // 要素が表示されクリック可能になるまで待機（強化版）
    function waitForClickableElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                if (!isRunning) {
                    reject(new Error('スクリプトが停止されました'));
                    return;
                }

                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null && !element.disabled) {
                    // 要素が表示されていて、無効化されていない場合
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`クリック可能な要素が見つかりません: ${selector}`));
                    return;
                }

                setTimeout(check, 200);
            }
            check();
        });
    }

    // 要素をオプションで待機（見つからなくてもエラーにしない）
    function waitForOptionalElement(selector, timeout = 3000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            function check() {
                if (!isRunning) {
                    resolve(null);
                    return;
                }

                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    resolve(null);
                    return;
                }

                setTimeout(check, 100);
            }
            check();
        });
    }

    // アクティブな入力要素が表示されるまで待機
    function waitForActiveInput(testId, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                if (!isRunning) {
                    reject(new Error('スクリプトが停止されました'));
                    return;
                }

                const element = findInputElement(testId);
                if (element && !element.disabled && !element.readOnly) {
                    // フォーカス可能か確認
                    try {
                        element.focus();
                        if (document.activeElement === element) {
                            resolve(element);
                            return;
                        }
                    } catch (e) {
                        // フォーカスできない場合は継続
                    }
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`アクティブな入力要素が見つかりません: ${testId}`));
                    return;
                }

                setTimeout(check, 100);
            }
            check();
        });
    }

    // 複数のセレクタを試行してinput要素を見つける
    function findInputElement(testId) {
        const selectors = [
            `[data-testid="${testId}"] input`,
            `[data-testid="${testId}"] textarea`,
            `[data-testid="${testId}"]`,
            `div[data-testid="${testId}"] input`,
            `div[data-testid="${testId}"] textarea`
        ];

        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
                return element;
            }
        }
        return null;
    }

    // より強力なキーボード入力シミュレーション（ステップ④-4で使用している方法）
    function simulateTyping(element, text) {
        console.log(`入力開始: ${text} -> ${element.tagName}[${element.type}]`);

        element.focus();
        element.click();
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(element, text);

        const events = [
            new Event('input', { bubbles: true, cancelable: true }),
            new Event('change', { bubbles: true, cancelable: true }),
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
            new KeyboardEvent('keyup', { key: 'Enter', bubbles: true })
        ];

        events.forEach(event => {
            element.dispatchEvent(event);
        });

        console.log(`入力完了: ${element.value}`);
    }

    // 特定のキーを押下
    function simulateKeyPress(element, key, keyCode) {
        console.log(`キー押下: ${key}`);

        element.focus();

        const keydownEvent = new KeyboardEvent('keydown', {
            key: key,
            keyCode: keyCode,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(keydownEvent);

        const keyupEvent = new KeyboardEvent('keyup', {
            key: key,
            keyCode: keyCode,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(keyupEvent);
    }

    // 複数のキーを順番に押下
    async function simulateMultipleKeys(element, keys) {
        console.log(`複数キー押下: ${keys.map(k => k.key).join(', ')}`);
        element.focus();

        for (let keyInfo of keys) {
            simulateKeyPress(element, keyInfo.key, keyInfo.keyCode);
            await sleep(100); // キー間の短い待機
        }

        console.log('複数キー押下完了');
    }

    // 遅延実行
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ドロップダウン選択
    async function selectDropdownOption(testId, optionIndex) {
        console.log(`ドロップダウン選択開始: ${testId}, オプション: ${optionIndex}`);

        // ドロップダウンボタンをクリック
        const dropdownButton = await waitForElement(`[data-testid="${testId}"] button`);
        dropdownButton.click();

        await sleep(500);

        // 指定されたオプションを選択
        const options = await waitForElement('[role="listbox"]');
        const optionElements = options.querySelectorAll('li');

        if (optionElements.length >= optionIndex) {
            optionElements[optionIndex - 1].click(); // 1ベースなので-1
            console.log(`ドロップダウン選択完了: ${optionIndex}番目`);
        } else {
            throw new Error(`オプション${optionIndex}が見つかりません（利用可能: ${optionElements.length}個）`);
        }

        await sleep(500);
    }

    // Container Editor ページでの処理
    async function handleContainerEditor() {
        // 既に開始している、または完了している場合はスキップ
        if (containerEditorStarted || containerEditorCompleted || isRunning) {
            console.log('Container Editor処理は既に開始済み/完了済み/実行中のためスキップします');
            return;
        }

        console.log('Container Editor ページでの処理開始');
        containerEditorStarted = true; // 開始フラグを設定
        isRunning = true;

        try {
            // ⑩-1 Location ドロップダウン - 4番目を選択
            console.log('⑩-1 Location選択: 4番目');
            await selectDropdownOption('ContainerEditor-location', 4);

            await sleep(500);

            // ⑩-2 Container Type ドロップダウン - 54番目を選択
            console.log('⑩-2 ContainerType選択: 54番目');
            await selectDropdownOption('ContainerEditor-containerType', 54);

            await sleep(500);

            // ⑩-3 Max Weight - 2000を入力
            console.log('⑩-3 MaxWeight入力: 2000');
            const maxWeightInput = findInputElement('ContainerEditor-maxWeight');
            if (!maxWeightInput) {
                throw new Error('Max Weight input が見つかりません');
            }
            simulateTyping(maxWeightInput, '2000');
            console.log('⑩-3完了: Max Weight入力: 2000');

            await sleep(1000);

            // ⑩-4 Publish ボタン押下
            console.log('⑩-4 Publishボタン押下');
            const publishButton = await waitForElement('[data-testid="ContainerEditor-publishButton"]');
            publishButton.click();
            console.log('⑩-4完了: Publishボタン押下');

            await sleep(3000); // リンク表示を待機

            // ⑩-5 Start Adding Items リンク押下
            console.log('⑩-5 StartAddingItemsリンク押下');
            const startAddingItemsLink = await waitForElement('[data-testid="ContainerEditor-startAddingItemsLink"]');
            startAddingItemsLink.click();
            console.log('⑩-5完了: StartAddingItemsリンク押下');

            // ページ更新をより長く待機
            console.log('ページ更新を待機中...');
            await sleep(8000);

            // ⑪ Close Container ボタン押下（強化版）
            console.log('⑪ CloseContainerボタンを探しています...');

            // 複数のセレクタを試行
            const closeButtonSelectors = [
                '[data-testid="ContainerEditor-closeContainerButton"]',
                'button[data-testid="ContainerEditor-closeContainerButton"]',
                '[data-testid*="closeContainer"]',
                'button:contains("Close")',
                'button:contains("close")'
            ];

            let closeContainerButton = null;
            for (let selector of closeButtonSelectors) {
                try {
                    console.log(`セレクタを試行中: ${selector}`);
                    closeContainerButton = await waitForClickableElement(selector, 5000);
                    console.log(`セレクタ成功: ${selector}`);
                    break;
                } catch (e) {
                    console.log(`セレクタ失敗: ${selector} - ${e.message}`);
                    continue;
                }
            }

            if (!closeContainerButton) {
                // 全てのボタンを探してdata-testidを確認
                const allButtons = document.querySelectorAll('button');
                console.log('ページ内の全ボタンのdata-testid:');
                allButtons.forEach((btn, index) => {
                    const testId = btn.getAttribute('data-testid');
                    const text = btn.textContent?.trim();
                    console.log(`  ${index}: data-testid="${testId}", text="${text}"`);
                });

                throw new Error('Close Container ボタンが見つかりません');
            }

            closeContainerButton.click();
            console.log('⑪完了: CloseContainerボタン押下');

            await sleep(1000);

            // ⑫ Enhanced Dialog Submit (1回目)
            console.log('⑫ EnhancedDialog Submit (1回目)');
            const submitButton1 = await waitForElement('[data-testid="EnhancedDialog-submit"]');
            submitButton1.click();
            console.log('⑫完了: EnhancedDialog Submit (1回目)');

            await sleep(1000);

            // ⑬ Enhanced Dialog Submit (2回目)
            console.log('⑬ EnhancedDialog Submit (2回目)');
            const submitButton2 = await waitForElement('[data-testid="EnhancedDialog-submit"]');
            submitButton2.click();
            console.log('⑬完了: EnhancedDialog Submit (2回目)');

            await sleep(3000); // ページ更新を待機

            // ⑭ Add To Shipment ボタン押下
            console.log('⑭ AddToShipmentボタン押下');
            const addToShipmentButton = await waitForElement('[data-testid="ContainerEditor-addToShipment"]');
            addToShipmentButton.click();
            console.log('⑭完了: AddToShipmentボタン押下');

            await sleep(1000);

            // ⑮ Enhanced Dialog Submit
            console.log('⑮ EnhancedDialog Submit');
            const submitButton3 = await waitForElement('[data-testid="EnhancedDialog-submit"]');
            submitButton3.click();
            console.log('⑮完了: EnhancedDialog Submit');

            await sleep(1000);

            // ⑯-1 Containers Picked Up Button (value="1")
            console.log('⑯-1 ContainersPickedUpButton (value="1")');
            const pickedUpButton = await waitForElement('[data-testid="ButtonGroup-NewShipmentModal-containersPickedUpButtonGroup"] button[value="1"]');
            pickedUpButton.click();
            console.log('⑯-1完了: ContainersPickedUpButton (value="1")');

            await sleep(500);

            // ⑯-2 Tracking Number Input (A2セル)
            console.log('⑯-2 TrackingNumber入力 (A2セル)');
            const trackingNumberInput = findInputElement('NewShipmentModal-trackingNumberInput');
            if (!trackingNumberInput) {
                throw new Error('Tracking Number input が見つかりません');
            }
            const a2Value = csvData[currentRow - 1][0] || '';
            simulateTyping(trackingNumberInput, a2Value);
            console.log('⑯-2完了: TrackingNumber入力:', a2Value);

            await sleep(1000);

            // ⑯-3 Date Picker (F2セル - 日付変換)
            console.log('⑯-3 DatePicker入力 (F2セル)');
            const datePickerInput = findInputElement('NewShipmentModal-datePicker');
            if (!datePickerInput) {
                throw new Error('Date Picker input が見つかりません');
            }

            // カーソル移動とDeleteキー押下
            datePickerInput.focus();
            datePickerInput.click();
            simulateKeyPress(datePickerInput, 'Delete', 46);

            await sleep(500);

            // F2セルの日付を変換して入力
            const f2Value = csvData[currentRow - 1][5] || ''; // F2はインデックス5
            const convertedDate = convertDateFormat(f2Value);
            if (convertedDate) {
                simulateTyping(datePickerInput, convertedDate);
                console.log('⑯-3完了: DatePicker入力:', convertedDate);
            }

            await sleep(1000);

            // ⑯-4 Enhanced Dialog Submit
            console.log('⑯-4 EnhancedDialog Submit');
            const submitButton4 = await waitForElement('[data-testid="EnhancedDialog-submit"]');
            submitButton4.click();
            console.log('⑯-4完了: EnhancedDialog Submit');

            await sleep(1000);

            // ⑰-1 Vendor Select Button をタップ
            console.log('⑰-1 VendorSelect Button タップ');
            const vendorSelectButton = await waitForElement('[data-testid="SelectVendorModal-select"] button');
            vendorSelectButton.click();
            console.log('⑰-1完了: VendorSelect Button タップ');

            // ⑰-1と⑰-2の間に適切な待機処理を追加
            console.log('テキストボックスがアクティブになるまで待機中...');
            await sleep(1000); // 基本的な待機時間

            // ⑰-2 CA2セルの会社名プレフィックスを入力（ステップ④-4と同じ方法を使用）
            console.log('⑰-2 VendorSelect 会社名入力 (CA2セル)');

            // アクティブなテキストボックスを待機
            const vendorSelectInput = await waitForActiveInput('SelectVendorModal-select');
            console.log('テキストボックスがアクティブになりました');

            const ca2Value = csvData[currentRow - 1][78] || ''; // CA2はインデックス78 (CA=79列目)
            const companyPrefix = getCompanyPrefix(ca2Value);

            if (companyPrefix) {
                // ステップ④-4と同じsimulateTyping関数を使用
                simulateTyping(vendorSelectInput, companyPrefix);
                console.log('⑰-2 会社名入力完了:', companyPrefix);

                await sleep(1000);

                // ↓キー押下
                simulateKeyPress(vendorSelectInput, 'ArrowDown', 40);

                await sleep(500);

                // Enterキー押下
                simulateKeyPress(vendorSelectInput, 'Enter', 13);

                console.log('⑰-2完了: VendorSelect 会社名入力:', companyPrefix);
            } else {
                console.warn('CA2セルが空欄のため、⑰-2をスキップします');
            }

            await sleep(1000);

            // ⑰-3 EnhancedDialog Submit
            console.log('⑰-3 EnhancedDialog Submit');
            const submitButton5 = await waitForElement('[data-testid="EnhancedDialog-submit"]');
            submitButton5.click();
            console.log('⑰-3完了: EnhancedDialog Submit');

            await sleep(1000);

            // ⑰-4 Radio button "OTHER" (オプション)
            console.log('⑰-4 Radio button "OTHER" 検索中...');
            const otherRadio = await waitForOptionalElement('[data-testid="SelectVendorModal-radio"] input[type="radio"][value="OTHER"]');
            if (otherRadio) {
                otherRadio.click();
                console.log('⑰-4完了: Radio button "OTHER" 押下');
            } else {
                console.log('⑰-4スキップ: Radio button "OTHER" が見つかりません');
            }

            await sleep(500);

            // ⑰-5 SelectVendorModal-select ボタンタップとDelete
            console.log('⑰-5 SelectVendorModal-select ボタンタップとDelete');
            const vendorSelectButton2 = await waitForElement('[data-testid="SelectVendorModal-select"] button');
            vendorSelectButton2.click();
            await sleep(300);
            simulateKeyPress(vendorSelectButton2, 'Delete', 46);
            console.log('⑰-5完了: ボタンタップとDelete');

            await sleep(500);

            // ⑰-6 AU2セルの会社名プレフィックスを入力
            console.log('⑰-6 VendorSelect AU2セル会社名入力');

            const vendorSelectInput2 = await waitForActiveInput('SelectVendorModal-select');
            const au2Value = csvData[currentRow - 1][46] || ''; // AU2はインデックス46 (AU=47列目)
            const companyPrefix2 = getCompanyPrefix(au2Value);

            if (companyPrefix2) {
                simulateTyping(vendorSelectInput2, companyPrefix2);
                console.log('⑰-6 AU2会社名入力完了:', companyPrefix2);

                await sleep(1000);

                // ↓キー押下
                simulateKeyPress(vendorSelectInput2, 'ArrowDown', 40);

                await sleep(500);

                // Enterキー押下
                simulateKeyPress(vendorSelectInput2, 'Enter', 13);

                console.log('⑰-6完了: AU2 VendorSelect 会社名入力:', companyPrefix2);
            } else {
                console.warn('AU2セルが空欄のため、⑰-6をスキップします');
            }

            await sleep(1000);

            // ⑰-7 EnhancedDialog Submit
            console.log('⑰-7 EnhancedDialog Submit');
            const submitButton6 = await waitForElement('[data-testid="EnhancedDialog-submit"]');
            submitButton6.click();
            console.log('⑰-7完了: EnhancedDialog Submit');

            await sleep(1000);

            // ⑰-8 ButtonGroup-undefined value="1" + Tab×2 + Delete
            console.log('⑰-8 ButtonGroup-undefined value="1" + キーボード操作');
            const undefinedButton = await waitForElement('[data-testid="ButtonGroup-undefined"] button[value="1"]');
            undefinedButton.click();
            console.log('⑰-8 ButtonGroup-undefined value="1" 押下完了');

            await sleep(500);

            // Tab×2 + Delete の操作
            await simulateMultipleKeys(document.activeElement || document.body, [
                { key: 'Tab', keyCode: 9 },
                { key: 'Tab', keyCode: 9 },
                { key: 'Delete', keyCode: 46 }
            ]);
            console.log('⑰-8完了: Tab×2とDelete操作');

            await sleep(500);

            // ⑰-9 AddDocumentModal-receptionDate F2日付入力
            console.log('⑰-9 AddDocumentModal-receptionDate F2日付入力');
            const receptionDateInput = findInputElement('AddDocumentModal-receptionDate');
            if (!receptionDateInput) {
                throw new Error('Reception Date input が見つかりません');
            }

            receptionDateInput.focus();
            receptionDateInput.click();

            const f2ValueForReception = csvData[currentRow - 1][5] || ''; // F2はインデックス5
            const convertedDateForReception = convertDateFormat(f2ValueForReception);
            if (convertedDateForReception) {
                simulateTyping(receptionDateInput, convertedDateForReception);
                console.log('⑰-9完了: ReceptionDate入力:', convertedDateForReception);
            }

            await sleep(1000);

            // ⑰-10 AddDocumentModal-documentType ドロップダウン9番目選択
            console.log('⑰-10 DocumentType選択: 9番目');
            await selectDropdownOption('AddDocumentModal-documentType', 9);
            console.log('⑰-10完了: DocumentType 9番目選択');

            await sleep(500);

            // ⑰-11 ButtonGroup-closingPrompt value="0"
            console.log('⑰-11 ButtonGroup-closingPrompt value="0"');
            const closingPromptButton = await waitForElement('[data-testid="ButtonGroup-closingPrompt"] button[value="0"]');
            closingPromptButton.click();
            console.log('⑰-11完了: ButtonGroup-closingPrompt value="0" 押下');

            // 処理完了フラグを設定
            containerEditorCompleted = true;
            console.log('Container Editor処理完了 - 完了フラグを設定しました');
            console.log('全自動化処理が完了しました！');

            // 完了メッセージを表示
            setTimeout(() => {
                showCompletionMessage();
            }, 1000);

        } catch (error) {
            console.error('Container Editorでエラーが発生しました:', error);
            alert(`Container Editorエラー: ${error.message}`);
        } finally {
            isRunning = false;
        }
    }

    // メイン自動化処理
    async function startAutomation() {
        if (!csvData || csvData.length < 2) {
            alert('CSVデータが不正です');
            return;
        }

        isRunning = true;

        try {
            // ② ボタンが表示されるまで待機し、クリック
            console.log('ステップ②: ボタンを待機中...');
            const addButton = await waitForElement('[data-testid="WasteDonationDashboard-addItemManually"]');
            addButton.click();
            console.log('ステップ②完了: ボタンをクリック');

            await sleep(1000);

            // ③ ラジオボタン選択
            console.log('ステップ③: ラジオボタンを選択中...');
            const radioButton = await waitForElement('input[value="WASTE"]');
            radioButton.click();

            await sleep(500);

            const submitButton = await waitForElement('[data-testid="EnhancedDialog-submit"]');
            submitButton.click();
            console.log('ステップ③完了: ラジオボタン選択とSubmit');

            await sleep(1000);

            // ④ 新しいダイアログでの処理
            console.log('ステップ④開始');

            // ④-1 YES ボタン
            const yesButton = await waitForElement('[data-testid="ButtonGroup-EnterItemsManuallyStep1-isInventoryButtonGroup"] button[value="YES"]');
            yesButton.click();
            console.log('ステップ④-1完了: YESボタン');

            await sleep(500);

            // ④-2 ドロップダウン
            const dropdownButton = await waitForElement('[data-testid="EnterItemsManuallyStep1-howObtainItemDropDown"] button');
            dropdownButton.click();

            await sleep(500);

            const firstOption = await waitForElement('[role="listbox"] li:first-child');
            firstOption.click();
            console.log('ステップ④-2完了: ドロップダウン選択');

            await sleep(500);

            // ④-3 Short Description入力 (A2セル)
            const shortDescInput = findInputElement('EnterItemsManuallyStep1-shortDescription');
            if (!shortDescInput) {
                throw new Error('Short Description input が見つかりません');
            }
            const a2Value = csvData[currentRow - 1][0] || '';
            simulateTyping(shortDescInput, a2Value);
            console.log('ステップ④-3完了: Short Description入力:', a2Value);

            await sleep(1000);

            // ④-4 Quantity入力 (1を入力) - 修正版
            const quantityInput = findInputElement('EnterItemsManuallyStep1-quantity');
            if (quantityInput) {
                simulateTyping(quantityInput, '1');
                console.log('ステップ④-4完了: Quantity入力: 1');
            } else {
                console.warn('Quantity入力をスキップ（入力欄が見つかりません）');
            }

            await sleep(1000);

            // 重量データを取得（AP2→BQ2→DJ2の順で優先）
            const currentRowData = csvData[currentRow - 1];
            const weightValue = getWeightValue(currentRowData);

            // ④-5 Total Weight入力 (重量データ)
            const weightInput = findInputElement('EnterItemsManuallyStep1-totalWeight');
            if (weightInput && weightValue) {
                simulateTyping(weightInput, weightValue);
                console.log('ステップ④-5完了: Total Weight入力:', weightValue);
            } else {
                console.warn('Total Weight入力をスキップ（入力欄または重量データが見つかりません）');
            }

            await sleep(1000);

            // ④-6 Next ボタン
            const nextButton = await waitForElement('[data-testid="EnterItemsManuallyModal-next"]:not([disabled])');
            nextButton.click();
            console.log('ステップ④-6完了: Nextボタン');

            await sleep(2000); // 新しいダイアログの読み込みを待機

            // ここから新しい処理 ⑤〜⑧
            console.log('ステップ⑤開始: 新しいダイアログでの処理');

            // S2セルの値を取得（19列目、インデックス18）
            const s2Value = csvData[currentRow - 1][18] || '';
            console.log('S2セル値:', s2Value);

            // ⑤ S2セルが7から始まるかどうかで分岐
            const wasteStreamOption = s2Value.startsWith('7') ? 1 : 2;
            console.log(`⑤ WasteStream選択: ${wasteStreamOption}番目`);
            await selectDropdownOption('SelectWasteProfileForm-wasteStream', wasteStreamOption);

            await sleep(500);

            // ⑥ Physical State - 4番目を選択
            console.log('⑥ PhysicalState選択: 4番目');
            await selectDropdownOption('SelectWasteProfileForm-physicalState', 4);

            await sleep(500);

            // ⑦ データベースを使用してWaste Profileを選択
            console.log('⑦ WasteProfile選択開始');
            const wasteProfileIndex = database[s2Value];

            if (!wasteProfileIndex) {
                alert('データベースに存在しない新たな産廃分類が定義されているようです。本自動化プログラムの管理者に連絡してください。このマニフェストは手動入力してください。プログラムを終了します。');
                isRunning = false;
                return;
            }

            console.log(`⑦ WasteProfile選択: ${wasteProfileIndex}番目 (S2: ${s2Value})`);
            await selectDropdownOption('SelectWasteProfileForm-wasteProfile', wasteProfileIndex);

            await sleep(1000);

            // ⑧ 最後のNextボタン
            console.log('⑧ 最後のNextボタン');
            const finalNextButton = await waitForElement('[data-testid="EnterItemsManuallyModal-next"]:not([disabled])');
            finalNextButton.click();
            console.log('⑧完了: 最後のNextボタン');

            await sleep(2000); // 新しいダイアログの読み込みを待機

            // ⑨ Create New Container ボタン
            console.log('ステップ⑨: Create New Container ボタンを押下');
            const createNewContainerButton = await waitForElement('[data-testid="EnterItemsManuallyModal-CreateNewContainer"]');
            createNewContainerButton.click();
            console.log('ステップ⑨完了: Create New Container ボタン押下');

            console.log('初期処理が完了しました（Container Editorページに遷移中...）');

            // ページ遷移を強制的にチェック（バックアップ）
            console.log('ページ遷移チェックを開始します...');
            setTimeout(() => {
                console.log('5秒後のURL確認:', window.location.href);
                if (window.location.href.includes('/waste-and-donations/containers/editor/waste') && !containerEditorStarted) {
                    console.log('ページ遷移を強制検出 - Container Editor処理を開始します');
                    handleContainerEditor();
                }
            }, 5000);

        } catch (error) {
            console.error('エラーが発生しました:', error);
            alert(`エラー: ${error.message}`);
        } finally {
            isRunning = false;
        }
    }

    // 現在のページURLを判定して適切な処理を実行
    function handleCurrentPage() {
        const currentUrl = window.location.href;
        console.log('handleCurrentPage実行:', currentUrl);

        if (currentUrl.includes('/waste-and-donations/search')) {
            // 検索ページ - CSVファイル読み込みUI表示
            console.log('検索ページを検出 - CSVファイル読み込みUIを表示');
            createFileInput();
        } else if (currentUrl.includes('/waste-and-donations/containers/editor/waste')) {
            // Container Editorページ - 実行状態とフラグをチェック
            console.log('Container Editorページを検出');
            console.log('フラグ状況:', {
                containerEditorStarted,
                containerEditorCompleted,
                isRunning
            });

            if (!containerEditorStarted && !containerEditorCompleted && !isRunning) {
                console.log('Container Editorページ - 自動処理を開始します');
                setTimeout(() => {
                    handleContainerEditor();
                }, 2000); // ページ読み込み完了を待機
            } else {
                console.log('Container Editor処理は既に開始済み/完了済み/実行中です');
            }
        }
    }

    // 初期化
    async function initialize() {
        console.log('スクリプト初期化開始');

        // 重複実行チェック
        const canProceed = await checkDuplicateExecution();
        if (!canProceed) {
            console.log('重複実行により初期化を中止します');
            return;
        }

        initializeDatabase();
        handleCurrentPage();

        // ページ遷移を監視（修正版）
        let lastUrl = location.href;
        console.log('初期URL:', lastUrl);

        const observer = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('ページ遷移を検出:', url);
                // URL変更時のみ処理を実行（ページ内容の更新では実行しない）
                setTimeout(handleCurrentPage, 1000);
            }
        });

        // MutationObserverを正しく設定
        observer.observe(document, { subtree: true, childList: true });
        console.log('MutationObserver設定完了');
    }

    // ページ読み込み後に初期化
    window.addEventListener('load', initialize);

})();