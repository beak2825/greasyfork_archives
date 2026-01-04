// ==UserScript==
// @name         禁用控制台
// @namespace    coderWyh
// @version      1.1
// @description  disableControl
// @author       coderWyh
// @match        http://www.gczl360.com:8084/Admin/ZLKGL/Template*
// @run-at       document-end
// ==/UserScript==
// 本代码所有权归作者所有 作者QQ：2471630907 手机号：18990193572  微信同手机号
// 本代码具有知识产权 未经作者授权严禁任何人进行使用、传播、二次开发等一系列损害作者知识产权的操作
// 作者对未经授权的操作保留起诉但不仅限于起诉的维护个人知识产权利益的法律途径
(function() {
    'use strict';
    setInterval(function() {
        check()
    }, 1500);
    var check = function() {
        function doCheck(a) {
            if (("" + a/a)["length"] !== 1 || a % 20 === 0) {
                (function() {}
                 ["constructor"]("debugger")())
            } else {
                (function() {}
                 ["constructor"]("debugger")())
            }
            doCheck(++a)
        }
        try {
            doCheck(0)
        } catch (err) {}
    };
    check();
})();