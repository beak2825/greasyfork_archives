// ==UserScript==
// @name        大模型生单训练数据收集
// @icon         http://www.studstu.com/fximg/delicious.gif
// @namespace    wenqindong.top
// @version      1.1.5
// @description  收集生单期望数据格式
// @author       wenqd
// @include      http://hxczy.aisino.cs/*
// @match        http://hxczy.aisino.cs/*
// @run-at       document-end
// @require      https://cdn.bootcss.com/vue/2.6.10/vue.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @grant        unsafeWindow
// @compatible   chrome OK
// @compatible   firefox OK
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489625/%E5%A4%A7%E6%A8%A1%E5%9E%8B%E7%94%9F%E5%8D%95%E8%AE%AD%E7%BB%83%E6%95%B0%E6%8D%AE%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/489625/%E5%A4%A7%E6%A8%A1%E5%9E%8B%E7%94%9F%E5%8D%95%E8%AE%AD%E7%BB%83%E6%95%B0%E6%8D%AE%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

var $ = unsafeWindow.$;

//======== 函数区,不要修改 ========
//--- 添加贴子翻页监听
function createDom(){
    var buttonDom = "<div id='autoform' style='position:absolute;right:234px;z-index:9999;top:6px;background-color:#0bb1cc;padding:8px;font-size:13px;border-radius:4px;cursor:pointer;color:#fff;'>获取大模型生单格式数据<div>"
var vueDom="";
vueDom += "<div id=\"appvue\">";
vueDom += "    <el-drawer title=\"获取大模型生单格式数据\" size=\"70%\" :visible.sync=\"drawer\">";
vueDom += "        <div>";
vueDom += "            <el-card lass=\"box-card\" style=\"width: 100%;margin: 10px;\">";
vueDom += "                <el-row>";
vueDom += "                  <el-col :span=\"24\">";
vueDom += "                    <el-form :inline=\"true\" :model=\"form\" label-position=\"right\" label-width=\"100px\">";
vueDom += "                        <el-form-item label=\"用户名\">";
vueDom += "                            <el-input v-model=\"form.username\" placeholder=\"请输入用户名\" style=\"width: 150px;\"><\/el-input>";
vueDom += "                        <\/el-form-item>";
vueDom += "                        <el-form-item label=\"日期\">";
vueDom += "                            <el-date-picker v-model=\"form.date\" type=\"date\" placeholder=\"选择日期\"><\/el-date-picker>";
vueDom += "                        <\/el-form-item>";
vueDom += "                        <el-form-item label=\"\">";
vueDom += "                            <el-button type=\"primary\" size=\"mini\" @click=\"getUserData\">获取工时数据<\/el-button>";
vueDom += "                        <\/el-form-item>";
vueDom += "                    <\/el-form>";
vueDom += "                  <\/el-col>";
vueDom += "                  <el-col :span=\"20\">";
vueDom += "                    <el-row :gutter=\"20\" class=\"result-area\">";
vueDom += "";
vueDom += "                        <el-col :span=\"8\">";
vueDom += "                          <div>";
vueDom += "                            <el-statistic title=\"工作日天数\">";
vueDom += "                              <template slot=\"formatter\">";
vueDom += "                                {{countWorkdays}}";
vueDom += "                              <\/template>";
vueDom += "                            <\/el-statistic>";
vueDom += "                          <\/div>";
vueDom += "                        <\/el-col>";
vueDom += "                        <el-col :span=\"8\">";
vueDom += "                            <div>";
vueDom += "                              <el-statistic title=\"总工时\">";
vueDom += "                                <template slot=\"formatter\">";
vueDom += "                                  {{taskHours}}";
vueDom += "                                <\/template>";
vueDom += "                              <\/el-statistic>";
vueDom += "                            <\/div>";
vueDom += "                          <\/el-col>";
vueDom += "                          <el-col :span=\"8\">";
vueDom += "                            <div>";
vueDom += "                              <el-statistic title=\"日均工时\">";
vueDom += "                                <template slot=\"formatter\">";
vueDom += "                                  {{aveTime}}";
vueDom += "                                <\/template>";
vueDom += "                              <\/el-statistic>";
vueDom += "                            <\/div>";
vueDom += "                          <\/el-col>";
vueDom += "                      <\/el-row>";
vueDom += "                  <\/el-col>";
vueDom += "                <\/el-row>";
vueDom += "            <\/el-card>";
vueDom += "            <el-card>";
vueDom += "                <el-table :data=\"tableData\" style=\"width: 100%\">";
vueDom += "                    <el-table-column prop=\"date\" label=\"日期\"><\/el-table-column>";
vueDom += "                    <el-table-column prop=\"hours\" label=\"工时\"><\/el-table-column>";
vueDom += "                    <el-table-column prop=\"names\" label=\"任务\"><\/el-table-column>";
vueDom += "                <\/el-table>";
vueDom += "            <\/el-card>";
vueDom += "        <\/div>";
vueDom += "    <\/el-drawer>";
vueDom += "<\/div>";


    var panelDom = "<div id='zentaoPanel'>"
    +vueDom
    +"<div>"
    $("body").append(buttonDom);
    $("body").append(panelDom);
    $("#autoform").click(function(){
        //$("#zentaoPanel").show()
       // appvue.drawer = true
        getFormData()
    })
    $("#close").click(function(){
        $("#zentaoPanel").hide()
    })
    $("#printTasks").click(function(){
        zentao.printTasks()
    })
    setTimeout(function(){
        // 初始化 Vue 实例
        unsafeWindow.appvue = new Vue({
            el: '#appvue',
            data() {
                return {
                    drawer:false,
                    form:{
                        username:'',
                        date:''
                    },
                    // 表格数据
                    tableData: [
                    ],
                    pickerOptions: {
                        shortcuts: [{
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                    }
                };
            },
            computed:{
                taskHours(){
                    let num = 0;
                    this.tableData.map(e=>{
                        num+=parseFloat(e.hours)
                    })
                    return num
                },
                aveTime(){
                    const number = (this.taskHours / this.countWorkdays).toFixed(2)
                    if(isNaN(number)){
                        return 0
                    }else{
                        return number
                    }
                },
                countWorkdays(){
                    let start = new Date(this.form.date);
                    let end = new Date(); // 当前日期

                    let workdays = 0;

                    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                        let dayOfWeek = d.getDay();
                        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 是周日，6 是周六
                            workdays++;
                        }
                    }

                    return workdays;
                }
            },
            methods:{
               //获取用户数据
                getUserData(){
                   var that = this;
                   const loading = this.$loading({
                        lock: false,
                        text: '正在获取请稍后...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.3)'
                    });
                   zentao.start(this.form.username,this.form.date,function(){
                       that.tableData = zentao.print()
                       that.$message("已获取 "+that.form.username+" 的任务数据")
                       loading.close();
                   })
                },
                //获取用户任务
                getUserPrint(){
                   this.tableData = zentao.print()
                   this.$message("已获取"+this.form.username+"得任务数据")
                }
            }
        });
    },300)
}
const dataModel = {
    "datasourceid": "fk_applybill", //表ID
    "datasourcecname": "差旅申请单", //表名
    "ccodes": [//部分字段集合
        {
            "ccode": "ddate",    //字段id
            "cname": "单据日期",   //字段名称
            "required": true,    //是否必填
            "type": "date"       //字段类型
        },
        {
            "ccode": "cempguid_name",
            "cname": "申请人",
            "required": true,
            "type": "refer"
        },
        {
            "ccode": "cdeptguid_name",
            "cname": "申请人部门",
            "required": true,
            "type": "refer"
        },
        {
            "ccode": "cprojectguid_name",
            "cname": "项目",
            "required": true,
            "type": "refer"
        },
        {
            "ccode": "creason_name",
            "cname": "事由",
            "required": true,
            "type": "input"
        },
        {
            "ccode": "dstartdate",
            "cname": "出差开始日期",
            "required": true,
            "type": "date"
        },
        {
            "ccode": "denddate",
            "cname": "出差结束日期",
            "required": true,
            "type": "date"
        },
        {
            "ccode": "idays",
            "cname": "出差天数",
            "required": true,
            "type": "number"
        },
        {
            "ccode": "ccityguid_name",
            "cname": "出差城市",
            "required": true,
            "type": "refer"
        },
        {
            "ccode": "ctravelerguid_name",
            "cname": "出差人员",
            "required": true,
            "type": "refer"
        },
        /*{
            "ccode": "iftravelbook_name",
            "cname": "商旅预订",
            "required": false,
            "type": "combox"
        },
        {
            "ccode": "ctravelagent_name",
            "cname": "商旅服务商",
            "required": false,
            "type": "combox"
        }*/
    ],
    "children": [//明细相关表
        {
            "datasourceid": "fk_applybill_detail",
            "datasourcecname": "交通明细",
            "ccodes": [
                /*{
                    "ccode": "cexpenseclass_name",
                    "cname": "费用类型",
                    "required": false,
                    "type": "refer"
                },
                {
                    "ccode": "cexpensedetail_name",
                    "cname": "费用明细",
                    "required": false,
                    "type": "refer"
                },*/
                {
                    "ccode": "cvehicleguid_name",
                    "cname": "交通工具",
                    "required": true,
                    "type": "combox"
                },
                {
                    "ccode": "dstartdate",
                    "cname": "开始日期",
                    "required": true,
                    "type": "date"
                },
                {
                    "ccode": "denddate",
                    "cname": "结束日期",
                    "required": true,
                    "type": "date"
                },
                {
                    "ccode": "cstartplaceguid_name",
                    "cname": "出发地",
                    "required": true,
                    "type": "refer"
                },
                {
                    "ccode": "cendplaceguid_name",
                    "cname": "目的地",
                    "required": true,
                    "type": "refer"
                },
                {
                    "ccode": "self_txr",
                    "cname": "同行人",
                    "required": true,
                    "type": "input"
                }
                /*{
                    "ccode": "cseat_name",
                    "cname": "舱位/席别",
                    "required": true,
                    "type": "combox"
                },
                {
                    "ccode": "itotalamt",
                    "cname": "申请金额",
                    "required": false,
                    "type": "number"
                },
                {
                    "ccode": "self_cclx_name",
                    "cname": "出差类型",
                    "required": true,
                    "type": "combox"
                },
                {
                    "ccode": "self_dcwf_name",
                    "cname": "单程往返",
                    "required": false,
                    "type": "combox"
                },
                {
                    "ccode": "self_jtywx_name",
                    "cname": "是否申请购买交通工具意外险",
                    "required": true,
                    "type": "combox"
                },
                {
                    "ccode": "self_jtgjtssq_name",
                    "cname": "交通工具是否特殊申请",
                    "required": true,
                    "type": "combox"
                },
                {
                    "ccode": "cremark",
                    "cname": "备注",
                    "required": false,
                    "type": "input"
                }*/
            ]
        },
        {
            "datasourceid": "fk_applybill_detail",
            "datasourcecname": "住宿明细",
            "ccodes": [
                {
                    "ccode": "dstartdate",
                    "cname": "开始日期",
                    "required": true,
                    "type": "date"
                },
                {
                    "ccode": "denddate",
                    "cname": "结束日期",
                    "required": true,
                    "type": "date"
                },
                {
                    "ccode": "ccity_name",
                    "cname": "住宿城市",
                    "required": true,
                    "type": "refer"
                },
                /*{
                    "ccode": "cexpenseclass_name",
                    "cname": "费用类型",
                    "required": false,
                    "type": "refer"
                },
                {
                    "ccode": "cexpensedetail_name",
                    "cname": "费用明细",
                    "required": false,
                    "type": "refer"
                },
                {
                    "ccode": "cseason_name",
                    "cname": "城市淡旺季",
                    "required": false,
                    "type": "input"
                },
                {
                    "ccode": "idays",
                    "cname": "入住天数",
                    "required": true,
                    "type": "number"
                },
                {
                    "ccode": "iroom",
                    "cname": "房间数",
                    "required": true,
                    "type": "number"
                },
                {
                    "ccode": "itotalamt",
                    "cname": "申请金额",
                    "required": false,
                    "type": "number"
                },
                {
                    "ccode": "istandardamt",
                    "cname": "标准值",
                    "required": false,
                    "type": "number"
                },
                {
                    "ccode": "istandardtotalamt",
                    "cname": "标准总额",
                    "required": false,
                    "type": "number"
                },
                {
                    "ccode": "iftravelbook_name",
                    "cname": "商旅预订",
                    "required": false,
                    "type": "combox"
                },
                {
                    "ccode": "ctravelagent_name",
                    "cname": "商旅服务商",
                    "required": false,
                    "type": "combox"
                },
                {
                    "ccode": "cremark",
                    "cname": "备注",
                    "required": false,
                    "type": "input"
                }*/
            ]
        },
        {
            "datasourceid": "fk_applybill_work",
            "datasourcecname": "工作计划",
            "ccodes": [
                {
                    "ccode": "cstartdate",
                    "cname": "开始日期",
                    "required": true,
                    "type": "date"
                },
                {
                    "ccode": "cenddate",
                    "cname": "结束日期",
                    "required": true,
                    "type": "date"
                },
                {
                    "ccode": "ccity_name",
                    "cname": "工作地点",
                    "required": true,
                    "type": "refer"
                },
                {
                    "ccode": "ccontent",
                    "cname": "工作内容",
                    "required": true,
                    "type": "input"
                },
                {
                    "ccode": "cremark",
                    "cname": "备注",
                    "required": false,
                    "type": "input"
                }
            ]
        }
    ]
}
//获取表单数据
function getFormData(){
    let pVdom = $aps.Aps.findComponentsDownward($aps,'Parse')
    pVdom.map(e => {
        if(e.formConfCopy.cpageid==='fk_travelapply_bill'){
             printChatFormatData(e.formData)
        }

    })
}
//输出预定格式数据
function printChatFormatData(data){
   console.log('表单数据：',data)
   let formatData = {'text':data.cstafflevelguid_name,'fk_applybill&差旅申请单':{},children:{'fk_applybill_detail&交通明细':[],'fk_applybill_detail&住宿明细':[],'fk_applybill_plan&工作计划':[]}}
   dataModel.ccodes.map( e => {
        formatData['fk_applybill&差旅申请单'][e.cname] = data[e.ccode]
   })
   Object.keys(data).forEach(key => {
       if(key==='children_4a85c6a03d12b5c4d233c6921ee2ffcc'){
           let childData = data[key]
           childData.map( e => {
               if(e.cpageid==='fk_travelapply_travel'){
                   let rowdata = {}
                   dataModel.children[0].ccodes.map( i => {
                       rowdata[i.cname] = e[i.ccode]
                   })
                   formatData.children['fk_applybill_detail&交通明细'].push(rowdata)
               }else{
                   let rowdata = {}
                   dataModel.children[1].ccodes.map( i => {
                       rowdata[i.cname] = e[i.ccode]
                   })
                   formatData.children['fk_applybill_detail&住宿明细'].push(rowdata)
               }
           })
       }else if(key==='children_771cc5b9791507dd48e885736b0e1719'){
           let childData = data[key]
           childData.map( e => {
               let rowdata = {}
               dataModel.children[2].ccodes.map( i => {
                   rowdata[i.cname] = e[i.ccode]
               })
               formatData.children['fk_applybill_plan&工作计划'].push(rowdata)
           })
       }
   });
    console.log('大模型返回数据-右键可复制：',formatData)
    alert('数据已生成，请F12打开浏览器控制台查看并复制！')
}

//======== 执行区,不要修改 =======
(function() {
    // 创建一个新的 link 元素
    var link = document.createElement("link");

    // 设置 link 元素的属性
    link.href = "https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.14/theme-chalk/index.css" // Element UI CSS 的 CDN 地址
    link.type = "text/css";
    link.rel = "stylesheet";

    // 将 link 元素添加到文档的 <head> 中
    document.getElementsByTagName("head")[0].appendChild(link);
    // 创建 style 元素
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .el-table .el-table__cell {
            padding:0;
        }
        #appvue .cell{
            -webkit-box-shadow: 0 0;
            box-shadow: 0 0;
        }
        .result-area{
            margin-left: -10px;
            margin-right: -10px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 120px;
        }
        .result-area .number{
            font-size:60px !important;
            color: #117d8b;
        }
    `;

    // 将 style 元素添加到文档的 head 中
    document.head.appendChild(style);
    //急性
    setTimeout(function(){
        createDom();
        //initJs();
    },1234);
})();