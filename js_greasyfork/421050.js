// ==UserScript==
// @name    Bilibili 显示视频分区、av号等
// @namespace https://space.bilibili.com/517723/
// @version    0.09
// @description 在视频下方显示 分区、av 号、bv 号、cid、分P标题、动态，点击cid可打开弹幕文件，并醒目显示tag中的分区。也可安装为 Bilibili Evolved v2 组件。
// @author    僠儖僲
// @license 	MPL-2
// @match    https://www.bilibili.com/video/*
// @icon    https://www.bilibili.com/favicon.ico
// @compatible firefox Firefox115-ESR
// @compatible edge Edge129
// @noframes
// @grant    GM_addStyle
// @run-at    document-start
// @downloadURL https://update.greasyfork.org/scripts/421050/Bilibili%20%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%E5%88%86%E5%8C%BA%E3%80%81av%E5%8F%B7%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/421050/Bilibili%20%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%E5%88%86%E5%8C%BA%E3%80%81av%E5%8F%B7%E7%AD%89.meta.js
// ==/UserScript==
(()=>{
    'use strict';
    const options={
        isAppend:{
            displayName:'在简介下方',
            defaultValue:!1
        },
        tname_color:{
            displayName:'分区TAG颜色',
            defaultValue:'#00a1d6',color:true
        }
    }

    const root=typeof unsafeWindow==="undefined"?window:unsafeWindow,etp=EventTarget.prototype
    const _on=etp.addEventListener,_off=etp.removeEventListener
    const once=(t,s,o=!1,cb)=>new Promise(ok=>{_on.call(t,s,cb=e=>{_off.call(t,s,cb,o);ok(e)},o)})
    const ready=once(document,'DOMContentLoaded')
    var addStyle
    const main=({
        isAppend=options.isAppend.defaultValue,
        tname_color=options.tname_color.defaultValue
    })=>{
        const id=crypto.getRandomValues(new root.BigUint64Array(1))[0].toString(36)
        const list=['详细信息','分P标题','动态']
        const tick0_5=cb=>setTimeout(cb,500)
        const wait=(cb,tick=requestAnimationFrame,next)=>new Promise((ok,reject)=>{
            (next=v=>{try{(v=cb())?ok(v):tick(next)}catch(e){reject(e)}})()
        }),waitElem=select=>wait(()=>document.querySelector(select),tick0_5)
        const eventStopPropagation=Function.prototype.call.bind(Event.prototype.stopPropagation)
        const vmp=ready.then(e=>waitElem('#app')).then(el=>wait(()=>el.__vue__))
        vmp.then(vm=>{root.__BILIBILI_VIDEO_GLOBAL_VIEWMODEL__=vm})
        const getEl=(value,key='title',parent)=>{
            var el=document.querySelector(`.basic-desc-info[${key}="${value}"][data-shower-${id}]`)
            if(!el){
                el=document.createElement('div')
                el.className='basic-desc-info'
                el.setAttribute(key,value)
                el.setAttribute(`data-shower-${id}`,location.href)
                el.addEventListener('click',eventStopPropagation,!0)
                parent[isAppend?'append':'prepend'](el)
            }
            return el
        }
        var curPartQuery='',curPartData
        const copyrightMap=new Map([[1,'自制'],[2,'转载']])
        const map={
            ['详细信息'](el,{tname,tname_v2,aid,bvid,copyright}){
                const cid=curPartData?.cid
                copyright=copyrightMap.get(copyright)??'未知'
                const list=[
                    `<span title="分区">${tname}</span>`,
                    `<span title="分区 v2">${tname_v2}</span>`,
                    `<span title="视频类型[${[...copyrightMap.values()].join(',')}]">${copyright}</span>`,
                    `<a href="/video/av${aid}/${curPartQuery}" target="_blank">av${aid}</a>`,
                    `<a href="/video/${bvid}/${curPartQuery}" target="_blank">${bvid}</a>`,
                    cid?`\
<a\
 title="点此打开弹幕文件"\
 href="https://comment.bilibili.com/${cid}.xml"\
 data-href="https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}"\
 target="_blank" rel="noreferrer"\
>cid:${cid}</a>\
`:''
                ]
                el.innerHTML=list.join('\u3000')
            },
            ['分P标题'](el,{title},self){
                const partTitle=curPartData?.part
                el.title=`${self}${partTitle!==title?partTitle?'':'为空':'与标题相同'}`
                el.innerText=partTitle||'\u200B'
            },
            ['动态'](el,{dynamic},self){
                el.style.cssText='border-top:1px solid #e5e9f0;margin-top:16px;padding-top:16px'
                el.title=dynamic?self:`${self}为空`
                el.innerText=dynamic||'\u200B'
            }
        }
        const inject=(data)=>{
            data??=root.__INITIAL_STATE__.videoData
            const {pages}=data
            const m=location.search.match(/(?<=[?&])p=(\d+)(?=&|$)/)
            curPartQuery=m!=null?`?${m[0]}`:''
            curPartData=pages[(m?.[1]??'1')-1]??pages[0]
            const parent=document.querySelector('.video-desc-container')
            getEl('分割线','data-title',parent).style.cssText='height:1px;background-color:#e5e9f0;margin:16px 0px'
            list[isAppend?'reduce':'reduceRight']((acc,cur)=>{map[cur](getEl(cur,'data-title',parent),data,cur)},void 0)
            parent.style.display=''
        }
        vmp.then(vm=>{
            vm.$store.watch(state=>state.videoData,data=>{setTimeout(()=>{inject(data)},0)})
            inject()
            addStyle?.(`\
[data-shower-${id}], [data-shower-${id}] a{color:var(--text1)}
`)
        })
    }
    const name='show-video-division-aid'
    const evolved=()=>({
        author:{
            name:'僠儖僲',
            link:'https://space.bilibili.com/517723/'
        },
        name,displayName:"显示视频分区、av号等",
        description:{
            "zh-CN":"在视频下方显示 分区、av 号、bv 号、cid、分P标题、动态，点击cid可打开弹幕文件，并醒目显示tag中的分区"
        },
        entry({coreApis,metadata,settings:{options}}){
            addStyle=coreApis.style.addStyle
            main(options)
        },
        tags:[componentsTags.utils],
        urlInclude:['https://www.bilibili.com/video/'],
        options,
    })
    "object"==typeof exports?"object"==typeof module?
        module.exports=evolved():exports[name]=evolved():(addStyle=GM_addStyle,main({}))
})()