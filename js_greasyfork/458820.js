// ==UserScript==
// @name         哔哩哔哩自动高清啊
// @namespace    www.baiduzslkcjzxlkc
// @version      8.8.9
// @description  哔哩哔哩自动高清啊啊啊
// @author       奈非天
// @description:zh-cn 哔哩哔哩自动高清
// @match        https://www.bilibili.com/bangumi/*
// @match        https://www.bilibili.com/video/*
// @require      http://code.jquery.com/jquery-3.5.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/458820/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85%E5%95%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/458820/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85%E5%95%8A.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
        function checkBitrate(){   

            //播放框出现了，去广告+修改清晰度6
            // 当前流畅度
            let currentBit=$('.bpx-player-ctrl-quality-result').text();
            if(currentBit==''){
                //视频没加载好
                setTimeout(function(){
                    checkBitrate();
                },2000);
                return;
            }

            try{

            if(currentBit.indexOf('1080')==-1){
                //不是1080P

                $('.bpx-player-ctrl-quality-text').each(function(a,b){

                    if($(b).text().indexOf('1080')>-1){
                        $(b).parent().click();
                        throw new Error("巴啦啦能量－呼尼拉－魔仙变身！");
                    }

                });
                //$('.squirtle-record-item').hide();
            }

            }catch (e){}
        }

        checkBitrate();

    });
})();