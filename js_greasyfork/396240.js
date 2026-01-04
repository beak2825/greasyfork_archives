// ==UserScript==
// @name         Fofa.so 搜索结果页面“使用API”优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改了Fofa.so 搜索结果页面“使用API”界面，对原有api增加了size和filed参数，并增加了powershell下载命令。
// @author       mark0smith
// @match        https://fofa.so/result?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396240/Fofaso%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E9%9D%A2%E2%80%9C%E4%BD%BF%E7%94%A8API%E2%80%9D%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396240/Fofaso%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E9%9D%A2%E2%80%9C%E4%BD%BF%E7%94%A8API%E2%80%9D%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var selector = "#apiInfoModal > div > div > div.modal-body > div:nth-child(1)";
    var original_api = document.querySelector(selector).innerText.trim();


    var replace_text = ""
    replace_text += "原始api为：\n"
    replace_text += original_api + "\n\n";

    replace_text += "修改后api为：\n"
    var new_api = original_api + "&size=10000&fields=ip"
    replace_text += new_api + "\n\n";

    replace_text += "使用PowerShell下载数据:\n"
    var output_filename = Date.now().toString() + ".json"
    var powershell_download_command = 'Invoke-WebRequest -Uri "'+ new_api +'" -OutFile ' + output_filename;
    replace_text += powershell_download_command + "\n"

    document.querySelector(selector).innerText = replace_text
})();