// ==UserScript==
// @name            hinatazaka46-cookieutils
// @namespace       https://greasyfork.org/ja/users/1328592-naoqv
// @description	    Cookie Utility.
// @description:ja  Cookieユーティリティ
// @version         0.05
// @match           https://www.hinatazaka46.com/s/official/*
// @icon            https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @grant           none
// @license         MIT
// ==/UserScript==

const CookieUtils = {
  /*
   * 指定した名前cookieの値を返す
   * @param {string} cookieName - cookieの名前
   * @return {string} cookieValue - cookieの値
   */
  getCookie: (cookieName) => {

    if (cookieName == '' || cookieName == null) {
      console.log('CookieUtils.getCookie：引数に値を設定してください。');
    } else {
      var replace = '(?:(?:^|.*\s*)' + cookieName + '\s*\=\s*([^;]*).*$)|^.*$';
      var cookieValue = document.cookie.replace(new RegExp(replace), '$1');
      return cookieValue;
    }
  },
  /*
   * cookieを追加する
   * @param {string} cookieName - cookieの名前
   * @param {string} cookieValue - cookieの値
   * @param {number} cookieTime - cookieの有効期限(日数)
   */
  setCookie: (cookieName, cookieValue, cookieTime) => {
    var cookieDomain = location.hostname;
    var cookieTime = cookieTime ? (60 * 60 * 24) * cookieTime : '';
    if (cookieName == '' || cookieName == null) {
      console.log('CookieUtils.setCookie：引数を設定してください。')
    } else {
      document.cookie = cookieName + '=' + cookieValue + ';domain=' + cookieDomain + ';path=/;max-age=' + cookieTime;
    }
  },
  /*
   * cookieを削除する
   * @param {string} cookieName - cookieの名前
   */
  removeCookie: (cookieName) => {

    if (cookieName == '' || cookieName == null) {
      console.log('CookieUtils.removeCookie：引数を設定してください。');
    } else {
      CookieUtils.setCookie(cookieName, '', 0);
    }
  }
};
