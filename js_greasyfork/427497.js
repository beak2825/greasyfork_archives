// ==UserScript==
// @name         知到/智慧树讨论区复读机
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  知到/智慧树讨论区复读机，刷互动分。
// @author       bakapppp
// @match        *://qah5.zhihuishu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/427497/%E7%9F%A5%E5%88%B0%E6%99%BA%E6%85%A7%E6%A0%91%E8%AE%A8%E8%AE%BA%E5%8C%BA%E5%A4%8D%E8%AF%BB%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/427497/%E7%9F%A5%E5%88%B0%E6%99%BA%E6%85%A7%E6%A0%91%E8%AE%A8%E8%AE%BA%E5%8C%BA%E5%A4%8D%E8%AF%BB%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    function logmsg(content) {
        var ele = String(content);
        $('#msg').append(ele);
        $('#msg').append('<br>');
    }

      function Grama(content) {
          const question = content
          const ans = question.replace(/\?|。|！|!|？|\.|{是|对}{吗|嘛|么}|什么|/g, "").replace(/嘛|吗|么/g, '')
          .replace(/是{否|不是}/g, '是').replace(/你们|你/g, '我').replace(/有没有/, '有').replace(/能不能/,'能')
          .replace(/[\(|（][\u4E00-\u9FA5A-Za-z0-9_]+[\)|）]/g, '')
          const answer = {
              positive: [
                  `你好，我认为${ans}`,
                  `是的，${ans}`,
              ],
              negative: [
                  `不对，${ans}是不对的`
              ],
              nonsence: [
                  `我们需要辩证看待，有些是好的，有些是不好的`,
                  `这不是绝对的，我们要理性看待`,
                  `没有绝对是好的，还是坏的`
              ]
          }
          let arr = Object.values(answer).flat()
          //if (Object.keys(answer).includes(mode)) arr = answer[mode]
          return arr[ parseInt(Math.random() * 100) % arr.length] + "。"
      }

    function shuffleSelf(array, size) {
        var index = -1,
            length = array.length,
            lastIndex = length - 1;

        size = size === undefined ? length : size;
        while (++index < size) {
            // var rand = baseRandom(index, lastIndex),
            var rand = index + Math.floor( Math.random() * (lastIndex - index + 1))
            var value = array[rand];

            array[rand] = array[index];

            array[index] = value;
        }
        array.length = size;
        return array;
    }

    function start(){


        var tim = 1000;
        var courseId = "";
        var recruitId = "";
        var url = window.location.href;
        var temp = url.split("/").pop();
        var queue = [];
        courseId = temp.split("?")[0];
        temp = url.split("?").pop();
        recruitId = temp.split("&")[1].split("=").pop();

        //console.log(courseId, recruitId);

        var uuid = "";
        /*
    $.ajaxSetup({
        crossDomain: true,
        xhrFields:{
            withCrendentials: true
        }
    });
*/
        function upvote(answerId) {
            $.get(
                "https://creditqa.zhihuishu.com/creditqa/web/qa/updateOperationToLike",
                {
                    uuid: uuid,
                    islike: 0,
                    answerId: answerId,
                },
                function(data) {
                    console.log(data);
                    //logmsg(String(data.msg));
                }
            );
        }

        function look(questionId) {
            $.get(
                "https://creditqa.zhihuishu.com/creditqa/web/qa/onLookerQuestion",
                {
                    uuid: uuid,
                    isLooker: 0,
                    questionId: questionId,
                },
                function(data){
                    console.log(questionId, data.rt.msg);
                }
            )
        }

        function do_comment(questionId, questionTitle) {
            logmsg("正在回答 "+String(questionId) + " " + questionTitle);
            console.log(questionId);
            console.log(queue.length);
            //return;
            look(questionId);
            $.get(
                "https://creditqa.zhihuishu.com/creditqa/web/qa/getAnswerInInfoOrderByTime",
                {
                    uuid: uuid,
                    questionId: questionId,
                    sourceType: 2,
                    courseId: courseId,
                    recruitId: recruitId,
                },
                function(data){
                    //console.log(data);
                    var content = Grama(questionTitle);
                    var temp = data.rt.answerInfos;
                    if(temp.length>=1){
                        content = temp[0].answerContent;
                        for(var i=0;i<temp.length;i++) {
                            console.log(temp[i]);
                            upvote(temp[i].aid);
                        }
                    }
                    logmsg("自动复读内容为: "+content);
                    $.ajax({
                        type: "POST",
                        url: "https://creditqa.zhihuishu.com/creditqa/web/qa/saveAnswer",
                        useCORS: true,
                        xhrFields: {
                            withCredentials: true //允许跨域带Cookie
                        },
                        data: {
                            uuid: uuid,
                            annexs: "[]",
                            qid: questionId,
                            source: 2,
                            aContent: content,
                            courseId: courseId,
                            recruitId: recruitId,
                            dateFormate: Date.now(),
                        },
                        success: function(data) {
                            console.log(data);
                            logmsg(String(data.msg));
                            try {
                                upvote(data.rt.answerId);
                            }
                            catch(err) {
                            }
                        }
                    })
                }
            )
        }

        var fin = false;
        function check(){
            if(queue.length!=0){
                logmsg("剩余 "+String(queue.length) + " 个问题");
                var question = queue.pop();
                do_comment(question.id, question.content);
            }
            else {
                if(!fin) {
                    logmsg('已复读完全部问题');
                    fin = true;
                }
            }
        }

        function solve(index=0){
            //console.log(uuid);
            if(index == -1)
            {
                logmsg("共 "+String(queue.length)+" 个问题");
                queue = shuffleSelf(queue,queue.length);
                setInterval(check, 5*1000);
                return;
            }
            $.ajax({
                type: "GET",
                url: "https://creditqa.zhihuishu.com/creditqa/web/qa/getRecommendList",
                useCORS: true,
                xhrFields: {
                    withCredentials: true //允许跨域带Cookie
                },
                data: {
                    "uuid": uuid,
                    "courseId": courseId,
                    "pageIndex": index,
                    "pageSize": 50,
                    "recruitId": recruitId,
                    dateFormate: Date.now(),
                },
                success: function(data) {
                    console.log(data);
                    var temp = data.rt.questionInfoList;
                    for(var i=0;i<temp.length;++i){
                        //setTimeout(do_comment(temp[i].questionId),tim);
                        //tim+=1000*30;
                        queue.push({
                            "id": temp[i].questionId,
                            "content": temp[i].content
                        });
                    }
                    solve(data.rt.pageIndex);
                }
            })
            //alert("xxx");
        }

        logmsg('获取问题id中...');
        $.ajax({
            type: "GET",
            url: "https://creditqa.zhihuishu.com/creditqa/login/getLoginUserInfo",
            useCORS: true,
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            },
            success: function(data) {
                uuid = data.result.uuid;
                solve(0);
            }
        })
    }



    $("body").append(" <div id='mymain' style='left: 10px;bottom: 10px;overflow:scroll;background: #1a59b7;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 300;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'></div>");
    $('#mymain').append('知到讨论区复读机<br>')
    $('#mymain').append('<div id="msg"></div>')
    $('#mymain').append('<button type="button" id="gkd" style="color:black;">开始复读</button>')

    var flag = false;

    $('#gkd').click(function(){
        if(!flag) {
            flag = true;
            start();
            logmsg('开始复读');
        }
    })

    //$.get("https://creditqa.zhihuishu.com/creditqa/login/getLoginUserInfo",function(data){console.log(data)});
})();