// ==UserScript==
// @name         速卖通资金报表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取资金报表!
// @author       BPT
// @match        https://gsp.aliexpress.com/apps/fund/report*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393790/%E9%80%9F%E5%8D%96%E9%80%9A%E8%B5%84%E9%87%91%E6%8A%A5%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/393790/%E9%80%9F%E5%8D%96%E9%80%9A%E8%B5%84%E9%87%91%E6%8A%A5%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var tpl = '<div style="position: absolute; top: 5px; left: 5px; z-index: 9999;display:none;" id="bpt1209_div"><button onclick="document.getElementById(\'bpt1209_div\').style.display=\'none\';" style="color:red">隐藏窗口</button><textarea id="bpt1209_log" style="display: block; width: 210px; height: 120px;line-height: 20px; overflow: auto; background-color: rgb(63, 63, 63); color: rgb(47, 255, 56); font-size: 10px;"></textarea></div>';
    $("body").append(tpl);
    function log(content) {
        $("#bpt1209_log").prepend(content + "\n");
        console.log(content);
    }
    GM_xmlhttpRequest({// 获取seller
        method: "GET",
        url: "https://myae.aliexpress.com/seller/account/accountPortal.htm",
        onload: function(response) {
            if (response.status == 200) {
                var seller = $(response.responseText).find("#verif-detail tr:eq(0) td").html();
                if (seller) {
                    log("获取卖家账号成功：" + seller);
                    GM_xmlhttpRequest({//获取抓取的url
                        method: "GET",
                        url: "http://erp.bangpute.cn/wms/index/api/getAliexpressFundReportAjaxUrl?seller="+seller,
                        onload: function(response) {
                            if (response.status == 200) {
                                if (response.responseText == '^_^') {
                                    log("无需重复导入");
                                    return;
                                }
                                $("#bpt1209_div").show();
                                log("获取URL成功：" + response.responseText);
                                $.ajax({//解析数据
                                    url: response.responseText,
                                    xhrFields: {withCredentials: true},
                                    success:function(data){
                                        if (data && data.data && data.data.modules) {
                                            var modules = data.data.modules;
                                            for (var i=0;i<modules.length;i++) {
                                                var module = modules[i];
                                                if (module.name == 'summary') {
                                                    var summary = module.options;
                                                    var dto = {
                                                        'seller': seller,
                                                        'summary_json': summary
                                                    };
                                                    dto = JSON.stringify(dto);
                                                    log("上传数据开始：" + dto);
                                                    GM_xmlhttpRequest({//上传数据
                                                        method: "GET",
                                                        url: 'http://erp.bangpute.cn/wms/index/api/saveAliexpressFundReport?data='+encodeURIComponent(dto),
                                                        onload:function(response){
                                                            log("上传数据完毕：" + response.responseText);
                                                            alert(response.responseText);
                                                        }
                                                    });
                                                }
                                            }
                                        } else {
                                            log('下载资金报告数据异常:'+JSON.stringify(data));
                                            alert('下载资金报告数据异常:'+JSON.stringify(data));
                                        }
                                    },
                                    error:function() {
                                        log("下载资金报告失败，请刷新重试");
                                        alert("下载资金报告失败，请刷新重试");
                                    }
                                });
                            } else {
                                log("下载配置失败，请刷新重试");
                                alert("下载配置失败，请刷新重试");
                            }
                        }
                    });
                } else {
                    log("获取店铺账号信息失败");
                    alert("获取店铺账号信息失败");
                }
            } else {
                log("下载配置失败，请刷新重试");
                alert("下载配置失败，请刷新重试");
            }
        }
    });


})();