// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  translate
// @author       You
// @match        file:///C:/Users/zf/notes/dict/plug/test.html
// @match       *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      youdao.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509344/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/509344/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

//https://dict.youdao.com/dictvoice?audio=hello&type=1发音接口（有道）
(function () {
  "use strict";
  GM_addStyle(`
    .card {
        border: 1px solid #ebebf0;
        background-color: white;
        position: absolute;
        width: 350px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .card-body {
        margin-bottom: 18px;
      }
      .card-title {
        display: flex;
        align-items: center;
        font-size: 15px;
        font-weight: bold;
        background-color: #ebebf0;
        padding: 6px;
      }
      .card-title svg {
        margin-right: 8px; /* 调整图标和文字之间的间距 */
        width: 23px; /* 调整图标的大小 */
      }
      .card-subtitle li {
        list-style: none;
        font-size: 14px;
        padding: 8px;
        color: black;
        margin-bottom: 8px;
        font-family: "Gilroy";
      }
        .card-subtitle p {
        font-size: 14px;
        padding: 8px;
        color: black;
        margin-bottom: 8px;
      }
      .baav {
          margin-top: 8px;
          margin-left: 8px;
          display: flex;
        }
      .pronounce {
          margin-right:15px;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          font-family: "SimHei";
          color: black;
      }
      .pronounce img {
           width: 20px;
           height: 20px;
           cursor: pointer;
      }
      .phonetic{
        margin-left: 10px;
        margin-right: 10px;
        font-weight: normal;
        font-family: "lucida sans unicode",arial,sans-serif;
        color: gray;
        }
      .card-subtitle svg {
        margin-right: 8px; /* 调整图标和文字之间的间距 */
        width: 30px; /* 调整图标的大小 */
        cursor: pointer;
        margin-left: 8px;
        padding-top: 5px;
      }`);
  const icon = document.createElement("div");
  icon.classList.add("icon");
  const img = document.createElement("img");
  img.src =
    "data:image/png;base64,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";
  img.width = 20; // 设置宽度
  img.height = 20;
  img.classList.add("icon-img");
  icon.appendChild(img);
  icon.style.cursor = "pointer";
  icon.style.position = "absolute";
  icon.style.display = "none";
  icon.style.cursor = "pointer";
  document.body.appendChild(icon);
  document.addEventListener("mouseup", function () {
    let selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      var range = selection.getRangeAt(0);
      var rect = range.getBoundingClientRect();
      icon.style.top = rect.bottom + window.scrollY + "px";
      icon.style.left = rect.right + window.scrollX + "px";
      icon.style.display = "block";
    } else {
      icon.style.display = "none";
    }
  });
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `<div class="card-body"><div class="card-title"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M157.615686 0h708.768628c86.337255 0 157.615686 70.27451 157.615686 156.611765v710.77647c0 86.337255-71.278431 156.611765-157.615686 156.611765h-708.768628c-86.337255 0-157.615686-70.27451-157.615686-156.611765v-710.77647c0-86.337255 71.278431-156.611765 157.615686-156.611765z" fill="#D20B0A"></path><path d="M543.121569 620.423529c30.117647-37.145098 39.152941-67.262745 28.109804-91.356862-14.054902-26.101961-33.129412-46.180392-65.254902-51.2-2.007843 21.082353-5.019608 39.152941-7.027451 51.2 16.062745 14.054902 30.117647 23.090196 37.145098 35.137255 9.035294 14.054902-2.007843 35.137255-19.07451 35.137254-33.129412 0-58.227451-28.109804-53.207843-60.235294 0-7.027451 0-12.047059 2.007843-19.074509 16.062745-74.290196-33.129412-100.392157-88.345098-100.392157-39.152941 0-79.309804 7.027451-118.462745 9.035294 5.019608-33.129412 33.129412-35.137255 60.235294-35.137255 46.180392-2.007843 91.356863-5.019608 137.537255-9.035294 16.062745-2.007843 35.137255-5.019608 33.129411-28.109804h-181.709803c5.019608-12.047059 9.035294-21.082353 16.062745-35.137255-19.07451-9.035294-35.137255-16.062745-56.219608-28.109804-12.047059 65.254902-51.2 86.337255-111.435294 65.254902-5.019608 53.207843 37.145098 33.129412 65.254902 44.172549-37.145098 46.180392-70.27451 88.345098-107.419608 135.529412 35.137255 7.027451 56.219608-19.07451 88.345098-35.137255-14.054902 72.282353-26.101961 137.537255-39.152941 202.792157 28.109804 7.027451 51.2-5.019608 63.247059-33.129412 7.027451-19.07451 9.035294-37.145098 16.062745-53.207843 21.082353-65.254902 91.356863-111.435294 163.639215-95.372549-2.007843 9.035294-2.007843 16.062745-5.019608 26.101961-19.07451 0-37.145098 0-53.207843 2.007843-30.117647 5.019608-56.219608 19.07451-63.247059 51.2-7.027451 30.117647 2.007843 56.219608 28.109804 74.290196 37.145098 26.101961 81.317647 35.137255 130.509804 35.137255 5.019608-26.101961 7.027451-51.2 12.047059-79.309804 12.047059 7.027451 19.07451 12.047059 28.109804 14.054902 67.262745 37.145098 137.537255 70.27451 216.847059 79.309804 77.301961 9.035294 144.564706-14.054902 197.772549-70.27451 5.019608-5.019608 9.035294-14.054902 12.047059-21.082353-131.513725 71.278431-250.980392 50.196078-367.435294-15.058824z m-146.572549-153.6c-49.192157 19.07451-98.384314 37.145098-144.564706 53.207844-5.019608-33.129412 0-49.192157 35.137255-56.219608 26.101961-7.027451 53.207843-7.027451 79.309804-7.027451h12.047058c27.105882 1.003922 18.070588 10.039216 18.070589 10.039215z m-7.027451 135.529412c-5.019608 23.090196-7.027451 46.180392-12.047059 70.27451H366.431373c-2.007843 0-2.007843 0-5.019608-2.007843-2.007843 0-5.019608-2.007843-5.019608-2.007843s-2.007843 0-2.007843-2.007843c0 0-2.007843 0-2.007843-2.007844 0 0-2.007843 0-2.007844-2.007843h-2.007843l-2.007843-2.007843c-2.007843 0-2.007843-2.007843-2.007843-2.007843-2.007843-2.007843-5.019608-5.019608-5.019608-7.027451l-2.007843-2.007843s0-2.007843-2.007843-2.007843c-2.007843-5.019608-2.007843-12.047059-2.007843-16.062745v-6.02353c0-26.101961 21.082353-33.129412 56.219608-23.090196z" fill="#FFFFFF" data-spm-anchor-id="a313x.search_index.i1.i1.14113a81zaq14g"></path><path d="M881.443137 355.388235c-26.101961 2.007843-49.192157 2.007843-79.309804 5.019608 12.047059-16.062745 19.07451-26.101961 26.101961-37.145098-19.07451-9.035294-35.137255-16.062745-51.2-23.090196-28.109804 19.07451-30.117647 58.227451-67.262745 65.254902-5.019608-21.082353-7.027451-42.164706-9.035294-60.235294-49.192157 7.027451-51.2 12.047059-42.164706 63.247059h-74.290196c0 30.117647 7.027451 37.145098 39.152941 37.145098h67.262745c0 2.007843 2.007843 7.027451 2.007843 9.035294-14.054902 5.019608-30.117647 9.035294-44.172549 16.062745-14.054902 7.027451-37.145098 16.062745-39.152941 28.109804-12.047059 51.2-16.062745 105.411765-23.090196 160.627451 70.27451 44.172549 146.572549 37.145098 228.894118 26.101961 5.019608-30.117647 7.027451-56.219608 12.047059-81.317647 2.007843-26.101961 9.035294-51.2 9.035294-77.301961 2.007843-37.145098-12.047059-53.207843-46.180392-60.235294-14.054902-2.007843-30.117647-5.019608-44.17255-7.027451 0-2.007843-2.007843-5.019608-2.007843-7.027451 14.054902-5.019608 28.109804-9.035294 44.172549-12.047059 26.101961-5.019608 51.2-5.019608 74.290196-9.035294 10.039216-9.035294 26.101961-13.05098 19.07451-36.141177z m-123.482353 248.972549c-39.152941 16.062745-77.301961 12.047059-114.447059 0 0-2.007843 2.007843-5.019608 5.019608-7.027451s2.007843-5.019608 5.019608-7.027451l2.007843-2.007843 2.007843-2.007843 2.007844-2.007843c2.007843-2.007843 5.019608-2.007843 7.027451-5.019608 0 0 2.007843 0 2.007843-2.007843 5.019608-2.007843 7.027451-2.007843 12.047059-5.019608h49.192156c9.035294 0 19.07451 2.007843 30.117647 5.019608-2.007843-1.003922 28.109804 6.023529-2.007843 27.105882z m-5.019608-72.282353s-2.007843 0 0 0H746.917647c-5.019608 0-7.027451 2.007843-12.047059 2.007844-7.027451 2.007843-16.062745 2.007843-23.090196 5.019607l-49.192157 7.027451c-5.019608 0-7.027451 2.007843-12.047059 2.007843V537.098039c0-2.007843 0-5.019608 2.007844-7.027451 5.019608-9.035294 12.047059-14.054902 23.090196-19.07451 2.007843 0 2.007843 0 5.019608-2.007843h16.062745c23.090196-2.007843 46.180392 0 70.274509 0 35.137255 0-2.007843 18.070588-14.054902 23.090196z m17.066667-67.262745c-37.145098 7.027451-74.290196 14.054902-109.427451 21.082353-5.019608-21.082353 5.019608-33.129412 28.109804-37.145098 41.160784-12.047059 67.262745-7.027451 81.317647 16.062745z m-259.011765-30.117647l7.027451-56.219608c42.164706 9.035294 67.262745 53.207843 56.219608 98.384314-12.047059-7.027451-21.082353-14.054902-30.117647-21.082353-10.039216-7.027451-22.086275-12.047059-33.129412-21.082353z m-179.70196 211.827451c2.007843 2.007843 2.007843 5.019608 5.019607 7.027451 0-2.007843-3.011765-5.019608-5.019607-7.027451z m46.180392 25.098039c-19.07451-5.019608-33.129412-9.035294-42.164706-19.074509 10.039216 10.039216 24.094118 17.066667 42.164706 19.074509z" fill="#FFFFFF"></path><path d="M653.552941 588.298039c-2.007843 2.007843-5.019608 5.019608-5.019608 7.027451 0-3.011765 2.007843-5.019608 5.019608-7.027451z m9.035294-40.156863c-5.019608 0-7.027451 2.007843-12.047059 2.007844 5.019608-2.007843 7.027451-2.007843 12.047059-2.007844z m86.337255-16.062745c0 2.007843 0 2.007843 0 0-5.019608 2.007843-9.035294 2.007843-14.054902 5.019608 4.015686-3.011765 9.035294-3.011765 14.054902-5.019608 0 2.007843 0 2.007843 0 0z m2.007843 0s-2.007843 0 0 0z m14.054902-25.098039c-23.090196 0-46.180392-2.007843-70.27451 0h-7.02745 7.02745c24.094118-3.011765 49.192157 0 70.27451 0z" fill="#FFFFFF"></path></svg>有道翻译</div><div class="pronounce-tag"></div><div class="card-subtitle mb-2 text-muted" id="ipa"></div></div>`;
  document.body.appendChild(card);
  card.style.display = "none";
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".icon")) {
      let selection = window.getSelection();
      if (selection.rangeCount > 0 && !selection.isCollapsed) {
        var range = selection.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        card.style.top = rect.bottom + window.scrollY + "px";
        card.style.left = rect.right + window.scrollX + "px";
        var cardSubtitle = document.getElementsByClassName("card-subtitle")[0];
        var pronounce = document.getElementsByClassName("pronounce-tag")[0];
        cardSubtitle.innerHTML = "";
        pronounce.innerHTML = "";
        let selectiontest = window.getSelection();
        let str = selectiontest.toString();
        let word = str.trim();
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://dict.youdao.com/w/eng/" + word,
          headers: {
            Host: "dict.youdao.com",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
          },
          onload: function (response) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(
              response.responseText,
              "text/html"
            );
            if (!word.includes(" ")) {
              let prons = doc.querySelectorAll(".baav");
              prons.forEach((element) => {
                // console.log(element);
                pronounce.appendChild(element);
              });
              let elements = doc.querySelectorAll(
                "#phrsListTab > .trans-container > ul > li"
              );
              elements.forEach((element) => {
                cardSubtitle.appendChild(element);
              });
            } else {
              let elements = doc.querySelectorAll(
                "#fanyiToggle > .trans-container > p"
              );
              if (elements.length === 0) {
                elements = doc.querySelectorAll(
                  "#phrsListTab > .trans-container > ul > li"
                );
                elements.forEach((element) => {
                  cardSubtitle.appendChild(element);
                });
              } else {
                elements.forEach((element, index) => {
                  if (index === 1) {
                    cardSubtitle.appendChild(element);
                  }
                });
              }
            }
          },
        });
        setTimeout(() => {
          var pronounceSpan = document.getElementsByClassName("pronounce");
          for (var i = 0; i < pronounceSpan.length; i++) {
            let pronounceimg = document.createElement("img");
            // pronounceimg.classList.add("pronounceSvg-tag");
            pronounceimg.src =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEwUlEQVR4nO2aa2hcVRCAT6rxrfgABV8oKGq0TfecTRoq2iq+QcUf4h/xh2ARFX8oIiomKBaFtmC0JJm5oYX4rlqqiFjxh4Ii/qiKii8Ua320MZud2Y3UR22vzN1zN9vds497b3Y3CzuwP3bnnLnnO4+ZOXNXqa50pXPk5i3+IRr5YQO80wCTQRoz4PeqTpK+Lf5hGnibQfYP+gCtVR0FgfyGHfgfaeArDORWyHcNvEt1IoSB7NJAMeIvKawK7Y9ir3+czlJthUCaTk/OXlSqD7dXo/Y08t2FVaR3DeTPV4sBIg5IGnhAbFmb/2rgYVlZ1ZqDTdPF7ZQQRKR/Mx1vkEY10r5gdZDeXjrGJ6hmr8QAzl5YrW0ckFBSE9lL51eHPx/y+ETVDAgNtKcWRFIQkUHMnG6Qv7DP+2RwNHOcWmiI5eP5vnp96oGITYP8nkZ6Kb1p9gxXmxXe3Cka6Fvryrcp3+9pKUQjICsnZ47VSBk7yHzK41tc7QTSIM0UXDzf01KIRkCCNpA90wC/aePQAQ38kKtdaiJ7fUFPfw0inR0fAml3ystfEKV/lDOikR6Q4Flr1g3wJgv8XPHHoQ27jhQ3Z5CzFflR2ScORFQQEY10h531/9KQW6kch18j7w2AQ5evgZ6pB5AEIq7XMsjrrGv/4ZxR/3CH/mm7KhtDkFm7jFe5DEqyF+i9/MVxIFwgy6Z2H62RnjCYvU12RI1g+1VhbLl7y/WSQdgJzkjb4kNWbfaPcA4C6EAwiAQpQjmIAbqsZLV/Nh6tdvfL3mg92S+u5xvkHaJPTfA19UESBjOnjRF/SRrodoP0TTGfQr66oqPv92jgH+3MX15pl560/R9vD0jJTdIAQ5j6DzybO6miL9Ba2399uU4j3WRBtrcVZH7W6UO7hYbL1bJtbP8PynUSR8Lt2X4Q0Xu56yzIp1XyLOn/a7mub+P0MVY3tyhAlo3NnWw955/lukKckzPCe9226e/AdhekCVvLIO9wJ4qdsLXksCN9ZLfWoxUgkLvWbq33qx524J3td7/IXuh+hxy3vxL3u66q+wV6p20BUXu8JrwoGaB/jMdX1gqIruivgZ+yceSxxZCi/KQxe0mtFMVInHA8X9x1MUUJk8bgS42kUYoACwUiLlWSxpSXu9WV2VYmjZX3Eknf7WrM2KQxuIvUTeMPqh62Jo1fbwf6vTuNL4xbriHBD7KlJLcvpvNNgIl9sULaJ7Vjl0uWq65crFwFweh13SaAGKD75WYYzLbHa2pddTXSlEpUVYwI0whI/3jmtJKq5X6DdJ+rXRqyN4TFh9iF7qD+BLw1Kkw9kODFENAee7BJ4kPVSostB2ngu2JBzBvzew3w61FgGlkRA/S8QXohNTlzao0C3XcWdmsShpKH+r0a+bVGYZIG1XRwuPlL+7yPpaAX15YbBvjVRmCSgBiPVodFbA38WVMq8oWrqmyJ2jAL8VrBIL0lv6lmyaoR/1AD9EotmKggqdJXCZKHAT+SqGgdEeblajCRAyLwsF2F7enJ3HmqlSIw8lqgHMbAb0eFMxvF1vLx3LmqXWLjwYshjGS1xdsf0Neq8/71QFOOXO1B1XHi+z0G+U5ZBYP0uwbeINul3cPqSldUdPkfLq8Z7zjf5zkAAAAASUVORK5CYII=";
            pronounceSpan[i].appendChild(pronounceimg);
            pronounceimg.id = "pronounceimg" + i.toString();
          }
        }, 500);
        card.style.display = "block";
      }
    }
  });
  document.body.addEventListener("click", (e) => {
    if (e.target.id == "pronounceimg0") {
      let selectiontest = window.getSelection();
      let str = selectiontest.toString();
      let word = str.trim();
      let audioSrc =
        "https://dict.youdao.com/dictvoice?audio=" + word + "&type=1";
      // 使用 GM.xmlHttpRequest 请求音频文件
      playAudioFromUrl(audioSrc);
    } else if (e.target.id == "pronounceimg1") {
      let selectiontest = window.getSelection();
      let str = selectiontest.toString();
      let word = str.trim();
      let audioSrc =
        "https://dict.youdao.com/dictvoice?audio=" + word + "&type=2";
      playAudioFromUrl(audioSrc);
    }
  });
  document.addEventListener("selectionchange", () => {
    icon.style.display = "none";
    card.style.display = "none";
  });
  setInterval(() => {
    let elements = document.querySelectorAll(".baav > .pronounce > a ");
    elements.forEach((element) => {
      element.remove();
    });
  }, 500);
  function playAudioFromUrl(audioUrl) {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    GM.xmlHttpRequest({
      method: "GET",
      url: audioUrl,
      responseType: "arraybuffer",
      onload: function (response) {
        if (response.status === 200) {
          // 解码音频数据
          audioContext.decodeAudioData(
            response.response,
            (audioBuffer) => {
              const source = audioContext.createBufferSource();
              source.buffer = audioBuffer; // 设置音频缓冲
              source.connect(audioContext.destination); // 连接到输出
              source.start(); // 开始播放
            },
            (error) => {
              console.error("解码音频数据时出错:", error);
            }
          );
        } else {
          console.error("请求音频文件失败:", response.statusText);
        }
      },
      onerror: function (error) {
        console.error("请求音频文件时发生错误:", error);
      },
    });
  }
})();
