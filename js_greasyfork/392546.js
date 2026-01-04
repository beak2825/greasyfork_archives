// ==UserScript==
// @name         jsbin dark theme and tweaks
// @namespace    yuze
// @version      0.2
// @description  jsbin dark theme and tweaks.
// @author       yuze
// @match        https://jsbin.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392546/jsbin%20dark%20theme%20and%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/392546/jsbin%20dark%20theme%20and%20tweaks.meta.js
// ==/UserScript==

$('body').append(`
<style>
/* BEGIN visibility tweaks */
.bsaapi main{
    height: calc(100% + 40px);
    margin-top: -40px;
}
.stretch{
    border: 0px solid black !important;
}
#control{
    margin-top: 17px;
    transition: 256ms;
    opacity: 0;
    background: #1E1E1E !important;
    border: none;
    box-shadow: 0px 32px 32px rgba(0,0,0,0.1314), 0 8px 12px rgba(0,0,0,0.18)
}
#control:hover{
    margin-top: 40px;
    position: fixed;
    opacity: 1;
}
#toppanel img{
     opacity: 0;
}
#toppanel img:hover{
     opacity: 1;
}
.label, .label.menu{
    z-index:9;
    padding-bottom: 6px;
}
.label .options{
    position: fixed;
    bottom: 12px;
    right: 12px;
}
.name a, .name{
    color: gainsboro !important;
    font-weight: bold !important;
}
.card{
    transition: 256ms;
    opacity: 0;
    bottom: 48px;
}
.card:hover{
    opacity: 1;
}
button {
    transition: 314ms;
    background: #007ACC !important;
    border: 0;
    color: white !important;
    padding: 6px 12px;
    opacity: 0;
}
button:hover {
    opacity: 1;
}
#bin .editbox .CodeMirror pre, .CodeMirror-linenumber {
    font-family: 'SFMono-Regular', Consolas, monospace !important;
    font-size: 15px;
    line-height: 22px;
    font-weight: normal !important;
}
#live{
    margin-top: -31px;
}
/* END visibility tweaks */

/* BEGIN console theme */

.stretch.console.panel, .CodeMirror-gutter{
    color: #D4D4D4 !important;
    background-color: rgb(30, 30, 30) !important;
}

li.true, li.true .str{
    border-color: #3C3C3C !important;
    color: #6A9955 !important;
}
li.error{
    border-color: #5B0000 !important;
    border-bottom: 1px solid #5B0000 !important;
    padding-bottom: 8px !important;
    color: #FE7F7F !important;
    background: #280000 !important;
}
li.true .kwd, li.true .lit{
    color: #9980FF !important;
}
li.true .typ{
    color: #569CD6 !important;
}
li.true .pun, li.true .pln{
    color: #D4D4D4 !important;
}
li.true .com{
    color: #D7BA7D !important;
}
.CodeMirror-lint-mark-warning {
    background-image: none;
    border-bottom: 1px dotted #569CD6 !important;
}

/* END console theme */

/* BEGIN theme */



.CodeMirror { background-color: rgb(30, 30, 30); color: #D4D4D4 !important; }
div.CodeMirror-selected, .CodeMirror-focused .CodeMirror-selected { background: #264F78 !important; }
.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #264F78 !important; }
.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #264F78 !important; }
.CodeMirror-gutters { background-color: rgb(30, 30, 30); border-right: 0px; }
.CodeMirror-guttermarker { color: #ac4142 !important; }
.CodeMirror-guttermarker-subtle { color: #505050 !important; }
.CodeMirror-linenumber { color: #505050 !important; }
.CodeMirror-cursor { border-left: 2px solid #b0b0b0 !important; }

.CodeMirror-highlight-line, .CodeMirror-highlight-line .CodeMirror-linenumber, .CodeMirror-highlight-line-background { background: #311B92 !important; }

span.cm-comment { color: #6A9955 !important; }
span.cm-atom { color: #D4D4D4 !important; }
span.cm-number { color: #B5CEA8 !important; }

span.cm-property, span.cm-attribute, span.cm-operator { color: #D4D4D4 !important; }
span.cm-keyword { color: #569CD6 !important; }
span.cm-string { color: #CE9178 !important; }

span.cm-variable { color: #D4D4D4 !important; }
span.cm-builtin { color: #d7ba7d !important; }
span.cm-meta { color: #3e9cd6 !important; }
span.cm-qualifier { color: #d7ba7d !important; }
span.cm-variable-2 { color: #D4D4D4 !important; }
span.cm-def { color: #D4D4D4 !important; }
span.cm-bracket { color: #6D6D6D !important; }
span.cm-tag { color: #569CD6 !important; }
span.cm-link { color: #D7BA7D !important; }
span.cm-error { background: #280000 !important; color: #FE7F7F !important; }

.CodeMirror-activeline-gutter, .CodeMirror-activeline-background { background-color: rgb(45, 45, 45); }
.CodeMirror-lint-mark-error {
    background-image: none;
    border-bottom: 1px dotted #af2d2d !important;
}

/* END theme */

.CodeMirror-vscrollbar::-webkit-scrollbar,
.CodeMirror-vscrollbar::-webkit-scrollbar-thumb,
#console::-webkit-scrollbar,
#console::-webkit-scrollbar-thumb{
  width: 16px;
  background-clip: padding-box;
    color: #2d2d2d;
  border: 5px solid #1e1e1e;
}

.CodeMirror-vscrollbar::-webkit-scrollbar-thumb,
#console::-webkit-scrollbar-thumb{        
  box-shadow: inset 0 0 0 10px;
}

#cursor {
    color: #5b9dff;
}

</style>
`)


window.addEventListener('load', keyListener)

function keyListener() {
   window.addEventListener('keydown', keyActions)
}

function keyActions(e) {
    if ( e.ctrlKey && e.key == 'l' ) {
        e.preventDefault()
        clearconsole.click()
    }
        if ( e.altKey && e.key == '1' ) {
        $('#panels').children().eq(0)[0].click()
    }
            if ( e.altKey && e.key == '2' ) {
        $('#panels').children().eq(1)[0].click()
    }
            if ( e.altKey && e.key == '3' ) {
        $('#panels').children().eq(2)[0].click()
    }
            if ( e.altKey && e.key == '4' ) {
        $('#panels').children().eq(3)[0].click()
    }
            if ( e.altKey && e.key == '5' ) {
        $('#panels').children().eq(4)[0].click()
    }
}