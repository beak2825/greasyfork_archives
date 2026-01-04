// ==UserScript==
// @name         Ticket hunter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抢票辅助
// @author       Miracle Taylor
// @match        https://detail.damai.cn/*
// @require https://code.jquery.com/jquery-2.1.2.min.js
// @grant      unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397827/Ticket%20hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/397827/Ticket%20hunter.meta.js
// ==/UserScript==


//定义 每次 买票张数 默认1张
var my_num = 1;

//定义 循环多少次 (无限次设置 inf 为 true) 暂未实装 目前都是无限次刷新
var my_count = 1;
var inf = false;
//定义 出票  城市 (若不设置，默认所有城市) ['扬州站'，...]
var my_city = [];
//定义当前页面url
var url = window.location.href;

// 定义场次 勿修改
var sessions = [];

var ticket_info1={};
var ticket_info2={};

//订单的url
var order_url=[];

window.count = my_count;



$(document).ready(function(){
     createGui();
     var time = $(".perform__order__select.perform__order__select__performs .select_right_list .active span:last-of-type").text().trim().split('\n')[0];
     var data = JSON.parse($("#dataDefault").text());
     my_num = localStorage.getItem('my_num') == null? 1:localStorage.getItem('my_num');
     //console.log(data);

     //获取 所有能买的票的信息 id
      console.log(localStorage.getItem('start'))
      try{
          if( localStorage.getItem('start')){
              judge(data);
              getOrder(my_num);
              buyTicket(order_url);

          }
      }
     catch(err){
        localStorage.removeItem('start');
        localStorage.removeItem('my_num');
    }

    }); //ready

 function sleep(ms) {
  return new Promise(resolve =>
      setTimeout(resolve, ms)
  )
}

function createGui(){
     var $service = $(".content-right .service");

     var $style = $('<style>'+
                   '#control_container{margin: 20px 0; background:#00ff00;padding:20px 0;}'+
                   '#control_container button{width:80%;margin:10px 10%;padding:10px 0;font-size:30px;border-style: solid;}'+
                   '#start_btn{color:black;}'+
                   '#end_btn{color:red;}'+
                   '#number_input_wrapper{display: flex;justify-content:center;font-size: 20px; margin-bottom:20px;}'+

                   '</style>');
     var $control_container = $("<div id='control_container'></div>");


     var $number_input = $('<div id="number_input_wrapper">请输入人数：<input id="number_input" type="number" value="1" min="1" max="6"></div>');
     var $start_btn = $('<button id="start_btn">Start</button>');
     var $end_btn = $('<button id="end_btn">Stop</button>');
    $control_container.append($style);
    $control_container.append($number_input);
    $control_container.append($start_btn);
    $control_container.append($end_btn);

    $control_container.insertBefore($service);

    $("#start_btn").click(function(){
        localStorage.setItem('start', true);
        localStorage.setItem('my_num',  $("#number_input").val());
        reloadPage();
    });
    $("#end_btn").click(function(){
        localStorage.removeItem('start');
        localStorage.removeItem('my_num');
        clearTimeout(window.ints);

    });




}


    //获取 所有能买的票的信息 id
    function judge(data){
    var performBases = data['performBases'];
    for (var i=0;i<performBases.length;i++){
         var performBase = performBases[i];
         var performs = performBase["performs"];
         var  title =  performBase['name'];
         for(var j=0; j<performs.length; j++) {
             var perform = performs[j];

             var itemId = perform["itemId"];
             var goodlist = perform['skuList'];
             for (var k=0;k<goodlist.length;k++){
                  //info 中按顺序存放 itemid，price，skuid，isbuy
                 var info = [];
                 var good = goodlist[k]
                 info.push(itemId);
                 info.push(good['dashPrice']);
                 info.push(good['skuId']);
                 info.push(good['skuEnable']);
                 var name = title + good['skuName']
                 ticket_info1[name] = info;

             }

         }
    }

}

//people_num ：每次  购买的 张数
  function getOrder(people_num){//function
         var  max_num = $("span[class='number_right_limit']").text().replace(/[^0-9]/ig,"");
         people_num = people_num > max_num ? max_num:people_num;
         for (var key in ticket_info1){//for
              var detail = ticket_info1[key];
              if( !detail[3]){
                  continue
              }
             else{
                 var name   = key
                 var skuId  = detail[2];
                 var itemId = detail[0];
                 console.log(name);
                 console.log(skuId)
                 var url  = "https://buy.damai.cn/orderConfirm?exParams=%7B%22damai%22%3A%221%22%2C%22channel%22%3A%22damai_app%22%2C%22umpChannel%22%3A%2210002%22%2C%22atomSplit%22%3A%221%22%2C%22serviceVersion%22%3A%221.8.5%22%7D&buyParam=" + itemId + "_" + people_num + "_" + skuId + "&buyNow=true&spm=a2oeg.project.projectinfo.dbuy"

                 order_url.push(url)
             }
         }//for

         //重新刷票
         //window.open(url);
         //button.click();
         //window.open(url);
     }//function

window.reloadPage=function(){
 /**  if(!inf){
        window.count --;
      }
**/
    window.location.reload();
}
function buyTicket(urllist){
      var length = urllist.length;
      if(length != 0){
         for(var i=0;i<length;i++){
              var url = urllist[i];
               window.open(url,'newwindow','height=400,width=400,top=0,left=0');
                //在当前页面 跳转
               //window.location.href = url;
         }
      }
     else{
          //alert('暂无票可买');
     }
    window.ints=setTimeout(reloadPage,1000)

}






