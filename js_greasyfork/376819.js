// ==UserScript==
// @name         S1帖子屏蔽器
// @version      1.1.0
// @author       tony0815
// @description  利用不同条件屏蔽S1的版块主题
// @icon         https://static.saraba1st.com/image/smiley/face2017/034.png
// @match        *://bbs.saraba1st.com/2b/*
// @grant        none
// @namespace https://greasyfork.org/users/239832
// @downloadURL https://update.greasyfork.org/scripts/376819/S1%E5%B8%96%E5%AD%90%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/376819/S1%E5%B8%96%E5%AD%90%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==
'use strict';
/*                 *
 *   简易参数设定   *
 *                 */

/*  总开关，预设为 true ，切换为 false 后脚本将不会执行隐藏帖子功能 */
let switch_global = true;

/*  麻将脸开关，预设为 true ，切换为 false 后会隐藏可以开关该页面隐藏帖子功能的麻将脸 */
let switch_mahjong= true;

/*  更新开关，在最差情况下，脚本会以[鼠标移动]为触发条件不断执行过滤代码，
 *  此行为可能会降低页面流畅度，如果电脑机能较差，觉得不耐烦的话，可以关闭此开关。
 *  预设为 true ，切换为 false 后将不会进行相关操作（则同页面的新帖子将不会被过滤）。
 */
let switch_update = true;

/*  功能开关，用作单独类别的隐藏功能的开关。
 *  如希望完整关闭某一种过滤方法，直接把相关参数由 true 变更为 false 即可。
 *  switch_post_title：帖子标题
 *  switch_post_class：帖子分类
 *  switch_post_id   ：帖子发表人(论坛ID)
 *  switch_post_vote ：投票类帖子
 */
let switch_post_title = true;
let switch_post_class = true;
let switch_post_id    = true;
let switch_post_vote  = false;

/*  过滤词设定，以字符串数组(String Array)储存。和开关的参数名称类似：
 *  NG_pool_title：帖子标题
 *  NG_pool_class：帖子分类
 *  NG_pool_id   ：帖子发表人(论坛ID)
 */
let NG_pool_title = ['阴阳怪气'];
let NG_pool_class = ['PSVita','Wii U'];
let NG_pool_id    = ['冬馬かずさ','小木曽雪菜'];

/*                 *
 *   脚本正文开始   *
 *                 */

function main_process(){
    let count = {"title":0,"class":0,"id":0,"vote":0};

    //主题关键词处理
    if(switch_post_title){

        document.querySelectorAll('#threadlist tbody .s.xst:not(.censored)').forEach(ele => {
            for (let i=0;i<NG_pool_title.length;i++){
                if (ele.innerText.match(NG_pool_title[i])) {
                    count.title++;
                    ele.parentElement.parentElement.parentElement.style.display = 'none';
                    ele.parentElement.parentElement.parentElement.classList.add("主题过滤","censored");
                } else {
                    //console.log(ele.innerText);
                }
            };
            ele.classList.add("censored");
        });

    }

    //分类关键词处理
    if(switch_post_class){

        document.querySelectorAll('#threadlist tbody th em>a:not(.censored),#threadlist tbody td.new em>a:not(.censored),#threadlist tbody th span>a.xg1:not(.censored),#threadlist tbody th.new span>a.xg1:not(.censored)').forEach(ele => {
            for (let i=0;i<NG_pool_class.length;i++){
                if (ele.innerText == NG_pool_class[i]) {
                    count.class++;
                    ele.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                    ele.parentElement.parentElement.parentElement.parentElement.classList.add("类别过滤","censored");
                } else {
                    //console.log(ele.innerText);
                }
            };
            ele.classList.add("censored");
        });

    }

    //作者关键词处理
    if(switch_post_id){

        document.querySelectorAll('#threadlist tbody').forEach((ele,numofa) => {
            let target = ele.querySelector('td.by cite a:not(.censored)');
            for (let i=0;i<NG_pool_id.length;i++){
                if(target){
                    if(target.innerText == NG_pool_id[i]){
                        target.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                        target.parentElement.parentElement.parentElement.parentElement.classList.add("作者过滤","censored");
                    }else{
                        //console.log(target);
                    }
                    target.classList.add("censored");
                }
            }
        });

    }

    //投票贴子处理
    if(switch_post_vote){

        document.querySelectorAll('#threadlist tbody td.icn img:not(.censored)').forEach(ele => {
                let img_path = ele.src.split('/');
                if (img_path[img_path.length-1] == "pollsmall.gif") {
                     count.vote++;
                     ele.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                     ele.parentElement.parentElement.parentElement.parentElement.classList.add("投票过滤","censored");
                } else {
                     //console.log(ele.innerText);
                }
            ele.classList.add("censored");
        });

    }

    //过滤统计
    if(count.title!=0||count.class!=0||count.id!=0||count.vote!=0){
        console.log('本次过滤触发条件次数：主题 - '+count.title+'、类别 - '+count.class+'、作者 - '+count.id+'、投票 - '+count.vote+'');
    }

    //麻将脸换脸
    if(switch_mahjong){
        if(document.querySelector("#threadlist tbody.censored") ){
            document.querySelector("#that_S1_censoring_mahjong").style['background-image'] = "url('https://static.saraba1st.com/image/smiley/face2017/177.png')"
        }else{
            document.querySelector("#that_S1_censoring_mahjong").style['background-image'] = "url('https://static.saraba1st.com/image/smiley/face2017/176.png')"
        }
    }

}
function repair_process(){
    document.querySelectorAll('#threadlist tbody.censored').forEach(ele => {
        ele.style.display = 'table-row-group';
        ele.classList.remove("censored");
    });
    document.querySelectorAll('#threadlist .censored').forEach(ele => {
        ele.classList.remove("censored");
    });
}
function update_page(){
    if(switch_global){
        main_process();
    }
}
function toggleONOFF(){
    if(switch_global){
        switch_global = false;
        repair_process();
        document.querySelector("#that_S1_censoring_mahjong").style['background-image'] = "url('https://static.saraba1st.com/image/smiley/face2017/008.png')";
    }else{
        switch_global = true;
        main_process();
    }
}

//实际运行代码
if(document.getElementById("threadlist")){
    if(switch_mahjong){
        let mahjong = document.createElement("span");
        mahjong.setAttribute("id", "that_S1_censoring_mahjong");
        mahjong.style.cssText = 'border-top: 1px #cdcdcd solid;'
            +'width: 32px;height: 32px;padding: 2px 4px;'
            +'display: inline-block;background-position: center;'
            +'background-repeat: no-repeat;';
        mahjong.style['background-image'] = "url('https://static.saraba1st.com/image/smiley/face2017/"
            +(switch_global?/*(document.querySelector("#threadlist tbody.censored")?"176":*/"177"/*)*/:"008")
            +".png')"
        mahjong.addEventListener("click",toggleONOFF);
        let baseelement = document.getElementById('scrolltop');
        baseelement.insertBefore(mahjong, baseelement.childNodes[baseelement.childNodes.length-2]);
    }
    if(switch_global){
        main_process();
    }
    if(switch_update){
        if("MutationObserver" in window){
            new MutationObserver(update_page).observe(document.querySelector("#threadlist"),{childList:true,subtree: true});
        }else if("MutationEvent" in window){
            document.querySelector("#threadlist").addEventListener("DOMNodeInserted",update_page);
        }else{
            document.addEventListener("mousemove",update_page);
        }
    }
}