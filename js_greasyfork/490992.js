// ==UserScript==
// @name         DexFilterTool
// @namespace    http://www.seallon.com/
// @version      1.7
// @description  一个监测交易数据的工具插件
// @author       RaoXinLong
// @match        https://www.dextools.io/*
// @match        https://photon-sol.tinyastro.io/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-1.12.4.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/490992/DexFilterTool.user.js
// @updateURL https://update.greasyfork.org/scripts/490992/DexFilterTool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = document.createElement('link');
    css.setAttribute("rel","stylesheet");
    css.setAttribute("href","https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
    document.head.appendChild(css);

    var style = document.createElement('style');
    var cssstyle = " .c-trades-table__tr--sell .c-trades-table__td { color: #EF6162; } " + " .c-trades-table__tr--buy .c-trades-table__td { color: #46B874;} ";
    cssstyle += " .c-trades-table__tr--buy .c-trades-table__td[data-cell-id=type] {color: #46B874;} ";
    cssstyle += " .c-trades-table__tr--sell .c-trades-table__td[data-cell-id=type] {color: #EF6162;} ";
    cssstyle += " .setBtn {font-size:13px;}  .right{margin-left:46px;} ";
    cssstyle += " .label { display:inline-block;margin:0 4px;}  .inputValue{width:70px;} .dialogP{ margin:6px;text-align:center;}";
    style.innerHTML = cssstyle;
    document.head.appendChild(style);
    function openFilterWin(){
        $("#dialog").dialog({ width:360 });
    }
    function openSellWin(){
        $("#dialog2").dialog({ width:360 });
    }
    var configDom;
    function InitConfig(){
        var configDom = document.createElement('div');
        configDom.setAttribute("id","draggable");
        //configDom.setAttribute("class","ui-widget-content");
        configDom.innerHTML = '<a class="setBtn" id="btnFilterWin">过滤设置</a> <a class="setBtn right" id="btnSellWin" >委托设置</a>';
        configDom.style.cssText="width: 200px;padding:0 14px;height: 34px;color: rgb(255, 255, 255);line-height: 34px;text-align: center;border-radius: 4px;position: relative;top: -6px;left:0px;z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        $(".p-show__tabs.js-show-bottom-table.js-show-tabs")[0].appendChild(configDom);
        //document.body.appendChild(configDom);
        InitDialogWin();
    }

    function InitDialogWin()
    {
        var winDom = document.createElement('div');
        winDom.innerHTML = '<div id="dialog" title="过滤设置" style="display:none" ><p class="dialogP"><label class="label" >仅显示sol总量大于</label>'+
            '<input type="number" id="txtMinSol" class="inputValue" value="5" /><label class="label" >的订单</label></p>'+
            '<p class="dialogP"><button class="u-mt-s u-w-100 c-btn c-btn--purple" id="btnSetMinSol">设置</ button></p></div>';
        document.body.appendChild(winDom);

        var winDom2 = document.createElement('div');
        winDom2.innerHTML = '<div id="dialog2" title="委托设置" style="display:none" ><p class="dialogP"><label class="label" >设置自动出售委托价格：</label>'+
            '<input type="number" id="txtSellPrice" class="inputValue" value="" /><label class="label" >USD</label></p><p class="dialogP"> 功能开发中。。。。 </p></div>';
        document.body.appendChild(winDom2);
    }
    //监听状态
    function Toast(msg,duration){
        duration=isNaN(duration)?3000:duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText="width: 200px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 70px;right: 40px;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, d * 1000);
        }, duration);
    }
    //设置信息
    function Toast2(msg,duration){
        duration=isNaN(duration)?3000:duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText="width: 200px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 120px;right: 40px;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, d * 1000);
        }, duration);
    }
    //操作提示
    function Toast3(msg,duration){
        duration=isNaN(duration)?3000:duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText="width: 200px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 170px;right: 40px;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, d * 1000);
        }, duration);
    }
    function firstTimeTrack()
    {
         var minSol = parseFloat(GM_getValue("MinSol"));
        var list = $($('.c-trades-table__scroll .c-grid-table__body')[0]).find(".c-grid-table__tr");
        for(var i=0;i<list.length;i++)
        {
            var childrenObj = $(list[i]).children("*");
            if($(childrenObj[6]).text().length>0){
                var totalSol = parseFloat($(childrenObj[6]).text());
                if(totalSol<minSol){
                    $(list[i]).remove();
                }
                else{
                    $(childrenObj[3]).attr("style","font-size:22px;");
                    $(childrenObj[6]).attr("style","font-size:22px;");
                }
            }
        }
    }
    InitConfig();
    if(GM_getValue("MinSol") == undefined) //当没有设置的情况下，默认设置为5sol
    {
        GM_setValue("MinSol","5");
    }
    $("#txtMinSol").val(GM_getValue("MinSol"));
    Toast("插件启动成功！！");
    var hostname = location.hostname;
    if(hostname =='www.dextools.io')
    {
        Toast(hostname);
    }else if(hostname =='photon-sol.tinyastro.io')
    {
        //Toast(hostname);
        setTimeout(function () {
            $("#btnFilterWin").click(function() {
                openFilterWin();
            });
            $("#btnSellWin").click(function() {
                openSellWin();
            });
            $("#btnSetMinSol").click(function() {
                if($("#txtMinSol").val().length>0){
                    GM_setValue("MinSol",$("#txtMinSol").val());
                    $("#dialog").dialog("close");
                    Toast("设置成功！！");
                    firstTimeTrack();
                }
            });
            //$("#draggable").draggable();
            firstTimeTrack();
            var items = $('.c-trades-table__scroll .c-grid-table__body');
            $(items[0]).on("DOMSubtreeModified", function() {
                var list = $(items[0]).find(".c-grid-table__tr");
                var minSol = parseFloat(GM_getValue("MinSol"));
                //Toast2("当前设置：大于 " + minSol + " Sol");
                for(var i=0;i<10;i++)
                {
                    var childrenObj = $(list[i]).children("*");
                    if($(childrenObj[6]).text().length>0){
                        var totalSol = parseFloat($(childrenObj[6]).text());
                        //Toast3(totalSol);
                        if(totalSol<minSol){
                            $(list[i]).remove();
                        }
                        else{
                            $(childrenObj[3]).attr("style","font-size:22px;");
                            $(childrenObj[6]).attr("style","font-size:22px;");
                        }
                    }
                }
                //Toast("插件监测中...");
            });


        }, 1000);
    }
})();