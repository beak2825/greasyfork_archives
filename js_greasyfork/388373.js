// ==UserScript==
// @name         斗鱼免登陆
// @namespace    https://greasyfork.org/
// @version      1.0.1
// @description  斗鱼免登陆看蓝光，需切换到html5播放器。
// @author       smzh369
// @match        *://www.douyu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.5.0.min.js
// @license      GPL V3
// @downloadURL https://update.greasyfork.org/scripts/388373/%E6%96%97%E9%B1%BC%E5%85%8D%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/388373/%E6%96%97%E9%B1%BC%E5%85%8D%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==
(function() {
  $(document).ready(function(){
    var storage=window.localStorage;
    var recordTime = storage.getItem('rateRecordTime_h5p_room');
    var recordObj = JSON.parse(recordTime);
    console.log(recordObj);
    recordObj.v = -888888;
    recordTime = JSON.stringify(recordObj);
    storage.setItem('rateRecordTime_h5p_room',recordTime);
  });
})();