// ==UserScript==
// @name        Bilibili Danmaku Translator
// @name:ja     Bilibili Danmaku Translator
// @name:zh-CN  Bilibili Danmaku Translator
// @namespace   knoa.jp
// @description Add translations on streaming user comments(弾幕;danmaku) of bilibili, with the translation of Google Chrome or Microsoft Edge.
// @description:ja Google Chrome や Microsoft Edge の翻訳ツールを使って、ビリビリのユーザーコメント(弾幕)を自動翻訳します。
// @description:zh-CN 使用 Google Chrome 和 Microsoft Edge 的翻译工具，自动翻译 bilibili 的用户评论(弹幕)。
// @include     /^https://www\.bilibili\.com/video/[a-zA-Z0-9]+/
// @include     /^https://www\.bilibili\.com/medialist/play/.+/
// @include     /^https://www\.bilibili\.com/bangumi/play/[a-zA-Z0-9]+/
// @include     /^https://live\.bilibili\.com/[0-9]+/
// @include     /^https://live\.bilibili\.com/blanc/[0-9]+/
// @version     2.4.0
// @require     https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.10/pako_inflate.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/384708/Bilibili%20Danmaku%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/384708/Bilibili%20Danmaku%20Translator.meta.js
// ==/UserScript==

(function(){
  const SCRIPTNAME = 'BilibiliDanmakuTranslator';
  const DEBUG = false;/*
[update]
Now available on Microsoft Edge.

[bug]
だはん・だはんからの直播じゃ効いてないかも?
length 50001
videoで？ Uncaught TypeError: Cannot read property 'cid' of undefined

[to do]
下部のコメント一覧は翻訳してほしいかも
  弾幕、下部ページコメント、UIその他に分けてオプションにするか
  下部は翻訳したくないわきゃないか(もともとChromeに翻訳させてるわけだし)
  UIは弾幕姫への貢献とワンセットでできる範囲の辞書を用意する手もあるのかな？
  各コメントからDeepLのURLへリンクする手もあるぞ。
    https://www.deepl.com/translator#zh/ja/原文
  動画タイトルなど、要素ごとに丁寧に対応していくか
ほかにも対応すべきURLがあるかも
  https://www.bilibili.com/medialist/play/ml719054678
動画タイトルとか下部のコメントとかデフォルトの翻訳適用したい
  原文を即titleに突っ込んでおけばスマートに解決？
window.topあたりを精査
かなり遅れて翻訳が届くことがあるので弾幕要素の再利用でwaitingsをリセット

[to research]
Chrome翻訳負荷制限
  キューはクリアしない方針？遅れた翻訳は意義薄い？
  文字列の長さの可能性？
  Chromeがサボるだけなら自家製クエリに手を出す手も？
  Chromeがどんどん反応を遅くしていった？
  新語に対する複数回クエリなど謎の挙動？
右の一覧内でも特殊案内は訳したいかも
主要UI要素を指定翻訳語として登録しておきたい
  動的に生成される要素の対応がめんどくさい
自分のコメントの翻訳時も逆辞書で節約と蓄積？
日本語と英語は翻訳しない方針で問題ないよね？
Google翻訳の一般Webユーザーのフリをして各ユーザーにAPIを叩かせる手もあるようだが
  https://github.com/andy-portmen/Simple-Translate/blob/master/src/lib/common.js
  それが許されるならBaiduのAPIを叩かせることも可能？
翻訳辞書を共有サーバーに溜め込む仕組み？
pako.deflate + TextDecoder でdictionaryを無理やり圧縮して保存できる？
動画のタイトル下に翻訳を挿入したいね。
MODIFICATIONSはたまに翻訳の確認が必要。
MODIFICATIONSの活用率も確認したい。

[memo]
1. 翻訳辞書構築の流れ
1-1. core.listenWebSocketsで弾幕テキストを取得(要素出現より1秒ほど早く取得できる)
1-2. Translatorに弾幕テキストを登録
1-3. TranslatorがpriorDanmaku要素に弾幕テキスト要素を設置
1-4. Chromeが弾幕テキスト要素を自動翻訳してくれる
1-5. Translatorが察知して辞書として登録

2. 弾幕訳文追加の流れ
2-1. core.observeVideoDanmakuで弾幕要素を発見
2-2. Danmakuインスタンスを作成してTranslatorに登録
2-3. 弾幕テキストに一致する辞書がすでにあればすぐに訳文を追加
2-4. なければ1-5.のタイミングで訳文を追加

3. 自分の投稿コメント翻訳
Google Apps Script (推定1日7000回(=1回5文字で月100万文字相当)を超えたあたりで制限がかかる)
https://qiita.com/tanabee/items/c79c5c28ba0537112922
  */
  if(window === top && console.time) console.time(SCRIPTNAME);
  const NOW = Date.now();
  const ISMAC = (window.navigator.userAgent.match(/Mac/) !== null);
  const PLAYERAPI = 'https://api.bilibili.com/x/player/';/*cid取得用*/
  const COMMENTLISTAPI = 'https://comment.bilibili.com/{cid}.xml';/*動画用*/
  const CHATSERVER = 'chat.bilibili.com';/*直播用*/
  const TRANSLATOR = 'https://script.google.com/macros/s/AKfycby29iFLZ742UEC6TlN8-b4Dxtlu_7XYbVeo2GgiYVWMtuzIcbA/exec?text={text}&source={source}&target={target}';
  const TRANSLATIONSATONCE = 64;/*同時最大翻訳リクエスト数(Chrome翻訳負荷の低減)*/
  const TRANSLATIONSINTERVAL = 1000;/*最短翻訳リクエスト間隔(ms)(Chrome翻訳負荷の低減)*/
  const HISTORYLENGTH = 50000;/*辞書の最大保持数(5万で5MB見込み)*/
  const TRANSLATIONEXPIRED = 90*24*60*60*1000;/*翻訳の有効期限(翻訳精度の改善に期待する)*/
  const WAITING_LIMIT = 10*1000;/* Chrome翻訳の待機時間(ms)(過負荷時には実質休憩時間となる) */
  const BILIBILILANGUAGE = 'zh-CN';
  const USERLANGUAGE = window.navigator.language;
  const TRANSLATIONS = {
    ja: {
      inputTranslationKey: ISMAC ? '(Command+Enterで翻訳)' : '(Ctrl+Enterで翻訳)',
    },
    en: {
      inputTranslationKey: ISMAC ? '(Command+Enter to translate)' : '(Ctrl+Enter to translate)',
    },
  };
  const DICTIONARIES = {
    ja: {/* original: [translation, count, created] */
      '哔哩哔哩 (゜-゜)つロ 干杯~': ['ビリビリ (゜-゜)つロ 乾杯~', 0, NOW],
    },
    en: {
      '哔哩哔哩 (゜-゜)つロ 干杯~': ['bilibili (゜-゜)つロ cheers~', 0, NOW],
    },
  };
  const MODIFICATIONS = {/* およそ5000件の置換処理で1ms (Core i7-3740QM) */
    /* '単語': [/誤訳(削除する)/, '適訳(挿入する)'] */
    ja: {
      // 日本語
      '发言': [/話す|スピーチ|スピーキング|ステートメント/, '発言'],
      '残念': [/残り|カンニアン/, '残念'],
      '干杯': [/トースト|干杯|乾杯/, '乾杯'],
      '乾杯': [/トースト|乾杯/, '乾杯'],
      '万岁': [/長生き(する|させる)?|ロングライブ/, '万歳'],
      '大丈夫': [/夫(ですか)?/, '大丈夫'],
      '正解': [/ポジティブソリューション|正しい/, '正解'],
      '無駄': [/イノセント|無実|レールなし/g, '無駄'],
      '草': [/グラス|カオ/, '草'],
      '有能': [/エネルギーを持っている|できる/, '有能'],
      '神回': [/神が戻ってきた|神様|神輝/, '神回'],
      '全裸待机': [/(フルヌード|ネイキッド)スタンバイ/, '全裸待機'],
      '完全一致': [/完全に一貫性のある|完全に一貫しています|まったく同じ/, '完全に一致'],
      '上手上手': [/手をつないで|手に手|始めましょう/, '上手上手'],
      '上手': [/はじめに|始めましょう/, '上手'],
      '清楚清楚': [/クリアとクリア|晴れ/, '清楚清楚'],
      '清楚': [/クリア|明らか|明確|晴れ/, '清楚'],
      '理解理解': [/理解(を|し)理解する/, '理解理解'],
      '余裕余裕': [/ゆうゆうゆうゆう|余剰/, '余裕余裕'],
      '兽耳': [/獣(の)?耳|動物の耳|獣|耳|ビーストイヤー/, 'ケモミミ'],
      '幻听': [/錯視|錯覚|聴覚幻覚|黙る|ありがとう|イリュージョン|イルルイン|イルリング|(オーディオ)?オーディション|ファンタジー|Illuing/, '幻聴'],
      '幻视': [/ファントム|マジック|魔法|ビジョン/, '幻視'],
      '错乱': [/(無秩序(に)?|乱雑|疾患|障害|カオス)|混乱した/, '錯乱'],
      '混乱': [/カオス|混沌|錯乱/, '混乱'],
      '认真': [/本気|真剣に|まじめな/, '迫真'],
      '确信': [/(確認済み|信じ(る|て|ます)|納得|確信してい(る|ます))|きっと/, '確信'],
      '狂喜': [/エクスタシー/, '狂喜'],
      '震声': [/衝撃|ショック|身震い/, '震え声'],
      '棒读': [/(素晴らしい|良い|スティック|棒)(読書|リーディング)/, '棒読み'],
      '野生': [/ワイルド/, '野生'],
      '字幕组': [/字幕グループ/, '字幕組'],
      '字幕': [/キャプション/, '字幕'],
      '君中国语本当上手': [/6月中国語は始めるための方法です|ジュン中国語本/, '君中国語本当上手'],
      '君日本语本当上手': [/6月日本語は始める方法です|ジュン・ジャパニーズ・ベンダン/, '君日本語本当上手'],
      // 中国語
      '晚上好': [/おやすみ(なさい)?|おはよう|夜(が|は)(うまい|得意|良い|いい)(です|ね)?/g, 'こんばんは'],
      '帅': [/ハンサム(な)?/g, 'カッコイイ'],
      '大人': [/(?<!あの|この)(の)?(大人|成人|おとな|テーブル)(たち)?/g, 'さま'],
      '老大': [/上司|ボス/, '老大'],
      '加油': [/さあ|さて|燃料補給|燃料を供給|給油|来て|来ます|歓声(を上げる)?|フューエル|ジアオイル|jiao|いい加減にして/g, 'がんばれ'],
      '厉害厉害': [/非常に強力|よくやった/, 'すごいすごい'],
      '厉害': [/強力(な)?/, 'すごい'],
      '表白': [/エクスプレス|(の)?告白$|白|(を)?表現する|Express/, 'すき'],
      '来了来了': [/ここに来(る|て)|今行ってる/, '来ました'],
      '来了': [/(出て|やって)?(来|く|き)(る|て(います|いる)?|た)|さあ|到来/, '来ました'],
      '辛苦了': [/ハードワーク|勤勉|(一生)?懸命(に)?働い(た|ている|ています)|大変(な作業)?です|難しい|つらい|よくやった/, 'おつかれさま'],
      '辛苦啦': [/ハードワーク|勤勉|(一生)?懸命(に)?働い(た|ている|ています)|大変(な作業)?です|難しい|つらい|よくやった/, 'おつかれさま'],
      '辛苦辛苦': [/ハードワーク|勤勉|(一生)?懸命(に)?働い(た|ている|ています)|大変(な作業)?です|難しい|つらい|よくやった/, 'おつかれさま'],
      '冲冲冲': [/急いで|ラッシュラッシュ/, 'いけいけいけ'],
      '见证历史': [/証人の歴史/, '歴史の証人'],
      '喷麦': [/スプレー|小麦散布|スプレー小麦/, '吐息音'],
      '配音': [/ダビング|Dubbing|声/, '吹き替え'],
      '眨眼': [/点滅/, 'まばたき'],/*ウィンクの場合もあるが点滅よりはマシ*/
      'up主': [/(アップ|up)(マスター|メイン)?|メイン|主/i, 'うｐ主'],
      'Up主': [/(アップ|up)(マスター|メイン)?|メイン|主/i, 'うｐ主'],
      'UP主': [/(アップ|up)(マスター|メイン)?|メイン|主/i, 'うｐ主'],
      '主播': [/アンカー|オーナー/, '配信主'],
      '虚拟': [/(虚偽|虚似|虚俗|偽|仮想)(の)?/, 'バーチャル'],
      '穿模': [/金型|カビを着用/, 'モデル'],
      '安全裤': [/安全(ズボン|パンツ)/, 'スパッツ'],
      // 当て字
      '欧拉': [/(オイラー|オウラ)(、)?/g, 'オラ'],
      '木大': [/大きな木|ウッドビッグ|ムダ/g, '無駄'],
      '赛高': [/サイガオ|さいがお|試合高|高(いです)?|最盛期/, '最高'],
      '拜拜': [/さようなら|^バイ$/, 'バイバイ'],
      '奶思': [/ミルク思考|ミルクは思った/, 'ナイス'],
      '奶声': [/ミルクの声|牛乳音/, 'ナイス'],
      '奶死': [/ミルクデス|サックル|吸う|(牛乳|ミルク)(が|は)死(んだ|んでいる|んでいます|ぬ)|死ぬまでの乳/, 'ナイスデス'],
      '牙白': [/歯の白|白い歯|白|ホワイト/, 'やばい'],
      '纳尼': [/なな|ナニ|にに|Nani/ig, 'なに'],
      '贴贴': [/ステッカー|それを固執する|投稿|貼付|役職/, 'てぇてぇ'],
      '干巴爹': [/ドライ|ドライパパ/, 'ガンバレ'],
      '霓虹金': [/ネオンゴールド/, 'ニホンジン'],
      '咋瓦鲁多': [/咋ヴァルド|フアン・ヴァルド|ザバルド/, 'ザ・ワールド'],
      '咋，瓦鲁多': [/悲しいかな、ヴァルド|うん、ヴァルド/, 'ザ・ワールド'],
      '斯哈斯哈': [/シャスカ|ハシャ|シハハ|Sihasha|シャシャ/, 'スハスハ'],
      '嘶哈嘶哈': [/ヒップホップヒップホップ|ハハハッハッハ/, 'スハスハ'],
      '昆卡昆卡': [/クエンカ(、)?クエンカ/, 'クンカクンカ'],
      '压力马斯内': [/突然の圧力|プレッシャー(マス(ヌ|ネ)|スニーク)|圧力マネット/, 'やりますねぇ'],
      '压力马斯奈': [/(プレッシャー|圧力)マスネイ|ストレスマネット/, 'やりますねぇ'],
      '亚拉那一卡': [/ヤラナ(カード)?|Yalanaからのカード/, 'やらないか'],
      '妮可妮可妮': [/ニコールニコール/, 'にっこにっこにー'],
      // スラング
      '谢谢茄子': [/(ナス|茄子)(を)?ありがとう|ありがとうナス/, 'ありがとナス'],
      '謝謝茄子': [/(ナス|茄子)(を)?ありがとう|ありがとうナス/, 'ありがとナス'],
      '太草': [/草が多すぎる/, '大草原'],
      '鬼畜': [/ゴースト(アニマル)?|幽霊|幽霊動物/, 'MAD'],
      '沙雕': [/砂(の)?彫刻|サンドカービング/, 'あほ'],
      '口区': [/口の面積|口地域|口元(エリア)?/, 'ヴォエ'],
      '手冲': [/ハンドパンチ/, '手コキ'],
      '冲国': [/チョング(オ|ァ)|チョン(オ)?|Chongguo|忠国|急ぐ国|崇国/, 'チューゴク'],
      '康康': [/カンカン(させて(ください)?|が欲しい)/, 'ほら見せろよ'],
      '人类一败涂地': [/男は敗北|人間は敗北します|敗北した人間|人類は完全な失敗でした/, '人類は一敗地にまみれた'],
      '牛逼': [/ニウビ|ニー|強気|ヤク|驚くばかり/, 'すごい'],
      '牛批': [/牛が承認されました|(牛|ビーフ)バッチ/, 'すごい'],
      '棒棒哒': [/スティック|すごい/, 'しゅごい'],
      '白给': [/ホワイト(ギブ|がくれた)?|白|無料で/, '無駄死に'],
      '什么鬼': [/何ゴースト|なんて幽霊|なんてこったい/, 'なんだこれ'],
      '单推': [/(シングル|ワン)?(プッシュ|クリック)|单推|片押し/, '単推し'],
      '烤肉': [/バーベキュー|肉のグリル/, '焼肉'],
      '石油佬': [/石油|油(いかだ)?|いかだ|オイル(佬)?/, '石油王'],
      '大佬': [/ダクシー|ダキシー|ダラット|ダウェイ|Daxie|(大|ビッグ)(ショー|big|佬)|大きい|ビッグ|大学ビル|ギャングスター/, 'ニキ'],
      'C位': [/C(ビット|ポジション)?/i, 'センター'],
      'c位': [/C(ビット|ポジション)?/i, 'センター'],
      '打Call': [/(お)?電話(をかける|する|ください)|呼ぶ|コール/, 'コールする'],
      '打call': [/(お)?電話(をかける|する|ください)|呼ぶ|コール/, 'コールする'],
      // 超意訳
      '酸死了': [/痛い|酸っぱい/, '裏山死'],
      '酸了': [/(私は)?酸っぱい(です)?|サワー/, '裏山'],
      '开口跪': [/オープニング|ひざを開いて|ひざまずく/, '（ﾟДﾟ）'],
      '才八点': [/(たった|わずか)8(時|つ)|(八|8)時だけ/, 'はえーよ'],
      '才8点': [/(たった|わずか)8(時|つ)|(八|8)時だけ/, 'はえーよ'],
      '光速下播': [/光速で放送する|光速でダウンキャスト/, '急にオワタ'],
      '火钳刘明': [/((火)?トング|ファイアークランプ)劉明|桐劉明/g, '記念カキコ'],
      '疑车无据': [/証拠がないと疑われる車|車は根拠のないですか|証拠のない疑わしい車/, '下ネタ疑惑'],
      '前方高能': [/(先に|今後の)?高エネルギー(先)?(警告)?/, 'くるぞ'],
      '这不是演习': [/これは(練習|ドリル)では(ありません|ないことに注意してください)/, 'これは演習ではない'],
      // 翻訳不能＼(^o^)／
      '臣卜木曹': [/(チェン・ブカオ|Chen Bumu Cao)|陳文武曹/, '（ﾟДﾟ）'],
      '卧槽...': [/(横になって(いる)?|横)?トラフ(に横たわって|に横になっています)?|クソ/, '（ﾟДﾟ）...'],
      '卧槽': [/(横になっている)?トラフ(に横たわって|は|で|の)?|横になって|横溝|クソ/, '（ﾟДﾟ）!?'],
      // awsl
      '阿伟死了': [/アウェイは死んだ|魏は死ん(でいる|だ)/, 'awsl'],
      '阿伟输了': [/アウェイは負けた|魏は失った/, 'awsl'],
      '阿伟爽了': [/アウェイはかっこいい|魏がかっこいい/, 'awsl'],
      '阿伟射了': [/アウェイショット|ウェイショット/, 'awsl'],
      '阿伟少林': [/アウェイ少林|魏少林寺/, 'awsl'],
      '啊我睡了': [/あ、寝てる|ああ、私は寝ました。/, 'awsl'],
      '爱我苏联': [/ソビエトを愛して|(私を愛して)?ソビエト連邦(を愛してください)?/, 'awsl'],
      '奥维丝丽': [/オヴィスリ|オビスリ/, 'awsl'],
      '阿伟乱葬岗': [/アウェイ大量埋葬地|アウェイマスグレイブ/, 'awsl墓地'],
      '阿伟乱葬场': [/アウェイ大量埋葬地|魏古墳/, 'awsl墓地'],
      // 固有名詞
      '谷酱': [/バレーソース|谷/, 'グーグルちゃん'],
      'goo酱': [/グーソース/, 'Googleちゃん'],
      '油管': [/(オイル|(石)?油)パイプ|管|チューブ|チュービング/, 'YouTube'],
      '京阿尼': [/ジャンニ|ジン(・)?アニ|ジンガニ|ジンギ|キナーニ|Jing Ani|Jingani|京阿尼|京安尼|神谷/, '京アニ'],
      '诸葛孔明': [/Zhuge Kongming|ジュージュコミング/, '諸葛孔明'],
      '孔明': [/Kong Ming|コミング|コング(・)?ミン/, '孔明'],
      '奥特曼': [/アルトマン|Altman/, 'ウルトラマン'],
      // キズナアイ
      '绊爱酱': [/木内醤油|ラブソース|ソースが大好き(です)?/, 'キズナアイちゃん'],
      '爱酱': [/(ラブ)?ソース|Love Sauce/g, 'アイちゃん'],
      // 白上フブキ
      '白上吹雪': [/白で(雪を)?吹(く)?雪|白雪姫/g, '白上フブキ'],
      '吹雪酱': [/吹雪ソース/g, 'フブキちゃん'],
      // リブドル
      '战斗吧歌姬': [/戦う、歌手|歌手と戦(う|ってください)|歌手との戦い/, 'リブドル'],
      'Swan': [/白鳥/, 'スワン'],
      'swan': [/白鳥/, 'スワン'],
      '罗兹': [/ロードス(島)?|ウッチ|Rhodes|Roz/ig, 'ローズ'],
      '神宫司': [/神社|神宮課|神宮シー/g, '神宮司'],
      '玉藻': [/ゆう(ざお|ぞう)|遊蔵|翡翠(藻)?|玉藻|玉|藻|湯田|遊戯王|裕蔵|湯蔵|ug尾|Yuzao|Yugao/g, '玉藻'],
      '清歌': [/清歌|(Li )?Qingge|Qing Ge|(清の)?歌|(クリアな)?(曲|歌)|(クリア)?ソング|クリア|チンゲ/g, '清歌'],
      '清哥': [/清歌|Qingge|Qing Ge|清の(兄弟|兄|弟)|チンゲ/g, '清歌'],
      '墨汐': [/キモシー|インク(兄弟)?|モク|墨汐|Mo (Yan|Zhen)|Moxi/g, 'モーシィ'],
      '卡缇娅': [/ケイヤ|カヤ|キャシー|Kayya|Katya|缇卡缇娅|缇卡娅娅/ig, 'カティア'],
      '鸭鸭': [/アヒル(と|や|に)アヒル|アヒル|あひる/g, '鴨鴨'],
      '伊莎贝拉': [/イザベラ/g, 'イザベラ'],
      '贝拉拉': [/ベララ|ベッラーラ|Bellala/g, 'ベララ'],
      // Overidea
      '张京华': [/張景華|張晶華|チャン静華|チャンジンファ|(Zhang )?Jinghua/, '張京華'],
      '京华': [/金華|晶華|景華|清華|ジンファ|Jinghua/, '京華'],
      '谢拉': [/ありがとう|シ(ー)?ラ|シェ(イ)?ラ|セラ|ゼラ|Sheila|Shera|Sierra|Xie( La)?|謝(La|ラ)?|谢拉/i, 'シエラ'],
      '謝拉': [/ありがとう|シ(ー)?ラ|シェ(イ)?ラ|セラ|ゼラ|Sheila|Shera|Sierra|Xie( La)?|謝(La|ラ)?|谢拉/i, 'シエラ'],
      '米娅': [/アミア|Mia/i, 'ミア'],
      // 織田信姫
      '信姬': [/しんひめ|Xin Ji|Xinji|新(地|自)/i, '信姫'],
      // 朝ノ姉妹
      '瑠璃': [/ルリ|(着色)?ガラス|Liuli/i, '瑠璃'],
      // 神楽めあ
      'mea酱': [/(ミート|ミース|メア)ソース/ig, 'めあちゃん'],
      // 湊あくあ
      '阿库娅': [/アクア|あくや|阿久谷|Akuya|Akua/ig, 'あくあ'],
      // 猫宮ひなた
      '猫宫酱': [/猫(の)?宮殿ソース|猫パレスソース/ig, '猫宮ちゃん'],
      '猫宫': [/猫(の)?宮殿|キャットパレス|Cat Palace/ig, '猫宮'],
      '貓宮': [/猫(の)?宮殿|キャットパレス|Cat Palace/ig, '猫宮'],
      'Hinata酱': [/(ひなた|日向|Hinata)(ソース|醤油|たれ)/ig, 'ひなたちゃん'],
      'hinata酱': [/(ひなた|日向|Hinata)(ソース|醤油|たれ)/ig, 'ひなたちゃん'],
      'HINATA酱': [/(ひなた|日向|Hinata)(ソース|醤油|たれ)/ig, 'ひなたちゃん'],
      // 物述有栖
      '爱丽丝酱': [/アリスソース/g, 'ありすちゃん'],
      // 宝鐘マリン
      '宝钟玛琳': [/バオ・ゾン・マー・リン|バオ・チョン・マーリン|バオゾンマリン/, '宝鐘マリン'],
      '宝钟': [/トレジャーベル|バオ・ゾン/, '宝鐘'],
      '玛琳': [/マリリン|マレーネ/, 'マリン'],
      // Paryi
      '迷迭迷迭': [/ローズマリー/, '見て見て'],
      '帕里桑': [/パリサン|プリッサン|パリジャン|Parrysan/g, 'Paryiさん'],
      '帕里': [/パリ(ー)?|Parry/g, 'Paryi'],
      'Paryi': [/パリリ|パリイ/g, 'Paryi'],
      'paryi': [/パリリ|パリイ/g, 'Paryi'],
      // 米米米
      '米米米': [/ミミ/, '米米米'],
      '光姬': [/光姬|広([智義治地域島姫])|光栄|姫路|グァンジ|ガンジー|ジジ|ジグ|チジ|Guang( )?Ji|Gigi Hime/ig, 'つや姫'],
      '光酱': [/(ライト|軽い)ソース/, 'つやちゃん'],
      '萌实里': [/モーシリ|メン(シリ|グリ)|Meng Shili/, '萌えみのり'],
      'Milky女王': [/(ミルキー|ミルク|牛乳)(の)?女王/, 'ミルキークイーン'],
      'milky女王': [/(ミルキー|ミルク|牛乳)(の)?女王/, 'ミルキークイーン'],
      'Milky公主': [/プリンセスミルキー|ミルキー(プリンセス|姫)|乳白色の王女/, 'ミルキークイーン'],
      'milky公主': [/プリンセスミルキー|ミルキー(プリンセス|姫)|乳白色の王女/, 'ミルキークイーン'],
      // 麟犀AI韻律(直感アルゴリズム)
      '麟犀': [/(Lin|ユニコーン|リン|林)(\s|・)?(Xi|X|Rhino|サイ|ライノ)|リン・シー/, '麟犀'],
      // 洛天依
      '洛天依': [/羅天(一)?|Luotianyi/, '洛天依'],
      // Siva
      'Siva小虾鱼': [/シバエビ(の魚)|シバ小エビ魚|Siva Shrimp Fish/, 'Sivaえび'],
      'siva小虾鱼': [/シバエビ(の魚)|シバ小エビ魚|Siva Shrimp Fish/, 'Sivaえび'],
      '虾虾': [/えび(と|や|、)えび|エビ(と|や|、)エビ|海老(と|や|、)海老|Shrimp and Shrimp|えび|エビ/, 'えびえび'],
      '雪风': [/雪風|雪の風|雪|風|スノーウィンド/, '雪風'],
      // 七柠
      '七柠': [/([7七][個つ]の|セブン)レモン/g, '七柠'],
      '柠哥': [/(レモン|ゲ|Ge)?(ブラザー|兄弟|Ning )(ゲ|Ge)?/g, 'レモニキ'],
      // ビリビリ
      '哔哩哔哩': [/(哔)+(哩)+|こんにちは|ビ(ブ)?リリ/, 'ビリビリ'],
      'bilibili': [/Bilibili|ビリビリ|ビ(ブ)?リリ/, 'bilibili'],
      'B站': [/駅B|B駅|(B|ビー)ステーション|ステーションB|駅/i, 'ビリビリ'],
      'b站': [/駅b|b駅|(b|ビー)ステーション|ステーションB|駅/i, 'ビリビリ'],
      '舰长': [/船長|キャプテン/, '艦長'],
      '提督': [/提督/, '提督'],
      '总督': [/総督|知事/, '総督'],
      '友爱社': [/愛の友達|友情協会|Youaishe/, '友愛社'],
      '粉丝勋章': [/ファンメダル/, 'ファンバッジ'],
      '金瓜子': [/(ゴールデン|金)(メロン|かぼちゃ)の種/, '金瓜子'],
      '银瓜子': [/(シルバー|銀)メロンの種/, '銀瓜子'],
      '瓜子': [/メロンの種/, '瓜子'],
      '辣条': [/(スパイシー|ホット|辛い)(な)?(ストリップ|バー|食べ物)/, '辣条'],
      '关注': [/注意|注目|懸念|心配(されている|する)/, 'フォロー'],
      // 禁断の一字置換
      '酱': [/ソース/g, 'ちゃん'],
      '强': [/(ストロング|強い)(.+)(ストロング|強い)/g, '強 $1 強'],
    },
    en: {
      '草': [/grass/, 'lol'],
    },
  };
  const REGEXP = {
    hasKana: /[ぁ-んァ-ン]/,
    allAlphabet: /^[a-zA-Z0-9,.'"!?\s]+$/,
    allEmoji: /^(\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]|\ud7c9[\ude00-\udeff]|[\u2600-\u27BF])+$/,
  };
  const RETRY = 10;
  let sites = {
    video: {
      targets: {
      },
      translationTargets: [
        [false, () => $('title')],
        [false, () => $('#app')],
      ],
      get: {
        videoDanmaku: () => $('.bilibili-player-video-danmaku'),/* div or canvas */
        commentlistApi: (cid) => COMMENTLISTAPI.replace('{cid}', cid),
        cid: (url) => /cid(?::|%3A|=)[0-9]+/.test(url) ? url.match(/cid(?::|%3A|=)([0-9]+)/)[1] : '0',
        danmakuInput: () => $('input.bilibili-player-video-danmaku-input'),
      },
      set: {
        danmakuTypeCSS: (callback) => {
          let danmakuSetting = $('.bilibili-player-video-danmaku-setting');
          if(danmakuSetting === null) return log('danmakuSetting not found.');
          danmakuSetting.dispatchEvent(new MouseEvent('mouseover'));
          danmakuSetting.dispatchEvent(new MouseEvent('mouseout'));
          animate(function(){
            let danmakuTypeCSS = $('li.bui-select-item[data-value="div"]');
            if(danmakuTypeCSS === null) return log('Can\'t find CSS3 setting.');
            danmakuTypeCSS.click();
            log('Set to CSS3.');
            callback();
          });
        },
      },
    },
    bangumi: {
      targets: {
      },
      translationTargets: [
        [false, () => $('title')],
        [false, () => $('#app')],
      ],
      get: {
        videoDanmaku: () => $('.bilibili-player-video-danmaku'),/* div or canvas */
        commentlistApi: (cid) => COMMENTLISTAPI.replace('{cid}', cid),
        cid: (url) => /cid(?::|%3A|=)[0-9]+/.test(url) ? url.match(/cid(?::|%3A|=)([0-9]+)/)[1] : '0',
        danmakuInput: () => $('input.bilibili-player-video-danmaku-input'),
      },
      set: {
        danmakuTypeCSS: (callback) => {
          let danmakuSetting = $('.bilibili-player-setting-btn');
          if(danmakuSetting === null) return log('danmakuSetting not found.');
          danmakuSetting.click();
          animate(function(){
            let danmakuSettingClose = $('.bilibili-player-setting .bilibili-player-panel-back');
            let danmakuType = $('.bilibili-player-setting-type');
            if(danmakuType === null) return log('Can\'t find danmakuType setting.');
            danmakuType.click();
            animate(function(){
              let danmakuTypeCSS = $('li.bpui-selectmenu-list-row[data-value="div"]');
              if(danmakuTypeCSS === null) return log('Can\'t find CSS3 setting.');
              danmakuTypeCSS.click();
              danmakuSettingClose.click();
              log('Set to CSS3.');
              callback();
            });
          });
        },
      },
    },
    live: {
      targets: {
        operableContainer: () => $('.bilibili-live-player-video-operable-container'),/*特殊弾幕枠*/
        chatHistoryList: () => $('#chat-history-list'),
        chatActions: () => $('#chat-control-panel-vm .bottom-actions'),
      },
      translationTargets: [
        [false, () => $('title')],
        [false, () => $('.live-room-app')],
        [  true,  () => $('.bilibili-live-player-video-controller')],/*プレイヤ内コントローラ*/
        [    false, () => $('.bilibili-live-player-video-controller-duration-btn > div > span')],
        [  true,  () => $('#chat-control-panel-vm')],/*投稿欄内コントローラ*/
        [    false, () => $('#chat-control-panel-vm textarea')],
        [    false, () => $('#chat-control-panel-vm .bottom-actions')],
      ],
      get: {
        videoDanmaku: () => $('.bilibili-live-player-video-danmaku'),
        operableSpace: (operableContainer) => operableContainer.querySelector('#pk-vm ~ div[style*="height:"]'),
        danmakuInput: () => $('textarea.chat-input'),/*divからtextareaに置換される*/
      },
    },
  };
  let html, elements = {}, timers = {}, sizes = {}, site;
  let translator, translations = {}, cid;
  class Packet{
    /* Bilibili Live WebSocket message packet */
    /* thanks to:
      https://segmentfault.com/a/1190000017328813
      https://blog.csdn.net/xuchen16/article/details/81064372
      https://github.com/shugen002/userscript/blob/master/BiliBili%20WebSocket%20Proxy%20Rebuild.user.js
    */
    constructor(buffer){
      Packet.VERSION_COMPRESSED = 2;/* protocol version for compressed body */
      Packet.OPERATION_COMMAND = 5;/* operation type for command */
      Packet.COMMAND_DANMAKU = 'DANMU_MSG';/* command code for 弾幕(danmaku/danmu) */
      this.buffer = buffer;
      this.dataView = new DataView(buffer);
      this.views = {
        package:   this.dataView.getUint32(0),/* packet length */
        header:    this.dataView.getUint16(4),/* header length = offset for body */
        version:   this.dataView.getUint16(6),/* protocol version */
        operation: this.dataView.getUint32(8),/* operation type */
      };
      try{
        this.array = this.getArray();
        this.messages = this.getMessages();
      }catch(e){
        log(e, this.views, new Uint8Array(this.buffer));
      }
    }
    getArray(){
      return (this.isCompressed)
        ? pako.inflate(new Uint8Array(this.buffer, this.views.header))
        : new Uint8Array(this.buffer)
      ;
    }
    getMessages(){
      let dataView = new DataView(this.array.buffer);
      let messages = [], headerLength = this.views.header, decoder = new TextDecoder();
      for(let pos = 0, packetLength = 0; pos < this.array.length; pos += packetLength){
        packetLength = dataView.getUint32(pos);
        let subarray = this.array.subarray(pos + headerLength, pos + packetLength);
        let string = decoder.decode(subarray);
        messages.push(string[0] === '{' ? JSON.parse(string) : string);
      }
      return messages;
    }
    getDanmakuContents(){
      return this.getDanmakus().map(d => {
        if(d.info === undefined) return log('Unexpected Danmaku JSON.', d), null;
        return d.info[1];
      });
    }
    getDanmakus(){
      if(this.isCommand === false) return [];
      return this.messages.filter(m => {
        if(m.cmd === undefined) return log('Unexpected Command JSON:', m), false;
        return m.cmd.startsWith(Packet.COMMAND_DANMAKU);
      });
    }
    get isCompressed(){
      return (this.views.version === Packet.VERSION_COMPRESSED);
    }
    get isCommand(){
      return (this.views.operation === Packet.OPERATION_COMMAND);
    }
  }
  class Translator{
    /* Danmaku translator using the browser's auto translation */
    constructor(){
      Translator.TRANSLATIONSATONCE = TRANSLATIONSATONCE;
      Translator.TRANSLATIONSINTERVAL = TRANSLATIONSINTERVAL;
      Translator.HISTORYLENGTH = HISTORYLENGTH;
      Translator.TRANSLATIONEXPIRED = TRANSLATIONEXPIRED;
      Translator.DICTIONARY = DICTIONARIES[USERLANGUAGE] || DICTIONARIES[USERLANGUAGE.substring(0, 2)] || {};
      Translator.MODIFICATIONS = MODIFICATIONS[USERLANGUAGE] || MODIFICATIONS[USERLANGUAGE.substring(0, 2)] || {};
      Translator.MODIFICATIONSKEYS = Object.keys(Translator.MODIFICATIONS);
      Translator.WAITING_LIMIT = WAITING_LIMIT;
      this.counters = {pushes: 0, registerTranslations: 0, fails: 0};
      this.dictionary = this.getDictionary();
      this.history = Storage.read('history') || [];
      this.priorDanmaku = this.createPriorDanmaku();
      this.priorDanmakuWaitings = {};/* waiting for getting translated */
      this.priorDanmakuRequested = 0;/* last requested time */
      this.priorDanmakuQueue = [];/* queue for preventing multiple request in TRANSLATIONSINTERVAL */
      this.timer = 0;/* timer to next TRANSLATIONSINTERVAL */
      this.danmakuWaitings = {};/* waiting for getting translation */
    }
    getDictionary(){
      /* use browser language dictionary */
      let dictionary;
      if(Storage.read('USERLANGUAGE') !== USERLANGUAGE) dictionary = Translator.DICTIONARY;
      else dictionary = Storage.read('dictionary') || Translator.DICTIONARY;
      Storage.save('USERLANGUAGE', USERLANGUAGE);
      dictionary = this.updateDictionary(dictionary);
      return dictionary;
    }
    updateDictionary(dictionary){
      /* update structure (2019/6/11) */
      let keys = Object.keys(dictionary);
      if(typeof dictionary[keys[0]] === 'string') keys.forEach(key => {
        dictionary[key] = [dictionary[key], 1, NOW];
      });
      /* update key (2019/6/23) */
      let oldKey = 'BilibiliLiveCommentTranslator';
      let oldDictionary = localStorage[`${oldKey}-dictionary`], oldHistory = localStorage[`${oldKey}-history`];
      if(oldDictionary && oldHistory){
        dictionary = JSON.parse(oldDictionary).value;
        this.history = JSON.parse(oldHistory).value;
        localStorage.removeItem(`${oldKey}-dictionary`);
        localStorage.removeItem(`${oldKey}-history`);
      }
      return dictionary;
    }
    createPriorDanmaku(){
      /* Append danmaku comments from WebSocket for translating by browser as fast as possible */
      let priorDanmaku = elements.priorDanmaku = createElement(core.html.priorDanmaku());
      window.top.document.body.appendChild(priorDanmaku);
      return priorDanmaku;
    }
    pushAll(originals){
      originals.forEach(o => this.push(o));
      this.throttle();
    }
    push(original){
      this.counters.pushes++;
      if(this.dictionary[original] !== undefined) return this.dictionary[original][1]++;/* already exists in the dictionary */
      if(this.priorDanmakuQueue.includes(original) === true) return;/* already queued */
      if(this.priorDanmakuWaitings[original] !== undefined) return;/* already waiting for translation */
      if(this.shouldBeTranslated(original) === false) return;/* seems not to be Chinese */
      this.priorDanmakuQueue.push(original);
    }
    throttle(){
      if(this.priorDanmakuQueue.length === 0) return;
      /* throttle for single waiting query to Chrome Translation */
      if(this.priorDanmaku.children.length > 0) return;
      /* throttle for TRANSLATIONSINTERVAL */
      let now = Date.now(), elapsed = now - this.priorDanmakuRequested;
      clearTimeout(this.timer);
      if(elapsed <= Translator.TRANSLATIONSINTERVAL){
        this.timer = setTimeout(() => this.putOnPriorDanmaku(), Translator.TRANSLATIONSINTERVAL - elapsed);
      }else{
        this.putOnPriorDanmaku();
      }
    }
    putOnPriorDanmaku(){
      log('priorDanmakuQueue:', this.priorDanmakuQueue.length, this.priorDanmakuQueue);
      this.priorDanmakuRequested = Date.now();
      let putOnce = this.putOnPriorDanmaku.putOnce ? true : false;/* it can put more only on first time */
      let atOnce = putOnce ? Translator.TRANSLATIONSATONCE : 10*1000;
      let fragment = document.createDocumentFragment();
      this.priorDanmakuQueue.reverse();/* from latest danmaku */
      for(let i = 0, original; original = this.priorDanmakuQueue[i]; i++){
        if(atOnce <= i) break;
        let li = createElement(core.html.danmakuContent(original));
        this.priorDanmakuWaitings[original] = li;
        fragment.appendChild(li);
        /* Observe auto translation by browser */
        let observer = observe(li, (records) => {
          //log('Got translated:', original);
          this.registerTranslation(original, li.textContent);
          this.removeWaiting(original, li, observer);
          this.throttle();
        }, {childList: true, characterData: true, subtree: true});
        /* Time to give up */
        setTimeout(() => {
          if(li && li.isConnected){
            log('Give up for waiting translated:', original);
            this.counters.fails++;
            this.removeWaiting(original, li, observer);
          }
        }, (putOnce) ? Translator.WAITING_LIMIT : 60*60*1000);
      }
      //log(Array.from(fragment.children).map(c => c.textContent));
      this.priorDanmaku.appendChild(fragment);
      this.priorDanmakuQueue = [];/* dropped */
      this.putOnPriorDanmaku.putOnce = true;
    }
    registerTranslation(original, translation){
      this.counters.registerTranslations++;
      this.dictionary[original] = [translation, 1, Date.now()];
      this.history.push(original);
      /* append the translation for each streaming danmakus */
      if(this.danmakuWaitings[original]){
        this.danmakuWaitings[original].forEach(d => this.appendTranslation(d, translation));
        delete this.danmakuWaitings[original];
      }
    }
    removeWaiting(original, span, observer){
      observer.disconnect();
      span.parentNode.removeChild(span);
      delete this.priorDanmakuWaitings[original];
    }
    requestTranslation(danmaku){
      if(this.shouldBeTranslated(danmaku.textContent) === false) return;/* seems not to be Chinese */
      if(this.dictionary[danmaku.textContent] === undefined){
        if(this.danmakuWaitings[danmaku.textContent] === undefined) this.danmakuWaitings[danmaku.textContent] = [];
        this.danmakuWaitings[danmaku.textContent].push(danmaku);
      }else{
        if(danmaku.textContent === this.dictionary[danmaku.textContent][0]) return;/* original and translation are the same */
        this.appendTranslation(danmaku, this.dictionary[danmaku.textContent][0]);
      }
      //log(danmaku.textContent, 'should be translated.')
    }
    appendTranslation(danmaku, translation){
      //log(danmaku.textContent, translation);
      /* it's better to modify before writing to dictionary, but MODIFICATIONS may often be updated */
      Translator.MODIFICATIONSKEYS.filter(key => danmaku.textContent.includes(key)).forEach(key => {
        if(DEBUG && Translator.MODIFICATIONS[key][0].test(translation) === false) log(
          'Doesn\'t match:', danmaku.textContent, key, translation, Translator.MODIFICATIONS[key],
        );
        translation = translation.replace(Translator.MODIFICATIONS[key][0], Translator.MODIFICATIONS[key][1]);
      });
      danmaku.appendTranslation(translation);
    }
    shouldBeTranslated(textContent){
      switch(true){
        case(this.dictionary[textContent] !== undefined):/* has a translation */
          return true;
        case(textContent.match(REGEXP.hasKana) !== null):/* seems to be Japanese */
        case(textContent.match(REGEXP.allAlphabet) !== null):/* seems to be English */
        case(textContent.match(REGEXP.allEmoji) !== null):/* seems to be Emoji */
          return false;
        default:
          return true;
      }
    }
    save(){
      /*  log usage statistics */
      let c = this.counters, saved = (((c.pushes - c.fails - c.registerTranslations)/((c.pushes - c.fails) || 1))*100).toFixed(0) + '%';
      log('Total danmaku:', c.pushes, 'Newly translated:', c.registerTranslations, 'Saved:', saved, 'Fails:', c.fails);
      /* save the dictionary and the history of latest HISTORYLENGTH pairs */
      let newDictionary = {}, newHistory = [];
      for(let i = this.history.length - 1, count = 0, now = Date.now(); 0 <= i; i--){
        if(this.dictionary[this.history[i]] === undefined){
          log('Unknown history', this.history[i]);
          continue;
        };
        if(this.dictionary[this.history[i]][2] < now - Translator.TRANSLATIONEXPIRED) continue;/* old data */
        if(newDictionary[this.history[i]] !== undefined) continue;/* duplicated in the history */
        newDictionary[this.history[i]] = this.dictionary[this.history[i]];
        newHistory[count] = this.history[i];
        if(count++ === Translator.HISTORYLENGTH) break;
      }
      /* keep the default dictionary */
      Object.keys(Translator.DICTIONARY).forEach(key => {
        newDictionary[key] = newDictionary[key] || Translator.DICTIONARY[key];
      });
      log('Dictionary length:', newHistory.length, 'Stored size:', toMetric(JSON.stringify(newDictionary).length * 2) + 'bytes');
      Storage.save('dictionary', newDictionary);
      Storage.save('history', newHistory.reverse());
    }
  }
  class Danmaku{
    constructor(danmaku){
      Danmaku.zIndex = Danmaku.zIndex || 1;
      this.element = danmaku;
      this.textContent = danmaku.textContent;
      this.modify();
    }
    modify(){
      this.element.style.zIndex = parseInt(this.element.style.zIndex || 0) + Danmaku.zIndex++;/* newer comments have priority */
      /* Make space for appending translation text */
      this.element.style.top = (() => {
        if(this.element.style.top === '') return;
        let operableContainer = elements.operableContainer, operableSpace = operableContainer ? site.get.operableSpace(operableContainer) : null;
        if(this.element.style.top[0] === '-' || operableSpace === null || operableSpace.children.length === 0 || operableSpace.style.height === ''){
          return (parseFloat(this.element.style.top) * 2) + 'px';
        }else{
          let height = parseFloat(operableSpace.style.height), top = parseFloat(this.element.style.top);
          return (height + ((top - height) * 2)) + 'px';
        }
      })();
      /* Even if double long translation text added, keep streaming to completely go away */
      this.element.style.transitionDuration = ((transitionDuration) => {
        if(transitionDuration === '') return;
        let m = transitionDuration.match(/([0-9.]+)(m?s)/);
        if(m === null) return log('Unknown transitionDuration format:', transitionDuration), transitionDuration;
        return (parseFloat(m[1]) * 2) + m[2];
      })(this.element.style.transitionDuration);
      this.element.style.transform = ((transform) => {
        if(transform === '') return;
        let m = transform.match(/(translateX?)\(([-0-9.]+)(px)/);
        if(m === null) return log('Unknown transform format:', transform), transform;
        return transform.replace(m[0], `${m[1]}(${parseFloat(m[2]) * 2}${m[3]}`);
      })(this.element.style.transform);
    }
    appendTranslation(translation){
      let span = createElement(core.html.translation(translation));
      this.element.appendChild(span);
      span.animate([{opacity: `0`},{opacity: `1`}], {duration: 500, fill: 'forwards'});
      this.element.addEventListener('transitionend', (e) => {
        span.animate([{opacity: `1`},{opacity: `0`}], {duration: 500, fill: 'forwards'});
      }, {once: true});
    }
    get hasTranslation(){
      /* bilibili removes previous translation element when the danmaku element has reused */
      return (this.element.querySelector('.translation') === null) ? false : true;
    }
  }
  let core = {
    initialize: function(){
      html = document.documentElement;
      html.classList.add(SCRIPTNAME);
      switch(true){
        case(location.href.match(/^https:\/\/www\.bilibili\.com\/video\/[a-zA-Z0-9]+/) !== null):
        case(location.href.match(/^https:\/\/www\.bilibili\.com\/medialist\/play\/.+/) !== null):
          site = sites.video;
          translator = new Translator();
          core.listenXMLHttpRequests();
          core.targetTranslation();
          setTimeout(core.readyForVideo, 3000);/*videoDanmaku要素の種類が遅延して反映される*/
          break;
        case(location.href.match(/^https:\/\/www\.bilibili\.com\/bangumi\/play\/[a-zA-Z0-9]+/) !== null):
          site = sites.bangumi;
          translator = new Translator();
          core.listenXMLHttpRequests();
          core.targetTranslation();
          setTimeout(core.readyForVideo, 3000);/*videoDanmaku要素の種類が遅延して反映される*/
          break;
        case(location.href.match(/^https:\/\/live\.bilibili\.com\/[0-9]+/) !== null):
        case(location.href.match(/^https:\/\/live\.bilibili\.com\/blanc\/[0-9]+/) !== null):
          site = sites.live;
          translator = new Translator();
          core.listenWebSockets();
          core.targetTranslation();
          core.readyForLive();
          break;
        default:
          return log('Bye.');
      }
      core.observeHead();
      core.readyForUnload();
      core.export();
    },
    readyForVideo: function(){
      if(document.hidden) return setTimeout(core.readyForVideo, 1000);
      core.getTargets(site.targets, RETRY).then(() => {
        log("I'm ready for Video.");
        core.translateUserInterface();
        core.setDanmakuSettings();
        core.observeVideoDanmaku();
        core.modifyDanmakuInput();
        core.addStyle('topStyle', window.top);
        core.addStyle();
      });
    },
    readyForLive: function(){
      if(document.hidden) return setTimeout(core.readyForVideo, 1000);
      core.getTargets(site.targets, RETRY).then(() => {
        log("I'm ready for Live.");
        core.translateUserInterface();
        core.observeVideoDanmaku();
        core.modifyDanmakuInput();
        core.addStyle('topStyle', window.top);
        core.addStyle();
      });
    },
    observeHead: function(){
      /* URL変化の検出の代替 */
      let head = $('head'), url = location.href;
      let observer = observe(head, function(records){
        if(url === location.href) return;
        log('URL has changed:', location.href);
        url = location.href;
        log(head);
        observer.disconnect();
        core.initialize();
      }, {childList: true, characterData: true, subtree: true});
    },
    targetTranslation: function(){
      const setTranslate = function(element){
        element.classList.add('translate');
        element.translate = true;
      };
      const setNoTranslate = function(element){
        element.classList.add('notranslate');
        element.translate = false;
      };
      for(let i = 0, target; target = site.translationTargets[i]; i++){
        if(target[1]() === null) return setTimeout(core.targetTranslation, 1000);
        if(target[0] === true) setTranslate(target[1]());
        else setNoTranslate(target[1]());
      }
    },
    translateUserInterface: function(){
      translations = TRANSLATIONS[USERLANGUAGE] || TRANSLATIONS[USERLANGUAGE.substring(0, 2)] || TRANSLATIONS.en;
      /*置換したりobserveしたりする・・・かもしれない*/
    },
    listenXMLHttpRequests: function(){
      /* 公式の通信内容を取得 */
      window.XMLHttpRequest = new Proxy(XMLHttpRequest, {
        construct(target, arguments){
          const xhr = new target(...arguments);
          //log(xhr, arguments);
          xhr.addEventListener('load', function(e){
            //log(xhr.responseURL);
            if(xhr.responseURL.startsWith(PLAYERAPI) === false) return;
            cid = site.get.cid(xhr.responseURL);
            core.getDanmakuList();
          });
          return xhr;
        }
      });
    },
    getDanmakuList: function(){
      let api = site.get.commentlistApi(cid);
      fetch(api, {credentials: 'include', mode: 'cors'})
      .then(response => response.text())
      .then(text => new DOMParser().parseFromString(text, 'text/xml'))
      .then(d => {
        let ds = d.querySelectorAll('d');
        if(ds.length === 0) return log('Unknown danmaku format:', d);
        let danmakuContents = Array.from(ds).map(d => d.textContent);
        translator.pushAll(danmakuContents);
      });
    },
    listenWebSockets: function(){
      /* 公式の通信内容を取得 */
      window.WebSocket = new Proxy(WebSocket, {
        construct(target, arguments){
          const ws = new target(...arguments);
          //log(ws, arguments);
          if(ws.url.includes(CHATSERVER)) ws.addEventListener('message', function(e){
            let packet = new Packet(e.data);
            //log(packet.views, packet.messages);
            if(packet.isCommand === false) return;
            let danmakuContents = packet.getDanmakuContents();
            if(danmakuContents.length === 0) return;
            //log('Danmaku in a packet:', danmakuContents.length, danmakuContents);
            translator.pushAll(danmakuContents);
          });
          return ws;
        }
      });
    },
    setDanmakuSettings: function(){
      let videoDanmaku = site.get.videoDanmaku();
      if(videoDanmaku === null) return log('videoDanmaku not found.');
      if(videoDanmaku.localName === 'canvas'){
        site.set.danmakuTypeCSS(core.observeVideoDanmaku);
      }
    },
    observeVideoDanmaku: function(){
      let videoDanmaku = site.get.videoDanmaku();
      if(videoDanmaku === null) return log('videoDanmaku not found.');
      let observer = observe(videoDanmaku, function(records){
        //log(records);
        for(let i = 0; records[i]; i++){
          if(records[i].addedNodes.length === 0) continue;
          if(['bilibili-danmaku', 'b-danmaku'].some(c => records[i].addedNodes[0].classList.contains(c)) === false) continue;
          let danmaku = new Danmaku(records[i].addedNodes[0]);
          translator.requestTranslation(danmaku);
          observeDanmaku(danmaku);/*danmakuは再利用される！*/
        }
      });
      const observeDanmaku = function(danmaku){
        /* 再利用(新規弾幕としての生まれ変わり)を検知したい */
        let observer = observe(danmaku.element, function(records){
          if(danmaku.hasTranslation) return;/*再利用ではなく翻訳文追加だった*/
          danmaku = new Danmaku(danmaku.element);/*上書き*/
          translator.requestTranslation(danmaku);
        });
      };
    },
    modifyDanmakuInput: function(){
      /* 弾幕投稿内容を翻訳する機能を追加 */
      let danmakuInput = site.get.danmakuInput(), modifier = ISMAC ? 'metaKey' : 'ctrlKey';
      if(danmakuInput === null || danmakuInput.placeholder === undefined) return setTimeout(core.modifyDanmakuInput, 1000);/*属性付与が遅れる場合もあるので*/
      danmakuInput.placeholder += '\n' + translations.inputTranslationKey;
      observe(danmakuInput, function(record){
        if(danmakuInput.placeholder.endsWith(translations.inputTranslationKey)) return;
        danmakuInput.placeholder += '\n' + translations.inputTranslationKey;
      }, {attributes: true, attributeFilter: ['placeholder']});
      window.addEventListener('keydown', function(e){
        if(e.target !== danmakuInput) return;
        if(e.key === 'Enter' && e[modifier] === true){
          e.preventDefault();
          e.stopPropagation();
          danmakuInput.classList.add('translating');
          let api = TRANSLATOR.replace('{text}', danmakuInput.value).replace('{source}', USERLANGUAGE).replace('{target}', BILIBILILANGUAGE);
          fetch(api, {mode: 'cors'})
          .then(response => response.text())
          .then(text => {
            //log(text);
            danmakuInput.value = text;
            danmakuInput.dispatchEvent(new InputEvent('input'));/*実際の送信内容に反映させるために必要*/
            danmakuInput.classList.remove('translating');
          })
          .catch(error => {
            log('Error:', error);
            danmakuInput.classList.remove('translating');
          });
        }
      }, true);
    },
    readyForUnload: function(){
      window.addEventListener('unload', function(e){
        translator.save();
      });
    },
    export: function(){
      if(DEBUG === false) return;
      let dictionary = translator.dictionary, ratio = (number) => (number*100).toFixed(1) + '%';
      window.save = translator.save.bind(translator);
      window.list = function(includes, excludes = /DUMMY/){
        return Object.keys(dictionary).filter(key => {
          return includes.test(key) && !excludes.test(dictionary[key][0]);
        }).sort((a, b) => {
          return dictionary[b][1] - dictionary[a][1];
        }).map(key => {
          return [
            (new Date(dictionary[key][2])).toLocaleString(),/* used */
            dictionary[key][1],/* count */
            key,/* original */
            dictionary[key][0],/* translation */
          ];
        }).slice(0,100);
      }
      window.rank = function(){
        return Object.keys(dictionary).sort((a, b) => {
          return dictionary[b][1] - dictionary[a][1];
        }).map(key => {
          return [
            (new Date(dictionary[key][2])).toLocaleString(),/* used */
            dictionary[key][1],/* count */
            key,/* original */
            dictionary[key][0],/* translation */
          ];
        }).slice(0,100);
      }
      window.usage = function(){
        let total = 0, multiple = 0, single = 0, keys = Object.keys(dictionary);
        keys.forEach(key => {
          total += dictionary[key][1];
          if(2 <= dictionary[key][1]) multiple += 1;
          else single += 1;
        });
        log(
          'total:',  total,
          'length:', keys.length,
          '2+:',     multiple, ratio(multiple/keys.length),
          '1:',      single, ratio(single/keys.length),
          'saved:',  ratio((total - keys.length)/total),
        );
      };
    },
    getTargets: function(targets, retry = 0){
      const get = function(resolve, reject, retry){
        for(let i = 0, keys = Object.keys(targets), key; key = keys[i]; i++){
          let selected = targets[key]();
          if(selected){
            if(selected.length) selected.forEach((s) => s.dataset.selector = key);
            else selected.dataset.selector = key;
            elements[key] = selected;
          }else{
            if(--retry < 0) return reject(log(`Not found: ${key}, I give up.`));
            log(`Not found: ${key}, retrying... (left ${retry})`);
            return setTimeout(get, 1000, resolve, reject, retry);
          }
        }
        resolve();
      };
      return new Promise(function(resolve, reject){
        get(resolve, reject, retry);
      });
    },
    addStyle: function(name = 'style', w = window){
      let style = createElement(core.html[name]());
      w.document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) w.document.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      priorDanmaku: () => `<ul id="${SCRIPTNAME}-prior-danmaku" class="translate" translate="yes"></ul>`,
      danmakuContent: (content) => `<li>${content}</li>`,
      translation: (translation) => `<span class="translation">${translation}</span>`,
      topStyle: () => `
        <style type="text/css" id="${SCRIPTNAME}-topStyle">
          /* bilibili color: #00A1D6 */
          ul#${SCRIPTNAME}-prior-danmaku{
            /* 画面内にないと自動翻訳されない */
            visibility: hidden;
            position: fixed;
            top: 0;
            padding: 0;
            margin: 0;
            white-space: nowrap;
            z-index: 9999;
          }
          ul#${SCRIPTNAME}-prior-danmaku li{
            position: absolute;
          }
        </style>
      `,
      style: () => `
        <style type="text/css" id="${SCRIPTNAME}-style">
          .translation{
            font-size: 75%;
            display: block;
          }
          .translating{
            opacity: .25;
            animation: ${SCRIPTNAME}-blink 250ms step-end infinite;
          }
          @keyframes ${SCRIPTNAME}-blink{
            50%{opacity: .5}
          }
          /* 放送終了後 */
          .bilibili-live-player[data-live-state=block] .bilibili-live-player-video-danmaku,
          .bilibili-live-player[data-live-state=close] .bilibili-live-player-video-danmaku,
          .bilibili-live-player[data-live-state=end] .bilibili-live-player-video-danmaku,
          .bilibili-live-player[data-live-state=preparing] .bilibili-live-player-video-danmaku{
            height: 100%;
            pointer-events: none;
          }
        </style>
      `,
    },
  };
  const setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, setInterval = window.setInterval, clearInterval = window.clearInterval, requestAnimationFrame = window.requestAnimationFrame;
  const getComputedStyle = window.getComputedStyle, fetch = window.fetch;
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  class Storage{
    static key(key){
      return (SCRIPTNAME) ? (SCRIPTNAME + '-' + key) : key;
    }
    static save(key, value, expire = null){
      key = Storage.key(key);
      localStorage[key] = JSON.stringify({
        value: value,
        saved: Date.now(),
        expire: expire,
      });
    }
    static read(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.value === undefined) return data;
      if(data.expire === undefined) return data;
      if(data.expire === null) return data.value;
      if(data.expire < Date.now()) return localStorage.removeItem(key);
      return data.value;
    }
    static delete(key){
      key = Storage.key(key);
      delete localStorage.removeItem(key);
    }
    static saved(key){
      key = Storage.key(key);
      if(localStorage[key] === undefined) return undefined;
      let data = JSON.parse(localStorage[key]);
      if(data.saved) return data.saved;
      else return undefined;
    }
  }
  const $ = function(s, f){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s){return document.querySelectorAll(s)};
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const wait = function(ms){return new Promise((resolve) => setTimeout(resolve, ms))};
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const observe = function(element, callback, options = {childList: true, attributes: false, characterData: false, subtree: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const atLeast = function(min, b){
    return Math.max(min, b);
  };
  const atMost = function(a, max){
    return Math.min(a, max);
  };
  const between = function(min, b, max){
    return Math.min(Math.max(min, b), max);
  };
  const toMetric = function(number, decimal = 1){
    switch(true){
      case(number < 1e3 ): return (number);
      case(number < 1e6 ): return (number/1e3 ).toFixed(decimal) + 'K';
      case(number < 1e9 ): return (number/1e6 ).toFixed(decimal) + 'M';
      case(number < 1e12): return (number/1e9 ).toFixed(decimal) + 'G';
      default:             return (number/1e12).toFixed(decimal) + 'T';
    }
  };
  const log = function(){
    if(!DEBUG) return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      SCRIPTNAME + ':',
      /* 00:00:00.000  */ n.toLocaleTimeString() + '.' + n.getTime().toString().slice(-3),
      /* +0.000s       */ '+' + ((n-l)/1000).toFixed(3) + 's',
      /* :00           */ ':' + line,
      /* caller.caller */ (callers[2] ? callers[2] + '() => ' : '') +
      /* caller        */ (callers[1] || '') + '()',
      ...arguments
    );
  };
  log.formats = [{
      name: 'Firefox Scratchpad',
      detector: /MARKER@Scratchpad/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Console',
      detector: /MARKER@debugger/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 3',
      detector: /\/gm_scripts\//,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1],
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Greasemonkey 4+',
      detector: /MARKER@user-script:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 500,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Firefox Tampermonkey',
      detector: /MARKER@moz-extension:/,
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 6,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?id=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 6,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Chrome Extension',
      detector: /at MARKER \(chrome-extension:/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(chrome-extension:)/gm),
    }, {
      name: 'Edge Console',
      detector: /at MARKER \(eval/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(eval)/gm),
    }, {
      name: 'Edge Tampermonkey',
      detector: /at MARKER \(Function/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 4,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(Function)/gm),
    }, {
      name: 'Safari',
      detector: /^MARKER$/m,
      getLine: (e) => 0,/*e.lineが用意されているが最終呼び出し位置のみ*/
      getCallers: (e) => e.stack.split('\n'),
    }, {
      name: 'Default',
      detector: /./,
      getLine: (e) => 0,
      getCallers: (e) => [],
    }];
  log.format = log.formats.find(function MARKER(f){
    if(!f.detector.test(new Error().stack)) return false;
    //console.log('////', f.name, 'wants', 0/*line*/, '\n' + new Error().stack);
    return true;
  });
  const time = function(label){
    if(!DEBUG) return;
    const BAR = '|', TOTAL = 100;
    switch(true){
      case(label === undefined):/* time() to output total */
        let total = 0;
        Object.keys(time.records).forEach((label) => total += time.records[label].total);
        Object.keys(time.records).forEach((label) => {
          console.log(
            BAR.repeat((time.records[label].total / total) * TOTAL),
            label + ':',
            (time.records[label].total).toFixed(3) + 'ms',
            '(' + time.records[label].count + ')',
          );
        });
        time.records = {};
        break;
      case(!time.records[label]):/* time('label') to create and start the record */
        time.records[label] = {count: 0, from: performance.now(), total: 0};
        break;
      case(time.records[label].from === null):/* time('label') to re-start the lap */
        time.records[label].from = performance.now();
        break;
      case(0 < time.records[label].from):/* time('label') to add lap time to the record */
        time.records[label].total += performance.now() - time.records[label].from;
        time.records[label].from = null;
        time.records[label].count += 1;
        break;
    }
  };
  time.records = {};
  core.initialize();
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTNAME);
})();