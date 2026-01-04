// ==UserScript==
// @name         华东理工大学网教课程专供刷课脚本
// @namespace    video-dog
// @version      0.10.3
// @description  - **这是一个船新的版本，系兄弟就来砍我**
// @description  - **支持单个课程多视频播放，支持修改配速，储存倍速**
// @description  - **自动断点播放，自动下一集，默认10倍速 ，最高16倍（推荐使用谷歌浏览器）**
// @author       video-dog
// @match        *://mooc1.s.ecust.edu.cn/*
// @icon        data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABhYf8UYVj/sl9Y/6phYf8UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhd/xZfWP+KYFf/9F9Y/+ZgV//mYFf/9GFX/4xkWf8WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZFn/FmFX/4xgV//0YFj/2mFZ/16AgP8EZmb/BF9Y/2JgWP/cX1f/9mBZ/5BmXP8YAAAAAAAAAABhYf8UYFn/jGBX//RgV//YYVn/XKqq/wIAAAAAAAAAAAAAAAAAAAAAgID/BGBY/2BfV//aYFj/9l9Y/5JgYP8YX1f/zl9Y/+ZhWf9YgID/AgAAAACAgP8GXGP/Zlth//BbY/+eAAAAAAAAAAAAAAAAqqr/AmBY/1xfV//qX1j/0mBY/8BgWf+KAAAAAICA/wZcY/9mXGP/4Ftj//JcYf/cXGP/llxi/1pcY//eXGP/ZoCA/wYAAAAAYVj/kGBX/7RgWP/AYFn/imBm/yxaY//yXGL/9Fxj/4hmZv8UW2L/tlti/5BiYv8MW2P/hltj//JbYv/wXmn/LmFY/5BgV/+0YFj/wGBZ/4peZf9EW2L//2Zm/xQAAAAAAAAAAFxj/7RbYv+QAAAAAAAAAABea/8SW2L//1xi/05hWP+QYFf/tGBY/8BgWf+KXGT/PFti//8AAAAAAAAAAAAAAABcY/+0W2L/kAAAAAAAAAAAAAAAAFti//9dZf9GYVj/kGBX/7RgV/+4YFj/glxk/zxbYv//AAAAAAAAAAAAAAAAXGP/tFti/5AAAAAAAAAAAAAAAABbYv//XWX/Rl9Y/4pfWP+uZlf/ImFh/xRcZP88W2L//wAAAAAAAAAAAAAAAFxj/7RbYv+QAAAAAAAAAAAAAAAAW2L//11l/0ZpWv8QYlj/GgAAAAAAAAAAXGT/PFti//8AAAAAAAAAAAAAAABcY/+0W2L/kAAAAAAAAAAAAAAAAFti//9dZf9GAAAAAAAAAAAAAAAAAAAAAFxk/zxbYv//AAAAAAAAAAAAAAAAXWP/0Fti/+BcZf86AAAAAAAAAABbYv//XWX/RgAAAAAAAAAAAAAAAAAAAABcZP88W2L//1tn/ypcY/+gXmL/QFxh/zpbYv+4W2L//1xj/7ReY/8wW2L//11l/0YAAAAAAAAAAAAAAAAAAAAAW2L/Rlti//9bYv//W2P/xGBm/ygAAAAAAAAAAFtk/zhcY/+8W2L//1ti//9eaP9MAAAAAAAAAAAAAAAAAAAAAGFh/xxbY//AXGT/RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF5i/0BbY//MYmL/JgAAAAAAAAAA/n8AAPgfAADjxwAAj/EAAD58AAA4XAAAIkQAAC50AAAudAAALnQAAO53AADudwAA7ncAAOsXAADjxwAA7/cAAA==
// @grant        none
// @license      0.10.1
// @downloadURL https://update.greasyfork.org/scripts/481664/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%BD%91%E6%95%99%E8%AF%BE%E7%A8%8B%E4%B8%93%E4%BE%9B%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/481664/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%BD%91%E6%95%99%E8%AF%BE%E7%A8%8B%E4%B8%93%E4%BE%9B%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
 * ***********本程序仅用于学习交流，切勿用于非法用途，否则后果自负***********
 */
    /**
 * ***********本程序仅用于学习交流，切勿用于非法用途，否则后果自负***********
 */

    /**
 * ***********本程序仅用于学习交流，切勿用于非法用途，否则后果自负***********
 */

    class AutoPlayVideo {
        constructor() {
            this.iframes = [];
            this.video = null;
            this.videoEnd = [];
            this.speed = parseInt(window.localStorage.getItem("hd-video-speed")) || 10;
            this.index = 0;
            this.btnTimer = null;
            this.waitCata = document.querySelectorAll(".ncells");
            this.log = (t) => {
                console.log(t);
            };
            this.init();
        }

        init() {
            clearInterval(this.btnTimer);
            this.selectCata();

            this.btnTimer = setInterval(() => {
                this.log("正在获取新的章节");
                this.getIframes();
            }, 1000);
        }

        input() {
            const controllerWrapper = document.createElement("div");
            const input = document.createElement("input");
            const btn = document.createElement("button");
            const log = document.createElement("p");
            btn.classList.add("editor-video-speed");
            btn.innerText = "确认修改播放速度";
            input.style.border = "1px solid black";
            controllerWrapper.style.position = "fixed";
            controllerWrapper.style.top = "100px";
            controllerWrapper.style.left = "120px";
            controllerWrapper.style.display = "flex";
            controllerWrapper.style.justifyContent = "space-around";
            controllerWrapper.style.alignItems = "center";
            input.value = this.speed;
            controllerWrapper.appendChild(input);
            controllerWrapper.appendChild(btn);
            controllerWrapper.appendChild(log);
            log.style.background = "#333333";
            log.style.color = "#ffffff";
            log.style.padding = "2px 4px";
            this.log = (t) => {
                log.innerText = t;
            };
            document.body.append(controllerWrapper);

            btn.addEventListener("mousedown", () => {
                this.speed = input.value;
                window.localStorage.setItem("hd-video-speed", this.speed);
                if (this.video) {
                    alert("修改成功");
                }
                this.resetVideoSpeed();
            });
        }

        getIframes() {
            const iframe1 = document.querySelector("iframe");
            const iframe2 = iframe1.contentDocument.getElementsByTagName("iframe");
            const i1Btn = iframe1.contentDocument.getElementsByTagName("button")[0];
            const i2Btn = iframe2[0].contentDocument.getElementsByTagName("button")[0];
            if (i2Btn || i1Btn) {
                if (i1Btn) {
                    this.iframes = Array.from(iframe1);
                } else if (i2Btn) {
                    this.iframes = Array.from(iframe2);
                }
                clearInterval(this.btnTimer);
                setTimeout(() => {
                    this.play();
                    this.input();
                }, 1000);
            }
        }

        selectCata() {
            if (this.waitCata) {
                // const itemParent = [
                //   ...this.waitCata[this.index].parentElement.childNodes,
                // ].filter((item) => item.nodeName === "A");
                const a = this.waitCata[this.index].querySelector("a");
                // this.log(this.waitCata[this.index], a);
                eval(a.href);
                this.log("正在选择下一章节");
                this.videoEnd = [];
            }
        }

        videoEvent(that) {
            // that.video && that.video.removeEventListener("ended", that.videoEvent);
            setTimeout(() => {
                if (!that.iframes.length) {
                    that.index += 1;
                    that.selectCata();
                    that.init();
                } else {
                    that.play();
                }
            }, 1000);
        }

        resetVideoSpeed() {
            if (!this.video) {
                alert("修改失败，未获取到视频播放器");
                return;
            }
            if (this.speed > 16) {
                alert("修改失败，浏览器最高支持16倍速");
                return;
            }
            delete this.video.playbackRate;
            delete this.video.playbackRate;
            delete this.video.playbackRate;
            this.video.playbackRate = this.speed;
            Object.defineProperty(this.video, "playbackRate", {
                configurable: true,
                get: function () {
                    return 1;
                },
                set: function () {},
            });
        }

        play() {
            let curIframe = this.iframes.shift();
            this.videoEnd.push(this.index);
            this.log(
                "准备播放",
                `
      获取到${this.iframes.length}个iframe
      `
    );
      if (curIframe) {
          const isTaskEnd = [...curIframe.parentElement.classList].includes(
              "ans-job-finished"
          );
          if (isTaskEnd) {
              this.log(`当前任务点播放完毕，正在检查下一个...`);
              clearInterval(this.btnTimer);
              this.videoEvent(this);
              return;
          }
          const btn = curIframe.contentDocument.getElementsByTagName("button")[0];
          if (btn) {
              this.log("播放成功");
              this.video = curIframe.contentDocument.getElementsByTagName("video")[0];
              this.video.scrollIntoView();
              btn.click();
              clearInterval(this.btnTimer);
              this.resetVideoSpeed();
              this.video.addEventListener("ended", () => {
                  this.log(`视频播放完毕，正在播放下一个..`);
                  this.videoEnd.push(this.index);
                  setTimeout(() => {
                      this.videoEvent(this);
                  }, 1000);
              });
              this.video.addEventListener("pause", () => {
                  if (!this.videoEnd.includes(this.index)) {
                      this.video.play();
                  }
              });
          }
      }
  }
}
    console.log(
        "%c ***********本程序仅用于学习交流，切勿用于非法用途，否则后果自负***********",
        "color: red; font-size: 20px;"
    );
    const loop = setInterval(() => {
        if (document.querySelectorAll(".ncells").length >= 1) {
            window.APV = new AutoPlayVideo();
            clearInterval(loop);
        }
    }, 500);

})();