// ==UserScript==
// @name          zimuzu.tv 免 Flash 复制（改）
// @version       0.1
// @namespace     notxx
// @description   免 Flash 在 zimuzu.tv 上进行批量复制（去掉了多行文本框）
// @license       WTFPL
// @include       http://www.zimuzu.tv/*
// @include       http://zimuzu.tv/*
// @grant         GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/24299/zimuzutv%20%E5%85%8D%20Flash%20%E5%A4%8D%E5%88%B6%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/24299/zimuzutv%20%E5%85%8D%20Flash%20%E5%A4%8D%E5%88%B6%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

var ed2k = $("a[rel='ed2k']");
var magnet = $("a[rel='magnet']");
var disk = $("a[rel='disk']");

$(ed2k).unbind();
$(magnet).unbind();
$(disk).unbind();
$(ed2k).siblings("span").remove();

function _copy(expr) {
    return (function() {
        var urls = [],
            $self = $(this),
            text = $self.text();
        $("div.fl").each(function(){
            var $this = $(this);
            if($this.children("input").attr("checked") == "checked" && $this.is(":visible")){
                urls.push($this.siblings("div.fr").children(expr).attr("href"));
            }
        });
        if (!urls.length) {
            $self.text("未复制").fadeOut(500, function() {
                $self.text(text).show();
            });
        }
        GM_setClipboard(urls.join('\n'));
        $self.text("已复制").fadeOut(500, function() {
            $self.text(text).show();
        });
    });
}

$(ed2k).click(_copy("a[type='ed2k']"));
$(magnet).click(_copy("a[type='magnet']"));
$(disk).click(_copy("a[type='disk']"));
