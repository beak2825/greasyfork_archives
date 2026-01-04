// ==UserScript==
// @name         神器在手天下我有
// @namespace    medium、businessinsider、towardsdatascience
// @version      0.1
// @description  try to take over the world!
// @author       sockstack
// @match        *://*medium.com/*
// @match        *://*businessinsider.com/*
// @match        *://*towardsdatascience.com/*
// @match        *://*nytimes.com/*
// @match        *://*bloomberg.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420565/%E7%A5%9E%E5%99%A8%E5%9C%A8%E6%89%8B%E5%A4%A9%E4%B8%8B%E6%88%91%E6%9C%89.user.js
// @updateURL https://update.greasyfork.org/scripts/420565/%E7%A5%9E%E5%99%A8%E5%9C%A8%E6%89%8B%E5%A4%A9%E4%B8%8B%E6%88%91%E6%9C%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var medium = {
        author: 'sockstack',
        namespace: 'medium、businessinsider、towardsdatascience',
        version: '0.1',
        name: '神器在手天下我有',
        timer: null,
        msg: "请支持正版！！！！",
        show: false
    }

    function check() {
        medium.timer = setInterval(function() {
            if (secret() != verify()){
                alert(medium.msg)
                medium.show = false
            }
            medium.show = true
        }, 1000)
    }

    function secret(){
        var str = medium.name + medium.namespace + medium.version + medium.author;
        return md5(str)
    }

    function verify(){
        var str = GM_info.script.name + GM_info.script.namespace + GM_info.script.version + GM_info.script.author;
        return md5(str)
    }

    function upgrade() {
        if (!medium.show) return
        var currentsite = document.querySelector("meta[property='al:android:app_name']") ? document.querySelector("meta[property='al:android:app_name']").content: window.location.href;
        function isPage(b) {
            console.log(b + " " + currentsite.includes(b));
            return currentsite.includes(b)
        }
        function process(b) {
            var a = b;
            isPage("NYTimes") && (document.querySelector("html").innerHTML = a);
            isPage("Medium") && (a = b.replace(/<\/?noscript>/g, ""), document.querySelector("html").innerHTML = a);
            if (isPage("Bloomberg") || isPage("businessinsider")) a = document.createElement("html"),
                a.innerHTML = b,
                a.querySelectorAll("script").forEach(function(a) {
                return a.outerHTML = ""
            }),
                a = a.outerHTML,
                document.open(),
                document.write(a),
                document.close();
            isPage("businessinsider") && (a = document.createElement("html"), a.innerHTML = b, a.querySelectorAll("script").forEach(function(a) {
                return a.outerHTML = ""
            }), a.querySelectorAll("figure").forEach(function(a) {
                a.innerHTML = a.querySelector("noscript").innerHTML
            }), a = a.outerHTML, document.open(), document.write(a), document.close())
        }
        fetch(window.location.href, {
            credentials: "omit",
            redirect: "follow",
            mode: "no-cors"
        }).then(function(b) {
            return b.text()
        }).then(function(b) {
            process(b)

            UI()
        });
    }
    function UI() {
        clearInterval(medium.timer)
        var button = document.createElement("div");
        button.id = "id001";
        button.textContent = "破解";
        button.style.width = "60px";
        button.style.height = "60px";
        button.style.textAlign = "center";
        button.style.lineHeight = "60px";
        button.style.position = "fixed";
        button.style.bottom = "150px";
        button.style.right = "20px";
        button.style.backgroundColor = "#158fe6";
        button.style.borderRadius = '60px';
        button.style.color = '#fff';
        button.style.cursor = "pointer";
        button.style.boxShadow = "0px 0px 10px #888888";

        var x = document.getElementsByTagName('body')[0];
        button.onclick = function (){
            upgrade();

            return;
        };
        x.appendChild(button);
        check();
    }

    UI()
})();