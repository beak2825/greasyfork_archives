// ==UserScript==
// @name         YouTubeとニコニコ動画にRSSリンクを追加
// @description  YouTube：ユーザー、マイリスト、チャンネル　ニコニコ動画：ユーザー、マイリスト、タグ　reddit：キーワード検索結果、サブレディット、スレッド、ユーザー　twitter：キーワード検索、ユーザー　Pinterest:ユーザー、ボード
// @version      0.5.30
// @run-at       document-idle
// @match  *://www.youtube.com/
// @match  *://www.youtube.com/*
// @match  *://www.nicovideo.jp/user/*
// @match  *://www.nicovideo.jp/mylist/*
// @match  *://www.nicovideo.jp/tag/*
// @match  *://www.nicovideo.jp/related_tag/*
// @match  *://www.nicovideo.jp/search/*
// @match  *://www.nicovideo.jp/watch/*
// @match  *://www.nicovideo.jp/mylist_search/*
// @match  *://www.reddit.com/*
// @match  *://twitter.com/*
// @match  *://mobile.twitter.com/*
// @match  *://www.pinterest.jp/*
// @match *://nitter.net/*
// @match *://nitter.cz/*
// @match *://x.com/*
// @match *://xcancel.com/*
// @match https://github.com/zedeus/nitter/wiki/Instances
// @grant GM.addStyle
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/371106/YouTube%E3%81%A8%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%81%ABRSS%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/371106/YouTube%E3%81%A8%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%81%ABRSS%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {

  // 使うnitterのインスタンス（https://github.com/zedeus/nitter/wiki/Instances
  const NITTER_INSTANCES = ["xcancel.com"]
  const NITTER_INSTANCE = NITTER_INSTANCES[Math.floor(Math.random() * (NITTER_INSTANCES.length))]; // alert(NITTER_INSTANCE);
  const XCANCEL_ADD_TIMESTAMP = 1; // 1:xcancelで0000-00-00 00:00形式の日時を追加

  const INSURE = 0;
  var PERNOW = Math.max(2500, performance.now());
  const TWITTER_USERHOME_USERNAME_XPATH = '//div[contains(@class,"css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l")]/div[2]/div[@tabindex="-1"]/div/div/span[@style="text-overflow: unset;"]';

  if (location.href == "https://github.com/zedeus/nitter/wiki/Instances") {
    let a = elegeta('//td[1]/a[text()="nitter.net"][contains(@href,"https://")]|//div[contains(@class,"markdown-body")]/table[2]/tbody/tr/td[1]/a[contains(@href,"https://")]').filter(e => !eleget0('//td[contains(text(),"❌")]|.//g-emoji[@alias="question"]', e.closest('tr'))).filter(e => !eleget0('[alias="jp"]', e.closest('tr')) && !e?.href?.match(/\.jp|\.cn|\.kr|\.kp/)).filter(e => !e?.href.match(/blog/));
    a.forEach(e => e.style.outline = "0.3em dotted #0f0")
    a = a.map(e => e?.href?.replace(/^https?:\/\/|\/$/g, ""))
    if (a)($(`<div title="ダブルクリックで消す" id="okserver" style="position:fixed; right:1em; bottom:1em; border:2px dotted; width:33%; background-color:#fafaffd0; padding:1em;"><h5>YouTubeとニコニコ動画にRSSリンクを追加：</h5><h4 style="outline:0.3em dotted #0f0">コピペ用　[Online ✅ ] \& ほかすべて❌がない \& [https ✅ ] なインスタンス</h4><blockquote>${`["` + a.join(`", "`) + `"]`}</blockquote></div>`).on("dblclick", e => $("#okserver").remove()).insertAfter($(elegeta('//table[2]')[0])).hide().show(999)) //[0]?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
    return
  }

  if (location.href.match(/\/\/twitter\.com\/|\/\/mobile\.twitter\.com\/|\/\/nitter\.cz\/|\/\/nitter\.net\/|\/\/x\.com\/|\/\/xcancel\.com\//)) twitterRSS();
  else if (location.href.match(/\/\/www\.youtube\.com|\/\/www\.nicovideo\.jp\/|\/\/www\.reddit\.com\/|\/\/www\.pinterest\./)) youtubeNicoRedditRSS();
  return;
  // ---------------------------------------------------------------------------------------------------------------------
  function youtubeNicoRedditRSS() {
    (function() {
      var rssICON = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABdUlEQVQ4ja3TL2iWURTH8c+VJwwxjjeMBQUxGRdkGESHBothw3CDwfTaFiwDm1MQViyiQRG8iviCYBAGKg60GEwm/2AZQ8bixIXxXsNzH717dSLiKYdzOHzv+Z17TsjJcdzEOBrs0VrnOxtWfhsb6IecfMBB/2Yfm/IyPMXbAjuKyb8A9JrSNqyE6BrkBKZxEWf+AGhCTr5iL+7hDt6FaL2ryMkM7mLiN4CtkJNvGKuSQ7zBEgYhkpNJPMehUUA96VuYw3XsxyMs52Q8RKs4gbXRFmrApxANQjSPA7iMGaxUkHOjgFrCSzzEkxDbl3Iyiwd4gVNFzmM/B7tDwjHcwOecLOREiAa4gpOYLXVLu0kYYoBnWMRCyV/FF8yX+BVWa0C3ordDNBei09qlupSTiRBt4T6O5KQX4g/IL4DNqpvNMpdO6+tSe7jE77uuG+1hwIWygWOV3rM52af9FTifkylMlXj7vxxTXzv9np3nvJt157yO/nf0A3GlIF+BggAAAABJRU5ErkJggg==">';
      addLinks();
      setTimeout(addLinks, 200);
      setTimeout(addLinks, 1000);
      setTimeout(addLinks, 2500);
      setTimeout(addLinks, PERNOW);

      //ページ継ぎ足しアドオンに対応
      if (location.href.match(/related_tag|mylist_search/)) document.addEventListener("AutoPagerize_DOMNodeInserted", addLinks);

      //AutoPagerize系アドオンでuserやタグページを継ぎ

      // URL変化したら再実行
      //      if (location.href.indexOf("nicovideo") === -1 && !observer) {
      var href = location.href;
      var observer = new MutationObserver(function(mutations) {
        if (href !== location.href) {
          href = location.href;
          removeAllRSS();
          for (let i = 0; i < (location.href.match(/nicovideo|reddit|youtube|pinterest/) ? 4 : 1 + INSURE); i++) setTimeout(addLinks, Math.max(200, PERNOW) * i);
        }
      });
      observer.observe(document, { childList: true, subtree: true });
      //      }

      function removeAllRSS() { // 前回つけたRSSを剥がす
        $('link.multirss,span.multirss,a.multirss').remove();
      }

      function redditYoutubeInitAndAddRSS() {
        removeAllRSS();
        if (location.href.match(/^https?:\/\/www\.reddit\.com\/search\/?\?q=/gmi) && eleget0('//input[@id="header-search-bar"]')) { // reddit search
          var url = "https://www.reddit.com/search.rss?q=***&sort=new".replace("***", eleget0('//div[1]/div/h3/span').innerText);
          addICONandRAD(eleget0('//div[1]/div/h3/span'), url, eleget0('//div[1]/div/h3/span').value);
        } else
        if (location.href.match(/^https?:\/\/www\.reddit\.com\/user\/[^\/]+\/posts\/$/gmi)) { // reddit user posts
          var url = location.href.replace(/\/posts\//, "/submitted/") + ".rss";
          addICONandRAD(eleget0('//div[@style="margin-left:24px;margin-top:0"]/div/div[1]/div/a/..|/HTML/BODY/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[4]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/A[1]/..'), url);
        } else
        if (location.href.match(/^https?:\/\/www\.reddit\.com\/user\/[^\/]+\/comments\/$/gmi)) { // reddit user comments
          var url = location.href + ".rss";
          addICONandRAD(eleget0('//div[@style="margin-left:24px;margin-top:0"]/div/div[1]/div/a/..|/HTML/BODY/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[4]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/A[1]/..'), url);
        } else
        if (location.href.match(/^https?:\/\/www\.reddit\.com\/user\/[^\/]+\/$/gmi)) { // reddit user overview
          var url = location.href + (location.href.match(/\/$/) ? ".rss" : "/.rss");
          addICONandRAD(eleget0('//div[@style="max-width:100%"]/div[last()]/div/div[1]/div/span|//div[2]/div/div[1]/div/h1|/HTML/BODY/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[4]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/SPAN[1]'), url);
        } else
        if (location.href.match(/^https?:\/\/www\.reddit\.com\/r\//gmi) && location.href.match(/\/search\/|comments/) == null) { // reddit subreddit
          var url = location.href + (location.href.match(/\/$/) ? ".rss" : "/.rss");
          addICONandRAD(eleget0('/HTML/BODY/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/H2[1]|/HTML/BODY/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/H2[1]|/HTML/BODY/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/H2[1]|/HTML/BODY/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/H2[1]'), url);
        } else
        if (location.href.match(/^https?:\/\/www\.reddit\.com\/.+/gmi) && location.href.match(/\/comments\//)) { // reddit thread
          var url = location.href.replace(/\/\?.*/, "") + (location.href.match(/\/$/) ? ".rss" : "/.rss");
          addICONandRAD(eleget0('//div/div[3]/div[1]/div/h1|//div[2]/div/div[2]/div/div/h1'), url);
        }


        addRSSICONandRADlink("://www.youtube.com/playlist?list=", '//yt-formatted-string[@class="style-scope ytd-playlist-sidebar-primary-info-renderer"]/a|//h1[@class="style-scope ytd-playlist-sidebar-primary-info-renderer"]/yt-formatted-string|//div[contains(@class,"metadata-wrapper style-scope ytd-playlist-header-renderer")]/yt-dynamic-sizing-formatted-string/div[@id="container"]/yt-formatted-string', '<a href="https://www.youtube.com/feeds/videos.xml?playlist_id=***">*RSS Feed*</a>', "list=");
        addRSSICONandRADlink("://www.youtube.com/channel/|https://www.youtube.com/@[a-z0-9\-\_]+/videos", '//div[@id="meta"]/ytd-channel-name[@id="channel-name"]|//span[@id="channel-title"]|//div[1]/yt-formatted-string[@id="channel-handle"]', '<a href="https://www.youtube.com/feeds/videos.xml?channel_id=***">*RSS Feed*</a>', "channel/");
        addRSSICONandRADlink("://www.youtube.com/user/", '//div[@id="meta"]/ytd-channel-name|//span[@id="channel-title"]', '<a href="https://www.youtube.com/feeds/videos.xml?user=***">*RSS Feed*</a>', "user/");
        let chId = eleget0('//link[@rel="canonical"]');
        if (chId && chId.href) {
          addRSSICONandRADlink("://www.youtube.com/c/", '//div[@id="meta"]/ytd-channel-name[@id="channel-name"]|//span[@id="channel-title"]', '<a href="https://www.youtube.com/feeds/videos.xml?channel_id=' + chId.href.replace("https://www.youtube.com/channel/", "") + '">*RSS Feed*</a>', "");
        }

        // Pinterest ボード
        if (location.href.match(/\/\/www\.pinterest\.jp\/[^/]*\/[^/]*\//) && !(location.href.match(/\/\/www\.pinterest\.jp\/pin\/|\/\/www.pinterest.jp\/today\//))) {
          var url = location.href.match(/https:\/\/www\.pinterest\.jp\/[^/]*\/[^/]*/) + ".rss";
          var place = eleget0('//DIV[1]/DIV[1]/H1[1]|//div[last()]/div/div/div/div[1]/h4'); //TBD
          addICONandRAD(place, url, place.value);
        }

        // Pinterest ユーザー
        if (location.href.match(/\/\/www\.pinterest\.jp\/[^/]*\/$/) && !(location.href.match(/\/\/www\.pinterest\.jp\/pin\/|\/\/www.pinterest.jp\/today\//))) {
          setTimeout(() => {
            removeAllRSS();
            var url = location.href.match(/https:\/\/www\.pinterest\.jp\/[^/]*\/$/) + "feed.rss";
            var place = eleget0('/HTML/BODY/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/H1[1]'); //TBD o?
            addICONandRAD(place, url, place.value);
          }, 2200);
        }
      }

      return;

      function addICONandRAD(place, url, title = "") {
        if (!place) return;
        //        removeAllRSS();
        var link = document.body.parentNode.insertBefore(document.createElement("link"), document.body);
        link.title = title || place.innerText;
        link.rel = "alternate";
        link.type = "application/rss+xml";
        link.className = "multirss";
        link.href = url;

        if (!link.title) return;
        var url = link.href;
        var ele = place.appendChild(document.createElement('span'));
        ele.setAttribute("style", "font-weight:normal;");
        ele.className = "multirss";
        let rssICON = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABdUlEQVQ4ja3TL2iWURTH8c+VJwwxjjeMBQUxGRdkGESHBothw3CDwfTaFiwDm1MQViyiQRG8iviCYBAGKg60GEwm/2AZQ8bixIXxXsNzH717dSLiKYdzOHzv+Z17TsjJcdzEOBrs0VrnOxtWfhsb6IecfMBB/2Yfm/IyPMXbAjuKyb8A9JrSNqyE6BrkBKZxEWf+AGhCTr5iL+7hDt6FaL2ryMkM7mLiN4CtkJNvGKuSQ7zBEgYhkpNJPMehUUA96VuYw3XsxyMs52Q8RKs4gbXRFmrApxANQjSPA7iMGaxUkHOjgFrCSzzEkxDbl3Iyiwd4gVNFzmM/B7tDwjHcwOecLOREiAa4gpOYLXVLu0kYYoBnWMRCyV/FF8yX+BVWa0C3ordDNBei09qlupSTiRBt4T6O5KQX4g/IL4DNqpvNMpdO6+tSe7jE77uuG+1hwIWygWOV3rM52af9FTifkylMlXj7vxxTXzv9np3nvJt157yO/nf0A3GlIF+BggAAAABJRU5ErkJggg==">';
        ele.innerHTML = " <a href=" + link.href + " rel=\"noopener noreferrer nofollow\" title='" + link.title + "'>" + rssICON + "</a>";
      }

      //実際にリンクを付ける
      function addLinks() {
        //「新しいタブで開く」指定を外す
        //for (let ele of elegeta('//a[@target="_blank"]')) ele.removeAttribute("target");

        removeAllRSS();
        redditYoutubeInitAndAddRSS();

        var nicodeleteOpt = /[\?&]f_range=.|[\?&]l_range=.|[\?&]opt_md=.*|[\?&]start=.*|[\?&]end=.*|[\?&]ref=[^&]*|[\?&]sort=.|[\?&]order=.|[\?&]page=\d*|[\?&]track=[^&]*|#+.*/g;

        //addRSSICONandRADlink4(/https:\/\/www.nicovideo.jp\/user\/\d+\/series\/(\d+)/, '//div/li[@class="SubMenuLink VideoSideContainer-seriesListItem"]/a', e=>(`<a href="https://rss.1ni.co/series/${e.href.match(/\/user\/\d+\/series\/(\d+)/)?.[1]}">*RSS Feed*</a>`),e=>e.style = " position:relative;top:2em;left:0.5em; z-index:1;");

        addRSSICONandRADlink("www.nicovideo.jp/user/", '//h3[@class="UserDetailsHeader-nickname"]', '<a href="https://www.nicovideo.jp/user/***/video?rss=2.0">*RSS Feed*</a>', "/user/", "", nicodeleteOpt);
        addRSSICONandRADlink(/www.nicovideo.jp\/user\/.*?\/mylist\//, '//h1[@class="MylistHeader-name"]', '<a href="https://www.nicovideo.jp/mylist/***">*RSS Feed*</a>', /user\/.*?\//, "?rss=2.0&lang=ja-jp&special_chars_decode=1", nicodeleteOpt); // 2020年07月29日新
        addRSSICONandRADlink3(/www.nicovideo.jp\/user\/.*?\/mylist\//, '//ul[@class="SubMenuLinkList MylistPageSubMenu-menu"]/li/a/span[2]/..', '<a href="https://www.nicovideo.jp/mylist/***?rss=2.0&lang=ja-jp&special_chars_decode=1">*RSS Feed*</a>', /https?\:\/\/www.nicovideo.jp\/user\/.*?\/mylist\//, "", nicodeleteOpt); // 2020年09月20日新
        addRSSICONandRADlink("www.nicovideo.jp/tag/", '//header[@class="contentHeader"]/h1/span', '<a href="https://www.nicovideo.jp/tag/***">*RSS Feed*</a>', "", "?sort=f&rss=2.0&lang=ja-jp", nicodeleteOpt);

        //addRSSICONandRADlink2("www.nicovideo.jp/related_tag/", '//table[@class="font12"]/tbody/tr/td/a', '<a href="https://www.nicovideo.jp/tag/***?sort=f&rss=2.0&lang=ja-jp">*RSS Feed*</a>', "", "", nicodeleteOpt);
        addRSSICONandRADlink2("www.nicovideo.jp/related_tag/", '//a[@class="RelatedTagPage-tagList-tagLink"]', '<a href="https://www.nicovideo.jp/tag/***?sort=f&rss=2.0&lang=ja-jp">*RSS Feed*</a>', "", "", nicodeleteOpt);
        addRSSICONandRADlink4("www.nicovideo.jp/mylist_search", `//a/div/div/h2[contains(@class,"NC-MediaObjectTitle NC-MediaObjectTitle_fixed1Line")]`, e => `<a href="https://www.nicovideo.jp/mylist/${e.closest("a").href.match(/mylist\/(\d+)/)?.[1]}?rss=2.0&lang=ja-jp&special_chars_decode=1">*RSS Feed*</a>`, e => { e.style.float = "left" });
        addRSSICONandRADlink2("www.nicovideo.jp/search", "//ul[@class='tags']//a", '<a href="https://www.nicovideo.jp/tag/***?sort=f&rss=2.0&lang=ja-jp">*RSS Feed*</a>', "", "", nicodeleteOpt);
        addRSSICONandRADlink2("www.nicovideo.jp/tag", "//ul[@class='tags']//a", '<a href="https://www.nicovideo.jp/tag/***?sort=f&rss=2.0&lang=ja-jp">*RSS Feed*</a>', "", "", nicodeleteOpt);
        addRSSICONandRADlink2("www.nicovideo.jp/watch/", '//a[@class="Link TagItem-name"]', '<a href="https://www.nicovideo.jp/tag/***?sort=f&rss=2.0&lang=ja-jp">*RSS Feed*</a>', "", "", nicodeleteOpt);

        /*if (/www.nicovideo.jp\/mylist_search\//.exec(location.href))
          for (let ele of elegeta('//div[@id="PAGEBODY"]/div[2]/div/div/p/a')) addRSSICONandRAD(ele, ele.href + "?rss=2.0&lang=ja-jp&special_chars_decode=1", ele.innerText);
*/
        return;
      }

      function eleget0(xpath) {
        var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        return ele.snapshotLength > 0 ? ele.snapshotItem(0) : "";
      }

      function elegeta(xpath) {
        var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        var array = [];
        for (var i = 0; i < ele.snapshotLength; i++) array[i] = ele.snapshotItem(i);
        return array;
      }

      function addRAD(inurl, xpath, newurl, part, after, urlGarbage = /$^/) { // RSS auto-discoveryを付ける
        if (location.href.indexOf(inurl) == -1) return;
        var place = eleget0(xpath);
        var link = eleget0('//head').appendChild(document.createElement("link"));
        var url2 = after ? ('<a href="' + url + after + '">*RSS Feed*</a>') : newurl.replace("***", location.href.split(part)[1].match(/[^\?&\/]*/g)[0]);;
        link.rel = "alternate"
        link.type = "application/rss+xml"
        link.title = document.title;
        link.href = url2;
        link.setAttribute("class", "multirss");
      }

      function addRSSICONandRAD(place, url, title) {
        //        removeAllRSS();
        var link = place.parentNode.insertBefore(document.createElement("a"), place);
        link.href = url;
        link.setAttribute("title", title + "のRSSを購読");
        link.setAttribute("class", "multirss");
        link.innerHTML = rssICON;

        var rac = document.createElement("link");
        rac.rel = "alternate"
        rac.type = "application/rss+xml"
        rac.title = title;
        rac.href = url
        rac.setAttribute("class", "multirss");
        eleget0('//head').appendChild(rac);
      }

      function addRSSICONandRADlink(inurl, xpath, newurl, part, after, urlGarbage = /$^/) {
        if (typeof inurl == "string" && location.href.indexOf(inurl) == -1) return;
        if (typeof inurl == "object" && !(location.href.match(inurl))) return
        var ele = eleget0(xpath);
        if (!ele) return;
        //        removeAllRSS();
        var text = newurl + location.href.split(part)[1];
        var url = location.href.replace(urlGarbage, "");
        var link = document.createElement("span");
        //        var url2 = after ? ('<a href="' + url + after + '">*RSS Feed*</a>') : newurl.replace("***", location.href.split(part)[1].match(/[^\?&\/]*/g)[0]);
        if (typeof part == "string") {
          var url2 = after ? ('<a href="' + url + after + '">*RSS Feed*</a>') : newurl.replace("***", location.href.split(part)[1].match(/[^\?&\/]*/g)[0]);
        } else {
          var url2 = after ? ('<a href="' + url.replace(part, "") + after + '">*RSS Feed*</a>') : newurl.replace("***", location.href.replace(part, "").match(/[^\?&\/]*/g)[0]); // 現在ニコ動mylist専用
        }
        var bgcol = "background-color:#c9e9ff;";
        link.setAttribute("title", ele.innerText + "のRSSを購読");
        link.setAttribute("class", "multirss");
        link.innerHTML = url2.replace("*RSS Feed*", rssICON)
        ele.parentNode.appendChild(link);

        addRAD1(ele, url2);

        return;
      }

      function addRSSICONandRADlink2(inurl, xpath, newurl, part, after, urlGarbage = /$^/) {
        //if (location.href.indexOf(inurl) == -1) return
        if (!lh(inurl)) return
        //        removeAllRSS();
        for (let ele of elegeta(xpath)) {
          var url = location.href.replace(urlGarbage, "");
          var link = document.createElement("span");
          var url2 = typeof newurl == "function" ? newurl(ele).replace("***", encodeURIComponent(ele.innerText)) : newurl.replace("***", encodeURIComponent(ele.innerText));
          var bgcol = "background-color:#c9e9ff;";
          link.setAttribute("title", ele.innerText + "のRSSを購読");
          link.setAttribute("class", "multirss");
          link.innerHTML = url2.replace("*RSS Feed*", rssICON)
          //link.style.float = "left"
          ele.parentNode.insertBefore(link, ele);

          addRAD1(ele, url2)
        }
        return;
      }

      function addRSSICONandRADlink4(inurl, xpath, newurl, elefunc = null) {
        if (!lh(inurl)) return
        //        removeAllRSS();
        for (let ele of elegeta(xpath)) {
          var link = document.createElement("span");
          var url2 = typeof newurl == "function" ? newurl(ele).replace("***", encodeURIComponent(ele.innerText)) : newurl.replace("***", encodeURIComponent(ele.innerText));
          var bgcol = "background-color:#c9e9ff;";
          link.setAttribute("title", ele.innerText + "のRSSを購読");
          link.setAttribute("class", "multirss");
          link.innerHTML = url2.replace("*RSS Feed*", rssICON)
          if (elefunc) elefunc(link)
          ele.parentNode.insertBefore(link, ele);

          addRAD1(ele, url2)
        }
        return;
      }

      function addRSSICONandRADlink3(inurl, xpath, newurl, part, after, urlGarbage = /$^/) {
        if (location.href.match(inurl) == false) return
        //        removeAllRSS();
        for (let ele of elegeta(xpath)) {
          var url = location.href.replace(urlGarbage, "");
          var link = document.createElement("span");
          var url2 = newurl.replace("***", ele.href.replace(part, ""));
          var bgcol = "background-color:#c9e9ff;";
          link.setAttribute("title", ele.innerText + "のRSSを購読");
          link.setAttribute("class", "multirss");
          link.innerHTML = url2.replace("*RSS Feed*", rssICON)
          link.style = "position:relative;top:2em;left:-1.5em;";
          ele.parentNode.insertBefore(link, ele);
          addRAD1(ele, url2)
        }
        return;
      }

      function addRAD1(ele, url2) {
        //        removeAllRSS();
        for (let rad of elegeta("//link[@type='application/rss+xml']")) { if (rad.href == url2.match(/\"(.*)\"/)[1]) return; } // 重複登録を避ける
        var rac = document.createElement("link");
        rac.rel = "alternate"
        rac.type = "application/rss+xml"
        rac.title = ele.innerText;
        rac.href = url2.match(/\"(.*)\"/)[1];
        rac.setAttribute("class", "multirss");
        eleget0('//head').appendChild(rac);
      }
    })();
  }

  // ---------------------------------------------------------------------------------------------------------------------

  function twitterRSS() {
    (() => {
      if (XCANCEL_ADD_TIMESTAMP && location.href.match('https://xcancel.com/')) {
        GM.addStyle(`.xcanceldate8 { color:var(--accent); margin-left:1em;}`)
        setInterval(() => {
          elegeta('.tweet-date:not([data-xcanceldate8])').forEach(e => {
            e.dataset.xcanceldate8 = 1;
            let date = gettime("YYYY-MM-DD hh:mm", new Date(Date.parse(e.querySelector('a')?.title?.replace("· ", "") || "")));

            function gettime(_fmt = 'YYYY/MM/DD hh:mm:ss.iii', _dt = new Date()) {
              return [
                ['YYYY', _dt.getFullYear()],
                ['MM', _dt.getMonth() + 1],
                ['DD', _dt.getDate()],
                ['hh', _dt.getHours()],
                ['mm', _dt.getMinutes()],
                ['ss', _dt.getSeconds()],
                ['iii', _dt.getMilliseconds()],
              ].reduce((s, a) => s.replace(a[0], `${a[1]||0}`.padStart(a[0].length, '0')), _fmt)
            }
            e.insertAdjacentHTML("beforebegin", `<span class="xcanceldate8">${date}</span>`)
          })
        }, 999)
      }
      if (location.href.match('https://xcancel.com/') && eleget0('form.search-field > div > input')) {
        GM.addStyle(`*[data-since] , *[data-until] {font-size:66%; background-color:#621; border-radius:1em; cursor:pointer;}`)
        let pla = eleget0('div.timeline-header');
        let html = "<br>"
        for (let i = 2006; i < 2026; i++) { html += `<span data-since="${i}" title="since:${i}-01-01にします">${i}-</span> `; }
        html += "<br>"
        for (let i = 2006; i < 2026; i++) { html += `<span data-until="${i}" title="until:${i}-12-31にします">-${i}</span> `; }
        pla?.insertAdjacentHTML("afterend", html)
        document.addEventListener("click", e => {
          let sea = eleget0('form.search-field > div > input')
          let since = (e?.target?.dataset.since)
          let until = (e?.target?.dataset.until)
          if (since) {
            sea.value = sea?.value?.replace(/\ssince\:[\d\-]*/, "")?.trim() + ` since:${since}-01-01`;
            eleget0('form[class*="search-field"] > button')?.focus();
          }
          if (until) {
            sea.value = sea?.value?.replace(/\suntil\:[\d\-]*/, "")?.trim() + ` until:${until}-12-31`;
            eleget0('form[class*="search-field"] > button')?.focus();
          }
        })
      }
    })();
    (function() {
      addAutoDiscovery();
      setTimeout(addAutoDiscovery, PERNOW); //addAutoDiscovery();

      // URLが変化したら再実行
      var href = location.href;
      var observer = new MutationObserver(function(mutations) {
        if (href !== location.href) {
          href = location.href;
          setTimeout(addAutoDiscovery, PERNOW);
        }
      });
      observer.observe(document, { childList: true, subtree: true });

      return;

      function addAutoDiscovery() { // Twitter検索へのRSSリンクとRSS Autodiscoveryを埋め込む
        for (let ele of elegeta('//*[@class="multirss"]')) ele.remove();
        //新2ペイン
        if (location.href.indexOf("/search?") != -1) { // 文字列検索
          //embedAutoDiscovery('//input[@placeholder="キーワード検索"]|//input[@name="q"]', /(.)/, "$1", "*** | Nitter Twitterキーワード", "https://" + NITTER_INSTANCE + "/search/rss?f=tweets&q=***")
          //embedAutoDiscovery('//input[@placeholder="キーワード検索"]|//input[@name="q"]', /(.)/, "$1", "*** | Nitter Twitterキーワード 画像か動画", "https://" + NITTER_INSTANCE + "/search/rss?f=tweets&q=***+(filter:images OR filter:videos)")
          //embedAutoDiscovery('//input[@placeholder="キーワード検索"]|//input[@name="q"]', /(.)/, "$1", "*** | Nitter Twitterキーワード 日本語ツイートのみ", "https://" + NITTER_INSTANCE + "/search/rss?f=tweets&q=***+lang:ja")
          //embedAutoDiscovery('//input[@placeholder="キーワード検索"]|//input[@name="q"]', /(.)/, "$1", "*** | Nitter Twitterキーワード 日本語ツイートのみ 画像か動画", "https://" + NITTER_INSTANCE + "/search/rss?f=tweets&q=***+lang:ja+(filter:images OR filter:videos)")
        } else { // ユーザー
          //embedAutoDiscovery(TWITTER_USERHOME_USERNAME_XPATH, /(^@)/, "", "from:*** | Nitter Twitterユーザー", "https://" + NITTER_INSTANCE + "/***/rss")
          //embedAutoDiscovery(TWITTER_USERHOME_USERNAME_XPATH, /(^@)/, "", "from:*** | Nitter Twitterユーザー 画像か動画", "https://" + NITTER_INSTANCE + "/***/media/rss")
          //          embedAutoDiscovery(TWITTER_USERHOME_USERNAME_XPATH, /(^@)/, "from:@", "from:*** (filter:videos) | Queryfeed Twitterユーザー 動画", "https://Queryfeed.net/tw?q=***%20(filter:videos)")

          // twicomiへのリンク
          let ele = eleget0(TWITTER_USERHOME_USERNAME_XPATH) || eleget0('a.profile-card-username');
          if (ele && !eleget0('//a[@id="twicomi"]')) {
            //$(ele).after('<a id="twicomi" class="multirss" rel=\"noopener noreferrer nofollow\" style=\" background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:12px; font-weight:normal; color:#606060; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4); \" href="https://ja.whotwi.com/' + ele.innerText.replace(/^@/, "").trim() + '">whotwi</a>')
            $(ele).after(`<a id="twicomi" class="multirss" rel=\"noopener noreferrer nofollow\" style=\" display:inline-block; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:12px; font-weight:normal; color:#606060; margin:0px 2px; text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4); \" href="https://duckduckgo.com/?q=!ducky+${ele?.innerText?.trim()}+site:https://twiman.net/user">ツイマンガ</a>`)
            $(ele).after('<a id="twicomi" class="multirss" rel=\"noopener noreferrer nofollow\" style=\" display:inline-block; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:12px; font-weight:normal; color:#606060; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4); \" href="https://twicomi.com/author/' + ele.innerText.replace(/^@/, "").trim() + '/">ツイコミ</a>')
            $(`<span id="fromsearch" class="multirss" title="${ele.innerText.trim()}さんのツイートを文字列で検索\nhttps://${document.domain}/search?q=from:${ele.innerText.trim()}%20《文字列》&src=typd&f=live&vertical=default" rel=\"noopener noreferrer nofollow\" style=\" display:inline-block; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:12px; font-weight:normal; color:#606060; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4);" >&#128269;ツイート</span>`).on("click", () => { var input = prompt(`${ele.innerText.trim()}さんのツイートを文字列で検索\n|、｜は OR に置き換えます\n\nhttps://${document.domain}/search?q=from:${ele.innerText.trim()}%20《文字列》&src=typd&f=live&vertical=default\n\n`); if (input !== null) { window.open(`https://${document.domain}/search?q=from:${ele.innerText.trim()}%20${input.replace(/\||｜/gmi," OR ")}&src=typd&f=live&vertical=default`) || "" }; }).insertAfter($(ele));
            $(`<span id="fromsearch" class="multirss" title="${ele.innerText.trim()}さんのツイートを文字列で検索（画像か動画付き）\nhttps://${document.domain}/search?q=from:${ele.innerText.trim()}%20《文字列》%20$%28filter%3Aimages%20OR%20filter%3Avideos%29&src=typd&f=live&vertical=default" rel=\"noopener noreferrer nofollow\" style=\" display:inline-block; background-color:#ffffff; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; font-size:12px; font-weight:normal; color:#606060; margin:0px 2px;  text-decoration:none; text-align:center; padding:0px 7px 1px; border:outset #909090 1px; border-radius:5px; background: linear-gradient(#fefefe, #f4f4f4);" >&#128269;画像/動画</span>`).on("click", () => { var input = prompt(`${ele.innerText.trim()}さんのツイートを文字列で検索（画像か動画付き）\n|、｜は OR に置き換えます\n\n空欄のままEnterを押すと単に画像か動画付きツイートのみを表示します\n\nhttps://${document.domain}/search?q=from:${ele.innerText.trim()}%20《文字列》%20%28filter%3Aimages%20OR%20filter%3Avideos%29&src=typd&f=live&vertical=default\n\n`); if (input == "" || input > "") { window.open(`https://${document.domain}/search?q=from:${ele.innerText.trim()}%20${input.replace(/\||｜/gmi," OR ")}%20%28filter%3Aimages%20OR%20filter%3Avideos%29&src=typd&f=live&vertical=default`) || "" }; }).insertAfter($(ele));
          }
        }
        return;
      }

      function embedAutoDiscovery(wordXP, wordtermRE, replaceStr, itemName, url) {
        //    if (location.href.indexOf("google") == -1) return
        var ele = eleget0(wordXP);
        if (!ele) return;
        var word = ele.innerText || ele.value;
        if (!word) return;
        if (itemName.match("日本語ツイートのみ") && !(word.match(/^[\x20-\x7e]*$/))) return;
        word = word.replace(/(\(filter\:videos\)|\(filter\:images OR filter\:videos\))/gmi, "").trim();
        //        if (itemName.match(/\(En\)/) && !(word.match(/^[\x20-\x7e]*$/))) return; // google news en なら半角英数以外を含んだらやらない

        var link = eleget0('//head').appendChild(document.createElement("link"));
        link.title = itemName.replace("***", word);
        link.rel = "alternate"
        link.type = "application/rss+xml"
        link.className = "multirss";
        link.href = url.replace("***", encodeURIComponent(word.replace(wordtermRE, replaceStr)));

        //旧3ペイン
        //var place = eleget0('//div/h2/a/span[@class="username u-dir"]|//h1[@class="SearchNavigation-titleText"]');
        //新2ペイン
        //var place = eleget0('//div/h2/a/span[@class="username u-dir"]|//h1[@class="SearchNavigation-titleText"]|//div[@aria-haspopup="false"]/div/div[1]/div/span/span|//div/div/div/div[1]/div/h2[@aria-level="2" and @role="heading"]/span|/HTML/BODY/DIV[1]/DIV[1]/DIV[1]/DIV[2]/MAIN[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/SPAN[1]|/HTML/BODY/DIV[1]/DIV[1]/DIV[1]/DIV[2]/MAIN[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/SPAN[1]|//input[@placeholder="キーワード検索"]/../..');
        var place = eleget0('//div/h2/a/span[@class="username u-dir"]|//h1[@class="SearchNavigation-titleText"]|//div[@aria-haspopup="false"]/div/div[1]/div/span/span|//div/div/div/div[1]/div/h2[@aria-level="2" and @role="heading"]/span|' + TWITTER_USERHOME_USERNAME_XPATH + '|//input[@placeholder="キーワード検索"]/../../..|//form[@class="search-field"]') || eleget0('a.profile-card-username');

        if (!place) return;
        var url = link.href;
        var ele = place.appendChild(document.createElement('span'));
        ele.className = "multirss";
        ele.setAttribute("style", "font-weight:normal;display:inline;");
        let rssICON = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABdUlEQVQ4ja3TL2iWURTH8c+VJwwxjjeMBQUxGRdkGESHBothw3CDwfTaFiwDm1MQViyiQRG8iviCYBAGKg60GEwm/2AZQ8bixIXxXsNzH717dSLiKYdzOHzv+Z17TsjJcdzEOBrs0VrnOxtWfhsb6IecfMBB/2Yfm/IyPMXbAjuKyb8A9JrSNqyE6BrkBKZxEWf+AGhCTr5iL+7hDt6FaL2ryMkM7mLiN4CtkJNvGKuSQ7zBEgYhkpNJPMehUUA96VuYw3XsxyMs52Q8RKs4gbXRFmrApxANQjSPA7iMGaxUkHOjgFrCSzzEkxDbl3Iyiwd4gVNFzmM/B7tDwjHcwOecLOREiAa4gpOYLXVLu0kYYoBnWMRCyV/FF8yX+BVWa0C3ordDNBei09qlupSTiRBt4T6O5KQX4g/IL4DNqpvNMpdO6+tSe7jE77uuG+1hwIWygWOV3rM52af9FTifkylMlXj7vxxTXzv9np3nvJt157yO/nf0A3GlIF+BggAAAABJRU5ErkJggg==">';
        ele.innerHTML = " <a style='margin:0 0.25em 0 0;' href=" + link.href + " rel=\"noopener noreferrer nofollow\" title='" + link.title + "\n" + link.href + "'>" + rssICON + "</a>";
        return;
      }

      function addLink(site, placexpath, terms, beforetitle, title, append, deleteoption, option) {
        if (location.href.indexOf(site) == -1) return;
        var place = eleget0(placexpath);
        if (!place) return;
        var url = window.location.href;
        if (terms !== "") url = url.replace(/&tbm=.*/, "");
        if (terms !== "none") url = url + terms;
        url = url.replace(deleteoption, '') + option;
        var ele = document.createElement('span');
        ele.className = "multirss";
        ele.setAttribute("style", "font-weight:normal;");
        ele.innerHTML = beforetitle + "<a href=" + url + " rel=\"noopener noreferrer nofollow\">" + title + "</a>" + append;
        place.appendChild(ele);
        return;
      }
    })();
  }

  function elegeta(xpath, node = document) {
    if (!xpath || !node) return [];
    //    let xpath2 = xpath.replace(/:inv?screen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
    let xpath2 = xpath.replace(/:inscreen|:visible|:text\*=[^:]*/g, "") // text*=～中で:は使えない
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
      else if (/:inscreen/.test(xpath)) array = array.filter(e => { var eler = e.getBoundingClientRect(); return (eler.bottom >= 0 && eler.right >= 0 && eler.left <= document.documentElement.clientWidth && eler.top <= document.documentElement.clientHeight) }) // 画面内に1ピクセルでも入っている
      if (/:text\*=./.test(xpath)) { let text = xpath.replace(/^.*:text\*=([^:]*)$/, "$1"); if (text) array = array.filter(e => new RegExp(text).test(e?.textContent)) }
    } catch (e) { return []; }
    return array
  }

  function eleget0(xpath, node = document) {
    if (!xpath || !node) return null;
    //    if (/:inv?screen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (/:inscreen|:visible|:text\*=/.test(xpath)) return elegeta(xpath, node)?.shift();
    if (!/^\.?\//.test(xpath)) return node.querySelector(xpath);
    try {
      var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      return ele.snapshotLength > 0 ? ele.snapshotItem(0) : null;
    } catch (e) { alert(e + "\n" + xpath + "\n" + JSON.stringify(node)); return null; }
  }

  function lh(re) { let tmp = location.href.match(re); if (!tmp) { return null } else if (tmp.length > 1) { return tmp[1] } else return tmp[0] } // gフラグ不可
})();
