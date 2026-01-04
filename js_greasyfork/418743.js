// ==UserScript==
// @name         CFS全局优化
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  2021
// @author       You
// @match        *://icop.y2t.com/cfs/*
// @match        *://sc.y2t.com/cfs/*
// @match        *://llncfs.transgd.com.cn:17003/cfs/*
// @match        *://llnoc.transgd.com.cn:17003/oc/*
// @match        *://icop.y2t.com/dckcfs/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @license      No license
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @resource     iconStandard http://172.28.72.50:6189/install/CFSCSS/icons/icon-standard.css
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/418743/CFS%E5%85%A8%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/418743/CFS%E5%85%A8%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
//修改系统附件上传函数
unsafeWindow.imager_photo_Extension = ["JPG", "BMP", "GIG", "PNG", "TIF", "RGB", "DIB", "EPS", "JPE", "PCX", "GIF", "jpg", "bmp", "gig", "png", "tif", "rgb", "dib", "eps", "jpe", "pcx", "gif", "jpeg", "JPEG", "PDF", "pdf", "jpeg", "JPEG", "PDF", "pdf"];
unsafeWindow.verification_FJ_fileSizeControl = function (fileSize,fileName){
    var defSize;
    $('#imagerSizeSelect').combobox('setValue', '1600x*(等比压缩)')
    //2015年9月14日11:18:37 wj+ 如果附件类型是等比压缩就不进行大小限制（后台会自动压缩）
    var imagerSelect=$('#imagerSizeSelect').combobox("getValue");
    var isPhoto=false;
    var houzhui=fileName.split(".")[fileName.split(".").length-1];
    $.each(imager_photo_Extension,function(index,value){
        if(houzhui==value){
            isPhoto=true;
        }
    });
    if("auto"!=imagerSelect && isPhoto){
        //如果可压缩图片大于10mb、也会有问题、因为压缩后大于300k了、差不多500k左右吧、所以控制10mb以下就最好了！
        defSize=parseInt(1024*10000);//1kb=1024B
        fileSize=parseInt(fileSize);
        //最多支持10000K的文件。
        if(fileSize>defSize){
            $alertShow("文件【"+fileName+"】超出系统限制大小(10000kb=10MB)【或该类型不支持压缩】,以停止上传!");
            return false;
        }
        return true;
    }
    defSize=parseInt(1024*300);//1kb=1024B
    fileSize=parseInt(fileSize);
    //最多支持300K的文件。
    if(fileSize>defSize){
        $alertShow("文件【"+fileName+"】超出系统限制大小(300kb)【或该类型不支持压缩】,以停止上传!");
        return false;
    }
    return true;
}
//附件类型

//查看图片
unsafeWindow.getSelectImage_FJ = function (basBlobUuid,typeDesc){

}
//判断是否是窗口打开
if (top.location == self.location){
    $('body').eq(0).attr('id','newyear')
    document.addEventListener("DOMContentLoaded", DOM_ContentReady);
    window.addEventListener("load", pageFullyLoaded);
    function pageFullyLoaded() {
        console.log("==> 页面已完全加载，包括图像.", new Date());
        $("div[id^='mask_div']").remove();
    }
    function DOM_ContentReady() {
        //这里是脚本运行的第二部分。
        // 这相当于 @run-at document-end
        console.log("==> 脚本运行第二部分.", new Date());
    }
    $('.easyui-layout > .layout-split-north').eq(0).attr("id","888")
    $(".easyui-layout > div[region='north']").eq(0).css("height","1000")
    setTimeout(function() {
        $('#newyear').layout('expand','west');
        $('#leftAccordion').accordion('select','订单信息管理');
        addTabs("整柜运输订单查询","/cfs/jsp/phc/order/fullContainerSoQuery.jsp","",true)
    },1000)
}else{
}
$.parser.onComplete = function () {

    var date = {
        isDuringDate: function (beginDateStr, endDateStr) {
            var curDate = new Date(),
                beginDate = new Date(beginDateStr),
                endDate = new Date(endDateStr);
            if (curDate >= beginDate && curDate <= endDate) {
                return true;
            }
            return false;
        }
    }
    //最后把坑爹的事件绑定解除
    $.parser.onComplete = function () { };
};

