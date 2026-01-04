// ==UserScript==
// @name         SpringSunday-Quik-Comment
// @namespace    https://springsunday.net/
// @version      1.3
// @description  快速添加回复的修改意见
// @author       You
// @include     http*://springsunday.net/details.php*
// @include     http*://springsunday.net/offers.php?id=*&off_details=1
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406630/SpringSunday-Quik-Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/406630/SpringSunday-Quik-Comment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var textarea = $('textarea[name="body"]');
    textarea.after(
         '<div align="center"><select id="quickcommentselect" multiple="multiple" style="width: 450px; height: 140px; margin-top: 5px; margin-bottom: 5px">'
        + '<option class="quickcomment" id="quickcomment0" value="0">请使用mediainfo扫描完整的英文版媒体信息或使用PotPlayer复制属性中的文件信息</option>'
        + '<option class="quickcomment" id="quickcomment1" value="1">请移除附加信息的影片简介</option>'
        + '<option class="quickcomment" id="quickcomment2" value="2">标题空格换为.</option>'
        + '<option class="quickcomment" id="quickcomment3" value="3">请参考资源规则中的主标题部分重新命名</option>'
        + '<option class="quickcomment" id="quickcomment4" value="4">请优先使用豆瓣链接</option>'
        + '<option class="quickcomment" id="quickcomment5" value="5">请补充豆瓣链接到指定的位置</option>'
        + '<option class="quickcomment" id="quickcomment6" value="6">请补充截图</option>'
        + '<option class="quickcomment" id="quickcomment7" value="7">截图或海报图床防盗链，请更换</option>'
        + '<option class="quickcomment" id="quickcomment8" value="8">截图或海报无法看到，请更换</option>'
        + '</select></div>'
    );

    $('#quickcommentselect').change(function() {
        var quickcomment = $('.quickcomment');
        textarea.val('');
        $($(this).val()).each(function(index, element) {
            if (index === 0) {
                textarea.val($('#quickcomment' + element).text());
            } else {
                textarea.val(textarea.val() + "\n" + $('#quickcomment' + element).text());
            }
        });
    });
})();