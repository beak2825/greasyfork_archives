// ==UserScript==
// @name         抒发森林增强
// @namespace    https://github.com/rktccn/treehollowEnhance
// @supportURL   https://github.com/rktccn/treehollowEnhance
// @homepageURL  https://github.com/rktccn/treehollowEnhance
// @version      0.3.1
// @description  抒发森林增强,只看洞主，下载图片
// @author       RoIce
// @match        *://web.treehollow.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasespot.net
// @grant        GM_addStyle
// @grant        GM_notification
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444013/%E6%8A%92%E5%8F%91%E6%A3%AE%E6%9E%97%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/444013/%E6%8A%92%E5%8F%91%E6%A3%AE%E6%9E%97%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// 2022-4-28 更新屏蔽功能和菜单开关功能
// 修复回到顶部的问题，应该修复了

(function () {
  "use strict";
  // Your code here...

  let css = `.active{
    background-color: rgb(243, 142, 4) !important;
  }`;
  GM_addStyle(css);

  // 原始数据
  let originalreplyList = [];

  // 通知信息
  let noticeLength = 0; // 总通知数
  let newNoticeList = []; // 新通知
  let noticeList = []; // 临时储存通知

  // 回复内容节点
  let replyNodes = [];

  // 检测屏幕大小，是否为移动端
  const isMobile = () => {
    return window.screen.width < 768;
  };

  // 拦截获取请求
  function addXMLRequestCallback(callback) {
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
      // we've already overridden send() so just add the callback
      XMLHttpRequest.callbacks.push(callback);
    } else {
      // create a callback queue
      XMLHttpRequest.callbacks = [callback];
      // store the native send()
      oldSend = XMLHttpRequest.prototype.send;
      // override the native send()
      XMLHttpRequest.prototype.send = function () {
        // process the callback queue
        // the xhr instance is passed into each callback but seems pretty useless
        // you can't tell what its destination is or call abort() without an error
        // so only really good for logging that a request has happened
        // I could be wrong, I hope so...
        // EDIT: I suppose you could override the onreadystatechange handler though
        for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
          XMLHttpRequest.callbacks[i](this);
        }
        // call the native send()
        oldSend.apply(this, arguments);
      };
    }
  }

  // 监听通知请求
  const listenNotification = () => {
    addXMLRequestCallback(function (xhr) {
      xhr.addEventListener("load", function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          if (xhr.responseURL.includes("user/notifications")) {
            //do something!

            // 去重，将新通知添加到通知列表
            let $notice = JSON.parse(xhr.response);
            newNoticeList = $notice.slice(0, $notice.length - noticeLength);
            noticeLength = $notice.length;
            if (newNoticeList.length !== 0) {
              newNoticeList.forEach((item) => {
                if (item.type === "replyPost") {
                  noticeList.push({
                    pid: item.pid,
                    userName: item.name,
                    content: item.content,
                  });
                }
              });
            }
          }
        }
      });
    });
  };

  // 获取回复原数据
  function getOriginalData() {
    addXMLRequestCallback(function (xhr) {
      xhr.addEventListener("load", function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          if (xhr.responseURL.includes("holes/detail")) {
            //do something!

            originalreplyList = JSON.parse(xhr.response).replies;
            if (!originalreplyList?.length) {
              originalreplyList = [];
              throw new Error("获取源数据失败或没有回复");
            }
          }
        }
      });
    });
  }

  // 获取一段文字中所有大写字母
  function getUpperCase(str) {
    let arr = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === str[i].toUpperCase() && str[i] !== " ") {
        arr.push(str[i]);
      }
    }
    return arr.join("");
  }

  // 检测是否加载完成,异步调用
  const checkLoad = () =>
    new Promise((resolve, reject) => {
      let check = setInterval(() => {
        let targetNode = document.querySelector(
          "#root > div > div > div > div > div > div > div > div > div.css-1dbjc4n.r-13awgt0 > div > div.css-1dbjc4n.r-1p0dtai.r-1d2f490.r-12vffkv.r-u8s1d.r-zchlnj.r-ipm5af > div.css-1dbjc4n.r-13awgt0.r-12vffkv > div > div > div > div > div > div.css-1dbjc4n.r-1kihuf0.r-e7q0ms"
        );

        if (targetNode !== null) {
          clearInterval(check);
          resolve(true);
        }
      }, 200);
    });

  // 获取回复
  const getReply = () => {
    const targetNode = document.getElementsByClassName(
      "css-1dbjc4n r-1kihuf0 r-knv0ih r-e7q0ms"
    );

    if (!targetNode) {
      throw new Error("获取回复失败");
    }

    hideUser.hideReplay();

    return targetNode;
  };

  // 监听楼层数量的变化
  const listenReplayCount = () => {
    let targetNode = document.querySelector(
      "#root > div > div > div > div > div > div > div > div > div.css-1dbjc4n.r-13awgt0 > div > div.css-1dbjc4n.r-1p0dtai.r-1d2f490.r-12vffkv.r-u8s1d.r-zchlnj.r-ipm5af > div.css-1dbjc4n.r-13awgt0.r-12vffkv > div > div > div > div > div > div.css-1dbjc4n.r-1kihuf0.r-13awgt0.r-knv0ih.r-13qz1uu > div > div > div:nth-child(2)"
    );

    const config = { childList: true };

    const callBack = (mutationsList, observer) => {
      replyNodes = getReply();
    };

    const observer = new MutationObserver(callBack);

    observer.observe(targetNode, config);
  };

  // 点击只看洞主
  const clickDZ = (e) => {
    if (originalreplyList?.length === 0) return;

    if (hideUser.onlySeeUserName === "") {
      e.target.classList.add("active");
      e.target.innerHTML = `只看洞主`;
      hideUser.onlySee("洞主");
    } else {
      e.target.classList.remove("active");
      e.target.innerHTML = `只看${hideUser.onlySeeUserName}`;
      hideUser.onlySee("");
    }

    hideUser.hideReplay();
  };

  // 查看所有图片
  const getImg = () => {
    let imgList = [];
    // 提取图片
    originalreplyList.forEach((item) => {
      if (item?.image) {
        imgList.push(`https://img.treehollow.net/${item.image.src}`);
      }
    });

    return imgList;
  };

  // 新增图片显示窗口
  const addImgWindow = () => {
    let container = document.createElement("div");
    container.classList = "img-container";
    container.style.cssText =
      "position: fixed; inset: 0px; z-index: 9999; background-color: rgba(0, 0, 0, 0.6); overflow-y: scroll; display: grid; grid-template-columns: 1fr 1fr 1fr; width: 100vw; height: 100vh;gap: 16px;";

    document.body.appendChild(container);
    let imgList = getImg();
    for (let i = 0; i < imgList.length; i++) {
      const imgUrl = imgList[i];
      let img = document.createElement("img");
      img.src = imgUrl;
      img.style.cssText = "width: 100%;";
      container.appendChild(img);
    }

    let close = document.createElement("div");
    close.innerText = "关闭";
    close.style.cssText =
      " position: fixed; right: 20px; bottom: 50%; margin-bottom: 16px; background-color: #53A13C; border-radius: 5px;  cursor: pointer; display: inline-block; font-size: 17px; font-weight: 400;;;; width: 50px;line-height: 1.2; padding: 17px 14px; text-align: center; text-decoration: none; color: #fff;";
    close.addEventListener("click", () => {
      container.remove();
    });
    container.appendChild(close);
  };

  // 回到顶部
  const goTop = () => {
    let targetNode = document.getElementsByClassName(
      "css-1dbjc4n r-1kihuf0 r-1x0uki6 r-e7q0ms"
    );
    targetNode[0].scrollIntoView({ behavior: "smooth" });
  };

  // 格式化回复
  const formatReply = (replyNode) => {
    let content =
      replyNode
        .getElementsByClassName(
          "css-901oao r-jwli3a r-ubezar r-13uqrnb r-16dba41 r-oxtfae r-dhbnww r-1xnzce8"
        )[0]
        ?.innerText.trim() || "";
    let userName = replyNode
      .getElementsByClassName(
        "css-901oao r-5rif8m r-ubezar r-13uqrnb r-majxgm r-oxtfae r-dhbnww r-13hce6t r-14gqq1x"
      )[0]
      ?.innerText.trim();
    let reply =
      replyNode
        .getElementsByClassName(
          "css-901oao css-vcwn7f r-5rif8m r-1b43r93 r-13uqrnb r-16dba41 r-oxtfae r-dhbnww r-1jkjb r-icoktb"
        )[0]
        ?.innerText.trim() || "";

    if (!userName) {
      throw new Error("格式化回复信息失败");
    }

    return {
      content,
      userName,
      reply,
    };
  };

  // 隐藏指定用户按钮
  const hideUser = {
    className: "hide-user",
    userList: [], // 隐藏用户名列表
    contentList: [], // 隐藏文本列表
    onlySeeUserName: "", // 只看指定用户
    isShow: false, // 是否显示列表界面

    // param {string} val 文本内容
    // param {string} type 类型 content/user
    addToHideList: (val, type) => {
      type === "content"
        ? hideUser.contentList.push(val.trim())
        : hideUser.userList.push(val.trim());
    },
    removeFromHideList: (val, type) => {
      type === "content"
        ? hideUser.contentList.splice(
            hideUser.contentList.indexOf(val.trim()),
            1
          )
        : hideUser.userList.splice(hideUser.userList.indexOf(val.trim()), 1);
    },
    // 新建隐藏列表窗口
    addWindow: () => {
      let container = document.createElement("div");
      container.className = "hide-container";
      container.style.cssText =
        "position: absolute;  z-index: 9999; background-color: rgba(0, 0, 0, 0.6); overflow-y: scroll; width: 260px; max-height: 230px; gap: 16px; padding: 16px;right: 120px;top: 30%; color: #fff;";

      document.body.appendChild(container);

      hideUser.addUserListDOM();
      hideUser.addContentListDOM();
    },
    // 移除隐藏列表窗口
    removeWindow: () => {
      let container = document.getElementsByClassName("hide-container")[0];
      if (container !== undefined) {
        container.remove();
      }
    },
    // 新增隐藏用户列表
    addUserListDOM: () => {
      let container = document.getElementsByClassName("hide-container")[0];
      if (container === undefined) {
        hideUser.addWindow();
        container = document.getElementsByClassName("hide-container")[0];
      }

      let userList = document.createElement("div");
      userList.style.cssText =
        "display: flex; flex-direction: column;align-items: flex-start; color: #fff; fontsize: 24px; font-weight: 600; margin-bottom: 16px;";
      userList.innerHTML = "被隐藏的用户(当前贴有效)";
      for (let i = 0; i < hideUser.userList.length; i++) {
        const userName = hideUser.userList[i];
        let element = document.createElement("div");
        element.innerText = `${userName} --- 点击移除`;
        element.style.cssText =
          "display: inline-block; font-size: 16px; font-weight: 400; margin-top: 8px; cursor: pointer;";
        element.addEventListener("click", () => {
          hideUser.removeFromHideList(userName, "user");
          element.remove();
          hideUser.hideReplay();
        });
        userList.appendChild(element);
      }

      // 输入框
      let input = document.createElement("input");
      input.style.cssText =
        "width: 100%; height: 40px; border-radius: 4px; border: 1px solid #fff; margin-bottom: 16px;";
      input.placeholder = "输入用户名首字母 如:AD";
      input.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
          let name = input.value.trim();
          hideUser.addToHideList(name, "user");

          // 添加用户名到列表
          let element = document.createElement("div");
          element.innerText = `${name} --- 点击移除`;
          element.style.cssText =
            "display: inline-block; font-size: 16px; font-weight: 400; margin-top: 8px; cursor: pointer;";
          element.addEventListener("click", () => {
            hideUser.removeFromHideList(name, "user");
            element.remove();
            hideUser.hideReplay();
          });
          userList.insertBefore(element, input);

          hideUser.hideReplay();
          input.value = "";
        }
      });
      userList.appendChild(input);

      container.appendChild(userList);
    },
    // 新增隐藏文本列表
    addContentListDOM: () => {
      let container = document.getElementsByClassName("hide-container")[0];
      if (container === undefined) {
        hideUser.addWindow();
        container = document.getElementsByClassName("hide-container")[0];
      }

      let contentList = document.createElement("div");
      contentList.style.cssText =
        "display: flex; flex-direction: column;align-items: flex-start; color: #fff; fontsize: 24px; font-weight: 600; margin-bottom: 16px;";
      contentList.innerHTML = "被隐藏的文本";
      for (let i = 0; i < hideUser.contentList.length; i++) {
        const content = hideUser.contentList[i];
        let element = document.createElement("div");
        element.innerText = `${content} --- 点击移除`;
        element.style.cssText =
          "display: inline-block; font-size: 16px; font-weight: 400; margin-top: 8px; cursor: pointer;";
        element.addEventListener("click", () => {
          hideUser.removeFromHideList(content, "content");
          element.remove();
          hideUser.hideReplay();
        });
        contentList.appendChild(element);
      }

      // 输入框
      let input = document.createElement("input");
      input.style.cssText =
        "width: 100%; height: 40px; border-radius: 4px; border: 1px solid #fff; margin-bottom: 16px;";
      input.placeholder = "输入文本 如:cy";
      input.addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
          let content = input.value.trim();
          hideUser.addToHideList(content, "content");

          // 添加文本到列表
          let element = document.createElement("div");
          element.innerText = `${content} --- 点击移除`;
          element.style.cssText =
            "display: inline-block; font-size: 16px; font-weight: 400; margin-top: 8px; cursor: pointer;";
          element.addEventListener("click", () => {
            hideUser.removeFromHideList(content, "content");
            element.remove();
            hideUser.hideReplay();
          });
          contentList.insertBefore(element, input);
          hideUser.hideReplay();
          input.value = "";
        }
      });
      contentList.appendChild(input);

      container.appendChild(contentList);
    },

    // 执行只看某人
    onlySee: (val = "洞主") => {
      if (hideUser.onlySeeUserName === "") {
        hideUser.onlySeeUserName = val.trim();
      } else {
        hideUser.onlySeeUserName = "";
      }
    },
    // 检查是否需要隐藏
    checkHide: (replyNode) => {
      if (originalreplyList?.length === 0) return false;

      let { content, userName } = formatReply(replyNode);

      if (hideUser.onlySeeUserName !== "") {
        // 只看指定用户
        if (userName !== hideUser.onlySeeUserName) {
          return true;
        }
      } else {
        if (
          hideUser.userList.includes(getUpperCase(userName)) ||
          hideUser.contentList.includes(content)
        ) {
          return true;
        }
      }

      return false;
    },
    // 隐藏内容
    hideReplay: () => {
      for (let i = 0; i < replyNodes.length; i++) {
        if (hideUser.checkHide(replyNodes[i])) {
          replyNodes[i].style.display = "none";
        } else {
          replyNodes[i].style.display = "block";
        }
      }
    },

    clickHandler: (e) => {
      hideUser.isShow = !hideUser.isShow;
      hideUser.isShow ? hideUser.addWindow() : hideUser.removeWindow();
      hideUser.isShow
        ? e.target.classList.add("active")
        : e.target.classList.remove("active");
    },
  };

  // 显示/隐藏button-container
  const showMenu = {
    isShow: false,
    show: (e) => {
      showMenu.isShow = true;
      let container = document.getElementsByClassName("button-container")[0];
      for (let i = 0; i < container.childNodes.length - 1; i++) {
        const element = container.childNodes[i];
        element.style.transform = "translateX(0)";
      }
      if (e) {
        e.target.innerText = "关闭菜单";
      }
    },
    hide: (e) => {
      showMenu.isShow = false;
      let container = document.getElementsByClassName("button-container")[0];
      for (let i = 0; i < container.childNodes.length - 1; i++) {
        const element = container.childNodes[i];
        element.style.transform = "translateX(100%)";
        element.style.transition = "all 0.3s ease-in-out";
      }
      if (e) {
        e.target.innerText = "显示菜单";
      }
    },
    clickHandler: (e) => {
      if (showMenu.isShow) {
        showMenu.hide(e);
        showMenu.isShow = false;
      } else {
        showMenu.show(e);
        showMenu.isShow = true;
      }
    },
  };

  // button 相关
  const button = {
    // 添加按钮
    addButton: (text, callback = () => {}, className = "") => {
      let pcCss = {
        container:
          "display: flex; justify-content: center; align-items: center; position: fixed; right: 20px; bottom: 50%;flex-direction: column;transform: translateY(55%);",
        button:
          "z-index: 9999; margin-bottom: 16px; background-color: #53A13C; border-radius: 5px;  cursor: pointer; display: inline-block; font-size: 17px; font-weight: 400;;;; width: 50px;line-height: 1.2; padding: 17px 14px; text-align: center; text-decoration: none; color: #fff;",
      };

      let mobileCss = {
        container:
          "display: flex; justify-content: center; align-items: center; position: fixed; right: 10px; bottom: 30%; flex-direction: column; transform: translateY(30%);",
        button:
          "z-index: 9999; margin-bottom: 16px; background-color: rgb(83, 161, 60); border-radius: 5px; cursor: pointer; display: inline-block;  font-weight: 400; width: 35px; line-height: 1.2; padding: 10px 9px; text-align: center; text-decoration: none; color: rgb(255, 255, 255);font-size: 12px;",
      };

      let container = document.getElementsByClassName("button-container")[0];
      if (container === undefined) {
        // 添加container
        container = document.createElement("div");
        container.className = `button-container ${className}`;
        container.style.cssText = isMobile()
          ? mobileCss.container
          : pcCss.container;
        document.body.appendChild(container);
      }

      const element = document.createElement("div");
      element.innerText = text;
      element.className = "dz-button";
      element.style.cssText = isMobile() ? mobileCss.button : pcCss.button;

      element.addEventListener("click", callback);
      container.appendChild(element);
    },

    // 移除按钮
    removeButton: () => {
      let container = document.getElementsByClassName("button-container")[0];
      if (container !== undefined) {
        container.remove();
      }
    },
  };

  // 新建button
  const addButton = (name, clickCallBack, className = "") => {
    button.addButton(name, clickCallBack, className);
  };

  /**
   * 重写history的pushState和replaceState
   * @param action pushState|replaceState
   * @return {function(): *}
   */
  function wrapState(action) {
    // 获取原始定义
    let raw = history[action];
    return function () {
      // 经过包装的pushState或replaceState
      let wrapper = raw.apply(this, arguments);

      // 定义名为action的事件
      let e = new Event(action);

      // 将调用pushState或replaceState时的参数作为stateInfo属性放到事件参数event上
      e.stateInfo = { ...arguments };
      // 调用pushState或replaceState时触发该事件
      window.dispatchEvent(e);
      return wrapper;
    };
  }
  //修改原始定义
  history.pushState = wrapState("pushState");
  history.replaceState = wrapState("replaceState");

  // 初始化数据
  const initData = () => {
    button.removeButton();
    hideUser.removeWindow();
    hideUser.onlySeeUserName = "";
    if (window.location.pathname == "/HoleDetail") {
      getOriginalData();
      checkLoad().then((res) => {
        replyNodes = getReply();
        listenReplayCount();
        button.removeButton();

        addButton("只看洞主", clickDZ);
        addButton("下载图片", addImgWindow);
        addButton("回到顶部", goTop);
        addButton("隐藏用户", hideUser.clickHandler);
        addButton("显示菜单", showMenu.clickHandler);
        showMenu.hide();
      });
    }
    if (
      window.location.pathname !== "/HoleDetail" &&
      window.location.pathname !== "/ReplyModal"
    ) {
      hideUser.userList = [];
    }
  };

  // 监听自定义的事件
  window.addEventListener("pushState", function (e) {
    initData();
  });

  window.addEventListener("replaceState", function (e) {
    initData();
  });
})();
