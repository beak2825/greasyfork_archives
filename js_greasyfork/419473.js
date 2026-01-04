// ==UserScript==
// @name         Pter Better Search-bar for games
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.1.8
// @description  Game Search-bar for Pterclub
// @author       BbLaCk
// @match        https://pterclub.com/torrents.php?cat=409*
// @match        https://pterclub.com/torrents.php?cat409=yes*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481231/Pter%20Better%20Search-bar%20for%20games.user.js
// @updateURL https://update.greasyfork.org/scripts/481231/Pter%20Better%20Search-bar%20for%20games.meta.js
// ==/UserScript==
function make_better(){
    'use strict';
    //删除无用栏目:
    const enemy = $("#source1").parent().parent();
    enemy.prev().remove();
    enemy.next().remove();
    enemy.next().remove();
    enemy.remove()

    //修改标签:
    $("select[name='tag_exclusive']").before('<input type="checkbox" name="cat409" style="display: none" value="yes" checked="checked">');
    $("select[name='tag_exclusive']").replaceWith('<input type="checkbox" name="tag_exclusive" value="yes">');
    $("select[name='tag_internal']").replaceWith('<input type="checkbox" name="tag_internal" value="yes">');
    $("select[name='tag_mandarin']").replaceWith('<input type="checkbox" name="tag_mandarin" value="yes">');
    $("select[name='tag_cantonese']").replaceWith('<input type="checkbox" name="tag_cantonese" value="yes">');
    $("select[name='tag_doityourself']").replaceWith('<input type="checkbox" name="tag_doityourself" value="yes">');
    $("select[name='tag_master']").replaceWith('<input type="checkbox" name="tag_sce" value="yes">');
    $("a[href='\/torrents.php?tag_master=yes']").replaceWith("<a style=\"margin-left: 5px;\" href=\"torrents.php?cat409=yes&tag_sce=yes\" one-link-mark=\"yes\">Scene</a>");
    $("a[href='\/torrents.php?tag_gg=yes']").after("&nbsp;&nbsp;<input type=\"checkbox\" name=\"tag_vs\" value=\"yes\"> <a style=\"margin-left: 5px;\" href=\"torrents.php?cat409=yes&tag_vs=yes\" one-link-mark=\"yes\">可信源</a>");

    //修改平台:
    const location = $("input#cat401").parent().parent();
    location.empty();
    append:location.append('<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source16" name="source16"  value="1"><a href="?cat409=yes&source=16" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="Windows" title="Windows" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/Windows.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source20" name="source20"  value="1"><a href="?cat409=yes&source=20" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="Switch" title="Switch" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/Switch.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source31" name="source31"  value="1"><a href="?cat409=yes&source=31" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="PS4" title="PS4" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/PS4.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source46" name="source46"  value="1"><a href="?cat409=yes&source=46" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="Linux" title="Linux" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/Linux.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source37" name="source37"  value="1"><a href="?cat409=yes&source=37" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="MAC" title="MAC" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/MAC.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source24" name="source24"  value="1"><a href="?cat409=yes&source=24" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="GBA" title="GBA" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/GBA.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source21" name="source21"  value="1"><a href="?cat409=yes&source=21" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="FC_NES" title="FC_NES" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/FC_NES.png);"></a></td>\n');
    $("input[name='cat_check']").remove();
    const aim = $("input#cat412").parent().next();
    aim.siblings().remove();
    aim.before('<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source17" name="source17"  value="1"><a href="?cat409=yes&source=17" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="DOS" title="DOS" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/DOS.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source34" name="source34"  value="1"><a href="?cat409=yes&source=34" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="PSP" title="PSP" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/PSP.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source33" name="source33"  value="1"><a href="?cat409=yes&source=33" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="PS2" title="PS2" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/PS2.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source35" name="source35"  value="1"><a href="?cat409=yes&source=35" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="PS3" title="PS3" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/PS3.png);"></a></td>\n')
}
$(function(){
    make_better();
    $('input[name^="source"]').each(function(){
        $(this).click(function(){
            if($(this).prop('checked')){
                $('input[name^="source"]').prop('checked',false);
                $(this).prop('checked',true);
            }
        });
    });
});
