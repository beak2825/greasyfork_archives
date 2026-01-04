// ==UserScript==
// @name         up评论优化&文章区屏蔽 —— AcFun
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  仅仅作用于文章区更新动态，up名字悬停5s屏蔽，页面下面的友情链接显示屏蔽列表。使用localStorage存储。
// @author       NineDTNY
// @match        https://*.acfun.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/388385/up%E8%AF%84%E8%AE%BA%E4%BC%98%E5%8C%96%E6%96%87%E7%AB%A0%E5%8C%BA%E5%B1%8F%E8%94%BD%20%E2%80%94%E2%80%94%20AcFun.user.js
// @updateURL https://update.greasyfork.org/scripts/388385/up%E8%AF%84%E8%AE%BA%E4%BC%98%E5%8C%96%E6%96%87%E7%AB%A0%E5%8C%BA%E5%B1%8F%E8%94%BD%20%E2%80%94%E2%80%94%20AcFun.meta.js
// ==/UserScript==

(function () {
  "use strict";
  /////////////////////////////屏蔽文章
  function reID() {
    const SPLITCHAR = "@zxs#";
    const CHAR = "@";
    const KEYNAME = "zxs_@z#";
    let zxsnameList = [];
    const localStr = localStorage.getItem(KEYNAME);
    if (localStr) {
      zxsnameList = localStr.split(SPLITCHAR);
    } else {
      console.log("*********************没有屏蔽列表");
    }
    const zxsnameSet = new Set(zxsnameList);
    const fun = {
      forEachID: (callback) => {
        zxsnameSet.forEach((value) => {
          callback(value);
        });
      },
      addID: (id, name) => {
        if (zxsnameSet.size < zxsnameSet.add(id + CHAR + name).size) {
          localStorage.setItem(KEYNAME, Array.from(zxsnameSet).join(SPLITCHAR));
          console.log("**********存入local Storage: " + id + " " + name);
        }
      },
      deleteID: (id, name) => {
        if (zxsnameSet.delete(id + CHAR + name)) {
          localStorage.setItem(KEYNAME, Array.from(zxsnameSet).join(SPLITCHAR));
          console.log("**********local Storage去除:" + id + " " + name);
        }
      },
      includesID: (id, name) => {
        return zxsnameSet.has(id + CHAR + name);
      },
    };
    return fun;
  }
  //添加id  删除id  查询id
  const { forEachID, addID, deleteID, includesID } = reID();
  //回调函数
  function reListener() {
    let timer;
    const fun = {
      waitCover: (e) => {
        timer = setTimeout(() => {
          let id = e.target.href.slice(
            e.target.href.indexOf("u/") + 2,
            e.target.href.length
          );
          let name = e.target.innerText;
          name = name.slice(4, name.length);
          if (confirm(`屏蔽 ${name}`)) {
            addID(id, name);
          }
        }, 5000);
      },
      stopCover: () => {
        clearInterval(timer);
      },
    };
    return fun;
  }
  const { waitCover, stopCover } = reListener();
  //
  /////////////////////////////////////给你整个新的xhr
  let zxs_namespace = {
    originalXHR: window.XMLHttpRequest,
    myXHR: function () {
      const xhr = new zxs_namespace.originalXHR();
      for (let attr in xhr) {
        if (attr === "onreadystatechange") {
          xhr.onreadystatechange = (...args) => {
            if (this.readyState == 4) {
              // 请求成功
              //拦截评论请求
              if (this.responseURL.includes("comment/list")) {
                window.postMessage("awsl", "/");
              } else if (this.responseURL.includes("comment/sublist")) {
                window.postMessage("awsl", "/");
                //拦截文章请求
              } else if (this.responseURL.includes("article/feed")) {
                let myResponseText = JSON.parse(this.responseText);
                //处理data
                myResponseText.data = myResponseText.data.filter(
                  (article) =>
                    !includesID("" + article.userId, article.userName)
                );
                this.myResponseText = JSON.stringify(myResponseText);
                window.postMessage("getfeed", "/");
              }
            }
            this.onreadystatechange &&
              this.onreadystatechange.apply(this, args);
          };
          continue;
        }
        if (attr === "responseText") {
          Object.defineProperty(this, attr, {
            get: () => this.myResponseText || xhr[attr],
            set: (val) => (xhr[attr] = val),
            enumerable: true,
          });
          continue;
        }
        if (typeof xhr[attr] === "function") {
          this[attr] = xhr[attr].bind(xhr);
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => (xhr[attr] = val),
            enumerable: true,
          });
        }
      }
    },
    ready: function (fn) {
      if (document.addEventListener) {
        document.addEventListener(
          "DOMContentLoaded",
          function () {
            fn();
          },
          false
        );
      } else {
        //兼容？不存在的
      }
    },
  };
  window.XMLHttpRequest = zxs_namespace.myXHR;
  ////////////////////////////up主图标添加
  //闭了UpIcon
  function reUpIcon() {
    let upIcon;
    return () => {
      //创建图标
      if (!upIcon) {
        upIcon = document.createElement("div");
        const attr = {
          textContent: "UP主",
          className: "mp-up-icon",
          style: {
            width: "44px",
            height: "22px",
            "font-size": "12px",
            "line-height": "22px",
            "background-color": "#4a8eff",
            "text-align": "center",
            "border-radius": "4px",
            color: "#fff",
            display: "inline-block",
            "line-height": "22px",
            margin: "0 2px",
          },
        };
        let style = "";
        const styleObj = attr.style;
        for (const key in styleObj) {
          style += `${key}:${styleObj[key]};`;
        }
        attr.style = style;
        Object.assign(upIcon, attr);
      }
      return upIcon;
    };
  }
  const getUpIcon = reUpIcon();
  //刷新up图标
  function setUpIcon(upName) {
    const mui = document.querySelectorAll(".mp-up-icon");
    if (mui) {
      mui.forEach((element) => {
        element.parentNode.removeChild(element);
      });
    }
    //创建图标
    const upIcon = getUpIcon();
    //插进去
    const allName = document.querySelectorAll("a.name");
    if (allName) {
      allName.forEach((element) => {
        if (element.innerText === upName) {
          element.parentNode.insertBefore(upIcon.cloneNode(true), element);
        }
      });
    }
  }
  //进行一个upName的闭
  function reUpName() {
    let upName;
    return () => {
      if (!upName) {
        const upEle =
          document.querySelector("a.upname") ||
          document.querySelector("a.up-name");
        if (!upEle) {
          return;
        }
        upName = upEle.innerText;
        if (!upName) {
          return;
        }
      }
      return upName;
    };
  }
  const getUpName = reUpName();
  //创建屏蔽相关元素
  function reCover() {
    const mask = document.createElement("div");
    mask.onclick = (e) => {
      if (e.target === mask) mask.style.display = "none";
    };
    mask.style =
      "background-color: rgba(51, 51, 51,0.6);z-index: 9998;position: fixed;top: 0;left: 0;right: 0;bottom: 0;display: none; flex-direction: column;flex-wrap: wrap;align-content: center;justify-content: center;";
    const list = document.createElement("div");
    list.style =
      "width: 300px;font-size: 16px;padding: 5px;background-color: rgb(255,255,255);display: flex;justify-content: space-between;";
    const al = document.createElement("a");
    al.style = "cursor: pointer;";
    al.target = "_blank";
    const ar = document.createElement("a");
    ar.style = "cursor: pointer;";
    ar.innerText = "移除";
    list.appendChild(al);
    list.appendChild(ar);
    const fun = {
      //添加mask
      appendMask: () => {
        document.body.appendChild(mask);
      },
      //遍历set 创建列表
      setCoverList: () => {
        mask.style.display = "flex";
        while (mask.hasChildNodes()) {
          mask.removeChild(mask.firstChild);
        }
        forEachID((value) => {
          let id = value.slice(0, value.indexOf("@"));
          let name = value.slice(value.indexOf("@") + 1, value.length);
          let newList = list.cloneNode(true);
          let al = newList.childNodes[0];
          let ar = newList.childNodes[1];
          al.innerText = name;
          al.href = "/u/" + id;
          ar.onclick = () => {
            deleteID(id, name);
            mask.removeChild(newList);
          };
          mask.appendChild(newList);
        });
      },
    };
    return fun;
  }
  const { appendMask, setCoverList } = reCover();
  zxs_namespace.ready(function () {
    //屏蔽列表入口
    const cover = document.createElement("a");
    cover.innerText = "屏蔽列表";
    cover.href = "javascript:;";
    cover.onclick = setCoverList;

    const ttt = setInterval(() => {
      let coverEntry = document.querySelector(".footer-nav .item-function");
      if (coverEntry) {
        clearInterval(ttt);
        setTimeout(() => {
          coverEntry.appendChild(cover);
        }, 2000);
        appendMask();
      } else {
        console.log("找不到.footer-nav .item-function");
      }
    }, 3000);

    //添加监听事件
    window.addEventListener(
      "message",
      function (event) {
        if (event.data == "awsl") {
          //获得up名字
          let upName = getUpName();
          if (upName) {
            setUpIcon(upName);
          }
        }
        if (event.data == "getfeed") {
          document.querySelectorAll(".info .up a").forEach((element) => {
            element.removeEventListener("mouseenter", waitCover);
            element.addEventListener("mouseenter", waitCover);
            element.removeEventListener("mouseleave", stopCover);
            element.addEventListener("mouseleave", stopCover);
          });
        }
      },
      false
    );
  });
})();
