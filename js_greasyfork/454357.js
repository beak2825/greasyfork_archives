// ==UserScript==
// @name        定时刷新页面
// @name:en     Auto refresh
// @name:zh     定时刷新页面
// @name:zh-CN  定时刷新页面
// @namespace   Violentmonkey Scripts
// @description 设置倒计时，在计时结束时对页面进行刷新。同时增加了倒计时的进度条，可以更直观地看到多久后页面会刷新
// @description:en Set a countdown and refresh the page at the end of the countdown
// @description:zh 设置倒计时，在计时结束时对页面进行刷新。同时增加了倒计时的进度条，可以更直观地看到多久后页面会刷新
// @description:zh-CN 设置倒计时，在计时结束时对页面进行刷新。同时增加了倒计时的进度条，可以更直观地看到多久后页面会刷新 
// @match       *://*/* 
// @supportURL  https://gitee.com/jiabaox/timer-refreshes/issues 
// @noframes    
// @inject-into content    
// @run-at document-idle    
// @grant       GM_setValue 
// @grant       GM_getValue 
// @grant       GM_deleteValue 
// @grant       GM_registerMenuCommand 
// @grant       GM_unregisterMenuCommand 
// @grant       GM_listValues 
// @grant       GM_setClipboard 
// @version     V1.0.11.17
// @author      JiabaoX 
// @homepageURL https://gitee.com/jiabaox/timer-refreshes.git 
// @license     MIT 
// @require     https://unpkg.com/@violentmonkey/dom@2.1.4/dist/index.js
// @require     https://unpkg.com/vue@3/dist/vue.global.prod.js 
// @icon        data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY3NDYxMjc1MTEyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijc4NSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTEuMiA1MS4ybTE1My42IDBsNjA5LjI4IDBxMTUzLjYgMCAxNTMuNiAxNTMuNmwwIDYwOS4yOHEwIDE1My42LTE1My42IDE1My42bC02MDkuMjggMHEtMTUzLjYgMC0xNTMuNi0xNTMuNmwwLTYwOS4yOHEwLTE1My42IDE1My42LTE1My42WiIgZmlsbD0iI0YxOTE0OSIgb3BhY2l0eT0iLjIiIHAtaWQ9Ijc4NiI+PC9wYXRoPjxwYXRoIGQ9Ik01MTIgMTU4LjcyYTM1My4yOCAzNTMuMjggMCAxIDAgMzUzLjI4IDM1My4yOCAzNTMuMjggMzUzLjI4IDAgMCAwLTM1My4yOC0zNTMuMjh6IG0xMjYuNjEyNDggNTA0LjE5NzEyYTE5Ni45NDU5MiAxOTYuOTQ1OTIgMCAwIDEtMzIwLjg4MDY0LTExOC4wOTI4aC0zNi4zMDA4YTE2LjE3NDA4IDE2LjE3NDA4IDAgMCAxLTEzLjAyMDE2LTI1Ljc2Mzg0bDYzLjU5NTUyLTg2LjM2NDE2YTE2LjE3NDA4IDE2LjE3NDA4IDAgMCAxIDI2LjA0NTQ0IDBsNjMuNTk1NTIgODYuMzY0MTZhMTYuMTc0MDggMTYuMTc0MDggMCAwIDEtMTMuMDIwMTYgMjUuNzYzODRoLTMyLjcxNjhhMTM5LjkxNDI0IDEzOS45MTQyNCAwIDAgMCAyMjUuOTk2OCA3NC40MTkyIDI4LjUyMzUyIDI4LjUyMzUyIDAgMCAxIDM2LjcwNTI4IDQzLjY3MzZ6TTc1NC4yODg2NCA1MDcuMzkyTDY5MC42ODggNTkzLjc3MTUyYTE2LjE3NDA4IDE2LjE3NDA4IDAgMCAxLTI2LjA0NTQ0IDBMNjAxLjA0MTkyIDUwNy4zOTJhMTYuMTc0MDggMTYuMTc0MDggMCAwIDEgMTMuMDI1MjgtMjUuNzYzODRoMzQuNDc4MDhhMTM5LjkxOTM2IDEzOS45MTkzNiAwIDAgMC0yMjYuNTcwMjQtNzYuODcxNjggMjguNTIzNTIgMjguNTIzNTIgMCAxIDEtMzYuNzA1MjgtNDMuNjczNiAxOTYuOTkyIDE5Ni45OTIgMCAwIDEgMzIxLjMyMDk2IDEyMC41NjU3NmgzNC42NzI2NGExNi4xNzQwOCAxNi4xNzQwOCAwIDAgMSAxMy4wMjUyOCAyNS43NDMzNnoiIGZpbGw9IiNGMTkxNDkiIHAtaWQ9Ijc4NyI+PC9wYXRoPjwvc3ZnPg== 
// @downloadURL https://update.greasyfork.org/scripts/454357/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/454357/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==   
const vue=Vue;
(function (VM, Vue, vue) {
  'use strict';

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;
    if (!css || typeof document === 'undefined') {
      return;
    }
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$5 = "#loading-status { \r\n    border: 0px #669CB8 solid;\r\n    -webkit-box-shadow: 0px 2px 2px #D0D4D6;\r\n    height: 10px;\r\n    -webkit-border-radius: 10px;\r\n    background: -webkit-gradient(linear, 0 0, 0 100%, from(#E1E9EE), to(white));\r\n    padding: 1px;\r\n    position: fixed;\r\n    bottom: 0;\r\n    z-index: 9999;\r\n    width: 100%;\r\n    opacity: 0.8;\r\n}\r\n\r\n#userscript-app{\r\n    position: absolute;\r\n    bottom: 10px;\r\n    top: 0;\r\nleft: 0;\r\n      \r\n}\r\n\r\n#precent {\r\n    background: -webkit-gradient(linear, 0 0, 0 100%, from(#7BC3FF), color-stop(0.5, #42A9FF), to(#7BC3FF));\r\n    height: 100%;\r\n    -webkit-border-radius: 10px;\r\n    -webkit-transition: width 0.2s ease-in-out;\r\n\r\n}";
  styleInject(css_248z$5);

  var script$5 = {
      props: ['precent', 'showPrecent', "showProgressBar", "position","themeColor","tranislationTime"],
      data() {
          return {

          }
      },
      methods: {

      },
      mounted() { 
      },
      computed: {
      
      }

  };

  const _hoisted_1$5 = {
    key: 0,
    class: "us-loading-status"
  };
  const _hoisted_2$4 = {
    key: 0,
    style: {"color":"white","text-align":"right","padding":"0 10px"}
  };

  function render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return ($props.showProgressBar)
      ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
          vue.createElementVNode("div", {
            class: "us-precent",
            style: vue.normalizeStyle({ width: $props.precent + '%', background:$props.themeColor ,transition:'width '+$props.tranislationTime+'s ease-in-out'} )
          }, [
            ($props.showPrecent)
              ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$4, vue.toDisplayString($props.precent.toFixed(2) + '%'), 1 /* TEXT */))
              : vue.createCommentVNode("v-if", true)
          ], 4 /* STYLE */)
        ]))
      : vue.createCommentVNode("v-if", true)
  }

  var css_248z$4 = "\n.us-loading-status {\r\n    border: 0px #669CB8 solid;\r\n    box-shadow: 0px 2px 2px #D0D4D6;\r\n    height: 10px;\r\n    border-radius: 10px;\r\n    background: -webkit-gradient(linear, 0 0, 0 100%, from(#E1E9EE), to(white));\r\n    padding: 0px;\r\n    position: relative;\r\n\r\n    z-index: 9999;\r\n    width: 100%;\r\n    opacity: 0.8;\n}\n.us-precent {\r\n    color: rgb(103,85,200);\r\n    color: rgb(46,89,200);\r\n    background: -webkit-gradient(linear, 0 0, 0 100%, from(#7BC3FF), color-stop(0.5, #42A9FF), to(#7BC3FF));\r\n    height: 100%;\r\n    border-radius: 10px;\n}\r\n";
  styleInject(css_248z$4);

  script$5.render = render$5;
  script$5.__file = "src/components/progressBar.vue";

  var script$4 = {
      props: ['duration', 'active'],
      emits:['timeElapsedChanged','endOfCountdown'],
      data() {
          return {
              timeElapsed: 0,
              millisec: 1000,
              isFirst: true,
              startTime: 0,
              count: 0
          }
      },
      methods: {
          reset() {
              this.timeElapsed = this.duration;
              this.count = 0;
              this.startTime = new Date().getTime();
          }
      },
      watch: {
          active: {
              handler(newValue, oldValue) {
                  if (this.isFirst) {
                      this.timeElapsed = this.duration;
                      this.isFirst = false;
                  }
                  this.startTime = new Date().getTime();
                  this.count = 0;
                  const timer = window.setTimeout(function runAgain(data, props, $emit) {
                      if (!props.active) {
                          //暂停计时
                          window.clearTimeout(timer);
                      }
                      else {
                          data.count++;
                          let currentTime = new Date().getTime();
                          let delay = currentTime - (data.startTime + data.count * data.millisec);
                          let nextTime = data.millisec - delay;
                          //console.debug('延迟', nextTime, currentTime, data.startTime + data.count * data.millisec, data.count, delay)
                          if (nextTime < 0) {
                              data.timeElapsed += nextTime;
                              data.count += -nextTime / data.millisec;
                              //console.debug('超延迟', data.timeElapsed, data.count);
                          }
                          else {
                              data.timeElapsed -= data.millisec;
                          }
                          //触发倒计时时间变化事件
                          $emit("timeElapsedChanged", data.timeElapsed);

                          if (data.timeElapsed <= 0) {
                              window.clearTimeout(timer);
                              //触发倒计时结束事件 
                              $emit("endOfCountdown");
                          }
                          else {
                              setTimeout(runAgain, nextTime, data, props, $emit);
                          }
                      }
                  }, this.$data.millisec, this.$data, this.$props, this.$emit);
              },
              immediate: true
          },
      },
      mounted() {

      },
      computed: {
          countDown() {
              //TODO 计算时、分、秒  
              if (this.timeElapsed <= 0)
                  this.timeElapsed = 0;
              //一小时= 1000*60*60
              let hour = Math.floor(this.timeElapsed / (1000 * 60 * 60));
              //一分钟 = 1000*60
              let min = Math.floor((this.timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
              //一秒 = 1000
              let sec = Math.floor((this.timeElapsed % (1000 * 60)) / 1000);

              let hourStr;
              let minStr;
              let secStr;

              if (hour >= 0 && hour <= 9) {
                  hourStr = "0" + hour;
              } else {
                  hourStr = hour + "";
              }

              if (min >= 0 && min <= 9) {
                  minStr = "0" + min;
              } else {
                  minStr = min + "";
              }

              if (sec >= 0 && sec <= 9) {
                  secStr = "0" + sec;
              } else {
                  secStr = sec + "";
              }

              return hourStr + ":" + minStr + ":" + secStr;
          }
      },

  };

  const _hoisted_1$4 = { class: "countdown" };

  function render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$4, vue.toDisplayString($options.countDown), 1 /* TEXT */))
  }

  var css_248z$3 = "\n.countdown {\r\n    font-variant-numeric: tabular-nums;\n}\r\n";
  styleInject(css_248z$3);

  script$4.render = render$4;
  script$4.__file = "src/components/countdown.vue";

  var img$9 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1667703884063' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2135' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M511.999787 1023.997867a508.627426 508.627426 0 0 1-362.025309-149.972771A508.712759 508.712759 0 0 1 0.001707 511.999787a508.627426 508.627426 0 0 1 149.972771-362.025309A508.627426 508.627426 0 0 1 511.999787 0.001707h0.597331a508.243427 508.243427 0 0 1 361.64131 149.802105 508.755426 508.755426 0 0 1 110.932918 166.186043A509.267424 509.267424 0 0 1 1023.997867 511.999787a508.712759 508.712759 0 0 1-149.972771 362.067975A508.670092 508.670092 0 0 1 511.999787 1023.997867zM435.797406 298.667253A55.466459 55.466459 0 0 0 384.000267 356.992368v309.972171A55.466459 55.466459 0 0 0 435.797406 725.33232a49.151816 49.151816 0 0 0 25.941236-7.509305l238.463106-155.47675A61.055771 61.055771 0 0 0 725.33232 511.999787a61.098438 61.098438 0 0 0-25.173239-50.303812l-238.463106-155.47675A48.98115 48.98115 0 0 0 435.797406 298.667253z' p-id='2136' fill='%231296db'%3e%3c/path%3e%3c/svg%3e";

  var img$8 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1667703924818' class='icon' viewBox='0 0 1026 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2318' xmlns:xlink='http://www.w3.org/1999/xlink' width='200.390625' height='200'%3e%3cpath d='M565.93216 12.8C226.73216-25.6-54.86784 275.2 9.13216 620.8c38.4 198.4 198.4 352 396.8 390.4 345.6 64 633.6-204.8 595.2-544C981.93216 230.4 796.33216 38.4 565.93216 12.8zM476.33216 710.4h-128v-384h128v384z m192 0h-128v-384h128v384z' fill='%23d81e06' p-id='2319'%3e%3c/path%3e%3c/svg%3e";

  var img$7 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1667716116558' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='6112' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M621.714286 512 1002.057143 131.657143c29.257143-29.257143 29.257143-80.457143 0-109.714286-29.257143-29.257143-80.457143-29.257143-109.714286 0L512 402.285714 131.657143 21.942857c-29.257143-29.257143-80.457143-29.257143-109.714286 0-29.257143 29.257143-29.257143 80.457143 0 109.714286L402.285714 512 21.942857 892.342857c-29.257143 29.257143-29.257143 80.457143 0 109.714286 29.257143 29.257143 80.457143 29.257143 109.714286 0L512 621.714286l380.342857 380.342857c29.257143 29.257143 80.457143 29.257143 109.714286 0 29.257143-29.257143 29.257143-80.457143 0-109.714286L621.714286 512z' p-id='6113'%3e%3c/path%3e%3c/svg%3e";

  var img$6 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1668149469147' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='9829' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M512 128a384 384 0 1 1 0 768A384 384 0 0 1 512 128z m0 109.824a32 32 0 0 0-32 32V512l0.64 6.336a32 32 0 0 0 13.76 20.352l186.816 123.264 5.12 2.752a32 32 0 0 0 39.232-11.84l2.688-5.12a32 32 0 0 0-11.776-39.168L544 494.72V269.824l-0.512-5.76A32 32 0 0 0 512 237.824z' fill='%23FF8F49' p-id='9830'%3e%3c/path%3e%3c/svg%3e";

  var img$5 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1668068365135' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='16823' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M511.33 63c-247.42 0-448 200.57-448 448s200.58 448 448 448 448-200.58 448-448-200.57-448-448-448z m163.42 625.54H347.91a42.27 42.27 0 0 1 0-84.53h326.84a42.27 42.27 0 1 1 0 84.53z m0-135.25H347.91a42.27 42.27 0 0 1 0-84.53h326.84a42.27 42.27 0 1 1 0 84.53z m0-135.24H347.91a42.27 42.27 0 0 1 0-84.53h326.84a42.27 42.27 0 1 1 0 84.53z' p-id='16824' fill='%238a8a8a'%3e%3c/path%3e%3c/svg%3e";

  var img$4 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1668068263546' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='14061' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M512 512m-389.12 0a389.12 389.12 0 1 0 778.24 0 389.12 389.12 0 1 0-778.24 0Z' fill='%233889FF' p-id='14062'%3e%3c/path%3e%3cpath d='M492.78976 401.11104c-73.68704 10.25024-126.89408 75.74528-121.84576 149.97504 5.05856 74.21952 66.6624 131.90144 141.056 132.07552a141.68064 141.68064 0 0 0 141.66016-141.69088 27.50464 27.50464 0 1 1 55.00928 0c0 108.62592-88.04352 196.66944-196.66944 196.66944S315.33056 650.11712 315.33056 541.4912c0-102.84032 78.92992-187.2384 179.47648-195.93216l26.7776 26.75712-28.79488 28.80512v-0.01024z m0 0' fill='white' p-id='14063'%3e%3c/path%3e%3cpath d='M482.07872 332.81024a27.50464 27.50464 0 0 1 38.90176-38.90176l58.94144 58.95168a27.50464 27.50464 0 0 1 0 38.90176l-58.94144 58.94144a27.50464 27.50464 0 0 1-38.90176-38.90176l39.50592-39.50592-39.50592-39.48544z m0 0' fill='white' p-id='14064'%3e%3c/path%3e%3c/svg%3e";

  var script$3 = {
      props: ['config','startCounting','countdown'],
      emits:['reset','start','suspend'],
      data() {
          return {
              defaultConfig: Object.assign({}, this.config),//备份配置选项（浅拷贝）
              icons: { running: img$9, suspend: img$8, close: img$7, menu: img$5, reset: img$4 ,timer: img$6}
          }
      },
      methods: {
          reset() {
              for (let key in this.config) {
                  //console.debug(key, this.config[key], this.defaultConfig[key])
                  this.config[key] = this.defaultConfig[key];
              }
          },
          submit() {
              let msg = "确认保存配置吗？";
              if (confirm(msg) == true) {
                  //保存配置到本地
                  GM_setValue('config', this.config);
              }
              GM_getValue('config');
          },
          clear() {
              let msg = "确认清除设置吗（此操作将会刷新页面）？";
              if (confirm(msg) == true) {
                  //保存配置到本地
                  GM_deleteValue('config');
                  location.reload();
              }
          }
      },
      mounted() {
      },
      components: {},
      watch: {

      },
      computed: {
          intervalOptions() {
              let items = new Array();
              for (let index = 1; index <= 9; index++) {
                  items.push(index / 10);

              }
              for (let index = 1; index <= 1440; index++) {

                  items.push(index);

              }
              return items;
          }
      }

  };

  const _hoisted_1$3 = /*#__PURE__*/vue.createElementVNode("div", { class: "userscript-head" }, null, -1 /* HOISTED */);
  const _hoisted_2$3 = { class: "userscript-content" };
  const _hoisted_3$3 = { class: "userscript-tab-content" };
  const _hoisted_4$3 = { class: "userscript-key-item" };
  const _hoisted_5$2 = { class: "userscript-value-item" };
  const _hoisted_6$2 = {
    title: "倒计时",
    class: "userscript-button",
    style: {"pointer-events":"none"}
  };
  const _hoisted_7$2 = ["src"];
  const _hoisted_8$2 = ["src"];
  const _hoisted_9$2 = ["src"];
  const _hoisted_10$2 = ["src"];
  const _hoisted_11$2 = { class: "userscript-key-item" };
  const _hoisted_12$2 = { class: "userscript-value-item" };
  const _hoisted_13$2 = ["value"];
  const _hoisted_14$2 = /*#__PURE__*/vue.createElementVNode("span", null, "⚠️注：该设置下次刷新页面时生效。", -1 /* HOISTED */);
  const _hoisted_15$2 = { class: "userscript-key-item" };
  const _hoisted_16$2 = { class: "userscript-value-item" };
  const _hoisted_17$2 = /*#__PURE__*/vue.createElementVNode("label", { for: "showPrecent" }, "显示进度条百分比", -1 /* HOISTED */);
  const _hoisted_18$2 = { class: "userscript-value-item" };
  const _hoisted_19$1 = /*#__PURE__*/vue.createElementVNode("label", { for: "showTimeElapsed" }, "显示操作按钮", -1 /* HOISTED */);
  const _hoisted_20 = /*#__PURE__*/vue.createElementVNode("span", null, [
    /*#__PURE__*/vue.createTextVNode("⚠️注：点击暴力猴/油猴插件图标，选择"),
    /*#__PURE__*/vue.createElementVNode("b", null, "\"设置\""),
    /*#__PURE__*/vue.createTextVNode("菜单，可以对设置进行更改。")
  ], -1 /* HOISTED */);
  const _hoisted_21 = { class: "userscript-value-item" };
  const _hoisted_22 = { class: "userscript-value-item" };
  const _hoisted_23 = { class: "userscript-key-item" };
  const _hoisted_24 = { class: "userscript-value-item" };
  const _hoisted_25 = /*#__PURE__*/vue.createElementVNode("label", { for: "showProgressBar" }, "显示进度条", -1 /* HOISTED */);
  const _hoisted_26 = { class: "userscript-value-item" };
  const _hoisted_27 = /*#__PURE__*/vue.createElementVNode("br", null, null, -1 /* HOISTED */);
  const _hoisted_28 = { class: "radiodiv" };
  const _hoisted_29 = /*#__PURE__*/vue.createElementVNode("label", { for: "us-1" }, "顶部", -1 /* HOISTED */);
  const _hoisted_30 = { class: "radiodiv" };
  const _hoisted_31 = /*#__PURE__*/vue.createElementVNode("label", { for: "us-2" }, "底部", -1 /* HOISTED */);
  const _hoisted_32 = { class: "userscript-value-item" };
  const _hoisted_33 = /*#__PURE__*/vue.createElementVNode("br", null, null, -1 /* HOISTED */);
  const _hoisted_34 = { class: "userscript-value-item" };
  const _hoisted_35 = { class: "userscript-tab-func" };

  function render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      _hoisted_1$3,
      vue.createElementVNode("div", _hoisted_2$3, [
        vue.createElementVNode("div", _hoisted_3$3, [
          vue.createElementVNode("div", _hoisted_4$3, [
            vue.createTextVNode(" 操作 "),
            vue.createElementVNode("div", _hoisted_5$2, [
              vue.createElementVNode("button", _hoisted_6$2, [
                vue.createElementVNode("img", {
                  src: this.icons.timer
                }, null, 8 /* PROPS */, _hoisted_7$2),
                vue.createTextVNode(" " + vue.toDisplayString(this.countdown), 1 /* TEXT */)
              ]),
              vue.createElementVNode("button", {
                title: "重置倒计时",
                onClick: _cache[0] || (_cache[0] = $event => (this.$emit('reset'))),
                class: "userscript-button"
              }, [
                vue.createElementVNode("img", {
                  src: this.icons.reset
                }, null, 8 /* PROPS */, _hoisted_8$2),
                vue.createTextVNode(" 重置倒计时 ")
              ]),
              vue.withDirectives(vue.createElementVNode("button", {
                title: "开始倒计时",
                onClick: _cache[1] || (_cache[1] = $event => (this.$emit('start'))),
                class: "userscript-button"
              }, [
                vue.createElementVNode("img", {
                  src: this.icons.running
                }, null, 8 /* PROPS */, _hoisted_9$2),
                vue.createTextVNode(" 开始倒计时 ")
              ], 512 /* NEED_PATCH */), [
                [vue.vShow, !this.startCounting]
              ]),
              vue.withDirectives(vue.createElementVNode("button", {
                title: "暂停倒计时",
                onClick: _cache[2] || (_cache[2] = $event => (this.$emit('suspend'))),
                class: "userscript-button"
              }, [
                vue.createElementVNode("img", {
                  src: this.icons.suspend
                }, null, 8 /* PROPS */, _hoisted_10$2),
                vue.createTextVNode(" 暂停倒计时 ")
              ], 512 /* NEED_PATCH */), [
                [vue.vShow, this.startCounting]
              ])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_11$2, [
            vue.createTextVNode(" 刷新时间 "),
            vue.createElementVNode("div", _hoisted_12$2, [
              vue.createTextVNode(" 页面刷新间隔（分钟）: "),
              vue.withDirectives(vue.createElementVNode("select", {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((this.config.refreshInterval) = $event))
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($options.intervalOptions, (item) => {
                  return (vue.openBlock(), vue.createElementBlock("option", { value: item }, vue.toDisplayString(item), 9 /* TEXT, PROPS */, _hoisted_13$2))
                }), 256 /* UNKEYED_FRAGMENT */))
              ], 512 /* NEED_PATCH */), [
                [vue.vModelSelect, this.config.refreshInterval]
              ]),
              _hoisted_14$2
            ])
          ]),
          vue.createElementVNode("div", _hoisted_15$2, [
            vue.createTextVNode(" 显示内容 "),
            vue.createElementVNode("div", _hoisted_16$2, [
              vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                id: "showPrecent",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((this.config.showPrecent) = $event))
              }, null, 512 /* NEED_PATCH */), [
                [vue.vModelCheckbox, this.config.showPrecent]
              ]),
              _hoisted_17$2
            ]),
            vue.createElementVNode("div", _hoisted_18$2, [
              vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                id: "showTimeElapsed",
                "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((this.config.showTimeElapsed) = $event))
              }, null, 512 /* NEED_PATCH */), [
                [vue.vModelCheckbox, this.config.showTimeElapsed]
              ]),
              _hoisted_19$1,
              _hoisted_20
            ]),
            vue.createElementVNode("div", _hoisted_21, [
              vue.createTextVNode(" 倒计时提示: "),
              vue.withDirectives(vue.createElementVNode("input", {
                type: "text",
                min: "0",
                max: "100",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((this.config.label) = $event))
              }, null, 512 /* NEED_PATCH */), [
                [vue.vModelText, this.config.label]
              ])
            ]),
            vue.createElementVNode("div", _hoisted_22, [
              vue.createTextVNode(" 透明度: "),
              vue.withDirectives(vue.createElementVNode("input", {
                type: "range",
                min: "0",
                max: "100",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((this.config.opacity) = $event))
              }, null, 512 /* NEED_PATCH */), [
                [vue.vModelText, this.config.opacity]
              ]),
              vue.createElementVNode("span", null, vue.toDisplayString(this.config.opacity) + "%", 1 /* TEXT */)
            ])
          ]),
          vue.createElementVNode("div", _hoisted_23, [
            vue.createTextVNode(" 进度条 "),
            vue.createElementVNode("div", _hoisted_24, [
              vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                id: "showProgressBar",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((this.config.showProgressBar) = $event))
              }, null, 512 /* NEED_PATCH */), [
                [vue.vModelCheckbox, this.config.showProgressBar]
              ]),
              _hoisted_25
            ]),
            vue.createElementVNode("div", _hoisted_26, [
              vue.createTextVNode(" 位置:"),
              _hoisted_27,
              vue.createElementVNode("div", null, [
                vue.createElementVNode("div", _hoisted_28, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "radio",
                    id: "us-1",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((this.config.position) = $event)),
                    value: "top"
                  }, null, 512 /* NEED_PATCH */), [
                    [vue.vModelRadio, this.config.position]
                  ]),
                  _hoisted_29
                ]),
                vue.createElementVNode("div", _hoisted_30, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "radio",
                    id: "us-2",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((this.config.position) = $event)),
                    value: "bottom"
                  }, null, 512 /* NEED_PATCH */), [
                    [vue.vModelRadio, this.config.position]
                  ]),
                  _hoisted_31
                ])
              ])
            ]),
            vue.createElementVNode("div", _hoisted_32, [
              vue.createTextVNode(" 颜色: "),
              _hoisted_33,
              vue.withDirectives(vue.createElementVNode("input", {
                type: "color",
                name: "favcolor",
                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((this.config.themeColor) = $event))
              }, null, 512 /* NEED_PATCH */), [
                [vue.vModelText, this.config.themeColor]
              ]),
              vue.createElementVNode("span", null, vue.toDisplayString(this.config.themeColor), 1 /* TEXT */)
            ]),
            vue.createElementVNode("div", _hoisted_34, [
              vue.createTextVNode(" 高   度: "),
              vue.withDirectives(vue.createElementVNode("input", {
                type: "range",
                min: "1",
                max: "100",
                "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((this.config.height) = $event))
              }, null, 512 /* NEED_PATCH */), [
                [vue.vModelText, this.config.height]
              ]),
              vue.createElementVNode("span", null, vue.toDisplayString(this.config.height) + "px", 1 /* TEXT */)
            ])
          ])
        ])
      ]),
      vue.createElementVNode("div", _hoisted_35, [
        vue.createElementVNode("button", {
          title: "恢复到脚本刚安装时的默认配置",
          type: "reset",
          onClick: _cache[13] || (_cache[13] = (...args) => ($options.clear && $options.clear(...args))),
          class: "userscript-button"
        }, "清除设置"),
        vue.createElementVNode("button", {
          title: "取消",
          type: "reset",
          onClick: _cache[14] || (_cache[14] = (...args) => ($options.reset && $options.reset(...args))),
          class: "userscript-button"
        }, "取消"),
        vue.createElementVNode("button", {
          title: "保存",
          type: "submit",
          onClick: _cache[15] || (_cache[15] = (...args) => ($options.submit && $options.submit(...args))),
          class: "userscript-button"
        }, "保存")
      ])
    ], 64 /* STABLE_FRAGMENT */))
  }

  var css_248z$2 = "\n.userscript-tab-func{\r\n    position: absolute;\r\n    bottom: 0;\r\n    margin: 5px;\n}\n.userscript-head {}\n.userscript-content {\n}\n.userscript-tab-head {}\n.userscript-tab-content {\r\n    color: black;\r\n    width: 90%;\r\n    margin: 0 auto;\r\n    padding:0 0 20px 0;\n}\n.userscript-key-item {\r\n    font-weight: bold;\r\n    margin: 8px 0;\n}\n.userscript-value-item {\r\n    font-weight: normal;\r\n    padding: 8px;\n}\n.userscript-value-item img {\r\n    height: 30px;\r\n    vertical-align: middle;\n}\n.userscript-value-item span {\r\n    color: rgb(255, 138, 66);\r\n    margin: 0 5px;\n}\n.userscript-value-item input {\r\n    margin: 0 2px;\r\n    height: 20px;\r\n    cursor: pointer;\n}\n.userscript-value-item input[type=\"color\"] {\r\n    height: 30px;\r\n    width: 45px;\r\n    border-radius: 3px;\r\n    border: solid 0px red\n}\n.userscript-value-item .radiodiv {\r\n    display: inline;\r\n    float: flex;\r\n    margin: 0px 3px;\n}\n.userscript-value-item label {\r\n    cursor: pointer;\n}\n.userscript-value-item label:hover {\r\n    color: rgb(0, 136, 255);\n}\r\n";
  styleInject(css_248z$2);

  script$3.render = render$3;
  script$3.__file = "src/components/settingsTab.vue";

  const delEmptyQueryNodes = (obj = {}) => {
    Object.keys(obj).forEach(key => {
      let value = obj[key];
      value && typeof value === 'object' && delEmptyQueryNodes(value);
      (value === '' || value === null || value === undefined || value.length === 0 || Object.keys(value).length === 0) && delete obj[key];
    });
    return obj;
  };
  const objKeysSort = obj => {
    /**
     * 先用Object内置类的keys方法获取要排序对象的属性名
     * 再利用Array原型上的sort方法对获取的属性名进行排序
     * newKey是一个数组
     */
    var newKey = Object.keys(obj).sort();
    // 创建一个新对象，用于存放排好序的键值对
    var newObj = {};
    // 遍历数组
    for (var i = 0; i < newKey.length; i++) {
      // 向新创建的对象中按照排好的顺序依次增加键值对
      newObj[newKey[i]] = obj[newKey[i]];
    }
    // 返回新对象
    return newObj;
  };

  var script$2 = {
      props: [],
      data() {
          return {

          }
      },
      methods: {

      },
      mounted() {
      },
      computed: {

      },
      beforeCreate() {
          this.data = GM_info;
         
          this.data.script=delEmptyQueryNodes(delEmptyQueryNodes(this.data.script));
          this.data.script=objKeysSort(this.data.script);
         
         
          // this.data=this.data.script.filter((item)=>{
          //     return item.lenght>0;
          // });
      }


  };

  const _hoisted_1$2 = { class: "us-platform" };
  const _hoisted_2$2 = /*#__PURE__*/vue.createElementVNode("h4", null, " scriptHandler: ", -1 /* HOISTED */);
  const _hoisted_3$2 = { class: "us-table" };
  const _hoisted_4$2 = { key: 0 };
  const _hoisted_5$1 = /*#__PURE__*/vue.createElementVNode("td", null, "scriptHandler ", -1 /* HOISTED */);
  const _hoisted_6$1 = { key: 1 };
  const _hoisted_7$1 = /*#__PURE__*/vue.createElementVNode("td", null, "scriptHandler ", -1 /* HOISTED */);
  const _hoisted_8$1 = { class: "us-platform" };
  const _hoisted_9$1 = /*#__PURE__*/vue.createElementVNode("h4", null, " environment: ", -1 /* HOISTED */);
  const _hoisted_10$1 = {
    key: 0,
    class: "us-table"
  };
  const _hoisted_11$1 = { class: "us-platform" };
  const _hoisted_12$1 = /*#__PURE__*/vue.createElementVNode("h4", null, " script: ", -1 /* HOISTED */);
  const _hoisted_13$1 = { class: "us-table" };
  const _hoisted_14$1 = { key: 0 };
  const _hoisted_15$1 = ["src"];
  const _hoisted_16$1 = { key: 1 };
  const _hoisted_17$1 = { key: 2 };
  const _hoisted_18$1 = /*#__PURE__*/vue.createElementVNode("div", null, null, -1 /* HOISTED */);

  function render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("div", _hoisted_1$2, [
        _hoisted_2$2,
        vue.createElementVNode("table", _hoisted_3$2, [
          (this.data.scriptHandler!=undefined)
            ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_4$2, [
                _hoisted_5$1,
                vue.createElementVNode("td", null, vue.toDisplayString(this.data.scriptHandler), 1 /* TEXT */)
              ]))
            : vue.createCommentVNode("v-if", true),
          (this.data.version!=undefined)
            ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_6$1, [
                _hoisted_7$1,
                vue.createElementVNode("td", null, vue.toDisplayString(this.data.version), 1 /* TEXT */)
              ]))
            : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createElementVNode("div", _hoisted_8$1, [
        _hoisted_9$1,
        (this.data.platform!=undefined)
          ? (vue.openBlock(), vue.createElementBlock("table", _hoisted_10$1, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(Object.keys(this.data.platform), (item) => {
                return (vue.openBlock(), vue.createElementBlock("tr", null, [
                  vue.createElementVNode("td", null, vue.toDisplayString(item), 1 /* TEXT */),
                  vue.createElementVNode("td", null, vue.toDisplayString(this.data.platform[item]), 1 /* TEXT */)
                ]))
              }), 256 /* UNKEYED_FRAGMENT */))
            ]))
          : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode("div", _hoisted_11$1, [
        _hoisted_12$1,
        vue.createElementVNode("table", _hoisted_13$1, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(Object.keys(this.data.script), (item) => {
            return (vue.openBlock(), vue.createElementBlock("tr", { key: item }, [
              vue.createElementVNode("td", null, vue.toDisplayString(item), 1 /* TEXT */),
              (item == 'icon')
                ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_14$1, [
                    vue.createElementVNode("img", {
                      style: {"width":"50px"},
                      src: this.data.script[item]
                    }, null, 8 /* PROPS */, _hoisted_15$1)
                  ]))
                : (Array.isArray( this.data.script[item] ) )
                  ? (vue.openBlock(), vue.createElementBlock("td", _hoisted_16$1, [
                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(this.data.script[item], (item1) => {
                        return (vue.openBlock(), vue.createElementBlock("li", null, vue.toDisplayString(item1), 1 /* TEXT */))
                      }), 256 /* UNKEYED_FRAGMENT */))
                    ]))
                  : (vue.openBlock(), vue.createElementBlock("td", _hoisted_17$1, vue.toDisplayString(this.data.script[item]), 1 /* TEXT */))
            ]))
          }), 128 /* KEYED_FRAGMENT */))
        ])
      ]),
      _hoisted_18$1
    ], 64 /* STABLE_FRAGMENT */))
  }

  script$2.render = render$2;
  script$2.__file = "src/components/userScriptInfo.vue";

  var script$1 = {
      props: [],
      data() {
          return {
              arrayOfKeys: [],
              stoage: [],
              file_is_show: true
          }
      },
      methods: {
          clear() {
              let msg = "确认清除所有数据吗（此操作将会刷新页面）？";
              if (confirm(msg) == true) {
                  for (const iterator of this.arrayOfKeys) {
                      GM_deleteValue(iterator);
                  }
                  location.reload();
              }
          },
          copy(key,e) {
              let result= this.stoage[key];
              GM_setClipboard(result);
          },
          remove(key, e) {
              //console.debug(key, e) 
              const index = this.arrayOfKeys.indexOf(key);
              if (index > -1) { // 移除找到的指定元素
                  GM_deleteValue(key);
                  this.arrayOfKeys.splice(index, 1); // 移除元素
              }
             // console.debug(index, this.arrayOfKeys)

          },
         refresh() {
              let arrayOfKeys = GM_listValues();

              if (arrayOfKeys != undefined) {

                  this.arrayOfKeys = arrayOfKeys;
                  for (const iterator of arrayOfKeys) {
                      this.stoage[iterator] = JSON.stringify(GM_getValue(iterator));
                  }
              }
              else {
                  this.arrayOfKeys = [];
              }
          }
      },
      mounted() {

           this.refresh();
      },
      computed: {

      },
      watch: {
       
      }

  };

  const _hoisted_1$1 = {
    style: {"width":"100%"},
    class: "us-table"
  };
  const _hoisted_2$1 = /*#__PURE__*/vue.createElementVNode("thead", null, [
    /*#__PURE__*/vue.createElementVNode("th", null, "key"),
    /*#__PURE__*/vue.createElementVNode("th", null, "value")
  ], -1 /* HOISTED */);
  const _hoisted_3$1 = ["onClick"];
  const _hoisted_4$1 = ["onClick"];

  function render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createElementBlock("div", null, [
      vue.createElementVNode("table", _hoisted_1$1, [
        _hoisted_2$1,
        vue.createElementVNode("tbody", null, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(this.arrayOfKeys, (item) => {
            return (vue.openBlock(), vue.createElementBlock("tr", null, [
              vue.createElementVNode("td", null, vue.toDisplayString(item), 1 /* TEXT */),
              vue.createElementVNode("td", null, vue.toDisplayString(this.stoage[item]), 1 /* TEXT */),
              vue.createElementVNode("button", {
                class: "userscript-button",
                onClick: $event => ($options.remove(item, $event))
              }, "删除", 8 /* PROPS */, _hoisted_3$1),
              vue.createElementVNode("button", {
                class: "userscript-button",
                onClick: $event => ($options.copy(item,$event))
              }, "复制", 8 /* PROPS */, _hoisted_4$1)
            ]))
          }), 256 /* UNKEYED_FRAGMENT */))
        ])
      ]),
      vue.createElementVNode("button", {
        title: "清除所有数据",
        class: "userscript-button",
        onClick: _cache[0] || (_cache[0] = (...args) => ($options.clear && $options.clear(...args)))
      }, "全部清除"),
      vue.createElementVNode("button", {
        title: "刷新",
        class: "userscript-button",
        onClick: _cache[1] || (_cache[1] = (...args) => ($options.refresh && $options.refresh(...args)))
      }, "刷新")
    ]))
  }

  var css_248z$1 = "\n.us-table {\r\n    word-break: break-all;\r\n    width: 100%;\r\n    list-style-type: decimal;\n}\n.us-table th {\r\n    font-weight: bold;\r\n\r\n    border-bottom: solid 1px rgba(65, 65, 65, 0.592);\n}\n.us-table tr:nth-of-type(odd) {\r\n    background-color: rgba(236, 236, 236, 0.29);\n}\n.us-table td {\r\n    padding: 20px;\r\n    border-bottom: solid 1px rgba(65, 65, 65, 0.592);\n}\n.us-table tr:nth-of-type(even) {}\n.us-table td:nth-of-type(odd) {\r\n    width: 30%;\n}\r\n";
  styleInject(css_248z$1);

  script$1.render = render$1;
  script$1.__file = "src/components/stoage.vue";

  var img$3 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1668068079138' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='3242' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M747.1 116.6H280.9c-90.1 0-163.5 73.4-163.5 163.5v466.2c0 90.1 73.4 163.5 163.5 163.5h466.2c90.1 0 164.1-73.4 163.5-163.5V280.1c0-90.2-73.3-163.5-163.5-163.5z m-363 713.6H233.6c-20.5 0-37.9-16.8-38.5-38.5V641.3c0-21.1 16.8-37.9 37.9-37.9 10.6 0 19.9 4.4 26.7 11.2 6.8 6.8 11.2 16.8 11.2 26.7v58.4l136.2-136.2c14.9-14.9 39.2-14.9 54.1 0 14.9 14.9 14.9 39.2 0 54.1L325 753.8h58.4c21.1 0 37.9 16.8 37.9 37.9s-16.1 38.5-37.2 38.5z m257.5-642.8H792c20.5 0 37.9 16.8 38.5 38.5v150.4c0 21.1-16.8 37.9-37.9 37.9-10.6 0-19.9-4.4-26.7-11.2-6.8-6.8-11.2-16.8-11.2-26.7V318L618.5 454.2c-14.9 14.9-39.2 14.9-54.1 0-14.9-14.9-14.9-39.2 0-54.1l136.2-136.2h-58.4c-21.1 0-37.9-16.8-37.9-37.9s16.1-38.6 37.3-38.6z' p-id='3243'%3e%3c/path%3e%3c/svg%3e";

  var img$2 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1668068041631' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1537' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M746.2 131.1H279.9c-90.1 0-163.5 73.4-163.5 163.5v466.2c0 90.1 73.4 163.5 163.5 163.5h466.2c90.1 0 164.1-73.4 163.5-163.5V294.6c0.1-90.2-73.3-163.5-163.4-163.5zM282.5 566.8h150.4c20.5 0 37.9 16.8 38.5 38.5v150.4c0 21.1-16.8 37.9-37.9 37.9-10.6 0-19.9-4.4-26.7-11.2s-11.2-16.8-11.2-26.7v-58.4L259.4 833.6c-14.9 14.9-39.2 14.9-54.1 0-14.9-14.9-14.9-39.2 0-54.1l136.2-136.2h-58.4c-21.1 0-37.9-16.8-37.9-37.9 0-21.2 16.2-38.6 37.3-38.6z m458.7-86.9H590.8c-20.5 0-37.9-16.8-38.5-38.5V291c0-21.1 16.8-37.9 37.9-37.9 10.6 0 19.9 4.4 26.7 11.2s11.2 16.8 11.2 26.7v58.4l136.2-136.2c14.9-14.9 39.2-14.9 54.1 0 14.9 14.9 14.9 39.2 0 54.1L682.1 403.5h58.4c21.1 0 37.9 16.8 37.9 37.9 0.1 21.1-16.1 38.5-37.2 38.5z' p-id='1538'%3e%3c/path%3e%3c/svg%3e";

  var img$1 = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1668132292571' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2133' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M684.408675 959.148993c-26.192545 0-52.375881-9.988492-72.359005-29.971615L267.23232 584.357981c-39.963177-39.963177-39.963177-104.754832 0-144.716986L612.04967 94.822622c39.963177-39.963177 104.754832-39.963177 144.718009 0 39.963177 39.962154 39.963177 104.754832 0 144.716986L484.308311 512 756.76768 784.459369c39.963177 39.963177 39.963177 104.754832 0 144.718009C736.788649 949.155385 710.594057 959.148993 684.408675 959.148993z' p-id='2134'%3e%3c/path%3e%3c/svg%3e";

  var img = "data:image/svg+xml,%3c%3fxml version='1.0' standalone='no'%3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg t='1668132230047' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2129' xmlns:xlink='http://www.w3.org/1999/xlink' width='200' height='200'%3e%3cpath d='M339.590302 959.148993c-26.188452 0-52.377928-9.990538-72.357981-29.971615-39.963177-39.963177-39.963177-104.754832 0-144.718009l272.459369-272.459369L267.23232 239.539608c-39.963177-39.962154-39.963177-104.754832 0-144.716986 39.962154-39.963177 104.754832-39.963177 144.716986 0l344.818373 344.818373c39.963177 39.962154 39.963177 104.753809 0 144.716986L411.949306 929.177378C391.96823 949.158455 365.779777 959.148993 339.590302 959.148993z' p-id='2130'%3e%3c/path%3e%3c/svg%3e";

  var script = {
      data() {
          return {
              precent: 0,
              startCounting: true,
              config: {
                  showTimeElapsed: true,
                  showPrecent: true,
                  showProgressBar: true,
                  position: 'bottom',
                  refreshInterval: 2,
                  themeColor: null,
                  opacity: 100,
                  height: 6,
                  label: '刷新倒计时',

              },
              selectedTab: 1,
              showMainForm: true,
              imgs: {},
              scriptInfo: {},
              refreshInterval: 2,
              enableFullScreen: false,
              menuItem: undefined,
              isUnfolded: true
          }
      },
      watch: {
          showMainForm(newValue, oldValue) {
              let showMainForm = GM_getValue('showMainForm');
              if (showMainForm != newValue) {
                  GM_setValue('showMainForm', newValue);
              }
          },
          selectedTab(newValue) {
              let selectedTab = GM_getValue('selectedTab');
              if (selectedTab != newValue) {
                  GM_setValue('selectedTab', newValue);
              }
          },
          isUnfolded(newValue) {
              let isUnfolded = GM_getValue('isUnfolded');
              if (isUnfolded != newValue) {
                  GM_setValue('isUnfolded', newValue);
              }
          }
      },
      methods: {
          precentIncrease(timeElapsed) {
              // if (this.menuItem != undefined) {
              //     GM_unregisterMenuCommand(this.menuItem);
              //     this.menuItem = undefined;

              // };
              // let menuText = '刷新倒计时:' + this.$refs.countdown.countDown;
              // this.menuItem = GM_registerMenuCommand(menuText, () => {
              // });

              if (timeElapsed <= 0)
                  timeElapsed = 0;
              this.precent = (1 - (timeElapsed / (this.refreshInterval * 60 * 1000))) * 100;

          },
          reload() {
              location.reload();
          },
          startOrStop() {
              this.startCounting = !this.startCounting;
          },
          maskClick() {
              if (this.showMainForm) {
                  this.showMainForm = false;
              }
          },
          fullScreen() {
              if (document.fullscreenEnabled) {
                  document.body.requestFullscreen();
                  this.enableFullScreen = true;
              }
              else {
                  alert('浏览器不允许或者不支持全屏显示');
              }
          },
          cancelFullScreen() {
              document.exitFullscreen();
              this.enableFullScreen = false;

          },
          reset() {
              this.$refs.countdown.reset();
          }

      },
      components: { ProgressBar: script$5, Countdown: script$4, SettingsTab: script$3, UserScriptInfo: script$2, Stoage: script$1 },
      computed: {
          displayPosition() {
              if (this.config.position == "top")
                  return "top";
              else
                  return "bottom"
          },
          interval() {
              return this.config.refreshInterval * 60 * 1000;
          },
          tranislationTime() {
              // let result = 0.2 / this.config.refreshInterval;
              // result = result >= 0.01 ? result : 0;
              // result = result > 1 ? 0.5 : result;
              //return result
              return 0.5;
          }

      },
      mounted() {

          this.imgs = {
              running: img$9, suspend: img$8, close: img$7, cancelFullScreen: img$2, fullScreen: img$3, menu: img$5, reset: img$4, right: img, left: img$1
          };
          console.debug(this.imgs);

          GM_registerMenuCommand('设置', () => {
              this.$data.showMainForm = true;
          });

          GM_registerMenuCommand('关于', () => {
              this.$data.selectedTab = 2;
              this.$data.showMainForm = true;
          });

          GM_registerMenuCommand('数据', () => {
              this.$data.selectedTab = 3;
              this.$data.showMainForm = true;
          });


      },
      created() {
          let config = GM_getValue('config');
          if (config != undefined) {
              this.$data.config = config;
          }

          let showMainForm = GM_getValue('showMainForm');
          if (showMainForm != undefined) {
              this.$data.showMainForm = showMainForm;
          }
          let selectedTab = GM_getValue('selectedTab');
          if (selectedTab != undefined) {
              this.$data.selectedTab = selectedTab;
          }
          let isUnfolded = GM_getValue('isUnfolded');
          if (isUnfolded != undefined) {
              this.$data.isUnfolded = isUnfolded;
          }


          let icon = GM_info.script.icon;
          this.$data.imgs = { icon };

          this.scriptInfo = GM_info;
          this.refreshInterval = this.config.refreshInterval;
      },
      beforeCreate() {

      }
  };

  const _hoisted_1 = ["src"];
  const _hoisted_2 = ["src"];
  const _hoisted_3 = ["src"];
  const _hoisted_4 = ["src"];
  const _hoisted_5 = ["src"];
  const _hoisted_6 = ["src"];
  const _hoisted_7 = ["title"];
  const _hoisted_8 = ["src"];
  const _hoisted_9 = ["src"];
  const _hoisted_10 = { class: "us-tab-head us-tab-mainbgcolor" };
  const _hoisted_11 = { class: "us-tab-head-title" };
  const _hoisted_12 = ["src"];
  const _hoisted_13 = { class: "us-tab-menu-bg us-tab-mainbgcolor" };
  const _hoisted_14 = { class: "us-tab-menu" };
  const _hoisted_15 = { class: "userscript-card-bordered" };
  const _hoisted_16 = { index: "1" };
  const _hoisted_17 = { index: "2" };
  const _hoisted_18 = {
    key: 0,
    index: "3"
  };
  const _hoisted_19 = /*#__PURE__*/vue.createElementVNode("div", { class: "us-container" }, null, -1 /* HOISTED */);

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Countdown = vue.resolveComponent("Countdown");
    const _component_ProgressBar = vue.resolveComponent("ProgressBar");
    const _component_SettingsTab = vue.resolveComponent("SettingsTab");
    const _component_UserScriptInfo = vue.resolveComponent("UserScriptInfo");
    const _component_Stoage = vue.resolveComponent("Stoage");

    return (vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["us-main-form", this.showMainForm ? 'us-mask' : '']),
      style: {},
      onClick: _cache[14] || (_cache[14] = vue.withModifiers((...args) => ($options.maskClick && $options.maskClick(...args)), ["stop"]))
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["us-main-func", $options.displayPosition]),
        style: vue.normalizeStyle({ opacity: this.config.opacity / 100, display: this.config.opacity == 0 ? 'none' : '' })
      }, [
        vue.withDirectives(vue.createElementVNode("div", {
          class: vue.normalizeClass(["userscript-countdown-label", $options.displayPosition]),
          style: vue.normalizeStyle($options.displayPosition=='bottom'?'bottom:'+this.config.height+'px':'top:'+this.config.height+'px')
        }, [
          vue.withDirectives(vue.createElementVNode("button", {
            title: "收缩 ",
            class: "userscript-button",
            onClick: _cache[0] || (_cache[0] = vue.withModifiers($event => (this.isUnfolded = false), ["stop"]))
          }, [
            vue.createElementVNode("img", {
              src: this.imgs.left
            }, null, 8 /* PROPS */, _hoisted_1)
          ], 512 /* NEED_PATCH */), [
            [vue.vShow, this.isUnfolded]
          ]),
          vue.withDirectives(vue.createElementVNode("span", null, [
            vue.createElementVNode("button", {
              title: "主菜单   ",
              class: "userscript-button",
              onClick: _cache[1] || (_cache[1] = vue.withModifiers($event => (this.showMainForm = !this.showMainForm), ["stop"]))
            }, [
              vue.createElementVNode("img", {
                src: this.imgs.menu
              }, null, 8 /* PROPS */, _hoisted_2)
            ]),
            vue.withDirectives(vue.createElementVNode("button", {
              title: "全屏   ",
              class: "userscript-button",
              onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => ($options.fullScreen && $options.fullScreen(...args)), ["stop"]))
            }, [
              vue.createElementVNode("img", {
                src: this.imgs.fullScreen
              }, null, 8 /* PROPS */, _hoisted_3)
            ], 512 /* NEED_PATCH */), [
              [vue.vShow, !this.enableFullScreen]
            ]),
            vue.withDirectives(vue.createElementVNode("button", {
              title: "退出全屏   ",
              class: "userscript-button",
              onClick: _cache[3] || (_cache[3] = vue.withModifiers((...args) => ($options.cancelFullScreen && $options.cancelFullScreen(...args)), ["stop"]))
            }, [
              vue.createElementVNode("img", {
                src: this.imgs.cancelFullScreen
              }, null, 8 /* PROPS */, _hoisted_4)
            ], 512 /* NEED_PATCH */), [
              [vue.vShow, this.enableFullScreen]
            ]),
            vue.createElementVNode("button", {
              title: "重置计时   ",
              class: "userscript-button",
              onClick: _cache[4] || (_cache[4] = vue.withModifiers((...args) => ($options.reset && $options.reset(...args)), ["stop"]))
            }, [
              vue.createElementVNode("img", {
                src: this.imgs.reset
              }, null, 8 /* PROPS */, _hoisted_5)
            ])
          ], 512 /* NEED_PATCH */), [
            [vue.vShow, this.isUnfolded]
          ]),
          vue.withDirectives(vue.createElementVNode("button", {
            title: "展开 ",
            class: "userscript-button",
            onClick: _cache[5] || (_cache[5] = vue.withModifiers($event => (this.isUnfolded = true), ["stop"]))
          }, [
            vue.createElementVNode("img", {
              src: this.imgs.right
            }, null, 8 /* PROPS */, _hoisted_6)
          ], 512 /* NEED_PATCH */), [
            [vue.vShow, !this.isUnfolded]
          ]),
          vue.createElementVNode("button", {
            title: this.startCounting ? '暂停倒计时' : '开始倒计时',
            class: "userscript-button",
            onClick: _cache[6] || (_cache[6] = vue.withModifiers((...args) => ($options.startOrStop && $options.startOrStop(...args)), ["stop"]))
          }, [
            (this.startCounting)
              ? (vue.openBlock(), vue.createElementBlock("img", {
                  key: 0,
                  src: this.imgs.suspend
                }, null, 8 /* PROPS */, _hoisted_8))
              : (vue.openBlock(), vue.createElementBlock("img", {
                  key: 1,
                  src: this.imgs.running
                }, null, 8 /* PROPS */, _hoisted_9))
          ], 8 /* PROPS */, _hoisted_7),
          vue.createTextVNode(" " + vue.toDisplayString(this.config.label || '刷新倒计时') + " ", 1 /* TEXT */),
          vue.createVNode(_component_Countdown, {
            ref: "countdown",
            class: "",
            active: this.startCounting,
            duration: $options.interval,
            onTimeElapsedChanged: $options.precentIncrease,
            onEndOfCountdown: $options.reload
          }, null, 8 /* PROPS */, ["active", "duration", "onTimeElapsedChanged", "onEndOfCountdown"])
        ], 6 /* CLASS, STYLE */), [
          [vue.vShow, this.config.showTimeElapsed]
        ]),
        vue.createVNode(_component_ProgressBar, {
          "tranislation-time": $options.tranislationTime,
          style: vue.normalizeStyle({ height: this.config.height + 'px', lineHeight: this.config.height + 'px', 'font-size': this.config.height + 'px' }),
          class: vue.normalizeClass($options.displayPosition),
          position: this.config.position,
          precent: $data.precent,
          themeColor: this.config.themeColor,
          showPrecent: this.config.showPrecent,
          showProgressBar: this.config.showProgressBar
        }, null, 8 /* PROPS */, ["tranislation-time", "style", "class", "position", "precent", "themeColor", "showPrecent", "showProgressBar"])
      ], 6 /* CLASS, STYLE */),
      vue.createVNode(vue.Transition, { persisted: "" }, {
        default: vue.withCtx(() => [
          vue.withDirectives(vue.createElementVNode("div", {
            class: "us-tab-container",
            onClick: _cache[13] || (_cache[13] = vue.withModifiers(() => {}, ["stop"]))
          }, [
            vue.createElementVNode("div", _hoisted_10, [
              vue.createElementVNode("div", _hoisted_11, vue.toDisplayString(this.scriptInfo.script.name) + "-脚本设置 ", 1 /* TEXT */),
              vue.createElementVNode("img", {
                class: "us-close",
                onClick: _cache[7] || (_cache[7] = (...args) => ($options.maskClick && $options.maskClick(...args))),
                src: this.imgs.close,
                title: "关闭"
              }, null, 8 /* PROPS */, _hoisted_12)
            ]),
            vue.createElementVNode("div", _hoisted_13, [
              vue.createElementVNode("div", _hoisted_14, [
                vue.createElementVNode("button", {
                  index: "1",
                  onClick: _cache[8] || (_cache[8] = $event => (this.selectedTab = 1)),
                  class: vue.normalizeClass(this.selectedTab == 1 ? 'us-seleted' : '')
                }, "⚙️设置", 2 /* CLASS */),
                vue.createElementVNode("button", {
                  index: "2",
                  onClick: _cache[9] || (_cache[9] = $event => (this.selectedTab = 2)),
                  class: vue.normalizeClass(this.selectedTab == 2 ? 'us-seleted' : '')
                }, "🪧关于", 2 /* CLASS */),
                vue.createElementVNode("button", {
                  index: "3",
                  onClick: _cache[10] || (_cache[10] = $event => (this.selectedTab = 3)),
                  class: vue.normalizeClass(this.selectedTab == 3 ? 'us-seleted' : '')
                }, "📄数据", 2 /* CLASS */)
              ])
            ]),
            vue.createElementVNode("div", _hoisted_15, [
              vue.withDirectives(vue.createElementVNode("div", _hoisted_16, [
                vue.createVNode(_component_SettingsTab, {
                  countdown: this.$refs.countdown?.countDown,
                  config: this.config,
                  startCounting: this.startCounting,
                  onStart: _cache[11] || (_cache[11] = $event => (this.startCounting = true)),
                  onReset: $options.reset,
                  onSuspend: _cache[12] || (_cache[12] = $event => (this.startCounting = false))
                }, null, 8 /* PROPS */, ["countdown", "config", "startCounting", "onReset"])
              ], 512 /* NEED_PATCH */), [
                [vue.vShow, this.selectedTab == 1]
              ]),
              vue.withDirectives(vue.createElementVNode("div", _hoisted_17, [
                vue.createVNode(_component_UserScriptInfo)
              ], 512 /* NEED_PATCH */), [
                [vue.vShow, this.selectedTab == 2]
              ]),
              (this.selectedTab == 3)
                ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18, [
                    vue.createVNode(_component_Stoage)
                  ]))
                : vue.createCommentVNode("v-if", true)
            ])
          ], 512 /* NEED_PATCH */), [
            [vue.vShow, this.showMainForm]
          ])
        ]),
        _: 1 /* STABLE */
      }),
      _hoisted_19
    ], 2 /* CLASS */))
  }

  var css_248z = "\n.us-tab-head-title {\r\n    color: #676767;\r\n    text-align: center;\r\n\r\n    box-shadow: 0 1px 2px rgba(0, 0, 0, .2);\n}\n.us-tab-mainbgcolor {\r\n    background-color: rgba(220, 220, 220, 0.492);\n}\n.us-tab-head {\r\n    grid-column-start: 1;\r\n    grid-column-end: 3;\r\n    grid-row: 1;\r\n    position: relative;\n}\n.us-tab-head-title {\r\n    line-height: 30px;\r\n    text-align: center;\n}\n.us-tab-head img {\r\n    vertical-align: middle;\r\n    width: 20px;\r\n    height: 20px;\n}\n.us-tab-head .us-close {\r\n\r\n    position: absolute;\r\n    opacity: 0.7;\r\n    cursor: pointer;\r\n    top: 5px;\r\n    right: 5px;\n}\n.us-mask {\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100%;\n}\n.v-enter-active,\r\n.v-leave-active {\r\n    transition: opacity 0.1s ease;\n}\n.v-enter-from,\r\n.v-leave-to {\r\n    opacity: 0;\n}\n.us-tab-menu-bg {\r\n    grid-column: 1;\r\n    grid-row: 2;\r\n    width: 100%;\r\n    height: 100%;\n}\n.us-seleted {\r\n    color: #078fff !important;\n}\n.us-main-func {\r\n\r\n    position: fixed;\r\n    z-index: 999999999;\r\n    left: 0px;\r\n    transition: opacity 1s;\r\n    width: 100%;\r\n    margin: 2px 0px;\n}\n.us-main-func button:hover {\r\n    opacity: 1;\n}\n.us-main-func img {\r\n    overflow: hidden;\r\n    display: inline-flex;\r\n    text-align: center;\r\n    width: 100%;\r\n    vertical-align: middle;\r\n    line-height: 0 !important;\n}\n.us-main-func button {\r\n    opacity: 0.6;\r\n    width: 20px;\r\n    height: auto;\r\n    padding: 1px !important;\r\n    line-height: 0 !important;\n}\n.us-tab-container {\r\n    z-index: 999999999;\r\n    position: fixed;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    top: 0;\r\n    margin: auto;\r\n    display: grid;\r\n    max-width: 700px;\r\n    max-height: 500px;\r\n    grid-template-columns: 120px auto;\r\n    grid-template-rows: 30px auto;\r\n    backdrop-filter: blur(5px);\r\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);\r\n    border: 1px solid rgb(233, 233, 233);\r\n    background-color: rgba(255, 255, 255, 0.9);\r\n    border-radius: 3px;\n}\n.us-tab-menu {\r\n\r\n    margin-top: 15px;\r\n    position: relative;\n}\n.us-tab-menu button {\r\n    width: 100%;\r\n    border-width: 0px !important;\r\n    background: none !important;\r\n    padding: 10px !important;\r\n    margin: 0 !important;\n}\n.userscript-card-bordered {\r\n    text-align: left;\r\n    padding: 20px;\r\n    grid-column: 2;\r\n    grid-row: 2;\r\n    overflow-y: scroll;\r\n    overflow-x: hidden;\n}\n.userscript-countdown-label {\r\n    position: absolute;\r\n    background-color: rgba(255, 255, 255, 0.5);\r\n    backdrop-filter: blur(1px);\r\n    border-radius: 3px;\r\n    left: 2px;\r\n    box-shadow: 0 10px 20px rgba(0, 0, 0, .2);\r\n    padding: 0 2px;\r\n    font-weight: 400;\r\n    margin: 1px;\r\n    border-style: solid;\r\n    border-width: 0px;\r\n    display: inline-block;\r\n    font-size: 12px;\r\n    line-height: 20px;\r\n    color: black;\n}\n.us-container .top {\r\n    position: fixed;\r\n    top: 10px;\n}\n.us-container .bottom {\r\n    position: fixed;\r\n    bottom: 10px;\n}\n.bottom {\r\n    bottom: 0;\n}\n.top {\r\n    top: 0;\n}\n.us-main-form button {\r\n    margin: 1px;\r\n    padding: 0 14px;\r\n    font-weight: 400;\r\n    border-style: solid;\r\n    border-width: 1px;\r\n    border-radius: 3px;\r\n    cursor: pointer;\r\n    line-height: 2;\r\n    background-color: white;\r\n    border-color: rgb(218, 216, 216);\r\n    color: rgb(0, 0, 0);\r\n    transition: color 0.3s, background-color 0.3s, border-color 0.3s;\n}\n.userscript-button:hover,\r\n.us-tab-menu button:hover {\r\n    color: #42A9FF;\r\n    border-color: #42A9FF;\n}\n.us-tab-menu button:hover {\r\n    background-color: #42aaff70 !important;\n}\r\n";
  styleInject(css_248z);

  script.render = render;
  script.__file = "src/app.vue";

  function mount() {
    const appDom = VM.hm("div", {
      id: "userscript-app"
    });
    document.body.appendChild(appDom);
    const app = Vue.createApp(script);
    app.config.errorHandler = (err, instance, info) => {
      console.error(err);
      // 向追踪服务报告错误
      var date = new Date().toLocaleString();
      let errors = GM_getValue("errors");
      if (errors == undefined) {
        GM_setValue("errors", [{
          date,
          err,
          info
        }]);
      } else {
        errors.push({
          date,
          err,
          info
        });
        GM_setValue("errors", errors);
      }
    };
    app.mount(appDom);
  }
  function startUp() {
    try {
      var int = window.setTimeout(function () {
        mount();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  }

  startUp();

})(VM, Vue, vue);
/*  */
