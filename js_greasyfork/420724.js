// ==UserScript==
// @name   起点小说优化|AI续写追更|VIP章节免费阅读|支持本章说显示|全本TXT一键下载|游客书架
// @name:zh-TW   起點小說優化｜AI續寫追更｜VIP章節免費閱讀｜支持本章說顯示｜全本TXT一鍵下載｜遊客書架
// @version      1.5.4.2
// @description  提供多功能强大的起点小说网站优化插件，极大的增强起点中文网的使用体验：，支持免费阅读VIP付费章节，解锁本章说，保存阅读进度，还可以使用AI续写追更....
// @description:zh-TW  提供多功能強大的起點小說網站優化插件，極大地增強起點中文網的使用體驗：支持免費閱讀VIP付費章節，解鎖本章說，保存閱讀進度，還可以使用AI續寫追更……
// @author       JiGuang
// @namespace    www.xyde.net.cn
// @homepageURL  https://51coolplay.com
// @match        https://www.qidian.com/*
// @match        https://51coolplay.com/service/book/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/420724/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E4%BC%98%E5%8C%96%7CAI%E7%BB%AD%E5%86%99%E8%BF%BD%E6%9B%B4%7CVIP%E7%AB%A0%E8%8A%82%E5%85%8D%E8%B4%B9%E9%98%85%E8%AF%BB%7C%E6%94%AF%E6%8C%81%E6%9C%AC%E7%AB%A0%E8%AF%B4%E6%98%BE%E7%A4%BA%7C%E5%85%A8%E6%9C%ACTXT%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%7C%E6%B8%B8%E5%AE%A2%E4%B9%A6%E6%9E%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/420724/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E4%BC%98%E5%8C%96%7CAI%E7%BB%AD%E5%86%99%E8%BF%BD%E6%9B%B4%7CVIP%E7%AB%A0%E8%8A%82%E5%85%8D%E8%B4%B9%E9%98%85%E8%AF%BB%7C%E6%94%AF%E6%8C%81%E6%9C%AC%E7%AB%A0%E8%AF%B4%E6%98%BE%E7%A4%BA%7C%E5%85%A8%E6%9C%ACTXT%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%7C%E6%B8%B8%E5%AE%A2%E4%B9%A6%E6%9E%B6.meta.js
// ==/UserScript==

