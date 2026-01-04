// ==UserScript==
// @name         京东加评测视频
// @namespace    add_review
// @version      0.3
// @description  在京东的产品页面上加上评测视频，目前只支持B站视频。
// @author       clvin
// @homeurl      https://greasyfork.org/zh-CN/scripts/412665
// @match        http*://item.jd.com/*
// @match        http*://search.bilibili.com/all?vflag=1&*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/412665/%E4%BA%AC%E4%B8%9C%E5%8A%A0%E8%AF%84%E6%B5%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/412665/%E4%BA%AC%E4%B8%9C%E5%8A%A0%E8%AF%84%E6%B5%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {

    // This Userscirpt can't run under Greasemonkey 4.x platform
    if (typeof GM_xmlhttpRequest === "undefined") {
        alert("不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey");
        return;
    }

    var cf = 1;

    function loadSheet() {
        var sheet = `
            /* 评测视频iframe展示的样式 */
            .video-iframe {
                border: 0px;
                margin: 0px !important;
                width: 100% !important;
                height: 230px !important;
            }
            /* 搜索关键字iframe的样式 */
            .keyword{
                text-align:center;
            }
        `;
        var css = document.createElement('style');
        css.type = 'text/css';
        css.id = 'multi-search-css';
        css.textContent = sheet;
        document.getElementsByTagName('head')[0].appendChild(css);
    }

    function getkeyword()
    {
        var keyword = "";
        var keyurl = "";
        var akeyw = ""
        $("#detail > div.tab-con > div:nth-child(1) > div.p-parameter > ul.parameter2.p-parameter-list > li").each(function () {
            var txtLI = $(this).text();
            var ts = "";
            if (txtLI.startsWith("商品名称"))
            {
                ts=txtLI.split("：");
                ts = ts[1].split(" ");
                keyword = ts[0];
                keyurl = encodeURI(keyword+" 评测");
                akeyw = "<a href='https://search.bilibili.com/all?vflag=1&keyword="+keyurl+"&order=click&duration=0&tids_1=0' target='video-iframe'>"+keyword+"</a>&nbsp;&nbsp;";
                $("#keyw").append(akeyw);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: "http://api.pullword.com/get.php?source="+keyword+"&param1=0&param2=1&&json=1",
                    contentType: "application/json",
                    onload: function(res) {
                        if (res.status == 200) {
                            var text = res.responseText;
                            var json = JSON.parse(text);

                            var desc = function(x,y)
                            {
                                return (x.p < y.p) ? 1 : -1
                            }
                            json.sort(desc);

                            for(var i=0;i<json.length;i++)
                            {
                                if(i<3)
                                {
                                    keyword = json[i].t;
                                    keyurl = encodeURI(keyword+" 评测");
                                    akeyw = "<a href='https://search.bilibili.com/all?vflag=1&keyword="+keyurl+"&order=click&duration=0&tids_1=0' target='video-iframe'>"+keyword+"</a>&nbsp;&nbsp;";
                                    $("#keyw").append(akeyw);
                                }
                            }

                            $("#keyw a").unbind('click').click(function(e) {
                                e.preventDefault();
                                var src = $(this).attr('href');

                                var vf = '#vf'+cf;
                                var vf_1 = '#vf'+(-cf);

                                $(vf_1).attr('src',src );
                                $(vf).fadeOut(1500);
                                $(vf_1).delay(1500).fadeIn(1000);

                                cf = -cf;
                            });
                        }
                    }
                })
            }
            else if (txtLI.indexOf("类型")>-1)
            {
                ts=txtLI.split("：");
                ts = ts[1].split("，");
                keyword = ts[0];
                keyurl = encodeURI(keyword+" 评测");
                akeyw = "<a href='https://search.bilibili.com/all?vflag=1&keyword="+keyurl+"&order=click&duration=0&tids_1=0' target='video-iframe'>"+keyword+"</a>&nbsp;&nbsp;";
                $("#keyw").append(akeyw);
            }
            else if (txtLI.startsWith("材质"))
            {
                ts=txtLI.split("：");
                ts = ts[1].split("，");
                keyword = ts[0];
                keyurl = encodeURI(keyword+" 评测");
                akeyw = "<a href='https://search.bilibili.com/all?vflag=1&keyword="+keyurl+"&order=click&duration=0&tids_1=0' target='video-iframe'>"+keyword+"</a>&nbsp;&nbsp;";
                $("#keyw").append(akeyw);
            }
        });

        return keyword;
    }

    if (window.location.host == "search.bilibili.com")
    {
        $("#internationalHeader").remove();
        $("#server-search-app > div > div.head-contain").remove();
        $("#all-list > div.flow-loader > div.filter-wrap").remove();
        $("#bili-search > div.international-footer").remove();
        $("#server-search-app > div > div.rocket-con").remove();
        $("#all-list > div.flow-loader > div.page-wrap").remove();
        $("#all-list > div.flow-loader > ul > li:gt(4)").remove();
        setTimeout(function () { $("div[id^='van-popover']").remove(); }, 1000);
    }
    else
    {
        loadSheet();

        var div_html = '<div class="m m-content" style="display: block;">';
        div_html += '<div class="mt">';
        div_html += '<h3 class="fl">评测视频</h3>';
        div_html += '<div >';
        div_html += '<div id="keyw" class="keyword"></div>';
        div_html += '</div>';
        div_html += '</div>';
        div_html += '<div>';
        div_html += '<iframe id="vf1" class="video-iframe" name="video-iframe"  scrolling="no" src=""/>';
        div_html += '<iframe id="vf-1" style="display:none" class="video-iframe" name="video-iframe"  scrolling="no" src=""/>';
        div_html += '</div>';
        div_html += '</div>';

        var prev_tag = $("div.product-intro");
        if (prev_tag) {
            prev_tag.parent().append(div_html);
        }

        var keyword = getkeyword();
        var keyurl = encodeURI(keyword+" 评测");;
        $('#vf1').attr('src', "https://search.bilibili.com/all?vflag=1&keyword="+keyurl+"&order=click&duration=0&tids_1=0");

        $("#keyw a").click(function(e) {
            e.preventDefault();
            var src = $(this).attr('href');

            var vf = '#vf'+cf;
            var vf_1 = '#vf'+(-cf);

            $(vf_1).attr('src',src );
            $(vf).fadeOut(1500);
            $(vf_1).delay(1500).fadeIn(1000);

            cf = -cf;
        });
    }
})();