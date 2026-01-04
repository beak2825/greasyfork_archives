// ==UserScript==
// @name         exploit-db CVE编号显示
// @namespace    LoveMyself546
// @version      0.1.1
// @description  在漏洞标题中显示该漏洞详情中的CVE编号
// @author       LoveMyself546
// @icon         https://www.exploit-db.com/images/spider-white.png
// @match        https://www.exploit-db.com/
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440036/exploit-db%20CVE%E7%BC%96%E5%8F%B7%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/440036/exploit-db%20CVE%E7%BC%96%E5%8F%B7%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //参数配置
    const COMPARECVE = true; //是否开启CVE对比
    const CVELIST = [ "CVE-2021-1234", "CVE-2022-4321", "CVE-2022-23366" ]; //需要对比CVE的文件


    // 选取需要观察变动的节点
    const OBNODE = document.getElementById("exploits-table").getElementsByTagName("tbody")[0];
    const OBCONFIG = { childList: true };
    var obServer = new MutationObserver(AddCVEInfo);
    obServer.observe(OBNODE, OBCONFIG);

    function AddCVEInfo(){
        //在列表的漏洞标题中添加CVE编号
        var array = OBNODE.getElementsByTagName("tr");
        GM_log("当前列表行数：" + array.length);
        for (var i=0; i<array.length; i++){
            var id = array[i].children;
            //var idText = id[4].getElementsByTagName("a")[0].innerHTML; //列表中漏洞标题的文本内容
            var idUrl = id[4].getElementsByTagName("a")[0].href; //列表中漏洞标题的超链接
            GetCVE(idUrl, id);

            //重置观察器
            obServer.disconnect();
            obServer.observe(OBNODE, OBCONFIG);
        }
    }

    function GetCVE(url, nodeId) {
        //获取漏洞详情里的CVE编号
        GM_xmlhttpRequest({
            "method": "GET",
            "url": url,
            "headers": {
                "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43'
            },
            "onload": function (result) {
                var list = jQuery.parseHTML(result.response);
                jQuery.each(list, function (i, el) {
                    if (el.nodeName == 'DIV') {
                        const DIVNODE = el.getElementsByClassName("stats-title")[1];

                        if (DIVNODE.getElementsByTagName("a").length != 0){
                            var cveId = DIVNODE.getElementsByTagName("a")[0].innerHTML;
                            SetCVE(cveId, nodeId);
                        }
                        else{
                            SetCVE(DIVNODE.innerHTML, nodeId);
                        }
                    }
                });
            }
        });
    }

    function SetCVE(cveId, nodeId){
        //设置CVE编号以H6格式显示在漏洞标题的下方
        var cve = cveId.trim();
        if (cve != "N/A"){
            cve = "CVE-" + cve;
        }

        //对比CVE
        if (COMPARECVE) {
            if (cve != "N/A"){
                if (CVELIST.includes(cve)) {
                    cve = cve + "已存在";
                }
                else{
                    cve = cve + "未找到";
                }
            }
        }

        var node = document.createElement("H6");
        node.id = 'cveid';
        var textNode = document.createTextNode(cve);
        node.appendChild(textNode);
        nodeId[4].appendChild(node);

    }

})();