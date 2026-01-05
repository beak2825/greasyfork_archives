// ==UserScript==
// @name        hitomi.la_zh-TW
// @namespace   hitomi.la TW
// @description 這是在 hitomi.la 網站上運作的腳本，主要是將網頁中的類型、語言、分類標籤和系列英語部分換成中文，以便於了解作品的資訊。
// @version     13.4
// @include     *://hitomi.la/*
// @compatible  chrome >=55
// @icon        https://ltn.hitomi.la/apple-touch-icon-57x57.png
// @downloadURL https://update.greasyfork.org/scripts/23864/hitomila_zh-TW.user.js
// @updateURL https://update.greasyfork.org/scripts/23864/hitomila_zh-TW.meta.js
// ==/UserScript==

const TranslatioDataURL = "https://raw.githubusercontent.com/zxc129567142/hitomi.la_zh-TW/master/TranslatioData.min.json";
let topbar = {},
  booktypes = {},
  lang = {},
  bookseries = {},
  booktags = {},
  // 修改 Daily 的值能夠改變更新翻譯數據的頻率
  // 預設值 7
  Daily = 7,
  nowTime = (new Date).getTime(),
  TimeD = 0,
  url = location.pathname; // 變數 url 設成當前網址路徑部分

const tEng = {
  // 將標題轉成網址格式
  h3ToURL: str => {
    str = str.toLowerCase();
    return (str === "recently added") ? "index" : str // encodeURI(str).replace(/\./g, "%2E").replace(/\-/g, "%2D");
  },
  // 簡單判斷翻譯工作區
  tocht: (chgThis, txt, cht) => {
    if (chgThis.textContent.match(txt)) {
      chgThis.title = txt;
      chgThis.textContent = cht
    }
  },
  // 用於 頂部分類類型
  topbar: topbar_obj => {
    const topbartext = topbar_obj.textContent;
    if (topbar[topbartext]) {
      topbar_obj.title = topbartext;
      topbar_obj.textContent = topbar[topbartext];
    }
  },

  //用於 頂部語言
  //
  //var lang = {
  //  lang_eng: {
  //    "cht": lang_cht,
  //    "url": lang_url
  //  },
  //}

  topbarLang: lang_obj => {
    const toplangtext = lang_obj.textContent;
    const h3 = document.querySelector("h3");
    const Title_h3 = h3.getAttribute("title") || h3.textContent;
    const weburl = url.match("\/(galleries|manga|anime|doujinshi|gamecg|cg)\/");
    if (!lang[toplangtext]) {
      console.log(toplangtext);
      return false
    }
    const lang_url = lang[toplangtext].url;

    // console.log(lang_obj.innerHTML.match(lang_url) , lang_obj.innerHTML === toplangtext);
    const RegExpUrl = new RegExp((tEng.h3ToURL(Title_h3) === "index" && lang_url === "all") ? "^\/$" : "(" + tEng.h3ToURL(Title_h3) + "\-" + lang_url + ")", "g");
    if (RegExpUrl.test(lang_obj.getAttribute("href")) || weburl) {
      lang_obj.title = toplangtext + " \( " + lang_url + " \)";
      lang_obj.textContent = lang[toplangtext].cht;
    }
  },
  //用於 語言
  lang: lang_obj => {
    const langText = lang_obj.textContent;
    if (lang[langText]) {
      lang_obj.title = langText + " \(" + lang[langText].url + "\)";
      lang_obj.textContent = lang[langText].cht;
      return;
    }
    lang_obj.title = langText.toUpperCase();
  },
  //用於 類型
  types: types_obj => {
    const typeText = types_obj.textContent.replace(/(^\s+)|(\s+$)/g, "");
    if (booktypes[typeText]) {
      types_obj.title = typeText;
      types_obj.textContent = booktypes[typeText];
      return;
    }
    types_obj.title = typeText.toUpperCase();
  },
  //用於 系列
  series: series_obj => {
    const seriesText = series_obj.textContent;
    if (bookseries[seriesText]) {
      series_obj.title = seriesText;
      series_obj.textContent = bookseries[seriesText];
      return;
    }
    series_obj.title = seriesText.toUpperCase();
  },
  //用於 標籤
  tags: tags_obj => {
    const tagText = tags_obj.textContent;
    if (booktags[tagText]) {
      tags_obj.title = tagText;
      tags_obj.textContent = booktags[tagText];
      return;
    }
    tags_obj.title = tagText.toUpperCase();
  }
};