//排序设置为非服务器排序
$('#deliveryOrderdatagird').datagrid({
    remoteSort: false
});

//点击附件列表触发事件
$('#saoMiaoJianDataGroug_public').datagrid({
    ctrlSelect: true,
    striped: true,
    onSelect: function(rowIndex, rowData) {
        console.log(rowData);
        $("#imagerMinGet_FJ p").remove();
        switch(rowData.typeCode){
            case "船封号照片":
                tipsPic($('#cw4No').val());
                break;
            case "picDriverLicense":
                tipsPic($('#contactName').val());
                break;
            case "axle":
                tipsPic($('#tractorType').combo('getText'));
                break;
            case "柜门照片":
                tipsPic($('#containerNo').val()+"</br>"+$("#tareWeight").val());
                break;
            default :
                break;
        }
        var a = rowData.typeDesc
        var point = a.lastIndexOf(".");
        var type = a.substr(point);
        var basBlobUuid = rowData.basBlobUuid
        var link = "/cfs/temp/" + basBlobUuid + type;
        if (type == ".PDF" || type == ".pdf") {
            var lookUrl = "http://llncfs.transgd.com.cn:17003/cfs/sysNewsDownFileAction.do?basBlobUuid="+basBlobUuid;
            pdfLook(lookUrl,"pdf");
        }else{
            lookImg(basBlobUuid,"Dclick")
        }
    },
    columns:[[
        {field:'typeDesc',title:"附件名称",width:130,resizable:true},
        {field:'typeCode',title:"类型",width:70,align:'center'},
        {field:'remark',title:"备注",width:90,formatter:remark_FJ_Atter},
        {field:'createTime',title:"上传时间",width:125,align:'center'},
        {field:'userName',title:"上传人",width:50,align:'center'},
        {field:'status',title:"操作",formatter:caoZuoButton_FJ,width:200,align:'center'}
    ]],
    toolbar: [{
        iconCls: 'icon-standard-application-xp',
        text:'新窗口打开',
        handler: function() {
            var row = $("#saoMiaoJianDataGroug_public").datagrid('getSelections')[0];
            var rows = $("#saoMiaoJianDataGroug_public").datagrid('getSelections');
            var a = row.typeDesc
            var point = a.lastIndexOf(".");
            var type = a.substr(point);
            console.log(type);
            if (rows.length) {
                var lookUrl = "http://llncfs.transgd.com.cn:17003/cfs/sysNewsDownFileAction.do?basBlobUuid="+ row.basBlobUuid;
                if(type == ".pdf" || type == ".PDF"){
                    pdfLook(lookUrl,"pdf","win");
                }else{
                    lookImg(row.basBlobUuid,"win");
                };

            } else {
                sliderelay("系统提示", "你还没有选择附件");
            }
        }
    }, '-', {
        iconCls: 'icon-standard-arrow-down',
        text:'下一个',
        handler: nextorder
    }, '-', {
        iconCls: 'icon-standard-page-white-acrobat',
        text:'下载PDF',
        handler: downloadPDF
    }, '-', {
        iconCls: 'myCustomerIcon_remove',
        text:'删除',
        handler: function() {
            var allData = getPublicDatagridSelectedS(tab1_fj_id);
            if (allData.length > 0) {
                $.messager.confirm("确认框", "是否确认删除选中附件?", function(r) {
                    if (r) {
                        LogisticsOrderManager.remoreFuJianImager(allData, function(spj) {
                            showMsg(spj);
                            $("#imagerMinGet_FJ")[0].innerHTML = "";
                            $("#" + tab1_fj_id).datagrid("reload");
                        });
                    }
                });
            } else {
                $alertShow(0);
            }
        }
    }]
});

//图片提示
function tipsPic(tips){
    $("#imagerMinGet_FJ").append('<p id="tips">'+tips+'</a>');
}

