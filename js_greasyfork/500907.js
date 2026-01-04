// ==UserScript==
// @name         名簿ツール
// @namespace    https://greasyfork.org/ja/users/1330985-vrav
// @version      1.0
// @description  女優ページ一覧で新規女優を適切な位置に追加
// @author       vrav
// @license      public domain
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=396556*
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=756401*
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=756418*
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704513*
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704160*
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=1704450*
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=757568*
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=757569*
// @match        https://seesaawiki.jp/w/sougouwiki/e/edit?id=757570*
// @downloadURL https://update.greasyfork.org/scripts/500907/%E5%90%8D%E7%B0%BF%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/500907/%E5%90%8D%E7%B0%BF%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

//                           <<　はじめに　>>
//  当スクリプトは入力欄追加によるスペース分の視認性を確保する為、
//  当wikiの上部とルール欄を非表示にしますので、まだwikiルール内容を理解していない方は、
//  スクリプト有効化前にルールをよく読んでください。
//
//  　　　　　　　　　　　　　　　　　　　<<　使い方　>>
//　女優ページ一覧の編集画面上部にデータ入力欄が表示され、そこでデータを入力し決定ボタンを
//  押すと自動で適切な位置に追加されます。
//  入力欄を使用しなくてもテキストエリアにカーソルがあれば「決定」以外の各種ボタンは使用可能です。
//
//  当スクリプトの使用に関しては全て自己責任でお願いします。

