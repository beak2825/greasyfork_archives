// ==UserScript==
// @name         stardust
// @namespace    http://stardust.live/
// @version      2.1
// @description  helloworld
// @author       Kevin Brooks
// @match        https://buyertrade.taobao.com/trade/itemlist/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404007/stardust.user.js
// @updateURL https://update.greasyfork.org/scripts/404007/stardust.meta.js
// ==/UserScript==

var time; //超级定时器

window.onload = function ()
{
  var i;

  var drag = document.createElement('div');
  drag.innerHTML = '<div id="TableBox" style=" cursor:pointer;position: fixed; height:80px;width:80px;top: 100px; right: 50px; z-index: 9999999; "><img ondragstart="return false;" src="http://stardust.live/drag.png"  alt="额，请联系管理解决图片加载问题"  height="80px" width="80px"/></div>';
  document.body.appendChild(drag);

  var panel = document.createElement('div');
  panel.innerHTML =
    '<div id="TableBoxChild" style="overflow:hidden;border-radius:10px;border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 130px; right: 120px; display:none; text-align:center; z-index: 9999999; background-color: rgba(247, 147, 30, 0.8); " >' +
      '<div class="message"><span>&nbsp</span></div>' +
      '<span style="font-size: medium;"></span>' +
       '<div>' +
        '<button id="btnSearch" style="border-radius:5px;">开始提取</button>' +
        '<button id="btnStop" style="border-radius:5px;">停止提取</button>' +
        '<button id="btnClean" style="border-radius:5px;">清空表格</button>' +
        '<button id="btnExport" style="border-radius:5px;">下载Excel表格</button>' +
        '<button id="btnWindow" style="border-radius:5px;">调整窗口</button>' +
        '<HR style="border:1px dashed rgb(0, 85, 68);width:310px">'+
       '</div>' +
        '<div id="hDiv" style="position: relative;">' +
          '<table border="1" style="width: 2400px;">' +
            '<thead id="tabhead">' +
              '<tr>' +
                '<th style="width: 5%;" >下单日期</th>' +
                '<th style="width: 5%;">订单号</th>' +
                '<th style="width: 10%;">商品名称</th>' +
                '<th style="width: 15%;">商品样图</th>' +
                '<th style="width: 15%;">交易快照</th>' +
                '<th style="width: 10%;">商品规格</th>' +
                '<th style="width: 10%;">商家名称</th>' +
                '<th style="width: 5%;" >单价</th>' +
                '<th style="width: 5%;" >数量</th>' +
                '<th style="width: 5%;" >本单实付总款</th>' +
                '<th style="width: 5%;" >订单状态</th>' +
                '<th style="width: 5%;" >订单详情</th>' +
                '<th style="width: 5%;" >页面编号</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody >' +
              '<tr>' +
              '</tr>' +
            '</tbody>' +
            '<tfoot>' +
              '<tr>' +
              '</tr>' +
            '</tfoot>' +
          '</table>' +
        '</div>' +
        '<div id="dDiv" style="max-height: 300px; overflow-y: auto;">' +
          '<table border="1" style="font-size: 12px;word-break:break-all;width: 2400px;" id="TableId">' +
            '<thead id="tabhead" style="visibility :collapse;">' +
              '<tr>' +
                '<th style="width: 5%;" >下单日期</th>' +
                '<th style="width: 5%;">订单号</th>' +
                '<th style="width: 10%;">商品名称</th>' +
                '<th style="width: 15%;">商品样图</th>' +
                '<th style="width: 15%;">交易快照</th>' +
                '<th style="width: 10%;">商品规格</th>' +
                '<th style="width: 10%;">商家名称</th>' +
                '<th style="width: 5%;" >单价</th>' +
                '<th style="width: 5%;" >数量</th>' +
                '<th style="width: 5%;" >本单实付总款</th>' +
                '<th style="width: 5%;" >订单状态</th>' +
                '<th style="width: 5%;" >订单详情</th>' +
                '<th style="width: 5%;" >页面编号</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody >' +
              '<tr>' +
              '</tr>' +
            '</tbody>' +
            '<tfoot>' +
              '<tr>' +
              '</tr>' +
            '</tfoot>' +
          '</table>' +
        '</div>' +
    '</div>';
  panel.style.position = "fixed";
  panel.style.top = 0;
  panel.style.right = 0;
  panel.id="PanelBox";
  panel.style.cursor="pointer";
  panel.style.zIndex = 9999999;
  document.body.appendChild(panel);

  var item = Array.prototype.slice.call(document.getElementsByClassName('bought-wrapper-mod__head-info-cell___29cDO'));
  var itemli = document.getElementsByTagName("li");
  var event = new MouseEvent('click',
  {
    cancelable: true,
    bubble: true,
    view: window
  });

  var hDiv = document.getElementById('hDiv');
  dDiv.onscroll = function()
  {
    hDiv.style.left = dDiv.scrollLeft * -1 + 'px'
  }
//console.log(data);
  var btnFoldFlag = 0;
  $("#btnSearch").click(function(){
      document.getElementById("TableBoxChild").style.display="block";
      btnFoldFlag = 1;
      search();
  });
  $("#btnStop").click(function(){
    clearInterval(time);
  });
  $("#btnClean").click(function(){
    $("#TableId  tr:not(:first)").empty("");
  });
  $("#btnExport").click(function(){
    $('#TableId').tableExport({
        type: 'xls',
        fileName:'淘宝购物清单'
    });
  });
  var btnWindowFlag = 0;
  $("#btnWindow").click(function()
  {
    var o = document.getElementById("TableBoxChild").style;
    if(btnWindowFlag)
    {
      btnWindowFlag = 0;
    }else
    {
      btnWindowFlag = 1;
    }
  });

  var PrepositionX=0,PrepositionY=0;
  var PreWidth=0,PreHeight=0;
  var CurWidth=330;

  $("#TableBox").mousedown(function(e)
  {
    // e.pageX
    var positionDiv = $(this).position();
    var distenceX = e.clientX - positionDiv.left;
    var distenceY = e.clientY - positionDiv.top;

    //alert(positionDiv.top);
    //alert(distenceX)
    // alert(positionDiv.left);
    PrepositionX = positionDiv.left;
    PrepositionY = positionDiv.top;

    var o = document.getElementById("TableBoxChild");
    PreWidth = document.getElementById("TableBoxChild").clientWidth;
    PreHeight =  document.getElementById("TableBoxChild").clientHeight;

    $(document).mousemove(function(e)
    {
      var x = e.clientX - distenceX;
      var y = e.clientY - distenceY;

      //console.log(distenceX);

      if (x < 0) {
        x = 0;
      } else if (x > document.body.clientWidth - $("#TableBox").outerWidth(true)) {
        x = document.body.clientWidth - $("#TableBox").outerWidth(true);
      }

      if (y < 0) {
          y = 0;
      } else if (y > window.innerHeight - $("#TableBox").outerHeight(true)) {
          y = window.innerHeight - $("#TableBox").outerHeight(true);
      }

      var o = document.getElementById("TableBoxChild");
      var positionDiv = $("#TableBox").position();
      if(btnWindowFlag)
      {
       $("#TableBoxChild").css({
           //'left': x - 330 + 'px',
           'top': y + 30 + 'px'
       });

        //console.log();
        //console.log(document.getElementById("TableId").offsetHeight);
        //if(document.getElementById("TableId").offsetWidth)
        o.style.width=(PreWidth+positionDiv.left-PrepositionX)+"px";
        //console.log(positionDiv.left-PrepositionX);
        o.style.height=(PreHeight+PrepositionY-positionDiv.top)+"px";
        //alert((o.clientWidth+positionDiv.left-PrepositionX)+"px");
        //$("#TableBoxChild").css({
        //   'left': x - 330 - (positionDiv.left-PrepositionX) + 'px',
        //   'top': y + 30 + PrepositionY-positionDiv.top + 'px'
        //});
      }else
      {
         $("#TableBoxChild").css({
             'left': x - CurWidth + 'px',
             'top': y + 30 + 'px'
         });
          //console.log(o.scrollWidth);
      }
      $("#TableBox").css({
          'left': x + 'px',
          'top': y + 'px'
      });

    });

    $(document).mouseup(function()
    {
      var positionDiv = $("#TableBox").position();
      if(PrepositionX==positionDiv.left && PrepositionY==positionDiv.top)
      {
          if(btnFoldFlag)
          {
              document.getElementById("TableBoxChild").style.display="none";
              btnFoldFlag = 0;
          }else
          {
              document.getElementById("TableBoxChild").style.display="block";
              btnFoldFlag = 1;
          }
      }

      if(btnWindowFlag)
      {
          var o = document.getElementById("TableBoxChild");
          CurWidth = o.clientWidth;
          btnWindowFlag=0;
      }

      $(document).off('mousemove');
      //console.log(PrepositionX);
      //console.log(e.clientX);
      PrepositionX=0;
      PrepositionY=0;

      PreWidth=0;
      PreHeight=0;
    });
  });
}

