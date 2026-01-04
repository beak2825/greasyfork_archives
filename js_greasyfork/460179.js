// ==UserScript==
// @license MIT
// @version 1.0.2
// @name 删除ITDog广告
// @author Uallen_Qbit
// @match *://www.itdog.cn/*
// @description 删除IT狗广告
// @namespace https://kinh.cc
// @icon https://p1.meituan.net/csc/5dfcd5442efc5d067b35503fdf33646b9662.ico
// @downloadURL https://update.greasyfork.org/scripts/460179/%E5%88%A0%E9%99%A4ITDog%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/460179/%E5%88%A0%E9%99%A4ITDog%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    try {
        document.getElementsByClassName("footer")[0].remove();
    } catch (Error) {
        console.log(Error);
    }

    try {
        document.getElementsByClassName("page-header")[0].remove();
    } catch (Error) {
        console.log(Error);
    }

    try {
        document.getElementsByClassName("lantern_left")[0].remove();
    } catch (Error) {
        console.log(Error);
    }

    if (window.location.pathname === "/") {
        try {
            document.getElementsByClassName("col-12 mb-3")[0].remove();
        } catch (Error) {
            console.log(Error);
        }
    }

    try {
        document.getElementsByClassName("col-12 mb-3 gg_link")[0].remove();
    } catch (Error) {
        console.log(Error);
    }

    try {
        document.getElementsByClassName("navbar pcoded-header")[0].remove();
    } catch (Error) {
        console.log(Error);
    }

    for (let Index = 0; Index < 1024; Index++) {
        for (let Index = 0; Index < document.getElementsByClassName("gg_link").length; Index++) {
            try {
                document.getElementsByClassName("gg_link")[Index].remove();
            } catch (Error) {
                console.log(Error);
            }
        }

        for (let Index = 0; Index < document.getElementsByClassName("text-left gg_link").length; Index++) {
            try {
                document.getElementsByClassName("text-left gg_link")[Index].remove();
            } catch (Error) {
                console.log(Error);
            }
        }
    }

    let CreateDocument = document.createElement("div");
    document.body.appendChild(CreateDocument);
    CreateDocument.setAttribute("id", "LoadIng");
    CreateDocument.innerHTML = `<style>.btn{border-radius: 12px}.form-control{border-radius: 12px}</style>`;
})();
