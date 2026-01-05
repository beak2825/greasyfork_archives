// ==UserScript==
// @name        Rent591
// @namespace   Rent591
// @description 移除頂樓加蓋＆沒有照片的物件、移除物件-資訊欄位可點擊移除
// @description 調整網址對應、調整樓層邏輯
// @include     https://rent.591.com.tw/*
// @version     1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18296/Rent591.user.js
// @updateURL https://update.greasyfork.org/scripts/18296/Rent591.meta.js
// ==/UserScript==
var RemoveThisPageItemCount = 1;
window.onscroll = function() {RemoveThisPageItem()};

function RemoveThisPageItem()
{
  //避免大量啟動此過濾功能
  if (RemoveThisPageItemCount % 10 == 0) {
    var floatSwitch = true;  //移除頂加、地下室、辦公環境、雅房
    var otherSwitch = true;  //移除無照片
    var imageSwitch = false;  //移除5樓以上，或是頂樓
    
    
    var CountRemoveItem = 0;
    if ($('#RemoveItemCount').length > 0) CountRemoveItem = parseInt($('#CountNB').html());
    
    if(otherSwitch)
    {
      //移除頂加、地下室、辦公環境、雅房
      $('div.shList > ul > li > div > p').each(function () {
        if (
          $(this).text().indexOf('頂樓加蓋') >= 0 
          || $(this).text().indexOf('B') >= 0 
          || $(this).text().indexOf('車位') >= 0
          || $(this).text().indexOf('辦公') >= 0
          || $(this).text().indexOf('雅房') >= 0
        )
        {
          $(this).parentsUntil('.shList').parent().remove();
          CountRemoveItem++;
        }
      });
    }
    
    if(imageSwitch)
    {
      //移除無照片
      $('.imgMore>a').each(function () {
        if ($(this).html() == '0張照片')
        {
          $(this).parentsUntil('.shList').parent().remove();
          CountRemoveItem++;
        }
      });
    }
    
    //移除5樓以上，或是頂樓
    if(floatSwitch)
    {
      $('p.title').next().next().each(function () {
        var TotalfloatText = $(this).text();
        var floatFirstIndex = TotalfloatText.indexOf('：') + 1;
        var arrFloat = TotalfloatText.substring(floatFirstIndex, TotalfloatText.length).split('/');
        if (
          ((parseInt(arrFloat[0]) > 4 && parseInt(arrFloat[2]) <= 7)) 
          || (parseInt(arrFloat[0]) >= parseInt(arrFloat[1]) - 1 && parseInt(arrFloat[0]) >= 4)
        )
        {
          $(this).parentsUntil('.shList').parent().remove();
          CountRemoveItem++;  
        }
      });
    }

    $('.shResult').delegate('#RemoveItemCount', 'click', function(){
      CountRemoveItem = 0;
      $('#RemoveItemCount').fadeOut("slow");
    });
    
    if ($('#RemoveItemCount').length > 0) $('#RemoveItemCount').remove();
    $('.orderList').eq(0).after('<div id="RemoveItemCount"><font color="red">'
                                + '移除 <font id="CountNB" style="font-family: Arial,Verdana;font-size:21px; color:#00FFDB">' 
                                + CountRemoveItem + '</font> 個物件</font></div>');
  }
  RemoveThisPageItemCount++;
}

RemoveThisPageItem();