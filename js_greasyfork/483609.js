// ==UserScript==
// @name         Twitter Spam Tweet Remover
// @namespace    http://tampermonkey.net/
// @version      2024.03.11.01
// @description  hide malicious spam tweets in X(Twitter).
// @author       A0ikun1818
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_info
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @license      Copyright A0ikun1818
// @downloadURL https://update.greasyfork.org/scripts/483609/Twitter%20Spam%20Tweet%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/483609/Twitter%20Spam%20Tweet%20Remover.meta.js
// ==/UserScript==

(function() {
    //各種変数ここから
    const maxOpenProfiles = 6;//一度に開くプロフィール
    const maxRejectLogConsole = 10;//Rejectデータを一度にコンソール出力する上限
    const alertTextMaxLength = 64;//アラートメッセージの文字数上限
    const cellInnerDivMax = 16;//一度に配置するツイート数(未使用)
    const replyContinuousOverReject = 3;//連投リプのReject
    const replyCountOverReject = 3;//間隔の空いた連続リプのReject
    const replyOrderLimit = 8;//上の間隔の上限
    const alreadyRejectCoolDown = 3600 * 1000;//初回検出から再検出のクールタイム
    const scanAlreadyRejected = true;//検出済みアカウントの再スキャン
    const mainTweetTopCoordinate = 54;//メインツイートの上座標
    const alreadyRejectNoConsole_before = "1970/1/1 09:00:00";//これより前の検知は無効
    const alreadyRejectNoConsole_after = "9024/1/1 16:00:00";//これより後の検知は無効

    const replyTextPickupRuleRule = 'div[dir="ltr"][id*="id__"]:has(a[dir="ltr"]), div[dir="auto"].r-1jeg54m';//リプライ対象の抽出
    const scanTextPickupRule = 'div[dir="auto"][id]';//".r-1s2bzr4";//スキャン対象テキストの抽出
    const redBlockButtonPickupRule = '.r-onrtq4 .redblock-btn[title*="${accountId}"]';//Blockボタンの抽出
    const promotionPickupRule = 'div[data-testid="placementTracking"]';
    const tweetTextPickupRule = 'div[data-testid="tweetText"]';

    const SEARCH_EXPLORER = 1;
    const REPLY_EXPLORER = 2;
    const LISTS_EXPLORER = 3;
    const FOLLOWER_EXPLORER = 4;
    const SETTINGS_MENU = 21;
    const RESET_EXPLORER = -99;
    const NOT_ACTIVATE = -1;
    var noRejectLog = 0;
    var noOwnerScanPass = false;
    const clientRejectReasons = ["search","reply","lists"];
    /*
     * スキャン規則のタグ:
       使い方: (付けるタグ){0} のように記述する

       OmitLog: 検知理由をコンソールに出力しない
       Enforcement: クールタイム・同一検知を無視して出力する
     */
    let RejectList = [
    ];
    let urlRejectList = [
    ];
    let wordMuteList = [
        /(Disabled)(マン|ﾏﾝ|まん|パイ|ﾊﾟｲ|ぱい|チン|ﾁﾝ|ちん)凸/, /(Disabled)(はめ|ハメ)撮り(?!(し))/,
        /(Disabled)(無修正|本気)(おな|オナ|ｵﾅ)/, /(Disabled)(おな|オナ|ｵﾅ)動画/,
        /(Disabled)(まずは|良かったら)?(プロフ(ィール)?|ぷろふ(ぃーる)?|リンク)((の)?リンク)?((を|も)?(見|み)て|から(本アカに)?(来|き)て)/,
        /(初|はじ)めての人優先でDM送/, /(Disabled)(ふぉろー|フォロー|follow)してくれたら(dm|ｄｍ)/i,
        /(人妻|[既結]婚|気になった|優しそうな感じ).*(DM|ｄｍ|(フォロ|ふぉろ)ー)(とか)?((して)?くれ(ると|たら)|[ほ欲]しい|[待ま]って|お(願|ねが)い)/i,
        /(?=.*(DM|ＤＭ|メッセ))(?=.*(フォロー|ふぉろー|follow))(?=.*(ください|お(願ねが)い|返事))/i,
        /(@[a-zA-Z0-9_]{3,15} |<br>)(フォロー|ふぉろー|follow|プロフ(ィール)?|ぷろふ)の(チェック|ちぇっく|check|確認)(を)?お(願|ねが)いします/i,
        /(@[a-zA-Z0-9_]{3,15} |<br>).*(フォロー|ふぉろー|follow).*(プロフ(ィール)?|自己紹介|どんな人)[をか](チェック|check|確認|購読)/i,
        /\#(裏|うら)(あか|アカ|垢)(女子|J[CKD]|男子と)/i,
        /フォロー通知.*(お知らせ|届き|受信)/,
        /(Disabled)(?!.*(ぷろふ|プロフ|リンク))[\u0F72\u0F80]<br>@[a-zA-Z0-9_]{3,15}/,
        /^(.*<br>){3}<br>dmm.co.jp<br>(.*<br>){2}$/,
        /[@\/]rina_gomo/, /[@\/]ru_runa_/, /[@\/]hamabehama42141/,
        /(?!.*(ayasuke|miho))[@\/](fx_[a-zA-Z0-9]{1,12}|[a-zA-Z0-9]{1,12}_fx)/,

        /返信先: .{0,20}@masa_counselor/,

        /مِ(ImpreSpam){0}/,

        /A(s)+(a)*[lr](a)+m(ImpreSpam){0}/i,

        /#เบียร์thevoice/, /\#zonauang/i,

        /seionvo/, /M1234moh/i,

        /無在庫(物販|転売)/,
        /(?=.*(交換|販売|PayPay|取引|発券))(?=.*(譲|出))(?=.*(求))/,

        /^(?!.*(yahoo\.co\.jp)).*\#Yahooニュース/i,

        /\#(PR|ad)( |<br>)/i, /r10\.to/, /amzn\.to/,

        /ミュートしたワードが含まれ/,
    ];
    let nameRejectList = [
        /((・|\*|＊)[^・\*＊]{2,20}){94,99}/, /([／\/][^／\/]{2,20}){94,99}/,
        /源( )?田( )?壮( )?亮.?(だ|で( )?す)(Enforcement){0}/,
        /(Disabled)[巨爆貧]乳(OmitLog){0}/, /(Disabled)(おな|オナ|ｵﾅ)(電|サポ|ペット)(OmitLog){0}/, /(Disabled)デカチン(OmitLog){0}/,
        /(Disabled)斎藤さん[晒募見](OmitLog){0}/, /(Disabled)裏(アカ|ｱｶ|垢)J[CKD](OmitLog){0}/i,
        /(Disabled)(おふ|オフ)パコ(OmitLog){0}/, /(Disabled)(せふ|セフ)募(OmitLog){0}/,
        /(Disabled)暇な人絡(OmitLog){0}/, /(Disabled)[\/・／\*＊]M[男女](OmitLog){0}/i,
        /M[uo]hamm[ae]d(ImpreSpam){0}/i, /(Khan | Khan)(ImpreSpam){0}/i, /(A[hj]m[ae][dr]|Abdu[lr])(ImpreSpam){0}/i, /^(Salman)(ImpreSpam){0}/,
        /(Babar | Babar)(ImpreSpam){0}/, /(Azam | Azam)(ImpreSpam){0}/, /((Ku| U)mar)(ImpreSpam){0}/i, /Chauha(ImpreSpam){0}/,
        /ch[ao]udh[au]ry(ImpreSpam){0}/i, /(^Malik | Malik)(ImpreSpam){0}/, /(^Asad| Asad)(ImpreSpam){0}/, /As(a)*l(a)+m(ImpreSpam){0}/,
        /( Fatima|Fatima )/i, / Ali$/i, /ibrahi{2,9}m/i,
        /shah/i, /noor/i, /U[zm]air/i, /Miraj/,
        /(PTI|P T I)$/,
        /^Official Live$/,
        /🌎☄️🌑/,
    ];
    let wordRejectList = [
        /line.{0,5}(nhy6i|sz885|sv6b|sn7ba|hh3a|ar8se|y4gtu|hb4rt|ccb5n|qqby888|do5nc)(ReplySpam){0}(Enforcement){0}/i, /(@.+){11,99}(Enforcement){0}/,

        /(AsalBukanPrabowo)(IDSpam){0}(Enforcement){0}/, /(?=.*(Ganjar))(?=.*(Mahfud))(IDSpam){0}(Enforcement){0}/i,

        /(FULL|Link) VIDEO 18\+(Enforcement){0}/i, /@[a-zA-Z0-9_]{3,15}.*(<br>){1,3}[a-zA-Z0-9]*\.blogspot\.com(Enforcement){0}/,

        /(稼げる.{0,4}|スマホ|固定ツイート.*)副業(紹介|招待)(Enforcement){0}/,

        /\#(([マﾏ]( )?){2})活(Enforcement){0}/,

        /简単/,

        /\u202e/, /jaga_persatuan(IDSpam){0}/, /Setengah_Hatie(IDSpam){0}/, /230ran0(IDSpam){0}(OmitLog){0}/i, /rismasafitryy(IDSpam){0}/,
        /(@X_JD10|\/X_JD10\/status\/)(IDSpam){0}(OmitLog){0}/, /RahmiginaCardi(IDSpam){0}/, /siliwanty(IDSpam){0}/, /adelia_txt(IDSpam){0}/, /itsdarin/, /DiajengDinanti/,
        /Baloch1958/, /kii_qi/, /WidywtiDela/, /MacanAsiaGagal/, /BerandalanHam/, /NyapresAbadi/, /ApriyantoLutfia/, /DalangPenculik/,
        /BeritaTangguh/, /MonalisaWlynd/, /TohhaP(Enforcement){0}/, /TribalFact/, /silmiamalina75/, /JulianneTasyaa/, /Junaidaashir23/,
        /idib_/, /itsthed0n/, /MachmudRaissa/, /Jana_Shah/, /KamiliaMunikas1(Enforcement){0}/, /shahideditz4(Enforcement){0}/,
        /Mrs_kainat_/, /lao_jiang50163/, /ShanyRananty/, /AnindyantiHendy/, /txtdrigp/, /asyl5555/, /babar_azam_056/,
        /fitz80870/, /lucky45679/, /2t3t3/,

        /(Ganjar|Dinasti|Pra[bn]owo|Dkriuk|Kambuaya|Rakyat|jurus|Doni Monardo|Ade Armando|PELANGGAR HAM)(IDSpam){0}/i, /\#zonauang(IDSpam){0}/, /\#JawabDel(IDSpam){0}/,
        /\#lapakcot(IDSpam){0}/, /\#DiscipleshipSermon(IDSpam){0}/,

        /\#gibranmendengar(IDSpam){0}/, /\#viralvideo(IDSpam){0}/, /BEM UGM Survey madinda(IDSpam){0}/, /\#JumatBerkah(IDSpam){0}/,
        /Pengen Banget(IDSpam){0}/i, /\#MenangTotal(IDSpam){0}/, /Pemilu Serentak(IDSpam){0}/,
        /ريال \d(ReplySpam){0}/, /استغفرالله(IDSpam){0}/, /أستغفر(IDSpam){0}/, /الله(IDSpam){0}/,
        /\#꽃향기_가득한_지수생일_왔단다(ReplySpam){0}/, /(\#เบียร์thevoice|\#เบียร์เดอะวอยส์|\#จดหมายเหตุปรีดี|\#แบนเบียร์เดอะวอยส์|\#ชายต๊องกับหญิงเพี้ยน)/,
        /(?=.*(babar))(?=.*(azam))/i,

        /([マチ]ン|[ﾏﾁ]ﾝ|[まち]ん|(パイ|ぱい)|尻|(アナ|あな)|満)(凸|とつ)(希望|し|送|求|<br>|ください|募|待)(R18Spam){0}(Enforcement){0}/,
        /(はめ|ハメ)撮りし.*送(R18Spam){0}(Enforcement){0}/,
        /無修正おなニー(R18Spam){0}(Enforcement){0}/, /(ハメ|はめ)撮りし(R18Spam){0}(Enforcement){0}/,
        /(オナ|おな|股間|え(っ)?ち|エ(ッ)?チ|露出)(い|ぃ)?((動画|.*姿見).*(送|欲|DM|メッセ|リプ)|でん|電|声|ペット|.{0,10}(配信|指示|頂戴|配布))(R18Spam){0}(OmitLog){0}/i, /\#巨根/,
        /([a-z]カップ).*[欲送].*(DM|メッセ|リプ)(R18Spam){0}(OmitLog){0}/i, /本気オナ(R18Spam){0}(OmitLog){0}/, /(おな|オナ)みたい人いる(R18Spam){0}(OmitLog){0}/,
        /(ぽっちゃり|裏(垢|アカ))(好き男子|(女子|J[CKD])と)(R18Spam){0}(OmitLog){0}/i,
        /\#(ぽっちゃり|裏(垢|アカ))((好き)?男子|(女子|[JD][CKD])|[中大]学生|高校生)( |<br>)(R18Spam){0}(OmitLog){0}/i,
        /(３Ｐ|3P)(し(て|たい)|できる|えち|せくす)(R18Spam){0}(OmitLog){0}/,
        /\#ちん(こ|ちん)<br>(R18Spam){0}/, /大量射精<br>(R18Spam){0}/, /\#射精(R18Spam){0}/, /<br>(\#)?おじさんすき<br>(R18Spam){0}(OmitLog){0}/, /<br>(\#)?((通話|共依存)相手|M女|彼女|セフ|舐め.*|スカトロ|依存先|会える人|見せ合い)募集(中)?<br>(R18Spam){0}(OmitLog){0}/, /\#やりもく/,
        /\#動画販売(R18Spam){0}/, /(おふ|オフ)[ぱパ○][こコ](R18Spam){0}(OmitLog){0}/,
        /<br>(\#)?チクニー<br>(R18Spam){0}(OmitLog){0}/, /\#見せ合い(R18Spam){0}/, /\#通話募集中/, /ヌ キヌ キ(R18Spam){0}(OmitLog){0}/, /凸希望(R18Spam){0}(OmitLog){0}/, /見せ合いし(R18Spam){0}/,
        /くぱ(ぁ|くぱ)[観欲し動](R18Spam){0}(OmitLog){0}/,
        /(おかず|オカズ)凸(R18Spam){0}/,/\#レズビアンと繋がりたい/, /\#暇な人話そ/, /<br>(\#)?熟女<br>/, /\#お尻ペンペン(R18Spam){0}(OmitLog){0}/, /\#筆おろし/, /\#エロイプ/,
        /\#(踏み)活/, /(([マﾏ]( )?){2})活(R18Spam){0}/, /私の (えち|Hな).* プレゼント(R18Spam){0}/, /\#(調教待|DM調教)/, /えロ動画/, /生ハ　メ(R18Spam){0}(OmitLog){0}/,
        /(おナニー|おっパイ)(R18Spam){0}(OmitLog){0}/, /\#粗ちん(R18Spam){0}(OmitLog){0}/, /裏アカ女子<br>1人えち(R18Spam){0}(OmitLog){0}/,
        /<br>(\#)?p活.{0,4}<br>(R18Spam){0}/, /<br>セックスフレンド<br>(R18Spam){0}/, /<br>\#ぶっかけ<br>(R18Spam){0}/,
        /<br>\#斎藤さん[見晒](R18Spam){0}/,

        /卓球部時代、ボールあそこにいれて練習してた(R18Spam){0}(OmitLog){0}/,
        /<br>＆フォローすぐ送る<br>(R18Spam){0}/,
        /<br>.{1,2}日は、.{1,4}色のワンピースを着て、可愛くして、.{1,7}へ繰り出します！<br>(R18Spam){0}/,
        /<br>1人でしてる時の動画見たい人〜？<br>(R18Spam){0}(Enforcement){0}/,
        /<br>明日は、友だちと映画鑑賞が待ちきれないです どんな映画が観れるんだろう？楽しみです。<br>(R18Spam){0}/,
        /<br>あー、心躍るするなぁ。好きな人とのお出かけ、ドキドキしちゃうけど。でも、最後には最高の思い出を過ごせるといいな。<br>/,
        /<br>もしもし、あなたには、ツムツムがオススメですよ！あなたの暇つぶしに最適ですよ！<br>/,
        /<br>昨日の講義は非常にも面白くて学問的になりました！<br>/,
        /<br>私、はながちっちゃいから、花粉症の時でもmasukuしなくていいの！！かちくみ女子だわ！<br>/,

        /^(Disabled).{1,12}(𓂃𓈒໒꒱𓏸|𓂃 𓈒𓂂𓏸|ᑦᑋᵃᵑ|໒꒱· ﾟ|⊹⁑|⸝⸝- ̫ -⸝⸝|\(⑉•ᴗ•⑉\)|➸♥︎⌇|𓂃𓂂𓏸ꕤ\*|𓈒𓂂𓏸♡|࿐⋆\*|୨୧┈|\( ..›ᴗ‹..\)|☁︎︎\*\.).*<br>@([a-zA-Z]{2,15}[0-9]{1,15}|[a-zA-Z0-9]{15})<br>(R18Spam){0}(OmitLog){0}/,
        /[\u0F72\u0F80]<br>@[a-zA-Z0-9_]{3,15}.*(ぷろふ|プロフ|リンク)(R18Spam){0}(OmitLog){0}/,
        /(フォロ|リプ|リツ|R T|ラブ).{0,10}(( で|た人に)(動画|どうが)送ります|で(動画|どうが)送るね)(R18Spam){0}/,
        /(フォロー|ふぉろー)してくれたらDM(R18Spam){0}(OmitLog){0}/i, /(フォロリツ|RTいいね|初めての人優先).*DM送(R18Spam){0}(OmitLog){0}/,
        /(人妻|[既結]婚|気になった|優しそうな感じ).*(DM|ｄｍ|(フォロ|ふぉろ)ー)(とか)?((して)?くれ(ると|たら)|[ほ欲]しい|[待ま]って|お(願|ねが)い)(R18Spam){0}/i,
        /(@[a-zA-Z0-9_]{3,15} |<br>)(フォロー|ふぉろー|follow)の(チェック|ちぇっく|check|確認)(を)?お(願|ねが)いします/i,
        /(@[a-zA-Z0-9_]{3,15} |<br>).*(フォロー|ふぉろー|follow).*(プロフ(ィール)?|自己紹介|どんな人)[をか](チェック|check|確認|購読)/i,
        /フォロー通知.*(お知らせ|届き|受信)/,

        /(?=.*(女子[高大]生))(?=.*(((.{1,6}(／|・|\*|[^a-zA-Z]\/|＊)){3,99})|j[ckd](裏|うら|ウラ)|[熟痴]女|首輪|イメプ))(R18Spam){0}/i,
        /@[a-zA-Z]{2,10}[0-9]{4,14}<br>.*<br><br>(まずは)?(プロフ(ィール)?|ぷろふ(ぃーる)?|リンク)((の)?リンク)?((を|も)?(見|み)て|から(本アカに)?(来|き)て)[ね〜]?.{0,6}<br>(R18Spam){0}/,
        /<br><br>(まずは)?(プロフ(ィール)?|ぷろふ(ぃーる)?|リンク)((の)?リンク)?((を|も)?(見|み)て|から(本アカに)?(来|き)て)[ね〜]?.{0,6}<br>(R18Spam){0}/,
        /<br>(返信先|.*さん).*((はじ|初)めまして|こんにちわ|こんばんわ).*<br><br>([良よ]かったら)?(プロフ(ィール)?|ぷろふ(ぃーる)?|リンク)((の)?リンク)?((を|も)?(見|み)て|から(本アカに)?(来|き)て)[ね〜]?.{0,6}<br>(R18Spam){0}/,
        /(DM|メッセージ)で(やり取りしたいので、|コンタクトをとりたいので、|連絡(し|を取り)たいので、)(フォロー|フォロバ|follow|follow back)(おねがい|お願い|を返して|を?お待ち)(R18Spam){0}/,

        /(返信先:).*((?<!(\.))fanlink\.to|shortx\.cc|helpgive\.to|podlink\.to|newsplus\.tokyo|eventlink\.to)(AffiliateSpam){0}/,
        /(返信先:).*(seikeidouga)\.blog\.jp(AffiliateSpam){0}/,
        /(返信先:).*(healthyhubv\.com|twi\.svsvves\.com)(AffiliateSpam){0}/,
        /jp\.(abc-talks|eoomiss|adorable-pet|days-well|superbaby0127|cookicway)\.com(AffiliateSpam){0}/, /comedydouga\.com(AffiliateSpam){0}/,
        /(luxury-dream|rich-cash)\.site(AffiliateSpam){0}/, /okanekubari\.fun(AffiliateSpam){0}/, /webull-jp\.com/, /jp\..*\.com\/pic_(AffiliateSpam){0}/,
        /heylink\.me/, /t\.me\//, /shorturl\.at/, /shopee\.co\.id/, /s\.click\.aliexpress\.com/, /add-link\.blue/,
        /xr2\.me\//, /lllpg\.com/, /fiverr\.com/, /likehealth21\.com/, /clippingpathsolve\.com/, /knnwork\.com/, /wa\.me\/[\+\d]/,
        /@(9_sibaran|8_orikose|k_anrak|k_osksuw)\d{1,4}(AffiliateSpam){0}/,
        /(news.{0,10}\.infobig\.biz|news-.\.cashback5review\.com|news-.{1,10}\.kekkonkatsu\.info)(AffiliateSpam){0}/,
        /topictics\.com\/bribery-and-quid-pro-quo/, /sekizanzenin\.com/, /special\.dmm\.com/,

        /golink\.icu/,

        /(\d円.*|登録|紹介|報酬|貰).*lite\.tiktok\.com(InviteSpam){0}/,

        /youtu.be\/QjLxZSbh0bk/, /(垢( )?|口座)(買取|販売)/,

        /みんなの銀行/, /\#闇バイト/, /日払い/, /(?=.*fx)(?=.*自動売買)(InvestSpam){0}(Enforcement){0}/i, /fx.*(稼げ)(InvestSpam){0}/i, /((ドル|ポンド)円|GOLD).*( |<br>)(ショート|ロング|先出し|利確)(InvestSpam){0}/,
        /メルカリ.*招.?待コード/, /バイナリーオプション/, /\#現金配布/, /(月|年)\d万稼/, /(?=.*EA)(?=.*無料)(?=.*(配布|(もら|貰)い))/, /ビットコインアドレス/,
        /副業(招待|紹介)/, /PayPay,{0,10}配布/, /free money trick/, /個人(間)?融資/, /(?=.*(月\d{3,4}万))(?=.*((稼|かせ)[ぎぐげい]|(入|はい)[金るっ]|LINE|プロフ|固(定)?ツイ|参考に))/,
        /zyagaa123/, /masa_counselor(Enforcement){0}/, /A3GeIyVJx05uJ5C(OmitLog){0}/i, /@FxOta_777/, /@FXrevengers/,
        /\$STREAK/, /\$Portal/, /\#DOXcoin<br><br>/, /(\/sakurasakubass\/status|@sakurasakubass)/,
        /(\/fx_positive\/status|@fx_positive)(FXSpam){0}/, /\$OOFP/, /\$HubX/, /you can earn.*this number(InvestSpam){0}/i,
        /@ayasuke_fx(Enforcement){0}/i, /@BTCxFx /i, /Reducecryptotax/i, /@peace_5151/i, /@yamato1660808/, /@ChartFreedom/,
        /@miho_fx_55/, /@toshi040100/, /@_ART001/i, /@toshi__rou(Enforcement){0}/, /(?=.*(@ton_blockchain))(?=.*(\$TON))/,
        /(?=.*(@KAVA_CHAIN))(?=.*(\$KAVA))/,
        /固定ツイートに無料で貰える/,

        /(?=.*EA)(?=.*(自動売買|収支|ドル円))(Enforcement){0}/,

        /オン(ライン)?カジ(ノ)?.*is\.gd/, /(?=.*現金)(?=.*PayPay)(?=.*(配布|入金|振り?込み?|ゲームトレード|プレゼント))/i,
        /(?=.*現金)(?=.*配[布りっ])(?=.*万円)/,

        /(money|k|t)-(present|gotousen)\.(com|site|fun|spacce)/, /tw-regalo\.(site|space)/, /rich-cash\.fun/, /[tm]ake-money-happy\.(fun|space|online)/,

        /forqit\.jp\/(AVSpam){0}/, /okane\.click<br>(AVSpam){0}(OmitLog){0}/,
        /(スレンダー|SEX|前戯|セックス|福袋|中出し|チンチン|義(母|姉|妹)|(人|の)妻|オナニー|巨乳|騎乗位|【(VR|4K|8K)).*(dmm\.co\.jp)(AVSpam){0}(Enforcement){0}/i,
        /^(.*<br>){3}<br>dmm.co.jp<br>(.*<br>){2}<br>(AVSpam){0}$/, /今日まで<br><br>dmm\.co\.jp/,
        /^(\#)?(マ[●〇]コ|チ[●〇][コポ])<br>/, /(アナル)プレイ/,
        /<br>(\#)?顔射<br>/, /\#潮吹き/, /強制フェラ/,
        /こんなに.{1,20}娘多いサイト.*(tinyurl\.com|is\.gd)/,
        /(.*円){2}<br>dmm.co.jp<br>/,

        /@(KyleLiu01093835|Ali92379522|YkCeUKEfC74rW4N|erohonya00|nijigengasyuki){99}/,
        /ツイートの\d{1,3}円漫画(.{1,8}抜|ヤバ|やば|で.*抜い|あれ|最高|かなり|凄|.*エロ).*@[0-9a-zA-Z_]{3,15}(Enforcement){0}/,
        /固定ツイート(で|の[動漫]画)?((さっき|めっちゃ)抜(いた|ける)|(やば|ヤバ)過ぎ)(Enforcement){0}/,

        /@[a-zA-Z0-9_]{3,15}(<br>){1,2}dlsite\.com<br>/, /@[a-zA-Z0-9_]{3,15}(<br>){1,2}dmm\.co\.jp<br>/,

        /I( )?N ( )?B( )?I( )?O/i, /bio profile/i,

        /heutigesleben\.de/, /神は温度を/,
        /#ดีเจโก/,/#الصلاة/, /[\u202E]/, /اللهم(ReplySpam){0}/, /إختيار(ReplySpam){0}/, /محد يقول خذ حساب هديه (ReplySpam){0}/,
        /إله/, /रामभक्त/,
        /ا(ImpreSpam){0}/, /^(?!.*([\u0648][\)\(]|[\)\(][\u0648])).*و(ImpreSpam){0}/, /ر(ImpreSpam){0}/, /ب(ImpreSpam){0}/, /ف(ImpreSpam){0}/, /ک(ImpreSpam){0}/,
        /س(IDSpam){0}/, /ح(ImpreSpam){0}/, /مِ(ImpreSpam){0}/, /ت(ImpreSpam){0}/, /ث(ImpreSpam){0}/, /ج(ImpreSpam){0}/,
        /خ(ImpreSpam){0}/, /د(ImpreSpam){0}/, /ذ(ImpreSpam){0}/,


        /ワクチン(.*薬害|打つな)/, /集団ストーカー/, /akagamisp/, /ameblo.jp\/.*himitunotakarabako/, /\#人工(地震|津波)/,
        /skhimitsu_com00(Enforcement){0}/, /\#秘密のたからばこ(Enforcement){0}/,

        /IsraeliTerrorists/,

        /\#.+手押し/, /吸って.+(よ|良)さ/, /(.{0,5}手押し){3,99}/, /<br>.{0,4}手押し/, /( |　).{1,2}手押し/, /@suzukake/,

        /打ち子/, /新台入替/, /^PS_[a-z]{4,9}_777<br>/,

        /<br>.{0,25}(生(中継|放送)|無料登録|ライブ|配信|Click|Live|Watch|>>|➡|⬇|👉|𝙇).{0,20}(cutt\.ly|tinyurl\.com|bit\.ly).*<br>/,
        /cutt\.ly\/(UwK25wkC|wwK3ampL)/,
        /bit\.ly\/(.*-live-jp|stardom-award|.*-fes|3S4krvU|4b5VOr4|3u6Fiqb|4260k4S|4b3DVJC|3S4ae2u|RUN_RUN_RAMPAGE)/,
        /tinyurl\.com\/(.*-24-live)/,
        /t\.afi-b\.com\/visit\.php\?a=(W6|31)/,

        /hottest Twitter Trends(TrendSpam){0}/,
        /流行りのワード(TrendSpam){0}/, /とれんド(TrendSpam){0}/, /Trending (with|in)(TrendSpam){0}/, /トレンド: (TrendSpam){0}/, /話題トレンド(TrendSpam){0}/,
        /<br>tag(s)?(:)?<br>/i, /(」「.{0,12}){7,50}/,

        /Lampung__01/, /NayDonuts/, /Murahs3nyum(Enforcement){0}/, /Ghurem2/, /HappenedInWorld/, /Qazishoaib15/, /NadarRabiya/,
        /kasmasuci(Enforcement){0}/,　/Amanda_Lars(Enforcement){0}/, /priamisterius00/, /LolaCorralesP/, /Ililil1_/, /HieuTraderPro/, /jagaberita_id(OmitLog){0}/, /Heba_Almajd/,
        /____Ranoo/, /SalaamIndonesia(Enforcement){0}/, /aminalsultan/, /DonPablo_1945/, /CintaikarenaNya/, /\/Belok_dong\/status\//,
        /\/theo12_ini\/status\//, /\/sy2ri8\/status\//, /\/ZulfiNadifa\/status\//, /\/AgustinaPrdpta\/status\//, /indmaju1945/, /PrivList/,
        /[@\/]hakurou2023go2/, /GuleMehtab786/, /NextMicrobe/, /im_ANAS1/, /okane\.click/, /shnanalsaadi8/, /nwaf_rq/,
        /AestheticTooba0/, /(follow36404130|followb33007080)(Enforcement){0}/, /h76199/, /suzuka_kantei/, /clover_mercari/,
        /lovecat2003/, /Golden_Era_1/, /cricket_adda_/,

        /2024年に向けて花屋スタッフを急募しております。 高い給与とリラックスした楽しい職場環境を望みますか\?(ChineseSpam){0}(Preserve){0}/,

        /借楼主宝地发个广告(ChineseSpam){0}/, /\#办证件(ChineseSpam){0}/, /都买号别去送死(ChineseSpam){0}/, /专.男性调理(ChineseSpam){0}/,
        /确定下单加微信(ChineseSpam){0}/, /(?=\#香烟)(?=.*\#免税)(?=.*\#问价不亏)(ChineseSpam){0}/,

        /モンスト垢買取＆購入は《しすたー》まで/,

        /<br><br>引用<br>.*定位置1\/2/,


        /<br>ブロックしているアカウントによるポストです。<br>/,

        /(?=.*(死刑確定))(?=.*(麻布十番駅))(?=.*(鈴木おさむ))/,
        /(?=.*(容体悪化))(?=.*(ハイタニさん))(?=.*(単勝万馬券))/,
        /(?=.*(危篤状態))(?=.*(フォッサマグナ))/,
        /(?=.*(岸田派の不記載3059万円))(?=.*(予想外の臨時収入))(?=.*(F1ゲーム))/,
        /(?=.*(起きろだよ))(?=.*(影山ヒロノブ))(?=.*(あさイチ))/,
        /(?=.*(ピン子さん))(?=.*(人身事故))(?=.*(ガソリン))/,
        /(?=.*(不要不急の外出))(?=.*(佐藤詩織))/,
        /(?=.*((BW|ダイパ)リメイク))(?=.*(だれかtoなかい|岩田息子|タマホーム))(?=.*(光る君へ|ノンフィクション|退去警告))/,
        /(?=.*(ローソン(盛りすぎ|上場廃止)))(?=.*(ファミマのおむすび|日常的パワハラ|雪見だいふく))(?=.*(じゃがりこ新作|静岡県民|和牛水田|小判8000枚))/,
        /(?=.*(拉致被害者全員奪還))(?=.*(市長の娘))(?=.*(必修落ち))/,
        /(?=.*(4660万))(?=.*(苗字1位))(?=.*(人人人人))/,
    ];
    //        /(?=.*())(?=.*())/,
    let wordRejectListEachLines = [
        /^\|\| /,
        /^おじさんすき(R18Spam){0}$/,
        /\#羽田空港( |<br>)\#飛行機炎上( |<br>)\#日本航空( |<br>)\#管制ミス/,
    ];
    let wordRejectListByReply = [
        /((?<!(\.))fanlink\.to|shortx\.cc|helpgive\.to|podlink\.to|newsplus\.tokyo|eventlink\.to)/,
        /(seikeidouga)\.blog\.jp/,
        /(healthyhubv\.com|twi\.svsvves\.com)/,

        /\#จดหมายปรีดี(ReplySpam){0}/,

        /ツイートの\d{1,3}円漫画(.{1,8}抜|ヤバ|やば|で.*抜い|あれ|最高|かなり|凄|.*エロ)/,

        /^([良よ]かったら)?(プロフ(ィール)?|ぷろふ(ぃーる)?|リンク)((の)?リンク)?((を|も)?(見|み)て|から(本アカに)?(来|き)て)[ね〜]?.{0,2}(R18Spam){0}$/,

        /今日の素敵な記事を書きました/
    ];
    //各種変数ここまで

    'use strict';
    var css = "";
    for(var i=0;i<RejectList.length;i++){
        if(i>=1) css += ", ";
        css += "div[data-testid=\"cellInnerDiv\"]:has(.redblock-btn[title*=\""+RejectList[i]+"\"])";
    }
    if(RejectList.length>0) css += "{display:none !important;}\n";

    for(i=0;i<urlRejectList.length;i++){
        if(i>=1) css += ", ";
        css += "div[data-testid=\"cellInnerDiv\"]:has(a[href*=\""+urlRejectList[i]+"\"]):not(.tweet-forcedisplay)";
    }
    if(urlRejectList.length>0) css += "{display:none !important;}\n";

    //リジェクト時の非表示設定CSS
    css += "div[data-testid=\"cellInnerDiv\"].tweet-muted:not(.tweet-forcedisplay){"+
           "    display:none !important;"+
           "}\n";

    css += "div[data-testid=\"cellInnerDiv\"].tweet-rejected:not(.tweet-forcedisplay){"+
           "    display:none !important;"+
           "}\n";

    //リジェクトボタンのCSS設定
    css += ".tstr-button{"+
           "    display: inline;"+
           "    border-width: 1px; border-style: solid;"+
           "    border-color: white; border-image: initial;"+
           "    border-radius: 3px;"+
           "    cursor:pointer;"+
           "    height: 24px;"+
           "}\n"+
           ".tstr-button:not(.already-rejected):hover{"+
           "    text-decoration: underline;"+
           "}\n";
    css += ".tstr-button.already-rejected{"+
           "    cursor:not-allowed;"+
           "    opacity: 0.7;"+
           "}\n";
    css += ".reject-button{"+
           "    background-color: #005000;"+
           "}\n";
    css += ".unreject-button{"+
           "    background-color: #505000;"+
           "}\n";
    css += ".rescan-button{"+
           "    background-color: #000050;"+
           "}\n";
    css += ".redblock-btn-hidden .redblock-btn{"+
           "    display: none;"+
           "}\n";
    css += ".redblock-btn[title*=\"TSTR-Except\"]{"+
           "    display: none;"+
           "}\n";

    //おまけ
/*     css += 'body:has(aside[aria-label="関連性の高いアカウント"] div[role="button"]:first-child div[data-testid*="-unblock"]) .r-9aw3ui.r-1s2bzr4{\n'+
           '    display: none;\n'+
           '}\n'+
           'body:has(div[data-testid*="-unblock"]) .r-9aw3ui.r-1s2bzr4{\n'+
           '    display: none;\n'+
           '}\n'+
           'div[data-testid="cellInnerDiv"]:has(.redblock-btn[title*="TSTR-Reject"]) .r-9aw3ui.r-1s2bzr4{\n'+
           '    display: none;\n'+
           '}\n'
 */
    css = css.replace(/\{/g, "{\n");
    css = css.replace(/;/g, ";\n");

    //console.log(css);

    let style = document.createElement('style');
    style.id = "TSTR";
    style.type = "text/css";
    style.innerHTML += css;
    document.body.after(style);

    //ngUsersのリストには先頭に@をつける
    var ngUsers = new Set();
    var ngUsersRemoved = new Set();
    var okUsers = new Set();
    //GM_deleteValue("ngUsers");
    //GM_deleteValue("ngUsersRemoved");
    var ngUsersAlready = new Set();//再検出 こちらは値を維持しない
    var ngUsersBye = new Set();//処理済み 値を維持しない
    var ngReasons = {};//NG理由 キーは@を含む {URL, 理由, 初回日時, 初回ver, 最新日時, 最新ver}
    var replyFirstOnWindow = {};
    var rejectTweetId = {};
    const ngReasonsSlice = '\t';

    var id = "";
    var str = "";
    var elem = [];
    var ngLoadedCount = 0, okLoadedCount = 0;
    var rejectedCount = 0, acceptedCount = 0;

    //書き出しファイルには@をつけない
    //メニューから手入力するときはつけてもつけなくてもよい-
    var ngUsersList = GM_getValue("ngUsers", []);
    var ngUsersRemovedList = GM_getValue("ngUsersRemoved", []);
    var okUsersList = GM_getValue("okUsers", []);
    for(str of ngUsersRemovedList){
        elem = str.split(ngReasonsSlice);
        id = elem[0];
        if(elem[1] != null){
            ngReasons[id] = elem.slice(1);
        }
        ngUsersRemoved.add(id);
        ngLoadedCount++;
    }
    for(str of ngUsersList){
        elem = str.split(ngReasonsSlice);
        id = elem[0];
        if(elem[1] != null){
            ngReasons[id] = elem.slice(1);
        }
        if(!ngUsersRemoved.has(id)){
            ngUsersRemoved.add(id);
            ngLoadedCount++;
        }else{
            ngUsersRemoved.delete(id);
            ngUsersRemoved.add(id);
        }
    }
    for(let key in ngReasons){
        let reason = ngReasons[key];
        if(reason[0] != null){
            let tweetId = getTweetIdByURL(reason[0]);
            if(tweetId != null){
                rejectTweetId[tweetId] = key;
            }
        }
        if(reason[6] != null){
            let tweetId = getTweetIdByURL(reason[6]);
            if(tweetId != null){
                rejectTweetId[tweetId] = key;
            }
        }
    }
    //console.log(okUsersList);
    for(str of okUsersList){
        elem = str.split(ngReasonsSlice);
        id = elem[0];
        okUsers.add(id);
        if(ngUsersRemoved.has(id) || ngUsers.has(id)){
            rejectedCount--;
            ngUsersRemoved.delete(id);
            ngUsers.delete(id);
        }
        okLoadedCount++;
    }

    rejectedCount = ngLoadedCount;
    acceptedCount = okLoadedCount;
    //console.log(elem);

        // Your code here...
    var nowVersion = GM_info.script.version;
    var pageChangeURLs = "";
    var prepreURLs = "";
    var preURLs = "";
    var preActivate = 0;
    var replyCountByAuthor = {};
    var replyFirstOnPage = {};
    var replyAlready = new Set();
    var replyOrder = new Set();
    var preAuthor = "@---";
    var preAuthorCount = 0;
    var freezeCount = 0;
    var preScanTweetCount = 0;
    var afterTweetOwner = false;
    var beforeTweetOwners = new Set();
    var preFocused = false;
    var mainTweetOnReply = null;
    console.log("Twitter Spam Tweet Remover, ver" + nowVersion + ": " + ngLoadedCount + " rejected, " + okLoadedCount + " accpeted data loaded.");

    //タイマー処理のメイン部分
    const timeId = setInterval(() => {
        var activate = NOT_ACTIVATE;
        var paths = location.pathname.split('/');
        var redBlockEnable = (document.querySelector('.redblock-btn') != null ? true: false);
        while(paths.length < 5) paths.push('');
        if(paths[1]=="search"||paths[1]=="hashtag") activate = SEARCH_EXPLORER;
        else if(paths[2]=="status") activate = REPLY_EXPLORER;
        else if(paths[1]=="i"&&(false || (paths[2]=="lists" && paths[3].toString().search(/^\d*$/) !== -1))) activate = LISTS_EXPLORER;
        else if(paths[1]=="i"&&(paths[2]=="safety")) activate = SETTINGS_MENU;
        else if(paths[1]=="home"||paths[1]=="explore") activate = RESET_EXPLORER;
        else if(paths[2]=="") activate = RESET_EXPLORER;
        else if(paths[2].toString().search(/follow/) !== -1) activate = FOLLOWER_EXPLORER;
        else if(paths[1]=="settings"){
            if(paths[2]=="search"){
                activate = SETTINGS_MENU;
            }else{
                activate = NOT_ACTIVATE;
            }
        }

        var nowURLs = moldingURL(new URL(location.href));
        if(preURLs != nowURLs){
            //ページが変わったら
            for(let key in replyCountByAuthor){
                if (replyCountByAuthor.hasOwnProperty(key)) {
                    delete replyCountByAuthor[key];
                }
            }
            //replyCountByAuthor = {};
            for(let key in replyFirstOnPage){
                if (replyFirstOnPage.hasOwnProperty(key)) {
                    delete replyFirstOnPage[key];
                }
            }
            //replyFirstOnPage = {};
            replyAlready.clear();
            replyOrder.clear();
            preAuthor = '@---';
            preAuthorCount = 0;
            freezeCount = 0;
            afterTweetOwner = false;
            beforeTweetOwners.clear();
            mainTweetOnReply = null;

            let ng = false;
            //console.log(activate);
            if(nowURLs == pageChangeURLs){
                ng = true;
            }else if(activate==REPLY_EXPLORER && (!false || preActivate != REPLY_EXPLORER)){
                ng = true;
            }else if(activate==SEARCH_EXPLORER && preActivate == REPLY_EXPLORER && nowURLs == prepreURLs){
                ng = true;
            }else if(activate==RESET_EXPLORER && preActivate == RESET_EXPLORER){
                ng = true;
            }else if(activate==FOLLOWER_EXPLORER && preActivate == FOLLOWER_EXPLORER){
                ng = true;
            }else if(activate==SETTINGS_MENU){
                ng = true;
            }else if(activate==SEARCH_EXPLORER && preActivate==SEARCH_EXPLORER){
                let preURLmatch = preURLs.toString().match(/^.*(?=( |　))/);
                let preURLstr = preURLs.toString();
                if(preURLmatch != null){
                    preURLstr = preURLmatch[0].toString();
                }
                preURLstr = preURLstr.replace(/\?/g, '\\?');

                let nowURLmatch = nowURLs.toString().match(/^.*(?=( |　))/);
                let nowURLstr = nowURLs.toString();
                if(nowURLmatch != null){
                    nowURLstr = nowURLmatch[0].toString();
                }
                //console.log(preURLstr + "\n" + nowURLstr);
                //console.log(nowURLs.toString().search(new RegExp(preURLstr)));
                if(nowURLstr.toString().search(new RegExp(preURLstr)) !== -1){
                    ng = true;
                }
            }else if(activate==NOT_ACTIVATE){
                ng = true;
            }
            //console.log(activate + " " + preActivate);
            if(!ng){
                //新規NGログのリセット
                removeAllRejectCSS();
                var victim = [];
                for(const id of ngUsers){
                    victim.push(id);
                }
                for(const id of victim){
                    if(!ngUsersAlready.has(id)) ngUsers.delete(id);
                    ngUsersRemoved.add(id);
                }

                if(preURLs!=""){
                    try{
                        console.log("page change: \'" + decodeURI(nowURLs).toString().replace(/\n/g, '<br>') + "\'");
                    }catch(e){
                        console.log("page change: \'" + nowURLs.toString().replace(/\n/g, '<br>') + "\'");
                    }
                }
                pageChangeURLs = nowURLs;
                //console.log(paths);
            }else{
            }
            prepreURLs = preURLs;
            preURLs = nowURLs;
            preActivate = activate;
        }

        if(activate<=0){
            var rejectButtons = document.querySelectorAll('button.tstr-button');
            for(let rBtn of rejectButtons){
                rBtn.remove();
            }
            return;
        }

        var tweetOwner = null;
        if(activate==REPLY_EXPLORER){
            tweetOwner = "@" + paths[1];
        }
        if(tweetOwner == null){
            afterTweetOwner = true;
        }
        afterTweetOwner = true;//この機能は使わない

        if(activate==REPLY_EXPLORER){
            if(tweetOwner != null) beforeTweetOwners.add(tweetOwner);
            let tweetOwnersParent = document.querySelector('aside[role="complementary"]');
            if(tweetOwnersParent != null){
                let tweetOwners = tweetOwnersParent.querySelectorAll('div.r-1wvb978');
                for(let ownerParts of tweetOwners){
                    beforeTweetOwners.add(ownerParts.innerText);
                }
            }
        }

/*         if(activate==1){
            //var acceptListsSize = document.querySelectorAll('div[data-testid=\"cellInnerDiv\"].tweet-accepted').length;
            var rejectListsSize = document.querySelectorAll('div[data-testid=\"cellInnerDiv\"].tweet-rejected:not(.tweet-forcedisplay)').length;
            while(rejectListsSize >= cellInnerDivMax){
                //多すぎるのでRejectを削る
                let rejectTarget = document.querySelector('div[data-testid=\"cellInnerDiv\"].tweet-rejected:not(.tweet-forcedisplay)');
                if(rejectTarget != null){
                    rejectTarget.remove();
                    rejectListsSize--;
                }else{
                    break;
                }
            }
        }
 */

        var tweetLists = null;
        if(activate==REPLY_EXPLORER){
            let tweetGetRule = 'div[aria-label="タイムライン: 会話"] div[data-testid=\"cellInnerDiv\"]:not(.tweet-accepted):not(.tweet-rejected):not(.tweet-muted):not(.tweet-ignore)';
            tweetGetRule += ', div[aria-label="タイムライン: 非表示の返信"] div[data-testid=\"cellInnerDiv\"]:not(.tweet-accepted):not(.tweet-rejected):not(.tweet-muted):not(.tweet-ignore)';
            tweetLists = document.querySelectorAll(tweetGetRule);
        }else{
            tweetLists = document.querySelectorAll('div[data-testid=\"cellInnerDiv\"]:not(.tweet-accepted):not(.tweet-rejected):not(.tweet-muted):not(.tweet-ignore)');
        }
        var tweetCount = -1;
        var preAccountId = null;
        var saveAfterScanning = false;
        //if(tweetLists.length > 0) console.log(tweetLists);
        if(tweetLists.length == 0){
            //検索完了
            if(!replyAlready.has(location.href) && isRejectAccountById(tweetOwner) && freezeCount>=1){
                removeRejectAccountById(tweetOwner);
                saveRejectAccountList();
            }
            if(preScanTweetCount>0){
                noOwnerScanPass = false;
            }
        }
        if(!document.hasFocus()){
            //return;
        }
        preFocused = document.hasFocus();

        for(let tweet of tweetLists){
            let displayNone = false;
            let promotionTweet = false;

            tweetCount++;
            if(tweet == null){
                continue;
            }
            if(tweet.classList.contains('tweet-accepted') || tweet.classList.contains('tweet-rejected') || tweet.classList.contains('tweet-muted') || tweet.classList.contains('tweet-ignore')){
                continue;
            }
            /*             var scanText = (tweet.querySelector(scanTextPickupRule)!=null ? tweet.querySelector(scanTextPickupRule).innerText : ""); */
            var scanText = "";
            let getReplyTarget = tweet.querySelector(replyTextPickupRuleRule);
            if(getReplyTarget != null){
                scanText += getReplyTarget.innerText.toString().replace(/\n/g, '') + "<br>";
            }

            let scanSelectorAll = tweet.querySelectorAll(scanTextPickupRule);
            for(let scanElement of scanSelectorAll){
                let scanElementChild = scanElement.querySelectorAll(':scope > *');
                for(let secc of scanElementChild){
                    if(secc.tagName=="IMG"){
                        scanText += secc.alt;
                    }else{
                        scanText += secc.innerText.toString();
                    }
                }
                scanText += "<br>";
            }

            if(scanText.search(/\n/) === -1){
                //改行が無いときは読み取りエラーでスキップ
                //tweet.classList.add('tweet-ignore');
                //continue;
            }

            scanText = scanText.replace(/(\d,)?(\d){1,}$/,'');
            scanText += '\n';
            scanText = scanText.replace(/(GIF)?(画像|動画)を読み込む/g, '<br>');
            scanText = scanText.replace(/https:\/\//g, '');
            scanText = scanText.replace(/http:\/\//g, '');
            scanText = scanText.replace(/^Block(\n)?/, '');
            scanText = scanText.replace(/<br><br>@/, /<br>@/);
            //scanText = scanText.replace(/(?<!(<br>))@/, '<br>@');
            scanText = scanText.replace(/(?<!(<br>))·/, '<br>·<br>');
            scanText = scanText.replace(/<br> ﾟ<br>/,/<br>/);

            // const redBlockBtn = tweet.querySelector('.redblock-btn');
            const getUserPickup = tweet.querySelector('a.r-dnmrzs');
            const getUserIdByString = (getUserPickup!=null?getUserPickup.href:null); //(redBlockBtn!=null?redBlockBtn.title:null);
            const reg = /([a-zA-Z0-9_]{3,20})$/;
            var accountId = null;//先頭にアットマーク有
            if(getUserIdByString!=null){
                const check = getUserIdByString.match(reg);
                if(check != null && check[0]!=null){
                    accountId = "@"+check[0];
                }
            }
            //console.log(accountId);
            if(accountId == null){
                if(activate==FOLLOWER_EXPLORER) continue;

                tweet.classList.add('tweet-ignore');
                if(tweet.innerText.toString().search(/((凍結|削除)されたアカウント|ルールに違反)/) !== -1){
                    freezeCount++;
                }
                continue;
            }
            const redBlockButtonPickupRuleNew = redBlockButtonPickupRule.replace(/\$\{accountId\}/g, accountId);

            //if(isRejectAccountById(accountId)) addRejectCSS(accountId);

            if(window.getComputedStyle(tweet).display != null){
                if(window.getComputedStyle(tweet).display == "none"){
                    //tweet.classList.add('tweet-ignore');
                    displayNone = true;
                }
            }
            if(tweet.querySelector(promotionPickupRule)!= null){
                promotionTweet = true;
            }

            let accountNameDat = tweet.querySelector('div[dir="ltr"] > span');
            if(accountNameDat == null){
                if(activate==FOLLOWER_EXPLORER) continue;

                tweet.classList.add('tweet-ignore');
                continue;
            }
            let accountName = "";
            let accountNameParts = accountNameDat.querySelectorAll(':scope > *');
            for(let aPart of accountNameParts){
                if(aPart.tagName=="IMG"){
                    accountName += aPart.alt;
                }else{
                    accountName += aPart.innerText;
                }
            }

            //let accountName = accountNameDat.innerText;

            let imageDat = tweet.querySelector(".r-1ssbvtb");
            let imageText = "";
            if(imageDat != null){
                imageText = "<br>" + imageDat.innerText + "<br>";
            }

            scanText = accountName + "<br>" + accountId + "<br>" + scanText + imageText;
            scanText = scanText.replace(/(<br>)?·(<br>)?\d{1,3}(分|時間|日)/, '<br>');

            var ok = 0;//(1:強制通過, 2:検知除外(主), 4:検知除外(それ以外))
            var ng = 0;//(1:ワード検知, 2:それ以外で検知, 4:ミュート検知)
            var ngString = null;
            if(activate==2 && tweetCount==0){
                //ok = 1;
            }

            //console.log(scanText);

            var aLists = tweet.querySelectorAll('a[dir="ltr"]');
            const ownerHref = (accountId != null ? 'twitter.com/' + accountId.substr(1) + '' : '///');
            const hashtagHref = ('twitter.com/hashtag/');
            for(let aDat of aLists){
                if(aDat.href != null/* && aDat.href.search(/^https:\/\/t\.co/) !== -1*/ && aDat.href.search(ownerHref) === -1 && aDat.href.search(hashtagHref) === -1){
                    //console.log(aDat.href + ' ' + aDat.innerText);
                    //scanText += aDat.innerText.replace(/https?:\/\//g, '') + '\n';
                }
            }
            var mediaOwner = tweet.querySelector('div[dir="ltr"].r-1cwl3u0:not(.r-q4m81j)');
            if(mediaOwner != null){
                scanText += mediaOwner.innerText.toString().replace(/\n/g, '') + '<br>';
            }
            var linkLists = tweet.querySelectorAll('a[dir="ltr"].r-1cwl3u0, div[data-testid="card.layoutSmall.detail"]');
            //console.log(linkLists);
            for(let lDat of linkLists){
                if(lDat.href == null/* && lDat.href.search(/^https:\/\/t\.co/) !== -1*/ || (lDat.href.search(ownerHref) === -1 && lDat.href.search(hashtagHref) === -1)){
                    if(lDat.innerText.toString().search(/^@/) === -1){
                        scanText += lDat.innerText + '\n';
                    }
                }
            }

            var quoteLists = tweet.querySelectorAll('div[role="link"]:has(div[dir="auto"])');
            //console.log(quoteLists);
            //if(quoteLists.length > 0) quoteLists.forEach((e)=>(console.log(e.innerText)));
            for(let qDat of quoteLists){
                if(qDat.href == null/* && qDat.href.search(/^https:\/\/t\.co/) !== -1*/ || (qDat.href.search(ownerHref) === -1 && qDat.href.search(hashtagHref) === -1)){
                    scanText += '引用<br>' + qDat.innerText.replace(/\n/g,'<br>').replace(/<br>·<br>.*(秒|分|時間|日)<br>/g, '<br>') + '\n';
                }
            }
            var quoteNames = tweet.querySelectorAll('div[data-testid="User-Name"]');
            for(let qNam of quoteNames){
                if(qNam.href != null/* && qNam.href.search(/^https:\/\/t\.co/) !== -1*/ && qNam.href.search(ownerHref) === -1 && qNam.href.search(hashtagHref) === -1){
                    scanText += qNam.innerText + '\n';
                }
            }
            /*
            var emojiLists = tweet.querySelectorAll('img.r-zw8f10');
            for(let eDat of emojiLists){
                if(eDat.alt != null){
                    scanText += eDat.alt;
                }
            }
            if(emojiLists != null) scanText += '\n';*/
            let scanParts = scanText.split('\n');
            if(scanParts[3] != null){
                if(scanParts[2].search(/·/) !== -1){
                    scanParts.splice(2, 2);
                    scanText = scanParts.join('\n');
                }
            }
            scanText = scanText.replace(/\n/g, '<br>');
            scanText = scanText.replace(/(<br>)*$/, '<br>');
            scanText = scanText.replace(/https?:\/\//g, '');
            //console.log(accountId);
            //console.log(scanText);

            var reason = [];
            var nowDate = getNowDate();
            var url = "---";
            var newReason = 0;
            var consoleLog = true;

            if(accountId != null){
                url = getURLByTweet(accountId, tweet);
            }

            //処理打ち切り判定
            if(tweet.querySelector('div[role="button"][data-testid*="-unblock"]') != null){
                tweet.classList.add('tweet-ignore');
                tweet.title = scanText;
                continue;
            }
            if(tweet.querySelector('div[role="button"][data-testid*="-unfollow"]') != null){
                tweet.classList.add('tweet-accepted');
                tweet.title = scanText;
                continue;
            }
            if(redBlockEnable){
                //console.log(tweet.querySelector('.redblock-btn'));
                //console.log(tweet.querySelector(redBlockButtonPickupRuleNew));
                if(tweet.querySelector(redBlockButtonPickupRuleNew) == null && tweet.querySelector('div[data-testid*="UserAvatar"]') != null && paths[4]=="hidden"){
                    tweet.classList.add('tweet-rejected');
                    tweet.title = scanText;
                    let removeChildDat = tweet.querySelector(':scope > div > *');
                    if(removeChildDat != null){
/*                         if(accountId != null){
                            addRejectCSS(accountId, 'Blocked or Following', url);
                        } */
                        removeChildDat.remove();
                    }
                    continue;
                }
            }
            //処理打ち切り判定ここまで

            //スキャン実行判定
            var scanExecute = true;
            if(accountId != null){
                if(ngUsersBye.has(accountId) && tweet.querySelector('.redblock-btn') == null){
                    scanExecute = false;
                    ng |= 2;
                }
                if(hasRejectCSS(accountId)){
                    scanExecute = false;
                    ng |= 2;
                }
                if(tweet.querySelector(promotionPickupRule)!=null){
                    scanExecute = false;
                }
            }
            //console.log(scanExecute);
            //スキャン実行判定ここまで

            //再検出等チェック
            if(accountId != null){
                reason = [];
                nowDate = getNowDate();

                if(url.toString().search(/\/analytics/)!==-1 && !promotionTweet){
                    console.log(tweet);
                }
                //console.log(location.href + ", " + url);
                let urlMatch = new RegExp(url, "i");
                //console.log(tweetOwner + " " + accountId);
                if(location.href.toString().search(urlMatch) !== -1){
                    //ツイートオーナー
                    ok |= 2;
                    //if(mainTweetOnReply == null) console.log(accountId);

                    mainTweetOnReply = tweet;
                }else if(/*location.href.toString().search(urlMatch) !== -1*/!afterTweetOwner || beforeTweetOwners.has(accountId)){
                    ok |= 2;
                    //beforeTweetOwners.add(accountId);
                }else{
                    if(activate==REPLY_EXPLORER){
                        if(mainTweetOnReply != null){
                            if(mainTweetOnReply.getBoundingClientRect().top > tweet.getBoundingClientRect().top && mainTweetOnReply.getBoundingClientRect().top != 0 && tweet.getBoundingClientRect().top != 0){
                                ok |= 2;
                                //console.log(mainTweetOnReply.getBoundingClientRect().top + " " + tweet.getBoundingClientRect().top);
                                //console.log(accountId);
                            }
                        }else if(tweet.getBoundingClientRect().top <= mainTweetTopCoordinate){
                            //ok |= 2;
                        }
                    }
                    if(tweet.classList.contains("tweet-ignore")){
                        continue;
                    }
                }
                let tweetId = getTweetIdByURL(url);
                if(tweetId in rejectTweetId){
                    //ID変化の検出
                    let prv = rejectTweetId[tweetId];
                    let nxt = accountId;
                    if(prv != nxt){
                        replaceNgReason(prv, nxt);
                        console.log("ID Replace: " + prv + " -> " + nxt);
                        saveAfterScanning = true;
                    }
                }

                if(accountId in replyFirstOnWindow){
                }else{
                    replyFirstOnWindow[accountId] = url;
                }

                if(!scanExecute){
                    //処理済み
                    //console.log(accountId);
                }else if(ngUsers.has(accountId)){
                    //直近で検知済み
                    ng |= 2;
                    ngString = "Already";
                    if(accountId in ngReasons){
                        reason = ngReasons[accountId];
                        if((reason[0] != url || reason[1].toString().search(/\(Enforcement\)\{0\}/) !== -1) && !displayNone){
                            reason[4] = nowDate;
                            reason[5] = nowVersion;
                            if(reason.length == 6){
                                reason.push(url);
                            }else{
                                reason[6] = url;
                            }
                        }else{
                            consoleLog = false;
                        }
                    }else{
                        reason = [url, ngString, nowDate, nowVersion, nowDate, nowVersion];
                        ngReasons[accountId] = reason;
                        newReason = 1;
                    }
                    if(consoleLog){
                        ngUsers.delete(accountId);
                        ngUsers.add(accountId);
                    }
                }else if(ngUsersRemoved.has(accountId) && ok==0){
                    //NGリストにあるアカウント
                    ng |= 2;
                    ngString = "Already Removed";
                    if(accountId in ngReasons){
                        reason = ngReasons[accountId];
                        //if(reason[1] != null) ngString += " " + reason[1].toString();
                        //console.log(reason[0]);
                        //console.log(url);
                        let firstUrl = reason[0];
                        let firstDate = reason[2];
                        if(isNaN(Date.parse(firstDate))){
                            //不正な日時
                            firstDate = "9999/12/31 23:59:59";
                        }
                        if((((firstUrl != url) && firstUrl != location.href && Date.parse(firstDate)+alreadyRejectCoolDown <= Date.parse(nowDate)) || reason[1].toString().search(/\(Enforcement\)\{0\}/) !== -1) && !displayNone){
                            reason[4] = nowDate;
                            reason[5] = nowVersion;
                            if(reason.length == 6){
                                reason.push(url);
                            }else{
                                reason[6] = url;
                            }
                            if(Date.parse(nowDate) <= Date.parse(alreadyRejectNoConsole_before) || Date.parse(alreadyRejectNoConsole_after) <= Date.parse(nowDate)){
                                ngUsersAlready.add(accountId);
                                ngUsers.add(accountId);
                                consoleLog = false;
                            }
                            if(promotionTweet) consoleLog = false;
                            //console.log(reason[2]);
                        }else{
                            consoleLog = false;
                            if(firstUrl==url || firstUrl==location.href){
                                if(reason[1] != null) ngString = "Re-Reject " + reason[1].toString();
                                ngUsers.delete(accountId);
                                ngUsers.add(accountId);
                                console.log("Re-Reject: " + accountId);
                            }
                        }
                    }else{
                        reason = [url, ngString, nowDate, nowVersion, nowDate, nowVersion];
                        ngReasons[accountId] = reason;
                    }
                    if(consoleLog){
                        let alreadyRejectMsg = accountId + ': ' + ngString ;
                        if(newReason==0 && reason[1] != null){
                            alreadyRejectMsg += ',\nPast Reason: ' + reason[1];
                            ngString += ', Past Reason: ' + reason[1];
                            if(reason[2] != null){
                                alreadyRejectMsg += ', First Reject: ' + reason[2];
                            }
                        }
                        console.log(alreadyRejectMsg);
                        ngUsersAlready.add(accountId);
                        ngUsers.add(accountId);
                        ngUsersRemoved.delete(accountId);
                        ngUsersRemoved.add(accountId);
                    }else{
                        //ngUsers.add(accountId);
                    }
                }else if(okUsers.has(accountId)){
                    ok |= 1;
                    tweet.classList.add('redblock-btn-hidden');
                }
            }
            //再検出等チェックここまで

            //ブロック済チェック
            if(redBlockEnable && activate!=FOLLOWER_EXPLORER){
//                if(tweet.querySelector('.redblock-btn[title*="'+accountId+'"]') == null && tweet.querySelector('div[data-testid*="UserAvatar"]') != null && (ok==0)){
                //console.log(ok + " " + ng);
                if(tweet.querySelector(redBlockButtonPickupRuleNew) == null && tweet.querySelector('div[data-testid*="UserAvatar"]') != null && (!promotionTweet) && (ok==0) && accountId!=tweetOwner){
                    tweet.classList.add('tweet-rejected');
                    let removeChildDat = tweet.querySelector(':scope > div > *');
                    if(removeChildDat != null){
                        if(accountId != null){
                            addRejectCSS(accountId, 'Blocked or Following', url);
                        }
                        removeChildDat.remove();
                    }
                    continue;
                }
            }
            //ブロック済チェックここまで

            //プロフィールチェック
            if(redBlockEnable && ok==0 && ng==0){
                if(tweet.querySelector('.redblock-btn[title*="TSTR-Except"][title*="'+accountId+'"]')!=null){
                    //検知対象外
                }else if(tweet.querySelector('.redblock-btn[title*="TSTR-Reject"][title*="'+accountId+'"]')!=null){
                    ng |= 2;
                    if(tweet.querySelector('.redblock-btn[title*="TSTR-Reject"][title*="'+accountId+'"]').title.toString().match('(?<=(word ))\'.*\'')[0] != null){
                        ngString = "Profile Reject: " + tweet.querySelector('.redblock-btn[title*="TSTR-Reject"][title*="'+accountId+'"]').title.toString().match('(?<=(word ))\'.*\'')[0].replace(/\(TSTR-Reject\)\{0\}/g, '');
                    }else{
                        ngString = "Profile Reject";
                    }
                    if(ngString.toString().search(/\(Enforcement\)\{0\}/) !== -1){
                        if(!isRejectAccountById(accountId)) rejectedCount++;
                        ngUsers.add(accountId);
                        ngUsersRemoved.add(accountId);
                        ngUsersAlready.add(accountId);
                        console.log("Enforcement: " + accountId);
                    }else if(ngString.toString().search(/\(OmitLog\)\{0\}/) !== -1){
                        addRejectAccountById(accountId, ngString, url);
                    }else{
                        addRejectAccountById(accountId, ngString, url);
                        let reg = new RegExp(ngString);
                        console.log(reg);
                    }
                    reason = [url, ngString, nowDate, nowVersion, nowDate, nowVersion];
                    ngReasons[accountId] = reason;
                    saveRejectAccountList();
                }else if(tweet.querySelector('.redblock-btn[title*="TSTR-Mute"][title*="'+accountId+'"]')!=null){
                    ng |= 4;
                    if(tweet.querySelector('.redblock-btn[title*="TSTR-Mute"][title*="'+accountId+'"]').title.toString().match('(?<=(word ))\'.*\'')[0] != null){
                        ngString = "Profile Mute: " + tweet.querySelector('.redblock-btn[title*="TSTR-Mute"][title*="'+accountId+'"]').title.toString().match('(?<=(word ))\'.*\'')[0].replace(/\(TSTR-Mute\)\{0\}/g, '');
                    }else{
                        ngString = "Profile Mute";
                    }
                }
            }
            //プロフィールチェックここまで

            //Muteチェック
            if(scanExecute){
                for(let ngWord of wordMuteList){
                    if(ng!=0) break;

                    if(scanText.search(ngWord) !== -1){
                        ng |= 4;
                        ngString = ngWord;
                        break;
                    }
                }
            }
            //Muteチェックここまで

            //Rejectチェック
            if(scanExecute && ngString==null){
                for(let ngWord of nameRejectList){
                    if(ng!=0) break;

                    if(accountName.toString().search(ngWord) !== -1){
                        ng |= 1;
                        ngString = ngWord;
                        break;
                    }
                }

                if(ngString == null) ngString = tweetScanningOnString(scanText, activate);
                if(ngString != null){
                    //console.log(accountId + ": " + ngString);
                    ng |= 1;
                    if((ok & 2)!=0){
                        let tweetTextFilling = tweet.querySelectorAll(scanTextPickupRule);
                        if(tweetTextFilling != null){
                            for(let ttf of tweetTextFilling){
                                ttf.innerHTML = tweetReplacingOnHTML(ttf.innerHTML.toString(), activate);
                            }
                        }
                        //console.log(tweetTextFilling);
                    }
                }
            }

            if(activate==2){//Reply Only
                //console.log(scanText);
                if(accountId != null && scanExecute){
                    let checkPass = false;
                    if(ok!=0){
                        //指定許可者は検知対象外
                        checkPass = true;
                    }
                    let matchIdCnt = (scanText.match(new RegExp(accountId.toString(), "g")) || []).length;
                    matchIdCnt = Math.min(matchIdCnt, replyContinuousOverReject-1);

                    if(replyAlready.has(url)){
                        //チェック済なのでスルー
                        checkPass = true;
                    }else{
                        //console.log(accountId);
                        if(replyOrder.has(accountId)){
                            //console.log(": continue");
                            if(preAuthor != tweetOwner) replyCountByAuthor[accountId] += matchIdCnt;
                            replyAlready.add(url);
                            replyOrder.delete(accountId);
                            replyOrder.add(accountId);
                        }else{
                            replyCountByAuthor[accountId] = matchIdCnt;
                            replyFirstOnPage[accountId] = url;
                            replyAlready.add(url);
                            replyOrder.add(accountId);
                            if(replyOrder.size > replyOrderLimit){
                                var replyOrderRemove = [];
                                var replyOrderRemoveCount = 0;
                                for(let key of replyOrder){
                                    replyOrderRemove.push(key);
                                    replyOrderRemoveCount++;
                                    if(replyOrder.size <= replyOrderLimit + replyOrderRemoveCount) break;
                                }
                                for(let key of replyOrderRemove){
                                    replyOrder.delete(key);
                                    delete replyCountByAuthor[key];
                                }
                                /*                             var replyOrderDats = [];
                            for(let key of replyOrder){
                                replyOrderDats.push(key);
                            }
                            console.log(replyOrderDats); */
                            }
                        }
                    }

                    if(!checkPass){
                        if(preAuthor == accountId){
                            preAuthorCount+=matchIdCnt;
                            if(preAuthorCount >= replyContinuousOverReject && !isRejectAccountById(accountId)){
                                ng |= 2;
                                ngString = "too continual replies";
                                addRejectAccountById(accountId, ngString, replyFirstOnPage[accountId]);
                                reason = [replyFirstOnPage[accountId], ngString, nowDate, nowVersion, nowDate, nowVersion];
                                ngReasons[accountId] = reason;
                                let reg = new RegExp(ngString);
                                console.log(reg);
                                saveRejectAccountList();
                            }
                        }else{
                            preAuthor = accountId;
                            preAuthorCount = matchIdCnt;
                        }
                    }
                    if(replyCountByAuthor[accountId] >= replyCountOverReject && !isRejectAccountById(accountId) && !checkPass){
                        ng |= 2;
                        ngString = "too many replies";
                        addRejectAccountById(accountId, ngString, replyFirstOnPage[accountId]);
                        reason = [replyFirstOnPage[accountId], ngString, nowDate, nowVersion, nowDate, nowVersion];
                        ngReasons[accountId] = reason;
                        let reg = new RegExp(ngString);
                        console.log(reg);
                        saveRejectAccountList();
                    }
                }
            }
            //Rejectチェックここまで

            //console.log(ok + " " + ng + " " + isRejectAccountById(accountId));
            let userAvatar = tweet.querySelector('div[data-testid=\"Tweet-User-Avatar\"], div:has(>div[data-testid*=\"UserAvatar-Container-\"])');
            if((ok & 2)!=0){
                if(noOwnerScanPass) ok -= 2;

                tweet.classList.add('tweet-forcedisplay');
                if(!isAcceptAccountById(accountId)){
                    var rescanButton = document.createElement('button');
                    rescanButton.innerHTML = 'ReScan';
                    rescanButton.title = '[TSTR] ReScan';
                    rescanButton.classList.add('rescan-button');
                    rescanButton.classList.add('tstr-button');
                    rescanButton.addEventListener('click', {handleEvent: reScanHandle});
                    if(userAvatar != null) userAvatar.appendChild(rescanButton);
                }
                tweet.title = scanText;
                //console.log(ok + " " + ng);

                if(isRejectAccountById(accountId) || (ok==0 && ng!=0 && (ng & 4)==0)){
                }
            }
            //console.log(ok + " " + ng);
            if((ng==0 || ok!=0) && !isRejectAccountById(accountId)){
                if(ng==0) tweet.classList.add('tweet-accepted');
                else if((ng & 4)!=0) tweet.classList.add('tweet-muted');
                else tweet.classList.add('tweet-rejected');

                tweet.title = scanText;
                tweet.setAttribute('data-href', url.toString().replace(/^https:\/\/(twitter|x).com/, ''));
                if(ok==0){
                    var rejectButton = document.createElement('button');
                    rejectButton.innerHTML = 'Reject';
                    rejectButton.title = '[TSTR] Reject ' + accountId;
                    if(accountId != null){
                        rejectButton.addEventListener('click', {id: accountId, handleEvent: addRejectAccountByIdHandle, tweet: tweet, scanText: scanText, activate: activate, url: url});
                        rejectButton.classList.add('reject-button');
                        rejectButton.classList.add('tstr-button');
                        if(userAvatar != null) userAvatar.appendChild(rejectButton);
                    }
                }
            }else{
                if((ng==1 || (((ng & 1) != 0) && scanExecute)) && ok==0 && accountId != null){
                    if(!isRejectAccountById(accountId)){
                        url = getURLByTweet(accountId, tweet);
                        nowDate = getNowDate();
                        reason = [url, ngString.toString(), nowDate, nowVersion, nowDate, nowVersion];
                        ngReasons[accountId] = reason;

                        if(ngString.toString().search(/\(Enforcement\)\{0\}/) !== -1){
                            if(!isRejectAccountById(accountId)) rejectedCount++;
                            ngUsers.add(accountId);
                            ngUsersRemoved.add(accountId);
                            ngUsersAlready.add(accountId);
                            console.log("Enforcement: " + accountId);
                        }else if(ngString.toString().search(/\(OmitLog\)\{0\}/) !== -1){
                            addRejectAccountById(accountId, ngString, url);
                        }else{
                            console.log(scanText.replace(/\n/g, '\\n'));
                            addRejectAccountById(accountId, ngString, url);
                            console.log(ngString);
                        }
                        saveRejectAccountList();
                    }else if(ngString.toString().search(/\(Enforcement\)\{0\}/) !== -1){
                        if(!isRejectAccountById(accountId)) rejectedCount++;
                        ngUsersRemoved.add(accountId);
                        ngUsersAlready.add(accountId);
                        console.log("Enforcement: " + accountId);
                        saveRejectAccountList();
                    }
                }
                if((ng & 4) != 0){
                    tweet.classList.add('tweet-muted');
                    let removeChildDat = tweet.querySelector(':scope > div > *');
                    if(ok==0 && removeChildDat != null && !tweet.classList.contains('tweet-forcedisplay')){
                        removeChildDat.remove();
                    }
                }else{
                    tweet.classList.add('tweet-rejected');
                }
                if(tweet.classList.contains('tweet-forcedisplay') && isRejectAccountById(accountId)){
                    var unRejectButton = document.createElement('button');
                    unRejectButton.innerHTML = 'UnReject';
                    unRejectButton.title = '[TSTR] UnReject ' + accountId;
                    if(accountId != null){
                        unRejectButton.addEventListener('click', {id: accountId, handleEvent: removeRejectAccountByIdHandle, tweet: tweet, scanText: scanText, activate: activate});
                        unRejectButton.classList.add('unreject-button');
                        unRejectButton.classList.add('tstr-button');
                        if(userAvatar != null) userAvatar.appendChild(unRejectButton);
                    }
                }
                tweet.title = scanText;
                tweet.setAttribute('data-href', url.toString().replace(/^https:\/\/(twitter|x).com/, ''));
                if(accountId != null) addRejectCSS(accountId, ngString, url, ((ng & 4)!=0) ? "Mute" : "Reject");
            }
            if(tweetOwner != null){
                if(tweetOwner.toLowerCase() == accountId.toLowerCase()){
                    afterTweetOwner = true;
                }
            }
            preAccountId = accountId;
        }
        preScanTweetCount = tweetCount;
        if(saveAfterScanning){
            ngUsersSort();
            saveRejectAccountList();
        }
    },60);
    //メイン部分ここまで

    //API関係ここから
    function tweetScanningOnString(scanText, activate){
        //スキャンの実行
        scanText = scanText.toString();
        let scanParts = scanText.split('\n');
        for(let ngWord of wordRejectList){
            if(scanText.search(ngWord) !== -1){
                return ngWord;
            }
        }

        for(let scanT of scanParts){
            for(let ngWord of wordRejectListEachLines){
                if(scanT.search(ngWord) !== -1){
                    return ngWord;
                }
            }
        }
        if(activate==REPLY_EXPLORER || scanText.toString().search(/返信先: /)!==-1){
            for(let ngWord of wordRejectListByReply){
                if(scanText.search(ngWord) !== -1){
                    return ngWord;
                }
            }
        }
        return null;
    }
    function tweetReplacingOnHTML(scanHTML, activate){
        //スキャン検出箇所の黒塗り(動作重め)
        for(let ngWord of wordRejectList){
            if(ngWord.toString().search(/\(Enforcement\)\{0\}/) === -1) continue;
            //if(scanHTML.toString().search(ngWord)!==-1) console.log(ngWord);
            if(ngWord.toString().search(/\#/) !== -1){
                scanHTML = scanHTML.replace(new RegExp(ngWord, 'g'), '</a>#(＊＊＊)<a>');
            }else{
                scanHTML = scanHTML.replace(new RegExp(ngWord, 'g'), '(＊＊＊)');
            }
        }

        if(activate==REPLY_EXPLORER || scanHTML.toString().search(/返信先: /)!==-1){
            for(let ngWord of wordRejectListByReply){
                if(ngWord.toString().search(/\(Enforcement\)\{0\}/) === -1) continue;

                if(ngWord.toString().search(/\#/) !== -1){
                    scanHTML = scanHTML.replace(new RegExp(ngWord, 'g'), '</a>#(＊＊＊)<a>');
                }else{
                    scanHTML = scanHTML.replace(new RegExp(ngWord, 'g'), '(＊＊＊)');
                }
            }
        }
        //console.log(scanHTML);
        return scanHTML;
    }

    function getAccountIdByTweet(tweet){
        //ツイート情報からIDを取得
        //先頭に@を付ける
        const getUserPickup = tweet.querySelector('a.r-dnmrzs');
        const getUserIdByString = (getUserPickup!=null?getUserPickup.href:null); //(redBlockBtn!=null?redBlockBtn.title:null);
        const reg = /([a-zA-Z0-9_]{3,15})$/;
        var accountId = null;//先頭にアットマーク有
        if(getUserIdByString!=null){
            const check = getUserIdByString.match(reg);
            if(check != null && check[0]!=null){
                accountId = "@"+check[0];
            }
        }
        return accountId;
    }
    function getURLByTweet(id, tweet){
        //ツイート情報からリンクを取得
        var result = null;
        var aQue = tweet.querySelectorAll('a');
        if(id.substr(0,1)=='@') id = id.substr(1);
        const check = "https://twitter.com/" + id + "/status";
        for(var aDat of aQue){
            //console.log(aDat.href + " " + check);
            if(aDat.href.startsWith(check)){
                if(result == null) result = aDat.href;
                else if(result.length > aDat.href.length) result = aDat.href;
            }
        }
        if(result != null){
            result = result.toString().replace(/\/photo\/\d/, "").replace(/\/analytics$/, '');
        }else{
            result = "https://twitter.com/" + id;
        }
        //console.log(result);
        return result;
    }
    function getTweetIdByURL(url){
        if(url.toString().search(/\/status\/\d*$/) !== -1){
            let idMatch = url.toString().match(/\d*$/);
            if(idMatch[0] != null){
                return idMatch[0];
            }
        }
        return null;
    }
    function moldingURL(url){
        //検索URLの整形
        var result = "";
        var paths = url.pathname.split('/');
        for(let i=0;i<Math.min(paths.length, 4);i++){
            if(i>=1) result += "/";
            result += paths[i];
        }
        const searchParams = new URL(url).searchParams;
        if(searchParams.has("q")){
            result += "?q=" + searchParams.get("q");
        }
        //console.log(result);
        return result;
    }
    function replaceNgReason(prv, nxt){
        //prvからnxtへのNG理由の移行t
        if(prv.substr(0,1) != '@') prv = '@'+prv;
        if(nxt.substr(0,1) != '@') nxt = '@'+nxt;
        if(prv == nxt) return false;

        if(prv in ngReasons){
            let reason = ngReasons[prv];
            let prvStr = "/" + prv.substr(1) + "/";
            let nxtStr = "/" + nxt.substr(1) + "/";
            if(reason[0] != null){
                reason[0] = reason[0].toString().replace(prvStr, nxtStr);
            }
            if(reason[6] != null){
                reason[6] = reason[6].toString().replace(prvStr, nxtStr);
            }
            ngReasons[nxt] = reason;
            delete ngReasons[prv];

            if(ngUsersRemoved.has(prv)){
                ngUsersRemoved.delete(prv);
                ngUsersRemoved.add(nxt);
            }
            if(ngUsersAlready.has(prv)){
                ngUsersAlready.delete(prv);
                ngUsersAlready.add(nxt);
            }
            if(ngUsers.has(prv)){
                ngUsers.delete(prv);
                ngUsers.add(nxt);
            }
        }else{
            return false;
        }
        return true;
    }
    function getNowDate(){
        //現在時刻の取得
        return new Date().toLocaleString();
    }
    var rejectCSSs = new Set();
    function hasRejectCSS(id){
        if(id == null) return false;
        if(id.substr(0,1)=="@"){
            id = id.substr(1);
        }
        const accountId = "@" + id;

        if(rejectCSSs.has(accountId)) return true;
        return false;
    }
    function addRejectCSS(id, reason = null, url = null, type = "Reject"){
        if(id == null) return;
        if(id.substr(0,1)=="@"){
            id = id.substr(1);
        }
        const accountId = "@" + id;

        if(document.getElementById("TSTR-"+id) != null){
            return;//既にある
        }

        let style = document.createElement('style');
        style.id = "TSTR-" + id;
        style.type = "text/css";
        if(reason!=null) style.setAttribute('data-reason', reason.toString().replace(/\/[^\/]*$/, '').replace(/[\/\\]/g, ''));
        if(url!=null) style.setAttribute('data-href', url.toString());
        style.setAttribute('data-type', type.toString());
        style.innerHTML = ""+
            "div[data-testid=\"cellInnerDiv\"]:has(a[href*=\"/"+id+"/status/\"]):not(.tweet-forcedisplay){\n"+
            "    display: none !important;\n"+
            "}\n";
        if(document.querySelector('style#TSTR') != null){
            document.querySelector('style#TSTR').before(style);
        }else{
            document.querySelector('html').appendChild(style);
        }
        rejectCSSs.add(accountId);
    }
    function removeRejectCSS(id){
        if(id == null) return false;
        if(id.substr(0,1)=="@"){
            id = id.substr(1);
        }
        const accountId = "@" + id;
        if(document.getElementById("TSTR-"+id) != null){
            let style = document.getElementById("TSTR-"+id);
            style.remove();
            rejectCSSs.delete(accountId);
            return true;
        }
        rejectCSSs.delete(accountId);
        return false;
    }
    function removeAllRejectCSS(){
        var res = 0;
        for(let id of rejectCSSs){
            res += (removeRejectCSS(id) ? 1 : 0);
        }
        return res;
    }
    //API関係ここまで

    var ngLogRecentlyId = GM_registerMenuCommand("NGログ書き出し(直近)", ()=>writeRecentlyRejectLog(), {accessKey: "q"});
    function writeRecentlyRejectLog(){
        var text = "";
        if(ngUsers.size === 0){
            alert('書き出しエラー: 最近のNGログが空です');
            return;
        }else{
            var res = window.confirm('確認メッセージ: 最近のNGログに ' + (ngUsers.size) + '件存在します。ファイルに書き出しますか？');
            if(!res) return;
        }
        var id;
        for(id of ngUsers){
            text += id.substr(1);
            if(id in ngReasons){
                text += ngReasonsSlice + ngReasons[id].join(ngReasonsSlice);
            }
            text += '\n';
        }
        const blob = new Blob([text], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ngUsers.txt";
        a.click();
        URL.revokeObjectURL(url);
        //base on https://jp-seemore.com/web/3870/#toc5
    }

    var ngLogAllId = GM_registerMenuCommand("NGログ書き出し(全て)", ()=>writeAllRejectLog(), {accessKey: "a"});
    function writeAllRejectLog(){
        var text = "";
        if(ngUsers.size === 0 && ngUsersRemoved.size === 0){
            alert('書き出しエラー: NGログが空です');
            return;
        }else{
            var res = window.confirm('確認メッセージ: NGログに ' + (rejectedCount) + '件存在します。すべてファイルに書き出しますか？');
            if(!res) return;
        }
        var id;
        for(id of ngUsersRemoved){
            if(ngUsers.has(id)){
                continue;
            }
            text += id.substr(1);
            if(id in ngReasons){
                text += ngReasonsSlice + ngReasons[id].join(ngReasonsSlice);
            }
            text += '\n';
        }
        for(id of ngUsers){
            text += id.substr(1);
            if(id in ngReasons){
                text += ngReasonsSlice + ngReasons[id].join(ngReasonsSlice);
            }
            text += '\n';
        }
        const blob = new Blob([text], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ngUsers.txt";
        a.click();
        URL.revokeObjectURL(url);
        //base on https://jp-seemore.com/web/3870/#toc5
    }

    var openProfileRecentlyId = GM_registerMenuCommand("プロフィールを開く(直近)", ()=>openBlockAccountProfile(), {accessKey: "r"});
    function openBlockAccountProfile(){
        var res = true;
        if(ngUsers.size > maxOpenProfiles){
            res = window.confirm('確認メッセージ: NGリストに ' + ngUsers.size + '件存在します。先頭' + maxOpenProfiles + '件のみ開きますか？');
        }else if(ngUsers.size === 0){
            alert('NGリストアクセスエラー: NGリストが空です');
            return;
        }
        if(res == false) return;
        var cnt = 0;
        var victim = [];
        for(var id of ngUsers){
            victim.push(id);
            cnt++;
            if(cnt >= maxOpenProfiles) break;
        }
        for(i=0;i<cnt;i++){
            if(victim[i] in ngReasons){
                if(ngReasons[victim[i]][1] != null && (ngReasons[victim[i]][1].toString().search(/client reject/) !== -1 || ngReasons[victim[i]][1].toString().search(/(Preserve)/) !== -1)){
                    if(ngReasons[victim[i]][2] != ngReasons[victim[i]][4]){
                        ngReasons[victim[i]][1] = ngReasons[victim[i]][1].toString().replace(/client reject \(/, "client reject again (");
                    }
                    openAccountPage(victim[i]);
                    ngUsersRemoved.delete(victim[i]);
                    ngUsersRemoved.add(victim[i]);
                    ngUsersAlready.delete(victim[i]);
                    ngUsers.delete(victim[i]);
                    ngUsersBye.add(victim[i]);
                    continue;
                }
            }
            removeRejectAccountById(victim[i], false);
            //addRejectCSS(victim[i]);
            ngUsersBye.add(victim[i]);

            openAccountPage(victim[i]);
        }
        saveRejectAccountList();
    }

    var openProfileRedectionId = GM_registerMenuCommand("プロフィールを開く(再検出)", ()=>openRedectionBlockAccountProfile(), {accessKey: "z"});
    function openRedectionBlockAccountProfile(){
        var res = true;
        if(ngUsersAlready.size > maxOpenProfiles){
            res = window.confirm('確認メッセージ: 再検出NGリストに ' + ngUsersAlready.size + '件存在します。先頭' + maxOpenProfiles + '件のみ開きますか？');
        }else if(ngUsersAlready.size === 0){
            alert('NGリストアクセスエラー: 再検出NGリストが空です');
            return;
        }
        if(res == false) return;
        var cnt = 0;
        var victim = [];
        for(var id of ngUsersAlready){
            victim.push(id);
            cnt++;
            if(cnt >= maxOpenProfiles) break;
        }
        for(i=0;i<cnt;i++){
            if(victim[i] in ngReasons){
                if(ngReasons[victim[i]][1] != null && (ngReasons[victim[i]][1].toString().search(/client reject/) !== -1 || ngReasons[victim[i]][1].toString().search(/(Preserve)/) !== -1)){
                    ngReasons[victim[i]][1] = ngReasons[victim[i]][1].toString().replace(/client reject \(/, "client reject again (");
                    openAccountPage(victim[i]);
                    ngUsers.delete(victim[i]);
                    ngUsersAlready.delete(victim[i]);
                    ngUsersBye.add(victim[i]);
                    continue;
                }
            }
            removeRejectAccountById(victim[i], false);
            //addRejectCSS(victim[i]);
            ngUsersBye.add(victim[i]);

            openAccountPage(victim[i]);
        }
        saveRejectAccountList();
    }

    var writeListRecentlyId = GM_registerMenuCommand("NGリスト書き出し(直近)", ()=>writeNearlyRejectList());
    function writeNearlyRejectList(){
        var text = "";
        if(ngUsers.size === 0){
            alert('書き出しエラー: 最近のNGリストが空です');
            return;
        }else{
            var res = window.confirm('確認メッセージ: 最近のNGリストに ' + (ngUsers.size) + '件存在します。ファイルに書き出しますか？');
            if(!res) return;
        }
        var id;
        var cnt = 0;
        var victim = [];
        for(id of ngUsers){
            text += id.substr(1);
            victim.push(id);
            cnt++;
            /* if(id in ngReasons){
                text += ngReasonsSlice + ngReasons[id].join(ngReasonsSlice);
            } */
            text += '\n';
        }
        for(i=0;i<cnt;i++){
            ngUsers.delete(victim[i]);
            ngUsersAlready.delete(victim[i]);
            ngUsersRemoved.add(victim[i]);
        }

        const blob = new Blob([text], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ngUsers.txt";
        a.click();
        URL.revokeObjectURL(url);
        //base on https://jp-seemore.com/web/3870/#toc5
    }

    var writeListRedectionId = GM_registerMenuCommand("NGリスト書き出し(再検出)", ()=>writeRecentlyRejectList());
    function writeRecentlyRejectList(){
        var text = "";
        if(ngUsersAlready.size === 0){
            alert('書き出しエラー: 再検出NGリストが空です');
            return;
        }else{
            var res = window.confirm('確認メッセージ: 再検出NGリストに ' + (ngUsersAlready.size) + '件存在します。ファイルに書き出しますか？');
            if(!res) return;
        }
        var id;
        var cnt = 0;
        var victim = [];
        for(id of ngUsersAlready){
            text += id.substr(1);
            victim.push(id);
            cnt++;
            /* if(id in ngReasons){
                text += ngReasonsSlice + ngReasons[id].join(ngReasonsSlice);
            } */
            text += '\n';
        }
        if(victim.length >= maxRejectLogConsole){
            noRejectLog = 1;
        }
        for(i=0;i<cnt;i++){
            if(victim[i] in ngReasons){
                if(ngReasons[victim[i]][1] != null && (ngReasons[victim[i]][1].toString().search(/client reject/) !== -1 || ngReasons[victim[i]][1].toString().search(/(Preserve)/) !== -1)){
                    ngUsersRemoved.delete(victim[i]);
                    ngUsersAlready.delete(victim[i]);
                    continue;
                }
            }
            removeRejectAccountById(victim[i], false);
            //addRejectCSS(victim[i]);
            ngUsersBye.add(victim[i]);
        }
        saveRejectAccountList();
        noRejectLog = 0;

        const blob = new Blob([text], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ngUsers.txt";
        a.click();
        URL.revokeObjectURL(url);
        //base on https://jp-seemore.com/web/3870/#toc5
    }

    var writeListAcceptId = GM_registerMenuCommand("OKリスト書き出し(全て)", ()=>writeAllAcceptList());
    function writeAllAcceptList(){
        var text = "";
        if(okUsers.size === 0){
            alert('書き出しエラー: OKリストが空です');
            return;
        }else{
            var res = window.confirm('確認メッセージ: OKリストに ' + (okUsers.size) + '件存在します。ファイルに書き出しますか？');
            if(!res) return;
        }
        var id;
        var cnt = 0;
        var victim = [];
        for(id of okUsers){
            text += id.substr(1);
            victim.push(id);
            cnt++;
            /* if(id in ngReasons){
                text += ngReasonsSlice + ngReasons[id].join(ngReasonsSlice);
            } */
            text += '\n';
        }

        const blob = new Blob([text], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "okUsers.txt";
        a.click();
        URL.revokeObjectURL(url);
        //base on https://jp-seemore.com/web/3870/#toc5
    }

    //AcceptをRejectに
    function tweetAcceptToReject(id){
        if(id.substr(0, 1)=='@') id = id.substr(1);

        var reJudgeTweetLists = document.querySelectorAll('div[data-testid=\"cellInnerDiv\"].tweet-accepted:has(a[href*=\"/'+id+'/status\"])');
        //console.log(reJudgeTweetLists);
        for(var reJudgeTweet of reJudgeTweetLists){
            reJudgeTweet.classList.remove('tweet-accepted');
            reJudgeTweet.classList.add('tweet-rejected');
            if(reJudgeTweet.querySelector('.reject-button') != null){
                reJudgeTweet.querySelector('.reject-button').remove();
            }
        }
        return reJudgeTweetLists.length;
    }

    //IDを指定してリストに追加するイベントのハンドラ
    //Rejectボタンのクリック
    function addRejectAccountByIdHandle(e){
        var reasonString = "client reject";
        if(this.activate != null){
            if(clientRejectReasons[this.activate-1] != null){
                reasonString += " (" + clientRejectReasons[this.activate-1] + ")";
            }
        }
        if(this.tweet != null){
            this.tweet.classList.remove('tweet-accepted');
            this.tweet.classList.add('tweet-rejected');
            if(this.scanText != null) console.log(this.scanText);
            if(this.id != null){
                addRejectAccountById(this.id, reasonString);
            }
            var reg = new RegExp(reasonString);
            console.log(reg);
        }
        if(this.id != null){
            if(this.tweet == null) addRejectAccountById(this.id, reasonString, this.url);
            var id = this.id;
            if(id.substr(0,1)=='@') id = id.substr(1);
            var accountId = '@'+id;

            var url = (this.tweet != null ? getURLByTweet(accountId, this.tweet) : "---");
            var nowDate = getNowDate();

            var reason = [url, reasonString, nowDate, nowVersion, nowDate, nowVersion];
            ngReasons[accountId] = reason;

            let reJudgeCnt = tweetAcceptToReject(this.id);
            if(reJudgeCnt > 0){
                addRejectCSS(this.id);
            }

            saveRejectAccountList();
        }
    }
    function removeRejectAccountByIdHandle(e){
        if(this.id != null){
            removeRejectAccountById(this.id);

            saveRejectAccountList();
        }
    }

    //再スキャン
    function reScan(){
        let tweetLists = document.querySelectorAll('div[data-testid="cellInnerDiv"]:not(.tweet-ignore)');
        for(let tweet of tweetLists){
            let id = getAccountIdByTweet(tweet);
            tweet.classList.remove('tweet-accepted');
            tweet.classList.remove('tweet-rejected');
            //tweet.classList.remove('tweet-muted');
            //tweet.classList.remove('tweet-forcedisplay');

            ngUsersBye.delete(id);
        }
        let rejectButtons = document.querySelectorAll('button.tstr-button');
        for(let rb of rejectButtons){
            rb.remove();
        }
        var unrejects = [];
        for(let accountId of ngUsers){
            if(!ngUsersRemoved.has(accountId)){
                unrejects.push(accountId);
            }
        }
        for(let accountId of unrejects){
            removeRejectAccountById(accountId);
        }
        ngUsers.clear();
        noOwnerScanPass = true;
        alert("再スキャンを行いました。");
    }

    //再スキャンのハンドラ
    function reScanHandle(e){
        reScan();
    }

    //IDを指定してプロフィールを開く
    function openAccountPage(id){
        if(id == null) return;
        if(id.substr(0,1)=='@'){
            id = id.substr(1);
        }
        let accountId = '@'+id;
        //console.log(replyFirstOnWindow);
        if(accountId in replyFirstOnWindow){
            window.open(replyFirstOnWindow[accountId]);
        }else{
            window.open('https://twitter.com/' + id);
        }
    }

    //IDを指定してリストに追加
    function addRejectAccountById(id, reason = null, url = null){
        if(id == null) return;
        if(id.substr(0,1)=='@'){
            id = id.substr(1);
        }
        const accountId = '@'+id;
        let noDelete = 0;
        if(ngUsersRemoved.has(accountId)){
            ngUsers.add(accountId);
            return false;
        }
        if(okUsers.has(accountId)){
            console.log("addRejectAccountError: ID " + accountId + " is already accepted.");
            return false;
        }

        if(!ngUsers.has(accountId) && !ngUsersRemoved.has(accountId)){
            ngUsers.add(accountId);
            rejectedCount++;
            if(!noRejectLog){
                console.log("Reject: " + accountId);
                addRejectCSS(accountId, reason, url);
            }
            //console.log(atId);
            //console.log(id);
            tweetAcceptToReject(accountId);
            return true;
        }
        return false;
    }

    //Rejectを解除しAcceptに変更
    function tweetRejectToAccept(id){
        if(id.substr(0, 1)=='@') id = id.substr(1);
        var reJudgeTweetLists = document.querySelectorAll('div[data-testid=\"cellInnerDiv\"].tweet-accepted:has(a[href*=\"/'+id+'/status\"]), div[data-testid=\"cellInnerDiv\"].tweet-muted:has(a[href*=\"/'+id+'/status\"])');
        for(let reJudgeTweet of reJudgeTweetLists){
            if(reJudgeTweet.querySelector('.reject-button') != null){
                reJudgeTweet.querySelector('.reject-button').remove();
            }
            if(reJudgeTweet.querySelector('.rescan-button') != null){
                reJudgeTweet.querySelector('.rescan-button').remove();
            }
        }

        reJudgeTweetLists = document.querySelectorAll('div[data-testid=\"cellInnerDiv\"].tweet-rejected:has(a[href*=\"/'+id+'/status\"]), div[data-testid=\"cellInnerDiv\"].tweet-muted:has(a[href*=\"/'+id+'/status\"])');
        //console.log(reJudgeTweetLists);
        for(let reJudgeTweet of reJudgeTweetLists){
            if(!reJudgeTweet.classList.contains('tweet-forcedisplay')){
                reJudgeTweet.classList.add('tweet-accepted');
                reJudgeTweet.classList.remove('tweet-rejected');
                reJudgeTweet.classList.remove('tweet-muted');
            }
            if(reJudgeTweet.querySelector('.unreject-button') != null){
                reJudgeTweet.querySelector('.unreject-button').remove();
            }
        }
        return reJudgeTweetLists.length;
    }

    //IDを指定してリストから削除
    function removeRejectAccountById(id, removeCSS = true){
        if(id == null) return;
        if(id.substr(0,1)=='@'){
            id = id.substr(1);
        }
        const accountId = '@'+id;
        //console.log(atId);
        if(ngUsersAlready.has(accountId)) ngUsersAlready.delete(accountId);

        if(ngUsers.has(accountId) || ngUsersRemoved.has(accountId)){
            if(ngUsers.has(accountId)) ngUsers.delete(accountId);
            if(ngUsersRemoved.has(accountId)) ngUsersRemoved.delete(accountId);
            rejectedCount--;
            if(removeCSS) removeRejectCSS(accountId);
            //console.log(accountId);
            if(!noRejectLog) console.log("UnReject: " + accountId);

            tweetRejectToAccept(accountId);
            return true;
        }
        return false;
    }

    //IDを指定してリスト存在判定
    function isRejectAccountById(id){
        if(id == null) return false;

        if(id.substr(0,1)=='@'){
            id = id.substr(1);
        }
        const accountId = '@'+id;
        return (ngUsers.has(accountId) || ngUsersRemoved.has(accountId));
    }

    //IDを指定してOKリストに追加
    function addAcceptAccountById(id){
        if(id == null) return false;

        if(id.substr(0,1)=='@'){
            id = id.substr(1);
        }
        const accountId = '@'+id;
        if(okUsers.has(accountId)) return false;
        if(isRejectAccountById(accountId)) removeRejectAccountById(id);
        okUsers.add(accountId);
        if(!noRejectLog) console.log("Accept: " + accountId);

        tweetRejectToAccept(accountId);

        return true;
    }

    //IDを指定してOKリストから削除
    function removeAcceptAccountById(id){
        if(id == null) return false;

        if(id.substr(0,1)=='@'){
            id = id.substr(1);
        }
        const accountId = '@'+id;
        if(!okUsers.has(accountId)) return false;

        okUsers.delete(accountId);
        if(!noRejectLog) console.log("UnAccept: " + accountId);
        return true;
    }

    //IDを指定してOKリスト存在判定
    function isAcceptAccountById(id){
        if(id == null) return false;

        if(id.substr(0,1)=='@'){
            id = id.substr(1);
        }
        const accountId = '@'+id;
        return okUsers.has(accountId);
    }

    //IDデータの保存
    function saveRejectAccountList(){
        var ngUsersList = [];
        var ngUsersRemovedList = [];
        var id = "";
        var str = "";
        for(id of ngUsersRemoved){
            str = id;
            if(id in ngReasons){
                str += ngReasonsSlice + ngReasons[id].join(ngReasonsSlice);
            }
            ngUsersRemovedList.push(str);
        }
        for(id of ngUsers){
            str = id;
            if(id in ngReasons){
                str += ngReasonsSlice + ngReasons[id].join(ngReasonsSlice);
            }
            ngUsersList.push(str);
        }

        GM_setValue("ngUsers", ngUsersList);
        GM_setValue("ngUsersRemoved", ngUsersRemovedList);
        console.log("NG_saved");
    }
    function saveAcceptAccountList(){
        var okUsersList = [];
        var id = "";
        var str = "";
        for(id of okUsers){
            str = id;
            okUsersList.push(str);
        }

        GM_setValue("okUsers", okUsersList);
        console.log("OK_saved");
    }
    /*
    GM_registerMenuCommand("NGリストから" + maxOpenProfiles + "件削除", ()=>removeRejectAccountList(maxOpenProfiles));
    function removeRejectAccountList(n){
        var cnt = 0;
        if(ngUsers.size === 0){
            alert('NGリスト削除エラー: NGリストが空です');
            return;
        }
        var removeVictim = [];
        for(var id of ngUsers){
            removeVictim.push(id);
            cnt++;
            if(cnt >= n) break;
        }
        var victims = "";
        for(var i=0;i<cnt;i++){
            victims += removeVictim[i];
            if(i < cnt-1) victims += ", ";
        }
        var res = window.confirm('確認メッセージ: NGリストから ' + cnt + '件 \"' + victims + '\" を削除しますか？');
        if(res == false) return;
        for(i=0;i<cnt;i++){
            ngUsers.delete(removeVictim[i]);
            ngUsersRemoved.add(removeVictim[i]);
        }
        alert('NGリスト削除完了: ' + cnt + '件 のデータを削除しました。');
    }*/

    GM_registerMenuCommand("NGリストに追加", ()=>addRejectIdCommand());
    function addRejectIdCommand(){
        var ids = window.prompt('NGリストに追加するIDを入力してください');
        if(ids == null){
            alert('キャンセルされました。');
        }else{
            var added = new Set();
            var alreadyAdded = new Set();
            var elem = [];

            ids = ids.replace(/＠/g, '@');

            if(ids == "@@THIS"){
                var urls = location.pathname.split('/');
                //console.log(urls);
                if(urls[2]!=null && (urls[2]=="status"||urls[2]=="with_replies"||urls[2]=="media"||urls[2]=="likes"||urls[2]=="")){
                    ids = urls[1];
                }else if(urls[1]!=null && (urls[2]==null)){
                    ids = urls[1];
                }else{
                    alert("このページではコマンドを実行できません。");
                    return;
                }
            }else if(ids == "@@SAVE"){
                saveRejectAccountList();
                alert("セーブしました。");
                return;
            }else if(ids == "@@SORT"){
                ngUsersSort();
                alert("ソートしました。");
                return;
            }else if(ids == "@@SCAN"){
                reScan();
                return;
            }else if(ids.substr(0,2)=="@@"){
                alert("コマンド \"" + ids + "\" は存在しません。");
                return;
            }//専用コマンドここまで
            if(ids.substr(0,2)=="@@") return;//コマンドをユーザー名扱いしない

            let idsSplit = ids.split('\n');
            if(idsSplit.length > maxRejectLogConsole){
                noRejectLog = 1;
            }
            for(var id of idsSplit){
                id = id.replace(/\r/g, '');
                //console.log(id);
                if(id.substr(0,1) != '@'){
                    id = '@' + id;
                }
                elem = id.split(ngReasonsSlice);
                id = elem[0];
                if(!ngUsers.has(id) && !ngUsersRemoved.has(id)){
                    addRejectAccountById(id, "client reject (user)");
                    if(elem[1] != null){
                        ngReasons[id] = elem.slice(1);
                        if(ngReasons[id][2] != ngReasons[id][4]){
                            ngReasons[id][1] = ngReasons[id][1].toString().replace(/client reject \(/, "client reject again (");
                        }
                    }else{
                        var url = location.href;
                        var nowDate = getNowDate();
                        var reason = [url, "client reject (user)", nowDate, nowVersion, nowDate, nowVersion];
                        ngReasons[id] = reason;
                    }
                    added.add(id);
                }else{
                    alreadyAdded.add(id);
                }
            }
            noRejectLog = 0;
            var text = [];
            if(added.size >= 1){
                for(id of added){
                    if(text.length != 0){
                        text += ", ";
                    }
                    if(text.length >= alertTextMaxLength){
                        text += '...';
                        break;
                    }
                    text += id;
                }
                saveRejectAccountList();
                if(text.length >= alertTextMaxLength){
                    alert('NGリストに ' + added.size + '件のデータ \"' + text + '\" を追加しました。');
                }else{
                    alert('NGリストに \"' + text + '\" を追加しました。');
                }

            }else{
                for(id of alreadyAdded){
                    if(text.length != 0){
                        text += ", ";
                    }
                    if(text.length >= alertTextMaxLength){
                        text += '...';
                        break;
                    }
                    text += id;
                }
                alert('\"' + text + '\" は既にリストに追加されています。');
            }
        }
    }
    GM_registerMenuCommand("OKリストに追加", ()=>addAcceptIdCommand());
    function addAcceptIdCommand(){
        var ids = window.prompt('OKリストに追加するIDを入力してください');
        if(ids == null){
            alert('キャンセルされました。');
        }else{
            var added = new Set();
            var alreadyAdded = new Set();
            var elem = [];

            ids = ids.replace(/＠/g, '@');

            if(ids == "@@THIS"){
                var urls = location.pathname.split('/');
                //console.log(urls);
                if(urls[2]!=null && (urls[2]=="status"||urls[2]=="with_replies"||urls[2]=="media"||urls[2]=="likes"||urls[2]=="")){
                    ids = urls[1];
                }else if(urls[1]!=null && (urls[2]==null)){
                    ids = urls[1];
                }else{
                    alert("このページではコマンドを実行できません。");
                    return;
                }
            }else if(ids == "@@SAVE"){
                saveAcceptAccountList();
                alert("セーブしました。");
                return;
            }else if(ids.substr(0,2)=="@@"){
                alert("コマンド \"" + ids + "\" は存在しません。");
                return;
            }//専用コマンドここまで
            if(ids.substr(0,2)=="@@") return;//コマンドをユーザー名扱いしない

            let idsSplit = ids.split('\n');
            if(idsSplit.length > maxRejectLogConsole){
                noRejectLog = 1;
            }
            for(var id of idsSplit){
                id = id.replace(/\r/g, '');
                //console.log(id);
                if(id.substr(0,1) != '@'){
                    id = '@' + id;
                }
                elem = id.split(ngReasonsSlice);
                id = elem[0];
                if(isRejectAccountById(id)){
                    removeRejectAccountById(id);
                }
                if(!isAcceptAccountById(id)){
                    addAcceptAccountById(id);
                    added.add(id);
                }else{
                    alreadyAdded.add(id);
                }
            }
            noRejectLog = 0;
            var text = [];
            if(added.size >= 1){
                for(id of added){
                    if(text.length != 0){
                        text += ", ";
                    }
                    if(text.length >= alertTextMaxLength){
                        text += '...';
                        break;
                    }
                    text += id;
                }
                saveAcceptAccountList();
                if(text.length >= alertTextMaxLength){
                    alert('OKリストに ' + added.size + '件のデータ \"' + text + '\" を追加しました。');
                }else{
                    alert('OKリストに \"' + text + '\" を追加しました。');
                }

            }else{
                for(id of alreadyAdded){
                    if(text.length != 0){
                        text += ", ";
                    }
                    if(text.length >= alertTextMaxLength){
                        text += '...';
                        break;
                    }
                    text += id;
                }
                alert('\"' + text + '\" は既にOKリストに追加されています。');
            }
        }
    }
    GM_registerMenuCommand("リストから削除", ()=>removeRejectIdCommand());
    function removeRejectIdCommand(){
        var ids = window.prompt('リストから削除するIDを入力してください');
        if(ids == null){
            alert('キャンセルされました。');
        }else{
            var removed = new Set();
            var alreadyRemoved = new Set();
            var id = "";
            var elem = [];
            var text = [];
            //専用コマンドここから
            ids = ids.replace(/＠/g, '@');

            if(ids=="@@ALL"){
                //すべて削除
                let ngList = [];
                for(id of ngUsersRemoved){
                    ngList.push(id);
                }
                for(id of ngUsers){
                    ngList.push(id);
                }
                ids = ngList.join('\n');
            }else if(ids=="@@OKALL"){
                //すべて削除
                let ngList = [];
                for(id of okUsers){
                    ngList.push(id);
                }
                ids = ngList.join('\n');
            }else if(ids=="@@THIS"){
                var urls = location.pathname.split('/');
                //console.log(urls);
                if(urls[2]!=null && (urls[2]=="status"||urls[2]=="with_replies"||urls[2]=="media"||urls[2]=="likes"||urls[2]=="")){
                    ids = urls[1];
                }else if(urls[1]!=null && (urls[2]==null)){
                    ids = urls[1];
                }else{
                    alert("このページではコマンドを実行できません。");
                    return;
                }
            }else if(ids=="@@RECENT"){
                ids = "";
                var cnt = 0;
                if(ngUsers.size == 0){
                    alert('対象のデータが存在しません。');
                    return;
                }
                for(id of ngUsers){
                    if(cnt>=1) ids += "\n";
                    ids += id;
                    cnt++;
                }
            }else if(ids.substr(0,2)=="@@"){
                alert("コマンド \"" + ids + "\" は存在しません。");
                return;
            }//専用コマンドここまで
            if(ids.substr(0,2)=="@@") return;//コマンドをユーザー名扱いしない

            let idsSplit = ids.split('\n');
            if(idsSplit.length > maxRejectLogConsole){
                noRejectLog = 1;
            }
            for(id of idsSplit){
                id = id.replace(/\r/g, '');

                if(id.substr(0,1) != '@'){
                    id = '@' + id;
                }
                elem = id.split(ngReasonsSlice);
                id = elem[0];
                if(ngUsers.has(id) || ngUsersRemoved.has(id)){
                    removeRejectAccountById(id);
                    removed.add(id);
                    delete ngReasons[id];
                    //alert('ユーザー \"' + id + '\" を削除しました。');
                }else if(okUsers.has(id)){
                    removeAcceptAccountById(id);
                    removed.add(id);
                }else{
                    alreadyRemoved.add(id);
                    //alert('ユーザー \"' + id + '\" はリストに存在しません。');
                }
                removeRejectCSS(id);
                tweetRejectToAccept(id);
            }
            noRejectLog = 0;
            if(removed.size >= 1){
                for(id of removed){
                    if(text.length != 0){
                        text += ", ";
                    }
                    if(text.length >= alertTextMaxLength){
                        text += '...';
                        break;
                    }
                    text += id;
                }
                saveRejectAccountList();
                saveAcceptAccountList();
                if(text.length >= alertTextMaxLength){
                    alert('リストから ' + removed.size + '件のデータ \"' + text + '\" を削除しました。');
                }else{
                    alert('リストから \"' + text + '\" を削除しました。');
                }
            }else{
                for(id of alreadyRemoved){
                    if(text.length != 0){
                        text += ", ";
                    }
                    if(text.length >= alertTextMaxLength){
                        text += '...';
                        break;
                    }
                    text += id;
                }
                alert('\"' + text + '\" はリストに存在しません。');
            }
        }
    }
    //NGリストのソート(最終検出時刻の昇順)
    function ngUsersSort(){
        var ngSortTarget = [];
        for(let id of ngUsersRemoved){
            let sortDat = "\t" + id;
            if(id in ngReasons){
                let reason = ngReasons[id];
                if(reason[4] != null){
                    sortDat = Date.parse(reason[4]) + sortDat;
                }
            }
            ngSortTarget.push(sortDat);
        }
        for(let id of ngUsers){
            let sortDat = "\t" + id;
            if(id in ngReasons){
                let reason = ngReasons[id];
                if(reason[4] != null){
                    sortDat = Date.parse(reason[4]) + sortDat;
                }
            }
            ngSortTarget.push(sortDat);
        }
        ngSortTarget.sort();
        ngUsersRemoved.clear();
        ngUsers.clear();
        //console.log(ngSortTarget);
        for(let d of ngSortTarget){
            let v = d.split('\t');
            if(v[1] != null){
                ngUsersRemoved.add(v[1]);
            }
        }
    }
})(jQuery);
