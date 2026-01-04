// ==UserScript==
// @name         外星人论坛任务辅助
// @namespace    sourcewater
// @version      0.33.59
// @description  外星人论坛任务辅助，参考了一下别人的代码脚本介绍有详细写出。
// @author       sourcewater
// @match        https://*.alienwarearena.com/*
// @exclude      https://*.alienwarearena.com/account
// @exclude      https://*.alienwarearena.com/account/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/411196/%E5%A4%96%E6%98%9F%E4%BA%BA%E8%AE%BA%E5%9D%9B%E4%BB%BB%E5%8A%A1%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/411196/%E5%A4%96%E6%98%9F%E4%BA%BA%E8%AE%BA%E5%9D%9B%E4%BB%BB%E5%8A%A1%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const S_S_S_S_LOG_DEBUG_LEVEL=0;
    const S_S_S_S_LOG_INFO_LEVEL=3;
    function log(level){
        let logObj=new Object;
        let globalLogLevel=level;
        function log(msg,clevel){
            clevel+=1;
            if(clevel>globalLogLevel){
                console.log(msg);
            }
        }
        logObj.debug=function(msg){
            log(msg,S_S_S_S_LOG_DEBUG_LEVEL);
        }
        logObj.info=function(msg){
            log(msg,S_S_S_S_LOG_INFO_LEVEL);
        }
        return logObj;
    }
    const logger=log(S_S_S_S_LOG_INFO_LEVEL);

    function showFlashMessage(message, type, removeActions) {
        type          = type || 'success';
        removeActions = removeActions === undefined ? true : removeActions;

        // Close previous flash messages
        $.notifyClose();

        $.notify({
            type: type,
            message: message
        }, {
            delay: 0,
            template:`<div data-notify="container"  class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">
                              <button type="button" class="close" data-notify="dismiss" data-dismiss="alert" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                              </button>
                              <span data-notify="message">{2}</span>
                           </div>`
            });

        if (removeActions) { $('#giveaway-actions').remove(); }
    }

    function waitForContainer(){
        let container=document.querySelector("#mCSB_2_container");
        if(!container){
            setTimeout(waitForContainer,200);
            return;
        }
        logger.info("Container found!");

        let sections=container.getElementsByTagName("section");
        let mainSection;
        for(let i=0;i<sections.length;++i){
            if(sections[i].className.indexOf("um-main")!=-1){
                mainSection=sections[i];
            }
        }

        GM_addStyle(`
        .s-s-s-s-btn:focus {
            outline:0;
            box-shadow:0 0 0 3px #666666;
        }
    `);

        function autoQuest(i){
            const QUEST_LIST=["read_articles","post_replies","change_border","change_badge","share_page","add_video","change_avatar","visit_page","update_about_me","create_article","visit_leaderboard"];
            let voteStatus=document.querySelector("#s_s_s_s_vote_status");
            let questCount=voteStatus.getAttribute("s_s_quest_count");
            let questTitle=voteStatus.getAttribute("s_s_quest_title"+i);
            let questId=voteStatus.getAttribute("s_s_quest_id"+i);
            let questType=voteStatus.getAttribute("s_s_quest_type"+i);
            let questEarned=voteStatus.getAttribute("s_s_points_earned"+i);
            let questItems=document.querySelectorAll(".quest-item");
            let questProgress=questItems[i].getElementsByClassName("quest-item-progress");
            let progress,arpProgress=null,tcount=null;
            let questRepeated=0;
            let questRepeatedTotal=1;
            let incomplete=false;
            progress=questProgress[0];
            arpProgress=questProgress[1];
            tcount=progress.innerHTML.match(/([\d])+\/([\d]+)/);
            if(tcount){
                questRepeated=tcount[1]*1;
                questRepeatedTotal=tcount[2]*1;
                //let arpCount=arpProgress.innerHTML.match(/([\d])+\/([\d]+)/);
            }else{
                incomplete=true;
            }
            function afterCompleted(){
                if(arpProgress){
                    arpProgress.innerHTML=`${questEarned}/${questEarned}`;
                }
                if(incomplete){
                    progress.innerHTML="Complete";
                }
            }
            logger.info(questTitle);
            //showFlashMessage("初始化任务，请等待！","info",false);
            if(QUEST_LIST[0]==questType){
                //Extra Extra! Read all about it!
                showFlashMessage("初始化任务&lt;阅读新闻&gt;，请等待！","info",false);
                let url="/ucf/News";
                $.ajax({url: url,type: 'get',success: function(html) {
                    logger.debug(questRepeated+" pieces of news already readed!");
                    logger.debug(questRepeatedTotal+" pieces of news in total!");
                    showFlashMessage("开始阅读 "+(questRepeatedTotal-questRepeated)+" 篇文章！请耐心等待，每阅读一篇文章会随机等待数秒。","info",false);
                    let frEle=document.createElement("frame");
                    frEle.innerHTML=html;
                    let newsList=frEle.getElementsByClassName("news__listing-post");
                    let urls=[];
                    for(let i=0;i<newsList.length;++i){
                        urls[i]=newsList[i].href;
                    }
                    let i=questRepeated,j=questRepeated;
                    function getHTML(url){
                        $.ajax({url: url,type: 'get',success: function(html) {
                            if(tcount){
                                progress.innerHTML=(i+1)+"/"+questRepeatedTotal;
                            }else{
                                arpProgress.innerHTML=(i+1)+"/"+questRepeatedTotal;
                            }
                            ++i;
                            ++j;
                            logger.info(i+" pieces of news already readed!");
                            if(i<questRepeatedTotal&&j<urls.length){
                                let sleepTime=((Math.random()*10>>0)%6)*200;
                                setTimeout(()=>{ getHTML(urls[j]);},sleepTime);
                            }else{
                                if(tcount){
                                    progress.innerHTML=i+"/"+questRepeatedTotal;
                                }else{
                                    arpProgress.innerHTML=i+"/"+questRepeatedTotal;
                                }
                                showFlashMessage(questRepeatedTotal+" 篇文章阅读完毕。","info",false);
                                afterCompleted();
                            }
                        }}).fail(function(xhr,textStatus){
                            if(xhr.status==404){
                                let sleepTime=((Math.random()*10>>0)%6)*200;
                                ++j;
                                setTimeout(()=>{ getHTML(urls[j]);},sleepTime);
                                logger.info("News 404 Error!");
                            }else{
                                showFlashMessage("请求错误，请稍后重试！","info",false);
                            }
                        }).always(function(){
                            //
                        });
                    }
                    getHTML(urls[j]);
                }}).fail(function(html){
                    showFlashMessage("请求错误，请稍后重试！","info",false);
                });
            }else if(QUEST_LIST[1]==questType){
                //Converse and be Merry!
                showFlashMessage("初始化任务&lt;发表回复&gt;，请等待！","info",false);
                let url="/forums/board/113/awa-on-topic";
                $.ajax({url: url,type: 'get',success: function(html) {
                    let keyword=questTitle.match(/([a-zA-Z]+ ?)+/g).join().replace(/ /g,"-").toLowerCase();
                    let questUrls=html.match(/href="(.*)".*data-topic-id/g);
                    let questUrl="";
                    for(let i=0;i<questUrls.length;++i){
                        if(questUrls[i].lastIndexOf(keyword)>-1){
                            questUrl=questUrls[i].match(/"(.*)"/)[1];
                            break;
                        }
                    }
                    logger.debug(questUrl);
                    if(questUrl!=""){
                        showFlashMessage(`点击&nbsp;<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="`+questUrl+`">链接</a>&nbsp;跳转到页面，然后回复 `+(questRepeatedTotal-questRepeated)+` 次即可！`,"info",false);
                    }else{
                        showFlashMessage(`没有找到帖子，可以在论坛里面回复帖子 `+(questRepeatedTotal-questRepeated)+` 次，请勿灌水！`,"info",false);
                    }
                }}).fail(function(html){
                    showFlashMessage("请求错误，请稍后重试！","info",false);
                }).always(function(){
                    //
                });
            }else if(QUEST_LIST[2]==questType){
                //Border Swap!
                showFlashMessage("初始化任务&lt;更改边框&gt;，请等待！","info",false);
                let url="/border/select";
                let borderUrl="/account/personalization";
                let orgData;
                $.ajax({url: borderUrl,type: 'get',success: function(html) {
                    let frEle=document.createElement("frame");
                    frEle.innerHTML=html;
                    let userborder=frEle.getElementsByClassName("account-borders__current")[0];
                    let userBorderImg=userborder.getElementsByClassName("border");
                    if(userBorderImg.length!=0){
                        userBorderImg=userBorderImg[0].src;
                        logger.debug(userBorderImg);
                        let borderListEle=frEle.getElementsByClassName("account-borders__list")[0].getElementsByClassName("account-borders__list-border");
                        for(let i=0;i<borderListEle.length;++i){
                            if(borderListEle[i].firstElementChild.src==userBorderImg){
                                orgData=`{"id":`+borderListEle[i].getAttribute("data-border-id")+`}`;
                                break;
                            }
                        }
                    }else{
                        orgData=`{"id":1}`;
                    }
                    logger.debug(orgData);
                    $.ajax({url: url,data: orgData,type: 'post',success: function(html) {
                        showFlashMessage("成功更改边框！","info",false);
                        afterCompleted();
                        logger.debug(html);
                    }}).fail(function(html){
                        showFlashMessage("请求错误，请稍后重试！","info",false);
                    }).always(function(){
                        //
                    });
                }}).fail(function(html){
                    //logger.debug("failed");
                }).always(function(){
                    //
                });
            }else if(QUEST_LIST[3]==questType){
                //Badge Swap!
                showFlashMessage("初始化任务&lt;更改徽章&gt;，请等待！","info",false);
                let url="/badges/update/"+user_id;
                let badgeUrl="/account/personalization";
                let orgData;
                $.ajax({url: badgeUrl,type: 'get',success: function(html) {
                    let orgData=html.match(/let.*?selectedBadges.*?=.*?(\[.*\]).*;/)[1];
                    logger.debug(orgData);
                    $.ajax({url: url,data: orgData,type: 'post',success: function(html) {
                        if(html.success){
                            showFlashMessage("成功更改徽章！","info",false);
                            afterCompleted();
                        }else{
                            showFlashMessage("更改徽章时发生错误，请稍后重试！","info",false);
                        }
                        //logger.debug(html);
                    }}).fail(function(html){
                        showFlashMessage("请求错误，请稍后重试！","info",false);
                    }).always(function(){
                        //
                    });
                }}).fail(function(html){
                    //logger.debug("failed");
                }).always(function(){
                    //
                });
            }else if(QUEST_LIST[4]==questType){
                //Share a page to social media!
                showFlashMessage("初始化任务&lt;分享帖子&gt;，请等待！","info",false);
                let url="/ucf/News";
                let shareUrl="/arp/quests/share/"
                $.ajax({url: url,type: 'get',success: function(html) {
                    let frElement=document.createElement("frame");
                    frElement.innerHTML=html;
                    let shareId=frElement.getElementsByClassName("news__top-widgets")[0].getElementsByClassName("news__top-widgets__box")[0].href.match(/\/ucf\/show\/(\d+)\//)[1];
                    shareUrl+=shareId;
                    $.ajax({url: shareUrl,type: 'post',success: function(html) {
                        showFlashMessage("分享成功！","info",false);
                        afterCompleted();
                    }}).fail(function(html){
                        showFlashMessage("请求错误，请稍后重试！","info",false);
                    }).always(function(){
                        //
                    });
                }}).fail(function(html){
                    showFlashMessage("请求错误，请稍后重试！","info",false);
                }).always(function(){
                    //
                });
            }else if(QUEST_LIST[5]==questType){
                // Add a video of ...
                showFlashMessage("初始化任务&lt;提交视频&gt;，请等待！","info",false);
                let url="/ucf/Video/new?boardId=0&groupId=0";
                showFlashMessage(`请到这个<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="/ucf/Video/new?boardId=0&groupId=0">页面</a>添加一个油管视频！只需要复制粘贴油管视频的链接，然后其他文本域会自动填充（自动填充功能需要该电脑能上油管！），然后提交就行。`,"info",false);
            }else if(QUEST_LIST[6]==questType){
                // New avatar
                showFlashMessage("初始化任务&lt;更换头像&gt;，请等待！","info",false);
                let url="/account/personalization";
                $.ajax({url: url,type: 'get',success: function(html) {
                    let frElement=html.match(/<div class="row account-avatar__history"(.|\n)+?div>/);
                    let avaIdReg=/data-avatar-id="([0-9a-z\-]*?)"/;
                    if(!avaIdReg.test(frElement[0])){
                        showFlashMessage(`请到这个<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="${url}">页面</a>更改一下头像。有了头像的历史记录才能自动完成任务！`,"info",false);
                    }else{
                        let imgId=frElement[0].match(avaIdReg)[1];
                        let updateUrl="/account/profile/avatars/switch/"+imgId;
                        function updateAvatar(count,total){
                            if(count<=total){
                                $.ajax({url: updateUrl,type: 'get',success: function(html) {
                                    updateAvatar(++count,total);
                                    if(count==total){
                                        showFlashMessage("更改头像成功！","info",false);
                                        afterCompleted();
                                    }
                                }}).fail(function(html){
                                    showFlashMessage("请求错误，请稍后重试！","info",false);
                                }).always(function(){
                                    //
                                });
                            }else{
                                logger.debug(`更改头像: ${count} - ${total}`);
                            }
                        }
                        showFlashMessage(`开始任务：更改头像${questRepeatedTotal-questRepeated}次！`,"info",false);
                        updateAvatar(questRepeated,questRepeatedTotal);
                    }
                }}).fail(function(html){
                    showFlashMessage("请求错误，请稍后重试！","info",false);
                }).always(function(){
                    //
                });
            }else if(QUEST_LIST[7]==questType){
                //Quiz: visit the page ...
                showFlashMessage("初始化任务&lt;解谜&gt;，请等待！","info",false);
                let url="/forums/board/113/awa-on-topic";
                let reg1=/(\(.*?\))|([^\(\)]*)/g;
                let reg2=/[\da-zA-Z]+/g;
                let result=questTitle.match(reg1);
                let keywords;
                for(let i=0;i<result.length;++i){
                    if(result[i].lastIndexOf("(")<0){
                        keywords=result[i].match(reg2);
                        if(keywords.length>0) break;
                    }
                }
                logger.debug(keywords);
                $.ajax({url: url,type: 'get',success: function(html){
                    let frEle=document.createElement("frame");
                    frEle.innerHTML=html;
                    let threads=frEle.getElementsByClassName("forums__topic-link");
                    let questThreadUrl;
                    for(let i=0;i<threads.length;++i){
                        let title=threads[i].getAttribute("title");
                        if(title.toLowerCase().lastIndexOf("quest")<0) continue;
                        let thsKeywords=title.match(reg2);
                        let keywordsCount=0;
                        for(let j=0;j<thsKeywords.length;++j){
                            if(thsKeywords[j].toLowerCase()==keywords[keywordsCount].toLowerCase()){
                                ++keywordsCount;
                                if(keywordsCount==keywords.length){
                                    if(!questThreadUrl) questThreadUrl=threads[i].href;
                                    break;
                                }
                            }else{
                                keywordsCount=0;
                            }
                            if(questThreadUrl){
                                break;
                            }
                        }
                    }
                    if(questThreadUrl){
                        showFlashMessage(`解谜任务可以到这个<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="`+questThreadUrl+`">帖子</a>找到答案！`,"info",false);
                        logger.debug(questThreadUrl);
                    }else{
                        showFlashMessage(`解谜任务可以到这个<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="`+url+`">版块</a>等到坛友发帖得到答案！`,"info",false);
                    }
                }}).fail(function(html){
                    //
                }).always(function(html){
                    //
                });
            }else if(QUEST_LIST[8]==questType){
                showFlashMessage("初始化任务&lt;更新简介&gt;，请等待！","info",false);
                let url="/account";
                showFlashMessage(`请到这个<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="`+url+`">页面</a>修改自己的简介。`,"info",false);
                $.ajax({url: "/account/about",type: 'post',data:{about:"We come in here. We're updating the about section.\n\nWARNING! For some it doesn't work, you have to use as many characters as possible. It's best to copy the same thing several times."},success: function(html) {
                    //showFlashMessage("更新简介成功！","info",false);
                    //afterCompleted();
                }}).fail(function(html){
                    //showFlashMessage("请求错误，请稍后重试！","info",false);
                }).always(function(){
                    //
                });
            }else if(QUEST_LIST[9]==questType){
                showFlashMessage("初始化任务&lt;写一篇文章&gt;，请等待！","info",false);
                let url="/ucf/News/new?boardId=0&groupId=0";
                showFlashMessage(`请到这个<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="`+url+`">页面</a>发表一篇文章。`,"info",false);
            }else if(QUEST_LIST[10]==questType){
                showFlashMessage("访问链接&lt;Climbing the ladder&gt;，请等待！","info",false);
                let url="/rewards/leaderboard";
                showFlashMessage(`点击链接<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="`+url+`">Climbing the ladder</a>。`,"info",false);
            }else{
                let url="/forums/board/113/awa-on-topic";
                showFlashMessage(`未知任务！可以到这个<a target="_blank" style="color:purple;font-weight:bold;text-decoration:underline;" href="`+url+`">版块</a>等到坛友发帖得到答案！`,"info",false);
            }
        }

        let upVoteContent=`

        <section class="border-top mt-2" style="display:none;">
            <div class="row py-3">
                <div class="col-12 col-md-8 pr-0 align-self-center border-right border-light text-center">
                    <a href="javascript:s_s_s_s_voteUp_function();" class="btn btn-primary s-s-s-s-btn" style="color:#c0c2c4!important;border:1px solid #c0c2c4!important;">Up Vote</a>
        </div>
        <div id="s_s_s_s_vote_status" class="col-12 align-self-center col-md-4 pr-4 text-center"></div>
        </div>
            </section>

    `;

        mainSection.outerHTML+=upVoteContent;

        function getContentId(){
            $.getJSON("/esi/featured-tile-data/News", function(data){
                let contentId=data.data[0].url.match(/\/ucf\/show\/([\d]+)/)[1];
                document.querySelector("#s_s_s_s_vote_status").setAttribute("s_s_s_s_contentId",contentId);
                logger.debug(contentId);
            });
        }
        getContentId();

        let currentContentVotes,maximumContentVotes,questCompleted,pointsEarned;
        let questId,questTitle,questType,questCount;
        let questEventLinkPrefix="s_s_quest_event_link_";
        async function initStatus(){
            logger.info("initStatus");
            let CC={"AD":"安道尔","AE":"阿联酋","AF":"阿富汗","AG":"安提瓜和巴布达","AI":"安圭拉","AL":"阿尔巴尼亚","AM":"亚美尼亚","AO":"安哥拉","AQ":"南极洲","AR":"阿根廷","AS":"美属萨摩亚","AT":"奥地利","AU":"澳大利亚","AW":"阿鲁巴","AX":"奥兰群岛","AZ":"阿塞拜疆","BA":"波黑","BB":"巴巴多斯","BD":"孟加拉","BE":"比利时","BF":"布基纳法索","BG":"保加利亚","BH":"巴林","BI":"布隆迪","BJ":"贝宁","BL":"圣巴泰勒米岛","BM":"百慕大","BN":"文莱","BO":"玻利维亚","BQ":"荷兰加勒比区","BR":"巴西","BS":"巴哈马","BT":"不丹","BV":"布韦岛","BW":"博茨瓦纳","BY":"白俄罗斯","BZ":"伯利兹","CA":"加拿大","CC":"科科斯群岛","CF":"中非","CH":"瑞士","CL":"智利","CM":"喀麦隆","CO":"哥伦比亚","CR":"哥斯达黎加","CU":"古巴","CV":"佛得角","CX":"圣诞岛","CY":"塞浦路斯","CZ":"捷克","DE":"德国","DJ":"吉布提","DK":"丹麦","DM":"多米尼克","DO":"多米尼加","DZ":"阿尔及利亚","EC":"厄瓜多尔","EE":"爱沙尼亚","EG":"埃及","EH":"西撒哈拉","ER":"厄立特里亚","ES":"西班牙","FI":"芬兰","FJ":"斐济群岛","FK":"马尔维纳斯群岛（ 福克兰）","FM":"密克罗尼西亚联邦","FO":"法罗群岛","FR":"法国","GA":"加蓬","GD":"格林纳达","GE":"格鲁吉亚","GF":"法属圭亚那","GH":"加纳","GI":"直布罗陀","GL":"格陵兰","GN":"几内亚","GP":"瓜德罗普","GQ":"赤道几内亚","GR":"希腊","GS":"南乔治亚岛和南桑威奇群岛","GT":"危地马拉","GU":"关岛","GW":"几内亚比绍","GY":"圭亚那","HK":"中国香港","HM":"赫德岛和麦克唐纳群岛","HN":"洪都拉斯","HR":"克罗地亚","HT":"海地","HU":"匈牙利","ID":"印尼","IE":"爱尔兰","IL":"以色列","IM":"马恩岛","IN":"印度","IO":"英属印度洋领地","IQ":"伊拉克","IR":"伊朗","IS":"冰岛","IT":"意大利","JE":"泽西岛","JM":"牙买加","JO":"约旦","JP":"日本","KH":"柬埔寨","KI":"基里巴斯","KM":"科摩罗","KW":"科威特","KY":"开曼群岛","LB":"黎巴嫩","LI":"列支敦士登","LK":"斯里兰卡","LR":"利比里亚","LS":"莱索托","LT":"立陶宛","LU":"卢森堡","LV":"拉脱维亚","LY":"利比亚","MA":"摩洛哥","MC":"摩纳哥","MD":"摩尔多瓦","ME":"黑山","MF":"法属圣马丁","MG":"马达加斯加","MH":"马绍尔群岛","MK":"马其顿","ML":"马里","MM":"缅甸","MO":"中国澳门","MQ":"马提尼克","MR":"毛里塔尼亚","MS":"蒙塞拉特岛","MT":"马耳他","MV":"马尔代夫","MW":"马拉维","MX":"墨西哥","MY":"马来西亚","NA":"纳米比亚","NE":"尼日尔","NF":"诺福克岛","NG":"尼日利亚","NI":"尼加拉瓜","NL":"荷兰","NO":"挪威","NP":"尼泊尔","NR":"瑙鲁","OM":"阿曼","PA":"巴拿马","PE":"秘鲁","PF":"法属波利尼西亚","PG":"巴布亚新几内亚","PH":"菲律宾","PK":"巴基斯坦","PL":"波兰","PN":"皮特凯恩群岛","PR":"波多黎各","PS":"巴勒斯坦","PW":"帕劳","PY":"巴拉圭","QA":"卡塔尔","RE":"留尼汪","RO":"罗马尼亚","RS":"塞尔维亚","RU":"俄罗斯","RW":"卢旺达","SB":"所罗门群岛","SC":"塞舌尔","SD":"苏丹","SE":"瑞典","SG":"新加坡","SI":"斯洛文尼亚","SJ":"斯瓦尔巴群岛和扬马延岛","SK":"斯洛伐克","SL":"塞拉利昂","SM":"圣马力诺","SN":"塞内加尔","SO":"索马里","SR":"苏里南","SS":"南苏丹","ST":"圣多美和普林西比","SV":"萨尔瓦多","SY":"叙利亚","SZ":"斯威士兰","TC":"特克斯和凯科斯群岛","TD":"乍得","TG":"多哥","TH":"泰国","TK":"托克劳","TL":"东帝汶","TN":"突尼斯","TO":"汤加","TR":"土耳其","TV":"图瓦卢","TZ":"坦桑尼亚","UA":"乌克兰","UG":"乌干达","US":"美国","UY":"乌拉圭","VA":"梵蒂冈","VE":"委内瑞拉","VG":"英属维尔京群岛","VI":"美属维尔京群岛","VN":"越南","WF":"瓦利斯和富图纳","WS":"萨摩亚","YE":"也门","YT":"马约特","ZA":"南非","ZM":"赞比亚","ZW":"津巴布韦","CN":"中国内地","CG":"刚果（布）","CD":"刚果（金）","MZ":"莫桑比克","GG":"根西岛","GM":"冈比亚","MP":"北马里亚纳群岛","ET":"埃塞俄比亚","NC":"新喀里多尼亚","VU":"瓦努阿图","TF":"法属南部领地","NU":"纽埃","UM":"美国本土外小岛屿","CK":"库克群岛","GB":"英国","TT":"特立尼达和多巴哥","VC":"圣文森特和格林纳丁斯","TW":"中国台湾省","NZ":"新西兰","SA":"沙特阿拉伯","LA":"老挝","KP":"朝鲜 北朝鲜","KR":"韩国 南朝鲜","PT":"葡萄牙","KG":"吉尔吉斯斯坦","KZ":"哈萨克斯坦","TJ":"塔吉克斯坦","TM":"土库曼斯坦","UZ":"乌兹别克斯坦","KN":"圣基茨和尼维斯","PM":"圣皮埃尔和密克隆","SH":"圣赫勒拿","LC":"圣卢西亚","MU":"毛里求斯","CI":"科特迪瓦","KE":"肯尼亚","MN":"蒙古国"}
            let userCountry=user_country;
            if(userCountry){
                let username=document.querySelector("#mCSB_2_container").querySelector(".um-username-link");
                if(username){
                    username.outerHTML+=`<span style="font-size:0.67rem;color:#00baf8;font-family:Microsoft YaHei;">&nbsp;-&nbsp;${CC[userCountry]}</span>`;
                }
            }
            const response = await fetch('/api/v1/users/arp/status', {credentials: 'same-origin'}).catch((error) => {throw error});
            const status = await response.json();
            questCount=status.quests.length;
            const contentVotes = status.daily_arp[1].status.split(' ');
            currentContentVotes = parseInt(contentVotes[0], 10);
            maximumContentVotes = parseInt(contentVotes[2], 10);
            let voteStatus=document.querySelector("#s_s_s_s_vote_status");
            if(voteStatus)voteStatus.innerHTML=""+currentContentVotes+"/"+maximumContentVotes;
            for(let i=0;i<questCount;++i){
                questId=status.quests[i].quest_id;
                questTitle=status.quests[i].title;
                questType=status.quests[i].type;
                questCompleted=status.quests[i].completed;
                pointsEarned=status.quests[i].points_earned;
                logger.debug(status.quests[i]);
                logger.debug(questTitle);
                logger.debug(questType);
                let questEle=document.querySelectorAll(".quest-title")[i];
                logger.debug(questEle.outerHTML);
                let questProgressEle=document.querySelectorAll(".quest-item")[i].getElementsByClassName("quest-item-progress")[1];
                logger.debug("quest completed: "+questCompleted);
                if(!questCompleted){
                    if(questEle.tagName.toLowerCase()!="a"){
                        voteStatus.setAttribute("s_s_quest_id"+i,""+questId);
                        voteStatus.setAttribute("s_s_quest_title"+i,""+questTitle);
                        voteStatus.setAttribute("s_s_quest_type"+i,""+questType);
                        voteStatus.setAttribute("s_s_points_earned"+i,""+pointsEarned);
                        questEle.outerHTML=`<a id="${questEventLinkPrefix}${i}" href="#" style="text-decoration:underline;">`+questEle.outerHTML+`</a>`;
                    }else{
                        let questEleStyle=questEle.getAttribute("style");
                        questEle.setAttribute("style", (questEleStyle ? questEleStyle : "")+"text-decoration:underline !important;");
                    }
                    questProgressEle.innerHTML+="/"+pointsEarned;
                }
            }
            voteStatus.setAttribute("s_s_quest_count",""+questCount);
            for(let i=0;i<questCount;++i){
                document.querySelector("#"+questEventLinkPrefix+i).addEventListener("click",function(){autoQuest(i)});
            }
            logger.info("Initialized status!");
        }
        initStatus();


        function upVoteFunction(){

            function s_s_s_s_voteUp_function(){
                let baseId=((parseInt($("#s_s_s_s_vote_status").attr("s_s_s_s_contentId"),10)/100000-3)>>0)*100000;
                logger.debug("baseId: "+baseId);
                let voteStatus=$("#s_s_s_s_vote_status");
                if(voteStatus.text()==""){
                    showFlashMessage("<p>请等待</p><p>投票系统尚未就绪！","info",false);
                    return;
                }
                const MAX_COUNT=80;
                let voteStatusText=voteStatus.text().match(/^([\d]+)\/([\d]+)$/);
                let voteCount=parseInt(voteStatusText[1],10);
                let voteMax=parseInt(voteStatusText[2],10);
                let voteSuccessCount=0;
                let date=new Date();
                let baseDate=((date.getMonth()+1)*100+date.getDate())*MAX_COUNT;
                //start!
                let baseContentId=baseId+baseDate;
                let notifyTitle=document.createElement("p");
                let notifyMessage=document.createElement("p");
                let notifyList=document.createElement("ul");
                let upVoteButton=document.querySelector(".s-s-s-s-btn");
                if(voteCount<voteMax){
                    notifyTitle.innerHTML="投票中...";
                    notifyMessage.innerHTML="正在投票！在投票完成前请不要点击当前页面的任何链接或者关闭当前页面。如果遇到投票失败，请手动投票！";
                    logger.info("Start voting");
                    showFlashMessage(notifyTitle.outerHTML+notifyMessage.outerHTML,"info",false);
                    upVoteButton.setAttribute("href","javascript:void(0);");
                }else{
                    notifyTitle.innerHTML="错误";
                    notifyMessage.innerHTML="投票次数已达上限！";
                    showFlashMessage(notifyTitle.outerHTML+notifyMessage.outerHTML,"info",false);
                    return;
                }
                function applyContentVoting() {
                    if(voteSuccessCount<voteMax&&voteCount<MAX_COUNT){
                        let contentId=baseContentId+voteCount;
                        logger.debug(contentId);
                        let votingURL = `/ucf/vote/up/${contentId}`;
                        let contentList=notifyList.innerHTML;
                        $.ajax({url: votingURL,type: 'post',success: function(data) {
                            logger.debug(data.message);
                            if(data.success){
                                ++voteSuccessCount;
                                voteStatus.text(voteSuccessCount+"/"+voteMax);
                                contentList+=`<li><a target="_blank" href="/ucf/show/${contentId}">${contentId}</a>: 投票成功！</li>`;

                            }else{
                                contentList+=`<li  style="color:red"><a target="_blank" href="/ucf/show/${contentId}">${contentId}</a>: 失败，已经投过票了！</li>`;
                            }
                            notifyList.innerHTML=contentList;
                        }})
                            .fail(function(data) {
                            logger.debug("up vote failed!");
                            logger.debug(data);
                            contentList+=`<li style="color:red"><a target="_blank" href="/ucf/show/${contentId}">${contentId}</a>: 投票失败，可能帖子被删除！</li>`;
                            notifyList.innerHTML=contentList;
                        })
                            .always(function() {
                            ++voteCount;
                            if(voteSuccessCount<voteMax){
                                let sleepTime=((Math.random()*10>>0)%8+5)*1000;
                                logger.debug("sleep: "+sleepTime);
                                setTimeout(()=>{applyContentVoting()},sleepTime);
                            }else{
                                logger.info("Up vote done!");
                                notifyTitle.innerHTML="投票结束！";
                                notifyMessage.innerHTML="如果遇到投票失败，请手动投票！";
                                showFlashMessage(notifyTitle.outerHTML+notifyMessage.outerHTML+notifyList.outerHTML,"info",false);
                                upVoteButton.setAttribute("href","javascript:s_s_s_s_voteUp_function();");
                            }
                        });
                    }
                }
                applyContentVoting();
            }
        };
    }

    waitForContainer();

})();