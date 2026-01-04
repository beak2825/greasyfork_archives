// ==UserScript==
// @name         NovelAI Mod
// @namespace    https://www6.notion.site/dc99953d5f04405c893fba95dace0722
// @version      26
// @description  Extention for NovelAI Image Generator. Fast Suggestion, Chant, Save in JPEG, Get aspect ratio.
// @author       SenY
// @match        https://novelai.net/image
// @match        https://novelai.github.io/image
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/481718/NovelAI%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/481718/NovelAI%20Mod.meta.js
// ==/UserScript==

/**
 * NOVEIAI用のユーザースクリプト - グローバル変数と設定
 * 
 * このファイルは、main.js、control.jsと順番に読み込まれ、同じスコープで実行されます。
 * 変数や関数は共有されるため、globalへ持たせる必要はありません。
 */

// 定数と設定
const SUGGESTION_LIMIT = 500;
const colors = {
    "-1": ["red", "maroon"],
    "0": ["lightblue", "dodgerblue"],
    "1": ["gold", "goldenrod"],
    "3": ["violet", "darkorchid"],
    "4": ["lightgreen", "darkgreen"],
    "5": ["tomato", "darksalmon"],
    "6": ["red", "maroon"],
    "7": ["whitesmoke", "black"],
    "8": ["seagreen", "darkseagreen"]
};

// グローバル変数
let lastTyped = new Date();
let suggested_at = new Date();
let chants = [];
let allTags = [];
let chantURL;
let tagNameIndex = new Map();
let tagTermsIndex = new Map();

/**
 * NOVEIAI用のユーザースクリプト - メイン機能
 * 
 * このファイルは、global.jsの後に読み込まれ、control.jsの前に読み込まれます。
 * 同じスコープで実行されるため、変数や関数は共有されます。
 */

// ユーティリティ関数
const gcd = (a, b) => b == 0 ? a : gcd(b, a % b);
const getAspect = whArray => whArray.map(x => x / gcd(whArray[0], whArray[1]));

const aspectList = (wa, ha, maxpixel = 1024 * 1024) => {
    let aspect = wa / ha;
    let limit = 16384;
    let steps = 64;
    let ws = Array.from({ length: (limit - steps) / steps + 1 }, (_, i) => (i + 1) * steps);
    let hs = ws.slice();
    return ws.flatMap(w => hs.map(h => w / h === aspect && w * h <= maxpixel ? [w, h] : null)).filter(Boolean);
};

const getChantURL = force => {
    if (force === true) {
        localStorage.removeItem("chantURL");
    }
    let url = localStorage.getItem("chantURL") || prompt("Input your chants json url.\nThe URL must be a Cors-enabled server (e.g., gist.github.com).", "https://gist.githubusercontent.com/vkff5833/989808aadebf8648831955cdf2a7b3e3/raw/yuuri.json");
    if (url) localStorage.setItem("chantURL", url);
    return url;
};

/**
 * 画像のDataURLを取得する
 * @param {string} mode - 'current'または'uploaded'
 * @returns {Promise<string|null>} 画像のDataURL
 */
const getImageDataURL = async (mode) => {
    console.debug(`Getting image DataURL for mode: ${mode}`);
    try {
        if (mode === "current") {
            const imgs = Array.from(document.querySelectorAll('img[src]')).filter(x => x.offsetParent);
            const url = imgs.reduce((max, img) => img.height > max.height ? img : max).src || document.querySelector('img[src]')?.src;
            if (!url) {
                console.debug("No image URL found");
                return null;
            }
            console.debug("Found image URL:", url.substring(0, 50) + "...");
            const response = await fetch(url);
            const blob = await response.blob();
            return await new Promise(resolve => {
                let reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } else if (mode === "uploaded") {
            const uploadInput = document.getElementById('naimodUploadedImage');
            const previewImage = document.getElementById('naimodPreviewImage');
            if (uploadInput && uploadInput.files[0]) {
                return await new Promise(resolve => {
                    let reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(uploadInput.files[0]);
                });
            } else if (previewImage && previewImage.src) {
                return previewImage.src;
            }
            return null;
        }
    } catch (error) {
        console.error("Error getting image DataURL:", error);
        return null;
    }
};

/**
 * タグの改善提案をAIに要求する
 * @param {string} tags - 現在のタグリスト
 * @param {string} imageDataURL - 画像のDataURL
 * @returns {Promise<Object|false>} 改善提案の結果
 */
async function ImprovementTags(tags, imageDataURL) {
    console.debug("Starting tag improvement process");
    console.debug("ImprovementTags function called with tags:", tags);

    // タグの_を半角スペースに置換
    tags = tags.replace(/_/g, " ");

    const apiKey = document.getElementById('geminiApiKey').value;
    if (!apiKey) {
        alert("Gemini API Keyが設定されていません。設定画面でAPIキーを入力してください。");
        return false;
    }
    console.debug("API Key found:", apiKey.substring(0, 5) + "...");

    const model = document.getElementById('geminiModel').value;
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    console.debug("ENDPOINT:", ENDPOINT);

    let prompt = `以下に示すのはdanbooruのタグを用いて画像を生成するNovelAIの機能で、添付の画像を生成する為に用意したタグの一覧です。

${tags}

- 実際の画像の内容と列挙されたタグ一覧の、比較検討とブラッシュアップを行ってください。
- 不要と判断したタグを列挙してください。例えば顔しか映っていない画像なのにスカートや靴下に関する言及がある場合や、顔が映らない構図なのに瞳の色や表情に言及がある場合、黒髪のキャラしか居ないのにblonde hairと記述されるなど明らかに的外れなタグが含まれている場合などは、それらを除去する必要があります。(should remove)
- それとは逆に、新たに付与するべきであると考えられるタグがある場合は列挙してください。(should add)
- また、客観的に画像から読み取って付与するべきと判断したタグ以外に、追加することでより表現が豊かになると考えられるタグがあれば、それも提案してください。例えば文脈上付与した方がよりリアリティが増すと思われるアクセサリや小物を示すタグ、より効果的な表現を得る為に付与するのが好ましいと思われるエフェクトのタグなどです。
これらの内容は元々の画像には含まれていない要素であるべきです。(may add)
- 固有名詞と思われる認識不能なタグに関しては無視してください。
- また、NovelAI系ではない自然文のプロンプトで画像生成をする場合に用いるプロンプトも別途提案してください。実際の画像や上記のshouldRemove,shouldAdd,mayAddの内容を踏襲し、2000文字程度の自然言語の英文で表現してください。

返信はJSON形式で以下のスキーマに従ってください。

{
"shouldRemove": [string]
"shouldAdd": [string]
"mayAdd": [string],
"naturalLanguagePrompt": [string]
}
`;
    console.debug("Prompt prepared:", prompt);

    const payload = {
        method: 'POST',
        headers: {},
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: imageDataURL.split(',')[1] } }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 1.0,
                "max_output_tokens": 4096
            },
            safetySettings: [
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "OFF"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "OFF"
                },
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "OFF"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "OFF"
                }
            ]
        }),
        mode: 'cors'
    };
    console.debug("Payload prepared:", payload);

    let result;
    try {
        console.debug("Sending fetch request to Gemini API");
        const response = await fetch(ENDPOINT, payload);
        console.debug("Response received:", response);
        const data = await response.json();
        console.debug("Response data:", data);
        result = data.candidates[0].content.parts[0].text;
        result = result.replace('```json\n', '').replace('\n```', '');
        result = JSON.parse(result);
        // 結果のタグも_を半角スペースに置換
        result.shouldRemove = result.shouldRemove.map(tag => tag.replace(/_/g, " "));
        result.shouldAdd = result.shouldAdd.map(tag => tag.replace(/_/g, " "));
        result.mayAdd = result.mayAdd.map(tag => tag.replace(/_/g, " "));
        console.debug("Parsed result:", result);
    } catch (error) {
        console.error('エラー:', error);
        alert("AI改善の処理中にエラーが発生しました。");
        return false;
    }
    return result || false;
}

/**
 * 現在の画像をJPEG形式で保存する
 */
const saveJpeg = async () => {
    console.debug("Starting JPEG save process");

    // シードボタンの検索
    const seedButton = Array.from(document.querySelectorAll('span[style]')).find(x => x.textContent.trim().match(/^[0-9]*(seed|シード)/i))?.closest("button");
    console.debug("Found seed button:", seedButton);

    // シード値の取得
    let seed = Array.from(seedButton.querySelectorAll("span")).find(x => x.textContent.match(/^[0-9]*$/))?.textContent;
    console.debug("Extracted seed:", seed);

    let filename = `${seed}.jpg`;
    console.debug("Generated filename:", filename);

    // 画像データの取得
    console.debug("Getting image DataURL...");
    const dataURI = await getImageDataURL("current");
    if (!dataURI) {
        throw new Error("Failed to get image DataURL");
    }
    console.debug("Got DataURL, length:", dataURI.length);

    // 画像オブジェクトの作成
    console.debug("Creating Image object...");
    let image = new Image();
    image.src = dataURI;

    console.debug("Waiting for image to load...");
    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Failed to load image"));
    });
    console.debug("Image loaded, dimensions:", image.width, "x", image.height);

    // キャンバスの作成と描画
    console.debug("Creating canvas...");
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    console.debug("Drawing image to canvas...");
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    // JPEG形式への変換
    console.debug("Converting to JPEG...");
    let quality = document.getElementById("jpegQuality")?.value || 0.85;
    console.debug("Using JPEG quality:", quality);
    let JPEG = canvas.toDataURL("image/jpeg", quality);
    console.debug("JPEG conversion complete, data length:", JPEG.length);

    // ダウンロードリンクの作成と実行
    console.debug("Creating download link...");
    let link = document.createElement('a');
    link.href = JPEG;
    link.download = filename;
    console.debug("Triggering download...");
    link.click();

    console.debug("JPEG save process completed successfully");
};

const updateImageDimensions = (w, h) => {
    document.querySelectorAll('input[type="number"][step="64"]').forEach((x, i) => {
        x.value = [w, h][i];
        x._valueTracker = '';
        x.dispatchEvent(new Event('input', { bubbles: true }));
    });
};

/**
 * エディタのコンテンツを設定する
 * @param {string} content - 設定するコンテンツ
 * @param {Element} editor - 対象のエディタ要素
 * @param {Object} options - カーソル位置などのオプション
 */
