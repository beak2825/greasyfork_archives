// ==UserScript==
// @name         南京工业大学教务系统自动评教
// @namespace    Njtech
// @version      1.18.2.7
// @description  可自动全部完全赞同，需手动更改选项才可提交！理论所有新版正方教务均可使用！
// @author       Gafer
// @match        https://jwgl.njtech.edu.cn/xspjgl/*
// @run-at       document-start
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @license     MIT/Expat License
// @downloadURL https://update.greasyfork.org/scripts/38236/%E5%8D%97%E4%BA%AC%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/38236/%E5%8D%97%E4%BA%AC%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

$(document).ready(function(){
    var main = "<div class='panel panel-primary' style='border-bottom: #0483d4 2px solid !important'><div class='panel-heading'><h3 class='panel-title'>自动评教</div></div><div class='panel-body'><button class='btn btn-success btn-lg btn-block' id='auto'><span class='glyphicon glyphicon-ok-sign' aria-hidden='true'></span> 自动评教(全部完全赞同)</button></br></div><div class='panel-footer'><p>注意：本插件可自动全部完全赞同，需手动更改选项才可提交！理论所有新版正方教务均可使用！</p></div></div><div class='modal fade' id='atten' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' id='myModalLabel'><span class='glyphicon glyphicon-warning-sign' aria-hidden='true'></span>  注意</h4></div><div class='modal-body'><h3> 已自动勾选为完全赞同！若满分无法提交，则需要修改选项才可提交！</h3></div><div class='modal-footer'><button type='button' class='btn btn-danger' data-dismiss='modal'>关闭</button></div></div></div></div>";
    $(".col-md-3").append(main);
});

 $("#auto").click(function(){
     $("input[data-dyf$='100']").attr("checked",true);
     $('#atten').modal('toggle');
 });
