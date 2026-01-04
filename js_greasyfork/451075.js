/* eslint-disable no-multi-spaces */
/* eslint-disable no-implicit-globals */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               imager
// @displayname        图床
// @namespace          Wenku8++
// @version            0.2
// @description        为轻小说文库++提供图床支持
// @author             PY-DNG
// @license            GPL-v3
// @regurl             https?://www\.wenku8\.net/.*
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @require            https://greasyfork.org/scripts/449583-configmanager/code/ConfigManager.js?version=1085836
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// @grant              GM_xmlhttpRequest
// ==/UserScript==

(function __MAIN__() {
	const DATA_IMAGERS = {
		default: 'SDAIDEV',
		/* Imager Model
		_IMAGER_KEY_: {
			available: true,
			name: '_IMAGER_DISPLAY_NAME_',
			tip: '_IMAGER_DISPLAY_TIP_',
			upload: {
				request: {
					url: '_UPLOAD_URL_',
					data: {
						'_FORM_NAME_FOR_FILE_': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json._SUCCESS_KEY_ === '_SUCCESS_VALUE_';},
					geturl: (json)=>{return json._PATH_._SUCCESS_URL_KEY_;},
					getname: (json)=>{return json._PATH_ ? json._PATH_._FILENAME_ : null;},
					getsize: (json)=>{return json._PATH_._SIZE_},
					getpage: (json)=>{return json._PATH_ ? json._PATH_._PAGE_ : null;},
					gethash: (json)=>{return json._PATH_ ? json._PATH_._HASH_ : null;},
					getdelete: (json)=>{return json._PATH_ ? json._PATH_._DELETE_ : null;}
				}
			},
			isImager: true
		},
		*/
		PANDAIMG: {
			available: true,
			name: '熊猫图床',
			tip: '2022-01-16测试可用</br>单张图片最大5MB',
			upload: {
				request: {
					url: 'https://api.pandaimg.com/upload',
					data: {
						'file': '$file$',
						'classifications': '',
						'day': '0'
					},
					headers: {
						'usersOrigin': '5edd88d4dfe5d288518c0454d3ccdd2a'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === '200';},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		SDAIDEV: {
			available: true,
			name: '流浪图床',
			tip: '2022-01-09测试可用</br>单张图片最大5MB',
			upload: {
				request: {
					url: 'https://p.sda1.dev/api/v1/upload_external_noform',
					urlargs: {
						'filename': '$filename$',
						'ts': '$time$',
						'rand': '$random$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.success;},
					geturl: (json)=>{return json.data.url;},
					getdelete: (json)=>{return json.data ? json.data.delete_url : null;},
					getsize: (json)=>{return json.data ? json.data.size : null;}
				}
			},
			isImager: true
		},
		JITUDISK: {
			available: true,
			name: '极兔兔床',
			tip: '2022-02-02测试可用',
			upload: {
				request: {
					url: 'https://pic.jitudisk.com/api/upload',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		SMMS: {
			available: true,
			name: 'SM.MS',
			tip: '注意：此图床跨域访问较不稳定，且有用户反映其被国内部分服务商屏蔽，请谨慎使用此图床',
			warning: '注意：此图床跨域访问较不稳定，且有用户反映其被国内部分服务商屏蔽，请谨慎使用此图床</br>如出现上传错误/图片加载慢/无法加载图片等情况，请更换其他图床',
			upload: {
				request: {
					url: 'https://sm.ms/api/v2/upload?inajax=1',
					data: {
						'smfile': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.success === true || /^https?:\/\//.test(json.images);},
					geturl: (json)=>{return json.data ? json.data.url : json.images;},
					getname: (json)=>{return json.data ? json.data.filename : null;},
					getpage: (json)=>{return json.data ? json.data.page : null;},
					gethash: (json)=>{return json.data ? json.data.hash : null;},
					getdelete: (json)=>{return json.data ? json.data.delete : null;}
				}
			},
			isImager: true
		},
		CATBOX: {
			available: true,
			name: 'CatBox',
			tip: '注意：此图床访问较不稳定，请谨慎使用此图床',
			warning: '注意：此图床访问较不稳定，请谨慎使用此图床</br>如出现上传错误/图片加载慢/无法加载图片等情况，请更换其他图床',
			upload: {
				request: {
					url: 'https://catbox.moe/user/api.php',
					responseType: 'text',
					data: {
						'fileToUpload': '$file$',
						'reqtype': 'fileupload'
					}
				},
				response: {
					checksuccess: (text)=>{return true;},
					geturl: (text)=>{return text;}
				}
			},
			isImager: true
		}
	};
	const CONST = {
		Text: {
			CurImage: '当前图片：',
			InputImage: '选择/粘贴/拖拽 上传图片',
			InvalidFile: '您选择的文件不是可识别的图片:(</br>请选择.jpg/.jpeg/.png格式的图片',
			UploadError: '上传错误！',
			NoNameFromSever: '空(服务器没有返回文件名)',
		},
		Config_Ruleset: {
			'version-key': 'config-version',
			'ignores': ["LOCAL-CDN"],
			'defaultValues': {
				imager: 'SDAIDEV'
			}
		}
	};

	const CM = new ConfigManager(CONST.Config_Ruleset);
	const CONFIG = CM.Config;
	const alertify = require('alertify');
	const settings = require('settings');
    const SettingPanel = require('SettingPanel');
	SettingPanel.registerElement('image', {
		createElement: function() {
			const SO = this;
			const data = SO.hasOwnProperty('data') ? SO.data : {};

			// <input type="file">
			const file = $CrE('input');
			file.type = 'file';
			file.addEventListener('change', fileGot);

			// Displayer div
			const div = $CrE('div');
			div.innerText = CONST.Text.CurImage + SO.url + '\n' + CONST.Text.InputImage;
			div.style.color = data.hasOwnProperty('textColor') ? data.textColor : 'grey';
			div.style.width = div.style.height = '100%';
			div.style.border = div.style.padding = div.style.margin = '0';
			data.hasOwnProperty('innerText') && (div.innerText = data.innerText);
			data.hasOwnProperty('innerHTML') && (div.innerHTML = data.innerHTML);
			div.addEventListener('click', file.click.bind(file));
			div.addEventListener('paste', fileGot);
			div.addEventListener('dragenter', destroyEvent);
			div.addEventListener('dragover', destroyEvent);
			div.addEventListener('drop', fileGot);
			return div;

			function fileGot(e) {
				const file = fileEvent(e);
				if (!file) {
					alertify.error(CONST.Text.InvalidFile);
					return false;
				}
				uploadImage({
					file: file,
					type: CONFIG.imager,
					onload: function(e) {
						copyProps(e, SO, Object.keys(e));
						div.innerText = CONST.Text.CurImage + SO.url + '\n' + CONST.Text.InputImage;
						div.dispatchEvent(new Event('change'));
					},
				});
			}
		},
		setValue: function(url) {
			this.url = url;
			this.element.innerText = CONST.Text.CurImage + url + '\n' + CONST.Text.InputImage;
		},
		getValue: function() {return this.url;},
	});

	function fileEvent(e) {
		destroyEvent(e);
		const input = e.dataTransfer || e.clipboardData || window.clipboardData || e.target;
		if (!input.files || input.files.length === 0) {return false;};

		for (const file of input.files) {
			const splited = file.name.split('.');
			const ext = splited[splited.length-1].toLowerCase();
			const extOkay = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
			const mimeOkay = ['image/bmp', 'image/gif', 'image/vnd.microsoft.icon', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/webp'].includes(file.type)
			if (extOkay || mimeOkay) {
				return file;
			}
		}

		return null;
	}

	// Upload image to KIENG images
	// details: {file: File, onload: Function({url, name, json}), onerror: Function, type: 'sm.ms/jd/sg/tt/...'}
	function uploadImage(details) {
		const file    = details.file;
		const onload  = details.onload  ? details.onload  : function() {};
		const onerror = details.onerror ? details.onerror : uploadError;
		const type    = details.imager    ? details.imager    : CONFIG.imager;
		if (!DATA_IMAGERS.hasOwnProperty(type) || !DATA_IMAGERS[type].available) {
			onerror();
			return false;
		}
		const imager = DATA_IMAGERS[type];
		const upload = imager.upload;
		const request = upload.request;
		const response = upload.response;

		// Construct request url
		let url = request.url;
		if (request.urlargs) {
			const args = request.urlargs;
			const makearg = (key, value) => ('{K}={V}'.replace('{K}', key).replace('{V}', value));
			const replacers = {
				'$filename$': () => (encodeURIComponent(file.name)),
				'$random$': () => (Math.random().toString()),
				'$time$': () => ((new Date()).getTime().toString())
			};
			for (let [key, value] of Object.entries(args)) {
				url += url.includes('?') ? '&' : '?';
				for (const [str, replacer] of Object.entries(replacers)) {
					while (value !== null && value.includes(str)) {
						const val = replacer(key);
						value = (val !== null) ? value.replace(str, val) : null;
					}
				}
				(value !== null) && (url += makearg(key, value));
			}
		}

		// Construst request body
		let data;
		if (request.data) {
			data = new FormData();
			const replacers = {
				'$file$': (key) => ((data.append(key, file), null)),
				'$random$': () => (Math.random().toString()),
				'$time$': () => ((new Date()).getTime().toString())
			};

			for (let [key, value] of Object.entries(request.data)) {
				for (const [str, replacer] of Object.entries(replacers)) {
					while (value !== null && value.includes(str)) {
						const val = replacer(key);
						value = (val !== null) ? value.replace(str, val) : null;
					}
				}
				(value !== null) && data.append(key, value);
			}
		} else {
			data = file;
		}

		// headers
		const headers = request.headers || {};

		GM_xmlhttpRequest({
			method: 'POST',
			url: url,
			timeout: 15 * 1000,
			data: data,
			headers: headers,
			responseType: request.responseType ? request.responseType : 'json',
			onerror: onerror,
			ontimeout: onerror,
			onabort: onerror,
			onload: (e) => {
				const json = e.response;
				const success = e.status === 200 && response.checksuccess(json);
				if (success) {
					const url = response.geturl(json);
					const name = response.getname ? (response.getname(json) ? response.getname(json) : CONST.Text.NoNameFromSever) : CONST.Text.NoNameFromSever
					onload({
						url: url,
						name: name,
						json: json
					});
				} else {
					onerror(json);
					return;
				}
			}
		});

		function uploadError(json) {
			alertify.error(CONST.Text.UploadError);
			DoLog(LogLevel.Error, [CONST.Text.UploadError, json]);
		}
	}
})();