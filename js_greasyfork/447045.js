// ==UserScript==
// @name         apollo-enhance
// @namespace    apollo-enhance
// @version      0.9.17
// @description  make old apollo better
// @homepage     https://github.com/xyz327/old-apollo-portal-enhance
// @website      https://github.com/xyz327/old-apollo-portal-enhance
// @source       https://github.com/xyz327/old-apollo-portal-enhance
// @author       xizhou
// @match        *://*/config.html*
// @resource     highlight_xcode_css https://cdn.jsdelivr.net/npm/highlight.js@9.18.5/styles/xcode.min.css
// @require      https://cdn.jsdelivr.net/npm/highlight.js@9.18.5/lib/highlight.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/diff_match_patch/20121119/diff_match_patch.js
// @require.     https://cdn.jsdelivr.net/npm/highlight.js@9.18.5/lib/languages/json.min.js
// @resource     text_different_css https://cdn.jsdelivr.net/npm/text-different@1.2.1/build/style/text-different.min.css
// @require      https://cdn.jsdelivr.net/combine/npm/text-different@1.2.1/build/text-different.min.js,npm/text-different@1.2.1/build/text-different-for-html.min.js
// @noframes
// @grant      GM_getResourceText
// @grant      GM_addStyle
// @grant      GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/447045/apollo-enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/447045/apollo-enhance.meta.js
// ==/UserScript==

