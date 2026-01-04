// ==UserScript==
// @name         客户端-支持私人需求功能定制开发。微信公众号编辑器模板一键导入，支持各大微信编辑器平台。通用于各大自媒体图文平台，包括但不限于微信公众号，B站，bilibili，今日头条，抖音，西瓜视频，知乎等等……
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.08.08.080000
// @description  I try to take over the world!
// @author       Kay
// @match        https://mp.weixin.qq.com/*
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jquery/4.0.0-beta.2/jquery.min.js
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      serv00.net
// @downloadURL https://update.greasyfork.org/scripts/477033/%E5%AE%A2%E6%88%B7%E7%AB%AF-%E6%94%AF%E6%8C%81%E7%A7%81%E4%BA%BA%E9%9C%80%E6%B1%82%E5%8A%9F%E8%83%BD%E5%AE%9A%E5%88%B6%E5%BC%80%E5%8F%91%E3%80%82%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8%E6%A8%A1%E6%9D%BF%E4%B8%80%E9%94%AE%E5%AF%BC%E5%85%A5%EF%BC%8C%E6%94%AF%E6%8C%81%E5%90%84%E5%A4%A7%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E5%B9%B3%E5%8F%B0%E3%80%82%E9%80%9A%E7%94%A8%E4%BA%8E%E5%90%84%E5%A4%A7%E8%87%AA%E5%AA%92%E4%BD%93%E5%9B%BE%E6%96%87%E5%B9%B3%E5%8F%B0%EF%BC%8C%E5%8C%85%E6%8B%AC%E4%BD%86%E4%B8%8D%E9%99%90%E4%BA%8E%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%EF%BC%8CB%E7%AB%99%EF%BC%8Cbilibili%EF%BC%8C%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%EF%BC%8C%E6%8A%96%E9%9F%B3%EF%BC%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/477033/%E5%AE%A2%E6%88%B7%E7%AB%AF-%E6%94%AF%E6%8C%81%E7%A7%81%E4%BA%BA%E9%9C%80%E6%B1%82%E5%8A%9F%E8%83%BD%E5%AE%9A%E5%88%B6%E5%BC%80%E5%8F%91%E3%80%82%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E7%BC%96%E8%BE%91%E5%99%A8%E6%A8%A1%E6%9D%BF%E4%B8%80%E9%94%AE%E5%AF%BC%E5%85%A5%EF%BC%8C%E6%94%AF%E6%8C%81%E5%90%84%E5%A4%A7%E5%BE%AE%E4%BF%A1%E7%BC%96%E8%BE%91%E5%99%A8%E5%B9%B3%E5%8F%B0%E3%80%82%E9%80%9A%E7%94%A8%E4%BA%8E%E5%90%84%E5%A4%A7%E8%87%AA%E5%AA%92%E4%BD%93%E5%9B%BE%E6%96%87%E5%B9%B3%E5%8F%B0%EF%BC%8C%E5%8C%85%E6%8B%AC%E4%BD%86%E4%B8%8D%E9%99%90%E4%BA%8E%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%EF%BC%8CB%E7%AB%99%EF%BC%8Cbilibili%EF%BC%8C%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%EF%BC%8C%E6%8A%96%E9%9F%B3%EF%BC%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    GM_xmlhttpRequest({
        method: "GET",
        url: 'https://1024nettech.serv00.net/wechat_template/wechat_template_sourcecode.txt',
        onload: function (response) {
            let webText = response.responseText;
            GM_setValue("gethtml", webText);
        }
    });
    const url = location.href;
    let logo = "https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1696746563185428.png";
    let popup = `
    <div id="divx-wrapper">
    </div>
    <div id="divx">
        <h1 id="h1x">请输入订单编号或本地导入</h1>
        <input id="orderx">
        <input id="ireader" type="file">
        <p>
            <span style="color:red;">*</span>
            温馨提示：订单编号首次使用后24小时后失效，请于24小时内保存好草稿箱。
        </p>
        <p id="errx"></p>
        <button id="buttonx1">确认</button>
        <button id="buttonx2">取消</button>
        <style id="stylex"></style>
        <script>
            const input = document.querySelector('#ireader');
            input.addEventListener('change', () => {
                const reader = new FileReader();
                reader.readAsText(input.files[0], 'utf8');
                reader.onload = () => {
                    $("#ueditor_0").contents().find("body").html(reader.result);
                    $("#edui1_contentplaceholder").css("display", "none");
                    $("#divx-wrapper,#divx").css("display", "none");
                    GM_deleteValue("gethtml");
                }
            }, false);
        </script>
    </div>
    `;
    $("body").append(popup);
    $("#divx-wrapper,#divx").css("display", "none");
    let style = `
    #edui0x {
    max-height: 22px;
    margin: auto 4px;
    display: inline-block;
    }

    #edui0x img {
    max-width: 18px;
    margin-top: 2px;
    }

    #divx-wrapper {
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        position: fixed;
        top: 0;
        left: 0;
    }

    #divx {
        width: 800px;
        height: 300px;
        margin: auto;
        background-color: #fff;
        z-index: 10000;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: 10px;
        text-align: center;
        padding-bottom: 20px;
    }

    #h1x {
        margin: 30px auto 20px auto;
    }

    #orderx {
        width: 80%;
        height: 30px;
        border-radius: 3px;
        border-width: 1px;
        margin-bottom: 10px;
    }

    #ireader {
        margin-bottom: 10px;
    }

    #errx {
        height:20px;
        margin: 10px auto 30px auto;
        color: red;
    }

    #buttonx1,
    #buttonx2 {
        width: 100px;
        height: 40px;
        background-color: #07c160;
        color: white;
        border-radius: 5px;
        margin-right: 20px;
    }

    #buttonx2 {
        margin-right: 0;
    }
    `;
    $("#stylex").html(style);
    function filleditor(html) {
        $("#ueditor_0").contents().find("body").html(html);
        $("#edui1_contentplaceholder").css("display", "none");
        $("#divx-wrapper,#divx").css("display", "none");
        GM_deleteValue("gethtml");
    }
    if (url.indexOf("mp.weixin.qq.com") !== -1) {
        let logox = `
        <div id='edui0x' class='edui-box edui-button edui-default' data-tooltip='插入模板'>
            <img />
        </div>
        `;
        $("#js_toolbar_0").append(logox);
        $("#edui0x img").attr("src", logo);
        $("#edui0x").click(function () {
            $("#divx-wrapper,#divx").css("display", "block");
            $("#orderx").val("");
            $("#errx").html("");
            $("#orderx").click(function () {
                $("#errx").html("");
            });
            $("#buttonx1").click(function () {
                let a = $("#orderx").val();
                let b = GM_getValue("gethtml");
                let c = Date.now();
                let d = c - parseInt(a.split("T")[1]);
                if (b.indexOf("T") != 0) { $("#errx").html('查询出错，请联系客服！&nbsp;&nbsp;QQ: 626528275（微信同号）'); }
                else {
                    if (a == "T10000") {
                        let templatehtml = "<img src='https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1700115747263998.png'>";
                        filleditor(templatehtml);
                    }
                    else if (b.indexOf(a) !== -1 && d < 86400000) {
                        let templatehtml = $.trim(b.split(a)[1]);
                        filleditor(templatehtml);
                    }
                    else {
                        $("#errx").html("对不起，您输入的订单编号无效，请联系客服！<br />QQ: 626528275（微信同号）");
                        GM_deleteValue("gethtml");
                    }
                }
            });
            $("#buttonx2").click(function () {
                $("#divx-wrapper,#divx").css("display", "none");
            });
        });
    }
})();
/*2024.08.08.080000 - Line : 186*/
