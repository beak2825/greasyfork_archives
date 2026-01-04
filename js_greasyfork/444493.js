// ==UserScript==
// @name        泛微OA样式优化
// @namespace   mornsun.weaver.scrpits
// @match       *://192.168.1.90:8888/*
// @grant       none
// @version     3.1
// @author      meazin
// @run-at document-end
// @license MIT
// @homepageURL  https://greasyfork.org/zh-CN/scripts/444493
// @description 1.优化门户显示样式 2.优化文档显示样式 3.优化邮箱显示样式 4.优化流程显示样式 5.优化文档界面新增推送邮件功能
// @downloadURL https://update.greasyfork.org/scripts/444493/%E6%B3%9B%E5%BE%AEOA%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444493/%E6%B3%9B%E5%BE%AEOA%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

//优化门户首页显示
setInterval(() => {
  $("body").css("color", "#202020");

  $(".wfremindimg")
    .siblings("a")
    .find("font")
    .css({ color: "red", "font-weight": "bold" });

  // $(".header").css({ "background-color": "#333" });
}, 1000);

setTimeout(() => {
  //全屏文档内容区
  $(".wea-doc-detail-content").css({
    width: "70%",
    margin: "0 auto",
    padding: "0",
  });
  //居中文档页面内容
  // $("#weaDocDetailHtmlContent").find("div").attr("align", "center");
  $("#weaDocDetailHtmlContent").css("padding", "20px");
  //折叠下方附件区
  $(".auto-extend-info-con").find(".anticon-cross").click();
}, 1000);

setInterval(() => {
  //移除底部编辑人信息
  if ($(".wea-doc-detail-content-text-sub")) {
    $(".wea-doc-detail-content-text-sub").hide();
  }

  //去除邮箱页头区域
  if ($(".wea-email-main").find(".wea-new-top")) {
    $(".wea-email-main").find(".wea-new-top").hide();
  }
}, 1000);

//如果是工作流程页面，则默认将文本输入框变更为文本域输入框
if (location.href.indexOf("workflow") > -1) {
  setTimeout(function () {
    //将text转换为textarea
    var textList = $("input[type='text']");
    for (var i = 0; i < textList.length; i++) {
      var input = $(textList[i]);
      var id = input.attr("id");
      var textarea = $("<textarea></textarea>").attr({
        type: "textarea",
        class: input.attr("class"),
        name: input.attr("name"),
        style: input.attr("style"),
      });
      textarea.val(input.val());
      textarea.text(input.val());
      input.after(textarea).remove();
      textarea.attr("id", id);
      textarea.height(20);

      //监听文本值变化
      textarea.on("input propertychange", function (e) {
        $(e.target).val(e.target.value);
        $(e.target).text(e.target.value);
      });
    }

    var textareaList = $("textarea");
    for (var i = 0; i < textareaList.length; i++) {
      textareaList[i].style.height = textareaList[i].scrollHeight + 2 + "px";

      //监听文本域标签输入事件，自动撑高
      $(textareaList[i]).on("input propertychange", function (e) {
        //先设置为自动行高保证删除行时可自动伸缩
        e.target.style.height = "20px";
        e.target.style.height = e.target.scrollHeight + 2 + "px";
      });
    }
  }, 2000);
}

//文档模块追加推送邮件功能
function addBtn() {
  var dropBtns = $(".wea-new-top-req-drop-btn");
  if (dropBtns.length == 0) {
    return;
  }
  $(dropBtns[0])
    .parent()
    .prepend(
      '<span style="display: inline-block; line-height: 28px; vertical-align: middle; margin-left: 10px;"><button ecid="_Route@ydk6el_Button@uolti6@BTN_SHARE_DOC_button@xq1ea3" type="button" class="ant-btn ant-btn-primary" id="sendMailBtn"><span>推送邮件</span></button></span>'
    );
  $("#sendMailBtn").on("click", sendMail);
}

function sendMail() {
  var locationUrl = $(".wea-new-top-req-drop-btn").context.URL;
  var matchs = locationUrl.match("(?<=id=).+(?=&)");
  if (matchs.length == 0) {
    return;
  }

  var userId = JSON.parse(localStorage.getItem("theme-account")).userid;
  var docId = matchs[0];
  var docTitle = $(".wea-new-top-req-title-text").find("[title]")[0]["title"];

  var linktype = "37";
  var jumpUrl = "";
  if (locationUrl.indexOf("document") > -1) {
    linktype = "37";
    jumpUrl = `/spa/document/index.jsp?router=1&amp;id=${docId}&amp;isovertime=#/main/document/detail`;
  }
  if (locationUrl.indexOf("workflow") > -1) {
    linktype = "152";
    jumpUrl = `/workflow/request/ViewRequestForwardSPA.jsp?requestid=${docId}`;
  }

  var mouldtext = `<div id="wea_rich_text_default_font" style="font-size:12px;"><p><a contenteditable="false" href="${jumpUrl}" linkid="${docId}" linktype="${linktype}" ondblclick="return false;" style="cursor:pointer;text-decoration:underline !important;margin-right:8px" target="_blank" unselectable="off">${docTitle}</a>&nbsp;</p>
          </div>`;

  $.get("/api/email/add/emailAdd").then((data) => {
    var sessionUuid = JSON.parse(data).email_sendsessionUUid;
    $.post("/api/email/base/send", {
      hrmAccountid: userId,
      isInternal: 1,
      isSendApart: 0,
      flag: -1,
      internaltonew: [],
      internalccnew: [],
      internalbccnew: [],
      usernameTo: [],
      usernameCc: [],
      usernameBcc: [],
      subject: docTitle,
      mouldtext: mouldtext,
      hasfile: 0,
      oldmailid: -1,
      priority: 0,
      savesend: 1,
      texttype: 0,
      needReceipt: 0,
      op_isTimingSend: 0,
      savedraft: 1,
      sessionUUid: sessionUuid,
    }).then((data) => {
      var mailId = JSON.parse(data).mailId;
      window.open(
        `/spa/email/static/index.html#/main/email/new?flag=4&id=${mailId}&isInternal=1`
      );
    });
  });
}
