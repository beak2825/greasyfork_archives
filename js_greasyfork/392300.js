// ==UserScript==
// @name         商品编辑助手
// @description  编辑宝贝、编辑描述、编辑手机详情页、查看商品等页面快速跳转
// @namespace    https://greasyfork.org/zh-CN/scripts/392300-%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E5%95%86%E5%93%81%E7%9B%B8%E5%85%B3%E9%A1%B5%E9%9D%A2
// @author       laoame
// @copyright    laoame
// @match        *://item.publish.taobao.com/taobao/manager/render.htm*
// @match        *://item.manager.tmall.com/tmall/manager/render.htm*
// @match        *://xiangqing.wangpu.taobao.com/new_user_panel.htm*
// @match        *://item.publish.taobao.com/sell/publish.htm*
// @match        *://ipublish.tmall.com/tmall/publish.htm*
// @match        *://ipublish.tmall.com/tmall/fastEdit/publish.htm*
// @match        *://detail.tmall.com/item.htm*
// @match        *://item.taobao.com/item.htm*
// @match        *://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm*
// @match        *://item.manager.taobao.com/taobao/manager/render.htm*

// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @version      3.1
// @downloadURL https://update.greasyfork.org/scripts/392300/%E5%95%86%E5%93%81%E7%BC%96%E8%BE%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/392300/%E5%95%86%E5%93%81%E7%BC%96%E8%BE%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var cur_url = window.location.href; //获取往前网页链接
    $(document).ready(function() {
        //退款
        //页面加载完毕之后插入元素
        if (cur_url.indexOf("list_bought_items.htm") != -1) {
            //买家中心-退款
            $('body').append('<style type="text/css">.myeditbut{padding:0;padding:0;display:block;position:absolute;z-index:9999;top:138px;left:50%;margin-left:150px;} .myeditbut button{background-color:#FF5722;color:#fff;border-color:#FF5722;width:175px;height:30px;line-height:18px;padding:2px;cursor:pointer;font-family:tahoma,arial,sans-serif;font-size:12px;border-radius:5px;border-color:#FF5722;border-style:solid;box-shadow:none;}</style>');
            $('body').append('<span class="myeditbut action-o-async-more action-item">'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="tuikuan">打开本页所有订单的退款页面</button>');
        }

        //页面加载完毕之后插入元素
        if (cur_url.indexOf("/taobao/manager/render.htm") != -1) {
            //淘宝宝贝管理
            $('body').append('<style type="text/css">.myeditbut{padding:0;padding:0;display:block;position:absolute;z-index:9999;top:555px;left:50%;margin-left:-228px;} .myeditbut button{margin-left:10px;background-color:#FF5722;color:#fff;border-color:#FF5722}</style>');
            $('body').append('<span class="myeditbut action-o-async-more action-item">'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="pc_edit">编辑商品</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="phone_edit">编辑手机详情页</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="openUrl">查看所有</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="getall">获取本页商品摘要</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="getallid">获取本页商品ID</button></span><textarea style="" id="input"></textarea>');
        }
        if (cur_url.indexOf("item.manager.tmall.com/tmall/manager/render.htm") != -1) {
            //天猫宝贝管理
            $('body').append('<style type="text/css">.myeditbut{padding:0;padding:0;display:block;position:absolute;z-index:9999;top:559px;left:50%;margin-left:-278px;} .myeditbut button{margin-left:8px;background-color:#FF5722;color:#fff;border-color:#FF5722}</style>');
            $('body').append('<span class="myeditbut action-o-async-more action-item">'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="pc_edit">编辑商品</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="only_edit">编辑电脑描述</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="phone_edit">编辑手机详情页</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="openUrl">查看所有</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="getall">获取本页商品摘要</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="getallid">获取本页商品ID</button></span><textarea id="input"></textarea>');
        }
        if (cur_url.indexOf("xiangqing.wangpu.taobao.com") != -1) {
            //手机详情编辑器
            $('body').append('<style type="text/css">.myeditbut{padding:0;padding:0;display:block;position:fixed;z-index:9999;top:360px;left:73px;} .myeditbut button{background-color:#FF5722;color:#fff;border-color:#FF5722;width:60px;height:60px;line-height:18px;padding:10px;}</style>');
            $('body').append('<span class="myeditbut">'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="pc-detail">查看电<br>脑详情</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="phone-detail"   style="float:right;margin-top:70px;left:-180px">查看手<br>机详情</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="edit-pc-detail" style="float:right;margin-top:140px;left:-120px">编辑<br>宝贝</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="getid" style="float:right;margin-top:210px;left:-60px">复制<br>商品ID</button></span><textarea id="input"></textarea>');
        }
        if (cur_url.indexOf("publish.htm") != -1) {
            //编辑宝贝
            $('body').append('<style type="text/css">.myeditbut{padding:0;padding:0;display:block;position:fixed;z-index:9999;top:150px;left:150px;} .myeditbut button{background-color:#FF5722;color:#fff;border-color:#FF5722;width:60px;height:60px;line-height:18px;padding:10px}</style>');
            $('body').append('<span class="myeditbut">'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="edit-phone-detail" style="float:right;left:-180px">编辑手<br>机详情</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="phone-detail"      style="float:right;margin-top:70px;left:-120px">查看手<br>机详情</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="pc-detail"         style="float:right;margin-top:140px;left:-60px">查看电<br>脑详情</button>'+
                '<button type="button" class="next-btn next-btn-default next-btn-normal next-btn-medium" id="getid"             style="float:right;margin-top:210px;">复制<br>商品ID</button></span><textarea id="input"></textarea>');
        }
        if (cur_url.indexOf("item.htm") != -1) {
            //电脑端详情页
            var edit;
            if (cur_url.indexOf("taobao") != -1) {
                edit = document.getElementsByClassName('tb-editor-menu')[0];
            }
            if (cur_url.indexOf("tmall") != -1) {
                edit = document.getElementById('J_EditItem');
            }
            //判断是否属于本店
            $('body').append('<style type="text/css">.myeditbut {padding:0;padding:0;display:block;position:fixed;z-index:9999;top:303px;left:50%;margin-left:-665px}.myeditbut button {background-color:#FF5722;color:#fff;border-color:#FF5722;width:60px;height:60px;line-height:18px;padding:10px;cursor:pointer;font-family:tahoma,arial,sans-serif;font-size:12px;border-radius:5px;border-color:#FF5722;border-style:solid;box-shadow:none;}</style>');
            if (edit.innerText == "编辑") {
                $('body').append('<span class="myeditbut">' +
                    '<button type="button" id="edit-phone-detail" style="margin-left:-60px">编辑手<br>机详情</button>' +
                    '<button type="button" id="edit-pc-detail"    style="float:left;margin-top:70px;">编辑电<br>脑详情</button>' +
                    '<button type="button" id="phone-detail"      style="float:left;margin-top:140px;margin-left:-60px">查看手<br>机详情</button>'+
                    '<button type="button" id="getid"             style="float:left;margin-top:210px;margin-left:-60px;padding: 2px;">复制<br>商品ID</button>' +
                    '<button type="button" id="goToDzsofts"       style="float:left;margin-top:280px;margin-left:-60px;padding: 2px;" title="自动复制本商品ID，并打开第三发打折软件。">前往<br>促销专家</button>' +
                    '<button type="button" id="goToDianPuBao"     style="float:left;margin-top:350px;margin-left:-60px;padding: 2px;" title="自动复制本商品ID，并打开单品宝。">前往<br>单品宝</button>' +
                    '</span><textarea id="input"></textarea>');
            } else {
                $('body').append('<span class="myeditbut">'+
                    '<button type="button" id="phone-detail"      style="margin-left:-60px">查看手<br>机详情</button>'+
                    '<button type="button" id="getid"             style="float:left;margin-top:70px;padding: 2px;">复制<br>商品ID</button>'+
                    '</span><textarea id="input"></textarea>');
            }
        }
    });
    $(document).ready(function() {
        //退款
        $("#tuikuan").bind("click", function() {
            var list = document.getElementsByClassName('text-mod__link___1rXmw text-mod__hover___1TDrR');
            for (var i = 0; i < list.length; i++) {
                if (list[i].text!=null && list[i].text.indexOf("退款/退货") != -1) {
                    window.open(list[i].href);
                }
            }

        });

        //出售中和仓库中的宝贝，打开本页所有宝贝的编辑页
        $("#pc_edit").bind("click", function() {
            var list = document.getElementsByClassName('product-desc-span');
            for (var i = 0; i < list.length; i++) {
                var id;
                if (list[i + 1].innerText.indexOf("编码") != -1) {
                    id = list[i + 1].innerText.split(" ")[0].split(/[:：]/)[1];
                } else {
                    id = list[i + 1].innerText.split(/[:：]/)[1];
                }
                if (cur_url.indexOf("item.publish.taobao.com") != -1) {
                    window.open("https://item.publish.taobao.com/sell/publish.htm?itemId=" + id);
                }
                if (cur_url.indexOf("ipublish.tmall.com") != -1) {
                    window.open("https://ipublish.tmall.com/tmall/publish.htm?id=" + id);
                }
                i = i + 4;
            }
        });
        //出售中和仓库中的宝贝，打开本页所有宝贝的手机详情编辑页
        $("#phone_edit").on("click", function() {
            var list = document.getElementsByClassName('product-desc-span');
            for (var i = 0; i < list.length; i++) {
                var id;
                if (list[i + 1].innerText.indexOf("编码") != -1) {
                    id = list[i + 1].innerText.split(" ")[0].split(/[:：]/)[1];
                } else {
                    id = list[i + 1].innerText.split(/[:：]/)[1];
                }
                window.open("https://xiangqing.wangpu.taobao.com/new_user_panel.htm?templateId=0&itemId=" + id);
                i = i + 4;
            }
        });
        //出售中和仓库中的宝贝，打开本页所有宝贝电脑端详情页
        $("#openUrl").click(function() {
            var list = document.getElementsByClassName('product-desc-span');
            for (var i = 0; i < list.length; i++) {
                var id;
                if (list[i + 1].innerText.indexOf("编码") != -1) {
                    id = list[i + 1].innerText.split(" ")[0].split(/[:：]/)[1];
                } else {
                    id = list[i + 1].innerText.split(/[:：]/)[1];
                }
                if (cur_url.indexOf("item.publish.taobao.com") != -1) {
                    window.open("https://item.taobao.com/item.htm?id=" + id);
                }
                if (cur_url.indexOf("item.manager.tmall.com") != -1) {
                    window.open("https://detail.tmall.com/item.htm?id=" + id);
                }
                i = i + 4;
            }
        });
        //天猫出售中和仓库中的宝贝，打开本页所有宝贝的电脑端描述编辑页
        $("#only_edit").click(function() {
            var list;
            if (cur_url.indexOf("item.manager.tmall.com") != -1) {
                list = document.getElementsByClassName('product-desc-span');
                for (var i = 0; i < list.length; i++) {
                    var id;
                    if (list[i + 1].innerText.indexOf("编码") != -1) {
                        id = list[i + 1].innerText.split(" ")[0].split(/[:：]/)[1];
                    } else {
                        id = list[i + 1].innerText.split(/[:：]/)[1];
                    }
                    window.open("https://ipublish.tmall.com/tmall/fastEdit/publish.htm?itemId=" + id);
                    i = i + 4;
                }
            }
        });
        //出售中和仓库中的宝贝，获取本页所有商品的ID/名称/链接
        $("#getall").click(function() {
            var allshop = "";
            var list = document.getElementsByClassName('product-desc-span');
            for (var i = 0; i < list.length; i++) {
                var name = list[i].innerText + ";";
                var id;
                if (list[i + 1].innerText.indexOf("编码") != -1) {
                    id = list[i + 1].innerText.split(" ")[0].split(/[:：]/)[1] + ";";
                } else {
                    id = list[i + 1].innerText.split(/[:：]/)[1] + ";";
                }
                var url = "https://item.taobao.com/item.htm?id=" + id;
                allshop = allshop + "id:" + id + name + url + "\r\n";
                i = i + 4;
            }
            //将结果传入到文本框，再从文本框复制到剪贴板
            var input = document.getElementById("input");
            input.value = allshop; // 修改文本框的内容
            input.select(); // 选中文本框
            document.execCommand("copy"); // 执行浏览器复制命令
            alert("获取成功，已置入剪贴板！");
            input.value = ""
        });
        //出售中和仓库中的宝贝，获取本页所有商品的ID
        $("#getallid").click(function() {
            var allshop = "";
            var list = document.getElementsByClassName('product-desc-span');
            for (var i = 0; i < list.length; i++) {
                var id;
                if (list[i + 1].innerText.indexOf("编码") != -1) {
                    id = list[i + 1].innerText.split(" ")[0].split(/[:：]/)[1] + ",";
                } else {
                    id = list[i + 1].innerText.split(/[:：]/)[1] + ",";
                }
                allshop = allshop  + id ;
                i = i + 4;
            }
            //将结果传入到文本框，再从文本框复制到剪贴板
            var input = document.getElementById("input");
            input.value = allshop; // 修改文本框的内容
            input.select(); // 选中文本框
            document.execCommand("copy"); // 执行浏览器复制命令
            alert("获取成功，已置入剪贴板！");
            input.value = ""
        });
        //单品页获取ID
        $("#getid").click(function() {
            var id = "";
            if (cur_url.indexOf("id=") != -1) {
                id = window.location.href.split("id=")[1];
            }
            if (cur_url.indexOf("itemId=") != -1) {
                id = window.location.href.split("itemId=")[1];
            }
            if (id.indexOf("&") != -1) {
                id = id.split("&")[0];
            }
            if (id.indexOf("#") != -1) {
                id = id.split("#")[0];
            }
            //将结果传入到文本框，再从文本框复制到剪贴板
            var input = document.getElementById("input");
            input.value = id; // 修改文本框的内容
            input.select(); // 选中文本框
            document.execCommand("copy"); // 执行浏览器复制命令
            alert("获取成功，已置入剪贴板！");
            input.value = ""
        });

        //前往第三方打折软件
        $("#goToDzsofts").click(function() {
            var id = "";
            if (cur_url.indexOf("id=") != -1) {
                id = window.location.href.split("id=")[1];
            }
            if (cur_url.indexOf("itemId=") != -1) {
                id = window.location.href.split("itemId=")[1];
            }
            if (id.indexOf("&") != -1) {
                id = id.split("&")[0];
            }
            if (id.indexOf("#") != -1) {
                id = id.split("#")[0];
            }
            //将结果传入到文本框，再从文本框复制到剪贴板
            var input = document.getElementById("input");
            input.value = id; // 修改文本框的内容
            input.select(); // 选中文本框
            document.execCommand("copy"); // 执行浏览器复制命令
            //alert("获取成功，已置入剪贴板！");
            input.value = ""
            window.open("https://promotion.dzsofts.net/limit_discount");
        });
        //前往单品宝
        $("#goToDianPuBao").click(function() {
            var id = "";
            if (cur_url.indexOf("id=") != -1) {
                id = window.location.href.split("id=")[1];
            }
            if (cur_url.indexOf("itemId=") != -1) {
                id = window.location.href.split("itemId=")[1];
            }
            if (id.indexOf("&") != -1) {
                id = id.split("&")[0];
            }
            if (id.indexOf("#") != -1) {
                id = id.split("#")[0];
            }
            //将结果传入到文本框，再从文本框复制到剪贴板
            var input = document.getElementById("input");
            input.value = id; // 修改文本框的内容
            input.select(); // 选中文本框
            document.execCommand("copy"); // 执行浏览器复制命令
            //alert("获取成功，已置入剪贴板！");
            input.value = ""
            window.open("https://aliyx.taobao.com/itemAct/index.html");
        });

        //当前商品跳转>>电脑详情页
        $("#pc-detail").on("click", function() {
            var id = "";
            if (cur_url.indexOf("id=") != -1) {
                id = window.location.href.split("id=")[1];
            }
            if (cur_url.indexOf("itemId=") != -1) {
                id = window.location.href.split("itemId=")[1];
            }
            window.open("https://item.taobao.com/item.htm?id=" + id);
        });
        //当前商品跳转跳转>>网页版手机详情页
        $("#phone-detail").on("click", function() {
            var id = "";
            if (cur_url.indexOf("id=") != -1) {
                id = window.location.href.split("id=")[1];
            }
            if (cur_url.indexOf("itemId=") != -1) {
                id = window.location.href.split("itemId=")[1];
            }
            window.open("https://h5.m.taobao.com/awp/core/detail.htm?id=" + id);
        });
        //当前商品跳转>>手机详情页编辑
        $("#edit-phone-detail").on("click", function() {
            var id = "";
            if (cur_url.indexOf("id=") != -1) {
                id = window.location.href.split("id=")[1];
            }
            if (cur_url.indexOf("itemId=") != -1) {
                id = window.location.href.split("itemId=")[1];
            }
            window.open("https://xiangqing.wangpu.taobao.com/new_user_panel.htm?templateId=0&itemId=" + id);
        });
        //当前商品跳转>>编辑商品
        $("#edit-pc-detail").on("click", function() {
            var id = "";
            if (cur_url.indexOf("id=") != -1) {
                id = window.location.href.split("id=")[1];
            }
            if (cur_url.indexOf("itemId=") != -1) {
                id = window.location.href.split("itemId=")[1];
            }

            //判断商品属性
            if (cur_url.indexOf("detail.tmall.com") != -1) {
                window.open("https://ipublish.tmall.com/tmall/publish.htm?id=" + id);

            } else if (cur_url.indexOf("item.taobao.com") != -1){
                window.open("https://item.publish.taobao.com/sell/publish.htm?itemId=" + id);
            } else {
                //无法确定商品属性，弹出提示框等用户选择。
                if (confirm("这是一个天猫商品吗？") == true) {
                    window.open("https://ipublish.tmall.com/tmall/publish.htm?id=" + id);
                } else {
                    window.open("https://item.publish.taobao.com/sell/publish.htm?itemId=" + id);
                }
            }
        });
    });
})();