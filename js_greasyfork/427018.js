// ==UserScript==
// @name         智慧树网课自动刷新跳转下一门课程
// @version      1.8
// @description  每隔一段时间刷新网页防止网络连接失败，并可以根据课程完成度自动跳转到用户设置的下一门课程
// @author       冷弋白
// @match        *://studyh5.zhihuishu.com/*
// @icon         https://z3.ax1x.com/2021/05/17/g2l0Z8.png
// @namespace https://greasyfork.org/users/702892
// @downloadURL https://update.greasyfork.org/scripts/427018/%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E9%97%A8%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427018/%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E9%97%A8%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==
window.addEventListener('load',function(){
    var num = 1200;
    var text = document.createElement('div');
    text.classList.add('text');
    document.body.appendChild(text)
    var Text = document.querySelector('.text');
    Text.style.fontSize = '20px'
    Text.style.color = '#fff'
    Text.style.position = 'absolute'
    Text.style.zIndex = '99999'
    Text.style.top = '60px'
    Text.style.left = '0px'
    Text.style.padding = '10px'
    Text.style.textShadow = '0 0 10px'
    Text.style.backgroundColor = '#3d84ff'
    Text.style.textAlign = 'center'
    Text.innerHTML = '正在加载观看数据...'

    var lyb = document.createElement('div');
    lyb.classList.add('lyb');
    document.body.appendChild(lyb);
    var LYB = document.querySelector('.lyb');
    LYB.style.width = '200px'
    LYB.style.height = '230px'
    LYB.style.fontSize = '40px'
    LYB.style.color = '#fff'
    LYB.style.position = 'absolute'
    LYB.style.zIndex = '99999'
    LYB.style.top = '60px'
    LYB.style.left = '480px'
    LYB.style.textShadow = '0 0 10px'
    LYB.style.backgroundColor = '#3d84ff'
    LYB.style.textAlign = 'center'
    LYB.style.display = 'none';
    LYB.style.flexDirection = 'column';
    LYB.style.justifyContent = 'center';
    LYB.style.alignItems = 'center';

    var head = document.createElement('img');
    head.classList.add('headImg');
    LYB.appendChild(head);
    var headImg = document.querySelector('.headImg');
    headImg.src = 'https://z3.ax1x.com/2021/05/17/g2l0Z8.png'
    headImg.style.width = '100px'
    headImg.style.borderRadius = '50%'

    var name = document.createElement('span');
    name.classList.add('name');
    LYB.appendChild(name);
    var lybName = document.querySelector('.name');
    lybName.innerHTML = '冷弋白'
    lybName.style.fontSize = '25px'

    var qq = document.createElement('a');
    qq.classList.add('qq');
    LYB.appendChild(qq);
    var QQ = document.querySelector('.qq');
    QQ.innerHTML = '点击此处联系我'
    QQ.target = '_blank'
    QQ.href = 'https://wpa.qq.com/msgrd?v=3&uin=1329670984&site=qq&menu=yes'
    QQ.style.fontSize = '14px'
    QQ.style.color = '#ccc'
    QQ.style.textDecoration = 'underline';

    var input = document.createElement('input');
    input.classList.add('hrefInput');
    document.body.appendChild(input)
    var hrefInput = document.querySelector('.hrefInput');
    hrefInput.style.position = 'absolute'
    hrefInput.style.width = '666px'
    hrefInput.style.fontSize = '14px'
    hrefInput.style.left = '0px'
    hrefInput.style.top = '290px'
    hrefInput.value = localStorage.getItem('href')
    hrefInput.placeholder = '输入的链接10秒后自动存入本地，若为空，10秒后会自动填充，无需担心因浏览器刷新而无法跳转'
    hrefInput.style.outline = 'none'
    hrefInput.style.zIndex = '99999'
    hrefInput.style.padding = '5px'
    hrefInput.style.backgroundColor = 'rgb(61, 132, 255)'
    hrefInput.style.color = '#fff'
    hrefInput.style.border = '2px solid #fff'
    hrefInput.style.display = 'none'
    var inputNum = 6;
    setInterval(function(){
        if(localStorage.getItem('href') == null){
            localStorage.setItem("href",hrefInput.value);
        }else if(hrefInput.value == ''){
            hrefInput.value=localStorage.getItem("href");
        }else {
            localStorage.setItem("href",hrefInput.value);
        }
    },10000)
    function times(arr) {
        var allTime = 0;
        arr.forEach(function(a) {
            allTime += A(a);
        });
        function A(time) {
            var min = parseInt(time.substr(3, 2)) * 60;
            var s = parseInt(time.substr(6, 2));
            var ss = min + s;
            return ss;
        }
        return {
            hour: parseInt((allTime/ 3 * 2) / 60 / 60),
            min: parseInt((allTime / 3 * 2) / 60) % 60,
            s: parseInt(((allTime / 3 * 2) % 60) % 60),
            ss:parseInt(allTime / 3 * 2),
            sss:parseInt(allTime / 3 * 2 * 1000),
        };
    }
    var timeArr = [],finish,allTime,everyTime,finishTime,nowTime,lightDark;
    setInterval(function(){
        nowTime = new Date().getTime()
    },1000)
    setTimeout(function(){
        //获取已经完成的课程数量
        finish = document.querySelectorAll('.time_icofinish').length
        //获取所有课程
        allTime = document.querySelectorAll('#app .video-study .box-content .box-right .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view .time')
        //将获取的所有课程时间添加进数组
        allTime.forEach(function(a){
            timeArr.push(a.innerHTML)
        })
        //删除已经完成的课程时长
        for(var i = 0;i < finish;i++){
            timeArr.shift();
        }
        //几点完成
        var a = nowTime + times(timeArr).sss
        finishTime = new Date(a).toLocaleString();
        //多少秒完成
        var b = times(timeArr).ss;

        var timea = +new Date(finishTime.replace(/[\u4e00-\u9fa5]/g, ' '));
        var countDown = times(timeArr).ss
        setInterval(function(){
            lightDark = document.querySelector('.Patternbtn-div').querySelector('p')
            finish = document.querySelectorAll('.time_icofinish').length;
            LYB.style.display = 'flex';
            hrefInput.style.display = 'block'
            if(lightDark.innerHTML == '白昼模式'){
                Text.style.backgroundColor = '#3d84ff'
                LYB.style.backgroundColor = '#3d84ff'
                hrefInput.style.backgroundColor = '#3d84ff'
            }else{
                Text.style.backgroundColor = '#222222'
                LYB.style.backgroundColor = '#222222'
                hrefInput.style.backgroundColor = '#222222'
            }
            b-=1
            everyTime = times(timeArr).hour + '时' + times(timeArr).min + '分' + times(timeArr).s + '秒';
            Text.innerHTML ='为了防止刷课时间久了导致视频连接失败而暂停<br>'+ num + '秒后将自动刷新浏览器<br>您已完成' + finish + '节课<br>还有'+
                (allTime.length - finish) + '节课等着您完成<br>在1.5倍速的状态下，您需要花'+
                everyTime+'<br>也就是'+b+'秒后将看完当前课程<br>预计在'+
                finishTime+'看完当前课程<br>看完后将自动跳转至您在下方输入框输入的网页链接';
            num--;
            if (num == 0) {
                location.reload();
            }
            if(finish==allTime.length){
                window.open(hrefInput.value)
                window.close()
            }
        },1000)
    },2000)
})