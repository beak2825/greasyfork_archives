// ==UserScript==
// @name        GDorder
// @namespace   Violentmonkey Scripts1
// @include     https://gdgpo.czt.gd.gov.cn/gpmall/orders/orderslist.html
// @grant       none
// @version     2.5
// @author      小白
// @require     http://code.jquery.com/jquery-1.12.4.js
// @description 2020/12/30 下午4:51:35
// @downloadURL https://update.greasyfork.org/scripts/419391/GDorder.user.js
// @updateURL https://update.greasyfork.org/scripts/419391/GDorder.meta.js
// ==/UserScript==
var finalData;

$(function () {
    window.helloworld = function() {
        alert('Hello world!');
    }
   window.setTimeout(helloworld());
   appendButton();
  
  $("#downLoad").click(function(){
    var jsonData = [];
    
    $(".tableWrap-hover").each(function(){
      var clientData = {};
      var isFinshedIframe = new Boolean(0);
		  let this1 = $(this);
      
      this1.children(".table-row-title").children(".cell").children(".table-title-item").children(".color6").each(function(){
        
        if($(this).html() =="订单编号："){
          clientData['orderNo'] = $(this).next().html();
        }else if($(this).html() =="订单状态："){
          clientData['status'] = $(this).next().html();
        }else if($(this).html() =="采购单位："){
          clientData['company'] = $(this).next().html();
        }else if($(this).html() =="区划："){
          clientData['areaCode'] = $(this).next().html();
        }else if($(this).html() =="下单时间："){
          clientData['orderTime'] = $(this).next().html();
        }
      });
      
      var products = [];
      this1.children(".projectTable").find("tr").each(function() { 
        // console.log($(this));
        let this2 = $(this);
        var product = {};
        this2.find("td").each(function(){
          // console.log($(this).html());
          // var aDetail = $(this).children("a").html();
          
          /*
          var itemName = $(this).children(".intr").children(".introduce").children(".parts_name").attr("title");
          if(typeof(itemName)!="undefined"){
            product.itemName = itemName;
          }
          
          var itemPrice = $(this).children(".row").children(".col-xs-7").text();
          var num = $(this).children(".row").children(".col-xs-5").text();
          if(typeof(itemPrice)!="undefined" && itemPrice!=""){
            product.itemPrice = itemPrice.replace(/\s+/g,"").substr(1);
          }
          
          if(typeof(num)!="undefined" && num!="" ){
            product.num = num.replace(/\s+/g,"").substr(1);
          }
          */
          
          /**
           * 列表中编列每张单的订单详情，打开n个iframe去获取
           *
           */
          if($(this).children("a").html() == "订单详情"){
            this1.addClass("checked");
            var aDetailHref = $(this).children("a").attr("href");
            // var newWindow = window.open(aDetailHref);
            // newWindow.focus();
            
            var iframe = document.createElement('iframe'); 
            iframe.src = aDetailHref;
            iframe.id = clientData['orderNo'];
            document.body.appendChild(iframe);
            
            $('#'+clientData['orderNo']).load(function(){
                alert('loaded!');
                var invoiceData = {};
                // var obj=document.getElementById(clientData['orderNo']).contentWindow; 

                // console.log($("#"+clientData['orderNo']).contents());
                console.log($("#"+clientData['orderNo']).contents().find("html").find("body").find(".bar_record").find(".bid_box").find(".mrt_tab2").find("tr"));
              
                var i = new Number("0"); 
                $("#"+clientData['orderNo']).contents().find(".bar_record").children(".bid_box").children(".mrt_tab2").find("tr").find("td").each(function(){
                    // console.log($(this).text().replace(/\s+/g,"").indexOf("："));
                    // console.log($(this).text().replace(/\s+/g,""));
                    var arr = $(this).text().replace(/\s+/g,"").split("：");
                     // console.log(arr[0]+"--------"+arr[1]);
                    
                    if($(this).text().replace(/\s+/g,"").indexOf("：") != -1){
                      if(arr[0] == "送货时间" && typeof(arr[1])!="undefined"){
                        clientData['deliveyTime'] = arr[1];
                      }else if (arr[0] == "备注" && typeof(arr[1])!="undefined"){
                        clientData['remark'] = arr[1];
                      }else if (arr[0] == "采购单位" && typeof(arr[1])!="undefined"){
                        clientData['company'] = arr[1];
                      }else if (arr[0] == "采购单位联系人" && typeof(arr[1])!="undefined"){
                        clientData['contactPerson'] = arr[1];
                      }else if (arr[0] == "采购人电话" && typeof(arr[1])!="undefined"){
                        clientData['contactTel'] = arr[1];
                      }else if (arr[0] == "收货地址" && typeof(arr[1])!="undefined"){
                        clientData['address'] = arr[1];
                      }else if (arr[0] == "供货联系人" && typeof(arr[1])!="undefined"){
                        clientData['saleMan'] = arr[1];
                      }else if (arr[0] == "联系电话" && typeof(arr[1])!="undefined"){
                        clientData['saleManTel'] = arr[1];
                      }
                    }else{
                      if(i == 0){
                        invoiceData['type'] = arr[0];
                      }else if(i == 1){
                        invoiceData['invoiceName'] = arr[0];
                      }else if(i == 2){
                        invoiceData['invoiceContent'] = arr[0];
                      }else if(i == 3){
                        invoiceData['taxNum'] = arr[0];
                      }
                      i = Number(i) + Number("1");
                    }
                  
                   clientData['invoice'] = invoiceData;
                });
                  
                 var j = new Number("0"); 
                 $("#"+clientData['orderNo']).contents().find(".table_3").find(".title_1").find("td").each(function(){
                   console.log($(this).text().replace(/\s+/g,""));
                   if(j == 0){
                        
                   }else if(j == 1){
                     product.itemName = $(this).text().replace(/\s+/g,"");
                   }else if(j == 2){
                      product.itemPrice = $(this).text().replace(/\s+/g,"").substr(1);
                   }else if(j == 3){
                     product.num = $(this).text().replace(/\s+/g,"");
                   }
                   j = Number(j) + Number("1");
                   
                 });
                
                console.log(jsonData);
                isFinshedIframe = true;
            });
          }
        });
        products.push(product);
      });
      clientData['products'] = products;
      jsonData.push(clientData);
    });
    console.log(jsonData);
    
    /*
    alert("-----download------");
     //window.location.href='<%=basePath%>pmb/excelShowInfo.do';
      //获取表格
      var exportFileContent = document.getElementById("table_report").outerHTML;     
      //设置格式为Excel，表格内容通过btoa转化为base64，此方法只在文件较小时使用(小于1M)
      //exportFileContent=window.btoa(unescape(encodeURIComponent(exportFileContent)));
      //var link = "data:"+MIMEType+";base64," + exportFileContent;
      //使用Blob
      var blob = new Blob([exportFileContent], {type: 'application/vnd.ms-excel'});         //解决中文乱码问题
    
		let blob = new Blob([html],{ type: 'application/vnd.ms-excel'});
      blob =  new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
    //设置链接
      var link = window.URL.createObjectURL(blob); 
      var a = document.createElement("a");    //创建a标签
      a.download = "test.xls";  //设置被下载的超链接目标（文件名）
      a.href = link;                            //设置a标签的链接
      document.body.appendChild(a);            //a标签添加到页面
      a.click();                                //设置a标签触发单击事件
      document.body.removeChild(a);    
    */
  });
   
});

