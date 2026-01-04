// ==UserScript==
// @name         测试设计专用
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2025.03.20.080000
// @description  I try to take over the world!
// @author       Kay
// @match        *://*.qipeiyigou.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @downloadURL https://update.greasyfork.org/scripts/518901/%E6%B5%8B%E8%AF%95%E8%AE%BE%E8%AE%A1%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/518901/%E6%B5%8B%E8%AF%95%E8%AE%BE%E8%AE%A1%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    /*————————————————————函数定义区 Start————————————————————*/
    function get_src() {
        let a = $(".n-upload-file-info a").attr("href");
        $(".n-input__input-el:last").attr("id", "bar");
        $("#bar+div").css("display", "none");
        $("#bar").val(a);
        $("#copy").click();
    }
    function setPosition() {
        let input = prompt("请输入left/top值（例如：100/200）:");
        let [left, top] = input.split("/");
        if (left !== "" && !isNaN(left)) {
            $(".curEditModuleSize").attr("data-left", left);
            $(".curEditModuleSize").css("left", `${left}px`);
        }
        if (top !== "" && !isNaN(top)) {
            $(".curEditModuleSize").attr("data-top", top);
            $(".curEditModuleSize").css("top", `${top}px`);
        }
    }
    /*————————————————————函数定义区 End————————————————————*/
    /*————————————————————主体代码区 Start————————————————————*/
    let renju = 0;
    $("body").append('<button id="copy" data-clipboard-target="#bar" style="display:none;">复制</button>');
    new ClipboardJS('#copy');
    $(document).on("click", ".product-content img", function () {
        $("input:first").attr("id", "bar");
        if (renju == 0) {
            $("#bar").val($(this).attr("src"));
        }
        else {
            let a = "";
            let b = "?6x6RenjuProblem-1E";
            for (let i = 0; i < $(".product-content img").length; i++) {
                a += '"' + $(".product-content img:eq(" + i + ")").attr("src") + b + "-" + (i + 1) + '"' + ",\n";
            }
            $("#bar").val(a);
        }
        $("#copy").click();
    });
    $(document).on("mouseenter", "div[id^='evMo_']", function () {
        let $this = $(this);
        $this.attr("title", `宽度：${$this.css("width")}\n高度：${$this.css("height")}\n左：${$this.css("left")}\n上：${$this.css("top")}`);
    });
    $(document).on("keyup", function (event) {
        switch (event.key) {
            case "Escape":
                setPosition();
                break;
            case "F2":
                get_src();
                break;
        }
    });
    /*————————————————————主体代码区 End————————————————————*/
})();
/*2025.03.20.080000 - Line : 73*/
