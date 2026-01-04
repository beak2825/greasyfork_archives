// ==UserScript==
// @name         Ysmobi
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  help for my wife
// @author       You
// @match        http://baochi.ysmobi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387682/Ysmobi.user.js
// @updateURL https://update.greasyfork.org/scripts/387682/Ysmobi.meta.js
// ==/UserScript==

(function abc() {
    var host = window.location.href;

    var orderMemberListUrl = /tk_orderMemberList/i;
    var memberListUrl = /tk_memberList/i;

    var exportBtn = '<button class="layui-btn layui-btn-primary" id="btn-excel">导出</button>';
    var goodBtn = '<button class="layui-btn layui-btn-primary" id="btn-good">显示更多</button>';
    var addressTh = '<th data-field="transport_address"><div class="layui-table-cell laytable-cell-1-transport_address" style="width:500px">收货地址</div></th>';
    var pos = 1;
    var itemCount = 0;

    // 加载详情页数据
    async function loadXMLDoc() {
        var id = document.getElementsByClassName('layui-table-cell laytable-cell-1-ID')[pos].innerText;
        var link = 'http://baochi.ysmobi.cn/tk_order/tk_orderDetail/' + id;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", link, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                // 添加新节点
                var objE = document.createElement("div");
                objE.innerHtml = xmlhttp.responseText;
                var temp = '<div class="detail_info">'+objE.innerHtml+'</div>'
                document.getElementsByClassName('layui-table-cell laytable-cell-1-11')[pos].innerHTML+=temp;

                // 获取手机号
                var phone = document.getElementsByClassName('layui-form-label')[27].innerText;
                // 获取收货地址
                var address = document.getElementsByClassName('layui-form-label')[29].innerText;

                // 删除节点
                document.getElementsByClassName('layui-table-cell laytable-cell-1-11')[pos].removeChild(document.getElementsByClassName('detail_info')[0]);

                // 设置手机号码
                document.getElementsByClassName('layui-table-cell laytable-cell-1-mobile')[pos].innerText=phone;
                // 设置收货地址
                var addressHtml = '<td data-field="transport_address"><div class="layui-table-cell laytable-cell-1-transport_address" style="width:500px">' + address + '</div></td>';
                temp = document.createElement('td');
                temp.setAttribute("data-field","transport_address");
                temp.innerHTML=addressHtml;
                document.getElementsByClassName('layui-table-cell laytable-cell-1-transport_name')[pos].parentElement.after(temp);

                // 请求下一个详情信息
                pos++;
                if(pos<=itemCount){
                    loadXMLDoc();
                }
            }
        };
        xmlhttp.send();
    }

    // Base64转码
    function base64(s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    }

    // Table标签数据转成Excel表格
    function tableToExcel(table) {
        var template = '<html xmlns="http://www.w3.org/TR/REC-html40">';
        template += '<head></head>';
        template += '<body>';
        template += '<table>';
        template += table;
        template += '</table>';
        template += '</body>';
        template += '</html>';
        var link = 'data:application/vnd.ms-excel;base64,' + base64(template);
        var a = document.createElement("a");
        a.href = link;
        a.download = 'baochi.xls';
        a.click();
    }

    // 导出表格
    function exportExcel() {
        var x = document.getElementsByTagName("table")[1].innerHTML;
        x += document.getElementsByTagName("table")[2].innerHTML;
        tableToExcel(x);
    };

    setTimeout(function () {
        // 功能：加载会员手机号码和收货地址、导出Excel表格
        if (orderMemberListUrl.test(host)) {
            // 添加突破未来按钮
            document.getElementsByClassName('layui-btn-group')[0].innerHTML+=goodBtn;
            $(document).on('click','#btn-good',()=>{
                // 检查是否添加收货地址标题
                if($('.laytable-cell-1-transport_address').length===0){
                    // 添加收货地址标题
                    var temp = document.createElement('th');
                    temp.setAttribute("data-field","transport_address");
                    temp.innerHTML=addressTh;
                    document.getElementsByClassName('layui-table-cell laytable-cell-1-transport_name')[0].parentElement.after(temp);
                }

                // 获取详情信息
                pos = 1;
                itemCount = document.getElementsByTagName("tbody")[0].childElementCount;
                loadXMLDoc();
            });

            // 添加导出按钮
            document.getElementsByClassName('layui-btn-group')[0].innerHTML+=exportBtn;
            $(document).on('click','#btn-excel',()=>{
                var x = document.getElementsByTagName("table")[1].innerHTML;
                x += document.getElementsByTagName("table")[2].innerHTML;
                tableToExcel(x);
            });
        }

        // 功能：递归查询会员树并显示
        if (memberListUrl.test(host)) {

        }
    }, 300);
})();