const setEditorContent = (content, editor, options = {}) => {
    console.debug("Setting editor content", { contentLength: content.length });
    if (!editor) {
        console.error("Editor is required for setEditorContent");
        return;
    }

    const { cursorPosition } = options;

    editor.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = content;
    editor.appendChild(p);
    editor.dispatchEvent(new Event('input', { bubbles: true }));

    // カーソル位置の復元
    if (typeof cursorPosition === 'number') {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(p.firstChild, Math.min(cursorPosition, content.length));
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
};

/**
 * エディタ内の絶対カーソル位置を計算する
 * @param {Element} editor - 対象のエディタ要素
 * @returns {number} 絶対カーソル位置
 */
const getAbsoluteCursorPosition = (editor) => {
    console.debug("Calculating absolute cursor position");
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // カーソルが含まれている要素を特定
    const currentElement = range.startContainer.nodeType === 3 ?
        range.startContainer.parentNode :
        range.startContainer;

    // 全てのp要素を取得
    const allPs = Array.from(editor.querySelectorAll("p"));
    let absoluteCursorPosition = 0;

    // カーソル位置までの文字数を計算
    for (let p of allPs) {
        if (p === currentElement || p.contains(currentElement)) {
            // 現在のp要素内の文字数を計算
            let currentPText = "";
            for (let node of p.childNodes) {
                if (node === currentElement) {
                    // 現在の要素までの文字数を加算
                    currentPText += node.textContent.slice(0, range.startOffset);
                    break;
                } else if (node.contains(currentElement)) {
                    // 現在の要素を含む子要素までの文字数を加算
                    let nodeText = "";
                    for (let child of node.childNodes) {
                        if (child === currentElement) {
                            nodeText += child.textContent.slice(0, range.startOffset);
                            break;
                        } else if (child.contains(currentElement)) {
                            // 再帰的に子要素を探索
                            let childText = "";
                            for (let grandChild of child.childNodes) {
                                if (grandChild === currentElement) {
                                    childText += grandChild.textContent.slice(0, range.startOffset);
                                    break;
                                } else if (grandChild.contains(currentElement)) {
                                    childText += grandChild.textContent;
                                }
                            }
                            nodeText += childText;
                            break;
                        } else {
                            nodeText += child.textContent;
                        }
                    }
                    currentPText += nodeText;
                    break;
                } else {
                    currentPText += node.textContent;
                }
            }
            absoluteCursorPosition += currentPText.length;
            break;
        }
        absoluteCursorPosition += p.textContent.length + 1; // +1 は改行文字の分
    }
    console.debug("Absolute cursor position:", absoluteCursorPosition);
    return absoluteCursorPosition;
};

/**
 * 現在のカーソル位置のタグを取得する
 * @param {Element} editor - 対象のエディタ要素
 * @param {number} position - カーソル位置
 * @returns {string|undefined} カーソル位置のタグ
 */
const getCurrentTargetTag = (editor, position) => {
    console.debug("Getting current target tag at position:", position);
    const content = Array.from(editor.querySelectorAll("p"))
        .map(p => p.textContent)
        .join("\n");
    // カンマまたは改行で分割（連続する区切り文字は1つとして扱う）
    const splitTags = (text) =>
        text.split(/[,\n]+/).map(x => x.trim()).filter(Boolean);
    const oldTags = splitTags(content);
    const beforeCursor = content.slice(0, position);
    const beforeTags = splitTags(beforeCursor);
    const targetTag = beforeTags[beforeTags.length - 2];
    const result = oldTags[oldTags.indexOf(targetTag) + 1]?.trim();
    return result;
};

// タグを削除する関数を修正
const removeTagsFromPrompt = (tagsToRemove, editor, options = {}) => {
    if (!editor || !tagsToRemove?.length) return;

    const { cursorPosition } = options;
    const content = Array.from(editor.querySelectorAll("p"))
        .map(p => p.textContent)
        .join("\n");
    const oldTags = content.split(/[,\n]+/).map(x => x.trim()).filter(Boolean);

    // 削除対象のタグを除外
    const tags = oldTags.filter(tag => !tagsToRemove.includes(tag));

    setEditorContent(tags.join(", ") + ", ", editor, { cursorPosition });
};

// appendTagsToPromptを修正
const appendTagsToPrompt = (tagsToAdd, editor, options = {}) => {
    if (!editor) {
        console.error("Editor is required for appendTagsToPrompt");
        return;
    }
    if (!tagsToAdd?.length) return;

    const position = window.getLastCursorPosition();
    const { removeIncompleteTag } = options;
    const content = Array.from(editor.querySelectorAll("p"))
        .map(p => p.textContent)
        .join("\n");
    const oldTags = content.split(/[,\n]+/).map(x => x.trim()).filter(Boolean);
    console.log(oldTags, oldTags.includes(removeIncompleteTag), removeIncompleteTag);
    const targetTag = getCurrentTargetTag(editor, position);

    let tags = oldTags.flatMap(tag =>
        tag === targetTag ? [tag, ...tagsToAdd] : [tag]
    );

    if (!targetTag) {
        tags = [...tags, ...tagsToAdd];
    }

    tags = [...new Set(tags.filter(Boolean))];

    if (removeIncompleteTag) {
        tags = tags.filter(tag => tag !== removeIncompleteTag);
    }

    setEditorContent(tags.join(", ") + ", ", editor, { cursorPosition: position });
};

/**
 * タグの強調度を調整する
 * @param {number} value - 調整値（正: 強調、負: 抑制）
 * @param {Element} editor - 対象のエディタ要素
 * @param {Object} options - オプション
 */
const adjustTagEmphasis = (value, editor, options = {}) => {
    console.debug("Adjusting tag emphasis", { value });
    if (!editor) {
        console.error("Editor is required for adjustTagEmphasis");
        return;
    }

    const position = window.getLastCursorPosition();
    const targetTag = getCurrentTargetTag(editor, position);

    if (targetTag) {
        const getTagEmphasisLevel = tag =>
            tag.split("").filter(x => x === "{").length -
            tag.split("").filter(x => x === "[").length;

        const content = Array.from(editor.querySelectorAll("p"))
            .map(p => p.textContent)
            .join("\n");
        const oldTags = content.split(/[,\n]+/).map(x => x.trim()).filter(Boolean);

        let tags = oldTags.map(tag => {
            if (tag === targetTag) {
                let emphasisLevel = getTagEmphasisLevel(targetTag) + value;
                tag = tag.replace(/[\{\}\[\]]/g, "");
                return emphasisLevel > 0 ? '{'.repeat(emphasisLevel) + tag + '}'.repeat(emphasisLevel) :
                    emphasisLevel < 0 ? '['.repeat(-emphasisLevel) + tag + ']'.repeat(-emphasisLevel) : tag;
            }
            return tag;
        }).filter(Boolean);

        setEditorContent(tags.join(", ") + ", ", editor, { cursorPosition: position });
    }
};

// 初期化時にインデックスを構築
const buildTagIndices = () => {
    allTags.forEach(tag => {
        // 名前のインデックス
        const normalizedName = tag.name.toLowerCase().replace(/_/g, " ");
        tagNameIndex.set(normalizedName, tag);

        // 別名のインデックス
        tag.terms.forEach(term => {
            const normalizedTerm = term.toLowerCase().replace(/_/g, " ");
            if (!tagTermsIndex.has(normalizedTerm)) {
                tagTermsIndex.set(normalizedTerm, new Set());
            }
            tagTermsIndex.get(normalizedTerm).add(tag);
        });
    });
};

// showTagSuggestionsの中のフィルタリング部分を修正
const getTagSuggestions = (targetTag, limit = 20) => {
    const normalizedTarget = targetTag.toLowerCase()
        .replace(/_/g, " ")
        .replace(/[\{\}\[\]\\]/g, "");

    const results = new Set();

    // 名前での検索
    for (const [name, tag] of tagNameIndex) {
        if (name.includes(normalizedTarget)) {
            results.add(tag);
            if (results.size >= limit) break;
        }
    }

    // 結果が不足している場合は別名も検索
    if (results.size < limit) {
        for (const [term, tags] of tagTermsIndex) {
            if (term.includes(normalizedTarget)) {
                for (const tag of tags) {
                    results.add(tag);
                    if (results.size >= limit) break;
                }
            }
            if (results.size >= limit) break;
        }
    }

    return Array.from(results).slice(0, limit);
};

/**
 * タグの提案を表示する
 * @param {Element} targetEditor - 対象のエディタ要素
 * @param {number} position - カーソル位置
 */
const showTagSuggestions = (targetEditor = null, position = null) => {
    console.debug("=== Start showTagSuggestions ===");

    const editor = targetEditor || window.getLastFocusedEditor();
    if (editor) {
        const cursorPosition = position ?? window.getLastCursorPosition();
        let targetTag = getCurrentTargetTag(editor, cursorPosition)?.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');

        let suggestionField = editor.closest(".relative")?.querySelector("#suggestionField") ||
            document.getElementById("suggestionField");

        if (suggestionField) {
            suggestionField.textContent = "";

            if (targetTag) {
                let suggestions = getTagSuggestions(targetTag);
                console.debug(`Found ${suggestions.length} suggestions for tag: ${targetTag}`);

                let done = new Set();
                suggestions.forEach(tag => {
                    if (!done.has(tag.name)) {
                        const incompleteTag = targetTag;

                        let button = createButton(
                            `${tag.name} (${tag.coumt > 1000 ? `${(Math.round(tag.coumt / 100) / 10)}k` : tag.coumt})`,
                            colors[tag.category][1],
                            () => appendTagsToPrompt([tag.name], editor, {
                                removeIncompleteTag: incompleteTag
                            })
                        );
                        button.title = tag.terms.filter(Boolean).join(", ");
                        suggestionField.appendChild(button);

                        if (editor.textContent.split(",").map(y => y.trim().replace(/_/g, " ").replace(/[\{\}\[\]\\]/g, "")).includes(tag.name.replace(/_/g, " "))) {
                            button.style.opacity = 0.5;
                        }
                        done.add(tag.name);
                    }
                });
            }
        }
    }
    console.debug("=== End showTagSuggestions ===");
};

// UIコンポーネントの作成関数
const createSettingsModal = () => {
    let modal = document.getElementById("naimod-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "naimod-modal";
        modal.className = "naimod-modal";

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        let settingsContent = document.createElement("div");
        settingsContent.className = "naimod-settings-content";

        // 2ペインコンテナ
        const twoPane = document.createElement("div");
        twoPane.className = "naimod-modal-two-pane";

        // 左ペイン（Settings）
        const settingsPane = document.createElement("div");
        settingsPane.className = "naimod-modal-pane settings-pane";

        // Settings タイトル
        const settingsTitle = document.createElement("h2");
        settingsTitle.textContent = "Settings";
        settingsTitle.className = "naimod-section-title";
        settingsPane.appendChild(settingsTitle);

        // Reset Chants URLセクション
        settingsPane.appendChild(createResetChantsSection());

        // API Settings セクション
        settingsPane.appendChild(createAPIKeySection());

        // 画像ソース選択セクション
        settingsPane.appendChild(createImageSourceSection());

        // 右ペイン（Operation）
        const operationPane = document.createElement("div");
        operationPane.className = "naimod-modal-pane operation-pane";

        // Operation タイトル
        const operationTitle = document.createElement("h2");
        operationTitle.textContent = "AI Improvements";
        operationTitle.className = "naimod-section-title";
        operationPane.appendChild(operationTitle);

        // Suggest AI Improvementsボタンを操作セクション直下に配置
        const initialButtonContainer = document.createElement("div");
        initialButtonContainer.className = "naimod-button-container";
        const suggestButton = createButton("Suggest AI Improvements", "blue", async () => {
            console.debug("Suggest AI Improvements clicked");

            const rightPane = document.querySelector(".naimod-pane.right-pane");
            if (!rightPane) {
                console.error("Right pane not found");
                return;
            }

            // 自然言語プロンプトの状態をリセット
            const naturalLanguagePrompt = document.getElementById("naturalLanguagePrompt");
            const copyButton = naturalLanguagePrompt?.parentElement?.querySelector("button");
            if (naturalLanguagePrompt) {
                naturalLanguagePrompt.textContent = "Waiting for AI suggestions...";
                if (copyButton) copyButton.style.display = "none";
            }

            // lastFocusedEditorからタグを取得
            const editor = window.getLastFocusedEditor();
            if (!editor) {
                console.error("No editor is focused");
                rightPane.innerHTML = "Please focus on a tag editor first";
                naturalLanguagePrompt.textContent = "";
                if (copyButton) copyButton.style.display = "none";
                return;
            }

            console.debug("Getting tags from editor");
            const tags = editor.textContent.trim();
            console.debug("Current tags:", tags);

            if (tags) {
                rightPane.innerHTML = "Waiting for AI suggestions...";
                suggestButton.disabled = true;
                suggestButton.textContent = "Processing...";

                console.debug("Getting image source");
                let imageSource = document.getElementById("imageSource").value;
                console.debug("Image source:", imageSource);

                console.debug("Getting image DataURL");
                let imageDataURL = await getImageDataURL(imageSource);

                if (!imageDataURL) {
                    console.error("Failed to get image DataURL");
                    rightPane.innerHTML = "";
                    naturalLanguagePrompt.textContent = "";
                    if (copyButton) copyButton.style.display = "none";
                    suggestButton.disabled = false;
                    suggestButton.textContent = "Suggest AI Improvements";
                    return;
                }
                console.debug("Got image DataURL, length:", imageDataURL.length);

                console.debug("Calling ImprovementTags");
                let result = await ImprovementTags(tags, imageDataURL);
                console.debug("ImprovementTags result:", result);

                if (result) {
                    displaySuggestions(result, rightPane);
                }
                suggestButton.disabled = false;
                suggestButton.textContent = "Suggest AI Improvements";
            } else {
                console.error("No tags found in editor");
                rightPane.innerHTML = "No tags found in editor";
                naturalLanguagePrompt.textContent = "";
                if (copyButton) copyButton.style.display = "none";
            }
        });
        suggestButton.className = "naimod-operation-button";
        initialButtonContainer.appendChild(suggestButton);
        operationPane.appendChild(initialButtonContainer);

        // AIサジェスト関連セクション
        const suggestSection = document.createElement("div");
        suggestSection.className = "naimod-operation-section";

        // Danbooru Tags セクションタイトル
        const danbooruTitle = document.createElement("h3");
        danbooruTitle.textContent = "Danbooru Tags";
        danbooruTitle.className = "naimod-section-title";
        suggestSection.appendChild(danbooruTitle);

        // タグ提案表示域
        const rightPane = document.createElement("div");
        rightPane.className = "naimod-pane right-pane";
        suggestSection.appendChild(rightPane);

        operationPane.appendChild(suggestSection);

        // 自然言語プロンプトセクションを修正
        const createNaturalLanguageSection = () => {
            const container = document.createElement("div");
            container.className = "naimod-natural-language-container";

            const title = document.createElement("h3");
            title.textContent = "Natural Language Prompt";
            title.className = "naimod-section-title";
            container.appendChild(title);

            const content = document.createElement("div");
            content.id = "naturalLanguagePrompt";
            content.className = "naimod-natural-language-content";
            content.textContent = "";
            container.appendChild(content);

            return container;
        };

        operationPane.appendChild(createNaturalLanguageSection());

        // ペインを追加
        twoPane.appendChild(settingsPane);
        twoPane.appendChild(operationPane);
        settingsContent.appendChild(twoPane);

        // 閉じるボタンセクション
        settingsContent.appendChild(createCloseButtonSection(modal));

        modal.appendChild(settingsContent);
        document.body.appendChild(modal);
    }
    return modal;
};

const createAPIKeySection = () => {
    const section = document.createElement("div");
    section.className = "naimod-section";

    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent = "Gemini Settings";
    sectionTitle.className = "naimod-section-title";
    section.appendChild(sectionTitle);

    // APIキー入力フィールド
    let apiKeyInput = document.createElement("input");
    apiKeyInput.type = "text";
    apiKeyInput.id = "geminiApiKey";
    apiKeyInput.className = "naimod-input";
    apiKeyInput.placeholder = "Enter Gemini API Key";
    apiKeyInput.value = localStorage.getItem("geminiApiKey") || "";
    apiKeyInput.style.width = "100%";
    apiKeyInput.style.padding = "5px";
    apiKeyInput.style.marginBottom = "10px";
    apiKeyInput.addEventListener("change", () => {
        localStorage.setItem("geminiApiKey", apiKeyInput.value);
    });

    // モデル選択セレクトボックス
    const modelSelect = document.createElement("select");
    modelSelect.id = "geminiModel";
    modelSelect.className = "naimod-input";
    modelSelect.style.width = "100%";
    modelSelect.style.padding = "5px";
    modelSelect.style.marginBottom = "10px";

    const models = [
        "gemini-2.0-flash-lite-preview",
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash-thinking-exp",
        "gemini-2.0-pro-exp",
        "gemini-2.5-pro-exp-03-25"
    ];

    models.forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });

    // 保存された値があれば復元
    modelSelect.value = localStorage.getItem("geminiModel") || "gemini-2.0-flash-thinking-exp";

    modelSelect.addEventListener("change", () => {
        localStorage.setItem("geminiModel", modelSelect.value);
    });

    section.appendChild(apiKeyInput);
    section.appendChild(modelSelect);
    return section;
};

