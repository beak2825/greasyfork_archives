// ==UserScript==
// @name         EIR批量查询
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  功能介绍：支持EIR批量查询
// @author       You
// @match        http://eir.cmclink.com/default.aspx*
// @match        http://eir.cmclink.com/Default.aspx*
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @resource     iconStandard http://172.28.72.50:6189/install/CFSJS/xlsx.core.min.js
// @run-at       document-end
// @license      No license
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/442925/EIR%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/442925/EIR%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
let css =
    `
.header{
width: 1200px;
}
div#navigation{
width:1200px;
}
div#navigation .mc{
width:1200px;
}
#sub_nav{
width:1200px!important;
}
#img_bag{
width:1200px!important;
}
.mainWrapper{
width:1200px!important;
}
.mainWrapper .sideright{
width:1200px!important;
}
    `
GM_addStyle(css);

(function (){
    $("body").append('<div style="position: fixed; bottom: 20px; left: calc(50% - 100px);"><input id="orderNo" type="text" width="100px" height="25px"/><a style="margin-left:10px" href="javascript:void(0);" id="query">点击查询</a><a style="margin-left:10px" href="javascript:void(0);" id="reset">重置</a><a style="margin-left:10px" href="javascript:void(0);" onclick="btn_export()">导出</a><a style="margin-left:10px" href="javascript:void(0);" onclick="kand()">测试</a>')
    $("#reset").click(function(){window.location.reload()})
    $("#query").click(function(){
        var text = $("#orderNo").val();
        var array = text.split(",");
        var arrayLength = array.length - 1;
        var Shipping = array[arrayLength];
        console.log(Shipping)
            switch(Shipping) {
                case "马士基海陆有限公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("17");
                    arr(0,0)
                    break;
                case "海洋网联船务（中国）有限公司深圳分公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("85");
                    arr(0,0)
                    break;
                case "长荣海运股份有限公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("9");
                    arr(0,0)
                    break;
                case "法国达飞轮船公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("8");
                    arr(0,0)
                    break;
                case "地中海航运公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("22");
                    arr(0,0)
                    break;
                case "东方海外货柜航运（中国）有限公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("2");
                    arr(0,0)
                    break;
                case "韩国高丽海运株式会社":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("68");
                    arr(0,0)
                    break;
                case "赫伯罗特船务有限公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("3");
                    arr(0,0)
                    break;
                case "宏海箱运船务有限公司广州分公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("46");
                    arr(0,0)
                    break;
                case "建华":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("67");
                    arr(0,0)
                    break;
                case "太平船务有限公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("45");
                    arr(0,0)
                    break;
                case "现代商船有限公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("18");
                    arr(0,0)
                    break;
                case "上海新海丰集装箱运输有限公司深圳分公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("71");
                    arr(0,0)
                    break;
                case "兴亚船务":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("66");
                    arr(0,0)
                    break;
                case "阳明海运股份有限公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("15");
                    arr(0,0)
                    break;
                case "以星轮船船务有限公司":
                     $("#content").contents().find("select[name='ddlCarrier$DropDownList1']").val("25");
                    arr(0,0)
                    break;
                default:
                    alert(""+ Shipping +"不支持查询");
            }
        function arr(indexs,trs){
            var text = $("#orderNo").val();
            var array = text.split(",");
            var arrayLength = array.length - 1;
            if(indexs < arrayLength){
                $("#content").contents().find("#txtBookingNo").attr("value",array[indexs])
                $("#content").contents().find("#imgQuery").click();
                loopquery(0);
                function loopquery(x){
                    if(x < arrayLength){
                        var ccc = $("#content").contents().find('#gvBooking tr');
                        if(ccc.length && ccc.length > trs){//如果有增加
                            indexs += 1;
                            arr(indexs,ccc.length);
                        }else{
                            setTimeout(function(){//延迟一秒后继续查询
                                loopquery(x)
                            },500)
                        }
                    }
                }
            }else{
                alert("查询完毕！");
            }
        }

    })
    function query(val){

    }
    function chaxun(val){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; //浏览器兼容
        var config = {
            attributes: true,
            childList: true
        } //配置对象
        $("#content").each(function () {
            var _this = $(this);
            var observer = new MutationObserver(function (mutations) { //构造函数回调
                mutations.forEach(function (record) {
                    if (record.type == "attributes") { //监听属性
                        console.log("html的属性发生了变化")
                        $("#content").contents().find("#txtBookingNo").attr("value",val)
                    }
                    if (record.type == 'childList') { //监听结构发生变化
                        console.log("html的结构发生了变化")
                    }
                });
            });
            observer.observe(_this[0], config);
        });
    }
    unsafeWindow.kand = function() {//刷单
        $("#content").contents().find('#ddlCarrier').val('17');//设置查询条件为马士基
        $("#content").contents().find('#ibtnQuery').click();//点击查询
        $("#content").contents().find("#gvBooking tr").each(function(i,rows){
            $(this).find('td').each(function(j,rows1){
                if(j == 8){
                    var txt = $(this).find('span').eq(0).html();
                    if(txt){
                        console.log(txt)
                    }else{
                        //$("#content").contents().find('#te_GV tr').eq(0).click();//预约今天
                        txt = $(this).find('span').eq(0).html();
                        console.log(txt);
                    }
                    var lengthTr = $("#content").contents().find("#gvBooking tr");
                    if(i<lengthTr.length){
                        console.log(lengthTr);
                        kand();
                    }
                }
            })
        });
    }
    unsafeWindow.btn_export = function() {
        if($("#content").contents().find("td[style='width:1px;white-space:nowrap;']").length){
            $("#content").contents().find("#gvBooking tr th")[0].remove();
            $("#content").contents().find("td[style='width:1px;white-space:nowrap;']").remove()
        }
        //var table1 = document.querySelector("#gvBooking");
        var table1 = $("#content").contents().find("#gvBooking")[0];
        console.log(table1);
        var sheet = XLSX.utils.table_to_sheet(table1,{ raw: true });//将一个table对象转换成一个sheet对象
        openDownloadDialog(sheet2blob(sheet),'打单数据.xlsx');
    }
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    function sheet2blob(sheet, sheetName) {
        sheetName = sheetName || 'sheet1';
        var workbook = {
            SheetNames: [sheetName],
            Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

        var wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        var wbout = XLSX.write(workbook, wopts);
        var blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
        }); // 字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        return blob;
    }

    function openDownloadDialog(url, saveName) {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
})()