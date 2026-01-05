// ==UserScript==
// @name           露天拍賣登入便(可自動登入)
// @namespace      wsmwason.ruten.easylogin
// @description    在露天拍賣(www.ruten.com.tw)登入時，可使用 Enter 直接登入，免去辨識圖片登入按鈕位置，亦可修改本 Script 輸入帳號密碼進行自動登入。
// @include        https://member.ruten.com.tw/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version        1.0
// @auther         wsmwason
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/2439/%E9%9C%B2%E5%A4%A9%E6%8B%8D%E8%B3%A3%E7%99%BB%E5%85%A5%E4%BE%BF%28%E5%8F%AF%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2439/%E9%9C%B2%E5%A4%A9%E6%8B%8D%E8%B3%A3%E7%99%BB%E5%85%A5%E4%BE%BF%28%E5%8F%AF%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5%29.meta.js
// ==/UserScript==

/**
 * Update:
 *   2014/12/19
 *
 * Authors:
 *   露天拍賣的登入實際上需要 Captcha 的驗證，只是做成了圖片位置座標變換，
 *   需要以肉眼判斷座標位置，此 Script 使用 HTML5 canvas 讀取圖片位置，
 *   將可透過 Enter 直接進行登入。
 *   這年頭了露天拍賣居然還可以使用 big5 撐到現在，實在厲害。
 *
 * Changelog:
 *
 *  2014/12/19 Ver 1.0
 *          -- 改放 GitHub 同步更新
 *
 *  2014/10/15 Ver 1.0
 *          -- 更新 2014/10 新版露天 Captcha 驗證方式
 *          -- 引用 jquery 1.7.2
 *
 *  2014/06/14 Ver 0.6
 *          -- 改放 Greasy Fork
 *
 *  2012/06/22 Ver 0.5
 *          -- 提供露天拍賣自動登入
 *          -- 提供露天拍賣免辨識圖片登入按鈕位置直接以 Enter 登入
 */
 
// 設定帳號 
var userName = '';
// 設定密碼
var passWord = '';
// 設定是否自動登入
var autoLogin = false;

// 取消一些沒用的檢查
var overwriteScriptCode = new Array();
overwriteScriptCode = [
  'function noenter(event){ return true; }',
  'function img_reload(){ }'
];
var script = document.createElement('script');
script.innerHTML = overwriteScriptCode.join('\n');
document.getElementsByTagName('head')[0].appendChild(script); 

// 讀取驗證圖片寫入 Captcha
var captchaX, captchaY = 0;
var img = new Image();
var context;
var canvas = document.createElement('canvas');
img.onload = function() {
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d').drawImage(img, 0, 0);
  context = canvas.getContext("2d")
  context.drawImage(img, 0, 0);
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  var findPixel = false;
  for(x=0;x<=canvas.width;x++){
    if(findPixel==true) break;
    for(y=0;y<=canvas.height;y++){
      var index = (y*imageData.width + x) * 4;
      var red = imageData.data[index];
      var green = imageData.data[index + 1];
      var blue = imageData.data[index + 2];
      var alpha = imageData.data[index + 3];

      if(red==4 && green==2 && blue==4 && alpha==255){ 
        captchaX = x;
        captchaY = y;
        findPixel = true;
        break;
      }
    }
  }

  $('#btn_login').after('<input type="hidden" name="btn_login.x" value="'+captchaX+'" />');
  $('#btn_login').after('<input type="hidden" name="btn_login.y" value="'+captchaY+'" />');

  if(userName!='' && passWord!='' && autoLogin==true){
    var $form = $('form[name="main"]');
    $form.attr('action', 'login.php?refer=https%3A%2F%2Fmember.ruten.com.tw%2Fuser%2Flogin.htm');
    $form.submit();
  }
  
};

// 2014/10 版本 captcha 方式
$.ajax({
  url: 'image_key.php',
  dataType: 'json',
  success: function(data){
    $('#userid').focus();
    $('#captcha').val(data.key);
    $('#btn_login').attr('src', 'image.php?key='+data.key);
    img.src = 'image.php?key='+data.key;
  }
});
