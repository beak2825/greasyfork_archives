// ==UserScript==
// @name        H2P: utils
// @namespace   http://tampermonkey.net/
// @version     0.1.1
// @description 针对 Date、localStorage 的操作
// @author      H2P
// @compatible  chrome
// ==/UserScript==

((w) => {
  'use strict';

  /**
   * 在字符串前（后）添加 0
   * @param {String} s
   * @param {Number} len 
   * @param {Boolean} isAddFront 
   */
  function add0(s = '', len = 0, isAddFront = true) {
    s = s.toString();
    while (s.length < len) { s = isAddFront ? '0' + s : s + '0'; }
    return s;
  }

  w.$util = (() => {
    function Util() {
      /**
       * 键盘按键对应的 event code
       */
      this.keyCode = {
        'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71,
        'h': 72, 'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78,
        'o': 79, 'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84,
        'u': 85, 'v': 86, 'w': 87, 'x': 88, 'y': 89, 'z': 90,
      }

      /**
       * 返回毫秒
       * @param {Number} num 
       */
      this.timeMS = (num = 0) => {
        num = Number.parseInt(num);
        return num < 946684800000 ? num * 1000 : num;
      }
  
      /**
       * localStorage 相关操作
       */
      this.LS = (() => {
        function LS() {
          this.init = (itemKey = '', itemPre = {}) => {
            let item = Object.assign({}, itemPre, this.get(itemKey));
            for (let key in item) { if (!(key in itemPre)) { delete item[key]; } }
            localStorage.removeItem(itemKey);
            localStorage.setItem(itemKey, JSON.stringify(item));
            return item;
          }
          this.set = (itemKey = '', item = {}) => { localStorage.setItem(itemKey, JSON.stringify(item)); },
          this.get = (itemKey = '') => JSON.parse(localStorage.getItem(itemKey)) || {},
          this.remove = (itemKey = '') => { localStorage.removeItem(itemKey); }
        }
        return new LS();
      })();
  
      this.HMS = (time = 0) => {
        let h = Number.parseInt(time / 3600000);
        let m = Number.parseInt(time % 3600000 / 60000);
        let s = Number.parseInt(time % 3600000 % 60000 / 1000);
        return {
          h: add0(h, 2),
          m: add0(m, 2),
          s: add0(s, 2),
        }
      }
    }
    return new Util();
  })();

  // return millisecond
  Date.prototype.$timems = Date.prototype.getTime;
  // return second
  Date.prototype.$times = function() { return Number.parseInt(this.getTime() / 1000); }
  // format time: yyyy-MM-dd hh-mm-ss
  Date.prototype.$formatTime = function() { return `${this.getFullYear()}-${add0(this.getMonth() + 1, 2)}-${add0(this.getDate(), 2)} ${add0(this.getHours(), 2)}:${add0(this.getMinutes(), 2)}:${add0(this.getSeconds(), 2)}`; }
  // format date: yyyy-MM-dd
  Date.prototype.$formatDate = function() { return `${this.getFullYear()}-${add0(this.getMonth() + 1, 2)}-${add0(this.getDate(), 2)}`; } 

  /**
   * 根据 xpath 查询元素
   * @param {String} xpath 
   * @param {Boolean} queryOneElement 
   */
  w.$H2P = (xpath = 'body', queryOneElement = true) => queryOneElement ? document.querySelector(xpath) : Array.from(document.querySelectorAll(xpath));
})(window);