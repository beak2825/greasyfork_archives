// ==UserScript==
// @name         auto_verification
// @version      1.1
// @description  auto_key_verification
// @author       we684123
// @match        https://eportal.lhu.edu.tw/index.do?*
// @match        https://eportal.lhu.edu.tw/login.do
// @grant        GM_xmlhttpRequest
// @namespace    none
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-end
// @domain       https://script.google.com/
// @downloadURL https://update.greasyfork.org/scripts/39780/auto_verification.user.js
// @updateURL https://update.greasyfork.org/scripts/39780/auto_verification.meta.js
// ==/UserScript==

//=============================================================================
(function() {
  //以下設定用
  var account = ""; //選填，預設為空，你的龍華【帳號】，沒填不會幫忙輸入
  var password = ""; //選填，預設為空，你的龍華【密碼】，沒填不會幫忙輸入
  var identity = ""; //選填，預設為空，你的【提供用戶】身分碼(取得身分碼網址)
  var auto_login = true; //必填，預設為true，要不要自動按下 "登入"   (登入首頁)
  var auto_next = true; //必填，預設為true，要不要自動按下 "下一步" (gmail確認)
  var auto_check = true; //必填，預設為true，要不要自動按下 "確認"   (登入失敗頁面)
  var reslog = true; //必填，預設為false，載入回應log?  //目前無用
  var wait_second = 15; //必填，預設為15秒，最低為1，當你網頁載入慢到炸的時候，
  //此程式要等你的電腦多久，如果圖片一直載不下來，你的瀏覽器可能會跟你說有大量腳本在運行
  //此乃正常現象，點"繼續"就好，如果還是不行，建議不要靠自動輸入，改手動吧。

  //以上填完就好囉---------------------------------------------------

  //位置定義
  var login_page = "eportal.lhu.edu.tw/index.do";
  var input_account = document.getElementsByTagName('input')[0];
  var input_password = document.getElementsByTagName('input')[1];
  var input_verification = document.getElementById("authcode");
  var verification_image = document.getElementsByTagName('img')[1];
  var login_button = document.getElementsByTagName('input')[3];
  var server_url = "https://script.google.com/macros/s/AKfycbxAzS75EtzljCtbvJ6l8EyQQISJmUIJ_V7gBHZh_BZ1BMEv_lvt/exec";

  //=============================================================================
  if (String(location.href).search(login_page) > 1) {
    var d01 = new Date();
    //console.log(d01);
    var img = verification_image;
    var imgbase64 = getBase64Image(img);
    //console.log("img.complete?");
    //console.log(img.complete);
    if (imgbase64.length < 30) {
      console.log("imgbase64.length < 30");
      if (wait_second < 1) { //用個防呆
        var wait_second = 1;
      }
      for (var i = 0; i < wait_second * 10; i++) {
        sleep(100); //0.1s
        console.log("i = " + i);
        console.log(img.complete);
        var imgbase64 = getBase64Image(img);
        if (imgbase64.length > 30) {
          break;
        }
      }
    }
    console.log(imgbase64);

    //之所以有下面這行這麼醜是因為gs傲嬌，搞成json居然不吃，只好字串處理了
    var post_data = identity + "~" + String(imgbase64);
    console.log("post_data：");
    console.log(post_data);
    //==========================================================================
    GM_xmlhttpRequest({ //post
      method: "POST",
      url: server_url,
      data: post_data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) {
        //console.log (response.responseText);
        console.log("get response");
        try {
          var ans = JSON.parse(response.responseText)["return"];
          console.log("ans = ");
          console.log(ans);
          var ans2 = "null";
          //====================================================================
          if (ans == "沒資源，請升級vip或手動輸入") {
            ans2 = "沒資源，請升級vip或手動輸入";
          } else if (ans.length == 3) { //vision有時候會失誤，就當盡量救。
            ans2 = "I" + ans;
          } else {
            ans2 = ans;
          }
          //====================================================================
          if (account) {
            input_account.value = account;
          }
          if (password) {
            input_password.value = password;
          }
        } catch (e) {
          console.log("error text:");
          console.log(e);
        }
        console.log("end print");
        input_verification.value = ans2;  //寫入
        var d02 = new Date();
          //console.log(d02);
          console.log("d02-d01");
          console.log(d02-d01);
        if (auto_login) {
          if (!(ans2 == "沒資源，請升級vip或手動輸入")) {
            login_button.click();
          }

        }
      }
    });
  } else if (String(location.href).search('eportal.lhu.edu.tw/login.do') > 1) {
    //這是如果有跳轉頁面的話才需要的，所以這裡就不模組化了。
    try {
      if (auto_next) { //自動"下一步"
        document.getElementsByTagName('a')[0].click();
      }
    } catch (e) {
      if (auto_check) { //自動點"確認"
        document.getElementsByTagName('button')[0].click();
      }
    }
  } else {
    console.log("唉呀呀...失手了030....");
  }
  //alert('030 end //');
})();
//=============================================================================
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
//=============================================================================
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}
//=============================================================================
