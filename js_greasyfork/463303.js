// ==UserScript==
// @name         haohaoxuexi
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  好好学习
// @license      MIT
// @author       qike
// @match        https://*.cn/videos/detail/*
// @grant        unsafeWindow
// @require      https://cdn.bootcdn.net/ajax/libs/awesome-notifications/3.1.3/index.var.min.js
// @resource     AWN_CSS https://cdn.bootcdn.net/ajax/libs/awesome-notifications/3.1.3/style.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463303/haohaoxuexi.user.js
// @updateURL https://update.greasyfork.org/scripts/463303/haohaoxuexi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 
    const awn_css = GM_getResourceText("AWN_CSS");
    GM_addStyle(awn_css);
    // 
    const doc = unsafeWindow.document
    const platform = 'bc1f55f482a2df2bede07c661806c4eb'
    const vcCheckInterval = 0;
    const uid = '000'
    const playerWatchInterval = 5000;
    // verify
    if(!doc.querySelector('#__nuxt')){
        return
    }
    // util
    function ts() {
        return new Date().getTime();
    }
    function getToken(){
        let cookies = document.cookie.split(';')
        for (var i = cookies.length - 1; i >= 0; i--) {
            let cookie = cookies[i].trim()
            let name = cookie.split('=')[0]
            let value = cookie.split('=')[1]
            if(name == 'portalToken'){
                return value
            }
        }
        return null
    }
    function getPlatform(){
        return platform
    }
    function getHost(){
        return location.host
    }
    function apiGet(api, referer) {
        let headers = {
            'authorization': getToken(),
            'platform': getPlatform(),
        }
        if(referer){
            headers.referer = referer
        }
        return fetch(api, {
            method: 'GET',
            headers: headers
        }).then((res)=>{
            return res.json()
        }).catch((a,b,c)=>{
            console.log(a,b,c)
        })
    }
    // logger
    const logger = {}
    logger.notifier = null
    logger.init = function(){
        logger.notifier = new AWN()
    }
    logger.info = function(msg, stay = false){
        // console.log(msg)
        logger.notifier.info(msg, stay ? {durations: {info: 0}} : undefined)
    }
    logger.err = function(msg, stay = false){
        // console.log(msg)
        logger.notifier.alert(msg, stay ? {durations: {alert: 0}} : undefined)
    }
    logger.success = function(msg, stay = false){
        // console.log(msg)
        logger.notifier.success(msg, stay ? {durations: {success: 0}} : undefined)
    }
    logger.debug = function(msg, stay = false){
        console.log(msg)
    }
    // player
    let player = {}
    player.dom = null
    player.play = function(){
        if(!player.isPlaying()){
            player.dom.muted = true
            player.dom.play()
        }
    }
    player.isPlaying = function(){
        return !player.dom.paused
    }
    player.isPlayDone = function(){
        return player.getPlayProgress() == 100
    }
    player.isLearnDone = function(){
        return player.getLearnProgress() == 100
    }
    player.getPlayProgress = function() {
        return Math.floor(player.dom.currentTime/player.dom.duration*100)
    }
    player.getLearnProgress = function() {
        let progress = doc.querySelector('.ant-progress-bg').style.width
        return progress.endsWith('%') ? progress.substr(0,progress.length-1) : -1
    }
    player.resetPlayProgress = function(){
        logger.info('从头开始播放')
        player.dom.currentTime = 0
    }

    player.startWatch = function(){
        logger.info('已开启自动播放')
        let wi = setInterval(async()=>{
            // if done
            if(player.isPlayDone()){
                logger.success('本课程学习已完成')
                clearInterval(wi)
                let next = await vlc.getNext()
                if(next){
                    vlc.toNext(next)
                }else{
                    logger.success("找不到下一个课程了，可能是都学完啦", true)
                }
                return;
            }
            // if paused
            if(player.isPlaying()){
                return;
            }
            player.play();
        }, playerWatchInterval)
    }
    player.init = function(){
        let initInterval = setInterval(()=>{
            let dom = doc.querySelector('video.dplayer-video')
            if(!dom){
                return
            }
            player.dom = dom
            clearInterval(initInterval)
            // 
            player.resetPlayProgress()
            // 
            player.startWatch()
        },500);
    }
    // video lesson center
    let vlc = {}
    vlc.getNextCheckInterval = 200
    vlc.nextSearchState = 'NOT_START'
    vlc.nextVideoLesson = null
    vlc.isNextVideoLessonFound = function(){
        return vlc.nextSearchState=='FOUND' && vlc.nextVideoLesson
    }
    vlc.getNext = async function(){
        return new Promise((resolve, reject)=>{
            let kk = setInterval(()=>{
                if(vlc.isNextVideoLessonFound()){
                    resolve(vlc.nextVideoLesson)
                }
            }, vlc.getNextCheckInterval)
        }).then((vl)=>{
            return vl
        })
    }
    vlc.get = async function(id, type = 0) {
        let result = await apiGet(`/gateway/resource/portal/video/info/info?uuid=${id}&bizType=${type}&t=${ts()}`, `https://${getHost()}/videos/detail/${id}?bizType=${type}`)
        if(result.code == 0){
            return result.data
        }else{
            return null
        }
    }
    vlc.page = async function(pageNo, pageSize = 20) {
        let result = await apiGet(`/gateway/data/index/video/page?field=onlineDate&sort=DESC&page=${pageNo}&limit=${pageSize}&t=${ts()}`, `https://${getHost()}/videos`)
        if(result.code == 0){
            return result.data
        }else{
            return null
        }
    }
    vlc.getCache = function(id){
        const key = `${uid}-vl-${id}`
        const value = localStorage.getItem(key)
        if(!value){
            return null
        }
        return JSON.parse(value)
    }
    vlc.putCache = function(id, vc){
        const key = `${uid}-vl-${id}`
        const value = JSON.stringify(vc)
        localStorage.setItem(key, value)
    }
    vlc.setNextVideoLesson = function(vl){
        vlc.nextVideoLesson = vl
        vlc.nextSearchState = 'FOUND'
        logger.success(`下一个课程已找到: ${vl.videoName}`, true)
    }
    vlc.getCurrentVideoLessonId = function(){
        const matches = location.href.match(/\/([\w\d]{32})\?/)
        return matches[1] 
    }
    vlc.findNext = async function(){
        logger.info("开始查找下一个课程...")
        let pageNo = 1
        while(true){
            let result = await vlc.page(pageNo)
            for (let i = 0; i < result.records.length; i++) {
                let vlItem = result.records[i]
                let vlid = vlItem.uuid
                let vl = vlc.getCache(vlid)
                if(!vl){
                    vl = await vlc.get(vlid)
                }
                if(!vl){
                    logger.err(`获取不到vl(id=${vlid})`)
                    continue
                }
                vl._type = vlItem.type
                vl._vlid = vlid
                if(vl.progress >= 100){
                    vlc.putCache(vlid, vl)
                    continue
                }
                // exclude current vl
                logger.debug(`${vlc.getCurrentVideoLessonId()} == ${vlid}`)
                if(vlc.getCurrentVideoLessonId() == vlid){
                    continue
                }
                // found
                vlc.setNextVideoLesson(vl)
                return
            }
            if(result.current >= result.pages){
                break
            }
            pageNo++
        }
    }
    vlc.toNext = function(vl){
        logger.info('即将前往下一个课程')
        location.href = `https://${getHost()}/videos/detail/${vl._vlid}?bizType=${vl._type}`
    }
    vlc.init = function(){
        vlc.findNext()
    }
    // init
    logger.init();
    player.init();
    vlc.init();
})();