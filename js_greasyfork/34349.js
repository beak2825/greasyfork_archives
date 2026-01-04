// ==UserScript==
// @name        WaniKani Choose Context Sentences in Reviews
// @namespace   nelemnaru1
// @description Shows the context sentence in the question during vocab reviews. Edited by Applefoot to allow sentence switching.
// @include     *://www.wanikani.com/review*
// @version     2.3
// @license     Please improve and repost!
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34349/WaniKani%20Choose%20Context%20Sentences%20in%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/34349/WaniKani%20Choose%20Context%20Sentences%20in%20Reviews.meta.js
// ==/UserScript==

// START OF SUPPORTED USER-CUSTOMIZABLE SETTINGS //

//Here you can change the scaling factor of the brightly-colored (purple, pink, blue) question area. Set to 0.75 for 75%. Default is 1 (which is 100%, no rescale).
var rescale = 1;

// Here you can set the sentences will show up for vocabulary meaning questions too instead of only vocabulary reading questions. Default is false.
var showSentencesOnMeaning = false;

// Here you can set the context sentence to only appear after a correct answer by setting to true. Default is false (show sentence all the time).
// Useful for users who do not use a script to move to the next question if submitted answer was correct.
var showaftercorrect = false;

// Here you can set the translation to always show under the Japanese sentence. No hovering or clicking required. Default is false.
var alwaysShowTranslation = false;

// Here you can switch between a hover-to-translate mode or a click-to-translate mode. Default is true.
var hoverTranslate = true;

// Here you can change whether the saved sentences (done by clicking) include the English translation. Default is true.
var saveEng = true;


// END OF SUPPORTED USER-CUSTOMIZABLE SETTINGS //




//----------------------------------------NOT SUPPORTED----------------------------------------//
//Here you can set the vocab word to be highlighted in the sentence by setting to true. Default is false (no highlighting).
var highlightword = false;

//Here you can set your current level to mark unknown kanji and kanji in current level in the context sentence. Default is 0 (no kanji will be marked).
var currentlevel = 0;
var otherknownkanji = "";//Here you can add other kanji you already know so that they won't be marked
//----------------------------------------NOT SUPPORTED----------------------------------------//

//currentlevel error check
if (!(Number.isInteger(currentlevel) && currentlevel >= 0 && currentlevel <= 60)) {
    alert("Error: The variable 'currentlevel' is either not a whole number or is outside the range of 0-60. Kanji will not be marked.");
    currentlevel = 0;
}




$("#reviews").append("<div id='savedsentwrap' class='pure-u-1' style='font-size:1em; padding-top:2em; text-align:center'></div>");


$("#character").wrap("<div style='font-size:" + rescale + "em'></div>");
$("#question-type").prepend("<div id='sentwrap' style='font-size:1.5em'><div id='buttons' style='padding: 12px 0px 12px 0px;'></div><div id='sentj'></div><div id='sente'></div></div>");
$("#sentj").click(function() {

  if (hoverTranslate === false) {
    if($("#sente").html() == "　") showTranslation();
    else{ hideTranslation(); }
  }

  else{
      $("#savedsentwrap").prepend("<div class='singlesent'>"+japanese[cur_sentence_index]+"<a href='javascript:void(0);' class='remove'>&times;</a>" +
                                  showEngSavedSent() +
                                  "</div>");

      $(".remove").css(removebuttonstyle);
  }
});

var removebuttonstyle = {
    'color':'grey',
    'text-decoration': "none",
    'font-weight':'bold',
    'user-select': 'none'};
$(".remove").css(removebuttonstyle);



$(document).ready(function(){
     $(document).on("click", "a.remove" , function() {
         $(this).parent().remove();

         if ($('#reviews-summary').length > 0 && $("#savedSentSumWrap > div").length === 0){
             $("#savedSentSum").hide();
         }
     });
});
function showEngSavedSent(){
    if(saveEng) return "<div style='padding-bottom:0.5em' class='engsavedsent'>"+english[cur_sentence_index]+"</div>";
    else return "";
}



