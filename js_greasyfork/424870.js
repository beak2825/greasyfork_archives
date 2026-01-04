// ==UserScript==
// @name         Yagi Sim Auto Translater
// @version      2022.11.07
// @description  Yagi Sim 自动翻译
// @author       幸运的咸鱼
// @match        *://yagi7mazu.webcrow.jp/compas-deck/*
// @match        *://yagitools.html.xdomain.jp/compas-deck/*
// @namespace    https://greasyfork.org/users/757656
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/424870/Yagi%20Sim%20Auto%20Translater.user.js
// @updateURL https://update.greasyfork.org/scripts/424870/Yagi%20Sim%20Auto%20Translater.meta.js
// ==/UserScript==

//Auto translator for
//やぎシミュ【戦闘摂理解析システム #コンパス マルチシミュレーター】
//Yagi Sim【战斗天赋解析系统 #COMPASS 多功能模拟器】

var replaceArry = [
//长句翻译
    [/通常攻撃の射程が長い順/gi,'按正常射程排行'],
    [/通常の移動速度が早い順/gi,'按正常移动速度排序'],
    [/最大拡張ポータルでの蓄積時間/gi,'在最大扩张的据点上的积攒时间'],
    [/が一覧で表示されます/gi,'会显示在列表中'],
    [/記録しといたわ！/gi,'记录下来了！'],
    [/カードを使うと0.5秒全てのカードが使えなくなる/gi,'当使用一张卡后，所有的卡都会在0.5秒内无法使用'],
    [/一度使ったカードは他のカードを使わないと使えなくなる/gi,'一旦你使用了一张卡，在你使用另一张卡之前，你不能再使用它'],
    [/全カードは3秒で効果が切れる/gi,'所有的卡都会在3秒内失效'],
    [/やぎシャドウは使っても何も起こらない/gi,'使用山羊鲶的话，什么事都不会发生'],
    [/クランク/gi,'Crank'],

//这里是英雄，按网页顺序排列
    [/十文字アタリ/gi,'十文字 雅达利'],
    [/ジャスティス ハンコック/gi,'正义 汉考克'],
    [/リリカ/gi,'莉莉卡'],
    [/双挽乃保/gi,'双挽乃保'],
    [/桜華忠臣/gi,'樱华忠臣'],
    [/ジャンヌ ダルク/gi,'圣女贞德'],
    [/マルコス/gi,'马尔克斯'],
    [/ルチアーノ/gi,'卢西安诺'],
    [/Voidoll/gi,'Voidoll'],
    [/ボイドール/gi,'Voidoll'],
    [/深川まとい/gi,'深川缠'],
    [/ソル=バッドガイ/gi,'索尔=巴得凯'],
    [/ディズィー/gi,'蒂姬'],
    [/グスタフ ハイドリヒ/gi,'古斯塔夫 海德里希'],
    [/ニコラ テスラ/gi,'尼古拉 特斯拉'],
    [/初音ミク/gi,'初音未来'],
    [/ミク/gi,'初音未来'],
    [/ヴィオレッタ ノワール/gi,'薇欧莉特 诺瓦露'],
    [/コクリコット ブランシュ/gi,'可可莉柯特 布兰琪'],
    [/リュウ/gi,'隆'],
    [/春麗/gi,'春丽'],
    [/マリア=S=レオンブルク/gi,'玛丽亚=S=莱昂布尔'],
    [/アダム=ユーリエフ/gi,'亚当=尤里耶夫'],
    [/サーティーン/gi,'13 Thirteen'],
    [/かけだし勇者/gi,'新手勇者'],
    [/エミリア/gi,'爱蜜莉雅'],
    [/レム/gi,'蕾姆'],
    [/カイ=キスク/gi,'Ky Kiske'],
    [/メグメグ/gi,'梅古梅古'],
    [/イスタカ/gi,'伊斯塔卡'],
    [/ザック&レイチェル/gi,'扎克&瑞吉尔'],
    [/輝龍院きらら/gi,'辉龙院 绮罗'],
    [/モノクマ/gi,'黑白熊'],
    [/ポロロッチョ/gi,'维纳斯 波罗罗乔'],
    [/アクア/gi,'阿库娅'],
    [/めぐみん/gi,'惠惠'],
    [/ソーン=ユーリエフ/gi,'索恩=尤里耶夫'],
    [/リヴァイ/gi,'利威尔'],
    [/デビルミント鬼龍 デルミン/gi,'薄荷恶魔鬼龙 黛露敏'],
    [/トマス/gi,'托马斯'],
    [/猫宮ひなた/gi,'猫宫日向'],
    [/岡部 倫太郎/gi,'冈部伦太郎'],
    [/零夜/gi,'零夜'],
    [/セイバーオルタ/gi,'Saber Alter'],
    [/ギルガメッシュ/gi,'吉尔伽美什'],
    [/ルルカ/gi,'露露卡'],
    [/ピエール77世/gi,'皮埃尔77世'],
    [/佐藤四郎兵衛忠信/gi,'左藤四郎兵卫忠信'],
    [/アイズ・ヴァレンシュタイン/gi,'艾丝・华伦斯坦'],
    [/狐ヶ咲 甘色/gi,'狐咲甘色'],
    [/ノクティス/gi,'诺克提斯'],
    [/ニーズヘッグ/gi,'HM-WA100'],
    [/中島 敦/gi,'中岛敦'],
    [/芥川 龍之介/gi,'芥川龙之介'],
    [/ゲームバズーカガール/gi,'GBG'],
    [/ライザリン・シュタウト/gi,'莱莎琳·斯托特'],
    [/アリス/gi,'爱丽丝'],
    [/ジョーカー/gi,'Joker'],
    [/イグニス=ウィル=ウィスプ/gi,'伊格尼丝=威尔=威斯普'],
    [/アインズ・ウール・ゴウン/gi,'安兹·乌尔·恭'],
    [/キリト/gi,'桐人'],
    [/アスナ/gi,'亚斯娜'],
    [/Bugdoll/gi,'Bugdoll'],
    [/ステリア・ララ・シルワ/gi,'丝黛莉娅・拉拉・席尔瓦'],
    [/ラム/gi,'拉姆'],
    [/2B/gi,'2B'],
    [/ラヴィ・シュシュマルシュ/gi,'拉薇・修修玛尔休'],
    [/リムル=テンペスト/gi,'利姆鲁=特恩佩斯特'],
//HM-WA100 -> 尼德霍格

//加载页面
    [/データ整形中/gi,'数据生成中'],

//筛选
    [/ソート/gi,'排序'],
    [/リセット/gi,'重置'],
    [/カード/gi,'卡牌'],
    [/ランク/gi,'Rank'],
    [/コラボ/gi,'联动'],
    [/文豪ストレイドッグス/gi,'文豪野犬'],
    [/ファイナルファンタジー/gi,'最终幻想'],
    [/ダンまち/gi,'地错'],
    [/超歌舞伎×千本桜/gi,'超歌舞伎×千本樱'],
    [/進撃の巨人/gi,'进击的巨人'],
    [/この素晴らしい世界に祝福を/gi,'为美好的世界献上祝福'],
    [/ダンガンロンパ/gi,'弹丸论破'],
    [/殺戮の天使/gi,'杀戮天使'],
    [/鏡音リン・レン/gi,'镜音铃・连'],
    [/ギルティギア/gi,'罪恶装备'],
    [/Re:ゼロから始める異世界生活/gi,'Re:从零开始的异世界生活'],
    [/ストリートファイター/gi,'街头霸王'],
    [/ハッカドール/gi,'骇客娃娃'],
    [/ライザのアトリエ/gi,'莱莎的炼金工房'],
    [/ペルソナ/gi,'女神异闻录'],
    [/オーバーロード/gi,'Overlord'],
    [/ソードアートオンライン/gi,'刀剑神域'],

//角色数据
    [/キャラクター/gi,'角色'],
    [/キャラ/gi,'角色'],
    [/データ/gi,'数据'],
    [/タメ/gi,'蓄力'],
    [/ﾋｰﾛｰｽｷﾙ/gi,'必杀技'],
    [/ﾋｰﾛｰｱｸｼｮﾝ/gi,'蓄力技'],
    [/ｱﾋﾞﾘﾃｨ/gi,'被动技'],
    [/ﾏｽ/gi,'格'],
    [/ロール/gi,'英雄'],
    [/ランキング/gi,'排行'],
    [/デッキ/gi,'卡组'],
    [/ﾃﾞｯｷ/gi,'卡组'],
    [/ノックバック/gi,'击退'],
    [/ダッシュ/gi,'冲刺'],
    [/アタック/gi,'攻击'],
    [/プッシュ/gi,'推动'],
    [/ブラスト/gi,'爆炸'],
    [/放物線/gi,'抛物线'],
    [/リスポーン/gi,'复活'],
    [/タンク/gi,'盾职'],
    [/ダメージ/gi,'伤害'],
    [/ブレイク時/gi,'破盾时'],
    [/ガード/gi,'护盾'],
    [/ブレイク/gi,'破坏'],
    [/バフ/gi,'Buff'],
    [/キャンセル/gi,'取消'],
    [/ms単位/gi,'单位：毫秒'],
    [/クールタイム/gi,'冷却时间'],
    [/サイレント/gi,'沉默'],
    [/スタン/gi,'眩晕'],
    [/フラッシュ/gi,'闪光'],
    [/防御ダウン/gi,'防御降低'],
    [/スーパー/gi,'超级'],

//卡牌详情
    [/ﾌﾟｯｼｭ/gi,'推动'],
    [/ﾀｲﾌﾟ/gi,'类型'],
    [/ノックバック/gi,'击退'],
    [/ダウン/gi,'击倒'],
    [/カット/gi,'减少'],
    [/ランチ/gi,'发射'],
    [/吹き飛ばし/gi,'击飞'],
    [/打ち上げ/gi,'发射'],
    [/ポータル/gi,'据点'],
    [/エリア/gi,'领域'],
    [/ライフ/gi,'生命'],

//扭蛋模拟器
    [/ガチャシミュレーター/gi,'扭蛋模拟器'],
    [/デイリー/gi,'每日'],
    [/ガチャ/gi,'扭蛋'],
    [/カスタムピックアップ/gi,'Custom pickup'],
    [/ボーカロイド/gi,'Vocaloid'],
    [/バナー/gi,'banner'],
    [/あくまで予測値による/gi,'基于估计值'],
    [/だからね/gi,'因此捏'],
    [/リスト/gi,'列表'],

//反应速度测试？
    [/カノーネ/gi,'重炮'],
    [/アウト/gi,'出局'],
    [/ランダム/gi,'随机的'],
    [/チェック/gi,'测试'],
    [/がんばれ!/gi,'加油!'],
    [/タイム/gi,'时间'],
    [/スコア/gi,'得分'],

//作战简报部分，btw因为猜拳测试全部都是长句所以放在开头了
    [/ブリーフィング/gi,'作战简报'],
    [/マップ/gi,'地图'],
    [/でら/gi,'Dera'],
    [/ストリート/gi,'街道'],
    [/けっこい/gi,'绮丽'],
    [/スターパーク/gi,'星公园'],
    [/東西たかさん広場/gi,'东西高塔广场'],
    [/グレートウォール/gi,'长城'],
    [/立体交差のある風景/gi,'魔幻森林'],
    [/ライブステージ/gi,'演唱会'],
    [/ケルパーズ/gi,'凯尔帕斯'],
    [/ちゅら島/gi,'美丽岛'],
    [/リゾート/gi,'度假村'],
    [/つっぺる工事現場/gi,'危险的施工现场'],
    [/ドーン/gi,'黎明'],
    [/おいでやす鳥居通り/gi,'欢迎来到鸟居大道'],
    [/かけだせ!/gi,'开始吧!'],
    [/きてる/gi,'来到'],
    [/マジ/gi,'真正的'],
    [/モード切り替え/gi,'模式切换'],
    [/設定に戻る/gi,'返回设置'],
    [/アイコンモード/gi,'图标模式'],
    [/ベクトルモード/gi,'箭头模式'],

//这块基本上没动，因为我根本没用过这玩意儿
    [/カリキュレーター/gi,'计算器'],
    [/チームレベル/gi,'Team level'],
    [/サイド/gi,'side'],
    [/チーム/gi,'team'],
    [/アニメーション/gi,'动画'],

//其他
    [/チュートリアル/gi,'介绍'],
    [/オリジナル/gi,'原创'],
    [/ジェネレーター/gi,'生成器'],
    [/シミュ/gi,'模拟器'],

//这俩简直是毒瘤，什么词都能插进去，所以放在最后面
    [/リン/gi,'镜音铃'],
    [/レン/gi,'镜音连'],

];

