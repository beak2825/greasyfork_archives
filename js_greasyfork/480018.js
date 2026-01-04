/*
 * ============================================================================== *
 ****************************** CodemaoUltra v0.0.2 ******************************
 ************* Copyright (C) 2023 xwmm92 ************
 * ============================================================================== *
*/
 
// ==UserScript==
// @name         CodemaoUltra-hash
// @namespace    https://box3.codemao.cn/u/azOxwOxmxOcjcsh
// @version      0.0.1
// @compatible   edge
// @compatible   chrome
// @description  box3辅助
// @author       xwmm92
// @match        https://box3.codemao.cn/*
// @match        https://box3.fun/*
// @match        https://shequ.codemao.cn/*
// @match        https://static.box3.codemao.cn/block/*
// @match        https://static.box3.fun/block/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.17
// @require      https://cdn.jsdelivr.net/npm/three@0.142.0/examples/js/libs/stats.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require      https://greasyfork.org/scripts/451480-md5%E5%8A%A0%E5%AF%86/code/md5%E5%8A%A0%E5%AF%86.js?version=1094400
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource     swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at       document-idle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMCA3OWMwLTM1LjQgMjguNS02NCA2My45LTY0LjFzNjQuMSAyOC42IDY0LjEgNjRjMCA5LjQtMi4xIDE4LjQtNS43IDI2LjUtMSAyLjMtMi4zIDQuNi0zLjYgNi43LS40LjYtMSAxLTEuNyAxSDExYy0uNyAwLTEuMy0uNC0xLjctMS0xLjMtMi4yLTIuNS00LjQtMy42LTYuN0MyLjEgOTcuNCAwIDg4LjQgMCA3OXptMjQuNC0zOS43Yy01LjIgNS4xLTkuMiAxMS4xLTEyIDE3LjgtMyA2LjktNC41IDE0LjItNC41IDIxLjhhNTUuODYgNTUuODYgMCAwIDAgNC40IDIxLjhjLjcgMS42IDEuNCAzLjIgMi4yIDQuN2g5OC44Yy44LTEuNSAxLjYtMy4xIDIuMi00LjdhNTUuODYgNTUuODYgMCAwIDAgNC40LTIxLjggNTUuODYgNTUuODYgMCAwIDAtNC40LTIxLjhjLTIuOC02LjctNi45LTEyLjctMTItMTcuOC01LjEtNS4yLTExLjEtOS4yLTE3LjgtMTJhNTUuODYgNTUuODYgMCAwIDAtMjEuOC00LjQgNTUuODYgNTUuODYgMCAwIDAtMjEuOCA0LjRjLTYuNiAyLjgtMTIuNiA2LjgtMTcuNyAxMnoiIGZpbGw9IiM0NDQiLz48cGF0aCBkPSJNMTIuNCA1Ny4xYzIuOC02LjcgNi45LTEyLjcgMTItMTcuOCA1LjEtNS4yIDExLjEtOS4yIDE3LjgtMTJBNTUuODYgNTUuODYgMCAwIDEgNjQgMjIuOWE1NS44NiA1NS44NiAwIDAgMSAyMS44IDQuNGM2LjcgMi44IDEyLjcgNi45IDE3LjggMTIgNS4yIDUuMSA5LjIgMTEuMSAxMiAxNy44YTU1Ljg2IDU1Ljg2IDAgMCAxIDQuNCAyMS44IDU1Ljg2IDU1Ljg2IDAgMCAxLTQuNCAyMS44Yy0uNyAxLjYtMS40IDMuMi0yLjIgNC43SDE0LjZjLS44LTEuNS0xLjYtMy4xLTIuMi00LjdBNTUuODYgNTUuODYgMCAwIDEgOCA3OC45Yy0uMS03LjYgMS40LTE0LjkgNC40LTIxLjh6IiBmaWxsPSIjNjQ5OTUwIi8+PHBhdGggZD0iTTc3LjUgNjAuOUM2OCA4MS4yIDY0LjkgODQuNiA2NC42IDg1Yy0xLjUgMS41LTMuNSAyLjMtNS42IDIuM3MtNC4xLS44LTUuNi0yLjNhNy45MSA3LjkxIDAgMCAxIDAtMTEuMmMuMy0uNCAzLjgtMy40IDI0LjEtMTIuOXptMC04Yy0xLjEgMC0yLjMuMi0zLjQuOEM2My4yIDU4LjggNTEgNjQuOSA0Ny44IDY4LjFjLTYuMiA2LjItNi4yIDE2LjMgMCAyMi41IDMuMSAzLjEgNy4yIDQuNyAxMS4yIDQuN3M4LjEtMS42IDExLjItNC43YzMuMi0zLjIgOS4zLTE1LjQgMTQuNC0yNi4zIDIuNi01LjYtMS43LTExLjQtNy4xLTExLjR6TTYzLjkgMjkuOGMtMjcuMiAwLTQ5LjUgMjIuNi00OS4xIDQ5LjggMCAzLjYuNSA3LjIgMS4zIDEwLjYuNCAxLjggMiAzLjEgMy45IDMuMSAyLjYgMCA0LjQtMi40IDMuOS00LjktLjctMy0xLjEtNi4yLTEuMS05LjNBNDIuMDQgNDIuMDQgMCAwIDEgMjYgNjNjMi01IDUtOS40IDguOC0xMy4yUzQzIDQzLjEgNDcuOSA0MWE0Mi4wNCA0Mi4wNCAwIDAgMSAzMi4yIDBjNC45IDIuMSA5LjMgNS4xIDEzLjEgOC45Qzk3IDUzLjYgOTkuOSA1OCAxMDIgNjNhNDIuMDQgNDIuMDQgMCAwIDEgMy4yIDE2LjFjMCAzLjItLjQgNi4zLTEuMSA5LjMtLjYgMi41IDEuMyA0LjkgMy45IDQuOSAxLjggMCAzLjUtMS4zIDMuOS0zLjEuOC0zLjYgMS4zLTcuMyAxLjMtMTEuMSAwLTI3LjMtMjIuMS00OS4zLTQ5LjMtNDkuM3oiIGZpbGw9IiM0NDQiLz48L3N2Zz4=
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/480018/CodemaoUltra-hash.user.js
// @updateURL https://update.greasyfork.org/scripts/480018/CodemaoUltra-hash.meta.js
// ==/UserScript==
var banben = "v3.9.1";
(async function () {
    async function run() {
        //运行成功！
        console.log("CodemaoUltra运行成功");
        //工具
        var dialogzindex = 99999
        const setv = ((html, name, value) => { html.setAttribute(name, value) });
        const setn = ((html, value) => { html.setAttribute(value, "") });
        const seth = ((html, html5) => { html.innerHTML = html5 });
        const sett = ((html, text) => { html.innerText = text });
        const addhtml = ((position, localName, data, html) => { var newHtml = document.createElement(localName); for (var name in data) { newHtml.setAttribute(name, data[name]) }; newHtml.innerHTML = html; var newElement = position.appendChild(newHtml); return (newElement) })
        const addanot = ((position, value) => { var newHtml = document.createComment(value); var newElement = position.appendChild(newHtml); return (newElement) });
        const addwindow = (name, content, width, img = null, closeyes = true, position = document.body) => {
            var dialog = addhtml(position, "div", { class: "box3edittooldiv box3tooldialog dongtai kaishizhuangtai", show: "true", oncontextmenu: "return false;", style: `top:10px;left:10px;width:${width}px;z-index:${dialogzindex}` }, "");
            var dialogdb = addhtml(dialog, "div", { class: "db" }, "");
            setTimeout(() => { dialog.classList.remove("kaishizhuangtai") }, 10)
            setTimeout(() => { dialog.classList.remove("dongtai") }, 260);
            if (img) {
                addhtml(dialogdb, "img", { width: "100", height: "100%", src: img, style: "margin-right: 10px;" }, ``)
            }
            var dialogydtzd = addhtml(dialog, "div", { class: "ydtzd", title: "拖动" }, "");
            var a = addhtml(dialogdb, "div", { style: "display: flex;flex-direction: column;" }, `<span style='font-weight: bold;font-size:20px'>${name}</span><font style='font-size:12px;color:#aaa;display: flex;flex-direction: row;'></font>`)
            sett(a.getElementsByTagName("font")[0], content)
            var dialogclose = addhtml(dialogdb, "button", { title: "关闭", zdy: "", jy: !closeyes }, "×");
            if (closeyes) {
                dialogclose.onclick = () => { setTimeout(() => { dialog.classList.add("dongtai", "kaishizhuangtai"); }, 10); setTimeout(() => { dialog.remove(); }, 260) }
            }
            dialog.onmousedown = () => { dialogzindex += 1; dialog.style.zIndex = dialogzindex }
            dialogydtzd.onmousedown = (en) => {
                setv(dialogydtzd, "ox", en.offsetX)
                setv(dialogydtzd, "oy", en.offsetY)
                document.onmousemove = (e) => {
                    dialog.style.top = (e.clientY - en.offsetY) + "px"
                    dialog.style.left = (e.clientX - en.offsetX) + "px"
                }
            }
            dialogydtzd.onmouseup = () => { document.onmousemove = null; }
            return ({ close: () => { setTimeout(() => { dialog.classList.add("dongtai", "kaishizhuangtai"); }, 10); setTimeout(() => { dialog.remove(); }, 260) }, openclose: () => { setv(dialogclose, "jy", "false"); dialogclose.onclick = () => { setTimeout(() => { dialog.classList.add("dongtai", "kaishizhuangtai"); }, 10); setTimeout(() => { dialog.remove(); }, 260) } }, dialog })
        }
        function getCookie(variable = '') {
            var query = document.cookie
            var vars = query.split("; ");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1]}
            }
            return null;
        }
        function setCookie(variable = 'a',content = '0'){
            document.cookie = `${variable}=${content}`
            return(document.cookie);
        }
        function getParameters(variable = ''){
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1]}
            }
            return(null);
        }
        function downloadMp3(filePath,name) {
            fetch(filePath).then(res => res.blob()).then(blob => {
                const a = document.createElement('a');
                a.style.display = 'none'
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name+'.mp3';
                a.click();
                window.URL.revokeObjectURL(url);
            });
        }
        const reload=()=>{location.href=location.href}
        //主程序
        try{
            var mode114514 = 'box'
            var toolfunc = null
            var toolfunc2 = null
            var toolfunc3 = null
            addanot(document.body,"———————————————————————————————————————")
            addanot(document.body,`    CodemaoUltra ${banben} by XWMM92     `)
            addanot(document.body," https://box3.codemao.cn/u/azoxwoxmxocjcsh ")
            addanot(document.body,"———————————————————————————————————————")
            var statsDiv = new Stats();
            document.body.append(statsDiv.domElement);
            statsDiv.domElement.title="点击切换模式"
            function updatastate(){
                requestAnimationFrame(updatastate);
                statsDiv.update();
            }
            updatastate()
            var userhuanchun =null
            function logs(...l){console.log("[CodemaoUltraLog]",...l)}
            function getMode(){
                var a = location.pathname,b
                if(window.location.hostname=='shequ.codemao.cn'){
                    mode114514='shequ'
                }else if(window.location.hostname=='box3.codemao.cn'||window.location.hostname=='box3.fun'){
                    mode114514='box'
                }
 
                if(mode114514=='box'){
                    if(a.startsWith("/e/")){
                        b="Edit"
                    }else if(a.startsWith("/p/")){
                        b="Play"
                    }else if(a.startsWith("/g/")){
                        b="MapRead"
                    }else if(a.startsWith("/m/")){
                        b="MusicRead"
                    }else if(a.startsWith("/v/")){
                        b="ModelRead"
                    }else if(a.startsWith("/me/content")){
                        if(/map|null/.test(String(getParameters("type"))))b="Works"
                        else if(/model/.test(String(getParameters("type"))))b="ModelWorks"
                        else if(/music/.test(String(getParameters("type"))))b="MusicWorks"
                        else b="OtherMode"
                    }else if(a.startsWith("/maas")){
                        b="Maas"
                    }else if(a.startsWith("/u/")){
                        b="User"//HomePage
                    }else if(a.startsWith("/block/Qm")&&/static.box3/.test(location.href)){
                        b="BoxStatic";
                    }else if(a=="/"){
                        //if(
                        b="HomePage"
                    }else {
                        b="OtherMode"
                    }
                }else{
                    //更换图标
                    //$('head').append('<link rel="shortcut icon" href="https://yuzifu.top/codemao.svg">')
                    if(a.startsWith("/work/")){ // 社区
                        b="shequWork"
                    }else if(a.startsWith("/community")){ // 社区
                        b="shequCommunity"
                    }else{
                        b="ShequOtherMode"
                    }
                }
                return b;
            }
            var nowmode,beiyongnowmode;
            var initinterval = setInterval(()=>{
                nowmode = getMode();
                if(location.href != beiyongnowmode){
                    logs("更换模式 "+nowmode)
                    updatamode(nowmode)
                }
            },1)
            var codemaoultrasettings = {
                width:245,
                showmonitor:true,
                monitorposition:0,
                monitortm:90,
            }
            function updatamode(m){
                beiyongnowmode = location.href;
                logs("当前模式："+m)
                var init = async(md)=>{
                    if(mode114514=='box'&&m!="BoxStatic"){
                        if(/Play|Edit/.test(m)){
                            toolfunc3 = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
                        }else{
                            toolfunc3 = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website
                        }
                        logs(toolfunc2);
                        logs(toolfunc3);
                    }
                    const ranges = [
                        [0xA1, 0xA9, 0xA1, 0xFE],
                        [0xB0, 0xF7, 0xA1, 0xFE],
                        [0x81, 0xA0, 0x40, 0xFE],
                        [0xAA, 0xFE, 0x40, 0xA0],
                        [0xA8, 0xA9, 0x40, 0xA0],
                        [0xAA, 0xAF, 0xA1, 0xFE],
                        [0xF8, 0xFE, 0xA1, 0xFE],
                        [0xA1, 0xA7, 0x40, 0xA0],
                    ]
                    const codes = new Uint16Array(23940);
                    let i = 0
 
                    for (const [b1Begin, b1End, b2Begin, b2End] of ranges) {
                        for (let b2 = b2Begin; b2 <= b2End; b2++) {
                            if (b2 !== 0x7F) {
                                for (let b1 = b1Begin; b1 <= b1End; b1++) {
                                    codes[i++] = b2 << 8 | b1
                                }
                            }
                        }
                    }
                    const str = new TextDecoder('gbk').decode(codes);
                    const table = new Uint16Array(65536);
                    for (let i = 0; i < str.length; i++) {
                        table[str.charCodeAt(i)] = codes[i];
                    }
                    function stringToGbk(str='') {
                        const buf = new Uint8Array(str.length * 2)
                        let n = 0
                        let no=[],wrong=[];
                        for (let i = 0; i < str.length; i++) {
                            if(str[i]=='�'){
                                wrong.push(n,n+1);
                            }
                            if(str[i].match(/[0-9a-zA-Z()!*]/)){
                                buf[n++] = 255;
                                no.push(str[i]);
                                continue;
                            }
                            if(str[i]=='€'){
                                buf[n++] = 0x80;
                                continue;
                            }
                            const code = str.charCodeAt(i)
                            if (code < 0x80) {
                                buf[n++] = code
                            } else {
                                const gbk = table[code];
                                buf[n++] = gbk & 0xFF
                                buf[n++] = gbk >> 8
                            }
                        }
                        return [buf.subarray(0, n),no,wrong]
                    }
                    function glabled_code_repair(t=''){
                        var [u8arr,uc,wrong]= stringToGbk(t);
                        var x = [''],q=0,ret=[''],q2=0,wait=false,ans='';
                        u8arr.forEach((e,i) => {
                            if(wrong.includes(i)){
                                if(!wait){
                                    ret.push('');
                                    x.push('');
                                    x[q2]+='?';
                                    q2++;
                                    wait=true;
                                }else{
                                    x[q2-1]+='?';
                                }
                            }else {
                                wait=false;
                                if(e==255){
                                    x[q2]+=uc[q++];
                                }else{
                                    var p=e.toString(16);
                                    if(p.length<2)p='0'+p;
                                    x[q2] += '%' + p;
                                }
                                try{
                                    ret[q2]=decodeURIComponent(x[q2]);
                                }catch(e){
                                    ret[q2]+='?';
                                }
                            }
                        });
                        ret.forEach(e=>{ans+=e});
                        return ans;
                    }
                    async function creat(hash, size) {
                        axios({
                            method: 'post',
                            url: 'https://backend.box3.fun/container/create-game-edit',
                            data: JSON.parse(`{"image":"Qmdkqjkx8YXCEzQuNrZhEr75dpRGHcWY7oiCxg5oQqfzox.png","name":"空白的地图(${size}) (未激活)","describe":"${size}","hash":"${hash}","resourceId":0}`),
                            withCredentials: true
                        })
                            .then(({
                            request
                        }) => {
                            console.log(JSON.parse(request.responseText)['data']['value'].slice(5));
                        });
                        location.reload();
                    }
                    var datas = {
                        "发送长消息":()=>{
                            var dialogs = addwindow("发送长消息","确保你没有被禁言，然后在下方输入消息，回车换行，Shift+回车发送。\n如果按某些按键时无法键入内容而导致人物移动，请自行在其他可以输入文本的网站或输入框等地方输入，复制后再粘贴过来\n另外，发送的内容请自行打开“聊天区”查看",500);
                            var div1 = addhtml(dialogs.dialog,"div",{class:"div"},"");
                            var div2 = addhtml(dialogs.dialog,"div",{class:"div"},"");
                            var input = addhtml(div2,"textarea",{style:"width:100%;height:250px;background:#0000;color:#fff;outline: none;resize: none;padding:10px;margin-top:10px"},"")
                            var fjcg=()=>{var a = addhtml(dialogs.dialog,"div",{class:"div"},"发送成功！");setTimeout(()=>{a.remove()},2000)}
                            var send = ()=>{
                                if(m=='Play'){
                                    toolfunc.state.box3.chat.sendMessage(input.value);
                                }else{
                                    toolfunc3.state.box3.chat.sendMessage(input.value);
                                }
                                setTimeout(()=>{input.value=""},100);fjcg()
                            }
                            addhtml(div1,"button",{},"粘贴文本").onclick=async()=>{input.value=await navigator.clipboard.readText();}
                            addhtml(div1,"button",{},"一键发送").onclick=send
                            input.onkeydown=(e)=>{if(e.key=="Enter"&&e.shiftKey){send()}}
                        },
                        "地图信息":()=>{
                            var dialogs = addwindow(toolfunc2.containerName,toolfunc2.containerDesc,500,"https://static.box3.codemao.cn/block/"+toolfunc2.image);
                            var div1 = addhtml(dialogs.dialog,"div",{class:"div"},"");
                            var fjcg=()=>{var a = addhtml(dialogs.dialog,"div",{class:"div"},"复制成功！");setTimeout(()=>{a.remove()},2000)}
                            addhtml(div1,"button",{},"复制地图名").onclick=()=>{navigator.clipboard.writeText(toolfunc2.containerName);fjcg()}
                            addhtml(div1,"button",{},"复制简介").onclick=()=>{navigator.clipboard.writeText(toolfunc2.containerDesc);fjcg()}
                            addhtml(div1,"button",{},"复制封面链接").onclick=()=>{navigator.clipboard.writeText("https://static.box3.codemao.cn/block/"+toolfunc2.image);fjcg()}
                            addhtml(div1,"button",{},"在新标签页中打开封面").onclick=()=>{window.open("https://static.box3.codemao.cn/block/"+toolfunc2.image)}
                        },
                        "未开放":()=>{
                            addwindow("敬请期待！","",300);
                        },
                        "更新说明":()=>{
                            addwindow("更新说明",`
3.9.1
��1.新增hash上传功能（把hash上传至神岛服务器存储）
��2.新增使用hash建造功能（使用服务器中已经存储的hash建造地图）
3.3.4
��1.完善社区与神岛之间的判断
��2.改了个ico
3.3.3
��1.删除赘余无用或已失效功能代码
��2.pg数据库使用说明点击后直接跳转至网页，不弹出文本框
3.3.2
��1.修复了UI消失的bug
��2.修复了网页加速器的某个bug
3.3.1
��1.内置【油小猴】网页加速器（仅支持社区以及神岛加速），网页跳转速度预计增速至原来的150%
3.2.4
��1.优化uid显示UI
3.2.2
��1.修复uid显示bug
3.2.1
��1.修复任意大小地图制造功能bug
3.1.3
��1.新增GBK乱码修复
3.1.2
��1.同步更新论坛发帖防屏蔽防吃格式
3.1.1
��1.修复任意大小地图制造功能
2.9.1
��1.更新api
��2.因神岛新增加密，任意大小地图制造功能可能暂时已经无法使用
2.1.4
��1.同步更新论坛发帖防屏蔽防吃格式
2.1.3
��1.论坛发帖防屏蔽防吃格式bug修复
2.1.2
��1.论坛发帖防屏蔽防吃格式
2.1.1
��1.脚本范围升级覆盖全猫站
��2.完善了自定义地图
��3.新增社区作品跳转到创作星空树功能
1.1.4
��1.修复了自定义地图的部分bug
1.1.3
��1.新增年度百大创作之星个人主页提示
1.1.2
��1.新增自定义世界大小的数值要求（不遵守要求会导致建造失败）
1.1.1
��1.新增自定义世界大小以及数据库类型
1.0.2
��1.修复了bug
1.0.1
��1.大改脚本框架
��2.修复已知所有bug
��3.许可证更换为GNU GPL-3.0（仍然开源免费使用，但是修改必须使用GNU GPL-3.0许可证）
0.1.8
��1.协议更换为MIT
0.1.7
��1.协议更换为GPL
0.1.6
��1.新增创建pg数据库地图的功能
0.1.5
��1.新增创建704以及1024地图的功能
0.1.3
��1.优化代码结构，增加一点没用的功能
0.1.2
��1.修复若干bug，优化代码结构，去除无用功能
0.1.0
��1.上线
                        `,300);
                        },
                        "作者":()=>{
                            window.open("https://box3.codemao.cn/u/azoxwoxmxocjcsh")
                        },
                        "建造256256704地图":async()=>{
                            if (confirm('确认创建256*256*704地图？')) {
                                creat('QmTuELNrZixUHYytsqJAUCw8R22868ePtkNCQ4DMUd8wCg', '256*256*704');
                            }
                            reload();
                        },
                        "建造1024641024地图":async()=>{
                            if (confirm('确认创建1024*64*1024地图？')) {
                                creat('QmNorKXGb2RwP3KRQBpkH2vfJJ4ziva5qMc1cU6SJyBSTa', '1024*64*1024');
                            }
                            reload();
                        },
                        "创作星空树":()=>{
                            var shequWorkId = window.location.pathname;
                            shequWorkId = shequWorkId.substring(shequWorkId.lastIndexOf('/') + 1, shequWorkId.length);
                            window.open(`https://shequ.codemao.cn/tree/${shequWorkId}`)
                        },
                        "pg数据库使用教程":async()=>{
                            window.open(`https://demo.hedgedoc.org/s/AHrRtpgBv`)
                        },
                        "无功能":()=>{},"回到原版神岛首页":()=>{location.href="https://box3.codemao.cn/"},
                        "清空聊天区":()=>{
                            if(nowmode=="Play"){
                                document.func.state.box3.state.chat.log=[]
                            }else if(nowmode="Edit"){
                                toolfunc3.state.box3.state.chat.log=[]
                            }
                        },
                        "GBK":()=>{
                            try{
                                var pre=document.querySelector('pre');
                                var rep=confirm('即将修复，显示“？”的地方为信息丢失处，以永久损失无法恢复');
                                if(!rep)return;
                                pre.innerText=glabled_code_repair(pre.innerText);
                            }catch(e){
                                alert('修复失败，报错：'+e.message);
                                console.error('Repair Error:'+e);
                            }
                        },
                        "GBK?":()=>{
                            alert('在box3 static中，文字是用GBK编码储存的，而信息上传时却通常使用UTF-8。两种编码对一个汉字使用的编码数量不同，因此当解析出现误差时就会显示乱码');
                        },
                        "什么是Hash？": () => {
                            addwindow("什么是Hash？", "Hash，又名哈希值，是一个以Qm开头再加上一些随机大小写字母、数字组成的Key字串符\n在Box3，许多的文件都是以一个Hash来储存在一个核心文件夹里，\n那个核心文件夹就是static.box3.codemao.cn/block/。\n拿到了文件Hash之后，把Hash粘贴到核心文件夹链接的后面，然后就可以访问文件里面的内容了。\n当然，也可以加上扩展名（例如音乐就是.mp3，图片就是.png）", 500)
                        },
                        "建造hash": () => {
                            var dialogs = addwindow("建造Hash", "在输入框里输入文件内容，然后点击建造\n当然你也可以上传文件并建造", document.documentElement.clientWidth - 180);
                            var div1 = addhtml(dialogs.dialog, "div", { class: "div" }, "");
                            var div2 = addhtml(dialogs.dialog, "div", { class: "div" }, "");
                            var input = addhtml(div2, "textarea", { style: "width:100%;height:" + (document.documentElement.clientHeight / 2) + "px;background:#0000;color:#fff;outline: none;resize: vertical;padding:10px;margin-top:10px;max-height:" + (document.documentElement.clientHeight - 350) + 'px;min-height:100px;' }, "")
                            addhtml(div1, "button", {}, "粘贴文本").onclick = async () => { input.value = await navigator.clipboard.readText(); }
                            addhtml(div1, "button", {}, "建造").onclick = async () => {
                                var xhr = new XMLHttpRequest()
                                xhr.open("POST", "https://static.box3.codemao.cn/block/")
                                xhr.onreadystatechange = () => {
                                    if (xhr.status == 200 && xhr.readyState == 4) {
                                        var d3 = addhtml(dialogs.dialog, "div", { class: "div" }, ``);
                                        addhtml(d3, "span", {}, "建造成功！Hash：")
                                        addhtml(d3, "span", { style: "margin-right:10px" }, JSON.parse(xhr.response)["Key"]);
                                        var fjcg = () => { var a = addhtml(dialogs.dialog, "div", { class: "div" }, "复制成功！"); setTimeout(() => { a.remove() }, 2000) }
                                        addhtml(d3, "button", {}, "复制").onclick = async () => { navigator.clipboard.writeText(JSON.parse(xhr.response)["Key"]); fjcg() }
                                        addhtml(d3, "button", {}, "在新标签页中打开").onclick = async () => { window.open("https://static.box3.codemao.cn/block/" + JSON.parse(xhr.response)["Key"]) }
                                        addhtml(d3, "button", {}, "关闭").onclick = async () => { d3.remove() }
                                    }
                                }
                                xhr.send(input.value)
                            }
                        },
                    }
                    //plus
                    var custom = {
                        'x': 64,
                        'y': 64,
                        'z': 64,
                        'pg': false,
                        create: function () {
                            async function fetchVoxels(x, y, z) {
                                var ret;
                                if (x * y * z < 32768 || x * y * z > 67108864 || (x * y * z % 32768 != 0)) {
                                    alert('数值错误！');
                                    return null;
                                }
                                var chunks = [], xx = x / 32, yy = y / 32, zz = z / 32;
                                for (let i = 1; i < zz; i++) {
                                    chunks = chunks.concat(new Array(xx - 1).fill('"QmY4M7B58dARVAJyYf7aonuGjNnaUFUusCQXq9tmifLEKY"'));
                                    chunks.push('"Qmcoad9FnMdKGbxn5ifLdCaivVi6T7E2bmDVAdJbwuRD2a"');
                                    chunks = chunks.concat(new Array((yy - 1) * xx).fill('"QmYUffAgALxiUQonbhAVXjknTq3dNf3AfHQGQ8P5xny7TU"'));
                                    console.log(chunks);
                                }
                                chunks = chunks.concat(new Array(xx - 1).fill('"QmaCUNCe7XDEnXJqprgikquGk6H5nkMegxi77h2aaRyc2b"'));
                                chunks.push('"QmX49DZMGEY9ANyzfbrWhiEKk1hkz9SRpFn2NTKMRUjQzj"');
                                chunks = chunks.concat(new Array((yy - 1) * xx).fill('"QmYUffAgALxiUQonbhAVXjknTq3dNf3AfHQGQ8P5xny7TU"'));
                                var voxels = `{"chunks": [${chunks}],"shape": {"x": ${x},"y": ${y},"z": ${z}}}`;
                                console.log('chunk=' + chunks.length);
                                //voxels='{"chunks": ["QmYUffAgALxiUQonbhAVXjknTq3dNf3AfHQGQ8P5xny7TU"],"shape": {"x": 2,"y": 2,"z": 2}}'
                                return fetch('https://static.box3.codemao.cn/block/', { method: 'POST', body: voxels });
                            }
                            var { x, y, z, pg } = custom;
                            fetchVoxels(x, y, z)
                                .then(response => {
                                var res = response.json();
                                return res;
                            })
                                .then(result => result.Key)
                                .then(async function (voxelsHash) {
                                console.log('voxelhash=' + voxelsHash);
                                if (voxelsHash == null) return;
                                if (!confirm("提示：确认创建？")) return;
                                var hash;
                                var sql;
                                var date = new Date();
                                var time = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:00.000Z`;
                                if (pg) {
                                    sql = 'pg';
                                } else {
                                    sql = 'sqlite';
                                }
                                var playerHash;
                                var plbody = `{"allowAction0":true,"allowAction1":true,"allowDoubleJump":true,"allowFlight":false,"allowJump":true,"allowMove":true,"cameraType":"follow","color":[1,1,1],"colorLUT":"","crouchAcceleration":0.09,"crouchSpeed":0.1,"damage":{"enabled":false,"hp":100,"maxHp":100,"showDamage":true,"showHealth":true},"doubleJumpPower":0.9,"emissive":0,"flyAcceleration":2,"flySpeed":2,"friction":0,"initialPosition":{"x":${Math.round(x / 2)},"y":${y+25},"z":${Math.round(z / 2)}},"initialYaw":0,"invisible":false,"jumpAccelerationFactor":0.55,"jumpPower":0.96,"jumpSpeedFactor":0.85,"mass":1,"metalness":0,"movementBounds":{"hi":{"x":${x + 49},"y":${y + 49},"z":${z + 49}},"lo":{"x":-50,"y":-50,"z":-50}},"noClip":false,"playerSounds":{"action0":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},"action1":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},"crouch":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},"doubleJump":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/double_jump.mp3"},"endFly":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},"enterWater":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/dive.mp3"},"jump":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/jump.mp3"},"land":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/land.mp3"},"leaveWater":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/splash.mp3"},"music":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":0,"sample":""},"spawn":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/spawn.mp3"},"startFly":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},"step":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0.2,"radius":32,"sample":"audio/step.mp3"},"swim":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/swim.mp3"}},"restitution":0,"runAcceleration":0.35,"runSpeed":0.4,"scale":1,"shininess":0,"showName":true,"sounds":{"chat":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/chat.mp3"},"die":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/die.mp3"},"hurt":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/hurt.mp3"},"interact":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""}},"swimAcceleration":0.1,"swimSpeed":0.4,"walkAcceleration":0.19,"walkSpeed":0.22}`
                                await fetch('https://static.box3.codemao.cn/block/', { method: 'POST', body: plbody }).then(async (response) => { var k = await response.json(); playerHash = k.Key; console.log(playerHash) }).catch(() => console.log('catch'));
                                var mpbody = `{"ambientSound":"QmcNbLSSQfVcDpH9jSX38RSVrL1SZK3vNMZwaP7cMkKqvY","assets":"QmdEyTaW4uENRCGu9cSUPFNDH5vJRX8n4BxtJYuzVs2kn1","collisionFilter":[],"committerId":0,"deleteAssets":"QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN","editRoot":"QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN","entities":"QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK","environment":"QmRC98696VxEVsScYsChTzU2uDguFBboruxKYhwtFnAPK7","features":{"enableTriggerAPI":true},"folders":"QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK","info":"QmXNsFZxmhdfyMbdc6BaoDgkfWAjgbPGrps3UNk3tJLNiR","physics":"QmTzt6Z6Mm11NQjTeXspDMJtddzDadzwhgwfWUtNG5XCrD","player":"${playerHash}","prevHash":"QmP2c7LxFD2j2EBk6inaDhhBE2DuuQ2TLtJRNpKXLyvbuL","scriptAssets":"QmRMAD8RuRMvKXr2EQ4WtGmoFsg4gf67qrGemGTQ7may93","scriptIndex":"index.js","storageMode":"${sql}","timestamp":"${time}","type":"project","version":"0.3.11","voxels":"${voxelsHash}","zones":"QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN"}`;
                                await fetch('https://static.box3.codemao.cn/block/', { method: 'POST', body: mpbody }).then(async function (response) {
                                    var k = await response.json();
                                    hash = k.Key;
                                    console.log(hash);
                                }).catch(function () {
                                    console.log('catch')
                                });
                                console.log(hash)
                                creat(hash, `${x}*${y}*${z}的地图`)
                            });
                        }
                    };
                    var shijiao = {
                        '1':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 2
                        },
                        '2':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 0
                        },
                        '3':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 1
                        },
                        '4':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 3
                        },
                        '5':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 4
                        },
                    }
                    if(window["codemaoultraDiv"]){window["codemaoultraDiv"].destroy();window["codemaoultraDiv"]=undefined}
                    var tool = new lil.GUI({ title: `�� CodemaoUltra${/Play|Edit/.test(md)?("（"+md+"Mode）"):""}` });
                    tool.domElement.style.top = 'unset';
                    tool.domElement.style.bottom = '0';
                    tool.domElement.style.userSelect = 'none';
                    window["codemaoultraDiv"]=tool;
                    var p25 = tool.addFolder('CodemaoUltra设置（Settings）').close();
                    p25.add(codemaoultrasettings, 'width', 200, document.documentElement.clientWidth-200, 1).name('工具栏长度').onFinishChange((e)=>{
                        tool.domElement.style.width=e+"px"
                    })
                    p25.add(codemaoultrasettings, 'showmonitor').name('显示监视器').onChange((e)=>{
                        statsDiv.domElement.style.display = e?"block":"none"
                    })
                    p25.add(codemaoultrasettings, 'monitorposition',{"左上角":0,"右上角":1,"右下角":2,"左下角":3}).name('监视器位置').onChange((e)=>{
                        var data =[
                            [0,null,0,null],
                            [0,null,null,0],
                            [null,0,null,0],
                            [null,0,0,null]
                        ]
                        statsDiv.domElement.style.top=typeof data[e][0]=="number"?data[e][0]+"px":"unset";
                        statsDiv.domElement.style.bottom=typeof data[e][1]=="number"?data[e][1]+"px":"unset";
                        statsDiv.domElement.style.right=typeof data[e][3]=="number"?data[e][3]+"px":"unset";
                        statsDiv.domElement.style.left=typeof data[e][2]=="number"?data[e][2]+"px":"unset";
                    })
                    p25.add(codemaoultrasettings, 'monitortm',10,100,1).name('监视器不透明度').onChange((e)=>{
                        statsDiv.domElement.style.opacity = e/100
                    })
                    var p1 = tool.addFolder('常用功能（Tools）');
                    if(/Play|Edit/.test(m)){
                        p25.close()
                        var p11 = p1.addFolder('地图（Map）');
                        var p111 = p11
                        p111.add(datas, '地图信息').name('地图信息');
                        var p12 = p1.addFolder('聊天（Chat）');
                        p12.add(datas, '发送长消息').name('发送长消息');
                        p12.add(datas, '清空聊天区').name('清空聊天区');
                        var interval = setInterval(()=>{
                            var jianceduixiang =
                                (
                                    m=="Play"?
                                    document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.eventBackendURL:
                                    document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.language
                                );
                            if(!jianceduixiang){
                                if(window["codemaoultraDiv"]){window["codemaoultraDiv"].destroy();window["codemaoultraDiv"]=undefined}
                                clearInterval(interval);
                            }
                        },100);
                    }
                    var p13 = p1.addFolder('Hash工具（Hash Tools）');
                    p13.add(datas, '什么是Hash？').name('什么是Hash？');
                    p13.add(datas, '建造hash').name('建造Hash');
                    var p2 = tool.addFolder('关于 当前版本：'+banben).close();
                    p2.add(datas, '作者').name('作者个人主页');
                    p2.add(datas, '更新说明').name('更新说明');
                    function returnTime(t) {
                        var nowTime = new Date(t)
                        return {
                            "年": nowTime.getFullYear(),
                            "月": nowTime.getMonth() + 1,
                            "日": nowTime.getDate(),
                            "周": '星期' + ['日', '一', '二', '三', '四', '五', '六'][Number(nowTime.getDay())],
                            "时": nowTime.getHours(),
                            "分": nowTime.getMinutes(),
                            "秒": nowTime.getSeconds()
                        }
                    }
                    if(/MapRead|MusicRead|ModelRead/.test(m)){
                        window["workcontent"] = await document.func.rpc.content.api.get({
                            type: "id",
                            data: {
                                contentId: Number(location.pathname.replace(location.pathname.substring(0,3), "")),
                                isPublic: true,
                                meshHash: location.pathname.substring(1,2)=="v"?true:false,
                                type: {g:1,v:2,m:3}[location.pathname.substring(1,2)],
                                userId: 0,
                            },
                        })
                        logs(workcontent)
                        var datas2 = {
                            "获取建造时间":()=>{
                                var t = returnTime(workcontent.created_at.valueOf())
                                addwindow("开始制作时间",`${t.年}月${t.月}月${t.日}日 ${t.周} ${(String(t.时).length==1?'0'+t.时:t.时)}:${(String(t.分).length==1?'0'+t.分:t.分)}:${(String(t.秒).length==1?'0'+t.秒:t.秒)}`)
                            },
                            "查看全面展示图":()=>{
                                var dialog = addwindow("查看展示图",`请选择一张：`).dialog
                                for(var a in workcontent.banner){
                                    var b = addhtml(dialog,"div",{class:"div",style:"font-size:13px"},"")
                                    var c = Number(a)+1
                                    addhtml(b,"span",{style:"margin-right:5px"},"第"+c+"张：")
                                    addhtml(b,"a",{href:"https://static.box3.codemao.cn/block/"+workcontent.banner[a],target:"_blank",style:"color:#fff;text-decoration: underline;"},workcontent.banner[a])
                                }
                            },
                            "查看高清封面":()=>{
                                window.open(`https://static.box3.codemao.cn/block/${workcontent.image}_cover_1024_1024.png`)
                            },
                        };
                    }
                    console.log(m)
                    console.log(md)
                    if(md == 'Play'){
                        tool.close()
                        userhuanchun=null
                    }else if(md=="Edit"){
                        tool.close()
                        userhuanchun=null
                        var p115 = p1.addFolder('界面显示');
                        p115.add(toolfunc3.state.box3.state, "hideUI").name("��隐藏界面");
                    }
                    else if(md=="Works"){
                        userhuanchun=null
                        var p11111 = p1.addFolder('建造地图（Create Map）');
                        var p111111 = p11111.addFolder('巨大地图');
                        //var p231111 = p11111.addFolder('pg数据库地图地图');
                        p111111.add(datas, '建造256256704地图').name('建造一个 256x256x704 巨大地图');
                        p111111.add(datas, '建造1024641024地图').name('建造一个 1024x64x1024 贼大地图');
                        //p111111.add(datas, '建造任意大小地图').name('建造 任意大小+自定义数据库 地图');
                        var p231111 = p11111.addFolder('自定义地图');
                        p231111.add(custom, 'x', 1, 2048, 1).name('x');
                        p231111.add(custom, 'y', 1, 2048, 1).name('y');
                        p231111.add(custom, 'z', 1, 2048, 1).name('z');
                        p231111.add(custom, 'pg').name('使用pg数据库？');
                        p231111.add(custom, 'create').name('创建');
                        p11111.add(datas, 'pg数据库使用教程').name('pg数据库使用教程');
                        var p111112 = p11111.addFolder('使用hash建造');
                        var hashcreatemapdata = {
                            "hash": "",
                            "function": async () => {
                                if (!confirm("提示：确认创建？")) return
                                if ((hashcreatemapdata["hash"].length != 46) || (hashcreatemapdata["hash"].startsWith("Qm") == false)) {
                                    alert("你这Hash保熟吗？")
                                    return
                                }
                                var edithash = await document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website.rpc.container.api.createGameEdit(
                                    {
                                        "image": "Qmdkqjkx8YXCEzQuNrZhEr75dpRGHcWY7oiCxg5oQqfzox.png",
                                        "name": "未激活地图（进入地图后即可激活）",
                                        "describe": "完全空白，尽情发挥想象力，创造全新的地图",
                                        "hash": hashcreatemapdata["hash"],
                                        "resourceId": 0
                                    }
                                );
                                window.open(location.origin + "/e/" + edithash.split("-")[1])
                                for (let i of "12345") {
                                    document.querySelector(
                                        "#main > main > div.bg-white.mb-24.p-24-0.cKMigh6PpW3tleaZK6J1R > div > div.hAB8LjZSi73-MLk-0ZUWg.tab-bar > button._3AspHqpBNnv2Z9vUyC6Fnx.vbojj-sJcBnYnXKqRwxoU._12b-ZtA2Hl4-wYcKqK83AR._1SS6wc-FMtveQU1rUrkRW.Lz4uEvJd_qOzG39N7jnOg._1KXyfkOCOG7H7xR_ULs_R7._3mGcht4WhuRtvCwPGKNEvg"
                                    ).click();
                                    await new Promise((e) => setTimeout(e, 100));
                                }
                                reload();
                            }
                        }
                        p111112.add(hashcreatemapdata, 'hash').name('地图Hash');
                        p111112.add(hashcreatemapdata, 'function').name('建造');
                    }
                    else if(md=="Maas"){
                        userhuanchun=null
                        p1.add(datas, '回到原版神岛首页').name('回到原版神岛首页');
                        if(confirm("检测到当前为首页为商业版，\n是否跳转到原版神岛首页？")){datas['回到原版神岛首页']()}
                    }
                    else if(md=="HomePage"){
                        userhuanchun=null
                        var datas3 = {
                            仅显示非官方的首页作品:async()=>{
                                var uctsyv = document.querySelector("#main > ._9m6A3-68k5itHRQwRNTQr > ._3IbS6Ew1CROpnsaTbrniXH > .pHRRH-pJlcoCY3qP0gcFI > div > div > ._2X5BYLn0E98PdZ5lEkhpVc > ._2p590X3xza5oTJJZ3ToFcx")
                                var allP =  uctsyv.querySelectorAll("._1yZ6NeMjfGScb4F10xmspg")
                                allP.forEach(async(e)=>{
                                    var root = null
                                    for(var p in e){
                                        if(p.startsWith("__reactEventHandlers")){
                                            root=e[p].children.props
                                            break
                                        }
                                    }
                                    var aid = root.data.authorId
                                    var aidata = await document.func.rpc.user.api.get({publishedContentsCount:true,condition:"id",value:String(aid)})
                                    console.log(root.data.name,aidata.displayname,root,aidata)
                                    if(aidata.tag==1||aidata.id==1927){
                                        e.remove()
                                    }
                                })
                            }
                        };
                        if(mode114514=='box')p1.add(datas3, '仅显示非官方的首页作品').name('仅显示非官方的首页作品');
                    }
                    else if(md=="User"){
                        var ssv = location.pathname.replace(location.pathname.substring(0,3), "")
                        if(isNaN(Number(ssv))){
                            window["usercontent"] = await document.func.rpc.user.api.get({publishedContentsCount:true,condition:"username",value:ssv})
                        }else{
                            window["usercontent"] = await document.func.rpc.user.api.get({publishedContentsCount:true,condition:"id",value:ssv})
                        }
                        console.log(usercontent)
                        setTimeout(()=>{
                            if(userhuanchun=="/u/")return
                            userhuanchun = location.pathname.substring(0,3)
                            var normalUsers=`<div class="_3ad7RnKp0WvPrytuJgHNZC">`;
                            var official=`<div class="O_1bkQ86ZNwsQID9yt2-5 IWXvKdLYkyQRIR-bhYjk1 _1lys4tbynXnfWH-M3WNvLL"><picture><source type="image/avif" srcset="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.avif 1x, https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_32_32_cover.avif 2x"><source type="image/webp" srcset="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.webp 1x, https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_32_32_cover.webp 2x"><source type="image/jpeg" srcset="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.jpg 1x, https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_32_32_cover.jpg 2x"><source type="image/png" srcset="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.png 1x, https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_32_32_cover.png 2x"><img alt="" width="16" height="16" class="_3vfmbi4TlRDt_HCAsy45gl web-img" crossorigin="anonymous" src="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.png" style="border: none; margin-right: 4px;"></picture><span class="_2IjTwrns7m6QeUouRJZaJK">`;
                            var vvvip=`<div class="O_1bkQ86ZNwsQID9yt2-5 IWXvKdLYkyQRIR-bhYjk1 _2CIZkiR5Tk_te3xyfL1QWJ"><picture><source type="image/avif" srcset="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.avif 1x, https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_32_32_cover.avif 2x"><source type="image/webp" srcset="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.webp 1x, https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_32_32_cover.webp 2x"><source type="image/jpeg" srcset="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.jpg 1x, https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_32_32_cover.jpg 2x"><source type="image/png" srcset="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.png 1x, https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_32_32_cover.png 2x"><img alt="" width="16" height="16" class="_3vfmbi4TlRDt_HCAsy45gl web-img" crossorigin="anonymous" src="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.png" style="border: none; margin-right: 4px;"></picture><span class="mj5Q_r1tWrcjg7W7QLjHI">`
                            var uctsyv = document.querySelector("#main > main._2jTAXSb-GRY2o25tiqdq_z > ._1j6CQ8Mao1X47ufWW0UfI5 > .eQ4WOXbFnE2kwanAO8YNj > ._16IUw3NEvNlyHAOuWKbRMb > .flex > .flex")
                            if(usercontent.id=="2526"){
                                addhtml(uctsyv,"div",{},official+`CodemaoUltra开发者</div>`)
                            }
                            if(usercontent.id=="106081"){
                                addhtml(uctsyv,"div",{},official+`XWMM92小号</div>`)
                            }
                            if(usercontent.id=="8"){
                                addhtml(uctsyv,"div",{},vvvip+`shyfcka</div>`)
                            }
                            addhtml(uctsyv,"div",{},normalUsers+`UID:${usercontent.id}</div>`)
                        },1000)
                        p1.add({
                            "查看高清头像":()=>{
                                window.open(`https://static.box3.codemao.cn/block/${usercontent.avatar_hash}_cover_1024_1024.png`)
                            },
                        }, '查看高清头像').name('查看1024×1024高清头像');
                    }
                    else if(m=='shequWork'){
                        userhuanchun=null
                        p1.add(datas, '创作星空树').name('跳转到创作星空树');
                    }
                    else if(m=='shequCommunity'){
                        userhuanchun=null
                        //onload = async () => {
                        'use strict';
                        let link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.type = "text/css";
                        link.href = "https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css";
                        document.head.appendChild(link);
                        var doNotShield = {
                            width: 640,
                            height: 480,
                            run: async () => {
                                const content = document.querySelector(textarea).contentDocument.body;
                                const data = encodeURI(`<link href="https://static.codemao.cn/community/prism/prism.min.css" rel="stylesheet" type="text/css" />${content.innerHTML}`);
                                GM_xmlhttpRequest({
                                    method: "post",
                                    url: "https://static.box3.codemao.cn/block",
                                    data: data,
                                    binary: true,
                                    async onload({ response }) {
                                        document.querySelector(textarea).contentDocument.body.innerHTML = `<iframe src="//box3statichelper.pythonanywhere.com/hash.html?hash=${JSON.parse(response).Key}" style="width: ${doNotShield.width}px; height: ${doNotShield.height}px; display: block; margin: 40px auto; max-width: 100%;"></iframe>`;
                                    },
                                });
                            }
                        };
                        const textarea = "#react-tinymce-0_ifr";
                        //document.querySelector("#root > div > div.r-index--main_cont > div > div.r-community--right_search_container > div > div.r-community--search_header > a.r-community--send_btn").addEventListener("click", () => {
                        p1.add(doNotShield, "width", 10, 1500, 10).name("宽度（px）");
                        p1.add(doNotShield, "height", 10, 3000, 10).name("高度（px）");
                        p1.add(doNotShield, "run").name("使用防屏蔽功能");
                        //});
                        //document.querySelector("#root > div > div.r-index--main_cont > div > div:nth-child(4) > div > div.c-model_box--content_wrap > div > a").addEventListener("click", () => {
                        //
                        //});
                        //};
                    }
                    else if(m=="MapRead"){
                        userhuanchun=null
                        p1.add(datas2, '获取建造时间').name('获取开始制作时间');
                        p1.add(datas2, '查看高清封面').name('查看1024×1024高清封面');
                        p1.add(datas2, '查看全面展示图').name('查看全面+高清展示图');
                    }
                    else if(m=="ModelRead"){
                        userhuanchun=null
                        p1.add(datas2, '获取建造时间').name('获取开始制作时间');
                    }
                    else if(m=="MusicRead"){
                        userhuanchun=null
                        p1.add(datas, '未开放').name('本页面暂无其他扩展工具');
                    }
                    else if(m=="BoxStatic"){
                        userhuanchun=null;
                        p1.add(datas,'GBK').name('GBK乱码修复');
                        p1.add(datas,'GBK?').name('❔ 什么是GBK乱码');
                    }
                    else{
                        userhuanchun=null
                        p1.add(datas, '无功能').name('本页面暂无其他扩展工具')
                    }
                }
                if(/Play|Edit/.test(m)){
                    logs("地图模式："+m)
                    document.func = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
                    toolfunc=document.func
                    logs(document.func);
                    if(m=="Play"){
                        var nowDH= new Date().getHours()
                        // 防沉迷绕过功能已删
                        }else if(m=="Edit"){}
                    var interval = setInterval(()=>{
                        var jianceduixiang =
                            (
                                m=="Play"?
                                document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.eventBackendURL:
                                document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.language
                            )
                        if(jianceduixiang){
                            init(m);
                            clearInterval(interval);
                        }else{
                            toolfunc2 = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
                        }
                    },100);
                }else{
                    logs("其他模式："+m)
                    if(mode114514=='box'&&m!="BoxStatic"){
                        document.func = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website;
                        toolfunc=document.func;
                        logs(document.func);
                        var interval = setInterval(()=>{
                            var jianceduixiang =document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website.intl.locale;
                            if(jianceduixiang){
                                init(m);
                                clearInterval(interval);
                            }else{
                                toolfunc2 = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website;
                            }
                        },100);
                    }else{
                        init(m);
                        clearInterval(interval);
                    }
                }
            }
            // 网页提速
            // https://greasyfork.org/zh-CN/scripts/436453
            let util = {
                getValue(name) {
                    return GM_getValue(name);
                },
 
                setValue(name, value) {
                    GM_setValue(name, value);
                },
 
                include(str, arr) {
                    str = str.replace(/[-_]/ig, '');
                    for (let i = 0, l = arr.length; i < l; i++) {
                        let val = arr[i];
                        if (val !== '' && str.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                            return true;
                        }
                    }
                    return false;
                },
 
                addStyle(id, tag, css) {
                    tag = tag || 'style';
                    let doc = document, styleDom = doc.getElementById(id);
                    if (styleDom) return;
                    let style = doc.createElement(tag);
                    style.rel = 'stylesheet';
                    style.id = id;
                    tag === 'style' ? style.innerHTML = css : style.href = css;
                    doc.head.appendChild(style);
                },
 
                reg: {
                    chrome: /^https?:\/\/chrome.google.com\/webstore\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
                    edge: /^https?:\/\/microsoftedge.microsoft.com\/addons\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
                    firefox: /^https?:\/\/(reviewers\.)?(addons\.mozilla\.org|addons(?:-dev)?\.allizom\.org)\/.*?(?:addon|review)\/([^/<>"'?#]+)/,
                    microsoft: /^https?:\/\/(?:apps|www).microsoft.com\/(?:store|p)\/.+?\/([a-zA-Z\d]{10,})(?=[\/#?]|$)/,
                }
            };
 
            let main = {
                initValue() {
                    let value = [{
                        name: 'setting_success_times',
                        value: 0
                    }, {
                        name: 'allow_external_links',
                        value: true
                    }, {
                        name: 'allow_query_links',
                        value: true
                    }, {
                        name: 'enable_store_link',
                        value: true
                    }, {
                        name: 'enable_target_self',
                        value: false
                    }, {
                        name: 'enable_animation',
                        value: false
                    }, {
                        name: 'delay_on_hover',
                        value: 65
                    }, {
                        name: 'exclude_list',
                        value: ''
                    }, {
                        name: 'exclude_keyword',
                        value: 'login\nlogout\nregister\nsignin\nsignup\nsignout\npay\ncreate\nedit\ndownload\ndel\nreset\nsubmit\ndoubleclick\ngoogleads\nexit'
                    }];
 
                    value.forEach((v) => {
                        util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
                    });
                },
 
                registerMenuCommand() {
                    GM_registerMenuCommand('�� 已加速：' + util.getValue('setting_success_times') + '次', () => {
                        Swal.fire({
                            showCancelButton: true,
                            title: '确定要重置加速次数吗？',
                            icon: 'warning',
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            customClass: {
                                popup: 'instant-popup',
                            },
                        }).then((res) => {
                            if (res.isConfirmed) {
                                util.setValue('setting_success_times', 0);
                                history.go(0);
                            }
                        });
                    });
                    GM_registerMenuCommand('⚙️ 设置', () => {
                        let dom = `<div style="font-size: 1em;">
                              <label class="instant-setting-label">加速外部链接<input type="checkbox" id="S-External" ${util.getValue('allow_external_links') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label"><span>加速含参数链接 <a href="https://www.youxiaohou.com/tool/install-instantpage.html#%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E">详见</a></span><input type="checkbox" id="S-Query" ${util.getValue('allow_query_links') ? 'checked' : ''}
                              class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速扩展/应用商店链接<input type="checkbox" id="S-Store" ${util.getValue('enable_store_link') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速链接在当前页打开<input type="checkbox" id="S-Target" ${util.getValue('enable_target_self') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速动画效果<input type="checkbox" id="S-Animate" ${util.getValue('enable_animation') ? 'checked' : ''}
                              class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">链接预读延时（毫秒）<input type="number" min="65" id="S-Delay" value="${util.getValue('delay_on_hover')}"
                              class="instant-setting-input"></label>
                              <label class="instant-setting-label-col">排除下列网址 <textarea placeholder="列表中的域名将不开启加速器，一行一个，例如：www.baidu.com" id="S-Exclude" class="instant-setting-textarea">${util.getValue('exclude_list')}</textarea></label>
                              <label class="instant-setting-label-col">排除下列关键词 <textarea placeholder="链接中含关键词将不开启加速器，一行一个，例如：logout" id="S-Exclude-Word" class="instant-setting-textarea">${util.getValue('exclude_keyword')}</textarea></label>
                            </div>`;
                        Swal.fire({
                            title: '加速器配置',
                            html: dom,
                            showCloseButton: true,
                            confirmButtonText: '保存',
                            footer: '<div style="text-align: center;font-size: 1em;">点击查看 <a href="https://www.youxiaohou.com/tool/install-instantpage.html" target="_blank">使用说明</a>，助手免费开源，Powered by <a href="https://www.youxiaohou.com">油小猴</a></div>',
                            customClass: {
                                popup: 'instant-popup',
                            },
                        }).then((res) => {
                            if (res.isConfirmed) {
                                history.go(0);
                            }
                        });
 
                        document.getElementById('S-External').addEventListener('change', (e) => {
                            util.setValue('allow_external_links', e.currentTarget.checked);
                        });
                        document.getElementById('S-Query').addEventListener('change', (e) => {
                            util.setValue('allow_query_links', e.currentTarget.checked);
                        });
                        document.getElementById('S-Store').addEventListener('change', (e) => {
                            util.setValue('enable_store_link', e.currentTarget.checked);
                        });
                        document.getElementById('S-Target').addEventListener('change', (e) => {
                            util.setValue('enable_target_self', e.currentTarget.checked);
                        });
                        document.getElementById('S-Animate').addEventListener('change', (e) => {
                            util.setValue('enable_animation', e.currentTarget.checked);
                        });
                        document.getElementById('S-Delay').addEventListener('change', (e) => {
                            util.setValue('delay_on_hover', e.currentTarget.value);
                        });
                        document.getElementById('S-Exclude').addEventListener('change', (e) => {
                            util.setValue('exclude_list', e.currentTarget.value);
                        });
                        document.getElementById('S-Exclude-Word').addEventListener('change', (e) => {
                            util.setValue('exclude_keyword', e.currentTarget.value);
                        });
                    });
                },
 
                //在排除名单里
                inExcludeList() {
                    let exclude = util.getValue('exclude_list').split('\n');
                    let host = location.host;
                    return exclude.includes(host);
                },
 
                //加速主代码
                instantPage() {
                    if (window.instantLoaded) return;
                    let mouseoverTimer;
                    let lastTouchTimestamp;
                    const prefetches = new Set();
                    const prefetchElement = document.createElement('link');
                    const isSupported = prefetchElement.relList && prefetchElement.relList.supports && prefetchElement.relList.supports('prefetch')
                    && window.IntersectionObserver && 'isIntersecting' in IntersectionObserverEntry.prototype;
                    const isOnline = () => window.navigator.onLine;
                    const allowQueryString = 'instantAllowQueryString' in document.body.dataset || util.getValue('allow_query_links');
                    const allowExternalLinks = 'instantAllowExternalLinks' in document.body.dataset || util.getValue('allow_external_links');
                    const useWhitelist = 'instantWhitelist' in document.body.dataset;
                    const mousedownShortcut = 'instantMousedownShortcut' in document.body.dataset;
                    const DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION = 1111;
                    const enableAnimation = util.getValue('enable_animation');
                    const enableTargetSelf = util.getValue('enable_target_self');
                    const enableStoreLink = util.getValue('enable_store_link');
                    window.instantLoaded = true;
                    const excludeKeyword = util.getValue('exclude_keyword').split('\n');
 
                    let delayOnHover = util.getValue('delay_on_hover');
                    let useMousedown = false;
                    let useMousedownOnly = false;
                    let useViewport = false;
 
                    if ('instantIntensity' in document.body.dataset) {
                        const intensity = document.body.dataset.instantIntensity;
 
                        if (intensity.substr(0, 'mousedown'.length) === 'mousedown') {
                            useMousedown = true;
                            if (intensity === 'mousedown-only') {
                                useMousedownOnly = true;
                            }
                        } else if (intensity.substr(0, 'viewport'.length) === 'viewport') {
                            if (!(navigator.connection && (navigator.connection.saveData || (navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g'))))) {
                                if (intensity === "viewport") {
                                    if (document.documentElement.clientWidth * document.documentElement.clientHeight < 450000) {
                                        useViewport = true;
                                    }
                                } else if (intensity === "viewport-all") {
                                    useViewport = true;
                                }
                            }
                        } else {
                            const milliseconds = parseInt(intensity);
                            if (!Number.isNaN(milliseconds)) {
                                delayOnHover = milliseconds;
                            }
                        }
                    }
 
                    if (isSupported) {
                        const eventListenersOptions = {
                            capture: true,
                            passive: true,
                        };
 
                        if (!useMousedownOnly) {
                            document.addEventListener('touchstart', touchstartListener, eventListenersOptions);
                        }
 
                        if (!useMousedown) {
                            document.addEventListener('mouseover', mouseoverListener, eventListenersOptions);
                        } else if (!mousedownShortcut) {
                            document.addEventListener('mousedown', mousedownListener, eventListenersOptions);
                        }
 
                        if (mousedownShortcut) {
                            document.addEventListener('mousedown', mousedownShortcutListener, eventListenersOptions);
                        }
 
 
                        if (useViewport) {
                            let triggeringFunction;
                            if (window.requestIdleCallback) {
                                triggeringFunction = (callback) => {
                                    requestIdleCallback(callback, {
                                        timeout: 1500,
                                    });
                                };
                            } else {
                                triggeringFunction = (callback) => {
                                    callback();
                                };
                            }
 
                            triggeringFunction(() => {
                                const intersectionObserver = new IntersectionObserver((entries) => {
                                    entries.forEach((entry) => {
                                        if (entry.isIntersecting) {
                                            const linkElement = entry.target;
                                            intersectionObserver.unobserve(linkElement);
                                            preload(linkElement);
                                        }
                                    });
                                });
 
                                document.querySelectorAll('a').forEach((linkElement) => {
                                    if (isPreloadable(linkElement)) {
                                        intersectionObserver.observe(linkElement);
                                    }
                                });
                            });
                        }
                    }
 
                    function touchstartListener(event) {
                        /* Chrome on Android calls mouseover before touchcancel so `lastTouchTimestamp`
                 * must be assigned on touchstart to be measured on mouseover. */
                        lastTouchTimestamp = performance.now();
 
                        const linkElement = event.target.closest('a');
 
                        if (!isPreloadable(linkElement)) {
                            return;
                        }
 
                        preload(linkElement);
                    }
 
                    function mouseoverListener(event) {
                        if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
                            return;
                        }
 
                        if (!('closest' in event.target)) {
                            // Without this check sometimes an error “event.target.closest is not a function” is thrown, for unknown reasons
                            // That error denotes that `event.target` isn’t undefined. My best guess is that it’s the Document.
 
                            // Details could be gleaned from throwing such an error:
                            //throw new TypeError(`instant.page non-element event target: timeStamp=${~~event.timeStamp}, type=${event.type}, typeof=${typeof event.target}, nodeType=${event.target.nodeType}, nodeName=${event.target.nodeName}, viewport=${innerWidth}x${innerHeight}, coords=${event.clientX}x${event.clientY}, scroll=${scrollX}x${scrollY}`)
                            return
                        }
 
                        const linkElement = event.target.closest('a');
 
                        if (!isPreloadable(linkElement)) {
                            return;
                        }
 
                        linkElement.addEventListener('mouseout', mouseoutListener, {passive: true});
 
                        mouseoverTimer = setTimeout(() => {
                            preload(linkElement);
                            mouseoverTimer = undefined;
                        }, delayOnHover);
                    }
 
                    function mousedownListener(event) {
                        const linkElement = event.target.closest('a');
 
                        if (!isPreloadable(linkElement)) {
                            return;
                        }
 
                        preload(linkElement);
                    }
 
                    function mouseoutListener(event) {
                        if (event.relatedTarget && event.target.closest('a') === event.relatedTarget.closest('a')) {
                            return;
                        }
 
                        if (mouseoverTimer) {
                            clearTimeout(mouseoverTimer);
                            mouseoverTimer = undefined;
                        }
                    }
 
                    function mousedownShortcutListener(event) {
                        if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
                            return;
                        }
 
                        const linkElement = event.target.closest('a');
 
                        if (event.which > 1 || event.metaKey || event.ctrlKey) {
                            return;
                        }
 
                        if (!linkElement) {
                            return;
                        }
 
                        linkElement.addEventListener('click', function (event) {
                            if (event.detail === 1337) {
                                return;
                            }
                            event.preventDefault();
                        }, {capture: true, passive: false, once: true});
                        const customEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            detail: 1337
                        });
                        linkElement.dispatchEvent(customEvent);
                    }
                    function isPreloadable(linkElement) {
                        if (!linkElement || !linkElement.href) {
                            return;
                        }
                        if (util.include(linkElement.href, excludeKeyword)) {
                            if (!util.reg.chrome.test(linkElement.href) &&
                                !util.reg.edge.test(linkElement.href) &&
                                !util.reg.edge.test(linkElement.href) &&
                                !util.reg.microsoft.test(linkElement.href)) {
                                return;
                            }
                        }
                        if (useWhitelist && !('instant' in linkElement.dataset)) {
                            return;
                        }
                        if (!allowExternalLinks && linkElement.origin !== location.origin && !('instant' in linkElement.dataset)) {
                            return;
                        }
                        if (!['http:', 'https:'].includes(linkElement.protocol)) {
                            return;
                        }
                        if (linkElement.protocol === 'http:' && location.protocol === 'https:') {
                            if (linkElement.href.indexOf('http://www.baidu.com/link?url') === 0) {
                                linkElement.href = linkElement.href.replace('http', 'https');
                            } else {
                                return;
                            }
                        }
                        //下载文件不加速
                        if (/\.[a-zA-Z0-9]{0,5}$/i.test(linkElement.href)) {
                            //排除域名，网站扩展名
                            if (!/(com|cn|top|ltd|net|tech|shop|vip|xyz|wang|cloud|online|site|love|art|xin|store|fun|cc|website|press|space|beer|luxe|video|ren|group|fit|yoga|org|pro|ink|biz|info|design|link|work|mobi|kim|pub|name|tv|co|asia|red|live|wiki|gov|life|world|run|show|city|gold|today|plus|cool|icu|company|chat|zone|fans|law|host|center|club|email|fund|social|team|guru|htm|html|php|asp|jsp)$/i.test(linkElement.href)) {
                                return;
                            }
                        }
                        if (!allowQueryString && linkElement.search && !('instant' in linkElement.dataset)) {
                            return;
                        }
                        if (linkElement.hash && linkElement.pathname + linkElement.search === location.pathname + location.search) {
                            return;
                        }
                        if (linkElement.dataset.filename || linkElement.dataset.noInstant) {
                            return;
                        }
                        return true;
                    }
                    function preload(linkElement) {
                        let url = linkElement.href;
                        if (!isOnline()) {
                            return;
                        }
                        if (prefetches.has(url)) {
                            return;
                        }
                        if (enableStoreLink) {
                            if (util.reg.chrome.test(url)) {
                                linkElement.href = url.replace("chrome.google.com", "chrome.crxsoso.com");
                            }
                            if (util.reg.edge.test(url)) {
                                linkElement.href = url.replace("microsoftedge.microsoft.com", "microsoftedge.crxsoso.com");
                            }
                            if (util.reg.firefox.test(url)) {
                                linkElement.href = url.replace("addons.mozilla.org", "addons.crxsoso.com");
                            }
                            if (util.reg.microsoft.test(url)) {
                                linkElement.href = url.replace(/(www|apps)\.microsoft\.com/, "apps.crxsoso.com");
                            }
                        }
                        const prefetcher = document.createElement('link');
                        prefetcher.rel = 'prefetch';
                        prefetcher.href = url;
                        document.head.appendChild(prefetcher);
                        prefetches.add(url);
                        if (enableAnimation) {
                            linkElement.classList.add("link-instanted");
                        }
                        if (enableTargetSelf) {
                            linkElement.target = '_self';
                        }
                        util.setValue('setting_success_times', util.getValue('setting_success_times') + 1);
                    }
                },
                addPluginStyle() {
                    let style = `
                .instant-popup { font-size: 14px !important; }
                .instant-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                .instant-setting-label-col { display: flex;align-items: flex-start;;padding-top: 15px;flex-direction:column }
                .instant-setting-checkbox { width: 16px;height: 16px; }
                .instant-setting-textarea { width: 100%; margin: 14px 0 0; height: 60px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #666; line-height: 1.2; }
                .instant-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
                 @keyframes instantAnminate { from { opacity: 1; } 50% { opacity: 0.4 } to { opacity: 0.9; }}
                .link-instanted { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
                .link-instanted * { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
            `;
                    if (document.head) {
                        util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                        util.addStyle('instant-style', 'style', style);
                    }
                    const headObserver = new MutationObserver(() => {
                        util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                        util.addStyle('instant-style', 'style', style);
                    });
                    headObserver.observe(document.head, {childList: true, subtree: true});
                },
                init() {
                    this.initValue();
                    this.addPluginStyle();
                    this.registerMenuCommand();
                    if (this.inExcludeList()) return;
                    this.instantPage();
                }
            };
            main.init();
            //css样式
            addhtml(document.body,"style",{type:"text/css"},`
 
.box3edittooldiv {
    position: fixed;
    background: #383838;
    color: #fff;
    padding: 20px;
    right: 0px;
    bottom: 0px;
    box-shadow: 0px 0px 30px -10px #000;
    margin: 8px 20px;
    z-index:999999;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
}
.box3edittooldiv .div{
    display: flex;
    align-items: center;
    align-content: center;
    flex-direction: row;
    margin-top: 5px;
}
.box3edittooldiv[show=false] {
    display: none
}
.box3edittooldivycxx {
    position: fixed;
    right: 0px;
    bottom: -16.75px;
    box-shadow: 0px 0px 30px -10px #000;
    z-index:999999;
    transition: .5s;
}
.box3edittooldivycxx:hover {
    bottom: 0px;
}
.box3edittooldivycxx[show=false] {
    display: none
}
.box3edittooldiv .db{
    color: #fff;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    align-content: center;
    flex-direction: row;
}
.box3edittooldiv .db div{
    margin-right: 20px;
}
.box3edittooldiv .div button{margin-right: 5px;}
.box3edittooldiv button[zdy]{background:#0000;color:#fff;position: absolute;top: 0;right: 0;z-index:99999999999999999999999999999999999999999999999999999999999999999}
.box3edittooldiv .ahref{color:currentColor}
.box3edittooldiv .ahref:hover{text-decoration: underline;color:#fff}
.box3edittooldiv .ahref:active{color:#f44747}
.box3edittooldiv .db button{
    font-size:30px;
    padding: 0px 10px;
    border-top-right-radius: 10px;
    transition: .1s;
}
.box3edittooldiv .db button:hover{
    background:#a00a
}
.box3tooldialog {
    top: inherit;
    left: inherit;
    bottom: inherit;
    right: inherit;
    margin: 0;
}
.box3tooldialog .db button[jy=true] {
    opacity: .5;
    cursor: no-drop;
}
.box3tooldialog .ydtzd {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    cursor: all-scroll;
}
.box3edittooldiv .db div font{
    max-height: 100px;
    overflow: auto;
    padding:5px 5px 0px 0px
}
.box3edittooldiv .db div font::-webkit-scrollbar {
    height: 5px;
    width: 5px;
}
.box3edittooldiv .db div font::-webkit-scrollbar-thumb {
    background: #aaa5;
    border-radius: 50px
}
.box3edittooldiv .db div font::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}
.box3edittooldiv .db div font::-webkit-scrollbar-thumb:active {
    background: #aaa3;
}
.box3edittooldiv .db div font::-webkit-scrollbar-track {
    background: #0000;
    border-radius: 50px
}
 
.box3edittooldiv .div textarea::-webkit-scrollbar {
    height: 5px;
    width: 5px;
}
.box3edittooldiv .div textarea::-webkit-scrollbar-thumb {
    background: #aaa5;
    border-radius: 50px
}
.box3edittooldiv .div textarea::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}
.box3edittooldiv .div textarea::-webkit-scrollbar-thumb:active {
    background: #aaa3;
}
.box3edittooldiv .div textarea::-webkit-scrollbar-track {
    background: #0000;
    border-radius: 50px
}
 
.box3tooldialog.dongtai{
    transition: .25s cubic-bezier(0, 0, 0, 0.9);
}
.box3tooldialog.kaishizhuangtai{
    transform: scale(0.75);
    opacity: 0;
}
._3ad7RnKp0WvPrytuJgHNZC {
    width: auto;
    padding: 0px 8px;
    height: 20px;
    font-size: 12px;
    margin-right: 5px;
    user-select: text !important;;
}
._3ad7RnKp0WvPrytuJgHNZC::selection{
    background:#ff952b50;color:#fff
}
._2p590X3xza5oTJJZ3ToFcx ._1yZ6NeMjfGScb4F10xmspg {
  width: calc(25% - 120px);
}
 
 
`);
 
        }catch (error) {
            if(/_reactRootContainer|_internalRoot|current|updateQueue|baseState|element|props|children/.test(error.message)){setTimeout(()=>{run()},100);return}

        }
    }
    setTimeout(()=>{run()},100)//加载时需要等待
})();