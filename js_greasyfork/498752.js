// ==UserScript==
// @name         国开学习网资源下载
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202406241743
// @description  国家开放大学学习网允许不能下载的资源在预览资源时下载
// @author       流浪的蛊惑
// @match        *://lms.ouchn.cn/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498752/%E5%9B%BD%E5%BC%80%E5%AD%A6%E4%B9%A0%E7%BD%91%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498752/%E5%9B%BD%E5%BC%80%E5%AD%A6%E4%B9%A0%E7%BD%91%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
let ginfo = document.getElementsByClassName("course-activity-tabs row"), token = "", pkjs = 0;
function addXMLRequestCallback(callback) {//监听请求
    let oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {//监听发送
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            this.gargs = arguments[0];
            oldSend.apply(this, arguments);
        }
        XMLHttpRequest.prototype.wrappedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function (header, value) {//监听自定义主机头
            this.wrappedSetRequestHeader(header, value);
            if (!this.headers) {
                this.headers = {};
            }
            if (!this.headers[header]) {
                this.headers[header] = [];
            }
            this.headers[header].push(value);
        }
    }
}
(function () {
    'use strict';
    let gurl="",grd=false;
    let gt = document.getElementsByClassName("toolbar-buttons pdf-view");
    setInterval(function () {
        if(gt.length>0){
            grd=false;
            gt[0].innerHTML="<a href='"+gurl+"' target='_blank'><span style='color:white;'>下载</span></a>";
        }
    }, 1000);
    addXMLRequestCallback(function (xhr) {
        xhr.addEventListener("load", function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseURL.includes("/url?preview=true")) {
                    let p = JSON.parse(xhr.responseText);
                    gurl=p.url;
                    grd=true;
                }
            }
        });
    });
})();