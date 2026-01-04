// ==UserScript==
// @name         西南交大自动评课工具
// @namespace    https://github.com/nathan21hz/SWJTU_Auto_PK
// @version      1.5
// @description  自动一键好评/差评课程
// @author       Nathan_21hz
// @include      http*://*.vatuu.com/vatuu/AssessAction?setAction=viewAssess*
// @include      http*://*.vatuu.com/vatuu/AssessAction?setAction=list*
// @include      http://jwc.swjtu.edu.cn/vatuu/AssessAction?setAction=viewAssess*
// @include      http://jwc.swjtu.edu.cn/vatuu/AssessAction?setAction=list*
// @require      http://code.jquery.com/jquery-1.8.2.js
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/369908/%E8%A5%BF%E5%8D%97%E4%BA%A4%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AF%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/369908/%E8%A5%BF%E5%8D%97%E4%BA%A4%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AF%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
     var ctd=500;
    'use strict';
    function addButton(){
        var box = $('td[colspan="2"]')[0];
        box.innerHTML += "&nbsp;&nbsp;";
        var button = document.createElement("input"); //创建一个input对象（提示框按钮）
        button.setAttribute("type", "button");
        button.setAttribute("value", "显示所有");
        button.setAttribute("id", "showall");
        box.appendChild(button);
        var title = $('[class="post-title"]')[0];
        $('<div id="countdown" class="post-title"></div>').insertAfter(title);
    }

    if(window.location.search=="?setAction=list"){
        var box = $('[name="searchForm"]')[0];
        box.innerHTML += "&nbsp;&nbsp;";
        var button = document.createElement("input"); //创建一个input对象（提示框按钮）
        button.setAttribute("type", "button");
        button.setAttribute("value", "一键好评全部");
        button.setAttribute("id", "openall");
        box.appendChild(button);
    }else{
        addButton();
        ctd=20;
        window.setInterval(function() {
            if(ctd==0){
                var ps = document.answerForm.problem_id;//问题
                var ids = "",ans = "",sco = "",per = "";
                for(var i=0;i<ps.length;i++){
                    var id = ps[i].value;
                    var answer = "";
                    var score = "";
                    var percent = $(ps[i]).attr("perc");
                    answer = document.getElementsByName("problem"+id)[0].value;
                    score = $(document.getElementsByName("problem"+id)[0]).attr("score");
                    if(answer==""){
                        answer = "无"
                    }
                    ids+=("_"+id);
                    ans+=("_"+answer);
                    sco+=("_"+score);
                    per+=("_"+percent);
                }
                document.form2.id.value=ids;
                document.form2.answer.value=ans;
                document.form2.scores.value=sco;
                document.form2.percents.value=per;
                document.form2.assess_id.value=document.answerForm.assess_id.value;
                document.form2.templateFlag.value="0";
                document.form2.t.value=Math.random();
                document.form2.keyword.value="null";
                document.form2.submit();
            }else{
                $('#countdown').html('等待'+ctd.toString()+'s后自动好评');
                ctd--;
            }
   	    }, 1000);
    }

    $('#showall').click(function(){
        var ps = document.answerForm.problem_id;
        for(var i=0;i<ps.length;i++){
            radioClick(i);
        }
    });

    $('#openall').click(function(){
        var urls = $("[href$='Flag=0']");
        var url = ''
        if(urls.length==0){
        	alert("课程评价已全部完成。")
        }else{
	        for(var i =0;i<urls.length;i++){
	            url = urls[i].href;
	            console.log(url)
	            GM_openInTab(url,"insert")
	        }
        }
    });
})();
