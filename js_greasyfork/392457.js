// ==UserScript==
// @name         CoupangGoodsGet
// @icon         https://using-1255852948.cos.ap-shanghai.myqcloud.com/auto_tab-icon.png
// @version      1.0
// @description  coupang goods info get!
// @author       叶落风霜
// @include https://www.coupang.com/vp/products/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @namespace https://greasyfork.org/users/397427
// @downloadURL https://update.greasyfork.org/scripts/392457/CoupangGoodsGet.user.js
// @updateURL https://update.greasyfork.org/scripts/392457/CoupangGoodsGet.meta.js
// ==/UserScript==
var url="http://192.168.1.102:8092";
(function () {
    'use strict';
    var div = document.createElement("div");
    div.setAttribute("id", "token_div");
    div.setAttribute("style", "position: fixed;z-index:1000;top: 23%;right: 20px; width: 300px;height: 150px;;display:none;border:1px solid #96C2F1;margin: 0px auto;margin-bottom:20px; background-color: #EFF7FF; ");
    div.innerHTML="<h5 style='color:#fff;background-color: #1E9FFF;height:30px;'><p style='padding: 5px 5px 5px 10px;'>Please enter token</p></h5>"+
        "<input type='text' id='token' name='token' value='' style='margin: 10px;width:91%;height:38px;line-height: 38px;font-size:24px;'/><br/>"+
        "<input type='button' id='submit_btn' value='submit' style='margin-left:80px;border-radius: 3px;width: 60px;height: 30px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;cursor: pointer;'/>"+
        "<input type='button' id='cacel_btn' value='cacel' style='margin-left:20px;border-radius: 3px;width: 60px;height: 30px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;cursor: pointer;'/>";
    document.body.appendChild(div);
    var btn = document.createElement("input");
    btn.setAttribute("id", "cj_btn");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "Collect");
    btn.setAttribute("style", "position: fixed;z-index:999;top: 40%;right: 20px; width: 100px;height: 68px;line-height: 68px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    document.body.appendChild(btn);
    $('#cj_btn').on('mouseover', function () {
        $('#cj_btn').css("background-color","#48a9f5");
    });
    $('#cj_btn').on('mouseout', function () {
        $('#cj_btn').css("background-color","#1E9FFF");
    });
    $('#cj_btn').on('click', function () {

       var rs_token = getCookie("rs_token");
       if(rs_token==null||rs_token==""){
           $("#token_div").css("display","block");
           return;
       }
       var htmlstr = document.head.innerHTML;
       var start = htmlstr.indexOf("exports.sdp =");
       var temp = htmlstr.substring(start);
       var end = temp.indexOf("};");
       temp = temp.substring(0,end+1);
       var jsonstr = temp.replace("exports.sdp = ","").trim();
       var jsondata = JSON.parse(jsonstr);
       var salePrice="";
       var quantityBase = jsondata.quantityBase;
       for(var i=0;i<quantityBase.length;i++){
           var price = quantityBase[i].price;
           salePrice = price.salePrice;
       }
       var images = jsondata.images;
       var imgstr="";
       for(var j=0;j<images.length;j++){
           imgstr += images[j].origin+",";
       }
       var optionRows = jsondata.options.optionRows;
       var attrs=[];
       for(var n=0;n<optionRows.length;n++){
           var info = optionRows[n].attributes;
           var valuestr="";
           for(var m=0;m<info.length;m++){
               valuestr += info[m].name+",";
           }
           var attr = {"name":optionRows[n].name,"value":valuestr};
           attrs.push(attr);
       }
       var params = {"token":rs_token,"productId":jsondata.productId,"itemId":jsondata.itemId,"itemName":jsondata.itemName,"salePrice":salePrice,"itemSpec":JSON.stringify(attrs),"images":imgstr};

       //window.open('http://localhost:8090/cookie/open'+params);
       //window.showModalDialog('http://tv.wandhi.com/');
       var collectUrl=url+"/coupang/collectGoods";
       GM_xmlhttpRequest({
            method: "POST",
            url: collectUrl,
            dataType: "json",
            data: JSON.stringify(params),
            headers:  {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                console.log(response);
                if(response.readyState==4&&response.status==200){
                    var jsondata = JSON.parse(response.responseText);
                    alert(jsondata.msg);
                }
            }
        });
    });
    $('#cacel_btn').on('click', function () {
        $("#token_div").css("display","none");
    })

    var checkUrl=url+"/coupang/collectCheck";
    $('#submit_btn').on('click', function () {
        var token_val = $("#token").val();
        GM_xmlhttpRequest({
            method: "POST",
            url: checkUrl,
            dataType: "json",
            data: JSON.stringify({"token":token_val}),
            headers:  {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if(response.readyState==4&&response.status==200){
                    var jsondata = JSON.parse(response.responseText);
                    if(jsondata.status==1){
                        $("#token_div").css("display","none");
                        setCookie("rs_token",token_val,24);
                    }
                    alert(jsondata.msg);
                }
            }
        });

    })
})();

function setCookie(key,value,t)
{
    var oDate=new Date();
    oDate.setDate(oDate.getDate()+t);
    document.cookie=key+"="+value+"; expires="+oDate.toDateString();
}
function getCookie(key){
    var arr1=document.cookie.split("; ");
    for(var i=0;i<arr1.length;i++){
        var arr2=arr1[i].split("=");
        if(arr2[0]==key){
            return decodeURI(arr2[1]);
        }
    }
}