function appendButton() {
  console.log("----------in---append---");
  var btnHtml = '<a xhref="javascript:toExcel()" id="downLoad" class="sbtn sbtn_color">下载表格</a>';
   $(".sbtn_box").append(btnHtml);
  $(".projectTable").attr('id','table_report');
  
}

function toExcel(){
      //window.location.href='<%=basePath%>pmb/excelShowInfo.do';
      //获取表格
      var exportFileContent = document.getElementById("table_report").outerHTML;     
      //设置格式为Excel，表格内容通过btoa转化为base64，此方法只在文件较小时使用(小于1M)
      //exportFileContent=window.btoa(unescape(encodeURIComponent(exportFileContent)));
      //var link = "data:"+MIMEType+";base64," + exportFileContent;
      //使用Blob
      var blob = new Blob([exportFileContent], {type: "text/plain;charset=utf-8"});         //解决中文乱码问题
      blob =  new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
    //设置链接
      var link = window.URL.createObjectURL(blob); 
      var a = document.createElement("a");    //创建a标签
      a.download = "test.xls";  //设置被下载的超链接目标（文件名）
      a.href = link;                            //设置a标签的链接
      document.body.appendChild(a);            //a标签添加到页面
      a.click();                                //设置a标签触发单击事件
      document.body.removeChild(a);            //移除a标签
 }

