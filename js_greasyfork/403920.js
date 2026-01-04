// ==UserScript==
// @name         twitter自动取关
// @description  twitterr自动取消关注
// @version      1.3
// @namespace   https://space.bilibili.com/482343
// @author      古海沉舟
// @license     古海沉舟
// @include      https://twitter.com/*
// @exclude https://twitter.com/
// @exclude https://twitter.com/home
// @require https://greasyfork.org/scripts/426194-toast-js/code/toastjs.js
// @grant        window.close
// @grant GM_setValue
// @grant GM_getValue
// @grant        GM_openInTab
// @grant GM_addValueChangeListener
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/403920/twitter%E8%87%AA%E5%8A%A8%E5%8F%96%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/403920/twitter%E8%87%AA%E5%8A%A8%E5%8F%96%E5%85%B3.meta.js
// ==/UserScript==
var sy = 10; //推文数量小于sy个自动取关
var sjdy = 130; //最新推特发布时间大于sjdy天自动取关
var ddsc=5;
var ziji = GM_getValue("ziji", "在这里输入自己的推特名");
var timen = 0;
var gzlb = GM_getValue("follow", []);
var fqlb = GM_getValue("buquguanliebiao", []);
var qglb = GM_getValue("quguanliebiao", []);
var gzsl = gzlb.length;
var isStart=false;
GM_setValue("ziji", ziji);
var a, e, i, oa, j, sj, sjj, z = 1,
    zzz = 0,
    fl, debugx = 1,
    kk = 0,
    gz, mz, xh = 5000,
    oi, yyy = 0,
    zg = 0;
var ttt,rs;

function lg(){
  console.log.apply(console,arguments);
}

function gb() {
  zzz = 1;
  window.close();
}


//num9 切换
function keydown(event) {
  function openOneFollower() {
    if (gzlb.length < 1 || !isStart) {
      return;
    }
    console.log("剩余 ", gzlb.length, " 个，已处理 ", zi, "个 ：", gzlb[0]);
    cocoMessage.success("剩余 "+gzlb.length+" 个，已处理 "+ zi+"个 ："+gzlb[gzlb.length-1],10000);
    setTimeout(function (){
      var ntab=GM_openInTab(gzlb[gzlb.length-1],{ active: true, insert: true, setParent :true });
    },2000);
    //window.open(gzlb[0],"_blank");
    zi++;
  }
  //console.log(event.keyCode);
  //105 num9
  var zi = 1;
  if (event.keyCode == 105) {
    isStart=!isStart;
    openOneFollower();
    GM_addValueChangeListener('follow', function (name, old_value, new_value, remote) {
      gzlb = new_value;
      openOneFollower();
    });
  }
}
document.addEventListener('keydown', keydown, false);

function qg() {
  if (zzz) return;
  gzlb = gzlb.filter(item => {
    return item != "https://twitter.com/" + mz;
  });
  GM_setValue("follow", gzlb);
  gz.click();
  qglb.push(mz);
  qglb = getUniq(qglb);
  GM_setValue("quguanliebiao", qglb);
  console.log(mz, "  取关", "     ", gz);
  var xx = setInterval(function () {
    e = document.querySelectorAll("div > span > span");
    j = 0;
    for (i = 0; i < e.length; i++) {
      if (e[i].innerText == "取消关注") {
        j = i;
        break;
      }
    }
    if (j > 0) {
      e[j].click();
      gb();
      clearInterval(xx);
      return;
    }
  }, 1000);
  }

function bqg() {
  gzlb = gzlb.filter(item => {
    return item != "https://twitter.com/" + mz;
  });
  GM_setValue("follow", gzlb);
  fqlb.push(mz);
  fqlb = getUniq(fqlb);
  GM_setValue("buquguanliebiao", fqlb);
  console.log(mz, "  不取关");
  gb();
}

