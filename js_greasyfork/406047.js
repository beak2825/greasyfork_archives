// ==UserScript==
// @name         bili指挥部(精准降落)
// @namespace    http://tampermonkey.net/
// @version      1.64
// @description  查找弹幕中关键词，实现自动跳过片头
// @author       kakasearch
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/video/BV*
// @include      *://www.bilibili.com/bangumi/play/ep*
// @include      *://www.bilibili.com/bangumi/play/ss*
// @include      *://m.bilibili.com/bangumi/play/ep*
// @include      *://m.bilibili.com/bangumi/play/ss*
// @include      *://bangumi.bilibili.com/anime/*
// @include      *://bangumi.bilibili.com/movie/*
// @include      *://www.bilibili.com/bangumi/media/md*
// @include      *://www.bilibili.com/blackboard/html5player.html*
// @connect      comment.bilibili.com
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406047/bili%E6%8C%87%E6%8C%A5%E9%83%A8%28%E7%B2%BE%E5%87%86%E9%99%8D%E8%90%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406047/bili%E6%8C%87%E6%8C%A5%E9%83%A8%28%E7%B2%BE%E5%87%86%E9%99%8D%E8%90%BD%29.meta.js
// ==/UserScript==

/////////////////////////////////////////////bili_pass --- danmu_pass//////////////////////////////////////////////////////
(function() {
    const bili_pass_zhb = {
        setting:{
            keyword:['在.+跳op','小手.+没有','谢指挥部','精准降落','反手炸了指挥部','无.+手熟尔','精准落地','感谢指路'],//含有这些关键词的进入筛选，如感谢指挥部
            badword:['呼叫','[\？?吗呢怎了]'],//含有这些词的弹幕将被排除，例如 呼叫指挥部 或 指挥部呢？
            max_time:300,//单位秒，最大跳过时长，此时长之外的将视为不可信，0为不限制
            min_time:10,//单位秒，最小跳过时长，此时长之外的将视为不可信，0为不限制
            react_time:3,//弹幕发送的反应时间
            kongjiang:1,//是否开启空降功能，1开0关，检索到空降关键词自动跳转
            super_kongjiang : 0, //强力空降模式，1开0关，会加强对空降功能的检索，但可能会造成出现第一条空降弹幕就跳转
            konjiang_check_time:2500,//空降检查时间间隔，单位ms，2000-4000是比较好的选择
            kongjiang_num:2,//空降位置出现的最低次数，低于此数量的弹幕会被认为不可信，意在阻止虚假空降
            auto_play:1,//是否打开页面就播放，默认为1：所有页面播放，改为0：只有换p后才会自动播放
            debug : 0,//开发模式,0关，1一级管理员，2二级管理员
        },
        info(){//输出信息
            const arg = Array.from(arguments);
            arg.unshift(`color: white; background-color:#2274A5`);
            arg.unshift('%c bili指挥部:');
            console["info"].apply(console, arg);
        },
        debug(){//调试输出
            if(!bili_pass_zhb.setting.debug){return}
            const arg = Array.from(arguments);
            arg.unshift(`color: white; background-color:#2274A5`);
            arg.unshift('%c bili指挥部_debug:');
            console["info"].apply(console, arg);
        },
        kongjiang_by_danmuku(){//间隔一定时间检查，konjiang_check_time:2500,//空降检查时间间隔，单位ms，2000-4000是比较好的选择
            let tmp ={}//累计弹幕
            let run =1
            let kj_by_danmuku =setInterval(function(){
                if(run){
                    run=0
                    bili_pass_zhb.debug('run kongjiang')
                    let text = document.querySelector(".bilibili-player-video-danmaku").innerText
                    let reg = /(.*?[空降传送坐标](\d+[:：.分mM])?(\d+).*)/gi
                    let matchs = text.match(reg)
                    if(matchs){
                        //let tmp = bili_pass_zhb.kongjiangdict//单次弹幕
                       // let tmp = bili_pass_zhb.setting.super_kongjiang?bili_pass_zhb.kongjiangdict:{} //单次弹幕，超级空降，是否继承来自弹幕的空降关键词
                        for(let i of matchs){
                            let result = reg.exec(i)
                            if(result){
                                //danmuku
                                bili_pass_zhb.debug('匹配到空降，检查中',result[1])
                                let send_time = document.querySelector("video").currentTime //现在播放位置时间
                                let target_time = parseInt(result[2] || 0 )*60+parseInt(result[3]) //空降时间
                                let danmu = result[1] //弹幕内容
                                if(target_time > document.querySelector("video").duration-10||target_time-send_time<10){//目的地是最后10s,往后小于5s就不跳了
                                    bili_pass_zhb.debug('空降目的地不可信，已过滤',send_time,target_time)
                                    continue
                                }
                                let check_rank = 5//检查+-5范围内归为1类
                                for(let i =0;i<=check_rank;i++){
                                    if(tmp[target_time+i] ||tmp[target_time-i]){
                                        tmp[target_time][0]+=1 //出现次数加1
                                        if(tmp[target_time][0]>=bili_pass_zhb.setting.kongjiang_num){
                                            let video= document.querySelector("video")
                                            let m = Math.floor(target_time/60)
                                            let s = target_time-60*m
                                            bili_pass_zhb.info('空降至:',m,':',s)
                                            setTimeout(function(video,target_time){ //考虑弹幕反应时间，降低误差
                                            video.currentTime = target_time
                                            video.play()
                                            },bili_pass_zhb.setting.react_time,video,target_time)
                                            run =1
                                            bili_pass_zhb.debug('空降列表',tmp)
                                            return
                                        }
                                    }else{
                                        tmp[target_time] = [1,danmu] //空降时间：[出现次数,内容]
                                    }

                                }
                                bili_pass_zhb.debug('空降列表',tmp)
                            }
                        }
                    }
                }
                run =1
            },bili_pass_zhb.setting.konjiang_check_time)
            },
        //         kongjiang(text,status){//查找空降，出现空降时跳转 0,by ajax xml text ;1 by danmuku     //暂时弃用但比一直监听要好很多，省资源
        //             //必须存在相同的空降指示，才能认定是正确的跳转
        //             //视频播放超过跳转指示后，杀掉interval
        //             if(bili_pass_zhb.setting.debug>1){bili_pass_zhb.info( text)}
        //             let reg
        //             if(status){
        //                 text = document.querySelector(".bilibili-player-video-danmaku").innerText
        //                 reg = /(.*?[空降传送坐标]?(\d+[:：.分mM])?(\d+).*)/gi
        //             }else{
        //                 reg = /<d p=\"(\d+\.\d+),.*?\">(.*?[空降传送][坐标]?(\d+[:：.分mM])?(\d+).*)/gi
        //             }
        //             let matchs = text.match(reg)
        //             if(matchs){
        //                 let tmp ={}
        //                 for(let i of matchs){
        //                     let result = reg.exec(i)
        //                     if(result){//ajax
        //                         let send_time
        //                         let target_time
        //                         let danmu
        //                         if(result.length==5){
        //                             send_time = result[1] //弹幕发送时间
        //                             target_time = String(parseInt(result[3] || 0 )*60+parseInt(result[4]) ) //空降时间
        //                             danmu = result[2] //弹幕内容
        //                         }else{//danmuku
        //                             send_time = document.querySelector("video").currentTime //弹幕发送时间
        //                             target_time = String(parseInt(result[2] || 0 )*60+parseInt(result[3]) ) //空降时间
        //                             danmu = result[1] //弹幕内容
        //                         }
        //                         if(target_time <5 ||target_time-send_time<5){//小于5s就不跳了
        //                             continue
        //                         }
        //                         if(tmp[target_time]){
        //                             tmp[target_time][0]+=1 //出现次数加1
        //                             if(Number(send_time)<Number(target_time)){//过滤发送时间超过跳转位置的
        //                                 tmp[target_time][1].push(Number(send_time))
        //                             }
        //                         }else{
        //                             tmp[target_time] = [1,[Number(send_time)],danmu] //空降时间：[出现次数，[发送时间1,发送时间2],内容]
        //                         }
        //                     }
        //                 }
        //                 //计算跳过位置
        //                 window.twice = []
        //                 bili_pass_zhb.debug(tmp)
        //                 for(let i in tmp){
        //                     if(tmp[i][0]>=bili_pass_zhb.setting.kongjiang_num){//至少出现3次   <-- 此处有问题，或许需要统计其他p中弹幕的数量
        //                         let sum = 0
        //                         for(let k of tmp[i][1]){
        //                             sum += k
        //                         }
        //                         let send_time_mean=sum/tmp[i][1].length
        //                         window.twice.push([i,send_time_mean.toFixed(2),tmp[i][2]])//[target_time,send_time,内容]
        //                     }
        //                 }

        //                 if(window.twice.length>0){//添加监听
        //                     let kongjiang_interval = setInterval(function(){
        //                         let video= document.querySelector("video")
        //                         for(let i in window.twice){ //遍历每个，检查时间
        //                             let target_time = window.twice[i][0]
        //                             let send_time = window.twice[i][1]
        //                             let danmu = window.twice[i][2]
        //                             if(video.currentTime>send_time+3){//已超过该跳过的时间,则删除此标记，避免无效查询
        //                                 bili_pass_zhb.debug('空降错过',danmu)
        //                                 window.twice.splice(i,1)

        //                             }else if(video.currentTime>send_time-bili_pass_zhb.setting.react_time){//到达空降弹幕出现处，开始跳跃
        //                                 bili_pass_zhb.debug('现在时间：',video.currentTime,'来自弹幕:',danmu)
        //                                 bili_pass_zhb.info('空降至:',target_time)
        //                                 video.currentTime =Number(target_time)
        //                                 video.play()
        //                                 // bili_pass_zhb.debug('空降已结束',danmu,target_time)
        //                                 window.twice.splice(i,1)
        //                             }
        //                         }
        //                         if(window.twice.length<=0){
        //                             //bili_pass_zhb.debug('空降结束，移除interval')
        //                             clearInterval(kongjiang_interval)//空降结束，杀掉interval
        //                         }
        //                     },1500)

        //                     }else{
        //                         bili_pass_zhb.info('空降出现少于'+bili_pass_zhb.setting.kongjiang_num+'，不可信，取消跳过')

        //                     }
        //             }else{
        //                 bili_pass_zhb.info('无空降关键词')
        //             }

        //         },
        btn_switch(){//指挥部开关控制
            let fill = document.querySelector("#danmu-pass-fill")
            let text = document.querySelector("#danmu-pass-text")
            let btn = document.querySelector("#danmu-pass-switch")
            let oncebtn = document.querySelector("#danmu-pass-once-btn")

            if(btn .checked){
                //开
                fill.setAttribute('fill','#00A1D6')
                text.innerHTML='取消跳op'
                bili_pass_zhb.setting.pass_op = 1//恢复默认
                oncebtn.style.display='none'//取消显示手动开关
            }else{
                //off
                fill.setAttribute('fill','#757575')
                text.innerHTML='自动跳op'
                //本片所有剧集取消跳过
                bili_pass_zhb.setting.pass_op = 0
                bili_pass_zhb.once_btn_switch(0)
                oncebtn.style.display='block'//显示手动开关


            }
        },
        once_btn_switch(status){//手动跳跃开关控制
            //status=0 只跟新状态
            // status = 1 点击
            let once_text = document.querySelector("#danmu-pass-once-text")
            //跳过op，否则，快进5s
            if( bili_pass_zhb.setting.man_btn==0 && bili_pass_zhb.setting.load == 0){
                //第一次点击，打算跳op;没有跳过op；
                if(bili_pass_zhb.setting.found){
                    once_text.innerText = '点击跳过op'
                    if(!status){return
                               }else{
                                   bili_pass_zhb.debug('手动点击跳跃op')
                                   bili_pass_zhb.load_zhb(bili_pass_zhb.setting.up[0],bili_pass_zhb.setting.up[1])
                               }
                }else{
                    once_text.innerText = '未找到指挥部'
                    setTimeout(function(){document.querySelector("#danmu-pass-once-text").innerText = '快进5s'},2000)
                    if(!status){return}
                    let video= document.querySelector("video")
                    video.currentTime +=5
                    video.play()
                }
            }else{
                //后续点击，打算快进5s
                once_text.innerText = '快进5s'
                if(!status){return}
                let video= document.querySelector("video")
                video.currentTime +=5
                video.play()
            }
            bili_pass_zhb.setting.man_btn = 1//标记发生点击操作
        },
        removebtn(){
            setTimeout(function(){
                bili_pass_zhb.debug('开始清除多余开关')
                let ops = document.getElementsByClassName('bilibili-player-video-danmaku-switch')
                let kaiguan_num = 3
                if(ops.length>kaiguan_num){

                    for(kaiguan_num;kaiguan_num++;kaiguan_num<ops.length){
                        document.querySelector(".bilibili-player-video-danmaku-root").removeChild(ops[2])
                    }
                }
            },2000)
        },

        add_btn(){//添加开关,文字id bili_pass_text,开关danmu-pass-switch

            bili_pass_zhb.debug('开始加载指挥部按钮')
            let otest
            let btn
            let init_btn = setInterval(function(){
                let node=document.querySelector("div.bilibili-player-video-danmaku-root > div.bilibili-player-video-danmaku-setting") ||document.querySelector(" div.bpx-player-dm-root > div.bpx-player-dm-setting")
                if(node){clearInterval(init_btn)//成功进入页面，开始执行功能
                         let checked = ''
                         if(bili_pass_zhb.setting.pass_op){//此p跳op
                             checked ='checked'}//默认开启
                         let otest = document.querySelector("div.bilibili-player-video-danmaku-root") || document.querySelector(" div.bpx-player-dm-root")
                         let nodestr = '<div class="bilibili-player-video-danmaku-switch bui bui-switch" ><input id="danmu-pass-switch" class="bui-switch-input" type="checkbox" '+checked+' ><label class="bui-switch-label"> <span class="bui-switch-name"></span> <span class="bui-switch-body">  <span class="bui-switch-dot"><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"> <text  id = "danmu-pass-fill" fill="#00A1D6" stroke="#000" stroke-width="0" stroke-opacity="null" style="pointer-events: inherit; cursor: move;" x="0" y="7" font-size="8" text-anchor="start" xml:space="preserve" stroke-dasharray="none" font-weight="bold">op</text></svg></span>  </span> </span></label><span class="choose_danmaku" id="danmu-pass-text">取消跳op</span></div>'
                         let once_btn_str = `
                          <div class="bilibili-player-video-danmaku-switch bui bui-switch" id="danmu-pass-once-btn" style="display:none">
<svg><text stroke="#00b5e5" stroke-opacity="1" fill-opacity="0.5" stroke-dasharray="none" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="50" id="once_svg_1" y="-240" x="-230" stroke-width="3" fill="#000" transform="matrix(0.3958333432674408,0,0,0.2685714364051819,97.57291506230831,82.73142768535763) ">》</text>
<text stroke="#00b5e5" transform="matrix(0.3958333432674408,0,0,0.2685714364051819,97.57291506230831,82.73142768535763) " stroke-opacity="1" fill-opacity="1" stroke-dasharray="none" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="50" id="once_svg_2" y="-240" x="-250" stroke-width="3" fill="#000">》</text></svg><span class="choose_danmaku" id="danmu-pass-once-text">点击跳过op</span></div>
                                       `
                         let newnode=document.createRange().createContextualFragment(nodestr+once_btn_str);
                         btn = document.querySelector("#danmu-pass-switch")
                         let once_btn = document.querySelector("#danmu-pass-once-btn")
                         if(btn && bili_pass_zhb.setting.debug){bili_pass_zhb.info('重复添加')} //只添加一次
                         else{
                             otest.insertBefore(newnode,node) ///添加开关节点

                         }
                         bili_pass_zhb.btn_switch()
                         try{btn.addEventListener('click',bili_pass_zhb.btn_switch)
                             once_btn.addEventListener('click',function(){bili_pass_zhb.once_btn_switch(0)})

                            }
                         catch(e){
                             // bili_pass_zhb.info('btn error',btn)
                             let init_btn_lis = setInterval(function(){
                                 if(document.querySelector("#danmu-pass-switch")&&document.querySelector("#danmu-pass-once-btn")){
                                     clearInterval(init_btn_lis)//成功进入页面，开始执行功能
                                     document.querySelector("#danmu-pass-switch").addEventListener('click',bili_pass_zhb.btn_switch)
                                     document.querySelector("#danmu-pass-once-btn").addEventListener('click',function(){bili_pass_zhb.once_btn_switch(1)})
                                     document.querySelector("#danmu-pass-once-btn").addEventListener('mouseenter',()=>{
                                         let count =0
                                         let donghau =setInterval(function(){//过度动画
                                             if(count>=1){
                                                 clearInterval(donghau)
                                             }else{
                                                 let x = parseInt(document.querySelector("#once_svg_1").getAttribute('x'))
                                                 if(x>-210){x=-230;count+=1}else{x=x+5}
                                                 document.querySelector("#once_svg_1").setAttribute('x',x)}},80)
                                         bili_pass_zhb.once_btn_switch(0);

                                     })
                                 }else{bili_pass_zhb.addtn()}
                             })
                             }
                         bili_pass_zhb.removebtn()
                        }
            } )
            },
        load_zhb(target,key){//降落至指挥部
            bili_pass_zhb.debug('准备降落至指挥部 '+target)
            let init_load = setInterval(function(){
                let video= document.querySelector("video")
                if(video){clearInterval(init_load) //video加载完毕
                          try{
                              video.currentTime = target-bili_pass_zhb.setting.react_time
                              video.play()
                              bili_pass_zhb.info('已降落至指挥部，指示词：',key)
                              bili_pass_zhb.setting.load = 1
                          }catch(e){
                              video.addEventListener('loadedmetadata',function(){
                                  bili_pass_zhb.debug('from loadedmetadata')
                                  bili_pass_zhb.load_zhb(target,key)
                              })
                          }
                         }
            })
            },
        found_zhb(text){//弹幕中找指挥部
            bili_pass_zhb.debug('开始寻找指挥部')
            bili_pass_zhb.setting.found = 0
            let key_length = bili_pass_zhb.setting.keyword.length
            let bad_length = bili_pass_zhb.setting.badword.length
            for(let i=0;i <key_length;i++){
                bili_pass_zhb.debug('正在遍历good关键词')
                let pattern1 = new RegExp( "<d p=\"(\\d+\\.\\d+),.*?\">(.*?"+bili_pass_zhb.setting.keyword[i]+".*)", "gi");
                let result = pattern1.exec(text)
                if(result){
                    let danmu = result[2]//弹幕内容
                    let bad_check = false
                    bili_pass_zhb.debug('开始遍历bad关键词')
                    for(let k=0;k<bad_length;k++){//检查是否有无效关键词  /////////////////////////////此处可优化至上步，一并匹配
                        let pattern2 = new RegExp( bili_pass_zhb.setting.badword[k], "gi");
                        if(pattern2.exec(danmu)){
                            bili_pass_zhb.debug('无效弹幕',danmu)
                            bad_check = true
                        }
                    }
                    if(bad_check){continue}
                    //关键词是有效的

                    let target = parseInt(result[1])//指挥部所在时间
                    bili_pass_zhb.debug('弹幕有效，获取时间： '+result[1])

                    if(bili_pass_zhb.kongjiangdict[target]){ //指挥部可能是为空降服务的
                        bili_pass_zhb.kongjiangdict[target][0] +=1
                    }else{
                        bili_pass_zhb.kongjiangdict[target] = [1,['from 指挥部',result[2]]]
                    }

                    if((target<=bili_pass_zhb.setting.max_time&& target>=bili_pass_zhb.setting.min_time)||bili_pass_zhb.setting.max_time<=0){//指挥部可信
                        bili_pass_zhb.setting.up = [target,bili_pass_zhb.setting.keyword[i]]//存到全局变量以便访问
                        bili_pass_zhb.debug(bili_pass_zhb.setting.up)
                        bili_pass_zhb.debug('找到指挥部，弹幕：',result)
                        if(bili_pass_zhb.setting.pass_op ){//开关控制是否要跳op
                            bili_pass_zhb.debug('开关开启，准备跳跃op')
                            bili_pass_zhb.load_zhb(target,bili_pass_zhb.setting.keyword[i])
                        }else{bili_pass_zhb.info('off')}
                        bili_pass_zhb.setting.found = 1
                        break

                    }else{
                        if(bili_pass_zhb.setting.debug){
                            bili_pass_zhb.info('指挥部时间不可信,如需修改，请前往setting代码出，当前跳转时长范围：',bili_pass_zhb.setting.min_time,'--',bili_pass_zhb.setting.max_time)
                            bili_pass_zhb.info(result)
                        }
                    }
                }
            }
            if(bili_pass_zhb.setting.found==0){
                bili_pass_zhb.info('未找到指挥部')
                document.querySelector("video").play()
                //bili_pass_zhb.once_btn_switch(0)
                // bili_pass_zhb.debug('开始换btn')
                //bili_pass_zhb.debug( text)
            }

        },
        get_danmu(cid){//获取弹幕

            bili_pass_zhb.debug('开始获取弹幕')
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://comment.bilibili.com/'+cid+'.xml',
                onload: function(xhr) {

                    if (xhr.status == 200) {
                        let text = xhr.responseText.replace(/<\/d>/g,'\n')
                        bili_pass_zhb.found_zhb(text)
                        if(bili_pass_zhb.setting.kongjiang){
                            //bili_pass_zhb.kongjiang(text)
                            bili_pass_zhb.kongjiang_by_danmuku()
                        }//执行空降功能
                    } else {
                        bili_pass_zhb.info('获取弹幕失败')
                    }
                },
                onerror:function(){bili_pass_zhb.info('获取弹幕失败')}
            });
        },
        initfun(from){
            bili_pass_zhb.add_btn()//加开关
            bili_pass_zhb.setting.man_btn = 0//手动开关未使用
            bili_pass_zhb.setting.found = 0//未找到指挥部关键词
            bili_pass_zhb.setting.load = 0//未降落到指挥部
            let cid
            bili_pass_zhb.kongjiangdict = {}
            bili_pass_zhb.setting.cid = ''//控制切p
            bili_pass_zhb.setting.pass_op = 1//记录次剧集是否跳过
            bili_pass_zhb.setting.found = 0//记录次剧集是否跳过
            // bili_pass_zhb.info(from)
            // bili_pass_zhb.info(bili_pass_zhb.setting.autoplay)

            if(from=='first_run' && ! bili_pass_zhb.setting.auto_play){
                bili_pass_zhb.info('拒绝执行')
                return
                //关闭了默认播放，且此时没切p
            }else{
                bili_pass_zhb.info('同意执行')
                let init = setInterval(function(){
                    cid = unsafeWindow.cid
                    if(cid){clearInterval(init) //成功进入页面，开始执行功能
                            if(cid !=bili_pass_zhb.setting.cid){//阻止无效运行

                                bili_pass_zhb.setting.cid = cid//保证只允行1次
                                bili_pass_zhb.get_danmu(cid)

                            }

                           }
                },500)
                }
        }
    }

    /////////////////////////////////
    let ci = 0
    bili_pass_zhb.initfun('first_run')
    let obser = setInterval(
        function(){
            let video= document.querySelector("#bilibili-player video")
            if(video){
                clearInterval(obser)
                let observer = new MutationObserver(()=>{if(ci == 0){ci =1;bili_pass_zhb.initfun()}else{ci =0 }})
                observer.observe(video, { attributes: true });//检测video变化,防止中途切p失效
            }

        },200
    )
    })();