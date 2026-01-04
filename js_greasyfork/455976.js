// ==UserScript==
// @name 优雅的广告拦截脚本.轻量版
// @author Lemon399
// @description abp隐藏元素规则转换为css使用以及添加模拟点击功能点击关闭广告按钮
// @version 6.109
// @match *://*/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_xmlhttpRequest
// @grant GM_addStyle
// @grant GM_deleteValue
// @run-at document-start
// @connect fastly.jsdelivr.net
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/455976/%E4%BC%98%E9%9B%85%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E8%84%9A%E6%9C%AC%E8%BD%BB%E9%87%8F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455976/%E4%BC%98%E9%9B%85%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E8%84%9A%E6%9C%AC%E8%BD%BB%E9%87%8F%E7%89%88.meta.js
// ==/UserScript==

(function () {
  let rules = `
    ! 没有两个 # 的行和 开头为 ! 的行会忽略
    ! baidu.com##.ec_wise_ad
#@#[style^="pointer-events: none;background-image:url(': 2147483647; height: 123px; ']
qq.com##A[dt-eid^='em_item_ad']
//电影天堂
www.dy2018.com##DIV.nfbClose[onclick='closeNoticeFixedBox()']:click()(300, 5, 300)
//飞极速
feijisu20.com,feijisu21.com,feijisu22.com##[style$='!important; background-size: 405px 120px !important;']
www.pianbus.com##P[style$='-10000px !important;']
//阿虚同学
axutongxue.com##body > div[id] > ul[class] > li > A[href^='http'],body > div[id] > ul[class] > li > img.icon
axutongxue.com##BUTTON#btnClose:click()(500, 10, 500)
//禁漫天堂
18comic.org,18comic.vip,jmcomic1.city,jmcomic1.win,jmcomic1.group##.fas.fa-times:click()(1500, 5, 900)
//努努影院
##body.searchon.m-nav-full IMG[src*='png;base64']
##body.searchon.m-nav-full [style$=' !important; background-size: 400px 120px !important;']
##body.searchon.m-nav-full > [id][class][classname]
##body.searchon.m-nav-full A[id][class][href^='http'][target='_blank'][style]
##body.searchon.m-nav-full > [style^='background-image: url("http']
//啵乐
mybl.xyz##DIV.tool_item.disable_ad
mybl.xyz##[style$='width: 100%; position: fixed; left: 0px; bottom: 133px; height: 62px;']
mybl.xyz##[style='display: block; width: 100%; height: 133px;']
mybl.xyz##[style$='; background-size: 400px 133px !important;']
mybl.xyz##body > [id*='_'][class*='_']
mybl.xyz##svg[viewBox][version]
//樱花动漫
##strong > EM[style='display: inline-block;']
dmh8.me,dm88.me##[onclick='this.parentNode.style.display='none';']:click()(700, 5, 800)
m.dmh8.me,dm88.me##[style^='cursor: pointer; position: absolute;']:click()(700, 5, 800)
dmh8.me,dm88.me##IMG[onclick='funclose()'][style^='display:block;width:11px;height:11px;position:absolute;]:click()(700, 5, 800)
dmh8.me,dm88.me##[style^='background-image: url("http'][style*='png"); background-size: ']:click()(700, 5, 800)
//通用

    !
    ! :remove() 会用 js 移除元素，:remove() 必须放在行尾
    ! baidu.com###ad:remove()
    ! :click() 会用 js 模拟点击元素，必须放在行尾
    ! baidu.com###btn:click()
    ! 上面两个可以带参数，格式
    ! remove(100, 4, 200)
    ! 代表 首先延时 100 ms，然后执行 4 次，两次间隔 200 ms
    !
    ! 由于语法限制，一个反斜杠需要改成两个，像这样 \\
    !
    ! 脚本会首先尝试从下面的地址数组获取规则
    ! 获取到的规则将会与内置规则合并
    ! 所有规则获取完毕以后才会应用规则
    !
    ! 若要修改地址，请注意同步修改头部的 @connect 的域名
    `,
    ruleUrls = [
      "https://fastly.jsdelivr.net/gh/damengzhu/banad@main/jiekouAD.txt",
    ],
    selarray = [],
    welarray = [],
    seloarray = [],
    gmMenuId = [],
    disaKey = "ajs_disabled_domains",
    rulesKey = "ajs_saved_rules",
    updTimeKey = "ajs_rules_ver",
    savedRules = GM_getValue(rulesKey, undefined),
    disas = GM_getValue(disaKey, "").split(","),
    disa = disas.includes(location.hostname),
    styelem = document.createElement("style"),
    hideCss = " {display: none !important;visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px;}";

  function gmDisaMenuMgmt(disabled) {
    if (gmMenuId[0]) {
      GM_unregisterMenuCommand(gmMenuId[0]);
    }
    gmMenuId[0] = GM_registerMenuCommand(
      disabled ? "在此网站启用拦截" : "在此网站禁用拦截",
      gmValuesMgmt.bind(this, !disabled)
    );
  }

  function gmUpdMenuMgmt(start) {
    if (gmMenuId[1]) {
      GM_unregisterMenuCommand(gmMenuId[1]);
    }
    gmMenuId[1] = GM_registerMenuCommand(
      start
        ? "正在更新..."
        : "规则更新于 " + GM_getValue(updTimeKey, "未知时间"),
      fetchRules.bind(this, false, gmUpdMenuMgmt.bind(this, false))
    );
  }

  function gmValuesMgmt(add) {
    if (add) {
      if (!disas.includes(location.hostname)) {
        disas.push(location.hostname);
      }
      GM_setValue(disaKey, disas.join(","));
      disas = GM_getValue(disaKey, "").split(",");
      gmDisaMenuMgmt(true);
    } else {
      if (disas.includes(location.hostname)) {
        disas.splice(disas.indexOf(location.hostname), 1);
      }
      GM_setValue(disaKey, disas.join(","));
      disas = GM_getValue(disaKey, "").split(",");
      gmDisaMenuMgmt(false);
    }
  }

  function execOperation(sel, param, click) {
    setTimeout(() => {
      for (let c = parseInt(param[1]); c >= 1; --c) {
        setTimeout(() => {
          document
            .querySelectorAll(sel)
            .forEach((a) => (click ? a.click() : a.remove()));
        }, parseInt(param[2]) * (c - 1));
      }
    }, parseInt(param[0]));
  }
  function pushOperation(sel, op, type) {
    let tempParamArray = ["0", "1", "0"];
    if (sel.split(op)[1].indexOf(",") > 0) {
      tempParamArray = sel.split(op)[1].slice(0, -1).split(",");
    }
    seloarray.push({
      sel: sel.split(op)[0],
      type: type,
      param: tempParamArray,
    });
  }
  function parseFunc(sel) {
    if (sel.indexOf(":remove(") > 0) {
      pushOperation(sel, ":remove(", 1);
    } else if (sel.indexOf(":click(") > 0) {
      pushOperation(sel, ":click(", 2);
    } else {
      seloarray.push({ sel: sel, type: 0 });
    }
  }
  function parseDomains(rule, sep) {
    let domains = rule.split(sep)[0].split(","),
      selector = rule.split(sep)[1];
    domains.forEach((domain) => {
      if (domain.slice(0, 1) == "~") {
        if (location.hostname.indexOf(domain.slice(1)) >= 0) return;
      } else {
        if (location.hostname.indexOf(domain) < 0 && domain !== "*") return;
      }
      if (sep == "#@#") {
        welarray.push(selector);
      } else {
        selarray.push(selector);
      }
    });
  }
  function fetchRules(first, callback) {
    savedRules = "";
    gmUpdMenuMgmt(true);
    new Promise((resolve) => {
      let count = 0,
        append = (text) => {
          if (text) savedRules += `\n${text}\n`;
          count++;
          if (count >= ruleUrls.length) {
            GM_setValue(rulesKey, savedRules);
            if (first) rules += savedRules;
            GM_setValue(updTimeKey, new Date().toLocaleString());
            resolve();
          }
        };

      ruleUrls.forEach((url) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          onload: (r) => {
            append(r.responseText);
          },
          onabort: append.bind(this),
          onerror: append.bind(this),
          ontimeout: append.bind(this),
        });
      });
    }).then(callback);
  }
  function myfun() {
    if (
      parseInt(
        GM_getValue(updTimeKey, "0/0/0 0:0:0").split(" ")[0].split("/")[2]
      ) !== new Date().getDate()
    ) {
      fetchRules(false, gmUpdMenuMgmt.bind(this, false));
    }
    gmUpdMenuMgmt(false);
    let availCount = 0;
    rules.split("\n").forEach((rule) => {
      if (rule.indexOf("!") == 0) {
        return;
      } else if (rule.indexOf("[") == 0) {
        return;
      } else if (rule.indexOf("##+js") >= 0) {
        return;
      } else if (rule.indexOf("##^") >= 0) {
        return;
      } else if (rule.indexOf("#@#") > 0) {
        parseDomains(rule, "#@#");
        availCount++;
      } else if (rule.indexOf("#@#") == 0) {
        welarray.push(rule.slice(3));
        availCount++;
      } else if (rule.indexOf("##") > 0) {
        parseDomains(rule, "##");
        availCount++;
      } else if (rule.indexOf("##") == 0) {
        selarray.push(rule.slice(2));
        availCount++;
      }
    });

    gmMenuId[3] = GM_registerMenuCommand(
      `有效规则: ${availCount} / ${rules.split("\n").length}`,
      () => {
        gmMenuId.forEach((i) => GM_unregisterMenuCommand(i));
        GM_deleteValue(rulesKey);
        GM_deleteValue(disaKey);
        GM_deleteValue(updTimeKey);
      }
    );

    selarray.forEach((sel) => {
      if (!welarray.includes(sel)) parseFunc(sel);
    });
    let csel = "";
    seloarray.forEach((selo) => {
      switch (selo.type) {
        case 0:
          csel += `,${selo.sel}`;
          break;
        case 1:
          execOperation(selo.sel, selo.param, 0);
          break;
        case 2:
          execOperation(selo.sel, selo.param, 1);
          break;
      }
    });
    if (csel.length >= 2) {
      let crule = csel.slice(1) + hideCss;
      document.documentElement.appendChild(styelem);
      styelem.textContent = crule;
      GM_addStyle(crule);
      gmMenuId[2] = GM_registerMenuCommand(
        `应用规则: ${seloarray.length} 选择器: ${
          csel.slice(1).split(",").length
        }`,
        () => {
          alert("##" + csel.slice(1).split(",").join("\n##"));
        }
      );
    }
  }

  gmDisaMenuMgmt(disa);
  if (disa) return;

  if (typeof savedRules !== "string") {
    fetchRules(true, myfun);
  } else {
    rules += savedRules;
    myfun();
  }
})();