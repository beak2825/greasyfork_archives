// ==UserScript==
// @name         CommonUtils
// @name:zh-CN   CommonUtils
// @name:en      CommonUtils
// @description  通用工具。
// @description:zh-CN  通用工具。
// @description:en  Common Utils.
// @namespace    https://greasyfork.org/zh-CN/users/331591
// @version      1.0.1
// @author       Hale Shaw
// @homepage     https://greasyfork.org/zh-CN/scripts/398010
// @supportURL   https://greasyfork.org/zh-CN/scripts/398010/feedback
// @icon         https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png
// @match        https://greasyfork.org/*
// @license      AGPL-3.0-or-later
// @compatible	 Chrome
// @run-at       document-idle
// @grant        none
// ==/UserScript==

/**
 * check whether the element is valid by id.
 * @param {String} id element id.
 */
function isValidById(id) {
  if (document.getElementById(id)) {
    return true;
  } else {
    return false;
  }
}

/**
 * check whether the element is valid by class name.
 * @param {String} className element class name.
 */
function isValidByClassName(className) {
  if (document.getElementsByClassName(className) && document.getElementsByClassName(className)[0] !== undefined) {
    return true;
  } else {
    return false;
  }
}

/**
 * 将Date转化为指定格式的String.
 * 年(y)可以用 1-4 个占位符，
 * 月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * dateFormat("yyyy-MM-dd hh:mm:ss.S", new Date()) ==> 2006-07-02 08:09:04.423
 * dateFormat("yyyy-M-d h:m:s.S", new Date())      ==> 2006-7-2 8:9:4.182
 * @param {String} fmt fotmat 格式字符串.
 * @param {Date} date Date object.
 */
function dateFormat (fmt, date) {
  var ret;
  var opt = {
    "y+": date.getFullYear().toString(),
    "M+": (date.getMonth() + 1).toString(),
    "d+": date.getDate().toString(),
    "H+": date.getHours().toString(),
    "m+": date.getMinutes().toString(),
    "s+": date.getSeconds().toString(),
    "q+": (Math.floor((date.getMonth() + 3) / 3)).toString(),
    "S": date.getMilliseconds().toString()
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (var k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    }
  }
  return fmt;
}
