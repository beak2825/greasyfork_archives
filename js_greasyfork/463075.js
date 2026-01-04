// ==UserScript==
// @name               Redirect to zh-tw version of Moegirlpedia or Wikipedia
// @name:zh-TW         跳轉至台灣正體版的萌娘百科或維基百科
// @name:ja            萌えっ娘百科事典とウィキペディアで台湾正体版にリダイレクト
// @description        Redirect to zh-tw version page of Mandarin Moegirlpedia or Mandarin Wikipedia
// @description:zh-TW  跳轉至華文萌娘百科或華文維基百科的台灣正體版頁面
// @description:ja     華文版の萌えっ娘百科事典と華文版のウィキペディアで台湾正体版のページにリダイレクトするユーザースクリプトです
// @namespace          pediazhtw
// @version            1.0.1
// @match              https://zh.moegirl.org.cn/*
// @match              https://zh.wikipedia.org/*
// @match              https://zh.m.wikipedia.org/*
// @run-at             document-start
// @author             lazy fox chan
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/463075/Redirect%20to%20zh-tw%20version%20of%20Moegirlpedia%20or%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/463075/Redirect%20to%20zh-tw%20version%20of%20Moegirlpedia%20or%20Wikipedia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const target = "zh-tw";
    const regExpSubDir = /(\/wiki\/|\/zh\/|\/zh-hans\/|\/zh-hant\/|\/zh-cn\/|\/zh-hk\/|\/zh-mo\/|\/zh-my\/|\/zh-sg\/)/g;
    const targetSubDir = "/zh-tw/";
    const regExpGetParam = /variant=(zh(?!(-hans|-hant|-cn|-hk|-mo|-my|-sg|-tw))|zh-hans|zh-hant|zh-cn|zh-hk|zh-mo|zh-my|zh-sg)/g;
    const targetGetParam = "variant=zh-tw";

    // Get the current URL
    var currentUrl = window.location.href;

    // If already on zh-tw page and not inculude other language codes in URL, do nothing
    if (regExpSubDir.test(currentUrl) || regExpGetParam.test(currentUrl) || currentUrl.indexOf(target) === -1) {

        // Replace other language codes to zh-tw
        var newUrl = currentUrl.replace(regExpSubDir, targetSubDir).replace(regExpGetParam, targetGetParam);

        // If not inculude language codes in URL, Add GET parameter to URL
        if (newUrl.indexOf(targetSubDir) === -1 && newUrl.indexOf(targetGetParam) === -1) {
          if (newUrl.indexOf("?") === -1) {
            newUrl = newUrl + "?" + targetGetParam;
          }else{
            newUrl = newUrl + "&" + targetGetParam;
          }
        }

        // Redirect
        window.location.replace(newUrl);

    }
})();
