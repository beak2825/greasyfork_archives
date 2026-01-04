
// ==UserScript==
// @name         多多
// @namespace    pinduoduo
// @version      1.3.1
// @description  pinduoduo
// @author       You
// @match        https://mobile.yangkeduo.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485818/%E5%A4%9A%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/485818/%E5%A4%9A%E5%A4%9A.meta.js
// ==/UserScript==

GM_addStyle(`
.analy_page{
    width: 300px; 
    font-size:12px;
    color:#646464;
    user-select: none; 
    background: white; 
    border: 1px solid #e9e9e9; 
    height: 350px; 
    position: fixed; 
    left: 0; 
    bottom: 0; 
    z-index: 1000001;
}

.analy_order_page{
    width: 100%; 
    font-size:12px;
    color:#646464;
    user-select: none; 
    background: white; 
    border: 1px solid #e9e9e9; 
    min-height: 200px; 
    max-height: 400px;
    position: fixed; 
    overflow: auto;
    left: 0; 
    top: 0; 
    z-index: 1000001;
}

.analy_order_item{
    float: left;
    width: 100%;
    height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid #646464;
}

.analy_order_item li{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    list-style-type: none;
    height: 25px;
    line-height: 25px;;
    border-bottom: 1px solid #646464;
}

.analy_order_checked{
    width: 30px;
}
.analy_order_checked_value{
    margin: 5px;
    width: 15px;
    height: 15px;
}
.analy_order_time{
    width: calc(100% - 291px);
}

.analy_mall{
    width: 150px;
}

.analy_order_item a{
    margin:5px;
    line-height: 25px;
    color:#0881e4;
    text-decoration: none;
    font-size:12px;
}

.analy_price{
    width: 40px;
}
.analy_order_button{
    width: 60px;
}
.analy_order_button button{
    margin-left:2px;
    padding:2px;
}

.analy_page_content{
    padding: 5px;
    float: left;
    width: 250px;
    height: 100%;
}

/* 右侧菜单小按钮 */
.analy_right_menu{
    width: 40px;
    height: 100%;
    float: right;
}

.analy_right_menu button{
    width: 40px;
    margin-bottom: 3px;
    font-size:12px;
}

.analy_right_menu a{
    display: none;
    float:left;
    text-align: center;
    width: 100%;
    color:#1f7e1f;
    font-weight: bolder;
    margin-top: 15px;
    font-size:15px;
}

.analy_pis{
    float: left;
    margin-right: 5px;
    margin-top:5px;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: chartreuse;
}

.analy_items{
    float: left;
    width: 100%;
}

.analy_left_title{
    float: left;
    width: 65px;
}

.analy_history{
    float: left;
    margin-top:8px;
    border:1px solid #e9e9e9;
    width: 100%;
    text-overflow: auto;
    overflow: auto;
    height: 190px;
}

#analy_state_content{
    margin-top: 3px;
    float: left;
    width: 100%;
    text-align: left;
    color:#1f7e1f;
}

.analy_popup {
    display: none;
    position: fixed; /* 设置为fixed定位 */
    width: 80%;
    height: 30px;
    border-radius: 3px;
    background-color: rgba(0,0,0,0.7);
    color:#ffffff;
    font-size:13px;
    text-align: center;
    line-height: 30px;
    top: 40%; /* 距顶部50% */
    left: 50%; /* 距左侧50% */
    transform: translate(-50%, -50%); /* 水平、垂直都向上移动自身宽度/高度的一半 */
    z-index: 1000010;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.analy_input{
    border:1px solid #646464;
    border-radius: 2px;
    height: 20px;
}
`);

//解析类服务
class analy{

