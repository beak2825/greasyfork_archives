// ==UserScript==
// @name         问答使用小助手
// @namespace    armstrong@fanruan.com
// @version      1.0.1
// @description  具有多种银杏化的功能
// @author       Armstrong
// @match        https://kms.fineres.com/qa/questions/ask
// @match        https://kms.fineres.com/display/supporttest/qa/questions/ask
// @match        https://kms.fineres.com/tnqa/ask.action
// @match        https://kms.fineres.com/qa/questions/*
// @match        https://kms.fineres.com/display/supporttest/qa/questions/*
// @match        https://kms.fineres.com/qa/questions
// @match        https://kms.fineres.com/display/supporttest/qa/questions
// @grant        none
// @icon         https://kms.finedevelop.com/download/resources/com.elitesoftsp.confluence.tiny.question.answer.plugins:tiny-qa-main-res/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/431098/%E9%97%AE%E7%AD%94%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431098/%E9%97%AE%E7%AD%94%E4%BD%BF%E7%94%A8%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    if(window.location.href.indexOf("ask")!=-1){

$('#question-form > div.page-title > h1').append('<a target="_blank" href="https://kms.fineres.com/pages/viewpage.action?pageId=237907399">&nbsp;&nbsp;&nbsp;&nbsp;查看问答使用方法</a>')
//加个超链

document.getElementById("title").value="【报表/BI/移动端/图表】【问题/需求】问题的简单描述，请自行修改"
//标题

$('input#postSpaceKeyAutoComplete').attr("placeholder","请手动输入kms空间，然后下拉列表选择")//提示文字
$('#postSpaceKey').val('supporttest').trigger('change');
document.getElementById('postSpaceKey').value="supporttest";
document.getElementById('postSpaceName').value="汇才技术支持";
document.getElementById('question-body_ifr').contentDocument.getElementById('tinymce').innerHTML=
"<p>【现象】：</p><p>【详情】：</p><p>【主要疑问】：</p><p>【JAR包版本】：</p><p>【相关插件】：</p><p>【运行环境】：</p><p>【日志】：</p>";
$('.post-editor').after("<div><p style='color:red;font-size:25px'>P.S</p><p>详情有图片现象则直接贴图，省去下载的步骤。</p><p>如果对这个问题做出了自己的尝试，务必列出排查过程</p><p>说明主要疑问可以帮助理解，解决问题更高效</p><p>相关插件若无则不写</p><p>使用insert link来上传文件，尽量截取与问题相关的那一段日志，尽量避免整个上传</p></div>")
//内容和标题填充

var notice='<label  style=" color: red;">标签不少于3项（团队+版本+模块），团队已经自动选择为汇才技术支持。</br>模块项请选择最接近标签，后台根据标签推送给问题的责任研发，所以标签不是越多越好哦！</br>点击最下方的表格，可自动添加标签，不用再搜索啦！</label>'
 $('input#tags').parent('div.form-item').children('label').eq(0).after(notice);
//标签说明

var beforeAll='<div style="width:1500px;margin:0 auto"><table id="t1" class="x-table" style="table-layout:fixed;width:100%;" cellspacing="0" id="0" cellpadding="0"><label style="color:red" id="qiyong">点击下方单元格可直接添加标签</label><p>选择技巧：选择范围最大的标签，例如在新填报预览的时候入库数据不对，则选“新填报”而不是“填报-提交入库”。</br>如果是定时调度发送短信的功能异常，其他功能正常，则选择“独立模块-短信”而不是“平台-定时调度”</p></table><table id="t2" class="x-table" style="table-layout:fixed;width:100%;" cellspacing="0" id="0" cellpadding="0"></table><div>'
$('#main').append(beforeAll);//先添加两个table，要加在main后面，加在content后面的话会格式错乱

function addTag(fineTag){
        var chosen='';//已经选择的标签
        $('li.select2-search-choice').each(function(){chosen=chosen+$(this).text().trim()+","})
        $('#tags').val(chosen+fineTag.replace("</br>",""))
        $('#tags').trigger('change')
     }
