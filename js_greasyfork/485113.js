// ==UserScript==
// @name         マイリスト一覧　名前表示
// @namespace    https://zadankai.club/@tan
// @version      2024-01-18
// @description  名前表示
// @author       You
// @match        https://www.nicovideo.jp/openlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485113/%E3%83%9E%E3%82%A4%E3%83%AA%E3%82%B9%E3%83%88%E4%B8%80%E8%A6%A7%E3%80%80%E5%90%8D%E5%89%8D%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/485113/%E3%83%9E%E3%82%A4%E3%83%AA%E3%82%B9%E3%83%88%E4%B8%80%E8%A6%A7%E3%80%80%E5%90%8D%E5%89%8D%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    // ページが読み込まれた後に実行されるコード

    // .OpenlistMediaObject-description クラスに属するすべての要素を取得
    var descriptionElements = document.querySelectorAll('.OpenlistMediaObject-description');

    // 各要素に対して処理を行う
    descriptionElements.forEach(function(element) {
        // 子要素 strong の子要素 a を取得
        var anchorElement = element.querySelector('strong > a');
        var desp = element.querySelector('strong');
        // a 要素が存在する場合、その href 属性を出力
        if (anchorElement) {
            console.log(anchorElement.href);
            fetch(anchorElement.href)
                .then(response => response.text())
                .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // #js-initial-userpage-data要素を取得
                const userDataElement = doc.querySelector('#js-initial-userpage-data');

                // data-environment属性の値を取得
                const dataEnvironment = userDataElement.getAttribute('data-initial-data');

                // data-environment属性の値をJSONとしてパースしてコンソールに出力
                const jsonData = JSON.parse(dataEnvironment);
                console.log(jsonData.state.userDetails.userDetails.user.nickname);
                desp.insertAdjacentHTML("beforeend", "<br><p style='color:gray'>" + jsonData.state.userDetails.userDetails.user.nickname)+"</p>"

            })
                .catch(error => console.error('Error:', error));

        }
    });


    const url = 'https://www.nicovideo.jp/mylist/76168952';


})();