//查看附件
function lookImg(uuid,type){
    LogisticsOrderManager.getSelectGenerationPictureImage(uuid,"GWD","/u01/wls/weblogic/middleware/user_projects/domains/base_domain/servers/server53/tmp/_WL_user/llncfs21011901_53/eibsr4/war/jsp",function(node){
        if(node&&node.result){
            if(type == "Dclick"){
                $("#imagerMinGet_FJ").html("");
                $("#imagerMinGet_FJ").append("<img src=" + node.object.typeDesc + " style='width:100%;height:auto;'>");
            }else if(type == "win"){
                window.open(node.object.typeDesc);
            }
        }else if(!node.result){
            $alertShow("返回错误信息:"+node.error);
        }else{
            $alertShow("没有返回任何数据！");
        }
    });
}

//下一个
function nextorder(uuid,bak){
    var rows = $("#detailgrid").datagrid('getData').rows;
    var ccg = $("#detailgrid").datagrid('getSelected').rownum;
    var jindu = (ccg+1)/rows.length*100;
    if(ccg < rows.length){
        if($('.dz-success').length){
            $('.dz-success').remove();
        }
        $("#detailgrid").datagrid('unselectRow',ccg-1);
        $("#detailgrid").datagrid('selectRow',ccg);
        setAttchmenUpDownUuid($("#detailgrid").datagrid('getSelected').submitOrderUuid);
        var xuanzhong = $("#detailgrid").datagrid('getSelected');
        if(xuanzhong.solAux2 == "Y" && xuanzhong.solAux1=="Y"){
            $('#modelIds').next().attr('style','color:#002bff;text-align: center;margin-top:15px; font-size: 14px;')
        }else{
            $('#modelIds').next().attr('style','color:red;text-align: center;margin-top:15px; font-size: 14px;')
        }
        $('#modelIds').next().html('SO号：<a href="javascript:void(0);" style="font-size:16px;" onclick="book()">' + xuanzhong.orderNo+'</a><div style="border: 1px solid #8bc34a;height: 10px;border-radius: 8px;"><div style="margin-left:-1px;border-radius: 8px;width:calc( '+jindu+'% + 2px);background-color:#8bc34a;height: calc(100% + 0.5px);"></div></div>');
        var fjdata = $("#saoMiaoJianDataGroug_public").datagrid('getData').rows;
        setTimeout(function(){
            if(bak == "完结" && fjdata.length){
                downloadPDF(uuid);
            }
        },1000)

    }else if(ccg == rows.length){
        $alertShow("已经到最后一项了");
        return;
    }
}
//下载PDF
function downloadPDF(uuid){
    var ccgtow = $("#detailgrid").datagrid('getSelected').rownum;
    var fjdata = $("#saoMiaoJianDataGroug_public").datagrid('getData').rows;
    var rows = $("#detailgrid").datagrid('getData').rows;
    var xzdata = $("#detailgrid").datagrid('getSelected');
    looppic(0);
    function looppic(indexs){
        if(indexs < fjdata.length){
            var namefile = fjdata[indexs].typeDesc
            var type = namefile.substr(namefile.lastIndexOf(".")+1);
            if(type == "pdf" || type == "PDF"){
                //console.log(indexs);
                var downloadaction_url = "http://llncfs.transgd.com.cn:17003/cfs/sysNewsDownFileAction.do?basBlobUuid="+fjdata[indexs].basBlobUuid;
                pdfLook(downloadaction_url);
                console.log(url);
            }
        }
    }
}
function remark_FJ_Atter(value,rowData,index){
    var text="";
    if(_js_CONTROL_FJ_Verification("DO")){
        if(is_null(value)){
            text+=buttonColorTs("remark_FJ_EditAtterFun","","添加",rowData.basBlobUuid);
        }else{
            text+=buttonColorTs("remark_FJ_EditAtterFun",value,"修改",rowData.basBlobUuid)+value;
        }
    }else{
        text = value;
    }
    return text;
}


