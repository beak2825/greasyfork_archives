// ==UserScript==
// @name 自己修改的论坛签到工具
// @namespace 自己修改的论坛签到工具
// @version 2024/09/13
// @description 用于各种论坛自动签到

// @license      GPL
// @include     http*://*.spring-plus.net/*
// @include     http*://*.baidu.com/*
// @match        http*://blackhole03.xyz/*
// @match        http*://qianmo1.tw/*
// @match        http*://fbi.company/*
// @match        https://www.laomoit.com/*
// @match        https://www.mpyit.com/*
// @include     http*://bbs.level-plus.net/*
// @include     http*://www.wnflb2020.com/*
// @include     http*://www.wnflb66.com/*
// @include     http*://www.wnflb19.com/*
// @include     http*://www.repaik.com/*
// @include     http*://*.moeshare.com/*
// @include     http*://moeshare.com/*
// @include     http*://moeshare.*/*
// @include     http*://*.moeshare.*/*
// @include      http*://www.qianmo.*/*
// @include      http*://www.qianbai.*/*
// @include      http*://www.acgke.com/*
// @include      http*://idanmu.at/*
// @match        https://www.tsdm.love/plugin.php?id=np_cliworkdz:work
// @match        http*://www.tsdm*.*/plugin.php?id=np_cliworkdz:work
// @match        https://www.tsdm**.*/plugin.php?id=np_cliworkdz:work
// @match        http*://www.tsdm*.*/plugin.php?id=np_cliworkdz:work
// @include      http*://*.lightnovel.cn/*
// @include      http*://*.seikuu.com/*
// @include      http*://seikuu.com/*
// @include      http*://www.xiaomantu.com/*
// @include      http*://xiaomantu.com/*
// @include      https://www.south-plus.net/*
// @include      http://www.gscq.me/*
// @include      https://www.humblebundle.com/*
// @include      http*://www.chinapyg.com/*
// @include      http*://www.dommdo.com/*
// @include      http://www.swbbsc.com/*
// @include      http://*/plugin.php?id=dsu_paulsign*
// @include      http://*.kafan.cn/*
// @include      https://*.kafan.cn/*
// @include      http://bbs.kafan.cn/forum.php?mod=viewthread*
// @include      http://www.stus8.com/*
// @include      http://bbs.kafan.cn/thread-*-*-*.html
// @include      http://bbs.wstx.com/*
// @include      http://bbs.houdao.com/
// @include      http://*/dsu_paulsign-sign*
// @include      http://www.tsdm.net/*
// @include      http*://www.tsdm*.*/*
// @include      http*://www.tsdm.love/*
// @include      http://www.tsdm.me/*
// @include      http://tsdm.tw/*
// @include      http://bbs.gfan.com/*
// @include      http://www.horou.com/*
// @include      http://www.92jh.cn/*
// @include      http://bbs.wstx.com/*
// @include      http://bbs.ntrqq.net/*
// @include      http://www.gn00.com/*
// @include      http://www.hentaiacg.club/*
// @include      http://xuexia15.com/*
// @include      http://*.xuexia15.*/*
// @include      http*://*.xuexia15.*/*
// @include      http*://*.xuexia15.net/*
// @include      https://xuexia15.com/*
// @include      http*://xuexia15.*/*
// @include      http://hentaiacg.club/*
// @include      https://www.jkforum.net/*
// @include      http://www.lalulalu.com/*
// @include      http://www.52h5.org/*
// @include      http://www.521gal.com/*
// @include      *://*.h5dm.com/*
// @include      *://*.cnscg.com/*
// @include      http://www.hyyo.net/*
// @include      http://www.hyacg.com/*
// @include      https://www.hyacg.com/*
// @include      https://bbs4.2djgame.net/*
// @include      http://mcyacg.com/*
// @include      http://www.oko.co/*
// @include      http*://www.dxdbbb.com/*
// @include      http*://gmgard.com/*
// @include      http://bbs.north-plus.net/*
// @include      *-plus.net/plugin.php?*
// @include      http*://www.wnflb.com/*
// @include      http*://www.wnflb2019.com/*
// @include      http://n5m6.com/*
// @include      https://www.manhuabudang.com/*
// @include      http://www.acfun.cn/*
// @include      http://www.manhuabu.com/*
// @include      http://*.youku.com/*
// @include      http://*.52pojie.cn/*
// @include      https://*.52pojie.cn/*
// @include      https://*.ttxiaoshuo.top/*
// @include      http://bbs.ruanfenquan.com/*
// @include      http://*.wfun.com/*
// @include     http://*plugin.php?id=mpage_sign:sign*
// @include     https://rouman5.com/*
// @include     https://*.jkju.cc/*




// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @grant GM_xmlhttpRequest
// @run-at document-end
// @copyright 2013+, Coolkid
// @copyright 2014+, jasonshaw
// @copyright 2016+, wycaca
// @downloadURL https://update.greasyfork.org/scripts/482529/%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9%E7%9A%84%E8%AE%BA%E5%9D%9B%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/482529/%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9%E7%9A%84%E8%AE%BA%E5%9D%9B%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

//   alert("脚本到这里是生效的");



/*
//=================================暂时性的跳转到购买口罩页面==================================
if(isURL("https://www.baidu.com/")){
    //----------------------------------------------------------------------------------在网页开头插入一段html代码,这里是插入按钮,并且按钮有事件效果--------
    //
    var divObj=document.createElement("div");  //插入div标签
    //divObj.setAttribute('id','topAlert');
    divObj.innerHTML='<html><body><button id="clab" style="z-index: 9999; position: fixed ! important; right: 1200px; top: 3px;" type="button" onclick="myFunction()">口罩连接</button></body></html>';       //div里面写入以上内容，这里是添加一个按钮的样式
    var first=document.body.firstChild;//得到页面的第一个元素
    document.body.insertBefore(divObj,first);//在得到的第一个元素之前插入
    var btn2 = $("#clab");
    $(function(){
        // 上面新建的按钮 的点击事件
        $("#clab").click(function(){
            //window.open("http://www.microsoft.com/")
            //window.open("http://www.w3school.com.cn/")
            window.open("https://item.jd.com/100011521400.html","_blank");     //10点抢   京东 振德医疗 21点预，在另外新建窗口中打开窗口
            window.open("https://detail.liangxinyao.com/item.htm?id=612510400743&ut_sk=1.VPWjXcO2hlUDABdnn7S0QAVf_21380790_1583743515824.Copy.1&sourceType=item&price=25.9&origin_price=19.9&suid=ACD9EF59-A2AD-4ED8-A38E-62AB9B400D83&un=9e270b3cb0c596048a195baaa22d8f6a&share_crt_v=1&spm=a2159r.13376460.0.0&umpChannel=bybtqdyh&u_channel=bybtqdyh&sp_tk=4oK0ZnlIcTE2Y3JVZkTigrQ=&cpp=1&shareurl=true&short_name=h.VeV1l5E&sm=517760&app=chrome&skuId=4483031270769","_blank");     //15点抢   淘宝 袋鼠医生，在另外新建窗口中打开窗口
            window.open("https://detail.tmall.com/item.htm?id=550189462849&ut_sk=1.VPWjXcO2hlUDABdnn7S0QAVf_21380790_1583743515824.Copy.1&sourceType=item&price=24.8&origin_price=49.6&suid=5C8DF8AD-9779-4873-B030-EB4E3223392B&un=9e270b3cb0c596048a195baaa22d8f6a&share_crt_v=1&spm=a2159r.13376460.0.0&umpChannel=bybtqdyh&u_channel=bybtqdyh&sp_tk=4oKzZXl3WTE2Y0tOTznigrM=&cpp=1&shareurl=true&short_name=h.VVgzEDZ&sm=26340d&app=chrome","_blank");     //15点抢   淘宝 振德医疗，在另外新建窗口中打开窗口

            window.open("https://detail.tmall.com/item.htm?id=612236792037&ut_sk=1.VPWjXcO2hlUDABdnn7S0QAVf_21380790_1583743515824.Copy.1&sourceType=item&price=25.9&origin_price=25.9&suid=555F40C7-7BE7-4472-8CE4-18F535FDCC02&un=9e270b3cb0c596048a195baaa22d8f6a&share_crt_v=1&spm=a2159r.13376460.0.0&umpChannel=bybtqdyh&u_channel=bybtqdyh&sp_tk=4oKsTG1TZzE2Y2tJSUTigqw=&cpp=1&shareurl=true&short_name=h.VVguzWd&sm=511797&app=chrome","_blank");     //15点抢   天猫    袋鼠医生，在另外新建窗口中打开窗口
            window.open("https://item.jd.com/100011551632.html","_blank");     //20点抢   京东 3q    15点预约，在另外新建窗口中打开窗口

            window.open("https://item.jd.com/100006394713.html","_blank");     //20点抢   京东 袋鼠医生 15点预约，在另外新建窗口中打开窗口

        });

    });
   return;
}
*/
//----------------------肉漫屋添加搜索框-------------------------------------------------------------------------------------------------
if(isURL("https://rouman5.com/home")){

    }
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/forum-2-1.html")){
    //小说论坛
    setTimeout(function(){
        window.open("https://www.ttxiaoshuo.top/thread-171230-1-1.html");
               return;
    }, 2500);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171230-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171231-1-1.html';
        return;
    }, 26000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171231-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171232-1-1.html';
        return;
    }, 26000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171232-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171233-1-1.html';
        return;
    }, 26000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171233-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171234-1-1.html';
        return;
    }, 26000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171234-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171235-1-1.html';
        return;
    }, 26000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171235-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171236-1-1.html';
        return;
    }, 26000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171236-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171237-1-1.html';
        return;
    }, 26000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171237-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171238-1-1.html';
        return;
    }, 26000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171238-1-1.html")){
    //小说论坛
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/thread-171239-1-1.html';
        return;
    }, 26000);
}
//
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/thread-171239-1-1.html")){
    //小说论坛去往签到页面
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/replyreward_7ree-replyreward_7ree.html';
        return;
    }, 2000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("ttxiaoshuo.top/replyreward_7ree-replyreward_7ree.html")){
    //小说论坛签到页面
    setTimeout(function(){
        self.location='https://www.ttxiaoshuo.top/plugin.php?id=replyreward_7ree&code=4&type_7ree=3';
        return;
    }, 2000);
}



