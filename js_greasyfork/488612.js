// ==UserScript==
// @name         妖火一言版自动发吹牛
// @namespace    yuanter
// @version      1.0.2
// @description  妖火一言版自动发吹牛，使用一言作为标题
// @author       yuanter
// @match        *://yaohuo.me/games/chuiniu/add*
// @match        *://yaohw.com/games/chuiniu/add*
// @match        *://*.yaohuo.me/games/chuiniu/add*
// @match        *://*.yaohw.com/games/chuiniu/add*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488612/%E5%A6%96%E7%81%AB%E4%B8%80%E8%A8%80%E7%89%88%E8%87%AA%E5%8A%A8%E5%8F%91%E5%90%B9%E7%89%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/488612/%E5%A6%96%E7%81%AB%E4%B8%80%E8%A8%80%E7%89%88%E8%87%AA%E5%8A%A8%E5%8F%91%E5%90%B9%E7%89%9B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //初始默认妖精500，可自行修改
    var moren_yaojing = 500;
    //初始默认随机妖精范围值500，即范围区间[0,500]，可自行修改
    var fangwei_yaojing = 500;
    //计算公式：500+随机0到500之间数值,如：500+345=835



    let hitokotoUrl = "https://v1.hitokoto.cn/"
    let one = {};
    function getOne(){
        $.ajax({
            //请求方式
            type:'GET',
            cache:false,
            async:false,
            //发送请求的地址以及传输的数据
            url:hitokotoUrl,
            dataType:"json",
            success: function(data){
                one = data;
            },
            error:function(jqXHR){
                //请求失败函数内容
                console.log('错误原因：',jqXHR);
            },
            failure:function (result) {
                console.log('失败原因：',result);
            },
        });
        return one;
    }


    if (document.title.indexOf("密码") == -1) {
        if (document.title.indexOf("公开挑战") != -1) {
            var toHtml_input = document.getElementsByTagName("input");
            console.log(toHtml_input.length);
            if (toHtml_input.length != 0) {
                //执行获取一言数据
                getOne();
                //==>随机妖晶（删掉的话，那么默认就是500）
                //var yaojing = 500 + Math.ceil(Math.random() * 500);
                var yaojing = moren_yaojing + Math.ceil(Math.random() * fangwei_yaojing);
                toHtml_input[0].value = yaojing;
                if(one.hitokoto != undefined && one.length != 0){
                    toHtml_input[1].value = one.hitokoto;
                    toHtml_input[2].value = "来自：" + one.from;
                    if(one.from_who == undefined || one.from_who == null || one.from_who == ""){
                        toHtml_input[3].value = "作者：佚名";
                    }else{
                        toHtml_input[3].value = "作者：" + one.from_who;
                    }

                }else{
                    //==>随机妖晶（删掉的话，那么默认就是500）
                    toHtml_input[1].value = "我是吹牛逼大神！";
                    toHtml_input[2].value = "不是";
                    toHtml_input[3].value = "当然";
                }
                //==>随机答案（删掉的话，那么默认就是答案一）
                var toHtml_select = document.getElementsByTagName("select");
                toHtml_select[0].value = Math.ceil(Math.random() * 2);
                //==>随机答案（删掉的话，那么默认就是答案一）
                toHtml_input[toHtml_input.length - 1].click();//确定按钮
            } else {
                setTimeout(function () {
                    window.location.href = '/games/chuiniu/add.aspx';
                }, '2000');
            }
        } else {
            console.log("不该运行");
        }
    } else {
        console.log("输入密码");
    }


})();