function pd() {
  //推文数量少于 sy 个自动取关
  e = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-kemksi.r-1kqtdi0.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div.css-1dbjc4n.r-aqfbo4.r-kemksi.r-1igl3o0.r-rull8r.r-qklmqi.r-gtdqiz.r-1gn8etr.r-1g40b8q > div.css-1dbjc4n.r-1loqt21.r-136ojw6 > div > div > div > div > div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci > div > div");
  if (e == null) return;
  oa = e.innerText.split(" 推文")[0];
  if (oa < sy) {
    console.log("推文数量:   ", oa, "  少于 ", sy, "  自动取关");
    cocoMessage.success("推文数量:   "+oa+"  少于 "+sy+"  自动取关",10000);
    qg();
    return;
  }
  //最新推特发布时间大于sjdy天自动取关
  i = 0;
  e = document.getElementsByTagName('time');
  if (e.length == 0) {
    zg++;
    console.log("未找到最近发推时间：", zg);
    if (zg > 10) {
      console.log("未找到最近发推时间大于10次，取关");
      cocoMessage.success("未找到最近发推时间大于10次，取关",10000);
      qg();
    }
    return;
  }
  for (oa = 0; oa < e.length; oa++) {
    i = new Date(e[oa].getAttribute("datetime"));
    j = new Date();
    fl = Math.floor((j - i) / 86400000);
    console.log("最新推特相差天数：", fl);
    cocoMessage.info("最新推特相差天数："+ fl,10000);
    if (fl < sjdy) {
      zzz = 1;
      bqg();
      return;
    }
  }
  console.log("最推发布时间大于 ", sjdy, " 天 自动取关");
  cocoMessage.success("最推发布时间大于 "+sjdy+" 天 自动取关",10000);
  qg();
}
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

