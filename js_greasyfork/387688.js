// ==UserScript==
// @name        * Streaming Comment Reader chan
// @name:ja     * 配信コメント読み上げちゃん
// @name:zh-CN  * 朗读直播评论酱
// @namespace   knoa.jp
// @description It reads comment text on streaming sites by speech synthesis.
// @description:ja ライブ配信サイトの新着コメントを音声で読み上げます。
// @description:zh-CN 用声音朗读直播网站的新到来评论。
// @include     https://abema.tv/*
// @include     https://live.bilibili.com/*
// @include     https://www.douyu.com/*
// @include     https://live.fc2.com/*
// @include     https://www.huajiao.com/l/*
// @include     https://www.huya.com/*
// @include     http*://www.inke.cn/live*
// @include     https://live.line.me/channels/*/broadcast/*
// @include     https://live*.nicovideo.jp/watch/*
// @include     https://www.openrec.tv/live/*
// @include     https://www.pscp.tv/w/*
// @include     https://www.showroom-live.com/*
// @include     https://twitcasting.tv/*
// @include     https://www.twitch.tv/*
// @include     https://whowatch.tv/viewer/*
// @include     https://www.yizhibo.com/l/*
// @include     https://www.youtube.com/live_chat*
// @include     https://www.yy.com/*
// @version     1.0.20
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/387688/%2A%20Streaming%20Comment%20Reader%20chan.user.js
// @updateURL https://update.greasyfork.org/scripts/387688/%2A%20Streaming%20Comment%20Reader%20chan.meta.js
// ==/UserScript==

