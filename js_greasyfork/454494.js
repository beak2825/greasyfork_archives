// ==UserScript==
// @name         ACWing One Theme
// @name:zh-CN  ACWing One Theme
// @namespace    https://whalien.space
// @author       whalien
// @version      0.2
// @description  make acwing coding UI look more like leetcode
// @description:zh-CN 让acwing编程界面看起来更像leetcode
// @icon         https://cdn.acwing.com/static/web/img/favicon.ico
// @match        https://www.acwing.com/problem/content/*
// @run-at document-end
// @grant        GM_addStyle
// @grant        GM_log
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/454494/ACWing%20One%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/454494/ACWing%20One%20Theme.meta.js
// ==/UserScript==

const customCSS = `
/*---------- global settings ----------*/
.file-explorer-main-field-item.file-explorer-main-field-item-desktop {
  display: none;
}

.base_body {
  padding-top: 72px !important;
}

.base_body > .container {
  width: 98%;
}

.container > .panel.panel-default > .panel-body {
  height: calc(100vh - 72px - 20px);
  padding: 10px 15px;
}

.container > .panel > .panel-body > .row {
  height: 100%;
  margin-top: 8px;
}

.base_body .row .problem-content-container {
  max-height: calc(100% - 100px);
  overflow-y: auto;
}

.container > .panel .panel-body .problem-content-title {
  font-size: 24px;
  margin: 5px 0 10px 0;
}

.base_body .row .code-editor-container {
  height: calc(100% - 110px);
  max-height: 100%;
  overflow-y: auto;
  width: calc(50% - 24px);
}
/*---------- end of global settings ----------*/

/*---------- navigation settings ----------*/
.container > .panel .nav.nav-tabs .problem-content-sub-btn{
  font-size: 1.5rem;
}

.container > .panel .nav.nav-tabs .problem-content-sub-btn .glyphicon {
  top: 2px !important;
}
/*----------- end of navigation settings ----------*/

/*----------- remove br before code editor ----------*/
.container > .panel .panel-body .nav-tabs.nav + br {
  display: none;
}

/*----------- code editor settings toolset ----------*/
.base_body .code-editor-container #code_tool_bar {
  height: 48px;
}

.base_body #code_tool_bar #open_ac_saber_btn{
  top: 9px !important;
}

.base_body #code_tool_bar .btn {
  padding-top: 0;
}

.base_body #code_tool_bar .btn .editor_tool_btn {
  padding-right: 10px;
}

.base_body #code_tool_bar .code_editor_option_language {
  margin-top: 3px !important;
}
/*----------- end of code editor settings toolset ----------*/

/*----------- submit controls ----------*/
#code_editor + div {
  position: fixed;
  bottom: 2px;
  right: 200px;
  z-index: 10000000;
}

/*
#code_editor + div .btn {
  padding: 4px 8px;
}
*/

#data-augmentation-div {
  padding-top: 27px !important;
  padding-right: 12px !important;
  color: white !important;
}
/*----------- end of submit controls ----------*/

/*----------- evaluation block ----------*/
#submit-code-status-block {
  margin-top: 25px !important;
}

#run-code-status-block {
  margin-top: 25px !important;
}
/*----------- end of evaluation block ----------*/

/*----------- dragable wedge ----------*/
.base_body .dragable-wedge {
  float: left;
/*  display: inline-block; */
  width: 10px;
  height: calc(100% - 94px);
}

.base_body .dragable-wedge:hover {
  background-color: rgb(0, 122, 255);
  cursor: col-resize;
}
/*----------- end of dragable wedge ----------*/
`

const throttle = (fn, delay) => {
    let timer = null
    return (...args) => {
        if(timer) return
        timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
        }, delay)
        fn(...args)
    }
}

function adjustLayout() {
    const problemContainer = document.querySelector('.panel-body .row')

    // make probleDiv take half the width
    const problemDiv = document.querySelector('.panel-body .row .col-sm-9.col-xs-12')
    problemDiv.className = 'problem-content-container col-sm-6 col-xs-12'
    // make infoDiv take the same width as problemDiv
    const infoDiv = document.querySelector('.panel-body .row .col-sm-3.hidden-xs')
    infoDiv.className=''
    problemDiv.appendChild(infoDiv)

    // move code editor to the same row as problem content
    const fragment = document.createDocumentFragment()
    const codeEditorDiv = document.createElement('div')
    codeEditorDiv.className = 'code-editor-container col-sm-5'
    const codeEditorFrag = document.querySelectorAll('.panel-body > .row ~ div')
    codeEditorFrag.forEach((editorFrag) => {
        codeEditorDiv.appendChild(editorFrag)
    })
    fragment.appendChild(codeEditorDiv)
    problemContainer.appendChild(fragment)

    // add dragable resizer
    const dragableDiv = document.createElement('div')
    dragableDiv.className = 'dragable-wedge'
    problemContainer.insertBefore(dragableDiv, codeEditorDiv)

    // get the last container width and set
    const lastProblemWidth = localStorage.getItem('problemWidth')
    const lastCodeEditorWidth = localStorage.getItem('codeEditorWidth')
    if(lastProblemWidth!==null && lastCodeEditorWidth!==null) {
        problemDiv.style.width = lastProblemWidth
        codeEditorDiv.style.width = lastCodeEditorWidth
    }
}

let lastX = -1
function enableDragAndDrop() {
    const problemContent = document.querySelector('.base_body .problem-content-container')
    const codeEditor = document.querySelector('.base_body .code-editor-container')
    const resizer = document.querySelector('.base_body .dragable-wedge')
    const dragEventHandler = (e) => {
        const dx = lastX == -1 ? 0:e.clientX - lastX
        lastX = e.clientX
        if(dx > 100 || dx == 0) return

        let problemContentWidth = problemContent.getBoundingClientRect().width + dx
        let codeEditorWidth = codeEditor.getBoundingClientRect().width - dx
        if(problemContentWidth < 0 || codeEditorWidth < 0) {
            return
        }

        problemContentWidth = `${problemContentWidth}px`
        codeEditorWidth = `${codeEditorWidth}px`
        problemContent.style.width = problemContentWidth
        codeEditor.style.width = codeEditorWidth
        localStorage.setItem('problemWidth', problemContentWidth)
        localStorage.setItem('codeEditorWidth', codeEditorWidth)
    }
    resizer.addEventListener('drag', throttle(dragEventHandler, 60))
}

function bindSubmitScrollBehavior() {
    const codeEditorContainer = document.querySelector('.base_body .code-editor-container')
    const submitBtn = document.querySelector('#submit_code_btn')
    const runCodeBtn = document.querySelector('#run_code_btn')
    // FIXME(whalien): figure out why we cannot delegate click event to the outer div
    submitBtn.addEventListener('click', (e) => {
        setTimeout(()=> {
            codeEditorContainer.scrollTo({
                left: 0,
                top: codeEditorContainer.scrollHeight,
                behavior: 'smooth'
            })
        }, 1000)
    })
    runCodeBtn.addEventListener('click', (e) => {
        setTimeout(()=> {
            codeEditorContainer.scrollTo({
                left: 0,
                top: codeEditorContainer.scrollHeight,
                behavior: 'smooth'
            })
        }, 1000)
    });
}

(function() {
    'use strict';
    adjustLayout()

    GM_addStyle(customCSS)

    enableDragAndDrop()

    bindSubmitScrollBehavior()
})();