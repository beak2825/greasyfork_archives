// ==UserScript==
// @license MIT
// @name         devTest
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  播放器滑动快进+移除弹窗/googletagmanager+整体页面缩放
// @author       You
// @include      /^https://www.kmbb\d+\.com.+$/
// @include      /^https://www.kmbbb\d+\.com.+$/
// @include      /^https://www.kmff\d+\.com.+$/
// @include      /^https://h5.kmbb\d+\.com.+$/
// @include      /^https://h5.kmbbb\d+\.com.+$/
// @include      /^https://h5.kmff\d+\.com.+$/
// @include      /^https://.+\.kmpp\d+\.com.+$/
// @match        http://re05.cc/*
// @match        http://re06.cc/*
// @icon         https://www.kmbb59.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/455310/devTest.user.js
// @updateURL https://update.greasyfork.org/scripts/455310/devTest.meta.js
// ==/UserScript==

        var LSwiperMaker = function(o){

            var that = this;
            this.config = o;
            this.control = false;
            this.sPos = {};
            this.mPos = {};
            this.dire;
            // console.log('LSwiperMaker o', o);

            // this.config.bind.addEventListener('touchstart', function(){ return that.start(); } ,false);
            // 这样不对的，event对象只在事件发生的过程中才有效;
            this.config.bind.addEventListener('touchstart', function(e){ return that.start(e); } ,false);
            this.config.bind.addEventListener('touchmove', function(e){ return that.move(e); } ,false);
            this.config.bind.addEventListener('touchend', function(e){ return that.end(e); } ,false);

        }

        LSwiperMaker.prototype.start = function(e){

             var point = e.touches ? e.touches[0] : e;
             this.sPos.x = point.screenX;
             this.sPos.y = point.screenY;
             //document.getElementById("start").innerHTML = "开始位置是:"+this.sPos.x +" "+ this.sPos.y ;
            // console.log('start', this.sPos.x, this.sPos.y);

        }
        LSwiperMaker.prototype.move = function(e){

            var point = e.touches ? e.touches[0] : e;
            this.control = true;
            this.mPos.x = point.screenX;
            this.mPos.y = point.screenY;
            //document.getElementById("move").innerHTML = "您的位置是："+this.mPos.x +" "+ this.mPos.y ;

        }

        LSwiperMaker.prototype.end = function(e){

            this.config.dire_h  && (!this.control ? this.dire = null : this.mPos.x > this.sPos.x ? this.dire = 'R' : this.dire = 'L')
            this.config.dire_h  || (!this.control ? this.dire = null : this.mPos.y > this.sPos.y ? this.dire = 'D' : this.dire = 'U')

            this.control = false;
            this.config.backfn(this);

        }

        window.LSwiperMaker = LSwiperMaker;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });// 禁止微信touchmove冲突



// 注册视频播放器手指滑动监听事件-完成进度条同步前进后退的功能
function initScroll(el){
    var a = new LSwiperMaker({
        bind:el,// 绑定的DOM对象
        dire_h:true, //true 判断左右， false 判断上下
        backfn:function(o){ //回调事件
            // console.log('o', o);
            // console.log(`向${o.dire}滑`);
            // document.getElementById("dire").innerHTML = "向"+ o.dire + "滑";
            let videoObj = o.config.bind
            let stepValue = moveStepComputed(videoObj, o);
            if(o.dire=="R"){
                // console.log("R");
                videoObj.currentTime = videoObj.currentTime + stepValue
            }else if(o.dire=="L"){
                videoObj.currentTime = videoObj.currentTime - stepValue
            }
        }
    })
}

// 计算需要移动的距离
function moveStepComputed(videoObj, that) {
    let duration = parseInt(videoObj.duration); //单个视频总时长单位秒 取整数
    let clientWidth = parseInt(videoObj.clientWidth); //播放器宽度
    let clientHeight = parseInt(videoObj.clientHeight) //播放器高度

    let transverseLength = clientWidth > clientHeight ? clientWidth : clientHeight; //取宽高两值中的较大值作为 横向的长度

    let moveLength = Math.abs(that.mPos.x - that.sPos.x) || 0 //移动的横向距离
    console.log('单次滑动距离 moveLength', moveLength);

    //
    let stepVal = 0;
    let minStep = 5;
    let durationBoundary = 300;

    // 移动 1/5 个屏幕的宽度 时间最多变化 1/10 的视频长度
    let xOfTransverseLength = 5;
    let xOfDuration = 10;
    let maxStep = parseInt(duration/xOfDuration);



    // durationBoundary 视频时长边界 视频小于该值  每次滑动变化5秒
    //  minStep 单次滑动最少变化 5秒
    //  xOfTransverseLength  1/X个屏幕宽度
    // maxStep 单次滑动最大变化 duration/10 秒

    if (duration < durationBoundary) {
        console.log('11111111视频较短，最多一次5s');
        stepVal = minStep;
    } else {
        if (moveLength > parseInt(transverseLength/xOfTransverseLength)) {
            console.log('222222222222到达滑动一次变化极限，一次', maxStep, '秒');
            stepVal = maxStep
        } else {
            stepVal = (moveLength/parseInt(transverseLength/xOfTransverseLength))*maxStep
            console.log('333333333333正常滑动距离，一次', stepVal, '秒');
        }
    }
    return stepVal;
}


function hideAlertDialog () {
    let AlertDialogElArray = document.querySelectorAll('.loginAboutPopup');
    if (AlertDialogElArray && AlertDialogElArray.length) {
        AlertDialogElArray.forEach((item, inde)=>{
            item.style.display = 'none';
            //console.log('item', item);
        });
        //console.log('loopend', AlertDialogElArray)
    }
}

