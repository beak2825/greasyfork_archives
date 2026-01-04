// ==UserScript==
// @icon            https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png
// @name            微信公众号数据采集
// @namespace       [url=https://www.youngxj.cn]杨小杰博客[/url]
// @author          Youngxj
// @description     获取微信公众号文章发布的文章标题、阅读数、点赞数、评论数，并下载成表格
// @match           *://mp.weixin.qq.com/cgi-bin/appmsgpublish*
// @require         https://code.jquery.com/jquery-2.2.4.min.js
// @version         0.0.5
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395157/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/395157/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 脚本制作参考教程：https://blog.csdn.net/weixin_30635053/article/details/95395672
    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#down_wixin_btn button { background-color: #fa7d3c;color: #fff;}');
    //视频下载按钮的html代码
    var down_btn_html = '<div class="weui-desktop-btn_wrp header_button" id="down_wixin_btn"> <button type="button" class="weui-desktop-btn weui-desktop-btn_primary">下载当页数据</button>  </div>';
    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $(".header_button:last");
    if (ul_tag) {
        ul_tag.after(down_btn_html);
    }
    // 插入div块
    var textar = '<div class="weixin_data_textarea" style="display:none;"></div>';
    $('body').append(textar);
    var timer;
    var WxTool = {
        // 把页面的表格转化为excel下载下来
        // 参考链接：https://www.cnblogs.com/anniey/p/7738278.html
        getExplorer: function() {
            //获取浏览器
            var explorer = window.navigator.userAgent;
            if (explorer.indexOf("MSIE") >= 0 || (explorer.indexOf("Windows NT 6.1;") >= 0 && explorer.indexOf("Trident/7.0;") >= 0)) {
                return 'ie';
            } else if (explorer.indexOf("Firefox") >= 0) {
                return 'Firefox';
            } else if (explorer.indexOf("Chrome") >= 0) {
                return 'Chrome';
            } else if (explorer.indexOf("Opera") >= 0) {
                return 'Opera';
            } else if (explorer.indexOf("Safari") >= 0) {
                return 'Safari';
            }
        },
        excels: function(table) {
            if (WxTool.getExplorer() == 'ie') {
                var curTbl = document.getElementById(table);
                var oXl = new ActiveXObject("Excel.Application"); //创建AX对象excel
                var oWB = oXL.Workbooks.Add(); //获取workbook对象
                var xlsheet = oWB.Worksheets(1); //激活当前sheet
                var sel = document.body.createTextRange();
                sel.moveToElementText(curTbl); //把表格中的内容移到TextRange中
                sel.select; //全选TextRange中内容
                sel.execCommand("Copy"); //复制TextRange中内容
                xlsheet.Paste(); //粘贴到活动的EXCEL中
                oXL.Visible = true; //设置excel可见属性
                try {
                    var filename = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
                } catch (e) {
                    window.print("Nested catch caught " + e);
                } finally {
                    oWB.SaveAs(filename);
                    oWB.Close(savechanges = false);
                    oXL.Quit();
                    oXL = null; //结束excel进程，退出完成
                    timer = window.setInterval("WxTool.Cleanup();", 1);
                }
            } else {
                WxTool.tableToExcel("weixin_data_table");
            }
        },
        Cleanup: function() {
            window.clearInterval(timer);
            CollectGarbage(); //CollectGarbage,是IE的一个特有属性,用于释放内存的
        },
        base64: function(s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format: function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        },
        tableToExcel: function() {
            return WxTool.zzzz("weixin_data_table", '微信公众号数据采集');
        },
        zzzz: function(table, name) {
            var uri = 'data:application/vnd.ms-excel;base64,',
                template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
            if (!table.nodeType) table = document.getElementById(table);
            var ctx = {
                worksheet: name || 'Worksheet',
                table: table.innerHTML
            };
            window.location.href = uri + WxTool.base64(WxTool.format(template, ctx))
        }
    };
    $(function() {
        //执行下载按钮的单击事件并调用下载函数
        $("#down_wixin_btn").click(function() {
        	// 微信公众号目前的数据节点是这样的，微信公众号平台更新可能会导致节点改变，稍微改变即可
        	var title = $('.weui-desktop-mass-appmsg__title span');
	        var yuedu = $('.appmsg-view span');
	        var dianzan = $('.appmsg-like span');
	        var pinglun = $('.appmsg-comment .weui-desktop-link');
            var zhuanfa = $('.appmsg-share span');
            var xihuan = $('.appmsg-haokan span');
            var arrTime = new Array();
            var arrTitle = new Array();
            var arrYuedu = new Array();
            var arrDianzan = new Array();
            var arrPinglun = new Array();
            var arrZhuanfa = new Array();
            var arrXihuan = new Array();
            $.each(title, function(index, val) {
                var times = $(val).parent().parent().parent().parent().parent().prev();
                var timess = $(times).find('.weui-desktop-mass__time').html();
                arrTime.push(timess);
                arrTitle.push($(val).html());
            });
            $.each(yuedu, function(index, val) {
                arrYuedu.push($(val).html());
            });
            $.each(dianzan, function(index, val) {
                arrDianzan.push($(val).html());
            });
            $.each(pinglun, function(index, val) {
                arrPinglun.push($(val).html());
            });
            $.each(zhuanfa, function(index, val) {
                arrZhuanfa.push($(val).html());
            });
            $.each(xihuan, function(index, val) {
                arrXihuan.push($(val).html());
            });
            // 组装数据
            var newHtml = '';
            $.each(arrTitle, function(index, val) {
                newHtml += '<tr><td>' + arrTime[index] + '</td><td>' + arrTitle[index] + '</td><td>' + arrYuedu[index] + '</td><td>' + arrDianzan[index] + '</td><td>' + arrZhuanfa[index] + '</td><td>' + arrXihuan[index] + '</td><td>' + arrPinglun[index] + '</td></tr>';
            });
            // 拼接table
            var textDataStart = '<table class="weixin_data_table" id="weixin_data_table">\
             <thead>\
                 <tr>\
                 	<th class="time">时间</th>\
                     <th class="title">标题</th>\
                     <th class="read_num">阅读数</th>\
                     <th class="dianzan_num">点赞数</th>\
                     <th class="zhuanfa_num">转发数</th>\
                     <th class="xihuan_num">喜欢数</th>\
                     <th class="pinglun_num">留言数</th>\
                 </tr>\
             </thead>\
             <tbody>';
            var textData = $('#weixin_data').val();
            var textDateEnd = '</tbody></table>';
            $('.weixin_data_textarea').html(textDataStart + textData + newHtml + textDateEnd);
            WxTool.excels('weixin_data_table');
        });
    });
})();