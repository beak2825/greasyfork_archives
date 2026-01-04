/*
 * Dependencies:

 * GM_info(optional)
 * Docs: https://violentmonkey.github.io/api/gm/#gm_info

 * GM_xmlhttpRequest(optional)
 * Docs: https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest

 * JSZIP
 * Github: https://github.com/Stuk/jszip
 * CDN: https://unpkg.com/jszip@3.7.1/dist/jszip.min.js

 * FileSaver
 * Github: https://github.com/eligrey/FileSaver.js
 * CDN: https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
 */
const ImageDownloader = (({ JSZip, saveAs }) => {
    // 変数の宣言
    let maxNum = 0;
    let promiseCount = 0;
    let fulfillCount = 0;
    let isErrorOccurred = false;
    let createFolder = false;
    let zip = null; // ZIPオブジェクトの初期化
    let addBlankPage = false;
    let imageWidth = 0;
    let imageHeight = 0;

    // elements
    let startNumInputElement = null;
    let endNumInputElement = null;
    let downloadButtonElement = null;
    let panelElement = null;
    let folderRadioYes = null;
    let folderRadioNo = null;
    let folderNameInput = null;
    let zipFileNameInput = null;

    // 初期化関数
    function init({
        maxImageAmount,
        getImagePromises,
        title = `package_${Date.now()}`,
        WidthText = 0,
        HeightText = 0,
        imageSuffix = 'jpg',
        zipOptions = {},
    }) {
        // 値を割り当てる
        maxNum = maxImageAmount;
        imageWidth = WidthText;
        imageHeight = HeightText;
        // UIをセットアップする
        setupUI(title, WidthText, HeightText);
        // ダウンロードボタンにクリックイベントリスナーを追加
        downloadButtonElement.onclick = function () {
            if (!isOKToDownload()) return;

            this.disabled = true;
            this.textContent = '処理中'; // Processing → 処理中
            this.style.backgroundColor = '#aaa';
            this.style.cursor = 'not-allowed';

            download(getImagePromises, title, imageSuffix, zipOptions);
        };
    }

    // スタイルを定義
    const style = document.createElement('style');
    style.textContent = `
    .input-element {
        box-sizing: content-box;
        padding: 1px 1px;
        width: 34px;
        height: 26px;
        border: 1px solid #aaa;
        border-radius: 4px;
        font-family: 'Consolas', 'Monaco';
        font-size: 14px;
        text-align: center;
    }
    .button-element {
        margin-top: 8px;
        margin-left: auto;
        width: 128px;
        height: 48px;
        padding: 5px 5px;
        display: block;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-family: 'BIZ UDPゴシック', 'Arial';
        color: #fff;
        line-height: 1.2;
        background-color: #0984e3;
        border: 3px solidrgb(0, 0, 0);
        border-radius: 4px;
        cursor: pointer;
    }
    .toggle-button {
        position: fixed;
        top: 45px;
        left: 5px;
        z-index: 999999999;
        padding: 2px 5px;
        font-size: 14px;
        font-weight: bold;
        font-family: 'Monaco', 'Microsoft YaHei';
        color: #fff;
        background-color: #000000;
        border: 1px solid #aaa;
        border-radius: 4px;
        cursor: pointer;
    }
    .panel-element {
        position: fixed;
        top: 80px;
        left: 20px;
        z-index: 999999999;
        box-sizing: border-box;
        padding: 0px;
        width: 650px;
        height: auto;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: baseline;
        font-size: 14px;
        font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
        letter-spacing: normal;
        background-color: #f1f1f1;
        border: 1px solid #aaa;
        border-radius: 4px;
    }
    .range-container, .radio-container {
        display: flex;
        justify-content: center;
        align-items: baseline;
    }
    .textarea-element {
        box-sizing: content-box;
        padding: 1px 0px;
        width: 99%;
        min-height: 45px;
        max-height: 200px;
        border: 1px solid #aaa;
        border-radius: 1px;
        font-size: 11px;
        font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
        text-align: left;
        resize: vertical;
        height: auto;
    }
    .to-span {
        margin: 0 6px;
        color: black;
        line-height: 1;
        word-break: keep-all;
        user-select: none;
    }
    `;
    document.head.appendChild(style);

    // UIセットアップ関数
    function setupUI(title, WidthText, HeightText) {
        title = sanitizeFileName(title);

        // トグルボタンの作成
        const toggleButton = document.createElement('button');
        toggleButton.id = 'ImageDownloader-ToggleButton';
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = 'UI OPEN';
        document.body.appendChild(toggleButton);
        let isUIVisible = false; // 初期状態を非表示に設定
        function toggleUI() {
            if (isUIVisible) {
                panelElement.style.display = 'none';
                toggleButton.textContent = 'UI OPEN';
            } else {
                panelElement.style.display = 'flex';
                toggleButton.textContent = 'UI CLOSE';
            }
            isUIVisible = !isUIVisible;
        }
        toggleButton.addEventListener('click', toggleUI);

        // パネル要素の作成
        panelElement = document.createElement('div');
        panelElement.id = 'ImageDownloader-Panel';
        panelElement.className = 'panel-element';

        // 開始番号入力欄の作成
        startNumInputElement = document.createElement('input');
        startNumInputElement.id = 'ImageDownloader-StartNumInput';
        startNumInputElement.className = 'input-element';
        startNumInputElement.type = 'text';
        startNumInputElement.value = 1;

        // 終了番号入力欄の作成
        endNumInputElement = document.createElement('input');
        endNumInputElement.id = 'ImageDownloader-EndNumInput';
        endNumInputElement.className = 'input-element';
        endNumInputElement.type = 'text';
        endNumInputElement.value = maxNum;

        // キーボード入力がブロックされないようにする
        startNumInputElement.onkeydown = (e) => e.stopPropagation();
        endNumInputElement.onkeydown = (e) => e.stopPropagation();

        // 「to」スパン要素の作成
        const toSpanElement = document.createElement('span');
        toSpanElement.id = 'ImageDownloader-ToSpan';
        toSpanElement.className = 'to-span';
        toSpanElement.textContent = 'から'; // to → から

        // ダウンロードボタン要素の作成
        downloadButtonElement = document.createElement('button');
        downloadButtonElement.id = 'ImageDownloader-DownloadButton';
        downloadButtonElement.className = 'button-element';
        downloadButtonElement.textContent = 'ダウンロード'; // Download → ダウンロード

        // 範囲入力コンテナ要素の作成
        const rangeInputContainerElement = document.createElement('div');
        rangeInputContainerElement.id = 'ImageDownloader-RangeInputContainer';
        rangeInputContainerElement.className = 'range-container';

        // ラジオボタンコンテナ要素の作成
        const rangeInputRadioElement = document.createElement('div');
        rangeInputRadioElement.id = 'ImageDownloader-RadioChecker';
        rangeInputRadioElement.className = 'radio-container';

        // ラジオボタンを作成(フォルダ選択用'YES')
        folderRadioYes = document.createElement('input');
        folderRadioYes.type = 'radio';
        folderRadioYes.name = 'createFolder';
        folderRadioYes.value = 'yes';
        folderRadioYes.id = 'createFolderYes';

        // ラジオボタンを作成(フォルダ選択用'No')
        folderRadioNo = document.createElement('input');
        folderRadioNo.type = 'radio';
        folderRadioNo.name = 'createFolder';
        folderRadioNo.value = 'no';
        folderRadioNo.id = 'createFolderNo';
        folderRadioNo.checked = true;

        // フォルダ名入力欄の作成
        folderNameInput = document.createElement('textarea');
        folderNameInput.id = 'folderNameInput';
        folderNameInput.className = 'textarea-element';
        folderNameInput.value = title; // 初期値としてタイトルを使用
        folderNameInput.disabled = true;

        // ZIPファイル名入力欄の作成
        zipFileNameInput = document.createElement('textarea');
        zipFileNameInput.id = 'zipFileNameInput';
        zipFileNameInput.className = 'textarea-element';
        zipFileNameInput.value = `${title}.zip`; // titleを使用してZIPファイル名を設定

        // ラジオボタンのイベントリスナーを追加
        folderRadioYes.addEventListener('change', () => {
            createFolder = true;
            folderNameInput.disabled = false; // フォルダ名入力欄を有効化
        });
        folderRadioNo.addEventListener('change', () => {
            createFolder = false;
            folderNameInput.disabled = true; // フォルダ名入力欄を無効化
        });

        // 白紙ページ追加チェックボックス
        const blankCheckboxLabel = document.createElement('label');
        blankCheckboxLabel.style.marginTop = '8px';
        blankCheckboxLabel.style.display = 'flex';
        blankCheckboxLabel.style.alignItems = 'center';

        const blankCheckbox = document.createElement('input');
        blankCheckbox.type = 'checkbox';
        blankCheckbox.id = 'addBlankPageCheckbox';
        blankCheckbox.style.marginRight = '6px';
        blankCheckbox.checked = false; // ✅ デフォルトは未チェック（白紙OFF）

        const blankCheckboxText = document.createTextNode('白紙ページを先頭に追加（番号001付与）');

        blankCheckbox.addEventListener('change', () => {
            addBlankPage = blankCheckbox.checked;
        });

        // 組み立ててドキュメントに挿入
        rangeInputContainerElement.appendChild(document.createTextNode('ページ取得範囲:'));
        rangeInputContainerElement.appendChild(startNumInputElement);
        rangeInputContainerElement.appendChild(toSpanElement);
        rangeInputContainerElement.appendChild(endNumInputElement);
        panelElement.appendChild(rangeInputContainerElement);
        rangeInputRadioElement.appendChild(document.createTextNode('フォルダ作成:'));
        rangeInputRadioElement.appendChild(folderRadioYes);
        rangeInputRadioElement.appendChild(document.createTextNode('する '));
        rangeInputRadioElement.appendChild(folderRadioNo);
        rangeInputRadioElement.appendChild(document.createTextNode('しない'));
        panelElement.appendChild(rangeInputRadioElement);
        panelElement.appendChild(document.createTextNode('フォルダ名: '));
        panelElement.appendChild(folderNameInput);
        panelElement.appendChild(document.createTextNode('ZIPファイル名: '));
        panelElement.appendChild(zipFileNameInput);
        // サイズ情報の追加（条件付き）
        if (WidthText > 0 && HeightText > 0) {
            panelElement.appendChild(
                document.createTextNode(` サイズ: ${WidthText} x ${HeightText}`)
            );
        }

        blankCheckboxLabel.appendChild(blankCheckbox);
        blankCheckboxLabel.appendChild(blankCheckboxText);
        panelElement.appendChild(blankCheckboxLabel);

        panelElement.appendChild(downloadButtonElement);
        document.body.appendChild(panelElement);
    }

    // ページ番号が正しいか確認する関数
    function isOKToDownload() {
        const startNum = Number(startNumInputElement.value);
        const endNum = Number(endNumInputElement.value);

        if (Number.isNaN(startNum) || Number.isNaN(endNum)) {
            alert('正しい値を入力してください。\nPlease enter page numbers correctly.');
            return false;
        }
        if (!Number.isInteger(startNum) || !Number.isInteger(endNum)) {
            alert('ページ番号は整数である必要があります。\nPage numbers must be integers.');
            return false;
        }
        if (startNum < 1 || endNum < 1) {
            alert(
                'ページ番号は1以上である必要があります。\nPage numbers must be greater than or equal to 1.'
            );
            return false;
        }
        if (startNum > maxNum || endNum > maxNum) {
            alert(
                `ページ番号は最大値(${maxNum})以下である必要があります。\nPage numbers must not exceed ${maxNum}.`
            );
            return false;
        }
        if (startNum > endNum) {
            alert(
                '開始ページ番号は終了ページ番号以下である必要があります。\nStart page number must not exceed end page number.'
            );
            return false;
        }

        return true; // 全ての条件が満たされている場合、trueを返す
    }

    // ダウンロード処理の開始
    async function download(getImagePromises, title, imageSuffix, zipOptions) {
        const startNum = Number(startNumInputElement.value);
        const endNum = Number(endNumInputElement.value);
        promiseCount = endNum - startNum + 1;
        // 画像のダウンロードを開始、同時リクエスト数の上限は4
        let images = [];
        for (let num = startNum; num <= endNum; num += 4) {
            const from = num;
            const to = Math.min(num + 3, endNum);
            try {
                const result = await Promise.all(getImagePromises(from, to));
                images = images.concat(result);
            } catch (error) {
                return; // cancel downloading
            }
        }

        // 白紙ページ追加処理
        if (addBlankPage) {

            if (!imageWidth && images[0]) {
                const firstImg = await createImageBitmap(images[0]);
                imageWidth = firstImg.width;
                imageHeight = firstImg.height;
            }

            const blankCanvas = document.createElement('canvas');
            blankCanvas.width = imageWidth || 800;  // 受け取ったサイズまたは800
            blankCanvas.height = imageHeight || 1200;  // 受け取ったサイズまたは1200
            const ctx = blankCanvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, blankCanvas.width, blankCanvas.height);

            // JPEG blob生成
            const blankBlob = await new Promise(resolve => 
                blankCanvas.toBlob(resolve, 'image/jpeg', 1.0)
            );

            // 先頭に追加
            images.unshift(blankBlob);
        }

        // ZIPアーカイブのファイル構造を設定
        JSZip.defaults.date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
        zip = new JSZip();
        const { folderName, zipFileName } = sanitizeInputs(folderNameInput, zipFileNameInput);
        if (createFolder) {
            const folder = zip.folder(folderName);
            for (const [index, image] of images.entries()) {
                const filename = `${String(index + 1).padStart(3, '0')}.${imageSuffix}`;
                folder.file(filename, image, zipOptions);
            }
        } else {
            for (const [index, image] of images.entries()) {
                const filename = `${String(index + 1).padStart(3, '0')}.${imageSuffix}`;
                zip.file(filename, image, zipOptions);
            }
        }

        // ZIP化を開始し、進捗状況を表示
        const zipProgressHandler = (metadata) => {
            downloadButtonElement.innerHTML = `ZIP書庫作成中(${metadata.percent.toFixed()}%)`;
        };
        const content = await zip.generateAsync({ type: 'blob' }, zipProgressHandler);
        // 「名前を付けて保存」ウィンドウを開く
        saveAs(content, zipFileName);
        // 全て完了
        downloadButtonElement.textContent = '完了しました'; // Completed → 完了しました
    }

    // ファイル名整形用の関数
    function sanitizeFileName(str) {
        return (
            str
                .trim()
                // 全角英数字を半角に変換
                .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
                // 連続する空白（全角含む）を半角スペース1つに統一
                .replace(/[\s\u3000]+/g, ' ')
                // 「!?」または「?!」を「⁉」に置換
                .replace(/[!?][!?]/g, '⁉')
                // 特定の全角記号を対応する半角記号に変換
                .replace(/[！＃＄％＆’，．（）＋－＝＠＾＿｛｝]/g, (s) => {
                    const from = '！＃＄％＆’，．（）＋－＝＠＾＿｛｝';
                    const to = "!#$%&',.()+-=@^_{}";
                    return to[from.indexOf(s)];
                })
                // ファイル名に使えない文字をハイフンに置換
                .replace(/[\\/:*?"<>|]/g, '-')
        );
    }

    // folderNameとzipFileNameの整形処理関数
    function sanitizeInputs(folderNameInput, zipFileNameInput) {
        const folderName = sanitizeFileName(folderNameInput.value);
        const zipFileName = sanitizeFileName(zipFileNameInput.value);
        return { folderName, zipFileName };
    }

    // プロミスが成功した場合の処理
    function fulfillHandler(res) {
        if (!isErrorOccurred) {
            fulfillCount++;
            downloadButtonElement.innerHTML = `処理中(${fulfillCount}/${promiseCount})`;
        }
        return res;
    }

    // プロミスが失敗した場合の処理
    function rejectHandler(err) {
        isErrorOccurred = true;
        console.error(err);
        downloadButtonElement.textContent = 'エラーが発生しました'; // Error Occurred → エラーが発生しました
        downloadButtonElement.style.backgroundColor = 'red';
        return Promise.reject(err);
    }

    return { init, fulfillHandler, rejectHandler };
})(window);
