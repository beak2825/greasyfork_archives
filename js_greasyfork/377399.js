// ==UserScript==
// @name         蓝巨星优化
// @namespace    http://mslcb.top/ljx/yh.html
// @version      0.1
// @description  蓝巨星功能优化
// @author       lcb
// @match        *://fang.msljx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377399/%E8%93%9D%E5%B7%A8%E6%98%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/377399/%E8%93%9D%E5%B7%A8%E6%98%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    var edit = 1; // 0.关闭  1.开启编辑 2.开启删除
    'use strict';
    //去除多余菜单
    $(".member-menu li [href='/index/personal/area.html']").remove();
    $(".member-menu li [href='/index/personal/renew.html']").remove();
    //获取页面
    var ljxurl = window.location.href;
    var ifedit = ljxurl.indexOf("edit/id/");
    if(ifedit!=-1){
        //小区名称改为可任意修改
        $(".form-group:eq(0) label").html("小区名称（已破解,可任意修改）");
        $(".form-group:eq(0) input")["0"].outerHTML='<input type="text" href="javascript:history.back()" class="form-control" name="village_name" value="'+$(".form-group:eq(0) input").val()+'">';
        //优化取消按钮
        $(":button:eq(1)")["0"].outerHTML='<a href="javascript:history.back()" class="btn btn-white btn-sm">取消</a>';
        //引入js文件
        var new_element=document.createElement('script');
        new_element.setAttribute('src','/static/libs/layer3.1.1/layer.js');
        document.body.appendChild(new_element);
        //优化提交操作
        $(function () {
            $("#save").click(function () {
                layer.msg('提交中...', {
                    icon: 16,
                    shade: 0.01,
                    time: 10000
                });
                event.preventDefault();
                $.ajax({
                    type: "POST",
                    url: "/index/personal/sell_edit.html",
                    data: $("form").serialize(),
                    dataType: 'json',
                    success: function (ret) {
                        layer.closeAll()
                        if(ret.code==1){
                            layer.msg(ret.msg);
                            setTimeout("javascript:history.back()",1000);
                        }else{
                            layer.msg(ret.msg);
                        }
                        console.log(ret);
                        //console.log($("form").serialize());
                    }
                });
            });

        })


    }
    //主页面
    var ifindex = ljxurl.indexOf("index.html");
    if(ifindex!=-1){
        //去除顶部广告
        $(".ad").remove();
        //去除公告
        $(".notice").remove();
        //去除底部
        $(".wrapper:eq(1)").remove();
        //增加按钮
        if(edit==1){
            var sl = document.getElementsByClassName("collection")
            for (var i=0;i<sl.length;i++){
                var str = document.getElementsByClassName("collection")[i].outerHTML;
                var fyid = str.replace(/[^0-9]/ig,"");
                var bianji = '<a href="/index/personal/sell_edit/id/'+fyid+'.html" class="btn btn-white btn-sm">编辑</a>';
                document.getElementsByClassName("collection")[i].outerHTML=str+bianji;
            }
        }else if(edit==2){
            var fysl = document.getElementsByClassName("collection")
            for (var i2=0;i2<fysl.length;i2++){
                var str2 = document.getElementsByClassName("collection")[i2].outerHTML;
                var fyid2 = str2.replace(/[^0-9]/ig,"");
                var shanchu = '<a href="/index/personal/sell_del/id/'+fyid2+'.html" class="btn btn-white btn-sm">删除</a>';
                document.getElementsByClassName("collection")[i2].outerHTML=str2+shanchu;
            }
        }
    }
    //房源管理界面
    var ifpersonal = ljxurl.indexOf("personal");
    if(ifpersonal!=-1){
        //引入js文件
        var new_element=document.createElement('script');
        new_element.setAttribute('src','/static/libs/layer3.1.1/layer.js');
        document.body.appendChild(new_element);
        //判断包证编号
        function bzbh(bzw){
            var bz = Array("不限","包证","不包证","包更名","不包更名","净得","证议","/㎡包证","/㎡不包证","/㎡包更名","/㎡不包更名","/㎡净得","/㎡证议","面议","原价"," ","/月","/㎡月","/年");
            var fh = "erro";
            for (var i=0;i<bz.length;i++){
                if(bz[i]==bzw){
                    fh=i
                }
            }
            return fh;
        }
        //增加单个刷新
        var cs =$(".tableuser li").length;
        var sx = new Array(cs);
        for (var i=1;i<cs;i++){
            var fyid=$(".tableuser li:eq("+i+") span:eq(1) a:eq(0)").attr("href").replace(/[^0-9]/ig,"");//房源id
            var xq=$(".tableuser li:eq("+i+") span:eq(0)").text();//小区
            var lc=$(".tableuser li:eq("+i+") span2:eq(0)").text().replace(/[^0-9]/ig,"");//楼层
            var hx=$(".tableuser li:eq("+i+") span2:eq(1)").text();//户型
            var mj=$(".tableuser li:eq("+i+") span2:eq(2)").text().replace(/[^0-9]/ig,"")/100;//面积
            var jg=$(".tableuser li:eq("+i+") span2:eq(3)").text().replace(/[^0-9]/ig,"")/100;//价格
            var baoz=bzbh($(".tableuser li:eq("+i+") span2:eq(4)").text());//包证
            var bz=$(".tableuser li:eq("+i+") span3:eq(0)").html();//备注
            var dh=$(".tableuser li:eq("+i+") span4:eq(0)").html();//短号
            //sx[i]='id='+fyid+'&village_name='+xq+'&apartment_layout='+hx+'&floor='+lc+'&acreage='+mj+'&price='+jg+'&cert='+baoz+'&cornet='+dh+'&remark='+bz;
            sx[i]=encodeURI('id='+fyid+'&village_name='+xq+'&apartment_layout='+hx+'&floor='+lc+'&acreage='+mj+'&price='+jg+'&cert='+baoz+'&cornet='+dh+'&remark='+bz);
            //插入刷新按钮
            $(".tableuser li:eq("+i+") span:eq(1)").append('<a id="'+i+'" class="btn btn-white btn-sm">刷新</a>');
        }
        $(".btn.btn-white.btn-sm").click(function(){
            if($(this).index()!==0){
                $.ajax({
                    type: "POST",
                    url: "/index/personal/sell_edit.html",
                    data: sx[$(this).attr("id")],
                    dataType: 'json',
                    success: function (ret) {
                        layer.closeAll()
                        if(ret.code==1){
                            layer.msg("刷新成功");
                        }else{
                            layer.msg(ret.msg);
                        }
                        //console.log(ret);
                    }
                });
                //console.log(sx[$(this).attr("id")]);
            }
        });
        //增加一键刷新
        $(".navtabs").append('<li class="active" ><a href="#" id="yjsx">一键刷新本页</a></li>')
        $("#yjsx").click(function(){
            for (var i=1;i<sx.length;i++){
                $.ajax({
                    type: "POST",
                    url: "/index/personal/sell_edit.html",
                    data: sx[i],
                    dataType: 'json',
                    success: function (ret) {
                        layer.closeAll()
                        if(ret.code==1){
                            //layer.msg("刷新成功");
                        }else{
                            //layer.msg(ret.msg);
                        }
                        //console.log(ret);
                    }
                });
            }
            layer.msg("刷新完毕!!");
        });
    }

})();