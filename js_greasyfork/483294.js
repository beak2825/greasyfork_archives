// ==UserScript==
// @name         ero_digger
// @namespace    @tanbatsu
// @version      2023-12-28-1
// @description  特定タグを含む動画を目立たせる
// @author       You
// @match        https://www.nicovideo.jp/newarrival*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483294/ero_digger.user.js
// @updateURL https://update.greasyfork.org/scripts/483294/ero_digger.meta.js
// ==/UserScript==

(function() {
    let settings = ["連れオナ動画","セクハラ動画","ずんだもん","エンターテイメント"]
    //ここでタグを設定（アルファベットは大文字でも小文字でも良いです）



    var ncLinkElements = document.querySelectorAll('.NC-VideoCard_defaultMeta');
    async function fetchDataAndExtractJson(url) {
        try {
            // fetchで指定のURLからHTMLを取得
            const response = await fetch(url);

            // レスポンスが成功したか確認
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // レスポンスのテキストを取得
            const htmlText = await response.text();

            // テキストからDOMを生成
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // #js-initial-watch-data要素を取得
            const initialWatchDataElement = doc.getElementById('js-initial-watch-data');

            // #js-initial-watch-dataが見つからなかった場合の処理
            if (!initialWatchDataElement) {
                throw new Error('#js-initial-watch-data not found in the HTML');
            }

            // data-api-data属性の値を取得
            const dataApiDataValue = initialWatchDataElement.getAttribute('data-api-data');

            // data-api-data属性が見つからなかった場合の処理
            if (!dataApiDataValue) {
                throw new Error('data-api-data attribute not found in #js-initial-watch-data');
            }

            // data-api-data属性の値をJSONに変換
            const jsonData = JSON.parse(dataApiDataValue);

            // JSONを返す
            return jsonData;
        } catch (error) {
            console.error('Error:', error.message);
            // エラーが発生した場合、適切に処理するか、エラーメッセージを返すなどの対応を行う
            return null;
        }
    }

    // 関数を呼び出してデータを取得

    // 各.NC-Link要素に対して処理
    ncLinkElements.forEach(function(ncLinkElement) {
        const videoId = ncLinkElement.getAttribute("data-video-id")
        // .NC-Card-media要素を取得
        fetchDataAndExtractJson('https://www.nicovideo.jp/watch/' + videoId)
            .then(jsonData => {
            if (jsonData) {
                const tags = jsonData.tag.items;
                console.log(jsonData.genre.label)
                tags.forEach(function(tags){
                    let Element = ncLinkElement.childNodes[0].childNodes[2]
                    if(settings.includes(tags.name.toLowerCase() )){
                        ncLinkElement.style.backgroundColor = "#ffe0cf"
                        Element.insertAdjacentHTML("beforeend","<big style='color:blue'>" +tags.name +",<big>")
                    }else{
                        Element.insertAdjacentHTML("beforeend","<small style='color:gray'>" + tags.name +",<small>")
                    }

                })
                if(settings.includes(jsonData.genre.label.toLowerCase())){
                    ncLinkElement.style.backgroundColor = "#ffe0cf"
                     Element.insertAdjacentHTML("beforeend","<big style='color:blue'>" +jsonData.genre.label +",<big>")
                }
            }
        });

    });

})();