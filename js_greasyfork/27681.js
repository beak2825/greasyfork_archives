// ==UserScript==
// @name           KoebutaSlayer
// @namespace      https://github.com/albno273/KoebutaSlayer
// @description    Adds a button that eliminates evil replys to tweet details.
// @description:ja ツイート詳細に声豚のリプライを抹殺するボタンを追加します。
// @include        https://twitter.com/*
// @version        2.1.1
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_log
// @grant          GM_registerMenuCommand
// @license        MIT License
// @downloadURL https://update.greasyfork.org/scripts/27681/KoebutaSlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/27681/KoebutaSlayer.meta.js
// ==/UserScript==

// 使用スクリプト: GM config
// https://openuserjs.org/src/libs/sizzle/GM_config.js
// 参考: Extract images for Twitter
// https://greasyfork.org/ja/scripts/15271-extract-images-for-twitter

'use strict';

// 除外リスト(初期設定)
const defaultWhitelistArray = [
  '0309akari',      '0812asumikana',  '38kMarie',        'AyakaOhashi',
  'Emiryun',        'Erietty_55',     'ErikoMatsui',     'HiRoMi_ig',
  'Lynn_0601_',     'Miho_Aaaa',      'OnoSaki1126',     'RiccaTachibana',
  'TomoyoKurosawa', 'Uesakasumire',   'Yaskiyo_manager', 'akekodao',
  'coloruri',       'eerie_eery',     'fuchigami_mai',   'han_meg_han',
  'ibuking_1114',   'kanekosanndesu', 'kurapimk',        'maaya_taso',
  'makomorino',     'marika_0222',    'mikakokomatsu',   'mikami_shiori',
  'nanjolno',       'nojomiy',        'numakura_manami', 'osorasan703',
  'ousakichiyo',    'reimatsuzaki',   'shimoda_asami',   'shiori_izawa',
  'suzaki_aya',     'takamori_723',   'tanezakiatsumi',  'yuichupunch',
  'yukari_tamura',  'yuuka_aisaka',   'yuumin_uchiyama'
];

// 初期設定
GM_config.init(
  {
    'id':    'KoebutaSlayerConfig',
    'title': 'KoebutaSlayer 設定',
    'fields':
    {
      'slayBehavior':
      {
        'label':   '抹殺時の挙動',
        'type':    'radio',
        'options': ['非表示にする', 'ニンジャスレイヤー風'],
        'default': '非表示にする'
      },
      'whitelist':
      {
        'label':   'ホワイトリスト(ID を改行で区切って入力してください)',
        'type':    'textarea',
        'default': `${defaultWhitelistArray.join('\n')}`
      }
    },
    'events':
    {
      'save': () => {
        // 単語構成文字と改行以外の文字があったら注意
        if(/[^0-9_a-zA-Z\n]/g.test(GM_config.fields['whitelist'].toValue()))
          alert('Caution!\nホワイトリストに半角英数字とアンダーバー、' +
                '改行以外の文字が入っていませんか？');
        alert('設定を保存しました。');
      },
      'reset': () => {
        alert('設定を初期化しました。');
      }
    }
  }
);

GM_registerMenuCommand("抹殺設定", function () { GM_config.open(); });