(function (_$1) {
  'use strict';

  var allFeature = [
  	{
  		name: "fixEnvTab",
  		desc: "固定左侧菜单",
  		defaultEnabled: true
  	},
  	{
  		name: "fixNiceScroll",
  		desc: "修复 CTRL+F 搜索不能跳转的问题",
  		defaultEnabled: true
  	},
  	{
  		name: "gotoNamespace",
  		desc: "一键跳转到对应的 namespace",
  		defaultEnabled: true
  	},
  	{
  		name: "releaseDiff",
  		desc: "发布界面差异对比",
  		defaultEnabled: true
  	},
  	{
  		name: "releaseModal",
  		desc: "发布界面增强",
  		defaultEnabled: true
  	},
  	{
  		name: "showText",
  		desc: "单 key 差异对比",
  		defaultEnabled: true
  	},
  	{
  		name: "stash",
  		more: true,
  		desc: "",
  		defaultEnabled: true,
  		enabledWarn: "实验性功能,请谨慎操作"
  	},
  	{
  		name: "copyNamespace",
  		desc: "复制namespace",
  		defaultEnabled: true
  	},
  	{
  		name: "prodWarnDisable",
  		desc: "谨慎使用",
  		more: true,
  		defaultEnabled: true,
  		enabledWarn: "实验性功能,请谨慎操作"
  	},
  	{
  		name: "valueCodeEditor",
  		desc: "配置值编辑器增强",
  		defaultEnabled: true
  	}
  ];

  var enhanceNavId = "apollo-enhance-nav";
  var featureId = "apollo-enhance-feature";
  var allFeatureMap = {};
  allFeature.forEach((feature) => {
    allFeatureMap[feature.name] = feature;
  });
  const BASE_INFO = {};
  function appendNavBar(child) {
    $(`#${enhanceNavId}`).append(child);
  }

  const loadedJs = {};
  const srcMapping = {
    "bootstrap-switch": "https://cdn.jsdelivr.net/npm/bootstrap-switch@3.3.4/dist/js/bootstrap-switch.min.js",
    "bootstrap-switch.css": "https://cdn.jsdelivr.net/npm/bootstrap-switch@3.3.4/dist/css/bootstrap3/bootstrap-switch.min.css",
  };
  const deps = [
  "https://cdn.jsdelivr.net/npm/layer-src@3.5.1/src/layer.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-switch@3.3.4/dist/css/bootstrap3/bootstrap-switch.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-switch@3.3.4/dist/js/bootstrap-switch.min.js"
  ];
  function require(deps) {
    deps = _.isArray(deps) ? deps : [deps];
    return Promise.all(deps.map(dep => loadJs(dep)))
  }
  const requiredDeps = new Promise(function (resolve, reject) { 
    $(function () { 
      // dom ready
      require(deps).then(resolve).catch(reject);
    });
  });
  function loadJs(src) {
    src = srcMapping[src] || src;
    if (_.endsWith(src, '.css')) {
      return loadCss(src)
    }
    if (loadedJs[src]) {
      return loadedJs[src];
    }
    const loader = new Promise(function (resolve, reject) {
      const gmAdd = GM_addElement("script", {
        src,
        type: "text/javascript"
      });
      if (gmAdd) {
        gmAdd.onload = function () {
          console.log("loadJs:", src, gmAdd);
          resolve();
        };
      } else {
        console.log("loadJs:", src);
        resolve();
      }
    });
    loadedJs[src] = loader;
    return loader;
  }
  function loadCss(href) {
    GM_addElement("link", {
      href,
      rel: "stylesheet",
    });
  }

  (function () {
    initFeatureId();
    initDiffModal();
    // 绑定复制事件
    $(document).on("click", "[data-copy]", function (e) {
      copy($(e.currentTarget).attr("data-copy-value")).then(function () {
        var $icon = $(e.target).parent().find(".glyphicon");
        $icon.removeClass("glyphicon-duplicate").addClass("glyphicon-ok");
        setTimeout(function () {
          $icon.addClass("glyphicon-duplicate").removeClass("glyphicon-ok");
        }, 2000);
      });
    });

    // 加载 layer  因为依赖 $ 所以在代码里面进行加载
    // loadJs("https://cdn.jsdelivr.net/npm/layer-src@3.5.1/src/layer.js");

    // loadCss("https://cdn.jsdelivr.net/npm/bootstrap-switch@3.3.4/dist/css/bootstrap3/bootstrap-switch.min.css");
    // loadJs("https://cdn.jsdelivr.net/npm/bootstrap-switch@3.3.4/dist/js/bootstrap-switch.min.js");
    const highlight_xcode_css = GM_getResourceText("highlight_xcode_css");
    const text_different_css = GM_getResourceText("text_different_css");
    GM_addStyle(highlight_xcode_css);
    GM_addStyle(text_different_css);

  })();
  loadFeature("nav", false, function () {
    var $navBar = $("#bs-example-navbar-collapse-1");
    $navBar.append(`
        <ul id="${enhanceNavId}" class="nav navbar-nav navbar-right">
          
        </ul>
        `);
    return true;
  });
  function getAllFeaturenMap() {
    return allFeatureMap;
  }
  var onNamesacpeLoadedCbs = [];
  var firsetNamespaceLoaded = false;
  function onNamesacpeLoaded(cb) {
    if (typeof cb === "function") {
      onNamesacpeLoadedCbs.push(cb);
    }
    return {
      then: function (cb) {
        if (firsetNamespaceLoaded) {
          cb();
        }
        onNamesacpeLoadedCbs.push(cb);
      },
    };
  }
  loadFeature("onNamesacpeLoaded", true, function () {
    var $namespaces = $(".namespace-name");
    if ($namespaces.length == 0) {
      return false;
    }
    console.log("trigger namespaceLoaded");
    $("body").on("namespaceLoaded", () => {
      onNamesacpeLoadedCbs.forEach((cb) => cb());
    });
    $("body").trigger("namespaceLoaded");
    const observer = new MutationObserver(function () {
      console.log("rebuild", arguments);
      $("body").trigger("namespaceLoaded");
    });

    $.each($(".config-item-container"), (index, el) => {
      observer.observe(el, { childList: true });
    });
    firsetNamespaceLoaded = true;
  });
  function getAppId() {
    let hash = location.hash;
    if (hash) {
      hash = hash.substring(2);
      const url = new URL("http://localhost?" + hash);
      return url.searchParams.get("appid");
    }
  }

  function loadFeature(name, options, feature) {
    options =
      typeof options === "object"
        ? options
        : {
          switch: true,
          reloadOnHashChange: options,
        };
    if (options.switch) {
      //  allFeature.push(name);
      if (isFeatureDisabled(name)) {
        console.log(`loadFeature: ${name} has disabled`);
        return;
      }
    }
    var reloadOnHashChange = !!options.reloadOnHashChange;
    loadFeature0(name, feature, false);
    if (reloadOnHashChange) {
      $(window).on("hashchange", function (e) {
        console.log("hashchange");
        loadFeature0(name, feature, true);
      });
    }
  }

  function isFeatureDisabled(name) {
    var state = featureState(name);
    if (state === true) {
      // 明确设置过为启用
      return false;
    }
    if (state === false) {
      // 明确设置过为不启用
      return true;
    }
    // 默认开关
    if (allFeatureMap[name] && !allFeatureMap[name].defaultEnabled) {
      console.log(`loadFeature: ${name} has disabled by deafult`);
      return true;
    }
    return false;
  }
  function featureState(name, state) {
    return featureTypeState(name, null, state);
  }
  function featureTypeState(name, subtype, state) {
    var feature = subtype ? name + "-" + subtype : name;
    var stateMap = JSON.parse(localStorage.getItem("featureState")) || {};
    if (state == undefined) {
      // get
      return stateMap[feature];
    }
    //set
    stateMap[feature] = state;
    localStorage.setItem("featureState", JSON.stringify(stateMap));
  }
  function switchFeature(name, enabled) {
    featureState(name, enabled);
  }


  function copy(content) {
    return new Promise(function (res, rej) {
      let copy = function (e) {
        try {
          e.preventDefault();
          e.clipboardData.setData("text/plain", content);
          document.removeEventListener("copy", copy);
          console.log("copy value:", content);
          res();
        } catch (e) {
          rej();
        }
      };
      document.addEventListener("copy", copy);
      document.execCommand("Copy");
    });
  }

  function toPerttyJson(val) {
    try {
      return JSON.stringify(JSON.parse(val), null, 2);
    } catch (e) {
      return val;
    }
  }

  function loadFeature0(name, feature, isReloadByHash) {
    try {
      if (!isReloadByHash && $("#feature-" + name).length !== 0) {
        // 已经加载过了
        console.log(`loadFeature: ${name} has loaded`);
        return;
      }
      requiredDeps.then(()=>{
  var clear = setInterval(function () {
        if (feature(isReloadByHash) !== false) {
          console.log(`loadFeature: ${name} finished`);
          $(`${"#" + featureId}`).append(`<div id="feature-${name}"></div>`);
          clearInterval(clear);
        }
      }, 1000);
      }).catch(e=>{
        console.error(`load feature failed :${name}`, e.message);
        alert(`load feature failed :${name}`, e.message);
      });
      
    } catch (e) {
      console.error(`load feature failed :${name}`, e.message);
    }
  }

  function initFeatureId() {
    $("body").prepend(`<div id="${featureId}" class="hidden"></div>`);
  }

  function showDiffModal(key, newVal, oldVal) {
    const tdfh = new TextDifferentForHtml(
      $("#diff-container")[0], // The dom used to render the display code
      "json" // Type of code
    );
    $("#diff-detail-title").html(`${key}`);
    $("#copyOld").attr("data-copy-value", oldVal);
    $("#copyNew").attr("data-copy-value", newVal);
    tdfh.render({
      oldCode: toPerttyJson(oldVal), // Old code
      newCode: toPerttyJson(newVal), // New code
      hasLineNumber: false, // Whether to display the line number
    });
    $("#diffModal").modal();
  }
  function initDiffModal() {
    $("body").append(`
      <!-- Modal -->
      <div class="modal" id="diffModal" tabindex="-1" role="dialog" aria-labelledby="diffModal">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title"><span class="text-danger" id="diff-detail-title"></span> 差异对比</h4>
            </div>
            <div class="modal-body" >
                <div class="row">
                  <div class="col-xs-6 text-center">
                    <span data-tooltip="tooltip" title="点击复制" id="copyOld" data-copy="copy" data-copy-value=""  class="label label-default">旧值 
                    <label class="glyphicon glyphicon-duplicate"></label>
                    </span>
                  </div>
                  <div class="col-xs-6 text-center">
                    <span data-tooltip="tooltip" title="点击复制" id="copyNew" data-copy="copy" data-copy-value="" class="label label-success">新值
                    <label class="glyphicon glyphicon-duplicate"></label>
                    </span>
                  </div>
                </div>
                <div id="diff-container" style="display:flex"></div>
            </div>
          </div>
        </div>
      </div>
      `);
  }

  loadFeature("copyNamespace", false, function () {
    onNamesacpeLoaded(function () {
      $("header.panel-heading .header-namespace>span:first-child")
        .toArray()
        .forEach(function (el) {
          var name = el.innerText.trim();
          var $el = $(el);
          if ($el.nextAll(".copyNamespace").length != 0) {
            return;
          }
          $el.next("span").after(`
        <span data-tooltip="tooltip" title="点击复制namespace" data-copy="copy"
         data-copy-value="${name}" class="copyNamespace label label-success">复制
        <label class="glyphicon glyphicon-duplicate"></label>
        </span>
        `);
        });
    });

    return true;
  });

  loadFeature("fixEnvTab", true, function (isReloadByHash) {
      var $tab = $(".J_appFound");
      if ($tab.length == 0) {
        return false;
      }
      const infoVal = sessionStorage[getAppId()];
      const infoObj = JSON.parse(infoVal);
      infoObj.cluster;
      infoObj.env;
      var $panelHeader = $tab.find(".panel-heading:first");
      var $curEnvInfo = $panelHeader.find("#curEnvInfo");
      if ($curEnvInfo.length == 0) {
        $tab.find(".panel-heading>span").after(`
          <button type="button" class="slideBtn btn btn-primary btn-xs">(点击展开/收缩)</button>
      `);
        $panelHeader.append(`<div id="curEnvInfo"></div>`);
        $curEnvInfo = $panelHeader.find("#curEnvInfo");
      }

      var $scope = $('div[ng-controller="ConfigBaseInfoController"]').scope();
      var pageContext = $scope.pageContext;
      $curEnvInfo.html(`
    <span class="label label-success">${pageContext.env}</span> - <span class="label label-info">${pageContext.clusterName}</span>
    `);
      if (!isReloadByHash) {
        // 不是通过 hash change reload 的才需要绑定事件
        $tab.find(".panel-heading .slideBtn").on("click", function (e) {
          const $header = $(e.target).parent(".panel-heading");
          $header.next("div").slideToggle("normal", function () {});
        });

        $tab = $tab.parent();
        $tab.on("affixed.bs.affix", function (e) {
          $tab.css({ position: "fixed" });
          $tab
            .find(".panel-heading")
            .next("div")
            .slideUp("normal", function () {});
        });
        $tab.on("affixed-top.bs.affix	", function (e) {
          $tab.css({ position: "" });
          $tab
            .find(".panel-heading")
            .next("div")
            .slideDown("normal", function () {});
        });
        $tab.affix({
          offset: {
            top: 60,
          },
        });
      }
      return true;
    });

  loadFeature("fixNiceScroll", false, function () {
      $(document).ready(function () {
        $().niceScroll;
        $.prototype.niceScroll = function(){
          
        };
        // 放在初始化之后执行
        setTimeout(function () {
          $("html").css("overflow", "");
          var htmlScroll = $("html").getNiceScroll && $("html").getNiceScroll(0);
          htmlScroll && htmlScroll.remove();
        }, 200);
      });
      return true;
    });

  function scrollTo(el) {
      $(el)[0].scrollIntoView({ behavior: 'smooth' });
  }

  let inited = false;
  loadFeature("gotoNamespace", false, () => {
    if ($("#affixPlaceholder").length == 0) {
      $("body>nav.navbar").after(
        '<div id="affixPlaceholder" style="height:60px"></div>'
      );
      $("body>nav.navbar")
        .width("100%")
        .css({ "z-index": 999, position: "fixed" });
    }
    goToNamespace0();
    return true;
  });

  function goToNamespace0() {
    onNamesacpeLoaded().then(() => {
      if (!inited) {
        buildGotoNamespace();
        inited = true;
      }
      refreshGogoNamespace();
    });
  }

  function refreshGogoNamespace() {
    var $select = $("#namespaceSelecter");
    if ($select.hasClass("select2-hidden-accessible")) {
      // Select2 has been initialized
      $select.select2("destroy");
    }

    // init
    $select.select2({
      placeholder: "跳转到 Namespace",
      templateResult: formatOptions,
      templateSelection: formatOptions,
    });
  }
  function formatOptions(state) {
    if (state.disabled) {
      return state.text;
    }
    var namespaceScope = $(
      'div[ng-controller="ConfigNamespaceController"]'
    ).scope();
    var namespace = namespaceScope.namespaces.find((namespace) => {
      return namespace.viewName === state.id;
    });
    if (namespace.itemModifiedCnt > 0) {
      return $(
        `<label>${state.text} <span class="label label-warning ">改</span></label>`
      );
    }
    return state.text;
  }

  var compiled = _$1.template(`<% _.forEach(namespaces, function(namespace) { %>
  <option value="<%- namespace.viewName%>"><%- namespace.viewName %></option><% 
   }); 
  %>`);
  function buildGotoNamespace() {
    var $select = $("#namespaceSelecter");
    if ($select.length > 0) {
      return;
    }
    var namespaceScope = $(
      'div[ng-controller="ConfigNamespaceController"]'
    ).scope();
    var optionsTpl = compiled({ namespaces: namespaceScope.namespaces });
    appendNavBar(`
  <li id="goToNamespace" style="margin-top: 10px;">
  <select id="namespaceSelecter">${optionsTpl}</select>
  </li>
  `);
    $select = $("#namespaceSelecter");
    $select.on("select2:open", function (e) {
      $("#select2-namespaceSelecter-results").css({ "max-height": "600px" });
    });

    //var htmlScroll = $("html").getNiceScroll && $("html").getNiceScroll(0);
    // 修改选项时 滚动页面到对应位置
    $select.on("select2:select", function (e) {
      var namespaceId = $select.val();
      var namespaceEl = $(".namespace-name")
        .toArray()
        .find((el) => el.innerHTML == namespaceId);
      scrollTo(namespaceEl);
      //      htmlScroll && htmlScroll.doScrollTop($(namespaceEl).offset().top - 100, 1000);
    });

    // 滚动页面时同步改变 当前选择的 namespace 选项
    changeSelectedOnScroll($select);
  }

  function changeSelectedOnScroll($select) {
    var selectedVal;
    // 防抖
    var listener = _$1.debounce(function (entries) {
      if (entries.length == 0) {
        return;
      }
      var entry = entries[0];
      if (!entry.isIntersecting) {
        // 从可视区移出
        return;
      }
      var el = entry.target;
      var curNamespace = $(el).text();
      if (selectedVal != curNamespace) {
        selectedVal = curNamespace;
        $select.val(selectedVal).trigger("change");
      }
    }, 200);
    const io = new IntersectionObserver(listener, { threshold: 1.0 });

    $(".namespace-name").each((i, el) => {
      io.observe(el);
    });
  }

  loadFeature("prodWarnDisable", false, function () {
    prodWarnDisable();
  });

  function prodWarnDisable() {

    var $btn = $("#releaseModal div.modal-footer").find("button[type=submit]");
    $btn.click(function (e) {
      var namespaceScope = $(
        'div[ng-controller="ConfigNamespaceController"]'
      ).scope();
      var env = namespaceScope.pageContext.env;
      if (!isProd(env)) {
        return;
      }
      // var my = namespaceScope.$root.userName
      // var toReleaseNamespace = $(releaseForm).isolateScope()?.toReleaseNamespace;
      // var selfModify = true;
      // if (toReleaseNamespace) {
      //   selfModify = toReleaseNamespace.items.filter(item => item.isModified).find(item => item.item.dataChangeLastModifiedBy === my)
      // }
      if (!isFeatureDisabled("prodWarnDisable")) {
        if (confirm("已关闭生产环境发布校验，是否继续？")) {
          namespaceScope.$root.userName = "disabledProdWarn";
        }
      }
    });
  }
  function isProd(env) {
    return  env && env === "PRO";
  }

  var DiffMatch;

  loadFeature("releaseDiff", false, function () {
    DiffMatch = new diff_match_patch();
    var releaseModalNode = document.querySelector("#releaseModal");
    if (releaseModalNode == null) {
      return false;
    }
    bindDiffInfo(releaseModalNode);
    return true;
  });

  function bindDiffInfo(node) {
    var observer = new MutationObserver(function () {
      initChangeInfoHeader();
      // 每次都需要隐藏
      initChangeInfoDetail();
      var $cols = $("#releaseModal table tr.ng-scope");

      var kvInfo = {};
      for (const col of $cols) {
        var $col = $(col);
        var tds = $(col).find("td");
        kvInfo = {
          key: tds[0].title,
          oldVal: tds[1].title,
          newVal: tds[2].title,
        };

        buildDiffHtml(
          $col.find("td.diff-text"),
          kvInfo.key,
          kvInfo.oldVal,
          kvInfo.newVal
        );
      }
    });
    observer.observe(node, {
      attributeFilter: ["style"],
    });
  }

  function toggleDiff() {
    $(".change-diff").toggle();
    var needShow = $(".change-diff").is(":hidden");
    if (needShow) {
      $(".change-detail").show();
    } else {
      $(".change-detail").hide();
    }
  }
  function initChangeInfoDetail() {
    $(".change-detail").hide();
    var $cols = $("#releaseModal table tr.ng-scope");
    for (var col of $cols) {
      var $col = $(col);
      if ($col.hasClass("diff-info-inited")) {
        return;
      }
      initChageCol();
      $col.addClass("diff-info-inited");
    }
  }
  function initChageCol() {
    var bodyRows = $("#releaseModal table tr.ng-scope");
    for (var row of bodyRows) {
      var $row = $(row);
      if ($row.find("td.change-diff").length == 0) {
        $row.find("td:gt(0)").addClass("change-detail x-detail").hide();
        $row.append(
          '<td class="change-diff diff-text" data-toggle="tooltip" data-placement="top" title="点击查看详细差异对比"></td>'
        );
      }
    }
    $(".change-diff.diff-text").tooltip();
  }
  function initChangeInfoHeader() {
    if ($("#releaseModal table thead tr>th").length == 0) {
      return;
    }
    if ($("#toggleDiff").length != 0) {
      return;
    }
    // 隐藏原有信息
    $("#releaseModal table thead tr>th:gt(0)").addClass("change-detail").hide();
    // 增加差异信息展示
    var headCol = $("#releaseModal table thead tr");
    headCol.append('<th class="change-diff">差异(点击查看新旧值对比)</th>');
    $("#releaseModal table thead tr>th:eq(0)").append(
      '<button id="toggleDiff">切换显示</button>'
    );
    $("#toggleDiff").click(function () {
      toggleDiff();
      return false;
    });
  }

  function buildDiffHtml($node, key, oldVal, newVal) {
    // 新增或删除

    var diff = DiffMatch.diff_main(oldVal, newVal);

    DiffMatch.diff_cleanupSemantic(diff);

    var html = DiffMatch.diff_prettyHtml(diff);
    $node.html(html);
    var errorJson = isErrorJson(newVal);
    if (errorJson) {
      var $td = $node.parent().find("td:first");
      var errorJsonLabelId = `${key}-errorJson`;
      if ($(`#${errorJsonLabelId}`).length == 0) {
        $td.append(
          `<span id="${errorJsonLabelId}" class="label label-danger">错误的json</span>`
        );
        $td.addClass("alert alert-danger");
      }
    }
    $node.on("click", function () {
      showDiffModal(key, newVal, oldVal);
    });
  }

  function isErrorJson(val) {
    val = val.trim();
    if (val.startsWith("{") || val.startsWith("[")) {
      try {
        JSON.parse(val);
        return false;
      } catch (e) {
        return true;
      }
    }
    return false;
  }

  loadFeature("releaseModal", true, function () {
    if ($("#goReleaseMoadlBottom").length == 0) {
      $('#releaseModal div.modal-header .modal-title:not(".ng-hide")').append(
        `<span id="goReleaseMoadlBottom" class="glyphicon glyphicon-circle-arrow-down" data-tooltip="tooltip" data-placement="top" title="定位到发布按钮"></span>`
      );
    }
    if ($("#goReleaseMoadlTop").length == 0) {
      $("#releaseModal div.modal-footer").prepend(`
    <span id="goReleaseMoadlTop" class="pull-left glyphicon glyphicon-circle-arrow-up" data-tooltip="tooltip" data-placement="top" title="回到顶部"></span>`);
    }
    // for scroll
    $("#goReleaseMoadlBottom").on("click", function () {
      scrollTo($("#goReleaseMoadlTop"));
    });

    $("#goReleaseMoadlTop").on("click", function () {
      scrollTo($("#goReleaseMoadlBottom"));
    });
    return true;
  });

  loadFeature(
    "settings",
    { switch: false, reloadOnHashChange: false },
    function () {
      require(["bootstrap-switch"])
        .then(() => {
          buildSettings();
        });
    }
  );
  function buildSettings() {
    initSettingsModal();
    $("[data-toggle=switch]")
      .bootstrapSwitch({
        onText: "开启",
        offText: "关闭",
        onSwitchChange: function (event, state) {
          var $el = $(this);
          var featureName = $el.val();
          var feature = getAllFeaturenMap()[featureName];
          if (
            feature &&
            state &&
            !featureTypeState(featureName, "enabledWarn") &&
            feature.enabledWarn
          ) {
            layer.confirm(
              feature.enabledWarn,
              { icon: 3, btn: ["确定", "取消"] },
              function (index) {
                switchFeature(featureName, true);
                featureTypeState(featureName, "enabledWarn", true);
                $el.bootstrapSwitch("state", true);
                layer.close(index);
                layer.confirm('切换成功,刷新生效。是否立即刷新页面?', function (idx) {
                  location.reload();
                });
              },
              function () { }
            );
            return false;
          } else {
            switchFeature(featureName, state);
            layer.confirm('切换成功,刷新生效。是否立即刷新页面?', function (idx) {
              location.reload();
            });
          }
        },
      });

    appendNavBar(`
  <li>
  <a href="javascript:void(0);" id="showSettings">
  <span class="glyphicon glyphicon-cog"></span>
  </a>
  </li>
  `);
    $("#showSettings").on("click", showSettings);
  }

  function showSettings() {
    $("#settingsModal").modal();
  }

  function initSettingsModal() {
    var tpl = "";
    var moreTpl = "";
    allFeature.forEach((feature) => {
      var key = feature.name.replace(".", "-");
      var checked = isFeatureDisabled(feature.name) ? "" : "checked";
      var _tpl = `
        <div class="form-group" style="width:45%;margin:5px 0px;">
            <label class="col-sm-6 control-label" for="feature-switch-${key}">${feature.name}
            <span class="glyphicon glyphicon-question-sign" data-tooltip="tooltip" title="${feature.desc}"></span>
            </label>
            <div class="col-sm-6">
            <input type="checkbox" data-toggle="switch" value="${feature.name}" id="feature-switch-${key}" ${checked}/>
            </div>
        </div>    
        `;
      if (feature.more) {
        moreTpl += _tpl;
      } else {
        tpl += _tpl;
      }
    });
    $("body").append(`
        <!-- Modal -->
        <div class="modal fade" id="settingsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><span class="text-danger" id="diff-detail-title"></span> 设置 (修改后刷新生效) 
                <a href="javascript:void(0);" id="showFeatureInfo">
                <span class="glyphicon glyphicon-question-sign"></span>
                </a>
                </h4>
              
              </div>
              <div class="modal-body" >
              <form class="form-inline">
              ${tpl}
              </form>
              <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
              <div class="panel panel-default">
                <div class="panel-heading" role="tab" id="headingOne">
                  <h4 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" 
                    onclick="$('#collapseOne').collapse('toggle');" aria-controls="collapseOne">
                      更多功能
                    </a>
                  </h4>
                </div>
                <div id="collapseOne" class="panel-collapse collapse out" role="tabpanel" aria-labelledby="headingOne">
                  <div class="panel-body">
                  <form class="form-inline">
                  ${moreTpl}
                  </form>
                  </div>
                </div>
              </div>
            </div>
              </div>
              <div class="modal-footer">
                <div><a href="https://greasyfork.org/zh-CN/scripts/447045-apollo-enhance" target="_blank" title="更新检测">${BASE_INFO.version}</a> </div>
                <div class="center-block">
                  企微反馈👉 <a href="wxwork://message?username=xizhouxi">@xizhouxi</a>
                </div>

              </div>
            </div>
          </div>
        </div>
        `);
  }

  loadFeature("showText", true, function () {
    var $namespaces = $(".namespace-view-table");
    if ($namespaces.length == 0) {
      return false;
    }
    var currItem;
    $("#showTextModal .modal-body")
      .tooltip({
        title: "点击查看差异对比",
      })
      .on("click", function () {
        if (currItem && currItem.isModified) {
          showDiffModal(currItem.item.key, currItem.newValue, currItem.oldValue);
        }
      });
      // 点击查看时 选择当前的 item
      $('body').on('click', "td.cursor-pointer", function(e){
        var $target = $(e.currentTarget);
        if($target.prev('td.cursor-pointer').length == 0){
          // 说明点击的是 key  忽略
          return;
        }
        var $tr = $target.parent();
        var key = $tr.find("td:eq(1)").find('span:eq(0)').text().trim();
          var namespace = $tr
            .parents("section.master-panel-body.ng-scope")
            .find("b.namespace-name.ng-binding")
            .text()
            .trim();
          var namespaceScope = $(
            'div[ng-controller="ConfigNamespaceController"]'
          ).scope();
          var namesapce = namespaceScope.namespaces.find(
            (e) => e.baseInfo.namespaceName === namespace
          );
          console.log('show key:', namespace, key);
          currItem = namesapce.items.find((e) => e.item.key === key);
         
      });
    
  });

  loadFeature("stash", true, function () {
    onNamesacpeLoaded(function () {
      console.log("stash");

      $.each(
        $("section.master-panel-body.ng-scope>.panel-heading>"),
        function (idx, el) {
          var $panel = $(el);
          if ($panel.find(".stashFeature").length > 0) {
            return;
          }
          $panel.append(`<label class="stashFeature hidden"/>`);
          var namespaceName = $panel
            .find("b.namespace-name.ng-binding")
            .text()
            .trim();
          var namespaceScope = $(
            'div[ng-controller="ConfigNamespaceController"]'
          ).scope();
          var ConfigService = angular
            .injector(["application"])
            .get("ConfigService");
          var namespace = namespaceScope.namespaces.find(
            (e) => e.baseInfo.namespaceName === namespaceName
          );
          var $menu = $(el).find(".dropdown-menu");
          $menu.append('<li role="separator" class="divider"></li>');
          $(`
            <li><a href="javascript:void(0);" ><span class="glyphicon glyphicon-save"></span>暂存改动</a></li>
            `)
            .on("click", function () {
              layer.confirm("是否要暂存改动?", function (index) {
                console.log(namespaceName);
                console.log(namespace);
                console.log(ConfigService);
                var items = namespace.items.filter((item) => item.isModified);
                if (items.length === 0) {
                  layer.close(index);
                  layer.msg("没有改动");
                  return;
                }
                localStorage.setItem(
                  getStashKey(namespaceScope, namespace),
                  JSON.stringify(items)
                );

                // recovery old value
                Promise.all(
                  items.map((item) => {
                    var isNewValue = item.isModified && !item.oldValue;
                    var isDeleted = item.isDeleted;
                    if (isNewValue) {
                      // 新增的配置 删除
                      return ConfigService.delete_item(
                        namespace.baseInfo.appId,
                        namespaceScope.pageContext.env,
                        namespace.baseInfo.clusterName,
                        namespace.baseInfo.namespaceName,
                        item.item.id
                      );
                    }
                    if (isDeleted) {
                      // 被删除的数据 拿不到原来的 item 信息
                      // 那就 create
                      return ConfigService.create_item(
                        namespace.baseInfo.appId,
                        namespaceScope.pageContext.env,
                        namespace.baseInfo.clusterName,
                        namespace.baseInfo.namespaceName,
                        {
                          key: item.item.key,
                          value: item.oldValue,
                          tableViewOperType: "create",
                          addItemBtnDisabled: true,
                        }
                      );
                    }
                    // 更新的 key
                    return ConfigService.update_item(
                      namespace.baseInfo.appId,
                      namespaceScope.pageContext.env,
                      namespace.baseInfo.clusterName,
                      namespace.baseInfo.namespaceName,
                      $.extend(item.item, {
                        value: item.oldValue,
                        tableViewOperType: "update",
                      })
                    );
                  })
                ).then(() => {
                  layer.close(index);
                  layer.msg("改动暂存成功!");
                  // 直接 reload
                  location.reload();
                });
              });
            })
            .appendTo($menu);

          $(`
            <li><a href="javascript:void(0);"><span class="glyphicon glyphicon-open"></span>恢复暂存改动</a></li>
            `)
            .on("click", function () {
              var items = JSON.parse(
                localStorage.getItem(getStashKey(namespaceScope, namespace))
              );
              if (!items || items.length === 0) {
                layer.msg("没有暂存数据");
                return;
              }
              layer.open({
                content: getUnstashTable(items),
                yes: function (index) {
                  // recovery old value
                  Promise.all(
                    items.map((item) => {
                      var isNewValue = item.isModified && !item.oldValue;
                      var isDeleted = item.isDeleted;
                      if (isDeleted) {
                        // 重新拿一次 itemid
                        item = namespace.items.filter(
                          (v) => v.item.key === item.item.key
                        )[0]; // 取第一个
                        // 新增的配置 删除
                        return ConfigService.delete_item(
                          namespace.baseInfo.appId,
                          namespaceScope.pageContext.env,
                          namespace.baseInfo.clusterName,
                          namespace.baseInfo.namespaceName,
                          item.item.id
                        );
                      }
                      if (isNewValue) {
                        // 被删除的数据 拿不到原来的 item 信息
                        // 那就 create
                        return ConfigService.create_item(
                          namespace.baseInfo.appId,
                          namespaceScope.pageContext.env,
                          namespace.baseInfo.clusterName,
                          namespace.baseInfo.namespaceName,
                          {
                            key: item.item.key,
                            value: item.newValue,
                            tableViewOperType: "create",
                            addItemBtnDisabled: true,
                          }
                        );
                      }
                      // 更新的 key
                      return ConfigService.update_item(
                        namespace.baseInfo.appId,
                        namespaceScope.pageContext.env,
                        namespace.baseInfo.clusterName,
                        namespace.baseInfo.namespaceName,
                        $.extend(item.item, {
                          value: item.newValue,
                          tableViewOperType: "update",
                        })
                      );
                    })
                  ).then(() => {
                    layer.close(index);
                    layer.msg("恢复暂存成功!");
                    localStorage.removeItem(
                      getStashKey(namespaceScope, namespace)
                    );
                    // 直接 reload
                    location.reload();
                  });
                },
              });
            })
            .appendTo($menu);
          console.log("add stash", namespaceName);
        }
      );
    });
  });

  function getStashKey(namespaceScope, namespace) {
    var baseInfo = namespace.baseInfo;
    return `stash_${namespaceScope.pageContext.env}_${baseInfo.appId}_${baseInfo.clusterName}_${baseInfo.namespaceName}`;
  }
  function getUnstashTable(changedItems) {
    var tab = "";
    for (var item of changedItems) {
      tab += `<tr>
          <td>${item.item.key}</td>
          <td data-value="${item.newValue}">
          ${
            item.newValue.length < 150
              ? item.newValue
              : item.newValue.substring(0, 150) + "..."
          }
          </td>
          <td>${item.item.comment ? item.item.comment : ""}</td>
          <td>${
            item.item.dataChangeLastModifiedTime
              ? item.item.dataChangeLastModifiedTime
              : ""
          }</td>
          </tr>`;
    }
    return `
    <table class="table table-bordered table-striped table-hover">
      <thead>
      <tr>
          <th>
              Key
          </th>
          <th>
              new Value
          </th>
          <th>
              备注
          </th>
          <th>
              最后修改时间
          </th>
          </tr>
          </thead>
          <tbody id="unstashTable">
              ${tab}
          </tbody>
          </table>`;
  }

  const DateType = {
      isJson(val) {
          try {
              JSON.parse(val);
              return true
          } catch (e) {
              return false
          }

      }
  };

  const cm_modules = {
      core: {
          name: 'core',
          js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js",
          css: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css"
      },
      mode: {
          json: {
              alias: "javascript",
              mode: "application/json",
              addons: ['json-lint']
          },
          javascript: {
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js",
              mode: "application/javascript",
              addons: ['matchbrackets']
          }
      },
      addon: {
          dialog: {
              preload: true,
              css: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/dialog/dialog.min.css",
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/dialog/dialog.min.js"
          },
          panel: {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/display/panel.min.js"
          },
          matchbrackets: { preload: true, js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/matchbrackets.min.js" },
          foldcode: { js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/fold/foldcode.min.js" },
          foldgutter: {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/fold/foldgutter.min.js",
              css: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/fold/foldgutter.min.css"
          },
          "indent-fold": {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/fold/indent-fold.min.js"
          },
          "json-lint": {
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/lint/json-lint.min.js"
          },
          "active-line": {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/selection/active-line.min.js"
          },
          "annotatescrollbar": {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/scroll/annotatescrollbar.min.js"
          },
          "search": {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/search/search.js"
          },
          "searchcursor": {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/search/searchcursor.min.js"
          },
          "matchesonscrollbar": {
              preload: true,
              css: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/search/matchesonscrollbar.min.css",
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/search/matchesonscrollbar.min.js"
          },
          "match-highlighter": {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/search/match-highlighter.min.js"
          },
          "jump-to-line": {
              preload: true,
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/search/jump-to-line.min.js"
          },
          "simplescrollbars": {
              preload: true,
              css: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/scroll/simplescrollbars.css",
              js: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/scroll/simplescrollbars.min.js"
          }
      }
  };
  const preLoadModule = [];
   (function () {
      ['mode', 'addon'].forEach(type => {
          for (let module of Object.keys(cm_modules[type])) {
              const modeO = cm_modules[type][module];
              modeO.name = module;
              if (modeO.preload) {
                  preLoadModule.push(modeO);
              }
          }
      });
  })();
  const panels = [];
  var cm = {
      detectMode(val) {
          let mode;
          if (DateType.isJson(val)) {
              mode = 'json';
          }
          return mode;
      },
      detectModeAndLoad(val) {
          const mode = this.detectMode(val);
          if (!mode) {
              return Promise.resolve();
          }
          return this._getAndloadMode(mode).then((modeO) => modeO?.mode)
      },
      init(cmObj) {
          cmObj.setOption("scrollbarStyle", "overlay");
          const panel = cmObj.addPanel($(`
        <div style="min-height:20px" class="clearfix">
            <div class="pull-right">
                <button class="btn btn-xs" type="button" data-cm-edit-type="format">json格式化</button>
                <button class="btn btn-xs" type="button" data-cm-edit-type="zip">json压缩</button>
            </div>
        </div>
        `)[0], { position: 'top', stable: true });
          panels.push(panel);
          $(document).on('click', 'button[data-cm-edit-type]', function (event) {
              const type = $(this).attr('data-cm-edit-type');
              let value = cmObj.getValue();
              const isJson = DateType.isJson(value);
              if (!isJson) {
                  return
              }
              switch (type) {
                  case 'format':
                      value = JSON.stringify(JSON.parse(value), null, 2);
                      break
                  case 'zip':
                      value = JSON.stringify(JSON.parse(value));
                      break
              }
              cmObj.setValue(value);
          });
      },
      destory(cmObj) {
          for (const panel of panels) {
              panel.clear();
          }
          cmObj && cmObj.toTextArea();
      },
      autoMode(cmObj) {
      },
      _getAndloadMode(mode) {
          let modeO = cm_modules.mode[mode];
          if (!modeO) {
              console.error(`不支持的mode:${mode}`);
              return Promise.resolve()
          }
          const alias = modeO.alias;
          if (alias) {
              return this._loadModeAddon(modeO).then(() => this._getAndloadMode(alias))
          } else {
              return this._loadModeAddon(modeO).then(() => this._loadModule(modeO))
          }
      },
      _loadModule(moduleO) {
          if (moduleO.loaded) {
              return Promise.resolve(moduleO);
          }
          moduleO.css && loadCss(moduleO.css);
          return loadJs(moduleO.js)
              .then(() => {
                  moduleO.loaded = true;
                  return moduleO;
              })
      },
      _loadAddon(addOn) {
          const addonO = cm_modules.addon[addOn];
          return this._loadModule(addonO)
      },
      _loadModeAddon(modeO) {
          if (modeO.addons) {
              return Promise.all(modeO.addons.map(addon => this._loadAddon(addon)))
          }
          return Promise.resolve()

      }
  };

  $(function () {
      cm._loadModule(cm_modules.core).then(() => {
          preLoadModule.forEach(moduleO => {
              cm._loadModule(moduleO);
          });
      });
  });

  loadFeature("valueCodeEditor", false, function () {
      let cmObj;
      function sync() {
          if (cmObj) {
              cmObj.save();
              $(cmObj.getTextArea()).trigger('change'); // 触发angular.js 
          }
      }
      $("#itemModal")
          .on("shown.bs.modal", function () {
              const $textarea = $('#itemModal textarea[name=value]');
              cm.detectModeAndLoad($textarea.val())
                  .then(mode => {
                      console.log(mode);
                      cmObj = CodeMirror.fromTextArea($textarea[0], {
                          lineNumbers: true,
                          lineWrapping: true,
                          styleActiveLine: true,
                          mode: mode
                      });
                      cmObj.setSize('auto', '500px');
                      cmObj.on('changes', function () {
                          sync();
                      });
                      cm.init(cmObj);
                  });

              //$("html").css("overflow", "hidden");


              //htmlScroller.hide();
          })
          .on("hidden.bs.modal", function () {
              cm.destory(cmObj);
              
              console.log(cmObj);
          });
      var $btn = $("#itemModal div.modal-footer").find("button[type=submit]");
      $btn.click(function (e) {
          sync();
      });

  });

  BASE_INFO.version = "0.9.17";
  loadFeature("main", { switch: false }, function () {
    $("body").trigger("featureLoaded");
    console.log("trigger featureLoaded  v:", BASE_INFO);
  });

})(_);
