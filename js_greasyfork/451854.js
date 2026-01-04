// ==UserScript==
// @name         美团学城功能优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  添加序号
// @author       Lucas
// @match        https://km.sankuai.com
// @match        https://km.sankuai.com/page/*
// @match        https://km.sankuai.com/collabpage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451854/%E7%BE%8E%E5%9B%A2%E5%AD%A6%E5%9F%8E%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451854/%E7%BE%8E%E5%9B%A2%E5%AD%A6%E5%9F%8E%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const indexList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

    setInterval(function () {
        let disable;
        let heads = $("h1").length ? $("h1") : $("h2").length ? $("h2") : $("h3").length ? $("h3") : $("h4").length ? $("h4") : $("h5").length ? $("h5") : $("h6");
        heads.each(function (i, v) {
            let text = $(v).text();

            // 数字开头
            if (!isNaN(parseInt(text.charAt(0), 10))) {
                disable = true;
                return;
            }
            // 特殊关键词
            for (var each of indexList) {
                if (text.startsWith(each)) {
                    disable = true;
                    return;
                }
            }
        });
        if (disable) {
            $('#km-index-css').attr('type', 'text/css-disable');
        } else {
            $('#km-index-css').attr('type', 'text/css');
        }
    }, 1000);



    var css = `

/* 初始化 */
#pm-body-wrapper,.ProseMirror {
	counter-reset:h1
}
h1 {
	counter-reset:h2
}
h2 {
	counter-reset:h3
}
h3 {
	counter-reset:h4
}
h4 {
	counter-reset:h5
}
h5 {
	counter-reset:h6
}

/* 显示页 */
#pm-body-wrapper h1:before {
	color: #333;
	counter-increment:h1;
	content:counter(h1) ". ";
}
#pm-body-wrapper h2:before {
	color: #333;
	counter-increment:h2;
	content:counter(h1) "." counter(h2) " ";
}
#pm-body-wrapper h3:before,h3.md-focus.md-heading:before {
	color: #333;
	counter-increment:h3;
	content:counter(h1) "." counter(h2) "." counter(h3) " ";
}
#pm-body-wrapper h4:before,h4.md-focus.md-heading:before {
	color: #333;
	counter-increment:h4;
	content:counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) " ";
}
#pm-body-wrapper h5:before,h5.md-focus.md-heading:before {
	color: #333;
	counter-increment:h5;
	content:counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) "." counter(h5) " ";
}

/* 编辑页 */
.ProseMirror h1:before {
	color: #333;
	counter-increment:h1;
	content:counter(h1) ". ";
}
.ProseMirror h2:before {
	color: #333;
	counter-increment:h2;
	content:counter(h1) "." counter(h2) " ";
}
.ProseMirror h3:before,h3.md-focus.md-heading:before {
	color: #333;
	counter-increment:h3;
	content:counter(h1) "." counter(h2) "." counter(h3) " ";
}
.ProseMirror h4:before,h4.md-focus.md-heading:before {
	color: #333;
	counter-increment:h4;
	content:counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) " ";
}
.ProseMirror h5:before,h5.md-focus.md-heading:before {
	color: #333;
	counter-increment:h5;
	content:counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) "." counter(h5) " ";
}

/* 目录 */
.ct-edit-catalog,.ct-view-catalog,.catalog-box-body,.ct-edit-edit-catalog,.pk-edit-edit-catalog {
	counter-reset: indent-0
}
.indent-0 {
	counter-reset: indent-1
}
.indent-1 {
	counter-reset: indent-2
}
.indent-2 {
	counter-reset: indent-3
}
.indent-3 {
	counter-reset: indent-4
}
.indent-4 {
	counter-reset: indent-5
}
.indent-0 a:before {
	color: rgba(0,0,0,.6);
	counter-increment: indent-0;
	content:counter(indent-0) ". ";
}
.indent-1 a:before {
	color: rgba(0,0,0,.6);
	counter-increment: indent-1;
	content:counter(indent-0) "." counter(indent-1) " ";
}
.indent-2 a:before{
	color: rgba(0,0,0,.6);
	counter-increment: indent-2;
	content:counter(indent-0) "." counter(indent-1) "." counter(indent-2) " ";
}
.indent-3 a:before {
	color: rgba(0,0,0,.6);
	counter-increment: indent-3;
	content:counter(indent-0) "." counter(indent-1) "." counter(indent-2) "." counter(indent-3) " ";
}
.indent-4 a:before {
	color: rgba(0,0,0,.6);
	counter-increment: indent-4;
	content:counter(indent-0) "." counter(indent-1) "." counter(indent-2) "." counter(indent-3) "." counter(indent-4) " ";
}

    `;

    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.id = "km-index-css";
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }

    // 绑定快捷键
    // control + 1 → 隐藏/显示 侧边栏
    // control + 2 → 隐藏/显示 目录
    $(document).keydown(function (event){
        if (event.ctrlKey && event.key == '1') {
            $('.siderbar-control-icon').click();
            return;
        } else if (event.ctrlKey && event.key == '2') {
            $('.pk-Catalog-view-switch').click();
            return;
        }
    });

})();
