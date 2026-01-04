// ==UserScript==
// @name         应急管理干部学院小助手2024
// @namespace    yjgb.sset.org.cn
// @version      0.1.6
// @description  应急管理干部学院小助手,r如果为播放，手工点开一个
// @author       wxjwolf
// @run-at       document-end
// @match        https://yjgb.sset.org.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @icon         https://yjgb.sset.org.cn/images/home/title-logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506531/%E5%BA%94%E6%80%A5%E7%AE%A1%E7%90%86%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E5%B0%8F%E5%8A%A9%E6%89%8B2024.user.js
// @updateURL https://update.greasyfork.org/scripts/506531/%E5%BA%94%E6%80%A5%E7%AE%A1%E7%90%86%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E5%B0%8F%E5%8A%A9%E6%89%8B2024.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var urlarr=[];
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        //console.log('捕获的请求 URL:', url); // 输出请求的URL
        if(url.includes('course-study/subject/chapter-progress?courseId=') && urlarr.length==0){
            starthtml();
            this.addEventListener('load', function() {
                const responseText = this.responseText;
                try {
                    const jsonResponse = JSON.parse(responseText);
                    //console.log('捕获的JSON内容:', jsonResponse);
                    $.each(jsonResponse, function(index, item) {
                        $.each(item.courseChapterSections, function(index1, item1) {
                            if (item1.progress.finishStatus < 2){
                                urlarr.push(get_url(item1.resourceId,"10","/6/1"));
                            }
                        })
                    })
                    //console.log(urlarr.length)
                    setInterval(function () {
                        const playering=Cookies.get('playering')
                        const playering_businessname=Cookies.get('playering_businessname')
                        console.log(playering,urlarr.length)
                        if (playering === undefined || playering === null){
                            Cookies.set('playering', '0');
                        }
                        if(playering=='1'){
                            $('#myDiv').html("请不要关闭或者刷新本页!<br>目前还有：" + urlarr.length + "个<br>【" + playering_businessname + "】正在播放中！<br>以倒序方式播放<br>（实际未播放请手工点开一个播放）");
                        }
                        else {
                            $('#myDiv').html("请不要关闭或者刷新本页!<br>目前还有：" + urlarr.length + "个");}
                        if (playering=="0" && urlarr.length>0){
                            const url1=urlarr[urlarr.length-1]
                            Cookies.set('playering', '1')
                            urlarr.pop();
                            window.open(url1, '_blank');
                        }}, 1000*5)
                    在这里你可以对JSON对象进行操作
                } catch (error) {
                    console.error('JSON解析错误:', error);
                }
            });}
        if (url.includes('student/class-info/chapter-activity-list?classId=')) {
            starthtml();
            this.addEventListener('load', function() {
                // 请求完成后获取响应内容
                const responseText = this.responseText;
                //console.log(responseText)
                try {
                    // 解析JSON内容
                    const jsonResponse = JSON.parse(responseText);
                    //console.log('捕获的JSON内容:', jsonResponse);
                    $.each(jsonResponse.items, function(index, item) {
                        //console.log('Item ' + index + ':', item.bizName);
                        if (item.classStudentActivityProgress.finishStatus==0){
                            urlarr.push(get_url(item.businessId,"11","/5/0"));
                        }
                    })
                    console.log(urlarr.length)
                    //setTimeout(() => {time2()}, 1000*2)
                    setInterval(function () {
                        //const playering=$.cookie('playering')//sessionStorage.getItem('playering');
                        const playering=Cookies.get('playering')//playering_businessname
                        const playering_businessname=Cookies.get('playering_businessname')
                        //Cookies.set('playering', '0')
                        console.log(playering,urlarr.length)
                        if (playering === undefined || playering === null){
                            //$.cookie('playering', '0', { path:'/',domain:'sset.org.cn'});
                            Cookies.set('playering', '0');
                        }
                        if(playering=='1'){
                            $('#myDiv').html("请不要关闭或者刷新本页!<br>目前还有：" + urlarr.length + "个<br>【" + playering_businessname + "】正在播放中！<br>以倒序方式播放<br>（实际未播放请手工点开一个播放）");
                        }
                        else {
                            $('#myDiv').html("请不要关闭或者刷新本页!<br>目前还有：" + urlarr.length + "个<br>不要急，脚本会自动(倒序)播放！");}
                        if (playering=="0" && urlarr.length>0){
                            const url1=urlarr[urlarr.length-1]
                            //$.cookie('playering', '1', { path:'/',domain:'sset.org.cn'});
                            Cookies.set('playering', '1')
                            $("li").has("[id*='" + urlarr[urlarr.length-1] +"']").remove();
                            urlarr.pop();
                            window.open(url1, '_blank');
                        }}, 1000*5)
                    // 在这里你可以对JSON对象进行操作
                } catch (error) {
                    console.error('JSON解析错误:', error);
                }
            });}
        // 调用原始的open方法，以确保请求正常进行
        originalXhrOpen.apply(this, arguments);
    };
    // Your code here...
    //window.open('https://www.baidu.com', '_blank');
    setTimeout(() => {settime1()}, 1000*5)
})();
function settime1(){
    var video = document.querySelector("video")//$('video')
    //console.log(Cookies.get('playering'));
    if(video != null){
        video.volume=0;
        //console.log("视频是否暂停：" + video.paused)
        Cookies.set('playering_businessname', $('.h3.strong.color-white.other-title.text-overflow:eq(0)').text())
        if(video.paused == true){video.play();}
        setInterval(function(){
            if ($('.btn-ok.btn').length > 0 && $('.alert-shadow:eq(0)').css('display') != 'none'){//关闭监测窗口
                console.log("出现中断窗口！");
                $('.btn-ok.btn')[0].click();
            }
            if ($('.chapter-list-box.required.focus').length > 0 && $('.chapter-list-box.required.focus:eq(0)').attr('data-sectiontype')=="9"|| $('#D206anewStudy').length > 0){
                //sessionStorage.setItem('playering', '0');
                //$.cookie('playering', '0', { path:'/',domain:'sset.org.cn'});
                Cookies.set('playering', '0')
                self.opener=null;
                self.close();
                //$(location).attr('href', pUrl);
            }
        },1000)
    }
}
function get_url(businessId,sectionType,type0) {
    return "https://yjgb.sset.org.cn/#/study/course/detail/" + sectionType + "&" + businessId + type0;
}
function starthtml(){
    var $div = $('<div>', {
        id: 'myDiv',
        html: '请不要关闭或者刷新本页!',
        css: {
            position: 'fixed', // 修改为fixed以固定在页面上
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'red',
            padding: '20px',
            'font-weight': 'bold',
            'font-size': '20px',
            'text-align': 'center', // 确保文本在div中水平居中（虽然对于单行文本这不是必需的，但它是好习惯）
            'z-index': '1000', // 确保它位于页面上的其他内容之上
            'width': 'auto', // 如果需要，可以设置一个具体的宽度，或者让它自适应内容（auto是默认值）
            'box-sizing': 'border-box', // 防止padding和border影响宽度计算（这也是一个好习惯）
            'border': '2px solid black' // 添加黑色边框，宽度为2px
        }
    });
    $('body').append($div);
}