if (hoverTranslate === true && alwaysShowTranslation === false){
    $("#sentj").hover( showTranslation, hideTranslation );
    $("#sente").hover( showTranslation, hideTranslation );
}

function showTranslation(){
    $("#sente").html(english[cur_sentence_index]);
}
function hideTranslation(){
    $("#sente").html("　");
}

var cur_sentence_index;


function nextSentence(){
    cur_sentence_index++;
    if (cur_sentence_index == japanese.length){
        cur_sentence_index = 0;
    }
    updateDisplay();
}
function prevSentence(){
    cur_sentence_index--;
    if (cur_sentence_index == -1){
        cur_sentence_index = japanese.length-1;
    }
    updateDisplay();
}

function updateDisplay(){
    $("#sentj").html(japanese[cur_sentence_index]);
    $("#sente").html("　");

    if (alwaysShowTranslation === true){
        showTranslation();
    }

    $("#buttons").html('<button id="prevBtn" type="button" style="background:none;border:none;color:white" onclick="window.dispatchEvent(new Event(\'prevSen\'));"><</button>'+ String(cur_sentence_index + 1) +
                       '<button id="nextBtn" type="button" style="background:none;border:none;color:white" onclick="window.dispatchEvent(new Event(\'nextSen\'));">></button>'+
                       '</div>');

    if ($.jStorage.get('questionType') == "meaning"){
        $("#buttons").html('<button id="prevBtn" type="button" style="background:none;border:none;color:black" onclick="window.dispatchEvent(new Event(\'prevSen\'));"><</button>'+ String(cur_sentence_index + 1) +
                       '<button id="nextBtn" type="button" style="background:none;border:none;color:black" onclick="window.dispatchEvent(new Event(\'nextSen\'));">></button>'+
                       '</div>');
    }

}


var current_item, jvoc, previous_item, gettingjson;

var japanese = [];
var english = [];


//Formatting for highlighted vocab word
var highlightVocab = function() {
    if ($.jStorage.get('questionType') == "reading") {$(".highlighted").css({"color":"#2e2e2e","background-color":"#fff"});}
    if ($.jStorage.get('questionType') == "meaning") {$(".highlighted").css({"color":"#e9e9e9","background-color":"#555"});}
};

//Formatting for marking kanji
var highlightKanji = function() {
    if ($.jStorage.get('questionType') == "reading") {$(".kanjicurrent").css({"color":"#80f0f0"});$(".highlighted > .kanjicurrent").css({"color":"#2e80f0"});}
    if ($.jStorage.get('questionType') == "meaning") {$(".kanjicurrent").css({"color":"#5080e9"});$(".highlighted > .kanjicurrent").css({"color":"#80e9e9"});}
    
    if ($.jStorage.get('questionType') == "reading") {$(".kanjiunknown").css({"color":"orange"});}
    if ($.jStorage.get('questionType') == "meaning") {$(".kanjiunknown").css({"color":"red"});}
};


//Make list of known and current kanji based on level
if (currentlevel !== 0) {
    var listkanji = getWKKanjiLevels();
    var listcurrent = listkanji[currentlevel - 1];
    var listknown = "";
    for (i = 0; i < currentlevel; i++) {
        listknown = listknown + listkanji[i];
    }
    listknown = listknown + otherknownkanji;
}

//Show sentence after correct answer
if (showaftercorrect) {
    $("#answer-form form button").on("click",function() {
        setTimeout(function(){
          　if (current_item.voc !== undefined && $("#answer-form form fieldset").hasClass("correct")){
               $("#sentwrap").show();
               if (showSentencesOnMeaning === false && $.jStorage.get('questionType') == "meaning"){
                   $("#sentwrap").hide();
               }
           }
        }, 100);
    });
}


