// ==UserScript==
// @name         成信大抢课
// @namespace    成信大抢课
// @version      0.15
// @description  成信大首个抢课脚本
// @author       shiouhoo
// @include     *://jwgl*cuit*edu*cn*/eams/stdElectCourse!defaultPage.action*
// @require    https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @license     GPL License

// @downloadURL https://update.greasyfork.org/scripts/432487/%E6%88%90%E4%BF%A1%E5%A4%A7%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/432487/%E6%88%90%E4%BF%A1%E5%A4%A7%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements,hh */
(function() {
    'use strict';
    var optition = {
        method: '2', //1:指定课程 , 2:指定类型
        courses: ['从欧几里德到人工智能',''],//指定课程时生效,需请保留引号，如：["",""]
        type:['艺术与审美','创新创业教育'], //指定类型时生效,
        isOnlyOnline: true, //是否只抢网课，指定类型时生效
        electTime:'13:00',//抢课时间
    }
    optition.timeLoop = []
    optition.reMainTime = ''
    optition.visibility = true
    optition.selectedCourse = []
    optition.selectedCourseNumber = 0
    optition.selectedTypeNumber = 0
    function sleep(d){
        return new Promise((resolve)=>{
            setTimeout(()=>{resolve()},d)
        })
    }
    unsafeWindow.confirm =async function(e) {
        (async ()=>{
            await sleep(500)
        })()
        if(/是否提交/.test(e)){
            return true
        }
    }
    unsafeWindow.alert =async function(e) {
        await sleep(500)
        console.log('提示:'+e)
        if(optition.method === '1'){
            optition.selectedCourseNumber += 1
            if(optition.selectedCourseNumber == optition.selectedCourse.length){selectedOneCourseSuccess();return }
            setTimeout(()=>{
                selectOneCourse(optition.selectedCourse[optition.selectedCourseNumber])
            },10)
        } else if(optition.method === '2'){
            optition.selectedCourseNumber += 1
            if(optition.selectedCourseNumber == optition.selectedCourse[optition.selectedTypeNumber].length){
                optition.selectedCourseNumber += 1
                optition.selectedCourseNumbe = 0
            }
            if(optition.selectedTypeNumber >= optition.selectedCourse.length){
                selectedOneCourseSuccess()
                return
            }
            if(optition.selectedCourse[optition.selectedTypeNumber].length != 0){
                setTimeout(()=>{
                    selectOneCourse(optition.selectedCourse[optition.selectedTypeNumber][optition.selectedCourseNumber])
                },10)
            }
        }
        return true
    }
    function hh(){
        $('body').append(`
	  <div class='myAlert'>
	  <div class='title'>成信大自动抢课</div>
	  <div class='content'>欢迎使用成信大抢课助手，本插件旨在帮助成信学子选得更好的网课，仅用于学习，切勿用于不法用途，如果你有更好的提议，请联系我的QQ：3489970384（点击标题可收起）</div>
	  <div class='setting'>
		<div class='settingOne'>
		<span>抢课类型</span>
		<select style='padding: 3px 8px;'>
		<option value ="1">指定课程</option>
        <option value ="2">指定类型</option>
	    </select><span>&nbsp;**指定课程抢课时间：${optition.electTime}</span></div>
		<div class='settingTwo'>
		<span style='margin-right:1em'>课程名</span>
        <span style="width:236px">
		<input id='courseInputOne'></input><span style='color:red;display:none'>&nbsp;&nbsp;*不可为空</span>
		<input id='courseInputTwo' style='display: block;margin-top:10px'></input>
        <span style='color:red;display:none;float: right;margin-top: -22px;'>&nbsp;&nbsp;*不可为空</span></span>
	    </div></div>
		<div class='running'>
			<div></div>
		</div>
		<div class='bottom'><span class='cancel'>暂停</span><span class='okey'>确定</span>
	</div></div>`)
        $('.myAlert').css({
            'position': 'fixed',
            'z-index': '9999',
            'width': '400px',
            'top': '5%',
            'left': '30px',
            'text-align': 'center',
            'border-radius': '8px',
            'flex-direction': 'column',
            'background': 'rgb(241,241,241)',
        })
        $('.myAlert .title').css({
            'background': 'rgb(216,237,246)',
            'font-size': '22px',
            'padding':'5px 0',
            'user-select': 'none',
        })
        $('.myAlert .content').css({
            'background': 'rgb(241,241,241)',
            'text-align': 'left',
            'text-indent':'2em',
            'padding-left':'4px',
        })
        $('.myAlert .setting').css({
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'baseline',
            'margin': '1em',
            'text-align':'left'
        })
        $('.myAlert .setting>div').css({
            'margin': '5px 0',
        })
        $('.myAlert .settingTwo').css({
            'display': 'flex',
        })
        $('.myAlert .running').css({
            'display': 'none',
            'flex-direction': 'column',
            'align-items': 'baseline',
            'margin': '1em',
            'text-align':'left'
        })
        $('.myAlert .bottom').css({
            'width':'100%',
            'background': 'rgb(241,241,241)',
            'margin':'5px 0',
            'display':'flex',
            'justify-content': 'space-evenly',
        })
        $('.myAlert .bottom .cancel').css({
            'font-size':'24px',
            'padding': '0 14px',
            'border': '1px rgb(216,237,246) solid',
            'border-radius': '7px',
            'color': 'white',
            'background': 'rgb(134,203,234)',
            'cursor':'pointer',
        })
        $('.myAlert .bottom .okey').css({
            'font-size':'24px',
            'padding': '0 14px',
            'border': '1px rgb(216,237,246) solid',
            'border-radius': '7px',
            'color': 'white',
            'background': 'rgb(134,203,234)',
            'cursor':'pointer',
        })
        console.log('抢课助手开始运行')
        $('.myAlert .settingOne option').each(function(){
            if($(this).val()===optition.method){
                $(this).attr("selected", true)
            }else{
                $(this).attr("selected", false)
            }
        })
        if(optition.method === '0'){
            $('.myAlert .settingTwo').css('display','none')
        }else if(optition.method === '1'){
            $('.myAlert #courseInputOne').attr('value',optition.courses[0])
            $('.myAlert #courseInputTwo').attr('value',optition.courses[1])
            $('.myAlert .settingTwo span:nth-child(1)').text('课程名')
            $('.myAlert .settingTwo').css('display','flex')
        }else if(optition.method === '2'){
            $('.myAlert #courseInputOne').attr('value',optition.type[0])
            $('.myAlert #courseInputTwo').attr('value',optition.type[1])
            $('.myAlert .settingTwo span:nth-child(1)').text('课程类型')
            $('.myAlert #courseInputOne').next().css('display','none')
            $('.myAlert #courseInputTwo').next().css('display','none')
            $('.myAlert .settingTwo').css('display','flex')
        }
        $('.myAlert .title').click(()=>{
            if(optition.visibility){
                $('.myAlert').css('visibility','hidden')
                $('.myAlert .title').css('visibility','visible')
            }else{
                $('.myAlert').css('visibility','visible')
            }
            optition.visibility = !optition.visibility
        })
        $('.myAlert .settingOne select').change(()=>{
            optition.method = $('.myAlert .settingOne select').val()
            if(optition.method === '0'){
                $('.myAlert .settingTwo').css('display','none')
            }else if(optition.method === '1'){
                $('.myAlert #courseInputOne').attr('value',optition.courses[0])
                $('.myAlert #courseInputTwo').attr('value',optition.courses[1])
                $('.myAlert .settingTwo span:nth-child(1)').text('课程名')
                $('.myAlert .settingTwo').css('display','flex')
            }else if(optition.method === '2'){
                $('.myAlert #courseInputOne').attr('value',optition.type[0])
                $('.myAlert #courseInputTwo').attr('value',optition.type[1])
                $('.myAlert #courseInputOne').next().css('display','none')
                $('.myAlert #courseInputTwo').next().css('display','none')
                $('.myAlert .settingTwo span:nth-child(1)').text('课程类型')
                $('.myAlert .settingTwo').css('display','flex')
            }
            GM_setValue("runningDetail",$('.myAlert').prop("outerHTML"))
        })
        $('.myAlert #courseInputOne').keyup((event)=>{
            if(event.keyCode == "13"){
                $('.myAlert #courseInputTwo').focus()
            }
        })
        $('.myAlert #courseInputTwo').keyup((event)=>{
            if(event.keyCode == "13"){
                $('.myAlert .bottom .okey').click()
            }
        })
        $('.myAlert .bottom .okey').click(startRun)
        $('.myAlert .bottom .cancel').click(()=>{
            for(var each in optition.timeLoop){
                clearInterval(optition.timeLoop[each]);
            }
            optition.selectedCourse = []
            optition.selectedCourseNumber = 0
            optition.selectedTypeNumber = 0
            $('.myAlert .bottom .okey').click(startRun)
            $('.myAlert #courseInputOne').prop("disabled",false)
            $('.myAlert #courseInputTwo').prop("disabled",false)
            $('.myAlert .settingOne select').prop("disabled",false)
            $('.myAlert .running').html('<div></div>')
        })

    }
    function getRemainTime(){
        $('.myAlert .running').css('display','flex')
        let temp = optition.electTime.split(':')
        optition.timeLoop[optition.timeLoop.length] = setInterval(()=>{
            let h = new Date().getHours()
            let m = new Date().getMinutes()
            let s = new Date().getSeconds()
            let leftTime = temp[0]*3600 + temp[1]*60 - h *3600 - m * 60 - s
            if(leftTime > 0){
                h = Math.floor(leftTime/60/60%24);
                m = Math.floor(leftTime/60%60);
                s = Math.floor(leftTime%60);
                optition.reMainTime = `${h}:${m}:${s}`
                $('.myAlert .running div:nth-child(1)').text(`开始运行... 倒计时：${optition.reMainTime}`)
            }else{
                console.log('开始抢课')
                $('.myAlert .running div:nth-child(1)').text('正在抢课中...')
                for(var each in optition.timeLoop){
                    clearInterval(optition.timeLoop[each]);
                }
                setTimeout(()=>{electing()},0)
            }
        },310)
    }
    function startRun(){
        $('.myAlert .running').html('<div></div>')
        if(optition.method === '1'){
            ElectByAssigned()
        }else if(optition.method === '0'){
            ElectByLoop()
        }else if(optition.method === '2'){
            ElectByType()
        }
    }
    function verifyInput(){
        let flag = [0,0]
        if ($('.myAlert #courseInputOne').val().length === 0){
            $('.myAlert #courseInputOne').next().css('display','inline')
            flag[0] = 0
        }else{
            $('.myAlert #courseInputOne').next().css('display','none')
            flag[0] = 1
        }
        if ($('.myAlert #courseInputTwo').val().length === 0){
            $('.myAlert #courseInputTwo').next().css('display','inline')
            flag[1] = 0
        }else{
            $('.myAlert #courseInputTwo').next().css('display','none')
            flag[1] = 1
        }
        if(flag[0] && flag[1]){
            return true
        }else{
            return false
        }
    }
    function ElectByLoop(){

    }
    function ElectByType(){
        optition.type[0] = $('.myAlert #courseInputOne').val().trim()
        optition.type[1] = $('.myAlert #courseInputTwo').val().trim()
        $('.myAlert #courseInputOne').attr('value',optition.type[0])
        $('.myAlert #courseInputTwo').attr('value',optition.type[1])
        $('.myAlert #courseInputOne').prop("disabled",'disabled')
        $('.myAlert #courseInputTwo').prop("disabled",'disabled')
        $('.myAlert .settingOne select').prop("disabled",'disabled')
        $('.myAlert .bottom .okey').unbind('click')
        getRemainTime()
    }
    function ElectByAssigned(){
        optition.courses[0] = $('.myAlert #courseInputOne').val().trim()
        optition.courses[1] = $('.myAlert #courseInputTwo').val().trim()
        $('.myAlert #courseInputOne').attr('value',optition.courses[0])
        $('.myAlert #courseInputTwo').attr('value',optition.courses[1])
        $('.myAlert #courseInputOne').prop("disabled",'disabled')
        $('.myAlert #courseInputTwo').prop("disabled",'disabled')
        $('.myAlert .settingOne select').prop("disabled",'disabled')
        $('.myAlert .bottom .okey').unbind('click')
        getRemainTime()
    }
    function electing(){
        $('#cboxContent').bind('DOMNodeInserted',SelectCourse)
        if(optition.method === '0'){
            //待完成
        }else if(optition.method === '1'){
            let code
            for(let i of optition.courses){
                if(i.trim().length == 0){continue }
                code = $(`tr:contains(${i})`).filter(".electGridTr").filter(function(){
                    return $('a',this).text() == '选课'
                })
                if(code.length == 0){
                    $('.myAlert .running').append(`<div>《${i}》没有找到</div>`)
                }else{
                    code.each((index,item)=>{
                        optition.selectedCourse.push(item)
                    })
                }
            }
            if(optition.selectedCourse.length != 0){
                setTimeout(()=>{
                    selectOneCourse(optition.selectedCourse[optition.selectedCourseNumber])
                },0)
            }else{
                selectedOneCourseSuccess()
            }
        }else if(optition.method === '2'){
            let code = null
            let code2 = null
            for(let i of optition.type){
                if(i.trim().length!=0){
                    code = $(`tr:contains(${i})`).filter('.electGridTr').filter(function(){
                        return $('td:nth-child(14)',this).text().length==0 && $('a',this).text() == '选课'
                    })
                    if(!optition.isOnlyOnline){
                        code2= $(`tr:contains(${i})`).filter('.electGridTr').filter(function(){
                            return $('td:nth-child(14)',this).text().length!=0 && $('a',this).text() == '选课'
                        })
                    }
                    let temp = []
                    code.each((index,item)=>{
                        temp[index] = item
                    })
                    if(code2!=null){
                        code2.each((index,item)=>{
                            temp[temp.length+index] = item
                        })
                    }
                    optition.selectedCourse[optition.selectedCourse.length] = temp
                }
            }
            if(optition.selectedCourse[0].length != 0){
                setTimeout(()=>{
                    selectOneCourse(optition.selectedCourse[0][optition.selectedCourseNumber])
                },0)
            }else if(optition.selectedCourse[1].length != 0){
                setTimeout(()=>{
                    optition.selectedTypeNumber += 1
                    selectOneCourse(optition.selectedCourse[1][optition.selectedCourseNumber])
                },0)
            }else{
                selectedOneCourseSuccess()
            }
        }
    }
    async function SelectCourse(e){
        let code = $('table div',e.target)
        if(code.length != 0){
            console.log('结果:'+code.text())
            await sleep(500)
            if(optition.method === '1'){
                $('.myAlert .running').append(code.text())
                optition.selectedCourseNumber += 1
                if(optition.selectedCourseNumber == optition.selectedCourse.length){selectedOneCourseSuccess();return }
                setTimeout(()=>{
                    selectOneCourse(optition.selectedCourse[optition.selectedCourseNumber])
                },0)
            } else if(optition.method === '2'){
                $('.myAlert .running').append(`<div>${optition.type[optition.selectedTypeNumber]}:${code.text()}</div>`)
                if(/失败/.test(code.text())){
                    optition.selectedCourseNumber += 1
                    if(optition.selectedCourseNumber == optition.selectedCourse[optition.selectedTypeNumber].length){
                        optition.selectedTypeNumber += 1
                        optition.selectedCourseNumbe = 0
                    }
                }else{
                    optition.selectedTypeNumber += 1
                    optition.selectedCourseNumber = 0
                }
                if(optition.selectedTypeNumber >= optition.selectedCourse.length){
                    selectedOneCourseSuccess()
                    return
                }
                if(optition.selectedCourse[optition.selectedTypeNumber].length != 0){
                    setTimeout(()=>{
                        selectOneCourse(optition.selectedCourse[optition.selectedTypeNumber][optition.selectedCourseNumber])
                    },0)
                }
            }
        }
    }
    function selectedOneCourseSuccess(){
        optition.selectedCourse = []
        optition.selectedCourseNumber = 0
        optition.selectedTypeNumber = 0
        $('.myAlert .running').append(`<div>已完成</div>`)
        $('.myAlert .bottom .okey').click(startRun)
        $('.myAlert #courseInputOne').prop("disabled",false)
        $('.myAlert #courseInputTwo').prop("disabled",false)
        $('.myAlert .settingOne select').prop("disabled",false)
    }
    function selectOneCourse(item){
        if(item == undefined){
            console.log('没有找到此门课程')
        }
        let code = $(item).find('a')
        let t = code.text()
        let name = $('td:nth-child(7)',item).text()
        if(t=='选课'){
            let temp = $('td:nth-child(15)',item).text().split("/")
            if(Number(temp[0])<Number(temp[1])){
                code.click()
            }else{
                $('.myAlert .running').append(`<div>${$('td:nth-child(6)',item).text()}:《${name}》已满员</div>`)
                if(optition.method === '1'){
                    optition.selectedCourseNumber += 1
                    if(optition.selectedCourseNumber == optition.selectedCourse.length){selectedOneCourseSuccess();return }
                    setTimeout(()=>{
                        selectOneCourse(optition.selectedCourse[optition.selectedCourseNumber])
                    },0)

                } else if(optition.method === '2'){
                    optition.selectedCourseNumber += 1
                    if(optition.selectedCourseNumber == optition.selectedCourse[optition.selectedTypeNumber].length){
                        optition.selectedCourseNumber = 0
                        optition.selectedTypeNumber += 1
                    }
                    if(optition.selectedTypeNumber >= optition.selectedCourse.length){
                        selectedOneCourseSuccess()
                        return
                    }
                    setTimeout(()=>{
                        selectOneCourse(optition.selectedCourse[optition.selectedTypeNumber][optition.selectedCourseNumber])
                    },0)
                }
            }
        }
    }
    hh()
})();