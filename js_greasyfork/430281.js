// ==UserScript==
// @name         豆瓣图片下载
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  全部图片页添加下载按钮；图片页添加下载按钮；图片页显示原图
// @author       backrock12
// @match        *.douban.com/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430281/%E8%B1%86%E7%93%A3%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430281/%E8%B1%86%E7%93%A3%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const prefixs = ["r", "raw", "l", "large"];

  function replacefun(prefix) {
    return `$1${prefix}$3`;
  }
  const pic_regex =
    /^(https:\/\/img\d\.doubanio\.com\/p?view\/(event_poster|subject|note|status|group|group_topic|photo|richtext)\/).+(\/public\/.+\..+)$/;

  async function gethtml(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: "GET",
        onload: function (response) {
          resolve(response.responseText);
        },
      });
    });
  }

  var MenuID;
  var DBSetting;
  const setting_key = "DOUBAN_PIC_DOWN_SETTING";

  function addMenu(mk) {
    if (MenuID) {
      GM_unregisterMenuCommand(MenuID);
    }

    if (!mk) {
      MenuID = GM_registerMenuCommand("开启自动下载", onupdate);
    } else {
      MenuID = GM_registerMenuCommand("取消自动下载", offupdate);
    }
  }

  function onupdate() {
    isupdate(true);
  }

  function offupdate() {
    isupdate(false);
  }

  function isupdate(mk) {
    console.log("isupdate" + mk);
    DBSetting.AUTO_MK = mk;
    GM_setValue(setting_key, DBSetting);
    addMenu(DBSetting.AUTO_MK);
  }

  function getSetting() {
    const defaults_Setting = {
      AUTO_MK: false,
    };

    let gm_Setting = GM_getValue(setting_key);
    DBSetting = $.extend({}, defaults_Setting, gm_Setting);

    addMenu(DBSetting.AUTO_MK);
  }

  function subject_button() {
    try {
      if (
        ((/all_photos/.test(location.href) || /photos/.test(location.href)) &&
          (/douban\.com\/subject/.test(location.href) ||
            /douban\.com\/game/.test(location.href) ||
            /douban\.com\/musician/.test(location.href))) ||
        /douban\.com\/celebrity/.test(location.href)
      ) {
        const h1_id = "div.mod div > h2";
        const a_id = "div.mod div  h2   span a";
        const doc_id = ".poster-col3  li  div  a  img";

        add_down(h1_id, a_id, doc_id);

        const h1_id2 = "div.mod:nth-child(2) > div > h2";
        const a_id2 = " div.mod:nth-child(2) > div h2 span a ";
        const doc_id2 = ".poster-col3  li  div  a  img";

        add_down(h1_id2, a_id2, doc_id2);

        const h1_id3 = "div.mod:nth-child(3) > div > h2 ";
        const a_id3 = " div.mod:nth-child(3) > div h2 span a ";
        const doc_id3 = ".poster-col3  li  div  a  img";
        add_down(h1_id3, a_id3, doc_id3);

        const h1_id4 = "div.fleft";
        const a_id4 = location.href;
        const doc_id4 = "div.article li div.cover a img";
        add_down(h1_id4, a_id4, doc_id4, 2);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function add_down(h1_id, a_id, doc_id, type = 1) {
    try {
      console.log(" run  add_down");

      const h1 = document.querySelector(h1_id);
      let url;
      if (type == 1) {
        const a = document.querySelector(a_id);
        url = a.href;
      } else {
        url = a_id;
      }

      let title = "";
      const titleobj = document.querySelector("#content > h1");
      if (titleobj) title = titleobj.innerText.replace("的全部图片", "");

      const ce = document.createElement("button");
      ce.id = "CDownBtn";
      ce.textContent = "全部下载";
      ce.className = "btn btn-md btn-default";
      ce.onclick = function () {
        down_all(url);
      };
      h1.append(ce);

      async function down_all(aurl) {
        let index = 0;
        let url_list = [];
        let isloop = true;
        while (isloop) {
          let url;
          if (aurl.lastIndexOf("?") > 0) {
            url = aurl.substring(0, aurl.lastIndexOf("?"));
          } else {
            url = aurl;
          }
          url = `${url}?type=S&start=${
            index * 30
          }&sortby=like&size=a&subtype=a`;

          console.log(url);
          const htmltext = await gethtml(url);

          let doc = $("<html></html>");
          doc.html(htmltext);
          const tlist = doc.find(doc_id);
          if (tlist.length == 0) {
            isloop = false;
          }

          for (let i = 0; i < tlist.length; i++) {
            const url = tlist[i].src.replace(pic_regex, replacefun(prefixs[0]));
            url_list.push(url);
          }

          index++;
        }

        console.log(url_list);
        let oknum = 0;
        let errornum = 0;

        for (let i = 0; i < url_list.length; i++) {
          const url = url_list[i];
          const name = title + "_" + url.substring(url.lastIndexOf("/") + 1); //.replace(".", "_");
          GM_download({
            url: url,
            name: name,
            onerror: (error) => {
              errornum++;
              console.log(url);
              console.log(error);
            },
            onload: () => {
              oknum++;
            },
          });
        }

        const time = url_list.length > 20 ? 2000 : 1000;

        const IntervalId = setInterval(() => {
          if (url_list.length == oknum + errornum) {
            const msg = `下载完成，共${url_list.length}个文件，成功${oknum}，失败${errornum}`;
            alert(msg);
            clearInterval(IntervalId);
          }
        }, time);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function pic_button() {
    try {
      if (
        /movie\.douban\.com\/photos\/photo/.test(location.href) ||
        /douban\.com\/game/.test(location.href) ||
        /douban\.com\/musician/.test(location.href) ||
        /douban\.com\/celebrity/.test(location.href)
      ) {
        console.log(" run  pic_button");

        let pic = document.querySelector(".mainphoto img");
        const h1 = document.querySelector("#content > h1");
        if (!pic) pic = document.querySelector(".photo img");

        let url = pic.src;
        const name = url.substring(url.lastIndexOf("/") + 1).replace(".", "_");

        console.log(url);

        const ce = document.createElement("button");
        ce.id = "CDownBtn";
        ce.textContent = "全部下载";
        ce.className = "btn btn-md btn-default";
        ce.onclick = function () {
          GM_download(url, name);
          ce.style.backgroundColor = "#87CEFA";
        };
        h1.append(ce);
        if (DBSetting.AUTO_MK) ce.click();
      }
    } catch (err) {
      console.log(err);
    }
  }

  function bigpic() {
    try {
      if (/all_photos/.test(location.href)) return;

      const imgs = document.querySelectorAll("img");
      let tindex = 0;
      imgs.forEach((img) => {
        if (img.src && pic_regex.test(img.src)) {
          let index = 0;
          img.src = img.src.replace(pic_regex, replacefun(prefixs[tindex]));
          img.onerror = (e) => {
            if (tindex != index) {
              index = 0;
            } else {
              index += 1;
              tindex = index;
            }
            if (index >= prefixs.length) return;
            img.src = img.src.replace(pic_regex, replacefun(prefixs[index]));
          };
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  function start() {
    console.log(" run  start");
    getSetting();

    if (/douban\.com\/game/.test(location.href)) {
    } else {
      bigpic();
    }
    pic_button();
    subject_button();
  }

  setTimeout(start, 300);
  // Your code here...
})();
