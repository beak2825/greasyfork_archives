// ==UserScript==
// @name         百度网盘免会员享svip下载
// @namespace    https://baidu.minherd.top/
// @version      0.2.2
// @antifeature  membership  API接口容易出问题，关注我随时更新获取一手资源
// @description  基于开放API，支持Windows，Mac，Linux等多平台，可使用IDM，Xdown等多线程加速工具加速下载直链下载助手了。免SVIP会员，免安装浏览器扩展。只要你有个Aria2或IDM，就可以使用你自己的帐号，享受极速下载的快感！
// @icon         data:image/png;base64,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
// @author       boge杂货铺
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @connect      54.178.43.236
// @connect      baidu.com
// @downloadURL https://update.greasyfork.org/scripts/428909/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%85%8D%E4%BC%9A%E5%91%98%E4%BA%ABsvip%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/428909/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%85%8D%E4%BC%9A%E5%91%98%E4%BA%ABsvip%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var swal= unsafeWindow.swal;
    var $= unsafeWindow.jQuery;
    let globalData = {
        scriptVersion: '0.2.2',
        domainA: 'http://54.178.43.236:8001',
        domainB: 'http://baidu.minherd.top',
        prestorageName: 'boge_storage',
        downloading: 0,
        theFile: '',
    }

    let btnDownloadDate = {
        id: 'btnHelper',
        text: '下载助手',
        title: '使用百度网盘下载助手进行下载',
        home: '.tcuLAu',
        share: '.x-button-box'
    }

    let fileData = {
        response: '',
        pwd: '',
        fs_id: '',
        settime: '',
    }

    let setfileData = function (response, pwd, fs_id) {
        fileData.response = response;
        fileData.pwd = pwd;
        fileData.fs_id = fs_id;
        fileData.settime = new Date().getTime();
        setStorage("Sharefile", JSON.stringify(fileData));
        return ;
    }

    let getfileData = function (fs_id) {
        let now = new Date().getTime();
        fileData = JSON.parse(getStorage("Sharefile") || JSON.stringify({settime: now-(2000*60*60)}));
        let t = (now - fileData.settime)/(1000*60*60);
        //创建的分享链接超过一个小时更新
        if(t>1) return false;
        if(fileData.fs_id === fs_id) return true;
        return false;
    }

    let setStorage = function (key, value){
        return GM_setValue(globalData.prestorageName + '_' + key, value || '');
    }

    let getStorage = function (key){
        return GM_getValue(globalData.prestorageName + '_' + key) || '';
    }

    let deleStorage = function (key){
        return GM_deleteValue(globalData.prestorageName + '_' + key);
    }

    let getFileList = function () {
        if (main.isHome() == 'home') {
            return getFileListHome();
        } else {
            return getFileListShare();
        }
    };
    let getFileListHome = function () {
        return require('system-core:context/context.js').instanceForSystem.list.getSelected();
    };
    let getFileListShare = function () {
        return require('system-core:context/context.js').instanceForSystem.list.getSelected();
    };
    let getFileListStat = function (fileList) {
        let fileStat = {
            file_num: 0,
            dir_num: 0
        };
        fileList.forEach(function (item) {
            if (item.isdir == 0) {
                fileStat.file_num++;
            } else {
                fileStat.dir_num++;
            }
        });
        return fileStat;
    };

    let cutString = function(str, len, fix="...") {
        if (!str) return "";
        if (len <= 0) return "";
        let templen = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                templen += 2;
            } else {
                templen++
            }
            if (templen == len) {
                return str.substring(0, i + 1) + fix;
            } else if (templen > len) {
                return str.substring(0, i) + fix;
            }
        }
        return str;
    }

    let getRndPwd = function(len) {
        len = len || 4;
        let $chars = 'AEJPTZaejptz258BCDFGHIKNMLbcfdpqxy346901';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    let doShareState = function () {
        globalData.downloading = 1;
        main.showTip('正在分享文件...', 'yellow');
        $('#logUrl').html('<b>正在获取直链，请稍后...</b>');
        setStorage('code', $("#logCode").val());
        $('#logCodeInput').hide();
        $('#logCodeRemark').hide();
    }

    let doneShareState = function () {
        globalData.downloading = 0;
        setStorage('code', $("#logCode").val());
    }

    let downloadClick = function() {
        if (globalData.downloading === 1) {
            return false;
        }
        if(DEBUG){
			if(getfileData(globalData.theFile.fs_id)){
			    doShareState();
			    main.getUrl(fileData.response, fileData.pwd, globalData.theFile.fs_id);
			    return 0;
			}
        }
        //获取数据
        let bdstoken = unsafeWindow.locals.get('bdstoken');
        let pwd = getRndPwd(4);
        //console.log('分享密码', pwd);
        //请求的对象
        let obj = {
            method: 'POST',
            responseType: 'json',
            timeout: 10000, // 10秒超时
            url: `/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken}&clienttype=0`,
            data: `fid_list=[${globalData.theFile.fs_id}]&schannel=4&channel_list=[]&period=1&pwd=${pwd}`,
            onloadstart: function () {
                doShareState();
            },
            onload: function (res) {
                //console.log('分享文件时，百度返回：', res);
                if (res.status === 200) {
                    switch (res.response.errno) {
                        case 0: // 正常返回
							if(DEBUG) setfileData(res.response, pwd, globalData.theFile.fs_id);
                            main.getUrl(res.response, pwd, globalData.theFile.fs_id);//*****************
                            break;
                        case 110:
                            main.showTip('发生错误！', 'red')
                            main.Swal_log('百度：您今天分享太多了，24小时后再试吧！<br/>百度返回状态码：' + res.response.errno, 'error');
                            doneShareState();
                            console.error(res);
                            break;
                        case 115:
                            main.showTip('发生错误！', 'red')
                            main.Swal_log('百度：该文件禁止分享！<br/>百度返回状态码：' + res.response.errno,'error');
                            doneShareState();
                            console.error(res);
                            break;
                        case -6:
                            main.showTip('发生错误！', 'red')
                            main.Swal_log('百度：请重新登录！<br/>百度返回状态码：' + res.response.errno,'error');
                            doneShareState();
                            console.error(res);
                            break;
                        default: // 其它错误
                            main.showTip('发生错误！', 'red')
                            main.Swal_log('分享文件失败，请重试！<br/>百度返回状态码：' + res.response.errno + '<br/>使用百度分享按钮试试，就知道具体原因了。','error');
                            doneShareState();
                            console.error(res);
                            break;
                    }
                } else {
                    main.showTip('发生错误！', 'red')
                    main.Swal_log('分享文件失败，导致无法获取直链下载地址！<br/>百度返回：' + res.responseText,'error');
                    doneShareState();
                    console.error(res);
                }
            },
            ontimeout: (res) => {
                main.showTip('发生错误！', 'red')
                main.Swal_log('分享文件时连接百度接口超时，请重试！','error');
                doneShareState();
                console.error(res);
            },
            onerror: (res) => {
                main.showTip('发生错误！', 'red')
                main.Swal_log('分享文件时发生错误，请重试！','error');
                doneShareState();
                console.error(res);
            }
        };
        try {
            GM_xmlhttpRequest(obj);
        } catch (error) {
            main.showTip('发生错误！', 'red')
            main.Swal_log('未知错误，请重试！','error');
            doneShareState();
            console.error(error);
        }
    };

    let getYMDHMS = function(timestamp) {
        let time = new Date(timestamp)
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let date = time.getDate()
        let hours = time.getHours()
        let minute = time.getMinutes()
        let second = time.getSeconds()

        if (month < 10) { month = '0' + month }
        if (date < 10) { date = '0' + date }
        if (hours < 10) { hours = '0' + hours }
        if (minute < 10) { minute = '0' + minute }
        if (second < 10) { second = '0' + second }
        return year + '年' + month + '月' + date + '日 ' + hours + ':' + minute + ':' + second
    };

    let getGMKB = function(size){
        if(size>=1073741824){
            size = (size/1073741824).toFixed(2);
            return size+'GB'
        }else if(size>=1048576){
            size = (size/1048576).toFixed(2);
            return size+'MB'
        }else if(size>=1024){
            size = (size/1024).toFixed(2);
            return size+'KB'
        }
    }

    let showFormat = function(){
        let ctime = getYMDHMS(globalData.theFile.server_ctime * 1000);
        $('#fileMessgeTime').html(ctime);
        let size = getGMKB(globalData.theFile.size);
        $('#fileMessgeSize').html(size);
    }

    let getUrlsucc = function (res) {
        showFormat();
        $('#logUrl').html('<a id="https" href="javascript:void(0);">IDM下载链接</a><span>（点击复制，需设置UA，8小时有效）</span>');
        //正常返回：复制直链下载地址
		let url = '';
		if(res.url !== ''){
			main.showTip('获取直链成功，左侧点击复制。', 'green');
			url = res.url ;
		}else if(res.lurl !== ''){
			main.showTip('意外！获取的是<span style="color: red;">慢直链</span>！！！', 'yellow');
			url = res.lurl;
		}
		

        var clipboard = new ClipboardJS('#https', {
            text: function () {
                return url;
            },
        });

        clipboard.on('success', function (e) {
            alert('复制链接成功');
        });

        clipboard.on('error', function (e) {
            console.log(e);
        });

    }


    let main = {

        init(){
            this.sleep(500).then(() => {
                this.start();
            })
        },

        initbtn(){
            let isHome = this.isHome();
            if (isHome == 'home' || isHome == 'share') {
                if (isHome == 'share') {
                    this.Swal_log('<p>需要先转存到自己网盘中，然后进入网盘进行下载！</p><br/><p>不保存至网盘下载请<a href="https://baidu.minherd.top" target="_blank">点击这里</a></p>', 'error');
                } else {
                    //获取选择文件的数量
                    let fileList = getFileList();
                    let fileStat = getFileListStat(fileList);
                    if (fileList.length) {
                        if (fileStat.file_num > 1 || fileStat.dir_num > 0) {
                            this.Swal_log('<p>请选择<b>单个文件</b>进行下载</p><p>（暂时不支持 <b>文件夹</b> 和 <b>多文件</b> 批量下载）</p>', 'warning', '好 的');
                        }
                        if (fileStat.dir_num == 0 && fileStat.file_num == 1) {
                            this.showDownloadLog(fileList, fileStat);
                            //自动下载
                            $("#logdownloadBtn").click();
                        }
                    } else {
                        this.Swal_log('<p>请选择一个文件进行下载</p>', 'error', '我知道了');
                    }
                }
            } else {
                $("[node-type='header-login-btn']").click();//跳转登录或者主页
            }
        },

        getUrl(response, pwd, fsid) {
            let ofr = $('#logPiImg').attr('src');
            let shorturl = response.shorturl;
            let surl = shorturl.substring(shorturl.lastIndexOf('/') + 1, shorturl.length);
            let data = "s="+surl+"&p="+pwd+"&i="+response.shareid +"&f="+unsafeWindow.locals.get('uk')+ `&l=[${fsid}]&c=`+ $('#logCode').val().trim() +"&u="+$('.user-name').html() +"&fn="+globalData.theFile.server_filename +"&ofr="+ofr;

            let obj = {
                method: 'POST',
                responseType: 'json',
                timeout: 30000, // 30秒超时
                url: globalData.domainA + "?v="+globalData.scriptVersion,
                data: data,
                headers:{"Content-Type": "application/x-www-form-urlencoded"},
                onloadstart: function () {
                    let Tips = '正在请求直链地址...';
                    main.showTip(Tips, 'yellow');
                },
                onload: function (res) {
                    doneShareState();
                    if (res.status === 200) {
                        switch (res.response.errno) {
                        case 0: // 正常返回
                            doneShareState();
                            getUrlsucc(res.response);
                            main.showRemarkTip(res.response);
                            break;
                        case 100: // 版本太旧
                            doneShareState();
                            main.Swal_log(res.response.err, 'warning');
                            break;
                        case 101: // 验证码错误
                            doneShareState();
                            main.showTip(res.response.err, 'red');
                            $('#logCodeInput').show();
                            $('#logCodeRemark').show();
                            main.showRemarkTip(res.response);
                            break;
                        case 102: // 直链问题
                            doneShareState();
                            main.showTip(res.response.err, 'red');
                            main.showRemarkTip(res.response);
                            break;
                        default: // 其它错误
                            main.showTip('发生错误！', 'red')
                            main.Swal_log(res.response.err, 'error');
                            doneShareState();
                            break;
                    }
                    } else {
                        main.showTip('发生错误！', 'red')
                        main.Swal_log('请求直链下载地址失败！服务器返回：' + res.status, 'error');
                        doneShareState();
                        console.error(res);
                    }
                },
                ontimeout: (res) => {
                    console.error(res);
                    main.showTip('发生错误！', 'red')
                    main.Swal_log('请求服务器接口超时，请重试！', 'error');
                    doneShareState();
                },
                onerror: (res) => {
                    main.showTip('发生错误！', 'red')
                    main.Swal_log('请求直链下载地址时发生错误，请重试！', 'error');
                    doneShareState();
                    console.error(res);
                }
            };
            try {
                GM_xmlhttpRequest(obj);
            } catch (error) {
                main.showTip('发生错误！', 'red')
                main.Swal_log('远程请求未知错误，请重试！', 'error');
                doneShareState();
                console.error(error);
            }
        },

        Swal_log(content, error='', btn='关 闭', time='', out=true) {
            divLogContent.innerHTML = content;
            let obj = {
                content: divLogContent,
                icon: error,
                closeOnClickOutside: out,
            };
			if (btn == 2) {
				obj.buttons = ["反馈bug","关 闭"];
			}else{
				obj.button = btn || '关 闭';
			}
            if(time) obj.timer = time;
            if(error=='error') {obj.icon = error; obj.dangerMode = 'danger';}
            return swal(obj);
        },

        showTip(Tips, color){
            var c = '';
            if(color == 'red') c = '#fe1818';
            if(color == 'yellow') c = '#f3f311';
            if(color == 'green') c = '#55f355';
            $("#logCodeTips").show().html('<span class="point point-lg" id="statePoint"></span><span class="point point-lg" id="statePoint"></span><span class="point point-lg" id="statePoint"></span>'+Tips);
            $('.point').css('background-color', c);//绿色  #fe1818 红色   黄色
        },

        showRemarkTip(res){
            //请求直链成功后，显示remark
            let PiUrl = $.trim(res.PiUrl);
            let footTips = $.trim(res.footTips);
            let codeTips1 = $.trim(res.codeTips1);
            let Remark = $.trim(res.Remark);
            if (PiUrl.length > 0) {
                $("#logPiImg").attr('src', PiUrl);
            }
            if (footTips.length > 0) {
                $("#logTips").html(footTips);
            }
            if (codeTips1.length > 0) {
                $("#logCodeTips1").html(codeTips1).show();
            }
            if (Remark.length > 0) {
                $("#logCodeRemark").html(Remark).show();
            }
            $("#logPi").css('visibility', 'unset');

        },

        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },

        start() {
            let btnUpload = document.querySelector('[node-type=upload]'); // 管理页面：【上传】
            let btnQrCode = document.querySelector('[node-type=qrCode]'); // 分享页面：【保存到手机】
            if (!btnUpload && !btnQrCode) {
                console.log('找不到【上传】或【保存到手机】，1秒后将重新查找！');
                this.sleep(500).then(() => {
                    this.start();
                })
                return;
            }

            // 创建按钮
            let color = '#EFCB85';
            let btn = $(`<span class="g-dropdown-button pointer pl-button"><a id="${btnDownloadDate.id}" style="color:#fff;background: ${color};border-color:${color}" class="g-button g-button-blue" href="javascript:;"><span class="g-button-right"><em class="icon icon-download"></em><span class="text" style="width: 60px;">下载助手</span></span></a></span>`);
            // 添加按钮
            let $toolWrap;//x-button-box
            this.isHome() === 'home' ? $toolWrap = $(btnDownloadDate.home) : $toolWrap = $(btnDownloadDate.share);
            $toolWrap.prepend(btn);
            btn.click(() => {
                this.initbtn();
            });

            document.querySelectorAll('span').forEach((e) => {
                if (e.textContent.includes('搜索您的文件')) {
                    let divP = e.parentNode.parentNode.parentNode
                    divP.style.maxWidth = '200px';
                }
            });
        },
        isHome() {
            let regx = /[\/].+[\/]/g;
            let page = location.pathname.match(regx);
            let path = page[0].replace(/\//g, '');
            if (path === 'disk') return 'home';
            if (path === 's' || path === 'share') return 'share';
            return '';
        },

        showDownloadLog(fileList, fileStat) {
            let theFile = fileList[0];
            globalData.theFile = theFile;
            let content = `
			<div class="alert-primary" role="alert">
				<div id="logTop">
					<h5 class="alert-heading">正在获取 ${cutString(theFile.server_filename, 40)} 下载链接</h5>
				</div>
				<hr>
				<div id="logleft">
					<div id="logmeg">
						<p class="card-text">下载地址8小时有效，请及时下载</p>
						<p class="card-text">文件大小：<span id="fileMessgeSize"><b>正在获取...</b></span></p>
						<p class="card-text">上传时间：<span id="fileMessgeTime"><b>正在获取...</b></span></p>
					</div>
					<hr>
					<div id="logDownload">
                        <p class="card-text"><b style="color: #ff1a5a;">*  链接&nbsp;&nbsp;↓&nbsp;↓&nbsp;↓&nbsp;：</b></p>
						<p id="logUrl" class="card-text">

						</p>
						<p class="card-text">
							<a id="logaria2" href="javascript:void(0);" >
								发送到 Aria2(Motrix)
							</a>
						</p>
						<p class="card-text"><a href="${globalData.domainB}?help" target="_blank">下载链接使用帮助（必读）</a></p>
					</div>
					<hr>
					<div id="logTips"></div>
				</div>
				<div id="logright">
					<div id="logdownload">
						<div id="logCodeTips"></div>
						<div id="logCodediv">
							<div id="logCodeInput">
								<span id="logCodeTips1"></span>
								<input id="logCode" type="text" value="${getStorage('code')}" />
							</div>
                            <input id="logdownloadBtn" type="button" value="点击获取直链" />
							<div id="logCodeRemark">

                            </div>
						</div>

					</div>
					<div id="logPi">
						<img id="logPiImg" src="https://lingnan.minherd.top/attachment/2021/06/boge杂货铺.png" />
					</div>
				</div>
			</div>
            <hr style="clear: both; margin-top: 10px">

			`;
            this.Swal_log(content, '', 2, '', false)
			.then(value => {
				if (!value) {
					window.open("https://greasyfork.org/zh-CN/scripts/428909/feedback", '_blank');
				}
			});


            //绑定按钮点击（点击获取直链地址）
            $("#logdownloadBtn").click(function () {
                $("#logPi").css('visibility', 'hidden');
                downloadClick()
            });

            /*$("#logaria2").click(function () {
                main.Swal_log('暂不支持发送到Aria2，后续更新将开放')
            });*/

        },


    };

    //css
    GM_addStyle(`
        .swal-modal {
            min-width: 740px;
            width: auto;
        }

        .swal-footer{
            clear: both;
            margin-top: 5px;
        }

        .card-text {
            font-size: 14px;
        }

        .alert-primary {
            text-align: left;
            margin: 0;
            line-height: 2.12rem;
        }

        #logTop {
            text-align: center;
        }

        #logleft {
            float: left;
            width: 50%;
            margin-bottom: 10px;
        }

        #logright {
            float: left;
            width: 46%;
            margin-left: 15px;
        }

        #logmeg,#logDownload,#logTips {
            padding: 0 10px;
        }

        #logPi{
            width: 265px;
            height: 265px;
            margin: 10px 0;
            padding-left: 50%;
            visibility: hidden;
        }
        #logPi img{
            width: 100%;
            left: -132.5px;
            position: relative;
        }

        #logdownload {
            text-align: center;
        }

        #logdownloadBtn {
            width: 260px;
            height: 40px;
            background: #ffa700 !important;
            border-radius: 4px;
            transition: .3s;
            font-size: 20px !important;
            border: 0;
            color: #fff;
            cursor: pointer;
            text-decoration: none;
            font-family: Microsoft YaHei,SimHei,Tahoma;
            font-weight: 100;
            letter-spacing: 2px;
        }

        #logCodeRemark{
            /*display: none;*/
            text-align: left;
            line-height: 1.5rem;
            left: 50%;
            position: relative;
        }

        #logCodeRemark p{
            /*margin: 0 25px;*/
            font-size: 12px;
            left: -130px;
            position: relative;
        }

        #logCodediv {
            font-size: 12px;
            border: 2px solid #EDD;
        }

        #logCodeTips{
            display: none;
            background: #ebebe8;
            padding: 3px 14px;
            color: #000000;
            border-radius: 2px;
            font-weight: bold;
            text-align: left;
            margin-top: 2px;
        }

        #logCodeTips1{
            font-size: 16px;
        }

        #logCodeInput{
            margin: 6px 0;
        }

        #logaria2 {
            /*visibility: hidden;*/
            display: none;
        }

        .point-success {
            background-color: #28a745;
        }
        .point-lg {
            width: 12px;
            height: 12px;
        }
        .point {
            display: inline-block;
            //width: 5px;
            //height: 5px;
            border-radius: 500px;
            margin: 0px 5px;
            background-color: #ddd;
            vertical-align: baseline;

    `);

	const DEBUG = false;
    const divLogContent = document.createElement('div');
    divLogContent.id = "divLogContent";
    main.init();

})();
