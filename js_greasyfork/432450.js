// ==UserScript==
// @name         チャンネル登録
// @namespace    あ
// @version      5.0
// @description  チャンネル登録偽造
// @author       GSRHackZ
// @match        https://www.submenow.com/aiomarket.html?idPlan=8
// @match        https://www.submenow.com/aiomarket.html?idPlan=6
// @match        https://www.submenow.com/aiomarket.html?idPlan=5
// @match        https://subscribers.tube/aiomarket.html?idPlan=6
// @match        https://subscribers.tube/aiomarket.html?idPlan=5
// @match        https://www.subscribers.video/aiomarket.html?idPlan=5
// @match        https://www.subscribers.video/aiomarket.html?idPlan=6
// @require      https://greasyfork.org/scripts/372672-everything-hook/code/Everything-Hook.js?version=784972
// @grant        none
// @icon         https://image.flaticon.com/icons/svg/402/402281.svg
// @downloadURL https://update.greasyfork.org/scripts/432450/%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB%E7%99%BB%E9%8C%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/432450/%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB%E7%99%BB%E9%8C%B2.meta.js
// ==/UserScript==
document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    window.isDOMLoaded = true;
  }
});
 
~(function (global) {
  const workerURLs = [];
  const extraElements = [];
 
  const helper = function (eHookContext, timerContext, util) {
    return {
      applyUI() {
        const style = '._th-container ._th-item{margin-bottom:3px;position:relative;width:30px;height:30px;cursor:pointer;opacity:.3;background-color:coral;border-radius:100%;text-align:center;line-height:30px;-webkit-transition:all .35s;-o-transition:all .35s;transition:all .35s;right:30px}._th-container ._th-item._item-x2{margin-left:18px;width:40px;height:40px;line-height:40px}._th-container ._th-item._item-x-2{margin-left:17px;width:38px;height:38px;line-height:38px}._th-container ._th-item._item-x4{width:36px;height:36px;margin-left:16px;line-height:36px}._th-container ._th-item._item-x-4{width:32px;height:32px;line-height:32px;margin-left:14px}._th-container ._th-item._item-reset{width:30px;line-height:30px;height:30px;margin-left:10px}._th-click-hover{position:relative;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;height:50px;width:50px;cursor:pointer;opacity:.3;border-radius:100%;background-color:coral;text-align:center;line-height:50px;right:0}._th-container:hover{left:-10px}._th-container{font-size:12px;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;left:-40px;top:20%;position:fixed;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:100000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}._th-container ._th-item:hover{opacity:.8;background-color:#5fb492;color:aliceblue}._th-container ._th-item:active{opacity:.9;background-color:#316347;color:aliceblue}._th-container:hover ._th-click-hover{opacity:.8}._th-container:hover ._th-item{opacity:.6;right:0}._th-container ._th-click-hover:hover{opacity:.8;background-color:#5fb492;color:aliceblue}._th_cover-all-show-times{position:fixed;top:0;right:0;width:100%;height:100%;z-index:99999;opacity:1;font-weight:900;font-size:30px;color:#4f4f4f;background-color:rgba(0,0,0,0.1)}._th_cover-all-show-times._th_hidden{z-index:-99999;opacity:0;-webkit-transition:1s all;-o-transition:1s all;transition:1s all}._th_cover-all-show-times ._th_times{width:300px;height:300px;border-radius:50%;background-color:rgba(127,255,212,0.51);text-align:center;line-height:300px;position:absolute;top:50%;right:50%;margin-top:-150px;margin-right:-150px;}';
 
        const html = `${'<div class="_th-container">\n'
                    + '    <div class="_th-click-hover" onclick="changeTime()">\n'
                    + '        x'}${1 / timerContext._percentage}\n`
                    + '    </div>\n'
                    + '    <div class="_th-item _item-x2" onclick="changeTime(2,0,true)">&gt;</div>\n'
                    + '    <div class="_th-item _item-x-2" onclick="changeTime(-2,0,true)">&lt;</div>\n'
                    + '    <div class="_th-item _item-x4" onclick="changeTime(0,4)">&gt;&gt;</div>\n'
                    + '    <div class="_th-item _item-x-4" onclick="changeTime(0,-4)">&lt;&lt;</div>\n'
                    + '    <div class="_th-item _item-reset" onclick="changeTime(0,0,false,true)">O</div>\n'
                    + '</div>\n'
                    + '<div class="_th_cover-all-show-times _th_hidden">\n'
                    + `    <div class="_th_times">x${1 / timerContext._percentage}</div>\n`
                    + '</div>'
                    + '';
        const stylenode = document.createElement('style');
        stylenode.setAttribute('type', 'text/css');
        if (stylenode.styleSheet) { // IE
          stylenode.styleSheet.cssText = style;
        } else { // w3c
          const cssText = document.createTextNode(style);
          stylenode.appendChild(cssText);
        }
        const node = document.createElement('div');
        node.innerHTML = html;
        if (!global.isDOMLoaded) {
          document.addEventListener('readystatechange', () => {
            if ((document.readyState === 'interactive' || document.readyState === 'complete') && !global.isDOMRendered) {
              document.head.appendChild(stylenode);
              document.body.appendChild(node);
              global.isDOMRendered = true;
              console.log('Time Hooker Works!');
            }
          });
        } else {
          document.head.appendChild(stylenode);
          document.body.appendChild(node);
          global.isDOMRendered = true;
          console.log('Time Hooker Works!');
        }
      },
      applyGlobalAction(timer) {
        timer.changeTime = function (anum, cnum, isa, isr) {
          if (isr) {
            global.timer.change(1);
            return;
          }
          if (!global.timer) {
            return;
          }
          let result;
          if (!anum && !cnum) {
            const t = prompt(`Enter the desired speed change rate：${1 / timerContext._percentage}）`);
            if (t == null) {
              return;
            }
            if (isNaN(parseFloat(t))) {
              alert('Please enter a number!!');
              timer.changeTime();
              return;
            }
            if (parseFloat(t) <= 0) {
              alert('Change cannot be less than or more than 0!!');
              timer.changeTime();
              return;
            }
            result = 1 / parseFloat(t);
          } else if (isa && anum) {
            if (1 / timerContext._percentage <= 1 && anum < 0) {
              return;
            }
            result = 1 / (1 / timerContext._percentage + anum);
          } else {
            if (cnum < 0) {
              cnum = 1 / -cnum;
            }
            result = 1 / ((1 / timerContext._percentage) * cnum);
          }
          timer.change(result);
        };
        global.changeTime = timer.changeTime;
      },
      applyHooking() {
        eHookContext.hookReplace(window, 'setInterval', (setInterval) => function () {
          arguments[2] = arguments[1];
 
          arguments[1] *= timerContext._percentage;
          const resultId = setInterval.apply(window, arguments);
 
          timerContext._intervalIds[resultId] = {
            args: arguments,
            nowId: resultId,
          };
          return resultId;
        });
 
        eHookContext.hookBefore(window, 'clearInterval', (method, args) => {
          const id = args[0];
          if (timerContext._intervalIds[id]) {
            args[0] = timerContext._intervalIds[id].nowId;
          }
 
          delete timerContext._intervalIds[id];
        });
 
        eHookContext.hookBefore(window, 'clearTimeout', (method, args) => {
          const id = args[0];
          if (timerContext._intervalIds[id]) {
            args[0] = timerContext._intervalIds[id].nowId;
          }
 
          delete timerContext._intervalIds[id];
        });
 
        eHookContext.hookBefore(window, 'setTimeout', (method, args) => {
          args[1] *= timerContext._percentage;
        });
        const newFunc = this.getHookedDateConstructor();
        eHookContext.hookClass(window, 'Date', newFunc, '_innerDate', ['now']);
        Date.now = function () {
          return new Date().getTime();
        };
        eHookContext.hookedToString(timerContext._Date.now, Date.now);
        const objToString = Object.prototype.toString;
 
        eHookContext.hookAfter(Object.prototype, 'toString', function (m, args, result) {
          if (this instanceof timerContext._mDate) {
            return '[object Date]';
          }
          return result;
        }, false);
 
        eHookContext.hookedToString(objToString, Object.prototype.toString);
        eHookContext.hookedToString(timerContext._setInterval, setInterval);
        eHookContext.hookedToString(timerContext._setTimeout, setTimeout);
        eHookContext.hookedToString(timerContext._clearInterval, clearInterval);
        timerContext._mDate = window.Date;
        this.hookShadowRoot();
      },
      getHookedDateConstructor() {
        return function () {
          if (arguments.length === 1) {
            Object.defineProperty(this, '_innerDate', {
              configurable: false,
              enumerable: false,
              value: new timerContext._Date(arguments[0]),
              writable: false,
            });
            return;
          } if (arguments.length > 1) {
            let definedValue;
            switch (arguments.length) {
              case 2:
                definedValue = new timerContext._Date(
                  arguments[0],
                  arguments[1],
                );
                break;
              case 3:
                definedValue = new timerContext._Date(
                  arguments[0],
                  arguments[1],
                  arguments[2],
                );
                break;
              case 4:
                definedValue = new timerContext._Date(
                  arguments[0],
                  arguments[1],
                  arguments[2],
                  arguments[3],
                );
                break;
              case 5:
                definedValue = new timerContext._Date(
                  arguments[0],
                  arguments[1],
                  arguments[2],
                  arguments[3],
                  arguments[4],
                );
                break;
              case 6:
                definedValue = new timerContext._Date(
                  arguments[0],
                  arguments[1],
                  arguments[2],
                  arguments[3],
                  arguments[4],
                  arguments[5],
                );
                break;
              default:
              case 7:
                definedValue = new timerContext._Date(
                  arguments[0],
                  arguments[1],
                  arguments[2],
                  arguments[3],
                  arguments[4],
                  arguments[5],
                  arguments[6],
                );
                break;
            }
 
            Object.defineProperty(this, '_innerDate', {
              configurable: false,
              enumerable: false,
              value: definedValue,
              writable: false,
            });
            return;
          }
          const now = timerContext._Date.now();
          const passTime = now - timerContext.__lastDatetime;
          const hookPassTime = passTime * (1 / timerContext._percentage);
          // console.log(__this.__lastDatetime + hookPassTime, now,__this.__lastDatetime + hookPassTime - now);
          Object.defineProperty(this, '_innerDate', {
            configurable: false,
            enumerable: false,
            value: new timerContext._Date(timerContext.__lastMDatetime + hookPassTime),
            writable: false,
          });
        };
      },
      registerShortcutKeys(timer) {
        addEventListener('keydown', (e) => {
          switch (e.keyCode) {
            // [=]
            case 190:
            case 187: {
              if (e.ctrlKey) {
                // console.log('+2');
                timer.changeTime(2, 0, true);
              } else if (e.altKey) {
                // console.log('x4');
                timer.changeTime(0, 4);
              }
              break;
            }
            // [-]
            case 188:
            case 189: {
              if (e.ctrlKey) {
                // console.log('-2');
                timer.changeTime(-2, 0, true);
              } else if (e.altKey) {
                // console.log('x-4');
                timer.changeTime(0, -4);
              }
              break;
            }
            // [0]
            case 48: {
              if (e.ctrlKey || e.altKey) {
                // console.log('reset');
                timer.changeTime(0, 0, false, true);
              }
              break;
            }
            default:
                        // console.log(e);
          }
        });
      },
 
      percentageChangeHandler(percentage) {
        util.ergodicObject(timerContext, timerContext._intervalIds, function (idObj, id) {
          idObj.args[1] = Math.floor(idObj.args[2] * percentage);
 
          this._clearInterval.call(window, idObj.nowId);
 
          idObj.nowId = this._setInterval.apply(window, idObj.args);
        });
      },
      hookShadowRoot() {
        const origin = Element.prototype.attachShadow;
        eHookContext.hookAfter(Element.prototype, 'attachShadow',
          (m, args, result) => {
            extraElements.push(result);
            return result;
          }, false);
        eHookContext.hookedToString(origin, Element.prototype.attachShadow);
      },
    };
  };
 
  const normalUtil = {
    isInIframe() {
      let is = global.parent !== global;
      try {
        is = is && global.parent.document.body.tagName !== 'FRAMESET';
      } catch (e) {
 
      }
      return is;
    },
    listenParentEvent(handler) {
      global.addEventListener('message', (e) => {
        const { data } = e;
        const type = data.type || '';
        if (type === 'changePercentage') {
          handler(data.percentage || 0);
        }
      });
    },
    sentChangesToIframe(percentage) {
      const iframes = document.querySelectorAll('iframe') || [];
      const frames = document.querySelectorAll('frame');
      if (iframes.length) {
        for (let i = 0; i < iframes.length; i++) {
          iframes[i].contentWindow.postMessage(
            { type: 'changePercentage', percentage }, '*',
          );
        }
      }
      if (frames.length) {
        for (let j = 0; j < frames.length; j++) {
          frames[j].contentWindow.postMessage(
            { type: 'changePercentage', percentage }, '*',
          );
        }
      }
    },
  };
 
  var querySelectorAll = function (ele, selector, includeExtra) {
    let elements = ele.querySelectorAll(selector);
    elements = Array.prototype.slice.call(elements || []);
    if (includeExtra) {
      extraElements.forEach((element) => {
        elements = elements.concat(querySelectorAll(element, selector, false));
      });
    }
    return elements;
  };
 
  const generate = function () {
    return function (util) {
      workerURLs.forEach((url) => {
        if (util.urlMatching(location.href, `http.*://.*${url}.*`)) {
          window.Worker = undefined;
          console.log('Worker disabled');
        }
      });
      const eHookContext = this;
      const timerHooker = {
 
        _intervalIds: {},
 
        __percentage: 1.0,
 
        _setInterval: window.setInterval,
        _clearInterval: window.clearInterval,
        _clearTimeout: window.clearTimeout,
        _setTimeout: window.setTimeout,
        _Date: window.Date,
        __lastDatetime: new Date().getTime(),
        __lastMDatetime: new Date().getTime(),
        videoSpeedInterval: 1000,
 
        init() {
          const timerContext = this;
          const h = helper(eHookContext, timerContext, util);
 
          h.applyHooking();
 
          Object.defineProperty(timerContext, '_percentage', {
            get() {
              return timerContext.__percentage;
            },
            set(percentage) {
              if (percentage === timerContext.__percentage) {
                return percentage;
              }
              h.percentageChangeHandler(percentage);
              timerContext.__percentage = percentage;
              return percentage;
            },
          });
 
          if (!normalUtil.isInIframe()) {
            console.log('[TimeHooker]', 'loading outer window...');
            h.applyUI();
            h.applyGlobalAction(timerContext);
            h.registerShortcutKeys(timerContext);
          } else {
            console.log('[TimeHooker]', 'loading inner window...');
            normalUtil.listenParentEvent((percentage) => {
              console.log('[TimeHooker]', 'Inner Changed', percentage);
              this.change(percentage);
            });
          }
        },
 
        change(percentage) {
          const _this = this;
          this.__lastMDatetime = this._mDate.now();
          this.__lastDatetime = this._Date.now();
          this._percentage = percentage;
          const oldNode = document.getElementsByClassName('_th-click-hover');
          const oldNode1 = document.getElementsByClassName('_th_times');
          (oldNode[0] || {}).innerHTML = `x${1 / this._percentage}`;
          (oldNode1[0] || {}).innerHTML = `x${1 / this._percentage}`;
          const a = document.getElementsByClassName('_th_cover-all-show-times')[0] || {};
          a.className = '_th_cover-all-show-times';
          this._setTimeout.bind(window)(() => {
            a.className = '_th_cover-all-show-times _th_hidden';
          }, 100);
          this.changeVideoSpeed();
          this._clearInterval.bind(window)(this.videoSpeedIntervalId);
          this.videoSpeedIntervalId = this._setInterval.bind(window)(() => {
            _this.changeVideoSpeed();
            const rate = 1 / _this._percentage;
            if (rate === 1) {
              _this._clearInterval.bind(window)(_this.videoSpeedIntervalId);
            }
          }, this.videoSpeedInterval);
          normalUtil.sentChangesToIframe(percentage);
        },
        changeVideoSpeed() {
          let rate = 1 / this._percentage;
          rate > 16 && (rate = 16);
          rate < 0.065 && (rate = 0.065);
 
          const videos = querySelectorAll(document, 'video', true) || [];
          if (videos.length) {
            for (let i = 0; i < videos.length; i++) {
              videos[i].playbackRate = rate;
            }
          }
        },
      };
 
      timerHooker.init();
      return timerHooker;
    };
  };
 
  if (global.eHook) {
    global.eHook.plugins({
      name: 'timer',
 
      mount: generate(),
    });
  }
}(window));
const x = 0;
window.onload = function () {
  if (!window.location.hash) {
    window.location += '#loaded';
    alert('Steps Of Usage:1st: Don\'t close the videos in order for it to count it and so that the code doesn\'t crash  2nd:No need to click on anything Just wait, it will do everything for you 3: I have made this faster using TimerHooker, so you need to install Timer Hooker along with this in order for it to work!!!');
  }
  setTimeout(() => {
    document.getElementsByClassName('greenButton button')[0].click();
  }, 200);
  setTimeout(() => {
    document.getElementsByClassName('_th-item _item-x4')[0].click();
  }, 200);
  setTimeout(() => {
    document.getElementsByClassName('_th-item _item-x4')[0].click();
  }, 200);
  setTimeout(() => {
    document.getElementsByClassName('_th-item _item-x4')[0].click();
  }, 200);
  setTimeout(() => {
    document.getElementsByClassName('buttonOrange button')[0].click();
  }, 900);
  window.onerror = function (error) {
    alert('There was an error, Don\'t Worry... Im Fixing It!!! 😊    It could be that you need to allow pop ups since this website requires them, or that you need to install TimerHooker.If redirected to timerHooker, you need to install it to fix the error!!........ALSO REMINDER, YOU NEED TO STAY ON WEBSITE IN ORDER FOR CODE TO RUN!!');
  };
};