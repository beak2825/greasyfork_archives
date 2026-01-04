// ==UserScript==
// @name         預覽網頁(改) (preview web page)
// @namespace
// @version      4.20
// @description  可選擇停在連結上或按SHIFT鍵或按住滑鼠左鍵彈出預覽框,預設是用滑鼠左鍵
// @description  https://greasyfork.org/zh-CN/scripts/409897-%E9%A0%90%E8%A6%BD%E7%B6%B2%E9%A0%81-%E6%94%B9-preview-web-page
// @author       kater4343587
// @include      http://*
// @include      https://*
// @exclude      http*://mybidu.ruten.com.*/*
// @exclude      http*://*.bid.yahoo.com/myauc*
// @exclude      http*://*.bid.yahoo.com/partner/*
// @exclude      https://*.bid.yahoo.com/chat/*
// @exclude      http*://seller.shopee.*/*
// @exclude      http*://shopee.*/user/*
// @exclude      http*://*imgur.com/*
// @exclude      http*://*weibo.com/*
// @exclude      http*://www.3dmgame.com/*
// @exclude      http*://*bank.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://cdn.jsdelivr.net/gh/machsix/gm4-polyfill@3ac89770e4dcb69123c749a71f101fb462eaada8/gm4-polyfill-mach6-legacy.js
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace
// @license MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/409897/%E9%A0%90%E8%A6%BD%E7%B6%B2%E9%A0%81%28%E6%94%B9%29%20%28preview%20web%20page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/409897/%E9%A0%90%E8%A6%BD%E7%B6%B2%E9%A0%81%28%E6%94%B9%29%20%28preview%20web%20page%29.meta.js
// ==/UserScript==

var div = $("<div id='preview-a'></div>"),
    iframe=$("<iframe id='prelink' src='' allowfullscreen frameborder='0'></iframe>"),
    parentDiv = div.append(iframe),
    //不允許外部嵌入的網站填在kurl裡面可以排除掉彈窗
    kurl = [/hostpic.org/,/imgbox.com/,/github.com/,/imgur.com/,/mega.nz/,/instagram.com/,/imdb.com/,/ibb.co/,/pan./,/lanzoul.com/,
           /udn.com/,/ettoday.net/,/twitter.com/,/sm.ms/,/t.me/,/gofile.io/,/1fichier.com/,/ouo.io/,/bit.ly/,/v_nextstage\/id_/,
           /189.cn/,/facebook.com/,/twsextop.com/,/weibo.com/,/imgbb.com/],
    surl = [ //網址替換,使其可嵌入
        {
            name: "bilibili",
            curl: /bilibili.com/,
            vID: /BV[^\?&\/]+/, //正則表達式
            reurl: "https://player.bilibili.com/player.html?bvid=(_vID_)&high_quality=1&autoplay=1" //替換的網址
        },
        {
            name: "youtube",
            curl: /youtube.com/,
            vID: /(?<=(watch\?v=))[^&\/]+/,
            reurl: "https://www.youtube.com/embed/(_vID_)?autoplay=1"
        },
        {
            name: "youtube2",
            curl: /youtu.be/,
            vID: /(?<=(\.be\/))[^&\/]+/,
            reurl: "https://www.youtube.com/embed/(_vID_)?autoplay=1"
        },
        {
            name: "tiktok",
            curl: /tiktok.com/,
            vID: /(?<=(video\/))[^&\/]+/,
            reurl: "https://www.tiktok.com/embed/(_vID_)"
        },
        {
            name: "抖音", //live直播的不可嵌
            curl: /www.douyin.com/,
            vID: /(?<=(video\/))[^&\/]+/,
            reurl: "https://www.iesdouyin.com/share/video/(_vID_)"
        }, //https://open.douyin.com/player/video?vid=(_vID_)
        {
            name: "優酷", //能跳過廣告
            curl: /v.youku.com/,
            vID: /(?<=(v_show\/id_))[^&\/=]+/,
            reurl: "https://player.youku.com/embed/(_vID_)?autoplay=1"
        }
    ],
    klen = kurl.length,
    slen = surl.length,
    timer;