     http(urls,data,func){
        //发起一个post请求
        console.log("https://www.yangkaduo.com"+urls);
        console.log(this.analyToken);
        if(this.analyToken.length <= 0) { return; }

        GM.xmlHttpRequest({
            method: "POST",
            url: "https://www.yangkaduo.com"+urls,
            data:data,
            headers: {
            "Content-Type": "application/json",
            },
            onload: function(response) {
                analyUiHistory("发起请求完成");
                func(response.responseText);
            }
        });
    }

    //上传解析数据
    postGoodsData(rawData,func){
        this.http("/mock/notify_pdd", rawData,function(res){
            var retJson = JSON.parse(res);
            if(retJson.ret == true){
                func(true, 0);
            }else{
                func(false, "帐号被风控");
            }
        });
    }

    getAnalyGoods(func){
         let data = {
            user_id: this.analyToken,
            source_type: "pdd_detail",
            product_type: "pdd_detail",
            dispatch_type: "pid"
        }
        this.http("/sigma_transform/dispatch", JSON.stringify(data),function(res){
            var retJson = JSON.parse(res);
            if(retJson.pid.length > 0){
                func(true,retJson,retJson.pid,retJson.data.log_id);
            }else{
                func(false,retJson,retJson.msg);
            }
        });

    }
    setToken(token){
        this.analyToken = token;
    }

    getpddToken(){
        return  "";
    }
    getUid(){
        var dat = document.cookie.split("pdd_user_id=");
        if(dat.length>1){
            return dat[1].split(";")[0];
        }
        return "未登录";
    }

}

var mAnaly = new analy();

//初始化页面的事件绑定
function analyEventBind(isShow){
    //显示或隐藏窗口
    $("#analy_menu_show").click(function(){
        if($(this).text() == "隐藏"){
            $(".analy_page").animate({left:"+=-260"}, "slow");
            $(this).text("显示");
            GM_setValue("analy_init_hide","1");
            $("#analyCount").show();
        }else{
            $(".analy_page").animate({left:"+=260"}, "slow");
            $(this).text("隐藏");
            GM_setValue("analy_init_hide","0");
            $("#analyCount").hide();
        }

     });

    //页面跳转至主页~
    $("#toHome").click(function(){
        window.location.href = "/";
     });
    //页面跳转至个人中心~
    $("#toPersonal").click(function(){
        window.location.href = "/personal.html";
     });
     //复制TK数据
     $("#copyToken").click(function(){
        chrome.extension.sendMessage({"act": "getPddToken"}, function(retData){
            var textarea = document.createElement("textarea");
            textarea.style.position = "fixed";
            textarea.style.opacity = 0;
            textarea.value = retData.uid+"----"+retData.accessToken+"----"+retData.ua;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("复制成功:"+retData.uid);
       });

     });

     //清空输出日志
     $("#clearHistory").click(function(){
        GM_setValue("analy_history","");
        $(".analy_history").html(GM_getValue("analy_history"));
     });

    //重置解析环境
    $("#resetAnalyDead").click(function(){
        GM_setValue("analy_user_dead","0");
        GM_setValue("analy_stop","0");
        GM_setValue("analy_rand_click","0");

        businessAnaly();
        //window.location.href = "/personal.html";
    });

    //停止/继续解析
    $("#stopAnaly").click(function(){
        GM_setValue("analy_stop","1");
    });

    //登录小号
    $("#loginToken").click(function(){
        var pddStr = prompt("请输入账号数据(AccessToken)：");
        if(pddStr){
            chrome.extension.sendMessage({"act":"analyPddLogin","token":pddStr},function(res){
                window.location.reload();
            })
        }
    })


    //清空 入口
    $("#clearMain").click(function(){
        GM_setValue("analyMain",undefined);
        $(this).css("color","#000000");
    })

    //获取cookie
    $("#getCookie").click(function(){
        alert(document.cookie)
    });
    //代付
    $("#firendPay").click(function(){
        var rawData =  document.body.outerHTML.split("window.rawData=")[1].split("};\n")[0]+"}";
        var retJson = JSON.parse(rawData);
        if(retJson.data.fpId){
            var textarea = document.createElement("textarea");
            textarea.style.position = "fixed";
            textarea.style.opacity = 0;
            textarea.value = "https://mobile.yangkeduo.com/friend_pay.html?fp_id="+retJson.data.fpId;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            mAnaly.http("/public/post/friend/pay?fp_id="+retJson.data.fpId,null,function(res){
                var retJson = JSON.parse(res);
                alert("复制代付链接成功，网址：http://analy.pinduoduo2.com/pay?u="+retJson.data);
            });


        }else{
            alert("请在订单页面使用!")
        }


    })
    //商品跳转
    $("#loadGoods").click(function(){
        var goodsId = prompt("请输入商品ID号：");
        if(goodsId){
            window.location.href = "/goods.html?goods_id="+goodsId;
        }
    })

    //输入解析速度
    $("#analySpeed").bind("input",function(){
        GM_setValue("analy_speed",$(this).val());
    });

    $("#analyToken").bind("input",function(){
        GM_setValue("analy_token",$(this).val());
        mAnaly.setToken(GM_getValue("analy_token"));
    });



}


