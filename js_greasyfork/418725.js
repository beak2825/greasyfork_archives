// ==UserScript==
// @name         运输订单优化脚本
// @version      6.1.5
// @author       王进
// @description
// @icon         http://icop.y2t.com/os/static/images/favicon.png
// @match        *://llncfs.transgd.com.cn:17003/cfs/jsp/phc/order/fullContainerSoQuery.jsp*
// @match        *://icop.y2t.com/dckcfs/jsp/phc/order/fullContainerSoQuery.jsp*
// @match        *://icop.y2t.com/cfs/jsp/phc/order/fullContainerSoQuery.jsp*
// @match        *://sc.y2t.com/cfs/jsp/phc/order/fullContainerSoQuery.jsp*
// @match        *://uatcfswms.transgd.com.cn:17003/phwms/jsp/phc/order/fullContainerSoQuery.jsp*
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js
// @description  zh-cn
// @license      No license
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_log
// @grant        GM_listValues
// @grant        GM_getResourceText
// @nocompat     Chrome
// @namespace https://greasyfork.org/users/704632
// @downloadURL https://update.greasyfork.org/scripts/418725/%E8%BF%90%E8%BE%93%E8%AE%A2%E5%8D%95%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/418725/%E8%BF%90%E8%BE%93%E8%AE%A2%E5%8D%95%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

auto();


/*--------------------------------easyui解析后自动执行--------------------------------*/

//脚本基础功能执行

var userId = $('#userCode', unsafeWindow.parent.document).val();
var userName = $('#userName', unsafeWindow.parent.document).val();
var hostUrl = 'http://'+window.location.host;

//预加载执行部分
async function auto(){
    //let userinfo = await ydsjyz("http://kc.bihushow.cn/test/userinfo.php");
    //console.log(userinfo.data);
    //console输出menuSet();
    consoleText();//佛佑无BUG
	console.log(GM_listValues());//所有本地字段

    //删除原有toolbar
    if(document.readyState = 'interactive'){
        $('#editBtn').parent().parent().remove()
    }

    //脚本菜单加载
    menuSet();

    //基本按钮执行
	btn();

}

//佛祖保佑
function consoleText(){
	console.log([
     "%c                   _ooOoo_" ,
     "                  o8888888o" ,
     "                  88\" . \"88" ,
     "                  (| -_- |)" ,
     "                  O\\  =  /O" ,
     "               ____/`---'\\____" ,
     "             .'  \\\\|     |//  `." ,
     "            /  \\\\|||  :  |||//  \\" ,
     "           /  _||||| -:- |||||-  \\" ,
     "           |   | \\\\\\  -  /// |   |" ,
     "           | \\_|  ''\\---/''  |   |" ,
     "           \\  .-\\__  `-`  ___/-. /" ,
     "         ___`. .'  /--.--\\  `. . __" ,
     "      .\"\" '<  `.___\\_<|>_/___.'  >'\"\"." ,
     "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |" ,
     "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /" ,
     "======`-.____`-.___\\_____/___.-`____.-'======" ,
     "                   `=---='" ,
     "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^" ,
     "            佛祖保佑       永无BUG",
].join( '\n' ),'color:#E4C855;font-size: 16px;font-weight: bold;');
console.log([
     "%c佛曰:",
     "         写字楼里写字间 | 写字间里程序员；",
     "         程序人员写程序 | 又拿程序换酒钱。",
     "         酒醒只在网上坐 | 酒醉还来网下眠；",
     "         酒醉酒醒日复日 | 网上网下年复年。",
     "         但愿老死电脑间 | 不愿鞠躬老板前；",
     "         奔驰宝马贵者趣 | 公交自行程序员。",
     "         别人笑我忒疯癫 | 我笑自己命太贱；",
     "         不见满街漂亮妹 | 哪个归得程序员？"
].join( '\n' ),'color:#EA2E3B;font-size: 20px;font-family: 华文行楷;');
console.log('%c————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————',"color:red;font-wight:blod;")
}




/*--------------------------------easyui解析后自动执行--------------------------------*/

//解析后自动执行
$.parser.onComplete = function (){

    /******文件上传重设*********/
    fileUpdate();

	/********参数设置********/
    detailgridSet();//datagrid参数初始化
	comboxSet();
	dialogSet();
    deteBoxSet();

    /*****优化设置*******/
	copyMailMsg();//发送邮件复制表格框加载
	carCodeKeep();//派车单车牌公司互带
    GM_setValue('senCarTime','');//清空派车单图标更新时间
    overAdd();//解析结束后执行添加更多按钮及绘制右侧表格


    /******查询条件设置*****/
    autoQuery();////自动设置查询条件

    cloudData();//执行云端数据


    $.parser.onComplete = function () {};//解除解析函数
};

//解析结束后执行部分（datagrid工具栏-更多、查询区域右侧统计表格)
function overAdd(){

    /*****datagrid工具栏新增******/
    $("#shendan").parent().append('<a id="bobo" href="javascript:void(0)">更多</a>')
    $("#add").parent().prepend('<div style="float: left;padding-right:10px;height: 28px;display: flex;justify-content: center;top: 30px;align-items: center;"><div style="display: inline-block; padding: 0 3.5px;">连续</div><input id="lxxz" onclick="checkboxOnclick()" type="checkbox" /></div>');//连续勾选按钮
    $('<div id="popo" style="width:150px;"><div href="#" id="EIR_MSK_FORECAST" style="color:red" iconCls="icon-standard-clock" onclick='+'openSendDialog("forecastMSK");'+'>马士基预约</div><div href="#" id="EIR_WBTMS_LOSEADD" iconCls="icon-standard-delete" onclick="sendRequest(this.id);">挂失</div><div href="#" id="QUERY_TRACK" iconCls="icon-standard-map" onclick="queryTrack();">轨迹查询</div><div href="#" id="emailEdit" iconCls="icon-standard-email-edit" onclick="emailEdit();">补充信息</div><div href="#" id="emailDelete" iconCls="icon-standard-email-delete" onclick="emailDelete();">删除信息</div><div href="#" id="allData" iconCls="icon-standard-calendar" onclick="allData();">统计信息</div><div href="#" id="allData" iconCls="icon-standard-calendar" onclick="huangui();">更新还柜</div></div>').appendTo('#operations')
    menubuttonSet();//datagrid工具栏【更多】

    /*********查询区域右侧统计表格绘制************/
    $('#formQuery table').attr('style','float:left;');
	$('#formQuery').after('<div id="tlOrder" style="min-width: calc(100% - 1030px);width: auto; height: 130px; float: left;"></div>');
	$("#tlOrder").html(`<table style="text-align: center;float:left;width:100%"  border="1" cellpadding="2" cellspacing="0"><tbody id="tlgltj"><tbody></table>`);
    footSensus();//添加底部统计
}




/*--------------------------------基础参数设置--------------------------------*/

