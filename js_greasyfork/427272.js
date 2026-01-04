// ==UserScript==
// @name         学习通自动讨论
// @namespace    https://github.com/slightin
// @version      2.4.6
// @description  用于自动讨论学习通选修课的50讨论，仅在讨论界面生效
// @author       盛夏
// @match        https://*/bbscircle/grouptopic*
// @match        https://mooc2-ans.chaoxing.com/mycourse/stu?*
// @icon         https://3wfy-ans.chaoxing.com/template/new-head/images/logo.png
// @downloadURL https://update.greasyfork.org/scripts/427272/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%AE%A8%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/427272/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%AE%A8%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //用户参数
    var times=50 //自动讨论次数，默认50条
    var clicktime=1500 //挂机讨论中每次页面加载后发送讨论的延迟，不建议太小，单位为毫秒

    // code here...
    if(/mooc2-ans.chaoxing.com\/mycourse\/stu/.test(window.location.href)){//用于将用户从新版网页引导至旧版网页
        var etip=false
        function tipcheck(){
            var flag=document.getElementsByClassName("curNav")[0].innerText=="讨论"
            if(flag&&!etip){
                var oldtip=document.createElement("div")
                var op=document.querySelector("body > div.box > div.Header > div > a")
                document.querySelector("body > div.box > div.Header> div").insertBefore(oldtip,op)
                oldtip.style="float: left; font-size: 17px; line-height: 30px; margin-right: 20px; color: #616bff; font-weight: 900;"
                oldtip.innerText="请点击右侧 回到旧版 以进行学习通自动讨论→"
                oldtip.id="oldtip"
                etip=true
            }
            if(!flag&&etip){
                document.querySelector("body > div.box > div.Header > div").removeChild(document.getElementById("oldtip"))
                etip=false
            }
        }
        setInterval(tipcheck,500)
    }

    if(/bbscircle\/grouptopic/.test(window.location.href)){
        var tips = document.getElementsByClassName("title1118")[0]
        var tip=document.createElement('div')
        var tip2 = document.createElement('div')
        tips.appendChild(tip)
        tip.innerText="当前设置的讨论 "+times+" 条"
        tip.style="font-size:18px;color:rgb(230 15 15)"
        tips.appendChild(tip2)
        tip2.innerText="出现“发布成功”拦截失败的情况只需将浏览器窗口切换到其他界面即可"
        tip2.style="font-size: large; color: red;"

        document.querySelector("body > div.main1118 > div:nth-child(3)").id="temp"
        var temp = document.getElementById('temp')
        temp.style.marginTop="30px";
        var div=document.createElement('div')
        var button=document.createElement('button')
        var fastbutton=document.createElement('button')

        var count=0
        var string=window.location.href.substring(location.href.indexOf("#")+1,window.location.href.length)
        if(location.href.indexOf("#")!=-1){
            count=Number(string)
        }

        function 讨论(){
            window.alert = function() {//阻止弹窗
                return false;
            }
            window.location.href=window.location.href.replace("#"+string,"#"+(count+1)) //因网站刷新后脚本重新载入，所以用网址存储次数
            document.querySelector("#c_title").value=count+1;
            setTimeout(function(){
                document.querySelector("#addGroupTopicForm > div > div.listBtn > a.qdBtn.fr").click()
                location.reload()
            },clicktime)
        }

        function 极速()
        {
            window.alert = function() {//阻止弹窗
                return false;
            }
            window.location.href=window.location.href.replace("#"+string,"#")
            for(var i=0;i<times;i++)
            {
                document.querySelector("#c_title").value=i+1;
                document.querySelector("#addGroupTopicForm > div > div.listBtn > a.qdBtn.fr").click()
            }
            location.reload()
        }

        function addback(){
            var back=document.createElement('button')
            temp.appendChild(back)
            back.style="font-size:20px;width: 100px;height:40px;margin:6px;margin-left: 100px"
            back.innerText="重置"
            back.onclick=function(){
                document.querySelector("body > div.main1118 > div.title1118 > a:nth-child(4) > span").click()
            }
        }

        function terror(){
            var error=document.createElement('div')
            temp.appendChild(error)
            error.style="font-size:25px;margin:6px;color:rgb(250 15 15);float:left"
            error.innerText="出现异常，请点击右侧重置按钮"
            addback()
        }

        if(location.href.indexOf("#")==-1){
            temp.appendChild(button)
            temp.appendChild(fastbutton)
            button.style="font-size:20px;width: 200px;height:40px"
            button.innerText="自动挂机讨论"
            button.onclick=function(){
                location.href=location.href+"#0"
                location.reload()
            }
            fastbutton.style="font-size:20px;width: 200px;height:40px;margin-left:20px"
            fastbutton.innerText="极速讨论"
            fastbutton.onclick=function(){
                location.href=location.href+"#fast"
                极速()
            }
        }

        else if(location.href.indexOf("#fast")!=-1)
        {
            temp.appendChild(div)
            div.style="font-size:20px;float:left"
            div.innerText="极速讨论已经完成，本次讨论 "+times+" 条"
            var indiv=document.createElement('div')
            div.appendChild(indiv)
            indiv.style="font-size:10px"
            indiv.innerText="可能有延迟，若讨论条数不足，建议重新从课程页进入该页面查看，或点击右侧重置按钮"
            addback()
            alert("极速讨论已经完成")
        }

        else if(count<times){
            temp.appendChild(div)
            div.style="font-size:20px"
            div.innerText="正在自动讨论，已讨论 "+string+" 条"
            讨论()
        }
        else if(count==times){
            temp.appendChild(div)
            div.style="font-size:20px;float:left"
            div.innerText="自动讨论已经完成，本次讨论 "+times+" 条"
            indiv=document.createElement('div')
            div.appendChild(indiv)
            indiv.style="font-size:10px"
            indiv.innerText="可能有延迟，若讨论条数不足，建议重新从课程页进入该页面查看，或点击右侧重置按钮"
            addback()
            alert("自动讨论已经完成")
        }
        else{
            terror()
        }
    }
})();