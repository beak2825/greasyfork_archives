// ==UserScript==
// @icon            http://weibo.com/favicon.ico
// @name            刷票助手-宁波箱单
// @namespace       [url=mailto:1649991905@qq.com]1649991905@qq.com[/url]
// @author          mpy
// @description     刷票助手
// @match           *://xd2.e-hhl.com/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.1
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419137/%E5%88%B7%E7%A5%A8%E5%8A%A9%E6%89%8B-%E5%AE%81%E6%B3%A2%E7%AE%B1%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/419137/%E5%88%B7%E7%A5%A8%E5%8A%A9%E6%89%8B-%E5%AE%81%E6%B3%A2%E7%AE%B1%E5%8D%95.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#reset_btn {background: #517ad6; border: 2px solid #517ad6; border-radius: 20px;color: #fff;margin-left: 10px}');

    //视频下载按钮的html代码
    var down_btn_html = '<button class="btn" id="reset_btn">';
    down_btn_html += '自动刷单';
    // down_btn_html += '<a href="javascript:void(0);" id="down_video_btn" class="S_txt2" title="视频下载">';
    // down_btn_html += '<span class="pos">';
    // down_btn_html += '<span class="line S_line1" node-type="comment_btn_text">';
    // down_btn_html += '<span>';
    // down_btn_html += '<em class="W_ficon ficon_video_v2 S_ficon">i</em>';
    // down_btn_html += '<em>视频下载</em>';
    // down_btn_html += '</span>';
    // down_btn_html += '</span>';
    // down_btn_html += '</span>';
    // down_btn_html += ' <span class="arrow"><span class="W_arrow_bor W_arrow_bor_t"><i class="S_line1"></i><em class="S_bg1_br"></em></span></span>';
    down_btn_html += ' </button>';

    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $("div.modal-body");
    if (ul_tag) {
        // ul_tag.removeClass("WB_row_r3").addClass("WB_row_r4").append(down_btn_html);
        ul_tag.append(down_btn_html)
    }
    $(function () {
        // //获取播放器（video）对象
        // var video = $("video");
        // var video_url = null;
        // if (video) {
        //     video_url = video.attr("src"); //获取视频链接地址
        // }
        setInterval(() => {
            $("#reset_btn").click(function() {
                var btn = $("div.modal-dialog button.btn-danger")
                if (btn) {
                    btn.click()
                }
            })
        }, 2000);

        // //执行下载按钮的单击事件并调用下载函数
        // $("#down_video_btn").click(function () {
        //     if (video_url) {
        //         videoTool.download(video_url, videoTool.getFileName(video_url, "/", "?"));
        //     }
        // });
    });
})();