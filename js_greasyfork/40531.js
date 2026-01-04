// ==UserScript==
// @name         FGO translate
// @version      2.1.1
// @icon         https://lh3.googleusercontent.com/TSst6F-PkOtThWjeSOS-12_vQv6X7ybf1LZNecS4SALYmNoaUavtwlpVKL3UyZWQfg
// @description  GO效率剧场扩展翻译
// @match        http*://docs.google.com/spreadsheets/d/*
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @namespace https://greasyfork.org/users/131449
// @downloadURL https://update.greasyfork.org/scripts/40531/FGO%20translate.user.js
// @updateURL https://update.greasyfork.org/scripts/40531/FGO%20translate.meta.js
// ==/UserScript==

/*
https://docs.google.com/spreadsheets/d/1TrfSDteVZnjUPz68rKzuZWZdZZBLqw03FlvEToOvqH0/htmlview?sle=true#
*/



var $Q = jQuery.noConflict();


//  ↓  翻译数据

var translations = {
    //表框架
	"FGOアイテム効率劇場":"FGO素材效率剧场",
    "FateGOアイテム効率劇場":"FGO素材效率剧场",
    "FateGOアイテム効率劇場PC":"FGO素材效率剧场",
    "各シート概要":"各表单概要",
    "スマホ用表示":" ",
    "はじめに":"介绍",
    "AP効率Best5":"AP效率前5",
    "ドロップ率Best5":"掉率前5",
    "高効率クエストBest 5（AP効率基準）":"AP效率前5关卡",
    "高効率クエストBest 5（ドロップ率基準）":"掉率前5关卡",
    "副産物比較":"副产物比较",
    "AP効率表":"AP效率表",
    "ドロップ率表":"掉率表",
    "クエスト":"关卡",
    "クエスト名":"关卡",
    "1個あたり":"每个所需",
    "絆P/AP":"羁绊/AP",
    "像1+ﾗ凸2":"<div id=xxwc class=xxwc onmouseenter='enter(event);' onmouseleave='leave();'><div id=xxwc1 class=xxwc1plus2>1</div><div id=xxwcleft class=xxwctop>肖</div><div id=xxwcleft class=xxwcbottom>像</div><div id=xxwcplus2 class=xxwc1plus2>+2</div><div id=xxwcright class=xxwctop>满破</div><div id=xxwcright class=xxwcbottom>午餐</div></div>",
    "リンク":"Link",
    "アイテム別":"按素材",
    "1周あたり":"每把",
    "1APあたり":"每AP",
    "ドロップ率":"掉率",
    "サンプル数":"样本数",
    "限凸モナリザ":"满破蒙娜丽莎",
    "未凸1":"未满<br>破1",
    "凸1":"满破1",
    "凸2":"满破2",
    "像1+凸1":"肖像1+<br>满破1",
    "像2+凸1":"肖像2+<br>满破1",
    "像1+凸2":"肖像1+<br>满破2",
    "ランチタイム":"迦勒底午餐",
    "礼装なし":"没有礼装",
    "1周あたりのドロップ率（％）":"每把掉率（％）",
    "絆ポイント効率表":"羁绊效率表",
    "アイテム":"素材",
    "AP/個":"AP/个",
    "ドロップ率/周":"掉率/把",
    "絆P":"羁绊",
    "基本絆P":"基础羁绊",
    "ピース":"银棋",
    "モニュ":"金像",
    "平均獲得QP":"平均获得QP",
    "獲得QPパターン内訳":"获得QP量样本",
    "獲得QP凸モナ":"满破蒙娜丽莎",
    "凸モナ":"满破蒙娜丽莎",
    "獲得QP礼装なし":"无蒙娜丽莎",
    "出現数":"样本数",
    "割合":"比例",
    "級":"等级",


    //素材
    "歯車":"齿轮",
    "ランタン":"鬼灯",
    "ﾗﾝﾀﾝ":"鬼灯",
    "羽根":"羽毛",
    "ホム":"血瓶",
    "ホムベビ":"血瓶",
    "ランプ":"神灯",
    "ﾗﾝﾌﾟ":"神灯",
    "スカラベ":"甲虫",
    "ｽｶﾗﾍﾞ":"甲虫",
    "産毛":"胎毛",
    "貝殻":"贝壳",
    "心臓":"心脏",
    "逆鱗":"逆鳞",
    "涙石":"血泪",
    "蹄鉄":"蹄铁",
    "毒針":"毒针",
    "八連":"八连",
    "勲章":"勋章",
    "鉄杭":"铁钉",
	"火薬":"火药",
    "結氷":"结冰",
	
	"英雄の証":"英雄之证",
	"狂骨":"凶骨",
	"竜の牙":"龙之牙",
	"虚影の塵":"虚影之尘",
	"愚者の鎖":"愚者之锁",
	"万死の毒針":"万死的毒针",
	"魔術髄液":"魔术髓液",
	"世界樹の種":"世界树之种",
	"ゴーストランタン":"鬼魂提灯",
	"八連双晶":"八连双晶",
	"蛇の宝玉":"蛇之宝玉",
	"鳳凰の羽根":"凤凰羽毛",
	"無間の歯車":"无间齿轮",
	"禁断の頁":"禁断书页",
	"ホムンクルスベビー":"人工生命体幼体",
	"隕蹄鉄":"陨蹄铁",
	"大騎士勲章":"大骑士勋章",
	"追憶の貝殻":"追忆的贝壳",
	"竜の逆鱗":"龙之逆鳞",
	"混沌の爪":"混沌之爪",
	"蛮神の心臓":"蛮神心脏",
	"精霊根":"精灵根",
	"戦馬の幼角":"战马的幼角",
	"血の涙石":"血之泪石",
	"黒獣脂":"黑兽脂",
	"封魔のランプ":"封魔之灯",
	"智慧のスカラベ":"智慧之圣甲虫像",
	"原初の産毛":"起源的胎毛",
	"呪獣胆石":"咒兽胆石",
	"宵哭きの鉄杭":"夜泣铁钉",
	"励振火薬":"励振火药",
	"永遠結氷":"永远结冰",
	
    "銅素材":"铜素材",
    "銀素材":"银素材",
	
    "剣ピ":"剑阶银棋",
    "弓ピ":"弓阶银棋",
    "槍ピ":"枪阶银棋",
    "騎ピ":"骑阶银棋",
    "術ピ":"术阶银棋",
    "殺ピ":"杀阶银棋",
    "狂ピ":"狂阶银棋",
    "剣モ":"剑阶金像",
    "弓モ":"弓阶金像",
    "槍モ":"枪阶金像",
    "騎モ":"骑阶金像",
    "術モ":"术阶金像",
    "殺モ":"杀阶金像",
    "狂モ":"狂阶金像",

    //单字
    "骨":"凶骨",
    "牙":"龙牙",
    "塵":"煤灰",
    "頁":"书页",
    "種":"核桃",
    "証":"井盖",
    "爪":"爪子",
    "脂":"黑脂",
    "根":"树根",
    "鎖":"愚锁",

    //地名
    "エリア":"区域",

    //序章
    "屋敷跡":"宅邸残迹",
    "爆心地":"爆炸中心地",
    "大橋":"大桥",
    "燃え盛る森":"熊熊燃烧的森林",
    "X-D（港）":"X-D（鲜红港口）",
    "X-E（教会）":"X-E（骸骨彷徨的教会）",
    "X-F（校舎）":"X-F（烧尽崩塌的校舍）",
    "変動座標点0号（大空洞）":"变动坐标点0号（大空洞）",

    //第一章
    "オルレアン":"奥尔良",
    "ドンレミ":"栋雷米",
    "ヴォークルール":"沃库勒尔",
    "ラ・シャリテ":"拉沙里泰",
    "ジュラ":"汝拉",
    "リヨン":"里昂",
    "マルセイユ":"马赛",
    "ディエール":"蒂耶尔",
    "ティエール":"蒂耶尔",
    "ボルドー":"波尔多",
    "パリ":"巴黎",

    //第二章
    "セプテム":"七丘之城",
    "エトナ火山":"埃特纳火山",
    "アッビア街道":"亚壁街道",
    "フロレンティア":"佛罗伦萨",
    "メディオラヌム":"梅迪奥兰",
    "ゲルマニア":"日耳曼尼亚",
    "黒い森":"黑森林",
    "マッシリア":"玛西格利亚",
    "ブリタニア":"不列颠尼亚",
    "ガリア":"高卢",
    "形ある島":"有形之岛",
    "連合首都":"联军首都",
    "ローマ":"罗马",

    //第三章
    "オケアノス":"俄刻阿诺斯",
    "王の住まう島":"王者的居岛",
    "地図に記された島":"地图上标记的岛",
    "潮目の海":"潮眼之海",
    "翼竜の島":"翼龙之岛",
    "カルデラの島":"火山臼之岛",
    "嵐の海域":"暴风雨海域",
    "静かな入り江":"寂静的入海口",
    "群島":"群岛",
    "豊かな海":"丰硕之海",
    "海賊船":"海盗船",
    "海賊島":"海盗岛",
    "隠された島":"隐秘之岛",

    //第四章
    "ロンドン":"伦敦",
    "オールドストリート":"旧街",
    "ホワイトチャペル":"白色教堂",
    "シティ・オブ・ロンドン":"伦敦城",
    "クラーケンウェル":"克勒肯维尔",
    "サザーク":"萨瑟克",
    "ソーホー":"苏活区",
    "リージェントパーク":"摄政公园",
    "ウェストミンスター":"威斯敏斯特",
    "ハイドパーク":"海德公园",

    //第五章
    "北米":"合众为一",
    "ダラス":"达拉斯",
    "モントゴメリー":"蒙哥马利",
    "デミング":"德明",
    "シャーロット":"夏洛特",
    "リバートン":"里弗顿",
    "ワシントン":"华盛顿",
    "シカゴ":"芝加哥",
    "デンバー":"丹佛",
    "ブラックヒルズ":"布拉克山",
    "デモイン":"得梅因",
    "カーニー":"卡尼",
    "アレクサンドリア":"亚历山德里亚",
    "ラボック":"拉伯克",
    "アルカトラズ":"阿尔卡特拉斯岛",

    //第六章
    "キャメロット":"卡美洛",
    "西の村跡":"西之村遗迹",
    "死の荒野":"死之荒野",
    "隠れ村":"隐秘之村",
    "晩鐘廟":"晚钟庙",
    "聖都市街":"圣都市街",
    "無の大地":"无之大地",
    "聖都正門":"圣都正门",
    "円卓の砦":"圆桌要塞",
    "東の村":"东之村",
    "明けの砂丘":"黎明的沙丘",
    "砂嵐の砂漠":"沙尘暴的沙漠",
    "アトラス院":"阿特拉斯院",

    //第七章
    "バビロニア":"巴比伦尼亚",
	"廃都バビロン":"废都巴比伦",
	"北の高台":"北之高台",
	"黒い杉の森":"黑色杉木林",
	"湿原":"湿地",
	"ウル":"乌尔",
	"エリドゥ":"埃里都",
	"観測所":"观测所",
	"葦の原":"芦苇原",
	"クタ":"库撒",
	"ニップル":"尼普尔",
	"エビフ山":"艾比夫山",
	"鮮血神殿":"鲜血神殿",
	
    //新宿
	"代々木二丁目":"代代木二丁目",
	"新宿駅":"新宿站",
	"バレルタワー":"枪身塔",
	"パーティ会場":"舞会会场",
	"タワー最上階":"塔顶楼",

    //雅戈泰
    "アガルタ":"雅戈泰",

    //雅戈泰
    "下総国":"下总国",

    //塞勒姆
    "セイレム":"塞勒姆",
	
	//永久冻土帝国
	"アナスタシア":"永久冻土帝国",

    //迦勒底之门
    "宝物庫超級":"宝物库 超级",
};

