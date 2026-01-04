// ==UserScript==
// @name         检测视频号博主更新
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description   检测视频号博主更新1
// @author       yutou
// @match        *://mp.weixin.qq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/496038/%E6%A3%80%E6%B5%8B%E8%A7%86%E9%A2%91%E5%8F%B7%E5%8D%9A%E4%B8%BB%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/496038/%E6%A3%80%E6%B5%8B%E8%A7%86%E9%A2%91%E5%8F%B7%E5%8D%9A%E4%B8%BB%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==
(function () {
    const urls = new URL(window.location.href);
    const params = new URLSearchParams(urls.search);
    const tokens = params.get('token');

    GM_setValue('token', tokens)//
    var token = GM_getValue("token")
    var key = GM_getValue("key")?GM_getValue("key") : "点击设置"

    var sudu = GM_getValue("sudu")?GM_getValue("sudu"):60000
    if (!sudu) {
        GM_setValue('sudu', "60000")//默认60秒
    }
 

    let elscript = document.createElement('script');
    elscript.setAttribute('type', 'text/javascript');
    elscript.src = "https://unpkg.com/layui@2.6.8/dist/layui.js";
    document.head.appendChild(elscript);

    var url='https://mp.weixin.qq.com/cgi-bin/videosnap?action=get_feed_list'



    GM_addStyle(`
    .boby{
        border-style:double;
        background:#ffffff;
        width:300px;height:500px;
        position: fixed;z-index: 100000;
        overflow-x: hidden;transition: 0.5s;box-shadow:0px 1px 10px rgba(0,0,0,0.3);bottom:1vh;justify-items: center;
        text-align: center;
    }
    .input{
        font-weight: 700;
        background: #fff no-repeat center;
        height: 80px;
        padding-top: 10px;
    }
    .inp {
        border-style: double;
        font-weight: 700;
        position: fixed;
        bottom: 10vh;
        z-index: 9999999999;
        background: #fff no-repeat center;
        height: 100px;
        right: 5vh;
        width: 200px;
    }
    .bu{
        width: 130px;
        color:#fff;
        margin: 5px;
    }
    .user{
        text-align: left;
        margin: 10px;
    }
    .diy{
    margin: 100px;
    }
    .btncolor{
        color:#16b777
    }
    `
    )


    var backgrounda = document.createElement("div")
    backgrounda.id = "backgrounda"
    backgrounda.innerHTML = "<link rel='stylesheet' href='https://unpkg.com/layui@2.6.8/dist/css/layui.css'><boby class='boby' style=''>" +
        "<div id='suduid' style='margin: 20px;' >当前速度：" + sudu + "毫秒</div>" +
        "<div style='display: flex'><div id='tzkey' style='margin: 0px 50px 20px 20px;' >KEY：" + key + "</div><a  target='_blank' href='https://sct.ftqq.com/' _t>注册</a></div>" +
        "<div class='input' > <div> " +
        " <button  id ='one'   class=' layui-btn-lg  bu layui-bg-orange'>启动</button>" +
        "<button id='two' class=' layui-btn-lg layui-bg-red bu'>停止</button>" +
        "<button id='jia' class='layui-btn-lg layui-btn-normal bu'>添加账号</button>" +
        "<button id='three' class='layui-btn-lg layui-btn bu'>速率</button>   </div>" +
        "<div style='padding-top:15px '>" +
        "<div  class='user' id='useri'></div>" +
        "<div class='diy' id='diy' >未开始</div>" +
        " </div> </div> " +
        " </boby>" +
        backgrounda.setAttribute("style", "position:fixed;bottom:1vh;z-index: 9999999999;  float:right;  ");

    document.body.appendChild(backgrounda)
 
    var userinfo = localStorage.getItem("userinfo");

    if (userinfo) {
        userinfo = JSON.parse(userinfo);
        if (userinfo.length > 0) {
            showuser();
        }
    } else {
        userinfo = [];
    }
    elscript.onload = function () {
        msg('脚本加载成功')


    }
    document.getElementById('tzkey').addEventListener('click', function () {
        var key = prompt('请输入Server酱的key', "");
        GM_setValue('key', key)
        layer.msg("已设置" + GM_getValue("key"));
        document.getElementById("tzkey").innerHTML = '<div >KEY:' + key + '</div>'
    })

    document.getElementById('two').addEventListener('click', function () {
        clearInterval(timer);
        layer.close(load); //
        layer.msg("已停止");
        document.getElementById("diy").innerHTML = '<div >已停止</div>'

    })

    document.getElementById('three').addEventListener('click', function () {
        var sudu = prompt('请输入检测的速度/单位:毫秒/1000=1秒，建议60000', "");
        GM_setValue('sudu', sudu)
        layer.msg("已设置" + GM_getValue("sudu") + "毫秒");
        document.getElementById("suduid").innerHTML = '<div >当前速度:' + sudu + '毫秒</div>'
    })


    document.getElementById('jia').addEventListener('click', function () {
        var user = prompt('请输入用户ID', "");
     
        GM_xmlhttpRequest({
            url: url + "&username=" + user + "&count=0&token=" + token,
            method: "GET",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload: function (xhr) {
                console.log(xhr)
                var data = JSON.parse(xhr.responseText)
                if(data.base_resp.err_msg=='ok'){

                
                const hasAcct = data.hasOwnProperty('acct');
                if (hasAcct) {
                    var acct = data.acct;
                    const hasSpecifiedID = userinfo.some(item => item.username === acct.username);
                    if (!hasSpecifiedID) {
                        acct['feedCount'] = data.feedCount;
                        userinfo.push(acct);
                    }
                    localStorage.setItem('userinfo', JSON.stringify(userinfo));
                    console.log(userinfo)
                    showuser()
                }
                }else{
                     msg('未查询到用户')
                        
                }
              
            }
        });


    })
    var load;
    var timer = null;
    document.getElementById('one').addEventListener('click', function () {
        var token = GM_getValue("token")
        var sudu = GM_getValue("sudu")>10000?GM_getValue("sudu"):60000;
        var key = GM_getValue("key")
       
        if (token) {
            if (key == '点击设置' || key == null || key == "") {
                msg('请先设置key')

                return false;
            }
            var loadIndex = layer.msg('开始检测中', {
                icon: 16,
                shade: 0.01
            });
            layer.close(loadIndex)
            load = layer.load(2, { shade: false });
            document.getElementById("diy").innerHTML = '<div >正在运行中<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i></div>'
            timer = setInterval(function () {
                userinfo.forEach(function (item, index) {
                    GM_xmlhttpRequest({
                        url: url + "&username=" + item.username + "&count=0&token=" + token,
                        method: "GET",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        onload: function (xhr) {                 
                            var data = JSON.parse(xhr.responseText)      
                            if(data.base_resp.err_msg=='ok'){ 
                            const hasAcct = data.hasOwnProperty('acct');
                            if (hasAcct) {
                                var feedCount = data.feedCount;
                                var feedCounts = item.feedCount;
                                if (feedCount > feedCounts) {
                                    const list = data.list;
                                    const ret = sc_send(item.nickname + '已更新', '标题：' + list[0].desc, key);
                                    console.log(ret + '有视频更新');
                                } else {
                                    console.log('无');
                                }
                            }else{
                                 sc_send(item.nickname + '请更新该用户ID', '请更新该用户', key);
                            }
                        }else{
                            //  if(data.base_resp.ret=='64718'){
                            //     msg('操作频繁，请更换账号')
                            //  } else{
                            //      msg('操作频繁')
                            //  }
                             sc_send('操作频繁，请更换公众号', '请更换公众号', key);
                        }
                        }
                    });
                });
            }, sudu)
        } else {
            msg('请登录')
        }
    })

    function msg(msg) {
        layer.alert(msg);
    }
    function sc_send(text, desp, key) {
      
        const url = `https://sctapi.ftqq.com/${key}.send`;
        const postData =JSON.stringify({
                "text":text,
                "desp":desp
            })
         const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: postData
            };
            fetch(url, options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));

    }

    function showuser() {
        const arrays = document.getElementById('useri');
        arrays.innerHTML = '';
        const ul = document.createElement('ul');
        userinfo.forEach(function (item, index) {
            const li = document.createElement('li');
            li.textContent = `${index + 1}、昵称: ${item.nickname}`;
            var del = document.createElement('button');
            del.type = 'button';
            del.className = 'layui-btn-sm layui-btn-primary';
            del.innerHTML = '删除';
            del.addEventListener('click', function () {
                for (let i = 0; i < userinfo.length; i++) {
                if (userinfo[i].username === item.username) {
                    userinfo.splice(i, 1);
                    localStorage.setItem('userinfo', JSON.stringify(userinfo));
                    layer.msg('删除成功')
                    showuser();
                    break;
                }
                }   
            });

            li.appendChild(del);
            ul.appendChild(li);
        });

        arrays.appendChild(ul);
    }
})();