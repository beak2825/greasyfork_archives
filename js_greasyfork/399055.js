// ==UserScript==
// @name         淘宝助手
// @namespace    http://oldwei.com/
// @version      0.1
// @description  复制淘宝链接
// @author       oldwei
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.6/clipboard.min.js
// @match        *://*.taobao.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/399055/%E6%B7%98%E5%AE%9D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/399055/%E6%B7%98%E5%AE%9D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zhm_html = "<div id='zhm_jx_url_lr' class='vue-icon up'><img src='http://img1.imgtn.bdimg.com/it/u=1796795957,247381988&fm=26&gp=0.jpg' width='50'></div><div id='goods-total' class='vue-icon count'>0</div><div id='vue-download' class='vue-icon down'><img src='https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1879290855,2136506300&fm=26&gp=0.jpg' width='50'></div>";
	$("body").append(zhm_html);
    // Your code here...
    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('.click{display:inline-block;width:100px;height:30px;line-height:30px;margin:-10px auto 0;background:#fa7d3c;color:#fff;text-align:center;}.copy{text-align: center;}.copy a:hover{color:#f0f0f0;text-decoration: none;}.vue-icon{cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;text-align:center;overflow:visible}.up{top:300px;}.down{top:400px}.count{font-size:30px;color:red;font-weight:bold;top:350px;width:50px;height:50px;line-height:50px;}');
    //点击事件
    var jsonData = {};
    var jsonArray = [];
    //将以上拼接的html代码插入到网页里的ul标签中
    $("#zhm_jx_url_lr").click(function(){
        if($(".J_IconMoreNew").find(".copy").length == 0){
            $(".J_IconMoreNew").append('<div class="row copy"><a href="javascript:;" class="click">复制链接</a></div>');
        }

        $(".click").click(function() {
            // 声明商品对象
            var goods = {};
            // 获取商品名称
            var title = $(this).parents(".row").siblings(".title").find("a").text();
            // 去除商品名称空字符串
            title = title.replace(/^\s+|\s+$/g,"");
            // 获取链接地址
            var url = 'https:' + $(this).parents(".row").siblings(".title").find("a").attr("href");
            // 封装 商品名称和url
            goods.title = title;
            goods.url = url;
            //存为json数据
            jsonArray.push(goods);
            // 赋值到左侧菜单栏
            $("#goods-total").text(jsonArray.length)
            // 复制url到剪切板
            $(".click").attr("data-clipboard-text", url);
            var clipboard = new ClipboardJS('.click');
            clipboard.on('success', function(e) {
                //解决多次弹窗
                clipboard.destroy();
                e.clearSelection();
            });
        });

        // 文件下载
        $('#vue-download').click(function(){
            if(jsonArray.length != 0) {
                // 封装数据，及记录数
                jsonData.data = jsonArray;
                jsonData.total = jsonArray.length;
                var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData, null, 4));
                var downloadAnchorNode = document.createElement('a')
                downloadAnchorNode.setAttribute("href", datastr);
                var time = new Date();
                var fileName = time.getTime() + '.json';
                downloadAnchorNode.setAttribute("download", fileName);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            }
        })
    })
})();