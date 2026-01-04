// ==UserScript==
// @name         web漫画にショートカットキーを追加
// @description  ←→：前／次のページ　Shift+A：頭出しオンオフ　f [：全画面化　Shift+←→か ] Enter：前の話/次の話に移動　Shift+↑：作品情報ページに戻る　（ニコニコ静画のみ）C：コメントオンオフ　（作品情報ページで）→：第1話に移動、Enter：最新話に移動、Shift＋↑：パンくずリスト1つ上に移動　Shift+@：インスタントsibling登録
// @version      0.1.93
// @run-at document-idle
// @match *://www.comic-valkyrie.com/*
// @match *://webcomic.ohtabooks.com/*
// @match *://comicride.jp/*
// @match *://*.5ch.net/*
// @match *://*.yucl.net/*
// @match *://arklightbooks.com/comics/*
// @match *://bokete.jp/*
// @match *://cakes.mu/*
// @match *://cho-animedia.jp/comic_category/*
// @match *://cho-animedia.jp/comic/*
// @match *://ci.nii.ac.jp/*
// @match *://comic-days.com/episode/*
// @match *://tonarinoyj.jp/episode/*
// @match *://shonenjumpplus.com/episode/*
// @match *://kuragebunch.com/episode/*
// @match *://pocket.shonenmagazine.com/episode/*
// @match *://viewer.heros-web.com/episode/*
// @match *://comic-fuz.com/*
// @match *://comic-meteor.jp/*
// @match *://comic-trail.jp/*
// @match *://comic-walker.com/detail/KC*
// @match *://comic.mag-garden.co.jp/*
// @match *://comic.pixiv.net/works/*
// @match *://comic.pixiv.net/viewer/*
// @match *://comic.webnewtype.com/contents/*
// @match *://comicawa.com/TitleDetail/*
// @match *://comicpash.jp/*
// @match *://curazy.com/*
// @match *://cycomi.com/fw/cycomibrowser/chapter/*
// @match *://daysneo.com/works/*
// @match *://ebookjapan.yahoo.co.jp/*
// @match *://gammaplus.takeshobo.co.jp/*
// @match *://ganma.jp/*
// @match *://grapee.jp/*
// @match *://hanatsubaki.shiseidogroup.jp/comic*
// @match *://kawaii2ch.com/*
// @match *://leedcafe.com/*
// @match *://manga-park.com/title/*
// @match *://manga.line.me/*
// @match *://mangacross.jp/comics/*
// @match *://mangahack.com/comics/*
// @match *://matogrosso.jp/*
// @match *://news.mynavi.jp/series/*
// @match *://news.mynavi.jp/article/*
// @match *://note.mu/*
// @match *://online.ichijinsha.co.jp/*
// @match *://rookie.shonenjump.com/series/*
// @match *://rookie.shonenjump.com/users/*
// @match *://ruijianime.com/*
// @match *://sai-zen-sen.jp/comics/twi4/*
// @match *://manga.nicovideo.jp/watch/*
// @match *://manga.nicovideo.jp/comic/*
// @match *://manga.nicovideo.jp/manga/list?user_id=*
// @match *://souffle.life/author/*
// @match *://souffle.life/manga/*
// @match *://storia.takeshobo.co.jp/manga/*
// @match *://sukupara.jp/*
// @match *://to-ti.in/*
// @match *://urasunday.com/*
// @match *://watamote.com/*
// @match *://web-ace.jp/*
// @match *://webcomicgamma.takeshobo.co.jp/*
// @match *://webcomics.jp/*
// @match *://www.alphapolis.co.jp/manga/*
// @match *://www.comic-earthstar.jp/*
// @match *://www.comic-essay.com/episode/*
// @match *://www.comic-essay.com/neko/*
// @match *://www.comic-essay.com/read/*
// @match *://www.comic-essay.com/links/*
// @match *://www.comicbunch.com/manga/*
// @match *://www.comico.jp/challenge/*
// @match *://www.comico.jp/articleList*
// @match *://www.comico.jp/detail*
// @match *://www.comico.jp/challenge/detail*
// @match *://www.ebigcomic4.jp/title/*
// @match *://www.ganganonline.com/*
// @match *://www.jstage.jst.go.jp/*
// @match *://www.mangabox.me/reader/*
// @match *://www.moae.jp/comic/*
// @match *://*.moae.jp/lineup/*
// @match *://www.nicovideo.jp/search/*
// @match *://www.sunday-webry.com/episode*
// @match *://www.tatan.jp/*
// @match *://www.zenyon.jp/lib/*
// @match *://yasudadou.futene.net/*
// @match *://yawaspi.com/*
// @match *://yomitai.jp/*
// @match *://yusb.net/*
// @match *://comic-boost.com/*
// @match *://futabanet.jp/*
// @match *://hobbyjapan.co.jp/*
// @match *://comip.jp/*
// @match *://comic-action.com/episode/*
// @match *://www.comic-ryu.jp/*
// @match *://ashitano.tonarinoyj.jp/*
// @match *://debut.shonenmagazine.com/*
// @match *://medibang.com/*
// @match *://mangalifewin.takeshobo.co.jp/*
// @match *://nikkangecchan.jp/*
// @match *://www.mangabox.me/special/*
// @match *://www-indies.mangabox.me/*
// @match *://www.gamespark.jp/*
// @match *://kodansha-cc.co.jp/*
// @match *://kinmaweb.jp/*
// @match *://pachikuri.jp/*
// @match *://comici.jp/*
// @match *://magazine.comici.jp/*
// @match *://ebookstore.corkagency.com/*
// @match *://books.vipdoor.info/*
// @match *://mankai.jp/*
// @match *://cbiz.shueisha.co.jp/*
// @match *://comic-gardo.com/episode/*
// @match *://sokuyomi.jp/*
// @match *://comic-polaris.jp/*
// @match *://kirapo.jp/*
// @match *://www.yatate.net/*
// @match *://sonorama.asahi.com/*
// @match *://csbs.shogakukan.co.jp/book*
// @match *://comic-medu.com/*
// @match *://comic-zenon.com/episode/*
// @match *://sportsbull.jp/*
// @match *://magcomi.com/episode/*
// @match *://omocoro.jp/writer*
// @match *://www.sukima.me/*
// @match *://ddnavi.com/serial/*
// @match *://www.gentosha.jp/series/*
// @match *://www.gentosha.jp/article/*
// @match *://crea.bunshun.jp/*
// @match *://booklive.jp/*
// @match *://kansai.mag-garden.co.jp/*
// @match *://getnavi.jp/*
// @match *://mavo.takekuma.jp/*
// @match *://curazy.com/manga/*
// @match *://margaretbookstore.com/*
// @match *://4komagram.com/*
// @match *://kidsna.com/*
// @match *://dot.asahi.com/*
// @match *://animesoku.com/*
// @match *://www.lezhin.com/*
// @match *://j-nbooks.jp/*
// @match *://www.cmoa.jp/*
// @match *://www.mangaz.com/*
// @match *://vw.mangaz.com/*
// @match *://sp.comics.mecha.cc/*
// @match *://bigcomicbros.net/*
// @match *://bookwalker.jp/*
// @match *://comic.k-manga.jp/*
// @match *://pokeman.jp/*
// @match *://static.ichijinsha.co.jp/*
// @match *://piccoma.com/*
// @match *://oshiete.goo.ne.jp/watch/*
// @match *://www.comicgum.com/*
// @match *://kuzure.but.jp/*
// @match *://comic.mf-fleur.jp/*
// @match *://*.2chan.net/*
// @match *://*.ftbucket.info/scrapshot/*
// @match *://*.ftbucket.info/*/cont/*
// @match *://note.com/*
// @match *://sp.handycomic.jp/*
// @match *://ebookstore.sony.jp/*
// @match *://kc.kodansha.co.jp/*
// @match *://jumpsq.shueisha.co.jp/*
// @match *://sp.comics.mecha.cc/*
// @match *://wanibooks-newscrunch.com/*
// @match *://renta.papy.co.jp/*
// @match *://yanmaga.jp/*
// @match *://mankai.jp/*
// @match *://yuik.net/*
// @match *://yuk2.net/*
// @match *://yakb.net/*
// @match *://togetter.com/*
// @match *://posfie.com/*
// @match *://pash-up.jp/*
// @match *://*.fanbox.cc/posts/*
// @match *://pie.co.jp/*
// @match *://manga-5.com/*
// @match *://feelweb.jp/episode/*
// @match *://www.123hon.com/*
// @match *://novema.jp/*
// @match *://www.comicnettai.com/*
// @match https://digitalmargaret.jp/detail/*
// @match https://digitalmargaret.jp/contents/*
// @match *://comicborder.com/*
// @match *://i-voce.jp/*
// @match *://inthelife.club/*
// @match *://konomanga.jp/*
// @match *://www.pixiv.net/*
// @match *://firecross.jp/*
// @match *://corocoro.jp/*
// @match *://www.mishimaga.com/*
// @match *://bunshun.jp/*
// @match *://my-best.com/*
// @match *://the360.life/*
// @match *://boards.4channel.org/*
// @match *://shonenjumpplus.com/*
// @match *://game.asahi.com/*
// @match *://twitter.com/*
// @match *://mobile.twitter.com/*
// @match *://x.com/*
// @match *://nlab.itmedia.co.jp/*
// @match *://twicomi.com/*
// @match *://7irocomics.jp/*
// @match *://ciao.shogakukan.co.jp/webwork/*
// @match *://write.as/*
// @match *://*.writeas.com/*
// @match *://gaugau.futabanet.jp/*
// @match *://gaugau.futabanex.jp/*
// @match *://michikusacomics.jp/*
// @match *://*.shitaraba.net/bbs/read.cgi/*
// @match *://*.shitaraba.net/bbs/read_archive.cgi/*
// @match *://anige.horigiri.net/*
// @match *://codezine.jp/*
// @match *://zerosumonline.com/*
// @match *://iroirosokuhou.com/*
// @match *://chansoku.com/*
// @match *://matome.usachannel.info/*
// @match https://www.rtings.com/*
// @match *://360life.shinyusha.co.jp/*
// @match *://storia.takeshobo.co.jp/*
// @match *://priucesshanage.blog.jp/*
// @match *://www.comic-brise.com/*
// @match *://kaigo.ten-navi.com/*
// @match *://www.comico.jp/*
// @match *://ichijin-plus.com/*
// @match *://foodservice.ajinomoto.co.jp/article/ajitaro/*
// @match *://gentukiban2.yakiin.net/*
// @match *://gentukiban.yakiin.net/*
// @match *://gentukiban3.yakiin.net/*
// @match *://comic-ogyaaa.com/*
// @match *://manga.okiba.jp/*
// @match https://comic-trail.com/episode/*
// @match *://www.lettuceclub.net/*
// @match *://baila.hpplus.jp/*
// @match *://laza.mandarake.co.jp/*
// @match *://youngchampion.jp/*
// @match *://younganimal.com/*
// @match *://gakcomic.gakken.jp/*
// @match *://webcomicgamma.takeshobo.co.jp/*
// @match *://bigcomics.jp/series/*
// @match *://bigcomics.jp/episodes/*
// @match *://hayacomic.jp/series/*
// @match *://hayacomic.jp/episodes/*
// @match *://younganimal.com/series/*
// @match *://younganimal.com/episodes/*
// @match *://carula.jp/series/*
// @match *://carula.jp/episodes/*
// @match *://inunokagayaki.blog.jp/*
// @match *://to-corona-ex.com/*
// @match *://nitter.cz/*
// @match *://nitter.net/*
// @match *://xcancel.com/*
// @match *://urukaruka.com/*
// @match *://misskey.io/*
// @match https://superfoodly.com/orac-values*
// @match *://neetsha.jp/*
// @match *://www.uexpress.com/*
// @match *://manga-no.com/*
// @match *://jp.iherb.com/search*
// @match *://jp.iherb.com/c/*
// @match https://www.rd.com/list/kindness-quotes/*
// @match https://www.randomactsofkindness.org/kindness-quotes*
// @match https://www.ftd.com/blog/kindness-quotes*
// @match https://www.goodgoodgood.co/articles/kindness-quotes*
// @match https://www.thepioneerwoman.com/home-lifestyle/*/kindness-quotes/*
// @match https://www.brainyquote.com/topics/*
// @match https://declutterthemind.com/blog/kindness-quotes/*
// @match https://wisdomquotes.com/kindness-quotes/*
// @match https://www.weareteachers.com/kindness-quotes/*
// @match https://wisdomquotes.com/humanity-quotes/*
// @match https://www.boredpanda.com/kindness-quotes/*
// @match *://www.ncbi.nlm.nih.gov/*
// @match *://pubmed.ncbi.nlm.nih.gov/*
// @match https://www.bmj.com/content/*
// @match *://www.sciencedirect.com/science/article/*
// @match *://omocoro.jp/*
// @match *://nakasorahami.com/*
// @match *://auctions.yahoo.co.jp/search/search*
// @match *://anond.hatelabo.jp/*
// @match *://old.reddit.com/r/*
// @match *://www.quora.com/*
// @match *://ameblo.jp/*
// @match *://tsumanne.net/*
// @match *://zendamakinblog.com/*
// @match *://www.yodobashi.com/*
// @match *://getsuaku.com/*
// @match *://kansai.mag-garden.co.jp/series/*
// @match *://omocoro.jp/*
// @match *://www.corocoro.jp/episode/*
// @match *://championcross.jp/series/*
// @match https://championcross.jp/episodes/*
// @match https://youngchampion.jp/episodes/*
// @match https://www.perplexity.ai/*
// @match *://carula.jp/episodes/*
// @match *://carula.jp/series/*
// @match *://gigazine.net/*
// @match *://www.netoff.co.jp/*
// @match *://sp.manga.nicovideo.jp/*
// @match *://m-nerds.com/*
// @match *://search.yahoo.co.jp/*
// @match *://ynjn.jp/*
// @match *://www.webuomo.jp/*
// @match *://www.amazon.co.jp/*
// @match *://www.harta.jp/*
// @match *://flowercomics.jp/*
// @match *://www.webchikuma.jp/*
// @match *://www.rtings.com/*
// @match *://review.kakaku.com/*
// @match *://shonenjumpplus.com/series*
// @match file:///*/*
// @match *://kuragebunch.com/series*
// @match *://www.sunday-webry.com/series*
// @match *://twiman.net/*
// @match *://nttxstore.jp/*
// @match *://comic-growl.com/*
// @match *://rimacomiplus.jp/betsuma/series/*
// @match *://www.manga-up.com/titles/*
// @match *://mangalt.jp/*
// @match *://dime.jp/*
// @match *://www.suruga-ya.jp/*
// @match *://www.yomonga.com/*
// @match *://manga-meets.jp/*
// @match *://shueisha.online/*
// @match *://piccoma.com/web/viewer/*
// @match *://comic-seasons.com/episode/*
// @match *://takecomic.jp/*
// @match *://ichicomi.com/episode/*
// @match *://mangajohnlennon.blog.jp/*
// @noframes
// @grant GM_addStyle
// @grant GM.addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/377731/web%E6%BC%AB%E7%94%BB%E3%81%AB%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E3%82%AD%E3%83%BC%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/377731/web%E6%BC%AB%E7%94%BB%E3%81%AB%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E3%82%AD%E3%83%BC%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==
// @match *://*/*

