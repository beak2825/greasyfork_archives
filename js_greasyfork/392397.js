// ==UserScript==
// @name         知道复制回答工具
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  知道复制回答工具1
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require	     https://cdn.jsdelivr.net/npm/vue
// @match        *://zhidao.baidu.com/question/*
// @downloadURL https://update.greasyfork.org/scripts/392397/%E7%9F%A5%E9%81%93%E5%A4%8D%E5%88%B6%E5%9B%9E%E7%AD%94%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/392397/%E7%9F%A5%E9%81%93%E5%A4%8D%E5%88%B6%E5%9B%9E%E7%AD%94%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

$(function () {
    $(".wgt-replyer-all")
        .toArray()
        .forEach((e, i) => {
            $(e).append(`
                <button
                    style="position:absolute;left:170px;top:10px;font-size: 16px;"
                    class="my_copy_button"
                    data-index="${i}"
                >
                复制回答
                </button>`);
        });

    let key = "my_current_copy";

    $(".my_copy_button").click(function () {
        let index = $(this).data('index');
        let contents = $(".line.content").map((i, e) => {
            let x = $(e).find('p');
            return x.map((i, e1) => e1.outerHTML).toArray().join('')
        }).toArray();
        let content = contents[(+index)];
        if (content && content.trim() && content.trim().length) {
            localStorage[key] = content;
        }
    });


    let interval = setInterval(function () {
        if ($("#my_load_copy_button").length) {
            return;
        }
        if (!document.getElementById('ueditor_0')) {
            return;
        }
        document.querySelector(".line .wgt-replyer-line").innerHTML += `<button style="position: absolute;top:10px;left:370px;font-size: 16px;" id="my_load_copy_button">载入复制的回答</button>`.trim();

        $(document).on('click',"#my_load_copy_button",function () {
            $("#ueditor_0")[0].contentWindow.editor.execCommand(
                'insertHtml',
                localStorage[key]
            )
        });

        clearInterval(interval);
    }, 300);
});