(() => {

  const processedList      = new WeakMap(),
        processedTweetList = new WeakMap();

  let slayCount = 0, // ツイート抹殺数
      isSlayed  = false;

  // 抹殺ボタンを作る
  const createSlayer = (tweetList) => {
    slayCount = 0;
    const slayer = document.createElement('div');
    slayer.setAttribute('class', 'ProfileTweet-action ProfileTweet-action--Slay');
    slayer.innerHTML =
      '<button class="ProfileTweet-actionButton js-actionButton js-actionSlay" type="button">' +
      '<div class="IconContainer js-tooltip" title="抹殺">' +
      '<span class="Icon Icon--medium Icon--close"></span>' +
      '<span class="u-hiddenVisually">抹殺</span>' +
      '</div>' +
      '<span class="ProfileTweet-actionCount ">' +
      '<span class="ProfileTweet-actionCountForPresentation Slay-counter" aria-hidden="true"></span>' +
      '</span>' +
      '</button>';
    const icon    = slayer.getElementsByClassName('Icon')[0],
          counter = slayer.getElementsByClassName('Slay-counter')[0];
    slayer.addEventListener('mouseenter', () => {
      icon.style.color    = 'darkred';
      counter.style.color = 'darkred';
    });
    slayer.addEventListener('mouseleave', () => {
      if(!isSlayed) {
        icon.style.color    = '';
        counter.style.color = '';
      }
    });
    slayer.addEventListener('click', () => {
      slayTweet(tweetList);
      if(slayCount != 0) {
        isSlayed = true;
        // 抹殺したツイート数を更新
        setTimeout(() => {
          counter.textContent = slayCount;
        }, 500);
      }
    });
    return slayer;
  };

  // 抹殺ボタンを追加
  const addSlayer = () => {
    const tweetList = document.getElementsByClassName('ProfileTweet-actionList');
    for (let i = 0, len = tweetList.length; i < len; i++) {
      const tweet = tweetList[i];
      if(!processedList.has(tweet)) {
        // 画面遷移前のボタンが残った時に削除
        const oldSlayer = tweet.getElementsByClassName('ProfileTweet-action--Slay')[0];
        if(oldSlayer)
          oldSlayer.remove();
        // ホワイトリストに入ってるアカウントのツイートの詳細欄にのみボタンを登録
        // TODO: parentNode 連打やめたい
        const tweetGGparent = tweet.parentNode.parentNode.parentNode,
              wl            = GM_config.get('whitelist').split('\n'),
              id            = /@(\w+)/g.exec(tweetGGparent.innerText)[1];
        if(tweetGGparent.classList.contains('permalink-tweet-container')) {
          if(wl.indexOf(id) >= 0) {
            processedList.set(tweet, 1);
            tweet.appendChild(createSlayer(tweetList));
          }
        }
      }
    }
  };

  // ツイートを抹殺
  const slayTweet = (tweetList) => {
    const behavior = GM_config.get('slayBehavior'),
          wl       = GM_config.get('whitelist').split('\n');
    for (let i = 0, len = tweetList.length; i < len; i++) {
      // 画面遷移前のツイートも含まれるのでリプライのみ抽出
      // TODO: parentsNode 連打やめたい
      const tweets = tweetList[i].parentNode.parentNode.parentNode.parentNode
        .getElementsByClassName('permalink-descendant-tweet');
      if(tweets.length == 1) {
        const tweet    = tweets[0],
              from     = tweet.getAttribute('data-screen-name'),
              to       = tweet.getAttribute('data-mentions');
        if(!processedTweetList.has(tweet)) {
          // チェインはされてるけど @id が明記されていない場合
          if(wl.indexOf(from) == -1 && to == null)
            slay(behavior, tweet);
          else {
            const toArr = to.split(' ');
            toArr.forEach((value, index, array) => {
              if (wl.indexOf(from) == -1 && wl.indexOf(value) >= 0)
                slay(behavior, tweet);
            });
          }
        }
      }
    }
  };

  const slay = (behavior, tweet) => {
    if(behavior == '非表示にする')
       tweet.style.display = 'none';
    else if(behavior == 'ニンジャスレイヤー風') {
      tweet.getElementsByClassName('tweet-text')[0].textContent = 'アバーッ！';
      tweet.getElementsByClassName('fullname')[0].textContent   = 'Koebuta Slayer';
      tweet.getElementsByClassName('username')[0].innerHTML     = '@<b>koebutaslayer</b>';
      tweet.getElementsByClassName('js-action-profile-avatar')[0]
        .setAttribute('src', 'https://pbs.twimg.com/profile_images/876001170409439232/pHHfBGu3_400x400.jpg');
      const media = tweet.getElementsByClassName('AdaptiveMediaOuterContainer')[0];
      if(media)
        media.remove();
    }
    processedTweetList.set(tweet, 1);
    slayCount++;
  }

  // DOMの更新が入るたびにボタンを追加
  (() => {
    let DOMObserverTimer = false;
    const DOMObserverConfig = {
      attributes: true,
      childList: true,
      subtree: true
    };
    const DOMObserver = new MutationObserver(() => {
      if (DOMObserverTimer !== 'false') {
        clearTimeout(DOMObserverTimer);
      }
      DOMObserverTimer = setTimeout(() => {
        DOMObserver.disconnect();
        addSlayer();
        DOMObserver.observe(document.body, DOMObserverConfig);
      }, 100);
    });
    DOMObserver.observe(document.body, DOMObserverConfig);
  })();

  // 初回起動
  addSlayer();

})();