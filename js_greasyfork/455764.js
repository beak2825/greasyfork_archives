// ==UserScript==
// @name         政务IT设计
// @namespace    com.epoint.ga.se
// @version      1.8
// @description  新点同步需求信息外附工具
// @author       ftao
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagejy/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandchangeinfo/demandchangeinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagejs/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanage/demandbasicinfo_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanagezw/demandbasicinfonew_detail?*
// @match        https://oa.epoint.com.cn/productrelease/cpzt/demandmanageznsb/demandbasicinfo_splitdetail?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455764/%E6%94%BF%E5%8A%A1IT%E8%AE%BE%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/455764/%E6%94%BF%E5%8A%A1IT%E8%AE%BE%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
//#region 基础方法
    var mini = window.mini,
        $ = window.$,
        epoint = window.epoint,
        SrcBoot = window.SrcBoot,
        document = window.document,
        Util = window.Util,
        s_Html = window.s_Html,
        JSON = window.JSON,
        window_url = window.location.href,
        website_host = window.location.host;

    //服务器路径
    const SERVER_URL = "https://192.168.207.136:8199/workplatform_update";

    //通用调用方法
    const request = {
        post: function (path, data, success, sync) {
            let settings = {
                "async": sync ? false : true,
                "url": SERVER_URL + '/rest' + path,
                // "url": 'http://192.168.161.12:8092/ga-se/rest' + path,
                "method": "POST",
                "headers": {
                   "Content-Type": "application/json",
                    "Authorization": "Bearer " + getCookie("access_token")
                },
                "data": data,
                dataType: "json"
            }

            $.ajax(settings).done(success);
        }
    }

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }

    function createBtn(name, f) {
        var btn = new mini.Button();
        btn.addCls('mini-btn-primary');
        btn.set({
            disableMultiClick: false,
            text: name
        });
        btn.on('click', f);
        return btn;
    }
    // 获取需求信息
    var demandInfo = {

    };
    
    /**
         * 读取需求的基本信息
         */
        function loadDemandInfo() {
            var $output = $('.mini-outputtext');
            $output.each(function () {
                var id = $(this).attr('id');
                if (id) {
                    var miniOutputText = new mini.get(id);

                    demandInfo[correctId(id)] = miniOutputText.getValue();
                }
            });
            var $buttonedit = $('.mini-buttonedit');
            $buttonedit.each(function () {
                var id = $(this).attr('id');
                if (id) {
                    var miniButtonEdit = new mini.get(id);
                    demandInfo[correctId(id + "text")] = miniButtonEdit.getText();
                }
            });

            function correctId(id) {
                if (id.endsWith('guidtext')) {
                    return correctId(id.substr(0, id.length - 8) + "name")
                }
                if (id.endsWith('text')) {
                    return correctId(id.substr(0, id.length - 4));
                }
                if (id.endsWith('read')) {
                    return correctId(id.substr(0, id.length - 4));
                }
                if (id.endsWith('write')) {
                    return correctId(id.substr(0, id.length - 5));
                }
                return id;
            }
            var demandGuid = window.rowguid;
            demandInfo.rowguid = demandGuid;
            demandInfo.demandurl=window_url
            demandInfo.projectguid=$('#projectguid\\$value').val()
            demandInfo.demandname=$('#demandname').html()
            //demandInfo.djdate=$('.form-control.span1[label="登记日期"]').children().html()
            demandInfo.demandno=$('.form-control.span1[label="需求编号"]').children().html()
            if(window_url.indexOf('demandchangeinfo') != -1){
                demandInfo.rowguid = demandGuid+'-change'
                demandInfo.projectguid = mini.get('projectguid').getValue()
                demandInfo.demandname=$('.form-control[label="需求名称"]').children().html()
                demandInfo.productname=$('.form-control.span1[label="产品选择"]').children().html()
                demandInfo.hopefinishdate=$('.form-control.span1[label="期望完成时间"]').children().html()
                demandInfo.isurgent='否'
                demandInfo.projectname = $('.form-control[label="项目名称"]').children().children().html()
            }
        }

    var domToRender = $('#fkxx').find(".btn-group")[0];
    var domToolBar = $('.fui-toolbar').children().get(0);


    function getDemandInfo(){
        var rowguidInfo = {

        };
        var demandGuid = window.rowguid;
            rowguidInfo.rowguid = demandGuid;
        console.log(rowguidInfo)
        request.post("/getdemanddatarest/getDemandInfo", JSON.stringify({params:rowguidInfo}), function (data) {
            if (data.custom.code == "1" ) {
                if(mini.get('djprompt')){
                    mini.get('djprompt').setValue(mini.get('djprompt').getValue()+" "+data.custom.text)
                }else{
                    $('.fui-toolbar').children().get(1).append(data.custom.text)
                }
            }
        })
    }
    setTimeout(function () {
        getDemandInfo();
    },3000)
    
    //渲染同步按钮
    var signBtn = createBtn("同步需求信息", function () {
        epoint.confirm('是否确认同步该需求到设计任务管理系统?', '', function(){
            request.post("/getdemanddatarest/getUserInfo", JSON.stringify({params:demandInfo}), function (data) {
                if (data.custom.code == "1") {
                    var username = data.custom.username
                    console.log("username",username)
                    loadDemandInfo()
                    console.log("demandInfo",demandInfo)
                    if($('#transactionhistory1_workitemlist').find(".mini-grid-cell-inner").length == 0){
                        epoint.alert("请待页面加载完成后重试！");
                        return;
                    }
                    var sjdate = getSjDate(username)
                    if(!sjdate){
                        epoint.alert("请先将需求分配给当前人员！");
                        return;
                    }
                    demandInfo.sjdate=sjdate
                    var xqsqdate = $('#transactionhistory1_workitemlist').find(".mini-grid-cell-inner")[5].innerHTML
                    demandInfo.xqsqdate=xqsqdate
                    console.log("demandInfo",demandInfo)

                    request.post("/getdemanddatarest/getdemanddata", JSON.stringify({params:demandInfo}), function (data1) {
                        console.log("data1",data1)
                        if (data1.custom.code == "1" || data1.custom.code == "3") {
                            epoint.alert(data1.custom.text);
                        }else if (data1.custom.code == "2"){
                            mini.MessageBox.show({
                                title: "需求确认",
                                iconCls: "mini-messagebox-question",
                                message: data1.custom.text,
                                buttons: ["PC端", "移动端", "关闭"],
                                callback: function (action) {
                                    if(action == '关闭' || action == 'close'){
                                        mini.MessageBox.hide()
                                    }else{
                                        demandInfo.demandname = demandInfo.demandname+"-"+action
                                        demandInfo.rowguid = demandInfo.rowguid+"-1"
                                        request.post("/getdemanddatarest/getdemanddata", JSON.stringify({params:demandInfo}), function (data2) {

                                            if (data2.custom.code == "1" ) {
                                                epoint.alert(data2.custom.text);
                                            }else{
                                                epoint.alert("同步失败！");
                                            }
                                        })
                                    }

                                }
                            });
                        }else{
                            epoint.alert("同步失败！");
                        }
                    })
                }else{
                    epoint.alert("人员信息查询失败！");

                }
            })

        })
    });
    signBtn.render(domToolBar);

    function getSjDate(name){
        var flag=0
        var sjdate = "";
        $('#transactionhistory1_workitemlist').find(".mini-grid-cell-inner").each(function(){
            var s = $(this).children("span").text()
            if(s == "" ){
              s = $(this).text()
            }

            if(flag >0){
               flag ++;
            }
            if(s==name || s.indexOf(name)!=-1){
                if(flag != 0){
                    flag = 0
                }
                flag ++;
            }

            if(flag == 3){
                if(s.indexOf("-")!=-1){
                    sjdate= s
                }
               //return ;
            }

        })

        return sjdate;
    }
})();