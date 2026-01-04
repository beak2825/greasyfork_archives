// ==UserScript==
// @name         票据背书识别
// @namespace    http://tampermonkey.net/
// @description  背书识别
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *.spdb.com.cn/newent/main*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426386/%E7%A5%A8%E6%8D%AE%E8%83%8C%E4%B9%A6%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/426386/%E7%A5%A8%E6%8D%AE%E8%83%8C%E4%B9%A6%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //是否在背面
    var is_fan = $("body > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > form > div:nth-child(6)").text();
    //是否在正面
    var is_zheng = $("#header > div:nth-child(2) > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2)").text();

    //跳转到背书页面
    if(is_fan){
        //session获取上一页票据信息
        var chu_piao_ren = sessionStorage.getItem("chu_piao_ren");
        var shou_piao_ren = sessionStorage.getItem("shou_piao_ren");

        if(chu_piao_ren && shou_piao_ren){

            var result_list = new Array();
            //循环
            $("body > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > form > table > tbody > tr").each(function(index){
                var obj = $(this).find("td.tdleft").text();
                if(index%5 == 0){//抬头类型
                    var result_obj = {
                        title:$(this).text(),
                        chu_name:"",
                        shou_name:""
                    }
                    result_list.push(result_obj);
                }
                if(index%5 == 1){//出
                    result_list[result_list.length - 1].chu_name = obj;
                }
                if(index%5 == 2){//收
                    result_list[result_list.length - 1].shou_name = obj;
                }
            })

            var zhiya_num = 0;//质押
            var baozheng_num = 0;//保证
            var huichupiao_num = 0;//回出票人
            var huishoupiao_num = 0;//回收票人
            var chongfu_num = 0;//重复
            var xiaohuitou_num = 0;//小回头

            var temp_list = new Array();

            var xxx;
            for (xxx in result_list){
                var temp = result_list[xxx];

                if(temp.title == "转让背书"){
                    //回出票人
                    if(chu_piao_ren == temp.shou_name){
                        huichupiao_num += 1;
                    }
                    //回出票人
                    if(huishoupiao_num == temp.shou_name){
                        huishoupiao_num += 1;
                    }
                    //重复
                    if(temp.shou_name == temp.chu_name){
                        chongfu_num += 1;
                    }
                    //小回头
                    if(temp_list.indexOf(temp.shou_name) >= 0){
                        xiaohuitou_num += 1;
                    }

                } else if (temp.title == "质押背书"){
                    //质押
                    zhiya_num += 1;
                } else if (temp.title == "保证"){
                    //质押
                    baozheng_num += 1;
                }

                //排除出票人和收票人集合
                if(temp.shou_name != chu_piao_ren &&
                  temp.shou_name != shou_piao_ren){

                    temp_list.push(temp.shou_name);
                }
            }

            //alert(huichupiao_num + "-" + huishoupiao_num + "-" + chongfu_num + "-" + xiaohuitou_num + "-" + zhiya_num);

            if(zhiya_num > 0 || baozheng_num > 0 || huichupiao_num > 0 || huishoupiao_num > 0 || chongfu_num > 0 || xiaohuitou_num > 0){
                //html代码
                var info_html = '<div style="color:red">';
                if(zhiya_num > 0){
                    info_html += '<div>质押[' + zhiya_num +']次</div>';
                }
                if(huishoupiao_num > 0){
                    info_html += '<div>保证[' + huishoupiao_num +']次</div>';
                }
                if(huichupiao_num > 0){
                    info_html += '<div>回出票人[' + huichupiao_num +']次</div>';
                }
                if(huishoupiao_num > 0){
                    info_html += '<div>回收票人[' + huishoupiao_num +']次</div>';
                }
                if(chongfu_num > 0){
                    info_html += '<div>重复[' + chongfu_num +']次</div>';
                }
                if(xiaohuitou_num > 0){
                    info_html += '<div>小回头[' + xiaohuitou_num +']次</div>';
                }
                info_html += '</div>';

                var info_body = $("body");
                if (info_body) {
                    info_body.prepend(info_html);
                }
            } else {
                //html代码
                var zhengchang_html = '<div>正常</div>';

                var zhengchang_body = $("body");
                if (zhengchang_body) {
                    zhengchang_body.prepend(zhengchang_html);
                }
            }

            //清空session
            sessionStorage.clear();
        }
    } else if(is_zheng) { //跳转到票面
        //html代码
        var down_btn_html = '<div>';
        down_btn_html += '<a href=\'javascript:;\' id=\'shibie\'>识别票据</a>';

        var state = $("#header > div:nth-child(2) > div:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2)").text();
        if(state){
            down_btn_html += '<div>'+state+'</div>';
        }

        var shifou = $("#header > div:nth-child(3) > form > table > tbody > tr:nth-child(10) > td:nth-child(2)").text();
        if(shifou){
            down_btn_html += '<div>'+shifou+'</div>';
        }
        down_btn_html += '</div>';


        //将以上拼接的html代码插入到网页里的ul标签中
        var bq_body = $("#header");
        if (bq_body) {
            bq_body.append(down_btn_html);
        }

        //绑定点击事件
        $("#shibie").click(function(){
            var chu_piao_ren = $("#header > div:nth-child(3) > form > table > tbody > tr:nth-child(1) > td:nth-child(3)").text();
            var shou_piao_ren = $("#header > div:nth-child(3) > form > table > tbody > tr:nth-child(1) > td:nth-child(6)").text();
            //session保存信息
            sessionStorage.setItem("chu_piao_ren", chu_piao_ren);
            sessionStorage.setItem("shou_piao_ren", shou_piao_ren);

            $("#endorsede").click();
        })
    }


})();