(function() {
  const PopupHelpMS = 4000; // ポップアップヘルプの表示時間ms
  var scrollSpeed = 2.3; // ←→キーのスクロール速度（0：API使用、1：瞬間移動、1.01～：速度指定）
  const IGNORE_SIBLING_CLOSER_THAN = 4; // ←→キーで前後のページ画像からの距離がこれ以下の項目は無視
  const EXPERIMENTAL_EMBED_FUNCTION_FOR_LOCAL_HTML = 1; // 1:ローカルに単一HTML保存した物で←→キーが効くようにHTMLにscriptタグを埋め込む
  const DISPLAY_PAGE_NUMBER = 1; // 1:対応サイトで←→キー押下時に見ているページ数を表示　2:全てのサイトで表示（実験的）
  const MINIMAP_TIMELIMIT_MS = 16; // DISPLAY_PAGE_NUMBERが1以上時のミニマップ表示にかける許容時間(ms)これ以上かかったら以降ミニマップ表示をやめる

  const debug = 0; // dc() verbose 1:console.log 2:popup3
  const LogMatch = 0; // 1でメタデータブロックを生成（開発用）
  var marginu = 2;

  var isChrome = window.navigator.userAgent.toLowerCase().indexOf("chrome") != -1;
  var atamadashi = pref("atamadashi") || "false";
  var fit = pref("fit") || "true";
  var sscrollY = 0;
  var sscrollDY = 0;
  var sscrollDesEle;
  var scrint = 0;
  var latestClick = 0;

  const ButtonBG = "background-color:#3050f0;";
  const verbose = 0;
  var maey = 0;
  var GF = {}

  var globalFlag = [];
  String.prototype.sanit = function() { return this.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;') }
  const CollEleText = (a, b) => new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare(a.textContent, b.textContent)

  var mousex = 0;
  var mousey = 0;
  document.addEventListener("mousemove", function(e) {
    mousex = e.clientX;
    mousey = e.clientY;
  }, false);

  function waitanddo(ele, func, delay = 100, timeoutMs = 60000, start = Date.now(), int = 100) {
    let e = ele()
    if (e && e?.length !== 0) {
      setTimeout(() => { func(e); return e; }, delay);
    } else if (Date.now() - start < timeoutMs) setTimeout(() => { waitanddo(ele, func, delay, timeoutMs, start, Math.min(int + 100, 1000)) }, int)
  }
  const SITEINFO = [{
      url: '//mangajohnlennon.blog.jp/',
      sibling: 'img.pict',
      fitFunc: () => { fitFuncA('header', 'img.pict', 400, null, 'footer:inscreen'); },
      nextEpisode: 'ul > li.next > a',
      prevEpisode: 'ul > li.prev > a',
    }, {
      url: /\/\/takecomic\.jp\/(?:episodes|series)\//,
      lastEpisode: () => eleget0('a.mode-new:not([class*="mode-current"]):inscreen') || elegeta('span.series-eplist-item-access-text.mode-free:inscreen')?.shift(),
      firstEpisode: () => eleget0('a.series-sort-link:not([class*="mode-new"]):not([class*="mode-current"]):inscreen:text*=^1-') || elegeta('span.series-eplist-item-access-text.mode-free:inscreen')?.shift(),
      author: 'span.series-h-credit-user-name',
      sibling: 'div.row.row2-line img.manga2-img,div.row.row2-line img.manga-web-img',
      prevEpisode: '//a[@class="click-link" and text()=" 前話"]|//a[@data-event-detail="article-next-page"]/div[@class="ep-f-nav-h" and contains(text(),"前の話")]',
      nextEpisode: '//span[@class="title-next"]|//*/div[@class="ep-f-nav-h" and text()="次の話"]',
      pankuzuUp: '//a[@class="a-series-title"]|//div[@class="col-sm-9 col-xs-8 series-user-box"]/a/span[@class="article-text"]|//div/div[@class="content-box-inner"]/div/div[last()]/div[@class="col-xs-12"]/a[text()="戻る"]|//div[@class="series-h"]/div/div/div[@class="series-h-credit-user"]/a/span',
      fitFunc: () => { fitFuncA('header', 'div.row.row2-line img.manga2-img,div.row.row2-line img.manga-web-img', 400, null, 'footer:inscreen'); },
      scrollSpeed: 2,
      //header: 'header',
      //atamadashi: '//div/img[@class="prof-h-icon-img"]',
    }, {
      url: '//piccoma.com/web/viewer/',
      leftKey: `//span[contains(text(),"無料で次の話を読む")]`,
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//shueisha.online/',
      sibling: 'div.gallery-manga-block',
      header: 'auto',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//manga-meets.jp/',
      firstEpisode: () => !eleget0('div.comic__inner:inscreen') && eleget0('li:last-child > div > div:last-child > h3.comic-area__title > a , li:nth-child(1 of li) > a > div.basic-list__detail > div.head-line'),
      lastEpisode: () => !eleget0('div.comic__inner:inscreen') && eleget0('ul > li:nth-child(1 of li) > div > div.comic-area__detail > h3 > a , li:last-of-type > a > div > div.basic-list--comic__head-line'),
      author: `h2.title--name , div.comic-area__pen-name > a`,
      leftKey: `div.modal-content-inner-box--no-bg > a.btn.btn--margin-viewer.btn--read-episode:inscreen:visible`,
      keyFunc: { key: "f", func: e => eleget0('button.viewer-button--max > span , button.viewer-button--normal > span:inscreen:visible')?.click(), },
    }, {
      url: '//www.yomonga.com/',
      leftKey: 'a#nextEpisodeUrl.ga_read_next_episode',
      author: 'div[class*="intr-writer"] > a > span',
      func1st: () => setTimeout(() => eleget0('span.fa-expand:visible')?.click(), 999),
      lastEpisode: 'a.button-type1.episode-list-button',
    }, {
      url: '//www.suruga-ya.jp/',
      sibling: '.item',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//dime.jp/',
      sibling: 'a.entryList_item_link',
      header: 'auto',
      disableSnapWhenPageIsClicked: 1,
    },
    /*{
      url: '//comic-growl.com/',
      author: '//h2[@class="series-header-author"]',
    }, */
    {
      url: `https://www.manga-up.com/titles/`,
      nextEpisode: () => eleget0('a:inscreen:visible:text*=次の話を読む'),
      func1st: () => eleget0(`//span[contains(@class,"mr-small") and contains(text(),"拡大")]`)?.click(),
      author: 'div.text-on_background_medium:text*=著者：',
    }, {
      url: '//nttxstore.jp/',
      sibling: 'div#schphoto > ul > li',
      header: 'div#global_nav.header_fixed_inner',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//twiman.net/',
      sibling: 'img.object-contain.justify-self-auto.mx-auto',
      nextEpisode: () => eleget0('li.relative.cursor-pointer.font-medium.z-10.text-indigo-600')?.nextSibling?.querySelector('a'),
      prevEpisode: () => eleget0('li.relative.cursor-pointer.font-medium.z-10.text-indigo-600')?.previousSibling?.querySelector('a'),
      header: "auto",
      //pankuzuUp: 'div.p-1.rounded-xl.mb-3.max-w-4xl.w-full:nth-child(1 of div.p-1.rounded-xl.mb-3.max-w-4xl.w-full) > div.flex > div.items-center > div.leading-tight > a.text-black.font-bold',
      fitFunc: site => { fitFuncA("ul.pagination", SITE?.sibling, 40); },
      funcNextPrev: () => {
        setTimeout(() => {
          window.scrollTo(0, 0);
          runAtamadashi()
        }, 334)
      },
      pagenationClickInterval: 334,
    }, {
      url: '//www.sunday-webry.com/series|//kuragebunch.com/series',
      sibling: 'li.webry-series-item.test-series',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//shonenjumpplus.com/series',
      sibling: 'li.series-list-item',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//review.kakaku.com/',
      sibling: 'div.boxGrInner , div.h1bg',
      header: 'auto',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//www.rtings.com/',
      sibling: 'div.product_page-category',
      header: 'auto',
      nextEpisode: '',
      prevEpisode: '',
      disableSnapWhenPageIsClicked: 1,
      author: '',
      firstEpisode: '',
      lastEpisode: '',
      pankuzuUp: '',
    }, {
      url: '//www.webchikuma.jp/',
      sibling: 'div.figure-center > img.lazy , div.image-area',
      nextEpisode: 'li[class*="mod-pagenation-item"].pagenation-next > a.box',
      pankuzuUp: 'li:nth-child(3) > a.m-breadcrumb__link',
      author: `p.author > a`,
      fitFunc: site => { fitFuncA(site.header, SITE.sibling, 40); },
    }, {
      url: '//flowercomics.jp/',
      firstEpisode: '//div[last()]/button/p[text()="最初から読む"]',
      lastEpisode: () => elegeta('img[class*="h-[18px]"][alt="無料"]')?.pop(),
      func1st: () => setInterval(() => eleget0('//div/button/p[text()="途中話を表示する"]/..')?.click(), 999),
      author: `h1.font-semibold.row-start-2[class*="md:pt-[12px]"]`,
    }, {
      url: '//www.harta.jp/',
      sibling: 'main > article > div > p',
      header: `div.c-subNav`,
      fitFunc: site => { fitFuncA(site.header, `main > article > div > p img`, 40); },
    }, {
      url: '//www.amazon.co.jp/',
      sibling: '.s-asin',
      disableSnapWhenPageIsClicked: 1,
      header: "auto",
    }, {
      url: '//www.webuomo.jp/',
      firstEpisode: '//a[contains(@class,"common-button") and contains(text(),"1話から見る")]',
      //sibling:'figure > img',
      lastEpisode: 'section.manga-section:nth-of-type(1) > div > div.manga-section__wrapper > div > a > div.detail:last-of-type > div.title',
      author: 'div.title > div.name , section:nth-of-type(1) > div > div.manga-section__author:nth-of-type(1)',
      header: 'div.large-header-wrapper',
      fitFunc: site => { fitFuncA(site.header, `figure > img`, 40); },
      keyFunc: {
        key: "Enter",
        func: e => moveClick('a.newer')
      },
      //nextEpisode:'a.newer',
      //prevEpisode:'a.older',
    }, {
      url: '//ynjn.jp/',
      //firstEpisode: 'svg[viewBox="0 0 32 22"]',
      lastEpisode: () => eleget0('div.title__allLink') || elegeta('svg[viewBox="0 0 32 22"]')?.pop(),
      author: 'div.title__detailSubTitle',
      leftKey: 'a.endpage__text__button button:text*=次の話を読む',
      func1st: e => waitanddo(() => eleget0('div.cursor-pointer.truncate.transition-opacity[class*="landscape-touch"]'), e => e?.click()),
    }, {
      url: '//search.yahoo.co.jp/realtime/search',
      sibling: 'div[class*="Tweet_overall__"]',
      header: 'div.SearchBox_fixedWrap__h9X4V.SearchBox_fixed__XnfK2.SearchBox_isShadowed__aC9L2',
      pankuzuUp: 'div#mtype.target_modules_viewability > ul > li > a',
    }, {
      url: '//m-nerds.com/',
      sibling: () => eleget0('main > div.dividerBottom > h1.heading-primary') ? [] : elegeta('figure.size-full > img , figure.wp-block-image > img'),
      firstEpisode: () => elegeta('div.pageContents > section  div > p a')?.shift() || elegeta('article > div.archive__contents > h2.heading-secondary > a')?.pop(),
      lastEpisode: () => elegeta('div.pageContents > section  div > p a , div.wp-block-buttons.is-content-justification-center a.wp-block-button__link')?.pop() || elegeta('article > div.archive__contents > h2.heading-secondary > a')?.shift(),
      pankuzuUp: '//a[contains(@class,"btn__link btn__link-secondary") and text()="投稿一覧へ"]',
      author: 'div.archiveHead__authorText > h1.heading-primary',
      nextEpisode: () => elegeta('div.heading.heading-secondary > a')?.shift(),
      prevEpisode: () => elegeta('div.heading.heading-secondary > a')?.pop(),
      fitFunc: () => { fitFuncA('', 'figure.size-full > img , figure.wp-block-image > img', 400); },
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//sp.manga.nicovideo.jp/',
      firstEpisode: '//a/button[@type="button" and text()="最初から読む"]',
      lastEpisode: () => elegeta('div.flex-col.justify-between > h4.line-clamp-2')?.shift(),
      pankuzuUp: 'a.inline-block > button.rounded.text-sm.bg-white.text-primary-main:text*=作品ページへ',
      leftKey: '//div/div[contains(@class,"text-lg leading-none") and text()="次の話"]',
      prevEpisode: '//button[@type="button" and contains(text(),"前の話")]',
      author: 'p.author , div.flex-col > div:nth-child(1 of div) > p.break-words.text-xs',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//www.netoff.co.jp/',
      sibling: 'li.clearfix',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//gigazine.net/',
      sibling: 'section',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: () => ld('www.perplexity.ai') || location.protocol == "file:" && eleget0('div.flex.items-center.justify-center.bg-offset.text-foreground.rounded-2xl.p-3.font-sans.text-base.font-normal.select-none , div.mt-md > div > div[class*="border-subtlest"].bg-transparent') || eleget0('a.block[aria-label="Perplexity"] , a.mt-xs[href="https://www.perplexity.ai/"] > div.duration-300 > div.h-auto[class*="md:w-8"] > svg[viewBox="0 0 101 116"]') && eleget0('div.col-span-8 , div.-inset-md.absolute'), // 2025.12
      sibling: () => elegeta('div.col-span-8 , div.-inset-md.absolute , div.flex.items-center.justify-center.bg-offset.text-foreground.rounded-2xl.p-3.font-sans.text-base.font-normal.select-none , div.mt-md > div > div[class*="border-subtlest"].bg-transparent'),
      header: `.h-headerHeight`,
      /*      url: () => ld('www.perplexity.ai') || location.protocol == "file:" && eleget0('a.block[aria-label="Perplexity"] , a.mt-xs[href="https://www.perplexity.ai/"] > div.duration-300 > div.h-auto[class*="md:w-8"] > svg[viewBox="0 0 101 116"]') && eleget0('div.col-span-8 , div.-inset-md.absolute'), // 2025.05
            sibling: () => elegeta('div.col-span-8 , div.-inset-md.absolute'),
            */
      disableSnapWhenPageIsClicked: 1,
      sscrollAlt: e => e.scrollIntoView({ behavior: "smooth", block: "start", inline: "end" }), //.scrollIntoView({behavior: "smooth", block: "center", inline: "center"}); // 2025.02 応急処置
      marginu: 7,
      func1st: () => { addstyle.add(`.line-clamp-1, .line-clamp-2 { -webkit-box-orient: unset !important;}`) },
    }, {
      url: '//omocoro.jp/',
      sibling: () => [elegeta('div.header-meta,div.article-inner p>img , a > img.alignnone'), elegeta('div.article-inner :is(p:not(blockquote>p:first-of-type),blockquote):text*=[a-z0-9ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]+')].flat().sort((a, b) => a?.getBoundingClientRect()?.top > b?.getBoundingClientRect()?.top ? 1 : -1),
      //header: 'auto',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//getsuaku.com/',
      lastEpisode: '//a[@class="modal__episode modal__episode-buy" and text()="この話を読む"]',
      author: '//div[contains(@class,"detail__artist")]',
      keyFunc: { key: "f", func: e => eleget0('//span[contains(@class,"fa fa-expand")]|//span[contains(@class,"fa fa-compress")]')?.click(), },
    }, {
      url: '//www.yodobashi.com/',
      sibling: 'div.srcResultItem_block',
      header: 'auto',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//zendamakinblog.com/',
      sibling: 'div.views-row.kin-title',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//ameblo.jp/',
      sibling: 'img.PhotoSwipeImage,h1.skin-entryTitle',
      nextEpisode: 'a.skin-pagingPrev.skin-btnPaging.ga-pagingEntryPrevBottom',
      prevEpisode: 'a.skin-pagingNext.skin-btnPaging.ga-pagingEntryNextTop',
      header: 'div#ambHeader',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//www.quora.com/',
      sibling: '//div/div[@style="box-sizing: border-box; padding: 12px 12px 0px; position: relative;"]',
      header: 'auto',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//old.reddit.com/r/',
      sibling: 'div.midcol.unvoted,div#siteTable.sitetable , div#header',
      header: 'auto',
      marginu: 9,
      disableSnapWhenPageIsClicked: 1,
      pankuzuUp: '//span[@class="hover pagename redditname"]/a',
    }, {
      url: '//anond.hatelabo.jp/',
      sibling: '//DIV[@class="trackback-header"]|//h4|//h3|//h2',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: 'https://auctions.yahoo.co.jp/search/search|//auctions.yahoo.co.jp/category/',
      sibling: 'li.Product',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: /\/\/gaugau\.futabane(?:t|x)\.jp\/list/,
      sibling: 'div.works_tateyomi__img',
      header: 'header.header.in-header,div.header__kiba',
      fitFunc: () => { fitFuncA('header.header.in-header,div.header__kiba', 'div.works_tateyomi__img img', 400); },
      lastEpisode: () => elegeta('//div[contains(@class,"episode__inner")]/div[contains(text(),"無料で読む")]')?.shift(),
      firstEpisode: () => !eleget0('div.detailHead') && elegeta('//a/div[contains(@class,"episode__inner")]/div[contains(text(),"無料で読む")]')?.pop(),
      author: '//div/div[1]/div[contains(@class,"works__list")]/div/div/div[@id="list__text"]/div/span/a',
      keyFunc: { key: "f", func: e => eleget0('//span[contains(@class,"fa fa-expand")]|//span[contains(@class,"fa fa-compress")]')?.click() },
      func1st: e => { eleget0('div#cst_controller_normal.information_controller.cst_info.cst_on_normal')?.focus() },
    }, {
      url: '//nakasorahami.com/',
      nextEpisode: '//a[contains(text(),"次の記事 >")]',
      prevEpisode: '//a[contains(text(),"< 前の記事")]',
      sibling: 'img.pict',
      fitFunc: () => { fitFuncA('', 'img.pict', 400); },
    }, {
      url: '//omocoro.jp/',
      sibling: 'div.box',
      pankuzuUp: '//header/div[contains(@class,"main-menu ")]/div/nav/a[text()="ラジオ"]',
      sortSibling: 1,
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//www.sciencedirect.com/science/article/',
      sibling: 'article h1,article h2,article h3,article h4,article .tables',
      header: 'div.accessbar',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: /https:\/\/www.bmj.com\/content\/\d+\/bmj/,
      sibling: '.article h1,.article h2,.article h3,.article div.highwire-figure,span.highwire-cite-article-type',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: /\/\/pubmed.ncbi.nlm.nih.gov\/\d+\//,
      sibling: 'div#full-view-heading.full-view,h2,div.figures',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//www.ncbi.nlm.nih.gov/pmc/article',
      sibling: 'h2,div.fm-sec.half_rhythm.no_top_margin',
      pankuzuUp: '//div/button[@data-ga-category="resources_accordion" and @aria-controls="similar-articles-accordion-aside" and @data-action-close="close_similar_articles"]',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: 'https://www.rd.com/list/kindness-quotes/|https://www.randomactsofkindness.org/kindness-quotes|https://www.ftd.com/blog/kindness-quotes|https://www.goodgoodgood.co/articles/kindness-quotes|https://www.thepioneerwoman.com/home-lifestyle/.*/kindness-quotes/|https://www.brainyquote.com/topics/|https://declutterthemind.com/blog/kindness-quotes/|https://wisdomquotes.com/kindness-quotes/|https://www.weareteachers.com/kindness-quotes/|https://wisdomquotes.com/humanity-quotes/|https://www.boredpanda.com/kindness-quotes/',
      sibling: 'div.listicle-card,li.grid-item.fadeIn.last-paragraph-no-margin,article div section h3,article.article-body.w-richtext p strong,div.listicle-slides,div.grid-item.qb.clearfix,article.article ol li,div.center-block.entry-content blockquote,h3.wp-block-heading,div.grid-item.qb.clearfix,.center-block.entry-content blockquote,div.open-list-item.open-list-block.clearfix',
      header: 'header,div.container-fluid.nav-header-container,nav.css-f6ivi6.efnztv77,div.bq-subnav,nav.navbar.navbar-expand-lg.bg-white.navbar-light.position-fixed.scrolled,div#floatingmenu',
      disableSnapWhenPageIsClicked: 1,
      sortSibling: 1,
    }, {
      url: '//jp.iherb.com/',
      sibling: 'div.product-cell-container', //sibling: 'div.product-cell-container.col-xs-12.col-sm-12.col-md-8.col-lg-6',
      header: 'div.iherb-header.iherb-header-layout.stackable-base',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//manga-no.com/',
      author: 'a[class*="_workId__user_container__"]',
      lastEpisode: '//li[last()]/a/div/h3/../..',
      leftKey: '//ul/li/a[contains(@class,"AfterwordPage_next__")]',
      pankuzuUp: () => { return eleget0('//div[contains(@class,"OtherworksPage_manga_item_one__")]/div/h3/a') || eleget0('//span[contains(@class,"AfterwordPage_user_name__")]') },
      firstEpisode: '//span[@class="Button_txt__HmlgW" and contains(text(),"はじめから読む")]',
    }, {
      url: '//www.uexpress.com/',
      //sibling: 'article[class*="LinkContainer_wrapper_bordered_"],article[class*="Article_article__section_"],div[class*="Container_container_"] p',
      //sibling: 'article[class*="LinkContainer_wrapper_bordered_"],article,div[class*="Container_container_"] p',
      sibling: 'article[class*="LinkContainer_wrapper_bordered_"],article,div[class*="DividerWithContent_divider_"] div div button:visible',
      pankuzuUp: '//main/div/div/nav[contains(@class,"nav Secondary_secondary_") and @aria-label="columnist"]/a[last()]',
      header: '//html/body/div/div/header/div|//html/body/div/div/header/div',
      //    func: () => { setInterval(() => (eleget0('div[class*="Article_article__truncator_"] button:visible')||eleget0('div[class*="DividerWithContent_divider_"] div div button:visible:inscreen'))?.click(), 1000) },
      //func: () => { setInterval(() => eleget0('div[class*="Article_article__truncator_"] button,div[class*="DividerWithContent_divider_"] div div button:visible:inscreen')?.click(), 1000) },
      atamadashiSpeed: Math.random() * 3,
      disableSnapWhenPageIsClicked: 1,
      func: () => {
        setInterval(() => (eleget0('div[class*="Article_article__truncator_"] button:visible') || eleget0('div[class*="DividerWithContent_divider_"] div div button:visible:inscreen'))?.click(), 1000)
        //addstyle.add('.danraku{padding-top:1.5em; }')
        setInterval(() => {
          elegeta('article p:not([data-drk]').forEach(e => {
            e.dataset.drk = "1"
            let re = /^(?:GENTLE READERS?|DEAR MISS MANNERS)\s*[\-\:]/
            let str = e?.textContent?.match0(re)
            if (str) {
              //              let str = e?.textContent?.match0(/^GENTLE READER|^DEAR MISS MANNERS/)
              e.textContent = e?.textContent?.replace(re, "");
              //e.style.display = "inline"
              begin(e, `<b>${str}</b>`)
            }
          })
        }, 99)
        //observeUrlChanged(() => doAtama(1.9))
      },
    }, {
      url: '//neetsha.jp/',
      sibling: '.image img',
      //nextEpisode: '//a[contains(text(),"次 >>")]',
      nextEpisode: `table:last-of-type > tbody > tr > td:last-of-type > a.next`, //'//a[@class="next"]|//a[contains(text(),"次 >>")]',
      prevEpisode: '//a[@class="prev"]|//a[contains(text(),"<< 前")]',
      pankuzuUp: '//a[@class="comictop"]',
      fitFunc: () => { fitFuncA('', '.image img:inscreen', 400); },
    }, {
      url: '//misskey.io/',
      sibling: 'article:not(div.dashboard article):visible',
      header: 'div > div[style="position: sticky; top: var(--stickyTop, 0); z-index: 1000;"] > div:inscreen:visible',
      disableSnapWhenPageIsClicked: 1,
      //    scrollSpeed:1.01,
    }, {
      url: 'https://urukaruka.com/',
      sibling: 'img.pict',
      nextEpisode: 'li.next a',
      prevEpisode: 'li.prev a',
      /*lastEpisode: () => {
        let lateele.offsetWidthadable = () => {
          return elegeta('//span[contains(@class,"article-date")]/time')
            //.filter(e => !e.innerText.match(/公開は終了しました/) && !eleget0('//p[@class="test-readable-product-point point"]', e.closest("li")))
            .sort((a, b) => (new Intl.Collator("ja", { numeric: true, sensitivity: 'base' }).compare)(a.textContent, b.textContent)).reverse()?.[0]
        }
      },*/
      fitFunc: () => { fitFuncA('', 'img.pict', 400); },
    }, {
      url: 'https://superfoodly.com',
      sibling: 'table tr',
      header: 'div.cb-nav-bar-wrap.cb-site-padding.clearfix.cb-font-header.wrap',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//nitter.cz/|//nitter.net/|//xcancel.com/',
      sibling: 'a.tweet-link,div.timeline-item',
      //pankuzuUp: 'a.username',
      header: 'nav',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//to-corona-ex.com/',
      firstEpisode: '//div[@role="list"]/div[1]/a/div[2]/div[1]/../..',
      lastEpisode: '//DIV[@class="grow truncate pl-3 text-center text-sm font-semibold tablet:text-base"]',
      pankuzuUp: '//div[@class="sc-cZFQFd imMKqL" and contains(text(),"作品詳細")]',
      author: '//html/body/div[@id="__next"]/div/main/div/div[1]/div[@class="flex flex-col items-start tablet:flex-row"]/div[1]',
    }, {
      url: '//inunokagayaki.blog.jp/',
      lastEpisode: 'h1.article-title > a',
      sibling: 'img.pict , div > div#main-inner > div > article',
      disableSnapWhenPageIsClicked: 1,
      nextEpisode: 'li.next>a',
      prevEpisode: 'li.prev>a',
      fitFunc: () => { fitFuncA('', 'img.pict', 400); },
    }, {
      url: '//(gammaplus|webcomicgamma).takeshobo.co.jp/(_files|manga)',
      lastEpisode: '//li[2]/a[contains(text(),"最新話を読む")]|//a[contains(@class,"btn__link anker") and text()="最新話を読む"]',
      firstEpisode: '//a[@class="btn__link anker" and text()="第1話を読む"]',
      //firstEpisode: () => elegeta('//ul[@class="read__contents"]/li[last()]')?.pop(),
      //    lastEpisode: () => elegeta('//li[@class="episode__text"]').sort(CollEleText)?.pop(),
      author: '//ul[@class="manga__title"]/li[2]',
      pankuzuUp: '//div/div[2]/a[@rel="noreferrer" and contains(text(),"作品TOPへ")]|//div[1]/a[@rel="noreferrer" and text()="作品詳細へ戻る"]',
      leftKey: `//div/div[@class="e-btn__episode"]/a[@onclick="ga('send','event','レコメンド','リンク','次の話へ')"]`,
      insteadofClickFunc: (e) => { if (e.href) { location.href = e.href } else { e.click() } },
    }, {
      url: '//gakcomic.gakken.jp/',
      firstEpisode: '//div/div[@class="pg-book-episodes"]/div[last()]/div[2]/a[text()="無料で読む"]',
      lastEpisode: '//div[@class="pg-book-episode__data"]/a[text()="無料で読む"]',
      author: '//ul/li[contains(@class,"pg-book-meta__editor-list")]',
    }, {
      url: [/\/\/championcross\.jp\/series\/|\/carula\.jp\/series\//, `comic-growl.com/series/`, `https://rimacomiplus.jp/[^\/]+/series/`, `https://mangalt.jp/series/`],
      lastEpisode: () => eleget0('//a[@class="series-ep-info-link" and contains(text(),"最新話から")]') || eleget0('//img[@class="lazyloaded mode-narrow" and @data-src="/images/icons/free_ja.svg"]') || eleget0('//span[@class="free-icon-new"]'),
      firstEpisode: () => eleget0('//a[text()="はじめから読む（無料）"]') || eleget0('//div[1]/div/div[last()]/a[contains(text(),"作品をすべて見る")]') || eleget0('//a[contains(@class,"series-act-read-btn") and text()="はじめから読む"]') || eleget0('//div/h2[not(contains(text(),"この作品を読んだあなたにオススメ"))]/../../..//div[contains(@class,"manga-list")]/div[last()]/div[@class="store-box"]/div[2]/h2/a') || eleget0('//div/a[@class="g-btn mode-more"]') || eleget0('//div[last()]/div[1]/h2[@class="manga-title"]/a') || eleget0('//div[last()]/div[@class="store-box"]/div[2]/h2/a[not(ancestor::div[@id="recomend-series-list"])]'),
      author: '//span[@class="article-text"]|//span[contains(@class,"author-name-link")]',
    }, {
      url: ['https://championcross.jp/episodes/|//youngchampion.jp/episodes/', `comic-growl.com/episodes/`, `https://rimacomiplus.jp/[^\/]+/episodes/`, `https://mangalt.jp/episodes/`],
      author: '//span[contains(@class,"author-name-link")]|//div[@class="series-h-credit-user"]/span',
      func: () => {
        oaco('a.click-link#show-more-article') // もっと見る
        oaco('span.-cv-icon.-cv-f-icon[data-icon="expand"]') // 拡大
      },
    }, {
      url: 'https://younganimal.com/episodes/|//bigcomics.jp/episodes/|//carula.jp/episodes/|//hayacomic.jp/episodes/',
      author: '//div[@class=\"series-h-credit-user\"]/span[1]',
      lastEpisode: '//div/img[@alt="無料" and @data-lazydone="1" and @height="24"]/..',
      //firstEpisode: '//div[2]/div[last()]/div/img[@class="lazyloaded mode-narrow" and @alt="無料"]/..',
      func: () => {
        oaco('a.click-link#show-more-article') // もっと見る
        oaco('span.-cv-icon.-cv-f-icon[data-icon="expand"],span.-cv-icon[data-icon="expand"]') // 拡大
      },
    }, {
      url: /\/\/youngchampion\.jp\/(?:series|episodes)\/|\/\/comicride\.jp\/(?:series|episodes)\//,
      lastEpisode: () => eleget0('//a[@class="series-ep-info-link" and contains(text(),"最新話から")]') || eleget0('//img[@class="lazyloaded mode-narrow" and @data-src="/images/icons/free_ja.svg"]') || eleget0('//span[@class="free-icon-new"]'),
      firstEpisode: () => eleget0('//a[text()="はじめから読む（無料）"]') || eleget0('//div[1]/div/div[last()]/a[contains(text(),"作品をすべて見る")]') || eleget0('//a[contains(@class,"series-act-read-btn") and text()="はじめから読む"]') || eleget0('//div/h2[not(contains(text(),"この作品を読んだあなたにオススメ"))]/../../..//div[contains(@class,"manga-list")]/div[last()]/div[@class="store-box"]/div[2]/h2/a') || eleget0('//div/a[@class="g-btn mode-more"]') || eleget0('//div[last()]/div[1]/h2[@class="manga-title"]/a') || eleget0('//div[last()]/div[@class="store-box"]/div[2]/h2/a[not(ancestor::div[@id="recomend-series-list"])]'),

      /*firstEpisode: '//a[@class="series-act-read-btn" and text()="はじめから読む"]|//div/a[contains(@class,"series-ep-info-link selected") and text()="最新話から"]',lastEpisode: '//div/div/div/a[@class="series-ep-info-link" and @onclick="orderArticleBy(1);"]|//div[@class="g-payment-article  mode-list"]/img[@src="/images/icons/free_ja.svg" and @alt="無料"]/..|//div[@class="series-ep-list-symbols"]/div/img[@alt="「待つと無料」" and @width="24"]/..|//span[@class="free-icon-new"]',*/
      //author: '//span[@class="article-text"]|//span[contains(@class,"author-name-link")]',
      author: 'span.article-text',
      pankuzuUp: 'div.series-h-title-wrap > h1.series-h-title > span',
    }, {
      url: '//youngchampion.jp/episodes',
      author: '//div[@class=\"series-h-credit-user\"]/span[1]',
      lastEpisode: '//div/img[@alt="無料" and @data-lazydone="1" and @height="24"]/..',
      //firstEpisode: '//div[2]/div[last()]/div/img[@class="lazyloaded mode-narrow" and @alt="無料"]/..',
      func: () => {
        oaco('a.click-link#show-more-article') // もっと見る
        oaco('span.-cv-icon.-cv-f-icon[data-icon="expand"]') // 拡大
      },
      keyFunc: { key: "Escape", func: e => eleget0('//div/button/img[@class="ga-popup-close"]')?.click() },
    }, {
      url: '//laza.mandarake.co.jp/',
      //      sibling: 'div.ohanashi a img',
      sibling: 'div.ohanashi img',
      pankuzuUp: '//div[@class="top"]/a/img',
      header: '//div[@class="local_head fixed"]',
      firstEpisode: '//ul[@class="shortcut"]/li[last()]/a/img/..',
      lastEpisode: () => eleget0('//li[1]/a/img[@src="/BTP_plus/img/list/saishin.png"]/..') || eleget0('//ul/li[4]/a[contains(text(),"漫画を読む")]'),
      fitFunc: () => {
        if (lh("/manga/")) addstyle.add('.local_head{transform-origin:top; transform:scale(1,0.5);}');
        fitFuncA('div.local_head.fixed', 'div.ohanashi img', 400);
      },
      author: '//div[5]/div[@class="shokai"]/div/strong',
    }, {
      url: '//baila.hpplus.jp/',
      firstEpisode: '//a[@id="mangaNextBtn0"]',
      lastEpisode: '//li[1]/article/div[last()]/a[contains(@class,"mangaNextBtn")]',
      sibling: '//div[@class="o-article-block-image__img"]/img',
      header: '//div[3]/header',
      author: '//p[@class="o-manga__profile__author"]',
      fitFunc: () => { fitFuncA('//div[3]/header', '//div[@class="o-article-block-image__img"]/img', 400); },
      scrollSpeed: 3,
      nextEpisode: '//div/a/button[@id="mangaNextBtnId"]/img',
    }, {
      url: '//www.lettuceclub.net/',
      sibling: '//div[contains(@class,"c-freearea")]/figure/a/img',
      firstEpisode: '//div[contains(@class,"p-items__frame")]/ol/li[1]/a/figure/span|//a[contains(text(),"続きを読む")]',
      nextEpisode: '//a[@class="p-pager__next"]|//a[contains(text(),"続きを読む")]|//a[@class="p-navigation__next"]',
      prevEpisode: '//a[@class="p-pager__prev"]|//div/a[@class="p-navigation__prev"]',
      pankuzuUp: '//a[contains(text(),"』連載をまとめて読む◀◀")]|//a[contains(text(),"』▶掲載話一覧")]|//a[contains(text(),"連載一覧へ →")]',
      header: '.p-globalnavi',
      author: '//h1[@class="c-heading__title"]',
      fitFunc: () => { fitFuncA('.p-globalnavi', '//figure/a/img', 400); },
    }, {
      url: '//manga.okiba.jp/',
      firstEpisode: '//div/div/table[@class="chapters"]/tbody/tr/td/div[1]/p/a',
      lastEpisode: '//div[@class="latest-section"]/p/a',
      sibling: '//img[@class="comicImage"]',
      nextEpisode: '//div[3]/div[@class="pager-next"]/a',
      prevEpisode: '//div/div[@class="pager-prev"]/a',
      author: '//div/div[@class="comment"]/p[1]/a',
      fitFunc: () => { fitFuncA('', '//img[@class="comicImage"]', 400); },
    }, {
      url: /\/\/gentukiban.?\.yakiin\.net\//,
      sibling: 'center img',
      fitFunc: () => { fitFuncA('', 'center img', 400); },
    }, {
      url: '//foodservice.ajinomoto.co.jp/article/ajitaro',
      sibling: '//ul/li/img',
      pankuzuUp: '//a[@class="back"]',
      fitFunc: () => { fitFuncA('', '//ul/li/img', 400); },
    }, {
      url: '//ichijin-plus.com/',
      firstEpisode: '//li[1]/a/div[2]/div[1]/../..',
      lastEpisode: '//a/div[1]/span[contains(text(),"最新話")]',
      pankuzuUp: '//div[contains(text(),"作品詳細")]',
      leftKey: '//div[contains(text(),"次の話へ")]',
      author: '/HTML/BODY/DIV[1]/DIV[1]/MAIN[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]',
      prevEpisode: '//div[contains(text(),"前の話へ")]',
    }, {
      url: '//kaigo.ten-navi.com/',
      firstEpisode: '//section/ul/li[last()]/article/a/div/h3[contains(@class,"card-title")]/../..',
      lastEpisode: '//ul[@class="stack-xl"]/li[1]/article/a/div/h3[@class="card-title"]',
      author: '//header/h1[@class="title-primary"]',
      sibling: '//p/picture/img|//figure/picture/img',
      header: '//header[@class="header"]',
      nextEpisode: '//span[@class="btn btn-primary btn-circle btn-sm btn-comic-next"]',
      prevEpisode: '//li/span[@class="btn btn-primary btn-circle btn-sm btn-comic-prev"]',
      pankuzuUp: '//span[contains(text(),"このマンガの連載一覧へ")]',
      fitFunc: () => { fitFuncA('//header[@class="header"]', '//p/picture/img|//figure/picture/img'), 0 },
    }, {
      url: '//www-indies.mangabox.me/',
      prevEpisode: '//a[@id="indies-header-back" and contains(text(),"戻る")]',
      leftKey: '//span[@class="indies-episode-item-next"]',
      author: '//div[@class="indies-episode-author"]/div',
    }, {
      url: '//www.comic-brise.com/',
      firstEpisode: '//a[last()]/div/div[@class="labels"]/span[@class="label-item is-free"]',
      lastEpisode: '//div/a[1]/div/div/span[@class="label-item is-free"]',
      pankuzuUp: '//a[text()="作品紹介ページへ"]',
      author: '//div[@class="article-head"]/p[@class="post-sub-title"]',
    }, {
      url: '//priucesshanage.blog.jp/',
      sibling: '//img[@class="pict"]|//h1[@class="article-title"]',
    }, {
      url: '//storia.takeshobo.co.jp/',
      firstEpisode: '//div[last()]/div[last()]/a[@class="read__link"]/div[text()="読む"]/..',
      lastEpisode: '//div[1]/a/div[@class="episode__read" and text()="読む"]',
    }, {
      url: '//360life.shinyusha.co.jp/',
      sibling: 'span.headline-icon,.large-headline',
    }, {
      url: '//www.rtings.com/',
      sibling: '.test_group,.product_page-title,h2',
      header: '//div[@class="navbar-main"]',
    }, {
      url: '//zerosumonline.com/',
      firstEpisode: '//div[@class="story_cell"]/ul/li[last()]/ul/li/a',
      lastEpisode: '//div/div[@class="read"]/a[text()=" 読む"]',
    }, {
      url: '//codezine.jp/',
      sibling: '//div[@class="manga"]|//section[@class="columnSection"]|//div[@class="article"]/h2|//section/ul[@class="catList"]/li',
      author: '//div[@class="authorName" and @itemprop="author" and @itemscope=""]/a/span[@itemprop="name"]',
      pankuzuUp: '//a[@itemprop="item"]/span[@itemprop="name"]',
    }, {
      url: '//michikusacomics.jp/',
      firstEpisode: '//div[@class="items"]/div[1]/a',
      lastEpisode: '//a[@class="su-button su-button-style-flat"]/span[contains(text(),"最新話を読む")]|//div[contains(text(),"最新話を読む")]',
      author: '//span[@class="authorName"]',
      pankuzuUp: '//p[@class="q_back_titletop" and contains(text(),"作品TOPへ")]',
    }, {
      url: '//gaugau.futabanet.jp/',
      firstEpisode: '//div[@class="detail-ex__btn-list"]/div[4]/a',
      lastEpisode: '//div[@class="detail-ex__btn-list"]/div[1]/a[@rel="noopener"]',
      author: '//div[@class="detail-ex__writer"]/a',
      pankuzuUp: '//div[@class="r-linkbutton r-sub"]/a[contains(text(),"作品詳細を見る")]',
      //func:()=>{eleget0('.toggle-btn.js-detail__list-btn')?.click()},
    }, {
      url: '//write.as/|//.*.writeas.com',
      sibling: '//article',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//ciao.shogakukan.co.jp/webwork/',
      firstEpisode: '//a[1]/section/div/div[@class="storyArea-openBtn" and contains(text(),"公開中")]',
      lastEpisode: '//section[@class="free-start"]/div/a[contains(text(),"最新話を読む")]',
      author: '//div[@class="mainArea-right"]/p[@class="author"]',
    }, {
      url: '//7irocomics.jp/',
      firstEpisode: '//li/div[@class="comic_btn"]/a[1]/div/strong',
      lastEpisode: '//div[@class="comic_btn"]/a[last()]/div/strong',
      author: '//li/div[@class="info"]/h3/strong',
      leftKey: '//div[contains(@class,"r-inner")]/div/a[contains(text(),"次へ")]',
      pankuzuUp: '//div/a[text()="作品詳細ページはこちら"]',
    }, {
      url: '//twicomi.com/',
      //sibling: 'div.index,div.page-no',
      sibling: 'div.index,div.image', //sibling: 'div.index,.page-no',
      siblingHelp: '↑↓：前次ページ',
      lastEpisode: '//div[1]/section/div/div[1]/div/a[@class="manga-image"]',
      keyNextSibling: 'ArrowDown',
      keyPrevSibling: 'ArrowUp',
      allowedGap: 60,
      pankuzuUp: '//i[@class="fas fa-fast-backward"]/..',
      keyFuncHelpXP: '//div', // 無条件にヒットするもの
      keyFuncHelp: 'A：画像を画面にフィット',
      func: () => {
        globalFlag.fit = (pref("twicomi_zflag") === undefined ? 1 : pref("twicomi_zflag"));
        SITE.setsize(globalFlag);
      },
      keyFunc: {
        key: "a",
        func: () => {
          globalFlag.fit ^= 1;
          pref("twicomi_zflag", globalFlag.fit)
          SITE.setsize(globalFlag)
          return false;
        },
      },
      setsize: (globalFlag) => {
        if (globalFlag.fit == 0) {
          popup("A:画像フィット(off)", "#808080")
          if (globalFlag.iID) {
            clearInterval(globalFlag.iID);
            globalFlag.iID = null;
            elegeta('//div[@class="image"]/img').forEach(e => {
              e.style.maxWidth = "650px";
              e.parentNode.style.maxWidth = "650px";
              e.style.height = "";
              e.style.width = "";
            });
            return;
          }
        }
        if (globalFlag.fit == 1 && globalFlag.iID == null) {
          popup("A:画像フィット(on)")
          globalFlag.iID = setInterval(() => { // a::画像を引き伸ばす
            //            $("div.index,div.page-no").css({ "padding": "0px", "height": "16.5px","margin":`${marginu}px` });
            $("div.index,div.page-no").css({ "padding": "0px", "height": "16.5px" });
            //            let wh = document.documentElement.clientHeight; //window.innerHeight;
            let wh = document.documentElement.clientHeight - marginu * 2 - 17; //window.innerHeight;
            let h = eleget0('//div[@class="index"]');
            let hy = h ? h.offsetHeight : 100;
            let ce = eleget0('//div[@class="tweet"]');
            let cliX = ce ? ce.offsetWidth : 100;
            elegeta('//div[@class="image"]/img').forEach(e => {
              {
                let oy = e.naturalHeight;
                let ox = e.naturalWidth;
                let asp = ox / oy;
                if ((asp) < (cliX / (wh - hy - 0))) {
                  e.style.height = wh - hy - 0 + "px";
                  e.style.width = ((wh - hy - 0) * asp) + "px";
                } else {
                  e.style.width = cliX + "px"
                  e.style.height = cliX / asp + "px";
                }
                e.style.maxWidth = "100%";
                e.parentNode.style.maxWidth = "100%";
              }
            })
          }, 250);
        }
      },
    }, {
      url: '//nlab.itmedia.co.jp/',
      sibling: '//div[@style="width: 596px;"]/a[last()]/..',
      //  author: '//div[@id="byline"]/a',
      header: '//div[@id="myBoxList"]',
      lastEpisode: '//div[1]/div[@class="colBoxTitle"]/h3/a',
      firstEpisode: '//div[last()]/div[@class="colBoxTitle"]/h3/a',
      fitFunc: site => { fitFuncA(site.header, `div.inner > div[style="width: 596px;"] > a:last-child > img`, 40); },
    }, {
      url: '//twitter.com/|//mobile.twitter.com|//x.com/',
      sibling: '//div/article/../../..',
      header: '.css-175oi2r.r-aqfbo4.r-gtdqiz.r-1gn8etr.r-1g40b8q',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//game.asahi.com/',
      firstEpisode: '//ul/li[last()]/div[contains(@class,"list-article__col")]/p/a',
      lastEpisode: '//ul[@class="list-article__list"]/li[1]/div/p[2]/a',
      /*    }, {
            url: '//shonenjumpplus.com/',
            firstEpisode: '//section[last()]/div/h1[@class="entry-title"]/a|//div/ul[@class="recent-entries hatena-urllist urllist-with-thumbnails"]/li[last()]/div/a[last()]',
            lastEpisode: '//section[1]/div/h1[@class="entry-title"]/a|//ul/li[1]/div[@class="urllist-item-inner recent-entries-item-inner"]/a[2]',
            sibling: '//div/div[@class="entry-content"]/p',
            author: '//h2[@class="series-header-author"]',
        */
    }, {
      url: '//boards.4channel.org/',
      sibling: '.postContainer:not(#hoverUI .postContainer),div.thread,.catalog-container',
      header: 'div#header-bar.dialog',
      pankuzuUp: '//div[@class="navLinks desktop"]/a[2]',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//the360.life/',
      sibling: '//div/div/section[@class="block"]',
      atamadashi: '//div[@class="bread-crumb bread-crumb_top"]',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//my-best.com/',
      sibling: '//div[@id="ranking"]/div[last()]/div/div/div|//div[@class="p-contents-item-part"]',
      atamadashi: '//div/div[6]/div[@id="ranking"]|//h2[@class="p-contents-ranking-header__title"]',
      disableSnapWhenPageIsClicked: 1,
      func: () => {
        //  setTimeout(()=>{GM_addStyle('.l-column{width:97%} .l-column__main{width:97%}')},100)
        setTimeout(() => { GM_addStyle('.l-column{margin:5%;width:95%;} .l-column__main{width:100%;}'); }, 100)

      },
    }, {
      url: '//bunshun.jp/',
      func1st: () => {
        if (!lh(/\/\/bunshun\.jp\/category\//) && !(lh(/\/\/bunshun\.jp\/articles\//) && eleget0('//nav/ul[contains(@class,"breadcrumb__list")]/li[2]/a[text()="コミック"]'))) { return "abort" }
        let t1 = (eleget0('//div[2]/div[@class="author-box"]/p[@class="author"]/a[1]')?.innerText || "");
        let t2 = (eleget0('//div/h2[@class="subtitle"]')?.innerText || "");
        document.title = `${t1?t1+" ":""}${t2?t2+" ":""} ${document.title}`
      },
      firstEpisode: '//ul[last()]/li[last()]/div[last()]/h3[@class="title"]/a',
      lastEpisode: '//a[@class="border" and text()="最新回を読む"]',
      sibling: '//a[@class="thumb-link ga_tracking"]/img[@class="main-image"]/../../..',
      header: 'auto',
      author: '//p[@class="author"]/a|//p[contains(@class,"name")]',
      prevEpisode: '//div/a[@class="arrow" and contains(text(),"PREV")]',
      nextEpisode: '//div/a[@class="arrow" and contains(text(),"NEXT")]',
      pankuzuUp: '//a[contains(@class,"btn ga_tracking")]',
      fitFunc: () => { fitFuncA('.header', '//img[@class="main-image"]', 400) },
    }, {
      url: '//www.mishimaga.com/',
      sibling: '//div[@class="pcVer"]/p/img',
      author: '//p[@class="name author"]',
      header: '//div[@class="head-wrap"]',
    }, {
      url: '//www.corocoro.jp/title/|//www.corocoro.jp/author/|//www.corocoro.jp/chapter/',
      firstEpisode: () => lh('//www.corocoro.jp/title/|//www.corocoro.jp/author/') && elegeta('//div[contains(@class,"col-span-1 col-start-3 row-start-1 justify-self-end")]/img[@alt="無料"]')?.pop(),
      lastEpisode: () => lh('//www.corocoro.jp/title/|//www.corocoro.jp/author/') && elegeta('//div[contains(@class,"col-span-1 col-start-3 row-start-1 justify-self-end")]/img[@alt="無料"]')?.shift(),
      author: 'ul[class*="gap-[8px]"][class*="md:gap-[12px]"] > a.text-gray.underline > li > p[class*="text-[14px]"] , div.p-4 > div.flex > div.items-center > div.flex > div[class*="flex-col"][class*="gap-2"]:nth-of-type(1) > p[class*="text-[13px]"].font-bold , div.mx-auto[class*="max-w-5xl"] > div[class*="justify-between"] > div.flex.py-2[class*="pl-4"][class*="pr-2"][class*="md:py-3"] > p',
      func: () => { addstyle.add(`div[data-testid="viewer-action-area"] { height: 100dvh !important; }`) },
    }, {
      url: '//firecross.jp/',
      lastEpisode: '//li[1]/ul/li/form/button[@class="btn-free"]',
      firstEpisode: '//li[last()]/ul/li/form[@data-api="reader"]/button[@class="btn-free"]',
      author: '//section/div/ul[@class="ebook-series-author"]/li/a|//li[contains(@class,"ebook-series-author-item")]/a',
      nextEpisode: '//button[@class="btn--simple--arrow" and contains(text(),"次の話を読む")]',
      leftKey: '//button[@class="btn--simple--arrow" and contains(text(),"次の話を読む")]|//div[@class="colophonNextArea"]/form/button/div/p[contains(text(),"次の話を読む")]',
      pankuzuUp: '//main/div/div/a[@class="btn-close" and text()="閉じる"]|//div[contains(@class,"colophonNextArea")]/a/span[text()="作品ホーム"]',
    }, {
      url: '//www.pixiv.net/artworks/|://www.pixiv.net/users/',
      atamadashi: '//div/div[@role="presentation"]',
    }, {
      url: '//www.pixiv.net/users/',
      author: '//div/div/div/div[1]/div/h1',
    }, {
      url: '//konomanga.jp/',
      firstEpisode: '//a[@id="firstStory"]/span[text()="第1話を読む"]/..',
      lastEpisode: '//div[2]/a[@id="latestStory"]/span',
      author: '//div/p[@id="authorName"]',
    }, {
      url: '//inthelife.club/',
      firstEpisode: '//div[@class="contLeft"]/section/div[2]/ul/li[last()]/a/div[@class="txtBox"]/p[1]/../..',
      lastEpisode: '//div[1]/section/div[2]/ul/li[2]/a/div[@class="txtBox"]/p[1]',
      sibling: '//div[@class="kizi-honbun"]/img',
      header: '//header[@class="headerFixed"]',
      nextEpisode: '//div[@class="contBtn"]/a',
    }, {
      url: '//i-voce.jp/',
      firstEpisode: '//div/ul/li[last()]/a/div/div/div/div[2]/p[@class="title_2AUDo"]/../../../../..',
      lastEpisode: '//div[2]/div[1]/div/ul/li[1]/a/div[1]/div/div/div[2]/p[@class="title_2AUDo"]',
      nextEpisode: '//a[@class="wp-block-ve-nextpage-copy__text"]',
    }, {
      url: '//comicborder.com/',
      author: '//h2[@class="series-header-author"]',
    }, {
      url: 'https://digitalmargaret.jp/contents/',
      leftKey: '//div[@class="r-inner"]/div/a[contains(text(),"話を読む")]',
    }, {
      url: '//digitalmargaret.jp/detail/',
      firstEpisode: '//div[last()]/div[@class="btn"]/a[contains(text(),"読む")]',
      lastEpisode: '//div[1]/div[@class="btn"]/a[contains(text(),"読む")]',
    }, {
      url: '//www.comicnettai.com/',
      firstEpisode: '//div/a[last()]/div/span[text()="読む"]',
      lastEpisode: '//a[1]/div[3]/span[@class="btn--detail--read"]',
      author: '//span[@class="detail__author__item"]',
    }, {
      url: '//novema.jp/',
      firstEpisode: '//ul/li/a[text()="第１話を読む"]',
      lastEpisode: '//a[text()="最新話を読む"]',
      author: '//ul[@class="credit"]/li',
    }, {
      url: '//www.123hon.com/',
      lastEpisode: '//div[2]/div[2]/ul[@class="read-story"]/li/a[text()="最新話を読む"]',
      firstEpisode: '//ul[contains(@class,"read-story")]/li/a[text()="第１話を読む"]',
      pankuzuUp: '//div[@class="r-inner"]/div[4]/a[text()="シリーズ一覧"]',
    }, {
      url: '//feelweb.jp/episode/',
      author: '//h2[@class="series-header-author"]',
    }, {
      url: '//manga-5.com/',
      firstEpisode: '//div[@class="product-state"]/ul/li[1]/a[1]',
      lastEpisode: '//ul[@class="list_series list-items"]/li[last()]/a[1]',
      author: '//div/div/div[@class="series-title"]/h3/strong',
    }, {
      url: '//pie.co.jp/',
      firstEpisode: '//ul[@class="articleBlockButton"]/li[last()]/a[text()="1話を読む"]|.//li[last()]/a/h3[@class="seriesPostList_title"]',
      lastEpisode: '//ul/li[@class="articleBlockButton_node"]/a[text()="最新話を読む"]',
      author: '//p[@class="articleBlock_textBox_name"]',
      nextEpisode: '//a[text()="次の連載を読む"]',
      prevEpisode: '//div/a[text()="前の連載を読む"]',
    }, {
      url: '//.+.fanbox.cc/posts/.+',
      nextEpisode: '//div[@class="sc-1vjtieq-18 jOKXGO"]/a/div',
      prevEpisode: '//div[@class="sc-1vjtieq-19 dlQSkX"]/a/div',
      sibling: '//div/div/article/div[1]/h1|//article/div[1]/div/div/div/div/div',
      atamadashi: '//div/div/article/div[1]/h1|//article/div[1]/div/div/div/div/div',
      header: '//div[@id="root"]/div[4]',
      pankuzuUp: '//a[text()="一覧に戻る"]',
      funcNextPrev: () => { setTimeout(() => { loadfocus(0, SITE.atamadashi) }, 1) },
    }, {
      url: '//pash-up.jp/',
      lastEpisode: '//a[@class="c-btn_read02"]/span[contains(text(),"最新話を読む")]/..',
      firstEpisode: '//div/a[contains(@class,"c-btn_read01")]/span[text()="1話を読む"]',
      author: '//div/p[contains(@class,"p-content_head_original")]/p',
    }, {
      url: '//togetter.com/',
      sibling: '#toptitle,.list_box,.list_box .list_photo:not(.list_box .list_photo:first-child),.md-h-2,li.has_thumb.clearfix,#comment-box-portal>div>ul>div',
      /*      header: '//div[@class="header_navigator"]|//header[@id="header"]|//div[@class="header_navigator "]',
            disableSnapWhenPageIsClicked: 1,
            fitFunc: () => fitFuncB('div.header_navigator', '//div[@class="list_photo"]/img', 400),
      */
      //scrollSpeed: 1.1,
      header: 'div.header_navigator,heade#header,div.header_navigator',
      disableSnapWhenPageIsClicked: 1,
      fitFunc: () => fitFuncB('div.header_navigator', 'div.list_photo_box img', 400),
    }, {
      url: '//posfie.com/',
      //      sibling: `div.list_box.type_tweet.impl_profile , img.lzpk.loaded:not(div.list_box.type_tweet.impl_profile img.lzpk.loaded:first-child)`,//'#toptitle,.list_box,.list_box .list_photo:not(.list_box .list_photo:first-child),.md-h-2,li.has_thumb.clearfix,#comment-box-portal>div>ul>div',
      sibling: `div.list_box.type_tweet.impl_profile , figure:not(:first-of-type)`,
      header: 'div.header_navigator,heade#header,div.header_navigator',
      disableSnapWhenPageIsClicked: 1,
      fitFunc: () => fitFuncB('div.header_navigator', 'div.list_photo_box img', 400),
    }, {
      url: '//yuik.net/',
      sibling: '#main .clearfix figure,#main li.list-group-item,#main .clearfix p',
      prevEpisode: '//a[@rel="prev"]',
      nextEpisode: '//a[@rel="next"]',
      lastEpisode: () => elegeta('p.last-updated-content-date').sort(CollEleText)?.pop(),
      header: 'div#nav',
      fitFunc: () => fitFuncA("div#nav", '//a[contains(@class,"spotlight")]/picture/img', 400),
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//yuk2.net/',
      /*    sibling: '#main .alignnone',
      header: 'div.pin',
      firstEpisode: '//ul[1]/li[last()]/div/div[last()]/a[@target="_self"]',
      lastEpisode: '//ul[1]/li[1]/div/div[last()]/a[@target="_self" and @rel="noopener"]',
      disableSnapWhenPageIsClicked: 1,
*/
      sibling: '//div/p/img',
      pankuzuUp: '//ol[@id="breadcrumb"]/li[last()]/a',
      fitFunc: site => fitFuncA("", site.sibling, 400),
      nextEpisode: '//div[@class="next-arrow"]/span',
      prevEpisode: '//div[@class="prev-arrow"]/span',
    }, {
      url: '//yakb.net/',
      sibling: '//div[@id="core"]/div/div/p[2]/img',
      pankuzuUp: '//ol[@id="breadcrumb"]/li[last()]/a',
    }, {
      url: '//mankai.jp/',
      firstEpisode: '//div[@class="pGrayWrapper"]/ul/li[last()]/a/h3/..',
      lastEpisode: '//div[@class="pGrayWrapper"]/ul[@class="modThreeBannerList"]/li[1]/a/h3',
      author: '//div/p[@class="modProfileArtistName typesquare_option"]',
      nextEpisode: '//div[@class="pageLeaveStoryBtnArea"]/p[1]/a',
      prevEpisode: '//div[@class="pageLeaveStoryBtnArea"]/p[2]/a',
      pankuzuUp: '//p/a[@class="pageComicImageLink" and text()="作品ページへ"]',
    }, {
      url: '//yanmaga.jp/columns',
      //      sibling: '//figure/a/img|//div[contains(@class,"article-body")]/h2|//div[@class="article-body"]/div/strong',
      sibling: 'figure>a>img , div[class*="article-body"]>h2 , div[class*="article-body"]>div>strong',
      nextEpisode: '//li[@class="mod-bottom-links-next"]/a/span[contains(text(),"次の記事を読む")]/..',
      firstEpisode: '//li[1]/a[@class="ga-episode-link"]',
      lastEpisode: '//a[@class="ga-episode-link"]/span[text()="最新話を読む"]|//a[@class="ga-episode-link" and contains(text(),"最新記事を読む")]', // 話一覧と漫画ページが一緒なので話移動してしまう
      author: '//div/ul[@class="mod-author"]/li/a/h2|//div[1]/div[@class="episode-info"]/div[2]/ul/li[@class="episode-info-author"]/h2/a|//span[@class="writer ml-3"]|//ul[1]/li[@class="detailv2-outline-author-item"]/a/h2|//h1[@class="detail-header-title"]',
      prevEpisode: '//li[@class="mod-bottom-links-prev"]/a',
      pankuzuUp: '//li[@class="mod-bottom-links-index"]/a/span[contains(text(),"目次")]/..', //'//a[@class="series"]',
      header: 'header',
      fitFunc: () => { fitFuncA('header', 'figure>a>img', 400); },
      insteadofClickFunc: (e) => { if (e.href) { location.href = e.href } else { e.click() } },
      func: () => { //observeUrlChanged(runAtamadashi,799)
        setInterval(() => { eleget0('//span[contains(text(),"もっと見る")]:visible')?.click() }, 1000)
      },
    }, {
      url: '//yanmaga.jp/comics',
      sibling: '//figure/a/img',
      nextEpisode: '//li[@class="mod-bottom-links-next"]/a/span[contains(text(),"次の記事を読む")]/..',
      firstEpisode: '//span[contains(text(),"１話から無料で読む")]', // 話一覧リンクと漫画ページが一緒なので→で話移動してしまう
      lastEpisode: '//span[contains(@class,"mod-episode-point--free")]',
      author: '//div/ul[@class="mod-author"]/li/a/h2|//div[1]/div[@class="episode-info"]/div[2]/ul/li[@class="episode-info-author"]/h2/a|//span[@class="writer ml-3"]|//ul[1]/li[@class="detailv2-outline-author-item"]/a/h2',
      prevEpisode: '//li[@class="mod-bottom-links-prev"]/a',
      pankuzuUp: '//li[@class="mod-bottom-links-index"]/a/span[contains(text(),"目次")]/..', //'//a[@class="series"]',
      //fitFunc: () => { fitFuncA('header', '//figure/a/img', 400); },
      //insteadofClickFunc: (e) => { if (e.href) { location.href = e.href } else { e.click() } },
      func: () => { //observeUrlChanged(runAtamadashi,799)
        setInterval(() => { let e = eleget0('//span[contains(text(),"もっと見る")][not (@data-wcs)]:visible')?.click() }, 1000)
        setInterval(() => {
          elegeta('//SPAN[@class="-cv-icon -cv-f-icon" and @data-icon="expand"][not(@data-wcs)]:visible').forEach(e => {
            e.dataset.wcs = 1;
            e.click()
          })
        }, 1000)
      },
      keyFunc: { key: "Escape", func: e => eleget0('//div/button/img[@class="ga-popup-close"]')?.click() },
    }, {
      url: '//renta.papy.co.jp/',
      firstEpisode: '//span[@class="rent_btn_word" and text()="無料サンプル"]',
      //  author: '//span[@data-book="author"]/a',
    }, {
      url: '//wanibooks-newscrunch.com/',
      firstEpisode: '//a[last()]/div[@class="m-articles-item__ttl"]/..|//a[text()="作品を読む"]',
      lastEpisode: '//a[1]/div[@class="m-articles-item__ttl"]|//a[text()="作品を読む"]',
      author: '//a[@class="article-header-authors__item c-author"]',
      pankuzuUp: '//div[@class="c-btn c-btn--black u-mb20"]/a[text()="連載トップへ戻る"]',
    }, {
      url: '//sp.comics.mecha.cc/',
      firstEpisode: '//a[@rel="nofollow" and @id="sampleBtn" and contains(text(),"無料試し読み")]',
      author: '//a[@class="p-bookInfo_author"]',
    }, {
      url: '//jumpsq.shueisha.co.jp/',
      firstEpisode: '//div[@class="btn"]/a/span[contains(text(),"試し読み")]/..',
      author: '//section/div[@class="contents rensai"]/h2/em',
    }, {
      url: '//kc.kodansha.co.jp/',
      firstEpisode: '//a[contains(text(),"試し読みする")]',
      author: '//div[@class="author"]/a',
    }, {
      url: '//ebookstore.sony.jp/',
      firstEpisode: '//a[@sample="1" and contains(text(),"試し読み")]',
    }, {
      url: '//sp.handycomic.jp/',
      firstEpisode: '//a[@class="btn--base-bg-blue" and text()="無料試し読み"]',
      author: '//div[@class="author-list"]/a',
    }, {
      url: '//note.com/',
      sibling: '//img[@data-modal="true"]/../..',
      author: '//div[@class="o-noteContentHeader__name"]/a',
      //  header:'//div[@class="o-navbarNoteDetail__body"]',
    }, {
      url: /\/\/tsumanne.net\/si\/data\/|\/\/tsumanne.net\/my\/data\//,
      sibling: '.thre>a:first-child,.thre table:not(.ftbpu table,#pickbox table,#respopup_area table,.floated table)',
      pankuzuUp: '//p/a[text()="「」ッチー"]',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//.+.2chan.net/|//.{3}.ftbucket.info/scrapshot/|//anige.horigiri.net/|//.*.ftbucket.info/.*/cont/.*',
      sibling: '.thre>a:first-child,.thre table:not(.ftbpu table,#pickbox table,#respopup_area table,.floated table)',
      pankuzuUp: '//li[@class="catlink"]/a[text()="勢順"]', //'//li[@class="catlink"]/a[contains(text(),"カタログ")]',
      header: '#site-identity',
      atamadashiSpeed: 1.1,
      //atamadashi: '//html/body/hr[2]',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//comic.mf-fleur.jp/',
      firstEpisode: '//div[@class="cb-story-links__item--title" and contains(text(),"第1話")]|.//div[@class="cb-story-links__item--title" and contains(text(),"第1回")]',
      lastEpisode: '//div[last()]/div[@class="cb-story-links__item--title"]',
      sibling: '//div[contains(@class,"acms-grid")]/div/img/..',
      prevEpisode: '//div[2]/a[@class="manga-pager__btn _prev"]',
      nextEpisode: '//div[@class="manga-pager"]/a[@class="manga-pager__btn _next"]',
      pankuzuUp: '//div[@class="cb-buttons__list--text"]',
      author: '//a[@class="cb-author__link"]',
    }, {
      url: '//kuzure.but.jp/',
      sibling: '.thre,.thre table:not(.ftbpu table,#pickbox table,#respopup_area table,.floated table)',
      pankuzuUp: '//a[text()="[ＨＯＭＥ]"]',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//www.comicgum.com/',
      firstEpisode: '//ul[@class="comicsmall"]/li[last()]/a/h3',
      lastEpisode: '//a[@class="overlay"]/h3[text()="最新話を読む"]',
    }, {
      url: '//oshiete.goo.ne.jp/watch/',
      header: '//header/div[@id="header"]',
      firstEpisode: '//div[@class="writing_btn"]/a[text()="第1話から読む"]',
      lastEpisode: '//li[1]/div[@class="writingList_inner"]/a/div[2]/h3[@class="writingList_title"]',
      author: '//div[@class="writing_writer"]/a|//div[@class="profile_rt"]/h1[@class="profile_title"]',
      nextEpisode: '//a[@class="nextRt" and text()="次の話"]',
      prevEpisode: '//a[@class="prevLt" and text()="前の話"]',
      sibling: '//p[@class="articleText comic_main_img"]/img',
      pankuzuUp: '//h2[@class="comicProfile_title"]/a',
    }, {
      url: '//comip.jp/nekoyoko/',
      sibling: '//div[@id="manga"]/canvas',
      author: '//div[@class="comic-detail-content-right"]/h2',
      nextEpisode: '//img[@class="btn-next-story"]|//img[@class="btn-next-story align-right"]',
      prevEpisode: '//img[@class="btn-prev-story align-left"]|//img[@class="btn-prev-story"]',
    }, {
      url: '//piccoma.com/',
      firstEpisode: '//a[@id="js_readFirstEpisode"]/span/..|//li[1]/a/div[@class="PCM-epList_ep"]/div[1]/h2|//a[contains(@class,"PCM-prdVol_readBtn")]/span[contains(text(),"試し読み")]',
      lastEpisode: '//a[@id="js_readContinue"]/span',
      author: '//ul[@id="js_author"]/li/a',
    }, {
      url: '//static.ichijinsha.co.jp/',
      firstEpisode: '//p[2]/a[contains(text()," HTML5版でブックを開く")]',
      pankuzuUp: '//p[@class="pagelist_link"]/a',
    }, {
      url: '//pokeman.jp/',
      firstEpisode: '//div[1]/div/p/a[@class="manga-viwer-button"]',
      pankuzuUp: '//a/span[text()="無料まんが"]',
    }, {
      url: '//comip.jp/spinel/',
      firstEpisode: '//ul/li[1]/a/span[2]/span[@class="c-marker"]/../..',
      lastEpisode: '//a[@class="works__new__button"]',
      author: '//div[@class="works__title__inner"]/div/h3|//div[@class="cst_author"]',
    }, {
      url: '//pokeman.jp/',
      firstEpisode: '//a[@class="manga-viwer-button" and contains(text(),"漫画の続きを読む")]',
    }, {
      url: '//comic.k-manga.jp/',
      firstEpisode: '//a[@class="book-info--btn btn__secondary" and contains(text(),"無料試し読み")]|//a[@class="book-info--btn book-info--btn__jikuri"]/img|//div[@class="book-info--btn-wrap"]/a[@rel="nofollow" and contains(text(),"試し読み")]',
      pankuzuUp: '//ol[@class="breadcrumb--target"]/li[last()-1]/a',
    }, {
      url: '//bookwalker.jp/',
      firstEpisode: '//div[@class="main-cover-inner"]/span[text()="試し読み"]/../..|//a[@aria-label="試し読み"]/span[@class="btn-txt" and text()="試し読み"]',
      author: '//a[@class="author-name"]',
    }, {
      url: '//bigcomicbros.net/',
      firstEpisode: '//span[@class="btn-link__txt" and contains(text(),"試し読み")]',
      author: '//p[@class="comic-detail-main__author"]',
    }, {
      url: /\/\/bigcomics\.jp\/series\/|\/\/kansai\.mag-garden\.co\.jp\/series\/|\/\/hayacomic\.jp\/series\//,
      lastEpisode: () => eleget0('//a[@class="series-ep-info-link" and contains(text(),"最新話から")]') || eleget0('//img[@class="lazyloaded mode-narrow" and @data-src="/images/icons/free_ja.svg"]') || eleget0('//span[@class="free-icon-new"]'),
      firstEpisode: () => eleget0('//a[text()="はじめから読む（無料）"]') || eleget0('//div[1]/div/div[last()]/a[contains(text(),"作品をすべて見る")]') || eleget0('//a[contains(@class,"series-act-read-btn") and text()="はじめから読む"]') || eleget0('//div/h2[not(contains(text(),"この作品を読んだあなたにオススメ"))]/../../..//div[contains(@class,"manga-list")]/div[last()]/div[@class="store-box"]/div[2]/h2/a') || eleget0('//div/a[@class="g-btn mode-more"]') || eleget0('//div[last()]/div[1]/h2[@class="manga-title"]/a') || eleget0('//div[last()]/div[@class="store-box"]/div[2]/h2/a[not(ancestor::div[@id="recomend-series-list"])]') || elegeta('a#null-false.article-ep-list-item-img-link.click-link.g-episode-link-wrapper:has(span.free-icon-new):text*=第(1|一)(話|回)')?.shift() || eleget0('//a[contains(@class,"series-ep-info-link ") and contains(text()," 1 - ")]'),
      /*  }, {
            url: '//bigcomics.jp/series/',
            lastEpisode: () => eleget0('//a[@class="series-ep-info-link" and contains(text(),"最新話から")]') || eleget0('//img[@class="lazyloaded mode-narrow" and @data-src="/images/icons/free_ja.svg"]') || eleget0('//span[@class="free-icon-new"]'),
            firstEpisode: () => eleget0('//a[text()="はじめから読む（無料）"]') || eleget0('//div[1]/div/div[last()]/a[contains(text(),"作品をすべて見る")]') || eleget0('//a[contains(@class,"series-act-read-btn") and text()="はじめから読む"]') || eleget0('//div/h2[not(contains(text(),"この作品を読んだあなたにオススメ"))]/../../..//div[contains(@class,"manga-list")]/div[last()]/div[@class="store-box"]/div[2]/h2/a') || eleget0('//div/a[@class="g-btn mode-more"]') || eleget0('//div[last()]/div[1]/h2[@class="manga-title"]/a') || eleget0('//div[last()]/div[@class="store-box"]/div[2]/h2/a[not(ancestor::div[@id="recomend-series-list"])]'),
            */
      author: '//span[@class="article-text"]',
      sibling: 'div.row.row2-line img.manga2-img,div.row.row2-line img.manga-web-img',
      prevEpisode: '//a[@class="click-link" and text()=" 前話"]|//a[@data-event-detail="article-next-page"]/div[@class="ep-f-nav-h" and contains(text(),"前の話")]',
      nextEpisode: '//span[@class="title-next"]|//*/div[@class="ep-f-nav-h" and text()="次の話"]',
      pankuzuUp: '//a[@class="a-series-title"]|//div[@class="col-sm-9 col-xs-8 series-user-box"]/a/span[@class="article-text"]|//div/div[@class="content-box-inner"]/div/div[last()]/div[@class="col-xs-12"]/a[text()="戻る"]|//div[@class="series-h"]/div/div/div[@class="series-h-credit-user"]/a/span',
      fitFunc: () => { fitFuncA('header', 'div.row.row2-line img.manga2-img,div.row.row2-line img.manga-web-img', 400, null, 'footer:inscreen'); },
      scrollSpeed: 2,
      header: 'header',
      atamadashi: '//div/img[@class="prof-h-icon-img"]',
    }, {
      url: '//sp.comics.mecha.cc/',
      firstEpisode: '//a[@class="btnBlue" and text()="第1話を読む"]',
      lastEpisode: '//ul[@class="listNews"]/li[1]/a/div/div/p[@class="listArticleTitle"]',
      sibling: '//div[@class="comic_content_area"]/p/img/..',
      header: '//ul[@class="mechamaga_nav"]',
      prevEpisode: '//div[1]/div/ul/li[@class="prev"]/a',
      nextEpisode: '//div[2]/div/ul[@class="comic_paging"]/li[@class="next"]/a',
      author: '//p[@class="short_comic_author"]/a',
    }, {
      url: '//vw.mangaz.com/',
      firstEpisode: '//a[@class="btn" and text()="すぐに読む"]',
      pankuzuUp: '//ul/li[@class="btnEnd"]/a/span[text()="本を閉じる"]',
    }, {
      url: '//www.mangaz.com/',
      firstEpisode: '//button[@class="open-viewer book-begin" and contains(text(),"無料で読む")]|//button[@class="open-viewer series-begin ga" and text()="最初から読む"]|.//p/button[@type="button" and @class="open-viewer book-begin ga" and contains(text(),"無料で読む")]',
      nextEpisode: '//p[@class="nextBtnModBtn"]/a[@target="mangaz-viewer"]',
      author: '//div[@class="bookHeadDetail"]/ul/li/h2/a|//div[3]/div[@class="header"]/ul/li[1]/a|//section[@class="head"]/h1[@class="authorName"]',
      pankuzuUp: '//div[@class="rightMod"]/ul/li/a[text()="書誌に戻る"]|//div[@class="topicPath"]/ul/li[2]/a',
      moveEpisodeFunc: (e) => { if (e.dataset.url || e.href) { location.href = e.dataset.url || e.href; } else { e.click() } }, // mangazのためだけの処理
    }, {
      url: '//www.cmoa.jp/',
      firstEpisode: '//div[@class="btn2_area_btn3 GA_free"]|//a/div[@class="btn2_area_btn1 GA_free"]|//div[@class="btn2_area_btn4 GA_free"]',
      author: '//div[@class="title_details_author_name"]/a',
    }, {
      url: '//j-nbooks.jp/',
      lastEpisode: '//a[@class="button btn_main" and text()="最新話を読む"]',
      firstEpisode: '//a[@class="button btn_main" and text()="1話目を読む"]',
      nextEpisode: '//a[@class="linkToNext"]',
      pankuzuUp: '//div[@class="container"]/div/a[text()="作品ページへ戻る"]',
      disableSnapWhenPageIsClicked: 1,
      registFunc: () => { $(document).keydown(e => { if (e.keyCode == 37) { $(eleget0('//div[contains(@class,"swiper-button-next swiper-button-black") and @role="button" and @aria-label="Next slide"]')).click(); } else if (e.keyCode == 39) { $(eleget0('//div[@class="swiper-button-prev swiper-button-black" and @aria-label="Previous slide"]')).click(); } }) },
    }, {
      url: '//www.lezhin.com/',
      firstEpisode: '//div[@class="comicInfo__btns"]/a[text()="最初から読む"]',
      author: '//div[@class="comicInfo__artist"]/a',
      pankuzuUp: '//a[contains(@class,"vh__episodeLink")]',
    }, { //
      url: '//animesoku.com/',
      sibling: '.t_b,.article-title,.comment-info,.article-body-inner',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//matome.usachannel.info/*',
      sibling: '.matome,.entry-title',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//iroirosokuhou.com/|//chansoku.com/',
      sibling: '.t_h,.article-header,.comment-info',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//dot.asahi.com/',
      firstEpisode: '//li[last()]/article/div/a/h2[@class="comicAuthorListTitle"]/..',
      lastEpisode: '//li[1]/article/div/a/h2[@class="comicAuthorListTitle"]',
      sibling: '//div[@class="comicAtclAreaPhoto"]/img/..',
      nextEpisode: '//li[@class="comicArticlePagerNext"]/a',
      prevEpisode: '//li[@class="comicArticlePagerPrev"]/a',
      pankuzuUp: '//li[@class="comicArticlePagerTop"]/a',
      author: '//div[@class="articlProfileInfo"]/p[@class="articlProfileNameTxt"]/a|//p[@class="comicAuthorNameTxt"]',
    }, {
      url: '//kidsna.com/',
      lastEpisode: '//ul/li[1]/div[@class="articlelist-content"]/div/a/h2',
      firstEpisode: '//ul/li[last()]/div[@class="articlelist-content"]/div/a/h2',
      author: '//div[@class="article-item-kidsna-link-publisher"]/div/div[@class="article-item-kidsna-link-title"]/p',
    }, { //
      url: '//4komagram.com/',
      sibling: '//div[@class="p-users-profile__posts"]/article',
      header: '//header',
      disableSnapWhenPageIsClicked: 1,
      author: '//h2[@class="p-users-profile__head__title u-align-center"]',
    }, {
      url: '//margaretbookstore.com/',
      firstEpisode: '//li[last()]/div[@class="bookItemStory"]/div[last()]/a',
      lastEpisode: '//li[1]/div[@class="bookItemStory"]/div/a',
    }, {
      url: '//curazy.com/manga/',
      firstEpisode: '//ul[@class="manga_tabContent_list"]/li[1]/a[@class="list_item_episode_stories"]/span[2]',
      lastEpisode: '//ul[@class="manga_tabContent_list"]/li[last()]/a/span[2]',
      author: '//div[@class="manga_mainContent manga_mainContent_basicInfoWrap"]/dl[1]/dd/a/span',
    }, {
      url: '//mavo.takekuma.jp/',
      firstEpisode: '//a[last()]/li/div/p[@class="mangatitle"]',
      lastEpisode: '//ul[@class="manga"]/a[1]/li/div/p[@class="mangatitle"]',
      sibling: '//img[@class="protector"]/..',
      header: '//html/body/nav[@id="header"]/div[@id="menu"]',
      pankuzuUp: '//div[@id="slide"]/div/a/img[@alt="タイトルへ戻る"]',
    }, {
      url: '//getnavi.jp/category/comic/|//getnavi.jp/comic/',
      firstEpisode: '//div[last()]/div[@class="category-color-before-comic"]/div[2]/a',
      lastEpisode: '//div[1]/div[@class="category-color-before-comic"]/div[2]/a',
      sibling: '//img/..',
      author: '//p[@class="name"]/a[@rel="author"]',
      pankuzuUp: '//div[@class="inner"]/div[@class="entry-content more"]/blockquote/p/a',
    }, {
      url: '//kansai.mag-garden.co.jp/',
      firstEpisode: '//div[@class="entry_contents multiple"]/div[2]/div[2]/ul[@class="btn"]/li[1]/a/span/..|//div[@id="back_number"]/div[last()]/div/ul/li/a|.//li[@class="btn_pink"]/a/span[contains(text(),"読切を読む")]',
      lastEpisode: '//div/div[@class="entry_box"]/div[2]/div[last()]/div[last()]/ul/li[1]/a/span',
    }, {
      url: '//booklive.jp/',
      firstEpisode: '//div[@class="product_actions"]/ul[last()]/li[2]/a/span[text()="ブラウザ試し読み"]|//ul[@class="sub_actions clearfix"]/li[last()]/a/span[text()="無料で読む"]|//div[@id="product_area1"]/div/div/ul/li/a/span[contains(text(),"無料で読む")]',
    }, { // ニコニコ静画（漫画）
      url: '//manga.nicovideo.jp/watch/|//manga.nicovideo.jp/comic/|//manga.nicovideo.jp/manga/list',
      //      sibling: '//div[@class="pages"]/ul/li',
      sibling: 'div.pages ul li.page',
      //      header: '//div[@class="common-header-cdesjj"]|//div[@class="detail_inner"]/div[3]/section[@id="ko_head_bar_min"]', //'//body/div[@id="CommonHeader"]/div/div',
      header: 'section#ko_head_bar_min.content_list_head_bar , .common-header-cdesjj,detail_inner>div #ko_head_bar_min', //'//body/div[@id="CommonHeader"]/div/div',
      func1st: () => {
        //        addstyle.add('section#ko_head_bar_min.content_list_head_bar , div.content_list_head_bar_wrapper{display:none !important;}')
        if (atamadashi == "true") addstyle.add('section#ko_head_bar_min.content_list_head_bar {display:none !important;}')
      },
      atamadashi: '//div[@class="pages"]/ul/li',
      author: '//div[@class="author"]/h3/span|//span[@class="author_name"]|//span[@class="author_info"]/div[@class="name"]/a', // Amazonを基点に～の管轄
      firstEpisode: '//a[@class="first"]',
      lastEpisode: '//a[@class="last"]',
      prevEpisode: '//p[@class="prev"]/a',
      nextEpisode: '//span[@class="next_text"]|//a[@class="next"]',
      pankuzuUp: '//div/div/div[@class="title"]/h1/span[@class="manga_title"]/a[1]|//a/span[@class="author_name"]|//div[contains(@class,"mg_author_inner inner")]/div[@class="author_list"]/div[@class="author"]/div[last()]/div[1]/span/div/a[@class="sakushaantenna"]/font',
      displayPageNumber: 1,
      fitFunc: lh("\/comic\/") ? null : () => {
        //        fitFuncA('//div/div[@class="common-header-cdesjj"]|//section[@id="ko_head_bar_min"]', 'li canvas:not(.spread canvas),#page_contents img:not(.spread img):inscreen', 400);
        fitFuncA('//div/div[@class="common-header-cdesjj"]|//section[@id="ko_head_bar_min"]', 'li canvas,#page_contents img:not(.spread img):inscreen', 400);
        /*
                var fitf = (f = 0) => {
                  var mh = "calc(100vh - 12px - " + (elegeta('//div/div[@class="common-header-cdesjj"]|//section[@id="ko_head_bar_min"]').reduce((a, b) => Math.max(a, ((b?.getBoundingClientRect()).bottom)), 0)) + "px)";
                  elegeta('li canvas:not(.spread canvas),#page_contents img:not(.spread img):inscreen').filter(e => f || e.style.maxHeight != mh).forEach(e => {
                    e.style.width = "auto";
                    e.style.maxHeight = mh
                  })
                }
                document.addEventListener("scroll", fitf);
                setInterval(() => fitf(1), 400)
                fitf();*/
      },
    }, {
      url: '//crea.bunshun.jp/',
      firstEpisode: '//li[last()]/a/p[@class="title"]',
      lastEpisode: '//li[1]/a/p[@class="title"]',
      author: '//div[@class="box cf"]/div/h2[@class="name"]|//div[1]/div[@class="cf"]/p[@class="text-right"]',
      sibling: '//figure[@class="image-area figure-center"]|//article/figure[@class="image-area figure-center notdisplay"]/img/..',
      header: '//header[@id="header"]',
    }, {
      url: '//www.gentosha.jp/series/|//www.gentosha.jp/article/',
      firstEpisode: '//div[@class="btnStyle01"]/a[text()="第1回から読む"]',
      lastEpisode: '//article[1]/a/div/h2[@class="title"]',
      author: '//ul[@class="authorList"]/li/label/cite',
      sibling: '//div[@id="content"]/div/div[1]/p/img/..|//div[@class="figure-center"]/img/..',
      nextEpisode: '//div[contains(@class,"seriesLink")]/ul/li[last()]/a',
      prevEpisode: '//div/div[contains(@class,"seriesLink")]/ul/li[1]/a',
      pankuzuUp: '//div[@id="container"]/div[@id="topicPath"]/ol/li[3]/a',
      fitFunc: () => { fitFuncA('', 'div.articleDetail > p > img', 400); },
    }, {
      url: '//ddnavi.com/', //url: '//ddnavi.com/serial',
      //sibling: ':is(div.article-body__main > div , div.article-body__main div figure img , img.size-full):not(div.biblio-item.clearfix.articletop.nobw * , div.clearfix > figure > a > img)',
      sibling: ':is(div.article-body__main > div img, div.article-body__main div figure img , img.size-full):not(div.biblio-item.clearfix.articletop.nobw * , div.clearfix > figure > a > img)',
      nextEpisode: () => eleget0('//p/a[contains(text(),"＞＞ 次のページに続く")]') || eleget0('//div[contains(@class,"pager")]/div/a[contains(text(),"＞＞ 次のページに続く")]') || eleget0('//a[@class="next" and text()="次の回"]'),
      prevEpisode: () => eleget0('//a[@class="prev" and contains(text(),"前の回")]') || eleget0('//a[@rel="prev"]'),
      firstEpisode: '//li[1]/a/span[@class="badge-number"]',
      lastEpisode: '//a/span[@class="badge-number" and text()="最新話"]',
      pankuzuUp: '//ol[@class="breadcrumb"]/li[3]/a/span[@itemprop="name"]',
      author: '//span[@itemprop="author"]/span|//h1[@class="archives-title"]',
      fitFunc: () => { fitFuncA('', 'div.article-body__main div figure img , img.size-full', 400); },
    }, {
      url: '//www.sukima.me/',
      firstEpisode: '//button[@type="button" and contains(text(),"最初から読む")]|//button[text()="試し読み"]|//button[text()="期間限定無料で読む"]|//button[text()="¥0で読む"]|//span[contains(@class,"v-btn__content")]/p[contains(text(),"最初から読む(登録不要)")]',
      author: '//a[@class="author"]',
      nextEpisode: '//a[@class="js-ripple chaptEndNavi__page__next--free"]|//div[@class="chaptEndNavi__page"]/a[1]', //'//i[@class="material-icons" and text()="menu"]|.//div[@class="chaptEndNavi__page"]/a[1]',
      pankuzuUp: '//div[@class="golinks border-left"]/a[last()]|//li[last()]/a[@class="v-breadcrumbs__item"]|//a[@class="chaptEndNavi__page__next--last js-ripple"]',
      delay: 500,
    }, {
      url: '//omocoro.jp/writer',
      lastEpisode: '//div[@class="details"]/div[3]/a[contains(text(),"漫画")]',
      firstEpisode: '//div[last()]/div[last()]/div[3]/a[contains(text(),"漫画")]',
    }, {
      url: '//sportsbull.jp/',
      firstEpisode: '//div[last()]/ul/li[last()]/div/div[2]/a[contains(text(),"読む!")]',
      lastEpisode: '//a[@data-is-free="1" and @class="comics_btn" and text()="読む!"]',
    }, {
      url: '//comic-zenon.com/episode/',
      author: '//h2[@class="series-header-author"]',
    }, {
      url: '//comic-medu.com/', ////div[1]/a[@class="series-ep-info-link" and contains(text(),"最新話から")]
      lastEpisode: () => eleget0('//a[@class="series-ep-info-link" and contains(text(),"最新話から")]') || eleget0('//img[@class="lazyloaded mode-narrow" and @data-src="/images/icons/free_ja.svg"]') || eleget0('//span[@class="free-icon-new"]'),
      firstEpisode: () => eleget0('//a[text()="はじめから読む（無料）"]') || eleget0('//div[1]/div/div[last()]/a[contains(text(),"作品をすべて見る")]') || eleget0('//a[contains(@class,"series-act-read-btn") and text()="はじめから読む"]') || eleget0('//div/h2[not(contains(text(),"この作品を読んだあなたにオススメ"))]/../../..//div[contains(@class,"manga-list")]/div[last()]/div[@class="store-box"]/div[2]/h2/a') || eleget0('//div/a[@class="g-btn mode-more"]') || eleget0('//div[last()]/div[1]/h2[@class="manga-title"]/a') || eleget0('//div[last()]/div[@class="store-box"]/div[2]/h2/a[not(ancestor::div[@id="recomend-series-list"])]'),
      author: '//span[@class="article-text"]',
      sibling: 'div.row.row2-line img.manga2-img,div.row.row2-line img.manga-web-img',
      prevEpisode: '//a[@class="click-link" and text()=" 前話"]|//a[@data-event-detail="article-next-page"]/div[@class="ep-f-nav-h" and contains(text(),"前の話")]',
      nextEpisode: '//span[@class="title-next"]|//*/div[@class="ep-f-nav-h" and text()="次の話"]',
      pankuzuUp: '//a[@class="a-series-title"]|//div[@class="col-sm-9 col-xs-8 series-user-box"]/a/span[@class="article-text"]|//div/div[@class="content-box-inner"]/div/div[last()]/div[@class="col-xs-12"]/a[text()="戻る"]|//div[@class="series-h"]/div/div/div[@class="series-h-credit-user"]/a/span',
      fitFunc: () => { fitFuncA('header', 'div.row.row2-line img.manga2-img,div.row.row2-line img.manga-web-img', 400, null, 'footer:inscreen'); },
      scrollSpeed: 2,
      header: 'header',
      atamadashi: '//div/img[@class="prof-h-icon-img"]',
      /*
            firstEpisode: '//div[@class="btDetail"]/a[@class="btDetailL" and contains(text(),"第1話")]|//ul[@class="episode"]/li[1]/a|//div[3]/a[@class="btDetailR" and text()="読む"]',
            lastEpisode: '//a[@class="btDetailR" and text()="最新話"]|//a[@class="btDetailR" and text()="最新回を読む"]',
            author: '//div[@class="author"]/div/h3',
            pankuzuUp: '//div[@class="storyDrawer"]/div[2]/a',*/
    }, {
      url: '//csbs.shogakukan.co.jp/book',
      firstEpisode: '//a[@class="button is-link"]/span[contains(text(),"試し読み")]|//a[@class="button is-link"]/span/em[contains(text(),"まるごと試し読み")]',
      author: '//dl[1]/dd[@class="column"]/ul/li/a',
    }, {
      url: '//sonorama.asahi.com/',
      firstEpisode: '//li[last()]/div[@class="series_comic_btn"]/a',
      lastEpisode: '//li[1]/div[@class="series_comic_btn"]/a',
      author: '//div[@class="m10 comic"]/div/a',
      leftKey: '//button[@class="slick-next"]',
      rightKey: '//button[@class="slick-prev"]',
      nextEpisode: '//ul[@class="comicViewer_nav_list"]/li/a[text()="次話"]',
      prevEpisode: '//ul[@class="comicViewer_nav_list"]/li/a[text()="前話"]',
      pankuzuUp: '//ul[@class="comicViewer_nav_list"]/li/a[text()="一覧へ"]',
    }, {
      url: '//www.yatate.net/',
      firstEpisode: '//li[last()]/article/div[@class="detail"]/h1/a',
      lastEpisode: '//li[1]/article/div[@class="detail"]/h1/a',
    }, {
      url: '//comic-polaris.jp/|//kirapo.jp/polaris/|//kirapo.jp/meteor/|//kirapo.jp/ambre/|//kirapo.jp/etoile/|//kirapo.jp/zulet/|//kirapo.jp/astir/',
      firstEpisode: '//a[text()="第1話を読む"]|//a[contains(@class,"button-pink episode-read") and text()="読み切りを読む"]',
      lastEpisode: '//a[text()="最新話を読む"]',
      //leftKey:'a#next_button',
      //pankuzuUp:'a#next_button:text*=作品詳細ページ',
      //shiftupKey:'a#next_button:text*=作品詳細ページ',
      author: `#author+div a.button-gray.m-0.my-3.white-space-unset`, //'//div[@class="work_author_intro_name"]',
    }, {
      url: '//bunshun.jp/',
      firstEpisode: '//li[last()]/div/h3[@class="title"]/a',
      lastEpisode: '//p[@class="latest-link"]/a',
      author: '//div/p[@class="name"]|//div/div[@class="author-box"]/p[@class="author"]/a',
      sibling: '//div[@class="image-with-link"]/a/img/../../..',
      nextEpisode: '//a[@class="arrow" and text()="NEXT"]',
      prevEpisode: '//div[@class="prev"]/a[@class="arrow"]',
      pankuzuUp: '//div[@class="series-title"]/h2/a',
    }, {
      url: '//sokuyomi.jp/',
      firstEpisode: '//div[2]/a[contains(text(),"無料で読む")]|//div[@id="AP_thumb_area"]/a[text()="試し読み"]',
      //author: '//div[@class="author"]/a',
    }, {
      url: '//cbiz.shueisha.co.jp/',
      firstEpisode: '//ul[@class="pageLink"]/li/a[text()="第1話を読む"]',
      lastEpisode: '//ul[@class="pageLink"]/li/a[contains(text(),"最新話を読む")]',
      author: '//main[@class="sblab"]/section[@class="read"]/em',
    }, {
      url: '//mankai.jp/',
      firstEpisode: '//ul/li[1]/a[@class="js-viewerlink"]/h3/..',
      lastEpisode: '//ul/li[last()]/a[@class="js-viewerlink"]/h3',
      pankuzuUp: '//button[@value="作品一覧に戻る"]|//a[@class="gbFooterListLink" and contains(text(),"作品一覧")]',
      author: '//p[@class="modProfileArtistName"]',
    }, {
      url: '//books.vipdoor.info/',
      firstEpisode: '//dl[@id="comic-parts"]/dd[1]/ol/li[1]/a',
      lastEpisode: '//dd[last()]/ol[@class="comic-part-pages"]/li[last()]/a',
      nextEpisode: '//a[@rel="next"]',
      prevEpisode: '//a[@rel="prev"]',
      sibling: '//div[@id="article"]/ol/li/a/img',
      pankuzuUp: '//a[@class="page-nav-link"]',
    }, {
      url: /https:\/\/younganimal\.com\/series\/|\/\/(?:magazine\.)?comici\.jp\/|\/\/ebookstore\.corkagency\.com\//,
      lastEpisode: () => eleget0('//a[@class="series-ep-info-link" and contains(text(),"最新話から")]') || eleget0('//img[@class="lazyloaded mode-narrow" and @data-src="/images/icons/free_ja.svg"]') || eleget0('//span[@class="free-icon-new"]'),
      firstEpisode: () => eleget0('//a[text()="はじめから読む（無料）"]') || eleget0('//div[1]/div/div[last()]/a[contains(text(),"作品をすべて見る")]') || eleget0('//a[contains(@class,"series-act-read-btn") and text()="はじめから読む"]') || eleget0('//div/h2[not(contains(text(),"この作品を読んだあなたにオススメ"))]/../../..//div[contains(@class,"manga-list")]/div[last()]/div[@class="store-box"]/div[2]/h2/a') || eleget0('//div/a[@class="g-btn mode-more"]') || eleget0('//div[last()]/div[1]/h2[@class="manga-title"]/a') || eleget0('//div[last()]/div[@class="store-box"]/div[2]/h2/a[not(ancestor::div[@id="recomend-series-list"])]') || elegeta('a#null-false.article-ep-list-item-img-link.click-link.g-episode-link-wrapper:has(span.free-icon-new):text*=第(1|一)(話|回)')?.shift() || eleget0('//a[contains(@class,"series-ep-info-link ") and contains(text()," 1 - ")]'),
      author: '//span[@class="article-text"]',
      sibling: 'div.row.row2-line img.manga2-img,div.row.row2-line img.manga-web-img',
      prevEpisode: '//a[@class="click-link" and text()=" 前話"]|//a[@data-event-detail="article-next-page"]/div[@class="ep-f-nav-h" and contains(text(),"前の話")]',
      nextEpisode: '//span[@class="title-next"]|//*/div[@class="ep-f-nav-h" and text()="次の話"]',
      pankuzuUp: '//a[@class="a-series-title"]|//div[@class="col-sm-9 col-xs-8 series-user-box"]/a/span[@class="article-text"]|//div/div[@class="content-box-inner"]/div/div[last()]/div[@class="col-xs-12"]/a[text()="戻る"]|//div[@class="series-h"]/div/div/div[@class="series-h-credit-user"]/a/span',
      fitFunc: () => { fitFuncA('header', 'div.row.row2-line img.manga2-img,div.row.row2-line img.manga-web-img', 400, null, 'footer:inscreen'); },
      scrollSpeed: 2,
      header: 'header',
      atamadashi: '//div/img[@class="prof-h-icon-img"]',
    }, {
      url: '//pachikuri.jp/',
      firstEpisode: '//div[@class="sakuhinFuncs__btnFirst"]/a',
      lastEpisode: '//div[@class="sakuhinFuncs__btnLatest"]/a',
      sibling: '//main[@id="js-manga"]/img|//main/span[@class="not_resizing"]/img',
      author: '//span[@class="sakuhinDtails__author"]|//div[@class="headline__txt__author--mangaHead"]',
      nextEpisode: '//a[contains(text(),"次の話へ")]',
      prevEpisode: '//a[@class="mangaFuncs__btn mangaFuncs__btn--prev"]',
      pankuzuUp: '//a[contains(text(),"作品紹介ページへもどる")]',
    }, {
      url: '//kinmaweb.jp/',
      sibling: '//div/a[@class="no-icon"]/img/..',
    }, { //
      url: '//kodansha-cc.co.jp/',
      firstEpisode: '//dl[last()]/dd/div/div[@class="pcv"]/a/div[@class="comic-more"]',
      lastEpisode: '//dl[1]/dd/div[@class="smanone2"]/div/a/div[@class="comic-more"]',
      author: '//div[@id="seriesHeader"]/ul/li'
    }, {
      url: '//www.gamespark.jp/',
      firstEpisode: '//div[@class="news-list"]/section[last()]/a[@class="link"]',
      lastEpisode: '//div[@class="news-list"]/section[1]/a[@class="link"]',
      sibling: '//article/div[@class="txt-center"]/a/img/..|//a/img[@class="inbody-img"]/..|//article/div[@class="txt-center"]',
      header: '//header[@class="thm-header"]/nav',
      pankuzuUp: '//div/article[contains(@class,"arti-body cf cXenseParse")]/div/a/b',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//www.mangabox.me/special/',
      firstEpisode: '//ul[@class="episodes_list"]/li[1]/a/div/div/span[1]',
      lastEpisode: '//li[last()]/a/div/div/span[@class="episodes_strong_text is_new"]',
    }, {
      url: '//nikkangecchan.jp/',
      firstEpisode: '//div[@class="button"]/a[text()="1話から読む"]',
      lastEpisode: '//div[contains(@class,"btnBox")]/div/a[text()="最新話を読む"]',
      author: '//div[@class="author"]'
    }, {
      url: '//mangalifewin.takeshobo.co.jp/',
      lastEpisode: '//div[@class="bookR"]/ul/li/a',
      firstEpisode: '//ul[@class="bookul"]/li[last()]/div[@class="bookR"]/ul/li[last()]/a',
      author: '//div/div/div/div[@class="cOutlineInnerInner"]/p[1]',
      prevEpisode: '//ul/li[@class="prev"]/a',
      sibling: 'div.img img',
      header: '#headerAreaOuter,#headerAreaSection',
      pankuzuUp: '//a[contains(text(),"一覧に戻る")]',
      fitFunc: () => fitFuncA('#headerAreaOuter,#headerAreaSection', 'div.img img', 400),
    }, {
      url: '//medibang.com/',
      firstEpisode: '//div[last()]/div/div[last()]/a[@class="btn read"]|//li/div/a[@class="jq_readFixed" and contains(text(),"WEBで読む")]',
      lastEpisode: '//div[1]/div/div[@class="btn_area"]/a[@class="btn read"]',
    }, {
      url: '//debut.shonenmagazine.com/',
      firstEpisode: '//div[last()]/div/div[@class="card-cmn-comic-in"]/div[@class="box-detail"]/div/a[@class="box-detail__link-group"]/h3/span',
      lastEpisode: '//div[1]/div/div[@class="card-cmn-comic-in"]/div/div/a[@class="box-detail__link-group"]/h3/span',
      author: '//div[@class="box-profile-small-01"]/div[@class="txt-normal"]/a'
    }, {
      url: '//ashitano.tonarinoyj.jp/',
      firstEpisode: '//div[@id="contributor-work-list-theme-item-wrap"]/section[last()]/a/h3/span/../..|//section[1]/a/div/p[@class="series-episode-number"]|//div[last()]/section[@class="contributor-work-item"]/a/div/div[1]/h3/span',
      lastEpisode: '//section[@id="contributor-work-list"]/div[1]/section/a/div/div/h3/span|//section[last()]/a/div[@class="series-item-status"]/p',
      author: '//section[@class="contributor-profile js-contributor-profile"]/h1|//div/div[@class="series-contributor"]/a/p[@class="series-profile-name"]/span'
    }, {
      url: '//www.comic-ryu.jp/',
      firstEpisode: '//div/div[@id="webcomic"]/div[last()]/a/span[last()]/..|//li[last()]/p[@class="readbtn"]/a',
      lastEpisode: '//div/div[@id="webcomic"]/div[1]/a/span[last()]/..|//p[@class="readbtn"]/a/img[@alt="NEW"]/..', //)?.pop(), // 最後の1個を使用
      nextPage: '//a[@id="NextLink" and @title="次ページ"]',
      prevPage: '//a[@id="PrevLink" and @title="前ページ"]',
      nextEpisode: '//div[@id="NextGo"]/a[@id="nextLast"]',
      pankuzuUp: '//div[@id="toback"]/a[text()="作品ページへ戻る"]',
      author: '//div[@id="profile"]/p[@class="name"]|//div/p[@class="name"]/span',
    }, {
      url: '//comip.jp/z/',
      firstEpisode: '//div[@class="column_main"]/ul/li[last()]/div[@class="thumb"]/a',
      lastEpisode: '//div[@class="column_main"]/ul/li[1]/div[@class="thumb"]/a',
      author: '//div[@class="creator"]'
    }, { // ツイ４(1)
      url: '//sai-zen-sen.jp/comics/twi4/',
      sibling: '//article',
      //header: '//body/header/div[@class="hgroup"]',
      atamadashi: '//article[last()]',
      author: '//h3[1]/span[@class="work-author"]',
      lastEpisode: '//article[last()]/header/div/h3',
      fitFunc: () => {
        setInterval(() => {
          elegeta('//div[@class="pgroup"]/p/img').forEach(e => {
            e.style.maxHeight = "calc(100vh - 12px - " + (eleget0('//body/header/div[@class="hgroup"]')?.offsetHeight) + "px)";
            e.style.position = "initial";
          })
        }, 2999)
      },
    }, { // 花椿
      url: '//hanatsubaki.shiseidogroup.jp/comic',
      sibling: '//div/figure/img/../../../../../../../..', //'|//section/div',
      header: '//div[@class="controller"]/div[1]',
      author: '//div[@class="row text-center"]/div[@class="col col-8 col-sm-12 person"]/div[@class="grid"]/div[@class="row text-left"]/div[last()]/h4[1]'
    }, { // web漫画アンテナ
      url: '//webcomics.jp/',
      sibling: () => eleget0('#favtable') ? elegeta('tr.favhisentry') : elegeta('.entry'),
      //      sibling: '.entry',
      header: '#header',
      disableSnapWhenPageIsClicked: 1,
      displayPageNumber: 1,
    }, { // bokete
      url: '//bokete.jp/',
      sibling: ':is(div.ad_fourm_inarticle > div[style="display: block;"] , div[style="margin: 0.5rem 0px;"] , main > div.ad_fourm_inarticle > main > div ,div[style="margin:.5rem 0"] > div):has( a.none-highlight > h1)',
      header: 'auto',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//ruijianime.com/',
      sibling: '//div[@class="sm_one_tag_search recent_tag"]|//div[@class="sm_one"]',
      disableSnapWhenPageIsClicked: 1,
    }, { // コミックぜにょん
      url: '//www.zenyon.jp/lib/',
      sibling: '//div[@id="viewer_content"]/img',
      nextEpisode: '//a/img[@class="btn_next"]/..',
      author: '//p[@class="author"]',
      firstEpisode: '//div/ul[@id="sakuhin_backnumber_ul"]/li[last()]/a[text()="1"]',
      lastEpisode: '//p[@class="sakuhin_btn_new"]/a/img/..',
      pankuzuUp: '//a/img[@alt="作品ページへ" and @class="btn_sakuhin"]/..',
    }, { //
      url: '//souffle.life/manga/',
      sibling: 'div.sf-content_img img',
      header: 'div#sf-scroll_header',
      scrollSpeed: 2,
      nextEpisode: '//span[@class="sf-next_btn"]/a',
      prevEpisode: '//span[@class="sf-before_btn"]/a',
      firstEpisode: '//section[1]/div[@class="sf-content sf-authors"]/section[@class="sf-content_books_related"]/div/article[3]/div/div[@class="sf-contents_book_read"]/a|//div[@class="sf-content_book_related"]/article[last()]/div/div[@class="sf-contents_book_read"]/a', ////article[last()]/div/div[@class="sf-contents_book_read"]/a',
      lastEpisode: '//div[@class="alm-reveal"]/article[1]/div[@class="sf-content_book_description"]/div/a',
      pankuzuUp: '//p[@class="sf-content_book_name"]/a',
      author: '//span[@class="sf-author_name"]',
      fitFunc: () => fitFuncA('div#sf-scroll_header', 'div.sf-content_img img', 400),
    }, { //
      url: '//souffle.life/author/',
      firstEpisode: '//section[1]/div[@class="sf-content sf-authors"]/section[@class="sf-content_books_related"]/div/article[3]/div/div[@class="sf-contents_book_read"]/a', ////article[last()]/div/div[@class="sf-contents_book_read"]/a',
      lastEpisode: '//div[@class="alm-reveal"]/article[1]/div[@class="sf-content_book_description"]/div/a',
      author: '//span[@class="sf-author_name"]',
    }, { //
      url: '//www.moae.jp/comic/|.moae.jp/lineup/',
      sibling: '//div[@class="img"]/a/img/../..',
      lastEpisode: '//ul[@class="detail-trial"]/li[1]/a',
      author: '//section/section[@class="mod-profile-block"]/dl/dt',
      pankuzuUp: '//li[@class="lineup"]/a/img'
    }, {
      url: '//www.comic-essay.com/read/',
      prevEpisode: '//a[@class="c-btn _btn-pager-left js-viewing-indelible" and text()="前の話へ"]',
      nextEpisode: '//div/a[@class="c-btn _btn-pager-right js-viewing-indelible"]',
      sibling: '//div[@class="episode-comic__image"]/img',
      pankuzuUp: '//a[contains(text(),"作品詳細はこちら")]',
      fitFunc: () => { fitFuncA('', '.episode-comic__image img:inscreen', 400); },
      //fitFunc: () => { elegeta('.episode-comic__image img').forEach(e => e.style.maxHeight = "calc(100vh - 12px)") },
    }, { // コミックエッセイ劇場
      url: '//www.comic-essay.com/episode/|//www.comic-essay.com/links/',
      firstEpisode: () => elegeta('//div[@class="episode-list__item--title"]').sort(CollEleText).shift(),
      lastEpisode: '//div/ul[2]/li/a/div[@class="episode-list__item--title"]',
      author: '//div[@class="episode-profile__item--name"]/a|//span[@class="episode-info__author--item"]/a|//div[@class="author-detail__name--main"]',
      pankuzuUp: '//span[@class="episode-info__author--item"]/a',
    }, { //
      url: '//www.comic-essay.com/neko/',
      sibling: '//article/div[@class="scene"]/img',
      header: '//body/div[@id="pagetop"]/header',
      nextEpisode: '//div[2]/ul/li[last()]/a[text()="次の話"]',
      prevEpisode: '//div[@class="pagenation pc"]/ul/li/a[contains(text(),"前の話")]',
      disableSnapWhenPageIsClicked: 1,
      author: '//div[@class="txtarea"]/h4[@class="ttl-name"]',
      firstEpisode: '//li[1]/a[@class="btn-episode"]/p/..',
      lastEpisode: '//div[@class="episode-new"]/a/p|//li[last()]/a[@class="btn-episode"]/p/..',
      pankuzuUp: '//div[@id="pagetop"]/ul/li[last()-1]/a',
    }, { // 裏サンデー
      url: '//urasunday.com/',
      sibling: '//img[@class="dumimg"]/..',
      //      nextEpisode: '//div[@id="prBanner"]/a[contains(text(),"次の話を今すぐ読む!! →")]',
      firstEpisode: '//div[@class="comicInner"]/ul[2]/li[1]/a',
      lastEpisode: '//div[@class="comicButtonDateBox"]/a|//div[@class="chapter"]/ul/li[1]/a/div',
      author: '//li[@class="detailComicTitle"]/h2|//div[@id="comicDetail"]/h2|//div[@class="author"]',
      pankuzuUp: '//li/a[@href="../index.html"]',
      func: () => {
        addstyle.add(`#viewer { height: 100dvh !important; }`);
        eleget0(`#viewer`)?.scrollIntoView()
      },
      //  func: function() { $(eleget0('//div[@id="btn-scale"]/div[1]/div[text()="拡大"]')).click(); }
    }, { // やわらかスピリッツ
      url: '//yawaspi.com/',
      sibling: '//div/div[@class="page__detail__vertical"]/div/ul/li/img/..|//section[@class="comicContainer"]/a/img[1]/..|//div[@class="vertical__inner"]/ul/li/img',
      firstEpisode: '//section[@class="page__detail"]/div[@class="page__detail__inner"]/div[@class="detail__image"]/span|//ul[@class="inner__content"]/li[last()]/a/dl/dt',
      lastEpisode: '//ul[@class="inner__content"]/li/a/dl/dt|//li[@class="-new"]/a/dl/dt',
      author: '//li[@class="comicDetails"]/hgroup[1]/h2|//header[@class="header -page"]/div[@class="page__header"]/p/strong',
      pankuzuUp: '//li[@class="browserCtrlLeft"]/a'
    }, { // コミックバンチ
      url: '//www.comicbunch.com/manga/',
      sibling: '//div[@class="view"]/a/img/..|.//span[@class="guard_np"]/../..',
      nextEpisode: '//ul[@class="btn cf"]/li/a[text()="次の話"]',
      prevEpisode: '//ul[@class="btn cf"]/li/a[text()="前の話"]',
      firstEpisode: '//div[@class="backnumber cf"]/ul/li[last()]/a',
      lastEpisode: '//div[@class="backnumber cf"]/ul[@class="cf"]/li[1]/a',
      author: '//div[@id="comics"]/h4|//div[@class="title"]/h3|//div/div[@class="title push"]/h3',
      pankuzuUp: '//a[text()="作品紹介"]'
    }, {
      url: '//pocket.shonenmagazine.com/',
      delay: 555,
      author: 'h3.p-episode__comic-name',
      lastEpisode: 'div.c-episode-item__ico.c-episode-item__ico--free',
    }, { // コミックDAYS他
      url: '//comic-days.com/episode/|//tonarinoyj.jp/episode/|//shonenjumpplus.com/episode/|//kuragebunch.com/episode/|//pocket.shonenmagazine.com/episode/|//viewer.heros-web.com/episode/|//comic-action.com/episode/|//comic-gardo.com/episode/|//magcomi.com/episode/|//comic-ogyaaa.com/|//comic-trail.com/episode/|//comic-seasons.com/episode/|//ichicomi\.com/episode/',
      author: '//h2[@class="series-header-author"]', //'//div/h2[@class="series-header-author"]'
      rightKey: '//a[@class="previous-link js-add-query-parameter-from-to-uri"]',
      sibling: () => !eleget0('body#page-viewer:inscreen') && elegeta('li.comment-container , a.series-episode-list-container'),
    }, { //    }, { //
      url: '//ganma.jp/',
      author: '//figure[@ng-if="magazine.author.isDefined"]/figcaption/h4[@class="ng-binding"]',
      firstEpisode: '//li[1]/a[@class="detail-action-all"]|//li[@class="ng-scope"]/a[@class="detail-action-all ng-scope" and contains(text(),"第１話へ")]',
      lastEpisode: '//ng-include/div[@class="story-right ng-scope" and @ng-if="item._story.releaseStart"]',
    }, { //
      url: '//www.sunday-webry.com/episode/',
      author: '//div/h2[@class="series-header-author"]',
    }, { //
      url: '//rookie.shonenjump.com/series/|//rookie.shonenjump.com/users/',
      author: '//span[@class="user-name"]/a/strong|//h2[@class="user-name"]|//p[2]/a/span[@class="user-name"]',
      firstEpisode: '//li[1]/a/p[1]/span/../..',
      lastEpisode: '//li[last()]/a/p[1]/span/../..',
      //      sibling: eleget0('.viewer-vertical') ? 'p.page-area.js-page-area img,a.button.next-episode-button' : "",
      sibling: eleget0('.viewer-vertical') ? 'p.page-area.js-page-area img' : "",
      pankuzuUp: '//a[contains(text(),"作品ページへ")]|//a/span[@class="series-title"]|//span[@class="user-name"]/a/strong',
      nextEpisode: eleget0('.viewer-vertical') ? '//a[@class="button next-episode-button"]' : "",
      leftKey: eleget0('.viewer-vertical') ? null : '//div/div[@class="page-upper"]/div/p/a[@class="button next-episode-button"]',
      fitFunc: eleget0('.viewer-vertical') ? () => {
        let mh = () => {
          if (GF?.fitfuncBon === 0) return;
          elegeta('p.page-area.js-page-area img:not([data-maxheightbackup])').forEach(e => {
            e.dataset.maxheightbackup = e.style.maxHeight || "none";
            e.style.width = "auto";
            e.style.maxHeight = "calc(100vh - 18px)"; //e.animate([{maxHeight:"calc(100vh - 18px)"}],{duration:333,fill:"forwards"})
          })
        }
        cbOnce(() => document.addEventListener("scroll", mh))
        mh()
      } : null, // 画面縦にフィット
    }, { //
      url: '//www.comico.jp/challenge/|//www.comico.jp/articleList',
      author: `a > div > div.textBox[class*="genre_item"]`, //'//p[contains(@class,"__author")]/a|//article/div/p[@class="user-comment02__name"]/a',
      firstEpisode: `div:nth-child(1) > div.item > div.item_info > div`, //'//ul/li[1]/a[@class="list-episode02__item-inner" and @data-articleno="1"]/div/p|//ul/li[1]/a[@class="btn03 btn03--white _nextArticleBtn" and text()="はじめから読む"]|//div[contains(@class,"list-episode02")]/ul[@class="list-episode02__list _articleList"]/li[1]/a/div/p',
      lastEpisode: `div.item_cover:last-of-type > div > div.item_info > div.textBox`, //'//div[@class="stage__body stage__body--fixed-footer"]/div[2]/div[@class="stage__ly-col2-main stage__ly-col2-main--episode"]/div[last()]/ul/li[last()]/a[@class="list-episode02__item-inner"]/div[contains(@class,"list-episode02__body")]/p',
      sibling: `div.objectFit`, //prevEpisode: '//a/img[@alt="前の話"]/..|//img[@alt="前の話"]',
      header: `div.header`,
      //fitFunc: () => { fitFuncA('', '.objectFit', 400); },
      nextEpisode: `div.footer_button_group > a:nth-child(2):inscreen`, //'//a/img[@alt="次の話"]/..|//img[@alt="次の話"]',
      prevEpisode: `div.footer_button_group > a:nth-child(1):inscreen`, //
      //cancelScrollOnChangingEpisode: 1,
      pankuzuUp: `div.header_content > div.title_group > a`, //'//a[@class="comico-global-header02__list-nav-item-inner"]/i[@class="i-arrow-l i-arrow-l--large"]|//div[@class="article-hero03__body"]/p[1]/a[1]|//div/ul/li[@class="comico-global-header02__list-nav-item"]/a/i',
    }, {
      url: '//www.comico.jp/comic/',
      firstEpisode: '//a[@class="link_first"]',
      sibling: '//div[@class="canvas_wrapper"]/div',
      lastEpisode: '//li[last()]/a/div[last()]/span[contains(text(),"無料")]',
      author: '//div[1]/dl[@class="list_writer"]/dd',
      nextEpisode: '//a[@class="link_continue"]',
      //fitFunc: () => { fitFuncA(null, 'img,.wrap-canvas',400,()=>{elegeta('img,.wrap-canvas').forEach(e=>e.style.backgroundRepeat="no-repeat") } ), 0 },
    }, { //
      url: '//www.comico.jp/detail|//www.comico.jp/challenge/detail',
      prevEpisode: '//a/img[@alt="前の話"]/..',
      nextEpisode: '//a/img[@alt="次の話"]/..',
      author: '//p[contains(@class,"__author")]/a',
      pankuzuUp: '//a/img[@alt="話一覧"]/..',
    }, { //
      url: '//daysneo.com/works/',
      author: '//div/p[@class="author"]/a[1]',
      firstEpisode: '//li[1]/div[last()]/dl/dt/strong/a',
      lastEpisode: '//li[last()]/div[last()]/dl/dt/strong/a',
      pankuzuUp: '//a[text()="作品詳細ページへ"]',
      nextEpisode: '//span[text()="次の話へ"]',
      fitFunc: () => { fitFuncA('', '#fullpage .section img', 400); },
    }, { //
      url: '//ebookjapan.yahoo.co.jp/',
      disableSnapWhenPageIsClicked: 1,
      //func:()=>{setTimeout(()=>{let e=eleget0('//*[@class="header__title"]');if(e){document.title=e.innerText; } } ,2000)}, // 作品名をタブ名に入れる // できない
      author: '//p[@class="book-main__author"]/a|//p[@class="book-main__author underline"]/a|//a[@class="contents-caption__author underline"]',
      firstEpisode: '//a[@class="btn btn--primary btn--read" and text()="始めから読む"]|//a[@class="btn btn--primary btn--read btn--sub-text" and contains(text(),"無料")]|//a[@class="btn btn--primary btn--read btn--sub-text" and contains(text(),"試し読み")]|//li[last()]/div/div[@class="book-item__actions"]/a[contains(@class,"btn")]/strong[text()="無料"]|//a[@class="btn btn--primary btn--read"]|//div[@class="book-main__purchase"]/a[contains(text(),"試し読み")]|//a[@aria-current="page" and contains(text(),"始めから読む")]|//button[@type="button" and contains(text(),"始めから読む")]',
      lastEpisode: '//li[1]/div[@class="book-item book-item--disp-list book-item--btn-include-single"]/div[2]/a/strong|//div[2]/ul/li[1]/button/span[contains(@class,"icon-btn__text") and contains(text(),"無料")]',
    }, { //
      url: '//mangacross.jp/comics/',
      author: '//div[@class="comic-area__author"]|//p[@class="viewer-page__author"]|//section[@class="setting"]/div/div/div/div/h2[@class="comic-area__author"]|//h2[@class="comic-area__author"]',
      firstEpisode: '//a[text()="1話から読む"]|//a[text()="第１話を読む"]|//li[last()]/a/div[@class="episode-list__number"]',
      lastEpisode: '//a[text()="最新話を読む"]|//ul[@class="episode-list"]/li[1]/a/div[2]',
      leftKey: '//div[@class="end-page__series-button end-page__series-button--green"]/a',
      pankuzuUp: '//div[@class="end-page__series-button end-page__series-button--white"]/a',
      func: () => {
        waitAndDo(e => eleget0('button.viewer-button.viewer-button--max'), e => e?.click()) //真ん中の「すべてのフィルタ ツール」を左の箱に入れる
        function waitAndDo(checkFunc, func) { // checkFuncがtrueになったらfuncを実行
          let ret = checkFunc();
          if (ret || ret?.length > 0) { func(ret) } else { setTimeout(waitAndDo, 333, checkFunc, func) }
        }
        //document.addEventListener("focus", () => eleget0('button.viewer-button.viewer-button--max')?.click()), eleget0('button.viewer-button.viewer-button--max')?.click()
      },
      //func: () => eleget0('button.viewer-button.viewer-button--max')?.click(),
    }, { //
      url: '//comic.mag-garden.co.jp/',
      author: '//div/div[@class="inner"]/h3'
    }, { //
      url: '//www.mangabox.me/reader/',
      author: '//div/p[@class="episodes_author"]',
      lastEpisode: '//SPAN[@class="episodes_strong_text is_new"]/../..',
      firstEpisode: '//li[last()]/a/div/div[@class="episodes_item_detail"]/span'
    }, { //
      url: '//cycomi.com/fw/cycomibrowser/chapter/',
      firstEpisode: '//a[1]/div/p[@class="chapter-title"]',
      lastEpisode: '//a[last()]/div/p[@class="chapter-title"]',
      author: '//p[@class="title-author"]',
      pankuzuUp: '//a[text()="作品TOP"]',
    }, { //
      url: '//mangahack.com/comics/',
      sibling: '.comic_img img,.webtoon_img img',
      header: 'header',
      nextEpisode: 'div.pageNavi:nth-child(6) > ul > li.right > a',
      author: '//div[@class="nameArea cf"]/div[@class="official"]/a|//div/div[@class="comicTitle cf"]/ul/li/span[@class="c_name"]/a|//div[@class="cf"]/p/a',
      firstEpisode: '//a[text()="はじめから読む"]',
      lastEpisode: '//li[last()]/a[text()="最新話を読む"]',
      prevEpisode: 'div.pageNavi.cf:nth-child(3) > ul > li.left > a',
      pankuzuUp: '//div[1]/ul[@class="cf"]/li/span[1]/a',
      fitFunc: () => { fitFuncA('header#linktop.page-header', '.comic_img img,.webtoon_img img', 400, null, "div#readHeader,div.cookie-agreement"); },
    }, { //
      url: '//manga-park.com/title/',
      author: '//p[@class="author txtColorSubject"]',
      /*firstEpisode: () => !eleget0('div.manga-face.active') && elegeta('div.chapter ul li:has(.free-badge svg) p:visible')?.[0],
            lastEpisode: () => !eleget0('div.manga-face.active') && elegeta('div.chapter ul li:has(.free-badge svg) p:visible')?.pop(),
      */
      firstEpisode: () => !eleget0('div.manga-face.active') && elegeta('li .free-badge:visible')?.[0],
      lastEpisode: () => !eleget0('div.manga-face.active') && elegeta('li .free-badge:visible')?.pop(),
      /*firstEpisode: () => !eleget0('div.manga-face.active') && eleget0('//div[@class="row title"]/div[@class="chapter"]/ul/li[1]/div[1]/div/div/span[@class="txtColorSubjectSP" and text()="1"]'),
                  lastEpisode: () => !eleget0('div.manga-face.active') && elegeta('#mangadetail_badge-free')?.pop()?.closest("li"), //'//div[@class="row title"]/div[@class="chapter"]/ul/li[last()]/div[1]/div/div/span',
            */
      leftKey: '//div[@class="btn read-next-chapter"]', //'//div[@class="right"]/div[@class="btn read-next-chapter"]',
      pankuzuUp: () => eleget0('div.btn.close-viewer:visible'),
    }, { //
      url: '//www.alphapolis.co.jp/manga/',
      author: '//div/div[@class="author"]/span/a[1]|//div[@class="mangaka"]/a|//div[@class="author-label"]/div[2]/a',
      firstEpisode: '//div[@class="first-time-free"]/a[contains(text(),"第１回を無料で読む")]|//section/div[@class="manga-detail-toc section"]/div[@class="toc"]/div[contains(@class,"episode-list")]/a[last()]/div[2]/div[1]|//a[text()="第１回を読む"]',
      prevEpisode: '//a[@class="prev-link "]',
      pankuzuUp: '//div[@class="banner"]/a[@target="_top"]/img',
      lastEpisode: '//div[@class="episode-list"]/a[1]/div/div[1]/../..|//div[1]/a[last()]/object[1]/a/span[text()="この話を読む"]',
      leftKey: '//a[@class="next-link "]',
    }, { //
      url: '//web-ace.jp/',
      sibling: '//div[@class="box inner viewerImageBox"]/a/img[1]/../../..',
      nextEpisode: '//section/div/div/a[text()="次の話へ"]',
      prevEpisode: '//a[text()="前の話へ"]',
      firstEpisode: '//a[contains(text(),"最初から読む")]',
      lastEpisode: '//ul/li[1]/a/div/div[@class="media-body"]/p[@class="text-bold"]|//ul/li[1]/a[@class="navigate-right"]/ul/li/div[@class="media-body"]/p',
      pankuzuUp: '//a[text()="作品TOPへ"]',
      author: '//span[@class="WorkSummary-headerinfo"]|//p[@class="author"]/span',
      atamadashiDelay: 900,
      fitFunc: () => { fitFuncA('', '//div[@class="box inner viewerImageBox"]/a/img', 400); },
    }, { //
      url: '//comic.webnewtype.com/contents/',
      sibling: '//div[@id="viewerContainer"]/div/div[@class="box inner viewerImageBox"]/a/img[1]/../../..',
      nextEpisode: '//a/img[@alt="次の話"]/..|//li[@class="detail__next-btn"]/a[text()="次の話 ＞"]',
      prevEpisode: '//header[@class="ViewerHeader"]/nav/a/img[@alt="前の話へ"]/..|//li[contains(@class,"detail__prev-btn")]/a',
      author: '//span[@class="WorkSummary-headerinfo"]|//div[@class="contents__info"]',
      firstEpisode: '//a[contains(text(),"最初から読む")]|//ul[@id="episodeList"]/li[last()]/a/div/div[last()]/p|//li/a[@class="detail__model--first-btn"]',
      lastEpisode: '//section/ul/li[1]/a/div/h3[@class="ListCard-title"]/../..|//li[1]/a/div[2]/div[2]/p[@class="number"]|//div/ul[@class="contents__list--comic" and @id="episodeListDsc"]/li[1]/a/ul/li/div/div[@class="detail__txt--date"]',
      pankuzuUp: '//h1[@class="ViewerHeader-title"]/a|//a[@class="detail__model--more-btn" and contains(text(),"話一覧に戻る")]',
      atamadashiDelay: 900,
      scrollSpeed: 2,
      header: '.nav-list',
      fitFunc: () => { fitFuncA('#header,.nav-list:visible', '#viewerContainer img', 100, (e, mh) => { e.style.height = mh }), 0 }, // 画面縦にフィット*/
    }, { //
      url: '//www.ebigcomic4.jp/title/',
      lastEpisode: '//span[@class="episodeName"]',
    }, { //
      url: '.5ch.net/',
      sibling: '.post:not(.ch5pu .post),div#boardname', //'//dl[@class="thread"]/dt|//span[@class="number"]/../..',
      //sibling: '.post', //'//dl[@class="thread"]/dt|//span[@class="number"]/../..',
      header: '.navbar-fixed-top>.container,div.row.noflex.maxwidth100.white.padding0p5.maxheight2p5.borderbottomlightgrey',
      pankuzuUp: '//a[contains(text(),"■掲示板に戻る■")]|//div[@id="boardname"]/a[last()]|//html/body/div/div[contains(@class,"row noflex maxwidth100")]/div[@id="threadcontent"]/div[@id="boardname"]/div/a[2]',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '.shitaraba.net/bbs/read.cgi/|.shitaraba.net/bbs/read_archive.cgi/',
      sibling: '.post',
      header: '.site-header',
      pankuzuUp: '//a[contains(text(),"■掲示板に戻る■")]',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//www.ganganonline.com/',
      firstEpisode: '//a[last()]/div[2]/p[contains(@class,"Chapter_chapter__mainText__")]',
      lastEpisode: '//a[2]/div[contains(@class,"Chapter_chapter__body__")]/p[1]',
      author: '//div[contains(@class,"title_detail_")]/h1',
      delay: 1000,
      leftKey: '//button[contains(@class,"viewer_viewer__nextChapterButton__") and contains(text(),"次の話へ")]',
    }, { //
      url: '//watamote.com/',
      sibling: '//span[@class="res"]/..',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//news.mynavi.jp/series/|//news.mynavi.jp/article/',
      sibling: 'img.photo_table__img',
      author: '//a[@class="article-author__name"]|//div[@class="article-author"]/a|//h3[contains(@class,"articleAuthor_nameHead")]',
      nextEpisode: () => eleget0('ul.articleSeries_indexList.gtm li.is-current')?.previousElementSibling?.querySelector('a') || null,
      prevEpisode: () => eleget0('ul.articleSeries_indexList.gtm li.is-current')?.nextElementSibling?.querySelector('a') || null,
      firstEpisode: '//div/section[last()]/div[@class="tile3__link js-link"]/div[@class="tile3__thumb"]/div/img[@class="tile3__img"]|//div/main[@class="main"]/section/table[@class="table"]/tbody/tr[last()]/td/a[@class="table__link"]|.//ul[@class="summaryList_list gtm"]/li[last()]/a/div[@class="summaryList_listNode_info"]/h3',
      lastEpisode: '//section[1]/div/div/div[@class="tile3__img-wrap"]/img|//main[@class="main"]/section[@class="box"]/table[@class="table"]/tbody/tr[1]/td[@class="table__td"]/a|.//li[1]/a[@class="summaryList_listNode_link"]/div[@class="summaryList_listNode_info"]/h3',
      pankuzuUp: '//p[@class="article-header__series"]/a',
      header: `header`,
      fitFunc: () => { fitFuncA('header', "picture , picture > img", 400); },
    }, { //
      url: '//matogrosso.jp/',
      sibling: '.entry-body img',
      nextEpisode: '//div/a[@rel="next"]',
      prevEpisode: '//div/a[@rel="prev"]',
      author: '//h3[@class="widget-header"]/a|//div[@class="widget-authordescription"]/div/p[1]/span[1]',
      firstEpisode: '//div[@class="asset-content"]/div[@class="asset-body"]/dl/dd[last()]/a',
      lastEpisode: '//div[@class="asset-body"]/dl/dd[1]/a',
      pankuzuUp: '//h3[@class="widget-header"]/a[1]',
      fitFunc: () => { fitFuncA('', ".entry-body img", 400); },
    }, { //
      url: '//sukupara.jp/',
      sibling: '//div[@class="magarea"]/img/..',
      author: '//div[@id="artist"]/dl/dt',
      firstEpisode: '//a/img[@alt="第1回はコチラから"]',
      lastEpisode: '//p[@class="newest-story-tit"]/a',
      pankuzuUp: '//ul[@class="menulist clearfix"]/li[last()-1]/a',
      fitFunc: () => { fitFuncA("", '//div[@class="magarea"]/img') },
    }, { //
      url: '//cho-animedia.jp/comic_category/|//cho-animedia.jp/comic/',
      sibling: '//div[@class="contents"]/p/img', //'//section[@class="contents_area"]/div[@class="contents"]', //
      header: '//html/body/header[@class="fixed"]',
      nextEpisode: '//dl[last()]/dt/a/img[@class="attachment-full size-full wp-post-image"]/..',
      prevEpisode: '//dl[1]/dt/a/img[@class="attachment-full size-full wp-post-image"]/..',
      firstEpisode: '//li[last()]/a/div[@class="photo"]/img/../..',
      lastEpisode: '//li[1]/a/div[@class="photo"]/img/../..',
      pankuzuUp: '//div[@class="breadcrumbs"]/ul/li[last()-1]/a',
    }, { //
      url: '//leedcafe.com/',
      author: '//div[@class="creator-header clearfix"]/h2/a',
      lastEpisode: '//div[1]/div/div/div/p/a[@class="btn btn-default"]',
      firstEpisode: '//div[last()]/div/div[@class="inner"]/div/p/a[@class="btn btn-default" and text()="この話を読む"]',
    }, { //
      url: '//storia.takeshobo.co.jp/manga/',
      author: '//div[@class="name_intro_author"]',
      firstEpisode: '//div[last()]/div[@class="box_episode_text"]/a[@class="btn"]',
      lastEpisode: '//div[last()]/div[1]/div[@class="box_episode_text"]/a[1]',
      pankuzuUp: '//a[text()="作品ページへ"]',
    }, { //
      url: '//www.tatan.jp/',
      sibling: '//div[@id="viewer_content"]/img',
      nextEpisode: '//a/img[@class="btn_next"]',
      prevEpisode: '//a/img[@class="btn_prev"]',
      author: '//p[@class="author"]',
      firstEpisode: '//ul[@id="sakuhin_backnumber_ul"]/li/a[text()="1"]',
      lastEpisode: '//a/img[@alt="最新話を読む"]/..',
      pankuzuUp: '//a/img[@class="btn_sakuhin"]/..',
    }, { //
      url: '//cakes.mu/',
      sibling: '//img[@class="dropshadow"]/..|.//div[5]/p/img/..|//div[4]/div[@class="article-content"]/h1', //|//div[@class="article-content"]/h1',
      header: '//header[@class="postHeader"]',
      nextEpisode: '//li[@class="navi-items next"]/a[@data-ga="post:header:next"]',
      prevEpisode: '//li[@class="navi-items prev"]/a[@data-ga="post:header:previous"]',
      author: '//div/p[@class="post-author"]/span|//div[@data-cakes-amazon=""]/div[@id="container_right"]/div/h3/a',
      firstEpisode: '//li[last()]/h3[@class="post-title-full"]/a',
      lastEpisode: '//li[1]/h3[@class="post-title-full"]/a',
      pankuzuUp: '//h2[@class="post-title"]/a',
    }, { //
      url: '//kawaii2ch.com/',
      sibling: '//div[contains(@class,"t_h")]/div/..|//a[@class="related-entry-title-link"]/../../../..',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//comicpash.jp/',
      sibling: '//main[@class="manga row"]/img',
      author: '//p[@class="mangaMainTitle__name"]',
      firstEpisode: '//a[contains(text(),"第1話を読む")]',
      lastEpisode: '//a/em[contains(text(),"最新話")]/..',
      pankuzuUp: '//section[@typeof="BreadcrumbList"]/div[@class="row"]/span[2]/a/span/..',
    }, { //
      url: '//www.nicovideo.jp/',
      sibling: 'ul.videoListInner > li.item , div.d_flex.cq-t_inline-size , div.VideoContainer-item , div.TimelineItem_video , div.CheckboxVideoMediaObject.WatchLaterList-item , div[class*="cq-t_inline-size"] > div.flex-d_column > div[class*="cursor_pointer"][class*="d_flex"][tabindex="0"]',
      header: '#siteHeader , header.pos_sticky , div#CommonHeader.CommonHeader , div.MainMenuContainer_stick',
      disableSnapWhenPageIsClicked: 1,
      disableShiftA: () => lh("/watch/"),
    }, { //
      url: '//www.jstage.jst.go.jp/',
      sibling: '//ul[@class="search-resultslisting"]/li',
      header: '//body/span[@class="noprint"]/header/nav',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//ci.nii.ac.jp/',
      sibling: '//div[@class="listitem xfolkentry"]/..',
      header: '//div[@id="nav-content"]',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//comic.pixiv.net/viewer/|//comic.pixiv.net/works/',
      pankuzuUp: '//div[@class="series-summary"]/div/a|//div[contains(@class,"NavBar_close__")]/img|//div[@style="grid-area: main;"]/div[1]/div/div[@class="max-w-screen-screen4 grid gap-[20px] mx-auto"]/div[1]/img',
      prevEpisode: '//li[@class="prev-story story-navigation"]/a',
      nextEpisode: '//li[@class="next-story story-navigation"]/a',
      leftKey: '//a[@class="gtm-after-reading-section-next"]/div/div[last()]/span|//a[@class="gtm-next"]:visible',
      delay: 500,
      author: `div.my-0.box-border > div.flex-grow > div[class*="mt-4"]`, //'//div[@class="works-author"]|//div/div[contains(@class,"Header_author__")]/span|//body/div/div/div/div[last()]/div/div[@class="Header_largeInner__ie-pc"]/div/div/span|//div[last()]/div/div[3]/div[@class="flex-grow"]/div/span[@class="text-sm text-text2-default"]|//div[last()]/div/div[3]/div[@class="flex-grow"]/div/span[@class="text-sm text-text2"]|//div[last()]/div/div[3]/div[@class="flex-grow"]/div[1]|//html/body/div[@id="__next"]/div[2]/div/div/div[1]/div/div[@class="flex-grow"]/div[1]',
      firstEpisode: '//a[text()="最初から読む"]|//span[@class="font-bold text-center" and contains(text(),"最初から読む")]|//div[@class="w-full"]/div[last()]/a[last()]|//div[text()="最初から読む"]',
      lastEpisode: '//div[1]/a/div/div[last()]/div[1]|//div[2]/div/div[last()]/div/a[1]/div/div/div[1]|//div[@role="listitem"]/div[last()]/div[1]',
      pankuzuUp: '//div/div[contains(@class,"mt-4 text-white typography-12") and text()="作品詳細"]',
      leftKey: '//a[@class="gtm-after-reading-section-next"]/div/div[last()]/span|//a[@class="gtm-next"]:visible',
    }, { //
      url: '//comic-fuz.com/',
      //firstEpisode: '//div[last()]/ul/a[last()]/div/h3',
      //lastEpisode: () => elegeta('a.Chapter_chapter__wJPBe.false:has(i.Chapter_chapter__label_update__c_DpY):not(:has(img.Chapter_chapter__price_gold__tbDjd)) h3.Chapter_chapter__name__T0AQq')?.shift(), //'//li[last()]/a[@class="link-over"]',
      lastEpisode: () => elegeta('p[class*="Chapter_chapter__price_free__"]')?.shift(), //'//li[last()]/a[@class="link-over"]',
      disableSnapWhenPageIsClicked: 1,
      leftKey: 'a.ChapterLastPage_nextChapter__button__x1P_o',
      author: '//a/p[contains(@class,"AuthorTag_author__name__")]/..', //'//div/div[contains(@class,"author")]/div/p/a',
      pankuzuUp: '//button[@title="閲覧をやめる"]',
      func1st: () => oaco('//div/div/div/div/div/div/button[contains(@class,"false")]/img[@src="/assets/viewer/expand.svg" and @width="16"]'),
    }, { //
      url: '//comicawa.com/TitleDetail/',
      firstEpisode: '//div[@role="button" and text()="はじめから読む"]',
      lastEpisode: '//div[@role="button" and text()="最新話を読む"]',
    }, {
      url: '//manga.line.me/',
      firstEpisode: '//li[1]/a[@data-action="read" and @data-is_rich=""]/span/..|//a[@class="MdBtn03Read01" and contains(text(),"最初から読む")]|//div[last()]/div[@class="mdIND13Txt"]/a/h3',
      lastEpisode: '//li[3]/a[@data-action="read" and @data-is_rich=""]/span/..|//div[@class="fnAutoPagingContainer"]/div[1]/div/a/h3',
      nextEpisode: '//a[@class="fnButtonNextChapter"]',
      author: '//dd[@class="mdMNG04Dd01"]/a',
    }, { //
      url: '//to-ti.in/',
      disableSnapWhenPageIsClicked: 1,
      firstEpisode: '//div[@class="page_pager"]/p[@class="prev"]/a/span',
      lastEpisode: '//div[@class="page_pager"]/p[@class="next"]/a/span',
      author: '//div[@class="profile"]/div/div/p[@class="name"]',
      nextEpisode: 'a.next.typesquare_option',
      prevEpisode: 'a.prev.typesquare_option',
      pankuzuUp: '//div[@class="content"]/h2/a',
      keyFunc: {
        key: "ArrowLeft",
        func: () => {
          if (eleget0('//h4[contains(text(),"その他の作品")]:inscreen')) moveClick('a.next.typesquare_option')
        },
      },
      //leftKey:()=>{if(eleget0('//div[@class="other_items_list_news"]:inscreen')){moveClick('//a[@class="next" and text()="次のエピソード"]')}},
    }, { //
      url: '//yomitai.jp/',
      sibling: '//li[@class=""]/figure/img/../..',
      nextEpisode: '//li[@id="article-nav-next"]/a',
      prevEpisode: '//li[@class="series-prev"]/a',
      disableSnapWhenPageIsClicked: 1,
      author: '//figcaption[@class="author-name"]',
      firstEpisode: '//ul[@class="list"]/li[last()]/div/h3/a',
      lastEpisode: '//ul[@class="list"]/li[1]/div/h3/a',
      pankuzuUp: '//a/figure/figcaption[text()="連載の一覧はこちら"]',
    }, { //
      url: '//comic-trail.jp/',
      disableSnapWhenPageIsClicked: 1,
      author: '//div[@class="series-detail"]/h2',
      firstEpisode: '//a[contains(text(),"1話を読む")]',
      lastEpisode: '//a[contains(text(),"最新話を読む")]',
      pankuzuUp: '//a[contains(text(),"作品ページに戻る")]',
    }, { // note
      url: '//note.mu/',
      sibling: '//a[@rel="noopener noreferrer" and @class="o-noteContentImage__itemLink a-link"]/img/../..',
      header: '//div[@id="__layout"]/div/header',
      nextEpisode: '//a[@class="o-sliblingNote__link o-sliblingNote__link--next a-link"]/div',
      prevEpisode: '//a[@class="o-sliblingNote__link o-sliblingNote__link--prev a-link"]/div',
      disableSnapWhenPageIsClicked: 1,
      author: '//div[@class="o-noteContentHeader__name"]/a',
    }, { // コミックアース・スター
      url: '//www.comic-earthstar.jp/',
      disableSnapWhenPageIsClicked: 1,
      author: '//section[@id="comic_info"]/span[@class="title_span"]',
      firstEpisode: '//li[last()]/span/a[@class="on_m readbtn2"]',
      lastEpisode: '//td/a[@class="new_read_btn"]',
    }, { //
      url: 'https://comic-walker.com/detail/KC',
      disableSnapWhenPageIsClicked: 1,
      lastEpisode: () => eleget0('button[class*="EpisodeListSection_sorting__"]:text*=最新話から') ?
        elegeta('div[class*="EpisodeThumbnail_titleWrapper__"] > div:nth-child(1 of div) > span')?.shift() || elegeta('//ul[contains(@class,"WebSerializationList_episodeList__")]/li/a/div[2]/div[contains(@class,"EpisodeThumbnail_titleWrapper__")]/div[1]')?.shift() : elegeta('div[class*="EpisodeThumbnail_titleWrapper__"] > div:nth-child(1 of div) > span')?.pop() || elegeta('//ul[contains(@class,"WebSerializationList_episodeList__")]/li/a/div[2]/div[contains(@class,"EpisodeThumbnail_titleWrapper__")]/div[1]')?.pop(),
      leftKey: () => elegeta('//*[contains(@class,"NextEpisodeInPlace_buttonContents__")]/span|//div[contains(@class,"FutureEpisodeInPlaceDialog_dialogBody__")]/a[contains(text(),"次の話を読む")]|//div[contains(@class,"EndOfBookTemplateVStack_inner__Zor3m")]/a/span:text*=を読む')?.pop(),
      author: '//div[contains(@class,"AuthorList_creditsList__")]/a',
      func: () => { addstyle.add(`[class*="ViewerSection_viewer__"] { --viewer-main-max: calc(100vh ) !important;}`) },
      func1st: () => {
        eleget0('button.TertiaryButton_tertiaryButton__WfaYM[data-state="closed"]:text*=話を表示')?.click() //setInterval(()=>eleget0('button.TertiaryButton_tertiaryButton__WfaYM[data-state="closed"]:text*=話を表示')?.click(),1000)
        //oaco('//div/div/button[@type="button" and text()="拡大"]') // 拡大
        //oaco('//button[contains(@class,"WebSerializationList_accordion__") and @type="button" and @aria-expanded="false"]/span[last()]')
      },
    }, { //
      url: '//webcomicgamma.takeshobo.co.jp/',
      disableSnapWhenPageIsClicked: 1,
      author: '//div[@class="name_intro_author"]',
      firstEpisode: '//a[contains(@id,"read_") and contains(@id,"_01") and @class="btn" and contains(text(),"読む")]|//div[last()]/div[contains(@class,"box_episode_text")]/a[1]',
      lastEpisode: '//a[contains(text(),"最新エピソードを読む")]|//div[1]/div[@class="box_episode_text"]/a[text()="このエピソードを読む"]',
    }, { //
      url: '//online.ichijinsha.co.jp/',
      disableSnapWhenPageIsClicked: 1,
      firstEpisode: '//li[last()]/ul/li/a[@class="pc"]',
      lastEpisode: '//div[contains(@class,"read")]/a[@class="pc corner"]',
    }, { //
      url: '//comic-meteor.jp/',
      author: '//div[@class="work_author_intro_name"]',
      firstEpisode: '//div[last()]/div/div[2]/a[text()="読む"]|//a[text()="第1話を読む"]',
      lastEpisode: '//a[text()="最新話を読む"]|//div[@class="latest_info_link_btn01"]/a',
      pankuzuUp: '//div[@class="topics d-none d-sm-block"]/ul/li[last()-1]/a|//div[@class="leaflet-inner"]/a[@alt="作品ページに戻る"]',
    }, { //
      url: '//yasudadou.futene.net/',
      sibling: '//tr',
      nextEpisode: '//a/img[@src="http://yasudadou.futene.net/kyoutuu4_next.png"]/..',
      prevEpisode: '//a/img[@src="http://yasudadou.futene.net/kyoutuu2_back.png"]/..',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '//curazy.com/',
      sibling: '//div/div/p/img/..',
      header: '//body/div[@id="page"]/header/div',
      nextEpisode: '//span[contains(text(),"次ページ：")]|//span[@class="curazy-link-btn__paging"]/i[@class="fa fa-arrow-circle-right"]',
      disableSnapWhenPageIsClicked: 1,
    }, { //
      url: '.yucl.net/',
      sibling: '//div[@class="clearfix"]/p/a/img/../..|//div[last()]/div[1]/figure/img/..',
      nextEpisode: '//div[@class="next-arrow"]/..',
      prevEpisode: '//div[@class="prev-arrow"]/..',
      lastEpisode: '//div[@class="clearfix"]/ul/li[1]/a|//li[1]/div/div[last()]/a',
    }, { //
      url: '//yusb.net/',
      sibling: '//p/img/..',
      nextEpisode: '//div[@class="next-arrow"]/..',
      prevEpisode: '//div[@class="prev-arrow"]/..',
    }, { //
      url: '//grapee.jp/',
      sibling: '//div[@class="image"]/img/..',
      disableSnapWhenPageIsClicked: 1,
      pankuzuUp: '//ul[@typeof="BreadcrumbList"]/li[last()-1]/*',
    }, { //
      url: '//arklightbooks.com/comics/',
      firstEpisode: '//dl[1]/dd/p[@class="arrow jp_bold"]/a',
      lastEpisode: '//dl[last()]/dd/p[@class="arrow jp_bold"]/a',
    }, // @match *://comic-boost.com/*
    {
      url: '//comic-boost.com/',
      firstEpisode: '//div/div/div/a[@class="btn-read"]/span[contains(text(),"最初から読む")]/..',
      lastEpisode: '//span[contains(text(),"最新話を読む")]',
      author: '//div/div[1]/div[2]/ul[@class="author-list"]/li/a',
    },
    /*{
          url: '//comic-boost.com/',
          firstEpisode: '//ul/li[last()]/div/ul/li/a[@class="button button_ico_cart" and contains(text(),"読む")]',
          lastEpisode: '//a[@class="button button_ico_cart" and contains(text(),"読む")]',
          author: '//div[@class="detail"]/p/a[@class="author_name"]',
        },*/
    {
      url: '//futabanet.jp/',
      firstEpisode: '//div[last()]/a[@rel="noopener"]/span',
      lastEpisode: '//div[1]/a[@rel="noopener"]/span[2]',
      author: '//div[@class="detail-ex__writer"]',
      disableSnapWhenPageIsClicked: 1,
    }, {
      url: '//hobbyjapan.co.jp/',
      firstEpisode: '//ul[last()]/li[3]/a[@class="btn_readcomic"]',
      lastEpisode: '//div[@class="page_container series_detail"]/div/div[2]/ul[1]/li[3]/a',
      author: '//ul[@class="book_intro_list"]/li/a'
    }, {
      url: '//www.comic-valkyrie.com/',
      firstEpisode: '//div[@class="box_wrap"]/div[last()]/div[@class="right"]/a[@class="read_bt" and text()="読む"]',
      lastEpisode: '//div[@id="new_story"]/div/a',
      author: '//div[@id="writer"]/p'
    }, {
      url: '//webcomic.ohtabooks.com/',
      firstEpisode: '//li[last()]/a[@class="btn icon arrow"]',
      lastEpisode: '//div[4]/ul/li[@class="wide"]/a',
      author: '//div/div[@class="author"]/span[@itemprop="name"]'
    }, { //
      url: '',
      sibling: '',
      header: '',
      nextEpisode: '',
      prevEpisode: '',
      disableSnapWhenPageIsClicked: 0,
      author: '',
      firstEpisode: '',
      lastEpisode: '',
      pankuzuUp: '',
    }, { //
      url: '',
      sibling: '',
      header: '',
      nextEpisode: '',
      prevEpisode: '',
      disableSnapWhenPageIsClicked: 0,
      author: '',
      firstEpisode: '',
      lastEpisode: '',
      pankuzuUp: '',
    },
    /*    { // サイト情報の書き方　以下、XPathはCSSセレクタでも可 doc::
          url: '', // 記述したいサイトのurlにマッチする正規表現
          sibling: '', // ←→キーでスクロールしたいページ要素を指すXPath
          header: '', // ページ上部のピン留めされたヘッダ（スクロールにくっついてくる帯みたいなの）の要素を指すXPath
          nextEpisode: '', // Enterキーでクリックする次の話へのリンクを指すXPath
          prevEpisode: '', // ]キーでクリックする1つ前の話へのリンクを指すXPath
          atamadashi: '', // 頭出し機能true時に特定の要素にスクロールさせたい時のXPath
          disableSnapWhenPageIsClicked: 0, // 1にするとページ要素クリックでめくる機能を無効
          author: '', // 漫画の作者名が書かれている要素を指すXPath
          firstEpisode: '', // 第1話を指すXPath
          lastEpisode: '', // 最新話を指すXPath
          pankuzuUp: '', // Shift+↑でクリックする要素（パンくずリストの1つ上）を指すXPath
          leftKey:'', // XPath 画面内にこの要素が入っていたら左キーでそれをクリック　最後のページまで行かないと次話ボタンが出ないサイトなどで使用
          rightKey:'', // XPath 画面内にこの要素が入っていたら右キーでそれをクリック　最後のページまで行かないと次話ボタンが出ないサイトなどで使用
          keyNextSibling:'', // 右キーの代わりに使うキー　元々右キーが使われているサイト、ツイコミ等で使用
          keyPrevSibling:'', // 左キーの代わりに使うキー　元々左キーが使われているサイト、ツイコミ等で使用
          allowedGap: null, // 数値px これがあるとページ画像が画面上端ちょうどの位置にあると見なす範囲を直接指定、ツイコミ等で使用　なければ自動
          scrollSpeed: 1.5, // 数値 これがあるとスクロール速度（通常はShifT+Sで設定）値をこれで上書きする　ヘッダが動的に出入りしてスクロール位置やfitFuncAに不都合なサイト、newtype等で使用
          insteadofClickFunc: null, // 1だと次ページへなどのボタンにclickではなくこの関数を実行　ヤンマガなどSPAで頭出しが効かないサイトで使用
          fitFunc: null, // 関数、これがあるとaキーで画像フィット機能をオンオフする　一番単純なものでは関数内でfitFuncA(<ヘッダのcss>, <ページ画像のcss>, <遅延ms>)を実行すれば良い。このときのページ画像は:inscreenをつけないと全画面化した時に縦スクロール位置がズレるのでつけたほうがいいが、それが有効になるにはページ画像ごとの縦間隔がmarginu超でないといけない
          keyFunc: {}, // キーボードのキーで始まる機能を追加する　{key:"z",func:(key)=>{alert(key)}}のように書くとzキーを押すとfunc内が実行される
          func1st: null, // 関数、これがあると最初に実行される　"abort"をreturnすると動作を停止する
    },
    */
  ]

  let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.includes(str)) return
      GM.addStyle(str)
      this.added.push(str)
    },
  }

  // match文を生成
  if (LogMatch) {
    let matchlist = ""
    for (let s of SITEINFO.slice().sort(function(a, b) { return a.url > b.url ? 1 : -1 })) {
      if (s.url != "")
        for (let s2 of s.url.split("|")) {
          matchlist += "// @match *:" + s2.replace(/\.\*/gm, "*").replace(/^\./, "//*.") + "*\n";
        }
    }
    alert(matchlist);
  }

  var customsib = pref("wcs_siblingXPath") || "";
  if (customsib) {
    SITEINFO.length = 0;
    SITEINFO.push({ "url": getDomain(), "sibling": customsib, "disableSnapWhenPageIsClicked": 1, "header": "auto", "sortSibling": 1 })
  }

  document.addEventListener('keydown', function f(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && e.getModifierState("Shift") && (e.key == "\`")) { // shift+@::
      //        e.preventDefault();

      let ele = document.elementFromPoint(mousex, mousey)
      let csssel = (ele && ele != document.body) ?
        `${ele.tagName?.toLowerCase()}${ele.id?"#"+ele.id:""}${ele.className?"."+ele.className.trim().replace(/\s+/g,".").trim():""}` : ""
      //      var copipe = customsib ? `現在の設定：\n\n// @match *://${ location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1] }/*\n  {\n    url: '//${location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1] }/',\n    sibling: '${ customsib }',\n    header: '${SITE?.header||""}',\n    nextEpisode: '',\n    prevEpisode: '',\n    disableSnapWhenPageIsClicked: 1,\n    author: '',\n    firstEpisode: '',\n    lastEpisode: '',\n    pankuzuUp: '',\n  },\n\n` : "";
      var copipe = getDomain() == "file" ? "" : customsib ? `現在の設定：\n\n// @match *://${ getDomain() }/*\n  {\n    url: '//${getDomain() }/',\n    sibling: '${ customsib }',\n    header: '${SITE?.header||""}',\n    nextEpisode: '',\n    prevEpisode: '',\n    disableSnapWhenPageIsClicked: 1,\n    author: '',\n    firstEpisode: '',\n    lastEpisode: '',\n    pankuzuUp: '',\n  },\n\n` : "";
      var sib = prompt(`${getDomain()}\n今指した要素：\n${csssel}\n(${elegeta(csssel).length}個存在)\n\n` + copipe + "Enter Sibling XPath/CSS\n空欄にすると設定を削除します", (/^[^\/]+/.test(customsib) && csssel) ? `${customsib} , ${csssel}` : customsib || csssel);
      if (sib === null) return;
      if (!sib || !eleget0test(sib)) {
        pref("wcs_siblingXPath", null);
        alert("空欄、またはXPathとして1つ以上ヒットしないので、設定を削除します");
      } else {
        pref("wcs_siblingXPath", sib);
      }
      location.reload();
      return;
    }
  }, false);
  /*  $('a[target="_blank"]').removeAttr("target");
    setTimeout(() => $('a[target="_blank"]').removeAttr("target"), 500);
    setTimeout(() => $('a[target="_blank"]').removeAttr("target"), 1500);*/

  var SITE;

  let wcsinfo = eleget0('#wcsSITEINFO'); // fileで埋め込んだSITEINFOがあればそれを使う
  if (wcsinfo) SITE = { sibling: decodeURIComponent(wcsinfo.dataset?.sibling), header: decodeURIComponent(wcsinfo.dataset?.header), disableSnapWhenPageIsClicked: 1 };
  //  else SITE = SITEINFO.find(v => (typeof v?.url == "function" ? v?.url() : v?.url && location?.href?.match(v?.url)));
  else SITE = SITEINFO.find(v => (typeof v?.url == "function" ? v?.url() : v?.url && [v?.url]?.flat()?.some(v => location.href.match(v))));
  if (!SITE) {
    if (elegeta('.wcsSibling , .wcsPrevEpisode , .wcsNextEpisode , .wcsFirstEpisode , .wcsLastEpisode , .wcsHeader')) {
      SITE = { sibling: `.wcsSibling`, prevEpisode: `.wcsPrevEpisode`, nextEpisode: `.wcsNextEpisode`, firstEpisode: `.wcsFirstEpisode`, lastEpisode: `.wcsLastEpisode`, header: `.wcsHeader`, disableSnapWhenPageIsClicked: 1 }
    } else return;
  }
  if (SITE.func1st) { if (SITE.func1st() == "abort") return; }
  if (SITE.marginu) marginu = SITE.marginu;
  scrollSpeed = SITE.scrollSpeed ?? scrollSpeed

  if (EXPERIMENTAL_EMBED_FUNCTION_FOR_LOCAL_HTML && SITE?.sibling && location.protocol != "file:") {
    if ([SITE?.sibling, SITE?.header, SITE?.disableSnapWhenPageIsClicked].every(v => typeof v != "function")) {
      let sitag = end(document.body, `<span id="wcsSITEINFO" data-disable-snap-when-page-is-clicked="1"></span>`);
      sitag.dataset.sibling = encodeURIComponent(SITE?.sibling); // 直接タグに入れると約物が生き返る
      sitag.dataset.header = encodeURIComponent(SITE?.header);
      sitag.dataset.disableSnapWhenPageIsClicked = encodeURIComponent(SITE?.disableSnapWhenPageIsClicked);
    }
  }
  //  if (EXPERIMENTAL_EMBED_FUNCTION_FOR_LOCAL_HTML && SITE?.sibling && location.protocol != "file:") before(document.body, `<script id="wcsEmbeded">

  //(function() { if (location?.protocol != "file:") return; let pageEle = 'h1,h2,h3'; let header = "#header"; let marginu = 3; let scrollSpeed = 2; let IGNORE_SIBLING_CLOSER_THAN = 11; let GF = {}; let t = Date.now(); document.addEventListener("keydown", function(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return; var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key; if (["ArrowLeft", "ArrowRight"].includes(key)) { e.preventDefault(); e.stopPropagation(); var nh = getCurrentHeaderBottom(); var page = key == "ArrowLeft" ? elegeta(pageEle).filter(e => e.offsetHeight).sort((a, b) => a?.getBoundingClientRect()?.top > b?.getBoundingClientRect()?.top ? -1 : 1).find(e => e.getBoundingClientRect().top - nh + marginu < -marginu - IGNORE_SIBLING_CLOSER_THAN) : elegeta(pageEle).filter(e => e.offsetHeight).sort((a, b) => a?.getBoundingClientRect()?.top > b?.getBoundingClientRect()?.top ? 1 : -1).find(e => e.getBoundingClientRect().top - nh - marginu > marginu + IGNORE_SIBLING_CLOSER_THAN); page && sscrollInt(page); } }); function sscrollInt(page) { var nh = getCurrentHeaderBottom(); let y = window.pageYOffset; window.scroll(0, (y + Math.max(-333, Math.min(333, (page?.getBoundingClientRect()?.top - nh) / scrollSpeed)))); if ((Math.abs(page?.getBoundingClientRect()?.top - nh) > 1 && y != window.pageYOffset) || GF?.lastHH?.some(v => v != nh)) { clearTimeout(GF?.int); GF.int = setTimeout(() => sscrollInt(page), Math.max(1, 15 - (Date.now() - t))); t = Date.now(); } else { window.scroll({ top: (window.pageYOffset - nh + page?.getBoundingClientRect()?.top), behavior: "instant" }); } GF.lastHH = [...(GF?.lastHH || []), nh].slice(-5); } function getCurrentHeaderBottom() { return (header == "auto" ? getLikeSticky() : elegeta(header)).map(e => e.getBoundingClientRect().bottom).reduce((a, b) => Math.max(a, b), 0) + 0; } function getLikeSticky() { if (Date.now() - (GF.stickyTime || 0) > 1500) { GF.stickyTime = Date.now(); GF.sticky = elegeta('header,div:inscreen:visible').filter(e => { let p = getComputedStyle(e)?.getPropertyValue("position"); if (!["sticky", "fixed"].includes(p)) return false; let r = e?.getBoundingClientRect(); let w = window.innerWidth; return r?.left < w - w / 3 && r?.right > w / 3 && r?.bottom < window.innerHeight / 3; }); } return GF.sticky; } function elegeta(xpath, node = document) { if (!xpath || !node) return []; if (typeof xpath === "function") return xpath(); let xpath2 = xpath.replace(/:inscreenY|:inscreen|:visible|:text\\*=[^:]*/g, ""); let array = []; try { if (!/^\\.?\\/ / .test(xpath)) { array = [...node.querySelectorAll(xpath2)]; } else { var snap = document.evaluate("." + xpath2, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); let l = snap.snapshotLength; for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i); } if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight); if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }); if (/:text\\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)); } } catch (e) { return []; } return array; } function eleget0(xpath, node = document) { if (!xpath || !node) return null; if (typeof xpath === "function") return xpath(); if (/:inscreen|:visible|:text\\*=/.test(xpath)) return elegeta(xpath, node)?.shift(); if (!/^\\.?\\/ / .test(xpath)) return node.querySelector(xpath); try { var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null; } catch (e) { alert(e + "\\n" + xpath + "\\n" + JSON.stringify(node)); return null; } } })();

  //</script>`.replace("h1,h2,h3", SITE?.sibling).replaceAll("#header", SITE?.header || "auto"));

  //setTimeout(() => {
  //$(document).ready(function() {
  //window.addEventListener('load', (event) => {
  //document.addEventListener('DOMContentLoaded', function() {
  if (SITE.fitFunc) {
    if (fit == "true") {
      popup("A:画像フィット(on)");
      SITE.fitFunc(SITE)
      GF.fitfuncBon = 1
    } else { popup("A:画像フィット(off)", "#808080"); }
  }
  //})
  //  }, (SITE.fitFuncDelay || ((SITE.delay || 0) + 500))

  setTimeout(() => {

    var j = 0;
    for (let pro in SITE) {
      if (SITE[pro]) {
        //console.log(pro + " : " + SITE[pro])
        var str1 = ["url:", "sibling:", "sibling:", "header:", "nextEpisode:", "prevEpisode:", "disableSnapWhenPageIsClicked:", "author:", "firstEpisode:", "lastEpisode:", "pankuzuUp:", "keyFuncHelpXP:"];
        var str2 = ["", SITE.siblingHelp || "←→：前次ページ", "Shift+A：頭出し", "", "Enter：次の話", "]：前の話", "", "", "→：第1話", "Enter：最新話", "Shift+↑：上階層", SITE.keyFuncHelp];
        for (var k = 0; k < str1.length; k++) {
          if (pro + ":" == str1[k] && str2[k] && eleget0(SITE[pro])) {
            if (PopupHelpMS) {
              //let node = document.createElement('span');
              //node.className = "ignoreMe";
              //node.innerHTML = str2[k]; //+" : "+SITE[pro];
              let node = end(document.body, `<span class="ignoreMe" style="${"max-width:95%; right:0; bottom:" + (j * 21) + "px; z-index:2147483647; opacity:" + 1 + "; text-align:left; line-height:1.1; position:fixed; font-size:12px; font-weight:bold; margin:2px;  text-decoration:none; padding:1px 6px; border-radius:15px; color:#ffffff; " + (ButtonBG)}">${str2[k]}</span>`)
              //node.setAttribute("style", "max-width:95%; right:0; bottom:" + (j * 21) + "px; z-index:2147483647; opacity:" + 1 + "; text-align:left; line-height:1.1; position:fixed; font-size:12px; font-weight:bold; margin:2px;  text-decoration:none; padding:1px 6px; border-radius:15px; color:#ffffff; " + (ButtonBG)); //" box-shadow:3px 3px 3px #0004;");
              //document.body.appendChild(node)
              $(node).hide(0);
              setTimeout(() => { $(node).slideDown('fast'); }, 67 * j); //fadeIn('fast')
              setTimeout(() => { $(node).hide(400).queue(function() { this.remove(); }) }, PopupHelpMS + 67 * j); //fadeOut('fast')
            }
            j++;
          }
        }
      }
    }
    addHelp(SITE.firstEpisode, "→");
    addHelp(SITE.lastEpisode, "Enter");
    addHelp(SITE.prevEpisode, " ] ");
    addHelp(SITE.nextEpisode, "Enter");
    if (SITE.nextEpisode > "") {
      var ele = eleget0(SITE.nextEpisode);
      if (ele && ele.tagName === "A") {
        $("head").append("<link rel='prefetch' href='" + ele.href + "'>").append("<link rel='prerender' href='" + ele.href + "'>"); //.append("<link rel='next' href='" + ele.href + "'>")
      }
    }
    addHelp(SITE.pankuzuUp, "Shift+↑");
  }, (SITE.delay || 0) + 500);


  if (SITE.shiftupKey) setInterval(() => elegeta(SITE.shiftupKey).filter(v => v.innerText.indexOf("(↑)") == -1).forEach(v => v.innerText += " (↑)"), 500)

  if (SITE.leftKey) {
    if (SITE?.leftKeyGuide) SITE?.leftKeyGuide;
    else {
      var leftArrowTimer = setInterval(() => {
        var ele = eleget0(SITE.leftKey);
        if (isinscreen(ele) && !ele.innerText.match0(/\(←\)/)) {
          ele.innerText += "(←)";
        }
      }, 500);
    }
  }
  if (SITE.rightKey) {
    var rightArrowTimer = setInterval(() => {
      var ele = eleget0(SITE.rightKey);
      if (isinscreen(ele) && !ele.innerText.match0(/\(→\)/)) {
        ele.innerText += " (→)";
      }
    }, 500);
  }

  function getallowedGap() {
    if (SITE.allowedGap) return SITE.allowedGap;
    // ヘッダのy下端を計算
    var allowedGap = marginu;
    if (SITE.header) {
      var seigaheader = eleget0(SITE.header);
      if (seigaheader) {
        var tmp = seigaheader.getBoundingClientRect().bottom; // - window.pageYOffset
        if (seigaheader && tmp >= 0) {
          var allowedGap = marginu + tmp;
        }
      }
    }
    if (debug) dc("allowedGap:" + allowedGap);
    //      console.log("allowedGap:"+allowedGap+"\nMarginU:"+ marginu+"\nseigaH:"+seigaheader.getBoundingClientRect().bottom,"\noffset:"+window.pageYOffset);
    return allowedGap;
  }

  if (SITE.registFunc) SITE.registFunc();

  //console.log(SITE)
  document.addEventListener("keydown", function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
      var pressed = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;

      if (SITE.keyFunc && key === SITE.keyFunc.key) {
        SITE.keyFunc.func(key);
      }
      if (pressed == "Shift+ArrowUp") {
        if (moveClick(SITE.pankuzuUp)) { e.preventDefault(); return; } // Shift上
        else if (moveClick(".sakushaantenna")) { e.preventDefault(); return; } // Shift上
      }

      if (SITE.leftKey && pressed == "ArrowLeft") {
        /*if (typeof SITE.leftKey === "function") SITE.leftKey();
        else*/
        var ele = eleget0(SITE.leftKey);
        if (ele && isinscreen(ele) && ele.offsetHeight) { moveClick(SITE.leftKey, ""); return false; }
      }
      if (SITE.rightKey && pressed == "ArrowRight") {
        var ele = eleget0(SITE.rightKey);
        if (ele && isinscreen(ele)) { moveClick(SITE.rightKey, ""); return false; }
      }

      if (SITE.sibling && (pressed == (SITE.keyPrevSibling || "ArrowLeft") && eleget0test(SITE.sibling))) { // l::前ページにスクロール
        //if (pressed == (SITE.keyPrevSibling || "ArrowLeft") && ((SITE.sibling && eleget0test(SITE.sibling)) || (SITE.prevEpisode && eleget0test(SITE.prevEpisode)))) { // l::前ページにスクロール // comici用版だけどto-tiで問題
        e.preventDefault();
        var nh = getCurrentHeaderBottom();
        var pages = [...elegeta(SITE.sibling).filter(e => e.offsetHeight)].reverse();
        const pagesSorted = SITE?.sortSibling ? pages.sort((a, b) => a?.getBoundingClientRect()?.top > b?.getBoundingClientRect()?.top ? -1 : 1) : pages;
        const pageIndex = pagesSorted.findIndex(e => e.getBoundingClientRect().top - nh + marginu < -(SITE.allowedGap || marginu) - IGNORE_SIBLING_CLOSER_THAN);
        var page = pages[pageIndex];

        if (debug) dc(page?.outerHTML || "nashi")
        if (SITE.prevPage && pressed == "ArrowRight" && eleget0test(SITE.prevPage)) { // right::次ページ サイトごとの特殊処理
          if (moveClick(SITE.prevPage)) { e.stopPropagation(); return false; }
        }
        if (page) {
          popup4(`${pages.length-pageIndex}/${pages.length}`, 1, 1, -1000)
          //          pages.length<50&&mapV()+mapV(pages,"#888")+mapV([page],"#13f")
          if ((GF?.mapVlap || 0) <= MINIMAP_TIMELIMIT_MS) mapV() + mapV(pages, "#888") + mapV([page], "#13f")
          sscroll(page);
          e.stopPropagation();
          return false;
        }
        if (SITE.prevEpisode) { moveClick(SITE.prevEpisode); if (SITE.funcNextPrev) SITE.funcNextPrev(); }
        e.stopPropagation();
        return false;
      }

      if (SITE.sibling && (pressed == (SITE.keyNextSibling || "ArrowRight") && eleget0test(SITE.sibling))) { // r::次ページにスクロール
        //if (pressed == (SITE.keyNextSibling || "ArrowRight") && ((SITE.sibling && eleget0test(SITE.sibling)) || (SITE.nextEpisode && eleget0test(SITE.nextEpisode)))) { // r::次ページにスクロール // comici用版だけどto-tiで問題
        e.preventDefault();

        var nh = getCurrentHeaderBottom();
        var pages = elegeta(SITE.sibling).filter(e => e.offsetHeight);
        const pagesSorted = SITE?.sortSibling ? pages.sort((a, b) => a?.getBoundingClientRect()?.top > b?.getBoundingClientRect()?.top ? 1 : -1) : pages;
        const pageIndex = pagesSorted.findIndex(e => e.getBoundingClientRect().top - nh - marginu > (SITE.allowedGap || marginu) + IGNORE_SIBLING_CLOSER_THAN);
        var page = pages[pageIndex];

        if (debug) dc(page?.outerHTML || "nashi")
        if (SITE.nextPage && pressed == "ArrowLeft" && eleget0test(SITE.nextPage)) { // left::前ページ サイトごとの特殊処理
          if (moveClick(SITE.nextPage)) { e.stopPropagation(); return false; }
        }
        if (page) {
          popup4(`${pageIndex+1}/${pages.length}`, 1, 1, -1000)
          //          pages.length<50&&mapV()+mapV(pages,"#888")+mapV([page],"#13f")
          if ((GF?.mapVlap || 0) <= MINIMAP_TIMELIMIT_MS) mapV() + mapV(pages, "#888") + mapV([page], "#13f")

          sscroll(page);
          e.stopPropagation();
          return false;
        }
        if (moveClick(SITE.nextPage)) { e.stopPropagation(); return false; }
        if (SITE.nextEpisode) { moveClick(SITE.nextEpisode); if (SITE.funcNextPrev) SITE.funcNextPrev(); }
        return false;
      }
      if (SITE.fitFunc && pressed == "a") { // a::漫画画像を画面にフィット
        e.preventDefault();
        fit = fit === "true" ? "false" : "true";
        pref("fit", fit);
        if (fit == "true") {
          popup("A:画像フィット(on)");
          GF.fitfuncBon = 1
          SITE.fitFunc(SITE)
        } else {
          popup("A:画像フィット(off)", "#808080");
          //location.reload()
          GF.fitfuncBon = 0
          elegeta('[data-maxheightbackup]').forEach(e => {
            e.style.maxHeight = e.dataset.maxheightbackup || "none";
            delete e.dataset.maxheightbackup
          })
        }
      }

      if (SITE.nextEpisode && (pressed == "Shift+ArrowRight" || pressed == "Enter")) { // Shift右 enter
        if (moveClick(SITE.nextEpisode)) {
          e.preventDefault();
          if (SITE.funcNextPrev) SITE.funcNextPrev();
          return;
        }
      }

      if (SITE.prevEpisode && (pressed == "Shift+ArrowLeft" || pressed == "]"))
        if (moveClick(SITE.prevEpisode)) {
          e.preventDefault();
          if (SITE.funcNextPrev) SITE.funcNextPrev();
          return;
        } //Shift左 ]

      if (SITE.firstEpisode && pressed == "ArrowRight")
        if (moveClick(SITE.firstEpisode)) { e.preventDefault(); return; } // 右　第1話が押せたら終わる
      if (SITE.lastEpisode && (pressed == "Shift+ArrowRight" || pressed == "Enter"))
        /*if (SITE.lastEpisodePreferential && moveClick(SITE.lastEpisodePreferential)) { e.preventDefault(); return; }
      else*/
        if (moveClick(SITE.lastEpisode)) { e.preventDefault(); return; } // Shift右 enter　最新話が押せたら終わる

      /*if (pressed == "Shift+S") { // shift+s スクロール速度
        e.preventDefault();
        let inp = proInput("スクロール速度を入力してください（0：API使用、1：瞬間移動、1.01～：速度指定）", scrollSpeed, 0, 30);
        if (inp !== null) scrollSpeed = inp === "" ? 1.5 : inp || 0
        pref("scrollSpeed", scrollSpeed);
      }*/
      if (pressed == "Shift+A" && !lh("/watch/")) { // Shift+a 頭出しオンオフ
        e.preventDefault();
        atamadashi = atamadashi === "true" ? "false" : "true";
        alert("[Shift+a] 頭出し機能を" + atamadashi + "にしました");
        pref("atamadashi", atamadashi);
      }

      if (location.href.match("/manga.nicovideo.jp/watch/|//manga.nicovideo.jp/comic/")) {
        if (pressed == "c") { // c コメントオンオフ
          e.preventDefault();
          eleget0('//li[@id="show_comment"]/span').click();
          return;
        }
        if (pressed == "h") { // h:: ヘッダー固定追従
          e.preventDefault();
          //eleget0('//span[text()="ヘッダー追従"]|//li[@id="siteHeaderRightMenuUnfix" and @style="display: block;"]/a/span|//li[@id="siteHeaderRightMenuFix" and @style="display: block;"]/a/span').click();
          eleget0('//label[@for="commonHeaderFixedSwitch"]').click();
          return;
        }
      }

      if (pressed == "f" || pressed == "[") { // f:: [:: 全画面化
        e.preventDefault();
        var y = window.pageYOffset;
        if (!document.fullscreenElement) {
          let p = document.documentElement.requestFullscreen();
          p.catch(() => {})
        } else {
          if (document.exitFullscreen) {
            let p = document.exitFullscreen();
            p.catch(() => {})
          }
        }
        //setTimeout(window.scroll, 100, 0, y);
        return false;
      }
    },
    //    false);
    true);

  // ページクリックでスナップ
  if (!SITE.disableSnapWhenPageIsClicked && SITE.sibling) { // click::
    setTimeout(() => {
      elegeta(SITE.sibling).forEach(e => e.addEventListener("click", function(e) { snap(this, "next", getallowedGap(), SITE.sibling); }, false));
    }, 500);
  }

  // 作者名でWeb漫画アンテナ
  function runAuthor() {
    if (SITE.author) {
      appendlinktoAuthor();

      function appendlinktoAuthor() {
        setTimeout(() => { sakushaantenna(document) }, 500 + (SITE.delay || 0));
      }
    }
  }
  runAuthor()
  observeUrlChanged(runAuthor, 3500)
  document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) { sakushaantenna(evt.target) }, false);

  // 頭出し
  GF.atamaDone = 0;

  function runAtamadashi() {
    //if (atamadashi != "true") return;
    if (document.hidden) GF.visichange = document.addEventListener('visibilitychange', () => !GF.atamaDone++ && doAtama(SITE?.atamadashiSpeed), false);
    else SITE?.atamadashiDelay ? setTimeout(() => doAtama(SITE?.atamadashiSpeed), SITE?.atamadashiDelay, 0) : doAtama(SITE?.atamadashiSpeed);
  }

  function doAtama(scrollSpeedForce = null, start = Date.now()) {
    if (atamadashi == "true") {
      let atama = eleget0(SITE?.atamadashi) || eleget0(SITE?.sibling) //eleget0(SITE.atamadashi)?.getBoundingClientRect()?.top || eleget0(SITE.sibling)?.getBoundingClientRect()?.top;
      if (atama) {
        if (!window.scrollY >= 1) requestAnimationFrame(() => {
          GF.atamadashita = 1;
          sscroll(atama, scrollSpeedForce);
        });
      } else {
        if (Date.now() - start < 5000) setTimeout(scrollSpeedForce => doAtama(scrollSpeedForce, start), 111, scrollSpeedForce)
      }
    }

    //setTimeout(()=>{
    requestAnimationFrame(() => {
      (() => {
        var nh = getCurrentHeaderBottom();
        var pages = elegeta(SITE.sibling).filter(e => e.offsetHeight);
        if (pages.length) {
          var pageIndex = SITE?.sortSibling ?
            pages.sort((a, b) => a?.getBoundingClientRect()?.top > b?.getBoundingClientRect()?.top ? 1 : -1).findIndex(e => e.getBoundingClientRect().top - nh - marginu > (SITE.allowedGap || marginu) + IGNORE_SIBLING_CLOSER_THAN) :
            pages.findIndex(e => e.getBoundingClientRect().top - nh - marginu > (SITE.allowedGap || marginu) + IGNORE_SIBLING_CLOSER_THAN)
          var page = pages[pageIndex];
          popup4(`${GF?.atamadashita||pageIndex}/${elegeta(SITE?.sibling).length}`);
          mapV() + mapV(pages, "#888") + mapV([page], "#13f")
        }
      })();
      //},17)
    })
  }
  runAtamadashi();



  function observeUrlChanged(cb, wait = 333) {
    var observeUrlHasChangedhref = location.href;
    var observeUrlHasChanged = new MutationObserver(mutations => {
      if (observeUrlHasChangedhref !== location.href) setTimeout(() => {
        observeUrlHasChangedhref = location.href;
        cb()
      }, wait)
    });
    observeUrlHasChanged.observe(document, { childList: true, subtree: true });
  }

  if (SITE.func) { SITE.func(); }
  return;

  function snap(targetele, pn, allowedGap, xpath) {
    if (!targetele) return;
    var headery = getCurrentHeaderBottom();
    var nowpagey = targetele.getBoundingClientRect().top + window.pageYOffset - marginu;
    var nextpage = (pn == "next" ? getNextSib(targetele, xpath) : getPrevSib(targetele, xpath));
    if (nextpage)
      if (debug) dc("nextpage:" + nextpage.tagName + "." + nextpage.className + "#" + nextpage.id);
    if (nextpage == null) {
      if (SITE.nextEpisode)
        if (eleget0(SITE.nextEpisode)) { var nextpagey = eleMiddleY(SITE.nextEpisode); } else return;
      else return;
    } else {
      var nextpagey = nextpage.getBoundingClientRect().top + window.pageYOffset - marginu;
      if (debug) dc("nextpagey:" + nextpagey);
    }
    if (nextpage === null && pn == "prev") {
      nextpagey = 0;
      nowpagey = 0;
      if (window.pageYOffset < 2) {
        if (SITE.prevEpisode) { moveClick(SITE.prevEpisode); if (SITE.funcNextPrev) SITE.funcNextPrev(); }
      }
    }
    var nowy = window.pageYOffset + headery;
    if (debug) dc(Math.abs(nowy - nowpagey) + " present gap");
    if (debug) dc(allowedGap + " allowed gap");
    if (Math.abs(nowy - nowpagey) <= allowedGap) {
      sscroll(nextpagey - headery);
      if (nextpage === null) {
        if (pn == "next") {
          if (SITE.nextEpisode) { moveClick(SITE.nextEpisode); if (SITE.funcNextPrev) SITE.funcNextPrev(); }
        }
      }
    } else {
      targetele.focus();
      sscroll(nowpagey - headery);
    }
    return;
  }

  function sakushaantenna(node) {
    elegeta('//a[@class="sakushaantenna"]').forEach(e => e.remove());
    for (let ele of elegeta(SITE.author)) {
      let author = ele.innerText.replace(/(漫画|原作|原案|脚本|著|漫画|作画|イラスト|キャラクター(原案|デザイン)?|画|作|絵|構成|協力)[:：\/／・]/gmi, "").replace(/\/|／|\,/gmi, " OR ").replace(/著者|作者|原作|作画|著者\s：|　?先生[:：\/／・]?|[:：・]|[\(（][^）\)]*[）\)]|＝/gmi, " ").replace(/  |・|　/g, " ").replace(/^ OR | OR $/gmi, "").trim();
      //let pixiv = Math.random() > 0.5 ? `https://www.google.co.jp/search?q=(${encodeURIComponent(author)}+site:www.pixiv.net) OR (${encodeURIComponent(author)}+site:twitter.com)` : `https://duckduckgo.com/?q=(${author}+site:www.pixiv.net) OR (${author}+site:twitter.com)`;

      let aut = encodeURIComponent(author)
      let wordG = `${aut} (site:www.pixiv.net OR site:twitter.com OR site:twicomi.com OR site:twiman.net)`
      let wordD = `(${aut} site:www.pixiv.net) OR (${aut} site:twitter.com) OR (${aut} site:twicomi.com) OR (${aut} site:twiman.net)`
      let pixiv = Math.random() > 0.5 ? `https://www.google.co.jp/search?q=${wordG}` : `https://duckduckgo.com/?q=${wordD}`

      let link = $('<a class="sakushaantenna" title="右クリックだと\n' + sani(pixiv) + '\nを開きます" style="' + "-moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:max(10px,100%); font-weight:bold; margin:0px 5px; text-decoration:none !important; text-align:center; padding:1px 7px 1px; border-radius:15px; " + (ButtonBG) + " white-space: nowrap" + '"href="https://webcomics.jp/search?q=***" rel=\"noopener noreferrer nofollow\"><font color="#ffffff" style="text-decoration:none !important;">Web漫画アンテナ</font></a>'.replace("***", encodeURIComponent(author)))
      link.insertAfter(ele);
      link.on("contextmenu", () => { window.open(pixiv.replaceAll(" ", "%20")); return false; });
    }
  }

  function loadfocus(times = 0, atamadashi) {
    let xp = atamadashi;
    if (!xp || times > 10000) return false;
    if (eleget0(xp)) { setTimeout(() => { loadfocus2(atamadashi); }, 100); return; } else setTimeout(() => { loadfocus(times + 100, atamadashi); }, 100)
  }

  function loadfocus2(atamadashi) {
    var xp = atamadashi;
    var ele = eleget0(xp);
    if (ele) {
      //      sscroll(ele.getBoundingClientRect().top + window.pageYOffset - marginu - getCurrentHeaderBottom());
      sscroll(ele);
    }
    return ele;
  }

  function getNextSib(ele, xpath) { // xpathに適合する弟ノードを走査
    do {
      if (!ele.nextElementSibling) return null;
      ele = ele.nextElementSibling;
      if ($(ele).is(":visible")) {
        for (let ele2 of elegeta(xpath)) {
          if (ele === ele2) return ele;
        }
      }
    } while (ele.nextElementSibling);
    return null;
  }

  function getPrevSib(ele, xpath) { // xpathに適合する兄ノードを走査
    do {
      if (!ele.previousElementSibling) return null;
      ele = ele.previousElementSibling;
      if ($(ele).is(":visible")) {
        for (let ele2 of elegeta(xpath)) {
          if (ele === ele2) return ele;
        }
      }
    } while (ele.previousElementSibling);
    return null;
  }

  function eleMiddleY(xpath) {
    var el2 = eleget0(xpath);
    if (el2) {
      return (el2.getBoundingClientRect().top + window.pageYOffset +
        eleget0(xpath).getBoundingClientRect().height / 2 -
        clientHeight() / 2);
    } else return 0;
  }

  function moveClick(xpath, command = "scrollCenter") {
    let ele = typeof xpath == "function" ? xpath() : eleget0(xpath);
    //if (!ele || ele.offsetHeight == 0) return false; // 不可視要素ならやらない
    if (!ele) return false; // 不可視要素でもやる sukimaでは必要
    //if (Date.now() - latestClick < 1000) return false; // 1秒に1回以上は抑制
    if (command.indexOf("scrollCenter") !== -1 && !SITE.cancelScrollOnChangingEpisode) {
      sscroll(eleMiddleY(xpath), 0.1)
    }
    if (Date.now() - (ele?.dataset?.lascli || 0) < (SITE?.pagenationClickInterval || 3000)) return false; // 3秒に1回以上は抑制
    //if (Date.now() - (ele?.dataset?.lascli || 0) < 3000) return false; // 1秒に1回以上は抑制
    ele.dataset.lascli = Date.now();
    //latestClick = Date.now();
    GM_addStyle("[data-shine4attract] { box-shadow: 0px 0px 10px 10px rgba(0, 250, 0, 0.5), inset 0 0 100px rgba(0, 250, 0, 0.1) !important; outline: rgba(0, 250,0,0.7) solid 4px !important; outline-offset: 1px !important; }")
    ele.dataset.shine4attract = 1
    setTimeout(ele => { if (ele) delete ele.dataset.shine4attract }, 1000, ele)
    if (SITE.moveEpisodeFunc) { // mangazのためだけの処理
      SITE.moveEpisodeFunc(ele);
    } else {
      if (SITE.insteadofClickFunc) { SITE.insteadofClickFunc(ele) } else { ele.click(); }
    }
    return true;
  }

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    if (typeof xpath === "function") return xpath() || []; // !!!
    //    let xpath2 = xpath.replace(/:inv?screen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let xpath2 = xpath.replace(/:inscreenY|:inscreen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        var snap = document.evaluate("." + xpath2, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        let l = snap.snapshotLength
        for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i)
      }
      if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight)
      //if (/:invscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.top <= document.documentElement.clientHeight) }) // 画面縦内に1ピクセルでも入っている
      if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\nブラウザを最新版に更新したり、2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return []; }
    //} catch (e) { return []; }
    return array
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (typeof xpath === "function") {
      let e = xpath();
      if (Array.isArray(e)) return e?.shift();
      else return e
    } // !!!
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) return node.querySelector(xpath);
    try {
      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\nブラウザを最新版に更新したり、2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return null; }
    //} catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function eleget(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  }

  function sscroll(dy, scrollSpeedForce = null) {
    //console.log(`presentY:${window.pageYOffset} dElement:${dy} dY:${elegeta(SITE.sibling).map(e=>~~e.getBoundingClientRect().top) }`)
    if (dy === undefined || dy === null) return
    sscrollDesEle = null;
    if (SITE?.sscrollAlt) { SITE.sscrollAlt(dy); return; }
    if (typeof dy != "number") {
      sscrollDesEle = dy;
      dy = window.pageYOffset + dy.getBoundingClientRect().top - getCurrentHeaderBottom() - marginu;
    } else { sscrollDesEle = dy; }
    if ((scrollSpeedForce ?? scrollSpeed) < 1) { //APIでスクロール
      if (debug) dc("api使用");
      window.scroll({ left: 0, top: dy, behavior: "smooth" });
      return;
    }
    if ((scrollSpeedForce ?? scrollSpeed) == 1) {
      if (debug) dc("瞬間移動");
      window.scroll({ left: 0, top: dy, behavior: "instant" });
      return;
    }
    //if (debug) dc("scrollSpeed:" + scrollSpeed)
    sscrollY = window.pageYOffset; //chrome
    scrint = 0;
    clearTimeout(GF?.scrint)
    sscrollInt(scrollSpeedForce)
    return;
  }

  function sscrollInt(scrollSpeedForce = null) {
    scrint++;
    sscrollDY = typeof sscrollDesEle == "number" ? sscrollDesEle : window.pageYOffset + sscrollDesEle?.getBoundingClientRect()?.top - getCurrentHeaderBottom() - marginu // : dy//window.pageYOffset
    //sscrollY = sscrollY + Math.max(-333, Math.min(333, (sscrollDY - sscrollY) / (scrollSpeedForce || scrollSpeed)))
    sscrollY = sscrollY + Math.max(-333, Math.min(333, (sscrollDY - sscrollY) / ((scrollSpeedForce || scrollSpeed) * 1.3)))
    window.scroll({ top: sscrollY, behavior: "instant" }); //window.scroll(0, sscrollY);

    let chh = getCurrentHeaderBottom()
    if (Math.abs(sscrollY - sscrollDY) >= 1 || GF?.lastHH?.some(v => v != chh)) {
      clearTimeout(GF?.scrint)
      //      GF.scrint = setTimeout(() => sscrollInt(scrollSpeedForce), Math.max(1, 7 - (Date.now() - (GF?.scrEla || 0))))
      requestAnimationFrame(() => sscrollInt(scrollSpeedForce))
    } else {
      //window.scroll({ left: 0, top: sscrollY, behavior: "instant" });
      window.scroll({ left: 0, top: sscrollDY, behavior: "instant" });
    }
    GF.scrEla = Date.now()
    GF.lastHH = [...(GF?.lastHH || []), chh].slice(-5)

    //    else console.log("スクロールに掛かった回数（最短1/60秒）…" + scrint + "回");
  }

  function getCurrentHeaderBottom() {
    if (!SITE.header) { return 0; }
    return (SITE?.header == "auto" ? getLikeSticky() : elegeta(SITE.header)).map(e => e.getBoundingClientRect().bottom).reduce((a, b) => Math.max(a, b), 0) + 0;
  }

  function getLikeSticky() { // 画面上端に張り付いてる帯みたいなのを自動的に判断
    if (Date.now() - (GF.stickyTime || 0) > 1500) {
      GF.stickyTime = Date.now();
      GF.sticky = elegeta('header,div:inscreen:visible').filter(e => {
        let p = getComputedStyle(e)?.getPropertyValue("position");
        if (!["sticky", "fixed"].includes(p)) return false;
        let r = e?.getBoundingClientRect();
        let w = window.innerWidth;
        return r?.left < w - w / 3 && r?.right > w / 3 && r?.bottom < window.innerHeight / 3;
      });
    }
    return GF.sticky;
  }

  function proInput(prom, defaultval, min, max = Number.MAX_SAFE_INTEGER) {
    var ret = window.prompt(prom, defaultval)
    if (ret === "") return ret
    if (ret !== null) return Math.min(Math.max(Number(ret.replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    }).replace(/[^-^0-9^\.]/g, "")), min), max)
    return null
  }

  function addHelp(xpath, help) {
    if (!xpath) return;
    let ele = typeof xpath == "function" ? xpath() : eleget0(xpath);
    if (ele) {
      ele.appendChild(document.createElement("span")).innerHTML = "<small> (" + help + ")</small>";
      //console.log("Found:" + xpath);
    }
    return;
  }

  function eleget0test(xpath, node = document) {
    return eleget0(xpath, node)
  }

  function dc(str, force = 0) {
    if (debug == 1) console.log(str);
    if (debug >= 2 || force) popup3(str, 0, 1, 5000, "top");
    return str;
  }

  //var maey = 0;

  function popup3(text, i = 0, lf = 1, timer = 15000, alignY = "bottom") {
    if (text === undefined || text === null) text = "<null>"
    if (typeof text == "string") text = text.slice(0, 200);
    if (typeof text != "number") text = String(text);
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    let id = Math.random().toString(36).substring(2);
    let maey = alignY == "bottom" ? 0 : elegeta(".wcspu3top").map(e => e.getBoundingClientRect().bottom).reduce((a, b) => Math.max(a, b), 0) + 2;
    if (timer < 0) {
      timer = -timer;
      $(`.wcspu3${alignY}`).remove()
    }
    var ele = $(`<span id="wcspu3${id}" class="ignoreMe wcspu3${alignY}" style="all:initial; max-width:33%;font-family:sans-serif; position: fixed; right:0em; ${ alignY }:${((maey) + i * 18)}px; z-index:2147483647; opacity:1; font-size:15px; margin:0px 1px; text-decoration:none !important;  padding:1px 6px 1px 6px; word-break: break-all !important; border-radius:12px; background-color:#305088; color:white; ">${ text }</span>`).appendTo('body');
    let ey = ele[0]?.getBoundingClientRect()?.height
    if (ele[0].getBoundingClientRect().bottom >= (window.innerHeight)) {
      elegeta('.wcspu3top').forEach(e => { e.style.top = parseFloat(e?.style?.top) - (ey) - 2 + "px" })
    }
    if (typeof text == "string") { maey += (text.match(/<br>/gmi) || []).length || 0; } //console.log((text.match(/<br>/gmi) || [] ).length) }
    setTimeout(() => {
      eleget0('//span[@id="wcspu3' + id + '"]')?.remove();
    }, timer);
  }

  function pref(name, store = undefined) { // pref(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、pref(name)で読み出し
    //if(location.protocol == "file:")return null;
    var domain = getDomain() || location.href;
    if (store === undefined) { // 読み出し
      let data = GM_getValue(domain + " ::: " + name)
      if (data == undefined) return store; // 値がないなら終わり
      if (data.substr(0, 1) === "[") { // 配列なのでJSONで返す
        try { return JSON.parse(data || '[]'); } catch (e) {
          console.log("データベースがバグってるのでクリアします\n" + e);
          pref(name, []);
          return;
        }
      } else return data;
    }
    if (store === "" || store === [] || store === null) { // 書き込み、削除
      GM_deleteValue(domain + " ::: " + name);
      return store;
    } else if (typeof store === "string") { // 書き込み、文字列
      GM_setValue(domain + " ::: " + name, store);
      return store;
    } else { // 書き込み、配列
      try { GM_setValue(domain + " ::: " + name, JSON.stringify(store)); } catch (e) {
        console.log("データベースがバグってるのでクリアします\n" + e);
        pref(name, "");
      }
      return store;
    }
  }

  function isinscreen(ele, wait = "nowait") {
    //    if (!ele || (wait == "wait" && $(eleget0('//span[@class="loading-text"]')).is(":visible"))) return 0;
    if (!ele) return;
    var eler = ele.getBoundingClientRect();
    return (eler.top > 0 && eler.left > 0 && eler.left < window.parent.screen.width && eler.top < window.parent.screen.height) && ele.offsetHeight;
  }

  function verb() {
    if (verbose) { for (let str of [...arguments]) { console.log(str + " : " + str) } }
  }

  function popup(text, color = "#3050f0") {
    if (!PopupHelpMS) return
    text = String(text);
    var e = document.getElementById("wscpu");
    if (e) { e.remove(); }
    var e = document.body.appendChild(document.createElement("span"));
    //    e.innerHTML = '<span id="wscpu" style="all:initial; position: fixed; right:-21em; bottom: 9em; z-index:11000; opacity:1; font-size:12px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:left; padding:1px 6px 1px 6px; border-radius:12px; background-color:' + color + '; color:white; white-space: nowrap;" onclick=\'var a = document.createElement(\"textarea\"); a.value = \"' + text.replace(/<br>/gm, "\\n") + '\"; document.body.appendChild(a); a.select(); document.execCommand(\"copy\"); a.parentElement.removeChild(a);\'">' + text + '</span>';
    var e = end(document.body, '<span id="wscpu" style="all:initial; position: fixed; right:-21em; bottom: 13em; z-index:11000; opacity:1; font-size:12px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:left; padding:1px 6px 1px 6px; border-radius:12px; background-color:' + color + '; color:white; white-space: nowrap;" onclick=\'var a = document.createElement(\"textarea\"); a.value = \"' + text.replace(/<br>/gm, "\\n") + '\"; document.body.appendChild(a); a.select(); document.execCommand(\"copy\"); a.parentElement.removeChild(a);\'">' + text + '</span>');
    //var e = document.getElementById("wscpu");
    e.animate([{ right: `${-2-(e.innerText.length)}em` }, { right: "0em" }], { duration: 100, fill: 'forwards' });
    setTimeout((function(e) { return function() { e.remove(); } })(e), PopupHelpMS);
  }

  function getColorFromText(str) {
    var col = 0;
    for (letter of str) { col = (++col * letter.charCodeAt(letter)); }
    return 'hsla(' + (col % 360) + ",100%,50%,5%)";
  }

  function lh(re) { let tmp = location.protocol == "file:" ? null : location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.protocol == "file:" ? null : location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  //function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function JS(v) { return JSON.stringify(v) }

  function fitFuncA(headers, pages, interval = 400, additionalFunc = null, footers = "") {
    if (GF.fitfuncBon === undefined) {
      document.addEventListener("scroll", fit);
      elegeta(headers).forEach(e => new MutationObserver(function(record, observer) { fit(1) }).observe(e, { childList: true, attributes: true, characterData: true })) // ヘッダーに些細でも変化（出現・消失・高さ変化等）があればfit
      if (interval) setInterval(() => fit(1), interval)
      window.addEventListener("resize", fit)
    }
    GF.fitfuncBon = 1
    fit();

    function fit(forcefit = 0) {
      if (!GF.fitfuncBon) return
      let headerBottom = elegeta(headers).reduce((a, v) => Math.max(a, v?.getBoundingClientRect().bottom), 0)
      let footerHeight = elegeta(footers).reduce((a, v) => Math.max(a, v?.getBoundingClientRect().height), 0)
      //var maxheight = `calc(${document.documentElement.clientHeight}px - ${marginu*4}px - ${ headerBottom + footerHeight | 0 }px)`;
      var maxheight = `calc(${clientHeight()}px - ${marginu*3}px - ${ headerBottom + footerHeight | 0 }px)`;
      //var maxheight = `calc(100vh - 12px - ${ headerBottom + footerHeight | 0 }px)`;
      elegeta(pages).filter(e => forcefit || e.style.maxHeight != maxheight).forEach(e => {
        e.style.width = "auto";
        //e.style.maxWidth = `${clientWidth() - e.getBoundingClientRect().left}px`;
        if (!e.dataset.maxheightbackup) e.dataset.maxheightbackup = e.style.maxHeight || "none"
        e.style.maxHeight = maxheight
        if (additionalFunc) additionalFunc(e, maxheight)
      })
    }
  }

  function fitFuncB(headers, pages, interval = 400, additionalFunc = null, footers = "") {
    if (GF.fitfuncBon === undefined) {
      document.addEventListener("scroll", fit);
      document.addEventListener("resize", fit);
      elegeta(headers).forEach(e => new MutationObserver(function(record, observer) { fit(1) }).observe(e, { childList: true, attributes: true, characterData: true })) // ヘッダーに些細でも変化（出現・消失・高さ変化等）があればfit
      if (interval) setInterval(() => fit(1), interval)
    }
    GF.fitfuncBon = 1
    fit();

    function fit(forcefit = 0) {
      if (!GF.fitfuncBon) return
      let headerBottom = elegeta(headers).reduce((a, v) => Math.max(a, v?.getBoundingClientRect().bottom), 0)
      let footerHeight = elegeta(footers).reduce((a, v) => Math.max(a, v?.getBoundingClientRect().height), 0)
      elegeta(pages).filter(e => forcefit || isinscreen(e)).forEach(e => {
        e.style.width = "auto";
        if (!e.dataset.maxheightbackup) e.dataset.maxheightbackup = e.style.maxHeight || "none"
        //        if(e.offsetHeight>=window.innerHeight-headerBottom-footerHeight)e.style.maxHeight = `calc(100vh - 12px - ${ headerBottom + footerHeight | 0 }px + ${~e.getBoundingClientRect().top}px)`

        e.style.maxHeight = `calc(100vh - 12px - ${ headerBottom + footerHeight | 0 }px + ${~e.getBoundingClientRect().top}px)`
        if (additionalFunc) additionalFunc(e, maxheight)
      })
    }
  }

  function oaco(target) { // observeAndClickOnce(target){ // xpath/cssがヒットする要素を毎秒監視して1回ずつだけクリック
    oaco1()

    function oaco1() {
      elegeta(target).filter(e => !e.dataset.oaco && e.offsetHeight).forEach(e => {
        e.dataset.oaco = 1
        e.click()
      })
      setTimeout(oaco1, 1000)
    }
  }

  function clientHeight() { return Math.min(document.documentElement.clientHeight, window.innerHeight) }

  function clientWidth() { return document.documentElement.clientWidth }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function getDomain() {
    return (location.protocol == "file:") ? "file" : (location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1])
  }

  function isinscreenAll(ele) {
    var eler = ele.getBoundingClientRect();
    return (eler.top > 0 && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < document.documentElement.clientHeight);
  } // 全体スッポリ

  function cbOnce(cb) {
    let cbstr = cb.toString();
    if (cbOnce?.done?.has(cbstr)) return;
    cbOnce.done = (cbOnce.done || new Set()).add(cbstr)
    cb()
  }

  function popup4(text) {
    if (!(DISPLAY_PAGE_NUMBER == 2 || (DISPLAY_PAGE_NUMBER && SITE?.displayPageNumber))) return;
    //$('#wcsKey4').remove()
    let ele = end(document.body, `<span id="wcsKey4" class="ignoreMe" style="all:initial; max-width:33%; font-size:2rem; padding:2rem; position:fixed; right:2rem; top:50vh; transform:translate(0,-50%); z-index:2147483647; opacity:0; word-break: break-all !important; border-radius:2rem; background-color:#57d; color:white; ">${ text }</span>`)
    ele.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, fill: "both" })
    setTimeout((ele) => {
      ele.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, fill: "both" }).onfinish = e => { ele?.remove() }
    }, 999, ele)
  }

  function mapV(eles, color = '#f00') {
    let stime = performance.now()
    if (!(DISPLAY_PAGE_NUMBER == 2 || (DISPLAY_PAGE_NUMBER && SITE?.displayPageNumber))) return 0;
    if (eles == undefined) { elegeta('#scrollbar-bg-bar , [id^="scrollbar-marker-container-"]').forEach(e => e?.remove()); return 0; }
    const ph = document.documentElement.scrollHeight;
    const vh = window.innerHeight;
    const bg = eleget0('#scrollbar-bg-bar') || end(document.body, `<div id='scrollbar-bg-bar' class="ignoreMe" style='position:fixed;top:0;right:0;width:16px;height:100vh;background:#ccc;opacity:0.5;z-index:999999;pointer-events:none;border-radius:3px 0 0 3px; display:block;'></div>`);
    const containerId = 'scrollbar-marker-container-' + color.replace(/[^a-z0-9]/gi, '');
    const container = eleget0(containerId) || end(document.body, `<div  id="${containerId}" class="ignoreMe" style='position:fixed;top:0;right:0;width:16px;height:100vh;z-index:999999;pointer-events:none;'></div>`);
    eles.forEach(ele => {
      if (!ele) return;
      const r = ele.getBoundingClientRect();
      const top = (r.top + window.pageYOffset) / ph * vh;
      const h = Math.max((r.height / ph * vh) - 1, 1);
      const marker = end(container, `<div class="ignoreMe" style='position:absolute;right:0;width:16px;background:${color};border-radius:3px;opacity:0.5;transition:top 0.3s,height 0.3s;top:${Math.min(vh-h,Math.max(0,top))}px;height:${h}px;'></div>`);
    });
    if (mapV.hideTimeoutId) clearTimeout(mapV.hideTimeoutId);
    mapV.hideTimeoutId = setTimeout(() => {
      elegeta('#scrollbar-bg-bar , [id^="scrollbar-marker-container-"]').forEach(e => e?.remove());
      mapV.hideTimeoutId = null;
    }, 1000);
    GF.mapVlap = Math.max(GF?.mapVlap || 0, performance.now() - stime) // かかった最大ms
  }

  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

})();