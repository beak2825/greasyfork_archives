// ==UserScript==
// @name        Zentao Utils
// @namespace   Violentmonkey Scripts
// @match       http://zentao.inovance.com/pro/*
// @match       http://10.44.244.63/pro/*
// @icon        https://blog.sbw.so/favicon.ico
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.10
// @license     MIT
// @author      sbw <sbw@sbw.so>
// @description 7/27/2021, 4:53:18 PM
// @downloadURL https://update.greasyfork.org/scripts/430026/Zentao%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/430026/Zentao%20Utils.meta.js
// ==/UserScript==


(function() {
  
  // 显示 alert 对话框
  function show_alert(message)
  {
    bootAlert(message);
  }
  
  // 显示对话框
  function update_dialog(title, content)
  {
    $('#dialog .modal-title').html(title);
    $('#dialog .modal-body').html(content);
  }
  
  // 获取当前项目中的模块分类
  function update_module_on_dialog()
  {
    var url = "/tree-ajaxGetOptionMenu-149-bug-0-0-html--true.html";
    $.get(url, function(data, status){
      update_dialog('更新模块', data);
      
      // 清除事件
      $('.form-control').off('change');
      $('.form-control').removeAttr('onchange');
    });
  }
  
  // 更新任务所属模块
  function update_jobs_module(e)
  {
    // 禁止默认的响应
    e.preventDefault();
    
    update_module_on_dialog();
    
    // 绑定对话框确定按钮的事件
    $('#dialog .btn-primary').off('click');
    var basicInfoPanel = $('#legendBasicInfo');
    if (basicInfoPanel.length > 0) {
      $('#dialog .btn-primary').click(submit_jobs_module_inline);
    } else {
      $('#dialog .btn-primary').click(submit_jobs_module);
    }
  }
  
  function submit_modify_job(jobId, fun)
  {
    // 修改任务的地址
    var url = '/pro/bug-edit-' + jobId + '.html';
    $.get(url, function(data, status) {
      // 从任务修改界面获取初始数据集
      var resData = $.parseHTML(data, true);
      var formData = new FormData($(resData).find('form')[0]);
      fun(resData, formData);

      // 发送数据
      $.ajax({
        type: 'post',
        url: url, 
        data: formData, 
        contentType: false,
        processData: false,
        success: function(data, status) { 
          /*$('html').html(data);*/
          new $.zui.Messager('任务 ' + jobId + ' 更新完成', { icon: 'bell' }).show();
          
          // // 刷新当前页面
          // location.reload();
        }
      });
    });
  }
  
  function submit_jobs_module()
  {
    // 获取选择的数据
    var choose = $('#module').find(":selected").val();
    
    // 隐藏对话框
    $('#dialog').modal('hide');
    
    // 获取选中的任务列表
    $('#bugList tr').filter('.checked').each(function () {
      var id = $(this).find('.c-id input').val();
      var title = $(this).find('.text-left').attr('title');
      if (typeof(title) === "undefined") {
        title = $(this).find('.text-left > a').attr('title');
      }
      
      submit_modify_job(id, function(resData, formData) {
        // 修改所属模块
        formData.set('module', choose);
      });
    });
  }
  
  function submit_jobs_module_inline()
  {
    // 获取选择的数据
    var choose = $('#module').find(":selected").val();
    
    // 隐藏对话框
    $('#dialog').modal('hide');
    
    // 当前任务 id
    var id = $('.label-id').text();
    submit_modify_job(id, function(resData, formData) {
      // 修改所属模块
      formData.set('module', choose);
    });
  }
  
  // 从 bug 页面获取关键词列表
  function get_keywords_from_bug_page()
  {
    var keywords = $('#legendBasicInfo tr:nth-child(25) td:first')[0].childNodes[0].nodeValue;
    keywords = split_keywords(keywords);
    
    return keywords;
  }
  
  // 从 GM 中获取存储的最近使用的关键词列表
  function get_last_recent_used_keywords()
  {
    var default_keywords = ["待评审", "无效", "延期处理", "不复现"]
    var keywords = GM_getValue('last_recent_used_keywords', default_keywords);
    if (!Array.isArray(keywords))
      return default_keywords;
    
    return keywords;
  }
  
  // 更新最近使用的关键词列表
  function update_last_recent_used_keywords(keywords)
  {
    // bug 中的关键词列表
    var bugKeywords = get_keywords_from_bug_page();
    // 上次的关键字列表
    var lastKeywords = get_last_recent_used_keywords();
    // 提交的关键词中去掉 bug 中的
    var newKeywords = keywords.filter(x => !bugKeywords.includes(x));
    
    // 最后的列表中移除新的，并把新的添加到前面
    lastKeywords = lastKeywords.filter(x => !newKeywords.includes(x));
    lastKeywords = newKeywords.concat(lastKeywords);
    if (lastKeywords.length > 10)
      lastKeywords.length = 10;
    
    GM_setValue('last_recent_used_keywords', lastKeywords);
  }
  
  // 分隔关键词列表
  function split_keywords(keywords)
  {
    if (!keywords || keywords.trim().length === 0)
      return [];

    // 分隔已有的关键词列表
    var re = /\s+|,|，|;|；/;
    var keywords = keywords.split(re).map(x => x.trim()).filter(x => x && x.length > 0);
    
    return keywords;
  }
  
  // 更新输入框元素列表
  function update_keywords_input()
  {
    // 是否自定义
    var custom = $('.custom-keywords').is(":checked");
    $('#keywords-input').prop('disabled', !custom);
    
    // 非自定义，由用户输入决定结果
    if (!custom) {
      // 非自定义，由标签决定结果，遍历所有标签
      var keywords = [];
      $('.checkbox input:checked').each(function() {
        keywords.push($(this)[0].nextSibling.nodeValue.trim());
      });
      
      // 输入框数据
      $('#keywords-input').val(keywords.join(", "));
    }
  }
  
  // 用户提交编辑后的关键字列表
  function submit_keywords()
  {    
    var keywords = $('#keywords-input').val();
    keywords = split_keywords(keywords);
    
    // 隐藏对话框
    $('#dialog').modal('hide');
    
    // 关键词列表提交保存
    update_last_recent_used_keywords(keywords);
    
    // 提交修改
    var keywords = keywords.join(", ");
    
    // 当前任务 id
    var id = $('.label-id').text();
    submit_modify_job(id, function(resData, formData) {
      // 修改关键字数据
      formData.set('keywords', keywords);
    });
  }
  
  function assign_back(e) {
    // 禁止默认的响应
    e.preventDefault();
    
    // 获取选中的任务列表
    $('#bugList tr').filter('.checked').each(function () {
      var id = $(this).find('.c-id input').val();
      
      submit_modify_job(id, function(resData, formData) {
        // 找到创建者名字和 id
        var creater = $(resData).find('.detail:nth-child(3) > .table-form td:first').text();
        var creater_id = '';
        
        var options = $(resData).find('#assignedTo > option');
        for (var i = 0; i != options.length; ++i) {
          if (options[i].title == creater) {
            creater_id = options[i].value;
            break;
          }
        }
        
        formData.set('assignedTo', creater_id);
      });
    });
  }
  
  function update_jobs_keywords(e)
  {
    // 禁止默认的响应
    e.preventDefault();
    
    // 获取当前关键词列表
    var keywords = get_keywords_from_bug_page();
    
    // 最后使用的 keywords
    var last_keywords = get_last_recent_used_keywords();
    
    // 合并去重后的选项列表
    var options = keywords.filter(x => !last_keywords.includes(x)).concat(last_keywords);
    // 创建选项组
    var divBox = $("<div></div>");
    options.forEach(x => {
      var select = $("<div class='checkbox'><label><input type='checkbox'>" + x + "</label></div>");
      
      // 勾选事件
      $(select).find('input').change(update_keywords_input);
      if (keywords.includes(x)) {
        $(select).find('input').prop('checked', true);
      }
      
      $(divBox).append(select);
    });
    // 输入框
    var inputGroup = $("<div class='checkbox'><label><input class='custom-keywords' type='checkbox'>自定义</label>&nbsp;<div class='input-control'><input id='keywords-input' type='text' class='form-control'></div></div>");
    // 标签和输入框居中
    $(inputGroup).css({"display": "flex", "align-items": "center"});
    // 输入框伸长
    $(inputGroup).find('.input-control').css({"flex-grow": "1"});
    // 输入框勾选自定义
    $(inputGroup).find('.custom-keywords').change(update_keywords_input);
    $(divBox).append(inputGroup);
    
    // 更新对话框
    update_dialog('更新关键词', divBox);  
    // 更新对话框的提交事件
    $('#dialog .btn-primary').off('click');
    $('#dialog .btn-primary').click(submit_keywords);
    // 更新元素状态
    update_keywords_input();
  }
  
  // 添加对话框
  $("body").append("<div class='modal fade' id='dialog'><div class='modal-dialog modal-sm'><div class='modal-content'><div class='modal-header'><h4 class='modal-title'></h4></div><div class='modal-body'></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button><button type='button' class='btn btn-primary'>保存</button></div></div></div></div>");

  // 添加模块修改按钮
  $('.table-actions').append('<button class="btn" id="update-module" data-toggle="modal" data-target="#dialog">修改所属模块</button>');
  // 更新模块点击的事件
  $('#update-module').click(update_jobs_module);
  
  // 添加一键指回 bug 提出人按钮
  $('.table-actions').append('<button class="btn" id="assign-back">指派给提出人</button>');
  // 事件
  $('#assign-back').click(assign_back);

  // 如果在 bug view 界面，增加快速修改按钮
  var basicInfoPanel = $('#legendBasicInfo');
  if (basicInfoPanel.length > 0)
  {
    // 更新模块
    var btn = '<button class="btn" id="update-module-x" data-toggle="modal" data-target="#dialog">更新模块</button>';
    $('#legendBasicInfo tr:nth-child(2) td:first').append(btn);
    $('#update-module-x').click(update_jobs_module);
    
    // 更新关键词
    var btn = '<button class="btn" id="update-keywords-x" data-toggle="modal" data-target="#dialog">更新关键词</button>';
    $('#legendBasicInfo tr:nth-child(25) td:first').append(btn);
    $('#update-keywords-x').click(update_jobs_keywords);
  }
  
  // 如果在 bug 列表界面，计算 bug 解决率
  if ($('.table-footer > .text').length > 0) 
  {
    var items = $('.table-footer > .text > strong');
    var total = parseInt($(items[0]).text(), 10);
    var unresolved = parseInt($(items[1]).text(), 10);
    
    $('.table-footer > .text > strong:last-child').after('，解决率 <strong>' + (100.0 * (total - unresolved) / total).toFixed(2) + '%</strong>');
  }
})();