$(document).ready(function(){
    var div = document.createElement("div");
        div.innerHTML = "▞";
        div.setAttribute("class","pw_setting");
        var css = "position:fixed;top:10px;right:10px;z-index:999999999;width:5px;height:5px;line-height:1px;text-align:center;font-size:16px;font-family:Verdana, Arial, '楷体';font-weight:500;color:green;user-select:none;padding:0px;white-space:nowrap;border-radius:3px;border:0px solid red;cursor:pointer;";
        div.style.cssText = css;
        if(window.self === window.top){ document.body.appendChild(div);}
    set_GM_();

//取得網址處理
    $(document).on("mouseover", "a:not([onclick*='javascript'],[href*='mpv://'],[href*='=against'],[href*='=support'],[href*='ac=favorite'],[href*='action=recommend'],[href*='action-download'],[href*='attach'],[href='#'],[href*='javascript'],[href*='.json'],[href*='.patch'],[href*='.bat'],[href*='.dll'],[href*='.cia'],[href*='.cci'],[href*='.3ds'],[href*='.ws'],[href*='.sfc'],[href*='.PBP'],[href*='.pbp'],[href*='.pce'],[href*='.ngp'],[href*='.sms'],[href*='.iso'],[href*='.bin'],[href*='.nes'],[href*='.gb'],[href*='.gba'],[href*='.cfg'],[href*='.VPK'],[href*='.vpk'],[href*='.mka'],[href*='.rmvb'],[href*='.m3u'],[href*='.m3u8'],[href*='.apk'],[href*='mailto:'],[href*='.JPG'],[href*='.mkv'],[href*='.mpa'],[href*='.mp4'],[href*='.srt'],[href*='.ass'],[href*='.pkg'],[href*='.nsz'],[href*='.nsp'],[href*='.xci'],[href*='.ini'],[href*='.pdf'],[href*='.doc'],[href*='.txt'],[href*='.flv'],[href*='.mp3'],[href*='.js'],[href*='.exe'],[href*='.AppImage'],[href*='.rar'],[href*='.7z'],[href*='.zip'],[href*='.torrent'],[href*='magnet:'],[href*='.sub'],[href*='.dmg'],[href*='.deb'])", function (event) {
        if((event.shiftKey && GM_config.get("preview_auto") == "自動") || (GM_config.get("preview_auto") == "按住滑鼠左鍵"))
        {
            return;
        }
        var target=$(this).attr("href");
        if(target!=undefined){
        //無法嵌入的網站排除
            if (klen > 0) {
                for (let j = 0; j < klen; j++) {
                    var kr = kurl[j];
                    if (kr.test(target)) {
                        return;
                    }
                }
            }


            //針對不能嵌入的網站做替換網址處理

            if (slen > 0) {
                for (let i = 0; i < slen; i++) {
                    var ur = surl[i];
                    if (ur.curl.test(target)) {
                        var urid = ur.vID.exec(target);
                        if (!!urid) {
                            target = ur.reurl.replace("(_vID_)", urid[0]);
                            break;
                        }
                    }
                }
            }
                //嵌入網頁
                if (GM_config.get("preview_auto") == "自動"){
                    if($("#prelink", parent.document).length == 0)
                {
                    //自動模式防止彈出第二個預覽頁
                    $('body').append(parentDiv);
                }
                }
                else{
                    $('body').append(parentDiv);
                }
                sty();

                $('#prelink').attr('src',target);

                setlocal()
            

            timer = setTimeout(function(){
                if(!event.shiftKey && (GM_config.get("preview_auto") == "自動"))
                {
                    $("#preview-a").show();
                    resetoPostion()
                    if (GM_config.get("preview_center") == "是") {
                        $("#preview-a").center();
                    }
                }
            },GM_config.get('preview_speed'))

               $("#preview-a").mouseout(function(event)
               {
                   if(GM_config.get("preview_hide") == "點擊框外" || isFullScreen()) {return;}
                   if(event.shiftKey) {return;}
                    $("#preview-a").remove();
                    clearTimeout(timer);
               }

        )
            cleaniframeelm();
        }}
        )}
)