const createResetChantsSection = () => {
    const section = document.createElement("div");
    section.className = "naimod-section";
    section.style.marginBottom = "20px";

    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent = "Chant Settings";
    sectionTitle.className = "naimod-section-title";
    section.appendChild(sectionTitle);

    // リセットボタン
    let resetButton = createButton("Reset Chants URL", "red", () => {
        chantURL = getChantURL(true);
        initializeApplication();
    });
    resetButton.className = "naimod-button";

    section.appendChild(resetButton);
    return section;
};

const createImageSourceSection = () => {
    const section = document.createElement("div");
    section.className = "naimod-image-source-container";

    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent = "Image Source";
    sectionTitle.className = "naimod-section-title";
    section.appendChild(sectionTitle);

    // 画像ソース選択UI
    const { imageSourceSelect, uploadContainer } = createImageSourceUI();
    section.appendChild(imageSourceSelect);
    section.appendChild(uploadContainer);

    return section;
};

const createTwoPaneSection = () => {
    const section = document.createElement("div");
    section.className = "naimod-operation-section";

    // Danbooru Promptセクション
    const danbooruTitle = document.createElement("h3");
    danbooruTitle.textContent = "Danbooru Prompt";
    danbooruTitle.className = "naimod-section-title";
    section.appendChild(danbooruTitle);

    // ボタンコンテナ
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "naimod-button-container";
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginBottom = "15px";

    // Suggest AI Improvementsボタン
    let suggestButton = createButton("Suggest AI Improvements", "blue", async () => {
        console.debug("Suggest AI Improvements clicked");

        const rightPane = document.querySelector(".naimod-pane.right-pane");
        if (!rightPane) {
            console.error("Right pane not found");
            return;
        }

        // 自然言語プロンプトの状態をリセット
        const naturalLanguagePrompt = document.getElementById("naturalLanguagePrompt");
        const copyButton = naturalLanguagePrompt?.parentElement?.querySelector("button");
        if (naturalLanguagePrompt) {
            naturalLanguagePrompt.textContent = "Waiting for AI suggestions...";
            if (copyButton) copyButton.style.display = "none";
        }

        // lastFocusedEditorからタグを取得
        const editor = window.getLastFocusedEditor();
        if (!editor) {
            console.error("No editor is focused");
            rightPane.innerHTML = "Please focus on a tag editor first";
            naturalLanguagePrompt.textContent = "";
            if (copyButton) copyButton.style.display = "none";
            return;
        }

        console.debug("Getting tags from editor");
        const tags = editor.textContent.trim();
        console.debug("Current tags:", tags);

        if (tags) {
            rightPane.innerHTML = "Waiting for AI suggestions...";
            suggestButton.disabled = true;
            suggestButton.textContent = "Processing...";

            console.debug("Getting image source");
            let imageSource = document.getElementById("imageSource").value;
            console.debug("Image source:", imageSource);

            console.debug("Getting image DataURL");
            let imageDataURL = await getImageDataURL(imageSource);

            if (!imageDataURL) {
                console.error("Failed to get image DataURL");
                rightPane.innerHTML = "";
                naturalLanguagePrompt.textContent = "";
                if (copyButton) copyButton.style.display = "none";
                suggestButton.disabled = false;
                suggestButton.textContent = "Suggest AI Improvements";
                return;
            }
            console.debug("Got image DataURL, length:", imageDataURL.length);

            console.debug("Calling ImprovementTags");
            let result = await ImprovementTags(tags, imageDataURL);
            console.debug("ImprovementTags result:", result);

            if (result) {
                displaySuggestions(result, rightPane);
            }
            suggestButton.disabled = false;
            suggestButton.textContent = "Suggest AI Improvements";
        } else {
            console.error("No tags found in editor");
            rightPane.innerHTML = "No tags found in editor";
            naturalLanguagePrompt.textContent = "";
            if (copyButton) copyButton.style.display = "none";
        }
    });
    suggestButton.className = "naimod-operation-button";

    // Apply Suggestionsボタン
    let applyButton = createButton("Apply Suggestions", "green", () => {
        console.debug("Apply Suggestions clicked");

        const editor = window.getLastFocusedEditor();
        if (!editor) {
            console.error("No editor is focused");
            return;
        }

        const rightPane = document.querySelector(".naimod-pane.right-pane");
        if (!rightPane) {
            console.error("Right pane not found");
            return;
        }

        console.debug("Getting enabled tags");
        let enabledTags = Array.from(rightPane.querySelectorAll('button[data-enabled="true"]'))
            .map(button => button.textContent.replace(/_/g, " "));
        console.debug("Enabled tags:", enabledTags);

        if (enabledTags.length > 0) {
            setEditorContent(enabledTags.join(", ") + ", ", editor);
            console.debug("Applied tags to editor");

            // モーダルを閉じる
            const modal = document.getElementById("naimod-modal");
            if (modal) {
                modal.style.display = "none";
                console.debug("Closed modal");
            }
        } else {
            console.debug("No enabled tags found");
        }
    });
    applyButton.className = "naimod-operation-button";

    buttonContainer.appendChild(suggestButton);
    buttonContainer.appendChild(applyButton);
    section.appendChild(buttonContainer);

    // タグ提案表示域
    const suggestionPane = document.createElement("div");
    suggestionPane.className = "naimod-pane right-pane";
    section.appendChild(suggestionPane);

    return section;
};

// ポップアップの位置を調整する関数を修正
const adjustPopupPosition = (popup) => {
    const rect = popup.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    // 現在の位置を取得（getBoundingClientRectを使用）
    const currentTop = rect.top;
    const currentLeft = rect.left;

    // 新しい位置を設定（window.scrollY/Xを考慮）
    const newTop = Math.min(Math.max(0, currentTop + window.scrollY), maxY + window.scrollY);
    const newLeft = Math.min(Math.max(0, currentLeft + window.scrollX), maxX + window.scrollX);

    // 位置を設定（pxを付与）
    popup.style.top = `${newTop}px`;
    popup.style.left = `${newLeft}px`;

    // 位置を保存
    savePopupPosition(popup);
};

// MutationObserverでポップアップの高さ変更を監視
const observePopupSize = (popup) => {
    const observer = new MutationObserver((mutations) => {
        adjustPopupPosition(popup);
    });

    observer.observe(popup, {
        attributes: true,
        childList: true,
        subtree: true
    });
};

// ポップアップの位置を保存（廃止してsavePopupStateに統合）
const savePopupPosition = (popup) => {
    savePopupState(popup);
};

// ポップアップの状態を復元を修正
const restorePopupState = (popup) => {
    const savedState = localStorage.getItem('naimodPopupState');
    if (savedState) {
        const state = JSON.parse(savedState);

        // 位置の復元（初期値を設定）
        popup.style.top = state.position.top || '20px';
        popup.style.left = state.position.left || '20px';
        popup.style.width = state.size?.width || '300px';

        // 開閉状態の復元
        const content = popup.querySelector('.naimod-popup-content');
        const foldButton = popup.querySelector('.naimod-toggle-button');
        if (state.isCollapsed) {
            content.style.display = 'none';
            foldButton.innerHTML = '🟥';
        } else {
            content.style.display = 'block';
            foldButton.innerHTML = '🟩';
        }

        // attach/detach状態の復元
        document.body.dataset.naimodAttached = state.isAttached ? "1" : "0";
    } else {
        // デフォルト値の設定
        popup.style.top = '20px';
        popup.style.left = '20px';
        popup.style.width = '300px';
        document.body.dataset.naimodAttached = "1";
    }

    // 位置の調整のみ実行（保存はしない）
    requestAnimationFrame(() => {
        const rect = popup.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        const newTop = Math.min(Math.max(0, rect.top + window.scrollY), maxY + window.scrollY);
        const newLeft = Math.min(Math.max(0, rect.left + window.scrollX), maxX + window.scrollX);
        popup.style.top = `${newTop}px`;
        popup.style.left = `${newLeft}px`;
    });
};

// ポップアップの状態を保存も更新
const savePopupState = (popup) => {
    const state = {
        position: {
            top: popup.style.top,
            left: popup.style.left
        },
        size: {
            width: popup.style.width
        },
        isCollapsed: popup.querySelector('.naimod-popup-content').style.display === 'none',
        isAttached: document.body.dataset.naimodAttached === "1"
    };
    console.debug("Saving popup state:", state);
    localStorage.setItem('naimodPopupState', JSON.stringify(state));
};

