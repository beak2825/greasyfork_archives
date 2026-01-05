// ==UserScript==
// @name          V2EX_Good
// @description   V2EX Good，增强使用体验。
// @homepage      https://greasyfork.org/zh-CN/scripts/3452
// @namespace     yfmx746qpx8vhhmrgzt9s4cijmejj3tn
// @icon          https://favicon.yandex.net/favicon/www.v2ex.com
// @author        ejin@v2ex
// @match         https://*.v2ex.com/*
// @match         https://v2ex.com/*
// @version       2025.09.27
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/3452/V2EX_Good.user.js
// @updateURL https://update.greasyfork.org/scripts/3452/V2EX_Good.meta.js
// ==/UserScript==

//版权申明：使用此脚本的片段，请标注来源，作者：ejin@v2ex

// 2025.05.07 帖子中的图片添加背景，解决偶尔看不到加载失败图片
// 2025.05.03 按关键词屏蔽帖子中的垃圾回复。
// 2025.04.03 签到页显示上次签到铜币数，余额页面显示签到页链接
// 2025.04.03 各功能均改为异步执行，缩短脚本运行时间。
// 2025.03.30 原生代码实现签到功能，去除对jQuery库的依赖
// 2024.03.08 新消息界面，回复提醒对比感谢提醒更加醒目
// 2024.01.16 新消息界面，显示消息序号，页码链接显示序号范围
// 2023.12.27 避免链接转图片的大小超出布局
// 2019.05.12 新浪的图片反防盗链
// 2017.05.16 由于存储数据出错，改变存储数据的方式
// 2016.05.25 链接自动转图片
// 2016.05.21 新增召唤/呼叫管理员
// 2016.04.12 在回复时可@所有人
// 2015.10.16 新增在回复中标记楼主
// 2014.01.24 初版修改版