//正则替换词条
var RegStrs = {
    //
    "（周一）":/（月）/,
    "（周二）":/（火）/,
    "（周三）":/（水）/,
    "（周四）":/（木）/,
    "（周五）":/（金）/,
    "（周六）":/（土）/,
    "（周日）":/（日）/,
    "修炼场":/修練場/,
    "$1之$2石":/(\S)([秘,魔,輝])/,
    "枪":/槍/g,
    "骑":/騎/g,
    "术":/術/g,
    "杀":/殺/g,
    "剑":/剣/g,
    "级":/級/g,
    "辉":/輝/g,
    "$1库":/(\S+?)庫/,
};

//  ↓  词条统计

var longestEntry = "";

(function(){
    for(i = 0; i < Object.keys(translations).length; i++){
        if(longestEntry.length < Object.keys(translations)[i].length)
            longestEntry = Object.keys(translations)[i];

    }
    console.log("\ntranslations中的词条个数为：\n" + Object.keys(translations).length + "\n\n最长词条为：\n" + longestEntry + "\n\n其长度为：\n" + longestEntry.length + "\n");
    var links = document.getElementsByTagName("a");
    document.title="FGO素材效率剧场";
    for(var i = 0; i < links.length; i++){
        if(links[i].href.match("1TrfSDteVZnjUPz68rKzuZWZdZZBLqw0")||links[i].href.match("2PACX-1vSgINV7TiiW1Bk")){
            links[i].removeAttribute( "href");
        }
    }
})();


