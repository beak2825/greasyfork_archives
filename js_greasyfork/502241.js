// ==UserScript==
// @name         小鑫作业助手-beta
// @namespace    http://tampermonkey.net/
// @version      5.3.5
// @description  键盘输入录选择题，上传他人二卷
// @author       YouXam
// @match        *://homework.xinkaoyun.com/*
// @match        *://zuoye.xinkaoyun.com/*
// @grant        none
// @license      GPL
// @icon         https://homework.xinkaoyun.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/502241/%E5%B0%8F%E9%91%AB%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B-beta.user.js
// @updateURL https://update.greasyfork.org/scripts/502241/%E5%B0%8F%E9%91%AB%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B-beta.meta.js
// ==/UserScript==
"use strict";
const VERSION = "5.3.5"
const APIBASE = "https://xkhelper.youxam.com"
const get = x => JSON.parse(localStorage.getItem('xxuser'))[x]
async function fetchWithCache(url) {
	if ('caches' in window) {
		try {
			const cachedResponse = await caches.match(url);
			if (cachedResponse) {
				return cachedResponse;
			} else {
				const response = await fetch(url);
				const cache = await caches.open('xkhelper');
				cache.put(url, response.clone());
				return response;
			}
		} catch (error) {
			console.error('Error fetching with cache:', error);
			return fetch(url);
		}
	} else {
		return fetch(url);
	}
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
window.loadJs = function loadJs(src, expectedHash) {
    return new Promise((ret, rej) => {
        fetchWithCache(src).then(res => res.text()).then(res => {
            // If no expectedHash is provided, just load the script
            if (!expectedHash) {
                console.warn(src, "no expectedHash, skip hash check!")
                let s = document.createElement("script");
                s.language = "javascript";
                s.type = "text/javascript";
                s.text = res;
                document.getElementsByTagName('HEAD')[0].appendChild(s);
                ret(0);
                return;
            }

            // Compute SHA256 hash of the fetched script content
            const encoder = new TextEncoder();
            const data = encoder.encode(res);

            crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                // Compare the computed hash with the expected hash
                if (hashHex === expectedHash) {
                    console.info(src, "hash matched")
                    let s = document.createElement("script");
                    s.language = "javascript";
                    s.type = "text/javascript";
                    s.text = res;
                    document.getElementsByTagName('HEAD')[0].appendChild(s);
                    ret(0);
                } else {
                    console.error(src, "hash mismatched")
                    rej(new Error('SHA256 hash mismatch'));
                }
            }).catch(e => rej(e));
        }).catch(e => rej(e));
    });
}
window.loadCss = function loadCss(src, expectedHash) {
    return new Promise((ret, rej) => {
        fetchWithCache(src).then(res => res.text()).then(res => {
            // If no expectedHash is provided, just load the CSS
            if (!expectedHash) {
                console.warn(src, "no expectedHash, skip hash check!")
                addGlobalStyle(res);
                ret(0);
                return;
            }

            // Compute SHA256 hash of the fetched CSS content
            const encoder = new TextEncoder();
            const data = encoder.encode(res);

            crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                // Compare the computed hash with the expected hash
                if (hashHex === expectedHash) {
                    console.info(src, "hash matched")
                    console.log(res)
                    addGlobalStyle(res);
                    ret(0);
                } else {
                    console.error(src, "hash mismatched")
                    rej(new Error('SHA256 hash mismatch'));
                }
            }).catch(e => rej(e));
        }).catch(e => rej(e));
    });
}
const jsl = [];
let count = 0
if (window.Noty === undefined) {
	jsl.push(loadJs('https://cdn.staticfile.net/noty/3.2.0-beta/noty.min.js', '6c473452cab51b080ef78e28a5527085abca80ff9bf171519561489548cedcbe'))
	count += 1
}
if (window.Vue === undefined) {
	jsl.push(loadJs('https://cdn.staticfile.net/vue/2.6.14/vue.min.js', '9174c425c445377df4562ad9165ea08fdf9433a808296d7de5f619791df10e17'))
	count += 1
}
if (window.moment === undefined) {
	jsl.push(loadJs('https://cdn.staticfile.net/moment.js/2.29.4/moment-with-locales.min.js', '430725b95468277dcbccc27e08e3d873276c0082737310b0b1ad330392511847'))
	count += 1
}
if (window.jQuery === undefined || count === 3) jsl.push(loadJs('https://cdn.staticfile.net/jquery/3.5.1/jquery.min.js', 'f7f6a5894f1d19ddad6fa392b2ece2c5e578cbf7da4ea805b6885eb6985b6e3d'))
if (window.Viewer === undefined) jsl.push(loadJs('https://cdn.staticfile.net/viewerjs/1.11.1/viewer.min.js', 'bc0e260bddb12844ad0344e781d633fe3088afaf5b9cef079305d3ac72c9fd61'))
jsl.push(loadCss('https://cdn.staticfile.net/noty/3.1.4/noty.css', 'a7e3e1289103a8df5fe67d381fec0db46a27576a535c6981e19afb3d9de527fc'))
jsl.push(loadCss('https://cdn.staticfile.net/viewerjs/1.11.1/viewer.min.css', 'f73a2bae7fa48b50f604632ea865bd76f5c2338d3fc96387c96aaa9b61bd7efc'))
Promise.allSettled(jsl).then(main)
function main() {
	addGlobalStyle(`.layui-layer {
  max-width: 90%;
  margin: auto;
}`)
	fetch('https://greasyfork.org/scripts/421351-%E5%B0%8F%E9%91%AB%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B/code/%E5%B0%8F%E9%91%AB%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js').then(res => res.text()).then(res => {
		const v = /const VERSION = "(.*?)"/.exec(res)[1]
		if (v !== VERSION) {
			if (v.split('.') > VERSION.split('.'))
				new Noty({
					text: '小鑫作业助手有新版本(' + v + ')可用！请前往<a href="https://greasyfork.org/scripts/421351-%E5%B0%8F%E9%91%AB%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B/code/%E5%B0%8F%E9%91%AB%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js" target="_blank">更新</a>。',
					type: 'success',
					timeout: 10000
				}).show();
		}
	})
	if (localStorage.getItem('float') === null) localStorage.setItem('float', 'true')
	if (localStorage.getItem('keguan') === null) localStorage.setItem('keguan', 'true')
	if (localStorage.getItem('zhuguan') === null) localStorage.setItem('zhuguan', 'true')
	const qqurl = 'https://qm.qq.com/q/zRUeALfqf0'
	window.openqq = async function() {
		layer.open({
			type: 0,
			area: ['500px', '300px'],
			title: '',
			shade: 0.6,
			anim: 0,
			content: `<h1>QQ 交流群</h1></br><a target="_blank" style="color: #527ee8;cursor: pointer;" href="${qqurl}">QQ 群：453662477</a>`,
			yes: openwelcome
		});

	}
	$(`
<div id="ball" style="width: 200px;height: 24px;position: fixed;bottom: 317px;right: 15px;z-index: 999;text-align: center;font-size: 17px;"><button style="width: 101%;  height: 100%;line-height: 10px;margin-top: 1px;border: 1px black solid;" class="layui-btn layui-btn-danger">小鑫作业助手 设置</button></div>
`).insertBefore('body').click(openwelcome)
	if (localStorage.getItem('local_version') !== VERSION) {
		localStorage.setItem('local_version', VERSION)
		new Noty({
			text: '小鑫作业助手更新到 v' + VERSION + ' 版本！',
			type: 'success',
			timeout: 2000
		}).show();
	}
	if (localStorage.getItem('xxhelper_init') !== 'xxhelper_init') {
		try {
			openwelcome()
			//			getAnswer(1, 'init')
			localStorage.setItem('xxhelper_init', 'xxhelper_init')
		} catch (e) {}
	}
	window.openhelp = function openhelp() {
		layer.open({
			type: 0,
			area: ['500px', '300px'],
			title: '',
			shade: 0.6,
			anim: 0,
			content: `<h1>键盘录入帮助</h1><br/>输入选择题时，可在右下角的输入框直接输入字母。回车，上下箭头可切换题目。为了方便盲打，也可以使用 Z, X, C, V 输入 A，B，C，D。`,
			yes: openwelcome
		});
	}
	window.opensponsor = function opensponsor(fromWelcome = false) {
		const id = layer.open({
			type: 0,
			area: ['500px', '475px'],
			title: '',
			shade: 0.6,
			anim: 0,
			content: `<h1>赞助</h1><br/><h2>如果您觉得小鑫作业助手对您很有帮助，可以考虑赞助小鑫作业助手，赞助金额将会用于小鑫作业助手的维护。</h2><br/><p>注：赞助完全自愿，赞助与否不会对使用体验造成变化，赞助金额由您决定。</p>
            <img style="width:150px;height:auto; margin-left: 40px;" src="https://s2.loli.net/2023/01/15/FxVdMynYPqr5Dc6.jpg">
            <img style="width:150px;height:auto; float:right; margin-right:40px;" src="https://s2.loli.net/2023/01/15/HyNCWbAYmZ2jRdu.jpg" >`,
			yes: fromWelcome ? openwelcome : () => {
				layer.close(id)
			}
		});
	}
	window.openabout = function openabout() {
		const id = layer.open({
			type: 0,
			area: ['500px', '200px'],
			title: '',
			shade: 0.6,
			anim: 0,
			content: `<h1>关于</h1><br/><p>开发者 GitHub: <a style="color: #527ee8;cursor: pointer;" target="_blank" href="https://github.com/youxam">YouXam</a></p><p>邮箱：<a style="color: #527ee8;cursor: pointer;" target="_blank" href="mailto:youxam@youxam.one">youxam@youxam.one</a></p>`,
			yes: openwelcome
		});
	}
	window.openpri = function openpri(type) {
		layer.open({
			type: 0,
			area: ['800px', '500px'],
			btn: ['同意', '拒绝'],
			title: '',
			shade: 0.6,
			anim: 0,
			yes: (index) => {
				localStorage.setItem('pri', 'true')
				layer.close(index)
				if (type) openwelcome()
			},
			btn2: () => {},
			content: `<h1>小鑫作业助手 隐私政策</h1><br/>
<p>欢迎您访问我们的产品。</p><p>小鑫作业助手（包括网站等产品提供的服务，以下简称“产品和服务”）是由 YouXam（以下简称“我们”）开发并运营的。确保用户的数据安全和隐私保护是我们的首要任务，本隐私政策载明了您访问和使用我们的产品和服务时所收集的数据及其处理方式。</p>
请您在继续使用我们的产品前务必认真仔细阅读并确认充分理解本隐私政策全部规则和要点，一旦您选择使用，即视为您同意本隐私政策的全部内容，同意我们按其收集和使用您的相关信息。如您在在阅读过程中，对本政策有任何疑问，可联系我们的客服咨询，请通过 youxam@youxam.one 或产品中的反馈方式与我们取得联系。如您不同意相关协议或其中的任何条款的，您应停止使用我们的产品和服务。</p>
<p>本隐私政策帮助您了解以下内容：</p>
<p>一、我们如何收集和使用您的个人信息；</p>
<p>二、我们如何存储和保护您的个人信息；</p>
<p>三、我们如何共享、转让、公开披露您的个人信息；</p>
<p>四、我们如何使用 Cookie 和其他追踪技术。</p>
<h2>一、我们如何收集和使用您的个人信息</h2>

<p>个人信息是指以电子或者其他方式记录的能够单独或者与其他信息，结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。我们根据《中华人民共和国网络安全法》和《信息安全技术个人信息安全规范》（GB/T 35273-2017）以及其它相关法律法规的要求，并严格遵循正当、合法、必要的原则，出于您使用我们提供的服务和/或产品等过程中而收集和使用您的个人信息，包括但不限于小鑫作业账号令牌等。</p>

<p>我们将通过小鑫作业账号记录相关的数据。您所提供的所有信息均来自于我们从小鑫作业获取的数据,包括姓名，用户 ID，学校，学校 ID 和账户令牌。</p>

<h2>二、我们如何存储和保护您的个人信息</h2>

<p>作为一般规则，我们仅在实现信息收集目的所需的时间内保留您的个人信息。我们会在对于管理与您之间的关系严格必要的时间内保留您的个人信息（例如，当您从我们的产品获取服务时）。出于遵守法律义务或为证明某项权利或合同满足适用的诉讼时效要求的目的，我们可能需要在上述期限到期后保留您存档的个人信息，并且无法按您的要求删除。</p>

<h2>三、我们如何共享、转让、公开披露您的个人信息</h2>

<p>在管理我们的日常业务活动所需要时，为追求合法利益以更好地服务客户，我们将合规且恰当的使用您的个人信息。出于对业务和各个方面的综合考虑，我们仅自身使用这些数据，不与任何第三方分享。我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。在符合法律法规的前提下，当我们收到上述披露信息的请求时，我们会要求必须出具与之相应的法律文件，如传票或调查函。我们坚信，对于要求我们提供的信息，应该在法律允许的范围内尽可能保持透明。在以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意。</p>

<p>1、与国家安全、国防安全直接相关的；</p>
<p>2、与犯罪侦查、起诉、审判和判决执行等直接相关的；</p>
<p>3、出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</p>
<p>4、您自行向社会公众公开的个人信息；</p>
<p>5、从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道</p>
<p>6、根据个人信息主体要求签订和履行合同所必需的；</p>
<p>7、用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；</p>
<p>8、法律法规规定的其他情形。</p>

<h2>四、我们如何使用 Cookie 和其他追踪技术</h2>

<p>为确保产品正常运转，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。Cookie 通常包含标识符、产品名称以及一些号码和字符。 借助于 Cookie，我们能够存储您的偏好或商品等数据，并用以判断注册用户是否已经登录，提升服务和产品质量及优化用户体验。我们出于不同的目的使用各种Cookie，包括：严格必要型Cookie、性能Cookie、营销Cookie和功能Cookie。某些Cookie可能由外部第三方提供，以向我们的产品提供其它功能。我们不会将 Cookie 用于本政策所述目的之外的任何用途。您可根据自己的偏好管理或删除 Cookie。您可以清除计算机上或手机中保存的所有 Cookie，大部分网络浏览器都设有阻止或禁用 Cookie 的功能，您可对浏览器进行配置。阻止或禁用 Cookie 功能后，可能影响您使用或不能充分使用我们的产品和服务。</p>`})
	}
	function openwelcome() {
		layer.open({
			type: 0,
			area: ['500px', '470px'],
			title: '',
			shade: 0.6,
			anim: 0,
			content: `<h1>小鑫作业助手 <span style="font-size: 1rem;">v${VERSION}</span> <a style="font-size: 1.3rem; color: #527ee8;cursor: pointer; margin-left: 20px;" onclick='openabout()'>关于</a></h1>
<div style="margin: 5px 0px;">
<a href="https://greasyfork.org/zh-CN/scripts/421351" target="_blank">
<img src="https://img.shields.io/badge/dynamic/json?label=%E6%9C%AC%E6%9C%88%E8%AF%B7%E6%B1%82%E6%AC%A1%E6%95%B0&url=https://xkhelper-status.youxam.workers.dev/&query=$.humanized.requests&logo=greasyfork"/>
</a>
</div
<br><h2 style="margin-bottom: 5px">设置</h2>
<p>
  <input type="checkbox" id="cbox1" value="float" checked="checked">
  <label for="cbox1">录入悬浮框</label>
</p>
<p>
  <input type="checkbox" id="cbox2" value="keguan">
  <label for="cbox2">查找选择题答案</label>(<a style="color: #527ee8;cursor: pointer;" onclick='openpri(1)'>隐私协议</a>)
</p>
<p>
  <input type="checkbox" id="cbox3" value="zhuguan" checked="checked">
  <label for="cbox3">查找二卷图片</label>
</p>
<p>
  <button class='layui-btn layui-btn-normal' onclick='clearLocalStorage()'>清除设置和缓存</button>
</p>
<hr/>
<h2 style="margin-bottom: 5px">帮助</h2><a style="color: #527ee8;cursor: pointer;" onclick='openhelp()'>键盘录入帮助</a><br/><hr/>如果您遇到困难、发现 BUG 或者有其他建议，可加入 <a style="color: #527ee8;cursor: pointer;" onclick='openqq()'>QQ 交流群</a>。<hr/>
<a style="color: #527ee8;cursor: pointer;" onclick='opensponsor(1)'>赞助我！</a>
  <script>
  function clearLocalStorage() {
    Object.keys(localStorage).filter(x => !x.startsWith('xx')).map(x => {delete localStorage[x]})
    location.reload()
  }
  if (localStorage.getItem('float')) $('#cbox1')[0].checked = localStorage.getItem('float') === 'true'
  if (localStorage.getItem('keguan')) $('#cbox2')[0].checked = localStorage.getItem('keguan') === 'true'
  if (localStorage.getItem('zhuguan')) $('#cbox3')[0].checked = localStorage.getItem('zhuguan') === 'true'
  </script>`,
			yes: (index) => {
				const float = $('#cbox1')[0].checked
				const keguan = $('#cbox2')[0].checked
				const zhuguan = $('#cbox3')[0].checked
				localStorage.setItem('float', float.toString())
				localStorage.setItem('keguan', keguan.toString())
				localStorage.setItem('zhuguan', zhuguan.toString())
				if (keguan && localStorage.getItem('pri') !== 'true') openpri()
				window.app.show_root = (location.hash.startsWith("#/app/stu/InputTask/Answer/taskId=") || location.hash.startsWith("#/app/stu/InputTask/Answered/taskId")) && localStorage.getItem('float') === 'true'
				if (location.hash.startsWith("#/app/stu/InputTask/Answer/taskId=") || location.hash.startsWith("#/app/stu/InputTask/Answered/taskId="))$('#ball').css('bottom', float ? '317px' : '65px')
				try { window.app2.show_root = zhuguan; } catch {}
				layer.close(index)
			}
		});
	}
	function fill(s, n = 2, t = '0') {
		s = s.toString()
		return t.repeat(n - s.length) + s
	}
	function format(date) {
		if (typeof (date) !== 'object') {
			date = new Date(date)
		}
		return date.getFullYear() + '-' + fill(date.getMonth() + 1) + '-' + fill(date.getDate()) + ' ' + fill(date.getHours()) + ':' + fill(date.getMinutes()) + ':' + fill(date.getSeconds())
	}
	function get_confirm_text(ans) {
		moment.locale('zh-cn')
		const t = new Date(ans.time)
		const now = new Date()
		let text = '查找到标准答案，是否使用？<br/>上次更新：' + (ans.time ? format(t) + ' (' + moment(ans.time).fromNow() +')' : '未知')
		if ((now - t) / 1000 / 86400 >= 100) {
			text += '<br/><span style="color: red">警告：距离上次更新已超过 100 天，此答案可能为上个假期更新，题目与答案可能发生变动。</span>'
		}
		return text
	}
	function get_title() {
		try {
			return location.href.match(/taskName=([^//]*)/)[1] || ''
		} catch {
			return ''
		}
	}
	function toArray(n) {
		const res = []
		let cur = null
		do {
			cur = n.iterateNext()
			if (cur) res.push(cur)
		} while(cur)
			return res
	}
	function xpath(s) {
		return toArray(document.evaluate(s, document.body))
	}
	function app2_html(id) {
		return `<div id='app${id}' style="margin-top: 2px" v-show="show_root">
<div class="uplod_answe" style="margin-bottom: 5px">
<div class="layer-photos-demo" style="display: block">
    <div v-for="e in info.images" class="img_list"><i class="layui-icon layui-icon-close-fill"></i><img layer-pid="1" class="zgtImg" :src="e"></div>
</div>
<i>本地图片和云端图片可以混合提交</i>
</div>
<button class='layui-btn layui-btn-normal' :style="{color: mode==='grade'?'black':'white',fontWeight:mode==='grade'?'bolder':'normal'}" @click='changeMode("grade")'>年级</button>
<button class='layui-btn layui-btn-normal' :style="{color: mode==='class'?'black':'white',fontWeight:mode==='class'?'bolder':'normal'}" @click='changeMode("class")'>班级</button>
<button class='layui-btn' v-show='info.images.length > 0' style='background: black; color: white' @click='clear'>清空云端图片: {{ info.realName }}</button>
<hr/>
<input class="layui-input" placeholder="搜索" v-model="search" style=" max-width: 800px">
<div v-if='!loading'  style=" max-width: 800px">
<div class="layui-table-box">
    <div class="layui-table-header">
        <table class="layui-table" lay-even="" cellspacing="0" cellpadding="0" border="0">
            <thead>
                <tr>
                    <th data-field="taskId" data-key="2-0-0" class="">
                        <div class="layui-table-cell laytable-cell-2-0-0" align="center"><span>排名</span></div>
                    </th>
                    <th data-field="realName" data-key="2-0-1" class="">
                        <div class="layui-table-cell laytable-cell-2-0-1" align="center"><span>姓名</span></div>
                    </th>
                    <th data-field="className" data-key="2-0-2" class="">
                        <div class="layui-table-cell laytable-cell-2-0-2" align="center"><span>班级</span></div>
                    </th>
                    <th data-field="allScore" data-key="2-0-3" class="">
                        <div class="layui-table-cell laytable-cell-2-0-3" align="center"><span>分数</span></div>
                    </th>
					<th data-field="allScore" data-key="2-0-3" class="">
                        <div class="layui-table-cell laytable-cell-2-0-3" align="center"><span>操作</span></div>
                    </th>
                </tr>
            </thead>
        </table>
    </div>
    <div class="layui-table-body layui-table-main" style="height: 555px;">
        <table class="layui-table" lay-even="" cellspacing="0" cellpadding="0" border="0">
            <tbody>
                <tr data-index="0" class="" v-for="(e, i) in fanswers">
                    <td data-field="taskId" data-key="2-0-0" data-content="" class="" align="center">
                        <div class="layui-table-cell laytable-cell-2-0-0">{{ i + 1 }}</div>
                    </td>
                    <td data-field="realName" data-key="2-0-1" class="" align="center">
                        <div class="layui-table-cell laytable-cell-2-0-1">{{ e.realName }}</div>
                    </td>
                    <td data-field="className" data-key="2-0-2" class="" align="center">
                        <div class="layui-table-cell laytable-cell-2-0-2">{{ e.className }}</div>
                    </td>
                    <td data-field="allScore" data-key="2-0-3" class="" align="center">
                        <div class="layui-table-cell laytable-cell-2-0-3">{{ e.allScore }}</div>
                    </td>
					<td data-field="allScore" data-key="2-0-3" class="" align="center">
                        <button @click='use(i)' class='layui-btn layui-btn-normal'>使用</button>
                    </td>
                </tr>
				<tr v-if='!fanswers.length'>
					<td data-field="taskId" data-key="2-0-0" data-content="" class="" align="center">
                        无数据
                    </td>
				</tr>
            </tbody>
        </table>
    </div>
</div>
</div>
<div v-else>加载中...</div>
</div>`
	}
	function app2_vue(id) {
		return {
			el: '#app' + id,
			data: {
				appid: id,
				answers: [],
				show_root: true,
				taskId: 0,
				loading: false,
				mode: 'grade',
				info: {
					images: [],
					realName: ''
				},
				res: '',
				search: ''
			},
			computed: {
				fanswers: function () {
					return this.answers.filter(e => e.realName.indexOf(this.search) !== -1 )
				}
			},
			watch: {
				search: function () {
					localStorage.setItem('search', this.search)
				}
			},
			methods: {
				clear: function () {
					this.info = {
						images: [],
						realName: ''
					}
				},
				changeMode: async function (mode) {
					this.mode = mode
					localStorage.setItem('mode', mode)
					this.loading = true
					const res = await fetch("https://zuoyenew.xinkaoyun.com:30001/holidaywork/student/" + (mode === 'grade' ? 'getGradeRanks' : 'getClassRanks'), {
						"credentials": "omit",
						"headers": {
							"Accept": "application/json, text/javascript, */*; q=0.01",
							"Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
							"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
							"Sec-Fetch-Dest": "empty",
							"Sec-Fetch-Mode": "cors",
							"Sec-Fetch-Site": "same-site"
						},
						"referrer": "https://homework.xinkaoyun.com/",
						"body": `page=1&limit=99999999&taskId=${this.taskId}&token=${JSON.parse(localStorage.getItem('xxuser')).token}`,
						"method": "POST",
						"mode": "cors"
					});
					this.answers = (await res.json()).data
					this.loading = false
				},
				use: async function (id) {
					const res = await fetch("https://zuoyenew.xinkaoyun.com:30001/holidaywork/student/getMutualTaskInfo", {
						"credentials": "omit",
						"headers": {
							"Accept": "application/json, text/javascript, */*; q=0.01",
							"Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
							"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
							"Sec-Fetch-Dest": "empty",
							"Sec-Fetch-Mode": "cors",
							"Sec-Fetch-Site": "same-site"
						},
						"referrer": "https://homework.xinkaoyun.com/",
						"body": `taskId=${this.taskId}&userId=${this.fanswers[id].userId}&token=${JSON.parse(localStorage.getItem('xxuser')).token}`,
						"method": "POST",
						"mode": "cors"
					})
					const data = (await res.json()).data[this.appid - 1]
					this.info = data
					this.info.realName = this.fanswers[id].realName
					const imgs = []
					for (let i of this.info.images) {
						imgs.push(this.info.teaId + ',' + i)
					}
					this.res = imgs.join(';')
					this.$nextTick(() => {
						if (window.viewer2) window.viewer2.update();
						else window.viewer2 = new Viewer(document.querySelectorAll('.layer-photos-demo')[1])
					})
				},
				refresh: function() {
					try {
						this.taskId = location.href.match(/taskId=(\d+)/)[1]
					} catch{}
					this.clear()
					this.changeMode(localStorage.getItem('mode') || 'grade')
					this.search = localStorage.getItem('search') || ''
					this.res = ''
				}
			},
			async created() {
				this.refresh()
				window.addEventListener('hashchange', this.refresh)
				this.show_root = localStorage.getItem('zhuguan') === 'true'
			}
		}
	}
	function mount_app2() {
		let id = Math.random()
		window.app2_tid = setInterval(() => {
			const g = $(".uplod_answe")
			if (!g.length) return
			clearInterval(window.app2_tid)
			const es = []
			g.each((i, e) => {
				es.push(e)
			})
			es.forEach((e, i) => {
				if (window.app2) {
					window.app2.$destroy()
				}
				$(e).after(app2_html(i + 1))
				window.app2 = new Vue(app2_vue(i + 1))
			})
		}, 100)
	}
	function networkAlert(e) {
		new Noty({
			text: '错误：' + e.toString() + '。请尝试刷新，如果此错误持续出现，请加QQ群453662477。',
			type: 'error',
			closeWith: ['button']
		}).show();
		console.log(e)
	}
	async function getAnswer(id, type) {
		if (localStorage.getItem('keguan') !== 'true') return
		try {
			const res = await fetch(APIBASE + `?type=${type}&userrole=${get('userRole')}&schoolid=${get('schoolId')}&sid=${id}&token=${get('token')}&userid=${get('userId')}&username=${get('realName')}&schoolname=${get('schoolName')}`)
			if (res.status !== 200) networkAlert(await res.text())
			else return await res.json()
		} catch (e) {
			networkAlert(e)
		}
	}
	async function submit(id, remoteAnswers, list, error){
		const edited = {}, wrong = {}
		for (let i = 0; i < list.length; i++) {
			if (remoteAnswers[i] && remoteAnswers[i] != list[i] && !error[i]) edited[i + 1] = true
		}
		for (let i of Object.keys(error)) {
			if (error[i]) wrong[parseInt(i) + 1] = true
		}
		try {
			const res = await fetch(APIBASE +`?type=submit&userrole=${get('userRole')}&schoolid=${get('schoolId')}&sid=${id}&token=${get('token')}&userid=${get('userId')}&username=${get('realName')}&schoolname=${get('schoolName')}`, {
				method: 'POST',
				body: JSON.stringify({ edited, wrong })
			})
			if (res.status !== 200) networkAlert(await res.text())
			else return await res.json();
		} catch (e) {
			networkAlert(e)
		}
	}
	function filter(text) {
		const lines = text.split('\n')
		const result = []
		for (const i of lines) {
			if (!/<p><img/.test(i)) {
				result.push(i)
			}
		}
		return result.join('\n')
	}
	(function() {
		'use strict';
		$("body").append(`
<div id="app" style="height:200px;width:200px;position:absolute;right:15px;bottom:113px;z-index:999;background: white" v-show="show_root">
    <button style="width: 101%;  height: 22px;line-height: 10px;margin-bottom: 3px; border: 1px black solid;" class="layui-btn green" @click="setStdAnswers">查找答案</button>
    <textarea :disabled="setErrored" v-if="state_text" style="width:100%; height: 87%" v-model="all_text" @change="load(2)">
    </textarea>
    <div id="problems" v-else style="width:100%; height: 87%; overflow:auto; border: 1px solid;">
       <div v-for="e, i in list" :key="i"  style="margin: 3px 0px;"><div style="padding-left: 2px; width: 29px; display: inline-block"> {{ i + 1 }}. </div><input :style="{ color: (remoteAnswers.length ? remoteAnswers[i] && list[i] != remoteAnswers[i] : setErrored && errorP[i] === 1) ? 'red' : 'black'}" :disabled="setErrored" ref="input" @keyup="save()" @blur="focusf(-1)" @focus="focusf(i), save()" v-model="list[i]" style="max-width: 81%" @keydown.enter="next()"></div>
    </div>
	<div style="display: inline-block;background-color: white;height: 1.5rem;">
	<span v-if='mode' style="margin: 0px"><span id='errorRateLabel' @mouseover="showtip" @mouseout="closetip">错误率</span>
    <input v-model='rangemin' @focus='focusmin' :disabled="setErrored" style="width: 8%; margin-top: 0px" :style="{ boxShadow: !errormin ? '0px 0px 5px red' : 'none'}">%-
    <input v-model='rangemax' @focus='focusmax' :disabled="setErrored" style="width: 12%; margin-top: 0px" :style="{ boxShadow: !errormax ? '0px 0px 5px red' : 'none'}">%
	</span>
	<button style="padding-left: 16px;width: 30%; bottom: 10%; height: 90%; margin: 1px 0px; color: black;line-height: 10px;color: white;border: 1px solid black;" class="layui-btn" @click='setError' v-if='mode'>{{ this.setErrored ? '撤销' : '设错' }}</button>
	</div>
	<button style="width: 49%; bottom: 10%; height: 11%; margin: 1px 0px; color: black;line-height: 10px;color: white;border: 1px solid black;" class="layui-btn" @click='update_ans(1)' v-if='!mode' :style="{color: choose == 1 ? 'red' : 'white', boxShadow: choose == 1 ? '0px 0px 10px red' : 'none'}">正确答案</button>
	<button style="width: 49%; bottom: 10%; height: 11%; margin: 1px 0px; color: black;line-height: 10px;color: white;border: 1px solid black;" class="layui-btn"  @click='update_ans(2)' v-if='!mode' :style="{color: choose == 2 ? 'red' : 'white', boxShadow: choose == 2 ? '0px 0px 10px red' : 'none'}">我的答案</button>
	<br/>
    <button style="width: 101%;  height: 11%;line-height: 10px;margin-top: 1px;border: 1px solid black;" class="layui-btn layui-btn-warm" @click="shift()">切换</button>
</div>
`);
		addGlobalStyle("#problems::-webkit-scrollbar { width: 0 }")
		var app = new Vue({
			el: '#app',
			data: {
				focus: -1,
				list: [],
				problems: [],
				state_text: false,
				last_text: '',
				all_text: '',
				key_id: -1,
				tid: -1,
				radio: {},
				sta: {},
				mode: 1,
				choose: 2,
				show_root: false,
				tipindex: -1,
				rangemin: '0',
				rangemax: '0',
				setErrored: false,
				taskId: 0,
				plength: [],
				errorP: {},
				remoteAnswers: [],
				preventFocus: false
			},
			computed: {
				errormin: function() {
					return !isNaN(this.rangemin) && parseFloat(this.rangemin) >= 0 && parseFloat(this.rangemin) <= 100 && parseFloat(this.rangemin) <= parseFloat(this.rangemax)
				},
				errormax: function() {
					return !isNaN(this.rangemax) && parseFloat(this.rangemax) >= 0 && parseFloat(this.rangemax) <= 100 && parseFloat(this.rangemin) <= parseFloat(this.rangemax)
				}
			},
			methods: {
				bindListener: async function() {
					for (let i = 0; i < this.problems.length; i++) {
						const list = this.problems[i].children
						for (let j = 0; j < list.length; j++) {
							if (list[j].tagName == 'INPUT' && list[j].title) {
								const t = list[j].title
								this.preventFocus = true;
								const prev = list[j + 1].onclick;
								list[j + 1].addEventListener('click', e => {
									if (!e.isTrusted) return
									if (list[j].type == 'radio') this.list[i] = t;
									else {
										if (list[j].checked) this.list[i] += t;
										else this.list[i] = this.list[i].replaceAll(t, '')
									}
									this.save(3)
								})
							}
						}
					}
				},
				setStdAnswers: async function() {
					const noti = new Noty({
						text: '正在查找选择题答案...',
						type: 'info'
					}).show();
					const answers = await getAnswer(this.taskId, 'query')
					answers.standard = answers.standard === undefined ? true : answers.standard
					setTimeout(() => {
						noti.close()
					}, 500)
					if (!answers.code) {
						if ((!answers.stuAnswer?.length || answers.total && answers.total === answers.notTrusted) && answers.answer.includes('允许查看')) {
							new Noty({
								text: '由于教师设置，' + answers.answer.split('\n')[0].split('. ')[1] + '答案，并且提交量太少，无法推断答案。',
								type: 'error',
								timeout: 5000
							}).show();
							return
						}
						const baseText = '标准答案被禁止查看，已通过其他用户答案推断选择题答案，' + (answers.notTrusted ? `${answers.total - answers.notTrusted} 道题目答案可用` : '全部题目答案可用') + '。'
						const infoText = answers.standard ? get_confirm_text(answers) : baseText + `是否使用？<br/><span style="color: red">警告：此答案有可能错误！</span>`
						new Noty({
							text: answers.standard ? '查找成功' : baseText,
							type: 'success',
							timeout: 2000
						}).show();
						const confirm = () => {
							this.all_text = answers.standard ? answers.answer : answers.stuAnswer
							this.last_text = answers.standard ? answers.answer : answers.stuAnswer
							this.load(true)
							this.remoteAnswers = [...this.list]
							window.localStorage.setItem(this.taskId + 'remoteAnswers', JSON.stringify(this.remoteAnswers))
							this.setErrored = false
							this.save(true)
						}
						if (this.remoteAnswers.length) confirm()
						else {
							layer.confirm(infoText, {title:'提示'}, (index) => {
								confirm()
								layer.close(index)
							}, () => {})
						}
					} else {
						new Noty({
							text: '未查找到答案',
							type: 'error',
							timeout: 2000
						}).show();
						setTimeout(() => {
							noti.close()
						}, 500)
					}
				},
				focusf: function(t) {
					if (this.focus >= 0) $(this.problems[this.focus].parentElement).css('background', 'none')
					this.focus = t
					if (t >= 0) {
						$(".layui-show").animate({scrollTop: this.problems[t].parentElement.offsetTop}, 50);
						$(this.problems[t].parentElement).css('background', '#2923ee24')
					}
				},
				focusmin: function() {
					$('body > div:nth-child(7) > span:nth-child(2) > input:nth-child(2)').select()
				},
				focusmax: function() {
					$('body > div:nth-child(7) > span:nth-child(2) > input:nth-child(3)').select()
				},
				genError: function() {
					this.errorP = {}
					let data = [...this.list]
					const rate = Math.random() * (parseFloat(this.rangemax) - parseFloat(this.rangemin)) + parseFloat(this.rangemin)
					const count = Math.round(this.list.length * rate / 100)
					function random_shuffle(array) {
						const temp = [...array]
						for (let i = temp.length - 1; i >= 0; i--) {
							let j = Math.floor(Math.random() * (i + 1));
							[temp[i], temp[j]] = [temp[j], temp[i]]
						}
						return temp
					}
					data = random_shuffle((new Array(this.list.length)).fill(0).map((e, i) => i))
					const target = data.slice(0, count).sort()
					const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
					const ssf = [], ssfh = {}
					for (let i = 0; i < target.length; i++) {
						if (this.plength[target[i]].single == 7) {
							ssf.push(target[i])
							ssfh[target[i]] = 1
						} else if (this.plength[target[i]].single) {
							const last = this.list[target[i]]
							this.list[target[i]] = alpha[Math.floor(Math.random() * this.plength[target[i]].single)]
							while (this.list[target[i]] == last) this.list[target[i]] = alpha[Math.floor(Math.random() * this.plength[target[i]].single)]
						} else if (this.plength[target[i]].multi) {
							let type = [1, 2, 2, 2, 3][(Math.floor(Math.random() * ((this.plength[target[i]].multi - this.list[target[i]].length) <= 1 ? 4 : 5)))]
							let correct = random_shuffle(this.list[target[i]].split(''))
							if (type === 1 || type === 2) correct.shift()
							if (type === 1 || type === 3 || this.list[target[i]].length <= 1) {
								let origin = random_shuffle(alpha.slice(0, this.plength[target[i]].multi).split(''))
								for (let j = 0; j < origin.length; j++) {
									if (correct.indexOf(origin[j]) === -1) {
										correct.push(origin[j])
										break
									}
								}
							}
							correct.sort()
							this.list[target[i]] = correct.join('')
						}
						this.errorP[target[i]] = 1
					}
					if (ssf.length) {
						let ssfo = []
						for (let i = 0; i < this.plength.length; i++) {
							if (this.plength[i].single == 7) ssfo.push(i)
						}
						if (ssfo.length === 5) {
							let origin = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
							for (let i = 0; i < ssfo; i++) if (!ssfh[ssfo[i]]) origin.remove(this.list[ssfo[i]])
							origin = random_shuffle(origin)
							for (let i = 0; i < ssf.length; i++) this.list[ssf[i]] = origin[i]
						}
					}
					new Noty({
						text: '错误率 ' + rate.toFixed(2) + '%, 共错 ' + count + ' 题: ' + target.sort().map(e => e + 1).join(', ') + '。',
						type: 'success',
						timeout: 2000
					}).show()
					return ''
				},
				setError: function() {
					if (this.setErrored) {
						this.setErrored = false
						localStorage.setItem('setErrored', 'false')
						this.all_text = this.last_text
						this.load(2)
						this.errorP = {}
					} else {
						if (!this.errormin || !this.errormax) return
						localStorage.setItem('rangemin', this.rangemin)
						localStorage.setItem('rangemax', this.rangemax)
						localStorage.setItem('setErrored', 'true')
						this.save()
						localStorage.setItem('Errored-' + this.taskId.toString(), this.all_text)
						this.setErrored = true
						this.last_text = this.all_text
						this.genError()
						this.save(2)
					}
				},
				update: function (disableAnimate = true)  {
					const lines = filter(this.all_text).split('\n');
					let last = null;
					for (let i = 0; i < this.problems.length; i++) {
						let line = lines[i] || '';
						const list = this.problems[i].children
						let single = 0, multi = 0;
						for (let j = 0; j < list.length; j++) {
							if (list[j].tagName == 'INPUT' && list[j].title) {
								if (list[j].type == 'radio') {
									const t = list[j].title
									single += 1
									const a = (line.indexOf(t) >= 0);
									if (a && this.radio[i] != t) {
										if (disableAnimate !== 3) list[j + 1].click()
										last = list[j + 1].offsetTop
										this.radio[i] = t
									}
								} else {
									const title = list[j].title;
									const a = (line.indexOf(title) >= 0);
									const b = !!(this.sta[i] && this.sta[i][title]);
									multi += 1
									if (a != b) {
										if (disableAnimate !== 3) list[j + 1].click();
										last = list[j + 1].offsetTop
										if (!this.sta[i]) this.sta[i] = {};
										this.sta[i][title] = !b;
									}
								}
							}
						}
						this.plength[i] = {
							single,
							multi
						}
						if (line && line.indexOf('.') < 0 && !parseInt(line)) lines[i] = (i + 1) + '.' + line;
					}
					if (disableAnimate && disableAnimate !== 2 && disableAnimate !== 3 && last !== null) $(".layui-show").animate({scrollTop:last},100);
				},
				update_ans: function(t) {
					this.choose = t
					const ans = xpath('/html/body/div[1]/div[2]/div[3]/div/div[2]/div[2]/div/div/div/div[4]/div/div/div/div[' + t.toString() + ']/span[' + (t == 1 ? 2 : 1).toString() + ']/text()')
					this.list = []
					for (const i of ans) {
						this.list.push(i.textContent)
					}
					this.save()
				},
				showtip: function() {
					this.tipindex = layer.tips('点击”设错“后，将会在错误率范围内随机选择错误率，并对当前的答案进行随机设错。', '#errorRateLabel', {tips:4, time: 10000})
				},
				closetip: function() {
					layer.close(this.tipindex)
				},
				shift: function () {
					if (this.state_text) {
						this.all_text = filter(this.all_text)
						this.all_text = this.all_text.toUpperCase()
						this.load(true)
					} else {
						this.save()
					}
					this.state_text = !this.state_text
				},
				last: function () {
					if (this.focus > 0) {
						$(this.$refs.input[this.focus - 1]).focus()
						$(this.$refs.input[this.focus]).select()
					}
					this.save()
				},
				next: function () {
					if (this.focus < this.list.length) {
						$(this.$refs.input[this.focus + 1]).focus();
						$(this.$refs.input[this.focus]).select();
					}
					this.save()
				},
				save: function (disableAnimate = false) {
					let h = ''
					for (let i = 0; i < this.list.length; i++) {
						if (this.list[i]) {
							this.list[i] = this.list[i].toUpperCase()
							this.list[i] = this.list[i].replace(/Z/g, 'A')
							this.list[i] = this.list[i].replace(/X/g, 'B')
							this.list[i] = this.list[i].replace(/V/g, 'D')
							this.list.splice(i, 1,  [...new Set(this.list[i])].filter(e => e >= 'A' && e <= 'Z').sort().join(''))
							h += (i + 1).toString() + '. ' + this.list[i] + '\n'
						} else {
							h += (i + 1).toString() + '.\n'
						}
					}
					this.all_text = h
					localStorage.setItem(this.title, this.all_text)
					this.update(disableAnimate)
				},
				load: function (disableAnimate = false) {
					for (let i = 0; i < this.problems.length; i++) this.list[i] = ''
					const size = this.list.length
					for (const i of filter(this.all_text).split("\n")) {
						if (!i) continue
						try {
							const number = /\d+/.exec(i)[0], alpha = i.match(/[A-Za-z]+/g).join('')
							if (!number || !alpha) continue
							this.list[number - 1] = alpha.toUpperCase()
						} catch {}
					}
					this.list = this.list.slice(0, size)
					this.save(disableAnimate)
				},
				init: async function () {
					this.list = []
					this.title = get_title()
					if (xpath('/html/body/div[1]/div[2]/div[3]/div/div[2]/div[2]/div/div/div/div[4]/div/div/div/div[1]/span').length) {
						this.mode = 0
						this.update_ans(2)
					} else {
						this.mode = 1
						for (var i of $(".tm"))
							for (var j of i.children)
								if (j.className != 'problem_box' && j.className != 'uplod_box' && j.className != 'audio') {
									this.problems.push(j)
									this.list.push('')
								}
						if (localStorage.getItem(this.title) && /[a-zA-Z]/.test(localStorage.getItem(this.title))) {
							this.all_text = localStorage.getItem(this.title)
							this.load(true)
							if (this.setErrored) {
								for (const i of filter(this.last_text).split("\n")) {
									if (!i) continue
									try {
										let number = /\d+/.exec(i)[0], alpha = i.match(/[A-Za-z]+/g).join('')
										if (!number || !alpha) continue
										alpha = [...new Set(alpha.toUpperCase())].filter(e => e >= 'A' && e <= 'Z').sort().join('')
										if (alpha != this.list[number - 1]) {
											this.errorP[number - 1] = 1
										}
									} catch {}
								}
							}
							const remote = window.localStorage.getItem(this.taskId + 'remoteAnswers')
							if (remote) {
								this.remoteAnswers = JSON.parse(remote)
							}
						} else {
							let noti = null
							if (localStorage.getItem('keguan') === 'true') {
								const noti = new Noty({
									text: '正在查找选择题答案...',
									type: 'info'
								}).show();
								const answers = await getAnswer(this.taskId, 'query')
								answers.standard = answers.standard === undefined ? true : answers.standard
								setTimeout(() => {
									noti.close()
								}, 500)
								if (!answers.code) {
									if ((!answers.stuAnswer?.length || answers.total && answers.total === answers.notTrusted) && answers.answer.includes('允许查看')) {
										new Noty({
											text: '由于教师设置，' + answers.answer.split('\n')[0].split('. ')[1] + '答案，并且提交量太少，无法推断答案。',
											type: 'error',
											timeout: 5000
										}).show();
										return
									}
									const baseText = '标准答案被禁止查看，已通过其他用户答案推断选择题答案，' + (answers.notTrusted ? `${answers.total - answers.notTrusted} 道题目答案可用` : '全部题目答案可用') + '。'
									const infoText = answers.standard ? get_confirm_text(answers) : baseText + `是否使用？<br/><span style="color: red">警告：此答案有可能错误！</span>`
									new Noty({
										text: answers.standard ? '查找成功' : baseText,
										type: 'success',
										timeout: 2000
									}).show();
									const confirm = () => {
										this.all_text = answers.standard ? answers.answer : answers.stuAnswer
										this.last_text = answers.standard ? answers.answer : answers.stuAnswer
										this.load(true)
										this.remoteAnswers = [...this.list]
										window.localStorage.setItem(this.taskId + 'remoteAnswers', JSON.stringify(this.remoteAnswers))
										this.setErrored = false
										this.save(2)
									}
									if (this.remoteAnswers.length) confirm()
									else {
										layer.confirm(infoText, {title:'提示'}, (index) => {
											confirm()
											layer.close(index)
										}, () => {})
									}
								} else {
									new Noty({
										text: '未查找到答案',
										type: 'error',
										timeout: 2000
									}).show();
									setTimeout(() => {
										noti.close()
									}, 500)
								}
							}
						}
					}
				},
				refresh: function () {
					const that = this
					try {
						this.taskId = location.href.match(/taskId=(\d+)/)[1]
					} catch {
						this.taskId = 0
					}
					this.show_root = (location.hash.startsWith("#/app/stu/InputTask/Answer/taskId=") || location.hash.startsWith("#/app/stu/InputTask/Answered/taskId")) && localStorage.getItem('float') === 'true'
					if (location.hash.startsWith("#/app/stu/InputTask/Answer/taskId=")) {
						if (window.app2_tid) clearInterval(window.app2_tid)
						mount_app2()
						$('#ball').css('bottom', localStorage.getItem('float') === 'true' ? '317px' : '65px')
					} else if (location.hash.startsWith("#/app/stu/InputTask/Answered/taskId=")){
						$('#ball').css('bottom', localStorage.getItem('float') === 'true' ? '317px' : '65px')
					} else {
						$('#ball').css('bottom', '65px')
					}
					this.rangemin = localStorage.getItem('rangemin') || '0'
					this.rangemax = localStorage.getItem('rangemax') || '0'
					this.setErrored = localStorage.getItem('setErrored') === 'true' ? true : false
					this.last_text = localStorage.getItem('Errored-' + this.taskId.toString()) || ''
					if (this.show_root && localStorage.getItem('errorSet') !== 'true') {
						localStorage.setItem('errorSet', 'true')
						setTimeout(() => {
							layer.tips('点击”设错“后，将会在错误率范围内随机选择错误率，并对当前的答案进行随机设错。', '#errorRateLabel', {tips:4, time: 10000});
						}, 100)
					}
					const tid2 = setInterval(() => {
						const t = $('.submitTask')
						if (!t.length) return
						clearInterval(tid2)
						const tid3 = setInterval(() => {
							const events = $._data(t[0], "events")
							if (!events) return
							clearInterval(tid3)
							events.click.forEach(e => {
								$(t[0]).unbind("click", e.handler)
								$('.submitTask').click(() => {
									var subjectiveAnswer = '',
										checkd = "",
										checkboxs = "",
										sr = "",
										sc = "",
										name = '',
										iszgt = 0,
										iskgt = $('.children').length + $('.parent').length,
										zname = '';
									let istwo = false
									let have = false
									$.each($('.tm'), function (i, val) {
										var that = $(this),
											tmid = $(this).data('id');
										if (that.find('.uplod_box').length > 0) {
											if (that.find('.zgtImg').length > 0) {
												if (subjectiveAnswer != '') {
													subjectiveAnswer += '|'
													iszgt++
												}
												var other = $('.uplod_answe')
												istwo = other.length == 2 && $(other[0]).find('.zgtImg').length > 0 && $(other[1]).find('.zgtImg').length > 0
												have = $(other[0]).find('.zgtImg').length > 0 || $(other[1]).find('.zgtImg').length > 0
												$.each(that.find('.zgtImg'), function (s, vas) {
													if (s != 0) {
														subjectiveAnswer += ';'
													}
													subjectiveAnswer += tmid + ',' + $(this).attr('src');
												})
											}
										}
									})
									$("input:radio[class='z_o_v']:checked").each(function () {
										checkd += $(this).attr("name") + "," + $(this).attr('title').substring(0, 1) + "|";
									});

									if ($("input:checkbox[class='z_e_v']").length == 0) {
										checkboxs = ''
									} else {
										$("input:checkbox[class='z_e_v']:checked").each(function (i, e) {
											var name1 = $(this).attr("name");
											if (i == 0) {
												checkboxs += $(this).attr("name") + "," + $(this).attr('title').substring(0, 1)
											} else {
												if (name == name1) {
													checkboxs += ";" + $(this).attr("name") + "," + $(this).attr('title').substring(0, 1);
												} else {
													checkboxs += "|" + $(this).attr("name") + "," + $(this).attr('title').substring(0, 1);
												}
											}
											name = name1
										});
										checkboxs += '|';
									}

									$("input:radio[class='c_o_v']:checked").each(function () {
										sr += $(this).attr("name") + "," + $(this).attr('title').substring(0, 1) + "|";
									});

									if ($("input:checkbox[class='c_e_v']").length == 0) {
										sc = ''
									} else {
										$("input:checkbox[class='c_e_v']:checked").each(function (i, idx) {
											var zname1 = $(this).attr("name");
											if (i == 0) {
												sc += $(this).attr("name") + "," + $(this).attr('title').substring(0, 1);
											} else {
												if (zname == zname1) {
													sc += ";" + $(this).attr("name") + "," + $(this).attr('title').substring(0, 1);
												} else {
													sc += "|" + $(this).attr("name") + "," + $(this).attr('title').substring(0, 1);
												}
											}
											zname = zname1

										});
										sc += '|';
									}

									var s = checkd + checkboxs + sr + sc;
									var st = s.substring(0, s.length - 1);
									var reg = /(^\|)+|(\|$)+/;
									var a = st.replace(reg, '').replace(reg, '');
									let flag = true
									if (!window?.app2?.info?.realName) flag = false
									layui.layer.confirm(have ? (flag ? `正在使用 ${istwo ? window.app2.info.realName + ' 和 本地上传' : window.app2.info.realName} 的图片，是否提交？` : `正在使用本地上传的图片，是否提交？`) : '未上传主观题，是否提交？', {
										title: '提示',
										btn: ['确认提交', '取消提交']
									}, () => {
										const taskId = layui.router().search.taskId
										if (window.xkhelper_dev_disable_submit) {
											submit(taskId, that.remoteAnswers, that.list, that.errorP)
											return
										}
										layui.admin.req({
											url: layui.setter.comuser.s + '/holidaywork/student/submitTask',
											data: {
												objectiveAnswer: a,
												subjectiveAnswer: subjectiveAnswer,
												taskId: taskId,
												token: layui.data('xxuser').token,
											},
											success: res => {
												if(res.state == 'ok') {
													layui.setter.TipsMsg.ok(res.msg)
													setTimeout(() => {
														submit(taskId, that.remoteAnswers, that.list, that.errorP)
														history.back();
														setTimeout(() => {
															if (!localStorage.getItem('sponsor' + VERSION)) {
																opensponsor()
																localStorage.setItem('sponsor' + VERSION, 'true')
															}
														}, 1000)
													}, 1500);
												}
												layui.setter.comReturn(res);
											},
											error: function(data) {
												layui.setter.TipsMsg.fail(layui.setter.comuser.errorMsg);
											}
										});
									})
								});
							})
						})

						}, 100)
					this.pressc = 0
					this.sta = {}
					this.radio = {}
					this.problems = []
					this.list = []
					clearInterval(this.tid)
					this.tid = setInterval(() => {
						if ($(".tm").length) {
							clearInterval(this.tid)
							this.init()
							this.bindListener()
						}
					}, 100)
				}
			},
			created() {
				this.refresh()
				function addViewer() {
					let cnt = 0;
					document.querySelectorAll('.layer-photos-demo')?.[0]?.querySelectorAll('.img_list').forEach(e => {
						if (e.dataset['viewer'] != 'true') {
							cnt++;
							new Viewer(e);
							e.dataset['viewer'] = 'true'
						}
					})
					return cnt > 0;
				}
				window.addEventListener('hashchange', this.refresh)
				document.addEventListener('click', (e) => {
					if (window.viewer2)window.viewer2.update()
					if (addViewer()) {
						e.preventDefault();
						e.path[0].click();
					}
				})
				document.onmousedown = () => {
					try {
						document.querySelector("#LAY_app_body > div > div.layui-fluid.layui-form > div > div > div > div > div > div.uplod_box > div > div.moxie-shim > input").setAttribute('multiple', 'multiple');
					} catch {}
				}
				document.onkeydown = e => {
					if (this.focus >= 0 && e.keyCode == 8 && !this.list[this.focus]) this.last()
					if (e.keyCode == 113) this.state_text = !this.state_text, e.preventDefault()
					if (this.focus < 0 && e.keyCode === 67) {
						this.pressc++
						if (this.pressc >= 3) {
							for (let i = 0; i < this.list.length; i++) {
								this.list[i] = 'C'
							}
							this.save()
							this.update()
						}
					}
					if (this.focus < 0) return
					if (e.keyCode == 40) {
						this.next()
						e.preventDefault()
					} else if (e.keyCode == 38) {
						this.last()
						e.preventDefault()
					}
				}
			}

		})
		window.app = app

	})();
}