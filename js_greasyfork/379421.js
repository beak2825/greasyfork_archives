// ==UserScript==
// @name         lao
// @namespace    http://tampermonkey.net/
// @version      10.2
// @description  try to take over the world!
// @author       You
// @match        http://tg.tenggang.net/app/userpage*
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/379421/lao.user.js
// @updateURL https://update.greasyfork.org/scripts/379421/lao.meta.js
// ==/UserScript==

(function() {
    var urls = window.location.href.split('userpage')[0]
    var number = window.location.href.split('/')
    if(number[number.length-1]==="listtask"){
        //一直去查有没有单子
        setInterval(function(){
            $.ajax({
                url: ''+urls+'task/listpost',
                type: 'post',
                data: JSON.stringify({"pageNo":0,"pageSize":0,"order":{"taskid":1},"appoint":0}),
                success: function(res){
                    console.log(res)
                    if(res.code===1&&res.taskList[0]){
                        console.log(res.taskList[0].taskid)
                        var taskids = {"taskid":res.taskList[0].taskid}
                        //window.location.reload()
                        //当有单的时候直接去抢
                        var num = Math.random();
                        var num = Math.random();
                        setInterval(function(){
                            $.ajax({
                                url: ''+urls+'mission/addpost',
                                type: 'post',
                                data: JSON.stringify(taskids),
                                success: function(res){
                                    console.log(res.missionid)
                                    window.location.replace(window.location.href.split('listtask')[0]+"addmission?missionid="+res.missionid);
                                    //http://tg.tenggang.net/app/userpage/addmission?missionid=413239
                                }
                            });
                        },num)
                    }
                    if(res.code===2003){
                        alert(res.message)
                        window.location.replace(window.location.href.split('listtask')[0]+"/listmission");
                    }
                }
            })
        },2000)
    }
    if(number[number.length-1]==="listmission"){
        $.ajax({
            url: ''+urls+'mission/listpost',
            type: 'post',
            data: JSON.stringify({"pageNo":0,"pageSize":0,"order":{"createtime":-1},"type":1}),
            success: function(res){
                console.log(res)
                if(res.code===1){
                    console.log(res.missionList)
                    var now = new Date();
                    var time = ((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+now.getDate();
                    var listTime = (res.missionList[0].missionCode.split("_")[1]).substring(0,4)
                    if(listTime===time){
                        if(res.missionList[0].status === 2 && res.missionList[0].role === 1){
                            setInterval(function(){window.location.reload()},80000)
                        }else{
                            alert("有单子了")
                        }

                    }else{
                        window.location.replace(window.location.href.split('listmission')[0]+"/listtask");
                    }
                }else{
                    window.location.replace(window.location.href.split('listmission')[0]+"/listtask");
                }

            }
        });

    }
    //获取tocken
    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null
    }

})();
