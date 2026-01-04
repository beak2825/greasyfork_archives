// ==UserScript==
// @name         成分指示器
// @namespace    CompositionIndicator[modified]
// @version      1.03
// @description  B站评论区自动标注成分
// @author       带带大师兄
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/*
// @match        *://t.bilibili.com/
// @match        *://space.bilibili.com/*
// @icon          https://tvax2.sinaimg.cn/crop.0.0.1002.1002.180/bd4e13c2ly8gdi6iv942mj20ru0rv415.jpg
// @connect      bilibili.com
// @grant         GM_xmlhttpRequest
// @grant        window.onurlchange
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/452228/%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/452228/%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {

    'use strict';
    console.log('%c  bpcheck   %c 加载成功 ',"display: inline-block;color:#444;background-color:#eee ; padding:5px 0;border-radius: 5px;","")

    const hasData = new Set()
    //vtb标签开关
    let tagVtb=true
    //自定义标签
    let tag_data = [

        {
            tag_name:'稀有|原',
            color:'#06c5ff',
            keyword:['钟离','胡桃','优菈','须弥','蒙德','莫娜','#原神#','雷电将军','派蒙','原神','原神3.0'],
            vtb:false,
            hide:false
        },

        {
            tag_name:'稀有|粥',
            color:'#FB7299',
            keyword:['明日方舟','#明日方舟三周年#','罗德岛','整合运动','乌萨斯'],
            vtb:false,
            hide:false
        },

        {
            tag_name:'稀有|农',
            color:'#19273F',
            keyword:['王者快跑','百里守约','王者荣耀','KPL','#王者荣耀#'],
            vtb:false,
            hide:false
        },

        {
            tag_name:'稀有|A',
            color:'#E799B0',
            keyword:['想到晚的瞬间','晚晚','嘉晚饭','乃贝','贝极星空间站','乃琳夸夸群','顶碗人','皇珈骑士','贝极星','乃宝','嘉心糖的手账本','嘉心糖','拉姐','然然','asoul','A-SOUL','水母','来点然能量','奶淇琳','珈乐','贝拉拉的717片星空'],
            vtb:false,
            hide:false
        },

        {
            tag_name:'优秀|孙吧人',
            color:'#19273F',
            keyword:['Can Can Need','CanCanNeed','showshowway','ShowShowWay','1!5!','v我50','眼顶针','眼丁真','sword new new','swordnewnew','打个胶先','单机贴吧','打个郊县','脑婆恰个V'],
            vtb:false,
            hide:false
        },

        {
            tag_name:'传说|耗材',
            color:'#19273F',
            keyword:['偷着乐','偷着le','等国'],
            vtb:false,
            hide:false
        },

        {
            tag_name:'传说|呆蛙',
            color:'#cce8cf',
            keyword:['普丁','蒲亭','普亭','普廷','普钦','坦尚尼亚','欧付宝','載點連結','载点连结','泽伦斯基'],
            vtb:false,
            hide:false
        },


        {
            tag_name:'传说|小仙女',
            color:'#ffc0cb',
            keyword:['男权社会','男性凝视','媚男','国莮','楠蛆','二手男','咱就是说','裹小脑','爹味','堕女胎','一把子','大无语','真的会谢','蟈諵','媎妹','恐男','国男基本盘','男的基本盘','男凝','劣精滞销','恶臭男','普信男','跳脚','郭楠','国男','蝻的','国蝻','蛆蝻','蝻蛆','男宝','蝻宝','恐蝻','见蝻','厌女','楠宝','茶壶嘴','下头男'],
            vtb:false,
            hide:false
        },

        {
            tag_name:'隐藏|动态抽奖',
            color:'#333333',
            keyword:['#转发+关注抽奖#','#转发抽奖#','互动抽奖'],
            vtb:false,
            hide:false
        }

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
            window.location.reload('#v_upinfo')
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