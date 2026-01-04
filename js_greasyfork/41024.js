// ==UserScript==
// @name         Ci-AiCloud
// @namespace    https://github.com/CiChui/Ci-AiCloud
// @version      0.2
// @description  通过AiCloud外网访问斐讯天天链N1，上传下载文件，支持多站点，安装后自己打开脚本文件编辑，在Configs中配置你自己的域名及内网IP信息
// @description  本脚本支持梅林固件的AiCloud，做这个的原因就是局域网共享无法扫描到斐讯N1设备，导致我无法通过AiCloud远程访问家里的斐讯天天链N1设备
// @description  1.首先保证是梅林固件，启用了AiCloud
// @description  2.可以从外网访问，有公网IP或者FRP穿透
// @description  3.在路由器上给你要访问的设备分配一个固定IP（非必须，配置中可改）
// @description  4.这个脚本不仅限于访问斐讯天天链，所有内网可以访问而AiCloud又无法扫描到的都可以通过本脚本挂载到页面
// @description  5.自行修改Config配置为你的AiCloud访问地址，有关设备的配置项都在Config中,请参考注释可只填写IP
// @author       CiChui[Email:815362636@qq.com]
// @license      MIT
// @supportURL   https://github.com/CiChui/Ci-AiCloud/issues
// @date         04/25/2018
// @modified     04/25/2018
// @match        *
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/41024/Ci-AiCloud.user.js
// @updateURL https://update.greasyfork.org/scripts/41024/Ci-AiCloud.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //配置项,可根据域名配置多个AiCloud
    var Configs = [
        {
            domain:"aicloud.cn",//域名
            list:[
                {
                    title:"斐讯天天链_N1",/*设备名称*/
                    ip:"192.168.50.5",/*设备的内网IP*/
                    uid:Math.random()/*设备的标识*/
                },
                {
                    title:"玩客云",
                    ip:"192.168.50.6",
                    uid:Math.random()
                }
            ]
        },
        {
            domain:"www.aicloud.cn",//域名
            list:[
                {
                    title:"Ci-PC",/*设备名称*/
                    ip:"192.168.1.2",/*设备的内网IP*/
                    uid:Math.random()/*设备的标识*/
                }
            ]
        }
    ];
    setTimeout(function(){
        for(var i=0;i<Configs.length;i++){
            if(window.location.origin.indexOf(Configs[i].domain)>=0){
                var Config = Configs[i];
                for(var j=0;j<Config.list.length;j++){
                    if(!Config.list[j].ip)
                    {
                        alert("参数初始化错误-IP错误，Ci-AiCloud未能正常加载！");
                        continue;
                    }
                    setConfig(Config.list[j]);
                }
            }
        }
    },3000);
    function setConfig(N1_Config){
        var dom = $("#hostview .host_item:last");
        dom.after(dom.clone(true));
        $("#hostview .host_item:last").removeClass("select");
        $("#hostview .host_item:last").click(function(){
            doPROPFIND("/"+N1_Config.ip);
            $("#hostview .host_item").removeClass("select");
            $(this).addClass("select");
        }).attr(
            {
                "uhref":"/"+N1_Config.ip,
                "title":N1_Config.title||"Ci-AiCloud" +" - "+ N1_Config.ip,
                "online":"1",
                "isdir":"1",
                "ip":N1_Config.ip,
                "mac":N1_Config.mac || "",
                "uid":N1_Config.uid || ""
            }
        ).find("p").text(N1_Config.title||N1_Config.ip);
    }
})();