var numTerms = replaceArry.length;
                  //-- 5 times/second; Plenty fast.
var transTimer = setInterval (translateTermsOnPage, 222);

function translateTermsOnPage () {
    /*--- Replace text on the page without busting links or javascript
        functionality.
    */
    var txtWalker = document.createTreeWalker (
        document.body,
        NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                //-- Skip whitespace-only nodes
                if (node.nodeValue.trim() ) {
                    if (node.tmWasProcessed)
                        return NodeFilter.FILTER_SKIP;
                    else
                        return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        },
        false
    );
    var txtNode = null;
    while (txtNode = txtWalker.nextNode () ) {
        txtNode.nodeValue = replaceAllTerms (txtNode.nodeValue);
        txtNode.tmWasProcessed = true;
    }
    //
    //--- Now replace user-visible attributes.
    //
    var placeholderNodes = document.querySelectorAll ("[placeholder]");
    replaceManyAttributeTexts (placeholderNodes, "placeholder");

    var titleNodes = document.querySelectorAll ("[title]");
    replaceManyAttributeTexts (titleNodes, "title");
}

function replaceAllTerms (oldTxt) {
    for (var J = 0; J < numTerms; J++) {
        oldTxt = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
    }
    return oldTxt;
}

function replaceManyAttributeTexts (nodeList, attributeName) {
    for (var J = nodeList.length - 1; J >= 0; --J) {
        var node = nodeList[J];
        var oldText = node.getAttribute (attributeName);
        if (oldText) {
            oldText = replaceAllTerms (oldText);
            node.setAttribute (attributeName, oldText);
        }
        else
            throw "attributeName does not match nodeList in replaceManyAttributeTexts";
    }
}