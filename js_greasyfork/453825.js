// ==UserScript==
// @name         b站视频倒计时助手
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  计算总时长,并显示剩余时长
// @author       XPatriot
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/453825/b%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%92%E8%AE%A1%E6%97%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/453825/b%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%92%E8%AE%A1%E6%97%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


var css = `
.modal-body-setTime{
    position:fixed;
    border-radius:5px;
    background-color: #FFFFFF;
    top:10%;
    width:200px;
    max-width:30%;
    max-height:30%;
    z-index:1000;
    left: 50%;
    transform: translateX(-50%);
    display:none;
    padding: 10px;
    overflow-y: auto;
}
`

var html = `
						<div class='modal-body-setTime'>
							<div class="page-header">
								<span>视频下载(可批量)</span>
								<span class="close">×</span>
							</div>
							<div class="page-container">
								<div class="page-wrap"></div>
								<div class="aria2-setting">
									<div class="setting-item">
										<label class="topic-name">配置RPC:</label><input type="text" name="RPCURL" value="ws://localhost:16800/jsonrpc" placeholder="请准确输入RPC对应软件的地址，默认：Motrix">
									</div>
									<div class="setting-item">
										<label class="topic-name">配置Token:</label><input type="text" name="RPCToken" placeholder="默认无需填写">
									</div>
									<div class="setting-item">
										<label class="topic-name">保存路径:</label><input type="text" name="savePath" value="测试" placeholder="请准确输入文件保存路径">
										<div style="font-size:12px;color:#888;">最好自定义下载地址，默认地址可能不满足需要</div>
									</div>
								</div>
								<div class="modal-btn-wrap">
									<span name="selectall">全选</span>
									<span name="removeSelect">取消选择</span>
									<span name="downloadAll">批量下载</span>
								</div>
								<div class="tip-wrap">
									<div class="title">关于单P下载：</div>
									<div class="content">点击弹框单个选集，即可下载单集视频</div>
								</div>
								<div class="tip-wrap">
									<div class="title">关于批量下载：</div>
									<div class="content">
										<ul>
											<li>
												<b>1、批量下载需要第三方软件的支持，脚本推荐使用：Motrix</b>
												<ul>
													<li>Motrix下载地址：<a href="https://motrix.app/zh-CN/" target="_blank">https://motrix.app/zh-CN/</a></li>
													<li>AriaNgGUI下载地址：<a href="https://github.com/Xmader/aria-ng-gui" target="_blank">https://github.com/Xmader/aria-ng-gui</a></li>
												</ul>
											</li>
											<li>
												<b>2、在批量下载前需要提前打开软件，本教程以Motrix为准</b>
												<ul>
													<li>(1)、如果全部按照默认配置，只需要打开软件即可</li>
													<li>(2)、如果想自定义RPC地址和文件保存路径，可更改上面输入框的内容（此数据非常重要，请准确填写）</li>
													<li>
													(3)、Motrix运行图片
													<img src="https://pic.rmb.bdstatic.com/bjh/8912582c0416119405ec37ea27d12376.jpeg" width="100%" />
													</li>
												</ui>
											</li>
											<li>
												<b>3、默认RPC默认地址</b>
												<ul>
													<li>(1)、Motrix RPC默认地址：ws://localhost:16800/jsonrpc</li>
													<li>(2)、Aria2 RPC默认地址：ws://localhost:6800/jsonrpc</li>
												</ul>
											</li>
											<li>
												<b>3、如使用AriaNgGUI，使用方式类似，大家可以自行研究</b>
											</li>
										</ul>
									</div>
								</div>
								<div class="tip-wrap">
									<div class="title">必要说明：</div>
									<div class="content">
										申明：本功能仅能作为学习交流使用，且不可用于其它用途，否则后果自负。请大家重视版权，尊重创作者，切勿搬运抄袭。请大家多用[一键三连]为创作者投币~，小破站牛掰！
									</div>
								</div>
							</div>
						</div>
					`;

function GMaddStyle(css) {
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
};
function hideSetTime() {
    $('.modal-body-setTime').css('display', 'none');
}
function showSetTime() {
    $('.modal-body-setTime').css('display', 'block');
}

