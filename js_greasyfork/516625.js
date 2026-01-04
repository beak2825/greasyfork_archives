// ==UserScript==
// @name         UrMortal
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  MortalReviewer(KillerDucky)のGUIを変更し、悪手率を表示します。
// @match        https://mjai.ekyu.moe/killerducky/?data=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516625/UrMortal.user.js
// @updateURL https://update.greasyfork.org/scripts/516625/UrMortal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // テキスト画像変更
    const replacementTextForUun = 'うーん...';//テキストを「うーん...」から変更します。
    const replacementTextForAkan = 'アカン!';//テキストを「アカン!」から変更します。
    const newImageURL = 'https://mjai.ekyu.moe/killerducky/media/rustferris.png';//画像を変更します。
    const images = document.querySelectorAll('img.killer-call-img[src="media/rustferris.png"]');
    images.forEach(img => {
        img.src = newImageURL;
    });

    const observer = new MutationObserver(() => {
        const textElements = document.querySelectorAll('text[fill="hsla(190, 0%, 100%, 0.70)"]');
        textElements.forEach(textElement => {
            if (textElement.textContent === 'うーん...') {
                textElement.textContent = replacementTextForUun;
            } else if (textElement.textContent === 'アカン！') {
                textElement.textContent = replacementTextForAkan;
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();

(async function() {
    'use strict';

    // ヘルプボタンとダイアログの要素を取得
    const aboutModal = document.getElementById('about-modal');
    const aboutButton = document.getElementById('about');

    // URLからJSONファイル名を抽出し、JSONデータのURLを動的に作成
    const pathMatch = window.location.href.match(/data=(?:%2F|\/)report(?:%2F|\/)([a-zA-Z0-9]+\.json)/);
    if (!pathMatch) {
        console.error("JSONファイルパスが見つかりませんでした。");
        return;
    }
    const jsonUrl = `https://mjai.ekyu.moe/report/${pathMatch[1]}`;

    if (aboutModal && aboutButton) {
        aboutButton.addEventListener('click', async () => {
            try {
                // JSONデータをフェッチ
                const response = await fetch(jsonUrl);
                if (!response.ok) {
                    throw new Error(`HTTPエラー: ${response.status}`);
                }
                const data = await response.json();

                let matchRate = '';
                let rating = '';
                let mistakeCount = 0;
                let totalEntries = 0;
                let mortalengine = '';  // engineのデータを格納する変数
                let modeltag = '';      // model_tagのデータを格納する変数
                let version = '';       // versionのデータを格納する変数
                let temperature = '';   // temperatureのデータを格納する変数

                // engineのデータを取得
                if (data.engine) {
                    mortalengine = data.engine; // engineの値をmortalengineに格納
                }

                // model_tagのデータを取得
                if (data.review && data.review.model_tag) {
                    modeltag = data.review.model_tag; // model_tagの値をmodeltagに格納
                }

                // versionのデータを取得
                if (data.version) {
                    version = data.version; // versionの値をversionに格納
                }

                // temperatureのデータを取得
                if (data.review && data.review.temperature) {
                    temperature = data.review.temperature; // temperatureの値をtemperatureに格納
                }

                // 一致率とレーティングの取得と計算
                if (data.review) {
                    const totalReviewed = data.review.total_reviewed;
                    const totalMatches = data.review.total_matches;
                    matchRate = Math.ceil((totalMatches / totalReviewed) * 1000) / 10; // 小数点第1位まで
                    rating = Math.ceil(data.review.rating * 1000) / 10; // レーティングを100倍し小数点第1位
                }

                // 悪手率を計算
                data.review.kyokus.forEach(kyoku => {
                    kyoku.entries.forEach(entry => {
                        if (!entry.is_equal) {
                            const actualPai = entry.actual.pai;
                            const lowProbActions = entry.details.filter(detail =>
                                detail.action.pai === actualPai && detail.prob <= 0.05
                            );
                            if (lowProbActions.length > 0) {
                                mistakeCount++;
                            }
                        }
                        totalEntries++;
                    });
                });

                const mistakeRate = Math.ceil((mistakeCount / totalEntries) * 1000) / 10; // 小数点第1位まで

                // 色とスタイルを条件に応じて設定
                const matchRateStyle = matchRate >= 80 ? "color: gold;" : "";
                const ratingStyle = rating >= 90 ? "color: gold;" : "";
                const mistakeRateStyle = mistakeRate <= 5 ? "color: gold;" : "";

                // 数値を太字、透明な背景にするためのスタイル（一致率、レーティング、悪手率用）
                const cellStyle = "background-color: transparent; font-weight: bold; text-align: center; border: none;";

                // 通常のセル（一致回数 / 打牌選択回数と悪手回数 / 打牌選択回数）
                const normalCellStyle = "text-align: center; border: 1px solid #ccc;";

                // 一致率、レーティング、悪手率をテーブルセル表示し、次の行に 一致回数 / 打牌選択回数 と 悪手回数 / 打牌選択回数 を追加
                aboutModal.innerHTML = `
                    <div class="about-metadata" style="font-size: 1.5em; text-align: center;">
                        <h3>AI解析結果</h3> <!-- ここを「AI解析結果」に変更 -->
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="text-align: center; border: none;">一致率</th>
                                    <th style="text-align: center; border: none;">レーティング</th>
                                    <th style="text-align: center; border: none;">悪手率</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="${cellStyle} ${matchRateStyle}">${matchRate}%</td>
                                    <td style="${cellStyle} ${ratingStyle}">${rating}</td>
                                    <td style="${cellStyle} ${mistakeRateStyle}">${mistakeRate}%</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="text-align: center; border: none;">
                                        <table style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="${normalCellStyle}">一致回数 / 打牌選択回数</td>
                                                <td style="${normalCellStyle}">${data.review.total_matches} / ${data.review.total_reviewed}</td>
                                            </tr>
                                            <tr>
                                                <td style="${normalCellStyle}">悪手回数 / 打牌選択回数</td>
                                                <td style="${normalCellStyle}">${mistakeCount} / ${data.review.total_reviewed}</td>
                                            </tr>
                                            <tr>
                                                <td style="${normalCellStyle}">AIモデル</td>
                                                <td style="${normalCellStyle}">${mortalengine} ${modeltag}</td>  <!-- AIモデルの表示 -->
                                            </tr>
                                            <tr>
                                                <td style="${normalCellStyle}">Mjai-reviewerバージョン</td>
                                                <td style="${normalCellStyle}">${version}</td>  <!-- バージョンの表示 -->
                                            </tr>
                                            <tr>
                                                <td style="${normalCellStyle}">Temperature</td>
                                                <td style="${normalCellStyle}">${temperature}</td>  <!-- Temperatureの表示 -->
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Temperatureの下に説明を追加 -->
                        <div id="about-body-0" style="font-size: 0.67em; text-align: left;">
                            <ul>
                                <li><span>Mortalの意見は、緑のバーで表示されます</span></li>
                                <li><span>トップの選択肢は常に100%の高さです</span></li>
                                <li><span>他の選択肢は、トップの選択肢に対する相対値です</span></li>
                                <li><span>ユーザーの選択は、黄色のバーで表示されます</span></li>
                                <li><span>捨て牌のバーをクリックすると、バーの表示・非表示を切り替えます</span></li>
                                <li><span>真ん中の局数をクリックすると、スコア表を表示します</span></li>
                                <li><span>スコア表の行をクリックすると、その局にジャンプします</span></li>
                                <li><span>GUIの問題は<a href="https://github.com/killerducky/killer_mortal_gui" target="_blank">GitHubプロジェクト</a>で報告してください</span></li>
                            </ul>
                        </div>

                        <!-- キーボード操作表を追加 -->
                        <table style="width: 100%; margin-top: 10px; font-size: 0.67em; text-align: left;">
                            <tbody>
                                <tr><td><code>Right</code> <code>Left</code></td><td>次/前</td></tr>
                                <tr><td><code>Up</code> <code>Down</code></td><td>次/前の選択</td></tr>
                                <tr><td><code>PgUp</code> <code>PgDown</code> or <code>,</code> <code>.</code></td><td>次/前のエラー</td></tr>
                                <tr><td><code>Home</code> <code>End</code> or <code>[</code> <code>]</code></td><td>次/前の局</td></tr>
                                <tr><td><code>m</code></td><td>Mortalのアドバイスを表示/非表示</td></tr>
                                <tr><td><code>h</code></td><td>相手の手牌を表示/非表示</td></tr>
                                <tr><td><code>b</code></td><td>現在の局面をURLに反映</td></tr>
                                <tr><td><code>?</code></td><td>ヘルプを表示</td></tr>
                                <tr><td><code>d</code></td><td>放銃率を表示/非表示<br><br>(Mortalによる出力ではなく、単純なヒューリスティックのみ)</td></tr>
                                <tr><td><code>a</code></td><td>Show accumulated dealin rate</td></tr>
                                <tr><td><code>z</code></td><td>Show detailed dealin rate</td></tr>
                            </tbody>
                        </table>
                    </div>
                `;

                // ダイアログを表示
                aboutModal.showModal();
            } catch (error) {
                console.error("JSONデータの取得または処理中にエラーが発生しました:", error);
            }
        });
    }
})();
