// ==UserScript==
// @name        TED Talksを楽しむ
// @description TEDで講演者名でAmazon検索リンク追加、URLからパラメータを除去、ページタイトルの最初の:を除去　Google検索結果とted-jaにTED Talk日本語書き起こし記事を検索するリンクを設置
// @include     *://www.google.co.jp/search?*
// @include     *://www.ted.com/talks/*
// @match       *://www.ted-ja.com/*
// @run-at document-idle
// @version     0.3.6
// @grant       none
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/371419/TED%20Talks%E3%82%92%E6%A5%BD%E3%81%97%E3%82%80.user.js
// @updateURL https://update.greasyfork.org/scripts/371419/TED%20Talks%E3%82%92%E6%A5%BD%E3%81%97%E3%82%80.meta.js
// ==/UserScript==

(function() {
  let a;
  if (/^https?:\/\/www\.ted\.com\/talks\//.test(location.href)) {
    a = document.title.match(/.*(?=「)|[；:]?.*(?=[：:])/); // 講演者名をタイトルからも取得を試みる
    if (a) {
      var author1 = a;
    }
    var ele = eleget0('//meta[@name="author"]');
    if (ele.content || author1) { //alert(ele.content || author1)
      var node = document.body.appendChild(document.createElement('span'));
      node.innerHTML = "<a href=\"https://www.amazon.co.jp/s?k=" + (ele.content || author1) + "\" rel=\"noopener noreferrer nofollow\" >Amazonで" + (ele.content || author1) + "を検索</a>";
      node.setAttribute("style", "max-width:95%; right:0; bottom:0; z-index:2147483647; opacity:" + 0.9 + "; text-align:left; line-height:1.1; position:fixed; font-size:15px; margin:8px;  text-decoration:none; padding:8px 8px; border-radius:7px; background-color:#eeffff; color:#0000ff;  box-shadow:5px 5px 8px #0004; border:2px solid #fff; font-family: 'MS UI Gothic','Meiryo UI','Yu Gothic UI','Arial',sans-serif;");
    }

    setInterval(function() {
      document.title = document.title.replace(/^[：:] /, "");
    }, 3000);
  }

  // Googleにリンク追加
  addLink2(/^https?:\/\/www\.google\..*\/search\?/, "//div[@id='gkbPanel']", "", " ", "TED", "　", "", "https://www.google.co.jp/search?q=***+site:https://www.ted.com/talks/*/transcript%3Flanguage=ja&lr=lang_ja");

  // ted-jaにリンク追加
  if (/^https?:\/\/www\.ted-ja\.com\//.test(location.href)) {
    domNI();
    document.body.addEventListener('AutoPagerize_DOMNodeInserted', function(evt) {
      domNI(evt.target);
    }, false); // uAutoPagerizeの継ぎ足し部分だけに付ける
  }

  var txt1 = location.href;
  var txt2 = txt1;
  if (/^https?:\/\/www\.ted\.com\/talks/.test(txt1)) // URLのパラメータ除去
    txt2 = deleteParam(["awesm=", "utm_medium=", "share=", "utm_source=", "utm_campaign=", "utm_content=", "source=", "embed=", "t-", "frm_id=", "device_id=", "fb_action_ids=", "action_type_map=", "action_object_map=", "fb_source=", "fb_action_types", "action_ref_map=", "ref=", "refid=", "_ft_=", "guid="], txt1);
  window.history.pushState(null, null, txt2);

  return;

  function addLink2(site, placexpath, terms, beforetitle, title, append, deleteoption, option, language = "all") {
    if (site.test(location.href) === false) return;
    var place = eleget0(placexpath);
    if (!place) return;

    let searchWord = eleget0('//input[@aria-label="検索"]|//input[@aria-label="Search"]|//input[@type="text" and @name="q" and @id="search_form_input" and @autocorrect="off"]|//input[@name="q" and @aria-label="Search"]').value;
    if (language == "notJP" && !(searchWord.match(/^[\x20-\x7e]*$/))) return; // 半角英数以外を含んだらやらない
    searchWord = searchWord.replace(/.site:reddit\.com|.site:quora.com|.site:https:\/\/www\.ted\.com\/.*/gm, "");

    var ele = place.appendChild(document.createElement('span'));
    ele.innerHTML = beforetitle + "<a referrerpolicy='no-referrer' rel='nofollow noopener noreferrer' href=\"" + option.replace('***', encodeURIComponent(searchWord).replace(deleteoption, "")) + "\"" + " >" + title + "</a>" + append;
  }


  function domNI(node = document) {
    addLink(node, "ted-ja", '//h3[@class="post-title entry-title"]', "<a href='https://www.google.com/webhp?#btnI=I&q=***%20site:https://www.ted.com/talks/*/transcript%3Flanguage=ja&lr=lang_ja' rel=\"noopener noreferrer nofollow\" >TEDで読む</a>");
  }

  function addLink(node, inurl, xpath, newurl) {
    if (location.href.indexOf(inurl) == -1) return
    for (let ele of elegeta(xpath, node)) {
      var link = document.createElement("span");
      link.innerHTML = newurl.replace("***", encodeURIComponent(ele.innerText));
      var bgcol = "background-color:#c9e9ff;";
      link.setAttribute("style", "font-size:14px; font-weight:bold; margin:2px;  text-decoration:none; text-align:center; padding:1px 7px 1px; border-radius:5px; " + bgcol);
      ele.appendChild(link);
    }
    return;
  }

  function elegeta(xpath, node = document) {
    var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var array = [];
    for (var i = 0; i < ele.snapshotLength; i++) array[i] = ele.snapshotItem(i);
    return array;
  }


  function eleget0(xpath) {
    var ele = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    return ele.snapshotLength > 0 ? ele.snapshotItem(0) : "";
  }

  function deleteParam(cutREs, txt1) { //余計なパラメータを除去
    var para = txt1.split(/[&?#]/);
    var txt2 = para[0] + "?";
    var j = 0;
    for (var i = 1; i < para.length; i++) {
      for (let reptxt of cutREs) {
        para[i] = para[i].replace(new RegExp("^" + reptxt + ".*"), "");
      }
      if (para[i] !== "") {
        txt2 += (j++ > 0 ? "&" : "") + para[i];
      }
    }
    return txt2.replace(/\?$/, ""); //行末が?なら削除
  }


})();
