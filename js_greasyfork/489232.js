// ==UserScript==
// @name         sehuatang
// @description  直接把帖子列表转成图片浏览,点击图片可以进入帖子.
// @version      1.1.6
// @author       armyant
// @namespace    https://sleazyfork.org/zh-CN/scripts/489232-sehuatang
// @include      https://www.sehuatang.net/forum-*
// @include      *://*.sehuatang.org/*
// @include      *://*.sehuatang.net/*
// @include      *://*.1kdj5.app/*
// @include      *://*.5aylp.com/*
// @include      *://*.jq2t4.com/*
// @include      *://*.www.0krgb.com/*
// @include      *://*.1qyqs.app/*
// @include      *://*.ds5hk.app/*
// @match        *://*.sehuatang.net/*
// @match        *://*.sehuatang.org/*
// @match        *://*.sehuatang.*/*
// @match        *://*.jq2t4.com/*
// @match        *://*.0krgb.com/*
// @match        *://*.xxjsnc.co/*
// @match        *://*.o4vag.com/*
// @match        *://*.weterytrtrr.*/*
// @match        *://*.qweqwtret.*/*
// @match        *://*.retreytryuyt.*/*
// @match        *://*.qwerwrrt.*/*
// @match        *://*.ds5hk.app/*
// @match        *://*.30fjp.com/*
// @match        *://*.18stm.cn/*
// @match        *://*.xo6c5.com/*
// @match        *://*.mzjvl.com/*
// @match        *://*.9xr2.app/*
// @match        *://*.kzs1w.com/*
// @match        *://*.nwurc.com/*
// @match        *://*.zbkz6.app/*
// @match        *://*.ql75t.cn/*
// @match        *://*.0uzb0.app/*
// @match        *://*.d2wpb.com/*
// @match        *://*.5aylp.com/*
// @match        *://*.8otvk.app/*
// @include      https://www.sehuatang.net/forum.php?mod=forumdisplay&fid=103&page=*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license 	 GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/489232/sehuatang.user.js
// @updateURL https://update.greasyfork.org/scripts/489232/sehuatang.meta.js
// ==/UserScript==
$(document).ready(function () {
    $("tbody[id*='normalthread']").each(function () {
        // 获取当前域名 https://www.sehuatang.net/forum-95-9.html   www.sehuatang.net
        // let urls = "https://www.sehuatang.net/";
        let urls = `https://${document.domain}/`;
        // 获取详情页地址
        urls += $(this).find(".icn a").attr("href");
        // 删除所有子元素
        // $(this).children().remove()
        $(this).find(".tps").remove()
        // 标记当前节点
        let icn_td = $(this);
        console.log(urls);
        let href = document.location.href;

        GM_xmlhttpRequest({
            method: "GET",
            url: urls,
            headers: {
                "User-agent": window.navigator.userAgent,
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                cookie: document.cookie,
                referer: href,
            },
            onerror: function (e) {
                console.log(e);
            },
            onload: function (result) {
                let doc = result.responseText;
                // console.log(doc);

                // 获取标题
                let title = $(doc).find("#thread_subject").html();
                // console.log(title);

                let temp_imges = [];
                // 获取所有的图片
                $.each($(doc).find(".zoom"), function (index, value) {
                    let temp_image_url = $(value).attr("file");
                    if (temp_image_url == undefined || temp_image_url.toString().indexOf("static") > -1) {
                        // return 实现continue功能
                        // return false 实现break功能
                        return;
                    }
                    temp_imges.push(temp_image_url);
                });
                // console.log(temp_imges)

                // 获取ed2k
                let magnet = [];
                $.each($(doc).find(".blockcode li"), function (index, value) {
                    let temp_magnet = $(value).text();
                    magnet.push(temp_magnet)
                });
                // console.log(magnet);

                // 获取附件
                let temp_tattl_str = "";
                $.each($(doc).find(".pattl .tattl dd"), function (index, value) {
                    let temp_file_name = $($(value).find("a")[0]).html();
                    if ((temp_file_name.toString().indexOf("zip") == -1) &&
                        (temp_file_name.toString().indexOf("rar") == -1) &&
                        (temp_file_name.toString().indexOf("torrent") == -1)) {
                        return;
                    }
                    temp_tattl_str += `
                    <div style="background:url(static/image/filetype/rar.gif) no-repeat left center;display: inline-block;margin-left: 10px;" border="0" class="vm" alt="">
                        <div style="font-size:14px;padding-left:40px;}"><a href='${$($(value).find("a")[0]).attr("href")}' id="aid8294944" target="_blank" initialized="true">${temp_file_name}</a></div>
                        <div style="font-size:12px;padding-left:40px;color: royalblue">${$($(value).find("p:nth-child(4)")[0]).html()}</div>
                    </div>
                    `
                });

                // 附件的另一种方式
                let temp_attach_str = "";
                $.each($(doc).find("span[id*='attach']"), function (index, value) {
                    let temp_file_name = $($(value).find("a")[0]).html();
                    if ((temp_file_name.toString().indexOf("zip") == -1) &&
                        (temp_file_name.toString().indexOf("rar") == -1) &&
                        (temp_file_name.toString().indexOf("txt") == -1) &&
                        (temp_file_name.toString().indexOf("torrent") == -1)) {
                        return;
                    }
                    temp_tattl_str += `
                    <div style="background:url(static/image/filetype/rar.gif) no-repeat left center;display: inline-block;margin-left: 10px;" border="0" class="vm" alt="">
                        <div style="font-size:14px;padding-left:40px;}"><a href='${$($(value).find("a")[0]).attr("href")}' id="aid8294944" target="_blank" initialized="true">${temp_file_name}</a></div>
                        <div style="font-size:12px;padding-left:40px;color: royalblue">${$($(doc).find("div[id*='attach'] > div.tip_c.xs0")[0]).text().replace("点击文件名下载附件", "")}</div>
                    </div>
                    `
                });

                let temp_html = "";
                temp_html += `<tr><td width="100%" colspan="5">`
                for (let i = 0; i < temp_imges.length; i++) {
                    if (i >= 8) {
                        break;
                    }
                    temp_html += `<img src="${temp_imges[i]}" height="150" style="margin: 2px;"/>`
                }
                temp_html += `</td></tr>`

                if (magnet.length > 0) {
                    temp_html += `<tr><td width="100%" colspan="5"`
                    // 如果没有附件
                    if (temp_tattl_str.length == 0 && temp_attach_str.length == 0) {
                        temp_html += `style="border-bottom: blueviolet 4px solid"`;
                    }
                    temp_html += `>`
                    temp_html += `
                        <div class="blockcode" style="padding: 5px 0 5px 20px;border: 1px solid #CCC;background: #F7F7F7 url(/static/image/common/codebg.gif) repeat-y 0 0;overflow: hidden;">
                             <div id="code_BN2" style="padding-left: 20px">
                                <ol>`;
                    for (const temp_magnet of magnet) {
                        temp_html += `<li style="list-style-type:decimal-leading-zero;font-family:Monaco,Consolas,'Lucida Console','Courier New',serif;font-size:12px;line-height:1.8em">
                            <div style="padding-left: 20px">${temp_magnet}</div>
                        </li>`
                    }
                    temp_html += `</ol></div><div style="padding-left: 40px"><em onclick="let temp_magnet_str_01='${magnet.toString().replace(/(\n|\r|\r\n|↵)/g, '')}';setCopy(temp_magnet_str_01.replace(/(,)/g, '\\r\\n'), '复制成功');return false;">复制代码</em></div></div>`
                    temp_html += `</td></tr>`
                }
                // temp_html += `<script type="application/javascript">code_BN2_1=magnet;</script>`;
                // temp_html += `<tr><td colspan="5" style="background: blue"></td></tr>`;

                if (temp_tattl_str.length > 0 || temp_attach_str.length > 0) {
                    temp_html += `<tr><td width="100%" colspan="5" style="border-bottom: blueviolet 4px solid">`
                    if (temp_tattl_str.length > 0) {
                        temp_html += temp_tattl_str;
                    }

                    if (temp_attach_str.length > 0) {
                        temp_html += temp_attach_str;
                    }
                    temp_html += `</td></tr>`;
                }

                if (temp_tattl_str.length == 0 && temp_attach_str.length == 0 && magnet.length == 0) {
                    temp_html += `<tr><td width="100%" colspan="5" style="border-bottom: blueviolet 4px solid;">&nbsp;`
                    temp_html += `</td></tr>`;
                }

                $(icn_td).append(temp_html);
            },
        });
    });

    $(".pbw").each(function () {
        let chain = false;
        for (const item_chanin of ["综合区", "原创区", "转帖区", "国产原创", "亚洲无码", "亚洲有码", "中文字幕", "欧美无码", "4K原版", "综合讨论区"]) {
            if ($(this).html().search(item_chanin) != -1) {
                chain = true;
                break;
            }
        }
        if (chain) {
            // 获取当前域名 https://www.sehuatang.net/forum-95-9.html   www.sehuatang.net
            // let urls = "https://www.sehuatang.net/";
            let urls = `https://${document.domain}/`;
            // 获取详情页地址
            urls += $(this).find(".xs3 a").attr("href");
            // 删除所有子元素
            // $(this).children().remove()
            // $(this).find(".tps").remove()
            // 标记当前节点
            let icn_td = $(this);
            $(this).attr("style", "border-bottom: blueviolet 4px solid")
            let href = document.location.href;

            GM_xmlhttpRequest({
                method: "GET",
                url: urls,
                headers: {
                    "User-agent": window.navigator.userAgent,
                    Accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    cookie: document.cookie,
                    referer: href,
                },
                onerror: function (e) {
                    console.log(e);
                },
                onload: function (result) {
                    let doc = result.responseText;
                    // console.log(doc);

                    // 获取标题
                    let title = $(doc).find("#thread_subject").html();
                    // console.log(title);

                    let temp_imges = [];
                    // 获取所有的图片
                    $.each($(doc).find(".zoom"), function (index, value) {
                        let temp_image_url = $(value).attr("file");
                        if (temp_image_url == undefined || temp_image_url.toString().indexOf("static") > -1) {
                            // return 实现continue功能
                            // return false 实现break功能
                            return;
                        }
                        temp_imges.push(temp_image_url);
                    });
                    // console.log(temp_imges)

                    // 获取ed2k
                    let magnet = [];
                    $.each($(doc).find(".blockcode li"), function (index, value) {
                        let temp_magnet = $(value).text();
                        magnet.push(temp_magnet)
                    });
                    // console.log(magnet);

                    // 获取附件
                    let temp_tattl_str = "";
                    $.each($(doc).find(".pattl .tattl dd"), function (index, value) {
                        let temp_file_name = $($(value).find("a")[0]).html();
                        if ((temp_file_name.toString().indexOf("zip") == -1) &&
                            (temp_file_name.toString().indexOf("rar") == -1) &&
                            (temp_file_name.toString().indexOf("torrent") == -1)) {
                            return;
                        }
                        temp_tattl_str += `
                    <div style="background:url(static/image/filetype/rar.gif) no-repeat left center;display: inline-block;margin-left: 10px;" border="0" class="vm" alt="">
                        <div style="font-size:14px;padding-left:40px;}"><a href='${$($(value).find("a")[0]).attr("href")}' id="aid8294944" target="_blank" initialized="true">${temp_file_name}</a></div>
                        <div style="font-size:12px;padding-left:40px;color: royalblue">${$($(value).find("p:nth-child(4)")[0]).html()}</div>
                    </div>
                    `
                    });

                    // 附件的另一种方式
                    let temp_attach_str = "";
                    $.each($(doc).find("span[id*='attach']"), function (index, value) {
                        let temp_file_name = $($(value).find("a")[0]).html();
                        if ((temp_file_name.toString().indexOf("zip") == -1) &&
                            (temp_file_name.toString().indexOf("rar") == -1) &&
                            (temp_file_name.toString().indexOf("txt") == -1) &&
                            (temp_file_name.toString().indexOf("torrent") == -1)) {
                            return;
                        }
                        temp_tattl_str += `
                    <div style="background:url(static/image/filetype/rar.gif) no-repeat left center;display: inline-block;margin-left: 10px;" border="0" class="vm" alt="">
                        <div style="font-size:14px;padding-left:40px;}"><a href='${$($(value).find("a")[0]).attr("href")}' id="aid8294944" target="_blank" initialized="true">${temp_file_name}</a></div>
                        <div style="font-size:12px;padding-left:40px;color: royalblue">${$($(doc).find("div[id*='attach'] > div.tip_c.xs0")[0]).text().replace("点击文件名下载附件", "")}</div>
                    </div>
                    `
                    });

                    let temp_html = "";
                    temp_html += `<tr><td width="100%" colspan="5">`
                    for (let i = 0; i < temp_imges.length; i++) {
                        if (i >= 10) {
                            break;
                        }
                        temp_html += `<img src="${temp_imges[i]}" height="150" style="margin: 2px;"/>`
                    }
                    temp_html += `</td></tr>`

                    if (magnet.length > 0) {
                        temp_html += `<tr><td width="100%" colspan="5"`
                        // 如果没有附件
                        // if (temp_tattl_str.length == 0 && temp_attach_str.length == 0) {
                        //     temp_html += `style="border-bottom: blueviolet 4px solid"`;
                        // }
                        temp_html += `>`
                        temp_html += `
                        <div class="blockcode" style="padding: 5px 0 5px 20px;border: 1px solid #CCC;background: #F7F7F7 url(/static/image/common/codebg.gif) repeat-y 0 0;overflow: hidden;">
                             <div id="code_BN2" style="padding-left: 20px">
                                <ol>`;
                        for (const temp_magnet of magnet) {
                            temp_html += `<li style="list-style-type:decimal-leading-zero;font-family:Monaco,Consolas,'Lucida Console','Courier New',serif;font-size:12px;line-height:1.8em">
                            <div style="padding-left: 20px">${temp_magnet}</div>
                        </li>`
                        }
                        temp_html += `</ol></div><div style="padding-left: 40px"><em onclick="let temp_magnet_str_01='${magnet.toString().replace(/(\n|\r|\r\n|↵)/g, '')}';setCopy(temp_magnet_str_01.replace(/(,)/g, '\\r\\n'), '复制成功');return false;">复制代码</em></div></div>`
                        temp_html += `</td></tr>`
                    }
                    // temp_html += `<script type="application/javascript">code_BN2_1=magnet;</script>`;
                    // temp_html += `<tr><td colspan="5" style="background: blue"></td></tr>`;

                    if (temp_tattl_str.length > 0 || temp_attach_str.length > 0) {
                        temp_html += `<tr><td width="100%" colspan="5">`
                        if (temp_tattl_str.length > 0) {
                            temp_html += temp_tattl_str;
                        }

                        if (temp_attach_str.length > 0) {
                            temp_html += temp_attach_str;
                        }
                        temp_html += `</td></tr>`;
                    }

                    $(icn_td).append(temp_html);
                },
            });
        } else {
            $(this).hide();
        }
    });
});