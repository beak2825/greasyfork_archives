// ==UserScript==
// @name         网赚盘跳过等待时间
// @namespace    sourcewater
// @version      0.0.0.4
// @description  网赚盘跳过等待时间!
// @author       sourcewater
// @match        http*://www.xun-niu.com/*
// @match        http*://www.tadaigou.com/*
// @match        http*://www.expfile.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406407/%E7%BD%91%E8%B5%9A%E7%9B%98%E8%B7%B3%E8%BF%87%E7%AD%89%E5%BE%85%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/406407/%E7%BD%91%E8%B5%9A%E7%9B%98%E8%B7%B3%E8%BF%87%E7%AD%89%E5%BE%85%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location !== window.top.location) {return;}
    let url=window.location.href;
    const XunNiuReg=/\.xun-niu\./;
    const TadaigouReg=/\.tadaigou\./;
    const ExpfileReg=/\.expfile\./;
    const fullScreenDivId="s_s_s_s_full_screen_div";
    const fullScreenDivCSS=`
		* {
            margin:0;
            padding:0;
        }
		#${fullScreenDivId}{
            position:absolute;
            width:100%;
			height:100%;
			background-color:white;
			z-index: 999;
			text-align:center;
		}
`;
    function initFullScreenDiv(){
        let downloadStyle=document.createElement("style");
        downloadStyle.innerHTML=fullScreenDivCSS;
        downloadStyle.type="text/css";
        document.head.appendChild(downloadStyle);
        let downloadLink=document.createElement("div");
        downloadLink.setAttribute("id",fullScreenDivId);
        document.body.insertBefore(downloadLink,document.body.children[0]);
    }
    function clickLink(href,rel){
        let link=document.createElement("a");
        link.href=href;
        link.rel=rel;
        let ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(ev);
    }
    if(XunNiuReg.test(url)){
        //http://www.xun-niu.com/file-772179.html
        let XunNiuReg_1=/\/file-([0-9]+)\.html/;
        //http://www.xun-niu.com/down2-772179.html
        let XunNiuReg_2=/\/down2-([0-9]+)\.html/;
        //http://www.xun-niu.com/down-772179.html
        let XunNiuReg_3=/\/down-([0-9]+)\.html/;
        if(XunNiuReg_1.test(url)){
            clickLink("down2-"+url.match(XunNiuReg_1)[1]+".html","nofollow");
        }else if(XunNiuReg_2.test(url)){
            clickLink("down-"+url.match(XunNiuReg_2)[1]+".html","nofollow");
        }else if(XunNiuReg_3.test(url)){
            document.getElementById('down_box').style.display ='';
            //load_down_addr1('772179');
        }
    }else if(TadaigouReg.test(url)){
        //http://www.tadaigou.com/file/QUE3NjE0Njc=.html
        let TadaigouReg_1=/\/file\/(.*?).html/;
        //http://www.tadaigou.com/down/QUE3NjE0Njc=.html
        let TadaigouReg_2=/\/down\/(.*?).html/;
        let TadaigouReg_2_fileid=/load_down_addr1\('([\d]+)',1\);/;
        if(TadaigouReg_1.test(url)){
            clickLink("down/"+url.match(TadaigouReg_1)[1]+".html","nofollow");
        }else if(TadaigouReg_2.test(url)){
            let file_id=document.body.innerHTML.match(TadaigouReg_2_fileid)[1];
            let vipd=0;
            initFullScreenDiv();
            $.ajax({
                type : 'post',
                url : 'ajax.php',
                data : 'action=load_down_addr1&file_id='+file_id+'&vipd='+vipd,
                dataType : 'text',
                success:function(msg){
                    var arr = msg.split('|');
                    if(arr[0] == 'true'){
                        $("#"+fullScreenDivId).html('<div style="display:inline-block;margin-top:200px;">'+arr[1]+'</div>');
                    }else{
                        $("#"+fullScreenDivId).html('<div>'+msg+'</div>');
                    }
                },
                error:function(){
                }
            });
        }
    }else if(ExpfileReg.test(url)){
        //http://www.expfile.com/file-829312.html
        let ExpfileReg_1=/\/file-([0-9]+)\.html/;
        let file_id=url.match(ExpfileReg_1)[1];
        if(ExpfileReg_1.test(url)){
            initFullScreenDiv();
            $.ajax({
                type : 'post',
                url : 'ajax.php',
                data : 'action=load_down_addr1&file_id='+file_id,
                dataType : 'text',
                success:function(msg){
                    var arr = msg.split('|');
                    if(arr[0] == 'true'){
                        $("#"+fullScreenDivId).html('<div style="display:inline-block;margin-top:200px;">'+arr[1]+'</div>');

                    }else{
                        $("#"+fullScreenDivId).html(msg);
                    }
                },
                error:function(){
                }
            });
        }
    }
})();