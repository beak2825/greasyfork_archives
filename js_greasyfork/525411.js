// ==UserScript==
// @name         百度网盘文件总大小
// @description  只对*://pan.baidu.com/s/*有效，只统计当前显示目录所有文件总大小，此功能不是实时显示，点击出现的按钮即可显示文件总大小。
// @namespace    none
// @version      1.1
// @author       none
// @match        *://pan.baidu.com/s/*
// @icon         none
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/525411/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E6%80%BB%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/525411/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E6%80%BB%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

(function(){
    var xButtonBox = document.querySelector(".slide-show-right .module-share-top-bar .bar .x-button-box");
    if (!xButtonBox) return;

    const getByte = function() {
        const list = [
            ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            ["K", "M", "G", "T", "P", "E", "Z", "Y"]
        ];
        const convertFileSize = (str) => {
            str = str.toUpperCase();
            if (str === "-") return "0B";
            list[0].forEach((v, i) => {
                const regex = new RegExp(v, "g");
                str = str.replace(regex, list[1][i]);
            });
            return str;
        };
        const sizes = [];
        const fileSizes = document.querySelectorAll(".file-size");
        for (let i = 0; i < fileSizes.length; i++) {
            const fileSize = fileSizes[i];
            const size = fileSize.innerText || fileSize.textContent || "-";
            const convertedSize = convertFileSize(size);
            sizes.push(convertedSize);
        };
        const xiazai = document.querySelector(".icon.noicon-xiazai");
        if (xiazai) {
            var title = xiazai.getAttribute("title");
            if (title && /\(.*\)/.test(title)) {
                var match = title.match(/\(([^)]+)\)/);
                if (match) {
                    var size = match[1];
                    const convertedSize = convertFileSize(size);
                    sizes.push(convertedSize);
                };
            };
        };

        var totalBytes = 0;
        for (var size of sizes) {
            if (size.length > 0) {
                var unitIndex = size.slice(-1).toUpperCase().match(/[A-Z]/);
                if (unitIndex) {
                    unitIndex = list[1].indexOf(unitIndex[0]);
                    if (unitIndex !== -1) {
                        var numStr = size.slice(0, -1).trim();
                        var num = parseFloat(numStr);
                        if (!isNaN(num)) {
                            unitIndex += 1;
                            totalBytes += num * (1024 ** unitIndex);
                        };
                    };
                };
            };
        };
        var prefix = totalBytes;
        var suffix = "B";
        var i = -1;
        while (prefix >= 1024) {
            prefix = prefix / 1024;
            i = i + 1;
            suffix = list[0][i];
        };
        prefix = prefix.toFixed(2);
        return prefix + suffix;
    };
    var a = document.createElement("a");
    a.id = "small_function_btn_fileSize";
    a.title = "文件大小";
    a.className = "g-button g-button-blue-large";
    a.style.marginRight = "5px";
    a.style.marginLeft = "5px";

    var spanRight = document.createElement("span");
    spanRight.className = "g-button-right";

    var spanText = document.createElement("span");
    spanText.className = "text";
    spanText.style.width = "auto";
    spanText.textContent = getByte();
    spanText.addEventListener("click", function() {
        spanText.textContent = getByte();
    });

    spanRight.appendChild(spanText);

    a.appendChild(spanRight);

    xButtonBox.appendChild(a);
})();
