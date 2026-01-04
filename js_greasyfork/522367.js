// ==UserScript==
// @name         腾讯广告互选平台-达人广场
// @namespace    huxuan
// @version      2.0.2
// @description  采集数据
// @author       You
// @match        https://r.ruiplus.cn/api/daren*
// @include      *://huxuan.qq.com/trade/selection/*/selection_list*
// @icon         https://file.daihuo.qq.com/fe_free_trade/favicon.png
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_addStyle
// @grant GM_listValues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522367/%E8%85%BE%E8%AE%AF%E5%B9%BF%E5%91%8A%E4%BA%92%E9%80%89%E5%B9%B3%E5%8F%B0-%E8%BE%BE%E4%BA%BA%E5%B9%BF%E5%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/522367/%E8%85%BE%E8%AE%AF%E5%B9%BF%E5%91%8A%E4%BA%92%E9%80%89%E5%B9%B3%E5%8F%B0-%E8%BE%BE%E4%BA%BA%E5%B9%BF%E5%9C%BA.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var appid = "";//达人ID
    var nickname="";//达人名称
    var Num="";//粉丝量
    var a60s ="";//60秒内报价
    var b60s= "";//60秒以上报价
    var avatar= "";//达人头像
    var city_label= "";//达人所在城市
    var auth_profession= "";//达人标签
    var avg_read_count= "";//平均播放量
    var avg_like_count= "";//平均点赞量
    var contact_info= "";//达人的联系方式
    var category_level1= "";//达人大类id
    var category_level2= "";//达人小类id
    var median_read_count= "";//播放中位数
    var play_finish_rate= "";//完播率
    var interaction_rate= "";//互动率
    var fans_num_growth_rate= "";//粉丝增长率
    var expected_cpm= "";//预期 CPM
    var avg_interaction_count= "";//平均互动量
    var fans_num_increment= "";//粉丝增长量
    var synopsis= "";//简介
    var mcn_name="";//mcn机构名称
    var tags="";//标签
    var identity_levels="";//达人职业
    var finder_sex="";//达人性别

    var toTopBtn = document.createElement('button')
    toTopBtn.innerHTML = "一键更新数据"
    toTopBtn.className = "a-b-c-d-toTop"
    toTopBtn.onclick = function (e) {
        search();
    }
    var body = document.body
    var style = document.createElement('style')
    style.id = "a-b-c-d-style"
    var css = `.a-b-c-d-toTop{
      position: fixed;
    bottom: 10%;
    right: 5%;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    font-size: 14px;
    z-index: 999;
    cursor: pointer;
    font-size: 14px;
    overflow: hidden;
    }`
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    body.appendChild(toTopBtn)
    body.appendChild(style)


    setTimeout(function () {
        var details = document.querySelectorAll("body div.spaui-table-tbody tr.spaui-table-tr-data td.finder-trade-list__operation-column div.spaui-table-td-inner span.spaui-table-fixed-td-border");
        //spaui-table-fixed-td-border spaui-table-fixed-td-border-byright

        for (var i = 0; i < details.length; i++) {
            var par = details[i].parentNode;
            var btn1 = document.createElement("button");
            //btn1.style.color = '#3c8dbc';
            //btn1.style.fontSize = '14px';
            //btn1.style.cursor = "pointer";
            btn1.className = "spaui-button spaui-button-text";
            btn1.type = "button";
            btn1.innerText = "下载数据";

            par.appendChild(btn1);
            btn1.onclick = function (e) {
                //alert("数据已更新");
            }
            console.log(details.length);
        }


    }, 2000);//需要加个100ms延时不然按钮加载不出来

    function print1(cc){console.log(cc);}

    function search() {
        console.log("开始");
        GM_xmlhttpRequest({
            method: "get",
            url: "https://r.ruiplus.cn/api/daren/updatalist",
            headers:  {
                "Content-Type": "application/json",
                "token":"DHowHmtkctK5KAmMLcXmPWycq9HKpzW8PVv5MNb5"
            },
            onload: function (response) {
                var bb=0;
                var ss=25000;
                var jsonObject = JSON.parse(response.responseText);
                //console.log(response.responseText);
                if (response.status!==200)  {alert(jsonObject.msg+"没有要更新的数据") ;return;}
                for (var i = 0; i < jsonObject.data.length; i++) {
                    //var jsonObject = JSON.parse(response.responseText);
                    (function (i) {
                    setTimeout (function() {
                        let aa=jsonObject.data.length-i;
                        console.log("准备更新/剩余"+aa+"/任务"+i+"/"+jsonObject.data[i].appid);
                        var appid=jsonObject.data[i].appid;
                        //console.log(document.cookie);
                        //gengxin(appid,(function print1(cc){bb=cc;}))
                        bb=gengxin(appid,print1);
                        //console.log(gengxin(appid,print));
                        //console.log(bb);
                        if (aa===0)  {alert("所有任务执行完毕") ;return;}
                        if (bb===100016)
                        {
                            ss=180000;
                            console.log("100016请求太频繁了,请刷新页面或等待3分钟");
                            setTimeout(function () {},180000*i)
                        }
                        else if (bb===100009)
                        {
                            console.log("100009触发图形验证,必须刷新页面");
                            alert("100009触发图形验证,必须刷新页面") ;return;
                        }
                        else if (bb===100004)
                        {
                            console.log("100004,不是互选用户，修改类型为水下达人");
                            alert("100004,不是互选用户，修改类型为水下达人") ;return;
                        }
                        else
                        {
                            //console.log(bb);
                        }
                    }, ss*i);
                })(i);
                }
                if (jsonObject.data.length===0)  {alert("没有要更新的数据") ;return;}
            }
        });
    };



    function gengxin(appid,callback) {
        let ret1=0;
        //if (typeof callback !== 'function') {
        //}
        GM_xmlhttpRequest({
            method: "get",
            url: "https://huxuan.qq.com/cgi-bin/advertiser/finder_publisher/detail?appid=" + appid,
            headers: {
                "Content-Type": "application/json, text/plain, */*",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "Cookie": ""+document.cookie+"",
                "Account_id": "52685523",
                "Referer": "https://huxuan.qq.com/trade/selection/52685523/selection_list?type=finder-trade"

            },
            onload: function (response) {
                var jsonObject = JSON.parse(response.responseText);
                ret1=jsonObject.ret;
                callback(ret1);
                //return callback;
                //console.log(response.responseText);
                if (ret1>0){
                    nickname="";
                    console.log(jsonObject.msg);
                    //console.log("aa"+ret1);
                    
                }
                if (ret1===100004){
                    nickname="";
                    console.log(jsonObject.msg);
                    GM_xmlhttpRequest({
                        method: "post",
                        url: "https://r.ruiplus.cn/api/daren/updatatype",
                        headers: {
                            "Content-Type": "application/json",
                            "xc-token": "DHowHmtkctK5KAmMLcXmPWycq9HKpzW8PVv5MNb5"
                        },
                        data: JSON.stringify({
                            appid: appid,
                            type: 4
                        }),
                        onload: function (response) {
                            var jsonObject = JSON.parse(response.responseText);
                            if (response.status===200)
                            {
                                console.log("成功修改类型/"+nickname+"/"+Num);
                                console.log("等待20秒");
                            }
                            else
                            {
                                alert(jsonObject.msg+"没有要更新的数据") ;
                                return;
                            }
                        }
                    });
                }               
                else{
                if(jsonObject.data.item.nickname.length>0)
                {
                    nickname=jsonObject.data.item.nickname;
                    Num=jsonObject.data.item.fans_num_level;
                    Num=Num.replace("万+", "");
                    Num=parseInt(Num.replace("\u003c", ""));
                    a60s = jsonObject.data.item.short_video_price;
                    b60s = jsonObject.data.item.long_video_price;
                    avatar = jsonObject.data.item.avatar;
                    city_label = jsonObject.data.item.city_label;
                    auth_profession = jsonObject.data.item.auth_profession;
                    avg_read_count = jsonObject.data.item.avg_read_count;
                    avg_like_count = jsonObject.data.item.avg_like_count;
                    contact_info = jsonObject.data.item.contact_info;
                    category_level1 = jsonObject.data.item.category_level1;
                    category_level2 = jsonObject.data.item.category_level2;
                    median_read_count = jsonObject.data.item.median_read_count;
                    play_finish_rate = jsonObject.data.item.play_finish_rate;
                    interaction_rate = jsonObject.data.item.interaction_rate;
                    fans_num_growth_rate = jsonObject.data.item.fans_num_growth_rate;
                    expected_cpm = jsonObject.data.item.expected_cpm;
                    avg_interaction_count = jsonObject.data.item.avg_interaction_count;
                    fans_num_increment = jsonObject.data.item.fans_num_increment;
                    synopsis = jsonObject.data.item.synopsis;
                    mcn_name = jsonObject.data.item.mcn_name;
                    finder_sex = jsonObject.data.item.finder_sex;
                    if (jsonObject.data.item.identity_level2) 
                    {
                        identity_levels = jsonObject.data.item.identity_level1+","+jsonObject.data.item.identity_level2;
                    }
                    else
                    {
                        identity_levels = jsonObject.data.item.identity_level1;
                    }   
                    tags = jsonObject.data.item.tags;
                    tags = tags.toString();

                    console.log("获取数据/"+nickname+"/"+Num);
                    let jiance=setInterval(() => {
                        if(nickname.length>0) {
                         clearInterval(jiance);
                         GM_xmlhttpRequest({
                             method: "post",
                             url: "https://r.ruiplus.cn/api/daren/addedit",
                             headers: {
                                 "Content-Type": "application/json",
                                 "xc-token": "DHowHmtkctK5KAmMLcXmPWycq9HKpzW8PVv5MNb5"
                             },
                             data: JSON.stringify({
                                 appid: appid,
                                 num: Num,
                                 a60s: a60s,
                                 b60s: b60s,
                                 nickname: nickname,
                                 avatar: avatar,
                                 city_label: city_label,
                                 auth_profession: auth_profession,
                                 avg_read_count: avg_read_count,
                                 avg_like_count: avg_like_count,
                                 contact_info: JSON.stringify(contact_info),
                                 category_level1: category_level1,
                                 category_level2: category_level2,
                                 median_read_count: median_read_count,
                                 play_finish_rate: play_finish_rate,
                                 interaction_rate: interaction_rate,
                                 fans_num_growth_rate: fans_num_growth_rate,
                                 fans_num_growth_rate: fans_num_growth_rate,
                                 expected_cpm: expected_cpm,
                                 avg_interaction_count: avg_interaction_count,
                                 fans_num_increment: fans_num_increment,
                                 synopsis: synopsis,
                                 mcn_name: mcn_name,
                                 tags: tags,
                                 finder_sex: finder_sex,
                                 identity_levels: identity_levels
                             }),
                             onload: function (response) {
                                 var jsonObject = JSON.parse(response.responseText);
                                 if (response.status===200)
                                 {
                                     console.log("成功更新数据/"+nickname+"/"+Num);
                                     console.log("等待20秒");
                                 }
                                 else
                                 {
                                     alert(jsonObject.msg+"没有要更新的数据") ;
                                     return;
                                 }
                             }
                         });
                     }
                     else{
                         console.log("出错");
                     }
                     }, 1500)
                }
                }
                //console.log(ret1);
                //return ret1;
            }
           //return ret1;
        });
        return callback;
        //console.log(ret1);
    };

})();