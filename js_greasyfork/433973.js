// ==UserScript==
// @name        阿里云盘自动登录
// @description Aliyun Drive auto Login
// @namespace   https://greasyfork.org/users/91873
// @icon        https://gw.alicdn.com/imgextra/i3/O1CN01aj9rdD1GS0E8io11t_!!6000000000620-73-tps-16-16.ico
// @match        https://www.aliyundrive.com/*
// @match        https://www.alipan.com/*
// @grant       none
// @version     1.0.43
// @author      wujixian
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/433973/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/433973/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(async () => {
  // 获取当前 URL
  var currentUrl = window.location.href;
  if (currentUrl.indexOf("alipan.com")>0) {
    // 替换 host
    var newHost = 'www.aliyundrive.com';
    var newUrl = currentUrl.replace(window.location.host, newHost);
    // 跳转到新 URL
    window.location.href = newUrl;
  }
  if(window.localStorage.token==null)
  {
    window.localStorage.clear();
    window.localStorage.setItem("token","{"
                                +"\"default_sbox_drive_id\":\"217908\","
                                +"\"role\":\"user\","
                                +"\"user_name\":\"177***918\","
                                +"\"need_link\":false,"
                                +"\"expire_time\":\"2024-04-27T15:07:30Z\","
                                +"\"pin_setup\":true,"
                                +"\"need_rp_verify\":false,"
                                +"\"avatar\":\"https://img.aliyundrive.com/avatar/e794901304a74aa3866ccb686f52cad4.jpeg\","
                                +"\"token_type\":\"Bearer\","
                                +"\"access_token\":\"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNzgwNWNjMTNhZTI0MDg3OWFkZTBkNjg5MTZmNDRiYyIsImN1c3RvbUpzb24iOiJ7XCJjbGllbnRJZFwiOlwiMjVkelgzdmJZcWt0Vnh5WFwiLFwiZG9tYWluSWRcIjpcImJqMjlcIixcInNjb3BlXCI6W1wiRFJJVkUuQUxMXCIsXCJTSEFSRS5BTExcIixcIkZJTEUuQUxMXCIsXCJVU0VSLkFMTFwiLFwiVklFVy5BTExcIixcIlNUT1JBR0UuQUxMXCIsXCJTVE9SQUdFRklMRS5MSVNUXCIsXCJCQVRDSFwiLFwiT0FVVEguQUxMXCIsXCJJTUFHRS5BTExcIixcIklOVklURS5BTExcIixcIkFDQ09VTlQuQUxMXCIsXCJTWU5DTUFQUElORy5MSVNUXCIsXCJTWU5DTUFQUElORy5ERUxFVEVcIl0sXCJyb2xlXCI6XCJ1c2VyXCIsXCJyZWZcIjpcImh0dHBzOi8vd3d3LmFsaXl1bmRyaXZlLmNvbS9cIixcImRldmljZV9pZFwiOlwiODlhNDg2ZmE0YjIyNDYxNmJhZmM5NWNkNDkwMjNiMWFcIn0iLCJleHAiOjE3MjE0NTgzODgsImlhdCI6MTcyMTQ1MTEyOH0.m0rbnluu4WuzNFkyTwOjs3QnSzqAQyC28e0-fYmSnW0hUIZYsnh5SEUOTaTjsi-XAjdXE_wBoBnbbgsh3PM9L85jM8U7hQQU6NeCPermjpQbCsFGt8NJu6-1e2qqKGWUjfHNd_9QhVZDSb48ierTuQVOm6nVo2qMAPnB2xPsXFE\","
                                +"\"default_drive_id\":\"217907\","
                                +"\"domain_id\":\"bj29\","
                                +"\"path_status\":\"enabled\","
                                +"\"refresh_token\":\"89a486fa4b224616bafc95cd49023b1a\","
                                +"\"is_first_login\":false,"
                                +"\"user_id\":\"37805cc13ae240879ade0d68916f44bc\","
                                +"\"nick_name\":\"svvip\","
                                +"\"exist_link\":[],"
                                +"\"state\":\"\","
                                +"\"expires_in\":7200,"
                                +"\"status\":\"enabled\""
                                +"}");
    location.reload();
  }
  var temp=0;
  setInterval(function () {
    if(document.querySelector("#dplayer > div.dplayer-menu.dplayer-menu-show")!=null)
    {
      document.querySelector("#dplayer > div.dplayer-menu.dplayer-menu-show").remove();
    }
    var mask=document.getElementsByClassName("ant-modal-mask");
    if(mask.length>0){
      for(var i=0;i<mask.length;i++){
        mask[i].remove();
      }
    }
    var wrap=document.getElementsByClassName("ant-modal-wrap");
    if(wrap.length>0){
      for(var i=0;i<wrap.length;i++){
        var a=wrap[i];
        if(a.outerText.indexOf("爱发电")>0){
          wrap[i].remove();
        }
      }
    }
  },3000);
    setInterval(function () {
    var time= document.getElementsByClassName("dplayer-ptime");
    if(time.length>0){
      var newTime=time[0].innerText;
      if(newTime==temp){
        var pressEvent = new KeyboardEvent("keydown", { key: " ", keyCode: 32, code: "Space", which: 32, charCode: 32 });
        var releaseEvent = new KeyboardEvent("keyup", { key: " ", keyCode: 32, code: "Space", which: 32, charCode: 32 });
        document.dispatchEvent(pressEvent);
        setTimeout(() => document.dispatchEvent(releaseEvent), 600);
      }
      temp=newTime;
    }
  },1500);
})();