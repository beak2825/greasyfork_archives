// ==UserScript==
// @name         GelBooru 検索機能追加
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  検索機能を追加します
// @author       あるぱか
// @match        https://gelbooru.com/index.php
// @match        https://gelbooru.com/index.php?page=post&s=*
// @match        https://ja.gelbooru.com/index.php?page=post&s=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gelbooru.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528384/GelBooru%20%E6%A4%9C%E7%B4%A2%E6%A9%9F%E8%83%BD%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/528384/GelBooru%20%E6%A4%9C%E7%B4%A2%E6%A9%9F%E8%83%BD%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';


        const scr = document.createElement("script");
        const ele = document.querySelector("body");
        scr.innerHTML =
            `const isE = document.querySelector("#tags-search");
            var oldV = "";
            var boonV = false;
            var vM = "";
            function ratingRB(v) {
            const vR = v ? "rating:" : "";
            if (oldV === v && v) { boonV = !boonV } else { oldV = v; boonV = false };
            if (boonV && v) { vM = "-" } else { vM = "" };
            isE.value = isE.value.replace(/(?:-?rating:(?:general|sensitive|questionable|explicit)\\s*|^(?!.*rating:(?:general|sensitive|questionable|explicit).*))/, vM + vR + v);
            };`;
        ele.appendChild(scr);



    // 要素作成

    const saE = location.search ? document.querySelector("#container > div.searchArea") : document.querySelector("#static-index > form > input.secondary_search");
    const nwD = document.createElement("div");
    nwD.id = "addSearch";
    location.search ? saE.append(nwD) : saE.after(nwD);
    const padLe = location.search ? `padding-left: 48px;` : `padding-left: 8px;`
    nwD.innerHTML =


        // 順序リスト
        `<select id="sortList">
        <option value="">デフォルト</option>
        <option name="iddesc" value="id:desc ">ID昇順(新しい順)</option>
        <option name="idasc" value="id:asc ">ID降順(古い順)</option>
        <option name="scoredesc" value="score:desc ">評価が高い順</option>
        <option name="scoreasc" value="score:asc ">評価が低い順</option>
        <option name="updateddesc" value="updated:desc ">更新された順</option>
        <option name="updatedasc" value="updated:asc ">更新が古い順</option>
        <option name="ratingasc" value="rating:asc ">エロい順</option>
        <option name="ratingdesc" value="rating:desc ">エロくない順</option>
        <option name="heightdesc" value="height:desc ">縦幅昇順</option>
        <option name="heightasc" value="height:asc ">縦幅降順</option>
        <option name="widthdesc" value="width:desc ">横幅昇順</option>
        <option name="widthasc" value="width:asc ">横幅降順</option>
        <option name="sourceasc" value="source:asc ">ソース名昇順</option>
        <option name="sourcedesc" value="source:desc ">ソース名降順</option>
        <option name="userasc" value="user:asc ">投稿者名昇順</option>
        <option name="userdesc" value="user:desc ">投稿者名降順</option>
        <option name="random" value="random ">ランダム</option>
        </select>


        <div>
        <label for="all">
        <div>
        <input type="radio" id="all" name="rating" value="" onclick="ratingRB(this.value);" />
        <div>全て</div>
        </div>
        </label>

        <label for="general">
        <div>
        <input type="radio" id="general" name="rating" value="general " onclick="ratingRB(this.value);" />
        <div>全年齢</div>
        </div>
        </label>

        <label for="sensitive">
        <div>
        <input type="radio" id="sensitive" name="rating" value="sensitive " onclick="ratingRB(this.value);" />
        <div>R-15</div>
        </div>
        </label>

        <label for="questionable">
        <div>
        <input type="radio" id="questionable" name="rating" value="questionable " onclick="ratingRB(this.value);" />
        <div>R-17.9</div>
        </div>
        </label>

        <label for="explicit">
        <div>
        <input type="radio" id="explicit" name="rating" value="explicit " onclick="ratingRB(this.value);" />
        <div>R-18</div>
        </div>
        </label>
        </div>

        <style>

        div.searchArea {
        height: auto;
        }

        #sortList {
        margin-right: 10px;
        height: 30px;
        width: 180px;
        user-select: none;
        }

        #addSearch {
        `+ padLe +`
        user-select: none;
        padding-top: 4px;
        width: auto;
        display: inline-block;
        }

        #addSearch div {
        display: inline-block;
        }

        #addSearch > div {
        padding-top: 10px;
        }

        #addSearch > div > label {
        cursor: pointer;
        padding: 3px;
        }

        #addSearch > div > label > div > div {
        padding-left: 3px;
        }

        #addSearch > div > label > div > input {
        cursor: pointer;
        vertical-align: middle;
        }

        </style>`;



    // エレメント指定
    const isE = document.querySelector("#tags-search");
    const slE = document.querySelector("#sortList");


    // 順序リストボタンの初期値
    const opEV = "option[name=" + isE.value.match(/(?<=sort:)(?:\w+?:(?:a|de)sc|random(?::\d+)?)/) + "]"
    const opE = document.querySelector(opEV.replace(/\:/, ""));
    if(opE) {
        opE.selected = true
    };


    // レーティングボタンの初期値
    const rdEV = isE.value.match(/(?<=rating:)general|sensitive|questionable|explicit/);
    const rdE = document.getElementById(rdEV);
    rdE ? rdE.checked = true : document.getElementById("all").checked = true;


    // 順序リスト選択を反映
    slE.addEventListener('change', sortChange);
    function sortChange () {
        const vv = slE.value ? "sort:" : "";
        isE.value = isE.value.replace(/(?:sort:(?:\w+?:(?:a|de)sc|random(?::\d+)?)\s*|^(?!.*sort:(?:(?:\w+:(?:a|de)sc.*)|random(?::\d+)?)))/, vv + slE.value);
    };



})();