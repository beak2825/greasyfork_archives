// ==UserScript==
// @name         CFS全局优化-手机版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  2021
// @author       You
// @match        *://icop.y2t.com/dckcfs/index.do
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @resource     iconStandard http://qn.bihushow.cn/tampermonkey/css/icon-standard333.css
// @run-at       document-start
// @license      No license

// @downloadURL https://update.greasyfork.org/scripts/446410/CFS%E5%85%A8%E5%B1%80%E4%BC%98%E5%8C%96-%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/446410/CFS%E5%85%A8%E5%B1%80%E4%BC%98%E5%8C%96-%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==
var hostUrl = 'http://'+window.location.host;
document.addEventListener('DOMContentLoaded', function(){
    $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">')//手机版头部设置
    $(".common-login-sys-wrp").remove();
    $(".common-login-header").css({"display":"flex","justify-content":"space-around","align-items":"center"})
    $(".login-box .login-pannel").css("width","90%");
    $(".login-friend-link").remove();
    $(".head .info").remove();
    $("body").attr("id","book");
    $("body").html(`
<div region="north" border="false" style="display:none" class="head">
    <a class="logo" href="#" id="BackgroundArea"><span class="name" id="BackgroundName">CFS系统</span></a>

    <div class="menuGroup">
        <input name="menuGrpNametop" id="menuGrpNametop" class="easyui-combobox" editable="false" style="width: 133px;" />
    </div>
    <div class="info">
    <span id="officeName"></span> | 	<span>深圳中外运物流报关有限公司</span> | 	<span class="name">王进</span> | 	<a href="#" id="changePSW" class="changePasswd">修改密码</a> | 	<a href="javascript:doLogoutAction();" class="logout">退出</a>

    </div>
    <a href="#" class="return">返回首页</a>

</div>
<div id="west" region="north" title="菜单栏" style="height:180px;width:180px" split="true">
    <div id="leftAccordion" class="easyui-accordion" align="center" animate="false"></div>
</div>
<div region="center">
    <div class="easyui-tabs" id="centerTabs" style="width:200px" fit="true" border="false"></div>
</div>
<div id="mm" class="easyui-menu" style="width:150px;display:none;">
    <div id="mm-tabupdate">刷新</div>
    <div class="menu-sep"></div>
    <div id="mm-tabclose">关闭</div>
    <div id="mm-tabcloseall">全部关闭</div>
    <div id="mm-tabcloseother">除此之外全部关闭</div>
    <div class="menu-sep"></div>
    <div id="mm-tabcloseleft">当前页左侧全部关闭</div>
    <div id="mm-tabcloseright">当前页右侧全部关闭</div>
    <div class="menu-sep"></div>
    <div id="mm-cancel">取消</div>
</div>
    `);

unsafeWindow.initJsp = function(none){
    SysMenuGroupManager.getMenuDataUserCode(none,function(spj){
        if(spj.object){
            var new_homeAutoEx=spj.object.homeAutoEx;
            var  new_menuGroups=spj.object.menuGroups;
            var  new_menuItems=spj.object.menuItems;
            var new_menuEntityList=spj.object.menuEntityList;
            // 				if(new_homeAutoEx==true){
            // 					benHtml +="<div id='leftAccordion' class='easyui-accordion' align='center' animate='false'>";
            // 				}else{
            // 					benHtml +="<div id='leftAccordion' class='easyui-accordion' align='center' >";
            // 				}
            $.each(new_menuGroups,function(index,row){
                var benHtml = "";
                if("zh_CN"=='zh_CN'){
                    if(new_homeAutoEx==true){
                        // 							benHtml+="	<div title='"+row.menuGrpName+"' align='center'> ";
                    }else{
                        // 							benHtml+=" <div title='"+row.menuGrpName+"' align='center' style='padding-top:12px;background-color:white;overflow:auto'> ";
                    }
                    $.each(new_menuItems,function(index1,menuItem){
                        if(menuItem.sysMenuGroupUuid==row.sysMenuGroupUuid){
                            var menuItemUrl="";
                            if(!is_null(menuItem.menuItemUrl)){
                                menuItemUrl=menuItem.menuItemUrl;
                            }
                            if("SINOTRANS_JSZX"==menuItem.menuItemCode){
                                benHtml+="	<div style='width:100%; height:35px;border-bottom:1px solid gainsboro;text-align: left;line-height:35px;padding-left:14px;font-size: 13px' ";
                                benHtml+="	onmouseout='clearColor(this)' onMouseover=\"this.style.cursor='pointer';mouseOverColor(this)\">";
                                benHtml+="	<a ref='' target='_BLANK' style='color: #000000' href='"+menuItemUrl+"'>▶&nbsp;&nbsp;&nbsp;"+menuItem.menuItemName+"</a>";
                                benHtml+=" </div>";
                            }
                            else if("CALL_NUMBER_SIN_LIST"==menuItem.menuItemCode ||"CALL_NUMBER_OUT_LIST"==menuItem.menuItemCode){
                                benHtml+="<div style='width:100%; height:35px;border-bottom:1px solid gainsboro;text-align: left;line-height:35px;padding-left:14px;font-size: 13px' ";
                                benHtml+="	onmouseout='clearColor(this)' onMouseover=\"this.style.cursor='pointer';mouseOverColor(this)\"> ";
                                benHtml+="	<a ref='' onclick='openMenuNewWindows(\"/dckcfs"+menuItemUrl+"\",\""+menuItem.menuItemName+"\")' style='color: #000000'>▶&nbsp;&nbsp;&nbsp;"+menuItem.menuItemName+"</a> ";
                                benHtml+="</div> ";
                            }
                            else {
                                if(menuItem.menuItemCode.indexOf("FINEREPORT")>-1){
                                    benHtml+="	<div style=\"width:100%; height:35px;border-bottom:1px solid gainsboro;text-align: left;line-height:35px;padding-left:14px;font-size: 13px\"  ";
                                    benHtml+="		onmouseout=\"clearColor(this)\"  onmouseover=\"this.style.cursor='pointer'; mouseOverColor(this)\" ";
                                    benHtml+="		onclick='javascript:changeSelected(this) ;addTabs(\""+menuItem.menuItemName+"\",\" "+menuItem.menuItemUrl+"&officeCode="+"SZWLC"+"\",\"\",true)'>";
                                    benHtml+="		▶&nbsp;&nbsp;&nbsp;"+menuItem.menuItemName+"";
                                    benHtml+="		</div>";
                                }else{
                                    benHtml+="	<div style=\"width:100%; height:35px;border-bottom:1px solid gainsboro;text-align: left;line-height:35px;padding-left:14px;font-size: 13px\"  ";
                                    benHtml+="		onmouseout=\"clearColor(this)\"  onmouseover=\"this.style.cursor='pointer'; mouseOverColor(this)\" ";
                                    benHtml+="		onclick='javascript:changeSelected(this) ;addTabs(\""+menuItem.menuItemName+"\",\"/dckcfs/"+menuItem.menuItemUrl+"?menuGroupUuid="+menuItem.sysMenuGroupUuid+"&menuItemUuid="+menuItem.sysMenuItemUuid+"\",\"\",true)'>";
                                    benHtml+="		▶&nbsp;&nbsp;&nbsp;"+menuItem.menuItemName+"";
                                    benHtml+="		</div>";
                                }
                            }
                        }
                    });
                    removeList.push(row.menuGrpName);
                    $('#leftAccordion').accordion('add', {
                        title: row.menuGrpName,
                        content:benHtml,
                        selected: false
                    });
                }else if("en"=='zh_CN'){
                    $.each(new_menuItems,function(index1,menuItem){
                        if(menuItem.sysMenuGroupUuid==row.sysMenuGroupUuid){
                            benHtml+="<div style='width:100%; height:35px;border-bottom:1px solid gainsboro;text-align: left;line-height:35px;padding-left:14px;font-size: 13px'  ";
                            benHtml+="	onmouseout='clearColor(this)' onMouseover=\"this.style.cursor='pointer';mouseOverColor(this);\"  ";
                            benHtml+="		onclick='javascript:changeSelected(this);addTabs(\""+menuItem.menuItemNameCn+"\",\"/dckcfs/"+menuItem.menuItemUrl+"?menuGroupUuid="+menuItem.sysMenuGroupUuid+"&menuItemUuid="+menuItem.sysMenuItemUuid+"\",\"\",true);'> ";
                            benHtml+="	▶&nbsp;&nbsp;&nbsp;"+menuItem.menuItemNameCn+" ";
                            benHtml+=" </div>";

                        }
                    });
                    removeList.push(row.menuGrpName);
                    $('#leftAccordion').accordion('add', {
                        title: row.menuGrpName,
                        content:benHtml,
                        selected: false
                    });
                }
            });
            if(!is_null(new_menuEntityList)){
                $.each(new_menuEntityList,function(index,menu){
                    // 						benHtml+=" <div title='"+menu.getName+"' align='center'>";
                    $.each(menu.children,function(index1,children){
                        benHtml+=" <div style='width:100%; height:35px;border-bottom:1px solid gainsboro;text-align: left;line-height:35px;padding-left:14px;font-size: 13px'  ";
                        benHtml+=" 	onmouseout='clearColor(this)' onMouseover= 'this.style.cursor= 'pointer';mouseOverColor(this);' ";
                        benHtml+=" 		onclick='javascript:changeSelected(this);addTabs(\""+children.name+"\",\""+children.url+"\",\"\",true);'> ";
                        benHtml+=" 	▶&nbsp;&nbsp;&nbsp;"+children.name+" ";
                        benHtml+=" </div> ";
                    });
                    // 						benHtml+="	</div>";
                    removeList.push(menu.getName);
                    $('#leftAccordion').accordion('add', {
                        title: menu.getName,
                        content:benHtml,
                        selected: false
                    });
                });
            }
        }
    });
}
}, false);
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
.accordion .accordion-header {
    background-size: 100% 100%!important;
    padding: 10px!important;
}
`
GM_addStyle(css);



