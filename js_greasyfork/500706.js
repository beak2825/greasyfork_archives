// ==UserScript==
// @name				Hinatazaka46 Avoiding Prob NEWS / SCHEDULE
// @name:ja     日向坂46 障害回避 NEWS / SCHEDULE
// @namespace   naoqv.hinatazaka
// @description	Avoided problems occurring in two menus on the Hinatazaka46 website: "News" and "Schedule".
// @description	日向坂46サイト「ニュース」「スケジュール」メニューにおいて発生する障害を回避
// @version			2.22
// @match				https://www.hinatazaka46.com/s/official/news/*
// @match				https://www.hinatazaka46.com/s/official/media/*
// @require     https://update.greasyfork.org/scripts/531764/1571423/hinatazaka46-exceotionhandler.js
// @icon				https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @compatible  chrome
// @compatible  firefox
// @grant				none
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/500706/Hinatazaka46%20Avoiding%20Prob%20NEWS%20%20SCHEDULE.user.js
// @updateURL https://update.greasyfork.org/scripts/500706/Hinatazaka46%20Avoiding%20Prob%20NEWS%20%20SCHEDULE.meta.js
// ==/UserScript==

const SCRIPT_NAME = "日向坂46 障害回避 NEWS / SCHEDULE";

handleException(()=> {

    /*
     * 「メンバーで絞る」-> 「決定する」で対象メンバーのチェックを増やして検索後、チェックを外して検索しても
     * 対象メンバーが減らない現象を回避（修正ではない）
     */

    // 「メンバーで絞る」ボタンにホバー時スタイル（指）を設定
    document.querySelector(".c-button-filter").style.cursor = "pointer";

    /*
     * 「メンバーで絞る」-> 「決定する」で対象メンバーのチェックを増やして検索後、チェックを外して検索しても
     * 対象メンバーが減らない現象に対応
     */

    // 「決定する」ボタンアンカー
    const decAnchor = document.querySelector(".btn-decision a");
  
  	// 当月の文字列 (yyyyMM) を生成する関数
  	const createNowYearMonth = () => {
      const now = new Date();
      return String(now.getFullYear()) + String(now.getMonth() + 1).padStart( 2, '0');
    }

    // 表示対象の年月（ex.202404）をhrefに設定されている関数の引数から抽出。設定がなければ当月
    const dispYearMonth = ((x) => {return x === null ? createNowYearMonth() : x[0];})(decAnchor.href.match(new RegExp('[0-9]{6}')));

    // 「決定する」ボタンのアンカーを作り直す
    const newDecAnchor = document.createElement("a");

    // 初期表示の日本語を設定
    newDecAnchor.text = '決定する';

    newDecAnchor.style.cursor = "pointer";

    // ボタンのキャプションに「決定する」Clickイベントアクション登録
    newDecAnchor.addEventListener('click',
      () => {

        const PARAM_NM_DY = "dy";

        if (document.pageForm.elements[PARAM_NM_DY]) {
          document.pageForm.elements[PARAM_NM_DY].value = dispYearMonth;
        } else {
          document.pageForm.elements[0].name = PARAM_NM_DY;
          document.pageForm.elements[0].value = dispYearMonth;
        }

        let list = document.getElementsByName("list[]");

        const sendCheckedIdList = Array.prototype.filter.call(list, (x) => {

          return x.type === "checkbox" && x.checked;
        }).map((x) => {

          return x.value;
        });

        Array.prototype.forEach.call(list, (x) => {
          // 「決定する」押下時に非選択（かつ前回 押下時に選択）であるメンバーに対応するinput要素を除去
          if (x.type === "hidden" && sendCheckedIdList.indexOf(x.value) < 0) {
            x.remove();
          }
        });

        document.pageForm.submit();
      }
    );

    // 「決定する」ボタン
    const decBtn = document.querySelector(".btn-decision");

    // 「決定する」ボタンのアンカーを作り直したものに置換え
    decBtn.replaceChildren(newDecAnchor);


    const checkedIdList = [];

    Array.prototype.forEach.call(document.getElementsByName("list[]"), (x) => {

      if (x.type === "hidden") {

        let memberId = x.value;

        if (checkedIdList.indexOf(memberId) < 0) {

          checkedIdList.push(memberId);
        } else {
          // 同一メンバーに対応するhidden要素が重複している場合、htmlから削除
          x.remove();
        }
      }
    });

    // 検索実行後に選択メンバーのチェックが外れるので控えておいたメンバーIDを元にクリックイベントをディスパッチ
    Array.prototype.forEach.call(checkedIdList, (x) => {

      document.getElementById(x).dispatchEvent(new MouseEvent("click"));
    });
}, SCRIPT_NAME);
