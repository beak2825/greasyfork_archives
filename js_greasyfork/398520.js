// ==UserScript==
// @name         百度学术SCI一键下载2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过百度学术一键下载SCI论文
// @description  直接点击百度学术搜索到文献后面按钮，即可一键下载99%SCI文献。
// @author       taotao-chen@syau.edu.cn
// @match        http://xueshu.baidu.com/*
// @match        https://search.crossref.org/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// require      file:///D:/OneDrive - syau.edu.cn/01R Codes/vscode/Tampermonkey/ttchen1.user.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/398520/%E7%99%BE%E5%BA%A6%E5%AD%A6%E6%9C%AFSCI%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD20.user.js
// @updateURL https://update.greasyfork.org/scripts/398520/%E7%99%BE%E5%BA%A6%E5%AD%A6%E6%9C%AFSCI%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD20.meta.js
// ==/UserScript==

var definitions = {
  findDoi: /(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)/ig,
  findUrl: /^(?:https?\:\/\/)?(?:dx\.)?doi\.org\/(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)$/ig,
  doiResolver: "https://doi.org/",
  sciHub: "https://sci-hub.tw/",
  libgen: "https://libgen.lc/scimag/ads.php?doi=",
  crossref: "https://search.crossref.org/?q="
};

var REGEX = {
  baiduList: /^http:\/\/xueshu\.baidu\.com\/s\?*/ig,
  baiduDetail: /http:\/\/xueshu\.baidu\.com\/usercenter\/paper\/show\?*/ig,
  crossref: /^https?:\/\/search\.crossref\.org\/\?q=*/ig,
  google: /^https:\/\/scholar\.google\.com\/scholar\?*/ig
}
var URL = window.location.href;




function downloadPDFschHUBdoi(mydoi) {
  var url = definitions.sciHub + mydoi;
  //  alert(url);
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    synchronous: true,
    onload: function (response) {
      var body = '<div id="body-mock">' + response.responseText.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>';
      var result = $(body).find("#pdf").attr("src");
      if (!result) {
        alert("未找到该文档！");
        return false;
      };
      var link = document.createElement('a');
      link.href = result;
      link.target = "_blank";
      link.click();
    },
    onerror: function (e) {
      alert("未找到该文档");
      return false;
    }
  });
}

function downloadPDF(mydoi) {
  if (!mydoi) {
    alert("未找到该文档！");
    return "";
  }
  var url = definitions.libgen + mydoi;
  console.log(url);
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    synchronous: true,
    onload: function (response) {
      // alert(response.responseText);
      var body = '<div id="body-mock">' + response.responseText.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>';
      var result = $(body).find("#main").find("a h2:contains('GET')").parent().attr("href");
      if (!result) {
        alert("未找到该文档！");
        return false;
      };
      var link = document.createElement('a');
      link.href = result;
      link.click();
    },
    onerror: function (e) {
      alert("未找到该文档");
      return false;
    }
  });
}

function JqueryhttpRequest(url, selector, callback) {
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    synchronous: true,
    onload: function (response) {
      var body = '<div id="body-mock">' + response.responseText.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>';
      var JQhtml = $(body).find(selector);
      if (JQhtml.length > 0) {
        callback(JQhtml);
      } else {
        alert("未找到，也未找到相似文献！");
        return false;
      }
    },
    onerror: function (e) {
      alert("未找到该文档，可能由于网络问题！");
      return false;
    }
  });
}
var inertBox = {
  url: function (url, text, target = "_self") {
    //urlorTitle = urlorTitle.trim().toLowerCase();
    //var url = "https://search.crossref.org/?q=" + urlorTitle;

    var link = $("<a>", {
      text: text,
      href: url,
      target: target,
      //  urlorTitle: "下载SCI文档",
      style: "display:inline-block;width:100%;height:20px;background-color:#ff7a45;font-size:8px;" +
        "color:white;line-height:20px;cursor:pointer;text-decoration: none;border-radius:50%;" +
        "box-shadow:0px 1px 2px -2px rgba(0,0,0,0.16),0px 3px 6px 0px rgba(0,0,0,0.12),0px 5px 12px 4px rgba(0,0,0,0.09)"
    })
    var box = $('<div>', {
      style: 'height:20px;width:50px;text-align:center;font-size:8px;text-decoration: none;display: inline-block'
    })
    box.append(link);
    return box;

  },
  fun: function (text, fun, params, target = "_self") {
    var link = $("<a>", {
      text: text,
      href: "javascript:void(0);",
      // urlorTitle: "下载SCI文档",
      click: function () {
        fun(params)
      },
      style: "display:inline-block;width:100%;height:20px;background-color:#ff7a45;font-size:8px;" +
        "color:white;line-height:20px;cursor:pointer;text-decoration: none;border-radius:50%;" +
        "box-shadow:0px 1px 2px -2px rgba(0,0,0,0.16),0px 3px 6px 0px rgba(0,0,0,0.12),0px 5px 12px 4px rgba(0,0,0,0.09)"
    })
    var box = $('<div>', {
      style: 'height:20px;width:50px;text-align:center;font-size:8px;text-decoration: none;display: inline-block'
    })
    box.append(link);
    return box;
  }
}



