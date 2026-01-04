// ==UserScript==
// @name         用例管理系统优化
// @namespace    armstrong@fanruan.com
// @version      1.0.4
// @description  增加小工具来隐藏右侧栏目
// @author       Armstrong
// @match        https://work.fineres.com/browse/*
// @match        https://work.fineres.com/projects/*
// @include     /^https?://work\.fineres\.com.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431005/%E7%94%A8%E4%BE%8B%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431005/%E7%94%A8%E4%BE%8B%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
    'use strict';
  // ### 全局的监听方法, 包装了一下MutationObserver, 当监听到指定选择器的元素被加载时, 执行回调
  window.waitForAddedNode = function(params) {
    if(params.immediate) {
      const matched = [];
      matched.push(...document.querySelectorAll(params.selector));
      const smatched = [...new Set(matched)]
      for (const el of smatched) {
        params.done(el);
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
      for (const el of smatched) {
        params.done(el);
      }
    });
    observer.observe(document.querySelector(params.parent) || document.body, {
      subtree: !!params.recursive || !params.parent,
      childList: true,
    });
  }

function comeon(){
console.error("开始执行")
if($('#issuedetails').find("#type-val").text().trim()=="测试"){
var full_width=Number($('#issue-content').css("width").replace("px",""))
var float_width=100,float_height=20;
var float_left=(full_width-float_width)/2
var floatlabel='<div id="float-label-add" onClick="hello()" style="height:'+float_height+'px; margin: 0 auto;left:'+float_left+'px;position:fixed;z-index:250;background-color:Honeydew"><span style="cursor:pointer;">右侧栏目</span></div>'
console.error("出现吧")
$('.issue-header.js-stalker').before(floatlabel)
var status=localStorage.getItem("visible_now");

if(status=="null"||status==null||status=='no')
{

	$('#viewissuesidebar').hide()
	$('#float-label-add span').text("右侧栏目已收缩")
}
else
{
    $('#viewissuesidebar').show()
    $('#float-label-add span').text("右侧栏目已展开")
}}
}

window.hello=function(){
	$('#viewissuesidebar').toggle()
    $('#float-label-add span').text($('#float-label-add span').text()=="右侧栏目已收缩"?"右侧栏目已展开":"右侧栏目已收缩")
    localStorage.setItem("visible_now",$('#viewissuesidebar').is(":visible")==true?"yes":"no")
    }
var address=location.href;
if(address.indexOf("QA-")>-1||address.indexOf("TT-")>-1){
	window.waitForAddedNode({
    selector: '#WorklogByUserPanel_heading',
    recursive: false,
    done:comeon,
    immediate:true
  });

}
})();