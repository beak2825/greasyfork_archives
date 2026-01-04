// ==UserScript==
// @name        9dm综合优化
// @namespace   Violentmonkey Scripts
// @match       *://www.9dmsgame.net/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @homepageURL https://greasyfork.org/zh-CN/scripts/491902-9dm%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96
// @homepage    https://greasyfork.org/zh-CN/scripts/491902-9dm%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96
// @version     1.04
// @author      lazy cat
// @description 2024/3/14 16:35:09
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/491902/9dm%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491902/9dm%E7%BB%BC%E5%90%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
// 添加透明样式
function add_transparent_css(...selector) {
    // 储存搜索时间
    document.querySelector('button[class="pn pnc"]')?.addEventListener('click', ()=>{
        GM_setValue('search_time', parseInt(new Date().getTime() / 1000))})
    if (!document.URL.includes('search.php')) return
    let new_css = ''
    selector.forEach((e) => {
        new_css += e + ' {background-color: transparent !important; opacity: 0 !important; user-select: none !important; pointer-events: none !important; pointer-events: none !important;width: 0 !important;height: 0 !important;}\n'
    })
    let style = document.createElement('style')
    style.textContent = new_css
    document.head.appendChild(style)
    // 储存搜索时间
    document.querySelector('#scform_submit')?.addEventListener('click', ()=>{
        GM_setValue('search_time', parseInt(new Date().getTime() / 1000))})
}

// response取出文本
async function get_re_text(response, encoding='GBK'){
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder(encoding);
    const text = decoder.decode(buffer);
    return text
}

// 发送请求
async function get(_url) {
    const _response = await fetch(_url, {
        method: 'GET',
        credentials: 'include' })
    if (_response.status !== 200) {
        console.log('发送请求出现错误', 'url: ', _url, '\n', _response)
        return 'error'
    }
    return await get_re_text(_response)
}

// 获取回复验证码
async function get_reply_code() {
    const hash_text = await get('http://www.9dmsgame.net/forum.php?mod=ajax&action=checkpostrule&ac=reply&inajax=1&ajaxtarget=vfastpostseccheck')
    if (hash_text === 'error') return 144514
    const hash_rage = /secqaa_(\w+)/
    const hash_code = hash_rage.exec(hash_text)?.length >= 1 ? hash_rage.exec(hash_text)[1] : 'error'
    if (hash_code === 'error') {
        console.log('获取回复hash失败', hash_text)
        return 144514
    }
    const code_text = await get('http://www.9dmsgame.net/misc.php?mod=secqaa&action=update&idhash=' + hash_code)
    if (code_text === 'error') return 144514
    const code_rage = /(\d+ ?[+-x/] ?\d+) ?= ?\?/
    const code_eval = code_rage.exec(code_text)?.length >= 1 ? code_rage.exec(code_text)[1] : 'error'
    if (code_eval === 'error') {
        console.log('获取回复验证码失败', code_text)
        return 114514
    }
    let code
    try {
        code = eval(code_eval)
    } catch (e) {
        console.log('计算验证码出错', code_eval)
        return 114514
    }
    return { hash: hash_code, code: code }
}

// 发送消息
async function send_message(message, hash, code) {
    console.log('开始留言')
    const tid = /-(\d+)-/.exec(document.URL)[1]
    const url = `http://www.9dmsgame.net/forum.php?mod=post&action=reply&fid=40&tid=${tid}&fromvf=1&extra=page=1&replysubmit=yes&infloat=yes&handlekey=vfastpost&inajax=1`
    const input = document.querySelector('input[name="formhash"]')
    let formhash = ''
    if (input) formhash = input.getAttribute('value')
    else return 'error'
    const form = new FormData()
    form.append('formhash', formhash)
    form.append('message', message)
    if (hash && code) {
        form.append('secqaahash', hash)
        form.append('secanswer', code) }
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: form })
    let response_text = await get_re_text(response)
    console.log(response_text)
    if (response_text.includes('感谢') && response_text.includes('成功')) return 'success'
    if (response_text.includes('间隔少于')) throw new Error('冷却尚未完成, 请稍后再试')
    if (response.status !== 200 ) return 'error'
    console.log('出现未知错误', response)
}

