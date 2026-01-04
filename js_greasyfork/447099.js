// ==UserScript==
// @name         交易系统辅助
// @namespace    https://dzcg.hubeigp.gov.cn/
// @version      1.64
// @description  查询菜单
// @author       older Lee
// @include      *://dzcg.hubeigp.gov.cn/*
// @include      *://61.183.178.194:8322/*
// @include      *://39.97.6.153:8899/*
// @include      *://124.65.100.171:30005/*
// @include      *://192.168.102.244:8321/*
// @include      *://192.168.102.244:8322/*
// @include      *://39.97.6.153:8088/*
// @include      *://39.97.6.153:8888/*
// @include      *://zfcg.nxzbtb.com.cn:8443/*
// @include      *://39.104.18.92:8099/*
// @include      *://61.183.178.194:8321/*
// @include      https://192.168.102.250:8322/*
// @include      *://61.183.178.194:8422/*
// @include      *://118.213.59.178:8088/*
// @include      *://60.212.191.167:28088/*
// @include      *://121.61.253.42:8088/*
// @include      http://192.168.103.2:8080/*
// @include      *://dzcg.whggzyjy.cn:8088/*
// @include      *://60.212.191.167:28088/*
// @include      *://dzjy.jxzfcg.cn:85/*
// @include      *://127.0.0.1:18080/*
// @include      *.ggzyjy.weihai.cn/*
// @include      *://127.0.0.1:8080/*
// @include      http://localhost:8080/*
// @include      *://60.212.191.167:18085/*
// @include      *://118.213.59.35:8081/index
// @include      http://192.168.102.243:8010/*
// @include      http://60.212.191.167:18085/*
// @include      https://dzcg.hubeigp.gov.cn:8000/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant         unsafeWindow
// @license      AGPL License
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/447099/%E4%BA%A4%E6%98%93%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/447099/%E4%BA%A4%E6%98%93%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hrefUrl = window.location.href;

    let request = function(mothed, url, param){   //网络请求
        return new Promise(function(resolve, reject){
            GM_xmlhttpRequest({
                url: url,
                method: mothed,
                data:param,
                onload: function(response) {
                    var status = response.status;
                    var playurl = "";
                    if(status==200||status=='200'){
                        var responseText = response.responseText;
                        resolve({"result":"success", "data":responseText});
                    }else{
                        reject({"result":"error", "data":null});
                    }
                }
            });
        })
    };
    let getLastInfo=function(sid){
        let lsKey = "lastSetTime";
        let lsSessionid = "sessionid";
        let lsLastSetTime = localStorage.getItem(lsKey);
        if(lsLastSetTime){
            if((new Date().getTime()-lsLastSetTime)>1000*60*60*3){
                localStorage.removeItem(lsKey);
            }else if(localStorage.getItem(lsSessionid) && sid != localStorage.getItem(lsSessionid)){
                $("#sessionId_").html($("#sessionId_").text()+"<br/>"+localStorage.getItem(lsSessionid)+"(lastTime)")
                $("#sessionId_").css({"background-color": "#4fbdf4"});
            }

        }
        localStorage.setItem(lsKey,new Date().getTime());
        localStorage.setItem(lsSessionid, sid);
    }
    var fieldsALl = "缺省值---->";
    var paramAll = "参数---->";
    var fp ;
    let getFP=function(){

        let fields = unsafeWindow._FIELD_;
        let param = EPS.cache("PARA");
        //console.log("fields",fields)
        if(fields){
            // for(let f in fields){
            //     if(fields[f] && fields[f]['value']){
            //         fieldsALl +=  (f+"="+fields[f]['value']+";");
            //     }else{
            //         fieldsALl +=  (f+"="+fields[f]+";");
            //     }
            //
            // }
            fieldsALl += JSON.stringify(fields, null, "\t");
        }
        if(paramAll){
            for(let p in param){
                paramAll +=  (p+"="+param[p]+";");
            }
        }

        let url = window.location.href;
        console.log("url=》",url);
        console.log("缺省值=》",fields);
        console.log("参数=》",param);
        let fphtml = "<button id=\"showp\" title='"+url+"' style='display: none' class=\"u-button\">显示缺省值参数</button><textarea style=\"width: 100%; height: 80px;display: none\" id=\"fp\"></textarea>";

        $(".page-content").prepend(fphtml);
        $(".page-content").height($(".page-content").height()+80);
        if(!fp){
            fp = $("#fp");
        }

        $("#showp").on("click",function(){
            fp.toggle();


        })
        // let helperPath = "";
        // if(EPS.sys('helper').menuId)
        //     helperPath =  EPS.sys('helper').menuId +(EPS.sys('helper').winIds.length>0?( ">" + EPS.sys('helper').winIds.join('>')):"")
        fp.val(fieldsALl+"\r\n"+paramAll);
        // console.log("helperPath=》",helperPath);
    }
    const menu1 = $(".page-sidebar-menu  .sub-menu").first();
    /*menu1.prepend('<li class="nav-item"><a onclick="menu(\'/assets/page/base/myTemplate.html?scene=operator\',this);" class="nav-link"><span class="title">模板管理</span><span class="badge" id="M38"></span></a></li>');
    menu1 .prepend('<li class="nav-item"><a onclick="menu(\'/assets/page/interface/intRecordManage.html\',this);" class="nav-link"><span class="title">接口日志</span><span class="badge" id="M295"></span></a></li>');
    menu1 .prepend('<li class="nav-item"><a onclick="menu(\'/assets/page/base/tempdebug.html\',this);" class="nav-link"><span class="title">模板调试</span><span class="badge" id="M40"></span></a></li>');
    menu1 .prepend('<li class="nav-item"><a onclick="menu(\'/assets/page/interface/dataQuery.html\',this);" class="nav-link"><span class="title">数据查询</span><span class="badge" id="M1322"></span></a></li>');
    menu1 .prepend('<li class="nav-item"><a onclick="menu(\'/assets/page/goods/deliver/buckleSealTools.html\',this);" class="nav-link"><span class="title">扣章工具</span><span class="badge" id="M1322"></span></a></li>');
    menu1 .prepend('<li class="nav-item"><a onclick="menu(\'/assets/page/shop/order/queryPayHelper.html\',this);" class="nav-link"><span class="title">支付辅助</span><span class="badge" id="M1322"></span></a></li>');
    menu1 .prepend('<li class="nav-item active"><a onclick="menu(\'/assets/page/base/areaDeploy.html\',this);" class="nav-link" title="M13"><span class="title">区域配置</span><span class="badge" id="M13"></span></a></li>');
   */
    let str = "/index";
    if((hrefUrl.slice(-str.length) == str || hrefUrl.indexOf(str+"?") != -1 ) && $("#infotable").size()==0){
        let info = '<div style="margin-top: 45px">\n' +
            '        <table id="infotable" style="border-width: 1px;border-color: #666666;border-collapse: collapse;width:100%">\n' +
            // '            <tr><td width="460px">sessionId</td><td  width="150px">IP1</td><td  width="150px">IP2</td></tr>\n' +
            // '            <tr><td id="sessionId_"></td><td id="IP1_"></td><td id="IP2_"></td></tr>\n' +
            //'<tr><td >缺省值和参数</td><td colspan="2"><textarea style="width: 90%; height: 80px;" id="fp"></textarea>&nbsp;&nbsp;</td></tr>\n' +

            '<tr><td >文件下载</td><td ><input type="text" id="attachid" style="width:300px">&nbsp;&nbsp;&nbsp;<a class="font-blue" id="downloadAttach" title="下载"><i class="fa fa-download-f fa-lg"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\t<a class="font-red" id="clear" title="清空"><i class="fa fa-delete fa-lg"></i></a>' +
            '</td><td id=""><button id="showquery" class="u-button">查询</button>&nbsp;&nbsp;&nbsp;<button id="ajaxbutton" class="u-button">Ajax</button>&nbsp;&nbsp;&nbsp;<!--<button id="clear" class="u-button">重置</button>&nbsp;&nbsp;&nbsp;<button id="downloadAttach" class="u-button">下载</button>--></td></tr>\n' +
            '<tr><td colspan="3"><iframe id="content-frame11" allowtransparency="true" width="100%" style="z-index: -1; top: 0px; min-height: 500px; height: 782px;" frameborder="0" scrolling="auto" src="/assets/page/interface/dataQuery.html?"></iframe></td></tr>\n' +
            '<tr style="height: 500px;display: none" id="ajaxTr"><td >' +
            '<textarea style="width: 90%; height: 450px;" id="param">' +
            '{\n' +
            '\t"url": "",\n' +
            '\t"type": "post",\n' +
            '\t"data": {}\n' +
            // '\t"header": {},\n' +
            '}' +
            '</textarea>&nbsp;&nbsp;<button id="ajax" class="u-button">请求</button></td><td colspan="2"><textarea style="width: 100%; height: 450px;" id="res"></textarea></td></tr>\n' +
            '        </table>\n' +
            '    </div>';
        $(".page-header").after(info);
        $("#infotable td").css({"border-width": "1px","padding": "1px","border-style": "solid","border-color": "#666666","background-color": "#ffffff"})
        $(".page-container").css({"margin-top":"0px"});
        var iframe = document.getElementById("content-frame11");
        if(iframe){
            if (iframe.attachEvent){ // 兼容IE写法
                iframe.attachEvent("onload", function(){
                    $("#content-frame11").hide();
                })
            } else {
                iframe.onload = function(){
                    $("#content-frame11").hide();
                }
            }
        }

        $("#downloadAttach").on("click",function(){
            let attacheid = $("#attachid").val();
            if(attacheid){
                window.open("/fileupload/export?attachid="+attacheid);
            }
        })
        $("#clear").on("click",function(){
            $("#attachid").val("");

        })
        let showquery =false;
        $("#showquery").on("click",function(){
            if(!showquery){
                $("#content-frame11").show();
                $("#showquery").text("隐藏");
                const esf = new EnableSelectFunction();
                esf.setSelectEnable();
            }else{
                $("#content-frame11").hide();
                $("#showquery").text("查询");
            }
            showquery = !showquery;

        })
        let showAjax = false;
        $("#ajaxbutton").on("click",function(){

            if(!showAjax){
                $("#ajaxTr").show();
                $("#showAjax").text("隐藏");

            }else{
                $("#ajaxTr").hide();
                $("#showAjax").text("查询");
            }
            showAjax = !showAjax;
        })

        //初始化菜单按钮
        let initMenuButton = function(){
            let imb = [
                {id:1,name:'数据查询',url:'/assets/page/interface/dataQuery.html'},
                {id:2,name:'模板管理',url:'/assets/page/base/myTemplate.html?scene=operator'},
                {id:3,name:'接口日志',url:'/assets/page/interface/intRecordManage.html'},
                {id:5,name:'模板调试',url:'/assets/page/base/tempdebug.html'},
                {id:6,name:'扣章工具',url:'/assets/page/goods/deliver/buckleSealTools.html'},
                {id:7,name:'支付辅助',url:'/assets/page/shop/order/queryPayHelper.html'},
                {id:17,name:'CA相关',url:'/assets/page/shop/helper/index.html'},
                {id:8,name:'区域配置',url:'/assets/page/base/areaDeploy.html'},
                {id:18,name:'售后管理',url:'/assets/page/shop/refund/refundlist.html'},
                {id:9,name:'参数配置',url:'/assets/page/base/cloudDeploy.html'},
                {id:10,name:'组织授权',url:'/assets/page/base/organgrant/organGrant.html'},
                {id:11,name:'系统运维',url:'/assets/page/interface/opsServer.html'},
                {id:12,name:'数据修改',url:'/assets/page/interface/dataModify.html'},
                {id:13,name:'单位项目',url:'/assets/page/project/myProject.html?scene=organ'},
                {id:14,name:'文件签章',url:'/assets/page/tender/fileSeal.html'},
                {id:15,name:'清除缓存',url:'/assets/page/base/releasedlogin.html'},
                {id:16,name:'辅助功能',url:'/assets/page/interface/assist.html'},
                {id:19,name:'保证金退回',url:'/assets/page/bondmanager/bondManage.html?scene=wh'},
                {id:20,name:'发送邮件',url:'/assets/page/messagesendlog/sendMail.html'},
                {id:20,name:'登录锁定',url:'assets/page/base/releasedlogin.html'},
                {id:21,name:'缺省规则',url:'/assets/page/base/dataRueManage.html'},
            ];
            let locationUrl = window.location.href;
            let prefix = "";
            if(locationUrl.indexOf("/eps/") > -1){
                prefix = "/eps";
            }

            let temp = $("<td>",{"colspan":3});
            imb.forEach((val,index,arr)=>{
                //回调函数中可以接受3个参数， 1.value值 2.索引 3.整个数组
                temp.append(($("<button>", {'class':"addMenu",'id':val.id,'name':val.name,'url':prefix+val.url})).append(val.name)).append("   ");
            })
            let menuHtml = $("<tr>").append(temp);
            //$(".page-header").after(menuHtml);
            $("#infotable").find("tbody").prepend(menuHtml)
        }
        initMenuButton();

        //增加菜单
        $(".addMenu").on("click",function(){
            // $(this).attr("url")
            let menutemp = {url:$(this).attr("url"),name:$(this).attr("name"),id:$(this).attr("id"),};
            let menuShowRoot =  $(".page-sidebar-menu").find("ul.sub-menu:eq(0)");
            if(menuShowRoot){
                let nodes = `<li class="nav-item"><a onclick="menu(\'${menutemp.url}\',this);" class="nav-link"><span class="title">${menutemp.name}</span><span class="badge" id="${menutemp.id}"></span></a></li>`;
                menuShowRoot.prepend(nodes);
            }

        })
        let parseServerDatas = function (data){
            let outs = new Array(), fields = data.shift(); // 将字段定义数据取出
            for (let i = data.length - 1; i >= 0; i--) { // 循环数据记录行
                let row = {}, rec = data[i];
                for (let j = 0; j < fields.length; j++) { // 循环记录内字段数据
                    let prop = fields[j]['name'];
                    row[ prop ] = rec[j]; // 合并成对象数据
                }

                outs.unshift(row); // 处理后的行数据
            }
            return outs;
        }

        $("#ajax").on("click",function(){
            let param =  $("#param").val();
            let paramJson = JSON.parse(param);
            if(paramJson && paramJson.url){
                let resJson = EPS.ajax(paramJson);
                console.log(paramJson,resJson);
                if(resJson.datas){
                    let data = JSON.parse(resJson.datas);
                    let outer = parseServerDatas(data);
                    if(resJson.totalCount){
                        outer.unshift({'totalCount':resJson.totalCount});
                    }
                    if(outer && outer.length>0 ){
                        let keysize = Object.keys(outer[0]);
                        if(keysize == 0){
                            $("#res").val(JSON.stringify(data, null, "\t"));
                            return ;
                        }
                    }

                    $("#res").val(JSON.stringify(outer, null, "\t"));
                }else{
                    $("#res").val(JSON.stringify(resJson, null, "\t"));
                }



            }
        })

    }

    request("get", "/api/ca/getTestInfo/1", null).then((resultData)=>{
        let dataJson = JSON.parse(resultData.data);
        console.log(dataJson);
        $("#sessionId_").html(dataJson.sessionid)
        $("#IP1_").html(dataJson.IP)
        $("#IP2_").html(dataJson.IP2);
        getLastInfo(dataJson.sessionid);
    }).catch((errorData)=>{
        console.log(errorData);
    });

    //解锁复制
    function EnableSelectFunction(){

        let cf = function(){
                return true;
            },
            addEvent_=function(g,d,e){
                if (g.on) {
                    g.on(d, e)
                } else {
                    g.bind(d, e)
                }
            },
            removeEvent_=function(f, d){
                if (f.off) {
                    f.off(d)
                } else {
                    f.unbind(d)
                }
            },

            setSelectEnable = function(){
                $(".jqx-disableselect").removeClass("jqx-disableselect");
                let jqxGrids = $(".jqx-grid");
                if(jqxGrids  && jqxGrids.size()>0 ){
                    jqxGrids.each(function(){
                        let gridid = $(this).attr("id");
                        if($(this).jqxGrid('enablebrowserselection')){
                            return;
                        }else{
                            $(this).jqxGrid({ enablebrowserselection: true})
                        }
                        let url = window.location.href;
                        console.log("执行解锁复制todo-------------------id=>"+gridid+"-----------url=>"+url);
                        removeEvent_($(this).find("#content"+gridid),"selectstart."+gridid);
                        addEvent_($(this).find("#content"+gridid),"selectstart."+gridid,cf);
                    });
                }
            }
        return {setSelectEnable}
    }
    const esf = new EnableSelectFunction();
    self.setInterval(function(){
        // let url = window.location.href;
        // console.log("执行解锁复制--------------------"+url);
        esf.setSelectEnable();
    },3*1000)
    getFP();


    function query1() {
        $("#dowloaddata").hide();
        var vo = {
            "database": $("#database").val(),
            "select": base64($("#selectValue").val()),
            "from": base64($("#fromValue").val()),
            "limit": $("#limitValue").val()
        };
        if(vo.select == null || '' == vo.select) {
            alert("select内容不能为空");
            return;
        }
        if(vo.from == null || '' == vo.from) {
            alert("from内容不能为空");
            return;
        }
        var result = EPS.ajax({
            type: 'POST',
            url: '/dataops/queryData',
            async: false,
            data: JSON.stringify(vo),
            contentType: 'application/json;charset=UTF-8',
            success: function(data) {
                $("#content").html("");
                $("#totolcount").html("");
                success(data)
            }
        }, true);
    }

    if(hrefUrl.indexOf("http://60.212.191.167:28088/") != -1 && hrefUrl.indexOf("dataQueryContent.html") != -1){
        $("input[type='button']").removeAttr("onclick");
        $("input[type='button']").on("click",function(){
            query1()
        })
    }

})();