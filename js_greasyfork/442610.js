// ==UserScript==
// @name         光辉物语翻译辅助
// @namespace    hoothin
// @version      0.3.8
// @description  为光辉物语汉化项目在腾讯文档顶部添加翻译辅助按钮，点击条目后增加翻译直达按钮
// @author       hoothin
// @match        https://docs.qq.com/sheet/DWnZ6a2hpUkJRd2JZ*
// @match        https://chat.forchange.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/442610/%E5%85%89%E8%BE%89%E7%89%A9%E8%AF%AD%E7%BF%BB%E8%AF%91%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/442610/%E5%85%89%E8%BE%89%E7%89%A9%E8%AF%AD%E7%BF%BB%E8%AF%91%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.origin == "https://chat.forchange.cn") {
        let hash = location.hash;
        if (hash) {
            hash = decodeURIComponent(hash.slice(1));
            let checkTextarea = () => {
                let textarea = document.querySelector("textarea[data-id='root']");
                if (textarea) {
                    let event = new Event('focus', { bubbles: true });
                    textarea.dispatchEvent(event);
                    let lastValue = textarea.value;
                    var nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                    nativeTextareaValueSetter.call(textarea, `Please help me to translate \`${hash}\` to Chinese, please return only translated content not include the origin text`);
                    event = new Event('input', { bubbles: true });
                    let tracker = textarea._valueTracker;
                    if (tracker) {
                        tracker.setValue(lastValue);
                    }
                    textarea.dispatchEvent(event);
                    event = new Event('change', { bubbles: true });
                    textarea.dispatchEvent(event);
                    setTimeout(() => {textarea.nextElementSibling.click()}, 1);
                } else {
                    setTimeout(checkTextarea, 500);
                }
            }
            setTimeout(checkTextarea, 2500);
        }
        return;
    }
    const wordPlace = [
        ["Vainqueur","ヴァンクール","梵奎尔"],
        ["Cygnus","シグナス","希格纳斯"],
        ["Alistel","アリステル","阿里斯特尔"],
        ["Granorg","グランオルグ","格兰奥冈"],
        ["Imperial Ruins","帝国跡地","帝国遗迹"],
        ["Audience Hall","謁見の間","谒见之间"],
        ["Palace","王宮","王宫"],
        ["El Dorado","エルドラド","埃尔多拉多"],
        ["Cornet Village","コルネ村","科恩村"],
        ["Alma Mine","アルマ鉱山","阿尔玛矿山"],
        ["downtown","観光区","观光区"],
        ["Gran Plain","グラン平原","格兰平原"],
        ["lodging","宿屋","旅馆"],
        ["Forest Square","森の広場","森之广场"],
        ["South Hill","南の高台","南之高台"],
        ["south hill","南の丘","南之丘"],
        ["sewers","地下水路","下水道"],
        ["lookout","展望台","展望台"],
        ["Lazvil Hills","ラズヴィル丘陵","拉斯维尔丘陵"],
        ["Sand Fortress","砂の砦","砂之要塞"],
        ["Judgement Cliffs","裁きの断崖","裁决断崖"],
        ["","コルネ","科恩"],
        ["","秘密の場所","秘密基地"],
        ["commercial district","商業区","商业区"],
        ["Skalla","スカラ","斯卡拉"],
        ["Itolia","イトリア","伊托利亚"],
        ["Itolia Wasteland","イトリア荒野","伊托利亚荒野"],
        ["","書の迷宮","书之迷宫"],
        ["Celestia","セレスティア","塞拉斯提亚"]
    ];
    const wordName = [
        ["Marco","マルコ","马尔科"],
        ["Eruca","エルーカ","艾露卡"],
        ["Selvan","セルバン","塞尔凡"],
        ["Stocke","ストック","斯托克"],
        ["Dias","ディアス","迪亚斯"],
        ["Queen","Eruca","艾露卡女王"],
        ["Sir Dias","ディアス様","迪亚斯爵士"],
        ["Protea","プロテア","普罗蒂亚"],
        ["Resistance","レジスタンス","抵抗军"],
        ["Queen Protea","プロテア女王","普罗蒂亚女王"],
        ["","ウィル","威尔"],
        ["Princess Eruca","","艾露卡王女"],
        ["Lady Eruca","エルーカ様","艾露卡大人"],
        ["Count Selvan","セルバン伯爵","塞尔凡伯爵"],
        ["Prophet Noah","ノア様","诺亚先知"],
        ["Liese","リーズ","莉丝"],
        ["Rosch","ロッシュ","罗施"],
        ["Field Marshal Viola","ビオラ准将","薇奥拉准将"],
        ["Aht","アト","阿托"],
        ["Granorg army","グランオルグ騎士団","格兰奥冈骑士团"],
        ["Hugo","","雨果"],
        ["Noah guy","","诺亚大人"],
        ["Fennel","フェンネル","芬内鲁"],
        ["Bram","ブラム","布拉姆"],
        ["Sir Dias","騎士団長ディアス","骑士团长迪亚斯"],
        ["Garland","ガーランド","加兰德"],
        ["rebel troops","反乱軍","叛军"],
        ["King Viktor","ヴィクトール様","维克托国王"],
        ["High Colonel Dias","ディアス将軍","迪亚斯将军"],
        ["Hilster","ヒルスター","希尔斯特"],
        ["Heiss","ハイス","海斯"],
        ["Desert Crows","砂漠のカラス","沙漠乌鸦"],
        ["thieves","怪盗","怪盗"],
        ["Ricky","リッキー","瑞奇"],
        ["troops","従士隊","侍从部队"],
        ["Pierre","","皮埃尔"],
        ["","新兵部隊","新兵部队"],
        ["Raynie","レイニー","蕾妮"],
        ["Valkyrie","戦女神","女武神"],
        ["Lt. General Raul","ラウル","劳尔中将"],
        ["Desert Crow","砂漠のカラス","砂漠之鸦"],
        ["Golhda","ゴルダ","戈尔达"],
        ["Kaizan","カイザン","凯赞"],
        ["Vanoss","バノッサ","瓦诺萨"],
        ["Gutral","ブルート","古特尔"],
        ["Gafka","ガフカ","加夫卡"],
        ["Bergas","ベルガ","贝尔加"],
        ["Galva","ガルヴァ","加尔瓦"],
        ["Lieutenant Stocke","ストック中尉","斯托克中尉"],
        ["Sergeant","副隊長","副队长"],
        ["Rosch's brigade","ロッシュ隊","罗施部队"],
        ["Anna","アンナ","安娜"],
        ["Nemesia","ネメシア","妮米西亚"],
        ["Ernst","エルンスト","恩斯特"],
        ["Lippti","リプティ","莉普缇"],
        ["Teo","ティオ","提奥"],
        ["General Hugo","ヒューゴ大将","雨果大将"],
        ["Young Lion","","幼狮"],
        ["Tarquin","タルキン","塔昆"],
        ["Ditto","ディトー","迪托"],
        ["Captain Rosch","ロッシュ隊長","罗施队长"],
        ["Sergeant","中尉","中尉"],
        ["Sergeant","少尉","少尉"],
        ["Lieutenant","","中尉"],
        ["Cedric","","塞德里克"],
        ["Samra","サムラ","萨姆拉"],
        ["Wand","ワンド","万德"],
        ["Sonja","ソニア","索尼娅"]
    ];
    const wordItem = [
        ["Divine Water","神聖水","圣水"],
        ["Death Crimson","デスクリムゾン","死亡猩红"],
        ["Sand Sword","砂の剣","沙剑"],
        ["Anti−Curse","アンチカース","反诅咒"],
        ["Red Knife","レッドナイフ","红刀"],
        ["Tourniquets","救命薬","救命药"],
        ["thaumatech","魔動機械","魔动机械"],
        ["Element Shell","エレメントシェル","元素外壳"],
        ["Celes Branch","セレスのえだ","赛雷斯之枝"],
        ["Thaumachine","魔動兵","魔动兵"],
        ["ivy","","藤蔓"],
        ["produce","食材","食材"],
        ["soothing balm","","舒缓香膏"],
        ["charm","","护身符"],
        ["Herbal Tea","","药草茶"],
        ["Holy Water","","复苏之水"],
        ["Almakalite","アルマラカイト","孔雀石"],
        ["Withered Branch","かわいた木","干枯树枝"],
        ["Beast God's Nail","獣神の爪","兽神之爪"],
        ["senior disciple","兄弟子","大弟子"],
        ["Etherion","エーテリオン","以太宝石"],
        ["monocle","モノクル","单片眼镜"],
        ["Goblin Killer","ゴブリンころし","哥布林杀手"],
        ["Anti-Sleep","アンチスリープ","防睡眠剂"],
        ["Mana Crystal","マナの結晶","法力水晶"],
        ["Artifact","アーティファクト","神器"],
        ["conut","コルナッツ","科恩果"],
        ["Alma coal","アルマ石炭","阿尔玛石炭"]
    ];
    const wordOther = [
        ["White Chronicle","白示録","白示录"],
        ["Strike","スマッシュ","打击"],
        ["swordsman","剣士","剑士"],
        ["possible world","可能性世界","可能性世界"],
        ["node","刻印","刻印"],
        ["Alistellians","","阿里斯特尔人"],
        ["Beastkind","獣人","兽人"],
        ["giant boar","大イノシシ","大野猪"],
        ["skills","","武技"],
        ["goblin","ゴブリン","哥布林"],
        ["change","","变换"],
        ["Mana","マナ","法力"],
        ["timeline","","时间线"],
        ["obtained","手に入れた","获得"],
        ["White Page","白示録の切れ端","白示录的残页"],
        ["sword dancing","剣舞","剑舞"],
        ["Gutral","ブルート","猩人"],
        ["Satyros","サテュロス","羊人"],
        ["shaman","シャーマン","萨满"],
        ["joined the party","パーティに加わった","加入了你的队伍"]
    ];
    var transBody = "";
    var tagCon,btnOrder,txtCount;
    function initListener() {
        let container = document.querySelector("div.excel-container");
        let formulaInput = document.querySelector("div.formula-input");
        let barLabel = document.querySelector("div.bar-label");
        if (!container || !formulaInput || !barLabel) {
            setTimeout(() => {
                initListener();
            }, 500);
            return;
        }
        container.addEventListener("click", e => {
            if(/^C/.test(barLabel.innerText)){
                txtCount.innerText = formulaInput.innerText.trim().length;
                return;
            }
            let targetText = formulaInput.innerText.split("\n");
            targetText = targetText.slice(0, parseInt(targetText.length - 2));
            targetText = targetText.join("\n").replace(/\<p\>/g,"\n").replace(/\<.*?\>/g," ");
            transBody = dbC2sbC(targetText).trim();
            if(transBody){
                btnOrder.style.display = "";
                tagCon.innerHTML = "";
                checkWord(wordPlace, transBody);
                checkWord(wordName, transBody);
                checkWord(wordItem, transBody);
                checkWord(wordOther, transBody);
            }
        });
    }

    var transSpan;
    function initView() {
        btnOrder = document.createElement("div");
        btnOrder.style.cssText = "position: fixed;top: 10px;width: 100%;z-index: 9;text-align: center;pointer-events: none;display: none";

        transSpan = document.createElement("span");
        createTransBtn("Google", (target) => {
            window.open(`https://translate.google.com.hk/?client=gtx&dj=1&q=${target}&sl=auto&tl=zh-CN&hl=zh-CN&ie=UTF-8&oe=UTF-8&source=icon&dt=t&dt=bd`,'_blank','height=600,width=800,left=30,top=30,location=no,status=no,toolbar=no,menubar=no,scrollbars=yes');
        });
        createTransBtn("Baidu", (target) => {
            window.open(`https://fanyi.baidu.com/#auto/zh/${target}`,'_blank','height=600,width=1200,left=30,top=30,location=no,status=no,toolbar=no,menubar=no,scrollbars=yes');
        });
        createTransBtn("Deepl", (target) => {
            window.open(`https://www.deepl.com/zh/translator#auto/zh/${target}`,'_blank','height=600,width=800,left=30,top=30,location=no,status=no,toolbar=no,menubar=no,scrollbars=yes');
        });
        createTransBtn("Papago", (target) => {
            window.open(`https://papago.naver.com/?sk=auto&tk=zh-CN&st=${target}`,'_blank','height=600,width=800,left=30,top=30,location=no,status=no,toolbar=no,menubar=no,scrollbars=yes');
        });
        createTransBtn("ChatGPT", (target) => {
            window.open(`https://chat.forchange.cn/#${target}`,'_blank','height=600,width=800,left=30,top=30,location=no,status=no,toolbar=no,menubar=no,scrollbars=yes');
        });
        transSpan.style.cssText = "padding-right: 5px;pointer-events: all;";
        btnOrder.appendChild(transSpan);

        tagCon = document.createElement("span");
        tagCon.style.pointerEvents="all";
        btnOrder.appendChild(tagCon);
        txtCount = document.createElement("span");
        txtCount.style.margin = "10px";
        btnOrder.appendChild(txtCount);

        document.body.appendChild(btnOrder);
    }

    function createTransBtn(serverName, clickFun) {
        var transBtn = document.createElement("button");
        transBtn.style.cssText = "padding: 3px;cursor: pointer;"
        transBtn.innerText = serverName;
        transBtn.addEventListener("click", e=>{
            if(transBody){
                clickFun(encodeURIComponent(transBody));
            }
        });
        transSpan.appendChild(transBtn);
        return transBtn;
    }

    function checkWord(dictArr, str) {
        dictArr.forEach(target => {
            if(target.length != 3)return;
            if((target[0] && new RegExp("\\b"+target[0]+"['s]*\\b","i").test(str)) || (target[1] && str.indexOf(target[1]) != -1)){
                createTag(target[2]);
            }
        });
    }

    function createTag(str){
        var tagBtn = document.createElement("button");
        tagBtn.style.cssText = "padding: 3px;cursor: pointer;";
        tagBtn.innerText = str;
        tagBtn.title = "点击复制";
        tagBtn.addEventListener("click", e => {
            GM_setClipboard(str);
            tagBtn.innerText = "复制成功";
            setTimeout(()=>{if(tagBtn && tagBtn.parentNode)tagBtn.innerText = str;}, 500);
        });
        tagCon.appendChild(tagBtn);
    }

    function dbC2sbC(str){
        var result="",d;
        for(var i=0;i<str.length;i++) {
            var code = str.charCodeAt(i);
            if (code >= 65281 && code <= 65373) {
                d=str.charCodeAt(i)-65248;
                result += String.fromCharCode(d);
            } else if (code == 12288) {
                d=str.charCodeAt(i)-12288+32;
                result += String.fromCharCode(d);
            } else {
                result += str.charAt(i);
            }
        }
        return result;
    }

    function init() {
        initView();
        initListener();
    }

    init();
})();