function search ()
{
  var number = Array.prototype.slice.call(document.getElementsByClassName('pagination'));
  var numberCunt = number[0].childElementCount;
  var times = number[0].children[numberCunt-3].innerText;
  var startFlag = 0;
  var clickFlag = 0;
  var countList = 0;
  //console.log(times);
  //console.log(numberCunt);
      //data.page.totalPage;
  time = window.setInterval(function()
  {
      var value = $('.pagination-item-'+times).prop("className").indexOf("pagination-item-active")!==-1;
 //console.log(value);
  if(Array.prototype.slice.call(document.getElementsByClassName('bought-wrapper-mod__head-info-cell___29cDO')).length==0)    toast("检索失败，请重试",0.8);
 if(value && clickFlag==0 && Array.prototype.slice.call(document.getElementsByClassName('bought-wrapper-mod__head-info-cell___29cDO')).length!=0)
 {
    clickFlag = 1;
    times--;

    if (times==0)
    {
        $('.pagination-item-'+1).click(clickFunc());
        $('.pagination-item-'+1).click();
        toast("本次共检索："+countList+ "项",0.8);
        clearInterval(time);
        return;
    }
    //console.log(times);
    $('.pagination-item-'+times).click(clickFunc());
    $('.pagination-item-'+times).click();
  }

    if(startFlag==0)
    {
        startFlag = 1;
        $('.pagination-item-'+times).click();
    }
  },20);

    function clickFunc(){
//console.log();
      //etTimeout( function()
      //{
        var item = Array.prototype.slice.call(document.getElementsByClassName('bought-wrapper-mod__head-info-cell___29cDO'));
        var product = Array.prototype.slice.call(document.getElementsByClassName('bought-wrapper-mod__trade-order___2lrzV'));
        //console.log(Array.prototype.slice.call(document.getElementById("index-mod__root___3ZrD7")));
        var order = ' ';

        countList += item.length;
        //toast("本次共检索："+item.length+ "项",0.8);
        //console.log(item.length);
        for(var i=0;i<item.length ;i++)
        {
          var tb = document.getElementById("TableId");
          var row = tb.insertRow(1+i);
          row.insertCell().innerHTML = product[i].children[0].children[1].children[0].children[0].firstElementChild.innerText; //下单日期
          row.insertCell().innerHTML = product[i].children[0].children[1].children[0].children[0].children[1].children[2].innerText; //订单号

          var count = product[i].children[0].children[2].childElementCount;
          var countValue='<table border=1 frame=void width=100%>';

            //console.log(count);
            //toast("本次共检索："+count+ "项",0.8);
          for(var k=0;k<count;k++)
          {
              if(count>1) order = "（" + (k+1) + "）";
              else order = ' ';
               countValue += '<tr style="height:50px">'+ '<td>' + order + product[i].childNodes[0].children[2].children[k].children[0].children[0].children[1].children[0].children[0].innerText +"<br/>"+ '</td>'+ '</tr>'; //商品名称
          }
          countValue += '</table>';
          var newCell = row.insertCell();
          newCell.innerHTML = countValue;
          newCell.style.textAlign="left";

          countValue='<table border=1 frame=void  width=100%>';
          for(k=0;k<count;k++)
          {
              if(count>1)
                  if(product[i].children[0].children[2].children[k].children[0].innerText=="保险服务")
                      if(count>2) order = "（" + (k+1) + "）";
                      else  order = ' ';
                  else
                      if(count>2) order = "（" + (k+1) + "）";
              else order = ' ';
              if(product[i].children[0].children[2].children[k].children[0].innerText!="保险服务" && product[i].children[0].children[2].children[0].children[0].children[0].children[0].children.length==1) //判断是否存在样图
              {
                  var lengthValue = product[i].children[0].children[2].children[0].children[0].children[0].children[0].children[0].children.length;
                  countValue += '<tr style="height:50px;">'+ '<td>'  + order +
                    // product[i].children[0].children[2].children[k].children[0].children[0].children[0].children[0].innerHTML+
                            "<a href='"+
                     //product[i].children[0].children[2].children[0].children[0].children[0].children[0].children[0].href //购买
                             product[i].children[0].children[2].children[0].children[0].children[0].children[0].children[0].children[lengthValue-2].src+ "' target=\"_blank\">" +
                             product[i].children[0].children[2].children[0].children[0].children[0].children[0].children[0].children[lengthValue-2].src+ "</a>"+
                             "<br/>"+ '</td>'+ '</tr>'; //商品样图
              }else
                  countValue += '<tr style="height:50px">'+ '<td>' + '</td>'+ '</tr>';
          }
          countValue += '</table>';
          newCell = row.insertCell();
          newCell.innerHTML = countValue;
          newCell.style.textAlign="left";

          countValue='<table border=1 frame=void width=100%>';
          for(k=0;k<count;k++)
          {
              if(count>1)
                  if(product[i].children[0].children[2].children[k].children[0].innerText=="保险服务")
                      if(count>2) order = "（" + (k+1) + "）";
                      else  order = ' ';
                  else
                      if(count>2) order = "（" + (k+1) + "）";
              else order = ' ';
              if(product[i].children[0].children[2].children[k].children[0].innerText!="保险服务" && product[i].children[0].children[2].children[k].children[0].children[0].children[1].children[0].children[1].innerText!='')
                 countValue += '<tr style="height:50px">'+ '<td>' + order +
                             "<a href='"+
                             product[i].childNodes[0].children[2].children[k].children[0].children[0].children[1].children[0].children[1].href+ "' target=\"_blank\">" +
                             product[i].childNodes[0].children[2].children[k].children[0].children[0].children[1].children[0].children[1].href+ "</a>"+
                             "<br/>"+ '</td>'+ '</tr>'; //交易快照
              else
                  countValue += '<tr style="height:50px">'+ '<td>' + '</td>'+ '</tr>';

          }
          countValue += '</table>';
          newCell = row.insertCell();
          newCell.innerHTML = countValue;
          newCell.style.textAlign="left";

          countValue='<table border=1 frame=void width=100%>';
          for(k=0;k<count;k++)
          {
              if(count>1)
                  if(product[i].children[0].children[2].children[k].children[0].innerText=="保险服务")
                      if(count>2) order = "（" + (k+1) + "）";
                      else  order = ' ';
                  else
                      if(count>2) order = "（" + (k+1) + "）";
              else order = ' ';
              if(product[i].children[0].children[2].children[k].children[0].innerText!="保险服务" && product[i].children[0].children[2].children[k].children[0].children[0].children[1].children.length>=3)
                  countValue += '<tr style="height:50px">'+ '<td>' + order + product[i].childNodes[0].children[2].children[k].children[0].children[0].children[1].children[1].innerText +"<br/>"+ '</td>'+ '</tr>'; //商品规格
              else
                  countValue += '<tr style="height:50px">'+ '<td>' + '</td>'+ '</tr>';
          }
          countValue += '</table>';
          row.insertCell().innerHTML = countValue;

          row.insertCell().innerHTML = product[i].children[0].children[1].children[0].children[1].innerText; //商家名称

          countValue='<table border=1 frame=void width=100%>';
          for(var l=0;l<count;l++)
          {
              //if(product[i].children[0].children[2].children[k].children[0].innerText!="保险服务")
               countValue += '<tr style="height:50px">'+ '<td>' + product[i].children[0].children[2].children[l].children[1].children[0].lastChild.innerText +"<br/>"+'</td>'+ '</tr>'; //单价

          }
          countValue += '</table>';
          row.insertCell().innerHTML = countValue;

          countValue='<table border=1 frame=void width=100%>';
          for(var m=0;m<count;m++)
          {
              if(product[i].children[0].children[2].children[m].children[0].innerText!="保险服务")
                  countValue += '<tr style="height:50px">'+ '<td>' + product[i].children[0].children[2].children[m].children[2].innerText +"<br/>"+ '</td>'+ '</tr>'; //数量
              else if(product[i].children[0].children[2].children[m].children[0].innerText=="保险服务")
                  countValue += '<tr style="height:50px">'+ '<td>' + 1 + '</td>'+ '</tr>';
              else
                  countValue += '<tr style="height:50px">'+ '<td>' + '</td>'+ '</tr>';
          }
          countValue += '</table>';
          row.insertCell().innerHTML = countValue;

          row.insertCell().innerHTML = product[i].children[0].children[2].children[0].children[4].children[0].children[0].innerText; //本单实付总款

          row.insertCell().innerHTML = product[i].children[0].children[2].children[0].children[5].children[0].children[0].innerText; //订单状态

          newCell = row.insertCell();
          if(product[i].children[0].children[2].children[0].children[5].children[0].children[1].children[0].children[0].innerText == "订单详情") //判断是否开启了用户评价
            newCell.innerHTML = "<a href='"+
              product[i].children[0].children[2].children[0].children[5].children[0].children[1].children[0].children[0].href+ "' target=\"_blank\">" +
              product[i].children[0].children[2].children[0].children[5].children[0].children[1].children[0].children[0].href+ "</a>"; //订单详情
          else
            newCell.innerHTML = "<a href='"+
              product[i].children[0].children[2].children[0].children[5].children[0].children[1].children[1].children[0].href+ "' target=\"_blank\">" +
              product[i].children[0].children[2].children[0].children[5].children[0].children[1].children[1].children[0].href+ "</a>"; //订单详情
          newCell.style.textAlign="left";

          row.insertCell().innerHTML = times+1; //页面编号
        }
        clickFlag = 0;times
        $(this).unbind("click");
      //}, 1 * 1000 );this
    }
}

var str='<div class="mess" style="z-index: 9999999;position: fixed;top: 50%;left: 50%;margin-left:-100px;margin-top:-62px;border-radius:25px;background-color:#9e9e9e;color:#ffffff;min-width:200px;min-height:124px;line-height:124px;text-align:center"><span style="font-size:24px"></span></div>';
function toast(mess,time){
    $("body").append(str);
    $(".mess").fadeIn().find("span").html(mess);
    $(".message").fadeIn().find("span").html(mess);
    setTimeout(function(){
        $(".mess").fadeOut();
    },time*1000)
}
