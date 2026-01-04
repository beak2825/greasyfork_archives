// ==UserScript==
// @name         Acfun 观影助手
// @namespace 	 AcfunFilmModeSwitch
// @version      0.6
// @description  Acfun 视频播放和直播自动切换为宽屏和最高画质
// @author       Jianeddie
// @match      *://*.acfun.cn/v/ac*
// @match      *://*.acfun.cn/live/*
// @connect      www.acfun.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471494/Acfun%20%E8%A7%82%E5%BD%B1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471494/Acfun%20%E8%A7%82%E5%BD%B1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


// 视频占屏幕的比例
let sratio = 0.85;
// 根据具体网络情况设定，若执行失效，适当加大
let wtime = 1200;

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function reset()
{
    let rd = document.querySelector('.right-column.dark-style');

    if (rd !== null){
        let ck = Math.trunc(innerHeight * sratio);
        document.getElementById("ACPlayer").style.cssText = "height: "+ ck +"px";
    }
}

function filmmode()
{
    sleep(wtime).then(() => {
        try{
            let bm = document.querySelector('.btn-film-model');

            if (bm.querySelector('.btn-span').getAttribute('data-bind-attr')=='false')
            {
                bm.click();
                bm.querySelector('.btn-span').setAttribute('data-bind-attr', 'true');
            }

            sleep(100).then(() => {
//                 let rd = document.querySelector('.right-column.dark-style');

//                 if (rd == null){
//                     bm.click();
//                     bm.querySelector('.btn-span').setAttribute('data-bind-attr', 'false');

//                     bm.click();
//                     bm.querySelector('.btn-span').setAttribute('data-bind-attr', 'true');
//                 }

                let rd = document.querySelector('.right-column.dark-style');

                if (rd !== null){
                    let ck = Math.trunc(innerHeight * sratio);
                    document.getElementById("ACPlayer").style.cssText = "height: "+ ck +"px";
                }
                document.querySelector(".quality-panel ul li").click();
            });

        }catch(err){
            //console.log("filmmodeClcik error:"+err);
            return sleep(100).then(() => {filmmode();});
        }
    });
}

window.onload = filmmode;
window.onresize = reset;

sleep(2 * wtime + 600).then(() => {
    let rc = document.querySelector('.right-column');

    if (rc !== null){
        let bm = document.querySelector('.btn-film-model');
        bm.addEventListener('click', function(){
            sleep(100).then(() => {reset();});
        });
    }
});

