// ==UserScript==
// @name         hue-snippet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hue snippet sql future Orz
// @author       MustAndy
// @match        https://emrhue.yimian.com.cn/hue/*
// @match        https://hue.yimian.com.cn/hue/*
// @icon         https://emrhue.yimian.com.cn/static/desktop/art/hue-login-logo-ellie@2x.3801fb40c54c.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454447/hue-snippet.user.js
// @updateURL https://update.greasyfork.org/scripts/454447/hue-snippet.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var snippet_json = '[{"id":"按dt统计数量","snippet":"select dt,count(1) from db.table where dt > \'2022-10-01\' group by dt order by dt "},\
{"id":"统计某个字段的空值率","snippet":"select sum(if(xxx_column is null,1,0))null_cnt ,count(1)as total_cnt,sum(if(xxx_column is null,1,0))/count(1) as null_rate from db.table "}]'
    var json = JSON.parse(snippet_json);
    window.copy_snippet = function () {
        var snippet_id = document.getElementById('snippet_id').value
        for (var i = 0; i < json.length; i++) {
            if (json[i].id == snippet_id) { navigator.clipboard.writeText(json[i].snippet); }
            else { navigator.clipboard.writeText('snippet的格式可能不太正确嗷, 可以联系WJQ咨询'); }
        }
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    function addSnippetOption() {
        var option_str = ''
        for (var i = 0; i < json.length; i++) {
            var option = ' <option value="' + json[i].id + '">' + json[i].id + '</option> '
            option_str += option
        }
        let myHtml = '<div id = "fiona" style = "position: fixed; top: 70vh; z-index: 100; right: 20px" >\
    <div><label for="task_id">select your snippet </label><br>\
        <select id="snippet_id">'+ option_str +
            '</select>\
    </div>\
    <button style="margin-top:5px" class="btn" onclick="copy_snippet()">Get Snippet</button>\
</div >'
        let elem = createElementFromHTML(myHtml)
        document.body.appendChild(elem)
    }

    function mainEntry() {
        if (window.location.href.includes('hue')) {
            addSnippetOption()
        }
    }
    window.addEventListener('load', mainEntry
        // your code here
        , false);
    // Your code here...
})();