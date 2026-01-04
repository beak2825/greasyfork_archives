// ==UserScript==
// @name         3DM净化
// @namespace    http://tampermonkey.net/
// @version      1.55
// @description  3DM去广告，隐藏置顶，新页面打开，自动下一页
// @author       backrock12
// @match        *://bbs.3dmgame.com/forum*
// @match        *://bbs.3dmgame.com/thread*
// @match        *://www.gamersky.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/421918/3DM%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421918/3DM%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var run_mk = false;
  var run_mk2 = false;
  var nexturl = "NULL";

  if (
    /bbs\.3dmgame\.com\/forum\.php$/.test(location.href) &&
    !/bbs\.3dmgame\.com\/forum\.php\?gid/.test(location.href)
  ) {
    console.log("111");
    dmad();
    setTimeout(dmad, 500);
  } else if (/bbs\.3dmgame\.com\/thread*/.test(location.href)) {
    tdmad();
    cleanTop();
    atarget();
    setTimeout(autopage_thread, 500);
  } else if (/bbs\.3dmgame\.com\/forum*/.test(location.href)) {
    console.log("333");
    tdmad();
    cleanTop();
    atarget();
    hidepage();
    setTimeout(() => autopage_forum("#autopbn"), 500);
  } else if (/www\.gamersky\.com*/.test(location.href)) {
    console.log("gamersky");
    ymad();
  }

  function ymad() {
    const adlist = [
      ".advert",
      "p.app",
      "#ADback",
      "#adscontainer_banner_new_second_index_1060",
      "#adscontainer_banner_new_middle_index_1060_1",
      "#adscontainer_banner_new_middle_index_1060_2",
      "#adscontainer_banner_new_middle_index_1060_3",
      "#adscontainer_banner_new_middle_index_1060_4",
      "#adscontainer_banner_new_middle_index_1060_5",
      "#adscontainer_banner_new_bottom_index_1060",
      ".gsBackgroundLeft",
      ".gsBackgroundRight",
      "#adTips",
      ".Mid2_R",
      ".Mid0",
    ];

    subnoad(adlist);

    // adlist.forEach((e) => {
    //   let r = document.querySelectorAll(e);
    //   if (r.length > 0)
    //     r.forEach((e) => {
    //       e.style.display = "none";
    //     });
    // });

    waitElement(".Mid2_R", 10, 250).then(function () {
      let r = document.querySelectorAll(".Mid2_R");
      if (r.length > 0)
        r.forEach((e) => {
          e.style.display = "none";
          // console.log(r);
        });
    });

    // let style_t = ``;
    // adlist.forEach((e) => {
    //   style_t += e + " { display:none  !important; } ";
    // });
    // const style_Add = document.createElement("style");
    // style_Add.innerHTML = style_t;
    // document.head.appendChild(style_Add);
  }

  function dmad() {
    tdmad();

    const adlist = [
      "div.bmw:nth-child(1)",
      "div.bmw:nth-child(2)",
      "div.bmw:nth-child(3)",
      "div.bmw:nth-child(4)",
      "div.bmw:nth-child(5)",
      "div.bmw:nth-child(6)",
      "#pgt",
      "#mn_N3c68",
    ];

    subnoad(adlist);
  }

  function subnoad(adlist) {
    // adlist.forEach((e) => {
    //   let r = document.querySelectorAll(e);
    //   if (r.length > 0) r.forEach((e) => (e.style.display = "none"));
    // });

    // adlist.forEach((e) => {
    //   GM_addStyle(e + " { display:none  !important; }");
    // });

    GM_addStyle(adlist.join(",") + " { display:none  !important; }");

    // let style_t = ``;
    // adlist.forEach((e) => {
    //   style_t += e + " { display:none  !important; } ";
    // });
    // const style_Add = document.createElement("style");
    // style_Add.innerHTML = style_t;
    // document.head.appendChild(style_Add);
  }

  function tdmad() {
    const adlist = [
      "#p_btn",
      "#mn_N124d",
      "#mn_N9e02",
      "#mn_N7990",
      "#mn_Nadbb",
      "#mn_Na9bb",
      "#mn_Na9bb",
      "#scbar_hot a",
      "#category_437",
      "#pid267331864 > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)",
      ".image",
      ".pls>div> dl",
      ".pls>div> ul",
      ".pls>div span",
      ".md_ctrl",
      "#mn_Ne109",
      ".hd_table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1)",
    ];

    subnoad(adlist);
  }

  function hidepage() {
    const adlist = [
      //  "#category_1_img",
      //   "#category_3_img",
      //    "#category_1009_img",
      "#category_2869_img",
    ];

    subnoad(adlist);

    // adlist.forEach((e) => {
    //   let ele = document.querySelectorAll(e);
    //   if (ele.length > 0) {
    //     ele.forEach((e) => e.click());
    //   }
    // });
  }

  // 清理置顶帖子
  function cleanTop() {
    const ele = document.querySelectorAll("a.showhide.y");
    if (ele.length > 0) {
      ele.forEach((e) => e.click());
    }
  }

  function atarget() {
    const ele = document.querySelectorAll("#atarget");
    if (ele.length > 0) {
      ele.forEach((e) => {
        if (e.className != "y atarget_1") e.click();
      });
    }
  }

  function autopage_forum(divid) {
    window.addEventListener(
      "scroll",
      function () {
        if (run_mk) return;
        const htmlHeight =
          document.body.scrollHeight || document.documentElement.scrollHeight;
        //clientHeight是网页在浏览器中的可视高度，
        const clientHeight =
          document.body.clientHeight || document.documentElement.clientHeight;
        //scrollTop是浏览器滚动条的top位置，
        const scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
        if (
          parseInt(scrollTop) + parseInt(clientHeight) >=
          parseInt(htmlHeight)
        ) {
          run_mk = true;
          checkele(divid);
          run_mk = false;
        }
      },
      false
    );
  }

  /**
   * @description : 根据ID检查元素是否可见，再点击
   * @param        {*} cssid
   * @return       {*}
   */
  function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
  }

  function checkele(cssid) {
    const s = document.querySelector(cssid);
    if (s && s.innerText == "下一页 »") {
      let r = checkVisible(s);
      if (r) {
        s.click();
        // serch();
      }
    }
  }

  function autopage_thread(divid) {
    window.addEventListener(
      "scroll",
      function () {
        if (run_mk2) return;
        const htmlHeight =
          document.body.scrollHeight || document.documentElement.scrollHeight;
        //clientHeight是网页在浏览器中的可视高度，
        const clientHeight =
          document.body.clientHeight || document.documentElement.clientHeight;
        //scrollTop是浏览器滚动条的top位置，
        const scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        //通过判断滚动条的top位置与可视网页之和与整个网页的高度是否相等来决定是否加载内容；
        if (
          parseInt(scrollTop) + parseInt(clientHeight) >=
          parseInt(htmlHeight)
        ) {
          run_mk2 = true;
          nextpage();
          run_mk2 = false;
        }
      },
      false
    );
  }

  function nextpage() {
    const ele = document.querySelector(".bm_h");
    if (!ele) return;
    let r = checkVisible(ele);
    if (!r) {
      return;
    }

    if (nexturl == ele.href) return;
    nexturl = ele.href;

    GM_xmlhttpRequest({
      url: nexturl,
      method: "GET",
      timeout: 2000,
      onload: function (response) {
        try {
          console.log("nexturl    " + nexturl);
          if (response.status != 200) return;
          // console.log(response.responseText)
          // let doc = $("<html></html>");
          // doc.html(response.responseText);
          let doc = $(response.responseText);
          const postlist = doc.find("div #postlist>div");
          let list = $("div #postlist");
          if (list.length == 0) return;
          postlist.each((i, v) => {
            list[0].append(v);
          });

          const oldbm = $(".bm_h");
          const newbm = doc.find(".bm_h");

          if (oldbm.length == newbm.length && newbm.length == 1) {
            oldbm.replaceWith(newbm);
          } else if (oldbm.length == 1 && newbm.length == 0) {
            oldbm.hide();
          }

          $(".pgs").each((i, v) => {
            const strong = $(v).find("strong:last");
            // console.log(strong);
            if (strong.length > 0) {
              const next = strong.next();
              // console.log(next);
              next.replaceWith(`<strong>${next.text()}</strong>`);
            }
          });
        } catch (e) {
          console.log(e);
        }
      },
    });
  }

  function waitElement(selector, times, interval, flag = true) {
    var _times = times || -1, // 默认不限次数
      _interval = interval || 500, // 默认每次间隔500毫秒
      _selector = selector, //选择器
      _iIntervalID,
      _flag = flag; //定时器id
    return new Promise(function (resolve, reject) {
      _iIntervalID = setInterval(function () {
        if (!_times) {
          //是0就退出
          clearInterval(_iIntervalID);
          reject();
        }
        _times <= 0 || _times--; //如果是正数就 --
        var _self = document.querySelectorAll(_selector); //再次选择
        if ((_flag && _self.length > 0) || (!_flag && !_self.length)) {
          //判断是否取到
          clearInterval(_iIntervalID);
          resolve(_iIntervalID);
        }
      }, _interval);
    });
  }
})();
