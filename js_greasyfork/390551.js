// ==UserScript==
// @name         斗鱼火力搜寻+云弹幕二合一清爽版
// @namespace    https://github.com/wolf-scream
// @version      1.4
// @description  本脚本是全自动火力搜索+自动发云弹幕抢鱼丸红包二合一脚本，去除了超级皇帝弹幕特效等附加功能，降低浏览器内存消耗，清爽抢丸子，助力您多开房间。开启后将脚本按钮停在🔥，然后就不需要您的任何操作了，剩下的都交给脚本了。不过需要警惕的是，作者限制了跳转次数🌐大于100次后的自动跳转功能，用户可以手动跳转，用于防止账号被封禁；当自动开火搜索短时间内跳转频率过高时，有几率会引起浏览器崩溃，重新启动浏览器，降低跳转速度即可。
// @author       lvlanxing
// @supportURL   https://github.com/wolf-scream/FirePowerSeek
// @icon         https://raw.githubusercontent.com/popzoo/pop/master/images/favicon.ico
// @include      https://www.douyu.com/0*
// @include      https://www.douyu.com/1*
// @include      https://www.douyu.com/2*
// @include      https://www.douyu.com/3*
// @include      https://www.douyu.com/4*
// @include      https://www.douyu.com/5*
// @include      https://www.douyu.com/6*
// @include      https://www.douyu.com/7*
// @include      https://www.douyu.com/8*
// @include      https://www.douyu.com/9*
// @include      https://www.douyu.com/topic/*
// @include      https://www.douyu.com/*?rid=*
// @mail         lvlanxing@gmail.com
// @copyright    JadeBone
// @grant        none
// @compatible   chrome
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/390551/%E6%96%97%E9%B1%BC%E7%81%AB%E5%8A%9B%E6%90%9C%E5%AF%BB%2B%E4%BA%91%E5%BC%B9%E5%B9%95%E4%BA%8C%E5%90%88%E4%B8%80%E6%B8%85%E7%88%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/390551/%E6%96%97%E9%B1%BC%E7%81%AB%E5%8A%9B%E6%90%9C%E5%AF%BB%2B%E4%BA%91%E5%BC%B9%E5%B9%95%E4%BA%8C%E5%90%88%E4%B8%80%E6%B8%85%E7%88%BD%E7%89%88.meta.js
// ==/UserScript==

