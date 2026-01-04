// ==UserScript==
// @name         OA简洁样式
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       Jackie.Feng
// @match        http://oa.jusdascm.com/Main.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34542/OA%E7%AE%80%E6%B4%81%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/34542/OA%E7%AE%80%E6%B4%81%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==
/* jshint -W097 */

$(function(){
    var jf={
        icon:['fa-calendar-o','fa-bar-chart','fa-bars','fa-desktop','fa-vcard-o','fa-volume-control-phone','fa-user','fa-cogs'],
        nemulist:function(id){

            $.get("/Controler/GetNavigation.ashx?actionType=2&moduleID="+id+"&randomCode="+Math.random(),function(data,status){
                var str_two ='<ul id="menulist" >';
                var objtwo= eval(data);
                for(var j=0;j<objtwo.length;j++){

                    str_two=str_two+"<li id='"+objtwo[j].ModuleID+"'><span>"+objtwo[j].ModuleName+"</span><ul>";

                    for(var k=0;k<objtwo[j].Sys_Module.length;k++){
                        str_two=str_two+'<li><a href="javascript:void(0)" onclick="addTab(\''+objtwo[j].Sys_Module[k].ModuleName+'\',\''+objtwo[j].Sys_Module[k].WebUrl +'?ModuleID=' + objtwo[j].Sys_Module[k].ModuleID+objtwo[j].Sys_Module[k].UrlPara+'\',\'\');" '+
                            ' ><span class="nav">' + objtwo[j].Sys_Module[k].ModuleName + '</span></a></li>';
                    }
                    str_two=str_two+"</ul></li>";
                }
                str_two=str_two+"</ul>";
                $('#dlg').html(str_two);
                $('#menulist').tree({
                    onClick: function(node){
                        $('#dlg').dialog('close');
                    }
                });
            });
        },
        getfirstnemu:function(){
            var loginName=  $('.headerHelp').find('li').first().text().split(',')[1];
            //取第一層菜單
            $.get("/Controler/GetNavigation.ashx?actionType=1&randomCode="+Math.random(),function(data,status){
                var str_one ="<div class='easyui-panel' style='padding:4px 15px 2px 0px;margin-top:0px;margin-bottom:0px;text-align:right;background-color:#FFAD01;color:#fff;font-weight:bolder;overflow-y: hidden;'>"+
                    "<img src='http://10.146.211.52/Content/img/2.png' style='float:left;height:20px;padding-top:5px'/><span style='float:left;line-height:25px;padding-left:6px;font-weight:bolder;font-size:16px;'>協同辦公平台</span>";
                var objone= eval(data);
                for(var i=0;i<objone.length;i++){
                    str_one=str_one+'<a href="#" class="easyui-linkbutton firstnemu" style="color:#fff" id="'+objone[i].ModuleID+'" data-options="toggle:true,group:\'g2\',plain:true">'+
                        '<i class="fa fa-lg '+jf.icon[i]+'" style="margin-right:8px;color:#cc6600"></i>'+objone[i].ModuleName+'</a>';
                }
                str_one=str_one+'<a href="#" class="easyui-linkbutton firstnemu" style="color:#fff" id="loginName" data-options="toggle:true,group:\'g2\',plain:true"><i class="fa fa-lg fa-user-circle-o" style="margin-right:8px;color:#cc6600"></i>'+loginName+'</a></div>';
                // console.log(str_one);
                // $('#opt_info').parent().parent().before(str_one);
                $('#northdiv').html(str_one);
                $('.easyui-panel').panel({height:35});
                $('.firstnemu').linkbutton();

                $(".firstnemu").css("font-size","26px");

                $(".firstnemu").mouseover(function(){
                    $(this).css({"background-color":"#fff","color":"#FFAD01"});
                    $(this).find('i').css({"color":"#cc6600"});
                }).mouseout(function(){
                    $(this).css({"background-color":"#FFAD01","color":"#fff"});
                    $(this).find('i').css({"color":"#cc6600"});
                });

                $('.firstnemu').click(function(){
                    if(this.id=="loginName"){
                        $.messager.confirm('登出系統', '您確定登出系統嗎?', function(r){
                            if (r){
                                window.location.href='LogOff.aspx';
                            }
                        });
                    }else{
                        $('#menulist').remove();
                        jf.nemulist(this.id);
                        $('#dlg').dialog('open');
                    }

                });
            });
        },
        pageload:function(){
            $('.easyui-layout').layout('remove','west');
            $('.easyui-layout').layout('remove','north');
            $('body').layout('add',{
                id:'northdiv',
                region: 'north',
                height: 36,
                split: false
            });
            jf.initDailog("Menu");
            $('#tabs').tabs({pill:true,plain:true});
        },
        initDailog:function(tl){
            var  dlg= $('<div id="dlg"><div/>').appendTo('body');
            dlg.dialog({
                title: tl,
                width: 300,
                height:420,
                cache: false,
                closed:true,
                modal: true,
                buttons: [{
                    text: '關閉',
                    iconCls: 'icon-cancel',
                    handler: function() {
                        dlg.dialog('close');
                    }
                }]
            });
        },
        addCSSRule:function(sheet, selector, rules, index) {
            if(sheet.insertRule) {
                sheet.insertRule(selector + "{" + rules + "}", index);
            }
            else {
                sheet.addRule(selector, rules, index);
            }
        },
        loadCss:function(url){
            var link = document.createElement( "link" );
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName( "head" )[0].appendChild( link );
        },
        init:function(){
            jf.loadCss('https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css');
            jf.addCSSRule(document.styleSheets[0], ".tabs li.tabs-selected a.tabs-inner", "background-color: #fff !important;color: #FFAD01 !important;border:0px !important;border-bottom: 0px double #FFAD01 !important");
            jf.addCSSRule(document.styleSheets[1], ".l-btn-plain-selected, .l-btn-plain-selected:hover", "background: #fff !important;color: #FFAD01 !important;font-weight:bolder");
            jf.pageload();
            jf.getfirstnemu();

        }
    };
    jf.init();



});
