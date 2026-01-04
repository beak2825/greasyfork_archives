// ==UserScript==
// @name               edewakaru-enhanced
// @name:en            Edewakaru Enhanced Reading Experience
// @name:ja            「絵でわかる日本語」 閲覧体験強化
// @name:zh-CN         「絵でわかる日本語」 阅读体验增强
// @name:zh-TW         「絵でわかる日本語」 閱讀體驗增強
// @namespace          https://greasyfork.org/users/49949-ipumpkin
// @version            2025.11.26
// @author             iPumpkin
// @description:en     Enhances reading experience on the 「絵でわかる日本語 edewakaru.com」 site by converting kanji readings from parentheses to ruby, hiding ads and clutter, and adding text-to-speech for selected text.
// @description:ja     「絵でわかる日本語 edewakaru.com」サイト内の漢字の読みを括弧表記から自動で振り仮名に変換し、広告や不要な要素を非表示にします。選択テキストの読み上げ機能にも対応し、快適な読書体験を実現します。
// @description:zh-CN  将「絵でわかる日本語 edewakaru.com」网站中的单词注音由括号形式自动转换为振假名，隐藏广告和无关元素，并支持划词朗读功能，提升阅读体验。
// @description:zh-TW  將「絵でわかる日本語 edewakaru.com」網站中的單詞注音由括號形式自動轉換為振假名，隱藏廣告與無關元素，並支援劃詞朗讀功能，提升閱讀體驗。
// @license            GPL-3.0
// @icon               https://livedoor.blogimg.jp/edewakaru/imgs/8/c/8cdb7924.png
// @match              https://www.edewakaru.com/*
// @match              https://edewakaru-doshi.blog.jp/*
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @run-at             document-start
// @description Enhances reading experience on the "絵でわかる日本語" site by converting kanji readings from parentheses to ruby, hiding ads and clutter, and adding text-to-speech for selected text.
// @downloadURL https://update.greasyfork.org/scripts/542386/edewakaru-enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/542386/edewakaru-enhanced.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const RULES = {
    TEXT: {
      AUTO: ['℃（ど）', 'お団子（おだんご）', 'お好み焼き（おこのみやき）', 'お年寄り（おとしより）', 'お店（おみせや）', 'お茶する（おちゃする）', 'お茶（おちゃ）', 'お酒（おさけ）', 'ご先祖さま（ごせんぞさま）', 'たつ年（たつどし）', 'グリーン車（グリーンしゃ）', 'コマ回し（こままわし）', 'ダメ元（だめもと）', '一つ（ひとつ）', '万引き（まんびき）', '三分の一（さんぶんのいち）', '不確か（ふたしか）', '不足（ふそく）', '不足（ぶそく）', '世界１周旅行（せかいいっしゅうりょこう）', '並み（なみ）', '並（なら）', '中に（じゅうに）', '中旬（ちゅうじゅん）', '中（じゅう）', '乗り心地（のりごこち）', '予定通り（よていどおり）', '以上（いじょう）', '以下（いか）', '以外の何ものでもない（いがいのなにものでもない）', '以外（いがい）', '住（す）', '使い分け（つかいわけ）', '使い方（つかいかた）', '使用（しよう）', '働（はたら）', '優（すぐ）', '元を取る（もとをとる）', '元カノ（もとかの）', '元カレ（もとかれ）', '児（じ）', '入学（にゅうがく）', '入（い）', '入（はい）', '全て（すべて）', '全員（ぜんいん）', '公共の場（こうきょうのば）', '凧揚げ（たこあげ）', '出張（しゅっちょう）', '分（ぶん）', '前後（ぜんご）', '前（まえ）', '割り勘（わりかん）', '割り箸（わりばし）', '動作（どうさ）', '収集（しゅうしゅう）', '取（と）', '受け身（うけみ）', '口の中（くちのなか）', '合（あ）', '同（おな）', '吐き気（はきけ）', '向（む）', '吸い物（すいもの）', '味覚 （みかく）', '呼び方（よびかた）', '唐揚げ（からあげ）', '商い（あきない）', '商品（しょうひん）', '土砂崩れ（どしゃくずれ）', '夏バテ防止（なつばてぼうし）', '夏休み中（なつやすみちゅう）', '夏向き（なつむき）', '夏祭り（なつまつり）', '夕ご飯（ゆうごはん）', '多かれ少なかれ（おおかれすくなかれ）', '大きかれ小さかれ（おおきかれちいさかれ）', '大切（たいせつ）', '大好き（だいすき）', '学習者（がくしゅうしゃ）', '宝くじ（たからくじ）', '寝る前（ねるまえ）', '寝（ね）', '届け出（とどけで）', '座り心地（すわりごこち）', '引っ越し（ひっこし）', '引っ越す（ひっこす）', '当たり前（あたりまえ）', '当（あ）', '役に立つ（やくにたつ）', '待（ま）', '後ろ（うしろ）', '必要（ひつよう）', '怒り（いかり）', '思い出す（おもいだす）', '思い出話（おもいでばなし）', '恵方巻き（えほうまき）', '悩み事（なやみごと）', '感じ方（かんじかた）', '我が社（わがしゃ）', '戦（せん）', '手作り（てづくり）', '払（はら）', '折があれば（おりがあれば）', '折に触れて（おりにふれて）', '折も折（おりもおり）', '折を見て（おりをみて）', '拭き取る（ふきとる）', '持ち家（もちいえ）', '掲載（けいさい）', '数え方（かぞえかた）', '文化（ぶんか）', '文法（ぶんぽう）', '旅行（りょこう）', '日記（にっき）', '早寝早起き（はやねはやおき）', '星の数ほどある（ほしのかずほどある）', '星の数ほどいる（ほしのかずほどいる）', '星の数（ほしのかず）', '昭和の日（しょうわのひ）', '暑（あつ）', '暮（ぐ）', '書き言葉（かきことば）', '有名（ゆうめい）', '梅雨入り（つゆいり）', '楽（たの）', '欠席（けっせき）', '歩（ある）', '残業（ざんぎょう）', '気を付けて（きをつけて）', '気持ち（きもち）', '注目（ちゅうもく）', '物語（ものがたり）', '独り言（ひとりごと）', '瓜二つ（うりふたつ）', '甘い物（あまいもの）', '申し出（もうしで）', '申し訳（もうしわけ）', '男の子（おとこのこ）', '盗み食い（ぬすみぐい）', '目を離す（めをはなす）', '真っ暗（まっくら）', '真っ白（まっしろ）', '真っ茶色（まっちゃいろ）', '真っ黄色（まっきいろ）', '真っ黒（まっくろ）', '真ん中（まんなか）', '知り合い（しりあい）', '確か（たしか）', '社会（しゃかい）', '福笑い（ふくわらい）', '秋無い（あきない）', '程（ほど）', '空き缶（あきかん）', '窓の外（まどのそと）', '立ち読み（たちよみ）', '第２日曜日（だいににちようび）', '第２月曜日（だいにげつようび）', '笹の葉（ささのは）', '範囲（はんい）', '細長い（ほそながい）', '紹介（しょうかい）', '組み合わせ（くみあわせ）', '経（た）', '結婚（けっこん）', '繰り返して（くりかえして）', '繰（く）', '羽根つき（はねつき）', '考え方（かんがえかた）', '能力試験（のうりょくしけん）', '腹が立つ（はらがたつ）', '自身（じしん）', '良かれ悪しかれ（よかれあしかれ）', '芸術の秋（げいじゅつのあき）', '落ち着（おちつ）', '行き方（いきかた）', '行き渡る（いきわたる）', '観光地（かんこうち）', '触り心地（さわりごこち）', '試験（しけん）', '試（ため）', '話し手（はなして）', '話し言葉（はなしことば）', '詳（くわ）', '読み方（よみかた）', '読書の秋（どくしょのあき）', '請け合い（うけあい）', '豪雨（ごうう）', '貯金（ちょきん）', '貯（た）', '買い物（かいもの）', '貸し借り（かしかり）', '足が早い（あしがはやい）', '車内（しゃない）', '載（の）', '返（かえ）', '逃（に）', '通り（とおり）', '通り（どおり）', '通知（つうち）', '通（どお）', '連続（れんぞく）', '遅かれ早かれ（おそかれはやかれ）', '遅刻（ちこく）', '長い間（ながいあいだ）', '長生き（ながいき）', '長（なが）', '間違え（まちがえ）', '間（かん）', '雨の日（あめのひ）', '雪遊び（ゆきあそび）', '震える（ふるえる）', '青い色（あおいいろ）', '青のり（あおのり）', '青リンゴ（あおりんご）', '頭の中（あたまのなか）', '願い事（ねがいごと）', '食べず嫌い（たべずぎらい）', '食べ物（たべもの）', '食欲の秋（しょくよくのあき）', '食（しょく）', '飲み会（のみかい）', '飲み口（のみぐち）', '飲み放題（のみほうだい）', '飲み物（のみもの）', '飼い主（かいぬし）', '飽きない（あきない）', '駅（えき）', '驚き（おどろき）', '髪の毛（かみのけ）', '鳴き声（なきごえ）', '０点（れいてん）', '１か月間（いっかげつかん）', '１か月（いっかげつ）', '１つ（ひとつ）', '１人（ひとり）', '１列（いちれつ）', '１口（ひとくち）', '１回（いっかい）', '１年中（いちねんじゅう）', '１年（いちねん）', '１度（いちど）', '１日中（いちにちじゅう）', '１日（いちにち）', '１日（ついたち）', '１本（いっぽん）', '１杯（いっぱい）', '１歩（いっぽ）', '１泊（いっぱく）', '１番目（いちばんめ）', '１番（いちばん）', '１週間後（いっしゅうかんご）', '１０日間（とおかかん）', '１０日（とおか）', '１０杯（じゅっぱい）', '２人（ふたり）', '２日間（ふつかかん）', '２日（ふつか）', '２本（にほん）', '２０歳（はたち）', '３日間（みっかかん）', '３日（みっか）', '３杯（さんばい）', '５分（ごふん）', '５日分（いつかぶん）', '５日前（いつかまえ）', '５日間（いつかかん）', '５月（ごがつ）', '７日（なのか）', '７時（しちじ）', '９月（くがつ）'],
      OVERRIDE: [
        { pattern: '羽根を伸ばす（羽根を伸ばす）', replacement: '羽根を伸ばす（はねをのばす）' },
        { pattern: '長蛇の列（長蛇の列）', replacement: '長蛇の列（ちょうだのれつ）' },
        { pattern: '食べ物（食べ物）', replacement: '食べ物（たべもの）' },
        { pattern: '今回（今回）', replacement: '今回（こんかい）' },
        { pattern: '店長（店長）', replacement: '店長（てんちょう）' },
        { pattern: '一般的（いっぱん）', replacement: '一般的（いっぱんてき）' },
        { pattern: '付き合（つきあい）', replacement: '付き合（つきあ）' },
        { pattern: '汚（きたない）', replacement: '汚（きたな）' },
        { pattern: '必ず（かなら）', replacement: '必ず（かならず）' },
        { pattern: '恥（はず）', replacement: '恥（は）' },
        { pattern: '足（たり）', replacement: '足（た）' },
        { pattern: '楽（他の）', replacement: '楽（たの）' },
        { pattern: '読（よん）', replacement: '読（よ）' },
        { pattern: '調（しらべた）', replacement: '調（しら）' },
        { pattern: '間違（街が）', replacement: '間違（まちが）' },
        { pattern: '間違（まちがえ）', replacement: '間違（まちが）' },
        { pattern: '難（むず）', replacement: '難（むずか）' },
        { pattern: '寂（さみ）', replacement: '寂（さび）' },
        { pattern: '彼氏（かれ）', replacement: '彼氏（かれし）' },
        { pattern: '曲（まが）', replacement: '曲（ま）' },
        { pattern: '父（とうさん）', replacement: '父（とう）' },
        { pattern: '特別（とく） ', replacement: '特別（とくべつ）' },
        { pattern: '不合格（ふごくかく）', replacement: '不合格（ふごうかく）' },
        { pattern: '違（ちがう）', replacement: '違（ちが）' },
        { pattern: '連（つれ）', replacement: '連（つ）' },
        { pattern: '逆ギレ（ぎゃくぎれ）', replacement: '逆（ぎゃく）ギレ' },
        { pattern: '娘（ムスメ）', replacement: '娘（むすめ）' },
        { pattern: '車（クルマ）', replacement: '車（くるま）' },
        { pattern: 'm（めーとる）', replacement: 'm（メートル）' },
        { pattern: 'L（L）', replacement: 'L（エル）' },
        { pattern: 'XL（エックスL）', replacement: 'XL（エックスエル）' },
        { pattern: 'Yシャツ（ワイシャツ）', replacement: 'Y（ワイ）シャツ' },
        { pattern: 'Yシャツ（わいしゃつ）', replacement: 'Y（ワイ）シャツ' },
        { pattern: 'のる（乗る）', replacement: '乗る（のる）' },
        { pattern: 'ところ（所）', replacement: '所（ところ）' },
        { pattern: 'いいふうふ（いい夫婦）', replacement: 'いい夫婦（いいふうふ）' },
        { pattern: '耳が痛い（みみがいたい）', replacement: '耳（みみ）が痛（いた）い' },
        { pattern: 'マイ〇〇（my+〇〇）', replacement: 'マイ（my）〇〇' },
        { pattern: '目に余る②（めにあまる）', replacement: '目に余る（めにあまる）②' },
        { pattern: '何のこと？（なんのこと）', replacement: '何のこと（なんのこと）？' },
        { pattern: '冷める（さめる・自動詞）', replacement: '冷める（さめる）（自動詞）' },
        { pattern: '冷ます（さます・他動詞）', replacement: '冷ます（さます）（他動詞）' },
        { pattern: '聞き手（ききて）', replacement: '聞（き）き手（て）' },
        { pattern: '言い方（いいかた）', replacement: '言（い）い方（かた）' },
        { pattern: '言い訳（いいわけ）', replacement: '言（い）い訳（わけ）' },
        { pattern: '年越しそば（としこしそば）', replacement: '年越（としこ）しそば' },
        { pattern: '顔から火が出る（かおからひがでる）', replacement: '顔（かお）から火（ひ）が出（で）る' },
        { pattern: '頭が痛い（あたまがいたい）', replacement: '頭（あたま）が痛（いた）い' },
        { pattern: '歯が立たない（はがたたない）', replacement: '歯（は）が立（た）たない' },
        { pattern: '色違い（いろちがい）', replacement: '色（いろ）違（ちが）い' },
        { pattern: '原因・理由（げんいん・りゆう）', replacement: '原因（げんいん）・理由（りゆう）' },
        { pattern: '目の色が変わる・目の色を変える（めのいろがかわる・かえる）', replacement: '目の色が変わる（めのいろがかわる）・目の色を変える（めのいろをかえる）' },
        { pattern: '青菜・青野菜（あおな・あおやさい）', replacement: '青菜（あおな）・青野菜（あおやさい）' },
        { pattern: '水の泡になる・水の泡となる（みずのあわになる）', replacement: '水の泡になる（みずのあわになる）・水の泡となる（みずのあわとなる）' },
        { pattern: '意味で（いみ）', replacement: '意味（いみ）で' },
        { pattern: '和製英語で（わせいえいご）', replacement: '和製英語（わせいえいご）で' },
        { pattern: '財布を（さいふ）', replacement: '財布（さいふ）を' },
        { pattern: 'ソーシャル・ネットワーキング・サービス（Social Networking Service）', replacement: 'ソーシャル（Social）・ネットワーキング（Networking）・サービス（Service）' },
        { pattern: 'サボ（さぼ）って', replacement: '<em><ruby>サボ<rt>さぼ</rt></ruby>って</em>' },
        { pattern: '何（なに・なん）', replacement: '<ruby>何<rt>なに・なん</rt></ruby>' },
        { pattern: '何って人（なんって人）', replacement: '何（なん）って人' },
        { pattern: '何て人 （なんて人）', replacement: '何（なん）て人' },
        { pattern: 'お言葉に甘えて〜する（おことばにあまえて〜する）', replacement: 'お言葉（ことば）に甘（あま）えて〜する' },
      ],
    },
    HTML: {
      AUTO: ['エアーコンディショナー（?air conditioner）', 'マフラー（muffler?）', '不満?（ふまん）', '並外れた?（なみはずれた）', '乳離れ?（ちばなれ）', '今?（いま）', '仕事上?（しごとじょう）', '何かにつけ?（なにかにつけ）', '作りがい?（つくりがい）', '健康上?（けんこうじょう）', '全然?（ぜんぜん）', '勉強中?（べんきょうちゅう）', '厚み?（あつみ）', '場合?（ばあい）', '失望?（しつぼう）', '子離れ?（こばなれ）', '子（こ?）', '安全上?（あんぜんじょう）', '家並み?（いえなみ）', '居?（い）', '巣離れ?（すばなれ）', '希望する?（きぼうする）', '引くに引けない?（ひくにひけない）', '弱み?（よわみ）', '強み?（つよみ）', '当然?（とうぜん）', '後?（うし）', '憐れみ?（あわれみ）', '戸?（と）', '扉?（とびら）', '教えがい?（おしえがい）', '教育上?（きょういくじょう）', '数年?（すうねん）', '数日間?（すうじつかん）', '時?（とき）', '最中?（さいちゅう）', '望む?（のぞむ）', '期待する?（きたいする）', '次第?（しだい）', '歌手?（かしゅ）', '歴史上?（れきしじょう）', '法律上?（ほうりつじょう）', '泣くに泣けない?（なくになけない）', '深み?（ふかみ）', '犬?年（いぬどし）', '状態?（じょうたい）', '甘み?（あまみ）', '生きがい?（いきがい）', '留守?（るす）', '痛み?（いたみ）', '的?（てき）', '直前?（ちょくぜん）', '直後?（ちょくご）', '真っ赤（まっ?か）', '真っ青（まっ?さお）', '立場上?（たちばじょう）', '経験上?（けいけんじょう）', '絶対?（ぜったい）', '育てがい?（そだてがい）', '苦しみ?（くるしみ）', '苦み?（にがみ）', '親離れ?（おやばなれ）', '言うに言えない?（いうにいえない）', '言葉?（ことば）', '赤み?（あかみ）', '軒並み?（のきなみ）', '軽蔑?（けいべつ）', '辛み?（からみ）', '週間?（しゅうかん）', '運動?（うんどう）', '電話中?（でんわちゅう）', '青み?（あおみ）', '非難?（ひなん）', '面白み?（おもしろみ）'],
      OVERRIDE: [
        { pattern: '復習（ふくしゅう<br>）', replacement: '復習（ふくしゅう）' },
        { pattern: '一瞬（いっしゅん<br>）', replacement: '一瞬（いっしゅん）' },
        { pattern: '<b style="background-color: rgb(255, 255, 0);">２</b>日（ふつか）', replacement: '<b style="background-color: rgb(255, 255, 0);">２（ふつ）</b>日（か）' },
        { pattern: '<b>１</b>日（いちにち）', replacement: '<b style="background-color: rgb(255, 255, 0);">１（いち）</b>日（にち）' },
        { pattern: '<b>３日</b></span><b>（</b>みっか）', replacement: '<b>３日（みっか）</b></span>' },
        { pattern: '既読スルー</b></span>（きどくするー）', replacement: '既読スルー（きどくスルー）</b></span>' },
        { pattern: '何事につけ</b></span>（なにごとにつけ）', replacement: '何事（なにごと）につけ</b></span>' },
        { pattern: '<span style="color: rgb(255, 0, 0);"><b>上</b></span>（しごとじょう）', replacement: '（しごと）<em>上（じょう）</em>' },
        { pattern: '<b><span style="color: rgb(255, 0, 0);">上</span></b>（きょういくじょう）', replacement: '（きょういく）<em>上（じょう）</em>' },
        { pattern: '<span style="color: rgb(255, 0, 0);"><b>上</b></span>（れきしじょう）', replacement: '（れきし）<em>上（じょう）</em>' },
        { pattern: '<b><span style="color: rgb(255, 0, 0);">上</span></b>（けんこうじょう）', replacement: '（けんこう）<em>上（じょう）</em>' },
        { pattern: '<span style="color: rgb(255, 0, 0);"><b>上</b></span>（たちばじょう）', replacement: '（たちば）<em>上（じょう）</em>' },
        { pattern: '<span style="color: rgb(255, 0, 0);"><b>上</b></span>（ほうりつじょう）', replacement: '（ほうりつ）<em>上（じょう）</em>' },
        { pattern: '<span style="color: rgb(255, 0, 0);"><b>上</b></span>（けいけんじょう）', replacement: '（けいけん）<em>上（じょう）</em>' },
        { pattern: '<span style="color: rgb(255, 0, 0);"><b>上</b></span>（あんぜんじょう）', replacement: '（あんぜん）<em>上（じょう）</em>' },
        { pattern: '<span style="color: rgb(255, 0, 0);"><b>中</b></span><b><span style="color: rgb(255, 0, 0);">（きょうじゅう）に</span></b>', replacement: '（きょう）<em>中（じゅう）に</em>' },
        { pattern: '<b><span style="color: rgb(255, 0, 0);">中（あすじゅう）に</span></b>', replacement: '（あす）<em>中（じゅう）に</em>' },
        { pattern: '<b><span style="color: rgb(255, 0, 0);">中（ことしじゅう）に</span></b>', replacement: '（ことし）<em>中（じゅう）に</em>' },
        { pattern: '<b><span style="color: rgb(255, 0, 0);">中（かいしゃじゅう）に</span></b>', replacement: '（かいしゃ）<em>中（じゅう）に</em>' },
        { pattern: '真っ赤（まっ<span style="background-color: rgb(204, 204, 204);"><span style="color: rgb(255, 0, 0);">か</span></span>）', replacement: '真（ま）っ<em style="background-color: rgb(204, 204, 204);">赤（か）</em>' },
        { pattern: '真っ青（まっ<span style="background-color: rgb(204, 204, 204);"><span style="color: rgb(255, 0, 0);">さお</span></span>）', replacement: '真（ま）っ<em style="background-color: rgb(204, 204, 204);">青（さお）</em>' },
        { pattern: '<span style="font-size: 125%;">パト</span>ロール<span style="font-size: 125%;">カー</span>(patrol car)', replacement: '<span style="font-size: 125%;">パト(patrol)</span>ロール<span style="font-size: 125%;">カー(car)</span>' },
        { pattern: '白い（<span style="background-color: rgb(204, 204, 204);">しろ</span>い）', replacement: '<span style="background-color: rgb(204, 204, 204);">白（しろ）</span>い' },
        { pattern: '素人（<span style="background-color: rgb(204, 204, 204);">しろ</span>うと）', replacement: '<span style="background-color: rgb(204, 204, 204);">素（しろ）</span>うと' },
        { pattern: '毎</b></span>日（まいにち）', replacement: '毎（まい）</b></span>日（にち）' },
        { pattern: '毎</b></span>週（まいしゅう）', replacement: '毎（まい）</b></span>週（しゅう）' },
        { pattern: '毎</b></span>月（まいつき）', replacement: '毎（まい）</b></span>月（つき）' },
        { pattern: '毎</span></b>年（まいとし）', replacement: '毎（まい）</span></b>年（とし）' },
        { pattern: '何皿<b><span style="color: rgb(255, 0, 0);">目</span></b>（なんさらめ）', replacement: '何皿（なんさら）<em>目（め）</em>' },
        { pattern: '３つ<b><span style="color: rgb(255, 0, 0);">目</span></b>（みっつめ）', replacement: '３つ（みっつ）<em>目（め）</em>' },
        { pattern: '１０日<b><span style="color: rgb(255, 0, 0);">目</span></b>（とおかめ）', replacement: '１０日（とおか）<em>目（め）</em>' },
      ],
    },
    EXCLUDE: {
      STRINGS: new Set(['元気（な）', '円（だ）', '挙句（に）', '矢先（に）', '際（に）', '末（に）', '以上（は）', '人称（あなた）', '二人称（あなた）', '女性（おばあちゃん）']),
      PARTICLES: new Set(['を']),
    },
  }
  function mitt(n) {
    return {
      all: (n = n || new Map()),
      on: function (t, e) {
        var i = n.get(t)
        i ? i.push(e) : n.set(t, [e])
      },
      off: function (t, e) {
        var i = n.get(t)
        i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []))
      },
      emit: function (t, e) {
        var i = n.get(t)
        ;(i &&
          i.slice().map(function (n2) {
            n2(e)
          }),
          (i = n.get('*')) &&
            i.slice().map(function (n2) {
              n2(t, e)
            }))
      },
    }
  }
  const emitter = mitt()
  const ContextMenu = {
    _config: {
      MODULE_ENABLED: true,
      MENU_ID: 'selection-context-menu',
      MENU_OFFSET: 8,
      VALID_SELECTION_AREA: '.article-body-inner',
      MIN_SELECTION_LENGTH: 1,
      DRAG_THRESHOLD: 5,
      EMOJI_REGEX: /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      STYLES: `
      #selection-context-menu { position: absolute; top: 0; left: 0; display: none; z-index: 9999; opacity: 0; user-select: none; will-change: transform, opacity; pointer-events: none; }
      #selection-context-menu.visible { opacity: 0.9; pointer-events: auto; transition: opacity 0.1s ease-out, transform 0.1s ease-out; }
      #selection-context-menu button { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; border-radius: 50%; cursor: pointer; border: none; background-color: #3B82F6; color: #FFFFFF; box-shadow: 0 5px 15px rgba(0,0,0,0.15), 0 2px 5px rgba(0,0,0,0.1); transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out; outline: none; }
      #selection-context-menu button:hover { background-color: #4B90F8; transform: scale(1.05); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); }
      #selection-context-menu button.is-dragging { cursor: grabbing; transform: scale(1); opacity: 0.7; transition: none; }
      #selection-context-menu button svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 2; pointer-events: none; }
    `,
    },
    menuElement: null,
    isDragging: false,
    dragUpdatePending: false,
    position: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
    dragStart: { x: 0, y: 0 },
    abortController: null,
    boundHandlers: {
      dragMove: null,
      dragEnd: null,
    },
    validAreasCache: null,
    isSelecting: false,
    init(options = {}) {
      if (!this._config.MODULE_ENABLED) return
      if (this.menuElement) return
      Object.assign(this._config, options)
      GM_addStyle(this._config.STYLES)
      this._createMenu()
      this._initValidAreasCache()
      this._bindEvents()
    },
    destroy() {
      if (!this.menuElement) return
      this.abortController?.abort()
      if (this.boundHandlers.dragMove) document.removeEventListener('mousemove', this.boundHandlers.dragMove)
      if (this.boundHandlers.dragEnd) document.removeEventListener('mouseup', this.boundHandlers.dragEnd)
      this.menuElement.remove()
      this._resetState()
    },
    _resetState() {
      this.menuElement = null
      this.isDragging = false
      this.dragUpdatePending = false
      this.position = { x: 0, y: 0 }
      this.dragOffset = { x: 0, y: 0 }
      this.dragStart = { x: 0, y: 0 }
      this.abortController = null
      this.boundHandlers = {
        dragMove: null,
        dragEnd: null,
      }
      this.validAreasCache = null
      this.isSelecting = false
    },
    _createMenu() {
      if (document.getElementById(this._config.MENU_ID)) return
      this.menuElement = document.createElement('div')
      this.menuElement.id = this._config.MENU_ID
      const readButton = document.createElement('button')
      readButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
      readButton.addEventListener('click', (event) => {
        if (this.isDragging) {
          event.stopPropagation()
          return
        }
        const cleanedText = this._getCleanedSelectedText()
        if (cleanedText) {
          emitter.emit('tts:speak', { text: cleanedText, voice: '' })
        }
      })
      this.menuElement.appendChild(readButton)
      document.body.appendChild(this.menuElement)
    },
    _initValidAreasCache() {
      this.validAreasCache = document.querySelectorAll(this._config.VALID_SELECTION_AREA)
    },
    _bindEvents() {
      this.abortController = new AbortController()
      const { signal } = this.abortController
      this.menuElement.addEventListener('mousedown', this._handleDragStart.bind(this), { signal })
      document.addEventListener('mousedown', this._handleMouseDown.bind(this), { signal })
      document.addEventListener('mousemove', this._handleMouseMove.bind(this), { signal, passive: true })
      document.addEventListener('mouseup', this._handleMouseUp.bind(this), { signal })
      document.addEventListener('keydown', this._handleKeyDown.bind(this), { signal })
      this.boundHandlers.dragMove = this._handleDragMove.bind(this)
      this.boundHandlers.dragEnd = this._handleDragEnd.bind(this)
    },
    _showMenu(x, y) {
      if (!this.menuElement) return
      this.position.x = x + this._config.MENU_OFFSET
      this.position.y = y + this._config.MENU_OFFSET
      this.menuElement.style.transition = 'none'
      this.menuElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`
      this.menuElement.style.display = 'block'
      requestAnimationFrame(() => {
        this.menuElement.style.transition = ''
        this.menuElement.classList.add('visible')
      })
    },
    _hideMenu() {
      if (!this.menuElement || !this.menuElement.classList.contains('visible')) return
      this.menuElement.classList.remove('visible')
      this.menuElement.style.display = 'none'
    },
    _getCleanedSelectedText() {
      try {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) return ''
        const range = selection.getRangeAt(0)
        const fragment = range.cloneContents()
        const tempDiv = document.createElement('div')
        tempDiv.appendChild(fragment)
        const cleanupTasks = [() => tempDiv.querySelectorAll('rt').forEach((el) => el.remove()), () => tempDiv.querySelectorAll('br').forEach((el) => el.replaceWith('。'))]
        cleanupTasks.forEach((task) => task())
        let text = tempDiv.textContent || ''
        text = text.replace(this._config.EMOJI_REGEX, '。')
        text = text.replace(/\s+/g, '')
        return text
      } catch (error) {
        return ''
      }
    },
    _isSelectionIntersectingValidArea(selection) {
      try {
        if (!selection || selection.rangeCount === 0 || !this.validAreasCache?.length) {
          return false
        }
        const range = selection.getRangeAt(0)
        return Array.from(this.validAreasCache).some((area) => range.intersectsNode(area))
      } catch (error) {
        return false
      }
    },
    _isEventFromSettingsPanel(event) {
      return !!event.target.closest('#settings-panel')
    },
    _handleMouseDown(event) {
      if (this._isEventFromSettingsPanel(event)) return
      this.dragStart = { x: event.pageX, y: event.pageY }
      this.isSelecting = false
      if (this.menuElement?.contains(event.target)) return
      this._hideMenu()
    },
    _handleMouseMove(event) {
      if (this._isEventFromSettingsPanel(event)) return
      if (!(event.buttons & 1)) return
      const dx = event.pageX - this.dragStart.x
      const dy = event.pageY - this.dragStart.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance > this._config.DRAG_THRESHOLD) {
        this.isSelecting = true
      }
    },
    _handleMouseUp(event) {
      if (this._isEventFromSettingsPanel(event)) return
      if (this.isDragging || this.menuElement?.contains(event.target)) return
      requestAnimationFrame(() => {
        const selection = window.getSelection()
        if (!selection) return
        const selectedText = selection.toString().trim()
        if (!selectedText || selectedText.length < this._config.MIN_SELECTION_LENGTH) return
        if (this.isSelecting && selection.type === 'Range' && this._isSelectionIntersectingValidArea(selection)) {
          this._showMenu(event.pageX, event.pageY)
        }
        this.isSelecting = false
      })
    },
    _handleKeyDown(event) {
      if (event.key === 'Escape' && this.menuElement && this.menuElement.classList.contains('visible')) {
        this._hideMenu()
      }
    },
    _handleDragStart(event) {
      event.preventDefault()
      event.stopPropagation()
      this.isDragging = false
      this.dragStart = { x: event.pageX, y: event.pageY }
      this.dragOffset = { x: event.pageX - this.position.x, y: event.pageY - this.position.y }
      this.menuElement.style.transition = 'none'
      document.addEventListener('mousemove', this.boundHandlers.dragMove)
      document.addEventListener('mouseup', this.boundHandlers.dragEnd, { once: true })
    },
    _handleDragMove(event) {
      event.preventDefault()
      if (this.dragUpdatePending) return
      this.dragUpdatePending = true
      if (!this.isDragging) {
        const dx = event.pageX - this.dragStart.x
        const dy = event.pageY - this.dragStart.y
        if (Math.sqrt(dx * dx + dy * dy) > this._config.DRAG_THRESHOLD) {
          this.isDragging = true
          this.menuElement.querySelector('button')?.classList.add('is-dragging')
        }
      }
      requestAnimationFrame(() => {
        if (this.isDragging) {
          this.position.x = event.pageX - this.dragOffset.x
          this.position.y = event.pageY - this.dragOffset.y
          this.menuElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`
        }
        this.dragUpdatePending = false
      })
    },
    _handleDragEnd() {
      document.removeEventListener('mousemove', this.boundHandlers.dragMove)
      this.menuElement.querySelector('button')?.classList.remove('is-dragging')
      this.menuElement.style.transition = ''
      setTimeout(() => {
        this.isDragging = false
      }, 0)
    },
  }
  const IframeLoader = {
    _config: {
      MODULE_ENABLED: true,
      IFRAME_LOAD_ENABLED: true,
      IFRAME_SELECTOR: 'iframe[src*="richlink.blogsys.jp"]',
      PLACEHOLDER_CLASS: 'iframe-placeholder',
      LOADING_CLASS: 'is-loading',
      CLICKABLE_CLASS: 'is-clickable',
      STYLES: `
      @keyframes iframe-spinner-rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .iframe-placeholder { position: relative; display: inline-block; vertical-align: top; background-color: #f9f9f9; box-sizing: border-box; margin: 8px 0; }
      .is-loading::after { opacity: 0.9; content: ''; position: absolute; top: 50%; left: 50%; width: 32px; height: 32px; margin-top: -16px; margin-left: -16px; border: 4px solid #ccc; border-top-color: #3B82F6; border-radius: 50%; animation: iframe-spinner-rotation 1s linear infinite; }
      .is-clickable { opacity: 0.9; display: inline-grid; place-items: center; color: #ccc !important; font-weight: bold; font-size: 16px; cursor: pointer; transition: background-color 0.2s, color 0.2s; -webkit-user-select: none; user-select: none; }
      .is-clickable:hover { opacity: 0.9; color: #3B82F6 !important; background-color: #f4f8ff; }
      @media screen and (max-width: 870px) { .iframe-placeholder { max-width: 350px !important; height: 105px !important; } }
      @media screen and (min-width: 871px) { .iframe-placeholder { max-width: 580px !important; height: 120px !important; } }
    `,
    },
    init(options = {}) {
      if (!this._config.MODULE_ENABLED) return
      Object.assign(this._config, options)
      GM_addStyle(this._config.STYLES)
    },
    replaceIframesInContainer(container) {
      if (!this._config.MODULE_ENABLED) return
      const iframes = container.querySelectorAll(this._config.IFRAME_SELECTOR)
      if (iframes.length === 0) return
      this._config.IFRAME_LOAD_ENABLED ? this._processForLazyLoad(iframes) : this._processForClickToLoad(iframes)
    },
    _processForLazyLoad(iframes) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const placeholder = entry.target
              const iframe = document.createElement('iframe')
              iframe.src = placeholder.dataset.src
              iframe.setAttribute('style', placeholder.dataset.style)
              iframe.setAttribute('frameborder', '0')
              iframe.setAttribute('scrolling', 'no')
              iframe.style.opacity = '0'
              iframe.addEventListener(
                'load',
                () => {
                  placeholder.classList.remove(this._config.LOADING_CLASS)
                  iframe.style.opacity = '1'
                },
                { once: true },
              )
              placeholder.appendChild(iframe)
              obs.unobserve(placeholder)
            }
          })
        },
        {
          rootMargin: '200px 0px',
        },
      )
      iframes.forEach((iframe) => {
        const placeholder = document.createElement('div')
        placeholder.className = `${this._config.PLACEHOLDER_CLASS} ${this._config.LOADING_CLASS}`
        const originalStyle = iframe.getAttribute('style') || ''
        placeholder.setAttribute('style', originalStyle)
        placeholder.dataset.src = iframe.src
        placeholder.dataset.style = originalStyle
        iframe.replaceWith(placeholder)
        observer.observe(placeholder)
      })
    },
    _processForClickToLoad(iframes) {
      iframes.forEach((iframe) => {
        if (iframe.parentElement.classList.contains(this._config.PLACEHOLDER_CLASS)) return
        const originalSrc = iframe.src
        const originalStyle = iframe.getAttribute('style') || ''
        const placeholder = document.createElement('div')
        placeholder.className = `${this._config.PLACEHOLDER_CLASS} ${this._config.CLICKABLE_CLASS}`
        placeholder.textContent = '▶ 関連記事を読み込む'
        placeholder.setAttribute('style', originalStyle)
        placeholder.addEventListener(
          'click',
          () => {
            const newIframe = document.createElement('iframe')
            newIframe.src = originalSrc
            newIframe.setAttribute('style', originalStyle)
            newIframe.setAttribute('frameborder', '0')
            newIframe.setAttribute('scrolling', 'no')
            const loadingWrapper = document.createElement('div')
            loadingWrapper.className = `${this._config.PLACEHOLDER_CLASS} ${this._config.LOADING_CLASS}`
            loadingWrapper.setAttribute('style', originalStyle)
            newIframe.style.opacity = '0'
            loadingWrapper.appendChild(newIframe)
            newIframe.addEventListener(
              'load',
              () => {
                loadingWrapper.classList.remove(this._config.LOADING_CLASS)
                newIframe.style.opacity = '1'
              },
              { once: true },
            )
            placeholder.replaceWith(loadingWrapper)
          },
          { once: true },
        )
        iframe.replaceWith(placeholder)
      })
    },
  }
  const ImageProcessor = {
    _config: {
      MODULE_ENABLED: true,
      IMG_SRC_REGEX: /(https:\/\/livedoor\.blogimg\.jp\/edewakaru\/imgs\/[a-z0-9]+\/[a-z0-9]+\/[a-z0-9]+)-s(\.jpg)/i,
    },
    process(container) {
      if (!this._config.MODULE_ENABLED) return
      container.querySelectorAll('a[href*="livedoor.blogimg.jp"]').forEach((link) => {
        const img = link.querySelector('img.pict')
        if (!img) return
        const newImg = document.createElement('img')
        newImg.loading = 'lazy'
        newImg.src = img.src.replace(this._config.IMG_SRC_REGEX, '$1$2')
        newImg.alt = (img.alt || '').replace(/blog/gi, '')
        Object.assign(newImg, {
          className: img.className,
          width: img.width,
          height: img.height,
        })
        link.replaceWith(newImg)
      })
    },
  }
  const PageOptimizer = {
    _config: {
      MODULE_ENABLED: true,
      GLOBAL_REMOVE_SELECTORS: ['header#blog-header', 'footer#blog-footer', '.ldb_menu', '#analyzer_tags', '#gdpr-banner', '.adsbygoogle', '#ad_rs', '#ad2', 'div[class^="fluct-unit"]', '.article-social-btn', 'iframe[src*="clap.blogcms.jp"]', '#article-options', 'a[href*="blogmura.com"]', 'a[href*="with2.net"]', 'div[id^="ldblog_related_articles_"]'],
      STYLES: `
      #container { width: 100%; }
      @media (min-width: 960px) { #container { max-width: 960px; } }
      @media (min-width: 1040px) { #container { max-width: 1040px; } }
      #content { display: flex; position: relative; padding: 50px 0 !important; }
      #main { flex: 1; float: none !important; width: 100% !important; }
      aside#sidebar { visibility: hidden; float: none !important; width: 350px !important; flex: 0 0 350px; }
      .plugin-categorize { position: fixed; height: 85vh; display: flex; flex-direction: column; padding: 0 !important; width: 350px !important; }
      .plugin-categorize .side { flex: 1; overflow-y: auto; max-height: unset; }
      .plugin-categorize .side > :not([hidden]) ~ :not([hidden]) { margin-top: 5px; margin-bottom: 0; }
      .article { padding: 0 0 20px 0 !important; margin-bottom: 30px !important; }
      .article-body { padding: 0 !important; }
      .article-pager { margin-bottom: 0 !important; }
      .article-body-inner { line-height: 2; opacity: 0; transition: opacity 0.3s; }
      .article-body-inner img.pict { margin: 0 !important; width: 80% !important; display: block; }
      .article-body-inner strike { color: orange !important; }
      .article-body-inner em { font-style: normal !important; font-weight: bold !important; color: red; }
      .to-pagetop { position: fixed; bottom: 19.2px; right: 220px; z-index: 9999; }
      rt, iframe, time, .pager, #sidebar { -webkit-user-select: none; user-select: none; }
      .article-body-inner:after, .article-meta:after, #container:after, #content:after, article:after, section:after, .cf:after { content: none !important; display: none !important; height: auto !important; visibility: visible !important; }
    `,
    },
    init() {
      if (!this._config.MODULE_ENABLED) return
      const antiFlickerCss = `${this._config.GLOBAL_REMOVE_SELECTORS.join(', ')} { display: none !important; }`
      GM_addStyle(antiFlickerCss)
      GM_addStyle(this._config.STYLES)
    },
    cleanupGlobalElements() {
      if (!this._config.MODULE_ENABLED) return
      document.querySelectorAll(this._config.GLOBAL_REMOVE_SELECTORS.join(',')).forEach((el) => el.remove())
      document.querySelectorAll('body script, body link, body style, body noscript').forEach((el) => el.remove())
    },
    cleanupArticleBody(container) {
      if (!this._config.MODULE_ENABLED) return
      this._trimContainerBreaks(container)
      const lastElement = container.lastElementChild
      if (lastElement) {
        this._trimContainerBreaks(lastElement)
      }
      container.style.opacity = 1
    },
    _trimContainerBreaks(element) {
      if (!element) return
      const isJunkNode = (node) => {
        if (!node) return true
        if (node.nodeType === 3 && /^\s*$/.test(node.textContent)) {
          return true
        }
        if (node.nodeType === 1) {
          const tagName = node.tagName
          if (tagName === 'BR') return true
          if (tagName === 'SPAN' && /^\s*$/.test(node.textContent)) return true
          if (tagName === 'A' && /^\s*$/.test(node.textContent)) return true
        }
        return false
      }
      while (element.firstChild && isJunkNode(element.firstChild)) {
        element.removeChild(element.firstChild)
      }
      while (element.lastChild && isJunkNode(element.lastChild)) {
        element.removeChild(element.lastChild)
      }
    },
    finalizeLayout() {
      if (!this._config.MODULE_ENABLED) return
      const sidebar = document.querySelector('aside#sidebar')
      if (!sidebar) return
      const category = sidebar.querySelector('.plugin-categorize')
      sidebar.innerHTML = ''
      if (category) {
        sidebar.appendChild(category)
        sidebar.style.visibility = 'visible'
      }
    },
  }
  const RubyConverter = {
    _config: {
      MODULE_ENABLED: true,
    },
    _rules: null,
    _regex: {
      matchBracketRuby: /[【「]([^【】「」（）・、\s～〜]+)（([^（）]*)）([^【】「」（）]*)[】」]/g,
      matchKanjiRuby: /([一-龠々ヵヶ]+)\s*[(（]([^（）()]*)[)）]/g,
      matchLoanwordRuby: /([a-z]+(?:\s+[a-z]+)*)\s*[（(]([ァ-ンー]+)[）)]/gi,
      matchKatakanaRuby: /([ァ-ンー]+)\s*[（(]([a-z+＋\s]+)[）)]/gi,
      extractCandidates: /([^\s\p{P}<>]+)（([^）]+)）/gu,
      extractKanjiAndReading: /(.*?)（(.*?)）/,
      extractReading: /（(.*?)）/,
      hasOnlyKana: /^[\u3040-\u309F\u30A0-\u30FF]+$/u,
      hasOnlyHiragana: /^[\u3040-\u309F]+$/u,
      hasOnlyKatakana: /^[\u30A0-\u30FF]+$/u,
      hasKanaChar: /^[\u3040-\u309F\u30A0-\u30FF]$/u,
      hasOnlyKanjiKana: /^[一-龠々\u3040-\u309F\u30A0-\u30FF]+$/u,
      isHtmlTag: /<[^>]+>/g,
      isRubyTag: /<ruby[^>]*>/,
    },
    _registeredWords: new Set(),
    _wordBankForRegex: [],
    _rubyCache: new Map(),
    _htmlPatches: new Map(),
    _simpleTextReplacements: new Map(),
    globalRegex: null,
    init(rules) {
      if (!this._config.MODULE_ENABLED) return
      this._rules = rules
      this.compile()
    },
    applyRubyToContainer(container) {
      if (!this._config.MODULE_ENABLED) return
      this._applyHtmlPatches(container)
      this._learnFromContainer(container)
      this._buildFinalRegex()
      this._processTextNodes(container)
    },
    compile() {
      this._compileStaticRules()
      this._buildFinalRegex()
    },
    _compileStaticRules() {
      const { HTML, TEXT } = this._rules
      HTML.OVERRIDE.forEach((rule) => {
        const pattern = typeof rule.pattern === 'string' ? new RegExp(this._escapeRegExp(rule.pattern), 'g') : rule.pattern
        this._htmlPatches.set(pattern, rule.replacement)
        try {
          if (this._regex.isRubyTag.test(rule.replacement)) {
          } else {
            const extractedPairs = this._extractRubyCandidates(rule.replacement)
            extractedPairs.forEach(({ kanji, reading, fullPattern }) => {
              this.registerWord({
                pattern: fullPattern,
                kanji,
                reading,
                source: 'HTML.OVERRIDE.Extract',
              })
            })
          }
        } catch (e) {}
      })
      HTML.AUTO.forEach((patternString) => {
        if (patternString.includes('?')) {
          const [prefix, suffix] = patternString.split('?')
          if (suffix === void 0) return
          const cleanPattern = prefix + suffix
          const readingMatchForRegister = cleanPattern.match(this._regex.extractReading)
          if (readingMatchForRegister) {
            const kanjiPartForRegister = cleanPattern.replace(this._regex.extractReading, '')
            const readingForRegister = readingMatchForRegister[1]
            this.registerWord({
              pattern: cleanPattern,
              kanji: kanjiPartForRegister,
              reading: readingForRegister,
              source: 'HTML.AUTO',
            })
          }
          const searchPattern = new RegExp(`${this._escapeRegExp(prefix)}((?:<[^>]+>)*?)${this._escapeRegExp(suffix)}`, 'g')
          let replacementFunc
          const readingForPatch = readingMatchForRegister ? readingMatchForRegister[1] : ''
          if (this._regex.hasOnlyKana.test(readingForPatch)) {
            const textPartForPatch = cleanPattern.replace(this._regex.extractReading, '')
            const rubyHtml = this._parseFurigana(textPartForPatch, readingForPatch)
            if (rubyHtml !== null) {
              replacementFunc = (match, capturedTags) => rubyHtml + (capturedTags || '')
            } else {
              replacementFunc = (match) => match
            }
          } else {
            const textOnlyForPatch = cleanPattern
            replacementFunc = (match, capturedTags) => textOnlyForPatch + (capturedTags || '')
          }
          this._htmlPatches.set(searchPattern, replacementFunc)
        }
      })
      TEXT.AUTO.forEach((patternString) => {
        const match = patternString.match(this._regex.extractKanjiAndReading)
        if (match) {
          this.registerWord({
            pattern: patternString,
            kanji: match[1],
            reading: match[2],
            source: 'TEXT.AUTO',
          })
        }
      })
      TEXT.OVERRIDE.forEach((rule) => {
        try {
          if (this._regex.isRubyTag.test(rule.replacement)) {
            this.registerWord({
              pattern: rule.pattern,
              replacement: rule.replacement,
              source: 'TEXT.OVERRIDE',
            })
          } else {
            this._simpleTextReplacements.set(rule.pattern, rule.replacement)
            const extractedPairs = this._extractRubyCandidates(rule.replacement)
            extractedPairs.forEach(({ kanji, reading, fullPattern }) => {
              this.registerWord({
                pattern: fullPattern,
                kanji,
                reading,
                source: 'TEXT.OVERRIDE.Extract',
              })
            })
          }
        } catch (e) {}
      })
    },
    registerWord({ pattern, kanji, reading, replacement, source }) {
      if (this._registeredWords.has(pattern)) {
        return
      }
      let finalReplacement = replacement
      if (!finalReplacement) {
        if (!kanji || typeof reading === 'undefined') return
        const rubyHtml = this._parseFurigana(kanji, reading)
        if (rubyHtml === null) {
          return
        }
        finalReplacement = rubyHtml
      }
      this._registeredWords.add(pattern)
      this._wordBankForRegex.push(this._escapeRegExp(pattern))
      this._rubyCache.set(pattern, finalReplacement)
    },
    _learnFromContainer(container) {
      const html = container.innerHTML
      const textOnly = html.replace(this._regex.isHtmlTag, '')
      for (const match of textOnly.matchAll(this._regex.matchBracketRuby)) {
        const kanjiPart = match[1]
        const readingPart = match[2]
        const corePattern = `${kanjiPart}（${readingPart}）`
        if (this._registeredWords.has(corePattern)) {
          continue
        }
        if (this._simpleTextReplacements.has(corePattern)) {
          continue
        }
        if (!this._regex.hasOnlyKana.test(readingPart)) {
          continue
        }
        if (!this._regex.hasOnlyKanjiKana.test(kanjiPart)) {
          continue
        }
        this.registerWord({
          pattern: corePattern,
          kanji: kanjiPart,
          reading: readingPart,
          source: 'Learned',
        })
      }
    },
    _applyHtmlPatches(container) {
      if (this._htmlPatches.size === 0) {
        return
      }
      let html = container.innerHTML
      const originalHtml = html
      this._htmlPatches.forEach((replacement, pattern) => {
        html = html.replace(pattern, replacement)
      })
      if (html !== originalHtml) {
        container.innerHTML = html
      }
    },
    _buildFinalRegex() {
      this.globalRegex = this._wordBankForRegex.length > 0 ? new RegExp(`(${this._wordBankForRegex.join('|')})`, 'g') : null
    },
    _processTextNodes(root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.parentNode.nodeName !== 'SCRIPT' && n.parentNode.nodeName !== 'STYLE' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      })
      const nodesToProcess = []
      let node = walker.nextNode()
      while (node) {
        const newContent = this._applyTextReplacements(node.nodeValue)
        if (newContent !== node.nodeValue) {
          nodesToProcess.push({ node, newContent })
        }
        node = walker.nextNode()
      }
      for (let i = nodesToProcess.length - 1; i >= 0; i--) {
        const { node: node2, newContent } = nodesToProcess[i]
        const fragment = document.createRange().createContextualFragment(newContent)
        node2.parentNode.replaceChild(fragment, node2)
      }
    },
    _applyTextReplacements(text) {
      if (!text.includes('（') && !text.includes('(')) {
        return text
      }
      let processedText = text
      for (const [pattern, replacement] of this._simpleTextReplacements) {
        processedText = processedText.replaceAll(pattern, replacement)
      }
      if (this.globalRegex) {
        processedText = processedText.replace(this.globalRegex, (match) => {
          return this._rubyCache.get(match) || match
        })
      }
      processedText = processedText.replace(this._regex.matchLoanwordRuby, (match, loanword, katakana) => {
        return `<ruby>${loanword}<rt>${katakana}</rt></ruby>`
      })
      processedText = processedText.replace(this._regex.matchKatakanaRuby, (match, katakana, loanword) => {
        return `<ruby>${katakana}<rt>${loanword}</rt></ruby>`
      })
      processedText = processedText.replace(this._regex.matchKanjiRuby, (match, kanji, reading) => {
        const fullMatch = `${kanji}（${reading}）`
        if (this._rules.EXCLUDE.STRINGS.has(fullMatch) || !this._regex.hasOnlyHiragana.test(reading) || this._rules.EXCLUDE.PARTICLES.has(reading)) {
          return match
        }
        return `<ruby>${kanji}<rt>${reading}</rt></ruby>`
      })
      return processedText
    },
    _parseFurigana(kanji, reading) {
      if (this._regex.hasOnlyKatakana.test(kanji) || this._regex.hasOnlyKatakana.test(reading)) {
        return null
      }
      const hiraganaReading = this._katakanaToHiragana(reading)
      let result = ''
      let kanjiIndex = 0
      let readingIndex = 0
      while (kanjiIndex < kanji.length) {
        const currentKanjiChar = kanji[kanjiIndex]
        if (this._regex.hasKanaChar.test(currentKanjiChar)) {
          result += currentKanjiChar
          const hiraganaCurrent = this._katakanaToHiragana(currentKanjiChar)
          const tempNextReadingIndex = hiraganaReading.indexOf(hiraganaCurrent, readingIndex)
          if (tempNextReadingIndex !== -1) {
            readingIndex = tempNextReadingIndex + hiraganaCurrent.length
          } else {
            return null
          }
          kanjiIndex++
        } else {
          let kanjiPart = ''
          let blockEndIndex = kanjiIndex
          while (blockEndIndex < kanji.length && !this._regex.hasKanaChar.test(kanji[blockEndIndex])) {
            kanjiPart += kanji[blockEndIndex]
            blockEndIndex++
          }
          const nextKanaInKanji = kanji[blockEndIndex]
          let readingEndIndex
          if (nextKanaInKanji) {
            const hiraganaNextKana = this._katakanaToHiragana(nextKanaInKanji)
            readingEndIndex = hiraganaReading.indexOf(hiraganaNextKana, readingIndex)
            if (readingEndIndex === -1) {
              readingEndIndex = hiraganaReading.length
            }
          } else {
            readingEndIndex = hiraganaReading.length
          }
          const readingPart = reading.substring(readingIndex, readingEndIndex)
          if (kanjiPart) {
            if (!readingPart) {
              return null
            } else {
              result += `<ruby>${kanjiPart}<rt>${readingPart}</rt></ruby>`
            }
          }
          readingIndex = readingEndIndex
          kanjiIndex = blockEndIndex
        }
      }
      if (readingIndex < hiraganaReading.length) {
      }
      return result
    },
    _escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },
    _katakanaToHiragana(str) {
      if (!str) return ''
      return str.replace(/[\u30A1-\u30F6]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 96))
    },
    _extractRubyCandidates(replacement) {
      const results = []
      for (const match of replacement.matchAll(this._regex.extractCandidates)) {
        const kanji = match[1]
        const reading = match[2]
        if (!kanji || !reading) {
          continue
        }
        const fullPattern = `${kanji}（${reading}）`
        results.push({ kanji, reading, fullPattern })
      }
      return results
    },
  }
  const SettingsPanel = {
    _config: {
      MODULE_ENABLED: true,
      FEEDBACK_URL: 'https://greasyfork.org/scripts/542386-edewakaru-enhanced',
      OPTIONS: {
        SCRIPT_ENABLED: { label: 'ページ最適化', defaultValue: true, type: 'toggle', handler: 'notification' },
        FURIGANA_VISIBLE: { label: '振り仮名表示', defaultValue: true, type: 'toggle', handler: 'furigana', dependsOn: 'SCRIPT_ENABLED' },
        IFRAME_LOAD_ENABLED: { label: '関連記事表示', defaultValue: true, type: 'toggle', handler: 'notification', dependsOn: 'SCRIPT_ENABLED' },
        TTS_ENABLED: { label: '単語選択発音', defaultValue: false, type: 'toggle', handler: 'tts', dependsOn: 'SCRIPT_ENABLED', condition: () => 'speechSynthesis' in window },
        TTS_RATE: { label: '発音速度', defaultValue: 1, type: 'slider', handler: 'ttsRate', min: 0.85, max: 1, step: 0.05, dependsOn: 'SCRIPT_ENABLED' },
      },
      STYLES: `
      #settings-panel { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; padding: 16px; background: white; border-radius: 4px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05); width: 140px; opacity: 0.9; -webkit-user-select: none; user-select: none; }
      .settings-title { font-size: 14px; font-weight: 600; color: #1F2937; margin: 0 0 6px 0; text-align: center; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; position: relative; }
      .feedback-link, .feedback-link:visited { position: absolute; top: 0; right: 0; width: 16px; height: 16px; color: #E5E7EB !important; transition: color 0.2s ease-in-out; }
      .feedback-link:hover { color: #3B82F6 !important; }
      .feedback-link svg { width: 100%; height: 100%; }
      .setting-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
      .setting-label { font-size: 13px; font-weight: 500; color: #4B5563; cursor: pointer; flex: 1; line-height: 1.2; }
      .toggle-switch { position: relative; display: inline-block; width: 40px; height: 20px; flex-shrink: 0; }
      .toggle-switch.disabled { opacity: 0.5; }
      .toggle-switch.disabled .toggle-slider { cursor: not-allowed; }
      .toggle-switch input { opacity: 0; width: 0; height: 0; }
      .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #E5E7EB; transition: all 0.2s ease-in-out; border-radius: 9999px; }
      .toggle-slider:before { position: absolute; content: ""; height: 15px; width: 15px; left: 2.5px; bottom: 2.5px; background-color: white; transition: all 0.2s ease-in-out; border-radius: 50%; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06); }
      input:checked+.toggle-slider { background-color: #3B82F6; }
      input:checked+.toggle-slider:before { transform: translateX(20px); }
      .settings-notification { position: fixed; right: 24px; z-index: 9999; padding: 8px 12px; background-color: #3B82F6; color: white; border-radius: 6px; font-size: 13px; opacity: 0; transform: translateX(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
      .settings-notification.show { opacity: 0.9; transform: translateX(0); }
      .slider-container { display: flex; align-items: center; width: 100%; }
      .slider-value { font-size: 12px; margin-left: 2px; }
      .slider { -webkit-appearance: none; width: 40px; height: 6px; border-radius: 3px; background: #E5E7EB; outline: none; flex-shrink: 0; }
      .slider:disabled { opacity: 0.5; cursor: not-allowed; }
      .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #3B82F6; cursor: pointer; }
      .slider::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #3B82F6; cursor: pointer; border: none; }
    `,
    },
    _elements: {},
    _notificationPosition: '24px',
    _templates: {
      panel: (feedbackUrl) => `
      <h3 class="settings-title">
        設定パネル
        <a href="${feedbackUrl}" target="_blank" rel="noopener noreferrer" class="feedback-link" title="Feedback">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </a>
      </h3>
    `,
      toggle: (id, label, checked, disabled) => `
      <label for="${id}" class="setting-label">${label}</label>
      <label class="toggle-switch ${disabled ? 'disabled' : ''}">
        <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
        <span class="toggle-slider"></span>
      </label>
    `,
      slider: (id, label, value, min, max, step, disabled) => `
      <div class="slider-container">
        <span class="setting-label">${label}<span class="slider-value">${value.toFixed(2)}</span></span>
        <input type="range" id="${id}" class="slider" min="${min}" max="${max}" step="${step}" value="${value}" ${disabled ? 'disabled' : ''}>
      </div>
    `,
    },
    _handlers: {
      notification() {
        this._showNotification()
      },
      furigana(value) {
        this._toggleFuriganaDisplay(value)
      },
      tts(value) {
        emitter.emit('tts:toggle', value)
      },
      ttsRate(value) {
        emitter.emit('tts:rate', value)
      },
    },
    init() {
      if (!this._config.MODULE_ENABLED) return
      GM_addStyle(this._config.STYLES)
      this._createPanel()
      this._initFurigana()
    },
    getOptions() {
      return Object.fromEntries(Object.entries(this._config.OPTIONS).map(([key, config]) => [key, GM_getValue(key, config.defaultValue)]))
    },
    _createPanel() {
      const panel = document.createElement('div')
      panel.id = 'settings-panel'
      panel.innerHTML = this._templates.panel(this._config.FEEDBACK_URL)
      this._elements.panel = panel
      const options = this.getOptions()
      const controls = Object.entries(this._config.OPTIONS)
        .filter(([, config]) => !config.condition || config.condition())
        .map(([key, config]) => {
          const isDisabled = config.dependsOn && !options[config.dependsOn]
          const control = this._createControl(key, config, options[key], isDisabled)
          this._elements[key] = this._cacheControlElements(control)
          return control
        })
      panel.append(...controls)
      panel.addEventListener('change', this._handlePanelEvent.bind(this))
      panel.addEventListener('input', this._handlePanelEvent.bind(this))
      document.body.appendChild(panel)
      this._updateNotificationPosition()
    },
    _createControl(key, config, value, disabled) {
      const container = document.createElement('div')
      container.className = 'setting-item'
      container.dataset.key = key
      const id = `setting-${key.toLowerCase()}`
      const template = this._templates[config.type]
      if (config.type === 'toggle') {
        container.innerHTML = template(id, config.label, value, disabled)
      } else if (config.type === 'slider') {
        container.innerHTML = template(id, config.label, value, config.min, config.max, config.step, disabled)
      }
      return container
    },
    _cacheControlElements(container) {
      return {
        container,
        control: container.querySelector('input'),
        switch: container.querySelector('.toggle-switch'),
      }
    },
    _handlePanelEvent(event) {
      const item = event.target.closest('.setting-item')
      if (!item) return
      const key = item.dataset.key
      const value = event.target.type === 'checkbox' ? event.target.checked : Number(event.target.value)
      if (event.target.type === 'range') {
        const valueDisplay = item.querySelector('.slider-value')
        if (valueDisplay) valueDisplay.textContent = value.toFixed(2)
      }
      this._handleChange(key, value)
    },
    _handleChange(key, value) {
      GM_setValue(key, value)
      const config = this._config.OPTIONS[key]
      const handler = this._handlers[config.handler]
      if (handler) handler.call(this, value)
      this._updateDependentOptions()
    },
    _updateDependentOptions() {
      const options = this.getOptions()
      Object.entries(this._config.OPTIONS)
        .filter(([, config]) => config.dependsOn)
        .forEach(([key, config]) => {
          const isEnabled = options[config.dependsOn]
          const element = this._elements[key]
          if (element?.switch) element.switch.classList.toggle('disabled', !isEnabled)
          if (element?.control) element.control.disabled = !isEnabled
        })
    },
    _updateNotificationPosition() {
      if (this._elements.panel) {
        const rect = this._elements.panel.getBoundingClientRect()
        this._notificationPosition = `${window.innerHeight - rect.top + 4}px`
      }
    },
    _initFurigana() {
      const visible = GM_getValue('FURIGANA_VISIBLE', this._config.OPTIONS.FURIGANA_VISIBLE.defaultValue)
      if (!visible) {
        this._toggleFuriganaDisplay(false)
      }
    },
    _toggleFuriganaDisplay(visible) {
      const id = 'furigana-display-style'
      let style = document.getElementById(id)
      if (!style) {
        style = document.createElement('style')
        style.id = id
        document.head.appendChild(style)
      }
      style.textContent = `rt { display: ${visible ? 'ruby-text' : 'none'} !important; }`
    },
    _showNotification(message = '設定を保存しました。再読み込みしてください。') {
      const existingNotification = document.querySelector('.settings-notification')
      if (existingNotification) existingNotification.remove()
      const notification = document.createElement('div')
      notification.className = 'settings-notification'
      notification.textContent = message
      notification.style.bottom = this._notificationPosition
      document.body.appendChild(notification)
      requestAnimationFrame(() => {
        notification.classList.add('show')
        setTimeout(() => {
          notification.classList.remove('show')
          setTimeout(() => notification.remove(), 500)
        }, 1500)
      })
    },
  }
  const TTSPlayer = {
    _config: {
      VOICES: new Map([
        ['female', 'Microsoft Nanami Online (Natural) - Japanese (Japan)'],
        ['male', 'Microsoft Keita Online (Natural) - Japanese (Japan)'],
      ]),
      OPTIONS: {
        lang: 'ja-JP',
        volume: 1,
        rate: 1,
        pitch: 1,
      },
    },
    _initPromise: null,
    _voices: new Map(),
    _availableVoices: [],
    _isInitialized: false,
    _eventHandlers: {
      ttsSpeak: null,
      ttsRate: null,
    },
    init(options = {}) {
      if (!this._initPromise) {
        this._initPromise = this._initialize()
      }
      this._setRate(options.rate)
      if (!this._eventHandlers.ttsSpeak) {
        this._initEventHandlers()
      }
      this._subscribeToEvents()
      return this._initPromise
    },
    destroy() {
      this._unsubscribeAll()
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel()
      }
    },
    speak(payload) {
      if (!this._isInitialized) {
        return
      }
      const { text, voice: voiceKey, rate } = payload || {}
      if (!text?.trim() || this._availableVoices.length === 0) {
        if (this._availableVoices.length === 0);
        return
      }
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = this._getVoice(voiceKey)
      utterance.lang = this._config.OPTIONS.lang
      utterance.volume = this._config.OPTIONS.volume
      utterance.rate = rate || this._config.OPTIONS.rate
      utterance.pitch = this._config.OPTIONS.pitch
      utterance.onerror = (e) => {
        if (!['canceled', 'interrupted'].includes(e.error)) {
        }
      }
      speechSynthesis.speak(utterance)
    },
    _initEventHandlers() {
      this._eventHandlers.ttsSpeak = (payload) => {
        this.speak(payload)
      }
      this._eventHandlers.ttsRate = (rate) => {
        this._setRate(rate)
      }
    },
    _subscribeToEvents() {
      this._unsubscribeAll()
      emitter.on('tts:speak', this._eventHandlers.ttsSpeak)
      emitter.on('tts:rate', this._eventHandlers.ttsRate)
    },
    _unsubscribeAll() {
      if (this._eventHandlers.ttsSpeak) {
        emitter.off('tts:speak', this._eventHandlers.ttsSpeak)
      }
      if (this._eventHandlers.ttsRate) {
        emitter.off('tts:rate', this._eventHandlers.ttsRate)
      }
    },
    _setRate(rate) {
      rate = typeof rate === 'string' ? Number.parseFloat(rate) : rate
      if (rate >= 0.1 && rate <= 10 && !Number.isNaN(rate)) {
        this._config.OPTIONS.rate = rate
        return true
      }
      return false
    },
    _getVoice(key) {
      if (key && this._voices.has(key)) {
        return this._voices.get(key)
      }
      if (this._availableVoices.length > 0) {
        return this._availableVoices[Math.floor(Math.random() * this._availableVoices.length)]
      }
      return void 0
    },
    _initialize() {
      return new Promise((resolve) => {
        if (!('speechSynthesis' in window)) {
          return resolve()
        }
        let resolved = false
        const loadVoices = () => {
          if (resolved) return
          resolved = true
          const allVoices = speechSynthesis.getVoices()
          const { VOICES, OPTIONS } = this._config
          const voiceNameToKeyMap = new Map([...VOICES.entries()].map(([key, name]) => [name, key]))
          this._voices.clear()
          for (const v of allVoices) {
            const key = voiceNameToKeyMap.get(v.name)
            if (key && v.lang === OPTIONS.lang) {
              this._voices.set(key, v)
            }
          }
          this._availableVoices = [...this._voices.values()]
          if (this._availableVoices.length > 0) {
            this._isInitialized = true
          }
          speechSynthesis.onvoiceschanged = null
          resolve()
        }
        const initialVoices = speechSynthesis.getVoices()
        if (initialVoices.length > 0) {
          loadVoices()
        } else {
          speechSynthesis.onvoiceschanged = loadVoices
          setTimeout(loadVoices, 500)
        }
      })
    },
  }
  const MainController = {
    run() {
      const options = SettingsPanel.getOptions()
      if (!options.SCRIPT_ENABLED) {
        document.addEventListener('DOMContentLoaded', () => SettingsPanel.init())
        return
      }
      PageOptimizer.init()
      RubyConverter.init(RULES)
      TTSPlayer.init({ rate: options.TTS_RATE })
      this._subscribeToEvents()
      document.addEventListener('DOMContentLoaded', () => {
        PageOptimizer.cleanupGlobalElements()
        IframeLoader.init({ IFRAME_LOAD_ENABLED: options.IFRAME_LOAD_ENABLED })
        SettingsPanel.init()
        if (options.TTS_ENABLED) {
          ContextMenu.init()
        }
        this._processPageContent()
      })
    },
    _subscribeToEvents() {
      emitter.on('tts:toggle', (enabled) => {
        enabled ? ContextMenu.init() : ContextMenu.destroy()
      })
    },
    _processPageContent() {
      const articleBodies = document.querySelectorAll('.article-body-inner')
      if (articleBodies.length === 0) {
        PageOptimizer.finalizeLayout()
        return
      }
      let currentIndex = 0
      const processBatch = () => {
        const batchSize = Math.min(2, articleBodies.length - currentIndex)
        const endIndex = currentIndex + batchSize
        for (let i = currentIndex; i < endIndex; i++) {
          const body = articleBodies[i]
          RubyConverter.applyRubyToContainer(body)
          IframeLoader.replaceIframesInContainer(body)
          ImageProcessor.process(body)
          PageOptimizer.cleanupArticleBody(body)
        }
        currentIndex = endIndex
        if (currentIndex < articleBodies.length) {
          requestAnimationFrame(processBatch)
        } else {
          PageOptimizer.finalizeLayout()
        }
      }
      requestAnimationFrame(processBatch)
    },
  }
  MainController.run()
})()
