// ==UserScript==
// @name        AbemaTV Timetable Viewer
// @namespace   knoa.jp
// @description AbemaTV に見やすい横型の番組表と、気軽に登録できる通知機能を提供します。
// @include     https://abema.tv/*
// @version     2.4.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/37720/AbemaTV%20Timetable%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/37720/AbemaTV%20Timetable%20Viewer.meta.js
// ==/UserScript==

// console.log('AbemaTV? => hireMe()');
(function(){
  const SCRIPTNAME = 'TimetableViewer';
  const DEBUG = false;/*
[update] 2.4.2
公式仕様の変更に伴って放送中の裏番組一覧が開かなくなっていた不具合を修正。

[bug]
markで絞り込んだ状態で「ビデオをもっと検索する」などで結果を増やすと件数が。
たまに文字のストレッチが効かないのはディレイタイム不足かな
視聴中に登場した将棋LIVEチャンネルに上下キーで飛べなかった

[to do]
video要素だけ消えるバグがあるのでmain消失チェックの部分を作り替える
スクリプト紹介用の画像更新？

[to research]

[possible]
マイビデオの公式ゴミ箱アイコンからの削除即時連動に対応(my/list限定？)
裏番組一覧modify時の時間枠アニメーション
番組提案
  各チャンネルの[生][新]への導線を用意してあげたい
  公式ランキングページ・注目のキーワードは活用可能か
スマホUI/アプリ提案？(番組表・通知)
  通知はもちろんネイティブだよな!!
  (別アプリでコメントビューア)

[requests]
画質変更・・・このスクリプトでやることではない気もする(ブラウザのzoomに頼らずscaleでやれる？)

[not to do]
Edge: element.animate ポリフィル
Safari: IntersectionObserverは12.1で対応されるので気長に待つ
一度検索通知に引っかかった番組が情報更新で該当しなくなっても、そのまま居残り続けてしまう問題
番組情報もフォントサイズ対応(アベマのナビゲーションとの整合性が取りにくい)
見逃し番組で2枚目以降のサムネ画像を追加APIアクセスで取得する手はあるが保留

[common]
windowイベントリスナの統一化(userActions = {'click': [...function]})
xhr => fetch
  */
  if(window === top && console.time) console.time(SCRIPTNAME);
  const ID = Math.random().toString(36).substr(2,10);/*スクリプト実行ごとのID([0-9a-z]{10})*/
  const UPDATECHANNELS = false;/*デバッグ用*/
  const CONFIGS = {
    /* 番組表パネル */
    transparency: {TYPE: 'int',    DEFAULT: 25},/*透明度(%)*/
    height:       {TYPE: 'int',    DEFAULT: 50},/*番組表の高さ(%)(文字サイズ連動)*/
    span:         {TYPE: 'int',    DEFAULT:  4},/*番組表の時間幅(時間)*/
    replace:      {TYPE: 'bool',   DEFAULT: 1 },/*アベマ公式の番組表を置き換える*/
    /* 通知(abema.tvを開いているときのみ) */
    n_before:     {TYPE: 'int',    DEFAULT: 10},/*番組開始何秒前に通知するか(秒)*/
    n_change:     {TYPE: 'bool',   DEFAULT: 1 },/*自動でチャンネルも切り替える*/
    n_overlap:    {TYPE: 'bool',   DEFAULT: 1 },/*　時間帯が重なっている時は通知のみ*/
    n_sync:       {TYPE: 'bool',   DEFAULT: 1 },/*アベマ公式の通知と共有する*/
    /* 表示チャンネル */
    c_visibles:   {TYPE: 'object', DEFAULT: {}},/*(チャンネル名)*/
  };
  const PIXELRATIO = window.devicePixelRatio;/*Retina比*/
  const SECOND = 1;/*秒(s)*/
  const MINUTE = 60*SECOND;/*分(s)*/
  const HOUR = 60*MINUTE;/*時間(s)*/
  const DAY = 24*HOUR;/*日(s)*/
  const JST = 9*HOUR;/*JST時差(s)*/
  const JDAYS = ['日', '月', '火', '水', '木', '金', '土'];/*曜日*/
  const EDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];/*曜日(class)*/
  const TERM = 7 + 1;/*番組スケジュールの取得期間(日)*/
  const TERMLABEL = '1週間';/*TERMのユーザー向け表現*/
  const CACHEEXPIRE = 3*HOUR*1000;/*番組スケジュールのキャッシュ期間(ms)*/
  const LOGOINDICATE = 2*SECOND*1000;/*チャンネルロゴの表示時間(ms)*/
  const BOUNCINGPIXEL = 1;/*バウンシングエフェクト用ピクセル*/
  const TIMES = [0,3,6,9,12,15,18,21];/*番組表のスクロール位置(時)*/
  const NAMEWIDTH = 7.5;/*番組表のチャンネル名幅(vw)*/
  const MAXRESULTS = 100;/*番組取得の最大数*/
  const REMOTERESULTS = 2;/*番組取得の初回数(アベマにクエリを投げる場合)*/
  const MOREREMOTERESULTS = 10;/*番組取得の追加数(アベマにクエリを投げる場合)*/
  const TIMETABLERESETTIME = 10*SECOND*1000;/*番組表パネルを閉じても状態を記憶しておく時間(ms)*/
  const NOTIFICATIONREMAINS = 10*SECOND*1000;/*番組開始後も通知を残しておく時間(ms)*/
  const NOTIFICATIONAFTER = 1*DAY;/*番組終了後にアベマを開いても見逃した事実を通知する期間(s)*/
  const ABEMATIMETABLEDURATION = 500;/*アベマ公式番組表を置き換えた際の遷移アニメーション時間(ms)*/
  const STALLEDLIMIT = [5, 15];/*映像が停止してから自動リロードするまでの確認回数[最短,最長](実質s)*/
  const EXPIRESTALLED = 1*MINUTE*1000;/*停止疑惑を持ち続ける時間(ms)*/
  const PROGRESS = .75;/*1秒の間に最低限進んでいなければならない映像秒数(s)*/
  const EASING = 'cubic-bezier(0,.75,.5,1)';/*主にナビゲーションのアニメーション用*/
  /* サイト定義 */
  const APIS = {
    CHANNELS:        'https://api.abema.io/v1/channels',/*全チャンネル取得API*/
    SCHEDULE:        'https://api.abema.io/v1/media?dateFrom={dateFrom}&dateTo={dateTo}',/*番組予定取得API*/
    RESERVATION:     'https://api.abema.io/v1/viewing/reservations/{type}/{id}',/*番組通知登録API*/
    RESERVATIONS:    'https://api.abema.io/v1/viewing/reservations/slots?limit={limit}',/*番組通知一覧取得API*/
    MYVIDEO:         'https://api.abema.io/v1/myvideo/{type}/{id}',/*マイビデオ登録API*/
    MYVIDEOS:        'https://api.abema.io/v1/myvideo?limit={limit}',/*マイビデオ(見逃し+ビデオ)一覧取得API*/
    RESERVATIONSLOT: 'https://api.abema.io/v1/viewing/reservations/slots/{id}',/*通知番組(放送予定)情報取得API*/
    MEDIASLOT:       'https://api.abema.io/v1/media/slots/{id}',/*見逃し番組(放送終了)情報取得API*/
    VIDEOPROGRAM:    'https://api.abema.io/v1/video/programs/{id}',/*ビデオ(アーカイブ)情報取得API*/
    SEARCHSLOTS:     'https://api.abema.io/v1/search/slots?q={q}&offset={offset}&limit={limit}&type=past',/*見逃し番組(放送終了)検索API*/
    SEARCHVIDEOS:    'https://api.abema.io/v1/search/video/programs?q={q}&offset={offset}&limit={limit}',/*ビデオ(アーカイブ)検索API*/
  };
  const WATCHTIMESHIFT = 'https://abema.tv/channels/{channelId}/slots/{id}';/*タイムシフト視聴ページ*/
  const WATCHVIDEO = 'https://abema.tv/video/episode/{id}';/*ビデオ視聴ページ*/
  const CHANNELLOGO = 'https://hayabusa.io/abema/channels/logo/{id}.w340.png';/*チャンネルロゴ*/
  const THUMBIMG = 'https://hayabusa.io/abema/programs/{displayProgramId}/{name}.q{q}.w{w}.h{h}.x{x}.jpg';/*番組サムネイル*/
  const PREMIUM = 'https://abema.tv/about/premium';/*Abemaプレミアム案内*/
  const CHANNELREPLACES = [/*チャンネル名置換*/
    [/^Abema/, ''],
    [/チャンネル/, ''],
    [/ by Discovery/, ''],
  ];
  const NOCONTENTS = [/*コンテンツなし番組タイトル*/
    '番組なし',/*存在しないけどNOCONTENTS[0]はスクリプト内で代替用のラベルとして使う*/
    /^番組告知$/,
    /^《告知》/,
    /^CM$/,
    /^CM 【[^】]+】$/,/*【煽り】付きCM(REPLACE後の文字列にマッチ)*/
    /^$/,/*空欄*/
  ];
  const REPLACES = [/*番組タイトル置換*/
    [/^([^【<\[\\]+(?:配信|放送|公開)中?!)\/?(.+)$/,  '$2 $1'],/*最後に回す(間に SPACE を挟む)*/
    [/^([^【<\[\\]+(?:配信|放送|公開)中?)\/(.+)$/,    '$2 $1'],/*最後に回す(間に SPACE を挟む)*/
    [/^([^【<\[\\]+(?:無料|観れる|見放題)!)\/?(.+)$/, '$2 $1'],/*最後に回す(間に SPACE を挟む)*/
    [/^([^【<\[\\]+(?:無料|観れる|見放題))\/(.+)$/,   '$2 $1'],/*最後に回す(間に SPACE を挟む)*/
    [/^(【.+?】)(.+)$/,              '$2 $1' ],/*【煽り】を最後に回す(間に HAIR SPACE を挟む)*/
    [/^(<.+?>)(.+)$/,                '$2 $1' ],/*<煽り>を最後に回す(間に SPACE を挟む)*/
    [/^(\\.+?\/)(.+)$/,              '$2 $1' ],/*\煽り/を最後に回す(間に SPACE を挟む)*/
    [/^([^/]+一挙)\/(.+)$/,          '$2 /$1'],/*...一挙/を最後に回す(間に SPACE を挟む)*/
    [/^(見逃し)\/(.+)$/,             '$2 /$1'],/*見逃し/を最後に回す(間に SPACE を挟む)*/
    [/^((?:今|本日|今日|きょう|明日|あす|(?:毎週)?[日月火水木金土]曜)(?:朝|あさ|昼|ひる|夕方?|深?夜|よる)?[0-9:時分]+?)〜\/?(.+)$/, '$2 〜$1'],/*今夜...時〜を最後に回す(間に 〜 を挟む)*/
    [/^((?:TV|テレビ)?アニメ)\s?(?:「|『)(.+?)(?:」|』)(.*)$/, '$2$3 $1'],/*TVアニメを最後に回しカッコを取り除く(間に SPACE を挟む)*/
    [/^(.+主演)\s?(?:「|『)(.+?)(?:」|』)(.*)$/,               '$2$3 $1'],/*...主演を最後に回しカッコを取り除く(間に SPACE を挟む)*/
    [/♯([0-9]+)/g, '#$1'],/*シャープをナンバーに統一*/
    [/([^ ])((?:\(|\[|<)?#[0-9]+)/g, '$1 $2'],/*直前にスペースがないナンバリングを補完*/
    [/([^ ])(\(|\[|<)/g, '$1 $2'],/*直前にスペースがないカッコ開始を補完*/
  ];
  const SEPARATOR = /([\s/!?♡☆…〜]+)/g;/*煽りとタイトルの区切りになりうる文字*/
  const NAMEFRAGS = {/*キャストとスタッフの名前の正規化用*/
    NONAMES: new RegExp([
      '^(?:-|ー|未定|なし|coming ?soon)$', /*なし*/
      '^(?:【|《|〈|<|〔|［|ー|-)[^:]+$',  /*【見出し】*/
      '^(?:■|◆|●|▶|▼|◼︎)[^:]+$',      /*■見出し*/
      ':.+:', /*コロンを複数含む複数人のベタテキストは判定不能*/
    ].join('|'), 'i'),
    SKIPS: new RegExp([
      '^(?:[^(:]+|[^:]+\\)[^:]*):', /*最初のコロンまでは役職名(カッコ内は無視)*/
      '\\([^)]+\\)(?:・|、|\\/)?',   /*(カッコ)内とそれに続く区切り文字は無視*/
      '\\[[^\\]]+\\](?:・|、|\\/)?', /*[カッコ]内とそれに続く区切り文字は無視*/
      '\\s*(?:…+|その)?(?:ほか|他)(?:多数)?$', /*ほか*/
      '\\s*(?:etc\.?|(?:and|&|＆) ?more)$',     /*ほか*/
      '※.+$',
      '順不同',
    ].join('|'), 'i'),
    SEPARATORS: new RegExp([
      '、',  /*名前、名前*/
      '\\/', /*名前/名前*/
    ].join('|')),
  };
  const PADDINGBEFORE = 50*MINUTE;/*休止チャンネルが再開する前に事前映像が流れ始める時間(s)*/
  let retry = 10;/*必要な要素が見つからずあきらめるまでの試行回数*/
  let site = {
    targets: [
      function screen(){let videoContainer = $('.com-a-Video__container'); return (videoContainer) ? site.use(videoContainer.parentNode.parentNode.parentNode) : false;},
      function channelButton(){let button = $('button[aria-label="放送中の裏番組"]'); return (button) ? site.use(button) : false;},
      function channelUpButton(){let button = $('button[aria-label="前のチャンネルに切り替える"]'); return (button) ? site.use(button) : false;},
      function channelDownButton(){let button = $('button[aria-label="次のチャンネルに切り替える"]'); return (button) ? site.use(button) : false;},
      function channelPane(){let container = $('[class*="-tv-VChannelList__container"]'); return (container) ? site.use(container.parentNode) : false;},
      function progressbar(){let progressbar = $('#main [role="progressbar"]'); return (progressbar) ? site.use(progressbar.parentNode) : false;},
    ],
    get: {
      onairChannels: function(channelPane){return channelPane.querySelectorAll('a[href^="/now-on-air/"]');},
      onairChannel: function(channelPane, id){return channelPane.querySelector(`a[href="/now-on-air/${id}"]`);},
      thumbnail: function(channelPane){return channelPane.querySelector('a[data-hidden="false"] > div > div:nth-child(1) > div > div:nth-child(1) > img');},
      channelLogo: function(a){return a.querySelector('a > div > div:nth-child(1) > div > img');},
      nowonairSlot: function(a){return a.querySelector('a > div > div:nth-child(2)');},
      title: function(slot){return slot.querySelector('div:nth-child(1) > span > span:last-of-type');},
      duration: function(slot){return slot.querySelector('div:nth-child(2) > span');},
      timetableLinkOnNOA: function(){return $('[class*="__timetable-link"]');},
      token: function(){return localStorage.getItem('abm_token');},
      splash: function(){return $('#splash')},
      closer: function(){
        /* チャンネル切り替えごとに差し替わるのでつど取得 */
        let button = $('[data-selector="screen"] > div > div > button');
        return button ? button : log(`Not found: closer`);
      },
      abemaTimetableButton: function(){
        let a = $('header a[href="/timetable"]');
        return (a) ? site.use(a, 'abemaTimetableButton') : null;
      },
      abemaTimetableSlotButton: function(channelId, programId){
        /* アベマの仕様に依存しまくり */
        let index = Array.from($$('div > a[href^="/timetable/channels/"]')).findIndex((a) => a.href.endsWith('/' + channelId));
        if(index === -1) return log(`Not found: "${channelId}" anchor.`);
        let buttons = $$(`div:nth-child(${index + 1}) > div > article > button`);/*index該当チャンネルに絞って効率化*/
        if(buttons.length === 0) return log(`Not found: "${channelId}" buttons.`);
        if(DAY/2 < MinuteStamp.past()) buttons = Array.from(buttons).reverse();/*正午を過ぎていたら逆順に探す*/
        for(let i = 0, button; button = buttons[i]; i++){
          let div = button.parentNode.parentNode;
          if(Object.keys(div).some((key) => key.includes('reactInternalInstance') && (div[key].key === programId))) return button;
        }
        return log(`Not found: "${programId}" button.`);
      },
      abemaTimetableNowOnAirLink: function(channelId){
        let a = $(`a[href="/now-on-air/${channelId}"]`);
        return (a) ? a : log(`Not found: "${channelId}" link.`);
      },
      abemaNotifyButton: function(target){
        switch(true){
          case(target.classList.contains('notify')):
            return false;
          /* 番組詳細画面 */
          case(target.attributes['aria-label'] && target.attributes['aria-label'].value === '通知を受け取る'):
          /* textContentでしか判定できない */
          case(target.textContent === 'この番組の通知を受け取る'):/*放送視聴中のボタン*/
          case(target.textContent === '通知を受け取る'):
          case(target.textContent === '今回のみ通知を受け取る'):
          case(target.textContent === '今回のみ'):
          case(target.textContent === '毎回通知を受け取る'):
          case(target.textContent === '毎回'):
          case(target.textContent === '解除する'):/*マイビデオの可能性もあるが仕方ない*/
            return true;
          default:
            return false;
        }
      },
      abemaMyVideoButton: function(target){
        switch(true){
          case(target.classList.contains('myvideo')):
            return false;
          /* 番組表の埋め込みボタンのあやうい判定 */
          case(target.attributes['role'] && target.attributes['role'].value === 'checkbox'):
          /* 番組詳細・見逃し・ビデオ視聴画面 */
          case(target.attributes['aria-label'] && target.attributes['aria-label'].value === 'マイビデオ'):
          /* textContentでしか判定できない */
          case(target.textContent === 'マイビデオに追加'):
          case(target.textContent === '解除する'):/*通知の可能性もあるが仕方ない*/
            return true;
          default:
            return false;
        }
      },
      subscriptionType: function(){
        /* アベマの仕様に依存しまくり */
        if(!window.dataLayer) return log('Not found: window.dataLayer');
        for(let i = 0; window.dataLayer[i]; i++){
          if(window.dataLayer[i].subscriptionType) return window.dataLayer[i].subscriptionType;/* 'freeUser' || 'trialUser' || 'subscriber' */
        }
        //return log('Not found: subscriptionType');/*ページ読み込み直後は取得できない*/
      },
      screenCommentScroller: function(){return html.classList.contains('ScreenCommentScroller')},
      apis: {
        channels: function(){return APIS.CHANNELS},
        timetable: function(){
          let toDigits = (date) => date.toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/[^0-9]/g, '');
          let from = new Date(), to = new Date(from.getTime() + TERM*DAY*1000);
          return APIS.SCHEDULE.replace('{dateFrom}', toDigits(from)).replace('{dateTo}', toDigits(to));
        },
        reservation: function(id, type){
          const types = {repeat: 'slotGroups', once: 'slots'};
          return APIS.RESERVATION.replace('{type}', types[type]).replace('{id}', id);
        },
        reservations: function(){return APIS.RESERVATIONS.replace('{limit}', MAXRESULTS)},
        myvideo: function(id, type){return APIS.MYVIDEO.replace('{id}', id).replace('{type}', type)},
        myvideos: function(){return APIS.MYVIDEOS.replace('{limit}', MAXRESULTS)},
        reservationSlot: function(id){return APIS.RESERVATIONSLOT.replace('{id}', id)},
        mediaSlot: function(id){return APIS.MEDIASLOT.replace('{id}', id)},
        videoProgram: function(id){return APIS.VIDEOPROGRAM.replace('{id}', id)},
        searchSlots: function(q, page = 0){
          return APIS.SEARCHSLOTS
            .replace('{q}', encodeURIComponent(q))
            .replace('{offset}', page ? REMOTERESULTS + (page - 1)*MOREREMOTERESULTS : 0)
            .replace('{limit}', page ? MOREREMOTERESULTS : REMOTERESULTS);
        },
        searchVideos: function(q, page = 0){
          return APIS.SEARCHVIDEOS
            .replace('{q}', encodeURIComponent(q))
            .replace('{offset}', page ? REMOTERESULTS + (page - 1)*MOREREMOTERESULTS : 0)
            .replace('{limit}', page ? MOREREMOTERESULTS : REMOTERESULTS);
        },
      },
    },
    use: function use(target = null, key = use.caller.name){
      if(target) target.dataset.selector = key;
      elements[key] = target;
      return target;
    },
    marks: ['live', 'newcomer', 'first', 'last', 'bingeWatching', 'recommendation', 'none'],
    markLabels: {live: '[生]', newcomer: '[新]', first: '[初]', last: '[終]', bingeWatching: '[一挙]', recommendation: '[注目]', none: ''},
  };
  class Channel{
    constructor(channel = {}){
      Object.keys(channel).forEach((key) => {
        switch(key){
          case('programs'): return this.programs = channel.programs.map((program) => new Program(program));
          default: return this[key] = channel[key];
        }
      });
    }
    fromChannelSlots(channel, slots){
      this.id = channel.id;
      this.name = channel.name;
      CHANNELREPLACES.forEach(r => {this.name = this.name.replace(r[0], r[1])});
      this.fullName = channel.name;
      this.order = channel.order;
      this.programs = slots.map((slot) => new Program().fromSlot(slot, {id: this.id, name: this.fullName}));
      /* 空き時間を埋める */
      let now = MinuteStamp.now(), justToday = MinuteStamp.justToday(), createPadding = (id, startAt, endAt) => new Program({
        id: id,
        title: NOCONTENTS[0],
        padding: true,
        noContent: true,
        channel: {id: this.id, name: this.fullName},
        startAt: startAt,
        endAt: endAt,
      });
      if(now < this.programs[0].startAt) this.programs.unshift(createPadding(channel.id + '-' + now, now, this.programs[0].startAt));
      for(let i = 0; this.programs[i]; i++){
        if(this.programs[i + 1] && this.programs[i].endAt !== this.programs[i + 1].startAt){
          this.programs.splice(i + 1, 0, createPadding(channel.id + '-' + this.programs[i].endAt, this.programs[i].endAt, this.programs[i + 1].startAt));
        }else if(!this.programs[i + 1] && this.programs[i].endAt < justToday + (TERM+1)*DAY){
          this.programs.push(createPadding(channel.id + '-' + this.programs[i].endAt, this.programs[i].endAt, justToday + (TERM+1)*DAY));
          break;/*抜けないと無限ループになる*/
        }
      }
      return this;
    }
  }
  class Program{
    constructor(program = {}){
      Object.keys(program).forEach((key) => {
        this[key] = program[key];
      });
    }
    fromSlot(slot, channel){
      /* 放送終了済みの見逃し視聴番組をアベマ(APIS.MYVIDEOS)から取得した場合は slot.programs がないので、コードが汚くなるのをここで回避する */
      /* (別リクエストを投げれば確実な詳細を取得できるが、ローカルになくアベマから取得するのはレアケースなので影響は少ない) */
      slot.programs = slot.programs || [{
          series: {id: null},
          providedInfo: {thumbImg: 'thumb001', sceneThumbImgs: []},
          credit: {casts: [], crews: [], copyrights: []},
      }];
      /* ID */
      this.id = slot.id;
      this.displayProgramId = slot.displayProgramId;
      this.series = (slot.programs[0].series) ? slot.programs[0].series.id : slot.programs[0].seriesId;
      //this.sequence = slot.programs[0].episode.sequence;/*次回*/
      this.slotGroup = slot.slotGroup;/*{id(毎回通知用), lastSlotId, fixed, name(毎回通知タイトルに近いが使えない)}*/
      this.groupId = slot.groupId;/*id(毎回通知用)*/
      /* 概要 */
      /* {live(生), newcomer(新), first(初), last(終), bingeWatching(一挙), recommendation(注目), drm(マークなし)} からマークなしを取り除く */
      Object.keys(slot.mark).forEach((key) => {
        if(core.html.marks[key] === undefined){
          delete slot.mark[key];
          if(DEBUG && key !== 'drm') log('Unknown mark:', key);
        }
      });
      this.marks = slot.mark || {};
      this.title = Program.modifyTitle(normalize(slot.title));
      this.links = slot.links;/*[{title, type(2のみ), value(url)}]*/
      this.flags = slot.flags;/*{archiveComment, chasePlay, share, sharingPolicy, timeshift,timeshiftFree}*/
      //this.highlight = slot.highlight;/*短い*/
      this.detailHighlight = slot.detailHighlight/*長い*/ || slot.highlight/*短い*/;
      this.content = slot.content;/*詳細*/
      this.padding = false;/*空き時間の枠埋めではない*/
      this.noContent = this.hasNoContent(this.title);
      this.channel = channel;/*{id, name}*/
      /* サムネイル */
      this.thumbImg = slot.programs[0].providedInfo.thumbImg;
      this.sceneThumbImgs = slot.programs[0].providedInfo.sceneThumbImgs || [];
      /* クレジット */
      this.casts = (slot.programs[0].credit.casts || []).map(normalize);
      this.crews = (slot.programs[0].credit.crews || []).map(normalize);
      this.copyrights = slot.programs[0].credit.copyrights;
      /* 時間 */
      this.startAt = slot.startAt;
      this.endAt = slot.endAt;
      this.timeshiftEndAt = slot.timeshiftEndAt;
      this.timeshiftFreeEndAt = slot.timeshiftFreeEndAt;
      /* シェア */
      //this.hashtag = slot.hashtag;
      //this.sharedLink = slot.sharedLink;
      return this;
    }
    static modifyTitle(title){
      for(let i = 0, replace; replace = REPLACES[i]; i++){
        title = title.replace(replace[0], replace[1]);
      }
      return title;
    }
    static appendMarks(title, marks){
      const latters = ['last'];/*タイトルの後に付くマーク*/
      if(marks) Object.keys(marks).forEach((mark) => {
        if(!core.html.marks[mark]) return;/*htmlが用意されていない*/
        if(latters.includes(mark)) return title.parentNode.appendChild(createElement(core.html.marks[mark]()));
        return title.parentNode.insertBefore(createElement(core.html.marks[mark]()), title);
      });
    }
    static getRepeatTitle(a, b){
      let getCommon = (a, b) => {
        /* (ホントは戻り読みしたいがjsに実装されていないのでヌル文字(\0)を使って工夫する) */
        for(let i = 0, parts = a.replace(SEPARATOR, '$1\0').split('\0'), common = ''; parts[i]; i++){
          if(b.includes(parts[i].trim())) common += parts[i];
          else if(common) return common;/*共通部分が途切れたら終了*/
        }
        return b;/*共通部分がなければ後続を優先する*/
      }
      return [getCommon(a, b), getCommon(b, a)].sort((a, b) => a.length - b.length)[0].trim();
    }
    static linkifyNames(node, click){
      if(node.textContent.match(NAMEFRAGS.NONAMES) !== null) return;
      for(let i = 0, n; n = node.childNodes[i]; i++){/*回しながらchildNodesは増えていく*/
        if(n.data === '') continue;
        let pos = n.data.search(NAMEFRAGS.SKIPS);
        switch(true){
          case(pos === -1):
            if(split(n)) i++;/*セパレータの分を1つ飛ばす*/
            append(n);
            break;
          case(pos === 0):
            n.splitText(RegExp.lastMatch.length);
            break;
          case(0 < pos):
            n.splitText(pos);/*nをpos直前で分割*/
            if(split(n)) i++;/*セパレータの分を1つ飛ばす*/
            append(n);
            break;
        }
      }
      function split(n){
        let pos = n.data.search(NAMEFRAGS.SEPARATORS);
        if(1 <= pos){
          n.splitText(pos);
          n.nextSibling.splitText(RegExp.lastMatch.length);
          return true;
        }
      }
      function append(n){
        n.data = n.data.trim();
        if(n.data === '') return;
        let span = document.createElement('span');
        span.className = 'name';
        node.insertBefore(span, n.nextSibling);
        span.appendChild(n);
        span.addEventListener('click', click);
      }
    }
    get titleWithMarks(){
      let marks = '';
      Object.keys(this.marks).forEach((key) => {
        marks += site.markLabels[key];
      });
      return marks + this.title;
    }
    get group(){
      return (this.slotGroup) ? this.slotGroup.id : this.groupId || undefined;
    }
    get repeat(){
      return this.group;
    }
    get once(){
      return this.id;
    }
    get duration(){
      return this.endAt - this.startAt;
    }
    get dateString(){
      let long = {month: 'short', day: 'numeric', weekday: 'short', hour: 'numeric', minute: '2-digit'}, short = {hour: 'numeric', minute: '2-digit'};
      let start = new Date(this.startAt*1000), end = new Date(this.endAt*1000);
      let startString = start.toLocaleString('ja-JP', long);
      let endString = end.toLocaleString('ja-JP', (start.getDate() === end.getDate()) ? short : long);
      return `${startString} 〜 ${endString}`;
    }
    get justifiedDateString(){
      return this.justifiedDateToString(this.startAt) + ' 〜 ' + this.justifiedTimeToString(this.endAt);
    }
    get justifiedStartAtShortDateString(){
      return this.justifiedShortDateToString(this.startAt);
    }
    get startAtString(){
      return this.timeToString(this.startAt);
    }
    get endAtString(){
      return this.timeToString(this.endAt);
    }
    get timeString(){
      return this.startAtString + ' 〜 ' + this.endAtString;
    }
    get timeshiftString(){
      let today = MinuteStamp.justToday(), isPremium = MyVideo.isPremiumUser(), endAt = isPremium ? this.timeshiftEndAt : this.timeshiftFreeEndAt;
      if(!endAt) return '';/*見逃し視聴不可*/
      let remainDays = endAt - today, term = endAt - MinuteStamp.justToday(this.endAt);
      switch(true){
        case(remainDays < 0 || term < 0):
          return '';
        case(remainDays < DAY):
          return `きょうの ${this.timeToString(endAt)} まで見逃し視聴`;
        case(remainDays < DAY*2):
          return `あす ${this.dateToString(endAt)} の ${this.timeToString(endAt)} まで見逃し視聴`;
        case(term < DAY):
          return `放送当日 ${this.dateToString(endAt)} の ${this.timeToString(endAt)} まで見逃し視聴`;
        case(term < DAY*2):
          return `放送翌日 ${this.dateToString(endAt)} の ${this.timeToString(endAt)} まで見逃し視聴`;
        case(this.startAt <= MinuteStamp.now()):/*放送中なら「放送...日後」ではなく単に「...日後」とする*/
          return `${Math.floor(term/DAY)}日後の ${this.dateToString(endAt)} まで見逃し視聴`;
        default:
          return `放送${Math.floor(term/DAY)}日後の ${this.dateToString(endAt)} まで見逃し視聴`;
      }
    }
    get timeshiftRemainsHTML(){
      const watchableText = this.isVideo ? 'ビデオ視聴' : '見逃し視聴';
      let today = MinuteStamp.justToday(), now = MinuteStamp.now(), isPremium = MyVideo.isPremiumUser(), endAt = isPremium ? this.timeshiftEndAt : this.timeshiftFreeEndAt;
      let remain = endAt - now, floor = Math.floor;
      switch(true){
        case(!this.timeshiftEndAt):
          return '';/*見逃し視聴不可*/
        case(this.timeshiftEndAt < now):
          return '期限切れ';
        case(!isPremium && this.timeshiftFreeEndAt < now):
        case(!isPremium && !this.timeshiftFreeEndAt):
          return `期限切れ (<a href="${PREMIUM}">プレミアム</a>ならあと${floor((this.timeshiftEndAt - today) / DAY)}日)`;
      }
      switch(true){
        case(remain < HOUR):
          return `${floor(remain / MINUTE)}分後の ${this.timeToString(endAt)} まで${watchableText}`;
        case(remain < DAY):
          return `${floor(remain / HOUR)}時間後の ${this.timeToString(endAt)} まで${watchableText}`;
        default:
          return `${floor(remain / DAY)}日後の ${this.dateToString(endAt)} ${this.timeToString(endAt)} まで${watchableText}`;
      }
    }
    get hasExpired(){
      let now = MinuteStamp.now(), isPremium = MyVideo.isPremiumUser(), endAt = isPremium ? this.timeshiftEndAt : this.timeshiftFreeEndAt;
      switch(true){
        case(!this.timeshiftEndAt):
        case(this.timeshiftEndAt < now):
        case(!isPremium && this.timeshiftFreeEndAt < now):
        case(!isPremium && !this.timeshiftFreeEndAt):
          return true;
        default:
          return false;
      }
    }
    get type(){
      return this.isVideo ? 'program' : 'slot';
    }
    hasNoContent(title){
      return NOCONTENTS.some((frag) => title.match(frag));
    }
    dateToString(timestamp){
      return new Date(timestamp * 1000).toLocaleDateString('ja-JP', {month: 'short', day: 'numeric', weekday: 'short'});
    }
    timeToString(timestamp){
      return new Date(timestamp * 1000).toLocaleTimeString('ja-JP', {hour: 'numeric', minute: '2-digit'});
    }
    justifiedShortDateToString(timestamp){
      /* toLocaleString('ja-JP')の2-digitが効かないバグがあるので */
      let date = new Date(timestamp * 1000),  d = {
        date:    ('00' + date.getDate()).slice(-2),
        day:     JDAYS[date.getDay()],
        hours:   ('00' + date.getHours()).slice(-2),
        minutes: ('00' + date.getMinutes()).slice(-2),
      };
      return `${d.date}(${d.day}) ${d.hours}:${d.minutes}`;
    }
    justifiedDateToString(timestamp){
      /* toLocaleString('ja-JP')の2-digitが効かないバグがあるので */
      let date = new Date(timestamp * 1000),  d = {
        month:   date.getMonth() + 1,
        date:    ('00' + date.getDate()).slice(-2),
        day:     JDAYS[date.getDay()],
        hours:   ('00' + date.getHours()).slice(-2),
        minutes: ('00' + date.getMinutes()).slice(-2),
      };
      return `${d.month}月${d.date}日(${d.day}) ${d.hours}:${d.minutes}`;
    }
    justifiedTimeToString(timestamp){
      let date = new Date(timestamp * 1000),  d = {
        hours:   ('00' + date.getHours()).slice(-2),
        minutes: ('00' + date.getMinutes()).slice(-2),
      };
      return `${d.hours}:${d.minutes}`;
    }
  }
  class Video extends Program{
    constructor(program = {}){
      super(program);
      this.isVideo = true;
    }
    fromProgram(program){
      /* ID */
      this.id = program.id;
      this.displayProgramId = program.id;
      this.series = (program.series) ? program.series.id : undefined;
      this.groupId = null;
      /* 概要 */
      this.marks = {};
      this.title = Program.modifyTitle(normalize((program.series) ? `${program.series.title} ${program.episode.title}` : program.episode.title));
      this.links = [];
      //this.highlight = slot.highlight;/*短い*/
      this.detailHighlight = program.series.title;/*代用*/
      this.content = program.episode.content;/*詳細*/
      this.padding = false;/*空き時間の枠埋めではない*/
      this.noContent = false;
      this.channel = {};
      /* サムネイル */
      this.thumbImg = program.providedInfo.thumbImg;
      this.sceneThumbImgs = program.providedInfo.sceneThumbImgs || [];
      /* クレジット */
      this.casts = (program.credit.casts || []).map(normalize);
      this.crews = (program.credit.crews || []).map(normalize);
      this.copyrights = program.credit.copyrights;
      /* 時間 */
      this.startAt = null;
      this.endAt = null;
      this.timeshiftEndAt = program.endAt;
      this.timeshiftFreeEndAt = program.freeEndAt;
      this.videoDuration = program.info.duration;/*プロパティ名の重複を避ける*/
      return this;
    }
    get duration(){
      return this.videoDuration;/*プロパティ名の重複を避けた*/
    }
    get dateString(){
      let duration = this.duration, floor = Math.floor;
      switch(true){
        case(duration < HOUR): return `${floor(duration / MINUTE)}分`;
        default: return `${floor(duration / HOUR)}時間${floor((duration % HOUR) / MINUTE)}分`;
      }
    }
  }
  class Thumbnail{
    constructor(displayProgramId, name, size = 'small'){
      const x = (sizes.window.innerWidth * PIXELRATIO < 960) ? 1 : 2;
      const abemaSizes = {/*解像度確保のためx2を指定させていただく*/
        large: {q: 95, w: 256, h: 144, x: x},
        small: {q: 95, w: 135, h:  76, x: x},
      };
      this.displayProgramId = displayProgramId;
      this.name = name;
      this.params = abemaSizes[size];
    }
    get node(){
      let img = document.createElement('img');
      img.classList.add('loading');
      img.addEventListener('load', function(e){
        img.classList.remove('loading');
      });
      img.src = THUMBIMG.replace(
        '{displayProgramId}', this.displayProgramId
      ).replace(
        '{name}', this.name
      ).replace(
        '{q}', this.params.q
      ).replace(
        '{w}', this.params.w
      ).replace(
        '{h}', this.params.h
      ).replace(
        '{x}', this.params.x
      );
      return img;
    }
  }
  class MinuteStamp{
    static now(){
      let now = new Date(), minutes = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
      return minutes.getTime() / 1000;
    }
    static past(){
      let now = new Date(), minutes = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
      return ((minutes.getTime() / 1000) + JST) % DAY;
    }
    static justToday(timestamp){
      let now = timestamp ? new Date(timestamp*1000) : new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return today.getTime() / 1000;
    }
    static timeToString(timestamp){
      return new Date(timestamp * 1000).toLocaleTimeString('ja-JP', {hour: 'numeric', minute: '2-digit'});
    }
    static timeToClock(timestamp){
      let time = new Date(timestamp * 1000);
      elements.clock = createElement(core.html.clock(time.getHours(), ('00' + time.getMinutes()).slice(-2)));
      /* 時計アニメーションの停止(Firefox<57のCPU負荷バグ回避) */
      let observer = new IntersectionObserver(function(entries){
        if(entries[entries.length - 1].isIntersecting/*Chromeは[1],Firefoxは[0]になる*/) elements.clock.classList.remove('pause');
        else elements.clock.classList.add('pause');/*時計が隠れているときは止める*/
      }, {root: elements.channelsUl});
      observer.observe(elements.clock);
      return elements.clock;
    }
    static shortestDateToString(timestamp){
      let d = new Date(timestamp * 1000);
      return `${d.getDate()}${JDAYS[d.getDay()]}`;
    }
  }
  class Button{
    static getOnceButtons(id){
      return document.querySelectorAll(`button.notify[data-once="${id}"]`);
    }
    static getRepeatButtons(id){
      return document.querySelectorAll(`button.notify[data-once][data-repeat="${id}"]`);
    }
    static getVideoButtons(id){
      return document.querySelectorAll(`button.myvideo[data-id="${id}"]`);
    }
    static getButtonTitle(button){
      if(button.classList.contains('active')) return button.dataset.titleActive;
      if(button.classList.contains('search')) return button.dataset.titleSearch;
      if(button.classList.contains('repeat')) return button.dataset.titleRepeat;
      if(button.classList.contains('once')) return button.dataset.titleOnce;
      return button.dataset.titleDefault;
    }
    static addActive(button){
      Button.reverse(button, 'add', 'active');
    }
    static removeActive(button){
      Button.reverse(button, 'remove', 'active');
    }
    static addOnce(id){
      Button.getOnceButtons(id).forEach((b) => Button.reverse(b, 'add', 'once'));
      Slot.getOnceSlots(id).forEach((s) => Slot.highlight(s, 'add', 'active'));
    }
    static removeOnce(id){
      Button.getOnceButtons(id).forEach((b) => Button.reverse(b, 'remove', 'once'));
      Slot.getOnceSlots(id).forEach((s) => {if(!Notifier.match(s.dataset.once)) Slot.highlight(s, 'remove', 'active')});
    }
    static addRepeat(id){
      Button.getRepeatButtons(id).forEach((b) => Button.reverse(b, 'add', 'repeat'));
      Slot.getRepeatSlots(id).forEach((s) => Slot.highlight(s, 'add', 'active'));
    }
    static removeRepeat(id){
      Button.getRepeatButtons(id).forEach((b) => Button.reverse(b, 'remove', 'repeat'));
      Slot.getRepeatSlots(id).forEach((s) => {if(!Notifier.match(s.dataset.once)) Slot.highlight(s, 'remove', 'active')});
    }
    static addSearch(id){
      Button.getOnceButtons(id).forEach((b) => Button.reverse(b, 'add', 'search'));
      Slot.getOnceSlots(id).forEach((s) => Slot.highlight(s, 'add', 'active'));
    }
    static removeSearch(id){
      Button.getOnceButtons(id).forEach((b) => Button.reverse(b, 'remove', 'search'));
      Slot.getOnceSlots(id).forEach((s) => {if(!Notifier.match(s.dataset.once)) Slot.highlight(s, 'remove', 'active')});
    }
    static addVideo(id){
      Button.getVideoButtons(id).forEach((b) => Button.reverse(b, 'add', 'active'));
    }
    static removeVideo(id){
      Button.getVideoButtons(id).forEach((b) => Button.reverse(b, 'remove', 'active'));
    }
    static reverse(button, action, name){
      button.classList.add('reversing');
      button.addEventListener('transitionend', function(e){
        button.classList[action](name);
        button.classList.remove('reversing');
        button.title = Button.getButtonTitle(button);
      }, {once: true});
    }
    static shake(button){
      button.animate([
        {transform: 'translateX(-10%)'},
        {transform: 'translateX(+10%)'},
      ], {
        duration: 50,
        iterations: 5,
      });
    }
    static pop(button){
      button.animate([/*放物線*/
        {transform: 'translateY( +7%)'},
        {transform: 'translateY( +6%)'},
        {transform: 'translateY( +4%)'},
        {transform: 'translateY(  0%)'},
        {transform: 'translateY(-32%)'},
        {transform: 'translateY(-48%)'},
        {transform: 'translateY(-56%)'},
        {transform: 'translateY(-60%)'},
        {transform: 'translateY(-62%)'},
        {transform: 'translateY(-63%)'},
        {transform: 'translateY(-63%)'},
        {transform: 'translateY(-62%)'},
        {transform: 'translateY(-60%)'},
        {transform: 'translateY(-56%)'},
        {transform: 'translateY(-48%)'},
        {transform: 'translateY(-32%)'},
        {transform: 'translateY(  0%)'},
        {transform: 'translateY(-16%)'},
        {transform: 'translateY(-24%)'},
        {transform: 'translateY(-28%)'},
        {transform: 'translateY(-30%)'},
        {transform: 'translateY(-31%)'},
        {transform: 'translateY(-31%)'},
        {transform: 'translateY(-30%)'},
        {transform: 'translateY(-28%)'},
        {transform: 'translateY(-24%)'},
        {transform: 'translateY(-16%)'},
        {transform: 'translateY(  0%)'},
        {transform: 'translateY( +3%)'},
        {transform: 'translateY( +2%)'},
        {transform: 'translateY(  0%)'},
      ], {
        duration: 750,
      });
    }
  }
  class Slot{
    static getOnceSlots(id){
      return document.querySelectorAll(`.slot[data-once="${id}"]`);
    }
    static getRepeatSlots(id){
      return document.querySelectorAll(`.slot[data-repeat="${id}"]`);
    }
    static highlight(slot, action, name){
      slot.classList.add('transition');
      animate(function(){
        slot.classList[action](name);
        slot.addEventListener('transitionend', function(e){
          slot.classList.remove('transition');
        }, {once: true});
      });
    }
  }
  class Notifier{
    static sync(){
      if(!configs.n_sync) return;
      let add = (type, id) => {
        let updateLocal = (type, program) => {
          switch(type){
            case('once'):
              notifications['once'][program.once] = Program.modifyTitle(normalize(program.title));
              Notifier.updateOnceProgram(program);
              break;
            case('repeat'):
              notifications['repeat'][program.repeat] = Program.modifyTitle(normalize(program.title));
              Notifier.addRepeatPrograms(program);
              break;
          }
          Notifier.save();
        };
        let program = core.getProgramById(id);
        if(program) return updateLocal(type, program);
        /* 臨時チャンネル番組やずっと先の番組などでローカルにprogramが見つからないときはアベマに問い合わせる */
        /* (最初からprogramデータ付きで取得するAPIオプション(&withDataSet=true)もあるけど無駄が多いので採用しない) */
        let xhr = new XMLHttpRequest();
        xhr.open('GET', site.get.apis.reservationSlot(id));
        xhr.setRequestHeader('Authorization', 'bearer ' + site.get.token());
        xhr.responseType = 'json';
        xhr.onreadystatechange = function(){
          if(xhr.readyState !== 4 || xhr.status !== 200) return;
          if(!xhr.response.dataSet || !xhr.response.dataSet.slots) return log(`Not found: reservation data ${type} "${id}"`);
          log('xhr.response:', xhr.response);
          let slot = xhr.response.dataSet.slots[0], channel = xhr.response.dataSet.channels[0];/*xhr.responseをそのまま使うとパフォーマンス悪い*/
          slot.programs = xhr.response.dataSet.programs;
          let program = new Program().fromSlot(slot, {id: channel.id, name: channel.name});
          updateLocal(type, program);
        };
        xhr.send();
      };
      /* こっからsync処理 */
      let xhr = new XMLHttpRequest();
      xhr.open('GET', site.get.apis.reservations());
      xhr.setRequestHeader('Authorization', 'bearer ' + site.get.token());
      xhr.responseType = 'json';
      xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4 || xhr.status !== 200) return;
        if(!xhr.response.slots) return log(`Not found: reservations data`);
        //log('xhr.response:', xhr.response);
        let slots = xhr.response.slots;/*xhr.responseをそのまま使うとパフォーマンス悪い*/
        /* あちらにしかないものはあちらで能動的に登録したとみなしてこちらにも登録 */
        for(let i = 0; slots[i]; i++){
          if(!slots[i].repetition && !Notifier.matchOnce(slots[i].slotId)){
            if(Notifier.match(slots[i].slotId)) continue;/*こちらでは検索通知として登録済み*/
            add('once', slots[i].slotId);
          }else if(slots[i].repetition && !Notifier.matchRepeat(slots[i].slotGroupId)){
            add('repeat', slots[i].slotId);
          }
        }
        /* こちらにしかないものはあちらで能動的に削除したとみなしてこちらでも削除 */
        let now = MinuteStamp.now();/*放送終了後 NOTIFICATIONAFTER までは残す*/
        Object.keys(notifications.once).forEach((key) => {
          if(slots.some((slot) => slot.slotId === key)) return;/*1回か毎回かは問わずあちらにもある*/
          let program = notifications.programs.find((p) => p.once === key);
          if(program && (now < program.endAt + NOTIFICATIONAFTER)) return;/*あちらにないけどまだ放送中または通知有効期間*/
          delete notifications.once[key];
        });
        Object.keys(notifications.repeat).forEach((key) => {
          if(slots.some((slot) => slot.slotGroupId === key)) return;/*あちらにもある*/
          let program = notifications.programs.find((p) => p.repeat === key);
          if(program && (now < program.endAt + NOTIFICATIONAFTER)) return;/*あちらにないけどまだ放送中または通知有効期間*/
          delete notifications.repeat[key];
        });
        notifications.programs = notifications.programs.filter((program) => {
          if(slots.some((slot) => slot.slotId === program.id)) return true;/*あちらにもある*/
          if(Notifier.matchSearch(program)) return true;/*検索通知として登録済み*/
          if(now < program.endAt + NOTIFICATIONAFTER) return true;/*まだ放送中または通知有効期間*/
        });
        Notifier.save();
      };
      xhr.send();
    }
    static addOnce(program){
      if(Notifier.matchOnce(program.once)) return;
      Notifier.add(program, 'once');
      Notifier.updateOnceProgram(program);
      Notifier.save();
    }
    static addRepeat(program){
      if(Notifier.matchRepeat(program.repeat)) return;
      Notifier.add(program, 'repeat');
      Notifier.addRepeatPrograms(program);
      Notifier.save();
    }
    static addRepeatPrograms(program){
      if(!program.repeat) return log('Not found: repeat key', program);
      /* 登録済みの確認や内容の更新を回避して処理を簡潔にするため、いったんクリアする */
      notifications.programs = notifications.programs.filter((p) => p.repeat !== program.repeat);
      /* channelsに含まれない臨時チャンネル・はるか未来の番組もあるので登録を済ませておく */
      notifications.programs.push(program);
      Notifier.updateRepeatTitle(program);
      /* channelsから該当する番組を「すべて」登録する */
      for(let c = 0, now = MinuteStamp.now(); channels[c]; c++){
        for(let p = 0, target; target = channels[c].programs[p]; p++){
          if(target.startAt < now) continue;/*放送中・終了した番組は新規登録しない*/
          if(!target.repeat || target.repeat !== program.repeat) continue;/*検証対象のidではない*/
          if(target.id === program.id) continue;/*さっき登録した*/
          notifications.programs.push(target);
          Notifier.updateRepeatTitle(target);
        }
      }
      notifications.programs.sort((a, b) => a.startAt - b.startAt);
    }
    static addSearch(key, marks){
      Notification.requestPermission();
      notifications.search[key] = marks;
      let matchIds = Notifier.updateSearchPrograms(key, marks);
      Notifier.save();
      return matchIds;/*通知ボタンくるりんぱ用*/
    }
    static add(program, type){
      Notification.requestPermission();
      notifications[type][program[type]] = program.title;
      if(configs.n_sync) Notifier.reserve(program[type], type);
    }
    static removeOnce(program){
      Notifier.remove(program, 'once');
      notifications.programs = notifications.programs.filter((p) => {
        if(Notifier.matchOnce(p.once)) return true;
        if(Notifier.matchRepeat(p.repeat)) return true;
        if(Notifier.matchSearch(p)) return true;
      });
      Notifier.save();
    }
    static removeRepeat(program){
      Notifier.remove(program, 'repeat');
      notifications.programs = notifications.programs.filter((p) => {
        if(Notifier.matchOnce(p.once)) return true;
        if(Notifier.matchRepeat(p.repeat)) return true;
        if(Notifier.matchSearch(p)) return true;
      });
      Notifier.save();
    }
    static removeSearch(key, marks){
      delete notifications.search[key];
      let unmatchIds = [];
      notifications.programs = notifications.programs.filter((p) => {
        if(Notifier.matchSearch(p)) return true;
        unmatchIds.push(p.id);/*今回searchの対象から外れたid*/
        if(Notifier.matchRepeat(p.repeat)) return true;
        if(Notifier.matchOnce(p.once)) return true;
        if(configs.n_sync) Notifier.unreserve(p.id, 'once');/*公式に検索通知がないので1回通知として削除する*/
      });
      Notifier.save();
      return unmatchIds;/*通知ボタンくるりんぱ用*/
    }
    static remove(program, type){
      delete notifications[type][program[type]];
      if(configs.n_sync) Notifier.unreserve(program[type], type);
    }
    static reserve(id, type){
      notifications.requests = notifications.requests.filter((r) => r.id !== id);/*既に予定済みなら優先するのでいったん削除*/
      notifications.requests.push({action: 'PUT', id: id, type: type});
    }
    static unreserve(id, type){
      notifications.requests = notifications.requests.filter((r) => r.id !== id);/*既に予定済みなら優先するのでいったん削除*/
      notifications.requests.push({action: 'DELETE', id: id, type: type});
    }
    static request(){
      if(!configs.n_sync || !notifications.requests[0]) return;/*リクエスト予定なし*/
      let request = notifications.requests[0], action = request.action, id = request.id, type = request.type;/*1つずつしか処理しない*/
      /* APIから通知を予約する */
      let xhr = new XMLHttpRequest();
      xhr.open(action, site.get.apis.reservation(id, type));
      xhr.setRequestHeader('Authorization', 'bearer ' + site.get.token());
      xhr.responseType = 'json';
      if(DEBUG) xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4) return;
        log('xhr.response:', xhr.response);
      };
      xhr.send();
      /* リクエストキューを削除 */
      notifications.requests.shift();
      Notifier.save();
    }
    static updateRepeatTitle(program){
      notifications.repeat[program.repeat] = Program.getRepeatTitle(notifications.repeat[program.repeat], program.title);
    }
    static updateOnceProgram(program){
      let now = MinuteStamp.now();
      if(program.startAt < now) return;/*放送中・終了した番組は新規登録しない*/
      if(Notifier.match(program.id)) return;/*既に通知予定済み*/
      notifications.programs.push(program);
      notifications.programs.sort((a, b) => a.startAt - b.startAt);
    }
    static updateRepeatPrograms(repeat){
      /* channelsから該当する番組を「すべて」登録・更新する */
      for(let c = 0, now = MinuteStamp.now(); channels[c]; c++){
        for(let p = 0, target; target = channels[c].programs[p]; p++){
          if(target.endAt < now) continue;/*過去の番組*/
          if(!target.repeat || target.repeat !== repeat) continue;/*検証対象のidではない*/
          let index = notifications.programs.findIndex((p) => p.id === target.id);/*登録済みのprogramか*/
          if(0 <= index){
            if(notifications.programs[index].notification) target.notification = notifications.programs[index].notification;/*通知済み*/
            notifications.programs[index] = target;/*中身の更新*/
          }
          else notifications.programs.push(target);/*新規追加*/
          Notifier.updateRepeatTitle(target);
        }
      }
      notifications.programs.sort((a, b) => a.startAt - b.startAt);
    }
    static updateSearchPrograms(key, marks){
      let matchIds = [];/*通知ボタンくるりんぱ用*/
      /* channelsから該当する番組を「すべて」登録・更新する */
      for(let c = 0, now = MinuteStamp.now(); channels[c]; c++){
        for(let p = 0, target; target = channels[c].programs[p]; p++){
          if(target.endAt < now) continue;/*過去の番組*/
          if(!core.matchProgram(target, key, marks)) continue;/*key,marksに該当しない番組はもちろん登録しない*/
          matchIds.push(target.id);/*このkey,marksに該当するid*/
          let index = notifications.programs.findIndex((p) => p.id === target.id);/*登録済みのprogramか*/
          if(0 <= index){
            if(notifications.programs[index].notification) target.notification = notifications.programs[index].notification;/*通知済み*/
            notifications.programs[index] = target;/*中身の更新*/
          }else{
            notifications.programs.push(target);/*新規追加*/
            if(configs.n_sync) Notifier.reserve(target.id, 'once');/*公式に検索通知がないので1回通知として登録する*/
          }
        }
      }
      notifications.programs.sort((a, b) => a.startAt - b.startAt);
      return matchIds;
    }
    static updateAllPrograms(){
      Object.keys(notifications.repeat).forEach((repeat) => Notifier.updateRepeatPrograms(repeat));
      Object.keys(notifications.search).forEach((key) => Notifier.updateSearchPrograms(key, notifications.search[key]));
      Notifier.save();
    }
    static matchOnce(once){
      return notifications.once[once];
    }
    static matchRepeat(repeat){
      return notifications.repeat[repeat];
    }
    static matchSearch(program){
      return Object.keys(notifications.search).find((key) => core.matchProgram(program, key, notifications.search[key]));
    }
    static match(id){
      if(notifications.programs.some((p) => p.id === id)) return true;
    }
    static createPlayButton(program){
      let button = createElement(core.html.playButton());
      button.classList.add('channel-' + program.channel.id);
      if(core.getCurrentChannelId() === program.channel.id) button.classList.add('current');
      button.title = button.dataset.titleNowonair;
      button.addEventListener('click', Notifier.playButtonListener.bind(program));
      return button;
    }
    static createNotifyButton(program){
      let button = createElement(core.html.notifyButton());
      if(Notifier.matchOnce(program.once)) button.classList.add('once');
      if(Notifier.matchRepeat(program.repeat)) button.classList.add('repeat');
      let searchKey = Notifier.matchSearch(program);
      if(searchKey){
        button.classList.add('search');
        button.dataset.key = searchKey;
      }
      button.title = Button.getButtonTitle(button);
      button.dataset.once = program.once;
      if(program.repeat) button.dataset.repeat = program.repeat;
      button.addEventListener('click', Notifier.notifyButtonListener.bind(program));
      return button;
    }
    static createRepeatAllButton(program){
      let button = createElement(core.html.repeatAllButton());
      if(Notifier.matchRepeat(program.repeat)){
        button.classList.add('active');
        button.title = button.dataset.titleActive;
      }else{
        button.title = button.dataset.titleDefault;
      }
      button.dataset.repeat = program.repeat;
      button.addEventListener('click', Notifier.repeatAllButtonListener.bind(program));
      return button;
    }
    static createSearchButton(key){
      let button = createElement(core.html.notifyButton());
      button.classList.add('search');
      button.dataset.key = key;
      button.title = Button.getButtonTitle(button);
      button.addEventListener('click', Notifier.searchButtonListener);
      return button;
    }
    static createAutoSearchButton(key, marks){
      let button = createElement(core.html.autoSearchButton(key, marks.map((name) => core.html.marks[name]()).join('')));
      if(notifications.search[key] && notifications.search[key].join() === marks.join()){
        button.classList.add('active');
        button.title = button.dataset.titleActive;
      }
      button.addEventListener('click', Notifier.autoSearchButtonListener.bind({key: key, marks: marks}));
      return button;
    }
    static createButton(program){
      let now = MinuteStamp.now();
      if(program.endAt <= now) return MyVideo.createPlayButton(program);
      if(program.startAt <= now) return Notifier.createPlayButton(program);
      if(now < program.startAt) return Notifier.createNotifyButton(program);
    }
    static playButtonListener(e){
      let program = this, button = e.target;/*playButtonListener.bind(program)*/
      core.goChannel(program.channel.id);
      e.stopPropagation();
    }
    static notifyButtonListener(e){
      let program = this, button = e.target/*notifyButtonListener.bind(program)*/, searchKey = button.dataset.key;
      let updateListPane = () => {
        if(!elements.listPane || !elements.listPane.isConnected) return;
        if(elements.listPane.dataset.mode === 'search') return;
        for(let target = button.parentNode; target; target = target.parentNode){
          if(target === elements.listPane) return;/*listPaneでのクリック時はなにもしない*/
        }
        core.timetable.listPane.buildNotificationsHeader();
        core.timetable.listPane.listAllNotifications();
      };
      switch(true){
        case(searchKey !== undefined):
          if(!elements.timetablePanel.isConnected) core.timetable.createPanel();
          core.timetable.listPane.search(searchKey, notifications.search[searchKey]);
          Button.shake(button);
          break;
        case(Notifier.matchRepeat(program.repeat) !== undefined):
          Button.shake(button);
          elements.listPane.classList.add('active');
          elements.listPane.dataset.mode = 'notifications';
          core.timetable.listPane.buildNotificationsHeader();
          elements.notificationsTabs.querySelector('#notifications-repeat').click();
          core.timetable.listPane.listRepeatNotifications();
          break;
        case(Notifier.matchOnce(program.once) !== undefined):
          Notifier.removeOnce(program);
          Button.removeOnce(program.once);
          updateListPane();
          break;
        default:
          Notifier.addOnce(program);
          Button.addOnce(program.once);
          updateListPane();
          break;
      }
      e.preventDefault();
      e.stopPropagation();
    }
    static repeatAllButtonListener(e){
      let program = this, button = e.target;/*repeatAllButtonListener.bind(program)*/
      switch(true){
        case(button.classList.contains('active')):
          Notifier.removeRepeat(program);
          Button.removeActive(button);
          Button.removeRepeat(program.repeat);
          break;
        default:
          if(program.id/*仮想programの場合があるので*/) Notifier.addRepeat(program);
          Button.addActive(button);
          Button.addRepeat(program.repeat);
          break;
      }
    }
    static searchButtonListener(e){
      let button = e.target/*notifyButtonListener.bind(key)*/, searchKey = button.dataset.key;
      if(!elements.timetablePanel.isConnected) core.timetable.createPanel();
      core.timetable.listPane.search(searchKey, notifications.search[searchKey]);
      Button.shake(button);
      e.preventDefault();
      e.stopPropagation();
    }
    static autoSearchButtonListener(e){
      let key = this.key, marks = this.marks, button = e.target/*autoSearchButtonListener.bind({key: key, marks: marks})*/;
      switch(true){
        case(notifications.search[key] && notifications.search[key].join() === marks.join()):
          Notifier.removeSearch(key, marks).forEach((id) => Button.removeSearch(id));
          Button.removeActive(button);
          break;
        default:
          Notifier.addSearch(key, marks).forEach((id) => Button.addSearch(id));
          Button.addActive(button);
          break;
      }
      core.timetable.listPane.updateSearchFillters(key, marks);
      Notifier.save();
    }
    static notify(){
      /* アベマを開いている複数のタブがある場合、自分が通知担当のタブでなければなにもしない */
      if(!notifications.tabs[ID].primary) return;
      /* 通知すべき番組を notifications.programs から探して通知を表示する。番組が終了するまでprogramは保持しておく */
      let programs = notifications.programs, now = Date.now() / 1000, currentChannelId = core.getCurrentChannelId();
      let updated = false/*programsの更新*/, toGo = configs.n_change/*二重移動回避用のチャンネル移動可能フラグ*/;
      for(let i = 0, program; program = programs[i]; i++){
        if(now < program.startAt - configs.n_before) break;/*まだ通知時刻じゃない(後続のprogramも同様なのでbreak)*/
        /* 通知時刻になっている */
        if(!program.notification){/*未通知*/
          /* 非表示チャンネル指定が解除されず(=通知されないまま)、番組が終了した場合は削除 */
          if(!configs.c_visibles[program.channel.id] && program.endAt <= now){
            programs = programs.filter((p) => p.id !== program.id), i--;
            updated = true;
            continue;
          }
          /* いま新規に通知すべきであることが確定したので */
          switch(true){
            case(now < program.startAt):/*放送直前(通知時刻)*/
            case(now < program.endAt):/*放送中*/
              let notification = program.notification = new Notification(program.titleWithMarks, {
                body: `${program.timeString}  ${program.channel.name}`,
              });
              updated = true;
              notification.addEventListener('click', function(e){
                core.goChannel(program.channel.id);
                notification.close();
              });
              switch(true){
                case(program.channel.id === currentChannelId):/*既に目的のチャンネルにいる*/
                  setTimeout(function(){
                    notification.close();
                  }, atLeast(0, program.startAt - now)*1000 + NOTIFICATIONREMAINS);/*番組開始時刻+NOTIFICATIONREMAINSまで*/
                  break;
                case(toGo && i === 0):/*最初の通知番組なら必ずチャンネルを切り替える*/
                case(toGo && !configs.n_overlap):/*時間帯が重なっている時でもチャンネルを自動で切り替える*/
                case(toGo && !programs.find((p, j) => (i < j) && (p.channel.id === currentChannelId))):/*通知番組を視聴中じゃなければチャンネルを切り替える*/
                  window.addEventListener('beforeunload', notification.close.bind(notification));/*ページ遷移が発声した際に通知が開いたままになるのを防ぐ*/
                  setTimeout(function(){
                    window.removeEventListener('beforeunload', notification.close.bind(notification));
                    notification.close();
                  }, atLeast(0, program.startAt - now)*1000 + NOTIFICATIONREMAINS);/*番組開始時刻+NOTIFICATIONREMAINSまで*/
                  toGo = false, core.goChannel(program.channel.id);/*ページ遷移が発生した場合に即閉じられるのはやむを得ない*/
                  break;
                default:/*自動でチャンネルは切り替えなくてよい*/
                  setTimeout(function(){
                    if(program.channel.id === core.getCurrentChannelId()) notification.close();
                  }, atLeast(0, program.startAt - now)*1000);/*番組開始時点で目的のチャンネルにいれば閉じる*/
                  setTimeout(function(){
                    notification.close();
                  }, atLeast(0, program.endAt - now)*1000 + NOTIFICATIONREMAINS);/*番組終了時刻まで閉じない*/
                  break;
              }
              break;
            case(program.endAt <= now):/*手遅れ*/
              program.notification = new Notification(program.titleWithMarks, {
                body: `[放送終了]  ${program.channel.name}`,
              });
              updated = true;
              /*勝手に閉じない*/
              break;
          }
        }else{/*通知済み*/
          if(now < program.endAt) continue;/*まだこの番組は続いているので次の番組を確認*/
          /* すでに番組が終了しているようなので */
          programs = programs.filter((p) => p.id !== program.id), i--;/*通知番組から削除する*/
          updated = true;
          if(programs.length === 0 || !programs.find((p) => p.notification && (now < p.endAt))) break;/*切り替えるべきチャンネルも通知すべき番組もなければ終了*/
          if(program.channel.id !== currentChannelId) continue;/*その番組を視聴していなかったらなにもしない*/
          /* まだ放送中の通知番組がある */
          if(toGo){/*「自動でチャンネルも切り替える」オンなら、次に切り替えるべきチャンネルを探す*/
            if(configs.n_overlap){/*「時間帯が重なっている時は通知のみ」オン(できるだけ番組に留まり続ける)*/
              toGo = false, core.goChannel(programs[0].channel.id);/*優先されるべき最初に開始した番組へ移動*/
              if(programs[0].notification.close){/*移動先の番組の通知が残っているなら、消しておく*/
                setTimeout(function(){programs[0].notification.close()}, NOTIFICATIONREMAINS);
              }
            }else{/*「時間帯が重なっている時は通知のみ」オフ(常に新しい番組を追い続ける)*/
              for(let j = 0; programs[j]; j++){
                if(programs[j + 1] && programs[j + 1].notification) continue;/*まだ最後じゃない*/
                toGo = false, core.goChannel(programs[j].channel.id);/*優先されるべき最後に開始した番組へ移動*/
                if(programs[j].notification && programs[j].notification.close){
                  setTimeout(function(){programs[j].notification.close()}, NOTIFICATIONREMAINS);
                }
                break;
              }
            }
          }else{/*「自動でチャンネルも切り替える」オフで通知のみなら、次に通知してあげる番組を探す*/
            /* 開いたままの通知が残っているなら、それこそが次に通知してあげたかった番組なので新たにやるべきことはない */
            if(programs.some((p) => p.notification && p.notification.close)) break;
            /* 通知が消えたか消してしまったようなので、新たに通知してあげる */
            if(programs[1] && programs[1].notification){/*放送中の通知番組が複数([0],[1])ある*/
              let notification = new Notification(SCRIPTNAME, {
                body: `通知予約した番組がまだほかにも放送中です`,
              });
              setTimeout(function(){notification.close()}, NOTIFICATIONREMAINS);
              if(elements.channelPane.getAttribute('aria-hidden') === 'true' || !html.classList.contains('channel')){
                elements.channelButton.click();/*親切！*/
              }
            }else{/*放送中の通知番組がひとつだけ([0])ある*/
              programs[0].notification = new Notification(programs[0].titleWithMarks, {
                body: `${programs[0].timeString}  ${programs[0].channel.name}`,
              });
              programs[0].notification.addEventListener('click', function(e){
                core.goChannel(programs[0].channel.id);
                programs[0].notification.close();
              });
              setTimeout(function(){
                programs[0].notification.close();
              }, atLeast(0, programs[0].endAt - now)*1000 + NOTIFICATIONREMAINS);/*番組終了時刻まで*/
            }
          }
        }
      }
      if(updated === false) return;/*更新されていないなら処理しなくてよい*/
      notifications.programs = programs;/*filter()を通して参照じゃなくなってるので必要な代入*/
      Notifier.save();
    }
    static updateCount(){
      let button = elements.notificationsButton;
      if(!button) return;
      if(parseInt(button.dataset.count) === notifications.programs.length) return;
      button.dataset.count = button.querySelector('.count').textContent = notifications.programs.length;
      Button.pop(button);
      if(!elements.listPane || !elements.listPane.isConnected) return;
      if(!elements.listPane.classList.contains('active')) return;
      if(elements.listPane.dataset.mode !== 'notifications') return;
      if(elements.listPane.querySelector(':hover')) return;
      core.timetable.listPane.buildNotificationsHeader();
      core.timetable.listPane.listAllNotifications();
    }
    static read(){
      notifications = Storage.read('notifications') || notifications;
      for(let i = 0; notifications.programs[i]; i++){
        notifications.programs[i] = new Program(notifications.programs[i]);
      }
    }
    static save(){
      Notifier.updateCount();
      Storage.save('notifications', notifications);
    }
    static updatePrimaryTab(){
      if(!notifications.tabs) notifications.tabs = {};
      let tabs = notifications.tabs, now = Date.now(), url = location.href;
      let nowonair = url.includes('/now-on-air/'), active = !document.hidden, timetable = url.endsWith('/timetable');
      tabs[ID] = {/*まず自分のタブを明らかにする*/
        score: (nowonair ? 100 : 0) + (timetable ? 10 : 0) + (active ? 1 : 0),
        nowonair: nowonair,
        active: active,
        url: url,
        updated: now,
        primary: undefined,
      };
      let ids = Object.keys(tabs);
      ids.forEach((id, i) => {if(tabs[id].updated < now - 2*MINUTE*1000) delete tabs[id], delete ids[i]});/*古いタブは削除する*/
      ids.forEach((id) => tabs[id].primary = false);/*いったんリセットして*/
      /* 優先順に並び替えて先頭に通知担当タブの栄誉を与える */
      ids.sort((a, b) => tabs[b].score - tabs[a].score);/*スコアの大きい順*/
      tabs[ids[0]].primary = true;/*おまえが担当だ!!*/
      notifications.tabs = tabs;/*参照じゃなくなるかもしれないので念のため*/
      Notifier.save();
    }
  }
  class MyVideo{
    static sync(){
      /* 視聴期限切れもあちらで消えるので自動的に反映される */
      let xhr = new XMLHttpRequest();
      xhr.open('GET', site.get.apis.myvideos());
      xhr.setRequestHeader('Authorization', 'bearer ' + site.get.token());
      xhr.responseType = 'json';
      xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4 || xhr.status !== 200) return;
        if(!xhr.response.dataSet) return log(`Not found: MyVideo data`);
        //log('xhr.response:', xhr.response);
        let programs = (xhr.response.dataSet.slots || []).concat(xhr.response.dataSet.programs || []);/*xhr.responseをそのまま使うとパフォーマンス悪い*/
        /* あちらにしかないものはあちらで能動的に登録したとみなしてこちらにも登録 */
        for(let i = 0; programs[i]; i++){
          if(!myvideos.programs.some((p) => p.id === programs[i].id)){
            let program = core.getProgramById(programs[i].id);
            if(program) myvideos.programs.push(program);/*ローカルにあった番組*/
            else if(programs[i].channelId){/*ローカルになかった番組*/
              let channel = channels.find(c => c.id === programs[i].channelId);
              myvideos.programs.push(new Program().fromSlot(programs[i], {
                id: programs[i].channelId, name: channel ? channel.fullName : programs[i].channelId,
              }));
            }else myvideos.programs.push(new Video().fromProgram(programs[i]));/*ビデオ*/
          }
        }
        /* こちらにしかないものはあちらで能動的に削除したとみなしてこちらでも削除 */
        myvideos.programs = myvideos.programs.filter((myvideo) => (programs.some((program) => program.id === myvideo.id)));
        /* 更新 */
        MyVideo.sort();
        Storage.save('myvideos', myvideos);
      };
      xhr.send();
    }
    static add(program){
      if(MyVideo.match(program.id)) return;
      myvideos.programs.push(program);
      MyVideo.sort();
      Storage.save('myvideos', myvideos);
      myvideos.requests = myvideos.requests.filter((r) => r.id !== program.id);/*既に予定済みなら優先するのでいったん削除*/
      myvideos.requests.push({action: 'PUT', id: program.id, type: program.type});
    }
    static remove(program){
      myvideos.programs = myvideos.programs.filter((p) => (p.id !== program.id));
      Storage.save('myvideos', myvideos);
      myvideos.requests = myvideos.requests.filter((r) => r.id !== program.id);/*既に予定済みなら優先するのでいったん削除*/
      myvideos.requests.push({action: 'DELETE', id: program.id, type: program.type});
    }
    static request(){
      if(!myvideos.requests[0]) return;/*リクエスト予定なし*/
      let request = myvideos.requests[0], action = request.action, id = request.id, type = request.type;/*1つずつしか処理しない*/
      /* APIからビデオを登録する */
      let xhr = new XMLHttpRequest();
      xhr.open(action, site.get.apis.myvideo(id, type));
      xhr.setRequestHeader('Authorization', 'bearer ' + site.get.token());
      xhr.responseType = 'json';
      if(DEBUG) xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4) return;
        log('xhr.response:', xhr.response);
      };
      xhr.send();
      /* リクエストキューを削除 */
      myvideos.requests.shift();
      Storage.save('myvideos', myvideos);
    }
    static match(id){
      if(myvideos.programs.some((p) => p.id === id)) return true;
    }
    static createPlayButton(program){
      let button = createElement(core.html.playButton());
      switch(true){
        case(program.hasExpired):
          button.title = button.dataset.titleExpired;
          button.classList.add('unavalable');
          break;
        case(program.isVideo):
          button.title = button.dataset.titleVideo;
          break;
        default:
          button.title = button.dataset.titleTimeshift;
          break;
      }
      button.addEventListener('click', MyVideo.playButtonListener.bind(program));
      /* ビデオは外部で視聴させるので */
      let a = document.createElement('a');
      a.href = (program.isVideo) ? WATCHVIDEO.replace('{id}', program.id) : WATCHTIMESHIFT.replace('{channelId}', program.channel.id).replace('{id}', program.id);
      a.appendChild(button);
      return a;
    }
    static createMyVideoButton(program){
      let button = createElement(core.html.myvideoButton());
      if(program.timeshiftEndAt){
        if(MyVideo.match(program.id)){
          button.classList.add('active');
          button.title = button.dataset.titleActive;
        }else{
          button.title = button.dataset.titleDefault;
        }
      }else{
        button.classList.add('unavalable');
        button.title = button.dataset.titleUnavailable;
      }
      button.dataset.id = program.id;
      button.addEventListener('click', MyVideo.myVideoButtonListener.bind(program));
      return button;
    }
    static getRemoteSearchResults(q){
      return Promise.all([
        MyVideo.fetchSearchSlots(q).then(result => {
          return {label: '見逃し番組', programs: result.programs, count: result.count};
        }),
        MyVideo.fetchSearchVideos(q).then(result => {
          return {label: 'ビデオ', programs: result.programs, count: result.count};
        }),
      ]);
    }
    static createListMoreButton(label, q){
      const methods = {
        '見逃し番組': MyVideo.fetchSearchSlots,
        'ビデオ': MyVideo.fetchSearchVideos,
      };
      let button = createElement(core.html.listMoreButton(label));
      button.dataset.page = 0;
      button.addEventListener('click', function(e){
        let page = button.dataset.page = parseInt(button.dataset.page) + 1;
        button.classList.add('searching');
        methods[label](q, page).then(result => {
          core.timetable.listPane.addSearchResults(label, result.programs, result.count, q);
          if(result.count <= REMOTERESULTS + page*MOREREMOTERESULTS) button.parentNode.removeChild(button);/*そしてわたしも消えよう*/
          else button.classList.remove('searching');
        });
      });
      return button;
    }
    static fetchSearchSlots(q, page = 0){
      return fetch(site.get.apis.searchSlots(q, page), {headers: {'Authorization': 'bearer ' + site.get.token()}})
        .then(response => response.json())
        .then(json => {
          let dataSet = json.dataSet, count = json.count;
          if(!count) return null;
          let programs = dataSet.slots.map((p) => new Program().fromSlot(p, {
            id: p.channelId, name: dataSet.channels.find((c) => c.id === p.channelId).name,
          })).filter((p) => configs.c_visibles[p.channel.id]);/*並べ替えはアベマが努力しているもよう*/
          return {programs: programs, count: count};
        });
    }
    static fetchSearchVideos(q, page = 0){
      return fetch(site.get.apis.searchVideos(q, page), {headers: {'Authorization': 'bearer ' + site.get.token()}})
        .then(response => response.json())
        .then(json => {
          let programs = json.programs, count = json.count;
          if(!count) return null;
          let videos = programs.map((p) => new Video().fromProgram(p));
          return {programs: videos, count: count};
        });
    }
    static createDeleteAllButton(expiredCount){
      let button = createElement(core.html.deleteAllButton(expiredCount));
      button.classList.add('active');
      button.title = button.dataset.titleActive;
      button.addEventListener('click', MyVideo.deleteAllButtonListener);
      return button;
    }
    static playButtonListener(e){
      let program = this, button = e.target;/*playButtonListener.bind(program)*/
      switch(true){
        case(button.classList.contains('unavalable')):
          Button.shake(button);
          break;
        case(program.isVideo):
          location.assign(WATCHVIDEO.replace('{id}', program.id));
          break;
        default:
          location.assign(WATCHTIMESHIFT.replace('{channelId}', program.channel.id).replace('{id}', program.id));
          break;
      }
      e.stopPropagation();
      e.preventDefault();
    }
    static myVideoButtonListener(e){
      let program = this, button = e.target;/*buttonListener.bind(program)*/
      let updateListPane = () => {
        if(!elements.listPane || !elements.listPane.isConnected) return;
        if(!elements.listPane.classList.contains('active')) return;
        if(elements.listPane.dataset.mode !== 'notifications') return;
        for(let target = button.parentNode; target; target = target.parentNode){
          if(target === elements.listPane) return;/*listPaneでのクリック時はなにもしない*/
        }
        core.timetable.listPane.buildNotificationsHeader();
        core.timetable.listPane.listMyVideos();
        elements.listPane.querySelector('nav.tabs > input#notifications-myvideo').click();
      };
      switch(true){
        case(program.timeshiftEndAt === undefined):
          Button.shake(button);
          break;
        case(MyVideo.match(program.id)):
          MyVideo.remove(program);
          Button.removeVideo(program.id);
          updateListPane();
          break;
        default:
          MyVideo.add(program);
          Button.addVideo(program.id);
          updateListPane();
          break;
      }
      e.stopPropagation();
    }
    static deleteAllButtonListener(e){
      let button = e.target;
      switch(true){
        case(button.classList.contains('active')):/*削除する*/
          myvideos.programs.forEach((p) => {if(p.hasExpired){
            let myVideoButton = elements.listPane.querySelector(`button.myvideo.active[data-id="${p.id}"]`);
            if(myVideoButton) myVideoButton.click();
            else MyVideo.remove(p);/*ボタンが押せなくても強制削除*/
          }});
          Button.removeActive(button);
          button.lastChild.textContent = button.dataset.titleDefault;
          break;
        default:/*元に戻す*/
          /* この時点ですでにmyvideos.programsからは削除されているのでボタンを元に見つけて押す */
          elements.listPane.querySelectorAll(`button.myvideo:not(.active)`).forEach((b) => {
            b.click();
          });
          Button.addActive(button);
          button.lastChild.textContent = button.dataset.titleActive;
          break;
      }
    }
    static isPremiumUser(){
      switch(site.get.subscriptionType()){
        case('freeUser'):   return false;
        case('trialUser'):  return true;
        case('subscriber'): return true;
        default:            return false;
      }
    }
    static read(){
      myvideos = Storage.read('myvideos') || myvideos;
      if(myvideos.programs === undefined) myvideos = {programs: myvideos, requests: []};/*2019-03-23(ver2.3.0): 互換性維持*/
      for(let i = 0; myvideos.programs[i]; i++){
        if(myvideos.programs[i].isVideo) myvideos.programs[i] = new Video(myvideos.programs[i]);
        else myvideos.programs[i] = new Program(myvideos.programs[i]);
      }
    }
    static sort(){
      let isPremiumUser = MyVideo.isPremiumUser(), key = isPremiumUser ? 'timeshiftEndAt' : 'timeshiftFreeEndAt';
      myvideos.programs.sort((a, b) => a.startAt - b.startAt || a[key] - b[key]);
    }
  }
  let html, elements = {}, configs = {}, sizes = {};
  let channels = [], myvideos = {
    programs: [],/*見逃し番組とビデオ*/
    requests: [],/*リクエスト予定[{action, id, type('slot', 'program')}]*/
  }, notifications = {
    once: {},/*1回通知{id: title}*/
    repeat: {},/*毎回通知{id: title}*/
    search: {},/*検索通知{key: marks}*/
    programs: [],/*通知予定[program]*/
    requests: [],/*リクエスト予定[{action, id, type('once', 'repeat')}]*/
    tabs: {},/*開いているタブ{id: {score, nowonair, active, url, updated, primary}}*/
  };
  let core = {
    initialize: function(){
      /* 一度だけ */
      html = document.documentElement;
      html.classList.add(SCRIPTNAME);
      core.config.read();
      core.read();
      core.addStyle();
      core.getSizes();
      core.getSplash();
      core.panel.createPanels();
      core.listenUserActions();
      core.abemaTimetable.initialize();
      core.ticktock();
    },
    getSizes: function(){
      /* サイズ計測は重い処理なので極力呼びたくない */
      sizes.window = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      };
    },
    getSplash: function(){
      /* ブラウザ読み込み時にsplashが生成されないページもある */
      let splash = elements.splash = site.get.splash();
      if(splash) return;
      /* 無ければ外部ページから持ってくる */
      fetch('https://abema.tv/about/terms')/*どこでもいいけど*/
        .then(response => response.text())
        .then(text => new DOMParser().parseFromString(text, 'text/html'))
        .then(d => {
          let splash = elements.splash = d.querySelector('#splash');
          if(!splash) return log('Not found: #splash.');
          splash.classList.add('fake');
          document.body.insertBefore(splash, document.body.firstElementChild);
        });
    },
    ticktock: function(){
      let last = new Date(), now = new Date(), random = 1000*Math.random();
      setInterval(function(){
        last = now, now = new Date();
        switch(true){
          /* 毎日処理 */
          case (now.getDate() !== last.getDate()):
            core.timetable.buildTimes();
            core.timetable.buildDays();/*先に作ったtimesのdisable判定を含む*/
            setTimeout(function(){/*アベマへの負荷分散*/
              core.updateChannels();
            }, MINUTE*random/*ささやかだけど最大1分遅延*/);
          /* 毎時処理 */
          case (now.getHours() !== last.getHours()):
            setTimeout(function(){/*アベマへの負荷分散*/
              Notifier.sync();
              MyVideo.sync();
              if(now.getDate() !== last.getDate()) return;/*毎日処理と重複させない*/
              if(Storage.saved('channels') < Date.now() - CACHEEXPIRE) core.updateChannels();/*キャッシュ期間が終わっていれば更新*/
              else core.checkChannels();/*キャッシュ期間でも臨時チャンネルの有無は確認する*/
            }, HOUR*random/*最大1時間遅延*/);
          /* 毎分処理 */
          case (now.getMinutes() !== last.getMinutes()):
            core.timetable.shiftTimetable();
            if(now.getHours() !== last.getHours()) return;/*毎時処理と重複させない*/
            Notifier.updateCount();/*外部からの新規通知登録や番組終了に対応*/
            Notifier.updatePrimaryTab();/*タブの生存確認*/
          /* 毎秒処理 */
          default:
            core.checkUrl();
            Notifier.notify();
            Notifier.request();
            MyVideo.request();
            core.checkStalled();
        }
      }, 1000);
    },
    checkUrl: function(){
      location.previousUrl = location.previousUrl || '';
      if(location.href === location.previousUrl) return;/*URLが変わってない*/
      Notifier.updatePrimaryTab();/*URLが変わったので通知プライマリタブを確認*/
      if(location.href.startsWith('https://abema.tv/now-on-air/')){/*テレビ視聴ページ*/
        if(location.previousUrl.startsWith('https://abema.tv/now-on-air/')){/*チャンネルを変えただけ*/
          elements.closer = site.get.closer();
        }else{/*テレビ視聴ページになった*/
          core.readyForOnAirPage();
        }
      }else if(core.abemaTimetable.beHere()){/*番組表ページ*/
        if(location.previousUrl === '') core.abemaTimetable.openOnAbemaTimetable();/*初回のみ*/
      }else{
        /*nothing*/
      }
      location.previousUrl = location.href;
    },
    read: function(){
      /* ストレージデータの取得とクラスオブジェクト化 */
      channels = Storage.read('channels') || channels;
      for(let i = 0; channels[i]; i++) channels[i] = new Channel(channels[i]);
      if(!channels.length) core.updateChannels();
      else if(Storage.saved('channels') < Date.now() - CACHEEXPIRE) core.updateChannels();
      else if(DEBUG && UPDATECHANNELS) core.updateChannels();
      Notifier.read();
      Notifier.sync();
      MyVideo.read();
      MyVideo.sync();
      setTimeout(Notifier.updateAllPrograms, 1000);/*重いのでCPU負荷分散*/
    },
    readyForOnAirPage: function(){
      /* 必要な要素が出揃うまで粘る */
      for(let i = 0, target; target = site.targets[i]; i++){
        if(target() === false){
          if(!retry) return log(`Not found: ${target.name}, I give up.`);
          log(`Not found: ${target.name}, retrying... (left ${retry})`);
          return retry-- && setTimeout(core.readyForOnAirPage, 1000);
        }
      }
      elements.closer = site.get.closer();
      log("I'm Ready.");
      core.createChannelIndicator();
      core.timetable.createButton();
      core.relateWithScreenCommentScroller();
    },
    relateWithScreenCommentScroller: function(){
      /* ScreenCommentScrollerとの連携(clickイベントを統括するScreenCommentScrollerより確実にあとに実行する) */
      setTimeout(function(){
        if(!site.get.screenCommentScroller()) return;
        /* チャンネル切り替えイベントをいつでも流用するための準備 */
        if(elements.channelPane.getAttribute('aria-hidden') === 'false') return;/*既に開かれている*/
        /* 裏番組一覧が開かれたら即閉じる準備 */
        let observer = observe(elements.channelPane.firstElementChild, function(records){
          if(elements.channelPane.getAttribute('aria-hidden') === 'true') return;
          observer.disconnect();/*一度だけ*/
          elements.closer.click();
          setTimeout(function(){html.classList.remove('channelPaneHidden')}, 1000);/*チラ見せさせない*/
        });
        core.channelPane.openHide();
      }, 2500);
    },
    createChannelIndicator: function(){
      if(elements.indicator && elements.indicator.isConnected) elements.indicator.parentNode.removeChild(elements.indicator);
      let indicator = elements.indicator = createElement(core.html.channelIndicator());
      let ul = indicator.querySelector('ul'), template = indicator.querySelector('li.template');
      for(let c = 0, channel; channel = channels[c]; c++){
        if(!configs.c_visibles[channel.id]) continue;
        let li = template.cloneNode(true), img = li.querySelector('img');
        li.classList.remove('template');
        li.dataset.channel = channel.id;
        img.src = CHANNELLOGO.replace('{id}', channel.id);
        img.alt = channel.id;
        ul.insertBefore(li, template);
      }
      document.body.appendChild(indicator);
      core.scrollChannelIndicator(core.getCurrentChannelId());
    },
    scrollChannelIndicator: function(id){
      if(!id) return;
      let indicator = elements.indicator, ul = indicator.querySelector('ul.channels');
      clearTimeout(indicator.timer);
      for(let i = 0, lis = ul.querySelectorAll('li.channel:not(.template)'), li; li = lis[i]; i++){
        if(li.dataset.channel === id){
          li.classList.add('current');
          ul.style.transform = `translateY(-${i * 25}vh)`;
          indicator.classList.add('active');
          indicator.timer = setTimeout(function(){indicator.classList.remove('active')}, LOGOINDICATE);
        }else{
          if(li.classList.contains('current')) li.classList.remove('current');
          let padding = core.getProgramNowOnAir(li.dataset.channel).padding;
          if(padding && li.classList.contains('onair'))  li.classList.remove('onair');
          else if(!padding && !li.classList.contains('onair')) li.classList.add('onair');
        }
      }
    },
    checkChannels: function(){
      let xhr = new XMLHttpRequest();
      xhr.open('GET', site.get.apis.channels());
      xhr.responseType = 'json';
      xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4 || xhr.status !== 200) return;
        if(!xhr.response.channels) return log(`Not found: data`);
        log('xhr.response:', xhr.response);
        let cs = xhr.response.channels;/*xhr.responseをそのまま使うとパフォーマンス悪い*/
        if(!cs.every((c) => channels.some((channel) => channel.id === c.id))) core.updateChannels();
      };
      xhr.send();
    },
    updateChannels: function(callback){
      let xhr = new XMLHttpRequest();
      xhr.open('GET', site.get.apis.timetable());
      xhr.setRequestHeader('Authorization', 'bearer ' + site.get.token());
      xhr.responseType = 'json';
      xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4 || xhr.status !== 200) return;
        if(!xhr.response.channels || !xhr.response.channelSchedules) return log(`Not found: data`);
        log('xhr.response:', xhr.response);
        let ss = xhr.response.channelSchedules, cs = xhr.response.channels, slots = {};/*xhr.responseをそのまま使うとパフォーマンス悪い*/
        /* channels更新 */
        let oldChannels = channels;
        channels = [];/* いったんクリア */
        for(let i = 0, s; s = ss[i]; i++){
          slots[s.channelId] = (slots[s.channelId]) ? slots[s.channelId].concat(s.slots) : s.slots;
        }
        for(let i = 0, c; c = cs[i]; i++){
          channels[i] = new Channel().fromChannelSlots(c, slots[c.id]);
        }
        /* 増減するチャンネルは番組予定がある限り保持し続ける */
        for(let i = 0, now = MinuteStamp.now(), o; o = oldChannels[i]; i++){
          if(channels.some((c) => c.id === o.id)) continue;/*引き続き存在するのでなにもしなくてよい*/
          if(now < o.programs[o.programs.length - 1].endAt){/*番組予定があるので引き継ぐ*/
            o.programs = o.programs.filter((p) => now < p.endAt);/*過去の番組を削除*/
            if(o.programs.length <= 1) continue;/*空き埋め枠だけになったら引き継がない*/
            channels.push(o);
          }
        }
        channels.sort((a, b) => a.order - b.order);
        /* configs.c_visibles更新 */
        if(Object.keys(configs.c_visibles).length === 0){
          for(let i = 0, c; c = channels[i]; i++) configs.c_visibles[c.id] = 1;
        }else{
          for(let i = 0, c; c = channels[i]; i++){
            if(configs.c_visibles[c.id] === undefined) configs.c_visibles[c.id] = 1;/*新規チャンネル*/
          }
          Object.keys(configs.c_visibles).forEach((key) => {
            if(configs.c_visibles[key] === 0) return;/*非表示にした情報は残す*/
            if(!channels.some((c) => c.id === key)) delete configs.c_visibles[key];/*非表示でなければ将来復活しても表示されるだけなので廃止チャンネルとみなしてかまわない*/
          });
        }
        /* 反映 */
        Storage.save('channels', channels);
        Storage.save('configs', configs);
        core.addStyle();/*チャンネル数によってフォントサイズを変えるので*/
        core.createChannelIndicator();
        core.timetable.rebuildTimetable();
        Notifier.updateAllPrograms();
        if(callback) callback();
      };
      xhr.send();
    },
    goChannel: function(id){
      if(core.getCurrentChannelId() === id) return;/*すでに目的のチャンネルにいる*/
      switch(true){
        /* 番組視聴ページにいる */
        case(elements.channelPane && elements.channelPane.isConnected):
          /* 裏番組一覧から正規のチャンネル切り替えイベントを流用する */
          let a = site.get.onairChannel(elements.channelPane, id);
          if(a === null) return location.assign('/now-on-air/' + id);
          a.click();
          core.updateCurrentChannel(id);
          return true;
        /* 置き換えた公式番組表ページにいる */
        case(configs.replace && location.href.endsWith('/timetable')):
          core.abemaTimetable.goChannel(id);
          return true;
        default:
          return location.assign('/now-on-air/' + id);
      }
    },
    skipChannel: function(direction = +1){
      if(!location.href.includes('/now-on-air/')) return;
      let loop = (i) => {/*ループありでiをインクリメント*/
        switch(true){
          case(direction === +1):
            if(i === channels.length - 1) return 0;
            else return i + 1;
          case(direction === -1):
            if(i === 0) return channels.length - 1;
            else return i - 1;
        }
      };
      for(let c = 0; channels[c]; c++){
        if(core.getCurrentChannelId() !== channels[c].id) continue;
        /* 現在視聴中のチャンネルからチェックスタート */
        for(let i = loop(c), target; target = channels[i]; i = loop(i)){
          if(i === c) return false;/*一周してしまった*/
          if(!configs.c_visibles[target.id]) continue;/*非表示チャンネルは飛ばす*/
          if(core.getProgramNowOnAir(target.id).padding) continue;/*放送中じゃない休止チャンネルは飛ばす*/
          if(i === loop(c)){/*隣のチャンネル*/
            core.updateCurrentChannel(target.id);
            return false;/*スキップ不要*/
          }else{
            core.goChannel(target.id);/*updateCurrentChannelも含む*/
            return true;/*スキップした*/
          }
        }
      }
    },
    updateCurrentChannel(id){
      core.scrollChannelIndicator(id);
      /* playButtonのcurrentを付け替える */
      $$('button.play.current').forEach((b) => b.classList.remove('current'));
      $$('button.play.channel-' + id).forEach((b) => b.classList.add('current'));
      /* channelPaneのcurrentを付け替える */
      if(elements.channelPane){
        let previous = elements.channelPane.querySelector('a[data-current="true"]');
        if(previous) delete previous.dataset.current;
        let current = elements.channelPane.querySelector(`a[data-channel="${id}"]`);
        if(current) current.dataset.current = 'true';/*classは公式にclassNameで上書きされてしまうので*/
        core.channelPane.scrollToChannel(id, true/*アニメーションさせる*/);
      }
      /* timetablePanel内のchannelsUlのcurrentを付け替える */
      if(elements.channelsUl){
        let previous = elements.channelsUl.querySelector('.channel.current');
        if(previous) previous.classList.remove('current');
        let current = elements.channelsUl.querySelector('.channel#channel-' + id);
        if(current) current.classList.add('current');
      }
    },
    listenUserActions: function(){
      window.addEventListener('click', function(e){
        switch(true){
          /* チャンネル切り替えボタン */
          case(e.target === elements.channelUpButton):
          case(e.target === elements.channelDownButton):
            if(core.skipChannel((e.target === elements.channelDownButton) ? +1 : -1)){
              e.stopPropagation();
              e.preventDefault();
            }
            /* skip不要ならデフォルトのチャンネル切り替えに任せる */
            return;
          /* 裏番組一覧ボタン */
          case(e.target === elements.channelButton):
            core.channelPane.modify();
            core.channelPane.scrollToChannel(core.getCurrentChannelId());
            return;
          /* アベマ公式の通知・マイビデオボタンが押されたら同期する */
          case(e.isTrusted && configs.n_sync && site.get.abemaNotifyButton(e.target)):
            return setTimeout(Notifier.sync, 1000);
          case(e.isTrusted && site.get.abemaMyVideoButton(e.target)):
            return setTimeout(MyVideo.sync, 1000);
        }
      }, true);
      window.addEventListener('keydown', function(e){
        if(!location.href.includes('/now-on-air/')) return;
        switch(true){
          /* テキスト入力中は反応しない */
          case(['input', 'textarea'].includes(document.activeElement.localName)):
            return;
          /* Alt/Shift/Ctrl/Metaキーが押されていたら反応しない */
          case(e.altKey || e.shiftKey || e.ctrlKey || e.metaKey):
            return;
          /* 上下キーによるチャンネル切り替え */
          case(e.key === 'ArrowUp'):
          case(e.key === 'ArrowDown'):
            document.activeElement.blur();/*上下キーによるスクロールを防止*/
            if(core.skipChannel((e.key === 'ArrowDown') ? +1 : -1)){
              e.stopPropagation();
              e.preventDefault();
            }
            /*skip不要ならデフォルトのチャンネル切り替えに任せる*/
            return;
        }
      }, true);
      let resizing, resize = function(){
        core.getSizes();
        core.channelPane.getThumbWidth();
        core.channelPane.modify();
        core.timetable.fitWidth();
      };
      window.addEventListener('resize', function(e){
        if(!resizing) setTimeout(core.resize, 500);/*初動*/
        clearTimeout(resizing), resizing = setTimeout(function(){
          resize();/*ダメ押し*/
          resizing = null;
        }, 2500);
      });
      document.addEventListener('visibilitychange', function(e){
        Notifier.updatePrimaryTab();
      });
      window.addEventListener('storage', function(e){
        if(e.key === SCRIPTNAME + '-configs') return core.config.read();
        if(e.key === SCRIPTNAME + '-notifications') return Notifier.read();
        if(e.key === SCRIPTNAME + '-myvideos') return MyVideo.read();
      });
      window.addEventListener('unload', function(e){
        delete notifications.tabs[ID];
        Notifier.save();
      });
    },
    checkStalled: function(){
      if(document.hidden || !location.href.includes('/now-on-air/')) return;
      /* main消失バグに対応 */
      let main = $('#main');/*ついでに main.playedOnce としてカウンタに使う*/
      if(!main) return;
      if(main.children.length === 0){
        if(!main.playedOnce) return;/*ページ読み込み直後は猶予する*/
        log('Vanished.');
        return location.reload(true);
      }
      /* 映像・音声の停止を検知する(連続で再読込した時はもう少し粘る) */
      if(!location.href.startsWith('https://abema.tv/now-on-air/')) return;/*放送ページのみで判定*/
      let videos = $$('video[src]'), audios = $$('audio[src]'), limit = Storage.read('stalledLimit') || STALLEDLIMIT[0];
      if(!videos.length) return;
      videos.forEach((v) => {
        v.progressTime = v.currentTime - (v.previousTime || 0);
        v.previousTime = v.currentTime;
        v.srcChanged   = (v.src !== v.previousSrc);
        v.previousSrc  = v.src;
      });
      audios.forEach((a) => {
        a.progressTime = a.currentTime - (a.previousTime || 0);
        a.previousTime = a.currentTime;
      });
      switch(true){
        /*判定しないケース*/
        case(Array.from(videos).some((v) => v.srcChanged)):/*src差し替え*/
        case(Array.from(videos).some((v) => v.progressTime < 0)):/*巻き戻し*/
          return;
        /* 映像・音声の停止判定 */
        case(Array.from(videos).every((v) => v.paused)):
        case(Array.from(videos).every((v) => v.currentTime === 0)):
        case(Array.from(videos).some((v) => !v.paused && v.progressTime < PROGRESS)):
        case(Array.from(audios).some((a) => !a.paused && a.progressTime < PROGRESS)):
          if(!main.playedOnce) return;/*ページ読み込み直後は猶予する*/
          videos[0].pausedCount = (videos[0].pausedCount || 0) + 1;
          videos.forEach((v) => log(
            `${videos[0].pausedCount}/${limit}`,
            'Paused?',
            (v.progressTime < 0 ? '' : `+${v.progressTime.toFixed(3)}s`),
            v.src,
          ));
          if(videos[0].pausedCount >= limit){
            Storage.save('stalledLimit', atMost(limit + 1, STALLEDLIMIT[1]), Date.now() + EXPIRESTALLED);
            return location.reload(true);
          }
          break;
        /* 映像が正常に流れていたので */
        default:
          if(!main.playedOnce) main.playedOnce = true;/*一度正常に流れて初めて停止判定を開始する*/
          if(1 <= videos[0].pausedCount){
            videos[0].pausedCount--;
            log(`${videos[0].pausedCount}/${limit}`, 'Recovering...');
          }
          break;
      }
    },
    channelPane: {
      openHide: function(){
        /* ユーザーには開閉したように見せない */
        html.classList.add('channelPaneHidden');/*開いても隠しておく*/
        if(document.hidden) document.addEventListener('visibilitychange', function(e){/*hiddenだとclickしても効果がないので*/
          elements.channelButton.click();
        }, {once: true});
        else elements.channelButton.click();
      },
      observeOnce: function(callback){
        /* 裏番組一覧の改変を検出してcallback() */
        let observer = observe(elements.channelPane, function(records){
          callback();
          observer.disconnect();
        }, {childList: true, characterData: true, subtree: true});
      },
      scrollToChannel: function(id, transition = false){
        let channelPane = elements.channelPane, child = channelPane.firstElementChild, a = site.get.onairChannel(channelPane, id);
        let pHeight = child.offsetHeight, aTop = a.offsetTop, aHeight = a.offsetHeight, innerHeight = sizes.window.innerHeight;
        if(pHeight <= innerHeight) return;/*スクロールの必要なし*/
        let scrollTop = between(0, aTop - (innerHeight / 2) + (aHeight / 2), pHeight - innerHeight -1/*端数対応*/);
        if(!transition) return channelPane.scrollTop = scrollTop;/*アニメーションの必要なし*/
        child.style.transition = 'none';
        child.style.transform = `translateY(${scrollTop - channelPane.scrollTop}px)`;
        channelPane.scrollTop = scrollTop;
        animate(function(){
          child.style.transition = `transform 250ms ${EASING}`;
          child.style.transform = '';
        });
      },
      modify: function(){
        if(!elements.channelPane || !elements.channelPane.isConnected) return;
        let channelPane = elements.channelPane, as = site.get.onairChannels(channelPane), now = MinuteStamp.now(), originalSlots = {}/*現在放送中の番組枠ハッシュテーブル*/;
        /* チャンネル要素(as)の正規化 */
        for(let i = 0, a; a = as[i]; i++){
          /* 各aのhrefがchannelsにあるかを確認して、臨時チャンネルaが増えているようならchannelsを更新する */
          if(!channels.some((c) => c.id === a.href.match(/\/([^/]+)$/)[1])) return core.updateChannels(core.channelPane.modify);
          /* アベマが増減させるチャンネルに対応するため、独自に挿入した休止チャンネルは一旦取り除く */
          if(a.dataset.onair === 'false') a.parentNode.removeChild(a);
        }
        as = site.get.onairChannels(channelPane);/*Live Elements じゃないので再取得*/
        if(!as.length) return core.channelPane.observeOnce(core.channelPane.modify);/*まだ空っぽならアベマによる更新を待って再挑戦*/
        /* 各チャンネルの準備 */
        /* (classは公式にclassNameで上書きされてしまうのでdatasetを使う) */
        for(let c = 0, channel; channel = channels[c]; c++){
          let a = site.get.onairChannel(channelPane, channel.id);
          /* 放送中じゃない休止チャンネルも表示させる */
          if(!a){
            a = as[0].cloneNode(true);
            a.dataset.onair = 'false';
            if(core.getProgramNowOnAir(channel.id).endAt < now + PADDINGBEFORE) a.dataset.comming = 'true';/*もうすぐ再開する*/
            a.href = `/now-on-air/${channel.id}`;
            let logo = site.get.channelLogo(a);
            logo.src = logo.src.replace(/\/logo\/(.+?)\.(w[0-9]+)\.([^.]+)/, `/logo/${channel.id}.$2.$3`);
            logo.alt = channel.id;
            as[0].parentNode.insertBefore(a, as[c] || site.get.timetableLinkOnNOA());
            as = site.get.onairChannels(channelPane);/*Live Elements じゃないので再取得*/
          }
          /* 放送中かどうかにかかわらずチャンネルa要素をを用意できたので */
          originalSlots[channel.id] = site.get.nowonairSlot(a);
          a.dataset.channel = channel.id;
          a.dataset.hidden = (configs.c_visibles[channel.id]) ? 'false' : 'true';
          /* クリックでのチャンネル切り替えを core.goChannel が引き受ける */
          if(!a.listening){
            a.listening = true;
            a.addEventListener('click', function(e){
              if(!e.isTrusted) return;/*実クリックのみ*/
              e.preventDefault();
              e.stopPropagation();
              if(a.dataset.onair === 'false' && a.dataset.comming !== 'true') return;/*休止チャンネルで再開もまだならなにもしない*/
              core.goChannel(channel.id);/*その後の処理もすべておまかせ*/
            });
          }
          /* 現在のチャンネルをハイライト */
          if(location.href.endsWith(a.href)){
            a.dataset.current = 'true';
          }else if(a.dataset.current){
            delete a.dataset.current;
          }
        }
        /* サムネイルサイズの固定値(vw)を求めておく */
        if(!sizes.channelPane) core.channelPane.getThumbWidth();
        /* 番組枠を1時間分だけ並べる */
        let end = now + HOUR, ratio = (sizes.channelPane.offsetWidth - sizes.channelPane.thumbWidth) / HOUR, vw = 100 / sizes.window.innerWidth;
        for(let c = 0, channel; channel = channels[c]; c++){
          let originalSlot = originalSlots[channel.id], parent = originalSlot.parentNode, thumbnail = parent.firstElementChild;
          for(let p = 0, program; program = channel.programs[p]; p++){
            /* 現在からendまでの番組のみ表示させる */
            if(program.endAt < now) continue;/*過去*/
            if(end < program.startAt) break;/*未来*/
            let slot = parent.querySelector(`[data-once="${program.id}"]`);
            if(!slot){
              slot = originalSlot.cloneNode(true);
              slot.classList.add('slot');
              if(program.noContent) slot.classList.add('nocontent');/*コンテンツなし*/
              /* タイトル */
              let title = site.get.title(slot);
              title.textContent = slot.title = program.title || NOCONTENTS[0];
              Array.from(title.parentNode.children).forEach((node) => {
                if(node !== title) title.parentNode.removeChild(node);/*マークをいったん取り除く*/
              });
              Program.appendMarks(title, program.marks);
              /* 放送時間と通知 */
              let duration = site.get.duration(slot);
              duration.textContent = program.timeString;
              slot.dataset.once = program.id;
              if(program.repeat) slot.dataset.repeat = program.repeat;
              if(Notifier.match(program.id)) slot.classList.add('active');
              if(now < program.startAt && !program.noContent) duration.parentNode.insertBefore(Notifier.createButton(program), duration);
              /* 完成したので */
              originalSlot.parentNode.appendChild(slot);
            }
            if(program.startAt <= now){/*現在放送中*/
              while(originalSlot.nextElementSibling !== slot) parent.removeChild(originalSlot.nextElementSibling);/*終了番組をクリアする*/
              if(!slot.classList.contains('nowonair')) slot.classList.add('nowonair');
              thumbnail.title = program.title;/*サムネイルのツールチップ*/
              /* 要素幅 */
              slot.style.left = sizes.channelPane.thumbOffsetWidth * vw + 'vw';
              slot.style.width = (program.duration - (now - program.startAt)) * ratio * vw + 'vw';
            }else{/* 後続番組 */
              if(slot.classList.contains('nowonair')) slot.classList.remove('nowonair');
              /* 要素幅 */
              slot.style.left = (sizes.channelPane.thumbOffsetWidth + ((program.startAt - now) * ratio)) * vw + 'vw';
              slot.style.width = (program.duration) * ratio * vw + 'vw';
            }
          }
        }
        /* 公式番組表リンク */
        let timetableLink = site.get.timetableLinkOnNOA();
        if(!timetableLink) return log('Not found: timetableLink');
        core.abemaTimetable.link(timetableLink);
      },
      getThumbWidth: function(){
        /* サイズ計測は重い処理なので極力呼びたくない */
        let channelPane = elements.channelPane, thumbnail = site.get.thumbnail(channelPane);
        sizes.channelPane = {
          offsetWidth: channelPane.offsetWidth,
          thumbWidth: thumbnail.clientWidth,
          thumbOffsetWidth: thumbnail.parentNode.parentNode.parentNode.offsetWidth,
        }
      },
    },
    abemaTimetable: {
      initialize: function(){
        let button = site.get.abemaTimetableButton();
        if(!button) return setTimeout(core.abemaTimetable.initialize, 1000);
        core.abemaTimetable.link(button);
      },
      link: function(element){
        if(configs.replace){
          if(element.dataset.replaced === 'true') return;
          element.addEventListener('click', core.abemaTimetable.buttonListener);
          element.dataset.replaced = 'true';
        }else{
          if(element.dataset.replaced === 'false') return;
          element.removeEventListener('click', core.abemaTimetable.buttonListener);
          element.dataset.replaced = 'false';
        }
      },
      openOnAbemaTimetable: function(){
        html.classList.add('abemaTimetable');
        core.abemaTimetable.showSplash();
        core.timetable.show();
        core.timetable.addHiddenListener('closeOnAbemaTimetable', core.abemaTimetable.closeOnAbemaTimetable);
        elements.abemaTimetableButtonClone.classList.add('disabled');
      },
      closeOnAbemaTimetable: function(e){
        sequence(function(){
          core.abemaTimetable.dimSplash();
        }, ABEMATIMETABLEDURATION, function(){
          html.classList.remove('abemaTimetable');
        });
        elements.abemaTimetableButtonClone.classList.remove('disabled');
      },
      buttonListener: function(e){
        /* 既に番組表ページにいるならすぐ開く */
        if(core.abemaTimetable.beHere()){
          e.preventDefault();
          core.abemaTimetable.openOnAbemaTimetable();
          return;
        }
        /* ふんわり遷移させる */
        if(e.isTrusted){/*実クリック時のみ*/
          e.preventDefault();
          core.abemaTimetable.volumeDown();
          if(elements.closer) elements.closer.click();/*コメントを閉じることでmain消失バグを防ぐ*/
          sequence(function(){
            html.classList.add('abemaTimetable');
            core.abemaTimetable.showSplash();
          }, ABEMATIMETABLEDURATION/*重たい処理に邪魔されず音量をなめらかに下げる猶予*/, function(){
            core.timetable.show();
            elements.abemaTimetableButtonClone.classList.add('disabled');
            core.timetable.addHiddenListener('closeOnAbemaTimetable', core.abemaTimetable.closeOnAbemaTimetable);
          }, 1000/*映像も隠し音量も下げたので、重たい公式番組表ページに移動するのは落ち着いたあとでよい*/, function(){
            elements.abemaTimetableButton.click();
          });
        }
      },
      volumeDown: function(){
        /* 音量ダウンの耳心地ベストを検証した末のeaseout */
        let media = Array.from([...$$('video[src]'), ...$$('audio[src]')]), step = 10, begin = Date.now();
        let easeoutDown = (now, original) => original * Math.pow(1 - atMost(((now - begin) / ABEMATIMETABLEDURATION), 1), 2);/* (1-X)^2 */
        if(!media.length) return;
        /* 元音量 */
        for(let i = 0; media[i]; i++){
          media[i].originalVolume = media[i].volume;
        }
        /* 音量ダウンタイマーを一気に設置(intervalに比べてタイミングが乱れにくい) */
        for(let s = 1; s <= step; s++){
          setTimeout(function(){
            for(let i = 0; media[i]; i++){
              if(s === step) media[i].volume = 0;
              else media[i].volume = easeoutDown(Date.now(), media[i].originalVolume);
            }
          }, ABEMATIMETABLEDURATION * (s/step));
        }
      },
      goChannel: function(id){
        /* 目的チャンネルで現在放送中の番組を番組表の中から探す */
        let button = site.get.abemaTimetableSlotButton(id, core.getProgramNowOnAir(id).id);
        if(!button) return location.assign('/now-on-air/' + id);
        /* クリックして放送ページへのリンクを出現させる */
        button.click();
        setTimeout(function(){/*animateだとdocument.hiddenが明けないと発生しない*/
          let a = site.get.abemaTimetableNowOnAirLink(id);
          if(!a) return location.assign('/now-on-air/' + id);
          /* ついに念願のチャンネル切り替えイベントを流用できるa要素を手に入れた */
          a.click();
          /* 放送中のチャンネルに移動するときは番組表を閉じる */
          sequence(1000/*ページ遷移に時間がかかるので慌てて番組表を閉じずに*/, function(){
            core.abemaTimetable.dimSplash();
            core.timetable.hide();
          }, ABEMATIMETABLEDURATION, function(){
            html.classList.remove('abemaTimetable');
          });
        }, 0);
      },
      showSplash: function(){
        if(elements.splash) elements.splash.firstElementChild.animate([{opacity: '0'}, {opacity: '1'}], {duration: ABEMATIMETABLEDURATION, fill: 'forwards'});
      },
      dimSplash: function(){
        if(elements.splash) elements.splash.firstElementChild.animate([{opacity: '1'}, {opacity: '0'}], {duration: ABEMATIMETABLEDURATION, fill: 'forwards'});
      },
      beHere: function(){
        return location.href.startsWith('https://abema.tv/timetable');
      },
    },
    timetable: {
      createButton: function(){
        let timetableButton = elements.timetableButton = elements.channelButton.cloneNode(true), channelButton = elements.channelButton;
        timetableButton.dataset.selector = SCRIPTNAME + 'Button';
        timetableButton.title = SCRIPTNAME + ' 番組表';
        timetableButton.setAttribute('aria-label', SCRIPTNAME);
        timetableButton.appendChild(timetableButton.firstElementChild.cloneNode(true));/*アイコンをダブルに*/
        timetableButton.addEventListener('click', core.timetable.toggle, true);
        channelButton.parentNode.insertBefore(timetableButton, channelButton.nextElementSibling);
      },
      show: function(){
        let timetablePanel = elements.timetablePanel || core.timetable.createPanel(), listPane = elements.listPane;
        core.panel.show(timetablePanel);
        animate(function(){
          core.timetable.shiftTimetable();
          if(timetablePanel.hiddenTime < Date.now() - TIMETABLERESETTIME){
            core.timetable.showProgramData(core.getProgramNowOnAir());
            core.timetable.scrollTo(MinuteStamp.now());
            if(elements.searchInput.value !== '') elements.searchInput.value = '';
            if(listPane.classList.contains('active')) listPane.classList.remove('active');
            if(notifications.programs.length) elements.notificationsButton.click();
          }
        });
      },
      hide: function(){
        let timetablePanel = elements.timetablePanel, listeners = timetablePanel.hiddenListeners;
        core.panel.hide(timetablePanel);
        Object.keys(listeners).forEach((key) => listeners[key]());
      },
      toggle: function(){
        core.panel.toggle(elements.timetablePanel || core.timetable.createPanel(), core.timetable.show, core.timetable.hide);
      },
      createPanel: function(){
        let timetablePanel = elements.timetablePanel = createElement(core.html.timetablePanel());
        timetablePanel.querySelector('button.ok').addEventListener('click', core.timetable.hide);
        core.timetable.buildTimes();
        core.timetable.buildDays();/*先に作ったtimesのdisable判定を含む*/
        core.timetable.buildTimetable();
        core.timetable.listPane.build();
        core.config.createButton();
        core.timetable.listenSelection();
        core.timetable.listenMousewheel();
        setTimeout(core.timetable.setupScrolls, 1000);
        core.timetable.addHiddenListener('hiddenTime', function(e){
          timetablePanel.hiddenTime = Date.now();/*閉じても一定時間以内なら内容を覚えておく機能を実現する*/
        });
        timetablePanel.keyAssigns = {
          'Escape': core.timetable.hide,
        };
        if(notifications.programs.length) elements.notificationsButton.click();
        return timetablePanel;
      },
      buildDays: function(){
        if(!elements.timetablePanel) return;
        let now = new Date(), starts = [], today = MinuteStamp.justToday();
        let getDay = (d) => EDAYS[d.getDay()];
        let formatDate = (d) => `${d.getMonth() + 1}月${d.getDate()}日(${JDAYS[d.getDay()]})`;
        let formatDay = (d) => `${d.getDate()}${JDAYS[d.getDay()]}`;
        let disableTimes = function(){
          let past = MinuteStamp.past();
          let inputs = elements.timetablePanel.querySelectorAll('nav .times input:not(.template)');
          for(let i = 0; inputs[i]; i++){
            if(parseInt(inputs[i].value*HOUR) < past) inputs[i].disabled = true;
          }
        };
        for(let t = 0, y = now.getFullYear(), m = now.getMonth(), d = now.getDate(); t <= TERM; t++) starts.push(new Date(y, m, d + t));
        let days = elements.days = elements.timetablePanel.querySelector('nav .days');
        let templates = {input: days.querySelector('input.template'), label: days.querySelector('label.template')};
        while(days.children.length > 2/*template*2*/) days.removeChild(days.children[0]);
        for(let i = 0; starts[i]; i++){
          let time = parseInt(starts[i].getTime() / 1000);
          let input = templates.input.cloneNode(true);
          let label = templates.label.cloneNode(true);
          input.classList.remove('template');
          label.classList.remove('template');
          input.id = 'day-' + time;
          input.value = time;
          input.checked = (i === 0);
          input.addEventListener('click', function(e){
            let past = MinuteStamp.past();
            let checked = elements.timetablePanel.querySelector('nav .times input:checked');
            let start = time;
            let delta = (!checked) ? past : (checked.value*HOUR);
            core.timetable.buildTimetable(start + delta);
            core.timetable.scrollTo(start + delta);
          });
          input.addEventListener('change', function(e){
            if(i === 0) return disableTimes();
            elements.timetablePanel.querySelectorAll('nav .times input:disabled').forEach((input) => input.disabled = false);
          });
          label.setAttribute('for', input.id);
          label.classList.add(getDay(starts[i]));
          label.firstElementChild.textContent = (i === 0) ? formatDate(starts[i]) : formatDay(starts[i]);
          days.insertBefore(input, templates.input);
          days.insertBefore(label, templates.input);
        }
        disableTimes();/*初期化*/
      },
      buildTimes: function(){
        if(!elements.timetablePanel) return;
        let deltas = TIMES, past = MinuteStamp.past(), today = MinuteStamp.justToday();
        let times = elements.times = elements.timetablePanel.querySelector('nav .times');
        let templates = {input: times.querySelector('input.template'), label: times.querySelector('label.template')};
        while(times.children.length > 2/*template*2*/) times.removeChild(times.children[0]);
        for(let i = 0; deltas[i] !== undefined/*0も入ってるので*/; i++){
          let input = templates.input.cloneNode(true);
          let label = templates.label.cloneNode(true);
          input.classList.remove('template');
          label.classList.remove('template');
          input.id = 'time-' + deltas[i];
          input.value = deltas[i];
          input.addEventListener('click', function(e){
            let checked = elements.timetablePanel.querySelector('nav .days input:checked');
            let start = (checked.value === 'now') ? today : parseInt(checked.value);
            let delta = deltas[i]*HOUR;
            core.timetable.buildTimetable(start + delta);
            core.timetable.scrollTo(start + delta);
          });
          label.setAttribute('for', input.id);
          label.firstElementChild.textContent = deltas[i] + ':00';
          times.insertBefore(input, templates.input);
          times.insertBefore(label, templates.input);
        }
      },
      setupScrolls: function(){
        if(!elements.timetablePanel) return;
        let channelsUl = elements.channelsUl, scrollers = elements.scrollers = elements.timetablePanel.querySelector('.scrollers');
        let timetableButton = elements.abemaTimetableButtonClone, nowButton = elements.nowButton;
        /* スクロールボタン */
        let left = elements.scrollerLeft = scrollers.querySelector('.left'), right = elements.scrollerRight = scrollers.querySelector('.right');
        let listPane = elements.listPane;
        right.addEventListener('click', function(e){
          if(listPane.classList.contains('active')) return listPane.classList.remove('active');/*検索ペインを閉じるボタンとして機能させる*/
          core.timetable.scrollTo(channelsUl.scrollTime + HOUR);
        });
        left.addEventListener('click', function(e){
          core.timetable.scrollTo(channelsUl.scrollTime - HOUR);
        });
        right.classList.remove('disabled');
        /* スクロール先の時間帯で番組表示 */
        channelsUl.addEventListener('scroll', function(e){
          if(channelsUl.scrolling) return;
          channelsUl.scrolling = true;
          setTimeout(function(){
            let now = MinuteStamp.now(), past = MinuteStamp.past(), range = (TERM + 1)*DAY - past;
            let start = now + ((channelsUl.scrollLeft / channelsUl.scrollWidth) * range);
            core.timetable.buildTimetable(start);
            channelsUl.scrolling = false;
            /* バウンシングエフェクト */
            let scrollLeftMax = channelsUl.scrollWidth - channelsUl.clientWidth;
            if(channelsUl.scrollLeft === 0) channelsUl.scrollLeft = BOUNCINGPIXEL;
            else if(channelsUl.scrollLeft === scrollLeftMax) channelsUl.scrollLeft = scrollLeftMax - BOUNCINGPIXEL;
            /* Days/Timesの切り替え */
            let days = elements.timetablePanel.querySelectorAll('nav .days input:not(.template)');
            for(let i = 1; days[i]; i++){
              if(start < parseInt(days[i].value)){
                days[i - 1].checked = true;
                days[i - 1].dispatchEvent(new Event('change'));
                break;
              }else if(i === days.length - 1){
                days[i].checked = true;
                days[i].dispatchEvent(new Event('change'));
              }
            }
            let times = elements.timetablePanel.querySelectorAll('nav .times input:not(.template)');
            for(let i = 1; times[i]; i++){
              if(((start + MINUTE/*1分タイマーシフトのズレをカバー*/ + JST) % DAY) / HOUR < parseInt(times[i].value)){
                times[i - 1].checked = true;
                break;
              }else if(i === times.length - 1){
                times[i].checked = true;
              }
            }
            /* 現在時刻にいるかどうか */
            let isLeftMost = (channelsUl.scrollLeft <= BOUNCINGPIXEL);
            /* アベマ公式番組表ボタン */
            if(!core.abemaTimetable.beHere()){
              if(isLeftMost) timetableButton.classList.remove('disabled');
              else if(!timetableButton.classList.contains('disabled')) timetableButton.classList.add('disabled');
            }
            /* 現在時刻に戻るボタン */
            if(isLeftMost) nowButton.classList.add('disabled');
            else if(nowButton.classList.contains('disabled')) nowButton.classList.remove('disabled');
            /* スクロールボタンの切り替え */
            if(isLeftMost) left.classList.add('disabled');
            else if(left.classList.contains('disabled')) left.classList.remove('disabled');
            if(channelsUl.scrollLeft === scrollLeftMax - BOUNCINGPIXEL) right.classList.add('disabled');
            else if(right.classList.contains('disabled')) right.classList.remove('disabled');
          }, 100);
        }, {passive: true});/*Passive Event Listener*/
      },
      buildTimetable: function(start = MinuteStamp.now()){
        let now = MinuteStamp.now(), past = MinuteStamp.past(), range = (configs.span*HOUR), ratio = (100 - NAMEWIDTH) / (configs.span*HOUR);
        let fullwidth = (((TERM + 1)*DAY - past) / range) * (100 - NAMEWIDTH) + 'vw';
        let timetablePanel = elements.timetablePanel, channelsUl = elements.channelsUl = timetablePanel.querySelector('.channels');
        let show = function(element){
          element.classList.remove('hidden');
          element.addEventListener('transitionend', function(e){
            element.classList.remove('animate');
          }, {once: true});
        };
        channelsUl.scrollTime = start;/*スクロール用に保持しておく*/
        /* 時間帯(目盛りになるので一括して全部作る) */
        let timeLi = channelsUl.querySelector('.channels > .time'), timesUl = timeLi.querySelector('.times');
        timeLi.style.width = fullwidth;
        if(timesUl.children.length === 2/*templatesしかない*/){
          /* アベマ公式番組表ボタンのクローン */
          let abemaTimetableButtonClone = elements.abemaTimetableButtonClone = timeLi.querySelector('button.abemaTimetable');
          abemaTimetableButtonClone.addEventListener('click', core.abemaTimetable.buttonListener);
          if(!core.abemaTimetable.beHere()) abemaTimetableButtonClone.classList.remove('disabled');
          /* 現在時刻に戻るボタン */
          let nowButton = elements.nowButton = timeLi.querySelector('button.now');
          nowButton.addEventListener('click', function(e){
            core.timetable.scrollTo(MinuteStamp.now());
          });
          /* 時と日を生成 */
          let ht = timesUl.querySelector('.hour.template'), dt = timesUl.querySelector('.day.template');
          for(let hour = now - (start - range)%HOUR; hour < now - past + (TERM+1)*DAY; hour += HOUR){
            /* 時を作成 */
            let hourLi = ht.cloneNode(true);
            hourLi.classList.remove('template');
            hourLi.startAt  = hour;
            hourLi.endAt    = hour + HOUR;
            hourLi.duration = HOUR;
            hourLi.style.left = atLeast(0, (hour - now) * ratio) + 'vw';
            hourLi.style.width = ((hour < now) ? HOUR - (now%HOUR) : HOUR) * ratio + 'vw';
            hourLi.addEventListener('click', function(e){
              core.timetable.scrollTo(hour);
            });
            let oclock = (((hour+JST)%DAY)/HOUR);
            if(hour < now){
              hourLi.classList.add('nowonair');
              hourLi.querySelector('.time').appendChild(MinuteStamp.timeToClock(now));
            }else{
              hourLi.querySelector('.time').textContent = oclock + ':00';
            }
            timesUl.insertBefore(hourLi, ht);
            /* 日を作成 */
            if(hour < now || oclock === 0){
              let dayLi = dt.cloneNode(true);
              dayLi.classList.remove('template');
              dayLi.startAt  = (hour < now) ? (now - past) : hour;
              dayLi.endAt    = (hour < now) ? (now - past) + DAY : (hour + DAY);
              dayLi.duration = DAY;
              dayLi.style.left = atLeast(0, (hour - now) * ratio) + 'vw';
              dayLi.style.width = (((hour < now) ? (DAY - past) : DAY) * ratio) + 'vw';
              dayLi.querySelector('.date').textContent = MinuteStamp.shortestDateToString(hour);
              timesUl.insertBefore(dayLi, hourLi);
            }
          }
          animate(show.bind(null, timeLi));
        }
        /* スワイプによるブラウザバックを防ぐためにバウンシングエフェクトを作る */
        if(start === now) animate(() => channelsUl.scrollLeft = BOUNCINGPIXEL);
        /* 各チャンネル */
        let final;/*最後のチャンネルの判定に使う*/
        for(let c = channels.length - 1, channel; channel = channels[c]; c--){
          if(!configs.c_visibles[channel.id]) continue;
          final = c;
          break;
        }
        for(let c = 0, delay = 0, channel; channel = channels[c]; c++){
          if(!configs.c_visibles[channel.id]) continue;
          let channelLi = document.getElementById('channel-' + channel.id), currentChannelId = core.getCurrentChannelId();
          if(!channelLi){
            channelLi = channelsUl.querySelector('.channel.template').cloneNode(true);
            channelLi.classList.remove('template');
            channelLi.id = 'channel-' + channel.id;
            if(channel.id === currentChannelId) channelLi.classList.add('current');
            channelLi.querySelector('.name').textContent = channel.name;
            channelLi.querySelector('header').addEventListener('click', function(e){
              /* 間もなく再開する休止チャンネルをクリッカブルにすると番組表が閉じてしまうのでここではやらない */
              core.timetable.showProgramData(core.getProgramNowOnAir(channel.id));/*移り変わるのでつど取得*/
              animate(function(){core.goChannel(channel.id)});
            });
            channelsUl.insertBefore(channelLi, channelsUl.lastElementChild);
          }
          channelLi.style.width = fullwidth;
          let programsUl = channelLi.querySelector('.programs');
          clearTimeout(channelLi.timer), channelLi.timer = setTimeout(function(){/*非同期処理にする*/
            /* 表示済みの番組要素の再利用と削除 */
            let programLis = programsUl.querySelectorAll('.program:not(.template)');/*nowonairや最初の一画面だけ残す手もるけどshiftTimetableが複雑化するので保留*/
            for(let i = 0, li; li = programLis[i]; i++){
              if(li.endAt <= start - range/2 || start + range + range < li.startAt) programsUl.removeChild(li);
            }
            /* 各番組 */
            for(let p = 0, program; program = channel.programs[p]; p++){
              if(document.getElementById('program-' + program.id)) continue;/*表示済み*/
              if(program.endAt <= now) continue;/*現在より過去*/
              if(program.endAt <= start - range/2) continue;/*表示範囲より過去*/
              if(start + range + range <= program.startAt) break;/*表示範囲より未来(以降は処理不要)*/
              /* programLiを作成 */
              let programLi = programsUl.querySelector('.program.template').cloneNode(true);
              programLi.classList.remove('template');
              programLi.id = 'program-' + program.id;
              programLi.dataset.once = program.id;
              if(program.repeat) programLi.dataset.repeat = program.repeat;
              if(program.noContent) programLi.classList.add('nocontent');
              let time = programLi.querySelector('.time'), title = programLi.querySelector('.title');
              /* 時刻と通知ボタン */
              time.textContent = program.startAtString;
              programLi.insertBefore(Notifier.createButton(program), time);
              /* タイトル */
              title.textContent = program.title || NOCONTENTS[0];
              if(program.padding){/*空き枠*/
                programLi.classList.add('padding');
              }else{
                if(Notifier.match(program.id)) programLi.classList.add('active');
                Program.appendMarks(title, program.marks);
                programLi.addEventListener('click', function(e){
                  /* 2度目のクリック時のみ番組開始時刻にスクロールさせる */
                  if(elements.programDiv && elements.programDiv.programData.id === program.id){/*shownクラスがなぜか判定に使えないので*/
                    core.timetable.scrollTo(program.startAt);
                  }
                  core.timetable.showProgramData(program);
                });
              }
              /* 番組の幅を決める */
              programLi.startAt  = program.startAt;
              programLi.endAt    = program.endAt;
              programLi.duration = program.duration;
              if(program.startAt <= now){/*現在放送中*/
                programLi.classList.add('nowonair');
                programLi.style.left = '0vw';
                programLi.style.width = (program.duration - (now - program.startAt)) * ratio + 'vw';
                if(program.padding) channelLi.classList.add('notonair');
                /* 番組情報が空欄なら現在視聴中の番組情報を表示 */
                if(channel.id === currentChannelId && timetablePanel.querySelector('.panel > .program.nocontent')) core.timetable.showProgramData(program);
              }else{/*後続番組*/
                programLi.style.left = (program.startAt - now) * ratio + 'vw';
                programLi.style.width = (program.duration) * ratio + 'vw';
              }
              programsUl.insertBefore(programLi, programsUl.lastElementChild);
              animate(function(){programLi.classList.remove('hidden')});
            }
            /* 最後に1度だけ */
            if(c === final && timetablePanel){
              for(let i = 0, channelLis = channelsUl.querySelectorAll('.channel:not(.template)'); channelLis[i]; i++){
                if(channelLis[i].classList.contains('hidden')) show(channelLis[i]);/*一斉に表示*/
              }
              animate(core.timetable.fitWidth);
              let program = timetablePanel.querySelector('.panel > .program').programData;/*番組詳細*/
              if(program) core.timetable.highlightProgram(program);/*緑色に*/
            }
          }, (delay++) * (1000/60));
        }
      },
      rebuildTimetable: function(){
        if(!elements.timetablePanel || !elements.timetablePanel.isConnected) return;
        let channelsUl = elements.channelsUl = elements.timetablePanel.querySelector('.channels');
        for(let i = 0, channelLis = channelsUl.querySelectorAll('.channel:not(.template)'); channelLis[i]; i++){
          channelLis[i].parentNode.removeChild(channelLis[i]);
        }
        core.timetable.buildTimetable(channelsUl.scrollTime);
      },
      scrollTo: function(start){
        let past = MinuteStamp.past(), range = (TERM + 1)*DAY - past, today = MinuteStamp.justToday(), ratio = (start - (today + past)) / range;
        let channelsUl = elements.channelsUl, scrollLeftMax = channelsUl.scrollWidth - channelsUl.clientWidth;
        let to = between(0, channelsUl.scrollWidth * ratio, scrollLeftMax), gap = to - channelsUl.scrollLeft;
        if(gap === 0) return;
        channelsUl.scrollTime = start;
        let streams = channelsUl.querySelectorAll('li:not(.template) > .stream'), count = 0;
        for(let i = 0; streams[i]; i++){
          streams[i].style.willChange = 'transform';
          streams[i].style.transition = 'transform 1s ease';
        }
        animate(function(){
          for(let i = 0; streams[i]; i++){
            streams[i].style.transform = `translateX(${-gap}px)`;
          }
        });
        streams[streams.length - 1].addEventListener('transitionend', function(e){/*疑似スクロールを破綻させないようにタイミングを一致させる*/
          for(let i = 0; streams[i]; i++){
            streams[i].style.willChange = '';
            streams[i].style.transition = 'none';/*scrollLeftを即反映させる*/
            streams[i].style.transform = '';
          }
          channelsUl.scrollLeft = Math.ceil(to)/*borderズレを常に回避する*/;
        }, {once: true});
      },
      shiftTimetable: function(){
        /* 毎分必ず呼ばれる関数である */
        let timetablePanel = elements.timetablePanel, channelsUl = elements.channelsUl;
        if(!timetablePanel || !timetablePanel.isConnected || timetablePanel.classList.contains('hidden')) return;
        /* 画面が隠れてたらサボるけど、現れた瞬間に一度だけ更新する */
        if(document.hidden){
          if(document.shiftTimetable) return;/*重複防止*/
          document.shiftTimetable = true;
          document.addEventListener('visibilitychange', function(){
            document.shiftTimetable = false;
            core.timetable.shiftTimetable();
          }, {once: true});
          return;
        }
        const change = function(element, left, width, callback){
          if(channelsUl.scrollLeft <= BOUNCINGPIXEL && left < 100){
            element.style.willChange = 'left';
            element.style.transition = 'left 1000ms ease, width 1000ms ease, background 1000ms ease, filter 1000ms ease, padding-left 500ms ease 1000ms';
            animate(function(){
              element.style.left = left + 'vw';
              if(left === 0) element.style.width = width + 'vw';
              element.addEventListener('transitionend', function(e){
                element.style.willChange = '';
                element.style.transition = '';
                if(callback) callback();
              }, {once: true});
            });
          }else{
            element.style.left = left + 'vw';
            if(left === 0) element.style.width = width + 'vw';
            if(callback) callback();
          }
        };
        let now = MinuteStamp.now(), past = MinuteStamp.past(), end = now + (configs.span*HOUR), ratio = (100 - NAMEWIDTH) / (configs.span*HOUR);
        /* 各チャンネル */
        let channelLis = channelsUl.querySelectorAll('.channels > li:not(.template)');
        let oldWidth = channelLis[0].scrollWidth, newlWidthVW = (((TERM + 1)*DAY - past) / (configs.span*HOUR)) * (100 - NAMEWIDTH);
        for(let c = 0, channelLi; channelLi = channelLis[c]; c++){
          channelLi.style.width = newlWidthVW + 'vw';/*チャンネル自体の幅を狭める*/
          /* 各番組 */
          let slots = channelLi.querySelectorAll('.slot:not(.template)');
          for(let s = 0, slotLi; slotLi = slots[s]; s++){
            let startAt = slotLi.startAt, endAt = slotLi.endAt, duration = slotLi.duration;
            switch(true){
              case(endAt <= now):/*放送終了*/
                change(slotLi, 0, 0, function(e){
                  if(slots[s + 1]){/*必ずしも隣じゃないけどレアケースなので*/
                    Slot.highlight(slots[s + 1], 'add', 'nowonair');
                    if(slotLi.classList.contains('shown')) slots[s + 1].click();
                  }
                  if(slotLi.isConnected) Slot.highlight(slotLi, 'remove', 'nowonair'), slotLi.parentNode.removeChild(slotLi);
                  if(channelLi.classList.contains('notonair')) channelLi.classList.remove('notonair');
                });
                break;
              case(startAt <= now):/*現在放送中*/
                change(slotLi, 0, (duration - (now - startAt)) * ratio);
                /* 現在時刻更新 */
                if(slotLi.classList.contains('hour')){
                  let time = slotLi.querySelector('.time');
                  time.replaceChild(MinuteStamp.timeToClock(now), time.firstChild);
                }
                break;
              case(startAt < end):/*後続番組*/
              default:/*画面外*/
                change(slotLi, (startAt - now) * ratio, duration * ratio);
                break;
            }
          }
        }
        /* 短くなったぶんだけスクロールする */
        if(oldWidth < channelLis[0].scrollWidth) oldWidth += ((DAY * ratio) * sizes.window.innerWidth) /100;/*日付が変わったときだけは1日分長くなるので*/
        channelsUl.scrollLeft = atLeast(BOUNCINGPIXEL, channelsUl.scrollLeft - (oldWidth - channelLis[0].scrollWidth));
        /* 現在時刻にいるときは長時間放置で後続番組がなくならないように再構築させる */
        if(channelsUl.scrollLeft === BOUNCINGPIXEL) setTimeout(function(){core.timetable.buildTimetable(channelsUl.scrollTime = now)}, 1000);
      },
      showProgramData: function(program){
        /* timetable */
        let shown = elements.timetablePanel.querySelector('.channels .shown'), show = document.getElementById('program-' + program.id);
        if(shown) shown.classList.remove('shown');
        if(show)  show.classList.add('shown');
        /* programDiv */
        let programDiv = elements.programDiv = elements.timetablePanel.querySelector('.panel > .program');
        programDiv.scrollTop = 0;
        if(programDiv.classList.contains('nocontent')) programDiv.classList.remove('nocontent');
        else programDiv.animate([{opacity: 0}, {opacity: 1}], {duration: 250, easing: 'ease-out'});
        programDiv.programData = program;/*番組表をハイライトするタイミングで活用*/
        /* title */
        let title = programDiv.querySelector('.title');
        title.textContent = program.title;
        Array.from(title.parentNode.children).forEach((node) => {
          if(node !== title) title.parentNode.removeChild(node);/*マークをいったん取り除く*/
        });
        Program.appendMarks(title, program.marks);
        /* thumbnails */
        let thumbnailsDiv = programDiv.querySelector('.thumbnails');
        while(thumbnailsDiv.children.length) thumbnailsDiv.removeChild(thumbnailsDiv.children[0]);
        if(program.thumbImg){
          thumbnailsDiv.appendChild(new Thumbnail(program.displayProgramId, program.thumbImg, 'large').node);
        }
        for(let i = 0; program.sceneThumbImgs[i]; i++){
          thumbnailsDiv.appendChild(new Thumbnail(program.displayProgramId, program.sceneThumbImgs[i]).node);
        }
        /* summary */
        let summaryDiv = programDiv.querySelector('.summary');
        summaryDiv.querySelector('.channel').textContent = program.channel.name;
        let dateP = summaryDiv.querySelector('.date');
        dateP.querySelector('span').textContent = program.dateString;
        summaryDiv.querySelector('.highlight').textContent = program.detailHighlight;
        /* links */
        let linksUl = summaryDiv.querySelector('.links');
        while(linksUl.children.length > 1/*template*/) linksUl.removeChild(linksUl.firstElementChild);
        if(program.links){
          linksUl.classList.remove('inactive');
          let templateLi = linksUl.querySelector('.template');
          for(let i = 0; program.links[i]; i++){
            let li = templateLi.cloneNode(true), a = li.querySelector('a');
            li.classList.remove('template');
            a.href = program.links[i].value;
            a.textContent = program.links[i].title;
            linksUl.insertBefore(li, templateLi);
          }
        }else{
          linksUl.classList.add('inactive');
        }
        /* myvideo */
        let now = MinuteStamp.now(), timeshiftHTML = (now < program.endAt) ? program.timeshiftString : program.timeshiftRemainsHTML;
        let timeshiftP = summaryDiv.querySelector('.timeshift');
        if(timeshiftHTML !== ''){
          timeshiftP.classList.remove('inactive');
          timeshiftP.querySelector('span').innerHTML/*プレミアム誘導リンクが入るので*/ = timeshiftHTML;
          while(timeshiftP.children.length > 1/*template*/) timeshiftP.removeChild(timeshiftP.firstElementChild);
          let myvideoButton = MyVideo.createMyVideoButton(program);
          timeshiftP.insertBefore(myvideoButton, timeshiftP.firstElementChild);
        }else{
          timeshiftP.classList.add('inactive');
        }
        /* group and series */
        let results = [], count = {};
        ['group', 'series'].forEach((key, i) => {
          /* 一致program取得 */
          for(let c = 0; channels[c]; c++){
            for(let p = 0; channels[c].programs[p]; p++){
              if(channels[c].programs[p].endAt < now) continue;/*終了した番組は表示しない*/
              if(channels[c].programs[p][key] && channels[c].programs[p][key] === program[key]){
                if(1 <= i && results.some((result) => result.id === channels[c].programs[p].id)) continue;/*重複させない*/
                results.push(channels[c].programs[p]);
                count[key] = count[key] + 1 || 1;
              }
            }
          }
          if(results.length === 1) results.pop(results[0]);/*自分自身の番組しかなければ取り除く*/
          else if(1 <= i && !count[key]) while(results.length) results.pop(results[0]);/*同じ内容なら繰り返さない*/
          results.sort((a, b) => a.startAt - b.startAt);/*日付順*/
          /* タイトルの重複文字列を省略する準備 */
          let shorten;
          if(results.every((r) => r.title === program.title)){
            shorten = () => '同';
          }else{
            /* 区切り文字は/(?=\s)/とし、全タイトル共通文字列と、半数以上のタイトルに共通する文字列を削除する */
            let parts = program.title.split(/(?=\s)/), former = {all: '', majority: ''}, latter = {all: '', majority: ''}, n = '\n';
            /* 前方一致部分文字列 */
            for(let i = 0; parts[i]; i++) if(results.every((r) => r.title.startsWith(former.all + parts[i]))) former.all += parts[i];
            for(let i = 0; parts[i]; i++) if(results.filter((r) => r.title.startsWith(former.majority + parts[i])).length >= results.length/2) former.majority += parts[i];
            /* 後方一致部分文字列 */
            for(let i = parts.length - 1; parts[i]; i--) if(results.every((r) => r.title.endsWith(parts[i] + latter.all))) latter.all = parts[i] + latter.all;
            for(let i = parts.length - 1; parts[i]; i--) if(results.filter((r) => r.title.endsWith(parts[i] + latter.majority)).length >= results.length/2) latter.majority = parts[i] + latter.majority;
            /* 削りすぎを回避する */
            if((former.majority + latter.majority).length >= program.title.length) former.majority = '';
            if((former.majority + latter.majority).length >= program.title.length) latter.majority = '';
            shorten = (title) => (title + n).replace(former.majority, '').replace(former.all, '').replace(latter.majority + n, n).replace(latter.all + n, n).trim();
          }
          /* 放送予定リストDOM構築 */
          let div = summaryDiv.querySelector(`.${key}`), ul = div.querySelector(`.${key} ul`), templateLi = ul.querySelector('.template');
          if(1 <= i && !results.length) div.classList.add('inactive');
          else div.classList.remove('inactive');
          while(ul.children.length > 1/*template*/) ul.removeChild(ul.children[0]);
          if(results.length === 0){
            let li = templateLi.cloneNode(true);
            li.classList.remove('template');
            li.textContent = '-';
            ul.insertBefore(li, templateLi);
          }else{
            for(let p = 0, result; result = results[p]; p++){
              let li = templateLi.cloneNode(true), header = li.querySelector('header');
              li.classList.remove('template');
              if(program.id === result.id) li.classList.add('current');
              else header.addEventListener('click', function(e){
                core.timetable.showProgramData(result);
                core.timetable.scrollTo(result.startAt);
              });
              header.insertBefore(Notifier.createButton(result), header.firstElementChild);
              li.querySelector('.date').textContent = result.justifiedStartAtShortDateString;
              let title = li.querySelector('.title');
              title.textContent = shorten(result.title);
              Program.appendMarks(title, result.marks);
              ul.insertBefore(li, templateLi);
            }
          }
        });
        /* 1回通知  */
        while(dateP.children.length > 1) dateP.removeChild(dateP.firstElementChild);
        let button = Notifier.createButton(program);
        dateP.insertBefore(button, dateP.firstElementChild);
        /* 毎回通知 */
        let h3 = summaryDiv.querySelector('h3');
        while(h3.children.length > 1) h3.removeChild(h3.firstElementChild);
        if(program.repeat){
          let repeatButton = Notifier.createRepeatAllButton(program);
          h3.insertBefore(repeatButton, h3.firstElementChild);
        }
        /* content */
        let content = programDiv.querySelector('.content div'), paragraphs = program.content.split(/\n+/);
        while(content.children.length) content.removeChild(content.children[0]);
        for(let i = 0; paragraphs[i]; i++){
          let p = document.createElement('p');
          p.textContent = paragraphs[i];
          linkify(p);
          content.appendChild(p);
        }
        /* casts and crews */
        let searchInput = elements.timetablePanel.querySelector('nav > .search input');
        ['casts', 'crews'].forEach((key) => {
          let ul = programDiv.querySelector(`.${key} ul`);
          while(ul.children.length) ul.removeChild(ul.children[0]);
          for(let i = 0; program[key][i]; i++){
            let li = document.createElement('li');
            li.textContent = program[key][i];
            Program.linkifyNames(li, function(e){
              core.timetable.listPane.search(e.target.textContent);
            });
            ul.appendChild(li);
          }
          if(ul.children.length === 0){
            let li = document.createElement('li');
            li.textContent = '-';
            ul.appendChild(li);
          }
        });
        /* copyrights */
        programDiv.querySelector('.copyrights').textContent = program.copyrights.join(', ');
        /* highlight */
        core.timetable.highlightProgram(program);
      },
      highlightProgram: function(program){
        let oldShown = elements.channelsUl.querySelector('.program.shown');
        if(oldShown) Slot.highlight(oldShown, 'remove', 'shown');
        let newShown = document.getElementById('program-' + program.id);
        if(newShown) Slot.highlight(newShown, 'add', 'shown');
      },
      listenSelection: function(){
        let programDiv = elements.timetablePanel.querySelector('.panel > .program');
        let select = function(e){
          let selection = window.getSelection(), selected = selection.toString();
          if(selection.isCollapsed) return;
          if(0 <= selected.indexOf('\n')) return;
          let value = selected.trim();
          if(value === '') return;
          core.timetable.listPane.search(value);
        };
        programDiv.addEventListener('mousedown', function(e){
          programDiv.addEventListener('mouseup', function(e){
            animate(function(){select(e)});/*ダブルクリックでのテキスト選択をanimateで確実に補足*/
          }, {once: true});
        });
      },
      listenMousewheel: function(){
        let channelsUl = elements.channelsUl;
        channelsUl.addEventListener('wheel', function(e){
          if(0 < Math.abs(e.deltaX)) return;/*左右ホイール・スワイプ*/
          if(e.target.localName === 'h2') return;/*チャンネル名上では無効*/
          switch(e.deltaMode){
            case(WheelEvent.DOM_DELTA_PIXEL):/*ヌルヌル*/
              if(Math.abs(e.deltaY) < 1) return;/*微細なブレをカットしてスムーズに*/
              channelsUl.scrollLeft += e.deltaY;
              break;
            case(WheelEvent.DOM_DELTA_LINE):/*カクカク*/
            default:
              channelsUl.scrollLeft += e.deltaY * 40;
              break;
          }
        }, {passive: true});
      },
      useChannelPane: function(){
        /* ChannelPaneのチャンネル切り替えイベントを流用できるようにしておく */
        if(location.href.includes('/now-on-air/')){
          if(site.get.screenCommentScroller()) return;/*既に開いてくれているはず*/
          core.channelPane.openHide();
          core.timetable.addHiddenListener('channelPaneHidden', function(){
            elements.closer.click();
            html.classList.remove('channelPaneHidden');
          });
        }
      },
      addHiddenListener: function(name, listener){
        let timetablePanel = elements.timetablePanel;
        timetablePanel.hiddenListeners = timetablePanel.hiddenListeners || {};
        timetablePanel.hiddenListeners[name] = listener;
      },
      fitWidth: function(){
        if(!elements.timetablePanel || !elements.timetablePanel.isConnected) return;
        let timetablePanel = elements.timetablePanel, fits = timetablePanel.querySelectorAll('.fit');
        for(let i = 0; fits[i]; i++){
          if(fits[i].scrollWidth < fits[i].clientWidth) fits[i].style.transform = '';
          else fits[i].style.transform = `scaleX(${fits[i].clientWidth / fits[i].scrollWidth})`;
        }
      },
      listPane: {
        build: function(){
          let listPane = elements.listPane = elements.timetablePanel.querySelector('.programs > .list');
          let listHeader = elements.listHeader = listPane.querySelector('header');
          let listUl = elements.listUl = listPane.querySelector('ul');
          core.timetable.listPane.buildSearch();
          core.timetable.listPane.buildNotifications();
        },
        buildSearch: function(){
          let searchInput = elements.searchInput = elements.timetablePanel.querySelector('nav > .search input[type="search"]');
          let searchButton = elements.searchButton = elements.timetablePanel.querySelector('nav > .search button.search');
          /* 検索 */
          searchInput.addEventListener('keypress', function(e){
            if(e.key === 'Escape') return listPane.classList.remove('active');
            if(e.key === 'Enter') return core.timetable.listPane.search(searchInput.value);
          });
          searchButton.addEventListener('click', function(e){
            core.timetable.listPane.search(searchInput.value);
          });
        },
        search: function(value, marks = site.marks){
          let searchInput = elements.searchInput, listPane = elements.listPane, listUl = elements.listUl;
          searchInput.value = value = value.trim();
          if(value === '') return listPane.classList.remove('active');
          listPane.dataset.mode = 'search';
          listPane.classList.add('active');
          listPane.scrollTop = 0;
          listUl.results = core.searchPrograms(value);/*全件取得してDOMプロパティに渡しておく*/
          core.timetable.listPane.buildSearchHeader(value);
          core.timetable.listPane.updateSearchFillters(value, marks);
          core.timetable.listPane.listProgramsByType(listUl.results);
          core.timetable.listPane.updateResultCount(core.timetable.listPane.getFilteredLength(listUl.results, marks));
          core.timetable.listPane.addRemoteSearchResults(value);
        },
        buildSearchHeader: function(value){
          let listPane = elements.listPane, listHeader = elements.listHeader, listUl = elements.listUl;
          /* listHeaderの再構築 */
          while(listHeader.children.length) listHeader.removeChild(listHeader.firstElementChild);
          let searchFilters = elements.searchFilters = listHeader.appendChild(createElement(core.html.searchFilters()));
          let summary = elements.summary = listHeader.appendChild(createElement(core.html.listSummary()));
          /* 絞り込みDOM生成 */
          let it = searchFilters.querySelector('input.template'), lt = searchFilters.querySelector('label.template'), labels = [];
          site.marks.forEach((mark) => {
            let input = it.cloneNode(true);
            let label = lt.cloneNode(true);
            input.classList.remove('template');
            label.classList.remove('template');
            input.id = 'mark-' + mark;
            input.value = mark;
            label.setAttribute('for', 'mark-' + mark);
            label.appendChild(createElement(core.html.marks[mark]()));
            searchFilters.insertBefore(input, it);
            searchFilters.insertBefore(label, it);
            labels.push(label);
          });
          /* eventListener付与 */
          labels.forEach((label) => {
            /* 連続で次々クリックするとマウスポインタのズレによるclick判定漏れが起きやすいので、mousedownで処理する */
            label.addEventListener('mousedown', function(e){
              if(e.button !== 0/*0:左クリック*/) return;
              [summary, listUl].forEach((e) => e.animate([{opacity: 0}, {opacity: 1}], {duration: 250, easing: 'ease-out'}));
              let input = label.previousElementSibling;
              input.checked = !input.checked;
              listUl.classList.toggle(input.value);
              let marks = site.marks.filter((mark) => listUl.classList.contains(mark));
              core.timetable.listPane.updateSearchFillters(value, marks);
              core.timetable.listPane.updateResultCount(core.timetable.listPane.getFilteredLength(listUl.results, marks));
            });
            label.addEventListener('click', function(e){
              e.preventDefault();
            });
          });
        },
        updateSearchFillters: function(value, marks){
          let summary = elements.summary, labels = elements.searchFilters.querySelectorAll('label:not(.template)'), listUl = elements.listUl;
          /* 検索通知登録済みのmarkフィルタをチェックしてハイライトさせる */
          labels.forEach((label) => {
            let input = label.previousElementSibling;
            input.checked = (marks.some((mark) => mark === input.value));
            if(notifications.search[value] && notifications.search[value].includes(input.value)) label.classList.add('notify');
            else label.classList.remove('notify');
          });
          /* リストフィルタ */
          site.marks.forEach((mark) => {
            if(marks.includes(mark)) !listUl.classList.contains(mark) && listUl.classList.add(mark);
            else listUl.classList.contains(mark) && listUl.classList.remove(mark);
          });
          /* 常に通知するボタン */
          let oldButton = summary.querySelector('.auto_search');
          if(oldButton) summary.replaceChild(Notifier.createAutoSearchButton(value, marks), oldButton);
          else summary.appendChild(Notifier.createAutoSearchButton(value, marks));
        },
        getFilteredLength: function(programs, marks){
          return programs.filter((p) => {
            if(marks.some((mark) => p.marks[mark] !== undefined)) return true;
            if(marks.includes('none') && Object.keys(p.marks).length === 0) return true;
          }).length;
        },
        addRemoteSearchResults: function(q){
          MyVideo.getRemoteSearchResults(q).then((results) => {
            results.forEach((r) => {
              if(r === null) return;
              core.timetable.listPane.addSearchResults(r.label, r.programs, r.count, q);
            });
          });
        },
        addSearchResults: function(label, programs, count, q){
          if(programs.length === 0) return;
          let listUl = elements.listUl;
          listUl.results = listUl.results.concat(programs);
          let li = listUl.querySelector(`[data-type="${label}"]`) || createElement(core.html.typeListItem());
          core.timetable.listPane.listPrograms(li.querySelector('ul'), programs);
          if(!li.isConnected){
            li.dataset.type = li.querySelector('h2').textContent = label;
            if(programs.length < count){
              let more = createElement(core.html.listMore());
              more.appendChild(MyVideo.createListMoreButton(label, q));
              li.querySelector('ul').appendChild(more);
            }
            listUl.appendChild(li);
          }else{
            let more = li.querySelector('ul > li.more');
            li.querySelector('ul').appendChild(more);/*最後尾に移し替え*/
          }
          core.timetable.listPane.updateResultCount(listUl.results.length);
        },
        buildNotifications: function(){
          let searchInput = elements.searchInput, listPane = elements.listPane, listUl = elements.listUl;
          let button = elements.notificationsButton = elements.timetablePanel.querySelector('nav button.notifications');
          button.addEventListener('click', function(e){
            if(listPane.classList.contains('active') && listPane.dataset.mode === 'notifications') return listPane.classList.remove('active');
            listPane.dataset.mode = 'notifications';
            listPane.classList.add('active');
            listPane.scrollTop = 0;
            searchInput.value = '';
            /* 内容構築 */
            listUl.className = '';/*検索用のフィルタをリセット*/
            listUl.results = notifications.programs;/*DOMプロパティとして検索結果を渡す約束*/
            core.timetable.listPane.buildNotificationsHeader();
            core.timetable.listPane.listAllNotifications();
          });
          Notifier.updateCount();
        },
        buildNotificationsHeader: function(){
          let listHeader = elements.listHeader, listUl = elements.listUl;
          /* listHeaderの再構築 */
          while(listHeader.children.length) listHeader.removeChild(listHeader.firstElementChild);
          let notificationsTabs = elements.notificationsTabs = listHeader.appendChild(createElement(core.html.notificationsTabs()));
          let summary = elements.summary = listHeader.appendChild(createElement(core.html.listSummary()));
          /* eventListener割り当て */
          let labels = notificationsTabs.querySelectorAll('label');
          let actions = {
            all: core.timetable.listPane.listAllNotifications,
            once: core.timetable.listPane.listOnceNotifications,
            repeat: core.timetable.listPane.listRepeatNotifications,
            search: core.timetable.listPane.listSearchNotifications,
            myvideo: core.timetable.listPane.listMyVideos,
          }
          labels.forEach((label) => {
            /* 連続で次々クリックするとマウスポインタのズレによるclick判定漏れが起きやすいので、mousedownで処理する */
            label.addEventListener('mousedown', function(e){
              let input = label.previousElementSibling, oldButton = summary.querySelector('.delete_all');
              input.checked = true;/*radioボタン*/
              if(oldButton) oldButton.parentNode.removeChild(oldButton);
              [summary, listUl].forEach((e) => e.animate([{opacity: 0}, {opacity: 1}], {duration: 250, easing: 'ease-out'}));
              actions[input.value]();
            });
            label.addEventListener('click', function(e){
              e.preventDefault();
            });
          });
        },
        listAllNotifications: function(){
          core.timetable.listPane.listProgramsByDay(notifications.programs);
          core.timetable.listPane.updateResultCount(notifications.programs.length);
        },
        listOnceNotifications: function(){
          let filteredResults = notifications.programs.filter((p) => {
            if(!Notifier.matchOnce(p.once)) return false;
            if(Notifier.matchRepeat(p.repeat)) return false;/*毎回通知は含めない*/
            return true;
          });
          core.timetable.listPane.listProgramsByDay(filteredResults);
          core.timetable.listPane.updateResultCount(filteredResults.length);
        },
        listRepeatNotifications: function(){
          let listUl = elements.listUl;
          let repeats = {}, count = 0;
          /* 放送予定の毎回通知番組をrepeatsにまとめる */
          notifications.programs.forEach((p) => {
            if(!Notifier.matchRepeat(p.repeat)) return;
            if(MAXRESULTS <= count) return count++;/*+1だけ超過させて終了*/
            if(!repeats[p.repeat]) repeats[p.repeat] = [];
            repeats[p.repeat].push(p);
            count++;
          });
          /* 放送予定が見つからないけど登録されている毎回通知番組 */
          Object.keys(notifications.repeat).forEach((key) => {
            if(!repeats[key]) repeats[key] = [];
          });
          /* リスト構築 */
          while(listUl.children.length) listUl.removeChild(listUl.firstElementChild);
          Object.keys(repeats).forEach((key) => {
            let li = createElement(core.html.repeatListItem()), h2 = li.querySelector('h2');
            h2.querySelector('.title').textContent = notifications.repeat[key];
            h2.insertBefore(Notifier.createRepeatAllButton(repeats[key][0] || {
              /* 期間内に番組がなくても repeat, title さえあればボタン生成できる */
              repeat: key,
              title: notifications.repeat[key],
            }), h2.firstChild);
            core.timetable.listPane.listPrograms(li.querySelector('ul'), repeats[key]);
            listUl.appendChild(li);
          });
          core.timetable.listPane.updateResultCount(count);
        },
        listSearchNotifications: function(){
          let listUl = elements.listUl;
          let searches = {}, count = 0, limit = Infinity;
          /* 検索通知番組をsearchesにまとめる */
          Object.keys(notifications.search).forEach((key) => {
            searches[key] = [];
            for(let i = 0; p = notifications.programs[i]; i++){
              if(MAXRESULTS == i) limit = p.startAt;/*件数制限のために開始時刻を活用*/
              if(core.matchProgram(p, key, notifications.search[key])){
                searches[key].push(p);
                count++;
              }
            }
          });
          /* リスト構築 */
          while(listUl.children.length) listUl.removeChild(listUl.firstElementChild);
          Object.keys(searches).sort((a, b) => {/*キーワードの並べ替え*/
            if(searches[a][0] && searches[b][0]) return searches[a][0].startAt - searches[b][0].startAt;/*放送開始の早い順*/
            else if(searches[a].length) return -1;/*該当する番組が0件なら後ろのほうへ*/
            else if(searches[b].length) return +1;/*該当する番組が0件なら後ろのほうへ*/
            else return b < a;/*該当する番組が0件同士では辞書順*/
          }).forEach((key) => {
            let marks = notifications.search[key].map((name) => core.html.marks[name]());
            let li = createElement(core.html.searchListItem(key, marks.join(''))), h2 = li.querySelector('h2');
            h2.insertBefore(Notifier.createSearchButton(key), h2.firstChild);
            core.timetable.listPane.listPrograms(li.querySelector('ul'), searches[key].filter((p) => p.startAt <= limit));
            listUl.appendChild(li);
          });
          core.timetable.listPane.updateResultCount(count);
        },
        listMyVideos: function(){
          let listPane = elements.listPane, summary = listPane.querySelector('.summary');
          core.timetable.listPane.listProgramsByType(myvideos.programs);
          core.timetable.listPane.updateResultCount(myvideos.programs.length);
          /* 期限が切れた放送とビデオをすべて削除する */
          let expiredCount = myvideos.programs.filter((p) => p.hasExpired).length;
          if(expiredCount) summary.appendChild(MyVideo.createDeleteAllButton(expiredCount));
        },
        listProgramsByType: function(programs){
          let listUl = elements.listUl;
          let labels = ['放送中', '放送予定', '見逃し番組', 'ビデオ'], types = {}, now = MinuteStamp.now(), limit = Infinity;
          let timeshiftKey = MyVideo.isPremiumUser() ? 'timeshiftEndAt' : 'timeshiftFreeEndAt', sortMethods = [
            (a, b) => (a.startAt || 0) - (b.startAt || 0),
            (a, b) => (a.startAt || 0) - (b.startAt || 0),
            (a, b) => (b[timeshiftKey] || 0) - (a[timeshiftKey] || 0),
            (a, b) => (b[timeshiftKey] || 0) - (a[timeshiftKey] || 0),
          ];
          /* 番組をtypesにまとめる */
          labels.forEach((label) => types[label] = []);
          programs.forEach((p, i) => {
            if(MAXRESULTS == i) limit = p.startAt;/*件数制限のために開始時刻を活用*/
            switch(true){
              case(p.isVideo):        return types[labels[3]].push(p);
              case(p.endAt <=   now): return types[labels[2]].push(p);
              case(now <  p.startAt): return types[labels[1]].push(p);
              case(now <    p.endAt): return types[labels[0]].push(p);
            }
          });
          /* リスト構築 */
          while(listUl.children.length) listUl.removeChild(listUl.firstElementChild);
          labels.forEach((key, i) => {
            if(types[key].length === 0) return;
            let li = createElement(core.html.typeListItem()), h2 = li.querySelector('h2');
            h2.textContent = key;
            types[key].sort(sortMethods[i]);
            core.timetable.listPane.listPrograms(li.querySelector('ul'), types[key].filter((p) => p.startAt <= limit));
            listUl.appendChild(li);
          });
        },
        listProgramsByDay: function(programs){
          let listUl = elements.listUl;
          let labels = ['きょう', 'あした', 'あさって以降'], days = {}, today = MinuteStamp.justToday(), limit = Infinity;
          /* 番組をdaysにまとめる */
          labels.forEach((label) => days[label] = []);
          programs.forEach((p, i) => {
            if(MAXRESULTS == i) limit = p.startAt;/*件数制限のために開始時刻を活用*/
            switch(true){
              case(p.startAt < today + DAY*1): return days[labels[0]].push(p);
              case(p.startAt < today + DAY*2): return days[labels[1]].push(p);
              default: return days[labels[2]].push(p);
            }
          });
          /* リスト構築 */
          while(listUl.children.length) listUl.removeChild(listUl.firstElementChild);
          labels.forEach((key) => {
            let li = createElement(core.html.dayListItem()), h2 = li.querySelector('h2');
            h2.textContent = key;
            core.timetable.listPane.listPrograms(li.querySelector('ul'), days[key].filter((p) => p.startAt <= limit));
            listUl.appendChild(li);
          });
        },
        listPrograms: function(ul, programs){
          let listPane = elements.listPane, now = MinuteStamp.now();
          /* 前準備 */
          if(programs.length === 0) ul.appendChild(createElement(core.html.noProgramListItem()));
          for(let p = 0; programs[p] && p < MAXRESULTS; p++){
            let li = createElement(core.html.programListItem());
            let marks = Object.keys(programs[p].marks);
            if(marks.length) marks.forEach((mark) => li.classList.add(mark));
            else li.classList.add('none');
            let title = li.querySelector('.title');
            title.textContent = programs[p].title;
            Program.appendMarks(title, programs[p].marks);
            let data = li.querySelector('.data');
            data.insertBefore(Notifier.createButton(programs[p]), data.children[0]);
            data.insertBefore(MyVideo.createMyVideoButton(programs[p]), data.children[1]);
            switch(true){
              case(programs[p].isVideo):
              case(programs[p].endAt <= now):
                li.querySelector('.date').innerHTML/*プレミアム誘導リンクが入るので*/ = programs[p].timeshiftRemainsHTML;
                break;
              case(now < programs[p].endAt):
                li.querySelector('.date').textContent = programs[p].justifiedDateString;
                li.querySelector('.channel').textContent = programs[p].channel.name;
                break;
            }
            let thumbnail = li.querySelector('.thumbnail');
            /* 遅延読み込み */
            let observer = new IntersectionObserver(function(entries){
              if(!entries[entries.length - 1].isIntersecting) return;/*Chromeは[1],Firefoxは[0]になるので length - 1 を使う*/
              observer.disconnect();
              thumbnail.appendChild(new Thumbnail(programs[p].displayProgramId, programs[p].thumbImg, 'large').node);
            }, {root: listPane, rootMargin: '50%'});
            observer.observe(thumbnail);
            li.addEventListener('click', function(e){
              core.timetable.showProgramData(programs[p]);
              core.timetable.scrollTo(programs[p].startAt);
            });
            ul.appendChild(li);
          }
        },
        updateResultCount: function(length){
          let listHeader = elements.listHeader, count = listHeader.querySelector('.count');
          switch(true){
            case(length === 0):
              count.textContent = `見つかりませんでした`;
              break;
            case(length <= MAXRESULTS):
              count.textContent = `${length}件見つかりました`;
              break;
            case(MAXRESULTS < length):
              count.textContent = `${MAXRESULTS}件以上見つかりました`;
              break;
          }
        },
      },
    },
    getCurrentChannelId: function(){
      let match = location.href.match(/\/now-on-air\/([a-z0-9-]+)/);
      if(!match) return false;
      else return match[1];
    },
    getProgramById: function(id){
      for(let c = 0, channel; channel = channels[c]; c++){
        for(let p = 0, program; program = channel.programs[p]; p++){
          if(program.id === id) return program;
        }
      }
    },
    matchProgram: function(program, value, marks = []){
      if(program.noContent) return false;
      let words = normalize(value.toLowerCase()).split(/\s+/), rs = {both: /^[0-9]$/, start: /^[0-9]/, end: /[0-9]$/};
      if(!words.every((word) => {
        /* 数字なら値を尊重する(#1は#10にマッチさせない) */
        let regexp;
        switch(true){
          case(rs.both.test( word)): regexp = new RegExp(`(?:^|[^0-9])${escapeRegExp(word)}(?![0-9])`, 'i'); break;
          case(rs.start.test(word)): regexp = new RegExp(`(?:^|[^0-9])${escapeRegExp(word)}`, 'i'); break;
          case(rs.end.test(  word)): regexp = new RegExp(`${escapeRegExp(word)}(?![0-9])`, 'i'); break;
        }
        return [
          program.channel.name,
          program.title,
          ...program.casts || [],
          ...program.crews || [],
        ].some((p) => regexp ? regexp.test(p) : (0 <= p.toLowerCase().indexOf(word)));
      })) return false;
      if(marks.length === 0) return true;
      if(marks.some((mark) => program.marks[mark] !== undefined)) return true;
      if(marks.includes('none') && Object.keys(program.marks).length === 0) return true;
    },
    searchPrograms: function(value, marks = []){
      let now = MinuteStamp.now(), results = [];
      for(let c = 0, channel; channel = channels[c]; c++){
        for(let p = 0, program; program = channel.programs[p]; p++){
          if(!configs.c_visibles[program.channel.id]) continue;
          if(program.endAt <= now) continue;
          if(program.noContent) continue;
          if(core.matchProgram(program, value, marks)) results.push(program);
        }
      }
      results.sort((a, b) => a.startAt - b.startAt);/*日付順*/
      return results;
    },
    getProgramNowOnAir: function(channelId = null){
      if(!channelId) channelId = core.getCurrentChannelId();
      for(let now = MinuteStamp.now(), c = 0, channel; channel = channels[c]; c++){
        if(channel.id !== channelId) continue;
        for(let p = 0, program; program = channel.programs[p]; p++){
          if(program.endAt < now) continue;
          if(now < program.startAt) break;/*念のため*/
          return program;
        }
      }
    },
    config: {
      read: function(){
        /* 保存済みの設定を読む */
        configs = Storage.read('configs') || {};
        /* 未定義項目をデフォルト値で上書きしていく */
        Object.keys(CONFIGS).forEach((key) => {if(configs[key] === undefined) configs[key] = CONFIGS[key].DEFAULT});
      },
      save: function(new_config){
        configs = {};/*CONFIGSに含まれた設定値のみ保存する*/
        /* CONFIGSを元に文字列を型評価して値を格納していく */
        Object.keys(CONFIGS).forEach((key) => {
          /* 値がなければデフォルト値 */
          if(new_config[key] === "") return configs[key] = CONFIGS[key].DEFAULT;
          switch(CONFIGS[key].TYPE){
            case 'bool':
              configs[key] = (new_config[key]) ? 1 : 0;
              break;
            case 'int':
              configs[key] = parseInt(new_config[key]);
              break;
            case 'float':
              configs[key] = parseFloat(new_config[key]);
              break;
            default:
              configs[key] = new_config[key];
              break;
          }
        });
        Storage.save('configs', configs);
      },
      createButton: function(){
        elements.configButton = elements.timetablePanel.querySelector('button.config');
        elements.configButton.addEventListener('click', core.config.toggle);
      },
      open: function(){
        core.panel.open(elements.configPanel || core.config.createPanel());
      },
      close: function(){
        core.panel.close(elements.configPanel);
      },
      toggle: function(){
        core.panel.toggle(elements.configPanel || core.config.createPanel(), core.config.open, core.config.close);
      },
      createPanel: function(){
        let configPanel = elements.configPanel = createElement(core.html.configPanel());
        let channelsUl = configPanel.querySelector('.channels'), templateLi = channelsUl.querySelector('li.template');
        for(let i = 0; channels[i]; i++){
          let li = templateLi.cloneNode(true);
          li.classList.remove('template');
          let input = li.querySelector('input');
          input.value = channels[i].id;
          input.checked = configs.c_visibles[channels[i].id];
          li.querySelector('label > span').textContent = channels[i].name;
          channelsUl.insertBefore(li, templateLi);
        }
        channelsUl.removeChild(templateLi);
        configPanel.querySelector('button.cancel').addEventListener('click', core.config.close);
        configPanel.querySelector('button.save').addEventListener('click', function(){
          let inputs = configPanel.querySelectorAll('input'), new_configs = {};
          for(let i = 0, input; input = inputs[i]; i++){
            switch(CONFIGS[input.name].TYPE){
              case('bool'):
                new_configs[input.name] = (input.checked) ? 1 : 0;
                break;
              case('object'):
                if(!new_configs[input.name]) new_configs[input.name] = {};
                new_configs[input.name][input.value] = (input.checked) ? 1 : 0;
                break;
              default:
                new_configs[input.name] = input.value;
                break;
            }
          }
          core.config.save(new_configs);
          core.config.close()
          /* 新しい設定値で再スタイリング */
          core.addStyle();
          core.createChannelIndicator();
          core.channelPane.modify();
          core.abemaTimetable.initialize();
          core.timetable.rebuildTimetable();
          Notifier.sync();
        }, true);
        configPanel.querySelector('input[name="n_change"]').addEventListener('click', function(e){
          let n_overlap = configPanel.querySelector('input[name="n_overlap"]');
          n_overlap.disabled = !n_overlap.disabled;
          n_overlap.parentNode.parentNode.classList.toggle('disabled');
        }, true);
        configPanel.keyAssigns = {
          'Escape': core.config.close,
        };
        return configPanel;
      },
    },
    panel: {
      createPanels: function(){
        if(elements.panels) return;
        let panels = elements.panels = createElement(core.html.panels());
        panels.dataset.panels = 0;
        document.body.appendChild(panels);
        /* Escapeキーで閉じるなど */
        window.addEventListener('keydown', function(e){
          if(['input', 'textarea'].includes(document.activeElement.localName)) return;
          Array.from(panels.children).forEach((p) => {
            if(p.classList.contains('hidden')) return;
            /* 表示中のパネルに対するキーアサインを確認 */
            if(p.keyAssigns){
              if(p.keyAssigns[e.key]){
                e.preventDefault();
                return p.keyAssigns[e.key]();/*単一キーなら簡単に処理*/
              }
              for(let i = 0, assigns = Object.keys(p.keyAssigns); assigns[i]; i++){
                let keys = assigns[i].split('+');/*プラス区切りで指定*/
                if(!['altKey','shiftKey','ctrlKey','metaKey'].every(
                  (m) => (e[m] && keys.includes(m)) || (!e[m] && !keys.includes(m)))
                ) return;/*修飾キーの一致を確認*/
                if(keys[keys.length - 1] === e.key){
                  e.preventDefault();
                  return p.keyAssigns[assigns[i]]();/*最後が通常キー*/
                }
              }
            }
          });
        }, true);
      },
      open: function(panel){
        let panels = elements.panels;
        if(!panel.isConnected){
          panel.classList.add('hidden');
          panels.insertBefore(panel, Array.from(panels.children).find((p) => panel.dataset.order < p.dataset.order));
        }
        panels.dataset.panels = parseInt(panels.dataset.panels) + 1;
        animate(function(){panel.classList.remove('hidden')});
      },
      show: function(panel){
        core.panel.open(panel);
      },
      hide: function(panel, close = false){
        if(panel.classList.contains('hidden')) return;/*連続Escなどによる二重起動を避ける*/
        let panels = elements.panels;
        panel.classList.add('hidden');
        panel.addEventListener('transitionend', function(e){
          panels.dataset.panels = parseInt(panels.dataset.panels) - 1;
          if(close){
            panels.removeChild(panel);
            elements[panel.dataset.name] = null;
          }
        }, {once: true});
      },
      close: function(panel){
        core.panel.hide(panel, true);
      },
      toggle: function(panel, open, close){
        if(!panel.isConnected || panel.classList.contains('hidden')) open();
        else close();
      },
    },
    addStyle: function(name = 'style'){
      let style = createElement(core.html[name]());
      document.head.appendChild(style);
      if(elements[name] && elements[name].isConnected) document.head.removeChild(elements[name]);
      elements[name] = style;
    },
    html: {
      marks: {/*live(生), newcomer(新), first(初), last(終), bingeWatching(一挙), recommendation(注目), none(なし)*/
        live:           () => `<span class="mark live"    ><svg height="14" width="14"><use xlink:href="/images/icons/text_live_rect.svg#svg-body"></use></svg><svg height="14" width="14"><use xlink:href="/images/icons/text_live_path.svg#svg-body"></use></svg></span>`,
        newcomer:       () => `<span class="mark newcomer"><svg height="14" width="14"><use xlink:href="/images/icons/text_newcomer_rect.svg#svg-body"></use></svg><svg height="14" width="14"><use xlink:href="/images/icons/text_newcomer_path.svg#svg-body"></use></svg></span>`,
        first:          () => `<svg  class="mark first"          height="14" width="14"><use xlink:href="/images/icons/text_new.svg#svg-body"></use></svg>`,
        last:           () => `<svg  class="mark last"           height="14" width="14"><use xlink:href="/images/icons/text_end.svg#svg-body"></use></svg>`,
        bingeWatching:  () => `<svg  class="mark bingeWatching"  height="14" width="23.333333333333336"><use xlink:href="/images/icons/text_binge_watching.svg#svg-body"></use></svg>`,
        recommendation: () => `<svg  class="mark recommendation" height="14" width="23.333333333333336"><use xlink:href="/images/icons/text_recommendation.svg#svg-body"></use></svg>`,
        none:           () => `<span class="mark none">なし</span>`,
      },
      channelIndicator: () => `
        <div id="${SCRIPTNAME}-channelIndicator">
          <ul class="channels">
            <li class="channel template"><img class="logo" width="340" height="128"></li>
          </ul>
        </div>
      `,
      myvideoButton: () => `
        <button class="myvideo" data-title-default="マイビデオに追加する" data-title-active="マイビデオを解除する" data-title-unavailable="マイビデオ対象外です">
          <svg width="16" height="16">
            <use class="plus"    xlink:href="/images/icons/plus.svg#svg-body"></use>
            <use class="checked" xlink:href="/images/icons/checkmark.svg#svg-body"></use>
          </svg>
        </button>
      `,
      repeatAllButton: () => `
        <button class="repeat_all" data-title-default="毎回通知を受け取る" data-title-active="毎回通知を解除する"><svg width="20" height="12"><use xlink:href="/images/icons/repeat.svg#svg-body"></use></svg></button>
      `,
      playButton: () => `
        <button class="play" data-title-nowonair="現在放送中" data-title-timeshift="見逃し視聴する" data-title-video="ビデオ視聴する" data-title-expired="視聴期限が切れました"><svg width="17" height="17"><use xlink:href="/images/icons/play.svg#svg-body"></use></svg></button>
      `,
      notifyButton: () => `
        <button class="notify" data-title-default="通知を受け取る" data-title-once="通知を解除する" data-title-repeat="毎回通知に登録済み" data-title-search="登録済みの検索通知を確認する">
          <svg width="17" height="17">
            <use class="plus"    xlink:href="/images/icons/alarm_clock_plus.svg#svg-body"></use>
            <use class="checked" xlink:href="/images/icons/alarm_clock_checkmark.svg#svg-body"></use>
            <use class="repeat"  xlink:href="/images/icons/repeat.svg#svg-body"></use>
            <use class="search"  xlink:href="/images/icons/search.svg#svg-body"></use>
          </svg>
        </button>
      `,
      autoSearchButton: (value, marks) => `
        <button class="auto_search" data-title-default="検索結果を常に通知する" data-title-active="検索結果の通知を解除する"><svg width="17" height="17"><use xlink:href="/images/icons/search.svg#svg-body"></use></svg>${value} (${marks}) を常に通知</button>
      `,
      deleteAllButton: (count) => `
        <button class="delete_all" data-title-default="${count}件の期限切れをすべて元に戻す" data-title-active="${count}件の期限切れをすべて削除する"><svg height="17" width="12"><use xlink:href="/images/icons/trash_can.svg#svg-body"></use></svg>${count}件の期限切れをすべて削除する</button>
      `,
      clock: (hours, minutes) => `<span class="clock">${hours}<span class="blink">:</span>${minutes}</span>`,
      searchFilters: () => `
        <p class="filters">
          <input class="template" type="checkbox" name="filter" checked><label class="template"></label>
        </p>
      `,
      notificationsTabs: () => `
        <nav class="tabs">
          <input type="radio" name="notifications" value="all"     id="notifications-all" checked><label for="notifications-all"    >すべて</label>
          <input type="radio" name="notifications" value="once"    id="notifications-once"       ><label for="notifications-once"   ><svg width="17" height="17"><use xlink:href="/images/icons/alarm_clock_checkmark.svg#svg-body"></use></svg>1回通知</label>
          <input type="radio" name="notifications" value="repeat"  id="notifications-repeat"     ><label for="notifications-repeat" ><svg width="20" height="12"><use xlink:href="/images/icons/repeat.svg#svg-body"></use></svg>毎回通知</label>
          <input type="radio" name="notifications" value="search"  id="notifications-search"     ><label for="notifications-search" ><svg width="17" height="17"><use xlink:href="/images/icons/search.svg#svg-body"></use></svg>検索通知</label>
          <input type="radio" name="notifications" value="myvideo" id="notifications-myvideo"    ><label for="notifications-myvideo"><svg width="16" height="16"><use xlink:href="/images/icons/checkmark.svg#svg-body"></use></use></svg>マイビデオ</label>
        </nav>
      `,
      listSummary: () => `
        <p class="summary"><span class="count"></span></p>
      `,
      typeListItem: () => `
        <li class="type">
          <h2></h2>
          <ul></ul>
        </li>
      `,
      dayListItem: () => `
        <li class="day">
          <h2></h2>
          <ul></ul>
        </li>
      `,
      repeatListItem: () => `
        <li class="repeat">
          <h2><span class="title"></span></h2>
          <ul></ul>
        </li>
      `,
      searchListItem: (value, marks) => `
        <li class="search">
          <h2><span class="key">${value} (${marks})</span></h2>
          <ul></ul>
        </li>
      `,
      programListItem: () => `
        <li class="program">
          <p class="thumbnail"></p>
          <h2><span class="title"></span></h2>
          <p class="data"><span class="date"></span><span class="channel"></span></p>
        </li>
      `,
      listMore: () => `
        <li class="more"></li>
      `,
      listMoreButton: (type) => `
        <button class="search_more"><svg width="17" height="17"><use xlink:href="/images/icons/search.svg#svg-body"></use></svg>${type}をもっとみる</button>
      `,
      noProgramListItem: () => `
        <li class="noprogram">該当する番組はありません</li>
      `,
      timetablePanel: () => `
        <div class="panel" id="${SCRIPTNAME}-timetable-panel" data-name="timetablePanel" data-order="1">
          <header>
            <h1>番組表</h1>
            <p class="buttons"><button class="config" title="${SCRIPTNAME} 設定"><svg width="20" height="20"><use xlink:href="/images/icons/config.svg#svg-body"></use></svg></button></p>
          </header>
          <div class="program nocontent">
            <h2><span class="title">番組タイトル</span></h2>
            <div class="thumbnails"></div>
            <div class="summary">
              <p class="channel">チャンネル</p>
              <p class="date"><span>放送日時</span></p>
              <p class="timeshift"><span>見逃し視聴</span></p>
              <p class="highlight"></p>
              <ul class="links">
                <li class="template"><a></a></li>
              </ul>
              <div class="group">
                <h3><span>今後${TERMLABEL}の放送予定</span></h3>
                <ul>
                  <li class="template"><header><span class="date"></span><span class="title"></span></header></li>
                </ul>
              </div>
              <div class="series">
                <h3>(再放送などを含む)</h3>
                <ul>
                  <li class="template"><header><span class="date"></span><span class="title"></span></header></li>
                </ul>
              </div>
            </div>
            <div class="content">
              <h3>番組概要</h3>
              <div></div>
            </div>
            <div class="casts">
              <h3>キャスト</h3>
              <ul></ul>
            </div>
            <div class="crews">
              <h3>スタッフ</h3>
              <ul></ul>
            </div>
            <p class="copyrights"></p>
          </div>
          <nav>
            <div class="timeshift">
              <p class="days"><input class="template" type="radio" name="day"><label class="template"><span class="fit"></span></label></p>
              <p class="times"><input class="template" type="radio" name="time"><label class="template"><span class="fit"></span></label></p>
            </div>
            <p class="search">
              <input type="search" name="q" placeholder="検索 (番組名、チャンネル名、キャスト、スタッフ)"><button class="search"><svg width="17" height="17"><use xlink:href="/images/icons/search.svg#svg-body"></use></svg></button>
              <button class="notifications" title="通知番組一覧"><svg width="17" height="17"><use class="checked" xlink:href="/images/icons/alarm_clock_checkmark.svg#svg-body"></use></svg><span class="count"></span></button>
            </p>
          </nav>
          <div class="programs">
            <div class="list">
              <header></header>
              <ul></ul>
            </div>
            <ul class="channels">
              <li class="time hidden animate">
                <header>
                  <button class="abemaTimetable disabled" title="番組表ページへ移動する"><svg height="20" width="20"><use xlink:href="/images/icons/timetable.svg#svg-body"></use></svg></button>
                  <button class="now disabled" title="現在時刻に戻る"><span class="arrows">‹‹</span></button>
                </header>
                <ul class="stream times">
                  <li class="slot hour template"><span class="time"></span></li>
                  <li class="slot day template"><span class="date"></span></li>
                </ul>
              </li>
              <li class="channel template hidden animate">
                <header><h2 class="name fit"></h2></header>
                <ul class="stream programs">
                  <li class="slot program template hidden"><span class="time"></span><span class="title"></span></li>
                </ul>
              </li>
            </ul>
            <p class="scrollers">
              <button class="left  disabled" aria-label="表示を左に移動"><svg height="20" width="12"><use xlink:href="/images/icons/chevron_left.svg#svg-body"></use></svg></button>
              <button class="right disabled" aria-label="表示を右に移動"><svg height="20" width="12"><use xlink:href="/images/icons/chevron_right.svg#svg-body"></use></svg></button>
            </p>
          </div>
          <p class="buttons"><button class="ok primary">OK</button></p>
        </div>
      `,
      configPanel: () => `
        <div class="panel" id="${SCRIPTNAME}-config-panel" data-name="configPanel" data-order="2">
          <h1>${SCRIPTNAME}設定</h1>
          <fieldset>
            <legend>番組表パネル</legend>
            <p><label>透明度(%):                          <input type="number"   name="transparency" value="${configs.transparency}" min="0"  max="100" step="5"></label></p>
            <p><label>番組表の高さ(%)(文字サイズ連動):    <input type="number"   name="height"       value="${configs.height}"       min="5"  max="95"  step="5"></label></p>
            <p><label>番組表の時間幅(時間):               <input type="number"   name="span"         value="${configs.span}"         min="1"  max="24"  step="1"></label></p>
            <p><label>アベマ公式の番組表を置き換える:     <input type="checkbox" name="replace"      value="${configs.replace}"      ${configs.replace  ? 'checked' : ''}></label></p>
          </fieldset>
          <fieldset>
            <legend>通知(abema.tvを開いているときのみ)</legend>
            <p><label>番組開始何秒前に通知するか(秒):     <input type="number"   name="n_before"     value="${configs.n_before}"     min="0"  max="600" step="1"></label></p>
            <p><label>自動でチャンネルも切り替える:       <input type="checkbox" name="n_change"     value="${configs.n_change}"     ${configs.n_change ? 'checked' : ''}></label></p>
            <p class="sub ${configs.n_change ? '' : 'disabled'}"><label>時間帯が重なっている時は通知のみ: <input type="checkbox" name="n_overlap" value="${configs.n_overlap}" ${configs.n_overlap ? 'checked' : ''} ${configs.n_change ? '' : 'disabled'}></label></p>
            <p><label>アベマ公式の通知と共有する:         <input type="checkbox" name="n_sync"       value="${configs.n_sync}"       ${configs.n_sync   ? 'checked' : ''}></label></p>
          </fieldset>
          <fieldset>
            <legend>表示するチャンネル</legend>
            <ul class="channels">
              <li class="template"><label><input type="checkbox" name="c_visibles" value="id"><span>チャンネル名</span></label></li>
            </ul>
          </fieldset>
          <p class="buttons"><button class="cancel">キャンセル</button><button class="save primary">保存</button></p>
        </div>
      `,
      panels: () => `
        <div class="panels" id="${SCRIPTNAME}-panels"></div>
      `,
      style: () => `
        <style type="text/css">
          /* 共通変数 */
          /* 2019/3 公式カラーが変わったが、元の明るい緑を採用する: #51c300(81,195,0) => 33aa22(51,170,34) */
          /* visible_channels:        ${configs.visible_channels        = Object.keys(configs.c_visibles).filter((id) => configs.c_visibles[id] === 1).length || 25} */
          /* channelPane_width:       ${configs.channelPane_width       = 25} */
          /* channelPane_rowheight:   ${configs.channelPane_rowheight   = 100 / 16.75} (端数はchannelPane_timetableを入れてなお少し余裕を残すくらいが望ましい) */
          /* channelPane_thumbheight: ${configs.channelPane_thumbheight = configs.channelPane_rowheight *1.000} */
          /* channelPane_padding:     ${configs.channelPane_padding     = configs.channelPane_rowheight * .125} */
          /* channelPane_lineheight:  ${configs.channelPane_lineheight  = configs.channelPane_rowheight * .375} */
          /* channelPane_fontsize:    ${configs.channelPane_fontsize    = configs.channelPane_rowheight * .250} */
          /* channelPane_timetable:   ${configs.channelPane_timetable   = configs.channelPane_rowheight * .500} */
          /* opacity:                 ${configs.opacity                 = 1 - (configs.transparency / 100)} */
          /* scrollbarWidth:          ${configs.scrollbarWidth          = getScrollbarWidth()} */
          /* rowheight:               ${configs.rowheight               = configs.height / (configs.visible_channels + 1)} */
          /* rowfontsize:             ${configs.rowfontsize             = atMost(configs.rowheight * .6, 2.0)} */
          /* lineheight:              ${configs.lineheight              = 3.0} */
          /* fontsize:                ${configs.fontsize                = 1.8} */
          /* list_lineheight:         ${configs.list_lineheight         = atLeast(1.8, configs.rowfontsize * atMost(configs.height/50, .875) * 1.5)} */
          /* list_fontsize:           ${configs.list_fontsize           = atLeast(1.4, configs.rowfontsize * atMost(configs.height/50, .875))} */
          /* transparentGray:         ${configs.transparentGray         = `rgba(255,255,255,.5)`} */
          /* link_color:              ${configs.link_color              = `rgba( 81,195,  0,1)`} */
          /* linkHover_color:         ${configs.linkHover_color         = `rgba( 41, 98,  0,1)`} */
          /* listed_background:       ${configs.listed_background       = `rgba(112,112,112,${configs.opacity})`} */
          /* listed_backgroundHover:  ${configs.listed_backgroundHover  = `rgba(112,112,112,${configs.opacity / 2})`} */
          /* times_background:        ${configs.times_background        = `rgba( 64, 64, 64,${configs.opacity / 2})`} */
          /* nowOnAir_background:     ${configs.nowOnAir_background     = `rgba(112,112,112,${configs.opacity})`} */
          /* comming_background:      ${configs.comming_background      = `rgba( 64, 64, 64,${configs.opacity})`} */
          /* noContent_background:    ${configs.noContent_background    = `rgba(  0,  0,  0,${configs.opacity})`} */
          /* hover_background:        ${configs.hover_background        = `rgba( 61,146,  0,${configs.opacity})`} */
          /* current_background:      ${configs.current_background      = `rgba( 81,195,  0,${configs.opacity})`} */
          /* scroller_background:     ${configs.scroller_background     = `rgba(255,255,255,${configs.opacity})`} */
          /* list_background:         ${configs.list_background         = `rgba(  0,  0,  0,${configs.opacity / 2})`} */
          /* border_color:            ${configs.border_color            = `rgba(  0,  0,  0,${configs.opacity})`} */
          /* activeButton_color:      ${configs.activeButton_color      = `rgba( 81,195,  0,1)`} */
          /* progressbar_zIndex:      ${configs.progressbar_zIndex      = 110} */
          /* panel_zIndex:            ${configs.panel_zIndex            = 100} */
          /* channelPane_zIndex:      ${configs.channelPane_zIndex      =  11} */
          /* scrollers_zIndex:        ${configs.scrollers_zIndex        =  10} */
          /* button_zIndex:           ${configs.button_zIndex           =  10} */
          /* list_zIndex:             ${configs.list_zIndex             =  10} */
          /* channelIndicator_zIndex: ${configs.channelIndicator_zIndex =   2} */
          /* program_zIndex:          ${configs.program_zIndex          =   1} */
          /* nav_transition:          ${configs.nav_transition          = `250ms ${EASING}`} */
          /* アベマ公式の不要要素 */
          /* (レイアウトを崩す謎要素に、とりあえず穏便に表示位置の調整で対応する) */
          .pub_300x250,
          .pub_300x250m,
          .pub_728x90,
          .text-ad,
          .textAd,
          .text_ad,
          .text_ads,
          .text-ads,
          .text-ad-links,
          #announcer,
          dummy{
            position: absolute;
            bottom: 0;
          }
          /* マーク共通 */
          .mark,
          .mark > *{
            width: 1em !important;
          }
          .mark.bingeWatching,
          .mark.recommendation{
            width: ${5/3}em !important;
          }
          .mark.none{
            width: 2em !important;
            height: auto !important;
          }
          .mark{
            fill: white;
            margin: 0 .2em 0 0;
          }
          span.mark{
            vertical-align: middle;
            position: relative;
            display: inline-block;
          }
          .mark > svg{
            vertical-align: middle;
            position: absolute;
            left: 0;
            top: 0;
          }
          .mark.newcomer > svg:nth-child(1),
          .mark.live > svg:nth-child(1){
            fill: #f0163a;
          }
          .mark.last{
            margin-right: 0;
            margin-left: .2em;
          }
          /* 通知その他ボタン共通 */
          button.myvideo,
          button.repeat_all,
          button.play,
          button.notify{
            padding: 5px;/*クリッカブル領域を広げる*/
            margin: -5px;
            box-sizing: content-box;
            position: relative;/*個別調整用*/
            z-index: ${configs.button_zIndex};
            pointer-events: auto;
            transition: transform 250ms ease-in;
          }
          button.myvideo > *,
          button.repeat_all > *,
          button.play > *,
          button.notify > *{
            fill: white;
            width: auto;
            border-radius: 50vmax;
            overflow: visible;/*目覚まし時計アイコンのベル部分*/
            transform: scaleX(1);
            pointer-events: none;
          }
          button.repeat_all > *{
            position: relative;
            bottom: .1em !important;/*微調整*/
          }
          button.notify.once > *{
            fill: ${configs.activeButton_color};
            background: white;
            padding: 0;
            border: .05em solid white;
            box-sizing: border-box;
            overflow: hidden;/*目覚まし時計アイコンのベル部分*/
          }
          button.notify.repeat > *{
            fill: white;
            background: ${configs.activeButton_color};
            padding: .1em;
            border: .1em solid white;
            box-sizing: border-box;
            overflow: visible;
          }
          button.notify.search > *{
            fill: white;
            background: ${configs.activeButton_color};
            padding: .1em;
            border: .1em solid white;
            box-sizing: border-box;
            overflow: visible;
          }
          button.play.unavalable,
          button.myvideo.unavalable{
            filter: brightness(.25) !important;
          }
          button.myvideo:hover,
          button.repeat_all:hover,
          button.play:hover,
          button.notify:hover{
            filter: brightness(.5);
          }
          button.myvideo.reversing,
          button.repeat_all.reversing,
          button.play.reversing,
          button.notify.reversing{
            transform: scaleX(0);
            transition: transform 250ms ease-out;
          }
          button.repeat_all:not(.active) > *{
            transform: scaleX(-1);
          }
          button.myvideo.active > *,
          button.repeat_all.active > *,
          button.play.current > *{
            fill: ${configs.activeButton_color};
            filter: brightness(1.25);/*視認性を高める*/
          }
          button.myvideo use,
          button.notify use{
            display: none;
          }
          button.myvideo:not(.active) use.plus,
          button.myvideo.active use.checked,
          button.notify:not(.once):not(.repeat):not(.search) use.plus,
          button.notify.once:not(.repeat):not(.search) use.checked,
          button.notify.repeat:not(.search) use.repeat,
          button.notify.search use.search{
            display: inline;
          }
          /* アベマ公式 裏番組一覧の表示非表示 */
          html.channelPaneHidden [data-selector="channelPane"]{
            opacity: 0;/*translateXでは読み込みが発生しない*/
            z-index: -1;
            transition: opacity 500ms ease 500ms;/*チラ見えさせない努力*/
          }
          html.channelPaneHidden [data-selector="screen"] > div > div[style]{
            width: 100% !important;
            height: 100% !important;
          }
          /* アベマ公式 裏番組一覧の改変 */
          /* (アベマ公式に上書きされがちなので独自セレクタは独自に作った要素にだけ) */
          [data-selector="channelPane"]{
            width: 25vw;
            min-width: 40vh;
          }
          [data-selector="channelPane"] > div{
            min-height: 100%;
            display: flex;
            flex-direction: column;
          }
          [data-selector="channelPane"] > div > a{
            height: ${configs.channelPane_rowheight}vh;
            border-left: none !important;/*現在チャンネルに付く公式のボーダーをなくす*/
            padding: 0;
            width: 100%;
            overflow: hidden;
          }
          [data-selector="channelPane"] > div > a[data-onair="false"]:not([data-comming="true"]){
            cursor: auto;
          }
          [data-selector="channelPane"] > div > a ~ a{
            border-top: none !important;/*クリッカブル領域最大化のため公式のボーダーを削除*/
          }
          [data-selector="channelPane"] > div > a[data-hidden="true"]{
            display: none;
          }
          [data-selector="channelPane"] > div > a > div{
            position: relative;
          }
          [data-selector="channelPane"] > div > a > div > div:nth-child(1)/*サムネイル枠*/{
            border-left: 1px solid ${configs.border_color};
            border-right: 1px solid ${configs.border_color};
            border-bottom: 1px solid ${configs.border_color} !important;/*公式のボーダーを置き換える*/
            background: ${configs.noContent_background};
            box-sizing: content-box;
          }
          [data-selector="channelPane"] > div > a > div > div:nth-child(1)/*サムネイル枠*/ > div > div{
            height: calc(${configs.channelPane_thumbheight}vh - 1px) !important;
            width: ${configs.channelPane_thumbheight * (16/9)}vh !important;
            background: transparent;/*公式を上書き*/
            opacity: 1;/*公式を上書き*/
          }
          [data-selector="channelPane"] > div > a > div > div:nth-child(1)/*サムネイル枠*/ > div > div > img/*サムネイル*/{
            min-height: 100%;
            min-width: 100%;
            opacity: .5;
          }
          [data-selector="channelPane"] > div > a:hover > div > div:nth-child(1)/*サムネイル枠*/ > div > div > img/*サムネイル*/{
            opacity: 1;
          }
          [data-selector="channelPane"] > div > a > div > div:nth-child(1)/*サムネイル枠*/ > div > div + img/*チャンネルロゴ*/{
            width: ${configs.channelPane_thumbheight * (16/9) * .8}vh;
            height: auto;
            display: block;
            transition: none !important;/*公式を上書き*/
          }
          [data-selector="channelPane"] > div > a > div > div:nth-child(2)/*番組枠参照用の放送中の番組*/{
            display: none;
          }
          [data-selector="channelPane"] > div > a .slot/*番組共通*/,
          [data-selector="channelPane"] > div > a:last-child/*番組表リンク*/{
            border-right: 1px solid ${configs.border_color};
            background: ${configs.comming_background};
            padding: ${configs.channelPane_padding}vh 0 !important;/*公式の左パディングを打ち消す*/
            overflow: hidden;
            min-width: 0;/*中身が長くても伸ばさずすぐあふれさせる*/
            position: absolute;
          }
          [data-selector="channelPane"] > div > a .slot/*番組共通*/{
            border-bottom: 1px solid ${configs.border_color} !important;/*公式のボーダーを置き換える*/
            clip-path: inset(0 -100vw 0 0);/*overflowさせるのは右方向だけ*/
            background-clip: padding-box !important;/*border-leftの色を保証*/
            height: 100%;
          }
          [data-selector="channelPane"] > div > a .slot/*番組共通*/.transition/*ハイライトを付与する際のトランジション*/{
            transition: background ${configs.nav_transition};
          }
          [data-selector="channelPane"] > div > a .slot.nowonair/*放送中の番組*/{
            background: ${configs.nowOnAir_background};
          }
          [data-selector="channelPane"] > div > a .slot > div/*タイトルと放送時間*/{
            margin-left: .5em;
          }
          [data-selector="channelPane"] > div > a .slot > div/*タイトルと放送時間*/,
          [data-selector="channelPane"] > div > a .slot > div/*タイトルと放送時間*/ *{
            font-weight: normal !important;;/*公式の現在チャンネルの太字を打ち消す*/
            font-size: ${configs.channelPane_fontsize}vh;
            line-height: ${configs.channelPane_lineheight}vh;
            margin-bottom: 0;/*公式の下マージンを打ち消す*/
            white-space: nowrap;
          }
          [data-selector="channelPane"] > div > a .slot > div:nth-child(1)/*タイトル*/ > span,
          [data-selector="channelPane"] > div > a .slot > div:nth-child(2)/*放送時間*/{
            display: flex;
            align-items: center;
          }
          [data-selector="channelPane"] > div > a .slot > div:nth-child(1)/*タイトル*/ > span > span[style],
          [data-selector="channelPane"] > div > a .slot > div:nth-child(1)/*タイトル*/ > span > span[style] > *,
          [data-selector="channelPane"] > div > a .slot > div:nth-child(1)/*タイトル*/ > span > svg[width],
          [data-selector="channelPane"] > div > a .slot > div:nth-child(1)/*タイトル*/ > span > .mark,
          [data-selector="channelPane"] > div > a .slot > div:nth-child(1)/*タイトル*/ > span > .mark *{
            font-size: ${configs.channelPane_fontsize}vh;
            height: ${configs.channelPane_fontsize}vh !important;
            width: 1em !important;
            min-width: 1em !important;/*なぜかこれを指定しないとレイアウトが崩れる要素が発生する*/
          }
          [data-selector="channelPane"] > div > a .slot > div:nth-child(1)/*タイトル*/ > span > svg[width^="23"]{
            width: ${5/3}em !important;/*ちょっとトリッキーだが…*/
            min-width: ${5/3}em !important;
          }
          [data-selector="channelPane"] > div > a .slot:not(:hover) > div:nth-child(2)/*放送時間*/ *{
            color: ${configs.transparentGray};
          }
          [data-selector="channelPane"] > div > a .slot > div:nth-child(2)/*放送時間*/ > button/*通知ボタン*/,
          [data-selector="channelPane"] > div > a .slot > div:nth-child(2)/*放送時間*/ > button/*通知ボタン*/ *{
            height: ${configs.channelPane_lineheight}vh;
          }
          [data-selector="channelPane"] > div > a .slot > div:nth-child(2)/*放送時間*/ > button/*通知ボタン*/{
            padding: 0;
            margin: 0 ${configs.channelPane_padding}vh 0 calc(-${configs.channelPane_padding}vh - ${configs.channelPane_lineheight}vh - 1px/*端数対応*/);
            transition: margin ${configs.nav_transition}, transform 250ms ease-in;;
            pointer-events: auto !important;
          }
          [data-selector="channelPane"] > div > a .slot:hover > div:nth-child(2)/*放送時間*/ > button/*通知ボタン*/{
            margin: 0 .2em 0 0;
          }
          [data-selector="channelPane"] > div > a[data-current="true"] > div > div:nth-child(1)/*サムネイル枠*/,
          [data-selector="channelPane"] > div > a[data-current="true"] > div > div:nth-child(1)/*サムネイル枠*/ > div > div,
          [data-selector="channelPane"] > div > a[data-current="true"] .slot.nowonair/*放送中の番組*/,
          [data-selector="channelPane"] > div > a .slot.active/*通知番組*/{
            background: ${configs.current_background} !important;
          }
          [data-selector="channelPane"] > div > a[data-current="true"]:not(:hover) > div > div:nth-child(1)/*サムネイル枠*/ > div > div{
            opacity: .25;
          }
          [data-selector="channelPane"] > div > a[data-current="true"] .slot.nowonair > */*放送中の番組*/,
          [data-selector="channelPane"] > div > a .slot.active > */*通知番組*/{
            filter: brightness(1) !important;/*nocontentの指定を上書き*/
          }
          [data-selector="channelPane"] > div > a[data-current="true"] .slot.nowonair */*放送中の番組の中身*/,
          [data-selector="channelPane"] > div > a .slot.active */*通知番組の中身*/{
            color: white !important;
          }
          [data-selector="channelPane"] > div > a[data-onair="false"] > div > div:nth-child(1)/*サムネイル枠*/ > div > div > img/*サムネイル*/{
            visibility: hidden;
          }
          [data-selector="channelPane"] > div > a[data-onair="false"] > div > div:nth-child(1)/*サムネイル枠*/ > div > div + img/*チャンネルロゴ*/{
            visibility: visible;/*本来hover時にはロゴが消えて番組サムネイルが残る仕様だが、番組なしの時はロゴしか頼れる情報が無いので消さない*/
          }
          [data-selector="channelPane"] > div > a[data-onair="false"]:hover > div > div:nth-child(1)/*サムネイル枠*/ > div > div + img/*チャンネルロゴ*/{
            opacity: .25;/*とはいえhoverに対する反応はさせたい*/
          }
          [data-selector="channelPane"] > div > a:hover{
            opacity: 1;/*公式の不透明度をなくす*/
          }
          [data-selector="channelPane"] > div > a:hover > div > div:nth-child(1)/*サムネイル枠*/,
          [data-selector="channelPane"] > div > a:hover .slot/*番組*/{
            background: ${configs.hover_background};
          }
          [data-selector="channelPane"] > div > a > div > div:nth-child(1):hover/*サムネイル枠*/ ~ .slot.nowonair/*放送中の番組*/,
          [data-selector="channelPane"] > div > a > div > div:nth-child(1)/*サムネイル枠*/ ~ .slot:hover/*番組*/{
            overflow: visible;
            z-index: ${configs.program_zIndex};
          }
          [data-selector="channelPane"] > div > a > div > div:nth-child(1):hover/*サムネイル枠*/ ~ .slot.nowonair */*放送中の番組の中身*/,
          [data-selector="channelPane"] > div > a > div > div:nth-child(1)/*サムネイル枠*/ ~ .slot:hover */*番組の中身*/{
            color: white !important;
            pointer-events: none;/*overflowしていても後続番組にhoverをゆずる*/
          }
          [data-selector="channelPane"] > div > a:hover > div > div:nth-child(1):not(:hover)/*サムネイル枠*/ ~ .slot.nowonair:not(:hover)/*放送中の番組*/,
          [data-selector="channelPane"] > div > a:hover > div > div:nth-child(1)/*サムネイル枠*/ ~ .slot.nowonair ~ .slot:not(:hover)/*後続番組*/{
            filter: brightness(.5);
          }
          [data-selector="channelPane"] > div > a > div > div:nth-child(1):hover/*サムネイル枠*/ ~ .slot.nowonair ~ .slot > */*後続番組の中身*/,
          [data-selector="channelPane"] > div > a > div > div:nth-child(1)/*サムネイル枠*/ ~ .slot:hover/*番組*/ ~ .slot > */*後続番組の中身*/{
            opacity: .25;
          }
          [data-selector="channelPane"] > div > a:not(:hover) > div > div:nth-child(1)/*サムネイル枠*/ ~ .slot.nocontent{
            background: ${configs.noContent_background};
          }
          [data-selector="channelPane"] > div > a:not(:hover) > div > div:nth-child(1)/*サムネイル枠*/ ~ .slot.nocontent > *{
            filter: brightness(.25);
          }
          [data-selector="channelPane"] > div > a:last-child/*番組表リンク*/{
            border-left: 1px solid ${configs.border_color} !important;
            font-size: ${configs.channelPane_fontsize}vh;
            line-height: ${configs.channelPane_timetable}vh;
            padding: 0 !important;
            position: relative;
            flex: 1;
            transition: none;/*公式を上書き*/
          }
          [data-selector="channelPane"] > div > a:last-child:hover/*番組表リンク*/{
            background: rgba(128,128,128,.5);
          }
          [data-selector="channelPane"] > div > a:last-child/*番組表リンク*/ > svg{
            height: ${configs.channelPane_fontsize}vh;
          }
          /* アベマ公式 番組表の置き換え */
          html.abemaTimetable #splash > div{
            display: block;/*公式のnoneを上書き*/
          }
          html.abemaTimetable main *{/*負荷の低減を試みる*/
            transition: none !important;
            animation: none !important;
            pointer-events: none !important;
          }
          html.abemaTimetable [data-selector="progressbar"]{
            display: none;
          }
          #splash.fake > div{
            display: none;/*借り物の#splash.fakeは番組表ページ以外では隠しておく*/
          }
          #splash.fake [class*="loading"],
          #splash.fake [class*="loading"] *{
            display: none;
            animation: none;
          }
          /* アベマ公式 プログレスバー */
          [data-selector="progressbar"]{
            z-index: ${configs.progressbar_zIndex};
          }
          /* チャンネルロゴ切り替え表示 */
          [data-selector="screen"] img[src*="/logo/"]{
            visibility: hidden;/*公式のロゴは使わない*/
          }
          #${SCRIPTNAME}-channelIndicator{
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
            height: 100%;
            overflow: hidden;
            opacity: 0;
            filter: drop-shadow(0 0 2.5px rgba(0,0,0,.75));
            z-index: ${configs.channelIndicator_zIndex};
            pointer-events: none;
            transition: opacity 1000ms ease-in-out;/*消えるとき*/
          }
          #${SCRIPTNAME}-channelIndicator.active{
            opacity: 1;
            transition: opacity 500ms ease-in-out;/*現れるとき*/
          }
          #${SCRIPTNAME}-channelIndicator ul.channels{
            position: relative;
            top: 50%;
            transition: transform 500ms ease-in-out;
          }
          #${SCRIPTNAME}-channelIndicator li.channel{
            transform: translateY(-12.2vh);
            opacity: .100;/*ギリギリのコントラスト最適解*/
          }
          #${SCRIPTNAME}-channelIndicator li.channel.onair{
            opacity: .250;/*ギリギリのコントラスト最適解*/
          }
          #${SCRIPTNAME}-channelIndicator li.channel.current{
            opacity: 1;
          }
          #${SCRIPTNAME}-channelIndicator img.logo{
            width: 34.0vh;
            height: 12.8vh;
            margin: 6.1vh 0;
          }
          #${SCRIPTNAME}-channelIndicator .template{
            display: none;
          }
          /* パネル共通 */
          #${SCRIPTNAME}-panels{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
            pointer-events: none;
          }
          #${SCRIPTNAME}-panels div.panel{
            position: absolute;
            max-height: 100%;/*小さなウィンドウに対応*/
            overflow: auto;
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 50%);
            z-index: ${configs.panel_zIndex};
            background: rgba(0,0,0,.75);
            transition: ${configs.nav_transition};
            padding: 5px 0;
            pointer-events: auto;
          }
          #${SCRIPTNAME}-panels div.panel.hidden{
            bottom: 0;
            transform: translate(-50%, 100%) !important;
          }
          #${SCRIPTNAME}-panels div.panel.hidden *{
            animation: none !important;/*CPU負荷軽減*/
          }
          #${SCRIPTNAME}-panels h1,
          #${SCRIPTNAME}-panels h2,
          #${SCRIPTNAME}-panels h3,
          #${SCRIPTNAME}-panels h4,
          #${SCRIPTNAME}-panels legend,
          #${SCRIPTNAME}-panels li,
          #${SCRIPTNAME}-panels dt,
          #${SCRIPTNAME}-panels dd,
          #${SCRIPTNAME}-panels code,
          #${SCRIPTNAME}-panels p{
            color: rgba(255,255,255,1);
            font-size: 14px;
            padding: 2px 10px;
            line-height: 1.4;
          }
          #${SCRIPTNAME}-panels header{
            display: flex;
          }
          #${SCRIPTNAME}-panels header h1{
            flex: 1;
          }
          #${SCRIPTNAME}-panels div.panel > p.buttons{
            text-align: right;
            padding: 5px 10px;
          }
          #${SCRIPTNAME}-panels div.panel > p.buttons button{
            width: 120px;
            padding: 5px 10px;
            margin-left: 10px;
            border-radius: 5px;
            color: rgba(255,255,255,1);
            background: rgba(64,64,64,1);
            border: 1px solid rgba(255,255,255,1);
          }
          #${SCRIPTNAME}-panels div.panel > p.buttons button.primary{
            font-weight: bold;
            background: rgba(0,0,0,1);
          }
          #${SCRIPTNAME}-panels div.panel > p.buttons button:hover,
          #${SCRIPTNAME}-panels div.panel > p.buttons button:focus{
            background: rgba(128,128,128,.875);
          }
          #${SCRIPTNAME}-panels .template{
            display: none !important;
          }
          /* 番組表パネル */
          #${SCRIPTNAME}-timetable-panel{
            background: rgba(0,0,0,${configs.opacity}) !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            overflow: hidden !important;
            /*display: grid;*//*Chrome Gridバグ回避*/
            grid-template-columns: auto;
            grid-template-rows: 1fr auto ${configs.height}vh;
          }
          #${SCRIPTNAME}-timetable-panel > header > h1{
            display: none;
          }
          #${SCRIPTNAME}-timetable-panel > header > p.buttons{
            padding: 5px 10px;
            position: fixed;
            top: 0;
            right: 0;
            z-index: ${configs.panel_zIndex};
          }
          #${SCRIPTNAME}-timetable-panel button.config{
            fill: white;
            filter: drop-shadow(0 0 2.5px rgba(0,0,0,.75));
            padding: 5px;
            margin: -5px;
            height: 30px;
          }
          #${SCRIPTNAME}-timetable-panel button.config:hover{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-timetable-panel > .program{
            grid-column: 1;
            grid-row: 1;
            height: calc(100vh - ${configs.rowheight * 1.4}vh - ${configs.height}vh);/*Chrome Gridバグ回避*/
          }
          #${SCRIPTNAME}-timetable-panel > nav{
            grid-column: 1;
            grid-row: 2;
            position: absolute;/*Chrome Gridバグ回避*/
            bottom: ${configs.height}vh;/*Chrome Gridバグ回避*/
          }
          #${SCRIPTNAME}-timetable-panel > .programs{
            grid-column: 1;
            grid-row: 3;
            overflow: hidden;
            position: absolute !important;/*Chrome Gridバグ回避*/
            bottom: -${configs.scrollbarWidth}px;/*Chrome Gridバグ回避*/
            width: 100vw;/*Chrome Gridバグ回避*/
          }
          #${SCRIPTNAME}-timetable-panel > p.buttons:last-of-type{
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: ${configs.panel_zIndex};
          }
          #${SCRIPTNAME}-timetable-panel h1,
          #${SCRIPTNAME}-timetable-panel h2,
          #${SCRIPTNAME}-timetable-panel h3,
          #${SCRIPTNAME}-timetable-panel h4,
          #${SCRIPTNAME}-timetable-panel legend,
          #${SCRIPTNAME}-timetable-panel li,
          #${SCRIPTNAME}-timetable-panel dt,
          #${SCRIPTNAME}-timetable-panel dd,
          #${SCRIPTNAME}-timetable-panel code,
          #${SCRIPTNAME}-timetable-panel p{
            padding: .1em .5em;
          }
          #${SCRIPTNAME}-timetable-panel a{
            color: ${configs.link_color};
            text-decoration: none;
          }
          #${SCRIPTNAME}-timetable-panel a:hover{
            color: ${configs.linkHover_color};
          }
          /* 番組情報 */
          #${SCRIPTNAME}-timetable-panel > .program{
            word-wrap: break-word;
            margin-right: -${configs.scrollbarWidth}px;/*スクロールバーを隠す*/
            -webkit-mask-image: linear-gradient(black 90%, rgba(0,0,0,.5));/*まだ-webkit取れない*/
            mask-image: linear-gradient(black 90%, rgba(0,0,0,.5));
            position: relative;
            overflow-x: hidden;
            overflow-y: scroll;
            display: grid;
            grid-template-columns: 2fr 2fr 2fr 1fr 1fr;
            grid-template-rows: ${configs.lineheight * 1.5}vh auto ${configs.lineheight * .825}vh;
            transition: opacity 500ms ease;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .thumbnails,
          #${SCRIPTNAME}-timetable-panel > .program > .summary,
          #${SCRIPTNAME}-timetable-panel > .program > .content{
            max-width: 25vw;/*max指定しておけばword-break-allしなくてすむ*/
          }
          #${SCRIPTNAME}-timetable-panel > .program > .casts,
          #${SCRIPTNAME}-timetable-panel > .program > .crews{
            max-width: 12.5vw;
          }
          #${SCRIPTNAME}-timetable-panel > .program *{
            font-size: ${configs.fontsize}vh;
            line-height: ${configs.lineheight}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .program.nocontent{
            opacity: .25;
          }
          /* 番組情報 タイトル */
          #${SCRIPTNAME}-timetable-panel > .program > h2{
            white-space: nowrap;
            grid-column: 2 / 6;
            grid-row: 1;
          }
          #${SCRIPTNAME}-timetable-panel > .program > h2 *{
            font-size: ${configs.fontsize * 1.5}vh;
            line-height: ${configs.lineheight * 1.5}vh;
            vertical-align: middle;
          }
          #${SCRIPTNAME}-timetable-panel > .program > h2 > .mark,
          #${SCRIPTNAME}-timetable-panel > .program > h2 > .mark *{
            height: ${configs.fontsize * 1.5}vh !important;
          }
          /* 番組情報 サムネイル */
          #${SCRIPTNAME}-timetable-panel > .program > .thumbnails{
            grid-column: 1;
            grid-row: 1 / 4;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .thumbnails img:first-child{
            width: calc(100% - 2vh);
          }
          #${SCRIPTNAME}-timetable-panel > .program > .thumbnails img{
            width: calc(50% - 1.5vh);
            margin: 1vh 0 0 1vh;
            transition: opacity 500ms ease;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .thumbnails img.loading{
            opacity: 0;
          }
          /* 番組情報 サマリ */
          #${SCRIPTNAME}-timetable-panel > .program > .summary{
            grid-column: 2;
            grid-row: 2 / 4;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary .inactive{
            display: none;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary h3 > *{
            vertical-align: middle;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary button,
          #${SCRIPTNAME}-timetable-panel > .program > .summary button > *{
            width: calc(${configs.fontsize}vh + .2em);/*限界まで膨れさせる*/
            height: calc(${configs.fontsize}vh + .2em);
            bottom: -.2em;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary button.repeat_all,
          #${SCRIPTNAME}-timetable-panel > .program > .summary button.repeat_all > *{
            width: calc(${configs.fontsize}vh + .4em);/*限界まで膨れさせる*/
            height: calc(${configs.fontsize}vh + .4em);
            bottom: 0em;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary a + *,
          #${SCRIPTNAME}-timetable-panel > .program > .summary button + *{
            margin-left: .25em;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary li header{
            background: ${configs.listed_background};
            border-radius: calc(${configs.lineheight / 2}vh);
            padding: .1em calc(${configs.fontsize / 2}vh - .1em) .1em 0;
            display: inline;
            cursor: pointer;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary li header button + .date + *{
            margin-left: 1em;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary li header .mark,
          #${SCRIPTNAME}-timetable-panel > .program > .summary li header .mark *{
            height: ${configs.fontsize}vh;
            vertical-align: -0.15em;/*インラインでフォントのベースラインの違いを吸収してできるだけ自然に見せるための最善策*/
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary li header:hover,
          #${SCRIPTNAME}-timetable-panel > .program > .summary li.current header{
            color: ${configs.transparentGray};
            background: ${configs.listed_backgroundHover};
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary li header:hover .mark,
          #${SCRIPTNAME}-timetable-panel > .program > .summary li.current header .mark{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-timetable-panel > .program > .summary li.current header{
            cursor: auto;
          }
          /* 番組情報 番組概要 */
          #${SCRIPTNAME}-timetable-panel > .program > .content{
            grid-column: 3;
            grid-row: 2 / 4;
          }
          /* 番組情報 キャスト・スタッフ */
          #${SCRIPTNAME}-timetable-panel > .program > .casts{
            grid-column: 4;
            grid-row: 2 / 3;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .crews{
            grid-column: 5;
            grid-row: 2 / 3;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .casts .name,
          #${SCRIPTNAME}-timetable-panel > .program > .crews .name{
            color: black;
            background: white;
            padding: 1px calc(${configs.fontsize / 2}vh - .2em);
            border-radius: calc(${configs.lineheight / 2}vh);
            margin: 0 1px;
            cursor: pointer;
          }
          #${SCRIPTNAME}-timetable-panel > .program > .casts .name:hover,
          #${SCRIPTNAME}-timetable-panel > .program > .crews .name:hover{
            filter: brightness(.5);
          }
          /* 番組情報 コピーライト */
          #${SCRIPTNAME}-timetable-panel > .program > .copyrights{
            font-size: ${configs.fontsize * .825}vh;
            line-height: ${configs.lineheight * .825}vh;
            text-align: right;
            padding: 0 1vh;
            grid-column: 3 / 6;
            grid-row: 3;
          }
          /* 番組表ナビゲーション */
          #${SCRIPTNAME}-timetable-panel > nav{
            display: flex;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift{
            flex: 1;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search{
            width: ${100*(1/3)}vw;
          }
          /* 番組表ナビゲーション 日付・時間 */
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift{
            display: flex;
            align-items: center;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift .days{
            width: calc((${100*(2/3)}vw - ${NAMEWIDTH}vw)/2 + ${NAMEWIDTH}vw - 2vh);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift .times{
            width: calc((${100*(2/3)}vw - ${NAMEWIDTH}vw)/2);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times{
            font-size: ${configs.rowfontsize}vh;
            line-height: ${configs.rowheight}vh;
            height: ${configs.rowheight}vh;
            padding: 0;
            margin: .2em 0 .2em 1vh;
            border-radius: .5em;
            overflow: hidden;
            display: flex;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days input,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times input{
            display: none;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times label{
            color: white;
            background: rgba(112,112,112,.25);
            text-align: center;
            white-space: nowrap;
            width: 100%;
            margin-left: 1px;
            padding: 0 1px;
            min-width: 1em;
            overflow: hidden;
            flex: 1;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label:first-of-type{
            min-width: calc(${NAMEWIDTH}vw - 1vh - 1px);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label:first-of-type,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times label:first-of-type{
            margin-left: 0;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days input:not(:checked) + label,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times input:not(:checked) + label{
            cursor: pointer;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days input:checked + label,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label:hover,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label:focus,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times input:checked + label,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times label:hover,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times label:focus{
            background: rgba(112,112,112,.75);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label.sat{
            background: rgba(112,160,192,.25);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label.sun{
            background: rgba(192,112,112,.25);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days input:checked + label.sat,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label.sat:hover,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label.sat:focus{
            background: rgba(112,160,192,.75);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days input:checked + label.sun,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label.sun:hover,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label.sun:focus{
            background: rgba(192,112,112,.75);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times input:disabled + label{
            color: black;
            opacity: .25;
            cursor: auto;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .days label > .fit,
          #${SCRIPTNAME}-timetable-panel > nav > .timeshift > .times label > .fit{
            display: block;/*以下、チャンネル名幅調整用*/
            transform-origin: left;
            transition: transform ${configs.nav_transition};
          }
          /* 番組表ナビゲーション 検索 */
          #${SCRIPTNAME}-timetable-panel > nav > .search{
            font-size: ${configs.rowfontsize}vh;
            line-height: ${configs.rowheight}vh;
            padding: 0;
            display: flex;
            align-items: center;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search > input[type="search"]{
            border: 1px solid transparent;/*ブラウザデフォルトスタイルの解消も兼ねる*/
            border-radius: .2em 0 0 .2em;
            height: ${configs.rowheight}vh;
            box-sizing: content-box;
            width: 100%;
            min-width: 0;/*幅が足りなければ素直に縮ませる*/
            padding: 0 0 0 .5em;
            margin: .2em 0 .2em 1vh;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search > button.search{
            background: rgb(192,192,192);
            border: 1px solid transparent;
            border-radius: 0 .2em .2em 0;
            flex-shrink: 0;
            height: ${configs.rowheight}vh;
            box-sizing: content-box;
            padding: 0 .5em;
            margin: .2em 1vh .2em 0;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search > button.search:hover{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search > button.search > svg{
            width: ${configs.rowfontsize}vh;
            height: ${configs.rowfontsize}vh;
            fill: white;
            vertical-align: middle;
          }
          /* 番組表ナビゲーション 通知 */
          #${SCRIPTNAME}-timetable-panel > nav > .search > button.notifications{
            font-size: ${configs.rowfontsize}vh;
            white-space: nowrap;
            margin-right: ${(configs.height < 90) ? '1vh' : 'calc(1vh + 30px)'};/*設定ボタンにかぶらないように*/
            display: flex;
            align-items: center;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search > button.notifications:hover{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search > button.notifications > *{
            flex-shrink: 0;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search > button.notifications svg{
            fill: ${configs.activeButton_color};
            filter: brightness(1.25);/*視認性を高める*/
            width: ${configs.rowheight}vh;
            height: ${configs.rowheight}vh;
            margin-right: .2em;
          }
          #${SCRIPTNAME}-timetable-panel > nav > .search > button.notifications[data-count="0"] svg{
            fill: ${configs.transparentGray};
            filter: brightness(1);
          }
          /* 番組表 */
          #${SCRIPTNAME}-timetable-panel > .programs{
            position: relative;
          }
          #${SCRIPTNAME}-timetable-panel .channels{
            position: relative;
            left: ${NAMEWIDTH}vw;
            width: ${100 - NAMEWIDTH}vw;
            padding: 0;
            overflow-y: hidden;
            transition: width ${configs.nav_transition};/*listPaneの開閉用*/
          }
          #${SCRIPTNAME}-timetable-panel .list.active ~ .channels{
            width: calc(${100*(2/3) - NAMEWIDTH}vw - 1px);
          }
          #${SCRIPTNAME}-timetable-panel .channels *{
            color: white;
            font-size: ${configs.rowfontsize}vh;
            line-height: ${configs.rowheight}vh;
            white-space: nowrap;
          }
          #${SCRIPTNAME}-timetable-panel .channels > li{
            background: linear-gradient(${configs.border_color} 1px, transparent 1px);
            height: ${configs.rowheight}vh;
            padding: 0;
            position: relative;
          }
          #${SCRIPTNAME}-timetable-panel .channels > li.channel{
            overflow: hidden;
          }
          #${SCRIPTNAME}-timetable-panel .channels > li > header{
            padding: 0;
            border-top: 1px solid ${configs.border_color};
            border-right: 1px solid ${configs.border_color};
            text-align: center;
            position: fixed;
            left: 0;
            width: ${NAMEWIDTH}vw;
            overflow: hidden;/*これを指定しないとFirefoxでposition:fixedが狂うバグあり*/
            cursor: pointer;
            transition: transform ${configs.nav_transition};/*初回左右からの登場用*/
          }
          #${SCRIPTNAME}-timetable-panel .channels > li.channel > header{
            background: ${configs.nowOnAir_background};
            background-clip: padding-box !important;
          }
          #${SCRIPTNAME}-timetable-panel .channels > li.channel.notonair > header{
            pointer-events: none;/*放送してないチャンネルはクリッカブルにしない*/
          }
          #${SCRIPTNAME}-timetable-panel .channels > li > header > .name{
            width: 100%;
            padding: 0;
            text-align: center;
            transform-origin: left;/*以下、チャンネル名幅調整用*/
            transition: transform ${configs.nav_transition};
          }
          #${SCRIPTNAME}-timetable-panel .channels > li > .stream{
            width: 100%;
            position: relative;
            transition: transform ${configs.nav_transition};/*初回左右からの登場用(疑似スクロール処理時はjsで上書きする)*/
          }
          #${SCRIPTNAME}-timetable-panel .channels > li.animate,
          #${SCRIPTNAME}-timetable-panel .channels > li.animate *{
            pointer-events: none !important;/*position:fixedバグの回避*/
          }
          #${SCRIPTNAME}-timetable-panel .channels > li.animate > header,
          #${SCRIPTNAME}-timetable-panel .channels > li.animate > .stream{
            will-change: transform;/*position:fixedが狂うバグが発生するのでGrid時はコメントアウト*/
          }
          #${SCRIPTNAME}-timetable-panel .channels > li.hidden > header{
            transform: translateX(-${NAMEWIDTH}vw);/*これもposition:fixedが狂うバグに関与している*/
          }
          #${SCRIPTNAME}-timetable-panel .channels > li.hidden > .stream{
            transform: translateX(${100 - NAMEWIDTH}vw);
          }
          /* 番組表 時刻・個別番組共通 */
          #${SCRIPTNAME}-timetable-panel .channels .slot{
            padding: 0;
            border-top: 1px solid ${configs.border_color};
            border-right: 1px solid ${configs.border_color};
            position: absolute;
            overflow: hidden;
            display: flex;
            align-items: center;/*.markを中央揃え*/
            cursor: pointer;
            transition: opacity ${configs.nav_transition};/*出現時(1分シフト時はjsで上書きする)*/
          }
          #${SCRIPTNAME}-timetable-panel .channels .slot.transition/*ハイライトを付与する際専用のトランジション*/{
            transition: background ${configs.nav_transition};
          }
          #${SCRIPTNAME}-timetable-panel .channels .slot > *{
            flex-shrink: 0;
            pointer-events: none;/*e.targetをli.programに統一 & overflowしていても後続番組にhoverをゆずる*/
          }
          #${SCRIPTNAME}-timetable-panel .channels .hour > *:nth-child(1)/*時刻*/,
          #${SCRIPTNAME}-timetable-panel .channels .program > *:nth-child(2)/*(通知ボタンの次の)時刻*/,
          #${SCRIPTNAME}-timetable-panel .channels .program > *:nth-child(3)/*タイトルまたはmark*/{
            margin-left: .25em;
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time .hour:not(.nowonair) .time,
          #${SCRIPTNAME}-timetable-panel .channels > .channel:not(:hover) .program:not(.active):not(.shown) .time{
            color: ${configs.transparentGray};/*区切りとしての役割も果たす*/
          }
          /* 番組表 時刻列 */
          #${SCRIPTNAME}-timetable-panel .channels > .time > header{
            background: ${configs.times_background};/*ボタンの色で上書きされる*/
            height: ${configs.rowheight}vh;
            cursor: default;
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time > header > button{
            background: ${configs.nowOnAir_background};
            width: 100%;
            height: ${configs.rowheight}vh;
            overflow: hidden;
            display: block;
            position: absolute;/*重ね合わせる*/
            bottom: 0;/*baselineを合わせるためになぜか必要*/
            transition: opacity 500ms ease;
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time > header > button.disabled,
          html.abemaTimetable #${SCRIPTNAME}-timetable-panel .channels > .time > header > button.abemaTimetable/*すでに番組表ページにいる*/{
            opacity: 0;
            cursor: default;
            pointer-events: none;
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time > header > button.abemaTimetable{
            background: ${configs.times_background};
            fill: white;
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time > header > button.abemaTimetable svg{
            width: ${(configs.rowheight + configs.rowfontsize) / 2}vh;
            height: ${configs.rowheight}vh;
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time > header > button.now{
            text-align: right !important;
            padding-right: .25em;
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time > header > button:hover,
          #${SCRIPTNAME}-timetable-panel .channels .hour:hover{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time > header > button.now .arrows{
            display: inline-block;
            transition: transform 500ms ease;
          }
          #${SCRIPTNAME}-timetable-panel .channels > .time > header > button.now.disabled .arrows{
            transform: translateX(1.25em);
            pointer-events: none;
          }
          #${SCRIPTNAME}-timetable-panel .channels .times .hour:nth-child(2)/*clock*/{
            padding-left: 1px;
          }
          #${SCRIPTNAME}-timetable-panel .channels .times .hour .time .clock:not(.pause)/*Firefox<57対策*/ .blink{
            animation: ${SCRIPTNAME}-blink 2s step-end infinite;
          }
          @keyframes ${SCRIPTNAME}-blink{
            50%{opacity: .5}
          }
          #${SCRIPTNAME}-timetable-panel .channels .day{
            border-right: 1px solid ${configs.border_color};
            height: ${configs.height}vh;
            position: absolute;
            overflow: hidden;
            cursor: auto;
          }
          #${SCRIPTNAME}-timetable-panel .channels .day .date{
            color: rgba(255,255,255,.125);
            font-weight: bold;
            font-size: ${configs.height}vh;
            line-height: ${configs.height}vh;
          }
          #${SCRIPTNAME}-timetable-panel .channels .hour{
            background: ${configs.times_background};
          }
          /* 番組表 個別番組 */
          #${SCRIPTNAME}-timetable-panel .channels .program.hidden{
            opacity: 0;
          }
          #${SCRIPTNAME}-timetable-panel .channels .program{
            background: ${configs.comming_background};
          }
          #${SCRIPTNAME}-timetable-panel .channels .program > button,
          #${SCRIPTNAME}-timetable-panel .channels .program > button *{
            height: calc(${configs.rowheight}vh - 1px);/*borderぶん*/
          }
          #${SCRIPTNAME}-timetable-panel .channels .program > button{
            padding: 0;
            margin: 0 0 0 calc(-${configs.rowheight}vh + 1px);
            opacity: 0;/*端数ピクセルがチラ見えしてしまうことがあるので*/
            transition: margin ${configs.nav_transition}, transform 250ms ease-in;
            pointer-events: auto;
          }
          #${SCRIPTNAME}-timetable-panel .channels .program.shown > button{
            margin-left: .25em;
            opacity: 1;
          }
          #${SCRIPTNAME}-timetable-panel .channels .program > .mark,
          #${SCRIPTNAME}-timetable-panel .channels .program > .mark *{
            height: ${configs.fontsize}vh;
          }
          #${SCRIPTNAME}-timetable-panel .channels .program.nowonair{
            background: ${configs.nowOnAir_background};
            padding-left: ${BOUNCINGPIXEL}px;
          }
          #${SCRIPTNAME}-timetable-panel .channels .program.nowonair > button{
            display: none;
          }
          #${SCRIPTNAME}-timetable-panel .channels .program > .time{
            transition: max-width 1000ms ease, margin-left 1000ms ease;
            max-width: 3em;
            overflow: hidden;
          }
          #${SCRIPTNAME}-timetable-panel .channels .program.nowonair > .time{
            max-width: 0;
            margin-left: 0;
          }
          #${SCRIPTNAME}-timetable-panel .channels .program.shown/*番組情報表示中の番組*/,
          #${SCRIPTNAME}-timetable-panel .channels .channel:hover header,
          #${SCRIPTNAME}-timetable-panel .channels .channel:hover .program{
            background: ${configs.hover_background} !important;
          }
          #${SCRIPTNAME}-timetable-panel .channels header:hover + .stream .program.nowonair,
          #${SCRIPTNAME}-timetable-panel .channels .program:hover{
            overflow: visible;
            clip-path: inset(0 -100vw 0 0);/*overflowさせるのは右方向だけ*/
            z-index: ${configs.program_zIndex};
          }
          #${SCRIPTNAME}-timetable-panel .channels .channel:hover header:not(:hover),
          #${SCRIPTNAME}-timetable-panel .channels .channel:hover header:not(:hover) + .stream .program.nowonair:not(:hover),
          #${SCRIPTNAME}-timetable-panel .channels .channel:hover .program:not(:hover):not(.nowonair)/*後続番組*/{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-timetable-panel .channels header:hover + .stream .program:not(.nowonair) > */*後続番組の中身*/,
          #${SCRIPTNAME}-timetable-panel .channels .channel:hover .program:not(:hover):not(.nowonair) > */*後続番組の中身*/{
            opacity: .25;
          }
          html:not(.abemaTimetable) #${SCRIPTNAME}-timetable-panel .channels .channel.current header,
          html:not(.abemaTimetable) #${SCRIPTNAME}-timetable-panel .channels .channel.current .program.nowonair,
          #${SCRIPTNAME}-timetable-panel .channels .program.active{
            background: ${configs.current_background} !important;
          }
          #${SCRIPTNAME}-timetable-panel .channels .channel:not(:hover) .program.nocontent{
            background: ${configs.noContent_background};
          }
          #${SCRIPTNAME}-timetable-panel .channels .channel:not(:hover) .program.nocontent:not(.shown) .title{
            opacity: .25;
          }
          #${SCRIPTNAME}-timetable-panel .channels .channel .program.padding/*空き枠*/{
            cursor: auto;
          }
          /* 番組表スクローラ */
          #${SCRIPTNAME}-timetable-panel .scrollers{
            font-size: ${configs.fontsize}vh;/*emサイズ指定用*/
            position: absolute;
            bottom: 0;
            left: ${NAMEWIDTH}vw;
            width: ${100 - NAMEWIDTH}vw;
            height: 100%;
            z-index: ${configs.scrollers_zIndex};
            pointer-events: none;
          }
          #${SCRIPTNAME}-timetable-panel .scrollers button.disabled{
            pointer-events: none;
            opacity: 0;
          }
          #${SCRIPTNAME}-timetable-panel .scrollers button{
            background: ${configs.scroller_background};
            border-radius: 5em;
            width: 5em;
            height: 5em;
            transform: translateY(50%);
            position: absolute;
            bottom: 50%;
            opacity: .25;
            transition: opacity ${configs.nav_transition}, right ${configs.nav_transition};
            pointer-events: auto;
          }
          #${SCRIPTNAME}-timetable-panel .scrollers button:hover{
            opacity: 1;
          }
          #${SCRIPTNAME}-timetable-panel .scrollers button.left{
            left: .5em;
          }
          #${SCRIPTNAME}-timetable-panel .scrollers button.right{
            right: .5em;
          }
          #${SCRIPTNAME}-timetable-panel .list.active ~ .scrollers button.right{
            right: calc(${100*(1/3)}vw + .5em);
            opacity: 1;
          }
          #${SCRIPTNAME}-timetable-panel .scrollers button > *{
            width: 2em;
            height: 2em;
            vertical-align: middle;
            opacity: .5;
          }
          /* 番組リスト */
          #${SCRIPTNAME}-timetable-panel > .programs > .list{
            background: ${configs.list_background};
            border-top: 1px solid ${configs.border_color};
            border-left: 1px solid ${configs.border_color};
            width: calc(${100*(1/3)}vw + 1px + ${configs.scrollbarWidth}px);
            height: 100%;
            box-sizing: border-box;
            margin-right: -${configs.scrollbarWidth}px;/*スクロールバーを隠す*/
            -webkit-mask-image: linear-gradient(black 90%, rgba(0,0,0,.5));/*まだ-webkit取れない*/
            mask-image: linear-gradient(black 90%, rgba(0,0,0,.5));
            overflow-x: hidden;
            overflow-y: scroll;
            position: absolute;
            top: 0;
            right: 0;
            z-index: ${configs.list_zIndex};
            transform: translateX(100%);
            transition: transform ${configs.nav_transition};
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list.active,
          #${SCRIPTNAME}-timetable-panel > .programs > .list:hover{
            transform: translateX(0);
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list *{
            font-size: ${configs.list_fontsize}vh;
            line-height: ${configs.list_lineheight}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list header{
            display: block;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list header .count{
            padding: .1em 0;/*隣に並ぶ.1emボーダー付きボタンと高さを合わせる*/
            border: 1px solid transparent;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .mark,
          #${SCRIPTNAME}-timetable-panel > .programs > .list .mark *{
            height: ${configs.list_fontsize}vh;
            line-height: ${configs.list_fontsize}vh;
          }
          /* 番組リスト 検索フィルタ */
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters{
            width: calc(100% - 2vh);
            padding: 0;
            margin: .25em 1vh;
            border: 1px solid transparent;/*検索欄とツラ合わせしやすく*/
            height: calc(${configs.list_lineheight}vh + .5em);
            border-radius: .5em;
            overflow: hidden;
            display: flex;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input{
            display: none;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters label::before{
            content: '✓';
            color: black;
            font-size: ${configs.list_lineheight}vh;
            left: .1em;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input:checked + label::before{
            color: white;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input + label{
            color: ${configs.transparentGray};/*:not:checked*/
            filter: brightness(.25);/*:not:checked*/
            background: rgba(96,96,96,.75);
            white-space: nowrap;
            position: relative;
            margin-left: 1px;
            overflow: hidden;
            flex: 1;
            display: flex;
            align-items: center;/*.markを中央揃え*/
            cursor: pointer;
            transition: background ${configs.nav_transition};
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input:checked + label{
            color: white;
            filter: brightness(1);
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input + label:hover{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input:checked + label:hover{
            filter: brightness(.75);
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input + label.notify{
            background: ${configs.activeButton_color};
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input + label > *{
            flex-shrink: 0;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input + label > .mark,
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input + label > .mark *{
            font-size: ${(configs.list_fontsize + configs.list_lineheight) / 2}vh;
            height: ${(configs.list_fontsize + configs.list_lineheight) / 2}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .filters input + label:first-of-type{
            margin-left: 0;
          }
          /* 番組リスト 検索フィルタ絞り込み結果 */
          #${SCRIPTNAME}-timetable-panel > .programs > .list[data-mode="search"] > ul li.program{
            display: none;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list[data-mode="search"] > ul.live li.program.live,
          #${SCRIPTNAME}-timetable-panel > .programs > .list[data-mode="search"] > ul.newcomer li.program.newcomer,
          #${SCRIPTNAME}-timetable-panel > .programs > .list[data-mode="search"] > ul.first li.program.first,
          #${SCRIPTNAME}-timetable-panel > .programs > .list[data-mode="search"] > ul.last li.program.last,
          #${SCRIPTNAME}-timetable-panel > .programs > .list[data-mode="search"] > ul.bingeWatching li.program.bingeWatching,
          #${SCRIPTNAME}-timetable-panel > .programs > .list[data-mode="search"] > ul.recommendation li.program.recommendation,
          #${SCRIPTNAME}-timetable-panel > .programs > .list[data-mode="search"] > ul.none li.program.none{
            display: grid;
          }
          /* 番組リスト 通知種別タブ */
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs{
            margin: .25em 0;
            display: flex;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input{
            display: none;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input + label{
            color: rgb(128,128,128);
            padding: .25em 1vh;
            border-bottom: 1px solid rgb(64,64,64);
            flex-grow: 1;
            display: flex;
            align-items: center;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input:not(:checked) + label:hover{
            color: rgb(192,192,192);
            cursor: pointer;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input:checked + label{
            color: rgb(256,256,256);
            border: 1px solid rgb(64,64,64);
            border-bottom: none;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input:checked + label:first-of-type{
            border-left: none;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input:checked + label:last-of-type{
            border-right: none;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input + label > svg{
            fill: rgb(128,128,128);
            height: ${configs.list_fontsize}vh;
            width: auto;
            margin-right: .2em;
            flex-shrink: 0;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input:not(:checked) + label:hover > svg{
            fill: rgb(192,192,192);
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .tabs > input:checked + label > svg{
            fill: rgb(256,256,256);
          }
          /* 番組リスト サマリ(件数・検索通知ボタン・期限切れ削除ボタン) */
          #${SCRIPTNAME}-timetable-panel > .programs > .list .summary{
            padding: 0;
            margin: .5em 1vh;
            display: flex;
            align-items: center;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .summary > *{
            white-space: nowrap;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list .summary .count{
            flex: 1;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.auto_search,
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.delete_all{
            background: rgba(96,96,96,.75);
            border: .1em solid transparent;
            border-radius: 50vmax;
            padding: .1em calc(${configs.list_fontsize / 2}vh - 1px);
            margin: 0 .25em;
            flex-shrink: 0;
            display: flex;
            align-items: center;/*.markを中央揃え*/
            transition: transform 250ms ease-in;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.auto_search:hover,
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.delete_all:hover{
            background: rgba(96,96,96,.25);
            filter: brightness(1);/*打ち消し*/
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.auto_search.reversing,
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.delete_all.reversing{
            transform: scaleY(0);
            transition: transform 250ms ease-out;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.auto_search.active,
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.delete_all.active{
            background: ${configs.activeButton_color};
            border: .1em solid white;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.auto_search > *,
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.delete_all > *{
            margin-right: .25em;
            transform: scaleX(1);
            flex-shrink: 0;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.auto_search > svg:first-child/*検索アイコン*/,
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.delete_all > svg:first-child/*検索アイコン*/{
            fill: white;
            width: calc(${configs.list_fontsize}vh + .25em);/*膨れさせる*/
            height: calc(${configs.list_fontsize}vh + .25em);/*膨れさせる*/
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list button.auto_search .mark{
            margin-left: .125em;
            margin-right: .125em;
          }
          /* 番組リスト 個別番組 */
          #${SCRIPTNAME}-timetable-panel > .programs > .list > *:last-child{
            margin-bottom: 10% !important;/* OKボタンとの重なりを回避(10%はmask-imageによる影が始まる位置) */
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list > ul ul{
            padding: 0;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program{
            height: calc(${configs.list_fontsize + configs.list_lineheight}vh);/*この高さがh2,間隙,.dataの高さになる*/
            padding: 0;
            margin: .5vh 1vh 1vh 1vh;
            display: grid;
            grid-template-columns: calc(${configs.list_lineheight * 2 * (16/9)}vh) 1fr;
            grid-template-rows: ${configs.list_lineheight}vh ${configs.list_lineheight}vh;
            height: ${configs.list_lineheight * 2}vh;
            cursor: pointer;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program:hover{
            filter: brightness(.75);
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .thumbnail{
            width:  calc(${configs.list_lineheight * 2 * (16/9)}vh);
            height: calc(${configs.list_lineheight * 2}vh);
            padding: 0;
            grid-column: 1;
            grid-row: 1 / 2;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .thumbnail img{
            display: block;
            width: auto;/*4:3もある*/
            max-width:  calc(${configs.list_lineheight * 2 * (16/9)}vh - 1px);/*端数処理ではみ出すのを防ぐ*/
            height: calc(${configs.list_lineheight * 2}vh);
            margin: 0 auto;
            transition: opacity 500ms ease;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .thumbnail img.loading{
            opacity: 0;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > h2,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data{
            white-space: nowrap;
            padding: 0 1vh;
            display: flex;
            align-items: center;/*.markを中央揃え*/
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > h2 > *,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data > *{
            flex-shrink: 0;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > h2{
            height: ${(configs.list_lineheight + configs.list_fontsize) / 2}vh;/*ほどよく切り詰める*/
            grid-column: 2;
            grid-row: 1;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > h2 .mark,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > h2 .mark *{
            height: ${configs.list_fontsize}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > h2 .title{
            vertical-align: middle;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data{
            color: ${configs.transparentGray};
            vertical-align: middle;
            grid-column: 2;
            grid-row: 2;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data > a/*見逃し・ビデオ再生ボタン*/{
            height: ${configs.list_lineheight}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data button.play,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data button.play > *,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data button.notify,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data button.notify > *{
            font-size: ${configs.fontsize}vh;/*emサイズを合わせる*/
            height: ${configs.list_lineheight}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data button.myvideo,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data button.myvideo > *{
            font-size: ${configs.fontsize * .75}vh;/*emサイズを合わせる*/
            height: ${configs.list_lineheight * .75}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data button{
            margin-right: 0;/*マイナス指定を打ち消す*/
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.program > .data button:last-of-type + * ~ *{
            margin-left: 1em;
          }
          /* 番組リスト もっとみる */
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.more > button.search_more{
            color: black;
            background: white;
            border-radius: 50vmax;
            padding: 1px calc(${configs.list_fontsize / 2}vh - 1px);
            display: flex;
            align-items: center;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.more > button.search_more > svg:first-child/*検索アイコン*/{
            fill: black;
            width: ${configs.list_fontsize}vh;
            height: ${configs.list_fontsize}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.more > button.search_more:hover{
            filter: brightness(.5);
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.more > button.search_more.searching/*検索中*/ > svg:first-child{
            animation: ${SCRIPTNAME}-spin 250ms infinite alternate cubic-bezier(.45,.05,.55,.95)/*sin*/;
          }
          @keyframes ${SCRIPTNAME}-spin{/*CPU食うので注意*/
            from{
              transform: scaleX(1);
            }
            to{
              transform: scaleX(-1);
            }
          }
          /* 番組リスト 通知(種類別・日付別・毎回通知・検索通知共通) */
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.type,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.day,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.repeat,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.search{
            padding: 0;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.type > h2,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.day > h2,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.repeat > h2,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.search > h2{
            padding-left: 1vh;
            white-space: nowrap;
            display: flex;
            align-items: center;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.repeat > h2 button + *,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.search > h2 button + *{
            margin-left: .25em;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.noprogram{
            color: gray;
            padding-left: 1vh;
          }
          /* 番組リスト 通知(毎回通知) */
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.repeat > h2 button,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.repeat > h2 button > *{
            width: ${configs.list_lineheight * .8}vh;
            height: ${configs.list_lineheight * .8}vh;
          }
          /* 番組リスト 通知(検索通知) */
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.search > h2 button,
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.search > h2 button > *{
            height: ${configs.list_lineheight}vh;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.search > h2 button > *{
            fill: ${configs.activeButton_color};
            background: transparent;
            border: none;
            filter: brightness(1.25);
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.search > h2 .key{
            display: flex;
            align-items: center;
          }
          #${SCRIPTNAME}-timetable-panel > .programs > .list li.search > h2 .key .mark{
            margin-left: .125em;
            margin-right: .125em;
          }
          /* 設定パネル */
          #${SCRIPTNAME}-config-panel{
            width: 360px;
          }
          #${SCRIPTNAME}-config-panel fieldset p,
          #${SCRIPTNAME}-config-panel fieldset li{
            padding-left: calc(10px + 1em);
          }
          #${SCRIPTNAME}-config-panel fieldset p:hover,
          #${SCRIPTNAME}-config-panel fieldset li:hover{
            background: rgba(255,255,255,.25);
          }
          #${SCRIPTNAME}-config-panel fieldset p.disabled,
          #${SCRIPTNAME}-config-panel fieldset li.disabled{
            opacity: .5;
          }
          #${SCRIPTNAME}-config-panel fieldset .sub{
            padding-left: calc(10px + 2em);
          }
          #${SCRIPTNAME}-config-panel label{
            display: block;
          }
          #${SCRIPTNAME}-config-panel input{
            width: 80px;
            height: 20px;
            position: absolute;
            right: 10px;
          }
          #${SCRIPTNAME}-config-panel fieldset ul.channels{
            columns: 2;
            column-gap: 0;
          }
          #${SCRIPTNAME}-config-panel fieldset ul.channels li input{
            width: 20px;
            vertical-align: bottom;
            margin-right: .25em;
            position: static;
          }
        </style>
      `,
    },
  };
  const setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, setInterval = window.setInterval, clearInterval = window.clearInterval, requestAnimationFrame = window.requestAnimationFrame;
  const getComputedStyle = window.getComputedStyle, fetch = window.fetch;
  if(!('animate' in HTMLElement.prototype)) HTMLElement.prototype.animate = function(){};
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
  const $ = function(s){return document.querySelector(s)};
  const $$ = function(s){return document.querySelectorAll(s)};
  const animate = function(callback, ...params){requestAnimationFrame(() => requestAnimationFrame(() => callback(...params)))};
  const sequence = function(){
    let chain = [], defer = function(callback, delay, ...params){(delay) ? setTimeout(callback, delay, ...params) : animate(callback, ...params)};
    for(let i = arguments.length - 1, delay = 0; 0 <= i; i--, delay = 0){
      if(typeof arguments[i] === 'function'){
        for(let j = i - 1; typeof arguments[j] === 'number'; j--) delay += arguments[j];
        let f = arguments[i], d = delay, callback = chain[chain.length - 1];
        chain.push(function(pass){defer(function(ch){ch ? ch(f(pass)) : f(pass);}, d, callback)});/*nearly black magic*/
      }
    }
    chain[chain.length - 1]();
  };
  const observe = function(element, callback, options = {childList: true, attributes: false, characterData: false}){
    let observer = new MutationObserver(callback.bind(element));
    observer.observe(element, options);
    return observer;
  };
  const createElement = function(html = '<span></span>'){
    let outer = document.createElement('div');
    outer.innerHTML = html;
    return outer.firstElementChild;
  };
  const getScrollbarWidth = function(){
    let div = document.createElement('div');
    div.textContent = 'dummy';
    document.body.appendChild(div);
    div.style.overflowY = 'scroll';
    let clientWidth = div.clientWidth;
    div.style.overflowY = 'hidden';
    let offsetWidth = div.offsetWidth;
    document.body.removeChild(div);
    return offsetWidth - clientWidth;
  };
  const normalize = function(string){
    return string.trim().replace(/[！-｝]/g, function(s){
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    }).replace(/　/g, ' ').replace(/～/g, '〜');
  };
  const escapeRegExp = function(string){
    return string.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&'); // $&はマッチした部分文字列全体を意味します
  };
  const linkify = function(node){
    split(node);
    function split(n){
      if(['style', 'script', 'a'].includes(n.localName)) return;
      if(n.nodeType === Node.TEXT_NODE){
        let pos = n.data.search(linkify.RE);
        if(0 <= pos){
          let target = n.splitText(pos);/*pos直前までのnとpos以降のtargetに分割*/
          let rest = target.splitText(RegExp.lastMatch.length);/*targetと続くrestに分割*/
          /* この時点でn(処理済み),target(リンクテキスト),rest(次に処理)の3つに分割されている */
          let a = document.createElement('a');
          let match = target.data.match(linkify.RE);
          switch(true){
            case(match[1] !== undefined): a.href = (match[1][0] == 'h') ? match[1] : 'h' + match[1]; break;
            case(match[2] !== undefined): a.href = 'http://' + match[2]; break;
            case(match[3] !== undefined): a.href = 'mailto:' + match[4] + '@' + match[5]; break;
          }
          a.appendChild(target);/*textContent*/
          rest.parentNode.insertBefore(a, rest);
        }
      }else{
        for(let i = 0; n.childNodes[i]; i++) split(n.childNodes[i]);/*回しながらchildNodesは増えていく*/
      }
    }
  };
  linkify.RE = new RegExp([
    '(h?ttps?://[-\\w_./~*%$@:;,!?&=+#]+[-\\w_/~*%$@:;&=+#])',/*通常のURL*/
    '((?:\\w+\\.)+\\w+/[-\\w_./~*%$@:;,!?&=+#]*)',/*http://の省略形*/
    '((\\w[-\\w_.]+)(?:@|＠)(\\w[-\\w_.]+\\w))',/*メールアドレス*/
  ].join('|'));
  const atLeast = function(min, b){
    return Math.max(min, b);
  };
  const atMost = function(a, max){
    return Math.min(a, max);
  };
  const between = function(min, b, max){
    return Math.min(Math.max(min, b), max);
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
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1],
      getCallers: (e) => e.stack.match(/[^ ]+(?= \(<anonymous>)/gm),
    }, {
      name: 'Chrome Tampermonkey',
      detector: /at MARKER \((userscript\.html|chrome-extension:)/,
      getLine: (e) => e.stack.split('\n')[2].match(/([0-9]+):[0-9]+\)$/)[1] - 6,
      getCallers: (e) => e.stack.match(/[^ ]+(?= \((userscript\.html|chrome-extension:))/gm),
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
    //console.log('////', f.name, 'wants', 85, '\n' + new Error().stack);
    return true;
  });
  const time = function(label){
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
      case(!time.records[label]):/* time('label') to start the record */
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