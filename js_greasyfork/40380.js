// ==UserScript==
// @name               dm5.com 自动加载章节图片
// @description        Lists all images in a chapter/volume
// @name:zh-CN         DM5 漫画列表
// @description:zh-CN  列出章节内所有图片。原作者willy_sunny，原脚本https://greasyfork.org/zh-CN/scripts/25513-dm5-com-image-list。由于原脚本在网站更新后失效，因此在其基础上进行了修正。
// @version            1.2.0
// @include            /^https?\:\/\/.*?\.dm5\.com\//
// @author             slinerd
// @license            GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @namespace https://greasyfork.org/users/165071
// @downloadURL https://update.greasyfork.org/scripts/40380/dm5com%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E7%AB%A0%E8%8A%82%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/40380/dm5com%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E7%AB%A0%E8%8A%82%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
//
// ************************
// Own Variable Declaration
// ************************
// imgList: the output result
//

// 读取下一章url和标题
var nextChapterUrl = ""
var nextChapterTitle = "无"
if ($('.logo_2').length != 0) {
    nextChapterUrl = $('.logo_2')[0].href
    nextChapterTitle = $('.logo_2')[0].title
}

let imgList = "";
function lp(p, container, count, callback) {
    $.ajax({
        url: 'chapterfun.ashx',
        data: {
            cid: DM5_CID,
            page: p,
            key: $("#dm5_key").val(),
            language: 1,
            gtk: 6,
            _cid: DM5_CID,
            _mid: DM5_MID,
            _dt: DM5_VIEWSIGN_DT,
            _sign: DM5_VIEWSIGN
        },
        type: 'GET',
        success: function(data) {
            eval(data);
            if (p > count) {
                callback(container.outerHTML);
            } else {
                document.body.innerHTML = "Loading Page " + p + "/" + count;
                container.innerHTML += `<div align="center"><img src="${d[0]}"><br><br></div>`;
                lp(p+1, container, count, callback);
            }
        }
    })
}
let container = $('.container .block');
imgList = lp(1, container[container.length - 1], DM5_IMAGE_COUNT,
function(data) {
    document.body.innerHTML = data;

    // 删除多余文本
    var str = $('.block')[0].text;
    $('.block')[0].innerHTML = $('.block')[0].innerHTML.replace(str,"");

    // 增加下一章按钮
    var nextChapterButton;
    (nextChapterButton = document.createElement("button")).innerHTML = "下一话：" + nextChapterTitle;
    if (nextChapterUrl == "") {
        nextChapterButton.setAttribute("onclick", "alert('到头了')");
    } else {
        nextChapterButton.setAttribute("onclick", "location='"+nextChapterUrl+"'");
    }
    //document.body.appendChild(nextChapterButton);
    var d = document.createElement("div");
    d.setAttribute("align","center");
    d.appendChild(nextChapterButton);
    document.body.appendChild(d);

});