$(document).keydown(function(event){
    if(event.which == 16 && (GM_config.get("preview_auto") == "按住SHIFT鍵"))
    {
        clearTimeout(timer);
        $("#preview-a").show();
        resetoPostion()
        if (GM_config.get("preview_center") == "是") {
                     $("#preview-a").center();
        clearTimeout(timer);
        }
    }
})

$(document).on("mousedown", "a", function (event) {
    if((event.which == 1 && GM_config.get("preview_auto") == "按住滑鼠左鍵"))
    {
        //因為跟其他模式的取得網址是獨立系統,所以要再做一遍
        var target2 = $(this).attr("href");
        if(target2!=undefined){
            //針對不能嵌入的網站做替換網址處理
            if (slen > 0) {
                for (let i = 0; i < slen; i++) {
                    var ur = surl[i];
                    if (ur.curl.test(target2)) {
                        var urid = ur.vID.exec(target2);
                        if (!!urid) {
                            target2 = ur.reurl.replace("(_vID_)", urid[0]);
                            break;
                        }
                    }
                }
            }

            //嵌入網頁
                $('body').append(parentDiv);
                sty()
                setlocal()

            $('#prelink').attr('src',target2);
            
            timer = setTimeout(function() {
                    $("#preview-a").show();
                    resetoPostion()
                    if (GM_config.get("preview_center") == "是") {
                        $("#preview-a").center();
                    }

            },GM_config.get('preview_speed'))
            //滑鼠移出框外的處理
            $("#preview-a").mouseout(function(event)
               {
                   if(GM_config.get("preview_hide") == "點擊框外" || isFullScreen()) {return;}
                   if(event.shiftKey) {return;}
                    $("#preview-a").remove();
                    clearTimeout(timer);
               }

        )
            cleaniframeelm();
        }
    }
    else
    {
        return;
    }
}
)

$(document).keyup(function(event){
    if(event.which == 16 && GM_config.get("preview_auto") == "按下SHIFT鍵")
    {
        clearTimeout(timer);
        $("#preview-a").toggle();
        resetoPostion()
        if (GM_config.get("preview_center") == "是") {
                     $("#preview-a").center();
        }
        clearTimeout(timer);
    }
    else if(event.which == 16 && (GM_config.get("preview_auto") == "按住SHIFT鍵"))
    {
        $("#preview-a").remove()
        clearTimeout(timer);
    }
    else
    {
        return;
    }
})

$(document).click(function(){
        $("#preview-a").remove()
})

