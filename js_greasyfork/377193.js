// ==UserScript==
// @name         无心vip视频免费看
// @namespace    https://www.luckyblank.cn
// @version      20.20.12.05
// @description  【移除知乎弹窗】【增加1905网站支持】【增加公众号 无心VIP影视】全网最新题库，支持图片题，永久免费！AND 除去其他不必要的功能，专注于VIP影视解析。因为只做vip解析，所以更专业。调整为8条解析线路，更加方便快捷的观看vip影视。
// @author       我本无心
// @icon         http://www.luckyblank.cn/jiaoben/favorite.ico
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/anime/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://vip.1905.com/play/*
// @match        *://www.zhihu.com/question/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.staticfile.org/jsencrypt/2.3.1/jsencrypt.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/377193/%E6%97%A0%E5%BF%83vip%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/377193/%E6%97%A0%E5%BF%83vip%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function() {

    //FUN_1
   if(location.href.match(".iqiyi.com") || location.href.match(".youku.com")|| location.href.match(".le.com")|| location.href.match(".letv.com")|| location.href.match("v.qq.com") || location.href.match(".tudou.com")|| location.href.match(".mgtv.com")|| location.href.match("film.sohu.com")|| location.href.match("tv.sohu.com")|| location.href.match(".acfun.cn")|| location.href.match(".bilibili.com")|| location.href.match(".pptv.com")|| location.href.match("vip.1905.com")|| location.href.match(".yinyuetai.com")|| location.href.match(".fun.tv")|| location.href.match(".56.com") || location.href.match(".wasu.cn")) {
       /*变量初始及方法封装*/
       $("head").append($('<link rel="stylesheet" href="https://www.luckyblank.cn/tools/layer/layer-v3.1.1/layer/theme/default/layer.css">'));
       var qq0 = '<span style="display:block;float:left;width:3vw;height:3vw;font-size:2.5vw;color:#fff;line-height:3vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:1vw 1vw;">及</span>'
       var qq1 = '<span style="display:block;float:left;width:3vw;height:3vw;font-size:2.5vw;color:#fff;line-height:3vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:1vw 1vw;">时</span>'
       var qq2 = '<span style="display:block;float:left;width:3vw;height:3vw;font-size:2.5vw;color:#fff;line-height:3vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:1vw 1vw;">反</span>'
       var qq3 = '<span style="display:block;float:left;width:3vw;height:3vw;font-size:2.5vw;color:#fff;line-height:3vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:1vw 1vw;">馈</span>'
       function getAll(){var vips;$.ajax({url:"//www.luckyblank.cn:8443/vipaddress/getaddress",type:"GET",async:false,success:function(data){vips=data}});/*console.log("vips:"+vips);*/return vips};
       var arr=getAll();
       var apis = [{
               name:qq0 + "网站解析0",url:"https://www.luckyblank.cn/jiaoben/vipvideos/index.html?link=",title:"接口0"
           },
           {
               name:qq1 + "插件下载0",url:"https://lanzous.com/b0e6zvlc?link=",title:"插件下载"
           },
           {
               name:qq2 + "解析接口1",url:arr[1],title:"接口1"
           },{
               name:qq3 + "解析接口2",url:arr[2],title:"接口2"
           }
       ];

       //创建选项
       function createSelect (apis) {
           var myul = document.createElement("ul");
           myul.id = "myul";
           myul.setAttribute("style","overflow: hidden;display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;position:fixed;bottom:33vh;right:8vw;z-index:99999;height:300px;border-radius:1.26vw;transition: all 1s cubic-bezier(0, 0.82, 0.46, 1.04) 0s;");
           for (var i = 0; i < apis.length; i ++) {
               var myli = document.createElement("li");
               var that=this;
               myli.setAttribute("style","cursor: pointer;margin:0;padding:0;display:block;list-style:none;font-size:2vw;width:15vw;text-align:left;line-height:5vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;");
               (function (num) {
                   myli.onclick = function () {
                       window.open(apis[num].url + location.href,'_blank');
                   };
                   myli.ontouchstart = function () {
                       this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";
                   }
                   myli.ontouchend = function () {
                       this.style.cssText += "color:black;background:transparent;border-radius:0;";
                   }
               })(i);
               myli.innerHTML = apis[i].name;
               myul.appendChild(myli);
           }
           document.body.appendChild(myul);
       }

       //创建菜单
       function createMenu(){
           var myBtn = document.createElement("div");
           myBtn.id = "myBtn";
           myBtn.innerHTML = "+";
           myBtn.setAttribute("title","我可以拖动啦");
           myBtn.setAttribute("style","cursor: move;width:5vw;height:5vw;position:fixed;bottom:30vh;right:1vw;z-index:100000;border-radius:100%;text-align:center;line-height:5vw;box-shadow:0px 1px 10px rgba(0,0,0,0.3);font-size:3vw;background:rgb(228, 8, 8);");

           document.body.appendChild(myBtn);
       }
    //绑定元素拖动
    function bindGrabble(){
        var mX = 0,
            mY = 0; //定义鼠标X轴Y轴
        var dX = 0,
            dY = 0; //定义div左、上位置
                  $('#myBtn').on('mousedown', function(e) { //鼠标按下
            // 判断一下这个按下是点击还是拖动
            var isClick = true;
                      var event = event || window.event;
            mX = event.clientX;
            mY = event.clientY;
            dX = $(this).offset().left;
            dY = $(this).offset().top;
			
            $(document).on('mousemove', (e) => {//鼠标移动
                 var event = event || window.event;
                var x = event.clientX; //鼠标滑动时的X轴
                var y = event.clientY; //鼠标滑动时的Y轴

                var top = suan(y - mY + dY, 0, $(document).innerHeight() - $(this).height()) //调用封装的方法
                var left = suan(x - mX + dX, 0, $(document).innerWidth() - $(this).width()) //调用封装的方法
                $(this).css({ //给盒子设置坐标
                    left,
                    top
                })
                //拖动后，把isClick设为false，后面就不会执行点击事件
                isClick = false;
                e.preventDefault();
            })
            $(document).on('mouseup', (e) => {//鼠标抬起
                //当isClick为true时，就执行点击事件
                if( isClick ){
                    var myul = document.getElementById("myul");
                    if(myul.style.display == "none"){
                        myul.style.display = "block";
                       this.style.transform="rotateZ(45deg)";
                        //设置与按钮的相对位置left-250，top-300

                        myul.style.right = 'auto';
                         myul.style.bottom = 'auto';
                         var left_1 = $('#myBtn').offset().left - 250;
                        if(left_1 <0){
                            //按钮位置移动
                         this.style.left= $('#myBtn').offset().left - left_1 +'px';
                        myul.style.left = 0 +'px';

                        }else{
                         myul.style.left = $('#myBtn').offset().left - 250 +'px';
                        }

                      var top_1 = $('#myBtn').offset().top - 300;
                         if(top_1 <0){
                            //按钮位置移动
                         this.style.top= $('#myBtn').offset().top - top_1 +'px';
                        myul.style.top = 0 +'px';

                        }else{
                         myul.style.top = $('#myBtn').offset().top - 300 +'px';
                        }

                    }else{
                        myul.style.display = "none";
                        this.style.transform="rotateZ(0deg)";
                    }
                }else{//拖动修正myul位置
                    var myul2 = document.getElementById("myul");
                     var mybuttom = document.getElementById("myBtn");
                    if(myul2.style.display == "block"){

                        myul2.style.right = 'auto';
                        myul2.style.bottom = 'auto';
                          var left_2 = $('#myBtn').offset().left - 250;
                        if(left_2 <0){
                            //按钮位置移动
                         mybuttom.style.left= $('#myBtn').offset().left - left_2 +'px';
                        myul2.style.left = 0 +'px';

                        }else{
                         myul2.style.left = $('#myBtn').offset().left - 250 +'px';
                        }

                      var top_2 = $('#myBtn').offset().top - 300;
                         if(top_2 <0){
                            //按钮位置移动
                         mybuttom.style.top= $('#myBtn').offset().top - top_2 +'px';
                        myul2.style.top = 0 +'px';

                        }else{
                         myul2.style.top = $('#myBtn').offset().top - 300 +'px';
                        }
                    }

                }
                $(document).off('mousemove mouseup')//移除鼠标移动、鼠标抬起事件
            })
        })

    }
    //防止拖出边界
            function suan(o, min, max) { //重复封装
            o < min ? o = min : o > max ? o = max : ''//限制出界
            return o
        }


//是否发送公告yes = true则执行
  function sentNotic(yes) {
      if(yes){
      //判断用户是否是第一次使用
       if($.cookie('isFirstTime') == undefined ){
       console.log("first......");

           var method_own ={
    notice: function(){
      //示范一个公告层
      layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: '350px;'
        ,shade: 0.8
        ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
        ,btn: ['火速围观', '残忍拒绝']
        ,btnAlign: 'c'
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div class="notice-wechat" style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;"><img class="qrcode-wechat" src="https://www.luckyblank.cn/img/wechat/gzh.jpg"><br><br>你知道吗？亲！无心影视出公众号啦~<br></div>'
        ,success: function(layero){
            //修正弹出层位置
            layero.css({"top":""})
          var btn = layero.find('.layui-layer-btn');
          btn.find('.layui-layer-btn0').attr({
            href: 'https://mp.weixin.qq.com/s/qPGdcfvT4_UHAS_JzU7Exg'
            ,target: '_blank'
          });
        }
      });
    }
}
           method_own.notice();

           $.cookie('isFirstTime', '1', { expires: 1, path: '/' });
       } else{
           console.log('not the first....')
           //设置cookie为1天
           //var flag =    $.removeCookie('isFirstTime', { path: '/' }); // => true
           //console.log(flag)

       }


      }
  }


       /*最终执行*/
		createMenu();
		createSelect(apis);
        bindGrabble();
       // sentNotic(true);
       //直接退出
       return false;

}

   //FUN_2
    //超星网课助手

//FUN_3
//TO-DO....
    if(location.href.match(".zhihu.com")){
 console.log("FUN_3 HAS RUNNING....")
        var style_wrapper = $("<style></style>");
    style_wrapper.append("html{overflow:auto !important } .Modal-wrapper{ display:none!important;}")
     $("head").append(style_wrapper);
     //直接退出
 return false;

    }

})();
