// ==UserScript==
// @name         自动获取所有SSR
// @namespace    http://www.cichui.top/
// @version      1.2
// @description  自动获取【SSR小工具】的所有可用SSR链接，你只需要复制后从剪贴板导入SSR工具即可，省去人工一个个添加节点，手机也可使用Yandex浏览器安装此脚本!此脚本仅用于交流学习之用，切不可用于违法用途，因此产生的所有责任与开发者无关，请于下载后24小时内删除脚本，谢谢配合!
// @author       CiChui
// @match        *://ssrtool.us/tool/free_ssr*
// @match        *://usky.ml/tool/free_ssr*
// @match        *://www.youneed.win/free-*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.bootcss.com/crypto-js/4.0.0/crypto-js.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388200/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%89%80%E6%9C%89SSR.user.js
// @updateURL https://update.greasyfork.org/scripts/388200/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%89%80%E6%9C%89SSR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*域名配置，如果域名更新请手动修改上边@match的URL地址*/
    var $=jQuery,nodes=[];
    if(window.location.host.indexOf("youneed.win")>-1)
    {
        var subscribeURL=localStorage.getItem("SubscribeURL")||"";
        $("h2.post-title").click(function(){
            subscribeURL=localStorage.getItem("SubscribeURL")||"";
            subscribeURL = prompt("输入更新订阅内容的URL",subscribeURL);
            if(subscribeURL){
                if(subscribeURL==0){
                    localStorage.removeItem("SubscribeURL");
                    alert("已取消自动更新订阅");
                }else{
                    subscribeURL=subscribeURL.charAt(subscribeURL.length - 1)==="/"?subscribeURL:subscribeURL+"/";
                    localStorage.setItem("SubscribeURL",subscribeURL);
                    alert("你设置的URL是："+subscribeURL);
                }
            }
        });
        $(".v2ray").each(function(index,item){
            var data = $(item).parent().find('td');
            if(window.location.pathname.indexOf("ssr")>-1){
                nodes.push(data.find('a').attr("data"));
            }else if(window.location.pathname.indexOf("v2ray")>-1){
                nodes.push('vmess://' + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(
                '{"ps":"[youneed.win]' + $(data[1]).text() + '","add":"' + $(data[1]).text() +
                '","port":"' + $(data[2]).text() + '","id":"' + $(data[3]).text() +
                '","aid":"0","net":"' + $(data[4]).text() + '","type":"none","host":"' + $(data[5])
                .text() + '","tls":"' + $(data[6]).text() + '"}')));
            }else if(window.location.pathname.indexOf("ss")>-1){
                nodes.push('ss://'+CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse($(data[4]).text()+':'+$(data[3]).text()+'@'+$(data[1]).text()+':'+$(data[2]).text())));
            }
        });
        if(nodes.length>0 && subscribeURL)
        {
            var text = nodes.join('\n');
            var newwindow=window.open();
            newwindow.document.write(text);
            console.info(text);
            $.post(subscribeURL+(text.indexOf("ssr://")==0?"fmdfssr":text.indexOf("ss://")==0?"fmdfss":"fmdfv2ray")+".txt",{text:CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text))},function(data){
                alert(window.location.pathname+"/订阅内容已发送");
            });
        }
        return;
    }

    layui.$("#data").append(
        ' <div class="layui-form-pane layui-form-item">'+
        '<button class="layui-btn" type="button" onclick="window.getSsrData()">查看所有节点</button>'+
        '   <label class="layui-form-label" style="width:130px;" onclick="window.UpSubscribe()">延迟少于(ms)</label>'+
        '   <div class="layui-input-inline" style="width:80px;">'+
        '     <input type="number" id="ms" autocomplete="on" class="layui-input" min=0 max=4000 value="400" ondblclick="window.UpSubscribe()">'+
        '   </div>'+
        ' </div>');
    var domain = window.location.origin;
    var apiUrl = domain + "/tool/api/free_ssr"
    var ssrCount,isBase64;
    window.getSsrData = function (){
        ssrCount=0;
        isBase64=false;
        layer.open({
            id:'ssrWindow',
            type:1,
            title:'<span style="color: #fff;font-weight: bold;">全选复制后在任务栏SSR图标上点击右键选择剪贴板批量导入</span>',
            area:'800px',
            offset: 't',
            btn: ['转Base64','一键复制'],
            yes:function(index, layero){
                if(!isBase64){
                    $("#ssrStr").val(btoa($("#ssrStr").val()));
                    isBase64=true;
                    layer.msg("转换成功，可用于更新自建服务器的订阅文件！",{icon:6});
                    /*此处可以发送Base64用于更新自己服务器的订阅文件，需要一定的动手能力编写服务端更新程序*/
                    /*////////////////////////////////////////////////////////////////////////////////////*/
                    /**/var subscribeURL = localStorage.getItem("SubscribeURL")
                    /**/if(subscribeURL){
                    /**/    var text = $("#ssrStr").val();
                    /**/    $.post(subscribeURL,{text:text},function(data){
                    /**/        layer.msg("订阅内容已发送");
                    /**/    });
                    /**/}
                    /*////////////////////////////////////////////////////////////////////////////////////*/
                    }else{
                    layer.msg('已转换');
                }
            },
            btn2: function(index, layero){
                layui.$("#ssrStr").focus();
                $("#ssrStr").select();
                document.execCommand("Copy");
                layer.msg('复制成功！', {icon: 1});
                window.getSelection().empty();
                return false;
            },
            skin: 'layui-layer-molv',
            content: '<textarea class="layui-textarea" style="width:100%;height:600px;background-color: #eaeaea;" id="ssrStr" readonly></textarea>'
        });
        layer.load(1, {time: 10*1000});
        window.GetData(1);
    }
    window.GetData = function (inPage){
        layui.$.ajax({
            type:"GET",
            url: apiUrl+"?page="+inPage+"&limit=90",
            dataType: "json",
            async: true,
            success: function(data) {
                var outPage = parseInt(data.count/90+(data.count%90>0?1:0));
                var min_ms = parseInt(document.getElementById("ms").value || 4000);
                for(var j=0; j<data.data.length;j++){
                    if(data.data[j].m_station_cn_status=="true" && data.data[j].ms<min_ms)
                    {
                        $("#ssrStr").append(data.data[j].ssrlink+"\n\n");
                        ssrCount++;
                    }
                }
                if(inPage<outPage){
                    window.GetData(++inPage);
                }
                else{
                    layer.closeAll('loading');
                    layer.msg("共提取到"+ssrCount+"条节点信息");
                }
            }
        });
    }
    window.UpSubscribe = function(){
        layer.prompt({title: '输入更新订阅内容的URL，清除输入0', formType: 0,value:localStorage.getItem("SubscribeURL")}, function(text, index){
            if(text==0)
            {
                localStorage.removeItem("SubscribeURL");
                layer.msg("已取消自动更新订阅");
            }
            else{
                localStorage.setItem("SubscribeURL",text);
                layer.msg("你设置的URL是："+text);
            }
            layer.close(index);
        });
    }
})();