//预览pdf文件
function pdfLook(url,type,openType){
    $("#imagerMinGet_FJ").html("");
    GM_xmlhttpRequest({
        method: "post",
        url: url,
        responseType: 'blob',
        onload: function(r) {
            // 请求成功执行返回数据
            console.log(r);
            var blob = new Blob([r.response], { type: "application/pdf" });
            if (blob) {
                var fileURL = window.URL.createObjectURL(blob);
                if(type == "pdf"){
                    if(openType == "win"){
                        window.open(fileURL);
                    }else{
                        $('#imagerMinGet_FJ').append('<embed src="' + fileURL + '" type="application/pdf" width="100%" height="100%">');
                    }
                }else{
                    $("#imagerMinGet_FJ").append("<img src=" + fileURL + " style='width:100%;height:auto;'>");
                }
            }
        }
    });
}

function caoZuoButton_FJ(value,rowData,rowIndex){
    var xiazai="<a style='cursor:hand;' onclick=\"xaiZaiTuPian_FJ(\'"+rowData.basBlobUuid+"\')\"><div style='width:100%; color:red;'>下载附件</div></a>";
    var text="";
    var selfWindow = self.location.pathname
    var link = "/cfs/jsp/phc/order/fullContainerSoQuery.jsp"
    if (selfWindow == link){
        var xuanzhong = $("#detailgrid").datagrid('getSelections')[0];
        $('#dropzoneForm').attr('style','width:210px;min-height:100%')
        if(xuanzhong && xuanzhong.agentConsigneeCode == '11142'){
            text = "<a href='javascript:void(0);' class='downButton' onclick=\"xaiZaiFJ(\'"+rowData.basBlobUuid+"\',\'FH\',\'"+ xuanzhong.orderNo +"\')\">封号</a><a class='downButton' onclick=\"xaiZaiFJ(\'"+rowData.basBlobUuid+"\',\'GH\',\'"+ xuanzhong.orderNo +"\')\">柜号</a><a class='downFile' onclick=\"xaiZaiTuPian_FJ(\'"+rowData.basBlobUuid+"\')\">下载附件</a>"
        }else{
            if(_js_CONTROL_FJ_Verification("DO")){
                text+=xiazai;
            }
        }
    }else{
        if(_js_CONTROL_FJ_Verification("DO")){
            text+=xiazai;
        }
    }
    return text;
}
//离开附件页面后清除上传记录
$("#tabsId").tabs({
    onSelect:function(title){
        console.log(title)
        if(title !== "运输订单信息" && $('#footer').length){
            $('#footer').css('display','none');
        }else if(title == "运输订单信息" ){
            $('#footer').css('display','block');
        }
        if(title == "附件"){
            if($('.dz-success').length){
                $('.dz-success').remove();
            }
            var xuanzhong = $("#detailgrid").datagrid('getSelections')[0];
            if(xuanzhong.solAux2 == "Y" && xuanzhong.solAux1=="Y"){
                $('#modelIds').next().attr('style','color:#002bff;text-align: center;margin-top:15px; font-size: 14px;')
            }else{
                $('#modelIds').next().attr('style','color:red;text-align: center;margin-top:15px; font-size: 14px;')
            }
            $('#modelIds').next().html('SO号：<a href="javascript:void(0);" style="font-size:16px;" onclick="book()">' + xuanzhong.orderNo+'</a>')
        }

    }
})
unsafeWindow.book = function(){
    var xuanzhong = $("#detailgrid").datagrid('getSelected');
    var text = xuanzhong.orderNo + '.pdf'
    GM_setClipboard(text);
    $('#dropzoneForm').click();
}
//函数
unsafeWindow.xaiZaiFJ = function(uuid,type1,order){
    var name = $("#saoMiaoJianDataGroug_public").datagrid('getSelections')[0].typeDesc;
    var Fjtype = /\.[^\.]+/.exec(name)[0];
    var GhName = order+'柜号'+ Fjtype;
    var FhName = order+'封号'+ Fjtype
    setTimeout(function(){
        var tag = $('#imagerMinGet_FJ').children()[0].tagName
        var url = $('#imagerMinGet_FJ').children().attr('src')
        if(tag == "EMBED"){
            sliderelay("系统提示", "该附件不是图片");
        }else if(tag == "IMG"){
            if(type1 == "GH"){
                GM_download(url,GhName)
            }else if(type1 == "FH"){
                GM_download(url,FhName)
            }else{
                GM_download(url,FhName)
            }
        }
    },100)
}
//王军账号权限
SysMenuGroupManager.getTopMenuGroupByUserCode("0110406","SZWLC",'内部菜单',function(spj){
    if(spj.object){
        $("#menuGrpNametop").combobox("loadData",spj.object);
    }
});