//创建UI页面
function createPage () {
    //页面主容器
    const page = $("<div class='analy_page'></div>")
    //绘制右侧菜单按钮
    var menuHtml = "";
    menuHtml += "<button id='analy_menu_show'>隐藏</button>";
    menuHtml += "<button id='toHome'>主页</button>";
    menuHtml += "<button id='toPersonal'>个人</button>";
   // menuHtml += "<button id='copyToken'>提号</button>";
    menuHtml += "<button id='clearHistory'>清空</button>";
    menuHtml += "<button id='resetAnalyDead'>解析</button>";
    menuHtml += "<button id='stopAnaly'>停止</button>";
    menuHtml += "<button id='loadGoods'>商品</button>";
    menuHtml += "<button id='firendPay'>代付</button>";
    menuHtml += "<button id='getCookie'>获取</button>";
    menuHtml += "<button id='clearMain'>清入</button>";
    //menuHtml += "<button id='orderList'>订单</button>";
    //menuHtml += "<button style='color:#f01113' id='loginToken'>上号</button>";
    menuHtml += "<a id='analyCount'>0</a>";
    const top_menu = $("<p class='analy_right_menu'>"+menuHtml+"</p>");
    const page_content = $("<div class='analy_page_content'></div>");
    page_content.append("<p class='analy_items'><div class='analy_left_title'>多多UID</div><span id='analy_pdd_uid'></span></p>");
    var analy_state = $("<p class='analy_items'></p>");
    analy_state.append("<div class='analy_left_title'>解析令牌</div>");
    analy_state.append("<input class='analy_input' id='analyToken' type='text' style='width:170px' />");
    page_content.append(analy_state);
    var analy_state = $("<p class='analy_items'></p>");
    analy_state.append("<div class='analy_left_title'>采集间隔</div>");
    analy_state.append("<input class='analy_input' id='analySpeed' type='text' style='width:50px' />");
    analy_state.append("<span style='padding-left:5px'>秒</span>");
    page_content.append(analy_state);
    var analy_state = $("<p class='analy_items'></p>");
    analy_state.append("<div class='analy_left_title'>成功解析</div>");
    analy_state.append("<span id='analy_count'>0</span>");
    page_content.append(analy_state);

    //采集明细
    page_content.append("<div contenteditable=true class='analy_history'></div>");
    page_content.append("<p id='analy_state_content'>正在执行</p>");
    page.append(page_content);
    page.append(top_menu);
    $("body").append(page);
    $("body").append($("<div id='analy_popup' class='analy_popup'>test</div>"));
    //初始化时是否隐藏或显示
    if(GM_getValue("analy_init_hide") == "1"){
        $(".analy_page").css("left","+=-260");
        $("#analy_menu_show").text("显示");
        $("#analyCount").show();
    };
    analyEventBind();
    analyInitData();
}