https://www.ttxiaoshuo.top/replyreward_7ree-replyreward_7ree.html
//=====================================================================================

if(isURL("jkju.cc/plugin.php?id=k_misign:sign")){
    //镜客居小说网签到
    setTimeout(function(){
        $("a#JD_sign.btn.J_chkitot").click();
        //self.location='https://www.jkju.cc/plugin.php?id=k_misign:sign&operation=qiandao&formhash=14a64fe3&format=empty';
        return;
    }, 2000);
}



//--------------------------------------------绅士ACG----------绅士ACG-------绅士ACG-------绅士ACG---------------绅士ACG--------绅士ACG------绅士ACG-----绅士ACG-----绅士ACG-----
if(isURL("hentaiacg.org/home.php?mod=task")||isURL("hentaiacg.club/home.php?mod=task")||isURL("xuexia15.in/home.php?mod=task")||isURL("xuexia15.cc")||isURL("xuexia15.me")){
    //绅士ACG 能下h漫合集
    if(window.find("登录即可领取红包")&&window.find("积分 绅士币 30")){
        $('.ptm a [alt="apply"]').click();

        return;
    }
    if(window.find(" 打卡签到")){
        setTimeout(function(){

            self.location='https://www.xuexia15.cc/study_daily_attendance-daily_attendance.html?fhash=97c00d8c';

            return;
        }, 3500);


        return;
    }
}
//=====================================================================================
if(isURL("fbi.company/user")){
    //fbi ssr
    setTimeout(function(){
        if(window.find("每日签到")){
            $("a.btn.btn-icon.icon-left.btn-primary").click();
            return;
        }
    }, 4000);
    return;
}
//=====================================================================================

//=====================================================================================
if(isURL("blackhole03.xyz/user#")){
    //黑洞云 ssr
    setTimeout(function(){
        if(window.find("每日签到")){
            $("a.btn.btn-icon.icon-left.btn-primary").click();
            return;
        }
    }, 2000);
    return;
}
//=====================================================================================



//---------------------------------------------------------------------------------------------------------------------------殁漂遥站点浏览优化
(function() {
    // ["laomoit", "mianfei", "pana"]
    var text = document.getElementById('verifycode'); // 获取输入框
    if (text) {
        text.value = "pana"; // 填入验证码
        var button = document.getElementById('verifybtn');// 获取按钮
        button.click(); // 触发按钮点击
    } else {
        console.log("没有找到按钮哦");
    }
})();

// 暴力禁止一切alert 屏蔽复制时弹窗
window.alert = function() {
    return false;
}

//---------------------------------------------------------------------------------------------------------------------------
if(isURL("moeshare.cc/u.php")||isURL("moeshare.ml/u.php")){
    //萌享
    if(window.find("已签到")){
        return;
    }

    if(window.find("每日打卡")){
        setTimeout(function(){
            $("#punch").click();
            return;
        }, 2000);
        return;
    }
}

