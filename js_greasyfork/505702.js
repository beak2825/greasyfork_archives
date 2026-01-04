// ==UserScript==
// @name         举报集合
// @namespace    https://sstm.moe/profile/197610-367ddd/
// @version      0.4
// @description  对新举报按钮，在新举报页中一次性展现所有新举报，举报按版区筛选的集合
// @author       367ddd(叫我牛顿吧)
// @license MIT
// @match        https://sstm.moe
// @match        https://sstm.moe/*
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505702/%E4%B8%BE%E6%8A%A5%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/505702/%E4%B8%BE%E6%8A%A5%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let selectlock=1;//筛选开关，1为开，0为关
    let addnewlock=1;//新举报按钮开关
    let collectlock=1;//展现所有新举报开关
    function reportselect() {
        'use strict';

        function getCookie(cname)
        {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++)
            {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) return c.substring(name.length,c.length);
            }
            return "none";
        }
        function setCookie(cname,cvalue)
        {
            document.cookie = cname + "=" + cvalue + "; ";
        }
        var areaid =0
        var lastarea='lastarea'
        var autoblock =0
        var lastauto='lastauto'
        if(getCookie(lastarea).includes('none')){areaid=0;setCookie(lastarea,0);}else{areaid=getCookie(lastarea);}
        if(getCookie(lastauto).includes('none')){autoblock=0;setCookie(lastauto,0);}else{autoblock=getCookie(lastauto);}
        const areastrings = [['全部'],
                             ['自定义','版区1','版区2','文件'],
                             ['动漫讨论区','漫区公告事务所','漫区旧案'],
                             ['新手保护区'],
                             ['综合事务区','裁判所'],
                             ['版主招募区','同盟简历区','同盟签到区','版主交流区','申请&测试区'],
                             ['活动栏','活动申请区','同萌动物园'],
                             ['节操の广场','同盟百态'],
                             ['贸易市场','市场仓库'],
                             ['三次元同好会'],
                             ['文学领地'],
                             ['涂鸦手绘'],
                             ['语音交流区'],
                             ['下限の深渊'],
                             ['同人游戏交流区'],
                             ['同人资源区'],
                             ['汉化交流区'],
                             ['汉化资源','机翻资源'],
                             ['魔物娘图鉴专区'],
                             ['天坑开发中心'],
                             ['雷神天制霸'],
                             ['Gal主题公园','Gal流光殿堂'],
                             ['Eushully学院'],
                             ['Gal梦幻伊甸'],
                             ['一般向游戏交流区'],
                             ['网游区'],
                             ['手游区'],
                             ['FGO专区'],
                             ['桌游区'],
                             ['动漫资源区','新番连载','动画分享','动画里区','漫画世界','漫画里区','动漫自购']];

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
            })}
        // MutationObserver 配置
        var observerConfig = {
            childList: true,
            subtree: false,
            attributes: false,
            characterData: true
        };

        // 创建一个 MutationObserver 实例并传入回调函数
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                console.log('DOM 发生变化:', mutation);
                if(autoblock!=0){
                    console.log('auto block')
                    block()
                }
            });
        });
        function block(){
            let divtop = document.getElementsByClassName("ipsDataItem_meta ipsType_light ipsType_blendLinks")
            let num = 0
            for(num=0;num<divtop.length;num++){
                let sign=false;
                for(let num2=0;num2<areastrings[areaid].length;num2++){
                    if(areaid==0||divtop[num].children[1].textContent.trim().includes(areastrings[areaid][num2])==true){
                        sign=true;
                        //console.log('yes')
                        break
                    }else{
                        //console.log('nah')
                    }
                }
                if(!sign){
                    divtop[num].parentElement.parentElement.style.display = "none"
                    divtop[num].parentElement.parentElement.style.height='0px'
                }else{
                    divtop[num].parentElement.parentElement.style.display = "inherit"
                    divtop[num].parentElement.parentElement.style.height='inherit'
                }
                //console.log(divtop[num].children[1].textContent.trim())
                console.log('block')
            }
        }
        function unblock(){
            let divtop = document.getElementsByClassName("ipsDataItem_meta ipsType_light ipsType_blendLinks")
            let num = 0
            for(num=0;num<divtop.length;num++){
                divtop[num].parentElement.parentElement.style.display = "inherit"
                divtop[num].parentElement.parentElement.style.height='inherit'
                //console.log(divtop[num].children[1].textContent.trim())
                console.log('unblock')
            }
        }
        let btn = document.createElement("button");
        if(autoblock==0){
            btn.textContent ="筛选按钮"
        }else{
            btn.textContent ="筛选已启动"
        }
        setStyle(btn,{
            width: '100px',
            height: '32px',
            borderRadius: '7px',
            background: 'palegreen',
            color:'#000000',
            fontSize:'inherit',
            textAlign: 'center',
            marginLeft:'auto'
        })
        btn.addEventListener("click",function(){
            if(autoblock==0){
                autoblock=1
                btn.textContent ="筛选已启动"
                block()
            }else{
                btn.textContent ="筛选按钮"
                unblock()
                autoblock=0
            }
            setCookie(lastauto,autoblock)
        })
        btn.addEventListener("mouseenter",function(){
            //console.log('mousein')
            setStyle(btn,{background: '#999999', cursor: 'pointer'})
        })
        btn.addEventListener("mouseleave",function(){
            //console.log('mouseout')
            if(autoblock==0){
                setStyle(btn,{background: 'palegreen'})
            }else{
                setStyle(btn,{background: 'red'})
            }
        })
        btn.addEventListener("mousedown",function(){
            console.log('mousedown')
            setStyle(btn,{background: '#555555'})
        })
        btn.addEventListener("mouseup",function(){
            console.log('mouseup')
            if(autoblock==0){
                setStyle(btn,{background: 'palegreen'})
            }else{
                setStyle(btn,{background: 'red'})
            }
        })
        let selectarea = document.createElement("button")
        let selectnums = document.createElement("p")

        selectnums.style.margin='auto'
        selectnums.style.padding='initial'
        selectnums.style.width='max-content'
        selectnums.style.textAlign='center'
        selectnums.style.width='130px'
        selectarea.appendChild(selectnums)
        setStyle(selectarea,{
            position:'relative',
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
                areaid=num
                setCookie(lastarea,num)
                selectnums.textContent=areastrings[num][0]
                if(autoblock!=0){
                    block()
                }
                console.log(num)
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
            console.log('out of list')
        })
        btn.addEventListener("click",function(){selectlist.style.display='none'})
        window.addEventListener("resize",function(){console.log('resize')})
        /*
        const jubao =document.getElementsByClassName("ipsPos_right ipsResponsive_hidePhone")
        jubao[0].insertBefore(btn,jubao[0].children[0])
        */
        selectnums.textContent=areastrings[areaid][0]
        console.log('huh?')
        let jubao =$(".ipsType_sectionTitle.ipsType_reset.ipsClear")
        let mainarea = $('<div style="display:"flex";alignItems:"center";" ></div>')
        mainarea.append(btn)
        mainarea.append(selectarea)
        mainarea.insertAfter(jubao);


        if(autoblock!=0){
            console.log('auto block')
            block()
            setStyle(btn,{background: 'red'})
        }else{
            setStyle(btn,{background: 'palegreen'})
        }
        // Your code here...
        var originalOpen = XMLHttpRequest.prototype.open;
        var originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url; // 保存请求的URL
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            // 监听readystatechange事件
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) { // 请求完成
                    console.log('XHR 请求完成:');
                    console.log('URL:', this._url);
                    console.log('状态:', this.status);
                    //console.log('响应:', this.responseText);
                    startObservingDomChanges();

                }
            });


            function startObservingDomChanges() {
                // 开始观察DOM 变化
                observer.observe(document.getElementsByClassName("ipsDataList ipsClear")[0], observerConfig);
            }

            // 选择何时停止观察，例如在页面卸载时
            window.addEventListener('beforeunload', function() {
                observer.disconnect();
            });
            return originalSend.apply(this, arguments);
        };
    }
    function addnewreport(){
        let newjubao = document.createElement("a")
        newjubao.style.marginRight='10%'
        newjubao.href='https://sstm.moe/modcp/reports/?filter=filter_report_status_1'
        newjubao.innerHTML='<i class="fa fa-bars"></i> 新举报的内容'
        const footbar =document.getElementsByClassName("ipsMenu_footerBar ipsType_center")
        footbar[2].insertBefore(newjubao,footbar[2].firstChild)
        console.log('new report inserted')
    }
    function reportcollect() {
        'use strict';
        let allpages=parseInt($('li.ipsPagination_last>a').attr('data-page'));
        let mother=$('ol[data-role="tableRows"]');
        let inpage=1;
        let outpage=1;
        let setint=null;
        $(mother).find('li.ipsDataItem').each(function(){
            this.remove();
        });
        function autosubmit(page){
            // 创建一个新的XMLHttpRequest对象
            var xhr = new XMLHttpRequest();
            var doc = null;
            // 配置HTTP请求
            xhr.open('GET', 'https://sstm.moe/modcp/reports/?filter=filter_report_status_1&page='+page, true);
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
                    if(doc==null){console.error();}
                    //var areaname=$(doc).find('[data-role="breadcrumbList"]>li')[2].innerText.trim()
                    $(doc).find('ol[data-role="tableRows"]>li.ipsDataItem').each(function(){
                        mother.append(this);
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
        setint= setInterval(function(){if(inpage>allpages){clearInterval(setint);alert('所有新举报加载完毕');}if(inpage==outpage&&inpage<=allpages){autosubmit(inpage);outpage++;}},200);
    }
    if(selectlock===1&&window.location.href.includes('sstm.moe/modcp/reports')){
        reportselect();
    }
    if(addnewlock===1&&window.location.href.includes('sstm.moe')){
        addnewreport();
    }
    if(collectlock===1&&window.location.href.includes('sstm.moe/modcp/reports/?filter=filter_report_status_1')){
        console.log('report_collect')
        reportcollect();
    }
})();