// ==UserScript==
// @name         Twitter推特关注状态标志着色
// @description  Twitter推特根据ID对是否关注状态进行标志、着色
// @version      2.28
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @include      https://twitter.com/*
// @include      https://x.com/*
// @require https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require https://greasyfork.org/scripts/426194-toast-js/code/toastjs.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/420194/Twitter%E6%8E%A8%E7%89%B9%E5%85%B3%E6%B3%A8%E7%8A%B6%E6%80%81%E6%A0%87%E5%BF%97%E7%9D%80%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/420194/Twitter%E6%8E%A8%E7%89%B9%E5%85%B3%E6%B3%A8%E7%8A%B6%E6%80%81%E6%A0%87%E5%BF%97%E7%9D%80%E8%89%B2.meta.js
// ==/UserScript==
function lg(){
    console.log.apply(console,arguments);
}
var ziji = GM_getValue("self", "把这里改成自己的推特名");
var wgz = " 未关注 "; //未关注提示
wgz="";
var wgzc = "#f18282"; //未关注颜色
var ygz = " 已关注 "; //已关注提示
var ygzc = "#888"; //已关注颜色
var ycygz = 1; // 1为隐藏已关注ID，0不隐藏

var namee=`
div[data-testid="UserCell"] > div > div > div> div > div > div > div > a[href^="/"][role="link"]>div>div> span
,div[data-testid="User-Name"] > div > div > div> a[href^="/"][role="link"]>div> span
`;
var gzlb = GM_getValue("zfollow", new Array(""));
var gzsl = gzlb.length,namee2;
GM_setValue("self", ziji);
GM_setValue("num", gzsl);
GM_addValueChangeListener('zfollow', function (name, old_value, new_value, remote) {
    gzlb = new_value;
    gzsl = gzlb.length;
    ky=1;
})

var a, e, i, oa, j, sj, sjj,dz,mz,rs,ttt,
    fl, debugx = 1,
    kk = 0,
    ky=0,
    glt = 300,
    xh = 4000,
    yyy = 0;
mz = location.href;
var toObj = function (arr) {
    var obj = {};
    for (var temp in arr) {
        obj[arr[temp]] = true;
    }
    return obj;
};
var toArr = function (obj) {
    var arr = [];
    for (var temp in obj) {
        arr.push(temp);
    }
    return arr;
};
var getUniq = function (arr) {
    return toArr(toObj(arr));
};

