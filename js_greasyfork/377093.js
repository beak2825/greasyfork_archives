// ==UserScript==
// @name         航空エンジニアのやり直し置換機
// @namespace    http://tampermonkey.net/
// @version      0.121
// @description  航空エンジニアのやり直し　における国名・企業名等の現実変換を行います。あんまりにもあんまりなので……
// @author       Velgail
// @match        https://ncode.syosetu.com/n3926fe/*
// @grant        none
// @license      BSL-1.0
// @downloadURL https://update.greasyfork.org/scripts/377093/%E8%88%AA%E7%A9%BA%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2%E3%81%AE%E3%82%84%E3%82%8A%E7%9B%B4%E3%81%97%E7%BD%AE%E6%8F%9B%E6%A9%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/377093/%E8%88%AA%E7%A9%BA%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%8B%E3%82%A2%E3%81%AE%E3%82%84%E3%82%8A%E7%9B%B4%E3%81%97%E7%BD%AE%E6%8F%9B%E6%A9%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function traverse(elem){
        var kids = elem.childNodes;

        var kid;
        for(var a=0; a<kids.length; a++){
            kid = kids.item(a);
            if(kid.nodeType == 3){

                kid.nodeValue = kid.nodeValue.replace("皇国","日本");
                kid.nodeValue = kid.nodeValue.replace("統一民国","統一中華民国");
                //kid.nodeValue = kid.nodeValue.replace("集","満州");//様々なところで発火して日本語が崩壊するため。
                kid.nodeValue = kid.nodeValue.replace("外蒙古","モンゴル");
                kid.nodeValue = kid.nodeValue.replace("蒙古自治区","内モンゴル");
                kid.nodeValue = kid.nodeValue.replace("東亜王国","タイ");
                kid.nodeValue = kid.nodeValue.replace("ティベ","チベット");
                kid.nodeValue = kid.nodeValue.replace("インドラ","インド");
                kid.nodeValue = kid.nodeValue.replace("東亜社会主義共和国","ベトナム");
                kid.nodeValue = kid.nodeValue.replace("カンプー王国","カンボジア");

                kid.nodeValue = kid.nodeValue.replace("NUP","アメリカ合衆国");
                kid.nodeValue = kid.nodeValue.replace("ヤクチア","ソビエト連邦");

                kid.nodeValue = kid.nodeValue.replace("G.I","G.E ゼネラルエレクトリック");
                kid.nodeValue = kid.nodeValue.replace("芝浦電気","芝浦製作所");
                kid.nodeValue = kid.nodeValue.replace("芝浦タービン","IHI");
                kid.nodeValue = kid.nodeValue.replace("京芝","東京芝浦電気");
                kid.nodeValue = kid.nodeValue.replace("茅場製作所","萱場製作所");
                kid.nodeValue = kid.nodeValue.replace("東京製作所","東京電気");
                kid.nodeValue = kid.nodeValue.replace("四菱","三菱");
                kid.nodeValue = kid.nodeValue.replace("長島","中島");
                kid.nodeValue = kid.nodeValue.replace("山崎","川崎");
                kid.nodeValue = kid.nodeValue.replace("川東","川西");
                kid.nodeValue = kid.nodeValue.replace("常陸","日立");
                kid.nodeValue = kid.nodeValue.replace("ロイヤル・クラウン","ロイヤル・ダッチ・シェル");
                kid.nodeValue = kid.nodeValue.replace("ユニヴァーサル・オイル","スタンダードオイル");
                kid.nodeValue = kid.nodeValue.replace("バキューム・オイル","ソコニー・ヴァキーム");
                kid.nodeValue = kid.nodeValue.replace("ユニバック","スタンバック");
                kid.nodeValue = kid.nodeValue.replace("サンライズ石油","ライジングサン石油");
                kid.nodeValue = kid.nodeValue.replace("ハ5","寿(ハ5)");
                kid.nodeValue = kid.nodeValue.replace("ハ25","栄(ハ25)");
                kid.nodeValue = kid.nodeValue.replace("ハ33","金星(ハ33)");
                kid.nodeValue = kid.nodeValue.replace("ハ43","木星(ハ43)");
                kid.nodeValue = kid.nodeValue.replace("ハ45","誉(ハ45)");
                kid.nodeValue = kid.nodeValue.replace("キ27","九七式戦闘機(キ27)");
                kid.nodeValue = kid.nodeValue.replace("キ43","百式戦闘機<隼>(キ43)");
                kid.nodeValue = kid.nodeValue.replace("キ47","百式双発攻撃機<屠龍>(キ47)");
                kid.nodeValue = kid.nodeValue.replace("キ51","百式襲撃機(キ51)");
                kid.nodeValue = kid.nodeValue.replace("キ57","百式輸送機(キ57)");
                kid.nodeValue = kid.nodeValue.replace("キ68","深山(キ68)");
                kid.nodeValue = kid.nodeValue.replace("キ78","研三(キ78)");
                kid.nodeValue = kid.nodeValue.replace("ロートシルト家","ロスチャイルド家");

                kid.nodeValue = kid.nodeValue.replace("東亜","東アジア");
                kid.nodeValue = kid.nodeValue.replace("ユーグ","ヨーロッパ");
                kid.nodeValue = kid.nodeValue.replace("華僑","中国全土");

                kid.nodeValue = kid.nodeValue.replace("連邦民主共和国","エチオピア");
                kid.nodeValue = kid.nodeValue.replace("連合王国","ベルギー");
                kid.nodeValue = kid.nodeValue.replace("第三帝国","ドイツ");
                kid.nodeValue = kid.nodeValue.replace("王立国家","イギリス");
                kid.nodeValue = kid.nodeValue.replace("共和国","フランス");
                kid.nodeValue = kid.nodeValue.replace("アペニン","イタリア");
                kid.nodeValue = kid.nodeValue.replace("王国","ハンガリー");
                kid.nodeValue = kid.nodeValue.replace("サモエド","フィンランド");
                kid.nodeValue = kid.nodeValue.replace("シュヴィーツ","スイス");
                kid.nodeValue = kid.nodeValue.replace("サルビア","セルビア");
                kid.nodeValue = kid.nodeValue.replace("ロマリア","ルーマニア");
                kid.nodeValue = kid.nodeValue.replace("ポルッカ","ポーランド");
                kid.nodeValue = kid.nodeValue.replace("オリンポス","ギリシャ");
                kid.nodeValue = kid.nodeValue.replace("ガリア","ブルガリア");
                kid.nodeValue = kid.nodeValue.replace("オスマニア","旧オスマン帝国");
            }else{
                if(kid.childNodes.length>0){
                    traverse(kid);
                }
            }
        }
    }

    traverse(document.body);
    // Your code here...
})();