Storage.prototype.setCanExpireLocal = (key, value, expire) => {
    // 判断传入的有效期是否为数值或有效
    // isNaN是js的内置函数，用于判断一个值是否为NaN（非数值），
    // 非数值返回true，数值返回false
    // 还可以限制一下有效期为整数，这里就不做了
    if (isNaN(expire) || expire < 1) {
        throw new Error('有效期应为一个有效数值')
    }
    // 86_400_000一天时间的毫秒数，_是数值分隔符
    let time = expire * 86_400_000
    let obj = {
        data: value, //存储值
        time: Date.now(), //存值时间戳
        expire: time, //过期时间
    }
    // 注意，localStorage不能直接存储对象类型，sessionStorage也一样
    // 需要先用JSON.stringify()将其转换成字符串，取值时再通过JSON.parse()转换回来
    localStorage.setItem(key, JSON.stringify(obj))
}

// 取值函数
// 接收一个参数，存值的键
Storage.prototype.getCanExpireLocal = key => {
    let val = localStorage.getItem(key)
    // 如果没有值就直接返回null
    if (!val) return val
    // 存的时候转换成了字符串，现在转回来
    val = JSON.parse(val)
    // 存值时间戳 +  有效时间 = 过期时间戳
    // 如果当前时间戳大于过期时间戳说明过期了，删除值并返回提示
    if (Date.now() > val.time + val.expire) {
        localStorage.removeItem(key)
        return '值已失效'
    }
    return val.data
}
// 存值
//Storage.prototype.setCanExpireLocal('测试', '一天后过期', 1)
// 取值
//let ss = Storage.prototype.getCanExpireLocal('测试')


(function () {
    setTimeout(function () {
        //设置视频时长等
        x()
        //设置跳转之前观看页面
        playRecord()
        //设置定时器改变上次观看
        editPrePage()
        //添加css样式
        //GMaddStyle(css)
        //添加模态框
        //$("body").append(html)
        //添加点击关闭事件
        //$("body").on("click", ".modal-body-setTime .page-header >span.close", function () {
           // hideSetTime();
        //});
    }, 2000)

})();

//格式化时长
function f(minute, second) {
    if (second < 0) {
        minute--;
        second = 59;
    }
    //根据分钟和秒格式化
    var hour = 0
    minute = parseInt(minute + (second / 60))
    hour = parseInt(minute / 60)
    minute = minute % 60
    second = second % 60
    let time = hour + "小时" + minute + "分钟" + second + "秒";
    return time
}

function showPrePage(page, href) {
    if ($('.prePage') != null) {
        $('.prePage').remove()
    }
    if ($(".head-left h3").html() == "视频选集") {
        let html = '<span class="prePage"><a href="' + href + '">上次观看至第' + page + '集</a></span>';
        $("span.lastime").after(html);
    } else {
        let html = '<span class="prePage"><a href="' + href + '">上次观看至第' + page + '集</a></span>';
        $(".video-title").after(html);
    }
}

function playRecord() {
    let page = $(".cur-page").text();

    //获取bv号
    var bvNumber = location.pathname.split('/')[2]

    //判断当前视频是否是分p视频
    if (page == '') {
        return;
    }
    else {
        let pageNum = page.split("/");
        let curPageNum = parseInt(pageNum[0].substring(1));
        //判断是不是教程类视频
        if ($(".head-left h3").html() == "视频选集") {
            let prePage = Storage.prototype.getCanExpireLocal(bvNumber)
            //之前有记录则直接跳转
            if (prePage != null) {
                //直接跳转
                let addr = 'https://www.bilibili.com/video/' + bvNumber + '?p=' + prePage
                //window.location.href = 'https://www.bilibili.com/video/' + bvNumber + '?p=' + prePage
                //显示上次观看到第几p,点击跳转
                showPrePage(prePage, addr)
            } else {
                //此处设置30天过期
                Storage.prototype.setCanExpireLocal(bvNumber, curPageNum, 30)
            }
        }
        else {
            //判断是不是剧集
            //if ($('.second-line_right').html().indexOf('订阅') == 9)

            //获取当前up主id
            let upId = $('.name a')[0].href.split('/')[3]
            //获取当前剧集名
            let videoName = $('.first-line-title').html().split('\n')[1].trim()
            let upKey = upId + '-' + videoName
            //获取本地存储
            let preBvNumber = Storage.prototype.getCanExpireLocal(upKey)
            //不为空时,直接跳转到对应页面
            if (preBvNumber != null) {
                //window.location.href = 'https://www.bilibili.com/video/'+preBvNumber.split('-')[0]
                let addr = 'https://www.bilibili.com/video/' + preBvNumber.split('-')[0]
                showPrePage(preBvNumber.split('-')[1], addr)
            } else {
                //此处设置30天过期
                Storage.prototype.setCanExpireLocal(upKey, bvNumber + '-' + curPageNum, 30)
            }
        }
    }
}

