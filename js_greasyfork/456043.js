// ==UserScript==
// @name         中研企
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  中研企课堂刷课  （自动下一节 可挂后台）
// @author       You
// @match        https://*.toujianyun.com/lesson/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456043/%E4%B8%AD%E7%A0%94%E4%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/456043/%E4%B8%AD%E7%A0%94%E4%BC%81.meta.js
// ==/UserScript==





(function () {

    var c = setInterval(() => { if (document.getElementsByClassName('prism-big-play-btn')[0].style["display"] == 'block') { console.log("视频已暂停，已自动点击播放");document.getElementsByTagName('video')[0].click(); } }, 5000);
    var d = setInterval(()=>{
        if (document.getElementsByClassName('pop-up-problem').length > 0) {
            console.log('检测到题目，正在自动作答！');
            var chapterId = window.location.href.match(/[0-9]+/)[0];
            var userId = document.getElementsByClassName('user-avatar')[0].src.match(/[0-9]+/)[0];
            $.get('../exercise/' + chapterId + '?userid='+userId, null, function (e) {
                var data = e;
                e['msg'].forEach((value,key) => {
                    if(value.id ==document.getElementsByClassName('question-wrapper')[0]['dataset']['id'] ){

                        var answer = data['msg'][key].answer;
                        answer.forEach((value,key)=>{
                            console.log(answer[key]);
                            document.getElementsByClassName('question-content')[0].getElementsByTagName('input')[key].click();
                        })


                    }
                });
                document.getElementsByClassName('J-submit-answer')[0].click();
                document.getElementsByClassName('J-submit-answer')[0].click();
                //console.log(e['msg'][1]['id'] == document.getElementsByClassName('question-wrapper')[0]['dataset']['id']);
            })
        }

    },5000);
    var e = setInterval(()=>{
        if (document.getElementsByClassName('btn btn-blue').length==2&&document.getElementsByClassName('btn btn-blue')[1].textContent=='继续学习'){
            document.getElementsByClassName('btn btn-blue')[1].click();
        }else if(document.getElementsByClassName('btn btn-blue').length==3&&document.getElementsByClassName('btn btn-blue')[2].textContent=='继续学习'){
            document.getElementsByClassName('btn btn-blue')[2].click();
        }else{
            console.log("暂无学习检测");
        }
    },8000);
    var b = setInterval(function () {
        // 总进度
        //var duration = document.getElementsByTagName('video')[0].duration;
        // 当前进度
        //var currentTime = document.getElementsByTagName('video')[0].currentTime;

        var currentClass = document.getElementsByClassName('catalogue-item  active')[0];
        var classList = Object.values(document.getElementsByClassName('catalogue-item'));
        var nextBtn = document.getElementsByClassName('btn btn-blue').length

        if (document.getElementsByClassName('btn btn-blue')[0].textContent == '播放下一节'&&nextBtn>=2) {
            var a = classList.indexOf(currentClass);
            a++;
            if (classList[a] != null) {

                document.getElementsByClassName('catalogue-item')[a].click();
            }
            clearInterval(b);
            clearInterval(c);
        }else if (document.getElementsByClassName('prism-ended-wrapper')[0].style.display == 'block'){
            var g = classList.indexOf(currentClass);
            g++;
            if (classList[g] != null) {

                document.getElementsByClassName('catalogue-item')[g].click();
            }
            clearInterval(b);
            clearInterval(c);
        }else if (document.getElementsByClassName('current-time')[0].textContent==
        document.getElementsByClassName('duration')[0].textContent){
            var h = classList.indexOf(currentClass);
            h++;
            if (classList[h] != null) {

                document.getElementsByClassName('catalogue-item')[h].click();
            }
            clearInterval(b);
            clearInterval(c);
        }else{
            console.log("正在播放！");
        }
        console.log(1);
    }, 5000)


    //if(document.getElementsByClassName('prism-play-animation')[0])




    // 判断是否存在答题界面



    // 获取答案
    // $.get('../exercise/2029?userid=356156',null,function(e){console.log(e['msg'][1]['id']==document.getElementsByClassName('question-wrapper')[0]['dataset']['id'])})

    //  提交答案

    // document.getElementsByClassName('question-content')[0].getElementsByTagName('input')[0].click()


})();