// ドラッグ機能の実装を修正（位置保存を追加）
const makeDraggable = (element, handle) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;

    // マウスイベントハンドラー
    const dragMouseDown = (e) => {
        if (e.target === handle || e.target.parentElement === handle) {
            e.preventDefault();
            startDragging(e.clientX, e.clientY);
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }
    };

    // タッチイベントハンドラー
    const dragTouchStart = (e) => {
        if (e.target === handle || e.target.parentElement === handle) {
            e.preventDefault();
            const touch = e.touches[0];
            startDragging(touch.clientX, touch.clientY);
            document.addEventListener('touchend', closeDragElement);
            document.addEventListener('touchmove', elementDragTouch);
        }
    };

    // ドラッグ開始時の共通処理
    const startDragging = (clientX, clientY) => {
        isDragging = true;
        pos3 = clientX;
        pos4 = clientY;
    };

    // マウスでのドラッグ
    const elementDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        updateElementPosition(e.clientX, e.clientY);
    };

    // タッチでのドラッグ
    const elementDragTouch = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        updateElementPosition(touch.clientX, touch.clientY);
    };

    // 位置更新の共通処理
    const updateElementPosition = (clientX, clientY) => {
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;

        const newTop = element.offsetTop - pos2;
        const newLeft = element.offsetLeft - pos1;

        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;

        element.style.top = `${Math.min(Math.max(0, newTop), maxY)}px`;
        element.style.left = `${Math.min(Math.max(0, newLeft), maxX)}px`;
    };

    // ドラッグ終了時の共通処理
    const closeDragElement = () => {
        isDragging = false;
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('touchend', closeDragElement);
        document.removeEventListener('touchmove', elementDragTouch);
        savePopupPosition(element);
    };

    // イベントリスナーの設定
    handle.addEventListener('mousedown', dragMouseDown);
    handle.addEventListener('touchstart', dragTouchStart, { passive: false });
};

/**
 * メインUIを作成する
 * @returns {Element} 作成されたUIのルート要素
 */
const createMainUI = () => {
    console.debug("Creating main UI");
    // 既存のポップアップがあれば削除
    const existingEmbeddings = document.getElementById("naimod-popup");
    if (existingEmbeddings) {
        existingEmbeddings.remove();
    }

    // メインのポップアップコンテナ
    const popup = document.createElement("div");
    popup.id = "naimod-popup";
    popup.className = "naimod-popup";

    // ヘッダー部分
    const header = document.createElement("div");
    header.className = "naimod-popup-header";

    // タイトル
    const title = document.createElement("h2");
    title.textContent = "NovelAI Mod";
    header.appendChild(title);

    // ボタンコンテナ
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "naimod-button-container";

    // 初期状態の設定
    document.body.dataset.naimodAttached = "1"; // デフォルトはattach状態

    // ボタンを追加
    buttonContainer.appendChild(createFoldButton(popup));
    buttonContainer.appendChild(createSettingsButton());
    buttonContainer.appendChild(createDetachButton());

    header.appendChild(buttonContainer);

    // コンテンツ部分
    const content = document.createElement("div");
    content.className = "naimod-popup-content";
    content.id = "naimod-popup-content";

    // 設置場所未定。後で考える。
    //const jpegButton = createButton("JPEG", "green", saveJpeg);

    // Chantsフィールドのタイトルとフィールド
    const chantsSection = document.createElement("div");
    chantsSection.className = "naimod-section";
    const chantsTitle = document.createElement("h3");
    chantsTitle.textContent = "Chants";
    chantsTitle.className = "naimod-section-title";
    chantsSection.appendChild(chantsTitle);
    const chantsField = document.createElement("div");
    chantsField.id = "chantsField";
    chantsField.className = "naimod-chants-field";
    addChantsButtons(chantsField);
    chantsSection.appendChild(chantsField);
    content.appendChild(chantsSection);

    // サジェストフィールドのタイトルとフィールド
    const suggestSection = document.createElement("div");
    suggestSection.className = "naimod-section";
    const suggestTitle = document.createElement("h3");
    suggestTitle.textContent = "Tag Suggestions";
    suggestTitle.className = "naimod-section-title";
    suggestSection.appendChild(suggestTitle);
    const suggestionField = document.createElement("div");
    suggestionField.id = "suggestionField";
    suggestionField.className = "naimod-suggestion-field";
    suggestSection.appendChild(suggestionField);
    content.appendChild(suggestSection);

    // 関連タグフィールドのタイトルとフィールド
    const relatedSection = document.createElement("div");
    relatedSection.className = "naimod-section";
    const relatedTitle = document.createElement("h3");
    relatedTitle.textContent = "Related Tags";
    relatedTitle.className = "naimod-section-title";
    relatedSection.appendChild(relatedTitle);
    const relatedTagsField = document.createElement("div");
    relatedTagsField.id = "relatedTagsField";
    relatedTagsField.className = "naimod-related-tags-field";
    relatedSection.appendChild(relatedTagsField);
    content.appendChild(relatedSection);

    popup.appendChild(header);
    popup.appendChild(content);

    // スタイルの追加
    addStyles();

    // 状態を復元（位置と開閉状態）
    restorePopupState(popup);

    // ドラッグ可能にする
    makeDraggable(popup, header);

    // サイズ変更の監視を開始
    observePopupSize(popup);

    // リサイズハンドルを設定
    setupResizeHandles(popup);

    return popup;
};

const createEmbeddingsUI = () => {
    console.debug("Creating embeddings UI");
    // 既存のポップアップがあれば削除
    const existingEmbeddings = document.getElementById("naimod-embeddings");
    if (existingEmbeddings) {
        existingEmbeddings.remove();
    }

    const ui = document.createElement("div");
    ui.id = "naimod-embeddings";
    ui.className = "naimod-embeddings";

    const header = document.createElement("div");
    header.className = "naimod-popup-header";

    const title = document.createElement("h2");
    title.textContent = "NovelAI Mod";
    header.appendChild(title);

    // ボタンコンテナ
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "naimod-button-container";

    // settingsとattachボタンのみを追加
    buttonContainer.appendChild(createSettingsButton());
    buttonContainer.appendChild(createDetachButton());

    header.appendChild(buttonContainer);

    ui.appendChild(header);

    const content = document.createElement("div");
    content.id = "naimod-embeddings-content";
    content.className = "naimod-embeddings-content";
    ui.appendChild(content);

    // イベントリスナーを修正
    ui.addEventListener("click", (e) => {
        // クリックされた要素がbuttonまたはその子要素の場合
        const button = e.target.closest('button');
        if (button) {
            // ポップアップ内の対応するボタンを探す
            const popupContent = document.querySelector('#naimod-popup-content');
            if (popupContent) {
                // ボタンのテキストコンテンツを取得
                const buttonText = button.textContent.trim();
                const matchingButton = Array.from(popupContent.querySelectorAll('button'))
                    .find(btn => btn.textContent.trim() === buttonText);

                // 一致するボタンが見つかった場合はクリックイベントを発火
                if (matchingButton) {
                    matchingButton.click();
                }
            }
        }
        
        // カテゴリヘッダーのクリック処理を追加
        const categoryHeader = e.target.closest('.naimod-category-header');
        if (categoryHeader) {
            const popupContent = document.querySelector('#naimod-popup-content');
            if (popupContent) {
                // カテゴリヘッダーのテキストコンテンツを取得（カテゴリ名と数を含む）
                const headerText = categoryHeader.querySelector('span:first-child').textContent.trim();
                
                // ポップアップ内の対応するカテゴリヘッダーを探す
                const matchingHeader = Array.from(popupContent.querySelectorAll('.naimod-category-header'))
                    .find(header => header.querySelector('span:first-child').textContent.trim() === headerText);
                
                // 一致するヘッダーが見つかった場合はクリックイベントを発火
                if (matchingHeader) {
                    matchingHeader.click();
                    clonePopupContentsToEmbeddings();
                }
            }
        }
    });

    return ui;
};

const clonePopupContentsToEmbeddings = () => {
    const content = document.querySelector("#naimod-embeddings-content");
    content.innerHTML = document.querySelector("#naimod-popup-content").innerHTML;
    
    // カテゴリコンテンツの表示状態を同期
    const popupCategories = document.querySelectorAll("#naimod-popup-content .naimod-category-container");
    const embeddingCategories = document.querySelectorAll("#naimod-embeddings-content .naimod-category-container");
    
    if (popupCategories.length === embeddingCategories.length) {
        for (let i = 0; i < popupCategories.length; i++) {
            const popupContent = popupCategories[i].querySelector('.naimod-category-content');
            const embeddingContent = embeddingCategories[i].querySelector('.naimod-category-content');
            
            if (popupContent && embeddingContent) {
                // 表示状態を同期
                embeddingContent.style.display = popupContent.style.display;
                
                // ドロップダウンアイコンも同期
                const popupIcon = popupCategories[i].querySelector('.naimod-dropdown-icon');
                const embeddingIcon = embeddingCategories[i].querySelector('.naimod-dropdown-icon');
                
                if (popupIcon && embeddingIcon) {
                    embeddingIcon.textContent = popupIcon.textContent;
                }
            }
        }
    }
};