//初始化UI页面数据
function analyInitData(){
   //通知后台获取当前拼多多的TOKEN数据
    $("#analy_pdd_uid").text(mAnaly.getUid());
    $(".analy_history").html(GM_getValue("analy_history"));
    $(".analy_history").scrollTop($(".analy_history").prop("scrollHeight"));
   if(GM_getValue("analy_user_dead") == "1"){
        analyUiState("账号已风控","error");
   };

   var analy_success_count = GM_getValue("analy_success_count");
   analy_success_count = analy_success_count?analy_success_count:0;
   $("#analy_count").text(analy_success_count);
   $("#analyCount").text(analy_success_count);
   $("#analySpeed").val(GM_getValue("analy_speed"));
   $("#analyToken").val(GM_getValue("analy_token"))
   mAnaly.setToken(GM_getValue("analy_token"));
   if(GM_getValue("analyMain")){
    $("#clearMain").css("color","#00ff00");
   }
}

//显示解析状态
function analyUiState(text,color){
    $("#analy_state_content").text(text);
    if(color == "error"){
        $("#analy_state_content").css("color","#ff0000");
    }else{
        $("#analy_state_content").css("color","#1f7e1f");
    }

}

//显示解析日志
function analyUiHistory(text){
    $(".analy_history").append("<p>"+text+"</p>");
    GM_setValue("analy_history",$(".analy_history").html());
    setTimeout(function(){
        $(".analy_history").scrollTop($(".analy_history").prop("scrollHeight"));
   },100);
}

//计数采集成功
function analyCountAdd(){
    var analy_success_count = GM_getValue("analy_success_count");
    analy_success_count = analy_success_count?analy_success_count:0;
    analy_success_count++;
    GM_setValue("analy_success_count",analy_success_count);
    $("#analy_count").text(analy_success_count);
}