function removeTrack() {
    let body = document.querySelector('body');
    let scriptArr = document. getElementsByTagName('script'); //HTMLCollection 类数组结构 使用for可进行遍历 不可使用forEach
    let tempELArray = [];
    let checkTrackReg = /googletagmanager/ig;
    console.log('scriptArr', scriptArr);
    for(let i = 0;i < scriptArr.length;i++) {
        let item = scriptArr[i];
        let attributes = item.attributes;
        let innerText = item.innerText;

        //移除googletagmanager
        if (attributes && attributes.src) {
            let checkRes = checkTrackReg.test(attributes.src.value);
            if (checkRes) {
                console.log('被移除掉的脚本是', item);
                body.removeChild(item);
                continue;
            }
        }
    }
}



function checkUrlAddListenser() {
    let reg = /\/videoContent\//ig;
    var interval = 0;
        if (window.location.href) {
            if (reg.test(window.location.href)) {
                interval = setInterval(() => {
                    //console.log('setInterval 获取元素', document.querySelector('.dplayer-video.dplayer-video-current'))
                    if (document.querySelector('.dplayer-video.dplayer-video-current')) {
                        initScroll(document.querySelector('.dplayer-video.dplayer-video-current'));
                        bindBd();

                        clearInterval(interval);
                        console.log('找到了对应播放器页面dom元素且绑定了滑动快进事件')
                    }
                }, 3000);
            } else {
               console.log('不是视频播放页');
            }
        }
}

var timer = null;
// 视频的上层元素 document.querySelectorAll('.unLoginBox.dplayer') 单击不再暂停  双击暂停
function bindBd () {
    console.log('bindBd xxxxxxxxxx');
    let el = document.querySelectorAll('.unLoginBox.dplayer') && document.querySelectorAll('.unLoginBox.dplayer')[0];

    console.log('bindBd el', el);
    if (el) {
        let videControlPlayBtn = document.querySelectorAll('.unLoginBox.dplayer .dplayer-controller .dplayer-play-icon')[0]
        //el.addEventListener('click', function () {
            //console.log('单击');
            //clearTimeout(timer); //清除未执行的定时器
            //timer = setTimeout(function () {
            //    console.log('单击');
            //}, 400);
            //event.stopImmediatePropagation();
        //},true);
        el.addEventListener('dblclick', function () {
            console.log('双击');
            //clearTimeout(timer); //清除未执行的定时器
            //videControlPlayBtn.click();
            //event.stopImmediatePropagation();
        },true)
    }



}


// 移动端页面滚动
function mobileCssSet () {
    console.log('mobileCssSet before');
    // 基础的几个容器样式需要设置overflow 为 scroll
    let body = document.querySelector('body');
    let app = document.querySelector('#app');
    let index = document.querySelector('#index');
    let publicHeaderModule = document.querySelector('#publicHeaderModule');

    let pageHeaderElArray = document.querySelectorAll('#publicHeaderModule>div');
    let pageMainContent = document.querySelector('.publicBigMainContentBox');
    let publicFooterModule = document.querySelector('#publicFooterModule');

    let scrollVal = 'initial';
    console.log('元素列表');
    console.log(body,app,index,publicHeaderModule,pageHeaderElArray,pageMainContent,publicFooterModule)
    body.style.overflowX = scrollVal;
    app.style.overflowX = scrollVal;
    index.style.overflowX = scrollVal;
    publicHeaderModule.style.overflowX = scrollVal;
    pageMainContent.style.overflow = scrollVal;
    pageHeaderElArray[0].style.overflowX = scrollVal;
    pageHeaderElArray[1].style.overflowX = scrollVal;
    pageHeaderElArray[2].style.overflowX = scrollVal;
    publicFooterModule.style.overflowX = scrollVal;


    let videoContainer = document.querySelector('#videoContent .video>div');
    //videoContainer.style.width = '100vw';
   //document.ontouchstart = function(e) {
   //     console.log('重置.document.ontouchstart');
   // };
   // document.ontouchmove = function(e) {
    //    console.log('重置.document.ontouchmove');
   // };
   // document.addEventListener("touchmove",function(e){
   //     console.log('addEventListener 出发了11111111111111111')
    //});
    console.log('mobileCssSet end');
}


function removeMask() {
    let pageHeaderElArray = document.querySelectorAll('.el-dialog__wrapper');
    pageHeaderElArray[0].style.display = 'none';
    pageHeaderElArray[1].style.display = 'none';
    pageHeaderElArray[2].style.display = 'none';
    pageHeaderElArray[3].style.display = 'none';

}

// 页面缩放
function bodyScale() {
    let devicewidth = document.documentElement.clientWidth;
    let scale = devicewidth / 1920; // 分母——设计稿的尺寸宽度

    let videoWidth = 1200*scale;
    let videoCompareWidth = devicewidth/videoWidth;
    console.log('devicewidth', devicewidth);
    console.log('videoWidth', videoWidth);
    console.log('设备宽度是视频宽度的', videoCompareWidth);
    document.body.style.zoom = (scale*videoCompareWidth).toFixed(2);
}
window.onresize = function () {
    bodyScale();
};
window.onload = function () {
    bodyScale();
    mobileCssSet();
    checkUrlAddListenser();
    console.log('page onload');
    removeMask();
    hideAlertDialog();
    removeTrack();
};