// スタイルの追加を修正
const addStyles = () => {
    if (document.getElementById('naimod-styles')) return;

    const style = document.createElement('style');
    style.id = 'naimod-styles';
    style.textContent = `

/* ==========================================================================
   基本設定
   ========================================================================== */
#imageSource {
    color: black;
}

/* ==========================================================================
   モーダル基本レイアウト
   ========================================================================== */
.naimod-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    overflow: hidden;
}

.naimod-settings-content {
    width: 90%;
    max-width: 1200px;
    height: 90vh;
    padding: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 64, 0.9);
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* ==========================================================================
   ポップアップ関連
   ========================================================================== */
.naimod-popup {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: rgba(0, 0, 64, 0.9);
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 10000;
    width: 300px;
    max-height: 90vh;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    color: white;
    user-select: none;
    display: flex;
    flex-direction: column;
    opacity: 0.85;
    position: relative;
    min-width: 200px;
    max-width: 800px;
}

.naimod-popup-header {
    padding: 0px 10px;
    background-color: rgba(0, 0, 80, 0.95);
    border-bottom: 1px solid #ccc;
    cursor: move;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    flex-shrink: 0;
}

.naimod-popup-header h2 {
    margin: 0;
    font-size: 0.9em;
    pointer-events: none;
}

.naimod-popup-content {
    padding: 5px;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    flex: 1;
    min-height: 0;
}
.naimod-resize-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 6px;
    cursor: ew-resize;
    z-index: 1000;
}
.naimod-resize-handle.left {
    left: -3px;
}
.naimod-resize-handle.right {
    right: -3px;
}
/* ==========================================================================
   埋め込みモード
   ========================================================================== */
#naimod-embeddings-content {
    background-color: rgba(0, 0, 64, 0.9);
}

.naimod-embeddings-content {
    padding: 5px;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    flex: 1;
    min-height: 0;
}

body[data-naimod-attached="1"] #__next {
    width: calc(100% - 20vh) !important;
    right: 0;
}

body[data-naimod-attached="1"] #naimod-embeddings {
    width: 20vh;
    right: 0;
    height: 100vh;
}

body[data-naimod-attached="1"] #naimod-embeddings .naimod-popup-header {
    height: 5vh;
}
    
body[data-naimod-attached="1"] #naimod-embeddings .naimod-embeddings-content {
    height: 95vh;
}

body[data-naimod-attached="1"] #naimod-popup {
    visibility: hidden;
}

body[data-naimod-attached="1"] .naimod-toggle-button-anchor {
    display: none;
}

body[data-naimod-attached="1"] .naimod-toggle-button-ship {
    display: block;
} 

body[data-naimod-attached="0"] .naimod-toggle-button-anchor {
    display: block;
}

body[data-naimod-attached="0"] .naimod-toggle-button-ship {
    display: none;
}

@media screen and (max-width: 900px) {
    body[data-naimod-attached="1"] #__next {
        top: 5vh;
    }
    body[data-naimod-attached="1"] #__next {
        width: 100% !important;
    }
    body[data-naimod-attached="1"] #naimod-embeddings {
        width: 100% !important;
    }
    body[data-naimod-attached="1"] #naimod-embeddings-content {
        display: none;
    }
    body[data-naimod-attached="1"] .naimod-search-suggestion-menu {
        display: none;
    }
    body[data-naimod-attached="1"] .naimod-contextmenu-suggestion-title {
        display: none;
    }
    body[data-naimod-attached="1"] .naimod-contextmenu-suggestions {
        margin-top: 0;
        border-top: none;
        padding-top: 0;
    }
}

/* ==========================================================================
   2ペインレイアウト
   ========================================================================== */
.naimod-modal-two-pane {
    display: flex;
    gap: 20px;
    flex: 1;
    overflow: hidden;
    padding-bottom: 70px;
}

.naimod-modal-pane {
    padding: 20px;
    background-color: rgba(0, 0, 32, 0.5);
    border-radius: 8px;
    overflow-y: auto;
    max-height: 100%;
}

.settings-pane {
    width: 300px;
    flex-shrink: 0;
}

.operation-pane {
    flex: 1;
    min-width: 600px;
}


/* ==========================================================================
   コントロール要素
   ========================================================================== */
/* ボタン */
.naimod-button {
    background: none;
    border: 1px solid currentColor;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 3px;
    cursor: pointer;
    color: white;
    transition: opacity 0.3s;
}

.naimod-button:hover {
    opacity: 0.8;
}

.naimod-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.naimod-operation-button {
    flex: 1;
    padding: 8px 15px;
    font-size: 1em;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.naimod-operation-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.naimod-operation-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.naimod-operation-button[data-color="blue"] {
    border-color: rgba(52, 152, 219, 0.5);
}

.naimod-operation-button[data-color="green"] {
    border-color: rgba(46, 204, 113, 0.5);
}

/* 入力フィールド */
.naimod-input {
    width: 100%;
    padding: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
    font-size: 14px;
}

.naimod-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background-color: rgba(0, 0, 0, 0.3);
}

.naimod-toggle-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    padding: 0 5px;
    z-index: 1;
}

/* ==========================================================================
   タグ関連
   ========================================================================== */
.naimod-tag-button {
    background-color: white;
    border: 1px solid currentColor;
    padding: 3px 8px;
    margin: 3px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s;
}

.naimod-tag-button:hover {
    opacity: 0.8;
}

.naimod-tag {
    display: inline-block;
    padding: 2px 8px;
    margin: 2px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    color: white;
}

/* ==========================================================================
   画像アップロード関連
   ========================================================================== */
.naimod-image-source-container {
    background-color: rgba(0, 0, 32, 0.5);
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
}

.naimod-upload-container {
    width: 100%;
    height: 200px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    cursor: pointer;
    position: relative;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

.naimod-preview-image {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 5px;
}

/* ==========================================================================
   スクロールバー
   ========================================================================== */
.naimod-natural-language-content::-webkit-scrollbar,
.naimod-pane.right-pane::-webkit-scrollbar {
    width: 8px;
}

.naimod-natural-language-content::-webkit-scrollbar-track,
.naimod-pane.right-pane::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.naimod-natural-language-content::-webkit-scrollbar-thumb,
.naimod-pane.right-pane::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}

.naimod-natural-language-content::-webkit-scrollbar-thumb:hover,
.naimod-pane.right-pane::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* ==========================================================================
   レスポンシブ対応
   ========================================================================== */
@media screen and (max-width: 1400px) {
    .naimod-settings-content {
        max-width: 1000px;
    }
}

@media screen and (max-width: 1200px) {
    .naimod-settings-content {
        max-width: 900px;
    }
}

@media screen and (max-width: 1000px) {
    .naimod-settings-content {
        max-width: 800px;
    }
}

@media screen and (max-width: 900px) {
    .naimod-settings-content {
        width: 95%;
        height: 95vh;
        margin: 0;
        padding: 10px;
    }

    .naimod-modal-two-pane {
        flex-direction: column;
        gap: 10px;
        min-height: auto;
    }

    .settings-pane,
    .operation-pane {
        width: 100%;
        min-width: 0;
    }

    .naimod-operation-section {
        height: auto;
        min-height: 400px;
    }
}

/* ==========================================================================
   セクションとコンテンツ
   ========================================================================== */
.naimod-section-title {
    color: white;
    font-size: 0.9rem;
    margin: 10px 0 5px 0;
    padding-bottom: 3px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.naimod-section {
    margin-bottom: 20px;
}

.naimod-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.naimod-chants-field {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 10px;
}

.naimod-suggestion-field {
    overflow-y: auto;
    border-top: 1px solid #ccc;
    padding-top: 10px;
}

.naimod-related-tags-field {
    overflow-y: auto;
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.2);
}

/* ==========================================================================
   ナチュラルランゲージコンテナ
   ========================================================================== */
.naimod-natural-language-container {
    background: none;
    padding: 0;
    margin-top: 20px;
}

.naimod-natural-language-content {
    max-height: 300px;
    overflow-y: auto;
    padding: 15px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    white-space: pre-wrap;
    word-break: break-word;
    color: white;
    font-size: 0.9em;
    line-height: 1.4;
    margin: 10px 0;
}

/* ==========================================================================
   ボタンコンテナと操作セクション
   ========================================================================== */
.naimod-button-container {
    display: flex;
    flex-shrink: 0;
}

.naimod-close-button-container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 64, 0.9);
    padding: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
}

.naimod-operation-section {
    background-color: rgba(0, 0, 32, 0.5);
    border-radius: 8px;
    padding: 15px;
    flex-direction: column;
    margin-bottom: 20px;
}

/* ==========================================================================
   タグセクション
   ========================================================================== */
.tag-section {
    margin-bottom: 15px;
}

.tag-section h3 {
    color: white;
    font-size: 1.1em;
    margin: 10px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* ==========================================================================
   右ペイン
   ========================================================================== */
.naimod-pane.right-pane {
    flex: 1;
    overflow-y: auto;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    min-height: 200px;
}

/* ==========================================================================
   画像ソース選択
   ========================================================================== */
.naimod-image-source-select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 4px;
}

.naimod-image-source-select:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
}

/* コンテキストメニューのスタイル */
.naimod-contextmenu {
    background-color: rgba(0, 0, 64, 0.9);
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px;
    color: white;
    user-select: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    min-width: 180px;
    font-size: 0.9rem;
}

.naimod-search-suggestion-menu {
    padding: 5px 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.naimod-search-suggestion-menu:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.naimod-contextmenu-separator {
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 5px 0;
}

.naimod-contextmenu-suggestions {
    margin-top: 5px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 5px;
}

.naimod-contextmenu-suggestion-title {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 5px;
    padding: 0 8px;
}

.naimod-contextmenu-suggestion-item {
    font-size: 0.85rem;
    border-radius: 3px;
    margin: 3px 0;
    cursor: pointer;
    transition: opacity 0.2s;
}

.naimod-contextmenu-suggestion-item:hover {
    opacity: 0.8;
}

/* ==========================================================================
   関連タグのカテゴリ表示
   ========================================================================== */
.naimod-category-container {
    margin-bottom: 10px;
}

.naimod-category-header {
    transition: background-color 0.2s;
}

.naimod-category-header:hover {
    filter: brightness(1.1);
}

.naimod-category-content {
    padding: 5px;
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 10px;
}

.naimod-dropdown-icon {
    font-size: 12px;
    transition: transform 0.3s;
}

.naimod-related-tags-field {
    max-height: 600px;
    overflow-y: auto;
}
        `;
    document.head.appendChild(style);
};

// Build関数の名前を変更
const initializeApplication = async () => {
    console.debug("Initializing application");
    console.debug("Application initialization started");

    // スタイルの適用
    addStyles();

    // モーダルの作成
    createSettingsModal();

    // メインUIの作成と配置
    document.body.appendChild(createMainUI());

    document.body.appendChild(createEmbeddingsUI());

    // コンテキストメニューの作成
    createContextMenu();

    // 関連タグの状態を復元
    restoreRelatedTags();

    // アスペクト比の更新
    updateAspectRatio();


    clonePopupContentsToEmbeddings();
};

const createDisplayAspect = () => {
    let displayAspect = document.createElement("div");
    displayAspect.id = "displayAspect";
    let container = document.createElement("div");
    container.style.maxWidth = "130px";
    container.style.display = "flex";
    let [widthAspect, heightAspect] = ['width', 'height'].map(type => {
        let input = document.createElement("input");
        input.type = "number";
        return input;
    });
    let largeCheck = document.createElement("input");
    largeCheck.type = "checkbox";
    largeCheck.title = "Check to large size.";
    let submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Aspect => Pixel";

    [widthAspect, heightAspect].forEach(input => {
        const baseInput = document.querySelector('input[type="number"][step="64"]');
        if (baseInput) {
            baseInput.classList.forEach(x => input.classList.add(x));
        }
    });

    [widthAspect, heightAspect, largeCheck].forEach(el => container.appendChild(el));
    [container, submitButton].forEach(el => displayAspect.appendChild(el));

    submitButton.addEventListener("click", () => {
        let wa = widthAspect.value;
        let ha = heightAspect.value;
        let maxpixel = largeCheck.checked ? 1536 * 2048 : 1024 * 1024;
        let as = aspectList(wa, ha, maxpixel);
        if (as.length) {
            updateImageDimensions(...as[as.length - 1]);
        }
    });

    return displayAspect;
};

const updateAspectInputs = () => {
    console.debug("updateAspectInputs");
    let displayAspect = document.querySelector("#displayAspect");
    if (displayAspect) {
        let [widthAspect, heightAspect] = displayAspect.querySelectorAll("input");
        let Aspect = getAspect(Array.from(document.querySelectorAll('input[type="number"][step="64"]')).map(x => x.value));
        [widthAspect.value, heightAspect.value] = Aspect;
    }
};

// ヘルパー関数
const createButton = (text, color, onClick) => {
    let button = document.createElement("button");
    button.textContent = text;
    button.style.color = color;
    button.addEventListener("click", onClick);
    return button;
};

// 画像ソース選択UIの作成
const createImageSourceUI = () => {
    let imageSourceLabel = document.createElement("label");
    imageSourceLabel.textContent = "Image Source: ";

    let imageSourceSelect = document.createElement("select");
    imageSourceSelect.id = "imageSource";
    ["current", "uploaded"].forEach(source => {
        let option = document.createElement("option");
        option.value = source;
        option.textContent = source.charAt(0).toUpperCase() + source.slice(1);
        imageSourceSelect.appendChild(option);
    });

    let uploadContainer = document.createElement("div");
    uploadContainer.className = "naimod-upload-container";
    uploadContainer.textContent = "Drag & Drop or Click to Upload";

    let uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.id = "naimodUploadedImage";
    uploadInput.accept = "image/*";
    uploadInput.style.display = "none";

    // 画像アップロードハンドラーの設定
    setupImageUploadHandlers(uploadContainer, uploadInput);

    // 初期状態を設定
    imageSourceSelect.value = "current";
    uploadContainer.style.display = "none";

    imageSourceSelect.addEventListener("change", () => {
        uploadContainer.style.display = imageSourceSelect.value === "uploaded" ? "flex" : "none";
    });

    return { imageSourceSelect, uploadContainer };
};

