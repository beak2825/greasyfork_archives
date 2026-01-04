// ==UserScript==
// @name         放单标注
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  just for myself
// @author       pealpool
// @match        https://trade.taobao.com/trade/itemlist/*
// @match        https://trade.taobao.com/trade/memo/*
// @match        http://shang.shangrenqi.com/manage/trade_refund*
// @match        http://shang.shangrenqi.com/manage/normal_order*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/372877/%E6%94%BE%E5%8D%95%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/372877/%E6%94%BE%E5%8D%95%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var rightNo = -26;
    var Tx01 = "负离子地板砖新款客厅通体大理石瓷砖地砖800x800磁砖北欧白灰色".slice(rightNo);
    var Tx02 = "广东佛山瓷砖通体大理石瓷砖地板砖灰色地砖800x800客厅新款防滑".slice(rightNo);
    var Tx03 = "佛山卫生间瓷砖厨房小地砖墙砖瓷片浴室300x600防滑灰色厨卫砖".slice(rightNo);
    var Tx04 = "佛山瓷砖工程地砖800x800客厅玻化砖抛光砖600x600黄白聚晶普拉提".slice(rightNo);
    var Tx05 = "瓷砖地砖800x800地板砖新款客厅防滑全抛釉现代简约爵士白灰佛山".slice(rightNo);
    var Tx06 = "佛山负离子通体大理石瓷砖地砖800x800地板砖新款客厅爵士白灰色".slice(rightNo);
    var Tx07 = "翡翠玉石 大理石瓷砖淡绿色地砖客厅墙砖抛釉砖金刚石800x800佛山".slice(rightNo);
    var Tx08 = "佛山瓷砖地砖800x800客厅地板砖新款防滑金刚石全抛釉面北欧灰色".slice(rightNo);
    var Tx09 = "卫生间瓷砖厨房墙砖厕所洗手间墙面砖浴室防滑简约现代灰300x600".slice(rightNo);
    var Tx10 = "卫生间瓷砖厨房墙砖厕所洗手间墙面砖浴室防滑简约现代灰300x600".slice(rightNo);
    var mytip = "1仓发";
    var myCptext = "";
    var myW_id = "";
    var myW_name = "";
    var myW_price = "";

