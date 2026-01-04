// ==UserScript==
// @name         斗鱼自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  douyu auto Login
// @match       *://*.douyu.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447387/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447387/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
   //获取当前所有cookie
  var strCookies = document.cookie;         
  if (strCookies.indexOf("7027968578")==-1) {  
    document.cookie = "acf_phonestatus=1;domain=www.douyu.com;path=/;";
    document.cookie = "Hm_lvt_e99aee90ec1b2106afe7ec3b199020a7=1656856476;domain=.douyu.com;path=/;";
    document.cookie = "PHPSESSID=o0v5aa80m9s1qmsutlug3po610;domain=www.douyu.com;path=/;";
    document.cookie = "acf_nickname=%E7%94%A8%E6%88%B77027968578;domain=www.douyu.com;path=/;";
    document.cookie = "acf_uid=455811422;domain=www.douyu.com;path=/;";
    document.cookie = "acf_did=2e9d9b71be1976d694df168600081601;domain=www.douyu.com;path=/;";
    document.cookie = "acf_isNewUser=1;domain=www.douyu.com;path=/;";
    document.cookie = "acf_ct=0;domain=www.douyu.com;path=/;";
    document.cookie = "acf_auth=7044O5bnTfnSqVR2qvcdwh7ruvM9nazhmtMgS9pYAiXalNc%2F5RRyYSAwEG8%2BWCOtPqNuq8R8EjMSdjw1cLK%2BQWF2AeLwyn9eiDtVAJbPVqcTTdqNr%2B1Gqlg;domain=www.douyu.com;path=/;";
    document.cookie = "acf_avatar=https%3A%2F%2Fapic.douyucdn.cn%2Fupload%2Favatar%2Fdefault%2F24_;domain=www.douyu.com;path=/;";
    document.cookie = "acf_biz=1;domain=www.douyu.com;path=/;";
    document.cookie = "acf_groupid=1;domain=www.douyu.com;path=/;";
    document.cookie = "acf_ltkid=29246879;domain=www.douyu.com;path=/;";
    document.cookie = "acf_own_room=0;domain=www.douyu.com;path=/;";
    document.cookie = "acf_stk=722064cff99a7da2;domain=www.douyu.com;path=/;";
    document.cookie = "acf_username=455811422;domain=www.douyu.com;path=/;";
    document.cookie = "dy_auth=a494Une9eAVdWLcwb5jKYp1wbQL2Q3dY0%2B4k%2FDYTvzVcULFB8lCyAb93wQ8eCzejc5pJyDy8AsKH8DDMp4I20r4yEwlVEzezoLawFPOmh6GELyAAAQDBR2w;domain=.douyu.com;path=/;";
    document.cookie = "dy_did=2e9d9b71be1976d694df168600081601;domain=.douyu.com;path=/;";
    document.cookie = "Hm_lpvt_e99aee90ec1b2106afe7ec3b199020a7=1656856504;domain=.douyu.com;path=/;";
    document.cookie = "wan_auth37wan=e44898dc05d0cERXGh8kN5ATBxwIHSMVvluhfPzIh82NFzkAPF1ZgK18iqfx03BT3nTDtDdrRr%2FaPxljl%2BJDCRilx0tPrPqWSexxS%2FXq4q4le%2BsAu84;domain=.douyu.com;path=/;";
    location.reload();
  }        
}) ();