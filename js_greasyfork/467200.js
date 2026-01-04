// ==UserScript==
// @name         MutliQRCode
// @namespace    https://greasyfork.org/zh-CN/users/1073349
// @version      0.5.4
// @description  PC端和移动端都可用的二维码识别
// @author       4ehex
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwLWlkPSI3NjA1Ij48cGF0aCBkPSJNMTg2LjAyNjY2NyAwaDY1MS45NDY2NjZRMTAyNCAwIDEwMjQgMTg2LjAyNjY2N3Y2NTEuOTQ2NjY2UTEwMjQgMTAyNCA4MzcuOTczMzMzIDEwMjRIMTg2LjAyNjY2N1EwIDEwMjQgMCA4MzcuOTczMzMzVjE4Ni4wMjY2NjdRMCAwIDE4Ni4wMjY2NjcgMHoiIGZpbGw9IiMzNjg5RjUiIHAtaWQ9Ijc2MDYiPjwvcGF0aD48cGF0aCBkPSJNMjEzLjMzMzMzMyAzMDQuNjRBOTAuODggOTAuODggMCAwIDEgMzA0LjIxMzMzMyAyMTMuMzMzMzMzaDkwLjg4djQyLjY2NjY2N0gzMDYuMzQ2NjY3YTQ1LjY1MzMzMyA0NS42NTMzMzMgMCAwIDAtNDYuNTA2NjY3IDQ4LjY0djkxLjczMzMzM0gyMTMuMzMzMzMzek0zOTYuOCA4MTAuNjY2NjY3SDMwNi4zNDY2NjdhOTAuNDUzMzMzIDkwLjQ1MzMzMyAwIDAgMS05MC44OC05MS4zMDY2Njd2LTkxLjczMzMzM2g0Ni41MDY2NjZ2OTEuNzMzMzMzQTQ1LjY1MzMzMyA0NS42NTMzMzMgMCAwIDAgMzA4LjA1MzMzMyA3NjhoOTAuODhhMjk4LjY2NjY2NyAyOTguNjY2NjY3IDAgMCAwLTIuMTMzMzMzIDQyLjY2NjY2N3pNODEwLjY2NjY2NyA3MTkuMzZBOTAuNDUzMzMzIDkwLjQ1MzMzMyAwIDAgMSA3MTcuNjUzMzMzIDgxMC42NjY2NjdINjI3LjJ2LTQ2LjkzMzMzNGg5MC40NTMzMzNhNDUuNjUzMzMzIDQ1LjY1MzMzMyAwIDAgMCA0Ni41MDY2NjctNDYuNTA2NjY2di05MS4zMDY2NjdIODEwLjY2NjY2N3pNMjEzLjMzMzMzMyA0ODcuNjhoNTk1LjJ2NDYuOTMzMzMzSDIxMy4zMzMzMzN6TTgxMC42NjY2NjcgMzk2LjM3MzMzM2gtNDguNjRWMzA0LjY0YTQ1LjY1MzMzMyA0NS42NTMzMzMgMCAwIDAtNDYuMDgtNDYuNTA2NjY3aC05MC44OFYyMTMuMzMzMzMzaDkwLjg4YTkwLjg4IDkwLjg4IDAgMCAxIDkwLjg4IDkxLjMwNjY2N3oiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9Ijc2MDciPjwvcGF0aD48L3N2Zz4=
// @require      https://update.greasyfork.org/scripts/469053/1207999/jsQR.js
// @grant        unsafeWindow
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/467200/MutliQRCode.user.js
// @updateURL https://update.greasyfork.org/scripts/467200/MutliQRCode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //全局变量 被选中的图片src
    var g_img_src = null;
    var g_is_moblie_env = isPhone();
    var g_cors_proxy = ['https://api.allorigins.win/get?url=', 'https://corsproxy.io/?', 'GM_xmlhttpRequest'];
    var g_usr_diy_cors = GM_getValue('usr_diy_cors', '');
    var g_cur_use_cors = GM_getValue('cur_use_cors', g_cors_proxy[0]);

    //适配移动端 很多移动端浏览器并没有实现油猴接口
    //添加'识别二维码'按钮样式
    let btn_style = document.createElement('style');
    btn_style.type = 'text/css';
    if (!g_is_moblie_env){
        btn_style.innerText = `.idtfy_div{width:5.5vw;height:2.1vh;font-size:1vh;color:#000000;background:#F8F8FF;border-radius:1.5vh;border:0.12vh solid #f2cac9;line-height:2vh;text-align:center;vertical-align:middle;z-index:99999999;display:none;position:absolute;top:20;left:20;cursor:pointer;box-shadow:0.13vh 0.13vh 0.1vh #888888;}`;
        //GM_addStyle(`.idtfy_div{width:5.5vw;height:2.1vh;font-size:1vh;color:#000000;background:#F8F8FF;border-radius:1.5vh;border:0.12vh solid #f2cac9;line-height:2vh;text-align:center;vertical-align:middle;z-index:99999999;display:none;position:absolute;top:20;left:20;cursor:pointer;box-shadow:0.13vh 0.13vh 0.1vh #888888;}`);
    }
    else{
        btn_style.innerText = `.idtfy_div{width:25vw;height:3vh;font-size:1.6vh;color:#000000;background:#F8F8FF;border-radius:1.5vh;border:0.14vw solid #f2cac9;line-height:3vh;text-align:center;vertical-align:middle;z-index:99999999;display:none;position:absolute;top:20;left:20;cursor:pointer;box-shadow:0.15vw 0.15vw 0.13vw #888888;}`;
    }
    document.head.appendChild(btn_style);

    //添加'识别二维码'按钮
    var identify_div = document.createElement('div');
    identify_div.id = 'identify_div';
    identify_div.className = 'idtfy_div';//👇添加一个图标
    identify_div.innerHTML = `<svg class="icon" style="width:1.3vh;height:1.3vh;vertical-align:middle;fill:currentColor;overflow:hidden" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3325"><path d="M613.888 715.264h-41.984C448.512 715.264 348.16 614.912 348.16 491.52s99.84-223.232 223.232-223.232h41.984c123.392 0 223.232 99.84 223.232 223.232 0.512 123.392-99.328 223.744-222.72 223.744z" fill="#CAD3FF" opacity=".2" p-id="3326"></path><path d="M873.984 940.032h-152.576c-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6h147.456v-147.456c0-14.336 11.264-25.6 25.6-25.6s25.6 11.264 25.6 25.6v152.576c0 25.088-20.48 46.08-46.08 46.08zM894.464 311.296c-14.336 0-25.6-11.264-25.6-25.6v-148.48h-147.456c-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6h152.576c25.6 0 46.08 20.48 46.08 46.08v153.6c0 13.824-11.264 25.6-25.6 25.6z m-20.48-174.08zM131.072 311.296c-14.336 0-25.6-11.264-25.6-25.6v-153.6c0-25.6 20.48-46.08 46.08-46.08h152.576c14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6H156.672v148.48c0 13.824-11.776 25.6-25.6 25.6zM304.128 940.032H151.552c-25.6 0-46.08-20.48-46.08-46.08v-152.576c0-14.336 11.264-25.6 25.6-25.6s25.6 11.264 25.6 25.6v147.456h147.456c14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6zM726.528 537.6H297.472c-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6h429.056c14.336 0 25.6 11.264 25.6 25.6s-11.776 25.6-25.6 25.6z" fill="#4E63DD" p-id="3327"></path></svg> 识别二维码`;
    identify_div.onclick = OnClickedIdentifyBtn;
    document.body.appendChild(identify_div);

    //添加精简后的'notie.js' 一款纯js实现的消息弹窗
    var notie=function(){function E(a,b,c){document.activeElement.blur(),D++,setTimeout(function(){D--},1e3*e+10),1==D&&(A?(clearTimeout(B),clearTimeout(C),G(function(){F(a,b,c)})):F(a,b,c))}function F(b,c,d){A=!0;var f=0;switch(f="undefined"==typeof d?3e3:1>d?1e3:1e3*d,b){case 1:v.style.backgroundColor=g,v.onclick=function(){};break;case 2:v.style.backgroundColor=h,v.onclick=w;break;case 3:v.style.backgroundColor=i,v.onclick=w;break;case 4:v.style.backgroundColor=j,v.onclick=w}y.innerHTML=c,v.style.top="-10000px",v.style.display="table",v.style.top="-"+v.offsetHeight-5+"px",B=setTimeout(function(){a&&(v.style.boxShadow="0px 0px 10px 0px rgba(0,0,0,0.5)"),v.style.MozTransition="all "+e+"s ease",v.style.WebkitTransition="all "+e+"s ease",v.style.transition="all "+e+"s ease",v.style.top=0,C=setTimeout(function(){G(function(){})},f)},20)}function G(b){v.style.top="-"+v.offsetHeight-5+"px",setTimeout(function(){a&&(v.style.boxShadow=""),v.style.MozTransition="",v.style.WebkitTransition="",v.style.transition="",v.style.top="-10000px",A=!1,b&&b()},1e3*e+10)}var v,w,x,y,A,B,C,D,a=!0,b="18px",c="24px",d=600,e=.3,g="#57BF57",h="#E3B771",i="#E1715B",j="#4D82D6",k="#FFF",l="notie-alert-outer",m="notie-alert-inner",n="notie-alert-text",o=function(a){a.style.fontSize=window.innerWidth<=d?b:c},p=500,q=function(a,b,c){var d;return function(){var e=this,f=arguments,g=function(){d=null,c||a.apply(e,f)},h=c&&!d;clearTimeout(d),d=setTimeout(g,b),h&&a.apply(e,f)}};return window.addEventListener("keydown",function(a){var b=13==a.which||13==a.keyCode,c=27==a.which||27==a.keyCode;A&&(b||c)&&(clearTimeout(B),clearTimeout(C),G())}),"undefined"==typeof Element.prototype.addEventListener&&(Element.prototype.addEventListener=Window.prototype.addEventListener=function(a,b){return a="on"+a,this.attachEvent(a,b)}),v=document.createElement("div"),v.id=l,v.style.position="fixed",v.style.top="0",v.style.left="0",v.style.zIndex="999999999",v.style.height="auto",v.style.width="100%",v.style.display="none",v.style.textAlign="center",v.style.cursor="default",v.style.MozTransition="",v.style.WebkitTransition="",v.style.transition="",v.style.cursor="pointer",w=function(){clearTimeout(B),clearTimeout(C),G()},x=document.createElement("div"),x.id=m,x.style.padding="20px",x.style.display="table-cell",x.style.verticalAlign="middle",v.appendChild(x),y=document.createElement("span"),y.id=n,y.style.color=k,y.style.fontSize=window.innerWidth<=d?b:c,window.addEventListener("resize",q(o.bind(null,y),p),!0),x.appendChild(y),document.body.appendChild(v),A=!1,D=0,{alert:E,alert_hide:G}}();
    //👆以上混淆纯粹为了压缩体积 原作者代码: https://github.com/jaredreich/notie

    if (!g_is_moblie_env){
        //电脑端 右键弹出 双击隐藏
        window.onmousedown = function(e) {
            if (e.button == 2) {//右键
                var clickedElement = e.target;
                if (clickedElement.id == 'identify_div'){
                    SelectCorsProxy();
                    document.getElementById("identify_div").style.display = 'none';
                }
                else if ((g_img_src = GetQRSrc(clickedElement)) != null){
                    document.getElementById("identify_div").style.top = (e.pageY + 10) + "px";
                    document.getElementById("identify_div").style.left = (e.pageX) + "px";
                    document.getElementById("identify_div").style.display = 'block';
                }
                else{
                    document.getElementById("identify_div").style.display = 'none';
                }
            }
        };

        window.ondblclick = function(e) {//双击隐藏按钮
            document.getElementById("identify_div").style.display = 'none';
        };
    }
    else{
        //移动端 监听长按事件
        let time_out = 0, touch_time = 800;
        window.addEventListener("touchstart", function(e){
            time_out = setTimeout(function(){
                var touchedElement = e.target;
                if (touchedElement.id == 'identify_div'){
                    //长按识别按钮 弹出设置跨域代理服务器的设置窗口
                    SelectCorsProxy();
                    document.getElementById("identify_div").style.display = 'none';
                }
                else if ((g_img_src = GetQRSrc(touchedElement)) != null) {
                    document.getElementById("identify_div").style.top = (e.touches[0].pageY - 50) + "px";
                    document.getElementById("identify_div").style.left = (e.touches[0].pageX + 20) + "px";
                    document.getElementById("identify_div").style.display = 'block';
                }
            }, touch_time);//touch_time毫秒后弹出识别按钮

            //触碰其他地方则隐藏按钮
            if (e.target.id != 'identify_div'){
                g_img_src = null;
                document.getElementById("identify_div").style.display = 'none';
            }
        });
        window.addEventListener("touchmove", function(e){
            // 如果触摸未达到 touch_time ms且开始移动，则清除计时器
            clearTimeout(time_out);
            time_out = 0;
        });
        window.addEventListener("touchend", function(e){
            // 如果触摸未达到 touch_time ms且离开屏幕，则清除计时器
            clearTimeout(time_out);
            time_out = 0;
        });
    }

    //设置/选择跨域代理服务器
    function SelectCorsProxy(){
        let select_html = `<select id="cors_select" style="width:200px; margin: 0px 5px;">[options_]</select><button id="sys_cors_btn">选用</button>`,
            options_html, usr_input_html = `<input id="usr_cors_input" placeholder="输入自定义代理网址" style="width:200px; margin: 0px 5px;" type="text" value="${g_usr_diy_cors}"><button id="usr_cors_btn">选用</button>`;
        for (let i = 0, len = g_cors_proxy.length; i < len; i++){
            options_html += `<option>${g_cors_proxy[i]}</option>`;
        }
        select_html = select_html.replace('[options_]', options_html);
        let setting_html = `<div>` + select_html + `<br>`+ usr_input_html + `<br><a id="cors_close_btn" href="javascript:void(0);">关闭</a></div>`;
        notie.alert(1, '选择一个跨域代理服务器<div style="color:blue">当前代理:' + g_cur_use_cors + '</div>' + setting_html, 60);
        setTimeout(()=>{
            document.getElementById("sys_cors_btn").onclick = function(){
                let obj = document.getElementById('cors_select');
                let text = obj.options[obj.selectedIndex].text; // 选中文本
                GM_setValue('cur_use_cors', text);
                g_cur_use_cors = text;
                notie.alert_hide();
            };
            document.getElementById("usr_cors_btn").onclick = function(){
                let obj = document.getElementById('usr_cors_input');
                let text = obj.value;
                GM_setValue('usr_diy_cors', text);
                g_usr_diy_cors = text;
                GM_setValue('cur_use_cors', text);
                g_cur_use_cors = text;
                notie.alert_hide();
            };
            document.getElementById("cors_close_btn").onclick = function(){notie.alert_hide();};
        }, 500);
    }

    //通过UA判断是否是移动端
    function isPhone() {
        var info = navigator.userAgent;
        var isPhone = /mobile/i.test(info);
        return isPhone;
    }

    //从传入的元素中获取IMG元素的src 若没有则返回null
    function GetQRSrc(ele){
        let ret_src = null;
        let ele_tag_name = ele.tagName.toLowerCase();//'IMG' 'svg' 'CANVAS'

        if (ele_tag_name == 'img'){
            if (ele.src != null) ret_src = ele.src;
        }
        else if(ele_tag_name == 'svg'){
            ret_src = svg2b64(ele);
        }
        else if (ele_tag_name == 'canvas'){
            ret_src = ele.toDataURL();
        }
        else{
            //获取同胞元素 判断完同胞元素还需要判断子元素 因为可能获取到不是选择的图片
            for (let i = 0, sibling = ele.nextElementSibling;i < 6 && sibling != null; sibling = sibling.nextElementSibling, i++){
                if (sibling.tagName == 'IMG' && sibling.src != null){
                    ret_src = sibling.src;
                    break;
                }
            }

            //遍历子元素看看是否有图片
            var childs = ele.childNodes;
            if (childs.length >= 6) return ret_src;
            for(var i = childs.length - 1; i >= 0; i--) {
                if (childs[i].tagName == 'IMG' && childs[i].src != null){
                    ret_src = childs[i].src;
                    break;
                }
            }
        }

        return ret_src;
    }

    //将图片URL转为jsqr需要的数据
    function Img2CanvasData(img_url){
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 500;
            canvas.height = 500;
            const img = new Image();
            //img.crossOrigin = '';
            img.onerror = () => {
                notie.alert(3, 'Image Err!', 4);
            };
            img.onload = () => {
                try{
                    ctx.drawImage(img, 0, 0,300,300);
                    let data = ctx.getImageData(0, 0, 300, 300).data;
                    resolve(data);
                }
                catch(e){
                    reject(e);
                }
            };
            img.src = img_url;
        });
    }

    //cb_ok\cb_failed识别成功\失败时的回调函数
    function IdentifyQRCode(data, cb_ok, cb_failed){
        Img2CanvasData(data).then( res=>{
            const code = jsQR(res, 300, 300, {
                inversionAttempts: "dontInvert",
            });
            if (code) cb_ok(code.data, data); else cb_failed('IdentifyError', data);
        }).catch(err=>{
            cb_failed(err.name, data);
        });
    }

    //'识别二维码'按钮事件
    function OnClickedIdentifyBtn(){
        if ((typeof jsQR != 'function')){
            notie.alert(2, '外部JS脚本未加载成功!', 3);
            return;
        }

        if (g_img_src == null){
            notie.alert(2, '未选中任何图片', 2);
        }
        else {
            IdentifyQRCode(g_img_src, callback_ok, function(msg, url_){
                if (msg == 'IdentifyError'){
                    notie.alert(3, '识别失败!', 3);
                }
                else if (msg == 'SecurityError'){
                    if (g_cur_use_cors == 'GM_xmlhttpRequest'){//使用GM_xmlhttpRequest
                        SyncXmlHttpRequest(url_, 'GET').then(data=>{
                            if (data != null){
                                IdentifyQRCode(data, callback_ok, function(){
                                    setTimeout(()=>{
                                        notie.alert(3, '识别失败!', 3);
                                    }, 500);
                                });
                            }
                            else{
                                notie.alert(3, '图片数据为空!', 3);
                            }
                        }).catch(err=>{
                            notie.alert(3, 'SyncXmlHttpRequest Err: ' + err, 6);
                        });
                    }
                    else{//使用跨域代理服务器
                        if (g_cur_use_cors == '' || !isMaybeURL(g_cur_use_cors)) {
                            notie.alert(2, '代理服务器不是一个正确的网址', 3);
                            return;
                        }
                        notie.alert(4, '等待跨域代理服务器返回图片数据<div>⋘ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡... ⋙</div>', 20);
                        let cors_proxy = g_cur_use_cors + encodeURIComponent(url_);
                        fetchImage(cors_proxy).then((img_src)=>{
                            if (img_src != null){
                                IdentifyQRCode(img_src, callback_ok, function(){
                                    setTimeout(()=>{
                                        notie.alert(3, '识别失败!', 3);
                                    }, 500);//不等待500ms这个提示框会弹不出来，不知道为啥
                                });
                            }
                            else{
                                notie.alert(3, '图片数据为空!', 3);
                            }
                        });
                    }
                }
                else{
                    notie.alert(3, '未知错误!', 3);
                }
            });
        }
        document.getElementById("identify_div").style.display = 'none';
    }

    //'复制'按钮单击事件
    function OnClickedCopyBtn(){
        //GM_setClipboard(document.getElementById("notie_all_text").innerText);
        navigator.clipboard.writeText(document.getElementById("notie_all_text").innerText);
        notie.alert(1, '复制成功!', 2);
    }

    //判字符串是否可能为URL
    function isMaybeURL(str) {
        let is_maybe = false;
        if ((str.indexOf('://') != -1) ||
            (str.substr(0, 3) == 'www') ||
            (str.indexOf('.com') != -1 || str.indexOf('.cn') != -1 || str.indexOf('.org') != -1 || str.indexOf('.net') != -1) ||
            (str.indexOf('.') != -1 && str.indexOf('/') != -1)) is_maybe = true;
        return is_maybe;
    }

    //fetch获取图片
    async function fetchImage(get_url) {
        try {
            const response = await fetch(get_url, {mode: "cors"});
            if (!response.ok) {
                throw new Error("Network response was not OK");
            }
            let img_data = null,
                data_type = response.headers.get("content-type"), data;
            if (data_type == "application/json"){
                data = await response.json();
                if (data.contents.length != 0) {
                    img_data = data.contents;
                }
            }
            else if (data_type.indexOf('image') != -1){
                data = await response.blob();
                img_data = URL.createObjectURL(data);
            }
            return img_data;

        } catch (error) {
            console.error("[Debug] There has been a problem with fetch operation:" + error);
            notie.alert(3, 'There has been a problem with fetch operation:' + error, 3);
            return null;
        }
    }

    //以同步方式发送跨域请求
    function SyncXmlHttpRequest(request_url, method_type) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method_type,
                url: request_url,
                responseType: "blob",
                onload: function(response) {
                    if (response.status != 200){
                        return reject("Response Not 200 OK!");
                    }

                    if (typeof response.response == 'undefined') return reject('你的油猴不支持blob返回值');

                    let data = response.response, img_data;
                    if (data.length != 0){
                        //img_data = b64EncodeUnicode(data);
                        //console.log(img_data);
                        //return resolve('data:image/png;base64,' + img_data);

                        img_data = URL.createObjectURL(data);
                        return resolve(img_data);
                    }
                    return reject('response data is empty!');

                },
                onerror: function(err) {
                    return reject(err);
                }
            });
        });
    }

    function callback_ok(text, url_){
        let display_text = text, ope_html = '<div><a id="notie_copy_btn" href="javascript:void(0);">复制</a>[placeholder_]<a id="notie_close_btn" style="margin-left: 20px" href="javascript:void(0);">关闭</a></div>';
        if (g_is_moblie_env && (text.length >= 40)){//如果是移动端 且识别内容过长 则隐藏一部分内容
            display_text = text.substr(0, 35) + '...';
        }
        if (isMaybeURL(text)){
            let jump_url = text;
            if (jump_url.indexOf('://') == -1) jump_url = 'https://' + jump_url;
            ope_html = ope_html.replace("[placeholder_]", '<a id="goto_btn" href="' + jump_url + '" target="_blank" style="margin-left: 20px">转到</a>');
        }
        else{
            ope_html = ope_html.replace("[placeholder_]", '<a id="notie_search_btn" href="https://www.baidu.com/s?wd=' + encodeURIComponent(text) + '" target="_blank" style="margin-left: 20px">搜索</a>');
        }
        setTimeout(()=>{
            notie.alert(1, '<a id="notie_all_text" style="display: none;">'+ text +'</a>识别到以下文本:<br><div style="word-wrap:break-word;">' + display_text + '</div>' + ope_html, 20);
            setTimeout(()=>{
                document.getElementById("notie_copy_btn").onclick = OnClickedCopyBtn;
                document.getElementById("notie_close_btn").onclick = function(){notie.alert_hide();};
            }, 500);
        }, 300);

    }

    //svg转base64
    function svg2b64(svg_ele) {
        const s = new XMLSerializer().serializeToString(svg_ele);
        const ImgBase64 = `data:image/svg+xml;base64,${window.btoa(s)}`;
        return ImgBase64;
    }

    function b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded Unicode,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {return String.fromCharCode('0x' + p1);}));
    }
})();