function getColor(name){
        var color="#00CED1";
       if(name.indexOf("finereport-")!=-1)
       {color="#FFFFE0"}
       else if (name.indexOf("决策报表-")!=-1)
       {color="#FFE1FF"}
       else if (name.indexOf("参数-")!=-1)
       {color="#F0FFF0"}
       else if (name.indexOf("图表-")!=-1||(name.indexOf("移动端")!=-1))
       {color='#D1EEEE'}
       else if(name.indexOf("填报-")!=-1)
       {color='#8DB6CD'}
       else if(name.indexOf("官方插件-")!=-1)
       {color='#E0EEEE'}
       else if(name.indexOf("展现-")!=-1)
       {color='#E0FFFF'}
       else if(name.indexOf("平台-")!=-1)
       {color='#FAF0E6'}
       else if(name.indexOf("独立模块-")!=-1)
       {color='#F0F8FF'}
       else if(name.indexOf("计算-")!=-1||name.indexOf("输出-")!=-1)
       {color='#EEB4B4'}
       else if(name.indexOf("设计器-")!=-1)
       {color='FFAEB9'}
       else
       {color='#EBEBEB'}
        return color;
     }

    var tags=['finereport-10.0','finereport-7.0','finereport-8.0','finereport-9.0','数据源-原生方法（非插件）','输出-导出pdf','输出-打印&导出（除了pdf）','决策报表-展现/布局/性能','决策报表-离屏控制','决策报表-设计/制作','参数-参数计算','参数-参数面板控件','填报-导入excel','填报-控件','填报-提交入库&插入删除行','填报-新填报预览','填报-暂存',
    '展现-html解析&参数组合&icu换行','展现-其他展现效果（例如边框/背景等）','展现-冻结','展现-国际化','展现-折叠树&工具栏&条形码',
    '展现-数据分析预览','展现-条件属性&形态&超链','展现-水印','展现-自适应','计算-公式计算和解析',
    '计算-单元格过滤','计算-新引擎','计算-行式引擎&分页sql','计算-计算性能','设计器-操作/交互/性能','设计器-更新升级',
    '设计器-模板版本管理','设计器-远程设计','平台-8.0&9.0平台数据迁移','平台-8.0/9.0平台功能','平台-finedb相关','平台-logdb相关','平台-swift相关',
    '平台-websocket相关问题','平台-代理相关','平台-其他基础模块</br>（不包含于其他标签）','平台-前台交互&展现逻辑','平台-外接数据库/迁移',
    '平台-外观配置','平台-安全管理','平台-官方接口使用','平台-定时调度','平台-定时调度-附件','平台-插件管理','平台-智能运维-云端运维',
    '平台-智能运维-内存管理/智能检测','平台-智能运维-备份还原','平台-智能运维-平台日志','平台-智能运维-资源迁移','平台-权限管理',
    '平台-模板认证','平台-注册管理','平台-用户管理','平台-登录/用户认证','平台-单点登录','平台-目录管理','平台-移动平台','平台-系统管理','独立模块-10.0升级工具&问题',
    '独立模块-web集群','独立模块-公有私有云','独立模块-压测相关','独立模块-多级上报','独立模块-安全','独立模块-宕机&性能问题','独立模块-性能优化插件',
    '独立模块-模板展现性能','独立模块-注册机制&注册异常','独立模块-独立/嵌入式/集成部署','独立模块-短信','独立模块-邮件','图表-api接口&报错',
    '图表-bug&需求&方案咨询','移动端'];

     var titles=[]
    var len=tags.length;//标签的总个数
    var everyCol=15;//每列标签的个数

   setTimeout(function(){
    $('#tags').val('汇才技术支持');
        $('#tags').trigger('change');//添加技术支持标签

    for(let j=0;j<everyCol;j++)
    {
    $('table#t1').append('<tr col="'+j+'"></tr>');//生成了everyCol个tr元素
    }
    var colNum=parseInt(len/Number(everyCol))+1;//要生成的列数=取整(元素数量/每行元素数量)+1
    for(let i=0;i<everyCol;i++)//i行
    {
        for(let t=0;t<colNum;t++)//t列
        {
            if(tags[Number(Number(t*everyCol)+i)]!=undefined)
            {
                var myName=tags[Number(Number(t*everyCol)+i)];
                $('table#t1').find('tr[col="'+i+'"]').append('<td index='+Number(Number(t*everyCol)+i)+' style="cursor:pointer;font-size:16px;border:thin  solid #00CED1;background-color:'+getColor(myName)+'">'+myName+'</td>')
            }
        }
    }//生成非插件的元素

setTimeout(function(){
for(let k=0;k<len;k++){
    $('table#t1').find('td[index='+k+']').click(function(){
         addTag($(this).text())
    })
}//非插件的单元格，点击之后直接设置标签为当前值+已选择的标签值
$('#chajian').click(function(){
  alert("已经添加所有官方插件的问答标签,请在上方标签输入框中直接搜索插件名称~搜不到请联系Armstrong")
     //$('table#t2').find('td').css("display","")
})//点击展开官方插件列表
for(let kk=0;kk<10;kk++){
$('table#t2').find('td[index='+kk+']').click(function(){
     addTag($(this).text());
})}//官方插件列表里面，不属于维护列表的，点击之后直接设置标签为当前值+已选择的标签值

},2000)//最后一个单元格，点击打开不维护插件标签列表
   },2000)
//以上为生成标签列表的功能
}
})();