//Get initial sentence
getSentences();


//Get sentences when question changes
$.jStorage.listenKeyChange('currentItem', getSentences);

function getSentences(){

    //$("#sente").hide();
    

    current_item = $.jStorage.get('currentItem');

    //if ($.jStorage.get("questionType") == "meaning") {$("#sentwrap").hide();}
    //else{$("#sentwrap").show();}


    if (showSentencesOnMeaning === false && $.jStorage.get('questionType') == "meaning"){
            $("#sentwrap").hide();
    }
    else{   $("#sentwrap").show();

    }

    if (current_item.voc === undefined) {
         $("#sentwrap").hide();
    }

    if (showaftercorrect) {$("#sentwrap").hide();}

    cur_sentence_index = 0;
    japanese = [];
    english = [];


    if (previous_item !== current_item.voc) {
        $("#sentj").html("　");//blank sentence area while fetching json
        $("#buttons").html("　");
    } else {//immediately change highlight color when sentence stays same (smooth transition in Single Mode)
        if (highlightword) {highlightVocab();}
        if (currentlevel !== 0) {highlightKanji();}
    }

    previous_item = current_item.voc;

    if (gettingjson) {gettingjson.abort();} //Abort previous getJSON

/*Following is code courtesy of rfindley to fetch sentences*/
    // Only vocab has context sentences.
    if (current_item.voc !== undefined) {
        var url = '/json/vocabulary/' + current_item.id;

        // Grab the item info from WK server.  Process result when it arrives.
        gettingjson = $.getJSON(url, function(json) {
            // Extract the sentences from the item info.
            var context_sentences = json.sentences;
            //console.log('Sentences for ' + current_item.voc + ':');

            // Output each sentence to the console.
            $.each(context_sentences, function(idx, sentence) {


                japanese.push(sentence[0]);
                english.push(sentence[1]);
                //console.log('  J: ' + japanese);
                //console.log('  E: ' + english);
                //return false;
            });
/*End of code by rfindley*/

        updateDisplay();


      //  $("#buttons").setAttribute("style","background:none;border:none;");


        window.addEventListener('prevSen',prevSentence);
        window.addEventListener('nextSen',nextSentence);

        if (japanese.length == 1){
        $("#buttons").hide();
        }


        //Highlight vocab in sentence
        if (highlightword) {
            jvoc = current_item.voc;
            while (japanese[0].indexOf(jvoc) === -1) {
                if (jvoc.length == 1) {console.log("Search failed");break;}
                jvoc = jvoc.slice(0,jvoc.length - 1);
            }
            $("#sentj").html(japanese[0].replace(new RegExp(jvoc,'g'),"<span class='highlighted' style=text-shadow:none>"+jvoc+"</span>"));
            highlightVocab();
        }

        //Highlight current and unknown kanji in sentence
        if (currentlevel !== 0) {
            var sentjhtml = $("#sentj").html();
            var sentkanji = sentjhtml.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g);
            //console.log(sentkanji);
            for (i = 0; i < sentkanji.length; i++) {
                  if (listknown.indexOf(sentkanji[i]) == -1) {sentjhtml = sentjhtml.replace(new RegExp(sentkanji[i],'g'),"<span class='kanjiunknown'>"+sentkanji[i]+"</span>");}
            }
            for (i = 0; i < listcurrent.length; i++) {
                  sentjhtml = sentjhtml.replace(new RegExp(listcurrent[i],'g'),"<span class='kanjicurrent'>"+listcurrent[i]+"</span>");
            }
            $("#sentj").html(sentjhtml);
            highlightKanji();
        }

        });
    } else {
        $("#sentj").html("");
        $("#sente").html("");
    }

}




