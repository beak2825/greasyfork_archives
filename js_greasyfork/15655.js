// ==UserScript==
// @id             baidupan@ywzhaiqi@gmail.com
// @name           BaiduPanDownloadHelper modify by ted423 by vvcit
// @version        2016.06.01.0
// @namespace      https://github.com/ywzhaiqi
// @author         ywzhaiqi
// @description    批量导出百度盘的下载链接
// @grant          GM_addStyle
// @grant          GM_setClipboard
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @homepageURL    https://greasyfork.org/scripts/294/
// @require        http://code.jquery.com/jquery-2.1.4.min.js
// 兼容 GM 1.x, 2.x
// @require        https://greasyfork.org/scripts/2599/code/gm2_port_v102.js


// @license        GPL version 3
// @include        http*://yun.baidu.com/share/*
// @include        http*://pan.baidu.com/share/*
// @include        http*://yun.baidu.com/s/*
// @include        http*://pan.baidu.com/s/*
// @include        http*://pan.baidu.com/wap/*
// @include        http*://yun.baidu.com/wap/*
// @include        http*://yun.baidu.com/pcloud/album/*
// @include        http*://pan.baidu.com/pcloud/album/*
// @include        http*://pan.baidu.com/disk/home*
// @include        http*://yun.baidu.com/disk/home*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/15655/BaiduPanDownloadHelper%20modify%20by%20ted423%20by%20vvcit.user.js
// @updateURL https://update.greasyfork.org/scripts/15655/BaiduPanDownloadHelper%20modify%20by%20ted423%20by%20vvcit.meta.js
// ==/UserScript==
(function() {
	// 下面的去除云管家，会对上传插件无法显示上传文件夹   

	var tmpScript = document.createElement('script');
	tmpScript.textContent = "navigator.__defineGetter__('platform', function() {return 'Linux x86';});";
	document.head.appendChild(tmpScript);
	document.head.removeChild(tmpScript);
	//阻止百度网盘wap版自动跳转,来自https://greasyfork.org/zh-CN/scripts/13434
	document.addEventListener('beforescriptexecute', function(e) {
		if (e.target.id == 'platform') {
			e.preventDefault();
		}
	});
})();
document.onreadystatechange = function() {
	//alert(document.readyState);
	if (document.readyState == "interactive") {
		var isChrome = !!this.chrome;

		function HttpSendRead(info) {
			if (info.contentType != null) info.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
			GM_xmlhttpRequest({
				method: info.type,
				url: info.url,
				dataType: info.dataType,
				onreadystatechange: function(response) {
					if (response.readyState == 4) {
						if ((response.status == 200 && response.status < 300) || response.status == 304) {
							clearTimeout(timeId);
							if (info.dataType == "json") {
								deferred.resolve(JSON.parse(response.responseText), response.status, response);
							} else if (info.dataType == "SCRIPT") {
								// eval(response.responseText);
								deferred.resolve(response.responseText, response.status, response);
							}
						} else {
							clearTimeout(timeId);
							deferred.reject(response, response.statusText, response.status);
						}
					}
				}
			});
		};
	    var SetMessage = function(msg, type) {   
	            var Toast = require("common:widget/toast/toast.js");
	            Toast.obtain.useToast(cloneInto({
	                toastMode: Toast.obtain[type],
	                msg: msg,
	                sticky: false
	            }, unsafeWindow));
	        };
		function decode(url, i) {
			var newUrl;
			GM_xmlhttpRequest({
				method: 'get',
				url: url,
				headers: {
					"Referer": "http://pan.baidu.com/disk/home",
					"Range": "bytes=0-1",
				},
				onload: function(response) {
					var newUrl = response.finalUrl;
					debug(newUrl);
					$('.dlinks')[i].href = newUrl;
					$('.dlinks')[i].style.color = "red";
				}
			});
		};
		var Config = { // 默认的设置
			debug: false,

			trim_titles: [ // Share Home 标题移除的文字广告
				"[v.BDpan.COM]"
			],
			lineBreak: isChrome ? '\r' : '\n',
		};


		var debug = Config.debug ? console.debug.bind(console) : function() {};
		// 最新的改版，在个人主页页面已失效，改用下面的 require
		var FileUtils = unsafeWindow.FileUtils,
			Utilities = unsafeWindow.Utilities,
			disk = unsafeWindow.disk,
			Page = unsafeWindow.Page;
		// 个人主页存在，其它页面可能不存在
		var require = unsafeWindow.require;

		var Utils = {
			r1: function(reg, str) {
				var m = str.match(reg);
				return m ? m[1] : null;
			},
			getParam: function(name, url) {
				var regexp = new RegExp("(?:^|\\?|#|&)" + name + "=([^&#]*)(?:$|&|#)", "i"),
					matches = regexp.exec(url || location.href);
				return matches ? decodeURIComponent(matches[1]) : ""
			},
		};

		var mHome = (function() { // 个人主页
			if (!require) return;
			
			var downloadAll = function() {
				var context=require("system-core:context/context.js");
				var dlinkService=require("disk-system:widget/plugin/download/service/dlinkService.js");
				var downloadController=require("disk-system:widget/plugin/download/controller/downloadController.js");

				// 得到选中的条目，过滤文件夹
				var selected=context.prototype.list.getSelected();
				var fileList = [];
				$(selected).each(function(i, self) {
					var $self = $(self);
					if ($self.data('extname') === 'dir') return;

					fileList.push({
						fs_id: $self[0].fs_id,
						server_filename: $self[0].server_filename,
					})
				});

				if (fileList.length === 0) return;

				var type = 'dlink',
					callback = function(result) {
						if (!result.dlink) return;

						result.dlink.forEach(function(info) {
							for (var i = fileList.length - 1, file; i >= 0; i--) {
								file = fileList[i];
								if (file.fs_id == info.fs_id) {
									file.dlink = info.dlink;
									break;
								}
							}
						});
						Pan.checkedItems = fileList;
						Pan.showPanel(fileList);
						delete unsafeWindow.gm_pan_callback;
					};

				// 兼容 Greasemonkey 2.0+
				exportFunction(callback, unsafeWindow, {
					defineAs: "gm_pan_callback"
				});
				dlinkService.getDlinkPan(dlinkService.getFsidListData(selected), type, unsafeWindow.gm_pan_callback);
			};

			var setDocumentTitle = function() { // 设置页面标题，根据 hash 变化而变化，方便历史记录检索
				var path = Utils.getParam('dir/path') || Utils.getParam('path');
				if (path === "") {
					var key = Utils.getParam('key')
					if (key) {
						path = "搜索：" + key;
					}
				}

				if (path) {
					// 不知道是否是百度盘的问题，需要 2 次 decodeURIComponent
					document.title = '百度云 网盘-' + decodeURIComponent(path);
				}
			};

			var addButton = function() {
				$('<a class="icon-btn-download g-button"><span class="g-button-right"><em class="icon icon-offline-download" title="批量下载"></em><span style="width: auto;" class="text">批量下载</span></span></a>')
					.insertAfter('a.g-button[data-button-id="b13"]')
					.click(downloadAll);
			};

			var init = function() {
				addButton();

				setDocumentTitle();
				window.addEventListener('hashchange', setDocumentTitle, false);

			};

			return {
				init: init
			}

		})();
		var Pan = {
			fetchCount: 0,
			init: function() {
				var pageType = this.determineCurrentPageType();
				debug('pageType is ', pageType);
				if (pageType !== null) {
					this.pageType = pageType;
					this.processPage(pageType);
				}
			},
			determineCurrentPageType: function() {
				var pageType = null;
				var loc = window.location.href.toLowerCase();
				if (loc.indexOf('/disk/home') != -1) pageType = 'diskHome';
				else if (loc.indexOf('/share/link') != -1 || loc.indexOf('/s/') != -1) {
					var type = unsafeWindow.yunData.SHAREPAGETYPE;
					if (type == 'multi_file') pageType = 'shareDir';
					else if (type == 'single_file_page') pageType = 'shareOne';
				} else if (loc.indexOf('/share/home') != -1) pageType = 'shareHome';
				else if (loc.indexOf('/pcloud/album/info') != -1) pageType = 'albumInfo';
				else if (loc.indexOf('/pcloud/album/file') != -1) pageType = 'albumFile';
				else if (loc.indexOf('/share/init?') != -1) pageType = 'shareInit';
				return pageType;
			},
			processPage: function(pageType) {
				if (pageType !== null) {
					var pageProcessor = pageType + 'PageProcessor';

					this.pageType = pageType;

					if (typeof(this[pageProcessor]) == 'function') {
						GM_addStyle(panelCSS);
						this[pageProcessor]();
					}
				}
			},

			diskHomePageProcessor: function() { // 个人主页
				mHome.init();
			},
			shareDirPageProcessor: function() {
				var self = this;
				// 添加批量下载按钮
				$('<a class="bbtn" style="padding-left:10px"><b>批量下载</b></a>')
					.appendTo('.module-list-toolbar>.bar')[0].onclick = function(e) {
						self.downloadAll();
					};
			},
			shareOnePageProcessor: function() {

			},
			shareHomePageProcessor: function() {

			},
			albumInfoPageProcessor: function() {
				var self = this;
				var _mAlbumId, _mUk, _mPage;

				_mAlbumId = (disk.ui.album.albuminfo && disk.ui.album.albuminfo.album_id) || disk.getParam("album_id");
				_mUk = (disk.ui.album.uinfo && disk.ui.album.uinfo.uk) || disk.getParam("uk") || disk.getParam("query_uk");
				_mPage = {
					count: 0,
					totalPage: 0,
					nowPage: 1,
					limit: 60,
					handle: false
				};
				var getList = function() {
					var nowPage = $('#albumPage .page-input-wrap > input').val();
					_mPage.nowPage = parseInt(nowPage);
					var restUrl = "/pcloud/album/listfile?album_id=" + _mAlbumId + "&query_uk=" + _mUk +
						"&start=" + (_mPage.nowPage - 1) * 60 + "&limit=" + _mPage.limit;

					$.get(restUrl, function(result) {
						if (result && result.errno == 0 && result.list) {
							Pan.showPanel(result.list);
							Pan.toast.setVisible(false);
						} else {
							Pan.useToast("获取数据出错, " + restUrl);
						}
					});
				};

				// 内容由 js 生成
				var clicked = function(e) {
					var $quickFileSave = $('#quickFileSave');
					if ($quickFileSave[0]) {
						$('<a class="bbutton" style="margin-left:10px;padding-left:5px;">\
	                        <b style="padding-right: 5px;">批量下载</b></a>')
							.insertAfter($quickFileSave)[0].onclick = getList;

						$('body').unbind('click');
					}
				};
				$('body').bind('click', clicked);
			},

			shareInitPageProcessor: function() {

			},
			// --------------------
			downloadAll: function() {
				var self = this;
				var file_list = [];
				yunData=unsafeWindow.yunData;
				if (yunData.SHAREPAGETYPE == "single_file_page") {
					var fid_list = 'fid_list=' + JSON.stringify([yunData.FS_ID]);
					set_share_data(yunData, fid_list);
				} else {
					var File = require("common:widget/data-center/data-center.js");
					var Filename = File.get("selectedItemList");
					var file_info = File.get("selectedList");
					if (file_info.length == 0) {
						SetMessage("先选择一下你要下载的文件哦", "MODE_CAUTION");
						return;
					}
					var count=0;
					for (var i = 0; i < Filename.length; i++) {
						if (Filename[i].attr("data-extname") != "dir") {
							var lastFlag=false;
							var fid_list = 'fid_list=' + JSON.stringify([Filename[i].attr("data-id")]);
							yunData["isdir"] = 0;
							set_share_data(yunData, fid_list, file_list);
						}
						
					}
				}
				function set_share_data(obj, fid_list, file_list) {
					var data = "encrypt=0&product=share&uk=" + yunData.SHARE_UK + "&primaryid=" + yunData.SHARE_ID + "&" + fid_list;
					if (yunData.SHARE_PUBLIC == 0) {
						var Service = require("common:widget/commonService/commonService.js");
						data = data + "&extra=" + encodeURIComponent(JSON.stringify({
							sekey: Service.getCookie("BDCLND")
						}));
					}
					if (obj.isdir == 1) {
						data = data + "&type=batch";
					}
					get_share_dlink(obj, data, file_list);
				}
				function get_share_dlink(obj, data, file_list) {
					var download = "http://" + window.location.host + "/api/sharedownload?channel=chunlei&clienttype=0&web=1&app_id=" + yunData.FILEINFO[0].app_id + "&timestamp=" + yunData.TIMESTAMP + "&sign=" + yunData.SIGN + "&bdstoken=" + yunData.MYBDSTOKEN;
					var pic = "http://" + window.location.host + "/api/getcaptcha?prod=share&channel=chunlei&clienttype=0&web=1&bdstoken=" + yunData.MYBDSTOKEN + "&app_id=" + yunData.FILEINFO[0].app_id;
					var parameter = {
						'url': download,
						'dataType': 'json',
						type: 'POST',
						'data': data
					};
					$.ajax(parameter)
						.done(function(json, textStatus, jqXHR) {
							if (json.errno == -20) {
								$.ajax({
										'url': pic,
										'dataType': 'json',
										type: 'GET'
									})
									.done(function(json, textStatus, jqXHR) {
										if (data.indexOf("input") != -1) {
											json.auth = true;
										}
										SetMessage("需输入验证码，无法继续", "MODE_FAILURE");
										console.log('需输入验证码，无法继续');
									})
									.fail(function(json, textStatus, jqXHR) {
										SetMessage("获取验证码失败?", "MODE_FAILURE");
									});

							} else if (json.errno == 0) {

								if (obj.isdir == 1) {
									self.get_dir(JSON.stringify(json));
									return;
								} else {
									for (var i = 0; i < json.list.length; i++) {
										var list = json.list[i];
										file_list.push({
											server_filename: list.path.slice(yunData.PATH.lastIndexOf("/") + 1, list.path.length),
											dlink: list.dlink
										});
									}
									count++;
									debug(count,Filename.length);
									if(count==Filename.length)
									Pan.showPanel(file_list);
								}
							} else {
								debug(json);
								SetMessage("出现异常!", "MODE_FAILURE");
							}

						})
						.fail(function(jqXHR, textStatus, errorThrown) {
							SetMessage("获取地址失败?", "MODE_FAILURE");
						});
				}
			},
			
			getList: function(item) {
				var self = this;
				var dir, restUrl;

				dir = item && item.path || disk.getParam('path');
				restUrl = this.API_URL + (dir ? '&dir=' + encodeURIComponent(dir) : '');

				debug('获取数据', restUrl);
				$.get(restUrl, function(result) {
					self.fetchCount -= 1;
					if (result && result.errno == 0 && result.list) {
						if (item) {
							item.children = result.list;
						} else { // 专辑获取到的结果为 checkedItems
							self.checkedItems = result.list;
						}
						self.handleResult(result.list);
					} else {
						Pan.useToast("获取数据出错, " + restUrl);
					}
				});
			},
			handleResult: function() { // 全部获取完成
				if (this.fetchCount > 0) return;

				var self = this;

				debug('得到选择的数据', this.checkedItems);
			},
			showPanel: function(checkedItems, dlinkMap) {
				if (!this.panel) {
					this.panel = this.createPanel();
				}
				var linksHTML = this.createDLinksHtml(checkedItems, dlinkMap);
				$("#mDownload-links").html(linksHTML);
				this.panel.style.display = "block";
				//$('.dlinks').each(function(i) {
				//	decode($('.dlinks')[i].href, i);
				//})
			},
			createPanel: function() {
				var self = this;

				var container = document.createElement("div");
				container.id = "mDownload-container";

				var links_div = document.createElement("div");
				links_div.id = "mDownload-links";

				var closeButton = document.createElement("button");
				closeButton.id = "mDownload-close-button";
				closeButton.innerHTML = "关闭";
				closeButton.onclick = function() {
					container.style.display = "none";
				};

				var exportButton = document.createElement("button");
				exportButton.id = "mDownload-export-button";
				exportButton.innerHTML = "导出";
				exportButton.onclick = function() {
					GM_openInTab('data:text/html;charset=utf-8,' + encodeURIComponent(links_div.innerHTML));
				};

				var copyButton = document.createElement("button");
				copyButton.id = "mDownload-copy-button";
				copyButton.innerHTML = "复制";
				copyButton.onclick = function() {
					self.copyDlinks(null);
				};

				container.appendChild(closeButton);
				container.appendChild(exportButton);
				container.appendChild(copyButton);
				container.appendChild(links_div);
				document.body.appendChild(container);
				return container;
			},

			dir_tpl: "<b style='padding-left:{padding_left}'>{server_filename}</b>",
			dlinks_tpl: "<a class='dlinks' href={dlink} style='padding-left:{padding_left}'>{server_filename}</a>",
			createDLinksHtml: function(checkedItems, dlinkMap) {
				var self = this,
					htmls = [],
					isAdded = false;

				checkedItems.forEach(function(item) {
					item.padding_left = "0px";

					if (item.isdir == 1) {
						htmls.push(template(self.dir_tpl, item));

						if (Array.isArray(item.children)) {
							item.children.forEach(function(i) {
								i.padding_left = "15px";
								if (dlinkMap) {
									i.dlink = dlinkMap[i.fs_id];
								}
								var tpl = i.dlink ? self.dlinks_tpl : self.dir_tpl;
								htmls.push(template(tpl, i));
							});
						}
					} else {
						if (!isAdded) {
							htmls.push("<b>---------------</b>");
							isAdded = true;
						}
						if (dlinkMap) {
							item.dlink = dlinkMap[item.fs_id];
						}
						htmls.push(template(self.dlinks_tpl, item));
					}
				});
				return htmls.join("<br>");
			},
			copyDlinks: function(items, type) {
				var arr = [];
				items = $('.dlinks');
				items.each(function(i) {
					arr.push(items[i].href);
					//console.log('copy+'+items[i].href)
				});
				this.copy(arr);
			},
			copy: function(arr, isDlink) {
				if (typeof isDlink == 'undefined') isDlink = true;

				GM_setClipboard(arr.join(Config.lineBreak), 'text');
				Pan.useToast('已经复制 <b>' + arr.length + '</b> 条' + (isDlink ? '下载' : '') + '链接到剪贴板');
			},

			useToast: function(msg, sticky) {
				// disk.ui.Toast.MODE_FAILURE    错误
				// disk.ui.Toast.MODE_CAUTION    警告
				// disk.ui.Toast.MODE_LOADING    载入
				// disk.ui.Toast.MODE_SUCCESS    正常
				if (Utilities) {
					return Utilities.useToast(cloneInto({
						toastMode: disk.ui.Toast.MODE_CAUTION,
						msg: msg,
						sticky: sticky || false
					}, unsafeWindow));
				} else if (require) {
					var Toast = require("common:widget/toast/toast.js");
					Toast.obtain.useToast(cloneInto({
						toastMode: Toast.obtain.MODE_CAUTION,
						msg: msg,
						sticky: sticky || false,
					}, unsafeWindow));
				}
			}
		};


		var panelCSS = "#mDownload-container{position:fixed;z-index:1000;left:314px;top:120px;background:white;padding:10px;border:1px solid rgb(153,153,153);box-shadow:0px 0px 9px rgb(153,153,153);}#mDownload-containerbutton{margin-right:10px;}#mDownload-links{margin-top:10px;max-height:400px;overflow:auto;}#mDownload-linksb{color:red;}#mDownload-containerbutton{color:black !important;}";


		function template(tpl, data) {
				return tpl.replace(/\{([\w\.]*)\}/g, function(str, key) {
					var keys = key.split('.'),
						value = data[keys.shift()];
					keys.forEach(function(key) {
						value = value[key];
					});
					return (value === null || value === undefined) ? '' : value;
				});
			}
		Pan.init();
	}
}
