// ==UserScript==
// @name         中国大学mooc提前获取测验解析
// @namespace    https://explorersss.github.io/
// @version      0.5
// @description  中国大学mooc提前获取测验解析,获取spoc中的作业答案的功能,有问题请刷新,如果没有显示答案,先随便提交一次作业再查看作业答案
// @author       ccreater
// @match        https://www.icourse163.org/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        GM_xmlhttpRequest
// @blog         https://explorersss.github.io/
// @run-at       document-start
// @note         更新了下程序描述
// @downloadURL https://update.greasyfork.org/scripts/400158/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6mooc%E6%8F%90%E5%89%8D%E8%8E%B7%E5%8F%96%E6%B5%8B%E9%AA%8C%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/400158/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6mooc%E6%8F%90%E5%89%8D%E8%8E%B7%E5%8F%96%E6%B5%8B%E9%AA%8C%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
function show_homework_answer(str){
    	var ua = navigator.userAgent;
    	var opacity = '0.95';
		if (ua.indexOf("Edge") >= 0) {
		    opacity = '0.6';
		} else{
		    opacity = '0.95';
		}
    	var copyTextBox = '<div id="copy-text-box" style="width:100%;height:100%;position: fixed;z-index: 9999;display: block;top: 0px;left: 0px;background:rgba(255,255,255,' + opacity + ');-webkit-backdrop-filter: blur(20px);display: flex;justify-content:center;align-items:center;">'+
    						'<div id="copy-text-box-close" style="width:100%;height:100%;position:fixed;top:0px;left:0px;"></div>'+
    					  	'<pre id="copy-text-content" style="width:60%;font-size:16px;line-height:22px;z-index:10000;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;word-break:break-all;max-height:70%;overflow:auto;"></pre>'+
    					  '</div>"';
    	$('#copy-text-box').remove();
	    $('body').append(copyTextBox);
	    $('#copy-text-content').html(str);
	    $('#copy-text-box-close').click(function() {
	       $('#copy-text-box').remove();
	    });
   	}
function get_spoc_homework_answer(id){
    if(id){
        var post_data=`callCount=1
scriptSessionId=\${scriptSessionId}190
c0-scriptName=MocQuizBean
c0-methodName=getHomeworkPaperDto
c0-id=0
c0-param0=number:PARAM_ID
c0-param1=null:null
c0-param2=boolean:false
c0-param3=number:1
c0-param4=number:0
batchId=0`
        post_data=post_data.replace("PARAM_ID",id)
        console.log(post_data)
        //post start
        GM_xmlhttpRequest({
            method: "POST",
            data: post_data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            url: "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getHomeworkPaperDto.dwr",
            onload: function(response) {
                eval(response.responseText)
                //console.log(response.responseText)
                //console.log(s2)
                var answer_str=""
                for(var i=0;i<s2.length;i++){
                    var judgeDtos=s2[i].judgeDtos
                    for(var j=0;j<judgeDtos.length;j++){
                        console.log(judgeDtos[j].msg)
                        answer_str+="<p>"+String(i+1)+":"+judgeDtos[j].msg+"</p>"
                    }
                }
                show_homework_answer(answer_str)
            }
        });
        //post end
    }
}
function get_answer(aid,id){
    if(aid && id)
    {
        var post_data="callCount=1\n"
        post_data+="scriptSessionId=${scriptSessionId}190\n"
        post_data+="httpSessionId=1d4ae12c733f41f495fc1fcbaeccd4f2\n"
        post_data+="c0-scriptName=MocQuizBean\n"
        post_data+="c0-methodName=getQuizPaperDto\n"
        post_data+="c0-id=0\n"
        post_data+="c0-param0=string:"+id+"\n"
        post_data+="c0-param1=number:"+aid+"\n"
        post_data+="c0-param2=boolean:true\n"
        post_data+="batchId=0"
        GM_xmlhttpRequest({
            method: "POST",
            data: post_data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            url: "https://www.icourse163.org/dwr/call/plaincall/MocQuizBean.getQuizPaperDto.dwr",
            onload: function(response) {
                eval(response.responseText);
                var qlist=document.getElementsByClassName("j-list")[0].children[0].children
                //s1 is question list
                //var qnum=qlist.childElementCount
                for(var i=0;i<s1.length;i++){
                    var answer="";
                    var analyse="";
                    if(s1[i].stdAnswer){
                        answer=s1[i].stdAnswer;
                    }else{
                        for(var j=0;j<s1[i].optionDtos.length;j++){
                            var choice=s1[i].optionDtos[j]
                            if(choice.answer){
                                answer+="ABCD"[j]//+":"
                                //answer+=choice.content+"\n"
                            }
                            if(choice.analyse){
                                analyse+=choice.analyse
                            }
                        }
                    }
                    if(s1[i].analyse){
                        analyse+=s1[i].analyse
                    }
                    console.log(answer)
                    console.log(analyse)
                    answer=answer.replace("##%_YZPRLFH_%##","或")
                    var raw_html=`<div class="analysisInfo ">
	<div>
		<span class="f-f0 tt1">正确答案：
		</span>
		<span class="f-f0 tt2">ANSWER
		</span>
	</div>
	<div>
		<b>解析：ANALYSE
	</div>
</div>`
                    var $node = $(qlist[i])
                    raw_html=raw_html.replace("ANSWER",answer)
                    raw_html=raw_html.replace("ANALYSE",analyse?analyse:"无")
                    $node.append(raw_html)

                }

            }
        });


    }}
function main() {
    var aid=0;
    var id=0;
    eval(document.location.hash.substr(document.location.hash.indexOf("?")+1).replace("&",";"))
    if(aid && id){
      var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>"+
						"<div id='pre_analysis' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>提前解析</div>"+
				 	 "</div>";
        $("body").append(topBox);
        $("body").on("click","#pre_analysis",function(){
	    	get_answer(aid,id);
	    });

    }else{
        var hash=document.location.hash;
        if(hash.indexOf("/learn/hw?id=")>0){
            //parse hash
            eval(hash.substr(document.location.hash.indexOf("?")+1).replace("&",";"));
            var homework_Box = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>"+
						"<div id='get_homework_answer' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>获取作业答案</div>"+
				 	 "</div>";
        $("body").append(homework_Box);
        $("body").on("click","#get_homework_answer",function(){
	    	get_spoc_homework_answer(id)
	    });
           }
    }


}

(function(){window.onload = main})()

