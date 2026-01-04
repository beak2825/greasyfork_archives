// ==UserScript==
// @name         he_config_manager
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  HE配置管理工具页面增强
// @author       dong.luo@happyelements.com
// @include      /^http[s]*:\/\/config.*\.happyelements\..*$/
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://lib.baomitu.com/jszip/3.5.0/jszip.min.js
// @require      https://lib.baomitu.com/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414963/he_config_manager.user.js
// @updateURL https://update.greasyfork.org/scripts/414963/he_config_manager.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // 配置
  var configs = {
    "options" : {
      "hidden_del_link" : true,
      "hidden_history_link" : true,
      "hidden_lock_link" : true,
      "hidden_diff_link" : true,
      "open_diff_window" : true,
      "hidden_deploy_all_link" : true,
      "selected_line_highlight" : true,
      "selected_line_deploy" : true,
      "prod_page_bg" : true,
      "show_highlight_keyword" : true,
      "cancel_check_all" : true,
      "show_checked_count" : true,
      "esc_close_diff_pop" : true,
      "deploy_file_version_check" : false,
      "show_diff_files" : false,
      "show_download_link" : false,
      "show_right_gap" : true,
      "hidden_diff_padding" : true,
      "show_history_diff3" : true,
      "show_diff_filename" : true,
      "show_diff_big_font" : true,
      "show_app_alias_name" : true
    },
    "folds" : {
      "link_fold" : 0,
      "option_fold" : 1,
      "filter_fold" : 1
    },
    "filter" : {
      "switch": false,
      "value" : ""
    },
    "referer" : {
      "SH01": ""
    }
  };

  // 项目配置（配置顺序要注意：name_prefix长的在前，短的在后，否则会匹配错误）
  var appConfigs = [
    {"app_id":"55", "app_name_prefix":"clover_singapore", "app_jsp":"https://clovesingapore.clover.barleygame.com/app.jsp"},
    {"app_id":"55", "app_name_prefix":"clover_india", "app_jsp":"https://cloveindia.clover.barleygame.com/app.jsp"},
    {"app_id":"59", "app_name_prefix":"clover_en", "app_jsp":"http://cloveren.he-games.com/app.jsp"},
    // {"app_id":"61", "app_name_prefix":"h5clover_botim", "app_jsp":"https://h5cloverbotim.happyelements.com/app.jsp"}, //clover-h5-botim
    // {"app_id":"61", "app_name_prefix":"h5clover_shouter1", "app_jsp":"https://h5cloverbotim.happyelements.com/app.jsp"}, //clover-h5-botim-dev
    {"app_id":"61", "app_name_prefix":"h5clover", "app_jsp":"https://h5clover.happyelements.cn/app.jsp"},
    {"app_id":"61", "app_name_prefix":"h5clvoer", "app_jsp":"https://h5clover.happyelements.cn/app.jsp"}, //clover-h5
    {"app_id":"55", "app_name_prefix":"clover", "app_jsp":"https://clover.happyelements.cn/app.jsp"},
    {"app_id":"88", "app_name_prefix":"x001_app", "app_jsp":"https://appxplan.happyelements.cn/app.jsp"},
    {"app_id":"88", "app_name_prefix":"x001_h5", "app_jsp":"https://h5xplan.happyelements.cn/app.jsp"},
    {"app_id":"88", "app_name_prefix":"x001_tw", "app_jsp":"https://xstorytw.he-games.com/app.jsp"},
    {"app_id":"88", "app_name_prefix":"x001", "app_jsp":"https://h5xplan.happyelements.cn/app.jsp"}, //x001-h5
    {"app_id":"96", "app_name_prefix":"SH01_out", "app_jsp":"https://sh01dev.happyelements.cn/app.jsp"}, // SH01_out
    {"app_id":"96", "app_name_prefix":"SH01_prod", "app_jsp":"https://holiday-game.happyelements.cn/app.jsp"}, // SH01_prod
    {"app_id":"96", "app_name_prefix":"SH01_h5prod", "app_jsp":"https://holiday-h5game.happyelements-sh.cn/app.jsp"}, // SH01_h5prod0
    {"app_id":"96", "app_name_prefix":"SH01_appprod", "app_jsp":"https://holiday-appgame.happyelements-sh.cn/app.jsp"}, // SH01_appprod0
    {"app_id":"96", "app_name_prefix":"SH01_channel", "app_jsp":"https://holiday-channel.happyelements-sh.cn/app.jsp"}, // SH01_channel0
    {"app_id":"96", "app_name_prefix":"SH01", "app_jsp":"https://holiday-game.happyelements.cn/app.jsp"}, // SH01_dev
  ];

  // 定制化链接
  var customLinks = [
     {"type":"config", "name":["H5", "DS", "BT", "LD", "TW" /*, "新", "印"*/], "url":[
       "/config/list.do?appName=h5clover_ld",
       "/config/list.do?appName=h5clover_design1",
       "/config/list.do?appName=h5clover_shouter1",
       "/config/list.do?appName=clover_ld",
       "/config/list.do?appName=clover_en_vpc_prod0",
       //"/config/list.do?appName=clover_singapore_prod0",
       //"/config/list.do?appName=clover_india_prod0",
     ]},
    //{"type":"sync", "name":"测试", "url":"https://www.test.com/"},
  ];

  // 配置查看页中需要高亮显示的关键字列表
  var highlightKeywords = {
    // 'xml文件名': ['关键字1', '关键字2', ...]
    //'global.xml': ['max_level_preopen', 'head_island_id', 'max_level'],
    //'maintenance.xml': ['SnapshotPercent'],
  };

  // appName别名
  var appAliasNames = {
    "h5clover_shouter": "dev",
    "h5clover_shouter0": "dev1",
    "h5clover_shouter1": "dev2",
    "h5clover_shouter2": "dev3",
  };

  var jsonpUrl = "https://clover.happyelements.net/ciservice/helper/test_app_env_jsonp.php";
  //var jsonpUrl = "https://shdevapi.happyelements.cn/test_app_env_jsonp.php";
  //var jsonpUrl = "https://dev.kuco/he/test_app_env_jsonp.php";

  //==========================================
  // var $ = window.jQuery;
  var $ = window.jQuery.noConflict(true);

  // 修复原页面BUG
  fixPageBugs();

  // 加载本地设置
  loadConfigData();

  // 注入
  appendToolbar();

  // 折叠控制
  setToolbarFoldListener();

  // XML搜索过滤器
  setXmlFilterListener();

  // 选项处理器
  setOptionHandler("hidden_del_link", handlerHiddenDelLink);
  setOptionHandler("hidden_history_link", handlerHiddenHistoryLink);
  setOptionHandler("hidden_lock_link", handlerHiddenLockLink);
  setOptionHandler("hidden_diff_link", handlerHiddenDiffLink);
  setOptionHandler("open_diff_window", handlerOpenDiffWindow);
  setOptionHandler("hidden_deploy_all_link", handlerHiddenDeployAllLink);
  setOptionHandler("selected_line_highlight", handlerSelectedLine);
  setOptionHandler("selected_line_deploy", handlerSelectedLine);
  setOptionHandler("prod_page_bg", handlerProdPageBg);
  setOptionHandler("show_highlight_keyword", handlerShowHighlightKeyword);
  setOptionHandler("cancel_check_all", handlerCancelCheckAll);
  setOptionHandler("show_checked_count", handlerShowCheckedCount);
  setOptionHandler("esc_close_diff_pop", handlerEscCloseDiffPop);
  setOptionHandler("deploy_file_version_check", handlerDeployFileVersionCheck);
  setOptionHandler("show_diff_files", handlerShowDiffFiles);
  setOptionHandler("show_download_link", handlerShowDownloadLink);
  setOptionHandler("show_right_gap", handlerShowRightGap);
  setOptionHandler("hidden_diff_padding", handlerHiddenDiffPadding);
  setOptionHandler("show_history_diff3", handlerShowHistoryDiff3);
  setOptionHandler("show_diff_filename", handlerShowDiffFilename);
  setOptionHandler("show_diff_big_font", handlerShowDiffBigFont);
  setOptionHandler("show_app_alias_name", handlerShowAppAliasName);


  // 初始化
  initToolBar();

  //==========================================
  // 初始化
  function initToolBar() {
    //重置现场
    initReset();

    //获取配置
    var appName = getAppName();
    if (!appName) {
      initFail("appName 获取失败！");
      return;
    }
    var appConfig = getAppConfig(appName);
    if (appConfig.app_jsp == undefined) {
      initFail("appConfig 获取失败！");
      return;
    }

    // 得到“线上/stage”验证地址
    var appJspUrl = appConfig.app_jsp;
    var appNamePrefix = appConfig.app_name_prefix;
    var refererAppNamePrefix = configs["referer"][appNamePrefix]; // 检查appJspUrl是否需要变更
    if (refererAppNamePrefix) {
      // 当前appNamePrefix下有指定需要使用refererAppNamePrefix的appJspUrl
      for (var i=0; i<appConfigs.length; i++) {
        var currAppConfig = appConfigs[i];
        if (currAppConfig.app_name_prefix == refererAppNamePrefix) {
          appJspUrl = currAppConfig.app_jsp;
          break;
        }
      }
    }
    if (!appJspUrl) {
      initFail("appJspUrl 获取失败！");
      return;
    }
    $.ajax({
      url: jsonpUrl + "?appJsp=" + encodeURIComponent(appJspUrl),
      type: "GET",
      dataType: "jsonp",
      success: function (resultObj) {
        //{"code":0, "msg":"", "data":{"prod_name":"clover_prod0", "prod_prefix":"clover_prod", "prod_id":0}}
        if (!resultObj) {
          initFail("dataObj 获取失败！");
          return;
        }
        if (resultObj.code != 0) {
          initFail(resultObj.msg);
          return;
        }

        //成功
        initSuccess(appConfig, resultObj.data);
      }
    });
  }

  function initFail(msg) {
    //console.error(msg);
    $("#span_env_name").html(msg);
    $(".ld-toolbar .title").css({"display":"none"});
    $(".ld-toolbar .config").css({"display":"none"});
    $(".ld-toolbar .options").css({"display":"none"});
  }

  function initSuccess(appConfig, dataObj) {
    var prodName = dataObj.prod_name;
    var prodPrefix = dataObj.prod_prefix;
    var prodId = dataObj.prod_id;

    //得到stage
    var stageId = prodId==1 ? 0 : 1;
    var stageName = prodPrefix + stageId;

    //得到dev
    var devId = 0;
    var devName = appConfig.app_name_prefix + "_dev"; // DEV的名称
    var mergeDiffDevName = ""; // 在合并页中，DEV的名称
    if (appConfig.app_name_prefix == "x001_tw") {
      devName = "x001_tw_shdev";
    }else if (appConfig.app_name_prefix == "x001_app") {
      devName = "x001_app_dev";
    }else if(appConfig.app_name_prefix == "x001_h5" || appConfig.app_name_prefix == "x001") {
      devName = "x001_shdev";
    }else if(appConfig.app_name_prefix == "h5clover" || appConfig.app_name_prefix == "h5clvoer") {
      devName = "h5clover_shouter";
    }else if(appConfig.app_name_prefix == "h5clover_botim" || appConfig.app_name_prefix == "h5clover_shouter1") {
      devName = "h5clover_shouter1";
    }else if(appConfig.app_name_prefix == "clover_india") {
      devName = "clover_india_dev";
    }else if(appConfig.app_name_prefix == "clover_singapore") {
      devName = "clover_singapore_dev";
      mergeDiffDevName = "clover_india_dev";
    }else if(appConfig.app_name_prefix == "clover_en") {
      // 不加devId
    }else if(appConfig.app_name_prefix == "SH01_out" || appConfig.app_name_prefix == "SH01_prod" || appConfig.app_name_prefix == "SH01_h5prod" || appConfig.app_name_prefix == "SH01_appprod" || appConfig.app_name_prefix == "SH01_channel" || appConfig.app_name_prefix == "SH01") {
      if (appConfig.app_name_prefix == "SH01_channel") {
        devName = "SH01_channeldev";
      }else if (appConfig.app_name_prefix == "SH01_h5prod") {
        devName = "SH01_h5dev";
      }else {
        devName = "SH01_dev";
      }

      // 记录下当前的appName，用于在SH01_dev环境下，继续使用前一个app_name_prefix的app_jsp作为“线上、stage”的验证地址
      if(appConfig.app_name_prefix == "SH01_out" || appConfig.app_name_prefix == "SH01_prod" || appConfig.app_name_prefix == "SH01_h5prod" || appConfig.app_name_prefix == "SH01_appprod" || appConfig.app_name_prefix == "SH01_channel") {
        if (configs["referer"]["SH01"] != appConfig.app_name_prefix) {
          renewConfigData("referer", "SH01", appConfig.app_name_prefix);
        }
      }
    }else {
      devName += devId;
    }
    if (mergeDiffDevName == "") {
      mergeDiffDevName = devName;
    }

    //设置
    $("#span_env_name").html(prodName);

    //appId
    var appId = appConfig.app_id;

    //链接
    var baseUrl = "";
    $("#a_page_dev").attr("href", baseUrl+"/config/list.do?appName="+devName);
    $("#a_page_stage").attr("href", baseUrl+"/config/list.do?appName="+stageName);
    $("#a_page_prod").attr("href", baseUrl+"/config/list.do?appName="+prodName);
    $("#a_sync_dev_to_stage").attr("href", baseUrl+"/merge/mergeDiff.do?settingName="+mergeDiffDevName+"->"+stageName+"&pId="+appId);
    $("#a_sync_dev_to_prod").attr("href", baseUrl+"/merge/mergeDiff.do?settingName="+mergeDiffDevName+"->"+prodName+"&pId="+appId);
    $("#a_sync_prod_to_stage").attr("href", baseUrl+"/merge/mergeDiff.do?settingName="+prodName+"->"+stageName+"&pId="+appId);
    $("#a_sync_stage_to_prod").attr("href", baseUrl+"/merge/mergeDiff.do?settingName="+stageName+"->"+prodName+"&pId="+appId);

    // 更新“首页”链接地址
    $("a[href='/app/list.do']").each(function () {
      if ($(this).html() == "首页") {
        $(this).attr("href", "/app/list.do?filterProjId="+appId);
      }
    });

    //定制化 - 块
    $("#div_extend_config").html(genExtendConfigHtmlCode(appConfig));

    //定制化 - 链接
    for (var i = 0; i < customLinks.length; i++) {
      var linkInfo = customLinks[i];
      var htmlCode = '';
      if (Array.isArray(linkInfo.name)) {
        htmlCode += '<div>';
        for (var j = 0; j < linkInfo.name.length; j++) {
          htmlCode += (j==0?'':'<span style="padding:0 2px;"></span>')+'<a href="'+linkInfo.url[j]+'">'+linkInfo.name[j]+'</a>';
        }
        htmlCode += '</div>';
      }else {
        htmlCode = '<div><a href="'+linkInfo.url+'">'+linkInfo.name+'</a></div>';
      }
      $("#div_"+linkInfo.type+"_links").append(htmlCode);
    }

    //背景色
    handlerProdPageBg();

    //初始化发布信息展示（得到stage运行状态）
    initDeployInfo();
  }

  function initReset() {
    $("#span_env_name").html("加载中...");
    $("#a_page_dev").attr("href", "#");
    $("#a_page_stage").attr("href", "#");
    $("#a_page_prod").attr("href", "#");
    $("#a_sync_dev_to_stage").attr("href", "#");
    $("#a_sync_dev_to_prod").attr("href", "#");
    $("#a_sync_prod_to_stage").attr("href", "#");
    $("#a_sync_stage_to_prod").attr("href", "#");
  }

  //初始化发布信息展示
  function initDeployInfo() {
    //获取配置
    var appName = getAppName();
    if (!appName) {
      return; //appName 获取失败！
    }
    var appConfig = getAppConfig(appName);
    if (appConfig.app_jsp == undefined) {
      return; //appConfig 获取失败！
    }
    var appJspUrl = appConfig.app_jsp;
    if (!appJspUrl) {
      return; //appJspUrl 获取失败！
    }
    var qaFlag = "qa=white";
    if(appConfig.app_name_prefix.indexOf("h5clover") != -1 || appConfig.app_name_prefix.indexOf("h5clvoer") != -1) {
      qaFlag = "env=qa";
    }
    $.ajax({
      url: jsonpUrl + "?appJsp=" + encodeURIComponent(appJspUrl+"?"+qaFlag),
      type: "GET",
      dataType: "jsonp",
      success: function (resultObj) {
        //{"code":0, "msg":"", "data":{"prod_name":"clover_prod0", "prod_prefix":"clover_prod", "prod_id":0}}
        if (!resultObj) {
          return; //dataObj 获取失败！
        }
        if (resultObj.code != 0) {
          return;
        }

        //成功
        var prodName = $("#span_env_name").html();
        if (prodName != resultObj.data.prod_name) {
          $("#span_deploy_info").html("（stage已开启）");
        }else {
          $("#span_deploy_info").html("");
        }
      }
    });
  }

  //得到app配置
  function getAppConfig(appName) {
    var appConfig = {};
    for (var i = 0; i < appConfigs.length; i++) {
      var appNamePrefix = appConfigs[i].app_name_prefix;
      if (appName.indexOf(appNamePrefix) != -1) {
        appConfig = appConfigs[i];
        break;
      }
    }
    return appConfig;
  }

  //得到当前页面的appName，区分是哪个项目
  function getAppName() {
    //URL参数判断
    var appName = getUrlParam("appName");
    if(!appName) {
      appName = getUrlParam("settingName");
    }

    //页面元素判断
    var pageUrl = window.location.pathname;

    //页面：mergeDiff.do
    if (!appName && pageUrl.indexOf("mergeDiff.do") != -1) {
      $("h1").each(function () {
        var h1Code = $(this).html();
        if (h1Code.indexOf("From") != -1) {
          var arr = h1Code.split(" - ");
          if (arr && arr.length == 2) {
            appName = arr[1];  // 特殊：不是一个具体的appName值，而是类似：From (clover_dev0) To (clover_ld)
          }
        }
      });
    }

    //页面：showMergeApp.do、doMerge.do
    if (!appName && (pageUrl.indexOf("showMergeApp.do") != -1 || pageUrl.indexOf("doMerge.do") != -1)) {
      var radioName = "";
      if($('input[name="settingName"]').size() > 0) {
        radioName = "settingName";
      }else if($('input[name="srcAppName"]').size() > 0) {
        radioName = "srcAppName";
      }

      if(radioName != "") {
        var radioVal = $('input[name="'+radioName+'"]:checked').val();
        if (!radioVal) {
          //没有选中时，取第一个单选按钮的值
          radioVal = $('input[name="'+radioName+'"]').eq(0).val();
        }
        appName = radioVal;

        //绑定事件
        $('input[name="'+radioName+'"]').off("click").on("click", function() {
          var settingAppConfig = getAppConfig($(this).val());
          var prodAppConfig = getAppConfig($("#span_env_name").html());
          if (settingAppConfig.app_name_prefix != prodAppConfig.app_name_prefix) {
            initToolBar();
          }
        });
      }
    }

    //页面：list.do
    if (!appName && pageUrl.indexOf("list.do") != -1) {
      var tr = $("#appListTab tr").eq(1);
      if (tr) {
        var th = $("th", tr).eq(0);
        appName = th.attr("ld-origin-app-name"); // 1、获取保存好的原始值
        if (!appName) {
          appName = th.html(); // 2、获取原始值
        }
      }
    }

    // 返回
    return !appName ? "" : appName;
  }

  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
  }

  // 设置选项处理器
  function setOptionHandler(optName, handler) {
    if (configs.options[optName]) {
      $("#chk_opt_"+optName).prop("checked", true);
      handler();
    }
    $("#chk_opt_"+optName).off("change").on("change", function() {
      var checked = $(this).prop("checked");
      renewConfigData("options", optName, checked);
      handler();
    });
  }

  //处理器：取消全选
  function handlerCancelCheckAll() {
    var cancel = isChecked("chk_opt_cancel_check_all");

    //特定的页面
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("mergeDiff.do") == -1) {
      return;
    }
    $("table tr th").each(function () {
      if($(this).html().indexOf("全选") == -1) {
        return;
      }
      var checkbox = $("input[type=checkbox]", $(this));
      if (!checkbox) {
        return;
      }

      if (cancel) {
        //默认取消全选
        if (checkbox.prop("checked") == true) {
          checkbox.click(); //true->false
        }
      }else {
        //不取消全选
        if (checkbox.prop("checked") == false) {
          checkbox.click(); //false->true
        }
      }
    });
  }

  // 处理器：显示勾选的文件数量
  function handlerShowCheckedCount() {
    var displayFlag = isChecked("chk_opt_show_checked_count");

    //特定的页面
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("mergeDiff.do") == -1) {
      return;
    }

    //插入显示容器
    var htmlCode = '<span id="span_checked_count" style="display: none; font-size: 14px; padding-left: 20px; font-weight: bold;">已选中：<span id="span_checked_num" style="color:red;">0</span></span>';
    $('#diffFileTab').before(htmlCode);
    $("#span_checked_count").css({"display": (displayFlag ? "inline" : "none")});

    //勾选框点击事件
    $("input[type=checkbox]", $("#diffFileTab")).off("change").on("change", function() {
      var cnt = 0;
      $("input[type=checkbox]", $("#diffFileTab tr td")).each(function () {
        if ($(this).prop("checked") == true) {
          cnt++;
        }
      });
      $("#span_checked_num").html(cnt);
    });
  }

  // 处理器：合并页Esc关闭弹层
  function handlerEscCloseDiffPop() {
    var closeFlag = isChecked("chk_opt_esc_close_diff_pop");
    if (!closeFlag) {
      return;
    }

    //特定的页面
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("mergeDiff.do") == -1) {
      return;
    }

    // 按键事件监听
    $(document).keyup(function (event) {
      switch (event.keyCode) {
        case 27:
          // ESC键
          let closeFlag = isChecked("chk_opt_esc_close_diff_pop");
          if (closeFlag && $(".generic_dialog").size() == 1 && $(".pop_dialog").size() == 1) {
            // 模拟点击弹出层上的"关闭"按钮
            ZYL.pop.hide();
          }
          break;
      }
    });
  }

  // 处理器：合并页显示版本号双重检查
  function handlerDeployFileVersionCheck() {
    let isOpen = isChecked("chk_opt_deploy_file_version_check");

    //特定的页面
    let pageUrl = window.location.pathname;
    if (pageUrl.indexOf("mergeDiff.do") == -1) {
      return;
    }

    // 检查表格
    let tableObj = $("#diffFileTab");
    if (!tableObj) {
      return;
    }
    let fileNameTh = $("tbody tr th", tableObj).eq(1); // “文件名”那一个表头单元格

    let htmlInitFlag = $('.ld-deploy-file-version-check', tableObj).size() > 0; // true：已经注入过html代码了
    let verInitFlag = tableObj.attr("data-verInitFlag"); // 1表示已经初始化过列表中每个文件的版本号了
    let verShowFlag = tableObj.attr("data-verShowFlag"); // 1表示当前正在展示文件的版本号

    // 开始处理
    if (isOpen) {
      // 开启版本双重检查
      // 1、HTML代码初始化
      if (!htmlInitFlag) {
        // 初始化html代码
        // 1.1、备份表格宽度，设置为新宽度
        let tableOldWidth = tableObj.css("width");
        tableObj.attr("data-oldWidth", tableOldWidth);
        // 1.2、备份单元格宽度，设置新宽度值
        let thOldWidth = fileNameTh.attr("width");
        fileNameTh.attr("data-oldWidth", thOldWidth);
        // 1.3、插入单元格
        $("tbody tr", tableObj).each(function (index) {
          if (index === 0) {
            // 1.3.1、表头
            $(this).append("<th class='ld-deploy-file-version-check ld-file-version-init' width='10%'>版本号</th>")
                .append("<th class='ld-deploy-file-version-check ld-file-version-last' width='10%'>最新版本号</th>");
          } else {
            // 1.3.2、值单元格
            let fileName = $("td", $(this)).eq(1).html();
            $(this).append("<td class='ld-deploy-file-version-check ld-file-version-init' data-fn='"+fileName+"'></td>")
                .append("<td class='ld-deploy-file-version-check ld-file-version-last' data-fn='"+fileName+"'></td>");
          }
        });
        // 1.4、插入发布按钮
        $('.PPRSbmtBtn[value="Copy and Deploy"]').after('<input type="button" class="PPRSbmtBtn ld-button-deploy-after-version-check" value="Copy and Deploy after VersionCheck" style="margin-left: 30px;"/>')

        // 1.5、绑定发布按钮事件
        $(".ld-button-deploy-after-version-check").on("click", function() {
          // 得到已勾选的文件名
          var fileNames = [];
          $('input[type="checkbox"][name="files"]:checked').each(function(){
            var fileName = $(this).val();
            fileNames.push(fileName);
          });
          // 得到“源AppName”
          var fromAppName = $('input[name="srcAppName"]').val();
          // 得到这些文件最新的版本号
          var sameVerNum = 0;  // 版本号相同（可以发布）的数量
          var diffVerNum = 0;  // 版本号不一致（不可以发布）的文件数量
          for (let i = 0; i < fileNames.length; i++) {
            let fileName = fileNames[i];
            $.ajax({
              url: '/api/fileInfo.do',
              type: "POST",
              beforeSend: function(request) {
                request.setRequestHeader("Authorization","Basic c2VydmljZV9hdXRoOnF3ZXIxMjM0IQ==");
              },
              headers:{'Authorization': 'Basic c2VydmljZV9hdXRoOnF3ZXIxMjM0IQ=='},
              data: "appName="+fromAppName+"&fileName="+fileName,
              success: function(xml,s,v) {
                // <file appName="clover_dev0" fileName="target_complete_expect.xml" curVersion="1772" onlineVersion="1772" lastModifyTime="2024-11-23 07:30:18" lastDeployTime="2024-11-23 07:30:29"/>
                if (!xml) {
                  return;
                }
                var xmlString = new XMLSerializer().serializeToString(xml);
                var matchArr = xmlString.match(/fileName="(.+?)".+?onlineVersion="(.+?)"/);
                if (matchArr && matchArr.length >= 3) {
                  var rtnFileName = matchArr[1];
                  var rtnOnlineVersion = matchArr[2];

                  var lastVersion = "";
                  var initVersion = $('.ld-file-version-init[data-fn="'+rtnFileName+'"]').html();
                  if (initVersion == rtnOnlineVersion) {
                    sameVerNum++;
                    //lastVersion = rtnCurVersion;
                    lastVersion = "<span style='color:green;'>"+rtnOnlineVersion+"</span>";
                  }else {
                    diffVerNum++;
                    lastVersion = "<span style='color:red;'>"+rtnOnlineVersion+"</span>";
                  }
                  $('.ld-file-version-last[data-fn="'+rtnFileName+'"]').html(lastVersion);

                  // 检查是否可以执行发布了
                  if((sameVerNum + diffVerNum) == fileNames.length) {
                    // 都检查完了
                    if (diffVerNum > 0) {
                      alert('部分配置文件的版本有更新，请刷新页面，重新对比后发布！');
                      return;
                    }else {
                      // 可以正常发布了
                      setTimeout(function(){
                        $('.PPRSbmtBtn[value="Copy and Deploy"]').eq(0).click();
                      }, 200);
                    }
                  }
                }
              }
            }); //end-ajax
          }// end-for
        });
      }

      // 2、是否展示单元格
      if (verShowFlag !== "1") {
        // 设置展示标识，保证不会重复展示
        tableObj.attr("data-verShowFlag", "1");

        // 开始展示单元格
        tableObj.css({"width": "1230px"});
        fileNameTh.attr("width", "");
        $('.ld-deploy-file-version-check', tableObj).css({"display":""});
        $(".ld-button-deploy-after-version-check").css({"display":""});
      }

      // 3、是否获取初始版本号
      if (verInitFlag !== "1") {
        // 设置标识
        tableObj.attr("data-verInitFlag", "1");

        // 得到“源AppName”
        var fromAppName = $('input[name="srcAppName"]').val();

        // 逐一检查
        if (fromAppName) {
          $("tr", tableObj).each(function(index){
            if (index <= 0) {
              return;
            }
            let fileName = $("td", $(this)).eq(1).html();

            $.ajax({
              url: '/api/fileInfo.do',
              type: "POST",
              beforeSend: function(request) {
                request.setRequestHeader("Authorization","Basic c2VydmljZV9hdXRoOnF3ZXIxMjM0IQ==");
              },
              headers:{'Authorization': 'Basic c2VydmljZV9hdXRoOnF3ZXIxMjM0IQ=='},
              data: "appName="+fromAppName+"&fileName="+fileName,
              success: function(xml,s,v) {
                // <file appName="clover_dev0" fileName="target_complete_expect.xml" curVersion="1772" onlineVersion="1772" lastModifyTime="2024-11-23 07:30:18" lastDeployTime="2024-11-23 07:30:29"/>
                if (!xml) {
                  return;
                }
                var xmlString = new XMLSerializer().serializeToString(xml);
                var matchArr = xmlString.match(/fileName="(.+?)".+?onlineVersion="(.+?)"/);
                if (matchArr && matchArr.length >= 3) {
                  var rtnFileName = matchArr[1];
                  var rtnOnlineVersion = matchArr[2];
                  $('.ld-file-version-init[data-fn="'+rtnFileName+'"]').html(rtnOnlineVersion);
                }
              }
            }); //end-ajax
          }); // end-each
        } // end-if
      }

    } else {
      // 不开启
      if (htmlInitFlag) {
        // 只处理“已经初始化HTML代码”的情况
        // 1、是否已经将单元格设置为不可见了
        if (verShowFlag === "1") {
          // 设置展示标识，保证不会重复关闭
          tableObj.attr("data-verShowFlag", "0");

          // 开始关闭单元格
          tableObj.css({"width": tableObj.attr("data-oldWidth")});
          fileNameTh.attr("width", fileNameTh.attr("data-oldWidth"));
          $('.ld-deploy-file-version-check', tableObj).css({"display":"none"});
          $(".ld-button-deploy-after-version-check").css({"display":"none"});
        }


      }
    }
  }

  //处理器：显示不一致文件
  function handlerShowDiffFiles() {
    var checked = isChecked("chk_opt_show_diff_files");
    var displayDiff = "";
    var displayNormal = checked ? "none" : "";

    //与“搜索XML”选项互斥
    if (checked && isChecked("chk_filter_switch")) {
      $("#chk_filter_switch").prop("checked", false)
      renewConfigData("filter", "switch", false);
    }

    $("table").each(function() {
      var thisTable = $(this);

      //只处理文件列表
      var thArr = $("tr th", thisTable);
      if (!thArr || thArr.length < 4 || thArr.eq(0).html() != '文件名') {
        return;
      }

      $("tr", thisTable).each(function (index) {
        if (index <= 0) {
          return;
        }
        var thisTr = $(this);
        var td = $("td", thisTr).eq(2);
        if (td.html().indexOf("不一致") !== -1) {
          thisTr.css({"display": displayDiff})
        }else {
          thisTr.css({"display": displayNormal})
        }
      });
    })
  }

  //处理器：显示下载链接
  var initDownloadLinkFlag = false;
  function handlerShowDownloadLink() {
    var displayLink = isChecked("chk_opt_show_download_link") ? "" : "none";

    //页面已经初始化过了
    if ($('.a_xml_download').size() > 0) {
      initDownloadLinkFlag = true;
    }

    //页面还没有初始化
    if (!initDownloadLinkFlag) {
      initDownloadLinkFlag = true;
      //创建单文件下载链接
      $("a").each(function() {
        var htmlCode = $(this).html();
        if(htmlCode != "查看") {
          return;
        }
        var hrefStr = $(this).attr("href");
        var matchArr = hrefStr.match(/view\.do\?appName=([^&]+?)&fileName=([^.]+?).xml/);
        if (matchArr && matchArr.length==3){
          var appName = matchArr[1];
          var fileName = matchArr[2]+".xml";
          $(this).after('<a class="a_xml_download" href="#" app_name="'+appName+'" file_name="'+fileName+'" style="margin-left:20px;">下载</a>');
        }
      });

      //创建全部打包下载链接
      if ($(".a_xml_download").size() > 0) {
        $("table", $("#content")).eq(0).after('<a class="a_xml_download_all" href="#" style="margin-left:60px; font-size: 16px;">打包下载全部xml配置</a>');
      }

      //功能：单文件下载
      $(".a_xml_download").off("click").on("click", function() {
        var appName = $(this).attr("app_name");
        var fileName = $(this).attr("file_name");

        $.ajax({
          url: '/api/viewFile.do',
          type: "POST",
          beforeSend: function(request) {
            request.setRequestHeader("Authorization","Basic c2VydmljZV9hdXRoOnF3ZXIxMjM0IQ==");
          },
          headers:{'Authorization': 'Basic c2VydmljZV9hdXRoOnF3ZXIxMjM0IQ=='},
          data: "appName="+appName+"&fileName="+fileName,
          success: function(xml,s,v){
            //save(num, rtn);
            var blob = new Blob([v.responseText], {type: "text/plan;charset=utf-8"});
            saveAs(blob, fileName);
          }
        }); //end-ajax
        return false;
      }); //end-click

      //功能：全部打包下载
      $(".a_xml_download_all").on("click", function() {
        var total = $(".a_xml_download").size();
        var zip = new JSZip();
        var cnt = 0;
        var beforeTxt = $(this).html();
        var _self = $(this);

        var doingLock = $(this).attr("doing-lock");
        if (doingLock == 1) {
          return false;
        }
        $(this).attr("doing-lock", 1);

        //设置jszip默认时间：将zip包中的文件修改时间设置为当前时区的时间（https://github.com/Stuk/jszip/issues/369）
        var currDate = new Date();
        var dateWithOffset = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60000);
        JSZip.defaults.date = dateWithOffset;

        $(".a_xml_download").each(function() {
          var appName = $(this).attr("app_name");
          var fileName = $(this).attr("file_name");
          $.ajax({
            url: '/api/viewFile.do',
            type: "POST",
            beforeSend: function(request) {
              request.setRequestHeader("Authorization","Basic c2VydmljZV9hdXRoOnF3ZXIxMjM0IQ==");
            },
            headers:{'Authorization': 'Basic c2VydmljZV9hdXRoOnF3ZXIxMjM0IQ=='},
            data: "appName="+appName+"&fileName="+fileName,
            success: function(xml,s,v){
              zip.file(fileName, v.responseText);
              cnt++;
              _self.html(beforeTxt + "（"+cnt+"/"+total+"）");
              if (cnt != total) {
                return
              }
              _self.html(beforeTxt + "（"+cnt+"/"+total+"）打包中，请稍候...");
              zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, appName+".zip");
                _self.html(beforeTxt);
                _self.attr("doing-lock", 0);
              });
            }
          }); //end-ajax
        }); //end-each
        return false;
      }); //end-click

    }

    //控制下载链接显示、隐藏
    $(".a_xml_download").css("display", displayLink);
    $(".a_xml_download_all").css("display", displayLink);
  }

  //处理器：显示右侧边栏空隙
  function handlerShowRightGap() {
    var checked = isChecked("chk_opt_show_right_gap");
    if (checked) {
      $("#content").css({"margin-right":"260px"});
    }else {
      $("#content").css({"margin-right":"0"});
    }
  }

  //处理器：隐藏对比页面中的间隙
  function handlerHiddenDiffPadding() {
    var checked = isChecked("chk_opt_hidden_diff_padding");

    //特定的页面
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("diff.do") != -1) {
      // 对比3页
      if ($(".textbox").size() != 1) {
        return;
      }
      if (checked) {
        $(".textbox").css({"width":"100%"});
        $("pre", $(".textbox")).addClass("ld-padding0");
        $("ul", $(".textbox")).addClass("ld-padding0");
        $("li", $(".textbox")).css({"height":"600px"});
      }else {
        $(".textbox").css({"width":"95%"});
        $("pre", $(".textbox")).removeClass("ld-padding0");
        $("ul", $(".textbox")).removeClass("ld-padding0");
        $("li", $(".textbox")).css({"height":"580px"});
      }
    }else if(pageUrl.indexOf("mergeDiff.do") != -1){
      // 合并页
      if (checked) {
        if($("#div_ld_diff_padding").size() <= 0) {
          $("body").append('<div id="div_ld_diff_padding"></div>');
        }
        $("#div_ld_diff_padding").html('<style>.generic_dialog_popup{margin-right:260px;} #pop_dialog_table{width: 100% !important;} .textbox{width: 100% !important;} .textbox pre, .textbox ul{padding:0px; margin:0px;} .textbox li{height:600px !important;}</style>');
      }else {
        $("#div_ld_diff_padding").html('');
      }
    }
  }


  //处理器：显示历史页中对比3按钮
  function handlerShowHistoryDiff3() {
    var checked = isChecked("chk_opt_show_history_diff3");

    //特定的页面
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("history/list.do") != -1) {
      if (checked) {
        $('.PPRSbmtBtn[value="对比"]').val("对比3");
        if ($('.PPRSbmtBtn[value="对比3"]').prev('input[name="diffType"]').size() == 0) {
          // 首次检查如果没有相应元素就插入
          $('.PPRSbmtBtn[value="对比3"]').before('<input type="hidden" name="diffType" value="htmlSideBySide" />');
          $('.PPRSbmtBtn[value="对比3"]').after('<input type="button" class="PPRSbmtBtn ld-append-all-ver-list" value="补全版本列表" style="margin-left:5px;">');

          // 往下拉列表中补全版本列表
          $('.ld-append-all-ver-list').click(function() {
            if ($(this).attr("append-flag") == 1) {
              return;
            }
            var lastVerId = $('option:last', $('select[name="v2"]:last')).val();

            var currSel = $('select[name="v2"]', $(this).parent());
            var currLastVerId = $('option:last', currSel).val();

            for (var i=currLastVerId-1; i>=lastVerId; i--) {
              currSel.append('<option value="'+i+'">版本'+i+'</option>');
            }

            $(this).val("　已补全　　").attr("append-flag", 1);
          });

        }else{
          // 如果有相应的元素，直接修改样式
          $('.PPRSbmtBtn[value="对比3"]').prev('input[name="diffType"]').val('htmlSideBySide');
          $('.ld-append-all-ver-list').css({'display':'inline-block'});
        }

      }else {
        $('.PPRSbmtBtn[value="对比3"]').val("对比");
        $('.PPRSbmtBtn[value="对比"]').prev('input[name="diffType"]').val('');
        $('.ld-append-all-ver-list').css({'display':'none'});
      }
    }
  }


  //处理器：对比页中显示文件名
  function handlerShowDiffFilename() {
    var checked = isChecked("chk_opt_show_diff_filename");

    //特定的页面
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("diff.do") != -1) {
      // 对比3页
      if ($(".textbox").size() != 1) {
        return;
      }
      if ($("#span_file_name").size() == 0) {
        var fileName = getUrlParam("fileName");
        $(".textbox").before('<span id="span_file_name" style="font-size: 16px;color: red;padding:0px 0px 10px 10px;">'+fileName+'</span>');
      }
      if (checked) {
        $("#span_file_name").css({"display":"block"});
      }else {
        $("#span_file_name").css({"display":"none"});
      }
    }
  }


  // 处理器：显示对比页中大号字体
  function handlerShowDiffBigFont() {
    var checked = isChecked("chk_opt_show_diff_big_font");

    //特定的页面
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("diff.do") != -1) {
      // 对比3页
      if ($(".textbox").size() != 1) {
        return;
      }
      if (checked) {
        $(".textbox").addClass("ld-big-font");
      } else {
        $(".textbox").removeClass("ld-big-font");
      }

    }else if(pageUrl.indexOf("mergeDiff.do") != -1){
      // 合并页
      if (checked) {
        if($("#div_ld_diff_big_font").size() <= 0) {
          $("body").append('<div id="div_ld_diff_big_font"></div>');
        }
        $("#div_ld_diff_big_font").html('<style>.textbox li{font-size: 16px; line-height: 120%;}</style>');
      }else {
        $("#div_ld_diff_big_font").html('');
      }
    }
  }
  
  // 处理器：显示APP别名
  function handlerShowAppAliasName() {
    var checked = isChecked("chk_opt_show_app_alias_name");
    if (!checked) {
      $(".ld-span-app-alias-name").remove();
      return;
    }

    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("/app/list.do") != -1) {
      // 首页：APP列表页
      $("#appListTab tr").each(function(i) {
        if (i == 0) {
          return;
        }
        var th = $("th", $(this));

        var currOriginName = th.attr("ld-origin-app-name"); // 1、获取已经保存的原始值
        var saveOriginName = false;
        if (!currOriginName) {
          currOriginName = th.html(); // 2、获取为修改前的原始值
          saveOriginName = true;
        }
        if (currOriginName) {
          var currAliasName = appAliasNames[currOriginName];
          if (currAliasName) {
            th.html(currOriginName + "<span class='ld-span-app-alias-name'>【"+currAliasName+"】</span>");
            if (saveOriginName) {
              th.attr("ld-origin-app-name", currOriginName); // 3、保存原始值
            }
          }
        }
      });
    }else {
      // 内页
      $("h1").each(function() {
        var currH1 = $(this); // 逐一检测各个h1标签
        var currA = $("a", currH1);
        if (currA && currA.size() >= 1) {
          var href = currA.eq(0).attr("href"); // 第一个a标签
          if (href && href.indexOf("/config/list.do?appName=") != -1) {
            var currAppName = href.replace("/config/list.do?appName=", "");
            var currAliasName = appAliasNames[currAppName];
            if (currAliasName) {
              currH1.append("<span class='ld-span-app-alias-name'>【"+currAliasName+"】</span>");
            }
          }
        }
      });
    }
  }

  //处理器：线上配置页背景色
  function handlerProdPageBg() {
    // 跳过不需要显示背景色的页面：/app/list.do
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("/app/list.do") != -1) {
      return;
    }
    // 开始处理
    var appName = getAppName();
    if (!appName) {
      return;
    }
    var prodName = $("#span_env_name").html();
    if (isChecked("chk_opt_prod_page_bg") && appName.indexOf(prodName) != -1) {
      $("#container").css({"background-color":"#ffc5c5"}); //#c1e6c6
    }else {
      $("#container").css({"background-color":"#FFFFFF"});
    }
  }

  //处理器：高亮配置查看页中关键词
  function handlerShowHighlightKeyword() {
    //没有配置项
    if (highlightKeywords.length <= 0) {
      return;
    }
    //页面元素判断
    var pageUrl = window.location.pathname;
    if (pageUrl.indexOf("view.do") == -1) {
      return;
    }
    //得到当前配置文件名
    var xmlFileName = '';
    $("h1").each(function () {
      var h1Code = $(this).html();
      if (h1Code.indexOf("appName") != -1) {
        var arr = h1Code.split(" - ");
        if (arr && arr.length == 2) {
          xmlFileName = arr[1];
        }
      }
    });
    if (xmlFileName == '') {
      return;
    }
    //得到关键字列表
    if (highlightKeywords[xmlFileName] == undefined) {
      return;
    }
    var keywords = highlightKeywords[xmlFileName];
    if (keywords.length <= 0) {
      return;
    }
    keywords.sort();
    //是否高亮关键字
    var display = isChecked("chk_opt_show_highlight_keyword");
    if ($('pre').size() <= 0) {
      return;
    }
    var preHtmlCode = $('pre').eq(0).html(); //配置内容
    //console.info(preHtmlCode);
    if (display) {
      //n~0替换
      for (let i = keywords.length - 1; i >= 0; i--) {
        let keyword = keywords[i];
        if (!keyword) {
          continue;
        }
        preHtmlCode = preHtmlCode.replaceAll(keyword, '<span class="ld-highlight-keyword">'+keyword+'</span>');
      }
    }else {
      //0~n替换
      for (let i = 0; i < keywords.length; i++) {
        let keyword = keywords[i];
        if (!keyword) {
          continue;
        }
        preHtmlCode = preHtmlCode.replaceAll('<span class="ld-highlight-keyword">'+keyword+'</span>', keyword);
      }
    }
    $('pre').eq(0).html(preHtmlCode)
  }

  //处理器：选中行背景高亮
  //处理器：显示选中行发布按钮
  function handlerSelectedLine() {
    //固定好行高、列宽
    $("tr.even, tr.odd").css({"height":"35px"});
    var thArr = $("table tr th");
    if(thArr && thArr.length >= 7 && thArr.eq(6).html()=="发布") {
      thArr.eq(6).css({"width":"50px"});
    }

    //发布按钮
    var display = isChecked("chk_opt_selected_line_deploy") ? "none" : "";
    $('.PPRSbmtBtn[value="发布"]').css({"display":display});

    //绑定行事件
    $("tr.even").mouseover(function (){
      if (isChecked("chk_opt_selected_line_highlight")) {
        $("td", $(this)).css({"background":"#fffbc1"});
      }
      if (isChecked("chk_opt_selected_line_deploy")) {
        $('.PPRSbmtBtn[value="发布"]', $(this)).css({"display":""});
      }
    }).mouseout(function (){
      $("td", $(this)).css({"background":"#e5f1f4"});
      if (isChecked("chk_opt_selected_line_deploy")) {
        $('.PPRSbmtBtn[value="发布"]', $(this)).css({"display":"none"});
      }
    });

    $("tr.odd").mouseover(function (){
      if (isChecked("chk_opt_selected_line_highlight")) {
        $("td", $(this)).css({"background":"#fffbc1"});
      }
      if (isChecked("chk_opt_selected_line_deploy")) {
        $('.PPRSbmtBtn[value="发布"]', $(this)).css({"display":""});
      }
    }).mouseout(function (){
      $("td", $(this)).css({"background":"#f8fbfc"});
      if (isChecked("chk_opt_selected_line_deploy")) {
        $('.PPRSbmtBtn[value="发布"]', $(this)).css({"display":"none"});
      }
    });
  }

  //处理器：隐藏发布全部按钮
  function handlerHiddenDeployAllLink() {
    var display = isChecked("chk_opt_hidden_deploy_all_link") ? "none" : "";
    $("table").each(function () {
      if($('.PPRSbmtBtn[value="一键发布所有配置"]', $(this)).size() > 0) {
        $(this).css({"display":display});
      }
    });
  }

  //处理器：隐藏对比按钮
  function handlerHiddenDiffLink() {
    var display = isChecked("chk_opt_hidden_diff_link") ? "none" : "";
    $('.PPRSbmtBtn[value="对比1"]').css({"display":display});
    $('.PPRSbmtBtn[value="对比2"]').css({"display":display});
  }

  //处理器：对比功能新开页面
  function handlerOpenDiffWindow() {
    var target = isChecked("chk_opt_open_diff_window") ? "_blank" : "_self";
    $('form[action="/history/diff.do"]').attr("target", target);
  }

  //处理器：隐藏删除链接
  function handlerHiddenDelLink() {
    var display = isChecked("chk_opt_hidden_del_link") ? "none" : "";
    $('form[action="/config/del.do"]').css({"display":display});
  }

  //处理器：隐藏历史链接
  function handlerHiddenHistoryLink() {
    var display = isChecked("chk_opt_hidden_history_link") ? "none" : "";
    $("td a").each(function () {
      if($(this).html() == "历史") {
        $(this).css({"display":display});
      }
    });
    $('select[name="limit"]').css({"display":display});
  }

  //处理器：隐藏锁定链接
  function handlerHiddenLockLink() {
    var display = isChecked("chk_opt_hidden_lock_link") ? "none" : "";
    $("td a").each(function () {
      if($(this).html() == "锁定") {
        $(this).css({"display":display});
      }
    });
  }

  //检查选项是否选中
  function isChecked(optId) {
    return $("#"+optId).prop("checked");
  }

  //bugfix: 修复页面中 /js/dialog.js 的错误
  function fixPageBugs() {
    Object.extend(Array.prototype, {
      shift : function () {
        if(this.length <= 0) {
          return null;
        }
        var firstItem = this[0];
        for (var i = 0; i < this.length - 1; i++) {
          this[i] = this [i + 1];
        }
        this.length--;
        return firstItem;
      }
    });
  }

  //折叠：连接区
  function foldLink(isFold) {
    var display = isFold==1 ? 'none' : '';
    var lineDisplay = isFold==1 ? '' : 'none';
    $(".ld-toolbar .config").css({"display":display});
    $(".ld-toolbar .deploy").css({"display":display});
    $("#div_ld_toolbar #a_link_fold")
        .attr("is_fold", isFold)
        .attr("title", isFold==1 ? "展开" : "收起")
        .html(isFold==1 ? "&or;" : "&and;"); //&or;--向下，&and;--向上
    $("#div_line").css("display", lineDisplay);
  }

  //折叠：选项区
  function foldOption(isFold) {
    var display = isFold==1 ? 'none' : '';
    $("#div_options_list").css({"display":display});
    $("#div_ld_toolbar #a_option_fold")
        .attr("is_fold", isFold)
        .attr("title", isFold==1 ? "展开" : "收起")
        .html(isFold==1 ? "&or;" : "&and;");
  }

  //折叠：过滤器
  function foldFilter(isFold) {
    var display = isFold==1 ? 'none' : '';
    $("#div_filter_list").css({"display":display});
    $("#div_ld_toolbar #a_filter_fold")
        .attr("is_fold", isFold)
        .attr("title", isFold==1 ? "展开" : "收起")
        .html(isFold==1 ? "&or;" : "&and;");
    $("#div_filter .action").css({"display":display});
    if (isFold == 1) {
      $("#txt_filter_search").removeClass("search-action")
    }else {
      $("#txt_filter_search").addClass("search-action")
    }
  }

  //关闭
  function setToolbarFoldListener() {
    //展示
    foldLink(configs.folds.link_fold);
    foldOption(configs.folds.option_fold);
    foldFilter(configs.folds.filter_fold);

    //监听
    $("#div_ld_toolbar #a_link_fold").off("click").on("click", function() {
      var isFold = $(this).attr("is_fold"); //老状态
      isFold = isFold==0 ? 1 : 0; //切换为新状态
      foldLink(isFold);
      renewConfigData("folds", "link_fold", isFold);
      return false;
    });

    $("#div_ld_toolbar #a_option_fold").off("click").on("click", function() {
      var isFold = $(this).attr("is_fold"); //老状态
      isFold = isFold==0 ? 1 : 0; //切换为新状态
      foldOption(isFold);
      renewConfigData("folds", "option_fold", isFold);
      return false;
    });

    $("#div_ld_toolbar #a_filter_fold").off("click").on("click", function() {
      var isFold = $(this).attr("is_fold"); //老状态
      isFold = isFold==0 ? 1 : 0; //切换为新状态
      foldFilter(isFold);
      renewConfigData("folds", "filter_fold", isFold);
      return false;
    });
  }

  //搜索过滤XML
  function setXmlFilterListener() {
    //搜索开关
    $("#chk_filter_switch").off("change").on("change", function() {
      //保存配置
      var checked = $(this).prop("checked");
      renewConfigData("filter", "switch", checked);

      //与“只显示不一致文件”选项互斥
      if (checked && isChecked("chk_opt_show_diff_files")) {
        $("#chk_opt_show_diff_files").prop("checked", false);
        renewConfigData("options", "show_diff_files", false);
      }

      //执行搜索
      var searchVal = $("#txt_filter_search").val();
      xmlFilter(searchVal, true);
    });


    //搜索过滤XML
    $("#txt_filter_search").bind("input propertychange", function(event){
      var searchVal = $(this).val();
      xmlFilter(searchVal, false);
    });

    //添加搜索记录
    $("#a_filter_add").off("click").on("click", function() {
      var filterVal = $("#txt_filter_search").val();
      if (!filterVal) {
        return false;
      }

      //记录到缓存
      if (!window.localStorage) {
        return false;
      }
      var dataStr = window.localStorage.getItem("ld_config_manager_plus_toolbar_filter");
      if (!dataStr) {
        dataStr = "[]";
      }
      var dataArr = JSON.parse(dataStr);
      if (!dataArr) {
        dataArr = [];
      }
      for (var i = 0; i < dataArr.length; i++) {
        if (dataArr[i] == filterVal) {
          return false;
        }
      }
      dataArr.push(filterVal);
      window.localStorage.setItem("ld_config_manager_plus_toolbar_filter", JSON.stringify(dataArr));

      //展示到页面
      $("#div_filter_list").prepend(genXmlFilterHistoryHtmlCode(filterVal));

      //点击搜索记录
      setXmlFilterHistoryListener();

      return false;
    });

    //删除搜索记录
    $("#a_filter_del").off("click").on("click", function() {
      //删除缓存中的数据
      if (!window.localStorage) {
        return false;
      }
      var dataStr = window.localStorage.getItem("ld_config_manager_plus_toolbar_filter");
      if (!dataStr) {
        dataStr = "[]";
      }
      var dataArr = JSON.parse(dataStr);
      if (!dataArr) {
        dataArr = [];
      }
      if (dataArr.length <= 0) {
        return false;
      }
      dataArr.pop();
      window.localStorage.setItem("ld_config_manager_plus_toolbar_filter", JSON.stringify(dataArr));

      //展示到页面
      $("#div_filter_list span").eq(0).remove();

      return false;
    });

    //加载搜索记录
    loadXmlFilterList();

    //点击搜索记录
    setXmlFilterHistoryListener();

    //初始搜索值
    if (configs.filter.switch) {
      $("#chk_filter_switch").prop("checked", true);
    }
    if (configs.filter.value != '') {
      var filterVal = configs.filter.value;
      $("#txt_filter_search").val(filterVal);
      xmlFilter(filterVal, false);
    }
  }

  //点击搜索记录
  function setXmlFilterHistoryListener() {
    $(".filter_history").off("click").on("click", function() {
      var filterVal = $(this).html();
      $("#txt_filter_search").val(filterVal);
      xmlFilter(filterVal, false);
      return false;
    });
  }

  //过滤器过滤逻辑
  function xmlFilter(searchVal, switchChange) {
    //存数据
    if (searchVal != configs.filter.value) {
      renewConfigData("filter", "value", searchVal);
    }

    //如果开关没有开
    if (!configs.filter.switch) {
      if (switchChange) {
        //如果是功能开关切换，还原页面显示
        searchVal = "";
      }else{
        //不做任何动作
        return;
      }
    }

    //页面显示、隐藏
    $("table").each(function() {
      var thisTable = $(this);

      //只处理文件列表
      var thArr = $("tr th", thisTable);
      if (!thArr || thArr.length < 4 || thArr.eq(0).html() != '文件名') {
        return;
      }

      $("tr", thisTable).each(function (index) {
        if (index <= 0) {
          return;
        }
        var thisTr = $(this);
        if (!searchVal) {
          //不过滤
          thisTr.css({"display": ""});
        }else {
          //搜索过滤
          var thHtml = $("th", thisTr).eq(0).html();
          var matched = thHtml && thHtml.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0;
          if(matched) {
            thisTr.css({"display": ""});
          }else {
            thisTr.css({"display": "none"});
          }
        } //end-if-else
      }); //end-tr-each
    }); //end-table-each
  }

  //加载搜索记录
  function loadXmlFilterList() {
    if (!window.localStorage) {
      return false;
    }
    var dataStr = window.localStorage.getItem("ld_config_manager_plus_toolbar_filter");
    if (!dataStr) {
      dataStr = "[]";
    }
    var dataArr = JSON.parse(dataStr);
    if (!dataArr) {
      dataArr = [];
    }

    for (var i = 0; i < dataArr.length; i++) {
      var filterVal = dataArr[i];
      if (!filterVal) {
        continue;
      }
      //展示到页面
      $("#div_filter_list").prepend(genXmlFilterHistoryHtmlCode(filterVal));
    }
  }
  
  //创建搜索记录HTML
  function genXmlFilterHistoryHtmlCode(filterVal) {
    return '<span><a href="#" class="filter_history">'+filterVal+'</a></span>';
  }

  //加载配置
  function loadConfigData() {
    if (!window.localStorage) {
      return;
    }
    var dataStr = window.localStorage.getItem("ld_config_manager_plus_toolbar");
    if (!dataStr) {
      return;
    }
    var dataObj = JSON.parse(dataStr);
    if (!dataObj) {
      return;
    }
    for (let t in dataObj) {
      if (!t) {
        continue;
      }
      for (let k in dataObj[t]) {
        let v = dataObj[t][k];
        if (configs[t]==undefined || configs[t][k]==undefined) {
          continue;
        }
        if (configs[t][k] == v) {
          continue;
        }
        configs[t][k] = v;
      }
    }
  }

  //保存配置
  // t：类型
  // k：键
  // v：值
  function renewConfigData(t, k, v) {
    if (!window.localStorage) {
      return;
    }
    if (configs[t]==undefined || configs[t][k]==undefined) {
      return;
    }
    configs[t][k] = v;
    window.localStorage.setItem("ld_config_manager_plus_toolbar", JSON.stringify(configs));
  }

  //注入HTML代码
  function appendToolbar() {
    $("body").append(genToolbarHtmlCode());
  }

  //扩展配置特殊代码
  function genExtendConfigHtmlCode(appConfig) {
    var htmlCode = '';

    //特殊逻辑：h5clover
    if(appConfig.app_name_prefix.indexOf("h5clover") != -1 || appConfig.app_name_prefix.indexOf("h5clvoer") != -1) {
      //hago扩展配置导航
      // htmlCode = '' +
      //     '  <div class="config">\n' +
      //     '    <div class="page">\n' +
      //     '      <div class="list">\n' +
      //     '        <span>Hago配置</span>\n' +
      //     '        <div><a href="/config/list.do?appName=h5clover_shouter2">Dev</a></div>\n' +
      //     '        <div><a href="/config/list.do?appName=h5clover_indonesia_test">Stage</a></div>\n' +
      //     '        <div><a href="/config/list.do?appName=h5clover_singapore">线上</a></div>\n' +
      //     '      </div>\n' +
      //     '    </div>\n' +
      //     '    <div class="sync">\n' +
      //     '      <div class="list">\n' +
      //     '        <span>Hago合并</span>\n' +
      //     '        <div><a href="/merge/mergeDiff.do?settingName=h5clover_shouter2-%3Eh5clover_indonesia_test&pId=61">Dev &gt; Stage</a></div>\n' +
      //     '        <div><a href="/merge/mergeDiff.do?settingName=h5clover_indonesia_test-%3Eh5clover_singapore&pId=61">Stage &gt; 线上</a></div>\n' +
      //     '      </div>\n' +
      //     '    </div>\n' +
      //     '    <div class="clear"></div>\n' +
      //     '  </div>';

      //链接隐藏
      $("#a_sync_dev_to_prod").css({"display":"none"});

    }else if(appConfig.app_name_prefix == "SH01_out" || appConfig.app_name_prefix == "SH01_prod" || appConfig.app_name_prefix == "SH01_h5prod" || appConfig.app_name_prefix == "SH01_appprod" || appConfig.app_name_prefix == "SH01_channel" || appConfig.app_name_prefix == "SH01") {
      // SH01扩展配置导航
      htmlCode = '' +
          '  <div class="config">\n' +
          '    <div class="">\n' +
          '      <div class="list">\n' +
          '        <span>SH01环境</span>\n' +
          '        <div>\n' +
          '            <a href="/config/list.do?appName=SH01_out0">外测服</a> \n' +
          '            <span class="space">|</span>\n' +
          '            <a href="/config/list.do?appName=SH01_prod0">正式服</a>\n' +
          '            <span class="space">|</span>\n' +
          '            <a href="/config/list.do?appName=SH01_channel0">渠道服</a>\n' +
          '            <span class="space">|</span>\n' +
          '            <a href="/config/list.do?appName=SH01_h5prod0">H5</a>\n' +
          '            <span class="space">|</span>\n' +
          '            <a href="/config/list.do?appName=SH01_appprod0">APP</a>\n' +
          '        </div>\n' +
          '      </div>\n' +
          '    </div>\n' +
          '    <div class="clear"></div>\n' +
          '  </div>';
    }

    return htmlCode;
  }

  function genToolbarHtmlCode() {
    var htmlCode = '' +
        '<style>\n' +
        'table,td {font: 12px Arial,"Microsoft Yahei",sans-serif;}\n' +
        '.ld-toolbar{width:220px; border:1px solid #ccc; background-color: #fff; padding:10px; margin:0; font-family: Arial,"Microsoft Yahei",sans-serif; font-size:12px; position:fixed; z-index:9999; right:10px; top:10px; overflow:hidden;}\n' +
        '.ld-toolbar .title{font-size:16px; color: #ff0000; font-weight: bold; margin-bottom:8px;}\n' +
        '.ld-toolbar .title .desc{font-size:14px; color: #000000; padding:0 4px;}\n' +
        '.ld-toolbar .fold{font-size:10px; color: #ff0000; font-weight: normal; float: right; margin:-8px -8px 0 0; height: 10px; line-height: 10px;}\n' +
        '.ld-toolbar .option-fold{margin: 0 -8px 0 0;}\n' +
        '.ld-toolbar .filter-fold{margin: -4px -8px 0 0;}\n' +
        '.ld-toolbar .config{margin-top:8px;}\n' +
        '.ld-toolbar .config .page{float:left; width: 40%;}\n' +
        '.ld-toolbar .config .sync{float:left; width: 60%;}\n' +
        '.ld-toolbar .config .list{background-color: #f1f8ff; border: 1px solid #c8e1ff; padding: 5px 8px 8px 8px;}\n' +
        '.ld-toolbar .config .sync .list{margin-left: 8px;}\n' +
        '.ld-toolbar .config .list span{display: inline-block; padding-bottom: 2px; color: #222222;}\n' +
        '.ld-toolbar .config .list div{padding-left:8px;}\n' +
        '.ld-toolbar a{color: #0366d6; text-decoration: none; height: 22px; line-height: 22px;}\n' +
        '.ld-toolbar a:visited {color: #0366d6;}\n' +
        '.ld-toolbar a:link {color: #0366d6;}\n' +
        '.ld-toolbar a:hover{text-decoration:underline; color:#ff0000;}\n' +
        '.ld-toolbar .deploy{background-color: #f1f8ff; border: 1px solid #c8e1ff; padding: 8px; margin: 8px 0; text-align: center;}\n' +
        '.ld-toolbar .line{height: 1px; line-height: 1px; overflow: hidden; background-color: #c8e1ff; margin-bottom: 4px;}\n' +
        '.ld-toolbar .clear{clear:both}\n' +
        '.ld-toolbar .options .list div{padding: 1px 0;}\n' +
        '.ld-toolbar .options .list span{color: #ff0000; padding:0 2px;}\n' +
        '.ld-toolbar .options .list label{cursor:pointer}\n' +
        '.ld-toolbar .filter .search{width: 180px; padding:3px 5px; border:1px solid #bababa;}\n' +
        '.ld-toolbar .filter .search-action{width:142px;}\n' +
        '.ld-toolbar .filter .action{padding: 0 0 0 2px;}\n' +
        '.ld-toolbar .filter .list{padding: 0 18px;}\n' +
        '.ld-toolbar .filter .list span{text-align: center; display: inline-block; padding:0 5px; margin: 2px; border: 1px solid #c8e1ff; background-color: #f1f8ff;}\n' +
        '.ld-highlight-keyword{background-color:yellow; color:red;}\n' +
        '.ld-padding0{padding: 0px; margin: 0px;}\n' +
        '.ld-big-font{font-size: 16px; line-height: 120%;}\n' +
        '.ld-toolbar .space{padding:0 2px;}\n' +
        '</style>\n' +
        '\n' +
        '<div id="div_ld_toolbar" class="ld-toolbar">\n' +
        '  <div><a id="a_link_fold" class="fold" href="#" is_fold="0">&and;</a></div>\n' +
        '  <div class="title">\n' +
        '    <span class="desc">线上</span><span id="span_env_name" class="detail">加载中...</span>\n' +
        '  </div>\n' +
        '  <div class="config">\n' +
        '    <div class="page">\n' +
        '      <div class="list" id="div_config_links">\n' +
        '        <span>配置：</span>\n' +
        '        <div><a id="a_page_dev" href="#">Dev</a></div>\n' +
        '        <div><a id="a_page_stage" href="#">Stage</a></div>\n' +
        '        <div><a id="a_page_prod" href="#">线上</a></div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <div class="sync">\n' +
        '      <div class="list" id="div_sync_links">\n' +
        '        <span>合并：</span>\n' +
        '        <div><a id="a_sync_dev_to_stage" href="#">Dev &gt; Stage</a></div>\n' +
        '        <div><a id="a_sync_dev_to_prod" href="#">Dev &gt; 线上</a></div>\n' +
        '        <div><a id="a_sync_prod_to_stage" href="#">线上 &gt; Stage</a></div>\n' +
        '        <div><a id="a_sync_stage_to_prod" href="#">Stage &gt; 线上</a></div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <div class="clear"></div>\n' +
        '  </div>\n' +
        '  <div id="div_extend_config"></div>\n' +
        '\n' +
        '  <div class="deploy">\n' +
        '    <a href="http://deploymanager.happyelements.net/" target="_blank">DeployManager</a>\n' +
        '    <span id="span_deploy_info">（加载中...）</span>\n' +
        '  </div>\n' +
        '\n' +
        '  <div id="div_line" class="line" style="display: none;"></div>\n' +
        '\n' +
        '  <div class="options">\n' +
        '    <div><a id="a_option_fold" class="fold option-fold" href="#" is_fold="1">&or;</a></div>\n' +
        '    <div class="list" id="div_options_list" style="display: none;">\n' +
        '      <div><input type="checkbox" id="chk_opt_hidden_del_link"><label for="chk_opt_hidden_del_link">列表页隐藏<span>删除</span>链接</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_hidden_history_link"><label for="chk_opt_hidden_history_link">列表页隐藏<span>历史</span>链接</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_hidden_lock_link"><label for="chk_opt_hidden_lock_link">列表页隐藏<span>锁定</span>链接</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_hidden_diff_link"><label for="chk_opt_hidden_diff_link">列表页隐藏<span>对比1</span>、<span>对比2</span>按钮</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_open_diff_window"><label for="chk_opt_open_diff_window">列表页新窗口打开<span>对比3</span></label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_hidden_deploy_all_link"><label for="chk_opt_hidden_deploy_all_link">列表页隐藏<span>一键发布全部</span>按钮</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_selected_line_highlight"><label for="chk_opt_selected_line_highlight">列表页开启选中<span>行背景</span>高亮</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_selected_line_deploy"><label for="chk_opt_selected_line_deploy">列表页只显示选中行<span>发布</span>按钮</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_prod_page_bg"><label for="chk_opt_prod_page_bg">开启线上配置页<span>背景色</span></label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_show_highlight_keyword"><label for="chk_opt_show_highlight_keyword">查看页高亮<span>关键词</span></label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_cancel_check_all"><label for="chk_opt_cancel_check_all">合并页取消<span>全选</span></label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_show_checked_count"><label for="chk_opt_show_checked_count">合并页显示<span>已选中数量</span></label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_esc_close_diff_pop"><label for="chk_opt_esc_close_diff_pop">合并页<span>Esc</span>关闭弹层</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_deploy_file_version_check"><label for="chk_opt_deploy_file_version_check">合并页开启<span>发布时版本号检查</span></label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_show_download_link"><label for="chk_opt_show_download_link">列表页显示<span>下载</span>链接</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_show_right_gap"><label for="chk_opt_show_right_gap">预留<span>侧边栏</span>间隙</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_show_app_alias_name"><label for="chk_opt_show_app_alias_name">显示<span>项目别名</span></label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_hidden_diff_padding"><label for="chk_opt_hidden_diff_padding">对比页隐藏<span>空白</span>间隙</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_show_history_diff3"><label for="chk_opt_show_history_diff3">历史页显示<span>对比3</span>、<span>版本补全</span>按钮</label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_show_diff_filename"><label for="chk_opt_show_diff_filename">对比页显示<span>文件名</span></label></div>\n' +
        '      <div><input type="checkbox" id="chk_opt_show_diff_big_font"><label for="chk_opt_show_diff_big_font">对比页显示<span>大号字体</span></label></div>\n' +
        '    </div>\n' +
        '    <div class="list">\n' +
        '      <div><input type="checkbox" id="chk_opt_show_diff_files"><label for="chk_opt_show_diff_files">列表页只显示<span>不一致</span>文件</label></div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '\n' +
        '  <div id="div_line_filter" class="line" style="margin: 5px 0 8px 0;"></div>\n' +
        '\n' +
        '  <div class="filter">\n' +
        '    <div><a id="a_filter_fold" class="fold filter-fold" href="#" is_fold="1">&or;</a></div>\n' +
        '    <div id="div_filter">\n' +
        '      <div>\n' +
        '        <input type="checkbox" id="chk_filter_switch" style="margin-right: 0px;">\n' +
        '        <input id="txt_filter_search" class="search" type="text" placeholder="搜索XML">\n' +
        '        <span class="action" style="display: none;"><a id="a_filter_add" href="#">增</a></span>\n' +
        '        <span class="action" style="display: none;"><a id="a_filter_del" href="#">删</a></span>\n' +
        '      </div>\n' +
        '      <div class="list" id="div_filter_list" style="display: none;">\n' +
        '        <!-- <span><a href="#" class="a_filter_history">xxx.xml</a></span> -->\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>';
    return htmlCode;
  }

})();