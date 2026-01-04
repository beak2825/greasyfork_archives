
// ==UserScript==
// @name         磁力链接百度网盘补完
// @namespace    http://tampermonkey.net/
// @version      2.91
// @description  磁力链接、百度网盘补完
// @author       backrock12
// @include      https://*
// @include      http://*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @exclude      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?www\.gamersky\.com(:[0-9]{1,5})?\/.*$)/
// @exclude      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?www\.baidu\.com(:[0-9]{1,5})?\/.*$)/
// @exclude      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?www\.ciweimao\.com(:[0-9]{1,5})?\/.*$)/
// @exclude      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?greasyfork\.org(:[0-9]{1,5})?\/.*$)/
// @exclude      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?pan\.baiduwp\.com(:[0-9]{1,5})?\/.*$)/
// @exclude      *aliyundrive*
// @connect      baidu.com
// @downloadURL https://update.greasyfork.org/scripts/383026/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A1%A5%E5%AE%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/383026/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A1%A5%E5%AE%8C.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var $ = $ || window.$;
  //   console.log("UrlLinePlugin");

  //延遲執行
  const await_url = [/tieba\.baidu\.com/, /xxgame\.net/];

  //字符串格式化方法
  String.prototype.UrlLineformat = function (args) {
    let result = this;
    if (arguments.length > 0) {
      if (arguments.length == 1 && typeof args == "object") {
        for (let key in args) {
          if (args[key] != undefined) {
            const reg = new RegExp("({" + key + "})", "g");
            result = result.replace(reg, args[key]);
          }
        }
      } else {
        for (let i = 0; i < arguments.length; i++) {
          if (arguments[i] != undefined) {
            const reg = new RegExp("({)" + i + "(})", "g");
            result = result.replace(reg, arguments[i]);
          }
        }
      }
    }
    return result;
  };

  $.fn.replaceText = function (search, replace, action, text_only) {
    return this.each(function () {
      var node = this.firstChild,
        val,
        new_val, // Elements to be removed at the end.
        remove = [];

      if (node) {
        do {
          if (node.nodeType === 3) {
            val = node.nodeValue;
            if (val && val.trim().length > 5) {
              if (!action && replace) {
                new_val = val.replace(search, replace);
              } else {

                const t = search.exec(val);
                // if (val.indexOf("baidu") > 0) {
                //   console.log(val);
                //   console.log(t);
                // }
                if (action && t && t.length > 0) new_val = action(node, val, t);
                else new_val = val;
              }
              if (new_val !== val) {
                if (!text_only && /</.test(new_val)) {
                  $(node).before(new_val);
                  remove.push(node);
                } else {
                  node.nodeValue = new_val;
                }
              }
            }
          }
        } while ((node = node.nextSibling));
      }
      remove.length && $(remove).remove();
    });
  };

  //默认配置参数  default settings
  const default_settings = {
    magnetfilter:
      /((\u672c\u7ad9\u6682?\u4e0d\u63d0\u4f9b(\u6587\u4ef6)?\u4e0b\u8f7d))|(不提供(文件)?下载)/g,
    magnetPattern:
      /(magnet:\?)?(xt=)?(urn:btih:)?(?=.{0,31}[0-9])(?=.{0,31}[a-z])([0-9A-Z]{32,40})(?![:.\-\!\?a-z0-9])/gi,
    pixivurl:
      "<a href='https://www.pixiv.net/member_illust.php?mode=medium&illust_id={0}' target='_blank'>{1}</a>",
    bilibiliurl:
      "<a href='https://www.bilibili.com/video/av{0}/' target='_blank'>{1}</a>",
    magneturl:
      "<a href='magnet:?xt=urn:btih:{0}' target='_blank' urlline='true'>magnet:?xt=urn:btih:{1}</a>",
    baiduurl1:
      "<a href='https://pan.baidu.com/s/1{0}' target='_blank' urlline='true' urltype='head'>" +
      " https://pan.baidu.com/s/1{1} </a>",
    baiduurl2:
      "<a href='https://pan.baidu.com/s/1{0}?pwd={1}' target='_blank' urlline='true' >{2}</a>",
    baiduurl3:
      "<a href='https://pan.baidu.com/s/1{0}' target='_blank' urlline='true' urltype='tail' >{1}</a>",
    baiduurl4:
      "<a href='https://pan.baidu.com/s/1{0}?pwd={1}' target='_blank' urlline='true' urltype='head'> https://pan.baidu.com/s/1{2}?pwd={3} </a>",
    baiduPattern0:
      /((https?:\/\/)?pan\.baidu\.com\/s\/1([a-zA-Z0-9_\-]{5,22})|(https?:\/\/)?pan\.baidu\.com\/share\/init\?surl=([a-zA-Z0-9_\-]{5,22})|[^a-zA-Z]s\/1([a-zA-Z0-9_\-]{5,22})|\bs\/1([a-zA-Z0-9_\-]{5,22}))/,
    baiduPattern1: /(https?:\/\/)?pan\.baidu\.com\/s\/1([a-zA-Z0-9_\-]{5,22})/,
    baiduPattern2:
      /(https?:\/\/)?pan\.baidu\.com\/share\/init\?surl=([a-zA-Z0-9_\-]{5,22})/,
    baiduPattern3: /\/?s\/1([a-zA-Z0-9_\-]{5,22})/,
    baiduPattern4: /\/?s?\/?1([a-zA-Z0-9_\-]{5,22})(?!\.)/,
    baiduPattern5: /(神秘代码)1([a-zA-Z0-9_\-]{5,22})/,
    common_reg1:
      /\s*(提取密碼|提取密码|提取码|提取碼|提取|密碼|密码|百度|百度云|云盘|yun|通关口令|本帖隐藏的内容)[:：]?\s*(<[^>]+>)?\s*([0-9a-zA-Z]{4,})\s*/,
    common_reg2:
      /\s*(百度网盘密码|提取密碼|提取密码|提取码|提取碼|提取|密碼|密码|百度|百度云|云盘|yun|通关口令|本帖隐藏的内容)[:：]?\s*/,
    common_reg3: /\s*(<[^>]+>)?\s*([0-9a-zA-Z]{4,})\s*/,
    common_reg4: /[:：]?\s*(<[^>]+>)?\s*([0-9a-zA-Z]{4,8})/,
    common_r: "\\s*({0})[:：]?\\s*(<[^>]+>)?\\s*([0-9a-zA-Z]{4,})\\s*",
    url_reg: /(http|https):\/\/(www.)?(\w+(\.)?)+/,
    Pwnum: 5,
    defaults_ULSetting: {
      Magnet_mk: true,
      Baidu_mk: true,
      CHeck_mk: true,
      Desc_mk: true,
      Log_mk: true,
      DescUrl: [],
      Pwlist: [],
    },
  };

  function FormatGet(key) {
    if (key == "DownUrl") {
      if (!arguments[3]) {
        return default_settings.baiduurl1.UrlLineformat(
          arguments[2],
          arguments[2]
        );
      } else {
        return default_settings.baiduurl2.UrlLineformat(
          arguments[2],
          arguments[3],
          arguments[3]
        );
      }
    } else if (key == "Url") {
      return default_settings.baiduurl3.UrlLineformat(
        arguments[0],
        arguments[1]
      );
    } else if (key == "baiduurl4") {
      if (!arguments[2]) {
        return default_settings.baiduurl1.UrlLineformat(
          arguments[1],
          arguments[1]
        );
      } else {
        return default_settings.baiduurl4.UrlLineformat(
          arguments[1],
          arguments[2],
          arguments[1],
          arguments[2]
        );
      }
    }
  }

  function SettingCheck(key, value) {
    if (key == "baiduPattern0") {
      return default_settings.baiduPattern0.test(value);
    } else if (key == "common_reg2") {
      return default_settings.common_reg2.test(value);
    }
  }

  function SettingGet(key, value) {
    let ss;
    if (key == "common_reg4") {
      return (ss = default_settings.common_reg4.exec(value)) && 3 === ss.length
        ? ss[2]
        : null;
    } else if (key == "common_reg3") {
      return (ss = default_settings.common_reg3.exec(value)) && 3 === ss.length
        ? ss[2]
        : null;
    } else if (key == "common_reg1") {
      return (ss = default_settings.common_reg1.exec(value)) && 4 === ss.length
        ? ss[3]
        : null;
    } else if (key == "baiduPattern0") {
      ss = default_settings.baiduPattern0.exec(value);
      return ss[3] ? ss[3] : ss[5] ? ss[5] : ss[6] ? ss[6] : ss[7];
    } else if (key == "baiduPattern4") {
      return (ss = default_settings.baiduPattern4.exec(value)) &&
        2 === ss.length
        ? ss[1]
        : null;
    }
  }

  function Getnextnode(node, isDesc_Mk) {
    let loopnum = default_settings.Pwnum;
    let bnode;
    if (isDesc_Mk) {
      bnode = node == node.previousSibling ? null : node.previousSibling;
    } else {
      bnode = node == node.nextSibling ? null : node.nextSibling;
    }
    if (!bnode)
      bnode = isDesc_Mk
        ? node.parentNode.previousSibling
        : node.parentNode.nextSibling;
    while (node && !bnode && loopnum >= 0) {
      bnode = isDesc_Mk ? node.previousSibling : node.nextSibling;
      node = node.parentNode;
      loopnum--;
      if (!bnode && bnode.length < 4) bnode = null;
    }
    return bnode;
  }

  function FindNextPw(node, Pid, isDesc_Mk = null) {
    let loopnum = default_settings.Pwnum;
    let isreg2 = false;
    let re = false;
    $(node).attr("urltype", "head");
    isDesc_Mk = isDesc_Mk;
    let bnode = Getnextnode(node, isDesc_Mk);
    if (bnode) {
      do {
        let bh = bnode.nodeValue ? bnode.nodeValue : bnode.outerHTML;
        let bt = bnode.nodeValue ? bnode.nodeValue : bnode.innerText;
        if (bnode && bt) {
          if (SettingCheck("baiduPattern0", bt)) break;
          let pw = SettingGet("common_reg1", bt);
          if (isreg2) pw = SettingGet("common_reg3", bt);
          if (pw != null && pw.length > 0 && pw.length < 8) {
            let retext = FormatGet("DownUrl", "", Pid, pw);
            let h = bh.replace(pw, retext);
            $(bnode).replaceWith(h);
            re = true;
            break;
          } else {
            if (SettingCheck("common_reg2", bt)) isreg2 = !isreg2;
          }
        }
        bnode = Getnextnode(bnode, isDesc_Mk);
        if (!bnode) break;
        if (!bt) {
          loopnum--;
        }
      } while (loopnum >= 0);
    }
    $(node).attr("urlline", re);
    $(node).attr("target", "_blank");
    return re;
  }

  function ReplaceorPw(node, e, n) {
    let Pid = SettingGet("baiduPattern0", n[0]);
    if (!Pid) return e;
    let retext = FormatGet("DownUrl", n[0], Pid);
    let v = e.replace(n[0], retext);
    let pw = SettingGet("common_reg1", e);
    let ischeck = false;
    let s;
    if (!pw) {
      s = e.substring(e.indexOf(Pid) + Pid.length);
      if (SettingCheck("baiduPattern0", s)) {
        ischeck = true;
      } else {
        pw = SettingGet("common_reg4", s);
      }
    }
    if (pw) {
      let retext2 = FormatGet("DownUrl", "", Pid, pw);
      v = v.replace(pw, retext2);
    } else {
      FindNextPw(node, Pid);
    }
    if (ischeck) {
      v = ReplaceorPw(node, v, [s]);
    }
    return v;
  }

  function UrlLinePlugin(options) {
    this.settings = $.extend({}, default_settings, options);
    this._defaults = default_settings;
    this.init();
  }

  let ULSetting;
  let Desc_Mk = false;
  let MenuID, setupID;

  UrlLinePlugin.prototype = {
    init: function () {
      //   console.log("init");
      let gm_Setting = GM_getValue("UrlLineSetting");

      ULSetting = $.extend({}, default_settings.defaults_ULSetting, gm_Setting);
      //   console.log(ULSetting);

      if (ULSetting.Desc_mk) {
        if (ULSetting.DescUrl && ULSetting.DescUrl.length > 0) {
          let DescTxt = `(${ULSetting.DescUrl.join("|")})`;
          if (DescTxt) {
            let DescUrlReg = new RegExp(DescTxt);
            if (DescUrlReg.test(location.href)) Desc_Mk = true;
          }
        }
      }

      addMenu(Desc_Mk);
      function addMenu(mk) {
        if (setupID) {
          if (ULSetting.Desc_mk) GM_unregisterMenuCommand(MenuID);
          GM_unregisterMenuCommand(setupID);
        }
        if (mk) {
          if (ULSetting.Desc_mk)
            MenuID = GM_registerMenuCommand("取消反向查找", OffDescUrl);
          setupID = GM_registerMenuCommand("设置", opensetup);
        } else {
          if (ULSetting.Desc_mk)
            MenuID = GM_registerMenuCommand("设置反向查找", OnDescUrl);
          setupID = GM_registerMenuCommand("设置", opensetup);
        }
      }

      function OnDescUrl() {
        let urls = location.href.match(default_settings.url_reg);
        if (urls) {
          if (!ULSetting.DescUrl) {
            ULSetting.DescUrl = [urls[0]];
          } else {
            ULSetting.DescUrl = ULSetting.DescUrl.concat(urls[0]);
          }
          GM_setValue("UrlLineSetting", ULSetting);
          Desc_Mk = true;
          addMenu(Desc_Mk);
          //   console.log(ULSetting);
        } else {
          console.log("OnDescUrl 获取URL失敗");
        }
      }

      function OffDescUrl() {
        let urls = location.href.match(default_settings.url_reg);
        if (urls) {
          let index = ULSetting.DescUrl.indexOf(urls[0]);
          if (index > -1) {
            ULSetting.DescUrl.splice(index, 1);
            GM_setValue("UrlLineSetting", ULSetting);
            Desc_Mk = false;
            addMenu(Desc_Mk);
          }
          //   console.log(ULSetting);
        } else {
          console.log("OffDescUrl 获取URL失敗");
        }
      }

      function opensetup() {
        let content = document.createElement("div");
        document.body.appendChild(content);
        content.outerHTML = `
                  <div id="ULPContent">
                  <div
                    style="color:#000000;font-size: 14px; width:250px;/*height:300px;*/position:fixed;left:50%;top:50%;margin-top:-50px;margin-left:-180px;z-index:100000;background-color:#ffffff;border:1px solid #afb3b6;opacity:0.95;filter:alpha(opacity=95);box-shadow:5px 5px 20px 0px#000;">
                    <div style="text-align:center">
                      <h3>设置</h3>
                    </div>
                    <div>
                      <div style="float: left;margin: 5px 0px 0px 10px;width: 85px;">magnet链接</div>
                      <div style="float: left;margin: 5px 0px 0px 5px;width: 140px;text-align: center;"><input id="Magnet_mk"
                          type="checkbox"></div>
                    </div>
 
                    <div>
                      <div style="float: left;margin: 5px 0px 0px 10px;clear: left;width: 85px;">百度网盘链接</div>
                      <div style="float: left;margin: 5px 0px 0px 5px;width: 140px;text-align: center;"><input id="Baidu_mk"
                          type="checkbox"></div>
                    </div>
                    <div>
                      <div style="float: left;margin: 5px 0px 0px 10px;clear: left;width: 85px;">检测链接状态</div>
                      <div style="float: left;margin: 5px 0px 0px 5px;width: 140px;text-align: center;"><input id="CHeck_mk"
                          type="checkbox"></div>
                    </div>
                    <div>
                    <div style="float: left;margin: 5px 0px 0px 10px;clear: left;width: 85px;">记录提取码</div>
                    <div style="float: left;margin: 5px 0px 0px 5px;width: 140px;text-align: center;"><input id="Log_mk"
                        type="checkbox"></div>
                    </div>
                    <div>
                      <div style="float: left;margin: 5px 0px 0px 10px;clear: left;width: 85px;">反向查找</div>
                      <div style="float: left;margin: 5px 0px 0px 5px;width: 140px;text-align: center;"><input id="Desc_mk"
                          type="checkbox"></div>
                    </div>
                    <div>
                      <div style="float: left;margin: 5px 0px 0px 10px;clear: left;width: 85px;">反向查找URL</div>
                      <div style="float: left;margin: 5px 0px 0px 5px;width: 140px;text-align: center;"><input id="DescUrl"
                          type="text" value="">
                      </div>
                    </div>
                    <div>
                      <div style="float: left;margin: 10px 0px 10px 10px;clear: left;width: 100px;text-align: center;">
                        <button id="btsvae">Save</button>
                      </div>
                      <div style="float: left;margin: 10px 0px 10px 10px;width: 100px;text-align: center;">
                        <button id="btcolse">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
                  `;

        $("#Magnet_mk").prop("checked", ULSetting.Magnet_mk);
        $("#Baidu_mk").prop("checked", ULSetting.Baidu_mk);
        $("#CHeck_mk").prop("checked", ULSetting.CHeck_mk);
        $("#Desc_mk").prop("checked", ULSetting.Desc_mk);
        $("#DescUrl").val(ULSetting.DescUrl.join("|"));
        $("#Log_mk").prop("checked", ULSetting.Log_mk);

        $("#btcolse").click(function () {
          $("#ULPContent").css("display", "none");
          $("#ULPContent").remove();
        });

        $("#btsvae").click(function () {
          ULSetting.Magnet_mk = $("#Magnet_mk").prop("checked");
          ULSetting.Baidu_mk = $("#Baidu_mk").prop("checked");
          ULSetting.CHeck_mk = $("#CHeck_mk").prop("checked");
          ULSetting.Desc_mk = $("#Desc_mk").prop("checked");
          ULSetting.DescUrl = $("#DescUrl").val().split("|");
          ULSetting.Log_mk = $("#Log_mk").prop("checked");

          GM_setValue("UrlLineSetting", ULSetting);
          $("#ULPContent").css("display", "none");
          $("#ULPContent").remove();
        });
      }
    },
    Star: function () {
      const t = this;
      //   console.log("star");

      let isawait = false;
      for (let index = 0; index < await_url.length; index++) {
        if (await_url[index].test(location.href)) isawait = true;
      }

      if (isawait) {
        setTimeout(function () {
          console.log("await");
          t.StarReplace.call(t);
        }, 2000);
      } else {
        t.StarReplace.call(t);
      }

      document.addEventListener("keydown", function (e) {
        /* CTR + Z */
        if (e.keyCode == 90 && e.ctrlKey) {
          t.StarReplace.call(t);
        } else if (e.keyCode == 88 && e.ctrlKey) {
          t.BaiduFilter(t);
        }
      });
    },
    StarReplace: function () {
      const obj = this;
      if (ULSetting.Magnet_mk) obj.MagnetReplace(obj);
      if (ULSetting.Baidu_mk) obj.BaiduReplace(obj);
      if (ULSetting.CHeck_mk) obj.BaiduCHeckStatus();
    },

    MagnetReplace: function (obj) {
      try {
        obj._subMagnetReplace(obj);
      } catch (err) {
        console.log("Magnet replace Error:" + err.message);
      }
    },

    BaiduReplace: function (obj) {
      try {
        if (/pan\.baidu\.com/.test(location.href)) {
          obj.BaiduPassword();
          obj.AddPWButton();
          setTimeout(function () {
            let g = $(".K5a8Tu");
            // console.log(g);
            if (g) g.hide();
          }, 100);
        } else {
          obj._subBaiduReplace();
        }
      } catch (err) {
        console.log("baidu replace Error:" + err.message);
      }
    },
    BaiduPassword: function () {
      //console.log("baiduPassword");
      // $(".file-name").css('white-space','inherit');
      $("[class*='global-icon-16']").css("float", "left");

      let url = location.href;
      if (location.hash) {
        url = location.href.substring(0, location.href.indexOf("#"));
      }

      let pwinput = $(".QKKaIE");
      if (!pwinput)
        pwinput = $(":contains('请输入提取码'):last").nextAll("input");
      if (!pwinput)
        pwinput = $(":contains('请输入提取码'):last").next().find("input");
      let pwbtn = $("a:contains('提取文件')");
      if (!pwbtn)
        pwinput = $("#submitBtn");

      pwbtn.click(function () {
        let pw = pwinput.val();
        if (pw) {
          let err = $("div:contains('提取码错误')");
          if (err.length > 0) return;
          let pwmap = new Map();
          if (ULSetting.Pwlist) pwmap = new Map(ULSetting.Pwlist);
          pwmap.set(url, pw);
          ULSetting.Pwlist = [...pwmap];
          GM_setValue("UrlLineSetting", ULSetting);
        }
      });

      if (pwbtn.length > 0) {
        //填寫密碼
        if (location.hash && location.hash.length == 5) {
          pwinput.val(location.hash.slice(1, 5));
          setTimeout(function () {
            pwbtn.click();
          }, 50);
        } else {
          if (ULSetting.Pwlist) {
            let pwmap = new Map(ULSetting.Pwlist);
            let pw = pwmap.get(url);
            if (pw) {
              pwinput.val(pw);
              setTimeout(function () {
                pwbtn.click();
              }, 50);
            }
          }
        }
      }
    },
    _subMagnetReplace: function () {

      const mlist = $("body *")
        .not("script")
        .not("a")
        .not("style")
        .not("meta")
        .not("input")
        .not("img")
        .not("title")
        .not("head")
        .not('iframe *')
        .not('video *')
        .not("link");
      mlist.replaceText(default_settings.magnetfilter, "");
      function magnetReplacer(match, p1, p2, p3, p4) {
        let value = match
          .replace("magnet:?", "")
          .replace("xt=", "")
          .replace("urn:btih:", "");
        return default_settings.magneturl.UrlLineformat(value, match);
      }
      $("body *")
        .not("script")
        .not("a")
        .not("style")
        .not("meta")
        .not("input")
        .not("img")
        .not("title")
        .not("head")
        .not('iframe *')
        .not('video *')
        .not("link")
        .not("a[urlline='true']")
        .replaceText(default_settings.magnetPattern, magnetReplacer);
      console.log(location.href + "is magnet replace");
    },

    _subBaiduReplace: function (obj) {
      function subpw() {
        let h = $(this).attr("href");
        if (SettingCheck("baiduPattern0", h)) {
          let Pid = SettingGet("baiduPattern0", h);
          FindNextPw(this, Pid);
        } else {
          if (/\.bdimg.com/.test(h)) {
            let t = $(this).text();
            if (SettingCheck("baiduPattern0", t)) {
              let tPid = SettingGet("baiduPattern0", t);
              FindNextPw(this, tPid);
            }
          }
        }
      }

      function subpwauto() {
        // console.log("subpwauto");
        if ($(this).attr("urlline") == true) {
          return;
        }
        let h = $(this).attr("href");
        if (h == "javascript:;") return;

        if (SettingCheck("baiduPattern0", h)) {
          let Pid = SettingGet("baiduPattern0", h);
          if (!FindNextPw(this, Pid, false)) {
            FindNextPw(this, Pid, true);
          }
        } else {
          if (/\.bdimg.com/.test(h)) {
            let t = $(this).text();
            if (SettingCheck("baiduPattern0", t)) {
              let tPid = SettingGet("baiduPattern0", t);
              if (!FindNextPw(this, tPid, false)) {
                FindNextPw(this, tPid, true);
              }
            }
          }
        }
      }

      let wlist = $("body *")
        .not("script")
        .not("a")
        .not("style")
        .not("meta")
        .not("input")
        .not("img")
        .not("title")
        .not("head")
        .not('iframe *')
        .not('video *')
        .not("link");


      // wlist = wlist.filter(function () {
      //   console.log('filter')
      //   const aa = $(this).attr("class");
      //   if (aa && aa.indexOf('bpx-') > -1) {
      //     console.log($(this).attr("class"))
      //     console.log($(this).contents().find('iframe').length)


      //     if (self.frameElement) {
      //       console.log(self.frameElement.tagName);
      //     }
      //     return false;
      //   }
      //   return $(this).closest('iframe').length === 0;
      // });
      //   console.log(wlist);

      wlist.replaceText(
        default_settings.baiduPattern0,
        function (match, p1, p2, p3) {
          // console.log(match);
          let Pid = SettingGet("baiduPattern0", match);
          return FormatGet("Url", Pid, match);
        },
        ReplaceorPw
      );

      $("a[urlline!='true']").each(subpwauto);
      //$("a").click(subpwauto);
      console.log(location.href + "is baidu replace");
    },

    BaiduFilter: function (obj) {
      let r = window.getSelection();
      if (r.rangeCount > 0) {
        for (let i = 0; i < r.rangeCount; i++) {
          let s = r.getRangeAt(i);
          let seltext = s.toString();
          console.log("Selection" + seltext);
          let filtertext = seltext.replace(
            /([\u4e00-\u9fa5]|[：:?？!！])+/,
            ""
          );
          let Pid, purl, pw;
          if (SettingCheck("baiduPattern0", filtertext)) {
            Pid = SettingGet("baiduPattern0", filtertext);
          }
          if (!Pid) Pid = SettingGet("baiduPattern4", filtertext);

          if (Pid) {
            let lasttext = $.trim(
              filtertext.substring(filtertext.indexOf(Pid) + Pid.length)
            );
            if (lasttext) {
              pw = SettingGet("common_reg1", lasttext);
              if (!pw) pw = SettingGet("common_reg4", lasttext);
            }
            purl = FormatGet("baiduurl4", Pid, pw);
          }

          if (purl) {
            let a = $(purl)[0];
            try {
              s.insertNode(a);
              let span = $('<span style="color:#A9A9A9"></span>')[0];
              s.surroundContents(span); //将创建的元素环绕在光标选中的文字周围
              s.collapse(false);
              console.log("Selection Success" + s);
            } catch (e) {
              console.log("Selection Error" + e.message);
            }
          }
        }
      }
    },

    AddPWButton: function () {
      //   console.log("AddPWButton");

      //       $("div.slide-show-right").css("width", "500px");
      //       let Pbutton = $('<span class="g-dropdown-button"></span>');
      //       let button_a = $(
      //         '<a class="g-button g-button-blue" data-button-id="b200" data-button-index="200" href="javascript:void(0);"></a>'
      //       );
      //       let button_a_span = $(
      //         '<span class="g-button-right"><em class="icon icon-download" title="跳转到PanDownload"></em><span class="text" style="width: 60px;">PanDown</span></span>'
      //       );
      //       let Pbutton_span = $(
      //         '<span class="menu" style="width:auto;z-index:41"></span>'
      //       );

      //       button_a.append(button_a_span);
      //       Pbutton.append(button_a).append(Pbutton_span);
      //       Pbutton.click(function() {
      //         let url = window.location.href;
      //         url = url.replace("baidu.com", "baiduwp.com");
      //         window.open(url, "_blank");
      //       });
      //       $("div.module-share-top-bar div.bar div.x-button-box").append(Pbutton);
      //Pbutton.insertBefore($("a:contains('请输入提取码')"));

      setTimeout(noad, 500);
      setTimeout(noad, 1000);
      setTimeout(noad, 3000);

      function noad() {
        $("#web-multi-bottom > a:nth-child(2)").css("display", "none");
        $("#web-right-view").css("display", "none");
        $(".gOIbzPb").css("display", "none");
        $(".vyQHNyb").css("display", "none");
        $(".app-download").css("display", "none");
        $(".KQcHyA").css("display", "none");
        $(".share-center").css("display", "none");
        $("#web-single-bottom").css("display", "none");
        $(".phone-banner").css("display", "none");

        $("body > div").css("background-image", "")
        $(".mainContent").css("background-image", "")

        $(".business-ad-content").css("display", "none");
        $(".btn-img-tips").css("display", "none");


        const styletext = '#init-new > div { top: 50%;left: 50%;transform: translate(-50%, -50%); }';
        GM_addStyle(styletext)
        // console.log("noad");
      }
    },
    BaiduCHeckStatus: function () {
      //$("a[urlline]").each(function () {
      $("a[urltype='head']").each(function () {
        let h = $(this).attr("href");
        httpcheck(h, this);
      });
      console.log(location.href + "is BaiduCHeckStatus");

      let pageTexts = [
        { key: "链接不存在", status: "isDisabled" },
        { key: "页面不存在", status: "isDisabled" },
        { key: "无法访问", status: "isDisabled" },
        { key: "已过期", status: "isDisabled" },
        { key: "你来晚了", status: "isDisabled" },
        { key: "请输入提取码", status: "isLock" },
        { key: "失效时间", status: "isOk" },
        { key: "过期时间", status: "isOk" },
      ];

      const css =
        `.UL_ico_isLock{
                  background: transparent url("data:image/png;base64,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") center left no-repeat;
                  padding-left: 20px;
                  background-size:18px 18px;}` +
        `.UL_ico_isOk{
                  background: transparent url("data:image/png;base64,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") center left no-repeat;
                  padding-left: 20px;
                  background-size:16px 16px;}` +
        `.UL_ico_isDisabled{
                  background: transparent url("data:image/png;base64,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") center left no-repeat;
                  padding-left: 20px;
                  background-size:16px 16px;}` +
        `.UL_ico_isUnknown{
                  background: transparent url("data:image/png;base64,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") center left no-repeat;
                  padding-left: 20px;
                  background-size:16px 16px;}`;

      GM_addStyle(css)

      // let ulbody = document.getElementsByTagName("body")[0];
      // if (!ulbody) return;
      // let ulstyle = document.createElement("style");
      // ulstyle.innerHTML = css;
      // ulbody.appendChild(ulstyle);

      function httpcheck(url, ele) {
        GM_xmlhttpRequest({
          url: url,
          method: "GET",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          onload: function (response) {
            if (response.status == 200 || response.status == "200") {
              let responseText = response.responseText;
              let status;
              if (!responseText) {
                //为空，地址出现了重定向 或 其它情况
                status = "isUnknown";
              } else {
                responseText = responseText
                  .replace(/\s+/g, "")
                  .substring(0, 14999);
                console.log(responseText);
                status = "isUnknown";
                for (let index = 0; index < pageTexts.length; index++) {
                  const element = pageTexts[index];
                  if (responseText.indexOf(element.key) != -1) {
                    status = element.status;
                    break;
                  }
                }
              }
              ele.classList.add("UL_ico_" + status);
            }
          },
        });
      }
    },
  };

  const e = new UrlLinePlugin();
  e.Star();
})();