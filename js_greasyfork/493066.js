// ==UserScript==
// @name         广元市继续教育网考试专用
// @namespace    代刷网课VX：shuake345
// @version      0.2
// @description  自动答题|只用于《试卷标题：2024年专业技术人员公需科目继续教育试卷》
// @author       代刷网课VX：shuake345
// @match        *://*.gysjxjy.com/studentmanage/*
// @icon         https://img.nuannian.com/files/images/23/1019/1697723881-6511.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493066/%E5%B9%BF%E5%85%83%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%80%83%E8%AF%95%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493066/%E5%B9%BF%E5%85%83%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%80%83%E8%AF%95%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function gb(){
        if (document.URL.search('vocational/v') > 1) {
            window.close()
        }
    }
    setTimeout(gb,900000)

    function sx() {
        window.location.reload()
    }

    function zy1(){
        if (document.URL.search('cn/training') > 1) {
            var Bankuai=document.querySelectorAll("div.fish-spin-nested-loading.x-edu-nested-loading > div > div:nth-child(1) > div> div > div > div> div > span")
            for (var i = 0; i < Bankuai.length; i++) {
                //改这里即可，这里的数字是红色的学时数，它就会自动学zy1 和zy 2选1。
                if(Bankuai[i].attributes[1].textContent=="color: rgb(233, 91, 86);"){
                    Bankuai[i].click()
                    break;
                }
            }
        }
    }
    setTimeout(zy1,12400)
    /*function zy() {
        if (document.URL.search('cn/training') > 1) {
            var xxnum = document.querySelectorAll("div.fish-spin-nested-loading.x-edu-nested-loading > div > div>div > div > div > div> div:nth-child(3) > span")
            for (var i = 0; i < xxnum.length; i++) {
                //改这里即可，这里的数字是已看学时数，只需要定义不同课程的学时数即可。
                if(parseFloat(xxnum[i].innerText)<2){//2就是2学时
                    xxnum[i].click()
                    break;
                }
            }

        }
    }
    setTimeout(zy,15524)*/

    function cy() {
        if (document.URL.search('courseIndex') > 1) {
            if (document.querySelectorAll(" div > section > div > div > div> a").length > 0) {
                document.querySelectorAll(" div > section > div > div > div> a")[0].click()

            }
            if(document.querySelectorAll(" span.fish-checkbox > input").length > 0){
                document.querySelectorAll(" span.fish-checkbox > input")[0].click()
            }

        }
    }
    setInterval(cy,3145)

    function fhback() {
        window.history.go(-1)
    }

    function gbclose() {
        window.close()
    }

    function sxrefere() {
        window.location.reload()
    }


    function sy() {
        if (document.URL.search('courseDetail') > 1) {
            setTimeout(gbclose,60000*20)
            var danxuan
            //var sps=document.getElementsByTagName('video')[0]
            if (document.getElementsByClassName('course-video-reload').length > 0) {
                var kec = document.getElementsByClassName('resource-item resource-item-train')//document.querySelectorAll("div.resource-item ")
                var kecnum = kec.length

                }
            if(document.querySelector("div.resource-item.resource-item-train.resource-item-active")!==null){//播放的视频
                if(document.querySelector("div.resource-item.resource-item-train.resource-item-active").querySelector('i').title=='已学完'){//
                    if(document.querySelector('[class="iconfont icon_checkbox_linear"]')!==null){//完全没看的
                        document.querySelector('[class="iconfont icon_checkbox_linear"]').click()
                    }else if(document.querySelector('[class="iconfont icon_processing_fill"]')!==null){//看来一部分的
                        document.querySelector('[class="iconfont icon_processing_fill"]').click()
                    }else{setTimeout(gbclose,121)}

                }
            }
            /*if (sps.paused == true) {
				sps.play()
				sps.playbackRate = 16
                sps.volume=0
			}else if(sps.playbackRate !== 16){
                sps.playbackRate = 16
                sps.volume=0
            }*/
            if(document.getElementsByTagName('video').length==1){
                var INGtime=document.querySelector("span.vjs-current-time-display").innerText
                var Alltime=document.querySelector("span.vjs-duration-display").innerText
                if(document.getElementsByTagName('video')[0].paused){
                    if(INGtime!==Alltime){
                        document.getElementsByTagName('video')[0].play()
                    }else{//close
                        document.querySelector('[class="iconfont icon_checkbox_linear"]').click()
                        setTimeout(gbclose,1212)
                    }
                }
                document.getElementsByTagName('video')[0].volume=0
            }
            if(document.querySelector("div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button")!==null){//完成视频后才能得到学分（确定）
                document.querySelector("div.fish-modal-content > div > div > div.fish-modal-confirm-btns > button").click()
            }
            if(document.getElementsByClassName('fa fa-circle-o').length>0){//单选
                danxuan=document.getElementsByClassName('fa fa-circle-o')
                for (var m = 0; m < danxuan.length; m++) {
                    danxuan[m].click()
                    document.getElementsByClassName('submit')[0].click()
                }
            }
            if(document.getElementsByClassName('fa fa-square-o').length>0){//多选
                danxuan=document.getElementsByClassName('fa fa-square-o')
                for (var n = 0; n < danxuan.length; n++) {
                    danxuan[n].click()
                    document.getElementsByClassName('submit')[0].click()
                }
            }
            if(document.getElementsByClassName('question-input').length>0){//填空
                danxuan=document.getElementsByClassName('question-input')
                for (var o = 0; o < danxuan.length; o++) {
                    danxuan[o].value=document.getElementsByClassName('answer-tips')[o].nextSibling.nodeValue
                    document.getElementsByClassName('submit')[0].click()
                }
            }





        }
    }
    setInterval(sy,4542)

    function danze(){//单独选择没有完成 的。
        var jd=document.getElementsByClassName('four')
        for (var l = 0; l < jd.length; l++) {
            if(jd[l].innerText!=="100%"){
                var danxuan=document.getElementsByClassName('fa fa-circle-o')
                if(danxuan.length==0){
                    jd[l].click()
                    break;
                }
            }else if(l==jd.length-1){//全完成
                setTimeout(gb,1420)
            }

        }
    }
    function QT(){
        var img =document.createElement("img");
        var img1=document.createElement("img");
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        img.style.position = 'fixed';
        img.style.top = '0';
        img.style.zIndex = '999';
        img.style="width:230px; height:230px;"
        document.body.appendChild(img);
        img1.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";
        img1.style="width:230px; height:230px;"
        img1.style.position = 'fixed';
        img1.style.top = '0';
        img1.style.right = '0';
        img1.style.zIndex = '9999';
        document.body.appendChild(img1);
    }
    setTimeout(QT,1541)
    function sy2(){
        if (document.URL.search('courseDetail') > 1) {
            if (document.getElementsByClassName('fish-collapse-item').length > 0) {//下箭头
                var Xjt=document.getElementsByClassName('fish-collapse-item')
                for (var n = 0; n < Xjt.length; n++) {
                    Xjt[n].querySelector('i').click()
                }
            }
        }
    }
    setTimeout(sy2,8245)
    function sy1(){//打开右边的列表箭头
        if(document.querySelectorAll('div.fish-collapse-item>div>i').length>0){
            for (var m = 0; m < document.querySelectorAll('div.fish-collapse-item>div>i').length; m++) {
                document.querySelectorAll('div.fish-collapse-item>div>i')[m].click()
            }
        }
    }
    setInterval(sy1,10542)
    function dt(){
        if(document.querySelector('iframe')!==null){
            var dms=document.querySelector('iframe').contentWindow.document.querySelectorAll("#ei_Container > div > div.ques_Context > ul")
            for (var i=0;i<40;i++){
                        dms[i].querySelectorAll('label')[1].click()
                }
        alert('注意：本脚本的答案只用于《2024年专业技术人员公需科目继续教育试卷》，如果第一次考试没有90分，说明题目已经变化更新，需更换题库，千万别再次尝试答题。否则机会用完后就没机会了')
        }
    }
    setTimeout(dt,2121)
    function tj(){
        document.querySelector('iframe').contentWindow.document.querySelector("#submitExam").click()
    }
    setTimeout(tj,5424)

    function zuofei1(){//这一段是为了省力，如果不是2023年的版块，可以删除。
        if(document.URL.search('HTML/WorkShops/index')>1){document.querySelector("#pageMenu > a:nth-child(6)").click()}
        if(document.URL.search('HTML/WorkShops/workshop')>1){
            var Alltimes=document.querySelectorAll("#courseList > li > div > p.bottom > span.long")
            var Allkecheng=document.querySelectorAll("#courseList > li > div > p.text.cl > a")
            for (var i=0;i<Alltimes.length;i++){
                if(Alltimes[i].innerText.search(Kctime)>1){
                    Allkecheng[i].click()
                    break
                }
            }
        }
    }
    setTimeout(zuofei1,7252)
    //________________________________________________--------------------------------------------------------------------------------------------------
    function sx3(){
        window.location.reload()
    }
    //shijianpanding
    function bfy(){
        if(document.URL.search('inLessonId=')>1){
            if(document.getElementsByTagName('img')[4].title=='gorgeous'){document.getElementsByTagName('img')[4].click()}
            if(parseInt(document.getElementById('min').innerText)==parseInt(document.getElementById('_ctime').innerText)){
                localStorage.setItem('key',document.getElementById('_kjmc').innerText)
                window.close()
            }
        }
    }
    setInterval(bfy,15000)

    function zy(){
        if(document.URL.search('PK_ID')>1 ){
            if(document.getElementsByClassName('bg-blue').length>0){
                if($('.bg-blue')[0].innerText=="未学习"){
                    $('.bg-blue')[1].click()
                    clearInterval(zydj)
                }else{$('.bg-blue')[0].click()
                      clearInterval(zydj)}
            }else{
                var KCjd=document.querySelectorAll("b.fcolor-green")
                for (var i=0;i<KCjd.length;i++){
                    if(KCjd[i].innerText.search('100')<1){
                        KCjd[i].parentElement.firstChild.click()
                        clearInterval(zydj)
                        break
                    }
                }
            }
        }
    }
    var zydj=setInterval(zy,8000)
    //部分有选项的播放页面
    function cy1(){
        if (document.URL.search('workshop-course-play')>1){
            setTimeout(function (){ document.getElementsByTagName('video')[0].play()},2000)
        }
    }
    setInterval(cy,5000)
    function ddyige(){//点击第一个视频
        if(document.URL.search('inCourseId=')>1){
            if(document.getElementsByTagName('video').length==0){
                var liebiao=document.getElementsByClassName('tree-node ui-draggable droppable')
                liebiao[n].click()
                n++
                console.log(n)
            }
        }
    }
    setInterval(ddyige,5000)
    //这个最主页是用来控制登录后全自动的，自动点击登录后的第一个选项课程。如果用户是23年的课程和22年，21年。一起。就会自动碘23的。用处有点大
    function zuizhuye(){
        if(document.URL.search('Home/index')>1){
            document.querySelector("body > div> table > tbody > tr.trcolor > td:nth-child(3) > a").click()
        }
    }
    setTimeout(zuizhuye,2121)
    function sk(){(function() {
    'use strict';
    if(window.location.href.match(/http:\/\/www.gxela/)){
        window.location.replace(window.location.href.replace('http:\/\/','https:\/\/'));
    }
    window.onbeforeunload = function(){};
    //localStorage.setItem('openedWindows','');
    //localStorage.setItem('learning',0);
    var content =""
    var area = ['500px', '500px']
    var type = 0
    var oft = 'auto',closeBtn=1
    // 检查登录状态
    var loginStatus = true;
    if($("#loginInfoBox").html()){
        loginStatus = false;
    }

    try{
        //获取用户识别码
        layui.use('layer',function(){
            //右侧提示窗口
            var tip = layui.layer
            if(!loginStatus){
                tip.open({content:'请登录'
                      ,type:1
                      ,area: ['300px', '200px']
                      ,offset:'rt'
                      ,closeBtn: 1
                      ,shade:0});
                return;
            }
            $.ajax({
                url:'https://cash.cantecsoft.com/public/index.php/index/requesthtmltest?page=index',
                async:false,
                type:"get",
                success:function(res){
                    tip.open({content:res
                      ,type:1
                      ,area: ['300px', '400px']
                      ,offset:'rt'
                      ,closeBtn: 1
                      ,shade:0});
                }
            })
        });
        layui.use('layer',function(){
            //左侧窗口
            var layer = layui.layer
            if(!loginStatus){
                return;
            }
            $.ajax({
                url:'https://cash.cantecsoft.com/public/index.php/index/requesthtmltest?page=window',
                async:false,
                type:"get",
                success:function(res){
                    layer.open({content:res
                      ,type:1
                      ,area: ['300px', '300px']
                      ,offset:'lt'
                      ,closeBtn: 1
                      ,shade:0});
                }
            })
        })
    }catch(e){

    }


    if(window.location.href.match(/mikecrm/)){
        function changeReactInputValue(inputDom,newText){
            let lastValue = inputDom.value;
            inputDom.value = newText;
            let event = new Event('input', { bubbles: true });
            event.simulated = true;
            let tracker = inputDom._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            inputDom.dispatchEvent(event);
        }
        function GetQueryString(name)
        {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return unescape(r[2]); return null;
        }
        var interval = setInterval(function(){
            if(name_md5_input = document.getElementsByClassName("fbi_input aria-content")[0]){
                clearInterval(interval);
                var name_md5_input = document.getElementsByClassName("fbi_input aria-content")[0];
                console.log(name_md5_input)
                changeReactInputValue(name_md5_input,'#'+GetQueryString("name_md5")+'#');
            }
        },500)


    }

    setInterval(function(){
        var o = document.getElementsByClassName("order");
        if(o.length>0){
            o[0].setAttribute('data-reactid','');
        }

    },500)

    // Your code here...
})
                 }
})();