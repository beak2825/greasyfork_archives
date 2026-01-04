// ==UserScript==
// @name 思迅技术支持平台美化
// @namespace MoeHero
// @version 0.8
// @description 技术支持平台美化
// @run-at document-end
// @match *://www2.sixun.com.cn/*
// @require https://cdn.jsdelivr.net/npm/wangeditor@4.6.17/dist/wangEditor.min.js
// @require http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383016/%E6%80%9D%E8%BF%85%E6%8A%80%E6%9C%AF%E6%94%AF%E6%8C%81%E5%B9%B3%E5%8F%B0%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/383016/%E6%80%9D%E8%BF%85%E6%8A%80%E6%9C%AF%E6%94%AF%E6%8C%81%E5%B9%B3%E5%8F%B0%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

var J = jQuery.noConflict(true);

if(location.pathname == '/' || location.pathname.startsWith('/Account/Login')) {
  setTimeout(() => {
    J('.login-title-2').click();
    J('#CustNo').val('106719');
  }, 0);
  J('#mpanel1').hide();
  J('#ValidateCodeForNormal').val('yes');
  
  var index = J('<input type="button">').addClass('btn btn-secondary radius size-L login-submit').val('登录到首页').on('click', () => login('index'));
  var KB = J('<input type="button">').addClass('btn btn-secondary radius size-L login-submit').css('marginTop', 5).val('登录到知识库').on('click', () => login('KB'));
  var download = J('<input type="button">').addClass('btn btn-secondary radius size-L login-submit').css('marginTop', 5).val('登录到产品下载').on('click', () => login('download'));
  var sixunpay = J('<input type="button">').addClass('btn btn-secondary radius size-L login-submit').css('marginTop', 5).val('登录到思迅Pay申请').on('click', () => login('sixunpay'));
  
  function login(type) {
    J.post('/Account/AjaxLogin', J('#standardForm').serializeArray()).done(r => {
      r = JSON.parse(r);
      if(r.Success) {
        var urls = {
          index: '/Home/Index',
          KB: '/Home/QALogin',
          download: '/Down/List',
          sixunpay: '/Home/O2OLogin',
        };
        location.href = urls[type];
      } else {
        siss.msg.error(r.Message);
      }
    });
  }
  

  J('#standardForm input[type=submit]').parent().append(index);
  J('#standardForm input[type=submit]').parent().append(KB);
  J('#standardForm input[type=submit]').parent().append(download);
  J('#standardForm input[type=submit]').parent().append(sixunpay);
  J('#standardForm input[type=submit]:first-child').remove();
  
} if(location.pathname.startsWith('/webqa/') || location.pathname.startsWith('/WebQA/')) {
  if (localStorage.getItem('Name') == null) {
      var name = prompt('请输入姓名');
      if (name != undefined) localStorage.setItem('Name', name);
  }
  name = localStorage.getItem('Name') == null ? '' : localStorage.getItem('Name');

  var menu = J('#ctl00_Menu1n1').parent();
  var createQuestion = J('<a>').text('提交问题').attr('href', '/WebQA/QA/AddEditQuestion.aspx').addClass('ctl00_Menu1_3').css('marginLeft', 15);
  var separator = J('<a>').text('|').addClass('ctl00_Menu1_3').css('marginLeft', 15);
  
  menu.prepend(separator, createQuestion);
  
  var date = new Date();
  J('#ctl00_Content_Wizard1_txtBb').val(date.getFullYear() + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)).toString() + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()).toString());
  J('#ctl00_Content_Wizard1_txtPoints').val('10');
  J('#ctl00_Content_Wizard1_txtVID').val('10');
  J('#ctl00_Content_Wizard1_txtSerialNo').val('00000000');

  J('#ctl00_Content_QuestionDetails1_RadioButton2').attr('checked', true);
  J('#ctl00_Content_QuestionDetails1_radAppraise_0').attr('checked', true);
  J('#ctl00_Content_QuestionDetails1_txtAddedBy').val(name);

  ////配合CSS样式
  J('#ctl00_Content_gridQuestions td:nth-child(5) span').each(function (i, element) {
      if (J(element).text().trim() == '待用户确认') J(element).addClass('tag-default');
      else if (J(element).text().trim() == '处理中') J(element).addClass('tag-warning');
      else if (J(element).text().trim() == '待处理') J(element).addClass('tag-danger');
      else J(element).addClass('tag-info');
  });
  //var KB = J('#ctl00_Content_Wizard1 .border>*:first-child');
  //if(KB.text().includes('思迅知识库')) KB.hide();
  ////配合CSS样式

  var textarea = [];
  var textarea1 = J('textarea[name="ctl00$Content$QuestionDetails1$txtBody"]');
  var textarea2 = J('textarea[name="ctl00$Content$Wizard1$txtContent"]');
  var textarea3 = J('textarea[name="ctl00$Content$Wizard1$txtContentYY"]');
  var textarea4 = J('textarea[name="ctl00$Content$Wizard1$txtContentXG"]');
  if (textarea1[0] != undefined) textarea.push(textarea1);
  if (textarea2[0] != undefined) textarea.push(textarea2);
  if (textarea3[0] != undefined) textarea.push(textarea3);
  if (textarea4[0] != undefined) textarea.push(textarea4);
  
  for (let t in textarea) {
      textarea[t].hide().parent().append('<div id="editor' + t + '" style="background:#FFF"></div>');
      let editor = new wangEditor('#editor' + t);
      editor.config.onchange = function (html) {
          textarea[t].val(html);
      };
      editor.config.uploadImgMaxSize = 10 * 1024 * 1024;

      editor.config.customUploadImg = function (files, insert) {
          for (let file of files) {
              var formData = new FormData();
              formData.append('token', 'd704d0b5c96042aa943ac223fd79908d');
              formData.append('categories', 'Sixun');
              formData.append('file', file);
              formData.append('v', '2');
              J.ajax({
                  //url: 'https://api.uomg.com/api/image.ali?file=multipart',
                  url: 'https://api.superbed.cn/upload',
                  type: 'POST',
                  cache: false,
                  data: formData,
                  processData: false,
                  contentType: false,
                  dataType: 'JSON',
              }).done(function (res) {
                  if (res.err != 0) {
                      alert(file.name + ' 上传失败!');
                      console.log(res);
                      return;
                  }
                  insert(res.url);
              }).fail(function (res) {
                  alert(file.name + ' 上传失败!');
                  console.log(res);
              });
          }
      };

      editor.create();
      editor.txt.html(textarea[t].val());
  }
}
