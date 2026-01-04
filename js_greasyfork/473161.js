// ==UserScript==
// @name         ad_gitlab_code_reviewer_helper
// @namespace    http://tampermonkey.net/
// @version      1.0.22
// @description  用于CR提效
// @author       You
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        https://code.byted.org/*/*/merge_requests/*
// @match        https://codebase.byted.org/standalone-page/repository/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=byted.org
// @grant        none
// @license      no
// @downloadURL https://update.greasyfork.org/scripts/473161/ad_gitlab_code_reviewer_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/473161/ad_gitlab_code_reviewer_helper.meta.js
// ==/UserScript==
 
const optionsStrList = [
    '风格问题-lint可修复',
    '风格问题-lint无法自动修复',
    '风格问题-未确定规范',
    '单测问题',
    '逻辑问题',
    'debug代码未还原',
    '存在性能隐患',
    '存在安全隐患',
    '其他'
]
const reg = new RegExp(`^(${optionsStrList.reduce((pre,cur,currentIndex)=>{
    const prefix =currentIndex!==0?`${pre}|`:pre
    return `${prefix}\\[ ${cur} \\]`
},'')})`, 'g')
 
const replaceReg = new RegExp(`(${optionsStrList.reduce((pre,cur,currentIndex)=>{
    const prefix =currentIndex!==0?`${pre}|`:pre
    return `${prefix}\\[ ${cur} \\]`
},'')})`, 'g')
 
 
const disabledStyle = `background-color:#eee!important;
                        cursor:not-allowed!important;
                        color:#b2b2b2!important;
                        border: 1px solid #e5e6e8!important;
                        margin-left: 8px !important;
                        `
const cancelDisableStyle = `background-color:#fafbfc!important;
                            cursor:pointer!important;
                            margin-left: 8px !important;
                            `
 
 
function addCateBtn() {
    const btnContainer = $('.codebase-dv-thread')
 
    btnContainer.each((index, item) => {
        if ($(item).find('.xbw-select-wrap')?.length) {
            $(item).find('textarea').trigger('input')
            return
        }
        let ele = $(`<span class=xbw-select-wrap><select style="width:140px;border-radius:4px;height:20px;font-size:10px;text-overflow: ellipsis;">
        <option value="none" selected disabled hidden>请选择分类</option>
        ${optionsStrList.map((item, index) => {
            return `<option value=${item}>${item}</option>`
        }).join('\n')}</select></span>`);
 
        let selectedValue = ""
        $($(item).find('button')[0]).parent().css('gap', '8px')
        let targetTextValue
        //分类按钮
        ele.on('input', function (e) {
            setTimeout(() => {
                const textarea = $(item).find('textarea')
                const textareaDOM = textarea[0]
                let textareaVal = textarea.val()
                selectedValue = $(item).find('option:selected').val()
                if (selectedValue) {
                    replaceReg.lastIndex = 0
                    targetTextValue = replaceReg.test(textareaVal) ? textareaVal.replace(replaceReg, `[ ${selectedValue} ]`) : `[ ${selectedValue} ]${textareaVal}`
                }
 
                textarea.val(targetTextValue).trigger('input')
                const event = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
                textareaDOM.dispatchEvent(event);
            })
 
        })
 
        const textareaInput = (e) => {
            setTimeout(() => {
 
                const buttonGroup = $(item).find('button')
                const startReview = buttonGroup[0]
                const commentNow = buttonGroup[1]
                const cancel = buttonGroup[2]
                const isCancel = $($(item).find('button')[1]).html() === 'Cancel'
                const blueBg = ['Start a review', 'Submit', 'Add review comment']
                const isStartAReview = blueBg.includes($(startReview).html())
                reg.lastIndex = 0
                const hasSelect = $(item).find('.xbw-select-wrap').length
 
                if (hasSelect) {
                    if (reg.test(e.target.value)) {
                        $(startReview).attr('disabled', false)
                        $(commentNow).attr('disabled', false)
                    } else {
                        $(startReview).attr({disabled: 'disabled'})
                        $(commentNow).attr('disabled', !isCancel)
                    }
                }
 
                if ($(startReview).attr('disabled')) {  // 禁用状态  样式修改
                    $(startReview).css("cssText", disabledStyle);
 
                    $(startReview).attr({title: "请选择分类"})
                    if (!isCancel) {
                        $(commentNow).css("cssText", disabledStyle);
                        $(commentNow).attr({title: "请选择分类"})
                    }
                } else {
                    $(startReview).css("cssText", cancelDisableStyle);
                    $(startReview).attr({title: ''})
                    if (!isCancel) {
                        $(commentNow).css("cssText", cancelDisableStyle);
                        $(commentNow).attr({title: ''})
                    }
                    if (isStartAReview) {
                        $(startReview).css("cssText", `border: 1px solid #3f51b5!important;background-color: #3f51b5!important;margin-left: 8px!important;`);
                    }
                }
            })
        }
        const writeBtn = $(item).find("[data-name='Write']")
        writeBtn.on('click', () => {
            setTimeout(() => {
                const parent = $(writeBtn).parents('.codebase-dv-thread')[0]
                const textarea = parent.getElementsByTagName('textarea')[0]
                $(textarea).off('input', textareaInput)
                $(textarea).on('input', textareaInput)
            })
        })
        $(item).find('textarea').on('input', textareaInput)
        $(item).find('textarea').trigger('input')
        setTimeout(() => {
            const value = $($(item).find('textarea')[0]).val()
            replaceReg.lastIndex = 0
            if (!$(item).find('.md-preview').length) {
                $($(item).find("[data-name='Preview']").parent()[0]).after(ele)
            } else if (replaceReg.test(value)) {
                $($(item).find("[data-name='Preview']").parent()[0]).after(ele)
            }
        })
    })
}
 