(function() {
    const default_config = `[{"id":5,"open":true,"name":"快捷设置","author":"admin","offical":true,"version":"1.0.4","description":"把页面上的“客户端”菜单改为弹出插件设置的快捷方式","code":"setTimeout(function() {document.querySelector('#r-app').innerText = '【插件设置】';document.querySelector('#r-app').onclick = ()=>{openSettings();document.querySelector('#r-menu > div:nth-child(7) > div > section').innerHTML = '点击面板进入设置';};}, 2000);"}]`
    // 取脚本版本
    function getVersion(){
        return '1.5.4.2'
    }
    function openSettings(){
        GM_openInTab('https://51coolplay.com/service/book/settings.php?v='+getVersion(), {active: !0})
    }
    // 首次更新到新版本的提示
    function firstTip(){
        if(GM_getValue('qdv_'+getVersion(),'') == ''){
            Swal.fire({
                title: "👏欢迎使用起点小说优化",
                text: "1.5.0新增了AI续写功能，会根据小说简介、目录剧情和当前文字生成一段后续的章节内容，可循环生成",
                icon: "success"
            })
            GM_setValue('qdv_'+getVersion(),'read_notice')
        }
    }
    // 脚本专用：读取配置到51
    function read51Config(){
        // 如果空，就默认装一下插件
        //console.log('config',GM_getValue('config',default_config))
        document.querySelector("#config").value = GM_getValue('config',default_config)
    }
    // 脚本专用：从51写配置
    function save51Config(){
        GM_setValue('config',document.querySelector("#config").value)
    }
    // 脚本专用：检查在线插件是否有更新
    async function check_online_plugin_update(){
        if([5,15,30,45].indexOf(new Date().getMinutes()) == -1){
            return
        }
        const flag = 'read_version_3je7s'
        let res = await request('https://51coolplay.com/service/book/check_plugin_update.php')
        let version = res.version
        let local_version = GM_getValue(flag,'3cc6c22a116cdce751563ffa6de3e390')
        //console.log(`v:${version},lv:${local_version}`)
        if(local_version != version){
            console.log('!=')
            // 仅展示一次更新提示，尽量不打扰用户
            GM_setValue(flag,version)
            let ele = document.createElement('div')
            ele.innerHTML = `<button id="_btn34" style="padding:5px;background-image: radial-gradient(circle 248px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%);box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);border-radius: 10px;color:white;position:fixed;z-index:99999;top:60px;right:20px;">在线插件有更新，点我查看</button>`
            document.body.appendChild(ele)
            document.querySelector("#_btn34").onclick = ()=>{
                openSettings()
                document.querySelector("#_btn34").style.display = 'none'
            }
        }
    }
    // 脚本专用：运行开启的配置
    async function readConfigOpen(is_read_page = true){
        await check_online_plugin_update()
        function add_float_menu(){
            let div = document.createElement('div')
            div.innerHTML = '<div style="padding:5px;z-index:99999;position:fixed;top:10px;right:20px;box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);border-radius: 10px;background-color:black;color:white;"><button id="b56">点我进入插件设置</button></div>'
            document.body.appendChild(div);
            document.querySelector("#b56").onclick = ()=>{
                openSettings()
            }
        }

        window.onLoad = ()=>{
            // 仅在阅读页面才提示没有开启插件
            if(location.href.indexOf('qidian.com/chapter')!= -1){
                notify('您在当前页面没有开启任何插件！！','error')
                add_float_menu()
            }
        }

        let codes = ''
        try{
            const config_str = GM_getValue('config',default_config)
            // console.log(config_str)
            const config_items = JSON.parse(config_str)
            // console.log(config_items)
            //筛选插件代码
            if(is_read_page){
                codes = config_items.filter(e => e.open).map(e => e.code).join(';')
            }else{
                //全局起点页面插件需要配置global=true，然后插件里自己设计路径检测
                codes = config_items.filter(e => e.open).filter(e => e.global).map(e => e.code).join(';')
            }
        }catch(err){
            console.warn('加载配置失败0',err)
            notify('加载配置失败，请去设置页面重新配置','error')
            add_float_menu()
            return
        }
        //注入插件
        console.log(codes)
        try{
            eval(codes)
            //执行启动函数（书源专用）注意，设置中的自定义插件会默认添加onload函数包裹
            onLoad()
            window.loaded = true
        }catch(err){
            console.warn('加载配置失败',err)
            notify('加载配置失败，请去设置页面检查是否启用了不兼容的插件','error')
            add_float_menu()
            return
        }
    }
    // 内置函数：读取页面书名
    function readBookName(){
        const bookNameElement = document.querySelector("#r-breadcrumbs > a.text-s-gray-900");
        if (bookNameElement) {
            // 使用正则表达式去掉括号内的内容
            const rawName = bookNameElement.innerText;
            const cleanedName = rawName.replace(/\（[^)]*\）/g, '').trim();
            console.log(`BookName:${cleanedName}`)
            return cleanedName;
        } else {
            return '未知'
            // 或者返回一个默认的名称，或者抛出错误，具体根据需求来定
        }
    }
    // 内置函数：读取章节名
    function readChapterName(){
        let ele = document.querySelector("#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > h1")
        if (ele) {
            let res = '' + ele.innerText
            res = res.replace(' ', '')
            console.log(`BookChapter:${res}`)
            return res
        }
        return '未知'
    }
    // 内置函数：读取正文
    function readContent(){
        return document.querySelector("#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > main").innerText
    }
    // 内置函数：将请求的url的html内容转化成document对象
async function parseDocFromAjax(method, url, encoding = 'utf-8') {
    console.log('请求url：', url);
    console.log('编码：' + encoding);
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method,
            url,
            responseType: 'arraybuffer', // 使用二进制响应类型
            onload: (res) => {
                // 解码响应内容为字符串
                let decoder = new TextDecoder(encoding); // 假设网页使用utf-8编码
                let htmlstr = decoder.decode(res.response);

                // 修复 某图片自动加载的问题
                htmlstr = htmlstr.replace(/http /g, "https");
                htmlstr = htmlstr.replace(/img src/g, "a url");
                htmlstr = htmlstr.replace(/onerror/g, "class");

                let htmldoc = document.createElement('html');
                htmldoc.innerHTML = htmlstr;
                resolve(htmldoc);
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}
    // 内置函数：axios/fetch风格的跨域请求
    async function request(url,data = null,method = 'GET'){
        console.log('请求url1：',url)
        return new Promise((resolve,reject) => {
          GM_xmlhttpRequest({
              method,
              url,
              data,
              onload:(res) => {
                //console.log('response1',res.response)
                resolve(JSON.parse(res.response))
              },
              onerror:(err) => {
                  reject(err)
              }
          })
      })
    }
    // 内置函数：加载本章说
    async function loadComment(){
        try{
            // 不加载已购买小说的本章说
            if(document.querySelector("#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > div.text-s-gray-500.mt-4px.text-bo4.flex.items-center.flex-wrap").innerText.indexOf('书源') == -1){
                return;
            }
        }catch(err){
            console.log('读取购买状态失败');
        }
        let cid = location.href.split('/')[location.href.split('/').length-2]
        let bid = location.href.split('/')[location.href.split('/').length-3]
        let csrfToken = document.cookie.split(';').find(e => e.indexOf("_csrfToken") != -1).split('=')[1];
        let url = `https://www.qidian.com/ajax/chapterReview/reviewSummary?_csrfToken=${csrfToken}&bookId=${bid}&chapterId=${cid}`;
        let res = await request(url);
        let content = document.querySelector("#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > main").innerHTML
        let txts = content.split('<br><br>')
        let contents = ''
        res.data.list.splice(0,1)
        txts.forEach((txt,index) =>{
            let review_unit = {}
            let segmentId = 1234
            try{
                review_unit = res.data.list.find(e=>e.segmentId == index + 1)
                segmentId = review_unit.segmentId
            }catch(err){
                console.warn('对应不上段落0')
            }
            let num = 0
            let hot_style = ''
            try{
                num = review_unit.reviewNum
                hot_style = review_unit.isHotSegment?'data-type="hot"':''
            }catch(err){
                console.warn('本章说异常，置为默认值')
            }
            let plus = `<p><span id="content-${segmentId}" class="content-${segmentId} content-text" data-count="${num}" data-index="${segmentId}">${txt}</span><span class="review" ${hot_style} data-index="${segmentId}"><span class="review-icon"></span><span class="review-count content-${segmentId}">${num}</span><!----></span></p>`
            if(num == 0){
                plus = `<p>${txt}</p>`
            }
            let comment_ui = `<div id="side-sheet-${segmentId}" style="display:none;box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);z-index:99999;max-height: 600px"class="bg-b-gray-50 noise-bg border-l border-outline-black-8 h-full w-400px absolute right-0"><button onclick="document.querySelector('#side-sheet-${segmentId}').style.display = 'none'"data-v-63a3e543=""class="bg-s-gray-100 w-28px h-28px rounded-1 flex items-center justify-center hover-24 active-10 p-0 absolute right-10px top-10px"><span class="icon-close text-20px text-s-gray-400"></span></button><div data-v-8a7b341d=""data-v-6c740737=""class="h-full flex flex-col"><div data-v-8a7b341d=""class="flex items-end pt-42px pb-10px px-32px <sm:px-16px <sm:py-15px <sm:border-b <sm:border-outline-black-8"><h2 data-v-8a7b341d=""class="font-medium text-rh4 text-s-gray-900 <sm:text-rh6">评论</h2><span data-v-8a7b341d=""class="text-s3 text-s-gray-500 ml-8px font-medium <sm:text-s4">${num}条</span></div><div data-v-8a7b341d=""class="flex-1 overflow-auto overscroll-contain"><div data-v-8a7b341d=""class="min-h-[calc(100%+20px)]"><!----><ul data-v-8a7b341d="">加载中...</ul><div data-v-8a7b341d=""class="h-80px"></div></div></div></div></div>`
            contents += plus
            contents += comment_ui

        })
        document.querySelector("#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > main").innerHTML = contents
        txts.forEach((item,index) =>{
            let review_unit = {}
            let segmentId = 1234
            try{
                review_unit = res.data.list.find(e=>e.segmentId == index + 1)
                segmentId = review_unit.segmentId
                document.querySelectorAll(".content-"+(segmentId)).forEach((item,index)=>{
                    item.addEventListener("click", async function() {
                // 显示本章说吧！（等到点击的时候再加载书评，省流）
                console.log('click'+(segmentId))
                let template_contents = ''
                //请求起点的书评API，自己动手，丰衣足食～
                let res = await request(`https://www.qidian.com/ajax/chapterReview/reviewList?bookId=${bid}&chapterId=${cid}&page=1&pageSize=20&segmentId=${segmentId}&type=2&_csrfToken=${document.cookie.split(';').find(e=>e.indexOf("_csrfToken")!=-1).split('=')[1]}`)
                res.data.list.forEach((item,index)=>{
                    let template_unit = `<li data-v-8a7b341d=""class="px-32px py-16px <sm:px-16px"><div><div class="group"><div class="flex items-center py-1px"><a target="_blank"href="//my.qidian.com/user/${item.userId}/"class="flex items-center min-w-0"><img class="w-28px h-28px mr-10px rounded-1 border border-outline-black-8"alt="cartilage"src="${item.avatar}"><div class="self-start pt-1px flex items-center"><span class="font-medium text-s-gray-500 text-s3 truncate mr-4px">${item.nickName}</span><!----></div></a><a target="_blank"href="https://jubao.yuewen.com/report/report?type=0&amp;id=208188071492190208&amp;appId=10&amp;areaId=1&amp;site=10&amp;extra=9069458404256003&amp;subType=7&amp;desc=1"class="group-hover:flex hidden ml-auto text-s-gray-500 text-s4 items-center font-medium flex-shrink-0"><span class="icon-warning text-16px mr-2px"></span>举报</a></div><div class="pl-38px"><p class="text-s-gray-900 text-16px leading-24px"><span class="inline-flex w-30px h-18px items-center justify-center overflow-hidden mr-4px align-text-bottom"><span class="whitespace-nowrap text-primary-red-500 text-20px font-medium h-32px flex items-center px-8px rounded-8px border border-primary-red-300 transform scale-50">精华</span></span><!----><span class="leading-24px whitespace-pre-wrap">${item.content}</span></p><!----><!----><div class="flex items-center mt-4px text-c12 text-s-gray-400"><span class="truncate"><span>${item.level}楼·</span>${item.createTime} ${item.ipAddress}</span><button class="flex-shrink-0 ml-4px mr-auto text-secondary-blue-500 font-medium h-28px">回复</button><button class="hidden flex-shrink-0 ml-8px items-center text-c12 text-s-gray-500 group-hover:flex h-28px"><span class="icon-thumb-up text-20px mr-2px down"></span>踩</button><button class="flex items-center flex-shrink-0 text-c12 h-28px ml-12px text-s-gray-500"><span class="icon-thumb-up text-20px mr-2px"></span>${item.likeCount}</button></div></div></div></div></li>`
                    template_contents += template_unit
                })
                document.querySelector("#side-sheet-"+(segmentId)).innerHTML = document.querySelector("#side-sheet-"+(segmentId)).innerHTML.replace('加载中...',template_contents)
                document.querySelector("#side-sheet-"+(segmentId)).style.display = 'block'
            });
                })
            }catch(err){
                console.warn('对应不上段落1')
            }
        })
    }
    //内置函数：与AI交流
    //api-key 可去https://openai-proxy.51coolplay.cc/ 或者 OpenAI官网 获取
    async function getAIReply(apikey = '',content = '',model = 'gpt-3.5-turbo'){

        return new Promise((resolve,reject)=>{
            if(apikey == '' || !apikey.startsWith('sk-')){
                reject('apikey不正确')
            }
            if(content == ''){
                reject('未输入内容')
            }
            GM_xmlhttpRequest({
		method: "POST",
		url: "https://openai-proxy.51coolplay.cc/v1/chat/completions",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + apikey
		},
		data: JSON.stringify({
			'model': model,
			'messages': [{
				'role': 'user',
				'content': content
			}],
			'temperature': 0.7
		}),
		onload: (response)=>{

            const obj = JSON.parse(response.responseText)
            console.log('ai :'+obj.choices[0].message.content)
            resolve(obj.choices[0].message.content)
		},
        onerror: (err)=>{
            reject(err)
        }
	});
        })
    }
    // 内置函数：写入正文
    async function writeContent(content = '',html = false){
        if(!html){
            document.querySelector("#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > main").innerText = content
        }else{
            document.querySelector("#reader-content > div.min-h-100vh.relative.z-1.bg-inherit > div > div.relative > div > main").innerHTML = content
        }
        // loadComment() 不要默认开启，预留给插件去开启，可能会有部分书源不支持，需要测试；我是拿读书阁测的OK
    }
    // 内置函数：是否已订阅
    function isBuy(){
        return readContent().length > 200
    }
    // 内置函数：计算文本相似度，返回0-1之间的数值，0.5以上可以采信
    function calculateTextSimilarity(text1, text2) {
    // 将文本转换成小写并去除空格
    text1 = text1.toLowerCase().replace(/\s/g, "");
    text2 = text2.toLowerCase().replace(/\s/g, "");
    // 计算两个文本的交集
    const intersection = text1.split("").filter(char => text2.includes(char));
    // 计算相似度
    const similarity = intersection.length / (text1.length + text2.length - intersection.length);
    return similarity;
}
    //内置函数：提示用户
    function notify(title = '操作成功', type = 'success', show = true) {
        console.log(title)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if (show)
            Toast.fire({
                icon: type,
                title: title
            })
        return Toast
    }
    // 配置网站就读取配置到网站上，1秒保存一次
    if(location.href.indexOf('51coolplay.com')!= -1){
        read51Config()
        setInterval(()=>{ save51Config() },1000)
    }
    // 应用网站就把配置运行好
    if(location.href.indexOf('qidian.com/chapter')!= -1){
        firstTip()
        readConfigOpen()
    }
    // 起点其他页面预留的坑位，计划更新：全书txt解析下载、游客云书架、移动端起点适配...
    else if(location.href.indexOf('qidian.com')!= -1){
        readConfigOpen(false)
    }
    GM_registerMenuCommand('⚙️打开设置', openSettings)
    GM_registerMenuCommand('♻️重置设置', ()=>{GM_deleteValue('config');notify('重置成功')})
})();