// ==UserScript==
// @name         Discuz BBS AutoReply
// @namespace    https://greasyfork.org/zh-CN/users/208194-lz0211
// @version      2.30
// @description  论坛快速回复脚本
// @include      *://*game-*
// @include      *://*thread*
// @include      *://*forum.php*
// @include      *://bbs.*
// @include      *://www.lltxt.com/*
// @include      *://www.paipai.fm/*
// @include      *://muchong.com/*
// @include      *://www.3dmgame.com/*
// @exclude      *://*action=newthread*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/373807/Discuz%20BBS%20AutoReply.user.js
// @updateURL https://update.greasyfork.org/scripts/373807/Discuz%20BBS%20AutoReply.meta.js
// ==/UserScript==
(function(sites){
    sites = Object.assign({},sites, {
        'muchong.com':{
            formSelector:'#postcomment',
            inputSelector:'#replymessage',
            submitSelector:'#replysubmit',
            postBoxSelector:'.forum_Reply',
            smilieSelector:'td[align="right"]',
        },
        'www.3dmgame.com':{
            formSelector:'#Comments_wrap',
            inputSelector:'#Ct_content',
            submitSelector:'.poswrap > .postbtn',
            postBoxSelector:'.Cs_postwrap'
        },
        'www.galgamezd.com':{
            postBoxSelector:'.postcontent'
        },
        'www.lkong.net':{
            postBoxSelector:'.hasfsl'
        },
        'www.lltxt.com':{
            formSelector:'form[name="FORM"]',
            inputSelector:'textarea[name="atc_content"]',
            submitSelector:'input[name="Submit"]',
            postBoxSelector:'.f_one:nth-child(2)',
            smileName:'faces',
            addSmiles:function(obj){for(var k in obj) push.apply(expressions,obj[k].map(function(s){return '[s:'+s+']'}))}
        },
        'www.paipai.fm':{
            inherit:'www.lltxt.com',
            submitSelector:'button[name="Submit"]',
            postBoxSelector:'tr[class="vt"] > td:nth-child(2)',
        },
    });
    var url = document.URL,
        //styleList = ['color','float','margin','width','height','background','text-align','outline','border','border-radius','font','padding','line-height','cursor','position','top','left','right','bottom','vertical-align'],
        name = 'default',
        key = 'defaut_reply',
        formSelector = '#fastpostform',
        inputSelector = '#fastpostmessage',
        submitSelector = '#fastpostsubmit',
        postBoxSelector = '.plc',
        smilieSelector = '#fastsmiliesdiv',
        editorSelector = '#fastposteditor',
        smileName = 'smilies_array',
        expressions = ['。', '！', '……', '@~~~', '#^_^#', 'O(∩_∩)O~', '(*^__^*)', '└(^o^)┘', '‘(*>﹏<*)′ ~', '(@^_^@)~', '^_^o ~~~', 'O(∩_∩)O~∑', '(*@ο@*)', '((o(^_ ^)o))', '~@^_^@~ ', '(*∩_∩*)', '(～ o ～)~zZ ', '=^_^=', '~^o^~', '(*@?@*)', '*@_@*'],
        messages = [['不错，支持卤煮', '顶楼主', '必须顶起','给楼主顶个赞', '先回复一下', '顶一下'], ['多谢楼主分享', '支持楼主分享', '感谢楼主分享'], ['期待更好的作品', '希望楼主发更多好帖'], ['后排围观','伪前排','围观'], ['路过打酱油的', '伸手党路过','我只是来打酱油的','我只是来水经验的'], ['留名','火钳刘明'], ['好贴，先收藏了', '抱走收藏，不客气了', 'Mark一下'], ['潜水冒泡不说话','我就随便看看不说话','咸鱼出来冒个泡'], ['我只是挽尊的','挽尊'], '楼主好人', '楼主加油~~', '好人一生平安','卤煮好厉害', '楼主辛苦了', '楼主写的真棒', '向楼主学习', '静静地看着楼主','看帖必回帖', '貌似还不够十五字', '摸摸楼主的头', '看个标题就走了', '我轻轻地来正如我轻轻地走'],
        interval = 15000,
        push = [].push,
        styleFn = function(){},
        formDOM,inputDOM,submitDOM
    //随机返回数组元素
    function randomSelect(array){
        return array[Math.floor(Math.random() * array.length)]
    }
    //生成随机回复
    function radomReplyText(){
        var a = randomSelect(messages)
        var b = randomSelect(messages)
        var c = randomSelect(expressions)
        while (a === b) {
            b = randomSelect(messages)
        }
        if(Array.isArray(a)){
            a = randomSelect(a)
        }
        if(Array.isArray(b)){
            b = randomSelect(b)
        }
        var text = a + '，' + b + c
        inputDOM.value = inputDOM.innerText = text;
    }
    function now(){
        return Date.now()
    }
    function reply(){
        if (localStorage.getItem(key) < now() - interval || !localStorage.getItem(key)) {
            localStorage.setItem(key, now())
        } else {
            console.log("距离上次回复时间不足15秒，请勿频繁灌水，以免被封！")
            alert("距离上次回复时间不足15秒，请勿频繁灌水，以免被封！")
        }
    }
    //初始化
    function getConfig(name){
        var site = sites[name]
        if(!site.inherit) return site
        return Object.assign({},getConfig(site.inherit),site)
    }
    function init(){
        var reg,site,k,randomBtn
        for(k in sites){
            site = getConfig(k)
            if(!site) break
            reg = new RegExp(site.match || k)
            if(reg.test(url)){
                name = k
                key = name + '_key'
                formSelector = site.formSelector || formSelector
                inputSelector = site.inputSelector || inputSelector
                submitSelector = site.submitSelector || submitSelector
                postBoxSelector = site.postBoxSelector || postBoxSelector
                smilieSelector = site.smilieSelector || smilieSelector
                editorSelector = site.editorSelector || editorSelector
                styleFn = site.style || styleFn
                smileName = site.smileName || smileName
                addSmiles = site.addSmiles || addSmiles
                interval = site.interval || interval
                Array.isArray(site.expressions) && push.apply(expressions,site.expressions)
                Array.isArray(site.messages) && push.apply(messages,site.messages)
                break
            }
        }
        formDOM = document.querySelector(formSelector)
        inputDOM = document.querySelector(inputSelector)
        submitDOM = document.querySelector(submitSelector)
        randomBtn = submitDOM.cloneNode()
        if(submitDOM.innerHTML.match('<strong>')){
            randomBtn.innerHTML = '<strong>随机回复</strong>'
        }else{
            randomBtn.innerHTML = '随机回复'
        }
        //randomBtn.className = ''
        //let btnStyle = window.getComputedStyle(submitDOM)
        //randomBtn.style.cssText = styleList.map(function(x){return x + ':' + btnStyle.getPropertyValue(x) + ';'}).join('')
        randomBtn.value = '随机回复'
        randomBtn.type = 'button'
        randomBtn.name = 'random'
        randomBtn.style.display = 'inline'
        randomBtn.onclick = radomReplyText
        submitDOM.style.display = 'inline'
        submitDOM.parentNode.insertBefore(randomBtn,submitDOM)
        submitDOM.addEventListener('click',reply)
        //console.log(formDOM,inputDOM,submitDOM,submitDOM.parentNode)
    }
    //获取站点表情库
    function smiles(times){
        times = times || 0
        if(times > 20) return
        if(new Function('return typeof '+smileName)() === 'undefined') return setTimeout(function(){smiles(++times)},500)
        new Function('addSmiles','addSmiles('+smileName+')')(addSmiles)
    }
    //添加到随机库
    function addSmiles(smilies_array){
        if(!Array.isArray(smilies_array)) return
        smilies_array.forEach(function(group){
            if(!Array.isArray(group)) return
            group.forEach(function(page){
                if(!Array.isArray(page)) return
                push.apply(expressions,page.map(function(arr){return arr[1]}))
            })
        })
    }
    //修改回复框样式
    function changeStyle(){
        var plc = formDOM.querySelector(postBoxSelector),
            smilie = formDOM.querySelector(smilieSelector),
            editor = formDOM.querySelector(editorSelector),
            plcStyle = plc && plc.style.cssText,
            smilieStyle = smilie && smilie.style.cssText,
            editorStyle = editor && editor.style.cssText,
            state = 0
        var scrollDOM = document.createElement('div')
        //console.log(plc,smilie,editor,plc.style.width)
        function switchStyle(){
            if(state){
                state = 0
                smilie && (smilie.style.cssText = smilieStyle)
                editor && (editor.style.cssText = editorStyle)
                plc && (plc.style.cssText = plcStyle)
            }else{
                state = 1
                smilie && (smilie.style.cssText = 'display:none')
                editor && (editor.style.cssText = 'margin-right:40px')
                plc && (plc.style.padding = '0px')
                plc && (plc.style.cssText = 'background-color:#fff;position:fixed;bottom:0px;right:0px;padding:5px;z-index:99;margin-right:0px;width:'+(editor||plc).clientWidth+'px;height:'+plc.clientHeight+'px')
            }
        }
        document.body.appendChild(scrollDOM)
        scrollDOM.style.cssText = 'left:auto;right:0px;visibility:visible;position:fixed;bottom:40px;display:block;margin:-30px 0 0 2px;width:40px;background:#f4f4f4;border:1px #cdcdcd solid;border-radius:3px;border-top:0;cursor:pointer;word-wrap:break-word;'
        scrollDOM.innerHTML = '<a title="快速回复" style="display:block;width:30px;height:24px;padding:3px 5px;line-height:12px;text-align:center;color:#787878;text-decoration:none;border-top:1px #cdcdcd solid;background:none;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="height:20px;margin-top:2px"><path d="M850,80H150C73,80,10,143,10,220v420c0,77,63,140,140,140h70v140h70l140-140h420c77,0,140-63,140-140V220C990,143,927,80,850,80z M290,500c-42,0-70-28-70-70c0-42,28-70,70-70c42,0,70,28,70,70C360,472,332,500,290,500z M500,500c-42,0-70-28-70-70c0-42,28-70,70-70c42,0,70,28,70,70C570,472,542,500,500,500z M710,500c-42,0-70-28-70-70c0-42,28-70,70-70s70,28,70,70C780,472,752,500,710,500z" style="fill:#a9b7b7"></path></svg></a><a title="返回顶部" onclick="window.scrollTo(0,0)" style="display:block;width:30px;height:24px;padding:3px 5px;line-height:12px;text-align:center;color:#787878;text-decoration:none;border-top:1px #cdcdcd solid;background:none;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="height:20px;margin-top:2px"><path d="M319.3,783.7h361.1v77.3H319.3V783.7z" style="fill:#a9b7b7"></path><path d="M319.3,938.4h361.1V990H319.3V938.4z" style="fill:#a9b7b7"></path><path d="M319.3,216.3h361.1v490H319.3V216.3z" style="fill:#a9b7b7"></path><path d="M500,10l438.4,464.4H61.5L500,10z" style="fill:#a9b7b7"></path></svg></a></div>'
        scrollDOM.style.zIndex = '999'
        var fastReply = scrollDOM.querySelector('a[title=快速回复]')
        fastReply.href = 'javascript:;'
        fastReply.onclick = switchStyle
        //switchStyle()
    }
    init()
    smiles(0)
    changeStyle()
    styleFn()
})()