function cleaniframeelm(){
{
                //清掉不需要的網頁元素,讓版面較乾淨易讀
                $("#prelink").on("load", () => {
                    $("#prelink").contents().find("#toptb").remove();
                    $("#prelink").contents().find("div[id*='logo']").remove();
                    $("#prelink").contents().find("div[class*='logo']").remove();
                    $("#prelink").contents().find("img[src*='logo']").remove();
                    $("#prelink").contents().find("#pt").remove();
                    $("#prelink").contents().find(".toptb").remove();
                    $("#prelink").contents().find(".top").remove();
                    $("#prelink").contents().find(".hdc.cl").remove();
                    $("#prelink").contents().find("#hdc.cl").remove();
                    $("#prelink").contents().find("#top_login").remove();
                    $("#prelink").contents().find("#hd").remove();
                    $("#prelink").contents().find("header[id*='bar']").remove();
                    $("#prelink").contents().find("header[id*='top']").remove();
                    $("#prelink").contents().find("#head").remove();
                    $("#prelink").contents().find("#header").remove();
                    $("#prelink").contents().find("div[id*='topbar']").remove();
                    $("#prelink").contents().find("div[class*='topbar']").remove();
                    $("#prelink").contents().find("div[id*='search']").remove();
                    $("#prelink").contents().find("div[class*='search']").remove();
                    $("#prelink").contents().find("#foruminfo").remove();
                    $("#prelink").contents().find(".error").remove();
                    $("#prelink").contents().find("#header-inner").remove();
                    $("#prelink").contents().find("#bd").remove();
                    $("#prelink").contents().find("#navbar").remove();
                    $("#prelink").contents().find("div[id*='navlist']").remove();
                    $("#prelink").contents().find("div[class*='navlist']").remove();
                    $("#prelink").contents().find("div[id*='global-nav']").remove();
                    $("#prelink").contents().find("div[class*='global-nav']").remove();
                    $("#prelink").contents().find("div[id*='navbar']").remove();
                    $("#prelink").contents().find("div[class*='navbar']").remove();
                    $("#prelink").contents().find("div[id*='nvbd']").remove();
                    $("#prelink").contents().find("div[class*='nvbd']").remove();
                    $("#prelink").contents().find("div[id*='hornbox']").remove();
                    $("#prelink").contents().find("#welcome_mask").remove();
                    $("#prelink").contents().find("#welcome_present").remove();
                    $("#prelink").contents().find(".uk-child-width-1-1.uk-grid.uk-grid-stack").remove();//igg廣告
                    $("#prelink").contents().find("#wp").css({'filter': 'blur(0px)'});
                    $("#prelink").contents().find("#nv_forum").css({'overflow': 'auto'});
                })
}
}

function setlocal(){
//調位置開始
            var pcss = document.getElementById("preview-a");
            var psize = GM_config.get('preview_scale');
            pcss.style.transform = 'scale('+(psize)+')';
            if (GM_config.get('custom_size') == "是")
            {
                    pcss.style.width= GM_config.get('preview_width');
                    pcss.style.height= GM_config.get('preview_height');
            }

            if (GM_config.get("move_follow") == "是")
            {
               //跟隨鼠標顯示,搭配小視窗使用
               var oPosition = event.target.getBoundingClientRect()
               var odiv =  document.getElementById("preview-a");
               odiv.style.left = oPosition.x - GM_config.get('offset_pw') + "px";
               odiv.style.top = GM_config.get('offset_ph') + "px";
            }
            resetoPostion();
}

function resetoPostion(){
        var odiv = document.getElementById("preview-a");
        if(!odiv)  return;
        var oCpostion = odiv.getBoundingClientRect()
        var oTop = oCpostion.top;
        var oHeight = oCpostion.height;
        var oLeft = oCpostion.left;
        var oRight = oCpostion.right;
        var oBottom = oCpostion.Bottom;
        var oWidth = oCpostion.width;
        var wh = document.documentElement.clientHeight;
        var ww = document.documentElement.clientWidth;

        if(oLeft > ww / 2 + 100){
            if(GM_config.get('custom_size') == "否")
            {
              odiv.style.left = oLeft - ww/2 + 100 +'px';
            }
            else
            {
              odiv.style.left = oLeft - oWidth + GM_config.get('offset_pwout') +'px';
            }
    }
}

jQuery.fn.center = function () {
                this.css("position","absolute");
                this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
                this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
                return this;
            }

$(document).on("mouseout", "a", function () {
    clearTimeout(timer);
    });

$(document).on("mouseup", "a", function () {
    clearTimeout(timer);
    });

function isFullScreen() {
    return  !! (
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
    );
}

function sty(){
    //調整預覽頁的介面
    $("#preview-a").css({
        'background': '#fff',
        'position': 'fixed',
        'z-index': 2147483647,
        'left': '0',
        //'top': '0',
        'bottom': '0',
        'right': '0',
        'margin': '0px auto;',
        'border-radius': GM_config.get('border_circle'), //邊框角度
        'display':'none',
    })
    $("#preview-a iframe").css({
        'z-index': 2147483647,
        'border': 'none',
        'width': '100%',
        'height': '100%',
        'left': '0',
        'top': '0',
        'margin': '0px auto;',
        'border-radius': GM_config.get('border_circle'), //邊框角度
        'border-width': GM_config.get('border_width'), //框線寬度
        'border-color':GM_config.get('border_color'),
        'border-style':'solid',
        'display':'inline-block',
        'position': 'absolute'
    });
}

