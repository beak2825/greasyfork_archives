// ==UserScript==
// @name         Yahoo Transit Timetable Filter
// @namespace    dev.kawaidainf.userscript
// @version      1.0
// @description  Yahoo!乗換案内の時刻表にフィルター機能を提供します。
// @author       kawaida
// @match        https://transit.yahoo.co.jp/timetable/*/*
// @grant        none
// @license      3-clause BSD License
// @downloadURL https://update.greasyfork.org/scripts/541592/Yahoo%20Transit%20Timetable%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/541592/Yahoo%20Transit%20Timetable%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 時刻表の行き先・経由の略称と正式名称、およびクラス名サフィックスの対応表を取得する関数。
     * HTMLの .tblDiaNote テーブルから情報を解析します。
     * クラス名サフィックスは、各ユニークな行き先に対して連番を割り振ります。
     * @returns {{destinationMap: Object, uniqueFullNamesMap: Map<string, string>}} 略称（キー）と {fullName: string, classNameSuffix: string} のマップ、および正式名称とクラス名サフィックスのマップ
     */
    function getDestinationInfo() {
        const destinationMap = {}; // 略称をキーとする行き先情報を格納するオブジェクト
        const uniqueFullNamesMap = new Map(); // 正式名称をキーとし、クラス名サフィックスを値とするマップ
        let currentIndex = 0; // クラス名サフィックスのための現在のインデックス

        const destinationList = document.querySelector('#timeNotice2 ul');

        if (destinationList) {
            // li要素を全て取得し、それぞれを処理します
            Array.from(destinationList.children).forEach(li => {
                const textContent = li.textContent.trim(); // テキストコンテンツを取得し、前後の空白を除去
                const parts = textContent.split('：'); // 「：」で分割

                // 分割が成功し、2つの部分があることを確認
                if (parts.length === 2) {
                    let abbreviation = parts[0].trim(); // 略称を取得し、空白を除去
                    const fullName = parts[1].trim(); // 正式名称を取得し、空白を除去

                    // 「無印」の場合は空文字列を略称として使用
                    if (abbreviation === '無印') {
                        abbreviation = '';
                    }

                    let classNameSuffix;
                    // ユニークな正式名称に対してのみ新しいインデックスを割り振る
                    if (!uniqueFullNamesMap.has(fullName)) {
                        classNameSuffix = `dest-${currentIndex}`; // 例: "dest-0", "dest-1"
                        uniqueFullNamesMap.set(fullName, classNameSuffix);
                        currentIndex++;
                    } else {
                        classNameSuffix = uniqueFullNamesMap.get(fullName);
                    }

                    destinationMap[abbreviation] = {
                        fullName: fullName,
                        classNameSuffix: classNameSuffix
                    };
                }
            });
        }
        return { destinationMap: destinationMap, uniqueFullNamesMap: uniqueFullNamesMap };
    }

    /**
     * 時刻表の列車種別の略称と正式名称、およびクラス名サフィックスの対応表を取得する関数。
     * HTMLの .tblDiaNote テーブルから情報を解析します。
     * クラス名サフィックスは、各ユニークな列車種別に対して連番を割り振ります。
     * @returns {{trainTypeMap: Object, uniqueTrainTypesMap: Map<string, string>}} 略称（キー）と {fullName: string, classNameSuffix: string} のマップ、および正式名称とクラス名サフィックスのマップ
     */
    function getTrainTypeInfo() {
        const trainTypeMap = {}; // 略称をキーとする列車種別情報を格納するオブジェクト
        const uniqueFullNamesMap = new Map(); // 正式名称をキーとし、クラス名サフィックスを値とするマップ
        let currentIndex = 0; // クラス名サフィックスのための現在のインデックス

        const trainTypeList = document.querySelector('#timeNotice1 ul');

        if (trainTypeList) {
            // li要素を全て取得し、それぞれを処理します
            Array.from(trainTypeList.children).forEach(li => {
                const textContent = li.textContent.trim(); // テキストコンテンツを取得し、前後の空白を除去
                const parts = textContent.split('：'); // 「：」で分割

                // 分割が成功し、2つの部分があることを確認
                if (parts.length === 2) {
                    let abbreviation = parts[0].trim(); // 略称を取得し、空白を除去
                    const fullName = parts[1].trim(); // 正式名称を取得し、空白を除去

                    // 「無印」の場合は空文字列を略称として使用
                    if (abbreviation === '無印') {
                        abbreviation = ''; // 無印は空文字列として扱う
                    }

                    let classNameSuffix;
                    // ユニークな正式名称に対してのみ新しいインデックスを割り振る
                    if (!uniqueFullNamesMap.has(fullName)) {
                        classNameSuffix = `type-${currentIndex}`; // 例: "type-0", "type-1"
                        uniqueFullNamesMap.set(fullName, classNameSuffix);
                        currentIndex++;
                    } else {
                        classNameSuffix = uniqueFullNamesMap.get(fullName);
                    }

                    trainTypeMap[abbreviation] = {
                        fullName: fullName,
                        classNameSuffix: classNameSuffix
                    };
                }
            });
        }
        return { trainTypeMap: trainTypeMap, uniqueFullNamesMap: uniqueFullNamesMap };
    }

    /**
     * 時刻表の始発マークに関する静的な情報（識別子と正式名称・クラス名サフィックスのマップ）を取得する関数。
     * @returns {Object} 識別子（キー）と {fullName: string, classNameSuffix: string} のマップ
     */
    function getStaticMarkInfoMap() {
        const markInfoMap = {};
        markInfoMap['hasMark'] = { fullName: '始発', classNameSuffix: 'mark-0' };
        markInfoMap['noMark'] = { fullName: 'その他', classNameSuffix: 'mark-1' };
        return markInfoMap;
    }

    /**
     * 現在のフィルター設定に基づいて時刻表の表示を更新する関数。
     * 行き先フィルター、列車種別フィルター、始発フィルターのAND条件で絞り込みます。
     */
    function applyFilters() {
        const allTimeNumbElements = document.querySelectorAll('.tblDiaDetail .timeNumb');

        // 各フィルターUIの存在チェック
        const destinationFilterExists = document.getElementById('destination-filter-container') !== null;
        const trainTypeFilterExists = document.getElementById('train-type-filter-container') !== null;
        const markTypeFilterExists = document.getElementById('mark-type-filter-container') !== null;

        // チェックされている行き先フィルターのサフィックスを取得
        const checkedDestinationSuffixes = Array.from(document.querySelectorAll('.destination-filter-checkbox:checked'))
                                            .map(cb => cb.getAttribute('data-target-suffix'));

        // チェックされている列車種別フィルターのサフィックスを取得
        const checkedTrainTypeSuffixes = Array.from(document.querySelectorAll('.train-type-filter-checkbox:checked'))
                                          .map(cb => cb.getAttribute('data-target-suffix'));

        // チェックされている始発フィルターのサフィックスを取得
        const checkedMarkTypeSuffixes = Array.from(document.querySelectorAll('.mark-type-filter-checkbox:checked'))
                                         .map(cb => cb.getAttribute('data-target-suffix'));

        allTimeNumbElements.forEach(timeNumbLi => {
            // 列車の行き先クラスサフィックスを取得
            const trainDestinationClassList = Array.from(timeNumbLi.classList).filter(cls => cls.startsWith('destination-'));
            const trainDestinationSuffix = trainDestinationClassList.length > 0 ? trainDestinationClassList[0].replace('destination-', '') : '';

            // 列車の列車種別クラスサfiックスを取得
            const trainTypeClassList = Array.from(timeNumbLi.classList).filter(cls => cls.startsWith('train-type-'));
            const trainTypeSuffix = trainTypeClassList.length > 0 ? trainTypeClassList[0].replace('train-type-', '') : '';

            // 列車の始発マーククラスサフィックスを取得
            const trainMarkTypeClassList = Array.from(timeNumbLi.classList).filter(cls => cls.startsWith('mark-type-'));
            const trainMarkTypeSuffix = trainMarkTypeClassList.length > 0 ? trainMarkTypeClassList[0].replace('mark-type-', '') : '';


            // 各フィルター条件を評価
            let isDestinationMatch = true;
            if (destinationFilterExists) {
                // 行き先フィルターUIが存在する場合、チェックされた項目がなければ非表示
                isDestinationMatch = checkedDestinationSuffixes.includes(trainDestinationSuffix);
            }

            let isTrainTypeMatch = true;
            if (trainTypeFilterExists) {
                // 列車種別フィルターUIが存在する場合、チェックされた項目がなければ非表示
                isTrainTypeMatch = checkedTrainTypeSuffixes.includes(trainTypeSuffix);
            }

            let isMarkTypeMatch = true;
            if (markTypeFilterExists) {
                // 始発フィルターUIが存在する場合、チェックされた項目がなければ非表示
                isMarkTypeMatch = checkedMarkTypeSuffixes.includes(trainMarkTypeSuffix);
            }

            // すべての条件を満たす場合のみ表示
            if (isDestinationMatch && isTrainTypeMatch && isMarkTypeMatch) {
                timeNumbLi.classList.remove('hidden-by-filter');
            } else {
                timeNumbLi.classList.add('hidden-by-filter');
            }
        });
    }

    /**
     * フィルターUIを作成し、挿入する共通関数。
     * ユニークな項目が1つ以下の場合、フィルターUIは作成しません。
     * @param {string} containerId - フィルターコンテナのID
     * @param {string} titleText - フィルターセクションのタイトルテキスト
     * @param {Map<string, string>} uniqueNamesMap - 正式名称とクラス名サフィックスのマップ
     * @param {string} filterCheckboxClass - 個別フィルターチェックボックスに付与するクラス名
     * @param {string} targetPrefix - 絞り込み対象要素のクラス名のプレフィックス (例: 'destination', 'train-type', 'mark-type')
     */
    function createFilterUI(containerId, titleText, uniqueNamesMap, filterCheckboxClass, targetPrefix) {
        // ユニークな項目が1つ以下の場合、フィルターUIは作成しない
        if (uniqueNamesMap.size <= 1) {
            console.log(`フィルターUI (${titleText}) は、ユニークな項目が1つ以下であるため作成されません。`);
            return;
        }

        const filterContainer = document.createElement('div');
        filterContainer.id = containerId;
        filterContainer.classList.add('filter-section'); // 共通スタイルクラスを適用
        filterContainer.innerHTML = `<p>${titleText}</p>`;

        // 「すべて選択/解除」チェックボックスのグループを作成
        const selectAllCheckboxGroup = document.createElement('span');
        selectAllCheckboxGroup.classList.add('checkbox-group');

        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = `${containerId}-select-all`;
        selectAllCheckbox.checked = true; // デフォルトでチェック済み

        const selectAllLabel = document.createElement('label');
        selectAllLabel.htmlFor = `${containerId}-select-all`;
        selectAllLabel.textContent = 'すべて選択/解除';
        selectAllLabel.style.cursor = 'pointer';

        selectAllCheckboxGroup.appendChild(selectAllCheckbox);
        selectAllCheckboxGroup.appendChild(selectAllLabel);
        filterContainer.appendChild(selectAllCheckboxGroup);

        // ユニークな項目ごとにチェックボックスを作成し、コンテナに追加
        uniqueNamesMap.forEach((classNameSuffix, fullName) => {
            const checkboxId = `${containerId}-${classNameSuffix}`;
            const checkboxContainer = document.createElement('span');
            checkboxContainer.classList.add('checkbox-group');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxId;
            checkbox.checked = true;
            checkbox.setAttribute('data-target-suffix', classNameSuffix);
            checkbox.classList.add(filterCheckboxClass); // 個別フィルターのクラスを追加

            const label = document.createElement('label');
            label.htmlFor = checkboxId;
            label.textContent = fullName;
            label.style.cursor = 'pointer';

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            filterContainer.appendChild(checkboxContainer);
        });

        // フィルターUIを時刻表の前に挿入
        const mdStaLineDia = document.getElementById('mdStaLineDia');
        if (mdStaLineDia) {
            mdStaLineDia.parentNode.insertBefore(filterContainer, mdStaLineDia);
        }

        // 「すべて選択/解除」チェックボックスのイベントリスナー
        selectAllCheckbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            const individualCheckboxes = document.querySelectorAll(`.${filterCheckboxClass}`);

            individualCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            applyFilters(); // フィルターを再適用
        });

        // 個別フィルターチェックボックスのイベントリスナー
        filterContainer.addEventListener('change', (event) => {
            const targetCheckbox = event.target;

            // 「すべて選択/解除」チェックボックスがクリックされた場合は、このリスナーでは処理しない
            if (targetCheckbox.id === `${containerId}-select-all`) {
                return;
            }

            // ターゲットが個別フィルターチェックボックスであることを確認
            if (targetCheckbox.type === 'checkbox' && targetCheckbox.classList.contains(filterCheckboxClass)) {
                // すべての個別チェックボックスがチェックされているか確認し、「すべて選択/解除」の状態を更新
                const allIndividualCheckboxes = document.querySelectorAll(`.${filterCheckboxClass}`);
                const allChecked = Array.from(allIndividualCheckboxes).every(cb => cb.checked);
                selectAllCheckbox.checked = allChecked;
                applyFilters(); // フィルターを再適用
            }
        });
    }

    /**
     * 時刻テーブルの各列車要素に行き先情報と列車種別情報を付与し、フィルターUIを作成する関数。
     * data属性とクラスを追加し、チェックボックスによる表示/非表示機能を提供します。
     */
    function initializeTimetableFilters() {
        // 行き先情報を取得
        const { destinationMap, uniqueFullNamesMap: uniqueDestinationNamesMap } = getDestinationInfo();
        console.log('行き先・経由の対応表:', destinationMap); // デバッグ用
        console.log('ユニークな行き先とクラス名サフィックスのマップ:', uniqueDestinationNamesMap); // デバッグ用

        // 列車種別情報を取得
        const { trainTypeMap, uniqueFullNamesMap: uniqueTrainTypeNamesMap } = getTrainTypeInfo();
        console.log('列車種別の対応表:', trainTypeMap); // デバッグ用
        console.log('ユニークな列車種別とクラス名サフィックスのマップ:', uniqueTrainTypeNamesMap); // デバッグ用

        // 始発マークの静的な情報マップを取得
        const staticMarkInfoMap = getStaticMarkInfoMap();
        // 実際に存在する始発マークの識別子を収集するSet
        const actualMarkIdentifiersPresent = new Set();


        // 時刻表内のすべての列車要素（.timeNumbクラスを持つli要素）を取得
        const timeNumbElements = document.querySelectorAll('.tblDiaDetail .timeNumb');

        // 各列車要素に対して処理を実行
        timeNumbElements.forEach(timeNumbLi => {
            // 行き先略称の処理
            const trainForDd = timeNumbLi.querySelector('dl dd.trainFor');
            let destinationAbbreviation = '';
            if (trainForDd) {
                destinationAbbreviation = trainForDd.textContent.trim();
            }
            const destData = destinationMap[destinationAbbreviation];
            if (destData) {
                timeNumbLi.setAttribute('data-destination-full', destData.fullName);
                timeNumbLi.classList.add(`destination-${destData.classNameSuffix}`);
            } else {
                console.warn(`不明な行き先略称が見つかりました: "${destinationAbbreviation}"`);
            }

            // 列車種別略称の処理
            const trainTypeDd = timeNumbLi.querySelector('dl dd.trainType');
            let trainTypeAbbreviation = '';
            if (trainTypeDd) {
                // 例: "[準]" から "準" を抽出
                trainTypeAbbreviation = trainTypeDd.textContent.trim().replace(/[\[\]]/g, '');
            }
            const typeData = trainTypeMap[trainTypeAbbreviation];
            if (typeData) {
                timeNumbLi.setAttribute('data-train-type-full', typeData.fullName);
                timeNumbLi.classList.add(`train-type-${typeData.classNameSuffix}`);
            } else {
                // 無印（普通）の場合
                const isNormalTrain = !trainTypeDd && !trainTypeAbbreviation;
                const normalTrainData = trainTypeMap['']; // 無印のデータ
                if (isNormalTrain && normalTrainData) {
                    timeNumbLi.setAttribute('data-train-type-full', normalTrainData.fullName);
                    timeNumbLi.classList.add(`train-type-${normalTrainData.classNameSuffix}`);
                } else {
                    console.warn(`不明な列車種別略称が見つかりました: "${trainTypeAbbreviation}"`);
                }
            }

            // 始発マークの処理
            const markSpan = timeNumbLi.querySelector('dl dt .mark');
            const markIdentifier = markSpan ? 'hasMark' : 'noMark'; // .mark要素の有無で識別
            actualMarkIdentifiersPresent.add(markIdentifier); // 実際に存在するマーク識別子をSetに追加

            const markData = staticMarkInfoMap[markIdentifier];
            if (markData) {
                timeNumbLi.setAttribute('data-mark-type-full', markData.fullName);
                timeNumbLi.classList.add(`mark-type-${markData.classNameSuffix}`);
            } else {
                console.warn(`不明な始発マーク識別子が見つかりました: "${markIdentifier}"`);
            }
        });

        console.log('時刻テーブルに行き先情報、列車種別情報、始発マーク情報を付与しました。'); // デバッグ用

        // 動的にuniqueMarkTypeNamesMapを作成（実際に存在するマークタイプのみ）
        const uniqueMarkTypeNamesMap = new Map();
        actualMarkIdentifiersPresent.forEach(identifier => {
            const data = staticMarkInfoMap[identifier];
            if (data) {
                uniqueMarkTypeNamesMap.set(data.fullName, data.classNameSuffix);
            }
        });
        console.log('ユニークな始発マークとクラス名サフィックスのマップ:', uniqueMarkTypeNamesMap); // デバッグ用


        // フィルターで非表示にするためのCSSルールを動的に追加
        const style = document.createElement('style');
        style.textContent = `
            .hidden-by-filter {
                display: none !important; /* フィルターによって非表示にするためのスタイル */
            }
            .filter-section {
                margin-bottom: 15px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: #f9f9f9;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
            }
            .filter-section > p {
                font-weight: bold;
                color: #333;
                margin-right: 15px; /* タイトルとチェックボックスの間の余白 */
            }
            .checkbox-group {
                display: flex;
                align-items: center;
                margin-right: 15px;
                white-space: nowrap; /* チェックボックスとラベルが改行されないようにする */
            }
            .checkbox-group input[type="checkbox"] {
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style); // head要素にスタイルを追加

        // 行き先フィルターUIを作成
        createFilterUI(
            'destination-filter-container',
            '行き先で絞り込む:',
            uniqueDestinationNamesMap,
            'destination-filter-checkbox',
            'destination'
        );

        // 列車種別フィルターUIを作成
        createFilterUI(
            'train-type-filter-container',
            '列車種別で絞り込む:',
            uniqueTrainTypeNamesMap,
            'train-type-filter-checkbox',
            'train-type'
        );

        // 始発フィルターUIを作成
        createFilterUI(
            'mark-type-filter-container',
            '始発で絞り込む:',
            uniqueMarkTypeNamesMap, // 実際に存在するマークタイプのみを含むマップ
            'mark-type-filter-checkbox',
            'mark-type'
        );

        // 初期表示のためにフィルターを適用
        applyFilters();
    }

    // DOMが完全に読み込まれた後に処理を実行
    window.addEventListener('load', initializeTimetableFilters);

})();
