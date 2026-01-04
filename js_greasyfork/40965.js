// ==UserScript==
// @name         Amazonを基点に好みに合う漫画を探しやすくする
// @description  Amazon等の書名や著者名に類似漫画検索、Web漫画アンテナ、試し読み、Calilを検索するリンクを追加します　Shift+L:calil検索都道府県変更　.:上限価格指定　%:割引率指定　y:本の出版年下限指定　u:amazon.comで開く
// @version      0.5.14
// @match  *://ruijianime.com/comic/ruiji/ruiji.php\?title=*
// @match  *://ruijianime.com/comic/keyword/*
// @match  *://ruijianime.com/comic/title/*
// @match  *://ruijianime.com/*
// @match *://www.amazon.co.jp/*
// @exclude *://www.amazon.co.jp/*/cart/*
// @exclude *://www.amazon.co.jp/*/buy/*
// @exclude *://www.amazon.co.jp/*/huc/*
// @exclude *://www.amazon.co.jp/*/css/*
// @exclude *://www.amazon.co.jp/ap/*
// @exclude *://www.amazon.co.jp/gp/*
// @exclude *://www.amazon.co.jp/auto-deliveries*
// @match  *://webcomics.jp/*
// @match  *://www.suruga-ya.jp/search\?*
// @match  *://calil.jp/local/search\?*
// @match  *://www.amazon.co.jp/s/*
// @match  *://manga.nicovideo.jp/comic/*
// @match  *://manga.nicovideo.jp/watch/mg*
// @match  *://sokuyomi.jp/product/*
// @match  *://sinkan.net/*
// @match *://alternativeto.net/software/*
// @match *://alternativeto.net/browse/*
// @match *://www.slant.co/options/*
// @match *://www.slant.co/improve/topics/*
// @match *://www.slant.co/topics/*
// @match *://www.slant.co/*
// @match *://www.nicovideo.jp/user/*
// @match *://www.majorgeeks.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM.setClipboard
// @noframes
// @run-at document-idle
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/40965/Amazon%E3%82%92%E5%9F%BA%E7%82%B9%E3%81%AB%E5%A5%BD%E3%81%BF%E3%81%AB%E5%90%88%E3%81%86%E6%BC%AB%E7%94%BB%E3%82%92%E6%8E%A2%E3%81%97%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/40965/Amazon%E3%82%92%E5%9F%BA%E7%82%B9%E3%81%AB%E5%A5%BD%E3%81%BF%E3%81%AB%E5%90%88%E3%81%86%E6%BC%AB%E7%94%BB%E3%82%92%E6%8E%A2%E3%81%97%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {

  const AMAZON_SELECT_SIZE_ANYWAY = 0; // 1:Amzonで服等でサイズが無選択だったら値段や出荷元を出すためにとりあえず最初のサイズを選択する
  const otherChecker = function(cusRev, amazonDP) { $(cusRev).parent().after(`<a class="amamanga ignoreMe" title="${amazonDP[2]}" ${linkStyle2} href="https://sakura-checker.jp/search/${amazonDP[2]}">ｻｸﾗﾁｪｯｶｰ</a>`); };
  const debug = 0;

  var aldone = [];
  var onlyprime = 0;

  String.prototype.match0 = function(re) { let tmp = this.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
  function adja(place = document.body, pos, html) {
    return place ? (place.insertAdjacentHTML(pos, html), place) : null;
  }

  if (location.href.match(/:\/\/shinkan\.net/)) { // 「新しいタブで開く」指定を外す
    for (var i = eleget('//a[@target="_blank"]').snapshotLength; i--;) ele.snapshotItem(i).removeAttribute("target");
    return;
  }

  var GF = {};
  var setAH = new Set();
  var calilpref = pref("calilpref") || "tokyo";
  var webmangaantena = '<a href="https://webcomics.jp/search?q=***" onclick="arguments[0].stopPropagation()">Web漫画アンテナ</a>';
  var webmangaantenasakusha = '<a href="https://webcomics.jp/search?q=***" onclick="arguments[0].stopPropagation()">Web漫画アンテナ</a>';
  var tameshiyomi = '<a href="https://duckduckgo.com/?q=!ducky+***%20+%E8%A9%A6%E3%81%97%E8%AA%AD%E3%81%BF%20-dokidokivisual.com">試し読み</a>';

  var ruijimanga = '<a href="http://ruijianime.com/comic/ruiji/ruiji.php?title=***">類似漫画検索</a>';
  var ruijianime = '<a href="http://ruijianime.com/main/ruiji.php?title=***">類似アニメ検索</a>';
  var caariru = '<a href="https://calil.jp/local/search?csid=' + calilpref + '&q=***"onclick="arguments[0].stopPropagation()">Calil</a>';
  var amazon = '<a href="https://duckduckgo.com/?q=!ducky+***+site:www.amazon.co.jp">Amazon</a>';
  var sukima = '<a href="https://www.sukima.me/book/search/?keyword=***">スキマ</a>';
  var toshokanz = '<a href="https://www.mangaz.com/title/index?category=&query=***&sort=&search=input">マンガ図書館Z</a>';
  var pixiv = '<a href="' + (Math.random() > 0.5 ? 'https://www.google.co.jp/search?btnI=I%27m+Feeling+Lucky&q=***+site:www.pixiv.net' : 'https://duckduckgo.com/?q=!ducky+*** site:www.pixiv.net') + '">pixiv</a>';

  var linkStyle = " class=\"amamanga ignoreMe\" rel=\"noopener noreferrer nofollow\" style='all:initial; cursor:pointer; display: inline-block; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:13px; font-weight:normal; color:#606060; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4); ";
  var linkStyle2 = `${linkStyle}'`;

  //  var ddgTrans='<a '+linkStyle+'\' href="https://translate.google.com/translate?u=https://duckduckgo.com/?q=***&hl=ja&langpair=auto|ja&tbb=1&ie=">**2</a>';
  var ddgTrans = '<a ' + linkStyle + '\' href="https://duckduckgo.com/?q=***">**2</a>';

  const SITE = [
    /*{
          url: '//kakaku.com/bb/',
          linkTag: '<a href="https://minsoku.net/searches/results?word=***">みん速</a>',
          appendXP: '//a[@class="planName"]',
        },*/
    /*
      {
        url: /\/\/auctions.yahoo.co.jp\/search\/|\/\/page.auctions.yahoo.co.jp\/jp\/auction\/|\/\/auctions.yahoo.co.jp\/seller\/|\/\/auctions.yahoo.co.jp\/category\/list\/|\/\/page.auctions.yahoo.co.jp\/jp\/auction\//,
        linkTag: '<a href="http://ochisatsu.com/bad/?u0=***"">悪評</a>',
        appendXP: '//div/div[@class="Product__sellerArea"]/a|//span[@class="Seller__name"]/a',
      }
      */
  ];

  let addstyle = {
    added: [],
    add: function(str) {
      if (this.added.some(v => v[1] === str)) return;
      var S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" //      var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
      var d = Date.now()
      var uid = Array.from(Array(12)).map(() => S[Math.floor((d + Math.random() * S.length) % S.length)]).join('')
      document.head.insertAdjacentHTML("beforeend", `<style id="${uid}">${str}</style>`);
      this.added.push([uid, str]);
      return uid;
    },
    remove: function(str) { // str:登録したCSSでもaddでreturnしたuidでも良い
      let uid = this.added.find(v => v[1] === str || v[0] === str)?.[0]
      if (uid) {
        eleget0(`#${uid}`)?.remove()
        this.added = this.added.filter(v => v[0] !== uid)
      }
    }
  }


  //サイズが無選択だったら値段や出荷元を出すためにとりあえず最初のサイズを選択
  if (AMAZON_SELECT_SIZE_ANYWAY) {
    var ele = eleget0('select#native_dropdown_selected_size_name.a-native-dropdown.a-declarative')
    if (eleget0('span > img.nav-categ-image[alt="AMAZON FASHION"]') && ele?.value === "-1") ele.selectedIndex = 1;
  }

  //AmazonでShift+LでCalil都道府県変更
  document.addEventListener("keydown", function(e) {
      if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' || e.target.isContentEditable) return;
      if (location.href.indexOf("amazon.co.jp") == -1) return;
      var key = (e.shiftKey ? "Shift+" : "") + (e.altKey ? "Alt+" : "") + (e.ctrlKey ? "Ctrl+" : "") + e.key;
      //Amazon商品詳細で[u]でUS Amazonで再表示
      if (key === "u") {
        if (location.href.match(/^https?\:\/\/www\.amazon\.co\.jp.*(\/dp\/|\/gp\/product\/|\/asin\/)/gmi)) {
          let url1 = "https://" + location.href.replace(/.*\/dp\/([0-9A-Z]{10}).*|.*\/ASIN\/([0-9A-Z]{10}).*|.*\/gp\/product\/([0-9A-Z]{10}).*/gmi, "www.amazon.com/dp/$1$2$3");
          if (confirm(url1 + "\nを開きます。よろしいですか？")) { window.open(url1); }
        }
        return false;
      }
      if (e.shiftKey && String.fromCharCode(e.which).toLowerCase() == "l") {
        calilpref = window.prompt("calil検索する図書館の都道府県名を入力してください（例：tokyo）\r\n\r\n選択肢：\r\naichi akita aomori chiba ehime fukui fukuoka fukushima gifu gunma hiroshima hokkaido hyogo ibaraki ishikawa iwate kagawa kagoshima kanagawa kochi kumamoto kyoto mie miyagi miyazaki nagano nagasaki nara niigata oita okayama okinawa osaka saga saitama shiga shimane shizuoka tochigi tokushima tokyo tottori toyama wakayama yamagata yamaguchi yamanashi\r\n\r\n（参照）https://calil.jp/local/", calilpref) || "tokyo";
        pref("calilpref", calilpref);
        location.reload();
      }
    },
    false);

  document.addEventListener("keydown", function(e) {
      if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' || e.target.isContentEditable) return;
      if (location.href.indexOf("amazon.co.jp/s?") == -1) return;
      //Amazon検索で[y]で出版年下限で絞り込み
      if (e.key == "y") {
        var input = proInput("本の出版年の下限（1000-" + new Date().getFullYear() + "）", new Date().getFullYear() - 3, 0); // デフォルト値は3年前
        location.href = location.href.replace(/(&i=.*&field-datemod=[^&]*)|(&field-dateop=[^&]*)|(&field-dateyear=\d*)|(&sort=[^&]*)/gmi, "") + (input > 0 ? "&i=stripbooks&field-datemod=0&field-dateop=after&field-dateyear=" + input + "&s=review-rank" : "");
      }
    },
    false);

  addLinks();

  if (location.href.match(/webcomics|ruijianime|suruga-ya|auctions.yahoo.co.jp/)) document.addEventListener("AutoPagerize_DOMNodeInserted", (e) => { apdni(e.target) }); //ページ継ぎ足しアドオンに対応
  if (location.href.indexOf("calil") != -1) setInterval(calilWiden, 2500);
  var apdniID;
  return;

  function apdni(e) {
    if (apdniID) {
      clearTimeout(apdniID);
      //      console.log("clear")
    }
    apdniID = setTimeout(() => {
      apdniID = null;
      addLinks(e)
    }, 200);
  }

  //実際にリンクを付ける
  function addLinks() {
    for (let site of SITE) {
      if (location.href.match(site.url)) {
        ele2links(site.appendXP, "", "", [site.linkTag], " ", "");
      }
    };
    if (location.href.indexOf("manga.nicovideo.jp/comic/") != -1) {
      ele2links('//div[@class="main_title"]/h1', "", "", [ruijimanga]);
      //      ele2links('//div[@class="author"]/h3/span', "", "", [webmangaantena], "");
    }
    if (location.href.indexOf("manga.nicovideo.jp/watch/mg") != -1) {
      ele2links('//span[@class="manga_title"]/a', "", "", [ruijimanga, webmangaantena]);
      //      ele2links('//span[@class="author_name"]', "", "", [webmangaantena], "");
    }
    if (location.href.indexOf("sokuyomi") != -1) {
      ele2links('//div[@class="author"]/a', "", "", [webmangaantena]);
    }
    /*    setTimeout(() => {
          if (location.href.indexOf("sukima") != -1) {
            ele2links('//div/h1[@class="pt-4 d-none d-md-block"]', "", "", [ruijimanga]);
          }
        }, 1000);
        */
    if (location.href.indexOf("webcomics") != -1) {
      //      ele2links('//div[@class="entry-title"]/a', "", "", [ruijimanga, tameshiyomi]);
      ele2links('div.comic-title>h2>a:first-child', "", "", [ruijimanga, tameshiyomi]);
      ele2links(elegeta('div>div>div.entry-title>a:first-child'), "", "", [ruijimanga, tameshiyomi]);
      ele2links("div.comic-author", "", "", [webmangaantenasakusha, sukima, toshokanz, pixiv], "", "作者: ", /作者:\s?|著者:\s?/)
    }

    if (location.href.indexOf("ruijianime.com/comic/") != -1) {
      ele2links("//div[@class='origin_one']/h2/a[1]", "", "", [webmangaantena, tameshiyomi]);
      ele2links("//div[@class='sm_one']/h2/a[1]", "", "", [ruijimanga, webmangaantena, tameshiyomi]);
      ele2links('.//p[@class=\"author\"]/span|.//p[@class="date ruiji_date"]/a|.//p[@class="date ruiji_date"]/span[@class="matched"]|.//p[@class="date ruiji_date"]/span[@class="no_matched"]', "", "", [webmangaantenasakusha, sukima, toshokanz], "");
      ele2links("//div[@id='wrap']/article/div[@class='sm_one_tag_search easy_tag']/h2/a", "", "", [ruijimanga, webmangaantena, tameshiyomi]);
      ele2links("//div[@class='sm_one_tag_search recent_tag']/h2/a|//div[@class='now_one']/h2/a", "", "", [ruijimanga, webmangaantena, tameshiyomi]);
      ele2links('//div[@class="sm_one_tag_search"]/h2/a/strong', "", "", [ruijimanga, webmangaantena, tameshiyomi]);
    }

    if (location.href.indexOf("ruijianime.com/main/") != -1) { // 類似アニメ検索
      ele2links("//div[@class='sm_one']/h2/a", "", "", [ruijianime]);
      ele2links("//div[@id='wrap']/article/div[@class='sm_one_tag_search easy_tag']/h2/a", "", "", [ruijianime]);
      ele2links("//div[@class='sm_one_tag_search recent_tag']/h2/a|//div[@class='now_one']/h2/a", "", "", [ruijianime]);
      ele2links('//div[@class="sm_one_tag_search"]/h2/a/strong', "", "", [ruijianime]);
    }

    // ニコ動userページでニコニコチャートへのリンク
    setTimeout(() => {
      if (location.href.match(/https:\/\/www\.nicovideo\.jp\/user\/\d+?/)) {
        var id = document.querySelector('span.UserDetailsHeader-accountID');
        if (id) {
          let idText = id.innerText.match(/\d+/gm);
          $(xa('//span[@class="UserDetailsHeader-accountID"]')).after('<a rel=\"noopener noreferrer nofollow\" style="display:inline; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:14px; font-weight:normal; color:#606060; margin:0px 0px 0px 0.2em;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4);" href="http://www.nicochart.jp/user/' + idText + '">チャ</a>');
          // $(xa('//span[@class="UserDetailsHeader-accountID"]')).after('<a rel=\"noopener noreferrer nofollow\" style="display:inline; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:14px; font-weight:normal; color:#606060; margin:0px 0px 0px 0.2em;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4);" href="https://www.nicovideo.me/user/' + idText + '">解析</a>'); // サービス終了
        }
      }
    }, 200)

    if (location.href.indexOf("suruga-ya") != -1) {
      ele2links("//p[@class='title']/a", "", "", [amazon, tameshiyomi], undefined, undefined, undefined, { textFunc: text => { return text.replace(/ランクB\)/gmi, "").replace(/（.*$|\(.*$/g, "").replace(/全??\d+巻セット|全?\d+?～?\d+巻セット$/gmi, "").replace(/\s\/(.*)$/gmi, "$1").trim() } });
    }

    // URL変化を監視、変化したら再実行
    if (!observeUrlHasChanged && location.href.match(/amazon.co/)) { // |alternativeto
      var observeUrlHasChangedhref = location.href;
      var observeUrlHasChanged = new MutationObserver(function(mutations) {
        if (observeUrlHasChangedhref !== location.href) {
          observeUrlHasChangedhref = location.href;

          setTimeout(() => {
            removelink();
            runAmazon()
          }, 500);
        }
      });
      observeUrlHasChanged.observe(document, { childList: true, subtree: true });
    }
    runAmazon();

    function runAmazon() {
      setTimeout(() => {
        if (location.href.indexOf("amazon.com") != -1) { // Amazon.com
          removelink();
          var cusRev = eleget0('//div[3]/div[@id="averageCustomerReviews"]'); // サクラチェッカー
          var amazonDP = location.href.match(/\/(dp|gp\/product|asin)\/(.{10})/) || [];
          if (amazonDP[2]) var amazonURL = "https://www.amazon.co.jp" + amazonDP[0];
          if (cusRev && amazonURL) {
            $(cusRev).parent().after('<a  class=\"amamanga ignoreMe\" title=\"' + amazonDP[2] + '\" ' + linkStyle + '\' href="https://duckduckgo.com/?q=!ducky%20' + amazonDP[2] + '%20site:fakespot.com">FAKESPOT</a>');
            $(cusRev).parent().after('<a  class=\"amamanga ignoreMe\" title=\"' + amazonDP[2] + '\" ' + linkStyle + '\' href="https://reviewmeta.com/amazon/' + amazonDP[2] + '/">ReviewMeta</a>');
          }
        }
        if (location.href.indexOf("amazon.co.jp") != -1) { // Amazon.co.jp
          removelink();
          var cusRev = eleget0('//span[@id="acrCustomerReviewText"]'); // サクラチェッカー
          var amazonDP = location.href.match(/\/(dp|gp\/product|asin)\/(.{10})/) || [];
          if (amazonDP[2]) var amazonURL = "https://www.amazon.co.jp" + amazonDP[0];
          if (cusRev && amazonURL) {
            //$(cusRev).parent().after('<a  class=\"amamanga ignoreMe\" title=\"' + amazonDP[2] + '\" ' + linkStyle + '\' href="https://review-tantei.com/list/?sw=' + amazonDP[2] + '&so=ranking-asc&nid=&mk=&tg=">ﾚﾋﾞｭｰ探偵</a>');
            if (typeof otherChecker !== "undefined") otherChecker(cusRev, amazonDP);
            //            $(cusRev).parent().after('<a  class=\"amamanga ignoreMe\" title=\"' + amazonDP[2] + '\" ' + linkStyle + '\' href="https://duckduckgo.com/?q=!ducky%20' + amazonDP[2] + '%20site:fakespot.com">FAKESPOT</a>');
            //            $(cusRev).parent().after('<a  class=\"amamanga ignoreMe\" title=\"' + amazonDP[2] + '\" ' + linkStyle + '\' href="https://reviewmeta.com/amazon/' + amazonDP[2] + '/">ReviewMeta</a>');
            //            $(cusRev).parent().after('<a  class=\"amamanga ignoreMe\" title=\"' + amazonDP[2] + '\" ' + linkStyle + '\' href="https://duckduckgo.com/?q=!ducky%20' + amazonDP[2] + '%20site:reviewmeta.com">ReviewMeta</a>');
          }
          // 著者名の下にISBN-10を書き写す
          var isbn = document.body.innerText.match(/ISBN-10.{1,3}:.{1,3}(\d\d\d\d\d\d\d\d\d[\dX])/m);
          if (isbn) {
            isbn = isbn[1];
            var choshanoshita = eleget0('#bylineInfo_feature_div');
            if (choshanoshita) {
              $(`<span class="amamanga ignoreMe" style="cursor:pointer;" title='クリックすると"${isbn }"をクリップボードにコピー'>ISBN-10: <span id="aisbn10">${ isbn }</span></span><br>`).on("click", () => { GM.setClipboard(isbn) }).insertAfter(choshanoshita);
            }
          }
          // 著者名の下に出版社名を書き写す
          var ele = eleget0('//div[@id="detailBulletsWrapper_feature_div"]');
          var choshanoshita = eleget0('#bylineInfo_feature_div');
          var pubname = ele?.innerText?.match0(/^出版社.*:\s*([^;(\n]{1,50})/m)?.replace(/[\u200B-\u200D\uFEFF\u2028\u2029\u200e]/gmi, '')?.trim()
          if (ele && choshanoshita && pubname) {
            $(`<span class="amamanga ignoreMe" style="cursor:pointer;" title='クリックすると"${pubname }"をクリップボードにコピー'>${pubname}<br></span>`).on("click", () => { GM.setClipboard(pubname) }).insertAfter(choshanoshita);
          }

          var cate = "";
          var cateEle = eleget0('//span[@class="nav-a-content"]');
          if (cateEle) cate += cateEle.innerText.trim();
          if (!cate) { var cateEle = eleget0('//h1[@id="title"]/span[2]'); if (cateEle) cate += cateEle.innerText.trim(); }
          if (cate.match(/本|Kindleストア|Kindle本|単行本|Kindle版|文庫|コミック|新書|雑誌/)) { //カテゴリが本かkindleなら
            var amagen = (
              eleget0it("//div[@id='wayfinding-breadcrumbs_feature_div']/ul") +
              eleget0it("//span[@id='productTitle']") +
              eleget0it("//span[@id='ebooksProductTitle']") +
              eleget0it('//span[@class="a-button-inner"]/a/span[contains(text(),"コミック")]') +
              eleget0it('//span[@class="a-size-medium a-color-secondary a-text-normal"]')).replace(/[\r\n]/g, "");
            if (amagen) {
              var iszasshi = (amagen.match(/雑誌/) != null)
              var comandz = iszasshi ? "comORz" : "";
              if (amagen.match(/コミック(?!・ラノベ)|Kindle本›マンガ|COMICS|漫画文庫/gi) != null && !iszasshi) {
                ele2links("//span[@id='productTitle']", " ", "comORz", [ruijimanga, tameshiyomi]);
                ele2links("//span[@id='ebooksProductTitle']", " ", "comORz", [ruijimanga, webmangaantena, tameshiyomi]);
                ele2links('//span[@class="author notFaded"]/span/a[@class="a-link-normal contributorNameID"]', "", "comORz", [webmangaantena], "");
                ele2links('//span[@class="author notFaded"]/span/a[@class="a-link-normal contributorNameID cleaned"]', "", "comORz", [webmangaantena], ""); // General URL Cleanerに対応
                ele2links('//span[@class="author notFaded"]/a[@class="a-link-normal"]', "", "comORz", [webmangaantenasakusha], "")
                ele2links('//span[@class="author notFaded"]/a[@class="a-link-normal cleaned"]', "", "comORz", [webmangaantenasakusha], "") // General URL Cleanerに対応
                ele2links("//span[@id='ebooksProductTitle']", " ", "comORz", [caariru]);
                ele2links("//span[@id='productTitle']", " ", "comORz", [caariru]);
              } else {
                ele2links("//span[@id='ebooksProductTitle']", " ", comandz, [caariru]);
                ele2links("//span[@id='productTitle']", " ", comandz, [caariru]);
              }
              ele2links('//span[@class="author notFaded"]/span/a[@class="a-link-normal contributorNameID"]', "", "calilAuthor", [caariru], "");
              ele2links('//span[@class="author notFaded"]/span/a[@class="a-link-normal contributorNameID cleaned"]', "", "calilAuthor", [caariru], ""); // General URL Cleanerに対応
              ele2links('//span[@class="author notFaded"]/a[@class="a-link-normal"]', "", "calilAuthor", [caariru], "");
              ele2links('//span[@class="author notFaded"]/a[@class="a-link-normal cleaned"]', "", "calilAuthor", [caariru], ""); // General URL Cleanerに対応
              ele2links("//span[@id='aisbn10']", "", "", [caariru], "");
            }
          }
        }
      }, 2000);
      // AlternativeTo
      if (location.href.match(/^https?:\/\/alternativeto.net/)) {
        moq('//div/a[contains(@class,"AppItemBox_appName__")]|.//div[@data-testid="app-header"]/h2[contains(@class,"Heading_h2__")]/a|.//div[contains(@class,"AppListItem_appHeader__")]/h2/a|.//div[contains(@class,"about_title__")]/h1[contains(@class,"Heading_h1__")]', eles => {
          eles.forEach(v => {
            let title = v.textContent
            $(v).parent().parent().after("<a " + linkStyle + "' href='https://duckduckgo.co/?q=!ducky+site:https://www.privacyguides.org/+" + title + "'>privacyguides.orgを検索</a><br>").after("<a " + linkStyle + "' href='https://www.reddit.com/search/?q=" + $(v).text() + "'>redditで検索</a>").after("<a " + linkStyle + "' href='https://www.slant.co/search?query=" + $(v).text() + "'>slantで検索</a>")
          })
        })

        function moq(targetCSSSelector, func, observeNode = document.body) {
          func(elegeta(targetCSSSelector, observeNode))
          new MutationObserver((m) => {
            let eles1 = [...m.filter(v => v.addedNodes).map(v => [...v.addedNodes]).filter(v => v.length)].flat().filter(v => v.nodeType === 1)
            let eles = eles1.map(v => elegeta(targetCSSSelector, v))?.flat()
            if (eles.length) func(eles)
          })?.observe(observeNode || document.body, { attributes: false, childList: true, subtree: true })
        }
      }
    }

    // www.majorgeeks.com
    if (location.href.match(/^https?:\/\/www.majorgeeks.com/)) {
      $(xa('//div[@class="geekytitle"]/a|//div[@class="geekywraplight"]/h1/span[@itemprop="name"]')).each(function() { $(this).after("<a " + linkStyle + "' href='https://duckduckgo.co/?q=site:https://www.privacyguides.org/+" + $(this).text().replace(/\s[0-9.]+$/, "") + "'>privacyguides.org</a>").after("<a " + linkStyle + "' href='https://www.reddit.com/search/?q=" + $(this).text().replace(/\s[0-9.]+$/, "") + "'>reddit</a>").after("<a " + linkStyle + "' href='https://www.slant.co/search?query=" + $(this).text().replace(/\s[0-9.]+$/, "") + "'>slant</a>").after("<a " + linkStyle + "' href='https://duckduckgo.com/?q=!ducky+site:alternativeto.net+" + $(this).text().replace(/\s[0-9.]+$/, "") + "'>AlternativeTo</a>") });
    }

    // slant
    if (location.href.match(/^https?:\/\/www\.slant\.co/)) {
      // URL変化を監視、変化したら再実行
      if (!observeUrlHasChanged) {
        var observeUrlHasChangedhref = location.href;
        var observeUrlHasChanged = new MutationObserver(function(mutations) {
          if (observeUrlHasChangedhref !== location.href) {
            observeUrlHasChangedhref = location.href;
            setTimeout(() => { runSlant() }, 2500);
          }
        });
        observeUrlHasChanged.observe(document, { childList: true, subtree: true });
      }
      runSlant();

      function runSlant() {
        $(xa('//a[@class="_option-link _option-title-link"]/span|.//h1[@class="OptionDetailed-Title"]|.//div[@class="MasterOptionCard-Title"]/a')).each(function() {
          let title = $(this).text();
          title = title.replace(/^\d+$|^THE BEST$|--| Review$/gmi, "");
          //          $(this).parent().after("<a " + linkStyle + "' href='https://duckduckgo.co/?q=site:https://www.privacyguides.org/+" + $(this).text() + "'>privacyguides.orgを検索</a>").after("<a " + linkStyle + "' href='https://www.reddit.com/search/?q=" + title + "'>redditで検索</a>").after("<a " + linkStyle + "' href='https://alternativeto.net/browse/search?q=" + title + "'>AlternativeToで検索</a>")
          $(this).parent().after("<a " + linkStyle + "' href='https://duckduckgo.co/?q=site:https://www.privacyguides.org/+" + title + "'>privacyguides.orgを検索</a>").after("<a " + linkStyle + "' href='https://www.reddit.com/search/?q=" + title + "'>redditで検索</a>").after("<a " + linkStyle + "' href='https://alternativeto.net/browse/search?q=" + title + "'>AlternativeToで検索</a>")
        });
      }
    }

    // 「新しいタブで開く」指定を外す
    var ele = eleget('//a[@target="_blank"]');
    for (var i = ele.snapshotLength; i--;) ele.snapshotItem(i).removeAttribute("target");

    return;
  }

  function eleget0it(xpath) {
    try {
      var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0).innerText : "";
    } catch (e) { return ""; }
  }

  function eleget(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  }

  function ele2links(xpath, cutchar1, cutchar2, urlA, styleadd, cutchar3, deleteRE, option) {
    var elea = (typeof xpath == "string") ? elegeta(xpath) : xpath;
    if (!elea) return;
    //console.log(elea.length)
    elea = elea.filter(v => !v?.matches('.ruijisclink'))

    for (var j = 0; j < urlA.length; j++) {
      //    var ele = eleget(xpath);
      var url = urlA[j];
      styleadd = styleadd === undefined ? "float: right;" : styleadd;

      for (let ele of elea) {
        if (ele.dataset.ruijisc == "ruijisc") continue;
        var text = ele.innerText?.trim();
        if (cutchar3 != "")
          if (text.indexOf(cutchar3) != -1) text = text.substr(text.indexOf(cutchar3) + cutchar3.length);
        if (cutchar1 != "") {
          var splitPos = text.search(cutchar2 == "comORz" ? /-|－|―|～|:|：|\(|（| \d|　\d|(\s|　)([0-9]|[０-９])/ : /―|～|\(|（/);
          if (splitPos != -1) text = text.substr(0, splitPos);
        }

        if (url == webmangaantenasakusha) text = text.replace(/\/|／|\,|、/gmi, " OR ").replace(/先生|原作|原案|脚本|著|著者|漫画|作画|イラスト|キャラクター|画[:：\/／]|作[:：\/／]|絵[:：\/／]|構成|協力|[:：]|[\(（][^）\)]*[）\)]|＝/gmi, "").replace(/　/g, " ").replace(/^ OR | OR $/gmi, "").trim();
        if (url == ruijimanga) text = text.replace("！", "!").replace("？", "?");
        if (url == caariru) text = text.replace(/[\s　:]/g, "");
        if (url == amazon) text = text.replace(/<<.*>>|ランクB）|\[ランクB\]|ランクB\/★未完\)|★ランクB未完\)|ランクB\)/gi, "");
        text = text.replace(/\[雑誌\]/, ""); //amazon
        text = text.replace(deleteRE, ""); //web-ace
        if (option && option.textFunc) { text = option.textFunc(text) }
        text = text.replace(/\.\.\./gm, " ").trim();
        text = sani(text)
        var url2 = url.replace("***", encodeURI(text.replace(/\#/gm, ""))).replace("<a ", "<a onclick=\"arguments[0].stopPropagation();\" class=\"ruijisclink ruijiSc ignoreMe\" title=\"" + text.replace(/\"/gm, "\\\"").replace(/\'/gm, "\\\'") + "\" data-ruijisc=\"ruijisc\"   " + linkStyle + styleadd + "' ");

        if (!(aldone.some(v => v.ele === ele && v.url2 === url2))) {
          adja(ele.parentNode, "beforeend", url2)
          aldone.push({ ele: ele, url2: url2 })
        }
      }
    }
    return;
  }

  // カーリルの表の幅を広げる
  function calilWiden() {
    var ele = eleget("//div[@class='wrap']");
    for (var i = ele.snapshotLength; i--;) ele.snapshotItem(i).style.maxWidth = "1400px";
    var ele = eleget("//div[@class='target']/h4");
    for (var i = ele.snapshotLength; i--;) {
      ele.snapshotItem(i).style.maxWidth = "1400px";
      ele.snapshotItem(i).style.fontSize = "100%";
    }
    var ele = eleget("//div");
    for (var i = ele.snapshotLength; i--;) ele.snapshotItem(i).style.fontSize = "100%";
    var ele = eleget("//div[@class='target']");
    for (var i = ele.snapshotLength; i--;) ele.snapshotItem(i).style.padding = "20px 0px 0px";
    return;
  }

  function proInput(prom, defaultval, min, max = Number.MAX_SAFE_INTEGER) {
    return Math.min(Math.max(
      Number(window.prompt(prom, defaultval).replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      }).replace(/[^-^0-9^\.]/g, "")), min), max);
  }

  function xa(xpath, node = document) {
    if (!xpath) return [];
    if (xpath.match(/^\/\//)) {
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

  function pref(name, store = undefined) { // pref(name,data)で書き込み（数値でも文字列でも配列でもオブジェクトでも可）、pref(name)で読み出し
    var domain = (location.href.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1] || location.href);
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

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    let xpath2 = xpath.replace(/:inscreen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let array = []
    try {
      if (!/^\.?\//.test(xpath)) {
        array = [...node.querySelectorAll(xpath2)]
      } else {
        var snap = document.evaluate("." + xpath2, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
        let l = snap.snapshotLength
        for (var i = 0; i < l; i++) array[i] = snap.snapshotItem(i)
      }
      if (/:visible/.test(xpath)) array = array.filter(e => e.offsetHeight)
      if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { return []; }
    return array
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) return node.querySelector(xpath);
    try {
      var ele = document.evaluate("." + xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function eleget0d(xpath, node = document) {
    let e = eleget0(xpath, node)
    if (debug) {
      addstyle.add(`.debugAttract {
        outline:4px solid #82d4;
        background:#82d1;
        }
        .debugAttract2 {
        outline:4px solid #02f8;
        background:#02f1;
        }`) // box-shadow:0px 0px 4px 4px #92f, inset 0 0 100px #fe2;

      addstyle.add(`.debugattract{}`)
      e?.classList.add("debugAttract")
      setTimeout(e => e?.classList.remove("debugAttract"), 9999, e)
    }
    return e
  }

  var mllID;

  function popup(text) {
    var e = document.getElementById("mllbox");
    if (e) { e.remove(); }
    if (mllID) { clearTimeout(mllID); }
    var ele = document.body.appendChild(document.createElement("span"));
    ele.className = "ignoreMe"
    ele.innerHTML = '<span id="mllbox" class="ignoreMe" style="all:initial; position: fixed; right:1em; bottom:3em; z-index:2147483647; opacity:1; font-size:15px; font-weight:bold; margin:0px 1px; text-decoration:none !important; text-align:center; padding:1px 6px 1px 6px; border-radius:12px; background-color:#6080ff; color:white; white-space: nowrap;" onclick=\'var a = document.createElement(\"textarea\"); a.value = \"' + text + '\"; document.body.appendChild(a); a.select(); document.execCommand(\"copy\"); a.parentElement.removeChild(a);\'">' + text + '</span>';
    mllID = setTimeout(function() { var ele = document.getElementById("mllbox"); if (ele) ele.remove(); }, 5000);
  }

  function sani(s) { return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, '&#x60;').replace(/</g, "&lt;").replace(/>/g, "&gt;") }


  // element.dataset.gmDataListプロパティにclassList.add/removeのような命令セット
  function gmhbShow(e, id) {
    gmDataList_remove(e, `gmHideBy${id}`)
    if (!gmDataList_includesPartial(e, 'gmHideBy')) $(e).show(333)
  }

  function gmhbHide(e, id) {
    gmDataList_add(e, `gmHideBy${id}`)
    $(e).hide(333)
  }

  function gmDataList_add(ele, name) {
    let data = ele?.dataset?.gmDataList?.split(" ") || []
    if (!data.includes(name)) {
      data.push(name);
      ele.dataset.gmDataList = [...new Set(data)].join(" ")
    }
  }

  function gmDataList_remove(ele, name) {
    let data = ele?.dataset?.gmDataList?.split(" ") || []
    if (data.includes(name)) {
      data = data.filter(v => v !== name)
      if (data.length) ele.dataset.gmDataList = data.join(" ");
      else delete ele.dataset.gmDataList;
    }
  }

  function gmDataList_includesPartial(ele, name) {
    let data = ele?.dataset?.gmDataList?.split(" ") || []
    return data.find(v => v.includes(name))
  }

  function removelink() {
    elegeta(".amamanga,.ruijiSc").forEach(e => e.remove());
    aldone = [];
  }
})();