//业务处理 - 商品页面
function businessGoods(){
     //入口数据
     var url = window.location.href;
     if(!GM_getValue("analyMain")){

        if(url.indexOf("yangkeduo.com/goods.html") > -1){
            var goods_id = (url.split("goods_id=")[1]+ "&").split("&")[0];
            url = url.replace(goods_id,"$goodsId");
            GM_setValue("analyMain",url);
            analyUiHistory("记录当前入口成功");
            $("#clearMain").css("color","#00ff00");
        }

    }else{
        analyUiState("正在读取商品数据");
    }


    var pdd_goods_id = getParam("goods_id");
    analyUiState("正在读取商品数据.1");
    var rawData = "";
    var ret = document.body.outerHTML;
    var arr = ret.split("window.rawData=");
    if(arr.length>1){
        analyUiState("正在读取商品数据.2");
        var ret = arr[1];
        analyUiState("正在读取商品数据.3");
        var arr = ret.split("};\n");
        analyUiState("正在读取商品数据.4");
        var rawData = arr[0] + "}";
        analyUiState("正在读取商品数据.5");
        try{
            var rawJson = JSON.parse(rawData).store.initDataObj;
        }
        catch(e){
            analyUiState("读取数据错误，正在重试..");
            setTimeout(function(res){
                businessGoods()
            },800)
            return ;
        }

        analyUiState("正在读取商品数据.6");
        var analyInfo = GM_getValue("analyInfo");
        analyUiState("正在读取商品数据.7");
        var analyJson = JSON.parse(analyInfo);
        analyUiState("正在读取商品数据.8");
        //账号已风控
        if(rawData.indexOf("原商品已售罄，为你推荐相似商品")>-1){
            //尝试恢复风控,延迟1秒等待它弹出来！
            var click_count = GM_getValue("analy_rand_click");
            click_count = click_count?click_count:0;
            click_count = parseInt(click_count);
            if(click_count<5){
                var analySpeed = parseInt(GM_getValue("analy_speed"));
                if(analySpeed<=0 || analySpeed == NaN){
                    analySpeed = 5;
                }
                setTimeout(function(){
                    click_count = click_count + 1;
                    GM_setValue("analy_rand_click",click_count);
                    businessAnaly();//继续尝试解析
                },analySpeed*1000);

            }else{
                analyUiState("账号已风控","error");
                GM_setValue("analy_user_dead","1");
            }

            analyUiHistory("解析失败:"+analyJson.goods_id+" 账号已风控");



        }else{
            analyUiState("上报商品数据.1");
            var autoScroll = setInterval(function(){ window.scrollTo(0, window.scrollY+80);},100)
            setTimeout(function(){
                clearInterval(autoScroll);
            },3500);

            GM_setValue("analy_user_dead","0");//账号恢复正常
            GM_setValue("analy_rand_click",0);//清空尝试恢复风控的次数
            analyUiState("上报商品数据.2");
            if(pdd_goods_id == analyJson.pid){
                analyUiState("上报商品数据.3");
                var arr = url.split("refer_page_sn=");
                var pdd_refer_page_sn = "";
                if(arr.length>1){
                    analyUiState("上报商品数据.4");
                    pdd_refer_page_sn = arr[1].split("&")[0];
                }else{
                    analyUiState("上报商品数据.5");
                    pdd_refer_page_sn = "null;"
                }
                analyUiState("上报商品数据.6");

                var data = {
                    goodTask: analyJson,
                    userid: $("#analyToken").val(),
                    createtime: new Date().getTime(),
                    data: rawJson
                };
                analyUiState("上报商品数据.7");
               setTimeout(function(){
                mAnaly.postGoodsData(JSON.stringify(data),function(isSuccess,msg){
                    if(isSuccess){
                        analyUiHistory("上报成功:"+pdd_goods_id+"，价格:"+msg);
                        analyCountAdd();
                    }else{
                        analyUiHistory("上报失败:"+pdd_goods_id+"，"+msg);
                    }
                    analyUiState("上报商品数据.8");
                    var analySpeed = parseInt(GM_getValue("analy_speed"));
                    if(analySpeed<1){
                        analySpeed = 1;
                    }

                    setTimeout(function(){
                        businessAnaly();//成功后继续解析
                    },analySpeed*1000);
                })
               },100);



            }else{
                analyUiState("商品与云不一致");
            }


        }
    }else{
        analyUiState("数据格式错误...");
    }





}



function getParam(paramName) {
    paramValue = "", isFound = !1;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue;
}