function set_GM_() {
    const frame = document.createElement("div");
    document.body.appendChild(frame);
    GM_config.init({
      id: "pw_setting",
      title: "預覽網頁的設定",
      fields: {
        preview_auto: {
          label: "彈出預覽框的方式<br>*選自動要釘住預覽頁要持續按住SHIFT鍵不放,變換全屏時不按住有機率直接跳掉<br>*按SHIFT鍵觸發可再按一次SHIFT鍵隱藏<br>*按住SHIFT鍵是鬆開後自動隱藏,要釘住預覽頁只需在空白處點滑鼠左鍵<br>*選自動以外的模式在頁面空白處點擊滑鼠左鍵後可再彈出第二個預覽頁<br>*自動觸發可支援捷克論壇,其他模式可能被擋住",
          type: "radio",
          options: ["自動", "按下SHIFT鍵","按住SHIFT鍵","按住滑鼠左鍵"],
          default: "按住滑鼠左鍵"
        },
        preview_scale: {
          label: "預覽框的縮放倍數",
          type: "text",
          default: "85%"
        },
        preview_hide: {
          label: "預覽框的隱藏方式",
          type: "radio",
          options: ["移去框外", "點擊框外"],
          default: "移去框外"
        },
        move_follow: {
          label: "預覽框跟隨滑鼠移動",
          type: "radio",
          options: ["是", "否"],
          default: "是"
        },
        offset_pw: {
          label: "預覽框的偏移值x(當預設的版面偏離滑鼠位置太多時調整,可以是負值)",
          type: "text",
          default: "100"
        },
        offset_ph: {
          label: "預覽框的偏移值y(當預設版面偏離滑鼠位置太多時調整,可以是負值)",
          type: "text",
          default: "0"
        },
        offset_pwout: {//似乎沒用,考慮刪除,已忘了初衷
          label: "預覽框出界的偏移值x(當預設版面偏離滑鼠位置太多時調整,可以是負值)",
          type: "text",
          default: "60"
        },
        custom_size: {
          label: "自訂預覽框大小(選否等於自適應版面,適合配跟隨滑鼠移動使用,改完要刷新才正常)",
          type: "radio",
          options: ["是", "否"],
          default: "否"
        },
        preview_width: {
          label: "預覽框的寬度",
          type: "text",
          default: "100%"
        },
        preview_height: {
          label: "預覽框的高度",
          type: "text",
          default: "100%"
        },
        preview_center: {
          label: "預覽框置中顯示,改完要刷新才正常",
          type: "radio",
          options: ["是", "否"],
          default: "否"
        },
        border_width: {
          label: "框線寬度",
          type: "text",
          default: "5px"
        },
        border_color: {
          label: "框線顏色",
          type: "text",
          default: "pink"
        },
        border_circle: {
          label: "邊框角度",
          type: "text",
          default: "30px"
        },
        preview_speed: {
          label: "預覽頁的出現速度(1000等於1秒)",
          type: "text",
          default: "850"
        },
      },
      frame
    });
    $(".pw_setting").click(() => {
      GM_config.open();

      $("#pw_setting").css({
        position: "fixed",
        right: "1%",
        left: "auto",
        height: "500px",
        width: "430px"
      });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_header")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find(".field_label")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_preview_auto")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_preview_scale")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_preview_hide")
        .css({
          margin: "10px",
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_move_follow")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_offset_pw")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_custom_size")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_preview_width")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_preview_height")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_preview_center")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_border_width")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_border_color")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_border_circle")
        .css({
          margin: "10px"
        });
      $("#pw_setting")
        .contents()
        .find("#pw_setting_field_preview_speed")
        .css({
          margin: "10px"
        });
      });
  }