//  ↓  正则表达式：匹配文字，包括英文、日文、汉字（阿拉伯数字视为符号）

var regExpC = /[A-Za-z\u2161-\u216b\u3005\u3040-\u30fa\u30fc-\u30ff\u31f0-\u31ff\u4e00-\u9fff\uf900-\ufaff\uff21-\uff3a\uff41-\uff5a\uff66-\uff9f]/;


//  ↓  将字符串拆分为文字和符号，再查找文字部分的翻译

function findTransC(originalTextC){

    var j = 0, l = 0, p = 0, c = 1;  //字符状态切换位置计数j，截取长度计数l，数组位置计数p，字符状态c：1为文字、2为符号
    var array1 = [], array2 = [], arrayM = [];  //数组array1存放文字、array2存放符号、arrayM用于合并

    for(i = 0; i < originalTextC.length; i++){
        if(regExpC.test(originalTextC.charAt(i))) /*当前字符为文字*/ {
            if (c == 1) /*当前字符的前一个字符为文字*/ {
                l++;
                if(i == originalTextC.length - 1) /*当前字符为最后一个字符*/ {
                    array1[p] = originalTextC.substr(j, l);
                    array2[p] = "";
                }
            }
            else /*当前字符的前一个字符为符号*/ {
                c = 1;  //设置字符状态为文字
                array2[p] = originalTextC.substr(j, l);
                p++;
                j = i;
                l = 1;
                if(i == originalTextC.length - 1){
                    array1[p] = originalTextC.substr(j, l);
                    array2[p] = "";
                }
            }
        }
        else /*当前字符为符号*/ {
            if(c == 2) /*当前字符的前一个字符为符号*/ {
                l++;
                if(i == originalTextC.length - 1)
                    array2[p] = originalTextC.substr(j, l);
            }
            else /*当前字符的前一个字符为文字*/ {
                c = 2;  //设置字符状态为符号
                array1[p] = originalTextC.substr(j, l);
                j = i;
                l = 1;
                if(i == originalTextC.length - 1)
                    array2[p] = originalTextC.substr(j, l);
            }
        }
    }  //把传入的字符串拆分为文字和符号，分别存入array1、array2两个数组中

    for(i = 0; i < array1.length; i++){
        arrayM[i * 2] = translations[array1[i]] ? translations[array1[i]] : array1[i];
        arrayM[i * 2 + 1] = array2[i];
    }  //将文字部分翻译后与符号部分按原顺序存入arrayM

    return arrayM.join("");  //参数为空字符串，表示无分隔符

}


