// ==UserScript==
// @name         哔哩哔哩助手(播放记录,下载视频)
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  哔哩哔哩助手(播放记录,下载视频) bilibili,B站,b站,小破站
// @author       LY
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/414874/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A9%E6%89%8B%28%E6%92%AD%E6%94%BE%E8%AE%B0%E5%BD%95%2C%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414874/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A9%E6%89%8B%28%E6%92%AD%E6%94%BE%E8%AE%B0%E5%BD%95%2C%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%29.meta.js
// ==/UserScript==

var ly_div_son,
  ly_div,
  ly_span,
  list_box,
  b_title,
  b_url,
  b_id,
  ly_a = null,
  bvid,
  b_href;
var flag = true;
(function () {
  window.onload = function () {
    if (document
      .querySelector(".list-box") === null) {
      return
    }
    main(function () {
      init();
      if (flag) {
        //显示show
        show();
        var timer1 = setInterval(function () {
          if (
            document
              .querySelector(".list-box")
              .querySelectorAll("li")[0]
              .querySelector("a") != null
          ) {
            clearInterval(timer1);
            htmlChange(getP(b_id));
            localStorageChange(b_id, b_p);
            bvid = window.bvid
            watch();
          }
        }, 500);
      }
    });
  };
})();
//显示html
function init() {
  b_href = window.location.href;
  var href = window.location.href;
  if (href.indexOf("video") == -1) {
    flag = false;
  } else {
    b_id = href.split("/video/")[1].split("?")[0];
    if (href.indexOf("?p=")) {
      b_p = href.split("?p=")[1];
    }
  }
}
function show() {
  ly_div = document.createElement("div");
  ly_div_son = document.createElement("div");
  ly_div_son.className = "ly_son";
  ly_div.className = "aaabbb";
  ly_div.style.cssText =
    "position:absolute;top:152px;right:7px;height:46px;color:#222;border-radius:2px;box-sizing:border-box;font-size:16px;line-height:46px;font-weight:400;z-index:999";
  ly_span = document.createElement("span");
  ly_span.style.cssText = "float:right;background:#f4f4f4;";
  ly_span.innerHTML = "等待页面加载...";
  ly_a = document.createElement("a");
  ly_a.style.cssText = "float:right;color:#00a1d6;background:#f4f4f4;";
  ly_div.appendChild(ly_div_son);
  ly_div.appendChild(ly_a);
  ly_div.appendChild(ly_span);
  document.body.append(ly_div);
  ly_a.onmouseover = function () {
    this.parentNode.children[0].style.display = "block";
  };
  ly_a.onmouseleave = function () {
    this.parentNode.children[0].style.display = "none";
  };
  var styles = document.createElement("style");
  styles.id = "id";
  styles.type = "text/css";
  if (styles.styleSheet) {
    styles.styleSheet.cssText =
      '.ly_son{display:none;position:absolute;top:55px;right:4px;padding:0 8px;white-space:nowrap;height:40px;border-radius:8px;color:#fff;font-size:18px;line-height:40px;background-color:#00b5e5}.ly_son::after{position:absolute;top:-20px;right:11px;content:" ";width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid #00b5e5;border-left:10px solid transparent;border-right:10px solid transparent}'; //IE
  } else {
    styles.appendChild(
      document.createTextNode(
        '.ly_son{display:none;position:absolute;top:55px;right:4px;padding:0 8px;white-space:nowrap;height:40px;border-radius:8px;color:#fff;font-size:18px;line-height:40px;background-color:#00b5e5}.ly_son::after{position:absolute;top:-20px;right:11px;content:" ";width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid #00b5e5;border-left:10px solid transparent;border-right:10px solid transparent}'
      )
    ); //for FF
  }

  document.getElementsByTagName("head")[0].appendChild(styles);
}
//集数改变
function htmlChange(p) {
  ly_span.innerHTML = "上次播放第";
  list_box = document.querySelector(".list-box").querySelectorAll("li");
  b_title = list_box[p - 1].querySelector("a").title;
  ly_div_son.innerHTML = b_title;
  ly_a.innerHTML = p + "集"; //鼠标进入显示文字
  ly_a.href = "http://www.bilibili.com/video/" + b_id + "?p=" + p;
  var url = "https://api.bilibili.com/x/player/playurl?fourk=1&bvid=" + window.bvid + "&cid=" + window.cid;
  get(url)
}
function localStorageChange(b_id, p) {
  var json = getLocalStorage();
  json[b_id] = p;
  setLocalStorage(json);
}
function getLocalStorage() {
  if (localStorage.getItem("b_localStorage") === null) {
    localStorage.setItem("b_localStorage", JSON.stringify({ by: "ly" }));
  } else {
    return JSON.parse(localStorage.getItem("b_localStorage"));
  }
}
function add(id, p) {
  var json = getLocalStorage();
  json[id] = p;
  setLocalStorage(json);
}
function setLocalStorage(json) {
  localStorage.setItem("b_localStorage", JSON.stringify(json));
}
function getP(id) {
  var json = getLocalStorage("b_localStorage");
  for (var jsonItem in json) {
    if (jsonItem === id) {
      return parseInt(json[jsonItem]);
    }
  }
  add(b_id, 1);
  return 1;
}
function watch() {
  var timer = setInterval(function () {
    var href = window.location.href;
    if (b_href !== href) {
      htmlChange(getP(b_id));
      localStorageChange(b_id, href.split("?p=")[1]);
      b_href = href;
    }

  }, 2500);
}
function main(fn) {
  fn();
}

