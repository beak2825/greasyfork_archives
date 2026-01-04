// ==UserScript==
// @name         提问小助手v1.4
// @namespace    armstrong@fanruan.com
// @version      1.1.4
// @description  问答小助手强力升级版
// @author       Armstrong
// @match        https://kms.fineres.com/qa/questions/ask
// @match        https://kms.fineres.com/display/support/qa/questions/ask
// @match        https://kms.fineres.com/tnqa/ask.action
// @match        https://kms.fineres.com/qa/questions/*
// @match        https://kms.fineres.com/display/support/qa/questions/*
// @match        https://kms.fineres.com/qa/questions
// @match        https://kms.fineres.com/display/support/qa/questions
// @grant        none
// @icon         https://kms.finedevelop.com/download/resources/com.elitesoftsp.confluence.tiny.question.answer.plugins:tiny-qa-main-res/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/415921/%E6%8F%90%E9%97%AE%E5%B0%8F%E5%8A%A9%E6%89%8Bv14.user.js
// @updateURL https://update.greasyfork.org/scripts/415921/%E6%8F%90%E9%97%AE%E5%B0%8F%E5%8A%A9%E6%89%8Bv14.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    if(window.location.href.indexOf("ask")!=-1){
  function insertImage(response) {
    var imageUrl = response.results[0]._links.download;
    var imageContent = '<p><img src="' + imageUrl + '" alt="" data-mce-selected="1"></p>'
    editor.innerHTML += imageContent;
  }

 function uploadFile(file) {
    var formdata = new FormData();
    var fileName = 'QA_Attachment_' + AJS.params.remoteUser + (+ new Date()) + '.' + file.type.split('/')[1];
    formdata.append('file', file, fileName);
    formdata.append('comment', 'Question & Answer attachment');
    formdata.append('minorEdit', 'true');
    var xhr = new XMLHttpRequest();
var uploadUrl = Confluence.getContextPath() + "/rest/api/content/" + AJS.params.contentId + "/child/attachment";
    xhr.onload = function() {
      if (xhr.status == 200) { insertImage(JSON.parse(xhr.response)); }
      else { alert("Error! Image upload failed"); }
    };
    xhr.onerror = function() {
      alert("Error! Image upload failed. Can not connect to server.");
    };
    xhr.open("POST", uploadUrl, true);
    xhr.setRequestHeader("X-Atlassian-Token", 'nocheck');
    xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
    xhr.send(formdata);
  }

  function handlePaste(e) {
    for (let i = 0 ; i < e.clipboardData.items.length ; i++) {
      var item = e.clipboardData.items[i];
      if (item.type.indexOf("image") != -1) uploadFile(item.getAsFile());
    }
  }
   var editor = document.getElementById('question-body_ifr').contentWindow.document.getElementById("tinymce");
  editor.addEventListener("paste", handlePaste);
  //支持图片粘贴功能
  
$('#question-form > div.page-title > h1').append('<a target="_blank" href="https://kms.fineres.com/x/OOPp">&nbsp;&nbsp;&nbsp;&nbsp;研发模块责任人</a>')
$('#question-form > div.page-title > h1').append('<a target="_blank" href="https://kms.fineres.com/x/cIDeAQ">&nbsp;&nbsp;&nbsp;&nbsp;测试模块责任人</a>')
//加两个超链

document.getElementById("title").value="【报表/BI/移动端/图表】【问题/需求】问题的简单描述，请自行修改"
//标题

$('input#postSpaceKeyAutoComplete').attr("placeholder","请手动输入kms空间，然后下拉列表选择")//提示文字
$('#postSpaceKey').val('support').trigger('change');
document.getElementById('postSpaceKey').value="support";
document.getElementById('postSpaceName').value="3.2 技术支持组";
document.getElementById('question-body_ifr').contentDocument.getElementById('tinymce').innerHTML=
"<p>【现象】：</p><p>【详情】：</p>详情有图片现象则直接贴图，省去下载的步骤。</br>如果对这个问题做出了自己的尝试，务必列出排查过程</br>说明主要疑问可以帮助理解，解决问题更高效</br> <p>【主要疑问】：</p><p>【JAR包版本】：</p><p>【相关插件】：相关插件若无则不写</p><p>【运行环境】：</p><p>【日志】：</p>";
$('.post-editor').after("<div><p style='color:red;font-size:25px'>P.S:<p>为了高效沟通，提问后可主动拿着链接咨询对应的研发测试同学</p></div>")
//内容和标题填充

var notice='<label  style=" color: red;">团队已经自动选择为bi技术支持。</br>模块项请选择最接近标签，后台根据标签推送给问题的责任研发，所以标签不是越多越好哦！</br>点击最下方的表格，可自动添加标签，不用再搜索啦！</label>'
 $('input#tags').parent('div.form-item').children('label').click(function(){window.open("https://kms.fineres.com/pages/viewpage.action?pageId=110273236")})
 $('input#tags').parent('div.form-item').children('label').css("text-decoration","underline").css("color","blue")//标签可点击，高亮
 $('input#tags').parent('div.form-item').children('label').eq(0).after(notice);
