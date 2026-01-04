// ==UserScript==
// @name            百度网盘秒传链接提取(最新可维护版本)
// @namespace       https://www.idey.cn/
// @version         2.4.5
// @description     用于提取和生成百度网盘秒传链接,淘宝,京东优惠卷查询
// @author          免费王子
// @license           AGPL
// @homepage          https://www.idey.cn
// @supportURL        https://www.idey.cn
// @match           *://pan.baidu.com/disk/main*
// @match           *://yun.baidu.com/disk/main*
// @match           *://pan.baidu.com/disk/home*
// @match           *://yun.baidu.com/disk/home*
// @match           *://pan.zbhui.cn/*
// @match        *://*.jd.hk/*
// @match        *://*.jd.com/*
// @match      *://*.jkcsjd.com/*
// @match        *://*.taobao.com/*
// @match        *://*.taobao.hk/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match    *://*.yiyaojd.com/*
// @connect     idey.cn
// @connect     baidu.com
// @connect     zbhui.cn
// @connect      baidupcs.com
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require         https://cdn.staticfile.org/spark-md5/3.0.0/spark-md5.min.js
// @require https://unpkg.com/js-base64@3.7.5/base64.js
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @run-at          document-start
// @connect         *
// @antifeature referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加,脚本描述也有说明,请知悉。
// @downloadURL https://update.greasyfork.org/scripts/481575/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%28%E6%9C%80%E6%96%B0%E5%8F%AF%E7%BB%B4%E6%8A%A4%E7%89%88%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481575/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%28%E6%9C%80%E6%96%B0%E5%8F%AF%E7%BB%B4%E6%8A%A4%E7%89%88%E6%9C%AC%29.meta.js
// ==/UserScript==
! function() {
	'use strict';
	var index_num = 0;
	var $ = $ || window.$;
	var item = [];
	var urls = [];
	var selectorList = [];
	var obj = {};
	var failed = 0;
	var bdstoken;
	var checkFileList;
	var fileList=[];
	var dirList=[];
	var inputSavePathHTML =
		'<input id="inputSavePathId" class="swal2-input" placeholder="保存路径, 示例:/BDLIST, 默认保存在BDLIST目录" style="display: flex;margin-top: 10px;font-size:0.95em">';
	var inputSavePath = "";
	var linkList = [];
    var hosturl = 'https://wk.idey.cn/red.html?url=';
	var errList='';
	var defaultPath='/BDLIST';
	var requestData = {};
	var reqstr = '/api/create';
	var reqfile='/rest/2.0/xpan/multimedia?method=listall&order=name&limit=10000&path=';
	var reqold = "https://pcs.baidu.com/rest/2.0/pcs/file?app_id=778750&method=download";
    var reqmetas='/api/filemetas?dlink=1&fsids=';
    var apiHost='https://pan.zbhui.cn';
    var baiduAccessToken='';
	var upresponse='';
    var uk;
	var btnRespConf = {
		id: "btn-resp",
		text: "秒传",
		html: function(type) {
			if (type == "main") {
				return `<button><span>${this.text}</span></button>`
			}else if(type=="home"){
				return `<button><span>${this.text}</span></button>`
			}
		}
	}
	var btnCreateConf = {
		id: "btn-create",
		text: "生成秒传",
		html: function(type) {
			if (type == "main") {
				return `<button><span>${this.text}</span></button>`
			}else if(type=="home"){
				return `<button><span>${this.text}</span></button>`
			}
		}
	}

	var tool = {
		sleep: (time) => {return new Promise((resolve) => setTimeout(resolve, time));},get: async (url, headers, type, extra) => {
			return new Promise((resolve, reject) => {
				let req = GM_xmlhttpRequest({
					method: "GET",
					url,
					headers,
					responseType: type || 'json',
					onload: (res) => {
						if (res.status === 204) {
							req.abort();
						}
						if(type==='arraybuffer'){
							resolve(res);
						} else {
							resolve(res.response || res.responseText);
						}
					},
					onerror: (err) => {
						reject(err);
					}
				});
			})
		},post: async (url, data, headers) => {
			return new Promise((resolve, reject) => {
                 let query = "";
                 for (var key in data)
                     query += "&" + key + "=" + encodeURIComponent(data[key]);
				data = query;
				let req = GM_xmlhttpRequest({
					method: "POST",
					url,
					headers: headers,
					responseType: 'json',
					data: data,
					onload: (res) => {
						resolve(res.response || res.responseText);
					},
					onerror: (err) => {
						reject(err);
					}
				});
			})
		},request:(obj)=>{
			var method=obj.method || 'GET',headers=obj.headers|| {},data=obj.data || {}, url=obj.url || '';
			var xhr=new XMLHttpRequest();
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					if((xhr.status>=200 && xhr.readyState<300) || xhr.status==304){
						obj.callback && obj.callback(xhr.responseText)
					}
				}
			}
			if((obj.method).toUpperCase()=='GET'){
				for(var key in data){
					url+=(url.indexOf("?")==-1 ? '?' :'&');
					url+=encodeURIComponent(key)+ "=" +encodeURIComponent(data['key']);
				}
			}
			xhr.open(method,url,true);
			if((obj.method).toUpperCase()=='GET'){
				xhr.send(null);
			}else{
				xhr.send(JSON.stringify(data));
			}
		},charRecoveStr:(str)=>{
			  var newStr = "";
			    for (var i = 0; i < str.length; i++) {
			        var reverseChar = void 0;
			        if (str.charAt(i) >= "a")
			            reverseChar = str.charAt(i).toUpperCase();
			        else if (str.charAt(i) >= "A")
			            reverseChar = str.charAt(i).toLowerCase();
			        else
			            reverseChar = str.charAt(i);
			        newStr += reverseChar;
			    }
			    return newStr;

		},queryUrlPath:()=>{
			let path=location.href.match(/path=(.+?)(?:&|$)/);
			if (path)
                 return decodeURIComponent(path[1]);
            else
                return "";
		},changePath:(p)=>{
			let fix = p.substring(p.lastIndexOf(".") + 1); // 获取后缀
			return p.substring(0, p.length - fix.length) + tool.charRecoveStr(fix);
		},loadAlert:async()=>{
			let url='https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js';
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			head.appendChild(script);
		},timeStamp:()=>{
			 let time = new Date().getTime();
			 return time;
		},parse: (link) => {
            try {
                let arrays = link.split('\n').map(function(list) {
                    return list.trim().match(/([\dA-Fa-f]{32})#([\dA-Fa-f]{32})#([\d]{1,20})#([\s\S]+)/);
                }).map(function(info) {
                    return {md5: info[1],md5s:info[2],size: info[3],path: info[4]};
                });
                return arrays;
            }
            catch (e) {	return false;}
		},parse1:(link)=>{
              try {
                let arrays = link.split('\n').map(function(list) {
                    return list.trim().match(/([\dA-Fa-f]{32})#([\d]{1,20})#([\s\S]+)/);
                }).map(function(info) {
                    return {md5: info[1],size: info[2],path: info[3]};
                });
                  return arrays;
            }
            catch (e) {	return false;}

        },baiduClass:()=>{
			if (
				location.href.indexOf("//pan.baidu.com/disk/main") > 0 || location.href.indexOf("//yun.baidu.com/disk/main")>0
			) {
				return 'main';
			} else if (
				location.href.indexOf("//pan.baidu.com/s/") > 0
			) {
				return 'share';
			} else if (
				location.href.indexOf("//pan.baidu.com/disk/synchronization") > 0
			) {
				return 'synch';
			}else if (
				location.href.indexOf("//pan.baidu.com/disk/home") > 0 || location.href.indexOf("//yun.baidu.com/disk/home")>0
			) {
				return 'home';
			}
		},inputUserValue:(row = '')=>{
			Swal.fire({
				input: 'textarea',
				title: '请输入秒传',
				inputValue: row,
                allowOutsideClick: false,
				showCancelButton: true,
				inputPlaceholder: '格式：MD5#MD5s#大小#文件名\nMD5#大小#文件名格式 无法转存',
				cancelButtonText: '取消',
				confirmButtonText: '确定',
				onBeforeOpen: function onBeforeOpen() {
					let d = document.createElement('div');
					d.innerHTML += inputSavePathHTML;
					Swal.getContent().appendChild(d);
					let p=tool.queryUrlPath();
					if(p) document.getElementById('inputSavePathId').value=p;

				},
				inputValidator: function inputValidator(inputRow) {
					if (!inputRow) {
						return '不能为空';
					}
					linkList = tool.parse(inputRow);

                    if (!linkList.length) {
						linkList = tool.parse1(inputRow);
						if(linkList.length){
						//	return '抱歉，MD5#大小#文件名格式由于百度接口问题无法转存!其它所有脚本都是无法转存的!!!';
						}
					}


					if (!linkList.length) {
						return '抱歉，链接无法识别哦';
					}


					inputSavePath = document.getElementById('inputSavePathId').value;
					if(!inputSavePath) inputSavePath=defaultPath;


				}
			}).then(function(res) {
				if (!res.dismiss) {
						Swal.fire({
						title: "文件转存中",
						html: "正在转存文件<index>0</index>",
						allowOutsideClick: false,
                        showCloseButton: false,
                            showConfirmButton:false,
						onBeforeOpen: function() {
							Swal.showLoading();
							savePathList(0, 0);
						}
					});
				}
			});
		},cookie:(n)=>{
			  let arrays = unsafeWindow.document.cookie.replace(/\s/g, "").split(";");
				for (var i = 0, l = arrays.length; i < l; i++) {
					var t = arrays[i].split("=");
					if (t[0] === n) {
						return decodeURIComponent(t[1]);
					}
				}
				return "";
		},getCheckFile:(type)=>{
			if(type=="home"){
				return require('system-core:context/context.js').instanceForSystem.list.getSelected();
			}else{
				return document.querySelector(".nd-main-list, .nd-new-main-list").__vue__
				    .selectedList;
			}

		},reqAjax:(f,n,num)=>{
			if(num>=4){
				f.errno=2;
                tool.signMd5(n+1,0);
				return;
			}
			tool.getOtherMd5Step1(f,n,0);
			// $.ajax({
			// 	url: `${reqstr}&bdstoken=${bdstoken}`,
			// 	type: 'POST',
			// 	dataType:'json',
			// 	data: {
			// 		block_list: JSON.stringify([f.md5.toLowerCase()]),
			// 		path: f.path,
			// 		size: f.size,
			// 		isdir: 0,
			// 		rtype: 3,
			// 		is_revision: 1
			// 	},
			// 	success:function(res){
			// 		console.log('res',res);
			// 		if(res.errno===2){
			// 			tool.reqAjax(f,n,++num)
			// 		}else if(res.errno===0){
			// 			tool.signMd5(n+1,0);
			// 		}else if(res.errno===31190){
			// 			tool.getOtherMd5Step1(f,n,0);
			// 		}else{

   //                      tool.getOtherMd5Step1(f,n,0);
			// 		}
			// 	},
			// 	error:function(code){
			// 		f.errno=code;
			// 		tool.signMd5(n+1);
			// 	}

			// })
		},getOtherMd5Step1:(f,n,flag)=>{
            let fsid=JSON.stringify([f.fs_id]);
			tool.post(`${apiHost}/dlink`,{fsid:fsid,token:baiduAccessToken},{"User-Agent":location.href}).then((res)=>{
                if(res.errno===0){
                    tool.getOtherMd5Step2(f,n,flag,res.list[0].dlink);
                }else{
                    f.errno=res.errno;
                    tool.signMd5(n+1,0);
                }

			}).catch((err)=>{
				f.errno=err;
				tool.signMd5(n+1,0);
			})
        },getOtherMd5Step2:(f,n,flag,downfile)=>{
            let bufferSize=f.size< 262144 ? 1 : 262143;
			tool.get(downfile,{Range:"bytes=0-"+bufferSize,"User-Agent":"netdisk;"},'arraybuffer').then((res)=>{
				if(res.finalUrl.includes("issuecdn.baidupcs.com")){
					f.errno=1919;tool.signMd5(n+1,0);
					return;
				}
				let newMd5=res.responseHeaders.match(/content-md5: ([\da-f]{32})/i);
				if(newMd5){ f.md5=newMd5[1].toLowerCase();
                           if(bufferSize==1){
                               f.md5s=f.md5;
                           }else{
                                let sparkmd5=new SparkMD5.ArrayBuffer();
                               sparkmd5.append(res.response);
                               f.md5s=sparkmd5.end();

                           }
                            tool.signMd5(n+1,0);

                }
				else{
					tool.getOtherMd5Step3(f,n,flag,`${reqold}&path=${encodeURIComponent(f.path)}`);
				}
			}).catch((err)=>{
				f.errno=err;
				tool.signMd5(n+1,0);
			})
        },getOtherMd5Step3:(f,n,flag,downfile)=>{
            let bufferSize=f.size< 262144 ? 1 : 262143;
			tool.get(downfile,{Range:"bytes=0-"+bufferSize,"User-Agent":"netdisk;"},'arraybuffer').then((res)=>{
				if(res.finalUrl.includes("issuecdn.baidupcs.com")){
					f.errno=1919;tool.signMd5(n+1,0);
					return;
				}
				let newMd5=res.responseHeaders.match(/content-md5: ([\da-f]{32})/i);
				if(newMd5){ f.md5=newMd5[1].toLowerCase();
                           if(bufferSize==1){
                               f.md5s=f.md5;
                           }else{
                                let sparkmd5=new SparkMD5.ArrayBuffer();
                               sparkmd5.append(res.response);
                               f.md5s=sparkmd5.end();

                           }
                            tool.signMd5(n+1,0);

                }
				else{
					f.errno=996;tool.signMd5(n+1,0);
				}
			}).catch((err)=>{
				f.errno=err;
				tool.signMd5(n+1,0);
			})
        },randMd5:(str)=>{
            let t = [];
            for (let _i = 0, chars = str; _i < chars.length; _i++) {
                var i = chars[_i];
                if (!Math.round(Math.random())) {
                    t.push(i.toLowerCase());
                }
                else {
                    t.push(i.toUpperCase());
                }
            }
            return t.join("");
        },encodeMd5:(md5)=>{
			if (!((parseInt(md5[9]) >= 0 && parseInt(md5[9]) <= 9) ||
			        (md5[9] >= "a" && md5[9] <= "f")))
			        return decrypt(md5);
			    else
			        return md5;
			    function decrypt(encryptMd5) {
			        var key = (encryptMd5[9].charCodeAt(0) - "g".charCodeAt(0)).toString(16);
			        var key2 = encryptMd5.slice(0, 9) + key + encryptMd5.slice(10);
			        var key3 = "";
			        for (var a = 0; a < key2.length; a++)
			            key3 += (parseInt(key2[a], 16) ^ (15 & a)).toString(16);
			        var md5 = key3.slice(8, 16) +
			            key3.slice(0, 8) +
			            key3.slice(24, 32) +
			            key3.slice(16, 24);
			        return md5;
			    }
		},signMd5:(n,flag)=>{
			if(n>=fileList.length){
				tool.showOverSwal();
				return;
			}
			let f=fileList[n];
			if(f.errno && f.isdir==1){
				tool.signMd5(n+1);
				return;
			}
			Swal.getHtmlContainer().querySelector("index").textContent=n+1+"/"+fileList.length;
			tool.reqAjax(f,n,0);
		},forEachListFile:(n,flag)=>{
			if(n>=dirList.length){
				tool.signMd5(0,0);
				return;
			}
			let dirItem=encodeURIComponent(dirList[n]);
			$.ajax({
				url: `${reqfile}${dirItem}&recursion=1&start=${flag}`,
				type: 'GET',
				dataType:'json',
				success:function(res){
					if(!res.errno){
						if(!res.list.length){
							tool.forEachListFile(n+1,0);
						}else{
							res.list.forEach(function(i){
								if(i.isdir){

								}else{
									fileList.push({
										path:i.path,
										size:i.size,
										fs_id:i.fs_id,
										md5:tool.encodeMd5(i.md5.toLowerCase())
									})

								}
							})
							tool.forEachListFile(n,flag+10000);
						}
					}else{
						fileList.push({
							path:dirList[n],
							isdir: 1,
							errno: res.errno,
						})
						tool.forEachListFile(n+1,0);
					}
				},
				error:function(code){
					fileList.push({
						path: dirList[n],
						isdir: 1,
						errno: res.errno,
					})
					tool.forEachListFile(n+1,0);
				}
			})
		},showSwalCreate:()=>{
			Swal.fire({
				title: "秒传生成中",
				html:"<p>正在生成第 <index>0</index> 个</p>",
				showCloseButton: false,
                allowOutsideClick: false,
                showConfirmButton:false,
				onBeforeOpen: function() {
					Swal.showLoading();
				}
			})


		},removeToken:()=>{
            if(baiduAccessToken){
                            baiduAccessToken=null;
                            GM_setValue('BAIDUACCESSTOKEN','');
                        }
        },responseErrnoInfo:(err)=>{
			 switch (err) {
			        case 31045:
			        case -6:
                        tool.removeToken();
			            return "身份验证失败,退出帐户,重新登陆";
                     case 6:
                        tool.removeToken();
			            return "建议10分钟之后用户再进行授权重试。";
			        case -7:
			            return "转存路径含有非法字符, 请改名后重试";
			        case -8:
			            return "路径下存在同名文件";
			        case -9:
			            return "验证已过期, 请刷新页面";
                     case -10:
						return "网盘容量已满";
                     case 255:
			            return "转存数量太多";
			        case 400:
			            return "请求错误";
			        case 9019:
			        case 403:
			            return "接口限制访问";
			        case 404:
			            return "原始文件不存在秒传未生效";
			        case 114:
			            return "秒传失败";
			        case 514:
			            return "请求失败";
			        case 1919:
			            return "文件已被和谐";
			        case 996:
			            return "md5获取失败";
			        case 2:
			            return "参数错误";
			        case -10:
			            return "网盘容量已满";
			        case 500:
			        case 502:
			        case 503:
					case 31039:
			            return "服务器错误";
			        case 31066:
			        case 909:
			            return "路径不存在/云端文件已损坏";
			        case 900:
			            return "路径为文件夹, 不支持生成秒传";
			        case 110:
			            return "请先登录百度账号";
			        case 9013:
			            return "账号被限制, 尝试 更换账号 或 等待一段时间再重试";
                     case 31034:
			            return "接口请求过于频繁，注意控制";
			        default:
			            return "未知错误";
			    }
		},createErrFileList:(err,flag)=>{
			let html='<div class="createBox" style="height:auto; max-height:200px;overflow:auto;background:#FFFFFF;">';
			if(err>0){
				if(flag){
					html+=`<div><summary ><b class="showErrBtn" style="cursor:pointer">失败文件列表(点这里看失败原因):</b><a  class="mCopyList">复制列表</a></summary></div>`;
					html+=`<div style="display:none" class="errBox">`;
					for (let i=0;i<fileList.length;i++) {
						let f=fileList[i];
                        if(f.errno !=undefined && f.errno !='' && f.errno !=0){
                            errList+=`${f.path}(${f.errno})${tool.responseErrnoInfo(f.errno)}\n`;
                            html+='<p style="font-size:12px;line-height:22px">'+f.path+'<span class="redLink">('+f.errno+')'+tool.responseErrnoInfo(f.errno)+'</span></p>'
                        }
					}
					html+=`</div>`;
				}else{
					html+=`<div><summary ><b class="showErrBtn" style="cursor:pointer">失败文件列表(点这里看失败原因):</b><a  class="mCopyList">复制重新转存</a></summary></div>`;
					html+=`<div style="display:none" class="errBox">`;
					for (let i=0;i< linkList.length;i++) {
						let f=linkList[i];
                          if(f.errno !=undefined && f.errno !='' && f.errno !=0){
                            errList+=`${f.md5}#${f.md5s}#${f.size}#${f.path}\n`;
                            html+='<p style="font-size:12px;line-height:22px">'+f.path+'<span class="redLink">('+f.errno+')'+tool.responseErrnoInfo(f.errno)+'</span></p>'
                        }

					}
					html+=`</div>`;
				}

			}
			html+=`<br/>`;
			if(upresponse && upresponse.result){
				html+=upresponse.result;
			}
			if(flag){
				html+=`<p>快去复制秒传代码吧!!!</p></div>`
			}else{
				html+=`<p>快去刷新页面查看文件吧!!!</p></div>`
			}

			return html;
		},showOverSwal:()=>{
			let err=0,success='',ucode='',ecode='https://pan.baidu.com/#bdlink=';
			for (let i=0;i<fileList.length;i++) {
				let f=fileList[i];
				if(f.errno || f.isdir==1){
					err++;
				}else{
					success+='<p>'+f.path+'</p>';
                    if(f.md5s){
                        ucode+=`${f.md5}#${f.md5s}#${f.size}#${f.path}\n`;
                    }else{
                        ucode+=`${f.md5}#${f.size}#${f.path}\n`;
                    }
				}
			}
			let title="生成完成 共"+fileList.length+"个,失败"+err+"个";
			let html=tool.createErrFileList(err,true);
			Swal.fire({
				title: title,
				html:html,
                allowOutsideClick: false,
				showCloseButton: true,
				showConfirmButton:true,
				confirmButtonText:"复制秒传代码",
				showDenyButton:true,
				denyButtonText:"提取一键秒传代码",
				preDeny:function(){
					let newCode=ucode.replace(/(#\/.+\/)|(#\/)/g, "#");
					GM_setClipboard(ecode+Base64.encode(newCode));
					Swal.getDenyButton().innerText="一键秒传提取成功";
					return false;
				},
				preConfirm:function(){
					GM_setClipboard(ucode.replace(/(#\/.+\/)|(#\/)/g, "#"));
					Swal.getConfirmButton().innerText="复制成功";
					return false;
				}

			})
			fileList=[];dirList=[];
			tool.removeBtn();
			//添加事件
			tool.addEventBtn();
		},removeBtn:()=>{
			let mbtn1=GM_getValue('MBTN1');
			let mbtn2=GM_getValue('MBTN2');
			let mbtn3=GM_getValue('MBTN3');
			try{
				if(mbtn1) $(".mPbox1").remove();
				if(mbtn2) $(".mPbox2").remove();
				if(mbtn3) $(".mPbox3").remove();
			}catch(e){
				//TODO handle the exception
			}


		},addEventBtn:()=>{
			try{
				$(".mbtn1").click(function(){
					GM_setValue('MBTN1',1);
					$(".mPbox1").remove();
				})
				$(".mbtn2").click(function(){
					GM_setValue('MBTN2',1);
					$(".mPbox2").remove();
				})
				$(".mbtn3").click(function(){
					GM_setValue('MBTN3',1);
					$(".mPbox3").remove();
				})
				$(".showErrBtn").click(function(){
					if($(".errBox").is(':visible')){
						$(".errBox").hide();
					}else{
						$(".errBox").show();
					}
				})
				$(".mCopyList").click(function(){
					GM_setClipboard(errList);
					$(this).html('已复制');
				})
			}catch(e){
				//TODO handle the exception
			}
		},openIframeWindow:(url)=>{
			let iframe = document.createElement("iframe");
			iframe.setAttribute("width", "80%");
			iframe.setAttribute("height", "500");
			iframe.setAttribute("height", "500");
            iframe.setAttribute("id","iframeToken");
			//iframe.setAttribute("display","none");
			iframe.setAttribute("src", url);
			document.body.appendChild(iframe);
			tool.listenAccessToken(iframe);

		},getAccessToken:()=>{
            Swal.fire({
				title: '请先获取百度网盘授权',
                //html:html,
                allowOutsideClick: false,
				showCloseButton: true,
				showConfirmButton:true,
				confirmButtonText:"点击获取授权",
				preConfirm:function(){
					tool.openIframeWindow(`${apiHost}/pan`);

				}
			});
        },listenAccessToken:(iframe)=>{
            let timer=setInterval(function(){
                let baiduAccessTokenNew=GM_getValue('BAIDUACCESSTOKEN');
				if(baiduAccessTokenNew && baiduAccessTokenNew !=baiduAccessToken){
					baiduAccessToken=baiduAccessTokenNew;
					iframe.parentNode.removeChild(iframe);
					clearInterval(timer);
				}
            }, 1000);
        },getUserInfoUk:()=>{
            tool.get(`https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo&${new Date().getTime()}`).then((res)=>{
                if(uk){
                    if(uk !=res.uk){
                        baiduAccessToken=null;
                        GM_setValue('BAIDUACCESSTOKEN','');
                        uk=res.uk;
                        GM_setValue('BAIDUUK',res.uk);
                    }
                }else{
                    uk=res.uk;
                    GM_setValue('BAIDUUK',res.uk);

                }
            })
        },updateInfo:(data)=>{
			Swal.fire({
				title: "百度网盘秒传链接提取 v" + GM_info.script.version,
				showCloseButton: true,
				allowOutsideClick: false,
				confirmButtonText: "知道了",
				html:data
			}).then(function(res) {
				GM_setValue('BAIDUWPUPDATEINFO',tool.timeStamp());
			});
		}
	}
	function init(){
		//检查是否一键秒传代码
		 let base64code = location.href.match(/#bdlink=([\da-zA-Z+/=]+)/);
		 if(base64code) base64code=base64code[1];
		 if(base64code){
			GM_setValue('BASE64CODELINK',base64code);
		 }
		if (["interactive", "complete"].includes(document.readyState)){
			main();
		}
		else{
			window.addEventListener("DOMContentLoaded", main);
		}


	}



	function main() {
		GM_addStyle(
			`#btn-resp button,#btn-create button{line-height: 1;white-space: nowrap;cursor: pointer;outline: 0; margin: 0; transition: 0.1s;color: #fff; background-color: #06a7ff;font-weight: 700; padding: 8px 16px;height: 32px;font-size: 14px; border-radius: 16px;margin-left: 8px;    border: none;} .createBox p{line-height: 35px;} #iframeToken{position: absolute;left: 18%;top: 209px;z-index: 1000;background-color: #ccc;width:800px} .myDidplayBtn{text-align: center;font-size: .85em;color: #09aaff;border: 2px solid #c3eaff;border-radius: 4px;margin-left: 5px;padding: 10px;padding-top: 5px;padding-bottom: 5px;cursor: pointer;} .redLink{color:red}`
			)
		tool.loadAlert();
		let baiduCla = tool.baiduClass();
        baiduAccessToken=GM_getValue('BAIDUACCESSTOKEN');
        uk=GM_getValue('BAIDUUK');
        tool.getUserInfoUk();

		if (baiduCla == "main" || baiduCla=="home") {
			// 创建按钮 START
			let btnResp = document.createElement('a');
			btnResp.id = btnRespConf.id;
			btnResp.title = btnRespConf.text;
			btnResp.innerHTML = btnRespConf.html(baiduCla);
			btnResp.addEventListener('click', function(e) {
                if(baiduAccessToken && uk){
                    tool.inputUserValue();
                    e.preventDefault();
                }else{
                    tool.getAccessToken();
                    e.preventDefault();
                }
			});
			bdstoken =baiduCla=='home' ? locals.get('bdstoken') : unsafeWindow.locals.userInfo.bdstoken;
			let btnCreate = document.createElement('a');
			btnCreate.id = btnCreateConf.id;
			btnCreate.title = btnCreateConf.text;
			btnCreate.innerHTML = btnCreateConf.html(baiduCla);
			btnCreate.addEventListener('click', function(e) {
                if(baiduAccessToken && uk){
                    checkFileList=tool.getCheckFile(baiduCla);
                    if(checkFileList.length<=0){
                        Swal.fire({
                            title: "错误提醒",
                            html:"请勾选要生成秒传的文件/文件夹",
                            confirmButtonText: '确定',
                            showCloseButton: true
                        })
                        return '';
                    }
                    for (let i=0;i<checkFileList.length;i++) {
                        if(checkFileList[i].isdir){
                            dirList.push(checkFileList[i].path);
                        }else{
                            fileList.push({
                                path:checkFileList[i].path,
                                size:checkFileList[i].size,
                                fs_id:checkFileList[i].fs_id,
                                md5:tool.encodeMd5(checkFileList[i].md5.toLowerCase())
                            })
                        }
                    }
                    if(dirList.length>0){
                        Swal.fire({
                            icon: "info",
                            title: "包含文件夹, 是否递归生成?",
                            text: "若选是, 将同时生成各级子文件夹下的文件",
                            allowOutsideClick: false,
                            focusCancel: true,
                            showCancelButton: true,
                            reverseButtons: true,
                            showCloseButton: true,
                            confirmButtonText: "是",
                            cancelButtonText: "否",
                        }).then(function(res) {
                            if (!res.dismiss) {
                                tool.forEachListFile(0,0);
                                tool.showSwalCreate();


                            }
                        });
                    }else{
                        tool.showSwalCreate();
                        tool.signMd5(0,0);
                    }

                    e.preventDefault();
                }else{
                     tool.getAccessToken();
                    e.preventDefault();
                }
			});

			if(baiduCla=="home"){
				tool.sleep(800).then(()=>{
					let parent = null;
					let btnUpload = document.querySelector('[node-type=upload]'); // 管理页面：【上传】
                    btnUpload.style.maxWidth = '80px';
                    btnUpload.style.display = 'inline-block';
					parent = btnUpload.parentNode;
					parent.insertBefore(btnResp, parent.childNodes[1]);
					parent.insertBefore(btnCreate, parent.childNodes[1]);
				})


			}else{
				let btnUpload;
				btnUpload = document.querySelector(
					"[class='nd-file-list-toolbar nd-file-list-toolbar__actions inline-block-v-middle']");
				if (btnUpload) {
					btnResp.style.cssText = 'margin-right: 5px;';
					btnCreate.style.cssText = 'margin-right: 5px;';

					btnUpload.insertBefore(btnResp, btnUpload.childNodes[0]);
					btnUpload.insertBefore(btnCreate, btnUpload.childNodes[0]);
				} else {
					btnUpload = document.querySelector(
						"[class='wp-s-agile-tool-bar__header  is-default-skin is-header-tool']");
					if (!btnUpload) {
						btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-header-tool']");
					}
					let parentDiv = document.createElement('div');
					parentDiv.className = 'wp-s-agile-tool-bar__h-action is-need-left-sep is-list';
					parentDiv.style.cssText = 'margin-right: 10px;';
					parentDiv.insertBefore(btnResp, parentDiv.childNodes[0]);
					parentDiv.insertBefore(btnCreate, parentDiv.childNodes[0]);
					btnUpload.insertBefore(parentDiv, btnUpload.childNodes[0]);
				}
			}

			let base64code=GM_getValue('BASE64CODELINK');
			if(base64code){
				base64code=Base64.decode(base64code);
				if(typeof swal === 'undefined'){
					tool.sleep(1000).then(()=>{
						tool.inputUserValue(base64code);
						GM_setValue('BASE64CODELINK','');
						updateVersion(true);
					})
				}else{
					tool.inputUserValue(base64code);
				    GM_setValue('BASE64CODELINK','');
				    updateVersion(true);
				}


			}else{
				updateVersion(false);
			}


		}
	}

	function updateVersion(flag){
		//判断是否更新
		var isUpdateInfo= GM_getValue('BAIDUWPUPDATEINFO') || 0;
		tool.get(`${apiHost}/upnow?version=`+GM_info.script.version).then((res)=>{
			try{
				upresponse=res;
				if(!flag){
					let nowTime=tool.timeStamp();
					let isdiff=isUpdateInfo+60*24*1000;
					if(res.code==1 && nowTime>isdiff){
						tool.updateInfo(res.data);
						tool.removeBtn();
						//添加事件
						tool.addEventBtn();
					}else if(res.code==2 && nowTime>(isUpdateInfo+24*60*5*1000)){
						tool.updateInfo(res.data);
						tool.removeBtn();
						//添加事件
						tool.addEventBtn();
					}
				}
			}catch(e){
				//TODO handle the exception
			}
		})
	}



	function savePathList(i, labFig) {
		if (i >= linkList.length) {
			let html=tool.createErrFileList(failed,false);
			Swal.fire({
				title: "".concat('文件转存').concat(linkList.length, '个,').concat(failed, "个失败!"),
				confirmButtonText: '确定',
                allowOutsideClick: false,
                showCloseButton: true,
				html:html
			})
			failed = 0;
			linkList=[];
			tool.removeBtn();
			//添加事件
			tool.addEventBtn();
			return;
		}

		var f = linkList[i];
		Swal.getHtmlContainer().querySelector("index").textContent=i+1+"/"+linkList.length;
        f.path.replace(/["\\\:*?<>|]/, "");

        tool.post(`${apiHost}/savefile`,{
			md5:f.md5,path:f.path,size:f.size,inputPath:inputSavePath,token:baiduAccessToken
		},{"User-Agent":location.href}).then((res)=>{
				if(res.errno===0){
					f.errno = 0;
					savePathList(i+1,0);
				}else{
                    failed++;
					f.errno =res.errno;
					savePathList(i+1,0);
				}
			}).catch((err)=>{
				f.errno =400;
                failed++;
				savePathList(i+1,0);
			})




	}

	obj.onclicks = function(link) {
		if (document.getElementById('redirect_form')) {
			var form = document.getElementById('redirect_form');
			form.action = hosturl + encodeURIComponent(link);
		} else {
			var form = document.createElement('form');
			form.action = hosturl + encodeURIComponent(link);
			form.target = '_blank';

			form.method = 'POST';
			form.setAttribute("id", 'redirect_form');
			document.body.appendChild(form);

		}
		form.submit();
		form.action = "";
		form.parentNode.removeChild(form);
	};
	obj.GetQueryString = function(name) {
		var reg = eval("/" + name + "/g");
		var r = window.location.search.substr(1);
		var flag = reg.test(r);
		if (flag) {
			return true;
		} else {
			return false;
		}
	};
	obj.getUrlParam = function(name) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == name) {
				return pair[1];
			}
		}
		return (false);
	}

	obj.get_url = function() {
		item[index_num] = [];
		urls[index_num] = [];
		$("#J_goodsList li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var skuid = $(this).attr('data-sku');
				var itemurl = '//item.jd.com/' + skuid + '.html';
				if (skuid != undefined) {
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}


				}
			}

		})

		$("#plist li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var skuid = $(this).find('.j-sku-item').attr('data-sku');
				var itemurl = '//item.jd.com/' + skuid + '.html';
				if (skuid != undefined) {
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}


				}
			}

		})

		$(".m-aside .aside-bar li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var sku_c = $(this).attr('sku_c');
						if (sku_c == undefined) {
							var arr = [];
							var str = $(this).attr('onclick');
							arr = str.split(",");
							sku_c = trim(arr[6].replace(/\"/g, ""));
							itemurl = '//item.jd.com/' + sku_c + '.html';
						}

					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}



				}
			}

		})
		$(".goods-chosen-list li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var arr = [];
						var str = $(this).attr('onclick');
						arr = str.split(",");
						var sku_c = trim(arr[6].replace(/\"/g, ""));
						itemurl = '//item.jd.com/' + sku_c + '.html';

					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}

				}




			}

		})

		$(".may-like-list li").each(function(index) {
			if ($(this).attr('data-type') != 'yes') {
				var itemurl = $(this).find("a").attr('href');
				if (itemurl != '') {
					if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
						var arr = [];
						var str = $(this).attr('onclick');
						arr = str.split(",");
						var sku_c = trim(arr[6].replace(/\"/g, ""));
						itemurl = '//item.jd.com/' + sku_c + '.html';
					}
					if (urls[index_num].length < 4) {
						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}


				}
			}

		})



		if (urls.length > 0 && urls[index_num].length > 0 && item[index_num].length > 0) {


			var u = urls[index_num].join(',');
			$.getJSON('https://shop.idey.cn/jd.php', {
				act: 'itemlink',
				itemurl: u,
				num: index_num
			}, function(res) {
				if (res.type == 'success') {
					for (var i = 0; i < res.data.length; i++) {
						item[res.num][i].find("a").attr('data-ref', res.data[i].longUrl);
						item[res.num][i].find("a").attr('target', '');
						item[res.num][i].find("a").unbind("click");
						item[res.num][i].find("a").bind("click", function(e) {
							if ($(this).attr('data-ref')) {
								e.preventDefault();
								obj.onclicks($(this).attr('data-ref'));

							}
						})

					}

				}
			})


		}
		index_num += 1;

	};
	obj.get_miaosha = function() {
		item[index_num] = [];
		urls[index_num] = [];
		$(".seckill_mod_goodslist li").each(function(index) {

			if ($(this).attr('data-type') != 'yes') {

				var itemurl = $(this).find("a").attr('href');
				var skuid = $(this).attr('data-sku');
				var that = $(this);
				if (itemurl != '') {
					if (urls[index_num].length < 4) {

						item[index_num].push($(this));
						urls[index_num].push(itemurl);
						$(this).attr('data-type', 'yes');
					}


				}
			}

		})



		if (urls.length > 0 && urls[index_num].length > 0 && item[index_num].length > 0) {


			var u = urls[index_num].join(',');
			$.getJSON('https://shop.idey.cn/jd.php', {
				act: 'itemlink',
				itemurl: u,
				num: index_num
			}, function(res) {
				if (res.type == 'success') {
					for (var i = 0; i < res.data.length; i++) {
						item[res.num][i].find("a").attr('data-ref', res.data[i].longUrl);
						item[res.num][i].find("a").attr('href', "javascript:void(0);");
						item[res.num][i].find("a").attr('target', '');
						//	item[res.num][i].find("a").unbind("click");

						item[res.num][i].find("a").click(function(e) {
							e.preventDefault();
							obj.onclicks($(this).attr('data-ref'));
						})

					}

				}
			})


		}
		index_num += 1;
	};
	const style =
		`
  			.gwd_taobao .gwd-minibar-bg, .gwd_tmall .gwd-minibar-bg {
  			    display: block;
  			}

  			.idey-minibar_bg{
  			    position: relative;
  			    min-height: 40px;
  			    display: inline-block;
  			}
  			#idey_minibar{
  			    width: 560px;
  			    background-color: #fff;
  			    position: relative;
  			    border: 1px solid #e8e8e8;
  			    display: block;
  			    line-height: 36px;
  			    font-family: 'Microsoft YaHei',Arial,SimSun!important;
  			    height: 36px;
  			    float: left;
  			}
  			#idey_minibar .idey_website {
  			    width: 48px;
  			    float: left;
  			    height: 36px;
  			}
  			#idey_minibar .minibar-tab {
  			    float: left;
  			    height: 36px;
  			    border-left: 1px solid #edf1f2!important;
  			    padding: 0;
  			    margin: 0;
  			    text-align: center;
  			}

  			#idey_minibar .idey_website em {
  			    background-position: -10px -28px;
  			    height: 36px;
  			    width: 25px;
  			    float: left;
  			    margin-left: 12px;
  			}

  			.setting-bg {
  			    background: url(https://cdn.gwdang.com/images/extensions/xbt/new_wishlist_pg5_2.png) no-repeat;
  			}

  			#idey_minibar .minibar-tab {
  			    float: left;
  			    height: 36px;
  			    border-left: 1px solid #edf1f2!important;
  			    padding: 0;
  			    margin: 0;
  			    width: 134px;
  			}
  			#idey_price_history span {
  			    float: left;
  			    width: 100%;
  			    text-align: center;
  			    line-height: 36px;
  			    color: #666;
  			    font-size: 14px;
  			}

  			#mini_price_history .trend-error-info-mini {
  			    position: absolute;
  			    top: 37px;
  			    left: 0px;
  			    width: 100%;
  			    background: #fff;
  			    z-index: 99999999;
  			    height: 268px;
  			    box-shadow: 0px 5px 15px 0 rgb(23 25 27 / 15%);
  			    border-radius: 0 0 4px 4px;
  			    width:559px;
  			    border: 1px solid #ddd;
  			    border-top: none;
  				display:none;

  			}
  			.minibar-btn-box {
  			    display: inline-block;
  			    margin: 0 auto;
  			    float: none;
  			}
  			#mini_price_history .error-p {
  			      width: 95px;
  			      margin: 110px auto;
  			      height: 20px;
  			      line-height: 20px;
  			      text-align: center;
  			      color: #000!important;
  			      border: 1px solid #333;
  			      border-radius: 5px;
  			      display: block;
  			      text-decoration: none!important;
  			    }
  			 #mini_price_history:hover .trend-error-info-mini {
  			      display: block;
  			    }

  			.collect_mailout_icon {
  			    background-position: -247px -134px;
  			    width: 18px;
  			}

  			#idey_mini_compare_detail li *, .mini-compare-icon, .minibar-btn-box * {
  			    float: left;
  			}
  			.panel-wrap{
  				width: 100%;
  				height: 100%;
  			}
  			.collect_mailout_icon, .mini-compare-icon {
  			    height: 18px;
  			    margin-right: 8px;
  			    margin-top: 9px;
  			}
  			.all-products ul li {
  			    float: left;
  			    width: 138px;
  			    height: 262px;
  			    overflow: hidden;
  			    text-align: center;
  			}
  			.all-products ul li .small-img {
  			    text-align: center;
  			    display: table-cell;
  			    vertical-align: middle;
  			    line-height: 90px;
  			    width: 100%;
  			    height: 100px;
  			    position: relative;
  			    float: left;
  			    margin-top: 23px;
  			}
  			.all-products ul li a img {
  			    vertical-align: middle;
  			    display: inline-block;
  			    width: auto;
  			    height: auto;
  			    max-height: 100px;
  			    max-width: 100px;
  			    float: none;
  			}
  			.all-products ul li a.b2c-other-info {
  			    text-align: center;
  			    float: left;
  			    height: 16px;
  			    line-height: 16px;
  			    margin-top: 13px;
  			}

  			.b2c-other-info .gwd-price {
  			    height: 17px;
  			    line-height: 17px;
  			    font-size: 16px;
  			    color: #E4393C;
  			    font-weight: 700;
  				width: 100%;
  				display: block;
  			}
  			.b2c-other-info .b2c-tle {
  			    height: 38px;
  			    line-height: 19px;
  			    margin-top: 8px;
  			    font-size: 12px;
  			    width: 138px;
  			    margin-left: 29px;
  			}
  			 .bjgext-mini-trend span {
  			      float: left;
  			      /*width: 100%;*/
  			      text-align: center;
  			      line-height: 36px;
  			      color: #666;
  			      font-size: 14px;
  			    }
  			    .bjgext-mini-trend .trend-error-info-mini {
  			      position: absolute;
  			      top: 37px;
  			      left: 0px;
  			      width: 100%;
  			      background: #fff;
  			      z-index: 99999999;
  			      height: 268px;
  			      display: none;
  			      box-shadow: 0px 5px 15px 0 rgba(23,25,27,0.15);
  			      border-radius: 0 0 4px 4px;
  			      width: 460px;
  			      border: 1px solid #ddd;
  			      border-top: none;
  			    }
  			    .bjgext-mini-trend .error-p {
  			      width: 100%;
  			      float: left;
  			      text-align: center;
  			      margin-top: 45px;
  			      font-size: 14px;
  			      color: #666;
  			    }
  			    .bjgext-mini-trend .error-sp {
  			      width: 95px;
  			      margin: 110px auto;
  			      height: 20px;
  			      line-height: 20px;
  			      text-align: center;
  			      color: #000!important;
  			      border: 1px solid #333;
  			      border-radius: 5px;
  			      display: block;
  			      text-decoration: none!important;
  			    }
  			    .bjgext-mini-trend:hover .trend-error-info-mini {
  			      display: block;
  			    }


  			    #coupon_box.coupon-box1 {
  			      width: 560px;
  			      height: 125px;
  			      background-color: #fff;
  			      border: 1px solid #e8e8e8;
  			      border-top: none;
  			      position: relative;
  			      margin: 0px;
  			      padding: 0px;
  			      float: left;
  			      display: block;
  			    }
  			    #coupon_box:after {
  			      display: block;
  			      content: "";
  			      clear: both;
  			    }
  			    .idey_tmall #idey_minibar {
  			      float: none;
  			    }


  			    .minicoupon_detail {
  			      position: absolute;
  			      top: 35px;
  			      right: -1px;
  			      height: 150px;
  			      width: 132px;
  			      display: none;
  			      z-index: 99999999999;
  			      background: #FFF7F8;
  			      border: 1px solid #F95774;
  			    }
  			    #coupon_box:hover .minicoupon_detail {
  			      display: block;
  			    }
  			    .minicoupon_detail img {
  			      width: 114px;
  			      height: 114px;
  			      float: left;
  			      margin-left: 9px;
  			      margin-top: 9px;
  			    }
  			    .minicoupon_detail span {
  			      font-size: 14px;
  			      color: #F95572;
  			      letter-spacing: 0;
  			      font-weight: bold;
  			      float: left;
  			      height: 12px;
  			      line-height: 14px;
  			      width: 100%;
  			      margin-top: 6px;
  			      text-align: center;
  			    }
  			    .coupon-box1 * {
  			      font-family: 'Microsoft YaHei',Arial,SimSun;
  			    }
  			    .coupon-icon {
  			      float: left;
  			      width: 20px;
  			      height: 20px;
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/coupon_icon.png') 0px 0px no-repeat;
  			      margin: 50px 8px 9px 12px;
  			    }
  			    #coupon_box .coupon-tle {
  			      color: #FF3B5C;
  			      font-size: 24px;
  			      margin-right: 11px;
  			      float: left;
  			      height: 114px;
  			      overflow: hidden;
  			      text-overflow: ellipsis;
  			      white-space: nowrap;
  			      width: 375px;
  			      line-height: 114px;
  			      text-decoration: none!important;
  			    }
  			    #coupon_box .coupon-row{
  			         color: #FF3B5C;
  			      font-size: 12px;
  			      margin-right: 11px;
  			      float: left;
  			      height: 60px;
  			      overflow: hidden;
  			      text-overflow: ellipsis;
  			      white-space: nowrap;
  			      width: 100%;
  			      line-height: 60px;
  			      text-decoration: none!important;
  			        text-align: center;
  			    }
  			    #coupon_box .coupon-tle * {
  			      color: #f15672;
  			    }
  			    #coupon_box .coupon-tle span {
  			      margin-right: 5px;
  			      font-weight: bold;
  			      font-size: 14px;
  			    }
  			    .coupon_gif {
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/turn.gif') 0px 0px no-repeat;
  			      float: right;
  			      height: 20px;
  			      width: 56px;
  			      margin-top: 49px;
  			    }
  			    .click2get {
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/coupon_01.png') 0px 0px no-repeat;
  			      float: left;
  			      height: 30px;
  			      width: 96px;
  			      margin-top: 43px;
  			    }
  			    .click2get span {
  			      height: 24px;
  			      float: left;
  			      margin-left: 1px;
  			    }
  			    .c2g-sp1 {
  			      width: 50px;
  			      color: #FF3B5C;
  			      text-align: center;
  			      font-size: 14px;
  			      line-height: 24px!important;
  			    }
  			    .c2g-sp2 {
  			      width: 44px;
  			      line-height: 24px!important;
  			      color: #fff!important;
  			      text-align: center;
  			    }
  			    div#idey_wishlist_div.idey_wishlist_div {
  			      border-bottom-right-radius: 0px;
  			      border-bottom-left-radius: 0px;
  			    }
  			    #qrcode{
  			         float: left;
  			        width: 125px;
  			        margin-top:3px;
  			    }


  			    .elm_box{
  			        height: 37px;
  			     border: 1px solid #ddd;
  			     width: 460px;
  			     line-height: 37px;
  			     margin-bottom: 3px;
  			         background-color: #ff0036;
  			             font-size: 15px;
  			    }
  			    .elm_box span{
  			            width: 342px;
  			    text-align: center;
  			    display: block;
  			    float: left;
  			    color: red;
  			    color: white;
  			    }`


	function trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}

	function removeEvent(that, href) {
		that.find("a").attr('target', '');
		that.find("a").unbind("click");
		that.find("a").bind("click", function(e) {
			e.preventDefault();
			if (href != undefined) {
				obj.onclicks(href);
			} else {
				obj.onclicks($(this).attr('href'));
			}

		})
	}
	obj.initStyle = function() {
		var styles = document.createElement('style')
		styles.type = 'text/css'
		styles.innerHTML = style;
		document.getElementsByTagName('head').item(0).appendChild(styles)
	}


	obj.initSearchHtml = function(selectorList) {
		setInterval(function() {
			selectorList.forEach(function(selector) {
				obj.initSearchItemSelector(selector);
			});
		}, 3000);
	};

	obj.initSearchEvent = function() {
		$(document).on("click", ".tb-cool-box-area", function() {
			var $this = $(this);
			if ($this.hasClass("tb-cool-box-wait")) {
				obj.basicQueryItem(this);
			} else if ($this.hasClass("tb-cool-box-info-translucent")) {
				$this.removeClass("tb-cool-box-info-translucent");
			} else {
				$this.addClass("tb-cool-box-info-translucent");
			}
		});
	};

	obj.basicQuery = function() {
		setInterval(function() {
			$(".tb-cool-box-wait").each(function() {
				obj.basicQueryItem(this);
			});
		}, 3000);
	};

	obj.initSearchItemSelector = function(selector) {
		$(selector).each(function() {
			obj.initSearchItem(this);
		});
	};

	obj.initSearchItem = function(selector) {
		var $this = $(selector);
		if ($this.hasClass("tb-cool-box-already")) {
			return;
		} else {
			$this.addClass("tb-cool-box-already")
		}

		var nid = $this.attr("data-id");
		if (!obj.isVailidItemId(nid)) {
			nid = $this.attr("data-itemid");
		}

		if (!obj.isVailidItemId(nid)) {
			if ($this.attr("href")) {
				nid = location.protocol + $this.attr("href");
			} else {
				var $a = $this.find("a");
				if (!$a.length) {
					return;
				}

				nid = $a.attr("data-nid");
				if (!obj.isVailidItemId(nid)) {
					if ($a.hasClass("j_ReceiveCoupon") && $a.length > 1) {
						nid = location.protocol + $($a[1]).attr("href");
					} else {
						nid = location.protocol + $a.attr("href");
					}
				}
			}
		}

		if (obj.isValidNid(nid)) {
			obj.basicQueryItem($this, nid);
		}
	};



	obj.basicQueryItem = function(selector, nid) {
		var $this = $(selector);
		$.get('https://tb.idey.cn/taobao.php?act=itemlink&itemid=' + nid, function(data) {
			if (data.type == 'success') {
				obj.changeUrl($this, data.data);
			} else {

			}
		}, 'json')
	};

	obj.changeUrl = function(selector, data) {
		var $this = $(selector);
		var a = $this.find("a");
		$this.find("a").attr('href', data.itemUrl);
		$this.find("a").attr('data-href', data.itemUrl);
		$this.find("a").click(function(e) {
			e.preventDefault();
			obj.onclicks($(this).attr('data-href'));
		})
	}


	obj.isDetailPageTaoBao = function(url) {
		if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 ||
			url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf(
				"//detail.tmall.hk/hk/item.htm") > 0) {
			return true;
		} else {
			return false;
		}
	};

	obj.isVailidItemId = function(itemId) {
		if (!itemId) {
			return false;
		}

		var itemIdInt = parseInt(itemId);
		if (itemIdInt == itemId && itemId > 10000) {
			return true;
		} else {
			return false;
		}
	};

	obj.isValidNid = function(nid) {
		if (!nid) {
			return false;
		} else if (nid.indexOf('http') >= 0) {
			if (obj.isDetailPageTaoBao(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	};

	obj.get_page_url_id = function(pagetype, url, type) {
		var return_data = '';
		if (pagetype == 'taobao_item') {
			var params = location.search.split("?")[1].split("&");
			for (var index in params) {
				if (params[index].split("=")[0] == "id") {
					var productId = params[index].split("=")[1];
				}
			}
			return_data = productId;
		}
		return return_data;
	}

	obj.get_type_url = function(url) {
		if (
			url.indexOf("//item.taobao.com/item.htm") > 0 ||
			url.indexOf("//detail.tmall.com/item.htm") > 0 ||
			url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 ||
			url.indexOf("//detail.tmall.hk/hk/item.htm") > 0 ||
			url.indexOf("//world.tmall.com") > 0 ||
			url.indexOf("//detail.liangxinyao.com/item.htm") > 0 ||
			url.indexOf("//detail.tmall.hk/item.htm") > 0
		) {
			return 'taobao_item';
		} else if (
			url.indexOf("//maiyao.liangxinyao.com/shop/view_shop.htm") > 0 ||
			url.indexOf("//list.tmall.com/search_product.htm") > 0 ||
			url.indexOf("//s.taobao.com/search") > 0 ||
			url.indexOf("//list.tmall.hk/search_product.htm") > 0
		) {
			return 'taobao_list';
		} else if (
			url.indexOf("//search.jd.com/Search") > 0 ||
			url.indexOf("//search.jd.com/search") > 0 ||
			url.indexOf("//search.jd.hk/search") > 0 ||
			url.indexOf("//search.jd.hk/Search") > 0 ||
			url.indexOf("//www.jd.com/xinkuan") > 0 ||
			url.indexOf("//list.jd.com/list.html") > 0 ||
			url.indexOf("//search.jd.hk/Search") > 0 ||
			url.indexOf("//coll.jd.com") > 0


		) {
			return 'jd_list';
		} else if (
			url.indexOf("//item.jd.hk") > 0 ||
			url.indexOf("//pcitem.jd.hk") > 0 ||
			url.indexOf("//i-item.jd.com") > 0 ||
			url.indexOf("//item.jd.com") > 0 ||
			url.indexOf("//npcitem.jd.hk") > 0 ||
			url.indexOf("//item.yiyaojd.com") > 0 ||
			url.indexOf("//item.jkcsjd.com") > 0
		) {
			return 'jd_item';
		} else if (
			url.indexOf("//miaosha.jd.com") > 0
		) {
			return 'jd_miaosha';
		} else if (
			url.indexOf("//www.jd.com") > 0 ||
			url.indexOf("//jd.com") > 0
		) {
			return 'jd_index';
		} else if (
			url.indexOf("//pan.baidu.com") > 0 ||
			url.indexOf("//yun.baidu.com") > 0
		) {
			return 'baidu_pan';
		} else if (
			url.indexOf("//jingfen.jd.com") > 0
		) {
			return 'jingfen';
		}else if (
			url.indexOf("//pan.zbhui.cn") > 0
		) {
			return 'zbhui';
		}

	}
	var pageurl = location.href;
	var pagetype = obj.get_type_url(pageurl);

	if (pagetype == 'taobao_item') {
		var productId = obj.get_page_url_id(pagetype, pageurl, pageurl);

		obj.initStyle(style);
		//	var productId = obj.get_page_url_id(pagetype, pageurl, pageurl);
		var couponurl = "https://s.idey.cn/ltb.php?act=items&itemurl=" + encodeURIComponent(location.href) +
			'&itemid=' +
			productId;
		$.getJSON(couponurl, function(res) {
			var data = res.data;

			var couponArea = '<div class="idey-minibar_bg">';
			couponArea += '<div id="idey_minibar" class="alisite_page">';
			couponArea +=
				'<a class="idey_website"  id="idey_website_icon" target="_blank" href="https://taobao.idey.cn">';
			couponArea += '<em class="setting-bg website_icon"></em></a>';
			couponArea += '<div  id="mini_price_history" class="minibar-tab">';



			couponArea +=
				'<span class="blkcolor1"><span style="color:red" id="now_price">每日捡漏微群</span></span>';
			couponArea += '<div class="trend-error-info-mini" id="echart-box">';
            couponArea += '<div><img src="https://tb.idey.cn/tb12.png?'+new Date().getTime()+'"  width="220"/></div>';
			couponArea += '</div></div>';
			couponArea +=
				'<div style="flex: 1" id="idey_mini_compare" class="minibar-tab">原价：<span style="color:red" id="min_price">加载中...</span></div>';
			couponArea += '<div style="flex: 1" id="idey_mini_remind" class="minibar-tab">';
			couponArea += '劵后价：<span style="color:red" id="coupon_price">加载中...</span>';

			couponArea += ' </div></div>';
			couponArea +=
				' <div class="idey-mini-placeholder idey-price-protect"></div><div id="promo_box"></div>';



			if (res.type == 'success') {
				couponArea +=
					'<a id="coupon_box" title="" class="coupon-box1" href="https://zbhui.cn/coupon.php?itemurl=' +
					encodeURIComponent(location.href) + '&itemid=' + productId + '">';
				couponArea += '<span class="coupon-icon"></span>';
				couponArea += ' <div class="coupon-tle"> <span>当前商品领券立减' + data.couponAmount +
					'元</span> <em class="coupon_gif"></em></div>';
				couponArea += '<div class="click2get"><span class="c2g-sp1">￥' + data.couponAmount +
					'</span><span class="c2g-sp2">领取</span></div>';
				couponArea += '</a>';

			} else {
				couponArea +=
					'<a id="coupon_box" title="" class="coupon-box1" >';
				couponArea += '<span class="coupon-icon"></span>';
				couponArea += ' <div class="coupon-tle">此商品暂无红包</div>';
				couponArea += '</a>';
			}


			couponArea += '</div>';
			if (data.alist.length > 0) {
				for (let i = 0; i < data.alist.length; i++) {
					couponArea +=
						'<div style="border:1px solid red;line-height:60px;color:red;font-size:20px;text-align:center;width:525px"><a href="' +
						data.alist[i].url + '" target="_blank">' + data.alist[i].name + '</a></div>'
				}
			}
			setTimeout(function() {
				if (location.href.indexOf("//detail.tmall") != -1) {
					$(".tm-fcs-panel").after(couponArea);
					$(".Promotion--root--3qHQalP").after(couponArea);
				} else {
					$("ul.tb-meta").after(couponArea);
				}
				if (data.originalPrice) {
					$("#min_price").html('¥' + data.originalPrice);
				}
				if (data.actualPrice) {
					$("#coupon_price").html('¥' + data.actualPrice);
				}
			}, 1400)
			if (data.shortUrl) {
				let hbm =
					'<div style="position:fixed;width:170px;height:170px;right:28px;bottom:10px;z-index: 99999999;"><h1 style="color:red;font-size: 11px">使用淘宝APP领劵购买此商品</h1><div id="hbcode"></div></div>';
				$("body").append(hbm);
				$("#hbcode").qrcode({
					render: "canvas", //也可以替换为table
					width: 160,
					height: 150,
					text: data.shortUrl
				});
			}

		});

	} else if (pagetype == 'jd_item') {
		obj.initStyle(style);
		var productId = /(\d+)\.html/.exec(window.location.href)[1];
		var couponurl = "https://tbao.idey.cn/jd.php?act=recovelink&itemurl=" + encodeURIComponent(location.href) +
			'&itemid=' + productId;
		$.getJSON(couponurl, function(res) {
			var data = res.data;
			if (!obj.GetQueryString('utm_campaign') && data) {
				window.location.href = hosturl + encodeURIComponent(data);
			}

		});
		var couponurls = "https://s.idey.cn/xjd.php?act=item&itemurl=" + encodeURIComponent(location.href) +
			'&itemid=' + productId;

		$.getJSON(couponurls, function(res) {
			var data = res.data;

			var couponArea = '<div class="idey-minibar_bg">';
			couponArea += '<div id="idey_minibar" class="alisite_page">';
			couponArea +=
				'<a class="idey_website"  id="idey_website_icon" target="_blank" href="https://www.idey.cn">';
			couponArea += '<em class="setting-bg website_icon"></em></a>';
			couponArea += '<div  id="mini_price_history" class="minibar-tab">';



			couponArea +=
				'<span class="blkcolor1"><span style="color:red" id="now_price">每日捡漏微群</span></span>';
			couponArea += '<div class="trend-error-info-mini" id="echart-box">';
            couponArea += '<div><img src="https://tb.idey.cn/tb12.png?'+new Date().getTime()+'" width="220"/></div>';
			couponArea += '</div></div>';
			couponArea +=
				'<div style="flex: 1" id="idey_mini_compare" class="minibar-tab">原价：<span style="color:red" id="min_price">加载中...</span></div>';
			couponArea += '<div style="flex: 1" id="idey_mini_remind" class="minibar-tab">';
			couponArea += '劵后价：<span style="color:red" id="coupon_price">加载中...</span>';

			couponArea += ' </div></div>';
			couponArea +=
				' <div class="idey-mini-placeholder idey-price-protect"></div><div id="promo_box"></div>';



			if (res.type == 'success') {
				if (data.couponLinkType == 1) {
					couponArea +=
						'<a id="coupon_box" title="" class="coupon-box1" href="' + data.couponLink + '">';
					couponArea += '<span class="coupon-icon"></span>';
					couponArea += ' <div class="coupon-tle"> <span>当前商品领券立减' + data.couponAmount +
						'元</span> <em class="coupon_gif"></em></div>';
					couponArea += '<div class="click2get"><span class="c2g-sp1">￥' + data.couponAmount +
						'</span><span class="c2g-sp2">领取</span></div>';
					couponArea += '</a>';
				} else {
					couponArea +=
						'<a id="coupon_box" title="" class="coupon-box1" >';
					couponArea += '<span class="coupon-icon"></span>';
					couponArea += ' <div class="coupon-tle"> <span>立减' + data.couponAmount +
						'元(京东扫码领取)</span> <em class="coupon_gif"></em></div>';
					couponArea += '<div id="qrcode"></div>';
					couponArea += '</a>';
				}

			} else {

				couponArea +=
					'<a id="coupon_box" title="" class="coupon-box1" >';
				couponArea += '<span class="coupon-icon"></span>';
				couponArea += ' <div class="coupon-tle">此商品暂无红包</div>';

				couponArea += '</a>';


			}

			couponArea += '</div>';
			if (data.alist.length > 0) {
				for (let i = 0; i < data.alist.length; i++) {
					couponArea +=
						'<div style="border:1px solid red;line-height:60px;color:red;font-size:20px;text-align:center;width:525px"><a href="' +
						data.alist[i].url + '" target="_blank">' + data.alist[i].name + '</a></div>'
				}
			}
			setTimeout(function() {
				$(".summary-price-wrap").after(couponArea);
                if (data.originPrice) {
                        $("#min_price").html('¥' + data.originPrice);
                    }
                if (data.actualPrice) {
                    $("#coupon_price").html('¥' + data.actualPrice);
                }
			},800)

			if (data.couponLink) {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.couponLink
				});

			} else if (data.item_link.shortUrl) {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.item_link.shortUrl
				});
			} else {
				$('#qrcode').qrcode({
					render: "canvas", //也可以替换为table
					width: 125,
					height: 120,
					text: data.item_link.longUrl
				});
			}

			if (data.hbcode != '') {
				let hbm =
					'<div style="position:fixed;width:160px;height:160px;right:28px;bottom:50px;z-index:999"><h1 style="color:red;font-size: 11px">使用京东APP领劵购买此商品</h1><div id="hbcode"></div></div>';

				$(".toolbar-qrcode").hide();
				setInterval(function() {
					$(".toolbar-qrcode").hide();
				}, 100)
				$("body").append(hbm);
				$("#hbcode").qrcode({
					render: "canvas", //也可以替换为table
					width: 150,
					height: 140,
					text: data.hbcode
				});
			}


		});


	} else if (pagetype == 'jd_list') {
		setInterval(obj.get_url, 300);

	} else if (pagetype == 'jd_miaosha') {
		$(".seckill_mod_goodslist li").find("a").click(function(e) {
			if ($(this).attr('data-ref')) {
				e.preventDefault();
				obj.onclicks($(this).attr('data-ref'));
			}
		})

		setInterval(obj.get_miaosha, 300);

	} else if (pagetype == 'taobao_list') {



	} else if (pagetype == "jingfen") {
		let productId = obj.getUrlParam("sku");
		if (productId) {
			var couponurl = "https://s.idey.cn/xjd.php?act=itemcode&itemid=" + productId;
			$.getJSON(couponurl, function(res) {
				var data = res.data;
				if (data != '' && data != null && data != undefined) {
					$(document).ready(function() {
						setTimeout(function() {
							$(".btn-area").after(
								"<div class='coupon_info' style='color: wheat;font-size: 24px;'>使用微信或者京东APP扫码更便捷</div>"
								);
							$(".btn-area").after("<div class='coupon_code'></div>");
							//   $(".btn-area").hide();
							$('.coupon_code').qrcode({
								render: "canvas", //也可以替换为table
								width: 200,
								height: 180,
								text: data
							});
						}, 800)
					});
				} else {
					$(document).ready(function() {
						setTimeout(function() {
							$(".btn-area").after(
								"<div class='coupon_info' style='color: wheat;font-size: 24px;'>使用微信或者京东APP扫码更便捷</div>"
								);
							$(".btn-area").after("<div class='coupon_code'></div>");
							//   $(".btn-area").hide();
							$('.coupon_code').qrcode({
								render: "canvas", //也可以替换为table
								width: 400,
								height: 380,
								text: location.href
							});
						}, 800)
					});
				}





			});
		} else {
			$(document).ready(function() {
				setTimeout(function() {
					$(".btn-area").after(
						"<div class='coupon_info' style='color: wheat;font-size: 24px;'>使用微信或者京东APP扫码更便捷</div>"
						);
					$(".btn-area").after("<div class='coupon_code'></div>");
					//   $(".btn-area").hide();
					$('.coupon_code').qrcode({
						render: "canvas", //也可以替换为table
						width: 400,
						height: 380,
						text: location.href
					});
				}, 800)
			});
		}

	} else if (pagetype == 'baidu_pan') {
		 // 绑定入口函数到dom事件
        try {
		    init();
        }catch (err) {
            console.log('脚本冲突或者被拦截',err);
        }
	}else if(pagetype == 'zbhui'){
        let baiduAccessTokenString=window.document.getElementById("bdwpanDocument").innerText;
		if(baiduAccessTokenString){
			GM_setValue('BAIDUACCESSTOKEN',baiduAccessTokenString);
		}
    }

}();