(function () {
  "use strict";
  localStorage.setItem("hitomi.la_zh-TW", "loading");

  // 只要有任何一個不存在就重新下載 json 檔
  if (!localStorage.hasOwnProperty("LastUpdata") ||
      !localStorage.hasOwnProperty("topbar") ||
      !localStorage.hasOwnProperty("booktypes") ||
      !localStorage.hasOwnProperty("lang") ||
      !localStorage.hasOwnProperty("bookseries") ||
      !localStorage.hasOwnProperty("booktags")) {
    // 缺少
    gtd(true);
  } else {
    // 完整
    TimeD = (nowTime - localStorage.getItem("LastUpdata")) / 1000;
    Daily = Daily * 24 * 3600;
    if (TimeD > Daily) {
      // 資訊完整 但 達到資料更新時間
      gtd(true);
    } else {
      topbar = JSON.parse(localStorage.getItem("topbar"));
      booktypes = JSON.parse(localStorage.getItem("booktypes"));
      lang = JSON.parse(localStorage.getItem("lang"));
      bookseries = JSON.parse(localStorage.getItem("bookseries"));
      booktags = JSON.parse(localStorage.getItem("booktags"));

      _TopBottom();
    }
  }

  function gtd(autoUpdata) {
    localStorage.setItem("LastUpdata", nowTime);
    fetch(TranslatioDataURL + "?_=" + nowTime, {cache: "no-cache"})
      .then(r => r.json())
      .then(data => {
        localStorage.setItem("topbar", JSON.stringify(data.topbar));
        localStorage.setItem("booktypes", JSON.stringify(data.booktypes));
        localStorage.setItem("lang", JSON.stringify(data.lang));
        localStorage.setItem("bookseries", JSON.stringify(data.bookseries));
        localStorage.setItem("booktags", JSON.stringify(data.booktags));

        topbar = JSON.parse(localStorage.getItem("topbar"));
        booktypes = JSON.parse(localStorage.getItem("booktypes"));
        lang = JSON.parse(localStorage.getItem("lang"));
        bookseries = JSON.parse(localStorage.getItem("bookseries"));
        booktags = JSON.parse(localStorage.getItem("booktags"));

        localStorage.setItem("nowSeriesNum", Object.keys(bookseries).length);
        localStorage.setItem("nowTagsNum", Object.keys(booktags).length);

        if (autoUpdata) {
          console.log("資料更新成功");
          _TopBottom();
        } else {
          console.log("手動資料更新成功");
          $(".navbar nav").append("<div id=\"Notice\"><span>翻譯資料更新成功</span></div><style>#Notice{background-color:rgba(204, 255, 255, 0.9);border-radius:10px;border-top-right-radius:0;border-top-left-radius:0;position:fixed;top:-50px;left:50%;transform:translate(-50%,0);animation:Notice 1s linear}#Notice span{color:#666;display:block;font-weight:bold;margin:10px 63px}@keyframes Notice {0%{top:-50px}35%{top:0}85%{top:0}100%{top:-50px}}</style>");
        }
      })
      .catch(e => {
        console.log("資料取得失敗");
        $(".navbar nav").append("<div id=\"Notice\"><span>資料取得失敗</span></div><style>#Notice{background-color:rgba(255, 204, 204, 0.9);border-radius:10px;border-top-right-radius:0;border-top-left-radius:0;position:fixed;top:-50px;left:50%;transform:translate(-50%,0);animation:Notice 2s linear}#Notice span{color:#666;display:block;font-weight:bold;margin:10px 63px}@keyframes Notice {0%{top:-50px}35%{top:0}85%{top:0}100%{top:-50px}}</style>");
        throw new Error(e);
      });
  }

  // 變數 LoadingStatus 0 為正在載入
  //                    1 為載入完成
  // let LoadingStatus = 0;

  // 是否在"全部系列"
  let inallsatc = false;
  // WaitLoad() 等待載入
  function WaitLoad() {
    const loader_content = $("#loader-content");
    const gallery_content = $(".gallery-content");
    if (loader_content.length == 1 || gallery_content.children().length === 0) {
      if (loader_content.attr("style") == "display: none;" && gallery_content.children().length > 0) {
        // 這是給搜尋頁面用的
        window.setTimeout(()=>{RunTranslation();}, 150);
      } else {
        Timeout();
      }
    } else {
      window.setTimeout(()=>{RunTranslation();}, 200);
    }
  }

  // Timeout()
  // 正規表達式 /all(tags|artists|series|characters)|reader/ (在字串中搜索"all"、"reader"字串)
  // 若 hitomi.la 為"全部"和"閱讀"頁面則一百五十毫秒後呼叫 RunTranslation()
  // 若是則二百五十毫秒後呼叫 WaitLoad()
  function Timeout() {
    // 變數 regex 用來儲存正規表示式
    const regex = /all(tags|artists|series|characters)|reader/;
    if (url.match(regex)) {
      window.setTimeout(()=>{RunTranslation()}, 150);
    } else {
      window.setTimeout(()=>{WaitLoad()}, 250);
    }
  }

  // RunTranslation()
  // 依序呼叫 _ModifyCSS() _ADRemove() _HotKey()
  let YouPosition;

  function RunTranslation() {
    document.querySelector(".navbar")
      .insertAdjacentHTML("beforeend","<a id=\"TIMER\" style=\"color: rgb(255, 255, 255);font-weight: bold;\"></a>");

    YouPosition = url.split("\/")[1].split(/\-|\./);
    switch (YouPosition[0]) {
      case "manga":
      case "anime":
      case "doujinshi":
      case "gamecg":
      case "cg":
      case "galleries": {
        console.log("========= 畫廊資訊區 =========");
        setTimeout(() => {
          _TranslationH3();
          document.querySelectorAll(".tags")[1].parentElement.classList.add("relatedtags");
          _TranslatioGalleries();
          _TranslatioGalleriesInfo();
        }, 50);
        break;
      }
      case "reader": {
        console.log("========= 畫廊閱讀區 =========");
        setTimeout(() => {
          _TranslationReader();
        }, 10);
        break;
      }
      case "alltags": {
        console.log("========= 全部-標籤 =========");
        _TranslationAll();
        break;
      }
      case "allartists": {
        console.log("========= 全部-畫家 =========");
        _TranslationAll();
        break;
      }
      case "allseries": {
        console.log("========= 全部-系列 =========");
        _TranslationAll();
        _TranslationAllSeries();
        break;
      }
      case "allcharacters": {
        console.log("========= 全部-角色 =========");
        _TranslationAll();
        break;
      }
      case "search": {
        console.log("========= 搜索區 =========");
        setTimeout(() => {
          _TranslationSearchH3();
          _TranslatioGalleries();
          _TranslationSearch();
          _HotKey();
        }, 10);
        break;
      }
      default: {
        console.log("========= ♥♥♥♥♥ =========");
        setTimeout(() => {
          _TranslationH3();
          _TranslationOrderBy();
          _TranslatioGalleries();
        }, 10);
      }
    }
    if (url.search("reader") < 0) _ModifyCSS();
    _ADRemove();
    if (url.search("search") < 0) _HotKey();
    localStorage.setItem("hitomi.la_zh-TW", "success");
  }

  function _TopBottom() {
    _TranslationTopInfo();
    if (url.search("reader") < 0) {
      const GreasyForkIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII="
      const NeocitiesIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURSgwPSkxPisyPiw0QS82QzE0QDA4RDE4RTQ8SDU9STlBTTtCTj5FUT9HUkQ8RkFIVElQW0pRXE1TXlxGTU9VYFddZ1ddaFlgaltha2NJT2tMUnRQVH9UV2FmcGNpcmtwenR4gXh9hXyBiX6Di49bXJBcXJhfX7FqZr5vasNxbMlzbcp0bsx1b852b899d9B2cNF3cdJ4cdF6c9R5ctR5c9R6c9R6dIKGjoWGjYuAhYiMk42SmJGKkJGVnJSXnpuepJ6ip6GDhamssa2wtbO1urO2u7S2urS2u7u+wsyLh8ORj9iJg9uQituSjNyUj92Xkd2ZlN6cl9+fmuChneWxrOayruazr+azsOe2surAvevCv8rMz9HT1dPV1+Lj5OTm5/bk4vnt7Pnu7fPz9PX19fb29/f3+Prx8fry8vz29vz49/n5+fr6+v36+v77+/z8/Pz9/f7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIHOprIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAAExSURBVDhPzZJXU8JAGEWzESyggIK9odgVFaOxi4q9994r2P3+/4Ob3UtkNpnR8cnzkLl779k8ZKKxH1AE33DMgwgUYYloChEowhnRPCJwCouI4JdCoV8SvCQ6L8ahQEyWoCUfyIXb5qwQeRfFzcHmcYbo+nDj5EkUz34IjeKY2RoyzN301dqgYe5/iqo8RxiPzgwYnPVV69k7Gp3lZWWOUMJaE9Yk6athDQ4h3IOV0xlwEbzt9isSLcxF0Ku7s3tHwE1gel1cCl1hXroIzNvWb+3xWp4dwnSMM7HMd3NlxMoLiiB53DbMvVcciCogRD5QEKV3jr73ex8EbfIFFf/gbwhEd006BMaKSiVlF0SnIZlD+fK2EGz+/EfZ/BNhDhEoQopoDBEogqe+Kg8RKIIKY1+/n4FUrpnHnQAAAABJRU5ErkJggg=="
      $(".container").append("<style>div#lang-drop{width:135px;padding-top:13px;}ul#lang-list a{display:block}</style>");
      $(".navbar>nav>ul").append("<li id=\"cht_help\"><a title=\"hitomi.la_zh-TW\">腳本問題 <img src=\"//ltn.hitomi.la/down-arrow.png\"></a><div id=\"cht_help_drop\"><ul id=\"cht_help_list\"><li><span>系列翻譯數：" + localStorage.getItem("nowSeriesNum") + "</span></li><li><span>標籤翻譯數：" + localStorage.getItem("nowTagsNum") + "</span></li><li><a id=\"update\">手動更新數據</a></li><li><a href=\"https://goo.gl/iurbA6\" target=\"_blank\">中文化問題</a></li><li><hr></li><li><a href=\"https://greasyfork.org/zh-TW/scripts/23864-hitomi-la-zh-tw\" target=\"_blank\"><img src='" + GreasyForkIcon + "' alt=\"greasyfork icon\" >Greasy Fork</a></li><li><a href=\"https://zxc129567142.neocities.org/hitomi_la_zh_tw/index.html\" target=\"_blank\"><img src='" + NeocitiesIcon + "'>Neocities</a></li></ul></div></li>");
      $(".navbar>nav").append("<style>#cht_help_drop{display:none;position:absolute;margin:0px;padding:0px 15px;padding-top:13px;z-index:99999;background-color:#29313d;left:0px;right:0px;max-height:500px;width:155px;}#cht_help:hover #cht_help_drop{display:block;}#cht_help_list li{color:#aaa;display:block;position:relative;margin-bottom:10px;}#cht_help_list a,#cht_help_list span{color:inherit;display:block;padding:0px;text-decoration:none;text-transform:none;font-weight:normal;}#cht_help_list a{cursor:pointer;}#cht_help_list a:hover{color:#fff;font-weight:bold;}#cht_help_list span{cursor:default;}#cht_help_list img{vertical-align:middle;margin-right:5px;width:20px;}#cht_help_list svg{margin-right:5px;}</style>");
    }
    _TranslationBottomDonate();
    $("#update").one('click', () => {
      gtd(false);
    });
    Timeout();
  }

  //翻譯上方的導覽列
  function _TranslationTopInfo() {
    //頂部分類類型
    $(".navbar a").each((i, v) => {
      tEng.topbar(v);
    });

    //頂部語言
    const lang = document.querySelector("li#lang>a")
    if (lang){
      if (lang.textContent.trim() === "language") lang.innerHTML = "語言 <img src='//ltn.hitomi.la/down-arrow.png'>";
    }


    const interval = setInterval(() => {
      const lang_list = document.querySelectorAll("#lang-list a");
      if (lang_list.length > 1) {
        clearInterval(interval);
        for (const item of lang_list) {
          // console.log(item);
          tEng.topbarLang(item);
        }
      }
    }, 500 )

    //頂部搜尋
    if ($(".header-table").length > 0) {
      $("button#search-button").text("搜尋");
      let search_hint = "你可以使用組合條件 \"female:yuri -female:futanari\"，此範例會尋找含有 \"yuri\" 但不含 \"futanari\"。"
      search_hint += "\n當要輸入帶有空白的標籤使用 \"_\" 字符。"
      search_hint += "\n更多範例:"
      search_hint += "\n\"series:kantai_collection type:doujinshi female:big_breasts\"，會尋找含有 \"系列:艦隊收藏\"、\"類型:同人誌\"、\"巨乳 ♀\" "
      search_hint += "\n\"type:artistcg female:milf -male:yaoi language:chinese\"，會尋找含有 \"類型:美術 CG\"、\"熟女 ♀\"、\"語言:中文\" 但不包含 \"男同(BL) ♂\" "
      search_hint += "\n\"artist:andou_tomoya -type:gamecg series:love_live\"，會尋找含有 \"畫家:Andou Tomoya\"、\"系列:Love Live\" 但不包含 \"類型:遊戲 CG\" "
      $(".search-input#search").attr("title", search_hint);
    }
  }

  //翻譯畫廊相關
  function _TranslatioGalleries() {
    //分類
    const cata = {
      "Series": "系列",
      "Type": "類型",
      "Language": "語言",
      "Tags": "標籤",
      "Group":  "群組",
      "Characters": "角色",
    }
    document.querySelectorAll("tr td:nth-of-type(1)").forEach(v => {
      const text = v.textContent

      switch (text) {
        case "Series":
          if (v.nextElementSibling.firstElementChild)
            v.nextElementSibling.firstElementChild.className = "comma-list";
        case "Type":
        case "Language":
        case "Tags":
        case "Group":
        case "Characters":
          v.title = text;
          v.textContent = cata[text];
          break;
        default: {
          console.log("例外 分類: " + text);
        }
      }
    });

    //語言
    document.querySelectorAll("tr:nth-of-type(3) td:nth-of-type(2) a")
      .forEach(item => {
        tEng.lang(item);
      })

    //類型
    document.querySelectorAll("tr:nth-child(2) td:nth-child(2) a")
      .forEach(item => {
        tEng.types(item);
      })

    //系列
    document.querySelectorAll("table .comma-list a")
      .forEach(item => {
        tEng.series(item);
      })

    //標籤
    document.querySelectorAll(".relatedtags a")
      .forEach(item => {
        tEng.tags(item);
      })

    //當群組、系列、語言為"N/A"
    document.querySelectorAll("tr:not(:last-of-type) td:nth-of-type(2)")
      .forEach(item => {
        tEng.tocht(item, "N/A", "無");
      })

    //當作者名為"N/A"
    document.querySelectorAll("div.artist-list")
      .forEach(item => {
        tEng.tocht(item, "N/A", "無");
      })

  }

  //翻譯畫廊資訊頁面
  function _TranslatioGalleriesInfo() {
    //資訊頁面作者名為"N/A"
    document.querySelectorAll("h2")
      .forEach(item => {
        tEng.tocht(item, "N/A", "無");
      })

    //資訊頁面
    document.querySelectorAll(".cover-column h1").forEach( item => {
      switch (item.textContent) {
        case "Download":
          item.textContent = "下載"
          break;
        case "Read Online":
          item.textContent = "線上閱讀"
          break;
        default:
          break;
      }
    });

  }

  //翻譯h3標題
  function _TranslationH3() {
    //區塊h3標題
    const h3 = document.querySelector("div.list-title h3")
    switch (h3.textContent) {
      case "Recently Added": {
        tEng.tocht(h3, "Recently Added", "最近更新");
        break;
      }
      case "Popular": {
        tEng.tocht(h3, "Popular", "熱門度");
        break;
      }
      case "Related Galleries": {
        tEng.tocht(h3, "Related Galleries", "相關畫廊");
        break;
      }
      default: {
        console.log(h3.textContent);
      }
    }
  }

  //翻譯搜尋頁h3標題
  function _TranslationSearchH3() {
    //區塊h3標題
    const h3 = $("div.list-title h3");
    const engTxt = h3.text();
    const chtTxt = engTxt.replace("Results", "個結果");
    h3.attr("title", engTxt).text(chtTxt);
  }

  //翻譯搜尋頁
  function _TranslationSearch() {
    const pag_top = $(".page-top a")
    if (pag_top.length === 0) {
      const search_message = document.querySelector(".gallery-content .search-message");
      if (search_message.textContent == "No results") search_message.textContent = "無結果";
      return;
    }

    pag_top.one("click", () => {
      setTimeout(function _Search() {
        const loader_content = document.getElementById("loader-content");
        if (!loader_content) return;
        if (loader_content.style.display == "none" && $(".gallery-content").children().length > 0) {
          _TranslatioGalleries();
          _ModifyCSS();
          _HotKey();
          _TranslationSearch();
        } else {
          setTimeout(() => { _Search() }, 150);
        }
      }, 50);
    });
  }

  //翻譯"全部"頁面
  function _TranslationAll() {
    //"全部"頁面大標題
    let count = 0;
    let satc = [
        ["tags", "artists", "series", "characters"],
        ["標籤", "畫家", "系列", "角色"]
      ],
      atoz = ["123", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
      allh3 = $("div.list-title h3");
    inallsatc = true;
    for (let S = 0; S < satc[0].length; S++) {
      if (allh3.text().match(satc[0][S]) == satc[0][S]) {
        for (let A = 0; A < atoz.length; A++) {
          if (allh3.text().substr(-1) == atoz[A].substr(-1) && allh3.text().substr(0, 3) === "All") {
            allh3.text("全部字首 " + atoz[A] + " 的" + satc[1][S]);
            count++
          }
        }
      }
    }
    console.log(count);
  }

  //翻譯"全部"系列
  function _TranslationAllSeries() {
    //"全部"系列
    const ul_post = document.querySelectorAll("ul.posts a")
    if (ul_post.length > 0 && url.search("allseries") > 0) {
      ul_post.forEach(item => {
        tEng.series(item);
      });
    }
  }

  //翻譯閱讀頁面
  function _TranslationReader() {
    document.querySelectorAll(".brand")
      .forEach(item => {
        tEng.tocht(item, "Gallery Info", "畫廊資訊");
      });

    document.querySelectorAll(".navbar-nav a")
      .forEach((item)=>{
        const itemText = item.textContent.trim()
        const itemID = item.id

        if (itemText === "Next") item.innerHTML = "<i class='icon-chevron-left icon-white'></i>下一頁";
        if (itemText === "Prev") item.innerHTML = "上一頁<i class='icon-chevron-right icon-whitee'></i>";
        if (itemText === "Fullscreen") item.innerHTML = "<i class='icon-fullscreen icon-white'></i>全螢幕";
        if (itemText === "Full Spread") item.innerHTML = "<i class='icon-pause icon-white'></i>全頁";
        if (itemText === "Single Page") item.innerHTML = "<i class='icon-stop icon-white'></i>單頁";
        if (itemID === "fitVertical") item.innerHTML = "切合<i class='icon-resize-vertical icon-white'></i>";
        if (itemID === "fitHorizontal") item.innerHTML = "切合<i class='icon-resize-horizontal icon-white'></i>";
      });

    document.querySelectorAll(".input-medium option")
      .forEach(item => {
        tEng.tocht(item, item.innerHTML, "第 " + item.value + " 頁");
      });
  }

  //翻譯底部官方贊助
  function _TranslationBottomDonate() {
    //底部贊助
    const donate = document.querySelector("div.donate");
    if (!donate) return;
    const donateHTML = donate.querySelectorAll(".rss-icon")

    let cloneRSS = "";
    if (donateHTML.length > 0) cloneRSS = donate.innerHTML.replace(donate.textContent, "");
    if (donate.innerHTML.match("Donate BTC")) donate.innerHTML = cloneRSS + donate.textContent.replace("Donate BTC","贊助 BTC");
  }

  //翻譯排序方式
  function _TranslationOrderBy() {
    const header_option = document.querySelectorAll("div.header-sort-select option")

    header_option.forEach(itme => {
      tEng.tocht(itme, "Order by:", "排序方式");
      tEng.tocht(itme, "Date Added", "日期");
      tEng.tocht(itme, "Popularity", "熱門度");
    });

  }

  //修改CSS
  function _ModifyCSS() {
    const container = $(".container")
    container.append(
      inallsatc?
        "<style>h3{margin-top:5px;margin-bottom:5px;padding-left:0px;}div.top-content{padding-top:20px}.page-content ul{color:#d47972}</style>"
        :
        "<style>h3{margin-bottom:5px;padding-left:80px;}div.top-content{padding-top:15px}</style>"
      );

    $("div.gallery-info").find("tr").children("td:first-child").css("width", "50px");

    const djContent = document.querySelectorAll("div.dj-content")
    for (const content of djContent) {

    }
    $("div.dj-content").each((i, v) => {
      const item = $(v)
      const item_a = item.find("a").last()
      if (item.parent().find("h1 a").attr("href") === item_a.attr("href")) {
        item_a.css("display", "none");
      }
      item.find("li.hidden-list-item").removeClass("hidden-list-item");
      item.find("tr td:first-child").css("width", "50px");
    });
  }

  //額外-廣告
  function _ADRemove() {
    const els = document.querySelectorAll("div[class*='hitomi'],div[id*='hitomi'],div[style*='z-index'],div[style*='position'],iframe")
    for (const el of els) el.remove();
  }

  // 額外-熱鍵
  // 參考：Danbooru(https://danbooru.donmai.us/static/keyboard_shortcuts)
  // 重複執行
  function _HotKey() {
    console.log("[_HotKey Init]");
    let page = $("html"),
      pagClass = "",
      pageIndex = 0,
      First_page = 1,
      End_page = 0,
      Scroll_Length = 50,
      Break_HotKey = false;

    let getEl, findEl, Next_pageIndex, Previous_pageIndex;

    // 搜尋頁面有問題
    // 搜尋頁面 : 其他頁面
    pagClass = (url.search("search") > 0) ? ".page-top" : ".page-container"

    const pag = document.querySelector(pagClass);

    if (pag) {
      getEl = pag.querySelectorAll("li");
      findEl = [...getEl].filter((b) => b.childElementCount === 0 && b.textContent.search(/\d+/) === 0);
      pageIndex = parseInt(findEl[0].textContent);
      End_page = parseInt(pag.querySelector("li:last-child").textContent);
      localStorage.setItem("pageIndex", pageIndex);

      if(pageIndex < End_page) pag.querySelector(`a[href$='${pageIndex + 1}']`).classList.add("Next_pageIndex");
      if(pageIndex > First_page) pag.querySelector(`a[href$='${(pageIndex - 1 === 1 && pagClass === ".page-container") ? decodeURI(location.pathname) : `${pageIndex - 1}`}']`).classList.add("Previous_pageIndex");
      Next_pageIndex = pag.querySelector("a.Next_pageIndex");
      Previous_pageIndex = pag.querySelector("a.Previous_pageIndex");
    }

    document.body.onkeyup = function (e) {
      let _pI = parseInt(localStorage.getItem("pageIndex"))
      if (document.querySelectorAll("#query-input:focus").length > 0) Break_HotKey = true;
      switch (e.key) {
        case "ContextMenu":
        case "Control":
        case "Shift":
        case "Alt":
        case "Tab":
        case "Meta":
          Break_HotKey = true;
          return false;
        case "D":
        case "d":
        case "ArrowRight": //下一頁
          if (End_page > _pI && !Break_HotKey && Next_pageIndex) {
            Next_pageIndex.click();
          }
          Break_HotKey = false;
          break;
        case "A":
        case "a":
        case "ArrowLeft": //上一頁
          if (First_page < _pI && !Break_HotKey && Previous_pageIndex) {
            Previous_pageIndex.click();
          }
          Break_HotKey = false;
          break;
        case "W":
        case "w":
        case "S":
        case "s":
          Scroll_Length = 50;
          Break_HotKey = false;
          break;
        case "H":
        case "h": //回首頁
          if (!Break_HotKey) {
            $("div#logo a")[0].click();
          }
          Break_HotKey = false;
          break;
        case "Q":
        case "q": //搜索
          if (!url.match("(\/reader\/)") && !Break_HotKey) {
            page.stop().animate({
              scrollTop: 0,
            }, 200, "linear", () => {
              $("#query-input").focus();
            });
          }
          Break_HotKey = false;
          break;
        default:
          Break_HotKey = false;
      }
    }

    document.body.onkeydown = function (e) {
      if (document.querySelectorAll("#query-input:focus").length > 0) Break_HotKey = true;
      switch (e.key) {
        case "ContextMenu":
        case "Control":
        case "Shift":
        case "Alt":
        case "Tab":
        case "Meta":
          Break_HotKey = true;
          return false;
        case "W":
        case "w": //向上滾動
          if (page.scrollTop() > 0 && !Break_HotKey) {
            page.stop().animate({
              scrollTop: page.scrollTop() - Scroll_Length,
            }, 100, "linear");
            Scroll_Length += 5;
          } else { //網頁到頂
            break;
          }
          Break_HotKey = false;
          break;
        case "S":
        case "s": //向下滾動
          if (page.scrollTop() + $(window).height() < page.outerHeight() && !Break_HotKey) {
            page.stop().animate({
              scrollTop: page.scrollTop() + Scroll_Length,
            }, 100, "linear");
            Scroll_Length += 5;
          } else { //網頁到底
            break;
          }
          Break_HotKey = false;
          break;
        default:
          Break_HotKey = false;
      }
    };
  }


})();
