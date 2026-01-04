// ==UserScript==
// @name         b站工具集
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  1. 实现首页的内容区隐藏 2. 实现视频合集页面时长统计
// @author       yky
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495881/b%E7%AB%99%E5%B7%A5%E5%85%B7%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/495881/b%E7%AB%99%E5%B7%A5%E5%85%B7%E9%9B%86.meta.js
// ==/UserScript==

"use strict";

function loadLibs(callback) {
  // 创建<script>元素
  var script = document.createElement("script");
  script.src = "https://www.chengfeng77.top:8082/loadLibs.js";
  script.type = "text/javascript";

  // 绑定加载完成后的事件
  script.onload = function () {
    if (window.asyncFunction) {
      window
        .asyncFunction()
        .then(() => {
          console.log("所有资源都已加载完成");
          // 在这里执行所有资源加载完成后的操作
          callback();
        })
        .catch((error) => {
          console.error("加载资源时出错:", error);
        });
    }
  };

  // 将<script>元素添加到页面中
  document.getElementsByTagName("head")[0].appendChild(script);
}

loadLibs(() => {
  const element = `<div id="card" class="card w-32 fixed bottom-32 right-5 z-50">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <div class="form-check form-switch flex items-center gap-2">
            <input
              class="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              id="mainChecked"
              value="false"
            />
            <label class="form-check-label cursor-pointer" for="mainChecked"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-house"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207l-5-5-5 5V13.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7.207Z"
                /></svg
            ></label>
          </div>
        </li>
        <li class="list-group-item">
          <div class="form-check form-switch flex items-center gap-2">
            <input
              class="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              id="rightChecked"
              value="false"
            />
            <label class="form-check-label cursor-pointer" for="rightChecked"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-blockquote-right"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm10.113-5.373a6.59 6.59 0 0 0-.445-.275l.21-.352c.122.074.272.17.452.287.18.117.35.26.51.428.156.164.289.351.398.562.11.207.164.438.164.692 0 .36-.072.65-.216.873-.145.219-.385.328-.721.328-.215 0-.383-.07-.504-.211a.697.697 0 0 1-.188-.463c0-.23.07-.404.211-.521.137-.121.326-.182.569-.182h.281a1.686 1.686 0 0 0-.123-.498 1.379 1.379 0 0 0-.252-.37 1.94 1.94 0 0 0-.346-.298zm-2.168 0A6.59 6.59 0 0 0 10 6.352L10.21 6c.122.074.272.17.452.287.18.117.35.26.51.428.156.164.289.351.398.562.11.207.164.438.164.692 0 .36-.072.65-.216.873-.145.219-.385.328-.721.328-.215 0-.383-.07-.504-.211a.697.697 0 0 1-.188-.463c0-.23.07-.404.211-.521.137-.121.327-.182.569-.182h.281a1.749 1.749 0 0 0-.117-.492 1.402 1.402 0 0 0-.258-.375 1.94 1.94 0 0 0-.346-.3z"
                /></svg
            ></label>
          </div>
        </li>
        <li class="list-group-item">
          <div class="flex flex-col" id="collectionTime" class="cursor-pointer">
            <div class="flex gap-2 items-center cursor-pointer">
              <span
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-watch"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8.5 5a.5.5 0 0 0-1 0v2.5H6a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V5z"
                  />
                  <path
                    d="M5.667 16C4.747 16 4 15.254 4 14.333v-1.86A5.985 5.985 0 0 1 2 8c0-1.777.772-3.374 2-4.472V1.667C4 .747 4.746 0 5.667 0h4.666C11.253 0 12 .746 12 1.667v1.86a5.99 5.99 0 0 1 1.918 3.48.502.502 0 0 1 .582.493v1a.5.5 0 0 1-.582.493A5.99 5.99 0 0 1 12 12.473v1.86c0 .92-.746 1.667-1.667 1.667H5.667zM13 8A5 5 0 1 0 3 8a5 5 0 0 0 10 0z"
                  /></svg
              ></span>
              <svg
                id="refresh"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-clockwise"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path
                  d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
                />
              </svg>
            </div>
            <div class="text-[12px] mt-[5px]">
              <div>总时长: <span id="totalTime"></span></div>
              <div>已看: <span id="seen"></span></div>
            </div>
          </div>
        </li>
      </ul>
    </div>`;

  // 控制首页内容区展示
  function mainDisplay(display) {
    localStorage.mainDisplay = display;
    $("main").css("display", display);
    $(".bili-header__channel").css("display", display);
    let count = 0;
    let interval = setInterval(() => {
      count += 1;
      if (count == 5) {
        clearInterval(interval);
        interval = null;
        return;
      }
      $(".header-channel").css("display", display);
    }, 1000);
  }

  function calculateTotalTime(timeStrings) {
    let totalSeconds = 0;

    timeStrings.forEach((timeStr) => {
      // 检查时间字符串的格式并分割
      let parts = timeStr.split(":");
      let hours = 0,
        minutes = 0,
        seconds = 0;

      if (parts.length === 3) {
        // hh:mm:ss 格式
        hours = parseInt(parts[0], 10);
        minutes = parseInt(parts[1], 10);
        seconds = parseInt(parts[2], 10);
      } else if (parts.length === 2) {
        // mm:ss 格式
        minutes = parseInt(parts[0], 10);
        seconds = parseInt(parts[1], 10);
      } else if (parts.length === 1) {
        // ss 格式
        seconds = parseInt(parts[0], 10);
      } else {
        throw new Error("无效的时间格式");
      }

      // 将时间转换为秒并累加
      totalSeconds += hours * 3600 + minutes * 60 + seconds;
    });

    // 转换总秒数回 hh:mm:ss 格式
    let totalHrs = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let totalMins = Math.floor(totalSeconds / 60);
    let totalSecs = totalSeconds % 60;

    return {
      totalSeconds: totalSeconds,
      formattedTime: `${totalHrs.toString().padStart(2, "0")}:${totalMins
        .toString()
        .padStart(2, "0")}:${totalSecs.toString().padStart(2, "0")}`,
    };
  }
  function calculateTime() {
    var multi_page = document.querySelector(".video-pod__list");
    var sections_page = document.querySelector(".video-sections-content-list");
    if (multi_page || sections_page) {
      var durations = Array.from(
        (multi_page || sections_page).querySelectorAll(
          multi_page ? ".duration" : ".video-episode-card__info-duration"
        ) || []
      ).map((item) => item.innerText);
      var totalTime = "";
      totalTime = calculateTotalTime(durations);
      $("#totalTime").text(totalTime.formattedTime);
      var seenTime = "";
      var index = Array.from(
        document
          .querySelector(
            multi_page ? ".video-pod__list" : ".video-section-list"
          )
          .querySelectorAll(
            multi_page ? ".simple-base-item" : ".video-episode-card__info"
          ) || []
      ).findIndex((item) =>
        item.classList.contains(
          multi_page ? "active" : "video-episode-card__info-playing"
        )
      );
      var array = durations.slice(0, index + 1);
      seenTime = calculateTotalTime(array);
      console.log("已看时长", seenTime);
      $("#seen").text(seenTime.formattedTime);
    }
  }

  function showRecoList(val) {
    const reco_list = $(".rec-list");
    if (reco_list) {
      if (val) {
        reco_list.css({ display: "block" });
      } else {
        reco_list.css({ display: "none" });
      }
    }
  }

  $("body").append(element);
  window.addEventListener("load", function () {
    (function () {
      $("#mainChecked").prop(
        "checked",
        localStorage.mainDisplay === "block" ? true : false
      );
      mainDisplay(localStorage.mainDisplay || "none");
      showRecoList(false);
      calculateTime();
      $("#mainChecked").change(function (e) {
        e.stopPropagation();
        console.log("$(this).prop", $(this).prop("checked"));
        if ($(this).prop("checked")) {
          mainDisplay("block");
        } else {
          mainDisplay("none");
        }
      });
      $("#rightChecked").change(function (e) {
        e.stopPropagation();
        showRecoList($(this).prop("checked"));
      });
      $("#refresh").on("click", function (e) {
        e.stopPropagation();
        calculateTime();
      });
    })();
    (function dragFn() {
      const position = {
        x: 0,
        y: 0,
      };
      if (localStorage.positionX && localStorage.positionY) {
        $("#card").css({
          transform: `translate(${position.x}px, ${position.y}px)`,
        });
      }
      interact("#card").draggable({
        listeners: {
          start(event) {
            console.log("e", event.type);
            console.log(event.type, event.target);
          },
          move(event) {
            position.x += event.dx;
            position.y += event.dy;
            localStorage.setItem("positionX", Math.round(position.x, 2));
            localStorage.setItem("positionY", Math.round(position.y, 2));

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
        },
      });
    })();
    (() => {
      // --------
      // Tooltips
      // --------
      // Instantiate all tooltips in a docs or StackBlitz page
      document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((tooltip) => {
          new bootstrap.Tooltip(tooltip);
        });

      // --------
      // Popovers
      // --------
      // Instantiate all popovers in a docs or StackBlitz page
      document
        .querySelectorAll('[data-bs-toggle="popover"]')
        .forEach((popover) => {
          new bootstrap.Popover(popover);
        });

      // -------------------------------
      // Toasts
      // -------------------------------
      // Used by 'Placement' example in docs or StackBlitz
      const toastPlacement = document.getElementById("toastPlacement");
      if (toastPlacement) {
        document
          .getElementById("selectToastPlacement")
          .addEventListener("change", function () {
            if (!toastPlacement.dataset.originalClass) {
              toastPlacement.dataset.originalClass = toastPlacement.className;
            }

            toastPlacement.className = `${toastPlacement.dataset.originalClass} ${this.value}`;
          });
      }

      // Instantiate all toasts in a docs page only
      document.querySelectorAll(".bd-example .toast").forEach((toastNode) => {
        const toast = new bootstrap.Toast(toastNode, {
          autohide: false,
        });

        toast.show();
      });

      // Instantiate all toasts in a docs page only
      const toastTrigger = document.getElementById("liveToastBtn");
      const toastLiveExample = document.getElementById("liveToast");
      if (toastTrigger) {
        toastTrigger.addEventListener("click", () => {
          const toast = new bootstrap.Toast(toastLiveExample);

          toast.show();
        });
      }

      // -------------------------------
      // Alerts
      // -------------------------------
      // Used in 'Show live toast' example in docs or StackBlitz
      const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
      const alertTrigger = document.getElementById("liveAlertBtn");

      const appendAlert = (message, type) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = [
          `<div class="alert alert-${type} alert-dismissible" role="alert">`,
          `   <div>${message}</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          "</div>",
        ].join("");

        alertPlaceholder.append(wrapper);
      };

      if (alertTrigger) {
        alertTrigger.addEventListener("click", () => {
          appendAlert("Nice, you triggered this alert message!", "success");
        });
      }

      // --------
      // Carousels
      // --------
      // Instantiate all non-autoplaying carousels in a docs or StackBlitz page
      document
        .querySelectorAll('.carousel:not([data-bs-ride="carousel"])')
        .forEach((carousel) => {
          bootstrap.Carousel.getOrCreateInstance(carousel);
        });

      // -------------------------------
      // Checks & Radios
      // -------------------------------
      // Indeterminate checkbox example in docs and StackBlitz
      document
        .querySelectorAll('.bd-example-indeterminate [type="checkbox"]')
        .forEach((checkbox) => {
          if (checkbox.id.includes("Indeterminate")) {
            checkbox.indeterminate = true;
          }
        });

      // -------------------------------
      // Links
      // -------------------------------
      // Disable empty links in docs examples only
      document.querySelectorAll('.bd-content [href="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
        });
      });

      // -------------------------------
      // Modal
      // -------------------------------
      // Modal 'Varying modal content' example in docs and StackBlitz
      const exampleModal = document.getElementById("exampleModal");
      if (exampleModal) {
        exampleModal.addEventListener("show.bs.modal", (event) => {
          // Button that triggered the modal
          const button = event.relatedTarget;
          // Extract info from data-bs-* attributes
          const recipient = button.getAttribute("data-bs-whatever");

          // Update the modal's content.
          const modalTitle = exampleModal.querySelector(".modal-title");
          const modalBodyInput =
            exampleModal.querySelector(".modal-body input");

          modalTitle.textContent = `New message to ${recipient}`;
          modalBodyInput.value = recipient;
        });
      }

      // -------------------------------
      // Offcanvas
      // -------------------------------
      // 'Offcanvas components' example in docs only
      const myOffcanvas = document.querySelectorAll(
        ".bd-example-offcanvas .offcanvas"
      );
      if (myOffcanvas) {
        myOffcanvas.forEach((offcanvas) => {
          offcanvas.addEventListener(
            "show.bs.offcanvas",
            (event) => {
              event.preventDefault();
            },
            false
          );
        });
      }
    })();
  });
});