function getdoifromBaiDu(url, fun) {
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    synchronous: true,
    onload: function (response) {
      //   console.log(response.responseText);
      var body = '<div id="body-mock">' + response.responseText.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>';
      //  alert(response.responseText);
      var result = $(body).find("div.doi_wr p.kw_main[data-click]")
      // alert(result.text());
      if (result) {
        var doi = result.text().trim();
        fun(doi)
      } else {
        alert("未找到该文档");
        return false;
      }
    },
    onerror: function (e) {
      alert("未找到该文档");
      return false;
    }
  });
}

function BaiduXueshuList() {
  if (REGEX.baiduList.test(URL)) {
    $("div.sc_default_result.xpath-log div h3").each(function () {
      if (/(知网|维普)/.test($(this).parent().parent().find("div.sc_allversion").text())) {
        return true;
      }
      var url = $(this).find("a:first").attr("href");
      var link = $("<a>", {
        text: " 下载1",
        href: "javascript:void(0);",
        click: function () {
          getdoifromBaiDu(url, downloadPDF)
        },
        title: "下载SCI文档",
        style: "display:inline-block;width:100%;height:20px;background-color:#ff7a45;" +
          "color:white;line-height:20px;cursor:pointer;text-decoration: none;border-radius:50%;" +
          "box-shadow:0px 1px 2px -2px rgba(0,0,0,0.16),0px 3px 6px 0px rgba(0,0,0,0.12),0px 5px 12px 4px rgba(0,0,0,0.09)"
      })
      var box = $('<div>', {
        style: 'height:20px;width:30px;text-align:center;font-size:8px;text-decoration: none;display: inline-block'
      })
      box.append(link);

      var link2 = $("<a>", {
        text: " 下载2",
        href: "javascript:void(0);",
        click: function () {
          getdoifromBaiDu(url, downloadPDFschHUBdoi)
        },
        title: "下载SCI文档",
        style: "display:inline-block;width:100%;height:20px;background-color:#ff7a45;" +
          "color:white;line-height:20px;cursor:pointer;text-decoration: none;border-radius:50%;" +
          "box-shadow:0px 1px 2px -2px rgba(0,0,0,0.16),0px 3px 6px 0px rgba(0,0,0,0.12),0px 5px 12px 4px rgba(0,0,0,0.09)"
      })

      var box2 = $('<div>', {
        style: 'height:20px;width:30px;text-align:center;font-size:8px;text-decoration: none;display: inline-block'
      })
      box2.append(link2);
      $(this).append(box);
      $(this).append(box2);
      $(this).append(addRelatedRefs($(this).find("a:first").text().trim()))
    })
  }
}

function BaiduXueshuDetail() {
  if (REGEX.baiduDetail.test(URL)) {
    var doiElement = $("div.doi_wr p.kw_main[data-click]");
    var doi = doiElement.text().trim();
    var src = $("#dtl_l div.paper_src_wr div.allversion_content span.dl_item_span");
    var urlorTitleElement = $("#dtl_l div h3")

    if (doiElement.length != 0 && definitions.findDoi.test(doi) && !/(知网|维普)/.test(src)) {
      var box1 = inertBox.fun("下载1", downloadPDF, doi);
      var box2 = inertBox.fun("下载2", downloadPDFschHUBdoi, doi);
      $(urlorTitleElement).append(box1);
      $(urlorTitleElement).append($("<span>&nbsp;</span>"));
      $(urlorTitleElement).append(box2);
      $(urlorTitleElement).append($("<span>&nbsp;</span>"));
    }

    var box3 = inertBox.fun("相似|参考|引证文献下载", createBoxforBaiduXueshuDetail, "");
    $(box3).css({
      width: "100px",
      height: "30px"
    }).find("a").css({
      height: "25px",
      position: "relative",
      top: "-2px",
      "font-size": "8px"
    })

    $(urlorTitleElement).append(box3);
    var urlorTitle = urlorTitleElement.find("a:first").text().trim()
    if (!/[\u4e00-\u9fa5]/g.test(urlorTitle)) {
      var box4 = addRelatedRefs(urlorTitle);
      $(urlorTitleElement).append(box4);
    }
  }

}

