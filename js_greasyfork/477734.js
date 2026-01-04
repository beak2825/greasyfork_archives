// ==UserScript==
// @name         MantisBT Helper
// @namespace    https://greasyfork.org/zh-CN/users/1198037-gavin0x0
// @version      0.3
// @description  Copy the text of a link to the clipboard when a button next to it is clicked
// @license      MIT
// @author       Gavin
// @match        http://dist.ius.plus/flyinsono/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477734/MantisBT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/477734/MantisBT%20Helper.meta.js
// ==/UserScript==
(function () {
    "use strict";
    function create_copy_text_button(text4display,text4copy) {
        const copy_button = document.createElement("p");
        copy_button.innerHTML = text4display;
        copy_button.onclick = function () {
            copy_button.innerHTML = "已复制 ✅";
            setTimeout(function () {
                copy_button.innerHTML = text4display;
            }, 1200);
            const text = text4copy;
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        };
        return copy_button;
    }
    var next_version_str = "0.0.0";
    var latest_version = "0";
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        if (!links[i].classList.contains("file")) {
            continue;
        }
        var version = links[i].innerHTML.replace(".zip", "");
        var text_to_copy = "已修复\nversion: " + version;
        let button = create_copy_text_button("修复于此版本 ✏️",text_to_copy);
        var td = document.createElement("td");
        td.style.cursor = "pointer";
        td.appendChild(button);
        var parentTd = links[i].parentNode.parentNode;
        parentTd.parentNode.insertBefore(td, parentTd);
        var last_dot = version.lastIndexOf(".");
        var version_number = parseInt(version.substring(last_dot + 1));
        if (version_number > latest_version) {
            latest_version = version_number;
        }else{
            continue;
        }
        version_number = version_number + 1;
        if (version_number < 10) {
            version_number = "0" + version_number;
        }
        next_version_str = version.substring(0, last_dot + 1) + version_number;
    }
    if (next_version_str == "0.0.0") {
        return;
    }
    var trs = document.getElementsByTagName("tr");
    var th = document.createElement("th");
    th.style.cursor = "pointer";
    trs[0].insertBefore(th, trs[0].firstChild);
    var next_version_to_copy = "已修复\nversion: " + next_version_str;
    let button = create_copy_text_button("下一个版本 ✏️",next_version_to_copy);
    th.appendChild(button);
  })();