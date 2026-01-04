// ==UserScript==
// @name 店小秘商品自动配对
// @namespace hzh
// @description 店小秘商品SKU自动配对
// @match https://www.dianxiaomi.com/dxmTempWishPairProduct/index.htm
// @run-at document-end
// @version 0.0.3.1
// @downloadURL https://update.greasyfork.org/scripts/388521/%E5%BA%97%E5%B0%8F%E7%A7%98%E5%95%86%E5%93%81%E8%87%AA%E5%8A%A8%E9%85%8D%E5%AF%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/388521/%E5%BA%97%E5%B0%8F%E7%A7%98%E5%95%86%E5%93%81%E8%87%AA%E5%8A%A8%E9%85%8D%E5%AF%B9.meta.js
// ==/UserScript==
; (function() {
	'use strict';
    var $=unsafeWindow.$,
        sskk={"GL190000Tea":"GL190001",
"GL190000Tea":"GL190001",
"GL190000Tea":"GL190001",
"GL190000Tea":"GL190001",
"GL190000Tea":"GL190001",
"GL190000MatteTransparent":"GL190009",
"GL190000MatteTransparent":"GL190009",
"GL190000MatteTransparent":"GL190009",
"GL190000MatteTransparent":"GL190009",
"GL190000MatteTransparent":"GL190009",
"GL190000DarkBlue":"GL190014",
"GL190000DarkBlue":"GL190014",
"GL190000DarkBlue":"GL190014",
"GL190000DarkBlue":"GL190014",
"GL190000DarkBlue":"GL190014",
"GL190000DarkRed":"GL190008",
"GL190000DarkRed":"GL190008",
"GL190000DarkRed":"GL190008",
"GL190000DarkRed":"GL190008",
"GL190000DarkRed":"GL190008",
"GL190000Transparent":"GL190010",
"GL190000Transparent":"GL190010",
"GL190000Transparent":"GL190010",
"GL190000Transparent":"GL190010",
"GL190000Transparent":"GL190010",
"GL190000Brown":"GL190013",
"GL190000Brown":"GL190013",
"GL190000Brown":"GL190013",
"GL190000Brown":"GL190013",
"GL190000Brown":"GL190013",
"GL190000White":"GL190007",
"GL190000White":"GL190007",
"GL190000White":"GL190007",
"GL190000White":"GL190007",
"GL190000White":"GL190007",
"GL190000Pink12":"GL190004",
"GL190000Pink10":"GL190004",
"GL190000Pink8":"GL190004",
"GL190000Pink6":"GL190004",
"GL190000Pink4":"GL190004",
"GL190000Yellow12":"GL190002",
"GL190000Yellow10":"GL190002",
"GL190000Yellow8":"GL190002",
"GL190000Yellow6":"GL190002",
"GL190000Yellow4":"GL190002",
"GL190000SeaBlue":"GL190012",
"GL190000SeaBlue":"GL190012",
"GL190000SeaBlue":"GL190012",
"GL190000SeaBlue":"GL190012",
"GL190000SeaBlue":"GL190012",
"GL19000014mm":"GL190005",
"GL190000MatteBlack":"GL190005",
"GL190000MatteBlack":"GL190005",
"GL190000MatteBlack":"GL190005",
"GL190000MatteBlack":"GL190005",
"GL190000MatteBlack":"GL190005",
"GL190000Red12":"GL190003",
"GL190000Red10":"GL190003",
"GL190000Red8":"GL190003",
"GL190000Red6":"GL190003",
"GL190000Red4":"GL190003",
"GL190000Green12":"GL190011",
"GL190000Green10":"GL190011",
"GL190000Green8":"GL190011",
"GL190000Green6":"GL190011",
"GL190000Green4":"GL190011",
"GL190000Black14":"GL190015",
"GL190000Black12":"GL190015",
"GL190000Black10":"GL190015",
"GL190000Black8":"GL190015",
"GL190000Black6":"GL190015",
"GL190000Black4":"GL190015",
"GL190000MatteWhite12":"GL190006",
"GL190000MatteWhite10":"GL190006",
"GL190000MatteWhite8":"GL190006",
"GL190000MatteWhite6":"GL190006",
"GL190000MatteWhite4":"GL190006",
"CR190019":"CR190019",
"CR190019":"CR190019",
"CR190019":"CR190019",
"CR190019":"CR190019",
"CR190019":"CR190019",
"TI190000-08":"TI190008",
"TI190000-08":"TI190008",
"TI190000-08":"TI190008",
"TI190000-08":"TI190008",
"TI190000-08":"TI190008",
"TI190000-08":"TI190008"};

  
    var f=false,interval=setInterval(function(){
        if($("tr.content").length>0 && $("#rrrr").length===0){
            //clearInterval(interval);//注释掉是因为页面数据是用AJAX加载的,停掉定时,下一页时就不能自己处理了
            if($("#start_do").length==0){
              $("button[uid='oneClickCreate']").after("<button id='stop_do'>停止配对</button>");
                $("button[uid='oneClickCreate']").after("<button id='start_do'>开始配对</button>");
            }
            $("#start_do").on("click",function(){
                 f=true;
            });
            $("#stop_do").on("click",function(){
                 f=false;
            });
        }
        if(f) start();
    },1000),
    start=function(){
      if( $("#rrrr").length===0 && $("tr.content").length>0 ){
        $("#pageList").append("<input type='hidden' value='done' id='rrrr' />");
      }else{
        return false;
      }
      var rows=$("tr.content");
      
      $.each(rows,function(idx,item){
        var cells=$(this).children(),
        item_diameter=/\d+mm/.exec($.trim(cells.eq(3).text())),
        sku=$.trim(cells.eq(4).text()),
        dianxiaomi_sku=$.trim(cells.eq(5).text()),
        action=cells.eq(6).find("a");
        if(sku.length>8){
          if(sku.length==9){
             sku=sku.replace("-","");
          }else{
            sku=sku.replace("00-","");
            if(sku.length>8){
               sku=sku.split("-")[0];
            }
          }
        }
        if(sskk[sku]){sku=sskk[sku];}
        //console.log(dianxiaomi_sku);
        if(!dianxiaomi_sku){
          setTimeout(function(){
            action.click();
            $("#addFromProValue").val(sku);
            var interval2=setInterval(function(){
                if($("#btnSelectSearch").length>0){
                    clearInterval(interval2);
                    $("#btnSelectSearch").click();
                    setTimeout(function(){
                      var search_sku=sku+"_"+item_diameter[0].replace("mm",""),
                        exists_dianxiaomi_sku=$("#addFromProPageList").find("input[value='"+search_sku+"']");
                        if(exists_dianxiaomi_sku.length>0){
                          exists_dianxiaomi_sku.prev().click();
                        }else{
                          $("#addFromProPageList").parent().next().find("button").click();
                          $("#rrrr").remove();
                        }
                      item.remove();
                    },2000);
                    
                }
            },1000);
            
            
          },2000);
           
           return false;
        } 
      });
      
    }
    
})()