// 画像アップロードハンドラーの設定
const setupImageUploadHandlers = (uploadContainer, uploadInput) => {
    // ファイル選択時の処理
    uploadInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0], uploadContainer);
        } else {
            console.error("No file selected");
            alert("ファイルが選択されていません。");
        }
    });

    // クリックでファイル選択
    uploadContainer.addEventListener("click", () => {
        uploadInput.click();
    });

    // ドラッグ&ドロップ処理
    uploadContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadContainer.style.borderColor = "#000";
    });

    uploadContainer.addEventListener("dragleave", () => {
        uploadContainer.style.borderColor = "#ccc";
    });

    uploadContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadContainer.style.borderColor = "#ccc";
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0], uploadContainer);
        } else {
            console.error("No file dropped");
            alert("ファイルのドロップに失敗しました。");
        }
    });

    // クリップボードからの画像貼り付け
    document.addEventListener("paste", (e) => {
        if (document.getElementById("imageSource").value === "uploaded") {
            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const blob = items[i].getAsFile();
                    handleImageUpload(blob, uploadContainer);
                    break;
                }
            }
        }
    });

    uploadContainer.appendChild(uploadInput);
};

// 画像アップロード処理
const handleImageUpload = (file, uploadContainer) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            let previewImage = document.getElementById('naimodPreviewImage');
            if (!previewImage) {
                previewImage = document.createElement('img');
                previewImage.id = 'naimodPreviewImage';
                previewImage.className = 'naimod-preview-image';
            }
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
            uploadContainer.textContent = "";
            uploadContainer.appendChild(previewImage);
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("画像の読み込み中にエラーが発生しました。");
        };
        reader.readAsDataURL(file);
    } else {
        console.error("Invalid file type:", file ? file.type : "No file");
        alert("有効な画像ファイルを選択してください。");
    }
};

// 左ペインの作成を修正
const createLeftPane = () => {
    const container = document.createElement("div");
    container.className = "naimod-pane-container";

    // Suggest AI Improvementsボタン
    let suggestButton = createButton("Suggest AI Improvements", "blue", async () => {
        console.debug("Suggest AI Improvements clicked");

        const rightPane = document.querySelector(".naimod-pane.right-pane");
        if (!rightPane) {
            console.error("Right pane not found");
            return;
        }

        // 自然言語プロンプトの状態をリセット
        const naturalLanguagePrompt = document.getElementById("naturalLanguagePrompt");
        const copyButton = naturalLanguagePrompt?.parentElement?.querySelector("button");
        if (naturalLanguagePrompt) {
            naturalLanguagePrompt.textContent = "Waiting for AI suggestions...";
            if (copyButton) copyButton.style.display = "none";
        }

        // lastFocusedEditorからタグを取得
        const editor = window.getLastFocusedEditor();
        if (!editor) {
            console.error("No editor is focused");
            return;
        }

        console.debug("Getting tags from editor");
        const tags = editor.textContent.trim();
        console.debug("Current tags:", tags);

        if (tags) {
            rightPane.innerHTML = "<div>Loading AI suggestions...</div>";
            suggestButton.disabled = true;
            suggestButton.textContent = "Processing...";

            console.debug("Getting image source");
            let imageSource = document.getElementById("imageSource").value;
            console.debug("Image source:", imageSource);

            console.debug("Getting image DataURL");
            let imageDataURL = await getImageDataURL(imageSource);

            if (!imageDataURL) {
                console.error("Failed to get image DataURL");
                rightPane.innerHTML = "<div>Failed to get image. Please check your image source.</div>";
                suggestButton.disabled = false;
                suggestButton.textContent = "Suggest AI Improvements";
                return;
            }
            console.debug("Got image DataURL, length:", imageDataURL.length);

            console.debug("Calling ImprovementTags");
            let result = await ImprovementTags(tags, imageDataURL);
            console.debug("ImprovementTags result:", result);

            if (result) {
                displaySuggestions(result, rightPane);
            }
            suggestButton.disabled = false;
            suggestButton.textContent = "Suggest AI Improvements";
        } else {
            console.error("No tags found in editor");
            rightPane.innerHTML = "<div>No tags found in editor</div>";
        }
    });
    suggestButton.style.marginBottom = "10px";
    container.appendChild(suggestButton);

    return container;
};

// 右ペインの作成を修正
const createRightPane = () => {
    const container = document.createElement("div");
    container.className = "naimod-pane-container";

    // Apply Suggestionsボタン
    let applyButton = createButton("Apply Suggestions", "green", () => {
        console.debug("Apply Suggestions clicked");

        const editor = window.getLastFocusedEditor();
        if (!editor) {
            console.error("No editor is focused");
            return;
        }

        const rightPane = document.querySelector(".naimod-pane.right-pane");
        if (!rightPane) {
            console.error("Right pane not found");
            return;
        }

        console.debug("Getting enabled tags");
        let enabledTags = Array.from(rightPane.querySelectorAll('button[data-enabled="true"]'))
            .map(button => button.textContent.replace(/_/g, " "));
        console.debug("Enabled tags:", enabledTags);

        if (enabledTags.length > 0) {
            setEditorContent(enabledTags.join(", ") + ", ", editor);
            console.debug("Applied tags to editor");

            // モーダルを閉じる
            const modal = document.getElementById("naimod-modal");
            if (modal) {
                modal.style.display = "none";
                console.debug("Closed modal");
            }
        } else {
            console.debug("No enabled tags found");
        }
    });
    applyButton.style.marginBottom = "10px";
    container.appendChild(applyButton);

    // 提案タグ表示域
    const rightPane = document.createElement("div");
    rightPane.className = "naimod-pane right-pane";
    rightPane.style.minHeight = "200px";
    rightPane.style.backgroundColor = "rgba(0, 0, 64, 0.8)";
    rightPane.style.padding = "10px";
    rightPane.style.borderRadius = "5px";
    rightPane.style.marginTop = "10px";
    rightPane.style.overflowY = "auto";
    container.appendChild(rightPane);

    return container;
};

// displaySuggestionsを修正して自然言語プロンプトを表示
const displaySuggestions = (result, pane) => {
    console.debug("Displaying suggestions", result);

    if (!result) {
        pane.innerHTML = "";
        return;
    }

    pane.innerHTML = "";

    // Danbooru Tags セクション
    const danbooruSection = document.createElement("div");
    danbooruSection.className = "tag-section";

    // Apply Suggestionsボタンを作成
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "naimod-button-container";
    const applyButton = createButton("Apply Suggestions", "green", () => {
        console.debug("Apply Suggestions clicked");

        const editor = window.getLastFocusedEditor();
        if (!editor) {
            console.error("No editor is focused");
            return;
        }

        const rightPane = document.querySelector(".naimod-pane.right-pane");
        if (!rightPane) {
            console.error("Right pane not found");
            return;
        }

        console.debug("Getting enabled tags");
        let enabledTags = Array.from(rightPane.querySelectorAll('button[data-enabled="true"]'))
            .map(button => button.textContent.replace(/_/g, " "));
        console.debug("Enabled tags:", enabledTags);

        if (enabledTags.length > 0) {
            setEditorContent(enabledTags.join(", ") + ", ", editor);
            console.debug("Applied tags to editor");

            // モーダルを閉じる
            const modal = document.getElementById("naimod-modal");
            if (modal) {
                modal.style.display = "none";
                console.debug("Closed modal");
            }
        } else {
            console.debug("No enabled tags found");
        }
    });
    applyButton.className = "naimod-operation-button";
    buttonContainer.appendChild(applyButton);
    danbooruSection.appendChild(buttonContainer);

    // 既存のタグを表示
    const editor = window.getLastFocusedEditor();
    if (editor) {
        const currentTags = editor.textContent.split(/[,\n]+/).map(t => t.trim()).filter(Boolean);
        const shouldRemoveSet = new Set(result.shouldRemove || []);

        currentTags.forEach(tag => {
            const tagButton = createButton(tag, shouldRemoveSet.has(tag) ? "red" : "#3498db", () => { });
            tagButton.className = "naimod-tag-button";
            tagButton.dataset.enabled = shouldRemoveSet.has(tag) ? "false" : "true";
            tagButton.textContent = tag;
            if (shouldRemoveSet.has(tag)) {
                tagButton.title = "This tag is recommended to be removed";
            }
            danbooruSection.appendChild(tagButton);
        });
    }

    pane.appendChild(danbooruSection);

    // 追加すべきタグ
    if (result.shouldAdd?.length) {
        const addSection = document.createElement("div");
        addSection.className = "tag-section";
        addSection.innerHTML = "<h3 style='color: green;'>Suggested New Tags:</h3>";
        result.shouldAdd.forEach(tag => {
            const tagButton = createButton(tag, "green", () => { });
            tagButton.className = "naimod-tag-button";
            tagButton.dataset.enabled = "true";
            tagButton.textContent = tag;
            addSection.appendChild(tagButton);
        });
        pane.appendChild(addSection);
    }

    // 追加を提案するタグ
    if (result.mayAdd?.length) {
        const mayAddSection = document.createElement("div");
        mayAddSection.className = "tag-section";
        mayAddSection.innerHTML = "<h3 style='color: blue;'>Optional Tags:</h3>";
        result.mayAdd.forEach(tag => {
            const tagButton = createButton(tag, "blue", () => { });
            tagButton.className = "naimod-tag-button";
            tagButton.dataset.enabled = "false";
            tagButton.textContent = tag;
            mayAddSection.appendChild(tagButton);
        });
        pane.appendChild(mayAddSection);
    }

    // 各ボタンにトグル機能を追加
    pane.querySelectorAll('.naimod-tag-button').forEach(button => {
        button.onclick = () => {
            button.dataset.enabled = button.dataset.enabled === "true" ? "false" : "true";
            button.style.opacity = button.dataset.enabled === "true" ? "1" : "0.5";
            console.debug(`Tag ${button.textContent} toggled:`, button.dataset.enabled);
        };
        // 初期状態を反映
        button.style.opacity = button.dataset.enabled === "true" ? "1" : "0.5";
    });

    // 自然言語プロンプトの更新
    const naturalLanguagePrompt = document.getElementById("naturalLanguagePrompt");
    if (naturalLanguagePrompt && result.naturalLanguagePrompt) {
        naturalLanguagePrompt.textContent = result.naturalLanguagePrompt;

        // コピーボタンを動的に作成
        const container = naturalLanguagePrompt.parentElement;
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "naimod-button-container";
        const copyButton = createButton("Copy", "blue", () => {
            console.debug("Copy button clicked");

            const naturalLanguagePrompt = document.getElementById("naturalLanguagePrompt");
            if (!naturalLanguagePrompt) {
                console.error("Natural language prompt element not found");
                return;
            }

            const promptText = naturalLanguagePrompt.textContent;
            if (!promptText) {
                console.debug("No prompt text to copy");
                return;
            }

            // クリップボードへコピー
            navigator.clipboard.writeText(promptText)
                .then(() => {
                    console.debug("Text copied to clipboard");
                    // 一時的なフィードバックとしてボタンのテキストを変更
                    copyButton.textContent = "Copied!";
                    setTimeout(() => {
                        copyButton.textContent = "Copy";
                    }, 2000);
                })
                .catch(err => {
                    console.error("Failed to copy text:", err);
                    alert("Failed to copy text to clipboard");
                });
        });
        copyButton.className = "naimod-operation-button";
        buttonContainer.appendChild(copyButton);

        // タイトルの直後にボタンを挿入
        const title = container.querySelector(".naimod-section-title");
        title.insertAdjacentElement('afterend', buttonContainer);
    }
};

// 自然言語プロンプトセクションの作成を修正
const createNaturalLanguageSection = () => {
    const container = document.createElement("div");
    container.className = "naimod-natural-language-container";

    const title = document.createElement("h3");
    title.textContent = "Natural Language Prompt";
    title.className = "naimod-section-title";
    container.appendChild(title);

    const content = document.createElement("div");
    content.id = "naturalLanguagePrompt";
    content.className = "naimod-natural-language-content";
    content.textContent = "";
    container.appendChild(content);

    return container;
};

// 閉じるボタンセクションの作成を修正
const createCloseButtonSection = (modal) => {
    const container = document.createElement("div");
    container.className = "naimod-close-button-container";
    container.style.textAlign = "center";
    container.style.marginTop = "20px";

    let closeButton = createButton("Close", "grey", () => modal.style.display = "none");
    closeButton.style.padding = "5px 20px";

    container.appendChild(closeButton);
    return container;
};

