// ==UserScript==
// @name         byted_poi_refined_codebase
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Extend Codebase capabilities for POI business.
// @author       Washington Hua
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @match        https://code.byted.org/*/*/merge_requests/*
// @match        https://codebase.byted.org/standalone-page/repository/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=byted.org
// @grant        none
// @license      no
// @downloadURL https://update.greasyfork.org/scripts/459174/byted_poi_refined_codebase.user.js
// @updateURL https://update.greasyfork.org/scripts/459174/byted_poi_refined_codebase.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const optionsStrList = [
    '送你一朵小红花',
    '干得漂亮',
    '牛啊牛啊',
    '边界场景考虑不周',
    '实现方式有待商榷',
    '架构设计有待优化',
    '语法使用不恰当',
    '风格与格式化',
    '拼写和命名',
    '废弃代码未删除',
    '调试代码未删除',
    '性能隐患',
    '安全隐患',
    '其它',
  ];
  const checkReg = new RegExp(`(${optionsStrList.map((option) => `\\\[${option}\\\].+`).join('|')})`, 'g');
  const replaceReg = new RegExp(`(${optionsStrList.map((option) => `\\\[${option}\\\]`).join('|')})`, 'g');

  function checkTheme() {
    const html = $('html[data-codebase]');
    if (html) {
      const theme = html.attr('data-codebase-theme');
      if (theme) {
        return theme;
      }
    }
    return 'light';
  }

  const disabledStyle = `
    background-color: #eee !important;
    cursor: not-allowed !important;
    color: #b2b2b2 !important;
    border: 1px solid #e5e6e8 !important;
    margin-left: 8px !important;
  `;
  const disabledDarkStyle = `
    background-color: #313131 !important;
    cursor: not-allowed !important;
    color: #6f6f6f !important;
    border: 1px solid #4a4a4a !important;
    margin-left: 8px !important;
  `;
  const cancelDisableStyle = `
    background-color: #fafbfc !important;
    cursor: pointer !important;
    margin-left: 8px !important;
  `;
  const cancelDisableDarkStyle = `
    background-color: #313131 !important;
    cursor: pointer !important;
    margin-left: 8px !important;
  `;
  const primaryButtonStyle = `
    color: #fff !important;
    border: 1px solid #3f51b5 !important;
    background-color: #3f51b5 !important;
    margin-left: 8px !important;
  `;

  function enableCategorySelector() {
    const CODEBASE_DIFF_VIEW_THREAD = 'codebase-dv-thread';
    const threadContainer = $(`.${CODEBASE_DIFF_VIEW_THREAD}`);

    // 遍历每一组讨论
    threadContainer.each((_, thread) => {
      const CATEGORY_SELECTOR_CONTAINER = 'codebase-dv-thread-category-selector';

      const openingEditors = $(thread).find('textarea');
      if (!openingEditors.length) {
        return;
      }

      const selector = $(thread).find(`.${CATEGORY_SELECTOR_CONTAINER}`);
      // 如果选择器已存在，结束。避免重复挂事件
      if (selector.length) {
        // $(thread).find('textarea').trigger('input');
        return;
      }

      // 创建选择器 DOM 节点
      const optionsElementString = optionsStrList
        .map((option) => `<option value=${option}>${option}</option>`)
        .join('\n');

      const selectElement = $(
        `<span class="${CATEGORY_SELECTOR_CONTAINER}" style="margin-right: 8px">
          <select style="width:140px;height:22px;font-size:16px;line-height:22px">
            <option value="">请选择分类</option>
            ${optionsElementString}
          </select>
        </span>`
      );

      // 切换选项时，更新已选的分类
      let selectedValue = '';
      selectElement.on('input', () => {
        setTimeout(() => {
          let existingValue = String($($(thread).find('textarea')[0]).val());
          selectedValue = $(thread).find(`.${CATEGORY_SELECTOR_CONTAINER} option:selected`).val();
          if (selectedValue) {
            replaceReg.lastIndex = 0;

            let newStr = existingValue;
            // 清除评论内容中已选的分类文案
            if (replaceReg.test(existingValue)) {
              newStr = `${existingValue.replace(replaceReg, '')}`;
            }

            // 附加新值
            $($(thread).find('textarea')[0]).val(`[${selectedValue}]${newStr}`);
            // 还原光标
            $(thread).find('textarea').trigger('input');
          }
        });
      });

      function handleButtonStyle(threadElem, content, shouldRecover = false) {
        setTimeout(() => {
          const isCancel = $($(threadElem).find('button')[1]).html() === 'Cancel';
          const blueBg = ['Start a review', 'Submit', 'Add review comment'];
          const isStartAReview = blueBg.includes($($(threadElem).find('button')[0]).html());
          checkReg.lastIndex = 0;

          // 如果没有选择器的，不做干预
          const hasSelector = $(threadElem).find(`.${CATEGORY_SELECTOR_CONTAINER}`).length;
          if (!hasSelector) {
            return;
          }

          // 评论内容必须包含分类信息，才允许提交，否则禁用提交按钮
          if (content && checkReg.test(content)) {
            $($(threadElem).find('button')[0]).attr('disabled', false);
            $($(threadElem).find('button')[1]).attr('disabled', false);
          } else if (shouldRecover) {
            $($(threadElem).find('button')[0]).attr({ disabled: 'disabled' });
            $($(threadElem).find('button')[1]).attr('disabled', !isCancel);
          }

          // 处理禁用/可用状态时，按钮的 title
          if ($($(threadElem).find('button')[0]).attr('disabled')) {
            // 禁用状态  样式修改
            $($(threadElem).find('button')[0]).css('cssText', disabledStyle);
            $($(threadElem).find('button')[0]).attr({ title: '请选择分类' });

            if (!isCancel) {
              $($(threadElem).find('button')[1]).css('cssText', disabledStyle);
              $($(threadElem).find('button')[1]).attr({ title: '请选择分类' });
            }
          } else if (shouldRecover) {
            $($(threadElem).find('button')[0]).css('cssText', cancelDisableStyle);
            $($(threadElem).find('button')[0]).attr({ title: '' });

            if (!isCancel) {
              $($(threadElem).find('button')[1]).css('cssText', cancelDisableStyle);
              $($(threadElem).find('button')[1]).attr({ title: '' });
            }

            if (isStartAReview) {
              $($(threadElem).find('button')[0]).css('cssText', primaryButtonStyle);
            }
          }
        });
      }

      // 输入信息时，更新提交按钮的可点击状态
      $(thread)
        .find('textarea')
        .on('input', (evt) => {
          handleButtonStyle($(thread), evt.target.value, true)
        });
      // 触发一次 input 事件，初始化一下按钮状态
      // $(thread).find('textarea').trigger('input');
      handleButtonStyle($(thread), '', false);

      // 根据情况决定是否插入选择器
      // Solution A：判断当前讨论列表有没有处于 Preview 状态的历史评论
      setTimeout(() => {
        // FIXME: 如果有多个评论处于编辑状态，且非首条也出现分类数据，永远取第一条的文案，可能不太对
        const value = $($(thread).find('textarea')[0]).val();
        replaceReg.lastIndex = 0;

        /**
         * 【详细解析】
         * 如果当前讨论列表里有 .md-preview，说明：
         * 1. 在回复历史评论（.md-preview 出现在历史评论的 Preview 视图，此时新的 textarea 内容为空，正则不匹配，不添加选择器）
         * 2. 在编辑历史评论，且不是唯一评论，也不是所有评论都为编辑状态（.md-preview 出现在非编辑状态的历史评论的预览视图；理论上只有第一条评论的 textarea 的内容能匹配正则，展示选择器用于修改；后续回复除非手工填写，否则不应该出现）
         * 3. 在创建新的评论，且处于 Preview 视图（.md-preview 出现在当前评论；由于切换前已经添加了选择器，这里没有去除逻辑，所以依然显示）
         *
         * 如果当前讨论列表里没有 .md-preview，说明：
         * 1. 在创建新的评论（此时没有历史评论，除非自己切换到 Preview 模式，否则没有 .md-preview）
         * 2. 在编辑历史评论，且为唯一的评论，或所有历史评论都均为编辑状态（此时没有其它历史评论可以提供 .md-preview，除非自己切换到 Preview 模式；如果 textarea 内容匹配正则，则展示选择器，用于修改）
         * 往 Preview 标签右边添加元素
         */
        function addSelector() {
          $($(thread).find("[data-name='Preview']").parent()[0])
            .next()
            .css({ display: 'flex', 'align-items': 'center' })
            .prepend(selectElement);
        }
        if ($(thread).find('.md-preview').length) {
          if (replaceReg.test(value)) {
            addSelector();
          }
        } else {
          addSelector();
        }
      });

      // Solution B：根据 .thread-header 下的层级结构进行判断。有说明是历史评论，没有则是新增的
    });
  }

  window.setInterval(() => {
    enableCategorySelector();
  }, 1000);
})();
