// ==UserScript==
// @name         京东只选自营
// @description  在点击搜索时,在关键字后自动添加"自营"
// @namespace    https://greasyfork.org/zh-CN/scripts/373561
// @version      0.4
// @author       silentmoon
// @copyright    silentmoon
// @include      http*://*.jd.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373561/%E4%BA%AC%E4%B8%9C%E5%8F%AA%E9%80%89%E8%87%AA%E8%90%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/373561/%E4%BA%AC%E4%B8%9C%E5%8F%AA%E9%80%89%E8%87%AA%E8%90%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
   setTimeout(init,1000);

   function init(){
       $(".button").unbind();
       $(".button")[0].onclick =null;
       $("#key").unbind();
       $("#key")[0].onkeydown=null;
        $(".button").bind("click",search1);
        $("#key").bind("keydown",function(event){

            if(event.keyCode==13) {

                search1()
            };
        });
       


   }
    function search1() {

    var a='key';
    var b;
  var c,
    d = "//search.jd.com/Search?keyword={keyword}&enc={enc}{additional}";
  var e = search.additinal || "";
  if (
    ("string" == typeof b && "" != b
      ? (e += "&spm=a.0.0")
      : (b = document.getElementById(a).value.replace("自营","")+'自营'),
    (b = b.replace(/^\s*(.*?)\s*$/, "$1")),
    b.length > 100 && (b = b.substring(0, 100)),
    "" == b)
  )
    return void (window.location.href = window.location.href);

  var f = 0;
  "undefined" != typeof window.pageConfig &&
    "undefined" != typeof window.pageConfig.searchType &&
    (f = window.pageConfig.searchType);
  var g = "&cid{level}={cid}";
  var h = "string" == typeof search.cid ? search.cid : "";
  var i = "string" == typeof search.cLevel ? search.cLevel : "";
  var j = "string" == typeof search.ev_val ? search.ev_val : "";
  switch (f) {
    case 0:
      break;
    case 1:
      (i = "-1"), (e += "&book=y");
      break;
    case 2:
      (i = "-1"), (e += "&mvd=music");
      break;
    case 3:
      (i = "-1"), (e += "&mvd=movie");
      break;
    case 4:
      (i = "-1"), (e += "&mvd=education");
      break;
    case 5:
      var k = "&other_filters=%3Bcid1%2CL{cid1}M{cid1}[cid2]";
      switch (i) {
        case "51":
          (g = k.replace(/\[cid2]/, "")), (g = g.replace(/\{cid1}/g, "5272"));
          break;
        case "52":
          (g = k.replace(/\{cid1}/g, "5272")),
            (g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}"));
          break;
        case "61":
          (g = k.replace(/\[cid2]/, "")), (g = g.replace(/\{cid1}/g, "5273"));
          break;
        case "62":
          (g = k.replace(/\{cid1}/g, "5273")),
            (g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}"));
          break;
        case "71":
          (g = k.replace(/\[cid2]/, "")), (g = g.replace(/\{cid1}/g, "5274"));
          break;
        case "72":
          (g = k.replace(/\{cid1}/g, "5274")),
            (g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}"));
          break;
        case "81":
          (g = k.replace(/\[cid2]/, "")), (g = g.replace(/\{cid1}/g, "5275"));
          break;
        case "82":
          (g = k.replace(/\{cid1}/g, "5275")),
            (g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}"));
      }
      d =
        "//search-e.jd.com/searchDigitalBook?ajaxSearch=0&enc=utf-8&key={keyword}&page=1{additional}";
      break;
    case 6:
      (i = "-1"), (d = "//music.jd.com/8_0_desc_0_0_1_15.html?key={keyword}");
      break;
    case 7:
      d = "//s-e.jd.com/Search?key={keyword}&enc=utf-8";
      break;
    case 8:
      d = "//search.jd.hk/Search?keyword={keyword}&enc=utf-8";
      break;
    case 9:
      e += "&market=1";
      break;
    case 10:
      e += "&gp=2";
  }
  if ("string" == typeof h && "" != h && "string" == typeof i) {
    var l = /^(?:[1-8])?([1-3])$/;
    i = "-1" == i ? "" : l.test(i) ? RegExp.$1 : "";
    var m = g.replace(/\{level}/, i);
    (m = m.replace(/\{cid}/g, h)), (e += m);
  }
  if (
    ("string" == typeof j && "" != j && (e += "&ev=" + j),
    (b = encodeURIComponent(b)),
    (c = d.replace(/\{keyword}/, b)),
    (c = c.replace(/\{enc}/, "utf-8")),
    (c = c.replace(/\{additional}/, e)),
    "object" == typeof $o &&
      ("string" == typeof $o.lastKeyword &&
        (c += "&wq=" + encodeURIComponent($o.lastKeyword)),
      "string" == typeof $o.pvid && (c += "&pvid=" + $o.pvid)),
    c.indexOf("/search.jd.com/") > 0)
  )
    try {
      JA.tracker.ngloader("search.000009", { key: b, posid: a, target: c });
    } catch (n) {}
  ("undefined" == typeof search.isSubmitted || 0 == search.isSubmitted) &&
    (setTimeout(function() {

     window.location.href = c;
    }, 50),
    (search.isSubmitted = !0));
}
})();