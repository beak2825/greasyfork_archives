// ==UserScript==
// @name              微信公众号文章内视频下载（需配合Aria2使用）
// @name:en           WeChatOA Video Downloader
// @namespace         http://mofiter.com/
// @version           0.1
// @description       将微信公众号文章内的视频下载到本地
// @description:en    download videos from WeChatOA to your disk
// @author            mofiter
// @create            2018-10-04
// @lastmodified      2-18-10-05
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             http*://mp.weixin.qq.com/s*
// @match             http*://v.qq.com/txp/iframe/player.html*
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/372880/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%86%85%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Aria2%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/372880/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%86%85%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Aria2%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;
    var log_count = 1;
    var hasOpenAriac2Tab = false;
    var aria2_url = "http://127.0.0.1:6800/jsonrpc"; //Aria2 地址
    var video_save_path = '/Users/mofiter/Downloads'; //视频保存路径

    //自定义 log 函数
    function mylog(param1,param2){
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log("#" + log_count++ + "-WeChatOAVideoDownloader-log:",param1,param2);
    }

    setTimeout(function(){
        if (location.href.indexOf("v.qq.com/txp/iframe/player.html") > -1){
            var txp_controls = document.getElementsByClassName("txp_controls")[0];
            var txp_btn_volume = txp_controls.getElementsByClassName("txp_btn_volume")[0];
            txp_btn_volume.setAttribute("data-status","mute"); //静音
            var txp_btn_play = txp_controls.getElementsByClassName("txp_btn_play")[0];
            txp_btn_play.click();
            setTimeout(function(){
                txp_btn_play.click();
                var video = document.getElementsByTagName("video")[0];
                var video_src = video.getAttribute("src");
                if (video_src.indexOf("blob") === -1){
                    window.parent.postMessage(video_src,"*");
                }else{
                    window.parent.postMessage('',"*");
                }
            },1000);
        }
        if (location.href.indexOf("mp.weixin.qq.com/s") > -1){
            window.addEventListener('message', (e) => {
                var video_url = e.data;
                if (video_url.indexOf("http") > -1){
                    var file_name = document.getElementsByTagName("h2")[0].innerText;
                    var qr_code_pc = document.getElementsByClassName("qr_code_pc")[0];
                    var downloadButton = document.createElement("p");
                    downloadButton.innerHTML = "<b>点此下载视频</b>";
                    downloadButton.style.cursor = "pointer";
                    qr_code_pc.appendChild(downloadButton);
                    var downloadSetting = document.createElement("p");
                    downloadSetting.innerHTML = "下载地址设置";
                    downloadSetting.style.cursor = "pointer";
                    qr_code_pc.appendChild(downloadSetting);
                    downloadButton.addEventListener("click",function(){
                        loadSetting();
                        if(video_save_path===""){
                            alert("请点击下载地址设置填写文件保存位置");
                        }else if(aria2_url===""){
                            alert("请点击下载地址设置填写 Aria2 地址");
                        }else{
                            sendDownloadTaskToAria2(video_url,file_name + ".mp4",video_save_path);
                        }
                    });
                    downloadSetting.addEventListener("click",function(){
                        showSetting();
                    });
                }else{
                    mylog("当前视频无法下载");
                }
            });
            var iframe_document = document.getElementsByTagName("iframe")[0].contentWindow.document;
            var js_btn_play = iframe_document.getElementsByClassName("js_btn_play")[0];
            js_btn_play.click();
            setTimeout(function(){
                var js_switch = iframe_document.getElementsByClassName("js_switch")[0];
                js_switch.click();
                var video = iframe_document.getElementsByTagName("video")[0];
                var video_src = video.getAttribute("src");
                window.parent.postMessage(video_src,"*");
            },1000);
        }
    },2000); // 页面加载完成后2秒执行

        //加载个人设置
    function loadSetting(){
        aria2_url = GM_getValue('aria2_url','http://127.0.0.1:6800/jsonrpc');
        video_save_path = GM_getValue('video_save_path','');
    }

    //打开设置
    function showSetting(){
        if(document.querySelector('#dl-setting') == null){
            var container = document.createElement("div");
            container.id = "dl-setting";
            container.style = "position:fixed;z-index:999999;top:40px;right:10px;width:auto;height:auto;padding:5px 10px;font-size:14px;border:1px solid #d9dadc;";
            container.innerHTML =
            "<div style='line-height:25px;'>" +
            "<legend style='text-align:center;'>下载设置</legend>" +
            "<ul style='list-style-type:none'>" +
            "<li>Aria2 地址：</li>" +
            "<li><input type='text' id='aria2_url' name='aria2_url' value='" + aria2_url + "' style='width:100%'></input></li>" +
            "<li>文件保存位置：</li>\n" +
            "<li><input type='text' id='save_path' name='save_path' value='" + video_save_path + "' style='width:100%'></input></li>" +
            "</ul>\n" +
            "<input type='button' value='取消' id='cancel_button' style='position:relative;float:left;border:1px solid #ccc;padding:0 2px;'></input>\n" +
            "<input type='button' value='保存' id='save_button' style='position:relative;float:right;border:1px solid #ccc;padding:0 2px;'></input>\n" +
            "</div>";
            document.body.appendChild(container);
        }else{
            loadSetting();
            $('#aria2_url').value = aria2_url;
            $('#save_path').value = video_save_path;
            $('#dl-setting').show();
        }
        $('#save_button').click(function(){
            GM_setValue('aria2_url',$('input[name="aria2_url"]').val());
            GM_setValue('video_save_path',$('input[name="save_path"]').val());
            $('#dl-setting').hide();
        });
        $('#cancel_button').click(function(){
            $('#dl-setting').hide();
        });
    }

    function sendDownloadTaskToAria2(download_url,file_name,save_path){
        var json_rpc = {
                    id:'',
                    jsonrpc:'2.0',
                    method:'aria2.addUri',
                    params:[
                        [download_url],
                        {
                            dir:save_path,
                            out:file_name
                        }
                    ]
                };
                GM_xmlhttpRequest({
                    url:aria2_url,
                    method:'POST',
                    data:JSON.stringify(json_rpc),
                    onerror:function(response){
                        mylog(response);
                    },
                    onload:function(response){
                        mylog(response);
                        if (!hasOpenAriac2Tab){
                            GM_openInTab('http://aria2c.com/',{active:true});
                            hasOpenAriac2Tab = true;
                        }
                    }
                });
    }
})();