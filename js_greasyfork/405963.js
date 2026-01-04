// ==UserScript==
// @name         GitHub自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.15
// @description  GitHub auto Login
// @include      https://*.github.com/*
// @include      https://github.com/*
// @author       wujixian
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405963/GitHub%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/405963/GitHub%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {      
    var strCookies = document.cookie;  
    if(strCookies.indexOf("bFRWP5Lgk_yBAHEr1JXI3pxIAJIACJ_40NMeEVX8R_dKqnw9")<0){
      document.cookie="__Host-user_session_same_site=bFRWP5Lgk_yBAHEr1JXI3pxIAJIACJ_40NMeEVX8R_dKqnw9;domain=github.com;path=/;";
      document.cookie="dotcom_user=HChenPan;domain=.github.com;path=/;";
      document.cookie="has_recent_activity=1;domain=github.com;path=/;";
      document.cookie="_device_id=34babebf46c34ea081bd57c30afe1bfc;domain=github.com;path=/;";
      document.cookie="_gh_sess=s8Yxk%2ByS41ZC7wB1dt7qeSzOw1khCkVXdV9sbjP2G8D%2FEAtS1tt181u0du8kzJzEAh1SLIugDKX2HPzhA8PSyUX73uyZFrl5%2Bz9pA0P2qYOUzADO2YYZBlODFQYzEaCF5Xg4momee0VDJEVWTIoitXJIeCtls2TPnPnpOiMeTClsGDjREloiN6kBj3JmsWKOrZL2ztwE4z0rv40jDEmHZXRMs0P%2FjEJbM9s4teJc1WzbxgN7R6rjTpMR7gBwz5IhmAGT96b3ZWf9alBEs7gp0gMvMKrJ%2B0I66LXoXRACvZSzMlt%2BQTT5m6chNWGlYKhbxYQ7%2BLPWMHphGPfpZhZEdAaCjx6ZvNfb3Dw94LmoTh3NqiayUSmg6sF3tUmScwzQYaAiBMTiHMm43gEk4W3%2BcYjdR2x5ojVlf8K4B%2Bz%2B%2B0r9Fxz3MPg%2F9MbYXVoRUE3MCIiVY4MIvuAcy%2FkKvzgugYE61AcIWurGo4YiPCqpuF9xS8S0HbTMdkiE0MOJOR7SdY6NSLDnG6sAtesKSOga7YyZCquBkmt8bnAqUZ9G8sPJ%2BmBPYEEvFhwc6U0g8jA0HS4oIOtQRqDVIEwPmk86CcqHmJON%2BIEceAu2RsE1PWbUmUzMmZsnKBuUSM5VprMaWTlZESUPNVq1MOKd1m%2Fcs1Jmd3vswRjBC7EirG7QHp1sqaLiPkreUcwnwiVqjRZu2oHZt5aNbHgVqtlT53YfjG80iDjjETSd3XaVo1FEQ8SMzCfIwR%2BVbIKrDCpOb8Ssm%2Fyh4BTW0Tz3KZ6Chs2vwaF6arGL4MPQt7gMXGS0F5wxtmOiOJy%2B5jolPHJJeJBIh1NswvmThM8qaYS1k4HH3PHxQucleekLhNxI7q%2FIMArqFP5j3ERl130s8R4q68eo--YC%2BJ4lSOWmgf1or3--qVS3K9dVk9Sa7KGjJmdbWQ%3D%3D;domain=github.com;path=/;";
      document.cookie="_octo=GH1.1.1893063229.1671381643;domain=.github.com;path=/;";
      document.cookie="color_mode=%7B%22color_mode%22%3A%22light%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D;domain=.github.com;path=/;";
      document.cookie="logged_in=yes;domain=.github.com;path=/;";
      document.cookie="tz=Asia%2FShanghai;domain=.github.com;path=/;";
      document.cookie="tz=Asia%2FShanghai;domain=github.com;path=/;";
      document.cookie="user_session=bFRWP5Lgk_yBAHEr1JXI3pxIAJIACJ_40NMeEVX8R_dKqnw9;domain=github.com;path=/;";
      location.reload();   
    }      
}) ();