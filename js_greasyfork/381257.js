// ==UserScript==
// @name         Shadowlog Translation
// @namespace    https://github.com/zeluqa/
// @version      1.1
// @description  Shadowlog english translation userscript
// @author       zeluqa
// @match        *://shadowlog.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381257/Shadowlog%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/381257/Shadowlog%20Translation.meta.js
// ==/UserScript==

GM_addStyle ( `
    *{
        letter-spacing: 0px;
    }
    table.form .format-column input[type=radio] + label{
        font-size: 9px;
        position:relative;
        top: -3px;
        margin-right: 5px;
    }
    table.form textarea{
         font-family: Hiragino Kaku Gothic ProN;
    }
    table.search label{
         font-size: 10px !important;
    }
    table.search input[type=checkbox i]{
         position:relative !important;
         top: 2px !important;
    }
` );


(function() {
    'use strict';

    var words_overlay = {
        '先週の対戦解析ログ':'Last Week\'s Match Data',
        '配信まとめ':'Broadcasters',
        'サイトの使い方':'Site Usage',
        'ログアウト':'Log Out',
        'マイページ':'My Page',
    };
    var words_trends = {
        //Words exclusive in https://shadowlog.com/trend/
        '全ランク帯':'All Ranks',
        '総合 対戦解析ログ':'All Class Match Data',
        '総合 デッキ別の勝率解析':'All Class Deck Archetypes Win Rate',
        '算出に使った対戦数':'Total Recorded Number of Matches',
        '環境での各リーダーの使用割合':'Class Play Rate Comparison',
        '環境での各リーダーの勝率比較':'Class Win Rate Comparison',
        '使用されたリーダー':'Class Used',
        '使用数順':'Order by Matches',
        '勝利数順':'Order by Victories',
        '勝率順':'Order by Win Rate',
        '使用数':'Matches',
        '勝利数':'Victories',
        '先攻勝率':'1st Win Rate',
        '後攻勝率':'2nd Win Rate',
        '使用デッキタイプ':'Used Deck Archetype',
        'ランクマッチ':'Ranked',
        '2Pick対戦':'Take Two',
        '対戦解析ログ':'Match Data',

        '先行で勝利した割合（先攻勝率）':'Winrate going 1st',
        '後攻で勝利した割合（後攻勝率）':'Winrate going 2nd',

        '※同じデッキ同士での勝率は50%固定になりますので、表示を省略しています。':'※Same deck matchup is fixed at 50% winrate, therefore it will not be written in the table.',
    };
    var words_mypage = {
        //Words exclusive in https://shadowlog.com/mypage/add
        '12以上':'12+',
        '新しい戦績を追加':'Add New Record',
        'マイデッキ管理':'Manage Deck',
        'プロフィール編集':'Edit Profile',
        'ターン数表示':'Show turns',
        '省略している項目を開く':'Show omitted details',
        '常に｢省略している項目｣を開いた状態にしておく':'Show omitted details by default',
        '対戦で記録しておきたい事項をメモできます。(最大200文字)':'Note about the match (Max. 200 char)',
        '戦績の追加・編集に失敗しました。':'Failed to add add/edit your entry.',
        '相手のリーダーを正しく選んで下さい。':'Please select enemy class.',
        '自分のリーダーを正しく選んで下さい。':'Please select your class.',
        '先攻・後攻を正しく選んで下さい。':'Please select play order.',

        //Words exclusive in https://shadowlog.com/mypage/
        'あなたの戦績一覧':'Match Record Summary',
        '使用リーダー解析':'My Class Analysis',
        '対戦相手の解析':'Enemy Analysis',
        'あなたの勝率推移':'My Win Rate Analysis',
        'デッキの勝率解析':'Deck Win Rate Analysis',
        '2Pickの戦績':'Take Two Records',
        '新しく戦績を記録する':'Add a new match record',
        '記録した戦績を修正する':'Edit past match record',
        'この戦績を削除する':'Delete this entry',
        '自分のリーダー':'My Class',
        '相手のリーダー':'Enemy Class',
        '自分のデッキタイプを細かく指定':'My Deck Archetype',
        '相手のデッキタイプを細かく指定':'Enemy Deck Archetype',
        'この日から..':'From',
        'この日まで..':'To',
        '絞り込む':'Search',
        '手番':'Order',
        '対戦形式':'Format',
        'アンリミテッド':'Unlimited',
        'ローテーション':'Rotation',
        'AAランク':'AA Rank',
        'Aランク':'A Rank',
        'Bランク':'B Rank',
        'C以下':'C or Lower',
        'フリー':'Private',
        '2Pick':'Take Two',
        'ターン数':'Number of Turns',
        '対戦日時':'Date of Match',
        'メモ':'Note',
        'デッキタイプ':'Deck Archetype',
        //'「十禍絶傑」に対応しました。随時新デッキタイプ追加していきます。':'Omen of the Ten',
    };
    var words_analyze = {
        '解析の期間指定':'Period Filter',
        '対戦形式の指定':'Rank Filter',
        '新パック実装以降':'Only the Latest Expansion',
        '全ての期間':'All Period',
        '期間を指定':'Date Range',
        '入力':'Enter',
        '全ランクマッチ':'All Rank',
        '使用したリーダー解析':'Used Class Comparison',
        '使用したリーダー':'Class',
        '対戦数':'Matches',
        '使用したデッキ':'Deck Archetype',
        '全勝率':'Win Rate',
        '使用割合順':'Order by Play Rate',
        '対戦数順':'Order by Matches',
        '全勝率順':'Order by Winrate',
        'ランクマッチ戦でのみの解析になります。':'ランクマッチ戦でのみの解析になります。',

        '対戦相手のリーダー解析':'Enemy Class Comparison',
        '対戦相手のリーダー':'Enemy Class',
        '遭遇確率':'Encounter Rate',
        '遭遇数':'Matches',
        '対戦相手のデッキ解析':'Enemy Deck Archetype Summary',
        '対戦相手のデッキ':'Enemy Deck Archetype',
        'あなたの勝率':'My Win Rate',
        '対戦割合':'Encounter Rate',
        '対戦割合順':'Order by Encounter Rate',
        'あなたの勝率順':'Order by My Win Rate',

        'あなたの勝率の推移':'My Win Rate Trends',
        '現在の勝率':'Current Win Rate',
        '対戦回数':'Number of Matches',
        'あなたの勝利数':'Number of Victories',

        '解析したいデッキを選ぶ':'Select Deck to Analyze',
        '手番別の勝敗解析':'Play Order',
        '先攻':'1st',
        '後攻':'2nd',
        '勝利':'Victories',
        '敗北':'Losses',
        '合計':'Total',

        '※過去30戦の勝率の推移をグラフ化しています。':'※Graph is based on your past 30 matches.',
        '※過去30戦分の勝率の推移をグラフ化しています。':'※Graph is based on your past 30 matches.',
    };
    var words_archetypes = {
        //Forest Archetypes
        'エルフ全般':'Forest in General',
        'ミッドレンジエルフ':'Midrange Forest',
        'アグロエルフ':'Aggro Forest',
        'OTKエルフ':'OTK Forest',
        'テンポエルフ':'Tempo Forest',
        'コントロールエルフ':'Control Forest',
        'ニュートラルエルフ':'Neutral Forest',
        '冥府エルフ':'Path to Purgatory Forest',
        '白狼エルフ':'White Wolf Forest',
        '薔薇エルフ':'Thorn Burst Forest',
        '白銀エルフ':'Silver Bolt Forest',
        '機械エルフ':'Machina Forest',

        //Sword Archetypes
        'ロイヤル全般':'Sword in General',
        'ミッドレンジロイヤル':'Midrange Sword',
        'フェイスロイヤル':'Face Sword',
        'アグロロイヤル':'Aggro Sword',
        'コントロールロイヤル':'Control Sword',
        'ニュートラルロイヤル':'Neutral Sword',
        '指揮官ロイヤル':'Commander Sword',
        'カエルロイヤル':'Frog Sword',
        '御旗ロイヤル':'Royal Banner Sword',
        '潜伏ロイヤル':'Ambush Sword',
        '冥府ロイヤル':'Path to Purgatory Sword',
        '援護射撃ロイヤル':'Support Cannon Sword',
        'スパルタクスロイヤル':'Spartacus Sword',
        '機械ロイヤル':'Machina Sword',

        //Dragon Archetypes
        'ドラゴン全般':'Dragon in General',
        '疾走ランプドラゴン':'Storm Ramp Dragon',
        'ランプドラゴン':'Ramp Dragon',
        'リントヴルムドラゴン':'Lindworm Dragon',
        'ジャバウォックドラゴン':'Jabberwock Dragon',
        'ミッドレンジドラゴン':'Midrange Dragon',
        '原初ドラゴン':'Prime Dragon Keeper Dragon',
        'ニュートラルドラゴン':'Neutral Dragon',
        '竜爪ドラゴン':'Dragonclaw Pendant Dragon',
        'OTKドラゴン':'OTK Dragon',
        'ディスカードドラゴン':'Discard Dragon',
        'フェイスドラゴン':'Face Dragon',
        'サタンドラゴン':'Prince of Darkness Dragon',
        '疾走ドラゴン':'Storm Dragon',
        '庭園ドラゴン':'Phoenix Roost Dragon',
        '侮蔑ドラゴン':'Disdain Dragon',
        '機械ドラゴン':'Machina Dragon',

        //Shadow Archetypes
        'ネクロマンサー全般':'Shadow in General',
        'リアニメイトネクロ':'Reanimate Shadow',
        'ミッドレンジネクロ':'Midrange Shadow',
        'アグロネクロ':'Aggro Shadow',
        '骸ネクロ':'Atomy Shadow',
        'ネフティスネクロ':'Nephthys Shadow',
        'コントロールネクロ':'Control Shadow',
        'ラストワードネクロ':'Last Words Shadow',
        'ニュートラルネクロ':'Neutral Shadow',
        'タイラントネクロ':'Tyrant Shadow',
        '冥府ネクロ':'Path to Purgatory Shadow',
        'アーカスネクロ':'Arcus Shadow',
        '機械ネクロ':'Machina Shadow',

        //Rune Archetypes
        'ウィッチ全般':'Rune in General',
        'ドロシー超越ウィッチ':'Daria DShift Rune',
        '暗黒ウィッチ':'Abyss Summoner Rune',
        'マナリアウィッチ':'Mysteria Rune',
        'ギガントキマイラウィッチ':'Giant Chimera Rune',
        '超越ウィッチ':'Dimension Shift Rune',
        '秘術ウィッチ':'Dirt Rune',
        'ドロシーウィッチ':'Daria Rune',
        'ニュートラルウィッチ':'Neutral Rune',
        'アグロウィッチ':'Aggro Rune',
        '冥府ウィッチ':'Path to Purgatory Rune',
        '魔導ウィッチ':'Hulking Giant Rune',
        '機械ウィッチ':'Machina Rune',

        //Blood Archetypes
        'ヴァンパイア全般':'Blood in General',
        'ミッドレンジヴァンプ':'Midrange Blood',
        'コントロールヴァンプ':'Control Blood',
        '蝙蝠ヴァンパイア':'Darkfeast Bat Blood',
        'ヨルムンガンドヴァンパイア':'Jormungand Blood',
        'アグロヴァンパイア':'Aggro Blood',
        '復讐ヴァンパイア':'Vengeance Blood',
        'OTKヴァンパイア':'OTK Blood',
        'ニュートラルヴァンプ':'Neutral Blood',
        '疾走ヴァンパイア':'Storm Blood',
        '冥府ヴァンパイア':'Path to Purgatory Blood',
        '機械ヴァンプ':'Machina Blood',

        //Haven Archetypes
        'ビショップ全般':'Haven in General',
        'エイラセラフビショップ':'Elana Seraph Haven',
        '天狐ビショップ':'Tenko Haven',
        '聖獅子ビショップ':'Holy Lion Haven',
        '疾走ビショップ':'Storm Haven',
        'イージスビショップ':'Aegis Haven',
        '教会ビショップ':'Summit Temple Haven',
        'ニュートラルビショップ':'Neutral Haven',
        'コントロールビショップ':'Control Haven',
        '陽光ビショップ':'Guardian Sun Haven',
        '燭台ビショップ':'Candelabra Haven',
        'セラフビショップ':'Seraph Haven',
        'エイラビショップ':'Elana Haven',
        'カウントビショップ':'Countdown Amulet Haven',
        '冥府ビショップ':'Path to Purgatory Haven',
        'レリアビショップ':'Laelia Haven',
        '聖杯ビショップ':'Tarnished Grail Haven',
        '黄金都市ビショップ':'Holy Mage Haven',
        '機械ビショップ':'Machina Haven',

        //Portal Archetype
        'ネメシス全般':'Portal in General',
        '操り人形ネメシス':'Puppet Portal',
        'ミッドレンジネメシス':'Midrange Portal',
        'クロノスネメシス':'Chronos Portal',
        'アーティファクトネメシス':'Artifact Portal',
        'アグロネメシス':'Aggro Portal',
        'コントロールネメシス':'Control Portal',
        'リーシェナネメシス':'Lishenna Portal',
        '機械ネメシス':'Machina Portal',
    };
    var words_classes = {
        //Class Names
        'エルフ':'Forest',
        'ロイヤル':'Sword',
        'ドラゴン':'Dragon',
        'ネクロマンサー':'Shadow',
        'ネクロ':'Shadow',
        'ウィッチ':'Rune',
        'ヴァンパイア':'Blood',
        'ヴァンプ':'Blood',
        'ビショップ':'Haven',
        'ネメシス':'Portal',
        '総合':'All Class',
    };
    var words_login = {
        'ログイン画面へ':'Log in',
        'ログイン画面':'Log In',
        'ログインに失敗しました。':'Log in failed.',
        '登録メールアドレスでログイン':'Log In',
        'OpenIDでログイン':'Log In Using OpenID',
        'Twitterアカウント':'Twitter Account',
        'Facebookアカウント':'Facebook Account',
        'Googleアカウント':'Google Account',
        'でログイン':'Log In',
        'パスワードを忘れてしまった..':'Forgot Password',
        '変更する':'Reset Password',
        'パスワードリマインダー':'Password Reset',
        'メールアドレスを入力...':'Email Address',
        'ログインパスワードがわからないという方へ':'Log In Password Reset',
        'ユーザー名が一致しません。もう1度正しく入力して下さい。':'Your inputted username is wrong, please try again.',
        'パスワード変更用URLを送信しました。':'URL to reset your password has been sent to your email address.',
        'パスワードの変更を行います。':'Password will be resetted.',
        '以下の項目を全て入力して下さい。':'Please fill out the form below.',
        'あなたのユーザー名':'Username',
        '新しく設定したいパスワードを入力してください。':'New Password',
        '確認のためパスワードをもう1度入力してください。':'New Password Confirmation',
        'パスワードは正しく変更されました。':'Password is successfully resetted.',
    };
    var words_register = {
        '新規アカウントを登録する':'Sign Up',
        '登録に失敗しました。':'Registration failed.',
        'は既に登録済みです。':' is already registered.',
        '登録したいユーザー名':'Username',
        '登録したいメールアドレス':'Email Address',
        'OpenIDでアカウント登録':'Sign Up Using OpenID',
        'で登録する':'Sign Up',
        'まだ戦績の記録がありません。':'You don\'t have any match recorded yet.',
    };
    var words_main = {
        '新規ユーザー登録':'New User Registration',
    }
    var words_basic = {
        //Collection of words/texts that are used in more than one phrasing
        '先':'1st',
        '後':'2nd',
        'ローテ':'Rotation',
        '勝率':'Win Rate',
        '使用割合':'Play Rate',
        '自分のデッキ':'My Deck',
        '相手のデッキ':'Enemy Deck',
        'ログイン':'Log in',
        'ユーザー登録':'Register',
        'メールアドレス':'Email Address',
        'ユーザー名':'Username',
        'パスワード':'Password',
        'ユーザー新規登録':'User Registration',
        '編集':'Edit',
        '勝敗':'Win',

        /* Alternative Translation but looks bad
        '年':'Year,',
        '月':'Month,',
        '日':'Date,',
        '時':'Hour,',
        '分':'Minute', */
    };
    var words_regexp = {
        /* Use \\* to match actual asterisks instead of using it as a wildcard
        Syntax: 'Search word' : 'Replace word',
        '/\\bD\\b/g' : '[D]',
        More complex words/text should be on top to prevent incomplete text replacement*/

        //Words for regexp text replacement method
        'ジャバウォックドラゴ*':'Jabberwock Dragon',
        'ヨルムンガンドヴァン*':'Jormungand Blood',
        'ギガントキマイラウィ*':'Giant Chimera Rune',
        'ニュートラルビショッ*':'Neutral Haven',
        'エイラセラフビショッ*':'Elana Seraph Haven',
        'コントロールビショッ*':'Control Haven',
        'アーティファクトネメ*':'Artifact Portal',

        '新しく戦績を記録する':'Add a new match record',
        '記録した戦績を修正する':'Edit past match record',
        'フリー':'Private',
        'ローテ':'Rotation',

        '対戦解析ログ':'Match Data',
        '算出に使った対戦数':'Total Recorded Number of Matches',

        'このサイトのサービスを利用するためには、簡単なユーザー登録を行って頂く必要があります。':'Please create an account to use the services provided by this site.',
        '会員登録にかかる費用は全て無料です。':'You can register an account for free.',
        '登録したメールアドレスからパスワードの変更を行うことができます。':'You can reset your registered account\'s password.',
        '以下のフォームにメールアドレスを正しく入力して下さい。':'Please enter your email address in the form below.',
        'メールアドレスへパスワード変更用のURLを記載したメールを送信しました。':'Please check your email address for the URL to reset your password.',
        'メールアドレスもわからない、上手くメールが届かないという方は':'In case of forgotten email address or mail not being sent properly,',
        'お手数ですが':'Please use the',
        'お問い合わせ':'Inqury',
        'へご連絡下さい。':'function to contact us.',
        '変更が失敗してしまう場合は':'When password resetting failed, please use the',
        'からご連絡下さい。':'function to contact us.',
        '画面左上の':'Use the',
        'ボタンを押して戦績を追加して下さい。':'button to add matches.',
        'ランクマッチ戦でのみの解析になります。':'This chart only lists ranked matches.',
        '平均勝率':'Average Win Rate',
        '対戦デッキ別の勝率解析':'Deck Matchup Win Rate',
        '解析':'Analysis',

        '年':'/',
        '月':'/',
        '日':'',
        '時':':',
        '分':'',
        '回':'',
    }

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA', 'SCRIPT'],
        attr = ['value', 'placeholder'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, j, k, len, userRegexp, key, obj;

    var words_json = {}; //Combined words list
    var words = {}; //Combined words list later to be converted to regexp

    for(key in words_overlay) words_json[key] = words_overlay[key];
    for(key in words_trends) words_json[key] = words_trends[key];
    for(key in words_mypage) words_json[key] = words_mypage[key];
    for(key in words_analyze) words_json[key] = words_analyze[key];
    for(key in words_archetypes) words_json[key] = words_archetypes[key];
    for(key in words_classes) words_json[key] = words_classes[key];
    for(key in words_login) words_json[key] = words_login[key];
    for(key in words_register) words_json[key] = words_register[key];
    for(key in words_main) words_json[key] = words_main[key];
    for(key in words_basic) words_json[key] = words_basic[key];

    for(key in words_regexp) words[key] = words_regexp[key];
    for(key in words_archetypes) words[key] = words_archetypes[key];

    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // Delete empty key/value pair

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    //Translation method using json key value by default then regexp if words is not found
    function translate() {
        //Text replacement
        texts = document.evaluate('//input|//textarea|//body//text()[normalize-space(.) != ""]', document, null, 6, null);
        for (i = 0; text = texts.snapshotItem(i); i++) {
            if ( isTagOk(text.parentNode.tagName) ) {
                if(text.tagName) { //For html attribute text translation
                    for (k = 0; k < attr.length; k++) {
                        if (text.getAttribute(attr[k])) { //Attribute exist
                            if(words_json[text.getAttribute(attr[k])]) text.setAttribute(attr[k], words_json[text.getAttribute(attr[k])]); //Translation exist in JSON word list
                            else {
                                //Regexp text replacement
                                for (j = 0, len = regexs.length; j < len; j++) {
                                    text.setAttribute(attr[k], text.getAttribute(attr[k]).replace(regexs[j], replacements[j]));
                                }
                            }
                        }
                    }
                } else { //For raw text translation
                    if(words_json[text.data]) text.data = words_json[text.data]; //Translation exist in JSON word list
                    else {
                        for (j = 0, len = regexs.length; j < len; j++) {
                            text.data = text.data.replace( regexs[j], replacements[j] ); //Regexp text replacement
                        }
                    }
                }
            }
        }
    }

    //Overlay text for 1st 2nd play order in /mypage/add
    if ((window.location.href).match("/mypage/add")){
        (document.querySelector("label[for=ord1]")).setAttribute("style", "position:relative;");
        (document.querySelector("label[for=ord2]")).setAttribute("style", "position:relative;");
        //Add 1st text overlay
        if (!((document.querySelector("label[for=ord1]").innerHTML).match("h3"))) {
            document.querySelector("label[for=ord1]").innerHTML = document.querySelector("label[for=ord1]").innerHTML + `<h3 style="position: absolute;color: #d8d8d8;left: 28%;bottom: 82%;">1st</h3>`
        }
        //Add 2nd text overlay
        if (!((document.querySelector("label[for=ord2]").innerHTML).match("h3"))) {
            document.querySelector("label[for=ord2]").innerHTML = document.querySelector("label[for=ord2]").innerHTML + `<h3 style="position: absolute;color: #d8d8d8;left: 25%;bottom: 82%;">2nd</h3>`
        }
    }

    function replaceUnicode (unicode) {
        switch(unicode) {
            case "\u30a8\u30eb\u30d5":
                return "Forest";
            case "\u30ed\u30a4\u30e4\u30eb":
                return "Sword";
            case "\u30c9\u30e9\u30b4\u30f3":
                return "Dragon";
            case "\u30cd\u30af\u30ed\u30de\u30f3\u30b5\u30fc":
                return "Shadow";
            case "\u30a6\u30a3\u30c3\u30c1":
                return "Rune";
            case "\u30f4\u30a1\u30f3\u30d1\u30a4\u30a2":
                return "Blood";
            case "\u30d3\u30b7\u30e7\u30c3\u30d7":
                return "Haven";
            case "\u30cd\u30e1\u30b7\u30b9":
                return "Portal";
        }
    }

    //Edit and recreate chart
    var canvases = document.evaluate('//canvas', document, null, 6, null);
    var canvas, html, parent;
    for (i = 0; canvas = canvases.snapshotItem(i); i++) {
        if ((canvas.getAttribute('id') == 'pie_chart') || (canvas.getAttribute('id') == 'bar_chart')) {
            //Delete current chart canvas
            parent = canvas.parentNode;
            html = canvas.parentNode.innerHTML;
            parent.removeChild(canvas);
            //Remake empty chart canvas
            parent.appendChild(document.createElement('canvas'));
            parent.innerHTML = html;

            if (canvas.getAttribute('id') == 'pie_chart'){
                var pieData = unsafeWindow.pieData;
                for (j = 0; j < pieData.length; j++){
                    obj = pieData[j];
                    for (key in obj){
                        if (key == 'label') obj[key] = replaceUnicode(obj[key]);
                    }
                }
                var ctx = document.getElementById("pie_chart").getContext("2d");
                var myPie = new unsafeWindow.Chart(ctx).Pie(pieData, {
                    animation : false,
                });
            } else if (canvas.getAttribute('id') == 'bar_chart'){
                var barChartData = unsafeWindow.barChartData;
                for (j = 0; j < barChartData.labels.length; j++){
                    barChartData.labels[j] = replaceUnicode(barChartData.labels[j]);
                }
                ctx = document.getElementById("bar_chart").getContext("2d");
                var myBar = new unsafeWindow.Chart(ctx).Bar(barChartData,{
                    scaleOverride : true,
                    scaleSteps : 7,
                    scaleStepWidth : 10,
                    scaleStartValue : 0,
                    animation : false,
                });
            }
        }
    }

    window.addEventListener("load", function(){translate()}, false);
    var form_button = document.querySelector("table.form");
    if (form_button) form_button.addEventListener('change', function(){translate()}, false); //Handles list change in /mypage/add
})();