function editPrePage() {
    if (page != '' && $(".head-left h3").html() != "视频选集") {
        var page = $(".cur-page").text();
        let t3 = setInterval(function () {
            if (page != $(".cur-page").text()) {
                page = $(".cur-page").text();
                let pageNum = page.split("/");
                let curPageNum = parseInt(pageNum[0].substring(1));
                let upId = $('.name a')[0].href.split('/')[3]
                let videoName = $('.first-line-title').html().split('\n')[1].trim()
                let upKey = upId + '-' + videoName
                let bvNumber = location.pathname.split('/')[2]
                Storage.prototype.setCanExpireLocal(upKey, bvNumber + '-' + curPageNum, 30)
                let addr = 'https://www.bilibili.com/video/' + bvNumber
                //showPrePage(curPageNum, addr)
            }
        }, 5000)
    }
}


function x() {
    //获取当前页码
    var page = $(".cur-page").text();
    if (page == '' || $(".head-left h3").html() != "视频选集") {
        return;
    }
    //判断当前是否已经添加过标签
    if ($("span.sumtime").html() == null) {
        let html = '<span><span class="item-text lastime"></span></span>&emsp;&emsp;';
        $(".video-title").after(html);
        html = '<span><span class="item-text sumtime"></span></span>&emsp;&emsp;';
        $(".video-title").after(html);
        $("body").on("click", ".sumtime", function () {
            showSetTime();
        });
    }
    var pageNum = page.split("/");
    var curPageNum = parseInt(pageNum[0].substring(1));
    //储存每p视频剩余时长
    let minList = [0];
    let secList = [0];
    document.querySelectorAll('div.duration').forEach(function (iteam, index) {
        var temp = iteam.innerHTML.split(":")
        minList.push(minList[index] + parseInt(temp[0]))
        secList.push(secList[index] + parseInt(temp[1]))
    })

    let m = minList[minList.length - 1]
    let s = secList[secList.length - 1]
    let time = f(m, s)
    //console.log(time);
    $("span.sumtime").html("视频总时长：" + time);
    //算出当前p之后的剩余时长
    let j = m - minList[curPageNum - 1]
    let i = s - secList[curPageNum - 1]

    //设置定时器每秒剩余时长-1
    let timer = setInterval(function () {
        //当前页面是否改变
        if (page != $(".cur-page").text()) {
            //清除上一个定时器
            clearInterval(timer)
            page = $(".cur-page").text();
            let pageNum = page.split("/");
            let curPageNum = parseInt(pageNum[0].substring(1));
            //获取bv号
            var bvNumber = location.pathname.split('/')[2]
            if ($(".head-left h3").html() == "视频选集") {
                Storage.prototype.setCanExpireLocal(bvNumber, curPageNum, 30)
            }
            playRecord()
            x();
        }
        if ($(".bpx-player-ctrl-time-current").html() != null) {
            //动态获取当前播放进度计算精确剩余时长
            let out = $(".bpx-player-ctrl-time-current").html().split(":")
            var lastime = f(j - parseInt(out[0]), i - parseInt(out[1]))
            if (parseInt(out[0]) != 0 || parseInt(out[1]) != 0) {
                $("span.lastime").html("剩余时长：" + lastime);
            }
        }
        //此处是每秒钟进行更新
    }, 1000);
    //更改页面后
    $("ul.list-box li").on("click", function () {
        page = $(".cur-page").text();
        let pageNum = page.split("/");
        let curPageNum = parseInt(pageNum[0].substring(1));
        //获取bv号
        var bvNumber = location.pathname.split('/')[2]
        if ($(".head-left h3").html() == "视频选集") {
            Storage.prototype.setCanExpireLocal(bvNumber, curPageNum, 30)
        }
        playRecord()
        //清除上一个定时器
        clearInterval(timer)
        x();
    })
}