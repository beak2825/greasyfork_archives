// ==UserScript==
// @name        【自用】雪球
// @match       https://xueqiu.com/*
// @version     2021.10.29
// @author      heckles
// @description 链接当前页面打开
// @icon        https://github.com/favicon.ico
// @homepage    https://greasyfork.org/zh-CN/scripts/431835-%E8%87%AA%E7%94%A8-%E9%9B%AA%E7%90%83
// @namespace https://greasyfork.org/users/24050
// @downloadURL https://update.greasyfork.org/scripts/431835/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E9%9B%AA%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/431835/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E9%9B%AA%E7%90%83.meta.js
// ==/UserScript==


//1.1定义添加临时css的函数
function addStyle_imp(newStyle) { //增加新样式表【固定的】
    var styleElement = document.getElementById('imp');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'imp';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}


//1.2.1设置固定的css
const cusCSS = `
/*减淡其他信息*/
.optional__tb {
    color:rgba(0,0,0,0.4) !important;
}
/*自选股名称加粗*/
td a.name {
   color:rgba(0,0,0,0.65);
   font-weight: bold !important;
}
.nav.stickyFixed.nav__dynamic{
    background: #1369bf !important;
}

`
const btnanmi =`
/*隐藏复选框元素，使用label标签元素进行切换*/
#switch_ads,
#switch_imp{
  width: 0;
  height: 0;
  visibility: hidden;
}
/*创建开关的主体，可移动球块以外的部分*/
label.switchX {
  display:inline-block;
  vertical-align: middle;
  width: 38px;
  height: 21px;
  background-color: rgba(0,0,0,0.2);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: 0.1s;
  box-shadow: 0 0 2px #477a8550;
}
 /*创建切换球*/
label.switchX::after {
  content: "";
  width: 11px;
  height: 11px;
  background-color: rgba(255,255,255,0.6);
  position: absolute;
  border-radius: 6px;
  top: 5px;
  left: 5px;
  transition: 0.2s;
}
 /*当复选框被选中时，球应向右移动*/
input:checked + label.switchX:after {
   left: calc(100% - 5px);
   transform: translateX(-100%);
   background-color: rgba(255,255,255,0.95);
}
 /*改变按钮切换时的背景*/
input:checked + label.switchX {
   background-color: rgba(0,0,0,0.3);
}
 /*磁性效果，就是暂时拉伸，按住鼠标就发现了*/
label.switchX:active:after {
    width: 11px;
}
`
//1.2.2添加持续生效的css
function addPermernantStyle(newStyle) { //增加新样式表【固定的】
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}
addPermernantStyle(cusCSS);
addPermernantStyle(btnanmi);

//1.3.3设置用于当前页面显示的iframe及配套bg
const cssframe = `
    right: 0px;
    top: -1px;
    position: fixed;
    width: 68%;
    background-color:#fff;
    z-index:999999;
`
const cssnewsfbg = `
    top: 0px;
    left: 0px;
    position: fixed;
    width: 100%;
    background-color:rgba(0,0,0,0.8);
    z-index:0;
`


//创建iframe
var newsframe = document.createElement("iframe");
    newsframe.name = "newsframeName";
    newsframe.id = "newss";
    newsframe.setAttribute("frameborder", "no");
  //newsframe.setAttribute("security","restricted");//加这两条，避免被引用页的强制跳转
    newsframe.setAttribute("sandbox","allow-same-origin allow-scripts");//加这两条，避免被引用页的强制跳转，允许脚本，但不允许allow-top-navigation，https://xueqiu.com/S/00700/197439434     https://xueqiu.com/S/SZ002594/197460952
    newsframe.style.height = "0";
var newsfbg = document.createElement("div");
    newsfbg.id = "newsfbg";
    newsfbg.style.height = "0";

document.body.appendChild(newsfbg);
newsfbg.appendChild(newsframe);

