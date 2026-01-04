// ==UserScript==
// @name 查询订单数
// @namespace Violentmonkey Scripts
// @match https://trade.1688.com/order/seller_order_list.htm*
// @grant none
// @require http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @description 查询1688订单数
// @version 0.0.20181218.1
// @downloadURL https://update.greasyfork.org/scripts/371077/%E6%9F%A5%E8%AF%A2%E8%AE%A2%E5%8D%95%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/371077/%E6%9F%A5%E8%AF%A2%E8%AE%A2%E5%8D%95%E6%95%B0.meta.js
// ==/UserScript==

var userId = $("#ts-loginid").val(); //取卖家名称
if(userId!='汕头市莱马贸易有限公司'){return false;}
//alert(userId);


//添加样式表
var style = document.createElement("style");  //alert(1);
style.appendChild(document.createTextNode(""));  //alert(2);
document.head.appendChild(style);  
styleSheet = style.sheet;
styleSheet.addRule(".checkBuyed", "width:40px;height:18px;padding: 1px 2px !important;margin-left:10px;float: left;background: #06315E !important;cursor: pointer;text-align: center;", 0); 
styleSheet.insertRule("@keyframes loading1{ 0%{transform: translateX(6px)} 50%{transform: translateX(14px)} 100%{transform: translateX(6px)} }", 0); 
styleSheet.addRule(".loadtxt", "float:left;line-height:17px;animation: loading1 0.4s infinite linear;", 0);
styleSheet.addRule("div.reData", "float: left;", 0);
styleSheet.addRule("div.reData span", "ma", 0);
styleSheet.insertRule("@keyframes canBuykeyframes{from{background: #32DC47;}to{background: #16A927;} }", 0);   
styleSheet.addRule("div.reData .haveBuy", "padding: 1px 5px;color: #fff;font-weight:bold;background: #ADADAD;", 0);
styleSheet.addRule("div.reData .canBuy", "padding: 1px 5px;color: #fff;font-weight:bold;animation: canBuykeyframes 1s alternate infinite;", 0);



var newNode = $('<a class="checkBuyed order-biz-type-link">查复购</a>');
newNode.bind('click',function(){ checkBuy(this); }); 
function checkBuy(thisDom){
  $(thisDom).html('<span class="loadtxt">-----</span>');
  var listId = $(thisDom).parent().next().children("div.col-group").children("span.order-id").text().split('：')[1].replace(/\s+/g,"");
  var dataInfo ='getListAryAsListNum=1&listId='+listId+'&token=294228566&userId='+userId; //过期token f0e0a1f6-1f32-45de-94c8-afc4af669a58
  $.ajax({
      type:"post",
      url:"https://newecho.applinzi.com/1688APP/1688api.php",
      //data: {'getListAryAsListNum':'1', 'listId':'196663777539646361','token':'f0e0a1f6-1f32-45de-94c8-afc4af669a58'},
      data: dataInfo,
      contentType:"application/x-www-form-urlencoded;charset=utf-8",
      success: function(data){
        //alert(data);//debugger;
        //console.log(data);
        
        var jsonObj = JSON.parse(data); //将字符串转JSON数组
        
        var dataInfo ='getListAryAsListNum222=1&buyerId='+jsonObj['buyerId']+'&token='+jsonObj['token'];
        $.ajax({
          type:"post",
          url:"https://newecho.applinzi.com/1688APP/1688api.php",
          data: dataInfo,
          contentType:"application/x-www-form-urlencoded;charset=utf-8",
          success: function(data){
              //console.log(data);
              var jsonObj = JSON.parse(data); //将字符串转JSON数组
              var allListData = jsonObj;
              var dataHtml = '';
              var countDFu=0,countDFa=0,countDSo=0,countWC=0;
              for(var p in allListData){
                    var baseInfo = allListData[p]['baseInfo'];//获得本交易订单信息
                    try{
                       baseInfo['status'] == 'waitbuyerpay' ? countDFu++ : ''; //待付
                       baseInfo['status'] == 'waitsellersend' ? countDFa++ : '';  //待发
                       baseInfo['status'] == 'waitbuyerreceive' ? countDSo++ : '';  //待收
                       baseInfo['status'] == 'success' ? countWC++ : ''; //完成
                    }catch(err){}
              }
              var dataHtml = "<span>付"+ (countDFa+countDSo+countWC) + "</span>&nbsp;<span>成"+ countWC + "</span>&nbsp;";
              dataHtml = (countDFa+countDSo+countWC)>1 ? "<span class='haveBuy'>已复购</span>&nbsp;"+dataHtml : "<span class='canBuy'>可复购</span>&nbsp;"+dataHtml;
              //document.getElementById("pudData").innerHTML = dataHtml; //buyerID 买家ID
              $(thisDom).parent().children("div.reData").html(dataHtml);
              //alert($(thisDom).text()); //console.log(data)
              $(thisDom).html('查复购');
          }
        });  
        
      }
  });
  //return false;
}



var theCount = $("#bd > ul > li > div.title.order-title > div > div.right");
theCount.each(function(i){ //遍历DOM
  
  //newNode.attr("class",i+1);
  var clonedNode = newNode.clone(true); // 克隆节点   
  $(this).prepend(clonedNode);
  
  var reData = $('<div class="reData"></div>'); //设置填写结果的节点
  $(this).prepend(reData);
  
});





//btnDom.appendChild(newNode);






