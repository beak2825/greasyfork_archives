// ==UserScript==
// @name 学園祭カレンダー絞り込み
// @description s:絞り込み(h:強調付き）　Shift+S:例で絞り込み　（とどラン）a:相関が弱いものを消す
// @version      0.3.64
// @run-at document-idle
// @match file:///*.html
// @match *://*.5ch.net/*
// @match *://auctions.yahoo.co.jp/category/list/*
// @match *://auctions.yahoo.co.jp/search/search*
// @match *://auctions.yahoo.co.jp/seller/*
// @match *://auctions.yahoo.co.jp/jp/show/*
// @match *://fmfm.jp/*
// @match *://labo.tv/2chnews/*
// @match *://omocoro.jp/*
// @match *://oowata.com/*
// @match *://owata-net.com/*
// @match *://workman.jp/shop/*
// @match *://todo-ran.com/t/*
// @match *://www.gakkou.net/daigaku/gakuensai/*
// @match *://www.nicochart.jp/user/*
// @match *://www.nicochart.jp/search/*
// @match *://www.nicochart.jp/name/*
// @match *://www.nicochart.jp/tag/*
// @match *://www.nicovideo.jp/ranking
// @match *://www.nicovideo.jp/ranking/*
// @match *://www.nicovideo.jp/search/*
// @match *://www.nicovideo.jp/tag/*
// @match *://www.nicovideo.jp/user/*
// @match *://www.nicovideo.jp/series/*
// @match *://www.nicovideo.jp/my/mylist*
// @match *://www.nicovideo.jp/my/watchlater*
// @match *://www.nicovideo.jp/my/
// @match https://www.nicovideo.jp/my/nicorepo/*
// @match *://www.nicovideo.me/*
// @match *://www.suruga-ya.jp/pcmypage/action_favorite_list/detail/*
// @match *://www.youtube.com/*
// @match *://www.youtube.com/channel/*
// @match *://www.youtube.com/user/*
// @match *://www.youtube.com/playlist?list=*
// @match *://www.youtube.com/watch?v=*
// @match *://gigazine.net/*
// @match *://gigazine.net/news/C*
// @match *://www.ebay.com/sch/*
// @match *://www.ebay.com/b/*
// @match *://www.lifehacker.jp/*
// @match *://www.gizmodo.jp/*
// @match *://ja.aliexpress.com/*
// @match *://kuzure.but.jp/*
// @match *://*.userbenchmark.com/*
// @match *://commons.nicovideo.jp/*
// @match *://scholar.google.co.jp/*
// @match *://pubmed.ncbi.nlm.nih.gov/*
// @match *://www.amazon.co.jp/s?*
// @match *://www.suruga-ya.jp/*
// @match *://www.onsen.ag/
// @match *://hibiki-radio.jp/*
// @match *://shopping.yahoo.co.jp/search*
// @match *://the360.life/*
// @match https://www.nicovideo.jp/my/?ref=pc_mypage_menu
// @match *://refind2ch.org/*
// @match *://kakaku.com/specsearch/*
// @match https://kakaku.com/item/*
// @match *://www.pixiv.net/users/*
// @match *://greasyfork.org/*/scripts*
// @match *://*.ftbucket.info/*
// @match *://boards.4channel.org/*
// @match *://*.2chan.net/*
// @match *://www.amazon.co.jp/*/product-reviews/*
// @match *://ff5ch.syoboi.jp/?q=*
// @match *://togetter.com/*
// @match *://togetter.com/search*
// @match *://www.yodobashi.com/?word=*
// @match *://www.yodobashi.com/*&word=*
// @match *://www.yodobashi.com/*?word=*
// @match https://www.yodobashi.com/category/*
// @match *://www.sukima.me/*
// @match *://webcomics.jp/*
// @match *://twicomi.com/*
// @match *://free.arinco.org/*
// @match *://write.as/*
// @match *://*.writeas.com/*
// @match *://en.wikipedia.org/*
// @match *://workman.jp/*
// @match *://www.uniqlo.com/*
// @match *://*.shitaraba.net/bbs/read.cgi/*
// @match *://jbbs.shitaraba.net/bbs/read_archive.cgi/*
// @match *://anige.horigiri.net/*
// @match *://futapo.futakuro.com/*
// @match *://www.ftbucket.info/*
// @match *://jp.iherb.com/search?kw=*
// @match *://jp.iherb.com/c/*
// @match *://jp.iherb.com/cl/*
// @match *://my-best.com/*
// @match *://www.rtings.com/*
// @match *://my-best.com/*
// @match https://kakaku.com/pc/note-pc/itemlist.aspx
// @match https://kakaku.com/pc/desktop-pc/itemlist.aspx
// @match *://search.bilibili.com/*
// @match *://www.kohnan-eshop.com/*
// @match *://modernsurvivalblog.com/health/high-orac-value-antioxidant-foods-top-100*
// @match *://superfoodly.com/orac-values*
// @match *://may.2chan.net/*
// @match *://www.uexpress.com/*
// @match https://tsumanne.net/*/data/*
// @match *://zendamakinblog.com/*
// @match *://www.netoff.co.jp/*
// @match https://www.google.co.jp/*
// @match *://www.eiyoukeisan.com/*
// @match *://jp.daisonet.com/*
// @match *://xcancel.com/*
// @match *://shonenjumpplus.com/series*
// @match *://old.reddit.com/*
// @match *://kuragebunch.com/series*
// @match *://www.sunday-webry.com/series*
// @match *://commons.nicovideo.jp/*
// @match *://nttxstore.jp/*
// @match *://shopping.bookoff.co.jp/*
// @match *://japanese.alibaba.com/*
// @match *://www.alibaba.com/trade/search*
// @match *://windhawk.net/*
// @match *://gamicus.fandom.com/*
// @match *://tonarinoyj.jp/*
// @noframes
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM.setClipboard
// @grant       GM_addStyle
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/392103/%E5%AD%A6%E5%9C%92%E7%A5%AD%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E7%B5%9E%E3%82%8A%E8%BE%BC%E3%81%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/392103/%E5%AD%A6%E5%9C%92%E7%A5%AD%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E7%B5%9E%E3%82%8A%E8%BE%BC%E3%81%BF.meta.js
// ==/UserScript==
// @match *://*/*

