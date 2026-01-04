// ==UserScript==
// @name         脚本常用方法库
// @namespace    http://www.itdomain.top/
// @version      0.4
// @description  为其他脚本提供常用的方法集
// @author       gwl
// ==/UserScript==

function GUtils() {
	let _this = this;
	this.http = new HttpUtil();
    this.addHtmlToBoty = function (html, pel) {
        pel = pel || document.body;
        let div = document.createElement("div");
        div.innerHTML = html;
        let els = [];
        for (let i = 0, length = div.children.length; i < length; i++) {
            els.push(div.children[i]);
            pel.appendChild(div.children[i]);
        }
        return els;
    };

    this.addCss = function (cssStr, pel) {
        pel = pel || document.body;
        let style = document.createElement("style");
        style.rel = "stylesheet";
        style.innerHTML = cssStr;
        pel.appendChild(style);
    };

    this.loadJs = async function(src) {
        let el = document.createElement('script')
        el.src = src;
        return new Promise(r=>{
            el.onload = r({status: 1});
            el.onerror = e=>r({ststus: 0, error: e});
            document.head.appendChild(el);
        })
    };

    // {title:'', textTop:'', textBottom: '', callback: func}
    this.addBtns = function (name, btns, initX, initY) {
        if (document.getElementsByClassName('lyh-utils-wrap').length > 0) return;
		if(typeof initX == 'undefined') initX = '118px';
		if(typeof initY == 'undefined') initX = '110px';
        let btnHtml = ['<div class="lyh-utils-wrap lyh-bounceInUp lyh-animated" id="lyh-utils-wrap" style="top: '+initY+'; left: '+initX+';">'
            , '<label for="" class="lyh-menu" title="按住拖动">', name, '</label>'];
        btns.map((value, index) => {
            btnHtml.push('<a href="javascript:void(0)" title="' + value.title + '" data-cat="' +
                index + '" class="lyh-menu-item">' + value.textTop + '<br>' + value.textBottom + '</a>');
        });
        btnHtml.push('<style rel="stylesheet">body .lyh-utils-wrap{font-family:"Helvetica Neue",Helvetica,"Microsoft YaHei",Arial,sans-serif;font-size:1.6rem;color:#4e546b;position:fixed;width:70px;height:70px;top:350px;margin-top:77px;margin-left:77px;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none;opacity:.35;z-index:999999}.lyh-utils-wrap.lyh-show-btn{width:225px;height:225px;margin-top:0;margin-left:0}.lyh-utils-wrap .lyh-menu{position:absolute;width:70px;height:70px;-webkit-border-radius:50%;border-radius:50%;background:#1f1f1f;left:0;top:0;right:0;bottom:0;margin:auto;text-align:center;line-height:70px;color:#f7d877;font-size:20px;z-index:1;cursor:move}.lyh-utils-wrap .lyh-menu-item{position:absolute;width:60px;height:60px;background-color:black;left:0;top:0;right:0;bottom:0;margin:auto;text-align:center;-webkit-border-radius:50%;border-radius:50%;text-decoration:none;color:#f7d877;-webkit-transition:background .5s,-webkit-transform .6s;transition:background .5s,-webkit-transform .6s;-moz-transition:transform .6s,background .5s,-moz-transform .6s;transition:transform .6s,background .5s;transition:transform .6s,background .5s,-webkit-transform .6s,-moz-transform .6s;font-size:14px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;line-height:20px;padding-top:10px}.lyh-utils-wrap .lyh-menu-item:hover{background:#8e388e}.lyh-show-btn.lyh-utils-wrap,.lyh-test-body .lyh-utils-wrap{opacity:1}@-webkit-keyframes lyh-animated-jello{from,11.1%,to{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@-moz-keyframes lyh-animated-jello{from,11.1%,to{-moz-transform:none;transform:none}22.2%{-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@keyframes lyh-animated-jello{from,11.1%,to{-webkit-transform:none;-moz-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}.lyh-animated{-webkit-animation-duration:1s;-moz-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes lyh-bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-moz-keyframes lyh-bounceInUp{from,60%,75%,90%,to{-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes lyh-bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.lyh-bounceInUp{-webkit-animation-name:lyh-bounceInUp;-moz-animation-name:lyh-bounceInUp;animation-name:lyh-bounceInUp;-webkit-animation-delay:1s;-moz-animation-delay:1s;animation-delay:1s}@media screen and (max-width:640px){}@media screen and (min-width:641px) and (max-width:1367px){.lyh-utils-wrap{top:50px}}.lyh-show-btn.lyh-utils-wrap .lyh-menu,.lyh-test-body .lyh-utils-wrap .lyh-menu{-webkit-animation:lyh-animated-jello 1s;-moz-animation:lyh-animated-jello 1s;animation:lyh-animated-jello 1s}.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(1),.lyh-test-body .lyh-utils-wrap .lyh-menu-item:nth-of-type(1){-webkit-transform:translate3d(0,-135%,0);-moz-transform:translate3d(0,-135%,0);transform:translate3d(0,-135%,0)}.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(2),.lyh-test-body .lyh-utils-wrap .lyh-menu-item:nth-of-type(2){-webkit-transform:translate3d(120%,-70%,0);-moz-transform:translate3d(120%,-70%,0);transform:translate3d(120%,-70%,0)}.lyh-menu-gt6.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(2),.lyh-test-body .lyh-menu-gt6.lyh-utils-wrap .lyh-menu-item:nth-of-type(2){-webkit-transform:translate3d(120%,-135%,0);-moz-transform:translate3d(120%,-135%,0);transform:translate3d(120%,-135%,0)}.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(3),.lyh-test-body .lyh-utils-wrap .lyh-menu-item:nth-of-type(3){-webkit-transform:translate3d(120%,70%,0);-moz-transform:translate3d(120%,70%,0);transform:translate3d(120%,70%,0)}.lyh-menu-gt6.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(3),.lyh-test-body .lyh-menu-gt6.lyh-utils-wrap .lyh-menu-item:nth-of-type(3){-webkit-transform:translate3d(120%,0,0);-moz-transform:translate3d(120%,0,0);transform:translate3d(120%,0,0)}.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(4),.lyh-test-body .lyh-utils-wrap .lyh-menu-item:nth-of-type(4){-webkit-transform:translate3d(0,135%,0);-moz-transform:translate3d(0,135%,0);transform:translate3d(0,135%,0)}.lyh-menu-gt6.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(4),.lyh-test-body .lyh-menu-gt6.lyh-utils-wrap .lyh-menu-item:nth-of-type(4){-webkit-transform:translate3d(120%,135%,0);-moz-transform:translate3d(120%,135%,0);transform:translate3d(120%,135%,0)}.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(5),.lyh-test-body .lyh-utils-wrap .lyh-menu-item:nth-of-type(5){-webkit-transform:translate3d(-120%,70%,0);-moz-transform:translate3d(-120%,70%,0);transform:translate3d(-120%,70%,0)}.lyh-menu-gt6.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(5),.lyh-test-body .lyh-menu-gt6.lyh-utils-wrap .lyh-menu-item:nth-of-type(5){-webkit-transform:translate3d(0,135%,0);-moz-transform:translate3d(0,135%,0);transform:translate3d(0,135%,0)}.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(6),.lyh-test-body .lyh-utils-wrap .lyh-menu-item:nth-of-type(6){-webkit-transform:translate3d(-120%,-70%,0);-moz-transform:translate3d(-120%,-70%,0);transform:translate3d(-120%,-70%,0)}.lyh-menu-gt6.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(6),.lyh-test-body .lyh-menu-gt6.lyh-utils-wrap .lyh-menu-item:nth-of-type(6){-webkit-transform:translate3d(-120%,135%,0);-moz-transform:translate3d(-120%,135%,0);transform:translate3d(-120%,135%,0)}.lyh-menu-gt6.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(7),.lyh-test-body .lyh-menu-gt6.lyh-utils-wrap .lyh-menu-item:nth-of-type(7){-webkit-transform:translate3d(-120%,0,0);-moz-transform:translate3d(-120%,0,0);transform:translate3d(-120%,0,0)}.lyh-menu-gt6.lyh-show-btn.lyh-utils-wrap .lyh-menu-item:nth-of-type(8),.lyh-test-body .lyh-menu-gt6.lyh-utils-wrap .lyh-menu-item:nth-of-type(8){-webkit-transform:translate3d(-120%,-135%,0);-moz-transform:translate3d(-120%,-135%,0);transform:translate3d(-120%,-135%,0)}</style>');
        btnHtml.push('</div>');
        let els = this.addHtmlToBoty(btnHtml.join(''));
        let asideNav = document.getElementById("lyh-utils-wrap");
        let asideMenu = asideNav.getElementsByClassName('lyh-menu')[0];
        let isLinstenerMousemove = false;

        function addMousemove() {
            if (isLinstenerMousemove) return;
            isLinstenerMousemove = true;
            asideNav.addEventListener("mousemove", mousemoveEv);
        }

        function removeMousemove() {
            if (!isLinstenerMousemove) return;
            isLinstenerMousemove = false;
            asideNav.removeEventListener("mousemove", mousemoveEv);
        }

        function mousemoveEv(ev) {
            asideNav.style.top = (ev.clientY - 112) + "px";
            asideNav.style.left = (ev.clientX - 112) + "px";
        }

        function showMenu() {
            //显示其他菜单
            if (!asideNav.classList || asideNav.classList.contains("lyh-show-btn")) return;
            asideNav.classList.add("lyh-show-btn");
        }

        function hideMenu(ev) {
            //隐藏其他菜单
            if (!ev.relatedTarget || !ev.relatedTarget.classList
                || ev.relatedTarget.classList.contains("lyh-menu-item")
                || ev.relatedTarget.classList.contains("lyh-utils-wrap")
                || ev.relatedTarget.classList.contains("lyh-menu")) {
                return;
            }
            asideNav.classList.remove("lyh-show-btn");
        }

        //lyh-menu-gt6
        asideMenu.addEventListener("mousedown", addMousemove);//当元素上按下鼠标按钮时触发。
        asideNav.addEventListener("mouseup", removeMousemove);//当在元素上释放鼠标按钮时触发。
        asideMenu.addEventListener("mouseover", showMenu);//当鼠标指针移动到元素上时触发。
        asideNav.addEventListener("mouseout", hideMenu);//当鼠标指针移出元素时触发。
        asideNav.addEventListener('click', (ev) => {
            if (!ev.srcElement || !ev.srcElement.classList
                || !ev.srcElement.classList.contains("lyh-menu-item")
                || !ev.srcElement.dataset || !ev.srcElement.dataset.cat) {
                return;
            }
            let config = btns[parseInt(ev.srcElement.dataset.cat)];
            if (!config || typeof config.callback != "function") return;
            asideNav.classList.remove("lyh-show-btn");//隐藏按钮
            setTimeout(() => {
                config.callback(ev);
            }, 100);
        });
        return els;
    };
	
	/**
	 * 创建线程
	 * */
	this.createWorker = function(jsStr){
		let tempJs = _this.http.constructor.toString();
		tempJs += _this.constructor.toString();
		tempJs += ' gUtils=new GUtils();';
		tempJs += jsStr;
		let url = URL.createObjectURL(new Blob([tempJs], {type : 'text/javascript'}));
		return new Worker(url);
	}
	
}
function HttpUtil() {
	let _this = this;
	
	this.post = async function(url, data, headers){
		let req = url;
		headers = headers || {'Content-Type': 'application/json'};
		if(typeof url != 'object') {
			req = {
				url, data
			}
		}
		req.method = 'POST';
		req.headers = req.headers || headers;
		return _this.sendAjaxByContent(req)
	}
	this.get = async function(url, data, headers){
		let req = url;
		headers = headers || {'Content-Type': 'application/x-www-form-urlencoded'};
		if(typeof url != 'object') {
			req = {
				url, data
			}
		}
		req.method = 'GET';
		req.headers = req.headers || headers;
		return _this.sendAjaxByContent(req)
	}
	
	/**
	 * 发送请求
	 * @param {Object} req {url, method, headers}
	 * */
	this.sendAjaxByContent = async function(req){
		let xhr = new XMLHttpRequest();
		req.headers = req.headers || {};
		req.headers['Content-Type'] = req.headers['Content-Type'] || req.headers['Content-type'] || req.headers['content-type'];
		if (req.files && Object.keys(req.files).length > 0) {
			req.headers['Content-Type'] = 'multipart/form-data'
		}
		xhr.timeout = req.timeout || 5000;
		req.method = req.method || 'GET';
		req.async = req.async === false ? false : true;
		if (req.method.toLowerCase()!=='get' && req.method.toLowerCase()!=='head'
			&& req.method.toLowerCase()!=='options') {
			if (!req.headers['Content-Type'] || req.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
				req.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				req.data = _this.formUrlencode(req.data);
			} else if (req.headers['Content-Type'] === 'multipart/form-data') {
				delete req.headers['Content-Type'];
			} else if (req.data && typeof req.data === 'object') {
				req.data = JSON.stringify(req.data);
			}
		} else {
			delete req.headers['Content-Type'];
		}
		if (req.query && typeof req.query === 'object') {
			let getUrl = _this.formUrlencode(req.query);
			if(req.url.indexOf('?') == -1) {
				req.url += '?' + getUrl;
			} else {
				req.url += '&' + getUrl;
			}
			req.query = '';
		}
		xhr.open(req.method, req.url, req.async);
		let response = {};
		if (req.headers) {
			let unsafeHeaderArr = [];
			for (let name in req.headers) {
				if(unsafeHeaderArr.indexOf(name) > -1){
					unsafeHeaderArr.push({
						name: name,
						value: req.headers[name]
					})
				}else{
					xhr.setRequestHeader(name, req.headers[name]);
				}		
			}
			if(unsafeHeaderArr.length > 0){
				xhr.setRequestHeader('cross-request-unsafe-headers-list', encode(unsafeHeaderArr));
			}
		}
		xhr.setRequestHeader('cross-request-open-sign', '1')
		return new Promise(function(resolve, reject){
			xhr.onload = function (e) {
				let headers = xhr.getAllResponseHeaders();
				headers = _this.handleHeader(headers);
				response = {
					headers: headers,
					status: xhr.status,
					statusText: xhr.statusText,
					body: xhr.responseText
				}
				if (xhr.status == 200) {
					resolve(response);
				} else {
					reject(response);
				}
			}
			xhr.onerror = function (e) {
				reject(e)
			}
			xhr.ontimeout = xhr.onerror
			xhr.upload.onprogress = function (e) {};
			try {
				xhr.send(req.data);
			} catch (error) {
				reject(error)
			}
		});
	}
	this.formUrlencode = function(data) {
	    if(!data || typeof data !== 'object') return ''
	    return Object.keys(data).map(function (key) {
	        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
	    }).join('&')
	}
	this.handleHeader = function(headers) {
	    if (!headers) return;
	    if (typeof headers === 'object') {
	        return headers;
	    }
	    let newHeaders = {};
		headers = headers.split(/[\r\n]/).forEach(function (header) {
	        let index = header.indexOf(":");
	        let name = header.substr(0, index);
	        let value = header.substr(index + 2);
	        if (name) {
	            newHeaders[name] = value;
	        }
	
	    })
	    return newHeaders;
	}
}
window.gUtils = new GUtils();


