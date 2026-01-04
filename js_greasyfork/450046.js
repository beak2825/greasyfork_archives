// ==UserScript==
// @name         KFHomeTitleResort
// @description  为首页主题按关键字重新排序
// @author       bsky@KF
// @homepage     https://kf.miaola.work/read.php?tid=957308&sf=1c6
// @version      0.2
// @namespace    https://kf.miaola.work/read.php?tid=957308&sf=1c6
// @license      GPLv3
// @match        kf.miaola.work/*
// @match        *.kfpromax.com/*
// @match        m.miaola.work/*
// @run-at       document-end
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/450046/KFHomeTitleResort.user.js
// @updateURL https://update.greasyfork.org/scripts/450046/KFHomeTitleResort.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const forEach=(arr=[],fn,...args)=>{fn=typeof fn==="function"?fn:i=>{return i};for(let length=arr.length,i=0;i<length;++i){fn(arr[i],...args)}},
          dom=str=>{let nodes=document.querySelectorAll(str);return nodes.length>1?[...nodes]:nodes.length>0?nodes[0]:null}
    const STORAGE_NAME='kfrs_config',
          CONFIG=loadConfig(),
          isKfMobile=location.href.includes("m.miaola")
    modifyPage()

    function modifyPage(){
        if(['/index.php','/'].includes(location.pathname)){
            resortHomeTitle()
        }
        const barOfSetPanel=dom(isKfMobile?'#mainMenu>.nav':'#kf_information > ul:nth-child(1)'),
              goSetBtnPanelDomStr=(isKfMobile
                                   ?`<li class="nav-item"><a class="nav-link kfrs_goset_btn" href="javascript:void(0)"><i class="fa fa-cog fa-fw"></i> 排序设置</a></li>`
                                   :`<li><a class="kfrs_goset_btn" href="javascript:void(0)">排序设置</a></li>`)
        barOfSetPanel.append(createNode(goSetBtnPanelDomStr))
        dom('.kfrs_goset_btn').addEventListener('click',openSetting)

        if(isKfMobile){
            dom('section.row:nth-child(3) > ul:nth-child(2)').remove()
        }else{
            dom('#kf_information > ul:nth-child(1)').append(createNode(`<li><a class="kfrs_gogu_btn" href="fyg_sjcdwj.php?go=play" target="_blank">咕咕镇</a></li>`))
        }
    }

    function resortHomeTitle(){
        const data=CONFIG.PAGE_HOME_DATA,
              [guKws,riseKws,sinkKws,removeKws,riseUsers,sinkUsers,removeUsers]=
              [data.GU_KW,data.RISE_KW,data.SINK_KW,data.REMOVE_KW,data.RISE_USER,data.SINK_USER,data.REMOVE_USER],

              newReplyBoxes=(isKfMobile
                             ?[...dom("#newReplyPanel1 .thread-link-group"),
                               ...dom("#newReplyPanel2 .thread-link-group"),
                               ...dom("#newReplyPanel3 .thread-link-group")]
                             :[...dom('.indexlbtc')]),
              [newReplyList,att]=(isKfMobile
                                  ?[dom("#newReplyPanel1")]
                                  :[newReplyBoxes[0].parentNode]),
              [guKwBoxes,riseKwBoxes,sinkKwBoxes,riseUserBoxes,sinkUserBoxes,linkBoxes]=
              [[],[],[],[],[],[]],
              divisonRecent={title:"最近回复",count:0},
              divisonGugu={title:"咕咕镇",count:0}
        const getDivison=function({title,count}={title:"",count:0}){
            return (isKfMobile
                    ? createNode(`<li class="list-group-item thread-link-group"><a style="width: 100%;text-align: center;display: inline-block;">${title}【${count}】</a></li>`)
                    : createNode(`<div class="indexlbtc"><a style="text-align: center;user-select: none;text-decoration: none;">${title}【${count}】</a></div>`))
        }
        let guguCount=0,
            recentCount=newReplyBoxes.length,i=0
        forEach(newReplyBoxes,box=>{
            const link=box.children[0],
                  title=link.title.slice(1,-1).toLowerCase(),
                  user=link.attributes[isKfMobile?"data-author":"uname"].value
            if(removeUsers.includes(user)){
                --recentCount
                box.remove()
            }else if(kwInclude(removeKws,title)){
                --recentCount
                box.remove()
            }else if(riseUsers.includes(user)){
                --recentCount
                link.style.color="#f77"
                riseUserBoxes.push(box)
            }else if(kwInclude(riseKws,title)){
                --recentCount
                link.style.color="#e88"
                riseKwBoxes.push(box)
            }else if(sinkUsers.includes(user)){
                --recentCount
                sinkUserBoxes.push(box)
            }else if(kwInclude(sinkKws,title)){
                --recentCount
                sinkKwBoxes.push(box)
            }else if(kwInclude(guKws,title)){
                ++guguCount
                if(!isKfMobile){
                    box.querySelector('.indexlbtc_l').innerText="咕咕镇"
                }
                link.style.color="#97f"
                guKwBoxes.push(box)
            }else{
                linkBoxes.push(box)
            }
        })
        recentCount-=guguCount;
        ([divisonRecent.count,divisonGugu.count]=[recentCount,guguCount])
        if(guKwBoxes.length!==0){
            guKwBoxes.unshift(getDivison(divisonGugu))
        }
        riseKwBoxes.push(getDivison(divisonRecent))
        forEach([riseUserBoxes,riseKwBoxes,linkBoxes,sinkUserBoxes,sinkKwBoxes,guKwBoxes],list=>{
            forEach(list,box=>{
                newReplyList.append(box)
            })
        })
        function kwInclude(kwArr,title){
            for(let i=kwArr.length;i--;){
                if(title.includes(kwArr[i])){
                    return true
                }
            }
            return false
        }
    }
    function openSetting(e){
        if(!!dom(".kfrs_set_panel")){
            return
        }
        const PANEL_SETTING_DOMSTR=
`<div class="kfrs_set_panel"> <div class="kfrs_set_close">X</div> <form class="kfrs_set_form"> <div
class="kfrs_set_tips">每个用户名/关键字用<span class="kfrs_hl">英文逗号</span>间隔开，文本太长请自备编辑器</div> <div
class="kfrs_set_tips">点击<span class="kfrs_hl">提交</span>保存，该窗口可以<span class="kfrs_hl">拖动</span>，按右上角的X<span
class="kfrs_hl">取消更改</span></div> <div class="kfrs_set_tips">根据关键字操作主题：</div> <div class="kfrs_set_item"> <label
for="gukw">置底咕咕镇：</label> <input id="gukw"></div> <div class="kfrs_set_item"> <label for="risekw">置顶该主题：</label> <input
id="risekw"></div> <div class="kfrs_set_item"> <label for="sinkkw">置底该主题：</label> <input id="sinkkw"></div> <div
class="kfrs_set_item"> <label for="removekw">移除该主题：</label> <input id="removekw"></div> <div
class="kfrs_set_tips">根据用户名操纵主题：</div> <div class="kfrs_set_item"> <label for="riseuser">置顶该用户：</label> <input
id="riseuser"></div> <div class="kfrs_set_item"> <label for="sinkuser">置底该用户：</label> <input id="sinkuser"></div> <div
class="kfrs_set_item"> <label for="removeuser">移除该用户：</label> <input id="removeuser"></div> <button
class="kfrs_set_save">提交</button></form><style>.kfrs_hl{color:#f77}.kfrs_set_tips{font-size:14px}.kfrs_set_save{height:30px}
.kfrs_set_item{display:flex}.kfrs_set_item input{flex-grow:1}
.kfrs_set_form{display:flex;width:calc(100% - 60px);height:calc(100% - 60px);flex-direction:column;margin:30px;cursor:auto;font-size:18px;justify-content:space-between}
.kfrs_set_panel{position:fixed;width:500px;height:400px;background-color:white;left:calc(50% - 15em);top:calc(50% - 200px);cursor:all-scroll;z-index: 999;}
.kfrs_set_close{position:absolute;right:0;top:0;width:30px;height:30px;display:block;font-size:30px;line-height:1em;cursor:pointer;text-align:center;}</style></div>`
        document.body.append(createNode(PANEL_SETTING_DOMSTR))
        const closeBtn=dom('.kfrs_set_close'),
              saveBtn=dom('.kfrs_set_save'),
              panel=dom('.kfrs_set_panel'),
              DATA={bind:
                    {GU_KW:dom('#gukw'),
                     RISE_KW:dom('#risekw'),
                     SINK_KW:dom('#sinkkw'),
                     REMOVE_KW:dom('#removekw'),
                     RISE_USER:dom('#riseuser'),
                     SINK_USER:dom('#sinkuser'),
                     REMOVE_USER:dom('#removeuser')
                    },
                    data:CONFIG.PAGE_HOME_DATA,
                    toInput(configValue){
                        return configValue.join(',')
                    },
                    toConfig(inputValue){
                        return !!inputValue?inputValue.toLocaleLowerCase().split(","):[]
                    }
                   }
        load()
        addFocusEvent(panel)
        addDargEvent(panel)
        closeBtn.addEventListener("click",closePanel)
        saveBtn.addEventListener("click",save)
        function closePanel(e){
            panel.remove()
        }
        function load(){
            const bind=DATA.bind,data=DATA.data,toInput=DATA.toInput
            forEach(Object.keys(bind),key=>{
                bind[key].value=toInput(data[key])
            })
        }
        function save(){
            const bind=DATA.bind,data=DATA.data,toConfig=DATA.toConfig
            forEach(Object.keys(bind),key=>{
                data[key]=toConfig(bind[key].value)
            })
            saveConfig(CONFIG)
            closePanel(e)
        }
    }
    function loadConfig(){
        const DEFUALT_CONFIG={
            PAGE_HOME_DATA:{
                GU_KW:['咕','钴','菇','姑','沽','镇',"搞搞震","野怪",'韭菜','资本','星沙','争夺','kfol','gg'],
                RISE_KW:[],
                SINK_KW:[],
                REMOVE_KW:[],
                RISE_USER:[],
                SINK_USER:[],
                REMOVE_USER:[],
            },
            ENABLE:true
        },
              CONFIG_TEXT=localStorage[STORAGE_NAME]
        if(!CONFIG_TEXT){
            saveConfig(DEFUALT_CONFIG)
            return DEFUALT_CONFIG
        }
        let config=JSON.parse(CONFIG_TEXT)
        return config
    }
    function saveConfig(CONFIG){
        let CONFIG_TEXT=JSON.stringify(CONFIG)
        localStorage[STORAGE_NAME]=CONFIG_TEXT
        return true
    }
    function createNode(DOMStr='<div></div>'){
        let node=document.createRange().createContextualFragment(DOMStr)
        return node.firstChild
    }
    function addFocusEvent(elem){
        elem.addEventListener("pointerdown",e=>{
            const target=e.target
            if(target.tagName==="INPUT"){
                target.focus()
            }
        })
    }
    function addDargEvent(elem){
        elem.addEventListener("pointerdown",down)
        elem.addEventListener("touchstart",down)
        const [maxLeft,minLeft,maxTop,minTop]=
              [window.outerWidth-100,100-elem.clientWidth,window.outerHeight-100,100-elem.clientHeight]
        function down(e){
            let [cX,cY,eX,eY,eLeft,eTop]=[0,0,0,0,elem.offsetLeft,elem.offsetTop]

            switch(e.type){
                case "touchstart":{
                    if(e.target!==elem){
                        return
                    }
                    let touch=e.touches[0];
                    [cX,cY]=[touch.clientX,touch.clientY];
                    document.addEventListener("touchmove",move)
                    document.addEventListener("touchend",up)
                    break
                }
                case "pointerdown":{
                    if(e.target!==elem||e.buttons!==1){
                        return
                    }
                    [cX,cY]=[e.clientX,e.clientY];
                    document.addEventListener("pointermove",move)
                    document.addEventListener("pointerup",up)
                    break
                }
                default:{
                }
            }
            eX=cX-eLeft
            eY=cY-eTop
            e.preventDefault && e.preventDefault()
            elem.setCapture && elem.setCapture()
            function move(e){
                switch(e.type){
                    case "touchmove":{
                        let touch=e.touches[0];
                        [cX,cY]=[touch.clientX,touch.clientY];
                        break
                    }
                    case "pointermove":{
                        [cX,cY]=[e.clientX,e.clientY];
                        break
                    }
                    default:{
                    }
                }
                let left=cX-eX
                left=left>maxLeft?maxLeft:left
                left=left<minLeft?minLeft:left
                let top=cY-eY
                top=top>maxTop?maxTop:top
                top=top<minTop?minTop:top
                elem.style.left=left+"px"
                elem.style.top=top+"px"
            }
            function up(e){
                switch(e.type){
                    case "touchend":{
                        document.removeEventListener("touchmove",move)
                        document.removeEventListener("touchend",up)
                        break
                    }
                    case "pointerup":{
                        elem.releaseCapture && elem.releaseCapture()
                        document.removeEventListener("pointermove",move)
                        document.removeEventListener("pointerup",up)
                        break
                    }
                    default:{
                    }
                }
            }
        }
    }
})();

