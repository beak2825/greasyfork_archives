// ==UserScript==
// @name         【PPP】プレイングページ拡張
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://control1993.reversion.jp/scenario/playing/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37554/%E3%80%90PPP%E3%80%91%E3%83%97%E3%83%AC%E3%82%A4%E3%83%B3%E3%82%B0%E3%83%9A%E3%83%BC%E3%82%B8%E6%8B%A1%E5%BC%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/37554/%E3%80%90PPP%E3%80%91%E3%83%97%E3%83%AC%E3%82%A4%E3%83%B3%E3%82%B0%E3%83%9A%E3%83%BC%E3%82%B8%E6%8B%A1%E5%BC%B5.meta.js
// ==/UserScript==
(function() {
    var that = this;
    /*
//スタイルシート適用
document.head.innerHTML +=
    '<style>.date{position:fixed;bottom:1px;right:1px;opacity:0.9;padding:2px;background:lightgreen;}'+
    '.date img{width:40px;height:40px;}'+
    '.date{overflow-y: auto;max-height: 99%;}'+
    '@media print{.date{display:none;}.main {width: 100%;}}'+
    '.main {width: 90%;}'+
    '.base-status{width:40%;}.extra-status{width:40%;}'+
    '.base-status th:first-child ,.base-status th ,.extra-status th:first-child{width:5em;white-space:normal;}'+
    'td.extra-status.table-parent th,td.base-status.table-parent th{width: 1em;}'+
    '.fame {font-size:0.9em;width: 20%;}'+
    '.base-status.table-parent td{width: 11em;}'+
    '.con_hide{display:none;}'+
    'header{height: 30px;}'+
    '.header-inner h1{margin: 0 10px;}'+
    '.close-window-button{display:none;}'+
    '.control-buttons {text-align: inherit;}'+
    '.attention {color:red;font-weight:bold;}'+
    '.attention2 {color:darkblue;font-weight:bold;}'+
    '.playing_scroll {display:none; opacity:0.7;}'+
    '</style>'
    ;
*/
    document.head.innerHTML +=
        '<style>'+
        ".date{position:fixed;bottom:1px; right:1px; opacity:0.9;"+
        "max-width: 50px; text-align: center;"+
        "padding:2px; margin:3px; background:lightgreen; overflow-y:auto; max-height:99%;)";
        '.date img{width:40px;height:40px;}'+
        '.playing_scroll, .member1, .plot_list1, .ikkatu1{display:none;}'
        '@media print{.date{display:none;}.main {width: 100%;}}'+
        '</style>'
    ;

    //タイトルコピペ君
    var headerinner = document.getElementsByClassName("header-inner");
    var op_title = headerinner[0].getElementsByTagName("h1")[0].innerHTML
    .replace(/シナリオ『(.+)』プレイング一覧/g, '$1');
    var namemei = document.querySelectorAll('a .name-mei');
    var namemei_in = [];
    for(var nm1=0;nm1<namemei.length;nm1++){
        namemei_in[nm1] = namemei[nm1].innerHTML;
    }


    headerinner[0].getElementsByTagName("h1")[0].innerHTML =
        '依頼名<input type="text" value="'+
        op_title+
        '" onclick="this.select();document.execCommand(\'copy\');" style="width:23em;"></input>'+
        //一括表示・非表示ボタン
        '<input type="text" id="pclist" value="'+namemei_in.join(',')+'" style="width:0.5em;">'+
        '<button id="member" class="member1" title="参加ＰＣリストをカンマ区切りで出力">①</button>'+
        '<button id="plot_list" class="plot_list1" title="プロットシートをダウンロード">②</button>'+
        '<button id="ikkatu" class="ikkatu1" title="一括で表示・非表示">③</button>';

    var member = document.getElementById('member');
    member.addEventListener( "click" , function () {
        if(confirm("ＰＣリストをコピーします")){
            var urltext = document.getElementById("pclist");
            urltext.select();
            document.execCommand("copy");
        }
    } , false );

    var plot_list = document.getElementById('plot_list');
    plot_list.addEventListener( "click" , function () {
        if(confirm("専用プロットシートをダウンロードします")){
            var namemei = document.querySelectorAll('a .name-mei');
            var namemei_in = [];
            for(var nm1=0;nm1<namemei.length;nm1++){
                namemei_in[nm1] = "・"+namemei[nm1].innerHTML+"：";
            }
            var text = op_title+' プロットシート\n\n●\n'+namemei_in.join('\n');
            var blob = new Blob([text], {type: "text/plain"});
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.target = '_blank';
            a.download = op_title+".txt";
            a.click();
        }
    } , false );

    var ikkatu = document.getElementById('ikkatu');
    ikkatu.addEventListener( "click" , function () {
        if(document.body.className == ''){
            document.body.classList.add('basic-data-hidden','profile-hidden','skillequip-hidden','playing-hidden','status-values-hidden');
        }else{
            document.body.classList.remove('basic-data-hidden','profile-hidden','skillequip-hidden','playing-hidden','status-values-hidden');
        }
    } , false );

    //すべてのリンクを新規ウィンドウで開く設定に
    var all_link = document.getElementsByTagName("a");
    for(var al1=0;al1<all_link.length;al1++){
        all_link[al1].setAttribute("target","_blank");
    }


    //名前情報エリア
    var charactername = document.getElementsByClassName("character-name");
    var charactername_make = [];
    var charactername_vanilla = [];
    var charactername_sub = [];
    var name_support = [];
    var album_support = [];
    for(var cn1=0;cn1<charactername.length;cn1++){
        charactername_make[cn1] =
            charactername[cn1].getElementsByTagName("a")[0].innerHTML
            .replace(/<("[^"]*"|'[^']*'|[^'">])*>|^\s+|\s+$/g,"");
        charactername_vanilla[cn1] =
            charactername[cn1].getElementsByClassName("name-mei")[0].innerHTML;
        charactername_sub[cn1] =
            charactername[cn1].getElementsByTagName("a")[0].innerHTML
            .replace(/<span.+span>|『.+』|（.+）|＝.+＝|・.+・|・| |＝|^\s+|\s+$/g,"");
        //    charactername[cn1].getElementsByTagName('img')[0].style.float = "left";
        name_support[cn1] = document.createElement('span');
        name_support[cn1].classList.add('name_support');
        charactername[cn1].insertBefore(name_support[cn1], charactername[cn1].getElementsByTagName('small')[0].nextSibling);
        album_support[cn1] = document.createElement('span');
        album_support[cn1].classList.add('album_support');
        charactername[cn1].insertBefore(album_support[cn1], charactername[cn1].getElementsByTagName('small')[0].nextSibling);

        //アルバムとか直リンク
        album_support[cn1].style.width = "5px";
        album_support[cn1].innerHTML =
            '<br><a href="https://rev1.reversion.jp/scenario/mylist/'+
            charactername_make[cn1].replace(/.+（(.+)）/g,"$1")+
            '" target="_blank">&#x1f4c3</a>'+
            '/<a href="https://rev1.reversion.jp/character/album/'+
            charactername_make[cn1].replace(/.+（(.+)）/g,"$1")+
            '" target="_blank">&#x1f3b4</a>';

        name_support[cn1].style.margin = "1em";
        name_support[cn1].innerHTML =
            //名前コピペくん
            '<foam><input type="text" value="'+
            charactername_make[cn1]+
            '" onclick="this.select();document.execCommand(\'copy\');" style="width:52%;"></input>'+
            '<input type="text" value="'+
            charactername_vanilla[cn1]+
            '" onclick="this.select();document.execCommand(\'copy\');" style="width:20%;"></input>'+
            '<input type="text" value="'+
            charactername_sub[cn1]+
            '" onclick="this.select();document.execCommand(\'copy\');" style="width:18%;background:lightgray;"></input></form>';
    }


    //スクロールナビゲーション
    //各画像ID名にそってスクロールさせるアクション
    function scroll() {
        document.getElementsByName(this.id)[0].scrollIntoView(true);
    }
    var navigation = document.createElement('div');
    navigation.classList.add('date');
    var joiner = document.getElementsByClassName("character");
    var navigation_img = [];
    for(var j1=0;j1<joiner.length;j1++){
        document.getElementsByClassName("playing")[j1].id = j1+'pl';

        navigation_img[j1] = document.createElement('img');
        navigation_img[j1].src =
            document.getElementsByClassName("character-name")[j1]
            .getElementsByTagName('img')[0].src;
        navigation_img[j1].id = joiner[j1].getElementsByTagName('a')[0].name;
        navigation_img[j1].title =
            document.getElementsByClassName("character-name")[j1]
            .getElementsByClassName('name-mei')[0].innerHTML;

        //クリック時にscrollを実行
        navigation_img[j1].addEventListener("click", scroll, false);

        navigation.appendChild(navigation_img[j1]);
    }
    var my_div = document.getElementsByClassName("main")[0];
    my_div.parentNode.insertBefore(navigation, my_div);

    //ウォーカーイラセキュを畳む
    var con_hide = document.getElementsByClassName("con_hide");
    var con_text = "obj2=this.parentNode.getElementsByClassName('con_hide')[0].style; obj2.display=(obj2.display==\'block\')?'none':'block';";
    for(var ch2=0;ch2<con_hide.length;ch2++){
        con_hide[ch2].id = "setch";
        con_hide[ch2][1] = document.createElement('button');
        con_hide[ch2][1].innerHTML = "詳細表示/非表示";
        con_hide[ch2][1].id = "ch_button";
        con_hide[ch2][1].setAttribute("onclick", con_text);
        con_hide[ch2].parentNode.insertBefore(con_hide[ch2][1], con_hide[ch2]);
    }

    //基本情報の項目短縮
    var reduction_st = function(set){
        var table_parent_set = document.getElementsByClassName(set);
        for(var tp2=0;tp2<table_parent_set.length;tp2++){
            table_parent_set[tp2].innerHTML =
                table_parent_set[tp2].innerHTML
                .replace(/(<th>.)[^\x01-\x7E]+(<\/th>)/g, '$1$2');
            table_parent_set[tp2].innerHTML =
                table_parent_set[tp2].innerHTML
                .replace(/(<th>\S)[^\x01-\x7E]+\S<br>\S[^\x01-\x7E]+/g, '$1');
        }
    }
    reduction_st('base-status');
    reduction_st('extra-status');
    reduction_st('skills');

    //プロフィールと通信欄のURLをリンク化（ツイッターアカウント表記含む）
    var profile1 = document.getElementsByClassName("profile");
    for(var pf1=0;pf1<profile1.length;pf1++){
        profile1[pf1].innerHTML = profile1[pf1].innerHTML
            .replace(/(アドリブ)/g,'$1'.bold().fontcolor("darkgreen"))
            .replace(/(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/g, '<a href="$1" target="_blank">$1</a>')
            .replace(/(@[\w/:%#\$&\?\(\)~\.=\+\-]+)/g, '<a href="https://twitter.com/$1" target="_blank">$1</a>')
        ;
    }


    //スキル効果補足
    var skills = document.getElementsByClassName("comment_detail");
    for(var sn2=0;sn2<skills.length;sn2++){
        skills[sn2].innerHTML = skills[sn2].innerHTML
            .replace(/【副】/g, '<span class="attention" title="シナリオ時、副行動で使用出来る。">【副】</span>')
            .replace(/【万能】/g, '<span class="attention" title="レンジによる不利補正を受けない。">【万能】</span>')
            .replace(/【無】/g, '<span class="attention" title="ダメージ無し。">【無】</span>')
            .replace(/【自付】/g, '<span class="attention" title="自分付与。自分の能力を8ターンの間アップ。同系効果は最大値を適用。マイナスがある場合は差し引きとする。">【自付】</span>')
            .replace(/【付与】/g, '<span class="attention" title="対象付与。対象の能力を8ターンの間アップ。同系効果は最大値を適用。マイナスがある場合は差し引きとする。">【付与】</span>')
            .replace(/【他者付与】/g, '<span class="attention" title="対象付与。対象の能力を8ターンの間アップ。同系効果は最大値を適用。マイナスがある場合は差し引きとする。">【他者付与】</span>')
            .replace(/【弱点】/g, '<span class="attention" title="攻撃命中時、対象が防御値判定に成功した時、その効果を半減させる。">【弱点】</span>')
            .replace(/【防無】/g, '<span class="attention" title="攻撃命中時、対象の防御値判定を無効化する。">【防無】</span>')
            .replace(/【治癒】/g, '<span class="attention" title="この属性を持つスキルはレンジによる効果減衰の影響を受けず、ダメージを与えない。">【治癒】</span>')
            .replace(/【BS無効】/g, '<span class="attention" title="付与状態にある限りBSを全て無効化する。">【BS無効】</span>')
            .replace(/【連】/g, '<span class="attention" title="CT時、もう一度同じ攻撃をする。">【連】</span>')
            .replace(/【飛】/g, '<span class="attention" title="クリーンヒット時、障害物が無い場合、対象を最大10M吹き飛ばす。">【飛】</span>')
            .replace(/【反動】/g, '<span class="attention" title="自分がXダメージを受ける。">【反動】</span>')
            .replace(/【溜X】/g, '<span class="attention" title="効果の発動はXターン後。">【溜X】</span>')
            .replace(/【物無】/g, '<span class="attention" title="物理攻撃が無効になる。">【物無】</span>')
            .replace(/【特無】/g, '<span class="attention" title="特殊攻撃が無効になる。">【特無】</span>')
            .replace(/【反】/g, '<span class="attention" title="ダメージを受けた時、相手に自分が受けた20％の確定ダメージを与える。">【反】</span>')
            .replace(/【棘】/g, '<span class="attention" title="ダメージを受けた時、相手に自分が受けた30％の確定ダメージを与える。">【棘】</span>')
            .replace(/【ブレイク】/g, '<span class="attention" title="その攻撃がクリーンヒット以上の時、対象のBS以外の付与効果を消滅させる。">【ブレイク】</span>')
            .replace(/【必殺】/g, '<span class="attention" title="その攻撃でHPを0以下にした時、対象のEXF判定を無視する。">【必殺】</span>')
            .replace(/【不殺】/g, '<span class="attention" title="その攻撃では対象は如何なる場合も死亡しない。">【不殺】</span>')
            .replace(/【呪殺】/g, '<span class="attention" title="呪殺属性を持つ攻撃が命中した時、対象はかかっているBSの数×100の防御無視追加ダメージを受ける。">【呪殺】</span>')
            .replace(/【毒】/g, '<span class="attention" title="毒状態の対象は毎ターンHPを100を失う。">【毒】</span>')
            .replace(/【猛毒】/g, '<span class="attention" title="猛毒状態の対象は毎ターンHPを最大値の5％失う。">【猛毒】</span>')
            .replace(/【致死毒】/g, '<span class="attention" title="致死毒状態の対象は毎ターンHPを最大値の10％失う。">【致死毒】</span>')
            .replace(/【火炎】/g, '<span class="attention" title="火炎状態の対象は毎ターンHPを100を失う。">【火炎】</span>')
            .replace(/【業炎】/g, '<span class="attention" title="業炎状態の対象は毎ターンHPを最大値の5％失う。">【業炎】</span>')
            .replace(/【炎獄】/g, '<span class="attention" title="炎獄状態の対象は毎ターンHPを最大値の10％失う。">【炎獄】</span>')
            .replace(/【凍結】/g, '<span class="attention" title="凍結状態の対象は命中回避-5の補正を受ける。">【凍結】</span>')
            .replace(/【氷結】/g, '<span class="attention" title="氷結状態の対象は命中回避-10の補正を受ける。">【氷結】</span>')
            .replace(/【氷漬】/g, '<span class="attention" title="氷漬状態の対象は命中回避-15の補正を受ける。">【氷漬】</span>')
            .replace(/【痺れ】/g, '<span class="attention" title="痺れ状態の対象は特殊抵抗-20の補正を受ける。">【痺れ】</span>')
            .replace(/【ショック】/g, '<span class="attention" title="ショック状態の対象は特殊抵抗-40の補正を受ける。">【ショック】</span>')
            .replace(/【感電】/g, '<span class="attention" title="感電状態の対象は特殊抵抗-60の補正を受ける。">【感電】</span>')
            .replace(/【乱れ】/g, '<span class="attention" title="乱れ状態の対象は防御技術-20の補正を受ける。">【乱れ】</span>')
            .replace(/【崩れ】/g, '<span class="attention" title="崩れ状態の防御技術-40の補正を受ける。">【崩れ】</span>')
            .replace(/【体勢不利】/g, '<span class="attention" title="体勢不利状態の対象は防御技術-60の補正を受ける。">【体勢不利】</span>')
            .replace(/【出血】/g, '<span class="attention" title="出血状態の対象は毎ターンHPを100失う。">【出血】</span>')
            .replace(/【流血】/g, '<span class="attention" title="流血状態の対象は毎ターンHPを200失う。">【流血】</span>')
            .replace(/【失血】/g, '<span class="attention" title="失血状態の対象は毎ターンHPを300失う。">【失血】</span>')
            .replace(/【窒息】/g, '<span class="attention" title="窒息状態の対象は毎ターンAPを50失う。">【窒息】</span>')
            .replace(/【苦鳴】/g, '<span class="attention" title="苦鳴状態の対象は毎ターンAPを100失う。">【苦鳴】</span>')
            .replace(/【懊悩】/g, '<span class="attention" title="懊悩状態の対象は毎ターンAPを150失う。">【懊悩】</span>')
            .replace(/【足止】/g, '<span class="attention" title="足止め状態の対象は反応-20の補正を受ける。">【足止】</span>')
            .replace(/【泥沼】/g, '<span class="attention" title="泥沼状態の対象は反応-40、機動力-1の補正を受ける。">【泥沼】</span>')
            .replace(/【停滞】/g, '<span class="attention" title="停滞状態の対象は反応-60、機動力-2の補正を受ける。">【停滞】</span>')
            .replace(/【不吉】/g, '<span class="attention" title="不吉状態の対象はファンブル+10の補正を受ける。">【不吉】</span>')
            .replace(/【不運】/g, '<span class="attention" title="不吉状態の対象はファンブル値が2倍になる。（不吉と累積する。その場合、元値10ならば40）">【不運】</span>')
            .replace(/【魔凶】/g, '<span class="attention" title="魔凶状態の対象はクリティカル-10の補正を受け、ファンブル値が3倍になる。（不吉、不運と累積する。その場合元値10ならば120）">【魔凶】</span>')
            .replace(/【麻痺】/g, '<span class="attention" title="麻痺状態の対象は20％の確率でそのターンの能動行動が行えなくなる。（受動防御は可能）">【麻痺】</span>')
            .replace(/【呪縛】/g, '<span class="attention" title="呪縛状態の対象は30％の確率でそのターンの能動行動が行えなくなる。（受動防御は可能）">【呪縛】</span>')
            .replace(/【石化】/g, '<span class="attention" title="石化状態の対象は40％の確率でそのターンの能動行動が行えなくなる。（受動防御は可能）">【石化】</span>')
            .replace(/【混乱】/g, '<span class="attention" title="混乱状態の対象は20％の確率で周囲全ての対象をランダムで攻撃するようになる。">【混乱】</span>')
            .replace(/【狂気】/g, '<span class="attention" title="狂気状態の対象は30％の確率で自分を通常攻撃する。この時の命中度は必ずクリーンヒットとなり、防御技術判定は行わない。">【狂気】</span>')
            .replace(/【魅了】/g, '<span class="attention" title="魅了状態の対象は40％の確率で味方をランダムで通常攻撃するようになる。">【魅了】</span>')
            .replace(/【呪い】/g, '<span class="attention" title="呪い状態の対象はバッドステータスの自然回復判定を行えなくなる。（呪い状態でバッドステータスの回復判定フェイズを迎えた場合、回数をカウントしない）">【呪い】</span>')
            .replace(/【致命】/g, '<span class="attention" title="致命状態の対象はHPの回復効果を無効化する。">【致命】</span>')
            .replace(/【封印】/g, '<span class="attention" title="封印状態の対象はアクティブスキルを使用する事が出来なくなる。">【封印】</span>')
            .replace(/【暗闇】/g, '<span class="attention" title="暗闇状態の対象は命中回避に-10の補正を受ける。">【暗闇】</span>')
            .replace(/【恍惚】/g, '<span class="attention" title="恍惚状態の対象は次に受けるダメージが二倍になり、何らかのダメージを受けた時点で恍惚状態から自然回復する。">【恍惚】</span>')
            .replace(/【怒り】/g, '<span class="attention" title="怒り状態の対象は可能な限り怒りを与えた敵に接近し、近接攻撃を試みる。敵対存在以外には効果を発揮しない。">【怒り】</span>')
        /*装備制限ほか*/
            .replace(/(【装制.{0,1}レンジ[0-9].{0,2}】)/g, '$1'.bold().fontcolor("red"))
            .replace(/(【(.+)無効】)/g, '$1'.bold().fontcolor("red"))
            .replace(/(^.{1,2}無効)/g, '$1'.bold().fontcolor("red"))
        //    .replace(/(【.{1,4}耐性】)/g, '$1'.bold().fontcolor("red"))
            .replace(/(【毒耐性】)/g, '<span class="attention" title="BS【毒】【猛毒】【致死毒】の効果を受けない。">$1</span>')
            .replace(/(【火炎耐性】)/g, '<span class="attention" title="BS【火炎】【業炎】【炎獄】の効果を受けない。">$1</span>')
            .replace(/(【電撃耐性】)/g, '<span class="attention" title="BS【痺れ】【ショック】【感電】の効果を受けない。">$1</span>')
            .replace(/(【崩し耐性】)/g, '<span class="attention" title="BS【乱れ】【崩れ】【体勢不利】の効果を受けない。">$1</span>')
            .replace(/(【凍気耐性】)/g, '<span class="attention" title="BS【凍結】【氷結】【氷漬】の効果を受けない。">$1</span>')
            .replace(/(【足止耐性】)/g, '<span class="attention" title="BS【足止】【泥沼】【停滞】の効果を受けない。">$1</span>')
            .replace(/(【不吉耐性】)/g, '<span class="attention" title="	BS【不吉】【不運】【魔凶】の効果を受けない。">$1</span>')
            .replace(/(【麻痺耐性】)/g, '<span class="attention" title="BS【麻痺】【呪縛】【石化】の効果を受けない。">$1</span>')
            .replace(/(【精神耐性】)/g, '<span class="attention" title="BS【混乱】【狂気】【魅了】の効果を受けない。">$1</span>')
            .replace(/(充填[0-9]+)/g, '<span class="attention" title="状態所有者は毎ターンX値のAPを自動回復する。">$1</span>')
            .replace(/(再生[0-9]+)/g, '<span class="attention" title="状態所有者は毎ターンX値のHPを自動回復する。">$1</span>')
            .replace(/(【溜[0-9]】)/g, '$1'.bold().fontcolor("red"))
        /*説明補足（一部）*/
            .replace(/(【水中行動】)/g, '<span class="attention" title="水中で呼吸が可能です。また水中での動作に優れます。">$1</span>')
            .replace(/(【動物疎通】)/g, '<span class="attention" title="動物と単純な会話レベルでの意思疎通が可能です。ただし相手の知性や情報精度、反応等は動物なりです。">$1</span>')
            .replace(/(【ファミリアー】)/g, '<span class="attention" title="	猫やカラス、カエルやヘビのような小動物を一体召喚・使役し、任意に五感を共有することが出来ます。">$1</span>')
            .replace(/(【媒体飛行】)/g, '<span class="attention" title="ほうきやデッキブラシ等、両手に持てる程度の道具に乗って飛行出来ます。飛行中は移動以外の行動が出来ません。攻撃を受けると確実に墜落します。">$1</span>')
            .replace(/(【超視力】)/g, '<span class="attention" title="望遠鏡並の尋常ならざる視力を持ちます。">$1</span>')
            .replace(/(【超聴力】|【超聴覚】)/g, '<span class="attention" title="僅かな物音さえ聴き逃しません。">$1</span>')
            .replace(/(【超嗅覚】)/g, '<span class="attention" title="猟犬のような嗅覚を持ちます。">$1</span>')
            .replace(/(不意打ちを受けない)/g, '$1'.bold().fontcolor("red"))
            .replace(/(所有者は飛行を行うことが出来る)/g, '$1'.bold().fontcolor("red"))
        /*装備項目向け*/
            .replace(/(【通常レンジ[0-9]】)/g, '$1'.bold().fontcolor("red"))
            .replace(/(【両手.{0,6}】)/g, '$1'.bold().fontcolor("red"))
        /*クラス・エスプリ向け*/
            .replace(/((【.+】)+の性能が強化)/g, '$1'.bold().fontcolor("red"))
            .replace(/((【.+】)+の性能を強化)/g, '$1'.bold().fontcolor("red"))
        /*ステータス上昇値*/
        /*
            .replace(/(命中\+[0-9]{1,3}|回避\+[0-9]{1,3})/g, '$1'.fontcolor("blue"))
            .replace(/(物攻\+[0-9]{1,3}|神攻\+[0-9]{1,3})/g, '$1'.fontcolor("red"))
            .replace(/(防御技術\+[0-9]{1,3}|防技\+[0-9]{1,3})/g, '$1'.fontcolor("teal"))
            .replace(/(特殊抵抗\+[0-9]{1,3}|抵抗\+[0-9]{1,3})/g, '$1'.fontcolor("teal"))
            .replace(/(クリティカル\+[0-9]{1,3}|CT\+[0-9]{1,3})/g, '$1'.fontcolor("fuchsia"))
            .replace(/(クリティカル\+[0-9]{1,3}|FB\+[0-9]{1,3})/g, '$1'.fontcolor("fuchsia"))
            */
        ;
    }


    //プレイング部分の拡張
    var playingdata = document.getElementsByClassName("playing");
    var iframe2 = document.getElementsByClassName("playing-body");
    for(var i2=0;i2<iframe2.length;i2++){

        //文字数ペナルティ判定
        playingdata[i2][1] = playingdata[i2].getElementsByTagName('th')[0].innerHTML;
        if(playingdata[i2][1].match(/[0-9]+/g) < 400 && iframe2.length <= 10){
            playingdata[i2].getElementsByTagName('th')[0].innerHTML += "※文字数ペナルティ対象".bold().fontcolor("red");
        }

        iframe2[i2].innerHTML = iframe2[i2].innerHTML
        //        .replace(RegExp('('+ss_status_active[i2]+')','g'), '$1'.bold().fontcolor("darkred"))//赤　アクティブスキル
        //        .replace(RegExp('('+ss_status_common[i2]+')','g'), '$1'.bold().fontcolor("orange"))//黄色　技能
        //        .replace(RegExp('('+ss_status_accessory[i2]+')','g'), '$1'.bold())//太字　アクセサリー
            .replace(/(防御集中)/g, '<span class="attention2" title="【副行動】そのターンが終了するまでの間、以後の判定に回避+3、防御技術+6、特殊抵抗+6の補正を得ます。">$1</span>')
            .replace(/(攻撃集中)/g, '<span class="attention2" title="【副行動】そのターンが終了するまでの間、以後の判定に命中+5、CT+1の補正を得ます。">$1</span>')
            .replace(/(マーク)/g, '<span class="attention2" title="【副行動】至近距離（レンジ0以下の正面至近）に存在する対象について、そのターン終了時まで後退以外の移動を禁止します。">$1</span>')
            .replace(/(全力攻撃)/g, '<span class="attention2" title="【主行動】全力で攻撃（通常攻撃かスキル使用による攻撃の何れか）を行います。そのターンの間、以後の判定に命中+5、CT+5、回避-10、FB+10の補正を得ます。">$1</span>')
            .replace(/(全力防御)/g, '<span class="attention2" title="【主行動】全力で防御を行います。そのターンの間、以後の判定に回避+10、防御技術+20の補正を得ます。">$1</span>'.bold().fontcolor("darkblue"))
            .replace(/(全力移動)/g, '<span class="attention2" title="【主行動】全力で移動を行います。通常の移動に加え、最大で機動力値の1/2の追加移動距離を得て移動します。（端数は切り捨て）">$1</span>')
            .replace(/(ブロック)/g, '<span class="attention2" title="【主行動】副行動『マーク』と近しい効果です。主行動の場合はブロックと呼称され、効果がターン終了時ではなく、次の自分の手番まで持続します。">$1</span>')
            .replace(/(かばう)/g, '<span class="attention2" title="【主行動】次の自身の手番が来るまでの間、レンジ0（至近）範囲内に居る対象一体への攻撃を自身が受け止めます。かばう場合、回避は成功しませんが、回避値の算出だけは行います。また防御技術判定は通常通り行う事が出来ます。">$1</span>'.bold().fontcolor("darkblue"))
            .replace(RegExp('(パンドラ|ギフト)','g'), '$1'.bold().fontcolor("darkblue"))//青　オリジナル
            .replace(RegExp('(アドリブ)','g'), '$1'.bold().fontcolor("darkgreen"))//緑　オリジナル２
        ;

    }


})();