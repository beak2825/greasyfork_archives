// ==UserScript==
// @name 自动展开全文（手机版）
// @description CSDN，凤凰网，搜狐，简书，百度经验，360doc个人图书馆，百家号自动展开全文
// @version 15
// @author Lemon399
// @match *://blog.csdn.net/*
// @match *://*.ifeng.com/*
// @match *://m.sohu.com/*
// @match *://www.jianshu.com/*
// @match *://jingyan.baidu.com/*
// @match *://www.360doc.cn/*
// @match *://baijiahao.baidu.com/*
// @run-at document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/441224/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%EF%BC%88%E6%89%8B%E6%9C%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/441224/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%EF%BC%88%E6%89%8B%E6%9C%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  let rules = `
! 没有两个 # 的行和 开头为 ! 的行会忽略
! baidu.com##.ec_wise_ad
! :remove() 会用 js 移除元素，:remove() 必须放在行尾
! baidu.com###ad:remove()
! :click() 会用 js 模拟点击元素，必须放在行尾
! baidu.com###btn:click()
! 上面两个可以带参数，格式
! remove(100, 4, 200)
! 代表 首先延时 100 ms，然后执行 4 次，两次间隔 200 ms

//CSDN
blog.csdn.net##DIV#passportbox.passport-login-box
blog.csdn.net##DIV.feed-Sign-weixin
blog.csdn.net##DIV.weixin-shadowbox.wap-shadowbox
blog.csdn.net##DIV.app-shadwbox.wap-shadowbox
blog.csdn.net##DIV.app-box
blog.csdn.net##DIV.passport-login-mark


blog.csdn.net##div.pos-box > a.app-bt-cance.read_more_btn.close-icon:click()(300, 2, 3000)

//凤凰网;
ifeng.com##[class^='index_tip_']:click()(300, 5, 500)

//搜狐;
m.sohu.com##section#artLookAll.look-all:click()(300, 5, 500)

//百度经验
jingyan.baidu.com##DIV.read-whole:click()(600, 5, 500)

//360doc
www.360doc.cn##div.article_showall > A[href='javascript:void(0)']:click()(300, 5, 500)

//丁香园
3g.dxy.cn##DIV[class^='contentWrapBottomBtn_']:click()(500, 5, 500)
3g.dxy.cn##div[class^='btns___'] > div[class^='cancel___']:click()(700, 5, 500)
3g.dxy.cn##BUTTON.adm-button.adm-button-primary.adm-button-block.adm-button-fill-none.adm-button-shape-default.adm-modal-button[type='button'] > span:click()(800, 10, 500)

//简书

www.jianshu.com##div.guidance-wrap-item:nth-child(3) > .wrap-item-btn:click()(1500, 200, 2000)
www.jianshu.com##DIV.baidu-close-collapse-btn:click()(800, 200, 5000)
www.jianshu.com##BUTTON.cancel:click()(900, 200, 5000)

//夸克百科
baike.quark.cn##DIV.rax-view.wrc-modal-mask
baike.quark.cn##DIV.rax-view-v2.btn-main-more
baike.quark.cn##DIV.rax-view.wrc-modal-body

baike.quark.cn##DIV.rax-view-v2.btn-main-more:click()(500, 5, 500)
baike.quark.cn##div.rax-view-v2.confirm-cq-btn:nth-child(1) > span.rax-text-v2:click()(600, 5, 500)
//百家号
baijiahao.baidu.com##SPAN.iconArrow:click()(2000, 3, 2000)
  `,
    selarray = [];

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
    if (sel.split(op)[1].indexOf(",") > 0)
      tempParamArray = sel.split(op)[1].slice(0, -1).split(",");
    selarray.push({
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
      selarray.push({ sel: sel, type: 0 });
    }
  }

  let styelem = document.createElement("style");

  rules.split("\n").forEach((rule) => {
    if (rule.indexOf("!") == 0) {
      return;
    } else if (rule.indexOf("##") > 0) {
      let domains = rule.split("##")[0].split(","),
        selector = rule.split("##")[1];
      domains.forEach((domain) => {
        if (domain.slice(0, 1) == "~") {
          if (location.hostname.indexOf(domain.slice(1)) >= 0) return;
        } else {
          if (location.hostname.indexOf(domain) < 0) return;
        }
        parseFunc(selector);
      });
    } else if (rule.indexOf("##") == 0) parseFunc(rule.slice(2));
  });

  function myfun() {
    document.documentElement.appendChild(styelem);
    let csel = "";
    selarray.forEach((selo) => {
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
    if (csel.length >= 2)
      styelem.textContent = csel.slice(1) + " {display:none !important;};";
  }
  myfun();
})();