// ==UserScript==
// @name        哔嘀影视快捷键
// @namespace   Violentmonkey Scripts
// @match       https://www.bdys01.com/*
// @include     *://bdys.*
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant       none
// @version     2.1.2
// @author      zeroscc
// @description f键全屏 m键静音 ，上一集 。下一集 视频左右两侧上下集按钮
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458962/%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/458962/%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
      var url = window.location.href;
    $(document).on("dblclick", ".dplayer-video-current", function() {
        $(".dplayer-full-icon").click();
    });
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".ayx{display:none;}#ad-index{display:none;}";
    document.body.appendChild(css);

    $(document).keydown(function(event){
        if(event.keyCode==70){
            $(".dplayer-full-icon").click();
        }
        if(event.keyCode==77){
            $(".dplayer-volume-icon").click();
        }
        if(event.keyCode==190){
            next()
        }
        if(event.keyCode==188){
            prev()
        }
    });
  var timer = setInterval(function(){
    if(document.getElementById("count-down")){
        clearInterval(timer);
        var _0x = window.setInterval;
        window.setInterval = function(a, b) {
            if (b == 1000) {
                b = 0.01;
            }
            _0x(a, b);
        };
     setTimeout(function(){
         $("#count-down").click();
     },250);
    }
}, 100);

    window.onload =function(){
    $("#video").before("<div id='prev' style='position:absolute;top:50%;left:-100px;width:50px;height:50px;background-color:rgba(0,0,0,0.5);border-radius:50%;cursor:pointer;font-size:22px;color:#fff;line-height:50px;text-align:center;z-index:1000;'><</div>");
    $("#prev").click(function(){
        prev();
    });
    $("#video").after("<div id='next' style='position:absolute;top:50%;right:-100px;width:50px;height:50px;background-color:rgba(0,0,0,0.5);border-radius:50%;cursor:pointer;font-size:22px;color:#fff;line-height:50px;text-align:center;z-index:1000;'>></div>");
    $("#next").click(function(){
        next();
    });

    };

    var btns = $(".btn-group")[0].children;
  function next(){
    for(var i = 0; i < btns.length; i++){
    if(url.indexOf(btns[i].href) != -1){
        if(btns[i+1] !== undefined)
        {
              var reg = /-(.*?).htm/;
              var str = url.match(reg);
              var num = parseInt(str[1]);
              num = num + 1;
              var str1 = num.toString();
              var url1 = url.replace(reg, "-" + str1 + ".htm");
              window.open(url1, "_self");
        }else
          {
            var div = document.createElement("div");
            div.innerHTML = "没有下一集了";
            div.style.cssText = "width:200px;height:50px;background-color:#000;color:#fff;text-align:center;line-height:50px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:20px;border-radius:10px;";
            document.body.appendChild(div);
            setTimeout(function(){
                document.body.removeChild(div);
            },2000);
          }
    }
}

}
  function prev(){
    for(var i = 0; i < btns.length; i++){
      if(url.indexOf(btns[i].href) != -1)
      {
          if(btns[i-1] !== undefined)
          {
                  var reg = /-(.*?).htm/;
                  var str = url.match(reg);
                  var num = parseInt(str[1]);
                  num = num - 1;
                  var str1 = num.toString();
                  var url1 = url.replace(reg, "-" + str1 + ".htm");
                  window.open(url1, "_self");
          }else
            {
              var div = document.createElement("div");
              div.innerHTML = "没有上一集了";
              div.style.cssText = "width:200px;height:50px;background-color:#000;color:#fff;text-align:center;line-height:50px;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:20px;border-radius:10px;";
              document.body.appendChild(div);
              setTimeout(function(){
                  document.body.removeChild(div);
              },2000);
            }
      }
  }

  }

})();