//标签说明

var beforeAll='<div style="width:1500px;margin:0 auto"><table id="t1" class="x-table" style="table-layout:fixed;width:100%;" cellspacing="0" id="0" cellpadding="0"><label style="color:red" id="qiyong">标签名称含【旧】的请勿使用，点击下方单元格可直接添加标签</label><p>选择技巧：选择范围最大的标签，例如在新填报预览的时候入库数据不对，则选“新填报”而不是“填报-提交入库”。</br>如果是定时调度发送短信的功能异常，其他功能正常，则选择“独立模块-短信”而不是“平台-定时调度”</p></table><table id="t2" class="x-table" style="table-layout:fixed;width:100%;" cellspacing="0" id="0" cellpadding="0"><label style="color:red" id="chajian">点我展开官方插件列表</label></table><div>'
$('#main').append(beforeAll);//先添加两个table，要加在main后面，加在content后面的话会格式错乱

function addTag(fineTag){
        var chosen='';//已经选择的标签
        $('li.select2-search-choice').each(function(){chosen=chosen+$(this).text().trim()+","})
        //console.log(chosen)
        //console.log(fineTag.replace("</br>",""));
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
function getRealTag(index){
        var RealTag="real";
        //console.log(index);
        if(index>9&&index<23){RealTag='官方插件-brude.deng维护列表'}
      else if(index>22&&index<29)
      {RealTag='官方插件-Hugh.C维护列表'}
      else if (index>28&&index<34) {RealTag='官方插件-kerry维护列表'}
        else if(index>33&&index<43){RealTag='官方插件-zack维护列表'}
    return RealTag;
     }
    var tags=['设计器-远程设计','平台-8.0&9.0平台数据迁移','平台-8.0/9.0平台功能','平台-finedb相关','平台-logdb相关','平台-swift相关',
    '平台-websocket相关问题','平台-代理相关','平台-其他基础模块</br>（不包含于其他标签）','平台-前台交互&展现逻辑','平台-外接数据库/迁移',
    '平台-外观配置','平台-安全管理','平台-官方接口使用','平台-定时调度','平台-定时调度-附件','平台-插件管理','平台-智能运维-云端运维',
    '平台-智能运维-内存管理/智能检测','平台-智能运维-备份还原','平台-智能运维-平台日志','平台-智能运维-资源迁移','平台-权限管理',
    '平台-模板认证','平台-注册管理','平台-用户管理','平台-登录/用户认证','平台-单点登录','平台-目录管理','平台-移动平台','平台-系统管理','独立模块-10.0升级工具&问题',
    '独立模块-web集群','独立模块-公有私有云','独立模块-压测相关','独立模块-多级上报','独立模块-安全','独立模块-宕机&性能问题','独立模块-性能优化插件',
    '独立模块-模板展现性能','独立模块-注册机制&注册异常','独立模块-独立/嵌入式/集成部署','独立模块-短信','独立模块-邮件','图表-api接口&报错',
    '图表-bug&需求&方案咨询','移动端','未知-找armstrong'];

    var chajianTags=['官方插件-URL登录','官方插件-json数据集','官方插件-mongodb','官方插件-sap&sapbw&多维数据源</br>&决策报表导出</br>&定时器导出任务支持行式引擎','官方插件-spider数据集</br>&参数控件tab顺序设置','官方插件-报表对接简道云','官方插件-清新风格','官方插件-滚动消息&数字时钟控件','官方插件-组件加载动画','官方插件-输出离线HTML报表</br>&模板短信事件','0官方插件-导出excel方式选择控件','官方插件-本地软件打印','官方插件-excel导入逻辑设置','官方插件-在ie下使用浏览器打开pdf进行打印','官方插件-csv导出编码','官方插件-平台内打开标签页','官方插件-多级上报集成','官方插件-使用新标签页上报和审核任务','官方插件-excel批量导入','官方插件-Excel流式导出支','官方插件-行式引擎','官方插件-导出CSV','官方插件-新打印忽略打印偏移配置表','官方插件-设计器内存监控','官方插件-单元格进度条','官方插件-字体扩展插件','官方插件-条件属性可使用页码参数','官方插件-模板版本控制','官方插件-水印插件','2官方插件-报表自适应插件','官方插件-集群部署','官方插件-自定义滚动条','官方插件-表单内报表块刷新','官方插件-模板消息事件','3官方插件-新多选下拉树控件','官方插件-缩进比例控制','官方插件-控件以711版本的外观展示','官方插件-权限导出','官方插件-邮件正文预览报表内容图片显示','官方插件-只支持中文搜索的下拉框控件','官方插件-图片导出设置插件','官方插件-地产行业通用单选按钮组控件','官方插件-国标code128条形码','官方插件-不维护插件列表</br>(点击查看)']
    var titles=[]
    var len=tags.length;//标签的总个数
    var chajianLen=chajianTags.length;//插件标签的总个数
    var everyCol=15;//每列标签的个数
   //$('body').append('<div style="width:100%;overflow:hidden;"><table class="x-table" style="border:thin solid #0000FF;width:100%></table></div>')
  // $('.form-submit').after('<div width=100%><table class="x-table" style="border:thin solid #0000FF;width:100%></table></div>')
   setTimeout(function(){
    $('#tags').val('bi技术支持');
        $('#tags').trigger('change');//添加fr技术支持标签

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
    var chajianCol=parseInt(chajianLen/colNum)+1//根据上面非插件的元素的个数和每列数，计算出上方表格的列数
      for(let jj=0;jj<chajianCol;jj++)
    {
    $('table#t2').append('<tr col="'+jj+'"></tr>');//生成了jj个tr元素
    }
    var chajianColNum=parseInt(chajianLen/Number(chajianCol))+1;//要生成的列数=取整(元素数量/每行元素数量)+1
    for(let ii=0;ii<chajianCol;ii++)//ii行
    {
        for(let tt=0;tt<chajianColNum;tt++)//tt列
        {

            if(chajianTags[Number(Number(tt*chajianCol)+ii)]!=undefined)
            {
                var ChajianMyName=chajianTags[Number(Number(tt*chajianCol)+ii)];
            $('table#t2').find('tr[col="'+ii+'"]').append('<td index='+Number(Number(tt*chajianCol)+ii)+' style="cursor:pointer;font-size:16px;display:none;border:thin  solid #00CED1;background-color:">'+ChajianMyName+'</td>')
            }
        }
    }
    //生成插件元素
setTimeout(function(){
for(let k=0;k<len;k++){
    $('table#t1').find('td[index='+k+']').click(function(){
         addTag($(this).text())
    })
}//非插件的单元格，点击之后直接设置标签为当前值+已选择的标签值
$('#chajian').click(function(){
     $('table#t2').find('td').css("display","")
})//点击展开官方插件列表
for(let kk=0;kk<10;kk++){
$('table#t2').find('td[index='+kk+']').click(function(){
     addTag($(this).text());
})}//官方插件列表里面，不属于维护列表的，点击之后直接设置标签为当前值+已选择的标签值
for(let kkk=10;kkk<chajianLen;kkk++){
$('table#t2').find('td[index='+kkk+']').click(function(){
    addTag(getRealTag($(this).attr("index")))
})}//属于维护列表的，根据单元格的序号，去找到对应的维护标签的名称
$('table#t2').find('td[index=43]').click(function(){
window.open("https://kms.fineres.com/pages/viewpage.action?pageId=109778012")
})
},2000)//最后一个单元格，点击打开不维护插件标签列表
   },2000)
//以上为生成标签列表的功能  
}
else
{
function MySearch(){
var inputString=$('#question-search').children('input').attr("value");
if(inputString.length==0)
{
alert("请输入搜索内容")  
}
else
{
window.open('https://kms.fineres.com/dosearchsite.action?cql=siteSearch+~+"'+inputString+'"+and+type+%3D+%22com.elitesoftsp.confluence.tiny.question.answer.plugins%3Aquestion%22')}
window.open('http://knowledge.fanruan.com/index.php?search-fulltext-title-'+inputString)
}
if(window.location.href.indexOf("qa/questions/?page=")!=-1||window.location.href=="https://kms.fineres.com/display/support/qa/questions"||window.location.href=="https://kms.fineres.com/qa/questions")
{
  console.log("首页")
$('#question-search').after('<button id="myButton">点我可以全文检索</button>')
setTimeout(function(){
$('a.question-hyperlink[href^="/display/support/qa/questions/"]').css("font-size","18px").css("font-weight",700).css("color","rgba(64,116,52,0.8)")
$('.excerpt').eq(0).css("color","rgba(3,38,58,1").css("font-weight",500)
//修改字体样式
var w=$('.status').eq(0).css("width")
var ht=$('.status').eq(0).css("height")
var imgg='<div align="center" style="width:'+w+';height:'+ht+'"><img id="solved" alt="Solved" title="Solved" src="/download/resources/com.elitesoftsp.confluence.tiny.question.answer.plugins:tiny-qa-main-res/images/accepted.png"></div>'
$('.question-summary').has('#solved-question').each(function(){$(this).find('.statscontainer').find('.stats').find('.status').after(imgg)})
//闭环更明显
$('#myButton').click(function(){MySearch()})},500)
  //全文检索功能
}
else if($('.post-text img')!=undefined)
{
console.log("问题页,有图片")
setTimeout(function(){
$('.post-text img').click(function(){
  (new AJS.Dialog(Math.min($(this)[0].naturalWidth+40, $('body').width()-20),Math.min($(this)[0].naturalHeight+100, $('body').height()-50)))
    .addPanel(1,'<img src="' + $(this)[0].src + '">')
    .addButton('Close', function (dialog) {dialog.remove()}, 'aui-test-cancel-button')
    .show()
})
},1000)
}
else
{
console.log("问题页,没有图片")
}
}
})();