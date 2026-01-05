// ==UserScript==
// @name           covconv
// @namespace      net.ghippos.covconv
// @description    いまｱｯｼｭﾋｮｰｸいるんだけどっいけそうならいこうっ！
// @version        5
// @include        *
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/13000/covconv.user.js
// @updateURL https://update.greasyfork.org/scripts/13000/covconv.meta.js
// ==/UserScript==
(function () {
  var dic = [
    // 標準辞書
    {
      'ja_JP': 'アイコン',
      'kv_JP': 'ｱｲﾖﾝ'
    },
    {
      'ja_JP': 'アピール',
      'kv_JP': 'ｱｯﾋﾟﾙ'
    },
    {
      'ja_JP': 'アルバム',
      'kv_JP': 'ｱﾕﾊﾞﾑ'
    },
    {
      'ja_JP': 'アンコール',
      'kv_JP': 'ｱﾝｺｯﾙ'
    },
    {
      'ja_JP': 'イメージ',
      'kv_JP': 'ｲﾒｯｼﾞ'
    },
    {
      'ja_JP': '(イヤホン|イヤフォン)',
      'kv_JP': 'ｲﾔﾋｮﾝ'
    },
    {
      'ja_JP': 'インストール',
      'kv_JP': 'ｲﾝｽﾖｯﾙ'
    },
    {
      'ja_JP': 'インチ',
      'kv_JP': 'ｲﾝﾖ'
    },
    {
      'ja_JP': 'インポータント',
      'kv_JP': 'ｲﾝﾎﾟｯﾀﾝｯ'
    },
    {
      'ja_JP': 'ウェブ',
      'kv_JP': 'ｳｪｯﾌﾞ'
    },
    {
      'ja_JP': 'エアコン',
      'kv_JP': 'ｴｱﾖﾝ'
    },
    {
      'ja_JP': 'エナジードリンク',
      'kv_JP': 'ｴﾅﾖｰﾄﾞﾘﾝﾎﾟ'
    },
    {
      'ja_JP': 'エロゲ',
      'kv_JP': 'ｴﾖｹﾞ'
    },
    {
      'ja_JP': 'オペレーティング',
      'kv_JP': 'ｵﾍﾟﾚｯﾃｨﾝｯ'
    },
    {
      'ja_JP': 'カニクリームコロッケ',
      'kv_JP': 'ｺﾆｸﾘｯﾑｶﾗｯｹ'
    },
    {
      'ja_JP': 'カラースキーム',
      'kv_JP': 'ｶﾗｰｽｷｯﾑ'
    },
    {
      'ja_JP': 'カップル',
      'kv_JP': 'ｶﾌﾟﾙ'
    },
    {
      'ja_JP': 'カーテン',
      'kv_JP': 'ｶｯﾃﾝ'
    },
    {
      'ja_JP': 'きめ(.)|キメ(.)',
      'kv_JP': 'ｷﾒ$1'
    },
    {
      'ja_JP': 'キーワード',
      'kv_JP': 'ｷｯﾜｰﾖ'
    },
    {
      'ja_JP': 'クリーニング',
      'kv_JP': 'ｸﾘﾆﾝｯ'
    },
    {
      'ja_JP': 'ケーブル',
      'kv_JP': 'ｹｯﾌﾞﾙ'
    },
    {
      'ja_JP': 'ココア',
      'kv_JP': 'ｺｺﾔ'
    },
    {
      'ja_JP': 'コンクリート',
      'kv_JP': 'ｺﾝｸﾘｯﾖ'
    },
    {
      'ja_JP': 'コネクション',
      'kv_JP': 'ｺﾈｸﾋｮﾝ'
    },
    {
      'ja_JP': 'コンパイラ',
      'kv_JP': 'ｺﾝﾊﾟｲﾔ'
    },
    {
      'ja_JP': 'コンパイル',
      'kv_JP': 'ｺﾝﾊﾟｲﾕ'
    },
    {
      'ja_JP': '(サイコロ|さいころ)',
      'kv_JP': 'ｻｲｺﾖ'
    },
    {
      'ja_JP': 'サドル',
      'kv_JP': 'ｻﾄﾞﾙ'
    },
    {
      'ja_JP': 'サークル',
      'kv_JP': 'ｻｯｸﾙ'
    },
    {
      'ja_JP': 'シュリンク',
      'kv_JP': 'ｼｭﾘﾝｸｯ'
    },
    {
      'ja_JP': 'ショップ',
      'kv_JP': 'ﾁｮｯﾌﾟ'
    },
    {
      'ja_JP': 'ステーキ',
      'kv_JP': 'ｽﾃｯｷ'
    },
    {
      'ja_JP': 'スタック',
      'kv_JP': 'ｽﾀｯﾎﾟ'
    },
    {
      'ja_JP': 'スマホ',
      'kv_JP': 'ｽﾏﾋｮ'
    },
    {
      'ja_JP': 'スマートフォン',
      'kv_JP': 'ｽﾏｰﾖﾋｮﾝ'
    },
    {
      'ja_JP': 'スパークリング',
      'kv_JP': 'ｽﾊﾟｰｸﾘﾝｯ'
    },
    {
      'ja_JP': 'スリープ',
      'kv_JP': 'ｽﾘｯﾌﾟ'
    },
    {
      'ja_JP': 'スーツケース',
      'kv_JP': 'ｽｰﾕｹｰｽ'
    },
    {
      'ja_JP': 'スーツ',
      'kv_JP': 'ｽｯﾂ'
    },
    {
      'ja_JP': 'セックス',
      'kv_JP': 'ｾｯｸﾖ'
    },
    {
      'ja_JP': '(ソウル|ソール)',
      'kv_JP': 'ｿｯﾙ'
    },
    {
      'ja_JP': 'ダイヤグラム',
      'kv_JP': 'ﾀﾞｲﾔｸﾞﾗﾐｭ'
    },
    {
      'ja_JP': 'ダブルクォーターパウンダー',
      'kv_JP': 'ﾀﾞﾌﾞﾕｸｫｯﾀｰﾊﾟｳﾝﾔｰ'
    },
    {
      'ja_JP': 'ダブルチーズバーガー',
      'kv_JP': 'ﾀﾞﾌﾞﾕﾁｯｽﾞﾊﾞｯｶﾞｰ'
    },
    {
      'ja_JP': 'ダンボール',
      'kv_JP': 'ﾀﾞﾝﾎﾞｯﾙ'
    },
    {
      'ja_JP': 'テクニカル',
      'kv_JP': 'ﾃｸﾆｶﾕ'
    },
    {
      'ja_JP': 'テクニシャン',
      'kv_JP': 'ﾃｸﾆﾋｬﾝ'
    },
    {
      'ja_JP': 'テンション',
      'kv_JP': 'ﾃﾝﾖﾝ'
    },
    {
      'ja_JP': 'ディスプレイ',
      'kv_JP': 'ﾃﾞｨｽﾌﾟﾖｲ'
    },
    {
      'ja_JP': 'テーブル',
      'kv_JP': 'ﾃｰﾌﾞﾕ'
    },
    {
      'ja_JP': 'トイレクイックル',
      'kv_JP': 'ﾖｲﾚｸｲｯｸﾖ'
    },
    {
      'ja_JP': 'トイレ',
      'kv_JP': 'ﾖｲﾚ'
    },
    {
      'ja_JP': 'ドル',
      'kv_JP': 'ﾖﾙ'
    },
    {
      'ja_JP': 'トートロジー',
      'kv_JP': 'ﾄﾝﾄﾛｼﾞｰ'
    },
    {
      'ja_JP': 'ノートパソコン',
      'kv_JP': 'ﾉｰﾖﾊﾟﾖﾖﾝ'
    },
    {
      'ja_JP': 'バイオリン',
      'kv_JP': 'ﾊﾞｲﾖﾘﾝ'
    },
    {
      'ja_JP': 'バレーボール',
      'kv_JP': 'ﾊﾞﾘﾎﾞｰﾙ'
    },
    {
      'ja_JP': 'ハッカソン',
      'kv_JP': 'ﾊｯｶﾖﾝ'
    },
    {
      'ja_JP': 'バックアップ',
      'kv_JP': 'ﾊﾞｯﾖｱｯﾌﾟ'
    },
    {
      'ja_JP': 'バージョン',
      'kv_JP': 'ﾊﾞｼﾞﾖﾝ'
    },
    {
      'ja_JP': 'パーセント',
      'kv_JP': 'ﾊﾟｯｾﾝﾄ'
    },
    {
      'ja_JP': 'ビデオ',
      'kv_JP': 'ｳﾞｨﾃﾞｵ'
    },
    {
      'ja_JP': '(ビヤガーデン|ビアガーデン)',
      'kv_JP': 'ﾋﾞﾔｶﾞﾃﾞｯﾑ'
    },
    {
      'ja_JP': 'ビーフジャーキー',
      'kv_JP': 'ﾋﾞｯﾌｼﾞｬｯｷｰ'
    },
    {
      'ja_JP': 'ピロピロ',
      'kv_JP': 'ﾋﾟﾛﾋﾟﾛ'
    },
    {
      'ja_JP': 'フラグ',
      'kv_JP': 'ﾌﾔｸﾞ'
    },
    {
      'ja_JP': 'ブルートゥース',
      'kv_JP': 'ﾌﾞﾙｰﾖｰﾕ'
    },
    {
      'ja_JP': 'ブース',
      'kv_JP': 'ﾌﾞｰｽ'
    },
    {
      'ja_JP': 'フロー',
      'kv_JP': 'ﾌﾖｰ'
    },
    {
      'ja_JP': 'フィルタリング',
      'kv_JP': 'ﾌｨﾙﾀﾘﾝｯ'
    },
    {
      'ja_JP': 'フォロワー',
      'kv_JP': 'ﾋｮﾛﾔｰ'
    },
    {
      'ja_JP': 'フォロー',
      'kv_JP': 'ﾋｮﾛｰ'
    },
    {
      'ja_JP': 'フォース',
      'kv_JP': 'ﾋｮｰｽ'
    },
    {
      'ja_JP': 'プラグイン',
      'kv_JP': 'ﾌﾟﾗｷﾞﾝ'
    },
    {
      'ja_JP': 'プログラミング',
      'kv_JP': 'ﾌﾟﾖｸﾞﾔﾐﾝｯ'
    },
    {
      'ja_JP': 'プログラム',
      'kv_JP': 'ﾌﾟﾖｸﾞﾛﾑ'
    },
    {
      'ja_JP': 'プログレス',
      'kv_JP': 'ﾌﾟﾔｸﾞﾚｽ'
    },
    {
      'ja_JP': '(プロセッサ|プロセッサー)',
      'kv_JP': 'ﾌﾟﾖｾｯｻ'
    },
    {
      'ja_JP': 'プロフィール',
      'kv_JP': 'ﾌﾟﾛﾌｨｯﾙ'
    },
    {
      'ja_JP': 'プロセス',
      'kv_JP': 'ﾌﾟﾖｾｽ'
    },
    {
      'ja_JP': 'プロモーション',
      'kv_JP': 'ﾌﾟﾖﾓｯｼｮﾝ'
    },
    {
      'ja_JP': 'ベストエフォート',
      'kv_JP': 'ﾍﾞｽﾄｴﾌｫｯﾄ'
    },
    {
      'ja_JP': 'ベビースター',
      'kv_JP': 'ﾍﾞﾋﾞｯｽﾔｯ'
    },
    {
      'ja_JP': 'マグロ',
      'kv_JP': 'ﾏｸﾞﾛ'
    },
    {
      'ja_JP': 'ミステイク',
      'kv_JP': 'ﾐｽﾃｯｸ'
    },
    {
      'ja_JP': 'ミーティング',
      'kv_JP': 'ﾒｯﾃｨﾝ'
    },
    {
      'ja_JP': 'メイド',
      'kv_JP': 'ﾒｲﾖ'
    },
    {
      'ja_JP': 'メール',
      'kv_JP': 'ﾒｰﾕ'
    },
    {
      'ja_JP': 'モンスター',
      'kv_JP': 'ﾓﾝｽﾔｰ'
    },
    {
      'ja_JP': 'モーニング',
      'kv_JP': 'ﾓｯﾆﾝ'
    },
    {
      'ja_JP': 'ライティング',
      'kv_JP': 'ﾗｲﾃｨﾝｯ'
    },
    {
      'ja_JP': 'ラーメン',
      'kv_JP': 'ﾗﾒﾝｯ'
    },
    {
      'ja_JP': 'リア充',
      'kv_JP': 'ﾘｱｯｼﾞｭ'
    },
    {
      'ja_JP': 'リサイクル',
      'kv_JP': 'ﾘｻｲｸﾕ'
    },
    {
      'ja_JP': 'ロックスター',
      'kv_JP': 'ﾛｯﾌﾟｽﾔｰ'
    },
    {
      'ja_JP': 'ローマ',
      'kv_JP': 'ﾖｰﾏ'
    },
    {
      'ja_JP': '群論',
      'kv_JP': 'ｸﾞﾝﾖﾝ'
    },
    {
      'ja_JP': '圏論',
      'kv_JP': 'ｹﾝﾖﾝ'
    },
    
    // 英こふ辞書
    {
      'ja_JP': '(アイパッドエアー|iPad\sAir)',
      'kv_JP': 'ｱｲﾊﾟｯﾖｴﾔｰ'
    },
    {
      'ja_JP': '(アイパッド|iPad)',
      'kv_JP': 'ｱｲﾊﾟｯﾖ'
    },
    {
      'ja_JP': '(アイフォーン|アイフォン|iPhone)',
      'kv_JP': 'ｱｲﾋｮｰﾝ'
    },
    {
      'ja_JP': '(アンドロイド|android)',
      'kv_JP': 'ｱﾝﾖﾖｲﾖ'
    },
    {
      'ja_JP': 'arch\slinux',
      'kv_JP': 'ｱﾁｮｰﾘﾅｸｽ'
    },
    {
      'ja_JP': '(アーチ|arch)',
      'kv_JP': 'ｱﾁｮｰ'
    },
    {
      'ja_JP': '(インストール|install)',
      'kv_JP': 'ｲﾝｽﾖｯﾙ'
    },
    {
      'ja_JP': '(インティオス|インテュオス|intuos)',
      'kv_JP': 'ｲﾝﾁｭｵｽ'
    },
    {
      'ja_JP': '(ウィンドウズ|ウィンドーズ|windows)',
      'kv_JP': 'ｳｨﾝﾖｯｽﾞ'
    },
    {
      'ja_JP': '(エックスビデオズ|エックスビデオ|xvideos|xvideo)',
      'kv_JP': 'ｴｸｽｳﾞｨﾃﾞｵｽﾞ'
    },
    {
      'ja_JP': '(オペラ|Opera)',
      'kv_JP': 'ｵﾍﾟｯﾗ'
    },
    {
      'ja_JP': 'GitHub',
      'kv_JP': 'ｷﾞｯﾖﾊﾟﾌﾞ'
    },
    {
      'ja_JP': '(グラブ|GRUB)',
      'kv_JP': 'ｸﾞﾔﾌﾞ'
    },
    {
      'ja_JP': '(シンクパッド|ThinkPad)',
      'kv_JP': 'ｼﾝｸﾊﾟｯﾖ'
    },
    {
      'ja_JP': '(ジェンツー|gentoo)',
      'kv_JP': 'ｼﾞｪﾝﾂｰ'
    },
    {
      'ja_JP': '(ジャバスクリプト|javascript)',
      'kv_JP': 'ｼﾞｬｳﾞｧｽｸｲﾌﾟﾖ'
    },
    {
      'ja_JP': '(ツイッター|twitter)',
      'kv_JP': 'ﾂｲｯﾀ'
    },
    {
      'ja_JP': '(ツイート|tweet)',
      'kv_JP': 'ﾂｲｯﾖ'
    },
    {
      'ja_JP': '(テレビ|TV)',
      'kv_JP': 'ﾃｨｰｳﾞｨｰ'
    },
    {
      'ja_JP': '(タブレット|tablet)',
      'kv_JP': 'ﾀﾖﾖｯﾖ'
    },
    {
      'ja_JP': '(ネクサスファイブ|Nexus5|Nexus\s5)',
      'kv_JP': 'ﾈｸｻｼｭﾌｧﾋﾖ'
    },
    {
      'ja_JP': '(バーチャルボックス|virtualbox|virtual\sbox)',
      'kv_JP': 'ﾊﾞﾁｬｰﾙﾎﾞｸｽ'
    },
    {
      'ja_JP': '(ブルーレイ|bluray)',
      'kv_JP': 'ﾌﾞﾕﾚｲ'
    },
    {
      'ja_JP': '(プレイヤー|プレイヤ|プレーヤー|プレーヤー|player)',
      'kv_JP': 'ﾌﾟﾚｲﾔｯ'
    },
    {
      'ja_JP': '(プッシュ|push)',
      'kv_JP': 'ﾌﾟｯﾕ'
    },
    {
      'ja_JP': '(ペースト|paste)',
      'kv_JP': 'ﾍﾟｯｽﾄ'
    },
    {
      'ja_JP': '(ボーカロイド|vocaloid)',
      'kv_JP': 'ﾎﾞｰｶﾛｲﾖ'
    },
    {
      'ja_JP': '(マックミニ|mac\smini|macmini)',
      'kv_JP': 'ﾏｯﾖﾐﾆ'
    },
    {
      'ja_JP': '(マックブックエアー|macbookair|macbook\sair)',
      'kv_JP': 'ﾏｯﾖﾌﾞｯｸｴﾔｰ'
    },
    {
      'ja_JP': '(マックブックプロ|macbookpro|macbook\spro)',
      'kv_JP': 'ﾏｯﾖﾌﾞｯｸﾌﾟﾖ'
    },
    {
      'ja_JP': '(マックブック|macbook)',
      'kv_JP': 'ﾏｯﾖﾌﾞｯｸ'
    },
    {
      'ja_JP': '(マック|mac)',
      'kv_JP': 'ﾏｯﾖ'
    },
    {
      'ja_JP': '(メソッド|メゾット|メゾッド)',
      'kv_JP': 'ﾒｿｯﾖ'
    },
    {
      'ja_JP': '(リナックス|linux)',
      'kv_JP': 'ﾘﾅｸｽ'
    },
    
    // 推測変換
    {
      'ja_JP': 'アル([カ-コガ-ゴ])',
      'kv_JP': 'ｵﾙ$1'
    },
    {
      'ja_JP': 'アル',
      'kv_JP': 'ｱﾖ'
    },
    {
      'ja_JP': '([ァ-ヶ])(ト|ド|ゴ|テ)$',
      'kv_JP': '$1ﾖ'
    },
    {
      'ja_JP': '([ァ-ヶ])(ト|ド|ゴ|テ)([^ァ-ォ])',
      'kv_JP': '$1ﾖ$3'
    },
    {
      'ja_JP': '([ァ-ヶ])ース',
      'kv_JP': '$1ｰﾕ'
    },
    {
      'ja_JP': '([ァ-ヶ])テ[^ァ-ォ]',
      'kv_JP': '$1ﾃﾑ'
    },
    {
      'ja_JP': '/([ァ-ヶ])ロ([ァ-ヶ])',
      'kv_JP': '$1ﾔ$2'
    },
    {
      'ja_JP': '([ァ-ヶ])ショ([ァ-ヶ])',
      'kv_JP': '$1ﾖ$2'
    },
    {
      'ja_JP': '([ァ-ヶ])ング',
      'kv_JP': '$1ﾝｯ'
    },
    {
      'ja_JP': '(リン)([ァ-ヶ])',
      'kv_JP': '$1ﾎﾟ'
    },
    {
      'ja_JP': '([ァ-ヶ])ー',
      'kv_JP': '$1-'
    },
    {
      'ja_JP': '(、|，|。|．)',
      'kv_JP': 'っ'
    }
  ]; 
  // end of dic[]
  
  var fullKana = new Array('ヴ', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド', 'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ', 'ヲ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ッ', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ン');
  var halfKana = new Array('ｳﾞ', 'ｶﾞ', 'ｷﾞ', 'ｸﾞ', 'ｹﾞ', 'ｺﾞ', 'ｻﾞ', 'ｼﾞ', 'ｽﾞ', 'ｾﾞ', 'ｿﾞ', 'ﾀﾞ', 'ﾁﾞ', 'ﾂﾞ', 'ﾃﾞ', 'ﾄﾞ', 'ﾊﾞ', 'ﾋﾞ', 'ﾌﾞ', 'ﾍﾞ', 'ﾎﾞ', 'ﾊﾟ', 'ﾋﾟ', 'ﾌﾟ', 'ﾍﾟ', 'ﾎﾟ', 'ｦ', 'ｧ', 'ｨ', 'ｩ', 'ｪ', 'ｫ', 'ｬ', 'ｭ', 'ｮ', 'ｯ', 'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ', 'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ', 'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ', 'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ', 'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ', 'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ', 'ﾔ', 'ﾕ', 'ﾖ', 'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ﾝ');
  
  var regex_covconv = [];
  var regex_kana = [];
    
  function covconv(element) {
    convert(element);
    for (var childElement of element.childNodes) {
      covconv(childElement);
    }
  }
  
  function convert(element) {
    if(!isTextElement(element)){
      return;
    }
  
    var nodeValue = element.nodeValue;
    for (var i = 0; i < regex_covconv.length; i++) {
      if (nodeValue.match(regex_covconv[i])) {
        nodeValue = nodeValue.replace(regex_covconv[i], dic[i].kv_JP);
      }
    }
    nodeValue = toHalfWidth(nodeValue);
    element.nodeValue = nodeValue;
  }
  
  function isTextElement(element){
    if ('parentNode' in element && element.parentNode != null) {
      var nodeName = element.parentNode.nodeName.toLowerCase();
      if ((nodeName == 'style') || (nodeName == 'script') || (nodeName == 'frame')) {
        return false; 
      }
    }
    if (element.nodeName.toLowerCase() != '#text') {
      return false;
    }
    
    return true;
  }
  
  function toHalfWidth(nodeValue) {
    var str = nodeValue;
    for (var i = 0; i < regex_kana.length; i++) {
      str = str.replace(regex_kana[i], halfKana[i]);
    }
    return str;
  }
  
  // start 
  for (var i = 0; i < dic.length; i++) {
    regex_covconv[i] = new RegExp(dic[i].ja_JP, 'gmi');
  }
  for (var i = 0; i < fullKana.length; i++) {
    regex_kana[i] = new RegExp(fullKana[i], 'gmi');
  }
  covconv(window.document);
}) ();