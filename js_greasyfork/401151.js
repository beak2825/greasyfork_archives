// ==UserScript==
// @name         二维码
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  1. 点击菜单栏里的“查看二维码”就可以查看当前页面的二维码(快捷键:ctrl+q); 2.按住ctrl键，右键点击图片或超级链接，即可查看该图片或链接的地址的二维码; 3.选中一段文字后，文字会高亮显示，点击该高亮区域，就会取消高亮。4. 如果网页内有无链接网址，按住ctrl后双击它，可以显示该网址的二维码。
// @author       xiefucai
// @license      MIT
// @homepageURL  https://github.com/xiefucai
// @include      *
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/401151/%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/401151/%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var css = `
#QRCODE {
    position        : fixed;
    top             : 100px;
    right           : 10px;
    z-index         : 999999;
    background-color: #fff;
}

#QRCODE .close {
    color          : gainsboro;
    position       : absolute;
    right          : 0;
    top            : 0;
    text-decoration: none !important;
    font-size      : 28px;
    font-weight    : bold;
    padding        : 0 5px;
    line-height    : 1;
    font-family    : Arial;
    display        : none;
}

#QRCODE .qrcode {
    padding         : 20px 20px 10px;
    display         : none;
    background-color: #fff;
    box-shadow      : 0 0 5px #000;
    text-decoration : none !important;
}

#QRCODE .qrcode::after {
    content    : '请用手机扫描二维码';
    font-size  : 12px;
    color      : gray;
    display    : block;
    line-height: 20px;
    text-align : center;
    margin-top : 10px;
}

#QRCODE.open {
    top        : 50%;
    left       : 50%;
    margin-left: -81px;
    margin-top : -87px;
    border     : 1px solid #ccc;
    width      : 162px;
}

#QRCODE.open .qrcode {
    display: block;
    border : none;
}

#QRCODE.open .qrcode * {
    pointer-events: none;
    margin        : 0;
}

#QRCODE.open .close {
    display: block;
    border : none;
}

:root {
    --custom-hight-light-color: rgba(255, 255, 0, 0.5);
}

a.custom-hight-light-color {
    background-color: rgba(255, 255, 0, 0.5) !important;
    cursor          : pointer  !important;
    text-decoration : none !important;
    user-select     : all  !important;
    color           : currentColor  !important;
}

a.custom-hight-light-color:hover {
    background-color: rgba(0, 200, 0, 0.5)  !important;
}
    `;
    var $ = jQuery;

    function selectText (node) {
        if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            console.warn("Could not select text in node: Unsupported browser.");
        }
    }

    function getQrLayer () {
        if ($("#QRCODE").length) {
            return $("#QRCODE");
        }
        var layer = $('<div id="QRCODE"></div>').appendTo($("body"));
        $('<a class="qrcode" target="_blank"></a>').appendTo(layer);
        var btn = $('<a href="javascript:;" class="close">&times;</a>').appendTo(
            layer
        );
        btn.bind("click", function () {
            layer.removeClass("open");
        });
        return layer;
    }

    function generateQR (str) {
        getQrLayer();
        jQuery("#QRCODE")
            .addClass("open")
            .find(".qrcode")
            .html("")
            .attr("title", str)
            .attr("href", str)
            .qrcode({
                render: "canvas",
                text: str,
                width: 120,
                height: 120,
                foreground: "#009900",
                background: "#ffffff",
            });
    }

    function getSelect () {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else {
            return document.selection.createRange().text;
        }
    }

    function checkURLFormat (string) {
        if (!/^(https?:)?\/\/(\S+\.)+\S{2,}$/i.test(string)) {
            return false;
        }
        return true;
    }

    function colorRGBtoHex (color) {
        const m = color.match(/^(rgba?)\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*([\d\.]*)\s*\)$/) || [];
        const type = (m[1] || '').toLowerCase();
        const mr = parseInt(m[2] || 0, 10);
        const mg = parseInt(m[3] || 0, 10);
        const mb = parseInt(m[4] || 0, 10);
        const ma = parseFloat((m[5] || '').substring(0, (m[5] || '').length - 1)).toFixed(2);
        if (type === 'rgb') {
            return "#" + ((1 << 24) + (mr << 16) + (mg << 8) + mb).toString(16).slice(1);
        } else if (type === 'rgba') {
            return ('#' + r.toString(16) + g.toString(16) + b.toString(16) + (a * 255).toString(16).substring(0, 2));
        } else {
            return color;
        }
    }

    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }


    GM_registerMenuCommand(
        "查看二维码",
        function () {
            generateQR(document.location.href);
        },
        ""
    );

    $(document).contextmenu(function (e) {
        if (e.ctrlKey) {
            var target = e.target;
            if (!/^(a|img)$/i.test(target.tagName)) {
                while (!/^(body|html)$/i.test(target.tagName)) {
                    target = target.parentNode;
                    if (/^(a|img)$/i.test(target.tagName)) {
                        break;
                    }
                }
            }

            if (target.tagName === "A" && checkURLFormat(target.href)) {
                generateQR(target.href);
                return;
            }

            if (target.tagName === "IMG" && checkURLFormat(target.src)) {
                generateQR(target.src);
                return;
            }
        }
    });

    $(document).mouseup(function (e) {
        const elem = e.target;
        const selectString = getSelect().replace(/^\s+|\s+$/g, "");
        const HIGHLIGHTCOLOR = 'custom-hight-light-color'
        if (e.ctrlKey) {
            if (selectString === "") {
                return;
            }

            if (!checkURLFormat(selectString)) {
                return;
            }

            generateQR(selectString);
        } else {
            if ($(elem).hasClass(HIGHLIGHTCOLOR)) {
                const p = $(elem).parent();
                $(elem).attr('href', 'javascript:;').parent().attr('contenteditable', true);
                selectText(elem)
                document.execCommand("unlink", false, false);
                //elem.setAttribute('contenteditable', false);
                p.attr('contenteditable', false)
                e.stopPropagation();

                return false;
            }
            if (selectString && /^(span|p|blockquote|p|div|h\d+|dt|dl|dd|li|td)$/i.test(elem.tagName)) {
                elem.setAttribute('contenteditable', true);
                if (checkURLFormat(selectString)) {
                    document.execCommand("createLink", false, selectString);
                } else {
                    document.execCommand("createLink", false, "====");
                }
                elem.setAttribute('contenteditable', false);
                $(elem).find('a[href="===="]').addClass(HIGHLIGHTCOLOR).removeAttr("href");
            }
        }
    });

    $(document).dblclick(function (e) {
        if (e.ctrlKey) {
            var url = /(https?:\/\/\S+)/.exec(e.target.innerText);
            if (url && url[1]) {
                generateQR(url[1]);
            }
        }
    });

    $(document).keyup(function (e) {
        if (e.ctrlKey && e.keyCode === 81) {
            if (jQuery("#QRCODE").hasClass("open")) {
                jQuery("#QRCODE").removeClass("open");
            } else {
                generateQR(location.href);
            }
        }
    });
})();