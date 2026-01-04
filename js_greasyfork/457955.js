// ==UserScript==
// @name         2023年天津市中小学教师继续教育自动刷课脚本
// @namespace    JBren
// @version      0.5
// @description  自动打分，自动下一节，自动静音
// @author       JBren
// @icon         https://srt-read-online.3ren.cn/basebusiness/headimg/20210512/1620805976782CrkCSwcFlY-32.png
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @match        *://*tjgl.yanxiu.com/*
// @downloadURL https://update.greasyfork.org/scripts/457955/2023%E5%B9%B4%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457955/2023%E5%B9%B4%E5%A4%A9%E6%B4%A5%E5%B8%82%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
$(document).ready(function() {
    //添加浮动窗口
    $("body").append('<div style=\"z-index: 9999; position: fixed ! important; right: 0px; top: 0px;\"><div style=\"width:150px;height: 100px;background-color: rgb(11, 11, 54);color: rgb(207, 245, 170);\">阿4监控弹窗<p id=\"JianCe\" style=\"color: rgb(223, 71, 71);\">0</p></div></div>')
    //1秒执行一次
    var cishu = 1;
    var pingjiadisplay;
    var id = setInterval(function(){pingjia();},1000)

    //查找评价方法
    function pingjia(){
        $("#JianCe").text(cishu);
        cishu++;
        //判断是否静音
        if($(".vcp-volume").is('.vcp-volume-muted')==false){
            jingyin()
        }

        //查找评价窗口
        pingjiadisplay = $(".scoring-wrapper").css('display');
        if (pingjiadisplay != 'none'){
            
            //模拟点击4星
            $(".rate-item").last().delay(1000).click()//点击最后星星
            //模拟点击提交
            $(".commit button span").delay(1000).click()//点击提交
            console.log("点评一次")
        }
        //播放完后
        var checkEnd = $(".ended-mask").css('display');
        if (checkEnd != 'none'){
            //判断是否有下一节
            if( $(".btns p").length==1){
                alert('播放结束');
                clearInterval(id);
            }
            else{
                $(".btns p").click()
                console.log("点击下一节")               
            }

        }
    }
    //静音
    function jingyin(){
        $(".vcp-volume-icon").click()
    }
});