function in_array(stringToSearch, arrayToSearch) {
    for (var s = 0; s < arrayToSearch.length; s++) {
        var thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}

function lb() {
    if (yyy > 100) {
        cocoMessage.destroyAll();
        lg("已添加完毕全部关注，结束脚本");
        cocoMessage.success("已添加完毕全部关注，结束脚本",10000000);
        clearInterval(ttt);
        return;
    }
    var tem = new Array();
    var yy;
    $(`a[role="link"][class="css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l r-1loqt21"]`).each(function(){
        console.log("判断",$(this))
        if ($(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().attr("aria-label") == "时间线：正在关注"){
            console.log("删除",$(this))
            sj = $(this)[0].href;
            sjj = sj.split(".com/")[1]
            if (sjj == ziji) return;
            $(this).parent().parent().parent().parent().parent().parent().parent().parent().remove();
            kk++;
            tem.push("@" + sjj);
        }
    })

    gzlb.push.apply(gzlb, tem);
    gzlb = getUniq(gzlb);
    yy = gzlb.length - gzsl;
    var sx="已处理 "+ kk+ " 个        本次扫描新增 "+yy+ " 个。 ";
    lg(sx, tem);
    cocoMessage.success(sx,3000);
    if (yy < 1) {
        yyy++
    } else {
        yyy = 0
    }
    GM_setValue("zfollow", gzlb);
    gzsl = gzlb.length;
    GM_setValue("num", gzsl);
}
function tj(){
    cocoMessage.destroyAll();
    lg("开始录入已关注列表，请保持页面在前台");
    cocoMessage.info("开始录入已关注列表，请保持页面在前台",1000000);
    var oi = 0;
    rs = window.setInterval(function () {
        e = document.getElementsByClassName("css-1dbjc4n r-aqfbo4 r-zso239 r-1hycxz");
        for (i = 0; i < e.length; i++) {
            if (e[i].getAttribute("data-testid") == "sidebarColumn") {
                e[i].remove();
                clearInterval(rs);
            }
        }
        if (mz != location.href) {
            clearInterval(rs);
            ks();
        }
    }, 500);
    lb();
    document.documentElement.scrollTop += 1000;
    ttt = window.setInterval(function () {
        lb();
        document.documentElement.scrollTop += 1000;
        if (mz != location.href) {
            clearInterval(ttt);
            ks();
        }
    }, xh);
    return;
}
function colorid(){
    //开始着色
    if (ky==1){
        namee2=namee;

    }else{
        namee2=namee.split(',').map(item=>item.replace(/(^\s*)|(\s*$)/g, "")+`:not([fi])`).join(',');
    }
    //console.log("查找 ",namee2);
    $(namee2).each(function(){
        //console.log("着色 ",$(this)[0]);
        var ot=$(this).text();
        $(this).attr("fi","1");
        $(this).css('white-space', 'pre');
        dz="@"+ot.split("@")[1];
        if (in_array(dz, gzlb)) {
            $(this).text(ygz + ot);
            $(this).css('color', ygzc);
            if (ycygz == 1) $(this).remove();
        } else {
            $(this).text(wgz + dz);
            $(this).css('color', wgzc);
        }
    })
    return;
}
function ks() {
    cocoMessage.destroyAll();
    var z = 1;
    var zz = 0;
    mz = location.href;
    var nz = mz.split(".com/")[1];
    if (mz.indexOf(".com/following") > -1 || mz.indexOf(ziji+"/following") > -1) {
        //num9 切换
        function keydown(event) {
            //lg(event.keyCode);
            //105 num9
            if (event.keyCode == 105) {
                tj();
            }
        }
        document.addEventListener('keydown', keydown, false);
        lg("着色状态关注页面待机中，按Num9 开始录入已关注列表");
        cocoMessage.info("着色状态关注页面待机中，点击此处 或 按Num9 开始录入已关注列表",1000000);
        $(".coco-msg.info").bind('click', function() {
            $(this).unbind('click');
            tj();
        });
        var inq = setInterval(function () {
            if (mz != location.href) {
                console.log("网址更改，重新加载着色");
                clearInterval(rs);
                clearInterval(ttt);
                clearInterval(inq);
                ks();
            }
        }, glt);
    } else {

        if (nz == null || nz.split("?")[0] == "home") {
            lg("着色状态开始,主页模式");
            var int = setInterval(function () {
                if (mz != location.href) {
                    clearInterval(int);
                    ks();
                }
                colorid();
                ky=0;
            }, glt);
        } else if (nz.indexOf("search?") > -1 || nz.indexOf("hashtag/") > -1) {
            lg("着色状态开始,搜索模式");
            var ine = setInterval(function () {
                if (mz != location.href) {
                    clearInterval(ine);
                    ks();
                }
                colorid();
                ky=0;
            }, glt);
        } else  {
            if (nz.indexOf("/")>-1 && nz.indexOf("/with_replies")<0 && nz.indexOf("/media")<0 && nz.indexOf("/likes")<0){
            lg("着色状态开始,只着色");
            int = setInterval(function () {
                if (mz != location.href) {
                    clearInterval(int);
                    ks();
                }
                colorid();
                ky=0;
            }, glt);
                return
            }
            lg("着色状态开始,个人页面模式");
            nz=nz.split("/")[0].split("?")[0];
            var kkk = 0;
            var inr = setInterval(function () {
                if (mz != location.href) {
                    clearInterval(inr);
                    ks();
                }
                colorid();
                if (nz != ziji && kkk == 0) {
                    $(`div[aria-label="主页时间线"] div>button[role="button"][aria-label*="关注"]`).each(function(){
                        //console.log("判断",$(this))
                        if ($(this).parent().attr("class").indexOf("r-6gpygo")<0){
                            //lg("找到下滚状态关注按钮",$(this));
                            kkk = 1;//kkk判断是否找到下滚状态关注按钮
                            $(this).unbind('click').click(function () {
                                lg("重新判断关注状态");
                                cocoMessage.info("重新判断关注状态",3000);
                                setTimeout(function () {
                                    z = 1;
                                }, 2200);
                            })
                        }
                    })
                }
                if (nz != ziji && z == 1) {
                    if (zz > 300) {
                        /*
                        z = 0;
                        lg("当前未关注 : ", "@" + nz);

                        if (in_array("@" + nz, gzlb)) {
                            gzlb = gzlb.filter(item => {
                                return item != "@" + nz;
                            })
                            GM_setValue("zfollow", gzlb);
                            gzsl = gzlb.length;
                            GM_setValue("num", gzsl);
                            lg("从关注列表中删除 ", "@" + nz);
                            cocoMessage.success("从关注列表中删除  @" + nz,3000);
                        }
                        return;
                        */
                    }
                    fl =document.querySelector(`div[aria-label="主页时间线"] div>button[role="button"][aria-label*="关注"]`);
                    if (fl == null) {
                        zz++;//判断是否载入关注按钮
                        return;
                    }
                    lg("关注按钮 :", fl);
                    $(fl).unbind('click').click(function () {
                        lg("重新判断关注状态");
                        cocoMessage.info("重新判断关注状态",3000);
                        setTimeout(function () {
                            z = 1;
                            ky = 1;
                        }, 2200);
                        setTimeout(function () {
                            z = 1;
                            ky = 1;
                        }, 4200);
                    })
                    z = 0;
                    if (fl.textContent.indexOf("正在关注") > -1 || fl.textContent.indexOf("取消关注") > -1) {
                        lg("当前已关注 : ", "@" + nz);
                        if (!in_array("@" + nz, gzlb)) {
                            gzlb.push("@" + nz);
                            GM_setValue("zfollow", gzlb);
                            gzsl = gzlb.length;
                            GM_setValue("num", gzsl);
                            lg("在关注列表中添加 ", "@" + nz);
                            cocoMessage.success("在关注列表中添加" + nz,3000);
                        }
                    } else {
                        if (nz=="i")return;
                        lg("当前未关注 : ", "@" + nz);
                        if (in_array("@" + nz, gzlb)) {
                            gzlb = gzlb.filter(item => {
                                return item != "@" + nz;
                            })
                            GM_setValue("zfollow", gzlb);
                            gzsl = gzlb.length;
                            GM_setValue("num", gzsl);
                            lg("从关注列表中删除 ", "@" + nz);
                            cocoMessage.warning("从关注列表中删除  @" + nz,3000);
                        }
                        return;
                    }
                }
                ky=0;
            }, glt);
        }

    }
}
setTimeout(function(){ks();},2000);