// アスペクト比の更新
const updateAspectRatio = () => {
    console.debug("updateAspectRatio");
    const widthInput = document.querySelector('input[type="number"][step="64"]');
    let displayAspect = document.querySelector("#displayAspect");
    if (!displayAspect) {
        console.debug("createDisplayAspect");
        displayAspect = createDisplayAspect();
    }
    if (widthInput) {
        console.debug("appendChild displayAspect");
        widthInput.parentNode.appendChild(displayAspect);
    }
    updateAspectInputs();
};

// Chantsボタンの追加
const addChantsButtons = async (chantsField) => {
    try {
        // chantURLが未定義の場合は取得
        if (!chantURL) {
            chantURL = getChantURL(null);
        }

        // Chantsデータのフェッチ
        const response = await fetch(chantURL);
        chants = await response.json();
        // 各Chantに対応するボタンを作成
        chants.forEach(chant => {
            let button = createButton(
                chant.name,
                colors[chant.color][1],
                () => handleChantClick(chant.name)
            );
            chantsField.appendChild(button);
        });
    } catch (error) {
        console.error("Error fetching chants:", error);
        // エラー時のフォールバック処理
        let errorButton = createButton(
            "Chants Load Error",
            "red",
            () => {
                chantURL = getChantURL(true);
                initializeApplication();
            }
        );
        chantsField.appendChild(errorButton);
    }
};

// Chantボタンのクリックハンドラー
const handleChantClick = (chantName) => {
    const editor = window.getLastFocusedEditor();
    if (!editor) {
        console.error("No editor is focused");
        return;
    }

    const chant = chants.find(x => x.name === chantName.trim());
    if (chant) {
        const tags = chant.content.split(",").map(x => x.trim());
        appendTagsToPrompt(tags, editor);
    }
};

// ウィンドウリサイズ時の処理を追加
window.addEventListener('resize', () => {
    const popup = document.getElementById('naimod-popup');
    if (popup) {
        adjustPopupPosition(popup);
    }
});

// キーボードショートカットハンドラー
document.addEventListener("keydown", e => {
    const editor = window.getLastFocusedEditor();
    if (!editor) return;

    if (e.ctrlKey && e.code === "ArrowUp") {
        e.preventDefault();
        adjustTagEmphasis(1, editor);
    }
    if (e.ctrlKey && e.code === "ArrowDown") {
        e.preventDefault();
        adjustTagEmphasis(-1, editor);
    }
});

// unfold/foldボタンを作成
const createFoldButton = (popup) => {
    const foldButton = document.createElement("button");
    foldButton.className = "naimod-toggle-button";
    foldButton.innerHTML = "🟩"; // 初期状態はunfold

    // unfold/fold処理
    const toggleContent = (e) => {
        e.preventDefault();
        const content = popup.querySelector(".naimod-popup-content");
        if (content.style.display === "none") {
            content.style.display = "block";
            foldButton.innerHTML = "🟩";
        } else {
            content.style.display = "none";
            foldButton.innerHTML = "🟥";
        }
        savePopupState(popup);
    };

    // イベントリスナーの設定
    foldButton.addEventListener('click', toggleContent);
    foldButton.addEventListener('touchend', toggleContent, { passive: false });

    return foldButton;
};

// detach/attachボタンを作成
const createDetachButton = () => {
    const detachButton = document.createElement("button");
    detachButton.className = "naimod-toggle-button";
    detachButton.innerHTML = `<span class="naimod-toggle-button-anchor">⚓</span><span class="naimod-toggle-button-ship">🚢</span>`;

    const toggleAttachment = (e) => {
        e.preventDefault();
        const isAttached = document.body.dataset.naimodAttached === "1";
        document.body.dataset.naimodAttached = isAttached ? "0" : "1";

        // ポップアップの状態を保存
        const popup = document.getElementById('naimod-popup');
        if (popup) {
            savePopupState(popup);
        }
    };

    detachButton.addEventListener('click', toggleAttachment);
    detachButton.addEventListener('touchend', toggleAttachment, { passive: false });

    return detachButton;
};

// リサイズハンドルの作成と設定を修正
const setupResizeHandles = (popup) => {
    const leftHandle = document.createElement('div');
    leftHandle.className = 'naimod-resize-handle left';

    const rightHandle = document.createElement('div');
    rightHandle.className = 'naimod-resize-handle right';

    // ポップアップのposition: fixedを確保
    if (getComputedStyle(popup).position !== 'fixed') {
        popup.style.position = 'fixed';
    }

    popup.appendChild(leftHandle);
    popup.appendChild(rightHandle);

    // リサイズ処理
    const startResize = (clientX, handle, isTouch = false) => {
        const isLeft = handle.classList.contains('left');
        const startX = clientX;
        const startWidth = popup.offsetWidth;
        const startLeft = popup.offsetLeft;

        const resize = (moveEvent) => {
            moveEvent.preventDefault();
            const currentX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const delta = currentX - startX;
            let newWidth;

            if (isLeft) {
                newWidth = startWidth - delta;
                if (newWidth >= 200 && newWidth <= 800) {
                    popup.style.width = `${newWidth}px`;
                    popup.style.left = `${startLeft + delta}px`;
                }
            } else {
                newWidth = startWidth + delta;
                if (newWidth >= 200 && newWidth <= 800) {
                    popup.style.width = `${newWidth}px`;
                }
            }
        };

        const stopResize = () => {
            if (isTouch) {
                document.removeEventListener('touchmove', resize);
                document.removeEventListener('touchend', stopResize);
            } else {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
            }
            // リサイズ終了時のみ状態を保存
            savePopupState(popup);
        };

        if (isTouch) {
            document.addEventListener('touchmove', resize, { passive: false });
            document.addEventListener('touchend', stopResize);
        } else {
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        }
    };

    // マウスイベントハンドラー
    const mouseDownHandler = (e) => {
        e.preventDefault();
        startResize(e.clientX, e.target);
    };

    // タッチイベントハンドラー
    const touchStartHandler = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startResize(touch.clientX, e.target, true);
    };

    // イベントリスナーの設定
    [leftHandle, rightHandle].forEach(handle => {
        handle.addEventListener('mousedown', mouseDownHandler);
        handle.addEventListener('touchstart', touchStartHandler, { passive: false });
    });
};

