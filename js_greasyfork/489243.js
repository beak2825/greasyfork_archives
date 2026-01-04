// ==UserScript==
// @name         飞卢小说优化｜🔓解锁VIP章节
// @namespace    fl.xyde.net.cn
// @version      1.0.0
// @description  飞卢小说网更换免费书源观看
// @author       Jiguang
// @match        https://b.faloo.com/*
// @match        https://51coolplay.cc/service/book_fl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faloo.com
// @require https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require https://cdn.staticfile.org/jquery/2.0.3/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489243/%E9%A3%9E%E5%8D%A2%E5%B0%8F%E8%AF%B4%E4%BC%98%E5%8C%96%EF%BD%9C%F0%9F%94%93%E8%A7%A3%E9%94%81VIP%E7%AB%A0%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/489243/%E9%A3%9E%E5%8D%A2%E5%B0%8F%E8%AF%B4%E4%BC%98%E5%8C%96%EF%BD%9C%F0%9F%94%93%E8%A7%A3%E9%94%81VIP%E7%AB%A0%E8%8A%82.meta.js
// ==/UserScript==


(function() {
    const default_config = `[]`
    // 取脚本版本
    function getVersion(){
        return '1.0.0'
    }
    // 首次更新到新版本的提示
    function firstTip(){
        if(GM_getValue('flv_'+getVersion(),'') == ''){
            Swal.fire({
                title: "👏欢迎使用飞卢小说优化",
                text: "1.0版本全新起航",
                icon: "success"
            })
            GM_setValue('flv_'+getVersion(),'read_notice')
        }
    }
    // 脚本专用：读取配置到51
    function read51Config(){
        // 如果空，就默认装一下插件
        //console.log('config',GM_getValue('config',default_config))
        document.querySelector("#config").value = GM_getValue('configfl',default_config)
    }
    // 脚本专用：从51写配置
    function save51Config(){
        GM_setValue('configfl',document.querySelector("#config").value)
    }
    // 脚本专用：运行开启的配置
    function readConfigOpen(is_read_page = true){

        function add_float_menu(){
            let div = document.createElement('div')
            div.innerHTML = '<div style="position:fixed;top:10px;right:10px;"><button id="b56">点我进入插件设置</button></div>'
            document.body.appendChild(div);
            document.querySelector("#b56").onclick = ()=>{
                GM_openInTab('https://51coolplay.cc/service/book_fl/settings.php?v='+getVersion())
            }
        }

        window.onLoad = ()=>{
            notify('您在当前页面没有开启任何插件','error')
            add_float_menu()
        }

        let codes = ''
        try{
            const config_str = GM_getValue('configfl',default_config)
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
        }catch(err){
            console.warn('加载配置失败',err)
            notify('加载配置失败，请去设置页面检查是否启用了不兼容的插件','error')
            add_float_menu()
            return
        }
    }
    // 内置函数：读取页面书名
    function readBookName(){
        const bookNameElement = document.querySelector("#novelName");
        if (bookNameElement) {
            // 使用正则表达式去掉括号内的内容
            const rawName = bookNameElement.innerText.split(' ')[bookNameElement.innerText.split(' ').length - 1];
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
        let ele = document.querySelector("#center > div > div.WallPageBody > div.c_l_title");
        if (ele) {
            let res = '' + ele.innerText
            res = res.replaceAll(' ', '')
            res = res.replace(readBookName(),'')
            console.log(`BookChapter:${res}`)
            return res
        }
        return '未知'
    }
    // 内置函数：读取正文
    function readContent(){
        return document.querySelector("#center > div > div.WallPageBody > div.noveContent").innerText
    }
    // 内置函数：将请求的url的html内容转化成document对象
    async function parseDocFromAjax(method,url){
      console.log('请求url：',url)
      return new Promise((resolve,reject) => {
          GM_xmlhttpRequest({
              method,
              url,
              onload:(res) => {
                //console.log('response',res)
                  let htmldoc = document.createElement('html')
                  let htmlstr = res.responseText
                  // 修复 某图片自动加载的问题
                  htmlstr = htmlstr.replace(/http /g, "https")
                  htmlstr = htmlstr.replace(/img src/g, "a url")
                  htmlstr = htmlstr.replace(/onerror/g, "class")
                  htmldoc.innerHTML = htmlstr
                  resolve(htmldoc)
              },
              onerror:(err) => {
                  reject(err)
              }
          })
      })
    }
    // 内置函数：axios/fetch风格的跨域请求
    async function request(url,data = '',method = 'GET'){
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
    // 内置函数：写入正文
    async function writeContent(content = '',html = false){
        if(!html){
            document.querySelector("#center > div > div.WallPageBody > div.noveContent").innerText = content
        }else{
            document.querySelector("#center > div > div.WallPageBody > div.noveContent").innerHTML = content
        }
        // loadComment() 不要默认开启，预留给插件去开启，可能会有部分书源不支持，需要测试；我是拿读书阁测的OK
    }
    // 内置函数：是否已订阅
    function isBuy(){
        return readContent().length > 300
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
        alert(title)
    }
    // 配置网站就读取配置到网站上，1秒保存一次
    if(location.href.indexOf('51coolplay.cc')!= -1){
        read51Config()
        setInterval(()=>{ save51Config() },1000)
    }
    // 应用网站就把配置运行好
    if(location.href.indexOf('_')!= -1 && location.href.indexOf('.html')!= -1){
        firstTip()
        readConfigOpen()
    }
    // 其他页面预留的坑位，计划更新：全书txt解析下载、游客云书架、移动端起点适配...
    else if(location.href.indexOf('b.faloo.com')!= -1){
        readConfigOpen(false)
    }
    GM_registerMenuCommand('⚙️打开设置', ()=>{GM_openInTab('https://51coolplay.cc/service/book_fl/settings.php?v='+getVersion(), {active: !0})})
    GM_registerMenuCommand('♻️重置设置', ()=>{GM_deleteValue('config');notify('重置成功')})
})();