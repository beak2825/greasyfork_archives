// ==UserScript==
// @name 导出京东订单
// @namespace win.somereason.web.utils
// @version 2018.07.23.1
// @description 这个脚本帮助你导出京东的订单列表页中的订单,仅限本页.
// @author somereason
// @date 2019-04-29
// @match *://order.jd.com/center/list.action*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/382364/%E5%AF%BC%E5%87%BA%E4%BA%AC%E4%B8%9C%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/382364/%E5%AF%BC%E5%87%BA%E4%BA%AC%E4%B8%9C%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

(function () {

    $($(".mt h3")[0]).html($($(".mt h3")[0]).html() + "&nbsp<button id='srBtnExport' style='background-color: #e2231a;color: white;border: 0px;border-radius: 4px;'>导出本页订单</button>")
    $("#srBtnExport").click(function (e) {
        var str = getOrderListStr();
        createAndDownloadFile("京东订单导出.csv", str);
    })
    //获取订单
    function getOrderListStr() {
        var str = "";
        //结构:订单->子订单->子订单明细.
        //最终输出以子订单为主,每个子订单一行(因为考虑订单可能也有用,所以订单也会体现为一行.不需要的话,手工删掉即可)
        //订单明细会被拼接在一起,用,分割,放到子订单的title字段.
        $(".tr-th").each(function () {//订单首行,就是有时间,订单号那行,订单和子订单都有
            //获取时间订单号等.
            var ele = {
                time: $(this).find(".dealtime").text(),
                billId: $(this).find(".number").text().trim().replace(/\s+/, ""),
                amount: $(this).next().find(".amount span:first-child").text().replace("总额", "").trim(),
                status: $(this).next().find(".order-status").text().trim(),
            };
            //子订单的明细,可能有多个商品
            var arr = $(this).nextAll();
            var str1 = "";
            //把子订单中每个商品的商品名和商品数量拼接到一个字符串中,逗号分隔.
            for (var i = 0; i < arr.length; i++) {
                str1 += $(arr[i]).find(".p-name").text().trim();//每个商品的商品名
                str1 += "(" + $(arr[i]).find(".goods-number").text().trim() + ")";//每个商品的购买数量
                str1 += ","
            }
            ele.title = str1;
            str += `"${ele.billId}","${ele.time}","${ele.status}","${ele.amount}","${ele.title}"`;//输出,只支持ES6
            str += "\n";
        })
      
        return str;
    }
    //生成文件并下载
    function createAndDownloadFile(fileName, content) {
        var aTag = document.createElement('a');
        //前面加的那个uFEFF是utf-8 BOM的头,目的是把utf-8的文件变成utf-8 BOM,让excel打开后不会乱码.
        //但是utf-8 BOM是windows独有的, 至于苹果和linux用户会不会正常打开...没试过...
        var blob = new Blob(['\uFEFF' + content],{type:"text/csv,charset=utf-8"});
        aTag.download = fileName;
        aTag.href = URL.createObjectURL(blob);
        //兼容firefox(firefox要求,先插入到document然后删除)
        document.body.appendChild(aTag);
        aTag.click();
        setTimeout(function(){
            document.body.removeChild(aTag);
            URL.revokeObjectURL(blob);
        }, 100);
    }

})();