(function () {
    'use strict';
    const style = document.createElement('style');
    const toast = document.createElement('div');
    style.innerHTML = `
 
    #tampermonkey-toast {
    display: none;
    cursor: pointer;
    position: fixed;
    top: 12%;
    flex-direction: column;
    left: 50%;
    z-index: 99999;
    transform: translate(-50%, -50%);
    background: transparent;
    align-items: center;
    }
    #tampermonkey-toast.none{
        display: none !important;
    }
    .tampermonkey-toast-content{
            color:#353535;
    }
        `;
    const submitReviewText = '还有 Submit review 没有处理'
    const resolveCommentText = '仍存在未Resolve的评论，将不能合并代码'
    let isShowSubmitReviewText = false;
    let isShowResolveCommentText = false;
 
    toast.id = 'tampermonkey-toast'
 
    $('head').append(style)
    $('body').append(toast)
 
    const toastClickHandle = () => {
        toast.classList.add("none");
        toast.removeEventListener('click', toastClickHandle)
    }
 
    toast.addEventListener('click', toastClickHandle)
    const handleToast = (isShowResolveCommentTextParams, isShowSubmitReviewTextParams) => {
        if (isShowResolveCommentTextParams === isShowResolveCommentText && isShowSubmitReviewTextParams === isShowSubmitReviewText) {
            return
        }
        isShowResolveCommentText = isShowResolveCommentTextParams
        isShowSubmitReviewText = isShowSubmitReviewTextParams
        const isShowToast = isShowResolveCommentText || isShowSubmitReviewText
        const toast = $('#tampermonkey-toast')
        toast.css('display', isShowToast ? 'flex' : 'none')
        const submitReviewTextHtml = isShowSubmitReviewText ? `
     <h2 class="tampermonkey-toast-content">
     ${submitReviewText}
     </h2>`
            : ''
        const resolveCommentTextHtml = isShowResolveCommentText ? `
     <h2 class="tampermonkey-toast-content">
     ${resolveCommentText}
     </h2>`
            : ''
        toast.html(`
    ${isShowSubmitReviewText ? submitReviewTextHtml : ''}
    ${isShowResolveCommentText ? resolveCommentTextHtml : ''}
    `)
    }
    let mergeBtn;
    let unResolveBtn;
 
    function findBtn(btn, selectors) {
        if (!btn || btn.length === 0) {
            for (let i = 0; i < selectors.length; i++) {
                btn = $(selectors[i])
                if (btn.length) {
                    break;
                }
            }
        }
        return btn
    }
 
    window.setInterval(() => {
        const mergeBtnSelectOr = [
            '.qa-merge-button',
            '#app > div > div > div.sc-gpHHfC.kVUvJF.codebase-widget-merge > div > div.sc-gHboQg.fHtJmu > div > div > button',
            '#content-body > div > div.merge-request-details.issuable-details > div.mr-state-widget.prepend-top-default > div.mr-section-container > div.mr-widget-section > div > div.space-children.d-flex.append-right-10.widget-status-icon > button'
        ]
        mergeBtn = findBtn(mergeBtn, mergeBtnSelectOr)
 
        const unResolveBtnSelectOr = [
            '#gitlab-diff-viewer > div > div.sc-gPzReC.hzmplu > div:nth-child(2) > button.ant-btn.ant-dropdown-trigger > span',
            '#app > div > div > div.sc-hIVACf.kzuFjX > div > div.sc-dliRfk.ebNhmW > div:nth-child(2) > button.ant-btn.ant-dropdown-trigger',
            '#gitlab-diff-viewer > div > div.sc-jrIrqw.hDMvqZ > div:nth-child(2) > button.ant-btn.ant-dropdown-trigger'
        ]
 
        unResolveBtn = findBtn(unResolveBtn, unResolveBtnSelectOr)
 
 
 
        if (mergeBtn.length && unResolveBtn.length) {
            const unResolveNumber = Number(parseFloat(unResolveBtn[0].innerText))
            const isExistUnResolve = unResolveNumber !== 0
            handleToast(isExistUnResolve, isShowSubmitReviewText)
            mergeBtn.attr({title: isExistUnResolve ? resolveCommentText : ''})
            mergeBtn.attr('disabled', isExistUnResolve)
        }
        const submitReviewSelectOr = [
            '#gitlab-diff-viewer > div > div.sc-gPzReC.hzmplu > div:nth-child(2) > span > div > button:nth-child(1)',
            '#gitlab-diff-viewer > div > div.sc-gPzReC.hzmplu > div:nth-child(2) > div.ant-btn-group > button:nth-child(1)',
            '#codebase-cr-full-screen > div.sc-kXeGPI.iEVqRe > div:nth-child(1) > div.sc-eTpRJs.sc-dxZgTM.gHfWdU > span > div > button:nth-child(1)',
            '#app > div > div > div.sc-hIVACf.kzuFjX > div > div.sc-dliRfk.ebNhmW > div:nth-child(2) > span > div > button:nth-child(1)'
        ]
 
        let submitReviewBtn
        for (let i = 0; i < submitReviewSelectOr.length; i++) {
            submitReviewBtn = $(submitReviewSelectOr[i])
            if (submitReviewBtn.length) {
                break;
            }
        }
        const textNode = submitReviewBtn.find('span:nth-child(1)')
        //是否发生改变
        let isDisabled
        const isSubmitReviewBtn = textNode[0]?.innerText === 'Submit review' || textNode[0]?.innerHTML === 'Submit review'
        if (isSubmitReviewBtn) {
            isDisabled = submitReviewBtn.attr('disabled') ?? false
        }
        handleToast(isShowResolveCommentText, isDisabled === undefined ? false : !isDisabled)
        $('.codebase-dv-tr').filter((index, item) => {
            return !$(item).attr('data-cr-marked')
        }).attr('data-cr-marked', true)
            .click(function () {
                setTimeout(() => {
                    addCateBtn()
                }, 500);
            })
    }, 1000);
})();
 