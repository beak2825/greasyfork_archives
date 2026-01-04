// ==UserScript==
// @name         gitlab_code_reviewer_helper
// @namespace    http://tampermonkey.net/
// @version      0.5.7
// @description  hello world
// @author       You
// @resource      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        https://code.byted.org/*/*/merge_requests/*
// @match        https://codebase.byted.org/standalone-page/repository/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=byted.org
// @grant        none
// @license      no
// @downloadURL https://update.greasyfork.org/scripts/448428/gitlab_code_reviewer_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448428/gitlab_code_reviewer_helper.meta.js
// ==/UserScript==

const optionsStrList = [
  '风格问题-lint可修复',
  '风格问题-lint无法自动修复',
  '风格问题-未确定规范',
  '单测问题',
  '逻辑问题（bug）',
  'debug代码未还原',
  '存在性能隐患',
  '存在安全隐患',
  '不确定，仅咨询',
  '不符合现有规范',
  '可优化'
]
const reg = /(\[风格问题-lint可修复\].+|\[风格问题-lint无法自动修复\].+|\[风格问题-未确定规范\].+|\[单测问题\].+|\[逻辑问题\（bug\）\].+|\[debug代码未还原\].+|\[存在性能隐患\].+|\[存在安全隐患\].+|\[不确定，仅咨询\].+|\[不符合现有规范\].+|\[可优化\])/g
const replaceReg = /(\[风格问题-lint可修复\]|\[风格问题-lint无法自动修复\]|\[风格问题-未确定规范\]|\[单测问题\]|\[逻辑问题\（bug\）\]|\[debug代码未还原\]|\[存在性能隐患\]|\[存在安全隐患\]|\[不确定，仅咨询\]|\[不符合现有规范\]|\[可优化\])/g
const disabledStyle = `background-color:#eee!important;
                      cursor:not-allowed!important;
                      color:#b2b2b2!important;
                      border: 1px solid #e5e6e8!important;
                      margin-left: 8px; `
const cancelDisableStyle = `
                          cursor:pointer!important;
                          margin-left: 8px!important;`                        
function addCateBtn()  {
  const btnContainer = $('.codebase-dv-thread')

  btnContainer.each((index,item)=>{
      if($(item).find('.xbw-select-wrap')?.length){
          $(item).find('textarea').trigger('input')
          return
      }

      let ele = $(`<span class=xbw-select-wrap><select style="width:100px;height:20px;font-size:10px;"><option value="">请选择分类</option>${optionsStrList.map((item,index)=>{
          return `<option value=${item}>${item}</option>`
      }).join('\n')}</select></span>`);

      let selectedValue = ""
      ele.on('input', function (e) {
          setTimeout(()=>{
              let val = $($(item).find('textarea')[0]).val()
              selectedValue = $(item).find('option:selected').val()
              if (selectedValue) {
                  replaceReg.lastIndex = 0
                  if(replaceReg.test(val)){
                      const str = val.replace(replaceReg, `[${selectedValue}]`)
                      $($(item).find('textarea')[0]).val(str)
                  }else{
                      val = `[${selectedValue}]${val}`
                      $($(item).find('textarea')[0]).val(val)
                  }
                  $(item).find('textarea').trigger('input')
              }
          })
      })

      $(item).find('textarea').on('input', function (e) {
          setTimeout(()=>{
              const isCancel = $($(item).find('button')[1]).html() === 'Cancel'
              const blueBg = ['Start a review', 'Submit', 'Add review comment']
              const isStartAReview = blueBg.includes($($(item).find('button')[0]).html())
              reg.lastIndex = 0
              const hasSelect = $(item).find('.xbw-select-wrap').length
              if (hasSelect && reg.test(e.target.value)) {
                  $($(item).find('button')[0]).attr('disabled',false)
                  $($(item).find('button')[1]).attr('disabled',false)
                  $($(item).find('button')[0]).css("cssText",cancelDisableStyle);
              } else if (!hasSelect) {
              } else {
                  $($(item).find('button')[0]).attr({disabled:'disabled'})
                  $($(item).find('button')[1]).attr('disabled',!isCancel)
              }

              if($($(item).find('button')[0]).attr('disabled')){  // 禁用状态  样式修改
                  $($(item).find('button')[0]).css("cssText", disabledStyle);
                  
                  $($(item).find('button')[0]).attr({title:"w请选择分类"})
                  if(!isCancel){
                      $($(item).find('button')[1]).css("cssText", disabledStyle);
                      $($(item).find('button')[1]).attr({title:"请选择分类"})
                  }
              }else{
                  $($(item).find('button')[0]).css("cssText",cancelDisableStyle);
                  $($(item).find('button')[0]).attr({title:''})
                  if(!isCancel){
                      $($(item).find('button')[1]).css("cssText",cancelDisableStyle);
                      $($(item).find('button')[1]).attr({title:''})
                  }
                  if (isStartAReview) { 
                      $($(item).find('button')[0]).css("cssText",`border: 1px solid #3f51b5!important;background-color: #3f51b5!important;margin-left: 8px!important;`);
                  }
              }
          })
      })
      $(item).find('textarea').trigger('input')
      setTimeout(()=>{
          const value = $($(item).find('textarea')[0]).val()
          replaceReg.lastIndex = 0
          if($(item).find('.md-preview').length && replaceReg.test(value)){
              $($(item).find("[data-name='Preview']").parent()[0]).after(ele)
          }else if($(item).find('.md-preview').length){
          }else{
              $($(item).find("[data-name='Preview']").parent()[0]).after(ele)
          }
      })
  })
}

