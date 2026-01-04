// ==UserScript==
// @name         ficbook.net old top notifications
// @description  Возвращает иконки обновлений в заголовок, больше не требуется лишнего клика по "колокольчику".
// @namespace    http://tampermonkey.net/
// @version      0.11
// @author       AjiTae
// @match        *://ficbook.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ficbook.net
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/451718/ficbooknet%20old%20top%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/451718/ficbooknet%20old%20top%20notifications.meta.js
// ==/UserScript==
{
  const showNews = true; // показывать новости сайта
  const showBell = false; // показывать колокольчик

  const patchNotifications = (config) => {
    const { render } = config;
    delete config.render;
    const { TopNotifications } = config.components.notifications.components;
    config.setup = () => () => {
      const vnode = render();
      const { newNews, notificationCounts: { all, important } } = vnode.props;
      const importantCounts = important;
      const siteNewsCount = showNews ? newNews : 0;

      const children = [
        createElement(TopNotifications, {
          class:'top-notifications-fixed',
          importantCounts,
          siteNewsCount
        })
      ];

      if (showBell) {
        vnode.props.newNews = 0;
        children.push(vnode);
      }

      return createElement('div', {
        class:'notifications-fixed'
      }, children);
    };
  }

  document.documentElement.insertAdjacentHTML('beforeend', `<style>
    .notifications-fixed {
      align-items: center;
      display: flex;
    }

    .top-notifications-fixed {
      display: flex;
      align-items: center;
      list-style-type: none;
      margin-bottom: 0;
      padding: 3px;
    }

    .top-notifications-fixed .important-link {
      align-items: center;
      border-radius: 3px;
      display: flex;
      font-size: 16px;
      font-weight: 700;
      margin: 4px;
      padding: 5px;
      text-decoration: none;
    }

    .top-notifications-fixed .icon {
      margin-bottom: 0;
      margin-right: 7px;
    }

    .top-notifications:empty {
      display: none;
    }
  </style>`);

  Object.assign = ((assign) => (...args) => {
    const config = args[1];
    if (config?.name === "notifications-app") {
      patchNotifications(config);
      Object.assign = assign;
    }
    return assign(...args);
  })(Object.assign);

  let Vue;
  Object.defineProperty = ((defineProperty) => (obj, key, descriptor) => {
    if (key === 'h' && obj?._?.toString().includes('__v_skip')) {
      Vue = obj;
      Object.defineProperty = defineProperty;
    }

    return defineProperty(obj, key, descriptor);
  })(Object.defineProperty);

  function createElement(...args) {
    return Vue.h(...args);
  }
};