//=====================================================================================
if(isURL("qianbai")||isURL("qianmo")){
    //仟佰星云ssr
    setTimeout(function(){
        if(window.find(" 點我簽到 ")){
            $("#checkin").click();
            return;
        }
    }, 2000);
    return;
}
//=====================================================================================
if(isURL("qianmo")){
    //仟佰星云ssr
    setTimeout(function(){
        if(window.find("点我签到")){
            $("#checkin").click();
            return;
        }
    }, 2000);
    return;
}




//=====================================================================================
if(isURL("idanmu")){
    //爱弹幕

    setTimeout(function(){
        document.querySelector(".Tappable-inactive.tool.tool-sign").click();
        $("span.Tappable-inactive.tool.tool-sign");
        $("div.tool-container");

        if(window.find("签到")){
            $("签到.tool-container").click();

            $("span : contains('签到')")
            $("div : has(span)")
            return;
        }
    }, 2000);
    return;
}

//Tappable-inactive tool tool-sign
//---------------------------------------------------------------------------------------------------------------------------
//
// if(isURL("plugin.php?id=np_cliworkdz:work")){
//     //天使论坛打工
// jQuery(document).ready(function($){
//     setTimeout(function(){$('#advids div:eq(0) a').click();}, 300);
//     setTimeout(function(){$('#advids div:eq(1) a').click();}, 600);
//     setTimeout(function(){$('#advids div:eq(2) a').click();}, 900);
//     setTimeout(function(){$('#advids div:eq(3) a').click();}, 1200);
//     setTimeout(function(){$('#advids div:eq(4) a').click();}, 1500);
//     setTimeout(function(){$('#advids div:eq(5) a').click();}, 1800);

//     setTimeout(function(){$('#stopad a').click();}, 2000);
// });
// }
//
//
if(isURL("www.acgke.com/thread-2-1-1.html")){
    //次元客抢码脚本,抢到后就可以删除了,没必要保留---------------------------------------------------------------------------------------------------
    setTimeout(function(){
        if(window.find("已售完")){
            //alert("已售完了,迟点再试试吧.");

            return;
        }
        else
        {alert("补货了,快去抢啊.");

         return;}
    }, 5000);
    return;
}
//
//
//
//
//
//
//---------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("seikuu.com/plugin.php?id=dsu_paulsign:sign")){
    //星空
    var p = {
        elements: ['.tr3 > div:nth-child(2) > a:nth-child(1) > img:nth-child(1)']
    };
    qd4();
}
//-------------------------------------------------------------------
if(isURL("xiaomantu.com")){
    //     //小蛮兔
    // alert("脚本到这里是生效的");
    setTimeout(function(){
        document.querySelector(".signin").click();
        //     var spans = document.querySelectorAll("span");
        // for(var i =0;i<spans.length;i++){
        //     var si = spans[i];
        //     if(si.innerHTML == "签到"){
        //         alert("脚本到这里是生效的");
        //         si.click = function(){
        //             // TODO
        //         }
        //     }
        // }
    }, 3000);

    //     $(function(){
    //         $(".site_bar.signin").click
    //         $(".site_bar.signin").click(function(){
    //             alert(1)
    //         })
    //     })

}

//---------------------------------------------------------------------------------------------------------------------------
if(isURL("gscq.me")){
    //乐赏电影网站
    setTimeout(function(){
        //         if(window.find("每日签到")){
        //             var qiandao1 = document.getElementById("sign.nav-link");
        if(window.find("签到")){
            var qiandao1 = document.getElementById("sign_title");
            qiandao1.click();
            return;
        }
    }, 3000);
    return;
}



//---------------------------------------------------------------------------------------------------------------------------
if(isURL("humblebundle.com")){
    //humble喜加一
    setTimeout(function(){
        if(window.find("free")){
            alert("有喜加一了");
            return;
        }
    }, 10000);
    return;
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("www.chinapyg.com/forum.php")){
    //飘云阁
    if(window.find("签到领奖!")){
        self.location='https://www.chinapyg.com/plugin.php?id=dsu_paulsign:sign&3b72c0ad';
        return;
    }
    qd();
    return;
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("swbbsc.com")){
    //机械工程师论坛 solidworks 不是为了确定,是为了去反广告弹窗
    setTimeout(function(){
        //alert("脚本到这里是生效的");
        if(window.find("检测到您安装")){
            $('button#basubmit.pn.pnc').click();
            return;
        }
    }, 3000);
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("wnflb2020.com")){
    //福利吧
    qd10();
    return;
}