/*---------------------------------------------------------------------------------------------------------------------------------------------*/
    if(window.location.href.substring(0,59) == "https://trade.taobao.com/trade/itemlist/list_sold_items.htm"){
            GMaddStyle(`
.myCp_name{
    position:relative;
    z-index:1000;
    background-color: #66b6ff;
    color: #fff;
    border: 1px solid #66b6ff;
    width:40px;
    height:18px;
    line-height:17px;
    border-radius: 3px;
    margin-left: -50px;
    margin-top: 30px;
    cursor:pointer;
    float:left;
}
.myCp_name:hover,
.myCp_all:hover,
.myCp_no:hover{
    background-color: #118adb;
    border-color: #118adb;
}
.myCp_no{
    position:absolute;
    z-index:1000;
    background-color: #66b6ff;
    color: #fff;
    border: 1px solid #66b6ff;
    width:40px;
    height:18px;
    line-height:17px;
    border-radius: 3px;
    margin-left: 192px;
    margin-top:-18px;
    cursor:pointer;
    text-align:center;
}
.myCp_all{
    position:absolute;
    z-index:1000;
    background-color: #66b6ff;
    color: #fff;
    border: 1px solid #66b6ff;
    width:40px;
    height:18px;
    line-height:17px;
    border-radius: 3px;
    margin-left: 975px;
    margin-top: 91px;
    cursor:pointer;
    text-align:center;
}
.mySeach{
    position:absolute;
    z-index:1000;
    margin-left:270px;
    margin-top:48px;
    width:500px;
}
.myInput{
    box-sizing: border-box;
    width: 300px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #dcdcdc;
    padding: 0 5px;
    float:left;
}
#myPt{
    background-color: #ff4200;
    color: #fff;
    border: 1px solid #ff4200;
    width:40px;
    height:28px;
    line-height:29px;
    border-radius: 3px;
    cursor:pointer;
    text-align:center;
    float:left;
    margin-left:10px;
    margin-top:-3px;
}
#myPt:hover{
    background-color: #ff1d00;
    border-color: #ff1d00;
}
.myIuput_name{
    position: relative;
    z-index: 1000;
    color: #3c3c3c;
    margin-left: 0px;
    margin-top: -42px;
    float: right;
    font-size:12px;
    width:200px;
    text-align:right;
}
.myRorW_K{
    position: absolute;
    height:17px;
    width:17px;
    background-image:url(https://assets.alicdn.com/sys/common/img/msg_bg.png);
    background-repeat:no-repeat;
}
.myK_name{
    margin-left:210px;
    margin-top:-14px;
}
.myRorW_R{
    background-position:0px -250px;
}
.myIuput_price{
    position: relative;
    z-index: 1000;
    color: #3c3c3c;
    margin-left: 0px;
    margin-top: -46px;
    float: left;
    font-size:12px;
    font-weight:bold;
    text-align:left;
}
.myK_price{
    margin-left:-25px;
    margin-top:-16px;
}
.myBt_green{
    background-color: #65bd00!important;
    border: 1px solid #65bd00!important;
    height:40px!important;
    line-height:38px!important;
}
.myBt_green:hover{
    background-color: #5aa900!important;
    border-color: #5aa900!important;
}
.myBt_red{
    background-color: red!important;
    border: 1px solid red!important;
}
.myBt_red:hover{
    background-color: #a00000!important;
    border-color: #a00000!important;
}
    `);
        }else if(window.location.href.substring(0,47) == "http://shang.shangrenqi.com/manage/trade_refund" || window.location.href.substring(0,47) == "http://shang.shangrenqi.com/manage/normal_order"){
            GMaddStyle(`
.copyAll{
    cursor:pointer;
    width:40px;
    height:28px;
    font-size: 15px;
    border-radius:4px;
    line-height:26px;
    text-align:center;
    border: #fe6725 solid 1px;
    color: #FFFFFF;
    transition: border 0.25s linear, color 0.25s linear, background-color 0.25s linear;
    margin-left:130px;
    margin-top:-2px;
    position: absolute;
}
.copyAll:hover{
    background: #fff;
    color: #fe6725;
}
.copyAll:active{
    background: #af3500;
}
.copy01{
    background: #fe6725;
}
.copy02{
    background: #fe6725;
}
.copy10{
    background: #2270ff;
}
.copy11{
    background: #ff3b00;
}
.copy12{
    background: #e51816;
}
    `);
        }
    function GMaddStyle(cssText){
        let a = document.createElement('style');
        a.textContent = cssText;
        let doc = document.head || document.documentElement;
        doc.appendChild(a);
    }

