// ==UserScript==
// @name         Twitter 画像のプレビュー
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Twitterの画像にマウスオーバーしたときにプレビューが表示されるようになります。
// @author       Edamame_sukai
// @match        https://twitter.com/*
// @match        https://x.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476165/Twitter%20%E7%94%BB%E5%83%8F%E3%81%AE%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/476165/Twitter%20%E7%94%BB%E5%83%8F%E3%81%AE%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colorThief = new ColorThief();

    // 画像の何%まで画像の縦サイズを表示できるか(0~1の範囲)
    const maxImageHeightPercent = 0.7;
    // 画像の枠線(px)
    const borderSize = '10';
    // マウスのx,yの相対座標(px)
    let mouseapX = 0;
    let mouseapY = 0;

    addEventListener("load", () => {
        // 画像をプレビューする領域を作成
        const tweetImageContainer = document.createElement('div');
        tweetImageContainer.id = 'tweetImageContainer';
        tweetImageContainer.style.position = "absolute";
        tweetImageContainer.style.zIndex = "100000";
        tweetImageContainer.style.top = "100px";
        document.body.append(tweetImageContainer);

        // 画像を差し込むimgタグを作成
        const tweetPreviewImage = document.createElement('img');
        tweetPreviewImage.setAttribute('data-adaptive-background', '1');
        tweetPreviewImage.style.verticalAlign = 'middle'; // 下の黒い謎の空白部分を消す
        tweetImageContainer.append(tweetPreviewImage);

        // マウスの移動させたときのイベント
        document.addEventListener('mousemove', function (event) {
            // マウスのx,yの絶対座標を取得する
            mouseapX = event.clientX;
            mouseapY = event.clientY;
        });

        // ツイートが読み込まれたあとにツイートが表示されたらmain()関数を実行する
        const mainInterval = setInterval(() => {
            if (document.querySelectorAll('[data-testid="tweet"]').length !== 0) {
                clearInterval(mainInterval);
                main();
            };
        }, 1000);

        // 現在のURLを取得する
        let previousUrl = location.href;
        // ページを遷移したらmain()関数を実行する
        setInterval(() => {
            let currentUrl = location.href;
            if (currentUrl !== previousUrl) {
                // 画像をプレビューする領域を非表示にする
                tweetImageContainer.style.display = "none";
                // ページ遷移の処理を行う
                previousUrl = currentUrl;
                let pageLoadedInterval = setInterval(() => {
                    if (document.querySelectorAll('[data-testid="tweet"]').length !== 0 && document.querySelector('[data-testid="sidebarColumn"]') !== null) {
                        clearInterval(pageLoadedInterval);
                        setTimeout(() => {
                            main();
                        }, "1000");
                    };
                });
            }
        }, 100)

        // スクロールしたときのイベント
        document.addEventListener("scroll", () => {
            // 現在マウスがなんの要素を選択してるか取得する
            const mouseSelectElement = document.elementFromPoint(mouseapX, mouseapY);

            // スクロールしたときに画像が見切れたら
            if (tweetImageContainer.style.display === "block") {
                // 範囲内に収まるよう位置を修正する
                calculateResizedImagePixels(mouseSelectElement, tweetPreviewImage.height, tweetPreviewImage.width);
            }
            main();
        });

        // メインの処理をする関数
        function main() {
            // src属性があるタグを取得
            const elementsWithSrcText = document.querySelectorAll('[src]');
            // 画像のURLの正規表現の定数
            const regex = /https:\/\/pbs\.twimg\.com\/media\/.+/;

            // src属性の値が正規表現と一致するかつマウスオーバーのイベントが設定されてない要素かつ画像のプレビューを表示する要素じゃないを取得
            const matchingElements = Array.from(elementsWithSrcText).filter(element => {
                return regex.test(element.getAttribute('src')) && element.classList.contains('isMouseOver') !== true && element.parentNode.id !== "tweetImageContainer";
            });

            // 条件に一致した画像にイベントを設定する
            matchingElements.forEach((selectedPreviewImage) => {
                // マウスオーバーのイベントを設定したフラグのため"isMouseOver"のclassを追加
                selectedPreviewImage.classList.add("isMouseOver");

                // 画像をマウスオーバーしたときイベントを設定
                selectedPreviewImage.addEventListener('mouseover', () => {
                    setImage(selectedPreviewImage);
                });

                // 画像をマウスオーバーして離れたときのイベントを設定
                selectedPreviewImage.addEventListener('mouseleave', () => {
                    // 画像をプレビューする領域を非表示にする
                    tweetImageContainer.style.display = "none";
                });
            });
        }

        // 画像を表示する処理をする関数
        async function setImage(selectedPreviewImage) {
            // 現在のURLからURLオブジェクトを生成する
            const imageURL = new URL(selectedPreviewImage.src);

            // formatとnameのクエリパラメーターをセットする
            imageURL.searchParams.set('format', 'jpg');
            imageURL.searchParams.set('name', 'orig');

            // jpgかどうか判別する
            const imageCheck = new Image();
            imageCheck.src = imageURL.href;

            // Promiseオブジェクトを使って同期処理をする
            await new Promise((resolve) => {
                // 画像が読み込めたらresolve()する
                imageCheck.onload = () => {
                    resolve();
                };

                // 画像が読み込めなかったらpngにしてresolve()する
                imageCheck.onerror = () => {
                    // jpgで画像が読み込めなかったらpngにする
                    imageURL.searchParams.set('format', 'png');
                    resolve();
                };
            });

            // Promiseオブジェクトを使って同期処理をする
            await new Promise((resolve) => {
                // jpgかどうか判別する
                const imageColor = new Image();
                imageColor.src = imageURL.href;
                imageColor.crossOrigin = "Anonymous";

                imageColor.onload = () => {
                    // 画像を読み込んだら色を取得する
                    let color = colorThief.getColor(imageColor);

                    // 配列を16進数カラーコードにする
                    let borderColor = '#';
                    for (const rgb of color) {
                        borderColor = borderColor + parseInt(rgb, 10).toString(16);
                    }

                    // 枠に色を適応する
                    tweetImageContainer.style.border = `solid ${borderSize}px ${borderColor}`;

                    resolve();
                }

                imageColor.onerror = () => {
                    resolve();
                }
            });

            // クエリパラメータを変更した画像のURLに差し替える
            tweetPreviewImage.src = imageURL.href;

            // 画像の縦横のピクセル数を格納する変数
            let imageHeight;
            let imageWidth;

            await new Promise((resolve) => {
                tweetPreviewImage.onload = () => {
                    // 画像の縦と横のピクセル数を取得する
                    imageHeight = tweetPreviewImage.height;
                    imageWidth = tweetPreviewImage.width;
                    resolve();
                };
            });

            // リサイズ後の画像のピクセル数を計算する
            calculateResizedImagePixels(selectedPreviewImage, imageHeight, imageWidth);

            // 現在マウスがなんの要素を選択してるか取得する
            const mouseSelectElement = document.elementFromPoint(mouseapX, mouseapY);
            // もし画像をマウスオーバーしていたら
            if (mouseSelectElement !== null) {
                if (mouseSelectElement.classList.contains("isMouseOver") === true) {
                    // 画像をプレビューする領域を表示する
                    tweetImageContainer.style.display = "block";
                }
            }
        };

        // リサイズ後の画像のピクセル数を計算する関数
        function calculateResizedImagePixels(selectedPreviewImage, imageHeight, imageWidth) {
            // 縦と横の最大のピクセル数を取得
            const maxImageHeightPixel = (document.documentElement.clientHeight * maxImageHeightPercent);
            const maxImageWidthPixel = ((document.documentElement.clientWidth - document.querySelector('[data-testid="sidebarColumn"]').getBoundingClientRect().left) - borderSize * 2) - 20;

            // 実際の画像の縦サイズを取得
            if (imageHeight >= maxImageHeightPixel && imageWidth >= maxImageWidthPixel) {
                imageHeight = Math.min(maxImageHeightPixel, imageHeight * (maxImageWidthPixel / imageWidth));
            } else if (imageHeight >= maxImageHeightPixel) {
                imageHeight = maxImageHeightPixel;
            } else if (imageWidth >= maxImageWidthPixel) {
                imageHeight = imageHeight * (maxImageWidthPixel / imageWidth)
            }

            // 画像のプレビューの縦の表示領域を指定した範囲に制限する
            tweetPreviewImage.style.maxHeight = maxImageHeightPixel + "px";
            // 画像のプレビューの横の表示領域をブラウザの右端から20px離れたところに設定する
            tweetPreviewImage.style.maxWidth = maxImageWidthPixel + "px";

            // もし画像が見切れるなら上の位置を調整する
            if (selectedPreviewImage.getBoundingClientRect().top < 0) {
                tweetImageContainer.style.top = window.scrollY + "px";
            } else if (selectedPreviewImage.getBoundingClientRect().top + imageHeight < document.documentElement.clientHeight) {
                tweetImageContainer.style.top = selectedPreviewImage.getBoundingClientRect().top + window.scrollY + "px";
            } else {
                tweetImageContainer.style.top = window.scrollY + document.documentElement.clientHeight - imageHeight - (borderSize * 2) + "px";
            }
            // 画像のプレビューを表示する左上の座標を設定する
            tweetImageContainer.style.left = document.querySelector('[data-testid="sidebarColumn"]').getBoundingClientRect().left - (borderSize * 2) + "px";
        };

    });
})();