function lb() {

  if (yyy > 100) {
    cocoMessage.destroyAll();
    lg("已添加完毕全部关注，结束脚本");
    cocoMessage.success("已添加完毕全部关注，结束脚本",10000000);
    clearInterval(ttt);
    return;
  }
  var tem = [];
  var yy;
  e = document.getElementsByClassName("css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1wbh5a2 r-dnmrzs r-1ny4l3l");
  for (i = e.length - 1; i > -1; i--) {
    if (e[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("aria-label") == "时间线：正在关注") {
      sj = e[i].href;
      sjj = sj.split(".com/")[1];
      if (sjj == ziji) continue;
      e[i].parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      kk++;
      tem.push(sj);
    }
  }
  gzlb.push.apply(gzlb, tem);
  gzlb = getUniq(gzlb);
  yy = gzlb.length - gzsl;
  var sx="已处理 "+ kk+ " 个        本次扫描新增 "+yy+ " 个。 ";
  lg(sx, tem);
  cocoMessage.success(sx,5000);
  if (yy < 1) {
    yyy++;
  } else {
    yyy = 0;
  }
  GM_setValue("follow", gzlb);
  gzsl = gzlb.length;
  GM_setValue("num", gzsl);
  /*
     if (yyy > 100) {
          cocoMessage.destroyAll();
          lg("已添加完毕全部关注，结束脚本");
          cocoMessage.success("已添加完毕全部关注，结束脚本",10000000);
          clearInterval(ttt);
          return;
     }
    var tem = new Array();
    var yy = 1;
    e = document.getElementsByClassName("css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1wbh5a2 r-dnmrzs r-1ny4l3l");
    for (i = 0; i < e.length; i++) {
        if (e[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("aria-label") == "时间线：正在关注") {
            sj = e[i].href;
            sjj = sj.split(".com/")[1]
            if (sjj == ziji) continue;
            //console.log("删除  ",e[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
            e[i].parentElement.parentElement.parentElement.parentElement.parentElement.remove();
            i--;
            //yyy=300;return;
            kk++;
            yy = 0;
            a = 0;
            for (j = 0; j < fqlb.length; j++) {
                if (fqlb[j] == sjj) {
                    a = 1;
                    break;
                }
            }
            if (a) continue;
            tem.push(sj);
            if (i >= e.length) break;
        }
    }
    i = 1;
    console.log("已处理 ", kk, " 个        本次扫描新增 ", tem.length - 1, " 个。 ", tem);
    if (yy) {
        yyy++
    } else {
        yyy = 0
    }
    if (tem.length < 2) {
        xh = 100
    } else {
        xh = (tem.length - 1) * ddsc * 1000
    };
    gzlb.push.apply(gzlb, tem);
    gzlb = getUniq(gzlb);
    GM_setValue("follow", gzlb);*/
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

function ks() {
  cocoMessage.destroyAll();
  var zz = 0;
  mz = location.href;
  var nz = mz.split(".com/")[1];
  if (mz.indexOf(".com/following") > -1 || mz.indexOf(ziji+"/following") > -1) {
    tj();
    var inq = setInterval(function () {
      if (mz != location.href) {
        clearInterval(rs);
        clearInterval(ttt);
        clearInterval(inq);
        ks();
      }
    }, glt);
  }else{
    /*
if (mz.indexOf(ziji + "/following") > -1 || mz.indexOf("twitter.com/following") > -1) {
    console.log("已关注列表 打开模式");
    var rs = window.setInterval(function () {
        e = document.getElementsByClassName("css-1dbjc4n r-aqfbo4 r-zso239 r-1hycxz");
        for (i = 0; i < e.length; i++) {
            if (e[i].getAttribute("data-testid") == "sidebarColumn") {
                e[i].remove();
                clearInterval(rs);
            }
        }
    }, 500);
    lb();
    document.documentElement.scrollTop += 100000;
    var ttt = window.setInterval(function () {
        //if (yyy>200){console.log("已处理完毕，结束脚本"); clearInterval(ttt);return;}
        lb();
        document.documentElement.scrollTop += 100000;
        if (oi == 10) {
            document.documentElement.scrollTop = 0;
            oi = 0;
        }
        oi++;
    }, xh);
    return;
};*/
    setTimeout(function () {
      let sx;
      var lim = 0;
      var int = setInterval(function () {
        lim++;
        if (zzz | lim > 20) {
          clearInterval(int);
          return;
        }
        e = location.href.split(".com/")[1];
        mz = e;
        if (e.indexOf("/") > -1 || e.indexOf("?") > -1 || e.indexOf("=") > -1 || e.indexOf(ziji) > -1) {
          zzz = 1;
          return;
        }
        fl = document.querySelector("#react-root > div > div > div.css-1dbjc4n > main > div > div > div > div.css-1dbjc4n > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n > div > div > div > div > div > span > span");

        if (debugx) console.log("判断  : ", fl);
        if (fl == null) {
          fl = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-kemksi.r-1kqtdi0.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div.css-1dbjc4n > div.css-18t94o4 > div > span > span");
          if (fl != null) {
            if (fl.innerText.indexOf("是，查看个人资料") > -1) {
              fl.click();
            }
          }
fl=document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-kemksi.r-1kqtdi0.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div > div.css-901oao.r-1fmj7o5.r-37j5jr> span")
          if (fl != null) {
            if (fl.innerText.indexOf("此账号不存在") > -1) {
              console.log("此账号不存在,取关");
              cocoMessage.success("此账号不存在,取关",5000);
              gz=fl;
              qg();
              setTimeout(gb(),1000);
            }
            if (fl.innerText.indexOf("账号已被冻结") > -1) {
              console.log("此账号已被冻结,取关");
              cocoMessage.success("此账号已被冻结,取关",5000);
              gz=fl;
              qg();
              setTimeout(gb(),1000);
            }
          }
          fl=document.querySelector("#react-root > div > div > div.css-1dbjc4n > main > div > div > div > div.css-1dbjc4n.r-kemksi > div > div:nth-child(2) > div > div.css-18t94o4.css-1dbjc4n > div > span > span");
          if (fl != null) {
            console.log("点击重试");
            location.href=location.href+"";
          }
          return;
        }
        if (fl.innerText.indexOf("正在关注") < 0) {
          gzlb = gzlb.filter(item => {
            return item != "https://twitter.com/" + mz;
          });
          GM_setValue("follow", gzlb);
          qglb.push(mz);
          qglb = getUniq(qglb);
          GM_setValue("quguanliebiao", qglb);
          sx=mz+"   取关   "+gz;
          console.log(mz, "  取关", "     ", gz);
          cocoMessage.success(sx,5000);
          gb();
          return;
        }
        gz = fl;
        console.log("进行处理 ", mz, "      ", fl);
        cocoMessage.info("判断： "+mz,5000);
        pd();
        //clearInterval(int);
      }, 1000);
    }, 3000);
  }
}
setTimeout(function(){ks();},1000);