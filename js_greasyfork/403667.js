// ==UserScript==
// @name         西南继续教育作业
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://zuoye.eduwest.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/403667/%E8%A5%BF%E5%8D%97%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/403667/%E8%A5%BF%E5%8D%97%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==
//window.confirm=function(){return 1}
$(function(){

    //alert(1)
    var button = '<input id="bbbb10212"  class="btn btn-primary"  type="button" style="width: 100px;position: fixed;left: calc(50% - 50px);bottom: 246px;z-index: 99999;" value="填空题提交">'

    $("body").append(button)

    $("#bbbb10212").click(function(){

        var str =  $("#STATUStest").parent().html().replace(/\s*/g,"")

        if(!str.length){
            str="11"
        }else{
            var index = str.indexOf("本题参考答案");
            str=str.substring(index).replace("本题参考答案：","").replace(/\"/g,"' ").replace("img","img ")
            // console.log(str)
        }
        $("#Form textarea").val(str)
        nextOne()
    })

    function nextClick(){
        if($("#danxuan_1").length){
            danxuanti()
        }
        if($("#duoxuan_1").length){
            duoxuan()
        }
        if($("#panduan_1").length){
            panduan()
        }
    }

    function danxuanti(){
        var danxuan = $("#danxuan_1 input[name='danxuanti']:checked");
        if(danxuan.length){
            if( danxuan.parents(".dxt").next().length){
                danxuan.parents(".dxt").next().children().click()
                submit()
                console.log("我点击了")}else{
                    $("#danxuan_1 input[name='danxuanti']").eq(0).parent().click()
                    submit()
                    console.log("没有下一个元素了")
                }
        }else{
            $("#danxuan_1 input[name='danxuanti']").eq(0).parent().click()
            submit()
        }
    }
    function submit(){
        //提交
        $("#preservation1").click()
        // isNext()
    }
    function isNext(){
        //下一步
        if($(".title").next().text().indexOf("此题回答正确")===1){
            $("#next").click()

        }else{

        }
        return ($(".title").next().text().indexOf("此题回答正确")===1)
    }

    function duoxuan(){
        if( isAsk()){
            var ary = isAsk();
            $("#duoxuan_1 .duxt input").attr("checked",false)
            for(var i=0;i<ary.length;i++){
                var index = abcIndex(ary[i])
                $("#duoxuan_1 .duxt>label").eq(index).click()
            }
            submit()
        }else{
            $("#duoxuan_1 .duxt input").attr("checked",false)
            $("#duoxuan_1 .duxt>label").click()
            submit()
        }
    }

    function panduan(){
        var pddom =  $("#panduan_1 input[name='panduanti']:checked");
        if(pddom.length){
            if( pddom.parents(".puxt").next().length){
                $("#panduan_1 .puxt label").eq(1).click()
                submit()
            }else{
                $("#panduan_1 .puxt label").eq(0).click()
                submit()
            }
        }else{
            $("#panduan_1 .puxt label").eq(0).click()
            submit()
        }
    }

    //是否有答案
    function isAsk(){
        if($("#STATUStest").parent().text().length&&$("#STATUStest").parent().text().replace(/\s*/g,"").length){
            return   $("#STATUStest").parent().text().replace(/\s*/g,"").substr(7).split("")
        }else{
            return false
        }

    }

    function abcIndex(world){
        switch(world) {
            case "A":
                return 0;
                break;
            case "B":
                return 1;
            case "C":
                return 2;
            case "D":
                return 3;
            case "E":
                return 4;
            case "F":
                return 5;
            case "G":
                return 6;
        }
    }
    setInterval(function(){

        if(!isNext()){
            // console.log($(".title").next().text())
            nextClick()
        }
    },1000)
})