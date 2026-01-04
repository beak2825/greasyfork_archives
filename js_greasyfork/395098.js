// ==UserScript==
// @name         自动任务
// @namespace    auto task
// @version      1.7.10
// @description  自动完成并验证赠key网站任务
// @author       HCLonely
// @iconURL      https://upload.cc/i1/2019/09/05/ZpGoAN.jpg
// @include      *://www.grabfreegame.com/giveaway/*
// @exclude      /.*?:\/\/www.grabfreegame.com\/giveaway\/.*?\/\?.*/
// @include      *://www.bananagiveaway.com/giveaway/*
// @exclude      /.*?:\/\/www.bananagiveaway.com\/giveaway\/.*?\/\?.*/
// @include      *://gamecode.win/giveaway/*
// @include      *://whosgamingnow.net/giveaway/*
// @include      *://marvelousga.com*
// @include      *://dupedornot.com*
// @include      *://gamezito.com*
// @include      /https?:\/\/gamehag.com\/.*?giveaway\/.*/
// @include      *://giveawayhopper.com/giveaway/*
// @include      *://chubkeys.com/giveaway/*
// @include      *://olympus.website/giveaway/*
// @include      *://giveaway.su/giveaway/view/*
// @include      *://gleam.io/*
// @include      *://gamehunt.net/distribution/*
// @include      *://gkey.fun/distribution/*
// @include      *://www.indiedb.com/giveaways/*
// @include      *://www.spoune.com/*
// @exclude      *://www.spoune.com/werbung/*
// @exclude      /https?:\/\/www.spoune.com\/.*?verify\-api.*/
// @include      *://prys.ga/giveaway/?id=*
// @include      *://prys.revadike.com/giveaway/?id=*
// @include      *://steam.supply/Giveaway*
// @include      *://*freegamelottery.com*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @require      https://greasyfork.org/scripts/379868-jquery-not/code/jQuery%20not%20$.js?version=746319
// @resource     bootstrapCSS https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.min.css
// @supportURL   https://steamcn.com/t455167-1-1
// @homepage     https://blog.hclonely.com/?topic=%e8%87%aa%e5%8a%a8%e4%bb%bb%e5%8a%a1
// @connect      *
// @compatible   chrome 没有测试其他浏览器的兼容性
// @downloadURL https://update.greasyfork.org/scripts/395098/%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/395098/%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

'use strict';

