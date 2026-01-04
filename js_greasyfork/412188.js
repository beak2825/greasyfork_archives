// ==UserScript==
// @name         Github项目批量删除
// @namespace    https://github.com/mengyou658/github-repositories-manage
// @version      1.1.7
// @description  Github项目批量删除，fork的项目太多了，注意：需要先申请操作token，申请地址https://github.com/settings/tokens，请至少选择Delete Repos，如果频繁出现删除失败，请重新生成token（github有限制）
// @author       yunchaoq/mengyou658
// @license      GPL License
// @match        *://github.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @resource     layerCss https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/412188/Github%E9%A1%B9%E7%9B%AE%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/412188/Github%E9%A1%B9%E7%9B%AE%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==
(function () {
  'use strict';
  GM_addStyle(GM_getResourceText('layerCss'))
  // GM_addStyle(GM_getResourceText('layuiCss'))
  var location = window.location.href;
  var pathname = window.location.pathname;
  var userName = pathname.replace("/", "");
  var checkList = [];
  var tmpCode = localStorage.getItem("gitto");

  var detailPageBodyTmp = $('ul[class*="UnderlineNav-body"]');
  var detailPageFlag = detailPageBodyTmp.length && detailPageBodyTmp.find('span[data-content="Settings"]').length;
  let homePageFlag = location.indexOf("tab=repositories") > -1;
  if (homePageFlag || detailPageFlag) {
    init();
  }

  function init() {

    if (homePageFlag) {
      homePageInit();
    }
    if (detailPageFlag) {
      detailPageInit();
    }

    tipsShow();
    $('#user-repositories-code').on('click', function () {
      tipsShow();
      openMsg();
    });
    if (!tmpCode) {
      openMsg();
    }

  }

  function openMsg() {
    layer.prompt({
      title: '输入申请的token，并点击确认，<a href="https://github.com/settings/tokens" target="_blank">点击这里是申请，请至少选择Delete Repos，注意如果频繁出现删除失败，请重新生成token</a>',
      formType: 1
    }, function (token, index) {
      if (token) {
        tmpCode = token;
        localStorage.setItem('gitto', tmpCode);
        layer.closeAll();
      }
    });
  }

  function tipsShow() {
    layer.tips('提示：先输入token，点击<a href="https://github.com/settings/tokens" target="_blank" style="color: red;">这里是申请</a>，请至少选择Delete Repos，注意如果频繁出现删除失败，请重新生成token', '#user-repositories-code', {
      tips: [1,'#2ea44f'] //还可配置颜色
      ,tipsMore:true
      ,time: 0,
    });
  }

  function homePageInit() {
    $(".UnderlineNav-body:first").append('<a href="javascript:void(0);" id="user-repositories-code" class="UnderlineNav-item btn btn-primary " style="background-color: #2ea44f; margin-right: 10px;">输入token</a>');

    $("#user-repositories-list li").each((id, it) => {
      $(it).append('<input type="checkbox" class="user-repositories-list-checkbox" name="repo-check" value="" >');
    });

    $("#user-repositories-list li").on('click', function () {

      let find = $(this).find('.user-repositories-list-checkbox');
      var href = $(this).find('.wb-break-all').find('a').attr('href');
      if (href.indexOf(pathname) > -1) {
        // var repoName = href.replace(pathname + "/", "");
        let index = checkList.indexOf(href);
        if (index > -1) {
          find.prop('checked', false);
          checkList.splice(index, 1);
        } else {
          find.prop('checked', true);
          checkList.push(href);
        }
        if (!$('#user-repositories-delete').length && checkList.length) {
          if (homePageFlag) {
            $(".UnderlineNav-body:first").append('<a href="javascript:void(0);" id="user-repositories-delete" class="UnderlineNav-item btn btn-primary " style="background-color: #2ea44f;">批量删除</a>');
            $("#user-repositories-delete").on('click', function () {
              if (!tmpCode) {
                openMsg();
                return;
              }
              var resList = {};
              var count = 0;
              var promiseList = [];
              checkList.forEach((it) => {
                var tmpPromise = new Promise((resolve, reject) => {
                  var url = 'https://api.github.com/repos' + it
                  $.ajax({
                    url: url,
                    method: 'DELETE',
                    "headers": {
                      "Accept": "application/vnd.github.v3+json",
                      "Authorization": "token " + tmpCode
                    },
                    success: function (data, textStatus, jqXHR) {
                      resList[it] = true;
                      count++;
                      resolve(count);
                    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                      resList[it] = false;
                      count++;
                      resolve(count);
                    }
                  })
                });
                promiseList.push(tmpPromise);
              })

              Promise.all(promiseList).then((count) => {
                var resTxt = "";
                for (var i in resList) {
                  if (resList[i] == true) {
                    resTxt += " 删除【" + i + "】成功<br />";
                  }
                }
                for (var ii in resList) {
                  if (resList[ii] == false) {
                    resTxt += " 删除【" + ii + "】失败<br />";
                  }
                }
                checkList = [];
                layer.msg('删除结果：<br />' + resTxt, function () {
                  window.location.reload();
                });
              });

            });
          }

        } else {
          if (!checkList.length) {
            $("#user-repositories-delete").remove();
          }
        }


      }
    });

  }

  function detailPageInit() {
    detailPageBodyTmp.find('li:last').append('<a href="javascript:void(0);" id="user-repositories-code" class="UnderlineNav-item btn btn-primary " style="background-color: #2ea44f; margin-right: 10px;">输入token</a>');
    if (!tmpCode) {
      openMsg();
    }
    detailPageBodyTmp.find('li:last').append('<a href="javascript:void(0);" id="user-repositories-delete" class="UnderlineNav-item btn btn-primary " style="background-color: #2ea44f;">快速删除当前仓库</a>');
    $("#user-repositories-delete").on('click', function () {
      if (!tmpCode) {
        openMsg();
        return;
      }
      var resList = {};
      var count = 0;
      var promiseList = [];
      var it = $('a[data-pjax="#js-repo-pjax-container"]').attr('href')
      var tmpPromise = new Promise((resolve, reject) => {
        var url = 'https://api.github.com/repos' + it
        $.ajax({
          url: url,
          method: 'DELETE',
          "headers": {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": "token " + tmpCode
          },
          success: function (data, textStatus, jqXHR) {
            resList[it] = true;
            count++;
            resolve(count);
          }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            resList[it] = false;
            count++;
            resolve(count);
          }
        })
      });
      promiseList.push(tmpPromise);

      Promise.all(promiseList).then((count) => {
        var resTxt = "";
        for (var i in resList) {
          if (resList[i] == true) {
            resTxt += " 删除【" + i + "】成功<br />";
          }
        }
        for (var ii in resList) {
          if (resList[ii] == false) {
            resTxt += " 删除【" + ii + "】失败<br />";
          }
        }
        layer.msg('<p style="color:red">注意如果频繁出现删除失败，请重新生成token</p>删除结果：<br />' + resTxt, function () {
          window.location.reload();
        });
      });

    });
  }

})();