// 冷却提示窗
async function cooling_tips(){
    const loc_time = GM_getValue('reply_time', 0)
    const now_time = parseInt(new Date().getTime() / 1000)
    if (now_time - loc_time < 8) {
        const result = await Swal.fire({
            title: '回复冷却中',
            text: '一定要现在发送请求吗, 大概率不会成功哦',
            icon: 'error',
            confirmButtonText: '确定',
            showCancelButton: true,
            cancelButtonText: '取消', })
        if (result.isConfirmed) return true
        return false}
    return true
    
}

// 文本内嵌回复按钮回调函数
async function text_embedding_callback(e) {
    // 冷却提示
    if (!(await cooling_tips())) return
    Swal.fire({
        title: "输入你想要回复的内容",
        input: "text",
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: "发送",
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        allowEscapeKey: () => !Swal.isLoading(),
        allowEnterKey: () => !Swal.isLoading(),
        preConfirm: async (text) => {
            try { if (text.length < 5) throw new Error('文本小于5个字符, 请重新输入')
                Swal.update({ text: '正在发送留言' })
                let result = await send_message(text, '', '')
                if (result === 'success') return 'success'
                Swal.update({ text: '正在获取验证码' })
                let code_data = await get_reply_code()
                console.log('验证码', code_data)
                if (code_data === 144514) throw new Error('获取验证码失败, 请重试或联系作者')
                Swal.update({ text: '正在发送留言' })
                result = await send_message(text, code_data.hash, code_data.code)
                if (result !== 'success') throw new Error('发送失败, 请重试或联系作者')
                return 'success'
            } catch (error) {
                console.log('发生错误', error)
                Swal.showValidationMessage(error+'\n如果长时间多次如此, 那可能是发送成功而脚本未识别') 
            } }
    }).then((result) => { if (result.value === 'success') {
        // 请求成功后记录时间
        GM_setValue('reply_time', parseInt(new Date().getTime() / 1000))
        Swal.fire('发送成功, 请刷新页面后查看', "", "success") }})
}

// 更便捷的回复
async function good_reply() {
    let reply_btns = document.querySelectorAll('div[class="locked"]>a')
    if (!reply_btns) return
    for (let reply_btn of reply_btns) {
        reply_btn.removeAttribute('href')
        reply_btn.removeAttribute('onclick')
        // 阻止回复跳转
        reply_btn.addEventListener('click', (e) => { e.preventDefault() })
        // 自定义回复函数
        reply_btn.addEventListener('click', text_embedding_callback) }
    // 真正的快捷回复
    let quick_reply = document.querySelector('#vreplysubmit')
    if (!quick_reply) return
    $('vreplysubmit').onclick = null
    quick_reply.removeAttribute('href')
    quick_reply.addEventListener('click', async () => {
        // 冷却提示
        if (!(await cooling_tips())) return
        text_embedding_callback(null)
        let input_text = document.querySelector("#vmessage")?.value
        if (!input_text || input_text.includes('在这里快速回复')) input_text = '6666666666'
        await new Promise((resout, gg)=>{setTimeout(() => {resout()}, 150)})
        document.querySelector('#swal2-input').value = input_text
        document.querySelector('button[class="swal2-confirm swal2-styled"]').click() })
}

