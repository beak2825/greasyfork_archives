// ==UserScript==
// @name        B友成分指示器
// @namespace    NEKOnyako
// @version      0.2.1
// @description  B站评论区自动标注成分
// @author       NEKOnyako
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/*
// @match        *://t.bilibili.com/
// @match        *://space.bilibili.com/*
// @icon          https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant         GM_xmlhttpRequest
// @grant        window.onurlchange
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451283/B%E5%8F%8B%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451283/B%E5%8F%8B%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {

    'use strict';
    console.log('%c  bpcheck   %c 加载成功 ',"display: inline-block;color:#444;background-color:#eee ; padding:5px 0;border-radius: 5px;","")

    const hasData = new Set()
    //vtb标签开关
    let tagVtb=true
    //自定义标签
    let tag_data = [
        {tag_name:'原批',color:'#06c5ff',keyword:['钟离','胡桃','优菈','须弥','蒙德','莫娜','#原神#','雷电将军','派蒙','原神','原神3.0'],vtb:false,hide:false},
        {tag_name:'粥畜',color:'#FB7299',keyword:['明日方舟','#明日方舟三周年#','罗德岛','整合运动','乌萨斯'],vtb:false,hide:false},
        {tag_name:'农批',color:'#19273F',keyword:['王者快跑','百里守约','王者荣耀','KPL','#王者荣耀#'],vtb:false,hide:false},
        {tag_name:'隐藏|动态抽奖',color:'#333333',keyword:['#转发+关注抽奖#','#转发抽奖#','互动抽奖'],vtb:false,hide:true},
        {tag_name:'yyut',color:'#CC6600',keyword:['yyut','YYUT','ゆゆうた','YYUT放送协会'],vtb:true,hide:false},
        {tag_name:'喵喵露',color:'#11DD77',keyword:['@猫雷NyaRu_Official','猫雷NyaRu_Official','#猫雷にゃる#','猫雷にゃる','猫雷'],vtb:true,hide:false},
        {tag_name:'黑白狐',color:'',keyword:['Mana'],vtb:true,hide:false}
    ]

    // 检测是不是新版
    const is_new = document.getElementsByClassName('comment-m-v1').length +document.getElementsByClassName('item goback').length != 0
    const userInfoUrl = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
    const videoInfoUrl = 'https://api.bilibili.com/x/web-interface/view?bvid='

    const get_pid = (c) => {
        if (is_new) {
            return c.dataset['userId']
        } else {
            return c.children[0].getAttribute('href').replace(/[^\d]/g, "")
        }
    }

    const get_comment_list = () => {
        if (is_new) {
            let lst = new Set()
            for (let c of document.getElementsByClassName('user-name')) {
                lst.add(c)
            }
            for (let c of document.getElementsByClassName('sub-user-name')) {
                lst.add(c)
            }
            return lst
        } else {
            return document.getElementsByClassName('user')
        }
    }

    async function HttpRequestBlog(reqUrl,parm,index){
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "get",
                url:  reqUrl+parm,
                data: '',
                headers:  {
                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                },
                onload: (res)=>{
                    if(res.status === 200){
                        //index1为用户查询
                        if(index ==1){
                             let initResData = JSON.parse(res.response).data.items
                        const deleteData = initResData .map(item => {
                            if(item.orig){
                                delete item.orig.modules.module_author.decorate
                            }
                            return item
                        })
                        let userData = JSON.stringify(deleteData)
                        return resolve(userData)
                        }
                       return resolve(JSON.parse(res.response).data)
                    }else if(res.status === 403){
                        console.log("拒绝访问")
                        return
                    }else return
                }
            })
        })
    }

    //url变化时获取uptag并获取视频信息
    window.addEventListener('urlchange',async ()=>{
        let bvid = window.location.pathname.substring(window.location.pathname.indexOf('/',1)).replace(/\//g, "")
        let resVideoData =await HttpRequestBlog(videoInfoUrl,bvid,2)
        //setTimeout(getTagUp(),4000)
        setTimeout(setVideoInfo(resVideoData),4000)
    })


    setInterval(()=>{
    let commentlist = get_comment_list()
         if (commentlist.length != 0){
             commentlist.forEach(async c=>{
                 let pid = get_pid(c)
                 if(!hasData.has(pid)){
                     let resUserData =await HttpRequestBlog(userInfoUrl,pid,1)
                     tagCheck(resUserData,c,pid)
                     hasData.add(pid)
                 }
             })
         }
        //检测URL变化
        window.addEventListener('urlchange', ()=>{
            const hasData = new Set()
           // window.location.reload('#v_upinfo')
        })
        //鼠标经过改变状态
        var lis = document.querySelectorAll('#idtag')
            for(var i = 0;i<lis.length;i++){
            lis[i].onmouseover = function(){
                this.children[0].style.display = 'block';
            }
            lis[i].onmouseout =function(){
                this.children[0].style.display = 'none'
            }
        }
    },4000)

     //获取up主tag
     async function getTagUp() {
          let elUpName = document.querySelector('div.name').children[0]
        //拿到up主pid
        let upPid = document.querySelector('.username').getAttribute('href').replace(/[^\d]/g, "")
        let res = await HttpRequestBlog(userInfoUrl,upPid,1)

        if(res){
            elUpName.style.overflow='visible'
            //添加tag
            tagCheck(res,elUpName,upPid)
            hasData.add(upPid)
        }};

     //追加tag
     function tagCheck(resUserData,element,pid){
         tag_data.forEach(item=>{
             let keywordCheck = item.keyword.filter((keyword)=>resUserData.includes(keyword))
             let tagSpan =`<span  id='idtag' style='background-color:${item.color};min-width:70px;cursor:pointer;border-radius: 8px;z-index:998;color: #FFFFFF;margin-right:5px;display:inline-block;text-align:center;'>${item.tag_name} ${keywordCheck.length}/${(item.keyword).length}
             <div style='display:none;min-width:80px;color: #FFFFFF;position:absolute;margin-top:3px;z-index:999;min-width:70px;border-radius:1px;background-color:${item.color};'>匹配:${keywordCheck}</div></span>`
             if(item.hide){tagSpan =`<span style='min-width:30px;border-radius: 8px;z-index:998;color: #FFFFFF;margin-right:5px;display:inline-block;background-color:#999999;text-align:center;'>${item.tag_name}</span>`}
             //判断关键词
             if((item.keyword).length>=2){
                 if (keywordCheck.length!=0&&!hasData.has(pid)&&tagVtb){
                     element.innerHTML += tagSpan
                 }else if(keywordCheck.length!=0&&!hasData.has(pid)&&!tagVtb&&!item.vtb){
                     element.innerHTML += tagSpan
                 }else{
                     return
                 }
             }else{
                 if (resUserData.includes(item.keyword)&&!hasData.has(pid)&&tagVtb){
                     element.innerHTML += tagSpan
                 }else if(resUserData.includes(item.keyword)&&!hasData.has(pid)&&!tagVtb&&!item.vtb){
                     element.innerHTML += tagSpan
                 }else if((resUserData.includes('Mana')&&!hasData.has(pid)&&tagVtb)){
                     element.innerHTML += `<span style='background:-webkit-linear-gradient(left ,#F3F9F9,#31262F);width:70px;border-radius: 8px;color: #FFFFFF;display:inline-block;text-align:center;'>黑白狐</span>`
                 }
                 else{
                     return
                 }
             }
         })
     }

    //重写视频信息
    function setVideoInfo(resVideoData){
        if(!is_new){
            const e = document.querySelector('.video-data')
            //const t = document.querySelector('.tit')
            e.innerHTML = `<span>分区:${resVideoData.tname} av${resVideoData.aid} 播放量:${fromatNum(resVideoData.stat.view)} 弹幕数:${fromatNum(resVideoData.stat.danmaku)} 投稿时间:${fromatTimeUTC8(new Date(resVideoData.pubdate*1000))}</span>`
            if(resVideoData.pubdate!=resVideoData.ctime){
            e.innerHTML +=`<span> 上传时间:${fromatTimeUTC8(new Date(resVideoData.ctime*1000))}</span>`
            }
            if(resVideoData.copyright==1){
                e.innerHTML +=`<span style='background-color:#7ccee9;margin-left:8px'>投稿原创</span>`
            }else e.innerHTML +=`<span style='background-color:#dabc25;margin-left:8px'>投稿转载</span>`
        }
    }

    //格式化时间
    function fromatTimeUTC8(t){
    return (t.getFullYear() + '年' + (((t.getMonth() + 1) < 10) ? ('0' + (t.getMonth() + 1)) : (t.getMonth() + 1)) + '月' + ((t.getDate() < 10) ? ('0' + t.getDate()) : t.getDate()) + '日\xa0' + ((t.getHours() < 10) ? ('0' + t.getHours()) : t.getHours()) + ':' + ((t.getMinutes() < 10) ? ('0' + t.getMinutes()) : t.getMinutes()) + ':' + ((t.getSeconds() < 10) ? ('0' + t.getSeconds()) : t.getSeconds()));
    }

    //格式化数字 (来源google)
    function fromatNum(n){
    return (n || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    }
    })
();