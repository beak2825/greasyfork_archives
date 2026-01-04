// ==UserScript==
// @name         精易论坛-定制区小助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Su
// @description  快捷自定义回复，一键回帖，快速接单。
// @match        https://bbs.125.la/*
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/407590/%E7%B2%BE%E6%98%93%E8%AE%BA%E5%9D%9B-%E5%AE%9A%E5%88%B6%E5%8C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/407590/%E7%B2%BE%E6%98%93%E8%AE%BA%E5%9D%9B-%E5%AE%9A%E5%88%B6%E5%8C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {

    function getValue(name){
        //加载配置
        return   GM_getValue(name);
    }
    function setValue(){
        //保存配置
        var ret=GM_setValue("kjhf",$("#conf").val());
getConf();
        return   ret;
    }
    function getConf(){
        //获取快捷回复内容
        var conf =  getValue("kjhf");
        var arr=conf.split('\n');
        $("#kjhf").html("");
        console.log(arr.length)
        if(conf==''){$("#kjhf").append('<option value="">我能做！支持走论坛担保，楼主可将详细要求与我商谈。可使用站内短消息联系我，也可联系我QQ。</option>')}
        for(var i=0;i<arr.length;i++)
        {
             if(arr[i]!=""){
               $("#kjhf").append('<option value="">'+arr[i]+'</option>')
               }
        }



    };

    var setting = function () {
        var conf =getValue("kjhf");
        layer.open({
            type: 1,
            title: "设置快捷回复内容(一行一条)",
            closeBtn: false,
            area: "540px;",
            shade: 0.8,
            id: "LAY_layuipro",
            resize: false,
            btn: ["保存", "关闭"],
            btnAlign: "c",
            moveType: 1,
            content: '<textarea id="conf" class="Sudz textarea" placeholder="一行一条...">'+conf+'</textarea>',
            success: function (layero) {
                var btn = layero.find('.layui-layer-btn');
                btn.find('.layui-layer-btn0').on("click",setValue);
                //btn.find(".layui-layer-btn0").addEventListener("click",setValue);
            },
        });
    };
    function send() {
        $("#fastpostmessage").val($("#kjhf option:selected").text());

        ajaxpost('fastpostform', 'fastpostreturn', 'fastpostreturn', 'onerror', $('fastpostsubmit'));
        var _val = $.map($("#kjhf option:not(:selected)"), function (ele) {
            return ele.text;
        }).join("\n");
        var conf = $("#kjhf option:selected").text() + "\n" + _val;
        GM_setValue("kjhf",conf)
        setTimeout(() => {
            window.location.reload();
            window.scrollTo(0, 0);
            //刷新
        }, 2000);


    }
    var plate = $("#pt .z a").eq(3).text();
    if(plate=="APP/WEB 定制"){ $(".jiedan").hide();
                            $("head").append(
                                "<style>.Sudz{background: none;box-sizing: border-box;border: solid 1px #ddd;width: 100%;-webkit-transition: all .2s linear 0s;-moz-transition: all .2s linear 0s;-o-transition: all .2s linear 0s;transition: all .2s linear 0s;font-size: 14px;height: 31px;*height: auto;line-height: 1.42857;padding: 4px 10px;}.textarea{height:300px;width: 96%;margin: 2%;}</style>"
                            );


                            var parent = $("#postlist tbody .pcb").eq(0);
                            $(parent).prepend('<div class="jiedan">    <button type="button" id="getConf" class="layui-btn layui-btn-normal"">        <span class="layui-icon layui-icon-set"></span>        设置    </button> <button type="button" class="layui-btn layui-btn-normal" id="send">        <span class="layui-icon layui-icon-release"></span>        快速回复    </button></div>');
                            $(parent).prepend(
                                '<select name="status" class="Sudz" id="kjhf"></select>'
                            )
                            var btn= document.getElementById("getConf");
                            btn.addEventListener("click",setting)
                            var btn_send= document.getElementById("send");
                            btn_send.addEventListener("click",send)
                            getConf();}

})();


