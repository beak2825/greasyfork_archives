// ==UserScript==
// @name               Confluence
// @name:zh-CN         Confluence
// @description        Beautify the Confluence.
// @description:zh-CN  美化Confluence。
// @namespace          https://github.com/HaleShaw
// @version            1.1.2
// @author             HaleShaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-Confluence
// @supportURL         https://github.com/HaleShaw/TM-Confluence/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               data:image/x-icon;base64,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
// @match              https://conf.leeoom.com/*
// @compatible         Chrome
// @grant              GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/451640/Confluence.user.js
// @updateURL https://update.greasyfork.org/scripts/451640/Confluence.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  'use strict';

  const menuStyle = `
  a.menuButton {
    background-color: #0065ff !important;
    color: white !important;
    margin: 0 5px 0 1px !important;
    border: 1px solid #0065ff;
    border-radius: 3px !important;
    height: 2.14285714em !important;
    cursor: pointer;
  }

  a.menuButton:hover{
    filter: brightness(1.2) !important;
  }
  `;

  const beautifulStyle = `
    #footer,
    #admin-menu-link-content > div.aui-dropdown2-section > strong,

    /* 右上角帮助按钮 */
    ul.aui-nav > li > a#help-menu-link,

    /* 创建文章时，弹窗右上角帮助和搜索框 */
    #create-dialog > div.dialog-components > h2.dialog-title > div.dialog-help-link,
    #create-dialog > div.dialog-components > h2.dialog-title > form.aui.dom-filter-field-form,

    /* 顶部临时使用管理功能提示消息 */
    li#confluence-message-websudo-message,

    /* 底部喜欢、评论 */
    #likes-and-labels-container,
    #comments-section {
      display: none !important;
    }
  `;

  const treeStyle = `
  .fixedTree {
    position: fixed;
    top: 91px;
    right: 20px;
    max-height: calc(100vh - 133px);
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid white;
    border-radius: 8px;
    overflow-y: scroll;
  }

  .fixedTree ul {
    list-style-type: none !important;

    /* The default is 40px */
    padding-inline-start: 2rem !important;

    margin-top: 0 !important;
  }

  .fixedTree li {
    max-width: 25em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .fixedTree::-webkit-scrollbar {
    display: none !important;
  }

  .tree-H2 {
    margin-left: 2rem;
  }
  .tree-H3 {
    margin-left: 4rem;
  }
  .tree-H4 {
    margin-left: 6rem;
  }
  .tree-H5 {
    margin-left: 8rem;
  }
  .tree-H6 {
    margin-left: 10rem;
  }
  .tree-H7 {
    margin-left: 12rem;
  }
  `;

  const menuMap = {
    '大后端': '/display/DEV',
    '大前端': '/display/front',
    'Management': '/display/management',
    '收藏夹': '/#starred'
  };

  main();

  function main() {
    GM_addStyle(menuStyle);
    GM_addStyle(beautifulStyle);
    logInfo(GM_info.script.name, GM_info.script.version);

    createMenu();
    addTree();
    keepSidebar();
  }

  function createMenu() {
    let parentObj = document.querySelector('div.aui-header-primary>ul.aui-nav');
    if (!parentObj) {
      return;
    }
    for (let key in menuMap) {
      parentObj.appendChild($(`<li><a href="${menuMap[key]}" class="aui-icon-container menuButton" target="_blank">${key}</a></li>`)[0]);
    };
  }

  function addTree() {
    let tree = document.querySelector('div.toc-macro.client-side-toc-macro.conf-macro.output-block[data-headerelements="H1,H2,H3,H4,H5,H6,H7"]');
    let fixedTree;
    if (!tree) {
      fixedTree = createTree();
    } else {
      fixedTree = tree.cloneNode(true);
      let aList = fixedTree.querySelectorAll('a');
      for (let i = 0; i < aList.length; i++) {
        aList[i].setAttribute('title', aList[i].textContent);
      }
    }
    if (!fixedTree) {
      return;
    }
    GM_addStyle(treeStyle);
    addClass(fixedTree, 'fixedTree');
    document.body.appendChild(fixedTree);
    addTreeButton();
  }

  /**
   * Create the tree element manually.
   * @returns The fixedTree element.
   */
  function createTree() {
    let mainContent = document.querySelector('#main-content');
    if (!mainContent) {
      return null;
    }
    let titleList = mainContent.querySelectorAll('H1,H2,H3,H4,H5,H6,H7');
    if (titleList.length == 0) {
      return null;
    }
    let fixedTree = $('<div></div>');
    let ulEle = $('<ul></ul>');
    for (let i = 0; i < titleList.length; i++) {
      let id = titleList[i].getAttribute('id');
      let name = titleList[i].textContent.replaceAll(/\s/g, ' ').trim();
      let level = titleList[i].tagName.replace('H', '');
      let temp = $(`<li><a href='#${id}' class="tree-H${level}" title='${name}'>${name}</a></li>`);
      ulEle.append(temp);
    }
    fixedTree.append(ulEle);
    return fixedTree[0];
  }

  function addTreeButton() {
    let parentObj = document.querySelector('div.aui-header-secondary>ul.aui-nav');
    if (!parentObj) {
      return;
    }
    let treeButton = $('<li><a id="treeButton" class="aui-icon-container menuButton">Tree</a></li>');
    parentObj.insertBefore(treeButton[0], parentObj.children[0]);
    addTreeButtonListener();
  }

  function addTreeButtonListener() {
    $("#treeButton").click(function () {
      let display = $('div.fixedTree').css('display');
      display = 'none' == display ? 'block' : 'none';
      $('div.fixedTree').css('display', display);
    });
  }
  /**
   * Keep the sidebar is visible while editing.
   */
  function keepSidebar() {
    AJS.toInit(function () {
      var $ = AJS.$;
      // Don't know how to stop further execution/propagation with that
      // AJS.whenIType("c").execute(function(e) {
      $(document).bind('keydown', 'c', function (e) {
        var quickLink = $('#quick-create-page-button');
        if (quickLink.is(':visible')) {
          quickLink.click();
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
      });

      var origConfluenceDialogWizard = Confluence.DialogWizard;
      Confluence.DialogWizard = function (dialog, finalAction) {
        var res = origConfluenceDialogWizard(dialog, finalAction);
        // Unfortunately we can not override the doFinalAction via prototype - so, the res.newPage-Action will still use the old one :(
        var doFinalAction = res.doFinalAction;
        res.doFinalAction = function (ev, state, wizardData, finalAction, wizard) {
          if (state.finalUrl && state.spaceKey == AJS.Meta.get('space-key')) {
            runInMain(state.finalUrl);
            AJS.$(".button-panel-cancel-link").click();
          } else {
            doFinalAction(ev, state, wizardData, finalAction, wizard);
          }
        };
        return res;
      };

      function runInMain(src) {
        var $main = $('#main'), headerHeight = $('#header').height();
        $main.children().detach();
        $('body').css('overflow', 'hidden');
        $main.parent().css('height', 'calc(100% - ' + headerHeight + 'px)');
        $main.parents().css('overflow', 'hidden');
        $main.css({
          height: '100%',
          padding: 0,
          borderBottom: 'none',
          minHeight: 0
        });
        $('#footer').hide();
        var iframe = $('<iframe>', {
          src: src,
          frameborder: 0,
          scrolling: 'no',
        }).css({
          marginTop: -1 * headerHeight,
          marginBottom: -1,
          height: 'calc(100% + ' + (headerHeight + 1) + 'px)',
          width: '100%'
        }).appendTo($main).one('load', function (e) {
          iframe.contents().find('head').append('<base target="_parent">');
          $(iframe.prop('contentWindow')).bind('unload', function () {
            window.setInterval(function () {
              var doc = iframe.prop('contentWindow').document;
              if (doc.readyState === 'loading') {
                document.location.href = doc.location.href;
                iframe.css('visibility', 'hidden');
              }
            }, 10);
          });
          $(this).one('load', function (e) {
            //document.location.href = $(this).prop('contentWindow').document.location.href;
          });
        });
      }

      $('#editPageLink, #quick-create-page-button').off('click').click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        runInMain($(this).attr('href'));
      });
    });
  }

  /**
   * Add class name for the element.
   * @param {Object} element The DOM elment object.
   * @param {String} value the class name of the element.
   */
  function addClass(element, value) {
    if (!element.className) {
      element.className = value;
    } else {
      let newClassName = element.className;
      newClassName += " ";
      newClassName += value;
      element.className = newClassName;
    }
  }

  /**
   * Log the title and version at the front of the console.
   * @param {String} title title.
   * @param {String} version script version.
   */
  function logInfo(title, version) {
    console.clear();
    const titleStyle = 'color:white;background-color:#606060';
    const versionStyle = 'color:white;background-color:#1475b2';
    const logTitle = ' ' + title + ' ';
    const logVersion = ' ' + version + ' ';
    console.log('%c' + logTitle + '%c' + logVersion, titleStyle, versionStyle);
  }
})();