//detailgrid参数设置
function detailgridSet(){
	//数据表加载
    $("#detailgrid").datagrid({
        autoRowHeight:false,
        striped:true,
        pageSize:GM_getValue('condition').pages,
        pageList:[10,20,30,40,GM_getValue('condition').pages],
        remoteSort:false,
        sortName:'',
        sortOrder:'asc',
        multiSort: true,
        toolbar: [{
            iconCls: 'icon-add',
            text:'新增',
            id:'add',
            handler: addOrder
        },'-',{
            iconCls: 'icon-edit',
            text:'编辑',
            handler: editOrder
        },'-',{
            iconCls: 'myCustomerIcon_remove',
            text:'删除',
            handler: deleteOrder
        },'-',{
            iconCls: 'icon_shengcheng',
            text:'派单',
            handler: sendCarDo
        },'-',{
            iconCls: 'icon-newInput',
            text:'操作记录',
            handler: function(){openSendDialog('searchLog')}
        },'-',{
            iconCls: 'icon-standard-lorry-go',
            text:'设置优先级',
            handler: setOrderBy
        },'-',{
            iconCls: 'icon-standard-folder-picture',
            text:'查看附件',
            handler: searchFile
        },'-',{
            /*iconCls: 'icon_money',
            text:'费用录入',
            handler: function(){openSendDialog('orderCharge')}*/
            iconCls: 'icon-standard-delete',
            text:'批量作废',
            handler: deleteorder
        },'-',{
            iconCls: 'icon-standard-table-error',
            text:'异常',
            handler: plyc
        },'-',{
            iconCls: 'icon-standard-application-form-magnify',
            text:'审单',
            handler: checkOrderOcrInfo,
            id:'shendan'
        },'-',{
            iconCls: 'icon-standard-email',
            text:'发送邮件',
            handler: huanguiBefo
        },'-',{
            iconCls: 'icon-standard-email',
            text:'已发送邮件',
            handler: sendEmailMsg
        },'-',{
            iconCls: 'icon-standard-page-copy',
            text:'复制SO',
            handler: copy
        },'-',{
            iconCls: 'icon-standard-page-copy',
            text:'复制绑单',
            handler: copyGh
        },'-',{
            iconCls: 'icon-standard-webcam',
            text:'铁路邮件',
            handler: trainEmail
        },'-',{
            iconCls: 'icon-standard-chart-bar',
            text:'图表',
            handler: tubiao
        },'-',{
            iconCls: 'icon-standard-application-form-edit',
            text:'批量修改',
            handler: plxgdz
        }],
        columns:[[
            {field:'transactionStatus',title:'状态',sortable:true,align:'center',width:50,formatter: function(value,rowData,index){
                if("Active"==value){
                    if(!is_null(rowData.controlWord) && rowData.controlWord.charAt(2)=="F"  && "Cancel"!=value){
                        return fontColorFront("完结","burlywood",fontStyle);
                    }else if(rowData.isException=="Y"){
                        return "<font color='red' size=2 style='font-weight: bold;' onmouseover=\"this.style.cursor= 'pointer';\" onclick=\"openExceptionDialog('"+rowData.submitOrderUuid+"');\">异常</font>";
                    }else{
                        return fontColorFront("生效","yellowgreen",fontStyle);
                    }
                }else if("Pending"==value){
                    return fontColorFront("草稿","gold",fontStyle);
                }else if("Cancel"==value){
                    return fontColorFront("作废","violet",fontStyle);
                }else if("Reconsider"==value){
                    return fontColorFront("复议","pink",fontStyle);
                }else{
                    return value;
                }
            }},
            {field:'priority',title:'标记',width:50,sortable:true,align:'center',formatter: function(value){
                if (value!=null&&value!="null"&&value!="") {
                    if (value==1) {
                        return "<div style='background-color: red'>紧急</div>";
                    }else if (value==2) {
                        return "<div style='background-color: orange'>重要</div>";
                    }else{
                        return "暂无";
                    }
                }else{
                    return "暂无";
                }
            }},
            {field:'process',title:'进度',sortable:true,width:50,align:'center',formatter: function(value,rowData,indexData){
                if(value=="已还柜"){
                    return fontColorFront('已还柜','#3ba272',null);
                }else if(value=="已离仓"){
                    return fontColorFront('已离仓','#fc8452',null);
                }else if(value=="已提柜"){
                    return fontColorFront('已提柜','#ea7ccc',null);
                }else if(value=="已到仓"){
                    return fontColorFront('已到仓','#5470c6',null);
                }else if(value=="已派车"){
                    return fontColorFront('已派车','#73c0de',null);
                }else if(value=="审核上柜"){
                    return fontColorFront('审核上柜','pink',null);
                }else if(value=="取消上柜"){
                    return fontColorFront('取消上柜','salmonpink',null);
                }else if(value=="已上柜"){
                    return fontColorFront('已上柜','#fac858',null);
                }else if(value=="已打单"){
                    return fontColorFront('已打单','#91cc75',null);
                }else if(value=="已接单"){
                    return fontColorFront('已接单','green',null);
                }else if(value=="待接单"){
                    return fontColorFront('待接单','blue',null);
                }else if(value=="已审单"){
                    return fontColorFront('已审单','redblue',null);
                }else{
                    return fontColorFront('待处理','red',null);
                }
            }},
            {field:'loadingProcess',title:'装卸进度',sortable:true,width:60,align:'center',formatter: function(value,rowData,indexData){
                if(value){
                    if(value=="已完工"){
                        return fontColorFront('已完工','burlywood',null);
                    }else if(value=="派工"){
                        return fontColorFront('派工','violet',null);
                    }else if(value=="预派工"){
                        return fontColorFront('预派工','thistle',null);
                    }else if(value=="已办单"){
                        return fontColorFront('已办单','tomato',null);
                    }
                }else{
                    return "<font color='#bbb'>暂无</font>";
                }

            },sorter:function(a,b){
                if(a && b){
                    console.log(a+"和"+b);
                    if(a !== b){
                        return (a>b?1:-1);
                    }
                }else if(a || b){
                    if(a){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            }},
            {field:'ruChang',title:'车到',width:30,sortable:true,align:'center',sorter:function(a,b){
                if(a && b){
                    console.log(a+"和"+b);
                    if(a !== b){
                        return (a>b?1:-1);
                    }
                }else if(a || b){
                    if(a){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            }},
			{field:'sendEmail',title:'发邮',width:30,sortable:true,align:'center',formatter: function(value,rowData,indexData){
                if (value == "是") {
                    return "<div style='background-color: #7be67b;color:#fff;' title='已发送柜封号邮件！'>"+value+"</div>";
                }
            }},
            {field:'creator',title:'操作人',width:50,sortable:true,align:'center',formatter: function(value,rowData,indexData){
                if(GM_getValue(rowData.orderNo)){
                    var send = GM_getValue(rowData.orderNo).send;
                    if(send == "是"){
                        if(GM_getValue(rowData.orderNo).line == "1"){
                            return "<div style='background-color: green;color:#fff;' title='已发送柜封号邮件！'>" + value + "</div>"
                        }else{
                            return "<div style='background-color: #7be67b;color:#fff;' title='已发送柜封号邮件！'>" + value + "</div>"
                        }
                    }else{
                        return "<div style='color: #fac858;' title='已有邮件信息！'>" + value + "</div>"
                    }
                }
                return value
            }},
            {field:'batch',title:'批次',sortable:true,align:'center',width:110},
            {field:'jibie',title:'级别',sortable:true,align:'center',width:50},
            {field:'customsType',title:'关务类型',width:60,align:'center',},
            {field:'isRelateTrans',title:'关联订单',width:60,align:'center',formatter: function (value, rowData, indexData) {
                if (value == "否") {
                    return '<div style="color:red">否</div>';
                } else if (value == "是") {
                    return '是'
                }
            }},

            {field:'isEndDeclaration',title:'入仓申报',sortable:true,width:60,align:'center',formatter: function (value, rowData, indexData) {
                if (value == "否") {
                    return '<div style="color:red">否</div>';
                } else if (value == "是") {
                    return '是'
                }
            }},
            {field:'declareAllow',title:'出仓申报',sortable:true,width:60,align:'center',formatter: function(value,rowData,indexData){
                if (value == "Y") {
                    return '是';
                } else if (value == "0") {
                    return '<div style="color:red">否</div>';
                } else {
                    return '';
                }
            },sorter:function(a,b){
                if(a && b){
                    console.log(a+"和"+b);
                    if(a !== b){
                        return (a>b?1:-1);
                    }
                }else if(a || b){
                    if(a){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            }},
            {field:'submitDate',title:'预计做柜时间',sortable:true,width:80,align:'center'},
            {field:'agentConsigneeDesc',title:'委托客户',width:120,align:'left'},
            {field:'line',title:'航线',width:80,align:'center'},
            {field:'orderNo',title:'SO号',width:120,sortable:true,align:'center'},
            {field:'containerType',title:'柜型',width:50,sortable:true,align:'center'},
            {field:'trailingTeam',title:'运输公司Code',width:70,align:'center',hidden:true},
            {field:'trailingTeamDesc',title:'运输公司',sortable:true,width:100,align:'left',sorter:function(a,b){
                if(a && b){
                    if(a !== b){
                        return (a>b?1:-1);
                    }
                }else if(a || b){
                    if(a){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            }},
            {field:'flowName',title:'提柜地点',width:100,sortable:true,align:'center'},
            {field:'directionDesc',title:'还柜地点',sortable:true,width:60,align:'center'},
            {field:'aux1Desc',title:'口岸',sortable:true,width:60,align:'center'},
            {field:'functionary',title:'联系人',sortable:true,width:50,align:'center'},
            {field:'unloadPortName',title:'港口',sortable:true,width:100,align:'center',sorter:function(a,b){
                if(a && b){
                    if(a !== b){
                        return (a>b?1:-1);
                    }
                }else if(a || b){
                    if(a){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            }},
            {field:'cutVgmTime',title:'截VGM时间',sortable:true,width:105,align:'center',formatter: function(value,rowData,indexData){
                if(is_null(rowData.containerNo) && !is_null(value)){
                    var currentTime = Date.parse(new Date());
                    var vgmTime = Date.parse(new Date(value));
                    var hour = (vgmTime - currentTime) / (1000 * 60)

                    if(hour <= vgmOvertime){
                        return "<div style='background-color: red;' title='截VGM超时预警：截VGM减去当前时间小于两小时'>" + value + "</div>"
                    }
                }
                return value
            }},
            {field:'siInputTime',title:'截补料时间',sortable:true,width:105,align:'center',formatter: function(value,rowData,indexData){
                if(is_null(rowData.containerNo) && !is_null(value)){
                    var currentTime = Date.parse(new Date());
                    var vgmTime = Date.parse(new Date(value));
                    var hour = (vgmTime - currentTime) / (1000 * 60)

                    if(hour <= overTime){
                        return "<div style='background-color: red;' title='截VGM超时预警：截VGM减去当前时间小于两小时'>" + value + "</div>"
                    }
                }
                return value
            }},
            {field:'cutDate',title:'截重/提重时间',sortable:true,width:105,align:'center',formatter: function(value,rowData,indexData){
                if(!("已完工" == rowData.loadingProcess)){
                    var currentTime = Date.parse(new Date());
                    var vgmTime = Date.parse(new Date(value));
                    var hour = (vgmTime - currentTime) / (1000 * 60)
                    if(hour <= cutDateOverTime){
                        return "<div style='background-color: red;' title='截重超时预警：截重/提重减去当前时间小于三小时'>" + value + "</div>"
                    }
                }
                return value
            }},
            {field:'voucherSubmitTime',title:'截放行时间',sortable:true,width:105,align:'center'},
            {field:'remark',title:'备注',width:200,align:'left'},
            {field:'grossWeight',title:'待工重量',sortable:true,width:70,align:'center',formatter: function(value){
                //保留三位小数
                if(is_null(value)){
                    return 0;
                } else {
                    return formatFloat(value,3);
                }
            }},
            {field:'volume',title:'待工体积',width:70,sortable:true,align:'center',formatter: function(value){
                //保留三位小数
                if(is_null(value)){
                    return 0;
                } else {
                    return formatFloat(value,3);
                }
            }},
            {field:'doLtVolume',title:'装车拣货体积',width:70,align:'center',formatter: function(value){
                //保留三位小数
                if(is_null(value)){
                    return 0;
                } else {
                    return formatFloat(value,3);
                }
            }},
            {field:'lpVolume',title:'备货体积',width:70,align:'center',formatter: function(value){
                //保留三位小数
                if(is_null(value)){
                    return 0;
                } else {
                    return formatFloat(value,3);
                }
            }},
            {field:'containerNo',title:'柜号',sortable:true,width:100,align:'center'},
            {field:'sealNo',title:'封号',sortable:true,width:100,align:'center'},
            {field:'doTractorNo',title:'车牌',width:100,align:'center',formatter: function(value,rowData,index){
                if(!is_null(value)){
                    var str = "";
                    if(rowData.doStatus=='Active' && rowData.doControlWord.charAt(2)=='F'){
                        str = "当前运输已完结，无权查看车辆位置!";
                    }
                    if(button_posttioning){
                        var style="cursor:pointer; background-color:#EBEBEB;border: none;color: #444;border-radius:1.0em;font-weight: bold;line-height: 1.0;border: 1px solid #FFCC00;";
                        var ss = "<button onclick='queryCurrentPosition(this.value,this.name)' value='"+value+"' name='"+str+"' style='"+style+"'>"+value+"</button>";
                        return ss;
                    }else{
                        return value;
                    }
                }else{
                    return value;
                }
            }},
            {field:'doDriverName',title:'司机',width:70,align:'center'},
            {field:'doContactTel',title:'司机电话',width:80,align:'center'},
            {field:'forecastCtnTime',title:'约柜时间',sortable:true,width:100,align:'center'},
            {field:'vesselName',title:'船名',sortable:true,width:100,align:'center'},
            {field:'voyage',title:'航次',sortable:true,width:100,align:'center'},
            {field:'aux2Desc',title:'船公司',sortable:true,width:100,align:'left'},
            {field:'deliveryOrderNo',title:'派车单号',width:120,align:'center',formatter: function(value,rowData,indexData){
                if(!is_null(value)){
                    return buttonColorTs("editDoNoClick",value,value,rowData.deliveryOrderUuid);
                }else{
                    return "";
                }
            }},
            {field:'tareWeight',title:'皮重',width:70,align:'center'},
            {field:'getCtnTime',title:'提柜时间',sortable:true,width:80,align:'center'},
            {field:'backCtnTime',title:'还柜时间',sortable:true,width:100,align:'center'},
            {field:'confirmCtnTime',title:'上柜时间',sortable:true,width:100,align:'center'},
            {field:'submitOrderNo',title:'运输订单号',width:80,align:'center'},
            {field:'ocStatus',title:'杂费审核',sortable:true,width:60,align:'center'},
            {field:'isCharge',title:'是否计费',sortable:true,width:60,align:'center',formatter: function(value,rowData,indexData){
                if(value!='否'){
                    return buttonColorTs("editRcNoClick",value,"是",rowData.submitOrderUuid);
                }else{
                    return "否";
                }
            }},
            {field:'rcStatus',title:'计费单状态',sortable:true,width:60,align:'center',formatter: function(value,rowData,indexData){
                if("Active"==value){
                    return fontColorFront("生效","yellowgreen",fontStyle);
                }else if("Pending"==value){
                    return fontColorFront("草稿","gold",fontStyle);
                }else if("Cancel"==value){
                    return fontColorFront("作废","violet",fontStyle);
                }else{
                    return value;
                }
            }},
            {field:'solAux2',title:'是否打单',sortable:true,width:60,align:'center',formatter: function(value,rowData,indexData){
                if(value=="Y"){
                    return '是';
                }else{
                    return '否';
                }
            }},
            {field:'solAux1',title:'是否异提',sortable:true,width:60,align:'center',formatter: function(value,rowData,indexData){
                if(value=="Y"){
                    return '是';
                }else{
                    return '否';
                }
            }},
            {field:'isPilePlace',title:'是否补录车位',sortable:true,width:60,align:'center',formatter: function(value,rowData,indexData){
                if(value=="Y"){
                    return '是';
                }else{
                    return '否';
                }
            }},
            {field:'sendCarDate',title:'派车时间',sortable:true,width:100,align:'center'},
            {field:'finishDate',title:'订单完结时间',sortable:true,width:100,align:'center'},
            {field:'address',title:'装卸货地',width:100,sortable:true,align:'center',formatter: function(value,rowData){
                if(!is_null(value)){
                    var address = new Array();
                    address = value.split(',');
                    if(address.length>2){
                        return buttonColorTs('openAddressDialog',rowData.submitOrderUuid,'多地',rowData.submitOrderUuid);
                    }else{
                        return address[0];
                    }
                }else{
                    return value;
                }
            }},
            {field:'loadingNo',title:'装车单号',sortable:true,width:110,align:'center',formatter: function(value,rowData,indexData){
                if(!is_null(value)){
                    return "<button onclick='QueryEorder(this.id)' id='"+rowData.submitOrderUuid+"' value='"+value+"' style='cursor:pointer; background-color:#EBEBEB ;border: none;color: #444;border-radius: .5em;font-weight: bold;line-height: 1.0;border: 1px solid #FFCC00;'>"+value+"</button>";
                    //var deliveryOrderUuid = spj.object.deliveryOrderUuid;

                }else{
                    return "";
                }
            }},
            {field:'submitOrderUuid',title:'uuid',sortable:true,width:100,align:'center'},
            {field:'deliveryType',title:'运输类型',width:60,sortable:true,align:'center'}
        ]],
        onLoadSuccess:function(data){//加载成功后
            if(GM_getValue('xz')){
                $('#lxxz').attr('checked','checked')
            }
            $('.datagrid-sort-icon').text('');//修复表格表头空白字符导致对不齐问题
            tongji();


        },
        onSelect:function(rowIndex, rowData){
            jishu();//浏览器底部计数
            if(GM_getValue('xz')){//判断是否勾选连续选择
                $('#lxxz').attr('checked','checked')
                var allxz = $('#detailgrid').datagrid('getSelections');
                var listXz = $('#detailgrid').datagrid('getSelected').rownum;//获取最小行
                var popo = allxz.pop();
                allxz.push(popo)
                if(allxz.length == 2){
                    lxxzsj(popo.rownum - 2)
                }else if(allxz.length > 2){
                    if(rowData.rownum == listXz + 1){
                        GM_deleteValue('xz');
                        $('#lxxz').attr('checked',null);
                    }else{
                        lxxzsj(rowData.rownum - 2)
                    }
                }
            }else{
                $('#lxxz').attr('checked',null)
            }
        },
        onUnselect:function(){
            jishu();
        },
        onSelectAll:function(){
            jishu();
        },
        onUnselectAll:function(){
            $('#jishu').text('');
        },
        onSortColumn:function (sort, order) {
            //alert("sort:"+sort+",order："+order+"");
            var dataOrder = $("#detailgrid").datagrid('getData').rows;
            $.each(dataOrder,function(index,row){
                row.rownum = index+1;
            })

            //排序时触发事件 示例：sort:submitOrderNo,order：desc
        },
        onClickCell:function(index, field, value){//单击单元格事件
            if(field == "orderNo" || field == "containerNo" || field == "sealNo" || field == "batch"){
                if(value){
                    GM_setClipboard(value);
                    sliderelay("系统提示","<font size='4' color='red'>" + value + "</font>复制成功！");
                }else{
                    sliderelay("系统提示","<font size='4' color='red'>复制失败，内容为空！</font>");
                }
            }
        }
    });
}

//combox参数设置
function comboxSet(){
	//是否发送邮件框
    $("#isSend").combobox({
        panelHeight:"auto",
        data:[{"id":'',"text":"全部"},{"id":"否","text":"未发"},{"id":"是","text":"已发"}],
        valueField:"id",
        textField:"text",
        value:""
    });

   //航线选择
    $("#online").combobox({
        panelHeight:"auto",
        data:[{"id":'',"text":"全部"},{"id":"1","text":"欧线"},{"id":"2","text":"美线"}],
        valueField:"id",
        textField:"text",
        value:""
    });

    //铁路类型
    $("#tieluType").combobox({
        panelHeight:"auto",
        data:[{"id":'',"text":"全部"},{"id":"1","text":"纯重下"},{"id":"2","text":"空上重下"},{"id":"3","text":"非铁路"}],
        valueField:"id",
        textField:"text",
        value:""
    });
	//铁路类型
	$("#transport").combobox({
	    panelHeight:"auto",
	    data:[{"id":"1","text":"纯重下"},{"id":"2","text":"空上重下"}],
	    valueField:"id",
	    textField:"text",
	    value:"",
		onSelect:function(record){
			if(record.text == "纯重下"){
				$("#pinghunan").datebox('enable');//下拉框可用
				$("#yict").datebox('enable');//下拉框可用
				$("#beforehand").combobox('setValue','');//是否预渡
				$("#cyOpen").datebox('setValue','');//开舱日期
				$("#exit").datebox('setValue','');//出闸日期
				$("#load").datebox('setValue','');//装柜日期
				$("#load").datebox('disable');
				$("#cyOpen").datebox('disable');
				$("#beforehand").combobox('disable');
				$("#exit").datebox('disable');
			}else{
				trainEmail();
			}
		}
	});

	//是否预渡
    $("#beforehand").combobox({
        panelHeight:"auto",
        data:[{"id":"1","text":"是"},{"id":"2","text":"否"}],
        valueField:"id",
        textField:"text",
        value:"",
		onSelect:function(dataText){
			var timeval = (new Date()).valueOf();
			var timeOut = formatDateTime(timeval,"ymd");
			var loadTime = formatDateTime(timeval + 86400000,"ymd");
			if(dataText.text == "是"){
				$("#load").datebox('setValue',timeOut);//装柜日期
			}else{
				$("#load").datebox('setValue',loadTime);//装柜日期
			}
		}
    });
    //筛选类型
    $("#backC").combobox({
        panelHeight:"auto",
        data:[{"id":'N',"text":"全部"},{"id":"Y","text":"剔除"}],
        valueField:"id",
        textField:"text",
        value:"N"
    });
	//航线类型
	$("#line").combobox({
        panelHeight:"auto",
        data:[{"id":"1","text":"欧线"},{"id":"2","text":"美线"}],
        valueField:"id",
        textField:"text",
        value:""
    });

	//顶部车行搜索下拉框
	$('#cc').combobox({
		valueField: 'label',
		textField: 'value',
		data: [{
			label: '90167',
			value: '深圳市鑫佳源物流'
		},{
			label: '90165',
			value: '深圳市粤胜通物流'
		},{
			label: '90171',
			value: '深圳市捷祥物流'
		},{
			label: '90376',
			value: '友和运通国际货运代理'
		},{
			label: '20158',
			value: '深圳市宇鹏物流'
		},{
			label: '90152',
			value: '深圳市森茂通国际物流'
		},{
			label: '90130',
			value: '深圳市海纳陆通运输'
		},{
			label: '90268',
			value: '深圳市同方物流'
		},{
			label: '20160',
			value: '深圳市同方物流-项目'
		},{
			label: '90123',
			value: '深圳市金华航物流'
		}],
		onSelect:function(label,value){
			clearQueryForm();
			$("#deliveryType").combobox('setValue','出库拼箱');
			$("#orderNo").val("")
			$('#dateType').combobox('setValue', 'submitDate');
			$("#transactionStatus").combobox('setValue','Active');
			$('#trailingTeam').combogrid('setValue',label.label);
			$("#dateBegin").datetimebox('setValue', dateAdd("begin",0))
			$("#dateEnd").datetimebox('setValue', dateAdd("end",0));
			$("#detailgrid").datagrid('getPager').data("pagination").options.pageList = [40,80,120,160,1000];
			$("#detailgrid").datagrid('getPager').data("pagination").options.pageSize = 1000;
			query();
		}
	});
}

//dialog参数设置
function dialogSet(){
    $('#plxg').dialog({
        title: '批量修改单证',
        width: 700,
        height: 200,
        closed: true,
        cache: false,
        modal: true,
        toolbar: [{
            iconCls: 'icon_shengcheng',
            text:'确定',
            handler: plxg
        },{
            iconCls: 'myCustomerIcon_clear',
            text:'清空',
            handler: reset
        }]
    });
    $('#setting').dialog({
        title: '设置查询条件',
        width: 500,
        height: 200,
        closed: true,
        cache: false,
        modal: true,
        toolbar: [{
            iconCls: 'icon-standard-database-edit',
            text:'保存',
            handler: submitSet1
        },'-',{
            iconCls: 'icon-standard-database-delete',
            text:'重置',
            handler: resetquery
        },'-',{
            iconCls: 'icon-standard-application-form',
            text:'查询区带入',
            handler: formSet
        }]
    });
    //邮件补充信息
    $('#emailEditWin').dialog({
        title: '补充邮件信息',
        width: 500,
        height: 200,
        closed: true,
        cache: false,
        modal: true,
        toolbar: [{
            iconCls: 'icon-standard-database-edit',
            text:'保存',
            handler: saveEmailMsg
        }]
    });
	$('#trainMail').dialog({
	    title: '铁路邮件',
	    width: 500,
	    height: 200,
	    closed: true,
	    cache: false,
	    modal: true,
	    toolbar: [{
	        iconCls: 'icon-standard-database-edit',
	        text:'保存',
	        handler: trainstart
	    }]
	});
}

//datebox参数设置
function deteBoxSet(){
	$('#dd').datebox({
        required:true,
    });
    $('#dd1').datebox({
        required:true
    });
    $('#dd2').datebox({
        required:true
    });
}

//menubutton参数设置
function menubuttonSet(){
	$('#bobo').menubutton({//datagrid工具栏更多
        menu:'#popo',
        iconCls:'icon-standard-bricks'
    })
}




/*--------------------------------装车单跳转--------------------------------*/

//查询E单号
unsafeWindow.QueryEorder = function (uuid){
    var jsonData = '{"serviceName":"commonQueryManager","methodName":"query","parameters":{"queryInfo":{"queryType":"findSoSOTOrderStatusBySoNoDataSource","orderBy":"","fieldCodeTypes":{},"queryFields":[{"fieldName":"submitOrderUuid","fieldStringValue":"'+uuid+'"}],"pagingInfo":{"pageSize":10,"currentPage":1}}}}'
    $.ajax({
        type: 'post',
        url: hostUrl+'/cfs/JsonFacadeServlet',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data:{json_parameters:jsonData},
        success: function(data) {
            // your code
                var ccc = data.result.dataList;
            console.log(ccc[0].submitOrderNo);//E单号
            if(ccc[0].submitOrderNo){
                Eorder(ccc[0].submitOrderNo);
            }
        }
    });
}

//查询装车单uuid，并打开装车单
unsafeWindow.Eorder = function (code){
    var dataJson = '{"serviceName":"commonQueryManager","methodName":"query","parameters":{"queryInfo":{"queryType":"outBoundSubmitOrderQueryDataSource","orderBy":"","paramForm":"formQuery","queryFields":[{"fieldName":"officeCode","fieldStringValue":"SZWLC"},{"fieldName":"transactionType","fieldStringValue":"SOT"},{"fieldName":"submitOrderNo","fieldStringValue":"'+code+'"}]}}}';
    $.ajax({
        type: 'post',
        url: hostUrl+'/cfs/JsonFacadeServlet',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data:{json_parameters:dataJson},
        success: function(data) {
            // your code
            var ccc = data.result.dataList;
            var fullCarOrder = ccc[0].deliveryOrderUuid;
            console.log(fullCarOrder);
            window.parent.addTabs("装车单办理","/cfs/jsp/outbound/loadOrderListEdit.jsp?deliveryOrderUuid="+fullCarOrder,true,true);
        }
    });
}




/*--------------------------------连续选中--------------------------------*/

//勾选是否开启连续选中
unsafeWindow.checkboxOnclick = function(){
    var ccc= $('#lxxz').is(':checked');
    if(ccc){
        if(!GM_getValue('xz')){
            GM_setValue('xz',true)
        }
    }else{
        GM_deleteValue('xz')
    }
}

//连续选中执行
unsafeWindow.lxxzsj = function(da){
    $('#detailgrid').datagrid('selectRow',da)
}







//船公司简称
unsafeWindow.aux2 = function(data){
    switch(data) {
        case "马士基海陆有限公司":
            return "马士基";
            break;
        case "海洋网联船务（中国）有限公司深圳分公司":
            return "ONE";
            break;
        case "长荣海运股份有限公司":
            return "长荣";
            break;
        case "法国达飞轮船公司":
            return "达飞";
            break;
        case "地中海航运公司":
            return "地中海";
            break;
        case "东方海外货柜航运（中国）有限公司":
            return "OCL";
            break;
        case "韩国高丽海运株式会社":
            return "高丽";
            break;
        case "赫伯罗特船务有限公司":
            return "赫伯罗特";
            break;
        case "宏海箱运船务有限公司广州分公司":
            return "宏海";
            break;
        case "建华":
            return "建华";
            break;
        case "太平船务有限公司":
            return "太平船务";
            break;
        case "现代商船有限公司":
            return "现代";
            break;
        case "上海新海丰集装箱运输有限公司深圳分公司":
            return "新海丰";
            break;
        case "兴亚船务":
            return "兴亚船务";
            break;
        case "阳明海运股份有限公司":
            return "阳明";
            break;
        case "以星轮船船务有限公司":
            return "以星";
            break;
        default:
            return "未知";
    }
}




/*--------------------------------云端数据--------------------------------*/
//云端数据获取公共方法
unsafeWindow.ydsjyz = function(url,data,type){
    const p = new Promise((resolve, reject) => {
        var userId = $('#userCode', unsafeWindow.parent.document).val();
        var userName = $('#userName', unsafeWindow.parent.document).val();
        GM_xmlhttpRequest({
            method: "post",
            url: url,
            data: '&password='+userId+'&username='+userName+data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(r) {
                // 请求成功执行返回数据
                 console.log(r);
                if(type != ""){
                    resolve(r.response);
                }else{
                    var datalist = $.parseJSON(r.response);
                    resolve(datalist.data);
                }
            },
            onerror : function(err){
                console.log(err)
                console.log(err)
            }
        });
    });
    return p;
}


//云端开始-[补充邮件信息]更新order
unsafeWindow.checkorder = async function(orders,dataArr,type){
	let shipping = aux2(orders.aux2Desc);//船公司
	let status,loadingProcess;
	let sendData;
	let line;
	if(dataArr.line == '1'){
		line = '欧线';
	}else if(dataArr.line == '2'){
		line = '美线';
	}
	if(orders.process){
		status= orders.process;
	}else{
		status = "无";
	}
	if(orders.loadingProcess){
		loadingProcess = orders.loadingProcess;
	}else{
		loadingProcess = "无";
	}
	if(type == 'addShipMsg'){
		sendData= '&shipment='+dataArr.batch+'&shipping='+shipping+'&vesselName='+orders.vesselName+'&voyage='+orders.voyage+'&route='+line+'&siInputTime='+orders.siInputTime+'&cydeat='+orders.cutDate+'&submitDate='+orders.submitDate+'&type='+type;
	}
	let msgCode = await ydsjyz('http://kc.bihushow.cn/test/orderlist-api.php',sendData,'write');
	if(msgCode){
		if(msgCode == "400"){
			sliderelay('系统提示','<font color="red">你没有权限使用云端数据！</font>');
		}else{
			sliderelay('系统提示',msgCode);
		}
	}
}

//查询区域右侧表格-云端数据获取
async function cloudData(){
    var data = await ydsjyz('http://kc.bihushow.cn/test/order.php','','');
    console.log("云端表格数据：")
    console.log(data);
    var str = "";
    var map = {};
    var map2 = ["船司"];
    var res = [];
    for(var i=0;i<data.length;i++){
        var name = data[i].submitDate;
        var shipping = data[i].shipping;
        var send = data[i].send;
        if(!map[name]){
            map[name] = {
                submitDate : name.substr(5,5),
                num : 1,
                send : 0
            }
            if(send){
                map[name].send += 1;
            }
            res.push(map[name]);
        }else{
            map[name].num += 1;
            if(send){
                if(map[name].send){
                    map[name].send += 1;
                }else{
                    map[name].send = 1;
                }

            }
        }
        if(!map[name][shipping]){
            map[name][shipping] = 1;
        }else{
            map[name][shipping] += 1
        }

    }
    $.each(data,function(index,row){
        var shipping = row.shipping;
        if(map2.indexOf(shipping)== -1){
            map2.push(shipping)
        }
        if(index == data.length -1){
            console.log(map2);
        }
    })
    for(var z = 0;z < map2.length+1;z++){
        var shiping = map2[z];
        for(var y = 0;y < res.length;y++){
            if(z == 0){
                console.log(check(res[y].submitDate))
                if(y == 0){
                    str += "<tr><th>"+shiping+"</th><th>"+check(res[y].submitDate)+"</th>";
                }else{
                    str += "<th>"+check(res[y].submitDate)+"</th>";
                }
                if(y == res.length - 1){
                    str += "</tr>";
                }
            }else{
                if(y == 0){
                    if(z == map2.length){
                        str += "<tr><td>合计</th><td style='background-color:"+istrue(res[y].send,res[y].num,res[y].submitDate)+";'>"+check(res[y].send,"send")+"/"+res[y].num+"</td>";
                    }else{
                        str += "<tr><td>"+shiping+"</td><td>"+check(res[y][shiping])+"</td>";
                    }
                }else{
                    if(z == map2.length){
                        str += "<td style='background-color:"+istrue(res[y].send,res[y].num,res[y].submitDate)+";'>"+check(res[y].send,"send")+"/"+res[y].num+"</td>";
                    }else{
                        str += "<td>"+check(res[y][shiping])+"</td>";
                    }
                }
                if(y == res.length - 1){
                    str += "</tr>";
                }
            }
        }
    }
    //判断是否发送完毕
    function istrue(data1,data2,date){
        var dateTime = new Date();
        let today = formatDateTime(dateTime,"md");
        console.log(date);
        if(date<=today){
            if(data1 == data2){
                return "#2bf22b";
            }else if(data1){
                return "yellow";
            }else{
                return "red";
            }
        }

    }
    function check(data,type){
        if(data){
            return data;
        }else{
            if(type){
                return 0;
            }else{
                return "";
            }
        }
    }
    $('#tlgltj').append(str);
    console.log(map)
    console.log(res)
    return;
    $.each(res,function(index,row){
        if(index == 0){
            str += "<tr>船司<th></th><th>"+row[0].submitDate+"</th><th>"+row[1].submitDate+"</th><th>"+row[2].submitDate+"</th><th>"+row[3].submitDate+"</th><th>"+row[4].submitDate+"</th><th>"+row[5].submitDate+"</th><th>"+row[6].submitDate+"</th></tr>";
        }
        str += "<tr>"
        for(var p in row){
            if(p != 'submitDate'){
                str += "<td>"+p+"</td>";
            }
        }
        var arr = Object.keys(row);
        for(var i = 0; i<=arr.length;i++){
            str+="<>"
        }
        str += "<tr><td>"+row[0].submitDate+"</td><td>"+index+"</td><td>"+index+"</td><td>"+index+"</td><td>"+index+"</td><td>"+index+"</td><td>"+index+"</td></tr>";

        if(index == res.length - 1){
            $('#tlgltj').append(str);
        }
    })
}

//删除云端数据
unsafeWindow.delCloudData = function (row){
    console.log(row);
    GM_xmlhttpRequest({
        method: "post",
        url: 'http://seo.bihushow.cn/api/cfsApi/order_del.php',
        data: '&orderNo='+row.orderNo+'&userId='+userId+'&userName='+userName+'&shipment='+row.shipment,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: function(r) {
            // 请求成功执行返回数据
            console.log(r.response);
            if(r.response == 200){
                sliderelay("系统提示","云端数据删除成功！");
            }else{
                sliderelay("系统提示",r.response);
            }
            datagirdReaload("detailgrid");
        }
    });
}






/*--------------------------------邮件信息--------------------------------*/

//补充邮件信息
unsafeWindow.emailEdit = function(){
    var row = $("#detailgrid").datagrid('getSelections');
    if(row.length > 0){
        var check = true;
        $.each(row,function(index,rows){
            if(row[0].vesselName!=rows.vesselName || row[0].voyage!=rows.voyage){
                check = false;
            }
        })
        if(check){
            var mailMsg = GM_getValue(row[0].orderNo);
            if(mailMsg){
                $("#line").combobox("setValue",mailMsg.line)
                $("#batch").val(mailMsg.batch);
            }else{
				if(row[0].unloadPortName == "洛杉矶" || row[0].unloadPortName == "长滩"){
					$("#line").combobox("setValue",2)//美线
				}else{
					$("#line").combobox("setValue",1)//美线
				}
                $("#batch").val("");
            }
            $('#emailEditWin').dialog('open');
        }else{
            $.messager.alert("提示","所选订单船名航次不相同","info");
        }
    }else{
        $.messager.alert("提示","请至少选择一份订单!","info");
    }
}

//保存邮件信息
unsafeWindow.saveEmailMsg = function(){
	var batch = $('#batch').val();
	var isTrue = true;
	var line = $("#line").combobox("getText");
	var row = $("#detailgrid").datagrid('getSelections');
	if(batch.substring(0,4) == "603N"){
		if(line != "美线"){
			$.messager.alert("提示","信息录入错误，请重新输入！","info");
			isTrue = false;
		}
	}else if(batch.substring(0,4) == "648N"){
		if(line != "欧线"){
			$.messager.alert("提示","信息录入错误，请重新输入！","info");
			isTrue = false;
		}
	}
	$.each(row,function(index,rows){
		if(rows.batch != row[0].batch){
			isTrue = false;
		}
	})
	if(isTrue){
		var dataArr = {};
		$.each(row,function(index,rows){
			dataArr.batch = batch;
			let shipping = aux2(rows.aux2Desc);//船公司
			if(GM_getValue(rows.orderNo)){
				if(GM_getValue(rows.orderNo).send){
					dataArr.send = GM_getValue(rows.orderNo).send;
				}
			}else{
				dataArr.send = "否";
			}
			dataArr.line = $("#line").combobox("getValue");
			GM_setValue(rows.orderNo,dataArr);
			sliderelay("系统提示","<font size='4' color='green'>保存成功</font>");
			var sendData = '&shipment='+batch+'&so='+rows.orderNo+'&type=orderShip';
            console.log(sendData);
			ydsjyz('http://kc.bihushow.cn/test/orderlist-api.php',sendData,'write');
			if(index == row.length - 1){
				if(!rows.batch){
					sendData= '&shipment='+batch+'&submitDate='+rows.submitDate+'&route='+line+'&vesselName='+rows.vesselName+'&voyage='+rows.voyage+'&shipping='+shipping+'&cyopen='+rows.submitDate+'&cydeat='+rows.cutDate+'&siInputTime='+rows.siInputTime+'&type=addorderEmail';
					console.log(sendData);
					ydsjyz('http://kc.bihushow.cn/test/orderlist-api.php',sendData,'write');
				}else{
					sendData= '&shipment='+batch+'&oldShipment='+rows.batch+'&type=edit';
					//仅更新批次
					console.log('仅更新批次')
					ydsjyz('http://kc.bihushow.cn/test/orderlist-api.php',sendData,'write');
				}
				console.log('订单数据更新成功！');
				$('#emailEditWin').dialog('close');
				$("#batch").val("");
				$("#line").combobox("setValue","");
			}
		});
	}else{
		sliderelay("系统提示","<font size='4' color='red'>批次不相同！</font>");
	}
}

//删除邮件信息
unsafeWindow.emailDelete = function(){
    var row = $("#detailgrid").datagrid('getSelections');
    $.each(row,function(index,rows){
        GM_deleteValue(rows.orderNo);
        delCloudData(rows);
        if(index == row.length - 1){
            $.messager.alert("提示","本地及云端数据删除成功!","info");
        }
    })
}

unsafeWindow.huanguiBefo = function (){
    var check = true;
    var rows = $("#detailgrid").datagrid('getSelections');
    if(rows.length > 0){
        $.each(rows,function(index,row){
            if(!row.containerNo){
                $.messager.alert("提示",row.orderNo+"未提柜，不允许发送邮件！","info");
                check = false;
                return false;
            }
        })
        if(check){
            if(true){
                charging();
                return;
            }//是否查询提柜时间开关
            huangui(check);
        }
    }

}

//计算提柜费用
unsafeWindow.charging = async function(){
    var getSelec = $("#detailgrid").datagrid('getSelections');
    if(getSelec.length){
        var str = "";
        var mailTitle = "【柜封号】SHPT#";//批次号数组，用于邮件标题
        var check;
        var mailMsg = GM_getValue(getSelec[0].orderNo);
        let jichuArr1 = await ydsjyz("http://kc.bihushow.cn/test/port.php","&type=query","");
        var jichuArr = jichuArr1;

        $.each(getSelec,function(index,row){
            if(getSelec[0].vesselName == row.vesselName && getSelec[0].voyage == row.voyage && row.containerNo){
                if(row.solAux2 !== "Y"){
                    $.messager.alert("警告",row.orderNo+"没有更新打单!","info");
                    return;
                }
                var tigdd = row.flowName;
                var hugdd = row.directionDesc;
                var ytfy,ygf;
                if(tigdd.substring(tigdd.length-2) != "码头"){
                    if(row.containerType.substring(0,2) == 20){//判断柜型是否为20尺
                        ygf = 40;
                    }else{
                        ygf = 60;
                    }
                }else{
                    ygf = "无";
                }
                if(row.solAux1 == "Y"){//判断是否异提
                    function looptig(indexs){
                        if(tigdd == jichuArr[indexs].siteName){
                            switch(jichuArr[indexs].otherUuid){
                                case "盐田":
                                    ytfy = 200;
                                    break;
                                case "大铲":
                                    if(hugdd == "盐田码头"){
                                        ytfy = 300;
                                    }else{
                                        ytfy = 150;
                                    }
                                    break;
                                case "蛇口":
                                    if(hugdd == "盐田码头"){
                                        ytfy = 200;
                                    }else{
                                        ytfy = 150;
                                    }
                                    break;
                                case "横岗":
                                    ytfy = 100;
                                    break;
                                case "凤岗":
                                    if(hugdd == "盐田码头"){
                                        ytfy = 300;
                                    }else{
                                        ytfy = 400;
                                    }
                                    break;
                                case "坪山":
                                    ytfy = 150;
                                    break;
                                default:
                                    $.messager.alert("警告",jichuArr[indexs].otherUuid+"无此计费区域!","info");
                                    break;
                            }
                        }else{
                            if(indexs < jichuArr.length){
                                console.log("下一个循环")
                                indexs += 1;
                                looptig(indexs);
                            }else{
                                $.messager.alert("警告",tigdd+"基础数据无此提柜地点!","info");
                                return;
                            }
                        }
                    }
                    looptig(0);
                }else{
                    ytfy = "无";
                }
                var shipkey = row.batch;
                if(mailTitle.indexOf(row.batch) == -1){
                    if(mailTitle.indexOf('SZ1') == -1){
                        mailTitle += shipkey;
                    }else{
                        mailTitle += ','+shipkey;
                    }
                }
                var indexNow = index+1;
                str += "<tr><td>"+indexNow+"</td><td>"+row.batch+"</td><td>"+row.orderNo+"</td><td>"+row.containerNo+"</td><td>"+row.sealNo+"</td><td>"+row.containerType+"</td><td>"+row.tareWeight+"</td><td>"+tigdd+"</td><td>"+ytfy+"</td><td>"+ygf+"</td></tr>"
                check = true;
            }else{
                check = false;
                $.messager.alert("提示","所选订单船名航次不相同,或存在未提柜","info");
                return false;
            }
        })
        if(check){
            var mailBody = `<style>.tle{background-color: #2196f3;color: #fff;}.tle td{width:104pt;}.tableList td{font-size: 16px;}</style><table class="tableList" border="1" cellspacing="0"><tbody><tr class="tle"><td style="width:50px;">序号</td><td>Shipment</td><td>SO#</td><td>柜号</td><td>封号</td><td>尺寸</td><td>空柜重量</td><td>提柜地点</td><td>异提费</td><td>约柜费</td></tr>`+str+`</tbody></table>`;
            var data = {mail:mailMsg.mail,mailBody:mailBody,send:mailMsg.send}
            $("#emailBody").html(data.mailBody);
            if(getSelec[0].line == "欧线"){
                $(".tle").css('background-color','green');
                sendEmail('ou',mailTitle);
            }else if(getSelec[0].line == "美线"){
                sendEmail('ml',mailTitle);
            }else{
                $.messager.alert("提示","数据错误，请检查航线是否正常填写！","info");
            }
            $('#beforEmail').dialog('open');
            $('#btn_copy').click();
        }
    }else{
        $.messager.alert("提示","请选择1至10条数据!","info");
    }
}

//铁路邮件
unsafeWindow.trainEmail = function(){
	var getSelec = $("#detailgrid").datagrid('getSelections');
	if(getSelec.length){
		if($("#trainMail").parent().is(":hidden")){//判断弹窗是否关闭
			$('#trainMail').dialog({draggable:true,modal:true}).dialog('open');
		}
		if($('#transport').combobox('getValue')){
				$("#cyOpen").datebox('setValue','');//开舱日期
				$("#exit").datebox('setValue',formatDateTime((new Date()).valueOf(),"ymd"));//出闸日期
				$("#load").datebox('setValue','');//装柜日期
				$("#beforehand").combobox('select','');//是否预渡

				$("#pinghunan").datebox('disable');//下拉框不可用
				$("#yict").datebox('disable');//下拉框不可用
				$("#load").datebox('enable');
				$("#cyOpen").datebox('enable');
				$("#beforehand").combobox('enable');
				$("#exit").datebox('enable');
		}else{
			$('#transport').combobox('select',2);//运输类型默认空上重下
			$("#cyOpen").datebox('setValue','');//开舱日期
			$("#exit").datebox('setValue',formatDateTime((new Date()).valueOf(),"ymd"));//出闸日期
			$("#load").datebox('setValue','');//装柜日期
			$("#beforehand").combobox('select','');//是否预渡
			$("#pinghunan").datebox('disable');//下拉框不可用
			$("#yict").datebox('disable');//下拉框不可用
		}

	}else{
        $.messager.alert("提示","您还没有选择数据!","info");
    }
}

//铁路邮件执行
unsafeWindow.trainstart = function(){
	var getSelec = $("#detailgrid").datagrid('getSelections');
	var timeval = (new Date()).valueOf();
	var timeOut = formatDateTime(timeval,"ymd");
	var loadTime = formatDateTime(timeval + 86400000,"ymd");
	var str = '';
	var mailto = "PML.service@pingyan.com.cn,opc-transport@sinotrans.com,cds.szzwy@sinotrans.com,jiangyanwei@sinotrans.com,wangjing2@sinotrans.com,yangjianhua@sinotrans.com,liwendong@sinotrans.com,lisuibin@sinotrans.com";
	var mailcc = "gary.wu@pingyan.com.cn,PML.service@pingyan.com.cn";
	var tranType = $('#transport').combobox('getText');
	var mailTitle = "["+tranType+"] 平湖南站搬"+formatDateTime(timeval,"ymd")+"订单";
	var mailBody = "以下为"+formatDateTime(timeval,"ymd")+"平盐铁路"+tranType+"订单（"+getSelec.length+"个），我司"+loadTime+(tranType=='纯重下'?"还柜于平湖南。":"用柜。");

	if(tranType == "纯重下"){
		$.each(getSelec,function(index,row){
			console.log(row);
			var num = index+1;
			str += `<tr><td>`+num+`</td><td>中外运</td><td>`+row.orderNo+`</td><td>`+row.containerNo+`</td><td>`+row.sealNo+`</td><td>`+row.doTractorNo+`</td><td>`+row.tareWeight+`</td><td>`+row.grossWeight+`</td><td>`+row.containerType+`</td><td>`+aux2(row.aux2Desc)+`</td><td>`+row.cutDate+`</td><td>`+$("#pinghunan").datebox('getValue')+`</td><td>`+$("#yict").datebox('getValue')+`</td></tr>`;
			if(index == getSelec.length - 1){
				str = `<style>.tle{background-color: yellow;color: #000;}.tle td{padding: 0 10px;}.tableList td{font-size: 16px;text-align: center;}</style><table class="tableList" border="1" cellspacing="0"> <tbody> <tr class="tle"> <td style="width:40px;">序号</td> <td style="width:70px;">企业名称</td> <td style="width:100px;">订舱号</td> <td style="width:150px;">柜号</td> <td style="width: 100px">封条号</td> <td style='width: 80px'>车牌信息</td> <td style="width: 40px">柜重</td> <td style="width: 60px">货重</td> <td style="width: 40px">柜型</td> <td style="width: 60px">箱主</td> <td style="width: 180px">截重时间</td> <td style="width: 130px">还平湖南日期</td> <td style="width: 130px">要求还YICT日期</td> </tr>`+str+`</tbody> </table>`;
				console.log(str);
				$("#emailBody").html(str);
				$('#beforEmail').dialog('open');
				$('#btn_copy').click();
				location="mailto:"+mailto+"?cc="+mailcc+"&subject="+mailTitle+"&body=Dear 陈小姐 <br><br>"+mailBody;
			}
		})
	}else if(tranType == "空上重下"){
		$.each(getSelec,function(index,row){
			console.log(row);
			var num = index+1;
			str += `<tr><td>`+num+`</td><td>`+row.orderNo+`</td><td>`+row.containerType+`</td><td>`+aux2(row.aux2Desc)+`</td><td>`+$("#cyOpen").datebox('getValue')+`</td><td>`+row.cutDate+`</td><td>`+$("#exit").datebox('getValue')+`</td><td>`+yonggui(row)+`</td><td>`+$("#load").datebox('getValue')+`</td><td>生活用品</td><td>`+$("#beforehand").combobox('getText')+`</td><td>`+$("#transport").combobox('getText')+`</td></tr>`;
			if(index == getSelec.length - 1){
				str = `<style>.tle{background-color: yellow;color: #000;}.tle td{padding: 0 10px;}.tableList td{font-size: 16px;text-align: center;}</style> <table class="tableList" border="1" cellspacing="0"> <tbody> <tr class="tle"> <td style="width:50px;">序号</td> <td>订舱单号：SO</td> <td>柜量/柜型</td> <td>船公司</td> <td style="width: 100px">开仓日期</td> <td style='width: 160px'>截重日期</td> <td style="width: 100px">出闸日期</td> <td style="width: 50px">用柜期</td> <td style="width: 100px">装柜时间</td> <td style="width: 100px">品名</td> <td>是否使用预渡柜</td> <td style="width: 100px">备注</td> </tr> `+str+` </tbody> </table>`
				console.log(str);
				$("#emailBody").html(str);
				$('#beforEmail').dialog('open');
				$('#btn_copy').click();
				location="mailto:"+mailto+"?cc="+mailcc+"&subject="+mailTitle+"&body=Dear 黄小姐 <br><br>"+mailBody;
			}
		})
	}
    function yonggui(row){
        if(aux2(row.aux2Desc)=="马士基"){
            return 14;
        }else{
            return 7;
        }
    }
}

//发送邮件
unsafeWindow.sendEmail = function(line,mailTitle,mailBody){
    //var mline = "CDSAMZSZFBA@cds.com.hk;centuryszwarehouse@cds.com.hk;CDSAMZSZFBAdocument@cds.com.hk;";//浅绿色
    var mline = "CDSAMZSZFBAdocument@cds.com.hk;centuryszwarehouse@cds.com.hk;CDSAMZSZFBAOUTBOUND@cds.com.hk;CDSAMZSZFBAINBOUND@cds.com.hk;";
    var ouline = "CDSAMZSZFBEEU@cds.com.hk;centuryszwarehouse@cds.com.hk;CDSAMZSZFBEdocument@cds.com.hk";//就是深绿色
    if(!mailBody){
        mailBody = "";
    }
    if(line == "ou"){
        location = "mailto:"+ouline+"?cc=cds.szzwy@sinotrans.com&subject="+mailTitle+"&body=Dear all <br><br>"+mailBody;
    }else{
        location="mailto:"+mline+"?cc=cds.szzwy@sinotrans.com&subject="+mailTitle+"&body=Dear all <br><br>"+mailBody;
    }

}

//标记已发送邮件
unsafeWindow.sendEmailMsg = function(){
    var row = $("#detailgrid").datagrid('getSelections');
	var isTrue = true;
	if(row.length){
        $.messager.confirm('标记已发送邮件', '确认已发送邮件?', function(r){
			$.each(row,function(index,rows){
				if(rows.send == "是"){
					isTrue = false;
				}
			});
			if(!isTrue){
				sliderelay("系统提示","存在已发送邮件标记，请检查！");
				return;
			}
            if (r){
                $.each(row,async function(index,rows){
					var sendData = "&so="+rows.orderNo+"&shipment="+rows.batch+"&containerNo="+rows.containerNo+"&sealNo="+rows.sealNo+"&tareWeight="+rows.tareWeight+"&flowName="+rows.flowName+"&carCode="+rows.doTractorNo+"&type=sendEmail";
					console.log(sendData);
					await ydsjyz("http://kc.bihushow.cn/test/orderlist-api.php",sendData,"sendEmail");
					if(index == row.length - 1){
						sliderelay("系统提示","<font size='4' color='green'>保存成功,请重新查询刷新！</font>");
					}
                })
            }
        });
    }else{
        $.messager.alert("提示","请至少选择一条数据！","info");
    }
}

//发送邮件复制表格
function copyMailMsg(){
	var clipboard = new ClipboardJS('#btn_copy');
	clipboard.on('success', function(e) {
		e.clearSelection();//清除选择涂黑显示
		alert("复制成功！",1);
	});
	clipboard.on('error', function(e) {
		alert("复制失败，请刷新后重试！",1);
	});
	$('#beforEmail').dialog('close');
}





/*--------------------------------查询--------------------------------*/

//查询
unsafeWindow.query = function(type){
    var formData = $("#formQuery").form("getData");
    var time = 0;
    console.log(formData);
    var queryCriteria = "[";
    var indexs = 0;
    $.each(formData,function(index,row){
        if(row){
            if(index == "orderNoLike" || index == "backC" || index == "process" || index == "loadingProcess"){
                queryCriteria += `{"fieldName":"`+index+`","fieldType": "String[]","fieldStringValue":"`+row+`"},`;
            }else if(index == "dateBegin" || index == "dateEnd"){
                queryCriteria += `{"fieldName":"`+index+`","fieldType": "Date","fieldStringValue":"`+row+`","operator":"`+index+`"},`;
            }else{
                queryCriteria += `{"fieldName":"`+index+`","fieldStringValue":"`+row+`"},`;
            }
        }else if(index == "orderNoLike" || index == "backC" ){
            queryCriteria += `{"fieldName":"`+index+`","fieldType": "String[]","fieldStringValue":""},`;
        }
        indexs += 1;
        if(indexs == 38){
            queryCriteria = queryCriteria +`{"fieldName": "orderNoLike","fieldType": "String[]","fieldStringValue": ""}]`;
            var datapook =`{
                "serviceName": "commonQueryManager","methodName": "query","parameters": {"queryInfo": {"queryType": "fullContainerSoOrderQueryDataSource","orderBy": "","fieldCodeTypes": {},"paramForm": "formQuery","queryFields": `+queryCriteria+`,
                        "pagingInfo": {
                            "pageSize": 400,
                            "currentPage": 1
                        }
                    }
                }
            }`;
            $.ajax({
                type: "POST",
                url: hostUrl+"/cfs/JsonFacadeServlet",
                data: {json_parameters:datapook},
                header: {"Accept": "application/json, text/javascript, */*; q=0.01","Content-Type": "application/x-www-form-urlencoded"},
                dataType: "json",
                success: function(data){
                    console.log(data.result.dataList);
                    var orderNum = $("#detailgrid").datagrid('getData').rows.length;
                    data = data.result.dataList;
                    clearInterval(idp);
					if(data.length){
						reload(data,type);
                        sliderelay('加载成功','加载成功，本次用时 <font color="red">'+time / 10+'</font> 秒');
					}else{
						$('#detailgrid').datagrid('loaded');
                        $("#detailgrid").datagrid("loadData",{total:0,rows:[]});
						sliderelay('加载成功','没有找到单证，本次用时'+time / 10+'秒');
					}
                    setquery(data.length,orderNum);
                }
            });
            $('#detailgrid').datagrid('loading');
            var idp = setInterval(function(){ time += 1; }, 100);
        }
    });
};


//重置查询区域
function reset(){
    $('#jiezhong').val('');
    $('#VGM').val('');
    $('#buliao').val('');
    $('#fangxing').val('');
    $('#guanwu').val('');
    $('#kouan').val();
    $('#chuan').val('');
    $('#beizhu').val('')
    $('#vesselName').val('');
    $('#voyage').val('');
    $('#tiguid').val('')
    $('#huanguid').val('')
    $('#kouan').val();
}

//查询区域按钮及样式
function btn(){
	/*******搜索区域工具按钮栏********/
	$("#btnCancel").parent().append('<input id="cc" >');//车行搜索框

	/*******新窗口打开按钮（非新窗口显示）***********/
	if (top.location != self.location){
		$("#btnCancel").parent().append('<a class="easyui-linkbutton l-btn l-btn-plain" id="bendiQuery" iconcls="icon-search" plain="true" onclick="bendiQuery();">本地查询</a>');
		$("#btnCancel").parent().append('<a class="easyui-linkbutton l-btn l-btn-plain" id="newTabOpen" plain="true" iconcls="icon-standard-application-xp">新窗口打开</a>');

        //本地数据加载情况监控
        var bendi = setInterval(function(){
            if(GM_getValue("querytime")){
                var nowTime = (new Date()).valueOf();
                var data = GM_getValue("querydata");
                var Dtime = (nowTime - GM_getValue("querytime"))/60000;
                var dayCha = Dtime/60;
                if(dayCha < 12){
                    if(Dtime > 5){
                        clearInterval(bendi);
                    }
                    $('#bendi').text("本地数据："+data.total+" "+formatDateTime(GM_getValue("querytime"),'hm'));
                }else{
                    GM_deleteValue("querytime");
                    GM_deleteValue("querydata");
                    clearInterval(bendi);
                }
            }
        }, 1000);
	}else{
		$("#btnCancel").parent().append('<a class="easyui-linkbutton l-btn l-btn-plain" id="DdQuery" plain="true" iconcls="icon-search">打单查询</a>');
		$("#btnCancel").parent().append('<a class="easyui-linkbutton l-btn l-btn-plain" id="setQuery" plain="true" iconcls="icon-standard-arrow-refresh">循环查询</a>');
	}

	/*******SO框录入事件*********/
	var del = String(/\s+/g);
	$("#orderNo").attr("onkeyup","if(this.value.length < 20){this.value=this.value.replace("+del+",'')}");//去除SO空格
	$("#orderNo").attr("onkeydown","enterQuery(event,this.id)");//SO回车查询

	/****日历前后按钮*****/
	$('#dateEnd').after('<a class="easyui-linkbutton l-btn l-btn-plain" id="BeginAdd" plain="true" iconcls="icon-standard-date-delete">前</a>');
	$('#BeginAdd').after('<a class="easyui-linkbutton l-btn l-btn-plain" id="endAdd" plain="true" iconcls="icon-standard-date-add">后</a><input type="file" id="file" style="display:none;" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>');

	/*****派单图表*******/
	$('body').append('<div id="winchuang"></div>');//建立标签
	$('#transportStatisticsDatagrid').after('<div id="pdmsg"  style="width: 600px;height:330px;"></div>');//派单信息
	$('#transportStatisticsDatagrid').after('<div id="fbmsg"  style="width: 330px;height:165px;position: absolute; top: 0; right: 0;"></div>');//分布
	$('#transportStatisticsDatagrid').after('<div id="wgmsg"  style="width: 330px;height:165px;position: absolute; top: 165px; right: 0;"></div>');//完工
	if(GM_getValue('pdChart')){//如果派单图表开启状态
        $("#EIR_DOWNLOAD_FILE").after('<a class="easyui-linkbutton l-btn l-btn-plain" id="openChart" onclick="openChart()"  plain="true" iconcls="icon-convert">派车详情</a>')//添加按钮
		$('#transportStatisticsDatagrid').remove();//删除表单
	}

	/*******搜索区域调整样式*********/
	$('#unloadPort').attr('style','width:60px');//港口调整宽度
	$('#isCharge').attr('style','width:60px');//是否计费调整宽度
	$('#aux1').attr('style','width:92px');//口岸调整宽度
	$('#loadingOrderNo').attr('style','width:calc(100% - 3px)');//装车单号调整宽度
	$('#agentConsigneeCode').attr('style','width:165px');//委托客户调整宽度
	$('#isDispatch').attr('style','width:70px');//是否派单调整宽度
	$('#declareAllow').attr('style','width:70px');//是否允许出仓申报调整宽度
    $('#rcStatus').attr('style','width:53.5px');//计费单状态
    $('#customsType').attr('style','width:138px');//计费单状态

	/****搜索区新增查询条件*****/
	$('#ispileplace').parent().parent().append('<div colspan="2"> <input name="bachso" id="bachso" onkeydown="calAge(event)" style="width:185px" class="easyui-validatebox" title="批次号" /></div>');
	$('#ispileplace').parent().parent().append('<div colspan="1"> <input name="isSend" id="isSend" class="easyui-combobox" style="width: 50px;" title="发邮件没" /> </div>')
	$('#ispileplace').parent().parent().append('<div colspan="1"> <input name="online" id="online" class="easyui-combobox" style="width: 50px;" title="航线" /> </div>')
	$('#online').parent().parent().append('<div colspan="2"> <input name="tieluType" id="tieluType" class="easyui-combobox" style="width: 80px;" title="铁路类型" /> </div>')

	/******搜索区域高度修改（未改前有遮挡）******/
	$(".easyui-layout > div[region='north']").eq(0).css("height","195");//隐藏查询区域滚动条
	//$("form#formQuery").parent().css("overflow","hidden")

	/*****删除'剔除复选框',替换为combo下拉框*********/
	$('#agentConsigneeCode').parent().contents()[2].remove();
	$('#backC').remove();
	$('#agentConsigneeCode').after('<input id="backC" name="backC" class="easyui-combobox" title=" " style="width: 69px;"/>');

	/*****加载新增几个窗口标签*******/
	$('body').append('<table id="plxg"><tr><td width="50">预计做柜时间</td> <td width="170"> <input id="jihua" class="easyui-datebox" style="width:168px" /> </td> <td width="50">关务类型</td> <td width="170"> <input id="guanwu" class="easyui-validatebox" style="width:168px" /> </td> </tr> <tr> <td width="50">口岸</td> <td width="170"> <input id="kouan" class="easyui-validatebox" style="width:168px" /> </td> <td width="50">船公司</td> <td width="170"> <input id="chuan" class="easyui-validatebox" style="width:168px" /> </td> </tr> <tr> <td width="50">提柜地点</td> <td width="170"> <input id="tiguid" class="easyui-validatebox" style="width:168px" /> </td> <td width="50">还柜地点</td> <td width="170"> <input id="huanguid" class="easyui-validatebox" style="width:168px" /> </td> </tr> <tr> <td width="50">船名</td> <td width="170"> <input id="vesselName" class="easyui-validatebox" style="width:168px" /> </td> <td width="50">航次</td> <td width="170"> <input id="voyage" class="easyui-validatebox" style="width:168px" /> </td> </tr> <tr> <td width="50">截重时间</td> <td width="170"> <input id="jiezhong" class="easyui-validatebox" style="width:168px" /> </td> <td width="50">截VGM时间</td> <td width="170"> <input id="VGM" class="easyui-validatebox" style="width:168px" /> </td> </tr> <tr> <td width="50">截放行时间</td> <td width="170"> <input id="fangxing" class="easyui-validatebox" style="width:168px" /> </td> <td width="50">截补料时间</td> <td width="170"> <input id="buliao" class="easyui-validatebox" style="width:168px" /> </td> </tr> <tr> <td colspan="4"> <textarea id="beizhu" style="width: 673px;height:35px"></textarea> </td> </tr> </table>');
	$('body').append('<table id="trainMail"> <tr> <td width="80">是否预渡</td> <td width="170"> <input id="beforehand" class="easyui-combobox" style="width: 168px;"/> </td> <td width="80">出闸日期</td> <td width="170"> <input id="exit" class="easyui-datebox" style="width: 168px;" editable="false"/> </td> </tr> <tr> <td width="80">装柜日期</td> <td width="170"> <input id="load" class="easyui-datebox" style="width: 168px;" editable="false"/> </td> <td width="50">开舱日期</td> <td width="170"> <input id="cyOpen" class="easyui-datebox" style="width:168px" editable="false"/> </td> </tr> <tr> <td width="80">运输类型</td> <td width="170"> <input id="transport" class="easyui-combobox" style="width: 168px;" /> </td> </tr> <tr> <td width="80">还平湖南</td> <td width="170"> <input id="pinghunan" class="easyui-datebox" style="width: 168px;" editable="false"/> </td> <td width="50">还盐田日期</td> <td width="170"> <input id="yict" class="easyui-datebox" style="width:168px" editable="false"/> </td> </tr> </table>');
	$('body').append('<table id="setting"><tr><td width="50">状态</td> <td width="170"><input id="state" class="easyui-validatebox" style="width:168px"/></td> <td width="80">运输类型</td> <td width="170"><input id="type" class="easyui-validatebox" style="width:168px"/></td> </tr> <tr> <td width="50">委托客户</td><td width="170"><input id="customer" class="easyui-validatebox" style="width:168px"/></td> <td width="80">最大页码</td><td width="170"><input id="pages" class="easyui-validatebox" style="width:168px"/></td> </tr> <tr> <td width="50">运输公司</td><td width="170"><input id="cars" class="easyui-validatebox" style="width:168px"/></td> <td width="80">船公司</td><td width="170"><input id="shipping" class="easyui-validatebox" style="width:168px"/></td> </tr> </table>');
	$('body').append('<table id="emailEditWin"><tr> <td width="50">批次</td> <td width="170"> <input id="batch" class="easyui-validatebox" style="width:168px" /> </td> <td width="80">航线</td> <td width="170"> <input name="line" id="line" class="easyui-combobox" style="width: 168px;" required="true" /> </td> </tr></table>');

	/*****发送邮件复制表格区域******/
	$('body').append('<div id = "beforEmail" class="easyui-dialog" closed="true" style="width:1200px;height:500px" ></div>');
	$('#beforEmail').panel({
		content:`<button  id="btn_copy" data-clipboard-action="copy" data-clipboard-target=".tableList">复制表格内容</button><div id="emailBody"</div>`
	})


    //备注自动修改时间
    $("#beizhu").change(function(){
        var text = $("#beizhu").val();
        text = text.replace(/\/+/g,"-");
        var str = text.split(",");//逗号是分隔符
        console.log(str)
        loop(0);
        function loop(index){
            var row = str[index].split("：");
            console.log(row)
            switch(row[0]){
                case "CY OPEN":
                    $("#jihua").datebox('setValue',row[1]);
                    break;
                case "CY CUT":
                    $("#jiezhong").val(row[1]+":00");
                    break;
                case "CV CUT TIME":
                    $("#fangxing").val(row[1]+":00");
                    break;
                case "CDS S-I Cut off":
                    $("#buliao").val(row[1]+":00");
                    break;
            }
            if(index < str.length-1){
                index+=1;
                loop(index);
            }

        }
    });
}

//查询区域事件
$("#endAdd").click(function(){dateEite(1);});//日期后调
$("#BeginAdd").click(function(){dateEite(-1);});//日期前调

//事件主体
function dateEite(data){
    var time = $('#dateBegin').datetimebox('getValue');//获取表格时间
    var timeNum = new Date(time).getTime() - new Date().getTime();
    var days = timeNum / 86400000;
    var day = Math.ceil(days);
    $("#dateBegin").datetimebox('setValue', dateAdd("begin",day+data));
    $("#dateEnd").datetimebox('setValue', dateAdd("end",day+data));
}




/*--------------------------------本地查询--------------------------------*/
//加载本地数据
unsafeWindow.loadDatalist = function(){
    if(GM_getValue("querydata")){
        var data = GM_getValue("querydata");
        $("#detailgrid").datagrid('loadData',GM_getValue("querydata"));
    }else{
        sliderelay("系统提示","<font color='red'>请先开启循环查询功能！</font>");
        return;
    }
}

//本地数据查询
unsafeWindow.bendiQuery = function(){
    var getArr = GM_getValue("querydata").rows;//获取本地数据
    console.log(getArr);
    var queryFrom = $("#formQuery").form("getData");
    var dateBefor = ($('#dateBegin').datetimebox('getValue')).substr(0,10);//日期前
    var dateEnd = ($('#dateEnd').datetimebox('getValue')).substr(0,10);//日期后
    var newdata=[];//本地数据筛选结果存储数组
    if(getArr.length > 1){
        for(var z=0;z<getArr.length;z++){
            if(getArr[z].submitDate >= dateBefor){
                if(dateEnd >= getArr[z].submitDate){
                    newdata.push(getArr[z]);
                }
            }
        }
    }else{
        $.messager.alert("提示", "本地数据为空，不能查询！", "info");
    }
    if($('#orderNo').val()){//如果SO不为空
        var gjcArr = queryFrom.orderNo.split(",");//查询SO值
        var orderNoList = []
        $.each(getArr,function(index,row){
            if(gjcArr.indexOf(row.orderNo) != -1){
                orderNoList.push(row);
            }
            if(index == getArr.length - 1){
                newdata = orderNoList;
            }
        })
        $("#detailgrid").datagrid("loadData",{total:newdata.length,rows:newdata});
    }else{
        var user = $('#creator').combo('getText');//操作人
        var chepai,caozuo,chedao;
        /*查询车牌*/
        if(queryFrom.tractorNo){
            newdata = loopArr(newdata,"doTractorNo",queryFrom.tractorNo);
        }
        /*查询操作人*/
        if(queryFrom.creator){
            newdata = loopArr(newdata,"creator",queryFrom.creator);
        }
        /*查询柜型*/
        if(queryFrom.containerType){
            newdata = loopArr(newdata,"containerType",queryFrom.containerType);
        }
        /*查询车到*/
        if(queryFrom.isRuChang=="Y"){
            newdata = loopArr(newdata,"ruChang","√");
        }else if(queryFrom.isRuChang=="N"){
            newdata = loopArr(newdata,"ruChang",null);
        }
        /*是否派单*/
        if(queryFrom.isDispatch == "Y"){
            let newdatalist = [];
            for(var a=0;a<newdata.length;a++){
                if(newdata[a].deliveryOrderNo){
                    newdatalist.push(newdata[a]);
                }
                let changdu = newdata.length - 1
                if(a == changdu){
                    newdata = newdatalist;
                }
            }
        }else if(queryFrom.isDispatch == "N"){
            let newdatalist = [];
            for(var c=0;c<newdata.length;c++){
                if(!newdata[c].deliveryOrderNo){
                    newdatalist.push(newdata[c]);
                }
                let changdu = newdata.length - 1
                if(c == changdu){
                    newdata = newdatalist;
                }
            }
        }
        /*运输公司*/
        if(queryFrom.trailingTeam){
            newdata = loopArr(newdata,"trailingTeam",queryFrom.trailingTeam);
        }
        /*船公司*/
        if(queryFrom.aux2){
            newdata = loopArr(newdata,"aux2",queryFrom.aux2);
        }
        /*是否打单*/
        if(queryFrom.isFedBack){
            newdata = loopArr(newdata,"solAux2",queryFrom.isFedBack);
        }
        /*是否关联订单*/
        if(queryFrom.isRelateTrans == "Y"){
            newdata = loopArr(newdata,"isRelateTrans","是");
        }else if(queryFrom.isRelateTrans == "N"){
            newdata = loopArr(newdata,"isRelateTrans","否");
        }
        /*批次号*/
        if(queryFrom.bachso){
            newdata = loopArr(newdata,"batch",queryFrom.bachso);
        }
        /*航线查询*/
        if(queryFrom.online){
            var onlinedatalist = [];
            for(var t = 0;t<newdata.length;t++){
                if(GM_getValue(newdata[t].orderNo)){
                    var onlines = GM_getValue(newdata[t].orderNo).line;
                    if(onlines == queryFrom.online){
                        onlinedatalist.push(newdata[t]);
                    }
                    if(t == newdata.length - 1){
                        newdata = onlinedatalist;
                    }
                }
            }
        }
        /*铁路类型查询*/
        if(queryFrom.tieluType){
            var tieluTypedatalist = [];
            for(var j = 0;j<newdata.length;j++){
                if(GM_getValue(newdata[j].orderNo)){
                    var tieluTypes = newdata[j].priority;
                    if(queryFrom.tieluType == "3"){
                        if(!tieluTypes){
                            tieluTypedatalist.push(newdata[j]);
                        }
                    }else{
                        if(tieluTypes == queryFrom.tieluType){
                            tieluTypedatalist.push(newdata[j]);
                        }
                    }

                    if(j == newdata.length - 1){
                        newdata = tieluTypedatalist;
                    }
                }
            }
        }
        /*是否发送邮件*/
        if(queryFrom.isSend){
            var newdatalist = [];
            if(queryFrom.isSend == "是"){
				newdata = loopArr(newdata,"sendEmail","是");
            }else{
				newdata = loopArr(newdata,"sendEmail",null);
            }

        }
        function loopArr(newdata,atr,data){
            var newdatalist = [];
            for(var inx=0;inx<newdata.length;inx++){
                if(newdata[inx][atr] == data){
                    newdatalist.push(newdata[inx]);
                }
                var ccc = newdata.length - 1
                if(inx == ccc){
                    return newdatalist;
                }
            }
        }
        $.each(newdata,function(index,row){
            if(GM_getValue(row.orderNo)){
                row.batch = GM_getValue(row.orderNo).batch;
            }
            row.rownum = index + 1;
        })
        $("#detailgrid").datagrid("loadData",{total:newdata.length,rows:newdata});
    }
}

//本地数据重组数组
unsafeWindow.transform = function(obj){
    var arr = [];
    for(var item in obj){
        arr.push(obj[item]);
    }
    return arr;
}

//批次号回车查询
unsafeWindow.calAge = function (e) {
    var shipment = $('#bachso').val();
    var evt = window.event || e;
    if (evt.keyCode == 13) {
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://seo.bihushow.cn/api/cfsShipment.php',
            data: '&shipment='+shipment,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: function(r) {
                // 请求成功执行返回数据
                console.log(r.response);
                var ccc = r.response;
                if(ccc){
                    var datar;var str = '';
                    datar = JSON.parse(ccc)
                    console.log(datar);
                    $.each(datar.data,function(index,row){
                        if(index == datar.data.length -1){
                            str += row;
                            console.log(str);
                            $('#orderNo').val(str);
                            query();
                        }else{
                            str += row +',';
                        }
                    })
                }else{
                    sliderelay("系统提示","未找到云端数据！");
                }
            }
        });
    }
}





/*--------------------------------循环查询--------------------------------*/

//判断是否满足循环查询条件
$("#setQuery").click(function(){
    //判断浏览器是否开启了通知
    var tongzhi = window.Notification || window.mozNotification || window.webkitNotification;
    if (!tongzhi) {
        sliderelay("系统提示","您的浏览器不支持此特性");
        return false;
    }
    if(Notification.permission == "granted"){
        sliderelay("系统提示","开启了桌面通知");
        query("xhquery");
    }else if(Notification.permission == "default"){
        //询问是否开启桌面通知
        Notification.requestPermission().then(function(result) {
            if (result === 'denied') {
                sliderelay("系统提示","由于您禁止了通知，该功能不可用");
                return;
            }
            if (result === 'default') {
                console.log('您没有勾选允许，该功能将不可用.');
                return;
            }
            if (result === 'granted') {
                sliderelay("系统提示","开启了桌面通知");
                query("xhquery");
                return;
            }
        });
    }else{
        alert("您禁止了通知,该功能不可用！")
    }
});

//循环查询开始
unsafeWindow.setquery = function(newOrder,oldOrder,type){
    if(type !="xhquery"){
        return;
    }else if(!oldOrder){
        new Notification('开始启动', { body: '现在订单'+ newOrder +'份', icon: 'https://wimg.588ku.com/gif620/21/01/06/055c07596e164b8ee0cf219fdfae86b3.gif' });
    }else{
        if(newOrder > oldOrder){
            new Notification('新订单提醒', { body: '新增订单'+ addorder +'份,现'+ total +'份', icon: 'http://assets.souche.com/shop/assets/sso/favicon.ico' });
        }else if(newOrder < oldOrder){
            new Notification('删单提醒', { body: '减少订单'+ delorder +'份,现'+ total +'份', icon: 'http://assets.souche.com/shop/assets/sso/favicon.ico' });
        }else{
            //判断订单时效性
            sliderelay('加载成功','订单没有变化');
        }
    }
}

//判断数据是否加载完毕
async function loding(str,timeM){
    if(timeM == undefined){
        timeM = 0;
    }else{
        timeM += 1;
    }
    var sta = $("#detailgrid").datagrid('getPager').data("pagination").options.loading;
    if(sta){
        setTimeout(function(){loding(str,timeM)},100);
        console.log('还在加载...'+timeM)
    }else{
        await reload();//重载数据
        sliderelay('加载成功','加载成功，本次用时 <font color="red">'+timeM / 10+'</font> 秒')
    }
}

//重载数据[应该由加载状态来触发]
unsafeWindow.reload = async function (data,type){
    let msgCode = await ydsjyz('http://seo.bihushow.cn/api/orderApi.php',"","");
    console.log(msgCode);
    var newData = [];
    var time;
    var tipsTime = 0;
    $.each(msgCode,async function(index,row){
        newData[row.so] = row;
        if(index == msgCode.length - 1){
            console.log(data);
            console.log(newData);
            if(data.length){
                for(var i = 0;i<data.length;i++){
                    console.log(newData[data[i].orderNo]);
                    if(newData[data[i].orderNo]){
                        data[i].batch = newData[data[i].orderNo].shipment;//批次号
                        if(data[i].process !== "已还柜"){//级别
                            if(data[i].process !== "已提柜" && data[i].process !== "已离仓"){
                                time = (Date.parse(data[i].siInputTime) - Date.parse(new Date())) / (1000 * 60 * 60);
                            }else{
                                time = (Date.parse(data[i].cutDate) - Date.parse(new Date())) / (1000 * 60 * 60);
                            }
                            if(time < 10){
                                if(time < 5){
                                    data[i].jibie = "<font color='red'>"+time.toFixed(1)+"</font>";
                                    tipsTime += 1;
                                }else{
                                    data[i].jibie = "<font color='green'>"+time.toFixed(1)+"</font>";
                                }
                            }else{
                                data[i].jibie = "<font color='green'>"+Math.round(time)+"</font>";//时间差时
                            }
                        }else{
                            data[i].jibie = "<font color='green'>已完成</font>";
                        }
						data[i].sendEmail = newData[data[i].orderNo].send;//是否已发送邮件
                        data[i].line = newData[data[i].orderNo].route;//航线
                        data[i].rownum = i + 1;
                    }
                    if(i == data.length - 1){
                        $("#detailgrid").datagrid("loadData",{total:data.length,rows:data});
                        $('#detailgrid').datagrid('loaded');
                        if(type == "xhquery"){
                            GM_setValue("querytime",(new Date()).valueOf());
                            GM_setValue("querydata",$("#detailgrid").datagrid('getData'));
                            if(tipsTime){
                                new Notification('警告', { body: '有'+ tipsTime +'份订单即将超时，请注意！', icon: 'https://wimg.588ku.com/gif620/21/01/06/055c07596e164b8ee0cf219fdfae86b3.gif' });
                            }
                            query(type);
                        }
                    }
                }
            }else{
                console.log('数据为空！')
            }
        }
    });

}


//新窗口打开iframe
$("#newTabOpen").click(function(){
    if (top.location != self.location){
        window.open(self.location);
    }
});




/*--------------------------------批量操作订单--------------------------------*/

//批量修改循环
 unsafeWindow.plxg = async function(index){
     if(typeof index =='object'){
         index = 0;
     }
     var getSelec = $("#detailgrid").datagrid('getSelections');
	 var dataArr = {};
	 dataArr.line = getSelec[index].line;
	 dataArr.batch = getSelec[index].batch;
	let result = await plxgzx(getSelec[index]);
	if(result && index != getSelec.length -1){
		index += 1;
		plxg(index);
	}
}


//批量修改执行
function plxgzx(data){
	var uuid = data.submitOrderUuid;
    const p = new Promise((resolve, reject) => {
        SubmitOrderManager.reloadFullContainerData(uuid, function(spj) {
            var formQuery = spj.object;
            $('#jiezhong').val() ? formQuery.cutDate = $('#jiezhong').val() : '';//截重时间
            $('#VGM').val() ? formQuery.cutVgmTime = $('#VGM').val() : '';//VGM
            $('#guanwu').val() ? formQuery.customsType = $('#guanwu').val() : '';//关务类型
            $('#chuan').val() ? formQuery.aux2 = $('#chuan').val() : '';//船名
            $('#beizhu').val() ? formQuery.remark = $('#beizhu').val() : '';//备注
            $('#buliao').val() ? formQuery.siInputTime = $('#buliao').val() : '';//补料
            $('#jihua').datebox('getValue') ? formQuery.submitDate = $('#jihua').datebox('getValue') : '';//计划做柜
            $('#fangxing').val() ? formQuery.voucherSubmitTime = $('#fangxing').val() : '';//放行
            $('#vesselName').val() ? formQuery.vesselName = $('#vesselName').val() : '';//船名
            $('#voyage').val() ? formQuery.voyage = $('#voyage').val() : '';//航次
            $("#tiguid").val() ? formQuery.flow = $("#tiguid").val() : '';//提柜地点
            $("#huanguid").val() ? formQuery.direction = $("#huanguid").val() : '';//还柜地点
            $("#kouan").val() ? formQuery.aux1 = $("#kouan").val() : '';//口岸
            SubmitOrderManager.fullContainerModifyOrder(formQuery,async function(spj){
                if(showMsg(spj)){
                    var dataArr = "&so="+data.orderNo+"&submitDate="+formQuery.submitDate+"&type=plan";
                    let res = await ydsjyz('http://kc.bihushow.cn/test/orderlist-api.php',dataArr,"plan");
                    console.log(res)
					resolve(true);
                }
            });
        })
    })
    return p;
}

//批量修改订单弹窗打开
function plxgdz(){
    var xzlist = $("#detailgrid").datagrid('getSelections'); //获取选中
    if (xzlist.length > 0){
        var str = "";
        $.each(xzlist, function(index, row) {
            if (xzlist[0].deliveryType != row.deliveryType) {
                str = "选中订单所属运输类型不一致，不可派单！";
                $.messager.alert("提示", str, "info");
                return false;
            }
        });
        if (str == "") {
            $('#plxg').dialog({draggable:true,modal:true}).dialog('open');
            $('#jihua').datebox('setValue',xzlist[0].submitDate);
            $('#jiezhong').val(xzlist[0].cutDate);
            $('#VGM').val(xzlist[0].cutVgmTime);
            $('#buliao').val(xzlist[0].siInputTime);
            $('#fangxing').val(xzlist[0].voucherSubmitTime);
            $('#guanwu').val(xzlist[0].customsType);
            $('#kouan').val(xzlist[0].aux1);
            $('#chuan').val(xzlist[0].aux2);
            $("#tiguid").val(xzlist[0].flow);
            $("#huanguid").val(xzlist[0].direction);
            $('#beizhu').val(xzlist[0].remark)
            $('#vesselName').val(xzlist[0].vesselName);
            $('#voyage').val(xzlist[0].voyage);
        }
    }else{
        $.messager.alert("提示", "你还没有选择单证", "info");
    }
}

//选中数据执行批量查询
unsafeWindow.sendQuery = function(){
    var rows = $("#detailgrid").datagrid('getSelections');
    var order = "";
    if(rows.length == 1){
        order = rows[0].orderNo
    }else{
        $.each(rows,function(index,row){
            order += row.orderNo +',';
        })
    }
    $('#orderNo').val(order);
    bendiQuery();
}

//批量新增异常
unsafeWindow.plyc = function (){
    var rows = $("#detailgrid").datagrid('getSelections');
    if(rows.length >1 ){
        $.messager.defaults = { ok: "新增异常", cancel: "关闭异常" };
        $.messager.confirm('批量异常操作', '请选择操作项', function(b){
            if(b){
                $.messager.prompt('新增异常', '请输入要新增的异常文本信息', function(b){
                    var somsg = '';
                    $.each(rows,function(index,row){
                        if(!is_null(row.submitOrderUuid)){
                            somsg += row.orderNo + ",";
                            if((b.substring(0,4) == "打单异常" || b.substring(0,4) == "提柜异常") && index == rows.length - 1){
                                var abnormal = b.split('：')[1];
                                var mailBody;
                                if(b.substring(0,4) == "打单异常"){
                                    mailBody = "Dear all </br></br>SO#"+somsg+"无法打单。打单提示：“"+ abnormal +"”。打单截图如下，请及时联系船公司处理。"
                                }else{
                                    mailBody = "Dear all </br></br>SO#"+somsg+"无法正常提柜。原因：“"+ abnormal +"”。截图如下，请知悉。"
                                }
                                if(row.line == "欧线"){
                                    sendEmail('ou','单证异常通知',mailBody);
                                }else if(row.line == "美线"){
                                    sendEmail('ml','单证异常通知',mailBody);
                                }else{
                                    $.messager.alert("提示","数据错误，请检查航线是否正常填写！","info");
                                }
                            }
                            plxzyc(b,row.submitOrderUuid);
                        }
                    });
                })
            }else{
                $.messager.prompt('关闭异常', '请输入要关闭的异常文本信息', function(b){
                    function errLoop(num){
                        if(!is_null(rows[num].submitOrderUuid)){
                            console.log(rows[num].submitOrderUuid)
                            SubmitOrderManager.exceptionDatagridQuery(rows[num].submitOrderUuid,function(spj){
                                console.log(spj);
                                function errMsgLoop(number){
                                    if(spj.object[number].remark == b &&spj.object[number].status == "Active"){
                                        $("#exceptionDatagrid").datagrid("setQueryFields",[
                                            {
                                                fieldName:"submitOrderUuid",
                                                fieldStringValue:rows[num].submitOrderUuid
                                            },{
                                                fieldName:"transactionType",
                                                fieldStringValue:'Exception'
                                            }
                                        ]);
                                        $("#exceptionDatagrid").datagrid("commonQuery", {
                                            queryType : "SubmitOrderLogModel"
                                        });
                                        setTimeout(function(){
                                            var soArr = $("#exceptionDatagrid").datagrid("getData").rows[number];
                                            soArr = [soArr];
                                            console.log(soArr);
                                            SubmitOrderManager.saveFullContainerException(rows[num].submitOrderUuid,soArr,'turnOff',function(spj){
                                                if(showMsg(spj)){
                                                    console.log('关闭异常成功');
                                                    if(num<rows.length - 1){
                                                        num += 1;
                                                        errLoop(num);
                                                    }
                                                }
                                            });
                                        },1000);
                                    }else{
                                        if(number < spj.object.length - 1){
                                            number+=1;
                                            errMsgLoop(number);
                                        }else{
                                            console.log('没有匹配项')
                                            if(num<rows.length - 1){
                                                num += 1;
                                                errLoop(num);
                                            }
                                        }
                                    }
                                }
                                errMsgLoop(0);
                            })
                        }
                    }
                    errLoop(0);

                })
            }
        });
        $.messager.defaults = { ok: "确定", cancel: "取消" };
    }else if(rows.length==1){
        if(rows[0].transactionStatus !='Cancel'){
            openExceptionDialog(rows[0].submitOrderUuid);
        }else{
            $alertShow("请选择状态为异常的单证！");
        }
    }else{
        $.messager.alert("提示","请选择一份运输单进行操作!","info");
    }
}

//批量新增异常方法
unsafeWindow.plxzyc = function(remark,uuid){//传递执行类型
    var dolList = [{
        aux1: undefined,
        remark: remark,
        rowState: "Added",
        status: undefined,
        workDate: undefined,
        workPerson: undefined
    }];
    SubmitOrderManager.saveFullContainerException(uuid,dolList,'save',function(spj){
        if(showMsg(spj)){
            SubmitOrderManager.exceptionDatagridQuery(uuid,function(spj){
                var list =[];
                list.push(spj.object.pop());
                SubmitOrderManager.saveFullContainerException(uuid,list,'turnOn',function(spj){
                    if(showMsg(spj)){
                        console.log('启动异常成功')
                    }
                })
            })
        }
    });
}

//批量作废订单
function deleteorder(){
    var row = $("#detailgrid").datagrid('getSelections');
    if(row.length > 0){
        $.messager.prompt('敏感操作', '请输入密码', function(b){
            if(b !== "985398"){
                $.messager.alert("提示","密码输入错误!","info");
                return false;
            }else{
                cancelOrder(0);
            }
        });
        //作废订单原函数
        function cancelOrder(indexs){
            var submitOrderUuid =  row[indexs].submitOrderUuid;
            var controlWord = row[indexs].controlWord;
            var transactionStatus = row[indexs].transactionStatus;
            if(!is_null(submitOrderUuid)){
                if(controlWord.charAt(3)!='F'){
                    if(transactionStatus!='Cancel'){
                        SubmitOrderManager.fullContainerCancel(submitOrderUuid,function(spj){
                            if(showMsg(spj)){
                                loopdel(indexs)
                            }
                        });
                    }else{
                        $.messager.alert("提示",+ row[indexs].orderNo +"该订单已作废，不可重复操作!","info");
                        loopdel(indexs);
                    }
                }else{
                    $.messager.alert("提示",+ row[indexs].orderNo +"已完结单证不可作废!","info");
                    loopdel(indexs);
                }
            }else{
                $.messager.alert("提示",+ row[indexs].orderNo +"请确认该单证已保存!","info");
                loopdel(indexs);
            }
            function loopdel(indexs){
                if(indexs < row.length - 1){
                    indexs += 1;
                    cancelOrder(indexs);
                }else{
                    $.messager.alert("提示","执行完毕!","info");
                }
            }
        }
    }
}

//批量删除订单
unsafeWindow.deleteOrder = function(){
    var row = $("#detailgrid").datagrid('getSelected');
    if(!is_null(row)){
        $.messager.confirm('确定框', '确定删除选中行吗?', function(r){
            if(r){
                SubmitOrderManager.deleteFullContainerSubmitOrder(row.submitOrderUuid,function(spj){
                    if(showMsg(spj)){
                        sliderelay("系统提示","数据删除成功！");
                    }
                });

            }
        });
    }else{
        $.messager.alert("提示","请选择要删除的数据!","info");
    }
}





/*--------------------------------datagrid图表统计--------------------------------*/

//Echarts图表汇总
function tubiao(){
    var fruits = $("#detailgrid").datagrid('getData').rows;
    var fruitTotal = []; // 存最终数据结果
    var chehang = [];
    var jindu = [];
    // 数据按照水果名称进行归类
    var nameContainer = {}; // 针对键trailingTeam进行归类的容器
    fruits.forEach(item => {
        nameContainer[item.trailingTeam] = nameContainer[item.trailingTeam] || [];
        nameContainer[item.trailingTeam].push(item);
    });

    // 统计不同种类水果的数量
    var fruitName = Object.keys(nameContainer); // 获取水果种类：["apple", "banana"]
    fruitName.forEach(nameItem => {
        let count = 0;
        let paiche = 0;
        let dadan = 0;
        let tigui = 0;
        let huangui = 0;
        let daocang = 0;
        let shendan = 0;
        let jiedan = 0;
        let shanggui = 0;
        let licang = 0;
        let undadan = 0;
        nameContainer[nameItem].forEach(item => {
            count += 1; // 遍历每种水果中包含的条目计算总数
            if(item.process =="已还柜"){
                huangui += 1
            }else if(item.process =="已提柜"){
                tigui += 1
            }else if(item.process =="已到仓"){
                daocang += 1
            }else if(item.process =="已派车"){
                paiche += 1
            }else if(item.process =="已审单"){
                shendan += 1
            }else if(item.process =="待接单"){
                jiedan += 1
            }else if(item.process =="已上柜"){
                shanggui += 1
            }else if(item.process =="已离仓"){
                licang += 1
            }
            if(item.solAux2 =="Y"){
                dadan += 1
            }else{
                undadan += 1
            }
        });
        switch(nameItem) {
            case '90167':
                nameItem = '鑫佳源'
                break;
            case '90165':
                nameItem = '粤胜通'
                break;
            case '90171':
                nameItem = '捷祥'
                break;
            case '90376':
                nameItem = '友和'
                break;
            case '20158':
                nameItem = '宇鹏'
                break;
            case '90152':
                nameItem = '森茂通'
                break;
            case '90130':
                nameItem = '海纳'
                break;
            case '90268':
                nameItem = '同方'
                break;
            case '20160':
                nameItem = '同方-项目'
                break;
            case '90123':
                nameItem = '金华航'
                break;
            case 'null':
                nameItem = "未派车"
                break;
            default:
                nameItem = '未知车行'
        }
        fruitTotal.push(count);//各个车行订单量
        jindu.push({'Examination':shendan,'orders':jiedan,'onContainer':shanggui,'print': dadan,'unprint':undadan,'assign': paiche,'getContainer': tigui,'arrive': daocang,'leave':licang,'outContainer': huangui})
        chehang.push(nameItem)//各个车行
    });
    var dadanarr = [];var tiguiarr = [];var paichearr = [];var huanguiarr = [];var daocangarr = [];
    var shendanarr = [];var jiedanarr = [];var shangguiarr = [];var licangarr = [];var undadanarr = [];
    $.each(jindu,function(i,item){
        dadanarr.push(item.print);
        paichearr.push(item.assign);
        tiguiarr.push(item.getContainer);
        daocangarr.push(item.arrive);
        huanguiarr.push(item.outContainer);
        shendanarr.push(item.Examination);
        jiedanarr.push(item.orders);
        shangguiarr.push(item.onContainer);
        licangarr.push(item.leave);
        undadanarr.push(item.unprint)
    })
    $('#winchuang').window({
        width:1200,
        height:600,
        modal:true,
        title:'看板',
        collapsible:false,
        minimizable:false,
        draggable:true,
        resizable:false,
        maximizable:false,
    });
    $('#winchuang').window('open');
    var myChart = echarts.init(document.getElementById('winchuang'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '运输订单提派看板',
            subtext: 'AUTHOR WANGJIN',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['订单总量','已审单','已上柜','已打单','未打单','已派车', '已提柜', '已到仓','已离仓', '已还柜']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: chehang
        },
        series: [
            {
                name: '已审单',
                type: 'bar',
                data: shendanarr,
                stack: '处理',
                barWidth: 25,
                color:['#91C7AE']
            },
            {
                name: '待接单',
                type: 'bar',
                data: jiedanarr,
                stack: '处理',
                barWidth: 25,
                color:['#EE6666']
            },
            {
                name: '已上柜',
                type: 'bar',
                data: shangguiarr,
                stack: '处理',
                barWidth: 25,
                color:['#fac858']
            },
            {
                name: '已派车',
                type: 'bar',
                data: paichearr,
                stack: '提派',
                barWidth: 25,
                color:['#73c0de']
            },
            {
                name: '已提柜',
                type: 'bar',
                stack: '提派',
                data: tiguiarr,
                barWidth: 25,
                color:['#d93b3b']
            },
            {
                name: '已到仓',
                type: 'bar',
                stack: '提派',
                data: daocangarr,
                barWidth: 25,
                color:['#EA7CCC']
            },
            {
                name: '已离仓',
                type: 'bar',
                stack: '提派',
                data: licangarr,
                barWidth: 25,
                color:['#9A60B4']
            },
            {
                name: '已还柜',
                type: 'bar',
                stack: '提派',
                barWidth: 25,
                data: huanguiarr,
                color:['#91CC75']
            },
            {
                name: '订单总量',
                type: 'bar',
                data: fruitTotal,
                barWidth: 25,
                color:['#405dd5'],
                label: {
                    show: true,
                    position: 'inside'
                },
                markLine: {
                    lineStyle: {
                        type: 'dashed'
                    },
                    data: [
                        [{type: 'min'}, {type: 'max'}]
                    ]
                }
            },
            {
                name: '已打单',
                type: 'bar',
                data: dadanarr,
                stack: '订单',
                barWidth: 5,
                color: ['#3BA272'],
            },
            {
                name: '未打单',
                type: 'bar',
                data: undadanarr,
                stack: '订单',
                barWidth: 5,
                color: ['#FC8452'],
            },
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//获取派车单分布详情
unsafeWindow.openChart = function(){
    var rows = $("#detailgrid").datagrid('getSelections'); //获取选中
    SubmitOrderManager.queryTransportStatistics(rows[0].submitDate, 'SZWLC', function(spj) {
        if (spj.result) {
            var myDate = new Date();
            var allArr = new Object();
            allArr.trailingTeam1 = [];
            allArr.dpover = [];
            allArr.dpstart = [];
            allArr.orderzl = [];
            allArr.skstart = [];
            allArr.skover = [];
            allArr.overzl = [];
            allArr.sgstart = [];
            allArr.sgover = [];
            GM_setValue('senCarTime',myDate.toLocaleTimeString())
            fbChart(spj.object.pop())
            console.log(spj)
            $.each(spj.object,function(index,newRow){
                switch(newRow.trailingTeam) {
                    case '深圳市鑫佳源物流有限公司':
                        allArr.trailingTeam1.push('鑫佳源');
                        break;
                    case '深圳市粤胜通物流有限公司':
                        allArr.trailingTeam1.push('粤胜通');
                        break;
                    case '深圳市捷祥物流有限公司':
                        allArr.trailingTeam1.push('捷祥');
                        break;
                    case '友和运通（深圳）国际货运代理有限公司':
                        allArr.trailingTeam1.push('友和');
                        break;
                    case '深圳市宇鹏物流有限公司':
                        allArr.trailingTeam1.push('宇鹏');
                        break;
                    case '深圳市森茂通国际物流有限公司':
                        allArr.trailingTeam1.push('森茂通');
                        break;
                    case '90130':
                        allArr.trailingTeam1.push('海纳');
                        break;
                    case '深圳市同方物流有限公司':
                        allArr.trailingTeam1.push('同方');
                        break;
                    case '深圳市同方物流有限公司-项目':
                        allArr.trailingTeam1.push('同方-项目');
                        break;
                    default:
                        console.log('未知车行');
                }
                allArr.dpover.push(newRow.dapenghaiguanQty - newRow.dapenghaiguanUnfinishedQty);//大鹏已完成
                allArr.orderzl.push(newRow.allUnfinishedQty);//未完成总量
                allArr.overzl.push(newRow.allQty - newRow.allUnfinishedQty)//已完成总量
                allArr.dpstart.push(newRow.dapenghaiguanQty);//大鹏已派
                allArr.skstart.push(newRow.shekouhaiguanQty)//蛇口已派
                allArr.sgstart.push(newRow.shenguandachanQty)//深关已派
            })
            pdChart(allArr)

        }
    });
}

//派车单分布
unsafeWindow.fbChart = function(fbarr){
    var myChart = echarts.init(document.getElementById('fbmsg'));
    myChart.setOption({
        tooltip: {
            trigger: 'item'
        },
        series : [
            {
                name: '订单分布',
                type: 'pie',
                radius: ['50%', '80%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                color:['#EE6666','#fac858','#73c0de'],
                data:[// 数据数组，name 为数据项名称，value 为数据项值
                    {value:fbarr.shenguandachanQty, name:'深关大铲'},
                    {value:fbarr.shekouhaiguanQty, name:'蛇口码头'},
                    {value:fbarr.dapenghaiguanQty, name:'大鹏海关'}
                ],
            }
        ]
    })

    //第二个
    var myChart1 = echarts.init(document.getElementById('wgmsg'));
    myChart1.setOption({
        tooltip: {
            trigger: 'item'
        },
        series : [
            {
                name: '完工统计',
                type: 'pie',
                radius: '80%',
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                color:['#fac858','#73c0de'],
                data:[          // 数据数组，name 为数据项名称，value 为数据项值
                    {value:fbarr.allQty - fbarr.allUnfinishedQty, name:'已完成'},
                    {value:fbarr.allUnfinishedQty, name:'未完成'}
                ],
            }
        ]
    })
}

//派车单派单
unsafeWindow.pdChart = function(arrList){
    var myChart = echarts.init(document.getElementById('pdmsg'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '已派订单分布看板',
            subtext: 'AUTHOR WANGJIN',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            orient: 'horizontal',
            x:'right',      //可设定图例在左、右、居中
            y:'top',     //可设定图例在上、下、居中
            padding:[10,30,0,0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
            data: ['订单总量','大鹏海关','蛇口码头','深关大铲']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            nameLocation : 'center',
            fontstyle: 'italic',
            axisTick:{
                interval:'0'
            },
            axisLabel: {
                interval:0,//横轴信息全部显示
                rotate:30,//-30度角倾斜显示
            },
            data: arrList.trailingTeam1
        },
        series: [
            {
                name: '深关大铲',
                type: 'bar',
                data: arrList.sgstart,
                stack: '深关大铲',
                barWidth: 15,
                color:['#EE6666']
            },
            {
                name: '大鹏海关',
                type: 'bar',
                data: arrList.dpstart,
                stack: '大鹏海关',
                barWidth: 15,
                color:['#73c0de']
            },
            {
                name: '蛇口码头',
                type: 'bar',
                stack: '蛇口码头',
                data: arrList.skstart,
                barWidth: 15,
                color:['#fac858']
            },
            {
                name: '订单总量',
                type: 'bar',
                data: arrList.orderzl,
                stack: '订单总量',
                barWidth: 5,
                color: ['#3BA272'],
            },
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//统计做柜
unsafeWindow.allData = function(){
    var datalist = $("#detailgrid").datagrid('getData').rows;
    var dataArr = {};//批次对象
    $.each(datalist,function(index,rows){
        if(!dataArr[rows.batch]){
            dataArr[rows.batch] = {};
            dataArr[rows.batch].num = 1;
            dataArr[rows.batch].tranLess = 0;
            dataArr[rows.batch].tranFull = 0;
            dataArr[rows.batch].err = 0;
            if(rows.isException == "Y"){
                dataArr[rows.batch].err = 1;
            }
            if(rows.priority){
                if(rows.priority == "1"){
                    dataArr[rows.batch].tranLess = 1;
                }else{
                    dataArr[rows.batch].tranFull = 1;
                }
            }
            dataArr[rows.batch].aux2Desc = aux2(rows.aux2Desc);//船司判断（字符：类型）
            dataArr[rows.batch].vesselName = rows.vesselName;
            dataArr[rows.batch].voyage = rows.voyage;
            dataArr[rows.batch].cutDate = rows.cutDate;
            if(GM_getValue(rows.orderNo).line == "1"){
                dataArr[rows.batch].line = "欧线";
            }else{
                dataArr[rows.batch].line = "美线"
            }
            if(rows.containerNo){
                dataArr[rows.batch].tigui = 1;
            }else{
                dataArr[rows.batch].tigui = 0;
            }
            if(rows.solAux1 == "Y"){
                dataArr[rows.batch].yiti = 1;
            }else{
                dataArr[rows.batch].yiti = 0;
            }
        }else{
            if(rows.isException == "Y"){
                dataArr[rows.batch].err = dataArr[rows.batch].err + 1;
            }
            if(rows.priority){
                if(rows.priority == "1"){
                    dataArr[rows.batch].tranLess = dataArr[rows.batch].tranLess + 1;
                }else{
                    dataArr[rows.batch].tranFull = dataArr[rows.batch].tranFull + 1;
                }
            }
            if(rows.solAux1 == "Y"){
                dataArr[rows.batch].yiti = dataArr[rows.batch].yiti + 1;
            }
            dataArr[rows.batch].num = dataArr[rows.batch].num + 1;
            if(rows.containerNo){
                var tigui = dataArr[rows.batch].tigui;
                dataArr[rows.batch].tigui = tigui + 1;
            }
        }
        if(index == datalist.length-1){
            var exebody ="";
            $.each(dataArr,function(ind,vue){
                exebody += "<tr><td>"+vue.aux2Desc+"</td><td>"+ind+"</td><td>"+vue.vesselName+"</td><td>"+vue.voyage+"</td><td>"+vue.cutDate+"</td><td style='text-align:center'>"+vue.line+"</td><td style='text-align:center'>"+vue.err+"</td><td style='text-align:center'>"+vue.tranLess+"</td><td style='text-align:center'>"+vue.tranFull+"</td><td style='text-align:center'>"+vue.yiti+"</td><td style='text-align:center'>"+vue.tigui+"</td><td style='text-align:center'>"+vue.num+"</td></tr>"
            })
            var mailBody = `<style>.tle{background-color: #2196f3;color: #fff;}.tle td{width:104pt;}.tableList td{font-size: 16px;}.tableList th{border:0;height: 30px; font-size: 14px; font-weight: unset;}</style><table class="tableList" border="1" cellspacing="0"><tbody><th align="center" colspan="12">当前页做柜统计表</th><tr class="tle"><td style="width:70px">船公司</td><td style="width:130px">批次</td><td style="width:200px">船名</td><td style="width:100px">航次</td><td style="width:170px">截重</td><td style="text-align:center;width:70px">航线</td><td style="text-align:center;width:70px">异常</td><td style="text-align:center;width:70px">纯重</td><td style="text-align:center;width:70px">空上</td><td style="text-align:center;width:70px">异提</td><td style="text-align:center;width:70px">提柜</td><td style="text-align:center;width:70px">总数</td></tr>`+exebody+`</tbody></table>`;
            $("#emailBody").html(mailBody);
            $('#beforEmail').dialog('open');
        }
    })
}




/*--------------------------------datagrid表格复制--------------------------------*/

//多SO复制
function copy(){
    $.messager.confirm('系统提示', '是否按船公司复制？', function(b){
        var xuanzhong = $("#detailgrid").datagrid('getSelections');
        var str = ""
        var Shipping = ""
        var ccc = "";
        if(xuanzhong.length>0){
            if(b){
                $.each(xuanzhong,function(index,row){
                    if(Shipping == ""){
                        Shipping = row.aux2Desc;
                        str = row.orderNo;
                    }else{
                        if(Shipping == row.aux2Desc){
                            str = row.orderNo + "," + str;
                        }else{
                            ccc = "true";
                        }
                    }
                })
                str = str + "," +Shipping
                GM_setClipboard(str)
                if(ccc == "true"){
                    sliderelay(""+ Shipping +"","<font size='4' color='red'>船公司存在不一致，已完成复制！</font>");
                }else{
                    sliderelay(""+ Shipping +"","<font size='4' color='red'>所有选中的SO</font>复制成功！");
                }
            }else{
                $.each(xuanzhong,function(index,row){
                    if(index == xuanzhong.length - 1){
                        str += row.orderNo;
                    }else{
                        str += row.orderNo + "," ;
                    }

                })
                GM_setClipboard(str);
                sliderelay("系统提示","所有选中的SO复制成功！");
            }
        }
    });
}

//复制补料信息
function copyBl(){
    var xuanzhong = $("#detailgrid").datagrid('getSelections');
    var str = "SO号\t柜号\t封号\t车牌\t皮重\t货重\t柜型\t截重时间"+'\n'
    if(xuanzhong.length>0){
        for(var z = 0; z < xuanzhong.length; z++){
            str += xuanzhong[z].orderNo + "\t" + xuanzhong[z].containerNo + '\t' +xuanzhong[z].sealNo + '\t' + xuanzhong[z].doTractorNo + '\t' +xuanzhong[z].tareWeight + "\t" + xuanzhong[z].grossWeight + '\t'+ xuanzhong[z].containerType + '\t'+ xuanzhong[z].cutDate +'\n';
            //str += 'SO号:'+ xuanzhong[z].orderNo + ",柜号:" + xuanzhong[z].containerNo + ',封号:' +xuanzhong[z].sealNo + ',皮重:' +xuanzhong[z].tareWeight + '\n';
            //str += 'SO号:'+ xuanzhong[z].orderNo + ",柜号:" + xuanzhong[z].containerNo + ',货重:' +xuanzhong[z].grossWeight + '\n';
            //str += xuanzhong[z].containerNo + ','
        }
        GM_setClipboard(str);
        sliderelay("系统提示","所有选中复制补料成功！");
    }else{
        sliderelay("系统提示","请至少选中一条数据！");
    }
}

//复制绑单
function copyGh(){
    var xuanzhong = $("#detailgrid").datagrid('getSelections');
    var str = ""
    if(xuanzhong.length){
        $.each(xuanzhong,function(index,row){
            if(row.isRelateTrans == "是"){
                $.messager.alert("提示",row.orderNo + "已绑定E单！","info");
            }
            if(index == xuanzhong.length - 1){
                str = str + row.orderNo + "," + row.submitOrderNo;
            }else{
                str = str + row.orderNo + "," + row.submitOrderNo + ";";
            }
        })
        GM_setClipboard(str);
        sliderelay("系统提示","所有选中的绑单信息复制成功！");
    }
}




/*--------------------------------datagrid-footer统计--------------------------------*/

//datagrid表格底部数据统计
function footSensus(){
    $('#tabsId').append(`<div id="footer" style="position: fixed;right: 120px;color:red;bottom: 3px;height: 30px; line-height: 30px; font-size: 12px;" >
    <div id="footSmg" style="display: inline;">
        <li style="color:#ee6666;margin-right:20px;display:inline" onclick="queryData(\'Y\',\'yc\')" id="yichang">异常:</li>
        <li id="chuli" onclick="queryData(null,\'cl\')" style="color:red;margin-right:20px;display:inline">待处理:</li>
        <li id="dadan" onclick="queryData(\'Y\',\'dd\')" style="color:#91cc75;margin-right:20px;display:inline">已打单:</li>
        <li id="zaitu" onclick="queryData(\'已派车\',\'zt\')" style="margin-right:20px;color:#ea7ccc;display:inline">在途:</li>
        <li id="tigui" onclick="queryData(\'已提柜\',\'zt\')" style="margin-right:20px;color:#9a60b4;display:inline">已提柜:</li>
        <li id="daocang" onclick="queryData(\'√\',\'dc\')" style="margin-right:20px;color:#5470c6;display:inline">已到仓:</li>
        <li id="licang" onclick="queryData(\'已离仓\',\'zt\')" style="margin-right:20px;color:#fc8452;display:inline">已离仓:</li>
        <li id="huangui" onclick="queryData(\'已还柜\',\'zt\')" style="margin-right:20px;color:#3ba272;display:inline">已还柜:</li>
        <li id="bendi" onclick="loadDatalist()" style="margin-right:20px;color:#3ba272;display:inline">本地数据:</li>
    </div>
        <li id="jishu" style="margin-right:20px;color:red;display:inline"></li>
    </div>`);
}

//统计
unsafeWindow.tongji = function(){
    var a = $("#detailgrid").datagrid('getData').rows;
    var arrList = {};
    var b,c,d,e,f,g,h,i,j;
    b = ['已派车'];c = ['Y'];d = ['已提柜'];e = ['√'];f = ['已离仓'];g = ['已还柜'];i = ['Y'];h = ['待处理'];j = [null];
    var paiche = a.filter(item => { return b.includes(item.process); });
    var dadan = a.filter(item => { return c.includes(item.solAux2); });
    var tigui = a.filter(item => { return d.includes(item.process); });
    var daocang = a.filter(item => { return e.includes(item.ruChang); });
    var licang = a.filter(item => { return f.includes(item.process); });
    var huangui = a.filter(item => { return g.includes(item.process); });
    var yichang = a.filter(item => { return i.includes(item.isException); });
    var chuli = a.filter(item => { return h.includes(item.process); });
    var paidan =a.filter(item => { return j.includes(item.deliveryOrderUuid); });
    $('#zaitu').text('派车：'+ paiche.length)
    $('#dadan').text('打单：'+ dadan.length + '/' + a.length)
    $('#tigui').text('提柜：'+ (tigui.length + licang.length + huangui.length))
    $('#daocang').text('在仓：'+ (daocang.length - licang.length - huangui.length))
    $('#licang').text('离仓：'+ licang.length);
    $('#huangui').text('还柜：'+ huangui.length);
    $('#yichang').text('异常：'+ yichang.length);
    $('#chuli').text('待处理：'+ paidan.length);
    if(GM_getValue("querydata")){
        $("#bendi").text("本地数据：" + GM_getValue("querydata").total);
    }
}

//点击执行footer执行本地筛选
unsafeWindow.queryData = function(parameter,fild){
    var aim = $("#detailgrid").datagrid('getData').rows;
    var arrList,dataType;
    switch(fild) {
        case 'yc':
            arrList = aim.filter(item => item.isException == parameter);
            dataType = "异常";
            break;
        case 'zt':
            arrList = aim.filter(item => item.process == parameter);
            dataType = "已派车";
            break;
        case 'dd':
            arrList = aim.filter(item => item.solAux2 == parameter);
            dataType = "已打单";
            break;
        case 'dc':
            arrList = aim.filter(item => item.ruChang == parameter);
            dataType = "到仓";
            break;
        case 'cl':
            arrList = aim.filter(item => item.deliveryOrderUuid == parameter);
            dataType = "待处理";
            break;
        default:
            console.log('操作异常')
    }

    var aimArr = {total:aim.length,rows:aim}
    GM_setValue('saveArr',aimArr);
    console.log( GM_getValue('saveArr'))
    $('#detailgrid').datagrid('loadData',{total:aim.length,rows:arrList});
    $('#footSmg').html('<li id="detj" onclick="deltj()" style="padding:0 3px;border:1px solid red;margin-right:20px;color:red;display:inline">当前选中：'+dataType+'× 点击取消</li>');
}

//点击取消，删除保存的数据
unsafeWindow.deltj = function(){
    $('#footer').remove();
    footSensus();//添加底部统计
    tongji();

    $('#detj').remove();
    var ccc = GM_getValue('saveArr');
    if(ccc){
        GM_deleteValue('tongji');
        $('#detailgrid').datagrid('loadData',ccc);
        GM_deleteValue('saveArr');
    }else{
        query();
    }
}

//获取选中条数
function jishu(){
    var rows = $("#detailgrid").datagrid('getSelections');
    var wenben = $("#jishu").prevAll("pagination-info");
    var jishuid = $('#jishu').length;
    if(jishuid){
        if(!rows.length){
            $('#jishu').text('');
        }else{
            $('#jishu').text('已选中'+rows.length+'条数据');
        }
    }else{
        $('#jishu').text('');
    }
}




/*--------------------------------派单--------------------------------*/

//派单·显示运输公司
function showTrailingTeam(customerCodes){
    $("#sendCar_trailingTeam").combogrid("setQueryFields",[
        {
            fieldName:'customerCodes',
            fieldValue:customerCodes
        }
    ]);
    setTimeout(function(){
        $("#sendCar_trailingTeam").combo("showPanel");
        $("#sendCar_trailingTeam").combo("hidePanel");
        setTimeout(function(){
            var customerCodeList = $("#sendCar_trailingTeam").combogrid("grid").datagrid("getData").rows;
            if(customerCodeList.length == 1){
                $("#sendCar_trailingTeam").combogrid("setValue", customerCodeList[0].customerCode);
            }else{
                $("#sendCar_trailingTeam").combogrid("setValue", "");
            }
        },300);
    },200);
}

//派单事件
function sendCarDo() {
    var rows = $("#detailgrid").datagrid('getSelections'); //获取选中
    if (rows.length > 0) {
        var str = "";
        var ctrSize = 0;
        $.each(rows, function(index, row) {
            if (!is_null(row.containerType)) {
                ctrSize += parseInt(row.containerType.substr(0, 2));
            }
            if (rows[0].deliveryType != row.deliveryType) {
                str = "选中订单所属运输类型不一致，不可派单！";
            }
            if (row.transactionStatus != 'Active') {
                str = "选中订单尚未生效，不可派单！";
            }
            if (rows[0].deliveryOrderUuid != row.deliveryOrderUuid) {
                str = "所属派车单不一致，不可派单！";
            }
        });
        if (!is_null(str)) { //如果存在提示，则输出提示
            $.messager.alert("提示", str, "info");
        } else {
            if(GM_getValue('senCarTime')){
                $('#openChart').linkbutton({
                    text: '派车详情 <em style="color:red">上次更新时间:'+GM_getValue('senCarTime')+'</em>'
                });
            }
            //孖柜时显示第二柜信息
            if (rows.length > 1) { //如果选择的订单大于1
                $.messager.prompt('批量派单', '请输入运输公司客户代码:', function(r){
                    if (r){
                        var changdu = rows.length - 1;
                        plsenCar(changdu,r)
                    }
                    //批量派单执行事件
                    function plsenCar(indexs,yunshu){
                        var CH = yunshu;//运输公司代码
                        var action;
                        var rows = $("#detailgrid").datagrid('getSelections');
                        var formArr = {};
                        formArr.aux4 = null;//海关编码
                        formArr.boxWeight = rows[indexs].boxWeight;//箱子限重
                        formArr.contactTel = rows[indexs].doContactTel;//司机电话
                        formArr.containerNo = rows[indexs].containerNo;//柜号
                        formArr.containerNo2 = null;//第二条柜子柜号
                        formArr.containerType = rows[indexs].containerType;//柜型
                        formArr.containerType2 = null;//第二条柜子柜型
                        formArr.direction = rows[indexs].direction//还柜地点
                        formArr.docTarWweight = rows[indexs].tareWeight//皮重
                        formArr.driverName = rows[indexs].doDriverName;//司机
                        formArr.isTransfer = 'N';//是否甩挂
                        OptionControlManager.isControl("MS_INHOUSE_ORDER", null, 'SZWLC',function(b){
                            if(b==true){
                                formArr.isTransfer = 'Y';
                                action = "DispatchCar";
                            }
                        });
                        formArr.remark = rows[indexs].remark;//备注
                        formArr.sealNo = rows[indexs].sealNo;//封号
                        formArr.sealNo2 = null;//第二柜封号
                        formArr.sendCarFlow = rows[indexs].flow;//提柜地点
                        formArr.soUuid = rows[indexs].submitOrderUuid;//uuid
                        formArr.tractorNo = rows[indexs].doTractorNo;//车牌
                        formArr.trailingTeam = yunshu;//车行
                        console.log(formArr)
                        var soUuids = new Array();
                        soUuids.push(rows[indexs].submitOrderUuid);
                        if(is_null(rows[indexs].deliveryOrderUuid)){//判断是否有派单，如果有派单则不执行
                            SubmitOrderManager.FullContainerSendCar(soUuids,formArr,action,function(spj){
                                if(showMsg(spj)){
                                    if(indexs>0){
                                        indexs -= 1;
                                        plsenCar(indexs,yunshu)
                                    }else if(indexs == 0){
                                        datagirdReaload("detailgrid");
                                        reload();
                                    }
                                }
                            });
                        }
                    }
                });
                document.getElementById("dcnDiv").style.display = 'inline'; //设置在一行显示
                document.getElementById("dctDiv").style.display = 'inline'; //设置在一行显示
                document.getElementById("dsnDiv").style.display = 'inline'; //设置在一行显示
            }else{
                $("#sendCarForm").form('clear'); //清除派车弹窗表格内容
                $('#sendCarDialog').dialog({
                    draggable: true,
                    modal: true
                }).dialog('open'); //打开派车弹窗界面
                var remark = ""; //声明备注为空
                $("#sendCarSoUuid").val(rows[0].submitOrderUuid); //设置SOuuid
                setTimeout(function() {
                    $("#sendCar_trailingTeam").combogrid('setValue', rows[0].trailingTeam);
                }, 600);
                if (!is_null(rows[0].deliveryOrderUuid)) { //判断派车单号UUID是否为空,有则执行
                    $("#sendCar_tractorNo").combogrid("setValue", rows[0].doTractorNo); //获取订单列表的车牌写入派单表
                    $("#aux4").val(rows[0].doAux4); //整柜订单没有海关编码字段
                    $("#driverName").val(rows[0].doDriverName); //司机
                    $("#contactTel").val(rows[0].doContactTel); //司机电话
                    $("#doSealNo").val(rows[0].sealNo); //封条号
                    $("#doContainerNo").val(rows[0].containerNo); //柜号
                    $("#docTarWweight").val(rows[0].tareWeight); //皮重
                    $("#boxWeight").val(rows[0].boxWeight); //箱子限重
                    $("#sendCarFlow").combogrid('setValue', rows[0].flow); //提柜地点
                    $("#direction").combogrid('setValue', rows[0].direction); //还柜地点
                    $("#doContainerType").combogrid('setValue', rows[0].containerType); //柜型
                    $("#sendCar_trailingTeam").combogrid('setValue', rows[0].trailingTeam); //运输公司
                    remark = is_null(rows[0].doRemark) ? "" : rows[0].doRemark; //判断派车单备注是否为空，是则保留，否则为空
                    $("#doRemark").val(remark);
                    OptionControlManager.isControl("MS_INHOUSE_ORDER", null, 'SZWLC', function(b) { //获取甩挂数据
                        if (b == true) {
                            console.log(MS_INHOUSE_ORDER)
                            $("#isTransfer").combobox('select', 'Y');
                        }
                    });
                }else{
                    setTimeout(function() {
                        $("#isTransfer").combobox('select', 'N'); //是否甩挂,默认为否
                        remark += (is_null(rows[0].remark) ? "" : rows[0].remark + ";"); //取运输订单备注，写入至派车单备注+‘;’
                        $("#doRemark").val(remark);
                        $("#doContainerType").combogrid('setValue', rows[0].containerType); //柜型
                        $("#sendCarFlow").combogrid('setValue', rows[0].flow); //提柜地点
                        $("#direction").combogrid('setValue', rows[0].direction); //还柜地点
                    }, 600);
                }
                document.getElementById("dcnDiv").style.display = 'none'; //设置隐藏
                document.getElementById("dctDiv").style.display = 'none'; //设置隐藏
                document.getElementById("dsnDiv").style.display = 'none'; //设置隐藏
                $("#doRemark").val(remark); //设置派车弹窗备注为remark的值
                if(!GM_getValue('pdChart')){//是否开启派车详情表格
                    SubmitOrderManager.queryTransportStatistics(rows[0].submitDate,'SZWLC',function(spj){
                        if(spj.result){
                            $.each(spj.object,function(index,newRow){
                                $("#transportStatisticsDatagrid").datagrid("loadData",{total:spj.object.length,rows:spj.object});
                            });
                            //$("#transportStatisticsDatagrid").datagrid('loadData',spj.object);
                        }
                    });
                }

            }
        }
    } else {
        $.messager.alert("提示", "你还没有选择单证", "info");
    }
}

//单一派单功能，弹窗点击保存按钮
function sendCar(action){
    var rows = $("#detailgrid").datagrid('getSelections');
    var sendCarForm = $("#sendCarForm").form("getData");
    sendCarForm.trailingTeamDesc = $("#sendCar_trailingTeam").combogrid("getText");
    if('Y'==sendCarForm.isTransfer){
        action = "DispatchCar";
    }
    if(rows.length>0){
        if(getFormValid("sendCarForm")){
            var str="";
            var soUuids = new Array();
            $.each(rows,function(index,row){
                soUuids.push(row.submitOrderUuid);
                if(rows[0].deliveryOrderUuid!=row.deliveryOrderUuid){
                    str="选中项的所属派车单不一致，不可派单！";
                }
            });
            if(is_null(str)){
                if(is_null(rows[0].deliveryOrderUuid)){
                    SubmitOrderManager.FullContainerSendCar(soUuids,sendCarForm,action,function(spj){
                        if(showMsg(spj)){
                            $('#sendCarDialog').dialog({draggable:true,modal:true}).dialog('close');
                            datagirdReaload("detailgrid");
                            return true
                        }
                    });
                }else{
                    SubmitOrderManager.fullContainerSaveSendCar(rows[0].deliveryOrderUuid,soUuids,sendCarForm,action,function(spj){
                        if(showMsg(spj)){
                            $('#sendCarDialog').dialog({draggable:true,modal:true}).dialog('close');
                            datagirdReaload("detailgrid");
                        }
                    });
                }
            }else{
                $.messager.alert("提示",str,"info");
            }
        }else{
            $alertShow("请输入必填项！");
        }
    }else{
        $.messager.alert("提示","请选择要操作的数据!","info");
    }
}

//车牌互带修复
function carCodeKeep(){
    $("#sendCar_tractorNo").combogrid({
        onSelect:function(index,data){
            //选择车牌号后带出司机、联系电话信息
            var driverName = $("#driverName").val();
            var contactTel = $("#contactTel").val();
            if(is_null(driverName)){
                $("#driverName").val(data.aux2);
            }
            if(is_null(contactTel)){
                $("#contactTel").val(data.aux1);
            }
            //选择车牌号后带出运输公司
            dwr.engine.setAsync(false);
            var customerCodes = new Array();
            if(!is_null(data.vehicleNo)){
                SubmitOrderManager.queryTrailingTeamOfContactTel(data.vehicleNo,function(spj){
                    if(spj.result){
                        $.each(spj.object,function(index,row){
                            customerCodes.push(row.customerCode);
                        });
                    }
                });
                if(is_null(customerCodes)){
                    customerCodes.push(data.customerCode);
                }
                showTrailingTeam(customerCodes);
            }else{
                showTrailingTeam(customerCodes);
            }
            dwr.engine.setAsync(true);
        },onChange:function(newValue,oldValue){
            //选择车牌号后带出运输公司·解决运输行错误问题
            console.log('xin:'+newValue)
            console.log("lao:"+oldValue)
        }
    });
}




/*--------------------------------系统提示信息--------------------------------*/
function sliderelay(title,msg) {
    $.messager.show({
        id: 'ceshi',
        title: title,
        msg: msg,
        timeout: 2000,
        showType: 'slide'
    });
}




/*--------------------------------附件上传--------------------------------*/

//上传文件测试
function fileUpdate(){
    return;
    Dropzone.options.dropzoneForm = {
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        autoProcessQueue : true,// 如果为false，文件将被添加到队列中，但不会自动处理队列。
        uploadMultiple : true, // 是否在一个请求中发送多个文件。
        parallelUploads : 3, // 并行处理多少个文件上传
        //maxFiles : 3, // 用于限制此Dropzone将处理的最大文件数
        accept: function(file, done) {
            console.log(file);
            if (file.name != "justinbieber.jpg") {
                done();//如果 done 函数调用无参数,文件会被处理。如果你在 done 函数中传入了参数(比如错误信息)文件将不会被上传。如果文件太大或不匹配的mime类型这个函数不会调用。
            }else {
                done();
            }
        }
    };

    $("#dropzoneForm").dropzone({
        init: function() {
            this.on("addedfile", function(file) {
                console.log(file)
            });
        }
    });
}




/*--------------------------------菜单组设置参数--------------------------------*/

//系统菜单组设置
function menuSet(){
	//点击菜单设置查询条件
	GM_registerMenuCommand("设置查询条件",function(){
		$('#setting').dialog('open');
		if(GM_getValue('condition')){
			var canshu = GM_getValue('condition');
			$('#state').val(canshu.state);
			$('#type').val(canshu.type);
			$('#customer').val(canshu.customer);
			$('#pages').val(canshu.pages);
			$('#shipping').val(canshu.shipping);
			$('#cars').val(canshu.cars);
		}
	});

	//开关派车单图表
	if(GM_getValue('pdChart')){
		GM_registerMenuCommand("关闭派单图表",function(){
			GM_deleteValue('pdChart')
			$.messager.alert("提示", '保存成功,请刷新网页！', "info");
		});
	}else{
		GM_registerMenuCommand("开启派单图表",function(){
			GM_setValue('pdChart',true)
			$.messager.alert("提示", '保存成功,请刷新网页！', "info");
		});
	}
}

//设置查询条件
unsafeWindow.submitSet1 = function(){
    var parameter = {};
    parameter.state = $('#state').val();
    parameter.type = $('#type').val();
    parameter.customer = $('#customer').val();
    parameter.pages = $('#pages').val();
    parameter.shipping = $('#shipping').val();
    parameter.cars = $('#cars').val();
    GM_setValue('condition',parameter);
    $('#setting').dialog('close');
    $.messager.alert("提示", '保存成功！', "info");
}

//删除查询条件
unsafeWindow.resetquery = function(){
    GM_deleteValue('condition')
    $('#setting').dialog('close');
    $.messager.alert("提示", '删除成功', "info");
}

//查询区带入数据
unsafeWindow.formSet = function(){
    var queryData = $("#formQuery").form("getData");
    $('#state').val(queryData.transactionStatus);
    $('#type').val(queryData.deliveryType);
    $('#customer').val(queryData.agentConsigneeCode);
    $('#pages').val('');
    $('#shipping').val(queryData.aux2);
    $('#cars').val(queryData.trailingTeam);
}

//自动设置查询条件
function autoQuery(){
    if(GM_getValue('condition')){
        var canshu = GM_getValue('condition');
        setTimeout(function(){
            $("#deliveryType").combobox('setValue',canshu.type);
            $("#orderNo").val("")
            $('#dateType').combobox('setValue', 'submitDate');
            $('#agentConsigneeCode').combogrid('setValue',canshu.customer);
            $("#transactionStatus").combobox('setValue',canshu.state);
            $("#dateEnd").datetimebox('setValue', dateAdd("end",0));
            $("#dateBegin").datetimebox('setValue',dateAdd("begin",0));
            $('#trailingTeam').combogrid('setValue',canshu.cars);
            $('#aux2').combogrid('setValue',canshu.shipping);
        },1000)
    }
}









/*--------------------------------获取易运物流还柜状态--------------------------------*/



unsafeWindow.huangui = function(sendMail){
    var rows = $("#detailgrid").datagrid('getSelections');
    if(rows.length>0){
        if(!sendMail){
            var check = true;
            $.each(rows,function(index,row){
                if(!row.containerNo){
                    check = false;
                    $.messager.alert("提示","请至少选择一条数据","info");
                    return false;
                }
            })
        }
        loopSubmit(0,sendMail);
        var arrData = [];
        async function loopSubmit(index,sendMail){
            var rows = $("#detailgrid").datagrid('getSelections');
            var tigdd = rows[index].flowName;
            if(tigdd.substring(tigdd.length-2) != "码头"){
                if(sendMail){
                    charging();
                }
                return false;
            }
            let orti = await get_156yt(rows[index].containerNo);//
            if(!orti){
                $.messager.confirm('警告','柜号：'+rows[index].containerNo+"点击确认更新缓存！",function(r){
                    if (r){
                        unsafeWindow.open("https://www.156yt.cn/pqs_revision/pages/jsp/popuPublic.jsp", 'hello');
                    }
                });
                return;
            }
            var type = 'giveBack';
            var ContainerNature = orti.集装箱性质;
            var timeType = orti.街车出闸时间;
            console.log("时间："+timeType);
            var carCode = orti.车牌号;
            var containerType = orti.尺寸类型.substring(0,4);
            var orderNo = orti.订舱号;
            if(orderNo.indexOf(rows[index].orderNo) == -1){
                alert('请检查柜号与SO是否匹配')
                return;
            }
            var giveTime,giveBackTime,sendData;
            ContainerNature = ContainerNature.substr(0,ContainerNature.length - 4);//去除括号内容
            switch(ContainerNature){
                case "已被提空箱":
                    ContainerNature = "已提空";
                    giveTime = timeType;
                    break;
                case "出口重柜":
                    ContainerNature = "已还柜"
                    giveBackTime = timeType;
                    break;
                default:
                    console.log('异常：未匹配到'+ContainerNature)
                    break;
            }

            sendData = '&containerType='+rows[index].containerType+'&so='+rows[index].orderNo+'&status='+ContainerNature+'&loadingProcess='+rows[index].loadingProcess+'&type='+type;
            if(giveTime){
                sendData = sendData + '&giveTime='+ giveTime;
            }else if(giveBackTime){
                sendData = sendData + '&giveBackTime='+ giveBackTime+'&carCode='+carCode;
            }
            sendData = arrData.push(sendData);
            if(index == rows.length - 1){
                if(sendMail){
                    console.log(sendMail)
                    updataOut(arrData,0,sendMail)
                }else{
                    updataOut(arrData,0)
                }
                return;
            }else{
                index += 1;
                if(sendMail){
                    console.log(sendMail)
                    loopSubmit(index,sendMail);
                }else{
                    loopSubmit(index);
                }
            }
        }
    }else{
        $.messager.alert("提示","请至少选择一条数据","info");
    }

}

unsafeWindow.updataOut = async function(arrData,index,sendMail){
    console.log(arrData);
    var msgCode = await ydsjyz('http://kc.bihushow.cn/test/orderlist-api.php',arrData[index],'write');
    console.log(msgCode);
    if(msgCode){
        if(index == arrData.length - 1){
            console.log(sendMail)
            if(sendMail){
                charging();
            }
        }else{
            index += 1;
            updataOut(arrData,index,sendMail);
        }
    }
}

unsafeWindow.get_156yt = function (containerNo){
    const p = new Promise((resolve, reject) => {
        var url = "https://www.156yt.cn/pqs_revision/pages/jsp/popuPublic.jsp?querycontid=querycontid&cont_id="+containerNo;
        var timeout = parseInt(new Date().getTime()/1000);//获取时间戳
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://www.156yt.cn/pqs_revision/pages/jsp/popuPublic.jsp',
            },
            onload: function(data) {
                console.log(data);
                var dataText = data.responseText;
                var check = dataText.indexOf("查询结果")
                console.log(check);
                if(check == -1){
                    resolve(false);
                    return;
                }
                var str = dataText.substring(4959)//从2221开始取2187位字符串
                str = str.substr(0,str.length - 2200);
                str = str.replace(/\r\n/g,"");
                str = str.replace(/\t/g,"");
                str = str.replace(/&nbsp;/g,"");
                str = str.replace(/ /g,"");
                str = str.replace(/’/g,"");
                str = str.replace(/\'/g,"");
                str = str.replace(/<\/table><\/div><divclass="jzDetailsjzDetails_js"><ul>/g,"|");
                str = str.split("|");
                str = str[0].replace(/<\/td>/g,"@");
                str = str.replace(/<[^>]+>/g,"");
                str = str.replace(/：/g,"");//冒号替换为空
                str = str.replace(/说明/g,"");//说明替换为空
                str = uncode(str);//转换编码
                str = str.split("@");
                var obj ={};
                $.each(str,function(index,row){
                    if(index == str.length - 1){
                        console.log(obj)
                        resolve(obj);
                        return false;
                    }else{
                        if(index && index%2 == 0){
                            var objTit = str[index-2];
                            var val = str[index-1];
                            if(objTit == "到达码头时间" || objTit == "最近一次收到海关放行条时间" || objTit == "海关发送放行指令时间" || objTit == "码头收到海关放行指令时间" || objTit == "街车入闸时间" || objTit == "街车出闸时间"){
                                val = formatTime(val)
                            }
                            obj[objTit] = val;
                        }
                    }
                })
            }
        });
    })
    return p;
}

//格式化时间
function formatTime(str){
    var newStr = str.slice(0, 10) + " " + str.slice(10);
    return newStr;
}

//编码转换
function uncode(str) {
    return str.toString().replace(/&#(x)?([^&]{1,5});?/g, function (a, b, c) {
        return String.fromCharCode(parseInt(c, b ? 16 : 10));
    });
}

//获取cookie
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return null;
    }
}

//写入COOKIE
function setCookie(name,value){
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//删除cookie
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null){
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
}



/*--------------------------------时间戳转换方法--------------------------------*/
function formatDateTime(inputTime,type) {
    var date = new Date(inputTime*1);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if(type == "hm"){
        return h+':'+minute;
    }else if(type == "ymd"){
        return y + '-' + m + '-' + d;
    }else if(type == "md"){
        return m + '-' + d;
    }else{
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    }
};