//2开始执行了【判断目标元素已经加载】
if (window.location.href.indexOf("xueqiu.com/S") < 0) {
    var Waitforindex = setInterval(function () { //间隔执行
      console.log("间隔1秒尝试");
        if (document.querySelector("td .name") && document.querySelector("div.today-topic__container.board")) {
      console.log("开始执行各函数");
            clearInterval(Waitforindex);
            StartJsIndex();
            //dvdelne();
            StartmarkL();
            layout();
        }
    }, 1000); //间隔时间，毫秒
} else {
    StartJsGp();
}
//2.1定义按钮（用于切换布局，隐藏/显示垃圾信息）
function layout() {
    //var targ = document.querySelector("a[innerHTML='发帖']");    //没法用innerHTML的内容来queryselect，因为目标元素的所有父元素都包含这个内容
    //var targ = document.querySelector(".nav__btn--longtext a[href='javascript:;']");  //这样倒是可以
    var adremove = document.createElement("span");
        adremove.style.cssText = "margin-left:10px;display:inline-block;";
        adremove.innerHTML = "\<input type=\"checkbox\" name=\"switch\" id=\"switch_ads\" class=\"switch\"\>\<label class=\"switchX\" for=\"switch_ads\"\>\<\/label\>";
    document.querySelector("div.signed_container div.nav__lf").appendChild(adremove);
    adremove.querySelector("#switch_ads").onclick = function () {
        getel();//偶尔失效时临时救急用
        var xx = document.querySelector("div.home__col--rt ul.home__business").style.display;
        switch (xx) {
        case "block":
            xx = "none";
            break;
        case "none":
            xx = "block";
            break;
        default:
            xx = "none";
        }
        document.querySelector("div.home__col--rt ul.home__business").style.display = xx;
        document.querySelector("div.home__col--rt div.info-report-wrap").style.display = xx;
        if(xx = "block"){document.querySelector(".today-topic__container.board").style.marginTop = "0";}
        if(xx = "none"){document.querySelector(".today-topic__container.board").style.marginTop = "-15px";}

    }
    adremove.querySelector("#switch_ads").click(); //模拟点击一下
    //document.querySelector("div#snb_im i.iconfont.im__expand").click();//模拟点击一下,隐藏聊天
}
//2.2定义分隔线，不好看，暂时备用
function dvdelne() {
    var zichiRowtd = document.querySelector("a[href='/S/SZ159967']").parentNode.parentNode.querySelectorAll("td"); //.previousSibling .nextSibling
    var zhishuRowtd = document.querySelector("a[href='/S/SH000016']").parentNode.parentNode.querySelectorAll("td");
    for (var i = 0; i < zichiRowtd.length; i++) {
        zichiRowtd[i].style.borderTop = "2px solid rgba(19, 105, 191, 0.8)"; //querySelectorAll选一群，然后一起设置style不行
    }
    for (var i = 0; i < zhishuRowtd.length; i++) {
        zhishuRowtd[i].style.borderTop = "2px solid rgba(19, 105, 191, 0.8)"; //querySelectorAll选一群，然后一起设置style不行
    }
}
//2.3给持仓股加标识
function StartmarkL() {
  //先定义一个加class的函数
  function markL () {
        document.querySelector("a[href='/S/SZ159967']").parentNode.setAttribute("class", "zczq");
        document.querySelector("a[href='/S/SZ159949']").parentNode.setAttribute("class", "zczq");
        document.querySelector("a[href='/S/SZ159915']").parentNode.setAttribute("class", "zczq");
        document.querySelector("a[href='/S/SH512170']").parentNode.setAttribute("class", "zczq");
        document.querySelector("a[href='/S/SH588000']").parentNode.setAttribute("class", "zczq");
        document.querySelector("a[href='/S/SH512290']").parentNode.setAttribute("class", "zczq");
        document.querySelector("a[href='/S/SH515030']").parentNode.setAttribute("class", "zczq");
        document.querySelector("a[href='/S/SH513050']").parentNode.setAttribute("class", "zczq");
        //document.querySelector("a[href='/S/SH510500']").parentNode.setAttribute("class", "zczq");
        addPermernantStyle("td.zczq{border-left:2px solid rgba(19, 105, 191, 0.8);}");
        getel();
  }
  //执行一次  
  markL();
  //定义一个【等待>>执行】函数    
  function waitX(selector,funcNAME) {
    var markX = setInterval(function(){ //间隔执行
      if (document.querySelector(selector) ) {
        clearInterval(markX);
        return false;
      }else{
        eval(funcNAME+'()');//通过y来实现，function func()或者func()会报错，function  func(){}
      }
    }, 1000); //间隔时间，毫秒
  }
  //给选定的元素增加事件，点击后执行【等待>>执行】函数
    document.querySelector("div#optional.optional div.optional__tabs__controls a").onclick = function(){waitX(".zczq","markL");};//自选股点击后
    document.querySelector("tr.sortable th.optional__reload").onclick = function(){waitX(".zczq","markL");};//刷新点击后
    document.querySelector("tr.sortable th.optional__category").onclick = function(){waitX(".zczq","markL");};//分组选择后

}

                
//2.4修改首页
function StartJsIndex() {
    console.log("开始修改首页");
    var alllist = document.querySelector("div.home-timeline div.home-timeline-tabs a");//先选“全部”，要不unred和readmore可能没有
    alllist.click();
    document.querySelector("div#optional.optional div.optional__tabs__controls a").click();
    //定义替换链接的函数，开放给全局，要不layout的函数调用不了
    getel = function () {
        container = document.querySelector(".user__container"); //这里的规则需要按网站修改
        dir_links1 = "td .name"; //股票列表里的名称   
        dir_links2 = ".home__stock-index__item"; //最上面的股指
        dir_links3 = "div.stock-hot__container.board table.stock-hot__list.board__list tr td a";//热门话题
        dir_links4 = "div.today-topic__list li a";//今日话题
        dir_links5 = ".status-link";//网页链接（或有）
        dir_links6 = ".timeline__expand__control";//展开（或有）
        dir_links7 = ".timeline__live td a";//7x24的链接（或有）
        anchors1 = document.querySelectorAll(dir_links1); // + document.querySelectorAll(dir_links2);直接加不起作用
        anchors2 = document.querySelectorAll(dir_links2);
        anchors3 = document.querySelectorAll(dir_links3);
        anchors4 = document.querySelectorAll(dir_links4);
        anchors5 = document.querySelectorAll(dir_links5);
        anchors6 = document.querySelectorAll(dir_links6);
        anchors7 = document.querySelectorAll(dir_links7);
        //var anchors5 = document.getElementsByClassName("status-link");

        for (var i = 0; i < anchors1.length; i++) {
            //anchors[i].target = "newsframeName";
            anchors1[i].title="当前页面打开";
            anchors1[i].onclick = function () {
                zkgp(this);
                return false;
            }; //添加函数
        }
        for (var i = 0; i < anchors2.length; i++) {
            anchors2[i].title="当前页面打开";
            anchors2[i].onclick = function () {
                zkgp(this);
                return false;
            }; //添加函数
        }
        for (var i = 0; i < anchors3.length; i++) {
            anchors3[i].title="当前页面打开";
            anchors3[i].onclick = function () {
                zkgp(this);
                return false;
            }; //添加函数
        }
        for (var i = 0; i < anchors4.length; i++) {
            anchors4[i].title="当前页面打开";
            anchors4[i].onclick = function () {
                zkgp(this);
                return false;
            }; //添加函数
        }
        for (var i = 0; i < anchors5.length; i++) {
            anchors5[i].title="当前页面打开";
            anchors5[i].onclick = function () {
                zkgp(this);
                return false;
            }; //添加函数
        }
        for (var i = 0; i < anchors6.length; i++) {
            anchors6[i].title="已执行";
            anchors6[i].onclick = function (){
              //setTimeout(function () {
                var xxt = this.parentNode.parentNode.querySelector(".status-link");
                xxt.title="当前页面打开";
                xxt.onclick = function(){//不能直接onclick=zkgp
                  zkgp(xxt);
                  return false;
                }
                //},1*1000); //等1秒钟之后执行              
            } //添加函数
        }
        for (var i = 0; i < anchors7.length; i++) {
            anchors7[i].title="当前页面打开";
            anchors7[i].onclick = function () {
                zkgp(this);
                return false;
            }; //添加函数
        }
        //定义点击后执行展开页面的函数
        var zkgp = function (a) {
            newsframe.setAttribute("src", a.getAttribute("href"));
            container.style.marginLeft = "0%";
            newsframe.style.cssText = cssframe + "height:100%;";
            newsfbg.style.cssText = cssnewsfbg + "height:100%;";
            newsfbg.style.zIndex = "999";
            var opnlk = document.createElement("a");
                    opnlk.style.cssText = "position:fixed;top:55px;right:30px;margin:2px 0px 2px 12px;width:70px;height:28px;z-index:99999999;font-size:13px;border:0px;background:transparent;color:#333;";
                    opnlk.innerHTML = "新页面打开";
                    opnlk.href = a.getAttribute("href");
                    opnlk.target = "_blank";
            document.body.appendChild(opnlk);
            document.body.style.overflow = "hidden";//禁止父元素滚动，比fixed强
          
            newsfbg.onclick = function () {
                newsfbg.style.width = "0px";
                newsframe.style.width = "0px";
                container.style.marginLeft = "auto";
                newsframe.setAttribute("src", "");
                opnlk.innerHTML = "";
                document.body.style.overflow = "";//恢复父元素滚动
            }
        }
    }
    //等关键元素加载后，开始替换
    var WaitforAlllist = setInterval(function () { //间隔执行，等alllist点击加载完毕（选取两个关键元素）
        if (document.querySelector(".status-link") && document.querySelector("a.home-timeline__unread")) {
            clearInterval(WaitforAlllist);
            getel();
        var unread = document.querySelector("a.home-timeline__unread");//加载【未读】后运行一遍  
        var readmore = document.querySelector("a.home__timeline__more");//加载【更多】后运行一遍
            readmore.onclick = function(){
              setTimeout(function(){
                getel();
              },2*1000); //等1秒钟之后执行
           }
            unread.onclick = function(){
              setTimeout(function(){
                getel();
              },2*1000); //等1秒钟之后执行
           }
        }
    }, 1000); //间隔时间，毫秒
    //向下滚动会增加元素，同步修改              
    window.onscroll = function () { //兼容写法   //只要滚动，就开始
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop; //滚动的数值，取首个为真的
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight;
        //console.log(document.documentElement.offsetHeight - 194, clientHeight, scrollTop);
        if (scrollTop >= (document.documentElement.offsetHeight - 194) - clientHeight) { // body的滚动高度>=html总高度-可视化窗口高度                 
            setTimeout(function () {
                getel();
                readmore.click();
            }, 1 * 1000); //等1秒钟之后执行
        }               
    }
    //7x24那边增加一个只显示重要信息的开关，同时为了避免切换后空白，模拟滚动，且即使反复切换也只执行一次
    var seven24 = document.querySelector("a.home__timeline__live__control");
        seven24.onclick = getel();
    var onlyimp = document.createElement("span");
        onlyimp.style.cssText = "margin-left:150px;margin-top:5px;display:inline-block;";
        onlyimp.innerHTML  = "\<input type=\"checkbox\" name=\"switch\" id=\"switch_imp\" class=\"switch\"\>\<label class=\"switchX\" for=\"switch_imp\"\>\<\/label\> ";
        seven24.parentNode.appendChild(onlyimp);
        onlyimp.querySelector("#switch_imp").onclick = function () {
             getel();
             if(!document.getElementById("imp")){
               addStyle_imp("div.timeline__live table.home__timeline-live__tb tr:not([class=\"highlight\"]){display:none;}");
             }else{
               document.getElementById("imp").remove();
             }      
        }
        document.getElementById("switch_imp").addEventListener("click", function(event){
               setTimeout("window.scrollBy(0,-10);",500);//500毫秒之后往下滚动1，模拟scroll，触发加载新内容       
               setTimeout("window.scrollBy(0,10);",600);//往上滚动1        
               setTimeout("window.scrollBy(0,-10);",700);//往下滚动1
               setTimeout("window.scrollBy(0,10);",1000);//往上滚动1
               getel();
        }, {once: true});//添加监听，只执行一次！！！！
     
}
//2.5个股详情页
function StartJsGp() {
    console.log("修改详情页");
    var article = document.querySelector(".container.article__container"); //这里的规则需要按网站修改 ◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀◀
    var articleBTN = document.querySelector(".status-link");
    //articleBTN.target = "newsframeName";
    articleBTN.onclick = function () {
        zkwl(this);
        return false;
    }; //添加函数;
    var zkwl = function (a) {
        newsframe.setAttribute("src", a.getAttribute("href"));
        article.style.marginLeft = "10%";
        newsframe.style.cssText = cssframe + "height:100%;";
        newsfbg.style.cssText = cssnewsfbg + "height:100%;";
        newsfbg.style.zIndex = "999";
        newsfbg.onclick = function () {
            newsfbg.style.width = "0px";
            newsframe.style.width = "0px";
            article.style.marginLeft = "auto";
            newsframe.setAttribute("src", "");
        }
    }

}
