// ==UserScript==
// @name         FGO效率剧场日文替换
// @namespace    https://greasyfork.org/zh-CN/scripts/36247-fgo%E6%95%88%E7%8E%87%E5%89%A7%E5%9C%BA%E6%97%A5%E6%96%87%E6%9B%BF%E6%8D%A2
// @version      0.8
// @description  Japanese replacement in FGO efficiency Theatre
// @author       xianlechuanshuo
// @match        *://docs.google.com/spreadsheets/d/1TrfSDteVZnjUPz68rKzuZWZdZZBLqw03FlvEToOvqH0/htmlview*
// @match        *://docs.google.com/spreadsheets/d/e/2PACX-1vSgINV7TiiW1BklV4U0Ie1NngPpjJ0mZLn247UY36OP3gJk5NaezrSlADDLbPy2XIxXJo8c9Nte7tQL/pubhtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36247/FGO%E6%95%88%E7%8E%87%E5%89%A7%E5%9C%BA%E6%97%A5%E6%96%87%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/36247/FGO%E6%95%88%E7%8E%87%E5%89%A7%E5%9C%BA%E6%97%A5%E6%96%87%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==


(function() {
    'use strict';

	let ds=["1739139175C3","1739139175C18","1726510632C3","1726510632C18","1760970551C1","1041274460C0","56582984C0"];
	let es=["1739139175C4","1739139175C19","1726510632C4","1726510632C19","1760970551C2","1760970551C44","1041274460C1","1041274460C38","1041274460C62","1041274460C86","56582984C1","56582984C38","56582984C62","56582984C86"];
	resetDWidth(ds);
	resetEWidth(es);
    var tbs=document.querySelectorAll(".waffle.no-grid");
    var dicObj={
				//奥尔良(第一章)
				"オルレアン":"奥尔良",
				"ボルドー":"波尔多",
				"ティエール":"蒂耶尔",
				"ラ・シャリテ":"拉沙里泰",
				"マルセイユ":"马赛",
				"ジュラ":"茹拉",
				"リヨン":"里昂",

				//罗马(第二章)
				"セプテム":"罗马",
				"ゲルマニア":"日耳曼",
				"マッシリア":"马西利亚",
				"ガリア":"高卢",
				"エトナ火山":"埃特纳火山",
				"アッビア街道":"阿皮亚街道",

				//俄刻阿诺斯(第三章)
				"オケアノス":"俄刻阿诺斯",
				"翼竜の島":"翼龙之岛",
				"地図に記された島":"标记在地图上的岛屿",
				"嵐の海域":"风暴海域",
				"潮目の海":"暖流之海",
				"カルデラの島":"火山口之岛",

				//伦敦(第四章)
				"シティ・オブ・ロンドン":"伦敦城",
				"ウェストミンスター":"威斯敏斯特",
				"ロンドン":"伦敦",
				"クラーケンウェル":"克勒肯维尔",
				"ソーホー":"苏活区",
				"ハイドパーク":"海德公园",
				"サザーク":"萨瑟克区",
				"オールドストリート":"老街",
				"ホワイトチャペル":"白教堂",

				//北美(第五章)
				"北米":"北美",
				"ダラス":"达拉斯",
				"モントゴメリー":"蒙哥马利",
				"デミング":"德明",
				"シャーロット":"夏洛特",
				"リバートン":"里弗顿",
				"シカゴ":"芝加哥",
				"ブラックヒルズ":"布拉克山",
				"デモイン":"得梅因",
				"カーニー":"卡尼",
				"ラボック":"拉伯克",
				"デンバー":"丹佛",
				"アレクサンドリア":"亚历山大",
				"ワシントン":"华盛顿",


				//卡米洛特(第六章)
				"キャメロット":"卡米洛特",
				"アトラス院":"阿特拉斯院",
				"円卓の砦":"圆桌的堡垒",
				"隠れ村":"隐秘之村",
				"明けの砂丘":"黎明的沙丘",
				"砂嵐の砂漠":"沙尘暴的沙漠",
				"西の村跡":"西之村遗迹",
				"無の大地":"虚无大地",

				//巴比伦(第七章)
				"バビロニア":"巴比伦",
				"ウル":"乌尔",
				"エリドゥ":"埃利都",
				"エビフ山":"埃维夫山",
				"黒い杉の森":"黑杉之森",
				"ニップル":"尼普尔",
				"葦の原":"芦苇原",
				"廃都バビロン":"废都巴比伦",
				"クタ":"库撒",


				//新宿(1.5第一部)
				"タワー最上階":"塔顶层",
				"バレルタワー":"桶塔",


				//雅戈泰(1.5第二部)
				"アガルタ":"雅戈泰",
				"イース":"伊苏",
				"竜宮城":"龙宫城",
				"山裾の密林":"山脚密林",
				"川辺の町":"河边町",
				"大地の裂け目":"大地的裂痕",


				//下总国(1.5第三部)
				"下総国":"下总国",
				"土気城":"土城",
				"合戦場":"合战场",
				"荒川の原":"荒川平原",
				"裏山":"山背",
				"田んぼ":"稻田",


				//塞勒姆(1.5第四部)
				"セイレム":"塞勒姆",
				"波止場":"码头",
				"郊外の屋敷":"郊外豪宅",
				"カーター家":"卡特家",
				"ガローの丘":"绞刑山",
				"静寂な森":"寂静森林",
				"空き家":"空宅",
				"ウェイトリー家":"威特利家",


    };
    tbs.forEach(function(tb){
        let html=tb.innerHTML;

        for(let key in dicObj){
            html=html.replace(new RegExp(`${key}`,"gm"),`${dicObj[key]}(${escape(key)})`);
        }
        //将原来加密的日文名还原为非加密的日文名
        for(let key in dicObj){
            html=html.replace(new RegExp(`${escape(key)}`,"gm"),`${unescape(key)}`);
        }

        tb.innerHTML=html;
    });
})();

function resetDWidth(ids){
    let width=130;
    if(window.location.href.includes("pubhtml"))width=180;
	resetWidth(ids,width);
}
function resetEWidth(ids){
    let width=200;
    if(window.location.href.includes("pubhtml"))width=270;
	resetWidth(ids,width);
}
function resetWidth(ids,width){
	ids.forEach(function(id){
		if(document.getElementById(id))document.getElementById(id).style=`width:${width}px`;
	});
}