(function () {

  "use strict";
  var bvid;
  var isLoad = false;
  var timer = setInterval(function () {
    if (!window.$) {
      return;
    }
    var url = "https://api.bilibili.com/x/player/playurl?fourk=1&bvid=" + window.bvid + "&cid=" + window.cid;
    var downloadBtn = $("<span></span>").css("width", 0).html("<span><i class=\"van-icon-download\" style=\"font-size:28px;cursor: pointer;padding-left: 10px\"></i></span>");
    $(".ops").append(downloadBtn);
$(".toolbar-left").append(downloadBtn)

    window.modal = $("<div></div>").css({
      padding: "20px",
      background: "#ffffff",
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-40%,-50%)",
      zIndex: "999",
      borderRadius: "5%",
      boxShadow: "2px 2px 13px #333",
      fontSize: "20px",
      color: "#00a1d6",
      lineHeight: "50px",
      width: "300px",
      textAlign: "center",
      display: "none"
    }).html("<span>选择下载清晰度</span>").append($("<span>X</span>").css({
      color: "red",
      fontSize: "28px",
      top: "0px",
      position: "absolute",
      right: "19px",
      cursor: "pointer"

    }).on("click", function () {
      modal.fadeToggle()
    }));
    $("#app").append(modal);
    downloadBtn.hover(function () {
      downloadBtn.css({
        color: "#00a1d6"
      });
    }, function () {
      downloadBtn.css({
        color: "#505050"
      });
    });
    downloadBtn.on("click", function () {
      if (isLoad) {
        bvid = window.bvid
        modal.fadeToggle()
        return;
      }
      isLoad = true;
      modal.fadeToggle()
      get(url)
    });

    clearInterval(timer);
  }, 500);
  bvid = window.bvid

  setInterval(() => {
    var _bvid = window.bvid
    if (bvid != _bvid) {
      var url = "https://api.bilibili.com/x/player/playurl?fourk=1&bvid=" + window.bvid + "&cid=" + window.cid;
      get(url)
      bvid = _bvid
    }
  }, 3000)
})();

function get(url) {
  fetch(url).then(function (res) {
    return res.json();
  }).then(function (res) {
    var support_formats = res.data.support_formats;
    modal.find("li").remove()
    support_formats.forEach(function (item) {
      var li = $("<li></li>").click(function () {
        fetch(url + "&qn=" + item.quality).then(function (res) {
          return res.json();
        }).then(function (res) {
          var a = $("<a target=\"_blank\">下载</a>").attr("href", res.data.durl[0].url);

          $("body").append(a);
          a[0].click();
          a.empty();
        });
      }).hover(function () {
        li.css({
          background: "#f4f4f4",
          cursor: "pointer"
        });
      }, function () {
        li.css({
          background: "#fff"
        });
      });
      li.html(item.new_description);
      modal.append(li);
    });

  });
}