//---------------------------------------------------------------------------------------------------------------------------
if(isURL("jkforum.net/plugin/?id=dsu_paulsign:sign")||isURL("jkforum.net/plugin.php?id=dsu_paulsign:sign")||isURL("jkforum.net//plugin/?id=dsu_paulsign:sign")){
    //捷克论坛
    if(window.find("您今天已經簽到過了")){
        return;
    }
    if(window.find("今天簽到了嗎")){
        qd6();
        return;
    }
    return;
}

//---------------------------------------------------------------------------------------------------------------------------

if(isURL("lalulalu.com/plugin.php?id=rs_sign:sign")){
    //香港lalulalu
    //     alert("现在在lalulalu网站");
    if(window.find("個人中心")&&window.find("退出")){
        //         alert("现在在lalulalu的签到页面");
        qd7();
        setTimeout(function(){
            if(window.find("您今天已經簽到過了")){
                //                 alert("签到了");
                self.location='http://www.lalulalu.com/';
                return;
            }
        }, 8000);


        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("521gal.com")){
    //52h5 h5表区

    qd2();
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("h5dm.com/")){
    //52h5 h5里区
    qd11();
}
//---------------------------------------------------------------------------------------------------------------------------

if(isURL("cnscg.com/")){
    //圣城家园
    qd02();
    //

    if(isURL("www.cnscg.com/plugin.php?id=dsu_paulsign:sign")){
        //圣城家园
        if (window.find("您今天已经签到过了或者签到时间还未开始")){
            self.location='http://www.cnscg.com/plugin.php?id=luckypacket:luckypacket';
            qiandao1.click();
            return;
        }
    }
    //
    if (window.find("红包领取成功")||window.find("您的红包已经领")||window.find("对不起")){     //                这里用   "或"   来判断红包领取状态.
        //            var b =""
        //            b = b+"1"
        //            alert(b);
        //         setTimeout(function(){
        self.location='';
        //         }, 200);
    }

    if (window.find("每日早安包")&&window.find("领取")){
        setTimeout(function(){
            //      var a = document.getElementsByTagName("BUTTON");
            //             for (var i = 0; i < a.length; i++) {
            //                 if(a[i].innerHTML=="领取")
            //                     alert("找到!");
            //             }
            $(".plist button").click();      //                           点击class为plist内的所有button
            //      $(":button").click();   //                            点击所有button
        }, 3000);

        //         }

        return;
    }
}


//---------------------------------------------------------------------------------------------------------------------------
if(isURL("hyacg.com/")){
    //hyyo
    if(window.find("√已签到")){
        return;
    }
    if (window.find("立即签到")){
        var qiandao1 = document.getElementById("an_sign");
        qiandao1.click();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("https://bbs4.2djgame.net/home/home.php?mod=task")){
    //2DJGAME
    if(window.find("2djgame")&&window.find("每日簽到！")){
        $('a [alt="apply"]').click();
        //$("td.bbda a").click();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://mcyacg.com/plugin.php?id=easysign")){
    //梦次元
    if(window.find("签到成功")){
        return;
    }
    else if(window.find("点击签到")){
        $("#easysign").click();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://www.oko.co/forum-180-1.html")){
    //萌子島
    if(window.find("今日已签到")){
        return;
    }
    else if(window.find("立即签到")){
        $(".do_sign").click();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("dxdbbb.com")||isURL("dommdo.com")){
    //萌子島
    if(window.find("今日已签到")){

        return;
    }
    else if(window.find("立即签到")){

        $(".do_sign").click();

        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("gmgard.com/")){
    //紳士の庭
    if(window.find("已签到")){
        return;
    }
    else if(window.find("点此签到")){
        $("#checkw").click();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("-plus.net/plugin.php?H_name-tasks.html")){
    //魂+ 接任务
    //思路是接两个任务,之后跳转到领取奖励页面,再点击按钮.
    var renwu = 1;
    qd5();
    return;
}

//---------------------------------------------------------------------------------------------------------------------------
if(isURL("-plus.net/plugin.php?H_name-tasks-actions-newtasks.html.html")){
    //魂+  领任务
    var renwu = 2;
    qd5();
    return;
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://n5m6.com/dsu_paulsign-sign.html")){
    //n5m6
    qd01();
    return;
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("https://www.manhuabudang.com/u.php")){
    //漫画补档
    if(window.find("已签到")){
        return;
    }
    if(window.find("每日打卡")){
        $("#punch").click();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("acfun.cn/member/#area=profile")){
    //a站
    //if(document.getElementById("btn-sign-user")){
    //存在
    // alert("脚本到这里是生效的");
    //}
    qd8();
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://www.manhuabu.com/")){
    //漫画簿
    if(window.find("已签到")){
        return;
    }
    if(window.find("签到")){
        $(".sign").click();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://user.youku.com/page/usc/index?spm=a2hww.20023042.uerCenter.5")){
    //优酷
    // $(".task-btn").click();
    self.location='http://actives.youku.com/task/show/index';
    // self.location='http://www.youku.com/';
    return;
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("www.52pojie.cn/home.php?mod=task&item=new")){
    //吾爱破解                              没完善
    $('#um  p a [align="absmiddle"]').click();
    //self.location='http://www.52pojie.cn/';
    //$('#um p a [align="absmiddle"]:first-child').click();
    //  alert("准备跳到qd9");
    //qd9();
    //alert("回来了");
    setTimeout(function(){
        //if(window.find("https://www.52pojie.cn/static/image/common/wbs.png")){

        window.location.href="https://www.52pojie.cn/forum-66-1.html";
        //   }
        //alert("返回");
    }, 5000);
    return;
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://bbs.ruanfenquan.com")){
    //软粉网
    if(window.find("签到可以获得额外基金")){
        $("button.pn").click();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://bbs.wfun.com")){
    //wfun
    if(window.find("现在可签到")){
        $("#signtxt").click();
        qd0();
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://bbs.houdao.com")){
    //猴岛
    var p = {
        elements: ['#houdaoSignClick']
    };
    qd3();
}
/*会重复签到
if(isURL("kafan.cn/")){
	//卡饭
        var p = {
		elements: ['a#pper_a']
	};
	qd3();
}
*/
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://www.emuijd.com/plugin.php?id=dsu_paulsign:sign")){
    //据点
    var p = {
        elements: ['.tr3 > div:nth-child(2) > a:nth-child(1) > img:nth-child(1)']
    };
    qd4();
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://www.gn00.com/plugin.php?id=dsu_paulsign:sign")){
    //技术宅
    var p = {
        elements: ['.tr3 > div:nth-child(2) > a:nth-child(1) > img:nth-child(1)']
    };
    qd4();

}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://cn.club.vmall.com/plugin.php?id=dsu_paulsign:sign")){
    //华为
    var p = {
        elements: ['a.sign-btn.btn_rs']
    };
    qd3();
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://bbs.wstx.com/plugin.php?id=dsu_paulsign:sign")){
    //外设天下
    var p = {
        elements: ['.tr3 > div:nth-child(2) > a:nth-child(1)']
    };
    qd4();
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://www.yeapk.com/plugin.php?id=mpage_sign:sign")){
    //夜安卓
    GM_xmlhttpRequest({
        method:'POST',
        url:'http://www.yeapk.com/plugin.php?id=mpage_sign:sign&inajax=1',
        //每次重新登陆都会生成一个新的表单hash值,请及时修改.......
        data:'formhash=f0122e6c&signsubmit=yes&handlekey=sign&moodid=1&content=123',
        headers:{
            //表单编码,表单默认的提交数据的格式
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function(responseDetails) {
            //alert(responseDetails.responseText);
        }
    });
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("tsdm.tw/")||isURL("tsdm.me/")||isURL("tsdm.love/")||isURL("tsdm.live/")){
    //天使论坛
    qd();
    //下面是天使论坛的自动打工
    /*    if(isURL("plugin.php?id=np_cliworkdz:work")){
    jQuery(document).ready(function($){
    setTimeout(function(){$('#advids div:eq(0) a').click();}, 500);
    setTimeout(function(){$('#advids div:eq(1) a').click();}, 3600);
    setTimeout(function(){$('#advids div:eq(2) a').click();}, 6900);
    setTimeout(function(){$('#advids div:eq(3) a').click();}, 10200);
    setTimeout(function(){$('#advids div:eq(4) a').click();}, 13500);
    setTimeout(function(){$('#advids div:eq(5) a').click();}, 16300);

    setTimeout(function(){$('#stopad a').click();}, 2000);
});
        return;
    }
*/
    if(window.find("签到领奖")){
        window.location.href="https://www.tsdm.live/plugin.php?id=dsu_paulsign:sign";
        return;
    }
}else if(isURL("kafan.cn")){
    //卡饭论坛
    qd2();
}else if(isURL("www.lightnovel.cn/home.php?mod=task")){
    //轻国
    if(window.find("每日任务")&&window.find("啪啪啪")){
        window.location.href="https://www.lightnovel.cn/home.php?mod=task&do=apply&id=98";
        return;
    }
}else{
    //其他论坛
    qd();
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://bbs.gfan.com/")){//机锋
    qd();
    if(window.find("签到领奖!")){
        window.location.href="http://bbs.gfan.com/plugin.php?id=dsu_paulsign:sign";
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://www.horou.com/")){//河洛
    qd();
    if(window.find("签到领奖!")){
        window.location.href="http://www.horou.com/plugin.php?id=dsu_paulsign:sign";
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
if(isURL("http://bbs.ntrqq.net/")){//NTRQQ
    qd();
    if(window.find("签到领奖!")){
        window.location.href="http://bbs.ntrqq.net/plugin.php?id=dsu_paulsign:sign";
        return;
    }
}
//---------------------------------------------------------------------------------------------------------------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function isURL(x){
    if(window.location.href.indexOf(x)!=-1){
        return true;
    }else{
        return false;
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd0
function qd0(){               //wfun签到
    setTimeout(function(){
        //alert("脚本到这里是生效的");
        var text = document.getElementById("ch_s");
        var text2 = document.getElementById("todaysay");
        if(text==null){
            return;
        }
        text.setAttribute('checked',true);
        text2.value = "来签到啦,爽~";
        var button = document.getElementById("qiandao");
        button.submit();
        return;
    }, 5000);
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd01
function qd01(){             //n5m6 ,不需要填文字的
    if(window.find("今天签到了吗")&&window.find("心情图片并写")){
        var text = document.getElementById("ch_s");
        //var text2 = document.getElementById("todaysay");
        if(text==null){
            return;
        }
        text.setAttribute('checked',true);
        //text2.value = "全自动签到,就是爽~";
        $(".btn").click();
        var button = document.getElementById("qiandao");
        button.submit();
        return;
    }
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd02
function qd02(){             //不需要填文字的签到
    //setTimeout(function(){
    if(window.find("今天签到了吗")&&window.find("选择您此刻的心情图片")){
        var text = document.getElementById("ng_s");
        text.setAttribute('checked',true);
        text.click();
        $(".btn").click();
        var button = document.getElementById("qiandao");
        button.submit();
        return;
        /*
           $('ng_s').click();
            var text2 = document.getElementById("todaysay");
            if(text2==null){
                alert("没参数");
                return;
            }
            text2.value = "签到啦,开心哦~";
            var button = document.getElementById("qiandao");
            button.submit();
            return;*/
    }
    // }, 3000);
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd
function qd(){
    if(window.find("今天签到了吗")&&window.find("请选择您此刻的心情图片并写下今天最想说的话")){
        var text = document.getElementById("ch_s");                    //愤怒表情id为ch_s
        var text2 = document.getElementById("todaysay");               //签到内容栏id为todaysay
        if(text==null){                                               //判定表情愤怒是存在的再执行下面操作,否则返回
            return;
        }
        text.setAttribute('checked',true);                            //把愤怒参数写如原来的checked里面,并表示true,    效果是点击愤怒表情
        text2.value = "签到啦,嘎嘎~";                                 //在签到内容栏里提交     "签到啦,嘎嘎~"       这些内容.
        var button = document.getElementById("qiandao");              //赋值id内容为qiandao为button
        button.submit();                                              //提交button按钮           就是点击签到的效果
        return;
    }
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd2
function qd2(){
    var imgs = document.getElementById("pper_a").getElementsByTagName("IMG");
    if(imgs[0].src.indexOf("wb.png")==-1){
        var a = document.getElementById("pper_a");;
        a.onclick();
        return;
    }
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd3
function qd3(){
    var elements = p.elements, i = 0;
    setTimeout(function(){
        try {
            if(elements instanceof Array) var els = p.elements;
            else {//function
                var els = p.elements();
            }
            while(els[i]){
                var obj = (p.elements instanceof Array)?document.querySelector(els[i]):els[i];
                if(obj == null) return;
                if(obj.tagName=="A" && obj.href.indexOf("javascript")<0 && obj.onclick == "undefined") GM_openInTab(obj.href);
                else obj.click();
                i++;
            }
        } catch(e){alert(e);}
    }, 400);
    setTimeout(function(){
        if(autoClose) window.close();
    }, delay+100);
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd4
function qd4(){
    var elements = p.elements, i = 0;

    setTimeout(function(){
        var obj1 = document.getElementById("kx");
        obj1.click();
        try {
            if(elements instanceof Array) var els = p.elements;
            else {//function
                var els = p.elements();
            }
            while(els[i]){
                var obj = (p.elements instanceof Array)?document.querySelector(els[i]):els[i];
                if(obj == null) return;
                if(obj.tagName=="A" && obj.href.indexOf("javascript")<0 && obj.onclick == "undefined") GM_openInTab(obj.href);
                else obj.click();
                i++;
            }
        } catch(e){alert(e);}
    }, 400);
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd5
function qd5(){      //魂+
    if(renwu ==1){
        $("#p_15 a").click();
        $("#p_14 a").click();
        setTimeout(function(){
            window.location.href="http://www.spring-plus.net/plugin.php?H_name-tasks-actions-newtasks.html.html";
            //alert("返回");
        }, 2000);
        return;
    }
    else if(renwu ==2){
        // alert("返回");
        $("#both_15 a").click();
        $("#both_14 a").click();
        return;
    }
    return;
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd6
function qd6(){
    if(window.find("請選擇您此刻的心情圖片")){
        setTimeout(function(){
            var text = document.getElementById("kx_s");
            var text2 = document.getElementById("todaysay");
            if(text==null){
                alert("没参数");
                return;
            }
            //text.setAttribute('checked',true);
            text2.value = "簽到啦,happy哦~";
            text.click();
            var button = document.getElementById("qiandao");
            button.submit();             //submit有提交内容的作用
            return;
        }, 3000);
    }
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd7
function qd7(){
    if(window.find("LaluLalu 論壇")&&window.find("今天簽到了嗎")){
        setTimeout(function(){
            $('.qdsmile [value="kx"]' ).click();
            var text2 = document.getElementById("todaysay");
            if(text2==null){
                alert("没参数");
                return;
            }
            text2.value = "签到啦,开心哦~";
            var button = document.getElementById("qiandao");
            button.submit();
            return;
        }, 2500);
    }
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd8

function qd8(){         //a站 等1.5秒再点击按钮
    var a = document.getElementById("btn-sign-user");
    setTimeout(function(){
        //alert("定时2秒");
        a.click();
        return;
    }, 5000);
    a.click();
    return;
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd9

function qd9(){                        //吾爱破解签到后跳转回主页
    /*   var imgs = document.getElementById("um").getElementsByTagName("IMG");
    var asda = imgs[imgs.length - 1].getAttribute('img');
    $("#um p img:last");
    $("a[class=active]:last");
   //var imgs = document.getElementsById("um").getElementsByTagName("IMG");
    alert(asda);
    if(imgs[0].src.indexOf("wbs.png")==-1){
        //var a = document.getElementById("pper_a");;
        //a.onclick();
        alert("还没有签到aaaaaaaaaaaaaaaaaaaaaa");
        $('#um  p a [align="absmiddle"]').click();
        return;
    }*/
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd10
//福利吧
function qd10(){
    var imgs = document.getElementById("fx_checkin_topb").getElementsByTagName("img");
    if(imgs[0].src.indexOf("mini2.gif")==-1){
        var a = document.getElementById("fx_checkin_topb");;
        a.onclick();
        //alert("还没有签到");
        setTimeout(function(){
            // if(window.find("提示信息")&&window.find("签到成功")){
            // if(window.find("已签到")){
            $("#fwin_dialog_submit").click();
            setTimeout(function(){
                window.location.href="http://www.wnflb2020.com/forum.php?mod=forumdisplay&fid=2&filter=author&orderby=dateline";
                //alert("返回");
            }, 2500);
            //  }
        }, 3500);
    }
    return;
}
if(imgs[0].src.indexOf("mini2.gif")!=-1){
    //alert("已经签到了");

    return;
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd11
function qd11(){
    if(window.find("今天签到了吗")&&window.find("温馨提示:今日未签到")){
        setTimeout(function(){
            $('.qdsmile [value="kx"]' ).click();
            var text2 = document.getElementById("todaysay");
            if(text2==null){
                alert("没参数");
                return;
            }
            text2.value = "签到啦,开心哦~";
            var button = document.getElementById("qiandao");
            button.submit();
            return;
        }, 2500);
    }
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>qd12
function qd12(){
    if(window.find("圣城首页")&&window.find("今天签到了吗？")){
        setTimeout(function(){
            $('li#kx' ).click();
            var text2 = document.getElementById("todaysay");
            if(text2==null){
                alert("没参数");
                return;
            }
            text2.value = "签到啦,开心哦~";
            var button = document.getElementById("qiandao");
            button.submit();
            return;
        }, 2500);
    }
}