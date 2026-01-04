// ==UserScript==
// @name         自动填写
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*.aimz.cn/*
// @match        http://www.94pe.com/*
// @match        http://xxx.52aan.cn/*
// @match        http://www.u0km.com/*
// @match        http://www.cxhhmy.com/*
// @match        http://www.1kaw.com/*
// @match        http://www.qunhaoduo.cn/*
// @match        http://mxii.cn/*
// @match        http://www.ucxada.cn/*
// @match        http://www.jieaods.cn/*
// @match        http://www.qqdsw.com/*
// @match        https://www.tkkkkk.com/*
// @match        http://ds.719ka.top/*
// @match        https://www.520zan.cn/*
// @match        http://www.5173ka.com/*
// @match        http://www.v6ds.com/*
// @match        http://www.chgg7.com/*
// @match        http://www.52daishua.com/*
// @match        http://www.g8qq.com/*
// @match        http://www.lnjiale.com/*
// @match        http://www.eo1.cn/*
// @match        http://xuniks.com/*
// @match        http://331km.cn/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396459/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/396459/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==
(function() {
//$(".widget").attr("style", "display:none")
var jishu = 0;
var geturl = document.domain;
    if(geturl =="xiaofan.aimz.cn"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
        document.getElementById('inputvalue2').value=geturl;
        document.getElementById('inputvalue3').value="好的";
        panduan();
        },1000);
    }else if (geturl == "www.94pe.com"){
        setInterval(function(){
        //$(".layui-layer-title").attr("style", "display:none")
        //$(".block-themed").attr("style", "display:none")
        //$(".block-link-hover3").attr("style", "display:none")
        document.getElementById("layui-layer-shade2").style.display = "none";
        document.getElementById("alert_frame").style.display = "none";
        document.getElementById("layui-layer2").style.display = "none";
        document.getElementById('inputvalue').value="875916537";
             panduan();
        },1000);
    }else if (geturl == "xxx.52aan.cn"){
        setInterval(function(){
        //document.getElementById("alert_frame").style.display = "none";
        //document.getElementById("layui-layer2").style.display = "none";
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.u0km.com"){
        setInterval(function(){
        //$(".layui-layer-title").attr("style", "display:none")
        document.getElementById('inputvalue').value="875916537";
           panduan();
        },1000);
    }else if (geturl == "www.cxhhmy.com"){
        setInterval(function(){
        //$(".panel-info").attr("style", "display:none")
        //document.getElementById("alert_frame").style.display = "none";
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.1kaw.com"){
        setInterval(function(){
        //$(".block-link-hover3").attr("style", "display:none")
        //$(".panel").attr("style", "display:none")
        //document.getElementById("alert_frame").style.display = "none";
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.qunhaoduo.cn"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "mxii.cn"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.ucxada.cn"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "331km.cn"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.jieaods.cn"){
        setInterval(function(){
        //$(".panel").attr("style", "display:none")
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.qqdsw.com"){
        setInterval(function(){
        //$(".block-link-hover3").attr("style", "display:none")
        //document.getElementById("alert_frame").style.display = "none";
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "ds.719ka.top"){
        setInterval(function(){
        // document.getElementById("alert_frame").style.display = "none";
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.520zan.cn"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            document.getElementById('inputvalue2').value=geturl;
            panduan();
        },1000);
    }else if (geturl == "www.5173ka.com"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);

    }else if (geturl == "www.v6ds.com"){
        setInterval(function(){
        //$(".block-link-hover3").attr("style", "display:none")
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.chgg7.com"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.52daishua.com"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.g8qq.com"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.lnjiale.com"){
        setInterval(function(){
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "www.eo1.cn"){
        setInterval(function(){
                        //屏蔽
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }else if (geturl == "xuniks.com"){
        setInterval(function(){
            //填写资料
        document.getElementById('inputvalue').value="875916537";
            panduan();
        },1000);
    }
  function panduan (){
           if(document.getElementById('inputvalue').value == "875916537"){
                if(jishu == 0){
                   var Submit1 = document.getElementById("submit_buy")
                   Submit1.click()
                   jishu = 1;
                }
            }
  }
})();