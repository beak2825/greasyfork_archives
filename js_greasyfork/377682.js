// ==UserScript==
// @name    Processon下载脑图
// @namespace    http://www.yihy.cc/
// @version      0.2
// @description  导出Processon脑图 km格式
// @author       yihy
// @match        *://www.processon.com/view/link/*
// @match        *://www.processon.com/view/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377682/Processon%E4%B8%8B%E8%BD%BD%E8%84%91%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/377682/Processon%E4%B8%8B%E8%BD%BD%E8%84%91%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    try {
    function getKmByProcesson(json) {
        console.log(json)
        function fn(json) {
            var d = {
                data: {
                    id: json.id,
                    text: json.title.replace('//g', '\n')
                }
            };
            if (json.note != undefined) {
                d.data.note = json.note;
            }
            if (json.children == null || json.children.length == 0) {
                return d;
            }
            var arr = [];
            json.children.forEach(function (item) {
                arr.push(fn(item));
            });
            d.children = arr;
            return d;
        }
        return {
            root: fn(json)
        };
    }

    function saveKm(fileName, content) {
        var el = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        if (el) {
            el.href = 'data:text/plain,' + content;
            el.download = fileName;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            el.dispatchEvent(event);
        }
    }

     $(".controlls>div").last().before('<div id="downloadkm" title_pos="left" title="下载脑图" class="item"><div class="ico_box"><span class="icons"></span></div></div>');
     $("#downloadkm").click(function () {
        $.ajax({
        url: "/diagraming/getdef?tempId=" + tempId,
        type: 'get',
        data: {
            id: chartId
        },
        success: function (c) {
            var definition = JSON.parse(c.def);
            if(!definition.title){
              alert("不支持的格式！");
            }
            var data = getKmByProcesson(definition);
            var fileName = data.root.data.text + '.km';
            saveKm(fileName, JSON.stringify(data));
        },
        fail: function (ex) {
            alert(ex);
        }
    });
    });


} catch (e) {
    alert(e);
}

})();