function createBoxforBaiduXueshuDetail() {
 // alert("a");
  $("ul>li>p.rel_title>a.relative_title").each(function (i, aa) {
    //alert(1);
    var urlorTitle = $(aa).parent().parent().find("p.sc_message").text();
    if (!/[\u4e00-\u9fa5]/g.test(urlorTitle)) {
      var BOX = $("<div>", {
        style: "font-size:8px;text-decoration: none;display: inline-block",
        id: "baiduBOXID" + i
      })
      var baiduBOXID = "baiduBOXID" + i;
      if (!!$("#" + baiduBOXID)) {
        $("#" + baiduBOXID).remove();
        var url = "http://xueshu.baidu.com" + $(aa).attr("href")
        var box1 = inertBox.fun("下载1", function (url) {
          getdoifromBaiDu(url, downloadPDF)
        }, url);
        var box2 = inertBox.fun("下载2", function (url) {
          getdoifromBaiDu(url, downloadPDFschHUBdoi)
        }, url);
        BOX.append($("<span>&nbsp;</span>"), box1, $("<span>&nbsp;</span>"), box2);

       // addDownloadToolbar_urlorTitle($(this).parent(), urlorTitle)

      }
      //console.log(BOX);
      var aurlorTitle = $(aa).text().trim()
      if (!/[\u4e00-\u9fa5]/g.test(aurlorTitle)) {
        var box4 = addRelatedRefs(aurlorTitle);
        $(BOX).append(box4);
      }
      $(aa).parent().append(BOX);

    }

  })
}

{ // 通过Baidu学术获取doi、通过libgen和sci-hub下载pdf文档
  function DownloadByBaiduXushu(url, callback) {
    JqueryhttpRequest(url, "#dtl_l div.doi_wr>p.kw_main", function (jqobject) {
      var doi = $(jqobject).text().trim();
      callback(doi);
    })
  }

  function addDownloadToolbar_url(element, url) {
    var link_syle = "display:inline-block;width:100%;height:20px;background-color:#ff7a45;" +
      "color:white;line-height:20px;cursor:pointer;text-decoration: none;border-radius:50%;" +
      "box-shadow:0px 1px 2px -2px rgba(0,0,0,0.16),0px 3px 6px 0px rgba(0,0,0,0.12),0px 5px 12px 4px rgba(0,0,0,0.09)"
    var link_box = 'height:20px;width:50px;text-align:center;font-size:8px;text-decoration: none;display: inline-block'
    var link1 = $("<a>", {
      text: " 内网下载1",
      href: "javascript:void(0);",
      click: function () {
        DownloadByBaiduXushu(url, downloadPDF);
      },
      Title: "下载SCI文档",
      style: link_syle
    })
    $('<div>', {
      style: link_box
    }).append(link1).appendTo(element);

    var link2 = $("<a>", {
      text: " 内网下载2",
      href: "javascript:void(0);",
      click: function () {
        DownloadByBaiduXushu(url, downloadPDFschHUBdoi);;
      },
      Title: "下载SCI文档",
      style: link_syle
    })

    $('<div>', {
      style: link_box
    }).append(link2).appendTo(element);

    //addRelatedRefs(urlorTitle).appendTo(element);
  }

  function BaiduXueshuList_BaiduXueshu() {
    $("h3.t.c_font>a").each(function () {
      if (/(知网|维普)/.test($(this).parent().parent().find("div.sc_allversion").text()))  return true;


    var url = $(this).attr("href").trim();
    var title = $(this).text().trim();

    if (/[\u4e00-\u9fa5]/g.test(title)) return true;
    //alert(urlorTitle);
    addDownloadToolbar_url($(this).parent(), url);
    })
  }



}



function Crossref() {
  if (REGEX.crossref.test(URL)) {
    $("tr td.item-data div div.item-links").each(function () {
      var doi = $(this).find("a:first").attr("href").replace(definitions.findUrl, "$1");
      var box1 = inertBox.fun("下载1", downloadPDF, doi);
      var box2 = inertBox.fun("下载2", downloadPDFschHUBdoi, doi);
      $(this).append(box1);
      $(this).append(box2);
    })
  }
}

function addRelatedRefs(urlorTitle) {
  var url = definitions.crossref + urlorTitle;
  return inertBox.url(url, "Crossref", "_blank");
}