try{

    const SETTING={
        version:GM_info.script.version,
        autoOpen:true,//true为自动打开任务页面;改为false则不打开任务页面
        updateText:'！！！开启下个大版本测试，对新版脚本功能有什么建议请前往<a href="https://ask.hclonely.com/article/1" target="_blank">此页面</a>讨论',
    };
    let setting=GM_getValue("setting")||{};
    let ats={};
    let updateText;
    if(SETTING.version!=setting.version){
        setting.version=SETTING.version;
        setting.updateText=SETTING.updateText;
        for(let i in SETTING){
            ats[i]=setting[i]||SETTING[i];
        }
        GM_setValue("setting",ats);
    }
    setting=GM_getValue("setting");
    let autoOpen=setting['autoOpen'];

    let url=window.location.href;
    const joinAndFollow=`正在做加组、关注等任务(此功能需要<a href="https://greasyfork.org/zh-CN/scripts/34764-giveaway-helper" target="_blank">Giveaway Helper脚本</a>,没有则自动跳过此步骤)，请稍候！`

    $css(`
#info{max-height:210px;overflow-y:auto;padding:0 !important}
#exInfo{position:fixed;right:50px;bottom:10px;max-width:600px;max-height:250px;z-index: 99999999999;display:none;background-color:#fff;padding:1.5rem}
.infos{position:absolute;top:0px;left:0px;background-color:#757d81;border-radius: 3px !important;padding: 0px 2px !important;width:20px;height:20px}
#shouqi{font-weight:900;color:#00e5ff}
#fixed-banana,cloudflare-app{display:none !important}
.setting{width:145px;background:white;border:2px solid;border-radius:5px;}
#doTaskDiv{position:fixed;right:20px;top:130px !important;width:145px;z-index: 99999999999;}
.auto-task{width:145px !important;}
.auto-task{cursor: pointer;display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;user-select: none;border: 1px solid transparent;padding: 0.375rem 0.75rem;font-size: 1rem;line-height: 1.5;transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;}
.auto-task{-webkit-box-shadow: 0 5px 25px -3px #F03434;background: #F03434;color: white;border-radius: 4px !important;border-color: #29363d;margin: 0 !important;font: 400 13.3333px Arial;height:38px}
.auto-task:hover{background: #ee1c1c;}
.auto-task:focus{outline: 5px auto -webkit-focus-ring-color;}
`);

    let div=$ele({ele:"div","id":"doTaskDiv","class":"card-content",parent:$tag("body")[0]});
    let doTaskBtn=$ele({ele:"button","id":"doTask","class":"auto-task btn btn-default",title:"一键做任务+验证",parent:div,text:"FuckTask"});
    let verifyBtn=$ele({ele:"button","id":"verify","class":"auto-task btn btn-default",title:"一键验证",parent:div,text:"Verify"});
    let removeBtn=$ele({ele:"button","id":"remove","class":"auto-task btn btn-default",title:"一键退组,取关",parent:div,text:"Remove"});
    let settingBtn=$ele({ele:"button",parent:div,class:"auto-task btn btn-default",id:"Setting",title:"设置",onclick:settingFuc,text:"⚙设置"});
    $jq(".auto-task").click(showUpdate);
    let div3=$ele({ele:"div","id":"exInfo",parent:$tag("body")[0],html:`<span class="infos"><a id="shouqi" class="zhankai" href="javascript:;"" title="收起">↘</a></span>`});
    let div2=$ele({ele:"div","id":"info","class":"card-body card",parent:div3});
    $id("shouqi").onclick=function(e){
        e=$id("shouqi").className=="zhankai"?["20px","↖","展开","shouqi","none"]:["","↘","收起","zhankai","block"];
        div3.style.width=e[0];
        div3.style.height=e[0];
        $id("shouqi").innerText=e[1];
        $id("shouqi").setAttribute("title", e[2]);
        $id("shouqi").setAttribute("class", e[3]);
        div2.style.display=e[4];
    }

    if(/marvelousga|dupedornot|gamezito/.test(url)){//marvelousga,dupedornot,gamezito领key

        /gamezito/.test(url)?setH(130):setH(90);

        if($jq("body").text().match(/THIS GIVEAWAY IS CLOSED FOR THE MOMENT/gim)!=null){//检测是否有key
            if(confirm("此页面已经没有key了，是否关闭？")) window.close();
        }

        if(/You need to be logged in to perform all tasks/gim.test($tag("body")[0].innerText)) window.location.href="/login";//自动跳转到登录页面

        let game=$jq("#giveawaySlug").val();

        $jq('cloudflare-app[app="welcome-bar"]').remove();
        let w=0;
        banNewBlock();

        //marvelousga,dupedornot,gamezito浏览页面任务
        function finTask(taskId,e,text,task){
            let p=info("card-text monospace","",`开始任务${taskId}:${text}...`);
            httpSend({
                type: "post",
                url: task?"/ajax/verifyTasks/webpage/clickedLink":"/ajax/verifyTasks/video/finished",
                headers:{'x-csrf-token': $jq('meta[name="csrf-token"]').attr('content')},
                data:{
                    giveaway_slug: game,
                    giveaway_task_id: taskId
                },
                callback: function (data) {
                    if(data.status==200){
                        if(data.json.status==1){
                            $id((task?"task_webpage_visit_":"task_video_watched_")+taskId).innerText="OK";
                            addR(p,"OK!");
                        }else{
                            let msg=data.json.message||"ERROR";
                            addR(p,msg,"err");
                        }
                    }else{
                        addR(p,`${data.statusText}:${data.status}`,"err");
                    }
                    if(e===w) getId();
                }
            });
        }

        //marvelousga,dupedornot,gamezito获取任务id
        function getId(provider=[],taskRoute=[],taskID=[],btn_id=[],p_id=[]){
            $jq("button[id^='task_']:not(:contains('VERIFIED'))").map((i,e)=>{
                let thisBtn = $(e);
                provider.push(thisBtn.attr('id').split('_')[1]);
                taskRoute.push(thisBtn.attr('id').split('_')[2]);
                taskID.push(thisBtn.attr('id').split('_')[3]);
                btn_id.push(e.id);
                /gamezito/.test(url)?p_id.push($jq.trim($(e).parent().parent().find("h3")[0].innerHTML.replace(/id\=\"[\w\W]*?\"/i,""))):p_id.push($jq.trim($(e).parent().find("p")[0].innerHTML.replace(/id\=\"[\w\W]*?\"/i,"")));
            });
            if(taskID.length>0){
                verify(provider,taskRoute,taskID,btn_id,p_id,0);
            }else{
                info("card-text monospace","color:green",`所有任务验证完成！`);
                getKey();
            }
        }

        //marvelousga,dupedornot,gamezito验证任务
        function verify(provider,taskRoute,taskID,btn_id,p_id,e,v=0){
            if(/visit[\w\W]*?webpage/gim.test(p_id[e])&&v==1){
                e++;
                if(e<btn_id.length){
                    verify(provider,taskRoute,taskID,btn_id,p_id,e);
                }else{
                    info("card-text monospace","color:green",`所有任务验证完成！`);
                    getKey();
                }
                return;
            }else{
                if(/visit[\w\W]*?webpage/gim.test(p_id[e])&&v!=1) v=1;
                let p=info("card-text monospace","",`验证任务${taskID[e]}:${p_id[e]}...`);
                if(/Join[\w\W]*?in Steam/i.test(p_id[e].innerText)){
                    $id(btn_id[e]).removeAttribute("disabled");
                    $id(btn_id[e]).click();
                }
                httpSend({
                    type: "post",
                    url: '/ajax/verifyTasks/' + provider[e] + '/' + taskRoute[e],
                    headers:{'x-csrf-token': $jq('meta[name="csrf-token"]').attr('content')},
                    data:{
                        giveaway_slug: game,
                        giveaway_task_id: taskID[e]
                    },
                    callback: function (data) {
                        if(data.status==200){
                            if(data.json.status==1){
                                let thisBtn=$jq('#'+btn_id[e]);
                                thisBtn.text('VERIFIED')
                                thisBtn.attr('disabled', true);
                                thisBtn.attr('data-disabled', 1);
                                p.innerHTML+="<font style='color:green'>OK!</font>--<font style='color:blue'>"+data.json.percentageNanoBar+"%</font>";
                            }else{
                                $id(btn_id[e]).innerText="ERROR!";
                                $id(btn_id[e]).style.color="red";
                                autoOpen&&(/gamezito/gim.test(url)?$id(btn_id[e]).parentNode.parentNode.getElementsByTagName("a")[0].click():$id(btn_id[e]).parentNode.getElementsByTagName("a")[0].click());
                                let msg=data.json.message||"ERROR";
                                addR(p,msg,"err");
                            }
                            e++;
                            if(data.json.percentageNanoBar==100||e>=btn_id.length){
                                info("card-text monospace","color:green",`所有任务验证完成！`);
                                getKey();
                            }else{
                                verify(provider,taskRoute,taskID,btn_id,p_id,e,v);
                            }
                        }else{
                            $id(btn_id[e]).innerText="ERROR!";
                            $id(btn_id[e]).style.color="red";
                            data.status!=419&&($id(btn_id[e]).parentNode.getElementsByTagName("a")[0].click());
                            addR(p,`${data.statusText}:${data.status}`,"err");
                            e++;
                            if(e<btn_id.length){
                                verify(provider,taskRoute,taskID,btn_id,p_id,e);
                            }else{
                                info("card-text monospace","color:green",`所有任务验证完成！`);
                                getKey();
                            }
                        }
                    },
                });
            }
        }

        //marvelousga,dupedornot,gamezito获取steamkey
        function getKey(){
            if(/your[\s]*?key[\w\W]*?[\w\d]{5}(-[\w\d]{5}){2}/gim.test($tag("body")[0].innerText)){
                info("card-text monospace","",`你已经领取过key了！`);
                return 0;
            }
            $jq("#get_key_container").show();
            info("card-text monospace","",`请手动完成<a id="google" href="javascript:void(0)">谷歌验证</a>获取key!`);
            $id("google").onclick=()=>{
                $id("get_key_container").scrollIntoView();
                $jq("#get_key_container .card-body").css('background-color','red');
                setTimeout(()=>{$jq("#get_key_container .card-body").css('background-color','')},600);
            };
            $jq("#exInfo").show();
            $id("get_key_container").scrollIntoView();
            $jq("#get_key_container .card-body").css('background-color','red');
            setTimeout(()=>{$jq("#get_key_container .card-body").css('background-color','')},600);
        }

        //marvelousga,dupedornot,gamezito按钮定义
        doTaskBtn.onclick=()=>{
            $jq("#exInfo").show();
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            info("card-text monospace","",joinAndFollow);
            doTask(()=>{
                w=0;
                if($jq("video").length>0){
                    w++;
                    finTask($jq("video").parent().parent().parent().parent().find("button.btn-dark")[0].id.replace(/task_video_watched_/,""),"","Watch this video",0);
                }
                $jq("a:contains('this')").map((i,e)=>{
                    if(/task_(webpage_clickedLink|video_watched)_[\d]*/.test(e.id)&&!/verified/i.test($jq(e).parent().parent().find("button")[0].innerText)){
                        let taskId=e.id.replace(/task_webpage_clickedLink_|task_video_watched_/,"");
                        let text=$jq(e).parent().html().replace(/id\=\"[\w\W]*?\"/i,"");
                        w++;
                        finTask(taskId,w,text,1);
                    }
                });
                if(w==0) getId();
            },new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };
        verifyBtn.onclick=()=>{
            $jq("#exInfo").show();
            getId();
        };
    }

    if(/gamecode/.test(url)){//gamecode领key

        if($jq("body").text().match(/THIS GIVEAWAY IS CLOSED FOR THE MOMENT/gim)!=null){//检测是否有key
            if(confirm("此页面已经没有key了，是否关闭？")) window.close();
        }

        if(/Please login to see the tasks/gim.test($tag("body")[0].innerText)) window.location.href="/login";//自动跳转到登录页面

        banNewBlock();

        //gamecode按钮定义
        doTaskBtn.onclick=()=>{
            $jq("#exInfo").show();
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            info("card-text monospace","",joinAndFollow);
            doTask(gamecode_task,new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };
        verifyBtn.onclick=()=>{
            $jq("#exInfo").show();
            gamecode_task();
        };

        let t=0;
        $jq("#doTask").one('click',()=>{
            if(t==0){
                gamecode_result();
                t++;
            }
        });
        $jq(verifyBtn).one('click',()=>{
            if(t==0){
                gamecode_result();
                t++;
            }
        });

        //gamecode做任务$(".btn.btn-theme:not('.auto-task'):not(:contains('VERIFIED'))")
        function gamecode_task(){
            info("card-title","color: #f38288",`正在自动做任务，任务完成后请手动完成谷歌验证领取key!`);
            $jq(".btn.btn-theme:not('.auto-task'):not(:contains('VERIFIED'))").map((i,e)=>{
                e.removeAttribute("disabled");
                e.click();
            });
            $jq("#button-container").show();
        }

        function gamecode_result(){
            let taskCard=$jq('.container .row .col-sm-4:visible:not(".col-sm-offset-4")');
            if(taskCard.length>0){
                taskCard.map((i,e)=>{
                    if($jq(e).find('button').text()=="VERIFIED"){
                        $jq(e).hide();
                    }else{
                        $jq(e).css('background-color','red');
                    }
                });
                setTimeout(gamecode_result,500);
            }else{
                $jq('.container .row .col-sm-4:not(:visible):not(".col-sm-offset-4")').removeAttr('style');
                $jq('.container .row .col-sm-4:not(:visible):not(".col-sm-offset-4")').show();
                $id("insertKey").scrollIntoView();
                info('card-title','color:green','所有任务已完成，请手动完成谷歌验证领取key!');
            }
        }
    }


    if(/grabfreegame|bananagiveaway/.test(url)){//grabfreegame,bananagiveaway领key

        setH(110);

        if($jq("div.left").text().match(/[\d]+/gim)[0]==0){//检测是否有key
            if(confirm("此页面已经没有key了，是否关闭？")) window.close();
        }

        if(/log.*?in/gim.test($jq(".user").text())) location.href=$jq(".user").children("a.steam")[0].href;//自动跳转到登录页面

        //grabfreegame,bananagiveaway按钮定义
        doTaskBtn.onclick=()=>{
            isBanana();
            $jq("#exInfo").show();
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            info("card-text monospace","",joinAndFollow);
            doTask(()=>{getBtn("d")},new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };
        verifyBtn.onclick=()=>{
            $jq("#exInfo").show();
            getBtn("v");
        };
        div2.setAttribute("style", `right:50px;bottom:10px;z-index: 99999999999;font-family: Menlo,Monaco,Consolas,"Courier New",monospace;font-size: 20px;background: #fff;color: #f05f00;border: 3px solid #ababab;order-radius: 8px;display: inline-block;`);

        $ele({ele:"button",parent:div,class:"auto-task",title:"一键加入愿望单&关注游戏",onclick:()=>{atw_fg_gfb(1)},html:"愿望单&关注"});
        $ele({ele:"button",parent:div,class:"auto-task",title:"一键移除愿望单&取关游戏",onclick:()=>{atw_fg_gfb(0)},html:"移除愿望单&取关"});

        let gameArray=[];
        let gameLength=0;
        let gameId=location.href.replace(/https?:\/\/www.g(rabfreegame|bananagiveaway).com\/giveaway\//gim,"").replace(/\/[\w\W]*/gim,"");

        function atw_fg_gfb(a=1){
            gameLength=0;
            $jq("#exInfo").show();
            let p=info("","",`正在获取游戏列表...`);
            if(empty(getCookie("game"+gameId))){
                if($jq('p:contains("Wishlist")').length>0){
                    let wishlistTask=$jq('p:contains("Wishlist")');//||$jq('ul.tasks li[data-url]')
                    wishlistTask.map(function(i,e){
                        if(!/Completed/gim.test($jq(e).parent().text())){
                            let href=$jq(e).parent().find("button:contains('To do')").attr("onclick").replace(/window.open\(\'|\'\)/gim,"");
                            get_appId_gfb({href:href},a);
                            gameLength++;
                        }
                    });
                }else if($jq('ul.tasks li[data-url]').length>0){
                    let wishlistTask=$jq('ul.tasks li[data-url]');
                    wishlistTask.map(function(i,e){
                        let href=$jq(e).attr("data-url");
                        get_appId_gfb({href:href},a);
                        gameLength++;
                    });
                }
                if(a==1){
                    var getGame=setInterval(()=>{
                        if(gameArray.length>=gameLength){
                            let game=unique(gameArray).join("h");
                            document.cookie="game"+gameId+"="+game+"; path=/";
                            clearInterval(getGame);
                        }
                    },1000);
                }
            }else{
                unique(getCookie("game"+gameId).split("h")).map(function(i){
                    get_appId_gfb({href:"https://store.steampowered.com/app/"+i,id:i},a);
                });
            }
            addR(p,"OK","success");
        }

        function w_f_gfb(appId,a){
            let p=info("","",`正在获取sessionID...`);
            httpSend({
                mode:"gm",
                url:"https://store.steampowered.com/app/"+appId,
                type:"get",
                callback:function(data){
                    if(data.text.indexOf('<a class="menuitem" href="https://store.steampowered.com/login/?')<0){
                        let html=data.text.match(/g\_sessionID.*?\=.*?\".*?\"/gim);
                        if(html.length>0){
                            addR(p,"OK","success");
                            let sessionID=html[0].match(/\".*?\"/gim)[0].replace(/\"/g,"");
                            a==1?wishlist(appId,sessionID,"addtowishlist"):wishlist(appId,sessionID,"removefromwishlist");
                            a==1?followGame(appId,sessionID,0):followGame(appId,sessionID,1);
                        }else{
                            addR(p,"sessionID获取失败！","err");
                        }
                    }else{
                        addR(p,`<a href="https://store.steampowered.com/login/" style="color:red" target="_blank">请先登录steam！</a>`,"html");
                    }
                }
            });
        }

        function get_appId_gfb(e,a){
            let p=info("","",`正在获取游戏Id...`);
            if(e.href.includes("steampowered")){
                addR(p,"OK","success");
                w_f_gfb(e.id,a);
            }else{
                httpSend({
                    mode:"gm",
                    url:e.href,
                    type:"get",
                    callback:function(data){
                        let appId=data.text.match(/https:\/\/store.steampowered.com\/app\/[\d]+?\//gim)[0].match(/[\d]+/gim)[0];
                        gameArray.push(appId);
                        addR(p,"OK","success");
                        w_f_gfb(appId,a);
                    }
                });
            }
        }

        //grabfreegame,bananagiveaway检测是否需要香蕉
        function isBanana(){
            let banana=$("p:contains('Collect'):contains('banana')");
            let points=$("p:contains('Collect'):contains('points')");
            if(banana.length>0){
                alert("此key需要收集"+banana.text().match(/[\d]+/gim)[0]+"个香蕉！");
            }
            if(points.length>0){
                alert("此key需要收集"+points.text().replace(/Collect/gi,""));
            }
        }

        //grabfreegame,bananagiveaway获取任务id
        function getBtn(e,verify_btn=[],do_btn=[]){
            $jq("button:contains('Verify'):not('#verify')").map((i,e)=>{
                verify_btn.push(e.onclick.toString().match(/\/\/www.(grabfreegame|bananagiveaway).com\/giveaway\/[\w\W]*?\?verify\=[\d]+/)[0]);
            });
            $jq("button:contains('To'):contains('do')").map((i,e)=>{
                e.onclick&&(do_btn.push(e.onclick.toString().match(/\/\/www.(grabfreegame|bananagiveaway).com\/giveaway\/[\w\W]*?\?q\=[\d]+/)[0]));
            });
            if(do_btn.length>0&&e==="d") gbDoTask(0,verify_btn,do_btn);
            if(verify_btn.length>0&&e==="v") bananaVerify(0,verify_btn);
        }

        //grabfreegame,bananagiveaway做任务
        function gbDoTask(e,verify_btn,do_btn){
            let taskId=do_btn[e].match(/\?q\=[\d]+/)[0];
            taskId=taskId.replace("?q=","");
            let p=info("code","",`执行任务:${taskId}...`);
            httpSend({
                type: "get",
                url: do_btn[e],
                timeout:"10000",
                callback: function (data) {
                    addR(p,"OK");
                    e++;
                    if(e<do_btn.length){
                        gbDoTask(e,verify_btn,do_btn);
                    }else{
                        if(verify_btn.length>0) bananaVerify(0,verify_btn);
                    }
                }
            });
        }

        //grabfreegame,bananagiveaway验证任务
        function bananaVerify(e,verify_btn){
            let taskId=verify_btn[e].match(/\?verify\=[\d]+/)[0];
            taskId=taskId.replace("?verify=","");
            let p=info("code","",`验证任务:${taskId}...`);
            httpSend({
                type: "get",
                url: verify_btn[e],
                timeout:"10000",
                callback: function (data) {
                    addR(p,"OK");
                    e++;
                    e<verify_btn.length?bananaVerify(e,verify_btn):bananaRe();
                }
            });
        }

        //grabfreegame,bananagiveaway刷新网页
        function bananaRe(){
            let ytb=$jq(".tasks:first li:contains('Subscribe'):contains('our'):contains('channel'):not(:contains('Completed'))");
            if(ytb.length>0){
                let ytbBtn=ytb.find("button")[1];
                ytbBtn.removeAttribute("disabled");
                ytbBtn.click();
            }else{
                let twitter=$jq(".tasks:first li:contains('Twitter'):not(:contains('Completed'))");
                let tweeter=$jq(".tasks:first li:contains('Tweeter'):not(:contains('Completed'))");
                let retwitt=$jq(".tasks:first li:contains('Retweet'):not(:contains('Completed'))");
                if(twitter.length>0||retwitt.length>0||tweeter.length>0){
                    let ttBtn=twitter.length>0?twitter.find("button"):(tweeter.length>0?tweeter.find("button"):(retwitt.length>0?retwitt.find("button"):window.location.reload(true)));
                    ttBtn[0].click();
                    ttBtn[1].removeAttribute("disabled");
                    ttBtn[1].click();
                }else{
                    window.location.reload(true);
                }
            }
        }
    }


    if(/whosgamingnow/.test(url)){//wgn领key

        if($jq("body").text().match(/out of keys/gim)!=null){//检测是否有key
            if(confirm("此页面已经没有key了，是否关闭？")) window.close();
        }

        $jq("div.text-center").map(function(i,e){/Please login to enter/gim.test($jq(e).text())&&(location.href="?login")});//自动跳转到登录页面

        //wgn按钮定义
        doTaskBtn.onclick=()=>{
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            doTask(wgn_enter,new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };
        verifyBtn.onclick=()=>{
            $jq("#exInfo").show();
            wgn_enter();
        };

        //wgn获取key
        function wgn_enter(){
            httpSend({
                type: "post",
                url: url,
                data:{submit: "Enter"},
                callback: function (data) {
                    if(data.status==200){
                        if(/<h3>Steam key:<\/h3><p><strong class=\"SteamKey\">[\w\d]{5}(-[\w\W]{5}){2}<\/strong><\/p>/i.test(data.text)){
                            let key=data.text.match(/<h3>Steam key:<\/h3><p><strong class=\"SteamKey\">[\w\d]{5}(-[\w\W]{5}){2}<\/strong><\/p>/i)[0].replace(/(<h3>Steam key:<\/h3><p><strong class="SteamKey">)|(<\/strong><\/p>)/gi,"");
                            data.text=data.text.replace(key,`<a href=https://store.steampowered.com/account/registerkey?key=${key} title="点击激活">${key}</a>`);
                        }
                        document.write(data.text);
                    }else{
                        info("","color:red",data.statusText+":"+data.status);
                    }
                },
            });
        }
    }

    if(/gamehag/.test(url)){//gamehag领key

        setH(150);

        if($jq("div.strong").eq(0).text()==0){
            $jq("div.strong").eq(0).parent()[0].style.backgroundColor="red";
            if(confirm("此页面已经没有key了，是否关闭？")) window.close();
        }

        let success,error,a,survey=0;;
        $jq(div).css({"right": "340px","top": "100px"});
        $jq(".auto-task").width("105px");
        $css(`.misty-notification{display:none !important}`);

        //gamehag按钮定义
        doTaskBtn.onclick=()=>{
            $jq('#getkey').removeAttr('disabled');
            $jq("#exInfo").show();
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            info("card-text monospace","",joinAndFollow);
            doTask(()=>{
                success=0;
                error=0;
                survey=$jq("a.giveaway-survey").length>0&&(/\+1/gim.test($jq("a.giveaway-survey").parent().parent().next().text()))?1:0;
                a=0;
                let p=info("card-text monospace","",`正在做任务(<font style="color:red">需要时间较长请耐心等待</font>)...`);
                $jq("button[data-id]").length>0?gamehag_task(p):gamehag_suryey(0,p);
            },new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };
        verifyBtn.onclick=()=>{
            $jq('#getkey').removeAttr('disabled');
            $jq("#exInfo").show();
            success=0;
            error=0;
            survey=$jq("a.giveaway-survey").length>0&&(/\+1/gim.test($jq("a.giveaway-survey").parent().parent().next().text()))?1:0;
            $jq("button[data-id]").length>0&&($jq("button[data-id]").map(function(i,e){gamehag_verify(e)}));
            survey==1&&(gamehag_verify($jq("a.giveaway-survey")[0],"data-task_id"));
        };

        !empty($id("getkey"))&&($id("getkey").onclick=()=>{$css(`.misty-notification{display:block !important}`)});

        $("#getkey").removeAttr("disabled");
        var bannedCountries = ["abc"];
        var geo ="abc";
        var respCaptch;

        //gamehag做任务
        function gamehag_task(p){
            $jq("button[data-id]").map(function(i,e){
                httpSend({
                    mode:"gm",
                    url:'//gamehag.com/giveaway/click/'+$jq(e).attr("data-id"),
                    type:'get',
                    headers:{'x-csrf-token': $jq('meta[name="csrf-token"]').attr('content')},
                    callback:function(data){
                        if(data.finalUrl) httpSend({mode:"gm",url:data.finalUrl,type:'get',headers:{'x-csrf-token': $jq('meta[name="csrf-token"]').attr('content')}});
                        a++;
                        if(a==$jq("button[data-id]").length){
                            $jq.ajax({url:'//gamehag.com/games',type:'get',headers:{'x-csrf-token': $jq('meta[name="csrf-token"]').attr('content')},complete:()=>{
                                $jq.ajax({url:'//gamehag.com/games/war-thunder/play',type:'get',headers:{'x-csrf-token': $jq('meta[name="csrf-token"]').attr('content')},complete:()=>{gamehag_start(p)}});
                            }});
                        }
                    }
                });
            });
        }

        //gamehag开始执行
        function gamehag_start(p){
            addR(p,"OK");
            gamehag_suryey();
            $jq("button[data-id]").map(function(i,e){gamehag_verify(e)});
        }

        //gamehag问卷调查任务
        function gamehag_suryey(e=1,p=0){
            if(p!=0) addR(p,"OK");
            if(survey==1){
                info("card-text monospace","",`正在做问卷调查任务,如果没有此任务请忽视!`);
                $jq.ajax({url:'//gamehag.com/giveaway/click/'+$jq("a.giveaway-survey").attr("data-task_id"),type:'get',headers:{'x-csrf-token': $jq('meta[name="csrf-token"]').attr('content')}});
                gamehag_verify($jq("a.giveaway-survey")[0],"data-task_id");
            }else if(e==0){
                info("","color:green",`所有任务验证完成,请手动完成验证领取key!`);
            }
        }

        //gamehag验证任务
        function gamehag_verify(e,s="data-id"){
            if(/\+1/gim.test($jq(e).parent().parent().next().text())){
                let p=info("card-text monospace","",`验证任务:${$jq(e).parent().parent().find("a.tooltip-trigger").clone().html()}...`);
                $jq.ajax({
                    url:'//gamehag.com/api/v1/giveaway/sendtask',
                    type:'post',
                    data:'task_id='+$jq(e).attr(s),
                    headers:{'x-csrf-token': $jq('meta[name="csrf-token"]').attr('content')},
                    complete:function(XMLHttpRequest, textStatus){
                        if(XMLHttpRequest.status==429||/timeout/gim.test(textStatus)){
                            $jq(p).remove();
                            gamehag_verify(e);
                        }else{
                            let data=eval('('+XMLHttpRequest.responseText+')');
                            data.status=="success"?success++:error++;
                            let color=data.status=="success"?"green":"red";
                            p.innerHTML+=`<font style='color:${color}'>${data.message}!</font>`;
                            data.status=="success"&&($jq(e).parent().parent().parent().find("div.task-reward.tooltip-trigger").html(`<svg class="nc-icon nc-align-to-text grid-24 glyph"><use xlink:href="/icons/nci-fill.svg#nc-icon-check-simple"></use></svg>`));
                            if(/The task has not been completed/gim.test(data.message)&&autoOpen){
                                $open('https://gamehag.com/giveaway/click/'+$jq(e).attr("data-id"),false);
                            }
                        }
                        if(success+error==$jq("button[data-id]").length+survey){
                            error>0?info("","color:red",`所有任务验证完成,${error}个任务验证失败!`):info("","color:green",`所有任务验证完成,请手动完成验证领取key!`);
                        }
                    }
                });
            }else{
                success++;
                if(success+error==$jq("button[data-id]").length+$jq("a.giveaway-survey").length){
                    error>0?info("","color:red",`所有任务验证完成,${error}个任务验证失败!`):info("","color:green",`所有任务验证完成,请手动完成验证领取key!`);
                }
            }
        }
    }

    if(/giveawayhopper|chubkeys|olympus/.test(url)){//giveawayhopper领key

        setH(165);

        $jq("#info").attr("style","border-radius: 0;border-bottom-right-radius: 0;border-bottom-left-radius: 0;");

        //giveawayhopper按钮定义
        doTaskBtn.onclick=()=>{
            $jq("#exInfo").show();
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            info("card-text monospace","",joinAndFollow);
            doTask(()=>{
                $jq("button.btn-check.btn-primary").map(function(i,e){
                    let taskText=$jq(e).parent().prev().text().replace(/(^\s*)|(\s*$)/g, "");
                    let taskId=e.id;
                    let taskUrl=$jq(e).prev().html().match(/xhttp.open\([\w\W]*?\)\;/gim)[0].match(/\"[\w\W]*?\"/gim)[1].replace(/\"/g,"");;
                    hopperTask(taskText,taskUrl,taskId);
                });
            },new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };
        verifyBtn.onclick=()=>{
            $jq("#exInfo").show();
            $jq("button.btn-check.btn-primary").map(function(i,e){
                let taskText=$jq(e).parent().prev().text().replace(/(^\s*)|(\s*$)/g, "");
                let taskId=e.id;
                let taskUrl=$jq(e).prev().html().match(/xhttp.open\([\w\W]*?\)\;/gim)[0].match(/\"[\w\W]*?\"/gim)[1].replace(/\"/g,"");;
                hopperTask(taskText,taskUrl,taskId);
            });
        };

        function hopperTask(taskText,taskUrl,taskId){
            let p=info("","",`正在做任务${taskText}...`);
            httpSend({
                type:"get",
                url:taskUrl,
                callback:function(data){
                    let verifyTaskBtn;
                    if(data.text == 'success'){
                        verifyTaskBtn = document.getElementById(taskId);
                        verifyTaskBtn.classList.remove("btn-danger");
                        verifyTaskBtn.classList.add("btn-success");
                        verifyTaskBtn.innerHTML = '<i class="la la-check"></i>&nbsp;DONE';
                        addR(p,data.text,"success");
                    }else{
                        verifyTaskBtn = document.getElementById(taskId);
                        verifyTaskBtn.classList.remove("btn-primary");
                        verifyTaskBtn.classList.remove("btn-primary");
                        verifyTaskBtn.classList.add("btn-danger");
                        verifyTaskBtn.innerHTML = '<i class="la la-close"></i>&nbsp;ERROR';
                        addR(p,data.text,"err");
                    }
                }
            });
        }
    }

    if(/giveaway\.su/.test(url)){//giveaway.su领key

        setH(90);

        if($jq(".giveaway-ended").length>0){//检测是否有key
            if(confirm("此页面已经没有key了，是否关闭？")) window.close();
        }

        if(!empty($jq(".steam-login"),1)) location.href="/steam/redirect";//自动跳转到登录页面

        $ele({ele:"button",parent:div,class:"auto-task",title:"一键加入愿望单&关注游戏",onclick:()=>{atw_fg(1)},html:"愿望单&关注"});
        $ele({ele:"button",parent:div,class:"auto-task",title:"一键移除愿望单&取关游戏",onclick:()=>{atw_fg(0)},html:"移除愿望单&取关"});

        let gameArray=[];
        let gameLength=0;
        let gameId=location.href.match(/[\d]+/gim)[0];
        function atw_fg(a=1){
            gameLength=0;
            $jq("#exInfo").show();
            let p=info("","",`正在获取游戏列表...`);
            if(empty(GM_getValue("game"+gameId))){
                $jq("a").map(function(i,e){
                    if(/Wishlist the game|(press|click) \"Follow\" button|Add the game to your wishlist/gim.test($jq(e).text())&&!$jq(e).attr("data-trigger")){
                        w_f(e,a);
                        gameLength++;
                    }
                });
                if(a==1){
                    var getGame=setInterval(()=>{
                        if(gameArray.length>=gameLength){
                            let game=unique(gameArray).join("h");
                            GM_setValue("game"+gameId,game);
                            clearInterval(getGame);
                        }
                    },1000);
                }
            }else{
                unique(GM_getValue("game"+gameId).split("h")).map(function(i){
                    w_f({href:"https://store.steampowered.com/app/"+i},a);
                });
            }
            addR(p,"OK","success");
        }
        function w_f(e,a){
            let p=info("","",`正在获取游戏Id...`);
            httpSend({
                mode:"gm",
                url:e.href,
                type:"get",
                callback:function(data){
                    //console.log(e.href);
                    //console.log(data);
                    if(data.finalUrl&&(/store.steampowered.com(\/agecheck)?\/app\/[\d]+/.test(data.finalUrl))){
                        let appId=data.finalUrl.match(/[\d]+/)[0];
                        gameArray.push(appId);
                        if(data.text.indexOf('<a class="menuitem" href="https://store.steampowered.com/login/?')<0){
                            let html=data.text.match(/g\_sessionID.*?\=.*?\".*?\"/gim);
                            if(html.length>0){
                                addR(p,"OK","success");
                                let sessionID=html[0].match(/\".*?\"/gim)[0].replace(/\"/g,"");
                                a==1?wishlist(appId,sessionID,"addtowishlist"):wishlist(appId,sessionID,"removefromwishlist");
                                a==1?followGame(appId,sessionID,0):followGame(appId,sessionID,1);
                            }else{
                                addR(p,"sessionID获取失败！","err");
                            }
                        }else{
                            addR(p,`<a href="https://store.steampowered.com/login/" style="color:red" target="_blank">请先登录steam！</a>`,"html");
                        }
                    }else if(data.finalUrl&&(/steamcommunity.com\/app\/[\d]+/.test(data.finalUrl))){
                        httpSend({
                            mode:"gm",
                            url:"https://store.steampowered.com/app/"+data.finalUrl.match(/[\d]+/)[0],
                            type:"get",
                            callback:data=>{
                                console.log(data)
                                if(data.status===200){
                                    let appId=data.finalUrl.match(/[\d]+/)[0];
                                    gameArray.push(appId);
                                    if(data.text.indexOf('<a class="menuitem" href="https://store.steampowered.com/login/?')<0){
                                        let html=data.text.match(/g\_sessionID.*?\=.*?\".*?\"/gim);
                                        if(html.length>0){
                                            addR(p,"OK","success");
                                            let sessionID=html[0].match(/\".*?\"/gim)[0].replace(/\"/g,"");
                                            a==1?wishlist(appId,sessionID,"addtowishlist"):wishlist(appId,sessionID,"removefromwishlist");
                                            a==1?followGame(appId,sessionID,0):followGame(appId,sessionID,1);
                                        }else{
                                            addR(p,"sessionID获取失败！","err");
                                        }
                                    }else{
                                        addR(p,`<a href="https://store.steampowered.com/login/" style="color:red" target="_blank">请先登录steam！</a>`,"html");
                                    }
                                }else{
                                    addR(p,"游戏商店加载失败，请手动完成！","warn");
                                }
                            }
                        });
                    }else{
                        addR(p,"未检测到steam商店链接，请手动完成！","warn");
                    }
                }
            });
        }

        //giveaway.su按钮定义
        doTaskBtn.onclick=()=>{
            $id("exInfo").style.display="block";
            info("","color:blue",`只会自动做加steam组和关注鉴赏家任务(需要<a href="https://greasyfork.org/zh-CN/scripts/34764-giveaway-helper" target="_blank">Giveaway Helper脚本</a>,没有则自动跳过此步骤),其他任务需手动完成！`);
            if($jq("a.pull-right").length>0&&$jq("a.pull-right").parent().parent()[0].className!="hidden"){
                $jq("a.pull-right")[0].click();
                return false;
            }
            $jq('tr[data-action-id="adjs"]').remove();
            if(!empty($jq('a[data-type="link"]'),1)) httpSend({url:$jq('a[data-type="link"]:first').attr("href"),type:'get'});
            $jq('a[data-type="link"]').attr("href","javascript:void(0)");
            $jq('a[data-type="link"]').attr("target","_self");
            $jq('a[data-type="link"]').find("i").click();
            $jq("a.btn-success").removeClass("disabled");
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            doTask(()=>{giveaway_su_verify($jq("i.glyphicon-refresh"),0)},new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };
        verifyBtn.onclick=()=>{
            $id("exInfo").style.display="block";
            info("","color:blue",`只会自动做加steam组和关注鉴赏家任务(需要<a href="https://greasyfork.org/zh-CN/scripts/34764-giveaway-helper" target="_blank">Giveaway Helper脚本</a>,没有则自动跳过此步骤),其他任务需手动完成！`);
            if($jq("a.pull-right").length>0&&$jq("a.pull-right").parent().parent()[0].className!="hidden"){
                $jq("a.pull-right")[0].click();
                return false;
            }
            $jq('tr[data-action-id="adjs"]').remove();
            if(!empty($jq('a[data-type="link"]'),1)) httpSend({url:$jq('a[data-type="link"]:first').attr("href"),type:'get'});
            $jq('a[data-type="link"]').attr("href","javascript:void(0)");
            $jq('a[data-type="link"]').find("i").click();
            $jq("a.btn-success").removeClass("disabled");
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            doTask(()=>{giveaway_su_verify($jq("i.glyphicon-refresh"),0,0)},new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };

        //giveaway.su验证任务
        function giveaway_su_verify(vBtn,i,interval=1){
            $jq('a.btn-success:contains("Grab key")').attr('disabled','disabled');
            alert('任务完成，请关闭油猴插件和广告拦截插件后手动验证任务获取key！');
            return false;
            if(vBtn.length==0){
                $jq('a.btn-success:contains("Grab key")')[0].click();
            }else{
                if(!vBtn.eq(i).hasClass('glyphicon-ok')&&!vBtn.eq(i).hasClass('spin')&&!vBtn.eq(i).parent().hasClass('btn-success')) vBtn.eq(i).parent().click();
                i++;
                interval==1?setTimeout(()=>{i<vBtn.length?giveaway_su_verify(vBtn,i):giveaway_su_verify($jq("i.glyphicon-refresh"),0)},2000):setTimeout(()=>{i<vBtn.length?giveaway_su_verify(vBtn,i,0):info('','','验证完成！')},2000);
            }
        }
        let getKeyBtn=setInterval(()=>{
            if($jq("#getKey").length>0){
                $jq("#getKey").after(`<div class="text-center margin-top"><a id="swal" href="javascript:viod(0)" class="btn btn-success btn-sm">Grab key</a></div>`);
                $jq("#swal").click(function(e){
                    if(confirm("温馨提示：\n检测到您没有关闭油猴脚本，有可能获取不到key, 是否继续？")){
                        $jq("#getKey").click();
                        $jq("#getKey").show();
                    }
                });
                GM_addStyle(`#getKey{display:none}`);
                clearInterval(getKeyBtn);
            }
        },1000);
    }

    if(/gleam/.test(url)){//gleam领key

        setH(10);

        //gleam按钮定义
        doTaskBtn.onclick=()=>{
            $jq("#exInfo").show();
            $jq('button>span:contains("Join ")').click();
            $jq('button>span:contains("Follow ")').click();
            doTask(()=>{gleam_do_task($jq("a.enter-link"),0)},new Date().getTime(),($jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length)*3);
        };
        verifyBtn.onclick=()=>{
            $jq("#exInfo").show();
            gleam_do_task($jq("a.enter-link"),0);
        };

        //gleam做任务+验证任务
        function gleam_do_task(a,i,t=0){
            if(i<a.length){
                if((!/check/gim.test($jq("a.enter-link").eq(i).children(".tally").find("i")[0].className)&&(!(t==0&&/on twitter/gim.test($jq("a.enter-link").eq(i).text()))))){
                    a[i].click();
                    setTimeout(()=>{
                        if(!/default/.test(a[i].className)){
                            let btn=a.eq(i).next().find(".btn-primary");
                            let link=a.eq(i).next().find("a.btn-info.btn-embossed");
                            let href=link.attr("href");
                            link.attr("href","javascript:void(0)");
                            link.attr("target","_self");
                            //console.log(link);
                            if(link[0]) link[0].click();
                            link.attr("href",href);
                            if(btn[0]){
                                if(/[\d]/i.test(btn.text())){
                                    gleam_time(a,btn.text(),i,btn);
                                }else{
                                    btn[0].click();
                                    i++;
                                    gleam_do_task(a,i,t);
                                }
                            }
                        }else{
                            i++;
                            gleam_do_task(a,i,t);
                        }
                    },1000);
                }else{
                    i++;
                    gleam_do_task(a,i,t);
                }
            }else{
                t==0?gleam_do_task($jq("a.enter-link"),0,1):info("","","任务验证完成，若有未完成任务请手动完成！");
            }
        }

        //gleam做有时间限制任务
        function gleam_time(a,t,i,b){
            let time=t.match(/\-?[\d]+/gim)[0];
            if(time>0){
                GM_openInTab("https://time.hclonely.com/?time="+time,{active:1,setParent:1}).onclose=()=>{
                    b[0].click();
                    i++;
                    gleam_do_task(a,i);
                };
            }else{
                b[0].click();
                i++;
                gleam_do_task(a,i);
            }
        }
    }

    if(/gamehunt|gkey.fun/.test(url)){//gamehunt领key

        setH(60);

        if($jq(".card-title").text()=="0"){//检测是否有key
            if(confirm("此页面已经没有key了，是否关闭？")) window.close();
        }

        if($jq("a.btn-outline-dange[href='/auth']").length>0) location.href="/auth/vk";//自动跳转到登录页面

        //$ele({ele:"button",parent:div,class:"auto-task",title:"取关游戏",onclick:unfollow_game,html:"取关游戏"});

        $jq('.auto-task').attr("disabled","disabled");
        $jq('#remove').hide();
        $jq('#doTask').removeAttr("disabled");
        $jq('#Setting').removeAttr("disabled");
        doTaskBtn.innerText="初始化";
        verifyBtn.innerText="FuckTask";
        $ele({ele:"button",parent:div,class:"auto-task btn btn-default",title:"一键移除愿望单&取关游戏",onclick:removeGame,html:"移除愿望单&取关"});
        //gamehunt按钮定义
        doTaskBtn.onclick=()=>{
            GM_setValue('gameId','');
            if(autoOpen) info("","color:blue",'请关闭弹窗拦截，否则不会自动打开vk任务页面！');
            gamehunt();
        };
        verifyBtn.onclick=()=>{
            GM_setValue('sessionID','');
            GM_getValue('vk')==0;
            gamehuntDoTask();
        };

        let gamehuntApp={
            loading:false,
            centrifuge:new Centrifuge(/gamehunt/.test(url)?'wss://c.fstp.fun/connection/websocket':'wss://app.gkey.fun/connection/websocket'),
            uid:$('meta[name="uid"]').attr("content"),
            init:function(p){
                this.centrifuge.setToken($('meta[name="cent_token"]').attr("content")),this.centrifuge.connect(),this.centrifuge.on("connect",function(e){
                    console.log(`Connected!`);
                    p.innerHTML=`<font style="color:green">连接成功！</font>`;
                    $jq('a[id^=task_]').map(function(e){
                        $jq(this).html($jq(this).html().replace("Посмотреть обзор на игру","查看游戏评论").replace("Подписаться на разработчика","订阅开发者").replace("Подписаться на куратора","订阅鉴赏家").replace("Поставить лайк","点赞").replace("Подписаться на игру","关注游戏").replace(/Subscribe|Подписаться/,"订阅/加组").replace("Сделать репост","转发").replace("Добавить в список желаемого","加入愿望单").replace("Сделать обзор на игру","评论"));
                    });
                    $jq('.auto-task:not(:contains("愿望单"))').removeAttr("disabled");
                }),this.centrifuge.on("disconnect",function(e){
                    console.log(`DisConnected!\n${e.reason}`)
                    p.innerHTML=`<font style="color:red">连接断开，正在重连...</font>`;
                });
                if(this.uid)this.centrifuge.subscribe(`usr#${this.uid}`,(data)=>{
                    addR($jq('p.task-status:last')[0],"成功！","success");
                    if(data.data.js){
                        let taskA=data.data.js.split(";");
                        if(taskA){
                            let tasks=[];
                            taskA.map((e)=>{
                                if(e.includes("btn-danger")) tasks.push(e.match(/[\d]+/)[0]);
                            });
                            analyzeTasks(tasks);
                        }
                    }
                });
            },
            request:(p,url,type,data,page)=>{
                if(url){
                    if(data||(data={}),type||(type="post"),"get"==type.toLowerCase()){
                        if(gamehuntApp.loading)
                            return;
                        gamehuntApp.loading=!0
                    }
                    $.ajax({
                        url:url,
                        type:type,
                        data:data,
                        error:function(e){
                            switch(e.status){
                                case 401:
                                    addR(p,"您尚未登录！","err");
                                    break;
                                case 403:
                                    addR(p,"访问被拒绝！","err");
                                    break;
                                case 404:
                                    addR(p,"错误，找不到页面！","err");
                                    break;
                                case 500:
                                    addR(p,"服务器错误！","err");
                                    break;
                                case 503:
                                    addR(p,"错误，请刷新页面！","err");
                                    break;
                            }
                            gamehuntApp.loading=!1
                        }
                    })
                }
            },
            notify:(msg,status)=>addR(p,msg,status)
        };

        //初始化wss连接
        function gamehunt(){
            $jq("#exInfo").show();
            let p=info("","",`正在初始化...`);
            $(()=>gamehuntApp.init(p));
        }

        //获取任务完成状态
        function gamehuntDoTask(){
            let p=info("task-status","",`正在获取任务完成状态(时间稍长，请耐心等待)...`,"");
            gamehuntApp.request(p,'/distribution/check', 'post', {id: location.href.match(/[\d]+/)[0]})
        }

        //分析任务
        function analyzeTasks(tasks){
            let steamTask=[];
            let vkTask=[];
            for(let i=0;i<tasks.length;i++){
                let task=$jq("#task_"+tasks[i]);
                let href=task.attr("href");
                if(href.includes("vk.com")){
                    vkTask.push({id:tasks[i],href:href});
                    if(autoOpen) window.open(href,"_blank");
                    GM_setValue('vk',1);
                }else if(href.includes("steamcommunity.com/groups")){
                    steamTask.push({id:tasks[i],href:href,name:"group"});
                }else if(task.text().includes("加入愿望单")){
                    steamTask.push({id:tasks[i],href:href,name:"wlist"});
                }else if(href.includes("store.steampowered.com/app")){
                    steamTask.push({id:tasks[i],href:href,name:"follow"});
                }else{
                    steamTask.push({id:tasks[i],href:href,name:"link"});
                }
            }
            //console.log(steamTask);
            if(steamTask.length>0) doSteamTask(steamTask);
            //if(vkTask.length>0) doVkTask(vkTask);
        }

        function doSteamTask(task,i=0){
            if(i<task.length){
                let href=task[i].href;
                let id=task[i].id;
                let name=href.replace('https://steamcommunity.com/groups/','');
                let appid=href.replace('https://store.steampowered.com/app/','');
                if(i==0){
                    let p=info("","",`正在获取社区sessionID...`);
                    httpSend({
                        mode:"gm",
                        type:"get",
                        url:"https://steamcommunity.com/",
                        callback:(data)=>{
                            if(data.status==200){
                                if(data.text.includes('<a class="global_action_link" href="https://steamcommunity.com/login/home/')){
                                    addR(p,"<font style='color:red'>失败：请先<a href='https://steamcommunity.com/login/home/' target='_blank'>登录steam</a></font>","html");
                                }else{
                                    let g_sessionID=data.text.match(/g_sessionID = \".*?\"/gim);
                                    if(g_sessionID){
                                        let sessionID=g_sessionID[0].match(/\".*?\"/)[0].replace(/\"/g,"");
                                        GM_setValue('community_sessionID',sessionID);
                                        addR(p,"成功！","success");

                                        let pa=info("","",`正在获取商店sessionID...`);
                                        httpSend({
                                            mode:"gm",
                                            type:"get",
                                            url:"https://store.steampowered.com/",
                                            callback:(data)=>{
                                                if(data.status==200){
                                                    if(data.text.includes('<a class="menuitem" href="https://store.steampowered.com/login/')){
                                                        addR(pa,"<font style='color:red'>失败：请先<a href='https://store.steampowered.com/login/' target='_blank'>登录steam</a></font>","html");
                                                    }else{
                                                        let g_sessionID=data.text.match(/g_sessionID = \".*?\"/gim);
                                                        if(g_sessionID){
                                                            let sessionID=g_sessionID[0].match(/\".*?\"/)[0].replace(/\"/g,"");
                                                            GM_setValue('powered_sessionID',sessionID);
                                                            addR(pa,"成功！","success");
                                                            //console.log(task[i].name);
                                                            if(task[i].name==="group"){
                                                                jionSteamGroup(href,name,GM_getValue('community_sessionID'),task,i);
                                                                doSteamTask(task,++i);
                                                            }else if(task[i].name==="follow"){
                                                                let gameId=GM_getValue('gameId')||[];
                                                                //console.log(gameId);
                                                                if(gameId.indexOf(appid)<0){
                                                                    gameId.push(appid);
                                                                    GM_setValue('gameId',gameId);
                                                                }
                                                                followGame(appid,GM_getValue('powered_sessionID'),0);
                                                                    //wishlist(appid,GM_getValue('powered_sessionID'),"addtowishlist");
                                                                doSteamTask(task,++i);
                                                            }else if(task[i].name==="wlist"){
                                                                let p=info("","",`正在获取需要加入愿望单的游戏ID...`);
                                                                httpSend({
                                                                    mode:"gm",
                                                                    type:"get",
                                                                    url:href,
                                                                    callback:(data)=>{
                                                                        if(data.finalUrl&&/app\/[\d]+/.test(data.finalUrl)){
                                                                            addR(p,"成功！","success");
                                                                            let appid=data.finalUrl.match(/app\/([\d]+)/)[1];
                                                                            let gameId=GM_getValue('gameId')||[];
                                                                            //console.log(gameId);
                                                                            if(gameId.indexOf(appid)<0){
                                                                                gameId.push(appid);
                                                                                GM_setValue('gameId',gameId);
                                                                            }
                                                                                //followGame(appid,GM_getValue('powered_sessionID'),0);
                                                                            //wishlist(appid,GM_getValue('powered_sessionID'),"removefromwishlist",e=>{if(e) wishlist(appid,GM_getValue('powered_sessionID'),"addtowishlist",()=>{doSteamTask(task,++i);});});
                                                                            wishlist(appid,GM_getValue('powered_sessionID'),"addtowishlist",()=>{doSteamTask(task,++i);});
                                                                            //doSteamTask(task,++i);
                                                                        }else{
                                                                            addR(p,"失败:"+data.statusText,"err");
                                                                            doSteamTask(task,++i);
                                                                        }
                                                                    }
                                                                });
                                                            }else{
                                                                visitLink(href);
                                                                doSteamTask(task,++i);
                                                            }
                                                        }else{
                                                            addR(pa,"失败！","err");
                                                            GM_setValue('powered_sessionID','');
                                                        }
                                                    }
                                                }else{
                                                    addR(pa,"失败:"+data.status,"err");
                                                    GM_setValue('powered_sessionID','');
                                                }
                                            }
                                        });
                                    }else{
                                        addR(p,"失败！","err");
                                        GM_setValue('community_sessionID','');
                                    }
                                }
                            }else{
                                addR(p,"失败:"+data.status,"err");
                                GM_setValue('community_sessionID','');
                            }
                        }
                    });
                }else{
                    if(task[i].name==="group"){
                        jionSteamGroup(href,name,GM_getValue('community_sessionID'),task,i);
                        doSteamTask(task,++i);
                    }else if(task[i].name==="follow"){
                        let gameId=GM_getValue('gameId')||[];
                        //console.log(gameId);
                        if(gameId.indexOf(appid)<0){
                            gameId.push(appid);
                            GM_setValue('gameId',gameId);
                        }
                        followGame(appid,GM_getValue('powered_sessionID'),0);
                        //wishlist(appid,GM_getValue('powered_sessionID'),"addtowishlist");
                        doSteamTask(task,++i);
                    }else if(task[i].name==="wlist"){
                        let p=info("","",`正在获取需要加入愿望单的游戏ID...`);
                        httpSend({
                            mode:"gm",
                            type:"get",
                            url:href,
                            callback:(data)=>{
                                if(data.finalUrl&&/app\/[\d]+/.test(data.finalUrl)){
                                    addR(p,"成功！","success");
                                    let appid=data.finalUrl.match(/app\/([\d]+)/)[1];
                                    let gameId=GM_getValue('gameId')||[];
                                    //console.log(gameId);
                                    if(gameId.indexOf(appid)<0){
                                        gameId.push(appid);
                                        GM_setValue('gameId',gameId);
                                    }
                                    wishlist(appid,GM_getValue('powered_sessionID'),"removefromwishlist",()=>{doSteamTask(task,++i);});
                                    //followGame(appid,GM_getValue('powered_sessionID'),0);
                                    //wishlist(appid,GM_getValue('powered_sessionID'),"removefromwishlist",e=>{if(e) wishlist(appid,GM_getValue('powered_sessionID'),"addtowishlist",()=>{doSteamTask(task,++i);});});
                                    //doSteamTask(task,++i);
                                }else{
                                    addR(p,"失败:"+data.statusText,"err");
                                    doSteamTask(task,++i);
                                }
                            }
                        });
                    }else{
                        visitLink(location.origin+href);
                        doSteamTask(task,++i);
                    }
                }
            }else if(GM_getValue('vk')==0){
                info("","color:green","所有steam任务完成！");
                //gamehuntDoTask();
            }else{
                info("","color:green","所有steam任务完成！");
            }
        }

        function removeGame(){
            let gameId=GM_getValue('gameId')||[];
            let sessionID=GM_getValue('powered_sessionID');
            if(sessionID){
                gameId.map(id=>{
                    followGame(id,sessionID,1);
                    wishlist(id,sessionID,"removefromwishlist");
                });
            }else{
                let p=info("","",`正在获取sessionID...`);
                httpSend({
                    mode:"gm",
                    type:"get",
                    url:"https://store.steampowered.com/",
                    callback:(data)=>{
                        if(data.status==200){
                            if(data.text.includes('<a class="menuitem" href="https://store.steampowered.com/login/')){
                                addR(p,"<font style='color:red'>失败：请先<a href='https://store.steampowered.com/login/' target='_blank'>登录steam</a></font>","html");
                            }else{
                                let g_sessionID=data.text.match(/g_sessionID = \".*?\"/gim);
                                if(g_sessionID){
                                    let sessionID=g_sessionID[0].match(/\".*?\"/)[0].replace(/\"/g,"");
                                    GM_setValue('powered_sessionID',sessionID);
                                    addR(p,"成功！","success");
                                    gameId.map(id=>{
                                        followGame(id,sessionID,1);
                                        wishlist(id,sessionID,"removefromwishlist");
                                    });
                                }else{
                                    addR(p,"失败！","err");
                                    GM_setValue('sessionID','');
                                }
                            }
                        }else{
                            addR(p,"失败:"+data.status,"err");
                            GM_setValue('sessionID','');
                        }
                    }
                });
            }
        }


        /*
        //vk任务，跨域失败TAT
        function doVkTask(task,i=0){
            if(i<task.length){
                let p=info("","",`正在做vk任务<a href="${task[i].href}" target="_blank">${task[i].id}</a>...`);
                httpSend({
                    mode:"gm",
                    type:"get",
                    url:task[i].href,
                    callback:(data)=>{
                        if(data.status==200){
                            if(data.finalUrl.includes("public")){
                                let html=data.text;
                                let public_id=html.match(/\"public_id\"\:[\d]+?\,/gim);
                                let enterHash=html.match(/\"enterHash\"\:\".+?\"\,/gim);
                                if(public_id){
                                    public_id=public_id[0].match(/[\d]+/)[0];
                                }else{
                                    addR(p,"失败(获取public_id失败)","err");
                                    return 0;
                                }
                                if(enterHash){
                                    enterHash=enterHash[0].match(/\".+?\"/gm)[1].replace(/\"/g,"");
                                }else{
                                    addR(p,"失败(获取enterHash失败)","err");
                                    return 0;
                                }
                                httpSend({
                                    mode:"gm",
                                    type:"post",
                                    url:'https://vk.com/al_public.php',
                                    data:{
                                        act: "a_enter",
                                        al: 1,
                                        pid: public_id,
                                        hash: enterHash
                                    },
                                    callback:function(data){
                                        console.log(data);
                                        console.log(data.text);
                                        if(data.text.includes('id="page_actions_btn"')){
                                            addR(p,"成功！","success");
                                        }else{
                                            addR(p,"失败！","err");
                                        }
                                    }
                                });
                            }else{
                                i++;
                                doVkTask(task,i);
                            }
                        }else{
                            addR(p,"失败！","err");
                            i++;
                            doVkTask(task,i);
                        }
                    }
                });
            }
        }
        */
    }

    if(/indiedb/.test(url)){//indiedb领key

        setH(10);

        if(empty($jq(".session").find('a:contains("Sign Out")'),1)) location.href="/members/register";//自动跳转到登录页面

        //indiedb按钮定义
        doTaskBtn.onclick=()=>{
            $jq("#exInfo").show();
            indiedb_join();
        };
        verifyBtn.onclick=()=>{
            $jq("#exInfo").show();
            indiedb_do_task();
        };

        //indiedb加入赠key
        function indiedb_join(){
            if(/join giveaway/gim.test($jq("a.buttonenter.buttongiveaway").text())){
                let p=info("","","正在加入赠key...");
                httpSend({type:"post",url:$jq("a.buttonenter.buttongiveaway").attr("href"),data:{ajax: 't'},callback:function(data){if(data.status==200&&data.json.success==true){
                    addR(p,"ok");
                    indiedb_do_task();
                }else{
                    addR(p,"失败！请手动加入赠key!","err");
                }}});
                $(".buttongiveaway").saveUpdate("auth", enterGiveaway);
                $jq(".buttongiveaway").addClass("buttonentered").text("Success - Giveaway joined");
            }else if(/success/gim.test($jq("a.buttonenter.buttongiveaway").text())){
                indiedb_do_task();
            }else{
                info("","color:red","请检查是否已加入次赠key!");
            }
        }

        //indiedb做任务
        function indiedb_do_task(){
            $jq("#giveawaysjoined").show();
            let id=$jq("script").map(function(i,e){
                if(/\$\(document\)/gim.test(e.innerHTML)){
                    let optionId=e.innerHTML.match(/\"\/newsletter\/ajax\/subscribeprofile\/optin\/[\d]+\"/gim)[0].match(/[\d]+/)[0];
                    let taskId=e.innerHTML.match(/\"\/[\d]+\"/gim)[0].match(/[\d]+/)[0];
                    return [taskId,optionId];
                }
            });
            if(id.length==2){
                $jq("#giveawaysjoined>div>p").find("a").map(function(i,e){
                    let promo=$jq(e);
                    if(!promo.hasClass("buttonentered")){
                        let p=info("","",`正在做任务:${$jq(e).parents("p").text()}...`);
                        if(/facebookpromo|twitterpromo|visitpromo/gim.test(e.className)){
                            $jq.ajax({
                                type: "POST", url: urlPath("/giveaways/ajax/"+(promo.hasClass("facebookpromo") ? "facebookpromo" : (promo.hasClass("twitterpromo") ? "twitterpromo" : "visitpromo"))+"/"+id[0]), timeout: 60000, dataType: "json",
                                data: {ajax: "t"},
                                error: function(response, error, exception) {
                                    addR(p,"An error has occurred performing the action requested. Please try again shortly.","err");
                                },
                                success: function(response) {
                                    if(response["success"]) {
                                        addR(p,response["text"]);
                                        promo.addClass("buttonentered").closest("p").html(promo.closest("p").find("span").html());
                                    } else {
                                        addR(p,response["text"],"err");
                                    }
                                }
                            });
                        }else if(promo.hasClass("emailoptinpromo")){
                            $jq.ajax({
                                type: "POST", url: urlPath("/newsletter/ajax/subscribeprofile/optin/"+id[1]), timeout: 60000, dataType: "json",
                                data: {ajax: "t",emailsystoggle: 4},
                                error: function(response, error, exception) {
                                    addR(p,"An error has occurred performing the action requested. Please try again shortly.","err");
                                },
                                success: function(response) {
                                    if(response["success"]) {
                                        addR(p,response["text"]);
                                        promo.toggleClass("buttonentered").closest("p").html(promo.closest("p").find("span").html());
                                    } else {
                                        addR(p,response["text"],"err");
                                    }
                                }
                            });
                        }else if(promo.hasClass("watchingpromo")){
                            let data=getUrlQuery($jq(e).attr("href"));
                            data.ajax="t";
                            $jq.ajax({
                                type: "POST", url: urlPath($jq(e).attr("href").replace(/\?.*/,"")), timeout: 60000, dataType: "json",
                                data: data,
                                error: function(response, error, exception) {
                                    addR(p,"An error has occurred performing the action requested. Please try again shortly.","err");
                                },
                                success: function(response) {
                                    if(response["success"]) {
                                        addR(p,response["text"]);
                                        promo.toggleClass("buttonentered").closest("p").html(promo.closest("p").find("span").html());
                                        $(e).saveUpdate("watch", giveawayWatch);
                                        $jq(e).addClass("buttonentered");
                                    } else {
                                        addR(p,response["text"],"err");
                                    }
                                }
                            });
                        }else if(!/the-challenge-of-adblock/gim.test($jq(e).attr("href"))){//watchingpromo
                            $jq.ajax({
                                type: "POST", url: urlPath($jq(e).attr("href")), timeout: 60000, dataType: "json",
                                data: {ajax: "t"},
                                error: function(response, error, exception) {
                                    addR(p,"An error has occurred performing the action requested. Please try again shortly.","err");
                                },
                                success: function(response) {
                                    if(response["success"]) {
                                        addR(p,response["text"]);
                                        promo.toggleClass("buttonentered").closest("p").html(promo.closest("p").find("span").html());
                                    } else {
                                        addR(p,response["text"],"err");
                                    }
                                }
                            });
                        }else{
                            addR(p,"此任务为花钱订阅任务，脚本自动跳过！","info");
                        }
                    }else{
                        info("","",`正在做任务:${$jq(e).parents("p").text()}...<font style="color:green">ok</font>`);
                    }
                });
                info("","color:blue","所有任务验证完成,没有完成的任务请手动完成!");
            }else{
                info("","color:red","获取id失败,请重试！")
            }
        }
    }

    if(/spoune/.test(url)){//spoune领key

        setH(10);

        doTaskBtn.onclick=()=>{
            $jq("#exInfo").show();
            info("","","疑似出现BUG，待修复...");
            spoune_get_task();
        };
        verifyBtn.onclick=()=>{
            $jq("#exInfo").show();
            info("","","疑似出现BUG，待修复...");
            spoune_get_task();
        };

        //spoune获取任务信息
        function spoune_get_task(){
            if($jq("#GiveawayTasks>button.grey").length!=parseInt($jq("#submain3").text())-parseInt($jq("#submain1").text())){
                objFrame.objCurrentScriptObject.loadTaskOverview('GiveawayTasks');
                let getButton=setInterval(()=>{
                    if($jq("#GiveawayTasks>button.grey").length==parseInt($jq("#submain3").text())-parseInt($jq("#submain1").text())){
                        clearInterval(getButton);
                        show_task($jq("#GiveawayTasks>button.grey"),0);
                    }
                },1000);
            }else{
                show_task($jq("#GiveawayTasks>button.grey"),0);
            }
        }

        //spoune显示任务详情
        function show_task(e,i){
            if(i<e.length){
                eval($jq(e).eq(i).attr("onclick"));
                let getIframe=setInterval(()=>{
                    if($jq("iframe").contents().find("#link").length>0){
                        clearInterval(getIframe);
                        spoune_verify(e,i);
                    }
                },1000);
            }else{
                info("","color:blue","所有任务验证完成,没有完成的任务请手动完成!");
                objFrame.objCurrentScriptObject.loadTaskOverview('GiveawayTasks');
                $jq("#GiveawayBackButton")[0].style.visibility="hidden";
            }
        }

        //spoune验证任务
        function spoune_verify(t,i,e=0){
            let p=info("","","正在验证任务:"+$jq(t).eq(i).text()+"...");
            httpSend({
                type:"get",
                url:$jq("iframe").contents().find("#link").attr("href").replace("./","./werbung/"),
                callback:function(data){
                    if(data.status==200){
                        if(/Task completed/gim.test(data.text)){
                            addR(p,"ok");
                            e=1;
                        }else{
                            $jq("iframe").contents().find("html").html(data.text);
                            e==0?setTimeout(()=>{
                                $jq(p).remove();
                                spoune_verify(t,i,1);
                            },1500):addR(p,"error","err");
                        }
                    }else{
                        e==0?setTimeout(()=>{
                            $jq(p).remove();
                            spoune_verify(t,i,1);
                        },1500):addR(p,`error:${data.status}`,"err");
                    }
                    if(e==1) show_task(t,++i);
                }
            });
        }
    }

    if(/(prys.ga)|(prys.revadike.com)/.test(url)){//prys.ga领key

        setH(50);

        //prys.ga按钮定义
        doTaskBtn.onclick=prys_ga;
        verifyBtn.onclick=()=>{location.reload(true)};

        function prys_ga(){
            let gameId=location.href.match(/[\d]+/)[0];
            if($jq('#steps tr[id]').length>0){
                for(let i=0;i<$jq('#steps tr[id]').length;i++){
                    if($jq('#step'+i).children('td:last').find('a').length==0&&$jq('#step'+i).children('td:last').text().includes('Check')) checkClick(i);
                }
                for(let i=0;i<$jq('#steps tr[id]').length;i++){
                    if($jq('#check'+i).length>0&&($jq('#check'+i).text().includes('Check'))){
                        $checkStep(i);
                        break;
                    }
                }
            }
        }

        function $checkStep(step,captcha){
            if(!captcha)captcha=null;
            if(step!=="captcha")$("#check"+step).replaceWith('<span id="check'+step+'"><i class="fa fa-refresh fa-spin fa-fw"></i> Checking...</span>');
            $jq.post("/api/check_step",{
                step:step,
                id:getURLParameter("id"),
                "g-recaptcha-response":captcha
            },function(json){
                if(json.success&&step!=="captcha"){
                    $("#check"+step).replaceWith('<span class="text-success" id="check'+step+'"><i class="fa fa-check"></i> Success</span>');
                    showAlert("success",'Check passed successfully! Thank you for completing this step. <i class="fa fa-smile-o"></i>');
                }else if(step!=="captcha"){
                    $("#check"+step).replaceWith('<a id="check'+step+'" href="javascript:checkStep('+step+')"><i class="fa fa-question"></i> Check</a>');
                    var msg="Please complete the step and then check again.";
                    showAlert("warning",(json.response?json.response.error?json.response.error:msg:msg));
                }
                if(json.response){
                    if(json.response.captcha&&json.success){
                        showAlert("info",json.response.captcha);
                        captchaCheck();
                    }else if(json.response.captcha){
                        showAlert("warning",json.response.captcha);
                        captchaCheck();
                    }
                    if(json.response.prize){
                        showAlert("success",'Here is your prize:<h1 role="button" align="middle" style="word-wrap: break-word;">'+json.response.prize+'</h2>');
                    }
                }else{
                    setTimeout(()=>{
                        step++;
                        $checkStep(step);
                    },500);
                }
            }).fail(()=>{
                $("#check"+step).replaceWith('<a id="check'+step+'" href="javascript:checkStep('+step+')"><i class="fa fa-question"></i> Check</a>');
                showAlert("danger","Failed to check this step. Please try again later. Spamming it may make it worse.");
            });
        }
    }


    if(/steam.supply/.test(url)){//steam.supply领key

        setH(50);

        //prys.ga按钮定义
        doTaskBtn.onclick=get_task_list;
        verifyBtn.onclick=get_task_list;

        function get_task_list(){
            $jq("#exInfo").show();
            let group=[];
            $jq("ul.list-group li").map(function(i,e){
                if(!$jq(this).find("span:last").hasClass("btn-success")){
                    let task=$jq(this).find("a:first");
                    if(/Join.*?Steam Group/i.test(task.text())){
                        let groupUrl=task.attr("href");
                        console.log(groupUrl);
                        group.push(groupUrl);
                        //加组
                    }else if(/Visit/i.test(task.text())){
                        let visitUrl=task.attr("href");
                        console.log(visitUrl);
                        visitLink(visitUrl);
                        //浏览网页
                    }
                }
            });
            if(group.length>0){
                let p=info("","",`正在获取社区sessionID...`);
                httpSend({
                    mode:"gm",
                    type:"get",
                    url:"https://steamcommunity.com/",
                    callback:(data)=>{
                        console.log(data);
                        if(data.status==200){
                            if(data.text.includes('<a class="global_action_link" href="https://steamcommunity.com/login/home/')){
                                addR(p,"<font style='color:red'>失败：请先<a href='https://steamcommunity.com/login/home/' target='_blank'>登录steam</a></font>","html");
                            }else{
                                let g_sessionID=data.text.match(/g_sessionID = \".*?\"/gim);
                                if(g_sessionID){
                                    let sessionID=g_sessionID[0].match(/\".*?\"/)[0].replace(/\"/g,"");
                                    addR(p,"成功！","success");
                                    group.map((e)=>{
                                        jionSteamGroup(e,e.replace("https://steamcommunity.com/groups/",""),sessionID);
                                    });
                                }else{
                                    addR(p,"失败！","err");
                                }
                            }
                        }else{
                            addR(p,"失败:"+data.status,"err");
                        }
                    }
                });
            }
        }
    }


    if(/freegamelottery/.test(url)){//freegamelottery领key

        setH(50);

        //freegamelottery按钮定义
        doTaskBtn.onclick=get_task_list;
        verifyBtn.onclick=get_task_list;

        function get_task_list(){
            GM_setValue("lottery",1);
            if($jq("a.registration-button").length>0){
                if(GM_getValue("lotteryLogin")){
                    httpSend({
                        type:"post",
                        url:"https://freegamelottery.com/user/login",
                        data:{
                            'username': GM_getValue("lotteryLogin").username,
                            'password': GM_getValue("lotteryLogin").password,
                            'rememberMe': 1
                        },
                        callback:(data)=>{
                            if(data.status==200) window.location.reload(true);
                        }
                    });
                }else{
                    $jq('#login').attr('style','z-index: 1005; opacity: 1; transform: scaleX(1); top: 10%; display: block;').find('button[type="submit"]:contains("Login")').after(`<button id="rememberme" value="保存帐号密码" class="btn" title="保存后下次使用脚本自动登录">保存帐号密码</button>`);
                    $jq("#rememberme").click(()=>{
                        GM_setValue("lotteryLogin",{username:$jq("#modal_login").val(),password:$jq("#modal_password").val()});
                        $jq("#rememberme").text("已保存");
                    });
                }
            }
        }
        window.onload=()=>{
            if(GM_getValue("lottery")==1&&window.location.host=='d.freegamelottery.com'){
                GM_setValue("lottery",0);
                $.post('/draw/register-visit', { drawId: DashboardApp.draws.main.actual.id })
                    .done(function () {
                    DashboardApp.draws.main.actual.haveVisited = true;
                    $.post('/draw/register-visit', { type: 'survey', drawId: DashboardApp.draws.survey.actual.id })
                        .done(function () {
                        DashboardApp.draws.survey.actual.haveVisited = 1;
                        $.post('/draw/register-visit', { drawId: DashboardApp.draws.video.actual.id })
                            .done(function () {
                            DashboardApp.draws.video.actual.haveVisited = true;
                            $.post('/draw/register-visit', { type: 'stackpot', drawId: DashboardApp.draws.stackpot.actual.id })
                                .done(function () {
                                DashboardApp.draws.stackpot.actual.haveVisited = 1;
                                location.href='/#/draw/stackpot';
                                window.location.reload(true);
                            });
                        });
                    });
                });
            }
        };
    }


    var settingDiv=$ele({ele:"div",parent:div,class:"setting",style:"display:none",html:`<h4 align="center">全局设置</h4><p><input id="allAutoOpen" type="checkbox" ${autoOpen?"checked":""} />自动打开任务页面</p><button id="settingSave" style="width:48px;margin:0 33%">保存</button>`});
    $id("settingSave").onclick=()=>{
        let setting=GM_getValue("setting");
        setting['autoOpen']=$id("allAutoOpen").checked;
        autoOpen=setting['autoOpen'];
        GM_setValue("setting",setting);
        $jq("#exInfo").show();
        info("","color:green","保存成功！");
    };
    function settingFuc(){
        autoOpen=GM_getValue("setting")['autoOpen'];
        $jq(settingDiv).toggle();
    }


    //加愿望单
    function wishlist(appId,sessionID,act,fuc=""){
        let p=info("","",`正在${act=="addtowishlist"?"添加":"移除"}愿望单<a href="https://store.steampowered.com/app/${appId}" target="_blank">${appId}</a>...`);
        httpSend({
            mode:"gm",
            url:"https://store.steampowered.com/api/"+act,
            type:"post",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data:`sessionid=${sessionID}&appid=${appId}`,
            callback:function(data){
                console.log(data);
                if(!empty(data.text)&&(data.json.success==true)){
                    addR(p,"OK","success");
                    if(fuc) fuc(1);
                }else{
                    //console.log(data);
                    httpSend({
                        mode:"gm",
                        url:"https://store.steampowered.com/app/"+appId,
                        type:"get",
                        callback:function(data){
                            if(/已在库中/.test(data.text)){
                                addR(p,"OK","success");
                                if(fuc) fuc(1);
                            }else if(/添加至您的愿望单/.test(data.text)){
                                if(act=="addtowishlist"){
                                    addR(p,"ERROR","err");
                                    if(fuc) fuc(0);
                                }else{
                                    addR(p,"OK","success");
                                    if(fuc) fuc(1);
                                }
                            }else{
                                if(act=="addtowishlist"){
                                    addR(p,"OK","success");
                                    if(fuc) fuc(1);
                                }else{
                                    addR(p,"ERROR","err");
                                    if(fuc) fuc(0);
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    //关注游戏
    function followGame(appId,sessionID,act,fuc=""){
        let p=info("","",`正在${act==0?"关注":"取关"}游戏<a href="https://store.steampowered.com/app/${appId}" target="_blank">${appId}</a>...`);
        httpSend({
            mode:"gm",
            url:"https://store.steampowered.com/explore/followgame/",
            type:"post",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data:`sessionid=${sessionID}&appid=${appId}&unfollow=${act}`,
            callback:function(data){
                console.log(data);
                if(!empty(data.text)&&(data.text=="true")){
                    addR(p,"OK","success");
                }else{
                    httpSend({
                        mode:"gm",
                        url:"https://store.steampowered.com/app/"+appId,
                        type:"get",
                        callback:function(data){
                            if(data.text.indexOf(`class="btnv6_blue_hoverfade btn_medium queue_btn_active" style="">`)>-1){
                                act==0?addR(p,"OK","success"):addR(p,"ERROR","err");
                            }else{
                                act==0?addR(p,"ERROR","err"):addR(p,"OK","success");
                            }
                        }
                    });
                }
            }
        });
    }

    //加组
    function jionSteamGroup(href,name,sessionID,task=[],i=0){
        let p=info("","",`正在加入steam组<a href="${href}" target="_blank">${name}</a>...`);
        httpSend({
            mode:"gm",
            type:"post",
            url:href,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({ action: "join", sessionID: sessionID }),
            callback:(data)=>{
                if(data.status==200){
                    if(data.text.includes("grouppage_join_area")){
                        addR(p,"失败！","err");
                    }else{
                        addR(p,"成功！","success");
                    }
                }else{
                    addR(p,"失败:"+data.status,"err");
                }
            }
        });
    }
    //浏览页面任务
    function visitLink(e){
        let p=info("","",`正在做浏览页面任务<a href="${e}" target="_blank">${e}</a>...`);
        try{
            httpSend({
                mode:"gm",
                type:"get",
                url:e,
            });
        }catch(err){
        }finally{
            addR(p,"ok","success");
        }
    }
    //做加组、关注等任务
    function doTask(callback,time,limitTime){
        $jq('button>span:contains("Join ")').length+$jq('button>span:contains("Follow ")').length==0||new Date().getTime()-time>limitTime*1000?callback():setTimeout(()=>{doTask(callback,time,limitTime)},300);
    }

    //做退组、取关等任务
    removeBtn.onclick=()=>{
        $jq("#exInfo").show();
        info("","",`正在退组、取关，请稍候！`);
        $jq('button>span:contains("Leave ")').click();
        $jq('button>span:contains("Unfollow ")').click();
    };

    //显示信息
    function info(cText,sText,iText){
        let p=$ele({ele:"p","class":cText,"style":sText,html:iText,parent:div2});
        p.scrollIntoView();
        return p;
    }

    //任务执行结果
    function addR(p,t,r="success"){
        switch(r){
            case "success":
                p.innerHTML+=`<font style='color:green'>${t}</font>`;
                break;
            case "info":
                p.innerHTML+=`<font style='color:blue'>${t}</font>`;
                break;
            case "err":
            case "error":
                p.innerHTML+=`<font style='color:red'>${t}</font>`;
                break;
            case "warn":
            case "warning":
                p.innerHTML+=`<font style='color:blue'>${t}</font>`;
                break;
            default:
                p.innerHTML+=t;
                break;
        }
    }

    //button样式
    function btn_class(e){
        $jq(".auto-task").attr("class",e+" auto-task");
    }

    function setH(e){
        div.style.top=e+'px !important';
    }

    //防止弹出新窗口
    function banNewBlock(){
        let d=new Date();
        let cookiename = "haveVisited1";
        document.cookie = cookiename + "=1; path=/";
        document.cookie = cookiename + "=" + (d.getUTCMonth()+1) + "/" + d.getUTCDate() + "/" + d.getUTCFullYear() + "; path=/";
    }

    function showUpdate(){
        let setting=GM_getValue("setting");
        let updateText=setting.updateText;
        if(updateText){
            $jq("#exInfo").show();
            info('','color:red;font-weight:900',"v"+setting.version+"更新内容：</br>"+updateText.replace(/\/n/g,"</br>")+" </br>此消息只显示一次！");
            alert("！！！开启下个大版本测试，对新版脚本功能有什么建议请前往https://ask.hclonely.com/article/1讨论\n此消息只显示一次！");
            setting['updateText']='';
            GM_setValue("setting",setting);
        }
    }
    GM_registerMenuCommand('隐藏按钮',()=>{$jq(div).hide()});
    GM_registerMenuCommand('显示按钮',()=>{$jq(div).show()});

}catch(e){
    $err("自动任务脚本出错: \n"+e.stack);
    confirm("自动任务脚本出错! \n点击确定复制错误信息,或打开控制台查看错误信息！")&&($copy(e.stack));
}