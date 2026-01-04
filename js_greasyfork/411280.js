// ==UserScript==
// @name        H2P: notify util
// @namespace   http://tampermonkey.net/
// @version     0.1.0
// @description 通知栏
// @author      H2P
// @compatible  chrome
// ==/UserScript==

((w) => {
  'use strict';

  const $H2P = (xpath = 'body', queryOneElement = true) => queryOneElement ? document.querySelector(xpath) : Array.from(document.querySelectorAll(xpath));

  const style_notify = document.createElement('style');
  style_notify.id = 'h2p-style-notify';
  style_notify.innerHTML = `
    #h2p-div-notify-container {
      position: fixed;
      width: 280px;
      bottom: 20px;
      right: 20px;
      overflow: hidden;
      z-index: 9999;
    }

    .h2p-div-notify-item-container {
      position: relative;
      width: 250px;
      height: 25px;
      right: -280px;
      padding: 9px 13px;
      margin: 6px 0;
      border: 1px solid;
      border-radius: 5px;
      display: flex;
      align-items: center;
      transition: left 1.5s, right 1.5s;
    }

    .h2p-div-notify-item-container-in {
      right: 0;
    }

    .h2p-div-notify-item {
      width: 235px;
      height: 25px;
      margin-right: 5px;
      display: flex;
      align-items: center;
    }

    .h2p-div-notify-close {
      cursor: pointer;
    }
    .h2p-div-notify-close::before, .h2p-div-notify-close::after {
      position: absolute;
      content: '';
      width: 12px;
      height: 2px;
      background: chocolate;
    }
    .h2p-div-notify-close::before {
      transform: rotate(45deg);
    }
    .h2p-div-notify-close::after {
      transform: rotate(-45deg);
    }
  `;
  document.body.appendChild(style_notify);
  const div_notify = document.createElement('div');
  div_notify.id = 'h2p-div-notify-container';
  document.body.appendChild(div_notify);

  w.$notifyMgr = (() => {
    const Notify = function() {
      this.type = {
        default: {
          bgColor: '#e6ffff',
          bdColor: '#23bdd9'
        },
        success: {
          bgColor: '#f6ffec',
          bdColor: '#53752d'
        },
        warn: {
          bgColor: '#fefbe6',
          bdColor: '#fdc446'
        },
        error: {
          bgColor: '#fff0ef',
          bdColor: '#e75252'
        }
      }

      /**
       * 创建弹窗
       * @param {String} msg 显示的信息
       * @param {Object} type 弹窗类型，通过 $notifyMgr.type 设置
       * @param {Boolean} autoClose 弹窗是否自动关闭
       * @returns {String} id 返回弹窗 id
       */
      this.createNotify = ({ msg = '', type = notifyType.default, autoClose = true }) => {
        const ran = Math.floor(Math.random() * 100000000);
        const div_notify_item_container = document.createElement('div');
        div_notify_item_container.id = `h2p-div-notify-${ran}`;
        div_notify_item_container.classList.add('h2p-div-notify-item-container');
        div_notify_item_container.style.backgroundColor = type.bgColor;
        div_notify_item_container.style.borderColor = type.bdColor;
        div_notify_item_container.innerHTML = `
          <div class="h2p-div-notify-item">${msg}</div>
        `;

        const div_notify_item_close = document.createElement('div');
        div_notify_item_close.id = `h2p-div-notify-close-${ran}`;
        div_notify_item_close.classList.add('h2p-div-notify-close');
        div_notify_item_close.addEventListener('click', (e) => { this.closeNotify(`h2p-div-notify-${e.currentTarget.id.match(/[a-zA-Z\-]*(\d+)[a-zA-Z\-]*/g)[1]}`); });
        div_notify_item_container.appendChild(div_notify_item_close);

        $H2P('div#h2p-div-notify-container').appendChild(div_notify_item_container);

        setTimeout((id) => {
          // 显示通知栏
          $H2P(`#${id}`).classList.add('h2p-div-notify-item-container-in');
          autoClose && setTimeout(this.closeNotify, 4000, id);
        }, 100, div_notify_item_container.id);
        
        return div_notify_item_container.id;
      }

      /**
       * 关闭弹窗
       * @param {String} id 
       */
      this.closeNotify = (id = '') => {
        $H2P(`#${id}`).classList.remove('h2p-div-notify-item-container-in');
        setTimeout(() => {
          $H2P('div#h2p-div-notify-container').removeChild($H2P(`#${id}`));
        }, 1500);
      }
    }
    return new Notify();
  })();
})(window);