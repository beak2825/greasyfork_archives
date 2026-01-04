// ==UserScript==
// @name         暮光脚本
// @namespace    http://tampermonkey.net/
// @version      2.9.4
// @description  暮光
// @license      MIT
// @author       lampon
// @match        http://www.muguang.cc/admincp/Purchase/purchase/purchase_id/*
// @match        *://www.yinwu2020.com/admincp/Order/detail/act/add.html
// @match        *://www.yinwu2020.com/admincp/Order/detail/act/scheduling/order_id/*
// @match        *://muguang.doing.net.cn/admincp/Order/detail/act/add.html
// @match        *://muguang.doing.net.cn/admincp/Order/detail/act/scheduling/order_id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=muguang.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452977/%E6%9A%AE%E5%85%89%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/452977/%E6%9A%AE%E5%85%89%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    "use strict";
    if (window.location.origin == "http://www.muguang.cc") {
        var date = new Date();
        var msSample = 14* (1000 * 60 * 60 * 24)
        var newDateSample= new Date(date.getTime() +msSample);

        var yearSample = newDateSample.getFullYear(); //获取当前年份
        var monthSample= newDateSample.getMonth() + 1; //获取当前月份
        var daySample = newDateSample.getDate(); //获取当前日
        if (monthSample.length == 1) {
            monthSample = "0" + monthSample;
        }
        if (daySample.length == 1) {
            daySample = "0" + daySample;
        }

        var msComplete = 15* (1000 * 60 * 60 * 24)
        var newDateComplete= new Date(date.getTime() +msComplete);

        var yearComplete = newDateComplete.getFullYear(); //获取当前年份
        var monthComplete= newDateComplete.getMonth() + 1; //获取当前月份
        var dayComplete = newDateComplete.getDate(); //获取当前日
        if (monthComplete.length == 1) {
            monthComplete = "0" + monthComplete;
        }
        if (dayComplete.length == 1) {
            dayComplete = "0" + dayComplete;
        }


        $("select[name='settle_type']").val("1");
        $("select[name='contract_type']").val("2");
        $("select[name='level_name']").val("正常");
        $("select[name='invoice_type']").val("1");
        $("select[name='audit_id']").val("42");
        $("input[name='sample_time']").val(yearSample + "-" + monthSample + "-" + daySample);
        $("input[name='produce_time']").val(yearComplete + "-" + monthComplete + "-" + dayComplete);

        var form = layui.form;


        $(".tips_box").append(
            '<div id="btnCopy" style="position: fixed;bottom: 40px;right: 100px;z-index:1000"><button id="copy"  class="actives">复制表单信息</button><input type="text" id="txt" /></div>'
        );
        var dataImg = [];
        var imgList = $("#ajaxform .list5_item");
        $.each(imgList, function (index, item) {
            var imgUrl = $(".img_list5", item).attr("src");
            dataImg.push("http://www.muguang.cc" + imgUrl);
        });
        var list = $(".goods_tab .production_line");
        var dataForm = [];
        $.each(list, function (index, item) {
            var shape = $(".shape", item).val();
            var size = $(".size", item).val();
            var num = $(".num", item).val();
            var item_no = $(".item_no", item).val();
            var barcode = $(".barcode", item).val();
            var image = $(".image_img", item).attr("src");
            dataForm.push({ shape: shape, size: size, num: num, item_no: item_no, barcode: barcode, image: "http://www.muguang.cc" + image });
        });
        $("#txt").val(JSON.stringify({ dataImg: dataImg, dataForm: dataForm }));
        document.getElementById("copy").addEventListener("click", function () {
            var input = document.getElementById("txt");
            input.select();
            document.execCommand("Copy");
            layer.msg("复制成功");
        });
        form.render();
    } else if (window.location.href.includes("/admincp/Order/detail/act/add.html")) {
        var date = new Date();
        var msSample = 13* (1000 * 60 * 60 * 24)
        var newDateSample= new Date(date.getTime() +msSample);

        var yearSample = newDateSample.getFullYear(); //获取当前年份
        var monthSample= newDateSample.getMonth() + 1; //获取当前月份
        var daySample = newDateSample.getDate(); //获取当前日
        if (monthSample.length == 1) {
            monthSample = "0" + monthSample;
        }
        if (daySample.length == 1) {
            daySample = "0" + daySample;
        }

        var msComplete = 16* (1000 * 60 * 60 * 24)
        var newDateComplete= new Date(date.getTime() +msComplete);

        var yearComplete = newDateComplete.getFullYear(); //获取当前年份
        var monthComplete= newDateComplete.getMonth() + 1; //获取当前月份
        var dayComplete = newDateComplete.getDate(); //获取当前日
        if (monthComplete.length == 1) {
            monthComplete = "0" + monthComplete;
        }
        if (dayComplete.length == 1) {
            dayComplete = "0" + dayComplete;
        }

        $("select[name='styledesign_id']").val("33");
        $("select[name='merchandiser_id']").val("33");
        $("select[name='level_name']").val("正常");
        $("select[name='process_name']").val("原始文件");
        $("select[name='grade_name']").val("优良");
        $("select[name='audit_id']").val("12");
        $("input[name='sample_time']").val(yearSample + "-" + monthSample + "-" + daySample);
        $("input[name='complete_time']").val(yearComplete + "-" + monthComplete + "-" + dayComplete);

        var form = layui.form;
        //新增订单
        $(".anniu").append('');
        $(".anniu").append('<div style="position:fixed;bottom:20px;right:60px;display:flex; align-content:center;"><textarea  id="content" /><button type="button" class="a_middle" id="create">生成数据</button></div>');
        $("#create").on("click", function () {
            var dataAll = JSON.parse($("#content").val());
            var data = dataAll.dataForm;
            var count = data.length - 1;
            var item = $("#goods_tab .goods_info").clone();

            for (var i = 0; i < count; i++) {
                $(item).clone().appendTo($("#goods_tab"));
            }
            $("#goods_tab .goods_info").each(function (index, item) {
                $(".goods_shape", item).val(data[index].shape);
                $(".goods_size", item).val(data[index].size);
                $(".goods_count", item).val(data[index].num);
                $(".item_no", item).val(data[index].item_no);
                $(".goods_barcode", item).val(data[index].barcode);
                $(".images", item).val(data[index].image);
            });
            var dataImg = dataAll.dataImg;
            var countImg = dataImg.length;
            var html = `<div style="width: 80px; text-align: center; margin: 9px; display: inline-block" class="goods_xc grid-square">
        <input type="hidden" value="/public/upload/orderimages/2022/10-13/f1476c2dc7f4c1fc4344a8863f50396d.png" name="images[]" />
        <img style="width: 80px; height: 80px; object-fit: cover" src="/public/upload/orderimages/2022/10-13/f1476c2dc7f4c1fc4344a8863f50396d.png" onclick="showBig(this);" />
        <div class="fun-line">
          <a
            href="javascript:"
            data-src="/public/upload/orderimages/2022/10-13/f1476c2dc7f4c1fc4344a8863f50396d.png"
            onclick="ClearPicArr2(this,'/public/upload/orderimages/2022/10-13/f1476c2dc7f4c1fc4344a8863f50396d.png',0)"></a>
        </div>
        </div>
        `;
            for (var j = 0; j < countImg; j++) {
                $("#gridDemo").append(html);
            }
            $("#gridDemo .goods_xc").each(function (index, item) {
                $("input", item).val(dataImg[index]);
                $("img", item).attr("src", dataImg[index]);
                $("a", item).attr("data-src", dataImg[index]);
                $("a", item).attr("onclick", "ClearPicArr2(this,'" + dataImg[index] + "',0)");
            });
        });
        form.render();
    } else if (window.location.href.includes("/admincp/Order/detail/act/scheduling/order_id/")) {
        //待排产高效逻辑

        var total = 0;
        $(".fristone .xu tbody tr").each(function (index, item) {
            total += parseInt($("td:eq(4)", item).html());
        });
        $(".anniu").append('<div style="position:fixed;bottom:20px;right:20%;"><button type="button" class="a_middle" id="create">填充数据</button></div>');
        var images = [];
        $(".photo_right img").each(function (index, item) {
            var path = $(item).attr("src");
            images.push(path);
        });
        var date = new Date();
        var ms= 1* (1000 * 60 * 60 * 24)
        var newDate= new Date(date.getTime() +ms);


        var year = newDate.getFullYear(); //获取当前年份
        var month = newDate.getMonth() + 1; //获取当前月份
        var day = newDate.getDate() ; //获取当前日
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }
        var time = $(".detail_box tbody tr:eq(1) td:eq(3) .item_xl").html();
        $(".material .storehouse .material_id").find("option:contains('- 透明材料')").prop("selected", true);
        $(".material .storehouse .material_count").val(1);
        $(".material .storehouse .delivery_time").val(year + "-" + month + "-" + day);
        var infor_bottom = $(".information .infor_bottom").html().trim();

        function findFirstKeyword(str, keywords) {
          return keywords.find(keyword => str.includes(keyword));
        }

        var companies=["联科","然枫","恒志","庆源","千发","神雕","艺都","天驰","德鲁亚","冉冉","卡宝","旭槿","容众","森月","玛仕金"];
        var cmp = findFirstKeyword(infor_bottom, companies);

        var pr_items = ["贴纸包", "贴纸本", "贴纸", "印章", "素材本", "素材包", "素材纸", "胶带","便签"];
        var product = $(".xu .layui-table tbody tr:eq(0) td:eq(1)").html();
        var pr_name = findFirstKeyword(product, pr_items);
        $(".project_name").val(pr_name);




        $(".material .storehouse .supplychain_id").find("option:contains('"+cmp+"')").prop("selected", true);
        $("input[value=319]").click();
        $(".Reviewer  .order_audit_id ").find("option:contains('李梅')").prop("selected", true);
        $("#create").on("click", function () {
            $("#gy_lsitsitem .xu tbody tr td:eq(2) input").val("见排版");
            $("#gy_lsitsitem .xu tbody tr td:eq(3) input").val(total);
         //   $("#gy_lsitsitem .xu tbody tr td:eq(4) input").val(total * 0.03);
               $("#gy_lsitsitem .xu tbody tr td:eq(4) input").val(0);
            $("#gy_lsitsitem .xu tbody tr td:eq(5) input").val(time);
            $(".images319").val(images.join(","));


            $(".industrial_table .machine_id").find("option:contains('"+cmp+"')").eq(1).prop("selected", true);
             layui.use('form', function() {
              var form = layui.form;
            // 重新渲染表单
              form.render();
            });

            var value = $(".information .infor_bottom").html().trim();
            $("#gy_lsitsitem .xu tbody tr td:eq(8) textarea").val(value);
        });
    }
})();