/*-------------------------------------------------------------------------------------------------------------------------------------------------*/

    function myAddbutton(){
        if(window.location.href.substring(0,59) == "https://trade.taobao.com/trade/itemlist/list_sold_items.htm"){
            if($("body").children("#copyYC").attr("id")!="copyYC"){
                $("body").append("<div id='copyYC'></div>");
            }
            if($(".item-mod__checkbox-label___cRGUj").next().attr("class")!="myCp_no"){
                $(".item-mod__checkbox-label___cRGUj").after("<div class='myCp_no'>copy</div>");
                $(".buyer-mod__name___S9vit").before("<div class='myCp_name'>copy</div>");
                $(".item-mod__trade-order___2LnGB.trade-order-main").prepend("<div class='myCp_all'>copy</div>");
            }
            if(myW_id && myW_name && myW_price){
                //都不为undefined、null与NaN的适合
                console.log(myW_id + "," +myW_name+","+myW_price);
                var i = 0;
                var rw = 0;
                $(".item-mod__trade-order___2LnGB.trade-order-main").each(function(){
                    i++;
                });
                if(i==1){
                    if($(".myCp_name").prev().attr("class")!="myIuput_name"){
                        var myRorW = "";
                        if($(".buyer-mod__name___S9vit").text()==myW_name){
                            myRorW = "myRorW_R";
                            rw ++;
                        }
                        $(".myCp_name").before("<div class='myIuput_name'>"+ myW_name +"<div class='myRorW_K myK_name "+ myRorW +"'></div></div>");
                    }
                    myRorW = "";
                    if($(".myCp_all").next().next().find("td").eq(6).find(".price-mod__price___157jz").prev().attr("class")!="myIuput_price"){
                        if($(".myCp_all").next().next().find("td").eq(6).find(".price-mod__price___157jz").text()==("￥"+myW_price)){
                            myRorW = "myRorW_R";
                            rw ++;
                        }
                        $(".myCp_all").next().next().find("td").eq(6).find(".price-mod__price___157jz").before("<div class='myIuput_price'>￥"+ myW_price +"<div class='myRorW_K myK_price "+ myRorW +"'></div></div>");
                        if(rw == 2){
                            $(".myCp_all").addClass("myBt_green");
                            console.log("green "+rw);
                        }else{
                            $(".myCp_all").addClass("myBt_red");
                            console.log("red "+rw);
                        }
                        rw = 0;
                    }
                }
            }
        };
    }
    myAddbutton();

    $("body").on("click",function(){
        myAddbutton();
    });

    $("body").on("click",".myCp_name",function(){
        myCptext = $(this).next().text();
        let oInput = document.createElement('input');
        oInput.value = myCptext;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").empty();
    })
    $("body").on("click",".myCp_no",function(){
        myCptext = $(this).prev().children("span").eq(2).text();
        let oInput = document.createElement('input');
        oInput.value = myCptext;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").empty();
    })
    $("body").on("click",".myCp_all",function(){
        var myCptext0 = $(this).next().find("span").eq(2).text();
        var myCptext1 = $(this).next().next().find("td").eq(4).find("p").eq(0).children("a").eq(0).text();
        var myCptext2 = $(this).next().next().find("td").eq(6).find(".price-mod__price___157jz").text();
        var myCptext3 = $(this).next().next().find(".ml-mod__media___3uVIK").eq(0).next().children("p").eq(0).children("a").eq(0).children("span").eq(1).text().slice(rightNo);
        var myCptext4 = "";
        switch(myCptext3){
            case Tx01:
                myCptext3 = "负离子";
                break;
            case Tx02:
                myCptext3 = "顺丰";
                break;
            case Tx03:
                myCptext3 = "厨卫灰叶";
                break;
            case Tx04:
                myCptext3 = "抛光";
                break;
            case Tx05:
                myCptext3 = "抛釉";
                myCptext4 = "瑞星";
                break;
            case Tx06:
                myCptext3 = "通体";
                myCptext4 = "瑞星";
                break;
            case Tx07:
                myCptext3 = "翡翠";
                myCptext4 = "瑞星";
                break;
            case Tx08:
                myCptext3 = "全抛";
                break;
            default:
                myCptext3 = "";
        }
        myCptext2 = myCptext2.replace("￥","");
        myCptext = myCptext0 + "	" + myCptext1 + "			" + myCptext2 + "		" + myCptext3 + "	" + myCptext4;
        let oInput = document.createElement('input');
        oInput.value = myCptext;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").empty();
        if($(this).attr("class")=="myCp_all myBt_green"){
            $(".item-mod__thead-cell___3aIQ_.item-mod__thead-operations-container___1M3XV").find("a")[0].click();
        }
    })
    $("body").on("click","#myPt",function(){
        $("#bizOrderId").trigger("input");
        $("#bizOrderId").trigger("change");
        console.log($("#bizOrderId").val());
    })
    $("body").on("paste","#bizOrderId",function(){
        setTimeout(function(){myCut();},100);
    });
    $("#flag5").on("click",function(){
        $("#memo").val(mytip);
        ok();
    });
    function myCut(){
        myW_id = $("#bizOrderId").val().split("	")[0];
        myW_name = $("#bizOrderId").val().split("	")[1];
        myW_price = $("#bizOrderId").val().split("	")[2];
        $("#bizOrderId").val(myW_id);
    }

})();
