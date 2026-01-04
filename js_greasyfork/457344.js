// ==UserScript==
// @name        ECHO_STOCKS浏览器摸鱼看股票
// @namespace   Marshal
// @match       *://*/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.01
// @author      -
// @description 2022/11/25 14:11:33
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license     CC
// @downloadURL https://update.greasyfork.org/scripts/457344/ECHO_STOCKS%E6%B5%8F%E8%A7%88%E5%99%A8%E6%91%B8%E9%B1%BC%E7%9C%8B%E8%82%A1%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/457344/ECHO_STOCKS%E6%B5%8F%E8%A7%88%E5%99%A8%E6%91%B8%E9%B1%BC%E7%9C%8B%E8%82%A1%E7%A5%A8.meta.js
// ==/UserScript==

// 使用的时候再开启，不使用的时候请关闭
(function() {
    'use strict';
    const stock = GM_getValue('stocklist'); //$list
    //console.log(stock[0]);
    const url = "https://qt.gtimg.cn/q=s_";
    var value = '';
    var s,v;
    var vcss,vhtml;
    vcss =
                  '        .Marshal-stock-area {\n' +
                  '            position: fixed;\n' +
                  '            right: 1px;\n' +
                  '            bottom: 1px;\n' +
                  '            display: flex;\n' +
                  '            transition: 0.3s;\n' +
                  '            -webkit-text-size-adjust:none;\n' +
                  '            font-size:0.09rem!important;\n' +
                  '            color: #000;\n' +
                  '            margin: 0 auto;\n' +
                  '            overflow: hidden;\n' +
                  //'            background-color: rgb(222,225,230);\n' +
                  '        }\n' +
                  '        .Marshal-stock-wrap {\n' +
                  //'            float: right;\n' +
                  '            position: fixed;\n' +
                  '            right: 0;\n' +
                  '            bottom: 0;\n' +
                  '            z-index: 99999;\n' +
                  '            height: 20px;\n' +
                  '            width: 500px;\n' +
                  '            margin: 0;\n' +
                  '            border-radius: 4px;\n' +
                  '            overflow: hidden;\n' +
                  //'            background-color: rgb(255,90,90,0.25);\n' +
                  '        }\n'+
                  '        .Marshal-stock-refresh {\n' +
                  '            line-height: 12px;\n' +
                  '            position: fixed;\n' +
                  '            right: 2px;\n' +
                  '            bottom: 20px;\n' +
                  '            font-size:0.08rem!important;\n' +
                  '            background-color: #f4c2c2;\n' +
                  '            padding: 0;\n' +
                  '            border: none;\n' +
                  '        }\n'
    ;//css

    vhtml = '<div class="Marshal-stock-wrap"><div class="Marshal-stock-area">0</div><button class="Marshal-stock-refresh">涨</button></div>';
    $('head').append('<!-- CSS 文件 -->\n' +'<style>\n' +vcss+ '</style>'+'<!-- CSS 文件 -->\n');
    $('body').append(vhtml);

    $("button.Marshal-stock-refresh").click(function(){
        console.table(stock);
        value = get_stock_value(stock);
        //console.log(value);
        $("div.Marshal-stock-area").text(value);
    });

    function get_stock_value(stock){
      var kkk='';
      stock.forEach(function(s_list){
         kkk += get_stock_info(s_list);
         console.log(kkk);
      });
      //console.log($);
      //console.log(value);
      return kkk;
    };

    function get_stock_info(e){
         var data ='';
         var ajaxurl = url+e;
         $.ajax({
            async:false,
            url: ajaxurl,
            //data:query,//dataType: "json",
            type: "GET",
            success: function(result){
            console.table(url);
				    s = result.split("~");
            v = s[1]+":"+s[3]+"|"+s[4]+"|"+s[5]+"% \n";
            data = v;
			      },error:function(){}
         });
         //alert(data);
         return data;
    }

///
})();

