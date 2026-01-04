// ==UserScript==
// @name         其乐加体力
// @namespace    sourcewater
// @version      0.0.1
// @description  其乐加体力!
// @author       sourcewater
// @match        https://keylol.com/home.php?*mod=space*type=reply*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/404936/%E5%85%B6%E4%B9%90%E5%8A%A0%E4%BD%93%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/404936/%E5%85%B6%E4%B9%90%E5%8A%A0%E4%BD%93%E5%8A%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function saveTxt(filename,data){
        let winObj=window.URL || window.webkitURL || window;
        let blob = new Blob([data],{type:'text/html'});
        let url=document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        url.href=winObj.createObjectURL(blob);
        url.download = filename;
        let ev = new MouseEvent ("click");
        url.dispatchEvent(ev);
    }

    const RETRY=99;
    const REPLY="reply";
    const VOTED="voted";
    const SCORE="score";
    const RATE_PER_DAY="rate_per_day";
    const RATE_PER_THREAD="rate_per_thread";
    const RATE_TOTAL="rate_total";
    const RATE_ALREADY="rate_already";
    const LAST_TIME="last_time";
    const TIME_LIMIT_MESSAGE="24小时限制";
    const START_DELAY=10;
    const formhash=document.querySelector("#nav-search-bar").querySelector(".search-bar-form").elements.formhash.value;
    let prepared=false;
    let editMode=false;
    let hasRated=false;

    //GM_setValue(REPLY,[]);
    //GM_setValue(VOTED,[]);
    //GM_setValue(LAST_TIME,{hours:15,minutes:33,seconds:39});
    //static/image/common/loading.gif

    let addoilEle=document.createElement("div");
    addoilEle.setAttribute("id","s_s_s_s_add_oil");
    addoilEle.setAttribute("style","");
    let addoilHtml=`
<div class="fwinmask" style="position: fixed; z-index: 201; left: 776px; top: 295px;" initialized="true">
    <style type="text/css">
    object {
        visibility: hidden;
    }
    </style>
    <table class="fwin" cellspacing="0" cellpadding="0">
        <tbody>
            <tr>
                <td class="t_l"></td>
                <td class="t_c"></td>
                <td class="t_r"></td>
            </tr>
            <tr>
                <td class="m_l">&nbsp;&nbsp;</td>
                <td class="m_c" style="">
                    <div class="tm_c" fwin="rate">
                        <h3 class="flb" style="cursor: move;">
                            <em fwin="rate">评分</em>
                            <span>
                                <a href="javascript:;" id="s_s_s_s_close_window" class="flbc" title="关闭">关闭</a></span>
                        </h3>
                        <div>
                            <div class="c">
                                <div>
                                    <table class="dt mbm" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <th width="65">体力/每天</th>
                                                <th width="85">体力/每次</th>
                                                <th width="65">总数/已评</th>
                                                <th width="65"><input id="s_s_s_s_rate_already" type="text" class="px z" placeholder="0" style="width: 25px;text-align:center;"></th>
                                            </tr>
                                            <tr>
                                                <td><input id="s_s_s_s_rate_per_day" type="text" class="px z" placeholder="0" style="width: 25px;text-align:center;"></td>
                                                <td><input id="s_s_s_s_rate_per_thread" type="text" class="px z" placeholder="0" style="width: 25px;text-align:center;"></td>
                                                <td><input id="s_s_s_s_rate_total" type="text" class="px z" placeholder="0" style="width: 25px;text-align:center;"></td>
                                                <td><button class="pn pnc" id="s_s_s_s_rate_prepare_button"><span>准备</span></button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <table class="dt mbm" cellspacing="0" cellpadding="0">
                                    <tbody>
                                        <tr id="s_s_s_s_add_oil_title">
                                            <th width="65">帖子</th>
                                            <th width="65">体力</th>
                                            <th width="65">评分理由</th>
                                            <th widht="65">状态</th>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="dt mbm">
                                    <tbody>
                                        <tr>
                                            <td width="105">上次评分时间：</td>
                                            <td width="118" id="s_s_s_s_add_oil_time">&nbsp;</td>
                                            <td width="118" id="s_s_s_s_add_oil_time_input" style="display:none;"><input id="s_s_s_s_add_oil_time_hours" type="text" style="width:20px;margin: 0px 2px;text-align:center;" value="">:<input id="s_s_s_s_add_oil_time_minutes" type="text" style="width:20px;margin: 0px 2px;text-align:center;" value="">:<input id="s_s_s_s_add_oil_time_seconds" type="text" style="width:20px;margin: 0px 2px;text-align:center;" value=""></td>
                                            <td><button class="pn pnc" id="s_s_s_s_add_oil_time_edit"><span>修改</span></button></td>
                                        </tr>
                                        <tr>
                                            <td width="105">自动评分计时：</td>
                                            <td width="118" id="s_s_s_s_auto_start_time">&nbsp;</td>
                                            <td><button class="pn pnc" id="s_s_s_s_add_oil_history"><span>历史</span></button></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="dt mbm">
                                    <tbody>
                                        <tr>
                                            <td width="100">可评分贴子总数：</td>
                                            <td width="20" id="s_s_s_s_avaliable_rate_time" style="color:green;">0</td>
                                            <td width="110">不可评分贴子总数：</td>
                                            <td id="s_s_s_s_unavaliable_rate_time" style="color:red;">0</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style="margin-top:-16px;">
                                <p class="o pns" style="float:left;">
                                    <button id="s_s_s_s_clear_data" type="submit" value="true" class="pn pnc"><span>清除所有数据</span></button>
                                </p>
                                <p class="o pns" style="float:left;">
                                    <button id="s_s_s_s_grab_data" type="submit" value="true" class="pn pnc"><span>获取贴子</span></button>
                                </p>
                                <p class="o pns" style="float:right;">
                                    <label for="sendreasonpm"><input type="checkbox" name="sendreasonpm" class="pc" checked="checked" disabled="disabled" fwin="rate">通知作者</label>
                                    <button id="s_s_s_s_start_vote" type="submit" value="true" class="pn pnc"><span>开始</span></button>
                                </p>
                                <div style="clear:both"></div>
                            </div>
                        </div>
                </td>
                <td class="m_r"></td>
            </tr>
            <tr>
                <td class="b_l"></td>
                <td class="b_c"></td>
                <td class="b_r"></td>
            </tr>
        </tbody>
    </table>
</div>
`
    addoilEle.innerHTML=addoilHtml;
    document.body.appendChild(addoilEle);
    let addOilButtonHtml=`
<button id="s_s_s_s_show_vote_window" style="float:right;height:30px;width:80px;margin-bottom:10px;" class="pn pnc">加体力</button>
<div style="clear:both"></div>
`
    document.querySelector("#ct").querySelector("p.tbmu").innerHTML+=addOilButtonHtml;

    let replylinks=document.querySelectorAll("td.xg1 a");
    let replies=[];
    for(let i=0;i<replylinks.length;++i){
        replies.push(replylinks[i].href);
    }
    let votedHistory={
        initData:function(){
            this.reply=GM_getValue(REPLY) || [];
            this.voted=GM_getValue(VOTED) || [];
            this.score=GM_getValue(SCORE) || [];
            this.ratePerDay=GM_getValue(RATE_PER_DAY);
            this.ratePerThread=GM_getValue(RATE_PER_THREAD);
            this.rateTotal=GM_getValue(RATE_TOTAL);
            this.lastTime=GM_getValue(LAST_TIME)||{};
            this.rateAlready=GM_getValue(RATE_ALREADY);
            this.available=0;
            this.unavailabe=0;
            this.isRateCountUpdated=true;
            this.votedDate=false;
        },
        setVotedDate:function(){
            this.votedDate=true;
        },
        isVotedDate:function(){
            return this.votedDate;
        },
        setTime:function(hours,minutes,seconds){
            this.lastTime.hours=hours;
            this.lastTime.minutes=minutes;
            this.lastTime.seconds=seconds;
        },
        getLastTimeString:function(){
            if(!this.lastTime.hours) this.lastTime.hours=0;
            if(!this.lastTime.minutes) this.lastTime.minutes=0;
            if(!this.lastTime.seconds) this.lastTime.seconds=0;
            return this.formatTime(this.lastTime.hours,this.lastTime.minutes,this.lastTime.seconds);
        },
        formatTime:function(hours,minutes,seconds){
            if(hours<10) hours="0"+hours;
            if(minutes<10) minutes="0"+minutes;
            if(seconds<10) seconds="0"+seconds;
            return hours+":"+minutes+":"+seconds;
        },
        setRateAlready:function(rateAlready){
            this.rateAlready=rateAlready;
        },
        setVoted:function(url,isVoted,score){
            let index=this.reply.indexOf(url);
            if(index<0){
                this.reply.push(url);
                this.voted.push(isVoted);
                this.score.push(score);
            }else{
                this.voted[index]=isVoted;
                this.score[index]=score;
            }
            if(!this.isRateCountUpdated) this.isRateCountUpdated=true;
            console.log(url,isVoted);
        },
        isVoted:function(url){
            let index=this.reply.indexOf(url);
            if(index>-1){
                return this.voted[index];
            }
            return false;
        },
        getScore:function(url){
            let index=this.reply.indexOf(url);
            if(index>-1){
                return this.score[index];
            }
            return -1;
        },
        indexOf:function(url){
            return this.reply.indexOf(url);
        },
        replyAt:function(index){
            return this.reply[index];
        },
        votedAt:function(index){
            return this.voted[index];
        },
        length:function(){
            return this.reply.length;
        },
        getHours:function(){
            return this.lastTime.hours;
        },
        getMinutes:function(){
            return this.lastTime.minutes;
        },
        getSeconds:function(){
            return this.lastTime.seconds;
        },
        saveTime:function(){
            GM_setValue(LAST_TIME,this.lastTime);
        },
        saveData:function(){
            GM_setValue(REPLY,this.reply);
            GM_setValue(VOTED,this.voted);
            GM_setValue(SCORE,this.score);
            GM_setValue(LAST_TIME,this.lastTime);
            GM_setValue(RATE_PER_DAY,this.ratePerDay);
            GM_setValue(RATE_PER_THREAD,this.ratePerThread);
            GM_setValue(RATE_TOTAL,this.rateTotal);
            GM_setValue(RATE_ALREADY,this.rateAlready);
        },
        saveRatePerDay:function(){
            this.ratePerDay=parseInt(document.querySelector("#s_s_s_s_rate_per_day").value);
            GM_setValue(RATE_PER_DAY,this.ratePerDay);
        },
        saveRatePerThread:function(){
            this.ratePerThread=parseInt(document.querySelector("#s_s_s_s_rate_per_thread").value);
            GM_setValue(RATE_PER_THREAD,this.ratePerThread);
        },
        saveRateTotal:function(){
            this.rateTotal=parseInt(document.querySelector("#s_s_s_s_rate_total").value);
            GM_setValue(RATE_TOTAL,this.rateTotal);
        },
        saveRateAlready:function(){
            this.rateAlready=parseInt(document.querySelector("#s_s_s_s_rate_already").value);
            GM_setValue(RATE_ALREADY,this.rateAlready);
        },
        clearData:function(){
            GM_setValue(REPLY,[]);
            GM_setValue(VOTED,[]);
            GM_setValue(SCORE,[]);
            GM_setValue(LAST_TIME,{});
            GM_setValue(RATE_PER_DAY,0);
            GM_setValue(RATE_PER_THREAD,0);
            GM_setValue(RATE_TOTAL,0);
            GM_setValue(RATE_ALREADY,0);
        },
        updateView:function(){
            if(this.isRateCountUpdated){
                this.updateRateCount();
                this.isRateCountUpdated=false;
                document.querySelector("#s_s_s_s_avaliable_rate_time").innerHTML=""+this.available;
                document.querySelector("#s_s_s_s_unavaliable_rate_time").innerHTML=""+this.unavailabe;
            }
            if(this.ratePerDay) document.querySelector("#s_s_s_s_rate_per_day").value=this.ratePerDay;
            if(this.ratePerThread) document.querySelector("#s_s_s_s_rate_per_thread").value=this.ratePerThread;
            if(this.rateTotal) document.querySelector("#s_s_s_s_rate_total").value=this.rateTotal;
            if(this.rateAlready) document.querySelector("#s_s_s_s_rate_already").value=this.rateAlready;
            if(this.lastTime.hours) document.querySelector("#s_s_s_s_add_oil_time").innerHTML=this.getLastTimeString();
        },
        updateRateCount:function(){
            this.available=0;
            this.unavailabe=0;
            for(let i=0;i<this.voted.length;++i){
                this.voted[i] ? ++(this.unavailabe) : ++(this.available);
            }
        }
    };
    votedHistory.initData();
    votedHistory.updateView();
    function getUrlData(url){
        let data={};
        let str=url.substring(url.lastIndexOf("?")+1);
        let pairs=str.split("&");
        for(let i=0;i<pairs.length;++i){
            let pair=pairs[i].split("=");
            data[pair[0]]=pair[1];
        }
        return data;
    }

    function getVoted(url){
        let result;
        let voteUrl="/forum.php";
        let urlData=getUrlData(url);
        let date=new Date();
        let data={"mod":"misc","action":"rate","tid":urlData.ptid,"pid":urlData.pid,"infloat":"yes","handlekey":"rate","t":date.getTime(),"inajax":"1","ajaxtarget":"fwin_content_rate"};
        jQuery.ajax({url: voteUrl,type: 'get',data: data,async: false,success: function(html) {
            let reg=/class="alert_error"/g;
            result=reg.test(html.firstChild.innerHTML);
        }}).fail(function(html){
            result=RETRY;
        }).always(function(){
            //
        });
        return result;
    }

    function processVoted(){
        for(let i=0;i<replies.length;++i){
            let url=replies[i];
            if(votedHistory.indexOf(url)<0) {
                const isVoted=getVoted(url);
                votedHistory.setVoted(url,isVoted,-1);
            }
        }
        votedHistory.saveData();
        votedHistory.updateView();
        console.log("total: "+votedHistory.length()+" record!");
    }
    function generateRate(){
        if(prepared||votedHistory.available<1) return;
        let remain=votedHistory.rateTotal-votedHistory.rateAlready;
        let voteTotal=votedHistory.ratePerDay;
        if(remain<votedHistory.ratePerDay) {
            voteTotal=remain;
        }
        let count=parseInt(voteTotal/votedHistory.ratePerThread);
        let last=voteTotal%votedHistory.ratePerThread;
        if(last>0){
            count+=1;
        }
        let rateTitle=document.querySelector("#s_s_s_s_add_oil_title");
        let updateRateCount=false;
        for(let i=0,j=0;i<votedHistory.length()&&j<count;++i){
            if(!votedHistory.votedAt(i)){
                let url=votedHistory.replyAt(i);
                let voted=getVoted(url);
                if(!voted){
                    let rateRow=document.createElement("tr");
                    rateRow.setAttribute("class","s_s_s_s_rate_score_row");
                    let reason="";
                    let score=votedHistory.ratePerThread;
                    if(j==(count-1)&&last>0){
                        reason=(votedHistory.ratePerDay+votedHistory.rateAlready)+"/"+votedHistory.rateTotal;
                        score=last;
                    }else{
                        reason=(votedHistory.ratePerThread*(j+1)+votedHistory.rateAlready)+"/"+votedHistory.rateTotal;
                    }
                    rateRow.innerHTML=`<td><a target="_blank" href="${url}">链接</a></td><td>${score}</td><td>${reason}</td><td id="s_s_s_s_rate_score_row_status_${j}">可加体</td>`;
                    rateTitle.parentNode.appendChild(rateRow);
                    ++j;
                }else{
                    votedHistory.setVoted(url,voted,-1);
                }
            }
        }
        votedHistory.saveData();
        votedHistory.updateView();
        prepared=true;
    }
    function startVote(){
        console.log("start vote!");
        let rateRows=document.querySelectorAll(".s_s_s_s_rate_score_row");
        let urls=[];
        let rates=[];
        let reasons=[];
        if(rateRows.length==0){
            console.log("请先按下准备按钮");
            return;
        }
        for(let i=0;i<rateRows.length;++i){
            urls.push(rateRows[i].firstChild.firstChild.href);
            rates.push(rateRows[i].firstChild.nextElementSibling.innerHTML);
            reasons.push(rateRows[i].firstChild.nextElementSibling.nextElementSibling.innerHTML);
        }
        function getVoted(voteUrl,data){
            let result;
            jQuery.ajax({url: voteUrl,type: 'post',data: data,async: false,success: function(html) {
                let reg=/感谢您的参与，现在将转入评分前页面/g;
                result=reg.test(html.firstChild.innerHTML)||TIME_LIMIT_MESSAGE;
                console.log(html);
            }}).fail(function(html){
                result=RETRY;
            }).always(function(){
                //
            });
            return result;
        }
        function vote(urls,i){
            let curDate=new Date();
            console.log(curDate.getHours()+":"+curDate.getMinutes()+":"+curDate.getSeconds());
            let url=urls[i];
            let voteUrl="/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1";
            let urlData=getUrlData(url);
            let date=new Date();
            let data={"tid":urlData.ptid,"pid":urlData.pid,"handlekey":"rate","formhash":formhash,"referer":"https://keylol.com/forum.php?mod=viewthread&tid="+urlData.ptid+"&page=0#pid"+urlData.pid,"handlekey":"rate","score1":rates[i],"reason":reasons[i]};
            const isVoted=getVoted(voteUrl,data);
            //console.log(url+" "+isVoted);
            if(isVoted&&isVoted!=TIME_LIMIT_MESSAGE){
                console.log("vote url: "+url);
                votedHistory.setVoted(url,isVoted,rates[i]);
                document.querySelector("#s_s_s_s_rate_score_row_status_"+i).innerHTML="成功";
                if(i==(urls.length-1)){
                    votedHistory.setRateAlready(votedHistory.rateAlready+votedHistory.ratePerDay);
                    let curDate=new Date();
                    votedHistory.setTime(curDate.getHours(),curDate.getMinutes(),curDate.getSeconds());
                    votedHistory.saveData();
                    votedHistory.updateView();
                    console.log("Vote finish!");
                }
            }else{
                document.querySelector("#s_s_s_s_rate_score_row_status_"+i).innerHTML="失败";
            }
            if(i<(urls.length-1)){
                let timeToSleep=2000+parseInt(Math.random()*4100);
                console.log("time to sleep: "+timeToSleep);
                setTimeout(()=>{vote(urls,i+1)},timeToSleep);
            }else{
                console.log(votedHistory.length()+" record!");
                hasRated=true;
            }
        }
        vote(urls,0);
    }
    function editLastTime(){
        if(editMode){
            let hours=document.querySelector("#s_s_s_s_add_oil_time_hours").value;
            let minutes=document.querySelector("#s_s_s_s_add_oil_time_minutes").value;
            let seconds=document.querySelector("#s_s_s_s_add_oil_time_seconds").value;
            if(!hours) hours=0;
            if(!minutes) minutes=0;
            if(!seconds) seconds=0;
            votedHistory.setTime(hours,minutes,seconds);
            votedHistory.saveTime();
            document.querySelector("#s_s_s_s_add_oil_time").innerHTML=votedHistory.getLastTimeString();
            document.querySelector("#s_s_s_s_add_oil_time_edit").firstElementChild.innerHTML="修改";
            document.querySelector("#s_s_s_s_add_oil_time_input").setAttribute("style","display:none;");
            document.querySelector("#s_s_s_s_add_oil_time").setAttribute("style","");
        }else{
            document.querySelector("#s_s_s_s_add_oil_time_edit").firstElementChild.innerHTML="保存";
            document.querySelector("#s_s_s_s_add_oil_time_hours").value=votedHistory.getHours() ? votedHistory.getHours() :0 ;
            document.querySelector("#s_s_s_s_add_oil_time_minutes").value=votedHistory.getMinutes() ? votedHistory.getMinutes() :0 ;
            document.querySelector("#s_s_s_s_add_oil_time_seconds").value=votedHistory.getSeconds() ? votedHistory.getSeconds() :0 ;
            document.querySelector("#s_s_s_s_add_oil_time").setAttribute("style","display:none;");
            document.querySelector("#s_s_s_s_add_oil_time_input").setAttribute("style","");
        }
        editMode=!editMode;
    }
    function validateNumber(e,max){
        let value=e.target.value.replace(/[^\d]/g,'');
        value=value.trim();
        if(value!=""){
            value=parseInt(value);
            value= value>max ? (max-1) :value;
            e.target.value=value;
        }else{
            e.target.value="";
        }
    }
    function showHistoryInConsole(){
        let data="";
        for(let i=0;i<votedHistory.length();++i){
            if(votedHistory.votedAt(i) && votedHistory.getScore(votedHistory.replyAt(i))>0) data+="加了"+votedHistory.getScore(votedHistory.replyAt(i))+"体力："+votedHistory.replyAt(i)+"\n";
        }
        if(data.length>0) saveTxt("加体力历史记录.txt",data);
    }
    document.querySelector("#s_s_s_s_rate_prepare_button").addEventListener("click",function(e){generateRate();});
    document.querySelector("#s_s_s_s_start_vote").addEventListener("click",function(e){startVote();});
    document.querySelector("#s_s_s_s_close_window").addEventListener("click",function(e){document.querySelector("#s_s_s_s_add_oil").setAttribute("style","display:none;");});
    document.querySelector("#s_s_s_s_show_vote_window").addEventListener("click",function(e){document.querySelector("#s_s_s_s_add_oil").setAttribute("style","");});
    document.querySelector("#s_s_s_s_add_oil_time_edit").addEventListener("click",function(e){editLastTime();});
    document.querySelector("#s_s_s_s_add_oil_history").addEventListener("click",function(e){showHistoryInConsole();});
    document.querySelector("#s_s_s_s_add_oil_time_hours").addEventListener("keyup",function(e){validateNumber(e,24);});
    document.querySelector("#s_s_s_s_add_oil_time_minutes").addEventListener("keyup",function(e){validateNumber(e,60);});
    document.querySelector("#s_s_s_s_add_oil_time_seconds").addEventListener("keyup",function(e){validateNumber(e,60);});
    document.querySelector("#s_s_s_s_add_oil_time_hours").addEventListener("paste",function(e){validateNumber(e,24);});
    document.querySelector("#s_s_s_s_add_oil_time_minutes").addEventListener("paste",function(e){validateNumber(e,60);});
    document.querySelector("#s_s_s_s_add_oil_time_seconds").addEventListener("paste",function(e){validateNumber(e,60);});
    document.querySelector("#s_s_s_s_rate_per_day").addEventListener("keyup",function(e){validateNumber(e,9999);});
    document.querySelector("#s_s_s_s_rate_per_thread").addEventListener("keyup",function(e){validateNumber(e,9999);});
    document.querySelector("#s_s_s_s_rate_total").addEventListener("keyup",function(e){validateNumber(e,9999);});
    document.querySelector("#s_s_s_s_rate_already").addEventListener("keyup",function(e){validateNumber(e,9999);});
    document.querySelector("#s_s_s_s_rate_per_day").addEventListener("paste",function(e){validateNumber(e,9999);});
    document.querySelector("#s_s_s_s_rate_per_thread").addEventListener("paste",function(e){validateNumber(e,9999);});
    document.querySelector("#s_s_s_s_rate_total").addEventListener("paste",function(e){validateNumber(e,9999);});
    document.querySelector("#s_s_s_s_rate_already").addEventListener("paste",function(e){validateNumber(e,9999);});
    document.querySelector("#s_s_s_s_rate_per_day").addEventListener("change",function(e){votedHistory.saveRatePerDay();});
    document.querySelector("#s_s_s_s_rate_per_thread").addEventListener("change",function(e){votedHistory.saveRatePerThread();});
    document.querySelector("#s_s_s_s_rate_total").addEventListener("change",function(e){votedHistory.saveRateTotal();});
    document.querySelector("#s_s_s_s_rate_already").addEventListener("change",function(e){votedHistory.saveRateAlready();});
    document.querySelector("#s_s_s_s_clear_data").addEventListener("click",function(e){votedHistory.clearData();location.reload();});
    document.querySelector("#s_s_s_s_grab_data").addEventListener("click",function(e){processVoted();});
    document.querySelector("#s_s_s_s_add_oil").addEventListener("mousedown",function(e){let x,y,left,top,table=document.querySelector("#s_s_s_s_add_oil .fwinmask");x=e.clientX;y=e.clientY;left=parseInt(table.style.left);top=parseInt(table.style.top);function move(e){table.style.left = (left + e.clientX - x) + 'px';table.style.top = (top + e.clientY - y) + 'px';}function up(e){x=0;y=0;left=0;top=0;document.removeEventListener("mousemove",move);document.removeEventListener("mouseup",up);}document.addEventListener("mousemove",move);document.addEventListener("mouseup",up);});

    let autoTimeId=0;
    let autoTimeEle=document.querySelector("#s_s_s_s_auto_start_time");
    function autoRate(){
        if(hasRated&&votedHistory.isVotedDate()){
            clearInterval(autoTimeId);
            return;
        }
        let curDate=new Date();
        let timeToStart=false;
        //
        if(curDate.getHours()==votedHistory.getHours()){
            if(votedHistory.getSeconds()==59&&curDate.getSeconds()==0){
                timeToStart=curDate.getMinutes()==(votedHistory.getMinutes()+1);
            }
            if(!timeToStart){
                timeToStart=curDate.getMinutes()==votedHistory.getMinutes()&&(curDate.getSeconds()==votedHistory.getSeconds()||(curDate.getSeconds()-1)==votedHistory.getSeconds());
            }
        }
        if(timeToStart) {
            clearInterval(autoTimeId);
            let curDate=new Date();
            console.log(curDate.getHours()+":"+curDate.getMinutes()+":"+curDate.getSeconds());
            generateRate();
            setTimeout(function(){startVote();votedHistory.setVotedDate()},parseInt(START_DELAY*Math.random())*500+5000);
        }
        autoTimeEle.innerHTML=votedHistory.formatTime(curDate.getHours(),curDate.getMinutes(),curDate.getSeconds());
    }
    autoTimeId=setInterval(autoRate,200);
})();