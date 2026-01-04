// ==UserScript==
// @name        Google广告屏蔽
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      0x00
// @description 2024/2/4 14:58:03
// @license     MIT
// @icon        data:image/svg+xml;base64,PHN2ZyB0PSIxNzA3MDM1MzcxOTQwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI1NTQiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODgxIDQ0Mi40SDUxOS43djE0OC41aDIwNi40Yy04LjkgNDgtMzUuOSA4OC42LTc2LjYgMTE1LjgtMzQuNCAyMy03OC4zIDM2LjYtMTI5LjkgMzYuNi05OS45IDAtMTg0LjQtNjcuNS0yMTQuNi0xNTguMi03LjYtMjMtMTItNDcuNi0xMi03Mi45czQuNC00OS45IDEyLTcyLjljMzAuMy05MC42IDExNC44LTE1OC4xIDIxNC43LTE1OC4xIDU2LjMgMCAxMDYuOCAxOS40IDE0Ni42IDU3LjRsMTEwLTExMC4xYy02Ni41LTYyLTE1My4yLTEwMC0yNTYuNi0xMDAtMTQ5LjkgMC0yNzkuNiA4Ni0zNDIuNyAyMTEuNC0yNiA1MS44LTQwLjggMTEwLjQtNDAuOCAxNzIuNFMxNTEgNjMyLjggMTc3IDY4NC42QzI0MC4xIDgxMCAzNjkuOCA4OTYgNTE5LjcgODk2YzEwMy42IDAgMTkwLjQtMzQuNCAyNTMuOC05MyA3Mi41LTY2LjggMTE0LjQtMTY1LjIgMTE0LjQtMjgyLjEgMC0yNy4yLTIuNC01My4zLTYuOS03OC41eiIgcC1pZD0iMjU1NSI+PC9wYXRoPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/486555/Google%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/486555/Google%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function(){
  function clearAD(){
    // 查询所有class为"adsbygoogle adsbygoogle-noablate"的div元素
    //var divElements = document.querySelectorAll("adsbygoogle adsbygoogle-noablate");
    var divElements = document.getElementsByClassName("adsbygoogle adsbygoogle-noablate");

    // 遍历每个div元素并删除
    for (var i = 0; i < divElements.length; i++) {
      var element = divElements[i];
      element.parentNode.removeChild(element); // 从父节点中移除该元素
    }
  }
  setTimeout(()=>{clearAD();},1000);
})();