(function() {
    // 本地常用普通弹幕，建议大家自行修改一些通用的，要不都用这个容易露馅，修改请注意格式
    var arrCommon = ["主播加油💪","好奈斯","点击关注，不会迷路","弹幕冲鸭冲鸭","我来冒个泡","火力全开暴躁起来","小礼物刷起来","一发入魂","支持主播，来办卡吧",
                     "神奇的主播，优质的弹幕","水军来捧，主播威猛","铁粉驾到，热度必爆","自家人，别误伤","主播贼6！","กิิิิิ荧กิิิิิิิิิิิ光กิิิิิิิิิิิ棒กิิิิิ"]; //普通本地弹幕，与云普通弹幕+云定制弹幕混用
    var arrPoetry =["山重水复疑无路，关注主播不迷路！","大风起兮云飞扬，弹幕冲兮人满房！","海阔凭鱼跃，弹幕满屏飞！"];//精选弹幕占位，与云精选弹幕混用
    const royalTime = 300;//发送弹幕后更改皇族的时间间隔，网络延迟大则增加此数值 ,反正则减小 ms;
    var tmGap = 10000;//默认弹幕时间间隔与轮询间隔 ms
    var msgTxt, msgBtn, firePowerTimeout, fireSeekJump;//延迟任务对象
    var uid = "未知", uname="未知", roomId;//用户id，昵称，房间号
    var sbts = (new Date()).getTime();//当前时间戳
    var radioStorage = "ceaseFire";//初始化单选框状态

    //=============================================================================
    //++++++++++++++++++++++云端获取弹幕，暂时不启用本地缓存++++++++++++++++++++++++++
    //=============================================================================
    function cloudBarrage(){
        var categoryName = document.getElementsByClassName("Title-categoryItem")[1];
        categoryName = categoryName.innerText;
        // var cloudBarrage = localStorage.getItem("cloudBarrage✨🌌✨");
        // var dailyPageCount = localStorage.getItem((new Date()).toLocaleDateString() + "📱🌐📱[" + uname + "]");
        // if(dailyPageCount !=null && cloudBarrage!=null){
        //     cloudBarrage = JSON.parse(cloudBarrage);
        //     if(cloudBarrage[categoryName]!=undefined){
        //         arrCommon = arrCommon.concat(cloudBarrage.通用);
        //         arrCommon = arrCommon.concat(cloudBarrage[categoryName]);
        //     }
        // }else{
        fetch('https://raw.githubusercontent.com/wolf-scream/danmu_repository/master/cloud_danmu.json',{
            method: 'GET',
            mode: 'cors', //请求模式为跨域
            cache: 'default', //no-cache
            credentials: 'omit', // 同源则加入凭据头,cookies
        }).then(res => {
            return res.json();
        }).then(json => {
            // console.log('获取的结果', json.data);
            arrCommon = json.data.通用!=undefined ? arrCommon.concat(json.data.通用) : arrCommon;
            arrCommon = json.data[categoryName]!=undefined ? arrCommon.concat(json.data[categoryName]) : arrCommon;
            arrPoetry = json.data.精选!=undefined ? arrPoetry.concat(json.data.精选) : arrPoetry;
            // localStorage.setItem("cloudBarrage✨🌌✨", JSON.stringify(json.data));
        }).catch(err => {
            console.log('请求错误', err);
        })
        // }
    }

    //绑定欧皇弹幕特效
    function clickBtnEvent(){//roles:1:幻神，other：超级皇帝
        setTimeout(function(){royalChatEffect(0)}, royalTime);
        setTimeout(function(){screenEmpireBarrage()}, royalTime);
    }

    //=============================================================================
    //+++++++++++++++++++++++++++++++++弹幕轰炸++++++++++++++++++++++++++++++++++++
    //=============================================================================
    function bombBarrage(){
        var probNum = parseInt(Math.random() * 5);
        if(probNum == 0){
            var num = parseInt(Math.random() * arrPoetry.length);
            console.log("精选弹幕第<"+num+">条,时间间隔<"+((new Date()).getTime() - sbts)/1000+"s>" + arrPoetry[num]);
            msgTxt.value = arrPoetry[num];
            msgBtn.click();
            // clickBtnEvent();
        }else{
            var num1 = parseInt(Math.random() * arrCommon.length);
            console.log("普通弹幕第<"+num1+">条,时间间隔<"+((new Date()).getTime() - sbts)/1000+"s>" + arrCommon[num1]);
            msgTxt.value = arrCommon[num1];
            msgBtn.click();
            // clickBtnEvent();
        }
    }

    //=============================================================================
    //++++++++++++++++++++++发送弹幕时间算法（弹幕间隔数目）++++++++++++++++++++++++++
    //=============================================================================
    // 获取上次弹幕的位置间隔
    function countBarrageGap(num){
        var gapFlag = true;
        var chatList = document.getElementsByClassName("Barrage-listItem");
        for(let i= chatList.length-1; i>-1;i--){
            let lastGap = chatList.length - i -1;
            if(chatList[i].innerHTML.indexOf("is-self")!=-1 ){
                if(lastGap>= num){
                    gapFlag = true;
                    // console.log("距自己上条弹幕个数间隔==========>" + lastGap+"/"+num);
                    break;
                } else{
                    gapFlag = false;
                    console.log("距自己上条弹幕个数间隔==========>" + lastGap+"/"+num);
                    break;
                }
            }
        }
        sbts = (new Date()).getTime();
        return gapFlag;
    }

    // 判断当前房间是否火力全开,自动监听
    function firePowerMsg() {
        var fireObj = document.getElementsByClassName("FirePowerChatModal-Notice")[0];
        if ( fireObj != undefined && !joinCondition() && awardJudge() && !banSpeak() ) {
            let num = parseInt(Math.random()*3) + 3; //随机指定3~5条弹幕间隙在发送自己弹幕
            if(radioStorage == "openFire" && countBarrageGap(num)){
                bombBarrage();
            }
            sbts = (new Date()).getTime();
        } else {
            console.log("火力停止时间累计："+ ((new Date()).getTime() - sbts)/1000 + "s" );
            if(radioStorage == "openFire" && ((new Date()).getTime() - sbts) > 1000 * 80){//如果累计超过80s没有火力全开，则跳转！
                randomFireRequest();
            }
        }
        randomTime();//回调随机时间
    }

    //随机时间差
    function randomTime(){
        let tmRandom = tmGap + parseInt(Math.random()*1500);
        firePowerTimeout= setTimeout(firePowerMsg, tmRandom);
    }

    //=============================================================================
    //+++++++++++++++++++++++++++++++火力全开房间号搜索++++++++++++++++++++++++++++++
    //=============================================================================
    function randomFireRequest(limit) {
        var dailyPageCount = localStorage.getItem((new Date()).toLocaleDateString() + "📱🌐📱[" + uname + "]");
        if(dailyPageCount>=100 && limit == 1){ // 限制自动跳转次数，当自动跳转次数超过100次时，则禁止自动跳转，用户需手动跳转
            alert("自动跳转已经达到最大阈值，如需要请手动跳转！");
        }else{
            var ajax = new XMLHttpRequest();
            ajax.timeout = 2000;
            ajax.responseType = "json";
            ajax.open('get', 'https://www.douyu.com/japi/firepower/apinc/activeTask/getRecRid', true); //采用异步
            ajax.send();
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    fireRequestFilter(ajax.response.data);
                }
            }
        }
    }

    // 火力全开房间搜索过滤，采用websocket传输，暂时没法获取接口
    function fireRequestFilter(fireUrl) {
        var myRequest = new Request('https://www.douyu.com/swf_api/h5room/'+fireUrl);
        fetch(myRequest).then(function(response) {
            return response.json().then(function(json) {
                var jsonData = json.data;
                console.log("主播昵称:【"+jsonData.nickname+"】++++++在线人数:【" + jsonData.online + "】++++++游戏名称:【" + jsonData.game_name+"】++++++URL=>https://www.douyu.com/"+fireUrl);
                var dailyPageCount = localStorage.getItem((new Date()).toLocaleDateString() + "📱🌐📱[" + uname + "]");
                if (dailyPageCount != null ) {
                    dailyPageCount = parseInt(dailyPageCount) + 1;
                    localStorage.setItem((new Date()).toLocaleDateString() + "📱🌐📱[" + uname + "]", dailyPageCount);
                } else {
                    localStorage.setItem((new Date()).toLocaleDateString() + "📱🌐📱[" + uname + "]", 1);
                }
                if (jsonData.online < 3000 && jsonData.game_name.indexOf("一起看") == -1 && jsonData.game_name.indexOf("二次元") == -1 && jsonData.game_name.indexOf("户外") == -1 && jsonData.game_name.indexOf("汽车") == -1) { //筛选条件：过滤二次元、看电影、户外和人数>3000的房间
                    fireUrl = "https://www.douyu.com/" + fireUrl;
                    window.location.href = fireUrl;
                } else {
                    randomFireRequest(); //重新获取有火力全开的房间号
                }
            });
        });
    }

    //===============================================================
    //+++++++++++++++++++++++++帝皇聊天特性+++++++++++++++++++++++++++
    //===============================================================
    function royalChatEffect(roles) {//roles:1:幻神，other：超级皇帝
        if (document.getElementsByClassName('Barrage-listItem').length > 1) {
            let barrageArr = document.getElementsByClassName('Barrage-listItem');
            var roomFlag = false;
            for (let i = barrageArr.length - 1; i >= 0; i--) {
                if (barrageArr[i].lastElementChild != null && barrageArr[i].lastElementChild.innerHTML.indexOf("Barrage-nobleImg") == -1 && barrageArr[i].lastElementChild.innerHTML.indexOf("is-self") != -1) { //非空，去重，找自己

                    //增加单字车队图标,去重
                    if(barrageArr[i].lastElementChild.innerHTML.indexOf("Motor")==-1){
                        var iconTag = document.createElement("span");
                        iconTag.className = "Motor"
                        iconTag.setAttribute("title","神");
                        iconTag.setAttribute("data-motorcade","神");
                        iconTag.setAttribute("style","background-image:url(https://img.douyucdn.cn/data/yuba/admin/2019/01/07/201901071437499042327937962.png)");
                        var iconSpan = document.createElement("span");
                        iconSpan.className = "Motor-flag";
                        iconSpan.innerText = "神"
                        iconTag.appendChild(iconSpan);
                        barrageArr[i].lastElementChild.insertBefore(iconTag,barrageArr[i].lastElementChild.children[1]);
                    }

                    //修改用户等级、房间等级和字幕颜色
                    var userLevelObj = barrageArr[i].lastElementChild.querySelector(".UserLevel");
                    if( userLevelObj!=undefined){
                        userLevelObj.className = "UserLevel UserLevel--120";
                        userLevelObj.setAttribute("title", "用户等级：120");
                    }
                    var roomLevelObj = barrageArr[i].lastElementChild.querySelector(".RoomLevel");
                    if( roomLevelObj!=undefined){
                        roomLevelObj.className = "RoomLevel RoomLevel--16";
                        roomLevelObj.setAttribute("title","房间等级：16");
                    }
                    var barrageColorObj = barrageArr[i].lastElementChild.querySelector(".Barrage-content");
                    if(barrageColorObj !=undefined){
                        barrageColorObj.className = "Barrage-content Barrage-content--color0";
                    }

                    //如果没有房间等级则创建元素
                    if(roomFlag ==false){
                        var roomTag = document.createElement("span");
                        roomTag.className ="RoomLevel RoomLevel--16";
                        roomTag.setAttribute("title","房间等级：16");
                        barrageArr[i].lastElementChild.insertBefore(roomTag,barrageArr[i].lastElementChild.children[1]);
                    }

                    // 增加签到手气王+增加王者神豪特效(已去除签到手气王，和王者神豪不在同行，不优雅)
                    var fireIconObj = barrageArr[i].lastElementChild.getElementsByClassName("FirePowerIcon")[0];
                    var signTag = document.createElement("a");
                    signTag.setAttribute("class","Baby");
                    signTag.setAttribute("data-id","1500000312");
                    // var signIconImg = document.createElement("img");
                    // signIconImg.setAttribute("class","Baby-image js-baby-signMedalClick");
                    // signIconImg.setAttribute("src","https://res.douyucdn.cn/resource/2019/06/27/reward/15fd9177ac85d6e91414e3ea00c2d720.png");
                    // signIconImg.setAttribute("title","签到手气王");
                    // signTag.appendChild(signIconImg);
                    var kingIconImg = document.createElement("img");
                    kingIconImg.setAttribute("class","Baby-image is-achievement");
                    kingIconImg.setAttribute("src","https://sta-op.douyucdn.cn/douyu/3d416f83fb2de6e4e8de5ce4e24b424e4eccc705.gif");
                    kingIconImg.setAttribute("data-achievementid","188");
                    kingIconImg.setAttribute("title","王者神豪");
                    signTag.appendChild(kingIconImg);
                    if( barrageArr[i].lastElementChild.innerHTML.indexOf("Baby-image")==-1 ){//去重
                        fireIconObj!=undefined? barrageArr[i].lastElementChild.insertBefore(signTag,fireIconObj): barrageArr[i].lastElementChild.appendChild(signTag);
                    }

                    //增加猜王图标,不在同水平线，不优雅去除
                    // var guessTag = document.createElement("a");
                    // guessTag.className = "Medal";
                    // guessTag.setAttribute("data-id","1500000230");
                    // var guessImg = document.createElement("img");
                    // guessImg.setAttribute("class","Medal-image");
                    // guessImg.setAttribute("src","//res.douyucdn.cn//resource/2018/03/16/reward/9f192d005a697258371bef79e4550295.png");
                    // guessImg.setAttribute("title","竞猜周榜收益第一名");
                    // guessTag.appendChild(guessImg);
                    // barrageArr[i].lastElementChild.insertBefore(guessTag,barrageArr[i].lastElementChild.children[1]);

                    // 添加粉丝牌，未考虑本身的粉丝牌去除
                    var fansMedalName = document.getElementsByClassName("FansMedal-name")[0];//粉丝牌名称
                    var fansBackgroundImg = document.getElementsByClassName("FansRankList-item FansRankList-item--top")[0];
                    barrageArr[i].className = "Barrage-listItem js-floating-barrage js-fansfloating-barrage";
                    barrageArr[i].lastElementChild.className = "js-fansfloating-barragecont Barrage--paddedBarrage";
                    if(fansMedalName!=undefined && roomId!=undefined && fansBackgroundImg!= undefined ){//当前房间为普通粉丝牌

                        if(fansBackgroundImg.innerHTML.indexOf("background-image:")==-1){
                            var fansTag = document.createElement("div");
                            fansTag.className="FansMedal level-30 js-fans-dysclick Barrage-icon";
                            fansTag.setAttribute("data-rid",roomId);//id与房间号一致
                            var fansSpan = document.createElement("span");
                            fansSpan.className = "FansMedal-name js-fans-dysclick";
                            fansSpan.setAttribute("data-rid",roomId);
                            fansSpan.innerHTML = fansMedalName.innerText;
                            fansTag.appendChild(fansSpan);
                            barrageArr[i].lastElementChild.insertBefore(fansTag,barrageArr[i].lastElementChild.firstElementChild);
                        }else{//当前房间为动态粉丝牌
                            var fansTag1 = document.createElement("div");
                            fansTag1.className="FansMedal is-made js-fans-dysclick Barrage-icon";
                            fansTag1.setAttribute("style", fansBackgroundImg.getElementsByClassName("FansMedal is-made")[0].getAttribute("style") );
                            fansTag1.setAttribute("data-rid",roomId);//id与房间号一致
                            var fansSpan1 = document.createElement("span");
                            fansSpan1.className = "FansMedal-name js-fans-dysclick";
                            fansSpan1.setAttribute("data-rid",roomId);//id与房间号一致
                            fansSpan1.innerHTML = fansMedalName.innerText;
                            fansTag1.appendChild(fansSpan1);
                            barrageArr[i].lastElementChild.insertBefore(fansTag1,barrageArr[i].lastElementChild.firstElementChild);
                        }
                    }else{//当前房间无粉丝牌，则指定一个粉丝牌
                        var fansTag2 = document.createElement("div");
                        fansTag2.className="FansMedal is-made js-fans-dysclick Barrage-icon";
                        fansTag2.setAttribute("style","background-image: url('https://gfs-op.douyucdn.cn/fans_medal_resource/2019/07/12/5a5efaca4d1250413ed9c3c36438f6cb.gif')");//id与房间号一致
                        fansTag2.setAttribute("data-rid","4615502");//id与房间号一致
                        var fansSpan2 = document.createElement("span");
                        fansSpan2.className = "FansMedal-name js-fans-dysclick";
                        fansSpan2.setAttribute("data-rid","4615502");//id与房间号一致
                        fansSpan2.innerHTML = "猪叫团";
                        fansTag2.appendChild(fansSpan2);
                        barrageArr[i].lastElementChild.insertBefore(fansTag2,barrageArr[i].lastElementChild.firstElementChild);
                    }

                    //增加超级皇帝标签，未考虑有其他贵族标志的替换
                    var nobleIconObj = barrageArr[i].getElementsByClassName("Barrage-icon Barrage-noble")[0];
                    if(nobleIconObj==undefined){//贵族图标去重
                        var royalTag = document.createElement("span");
                        var royalImg = document.createElement("img");
                        royalTag.className = "Barrage-icon Barrage-noble";
                        royalImg.className = "Barrage-nobleImg";
                        var nobleImgUrl = roles == 1 ? "//res.douyucdn.cn/resource/2019/08/15/common/4e85776071ffbae2867bb9d116e9a43c.gif" : "//res.douyucdn.cn/resource/2019/08/09/common/3d994a081e5384de14e6893d1d8b94c5.gif";
                        royalImg.setAttribute("src", nobleImgUrl);
                        royalImg.setAttribute("title", roles == 1?"幻神":"超级皇帝");
                        royalTag.appendChild(royalImg);
                        barrageArr[i].lastElementChild.insertBefore(royalTag, barrageArr[i].lastElementChild.firstElementChild);
                    }
                    break;//加中断意味着只修改刚发送临近的一条弹幕，避免循环全部弹幕的资源浪费
                }
            }
        } else {
            console.warn("无弹幕可操作");
        }
    }

    //===============================================================
    //++++++++++++++++++++++++超级帝皇屏幕特效++++++++++++++++++++++++
    //===============================================================
    function screenEmpireBarrage(){
        var fatherNode = document.querySelector(".danmu-6e95c1");
        for(let i = fatherNode.children.length-1;i>=0;i--){
            if(fatherNode.children[i].className.indexOf("noble-bf13ad")==-1 && fatherNode.children[i].innerHTML.indexOf("border: 2px solid rgb(2, 255, 255)")!=-1){//去重,带蓝框为自己
                //父标签更改
                var liStyle = fatherNode.children[i].getAttribute("style");
                let characterLength = liStyle.substring(liStyle.indexOf("translateX(-")+12,liStyle.indexOf("px); transition"));
                let transformLength = liStyle.substring(liStyle.indexOf("transform ")+10,liStyle.indexOf("s linear"));
                let screenOpacity = liStyle.substring(liStyle.indexOf("opacity:")+8,liStyle.indexOf("; z-index:"));
                var characterStyle = "opacity: "+ screenOpacity +"; z-index: 30; background: rgba(0, 0, 0, 0); top: 54px; transform: translateX(-"+ characterLength +"px); transition: transform "+ transformLength +"s linear;"
                fatherNode.children[i].className = "danmuItem-31f924 noble-bf13ad";
                fatherNode.children[i].setAttribute("style",characterStyle);

                //贵族图标  未考虑去重替换
                var nobleImgTag = document.createElement("img");
                nobleImgTag.className = "super-noble-icon-9aacaf";
                nobleImgTag.setAttribute("src","https://shark2.douyucdn.cn/front-publish/live_player-master/assets/images/c1_51e025.png");
                nobleImgTag.setAttribute("style","margin-top: -2px;");
                fatherNode.children[i].insertBefore(nobleImgTag,fatherNode.children[i].firstElementChild);

                //用户图标
                var userIconTag = document.createElement("img");
                var userIconObj = document.getElementsByClassName("Avatar is-circle")[0];//自己头像
                var fansHeader = document.getElementsByClassName("FansRankList-item FansRankList-item--top")[0];//粉丝头牌头像
                if(userIconObj !=undefined){
                    userIconObj = userIconObj.getElementsByTagName("img")[0].getAttribute("src");
                    userIconTag.setAttribute("src", userIconObj.replace((new RegExp("_middle")),"_small"));
                }else if(fansHeader!=undefined){//这里不使用固定地址头像，防止用户更换头像，地址失效
                    fansHeader = fansHeader.getElementsByTagName("img")[0].getAttribute("src");
                    userIconTag.setAttribute("src", fansHeader.replace((new RegExp("_middle")),"_small"));
                }
                userIconTag.className = "super-user-icon-574f31";
                fatherNode.children[i].insertBefore(userIconTag,fatherNode.children[i].firstElementChild);

                //去除尾部标签
                var tailTag = fatherNode.children[i].getElementsByClassName("afterpic-8a2e13")[0];
                tailTag.remove();

                //更改字幕内容特效
                var textContent = fatherNode.children[i].getElementsByClassName("text-879f3e")[0];
                textContent.className = "super-text-0281ca";
                textContent.setAttribute("style","font-style: normal; font-variant: normal; font-weight: bold; font-stretch: normal; font-size: 23px; line-height: normal; font-family: SimHei, &quot;Microsoft JhengHei&quot;, Arial, Helvetica, sans-serif; color: rgb(255, 255, 255); background: url('https://shark2.douyucdn.cn/front-publish/live_player-master/assets/images/c2_8ae118.png');");

                //尾部图标
                var superTailImg = document.createElement("img");
                superTailImg.className = "super-tail-bffa58";
                superTailImg.setAttribute("src","https://shark2.douyucdn.cn/front-publish/live_player-master/assets/images/c3_bfe43b.png");
                fatherNode.children[i].appendChild(superTailImg);

                //添加开火标签和签到手气王
                var afterpicTag = document.createElement("div");
                afterpicTag.setAttribute("class","afterpic-8a2e13");
                afterpicTag.setAttribute("style","margin-top: 7px; margin-left: -43px;");
                // afterpicTag.setAttribute("style","margin-top: 7px; margin-left: -1px;");
                if(document.querySelector(".FirePowerChatModal-Notice")==undefined){//添加手气王
                    var signImgTag = document.createElement("img");
                    signImgTag.setAttribute("class","afterpic-8a2e13");
                    signImgTag.setAttribute("src","https://shark2.douyucdn.cn/front-publish/live_player-master/assets/images/lucky_c5d02e.png");
                    signImgTag.setAttribute("style","width: 28.8px; height: 28.8px;");
                    afterpicTag.appendChild(signImgTag);
                }else{//添加火图标
                    var fireImg = document.createElement("img");
                    fireImg.setAttribute("class","afterpic-8a2e13");
                    fireImg.setAttribute("src","https://shark2.douyucdn.cn/front-publish/live_player-master/assets/images/hlqk_61648e.svg");
                    fireImg.setAttribute("style","width: 28.8px; height: 28.8px;");//margin-left: -42px;
                    afterpicTag.appendChild(fireImg);
                }
                fatherNode.children[i].appendChild(afterpicTag);
                // textContent.appendChild(afterpicTag);
            }
        }
    }

    //===============================================================
    //++++++++++++++++添加火力跳转按钮和radio弹幕状态++++++++++++++++++
    //===============================================================
    function creatBtnTag(){
        // 创建元素样式,优先执行,radio为单选框样式，dfn为tip提示的样式
        var radioStyle = document.createElement('style');
        radioStyle.type = 'text/css';
        radioStyle.innerHTML = (function(){/*
        .radio{
            display: inline-block;
            position: relative;
            line-height: 18px;
            margin-right: 10px;
            cursor: pointer;
        }
        .radio input{
            display: none;
        }
        .radio .radio-bg{
            display: inline-block;
            height: 18px;
            width: 18px;
            margin-right: 5px;
            padding:;
            background-color: #45bcb8;
            border-radius: 100%;
            vertical-align: top;
            box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1) inset, 0 1px 4px rgba(0, 0, 0, 0.1) inset, 1px -1px 2px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .radio .radio-on{
            display: true;
        }
        .radio input:checked + span.radio-on{
            width: 10px;
            height: 10px;
            position: absolute;
            border-radius: 100%;
            background: #FFFFFF;
            top: 4px;
            left: 4px;
            box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.4) inset;
            background-image: linear-gradient(#ffffff 0, #e7e7e7 100%);
            transform: scale(0, 0);
            transition: all 0.2s ease;
            transform: scale(1, 1);
            display: inline-block;
        }

        dfn {
              padding: 0 0.4em;
              cursor: help;
              font-style: normal;
              position: relative;
            }
            dfn::after {
              content: attr(data-info);
              display: inline;
              white-space: pre-wrap;
              z-index: 999;
              border-radius: 4px;
              position: absolute;
              top: 22px; left: 0;
              opacity: 0;
              width: 310px;
              font-size: 13px;
              font-weight: 300;
              line-height: 1.5em;
              padding: 0.5em 0.8em;
              background: rgba(0,0,0,0.8);
              color: #fff;
              pointer-events: none;
              transition: opacity 150ms, top 150ms;
            }
            dfn::before {
              content: '';
              display: block;
              position: absolute;
              top: 12px; left: 20px;
              opacity: 0;
              width: 0; height: 0;
              border: solid transparent 5px;
              border-bottom-color: rgba(0,0,0,0.8);
              transition: opacity 150ms, top 150ms;
            }
            dfn:hover {z-index: 200;}
            dfn:hover::after,
            dfn:hover::before {opacity: 1;}
            dfn:hover::after {top: 30px;}
            dfn:hover::before {top: 20px;}
    */}).toString().split('/*')[1].split('*/')[0];
        document.head.appendChild(radioStyle);

        // 创建radio元素标签，后于样式执行，样式独有
        var radioBtnTag = (function(){/*
        <dfn data-info="🧐-手动火力全开房间搜索，用户可以自行选择跳转；⛔-火力停止状态，初始化组件展示数据或停止弹幕；🔥-火力搜寻状态，自动搜索火力全开筛选的房间，火力停止>60s重新搜寻，筛选条件详见脚本更新描述；💥-弹幕轰炸功能，满足🔥的房间，切换到💥会自动发弹幕，发送时间根据弹幕间隔数和房间热度计算，根据火力全开有无自动发停，弹幕内容根据房间的二级类别从本地与云端弹幕库随机抽取;">
        <label for="ceaseFire" class="radio">
            <span class="radio-bg"></span>
            <input type="radio" name="radio_fire" id="ceaseFire"  value="⛔" checked="checked"/>⛔
            <span class="radio-on"></span>
        </label>
        <label for="openFire" class="radio">
            <span class="radio-bg"></span>
            <input type="radio" name="radio_fire" id="openFire"  value="🔥" />🔥
            <span class="radio-on"></span>
        </label>
        </dfn>
        */}).toString().split('/*')[1].split('*/')[0].replace(/[\n]/g, '');

        // 创建火力寻找跳转按钮，按钮样式依赖斗鱼
        var fireAllBtn = document.createElement("button");
        var outSpan = document.createElement("span");
        outSpan.className = "Title-blockInline";
        fireAllBtn.innerHTML = "🧐开火";
        fireAllBtn.className = "Wallet-content-recharge"; //这个控制按钮样式,如Category-item, BackpackButton,PlayerToolbar-getYCBtn
        fireAllBtn.addEventListener("click", randomFireRequest);
        var blankTag = document.createElement("span");
        blankTag.innerHTML = "&nbsp;&nbsp;&nbsp;";
        var reportNode = document.querySelector(".Title-headline");//获取锚点
        if(reportNode != undefined){
            outSpan.appendChild(blankTag);
            outSpan.appendChild(fireAllBtn);
            reportNode.appendChild(outSpan);
            // reportNode.parentNode.parentNode.insertBefore(outSpan,reportNode.parentNode);
        }else {
            console.error("未找到举报元素节点，无法创建【🔥】按钮");
        }

        //这里要先创建标签，然后动态添加onchange事件，否则获取不到监听对象
        var sortNode = document.querySelector(".Title-categoryWrap");//获取锚点
        var seekTag = document.createElement("div");
        seekTag.className = "Title-anchorInfo";
        seekTag.innerHTML = radioBtnTag;
        if(sortNode !=undefined){
            sortNode.firstChild.append(seekTag);
            sortNode.insertBefore(seekTag,sortNode.firstElementChild.nextSibling);
            var anchor1 = document.getElementById("ceaseFire");
            anchor1.addEventListener("change",(function(){radioFunc('ceaseFire');}));
            var anchor2 = document.getElementById("openFire");
            anchor2.addEventListener("change",(function(){radioFunc('openFire');}));
        }else{
            console.error("未找到标题元素节点，无法创建radio单选框");
        }
    }

    // localStorage清空垃圾数据,防斗鱼收集用户信息
    function storageOperate(){
        var storage = window.localStorage;
        storage.removeItem("game_recode_listdata_h5p_room");
        for(let i = 0; i< storage.length; i++ ){//取出跳转数据
            if(storage.key(i).indexOf("FIRE_POWER_ACT_") != -1 || storage.key(i).indexOf("RankCoverage_vesion_") != -1 || storage.key(i).indexOf("RankCoverage_vesion_") != -1){
                storage.removeItem(storage.key(i));
            }
        }
    }

    //禁言判断（true是被禁言，false为没有禁言）
    function banSpeak(){
        var banObj = document.getElementsByClassName("MuteStatus is-mute")[0];
        if(banObj!=undefined && banObj.innerHTML.indexOf("禁言")!=-1){
            return true;
        }else{
            return false;
        }
    }

    // 参与条件,是否要求为-粉丝团成员  true为粉丝，false为非粉
    function joinCondition(){
        var joinFlag = false;
        var joinObj = document.getElementsByClassName("FirePowerChatModal-content")[0];
        if(joinObj != undefined){
            joinObj = joinObj.innerText;
            if(joinObj.indexOf("粉丝团成员") != -1){
                joinFlag = true;
                console.log("热度高中奖难，请跳转！");
            }
        }
        return joinFlag;
    }

    // 主播热度筛选
    function hotFilter() {
        let hotFlag = true;
        let hotValue = document.getElementsByClassName("Title-anchorText")[0];//主播热度
        if (hotValue != undefined) {
            tmGap = 10000;
            if (hotValue.innerText <= 1000) {
                tmGap = tmGap + 5000;
            } else if(hotValue.innerText > 1000 && hotValue.innerText <= 10000 ){
                tmGap = tmGap + 2000;
            } else if(hotValue.innerText > 10000 && hotValue.innerText <= 100000){
                tmGap = tmGap ;
            } else if(hotValue.innerText > 100000 && hotValue.innerText <= 300000){
                tmGap = tmGap - 2000;
            } else if(hotValue.innerText > 300000 && hotValue.innerText <= 500000){
                tmGap = tmGap - 4000;
                console.log("热度高中奖难，请跳转！");
                hotFlag = false;
            } else {
                tmGap = tmGap - 6000;
                console.log("热度高中奖难，请跳转！");
                hotFlag = false;
            }
        }else{
            console.error("未获取到热度值，请刷新页面重试！");
            // location.reload(true);
        }
        return hotFlag;
    }

    // 判断奖品是否是鱼丸或红包奖励
    function awardJudge() {
        var awardDet = document.querySelector(".FirePowerChatModal-detail");//红包
        var awardStr = document.querySelector(".FirePowerChatModal-award");
        function awardConditionFilter(prizeObj){
            var awardFlag = false;
            if (prizeObj != undefined) {
                prizeObj = prizeObj.innerText;
                if(prizeObj.indexOf("鱼丸") != -1) {
                    if(prizeObj.indexOf("1个") == -1 && prizeObj.indexOf("2个") == -1 && prizeObj.indexOf("1条") == -1 && prizeObj.indexOf("2条") == -1 &&
                       (prizeObj.substring(prizeObj.indexOf("鱼丸")-3, prizeObj.indexOf("鱼丸")) >=100 || prizeObj.substring(prizeObj.indexOf("鱼丸")-4, prizeObj.indexOf("鱼丸")) >=100)){
                        awardFlag = true;
                    }else{
                        console.log("鱼丸奖励不达标-->内");
                    }
                }else if (prizeObj.indexOf("红包") != -1 || prizeObj.indexOf("现金") != -1) {
                    if(prizeObj.indexOf("0.01元") == -1 && prizeObj.indexOf("0.1元") == -1 && prizeObj.indexOf("0.5元") == -1 ){
                        awardFlag = true;
                    }else{
                        console.log("红包奖励不达标-->内");
                    }
                }else{
                    console.log("非实质性奖励-->中");
                }
            }else{
                // console.log( prizeObj == document.querySelector(".FirePowerChatModal-award") ? "无奖品锚点-->外":"无详情锚点-->外");
            }
            return awardFlag;
        }
        return awardConditionFilter(awardStr) || awardConditionFilter(awardDet) ;
    }

    // 调整画质， 1.最高画质； 其他.最低画质
    function adjustClarity(code){
        var videoClarity = document.querySelector(".panelFill-d95ee8");
        if(videoClarity != undefined && videoClarity != null){
            code===1 ? videoClarity.previousSibling.firstElementChild.click() : videoClarity.previousSibling.lastElementChild.click();
        }else{
            console.log("没有画质📺选项！");
        }
    }

    // 记忆滚屏弹幕开关
    function screenBarrageMemory(){
        var closeBarrageObj = document.getElementsByClassName("showdanmu-42b0ac")[0];
        var closeBarrageViceObj = document.getElementsByClassName("hidedanmu-5d54e2")[0];
        if(closeBarrageObj !=undefined ){
            var scrollStatus = localStorage.getItem("scrollBarrage➰🍚➰");
            if(scrollStatus == "close"){
                closeBarrageObj.click();
            }
            closeBarrageObj.addEventListener("mouseup",getScrollStatus);
            closeBarrageViceObj.addEventListener("mouseup",getScrollStatus);
        }else{
            checkDelayCallback(4);//延迟等待元素标签加载
        }
    }

    // 监听用户更改滚屏弹幕状态
    function getScrollStatus(){
        var scrollBarrageObj = document.getElementsByClassName("showdanmu-42b0ac removed-9d4c42")[0];//滚屏弹幕关闭状态
        scrollBarrageObj == undefined ? localStorage.setItem("scrollBarrage➰🍚➰","close") : localStorage.setItem("scrollBarrage➰🍚➰","open");

    }

    // 记忆自动播放开关
    function autoPlayMemory(){
        var playObj = document.getElementsByClassName("play-8dbf03")[0];
        var pauseObj = document.getElementsByClassName("pause-c594e8")[0];
        if(pauseObj!=undefined){
            var autoPlayStatus = localStorage.getItem("autoPlayStatus📀📺📀");
            if(autoPlayStatus == "close"){
                pauseObj.click();
            }
            playObj.addEventListener("mouseup",getAutoPlayStatus);
            pauseObj.addEventListener("mouseup",getAutoPlayStatus);
        }else{
            checkDelayCallback(3);//延迟等待元素标签加载
        }
    }

    // 监听用户更改自动播放状态
    function getAutoPlayStatus(){
        var autoPlayObj = document.getElementsByClassName("pause-c594e8 removed-9d4c42")[0];//播放器暂停状态
        autoPlayObj == undefined ? localStorage.setItem("autoPlayStatus📀📺📀","close") : localStorage.setItem("autoPlayStatus📀📺📀","open");
    }

    //获取不同用户的标识，初次访问会延迟获取uname,不考虑uname变更
    function getUserInfo(){
        uid = document.querySelector(".UserInfo-avatar");
        uid = uid != undefined ? uid.firstElementChild.getAttribute("uid"):"未知";
        if(localStorage.getItem(uid+"🌴🔮🌴")!=null){//如果缓存有uid和uname,则不请求网络
            uname = localStorage.getItem(uid+"🌴🔮🌴");
        }else{
            var ajax = new XMLHttpRequest();
            ajax.timeout = 2000;
            ajax.responseType ="document";
            ajax.open('get', 'https://www.douyu.com/member/cp',true);//采用异步
            ajax.send();
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    var htmlDoc = ajax.responseXML;
                    uname = htmlDoc.querySelector(".uname_con").innerText.trim()
                    localStorage.setItem(uid+"🌴🔮🌴", uname);
                }
            }
        }
    }

    // 增加代码统计，主要测试下云端弹幕访问频次，如果频次高的话，后期增加本地缓存
    function jsonAnalytics(){
        //all sites statistics
        var siteId = '1278051049';
        var statJs = document.createElement('script');
        statJs.type = 'text/javascript';
        statJs.async = true;
        statJs.charset = 'utf-8';
        statJs.src = 'https://w.cnzz.com/c.php?async=1&id=' + siteId;
        var rootJs = document.getElementsByTagName('script')[0];
        rootJs.parentNode.insertBefore(statJs, rootJs);
    }

    // 获取当前房间的roomId
    function getRoomId(){
        roomId = document.getElementsByClassName("Title-anchorName")[0];
        roomId = roomId!=undefined ? roomId.getAttribute("href").substr(roomId.getAttribute("href").indexOf("room_id=")+8):undefined;
    }

   // 显示当前直播间主播信用，真实人数，和累计开播时间在房间热度图标左侧
    function realPersonNum(){
        var dailyJumpCount = localStorage.getItem((new Date()).toLocaleDateString() + "📱🌐📱[" + uname + "]");
        dailyJumpCount = dailyJumpCount!=null?dailyJumpCount:0;
        var showPosition = document.querySelector(".Title-anchorHot");
        var divTag = document.createElement("div");
        divTag.className = "Title-anchorName";
        divTag.innerHTML = "<dfn id = 'real_person_num' data-info='点击此区域可以更新以下四组数据，图标说明如下： 🌐-今日跳转次数(仅统计用此脚本自动或手动跳转)； 💎-主播当前信用值(若<=4则不能送礼物,满值12)； 🎅-当前房间在线人数(未开播房间则为0未统计)； ⏰-房间本次开播时间累计/min(未开播则为【-】);'> 🌐- 💎- 🎅- ⏰- </dfn>";//显示当前跳转次数，主播信用，真实人数，和累计开播时间
        showPosition.parentNode.insertBefore(divTag, showPosition);
        realPersonNumRefresh();//更新数据；
        divTag.addEventListener("click",realPersonNumRefresh);
    }

    //自动刷新真实人数
    function realPersonNumRefresh(){
        var dailyJumpCount = localStorage.getItem((new Date()).toLocaleDateString() + "📱🌐📱[" + uname + "]");
        dailyJumpCount = dailyJumpCount!=null?dailyJumpCount:0;
        fetch('https://www.douyu.com/swf_api/h5room/'+ roomId).then(res => {
            return res.json();
        }).then(json => {
            var personNum = json.data.online;
            var curCredit = json.data.cur_credit;
            var liveStatus = json.data.show_status;
            var liveTime = json.data.show_time;
            // var barrageDelay = jsonData.data.room_dm_delay;
            var onlineTime = 0;
            if(liveStatus == "1"){//开播
                onlineTime = ((Math.round((new Date()).getTime()/1000) - parseInt(liveTime))/60).toFixed(1);// 显示房间已经直播的分钟数,保留一位小数，来显示秒
            }else{
                onlineTime = "-"
            }
            var peopleObj = document.getElementById("real_person_num");
            if(peopleObj!=undefined){
                peopleObj.innerHTML = "🌐"+dailyJumpCount +"&nbsp;💎"+curCredit +"&nbsp;🎅"+ personNum + "&nbsp;⏰" + onlineTime + "&nbsp;";
            }
        }).catch(err => {
            console.error('请求错误', err);
        })
    }

    //不绑定手机号发弹幕(前提是必须是其他账号登陆状态，非登陆状态不行)
    function releasePhoneLimit(){
        var btnGray = document.getElementsByClassName("ChatSend-button is-gray")[0];
        var chatLogin = document.getElementsByClassName("MuteStatus is-noLogin")[0];
        btnGray!=undefined ? btnGray.className = "ChatSend-button ":false;
        chatLogin!=undefined ? chatLogin.remove():false;
    }

    // 参与条件关注，则自动点击关注   #关注  #取关
    function followRoom() {
        var subObj = document.querySelector(".Title-followBtn");
        var followCheck = document.getElementsByClassName("Title-followBtnBox is-followed")[0];//已关注检测
        if (subObj != undefined && followCheck==undefined) {
            subObj.click();
            console.log("已经关注💓主播");
            setTimeout(autoAssign, 1000);//房间延时签到
        }
    }

    // 房间自动签到
    function autoAssign(){
        var anchorLevel = (document.getElementsByClassName("AnchorLevel")[0]).getAttribute("class").substring(24);
        if(anchorLevel>=30 ){//排除已签到
            let assignObj = document.getElementsByClassName("RoomLevelDetail-icon")[0];//签到按钮是否加载检测
            let followCheck = document.getElementsByClassName("Title-followBtnBox is-followed")[0];//已关注检测
            if(assignObj!=undefined && followCheck!=undefined){
                var unassign = document.getElementsByClassName("RoomLevelDetail-icon RoomLevelDetail-icon--zn")[0];
                unassign!=undefined?unassign.click():undefined;//点击签到按钮
                console.log("房间已📝签到！");
            }else{
                checkDelayCallback(5);
            }
        }
    }

    //房间签到排行显示
    function assignRank(){
        var anchorLevel = (document.getElementsByClassName("AnchorLevel")[0]).getAttribute("class").substring(24);
        var showPlace = document.querySelector(".Title-anchorHot");
        // 获取当前房间签到的排名
        if(anchorLevel>=30){//不排除已签到，因为还需要手动刷新
            var refreshTag = document.createElement("dfn");
            refreshTag.setAttribute("id","assign_Rank");
            refreshTag.setAttribute("class","Title-anchorName");
            refreshTag.setAttribute("data-info","📝-表示当前房间已签到人数，点击可以刷新，如果主播等级<Lv30无房间签到，则无此图标，可统计前100的排名;");
            refreshTag.innerHTML= "📝-";
            showPlace.parentNode.insertBefore(refreshTag, showPlace);
            assignRefresh();
            refreshTag.addEventListener("click",assignRefresh);
        }
    }

    //签到排行自动刷新
    function assignRefresh(){
        fetch('https://www.douyu.com/japi/roomuserlevel/apinc/getSignInRankInfoList?rid='+roomId).then(res => {
            return res.json();
        }).then(json => {
            var jsonData = json.data;
            var assignId = document.getElementById("assign_Rank");
            assignId.innerHTML = jsonData.length <100? "📝"+jsonData.length:"📝100+";
            console.log("📝房间签到人数:"+jsonData.length);
        }).catch(err => {
            console.error('请求错误', err);
        })
    }

    // 斗鱼平台礼物展示     需要用到postMessage页面传值gift_json
    function giftView(){
        var giftDataLength = localStorage.getItem("giftData💖🎁💖");
        var dailyPageCount = localStorage.getItem((new Date()).toLocaleDateString() + "📱🌐📱[" + uname + "]");
        var showPlace = document.querySelector(".Title-anchorHot");
        var giftTag = document.createElement("dfn");
        giftTag.setAttribute("class","Title-anchorName");
        giftTag.setAttribute("data-info","🎁-表示平台礼物种类总量，点击可查看礼物图片，数据统计每天自动更新一次，图片则与服务端实时同步;");
        if( dailyPageCount!=null && giftDataLength!=null ){
            giftTag.innerHTML="<a href='https://popzoo.github.io/pop/giftshow.html' target='_blank' style='text-decoration:none;'>🎁"+giftDataLength+"</a>";
        }else{
            //获取所有礼物图片url,并展示
            fetch('https://webconf.douyucdn.cn/resource/common/gift/flash/gift_effect.json').then(res => {
                return res.text();
            }).then(result => {
                result = result.substring(17, result.length-2);
                var jsonData = JSON.parse(result);
                jsonData=jsonData.data.flashConfig;
                var jsonLength=0;
                for(let key in jsonData){
                    jsonLength++;
                }
                localStorage.setItem("giftData💖🎁💖",jsonLength);
                // localStorage.setItem("giftDataLength💖🎁💖",jsonLength);
                giftTag.innerHTML="<a href='https://popzoo.github.io/pop/giftshow.html' target='_blank' style='text-decoration:none;'>🎁"+jsonLength+"</a>";
            }).catch(err => {
                console.error('请求错误', err);
            })
        }
        showPlace.parentNode.insertBefore(giftTag, showPlace);
    }

    //抓捕幻神弹幕特效
    function captureDeityBarrage() {
        var chatBarrage = document.getElementById("js-barrage-list");
        //https://res.douyucdn.cn/resource/2019/08/15/common/4e85776071ffbae2867bb9d116e9a43c.gif
        if(chatBarrage.innerHTML.indexOf("/2019/08/15/common/4e85776071ffbae2867bb9d116e9a43c.gif")>-1){
            localStorage.setItem("🍅🥦🍅chatBarrageEffect",chatBarrage.innerHTML);
            localStorage.setItem("🍅🥦🍅screenBarrageEffect", document.querySelector(".danmu-6e95c1").innerHTML);
        }
    }

    // 重新点击radio的跳转处理
    function openFireStatus(){
        var fireCheck = document.querySelector(".FirePowerChatModal-Notice");//检测火力全开
        if( fireCheck != undefined && hotFilter() && awardJudge() && !joinCondition() && !banSpeak() ){ //判断奖品、热度数量和是否要求粉丝团,hotFilter需要初始化
            followRoom();//自动关注主播
            firePowerMsg();//立即执行火力全开
        }else{//有火力不符合筛选
            console.log("不符合开火🔥条件，3s自动跳转新房间🏠");
            fireSeekJump = setTimeout(function(){randomFireRequest(1)},3000);
        }
    }

    // 监听radio的onchange事件
    function radioFunc(msg){
        if(msg == "ceaseFire"){//停火
            radioStorage = "ceaseFire";
            localStorage.setItem("radioTagStatus🌼🍄🌼",msg);
            clearTimeout(firePowerTimeout);
            clearTimeout(fireSeekJump);
            console.log("⛔停止开火");
        }else if(msg =="openFire"){//开火
            radioStorage = "openFire";
            localStorage.setItem("radioTagStatus🌼🍄🌼",msg);
            clearTimeout(firePowerTimeout);
            clearTimeout(fireSeekJump);
            openFireStatus();
        }
    }

    //===============================================================
    //++++++++++主函数入口区域,根据元素加载进度自动开始初始化程序++++++++
    //===============================================================
    function programInitCheck(){ //自动检测浏览器出现火力全开后则执行脚本
        radioStorage = localStorage.getItem("radioTagStatus🌼🍄🌼")!=null? localStorage.getItem("radioTagStatus🌼🍄🌼"): "ceaseFire";
        var chatCheck = document.querySelector(".ChatSend");//检测聊天区加载
        if(chatCheck==undefined){
            checkDelayCallback(0);
        }else{//执行初始化组件
            sbts = (new Date()).getTime();//记录初始化时间戳
            msgTxt = document.querySelector(".ChatSend-txt");
            msgBtn = document.querySelector(".ChatSend-button");
            // msgBtn.addEventListener("mouseup",clickBtnEvent);//绑定鼠标事件
            // document.onkeydown = function(e){e.keyCode==13?clickBtnEvent():false}//绑定键盘事件
            creatBtnTag();//先添加手动按钮
            var radioNode = document.getElementById(radioStorage);
            radioNode.setAttribute("checked","checked");
            jsonAnalytics();//云弹幕计数
            screenBarrageMemory();//记忆滚屏弹幕状态
            autoPlayMemory();//记忆自动播放状态
            getUserInfo();//依据用户id分类，前置执行
            getRoomId();//获取房间真实ID
            giftView();//礼物种类加载
            realPersonNum();//房间真实人数模块加载
            setTimeout(assignRank, 1000);//房间延时签到,需要roomId
            setTimeout(releasePhoneLimit,3500);//去除手机绑定的限制
            hotFilter();//获取tmGap
            cloudBarrage();//云弹幕加载
            autoAssign();//房间自动签到
            // setInterval(captureDeityBarrage,7000);//抓捕幻神弹幕特效，建议用户打开帮博主抓幻神
            sbts = (new Date()).getTime();//记录初始化时间戳
            checkDelayCallback(1);//继续延迟回调
        }
    }

    //回调延迟函数检测
    function checkDelayCallback(code){
        if(code===0){
            setTimeout(programInitCheck,1000);
        }else if(code===1){
            setTimeout(barrageInitCheck,1000);
        }else if(code===2){//暂无火力等待
            if(((new Date()).getTime() - sbts)/1000 > 12){//超过12s没检测到火力则自动执行下列操作
                if(radioStorage =="openFire"){
                    fireSeekJump = setTimeout(function(){randomFireRequest(1)},3000);
                }else if(radioStorage == "ceaseFire"){
                    console.log("初始化火力🔥停止，等待用户的操作");
                }
            }else{
                setTimeout(barrageInitCheck,1000);
            }
        }else if(code===3){
            if(((new Date()).getTime() - sbts)/1000 < 15){
                setTimeout(autoPlayMemory,1000);//关闭自动播放，延迟15s等待元素标签加载
            }
        }else if(code===4){
            if(((new Date()).getTime() - sbts)/1000 < 15){
                setTimeout(screenBarrageMemory,1000);//恢复记忆滚屏弹幕，延迟等待15s元素标签加载
            }
        }else if(code===5){
            if(((new Date()).getTime() - sbts)/1000 < 15){
                setTimeout(autoAssign,1000);//恢复记忆滚屏弹幕，延迟等待15s元素标签加载
            }
        }
    }

    //弹幕组件初始化检测
    function barrageInitCheck(){
        var fireCheck = document.querySelector(".FirePowerChatModal-Notice");//检测火力全开
        if(fireCheck!=undefined){//有火力全开
            if( hotFilter() && awardJudge() && !joinCondition() && !banSpeak() && radioStorage=="openFire"){ //判断奖品、热度数量和是否要求粉丝团,hotFilter需要初始化
                console.log("符合开火🔥条件，初始化准备开火");
                followRoom();//自动关注主播并房间签到
                // adjustClarity(0);//调整画质，其他.画质最低,1.画质最高
                firePowerMsg();//立即执行火力全开
                setTimeout(storageOperate, 10000);//自动清理localStorage
            }else{//有火力不符合条件
                if(radioStorage == "openFire"){
                    console.log("不符合开火🔥条件，3秒后自动跳转新房间🏠");
                    fireSeekJump = setTimeout(function(){randomFireRequest(1)},3000);
                }else if(radioStorage =="ceaseFire"){
                    console.log("初始化火力🔥停止，等待用户的操作🏠");
                }
            }
        }else{//无火力全开，限时等待
            checkDelayCallback(2);
        }
    }

    setTimeout(programInitCheck, 4000); //4S后按页面加载进度自动设定执行脚本初始化加载时间

})();