function doifromCrossref(Title) {
  var url = definitions.crossref + Title;
  console.log(url);
  JqueryhttpRequest(url, "ul.dropdown-menu>li>a.cite-link", function (jqObj) {
    var similarList = [0, 0, 0];
    var Titles = ["", "", ""];
    var doi = ["", "", ""];
    Title = Title.replace(/[\W]/g, "").toLowerCase();
    jqObj.each(function (i, item) {
      if (i > 2) {
        return true;
      }
      var urlorTitle = $(item).attr("href");
      doi[i] = urlorTitle.match(/(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)/ig)[0].toLowerCase();
      var Titlestemp = urlorTitle.replace(/(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)/ig, "").replace("javascript:showCiteBox(", "").replace(/[\W]/g, "").toLowerCase();
      similarList[i] = Ratesimilar(varurlorTitlestemp, urlorTitle)
      Titles[i] = urlorTitle.replace(/(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)/ig, "").replace("javascript:showCiteBox(", "").replace(/[',;)]/g, "").trim();
    })
    var maxValue = Math.max(...similarList);
    var indexOfMax = 0;
    indexOfMax = similarList.indexOf(maxValue);
    if (maxValue > 0.9) {
      alert(doi[indexOfMax]);
      return doi[indexOfMax]
    } else {
      alert("找到最相近文献：\n\n标题： " + Titles[indexOfMax] + "\n\ndoi: " + doi[indexOfMax]);
      return doi[indexOfMax];
    }
  })
}

function Ratesimilar(s, t) {
  if (!s || !t) {
    return 0
  }
  var l = s.length > t.length ? s.length : t.length
  var n = s.length
  var m = t.length
  var d = []
  var min = function (a, b, c) {
    return a < b ? (a < c ? a : c) : (b < c ? b : c)
  }
  var i, j, si, tj, cost
  if (n === 0) return m
  if (m === 0) return n
  for (i = 0; i <= n; i++) {
    d[i] = []
    d[i][0] = i
  }
  for (j = 0; j <= m; j++) {
    d[0][j] = j
  }
  for (i = 1; i <= n; i++) {
    si = s.charAt(i - 1)
    for (j = 1; j <= m; j++) {
      tj = t.charAt(j - 1)
      if (si === tj) {
        cost = 0
      } else {
        cost = 1
      }
      d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
    }
  }
  let res = (1 - d[n][m] / l)
  return Math.trunc(res * 1000) / 1000
}


{ // 通过QQSCI获取doi、通过libgen和sci-hub下载pdf文档
  function DownloadByQQsci(Title, fun) {
    var url = "http://doi.qqsci.com/?doi=" + Title + "#search";
    JqueryhttpRequest(url, "div.server-area>table td:contains('DOI：')", function (jqobject) {
      var doi = $(jqobject).parent().find("td:eq(1)").text().trim();
      fun(doi);
    })
  }

  function addDownloadToolbar_urlorTitle(element, title) {
    var link_syle = "display:inline-block;width:100%;height:20px;background-color:#ff7a45;" +
      "color:white;line-height:20px;cursor:pointer;text-decoration: none;border-radius:50%;" +
      "box-shadow:0px 1px 2px -2px rgba(0,0,0,0.16),0px 3px 6px 0px rgba(0,0,0,0.12),0px 5px 12px 4px rgba(0,0,0,0.09)"
    var link_box = 'height:20px;width:50px;text-align:center;font-size:8px;text-decoration: none;display: inline-block'
    var link1 = $("<a>", {
      text: " 外网下载1",
      href: "javascript:void(0);",
      click: function () {
        DownloadByQQsci(title, downloadPDF);
      },
      Title: "下载SCI文档",
      style: link_syle
    })
    $('<div>', {
      style: link_box
    }).append(link1).appendTo(element);
    var link2 = $("<a>", {
      text: " 外网下载2",
      href: "javascript:void(0);",
      click: function () {
        DownloadByQQsci(title, downloadPDFschHUBdoi);;
      },
      title: "下载SCI文档",
      style: link_syle
    })
    $('<div>', {
      style: link_box
    }).append(link2).appendTo(element);
    addRelatedRefs(title).appendTo(element);

  }

  function BaiduXueshuList_qqsci() {
    $("h3.t.c_font>a").each(function () {
      if (/(知网|维普)/.test($(this).parent().parent().find("div.sc_allversion").text())) {
        return true;
      }
      var Title = $(this).text().trim();
      if (/[\u4e00-\u9fa5]/g.test(Title)) return true;
      addDownloadToolbar_urlorTitle($(this).parent(), Title);
    })
  }
}



$(document).ready(function () {
  //BaiduXueshuList();
  BaiduXueshuList_BaiduXueshu();
  Crossref();
  BaiduXueshuDetail();
  BaiduXueshuList_qqsci();
});