//  ↓  查找翻译

function findTransS(originalTextS){

    if(!originalTextS)
        return null;

    var tmp = originalTextS.trim();  //去掉字符串开头和结尾的空格（主要是为了去掉回车和制表符）
    var tmpC = tmp;

    if(!tmp)
        return originalTextS;

    if((tmp.length <= longestEntry.length) && translations[tmp]){  //直接查找翻译
        return translations[tmp];
    }
    else if(tmp != findTransC(tmp)){
        return findTransC(tmp);
    }
    else{
        for (var x in RegStrs){
            tmpC = tmpC.replace(RegStrs[x],x);
        }
        if(tmpC != tmp){
            return tmpC;
        }
        else{
            return originalTextS;
        }
    }
}


//  ↓  计算节点位置

function getNodeIndex(node){
    var i = 0;
    while(node = node.previousSibling){
        i++;
    }
    return i;
}


//  ↓  新增样式

function addStyle(st){
    $Q('head').append($Q('<style type="text/css" />').html(st));
}


//  ↓  新增脚本

function addScript(sc){
    $Q('head').append($Q('<script type="text/javascript" />').html(sc));
}


//  ↓  遍历 TreeWalker 并翻译

function transTW(tw){
    while(node = tw.nextNode()){
        if(node.title)
            node.title = findTransS(node.title);
        if(node.nodeType == 3 && /[\u2161-\u216b\u3005\u3040-\u30fa\u30fc-\u30ff\u31f0-\u31ff\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(node.nodeValue)){
            var t = node;
            $Q(t).before(findTransS(t.nodeValue));
            node = tw.previousNode();
            $Q(t).remove();
        }
    }
}

//  ↓  素材效率剧场相关

if(/効率劇場|效率剧场/.test($Q("title")[0].text))
    (function(){
        var elTW = document.createTreeWalker(document.body, NodeFilter.SHOW_Element, null, false);
        transTW(elTW);

        var st = "div#xxwc{border-collapse:collapse;padding:0;margin:0;background-color:#073763;position:relative} .xxwc1plus2{padding-top:5px;height:18px;width:12px} #xxwcplus2{position:absolute;top:0px;left:19px}";
        st += " #xxwcleft{position:absolute; left:8px} #xxwcright{position:absolute; left:30px} .xxwctop{top:-2px; height:15px; -webkit-transform: scale(0.75); -o-transform: scale(1)}";
        st += " .xxwcbottom{top:8px; height:15px; -webkit-transform: scale(0.75); -o-transform: scale(1)}  #xxwcMouseOver{position:absolute;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;cursor:default}";
        st += " #innerDiv{width:170px;margin:10px;background-color:#fff;border:1px solid #073763;color:#073763;font-family:serif;line-height:24px;text-align:center;opacity:0.95}";
        st += " a.xxwc{text-decoration:none;color:#073763;cursor:pointer} a.xxwc:hover:before, a.xxwc:hover:after{color:#073763}";
        st += " a.xxwc:before{content:'\\5b';color:#bbb;transition:all 400ms;-o-transition:all 400ms;-moz-transition:all 400ms;-webkit-transition:all 400ms;}";
        st += " a.xxwc:after{content:'\\5d';color:#bbb;transition:all 400ms;-o-transition:all 400ms;-moz-transition:all 400ms;-webkit-transition:all 400ms;}";

        addStyle(st);

        var sc = "var xxwcTimeout;function hideM(){document.getElementById('xxwcMouseOver').style.display='none'} function enter(event){if(xxwcTimeout)clearTimeout(xxwcTimeout);if(document.getElementById('xxwcMouseOver').style.display=='none')";
        sc += "{var x,y;x=event.target.getBoundingClientRect().left;y=event.target.getBoundingClientRect().top;if(y>window.innerHeight-130){y-=95;if(5>x)x=-4;else if(x>window.innerWidth-80)x=window.innerWidth-208;";
        sc += "else if(x>window.innerWidth-300)x-=128;else x-=10}else{if(5>x){x+=45;y-=10}else if(x>window.innerWidth-80){x-=185;y-=10}else{y+=15;if(x>window.innerWidth-300)x-=128;else x-=10}}";
        sc += "document.getElementById('xxwcMouseOver').style.left=x+'px';document.getElementById('xxwcMouseOver').style.top=y+'px';document.getElementById('xxwcMouseOver').style.display='block'}}function leave(){xxwcTimeout=setTimeout('hideM()',400)}";

        addScript(sc);

        $Q('.xxwc').parent().attr('style', 'margin:0;padding:0;');

        if(!$Q('#xxwcMouseOver').length)/*创建提示页*/{
            var xM = "<div id='innerDiv'><div class='xxwcM'>1张 <a class='xxwc' href='http://fgowiki.com/guide/equipdetail/99' target='_blank' onclick='hideM()'>英灵肖像</a></div><div style='line-height:9px' align='center'>+</div>";
            xM += "<div class='xxwcM'>2张 &#x2726;满破&#x2726; <a class='xxwc' href='http://fgowiki.com/guide/equipdetail/330' target='_blank' onclick='hideM()'>午餐时光</a></div><div class='xxwcM'>（1张自己 + 1张支援）</div></div>";
            $Q('body').append('<div id=xxwcMouseOver onmouseenter="enter(event);" onmouseleave="leave();" style="display:none">' + xM + '</div>');
        }

        var pics = [], i = 0, index, t, tr, tmp;

        elTW.currentNode = elTW.root;  //使 TreeWalker 的当前指向回到根节点

        while(node = elTW.nextNode()){
            if(i != -1 && node.nodeValue != "銅素材"){
                if(node.rowSpan == 5 && node.previousSibling.tagName == "TH"){
                    pics[i] = node.innerHTML;
                    i++;
                }
            }
            else{
                i = -1;
                if(node.nodeValue == "証" && /骨/.test($Q(node).parent().next().html())){
                    index = getNodeIndex(node.parentNode);
                    if(index < 5){
                        t = index;
                        tr = node.parentNode.parentNode;
                        while(tr.childNodes[t].innerText != "剑"){
                            tr.childNodes[t].setAttribute("style", "margin:0;padding:0;");
                            $Q(tr.childNodes[t]).append('<div>' + pics[t-index].replace(/w.+px;b/, "width:36px;height:39px;b").replace(/res.+exp/, "resize_h=39&resize_w=36&no_exp") + '</div>');
                            t++;
                        }
                    }
                }
            }
        }
    })();