// (function() {
//   'use strict';
//   window.setInterval(() => {
//       $('.codebase-dv-tr').filter((index, item) => {
//           return !$(item).attr('data-cr-marked')
//       }).attr('data-cr-marked', true)
          
//       addCateBtn()
      
//   }, 1000);
// })();



// ======================================================= 以上为老版本 =========================================

function addCateBtn2(){
  const ele = $(`<span class=xbw-select-wrap style="border: 1px solid rgb(229,230,235);"><select style="width:100px;height:20px;font-size:10px;"><option value="">请选择分类</option>${optionsStrList.map((item,index)=>{
    return `<option value=${item}>${item}</option>`
  }).join('\n')}</select></span>`); 

  const btnContainer = $('.discussion-note-body');
  const enumBtttonText = {
    START_A_REVIEW: 'Start a review',
    COMMENT_NOW: 'Comment now',
    ADD_TO_REVIEW: 'Add to review',
    SAVE: 'Save',
  }

  btnContainer.each((index,item)=>{
    if($(item).find('.xbw-select-wrap')?.length) {
      $(item).find('textarea').trigger('input');
      return;
    }

    const textareaJQ = $($(item).find('textarea')[0]);
    let selectedValue = ""
    ele.on('input', function (e) {
      setTimeout(()=>{
        let val = textareaJQ.val()
        selectedValue = $(item).find('option:selected').val()
        if (selectedValue) {
          replaceReg.lastIndex = 0
          if(replaceReg.test(val)){
              const str = val.replace(replaceReg, `[${selectedValue}]`)
              textareaJQ.val(str)
          }else{
              val = `[${selectedValue}]${val}`
              textareaJQ.val(val)
          }
          // $(item).find('textarea').trigger('input')
        }
      })
    })

    
    $(item).find('.vecode-comment-form').each((innerIndex, innerItem) => {
      const innerItemJq = $($(innerItem).find('textarea')[0]);
      const allBtnWrap = $(innerItem).siblings();  // textarea 下边的按钮
      innerItemJq.on('input', function (e) {
        setTimeout(()=>{
          reg.lastIndex = 0
          const hasSelect = $(innerItem).find('.xbw-select-wrap').length
          if (hasSelect && !reg.test(innerItemJq.val())) {
            console.log('allBtnWrap', allBtnWrap)
            $(allBtnWrap.find('button')[1]).attr({disabled:'disabled'})
            $(allBtnWrap.find('button')[1])?.css('cssText', disabledStyle)
            $(allBtnWrap.find('button')[1])?.attr({title:"请选择分类"});
          } else {
            $(allBtnWrap.find('button')[1]).attr('disabled',false)
            $(allBtnWrap.find('button')[1])?.css('cssText', cancelDisableStyle)
            $(allBtnWrap.find('button')[1])?.attr({title:""});
          }
        })
      })
    });
    

    // $(item).find('textarea').trigger('input')
    setTimeout(()=>{
      $($($(item).children()[0]).find("[data-name='Preview']").parent()[0]).after(ele);
      // $($(item).find("[data-name='Preview']").parent()[0]).after(ele);
      // console.log('$(item).find("[data-name', $(item).find("[data-name='Preview']").parent()[0])
    })
  })
}

(function() {
  'use strict';
  window.setInterval(() => {
      $('.codebase-dv-tr').filter((index, item) => {
          return !$(item).attr('data-cr-marked')
      }).attr('data-cr-marked', true)
      addCateBtn()
      addCateBtn2()
  }, 1000);
})();



