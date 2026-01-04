// ==UserScript==
// @name              ehAutoStar
// @namespace         moe.cangku.mengzonefire
// @version           1.1.3
// @description       EH画廊自动/批量评分脚本
// @author            mengzonefire
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@9
// @require           https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/jquery-migrate@3.4.0/dist/jquery-migrate.min.js
// @match             *://exhentai.org/g*
// @match             *://e-hentai.org/g*
// @match             *://exhentai.org/uploader/*
// @match             *://e-hentai.org/uploader/*
// @grant             GM_setValue
// @grant             GM_getValue
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/428140/ehAutoStar.user.js
// @updateURL https://update.greasyfork.org/scripts/428140/ehAutoStar.meta.js
// ==/UserScript==
const href = window.location.href;
const defRateMap = "BlossomPlus 5";
!(function () {
  "use strict";
  var rating_img;
  var uploader;
  var my_apikey;
  var my_apiuid;
  var g_flag;
  var link_ele;
  var star_ele;
  var GaInfo;
  var count = 0;
  var fail_count = 0;
  var domain = href.indexOf("exhentai") != -1 ? "exhentai" : "e-hentai";
  var rateMapText = GM_getValue("rateMap");
  var rateMap = [];
  var icon_url =
    domain == "exhentai"
      ? "https://exhentai.org/img/mr.gif"
      : "https://ehgt.org/g/mr.gif";
  var html_btn = '<div style="float:left">&nbsp; <a id="rateSetting" href="#">';
  html_btn += `<img src="${icon_url}"> 自动评分设置`;
  html_btn += "</a></div>";
  var html_input =
    '<div style="position: absolute;margin-left: 5px;"><input type="button" value="一键评分" id="autoRate"><input type="text" id="inputRate" value="5" size="4" maxlength="3" style="width:22px"></div>';
  if (!rateMapText) {
    rateMapText = defRateMap;
    GM_setValue("rateMap", rateMapText);
  }
  readRateMap();

  if (href.indexOf("/uploader/") != -1) {
    g_flag = false;
    let loop = setInterval(() => {
      var html_tag2 = $("div.searchnav:first");
      if (!html_tag2.length) return false;
      html_tag2.before(html_input);
      $("#autoRate").click(function () {
        $("#autoRate").prop("value", "正在执行").prop("disabled", true);
        batchRating();
      });
      clearInterval(loop);
    }, 500);
  } else if (href.indexOf("/g/") != -1) {
    var style;
    g_flag = true;
    my_apikey = apikey;
    my_apiuid = apiuid;
    if (domain == "exhentai") {
      style =
        "<style>.swal2-textarea{color:#ffffff;background-color:#43464e}</style>";
    } else {
      style =
        "<style>.swal2-textarea{color:#000000;background-color:#f3f0e0}</style>";
    }
    var ele = document.createElement("div");
    ele.innerHTML = style;
    document.getElementsByTagName("head")[0].appendChild(ele.firstElementChild);

    let loop1 = setInterval(() => {
      var html_tag = $("#gdr");
      if (!html_tag.length) return false;
      html_tag.append(html_btn);
      $("#rateSetting").click(function () {
        rateSetting();
      });
      clearInterval(loop1);
    }, 500);

    let loop2 = setInterval(() => {
      uploader = $("#gdn>a")[0].innerText;
      rating_img = $("#rating_image")[0];
      if (!uploader || !rating_img) return false;
      else if (
        rating_img.className == "ir" &&
        rateMap.hasOwnProperty(uploader)
      ) {
        rating(rateMap[uploader], -1);
      }
      clearInterval(loop2);
    }, 500);

    if (apikey != GM_getValue("apikey")) {
      GM_setValue("apikey", apikey);
    }
    if (apiuid != GM_getValue("apiuid")) {
      GM_setValue("apiuid", apiuid);
    }
  }

  function rating(rate, recu) {
    if (recu == -1) GaInfo = href.match(/\/g\/([\d]+)\/([\da-f]+)\//);
    else {
      if (recu == star_ele.length) {
        Swal.fire(`一键评分完成，共评分${count}个画廊，失败${fail_count}个`);
        $("#autoRate").prop("value", "一键评分").prop("disabled", false);
        return true;
      }
      if (star_ele[recu].className == "ir") {
        rating_img = star_ele[recu];
        GaInfo = link_ele[recu].href.match(/\/g\/([\d]+)\/([\da-f]+)\//);
      } else {
        rating(rate, recu + 1);
        return false;
      }
    }
    $.ajax({
      url: "/api.php",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        apikey: my_apikey,
        apiuid: my_apiuid,
        gid: Number(GaInfo[1]),
        method: "rategallery",
        rating: rate * 2,
        token: GaInfo[2],
      }),
    })
      .success(function (r) {
        console.log(r);
        if (!r["error"]) {
          var n1 = Math.ceil(rate - 5) * 16;
          var n2 = rate % 1 ? -21 : -1;
          rating_img.setAttribute(
            "style",
            `background-position: ${n1}px ${n2}px;`
          );
          rating_img.className = r["rating_cls"];
          if (recu == -1) {
            $("#rating_label")[0].innerText = `平均值：${r["rating_avg"]}`;
            $("#rating_count")[0].innerText = r["rating_cnt"];
          }
        }
      })
      .fail(function (r) {
        console.log(r);
        fail_count += 1;
      })
      .always(function () {
        count += 1;
        if (recu != -1) rating(rate, recu + 1);
      });
  }

  function rateSetting() {
    Swal.fire({
      title: "输入自动评分配置\n格式：上传者 分数(0.5-5)",
      input: "textarea",
      inputValue: GM_getValue("rateMap"),
      showCancelButton: true,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValidator: (value) => {
        rateMapText = value;
        var errNum = readRateMap();
        if (errNum != -1) {
          return `第{${errNum + 1}行格式错误，分数必须为0.5的整数倍`;
        }
      },
    }).then((result) => {
      if (result.dismiss) return;
      GM_setValue("rateMap", rateMapText);
    });
  }

  function readRateMap() {
    var mapLine = rateMapText.split("\n");
    for (var line of mapLine) {
      var result = line.match(/([\s\S]+) ((?:[0-4].5)?[1-5]?)$/);
      if (result) rateMap[result[1]] = Number(result[2]);
      else return mapLine.indexOf(line);
    }
    return -1;
  }

  function batchRating() {
    if (GM_getValue("apiuid")) {
      my_apikey = GM_getValue("apikey");
      my_apiuid = GM_getValue("apiuid");
    } else {
      Swal.fire(
        "api参数未记录, 请先登录并进入任意画廊, 脚本会自动记录参数, 然后再使用此功能"
      );
      $("#autoRate").prop("value", "一键评分").prop("disabled", false);
      return false;
    }
    if (my_apiuid != Number(getCookie("ipb_member_id"))) {
      Swal.fire(
        "api参数不匹配, 请先进入任意画廊, 脚本会自动刷新参数, 然后再使用此功能"
      );
      $("#autoRate").prop("value", "一键评分").prop("disabled", false);
      return false;
    }
    var select_ele = $("div.searchnav:first > div > select > option"); // 列表右上的模式选择框 (最小化...缩略图...扩展)
    var select_flag = getSelect(select_ele);

    switch (select_flag) {
      case "m":
      case "p":
        star_ele = $("td.gl4m > div");
        link_ele = $("td.gl3m.glname > a");
        break;
      case "l":
        star_ele = $("td.gl2c > div:nth-child(3) > div.ir");
        link_ele = $("td.gl3c.glname > a");
        break;
      case "e":
        star_ele = $("td.gl2e > div > div > div.ir");
        link_ele = $("td.gl2e > div > a");
        break;
      case "t":
        star_ele = $("div.gl5t > div:nth-child(2) > div.ir");
        link_ele = $("div.itg.gld > div > a");
        break;
      default:
        Swal.fire("一键评分失败: select元素错误");
        $("#autoRate").prop("value", "一键评分").prop("disabled", false);
        return false;
    }

    if (link_ele.length != star_ele.length) {
      Swal.fire("一键评分失败: html元素不匹配");
      $("#autoRate").prop("value", "一键评分").prop("disabled", false);
    } else {
      var my_rate = Number($("#inputRate")[0].value);
      if (my_rate > 0 && my_rate <= 5 && my_rate % 0.5 == 0) {
        rating(my_rate, 0);
      } else {
        Swal.fire("分数错误：数值必须在0.5-5之间且为0.5的整数倍");
        $("#autoRate").prop("value", "一键评分").prop("disabled", false);
      }
    }
  }

  function getCookie(cookie_name) {
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);
    if (cookie_pos != -1) {
      cookie_pos = cookie_pos + cookie_name.length + 1;
      var cookie_end = allcookies.indexOf(";", cookie_pos);
      if (cookie_end == -1) cookie_end = allcookies.length;
      var value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
  }

  function getSelect(select_ele) {
    for (var i = 0; i < select_ele.length; i++) {
      if (select_ele[i].getAttribute("selected")) {
        return select_ele[i].getAttribute("value");
      }
    }
    return null;
  }
})();