setTimeout(function(){

// 签到
setTimeout(() => {
    if (document.querySelector("a[href*='/settings'].top") !== null) {//已登陆
        var username = document.querySelector('a[href^="/member/"]').innerHTML;
        var today=new Date().toISOString().split("T")[0];
        var infobar = document.querySelector('#search');
        if(localStorage.signdate==today && localStorage.signuser==username && infobar){
            return;//已签到就结束
        }
        var days=0;//连续登陆天数
        //开始签到流程
        fetch("/").then(()=>{
            //document.querySelector("#search").style.fontSize="14px";
            infobar.value = "正在检测每日签到状态...";
            return fetch("/mission/daily");//继续继续，前往领取页面
        })
        .then(rsp => rsp.text()).then(data=>{
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            if(doc.querySelector('input[value^="领取"]')){//领取按钮存在，尝试领取
                infobar.value = "正在领取签到奖励..."
                var url=doc.querySelector('input[value^="领取"]').getAttribute('onclick').split("'")[1];
                //<input type="button" class="xxx" value="领取 X 铜币" onclick="location.href = '/mission/daily/redeem?once=12345';">
                return fetch(url)//继续继续，提交领取动作
            } else {//按钮不存在
                if (data.indexOf("已领取") != -1) {
                    localStorage.signdate=today;
                    localStorage.signuser=username;
                    throw new Error(infobar.value = "今天已经签到了。");
                } else {
                    throw new Error(infobar.value = "无法识别领取奖励按钮 :( ");
                }
            }
        })
        .then(rsp => rsp.text()).then(data=>{
            days=data.split("已连续登")[1].split(" ")[1];//连续登陆天数
            localStorage.signdate=today;
            localStorage.signuser=username;
            //若是首页，签到入口隐藏
            if(document.querySelector('a[href="/mission/daily"]')){
                document.querySelector('a[href="/mission/daily"]').parentElement.parentElement.style.display="none";
            }
            return fetch("/balance");//继续继续，查看领取数量
        })
        .then(rsp => rsp.text()).then(data=>{
            if (data.indexOf("每日登录奖励")!== -1){
                var money=data.match(/每日登录奖励 \d+ 铜币/)[0].match(/\d+/)[0];
                localStorage.signmoney=money;
                console.log(infobar.value = "连续签到" + days + "天，本次" + money + "铜币");
            } else {
                console.log(infobar.value = "未能识别到领取");
            }
        })
        .catch(error => {
            console.error("Sign info:", error);
            if(typeof error=="string" && error.indexOf("已经签到") == -1) {
                infobar.value = "请手动领取今日的登录奖励!";
            }
        });//end fetch
    }//end 判断登陆状态
}, 0);// end 签到

// 按关键词屏蔽帖子、个人资料中的垃圾回复
setTimeout(() => {
    if(location.pathname.indexOf("/t/") === 0 || location.pathname.indexOf("/member/") === 0){
        var lowkeys = ["已 block", "已经 block", '龟男', '龟龟', '🐢'].map(key=>key.toLowerCase());
        var replys_html = document.body.innerHTML.toLowerCase();
        var check = lowkeys.some(key => replys_html.indexOf(key) != -1)
        var lowcount = 0;
    } else {
        return;
    }
    if (check) {
        // 帖子页面
        document.querySelectorAll('div[id^=r_]').forEach(ele => {
            var reply_html = ele.innerHTML.toLowerCase();
            lowkeys.some(key => {
                if (reply_html.indexOf(key) != -1) {
                    ele.style.display = "none";
                    lowcount++;
                    return true;
                }
            });
        })
        if (lowcount > 0) {
            document.querySelector('div[class="fr topic_stats"]').innerHTML += "隐藏回复 " + lowcount + "&nbsp;";
        }
        // 个人资料页面
        document.querySelectorAll(".reply_content").forEach(ele=>{
            lowkeys.some(key => {
                if (ele.innerText.toLowerCase().indexOf(key) != -1) {
                    ele.innerText="(含敏感词被屏蔽)";
                    return true;
                }
            });

        })

    }
}, 0);//end 按关键词屏蔽帖子中的垃圾回复

//修正遗落的MOD标记，@所有人、@管理员
if (location.href.indexOf("/t/") != -1) {
    setTimeout(() => {
        if(document.querySelector("a[href*='/settings'].top") === null){
            return;//未登录
        }
        //管理员ID列表
        var allmod_arr=["Livid","Kai","Olivia","GordianZ","sparanoid","Tink","drymonfidelia"];
        //我的ID
        var myname=document.querySelector('a[href^="/member/"]').innerHTML;//自己用户名
        //标记管理员，预存回复用户名列表
        var upname=document.querySelector(".header .gray a").innerText;
        //var allname='@'+upname+' ';
        //建立本帖所有用户数组
        var allname_arr=[];
        if(myname !== upname){
            allname_arr.push(upname);//如果楼主不是我，也应该加进去。
        }
        //遍历每个回复
        document.querySelectorAll("div[id^='r_']").forEach(ele=>{
            var thisuser=ele.querySelector('a[href^="/member/"].dark').href.split("/member/")[1];
            //加入到所有人数组
            if( allname_arr.includes(thisuser) === false){
                allname_arr.push(thisuser);
            }
            //修正被遗落的MOD标记
            if(allmod_arr.includes(thisuser) === true){
                if(ele.querySelector(".badges").querySelector(".mod") === null){
                    ele.querySelector(".badges").innerHTML+='<div class="badge mod">MOD</div>';
                }
            }
        });//完成所有用户数组

        //如果存在回复框，加入@所有人、@管理员。
        if ( document.getElementById("reply_content") ) {
            //添加@所有人
            var at_allname="@"+allname_arr.join(" @");//生成@所有人
            document.getElementById("reply_content").parentNode.innerHTML
                +="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='if ( document.getElementById(\"reply_content\").value.indexOf(\""
                +at_allname+"\") == -1 ) {document.getElementById(\"reply_content\").value+=\"\\r\\n"+at_allname+"\"}'>@所有人</a>";

            //添加@管理员
            var at_allmod="@"+allmod_arr.join(" @");//生成@所有管理员
            document.getElementById("reply_content").parentNode.innerHTML
                +="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='if ( document.getElementById(\"reply_content\").value.indexOf(\""
                +at_allmod+"\") == -1 ) {document.getElementById(\"reply_content\").value+=\"\\r\\n"+at_allmod+"\"}'>@管理员</a>";
            //允许调整回复框高度
            if ( document.body.style.WebkitBoxShadow !== undefined ) {
                document.getElementById("reply_content").style.resize="vertical";
            }
            document.getElementById("reply_content").style.overflow="auto";//内容不足时不出现滚动条
        }

    }, 0);// end setTimeout
}// end 修正遗落的MOD标记，@所有人、@管理员

// 帖子回复框增加快捷回复，提示广告贴应发在推广节点
if (location.href.indexOf("/t/") != -1) {
(function(){
    document.getElementById("reply_content").parentNode.innerHTML
        +="&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:;' onclick='document.getElementById(\"reply_content\").value+=\"\\r\\n"+"@Livid 这贴明显是推广贴，却没有发在推广节点。"+"\"'>报告广告贴</a>";
})()
}// end 举报广告贴链接

// 图片链接自动转换成图片
setTimeout(() => {
    document.querySelectorAll(".topic_content a, .reply_content a").forEach(a=>{
        var link=a.pathname;
        if( link.indexOf("v2ex.com/")==-1 && a.querySelector("img") !== null){
            if(a.querySelector("img")){
                a.querySelector("img").setAttribute("title",a.hostname);
            }
            return;
        }
        if (/\.(?:bmp|gif|jpg|jpeg|png|webp)$/i.test(link)){
            a.innerHTML = `<img src="${a.href}" title="图片来自 ${a.hostname}" style="max-width:98%" decoding="async" loading="lazy" />`;
            // decoding='async'异步解析图像，加快显示其他内容。loading='lazy'懒加载。
            // 排除v2ex链接，避免误判 例子(非图片) https://v2ex.com/i/Ve5X51qb.png
        }
    })
}, 0);// end 图片链接自动转换成图片

//新浪图床的图片反防盗链
setTimeout(() => {
    Array.from(document.images).forEach(ele=>{
        if (ele.src.indexOf(".sinaimg.cn")!=-1) {
            ele.setAttribute("referrerPolicy","no-referrer");
            ele.src="https://image.baidu.com/search/down?thumburl=https://baidu.com&url="+ele.src;
        }
    })
}, 0);// end 新浪图床的图片反防盗链

// 在账户余额界面/明细界面的上方增加签到页面链接
if ( location.pathname == '/balance') {
setTimeout(() => {
    document.querySelectorAll('span[class="gray"]').forEach(ele=>{
        if(ele.parentElement.innerHTML.indexOf("当前账户余额") != -1){
            ele.parentElement.innerHTML+='<div><li class="fa fa-question-circle gray"><a href="/mission/daily" > 查看签到页面</a></li></div>'
        }
    });
}, 0);// end setTimeout
}
//余额页面显示签到页面链接

//在签到页面显示了上次领取铜币数量
if(location.pathname == "/mission/daily" && typeof localStorage.getItem("Signmoney") == 'string'){
setTimeout(() => {
    if(localStorage.signuser == document.querySelector('a[href^="/member/"]').innerHTML)
    document.querySelectorAll('div[class="cell"]').forEach(ele=>{
        if(ele.innerHTML.indexOf("已连续登录") == 0 ){
            ele.innerHTML += "，最近一次领取了 "+localStorage.signmoney+" 铜币。";
        }
    })
}, 0);// end setTimeout
}//end 签到页上次领取铜币数量

// 新消息界面，显示消息序号，页码链接显示序号范围
if (location.href.indexOf("/notifications") != -1){
setTimeout(() => {
    var page_index=new URL(window.location.href).searchParams.get('p');
    var before_index=0;
    if(page_index!=null){
        before_index=(page_index-1)*50;
    }
    document.querySelectorAll("a[onclick^=delete]").forEach((ele,i)=>{
        var index_ele=document.createElement("span");
        index_ele.innerText=(i+1+before_index)+". ";
        ele.parentElement.insertBefore(index_ele,ele.parentElement.firstElementChild)
    })
    var allmsgcount=document.querySelectorAll(".header .gray")[0].innerText;//消息总数
    document.querySelectorAll(".page_current,.page_normal").forEach((ele)=>{
        var index_a=(ele.innerText-1)*50+1;
        var index_b=(ele.innerText-1)*50+50;
        var title_str=index_a+"-"+index_b;
        if(allmsgcount-index_a<50){
            title_str=index_a+"-"+allmsgcount;
        }
        ele.setAttribute("title",title_str)
    })
}, 0);
}// end 新消息界面，序号和翻页按钮优化

// 新消息界面，回复提醒对比感谢提醒更加醒目
if (location.href.indexOf("/notifications") != -1){
setTimeout(() => {
    if(document.querySelectorAll(".payload").length > 0){
        // 被人@提醒。2、回复我的主题提醒。
        document.querySelectorAll(".payload").forEach((ele) => {
            if(ele.parentElement.innerText.indexOf("时提到了你") != -1
            || ele.parentElement.innerText.indexOf("里回复了你") != -1 ){
                ele.style.backgroundColor="#F9EA9A";
            }
        });
        // 别人打赏Solana给我
        document.querySelectorAll(".fade").forEach((ele) => {
            if(ele.innerText.indexOf("Solana 打赏") != -1){
                ele.style.backgroundColor="#6858eb";
            }
        });
    }
}, 0);// end setTimeout
}// end 新消息界面优化

// 帖子中的图片添加背景，解决偶尔看不到加载失败图片
if(location.pathname.indexOf("/t/") != -1){
    setTimeout(() => {
        var css=`
.topic_content img,
.reply_content img {
min-width: 16px;
min-height: 16px;
background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' style='min-width: 16px; min-height: 16px; background-color: white;'%3E%3Crect x='0' y='0' width='16' height='16' fill='%23eee' stroke='%23ccc' stroke-width='1'/%3E%3Cpolygon points='3,12 5,8 9,11 13,6 13,12' fill='%23aaa'/%3E%3Ccircle cx='3' cy='3' r='2' fill='%23888'/%3E%3C/svg%3E");
background-repeat: no-repeat;
background-size: 16px 16px;
display: inline-block;
}
        `;
        var style=document.createElement('style');
        style.textContent = css;
        document.head.append(style);
    }, 0);
}// end 帖子中的图片添加背景

//清理一些这样那样的东西
if(new Date().toISOString().split("T")[0] != localStorage.cleardate){
setTimeout(() => {
    for (var i = localStorage.length-1; i >= 0 ; i--) {
        if(localStorage.key(i).indexOf("lscache") == 0){
            localStorage.removeItem(localStorage.key(i));
        }
    }
    if(typeof localStorage.getItem("SigninInfo") == 'string'){
        localStorage.removeItem("SigninInfo");
    }
}, 0);// end setTimeout
}// end 清理东西

},0);// end