// 可视化的计时器
// 创建计时器元素
function creat_timer(){
    GM_addStyle('#reply_time,#search_time {background-color: #ffa987a8;width: 200px;height: 75px;position: fixed;border-radius: 20px;left: 50px;display: flex;flex-direction: column;justify-content: center;align-items: center;color: #b64e1779;font-weight: bold;font-size: large;transition-property: display, top, left, background-color, color;transition-duration: 0.5s;}')
    GM_addStyle('#reply_time:hover,#search_time:hover {background-color: #E54B4B;color: #FFA987;animation-name: shake;animation-duration: 0.3s;animation-timing-function: ease-in-out;animation-iteration-count: 1;}')
    GM_addStyle('@keyframes shake {0% {transform: translate(-5px, -5px) rotate(5deg);}25% {transform: translate(5px, 5px) rotate(5deg);}50% {transform: translate(-3px, -3px) rotate(-3deg);}75% {transform: translate(3px, 3px) rotate(3deg);}100% {transform: translate(0, 0) rotate(0);}}')
    GM_addStyle('#reply_time {top: 50px;}')
    GM_addStyle('#search_time { top: 150px; }')
    GM_addStyle('.only {top: 50px !important;left: 50px !important; }')
    GM_addStyle('.over { left: -500px !important; }')
    GM_addStyle('#look_time { position: absolute; z-index: 9999; }')
    let div = document.createElement('looktime')
    document.body.appendChild(div)
    div = document.querySelector('looktime')
    div.outerHTML = `<div id="look_time">
    <p id="reply_time" class="over">回复冷却: 60s ✔️</p>
    <p id="search_time" class="over">搜索冷却: 60s ❌</p> </div>`
    // 双击隐藏冷却计时器
    let reply = document.querySelector('#reply_time')
    let search = document.querySelector('#search_time')
    reply.addEventListener('dblclick', ()=>{
        reply.className = 'over'
        setTimeout(() => {reply.style = 'display: none;'}, 300) })
    search.addEventListener('dblclick', ()=>{
        search.className = 'over'
        setTimeout(()=>{search.style = 'display: none;'}, 300)})
}
// 更新计时器
function update_timer(reply_time, search_time){
    // 判断是否存在显示元素
    let state_class = {
        '只有一个': 'only',
        '两个都有': '',
        '没有': 'over' }
    let reply = document.querySelector('#reply_time')
    let search = document.querySelector('#search_time')
    if (!reply || !search) return
    // 判断是否为新的计时器
    if (reply_time >= 60) reply.style = ''
    if (search_time >= 30) search.style = ''
    // 全部冷却完成
    if (reply_time <= 0 && search_time <= 0) {
        reply.className = state_class['没有']
        search.className = state_class['没有'] }
    // 只有回复冷却完成
    if (reply_time <= 0 && search_time >= 0) {
        reply.className = state_class['没有']
        search.className = state_class['只有一个'] }
    // 只有搜索冷却完成
    if (reply_time >= 0 && search_time <= 0) {
        reply.className = state_class['只有一个']
        search.className = state_class['没有'] }
    // 全部冷却未完成
    if (reply_time >= 0 && search_time >= 0) {
        reply.className = state_class['两个都有']
        search.className = state_class['两个都有'] }
    if (reply_time <= 0) reply_time = 0
    if (search_time <= 0) search_time = 0
    reply.innerText = `回复冷却: ${reply_time}s ` + (reply_time <= 0 ? ' ✔️' : '❌')
    search.innerText = `搜索冷却: ${search_time}s ` + (search_time <= 0 ? ' ✔️' : '❌')
}
// 创建元素并显示冷却时间
function clook_timer(){
    // 获取本地时间
    let now_time = parseInt(new Date().getTime() / 1000)
    // 获取本地时间
    let reply_time = 8 - now_time + GM_getValue('reply_time', 0)
    let search_time = 35 - now_time + GM_getValue('search_time', 0)
    // 判断是否存在显示元素
    let reply = document.querySelector('#reply_time')
    let search = document.querySelector('#search_time')
    if (!reply || !search) creat_timer()
    // 更新时间
    update_timer(reply_time, search_time)
}

// 拜托在新标签页打开
function open_in_new_tab() {
    if (!GM_getValue('open_in_new_tab', true)) return
	let all_doc = document.querySelectorAll('a')
	for (a of all_doc){
		if (a.getAttribute('href')){
			a.setAttribute('target', '_blank')
            a.removeAttribute('onclick') 
        } }
}

(function () {
    // 屏蔽搜索页验证
    add_transparent_css('.my-mask')
    // 更棒的回复方式
    good_reply()
    // 每秒监视冷却并进行可视化
    setInterval(clook_timer, 1000)
    // 实验性功能, 所有链接全在xin标签页打开
    setInterval(open_in_new_tab, 1000)
    const tips = '在新标签页打开所有链接' + (GM_getValue('open_in_new_tab')?'✔️':'❌')
    GM_registerMenuCommand(tips, ()=>{
        GM_setValue('open_in_new_tab', !GM_getValue('open_in_new_tab', true))
        location.reload()
    })
})()