(function() {
  const EXPERIMENTAL_WAITELEMENT_ALWAYS = 1; // 1:常に要素を待つ
  const historyLen = 500;
  const historyLenMax = 2500;
  const HIGHLIGHT_KEY = null; // "h"; // すべてのサイトでのハイライト付き絞り込みのキーのデフォルト
  const EXPERT = 0;
  const S_INCLUDE_SELECTION = 0; // 1:ｓキー押下時のプロンプトで選択中の文字列を末尾に「|<選択文字列>」の形で追加する

  const LogMatch = 0;
  const WAIT = performance.now();
  const debug = 0; // 1:フィルタのボタン・フォーム設置予定地と対象要素を強調 n<2:更に情報
  var popupY = 0;
  var waitTimerA = []
  var waitTimerB = []
  var GF = {};
  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  let inYOUTUBE = location.hostname.match0(/^www\.youtube\.com|^youtu\.be/);

  if (window !== parent) return;

  var shiboDNIevent;
  var shiboTimer = null;
  var searRE;
  var searchW = ""

  const SITEINFO = [ // 上が優先
    {
      url: '//tonarinoyj.jp/',
      filterItem: 'li[class*="subpage-table-list-item"]',
      filterPlace: 'ul.subpage-anchor > li:last-child > a',
    }, {
      url: '//gamicus.fandom.com/',
      filterPlace: '//div[contains(@class,"mw-content-ltr mw-parser-output") and @dir="ltr"]/p[last()]',
      filterItem: 'table.sortable > tbody > tr',
    }, {
      url: '//windhawk.net/',
      filterPlace: 'div.sc-bypJrT',
      filterItem: 'div.sc-cPiKLX',
      filterSampleWord: () => "S",
    }, {
      url: '//japanese.alibaba.com/|www.alibaba.com/trade/search',
      filterPlace: 'div.seb-refine-result_all',
      filterItem: 'div.fy23-search-card.m-gallery-product-item-v2.J-search-card-wrapper.searchx-offer-item',
      filterSampleWord: () => eleget0('input.search-bar-input.util-ellipsis')?.value ?? "",
    }, {
      url: '//shopping.bookoff.co.jp/',
      filterPlace: 'p.productSearch__num',
      filterItem: 'div.productItem',
      filterSampleWord: () => eleget0('input#zsSearchFormInput.zs-search-input')?.value ?? "",
    }, {
      url: '//nttxstore.jp/',
      filterPlace: 'ul.header_menu',
      filterItem: 'div#schphoto > ul > li',
      style: "width:22%;",
    }, {
      url: '//commons.nicovideo.jp/',
      filterPlace: 'div.l-globalHeader__inner',
      filterItem: 'div.worksFullCard',
      delay: 444,
    }, {
      url: '//www.sunday-webry.com/series',
      filterPlace: 'nav.series-nav > ul',
      filterItem: 'li.webry-series-item.test-series',
    }, {
      url: '//kuragebunch.com/series',
      filterPlace: 'nav.sub-header-nav',
      filterItem: 'li.page-series-list-item',
    }, {
      url: '//old.reddit.com/',
      filterPlace: 'a.title-button',
      filterItem: 'div.thing.noncollapsed.comment',
      highlightKey: "h",
    }, {
      url: '//shonenjumpplus.com/series',
      filterPlace: 'h1.series-list-header-title',
      filterItem: 'li.series-list-item',
    }, {
      url: '//xcancel.com/',
      filterPlace: 'div.timeline-header , ul.tab',
      filterItem: 'div.timeline-item',
    }, {
      url: '//jp.daisonet.com/',
      filterPlace: 'li:last-of-type > span.breadcrumb__link , ol[role="list"] > li:last-of-type > span',
      filterItem: 'div.product-item[class*="1/4--desk"] , div.product-item--vertical',
    }, {
      url: '//www.eiyoukeisan.com/',
      filterPlace: 'div#breadcum , table > tbody > tr > td[valign="bottom"] > a > img',
      filterItem: 'tr',
    }, {
      url: 'https://www.google.co.jp/', // ショッピング
      filterPlace: 'div.NmsQ6b , div[class*="appbar"] > div',
      filterItem: 'div.sh-dgr__gr-auto.sh-dgr__grid-result , div.MtXiu',
      filterSampleWord: () => eleget0('textarea#APjFqb.gLFyf')?.value ?? "",
      delay: 2111,
      ignoreAbsenceOfItem: 1,
    }, {
      url: '//www.netoff.co.jp/',
      filterPlace: 'div.titleArea > h2',
      filterItem: 'li.clearfix.resultRow',
      filterSampleWord: () => eleget0('div.searchRightS > input.textImeOn')?.value ?? "",
    }, {
      url: '//zendamakinblog.com/',
      filterItem: 'div.views-row.kin-title',
      filterPlace: 'h1#page-title',
    }, {
      id: "kakaku_store",
      url: 'https://kakaku.com/item/',
      filterPlace: 'div.h3Area',
      filterItem: '//div[@id="mainLeft"]/table/tbody/tr',
      filterSampleWord: () => '\\[amazon\\]|amazon\\.co|OCNオンラインショップ|NTT-X|ヨドバシ',
    }, {
      url: '//www.uexpress.com/',
      filterItem: 'article',
      filterPlace: '//h1[@class="Dynamic_header__YD59n"]|//nav[@class="Filters_filters__nY-jL"]/div[last()]/div[last()]',
    }, {
      url: 'bilibili',
      filterPlace: 'div.flex_center',
      filterItem: 'div.video-list-item , div.video-list>div',
      filterSampleWord: () => eleget0(`input.search-input-el`)?.value?.replace(/^\"|\"$/g, "") ?? "",
    }, {
      url: '//[^.]+.2chan.net/.*=cat',
      filterPlace: '//body/span[1]',
      filterItem: '//html/body/table[@id="cattable"]/tbody/tr/td',
      styleR: "width:auto; margin:0 1em;",
      filterFunc: () => {
        GM_addStyle("body #cattable tr.hidebygakusai{height:0 !important; min-height:0 !important;}")
        elegetaG('#cattable tr').forEach(e => {
          elegetaG('td:visible', e)?.length ? e.classList.remove("hidebygakusai") : e.classList.add("hidebygakusai")
        })
      },
    },
    {
      url: '//superfoodly.com/',
      filterItem: 'tbody.row-striping > tr',
      filterPlace: 'div.dt-length',
      filterSampleWord: () => 'fresh|raw|新鮮｜フレッシュ｜生',
      func: () => {
        setTimeout(() => {
          elegetaG('//div[contains(@class,"dt-length")]/select[@id="dt-length-0"]').forEach(e => {
            end(e, `<option value="1000">1000</option>`);
            e.selectedIndex = 4;
            e.dispatchEvent(new Event('change'))
          })
        }, 555)
      },
      styleR: "width:auto;",
    }, {
      url: '//modernsurvivalblog.com/',
      filterItem: '//figure[@class="wp-block-table"]/table/tbody/tr',
      filterPlace: '//h2[@id="h-orac-value-list-top-100"]',
      filterSampleWord: () => 'fresh|raw|新鮮｜フレッシュ｜生',
    }, {
      url: '//www.uniqlo.com/',
      filterPlace: '//div/div[@class="fr-ec-utility-bar--filter-bar"]/..',
      filterItem: '//div[@class="fr-ec-product-tile-resize-wrapper"]',
    }, {
      url: '//www.kohnan-eshop.com/',
      filterPlace: '//div/header[@id="header"]',
      filterItem: '//ul[@class="block-thumbnail-t"]/li',
      //lastEpisode: '//nav[contains(@class,"pane-gnav")]',
    }, {
      url: '//search.bilibili.com/',
      filterPlace: '//div[@class="conditions-order flex_between"]/div',
      filterItem: '//div[@class="bili-video-card__wrap __scale-wrap"]',
      delay: 400,
      style: "width:40%;",
    }, {
      url: '//my-best.com/',
      filterPlace: '//table/../..',
      filterItem: '//tbody/tr|//div[@class="p-contents-item-part"]',
      highlightKey: "h",
    }, {
      url: /^https:\/\/kakaku.com\/pc\/note-pc\/itemlist\.aspx|https:\/\/kakaku\.com\/pc\/desktop-pc\/itemlist.aspx/,
      filterPlace: '//form[@method="post"]/div/table',
      filterItem: '//table/tbody/tr/td[@class="ckitemLink"]/ancestor::tr[@class="tr-border"]',
      altFilter: (searRE) => {
        elegetaG('//table/tbody/tr/td[@class="ckitemLink"]/ancestor::tr[@class="tr-border"]').filter(e => eleget0('.end.checkItem', e)).forEach(e => {
          if (new RegExp(searRE, "gmi").test((e.innerText + " " + e?.nextSibling?.nextSibling?.innerText).replace(/\r|\n|\s/gm, " "))) { $(e?.nextSibling?.nextSibling).add(e).show(); } else { $(e?.nextSibling?.nextSibling).add(e).hide(); }
        })
      },
      dniWait: 500,
      delay: 1222,
      //      ignoreAbsenceOfItem: 1,
    }, {
      url: /\/\/www.rtings.com\/.*\/table/,
      filterPlace: '//div[@class="table_tool-header"]/div[1]',
      filterItem: '//div/table[@class="simple_table-table"]/tbody/tr',
      dniWait: 500,
      delay: 3222,
      style: 'width:44%;'
    }, {
      url: '//my-best.com/',
      filterPlace: '//ul[@class="js-cluster-list p-cluster-select__list"]',
      filterItem: '.p-content-box tbody tr',
      delay: 999,
    }, {
      url: /\/\/jp.iherb.com\/search\?kw=|\/\/jp.iherb.com\/c\/|\/\/jp\.iherb\.com\/cl\/clearance/,
      //filterPlace: '//span[contains(@class,"sub-header-title display-items")]',
      waitElement: 1000,
      filterPlace: `div.panel.panel-header.panel-form.modernized`, //'//*[contains(@class,"sub-header-title")]',
      filterItem: `div.product-cell-container.product-cell`, //'//div[contains(@class,"product-cell-container")]|.//div[contains(@class,"product ga-product")]',
      //      filterSampleWord: () => '!在庫切れ|再入荷予定日|ご利用いただけません|利用不可|Unavailable ',
      filterSampleWord: () => eleget0('input#txtSearch.iherb-header-search-input')?.value ?? '!在庫切れ|再入荷予定日|ご利用いただけません|利用不可|Unavailable ',
    }, {
      url: '//futapo.futakuro.com/',
      filterPlace: '//div[@id="menu"]/header/ul/li[last()]',
      filterItem: 'div#data>a.box,.yhmMemoDeleteButton',
      delay: 500,
      dniWait: 5500,
      style: "width:7em;",
      ignoreAbsenceOfItem: 1,
    }, {
      url: /https:\/\/www.ftbucket.info\/scrapshot\/ftb\/index.php|www.ftbucket.info\/scrapshot\/ftb\/\?favo=0|\/\/www.ftbucket.info\/scrapshot\/ftb\/$/,
      id: 'ftbucket_catalog',
      filterPlace: '//body/form[@class="ng-pristine ng-valid"]/div|//html/body/div[5]',
      filterItem: '//html/body/table[2]/tbody/tr/td',
      delay: 200,
    }, {
      url: '//en.wikipedia.org/',
      filterItem: '//table/tbody/tr',
      filterPlace: '//h1[@id="firstHeading"]',
      highlightKey: "h",
    }, {
      url: '//write.as/|writeas.com',
      filterPlace: '//header',
      filterItem: '//article',
      highlightKey: "h",
    }, {
      url: '//free.arinco.org/',
      filterItem: '//ul[@class="itemlist reduce"]/li|//li/a/..|//div/ol[@class="recommended-list"]/li',
      filterPlace: '//div[@id="top"]/nav',
    }, {
      id: 'twicomi',
      url: /\/\/twicomi\.com\/$|\/\/twicomi\.com\/trending\/|\/\/twicomi\.com\/ranking\/|\/\/twicomi\.com\/all\/|\/\/twicomi\.com\/author\//,
      filterPlace: '//div/header/div[@class="sub-menu clearfix"]|//h1[@class="headline-large"]',
      filterItem: '//div[@class="manga-item"]',

      delay: 2000,
      ignoreAbsenceOfItem: 1,
      filterFunc: () => { $('.list').css({ "min-height": "0px" }) }, // AP継ぎ足し時の空白を詰める
      //  observeURL:2000,
    }, {
      id: 'webcomics bookmark',
      url: /\/\/webcomics\.jp\//i,
      //url: /\/\/webcomics\.jp\/$|\/\/webcomics\.jp\/(hot|recommend|random|bookmark|ranking|search)/i,
      filterPlace: 'div.about,div#pr',
      filterItem: 'div.entry , #favpanel .favhisentry',
      filterSampleWord: () => 'S|specialFlag',
      func: () => { document.addEventListener("plzGKSI", () => { if (searchW > "") shibo(searchW, "s", 0) }); },
      /*    }, {
              id: 'webcomics.jp',
              url: '//webcomics.jp/',
              filterPlace: 'div.about,div#pr',
              filterItem: 'div.entry',
              filterSampleWord:()=> 'S|specialFlag',
        */
    }, {
      url: '//www.sukima.me/',
      filterPlace: '//h3[@class="h3 py-3 ma-0"]|//div[@class="v-toolbar__extension"]',
      filterItem: '//div[@class="col col-4 col-sm-2 px-1 px-sm-2 z-index-2 my-2 align-self-end"]',
    }, {
      url: /\/\/www.yodobashi.com\/.*[\&\?]word=|https:\/\/www\.yodobashi\.com\/category\//,
      filterPlace: '//div[@class="txtnav clearfix"]',
      filterItem: '.srcResultItem_block.pListBlock.hznBox.productListTile , div.owl-item',
      waitElement: 1000,
      filterSampleWord: () => eleget0(`input.editInput[name="word"]`)?.value?.trim() || "", //?.match("米") ? '^(?=.*(北海道))(?=.*(ななつぼし))|^(?=.*(北海道))(?=.*(ゆめぴりか))|^(?=.*(北海道))(?=.*(ふっくりんこ))|^(?=.*(青森))(?=.*(青天の霹靂))|^(?=.*(岩手))(?=.*(銀河のしずく))|^(?=.*(宮城))(?=.*(つや姫))|^(?=.*(秋田))(?=.*(ひとめぼれ))|^(?=.*(静岡))(?=.*(にこまる))|^(?=.*(岡山))(?=.*(きぬむすめ))|^(?=.*(高知))(?=.*(にこまる))|^(?=.*(佐賀))(?=.*(さがびより))' : eleget0(`input#twotabsearchtextbox.nav-input.nav-progressive-attribute`)?.value ?? "",
      /*altFilter: (searRE) => {
        elegetaG('.srcResultItem_block.pListBlock.hznBox.productListTile , div.owl-item').forEach(e => {
          if (new RegExp(searRE, "gmi").test((eleget0('//div[@class="pName fs14"]', e)?.innerText + " " + eleget0('.yhmMyMemo', e)?.innerText).replace(/\r|\n|\s/gm, " "))) {
            gmDataList_remove(e, "gmHideBygakusai")
            if (!gmDataList_includesPartial(e, 'gmHideBy')) $(e).show();
          } else {
            gmDataList_add(e, "gmHideBygakusai")
            $(e).hide();
          }
        })
      },*/
    }, {
      url: '//togetter.com|//togetter.com/search',
      filterPlace: '//header[@class="header_top"]/div',
      filterItem: '//article/div[@class="tweet_box"]/div|.//div[@class="list_box impl_profile"]|.//div/div[@class="thumb_list_box"]/div[2]/ul/li/a|.//a[@data-ga="inbound_realtimerank"]/div|.//div[@class="main_box closed"]/ul/li/a|.//ul/li[@class="clearfix"]/a[@data-ga="inbound_commentpopular_link"]|.//div[@class="related_list_box"]/ul/li|.//ul[@class="simple_list"]/li|.//div/div[@class="tag_box"]/a|.//div[@class="popular_tag_box"]/a|.//ul[@class="simple_list ranking_list"]/li|.//div[2]/div[contains(@class,"thumb_list_box")]/div/ul/li/a|.//ul[@class="simple_list insert_recommend"]/li|.//ul[@class="simple_list simple_mini_list"]/li|.//li[@class="has_thumb pickup_picture_list"]',
      //highlightKey:"h",
    }, {
      url: /\/\/ff5ch\.syoboi\.jp\/\?q=/,
      filterPlace: '//section[2]/div',
      filterItem: '//a[@class="thread"]/../..',
      highlightKey: "h",
    }, {
      id: 'amazon_review',
      url: '//www.amazon.co.jp/.+/product-reviews/.+',
      filterItem: '//div[contains(@class,"a-section celwidget")]/..',
      //filterItem: 'div[data-asin]',
      filterPlace: '//div/div[1]/div/div[@data-hook="cr-filter-info-review-rating-count"]',
    }, {
      url: '//greasyfork.org/.+/scripts',
      filterPlace: '//div[@class="sidebarred-main-content"]/p[1]',
      filterItem: '//a[@class="script-link"]/../../..',
    }, {
      url: '//www.pixiv.net/users/',
      filterPlace: '//section/div[2]/div|//h2[@font-size="20" and @color="text2"]/..',
      filterItem: '//div/div/ul/li[@offset="0"]',
      delay: 3000,
    }, {
      url: '//boards.4channel.org/.*\/thread\/',
      filterItem: '.postContainer',
      filterPlace: 'div.navLinks.desktop',
      filterSampleWord: () => '\\d\\s(K|M)B',
    }, {
      url: '//boards.4channel.org/.*\/catalog',
      filterItem: '.thread',
      filterPlace: 'div#ctrl',
      //filterSampleWord:()=> '\\d\\s(K|M)B',
    }, {
      url: '//kakaku.com/specsearch/',
      filterPlace: '//div[@class="checkButton"]|//div[@id="selectView"]',
      filterItem: '//td[@class="textL"]/strong/a/../../..',
      //delay:1000,
    }, {
      url: '//refind2ch.org/',
      filterPlace: '//div[@id="search_option"]',
      filterItem: '//div[3]/div/div[@id="search_results"]/a',
      dniWait: 777,
      highlightKey: "h",
    }, {
      url: '//the360.life/',
      filterPlace: '//div/div[@class="s-ttl"]/img/..',
      filterItem: '//div[@class="s-ls2_list"]',
      filterSampleWord: () => '！化粧｜コスメ｜美容',
      dniWait: 200,
      delayAutoWeighting: 1,
    }, {
      url: '//shopping.yahoo.co.jp/search',
      filterPlace: '//div/div[1]/h1',
      filterItem: 'li[class*="LoopList__item"]',
      delayAutoWeighting: 1,
      delay: 1000,
    }, {
      url: '//hibiki-radio.jp/',
      filterPlace: '//div[@class="tabset"]',
      filterItem: '//div/a[contains(@class,"program-box program-box-animate")]',
      delayAutoWeighting: 3,
    }, {
      url: '//www.onsen.ag',
      filterPlace: '//ul[@id="tabs"]', //'//div[@class="category--container"]',
      filterItem: '//div[@class="category-videos--wrapper"]/ul/li/..|//div[@class="slide-item"]/div/..|//ul[@class="category-videos"]/li|//a[@class="recommend-item-link"]|//ul[@class="category-videos count-videos"]/li|//a[@class="recommend-item-link"]|//a[@class="event-item-link"]',
      delayAutoWeighting: 1,
    }, {
      url: '//www.suruga-ya.jp/search',
      filterPlace: '//div[@class="search_option"]',
      filterItem: '//div[@class="item_detail"]/..',
      filterSampleWord: () => eleget0('input#txt-search.form-control.search_top_input')?.value || "",
    }, {
      url: /\/\/www\.amazon\.co\.jp\/s\?/,
      filterPlace: 'h2.a-size-base.a-spacing-small.a-spacing-top-small.a-text-normal',
      filterItem: 'div.s-asin[data-asin]',
      waitElement: 1000,
      filterSampleWord: () => (eleget0(`input#twotabsearchtextbox.nav-input.nav-progressive-attribute`)?.value?.match("米") ? '^(?=.*(北海道))(?=.*(ななつぼし))|^(?=.*(北海道))(?=.*(ゆめぴりか))|^(?=.*(北海道))(?=.*(ふっくりんこ))|^(?=.*(青森))(?=.*(青天の霹靂))|^(?=.*(岩手))(?=.*(銀河のしずく))|^(?=.*(宮城))(?=.*(つや姫))|^(?=.*(秋田))(?=.*(ひとめぼれ))|^(?=.*(静岡))(?=.*(にこまる))|^(?=.*(岡山))(?=.*(きぬむすめ))|^(?=.*(高知))(?=.*(にこまる))|^(?=.*(佐賀))(?=.*(さがびより))' : eleget0(`input#twotabsearchtextbox.nav-input.nav-progressive-attribute`)?.value ?? "")?.replace(/\s+OR\s+/gmi, "|"),
    }, {
      url: '//pubmed.ncbi.nlm.nih.gov/',
      filterPlace: '//div[@class="results-amount-container"]/div[1]',
      filterItem: '//article[@class="full-docsum"]',
    }, {
      url: '//scholar.google.co.jp',
      filterPlace: '//div[@id="gs_ab_md"]/div/../..',
      filterItem: '//div[contains(@class,"gs_r gs_or gs_scl")]',
    }, {
      id: 'nicorepo',
      url: '//www.nicovideo.jp/my/\\?ref=pc_mypage_menu|https://www\.nicovideo\.jp\/my\/$|https:\/\/www\.nicovideo\.jp\/my\/nicorepo\/',
      filterPlace: '//div[@class="MainMenuContainer-menu"]',
      filterItem: '//div/article[@class="NicorepoItem-item"]/..',
      delayAutoWeighting: 1.75,
      filterSampleWord: () => '投稿しました',
      filterFunc: function() { $('.NicorepoItem-item').css({ "padding": "0px" }) }, // 余白を詰める
      ignoreAbsenceOfItem: 1,
    }, {
      url: '//commons.nicovideo.jp/',
      filterItem: '//div/ul/li[@class="item2"]',
      filterPlace: '//div[@class="inner"]/div[@data-is-owner=""]/div/p',
      delayAutoWeighting: 1,
    }, {
      url: '//.+.userbenchmark.com/',
      filterPlace: '//p[@class="medp two-cols fl-dc"]',
      filterItem: '//span[@class="semi-strongs lighterblacktexts"]/../../../..',
      filterSampleWord: () => '',
    }, {
      url: '//.*.5ch.net/.*?/subback.html',
      filterPlace: '//body/div[@class="block"]/small/a[3]|//div[@class="floated"]/small/a[3]/b|/HTML/BODY/DIV[1]/SMALL[1]/A[3]/B[1]|//html/body/div[@class="floated"]/small/a[3]/b',
      filterItem: '//small[@id="trad"]/a|//div[@class="block"]/small/a|//div[@class="floated"]/small/a',
      filterSampleWord: () => '',
      highlightKey: "h",
    }, {
      url: /\/\/.*\.5ch\.net\/[^\/]*\/(\?v=pc)?$/,
      //url: /\/\/.*\.5ch\.net\/\w*\/$/,
      filterItem: '//div[@id="thread-list-box"]/table[@id="thread-list"]/tbody/tr/td/a/../..',
      filterPlace: '//div[@id="thread-list-top-bar"]', // //div[@id="thread-list-box"]/div[@id="thread-list-top-bar"]',
      delay: 2000,
      highlightKey: "h",
    }, {
      url: () => (lh(/5ch\.net\/test\/read\.cgi\//) && !lh("/c/")) || eleget0('div.row.noflex > div#thread > h1#threadtitle , div.row > div#thread.column > span#bottomDocTitle , div#maincontent > div.row > div.thread > span#bottomDocTitle'), // 新5chスレ内
      filterPlace: `ul.menujust`, //'div.row.center.font0p8',
      filterItem: 'div.post , div[style="display:flex; gap:5px;"]',
      highlightKey: "h",
      keepLookingAt: () => eleget0('.post:not(.ch5pu .post):hover') ? elegeta('.post:not(.ch5pu .post):hover') : elegetaG('.post:not(.ch5pu .post)'),
      filterSampleWord: () => "S|s|(?<!>\\S*)(\\.jpg|\\.jpeg|\\.png|\\.gif|\\.webp|\\.webm|\\.mp4|\\/watch|youtu\\.be\\/|nicovideo|nico\\.ms|i\\.imgur\\.com\\/)(?!.*…)|specialFlag",
    }, {
      url: () => lh('//.*\.5ch\.net/') || (location?.protocol == "file:" && eleget0('a.highlight.menuitem[href*=".5ch.net/"]:text*=■掲示板に戻る■') && eleget0('div.post')), // 旧5ch
      filterPlace: '//h1[@class="title"]|//span/h1',
      filterItem: 'div.post',
      delay: 750,
      important: true,
      filterFunc: function() {
        $('div.post:hidden').next("br").css("display", "none");
        $('div.post:visible').next("br:hidden").css("display", "block");
      }, //余計な改行を詰める
      highlightKey: "h",
      filterSampleWord: () => "S|s|(?<!>\\S*)(\\.jpg|\\.jpeg|\\.png|\\.gif|\\.webp|\\.webm|\\.mp4|\\/watch|youtu\\.be\\/|nicovideo|nico\\.ms|i\\.imgur\\.com\\/)(?!.*…)|specialFlag",
      //filterSampleWord:()=> "S|s|ttp",
    }, {
      url: '\.shitaraba\.net\/bbs\/read\.cgi\/|\.shitaraba\.net\/bbs\/read_archive\.cgi\/',
      filterPlace: '//h1[@class="thread-title"]|/html/body/p/a[text()="■過去ログ倉庫一覧■"]|//div[@class="header-menu"]',
      filterItem: '//div[@class="post"]',
      delay: 1000,
      //      important: true,
      filterFunc: function() {
        $('div.post:hidden').next("br").css("display", "none");
        $('div.post:visible').next("br:hidden").css("display", "block");
      }, //余計な改行を詰める
      //filterFuncDelay:1,
      highlightKey: "h",
      filterSampleWord: () => "S|s|(?<!>\\S*)(\\.jpg|\\.jpeg|\\.png|\\.gif|\\.webp|\\.webm|\\.mp4|\\/watch|youtu\\.be\\/|nicovideo|nico\\.ms|i\\.imgur\\.com\\/)(?!.*…)|specialFlag",
    }, { // futaba::
      url: () => (location.protocol == "file:" && eleget0('tbody > tr > th[bgcolor="#e04000"] > font[color="#FFFFFF"]:text*=レス送信モード')) || /\/\/.*.ftbucket.info\/|\/\/kuzure\.but\.jp\/f\/b\/|\/\/[^.]+.2chan\.net\/|\/\/anige\.horigiri\.net|\/\/kako\.futakuro\.com\/futa\/|https:\/\/tsumanne\.net\/.*\/data\//.test(location.href),
      //      url: '//.*?.2chan.net/|//.*.ftbucket.info/.+/cont/|\/\/tsumanne\.net\/.*\/data\/', // ftbucketでは全show()のCSSStyleDeclaration.getPropertyValueが異様に重い
      id: 'futachan',
      fastShow: 200,
      //    dniWait:1100,
      dniWait: () => { return !document.hasFocus() || Document.visibilityState === "hidden" ? 2100 : 666 },
      //dniWait:444,
      //func: () => !eleget0('.thre'),
      func: () => { document.addEventListener("plzGKSI", () => { if (searchW > "") shibo(searchW, "s", 0) }); return !eleget0('a[href*="http://kuzure.but.jp/"] > img[alt="タイトルロゴ"]') && !eleget0('.thre') },
      //func: () => {document.body.addEventListener("plzGKSI",shiboDNIevent); return !eleget0('.thre')},
      waitElement: 0,
      filterPlace: '//body/hr[2]|//div[@id="head"]/hr', //filterPlace: 'body > hr:nth-child(2 of hr) , div#head > hr',
      //      filterSampleWord:()=> '\\d\\sB\\)｜(?<!\\>)fu?\\d+\\.｜(?<!\\>)http|S|s', //'\\d\\sB\\)｜(?<!\\>)fu?\\d+\\.｜(?<!\\>)http｜そうだねx｜>>\\d',
      filterSampleWord: () => '\\d\\sB\\)｜(?<!\\>)fu?\\d{3,}\\.｜(?<!\\>)http|mailto\:[sSｓ][^a]|S|s', //'\\d\\sB\\)｜(?<!\\>)fu?\\d+\\.｜(?<!\\>)http｜そうだねx｜>>\\d',
      //filterSampleWord:()=> 'B\\)｜そうだねx｜>>\\d',
      //filterItem: '.thre table[border="0"],.thre>blockquote',
      filterItem: '.thre table[border="0"]:not([data-reszero],.deleted)', //filterItem: '.thre table[border="0"]',
      highlightKey: "h",
      highlightXP: '.rtd',
      style: 'width:calc(100% - 50em);',
      matchSelector: '.thre>table[border="0"]',
      observeNodeF: () => eleget0('.thre:not(.ftbpu .thre,#pickbox .thre)'),
    }, {
      url: '//anige.horigiri.net', // ftbucketでは全show()のCSSStyleDeclaration.getPropertyValueが異様に重い
      id: 'futachan',
      fastShow: 200,
      filterPlace: '//div/div[@class="titlebox"]',
      filterItem: '//div/table/tbody/tr/../..',
      filterSampleWord: () => 'B\\)｜そうだねx｜>>\\d',
      highlightKey: "h",
    }, {
      url: '//kuzure.but.jp/',
      id: 'futachan',
      func: () => { document.addEventListener("plzGKSI", () => { if (searchW > "") shibo(searchW, "s", 0) }); },
      filterSampleWord: () => '\\d\\sB\\)｜(?<!\\>)fu?\\d+\\.｜(?<!\\>)http|mailto\:a|S|s', //'\\d\\sB\\)｜(?<!\\>)fu?\\d+\\.｜(?<!\\>)http｜そうだねx｜>>\\d',
      highlightKey: "h",
      filterPlace: '//div[@id="head"]/hr',
      filterItem: '//tr/td[@class="rtd"]/../../..',
      highlightKey: "h",
      highlightXP: '.rtd',
      style: 'width:calc(100% - 40em);'
    }, {
      url: '//www.nicovideo.jp/my/watchlater|//www.nicovideo.jp/my/mylist/',
      filterPlace: '//section[@class="WatchLaterContainer"]/header|//div/header[@class="MylistHeader"]',
      //filterItem: '//span[@class="VideoMediaObject-bodyTitle"]/../../../../..',
      filterItem: '//div[@class="CheckboxVideoMediaObject MylistItem MylistItemList-item"]|//div[@class="CheckboxVideoMediaObject WatchLaterListItem WatchLaterList-item"]|//div[@class="CheckboxVideoMediaObject WatchLaterListItem WatchLaterList-item CheckboxVideoMediaObject_withFooter"]|//div[@class="VideoMediaObjectList"]/div',
      delay: 1000,
      delayAutoWeighting: 2,
      observeURL: 6, // よくわからないけど要リロード
      ignoreAbsenceOfItem: 1,
    }, {
      url: '//www.nicovideo.jp/user/', // 様子見
      delayAutoWeighting: 2, //      delay: 1000,
      filterPlace: 'span.VideoContainer-headerTotalCount , div.MylistMenu',
      filterItem: '//div[@class="VideoMediaObject MylistItem MylistItemList-item"]|//div[@class="NC-MediaObject-body"]/div[@class="NC-MediaObject-bodyTitle"]/h2/../../../../..',
      //      delayAutoWeighting:5,
      observeURL: 6, // よくわからないけど要リロード
      delay: 3000,
      ignoreAbsenceOfItem: 1,
    }, {
      url: '//www.nicovideo.me/',
      filterPlace: '//div[@class="center mvm"]',
      filterItem: '//ul[@id="data-videos"]/li',
    }, {
      url: "//www.gakkou.net/daigaku/gakuensai/",
      filterPlace: "H2.GESTitle",
      mapPlace: "h3.ListTtlN",
      filterItem: "ol[class^='articleListN']>li",
      filterSampleWord: () => "東京",
    }, {
      url: '//ja.aliexpress.com/',
      filterItem: '//div[@class="product-container"]/div/a',
      filterPlace: '//div[@class="top-container"]|//div[@class="next-breadcrumb"]',
    }, {
      url: "//todo-ran.com/t/soukan/|//todo-ran.com/t/kiji/|//todo-ran.com/t/tdfk/",
      filterPlace: "div.kiji_ktext",
      //      filterItem: '//table[@id="t_soukan_r"]/tbody/tr/td[1]/a/../..|//table[@class="kenbetsuranking" and @id="t_soukan"]/tbody/tr/td/a/../..',
      filterItem: '//table[@id="t_soukan_r"]/tbody/tr/td[1]/a/../..|//table[@class="kenbetsuranking" and @id="t_soukan"]/tbody/tr/td/a/../..|//table[@class="kenbetsuranking"]/tbody/tr/td[@class="left"]/a/../..',
      filterSampleWord: () => "消費量",
      func: () => {
        //県民性専用機能
        if (location.href.match("kiji")) { $(eleget0('//a[contains(text(),"全ての相関を見る")]')?.cloneNode(true, true)).css("float", "right").insertAfter($(eleget0('//div[@class="kiji"]/div[2]'))); } // ?
        //if (location.href.match(/:\/\/todo-ran\.com\/t\/kiji\//)) { $("div.kiji>div:eq(2)").after($("a:contains('全ての相関を見る'):first").clone().css("float", "right")); } // ?
        //if (location.href.match(/:\/\/todo-ran\.com\/t\/soukan\//)) $("table#t_soukan_r tbody tr td a,table#t_soukan tbody tr td a").each(function() { $(this).after("<a style='float:right;-moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;' rel=\"noopener noreferrer nofollow\" href='" + $(this).attr("href").replace("kiji", "soukan") + "'>全相関記事を見る</a>") });

        if (location.href.match(/:\/\/todo-ran\.com\/t\/soukan\/|\/tdfk\//)) $("table#t_soukan_r tbody tr td a,table#t_soukan tbody tr td a,td.left>a").each(function() { $(this).after("<a style='float:right;-moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;' rel=\"noopener noreferrer nofollow\" href='" + $(this).attr("href").replace("kiji", "soukan") + "'>全相関記事を見る</a>") });

        // a: 相関係数が0に近いものを消す
        if (location.href.match(/:\/\/todo-ran\.com\/t\/soukan\/|\/tdfk\//)) {
          $("<span class='phovTodoran' style='cursor:pointer; color:#505050; font-size:90%; background:#ffffffc0; padding:3px; border-radius:9px;border:#505050 1px solid; position:fixed; bottom:3em; right: 1em;'>A：相関/偏差値が弱いものを消す</span>").appendTo(document.body).click(function() { soukan(); });
          $(document).off('keydown.soukan').on('keydown.soukan', function(e) {
            if (e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA' && !e.target.isContentEditable) {
              var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
              if (key == "a" && $(xa(SITE.filterItem)).length > 0) {
                soukan();
                return false;
              }
            }
          });

          function soukan() {
            var key = proInput("残す個数", 35, 0);
            if (key > 1) {
              $('tr:hidden').remove();
              if (lh("soukan")) var min = $(xa('//table[@id="t_soukan_r"]/tbody/tr/td[last()]|//table[@class="kenbetsuranking" and @id="t_soukan"]/tbody/tr/td[2]')).sort(function(a, b) { return Math.abs($(a).text()) > Math.abs($(b).text()) ? 1 : -1; });
              else var min = $(xa('//table[@id="t_soukan_r"]/tbody/tr/td[last()]|//table[@class="kenbetsuranking" and @id="t_soukan"]/tbody/tr/td[2]|//table[@class="kenbetsuranking"]/tbody/tr/td[4]')).sort(function(a, b) { return Math.abs(50 - $(a).text()) > Math.abs(50 - $(b).text()) ? 1 : -1; });
              for (var i = 0; i < $(min).length; i++) {
                if (i < ($(min).length - key)) $(min[i]).parent().hide();
                else $(min[i]).parent().show();
              }
            }
          }
        }
      },
    }, {
      url: "//fmfm.jp",
      filterPlace: '//dl[@class="dateSort"]',
      filterItem: '//section[@class="eventList"]',
      filterSampleWord: () => "東京",
      delayAutoWeighting: 2.5,
    }, {
      url: "//www.nicovideo.jp/ranking",
      filterItem: '//div[@class="NC-Card-mainHeader"]/a/h2/../../..|.//div/div/h2[@class="NC-MediaObjectTitle NC-VideoMediaObject-title NC-MediaObjectTitle_fixed2Line"]/../../../../..',
      filterPlace: '//ul[@class="RankingGenreListContainer"]|//section[@class="RankingHeader SpecifiedRankingHeaderContainer"]', //'//div[@class="RankingHeaderContainer-headerInner"]',
      //    filterPlace: "div.BaseLayout-block ul",
      //      filterItem: '//div[@class="Card-title"]/..',
      filterSampleWord: () => "解説｜講座",
      filterFunc: () => {
        elegetaG('.RankingMatrixVideosRow,.RankingMatrixNicoadsRow').forEach(e => { { $(e).css({ "height": (elegetaG('.NC-Card-main:visible', e)?.length) ? "" : "1.5em" }) } })
        //          GM_addStyle('.RankingMatrixVideosRow{height:auto;min-height:1.5em;} .RankingMatrixNicoadsRow{height:auto;} .VideoItem.NC-VideoCard{height:auto;} .MatrixRanking-app{min-height:auto;}'); // 余白を詰める
      },
    }, { // youtubeコメント　絞り込み後のページ移動に全く未対応
      id: 'youtube_comment',
      url: /\/\/www\.youtube\.com\/watch\?v=/,
      //filterPlace: '//span[@class="style-scope ytd-comments-header-renderer"]/yt-sort-filter-sub-menu-renderer/yt-dropdown-menu/../..',
      filterPlace: 'span.style-scope.ytd-comments-header-renderer',
      filterItem: '//div[@id="main"]/..', //'//div[@id="content"]/../../..',
      styleL: "margin-left:3em;",
      styleR: "width:33%;margin-right:1em;",
      ignoreAbsenceOfItem: 1,
      dniWait: 700, // ヤフオクのdelayより大きくすること
      waitElement: 1500,
      //delay: 5000,
      disableKey: 1, // video speed controllerと衝突するのでｓキーは無効
    }, {
      url: "//www.youtube.com/results",
      ignoreAbsenceOfItem: 1,
      delayAutoWeighting: 1,
      waitElement: 2000, //      delay: 1500,
      filterPlace: 'ytd-search-header-renderer.style-scope.ytd-search,ytd-search-sub-menu-renderer,div#primary-items,iron-selector#chips,div#inner-header-container div#meta',
      filterItem: 'ytd-radio-renderer,ytd-video-renderer,ytd-playlist-renderer,ytd-channel-renderer,ytd-movie-renderer,ytd-horizontal-card-list-renderer,ytd-reel-item-renderer , ytm-shorts-lockup-view-model-v2 , ytm-shorts-lockup-view-model.ShortsLockupViewModelHost',
      observeURL: 3,
      //      filterSampleWord:()=> "\\d\\d\\d\\d.\\d\\d.\\d\\d.\\(.\\)\n！\\d\\s年前｜\\d\\sか月前｜\\d\\s週間前｜\\D[2-9]\\s日前｜再生リストの全体を見る｜\\d\\s本の動画｜ミックスリスト｜チャンネル登録者数",
      //      dniWait:1000,
      filterSampleWord: () => (eleget0('input#search , input.ytSearchboxComponentInput.yt-searchbox-input.title')?.value ?? "")?.replace(/\s+OR\s+/gmi, "|")
    }, {
      url: /\/\/www\.youtube\.com\/(?:channel\/|user\/|c\/|@)[^/]+\/search|\/\/www\.youtube\.com\/[^\/]+\/search/,
      filterPlace: '//input[@class="style-scope paper-input"]|//button[@id="button" and @aria-label="検索"]',
      filterItem: '//ytd-item-section-renderer[@class="style-scope ytd-section-list-renderer"]',
      observeURL: 3,
      ignoreAbsenceOfItem: 1,
      delayAutoWeighting: 1,
      waitElement: 2000, //delay: 1500,
      filterSampleWord: () => eleget0('input.style-scope.tp-yt-paper-input')?.value ?? "",
    }, {
      url: "//www.youtube.com/(?:channel\/|user\/|c\/|@|hashtag\/)|//www.youtube.com/[^\/]+/(?:videos|shorts|streams|playlists)",
      filterPlace: `ytd-expandable-tab-renderer , div#primary-items,iron-selector#chips,div#inner-header-container div#meta , div.yt-content-metadata-view-model-wiz__metadata-row.yt-content-metadata-view-model-wiz__metadata-row--metadata-row-inline`,
      filterItem: "ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer , ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer",
      observeURL: 3,
      dniWait: 666,
      func: () => { document.addEventListener("plzGKSI", () => { if (searchW > "") shibo(searchW, "s", 0) }); },
      style: "width:20%;margin:0 1em 0 0;",
      ignoreAbsenceOfItem: 1,
      //delayAutoWeighting: 1,
      waitElement: 2000, //      delay: 1500,
      matchSelector: 'ytd-rich-item-renderer', //,yhmmymemoremoved',
      filterFunc: () => {
        let newUI = eleget0('ytd-rich-item-renderer.style-scope.ytd-rich-grid-row,ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer,ytd-grid-video-renderer.style-scope.ytd-grid-renderer') || eleget0('//div[@class="style-scope ytd-rich-grid-row"]')
        if (newUI) { // 表示が乱れるのでよくわからない４列化行要素を消す
          waitDisappearElement("");
          waitDisappearElement('ytd-continuation-item-renderer', () => { $('ytd-rich-grid-row .style-scope.ytd-rich-grid-row').unwrap() })
        }
      },

    }, {
      url: "//www.youtube.com/playlist\?",
      filterPlace: `div.ytFlexibleActionsViewModelActionRow , div.metadata-wrapper.style-scope.ytd-playlist-header-renderer`,
      //      filterItem: '//*[@class="style-scope ytd-playlist-video-list-renderer"]',
      filterItem: '//div/ytd-playlist-video-list-renderer/div[@id="contents"]/ytd-playlist-video-renderer',

      ignoreAbsenceOfItem: 1,
      waitElement: 2000,
      //delayAutoWeighting: 1,
      //delay: 1500,
    }, {
      id: "YOUTUBE_TOP",
      url: /\/\/www\.youtube\.com\/(?:\?bp=.*)?$/,
      filterPlace: '//div[@id="header" and @class="style-scope ytd-rich-grid-renderer"]',
      filterItem: '//ytd-rich-item-renderer',
      observeURL: 3,
      //delayAutoWeighting: 0.2,
      ignoreAbsenceOfItem: 1,
      waitElement: 2000, //      delay: 1500,
      filterSampleWord: () => "！再生リストの全体を見る｜\\d\\s本の動画｜ミックスリスト｜人が視聴中｜YouTube\\sMusic \\d\\s時間前｜\\d\\s分前｜\\d\\s秒前｜\\D1\\s日前",
      //filterSampleWord:()=> "！\\d\\s年前｜\\d\\sか月前｜\\d\\s週間前｜\\D[2-9]\\s日前｜\\d\\d\\s日前｜再生リストの全体を見る｜\\d\\s本の動画｜ミックスリスト｜人が視聴中｜YouTube\\sMusic",
    }, {
      url: "//www.youtube.com/",
      filterPlace: '',
      filterItem: '',
      observeURL: 3,
    }, {
      url: "//omocoro.jp/",
      filterPlace: '//div[@class="tag-inner"]/h2[@class="waku-text"]|//div[@class="category-inner"]/h2[@class="waku-text"]|//div[@class="new-entries"]/div/h2[@class="title waku-text"]|//div[@class="writer-inner"]/h2[@class="waku-text"]',
      filterItem: "div.box",
    }, {
      url: "//workman.jp/shop/goods/search|//workman.jp/shop/brand/|//workman.jp/shop/c|/shop/storereserve/",
      filterPlace: '//header/div[@class="container"]|//div[@class="block-goods-list--pager-top block-goods-list--pager pager"]',
      filterItem: '//div[@class="_item"]|//div[@class="_wrap"]/..|//dl[@class="block-thumbnail-t--goods js-enhanced-ecommerce-item"]',
      filterSampleWord: () => "ストレッチ｜STRETCH",
      mapPlace: '//div[@class="block-stock-result--shopinfo"]/p[2]',
      observeURL: 1,
      delay: 1500,
    }, {
      url: '//www.nicovideo.jp/tag/',
      filterPlace: '//div[@class="tagListBox"]|//div[@class="formSearch"]',
      filterItem: '//li[@data-nicoad-video=""]', // '//li[@class="item"]',
    }, {
      url: '//www.nicovideo.jp/search/',
      filterPlace: '//div[@class="tagListBox"]|//div[@class="formSearch"]',
      filterItem: '//li[@data-nicoad-video=""]',
    },
    /* { // 消滅
          url: '//choku-buy.com/',
          mapPlace: '//p[@class="address"]'
        },*/
    {
      url: '//auctions.yahoo.co.jp/search/search',
      //filterPlace: '//div[@class="Options"]',
      filterPlace: '//div/div/ul[@class="CategoryTree__items"]|//div[@class="SearchMode__closed"]/..',
      waitElement: 500,
      filterItem: '//li[@class="Product"]',
      filterSampleWord: () => '！認証制限.{0,3}あり　\\d時間｜\\d分｜1日',
    }, {
      url: '//auctions.yahoo.co.jp/seller/',
      filterPlace: '//div[@class="bd"]/..',
      filterItem: '//td[@class="i"]/..',
      filterSampleWord: () => '！認証制限.{0,3}あり　\\d時間｜\\d分｜1日',
    }, {
      url: '//auctions.yahoo.co.jp/category/list/',
      filterPlace: '//div/div/ul[@class="CategoryTree__items"]|//div[@class="SearchMode__closed"]/..',
      waitElement: 500,
      //      filterPlace: '//div[@class="Options"]',
      filterItem: '//li[@class="Product"]',
      filterSampleWord: () => '！認証制限.{0,3}あり　\\d時間｜\\d分｜1日',
    }, {
      url: '//www.nicochart.jp/user/|//www.nicochart.jp/search/|//www.nicochart.jp/name/|//www.nicochart.jp/tag/',
      filterPlace: '//div[@id="result"]/ul[1]',
      filterItem: '//ul[@class="video-list"]/li/ul/..',
    }, {
      url: '//labo.tv/2chnews/',
      id: 'OWATA_ANTENNA',
      filterPlace: '//html/body/center/table/tbody/tr/td[@align="left"]/h2',
      filterItem: '//html/body/center/table/tbody/tr/td[@valign="top"]/div/ul/li',
    }, {
      url: '//owata-net.com',
      id: 'OWATA_ANTENNA',
      filterPlace: '//div/div[@class="clearfix"]',
      filterItem: '//div[@class="feed clearfix"]|//div[@class="feed-list"]/div',
    }, {
      url: '//oowata.com',
      id: 'OWATA_ANTENNA',
      filterPlace: '//div[4]/ul[@id="globalNavi"]',
      filterItem: '//td[contains(@class,"t")]/..|//ul/li[@class="t"]',
    }, {
      url: '//www.suruga-ya.jp/pcmypage/action_favorite_list/detail/',
      filterPlace: '//form[contains(@class,"favorite-form") and @method="post"]',
      filterItem: '//td[@class="gnavBox"]',
      filterSampleWord: () => '税込',
    }, {
      url: '//auctions.yahoo.co.jp/jp/show/rating',
      filterPlace: '//b[text()="評価コメントの一覧"]',
      filterItem: '//tr[2]/td[@colspan="3"]/small/a/../../../../..',
    }, {
      url: 'gigazine.net/|gigazine.net/news/C',
      filterPlace: '//header[@id="header"]',
      filterItem: '//div[@class="content"]/section|//div[@id="search_results"]/section',
      filterSampleWord: () => '！試食｜ヘッドライン｜取材',
    }, {
      url: /\/\/www.ebay.com\/sch\/|\/\/www.ebay.com\/b\//,
      filterPlace: '//div/div/div[@class="clearfix srp-controls__row-2"]|//div[@class="brw__wrapper"]/div/h2[contains(@class,"textual-display brw-controls__count")]',
      filterItem: '//div[@class="s-item__wrapper clearfix"]/..|//LI[@class="brwrvr__item-card brwrvr__item-card--gallery"]', //'//li[@class="s-item    "]/div/..',
      filterSampleWord: () => 'top.rated.seller|トップレートの売り手 \\d.product.rating|の製品評価',
    }, {
      url: '//www.lifehacker.jp/',
      //    filterPlace: 'h2.lh-block-title:contains("記事"):visible,div>div>h2:contains("の検索結果"):visible',
      filterPlace: '//h2[@class="lh-block-title" and contains(text(),"記事")]|//div/div[1]/h2[contains(text(),"の検索結果")]',
      filterItem: '//div[@class="lh-summary"]|//div/a[@class="lh-summary"]',
      filterSampleWord: () => '方法',
    }, {
      url: '//www.nicovideo.jp/series/',
      filterPlace: '//div[@class="SeriesDetailContainer-media"]',
      filterItem: '//div[@class="SeriesVideoListContainer"]/div',
    }, {
      url: '//www.gizmodo.jp/',
      filterPlace: '//div[@class="h-body-header"]/div',
      filterItem: '//article[@class="p-timeline-cardPost"]|//ul[@class="p-slider1-cardList swiper-wrapper"]/li|//div/div[@class="p-cardHead"]/article|//section[@class="s-Ranking_ListItemPost"]|//article[@class="s-body-cardList3CardPost"]|//article[@class="p-post-reviewList-CardPost"]|//article[@class="p-archive-cardPost"]',
      filterSampleWord: () => '',
    }, {
      url: '//.*',
      filterPlace: '//div[1]',
      filterItem: '//div|//td|//li',
      filterSampleWord: () => '',
      mapPlace: '',
      important: false,
      filterFunc: null,
    }, {
      url: '',
      filterPlace: '',
      filterItem: '',
      filterSampleWord: () => '',
      mapPlace: '',
      important: false,
      filterFunc: null,
    }, {
      url: '',
      filterPlace: '',
      filterItem: '',
      filterSampleWord: () => '',
      mapPlace: '',
      important: false,
      filterFunc: null,
    },
    /* { // doc::
                id: '', // 入力履歴を保存するキー名 省略時はサイトのドメイン（省略可）
                url: '', //対応URLにmatchする正規表現
                filterPlace: '', //絞り込みフォームを設置する場所 XPathかjQueryセレクタ（省略可）
                filterItem: '', //絞り込みフォームで絞り込む要素 XPathかjQueryセレクタ（省略可）
                filterSampleWord:()=> '', //絞り込みフォームの検索ワード例（省略可）
                mapPlace: '', //地図検索を設置したい住所の書いてある要素 XPathかjQueryセレクタ（省略可）
                important: false, //!importantを付けないと非表示にできないサイトでtrueを指定（省略可）
                filterFunc: null, //絞り込み実行時に行わせたい追加処理（省略可）
                observeURL: 0, //1以上ならURLが変化したら再処理を数値の回数繰り返す（省略可）
                delay: 0, //ページ開始時から処理開始までの遅延ミリ秒　（省略可）
                delayAutoWeighting: 0, // 0以外ならページ開始時から処理開始までの遅延の係数（省略可） delayと両方指定すると両方のうち大きい方を取る（省略可）
                waitElement: 0, // 0以外ならfilterPlace要素が現れるまでこの数値ms間隔で待ち、現れたら設置する（省略可）
                dniWait: 0, // 要素が継ぎ足されてから絞り込むまでのウエイトの追加量（省略可）
                disableKeyS: 0, // sキーを無効化
                ignoreAbsenceOfItem: 0, // 1:filterItemが1つも存在しなくても絞り込みフォームを設置
                fastShow:0, // この数以上の項目を隠した後再表示する時にshow()を使わない　ftbucketなどで使用．ただしバグるかも（省略可）
                style:"", // 設定されていると絞り込みフォームのフォーム側のstyleを指示 なければ"width:80%"（省略可）
                styleAll:"", // 設定されていると絞り込みフォームのボタンとフォーム両方にかかるstyleを指示 なければ""（省略可）
                styleL:"", // 設定されていると絞り込みフォームのボタン側のstyleを指示（省略可）
                styleR:"", // 設定されていると絞り込みフォームのフォーム側のstyleを指示（省略可）
                altFilter: null, // 設定されていると絞り込み処理をこの関数で実行　kakaku等で使用（省略可）
                matchSelector:"", // 設定されているとDOMNodeInserted時このセレクタに.matches()しない要素の追加は無視する（省略可）
                observeNodeF: null, // 設定されているとdocument.bodyではなくこの関数がreturnしたノードを監視する　監視する範囲を狭めて高速化を企図（省略可）
                func:null, // 設定されているとページ開始後最初にfunc()を実行（省略可）　これがtruthyを返すと動作を停止する
                keepLookingAt:null, // 設定されているとShift+Sの処理後に画面の縦スクロール位置をこの関数が返した要素の画面中心にあるものをなるべく維持しようとする　縦に並ぶコンテンツ等を返す（省略可）
        }*/
  ];

  // match文を生成 *不完全
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

  // thissiteを決定
  var thissite = null;
  var SITE;
  thissite = decideThissite();
  if (thissite === null) return;

  function decideThissite() {
    thissite = null;
    for (var i = 0; i < SITEINFO.length; i++) {
      if (SITEINFO[i].url === "") break;
      if ((typeof SITEINFO[i].url == "function" && SITEINFO[i].url()) || (typeof SITEINFO[i].url != "function" && location.protocol != "file:" && location.href.match(SITEINFO[i].url))) {
        //if (typeof SITEINFO[i].url == "function" && SITEINFO[i].url() || location.href.match(SITEINFO[i].url)) {
        //      if (SITEINFO[i].url.test(location.href)) {
        if (SITEINFO[i].url === "//.*" && EXPERT == 0) return null;
        thissite = i;
        SITE = SITEINFO[i]
        break;
      }
    }
    return thissite;
  }

  if (LogMatch) console.log(SITEINFO[thissite]);
  if (debug > 2) alert(JS(SITE))

  if (EXPERIMENTAL_WAITELEMENT_ALWAYS) {
    if (SITE.waitElement === undefined) SITE.waitElement = 100;
    SITE.ignoreAbsenceOfItem = 1
  }
  //  if (SITE.func) SITE.func()
  if (SITE.func && SITE.func()) return;

  GM_addStyle(`.gksiAttract {
        outline:4px solid #8718;
        background:#8712;
        }`) // box-shadow:0px 0px 4px 4px #92f, inset 0 0 100px #fe2;
  //        transition:background 0.2s;


  var observeNode = SITE.observeNodeF ? SITE.observeNodeF() || document.body : document.body
  var currentHighlightKey = HIGHLIGHT_KEY || SITE.highlightKey;

  //URL遷移を監視
  var href = location.href;
  var observer = new MutationObserver(function(mutations) {
    if (href !== location.href) {
      href = location.href;
      GF?.dni?.();
      //shibo("");//いらないかも
      $(document).off('keydown.shibo');
      $("#shiboButton").off("mouseout.shibo")
      $(".shibo").remove();
      thissite = decideThissite();
      if (thissite === null) return;
      if (SITE?.waitElement) {
        while (waitTimerA.length) { clearTimeout(waitTimerA.pop()) }
        //waitElement(SITE?.filterPlace, () => waitElement(SITE?.filterItem, () => run(), SITE?.waitElement), SITE?.waitElement)
        setTimeout(() => { waitElement(SITE?.filterPlace, () => waitElement(SITE?.filterItem, () => run(), SITE?.waitElement), SITE?.waitElement) }, 1500)
        //        setTimeout(() => { waitElement(SITE?.filterPlace, () => run(), SITE?.waitElement) }, 2000 + SITE?.waitElement)
      } else {
        if (shiboDNIevent && SITE.observeURL) setTimeout(() => { run("url"); }, 1500)
        for (let i = 0; i < (SITE.observeURL || 1) + 0; i++) setTimeout(run, 1000 + i * 1000);
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });

  if (SITE?.waitElement) {
    waitElement(SITE?.filterPlace, () => waitElement(SITE?.filterItem, () => run(), SITE?.waitElement), SITE?.waitElement)
  } else {
    if (SITE.delayAutoWeighting) SITE.delay = Math.min(4000, Math.max(SITE.delay || 0, WAIT * SITE.delayAutoWeighting))
    setTimeout(() => { run() }, SITE.delay || 0);
  }
  return;

  function waitElement(xpath, cb, interval = 1000) {
    let ea = elegetaG(xpath).filter(e => e.offsetHeight)
    if (ea.length) { cb(ea) } else { waitTimerA.push(setTimeout(() => waitElement(xpath, cb, Math.min(interval + 100, 4000)), interval)) }
  }

  function waitDisappearElement(xpath = "", cb = () => {}, interval = 1000) {
    if (xpath == "") { while (waitTimerB.length) { clearTimeout(waitTimerB.pop()) }; return }
    let ea = elegetaG(xpath).filter(e => e.offsetHeight)
    if (!ea.length) { cb(ea) } else { waitTimerB.push(setTimeout(() => waitDisappearElement(xpath, cb, Math.min(interval + 100, 4000)), interval)) }
  }

  function dni(node, callback) {
    const observerDni = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          mutation?.addedNodes?.forEach(e => {
            callback.handleEvent(e)
          })
        }
      });
    });
    observerDni.observe(document, { childList: true, subtree: true });
    return () => observerDni.disconnect();
    //GF.dni = ()=>observerDni.disconnect();
    return
  }

  function run(mode) {
    $(".shibo").remove();
    $(document).off('keydown.shibo');
    $("#shiboButton").off("mouseout.shibo")
    if (shiboDNIevent || mode === "url") {
      GF?.dni?.()
      //        observeNode.removeEventListener('DOMNodeInserted', shiboDNIevent);
      document.body.removeEventListener('yhmMyMemoRemoved', shiboDNIevent);
      shiboDNIevent = null;
      shibo("");
    }

    thissite = decideThissite();
    if (thissite === null) return;

    const tips = "Tips:\n「ABCやDEFを含まず、GHIかJKLを含み、かつMNOとPQRも含む」\n!ABC|DEF GHI|JKL MNO PQR\n";
    if (!SITE.filterSampleWord) SITE.filterSampleWord = () => ""; //SITE?.filterSampleWord|| (()=>"");
    if (SITE.funcOnRun) SITE.funcOnRun();

    //チョクバイ！住所一覧ボタン
    $('<span style="cursor:pointer; text-align:center; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:14px; font-weight:normal; color:#606060; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4);" >住所一覧をクリップボードにコピー</span>').appendTo(xa('//div[@class="result-main"]/div/table/tbody/tr/td/h3')).on('click', function(e) {
      if ($(xa(SITE.mapPlace))) {
        var maplist = [];
        $(xa(SITE.mapPlace)).each(function() {
          maplist.push($(this).text().trim().replace(/\s|地図|付近/gmi, ""));
        })
        maplist = Array.from(new Set(maplist)).sort();
        alert(Array.from(new Set(maplist)).sort().join("\r\n"));
        GM.setClipboard(Array.from(new Set(maplist)).sort().join("\r\n"));
      }
    })

    //地図検索機能
    if ($(xa(SITE.mapPlace))) $(xa(SITE.mapPlace)).each(function() { $(this).append("<a class='shibo' style='text-align:center; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:14px; font-weight:normal; color:#606060; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4); float:right;' rel=\"noopener noreferrer nofollow\" href='https://www.google.co.jp/maps/search/" + $(this).text().replace(/\s+/gmi, "") + "'>地図</a>"); });

    //検索窓設置場所があり、対象項目が１つでもあるもしくはignoreAbsenceOfItem:1なら
    //if(debug>1){console.log(`(SITE.filterItem).length:${$(xa(SITE.filterItem)).length}`)}
    if (($(xa(SITE.filterItem)).length || SITE.ignoreAbsenceOfItem)) {

      function shiboPrompt(key, guide = 0) {
        /*        if (guide) {
                  var target = $.makeArray(xa(SITE.filterItem));
                  var targetVisible = $(target).filter(":visible").length;
                  var targetAll = $(target).length;
                  target.forEach(e => debugEle(e, 1));
                }
        */
        var targetAll = elegeta(SITE.filterItem).length;
        var targetVisible = elegeta(SITE.filterItem).filter(v => v.offsetHeight).length;
        var count = targetAll ? `現状：${targetVisible}/${targetAll}（表示中/全体）\n\n` : "";

        let inival = pref("defWord") || "";
        let sel = S_INCLUDE_SELECTION ? window.getSelection().toString().trim() || "" : "";
        inival = `${inival}${inival&&sel?"|":""}${sel}`;

        //requestAnimationFrame(()=>{requestAnimationFrame(()=>{//setTimeout(() => {
        var kw = prompt(count + "絞り込みキーワード（正規表現）を入力\n" + `${sel?`\n※選択中の文字列 『${sel}』 が最後に追加されています\n`:""}` + "\n例：\n" + (SITE?.filterSampleWord() ? SITE?.filterSampleWord() + "\n" : "") + /*"\n\n現在値：\n" + (pref("defWord") || "") +*/ "\n履歴" + "（" + getHistoryKey() + "）：\n" + (pref("defWordLog") || []).slice(0, historyLen).join("\n") + "\n\n" + tips + "\n" + (searRE ? "最後の正規表現：\n" + searRE.replace(/\\/g, "\\") : "\n"), inival);

        //requestAnimationFrame(()=>{requestAnimationFrame(()=>{//setTimeout(() => {
        //        var kw = prompt(count + "絞り込みキーワード（正規表現）\n\n例：\n" + (SITE?.filterSampleWord() ? SITE?.filterSampleWord() + "\n" : "") + /*"\n\n現在値：\n" + (pref("defWord") || "") +*/ "\n履歴" + "（" + getHistoryKey() + "）：\n" + (pref("defWordLog") || []).slice(0, historyLen).join("\n") + "\n\n" + tips + "\n" + (searRE ? "最後の正規表現：\n" + searRE.replace(/\\/g, "\\") : "\n"), pref("defWord") || "");
        //if (guide) $.makeArray(xa(SITE.filterItem)).forEach(e => debugEle(e, 2));
        if (kw !== null) {
          shibo(prefl("defWord", kw), key);
          $("#sear").val(kw || "");
        } else {
          shibo("");
          $("#sear").val(kw || "");
        }
        //})})//, 1) // chromeでは遅らせないとguideが効かない // でもこれをするとすごく待たされる時がある
      }

      if (debug) {
        $.makeArray(xa(SITE.filterItem)).forEach(e => debugEle(e));
        $.makeArray(xa(SITE.filterPlace)).forEach(e => debugEle(e));
      }

      // 絞り込みフォームを付ける
      $("#shiboButton").off("mouseout.shibo")
      var form = $(`<span ID="shiboButton" class="ignoreMe shibo" title="S or Shift+Alt+S" style="max-height:1em; ${SITE?.styleAll||""} cursor:pointer; background-color:#999999; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:13px; font-weight:500; color:#ffffff; margin:0px 2px;  text-decoration:none; text-align:center; padding:1px 5px 1px; border:outset #909090 0px; border-radius:5px;  ${SITE?.styleL||""}">絞り込み(s)</span><input class="ignoreMe shibo" style="${SITE?.style||"width:80%;"} max-height:1em !important; ${SITE?.styleAll||""} ${SITE?.styleR||""}"  type="text" id="sear" accesskey="s" title="${ tips}" Placeholder="例）${(SITE?.filterSampleWord()||"")}">`);
      if ($(xa(SITE.filterPlace)).length) { form.insertAfter($(xa(SITE.filterPlace)).first()); } else { form.prependTo($("body")) }
      $("#shiboButton").on("mouseenter.shibo", () => {
        elegeta(SITE.filterItem).filter(v => v.offsetHeight).forEach(e => e.classList.add("gksiAttract")); //elegeta(SITE.filterItem).filter(v=>v.offsetHeight).forEach(e => debugEle(e, 1));
      })
      $("#shiboButton").on("mouseout.shibo", () => {
        elegeta(".gksiAttract").forEach(e => e.classList.remove("gksiAttract")); //elegeta(SITE.filterItem).filter(v=>v.offsetHeight).forEach(e => debugEle(e, 2));
      })

      $("#shiboButton").click(() => {
        GF.hl = 0;
        shiboPrompt("s", 1)
      });
      $("#shiboButton").contextmenu((e) => {
        if (!currentHighlightKey) return;
        GF.hl = 1;
        shiboPrompt(currentHighlightKey, 1);
        e.stopPropagation();
        return false;
      });
      $("#sear").change(() => {
        GF.hl = 0;
        shibo(prefl("defWord", $("#sear").val()))
      });

      // 絞り込みショートカットキーイベントを設定
      $(document).off('keydown.shibo').on('keydown.shibo', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || (inYOUTUBE && (document.activeElement.closest('#chat-messages') || document.activeElement.closest('ytd-comments-header-renderer')))) return;
        var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
        if (!(SITE.disableKey) && (key === HIGHLIGHT_KEY || key === SITE.highlightKey || key == "s") && ($(xa(SITE.filterPlace)).length && ($(xa(SITE.filterItem)).length > 0 || SITE?.ignoreAbsenceOfItem)) && !eleget0(':is(a>img,video):hover')) { // s::
          GF.hl = (key === HIGHLIGHT_KEY || key === SITE.highlightKey);
          shiboPrompt(key);
          e.stopPropagation();
          return false;
        }
        if (!(SITE.disableKey) && (key === HIGHLIGHT_KEY || key === SITE.highlightKey || key == "Shift+S") && ($(xa(SITE.filterPlace)).length && ($(xa(SITE.filterItem)).length > 0 || SITE?.ignoreAbsenceOfItem))) { // Shift+S::
          GF.hl = (key === HIGHLIGHT_KEY || key === SITE.highlightKey);
          $("#sear").val(
            (SITE?.filterSampleWord()) ?
            $("#sear").val() ? "" : SITE?.filterSampleWord() || "" :
            $("#sear").val() ? "" : pref("defWordLog")?.[0] || ""
          )
          popup($("#sear").val() || "解除")

          let ch2 = clientHeight() / 2
          let prepos = SITE?.keepLookingAt && SITE.keepLookingAt().map(v => {
            return { e: v, re: v.getBoundingClientRect() }
          }).sort((a, b) => {
            return Math.abs(ch2 - (a.re.top + a.re.height / 2)) - Math.abs(ch2 - (b.re.top + b.re.height / 2))
          }) // 画面の中心に近い順にソート

          let cenEle = prepos?.find(v => v.e.offsetHeight)?.e || prepos?.[0]?.e;
          cenEle?.animate([{ outline: "6px solid #00ff0000" }, { outline: "6px solid #0f0", backgroundColor: "#00ff0010" }, { outline: "6px solid #0f0", backgroundColor: "#00ff0010" }, { outline: "6px solid #00ff0000" }], 666)

          shibo($("#sear").val())
          prepos && setTimeout(() => { prepos?.find(v => v.e.offsetHeight)?.e?.scrollIntoView({ behavior: "instant", block: "center", inline: "center" }); }, 220)

          e.stopPropagation();
          return false;
        }
      });
    }
    return;


    function prefl(name, store = undefined, logLen = historyLenMax) { // prefl(name,data,len)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）・"name+Log"にlen個の履歴保存、pref(name)で読み出し
      if (store === undefined) { // 読み出し
        return pref(name);
      } else { // 書き込み、削除
        if (store) {
          var a = pref(name + "Log") || [];
          a.unshift(store);
          a = [...new Set(a)];
          pref(name + "Log", a.slice(0, logLen));
        }
        return pref(name, store);
      }
    }

    function pref(name, store = undefined) { // pref(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、pref(name)で読み出し
      var domain = getHistoryKey(); //SITE.id || location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1] || location.href;
      if (store === undefined) { // 読み出し
        let data = GM_getValue(domain + " ::: " + name);
        if (data == undefined) return store; // 値がないなら終わり
        //        if (data.substr(0, 1) === "[") { // 配列なのでJSONで返す
        if (isJSON(data)) { // 配列JSONなので配列で返す //?
          try { return JSON.parse(data || '[]'); } catch (e) {
            alert("（読み出し）データベースがバグってるのでクリアします\n" + e);
            pref(name, null);
            return null;
          }
        } else return data;
      }
      if (store === "" || store === [] || store === null) { // 書き込み、削除
        GM_deleteValue(domain + " ::: " + name);
        return store;
      } else if (typeof store === "string") { // 書き込み、文字列b
        GM_setValue(domain + " ::: " + name, store);
        return store;
      } else { // 書き込み、配列
        try { GM_setValue(domain + " ::: " + name, JSON.stringify(store)); } catch (e) {
          alert("（書き込み）データベースがバグってるのでクリアします\n" + e);
          pref(name, "");
          return null;
        }
        return store;
      }
      //      return store;
    }
  }

  //絞り込む
  //DOM追加を監視
  function shibo(sear = "", key = "s") { // フォームEnterかS,Hキーの入り口
    searchW = sear
    if (shiboTimer) {
      clearTimeout(shiboTimer);
      shiboTimer = null;
    }
    if (sear === "deleteall") {
      if (confirm(getHistoryKey() + "のページの履歴をすべて削除します。よろしいですか？")) {
        pref("defWordLog", null);
        pref("defWord", null)
        searchW = ""
      }
      return;
    }
    if (sear === "") {
      if (shiboDNIevent) {
        GF?.dni?.() //dni(observeNode, shiboDNIevent)
        //observeNode.removeEventListener('DOMNodeInserted', shiboDNIevent);
        document.body.removeEventListener('yhmMyMemoRemoved', shiboDNIevent);
        shiboDNIevent = null;
      }
      shibo3("", key);
    } else { // 絞り込みキーワードを処理
      shibo3(sear, key);
      if (shiboDNIevent) {
        GF?.dni?.() //dni(observeNode, shiboDNIevent)
        //        observeNode.removeEventListener('DOMNodeInserted', shiboDNIevent);
        document.body.removeEventListener('yhmMyMemoRemoved', shiboDNIevent);
      }
      //        shiboDNIevent = { handleEvent: shibo2, arg1: sear, arg2: key, arg3: (typeof SITE?.dniWait=="function"?SITE?.dniWait():SITE?.dniWait + 200) || 200 };
      shiboDNIevent = { handleEvent: shibo2, arg1: sear, arg2: key, arg3: (typeof SITE?.dniWait == "function" ? SITE?.dniWait : SITE?.dniWait + 200) || 200 };
      GF.dni = dni(observeNode, shiboDNIevent)
      //    observeNode.addEventListener('DOMNodeInserted', shiboDNIevent, false);
      document.body.addEventListener('yhmMyMemoRemoved', shiboDNIevent, false);
      //}
    }
  }

  function shibo2(e) { // dniイベントで飛んでくる場合の入り口
    if (e?.target) e = e?.target;
    /*    if (this.arg2 === currentHighlightKey || e.target.tagName === "BR" || (e.target.classList && e.target.classList.contains("ignoreMe"))) return; // ハイライトループを防ぐためハイライトでは監視で再実行しない
        if (e?.target?.nodeType != 1 || (SITE?.matchSelector && !e?.target?.matches(SITE.matchSelector))) return;
    */
    if (this.arg2 === currentHighlightKey || e.tagName === "BR" || (e.classList && e.classList.contains("ignoreMe"))) return; // ハイライトループを防ぐためハイライトでは監視で再実行しない
    if (e?.nodeType != 1 || (SITE?.matchSelector && !e?.matches(SITE.matchSelector))) return;
    shibo3(this.arg1, this.arg2, this.arg3);
  }

  function shibo3(sear = "", key = "s", delay = 0) {
    var node = document;
    if (shiboTimer) return;

    if (typeof delay == "function") { delay = delay(); }
    delay = delay ? delay + 200 : 0;
    //console.log(gettime()+" "+delay)

    shiboTimer = setTimeout(function() {
      if (!($(xa(SITE.filterPlace)) && ($(xa(SITE.filterItem)).length > 0 || SITE?.ignoreAbsenceOfItem))) return;
      searRE = sear.replace(/^S$/, "yhmMyMemoO").replace(/^S([\s　\|｜])/, "yhmMyMemoO$1").replace(/([\s　\|｜!！])S([\s　\|｜])/, "$1yhmMyMemoO$2").replace(/([\s　\|｜!！])S$/, "$1yhmMyMemoO").replace(/^s$/, "yhmMyMemoX").replace(/^s([\s　\|｜])/, "yhmMyMemoX$1").replace(/([\s　\|｜!！])s([\s　\|｜])/, "$1yhmMyMemoX$2").replace(/([\s　\|｜!！])s$/, "$1yhmMyMemoX").replace(/｜/gm, "|").replace(/^[\!|！](\S*)/, "^(?!.*($1)).*").replace(/(\S*)[ 　](\S*)/gm, "^(?=.*($1))(?=.*\($2\))").replace(/\s|　/gm, ".*"); //alert(searRE); // 独自構文を正規表現に変換

      if (SITE.altFilter) { SITE.altFilter(searRE) } else {
        try {
          elegetaG('.gcshl').forEach(e => e.outerHTML = e.innerHTML);
          if ((GF.hl || key === currentHighlightKey) && sear && observeNode.innerText.match(new RegExp(searRE, "gmi"))) {
            (SITE.highlightXP ? elegetaG(SITE.filterItem).map(p => eleget0(SITE.highlightXP, p)).filter(c => c) : elegetaG(SITE.filterItem))
            .forEach(e => { e.innerHTML = e.innerHTML.replace(new RegExp("(" + searRE + ")(?!([^<]+)?>)", "gmi"), `<span class="gcshl" style="background-color:#ffff00">$1</span>`); });
          } // 5ch/mp4等動画を含むと繰り返す

          var eles = $.makeArray(xa(SITE.filterItem, node))
          var len = eles.length;
          if (SITE.fastShow && SITE.fastShow < len && sear === "") {
            eles.forEach(e => {
              //e.style.display = null
              gmDataList_remove(e, "gmHideBygakusai")
              if (!gmDataList_includesPartial(e, 'gmHideBy')) e.style.display = null //ele.show(0);
            })
          } else {
            eles.forEach(e => {
              var ele = $(e);
              let etext = (e.textContent.replace(/\r|\n|\s/gm, " ") + (e.querySelector(".yhmMyMemoO") ? " yhmMyMemoO" : "") + (e.querySelector(".yhmMyMemoX") ? " yhmMyMemoX" : "") + (e.querySelector('[data-gakusai="1"]') ? " specialFlag" : ""))
              if (((!(etext.match(new RegExp(searRE, "gmi")))) && !e.closest(".ignoreFilter"))) {
                gmDataList_add(e, "gmHideBygakusai")
                SITE.important ? ele.attr("style", "display:none !important;") :
                  len < 50 ? ele.hide(200) : len > 200 ? ele.hide() : ele.fadeOut(200);
              } else {
                gmDataList_remove(e, "gmHideBygakusai")
                if (!gmDataList_includesPartial(e, 'gmHideBy')) {
                  len < 50 ? ele.show(200) : len > 200 ? ele.show() : ele.fadeIn(200);
                }
              }
            })
          }
        } catch (e) {
          alert("おそらく正規表現の構文エラーです\n" + searRE + "\n" + e);
          shibo("");
        }
      }
      shiboTimer = 0;
      if (typeof SITE.filterFunc === "function") setTimeout(() => { SITE.filterFunc(); }, (len <= 200 && SITE.filterFuncDelay) ? 300 : 0) // サイトごとの特殊処理があれば
    }, delay); // DNI時のウェイトでもある
  }

  function isJSON(data) {
    try { JSON.parse(data) } catch { return false }
    return true;
  }

  function getHistoryKey() {
    return location?.protocol == "file:" ? "file" : (SITE?.id || location?.href?.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)?.[1] || location?.href) || "";
  }

  function xa(xpath, node = document) {
    if (!xpath) return [];
    if (xpath.match(/^\//)) {
      try {
        var array = [];
        var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < ele.snapshotLength; i++) array[i] = ele.snapshotItem(i);
        return array;
      } catch (e) { return []; }
    } else {
      return $(xpath);
    }
  }

  function proInput(prom, defaultval, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    return Math.min(Math.max(
      Number(window.prompt(prom, defaultval).replace(/[Ａ-Ｚａ-ｚ０-９．]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 65248); }).replace(/[^-^0-9^\.]/g, "")), min), max);
  }

  function elegetaG(xpath, node = document) {
    if (!xpath || !node) return [];
    let flag
    if (!/^\.?\//.test(xpath)) return /:visible$/.test(xpath) ? [...node.querySelectorAll(xpath.replace(/:visible$/, ""))].filter(e => e.offsetHeight) : [...node.querySelectorAll(xpath)]
    try {
      var array = [];
      var ele = document.evaluate("." + xpath.replace(/:visible$/, ""), node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      let l = ele.snapshotLength;
      for (var i = 0; i < l; i++) array[i] = ele.snapshotItem(i);
      return /:visible$/.test(xpath) ? array.filter(e => e.offsetHeight) : array;
    } catch (e) { popup3(e + "\n" + xpath, 1); return []; }
  }

  /*  function eleget0(xpath, node = document) {
      if (!xpath || !node) return null;
      let inscreen = 0
      let visible = 0
      if (/:inscreen/.test(xpath)) {
        inscreen = 1;
        xpath = xpath.replace(/:inscreen/, "")
      }
      if (/:visible/.test(xpath)) {
        visible = 1;
        xpath = xpath.replace(/:visible/, "")
      }
      if (!/^\.?\//.test(xpath)) var ele = node.querySelector(xpath)
      else try {
        var eles = document.evaluate("." + xpath.replace(/:visible$/, ""), node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if (eles.snapshotLength > 0) var ele = eles.snapshotItem(0);
        else return null;
      } catch (e) {
      //alert(e + "\n" + xpath + "\n" + JSON.stringify(node));
       return null; }
      if (inscreen) { var eler = ele.getBoundingClientRect(); if (!(eler.top > 0 && eler.left > 0 && eler.left < document.documentElement.clientWidth && eler.top < document.documentElement.clientHeight)) return null }
      if (visible) { if (!ele.offsetHeight) return null }
      return ele
    }
  */
  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    if (xpath == "cacheon") {
      elegeta.cache = [];
      elegeta.cacheon = true;
      return
    } else if (xpath == "cacheoff") {
      elegeta.cache = [];
      elegeta.cacheon = false;
      return
    }
    if (elegeta.cacheon) {
      let cache = elegeta.cache.find(v => v.xpath == xpath && v.node == node)
      if (cache) { //console.log("use cache");
        return cache.array;
      }
    }
    //if (typeof xpath === "function") return xpath() // !!!
    if (Array.isArray(xpath)) {
      let array = xpath.map(v => elegeta(v, node)).filter(v => v.length).flat();
      elegeta.cacheon && elegeta.cache.push({ xpath, node, array });
      return array;
    }
    //    let xpath2 = xpath.replace(/:inv?screen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let xpath2 = xpath.replace(/:inscreen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        //        var snap = document.evaluate("." + xpath2, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null)
        var snap = document.evaluate("." + xpath2, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        let l = snap.snapshotLength
        for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i)
      }
      if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight)
      //if (/:invscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.top <= document.documentElement.clientHeight) }) // 画面縦内に1ピクセルでも入っている
      if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\n2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return []; }
    //} catch (e) { return []; }
    elegeta.cacheon && elegeta.cache.push({ xpath, node, array });
    return array;
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (xpath == "cacheon") {
      eleget0.cache = [];
      eleget0.cacheon = true;
      return
    } else if (xpath == "cacheoff") {
      eleget0.cache = [];
      eleget0.cacheon = false;
      return
    }
    if (eleget0.cacheon) {
      let cache = eleget0.cache.find(v => v.xpath == xpath && v.node == node)
      if (cache) { //console.log("0 use cache");
        return cache.array;
      }
    }
    //if (typeof xpath === "function") return xpath() // !!!
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) {
      let array = node.querySelector(xpath);
      eleget0.cacheon && eleget0.cache.push({ xpath, node, array });
      return array
    }
    try {
      //      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      var ele = document.evaluate("." + xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let array = ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
      eleget0.cacheon && eleget0.cache.push({ xpath, node, array });
      return array;
    } catch (e) { alert(`XPath/CSS構文にエラーがあるかもしれません\n2023/12以前にインストールしたFirefoxを使っている場合はabout:configでlayout.css.has-selector.enabled を true にすると解決するかもしれません\n\n${e}\n\n${xpath}`); return null; }
    //} catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function debugEle(ele, command = debug) {
    if (command === 1) {
      let col = getColorFromText(ele.textContent);
      buStyle(ele, "outline", "3px dotted " + col)
      buStyle(ele, "boxShadow", " 0px 0px 4px 4px " + col + "30, inset 0 0 100px " + col + "20")
    }
    if (command === 2) {
      buStyle(ele, "outline")
      buStyle(ele, "boxShadow")
    }
  }

  function buStyle(ele, key, data = "RESTORE") { // dataがあれば書き込み、なければ回復
    if (data === "RESTORE") {
      if (ele.getAttribute(`${key}Backup`) !== "") { ele.style[key] = ele.getAttribute(`${key}Backup`) } else { ele.style[key] = null }
      ele.removeAttribute(`${key}Backup`)
      if (ele.getAttribute(`styleBackup`) === null) { ele.removeAttribute("style") }
    } else {
      if (!ele.getAttribute(`${key}Backup`)) {
        ele.setAttribute(`${key}Backup`, ele.style[key])
        ele.setAttribute(`styleBackup`, ele.getAttribute("style"))
      }
      ele.style[key] = data;
    }
  }

  function getColorFromText(str) {
    var col = 0;
    for (letter of str) { col = (col + str.charCodeAt(letter) * 2097152) % 0xffffff; }
    return '#' + (0x1000000 + col).toString(16).substr(1, 6);
  }

  function notifyMe(body, title = "") {
    if (!("Notification" in window)) return;
    else if (Notification.permission == "granted") new Notification(title, { body: body });
    else if (Notification.permission !== "denied") Notification.requestPermission().then(function(permission) {
      if (permission === "granted") new Notification(title, { body: body });
    });
  }

  function alertj(title = "", data, debug = debug || 0) {
    let output = ""; //Object.keys({data})[0]+"\n"
    output += typeof data + "\n"
    if (typeof data == "object") { output += JSON.stringify(data) } else { output += data }
    //    if(debug)alert(output)
    if (debug) popup(title + "<br>" + output.replace(/\n/gmi, "<br>"))
  }

  function popup(text, bgcolor = text == "解除" ? "#888" : "#35a") {
    if (!text) return
    text = String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/gm, "<br>")
    let e = end(document.body, `<span class="ignoreMe gkscbox" style="all:initial; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity:1; z-index:2147483647; font-weight:bold; margin:0px 1px; text-decoration:none !important; padding:2em 3em; border-radius:12px; background-color:${bgcolor}; color:white; " >${text}</span>`)
    e.onclick = v => {
      GM.setClipboard(v.target.innerText);
      v.target.innerText = `「${v.target.innerText}」をクリップボードにコピーしました`
    }
    $(e).hide(0).fadeIn(155, (function(e) { return function() { setTimeout(() => { $(e).fadeOut(155, () => $(e).remove()) }, 111) } })(e))
  }

  function sani(s) { return s?.replace(/&/g, "&amp;")?.replace(/"/g, "&quot;")?.replace(/'/g, "&#39;")?.replace(/`/g, '&#x60;')?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;") || "" }

  function before(e, html) { e?.insertAdjacentHTML('beforebegin', html); return e?.previousElementSibling; }

  function begin(e, html) { e?.insertAdjacentHTML('afterbegin', html); return e?.firstChild; }

  function end(e, html) { e?.insertAdjacentHTML('beforeend', html); return e?.lastChild; }

  function after(e, html) { e?.insertAdjacentHTML('afterend', html); return e?.nextElementSibling; }

  function lh(re) { let tmp = location.protocol == "file:" ? null : location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function ld(re) { let tmp = location.protocol == "file:" ? null : location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  //function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  //function ld(re) { let tmp = location.hostname.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function clientHeight() { return Math.min(document.documentElement.clientHeight, window.innerHeight) }

  function clientWidth() { return document.documentElement.clientWidth }

  // element.dataset.gmDataListプロパティにclassList.add/removeのような命令セット
  function gmDataList_add(ele, name) {
    let data = new Set(ele?.dataset?.gmDataList?.split(" ") || []);
    if (!data.has(name)) {
      data.add(name);
      ele.dataset.gmDataList = [...data].join(" ")
    }
  }

  function gmDataList_remove(ele, name) {
    let data = new Set(ele?.dataset?.gmDataList?.split(" ") || []);
    if (data.has(name)) {
      data.delete(name)
      if (data.size) ele.dataset.gmDataList = [...data].join(" ");
      else delete ele.dataset.gmDataList;
    }
  }

  function gmDataList_includesPartial(ele, name) { // *[class*="name"]のような部分一致
    let data = [...new Set(ele?.dataset?.gmDataList?.split(" ") || [])];
    return data.find(v => v.includes(name))
  }

  function gmhbShow(e, id) {
    gmDataList_remove(e, `gmHideBy${id}`)
    if (!gmDataList_includesPartial(e, 'gmHideBy')) $(e).show(333)
  }

  function gmhbHide(e, id) {
    gmDataList_add(e, `gmHideBy${id}`)
    $(e).hide(333)
  }

  function gettime(_fmt = 'YYYY/MM/DD hh:mm:ss.iii', _dt = new Date()) {
    return [
      ['YYYY', _dt.getFullYear()],
      ['MM', _dt.getMonth() + 1],
      ['DD', _dt.getDate()],
      ['hh', _dt.getHours()],
      ['mm', _dt.getMinutes()],
      ['ss', _dt.getSeconds()],
      ['iii', _dt.getMilliseconds()],
    ].reduce((s, a) => s.replace(a[0], `${a[1]}`.padStart(a[0].length, '0')), _fmt)
  }

  function JS(v) { try { return JSON.stringify(v) } catch { return null } }

  function JP(v) { try { return JSON.parse(v) } catch { return null } }

})();