(function(){
  const SCRIPTID = 'StreamingCommentReader-chan';
  const SCRIPTNAME = 'Streaming Comment Reader chan';
  const DEBUG = false;/*
[update]
Fix for Bilibili. Thank you for reporting!!

[to do]
中国語でも将棋が表示されてる？
動作しなければ報告歓迎、のパネル

[possible]
* Streaming Comment Reader に改名なのでは(少なくとも英語名)
  「ビリビリ弾幕翻訳機」もあくまで愛称だよな
video.volumeと連動さるオプションありか

[research]
ニコニコ動画!!需要があるらしい
  https://greasyfork.org/ja/forum/discussion/63249/x
  しかし新着要素じゃないから一筋縄じゃダメだな
ふわっち (デフォであるｗ)
  */
  if(window === top && console.time) console.time(SCRIPTID);
  if(!('speechSynthesis' in window)) return console.log(SCRIPTID, 'speechSynthesis undefined.');
  const USERLANGUAGE = top.navigator.language;
  const SITELANGUAGE = (top.document.documentElement && top.document.documentElement.lang) ? top.document.documentElement.lang : USERLANGUAGE;
  const _TEXTS = {
    en: {
      scriptname:           () => `${SCRIPTNAME}`,
      configs:              () => `${SCRIPTNAME} configs`,
      test:                 () => 'Trial',
      text:                 () => 'this is a test ABC',
      speech:               () => 'Speech',
      volume:               () => 'volume',
      pitch:                () => 'pitch',
      voice:                () => 'voice',
      fast:                 () => 'When comments flow fast',
      fastest:              () => 'fastest',
      buffer:               () => 'catch up latest',
      bufferNote:           () => '* To cut off more than this number of comments for catching up latest ones.',
      translators:          () => 'Domain specific terms',
      translatorsEmpty:     () => 'No terms available now.',
      dictionary:           () => 'Replacement dictionary',
      dictionaryNote:       () => '[/source(RegExp)/, \'destination\', \'memo(optional)\'],... as Array',
      professional:         () => '(for professional)',
      ng:                   () => 'NG words',
      ngNote:               () => 'comma(,) separated list',
      reset:                () => 'reset',
      cancel:               () => 'Cancel',
      save:                 () => 'Save',
      dictionaryParseError: () => `Replacement dictionary error:\nrequired ${TEXTS.dictionaryNote()},\nor you can reset all preferences.`,
      resetConfirmation:    () => `All preferences will be reset to defaults. Are you sure?`,
    },
    ja: {
      scriptname:           () => `配信コメント読み上げちゃん`,
      configs:              () => `配信コメント読み上げちゃん 設定`,
      test:                 () => '試し読み',
      text:                 () => 'これはテストです ABC',
      speech:               () => '読み上げの声',
      volume:               () => '音量',
      pitch:                () => '高さ',
      voice:                () => '種類',
      fast:                 () => 'コメント混雑時',
      fastest:              () => '速読み',
      buffer:               () => '追いかけコメント数',
      bufferNote:           () => '※これ以上古いコメントを切り捨てることで、読み上げがいつまでも追いつかなくなるのを防ぎます。',
      translators:          () => '専門用語モード',
      translatorsEmpty:     () => '専門用語が用意されていません。',
      dictionary:           () => '置換辞書',
      dictionaryNote:       () => '[/置換元(正規表現)/, \'置換先\', \'メモ(任意)\'],... の配列',
      professional:         () => '(上級者向け)',
      ng:                   () => 'NGワード',
      ngNote:               () => 'カンマ(,)区切りのリスト',
      reset:                () => 'リセット',
      cancel:               () => 'キャンセル',
      save:                 () => '保存',
      dictionaryParseError: () => `置換辞書の形式が正しくありません:\n${TEXTS.dictionaryNote()}にするか、\nまたは全ての設定値をリセットしてください。`,
      resetConfirmation:    () => 'すべての設定が初期化されます。よろしいですか？',
    },
    zh: {
      scriptname:           () => `发布评论朗读`,
      configs:              () => `发布评论阅读设置`,
      test:                 () => '试读',
      text:                 () => '这是测试ABC',
      speech:               () => '朗读的声音',
      volume:               () => '音量',
      pitch:                () => '高度',
      voice:                () => '种类',
      fast:                 () => '评论拥挤时',
      fastest:              () => '速读',
      buffer:               () => '追随评论数',
      bufferNote:           () => '※通过舍弃更旧的评论，防止朗读永远跟不上。',
      translators:          () => '术语模式',
      translatorsEmpty:     () => '未提供专业术语',
      dictionary:           () => '替换词典',
      dictionaryNote:       () => '[/替换自(正则表达式)/, \'替换为\', \'注释(可选)\'],... 的数组。',
      professional:         () => '(高级)',
      ng:                   () => 'NG字',
      ngNote:               () => '以逗号(,)分隔的列表',
      reset:                () => '重置',
      cancel:               () => '取消',
      save:                 () => '保存',
      dictionaryParseError: () => `替换词典的格式不正确: \n${TEXTS.dictionaryNote()}，或者\n将所有的设定值复位。`,
      resetConfirmation:    () => '所有设置都将被初始化。可以吗？',
    },
  };
  const TEXTS = _TEXTS[USERLANGUAGE] || _TEXTS[USERLANGUAGE.substring(0, 2)] || _TEXTS.en;
  const _DICTIONARIES = {
    /* 置換元, 置換先, 説明(任意) */
    en: {
      default: [
        [/http:\/\/[^\s]+/, 'URL'],
      ],
    },
    ja: {
      default: [
        [/http:\/\/[^\s]+/, 'URL'],
        [/[8８]{3,}/, 'パチパチパチ'],
        [/[wｗ]{3,}/, 'ワラワラワラ'],
        [/[wｗ]{2}/, 'ワラワラ'],
        [/[wｗ]$/, 'ワラ', '文末のみ1文字でも'],
        [/ｗ/g, 'ワラ', '全角のみ1文字でも'],
        [/(.{1})\1{4,}/ug, '$1$1$1$1$1', '1文字の5回以上の繰り返しはカット'],
        [/(.{2})\1{3,}/ug, '$1$1$1$1', '2文字の4回以上の繰り返しはカット'],
        [/(.{3})\1{2,}/ug, '$1$1', '3文字の3回以上の繰り返しはカット'],
        [/(.{4,})\1{1,}/ug, '$1', '4文字以上の繰り返しはカット'],
        [/([あ-ん～])[～〜]/g, '$1ー', 'から => 長音'],
        [/はよ$/, 'ハヨ'],
        [/初見/, 'ショケン'],
        [/AbemaTV/, 'アベマティーヴィー'],
        [/Abema/, 'アベマ'],
        [/ニコ生/, 'ニコナマ'],
      ],
      nicolive: [
        [/^(【広告貢献[0-9]位】)?(.+)さんが([0-9]+)ptニコニ広告しました(「(.+)」)?$/, '$1、$2さんが、$3ポイント、ニコニ広告しました。$4。'],
        [/^(【ニコニコ新市場】)「(.+)」が貼られました$/, '$1、$2、が貼られました'],
      ],
    }
  };
  const DICTIONARIES = _DICTIONARIES[SITELANGUAGE] || _DICTIONARIES[SITELANGUAGE.substring(0, 2)] || _DICTIONARIES.en;
  const _TRANSLATORS = {
    en: {
    },
    ja: {
      '将棋': (text) => {
        // 文字入力の変換用辞書として公開されているデータがあるが採用保留
        // https://github.com/knu/imedic-shogi/blob/master/shogi.vje.txt
        const POSITIONS = [
          [/[1１一]/g, 'イチ'],
          [/[2２二]/g, 'ニー'],
          [/[3３三]/g, 'サン'],
          [/[4４四]/g, 'ヨン'],
          [/[5５五]/g, 'ゴー'],
          [/[6６六]/g, 'ロク'],
          [/[7７七]/g, 'ナナ'],
          [/[8８八]/g, 'ハチ'],
          [/[9９九]/g, 'キュー'],
        ];
        const PIECES = [
          [/王/, 'オー'],
          [/玉/, 'ギョク'],
          [/飛車/, 'ヒシャ'],
          [/飛/, 'ヒ'],
          [/角/, 'カク'],
          [/金/, 'キン'],
          [/銀/, 'ギン'],
          [/桂馬/, 'ケーマ'],
          [/桂/, 'ケー'],
          [/香/, 'キョー'],
          [/歩/, 'フ'],
          [/龍|竜/, 'リュー'],
          [/馬/, 'ウマ'],
          [/不成/, 'ナラズ'],
          [/成(?![ら-ろ])/, 'ナリ'],
          [/と/, 'ト'],
          [/同/, 'ドウ'],
          [/打(?![た-とっ])/, 'ウツ'],
          [/右/, 'ミギ'],
          [/左/, 'ヒダリ'],
          [/上/, 'アガル'],
          [/寄(?![ら-ろっ])/, 'ヨル'],
          [/引(?![か-こっ])/, 'ヒク'],
          [/直/, 'スグ'],
        ];
        const MOVES = [{
          regexp: /([1-9１-９])([1-9１-９一二三四五六七八九])([王玉飛車角金銀桂香歩龍竜馬成と同不打右左上寄引直]+)[あ-んっ＋−\+\-]?/g,
          replacement: [...POSITIONS, ...PIECES],
        }, {
          regexp: /(?<![＋\+−\-][0-9]*)([1-9１-９])([1-9１-９一二三四五六七八九])(?=[あ-ん指取成走入跳突叩攻守]|$)/g,
          replacement: [...POSITIONS],
        }, {
          regexp: /([王玉飛車角金銀桂香歩龍竜馬成と同不打右左上寄引直]{2,})[あ-んっ]?/g,
          replacement: [...PIECES],
        }];
        const MODIFICATIONS = [
          /* 固有名詞 - 人物 */
          [/大山/g, 'オーヤマ'],
          [/中原/g, 'ナカハラ'],
          [/米長/g, 'ヨネナガ'],
          [/一二三/g, 'ヒフミ'],
          [/羽生/g, 'ハブ'],
          [/豊島/g, 'トヨシマ'],
          [/天彦/g, 'アマヒコ'],
          [/太地/g, 'タイチ'],
          [/高見/g, 'タカミ'],
          [/八代/g, 'ヤシロ'],
          [/光瑠/g, 'コール'],
          [/聡ちゃん/g, 'ソーチャン'],
          [/市代/g, 'イチヨ'],
          [/室谷/g, 'ムロヤ'],
          [/香奈/g, 'カナ'],
          [/貞升/g, 'サダマス'],
          [/香川/g, 'カガワ'],
          [/桂香(?=ちゃん)/g, 'ケーカ'],
          [/(K|Ｋ)太/ig, 'ケータ'],
          [/イトシン(TV|ＴＶ)/ig, 'イトシンティーヴィー'],
          /* 固有名詞 - 名称 */
          [/朝日杯/, 'アサヒハイ'],
          [/NHK杯/, 'エネーチケーハイ'],
          [/JT杯/, 'ジェーティーハイ'],
          [/棋神/, 'キシン'],
          [/激指/, 'ゲキサシ'],
          [/elmo/, 'エルモ'],
          /* 用語 */
          [/評価値/, 'ヒョーカチ'],
          [/候補手/, 'コーホシュ'],
          [/互角/, 'ゴカク'],
          [/AI/, 'エーアイ'],
          [/将棋星人/, 'ショーギセージン'],
          [/級位者/, 'キューイシャ'],
          [/先手|▲|☗/g, 'センテ'],
          [/後手|△|☖|▽|⛉/g, 'ゴテ'],
          [/一手/g, 'イッテ'],
          [/早指し/, 'ハヤザシ'],
          [/早逃げ/, 'ハヤニゲ'],
          [/最善手/, 'サイゼンシュ'],
          [/次善手/, 'ジゼンシュ'],
          [/疑問手/, 'ギモンシュ'],
          [/筋悪/, 'スジワル'],
          [/長手数/, 'チョーテスー'],
          [/余詰(め)?/, 'ヨヅメ'],
          [/合(い)?駒/, 'アイゴマ'],
          [/中合(い)?/, 'チューアイ'],
          [/[1１一]筋/, 'イチスジ'],
          [/[2２二]筋/, 'ニスジ'],
          [/([1-9１-９一二三四五六七八九])冠/, '$1カン'],
          [/\s対\s/, ' タイ '],
          [/vs|ｖｓ/, 'ブイエス'],
          [/大盤/, 'オーバン'],
          [/昼休/, 'チューキュー'],
          [/夕休/, 'ユーキュー'],
          [/盤外戦/, 'バンガイセン'],
          [/中継/, 'チューケー'],
          [/上座/, 'カミザ'],
          [/下座/, 'シモザ'],
          /* 戦型 */
          [/定跡(型|形)/, 'ジョーセキケー'],
          [/力戦(型|形)/, 'リキセンケー'],
          [/対抗(型|形)/, 'タイコーケー'],
          [/理想(型|形)/, 'リソーケー'],
          [/急戦/, 'キューセン'],
          [/戦型/, 'センケー'],
          [/右玉/, 'ミギギョク'],
          [/相居(飛車|ヒシャ)/, 'アイイビシャ'],
          [/相(掛|懸)(かり)?/, 'アイガカリ'],
          [/横歩取り/, 'ヨコフドリ'],
          [/居(飛車|ヒシャ)/, 'イビシャ'],
          [/振(り)?(飛車|ヒシャ)/, 'フリビシャ'],
          [/中(飛車|ヒシャ)/, 'ナカビシャ'],
          [/四間(飛車|ヒシャ)/, 'シケンビシャ'],
          [/四間/, 'シケン'],
          [/三間(飛車|ヒシャ)/, 'サンケンビシャ'],
          [/三間/, 'サンケン'],
          [/向(かい)?(飛車|ヒシャ)/, 'ムカイビシャ'],
          [/早石田/, 'ハヤイシダ'],
          [/角(換|替)わり/, 'カクガワリ'],
          [/角交換/, 'カクコーカン'],
          [/一手損/, 'イッテゾン'],
          /* 戦法 */
          [/中座飛車/, 'チューザビシャ'],
          /* 囲い */
          [/玉[型形]/, 'ギョクケー'],
          [/居玉/, 'イギョク'],
          [/中住まい/, 'ナカズマイ'],
          [/(舟|船)囲い/, 'フナガコイ'],
          [/(ビッグ|big)(4|４)/i, 'ビッグフォー'],
          [/左美濃/, 'ヒダリミノ'],
          [/高美濃/, 'タカミノ'],
          [/金無双/, 'キンムソー'],
          /* 駒(1文字は特に最後へ) */
          [/大駒/, 'オーゴマ'],
          [/金駒/, 'カナゴマ'],
          [/小駒/, 'コゴマ'],
          [/玉頭/, 'ギョクトー'],
          [/王手(飛車|ヒシャ)/, 'オーテビシャ'],
          [/角頭/, 'カクトー'],
          [/角道/, 'カクミチ'],
          [/桂頭/, 'ケートー'],
          [/二歩/, 'ニフ'],
          [/と金/, 'とキン'],
          [/金底の歩/, 'キンゾコのフ'],
          [/玉/g, 'ギョク'],/*(?<!埼)*/
          [/角/g, 'カク'],
          [/金/g, 'キン'],/*(?<!お)*/
          [/桂馬/g, 'ケーマ'],
          [/桂/g, 'ケー'],
          [/香車/g, 'キョーシャ'],
          [/香(?![っらりるれろ])/g, 'キョー'],
          [/歩(?![いかきくけこ])/g, 'フ'],
          /* 評価値 */
          [/[＋\+]([0-9]+)/g, 'プラス$1'],
          [/[−\-]([0-9]+)/g, 'マイナス$1'],
        ];
        /* 棋譜と符号 */
        MOVES.forEach(p => {
          let tes = text.match(p.regexp);
          if(tes !== null) tes.forEach(te => {
            let yomi = te;
            p.replacement.forEach(p => yomi = yomi.replace(p[0], p[1]));
            text = text.replace(te, yomi);
          });
        });
        /* 用語 */
        MODIFICATIONS.forEach(m => text = text.replace(m[0], m[1]));
        /* 完了 */
        return text;
      },
    },
  };
  const TRANSLATORS = _TRANSLATORS[SITELANGUAGE] || _TRANSLATORS[SITELANGUAGE.substring(0, 2)] || _TRANSLATORS.en;
  const UNKNOWNPITCHRATIO = .5;/* 不明コメントのピッチ係数 */
  let sites = {
    abema: {
      id: 'abema',
      url: /^https:\/\/abema\.tv/,
      reverse: false,
      insertBefore: false,
      targets: {
        board: () => $('.com-a-OnReachTop > div'),
        settingAnchor: () => $('.com-tv-TVController__volume'),
      },
      addedNodes: {
        name: (node) => null,
        content: (node) => node.querySelector('div > p > span'),
        read: [
          [1.0, (node) => (node.querySelector('time[datetime]') !== null)],
        ],
        ignore: [],
      }
    },
    bilibili: {
      id: 'bilibili',
      url: /^https:\/\/live\.bilibili\.com\/[0-9]+/,
      reverse: false,
      insertBefore: false,
      targets: {
        board: () => $('#chat-items'),
        settingAnchor: () => $('.icon-right-part'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.user-name'),
        content: (node) => node.querySelector('.danmaku-content'),
        read: [
          [1.500, (node) => node.classList.contains('guard-level-1')],
          [1.250, (node) => node.classList.contains('guard-level-2')],
          [1.125, (node) => node.classList.contains('guard-danmaku')],
          [1.000, (node) => node.classList.contains('danmaku-item')],
        ],
        ignore: [
          [0.0, (node) => node.classList.contains('system-msg')],
          [0.0, (node) => node.classList.contains('welcome-msg')],
        ],
      }
    },
    douyu: {
      id: 'douyu',
      url: /^https:\/\/www\.douyu\.com\/.+/,
      reverse: false,
      insertBefore: false,
      targets: {
        board: () => $('#js-barrage-list'),
        settingAnchor: () => $('.ChatToolBar > *:last-child'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.Barrage-nickName'),
        content: (node) => node.querySelector('.Barrage-content'),
        read: [
          [1.25, (node) => (node.querySelector('.Barrage-message') !== null)],
          [1.00, (node) => (node.querySelector('.Barrage-notice--normalBarrage') !== null)],
        ],
        ignore: [
          [0.0, (node) => (node.querySelector('.Barrage-userEnter') !== null)],
          [0.0, (node) => (node.querySelector('.Barrage-notice') !== null)],
        ],
      }
    },
    fc2: {
      id: 'fc2',
      url: /^https:\/\/live\.fc2\.com\/[0-9]+/,
      reverse: false,
      insertBefore: true,
      targets: {
        board: () => $('#js-commentListContainer'),
        settingAnchor: () => $('.chat_tab-control > *:first-child'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.js-commentUserName'),
        content: (node) => node.querySelector('.js-commentText'),
        read: [
          [1.0, (node) => node.classList.contains('js-commentLine')],
        ],
        ignore: [],
      }
    },
    huajiao: {
      id: 'huajiao',
      url: /^https:\/\/www\.huajiao\.com\/l\/[0-9]+/,
      reverse: false,
      insertBefore: true,
      targets: {
        board: () => $('.tt-msg-list'),
        settingAnchor: () => $('.tt-type-form'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.tt-msg-nickname'),
        content: (node) => node.querySelector('.tt-msg-content-h5'),
        read: [
          [1.0, (node) => node.classList.contains('.tt-msg-message')],
        ],
        ignore: [],
      }
    },
    huya: {
      id: 'huya',
      url: /^https:\/\/www\.huya\.com\/.+/,
      reverse: false,
      insertBefore: true,
      targets: {
        board: () => $('#chat-room__list'),
        settingAnchor: () => $('.room-chat-tools > *:first-child'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.name'),
        content: (node) => node.querySelector('.msg'),
        read: [
          [1.25, (node) => (node.querySelector('.msg-nobleSpeak') !== null)],
          [1.00, (node) => (node.querySelector('.msg') !== null)],
        ],
        ignore: [
          [0.0, (node) => (node.querySelector('.msg-nobleEnter') !== null)],
        ],
      }
    },
    inke: {
      id: 'inke',
      url: /^https?:\/\/www\.inke\.cn\/live.+/,
      reverse: false,
      insertBefore: true,
      targets: {
        board: () => $('.comments_list > ul'),
        settingAnchor: () => $('.comments_box > input[type="text"]'),
      },
      addedNodes: {
        name: (node) => node.querySelector('li > span'),
        content: (node) => node.querySelector('.comments_text') || node.querySelector('.comments_gift'),
        read: [
          [1.0, (node) => (node.querySelector('img + span + span.comments_text') !== null)],
          [1.0, (node) => (node.querySelector('img + span + span.comments_gift') !== null)],
        ],
        ignore: [],
      },
    },
    line: {
      id: 'line',
      url: /^https:\/\/live\.line\.me\/channels\/[0-9]+\/broadcast\/[0-9]+/,
      reverse: false,
      insertBefore: false,
      targets: {
        board: () => $('[class*="Comment"] > div + div > [class*="Scroll"]'),
        settingAnchor: () => $('[class*="Notice"] > [class*="Desc"] > span'),
      },
      addedNodes: {
        name: (node) => node.querySelector('[class*="Head"]'),
        content: (node) => node.querySelector('[class*="Heart"]') || node.querySelector('[class*="Desc"]') || node,
        read: [
          [1.0, (node) => node.className.includes('Label')],
          [1.0, (node) => node.className.includes('Chat')],
        ],
        ignore: [],
      }
    },
    nicolive: {
      id: 'nicolive',
      url: /^https:\/\/live[0-9]+\.nicovideo\.jp\/watch\/[a-z]+[0-9]+/,
      reverse: false,
      insertBefore: false,
      targets: {
        board: () => $('[class*="_comment-panel_"] [class*="_table_"]'),
        settingAnchor: () => $('[class*="_setting-button_"]'),
      },
      addedNodes: {
        name: (node) => node.querySelector('[class*="_comment-author-name_"]'),
        content: (node) => node.querySelector('[class*="_comment-text_"]'),
        read: [
          [1.0, (node) => (node.dataset.commentType === 'nicoad')],
          [1.0, (node) => (node.dataset.commentType === 'normal')],
          [0.9, (node) => (node.dataset.commentType === 'trialWatch')],
          [0.5, (node) => (node.dataset.commentType === 'operator')],
        ],
        ignore: [],
      }
    },
    openrec: {
      id: 'openrec',
      url: /^https:\/\/www\.openrec\.tv\/live\/.+/,
      reverse: false,
      insertBefore: true,
      targets: {
        board: () => $('.chat-list-content'),
        settingAnchor: () => $('[class*="InputArea__ToolbarItem-"]'),
      },
      addedNodes: {
        name: (node) => node.querySelector('[class*="UserName__Name-"]'),
        content: (node) => node.querySelector('.chat-content'),
        read: [
          [1.0, (node) => node.className.includes('ChatList__CellContainer-')],
        ],
        ignore: [
          [0.0, (node) => node.className.includes('system-chat')],
        ],
      }
    },
    periscope: {
      id: 'periscope',
      url: /^https:\/\/www\.pscp\.tv\/w\/.+/,
      reverse: false,
      insertBefore: false,
      targets: {
        board: () => $('.Chat > div[style] > div[style]'),
        settingAnchor: () => $('.VideoOverlayRedesign-BottomBar-Right > *:last-child'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.CommentMessage-username'),
        content: (node) => node.querySelector('.CommentMessage-message'),
        read: [
          [1.0, (node) => (node.querySelector('.CommentMessage') !== null)],
        ],
        ignore: [
          [0.0, (node) => (node.querySelector('.ParticipantMessage') !== null)],
        ],
      }
    },
    showroom: {
      id: 'showroom',
      url: /^https:\/\/www\.showroom-live\.com\/.+/,
      reverse: true,
      insertBefore: true,
      targets: {
        board: () => $('#room-comment-log-list'),
        settingAnchor: () => $('#js-room-head-other-select-box', e => e.parentNode),
      },
      addedNodes: {
        name: (node) => node.querySelector('.comment-log-name'),
        content: (node) => node.querySelector('.comment-log-comment'),
        read: [
          [1.0, (node) => node.classList.contains('commentlog-row')],
        ],
        ignore: [],
      }
    },
    twitcasting: {
      id: 'twitcasting',
      url: /^https:\/\/twitcasting\.tv\/.+/,
      reverse: true,
      insertBefore: false,
      targets: {
        board: () => $('.tw-player-comment-list'),
        settingAnchor: () => $('#commentnumarea'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.tw-comment-item-name'),
        content: (node) => node.querySelector('.tw-comment-item-comment'),
        read: [
          [1.0, (node) => node.className.includes('tw-comment-item')],
        ],
        ignore: [],
      }
    },
    twitch: {
      id: 'twitch',
      url: /^https:\/\/www\.twitch\.tv/,
      reverse: false,
      insertBefore: true,
      targets: {
        board: () => $('[role="log"]'),
        settingAnchor: () => $('.chat-input__buttons-container [aria-describedby]'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.chat-author__display-name'),
        content: (node) => node.querySelector('.text-fragment'),
        read: [
          [1.0, (node) => node.className.includes('chat-line__message')],
        ],
        ignore: [],
      }
    },
    whowatch: {
      id: 'whowatch',
      url: /^https:\/\/whowatch\.tv\/viewer\/[0-9]+/,
      reverse: true,
      insertBefore: true,
      targets: {
        board: () => $('.normal-comment-list > div'),
        settingAnchor: () => $('.limit'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.user-name'),
        content: (node) => node.querySelector('.message'),
        read: [
          [1.0, (node) => node.classList.contains('comment-box')],
        ],
        ignore: [],
      },
    },
    yizhibo: {
      id: 'yizhibo',
      url: /^https:\/\/www\.yizhibo\.com\/l\/.+/,
      reverse: false,
      insertBefore: true,
      targets: {
        board: () => $('#J_msglist'),
        settingAnchor: () => $('#J_send_danmu'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.nickname'),
        content: (node) => node.querySelector('.content'),
        read: [
          [1.0, (node) => node.classList.contains('msg_1')],
        ],
        ignore: [
          [0.0, (node) => node.classList.contains('msg_2')],
          [0.0, (node) => node.classList.contains('msg_3')],
        ],
      },
    },
    youtube: {
      id: 'youtube',
      url: /^https:\/\/www\.youtube\.com\/live_chat/,
      reverse: false,
      insertBefore: true,
      targets: {
        board: () => $('#item-offset > #items'),
        settingAnchor: () => $('yt-live-chat-header-renderer yt-icon-button'),
      },
      addedNodes: {
        name: (node) => node.querySelector('#author-name'),
        content: (node) => node.querySelector('#message'),
        read: [
          [1.5, (node) => (node.localName === 'yt-live-chat-paid-message-renderer'), 'スパチャ'],
          [1.0, (node) => node.classList.contains('yt-live-chat-item-list-renderer')],
        ],
        ignore: [
          [0.0, (node) => (node.localName === 'yt-live-chat-viewer-engagement-message-renderer')],
        ],
      },
    },
    yy: {
      id: 'yy',
      url: /^https:\/\/www\.yy\.com\/[0-9]+\/[0-9]+/,
      reverse: false,
      insertBefore: false,
      targets: {
        board: () => $('.chatroom-list'),
        settingAnchor: () => $('.chat-room-ft'),
      },
      addedNodes: {
        name: (node) => node.querySelector('.nickname'),
        content: (node) => node.querySelector('.nickname + span'),
        read: [
          [1.0, (node) => node.classList.contains('phizbox')],
        ],
        ignore: [],
      },
    },
  };
  class Configs{
    constructor(configs){
      Configs.DICTIONARY = [...DICTIONARIES.default, ...(DICTIONARIES[site.id] || [])];
      Configs.TRANSLATORS = Object.keys(TRANSLATORS);
      Configs.PROPERTIES = {
        text:        {type: 'string', default: TEXTS.text()},
        volume:      {type: 'int',    default:  25},/*   0-100 => 0.0-1.0 */
        pitch:       {type: 'int',    default: 100},/*   0-200 => 0.0-2.0 */
        voice:       {type: 'string', default:  ''},/* name of voice */
        fastest:     {type: 'int',    default: 150},/* 100-250 => 1.0-2.5 */
        buffer:      {type: 'int',    default:   5},/*   1- 25 */
        dictionary:  {type: 'array',  default: Configs.DICTIONARY},/* replacement pairs */
        translators: {type: 'array',  default: []},/* name of translators */
        ngs:         {type: 'array',  default: []},/* ng word list */
      };
      this.data = this.read(configs || {});
    }
    read(configs){
      let newConfigs = {};
      Object.keys(Configs.PROPERTIES).forEach(key => {
        if(configs[key] === undefined) return newConfigs[key] = Configs.PROPERTIES[key].default;
        if(key === 'dictionary') return newConfigs[key] = configs[key].map(entry => {
          if(entry[0] instanceof RegExp) return entry;
          let parts = entry[0].match(/^\/(.*)\/([a-z]*)$/);
          if(parts === null) entry[0] = new RegExp(entry[0]);
          else entry[0] = new RegExp(parts[1], parts[2]);
          return entry;
        });
        switch(Configs.PROPERTIES[key].type){
          case('bool'):  return newConfigs[key] = (configs[key]) ? 1 : 0;
          case('int'):   return newConfigs[key] = parseInt(configs[key]);
          case('float'): return newConfigs[key] = parseFloat(configs[key]);
          default:       return newConfigs[key] = configs[key];
        }
      });
      return newConfigs;
    }
    toJSON(){
      let json = {};
      Object.keys(this.data).forEach(key => {
        switch(key){
          case('dictionary'):
            return json[key] = this.data[key].map(entry => {
              if(entry[2] === undefined) return [entry[0].toString(), entry[1]];
              else return [entry[0].toString(), entry[1], entry[2]];
            });
          default:
            return json[key] = this.data[key];
        }
      });
      return json;
    }
    parseDictionaryString(string){
      let wrapper = string.trim().match(/^\[([\S\s]+)\]$/);
      if(wrapper === null) return false;
      let entries = wrapper[1].trim().match(/\[(.+)\]\s*,/g);
      if(entries === null) return false;
      let lines = wrapper[1].trim().match(/.{3,}(\n|$)/g);
      if(lines.length !== entries.length) return false;
      let dictionary = [];
      for(let i = 0; entries[i]; i++){
        let parts = entries[i].trim().match(/\[\s*\/(.*)\/([a-z]*)\s*,\s*'(.*?[^\\])'(?:\s*,\s*'(.*[^\\])')?\s*\]\s*,/);
        if(parts === null) return false;
        dictionary[i] = [new RegExp(parts[1], parts[2]), parts[3]];
        if(parts[4] !== undefined) dictionary[i].push(parts[4]);
      }
      return dictionary;
    }
    parseNgsString(string){
      if(string.trim() === '') return [];
      else return string.trim().split(',').map(s => s.trim());
    }
    get text(){return this.data.text;}
    get volume(){return this.data.volume / 100;}
    get pitch(){return this.data.pitch / 100;}
    get voice(){return this.data.voice;}
    get fastest(){return this.data.fastest / 100;}
    get buffer(){return this.data.buffer;}
    get dictionary(){return this.data.dictionary;}
    get translators(){return this.data.translators;}
    get ngs(){return this.data.ngs;}
    get dictionaryString(){
      let dictionary = this.data.dictionary, string = '';
      let quote = (s) => '\'' + s.replace('\'', '\\\'') + '\'';
      dictionary.forEach(entry => {
        string += ' [';
        string += entry[0].toString();
        string += ', ';
        string += quote(entry[1]);
        if(entry[2] !== undefined){
          string += ', ';
          string += quote(entry[2]);
        }
        string += '],\n';
      });
      return '[\n' + string + ']';
    }
    get ngsString(){
      return this.data.ngs.join(',');
    }
  }
  class Speaker{
    constructor(configs){
      Speaker.TRANSLATORS = TRANSLATORS;
      this.speechSynthesis = speechSynthesis;
      this.voices = this.getVoices();
      this.configs = configs;
      this.queue = [];
      this.interval = 250;
    }
    getVoices(){
      let voices = {}, array = this.speechSynthesis.getVoices();
      if(array.length) array.forEach(v => voices[v.name] = v);
      else this.speechSynthesis.addEventListener('voiceschanged', () => this.voices = this.getVoices());
      return voices;
    }
    request(text, ratio, node){
      let utterance = new SpeechSynthesisUtterance(this.modify(text));
      utterance.pitch  = this.configs.pitch * ratio;
      utterance.node = node;
      this.queue.push(utterance);
      if(this.queue.length === 1){/* 2個以上あるならすでに連続発話が始まっている */
        setTimeout(() => this.speak(), 0);/* 一度に複数リクエストを受け取った際に合計数をrateに反映させたい */
      }
    }
    modify(text){
      this.configs.dictionary.forEach(d => text = text.replace(d[0], d[1]));
      this.configs.translators.forEach(key => text = Speaker.TRANSLATORS[key](text));
      return text;
    }
    speak(){
      if(this.queue.length === 0) return;
      if(this.configs.ngs.some(ng => this.queue[0].text.includes(ng))) return this.queue.shift(), this.speak();
      if(this.queue.length > this.configs.buffer) this.queue = this.queue.slice(-this.configs.buffer);/*古いものは切り捨てる*/
      let utterance = this.queue[0];
      utterance.volume = this.configs.volume;
      utterance.rate = 1 + ((this.queue.length - 1) / ((this.configs.buffer - 1) || 1))*(this.configs.fastest - 1);
      utterance.voice  = this.voices[this.configs.voice];
      utterance.node.dataset.speaking = 'true';
      utterance.addEventListener('end', (e) => {
        utterance.node.dataset.speaking = 'false';
        this.queue.shift();
        if(this.queue.length) setTimeout(() => this.speak(), this.interval);
      });
      log(utterance);
      this.speechSynthesis.speak(utterance);
    }
    cancel(){
      this.queue = [];
      this.speechSynthesis.cancel();
    }
    test(text, volume, pitch, voice, rate){
      let utterance = new SpeechSynthesisUtterance(this.modify(text));
      utterance.volume = volume;
      utterance.pitch  = pitch;
      utterance.voice  = this.voices[voice];
      utterance.rate   = rate;
      this.speechSynthesis.speak(utterance);
      log('Test:', text, '=>', utterance.text);
    }
  }
  let html, elements = {}, timers = {}, site, panels, configs, speaker;
  let core = {
    initialize: function(){
      html = document.documentElement;
      if(html){
        html.classList.add(SCRIPTID);
        core.site();
      }
    },
    site: function(){
      site = sites[Object.keys(sites).find(key => sites[key].url.test(location.href))];
      if(site === undefined) return log('Doesn\'t match any sites:', location.href);
      core.read();
      core.observeElements();
      core.addStyle();
      core.addStyle(site.id);
      core.addStyle('stylePanels', window.top.document);
      core.export();
    },
    observeElements: function(){
      /* 開閉する要素に対応。結局インターバルがいちばん負荷が軽い */
      setInterval(function(){
        new Promise(function(resolve, reject){
          if(elements.settingAnchor && elements.settingAnchor.isConnected) return resolve();
          elements.settingAnchor = site.targets.settingAnchor();
          if(elements.settingAnchor){
            core.configs.createButton();
            log("Configs button ready.");
            return resolve();
          }else{
            return reject();
          }
        }).then(() => {
          if(elements.board && elements.board.isConnected) return;
          elements.board = site.targets.board();
          if(elements.board){
            core.observeBoard(elements.board);
            log("Board ready.");
          }
        });
      }, 1000);
    },
    read: function(){
      panels = new Panels(window.top.document.body.appendChild(createElement(core.html.panels())));
      configs = new Configs(Storage.read('configs') || {});
      speaker = new Speaker(configs);
    },
    observeBoard: function(board){
      let configButton = elements.configButton;
      let isNewer = function(node){
        if(site.reverse){
          for(let i = 0; board.children[i]; i++){
            if(node === board.children[i]) return true;
            if(i >= configs.buffer) return false;
          }
        }else{
          for(let i = board.children.length - 1; board.children[i]; i--){
            if(node === board.children[i]) return true;
            if(board.children.length - i >= configs.buffer) return false;
          }
        }
      };
      observe(board, function(records){
        //log(records);
        if(configButton.classList.contains('active') === false) return;
        if(site.reverse) records.reverse();
        records.forEach(r => {
          r.addedNodes.forEach(n => {
            if(isNewer(n) === false) return;/*最後のbuffer個数分でなければ無視してよい*/
            let name = site.addedNodes.name(n);
            let content = site.addedNodes.content(n);
            if(content === null || content.textContent.trim() === '') return;
            let read = site.addedNodes.read.find(r => r[1](n));
            if(read) return speaker.request(content.textContent, read[0], content);
            else if(site.addedNodes.ignore.some(i => i[1](n))) return;
            else return speaker.request(content.textContent, UNKNOWNPITCHRATIO, content);
          });
        });
      });
    },
    configs: {
      createButton: function(){
        let anchor = elements.settingAnchor, before = site.insertBefore;
        let node, configButton = elements.configButton = createElement(core.html.configButton(core.html.configButtonProperties[site.id]));
        if(core.html.configButtonWrappers[site.id]){
          node = createElement(core.html.configButtonWrappers[site.id]());
          node.appendChild(configButton);
        }else{
          node = configButton;
        }
        node.className = [node.className, anchor.className].join(' ');
        configButton.addEventListener('click', function(e){
          configButton.classList.toggle('active');
          if(configButton.classList.contains('active') === false) speaker.cancel();
        });
        configButton.addEventListener('contextmenu', function(e){
          e.preventDefault();
          panels.toggle('configs');
        });
        anchor.parentNode.insertBefore(node, (before ? anchor : anchor.nextElementSibling));
        core.configs.createPanel();
      },
      createPanel: function(){
        let panel = createElement(core.html.configPanel()), itemElements = panel.querySelectorAll('[name]'), items = {};
        Array.from(itemElements).forEach(e => items[e.name] = e);
        /* リセット */
        panel.querySelector('button.reset').addEventListener('click', function(e){
          if(confirm(TEXTS.resetConfirmation())){
            panels.hide('configs');
            configs = new Configs({});
            core.configs.createPanel();
            panels.show('configs');
          }
        });
        /* 試し読み */
        let normal = panel.querySelector('button.normal'), fast = panel.querySelector('button.fast');
        let getValue = (node) => (parseInt(node.value) / 100);
        normal.addEventListener('click', function(e){
          speaker.test(items.text.value, getValue(items.volume), getValue(items.pitch), items.voice.value, 1);
        });
        fast.addEventListener('click', function(e){
          speaker.test(items.text.value, getValue(items.volume), getValue(items.pitch), items.voice.value, getValue(items.fastest));
        });
        /* 声 */
        let defaultVoice = Object.keys(speaker.voices).find(key => speaker.voices[key].default) || Object.keys(speaker.voices).find(key => speaker.voices[key].lang.startsWith(navigator.language));
        let currentVoice = speaker.voices[configs.voice || defaultVoice], languages = [], voices = [];
        Object.keys(speaker.voices).forEach(key => {
          if(languages.includes(speaker.voices[key].lang) === false) languages.push(speaker.voices[key].lang);
          voices.push(key);
        });
        languages.sort().forEach(l => {
          let option = createElement(core.html.option(l));
          if(l === currentVoice.lang) option.selected = true;
          items.language.appendChild(option);
        });
        voices.sort().forEach(v => {
          let option = createElement(core.html.option(v));
          if(speaker.voices[v].lang !== currentVoice.lang) option.classList.add('hidden');
          if(v === currentVoice.name) option.selected = true;
          items.voice.appendChild(option);
        });
        items.language.addEventListener('change', function(e){
          Array.from(items.voice.children).reverse().forEach(o => {
            if(speaker.voices[o.value].lang === e.target.value){
              o.classList.remove('hidden');
              o.selected = true;
            }
            else o.classList.add('hidden');
          });
        });
        /* 専門用語モード */
        let translatorTemplate = createElement(core.html.checkbox('translators', 'template')), translatorsEmpty = panel.querySelector('.translatorsEmpty');
        items.translators = [];
        Object.keys(TRANSLATORS).forEach(key => {
          let label = translatorTemplate.cloneNode(true), input = label.querySelector('input[type="checkbox"]');
          label.dataset.translator = key;
          input.value = key;
          input.checked = configs.translators.some(t => (t === key));
          translatorsEmpty.parentNode.insertBefore(label, translatorsEmpty.parentNode.firstElementChild);
          items.translators.push(input);
        });
        /* キャンセル */
        panel.querySelector('button.cancel').addEventListener('click', function(e){
          panels.hide('configs');
          core.configs.createPanel();/*クリアしておく*/
        });
        /* 保存 */
        panel.querySelector('button.save').addEventListener('click', function(e){
          let dictionary = configs.parseDictionaryString(items.dictionary.value);
          if(dictionary === false) return alert(TEXTS.dictionaryParseError());
          configs = new Configs({
            text:        items.text.value,
            volume:      items.volume.value,
            pitch:       items.pitch.value,
            voice:       items.voice.value,
            fastest:     items.fastest.value,
            buffer:      items.buffer.value,
            translators: Array.from(items.translators).filter(t => t.checked).map(t => t.value),
            dictionary:  dictionary,
            ngs:         configs.parseNgsString(items.ngs.value),
          });
          speaker.cancel();
          speaker = new Speaker(configs);
          Storage.save('configs', configs.toJSON());
          panels.hide('configs');
          core.configs.createPanel();/*クリアしておく*/
        });
        /* iframeだけ閉じられる場合にパネルが取り残されないようにする */
        window.addEventListener('unload', function(e){
          panels.hide('configs');
          core.configs.createPanel();/*クリアしておく*/
        }, {once: true});
        panels.add('configs', panel);
      },
    },
    export: function(){
      if(DEBUG){
        const ratio = 1, node = document.createElement('span');
        window.say = function(text){
          speaker.request(text, ratio, node);
        };
      }
    },
    addStyle: function(name = 'style', d = document){
      if(core.html[name] === undefined) return;
      let style = createElement(core.html[name]());
      d.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) d.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      configButtonWrappers: {
        showroom: () => `<li></li>`,
      },
      configButtonProperties: {
        nicolive: 'aria-label',
      },
      configButton: (property = 'title') => `
        <button id="${SCRIPTID}-config-button" ${property}="${TEXTS.scriptname()}">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 330 330" xml:space="preserve">
           <g id="XMLID_797_">
            <path id="XMLID_798_" d="M164.998,210c35.887,0,65.085-29.195,65.085-65.12l-0.204-80c0-35.776-29.105-64.88-64.881-64.88
              c-35.773,0-64.877,29.104-64.877,64.843l-0.203,80.076C99.918,180.805,129.112,210,164.998,210z"/>
            <path id="XMLID_799_" d="M280.084,154.96c0-8.285-6.717-15-15-15c-8.284,0-15,6.715-15,15c0,46.732-37.878,84.773-84.546,85.067
              c-0.181-0.007-0.357-0.027-0.54-0.027c-0.184,0-0.359,0.02-0.541,0.027c-46.664-0.293-84.541-38.335-84.541-85.067
              c0-8.285-6.717-15-15-15c-8.284,0-15,6.715-15,15c0,58.372,43.688,106.731,100.082,114.104V300H117c-8.284,0-15,6.716-15,15
              s6.716,15,15,15h96.002c8.283,0,15-6.716,15-15s-6.717-15-15-15h-33.004v-30.936C236.395,261.69,280.084,213.332,280.084,154.96z"/>
           </g>
          </svg>
        </button>
      `,
      configPanel: () => `
        <div class="panel" id="${SCRIPTID}-config-panel" data-order="1">
          <h1>
            <button class="reset" title="${TEXTS.reset()}">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                <g><path d="M500,10v392l196-196L500,10z"/><path d="M500,990C271.3,990,85.1,803.8,85.1,575.1c0-228.7,186.2-414.9,414.9-414.9v91.5c-176.4,0-323.4,143.7-323.4,323.4c0,179.7,143.7,323.4,323.4,323.4c179.7,0,323.4-143.7,323.4-323.4h91.5C914.9,803.8,728.7,990,500,990z"/></g>
              </svg>
            </button>
            ${TEXTS.configs()}
          </h1>
          <fieldset>
            <legend>${TEXTS.test()}</legend>
            <p class="property"><input type="text" name="text" value="${configs.data.text}"><button class="normal">▶</button><button class="fast">▶▶</button></p>
          </fieldset>
          <fieldset>
            <legend>${TEXTS.speech()}</legend>
            <p class="property"><label for="config-volume">${TEXTS.volume()}<small>(0-100%)</small>:</label><input type="number" name="volume" id="config-volume" value="${configs.data.volume}" min="0" max="100" step="5"></p>
            <p class="property"><label for="config-pitch" >${TEXTS.pitch()}<small>(0-200%)</small>: </label><input type="number" name="pitch"  id="config-pitch"  value="${configs.data.pitch}"  min="0" max="200" step="10"></p>
            <p class="property"><label for="config-voice" >${TEXTS.voice()}:</label><select name="language"></select><select name="voice" id="config-voice"></select></p>
          </fieldset>
          <fieldset>
            <legend>${TEXTS.fast()}</legend>
            <p class="property"><label for="config-fastest">${TEXTS.fastest()}<small>(100-250%)</small>:                </label><input type="number" name="fastest" id="config-fastest" value="${configs.data.fastest}" min="100" max="250" step="10"></p>
            <p class="property"><label for="config-buffer" title="${TEXTS.bufferNote()}">${TEXTS.buffer()}<sup>※</sup>:</label><input type="number" name="buffer"  id="config-buffer"  value="${configs.data.buffer}"  min="1"   max="25"  step="1"></p>
          </fieldset>
          <fieldset>
            <legend>${TEXTS.translators()}</legend>
            <p class="property"><span class="translatorsEmpty">${TEXTS.translatorsEmpty()}</span></p>
          </fieldset>
          <fieldset>
            <legend>${TEXTS.dictionary()}<small>${TEXTS.professional()}</small></legend>
            <p class="property"><textarea name="dictionary" id="config-dictionary">${configs.dictionaryString}</textarea></p>
            <p class="note">${TEXTS.dictionaryNote()}</p>
          </fieldset>
          <fieldset>
            <legend>${TEXTS.ng()}</legend>
            <p class="property"><textarea name="ngs" id="config-ngs">${configs.ngsString}</textarea></p>
            <p class="note">${TEXTS.ngNote()}</p>
          </fieldset>
          <p class="buttons"><button class="cancel">${TEXTS.cancel()}</button><button class="save primary">${TEXTS.save()}</button></p>
        </div>
      `,
      option: (value) => `<option value="${value}">${value}</option>`,
      checkbox: (key, value) => `<label data-${key}="${value}"><input type="checkbox" name="${key}"></label>`,
      panels: () => `<div class="panels" id="${SCRIPTID}-panels" data-panels="0"></div>`,
      stylePanels: () => `
        <style type="text/css">
          /* 設定パネル(共通) */
          #${SCRIPTID}-panels *{
            font-size: 14px;
            line-height: 20px;
            padding: 0;
            margin: 0;
          }
          #${SCRIPTID}-panels{
            font-family: Arial, sans-serif;
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
            pointer-events: none;
            cursor: default;
            z-index: 99999;
          }
          #${SCRIPTID}-panels div.panel{
            position: absolute;
            max-height: 100%;/*小さなウィンドウに対応*/
            overflow: auto;
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 50%);
            background: rgba(0,0,0,.75);
            transition: 250ms;
            padding: 5px 0;
            pointer-events: auto;
          }
          #${SCRIPTID}-panels div.panel.hidden{
            bottom: 0;
            transform: translate(-50%, 100%) !important;
            display: block !important;
          }
          #${SCRIPTID}-panels div.panel.hidden *{
            animation: none !important;/*CPU負荷軽減*/
          }
          #${SCRIPTID}-panels h1,
          #${SCRIPTID}-panels h2,
          #${SCRIPTID}-panels h3,
          #${SCRIPTID}-panels h4,
          #${SCRIPTID}-panels legend,
          #${SCRIPTID}-panels ul,
          #${SCRIPTID}-panels ol,
          #${SCRIPTID}-panels dl,
          #${SCRIPTID}-panels p{
            color: white;
            padding: 2px 10px;
            vertical-align: baseline;
          }
          #${SCRIPTID}-panels legend ~ p,
          #${SCRIPTID}-panels legend ~ ul,
          #${SCRIPTID}-panels legend ~ ol,
          #${SCRIPTID}-panels legend ~ dl{
            padding-left: calc(10px + 14px);
          }
          #${SCRIPTID}-panels header{
            display: flex;
          }
          #${SCRIPTID}-panels header h1{
            flex: 1;
          }
          #${SCRIPTID}-panels fieldset{
            border: none;
          }
          #${SCRIPTID}-panels fieldset > p{
            display: flex;
            align-items: center;
          }
          #${SCRIPTID}-panels fieldset > p.property:hover{
            background: rgba(255,255,255,.125);
          }
          #${SCRIPTID}-panels fieldset > p.property > label{
            flex: 1;
          }
          #${SCRIPTID}-panels fieldset > p.property > input,
          #${SCRIPTID}-panels fieldset > p.property > textarea,
          #${SCRIPTID}-panels fieldset > p.property > select{
            color: black;
            background: white;
            padding: 1px 2px;
          }
          #${SCRIPTID}-panels fieldset > p.property > input,
          #${SCRIPTID}-panels fieldset > p.property > button{
            box-sizing: border-box;
            height: 20px;
          }
          #${SCRIPTID}-panels fieldset small{
            font-size: 12px;
            margin: 0 0 0 .25em;
          }
          #${SCRIPTID}-panels fieldset sup,
          #${SCRIPTID}-panels fieldset p.note{
            font-size: 10px;
            line-height: 14px;
            opacity: .75;
          }
          #${SCRIPTID}-panels div.panel > p.buttons{
            text-align: right;
            padding: 5px 10px;
          }
          #${SCRIPTID}-panels div.panel > p.buttons button{
            line-height: 1.4;
            width: 120px;
            padding: 5px 10px;
            margin-left: 10px;
            border-radius: 5px;
            color: rgba(255,255,255,1);
            background: rgba(64,64,64,1);
            border: 1px solid rgba(255,255,255,1);
            cursor: pointer;
          }
          #${SCRIPTID}-panels div.panel > p.buttons button.primary{
            font-weight: bold;
            background: rgba(0,0,0,1);
          }
          #${SCRIPTID}-panels div.panel > p.buttons button:hover,
          #${SCRIPTID}-panels div.panel > p.buttons button:focus{
            background: rgba(128,128,128,1);
          }
          #${SCRIPTID}-panels .template{
            display: none !important;
          }
          /* 設定パネル */
          #${SCRIPTID}-config-panel{
            width: 320px;
          }
          #${SCRIPTID}-config-panel button.reset{
            float: right;
            font-size: 20px;
            color: white;
            background: black;
            border: 1px solid #666;
            border-radius: 5px;
            width: 1em;
            height: 1em;
            cursor: pointer;
          }
          #${SCRIPTID}-config-panel button.reset:hover{
            background: #333;
          }
          #${SCRIPTID}-config-panel button.reset svg{
            fill: white;
            width: 100%;
            height: 100%;
            padding: 2px;
            box-sizing: border-box;
          }
          #${SCRIPTID}-config-panel input[type="number"]{
            width: 4em;
          }
          #${SCRIPTID}-config-panel input[name="text"]{
            border: 1px solid #999;
            border-radius: 5px 0 0 5px;
            height: 24px;
            flex: 1;
          }
          #${SCRIPTID}-config-panel input[name="text"] ~ button{
            font-size: 10px;
            white-space: nowrap;
            color: white;
            background: #000;
            border: 1px solid #666;
            border-left: none;
            width: 4em;
            height: 24px;
            padding: 0 1em;
            cursor: pointer;
          }
          #${SCRIPTID}-config-panel input[name="text"] ~ button.fast{
            border-radius: 0 5px 5px 0;
          }
          #${SCRIPTID}-config-panel input[name="text"] ~ button:hover{
            background: #333;
          }
          #${SCRIPTID}-config-panel select#config-voice{
              max-width: 120px;
          }
          #${SCRIPTID}-config-panel option.hidden{
            display: none;
          }
          #${SCRIPTID}-config-panel label[data-translator]{
            background: #333;
            border: 1px solid #666;
            border-radius: 5px;
            padding: 2px 5px;
            flex: 0 !important;
            white-space: nowrap;
            cursor: pointer;
          }
          #${SCRIPTID}-config-panel label[data-translator]:hover{
            background: #444;
          }
          #${SCRIPTID}-config-panel label[data-translator]::after{
            content: attr(data-translator);
            margin-left: 5px;
          }
          #${SCRIPTID}-config-panel label[data-translator] input{
            cursor: pointer;
          }
          #${SCRIPTID}-config-panel .translatorsEmpty{
            opacity: .75;
          }
          #${SCRIPTID}-config-panel label + .translatorsEmpty{
            display: none;
          }
          #${SCRIPTID}-config-panel textarea{
            width: 100%;
            height: 40px;
            font-family: monospace;
          }
        </style>
      `,
      style: () => `
        <style type="text/css">
          /* 設定ボタン */
          button#${SCRIPTID}-config-button{
            background: transparent;
            border: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            transition: 125ms;
          }
          button#${SCRIPTID}-config-button svg{
            fill: #666;
          }
          button#${SCRIPTID}-config-button:hover svg{
            fill: #999;
          }
          button#${SCRIPTID}-config-button.active svg{
            fill: #f00;
          }
          button#${SCRIPTID}-config-button.active:hover svg{
            fill: #f33;
          }
          /* 読み上げコメント */
          [data-speaking="true"]{
            position: relative !important;
            overflow: visible !important;
          }
          [data-speaking="true"]::after/*公式がbeforeを使っていても干渉しない*/{
            font-family: Arial, sans-serif;
            content: "●";
            color: red;
            font-size: 100%;
            position: absolute;
            left: -.125em;
            top: 50%;
            transform: translate(-100%, -50%);
            animation: ${SCRIPTID}-blink 1000ms ease 0ms infinite alternate forwards;
          }
          @keyframes ${SCRIPTID}-blink{
            50%{opacity: .5}
          }
        </style>
      `,
      abema: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 40px;
            height: 40px;
          }
          button#${SCRIPTID}-config-button svg{
            width: 24px;
            height: 24px;
            transform: translateY(7px);
            fill: #ccc;
          }
          button#${SCRIPTID}-config-button:hover svg{
            fill: #fff;
          }
          button#${SCRIPTID}-config-button.active svg{
            fill: #f00;
          }
        </style>
      `,
      bilibili: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 20px;
            height: 20px;
            transform: translateY(1px);
            vertical-align: middle;
          }
          button#${SCRIPTID}-config-button::before{
            display: none;
          }
          [data-speaking="true"]{
            position: static !important;
          }
          [data-speaking="true"]::after{
            left: .25em;
          }
        </style>
      `,
      douyu: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 20px;
            height: 20px;
            transform: translate(-5px, calc(-100% - 5px));
            vertical-align: middle;
          }
          [data-speaking="true"]{
            position: static !important;
          }
          [data-speaking="true"]::after{
            left: .625em;
          }
        </style>
      `,
      fc2: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 42px;
            height: 38px;
          }
          button#${SCRIPTID}-config-button svg{
            width: 24px;
            height: 24px;
            transform: translateY(1px);
          }
          [data-speaking="true"]::after{
            left: .5em;
          }
          .js-commentLine{
            position: relative;
          }
          .js-commentText{
            position: static !important;
          }
        </style>
      `,
      huajiao: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 30px;
            height: 30px;
            position: absolute;
            left: 100%;
            top: 0;
            transform: translate(-100%,-100%);
          }
          button#${SCRIPTID}-config-button svg{
            width: 24px;
            height: 24px;
            transform: translateY(1px);
          }
          .tt-msg-message{
            position: relative;
          }
          [data-speaking="true"]{
            position: static !important;
          }
          [data-speaking="true"]::after{
            left: 1.25em;
          }
        </style>
      `,
      huya: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 22px;
            height: 22px;
            transform: translateY(1px);
            vertical-align: middle;
            float: left;
            margin-right: 10px;
          }
          button#${SCRIPTID}-config-button::before{
            display: none;
          }
          .J_msg{
            position: relative;
          }
          [data-speaking="true"]{
            position: static !important;
          }
          [data-speaking="true"]::after{
            left: .625em;
          }
        </style>
      `,
      inke: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 36px;
            height: 36px;
            position: absolute;
            left: 100%;
            top: 0;
            transform: translate(calc(-100% - 10px), -100%)
          }
          button#${SCRIPTID}-config-button svg{
            width: 24px;
            height: 24px;
            transform: translateY(1px);
          }
          .comments_list li{
            position: relative;
          }
          [data-speaking="true"]{
            position: static !important;
          }
          [data-speaking="true"]::after{
            left: calc(28px + .65em);
          }
        </style>
      `,
      line: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 40px;
            height: 40px;
            float: right;
          }
          button#${SCRIPTID}-config-button svg{
            width: 24px;
            height: 24px;
            transform: translateY(1px);
          }
          #${SCRIPTID}-config-panel legend{
            position: static;
            width: auto;
            height: auto;
          }
          [class*="Chat"] [data-speaking="true"]{
            position: static !important;
          }
          [class*="Chat"] [data-speaking="true"]::after{
            left: 1em;
          }
          [class*="Label"][data-speaking="true"]::after{
            left: 0em;
          }
        </style>
      `,
      nicolive: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 32px;
            height: 36px;
          }
          button#${SCRIPTID}-config-button svg{
            width: 20px;
            height: 20px;
            transform: translateY(1px);
          }
        </style>
      `,
      openrec: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 2.2rem;
            height: 2.2rem;
            margin-right: 1rem;
          }
          .chat-content[data-speaking="true"]{
            position: static !important;
          }
        </style>
      `,
      periscope: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 32px;
            height: 32px;
            margin-left: 10px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 32px;
          }
          button#${SCRIPTID}-config-button svg{
            width: 20px;
            height: 20px;
          }
          .CommentMessage-body,
          [data-speaking="true"]{
            position: static !important;
          }
        </style>
      `,
      showroom: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 60px;
            height: 50px;
          }
          button#${SCRIPTID}-config-button svg{
            width: 28px;
            height: 28px;
            transform: translateY(2px);
          }
        </style>
      `,
      twitcasting: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 2em;
            height: 2em;
            margin-left: .5em;
          }
          #${SCRIPTID}-config-panel legend{
            border: none;
            width: auto;
          }
          #${SCRIPTID}-config-panel input,
          #${SCRIPTID}-config-panel select{
            width: auto;
          }
        </style>
      `,
      twitch: () => `
        <style type="text/css">
          .chat-input__buttons-container > div > .tw-relative > div{
            display: flex;
          }
          button#${SCRIPTID}-config-button{
            width: 3rem;
            height: 3rem;
            padding: .4rem;
          }
          button#${SCRIPTID}-config-button > svg{
            width: 3rem;
            height: 3rem;
            position: relative;
            top: -.4rem;
          }
          #${SCRIPTID}-config-panel button{
            text-align: center;
          }
          .chat-line__message{
            position: relative;
          }
          .chat-line__message [data-speaking="true"]{
            position: static !important;
          }
          .chat-line__message [data-speaking="true"]::after{
            left: -5px;
          }
        </style>
      `,
      whowatch: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 36px;
            height: 36px;
            position: absolute;
            left: 0;
            bottom: 0;
          }
          button#${SCRIPTID}-config-button svg{
            width: 32px;
            height: 32px;
            transform: translateY(4px);
          }
          form .row{
            position: relative;
          }
          [data-speaking="true"]{
            position: static !important;
          }
        </style>
      `,
      yizhibo: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 30px;
            height: 30px;
            position: absolute;
            left: 100%;
            top: 0;
            transform: translate(-100%,-100%);
          }
          button#${SCRIPTID}-config-button svg{
            width: 24px;
            height: 24px;
            transform: translateY(1px);
          }
          .msg_1{
            overflow: visible !important;
          }
          [data-speaking="true"]{
            position: static !important;
          }
        </style>
      `,
      youtube: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 40px;
            height: 40px;
          }
          button#${SCRIPTID}-config-button svg{
            width: 20px;
            height: 20px;
            transform: translateY(1px);
          }
          yt-live-chat-text-message-renderer #content{
            position: relative !important;
          }
          yt-live-chat-text-message-renderer [data-speaking="true"]{
            position: static !important;
          }
          paper-tooltip #tooltip{
            white-space: nowrap;
          }
        </style>
      `,
      yy: () => `
        <style type="text/css">
          button#${SCRIPTID}-config-button{
            width: 30px;
            height: 30px;
            position: absolute;
            left: 100%;
            top: 0;
            transform: translate(calc(-100% - 5px), calc(-100% - 5px));
          }
          button#${SCRIPTID}-config-button svg{
            width: 24px;
            height: 24px;
            transform: translateY(1px);
          }
          ul.chatroom-list > li{
            position: relative;
          }
          [data-speaking="true"]{
            position: static !important;
          }
          [data-speaking="true"]::after{
            left: .5em;
          }
        </style>
      `,
    },
  };
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window), setInterval = window.setInterval.bind(window), clearInterval = window.clearInterval.bind(window), requestAnimationFrame = window.requestAnimationFrame.bind(window), requestIdleCallback = window.requestIdleCallback.bind(window);
  const alert = window.alert.bind(window), confirm = window.confirm.bind(window), prompt = window.prompt.bind(window), getComputedStyle = window.getComputedStyle.bind(window), fetch = window.fetch.bind(window);
  if(!('isConnected' in Node.prototype)) Object.defineProperty(Node.prototype, 'isConnected', {get: function(){return document.contains(this)}});
  class Storage{
    static key(key){
      return (SCRIPTID) ? (SCRIPTID + '-' + key) : key;
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
  class Panels{
    constructor(parent){
      this.parent = parent;
      this.panels = {};
      this.listen();
    }
    listen(){
      window.addEventListener('keydown', (e) => {
        if(e.key !== 'Escape') return;
        if(['input', 'textarea'].includes(document.activeElement.localName)) return;
        Object.keys(this.panels).forEach(key => this.hide(key));
      }, true);
    }
    add(name, panel){
      this.panels[name] = panel;
    }
    toggle(name){
      let panel = this.panels[name];
      if(panel.isConnected === false || panel.classList.contains('hidden')) this.show(name);
      else this.hide(name);
    }
    show(name){
      let panel = this.panels[name];
      if(panel.isConnected) return;
      panel.classList.add('hidden');
      this.parent.appendChild(panel);
      this.parent.dataset.panels = parseInt(this.parent.dataset.panels) + 1;
      animate(() => panel.classList.remove('hidden'));
    }
    hide(name){
      let panel = this.panels[name];
      if(panel.classList.contains('hidden')) return;
      panel.classList.add('hidden');
      panel.addEventListener('transitionend', (e) => {
        this.parent.removeChild(panel);
        this.parent.dataset.panels = parseInt(this.parent.dataset.panels) - 1;
      }, {once: true});
    }
  }
  const $ = function(s, f){
    let target = document.querySelector(s);
    if(target === null) return null;
    return f ? f(target) : target;
  };
  const $$ = function(s, f){
    let targets = document.querySelectorAll(s);
    return f ? Array.from(targets).map(t => f(t)) : targets;
  };
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
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
  const normalize = function(string){
    return string.replace(/[！-～]/g, function(s){
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    }).replace(normalize.RE, function(s){
      return normalize.KANA[s];
    }).replace(/　/g, ' ').replace(/～/g, '〜');
  };
  normalize.KANA = {
    ｶﾞ:'ガ', ｷﾞ:'ギ', ｸﾞ:'グ', ｹﾞ:'ゲ', ｺﾞ: 'ゴ',
    ｻﾞ:'ザ', ｼﾞ:'ジ', ｽﾞ:'ズ', ｾﾞ:'ゼ', ｿﾞ: 'ゾ',
    ﾀﾞ:'ダ', ﾁﾞ:'ヂ', ﾂﾞ:'ヅ', ﾃﾞ:'デ', ﾄﾞ: 'ド',
    ﾊﾞ:'バ', ﾋﾞ:'ビ', ﾌﾞ:'ブ', ﾍﾞ:'ベ', ﾎﾞ: 'ボ',
    ﾊﾟ:'パ', ﾋﾟ:'ピ', ﾌﾟ:'プ', ﾍﾟ:'ペ', ﾎﾟ: 'ポ',
    ﾜﾞ:'ヷ', ｦﾞ:'ヺ', ｳﾞ:'ヴ',
    ｱ:'ア', ｲ:'イ', ｳ:'ウ', ｴ:'エ', ｵ:'オ',
    ｶ:'カ', ｷ:'キ', ｸ:'ク', ｹ:'ケ', ｺ:'コ',
    ｻ:'サ', ｼ:'シ', ｽ:'ス', ｾ:'セ', ｿ:'ソ',
    ﾀ:'タ', ﾁ:'チ', ﾂ:'ツ', ﾃ:'テ', ﾄ:'ト',
    ﾅ:'ナ', ﾆ:'ニ', ﾇ:'ヌ', ﾈ:'ネ', ﾉ:'ノ',
    ﾊ:'ハ', ﾋ:'ヒ', ﾌ:'フ', ﾍ:'ヘ', ﾎ:'ホ',
    ﾏ:'マ', ﾐ:'ミ', ﾑ:'ム', ﾒ:'メ', ﾓ:'モ',
    ﾔ:'ヤ', ﾕ:'ユ', ﾖ:'ヨ',
    ﾗ:'ラ', ﾘ:'リ', ﾙ:'ル', ﾚ:'レ', ﾛ:'ロ',
    ﾜ:'ワ', ｦ:'ヲ', ﾝ:'ン',
    ｧ:'ァ', ｨ:'ィ', ｩ:'ゥ', ｪ:'ェ', ｫ:'ォ',
    ｯ:'ッ', ｬ:'ャ', ｭ:'ュ', ｮ:'ョ',
    "｡":'。', "､":'、', "ｰ":'ー', "｢":'「', "｣":'」', "･":'・',
  };
  normalize.RE = new RegExp('(' + Object.keys(normalize.KANA).join('|') + ')', 'g');
  const log = function(){
    if(typeof DEBUG === 'undefined') return;
    let l = log.last = log.now || new Date(), n = log.now = new Date();
    let error = new Error(), line = log.format.getLine(error), callers = log.format.getCallers(error);
    //console.log(error.stack);
    console.log(
      SCRIPTID + ':',
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
      getLine: (e) => e.stack.split('\n')[1].match(/([0-9]+):[0-9]+$/)[1] - 2,
      getCallers: (e) => e.stack.match(/^[^@]*(?=@)/gm),
    }, {
      name: 'Chrome Console',
      detector: /at MARKER \(<anonymous>/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \(chrome-extension:.*?\/userscript.html\?name=/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)?$/)[1] - 1,
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
  const warn = function(){
    if(!DEBUG) return;
    let body = Array.from(arguments).join(' ');
    if(warn.notifications[body]) return;
    Notification.requestPermission();
    warn.notifications[body] = new Notification(SCRIPTNAME, {body: body});
    warn.notifications[body].addEventListener('click', function(e){
      Object.values(warn.notifications).forEach(n => n.close());
      warn.notifications = {};
    });
    log(body);
  };
  warn.notifications = {};
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
  if(window === top && console.timeEnd) console.timeEnd(SCRIPTID);
})();