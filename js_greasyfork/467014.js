// ==UserScript==
// @name         Alert remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  老师使用网络工具来攻破学生的暑假，学生必须作出回应。
// @author       kekjy
// @grant        kekjy
// @match        http://labexamen.gzhu.edu.cn/*
// @license MIT
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABpElEQVR4nO3Vv2uUQRDG8c/ebSMWqay0trATAxrUSi1S2AiWFoJYpNCgoBjURsHWJKeNRfAvsDgFixQqKdPZ2ViEiCJYBOQu8f1hEXO59713j7MUfLZ6d2a/O8vMO0OzDnin9Ku2Mjvuaw07xgSAYEVXe2indMhj92zpKJLnBhF8MDeye9hn6zbN70eRiqCw02Bra3up8BBLu1FEBxsBucXqW4csz0ULe4jorSCMuPU89boRELDMHiI6Y8V65bbCUTccc70RkaOwKLOg0IkyXa9qTjOu2LAs6NZuD86hrdTyxRNTkUqqdhXlHrngGRVEZsMpJwex9DxIZSHYclesIb65LCoHgIs66UJq6btDBZHZrPh8V6YBOX66LbOkTGckBYimBW2FVTNeuOZNyrFJ236Yl4NSy5SbVm1PDvhodqgyMledTdRlAtDzqfL9tfkwUtyaRkv9LwFj9B/w7wPycXOhqlJ0yZHKPChMi5MCiM47XhsopbVJAUHfrYbmN/EToN+02eLPfz9OYyZhFJzW1Jn3lTsxaKQjCkp52jy45r1ZvSbTb9M0d4PBozGZAAAAAElFTkSuQmCC
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/467014/Alert%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/467014/Alert%20remove.meta.js
// ==/UserScript==

(function() {
    console.log("GZHU alert running");
    var pp = document.getElementsByTagName("html");
    var scr = document.createElement("script");
    scr.language = "JavaScript";
    scr.text = "window.confirm = function(str){   return true;  }";
    pp[0].appendChild(scr);
})();