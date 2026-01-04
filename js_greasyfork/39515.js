// ==UserScript==
// @icon            http://www.shenzhentong.com/favicon.ico
// @name            深圳通发票填写助手
// @namespace       [url=topivn@Live.cn]topivn@Live.cn[/url]
// @author          tchivs
// @create          2018-03-15
// @lastmodified    2018-03-15
// @description     深圳通开发电子发票一键填写公司抬头信息，请在脚本中填写相应的企业信息即可一键填写
// @match           *://www.shenzhentong.com/service/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.2
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39515/%E6%B7%B1%E5%9C%B3%E9%80%9A%E5%8F%91%E7%A5%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/39515/%E6%B7%B1%E5%9C%B3%E9%80%9A%E5%8F%91%E7%A5%A8%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    /////////////////////////////////////////////////////////////////////////////////////////
    var 企业名= "请填写相应信息";
    var 纳税人识别号= "";
    var 地址= "";
    var 公司电话= "";
    var 开户行名称= "";
    var 开户行账号= "";
    var 手机号码= "";
  /////////////////////////////////////////////////////////////////////////////////////////
    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#click_btn{color:#fa7d3c;}');
    var down_btn_html = '<div >';
    down_btn_html += '<a href="javascript:void(0);" id="click_btn" title="一键填写">';
    down_btn_html += '<span class="apply_btn" node-type="comment_btn_text">';
    down_btn_html += '<span>';
    down_btn_html += '<em >一键填写</em>';
    down_btn_html += '</span>';
    down_btn_html += '</span>';
    down_btn_html += ' </div>';
    //将以上拼接的html代码插入到网页里的table标签中
    var ul_tag = $("div.query_result>table");
    if (ul_tag) {
        ul_tag.removeClass("query_result").addClass("WB_row_r4").append(down_btn_html);
        //选中发票金额
        $(".ipcbcxjg").click();
    }
    $(function () {
        //执行填写按钮的单击事件并调用下载函数
        $("#click_btn").click(function () {
            //展开
            $("div.apply_btn>span").click();
          $("span.company_obj input[name='invoice_obj']").get(0).checked=true;
            $('.company_obj').val();

            $('.self_obj').hide(0);
            $('.firm_obj').show();
            //公司名
            $("#firmfpmc").attr("value",企业名);
            //纳税人识别号
            $("#firmsbh").attr("value",纳税人识别号);
            //地址
            $("#firmaddre").attr("value",地址);
            //公司电话
             $("#firmtel").attr("value",公司电话);
            //开户行名称
             $("#firmyh").attr("value",开户行名称);
            //开户行账号
             $("#firmyhzh").attr("value",开户行账号);
            //手机号码
            $("#firmphone").attr("value",手机号码);
        });
    });
})();