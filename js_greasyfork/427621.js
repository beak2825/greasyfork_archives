// ==UserScript==
// @name         一键打印商事主体PDF
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  1. 跳过验证码直接搜索公司名；2. 一键打印商事登记信息成为PDF包括变更信息 3. 打印修复20210512
// @author       HenryD, Yu in CCB
// @match        https://amr.sz.gov.cn/outer/entSelect/listDetail.html*
// @match        https://amr.sz.gov.cn/outer/entSelect/gs.html*
// @match        https://amr.sz.gov.cn/outer/entSelect/printPrew.html*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427621/%E4%B8%80%E9%94%AE%E6%89%93%E5%8D%B0%E5%95%86%E4%BA%8B%E4%B8%BB%E4%BD%93PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/427621/%E4%B8%80%E9%94%AE%E6%89%93%E5%8D%B0%E5%95%86%E4%BA%8B%E4%B8%BB%E4%BD%93PDF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //$(document.body).append('<style type="text/css" media="print"> .print-break {page-break-after:always;}</style>')
    // Your code here...
    GM_addStyle(".print-break {page-break-after: always;page-break-inside: avoid;} ");
    var TITLE = '<div style="text-align: center;"><font size="5px" face="黑体">';
    TITLE+='<span style="color:Black;background-color:White;">深圳市市场监督管理局商事主体登记及备案信息查询单(网上公开)</span></font></div><div class="lines"></div>'

    //$(document.body).append('<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/moon/style.min.css" rel="stylesheet">')
    //$(document.body).append('<script src="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js"></script>')
    $(document.body).append('<script src="https://amr.sz.gov.cn/outer/statics/plugins/myUI/gs.js"></script>')
    function currrent_page(){
        var url=window.location.pathname;
        return url;
    }
    function add_search(){
        var html_temp = '<div><input type="text" class="form-control" placeholder="请输入商事主体全称（一字不差）" value="" id="my_search"><br>'
        html_temp+='<a href="javascript:void(0)" id="btn_search" class="btn btn-primary" style="background-color:green;">无验证码直接查</a></div>';
        //将以上拼接的html代码插入到网页里的ul标签中
        var divbox = $("div.col-md-12");
        if (divbox) {
            divbox.append(html_temp);
        }
        $("#btn_search").click(function () {
            var bname=$('#my_search').val();
            bname = encode(bname);
            window.open('listDetail.html?name='+bname,bname);
        });

    }
    function add_btn(){
        var html_temp = '<a href="javascript:void(0)" id="btn_print_all" class="bt3 tc wh" style="background-color:green;">一键信息打印</a>';

        //将以上拼接的html代码插入到网页里的ul标签中
        var buttonbox = $("div.button-box");
        if (buttonbox) {
            buttonbox.append(html_temp);
        }

    }

    function getNowFormatDate() {
			var date = new Date();
			var seperator2 = ":";
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = date.getFullYear() + "年" + month + "月" + strDate
					+ "日" + date.getHours() + seperator2 + date.getMinutes()
					+ seperator2 + date.getSeconds();
			return currentdate;
		}

    var outTemp="";
    function getBiangeng( id,alttime,entName,altdate,pregino){

        var url = window.location.search;
        var timeStr = altdate.split("/")[0] + "年" + altdate.split("/")[1] + "月" + altdate.split("/")[2] + "日";
        outTemp+='<div class="print-break">'
        outTemp += TITLE
        $.ajax({
            url : '../entEnt/biangeng.do',
            type : 'POST',
            dataType : 'json',
            async : false,
            //取消异步请求
            data : {
                "id" : id,
                "alttime" : alttime,
                "pregino":pregino
            },

            success : function(data) {
                //$('#entname').append(entName);
                // 撤销变更状态， true:为有变更撤销；false:没有变更撤销
                var state = false;
                // 判断变更是否已撤销
                $.ajax({
                    url : '../entEnt/chexiao.do',
                    type : 'POST',
                    dataType : 'json',
                    async : false,
                    data : {
                        "id" : id,
                        "alttime" : alttime,
                        "regino" : pregino,
                    },
                    success : function(data2) {
                        //console.log(data2);
                        if (isNotEmpty(data2.data[0].data[0].altitemcode) && "E4" == data2.data[0].data[0].altitemcode) {
                            state = true;
                        }
                    }
                });

                if (state) { // 有变更撤销，则加上（此次变更已撤销）的提示
                    outTemp +='<span class="entname">'+entName+'<span class="bianGenSHiXianTime">'+timeStr+'</span>的变更信息<span class="bianGenYiCheXiao"><span style=\"color:#F00\">(此次变更已撤销)</span></span>';
                     //变更事项时间

                } else {
                     outTemp +='<span class="entname">'+entName+'<span class="bianGenSHiXianTime">'+timeStr+'</span>的变更信息<span class="bianGenYiCheXiao"></span><br/>';
                }

                data = data.data[0].data;
                var arr = new Array();

                outTemp+='<table  ><tbody>'
                for (var i = 0; i < data.length; i++) {
                    var valueNew = " ";
                    var describe = data[i].describe;
                    outTemp += "<tr><td class='seprateLine'></td><td class='seprateLine'></td></tr>";
                    if (describe == 1) { // 直接显示数据
                        //if (isNotEmpty(data[i].altbe) || isNotEmpty(data[i].altaf)) {
                        valueNew = " ";
                        if (isNotEmpty(data[i].valueNew)) {
                            valueNew = data[i].valueNew;
                        }
                        var altbe = " ";
                        if (isNotEmpty(data[i].altbe)) {
                            altbe = data[i].altbe;
                        }

                        var altaf = " ";
                        if (isNotEmpty(data[i].altaf)) {
                            altaf = data[i].altaf;
                        }

                        outTemp += "<tr><td class='title'>变更前" + valueNew + "</td><td class='titleDesc'>" + altbe + "</td></tr>";
                        outTemp += "<tr><td class='title'>变更后" + valueNew + "</td><td class='titleDesc'>" + altaf + "</td></tr>";

                        //$("#entbianGen tbody").append(html);
                        //}
                    }
                    else if (describe == 2) { //查询相应的变更表
                        valueNew = " ";
                        if (isNotEmpty(data[i].valueNew)) {
                            valueNew = data[i].valueNew;
                        }
                        var altitemcode = data[i].altitemcode;
                        var altemcodeNew = data[i].altemcodeNew;
                        if (!contains(arr, altemcodeNew)) {
                            $.ajax({
                                url : '../entEnt/bgdetail.do',
                                type : 'POST',
                                dataType : 'json',
                                async : false,
                                //取消异步请求
                                data : {
                                    "altitemcode" : altitemcode,
                                    "regino" : data[i].regino,
                                    'id':id
                                },
                                success : function(data) {
                                    data = data.data[0].data;
                                    if (isNotEmpty(data)) {
                                        var altbecontent = " ";
                                        var altafcontent = " ";
                                        var zxswhhr = ""; //执行事务合伙人
                                        var hhrType = "";//合伙人类型
                                        var wpdb = ""; //委派代表
                                        for (var i = 0; i < data.length; i++) {
                                            if (data[i].bgtype == '1') {
                                                zxswhhr =  data[i].zshhr;
                                                wpdb =  data[i].persname;
                                                if(zxswhhr!=undefined){
                                                    zxswhhr = "  ,是执行事务合伙人";
                                                    if(data[i].responway!=undefined){
                                                        hhrType = " ," + data[i].responway ;
                                                    }
                                                    if(wpdb!=undefined){
                                                        altbecontent = altbecontent + data[i].content + zxswhhr+hhrType+" , 委派代表 " +wpdb +"<br/>"
                                                    }else{
                                                        altbecontent = altbecontent + data[i].content + zxswhhr+hhrType+"<br/>"
                                                    }
                                                }else{
                                                    altbecontent = altbecontent + data[i].content + "<br/>"
                                                }
                                            } else if (data[i].bgtype == '2') {
                                                zxswhhr =  data[i].zshhr;
                                                wpdb =  data[i].persname;
                                                if(zxswhhr!=undefined){
                                                    zxswhhr = "  ,是执行事务合伙人";
                                                    if(data[i].responway!=undefined){
                                                        hhrType = " ," + data[i].responway ;
                                                    }
                                                    if(wpdb!=undefined){
                                                        altafcontent = altafcontent + data[i].content + zxswhhr+ hhrType  + " , 委派代表 " +wpdb + "<br/>"
                                                    }else{
                                                        altafcontent = altafcontent + data[i].content + zxswhhr+ hhrType  + "<br/>"
                                                    }
                                                }else{
                                                    altafcontent = altafcontent + data[i].content +"<br/>"
                                                }
                                            }
                                        }
                                        if (isNotEmpty(altbecontent) || isNotEmpty(altafcontent)) {
                                            outTemp += "<tr><td class='title'>变更前" + valueNew + "</td><td class='titleDesc'>" + altbecontent + "</td></tr>";
                                            outTemp += "<tr><td class='title'>变更后" + valueNew + "</td><td class='titleDesc'>" + altafcontent + "</td></tr>";

                                        }
                                    }
                                }
                            });
                            arr.push(altemcodeNew);
                        }

                    }
                }
                outTemp+='</tbody></table></div>'
                return outTemp;
            }
        });

    }
    var biangengContent="";
    var bg_url_list=[];
    $(function () {
        var current_url=currrent_page();
        //console.log(current_url);
        if(current_url=='/outer/entSelect/gs.html'){
            add_search();
        }
        else if (current_url=='/outer/entSelect/printPrew.html'){
            $('#Label2').parent().parent().html("");
            $('.lines')[0].remove();

        }
        else if(current_url=='/outer/entSelect/listDetail.html'){
            add_btn();
            $("#btn_print_all").click(function () {
                //console.log("打印信息");
                //layer.load();
                //$('#tab-content ')
                let panelList=$('#tagDispayEnt li>a')

                let title="";
                let content="";
                var l=(screen.availWidth-1000)/2;
                var t=(screen.availHeight-716)/2;
                panelList.each(function(index,item){
                    //console.log(item);
                    try {

                        $(item).click();
                        var timeStr = getNowFormatDate();

                        var template =  '<div class="print-break">';

                        template += TITLE
                        template += '<div style="width:711px;"><font face="黑体" size="3px">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; <span id="texts">';
                        template += $("#tab-content div.active h2").html()+'</span></font></div><br/>';
                        template += '<div>'+$("#tab-content div.active .wrap").html()+'</div>';
                        //console.log($("#tab-content div.active .wrap").html());
                        template += ' <div class="print-time"><span>打印时间：</span><span class="timer">'+timeStr+'</span></div>'
                        template += '<div class="lines" style="width: 100%;height: 5px;background: red;margin-top: 5px;"></div>'
                        template += '</div>';
                        content += template;
                        //console.log(content);
                        if(index!=panelList.length-1){
                            if($(item).html()=="变更信息"){
                                var bg_panel_id=$(item).attr('href').replace('#','');
                                var biangengList=document.getElementById(bg_panel_id).getElementsByTagName("a");
                                for(var j=0;j<biangengList.length;j++){
                                    var clickEvent=$(biangengList[j]).attr('onclick');
                                    clickEvent=clickEvent.replace('detail(', '');
                                    clickEvent=clickEvent.replace(')', '');
                                    clickEvent=clickEvent.replace(/'/g, '');
                                    var parms=clickEvent.split(',');
                                    //console.log(parms);
                                    var entName=encodeURIComponent(parms[2]);
                                    var url='https://amr.sz.gov.cn/outer/entSelect/biangeng.html?id='+parms[0]+"&alttime="+parms[1]+"&entName="+entName+"&altdate="+parms[3]+"&regino="+parms[4];
                                    console.log(url);
                                    getBiangeng(parms[0],parms[1],parms[2],parms[3],parms[4])
                                }
                            }
                        }
                        else{
                            content+=outTemp
                            $("body").attr("title",title);
                            $("body").attr("content",content);
                            //window.open('printPrew.html?type=1','newprintWin','resizable=yes,width=1000,height=716,top='+t+',left='+l+',toolbar=yes,menubar=yes,location=yes,status=yes');
                            //layer.closeAll();


                            var l = (screen.availWidth - 1000) / 2;
                            var t = (screen.availHeight - 716) / 2;
                            console.log(content);
                            var random = Math.round(Math.random()*1000);
                            $.ajax({
                                url : "../entEnt/print.do?andom="+random,
                                data : {
                                    "title" : title,
                                    "content" : content
                                },
                                type : 'post',
                                dataType : "json",
                                success : function(data) {
                                    var Ddata = data.data[0].data;
                                    if (Ddata == "1") {
                                        window.open('printPrew.html?type=1&random='+random, 'newPrintWin', 'resizable=yes,width=1000,height=716,top=' + t + ',left=' + l
                                                    + ',toolbar=yes,menubar=yes,location=yes,status=yes');
                                    }
                                }
                            })
                        }

                    }
                    catch(err){
                        console.log(err)
                    }

                });


            });
        }

    });


})();

