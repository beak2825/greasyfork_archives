// ==UserScript==
// @name         主题筛选+版区计数+主题汇集
// @namespace    https://sstm.moe/
// @version      0.3
// @description  当前页显示主题按版区筛选+特定日期前各版区发布主题数统计+特定日期前主题全部塞到当前页面的功能哦
// @author       367ddd(叫我牛顿吧)
// @match        https://sstm.moe/profile/*/content/*
// @license MIT
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/504949/%E4%B8%BB%E9%A2%98%E7%AD%9B%E9%80%89%2B%E7%89%88%E5%8C%BA%E8%AE%A1%E6%95%B0%2B%E4%B8%BB%E9%A2%98%E6%B1%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/504949/%E4%B8%BB%E9%A2%98%E7%AD%9B%E9%80%89%2B%E7%89%88%E5%8C%BA%E8%AE%A1%E6%95%B0%2B%E4%B8%BB%E9%A2%98%E6%B1%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let userid = parseInt($('body').attr('data-pageid'));
    let allpages = 999;
    let inpage=1;
    let outpage=1;
    let saiinpage=1;
    let output ='\n';
    let setint=null;
    let selecting=0;
    let selectnum=0;
    var arealogs=new Object;
    var areas=new Array;
    var legenddate= new Date();
    const areastrings = [['自定义','动漫讨论区','漫区公告事务所','漫区旧案','新手保护区','综合事务区','裁判所','版主招募区','同盟简历区','同盟签到区','版主交流区','申请&测试区','活动栏','活动申请区','同萌动物园','节操の广场','同盟百态','贸易市场','市场仓库','三次元同好会','文学领地','涂鸦手绘','语音交流区','下限の深渊','同人游戏交流区','汉化交流区','魔物娘图鉴专区','天坑开发中心','雷神天制霸','Gal主题公园','Gal流光殿堂','Eushully学院', '一般向游戏交流区','网游区','手游区','FGO专区','桌游区','Gal梦幻伊甸'],
                         ['同人资源区','汉化资源','机翻资源'],
                         ['动漫资源区','新番连载','动画分享','动画里区','漫画世界','漫画里区','动漫自购','动漫自翻']];
    function findtopics(nowpage,nowuser){
        // 创建一个新的XMLHttpRequest对象
        var xhr = new XMLHttpRequest();
        var doc = null;
        // 配置HTTP请求
        xhr.open('GET', 'https://sstm.moe/profile/'+nowuser+'-*/content/page/'+nowpage+'/?type=forums_topic&sortby=start_date&sortdirection=desc', true);
        // 设置请求完成的处理函数
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // 请求成功，处理响应
                var response = this.response;
                // 解析HTML为DOM
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                // 现在你可以使用doc作为Document对象来操作DOM
                //console.log(doc.title); // 打印网页的标题
                if(doc==null){console.error()}
                if(nowpage==1){
                    allpages=parseInt($(doc).find('li.ipsPagination_last>a').attr('data-page'));
                    console.log('allpages='+allpages)
                }
                //var areaname=$(doc).find('[data-role="breadcrumbList"]>li')[2].innerText.trim()
                $(doc).find('ol[data-role="tableRows"]>li.ipsDataItem').each(function(){
                    let nowarea=$(this).find('.ipsDataItem_main>p>a')[1].innerText.trim()
                    let nowtitle=$(this).find('div.ipsDataItem_main>h4>span.ipsContained>a')[0].innerText.trim()
                    let nowlink=$(this).find('div.ipsDataItem_main>h4>span.ipsContained>a')[0].href.trim()
                    let nowtime=new Date($(this).find('time')[0].getAttribute('datetime'));
                    //console.log('now:'+nowtime+' leg:'+legenddate);
                    if(nowtime<=legenddate){
                        for(let num=0;num<areastrings[selectnum].length;num++){
                            if(nowarea.includes(areastrings[selectnum][num])==true){
                                output+='版区;'+nowarea+';标题;'+nowtitle+';链接;'+nowlink+';时间;'+$(this).find('time')[0].getAttribute('title')+'\n';
                            }
                        }
                        if(arealogs[nowarea]==undefined){
                            arealogs[nowarea]=1;
                        }else{
                            arealogs[nowarea]+=1;
                        }
                    }
                });
                inpage++;
            } else {
                // 请求失败，处理错误
                console.error(this.statusText);
            }
        };
        // 发送XHR请求
        xhr.send();
    }
    function setStyle(dom,options,fn){
        new Promise(function(resolve,reject){
            for (let key in options){
                dom.style[key] = options[key];
            }
            resolve();
        }).then(res => {
            if (fn) {
                fn()
            }
        }).catch(err => {
            console.log(err)
        })
    }
    function insertselect(){
        let btn = document.createElement("button");
        btn.id='myselectbutton';
        if(selecting==0){
            btn.textContent ="开始筛选"
        }else{
            btn.textContent ="停止筛选"
        }
        setStyle(btn,{
            width: '100px',
            height: '32px',
            borderRadius: '7px',
            background: 'palegreen',
            color:'#000000',
            fontSize:'inherit',
            textAlign: 'center',
            marginTop:'8px',
            marginBottom:'8px',
            marginLeft:'0px'
        })
        btn.addEventListener("click",function(){
            if(selecting==0){
                selecting=1;
                select();
                btn.textContent ="停止筛选"
            }else{
                btn.textContent ="开始筛选"
                selecting=0;
                unselect();
            }
        })
        btn.addEventListener("mouseenter",function(){
            //console.log('mousein')
            setStyle(btn,{background: '#999999', cursor: 'pointer'})
        })
        btn.addEventListener("mouseleave",function(){
            //console.log('mouseout')
            if(selecting==0){
                setStyle(btn,{background: 'palegreen'})
            }else{
                setStyle(btn,{background: 'red'})
            }
        })
        btn.addEventListener("mousedown",function(){
            //console.log('mousedown')
            setStyle(btn,{background: '#555555'})
        })
        btn.addEventListener("mouseup",function(){
            //console.log('mouseup')
            if(selecting==0){
                setStyle(btn,{background: 'palegreen'})
            }else{
                setStyle(btn,{background: 'red'})
            }
        })
        let selectarea = document.createElement("button")
        let selectnums = document.createElement("p")
        selectnums.textContent=areastrings[0][0]
        selectnums.style.margin='auto'
        selectnums.style.padding='initial'
        selectnums.style.width='max-content'
        selectnums.style.textAlign='center'
        selectnums.style.width='130px'
        selectarea.appendChild(selectnums)
        setStyle(selectarea,{
            position:'relative',
            marginTop:'8px',
            marginBottom:'8px',
            marginLeft:'8px',
            padding:'0',
            lineHeight:'30px',
            width: '130px',
            height: '32px',
            borderRadius: '7px',
            background: '#ffffff',
            color:'#000000',
            fontSize:'inherit',
            fontWeight:'inherit',
            fontStyle:'inherit',
            textAlign:'center'
        })
        let selectlist = document.createElement("ul");
        setStyle(selectlist,{
            position:'absolute',
            margin:'0',
            padding:'0',
            listStyle:'none',
            width: '130px',
            height: '256px',
            background: '#ffffff',
            color:'#000000',
            fontSize:'inherit',
            fontWeight:'inherit',
            fontStyle:'inherit',
            display:'none',
            overflow:'auto',
            scrollbarWidth:'thin',
            zIndex:'99'
        })
        let selectoptions = new Array();
        for(let num=0;num<areastrings.length;num++){
            selectoptions[num]=document.createElement("li");
            setStyle(selectoptions[num],{
                position:'relative',
                width: '130px',
                height: '32px',
                background: 'lavenderblush',
                color:'#000000',
                fontSize:'16px',
                fontWeight:'bold',
                display:'block',
                margin:'1px',
                borderWidth:'medium',
                borderStyle:'outset',
                zIndex:'100'
            })
            selectoptions[num].textContent=areastrings[num]
            if(areastrings[num].length>1){selectoptions[num].style.width='max-content'}
        }
        selectarea.appendChild(selectlist)
        for(let num=0;num<areastrings.length;num++){
            selectlist.appendChild(selectoptions[num])
            selectoptions[num].addEventListener("click",function(){
                selectnums.textContent=areastrings[num][0]
                selectnum=num;
                if(selecting!=0){
                    unselect();
                    select();
                }
                console.log(selectnum)
            })
            selectoptions[num].addEventListener("mousedown",function(){
                selectoptions[num].style.borderStyle='inset'
            })
            selectoptions[num].addEventListener("mouseup",function(){
                selectoptions[num].style.borderStyle='outset'
            })
            selectoptions[num].addEventListener("mouseenter",function(){
                selectoptions[num].style.background='#888888'
            })
            selectoptions[num].addEventListener("mouseleave",function(){
                selectoptions[num].style.background='lavenderblush'
                selectoptions[num].style.borderStyle='outset'
            })
        }
        selectarea.addEventListener("click",function(){
            selectlist.style.display='block'
        })
        selectarea.addEventListener("mouseenter",function(){
            selectarea.style.background='#cccccc'
        })
        selectarea.addEventListener("mouseleave",function(){
            selectarea.style.background='#ffffff'
        })
        selectlist.addEventListener("mouseleave",function(){
            selectlist.style.background='#ffffff'
            selectlist.style.display='none'
            //console.log('out of list')
        })
        btn.addEventListener("click",function(){selectlist.style.display='none'})
        $('<div class="ipsButtonBar ipsPad_half ipsClearfix ipsClear" id="myselectplace"></div>').insertAfter($('div[data-role="tablePagination"]'))
        $('#myselectplace').append(btn);
        $('#myselectplace').append(selectarea);
        $('#myselectplace').append($('<button id="mysumtopicbutton" style="width: 100px; height: 32px; border-radius: 7px; background: palegreen; color: rgb(0, 0, 0); font-size: inherit; text-align: center;  margin-left: 5px;margin-right: 5px; cursor: pointer;">开始统计</button>'));
        $('#myselectplace').append($('<input id="legenddate" style="width:90px;">'));
        $('#myselectplace').append($('<button id="mysaibaobutton" style="width: 100px; height: 32px; border-radius: 7px; background: palegreen; color: rgb(0, 0, 0); font-size: inherit; text-align: center;  margin-left: 5px;margin-right: 5px; cursor: pointer;">开始塞爆</button>'));
        $('#myselectplace').append($('<p id="sumarea"></p>'));
        $('#mysumtopicbutton')[0].addEventListener("click",sumbutton)
        $('#mysaibaobutton')[0].addEventListener("click",saibao)
        $('#legenddate')[0].value='2077-01-01';
        btn.click();
        setStyle(btn,{background: 'red'})
    }
    function saibao(){
        legenddate=new Date($('#legenddate')[0].value)
        if(legenddate*0!=0){alert('日期格式错误');return;}
        allpages=parseInt($('li.ipsPagination_last>a').attr('data-page'));
        saitopic();
        $('#mysaibaobutton')[0].innerText='塞爆中';
        $('#mysaibaobutton')[0].removeEventListener("click",saibao)
    }
    function sumbutton(){
        legenddate=new Date($('#legenddate')[0].value)
        if(legenddate*0!=0){alert('日期格式错误');return;}
        sumtopic();
        $('#mysumtopicbutton')[0].innerText='统计中';
        $('#mysumtopicbutton')[0].removeEventListener("click",sumbutton)
    }
    function select(){
        let divtop = $('ol[data-role="tableRows"]>li')
        let num = 0
        for(num=0;num<divtop.length;num++){
            let sign=false;
            for(let num2=0;num2<areastrings[selectnum].length;num2++){
                if($(divtop[num]).find('.ipsDataItem_main>p>a')[1].innerText.trim().includes(areastrings[selectnum][num2])==true){
                    sign=true;
                    //console.log('yes')
                    break
                }else{
                    //console.log('nah')
                }
            }
            if(!sign){
                divtop[num].style.visibility = "hidden"
                divtop[num].style.height='0px'
            }else{
                divtop[num].style.visibility = "visible"
                divtop[num].style.height='inherit'
            }
            //console.log(divtop[num].children[1].textContent.trim())
            console.log('block')
        }
    }
    function unselect(){
        let divtop = $('ol[data-role="tableRows"]>li')
        let num = 0
        for(num=0;num<divtop.length;num++){
            divtop[num].style.visibility = "visible"
            divtop[num].style.height='inherit'
            //console.log(divtop[num].children[1].textContent.trim())
            console.log('unblock')
        }
    }
    // MutationObserver 配置
    var observerConfig = {
        childList: true,
        subtree: false,
        attributes: false,
        characterData: false
    };
    // 创建一个 MutationObserver 实例并传入回调函数
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //console.log('DOM 发生变化:', mutation);
            if(selecting!=0){
                console.log('auto block')
                select()
            }
        });
    });
    var inserted=0;
    inserted=setInterval(function(){
        if($('ol[data-role="tableRows"]').length>0){
            clearInterval(inserted);
            insertselect();
            observer.observe($('ol[data-role="tableRows"]')[0], observerConfig);
        }
    },200)
    window.addEventListener('beforeunload', function() {
        observer.disconnect();
    });
    function saisaisai(page){
        // 创建一个新的XMLHttpRequest对象
        var xhr = new XMLHttpRequest();
        var doc = null;
        // 配置HTTP请求
        xhr.open('GET', 'https://sstm.moe/profile/'+userid+'-*/content/page/'+page+'/?type=forums_topic&sortby=start_date&sortdirection=desc', true);
        // 设置请求完成的处理函数
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                // 请求成功，处理响应
                var response = this.response;
                // 解析HTML为DOM
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                // 现在你可以使用doc作为Document对象来操作DOM
                //console.log(doc.title); // 打印网页的标题
                if(doc==null){console.error()}
                //var areaname=$(doc).find('[data-role="breadcrumbList"]>li')[2].innerText.trim()
                $(doc).find('ol[data-role="tableRows"]>li.ipsDataItem').each(function(){
                    let nowtime=new Date($(this).find('time')[0].getAttribute('datetime'));
                    //console.log('now:'+nowtime+' leg:'+legenddate);
                    if(nowtime<=legenddate){
                        $('ol[data-role="tableRows"]')[0].append(this);
                    }
                });
                saiinpage++;
            } else {
                // 请求失败，处理错误
                console.error(this.statusText);
            }
        };
        // 发送XHR请求
        xhr.send();
    }
    function saitopic(){
        saiinpage=1;
        let saioutpage=1;
        $('ol[data-role="tableRows"]>li.ipsDataItem').each(function(){
            this.remove();
        });
        let saitimer = setInterval(function(){
            if(saiinpage>allpages){
                clearInterval(saitimer);
                alert('所有主题加载完毕');
                $('#mysaibaobutton')[0].innerText='塞爆了';
            }
            if(saiinpage==saioutpage&&saiinpage<=allpages){
                saisaisai(saiinpage);saioutpage++
            }
        },200);
    }
    function sumtopic(){
        output ='';
        inpage=1;
        outpage=1;
        setint= setInterval(function(){
            if(inpage>allpages){
                clearInterval(setint);
                alert('所有主题统计完毕');
                let sortedCounts = Object.entries(arealogs).sort((a, b) => b[1] - a[1]);
                sortedCounts = sortedCounts.sort(function(a,b){
                    for(let num=0;num<areastrings[1].length;num++){
                        if(b[0].includes(areastrings[1][num])==true){
                            return(-1)
                        }
                    }
                    for(let num=0;num<areastrings[2].length;num++){
                        if(b[0].includes(areastrings[2][num])==true){
                            return(-1)
                        }
                    }
                    return(1)

                })
                for(let num=0;num<sortedCounts.length;num++){
                    $('#sumarea')[0].innerText+=sortedCounts[num][0]+':'+sortedCounts[num][1]+'\n';
                }
                $('#mysumtopicbutton')[0].innerText='统计完成';
                console.log(output);
            }
            if(inpage==outpage&&inpage<=allpages){
                findtopics(inpage,userid);outpage++
            }
        },200);
    }
    // Your code here...
})();