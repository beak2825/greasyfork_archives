// ==UserScript==
// @name         选品添加主品
// @namespace    http://tampermonkey.net/
// @version      2024-06-02
// @description  专用的
// @author       You
// @match       https://shopee.co.th/*
// @match       https://detail.1688.com/offer/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mabangerp.com
// @grant GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/501044/%E9%80%89%E5%93%81%E6%B7%BB%E5%8A%A0%E4%B8%BB%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/501044/%E9%80%89%E5%93%81%E6%B7%BB%E5%8A%A0%E4%B8%BB%E5%93%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function jisuan_roi(that_click){
        $(that_click).closest('.thisMsg').find('.jisuan_roi').each(function(index, value) {
            if(index>0){
            var saleprice = parseFloat($(value).find('.mx1').val().replace(/[^0-9.]/g, ''));
            var yongjin = parseFloat($(value).find('.cg0').val()/100);
            var chengben = parseFloat($(value).find('.cg1').val());
            var wuliu = parseFloat($(value).find('.cg2').val());
            var baocai = parseFloat($(value).find('.cg3').val());
                var zongchengben=yongjin*saleprice+chengben+wuliu+baocai;
                var maolilv=1-zongchengben/saleprice;
            $(this).find('.cg4').val((maolilv.toFixed(3)*100).toFixed(3)+"%");
                $(this).find('.cg5').val((1/maolilv).toFixed(3));
            }
        });
    }
    function update_input(father_id,that_click){//更新输入数据
        var this_class="";
        var typea="";
        if ($(that_click).hasClass('caigoua') || $(that_click).hasClass('xiaoshou') || $(that_click).hasClass('fuzhia')  || $(that_click).hasClass('fuzhib')) {
    // 如果当前对象包含class 'caigoua'，执行这里的代码
            this_class=".caigoua";
            typea="xp_xuanpin";
        } else  if ($(that_click).hasClass('caigoua1')  || $(that_click).hasClass('xiaoshou1')  || $(that_click).hasClass('fuzhia1')  || $(that_click).hasClass('fuzhib1')){
            // 如果当前对象不包含class 'caigoua'，执行这里的代码
            this_class=".caigoua1";
            typea="xp_jp";
        }
    var values = '';
        $(that_click).closest('.thisMsg').find(this_class).each(function(index, element) {
        if (index > 0 && index % 6 == 0) {
            values += '分行';
        }
        if (index > 0 && index % 6 != 0) {
             values += '分隔';
        }
        values += $(element).val();

    });
        console.log("触发采购成本计算")
        console.log("father_id="+ father_id.slice(2)+"&update_cg=" + values+"&type=" + typea)
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "father_id="+ father_id.slice(2)+"&update_cg=" + values+"&type=" + typea,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
                console.log(r)
            }
        });
    }

    function update_xiaoshou(father_id,that_click){//更新输入数据
                var this_class="";
        var typea="";
        if ($(that_click).hasClass('xiaoshou')  || $(that_click).hasClass('fuzhib') || $(that_click).hasClass('fuzhia')) {
    // 如果当前对象包含class 'caigoua'，执行这里的代码
            this_class=".xiaoshou";
            typea="xp_xuanpin";
        } else  if ($(that_click).hasClass('xiaoshou1')  || $(that_click).hasClass('fuzhib1')  || $(that_click).hasClass('fuzhia1')){
            // 如果当前对象不包含class 'caigoua'，执行这里的代码
            this_class=".xiaoshou1";
            typea="xp_jp";
        }
    var values = '';
        $(that_click).closest('.thisMsg').find(this_class).each(function(index, element) {
        if (index > 0 && index % 4 == 0) {
            values += '分行';
        }
        if (index > 0 && index % 4 != 0) {
             values += '分隔';
        }
        if ($(this).is('span')) {
            values += $(element).text();
        } else if ($(this).is('input')) {
            values += $(element).val();
        }


    });
        console.log("father_id="+ father_id.slice(2)+"&update_xs=" + values+"&type=" + typea)
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "father_id="+ father_id.slice(2)+"&update_xs=" + values+"&type=" + typea,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
                console.log(r)
            }
        });
    }
    function postdata_jp(dataa,father_id) {
       // console.log(dataa)
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "father_id="+ father_id+"&dataa_jp=" + dataa+"&jpurl=" + encodeURIComponent(window.location.href),
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
               // console.log(r)
                getxpdata()
            }
        });
    }
    function postdata(dataa) {
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "caozuo=" + $("#caozuo").val()+"&dataa=" + dataa+"&xpurl="+encodeURIComponent(window.location.href),
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
                getxpdata()
                console.log(r)
            }
        });
    }
        function getxpdata_sj(weiyi_id,typea) {
            var leixingxs="xiaoshou1";
            var leixingcg="caigoua1";
            if(typea=="xp_xuanpin"){leixingxs="xiaoshou";leixingcg="caigoua";}
        console.log("调用获取竞品数据详细中间")
        var xphtml = "";
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "weiyi_id="+ weiyi_id+"&xuanpinGET_sj=" + "yes"+"&type=" + typea,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                console.log(r)
                var value = $.parseJSON(r.response)[0];
                console.log(value)
                    var arr = value.neirong.split('哦个');
                    $.each(arr, function(index1, value1) {
                        if (value1.indexOf("分行") !== -1) {
                            var arr1 = value1.split('分行');
                            var arrcg1 = value.caigou.split('分行');
                            $.each(arr1, function(index2, value2) {
                                xphtml=xphtml+"<div class='jisuan_roi' style='width:100%;border-bottom: 2px solid #808080;margin-top:5px;'>";
                                var arr2 = value2.split('分隔');
                                var arrcg2 = arrcg1[index2].split('分隔');
                                var kuandu=10;
                                $.each(arr2, function(index3, value3) {
                                    if(index2>0 && index3==1){
                                        xphtml=xphtml+"<span  style='width:"+kuandu+"%;display: inline-block;'><input data-custom='"+index3+"_"+value.weiyi_ID+"' index-data='"+index2+","+index3+"' class='"+leixingxs+" xs"+index3+"_"+value.weiyi_ID+" mx"+index3+"' type='text' value='"+value3.replace(/￥/g, '')+"' style='color: black;text-align: center;width: 70%;'><button style='width: 20%; color: black; text-align: center; padding: 0px;' class='fuzhib1' data-custom='"+index3+"_"+value.weiyi_ID+"'>↑↓</button></span>";

                                    }
                                    else{
                                    xphtml=xphtml+"<span  class='"+leixingxs+" mx"+index3+"' style='width:"+kuandu+"%;display: inline-block;font-size: 12px;'>"+value3+"</span>";
                                    }
                                });
                                $.each(arrcg2, function(index4, value4) {
                                    if(index2==0){
                                    xphtml=xphtml+"<span  style='width:"+kuandu+"%;display: inline-block;font-size: 12px;'>"+value4+"</span>";
                                    }else{
                                        xphtml=xphtml+"<span  style='width:"+kuandu+"%;display: inline-block;'><input data-custom='"+index4+"_"+value.weiyi_ID+"' index-data='"+index2+","+index4+"' class='"+leixingcg+" cg"+index4+"_"+value.weiyi_ID+" cg"+index4+"' type='text' value='"+value4+"' style='color: black;text-align: center;width: 70%;'><button style='width: 20%; color: black; text-align: center; padding: 0px;' class='fuzhia1' data-custom='"+index4+"_"+value.weiyi_ID+"'>↑↓</button></span>";
                                    }
                                });
                                xphtml=xphtml+"</div>";

                                });
                        } else {
                            if(index1==0){
                                xphtml=xphtml+"<div  style='width:60%;height:140px;float:left;'>";
                            }
                            xphtml=xphtml+"<div  style='width:100%;padding:10px;height: 35px;'>"+value1+"</div>";
                            if(index1==3){
                                xphtml=xphtml+"</div>";
                                xphtml=xphtml+"<div style='width:40%;height:140px;float:left;'><div id='add_cgp' data-father-id='"+value.father_weiyi_id+"' style='width:80px;height:80px;padding:10px;float:left;justify-content: center;align-items: center;display: flex;background-color:black;border: 1px solid white;color: aliceblue;margin-top: 10px;'>添加当前</br>连接到采品</div><div id='content_cg"+value.father_weiyi_id+"'></div></div>";
                            }

                        }


                    });
                $('#content_sj'+value.father_weiyi_id).html(xphtml);

            }
        });
    }
        function getxpdata_cg(father_id) {
            console.log("调用采购品"+father_id)
             $('#content_cg'+father_id).html("");
        var xphtml = "";
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "father_id="+ father_id+"&xuanpinGET_cg=" + "yes",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                //console.log(r.response)
                var jsonObj = $.parseJSON(r.response);

                $.each(jsonObj, function (key, value) {
                    //下面是采购图片
                      xphtml=xphtml+"<div style='width:100px;height:100px;padding:10px;float:left;position: relative;' class='jingpin_cg'><div style='position: absolute;color: red; font-weight: bold;width:80px;'><span style='background-color: blanchedalmond; padding: 0px 1px;'>采品"+key+"</span><span style='background-color: blanchedalmond; padding: 0px 1px;float: right;' id='delete_cp' data-father-id='"+value.father_id+"' data-weiyi-ID='"+value.ID+"'>×</span></div><div style='position: absolute;color: red;font-weight: bold;width:80px;bottom: 10px;'><span style='background-color: blanchedalmond; padding: 0px 1px;float: right;'><a href='"+value.url_lj+"' target='_blank'>🔗</a></span></div><img src='"+value.url+"' style='width:100%;height:100%;'></div>";
                });
                $('#content_cg'+father_id).append(xphtml);
            }
        });
    }
    function getxpdata_jp(father_id) {
        var xphtml = "";
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "father_id="+ father_id+"&xuanpinGET_jp=" + "yes",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
               // console.log(r.response)
                var jsonObj = $.parseJSON(r.response);

                $.each(jsonObj, function (key, value) {
                    //下面是左侧图片
                      xphtml=xphtml+"<div style='width:100px;height:100px;padding:10px;float:left;position: relative;' class='jingpin_xz' data-weiyi-ID='"+value.weiyi_ID+"' data-father-id='"+value.father_id+"'><div style='position: absolute;color: red; font-weight: bold;width:80px;'><span style='background-color: blanchedalmond; padding: 0px 1px;'>竞品"+key+"</span><span style='background-color: blanchedalmond; padding: 0px 1px;float: right;' id='delete_jp' data-father-id='"+value.weiyi_ID+"'  data-weiyi-ID='"+value.ID+"'>×</span></div><div style='position: absolute;color: red;font-weight: bold;width:80px;bottom: 10px;'><span style='background-color: blanchedalmond; padding: 0px 1px;float: right;'><a href='"+value.url_lj+"' target='_blank'>🔗</a></span></div><img src='"+value.url+"' style='width:100%;height:100%;'></div>";
                });
                $('#content_jp'+father_id).append(xphtml);
            }
        });
    }
    function getxpdata() {
        var xphtml = "";
        $('#xuanpin').html(xphtml)
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "xuanpinGET=" + "yes",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
                //console.log(r.response)
// 使用jQuery进行JSON格式化
                var jsonObj = $.parseJSON(r.response);

                $.each(jsonObj, function (key, value) {
                    var beijingse="";
                    if((key+1)%2==1){beijingse="background-color: rgba(128, 128, 128, 0.8);";}
                    xphtml=xphtml+"<div style='display: flex;width:100%;"+beijingse+"' class='thisMsg xpall"+value.weiyi_ID+"'>";
                    //下面是左侧图片
                    xphtml=xphtml+"<div id='content_jp"+value.weiyi_ID+"' style='width:20%;float:left;'><div class='jingpin_xp' style='width:100px;height:100px;padding:10px;float:left;position: relative;'  data-weiyi-ID='"+value.weiyi_ID+"' data-father-id='"+value.weiyi_ID+"'><div style='position: absolute;color: red; font-weight: bold;width:80px;'><span style='background-color: blanchedalmond; padding: 0px 1px;'>选品"+key+"</span><span style='background-color: blanchedalmond; padding: 0px 1px;float: right;' id='delete_xp' data-father-id='"+value.weiyi_ID+"'>×</span></div><div style='position: absolute;color: red;font-weight: bold;width:80px;bottom: 10px;'><span style='background-color: blanchedalmond; padding: 0px 1px;float: right;'><a href='"+value.url_lj+"' target='_blank'>🔗</a></span></div><img src='"+value.url+"' style='width:100%;height:100%;'></div><div id='add_jp' data-father-id='"+value.weiyi_ID+"' style='width:80px;height:80px;padding:10px;float:left;justify-content: center;align-items: center;display: flex;background-color: black;border: 1px solid white;color: aliceblue;margin-top: 10px;'>添加当前</br>连接到竞品"+value.caozuo+"</div></div>";
                      xphtml=xphtml+"<div id='content_sj"+value.weiyi_ID+"' style='width:80%;float:left;max-height: 300px;overflow: auto;'>";
                    var arr = value.neirong.split('哦个');
                    $.each(arr, function(index1, value1) {
                        if (value1.indexOf("分行") !== -1) {
                            var arr1 = value1.split('分行');
                            var arrcg1 = value.caigou.split('分行');
                            $.each(arr1, function(index2, value2) {
                                xphtml=xphtml+"<div class='jisuan_roi' style='width:100%;border-bottom: 2px solid #808080;margin-top:5px;'>";
                                var arr2 = value2.split('分隔');
                                var arrcg2 = arrcg1[index2].split('分隔');
                                var kuandu=10;
                                $.each(arr2, function(index3, value3) {
                                    if(index2>0 && index3==1){
                                        xphtml=xphtml+"<span  style='width:"+kuandu+"%;display: inline-block;'><input data-custom='"+index3+"_"+value.weiyi_ID+"' index-data='"+index2+","+index3+"' class='xiaoshou xs"+index3+"_"+value.weiyi_ID+" mx"+index3+"' type='text' value='"+value3.replace(/￥/g, '')+"' style='color: black;text-align: center;width: 70%;'><button style='width: 20%; color: black; text-align: center; padding: 0px;' class='fuzhib' data-custom='"+index3+"_"+value.weiyi_ID+"'>↑↓</button></span>";

                                    }
                                    else{
                                    xphtml=xphtml+"<span  class='xiaoshou mx"+index3+"' style='width:"+kuandu+"%;display: inline-block;font-size: 12px;'>"+value3+"</span>";
                                    }
                                });
                                $.each(arrcg2, function(index4, value4) {
                                    if(index2==0){
                                    xphtml=xphtml+"<span  style='width:"+kuandu+"%;display: inline-block;font-size: 12px;'>"+value4+"</span>";
                                    }else{
                                        xphtml=xphtml+"<span  style='width:"+kuandu+"%;display: inline-block;'><input data-custom='"+index4+"_"+value.weiyi_ID+"' index-data='"+index2+","+index4+"' class='caigoua cg"+index4+"_"+value.weiyi_ID+" cg"+index4+"' type='text' value='"+value4+"' style='color: black;text-align: center;width: 70%;'><button style='width: 20%; color: black; text-align: center; padding: 0px;' class='fuzhia' data-custom='"+index4+"_"+value.weiyi_ID+"'>↑↓</button></span>";
                                    }
                                });
                                xphtml=xphtml+"</div>";

                                });
                        } else {
                            if(index1==0){
                                xphtml=xphtml+"<div  style='width:60%;height:140px;float:left;'>";
                            }
                            xphtml=xphtml+"<div  style='width:100%;padding:10px;height: 35px;'>"+value1+"</div>";
                            if(index1==3){
                                xphtml=xphtml+"</div>";
                                xphtml=xphtml+"<div style='width:40%;height:140px;float:left;'><div id='add_cgp' data-father-id='"+value.weiyi_ID+"' style='width:80px;height:80px;padding:10px;float:left;justify-content: center;align-items: center;display: flex;background-color:black;border: 1px solid white;color: aliceblue;margin-top: 10px;'>添加当前</br>连接到采品</div><div id='content_cg"+value.weiyi_ID+"'></div></div>";
                            }

                        }


                    });
                    xphtml=xphtml+"</div>";

                    xphtml=xphtml+"</div>";
                    xphtml=xphtml+"<div style='clear: both;border-bottom: 1px solid black; padding-bottom: 5px;'></div>";
                    xphtml=xphtml+"</div>";
                    $('#xuanpin').append(xphtml)
                    xphtml = "";
                    getxpdata_jp(value.weiyi_ID)
                    getxpdata_cg(value.weiyi_ID)
                });



            }
        });
    }

    $(document).ready(function () {
        if (window.location.href.includes('https://detail.1688.com/')) {
            $('body').append('<div id="modal"></div>')
        }
        if ($("#modal").length > 0) {
            $("#modal").append('<div id="toggle" style="z-index: 2147483644;position: fixed;top: 40%;line-height: 100px;display: flex;align-items: center;margin-top: -25px;width: auto;height: 50px;border: 1px solid black;background: crimson;padding: 5px;color: white;" >打开选品</div><div id="sidebar" style="z-index: 2147483646;  width: 0;height: 100vh;background-color: rgba(128, 128, 128, 0.7);color: white;position: fixed;top: 0;left: 0;overflow-x: hidden;transition: 0.5s;"></div>');
        }

        $(document).on("click", "#toggle", function () {

            if ($('#sidebar').html() === '') {
                var divhtml = '';
                divhtml = divhtml + '<div  style="width:100%;height: 150px;background-color:black;  display: flex;justify-content: center;align-items: center;"><div id="close_sidebar" style="position: absolute;top: 8px; right: 8px;width: 24px; height: 24px; background-color: #ccc; border: 1px solid #aaa;cursor: pointer;text-align: center;line-height: 24px;">X</div>';
                divhtml = divhtml + '<button style="padding:20px;margin:10px;color:black;" id="add_product">添加此品到品库</button>';
                divhtml = divhtml + '<div style="padding:20px;margin:10px;color:black;"><input id="caozuo" value="" placeholder="输入你的编号"></div>';
                // divhtml = divhtml + '<button style="padding:20px;margin:10px;color:black;">按钮3</button>';
                divhtml = divhtml + '</div>';

                divhtml = divhtml + '<div id="xuanpin" style="width:100%;">';
                divhtml = divhtml + '</div>';

                divhtml = divhtml + '</div>';

                $('#toggle').text('点击隐藏');
                $('#sidebar').html(divhtml);
                getxpdata();
                $("#sidebar").animate({
                    width: "1080px" // 设置侧边栏的宽度
                });

               if (localStorage.getItem('caozuo') != null && localStorage.getItem('caozuo') != "undefined") {
                // 如果没有 'caozuo'，则创建
                $("#caozuo").val(localStorage.getItem('caozuo'));
            }
            } else {
                $(this).text('打开选品');
            }
        });

    });

    //触发通过js动态添加的主品a
    $(document).on("click", "#add_product", function () {
        if (!window.location.href.includes('shopee.co.th')) {
            alert("只能在虾皮详情页加入选品");
            return;
        }
       if ($("#caozuo").val()=="") {
            alert("输入代表你的编号或名字");
           $("#caozuo").focus();
            return;
        }else{
            localStorage.setItem('caozuo',$("#caozuo").val());
        }
        var heji = [];
        heji.push($('.UBG7wZ:eq(1) picture img').first().attr('src'));
        $('div').filter('.detail-info-list').each(function () {
            // 在这里处理每个匹配的div元素
            heji.push($(this).text());
        });
        var bodytr = "";
        $('.t-table__header tr').each(function () {
            $(this).find('th').each(function () {
                // 在这里处理每个<td>元素
                bodytr = bodytr + $(this).text() + "分隔";
            });
            bodytr = bodytr.replace(/分隔$/, '');
            bodytr = bodytr + "分行";
        });
        //bodytr = bodytr.replace(/分行$/, '');
        $('.t-table__body tr').each(function () {
            $(this).find('td').each(function () {
                // 在这里处理每个<td>元素
                bodytr = bodytr + $(this).text() + "分隔";
            });
            bodytr = bodytr.replace(/分隔$/, '');
            bodytr = bodytr + "分行";
        });
        bodytr = bodytr.replace(/分行$/, '');

        heji.push(bodytr);
        postdata(encodeURIComponent(JSON.stringify(heji)))
    });
        //触发通过js动态添加的竞品
    $(document).on("click", "#add_cgp", function () {
                   // 检查当前窗口的URL是否包含特定字符串
        if (!window.location.href.includes('detail.1688.com')) {
            alert("只能在阿里巴巴加入采购品");
            return;
        }
            var src = $('.img-list-wrapper [ind="2"]').attr('src');
        var fatherid=$(this).data('father-id');
         GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "father_id="+ $(this).data('father-id')+"&urlcg=" + encodeURIComponent(window.location.href)+"&picurl=" +src,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
        console.log("父亲ID"+fatherid);
                getxpdata_cg(fatherid)
                console.log(r)
            }
        });
    });
                //触发删除竞品
    $(document).on("click", "#delete_jp", function () {
        if(!confirm("你确定要删除"+$(this).prev().text()+"吗？")){
            return;
        }
            var father_id = $(this).data('weiyi-id');
        var father_id1 = $(this).data('father-id');
         GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "delete_jp="+ father_id,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
                console.log(r)
                if (r.response != "竞品删除成功") {
                    alert("出错了"+r.response);
                } else {
                    getxpdata_jp(father_id1);
                }
            }
        });
    });
            //触发删除选品
    $(document).on("click", "#delete_xp", function () {
        if(!confirm("你确定要删除"+$(this).prev().text()+"吗？")){
            return;
        }
            var father_id = $(this).data('father-id');
         GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "delete_xp="+ father_id,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
                console.log(r)
                if (r.response === "删除成功") {
                    $(".xpall"+father_id).remove();
                } else {
                    alert("出错了"+r.response);
                }


            }
        });
    });
                //触发通过js动态添加的竞品
    $(document).on("click", "#delete_cp", function () {
        if(!confirm("你确定要删除"+$(this).prev().text()+"吗？")){
            return;
        }
            var father_id = $(this).data('father-id');
        var weiyi_ID = $(this).data('weiyi-id');
         GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.taobaimei.com/thailand/inser_xp.php',
            data: "delete_cp="+ weiyi_ID,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (r) {
                // code
                getxpdata_cg(father_id)

                console.log(r)
            }
        });
    });
    //触发通过js动态添加的竞品
    $(document).on("click", "#add_jp", function () {
           // 检查当前窗口的URL是否包含特定字符串
        if (!window.location.href.includes('shopee.co.th')) {
            alert("只能在虾皮详情页加入竞品");
            return;
        }
        var heji = [];
        heji.push($('.UBG7wZ picture img').first().attr('src'));
        $('div').filter('.detail-info-list').each(function () {
            // 在这里处理每个匹配的div元素
            heji.push($(this).text());
        });
        var bodytr = "";
        $('.t-table__header tr').each(function () {
            $(this).find('th').each(function () {
                // 在这里处理每个<td>元素
                bodytr = bodytr + $(this).text() + "分隔";
            });
            bodytr = bodytr.replace(/分隔$/, '');
            bodytr = bodytr + "分行";
        });
        //bodytr = bodytr.replace(/分行$/, '');
        $('.t-table__body tr').each(function () {
            $(this).find('td').each(function () {
                // 在这里处理每个<td>元素
                bodytr = bodytr + $(this).text() + "分隔";
            });
            bodytr = bodytr.replace(/分隔$/, '');
            bodytr = bodytr + "分行";
        });
        bodytr = bodytr.replace(/分行$/, '');

        heji.push(bodytr);
        //console.log(heji)
        postdata_jp(encodeURIComponent(JSON.stringify(heji)),$(this).data('father-id'))
    });

                //触发通过js动态改变数据列表页
    $(document).on("click", ".fuzhia", function () {
        $('.cg'+$(this).data('custom')).val($(this).prev('input').val());
        jisuan_roi($(this));
        update_input($(this).data('custom'),$(this))
    });
                    //触发批量修改价格
    $(document).on("click", ".fuzhib", function () {
        $('.xs'+$(this).data('custom')).val($(this).prev('input').val());
        jisuan_roi($(this));
        update_xiaoshou($(this).data('custom'),$(this))
        update_input($(this).data('custom'),$(this))
    });
            //触发修改单个采购输入款值
    $(document).on("change", ".caigoua", function () {
                jisuan_roi($(this));
        update_input($(this).data('custom'),$(this))

    });
                //触发单个数改变保存
    $(document).on("change", ".xiaoshou", function () {
        console.log("触发单个数改变")
        jisuan_roi($(this));
        update_xiaoshou($(this).data('custom'),$(this))
        update_input($(this).data('custom'),$(this))
    });


                    //触发竞品点击改变数据列表页
    $(document).on("click", ".fuzhia1", function () {
        $('.cg'+$(this).data('custom')).val($(this).prev('input').val());
        jisuan_roi($(this));
        update_input($(this).data('custom'),$(this))
    });
                    //触发竞品点击批量修改价格
    $(document).on("click", ".fuzhib1", function () {
        $('.xs'+$(this).data('custom')).val($(this).prev('input').val());
        jisuan_roi($(this));
        update_xiaoshou($(this).data('custom'),$(this))
        update_input($(this).data('custom'),$(this))
    });
            //触发竞品点击修改单个采购输入款值
    $(document).on("change", ".caigoua1", function () {
                jisuan_roi($(this));
        update_input($(this).data('custom'),$(this))

    });
                //触发竞品点击单个数改变保存
    $(document).on("change", ".xiaoshou1", function () {
        console.log("触发竞品单个数改变")
        jisuan_roi($(this));
        update_xiaoshou($(this).data('custom'),$(this))
        update_input($(this).data('custom'),$(this))
    });

        //触发通过js动态改变数据列表页
    $(document).on("click", ".jingpin_xz", function () {
        console.log($(this).data('father-id'))
        var fatherid=$(this).data('father-id')
        getxpdata_sj($(this).data('weiyi-id'),"xp_jp")
            setTimeout(function() {
        // 这里是你想要延迟执行的代码
                getxpdata_cg(fatherid)
            }, 3000);
        
    });

        //触发选品改变数据列表页
    $(document).on("click", ".jingpin_xp", function () {
        console.log($(this).data('father-id'))
        var fatherid=$(this).data('father-id')
        getxpdata_sj($(this).data('weiyi-id'),"xp_xuanpin")
            setTimeout(function() {
        // 这里是你想要延迟执行的代码
                getxpdata_cg(fatherid)
            }, 3000);
    });

        $(document).on("click", "#close_sidebar", function () {
        $('#sidebar').empty();
        $("#sidebar").animate({
            width: "0" // 设置侧边栏的宽度
        });
        $("#toggle").text('打开选品');
    });

    $(document).click(function () {
        if($("#sidebar").width()=="1080"){
        event.stopPropagation(); // 阻止点击事件冒泡到document
        }
        //console.log("清空")
        //$('#sidebar').empty();
        //$("#sidebar").animate({
         //   width: "0" // 设置侧边栏的宽度
       // });
       // $("#toggle").text('打开选品');
    });
    // Your code here...
})();