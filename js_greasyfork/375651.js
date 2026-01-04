// ==UserScript==
// @name 		LoL 詳細検索
// @description 公式の対戦履歴のURLに書き換える
// @author 		GinoaAI
// @namespace 	https://greasyfork.org/ja/users/119008-ginoaai
// @version 	1.0
// @match 		https://lolnames.gg/ja/LookupID/*/*
// @include 	https://lolnames.gg/ja/LookupID/*/*
// @icon 		https://pbs.twimg.com/profile_images/789285418722217985/aMIeJGk-_400x400.jpg
// @grant		GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/375651/LoL%20%E8%A9%B3%E7%B4%B0%E6%A4%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/375651/LoL%20%E8%A9%B3%E7%B4%B0%E6%A4%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    function traverse(elem) {
        var kids = elem.childNodes;
        var kid;
        for (var a = 0; a < kids.length; a++) {
            kid = kids.item(a);
            if (kid.nodeType == 3) {
                kid.nodeValue = kid.nodeValue
                    .replace("LoLアカウントIDファインダー", "LoL 詳細検索")
                    .replace("最後の試合", "最終試合時間")
                    .replace("最後にログインした時", "最終ログイン")
                    .replace("アカウントIDファインダー", "アカウントID")
                    .replace("クリックしてブックマークしてトラックする", "クリックして公式の対戦履歴を閲覧する")
                    .replace("召喚兵ID", "　召喚兵ID　")
                    .replace("レベル", "　レベル　　")
                    .replace(/([0-9]{0,2}) ([0-9]{0,2}月) ([0-9]{4})/, "$3年$2$1日");
            } else {
                if (kid.childNodes.length > 0) {
                    traverse(kid);
                }
            }
        }
    }
    traverse(document.body);
})();

var target, i, l = document.links.length;
for (i = 0; i < l; i++) {
    target = document.links[i].href;
    document.links[i].href = target.replace(/lolnames.gg\/ja\/SearchAccountID\/jp\/([0-9]+)\//, "matchhistory.jp.leagueoflegends.com/ja/#match-history/JP1/$1");
}