function urlReferFake(goods_id,referType){
    var length = 10
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var result = ""
    for (var i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      var timestamp = Math.round(new Date());
      var host = "https://mobile.yangkeduo.com/goods.html?goods_id=";
      var gmas = "";
      //duoduo miao sha

       //duoduo jing xuan
      if(referType == "jingxuan"){
          gmas = "&_oc_trace_mark=199&_oc_adinfo=&_oak_gallery_token="+randSign()+"&_oak_gallery=&_oc_refer_ad=1&is_spike=0&thumb_url=&page_from=202&page_el_sn=99084&refer_page_el_sn=99084&refer_page_name=personal&refer_page_id=10001_"+timestamp+"_"+result+"&refer_page_sn=10001";
      }
      if(referType == "jingxuan2"){
          gmas = "&_oak_gallery_token=&_oak_gallery=&_oc_refer_ad=1&page_from=103&thumb_url=&refer_page_name=order_detail&refer_page_id=10038_"+timestamp+"_"+result+"&refer_page_sn=10038";
      }
       if(referType == "jingxuan3"){
          gmas = "&refer_page_name=goods_detail&refer_page_id=10014_1703775153876_0vcy9y3cw4&refer_page_sn=10014";
      }
       //bai yi bu tie
      if(referType == "baiyibutie"){
          gmas = "&page_from=51&_oc_brand_neigou_param=_8_14&_oak_gallery_token="+randSign()+"&_oak_gallery=&thumb_url=&refer_page_el_sn=600041&refer_page_name=brand_activity_subsidy&refer_page_id=21459_"+timestamp+"_"+result+"&refer_page_sn=21459";
      }
      // duo duo guo yuan
      if(referType == "duoduoguoyuan"){
          gmas = "&_oak_gallery_token="+randSign()+"&_oak_gallery=&gallery_id=&_oc_mkt_domain=3&_oc_mkt_tr_sc=ddgy_order&_oc_mkt_tr_token=&_x_fun_source_el=4&_x_fun_mkt_sc=ddgy_order&_x_fun_goods_id=523067185014&_oc_biz_type=2002&_oc_biz_tag=%5B100%5D&page_from=94&_oc_payment_biz=ddgy&_x_fun_order_rec=rec&_x_fun_prec_sid=58&_x_fun_flr_price=300&_oc_trace_mark=199&_oc_refer_ad=1&refer_page_name=garden_goods&refer_page_id=11051_"+timestamp+"_"+result+"&refer_page_sn=11051";
      }
      //home
      if(referType == "home"){
          gmas = "&_oak_gallery_token=&_oak_gallery=&is_spike=0&thumb_url&page_from=202&page_el_sn=99084&refer_page_el_sn=99084&refer_page_name=psnl_verification&refer_page_id=10390_"+timestamp+"_"+result+"&refer_page_sn=10390";
      }

      //zhibo live
      if(referType == "live"){
          gmas = "&_oc_n_mkt_type=1&duoduo_type=3&_oc_duoduo_type=3&_oc_pid=&_oak_merchant_tag=20&_oc_payment_biz=ddlive&_oc_n_mkt_domain=82&_oc_n_mkt_tr_token=&page_from=57&_oak_live_feed_id=20231211_87372540_01&_oc_n_mkt_tr_sc=duoduo_live&_oc_cps_sign=&_oc_live_show_id=20231211_87372540_01&refer_page_name=yhzb_bfy&refer_page_id=31430_"+timestamp+"_"+result+"&refer_page_sn=31430"
      }
     if(referType == "null"){
          gmas = ""
      }

      if(referType == "ddms"){
          gmas = "&refer_page_el_sn=2438686&is_spike=1&page_from=2&_oc_spike_type=100001&_lp_is_reserve_only=false&refer_page_name=spike_v3&refer_page_id=47200_"+timestamp + "_" + result+"&refer_page_sn=47200";
      }
      if(referType == "99temai"){
          gmas = "&refer_page_name=sjs_special_nine&refer_page_id=10046_"+timestamp+"_"+result+"&refer_page_sn=10046&refer_subjects_id=12&refer_tab_id=27776&_oak_prom_name=9k9&page_from=20&refer_page_el_sn=8578148&refer_abtest_info=%7B%7D"
      }
      if(referType == "lingquan"){
          gmas = "&page_from=36&_oc_source=56&refer_page_name=coupons&refer_page_id=10037_"+timestamp+"_"+result+"&refer_page_sn=10037";
      }
      if(referType == "collect"){
          gmas = "&page_from=202&refer_page_name=likes&refer_page_id=10034_"+timestamp+"_"+result+"&refer_page_sn=10034"
      }
      if(referType == "likes"){
          gmas = "&page_from=101&refer_page_name=likes&refer_page_id=10126_"+timestamp+"_"+result+"&refer_page_sn=10126"
      }
      if(referType == "chat"){
          gmas = "&page_from=202&refer_page_name=chat&refer_page_id=10041_"+timestamp+"_"+result+"&refer_page_sn=10041"
      }
      if(referType == "pinxq"){
          gmas = "&page_from=0&refer_page_name=pinxiaoquan_chat&refer_page_id=47778_"+timestamp+"_"+result+"&refer_page_sn=47778"
      }


      var strs = host + goods_id + gmas;

      return strs;
  }



//获取要解析的商品
function businessAnaly(){
    analyUiState("正在读取商品..");
    if(GM_getValue("analy_stop") == "1"){
        analyUiState("解析暂停");
    }else{
        if(GM_getValue("analy_user_dead") != "1"){

            var timeoutGet = setTimeout(function(){
                businessAnaly();//获取不成功稍后在继续解析
            },4000);

            mAnaly.getAnalyGoods(function(isSuccess,rawData,goodsId,taskId){
                analyUiHistory("获取云商品ID成功");
                if(isSuccess){
                    var length = 10
                    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                    var result = ""
                    for (var i = 0; i < length; i++) {
                       result += characters.charAt(Math.floor(Math.random() * characters.length))
                      }
                    var timestamp = Math.round(new Date());
                    GM_setValue("analyInfo",JSON.stringify(rawData));
                    var url = GM_getValue("analyMain");



                    if(url){
                        analyUiHistory("*开始解析:"+goodsId+" 任务ID:"+taskId);
                        url = url.replace("$goodsId",goodsId);
                        window.location.href = url
                    }else{
                        analyUiHistory("开始解析:"+goodsId+" 任务ID:"+taskId);
                        var typeArr = ['chat'];
                        var type = typeArr[Math.floor(Math.random() * typeArr.length)]
                        var link = urlReferFake(goodsId,type);
                        window.location.href = link;
                        //window.location.href = "https://mobile.yangkeduo.com/goods1.html?_wvx=10&refer_share_uin=CL6S3PATDQ2Y4C5SQFWKYVGMXM_GEXDA&_oak_share_time=1704619543&share_uin=CL6S3PATDQ2Y4C5SQFWKYVGMXM_GEXDA&page_from=401&_wv=41729&refer_share_channel=message&refer_share_id=jG5sSIQZjE5fdW4DDJB9l4ihUdDOFC3u&_oak_share_snapshot_num=998800&pxq_secret_key=UOIKIBXTJFHO2OEY5ZUTBHPLWCVHL6K5FO6DS42JELK4ZHYSLYBA&goods_id="+goodsId+"#pushState";

                    }

                    return ;
                }else{
                    analyUiState(goodsId,"error");
                    clearTimeout(timeoutGet);
                    setTimeout(function(){
                        businessAnaly();//获取不成功稍后在继续解析
                    },500);

                }
            })
        }else{
            analyUiState("账号风控","error");
        }
    }

}


//业务处理 - 随机点击一条精选推荐
function businessAnalyRandClick(){
    var JingXuanGoodsBtn = document.getElementsByTagName("div");
    for(var i=0;i<JingXuanGoodsBtn.length;i++){
        if(JingXuanGoodsBtn[i].getAttribute("role") == "button"){
            JingXuanGoodsBtn[i].click();
            return true;
        }
    }
    return false;
}


//业务逻辑
(function () {

    setTimeout(function(){
        main();
    },300)

})();

function main(){
    if($("#analy_menu_show").length>0){
        return ;
    }
    setTimeout(function(){
        var url = window.location.href;
        if(url.indexOf("yangkeduo.com") > -1){
            createPage();
            //业务处理（商品解析结果处理）
            if(url.indexOf("yangkeduo.com/goods.html") > -1){
                businessGoods();
            }
            if(url.indexOf("yangkeduo.com/goods2.html") > -1){
                businessGoods();
            }
            if(url.indexOf("yangkeduo.com/goods1.html") > -1){
                businessGoods();
            }
            if(url.indexOf("yangkeduo.com/personal.html")>-1){
                //业务处理（拉取商品并解析）
                businessAnaly();
            }
            if(url.indexOf("yangkeduo.com/psnl_verification.html")>-1){
                //滑块
                analyUiState("出现滑块","error");
            }


        }
    },500)

}




