// ==UserScript==
// @name         星耀云/飞猫云/kufile/rosefile/expfile/城通网盘破解优化
// @namespace    http://tampermonkey.net/
// @version      2.05
// @description  快速下载 精简页面
// @author       huajiqaq
// @match        *://*/*
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/501172/%E6%98%9F%E8%80%80%E4%BA%91%E9%A3%9E%E7%8C%AB%E4%BA%91kufilerosefileexpfile%E5%9F%8E%E9%80%9A%E7%BD%91%E7%9B%98%E7%A0%B4%E8%A7%A3%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/501172/%E6%98%9F%E8%80%80%E4%BA%91%E9%A3%9E%E7%8C%AB%E4%BA%91kufilerosefileexpfile%E5%9F%8E%E9%80%9A%E7%BD%91%E7%9B%98%E7%A0%B4%E8%A7%A3%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/* globals file_id */
/* globals userid */
/* globals file_chk */
(function() {
	"use strict";
	var getfid;
	var dlURL;
	var fid;
	var downurl;
	var getdown;
	var getxtxt;
	var getxtlink;
	var getxt;
	var getlink;
	var getpass;
    var mobilemode

	//下载函数
	function Download(content) {
		var eleLink = document.createElement("a");
		eleLink.style.display = "none";
		eleLink.href = content;
		document.body.appendChild(eleLink);
		eleLink.click();
		document.body.removeChild(eleLink);
	}

	//等待元素加载完毕
	function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
		if (typeof waitOnce === "undefined") {
			waitOnce = true;
		}
		if (typeof interval === "undefined") {
			interval = 300;
		}
		if (typeof maxIntervals === "undefined") {
			maxIntervals = -1;
		}
		var targetNodes =
			typeof selectorOrFunction === "function" ? selectorOrFunction() : document.querySelectorAll(selectorOrFunction);

		var targetsFound = targetNodes && targetNodes.length > 0;
		if (targetsFound) {
			targetNodes.forEach(function(targetNode) {
				var attrAlreadyFound = "data-userscript-alreadyFound";
				var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
				if (!alreadyFound) {
					var cancelFound = callback(targetNode);
					if (cancelFound) {
						targetsFound = false;
					} else {
						targetNode.setAttribute(attrAlreadyFound, true);
					}
				}
			});
		}

		if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
			maxIntervals -= 1;
			setTimeout(function() {
				waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
			}, interval);
		}
	}
	//判断网盘 并执行相应事件
	if (window.location.host == "www.kufile.net") {
	    if (window.location.pathname.split("/")[1].indexOf("vip.php") == 0) {
	    	document.querySelector("html").innerHTML = "<head></head><body><p><font size=\"24\"><font color=\"#FF0000\">本人技术有限 无法屏蔽弹出页面 弹出本页面属于正常现象 请手动关闭</font> </font></p><br><br><p></p></body>";
	    }
	    else {
		document.getElementsByClassName("adc_bottom")[0].style.display = "none";
		document.getElementsByClassName("cright")[0].style.display = "none";
		document.getElementsByClassName("downs")[0].style.display = "none";
		document.getElementsByClassName("u3")[0].innerHTML = "";
		getfid = new XMLHttpRequest();
		getfid.onreadystatechange = function() {
			if (getfid.readyState == 4) {
				if (getfid.status == 200) {
					fid = getfid.responseText.match(/down_process\('(\S*)'\)/)[1];
					getdown = new XMLHttpRequest();
					getdown.onreadystatechange = function() {
						if (getdown.readyState == 4) {
							if (getdown.status == 200) {
								dlURL = getdown.responseText
								document.getElementsByClassName("u3")[0].innerHTML = dlURL;
							} else {
								alert("请求失败 可能当前脚本不是最新版本或接口在维护");
							}
						}
					};
					downurl = "https://pandown.vercel.app/api/kufile?file=" + fid
					getdown.open("get", downurl);
					getdown.send(null);
				} else {
					alert("请求失败 可能当前脚本不是最新版本或接口在维护");
				}
			}
		};
		getfid.open("get", window.location.href);
		getfid.send(null);
	}
	}
	//判断网盘 并执行相应事件
	if (window.location.host == "www.feimaoyun.com") {
		//判断为电脑端执行的事件
		if (window.location.pathname.split("/")[1].indexOf("s") == 0) {
			getpass = new XMLHttpRequest();
			getpass.onreadystatechange = function() {
				if (getpass.readyState == 4) {
					if (getpass.status == 200) {
						if (getpass.responseText.match(/if_check_pucode":"(\S*)","auth_name/)[1] == "1") {
							function pass() {
								document.getElementsByClassName("banner")[0].style.display = "none";
							}
							waitForKeyElements(' [class="banner"]', pass);

							function btn() {
								document.getElementsByClassName("btn")[3].outerHTML = `<span class=\"el-input__suffix-inner\"><span class=\"btn\">立即下载</span><!----><!----><!----></span>`
							}
							waitForKeyElements(' [class="btn"]', btn);

							function desc() {
								document.getElementsByClassName("desc")[3].innerText = "请正确输入密码后点击下载 点击下载需要等待几秒 请耐心等待"
							}
							waitForKeyElements(' [class="desc"]', desc);
							document.getElementsByClassName("btn")[3].onclick = function() {
								getfid = new XMLHttpRequest();
								getfid.onreadystatechange = function() {
									if (getfid.readyState == 4) {
										if (getfid.status == 200) {
											if (getfid.responseText.match(/file_id":"(\S*)","file_name/)) {
												getdown = new XMLHttpRequest();
												getdown.onreadystatechange = function() {
													if (getdown.readyState == 4) {
														if (getdown.status == 200) {
															dlURL = getdown.responseText;
															Download(dlURL)
														} else {
															document.getElementsByClassName("desc")[3].innerText = "下载链接加载失败 请刷新网页重试"
														}
													}
												};
												downurl = "https://pandown.vercel.app/api/feimao?file=" + getfid.responseText.match(/"file_id":"(\S*)","file_name/)[1]
												getdown.open("get", downurl);
												getdown.send(null);
											} else {
												alert("输入密码错误 请检查后再次输入")
											}
										} else {
											alert("请求失败 可能当前脚本不是最新版本或接口在维护");
										}
									}
								};
								getfid.open("POST", "https://www.feimaoyun.com/index.php/wap/file");
								getfid.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
								getfid.send("id=" + window.location.pathname.slice(3) + "&pucode=" + document.getElementsByClassName("el-input__inner")[1].value)
							}
						} else if (getpass.responseText.match(/if_check_pucode":"(\S*)","auth_name/)[1] == "0") {
							function downjz() {
								document.getElementsByClassName("link")[0].innerText = "下载链接未加载完毕 无法下载 加载完毕本按钮文本会更新 请耐心等待"
							}
							waitForKeyElements(' [class="act act1"]', downjz);

							function webad() {
								document.getElementsByClassName("openProCom jmloading")[0].style.display = "none";
							}
							waitForKeyElements(' [class="openProCom jmloading"]', webad);

							function webade() {
								document.getElementsByClassName("openVipCom youthVipCom")[0].style.display = "none";
							}
							waitForKeyElements(' [class="openVipCom youthVipCom"]', webade);

							function webadq() {
								document.getElementsByClassName("noVipDownBox")[0].style.display = "none";
							}
							waitForKeyElements(' [class="noVipDownBox"]', webadq);

							getfid = new XMLHttpRequest();
							getfid.onreadystatechange = function() {
								if (getfid.readyState == 4) {
									if (getfid.status == 200) {
										fid = getfid.responseText.match(/file_id":"(\S*)","file_name/)[1];
										getdown = new XMLHttpRequest();
										getdown.onreadystatechange = function() {
											if (getdown.readyState == 4) {
												if (getdown.status == 200) {
													dlURL = getdown.responseText;
													document.getElementsByClassName("act act1")[0].outerHTML = `<a class=\"act act1\"><img src=\"https://webimg.fmapp.com/Public/web/img/webapp/fm2022/downa_icon_2.png\" class=\"img\"> <span>\n            VIP/Pro会员下载\n            <!----></span></a>`
													document.getElementsByClassName("act act1")[0].onclick = function() {
														Download(dlURL)
													}
												} else {
													document.getElementsByClassName("act act1")[0].innerText = "下载链接加载失败 请刷新网页重试"
												}
											}
										};
										downurl = "https://pandown.vercel.app/api/feimao?file=" + fid
										getdown.open("get", downurl);
										getdown.send(null);
									} else {
										alert("请求失败 可能当前脚本不是最新版本或接口在维护");
									}
								}
							};
							getfid.open("POST", "https://www.feimaoyun.com/index.php/wap/file");
							getfid.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
							getfid.send("id=" + window.location.pathname.slice(3));
						}
					} else {
						alert("请求失败 可能当前脚本不是最新版本或接口在维护");
					}
				}
			};
			getpass.open("POST", "https://www.feimaoyun.com/index.php/down/checkFilePucode");
			getpass.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			getpass.send("code=" + window.location.pathname.slice(3));
		}
		//判断为手机端执行的事件
		if (window.location.pathname.split("/")[1].indexOf("index.php") == 0) {
			getpass = new XMLHttpRequest();
			getpass.onreadystatechange = function() {
				if (getpass.readyState == 4) {
					if (getpass.status == 200) {
						if (getpass.responseText.match(/if_check_pucode":"(\S*)","auth_name/)[1] == "1") {
							document.getElementsByClassName("pucodebtn")[0].outerHTML = `<span class=\"pucodebtn\">立即下载</span>`
							document.getElementsByClassName("username")[0].innerHTML = "请正确输入密码后点击下载 点击下载需要等待几秒 请耐心等待";
							document.getElementsByClassName("pucodeBanner")[0].style.display = "none";
							document.getElementsByClassName("pucodebtn")[0].onclick = function() {
								getfid = new XMLHttpRequest();
								getfid.onreadystatechange = function() {
									if (getfid.readyState == 4) {
										if (getfid.status == 200) {
											if (getfid.responseText.match(/file_id":"(\S*)","file_name/)) {
												getdown = new XMLHttpRequest();
												getdown.onreadystatechange = function() {
													if (getdown.readyState == 4) {
														if (getdown.status == 200) {
															dlURL = getdown.responseText;
															Download(dlURL)
														} else {
															document.getElementsByClassName("username")[0].innerText = "下载链接加载失败 请刷新网页重试"
														}
													}
												};
												downurl = "https://pandown.vercel.app/api/feimao?file=" + getfid.responseText.match(/"file_id":"(\S*)","file_name/)[1]
												getdown.open("get", downurl);
												getdown.send(null);
											} else {
												alert("输入密码错误 请检查后再次输入")
											}
										} else {
											alert("请求失败 可能当前脚本不是最新版本或接口在维护");
										}
									}
								};
								getfid.open("POST", "https://www.feimaoyun.com/index.php/wap/file");
								getfid.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
								getfid.send("id=" + window.location.pathname.slice(23) + "&pucode=" + document.getElementsByClassName("el-input__inner")[0].value)
							}
						} else if (getpass.responseText.match(/if_check_pucode":"(\S*)","auth_name/)[1] == "0") {
							document.getElementsByClassName("svipBanner")[0].style.display = "none";
							document.getElementsByClassName("svipUserBox fileBox column")[1].style.display = "none";
							document.getElementsByClassName("val")[0].style.display = "none";
							document.getElementsByClassName("key")[0].innerText = "当前状态:下载链接未加载完毕 无法下载 加载完毕会显示下载按钮 请耐心等待"
							document.getElementsByClassName("svipActBtns centerbetween")[0].style.display = "none";
							document.getElementsByClassName("downBtnBox")[0].style.display = "none";
							getfid = new XMLHttpRequest();
							getfid.onreadystatechange = function() {
								if (getfid.readyState == 4) {
									if (getfid.status == 200) {
										fid = getfid.responseText.match(/file_id":"(\S*)","file_name/)[1];
										getdown = new XMLHttpRequest();
										getdown.onreadystatechange = function() {
											if (getdown.readyState == 4) {
												if (getdown.status == 200) {
													dlURL = getdown.responseText;
													document.getElementsByClassName("key")[0].innerText = "链接加载完成 请点击按钮下载 "
													document.getElementsByClassName("downBtnBox")[0].style.display = "";
													document.getElementsByClassName("downBtnBox")[0].outerHTML = `<a onmouseover="this.style.color='#fff';" onmouseout="this.style.color='#fff';" onclick="this.style.color= '#fff';" class="downBtnBox" style=""><img src="https://webimg.fmapp.com/Public/web/img/webapp/fm2021/down_h5_svipredbg.png" class="downBtnBg"> <div class="downCon rowcenter"><img src="https://webimg.fmapp.com/Public/web/img/webapp/fm2021/down_h5_downIcon.png" class="downIcon"><span class="downtxt">VIP下载</span></div></a>`
													document.getElementsByClassName("downBtnBox")[0].onclick = function() {
														Download(dlURL)
													}
												} else {
													document.getElementsByClassName("username")[0].innerText = "下载链接加载失败 请刷新网页重试"
												}
											}
										};
										downurl = "https://pandown.vercel.app/api/feimao?file=" + fid
										getdown.open("get", downurl);
										getdown.send(null);
									} else {
										alert("请求失败 可能当前脚本不是最新版本或接口在维护");
									}
								}
							};
							getfid.open("POST", "https://www.feimaoyun.com/index.php/wap/file");
							getfid.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
							getfid.send("id=" + window.location.pathname.slice(23));
						}
					} else {
						alert("请求失败 可能当前脚本不是最新版本或接口在维护");
					}
				}
			};
			getpass.open("POST", "https://www.feimaoyun.com/index.php/down/checkFilePucode");
			getpass.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			getpass.send("code=" + window.location.pathname.slice(23));
		}
	}
	//判断网盘 并执行相应事件
	if (window.location.host == "www.xingyaopan.com") {
	    if (window.location.pathname.split("/")[1].indexOf("vip.php") == 0) {
			document.querySelector("html").innerHTML = "<head></head><body><p><font size=\"24\"><font color=\"#FF0000\">本人技术有限 无法屏蔽弹出页面 弹出本页面属于正常现象 请手动关闭</font> </font></p><br><br><p></p></body>";
		} else {
			document.getElementsByClassName("package-contrast-wap visible-xs")[0].style.display = "none";
			document.getElementsByClassName("col-lg-4 col-md-4 col-sm-6 col-xs-6")[0].style.display = "none";
			document.getElementsByClassName("col-lg-4 col-md-4 col-sm-6 col-xs-6")[1].style.display = "none";
			document.getElementsByClassName("package-contrast-wap visible-xs")[0].innerHTML = "";
			document.getElementsByClassName("package-intr-title")[0].innerText = "请等待片刻 当前下载链接加载中 加载完成会显示下载按钮";
			document.getElementsByClassName("package-pays")[0].innerHTML = "";
			document.getElementsByClassName("package-contrast")[0].innerHTML = "";
			getfid = new XMLHttpRequest();
			getfid.onreadystatechange = function() {
				if (getfid.readyState == 4) {
					if (getfid.status == 200) {
						fid = getfid.responseText.match(/add_ref\((\S*)\);/)[1];
						getdown = new XMLHttpRequest();
						getdown.onreadystatechange = function() {
							if (getdown.readyState == 4) {
								if (getdown.status == 200) {
									dlURL = getdown.responseText
									document.getElementsByClassName("package-intr-title")[0].innerText = "加载完成 请点击右侧黄色按钮下载";
									document.getElementsByClassName("package-pays")[0].innerHTML = dlURL;
								} else {
									document.getElementsByClassName("package-intr-title")[0].innerText = "下载链接加载失败 请刷新网页重试";
								}
							}
						};
						downurl ="https://pandown.vercel.app/api/starpan?file=" + fid
						getdown.open("get", downurl);
						getdown.send(null);
					} else {
						alert("请求失败 可能当前脚本不是最新版本或接口在维护");
					}
				}
			};
			getfid.open("get", window.location.href);
			getfid.send(null);
		}
	}
	//判断网盘 并执行相应事件
	if (window.location.host == "rosefile.net") {
		if (document.getElementsByClassName("row")[0]) {
			document.getElementsByClassName("row")[0].innerHTML = ""
		}
		if (document.getElementsByClassName("adsbygoogle")[0]) {
			document.getElementsByClassName("adsbygoogle")[0].innerHTML = ""
		}
		if (document.getElementsByClassName("adsbygoogle adsbygoogle-noablate")[0]) {
			document.getElementsByClassName("adsbygoogle adsbygoogle-noablate")[0].innerHTML = ""
		}
        document.getElementsByClassName("text-center table-success")[0].innerText = "请等待片刻 当前下载链接加载中 加载完成会显示下载按钮 加载较慢 请稍等";
		document.getElementsByClassName("btn btn-primary")[0].style.display = "none";
		getfid = new XMLHttpRequest();
		getfid.onreadystatechange = function() {
			if (getfid.readyState == 4) {
				if (getfid.status == 200) {
					fid = getfid.responseText.match(/add_ref\((\S*)\);/)[1];
					getdown = new XMLHttpRequest();
					getdown.onreadystatechange = function() {
						if (getdown.readyState == 4) {
							if (getdown.status == 200) {
								dlURL = getdown.responseText
		                        document.getElementsByClassName("row")[3].innerHTML = '<a target="_blank" class="btn btn-primary btn-block"><span>高速下载</span></a>'
                                document.getElementsByClassName("btn btn-primary btn-block")[0].href =dlURL
							} else {
								document.getElementsByClassName("text-center table-success")[0].innerText = "下载链接加载失败 请刷新网页重试";
							}
						}
					};
					downurl ="https://pandown.vercel.app/api/rosefile?file=" + fid
					getdown.open("get", downurl);
					getdown.send(null);
				} else {
					alert("请求失败 可能当前脚本不是最新版本或接口在维护");
				}
			}
		};
		getfid.open("get", window.location.href);
		getfid.send(null);
	}
	//判断网盘 并执行相应事件
	if (window.location.host == "www.expfile.com") {
		document.getElementsByClassName("module-line")[0].innerText = "请等待片刻 当前下载链接加载中 加载完成会显示下载按钮"
		document.getElementsByClassName("module-privilege")[0].innerHTML = ""
		getfid = new XMLHttpRequest();
		getfid.onreadystatechange = function() {
			if (getfid.readyState == 4) {
				if (getfid.status == 200) {
					fid = getfid.responseText.match(/load_down_addr1\('(\S*)'\)/)[1];
					getdown = new XMLHttpRequest();
					getdown.onreadystatechange = function() {
						if (getdown.readyState == 4) {
							if (getdown.status == 200) {
								dlURL = getdown.responseText
                                if (typeof document.getElementsByClassName("down_btn btn btn-success")[1] === "undefined") {
								document.getElementsByClassName("module-line")[0].innerText = "加载完成 请点击按钮下载";
								let expdownload = document.createElement("a");
								expdownload.innerText = "点击下载 每个按钮下载链接都一样 这样只是提醒你下载点这里";
								expdownload.className = "down_btn btn btn-success";
								expdownload.onclick = function() { Download(dlURL) };
								document.getElementsByClassName("module-privilege")[0].append(expdownload);
								document.getElementsByClassName("module-privilege")[0].append(expdownload);
                                }
							} else {
								document.getElementsByClassName("module-line")[0].innerText = "下载链接加载失败 请刷新网页重试";
							}
						}
					};
					downurl ="https://pandown.vercel.app/api/expfile?file=" + fid
					getdown.open("get", downurl);
					getdown.send(null);
				} else {
					alert("请求失败 可能当前脚本不是最新版本或接口在维护");
				}
			}
		};
		getfid.open("get", window.location.href);
		getfid.send(null);
	}
	//判断网盘 并执行相应事件
	if (document.querySelector("head > link:nth-child(9)")) {
		if (document.querySelector("head > link:nth-child(9)").href == 'https://webapi.ctfile.com/assets/img/favicons/apple-touch-icon.png') {
			//判断是否为手机页面
			function mobile() {
				//判断数值是否存在
				if (localStorage.getItem(mobilemode) === null) {
					localStorage.setItem(mobilemode,1);
					location.reload();
				}
				//一般用不到 防止用户切换界面
				if (localStorage.getItem(mobilemode) === "0") {
					var error;
					var r = confirm("使用的是手机版网页吗？ 如果是请点击确定 手机版如果不能使用请及时更新脚本 确认后大约需要加载2秒 请耐心等待");
					if (r == true) {
						localStorage.setItem(mobilemode,"1");
						location.reload();
					} else {
						error = "很抱歉 不开启会影响脚本使用 如果判断错误请联系作者恢复 如果是直接进入此网页 请尝试刷新网页";
						document.write(error);
					}
				}
			}
			waitForKeyElements(' [class="alert alert-light mb-0"]', mobile);
			//判断是否为电脑界面
			function pc() {
				//判断数值是否存在
                if (localStorage.getItem(mobilemode) === null) {
					localStorage.setItem(mobilemode,"0");
					location.reload();
				}
				//一般用不到 防止用户切换界面
				if (localStorage.getItem(mobilemode) === "1") {
					var error;
					var r = confirm("使用的是电脑网页吗？如果是请点击确定 确认后大约需要加载2秒 请耐心等待");
					if (r == true) {
						localStorage.setItem(mobilemode,0);
						location.reload();
					} else {
						error = "很抱歉 不开启会影响脚本使用 如果判断错误请联系作者恢复 如果直接进入此网页 请尝试刷新网页";
						document.write(error);
					}
				}
			}
			waitForKeyElements(' [class="btn btn-warning ml-3"]', pc);
			//当检测为下载界面时执行的代码
			if (window.location.pathname.split("/")[1].indexOf("f") == 0) {
				//判断是否为电脑界面
				if (localStorage.getItem(mobilemode) === "0") {
					//增加提示文字
					function loadingtext() {
						if (typeof document.getElementsByClassName("text-white mb-2")[1] === "undefined") {
							let cstext = document.createElement("h4");
							cstext.innerText = "小提示：点击后需要等待几秒后才能下载 请耐心等待 谢谢配合";
							cstext.className = "text-white mb-2";
							document.getElementsByClassName("col")[0].insertBefore(cstext, document.getElementsByClassName("text-white mb-2")[0].nextSibling);
						}
					}
					waitForKeyElements(' [class="row text-white align-items-center no-gutters"]', loadingtext);
					//显示VIP下载 隐藏购买VIP页面
					function vipdown() {
						document.getElementsByClassName("card-deck")[0].style.display = "block";
						document.getElementsByClassName("card-deck")[1].style.display = "none";
					}
					waitForKeyElements(' [class="card-deck"]', vipdown);

					function buyvip() {
						document.getElementsByClassName("row no-gutters")[1].style.display = "none";
					}
					waitForKeyElements(' [class="row no-gutters"]', buyvip);
					//隐藏广告
					function webad() {
						document.getElementsByClassName("card bg-light mb-3")[2].style.display = "none";
					}
					waitForKeyElements(' [class="card bg-light mb-3"]', webad);
					//对于一些不支持的功能进行隐藏
					function notsupport() {
						document.getElementsByClassName("mb-3")[1].style.display = "none";
					}
					waitForKeyElements(' [class="mb-3"]', notsupport);
					//重写下载按钮
					function dxdown() {
						getxt = new XMLHttpRequest();
						getxt.onreadystatechange = function() {
							if (getxt.readyState == 4) {
								if (getxt.status == 200) {
									getxtlink = getxt.responseText.match(/xt_link":"(\S*)","file_name/)[1]
								} else {
									alert("请求失败 可能当前脚本不是最新版本或接口在维护");
								}
							}
						};
						getxtxt = "https://webapi.ctfile.com/get_file_url.php?uid=" + userid + "&fid=" + file_id + "&file_chk=" + file_chk + "&app=1&acheck=2&rd=" + Math.random()
						getxt.open("get", getxtxt);
						getxt.send(null);
						document.getElementsByClassName("btn btn-outline-secondary fs-1 mt-3")[0].onclick = function() {
							getlink = new XMLHttpRequest();
							getlink.onreadystatechange = function() {
								if (getlink.readyState == 4) {
									if (getlink.status == 200) {
										dlURL = getlink.responseText;
										Download(dlURL);
									} else {
										alert("请求失败 可能当前脚本不是最新版本或接口在维护");
									}
								}
							};
							downurl = "https://773mfa0k57347.cfc-execute.bj.baidubce.com/ctdown/电信/?file=" + file_id + "&xtlink=ctfile://xturl" + getxtlink
							getlink.open("get", downurl);
							getlink.send(null);
						};
					}
					waitForKeyElements(' [class="btn btn-outline-secondary fs-1 mt-3"]', dxdown);

					function ltdown() {
						getxt = new XMLHttpRequest();
						getxt.onreadystatechange = function() {
							if (getxt.readyState == 4) {
								if (getxt.status == 200) {
									getxtlink = getxt.responseText.match(/xt_link":"(\S*)","file_name/)[1]
								} else {
									alert("请求失败 可能当前脚本不是最新版本或接口在维护");
								}
							}
						};
						getxtxt ="https://webapi.ctfile.com/get_file_url.php?uid=" + userid + "&fid=" + file_id + "&file_chk=" + file_chk + "&app=1&acheck=2&rd=" + Math.random()
						getxt.open("get", getxtxt);
						getxt.send(null);
						document.getElementsByClassName("btn btn-outline-info fs-1 mt-3")[0].onclick = function() {
							getlink = new XMLHttpRequest();
							getlink.onreadystatechange = function() {
								if (getlink.readyState == 4) {
									if (getlink.status == 200) {
										dlURL = getlink.responseText;
										Download(dlURL);
									} else {
										alert("请求失败 可能当前脚本不是最新版本或接口在维护");
									}
								}
							};
							downurl = "https://773mfa0k57347.cfc-execute.bj.baidubce.com/ctdown/联通/?file=" + file_id + "&xtlink=ctfile://xturl" + getxtlink
							getlink.open("get", downurl);
							getlink.send(null);
						};
					}
					waitForKeyElements(' [class="btn btn-outline-info fs-1 mt-3"]', ltdown);

					function yddown() {
						getxt = new XMLHttpRequest();
						getxt.onreadystatechange = function() {
							if (getxt.readyState == 4) {
								if (getxt.status == 200) {
									getxtlink = getxt.responseText.match(/xt_link":"(\S*)","file_name/)[1]
								} else {
									alert("请求失败 可能当前脚本不是最新版本或接口在维护");
								}
							}
						};
						getxtxt = "https://webapi.ctfile.com/get_file_url.php?uid=" + userid + "&fid=" + file_id + "&file_chk=" + file_chk + "&app=1&acheck=2&rd=" + Math.random()
						getxt.open("get", getxtxt);
						getxt.send(null);
						document.getElementsByClassName("btn btn-outline-dark fs-1 mt-3")[0].onclick = function() {
							getlink = new XMLHttpRequest();
							getlink.onreadystatechange = function() {
								if (getlink.readyState == 4) {
									if (getlink.status == 200) {
										dlURL = getlink.responseText;
										Download(dlURL);
									} else {
										alert("请求失败 可能当前脚本不是最新版本或接口在维护");
									}
								}
							};
							downurl = "https://773mfa0k57347.cfc-execute.bj.baidubce.com/ctdown/移动/?file=" + file_id + "&xtlink=ctfile://xturl" + getxtlink
							getlink.open("get", downurl);
							getlink.send(null);
						};
					}
					waitForKeyElements(' [class="btn btn-outline-dark fs-1 mt-3"]', yddown);
					//隐藏推广搜索按钮
					function searchad() {
						document.getElementsByClassName("nav-item")[0].style.display = "none";
					}
					waitForKeyElements(' [class="nav-item"]', searchad);

				}
				//判断是否为手机界面
				if (localStorage.getItem(mobilemode) === "1") {
					//增加提示文字
					function loadingtext() {
						if (typeof document.getElementsByClassName("text-white mb-3")[1] === "undefined") {
							let cstext = document.createElement("h5");
							cstext.innerText = "小提示：点击后需要等待几秒后才能下载 请耐心等待 谢谢配合";
							cstext.className = "text-white mb-3";
							document.getElementsByClassName("col")[0].insertBefore(cstext, document.getElementsByClassName("text-white mb-3")[0].nextSibling);
						}
					}
					waitForKeyElements(' [class="row text-white align-items-center no-gutters"]', loadingtext);
					//显示VIP下载
					function vipdown() {
						document.getElementsByClassName("card-deck")[0].style.display = "block";
						document.getElementsByClassName("card-deck")[1].style.display = "none";
					}
					waitForKeyElements(' [class="card-deck"]', vipdown);
					//隐藏广告
					function webad() {
						document.getElementById("mobile-500x200")
							.style.display = "none";
					}
					waitForKeyElements(' [id="mobile-500x200"]', webad);
					//重写下载按钮
					function down() {
						getxt = new XMLHttpRequest();
						getxt.onreadystatechange = function() {
							if (getxt.readyState == 4) {
								if (getxt.status == 200) {
									getxtlink = getxt.responseText.match(/xt_link":"(\S*)","file_name/)[1]
								} else {
									alert("请求失败 可能当前脚本不是最新版本或接口在维护");
								}
							}
						};
						getxtxt = "https://webapi.ctfile.com/get_file_url.php?uid=" + userid + "&fid=" + file_id + "&file_chk=" + file_chk + "&app=1&acheck=2&rd=" + Math.random()
						getxt.open("get", getxtxt);
						getxt.send(null);
						if (typeof document.getElementsByClassName("btn btn-outline-secondary fs-1 mt-3")[2] === "undefined") {
							document.getElementsByClassName("btn btn-outline-secondary fs-1 mt-3")[0].innerText = "电信下载";
							document.getElementsByClassName("btn btn-outline-secondary fs-1 mt-3")[0].onclick = function() {
								getlink = new XMLHttpRequest();
								getlink.onreadystatechange = function() {
									if (getlink.readyState == 4) {
										if (getlink.status == 200) {
											dlURL = getlink.responseText;
											Download(dlURL);
										} else {
											alert("请求失败 可能当前脚本不是最新版本或接口在维护");
										}
									}
								};
								downurl = "https://773mfa0k57347.cfc-execute.bj.baidubce.com/ctdown/电信/?file=" + file_id + "&xtlink=ctfile://xturl" + getxtlink
								getlink.open("get", downurl);
								getlink.send(null);
							};
							let lt = document.createElement("a");
							lt.innerText = "联通下载";
							lt.className = "btn btn-outline-secondary fs-1 mt-3";
							lt.onclick = function() {
								getlink = new XMLHttpRequest();
								getlink.onreadystatechange = function() {
									if (getlink.readyState == 4) {
										if (getlink.status == 200) {
											dlURL = getlink.responseText;
											Download(dlURL);
										} else {
											alert("请求失败 可能当前脚本不是最新版本或接口在维护");
										}
									}
								};
								downurl = "https://773mfa0k57347.cfc-execute.bj.baidubce.com/ctdown/联通/?file=" + file_id + "&xtlink=ctfile://xturl" + getxtlink
								getlink.open("get", downurl);
								getlink.send(null);
							};
							document.getElementsByClassName("card-body position-relative")[0].append(lt);
							let yd = document.createElement("a");
							yd.innerText = "移动下载";
							yd.className = "btn btn-outline-secondary fs-1 mt-3";
							yd.onclick = function() {
								getlink = new XMLHttpRequest();
								getlink.onreadystatechange = function() {
									if (getlink.readyState == 4) {
										if (getlink.status == 200) {
											dlURL = getlink.responseText;
											Download(dlURL);
										} else {
											alert("请求失败 可能当前脚本不是最新版本或接口在维护");
										}
									}
								};
								downurl = "https://773mfa0k57347.cfc-execute.bj.baidubce.com/ctdown/移动/?file=" + file_id + "&xtlink=ctfile://xturl" + getxtlink
								getlink.open("get", downurl);
								getlink.send(null);
							};
							document.getElementsByClassName("card-body position-relative")[0].append(yd);
						}
					}
					waitForKeyElements(' [class="btn btn-outline-secondary fs-1 mt-3"]', down);
				}
			}
			//当检测为目录界面时执行的代码
			if (window.location.pathname.split("/")[1].indexOf("d") == 0) {
				//判断是否为电脑节目
				if (localStorage.getItem(mobilemode) === "0") {
					//隐藏网站广告
					function webad() {
						document.getElementsByClassName("card bg-light mb-3")[1].style.display = "none";
					}
					waitForKeyElements(' [class="card bg-light mb-3"]', webad);
					//对于一些不支持的功能进行隐藏或提示
					function notsupport() {
						document.getElementsByClassName("btn btn-falcon-default mr-2")[2].style.display = "none";
						document.getElementsByClassName("btn btn-falcon-default mr-2")[3].style.display = "none";
						document.getElementsByClassName("btn btn-falcon-default mr-2")[5].style.display = "none";
						document.getElementsByClassName("btn btn-falcon-default mr-2")[4].onclick = function() {
							alert("很抱歉 此功能无法实现 本人技术有限");
						};
					}
					waitForKeyElements(' [id="dashboard-actions"]', notsupport);
					//隐藏推广搜索按钮
					function searchad() {
						document.getElementsByClassName("nav-item")[0].style.display = "none";
					}
					waitForKeyElements(' [class="nav-item"]', searchad);
				}
				//判断是否为手机界面
				if (localStorage.getItem(mobilemode) === "1") {
					//去除搜索广告
					function searchad() {
						document.getElementsByClassName("btn btn-warning btn-sm")[0].style.display = "none";
					}
					waitForKeyElements(' [class="btn btn-warning btn-sm ml-2"]', searchad);
				}
			}
		}
	}
	//某些特殊情况的判断
	//判断城通网盘异常跳转
	if (window.location.host == "down.tv002.com" && window.location.pathname.split("/")[1].indexOf("premium") == 0) {
		alert("如果是由于点击下载按钮时跳转本页面 请手动返回 并手动尝试每个线路可用性 如果文件大于2GB可委托代下 代下请把链接发送到14229840@qq.com 仅支持2GB以上链接代下")
	}
	//判断星耀网盘异常跳转
	if (document.querySelector("body > p:nth-child(2) > font > a")) {
		if (document.querySelector("body > p:nth-child(2) > font > a").innerText=="点击购买") {
			document.querySelector("html").innerHTML = "<head></head><body class=\" pace-done\"><p><font size=\"24\"><font color=\"#FF0000\">文件可能还没同步到当前服务器，请等待几分钟后再下载</font> </font></p><br><br><p></p></body>"
		}
	}
})();