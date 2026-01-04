// ==UserScript==
// @name         公众号自动新建群发
// @namespace    sco
// @version      0.5.7
// @description  hello world!
// @author       sco
// @match        https://mp.weixin.qq.com/cgi-bin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397469/%E5%85%AC%E4%BC%97%E5%8F%B7%E8%87%AA%E5%8A%A8%E6%96%B0%E5%BB%BA%E7%BE%A4%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/397469/%E5%85%AC%E4%BC%97%E5%8F%B7%E8%87%AA%E5%8A%A8%E6%96%B0%E5%BB%BA%E7%BE%A4%E5%8F%91.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var $ = $ || window.$, ii = 0, si = 0, source_url = "", is_source_url = false, article, sit_obj, ys_sty = "", type = -7; //type = -2Alinki使用，-3陆长青使用，-4派小星使用，-5Cherry Cola🍒使用
    ;!function(a){"use strict";var b=document,c="querySelectorAll",d="getElementsByClassName",e=function(a){return b[c](a)},f={type:0,shade:!0,shadeClose:!0,fixed:!0,anim:"scale"},g={extend:function(a){var b=JSON.parse(JSON.stringify(f));for(var c in a)b[c]=a[c];return b},timer:{},end:{}};g.touch=function(a,b){a.addEventListener("click",function(a){b.call(this,a)},!1)};var h=0,i=["layui-m-layer"],j=function(a){var b=this;b.config=g.extend(a),b.view()};j.prototype.view=function(){var a=this,c=a.config,f=b.createElement("div");a.id=f.id=i[0]+h,f.setAttribute("class",i[0]+" "+i[0]+(c.type||0)),f.setAttribute("index",h);var g=function(){var a="object"==typeof c.title;return c.title?'<h3 style="'+(a?c.title[1]:"")+'">'+(a?c.title[0]:c.title)+"</h3>":""}(),j=function(){"string"==typeof c.btn&&(c.btn=[c.btn]);var a,b=(c.btn||[]).length;return 0!==b&&c.btn?(a='<span yes type="1">'+c.btn[0]+"</span>",2===b&&(a='<span no type="0">'+c.btn[1]+"</span>"+a),'<div class="layui-m-layerbtn">'+a+"</div>"):""}();if(c.fixed||(c.top=c.hasOwnProperty("top")?c.top:100,c.style=c.style||"",c.style+=" top:"+(b.body.scrollTop+c.top)+"px"),2===c.type&&(c.content='<i></i><i class="layui-m-layerload"></i><i></i><p>'+(c.content||"")+"</p>"),c.skin&&(c.anim="up"),"msg"===c.skin&&(c.shade=!1),f.innerHTML=(c.shade?"<div "+("string"==typeof c.shade?'style="'+c.shade+'"':"")+' class="layui-m-layershade"></div>':"")+'<div class="layui-m-layermain" '+(c.fixed?"":'style="position:static;"')+'><div class="layui-m-layersection"><div class="layui-m-layerchild '+(c.skin?"layui-m-layer-"+c.skin+" ":"")+(c.className?c.className:"")+" "+(c.anim?"layui-m-anim-"+c.anim:"")+'" '+(c.style?'style="'+c.style+'"':"")+">"+g+'<div class="layui-m-layercont">'+c.content+"</div>"+j+"</div></div></div>",!c.type||2===c.type){var k=b[d](i[0]+c.type),l=k.length;l>=1&&layer.close(k[0].getAttribute("index"))}document.body.appendChild(f);var m=a.elem=e("#"+a.id)[0];c.success&&c.success(m),a.index=h++,a.action(c,m)},j.prototype.action=function(a,b){var c=this;a.time&&(g.timer[c.index]=setTimeout(function(){layer.close(c.index)},1e3*a.time));var e=function(){var b=this.getAttribute("type");0==b?(a.no&&a.no(),layer.close(c.index)):a.yes?a.yes(c.index):layer.close(c.index)};if(a.btn)for(var f=b[d]("layui-m-layerbtn")[0].children,h=f.length,i=0;h>i;i++)g.touch(f[i],e);if(a.shade&&a.shadeClose){var j=b[d]("layui-m-layershade")[0];g.touch(j,function(){layer.close(c.index,a.end)})}a.end&&(g.end[c.index]=a.end)},a.layer={v:"2.0",index:h,open:function(a){var b=new j(a||{});return b.index},close:function(a){var c=e("#"+i[0]+a)[0];c&&(c.innerHTML="",b.body.removeChild(c),clearTimeout(g.timer[a]),delete g.timer[a],"function"==typeof g.end[a]&&g.end[a](),delete g.end[a])},closeAll:function(){for(var a=b[d](i[0]),c=0,e=a.length;e>c;c++)layer.close(0|a[0].getAttribute("index"))}},"function"==typeof define?define(function(){return layer}):function(){var a=document.scripts,c=a[a.length-1],d=c.src,e=d.substring(0,d.lastIndexOf("/")+1);c.getAttribute("merge")||document.head.appendChild(function(){var a=b.createElement("link");return a.href="https://s.cschujian.com/layer_m/need/layer.css?2.0",a.type="text/css",a.rel="styleSheet",a.id="layermcss",a}())}()}(window);
    $(function(){
        var pathname = window.location.pathname + window.location.search;
        var asi = pathname.indexOf("masssendpage?t=mass/send&type=10");
        if(window.document.referrer.indexOf("appmsgid") > 0 && asi < 1){
            return;
        }else{
            if(asi > 0){
                setTimeout("$(\"#send_btn_main a[title='定时群发']\").click();", 2500);
                setTimeout(publishOnTime, 2800);
                return;
            }else if(pathname.indexOf("home?t=home/index") > 0){
                layer.open({
                    content: "<h3>是否要自动新建群发？</h3>",
                    btn: ["走着", "不要"],
                    yes: function(index){
                        layer.close(index);
                        var obj = $("a.xmt-create-btn-sc[href*='/cgi-bin/appmsg?t=media/appmsg_edit_v2']");
                        if(obj.attr("href")){
                            window.location.href = obj.attr("href");
                        }
                    }
                });
            }else if(pathname.indexOf("masssendpage?t=mass/send") > 0){
                setTimeout(massSend, 1500);
            }else if(pathname.indexOf("appmsg?t=media/appmsg_edit") > 0){
                setTimeout(getart, 2500);
            }
        }

        function getart(){
            if($("#js_article_url_area label").hasClass("disabled")){
                is_source_url = true;
            }
            $.post("https://s.cschujian.com/wx.php", {id: -2, type: type}, function(data){

                if(data.tomorrow){
                      var str = "<div class=\"layui-m-layerbtn2\">";
                str += "<span yes=\"\" type=\"1\" data-id=\"tomorrow\">18</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"after\">19</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"toafter\">20</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link5\">21</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link6\">22</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link7\">23</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link8\">24</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link9\">25</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link10\">26</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link11\">27</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link12\">28</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link13\">29</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link14\">30</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link15\">31</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link16\">1</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"link17\">2</span>";
                str += "<span no=\"\" type=\"1\" data-id=\"link18\">3</span></div>";

           layer.open({
                content: "<h3>选择文章源</h3>" + str,
                btn: ["今天"],
                yes: function(index, layero){
                          layer.close(index);
                            article = data.today;
                            for(var i = 0; i < data.today.length; i++){
                               // setTimeout(art, i * 3500);
                                if( i == 3){
                                    setTimeout(art, i * 3500);
                                }else{
                                    setTimeout(art, i * 1500);
                                }
                            }
                },
                success: function(elem){
                    $(".layui-m-layerbtn2 span").click(function(){
                        layer.closeAll();
                        var id = $(this).data("id");
                        console.log(data);
                          var i;
                        if(id=='tomorrow'){
                            article = data.tomorrow;

                            for(i = 0; i < data.tomorrow.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.tomorrow[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='after'){
                              article = data.after;
                            for(i = 0; i < data.after.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.after[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.after[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='toafter'){
                              article = data.toafter;
                            for(i = 0; i < data.toafter.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.toafter[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.toafter[i]);}, i * 1500);
                                }
                            }

                        }else if(id=='link5'){
                              article = data.link5;
                            for(i = 0; i < data.link5.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link5[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link5[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link6'){
                              article = data.link6;
                            for(i = 0; i < data.link6.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link6[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link6[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link7'){
                              article = data.link7;
                            for(i = 0; i < data.link7.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link7[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link7[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link8'){
                              article = data.link8;
                            for(i = 0; i < data.link8.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link8[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link8[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link9'){
                              article = data.link9;
                            for(i = 0; i < data.link9.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link9[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link9[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link10'){
                              article = data.link10;
                            for(i = 0; i < data.link10.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link10[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link10[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link11'){
                              article = data.link11;
                            for(i = 0; i < data.link11.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link11[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link11[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link12'){
                              article = data.link12;
                            for(i = 0; i < data.link12.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link12[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link12[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link13'){
                              article = data.link13;
                            for(i = 0; i < data.link13.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link13[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link13[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link14'){
                              article = data.link14;
                            for(i = 0; i < data.link14.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link14[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link14[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link15'){
                              article = data.link15;
                            for(i = 0; i < data.link15.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link15[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link15[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link16'){
                              article = data.link16;
                            for(i = 0; i < data.link16.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link16[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link16[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link17'){
                              article = data.link17;
                            for(i = 0; i < data.link17.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link17[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link17[i]);}, i * 1500);
                                }
                            }
                        }else if(id=='link18'){
                              article = data.link18;
                            for(i = 0; i < data.link18.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.link18[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.link18[i]);}, i * 1500);
                                }
                            }
                        }

                    });
                }
            });
           /*layer.open({
                        content:"<h3>选择文章源</h3>",
                       btn: ["今天", "明天"],
                        yes: function(index, layero){
                            layer.close(index);
                            article = data.today;
                            for(var i = 0; i < data.today.length; i++){
                               // setTimeout(art, i * 3500);
                                if( i == 3){
                                    setTimeout(art, i * 5500);
                                }else{
                                    setTimeout(art, i * 1500);
                                }
                            }
                        },
                        no: function(index, layero){
                            layer.close(index);
                            article = data.tomorrow;
                            for(var i = 0; i < data.tomorrow.length; i++){
                                //setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                if( i == 3){
                                    setTimeout(function(){art(data.tomorrow[i]);}, i * 3500);
                                }else{
                                     setTimeout(function(){art(data.tomorrow[i]);}, i * 1500);
                                }
                            }
                        }
                    });*/
                }else{
                    article = data.today;
                    for(var i = 0; i < data.today.length; i++){
                        setTimeout(art, i * 1500);
                    }
                }
            }, "json");
        }

        function art(){
            var article_url = "", article_arr = new Array();
            source_url = "";
            if(article[ii].indexOf("@") > 0){
                article_arr = article[ii].split("@");
                article_url = article_arr[0];
                if(is_source_url && article_arr[2]){
                    article_url = article_arr[2];
                }else{
                    source_url = article_arr[1];
                }
            }else{
                article_url = article[ii];
            }
            $("#J_collect").trigger("click");
            $("#article_link_input").val(article_url);
            $("#J_confirm button").trigger("click");
            setTimeout(checked, 500);
            ii++;
        }
        function checked(){
            $("#editor_pannel").find("input[name='need_open_comment']").trigger("click");
            if(!is_source_url && source_url){
                if(!is_source_url && source_url){
                    $("#editor_pannel").find("input[name='source_url_checked']").trigger("click");
                    $(".weui-desktop-form__input").val(source_url).change();
                    $(".popover_article_setting_large").find(".btn_primary").trigger("click");
                }
            }
            if(ii == article.length){
                setTimeout("$(\"#js_fold a\").click();", 500);
                setTimeout(dfclick, 1300);
            }
        }
          function dfclick(){
            $("#js_imagedialog").click();
            // $(".weui-desktop-dialog__ft").append("<button type=\"button\" id=\"auto_setimg\">自动换图</button>");// 添加自动换图标签
            var tag = "<button id=\"auto_setimg\" class=\"weui-desktop-btn weui-desktop-btn_primary\">自动换图</button>";
            //console.log( document.getElementsByClassName("weui-desktop-dialog__wrp"))
            //console.log( $(".weui-desktop-dialog__wrp") );
            //$(".weui-desktop-dialog__wrp").on("live",function(){
            //    this.append(tsg);
            //});
            //$("#auto_setimg").click( function(){
            //    $('.dialog_hd button').click();// 选择图片
            //    ii--;
            //    setTimeout(setImg, 800);
            //});

            setTimeout(function(){
                $(".weui-desktop-dialog__wrp").eq(3).find(".weui-desktop-dialog").find(".weui-desktop-dialog__ft").append(tag)

                $("#auto_setimg").click( function(){
                    console.log(2);
                    $('.weui-desktop-dialog__hd button').click();// 选择图片
                    ii--;
                    setTimeout(setImg, 800);
                });
            }, 800);
            //setTimeout("$(\".webuploader-container input[type='file']\").click();", 800);
        }
         function setImg(){
            $("#appmsgItem[data-msgindex='" + si + "']").click();// 选择文章
            setTimeout("$(\"#js_fold a\").click();", 300);// 回到顶部
            setTimeout("$(\"#js_imagedialog\").click();", 800);// 从图片库选择
            setTimeout("$(\".weui-desktop-img-picker__item\").eq(" + (ii) + ").click();", 1500);// 从图片库中选择图片
            setTimeout("$(\".js_crop_next_btn button\").click();", 2000);// 下一步
            setTimeout("$(\".weui-desktop-dialog__wrp\").eq(3).find(\".weui-desktop-dialog__ft button\").last().click()", 2000);// 下一步
            ys_sty=$("#appmsgItem[data-msgindex='" + si + "']").find(".js_appmsg_thumb").css("background-image");// 采集过来左边框的原始图片url
             console.log(ys_sty);
            sit_obj=setInterval(function(){
                if( $(".img_crop_img").length > 0){// 循环判断微信图片选择完成
                    clearInterval(sit_obj);
                    setTimeout(function(){
                        document.getElementsByClassName("weui-desktop-dialog__wrp")[3].lastChild.lastChild.getElementsByTagName("button")[2].click();// 完成
                       /// console.log($(".weui-desktop-dialog_img-picker-with-crop"));
                        //console.log( $(".weui-desktop-dialog__wrp").find(".weui-desktop-dialog__ft button").click() )// 完成
                        sit_obj=setInterval(function(){
                            var ys_sty2=$("#appmsgItem[data-msgindex='" + si + "']").find(".js_appmsg_thumb").css("background-image");// 更换图片后的url
                            console.log(ys_sty2);
                            if(ys_sty2!=ys_sty){
                                clearInterval(sit_obj);
                                ii--;
                                if(ii > -1){
                                    si++;
                                    setTimeout(setImg, 100);
                                }else{
                                    layer.open({
                                        content: "完成",
                                        skin: "msg",
                                        time: 1
                                    });
                                    setTimeout("$(\"#js_send button\").click()", 1500);// 发送
                                }
                            }
                        }, 100);
                    }, 500);
                }
            }, 100);
         }
        function massSend(){
            var obj = $("a.create-type__link[href*='/cgi-bin/appmsg?t=media/appmsg_edit&action=edit']");
            if(obj.attr("href")){
                window.location.href = obj.attr("href");
            }
        }
        function publishOnTime(){
            var str = "<div class=\"layui-m-layerbtn2\"><span yes=\"\" type=\"1\" data-id=\"18:05\">18:05</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"19:15\">19:15</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"19:18\">19:18</span>";
                str += "<span no=\"\" type=\"1\" data-id=\"19:50\">19:50</span></div><hr/><div class=\"layui-m-layerbtn2\">";
                str += "<span yes=\"\" type=\"1\" data-id=\"18:35\">18:35</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"18:45\">18:45</span>";
                str += "<span yes=\"\" type=\"1\" data-id=\"18:55\">18:55</span>";
                str += "<span no=\"\" type=\"1\" data-id=\"18:38\">18:38</span></div>";
            layer.open({
                content: "<h3>选择定时时间</h3>" + str,
                btn: ["就是现在"],
                yes: function(index, layero){
                    setTimeout("$(\".dialog_ft button[data-index=0]\").click();", 500);
                    layer.closeAll();
                },
                success: function(elem){
                    $(".layui-m-layerbtn2 span").click(function(){
                        var id = $(this).data("id");
                        var date = id.split(":");
                        $(".js_hours_dropdown .jsDropdownItem[data-value='" + date[0] + "']").click();
                        $(".js_min_dropdown .jsDropdownItem[data-value='" + date[1] + "']").click();
                        setTimeout("$(\".dialog_ft button[data-index=0]\").click();", 500);
                        layer.closeAll();
                    });
                }
            });
        }
    });
})();