// ==UserScript==
// @name         opencart信息管理保持不返回
// @namespace    http://webidea.top/
// @version      2.1.4
// @description  opencart系统在 信息管理页面点击保存的时候阻止其返回上一页
// @author       TamsChan
// @match        *://*/admin/index.php?route=catalog/information/edit&token=*
// @match        *://*/admin/index.php?route=catalog/information/edit&user_token=*
// @icon         https://wiki.greasespot.net/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446470/opencart%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E4%BF%9D%E6%8C%81%E4%B8%8D%E8%BF%94%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/446470/opencart%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E4%BF%9D%E6%8C%81%E4%B8%8D%E8%BF%94%E5%9B%9E.meta.js
// ==/UserScript==
(function() {
  var fs = true
  $('#form-information').submit((e) => {
    if (fs) {
      fs = false
      let form_date = new FormData($('#form-information')[0]);
      let index_ = 0;
      form_date.forEach((value, key) => {
        if (key.indexOf('[title]') != -1 || key.indexOf('[description]') != -1 || key.indexOf('[meta_title]') != -1) {
          if (key.indexOf('[description]') != -1) {
            if ($('.note-editor').length == 0) {
              let el = $('*[name="' + key + '"]')
              let text_ = CKEDITOR.instances[el.attr('id')].getData()
              form_date.set(key, text_)
              if (text_ == '') {
                index_++;
              }
            }
          } else {
            if (value == '') {
              index_++;
            }
          }
        }
      })
      if (index_ == 0) {
        $.ajax({
          url: $('#form-information').attr('action'),
          type: "POST",
          data: form_date,
          contentType: false,
          processData: false,
          complete: (XHR) => {
            fs = true
            if (XHR.status == 200) {
              window.location.href = window.location.href
            }
          }
        })
        return false;
      } else {
        return true;
      }
    }
    return false;
  })
  if (localStorage.getItem('t_language') != null) {
    $('#language li a[href="' + localStorage.getItem('t_language') + '"]').tab('show');
  }
  $(document).on('click', '#language li', function(e) {
    localStorage.setItem('t_language', $(this).find('a').attr('href'))
  })
  document.onkeydown = function(event) {
    if (event.ctrlKey == true && event.keyCode == 83) { //Ctrl+S
      event.preventDefault();
      if (document.querySelector('#content > div.page-header > div > div > button')) {
        document.querySelector('#content > div.page-header > div > div > button').click();
      }
    }
  }
})();