//加载图标库
let iconStandard = GM_getResourceText('iconStandard');
GM_addStyle(iconStandard);
let css =
    `
::-webkit-scrollbar-thumb{
background-color:#018ee873;
height:50px;
outline-offset:-2px;
outline:2px solid #fff;
-webkit-border-radius:4px;
border: 2px solid #fff;
}

::-webkit-scrollbar-thumb:hover{
background-color:#018EE8;
height:50px;
-webkit-border-radius:4px;
}

/*---滚动条大小--*/
::-webkit-scrollbar{
width:8px;
height:10px;
}

::-webkit-scrollbar-track-piece{
background-color:#fff;
}
.menu{
max-height:300px;
overflow-y: scroll;
}
.menu-shadow{
height:150px;
}
/*按钮间隔线条*/
.datagrid-btn-separator{
/*display:none!important;*/
}
/*下拉条明显*/
.layout-split-north{
border-bottom: 5px solid #ff887559;
}
.accordion .accordion-header{
border-left: none;
border-top: none;
}

#BackgroundName{
font-weight: normal;
left: 105px;
}
.head .logo{
width:100px;
font-size:22px;
background: url(http://icop.y2t.com/cfs/images/newindex/logo.jpg) no-repeat left top !important;
}
.accordion-body{
width: auto!important;
}
.menuGroup > combo{
display:none;
}
.accordion-body>div{
width:calc(100% - 14px)!important;
}
#leftAccordion>.panel{
width:auto!important;
}
#leftAccordion>.panel>.accordion-header{
width:auto!important;
}
#imagerMinGet_FJ img{
height:auto!important;
width:100%!important;
}
/*弹窗按钮合并*/
.messager-button a.l-btn{
padding-right: 16px;
}
input:focus{
border:1px solid blue;
outline:none;
}

td[field="priority"] > div.datagrid-cell >div[style="background-color: red"] {
color:#ffe295;
}

td[field="priority"] > div.datagrid-cell{
text-align:center!important;
}

#imagerMinGet_FJ{
height:100%!important;
}
/*运输订单查询区域*/
#functionary{
width:54px!important;
}
#containerNo{
width:170.5px!important;
}
#trailingTeam + .combo > input{
width: 148.5px!important;
}
#submitOrderNo{
width:160px!important;
}
#aux2+ .combo > input{
width:137px!important;
}
#customsType+ .combo > input{
width:137px!important;
}
#loadingOrderNo{
width: calc(100% - 3px);
}
/*附件下载按钮样式*/
.downButton{
width:calc(29% - 2px);
float:left;
color:#2196f3;
margin-right:2%;
border:1px solid #2196f3;
cursor:pointer;
}
a{
text-decoration:none;
}
.downButton:hover{
background-color:#2196f3;
color:#ffffff;
}
.downFile{
width:calc(38% - 2px);
float:left;
color:#ff9800;
cursor:pointer;
border: 1px solid #ff9800;
}
.downFile:hover{
background-color:#ff9800;
color:#ffffff;
}
#dropzoneForm>div[align="center"]{
background: none!important;
}
#setting td{
text-align:right;
}
#formQuery table{
    min-width: 1030px;
}
#formQuery{
    float:left;
}
.tableList{
text-align:center;
}

/*图片提示*/
#tips{
    position: absolute;
    top: 20px;
    color: red;
    font-size: 35px;
}
`
GM_addStyle(css);



