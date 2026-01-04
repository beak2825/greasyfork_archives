// ==UserScript==
// @name         提问小助手v2.1
// @namespace    armstrong@fanruan.com
// @version      4.0.8
// @description  在技术支持空间内提问时有了更高效的提问方式,丰富的选项和提示文字可以提升大家的提问效率
// @author       Armstrong
// @match        https://kms.fineres.com/qa/questions*
// @match        https://kms.fineres.com/display/support/qa/questions*
// @match        https://kms.fineres.com/display/supporttest/qa/questions*
// @match        https://kms.fineres.com/tnqa/ask.action
// @grant        none
// @icon         https://kms.finedevelop.com/download/resources/com.elitesoftsp.confluence.tiny.question.answer.plugins:tiny-qa-main-res/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/396001/%E6%8F%90%E9%97%AE%E5%B0%8F%E5%8A%A9%E6%89%8Bv21.user.js
// @updateURL https://update.greasyfork.org/scripts/396001/%E6%8F%90%E9%97%AE%E5%B0%8F%E5%8A%A9%E6%89%8Bv21.meta.js
// ==/UserScript==

/* changelog:
- 支持汇才技术支持空间的问答页面
*/


(function () {
  'use strict';
  // Your code here...
  var $ = window.$ || {}

  // ### 全局的监听方法, 包装了一下MutationObserver, 当监听到指定选择器的元素被加载时, 执行回调
  window.waitForAddedNode = function (params) {
    if (params.immediate) {
      const matched = [];
      matched.push(...document.querySelectorAll(params.selector));
      const smatched = [...new Set(matched)]
      if (!params.urlmatcher || location.href.includes(params.urlmatcher)) {
        for (const el of smatched) {
          params.done(el);
        }
      }
    }
    const observer = new MutationObserver(mutations => {
      const matched = [];
      for (const { addedNodes }
           of mutations) {
        for (const n of addedNodes) {
          if (!n.tagName) continue;
          if (n.matches(params.selector)) {
            matched.push(n);
          } else if (n.firstElementChild) {
            matched.push(...n.querySelectorAll(params.selector));
          }
        }
      }
      const smatched = [...new Set(matched)]
      if (smatched && params.once) this.disconnect();
      if (!params.urlmatcher || location.href.includes(params.urlmatcher)) {
        for (const el of smatched) {
          params.done(el);
        }
      }
    });
    observer.observe(document.querySelector(params.parent) || document.body, {
      subtree: !!params.recursive || !params.parent,
      childList: true,
    });
  }
  // ### 功能埋点方法, 记录使用情况
  window.eventTracker = {
    log: (event, text, storage) => {
      const data = window.eventTracker.__prepareData(event, text);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          if (typeof (storage) == 'object' && storage.k && storage.v) localStorage.setItem(storage.k, storage.v)

        }
      });
      xhr.open("POST", "https://fr-support.fineres.com:60083/c447bb0737483295a34e14ec74c61589");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(data);
    },
    __prepareData: (event, data) => JSON.stringify({
      t: 'QA',
      c: AJS.params.loggedInUser || AJS.params.remoteUser || 'unknown',
      e: event || 'none',
      i: JSON.stringify(data || {}),
    }),
    __installedNotify: () => {
      if (localStorage.getItem('__scriptInstalled') && localStorage.getItem('__scriptInstalled') == GM_info.script.version) return;
      const data = {
        version: GM_info.script.version,
        browser: navigator.userAgent,
        languare: navigator.language,
        time: +new Date(),
      };
      return window.eventTracker.log('scriptInstalled', data, { k: '__scriptInstalled', v: GM_info.script.version });
    },
  }
  window.et = window.eventTracker;


  window.addCss = function (cssString) {
    const head = document.getElementsByTagName('head')[0];
    const newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
  }
  //添加css的全局方法
  //以下是添加标签的一些方法的封装
  window.addTag = function (fineTag) {
    fineTag = fineTag.replace("</br>", "");
    var newChosen, chosen = $('li.select2-search-choice').toArray().map(el => el.innerText.trim());//已经选择的标签
    if (chosen.includes(fineTag)) {
      newChosen = chosen.filter(e => e != fineTag);
    } else {
      newChosen = chosen
      newChosen.push(fineTag);
    }
    $('input#tags').val(newChosen.join(','));
    $('input#tags').trigger('change');
  }
  window.getTitle = function (name) {
    var title = name;
    switch (name) {
      case "图表-需求&方案咨询": title = "图表的需求和逻辑确认"; break;
      case "图表-难还原": title = "本地不能复现/无法稳定复现的问题"; break;
      case "图表-接口": title = "图表使用中的API接口咨询"; break;
      case "图表-报错": title = "图表的报错/Bug咨询"; break;
      case "平台-其他基础模块（不包含于其他标签）": title = "不包含于其他标签的平台基础内容"; break;
    }
    return title;

  }

  window.MakeTags = function (type) {
    //$('#beforeAll').remove()
    //var beforeAll='<div id="beforeAll" style="width:1500px;margin:0 auto"><table id="t1" class="x-table" style="table-layout:fixed;width:100%;" cellspacing="0" id="0" cellpadding="0"><label style="color:red" id="qiyong">标签名称含【旧】的请勿使用，点击下方单元格可直接添加标签</label><p>选择技巧：选择范围最大的标签，例如在新填报预览的时候入库数据不对，则选“新填报”而不是“填报-提交入库”。</br>如果是定时调度发送短信的功能异常，其他功能正常，则选择“独立模块-短信”而不是“平台-定时调度”</p></table><table id="t2" class="x-table" style="table-layout:fixed;width:100%;" cellspacing="0" id="0" cellpadding="0"><label style="color:red" id="chajian">点我展开官方插件列表</label></table><div>'
    //$('#main').append(beforeAll);//先添加两个table，要加在main后面，加在content后面的话会格式错乱
    //$('td[index][name="tags"]').remove()
    //$('[name="cols"]').remove()
    var tags = []
    if (type == "common") {
      switch ($('input[name="module"]:checked').val()) {
        case "报表":
          tags = ['finereport-11.0', 'finereport-10.0', 'finereport-7.0', 'finereport-8.0', 'finereport-9.0', '数据源-原生方法（非插件）', '输出-导出pdf', '输出-打印&导出（除了pdf）', '决策报表-设计/制作', '决策报表-展现/布局', '决策报表-离屏控制', '决策报表-取数/计算', '参数-参数计算', '参数-参数面板控件', '填报-导入excel', '填报-控件', '填报-提交入库&插入删除行', '填报-新填报预览', '填报-暂存',
                  '展现-html解析&参数组合&icu换行', '展现-其他展现效果（例如边框/背景等）', '展现-冻结', '展现-国际化', '展现-折叠树&工具栏&条形码',
                  '展现-数据分析预览', '展现-条件属性&形态&超链', '展现-水印', '展现-自适应', '独立模块-新前端', '计算-公式计算和解析',
                  '计算-单元格过滤', '计算-新引擎', '计算-行式引擎&分页sql', '计算-计算性能', '设计器-操作/交互/性能', '设计器-更新升级', '独立模块-fvs',
                  '设计器-模板版本管理', '设计器-远程设计', '独立模块-压测相关', '独立模块-多级上报', '独立模块-安全', '独立模块-宕机', '独立模块-性能问题', '独立模块-性能优化插件',
                  '独立模块-模板展现性能', '独立模块-独立/嵌入式/集成部署', '独立模块-短信', '独立模块-邮件', '第三方插件功能确认', '未知-找Bob'];
          break;
        case "平台":
          tags = ['finereport-11.0', 'finereport-10.0', 'finereport-7.0', 'finereport-8.0', 'finereport-9.0', '独立模块-注册机制&注册异常', '独立模块-10.0升级工具&问题', '独立模块-公有私有云', '独立模块-web集群', '平台-8.0&9.0平台数据迁移', '平台-8.0/9.0平台功能', '平台-finedb相关', '平台-logdb相关', '平台-swift相关',
                  '平台-websocket相关问题', '平台-代理相关', '平台-其他基础模块（不包含于其他标签）', '平台-前台交互&展现逻辑', '平台-外接数据库/迁移',
                  '平台-外观配置', '平台-安全管理', '平台-官方接口使用', '平台-定时调度', '平台-定时调度-附件', '平台-插件管理', '平台-智能运维-云端运维',
                  '平台-智能运维-内存管理/智能检测', '平台-智能运维-备份还原', '平台-智能运维-平台日志', '平台-智能运维-资源迁移', '平台-权限管理',
                  '平台-模板认证', '平台-注册管理', '平台-用户管理', '平台-登录/用户认证', '平台-单点登录', '平台-目录管理', '平台-移动平台', '平台-系统管理'];
          break;
        case "图表":
          tags = ['finereport-11.0', 'finereport-10.0', 'finereport-7.0', 'finereport-8.0', 'finereport-9.0', '图表-报错', '图表-接口', '图表-难还原', '图表-需求&方案咨询', '第三方插件-图表类'];
          break;
        case "移动端":
          tags = ['finereport-11.0', 'finereport-10.0', 'finereport-7.0', 'finereport-8.0', 'finereport-9.0', "移动端-fr图表", "移动端-后端&性能", "移动端-报表展现", "移动端-控件&oem平台", "移动端-集成&bi"];
          break;
        default:
          tags = ['finereport-10.0', 'finereport-7.0', 'finereport-8.0', 'finereport-9.0', '数据源-原生方法（非插件）', '输出-导出pdf', '输出-打印&导出（除了pdf）', '决策报表-展现/布局/性能', '决策报表-离屏控制', '决策报表-设计/制作', '参数-参数计算', '参数-参数面板控件', '填报-导入excel', '填报-控件', '填报-提交入库&插入删除行', '填报-新填报预览', '填报-暂存',
                  '展现-html解析&参数组合&icu换行', '展现-其他展现效果（例如边框/背景等）', '展现-冻结', '展现-国际化', '展现-折叠树&工具栏&条形码',
                  '展现-数据分析预览', '展现-条件属性&形态&超链', '展现-水印', '展现-自适应', '独立模块-新前端', '计算-公式计算和解析',
                  '计算-单元格过滤', '计算-新引擎', '计算-行式引擎&分页sql', '计算-计算性能', '设计器-操作/交互/性能', '设计器-更新升级',
                  '设计器-模板版本管理', '设计器-远程设计', '平台-8.0&9.0平台数据迁移', '平台-8.0/9.0平台功能', '平台-finedb相关', '平台-logdb相关', '平台-swift相关',
                  '平台-websocket相关问题', '平台-代理相关', '平台-其他基础模块（不包含于其他标签）', '平台-前台交互&展现逻辑', '平台-外接数据库/迁移',
                  '平台-外观配置', '平台-安全管理', '平台-官方接口使用', '平台-定时调度', '平台-定时调度-附件', '平台-插件管理', '平台-智能运维-云端运维',
                  '平台-智能运维-内存管理/智能检测', '平台-智能运维-备份还原', '平台-智能运维-平台日志', '平台-智能运维-资源迁移', '平台-权限管理',
                  '平台-模板认证', '平台-注册管理', '平台-用户管理', '平台-登录/用户认证', '平台-单点登录', '平台-目录管理', '平台-移动平台', '平台-系统管理', '独立模块-fvs', '独立模块-10.0升级工具&问题',
                  '独立模块-web集群', '独立模块-公有私有云', '独立模块-压测相关', '独立模块-多级上报', '独立模块-安全', '独立模块-宕机', '独立模块-性能问题', '独立模块-性能优化插件',
                  '独立模块-模板展现性能', '独立模块-注册机制&注册异常', '独立模块-独立/嵌入式/集成部署', '独立模块-短信', '独立模块-邮件', '图表-报错', '图表-接口', '图表-难还原', '图表-需求&方案咨询', '第三方插件-图表类', "移动端-fr图表", "移动端-后端&性能", "移动端-报表展现", "移动端-控件&oem平台", "移动端-集成&bi", '未知-找Bob', '第三方插件功能确认']
      }
    } else {
      tags = ['finereport-11.0', 'finereport-10.0', 'finereport-7.0', 'finereport-8.0', 'finereport-9.0', "js协助", "独立模块-安全", "数据源-原生方法（非插件）", "平台-代理相关", "平台-外接数据库", "平台-单点登录", "独立模块-web集群", '独立模块-宕机', '独立模块-性能问题', "独立模块-模板展现性能", "独立模块-独立/嵌入式/集成部署" ,'填报-导入excel', '填报-控件', '填报-提交入库&插入删除行', '填报-新填报预览', '填报-暂存']
    }
    var len = tags.length;//标签的总个数
    //var everyCol = type = "common" ? 12 : 5;//每列标签的个数

    var headNotes = `<label style="color:red" id="qiyong">标签名称含【旧】的请勿使用，点击下方单元格可直接添加标签</label><p>选择技巧：选择范围最大的标签，例如在新填报预览的时候入库数据不对，则选“新填报”而不是“填报-提交入库”。<br>如果是定时调度发送短信的功能异常，其他功能正常，则选择“独立模块-短信”而不是“平台-定时调度”</p>`;
    const HTMLcontents = {
      tagsPickArea: (headNotes, main) => `<div class="tags-pick-area"><div class="tags-pick-notes">${headNotes}</div><div class="tags-pick-main">${main}</div>`,
      tagsPickMain: (catName, tagsList) => `<div class="tags-pick-category"><div class="tags-pick-cat-title">${catName}</div><div class="tags-pick-list">${tagsList}</div></div>`,
      tagsPickTag: (cat, name, tag) => `<div class="tags-pick-tag" data="${tag}" category="${cat}" name="${name}" title="${window.getTitle(tag)}">${name}</div>`,
    }

    window.ts = tags;
    function categoryTags(ts) {
      var cats = [...new Set(ts.map(e => e.match(/(?:(.+)-)?(.+)/).slice(0, 3)).map(f => f[1]))];
      var result = cats.map(g => {
        return {
          cat: g ? g == 'finereport' ? '版本(必选)' : g : '其他',
          tags: ts.filter(h => g ? h.startsWith(g + '-') : !h.includes('-')).map(t => t.match(/(?:([^a-zA-Z0-9]+)-)?(.+)/).slice(0, 3))
        }
      });
      return result;
    }
    var tagsData = categoryTags(tags);
    var tagsHTML = HTMLcontents.tagsPickArea(headNotes, tagsData.map(cat => HTMLcontents.tagsPickMain(cat.cat, cat.tags.map(tag => HTMLcontents.tagsPickTag(tag[1], tag[2], tag[0])).join(''))).join(''));
    document.querySelectorAll('#mainbar .tags-pick-area').forEach(el => el.remove());
    document.querySelector('#mainbar').insertAdjacentHTML('beforeend', tagsHTML);
    //绑定点击事件;
    $('.tags-pick-tag').click(function () {
      this.classList.toggle('selected');
      window.addTag(this.attributes['data'].value)
    })

  }
  //以上为生成标签列表的功能
  //
  //



  if (window.location.href.indexOf("ask") != -1) {
    //标签输入的合理性校验
    $('input#post').mouseenter(function () {
      window.chosen = '';//已经选择的标签
      var zhuanjia_tags = ['fr技术支持', 'finereport-11.0', 'finereport-10.0', 'finereport-7.0', 'finereport-8.0', 'finereport-9.0', 'fr专家协助', "js协助", "独立模块-安全", "数据源-原生方法（非插件）", "平台-代理相关", "平台-外接数据库", "平台-单点登录", "平台-登录", "独立模块-web集群", "独立模块-宕机", "独立模块-性能问题", "独立模块-模板展现性能", "独立模块-独立/嵌入式/集成部署", '填报-导入excel', '填报-控件', '填报-提交入库&插入删除行', '填报-新填报预览', '填报-暂存', ""]
      var common_tags = ['fr技术支持', 'finereport-11.0', 'finereport-10.0', 'finereport-7.0', 'finereport-8.0', 'finereport-9.0', 'fr专家协助']
      window.incorrect_tags = []
      window.module_tags = []//已经选择的模块标签数组
      $('li.select2-search-choice').each(function () {
        window.chosen = window.chosen + $(this).text().trim() + ",";
        if (zhuanjia_tags.indexOf($(this).text().trim()) < 0) { window.incorrect_tags.push($(this).text()) }//incorrect_tags存储的是非专家模块的标签个数
        if (common_tags.indexOf($(this).text().trim()) < 0) { window.module_tags.push($(this).text()) }//module_tags存储的是除了固定的几个标签以外，指定模块的标签
      })
      if (window.chosen.indexOf("fr技术支持") >= 0) {
        if (window.chosen.indexOf("finereport-") < 0) { alert("别忘了选择版本标签~") }
        if (window.chosen.indexOf("fr专家协助") >= 0 && window.incorrect_tags.length > 0) { alert("您选择了一个不在专家协助范围内的标签,请去除~") }
        if (window.module_tags.length == 0) { alert("您没有选择功能模块标签,这会导致问题无法推送") }
      }
    })


    //标题
    document.getElementById("title").value = "问题描述";
    //空间
    $('input#postSpaceKeyAutoComplete').attr("placeholder", "请手动输入kms空间，然后下拉列表选择");
    $('#postSpaceKey').val('support').trigger('change');
    document.getElementById('postSpaceKey').value = "support";
    document.getElementById('postSpaceName').value = "3.2 技术支持组";
    //描述预填充
    const preFillContent = ['BUG链接', '现象', '详情', '复现', '主要疑问', '已参考的文档', 'JAR包版本', '相关插件', '运行环境', '日志'].map(e => `<p>【${e}】：</p>`).join('');
    document.getElementById('question-body_ifr').contentDocument.getElementById('tinymce').innerHTML = preFillContent;
    //标签及标签说明
    const notice = '<label  style="color:green;">标签不少于3项（团队+版本+模块），团队已经自动选择为fr技术支持。</br>模块项请选择最接近标签，后台根据标签推送给问题的责任研发/模块专家，<a target="_blank_" href="https://kms.fineres.com/pages/viewpage.action?pageId=281122133">标签选择常见问题</a>！</br>点击最下方的表格，可自动添加标签，不用再搜索啦！</br>问答只负责解答常规产品逻辑等问题，如解决问题缺少思路请走专家协助流程</label>'
    $('input#tags').parent('div.form-item').children('label').click(function () { window.open("https://kms.fineres.com/pages/viewpage.action?pageId=110273236") })
    $('input#tags').parent('div.form-item').children('label').css("text-decoration", "underline").css("color", "blue")
    $('input#tags').parent('div.form-item').children('label').eq(0).after(notice);

    //右边栏添加内容填写提示
    document.querySelector('#question-sidebar').insertAdjacentHTML('afterBegin', `<div class="module tsadded sidebar-content-tip"><h4 class="content-tip-title">内容填写提示</h4><div><ul class="content-tip-list">${['【说明】为了保证问答回复的效率与质量，信息补充希望尽可能详细。', '【SLA链接】：若关联，请务必直接复制SLA链接，后台可以识别到SLA信息来反馈给研发', '【现象】：提供相关问题截图方便查看', '【参考过的文档】：若查阅了相关文档但仍未解决，可以说明一下，减少重复工作', '【排查过程】：写上执行过的排查步骤，如查询知识库/需求看板、二分法到最简；需求类问题需补充上客户的完整需求场景', '【主要疑问】：结合当前问题的核心阻塞点来提问，多个问题可以用序号分开', '【模板设置与报错截图】：提供相关的模板设置、报错截图，方便查看', '【JAR包版本/相关插件】：最新的jar包是否有类似问题。如果不是最新版本，补充不能升级的原因；看看是否有二开插件', '【附件】：报错类问题获取日志、模板效果问题上传内置数据集模版，使用insert link来上传文件']
                                                                   .map(e => `<li>${e}</li>`).join('')}</ul></div></div>`);
    //右边栏添加问答预期
    document.querySelector('#question-sidebar').insertAdjacentHTML('afterBegin', `<div class="module tsadded sidebar-qa-proposal"><h4 class="qa-proposal-title">问答预期</h4><div><ul class="qa-proposal-list">${['主要解决一线客户针对产品逻辑、业务需求、报错咨询等需提供判断或者方案协助。', '问题尽可能聚焦避免多问题造成干扰。', '回复时效：普通问题1d、紧急问题1h。', '紧急、重大、可复现产品问题建议通过专家协助或者转三线进行处理，保证sla问题处理效率。', '可复现产品无法满足的场景可直接提否定答复，让对应产品进行判断']
                                                                   .map(e => `<li>${e}</li>`).join('')}</ul></div></div>`)

    function addRadioOptions(name, title, options, callback, beforeTargetElSelector) {
      const htmlTemplate = {
        main: (name, title, inner) => `<div class="form-item tsadded radio-options-area" name="${name}"><div class="radio-options title">${title}</div><div class="radio-options-list">${inner}</div></div>`,
        option: (name, title, id, value) => `<div class="radio-option" name="${name}" data="${value}"><input class="radio-option-input" type="radio" id="${id}" name="${name}" value="${value}" ><label class="radio-option-label" for="${id}">${value}</label></div>`
      };
      const htmlContent = htmlTemplate.main(name, title, options.map(o => htmlTemplate.option(name, title, o[0], o[1])).join(''));
      function checkRadio(event) {
        const input = event.currentTarget.querySelector('input.radio-option-input');
        if (!input.checked) input.click();
      }
      document.querySelector(beforeTargetElSelector).insertAdjacentHTML('beforeBegin', htmlContent);
      document.querySelectorAll(`div.form-item.tsadded.radio-options-area[name="${name}"] div.radio-option`).forEach(el => el.addEventListener('click', checkRadio));
      document.querySelectorAll(`div.form-item.tsadded.radio-options-area[name="${name}"] input.radio-option-input`).forEach(el => el.addEventListener('change', callback));
    }

    function radioOptionCallback4target(event) {
      const value = event.srcElement.value;
      $('a[name="my-link"]').remove()
      $('#ps').remove()
      if (value == "普通版") {
        document.querySelector('.radio-options-area[name="module"]').classList.remove('hide');
        $('#tags').val('fr技术支持')
        $('#tags').trigger('change')
        $("[name='xswl']").remove()
        $("[name='yqtx']").remove()
        //$('.post-editor').after("<div id='ps'><p style='color:red;font-size:25px'>P.S</p><p>详情有图片现象则直接贴图，省去下载的步骤。</p><p>如果对这个问题做出了自己的尝试，务必列出排查过程</p><p>说明主要疑问可以帮助理解，解决问题更高效</p><p>相关插件若无则不写</p><p>使用insert link来上传文件，尽量截取与问题相关的那一段日志，尽量避免整个上传</p></div>")
        $('#question-form > div.page-title > h1').before('<label style="color:red;font-size: 16pt;font-weight: bold;line-height: normal;">问答由专家负责, 提问答后建议直接去找对应模块专家同学, 无需等待, <a name="my-link" target="_blank" href="https://kms.fineres.com/pages/viewpage.action?pageId=349765979">专家模块</a></label>')
        $('#question-form > div.page-title > h1').append('<a name="my-link" target="_blank" href="https://kms.fineres.com/pages/viewpage.action?pageId=101228930">&nbsp;&nbsp;&nbsp;&nbsp;请熟读问答规范</a>')
        $('#question-form > div.page-title > h1').append('<a  name="my-link" target="_blank" href="https://kms.fineres.com/pages/viewpage.action?pageId=89685745">&nbsp;&nbsp;&nbsp;&nbsp;高效提问,请看我</a>')
        $('#question-form > div.page-title > h1').append("<label name='xswl' style='color:red'>  ←这是两个超链</label>")
        //加两个超链
        if(!document.querySelector('input[name="module"]:checked')) document.querySelector('input#report.radio-option-input').click();
        setNewTitleLeader();
        window.MakeTags("common");
      }
      else {
        document.querySelector('.radio-options-area[name="module"]').classList.add('hide');
        $('#tags').val('fr技术支持,fr专家协助,finereport-10.0')
        $('#tags').trigger('change')
        $('#chajian').remove()
        $("[name='xswl']").remove()
        $('#question-form > div.page-title > h1').append('<a name="my-link" target="_blank" href="https://kms.fineres.com/pages/viewpage.action?pageId=250009228">&nbsp;&nbsp;&nbsp;&nbsp;来看看专家负责的问题</a>')
        $('#question-form > div.page-title > h1').append("<label name='xswl' style='color:red'>  ←这是一个超链</label><label name='yqtx' style='color:green'><br/>专家版仅支持选择表格中列出的标签!!其他勿选!!</label>")
        setNewTitleLeader('专家');
        window.MakeTags("special");
        document.querySelector('[data="finereport-10.0"]').classList.add('selected');
      }
    };

    function radioOptionCallback4module(event) {
      const value = event.srcElement.value;
      setNewTitleLeader(value);
      window.MakeTags("common")
    }

    function radioOptionCallback4reproduce(event) {
      const value = event.srcElement.value;
      handleReproduce();
    }

    function setNewTitleLeader(text){
      const titleLeaders = ['报表', 'BI', '图表', '移动端', '平台', '专家'];
      if(!titleLeaders.includes(text)) {
        const checked = document.querySelector('input[name="module"]:checked');
        text = checked ? checked.value : '报表';
      }
      const titleElement = document.getElementById("title");
      var titleValue = titleElement.value;
      titleLeaders.forEach(l => titleValue = titleValue.replace(`【${l}】`, ''));
      titleElement.value = `【${text}】${titleValue}`;

    }

    // function radioOptionCallback4leixing(event) {
    //   const value = event.srcElement.value;
    //   document.getElementById("title").value = "【" + $('input[name="module"]:checked').val() + "】【" + $('input[name="leixing"]:checked').val() + "】问题描述";
    // }

    // addRadioOptions('leixing', '请选择问题类型', [['wenti', '问题'], ['xuqiu', '需求']], radioOptionCallback4leixing, 'div.form-item.ask-title');
    addRadioOptions('target', '请选择向谁提问', [['putong', '普通版'], ['zhuanjia', '专家版']], radioOptionCallback4target, 'div.form-item.ask-title');
    addRadioOptions('module', '请选择提问模块', [['report', '报表'], ['bi', 'BI'], ['chart', '图表'], ['mobile', '移动端'], ['dec', '平台']], radioOptionCallback4module, 'div.form-item.ask-title');
    addRadioOptions('reproduce', '请选择复现情况', [['rplocal', '本地可复现'], ['rpcustonly', '仅客户环境复现'], ['rprare', '问题偶发']], radioOptionCallback4reproduce, 'div.form-item.ask-title');

    setTimeout(function () { document.querySelectorAll('#question-sidebar div.module').forEach(el => el.addEventListener('click', window.collapsibleSiderbarModule)); }, 50)
    setTimeout(function () { document.querySelectorAll('[type="radio"][name="target"][value="普通版"]').forEach(el => el.click()); }, 100)

    window.handleReproduce = function () {
      var chosenReproduce = $('input[name="reproduce"]:checked').val();
      var editor = document.getElementById('question-body_ifr').contentDocument.getElementById('tinymce');
      if (editor.innerHTML.includes('【复现】：')) {
        editor.innerHTML = editor.innerHTML.replace(/(&nbsp;|<\/?p>|<br[^>]*>)*【复现】：?(&nbsp;|<\/?p>|<br[^>]*>)*(本地可复现|仅客户环境复现|问题偶发)?(&nbsp;|<\/?p>|<br[^>]*>)*/, `</p><p>【复现】：${chosenReproduce}</p><p>`);
      } else {
        editor.innerHTML = `【复现】：${chosenReproduce}</p><p>` + editor.innerHTML;
      }
    }

    window.collapsibleSiderbarModule = function (e) {
      if (e.target === e.currentTarget.querySelector('h4')) {
        $(e.currentTarget).find('h4~div').slideToggle('slow');
        $(e.currentTarget).find('h4').toggleClass("collapsed");
        window.et.log('sidebar-clicked', { module: e.currentTarget.tagName + ' ' + e.currentTarget.className });
      }
    }

    // $('label[for="xuqiu"]').click(function () {
    //   var xuqiukanban = "<a id='xuqiukanban' href='https://bi.finereporthelp.com/webroot/decision/link/R3lT' style='font-weight:bold;font-color:red' target='_blank_'>请先打开需求查询看板进行搜索</a>"
    //   if ($('#xuqiukanban').length == 0) { $(this).after(xuqiukanban) }
    // })

    window.waitForAddedNode({
      selector: '.module.sidebar-related > div, .module.sidebar-related-content > div',
      immediate: true,
      recursive: true,
      done: el => el.parentElement.querySelector('h4').click()
    });

  } else if (window.location.href.indexOf("edit") != -1) {
    setTimeout(function () { window.MakeTags("common") }, 1000)
  } else if (/display\/support\/qa\/questions\/\d+/.test(location.href)) {
    function thisIsMyQuestion() {
      return !!document.querySelector('#mainbar #question .post-detail .post-menu a.suggest-edit-post');
    }
    function thereIsAcceptedAnswer() {
      return !!document.querySelector('#mainbar #answers > div.answer.accepted-answer td.votecell span.vote-accepted.vote-accepted-on');
    }
    function addCloseLoopTip() {
      if (thisIsMyQuestion()) {
        if(!document.querySelector('a.jiaji-tip-title'))
          document.querySelector('div#question-header > h1').insertAdjacentHTML('beforeEnd', '<a class="jiaji-tip-title" name="my-link" target="_blank" href="https://www.jiandaoyun.com/dashboard#/app/59f96c4ae1ddba302aaa624a/form/607803373bb0e00007a5c5b5">&nbsp;&nbsp;&nbsp;&nbsp;问答加急请点我</a>')
        //加问答加急超链
        if (thereIsAcceptedAnswer()) {
          if(!document.querySelector('h2.bihuan-tip-title'))
            document.querySelector('div#question-header').insertAdjacentHTML('beforeEnd', '<h2 class="bihuan-tip-title" style="text-align: right;">问答闭环后，记得将内容补充到知识文档中哦~</h2>');
        }
      }
    }
    setTimeout(function(){
      addCloseLoopTip();
      document.querySelectorAll('#mainbar #answers > div.answer.accepted-answer td.votecell span.vote-accepted').forEach(el => el.addEventListener('mouseup', function(){setTimeout(addCloseLoopTip, 100)}));
    }, 100);
    window.waitForAddedNode({
      selector: 'div[id^=comments-link-]',
      immediate: true,
      recursive: true,
      done: el => el.style.display = 'none',
    });
  } else {
    function MySearch() {
      var inputString = $('#question-search').children('input').attr("value");
      if (inputString.length == 0) {
        alert("请输入搜索内容")
      } else {
        window.open('https://kms.fineres.com/dosearchsite.action?cql=siteSearch+~+"' + inputString + '"+and+type+%3D+%22com.elitesoftsp.confluence.tiny.question.answer.plugins%3Aquestion%22')
      }
      window.open('http://knowledge.fanruan.com/index.php?search-fulltext-title-' + inputString)
    }
    if (window.location.href.indexOf("qa/questions/?page=") != -1 || window.location.href == "https://kms.fineres.com/display/support/qa/questions" || window.location.href == "https://kms.fineres.com/qa/questions") {
      setTimeout(function () {
        $('#content').css("max-width", "none")
        $('#question-search').after('<button id="myButton">点我可以全文检索</button>')
        $('a.question-hyperlink[href^="/display/support/qa/questions/"]').css("font-size", "18px").css("font-weight", 700).css("color", "rgba(64,116,52,0.8)")
        $('.excerpt').eq(0).css("color", "rgba(3,38,58,1").css("font-weight", 500)
        //修改字体样式
        var w = $('.status').eq(0).css("width")
        var ht = $('.status').eq(0).css("height")
        var imgg = '<div align="center" style="width:' + w + ';height:' + ht + '"><img id="solved" alt="Solved" title="Solved" src="/download/resources/com.elitesoftsp.confluence.tiny.question.answer.plugins:tiny-qa-main-res/images/accepted.png"></div>'
        $('.question-summary').has('#solved-question').each(function () { $(this).find('.statscontainer').find('.stats').find('.status').after(imgg) })
        //闭环更明显
        $('#myButton').click(function () { MySearch() })
      }, 500)
      //全文检索功能
    }
  }

  const radioOptionsCss = `
.form-item.tsadded.radio-options-area[name="target"] { display: none; }
.form-item.tsadded.radio-options-area { margin: 5px 0 0 0; padding: 0; }
.form-item.tsadded.radio-options-area.hide { display: none; }
.radio-options.title { display: inline-block; width: 25%;}
.radio-options-list { display: inline-flex; flex-direction: row; flex-wrap: wrap; justify-content: flex-start; align-items: flex-start; align-content: center; }
.radio-option { display: inline-block; margin: 2px 10px 2px 2px; }
input.radio-option-input { display: inline-block; margin-right: 2px; }
input.radio-option-input:checked+label { color: darkblue; font-weight:bold; }
label.radio-option-label { display: inline-block; }
`;
  window.addCss(radioOptionsCss);

  const tagPickCss = `
.tags-pick-main { margin: 0; padding: 0; align-items: center; -webkit-columns: 120px; -moz-columns: 120px; columns: 120px; column-gap: 6px; }
.tags-pick-category { border: 1px solid lightgrey; border-radius: 5px; margin: 0 0 6px 0; padding: 0; -webkit-column-break-inside: avoid; page-break-inside: avoid; break-inside: avoid; }
.tags-pick-cat-title { margin: 0; padding: 3px 3px 3px 3px; text-align: center; font-weight: bolder; color: white; background: darkcyan; border-radius: 5px 5px 0 0; }
.tags-pick-list { margin: 0; padding: 0; }
.tags-pick-tag { margin: 0; padding: 3px; text-align: center; cursor: pointer; }
.tags-pick-tag:nth-child(even) { background: lightcyan; }
.tags-pick-tag.selected {color: #eec;background: #55a;font-weight: bold;}
.tags-pick-tag:not(.selected):hover { font-weight: bolder; background: lightblue; }`;
  window.addCss(tagPickCss);

  const sideBarCss = `
#question-sidebar > .tsadded.module > h4{ color: darkred; font-weight: bolder;}
#question-sidebar > .tsadded.module.sidebar-qa-proposal ul{ list-style: disc;  padding-left: 0;  line-height: 20px;  margin-right: 0;}
#question-sidebar > .tsadded.module.sidebar-content-tip ul{ list-style: none;  padding-left: 0;  line-height: 20px;  margin-left: 0;  margin-right: 0;}
#question-sidebar > .module > h4:before { font-family: Adgs Icons; font-weight: 800; font-size: 20px; height: 24px; width: 24px; vertical-align: sub;}
#question-sidebar > .module > h4:not(.collapsed):before { content: "\\F15B"; }
#question-sidebar > .module > h4.collapsed:before { content: "\\F11C"; }
`;
  window.addCss(sideBarCss);
  window.addCss(`h2.bihuan-tip-title { color: darkred; font-weight: bolder;}`);


})();