// ==UserScript==
// @name              绅士仓库评论帖子屏蔽
// @description       提供绅士仓库 评论和帖子 的屏蔽功能, 支持按用户、分类、关键字屏蔽
// @namespace         moe.cangku.mengzonefire
// @version           1.2.5
// @author            mengzonefire
// @license           MIT
// @icon              https://cangku.moe/favicon.ico
// @match             *://cangku.moe/*
// @require           https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require           https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             unsafeWindow
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/445959/%E7%BB%85%E5%A3%AB%E4%BB%93%E5%BA%93%E8%AF%84%E8%AE%BA%E5%B8%96%E5%AD%90%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/445959/%E7%BB%85%E5%A3%AB%E4%BB%93%E5%BA%93%E8%AF%84%E8%AE%BA%E5%B8%96%E5%AD%90%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
!(function () {
  "use strict";
  // 全局变常量声明
  const host = "cangku.moe";
  const regUserId = new RegExp("/user/(\\d+)");
  const regArchive = new RegExp("/archives/(\\d+)");
  const regHome = new RegExp(`${host}/($|\\?page=\\d+)`);
  const regRank = new RegExp("/rank");
  const regCategory = new RegExp("/category/(\\d+)($|\\?page=\\d+)");
  const regAccount = new RegExp("/account");
  const regNoti = new RegExp("/notification\\?type=reply");
  const regUserPage = new RegExp(`/user/\\d+`);
  const archiveBtn =
    '<a id="mzf-archive-action" href="javascript:;" class="meta-label primary text-small"></a>'; //帖子页面内 标签上的屏蔽按钮
  const userAction =
    '<div id="mzf-user-action" style="position: absolute;z-index: 100;right: 0px;top: 0px;"></div>'; //用户主页的屏蔽按钮父元素
  const userBtn =
    '<button type="button" class="btn" style="margin-top: 5px;margin-right: 5px;"></button>'; //用户主页的屏蔽按钮
  const homeBtn =
    '<a id="mzf-block-archive" href="javascript:;" class="view meta-label">屏蔽作者</a>'; //主页的帖子屏蔽按钮
  const commentBtn =
    '<a id="mzf-block-comment" href="javascript:;" class="operate-btn"> 屏蔽用户 </a>'; //帖子下的评论屏蔽按钮
  const notiBtn =
    '<a id="mzf-block-comment2" href="javascript:;" style="margin-left:5px;white-space:nowrap;">屏蔽用户</a>'; //通知页评论屏蔽按钮
  const categoryBtn =
    '<button id="category-block-btn" categoryId="0" categoryStr="" type="button" class="btn btn-primary">屏蔽分类: </button>'; // 分类屏蔽按钮
  const setBtn =
    '<li class="menu-list-item"><a id="mzf-block-set" href="javascript:;">屏蔽设置</a></li>'; //账户设置页的设置按钮
  const setCard =
    '<div id="mzf-manage-card" class="card manage-card"> <div class="card-header"> <h3 class="title">屏蔽设置</h3> </div> <div class="card-body"> <p>用户id获取: 用户主页 -&gt; https://cangku.moe/user/[用户id]; 每条id用空格分隔</p> <div class="form-group"><label>屏蔽评论的用户id:</label><input id="mzf-input-id1" type="text" class="form-control"> </div> <div class="form-group"><label>屏蔽帖子的用户id:</label><input id="mzf-input-id2" type="text" class="form-control"> </div> <div class="form-group"><label>屏蔽评论关键字 (多个关键字以英文逗号 , 分隔):</label><input id="mzf-input-keyword1" type="text" class="form-control"></div> <div class="form-group"><label>屏蔽帖子标题关键字 (多个关键字以英文逗号 , 分隔):</label><input id="mzf-input-keyword2" type="text" class="form-control"></div> <p>分类id获取: 分类页面 -&gt; https://cangku.moe/category/[分类id]; 每条id用空格分隔</p> <div class="form-group"><label>屏蔽帖子分类id (黑名单, 此规则在分类页排行页和白名单不为空时不生效):</label><input id="mzf-input-id3" type="text" class="form-control"> </div> <div class="form-group"><label>仅显示帖子分类id (白名单, 此规则优先于黑名单, 在分类页排行页不生效):</label><input id="mzf-input-id4" type="text" class="form-control"> </div> <div class="form-group"><label for="block-mode">帖子屏蔽方式:</label><select id="archive-block-mode" class="form-control"> <option value="hidden"> 隐藏 (直接隐藏帖子,不显示) </option> <option value="blur"> 模糊 (模糊帖子标题和封面) </option> </select></div> <div class="form-group"><label for="block-mode">评论屏蔽方式:</label><select id="comment-block-mode" class="form-control"> <option value="hidden"> 隐藏 (隐藏评论及相关回复,即整楼隐藏) </option> <option value="replace"> 打码 (整条评论或屏蔽的关键词替换为***) </option> </select></div> <div class="form-group"> <label>常用功能开关:</label> <div class="row align-items-center"> <div class="form-check form-switch col-auto"> <div role="switch" class="el-switch mzf-switch" size="large"><input type="checkbox" class="el-switch__input" id="archive-block-switch"> <span class="el-switch__core" style="width: 40px;"></span> </div><label class="form-check-label ml-1">帖子屏蔽总开关</label> </div> <div class="form-switch col-auto"> <div role="switch" class="el-switch mzf-switch" size="large"><input type="checkbox" class="el-switch__input" id="comment-block-switch"> <span class="el-switch__core" style="width: 40px;"></span> </div><label class="form-check-label ml-1">评论屏蔽总开关</label> </div> <div class="form-switch col-auto"> <div role="switch" class="el-switch mzf-switch" size="large"><input type="checkbox" class="el-switch__input" id="author-comment-only"> <span class="el-switch__core" style="width: 40px;"></span> </div><label class="form-check-label ml-1">帖子内只显示作者评论</label> </div> <div class="form-switch col-auto"> <div role="switch" class="el-switch mzf-switch" size="large"><input type="checkbox" class="el-switch__input" id="block-latest-comment"> <span class="el-switch__core" style="width: 40px;"></span> </div><label class="form-check-label ml-1">隐藏右侧最新评论</label> </div> </div> </div> <div id="" class="form-group pt-4 mb-0"><button id="mzf-save-id" class="el-button el-button--success el-button--medium"><span>保存修改</span></button></div> </div> </div>'; // 设置界面
  const disableblurBtn =
    '<button id="disable-blur-btn" type="button" class="btn btn-info" style="z-index: 2; position: absolute; top: 50%; left: 50%; transform: scale(1.3) translate(-38%, -63%);">已屏蔽,点击显示</button>';
  const blurWrapper =
    '<div id="disable-click-wrapper" style=" width: 100%; height: 100%; z-index: 1; position: absolute; "></div>';
  const scriptHomePage = "https://greasyfork.org/zh-CN/scripts/445959";
  const domParseFail = `DOM解析失败, 请前往反馈:\n${scriptHomePage}`;
  const MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver;
  const configList = {
    // 配置数据条目以及对应的初值
    blockArchiveId: "",
    blockCommentId: "",
    blockCategoryId: "",
    blockArchiveKeyword: "",
    blockCommentKeyword: "",
    showCategoryId: "",
    archiveBlockMode: "hidden",
    commentBlockMode: "hidden",
    archiveBlockSwitch: true,
    commentBlockSwitch: true,
    authorCommentOnly: false,
    blockLatestComment: false,
  };
  const config = {}; // 预缓存GM本地存储内的配置数据
  const categoryData = {}; // {"archieveId":[catagoryIdList]}
  const key2IdDict = {
    blockLatestComment: "block-latest-comment",
    authorCommentOnly: "author-comment-only",
    commentBlockSwitch: "comment-block-switch",
    archiveBlockSwitch: "archive-block-switch",
  }; // 几个功能开关的 key:id 键值对
  var observer1, observer2, observer3;

  function reloadConfig() {
    for (let key in configList) {
      let val = GM_getValue(key);
      config[key] = val === undefined ? configList[key] : val;
    }
  } // 重载配置数据

  /**
   * @description: 生成一个block列表(用户id,分类id,关键词)的管理实例
   * @param {*} listName block列表名称, 取值如下:
   * blockArchiveId: 屏蔽帖子的用户id blockCommentId: 屏蔽评论的用户id blockCategoryId: 屏蔽帖子的分类id (黑名单, 空格分隔符)
   * blockArchiveKeyword: 屏蔽帖子的关键词 blockCommentKeyword: 屏蔽评论的关键词 (英文逗号 , 分隔符) showCategoryId: 仅显示帖子的分类id (白名单)
   * @return {*} 管理实例, 包含增删查改的接口
   */
  function blockManager(listName) {
    let listStr = config[listName]; // 表数据
    let listType, separator, list;
    if (listName.includes("Id")) {
      listType = "Id";
      separator = " ";
      list = new Set(listStr.split(/\s+/));
    } else if (listName.includes("Keyword")) {
      listType = "Keyword";
      separator = ", ";
      list = new Set(listStr.split(",").map((str) => str.trim()));
    } else return null; // 表名不正确

    return {
      set(newList) {
        // 设置表, 注意参数newList为Array<String>类型
        let configVal = Array.from(new Set(newList)).join(separator); // 使用set结构实现去重
        config[listName] = configVal;
        GM_setValue(listName, configVal);
      },
      add(ele) {
        // 添加表条目(可以是用户id,分类id或关键词), 元数据使用set结构存储, 自带去重
        list.add(ele);
        let configVal = Array.from(list).join(separator);
        config[listName] = configVal;
        GM_setValue(listName, configVal);
      },
      remove(ele) {
        // 删除表条目
        list.delete(ele);
        let configVal = Array.from(list).join(separator);
        config[listName] = configVal;
        GM_setValue(listName, configVal);
      },
      isBlock(ele) {
        // 检查表内是否存在block条目, id类list返回bool, keyword类list则返回识别到的keyword条目或空字符串
        if (listType == "Id") return list.has(ele);
        else if (listType == "Keyword") {
          let tempList = Array.from(list);
          // console.log(tempList, ele); // debug
          for (let keyword of tempList)
            if (keyword && ele.includes(keyword)) return keyword;
        }
        return "";
      },
    };
  }

  // 主函数入口
  function main() {
    reloadConfig();
    addBtnListen();
    addObserver();
  }

  // 绑定dom监听器
  function addObserver() {
    let target,
      href = location.href;
    let observer = new MutationObserver(urlChangeHandler);
    observer.observe($("head > title")[0], {
      childList: true,
    });
    if (href.match(regArchive)) {
      // 帖子内的评论列表并不会立即加载, 添加轮询
      target = $("#comment");
      if (target.length) {
        observer1 && observer1.disconnect(); // 解除多余绑定防止卡顿
        observer1 = new MutationObserver(ArchiveHandler);
        observer1.observe(target[0], {
          childList: true,
          subtree: true,
        });
        // 提前执行隐藏以提升效果速度
        if (config["blockLatestComment"])
          $("ul.comment.reset-ul-style").css("display", "none"); // 隐藏右侧 "最新评论"
        addArchiveBtn();
      }
    } else if (
      href.match(regHome) ||
      href.match(regCategory) ||
      href.match(regRank)
    ) {
      target = $(
        "div.post-list>span.row, div.category-post>span.row, div.rank-post>span.row"
      );
      if (target.length) {
        observer2 && observer2.disconnect();
        observer2 = new MutationObserver(HomeHandler);
        observer2.observe(target[0], {
          childList: true,
        });
      }
    } else if (href.match(regNoti)) {
      observer3 && observer3.disconnect();
      observer3 = new MutationObserver(NotiHandler);
      observer3.observe($("div.notification-list")[0], {
        childList: true,
      });
    } else if (href.match(regAccount) && !$("#mzf-block-set").length)
      addSetBtn();
    else if (href.match(regUserPage)) addUserBtn();
  }

  // 页面变化事件回调handler定义
  // url变化回调
  function urlChangeHandler() {
    // 页面变更, 重绑定监听器
    observer1 && observer1.disconnect();
    observer2 && observer2.disconnect();
    observer3 && observer3.disconnect();
    addObserver();
  }

  // 帖子内的评论列表变化回调
  function ArchiveHandler(_mutationList) {
    // 由于评论列表为动态加载, 故在此回调内添加评论屏蔽按钮
    if (!$("#mzf-block-comment").length) {
      $("div.comment-operate").append(commentBtn);
      killComment();
    }
  }

  // 主页的帖子列表变化回调
  function HomeHandler() {
    // 在主页时, 对右侧5条最新评论执行检查
    location.href.match(regHome) && killComment(false, true);

    // 由于帖子列表为动态加载, 故在此回调内添加帖子屏蔽按钮
    if (!$("#mzf-block-archive").length)
      $("span.view.meta-label").after(homeBtn);

    // 添加分类屏蔽按钮
    let categoryBtnTarget = $("ul.list.reset-ul-style.second-category");
    if (categoryBtnTarget.length) {
      let checkELe = $("div.simple-navbar a.active:last");
      let categoryId = checkELe.attr("href").match(regCategory);
      if (categoryId) {
        categoryId = categoryId[1];
        let blocked = blockManager("blockCategoryId").isBlock(categoryId);
        let categoryStr = checkELe.text();
        let btn = $("#category-block-btn");
        if (btn.length)
          btn
            .attr({ categoryId: categoryId, categoryStr: categoryStr })
            .html(`${blocked ? "解除屏蔽" : "屏蔽分类"}: ${categoryStr}`);
        // 按钮存在, 更新数据
        else
          categoryBtnTarget.before(
            $(categoryBtn)
              .attr({ categoryId: categoryId, categoryStr: categoryStr })
              .html(`${blocked ? "解除屏蔽" : "屏蔽分类"}: ${categoryStr}`)
          ); // 按钮不存在, 添加按钮}
      }
    }

    killArchive();
  }

  // 通知页的评论列表变化回调
  function NotiHandler() {
    // 由于评论列表为动态加载, 故在此回调内添加评论屏蔽按钮
    $("time").each((_, item) => {
      if (!$(item).next("#mzf-block-comment2").length) $(item).after(notiBtn);
    });

    killComment(true);
  }

  // DOM按钮添加方法定义
  // 添加帖子内的帖子屏蔽按钮
  function addArchiveBtn() {
    if ($("#mzf-archive-action").length) return;
    let target = $("article div.header div.meta");
    let userId = [...target[0].children[0].href.matchAll(/user\/(\d+)/g)][0];
    if (!userId) return; // 未加载到href属性
    userId = userId[1];
    let blocked = blockManager("blockArchiveId").isBlock(userId);
    let blockArchiveBtn = $(archiveBtn)
      .attr("userId", userId)
      .text(blocked ? "解除屏蔽" : "屏蔽作者")
      .on("click", onBlockArchive2);
    target.append(blockArchiveBtn);
  }

  // 添加用户主页的按钮(屏蔽帖子和评论)
  function addUserBtn() {
    if ($("#mzf-user-action").length) return;
    let userId = location.href.match(/user\/(\d+)/)[1];
    let isblockArc = blockManager("blockArchiveId").isBlock(userId);
    let isblockCom = blockManager("blockCommentId").isBlock(userId);
    let blockArchiveBtn = $(userBtn)
      .attr("userId", userId)
      .text(isblockArc ? "解除帖子屏蔽" : "屏蔽用户帖子")
      .addClass(isblockArc ? "btn-success" : "")
      .on("click", onUserBlockArchiveBtn);
    let bnBlockCommentBtn = $(userBtn)
      .attr("userId", userId)
      .text(isblockCom ? "解除评论屏蔽" : "屏蔽用户评论")
      .addClass(isblockCom ? "btn-danger" : "btn-secondary")
      .on("click", onUserBlockCommentBtn);
    $("div.user-header-info-body").prepend(
      $(userAction).append(blockArchiveBtn, bnBlockCommentBtn)
    );
  }

  // 添加设置按钮
  function addSetBtn() {
    $("li.menu-list-item a").click(() => {
      $("#mzf-block-set").removeClass();
      $("#mzf-manage-card").css("display", "none");
      $("div.col-md-9>.manage-card[id!='mzf-manage-card']").css(
        "display",
        "flex"
      );
      $('a[aria-current="page"]').addClass("router-link-exact-active active");
    }); // 绑定原侧栏按钮事件切换dom显隐，防止干扰原生的切换效果
    $("ul.menu-group-list").append(setBtn);
  }

  // 按钮事件定义
  // 用户主页的帖子屏蔽按钮
  function onUserBlockArchiveBtn(btn) {
    let ele = $(btn.target);
    let blocked = !blockManager("blockArchiveId").isBlock(ele.attr("userId"));
    ele.html(blocked ? "解除帖子屏蔽" : "屏蔽用户帖子");
    blocked ? ele.addClass("btn-success") : ele.removeClass("btn-success");
    blocked
      ? blockManager("blockArchiveId").add(ele.attr("userId"))
      : blockManager("blockArchiveId").remove(ele.attr("userId"));
  }

  // 用户主页的评论屏蔽按钮
  function onUserBlockCommentBtn(btn) {
    let ele = $(btn.target);
    let blocked = !blockManager("blockCommentId").isBlock(ele.attr("userId"));
    ele.html(blocked ? "解除评论屏蔽" : "屏蔽用户评论");
    ele.removeClass(blocked ? "btn-secondary" : "btn-danger");
    ele.addClass(blocked ? "btn-danger" : "btn-secondary");
    blocked
      ? blockManager("blockCommentId").add(ele.attr("userId"))
      : blockManager("blockCommentId").remove(ele.attr("userId"));
  }

  // 设置按钮回调
  function onSetingBtn() {
    if ($("a.router-link-exact-active.active").attr("id") == "mzf-block-set")
      return; // 已在设置界面, 跳出
    $("a.router-link-exact-active.active").removeClass();
    $("#mzf-block-set").addClass("router-link-exact-active active"); //切换左侧侧栏按钮激活样式
    $("div.col-md-9>.manage-card").css("display", "none"); // 隐藏原dom，不要删除或替换，会导致原生切换失效
    if (!$("#mzf-manage-card").length)
      $("div.col-md-9>.manage-card").after(setCard); // 设置页dom不存在,添加dom
    $("#mzf-manage-card").css("display", "flex"); // 显示dom
    $("#mzf-input-id1")[0].value = config["blockCommentId"];
    $("#mzf-input-id2")[0].value = config["blockArchiveId"];
    $("#mzf-input-id3")[0].value = config["blockCategoryId"];
    $("#mzf-input-id4")[0].value = config["showCategoryId"];
    $("#mzf-input-keyword1")[0].value = config["blockCommentKeyword"];
    $("#mzf-input-keyword2")[0].value = config["blockArchiveKeyword"];
    $("#archive-block-mode")[0].value = config["archiveBlockMode"];
    $("#comment-block-mode")[0].value = config["commentBlockMode"];
    for (let key in key2IdDict) {
      let id = key2IdDict[key];
      if (config[key]) {
        let btn = $(`#${id}`);
        btn[0].checked = true;
        btn.parent().addClass("is-checked");
      }
    }
  }

  // 设置界面保存按钮回调
  function onSaveSetingBtn() {
    let blockCommentId = $("#mzf-input-id1")[0].value.split(/\s+/);
    let blockArchiveId = $("#mzf-input-id2")[0].value.split(/\s+/);
    let blockCategoryId = $("#mzf-input-id3")[0].value.split(/\s+/);
    let showCategoryId = $("#mzf-input-id4")[0].value.split(/\s+/);
    let blockCommentKeyword = $("#mzf-input-keyword1")[0]
      .value.split(",")
      .map((str) => str.trim()); // 关键词列表使用trim方法修剪处理以保证准确性
    let blockArchiveKeyword = $("#mzf-input-keyword2")[0]
      .value.split(",")
      .map((str) => str.trim());
    config["archiveBlockMode"] = $("#archive-block-mode")[0].value;
    config["commentBlockMode"] = $("#comment-block-mode")[0].value;
    GM_setValue("archiveBlockMode", config["archiveBlockMode"]);
    GM_setValue("commentBlockMode", config["commentBlockMode"]);
    blockManager("blockCommentId").set(blockCommentId);
    blockManager("blockArchiveId").set(blockArchiveId);
    blockManager("blockCategoryId").set(blockCategoryId);
    blockManager("showCategoryId").set(showCategoryId);
    blockManager("blockCommentKeyword").set(blockCommentKeyword);
    blockManager("blockArchiveKeyword").set(blockArchiveKeyword);
    for (let key in key2IdDict) {
      let id = key2IdDict[key];
      config[key] = $(`#${id}`)[0].checked;
      GM_setValue(key, config[key]);
    }
    alert("设置成功, 刷新页面生效");
  }

  // 帖子外的帖子屏蔽按钮回调, 无状态
  function onBlockArchive(btn) {
    // 已是屏蔽状态, 执行恢复模糊操作
    if ($(btn.target).text() == "恢复模糊") {
      $(btn.target)
        .parents("div.post-card-content:first")
        .css("filter", "blur(1.2rem)")
        .parents("section.post-card-wrap:first")
        .prepend(disableblurBtn + blurWrapper); // 复原模糊
      return;
    }

    let ele = $(btn.target).parents("div.post").find("a.meta-label:first");
    let userId = ele.attr("href").match(regUserId)[1];
    if (ele.length && userId) {
      blockManager("blockArchiveId").add(userId);
      alert(`帖子作者: ${ele.text()} 屏蔽成功`);
      killArchive();
    } else alert(domParseFail);
  }

  // 帖子内的帖子屏蔽按钮回调, 包含两种状态
  function onBlockArchive2(btn) {
    let ele = $(btn.target);
    let blocked = !blockManager("blockArchiveId").isBlock(ele.attr("userId"));
    ele.html(blocked ? "解除屏蔽" : "屏蔽作者");
    blocked
      ? blockManager("blockArchiveId").add(ele.attr("userId"))
      : blockManager("blockArchiveId").remove(ele.attr("userId"));
  }

  // 帖子内的评论条目的屏蔽按钮, 以及通知页的回复评论屏蔽按钮回调
  function onBlockComment(btn, isNotiPage = false) {
    let ele = $(btn.target);
    let commentContent = ele
      .parents(isNotiPage ? "a.notification-item" : "li[id]:first")
      .find(isNotiPage ? "div.comment span" : "div.comment-text:first");

    // 已屏蔽状态, 执行操作切换 原文/码文
    if (commentContent.length && commentContent[0].oriContent) {
      let temp = commentContent[0].oriContent;
      commentContent[0].oriContent = commentContent[0].innerHTML;
      commentContent.html(temp);
      ele.text(
        ele.text().includes("查看原文")
          ? ele.text().replace("查看原文", "恢复打码")
          : ele.text().replace("恢复打码", "查看原文")
      ); // 切换按钮文本
      return;
    }

    // 未屏蔽状态, 执行用户id屏蔽操作
    let ckeckEle = isNotiPage
      ? ele.parents("a.notification-item").find("div.notice a")
      : ele.parents("div.content-wrap").find("div.comment-meta a");
    if (ckeckEle.length) {
      blockManager("blockCommentId").add(
        ckeckEle.attr("href").match(regUserId)[1]
      );
      alert(`评论用户: ${ckeckEle.text()} 屏蔽成功`);
      killComment();
    } else alert(domParseFail);
  }

  // 设置页switch开关的单击回调
  function onSetingSwitch(ele) {
    ele = $(ele.target);
    ele.parent().toggleClass("is-checked");
    let input = ele.siblings()[0];
    input.checked = !input.checked;
  }

  // DOM屏蔽实现
  // 屏蔽评论
  function killComment(isNotiPage = false, isHome = false) {
    if (config["blockLatestComment"])
      $("ul.comment.reset-ul-style").css("display", "none"); // 隐藏右侧 "最新评论"
    if (!config["commentBlockSwitch"] && !config["authorCommentOnly"]) return; // 评论屏蔽总开关, 若开启 "帖子内只显示作者评论" 则不跳出
    let targetEle = "div.comment-body li[id], ul.comment li div.body", // 帖子内也有显示 "最新评论", 计入识别范围
      targetId = "div.auther-name, div.comment-meta:first", // 评论列表元素存在嵌套(评论回复)
      targetContent = "div.content a, div.comment-text:first", // 评论内容元素
      tagEle = "span.level, span.author-mark, span.role-mark"; // 评论用户标签元素, 分别为 等级, 作者, 编辑;
    if (isNotiPage) {
      targetEle = "a.notification-item";
      targetId = "div.notice";
      targetContent = "div.comment span";
    } else if (isHome) {
      targetEle = "ul.comment li div.body"; // 右侧 "最新评论"
      targetId = "div.auther-name";
      targetContent = "div.content a";
    }
    $(targetEle).each((index, item) => {
      item = $(item);
      let isblock = false;
      let commentEle = item.find(targetContent);
      let blockKeyword = "";
      let hiddenFlag = false;
      let checkELe = item.find(targetId);
      if (!checkELe.length) return;

      // 已打开 "帖子内只显示作者评论", 屏蔽非 "作者", "编辑" 的评论 (优先执行)
      if (!isNotiPage && !isHome && config["authorCommentOnly"]) {
        let checkEleNum = checkELe.find(tagEle).length;
        if (checkEleNum === 1) {
          // =0为右侧最新评论, =1为普通用户, >1为作者/编辑
          isblock = true;
          hiddenFlag = true;
        }
      }

      // 按用户id屏蔽评论 (若已屏蔽则不执行)
      if (!isblock) {
        let userId = checkELe.find("a");
        if (
          blockManager("blockCommentId").isBlock(
            userId.attr("href").match(regUserId)[1]
          )
        ) {
          isblock = true;
          userId.css("color", "red"); // 将用户昵称标红
        }
      }

      // 按评论关键字屏蔽 (若已屏蔽则不执行)
      if (!isblock) {
        blockKeyword = blockManager("blockCommentKeyword").isBlock(
          commentEle.html()
        );
        isblock = Boolean(blockKeyword);
      }

      // 处理屏蔽
      if (isblock) {
        // 符合屏蔽规则, 按屏蔽模式执行对应修改
        if (config["commentBlockMode"] == "hidden" || hiddenFlag)
          // "只显示作者" 规则默认使用此模式
          item.css("display", "none"); // 隐藏
        else if (config["commentBlockMode"] == "replace") {
          commentEle[0].oriContent = commentEle.html(); // 备份原评论内容
          commentEle.html(
            blockKeyword
              ? commentEle
                  .html()
                  .replaceAll(
                    blockKeyword,
                    `<span style="color: red">${"".padStart(
                      blockKeyword.length,
                      "*"
                    )}</span>`
                  )
              : `<span style="color: red">${"".padStart(
                  commentEle.text().length,
                  "*"
                )}</span>`
          ); // 文字打码, 若为用户id屏蔽则将整条评论替换为等长星号，若为关键词屏蔽则仅替换关键词
          item
            .find(`a#mzf-block-comment${isNotiPage ? "2" : ""}:first`)
            .css("color", "red")
            .text(isNotiPage ? "查看原文" : " 查看原文 "); // 将下方的屏蔽按钮替换为查看原文按钮(用于解除文本打码)
        }
      }
    });
  }

  //屏蔽帖子
  function killArchive() {
    if (!config["archiveBlockSwitch"]) return; // 总开关
    let isCategoryPage = location.href.match(regCategory);
    $("div.post").each((index, item) => {
      let isblock = false;
      item = $(item);
      let checkELe = item.find("a.meta-label:first"); // 查找文章作者标签元素

      // 给广告元素添加block: none以防止屏蔽帖子后元素排序异常(现象为出现空位)
      if (item.find("div.ad-box").length && !checkELe.length) {
        item.css("display", "none");
        return;
      }

      // 未找到识别元素->非正常的投稿列表项(可能是广告元素), 隐藏并跳出
      if (!checkELe.length) return;

      // 按用户id屏蔽文章 (优先执行)
      let userId = checkELe.attr("href").match(regUserId)[1];
      if (blockManager("blockArchiveId").isBlock(userId)) {
        checkELe.css("color", "red"); // 将作者标签标红
        isblock = true;
      }

      // 按标题关键字屏蔽 (若已屏蔽则不执行)
      if (!isblock) {
        checkELe = item.find("div.title, a.title");
        if (!checkELe.length) return;
        let keyword = blockManager("blockArchiveKeyword").isBlock(
          checkELe.text()
        );
        if (keyword) {
          checkELe.html(
            checkELe
              .html()
              .replaceAll(keyword, `<span style="color: red">${keyword}</span>`)
          ); // 将标题内识别到的屏蔽关键词标红
          isblock = true;
        }
      }

      // 按分类屏蔽 (若已屏蔽则不执行, 若在分类页面也不执行)
      if (!isblock && !isCategoryPage) {
        checkELe = item.find("a.category");
        if (checkELe.length)
          // 存在分类标签
          for (let ele of checkELe) {
            let result = ele.href.match(regCategory);
            // 白名单规则, 若规则列表为空则跳过
            if (config["showCategoryId"]) {
              if (blockManager("showCategoryId").isBlock(result[1])) {
                isblock = false;
                break;
              } else isblock = true;
            }
            // 黑名单规则
            else if (
              result &&
              blockManager("blockCategoryId").isBlock(result[1])
            ) {
              isblock = true;
              $(ele).css("color", "red"); // 将屏蔽的分类标签标红
            }
          }
        // 缩略图模式不存在分类标签, 使用元数据进行识别
        // 只有列表接口有分类元数据, 排行接口均没有, 故无法执行此规则
        else {
          checkELe = item.find("section.post-card-wrap a:first");
          let archieveId = checkELe.attr("href").match(regArchive)[1];
          if (checkELe.length && archieveId in categoryData)
            for (let id of categoryData[archieveId]) {
              if (config["showCategoryId"]) {
                if (blockManager("showCategoryId").isBlock(id)) {
                  isblock = false;
                  break;
                } else isblock = true;
              } else if (blockManager("blockCategoryId").isBlock(id)) {
                isblock = true;
                break;
              }
            }
        }
      }

      // 处理屏蔽
      if (isblock) {
        // 符合屏蔽规则, 按屏蔽模式执行对应修改
        if (config["archiveBlockMode"] == "hidden")
          item.css("display", "none"); // 隐藏
        else if (config["archiveBlockMode"] == "blur") {
          item.css("display", "block");
          item.find("#mzf-block-archive").text("恢复模糊").css("color", "red"); // 将屏蔽按钮改为恢复模糊的按钮
          item.find("div.post-card-content").css("filter", "blur(1.2rem)"); // 高斯模糊
          if (!item.find("#disable-blur-btn").length)
            item
              .find("section.post-card-wrap")
              .prepend(disableblurBtn + blurWrapper); //添加解除模糊按钮和遮挡元素防止误触点击
        }
      } else {
        // 不符合屏蔽规则, 恢复元素CSS, 去除按钮
        item
          .css("display", "block")
          .find("div.post-card-content")
          .css("filter", "none")
          .find("span.author")
          .css("color", "");
        item.find("a.category").css("color", "");
        item.find("#disable-click-wrapper, #disable-blur-btn").remove();
        item.find("#mzf-block-archive").text("屏蔽作者").css("color", "");
      }
    });
  }

  function addBtnListen() {
    // 预先绑定好按钮事件
    $(document).on("click", "#mzf-block-archive", onBlockArchive);
    $(document).on("click", "#mzf-block-comment", (btn) => onBlockComment(btn));
    $(document).on("click", "#mzf-block-comment2", (btn) =>
      onBlockComment(btn, true)
    );
    $(document).on("click", "#mzf-block-set", onSetingBtn);
    $(document).on("click", "#mzf-save-id", onSaveSetingBtn);
    $(document).on("click", ".mzf-switch", onSetingSwitch);
    $(document).on("click", "#disable-blur-btn", (btn) => {
      let ele = $(btn.target);
      ele.siblings("div.post-card-content").css("filter", "none"); // 全图界面
      ele.siblings("a").find("div.post-card-content").css("filter", "none"); // 缩略图界面
      ele.siblings("#disable-click-wrapper").remove();
      ele.remove();
    });
    $(document).on("click", "#category-block-btn", (btn) => {
      let ele = $(btn.target);
      let blocked = !blockManager("blockCategoryId").isBlock(
        ele.attr("categoryId")
      );
      blocked
        ? blockManager("blockCategoryId").add(ele.attr("categoryId"))
        : blockManager("blockCategoryId").remove(ele.attr("categoryId"));
      ele.html(
        `${blocked ? "解除屏蔽" : "屏蔽分类"}: ${ele.attr("categoryStr")}`
      );
    });
  }

  // 由于缩略图模式下dom内没有帖子分类数据, 故通过拦截请求获取帖子列表元数据
  function addAjaxHook() {
    ah.proxy(
      {
        onResponse: (response, handler) => {
          if (response.config.url.includes("/api/v1/post/list?page="))
            // 仅对投稿列表的请求做处理
            for (let data of JSON.parse(response.response).data)
              categoryData[String(data.id)] = data.categories.reduce(
                (list, category) => {
                  list.push(String(category.id));
                  return list;
                },
                []
              ); // 提取分类数据
          handler.next(response);
        },
      },
      unsafeWindow
    );
  }

  $(main);
  addAjaxHook();
})();