(function () {
    'use strict';
    // テキストエリアを取得
    let textarea = document.getElementById('content');
    let text = textarea.value;
    let upper = '';
    let lower = '';
    let data = '';
    let sections = [];
    let names = [];
    let groupedResult = [];
    let currentSectionIndex = 0;
    let upperLineCount = 0;
    let lowerLineCount = 0;
    let sectionLineCount = 0;
    let popupShown1 = false;
    let popupShown2 = false;
    const dakuonMap = {
        'が': 'か', 'ぎ': 'き', 'ぐ': 'く', 'げ': 'け', 'ご': 'こ',
        'ざ': 'さ', 'じ': 'し', 'ず': 'す', 'ぜ': 'せ', 'ぞ': 'そ',
        'だ': 'た', 'ぢ': 'ち', 'づ': 'つ', 'で': 'て', 'ど': 'と',
        'ば': 'は', 'び': 'ひ', 'ぶ': 'ふ', 'べ': 'へ', 'ぼ': 'ほ',
        'ぱ': 'は', 'ぴ': 'ひ', 'ぷ': 'ふ', 'ぺ': 'へ', 'ぽ': 'ほ',
        'ゔ': 'う'
    };
    const longVowelMap = {
        'あー': 'ああ', 'いー': 'いい', 'うー': 'うう', 'えー': 'ええ', 'おー': 'おお',
        'かー': 'かあ', 'きー': 'きい', 'くー': 'くう', 'けー': 'けえ', 'こー': 'こお',
        'さー': 'さあ', 'しー': 'しい', 'すー': 'すう', 'せー': 'せえ', 'そー': 'そお',
        'たー': 'たあ', 'ちー': 'ちい', 'つー': 'つう', 'てー': 'てえ', 'とー': 'とお',
        'なー': 'なあ', 'にー': 'にい', 'ぬー': 'ぬう', 'ねー': 'ねえ', 'のー': 'のお',
        'はー': 'はあ', 'ひー': 'ひい', 'ふー': 'ふう', 'へー': 'へえ', 'ほー': 'ほお',
        'まー': 'まあ', 'みー': 'みい', 'むー': 'むう', 'めー': 'めえ', 'もー': 'もお',
        'やー': 'やあ', 'ゆー': 'ゆう', 'よー': 'よお',
        'らー': 'らあ', 'りー': 'りい', 'るー': 'るう', 'れー': 'れえ', 'ろー': 'ろお',
        'わー': 'わあ', 'んー': 'んん'
    };
    // 入力フォームとボタンを配置するコンテナを作成
    const container = document.createElement('div');
    // コンテナを2段にわける
    const topDiv = document.createElement('div');
    const bottomDiv = document.createElement('div');
    // 入力ボタン
    const button1 = document.createElement('button');
    button1.textContent = ' [[ ';
    button1.style.marginRight = '30px';
    topDiv.appendChild(button1);
    const button2 = document.createElement('button');
    button2.textContent = ' ]] ';
    button2.style.marginRight = '30px';
    topDiv.appendChild(button2);
    const button3 = document.createElement('button');
    button3.textContent = ' [[ ]] ';
    button3.style.marginRight = '30px';
    topDiv.appendChild(button3);
    const button4 = document.createElement('button');
    button4.textContent = '( ';
    button4.style.marginRight = '30px';
    topDiv.appendChild(button4);
    const button5 = document.createElement('button');
    button5.textContent = ' )';
    button5.style.marginRight = '30px';
    topDiv.appendChild(button5);
    const button6 = document.createElement('button');
    button6.textContent = '（ ）';
    button6.style.marginRight = '30px';
    topDiv.appendChild(button6);
    const button7 = document.createElement('button');
    button7.textContent = ' ＝ ';
    button7.style.marginRight = '30px';
    topDiv.appendChild(button7);
    const button8 = document.createElement('button');
    button8.textContent = ' ⇒ ';
    button8.style.color = 'red';
    button8.style.marginRight = '300px';
    topDiv.appendChild(button8);
    // ラベル
    const Label1 = document.createElement('label');
    Label1.textContent = 'データを入力　';
    bottomDiv.appendChild(Label1);
    const countLabel = document.createElement('label');
    countLabel.textContent = '　　　追加人数';
    topDiv.appendChild(countLabel);
    // 入力欄
    const Input = document.createElement('input');
    Input.type = 'text';
    Input.style.color = 'blue';
    Input.style.width = "860px";
    Input.style.marginRight = '10px';
    bottomDiv.appendChild(Input);
    // Enterキーを無効化
    Input.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 || event.keyCode === 108) {
            event.preventDefault();
        }
    });
    // 決定ボタン
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '決定';
    bottomDiv.appendChild(button);
    // フォーカスがある要素を格納する変数
    let focusedElement;
    // テキストエリアにフォーカスがある場合、focusedElementにテキストエリアを設定
    textarea.addEventListener('focus', () => {
        focusedElement = textarea;
    });
    // 入力フォームにフォーカスがある場合、focusedElementに入力フォームを設定
    Input.addEventListener('focus', () => {
        focusedElement = Input;
    });

    // ボタンが押された時の処理(ifテキストエリア、elseif入力欄)
    button1.addEventListener('click', event => {
        event.preventDefault();
        if (focusedElement === textarea) {
            const cursorPosition = textarea.selectionStart;
            const inputValue = textarea.value;
            textarea.value = inputValue.slice(0, cursorPosition) + '[[' + inputValue.slice(cursorPosition);
            textarea.selectionStart = cursorPosition + 2;
            textarea.selectionEnd = cursorPosition + 2;
            textarea.focus();
        } else if (focusedElement === Input) {
            const cursorPosition = Input.selectionStart;
            const inputValue = Input.value;
            Input.value = inputValue.slice(0, cursorPosition) + '[[' + inputValue.slice(cursorPosition);
            Input.selectionStart = cursorPosition + 2;
            Input.selectionEnd = cursorPosition + 2;
            Input.focus();
        }
    });
    button2.addEventListener('click', event => {
        event.preventDefault();
        if (focusedElement === textarea) {
            const cursorPosition = textarea.selectionStart;
            const inputValue = textarea.value;
            textarea.value = inputValue.slice(0, cursorPosition) + ']]' + inputValue.slice(cursorPosition);
            textarea.selectionStart = cursorPosition + 2;
            textarea.selectionEnd = cursorPosition + 2;
            textarea.focus();
        } else if (focusedElement === Input) {
            const cursorPosition = Input.selectionStart;
            const inputValue = Input.value;
            Input.value = inputValue.slice(0, cursorPosition) + ']]' + inputValue.slice(cursorPosition);
            Input.selectionStart = cursorPosition + 2;
            Input.selectionEnd = cursorPosition + 2;
            Input.focus();
        }
    });
    button3.addEventListener('click', event => {
        event.preventDefault();
        if (focusedElement === textarea) {
            const cursorPosition = textarea.selectionStart;
            const inputValue = textarea.value;
            textarea.value = inputValue.slice(0, cursorPosition) + '[[]]' + inputValue.slice(cursorPosition);
            textarea.selectionStart = cursorPosition + 2;
            textarea.selectionEnd = cursorPosition + 2;
            textarea.focus();
        } else if (focusedElement === Input) {
            const cursorPosition = Input.selectionStart;
            const inputValue = Input.value;
            Input.value = inputValue.slice(0, cursorPosition) + '[[]]' + inputValue.slice(cursorPosition);
            Input.selectionStart = cursorPosition + 2;
            Input.selectionEnd = cursorPosition + 2;
            Input.focus();
        }
    });
    button4.addEventListener('click', event => {
        event.preventDefault();
        if (focusedElement === textarea) {
            const cursorPosition = textarea.selectionStart;
            const inputValue = textarea.value;
            textarea.value = inputValue.slice(0, cursorPosition) + '（' + inputValue.slice(cursorPosition);
            textarea.selectionStart = cursorPosition + 1;
            textarea.selectionEnd = cursorPosition + 1;
            textarea.focus();
        } else if (focusedElement === Input) {
            const cursorPosition = Input.selectionStart;
            const inputValue = Input.value;
            Input.value = inputValue.slice(0, cursorPosition) + '（' + inputValue.slice(cursorPosition);
            Input.selectionStart = cursorPosition + 1;
            Input.selectionEnd = cursorPosition + 1;
            Input.focus();
        }
    });
    button5.addEventListener('click', event => {
        event.preventDefault();
        if (focusedElement === textarea) {
            const cursorPosition = textarea.selectionStart;
            const inputValue = textarea.value;
            textarea.value = inputValue.slice(0, cursorPosition) + '）' + inputValue.slice(cursorPosition);
            textarea.selectionStart = cursorPosition + 1;
            textarea.selectionEnd = cursorPosition + 1;
            textarea.focus();
        } else if (focusedElement === Input) {
            const cursorPosition = Input.selectionStart;
            const inputValue = Input.value;
            Input.value = inputValue.slice(0, cursorPosition) + '）' + inputValue.slice(cursorPosition);
            Input.selectionStart = cursorPosition + 1;
            Input.selectionEnd = cursorPosition + 1;
            Input.focus();
        }
    });
    button6.addEventListener('click', event => {
        event.preventDefault();
        if (focusedElement === textarea) {
            const cursorPosition = textarea.selectionStart;
            const inputValue = textarea.value;
            textarea.value = inputValue.slice(0, cursorPosition) + '（）' + inputValue.slice(cursorPosition);
            textarea.selectionStart = cursorPosition + 1;
            textarea.selectionEnd = cursorPosition + 1;
            textarea.focus();
        } else if (focusedElement === Input) {
            const cursorPosition = Input.selectionStart;
            const inputValue = Input.value;
            Input.value = inputValue.slice(0, cursorPosition) + '（）' + inputValue.slice(cursorPosition);
            Input.selectionStart = cursorPosition + 1;
            Input.selectionEnd = cursorPosition + 1;
            Input.focus();
        }
    });
    button7.addEventListener('click', event => {
        event.preventDefault();
        if (focusedElement === textarea) {
            const cursorPosition = textarea.selectionStart;
            const inputValue = textarea.value;
            textarea.value = inputValue.slice(0, cursorPosition) + '＝' + inputValue.slice(cursorPosition);
            textarea.selectionStart = cursorPosition + 1;
            textarea.selectionEnd = cursorPosition + 1;
            textarea.focus();
        } else if (focusedElement === Input) {
            const cursorPosition = Input.selectionStart;
            const inputValue = Input.value;
            Input.value = inputValue.slice(0, cursorPosition) + '＝' + inputValue.slice(cursorPosition);
            Input.selectionStart = cursorPosition + 1;
            Input.selectionEnd = cursorPosition + 1;
            Input.focus();
        }
    });
    button8.addEventListener('click', event => {
        event.preventDefault();
        if (focusedElement === textarea) {
            const cursorPosition = textarea.selectionStart;
            const inputValue = textarea.value;
            textarea.value = inputValue.slice(0, cursorPosition) + '&color(#ff0000){\'\'⇒\'\'}' + inputValue.slice(cursorPosition);
            textarea.selectionStart = cursorPosition + 22;
            textarea.selectionEnd = cursorPosition + 22;
            textarea.focus();
        } else if (focusedElement === Input) {
            const cursorPosition = Input.selectionStart;
            const inputValue = Input.value;
            Input.value = inputValue.slice(0, cursorPosition) + '&color(#ff0000){\'\'⇒\'\'}' + inputValue.slice(cursorPosition);
            Input.selectionStart = cursorPosition + 22;
            Input.selectionEnd = cursorPosition + 22;
            Input.focus();
        }
    });

    // 上部と下部のdivをコンテナに追加
    container.appendChild(topDiv);
    topDiv.style.paddingLeft = '104px';
    container.appendChild(bottomDiv);
    // テキストエリアを広げる（フルHDに最適化しているので各自の環境に合わせて style.height を調整して下さい）
    const maincontainer = document.getElementById("content");
    maincontainer.style.height = "500px";
    // テキストエリアの前にコンテナを挿入
    maincontainer.parentNode.insertBefore(container, maincontainer);
    // 上部の要素を削除
    const pHeader = document.getElementById('page-header');
    pHeader.parentNode.removeChild(pHeader);
    const ruleArea = document.querySelector('#rule-area');
    ruleArea.parentNode.removeChild(ruleArea);
    const description = document.querySelector('#wiki-description');
    description.parentNode.removeChild(description);
    const header = document.querySelector('#wiki-header');
    header.parentNode.removeChild(header);

    // インプットの初期状態
    Input.value = '-';
    Input.focus();
    Input.setSelectionRange(1, 1);

    // ボタンがクリックされたときの処理
    let count = 0;
    button.addEventListener('click', function (event) {
        event.preventDefault();
        // 最新データに更新
        textarea = document.getElementById('content');
        text = textarea.value;
        text = text.replace(/&#12436;/g, 'ゔ');
        textarea.value = text;
        // データ部を格納する変数を初期化
        data = '';
        sections = [];
        names = [];
        groupedResult = [];
        currentSectionIndex = 0;
        upperLineCount = 0;
        lowerLineCount = 0;
        sectionLineCount = 0;
        popupShown1 = false;
        popupShown2 = false;

        // 入力された文字列を取得
        const inputValue = Input.value;
        // 入力された文字列の不正な文字を検知
        if (inputValue.indexOf('-') !== 0 || inputValue.lastIndexOf('-') !== 0) {
            if (!alert('先頭に - が一つ必要です')) {
                return;
            }
        }
        if (!inputValue.includes('（') || !inputValue.includes('）')) {
            if (!alert('読み仮名の（　）がありません')) {
                return;
            }
        }
        if (inputValue.match(/（.*?）/g).length >= 2) {
            if (!confirm('（　）が2つ以上の場合は、2つめを（よみがな）として認識します。\nよろしいですか？')) {
                return;
            }
        }
        if (!inputValue.includes('・')) {
            if (!confirm('読み仮名に　・　がありません。このまま実行してよろしいですか？')) {
                return;
            }
        }

        // テキストエリアで**から始まる行を探す
        let lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('**')) {
                // ヘッダーの終わりを見つける
                upper = lines.slice(0, i).join('\n');
                upperLineCount = i; // ヘッダーの行数を取得
                break;
            }
        }
        // テキストエリアの最後から数えて**から始まる行を探す
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].startsWith('**')) {
                // フッターの始まりを見つける
                for (let j = i; j < lines.length; j++) {
                    if (lines[j].trim() === '') {
                        lower = lines.slice(j + 1).join('\n');
                        lowerLineCount = lines.length - (j + 1); // フッターの行数を取得
                        break;
                    }
                }
                break;
            }
        }
        // 入力データからカッコ内の文字列を取得・を削除し先頭2文字を取得
        const inputValueM = inputValue.match(/（([^）]+)）/);
        const contentInParentheses = inputValueM ? inputValueM[1] : "";
        const sanitizedContent = contentInParentheses.replace(/・/g, "");
        // 伸ばし文字を変換
        let longT = sanitizedContent;
        for (const longVowel in longVowelMap) {
            longT = longT.replace(longVowel, longVowelMap[longVowel]);
        }
        let firstTwoChars = longT.substring(0, 2);
        // 1文字目を取得
        const firstChar = firstTwoChars.charAt(0);
        // 1文字目の濁音半濁音を変換
        const mappedFirstChar = dakuonMap[firstChar] || firstChar;
        // 2文字目を取得
        const secondChar = firstTwoChars.charAt(1);
        // 2文字目を段の先頭文字に変換
        const mappedSecondChar = secondChar.replace(/[ぁいぃうぅゔえぇおぉ]/g, 'あ').replace(/[きくけこがぎぐげご]/g, 'か').replace(/[しすせそざじずぜぞ]/g, 'さ').replace(/[ちつてとだぢづでど]/g, 'た').replace(/[にぬねの]/g, 'な').replace(/[ひふへほばびぶべぼぱぴぷぺぽ]/g, 'は').replace(/[みむめも]/g, 'ま').replace(/[ゃゆゅよょ]/g, 'や').replace(/[りるれろ]/g, 'ら').replace(/[ゐゑを]/g, 'わ');
        // 1文字目と変換後の2文字目を結合
        firstTwoChars = mappedFirstChar + mappedSecondChar;
        let found = false; // 項目が見つかったかどうかを示すフラグ
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('**') && line.includes(firstTwoChars)) {
                found = true;
                break;
            }
        }
        // ヘッダーとフッターの間のデータ部を探す
        const startDataIndex = text.indexOf(upper) + upper.length;
        const endDataIndex = text.lastIndexOf(lower);
        data = text.slice(startDataIndex, endDataIndex).trim();


        // 入力値をデータエリアの先頭に挿入 ////////////////////
        data = inputValue + '\n' + data;////////////////////////
        ////////////////////////////////////////////////////////


        // データ部から*1つだけ+1文字の行とセクションの行と空白行以外の全ての行を取得
        const dataLines = data.split('\n');
        for (let i = 0; i < dataLines.length; i++) {
            if (dataLines[i].startsWith('**')) {
                sections.push(dataLines[i]);
                sectionLineCount++;
            } else if (dataLines[i].trim() !== '' && !/^\*\w$/.test(dataLines[i]) && !/^\*\S$/.test(dataLines[i])) {
                names.push(dataLines[i]);
            }
        }
        // ネームの中に「-」が含まれていない行があればアラートで処理を停止
        for (let i = 0; i < names.length; i++) {
            if (!names[i].includes('-')) {
                alert('不正な行です。修正して下さい。' + names[i]);
                jumpToLine('content', names[i]); // 関数呼び出し
                return;
            }
        }
        // 全角括弧の有無を確認
        for (let i = 0; i < names.length; i++) {
            if (!/\（.*\）/.test(names[i])) {
                alert("全角括弧が存在しない行があります。該当する行: " + names[i]);
                jumpToLine('content', names[i],); // 関数呼び出し
                return;
            }
        }
        // 「正常な平仮名の読みの（）が見つからなかった場合」、アラートを表示してその行の内容を表示し、処理を停止する
        for (let i = 0; i < names.length; i++) {
            const matches = names[i].match(/（([^）]+)）/g);
            const reading = matches && matches.find(match => /^[/／・ぁ-ゔー]*$/.test(match.slice(1, -1)));
            if (!reading) {
                alert('カッコ内の読み仮名が不正です。該当する行: ' + names[i]);
                jumpToLine('content', names[i],); // 関数呼び出し
                return;
            }
        }
        // 当てはまる**セクションが見つからなかった場合
        if (!found) {
            alert(`「${firstTwoChars}」に当てはまる項目が見つかりません。\n先にテキストエリアに項目を追加して保存して下さい。`);
            return;
        }
        // 手動でのセクションを追加に備えてセクションソート
        sections.sort((a, b) => {
            return a.localeCompare(b, 'ja-JP');
        });

        // ソート実行//////////////////////////
        names.sort(sortNames);/////////////////
        ///////////////////////////////////////

        // セクションごとにネームをグループ化
        for (let i = 0; i < names.length; i++) {
            if (currentSectionIndex < sections.length) {
                // セクションの2文字
                const section = sections[currentSectionIndex].slice(2); // **を除去
                const firstCharS = section.charAt(0);
                const secondCharS = section.charAt(1);
                const nameReading = getReading(names[i]);
                // ネームの先頭2文字を取得
                let firstTwoCharsOfName = nameReading.substring(0, 2);
                // 伸ばし文字を変換
                for (const longVowel in longVowelMap) {
                    firstTwoCharsOfName = firstTwoCharsOfName.replace(longVowel, longVowelMap[longVowel]);
                }
                // 変換後に1文字目、2文字目を取得
                const nameFirstChar = firstTwoCharsOfName.charAt(0);
                const nameSecondChar = firstTwoCharsOfName.charAt(1);
                // 濁音・半濁音を変換する
                const mappedFirstCharS = dakuonMap[nameFirstChar] || nameFirstChar;
                const mappedSecondCharS = nameSecondChar.replace(/[ぁいぃうぅゔえぇおぉ]/g, 'あ').replace(/[きくけこがぎぐげご]/g, 'か').replace(/[しすせそざじずぜぞ]/g, 'さ').replace(/[ちつてとだぢづでど]/g, 'た').replace(/[にぬねの]/g, 'な').replace(/[ひふへほばびぶべぼぱぴぷぺぽ]/g, 'は').replace(/[みむめも]/g, 'ま').replace(/[ゃゆゅよょ]/g, 'や').replace(/[りるれろ]/g, 'ら').replace(/[ゐゑを]/g, 'わ');
                //  配置動作
                if (mappedFirstCharS > firstCharS || (mappedFirstCharS === firstCharS && mappedSecondCharS >= secondCharS)) {
                    groupedResult.push(sections[currentSectionIndex]);
                    currentSectionIndex++;
                }
            }
            groupedResult.push(names[i]);
        }
        // 残ったセクションを追加
        while (currentSectionIndex < sections.length) {
            groupedResult.push(sections[currentSectionIndex]);
            currentSectionIndex++;
        }
        // グループ化された結果に大セクションを追加
        groupedResult = addMajorSections(groupedResult);
        // 配列を文字列に変換
        let resultString = groupedResult.join('\n');
        let lineS = resultString.split('\n');
        // 編集ページの項目により分岐
        let currentUrl = window.location.href;
        // **セクション編集　アンダーバーが2つある場合は開始4行削る
        if ((currentUrl.split("_").length - 1) == 2) {
            console.log('2')
            lineS = lineS.slice(4);
        }
        // *セクション編集とメイン編集は開始3行削る
        else {
            console.log('0')
            lineS = lineS.slice(3);
        }
        // 文字列に戻す
        resultString = lineS.join('\n');
        // ヘッダー、ソート結果、フッターを結合
        const finalResult = upper + resultString + '\n\n' + lower;
        // 結果を文字列として出力
        textarea.value = finalResult;
        // 追加した数をカウント
        count++;
        countLabel.textContent = count + '人追加しました';
        // ジャンプのため最新データに更新
        text = textarea.value;
        lines = text.split('\n');
        // 行番号から行の先頭位置を取得
        const insertedLinePosition = textarea.value.indexOf(inputValue);
        // 挿入された行の行番号を取得
        const insertedLineIndex = lines.indexOf(inputValue);
        // 挿入された行にジャンプし、選択状態にする
        textarea.focus();
        textarea.setSelectionRange(insertedLinePosition, insertedLinePosition + inputValue.length);
        textarea.scrollTop = textarea.scrollHeight * ((insertedLineIndex - 4) / lines.length); // 4行分上に調整
        // 入力欄をクリア
        Input.value = '-';
    })

    // アラート用に自動ジャンプする関数
    function jumpToLine(textareaId, targetText) {
        textarea = document.getElementById(textareaId);
        data = textarea.value;
        // データを選択反転
        let position = data.indexOf(targetText);
        if (position !== -1) {
            // 選択範囲を設定してフォーカスを移動
            textarea.setSelectionRange(position, position + targetText.length);
            textarea.focus();
            // ターゲットの行番号
            let targetLine = data.substring(0, position).split('\n').length;
            let scrollLine = targetLine -10;
            // スクロール
            textarea.scrollTop = (scrollLine / (data.split('\n').length - 1)) * textarea.scrollHeight;
        } else {
            console.warn("テキストエリア内に該当する文字列が見つかりませんでした。");
        }
    }

    // 50音ルールに従ってソートするための関数
    function sortNames(a, b) {
        // ダブルブラケットで囲まれた部分を除去
        const cleanedA = a.replace(/\[\[.*?\]\]/g, '');
        const cleanedB = b.replace(/\[\[.*?\]\]/g, '');
        // 全角括弧内の読みを取得
        const matchesA = cleanedA.match(/（([^）]+)）/g);
        const matchesB = cleanedB.match(/（([^）]+)）/g);
        // 読み仮名のみを取得
        const readingA = matchesA && matchesA.find(match => /^[/／・ぁ-ゔー]*$/.test(match.slice(1, -1)));
        const readingB = matchesB && matchesB.find(match => /^[/／・ぁ-ゔー]*$/.test(match.slice(1, -1)));
        if (!readingA || !readingB) return 0;
        // 50音ルールに従って比較
        return readingA.localeCompare(readingB, 'ja', {ignorePunctuation: true});
    }

    // 読み仮名を取得する関数
    function getReading(name) {
        const matches = name.match(/（([^）]+)）/g);
        const reading = matches && matches.find(match => /^[/／・ぁ-ゔー]*$/.test(match.slice(1, -1)));
        return reading ? reading.slice(1, -1) : '';
    }

    // 大セクションを追加する関数
    function addMajorSections(groupedResult) {
        let resultWithMajorSections = [];
        let currentMajorSection = '';
        groupedResult.forEach(line => {
            if (line.startsWith('**')) {
                const thirdChar = line.charAt(2);
                if (currentMajorSection !== thirdChar) {
                    currentMajorSection = thirdChar;
                    resultWithMajorSections.push(`\n\n*${thirdChar}`);
                    resultWithMajorSections.push('\n' + line);
                } else {
                    resultWithMajorSections.push('\n' + line);
                }
            } else {
                resultWithMajorSections.push(line);
            }
        });
        return resultWithMajorSections;
    }
})();