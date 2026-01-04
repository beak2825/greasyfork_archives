// ==UserScript==
// @name        bili自定义播放速率
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/*
// @exclude     https://www.bilibili.com/correspond/*
// @grant       GM_addStyle
// @version     1.3.1
// @author      vurses
// @license    GPL
// @description 哔哩哔哩自定义视频播放速度，shift1~9快捷键更改速度。插入样式比较违和，只在普通视频下才有自定义按钮，番剧等页面只能通过快捷键更改速度。
// @downloadURL https://update.greasyfork.org/scripts/501330/bili%E8%87%AA%E5%AE%9A%E4%B9%89%E6%92%AD%E6%94%BE%E9%80%9F%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/501330/bili%E8%87%AA%E5%AE%9A%E4%B9%89%E6%92%AD%E6%94%BE%E9%80%9F%E7%8E%87.meta.js
// ==/UserScript==
(async () => {
  // 在video页面下能使用额外的一些按钮，在其它页面只能使用shift1~9快捷键
  // 每次currentEle必须由筛选的下标获取到dom元素，无需本地存储，知道了默认播放速度就知道了数据列表下标，就知道了选中的元素（但此dom元素也不一定存在），不必要存储
  // 速度列表listproxy，当前速度信息对象objproxy,视频video当前速度pbRList
  // 切换自定义的倍速按钮触发objproxy代理=>更改样式同时触发video的ratechange事件=>
  // 用户切换速度的方式有多种，所以ratechange改变时也需要更改一次样式，该元素通过listproxy过滤出第一个对应速度index可知
  // 点击新增按钮=>更改listproxy触发代理=>重新渲染自定义的所有倍速按钮

  // 只有/video下的视频dom结构会优先加载
  let video = document.querySelector("video");
  const waitForVideo = new Promise((resolve, reject) => {
    let checkInterval;
    let timeout;
    function checkVideoExists() {
      video = document.querySelector("video");
      if (video) {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        resolve("video加载成功");
      }
    }
    function stopChecking() {
      clearInterval(checkInterval);
      reject("video获取超时..."); // 8秒内不存在，reject Promise
    }
    // 每100ms检查一次a是否存在
    checkInterval = setInterval(checkVideoExists, 100);

    // 8秒后停止检查
    timeout = setTimeout(stopChecking, 8000);
  });
  // 8秒内未加载出video抛出异常中断代码执行
  await waitForVideo;

  // 保证有video元素的情况下快捷键能使用
  // shift+1~9快捷键修改速度
  document.addEventListener("keydown", function (event) {
    // 检查是否按下了Shift键
    if (event.shiftKey && event.keyCode >= 51 && event.keyCode <= 57) {
      video.playbackRate = event.which - 48;
    }
  });
  // 以评论区dom的加载为标志
  const commentContainer = document.querySelector("#commentapp");

  // 用定时器也行
  // 创建观察者实例,bili的dom结构有部分异步加载，避免页面出现问题脚本的所有操作得在dom完全加载之后才执行
  // 只要能标志dom结构完全加载，选择观察哪个dom元素的容器都无所谓
  const domLoadedSignalObserver = new MutationObserver(
    (mutationsList, observer) => {
      // 监听回调
      scriptCallback();
      // 移除监听
      domLoadedSignalObserver.disconnect();
    }
  );
  // 在/video下才加载样式和脚本，避免出错。其它页面与/video不同，插入一些样式比较违和
  if (window.location.href.includes("video")) {
    domLoadedSignalObserver.observe(commentContainer, {
      //监听异步加载dom时，childList变更以触发observe
      childList: true,
    });
  } else {
    return;
  }
  // 样式
  const link = document.createElement("link");
  link.rel = "stylesheet";
  // bulma.css用require引入会报错
  // link.href =
  //     "https://cdn.bootcdn.net/ajax/libs/bulma/1.0.1/css/bulma.min.css";
  // 无语，bulma默认暗黑就算了，还有样式污染，还得一个个改类名前缀
  // link.href =
  //     "https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/versions/bulma-prefixed.min.css";
  // jsdelivr太慢了
  link.href =
    "https://unpkg.com/bulma@1.0.0/css/versions/bulma-prefixed.min.css";
  document.head.appendChild(link);
  // bulma带来的样式污染(ˉ▽ˉ；)...如果样式污染问题太严重得重构
  const styleConflictPatch = document.createElement("style");
  styleConflictPatch.rel = "text/css";
  // 高能进度条svg，一键三连弹出框，视频底部控件样式
  styleConflictPatch.innerHTML = `div.bpx-player-pbp svg{
                  width:100% !important;
                  height:100% !important;
                  }
              .bili-danmaku-x-guide-three *{
                box-sizing:content-box !important;
              }
              .bpx-player-control-bottom > div {
                  box-sizing:content-box !important;
              }
              `;
  document.head.appendChild(styleConflictPatch);
  // bulma样式默认黑暗模式很蛋疼
  const script = document.createElement("script");
  script.innerHTML = `document.documentElement.setAttribute("data-bulma-theme", "light")`;
  document.head.appendChild(script);
  // 一些额外的样式
  (() => {
    const css = `.script-box {
      width: 100%;
      display: flex;
      }
      .tag-box a:nth-of-type(1):hover {
          background-color: skyblue;
      }
      .tag-box a:nth-of-type(2):hover {
          background-color: rgb(243, 142, 140);
      }
      .new-tag-box {
          width: 70px;
      }
      .bulma-is-blue{
          color: white;
          background-color: lightskyblue;
      }
      `;
    GM_addStyle(css);
  })();

  // 将脚本所有操作放一个函数里供observer回调
  const scriptCallback = () => {
    /*********** 函数定义 ***************/
    // 给每一个倍速按钮设置的监听器,用css也能实现，但有一些样式问题还是选择用js
    const setListeners = () => {
      const mouseenterListeners = new WeakMap();
      const mouseleaveListeners = new WeakMap();
      const mouseenterCallback = function (e) {
        const deleteTag = document.createElement("a");
        deleteTag.className = "bulma-tag bulma-is-delete";
        // <div class="tags has-addons">
        this.children[0].append(deleteTag);
      };
      const mouseleaveCallback = function (e) {
        // <div class="tags has-addons">
        this.children[0].lastElementChild.remove();
      };
      Array.from(document.querySelectorAll(".bulma-control")).forEach(
        (element) => {
          // weakmap保存监听函数防止内存泄漏
          mouseenterListeners.set(element, mouseenterCallback);
          mouseleaveListeners.set(element, mouseleaveCallback);
          element.addEventListener(
            "mouseenter",
            mouseenterListeners.get(element)
          );
          element.addEventListener(
            "mouseleave",
            mouseleaveListeners.get(element)
          );
        }
      );
    };
    // 播放速度数组的渲染
    const tagRender = (list) => {
      return list
        .map((value, index) => {
          return `<div class="bulma-control" data-index=${index} style="width:70px">
                <div class="bulma-tags bulma-has-addons">
                    <a class="bulma-tag" style="width:40px">${value.toFixed(
                      2
                    )}x</a>
                </div>
            </div>`;
        })
        .join("");
    };
    // 计算当前速度对应下标和元素对象
    const computeRateObj = (pbRList, curpbRate) => {
      const index = pbRList.findIndex((value, index) => {
        return value === curpbRate;
      });
      const element =
        index === -1
          ? null
          : document.querySelector(`.bulma-field div:nth-child(${index + 1})`)
              .children[0].children[0];
      return { index, element };
    };
    /*********** 用户界面构建 ***************/
    // 用户操作的容器
    const scriptBox = document.createElement("div");
    scriptBox.className = "script-box pb-1";
    document.querySelector("#viewbox_report").style.height = "auto";
    document.querySelector("#viewbox_report").append(scriptBox);
    document.querySelector(".script-box").innerHTML = `
    <div class="tag-box">
              <div class="bulma-field bulma-is-grouped bulma-is-grouped-multiline">
              </div>
          </div>
          <div class="new-tag-box">
              <button class="bulma-button bulma-is-small" style="height: 21px">+ Rate</button>
              <input class="bulma-input bulma-is-small bulma-is-info" type="number" style="width: 60px;height: 21px; display: none;" />
    </div>`;

    // 播放速度列表数组
    const playbackRateList = JSON.parse(
      localStorage.getItem("PLAYBACK_RATE_LIST_GREASYFORK") ||
        "[0.5, 0.75, 1, 1.25, 1.5, 2, 3]"
    );

    // 首次渲染
    document.querySelector(".tag-box .bulma-field").innerHTML =
      tagRender(playbackRateList);

    // 为每个按钮添加监听器控制样式
    setListeners();

    /*********** 响应式，劫持数据操作驱动页面变化 ***************/
    // 默认播放速度
    const currentPlaybackRate = JSON.parse(
      localStorage.getItem("CURRENT_PLAYBACK_RATE_GREASYFORK") || "1"
    );
    // 将视频速度修改为默认速度
    video.playbackRate = currentPlaybackRate;

    // 记录默认播放速度(当前播放速度)和当前被选tag的对象
    const { index: currentRateIndex, element: currentRateEle } = computeRateObj(
      playbackRateList,
      currentPlaybackRate
    );
    // 高亮倍速按钮
    if (currentRateEle) currentRateEle.classList.add("bulma-is-blue");

    const playbackRateObj = {
      currentRate: currentPlaybackRate,
      currentRateElement: currentRateEle,
    };

    // 代理播放速度数组的set操作
    const playbackRateListProxy = new Proxy(playbackRateList, {
      set: (target, key, value) => {
        target[key] = value;
        localStorage.setItem(
          "PLAYBACK_RATE_LIST_GREASYFORK",
          JSON.stringify(target)
        );
        tagRender(target);
        /* 性能可优化 */
        // 重复渲染
        document.querySelector(".bulma-field").innerHTML =
          tagRender(playbackRateList);
        const { element } = computeRateObj(
          playbackRateList,
          playbackRateObjProxy.currentRate
        );
        // 移除元素高亮
        playbackRateObjProxy.currentRateElement = element;
        // 添加元素高亮
        if (element) element.classList.add("bulma-is-blue");
        // 重复添加监听器
        setListeners();
        return Reflect.set(target, key, value);
      },
    });
    // 代理持久化播放速度对象属性的set操作
    const playbackRateObjProxy = new Proxy(playbackRateObj, {
      set: (target, key, value) => {
        // 需要存在符合条件的tag再移除样式
        key === "currentRateElement" &&
          target[key] &&
          target[key] !== value &&
          target[key].classList.remove("bulma-is-blue");
        key === "currentRate" &&
          (video.playbackRate = value) &&
          localStorage.setItem("CURRENT_PLAYBACK_RATE_GREASYFORK", value);
        target[key] = value;
        return Reflect.set(target, key, value);
      },
    });

    // 速度变化监听
    video.addEventListener("ratechange", function () {
      // 默认速度持久化
      playbackRateObjProxy.currentRate = video.playbackRate;
      const { element } = computeRateObj(
        playbackRateList,
        playbackRateObjProxy.currentRate
      );
      // 移除元素高亮
      playbackRateObjProxy.currentRateElement = element;
      // 添加元素高亮
      if (element) element.classList.add("bulma-is-blue");
    });

    // 根元素事件委托，处理各种事件
    document
      .querySelector(".script-box")
      .addEventListener("click", function (e) {
        switch (e.target.tagName) {
          case "BUTTON":
            const _this = this;
            const newTagBox = _this.children[1];
            const button = newTagBox.children[0];
            const input = newTagBox.children[1];
            button.style.display = "none";
            // 只创建一次回调函数, [0]button || [1]input
            if (!input.onblur) {
              input.onblur = function () {
                button.style.display = "";
                input.style.display = "none";
                // 数字过滤
                this.value &&
                  this.value >= 0 &&
                  (this.value >= 16
                    ? playbackRateListProxy.push(16)
                    : playbackRateListProxy.push(Number(this.value)));
                this.value = "";
                button.focus();
              };
              input.onkeydown = function (e) {
                // 两个Enter键
                if (e.keyCode === 108 || e.keyCode === 13) {
                  this.onblur();
                }
                // Esc键
                if (e.keyCode === 27) {
                  this.value = "";
                  this.blur();
                  button.blur();
                }
              };
            }
            // 显示并聚焦input
            input.style.display = "";
            input.focus();
            break;
          case "A":
            // type:string
            const index =
              e.target.parentElement.parentElement.getAttribute("data-index");
            // 数据变更驱动dom更新
            if (Array.from(e.target.classList).includes("bulma-is-delete")) {
              // index of tags
              playbackRateListProxy.splice(index, 1);
            } else {
              playbackRateObjProxy.currentRate = playbackRateListProxy[index];
              e.target.classList.add("bulma-is-blue");
              // tags样式互斥,每次存入当前选中的tag方便下次移除样式
              playbackRateObjProxy.currentRateElement = e.target;
            }
            break;
        }
      });
    // 当前页面切换视频引起video属性变换
    const videoChangeObserver = new MutationObserver(
      (mutationsList, observer) => {
        // 避免视频速度被初始化
        video.playbackRate = playbackRateObjProxy.currentRate;
      }
    );
    videoChangeObserver.observe(video, {
      attributes: true,
    });
  };
})();