// Sentence saving summary code here //
if($('#reviews-summary').length > 0 && savedSentHtml !== ""){
    $("#reviews-summary").children().last().before("<div class='pure-g-r'><div id='savedSentSum' class='pure-u-1'></div></div>");

    $("#savedSentSum").css('background-color', $('#correct').css('background-color'));
    $("#savedSentSum").css('box-shadow', $('#correct').css('box-shadow'));
    $("#savedSentSum").html("<h2>Sentences Saved</h2><div id='savedSentSumWrap'></div>");



    $("#savedSentSum h2").css('padding', $('#correct h2').css('padding'));
    $('#savedSentSum h2').css('margin', $("#correct h2").css('margin'));
    $('#savedSentSum h2').css('color', $("#correct h2").css('color'));
    $('#savedSentSum h2').css('font-size', $("#correct h2").css('font-size'));
    $('#savedSentSum h2').css('font-weight', $("#correct h2").css('font-weight'));
    $('#savedSentSum h2').css('letter-spacing', $("#correct h2").css('letter-spacing'));
    $('#savedSentSum h2').css('line-height', $("#correct h2").css('line-height'));
    $('#savedSentSum h2').css('text-shadow', $("#correct h2").css('text-shadow'));
    $('#savedSentSum h2').css('background-color', $("#correct h2").css('background-color'));
    $("#savedSentSumWrap").css('padding', $('#savedSentSum h2').css('padding'));

    $(".remove").css(removebuttonstyle);
    $(".singlesent").css('color','#a2a2a2');

    //reverse order of sentences
    $('#savedSentSumWrap > .singlesent').each(function() {
        $(this).prependTo(this.parentNode);
    });


}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function getWKKanjiLevels() {
    return [
        /* 1:*/ "七二三山女大入九人八上一川力口下十工",
        /* 2:*/ "千丁才右水火白玉立小手目又四夕日月正子了出六刀天犬王左石五田土円文丸木中本",
        /* 3:*/ "牛公切少太戸止外矢母万父久広生分友用方北半市台引古今心午毛兄元内冬",
        /* 4:*/ "花竹他氷皮皿休主糸耳町虫不仕車赤百村見気名写貝礼申去字央男号世年打平代早足先",
        /* 5:*/ "図肉学交同行西体声走谷雨空金音青林回作近池里社会光売毎何麦角自弟米形来色当多考羽草言",
        /* 6:*/ "姉有亡化安両血明店知歩死南科茶活海全地羊前長星次京東室国曲食妹夜州後直点思画首向",
        /* 7:*/ "札未由辺失必家弱末校紙教理魚鳥船雪黄週欠風通黒夏民高付記氏強組時以",
        /* 8:*/ "対君投役研買馬絵楽話雲数所住電合反間答番決医局身助朝場者道支究森",
        /* 9:*/ "乗仮負県待重表物新予使勝泳具部持送度談服美和返定界発客事受始実相屋要苦",
        /*10:*/ "農終鳴親集酒速読業頭院飲顔聞習調最転路運鉄葉漢進横語落算歌配起開線軽病",
        /*11:*/ "意位神洋成争味伝指初低良好育便放競注拾仲特努共波老労秒追令功働別利命岸昔戦級",
        /*12:*/ "員階章短都第倍深温庭祭動息根流商島登童悲植期歯勉寒旅消陽暑球着族湯泉悪港野",
        /*13:*/ "練駅願暗詩銀館士標課然賞鏡謝映問様想橋億熱養緑疑皆像殺料器輪情福題整感選宿",
        /*14:*/ "例協季固周求技格能私骨卒囲望約基術参的残雰材妥希束折頑念松完芸性",
        /*15:*/ "寺飯列秋帰岩昼区計建坂司泣猫軍英築信変仏式法毒昨晩夫単晴勇丈紀浅春",
        /*16:*/ "冒遠保阪真守急箱荷典府喜笑辞取弁留証面係門浴険冗品専危政園曜存書幸関治",
        /*17:*/ "兵説恋幻鼻席塩結無果干梅非渉是識官因底愛覚警側虚常細敗署栄薬堂察原",
        /*18:*/ "煙訓報弓汽喫等句験僧胸洗達可脳類種忘禁枚静借禅焼座祈告試許",
        /*19:*/ "加笛史易連比順減節若財布閥舌宙混暴団履忙得徒困善冊続宇絡歴乱容詞改昆",
        /*20:*/ "飛震災在産嫌経妻圧夢倒裕穴議被尻害尾論罪難機個厚確防犯妨余臭械率",
        /*21:*/ "資判権設評任批検際敵企増責挙制務件総岡断認解税義審済委査素省条派",
        /*22:*/ "応各脱誕提坊置案勢統営値態過援策吸藤領観価宮寝賀副域姿罰費状示",
        /*23:*/ "裁収贅停準職師革導律鬼看割施崎護規秀宅幹呼張現沢俳城乳優則演備",
        /*24:*/ "供違質株製額狭届腰肩庁型載触管差視量象境武述環展祝輸燃販担腕層",
        /*25:*/ "替肥模居含与渡限票況影捕景抜掛逮訟属鮮補慣絞捜隠豊満構効候輩巻訴響",
        /*26:*/ "接占振討針徴怪獣突再障鉛筆較河菓刺励激故貯往創印造復独汗豚郵従授我",
        /*27:*/ "貸訪誘退迫途段痛胃眠迷極靴症給健端招就濃織郎昇締惑悩睡屈康暇怒腹",
        /*28:*/ "浜潔衆巨微婦凍児奇麗移妙逆稚博撃録清修隊券益精程憲並傘絶幼綺攻処庫冷",
        /*29:*/ "積杯監欧乾雄韓閣僚怖烈猛略娘宗寄江促催宴臣督診詰恐街板添索請緊航壊",
        /*30:*/ "盗騒懐遊浮系版預適貧翌延越符婚旗押渇魅快照覧更飾漏枕撮詳乏背購",
        /*31:*/ "救探粉棒融既菜編華普豪鑑除幾尋廊倉孫径泥嘆驚帯散貨陸脈均富徳偵巣掃似離墓",
        /*32:*/ "興複秘迎志卵眼序衛賛飼密績銭込祖雑党暖厳欲染机恩永液捨訳酸桜汚採傷",
        /*33:*/ "装異筋皇窓簡誌否垂宝拡灰宣忠納盛砂肺著蔵諸蒸裏賃操敬糖閉漠暮尊熟",
        /*34:*/ "沿拝粋聖磁射歓劇豆枝爪貴奴隷芋縮紅幕純推承損刻揮誤丼降薦臓縦腐源吐勤",
        /*35:*/ "汁酢舎銅酔破滞亀彼炎介厄紹講互剣寿杉鍋払湖醤測油恥彫噌為遅熊己獄",
        /*36:*/ "継牙甘舞般鹿超廃債献療姓貿遺及維縄津伎伸奈幅頼沖摘核踏旧盟将依換諾",
        /*37:*/ "償募執戻抗湾遣聴臨塁陣旬兆契刑香崩患抵爆弾闘恵跳昭漁跡削掲狙葬抱",
        /*38:*/ "致齢奏刊伴却慮称賄択描緒緩賂贈需避繰奥懸房盤託妊娠扱逃宜傾還併抑",
        /*39:*/ "雇岐仙奪拒鋼甲埼群充勧御譲銃項圏免埋祉謙邦渋壁斐棋片躍稲鈴枠隆控阜慎",
        /*40:*/ "排敷薄雅隣顧頻柱唱吹駆孝褒兼俊巡堀戒携衝敏鋭獲透誉殿剤駐殖茂繁犠",
        /*41:*/ "蜜徹瀬包措撤至墟蜂蛍虎酎郷艦仁炭拳潜鉱衣偽侵棄拠伺樹遜儀誠畑",
        /*42:*/ "括荒堅喪綱斎揚到克床哲暫揺握掘弧泊枢析網糾範焦潟滑袋芝肝紛柄軸挑双",
        /*43:*/ "裂露即垣珍封籍貢朗誰威沈滋摩柔岳刷牧距趣旨撲擦懲炉滅泰琴沼斉慰筒潮襲懇",
        /*44:*/ "謎芽嵐吉俺朱桃髪梨涙僕丘雷匹斗竜缶笠娯寸姫縁侍忍刃翼塔叫棚粒釣叱砲辛",
        /*45:*/ "卓磨湿翔塊凶狩鐘肌澄菌硬陰稼溝滝狂賭裸塾眺呪曇井舟矛疲暦嬢也脚魂嫁頃霊",
        /*46:*/ "鳩棟墨寮魔鈍穏泡碁吾帝幽零寧斬猿歳椅鍵瞳瞬錬癖租黙鍛綿阻菊穂俵庄誇架涼盆孔",
        /*47:*/ "芯欺巾爽佐瞭粘砕哀尺柳霧詐伊炊憎帽婆如墜塀扉扇憩恨幣崖掌挿畳滴胴箸虹唇粧",
        /*48:*/ "蛇辱闇悔憶溶輝耐踊賢咲脇遂殴塗班培盾麻脅彩尽蓄騎隙畜飢霜貼鉢帳穫斜灯迅蚊餓",
        /*49:*/ "陛俗駒桑悟抽拓誓紫剛礎鶴壇珠概征劣淡煮覆勘奨衰隔潤妃謀浸尼唯刈陶拘",
        /*50:*/ "漂簿墳壮奮仰銘搬把淀伯堤訂巧堰彰廷邪鰐峰亭疫晶洞涯后翻偶軌諮漫蟹鬱唐駄",
        /*51:*/ "亮偉召喚塚媛慈挟枯沸浦渦濯燥玄瓶耕聡肪肯脂膚苗蓮襟貞軒軟邸郊郡釈隅隻頂",
        /*52:*/ "乃倫偏呂唆噴孤怠恒惰慢擁殊没牲猟祥秩糧綾膨芳茨覇貫賠輔遇遭鎖陥陳隼須颯",
        /*53:*/ "丹准剰啓壌寛帥徐惨戴披据搭曙浄瓜稿緋緯繊胞胡舗艇莉葵蒙虐諒諭錦随駿騰鯉",
        /*54:*/ "且傲冠勲卸叙呆呈哺尚庶悠愚拐杏栞栽欄疎疾痴粛紋茎茜荘謡践逸酬酷鎌阿顕鯨",
        /*55:*/ "之伏佳傍凝奉尿弥循悼惜愉憂憾抹旦昌朴栃栓瑛癒粗累脊虜該賓赴遼那郭鎮髄龍",
        /*56:*/ "凛凡匠呉嘉宰寂尉庸弊弦恭悦拍搾摂智柴洪猶碑穀窒窮紳縛縫舶蝶轄遥錯陵靖飽",
        /*57:*/ "乙伐俸凸凹哉喝坪堕峡弔敢旋楓槽款漬烏瑠盲紺羅胎腸膜萌蒼衡賊遍遮酵醸閲鼓",
        /*58:*/ "享傑凌剖嘱奔媒帆忌慨憤戯扶暁朽椎殻淑漣濁瑞璃硫窃絹肖菅藩譜赦迭酌錠陪鶏",
        /*59:*/ "亜侮卑叔吟堪姻屯岬峠崇慶憧拙擬曹梓汰沙浪漆甚睦礁禍篤紡胆蔑詠遷酪鋳閑雌",
        /*60:*/ "倹劾匿升唄囚坑妄婿寡廉慕拷某桟殉泌渓湧漸煩狐畔痢矯罷藍藻蛮謹逝醜"
    ];
}