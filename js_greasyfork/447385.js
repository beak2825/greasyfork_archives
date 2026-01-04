// ==UserScript==
// @name         虎牙自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  huya auto Login
// @match       *://*.huya.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447385/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447385/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
   //获取当前所有cookie
  var strCookies = document.cookie;         
  if (strCookies.indexOf("hy_220956066")==-1) {  
    document.cookie = "udb_uid=1199611334304;domain=.huya.com;path=/;";
    document.cookie = "udb_passport=hy_220956066;domain=.huya.com;path=/;";
    document.cookie = "videoBitRate=0;domain=.huya.com;path=/;";
    document.cookie = "udb_version=1.0;domain=.huya.com;path=/;";
    document.cookie = "udb_deviceid=w_596090266680733696;domain=.huya.com;path=/;";
    document.cookie = "huya_ua=webh5&0.1.0&websocket;domain=www.huya.com;path=/;";
    document.cookie = "game_did=Beb4YV1t9EwZgwpuX4KJ6dKSiDljryQ2Ib0;domain=.huya.com;path=/;";
    document.cookie = "Hm_lpvt_51700b6c722f5bb4cf39906a596ea41f=1656855010;domain=.huya.com;path=/;";
    document.cookie = "huya_flash_rep_cnt=29;domain=.huya.com;path=/;";
    document.cookie = "username=hy_220956066;domain=.huya.com;path=/;";
    document.cookie = "h_unt=1656855006;domain=.huya.com;path=/;";
    document.cookie = "huya_web_rep_cnt=38;domain=.huya.com;path=/;";
    document.cookie = "yyuid=1199611334304;domain=.huya.com;path=/;";
    document.cookie = "__yasmid=0.549367034976058;domain=.huya.com;path=/;";
    document.cookie = "udb_passdata=3;domain=.huya.com;path=/;";
    document.cookie = "isInLiveRoom=true;domain=.huya.com;path=/;";
    document.cookie = "__yamid_new=C9E2CF3B08000001A0172599F55FCCF0;domain=.huya.com;path=/;";
    document.cookie = "__yamid_tt1=0.549367034976058;domain=.huya.com;path=/;";
    document.cookie = "__yaoldyyuid=1199611334304;domain=.huya.com;path=/;";
    document.cookie = "_yasids=__rootsid%3DC9E2CF3F8810000128E8F7001420183E;domain=.huya.com;path=/;";
    document.cookie = "alphaValue=0.80;domain=.huya.com;path=/;";
    document.cookie = "guid=0a43a33ad299c162a0011f1a201a4177;domain=.huya.com;path=/;";
    document.cookie = "Hm_lvt_51700b6c722f5bb4cf39906a596ea41f=1656854990;domain=.huya.com;path=/;";
    document.cookie = "rep_cnt=14;domain=.huya.com;path=/;";
    document.cookie = "SoundValue=1.00;domain=.huya.com;path=/;";
    document.cookie = "udb_accdata=hy_220956066;domain=.huya.com;path=/;";
    document.cookie = "udb_anouid=1464414659954;domain=.huya.com;path=/;";
    document.cookie = "udb_biztoken=AQAHPUq5flhBD4n1zwsi76uMeyH_xMqgoLc4Priuc8anLIRbYL3e8-5QdLN3e0W6YunxiEewZjxFn1MWSSJnAyyIST-UN-bzdCw9mE7C8mxSDN-cqnG-lWfFPjYLSnsDu0fc1sTrbE4gruh4-926hWDmF4j1UM5tmB5KoegJAuyMqAqdexMdjHH_PNy-kst5Hud7GJKXYXnQW4-3PWdQQbFwsrrmrkFzgJ34vs4NDxdCvXp4ulNtucQZjha09uRnNlbgg9f94YYvyvXoDLNbyY6ctHK7Dilaeflen-YQ73PI8hc4Y5r13JGwnAjIaQ5bjogeojNB_7VR80TCXTWjkO_G;domain=.huya.com;path=/;";
    document.cookie = "udb_cred=CnBRwNJ-KjCqHgZwIMSq_VGh7F1mgPmU0FZywwVCpm8ZpicpL-K-EIWSxIr-T6Y16ZBJ5WEtWi8g6z5Ecfict1-GTYxGek1X72TM75Jzp0rKRlIzB-kxd6C2iFJrxKMpGsE;domain=.huya.com;path=/;";
    document.cookie = "udb_guiddata=d9e2e075eeae4a46b36b31972f23501e;domain=.huya.com;path=/;";
    document.cookie = "udb_origin=1;domain=.huya.com;path=/;";
    document.cookie = "udb_other=%7B%22lt%22%3A%221656855005588%22%2C%22isRem%22%3A%221%22%7D;domain=.huya.com;path=/;";
    document.cookie = "udb_status=1;domain=.huya.com;path=/;"; 
    location.reload();
  }        
}) ();