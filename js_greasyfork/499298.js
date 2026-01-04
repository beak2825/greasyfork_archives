// ==UserScript==
// @name 导出京东订单新版
// @namespace win.somereason.web.utils
// @version 2024.06.30.3
// @description 这个脚本帮助你导出京东的订单列表页中的订单,仅限本页，列头包括【订单编号, 下单日期, 店铺名称, 商品名称, 商品分类, 商品主图, 商品链接, 交易快照, 单价, 数量, 退款状态, 实付款, 交易状态, 订单详情链接, 快照商品名称,查看发票链接,收件信息,单子类别】，文件名增加年份和分页。此脚本基于作者somereason修改。
// @author somereason，tkeelee
// @date 2024-06-30
// @match *://order.jd.com/center/list.action*
// @grant none
// @license  AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/499298/%E5%AF%BC%E5%87%BA%E4%BA%AC%E4%B8%9C%E8%AE%A2%E5%8D%95%E6%96%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/499298/%E5%AF%BC%E5%87%BA%E4%BA%AC%E4%B8%9C%E8%AE%A2%E5%8D%95%E6%96%B0%E7%89%88.meta.js
// ==/UserScript==

(function () {

    $($(".mt h3")[0]).html($($(".mt h3")[0]).html() + "&nbsp<button id='srBtnExport' style='background-color: #e2231a;color: white;border: 0px;border-radius: 4px;'>添加本页订单</button>")
    
    $("#srBtnExport").click(function (e) {
        const header = ["订单编号", "下单日期", "店铺名称", "商品名称", "商品分类", "商品主图", "商品链接", "交易快照", "单价", "数量", "退款状态", "实付款", "交易状态", "订单详情链接", "快照商品名称","查看发票链接","收件信息","单子类别"];
        var content = header.join(",")+"\n";

        var title=$('.time-txt').text();
        var page=$('.pagin>a.current').text();
        
        content += getOrderListStr();
        var filename = "京东订单导出"+title+page+".csv";
        createAndDownloadFile(filename, content);
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
                trade_id: "单号"+$(this).find(".number a").text().trim().replace(/\s+/, ""),//下单编号
                trade_time: $(this).find(".dealtime").text(),//下单日期
                shop_name: $(this).find(".order-shop").text().trim().replace(/\s+/, ""),//店铺名称
                goods_name: $(this).next().find(".p-name").text().trim().replace(/\s+/, ""),//商品名称
                goods_type:"",//分类
                goods_mainpic: "https:"+$(this).next().find(".p-img img").attr("src"),//商品主图
                goods_link: "https:"+$(this).next().find(".p-name a").attr("href"),//商品链接
                trade_napshot: "https:"+$(this).next().find(".status a").attr("href"),//交易快照
                goods_uprice:"",//单价
                goods_number: $(this).next().find(".goods-number").text().trim().replace(/\s+/, ""),//数量
                trade_unstatus: $(this).next().find(".order-status").text().trim().replace(/\s+/, ""),//退款状态
                trade_amount: $(this).next().find(".amount span:first-child").text().replace("总额", "").trim().replace(/\s+/, ""),//实付款
                trade_status: $(this).next().find(".order-status").text().trim().replace(/\s+/, ""),//交易状态
                trade_detaillink: "https:"+$(this).next().find(".status a").attr("href"),//订单详情链接
                goods_snapshotname: $(this).next().find(".p-name").text().trim().replace(/\s+/, ""),//快照商品名称
                trade_invoice: "https:"+$(this).next().find(".operate a").attr("href"),//查看发票
                trade_postinfo:$(this).next().find(".tooltip .pc").text().trim().replace(/\s+/, " "),//收件信息
                trade_subtype:""//主单子单信息
            };
            if($(this).find(".split-row").length>0) {
                ele.trade_subtype = "主单"+$(this).find(".number a").text().trim().replace(/\s+/, "");
                ele.shop_name          = $(this).next().find(".order-shop").text().trim().replace(/\s+/, "");
                ele.goods_name         = "";
                ele.goods_type         = "";
                ele.goods_mainpic      = "";
                ele.goods_link         = "";
                ele.trade_napshot      = "";
                ele.goods_uprice       = "";
                ele.goods_number       = "";
                ele.trade_unstatus     = "";
                ele.trade_amount       = "";
                ele.trade_status       = "";
                ele.trade_detaillink   = "";
                ele.goods_snapshotname = "";
                ele.trade_invoice      = "";
                ele.trade_postinfo     = "";
            }
            if($(this).parent().attr('class') != undefined){
                ele.trade_subtype = "子单"+$(this).parent().attr('class').replace("split-tbody parent-","");
            }

            //子订单的明细,可能有多个商品
            var arr = $(this).nextAll();
            var str1 = "";
            //把子订单中每个商品的商品名和商品数量拼接到一个字符串中,逗号分隔.
            for (var i = 0; i < arr.length; i++) {
                str1 += $(arr[i]).find(".p-name").text().trim();//每个商品的商品名
                str1 += "(" + $(arr[i]).find(".goods-number").text().trim() + ")";//每个商品的购买数量
                if(i+1 != arr.length){
                  str1 += ","
                }
            }
            ele.goods_name = str1.replace(",()","");
            //str += `"${ele.billId}","${ele.time}","${ele.status}","${ele.amount}","${ele.title}"`;//输出,只支持ES6

            str += `"${ele.trade_id}","${ele.trade_time}","${ele.shop_name}","${ele.goods_name}","${ele.goods_type}","${ele.goods_mainpic}",\
            "${ele.goods_link}","${ele.trade_napshot}","${ele.goods_uprice}","${ele.goods_number}","${ele.trade_unstatus}","${ele.trade_amount}",\
            "${ele.trade_status}","${ele.trade_detaillink}","${ele.goods_snapshotname}","${ele.trade_invoice}","${ele.trade_postinfo}",\
            "${ele.trade_subtype}"\
            `;//输出,只支持ES6

            //$(this).parent().parent().parent().find("tbody").length 多少条记录
            //$(this).parent().parent().parent().find(".time-txt").text();
            
            str += "\n";
        })
      
        return str;
    }
    //生成文件并下载
    function createAndDownloadFile(fileName, content,header) {
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