// 関連タグ検索関数
async function searchRelatedTags(targetTags) {
    try {
        // タグ内の半角スペースをアンダーバーに置換
        const processedTags = targetTags.map(tag => tag.replace(/ /g, '_'));
        const query = processedTags.join(" ");
        const url = `https://danbooru.donmai.us/related_tag?commit=Search&search%5Border%5D=Cosine&search%5Bquery%5D=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        return {
            "post_count": 0,
            "related_tags": []
        };
    }
}

// コンテキストメニューの作成関数
const createContextMenu = () => {
    // 既存のメニューがあれば作成しない
    if (document.getElementById('naimod-contextmenu')) {
        return;
    }

    // メニュー要素の作成
    const menu = document.createElement('div');
    menu.id = 'naimod-contextmenu';
    menu.className = 'naimod-contextmenu';
    menu.style.display = 'none';
    menu.style.position = 'fixed';
    menu.style.zIndex = '10000';

    // 関連タグ検索用のメニュー項目
    const relatedItem = document.createElement('div');
    relatedItem.className = 'naimod-search-suggestion-menu';

    // タグ候補表示用のコンテナ
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'naimod-contextmenu-suggestions';
    suggestionsContainer.style.display = 'none';

    // ProseMirrorエディタでの右クリックイベントの処理
    document.addEventListener('contextmenu', (e) => {
        const target = e.target.closest('.ProseMirror');
        if (target) {
            e.preventDefault();

            let targetTags = [];
            const selection = window.getSelection().toString().trim();

            if (selection) {
                // 選択テキストがある場合、それを処理
                targetTags = selection
                    .split(/[,\n]/)
                    .map(tag => tag.trim())
                    .filter(Boolean)
                    .slice(0, 2);
            } else {
                // 選択テキストがない場合、カーソル位置のタグを取得
                const position = getAbsoluteCursorPosition(target);
                const targetTag = getCurrentTargetTag(target, position);
                if (targetTag) {
                    targetTags = [targetTag];
                }
            }

            if (targetTags.length > 0) {
                // メニュー項目のテキストを更新
                const displayText = targetTags.join(' + ');
                relatedItem.textContent = `Search related tags for "${displayText}"`;

                // クリックイベントを更新
                relatedItem.onclick = async () => {
                    const result = await searchRelatedTags(targetTags);
                    menu.style.display = 'none';
                    showTagRelations(result.related_tags);
                };

                // メニューを表示
                menu.style.display = 'block';

                // タグ候補を取得して表示（最初のタグのみ）
                suggestionsContainer.textContent = '';
                suggestionsContainer.style.display = 'block';

                if (targetTags[0]) {
                    const suggestions = getTagSuggestions(targetTags[0], 3); // 上位3つを取得

                    if (suggestions.length > 0) {
                        const suggestionTitle = document.createElement('div');
                        suggestionTitle.className = 'naimod-contextmenu-suggestion-title';
                        suggestionTitle.textContent = 'Tag Suggestions:';
                        suggestionsContainer.appendChild(suggestionTitle);

                        suggestions.forEach(tag => {
                            const suggestionItem = document.createElement('div');
                            suggestionItem.className = 'naimod-contextmenu-suggestion-item';
                            suggestionItem.textContent = tag.name;
                            suggestionItem.style.backgroundColor = colors[tag.category][1];
                            suggestionItem.style.cursor = 'pointer';
                            suggestionItem.style.padding = '4px 8px';
                            suggestionItem.style.margin = '2px 0';
                            suggestionItem.style.borderRadius = '4px';

                            suggestionItem.onclick = () => {
                                // クリック時に最新のエディタを取得
                                const currentEditor = window.getLastFocusedEditor();
                                if (currentEditor) {
                                    appendTagsToPrompt([tag.name], currentEditor, {
                                        removeIncompleteTag: targetTags[0]
                                    });
                                } else {
                                    console.error("No editor is focused");
                                }
                                menu.style.display = 'none';
                            };

                            suggestionsContainer.appendChild(suggestionItem);
                        });
                    }
                }

                // メニューが画面外にはみ出ないように位置を調整
                const x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth);
                const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight);
                menu.style.left = `${x}px`;
                menu.style.top = `${y}px`;
            }
        }
    });

    // メニュー項目をメニューに追加
    menu.appendChild(relatedItem);
    menu.appendChild(suggestionsContainer);

    // メニュー以外をクリックした時の処理
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    // メニューを非表示にする追加のイベント
    document.addEventListener('scroll', () => {
        menu.style.display = 'none';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            menu.style.display = 'none';
        }
    });

    // メニューをbodyに追加
    document.body.appendChild(menu);
};

// 設定ボタンを作成する関数
const createSettingsButton = () => {
    const settingsButton = document.createElement("button");
    settingsButton.className = "naimod-toggle-button";
    settingsButton.innerHTML = "🔧";
    settingsButton.addEventListener("click", () => {
        const modal = document.getElementById("naimod-modal");
        if (modal) modal.style.display = "block";
    });
    return settingsButton;
};

// 関連タグを表示する関数
const showTagRelations = (relatedTags) => {
    console.debug("Showing related tags:", relatedTags);

    const relatedTagsField = document.getElementById("relatedTagsField");
    if (!relatedTagsField) {
        console.error("Related tags field not found");
        return;
    }

    // フィールドをクリア
    relatedTagsField.textContent = "";

    // カテゴリごとにタグを分類
    const tagsByCategory = {};
    
    relatedTags.forEach(relatedTag => {
        const tag = relatedTag.tag;
        const category = tag.category;
        
        if (!tagsByCategory[category]) {
            tagsByCategory[category] = [];
        }
        
        tagsByCategory[category].push(tag);
    });

    // カテゴリごとにプルダウンセクションを作成
    const categoryNames = {
        "-1": "一般",
        "0": "一般",
        "1": "アーティスト",
        "3": "コピーライト",
        "4": "キャラクター",
        "5": "スペック",
        "6": "警告",
        "7": "メタ",
        "8": "ロール"
    };

    // カテゴリの順序を定義
    const categoryOrder = ["0", "4", "3", "1", "5", "8", "7", "6", "-1"];
    
    // 並べ替えたカテゴリを処理
    categoryOrder.forEach(category => {
        if (!tagsByCategory[category] || tagsByCategory[category].length === 0) {
            return; // 空のカテゴリはスキップ
        }
        
        // カテゴリコンテナを作成
        const categoryContainer = document.createElement("div");
        categoryContainer.className = "naimod-category-container";
        
        // カテゴリヘッダーを作成
        const categoryHeader = document.createElement("div");
        categoryHeader.className = "naimod-category-header";
        categoryHeader.style.backgroundColor = colors[category][1];
        categoryHeader.style.color = "white";
        categoryHeader.style.padding = "5px";
        categoryHeader.style.cursor = "pointer";
        categoryHeader.style.marginBottom = "5px";
        categoryHeader.style.borderRadius = "4px";
        categoryHeader.style.display = "flex";
        categoryHeader.style.justifyContent = "space-between";
        categoryHeader.style.alignItems = "center";
        
        // カテゴリ名とタグ数を表示
        const categoryName = categoryNames[category] || `カテゴリ ${category}`;
        categoryHeader.innerHTML = `
            <span>${categoryName} (${tagsByCategory[category].length})</span>
            <span class="naimod-dropdown-icon">▼</span>
        `;
        
        // タグコンテンツエリアを作成
        const tagContent = document.createElement("div");
        tagContent.className = "naimod-category-content";
        tagContent.style.display = "none"; // 初期状態では折りたたまれている
        
        // カテゴリ内のタグを追加
        tagsByCategory[category].forEach(tag => {
            const button = createButton(
                `${tag.name.replace(/_/g, " ")} (${tag.post_count > 1000 ? `${(Math.round(tag.post_count / 100) / 10)}k` : tag.post_count})`,
                colors[category][1],
                () => {
                    // クリック時に最新のエディタを取得
                    const currentEditor = window.getLastFocusedEditor();
                    if (currentEditor) {
                        appendTagsToPrompt([tag.name.replace(/_/g, " ")], currentEditor);
                    } else {
                        console.error("No editor is focused");
                    }
                }
            );
            
            button.title = `Category: ${category}`;
            const tagDataFromAllTags = allTags.find(t => t.name === tag.name);
            if (tagDataFromAllTags) {
                button.title = `${tagDataFromAllTags.terms.filter(Boolean).join(", ")}`;
            }
            
            tagContent.appendChild(button);
        });
        
        // ヘッダークリックでコンテンツの表示/非表示を切り替え
        categoryHeader.addEventListener("click", () => {
            const isHidden = tagContent.style.display === "none";
            tagContent.style.display = isHidden ? "block" : "none";
            categoryHeader.querySelector(".naimod-dropdown-icon").textContent = isHidden ? "▲" : "▼";
        });
        
        // カテゴリセクションを構築
        categoryContainer.appendChild(categoryHeader);
        categoryContainer.appendChild(tagContent);
        relatedTagsField.appendChild(categoryContainer);
    });

    // 関連タグの状態を保存
    saveRelatedTags(relatedTags);

    // Embeddingsの更新
    clonePopupContentsToEmbeddings();
};

// 関連タグの状態を保存する関数
const saveRelatedTags = (relatedTags) => {
    sessionStorage.setItem('naimodRelatedTags', JSON.stringify(relatedTags));
};

// 関連タグの状態を復元する関数
const restoreRelatedTags = () => {
    const savedTags = sessionStorage.getItem('naimodRelatedTags');
    if (savedTags) {
        const relatedTags = JSON.parse(savedTags);
        showTagRelations(relatedTags);
    }
};


/**
 * NOVEIAI用のユーザースクリプト - イベント制御
 * 
 * このファイルは、global.js、main.jsの後に読み込まれます。
 * 同じスコープで実行されるため、変数や関数は共有されます。
 */



document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.code === "ArrowUp") {
        e.preventDefault();
        adjustTagEmphasis(1);
    }
    if (e.ctrlKey && e.code === "ArrowDown") {
        e.preventDefault();
        adjustTagEmphasis(-1);
    }
    
    // 左右の矢印キーが押された時、ProseMirrorにフォーカスがない場合に限り画像の遷移を実行
    if ((e.code === "ArrowLeft" || e.code === "ArrowRight")) {
        // 現在アクティブな要素がProseMirrorエディタ内にあるかチェック
        const activeElement = document.activeElement;
        const isEditorFocused = activeElement && 
            (activeElement.classList.contains('ProseMirror') || 
             activeElement.closest('.ProseMirror') !== null);
        
        if (!isEditorFocused) {
            const direction = e.code === "ArrowLeft" ? "left" : "right";
            transitionImage(direction);
        }
    }
});

// 最後にフォーカスされたエディタとカーソル位置を記録
let lastFocusedEditor = null;
let lastCursorPosition = 0;

// カーソル位置を更新する関数
const updateCursorPosition = (editor) => {
    if (editor) {
        lastCursorPosition = getAbsoluteCursorPosition(editor);
    }
};

const updateFocusedEditor = (editor) => {
    document.querySelectorAll(".ProseMirror").forEach(x => x.style.border = "2px dashed rgba(255, 0, 0, 0.25)");
    editor.style.border = "2px dashed rgba(0, 255, 0, 0.25)";
    lastFocusedEditor = editor;
}

// ProseMirrorエディタの監視
const observeEditor = (editor) => {
    if (editor) {
        // inputとclickではupdateCursorPositionのタイミングが微妙に違う。
        // inputはタイピングで100ms以下で連続実行されることが多く、全く同じにすると動作が重くなる為。

        editor.addEventListener("input", e => {
            updateFocusedEditor(editor);
            const now = new Date();
            lastTyped = now;
            if (now - suggested_at > SUGGESTION_LIMIT) {
                showTagSuggestions(editor, lastCursorPosition);
                clonePopupContentsToEmbeddings();
                suggested_at = now;
                updateCursorPosition(editor);
            } else {
                setTimeout(() => {
                    if (lastTyped === now) {
                        showTagSuggestions(editor, lastCursorPosition);
                        clonePopupContentsToEmbeddings();
                        suggested_at = new Date();
                        updateCursorPosition(editor);
                    }
                }, 1000);
            }
        });

        editor.addEventListener("click", e => {
            updateFocusedEditor(editor);
            updateCursorPosition(editor);
            const now = new Date();
            if (now - suggested_at > SUGGESTION_LIMIT / 2) {
                showTagSuggestions(editor, lastCursorPosition);
                clonePopupContentsToEmbeddings();
                suggested_at = now;
            } else {
                setTimeout(() => {
                    if (lastTyped === now) {
                        showTagSuggestions(editor, lastCursorPosition);
                        clonePopupContentsToEmbeddings();
                        suggested_at = new Date();
                    }
                }, 1000);
            }
        });
    }
};

// DOM変更の監視
const observeDOM = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    const editors = node.getElementsByClassName("ProseMirror");
                    Array.from(editors).forEach(editor => {
                        if (!editor.hasAttribute('data-naimod-observed')) {
                            observeEditor(editor);
                            editor.setAttribute('data-naimod-observed', 'true');
                        }
                    });
                }
                if(node.tagName == "SPAN" && node.checkVisibility() && node.textContent && !isNaN(Number(node.textContent))){
                    updateAspectRatio();
                }
            });
            mutation.removedNodes.forEach((node) => {
                //console.log("removedNodes", node, node.checkVisibility());
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};

// タグデータの取得と処理を最適化
fetch("https://gist.githubusercontent.com/vkff5833/275ccf8fa51c2c4ba767e2fb9c653f9a/raw/danbooru.json?" + Date.now())
    .then(response => response.json())
    .then(data => {
        allTags = data;
        return fetch("https://gist.githubusercontent.com/vkff5833/275ccf8fa51c2c4ba767e2fb9c653f9a/raw/danbooru_wiki.slim.json?" + Date.now());
    })
    .then(response => response.json())
    .then(wikiPages => {
        // wikiPagesをマップに変換して検索を高速化
        const wikiMap = new Map(wikiPages.map(page => [page.name, page]));
        
        allTags = allTags.map(x => {
            const wikiPage = wikiMap.get(x.name);
            if (wikiPage) {
                // Set操作を1回だけ実行
                const allTerms = new Set(x.terms);
                wikiPage.otherNames.forEach(name => allTerms.add(name));
                x.terms = Array.from(allTerms);
            }
            return x;
        });
        buildTagIndices();
        clonePopupContentsToEmbeddings();
    });

// 初期化処理を最適化
let init = setInterval(() => {
    const editors = document.getElementsByClassName("ProseMirror");
    if (editors.length > 0) {
        clearInterval(init);
        chantURL = getChantURL(null);
        
        // エディタの監視を一括で設定
        const observedEditors = new Set();
        Array.from(editors).forEach(editor => {
            if (!observedEditors.has(editor)) {
                observeEditor(editor);
                editor.setAttribute('data-naimod-observed', 'true');
                observedEditors.add(editor);
            }
        });
        
        initializeApplication();
        observeDOM();
    }
}, 100);

// lastFocusedEditorをグローバルに公開
window.getLastFocusedEditor = () => lastFocusedEditor;

// lastCursorPositionをグローバルに公開
window.getLastCursorPosition = () => lastCursorPosition;

// 画像を遷移させる関数
function transitionImage(direction) {
    // 現在の画像URLを取得
    const currentImageURL = getCurrentImageURL();
    
    if (currentImageURL) {
        // まず現在の画像をクリック
        const currentImg = document.querySelector(`img[src="${currentImageURL}"]`);
        if (currentImg) {
            // 現在の画像数を記録
            const initialImageCount = document.querySelectorAll('img').length;
            
            // 画像をクリック
            currentImg.click();
            
            // カウンター初期化
            let checkCount = 0;
            const MAX_CHECKS = 300; // 最大300回まで確認
            
            // 画像数の変化を監視
            const imageCheckInterval = setInterval(() => {
                checkCount++;
                const currentImageCount = document.querySelectorAll('img').length;
                
                // 画像数が変化した、または最大チェック回数に達した場合
                if ((currentImageCount > initialImageCount && currentImageCount >= 2) || checkCount >= MAX_CHECKS) {
                    // インターバルを停止
                    clearInterval(imageCheckInterval);
                    
                    if (currentImageCount >= 2) {
                        const allImages = document.querySelectorAll('img');
                        
                        // 現在表示中の画像のインデックスを探す
                        let currentIndex = -1;
                        for (let i = 0; i < allImages.length; i++) {
                            if (allImages[i].src === currentImageURL) {
                                currentIndex = i;
                                break;
                            }
                        }
                        
                        if (currentIndex !== -1) {
                            let nextIndex;
                            
                            // 方向に基づいて次の画像のインデックスを計算（ループ処理）
                            if (direction === "left") {
                                nextIndex = (currentIndex - 1 + allImages.length) % allImages.length;
                            } else { // right
                                nextIndex = (currentIndex + 1) % allImages.length;
                            }
                            
                            // 次の画像をクリック
                            allImages[nextIndex].click();
                            console.debug(`画像遷移: ${direction}方向の画像に移動しました（${checkCount}回目のチェックで検出）`, allImages[nextIndex].src);
                        }
                    } else {
                        console.debug(`遷移可能な画像が見つかりませんでした（${checkCount}回のチェック後）`);
                    }
                }
            }, 0); // できるだけ短い間隔でチェック
        }
    } else {
        console.debug("現在の画像URLが取得できませんでした");
    }
}

// 現在表示されている画像のURLを取得
function getCurrentImageURL(){
    if(Array.from(document.querySelectorAll('img')).filter(x => x.parentElement.getAttribute("class")).length == 1){
        const src = Array.from(document.querySelectorAll('img')).filter(x => x.parentElement.getAttribute("class"))[0].getAttribute("src");
        return src;
    }
    return null;
}



