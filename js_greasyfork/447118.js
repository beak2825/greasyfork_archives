// ==UserScript==
// @name         甘肃城建教育信息管理系统
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  进入课程详情页即可自动学习，摄像头请使用已经注册的虚拟摄像头来满足人脸检测，包含自动下一节，自动答题功能。
// @author       goolete
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @match        *agry.pc.hxcrm.cn/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447118/%E7%94%98%E8%82%83%E5%9F%8E%E5%BB%BA%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/447118/%E7%94%98%E8%82%83%E5%9F%8E%E5%BB%BA%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==
var question;
var run = true;

function getStudyId(){
    var studyid = window.location.href;
    studyid = studyid.split('?')[1].split('&')[0].split('=')[1]
    return studyid
}

function skip(){
    setTimeout(function(){
        document.getElementsByClassName('now-btn active-btn')[0].click();
        console.log("我知道了 ok");
        setTimeout(function(){
            next();
            var study = getStudyId();
            var Cookie = document.cookie.split(';')[2].split('=')[1];
            Cookie = 'Bearer '+ Cookie
            $.ajax({
                type: "GET",
                url: 'https://agry.jar.hxcrm.cn/educate/info/' + study,
                dataType: "json",
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization': Cookie,
                },
                success: function(res){

                    var id = res.data.id;
                    var sec_url = 'https://agry.jar.hxcrm.cn/hxTbCourseInfoQuestion?courseInfoId=' + id
                    $.ajax({
                        type: "GET",
                        url: sec_url,
                        dataType: "json",
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            'Authorization': Cookie,
                        },
                        success: function(res){

                            question = res
                        }
                    });
                }
            });
        },100);
        next();
    },5000);
}

function skip_withoutnext(){
    setTimeout(function(){
        document.getElementsByClassName('now-btn active-btn')[0].click();
        console.log("我知道了 ok");
        setTimeout(function(){
            var study = getStudyId();
            var Cookie = document.cookie.split(';')[2].split('=')[1];
            Cookie = 'Bearer '+ Cookie
            $.ajax({
                type: "GET",
                url: 'https://agry.jar.hxcrm.cn/educate/info/' + study,
                dataType: "json",
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization': Cookie,
                },
                success: function(res){

                    var id = res.data.id;
                    var sec_url = 'https://agry.jar.hxcrm.cn/hxTbCourseInfoQuestion?courseInfoId=' + id
                    $.ajax({
                        type: "GET",
                        url: sec_url,
                        dataType: "json",
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            'Authorization': Cookie,
                        },
                        success: function(res){

                            question = res
                        }
                    });
                }
            });
        },100);
    },200);
}

function play(){
    setTimeout(function(){
        window.addEventListener("mouseleave", function (event) {
            event.stopPropagation();
        }, true);
        window.addEventListener("visibilitychange", function (event) {
            event.stopPropagation();
        }, true);
        window.addEventListener("webkitvisibilitychange", function (event) {
            event.stopPropagation();
        }, true);
        console.log("listener offset");
    }, 500);
}
var dialog;
function next(){
    setInterval(function(){
        if(run){
            try{
                document.getElementsByClassName('el-tooltip__popper is-dark')[0].hidden = true
            }catch(error){

            }

            document.getElementsByTagName('video')[0].muted = true
            var status = document.getElementsByClassName('prism-big-play-btn')[0];
            if(status.style.display == 'block'){
                status.click();
                console.log(status.style.display);
            }
            var current_time = document.getElementsByClassName('current-time')[0].textContent;
            var duration = document.getElementsByClassName('duration')[0].textContent;

            try {
                dialog = document.getElementsByClassName('el-button el-button--primary')[0].children[0].textContent
                if(dialog == '提交答案' && document.getElementsByClassName('el-button el-button--primary')[0].children[0].offsetParent != null){

                    var ques = document.getElementsByClassName('el-button el-button--primary')[0].parentElement.parentElement.children[0].textContent.replaceAll('《单选题》：','').replaceAll(' ','');
                    var jsonObject1 = JSON.parse(question.data[0].topic);
                    var jsonText1= jsonObject1.content.replaceAll('《单选题》：','').replaceAll(' ','')

                    var jsonObject2 = JSON.parse(question.data[1].topic);
                    var jsonText2= jsonObject2.content.replaceAll('《单选题》：','').replaceAll(' ','')

                    if(ques == jsonText1){
                        switch(question.data[0].rightAnswer){
                            case "A":
                                document.getElementsByClassName('el-radio__inner')[0].click();
                                break;
                            case "B":
                                document.getElementsByClassName('el-radio__inner')[1].click();
                                break;
                            case "C":
                                document.getElementsByClassName('el-radio__inner')[2].click();
                                break;
                            case "D":
                                document.getElementsByClassName('el-radio__inner')[3].click();
                                break;

                        }
                        setTimeout(function(){
                            document.getElementsByClassName('el-button el-button--primary')[0].click();
                            setTimeout(function(){
                                document.getElementsByClassName('el-button el-button--primary')[0].click();
                            }, 100);
                        }, 100);


                    }else if(ques == jsonText2){
                        switch(question.data[1].rightAnswer){
                            case "A":
                                document.getElementsByClassName('el-radio__inner')[0].click();
                                break;
                            case "B":
                                document.getElementsByClassName('el-radio__inner')[1].click();
                                break;
                            case "C":
                                document.getElementsByClassName('el-radio__inner')[2].click();
                                break;
                            case "D":
                                document.getElementsByClassName('el-radio__inner')[3].click();
                                break;

                        }
                        setTimeout(function(){
                            document.getElementsByClassName('el-button el-button--primary')[0].click();
                            setTimeout(function(){
                                document.getElementsByClassName('el-button el-button--primary')[0].click();
                            }, 100);
                        }, 100);
                    }
                    dialog = '';

                    //document.getElementsByClassName('el-radio__inner')[0].click();
                    //document.getElementsByClassName('el-button el-button--primary')[0].click();
                    //document.getElementsByClassName('el-button el-button--primary')[0].click();
                }
            } catch(error) {
            }

            if(current_time == duration && current_time != null && duration!= null && current_time != '00:00' && duration!= '00:00'){
                debugger
                if(document.getElementsByClassName('section section-cur')[0].getElementsByTagName('span')[2].className == 'f-fl study-type-0 study-type-30'){
                    var list = document.getElementsByClassName('m-chapterList')[0].childNodes;
                    var i = 0;
                    for(i=0;i<list.length;i++){
                        if(list[i].className == 'section section-cur'){
                            break;
                        }
                    }
                    list[i+1].click();
                    run = false;
                    setTimeout(function(){
                        debugger
                        //skip_withoutnext();
                        location.reload();
                    }, 1000);

                }
            }
        }
    },2000);
}

(function() {
    var isrun = false;
    console.log("start");
    setInterval(function(){
        var isStudy = window.location.href;
        isStudy = isStudy.split('?')[0].split('/')[4];
        if(isStudy == 'study' && isrun == false ){
            isrun = true;
            skip();
            play();
        }
    },800);

})();