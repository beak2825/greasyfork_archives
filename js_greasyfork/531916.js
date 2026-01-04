// ==UserScript==
// @name         sewerpt-Torrent-Assistant
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  下水道审助手
// @author       zmpt
// @include      http*://sewerpt.com/details.php*
// @include      http*://sewerpt.com/offers.php*off_details*
// @include      http*://sewerpt.com/torrents.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      movie.douban.com
// @connect      gifyu.com
// @connect      imgbox.com
// @connect      pixhost.to
// @connect      ptpimg.me
// @connect      ibb.pics
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531916/sewerpt-Torrent-Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/531916/sewerpt-Torrent-Assistant.meta.js
// ==/UserScript==
(function() {
	'use strict';

	const $ = jQuery;


	//种审判断
	//=====================================
	var isEditor;
	if (GM_info.script.name === "sewerpt-Torrent-Assistant") {
		isEditor = GM_getValue('isEditor', true);
	} else {
		isEditor = GM_getValue('isEditor', false);
	}

	if (window.location.href.includes("/details.php") || window.location.href.includes("/offers.php")) {
		$('#outer').prepend(
			'<div style="display: inline-block; padding: 10px 30px; color: white; background: red; font-weight: bold;margin-bottom: 10px" id="assistant-tooltips"></div>'
		);

		// 查找目标div
		var targetDiv = document.querySelector('#assistant-tooltips');
		if (targetDiv) {
			// 创建包含多选框和标签的新div
			var containerDiv = document.createElement('div');
			containerDiv.style.cssText = 'display: inline-block; margin-left: 20px; vertical-align: top;';

			// 创建换行元素并插入
			var breakElement = document.createElement('br');
			targetDiv.parentNode.insertBefore(breakElement, targetDiv.nextSibling);
			targetDiv.parentNode.insertBefore(containerDiv, breakElement.nextSibling);
		}
		if (isEditor) {
			$('#assistant-tooltips').after(
				'<br/><div style="display: inline-block; padding: 10px 30px; color: white; background: DarkSlateGray; font-weight: bold;" id="editor-tooltips"></div>'
			);
		}

		var cat_constant = {
			401: "电影 / Movies",
			402: "电视剧 / TV Series",
			403: "综艺 / TV Shows",
			404: "纪录片 / Documentaries",
			405: "动漫 / Animations",
			408: "音乐 / Music",
			409: "其他 / Misc",
		};

		var type_constant = {
			1: "Blu-ray",
			2: "HD DVD",
			3: "Remux",
			4: "MiniBD",
			5: "HDTV",
			6: "DVDR",
			7: "Encode",
			8: "CD",
			10: "WEB-DL",
		};

		var encode_constant = {
			6: "HEVC",
			1: "AVC",
			2: "VC-1",
			3: "Xvid",
			4: "MPEG-2",
			5: "Other"
		};

		var audio_constant = {
			1: "FLAC",
			2: "APE",
			3: "DTS",
			4: "MP3",
			5: "OGG",
			6: "AAC",
			7: "Other",
			8: "AC3",
			9: "ALAC",
			10: "WAV",
			11: "E-AC3",
			12: "TrueHD Atmos",
			13: "TrueHD",
			14: "DTS-HD MA",
			15: "DTS:X",
			16: "LPCM",
			17: "AV3V",
			18: "OPUS"
		};

		var resolution_constant = {
			2: "480p",
			3: "720p",
			1: "1080p/1080i",
			4: "2K/1440p",
			5: "4K/2160p",
			6: "8K/4320p"
		};

		var group_constant = {
			1: "SewageWeb",
			5: "Other"
		};
		var title = document.getElementById("top").innerText.replace(" (禁止)").split("    ")[0];
		var exclusive = 0;
		if (title.indexOf('禁转') >= 0) {
			exclusive = 1;
		}

		title = title.trim();
		console.log(title);

		var title_lowercase = title.toLowerCase();
		var title_type, title_encode, title_audio, title_resolution, title_group, title_is_complete;

		// 格式
		if (/[.| ]remux/.test(title_lowercase)) {
			title_type = 3;
		} else if (/[.| ]bdrip/.test(title_lowercase) || (/([.| ]bluray|[.| ]blu-ray)/.test(title_lowercase) &&
				/[.| ]x26[45]/.test(title_lowercase))) {
			title_type = 1;
		} else if (/([.| ]bluray|[.| ]blu-ray)/.test(title_lowercase)) {
			title_type = 1;
		} else if (/[.| ]webrip/.test(title_lowercase) || (/[.| ]web[.| ]/.test(title_lowercase) && /[.| ]x26[45]/
				.test(title_lowercase))) {
			title_type = 10;
		} else if (/([.| ]web-dl|[.| ]webdl|[.| ]web[.| ])/.test(title_lowercase)) {
			title_type = 10;
		} else if (/[.| ]tvrip/.test(title_lowercase)) {
			title_type = 10;
		} else if (/([.| ]hdtv|[.| ]hdtv[.| ])/.test(title_lowercase)) {
			title_type = 5;
		} else if (/[.| ]dvdrip/.test(title_lowercase) || ((/([.| ]dvd|[.| ]dvd[.| ])/.test(title_lowercase)) &&
				/[.| ]x26[45]/.test(title_lowercase))) {
			title_type = 6;
		} else if (/([.| ]dvd|[.| ]dvd[.| ])/.test(title_lowercase)) {
			title_type = 6;
		}


		// codec
		if (/([.| ]x265|[.| ]h265|[.| ]h\.265|[.| ]hevc)/.test(title_lowercase)) {
			title_encode = 6;
		} else if (/([.| ]x264|[.| ]h264|[.| ]h\.264|[.| ]avc)/.test(title_lowercase)) {
			title_encode = 1;
		} else if (/([.| ]vc-1|[.| ]vc1)/.test(title_lowercase)) {
			title_encode = 2;
		} else if (/(mpeg2|mpeg-2)/.test(title_lowercase)) {
			title_encode = 4;
		}

		// audiocodec
		if (/[.| ](dts-hd|dtshd|dts-x|dts:x)/.test(title_lowercase)) {
			title_audio = 14;
		} else if (/[.| ]truehd/.test(title_lowercase)) {
			title_audio = 13;
		} else if (/[.| ]lpcm|[.| ]pcm/.test(title_lowercase)) {
			title_audio = 16;
		} else if (/[.| ]dts/.test(title_lowercase)) {
			title_audio = 3;
		} else if (/[.| ]ac3|[.| ]dd\+|[.| ]dd2|[.| ]dd5|[.| ]dd\.2|[.| ]dd\.5/.test(
				title_lowercase)) {
			title_audio = 8;
		} else if (/[.| ]ac-3|[.| ]ddp/.test(title_lowercase)) {
			title_audio = 11;
		} else if (/[.| ]aac/.test(title_lowercase)) {
			title_audio = 6;
		} else if (/[.| ]flac/.test(title_lowercase)) {
			title_audio = 1;
		}

		// standard
		if (!/remastered/.test(title_lowercase) && (/[.| ]2160p/.test(title_lowercase) || (/[.| ]uhd/.test(
				title_lowercase) && !/[.| ]1080p/.test(title_lowercase)) || /[.| ]4k[.| ]/.test(
				title_lowercase))) {
			title_resolution = 5;
		} else if (/[.| ]1440p/.test(title_lowercase)) {
			title_resolution = 4;
		} else if (/[.| ]1080p/.test(title_lowercase)) {
			title_resolution = 1;
		} else if (/[.| ]1080i/.test(title_lowercase)) {
			title_resolution = 1;
		} else if (/[.| ]720p/.test(title_lowercase)) {
			title_resolution = 3;
		} else {
			title_resolution = 0;
		}
		if (/complete/.test(title_lowercase)) {
			title_is_complete = true;
		}

		// 发布组选择
		if (/sewageweb/.test(title_lowercase)) {
			title_group = 1;
		} else if (/other/.test(title_lowercase)) {
			title_group = 5;
		}

		console.log('title_type:', title_type, 'title_encode:', title_encode, 'title_audio:', title_audio,
			'title_resolution:', title_resolution, 'title_group:', title_group, 'title_is_complete:',
			title_is_complete);


		var subtitle, cat, type, encode, audio, resolution, group, anonymous;
		var poster;
		var fixtd, douban, imdb, mediainfo_title, mediainfo_s, torrent_extra, douban_raw;
		var sub_chinese, audio_chinese, is_complete, is_chinese, is_dovi, is_hdr, is_hlg,
			is_c_dub, is_bd, is_cc, is_anime;

		var tdlist = $('#top').next('table').find('td');
		if (tdlist.length === 0) {
			tdlist = $('#top').next().next('table').find('td');
		}

		// Mediainfo 信息
		var mediainfo = document.querySelectorAll("#kdescr fieldset")
		if (mediainfo.length > 1) {
			mediainfo_s = mediainfo[mediainfo.length - 1].innerText;
		} else if (mediainfo.length > 0) {
			mediainfo_s = mediainfo[0].innerText;
		} else {
			mediainfo_s = ""
		}
		mediainfo_title = mediainfo_s;
		for (var i = 0; i < tdlist.length; i++) {
			var td = $(tdlist[i]);

			if (td.text() === '副标题' || td.text() === '副標題') {
				subtitle = td.parent().children().last().text();
			}

			if (td.text() === '添加') {
				let text = td.parent().children().last().text();
				if (text.indexOf('匿名') >= 0) {
					anonymous = 1;
				}
			}

			if (td.text() === '基本信息') {
				var tags = td.parent().children().last().text().split("   ")
				var catText = "";
				var typeText = "";
				var encodeText = "";
				var audioText = "";
				var resolutionText = "";
				var areaText = "";
				var authorText = "";

				for (var ii = 0; ii < tags.length; ii++) {
					var tag = tags[ii].split(":")
					if (tag.length !== 2) {
						continue;
					}
					if (tag[0] === "类型") {
						catText = tag[1].trim()
						continue;
					}
					if (tag[0] === "媒介") {
						typeText = tag[1].trim()
						continue;
					}
					if (tag[0] === "编码") {
						encodeText = tag[1].trim()
						continue;
					}
					if (tag[0] === "音频编码") {
						audioText = tag[1].trim()
						continue;
					}
					if (tag[0] === "分辨率") {
						resolutionText = tag[1].trim()
						continue;
					}
					if (tag[0] === "制作组") {
						authorText = tag[1].trim()
					}
				}


				// 类型
				Object.entries(cat_constant).forEach(([key, value]) => {
					if (catText.indexOf(value) >= 0) {
						cat = key;
					}
				});


				Object.entries(type_constant).forEach(([key, value]) => {
					if (typeText.indexOf(value) >= 0) {
						type = key;
					}
				});


				Object.entries(resolution_constant).forEach(([key, value]) => {
					if (resolutionText.indexOf(value) >= 0) {
						resolution = key;
					}
				});

				Object.entries(group_constant).forEach(([key, value]) => {
					if (authorText.indexOf(value) >= 0) {
						group = key;
					}
				});

				Object.entries(encode_constant).forEach(([key, value]) => {
					if (encodeText.indexOf(value) >= 0) {
						encode = key;
					}
				});
				Object.entries(audio_constant).forEach(([key, value]) => {
					if (audioText.indexOf(value) >= 0) {
						audio = key;
					}
				});

				console.log('cat:', cat, 'type:', type, 'encode:', encode, 'audio:', audio, 'resolution:',
					resolution, 'group:', group);

			}

			if (td.text() === '行为') {
				fixtd = td.parent().children().last();
			}

			if (td.text().trim() === '海报') {
				poster = $('#kposter').children().attr('src');
			}

			if (td.text() === '标签') {
				let text = td.parent().children().last().text();

				// 使用正则表达式进行匹配
				if (/合集/.test(text)) {
					is_complete = true;
				}
				if (/中字/.test(text)) {
					is_chinese = true;
				}
				if (/HDR/.test(text)) {
					is_hdr = true;
				}
				if (/DoVi/.test(text)) {
					is_dovi = true;
				}
				if (/HLG/.test(text)) {
					is_hlg = true;
				}
				if (/国配/.test(text)) {
					is_c_dub = true;
				}
				if (/原生/.test(text)) {
					is_bd = true;
				}
				if (/cc/.test(text)) {
					is_cc = true;
				}
				if (/动画/.test(text)) {
					is_anime = true;
				}
			}
			if (td.text().trim() === '其它信息') {
				torrent_extra = $('#kdescr').html();
			}
			if (/字\s*幕.*?Chinese/i.test(mediainfo_s) || /字\s*幕.*?Mandarin/i.test(
					mediainfo_s) || /Subtitle:\s*?Chinese/i.test(mediainfo_s) || /Language: +|\s*?Chinese/i.test(
					mediainfo_s)) {
				sub_chinese = true;
			} else {
				sub_chinese = false;
			}

			if (td.text().trim().startsWith('豆瓣')) {
				douban_raw = td.parent().children().last();
			}
		}


		// 豆瓣
		$('div.douban-info h2 a').each(function(index, element) {
			if ($(element).attr('href').indexOf('douban') >= 0) {
				douban = $(element).text();
			}
			if ($(element).attr('href').indexOf('imdb') >= 0) {
				imdb = $(element).text();
			}
		});


		// 中文音轨识别
		if ((/音\s频:.*?chinese.*?(字\s幕)/i.test(mediainfo_s) && type !== 1) || (/Audio:\s?Chinese/i.test(
				mediainfo_s) && type === 1)) {
			audio_chinese = true;
		}
		var screenshot = '';
		var imageCount = -1;
		var imgTags = document.getElementById("kdescr").getElementsByTagName("img");
		for (var index = 0; index < imgTags.length; index++) {
			var element = imgTags[i]
			var src = $(element).attr('src');
			if (src !== undefined) {
				if (index !== 0) {
					screenshot += '\n';
				}
				screenshot += src.trim();
			}
			imageCount++;
		}



		//==============================
		let error = false;

		if (type === 1) {
			var showfl = document.querySelector("#showfl a")
			if (showfl === null) {
				$('#assistant-tooltips').append('检测媒介为Encode或Remux选择媒介为Blu-ray<br/>');
				error = true;
			} else {
				var url_id = document.querySelector("#showfl a").href.split("viewfilelist")[1].replace("(", "")
					.replace(
						")", "")
				fetch("https://sewerpt.com/viewfilelist.php?id=" + url_id)
					.then((response) => {
						if (!response.ok) {}
						return response.text();
					})
					.then((data) => {
						const tempContainer = document.createElement("div");
						tempContainer.innerHTML = data;
						var file_list = tempContainer.querySelectorAll("table tr")
						for (var i = 0; i < file_list.length; i++) {
							var extension = file_list[i].firstElementChild.innerText.split(".").pop()
							console.log(extension)
							if (extension === "mkv" || extension === "mp4") {
								$('#editor-tooltips').append('<span style="color: red;">检测媒介可能为Encode或Remux选择媒介为Blu-ray</span><br/>');
								break;
							}
						}
					});



			}
		}
		if (/[\u4e00-\u9fa5\uff01-\uff60]+/.test(title)) {
			$('#assistant-tooltips').append('主标题包含中文或中文字符<br/>');
			error = true;
		}
		if (/-(FGT|NSBC|BATWEB|GPTHD|DreamHD|BlackTV|CatWEB|Xiaomi|Huawei|MOMOWEB|DDHDTV|SeeWeb|TagWeb|SonyHD|MiniHD|BitsTV|CTRLHD|ALT|NukeHD|ZeroTV|HotTV|EntTV|GameHD|SmY|SeeHD|VeryPSP|DWR|XLMV|XJCTV|Mp4Ba|VCB-Studio)/
			.test(title_lowercase)) {
			$('#assistant-tooltips').append('主标题包含禁发小组，请检查<br/>');
			error = true;
		}
		if (!subtitle) {
			$('#assistant-tooltips').append('副标题为空<br/>');
			error = true;
		}
		if (!cat) {
			$('#assistant-tooltips').append('未选择分类<br/>');
			error = true;
		}
		if (!type) {
			$('#assistant-tooltips').append('未选择格式<br/>');
			error = true;
		} else {
			if (title_type && +title_type !== +type) {
				$('#assistant-tooltips').append("标题检测格式为" + type_constant[title_type] + "，选择格式为" + type_constant[
					type] + '<br/>');
				error = true;
			}
		}
		if (!resolution) {
			$('#assistant-tooltips').append('未选择分辨率<br/>');
			error = true;
		} else {
			if (title_resolution && +title_resolution !== +resolution) {
				$('#assistant-tooltips').append("标题检测分辨率为" + resolution_constant[title_resolution] + "，选择分辨率为" +
					resolution_constant[resolution] + '<br/>');
				error = true;
			}
		}
		if (encode != title_encode) {
			$('#assistant-tooltips').append('检测编码为' + encode_constant[title_encode] + "，选择编码为" + encode_constant[
				encode] + '<br/> ');
			error = true;
		}
		if (audio != title_audio) {
			console.log(audio, title_audio)
			$('#assistant-tooltips').append('检测音频编码为' + audio_constant[title_audio] + "，选择编码为" + audio_constant[
				audio] + '<br/> ');
			error = true;
		}
		if (/tu\.totheglory\.im/.test(poster)) {
			$('#assistant-tooltips').append('海报使用防盗链图床，请更换或留空<br/>');
			error = true;
		}
		if (type === 1 && $('.mediainfo-short .codetop').text() === 'MediaInfo') {
			$('#assistant-tooltips').append('Blu-ray 媒体信息请使用 BDInfo<br/>');
			error = true;
		}

		if ((type === 6 || type === 4 || type === 7 || type === 8 || type === 9 || type === 10) && $(
				'.mediainfo-short .codemain').text().replace(/\s+/g, '') === $('.mediainfo-raw .codemain')
			.text()
			.replace(/\s+/g, '')) {
			$('#assistant-tooltips').append('媒体信息未解析<br/>');
			error = true;
		}
		// 标签
		if (sub_chinese && !is_chinese) {
			$('#assistant-tooltips').append('未选择「中字」标签<br/>');
			error = true;
		}
		if (!/^(?!Encoding).*Dolby Vision/im.test(mediainfo_title) && is_dovi) {
			$('#assistant-tooltips').append('选择「DoVi」标签，未识别到「DoVi」<br/>');
			error = true;
		}
		if (/^(?!Encoding).*HDR10/im.test(mediainfo_title) && !/^(?!Encode).*HDR10\+/im.test(mediainfo_title) &&
			!
			is_hdr) {
			$('#assistant-tooltips').append('未选择「HDR」标签<br/>');
			error = true;
		}
		if (!/^(?!Encoding).*HDR10/im.test(mediainfo_title) && is_hdr) {
			$('#assistant-tooltips').append('选择「HDR」标签，未识别到「HDR」<br/>');
			error = true;
		}
		if ((/<img\s+[^>]*>|◎/i.test(torrent_extra)) && !$('span[title="制作组"]').length > 0) {
			$('#assistant-tooltips').append('请移除附加信息中除致谢、制作信息以外的内容。<br/>');
			error = true;
		}
		if (mediainfo_s.length < 30) {
			error = true;
			if (type === 1 || type === 3) {
				$('#assistant-tooltips').append('媒体信息格式错误，请使用「BDInfo」重新获取完整的英文信息<br/>');
			} else {
				$('#assistant-tooltips').append('媒体信息格式错误，请使用「Mediainfo」重新获取完整的英文信息<br/>');
			}
		}

		if (title_group && !group) {
			$('#assistant-tooltips').append('未选择制作组' + group_constant[title_group] + '<br/>');
			error = true;
		}

		if (imageCount < 1) {
			$('#assistant-tooltips').append('截图未满 1 张<br/>');
			error = true;
		}

		const pichost_list = [
			'files.ptlgs.org',
			'cmct.xyz',
			"static.ssdforum.org",
			'static.hdcmct.org',
			'gifyu.com',
			'imgbox.com',
			'pixhost.to',
			'ptpimg.me',
			'ssdforum.org'
		];
		const shot = document.querySelector('section.screenshots-container');
		let shot_imgs = [];
		if (shot) {
			shot_imgs = Array.from(shot.querySelectorAll('img')).map(el => el.src);
		}
		$(document).ready(function() {
			let wrongPicList = [];
			if (shot_imgs.length) {
				shot_imgs.forEach(imgSrc => {
					let valid = pichost_list.some(site => imgSrc.includes(site));
					if (!valid) {
						wrongPicList.push(imgSrc);
					}
				});
				if (wrongPicList.length) {
					$('#assistant-tooltips').append('请使用规则白名单内的图床<br/>');
					error = true;
				}
			}
		});


		// =================================
		// 种审用（检测较为激进，需配合人工判断）
		// =================================
		if (isEditor) {

			$('#editor-tooltips').append('↓以下检测较为激进，需配合人工判断↓<br/>');
			if (!(title_is_complete || /[集期]全|全\s*?[\d一二三四五六七八九十百千]*\s*?[集期]|合集/i.test(subtitle)) &&
				is_complete) {
				$('#editor-tooltips').append('主副标题未识别到「合集」相关字符，请检查<br/>');
			}
			if (/^\s*(概览|概要)/i.test(mediainfo_title)) {
				$('#editor-tooltips').append('检测到「中文Mediainfo」，请重新扫描<br/>');
			}
			if ((/\.(hdr|hdr10)\./i.test(title_lowercase) || /BT\.2020/i.test(mediainfo_title)) && !
				/ST\s2086|ST\s2094|HDR\sVivid/i.test(mediainfo_title) && !/Transfer\scharacteristics\s*:\sHLG/i
				.test(mediainfo_title) && $('.mediainfo-short .codetop').text() === 'MediaInfo') {
				$('#editor-tooltips').append('主标题检测到HDR，未识别到「HDR」相关元数据，请重新扫描 Mediainfo<br/>');
			}
			if (/\.(Criterion|CC)\./i.test(title_lowercase) || /CC标准收藏版|CC收藏版|CC版|CC(?!TV)/i.test(subtitle) && !
				is_cc) {
				$('#editor-tooltips').append('主副标题识别到「CC」相关字符，请检查是否有「CC」标签<br/>');
			}
			if (/版原盘/i.test(subtitle) && !is_bd) {
				$('#editor-tooltips').append('副标题识别到「原盘」相关字符，请检查是否有「原生」标签<br/>');
			}
			if (/SUBtitleS:/.test(mediainfo_title)) {
				$('#editor-tooltips').append('识别到「SUBtitleS:」相关字符，请检查BDInfo<br/>');
			}
			console.log("(mediainfo_title.match(/[^\\S\\r\\n]/g) || []).length" + (mediainfo_title.match(
				/(?<!\S)[ ]{2,}(?!\S)/g) || []).length)
			if (/HDR\sformat.*dvhe\.05/i.test(mediainfo_title)) {
				$('#editor-tooltips').append('DUPE参考：Dolby Vision P5（不含 HDR10 数据）<br/>');
			}
			if (/HDR\sformat.*dvhe\.08/i.test(mediainfo_title) || /HDR\sformat.*dvhe\.07/i.test(
					mediainfo_title)) {
				$('#editor-tooltips').append('DUPE参考：Dolby Vision P7 or P8（含 HDR10 数据）<br/>');
			}
			if (!sub_chinese && is_chinese) {
				$('#editor-tooltips').append('选择「中字」标签，未识别到中文字幕，请检查<br/>');
			}
			if (/((FLUX|HHWEB|HHCLUB).*字幕|字幕.*(FLUX|HHWEB|HHCLUB)|DIY)/i.test(torrent_extra) && type === 7) {
				$('#editor-tooltips').append('添加字幕后修改原视频后缀的「WEB-DL」资源，此类资源应保留原组名后缀<br/>');
			}
			if (/Progressive/i.test(mediainfo_title) && resolution === 3) {
				$('#editor-tooltips').append('扫描方式为 Progressive，分辨率为 1080i<br/>');
			}

			if (
				(/^(?:Format).*?(DTS-HD|TrueHD|DTS:X|LPCM|Format\s+:\s+PCM\s+Format settings\s+:\s+Little\s+\/\s+Signed)/im
					.test(
						mediainfo_title
					) ||
					audio === 1 ||
					audio === 2 ||
					audio === 6) &&
				(resolution === 2 ||
					resolution === 3 ||
					resolution === 4 ||
					resolution === 5) &&
				(type === 6 || type === 8 || type === 9 || type === 10)
			) {
				$("#editor-tooltips").append("可替代：音频臃肿<br/>");
			}
			if (!sub_chinese && !is_bd) {
				$('#editor-tooltips').append('可替代：无中字或硬字幕<br/>');
			}
			if ((/x264/i.test(title_lowercase) && /10bit/i.test(title_lowercase)) || (
					/Bit\s+depth\s*:\s*10\s+bits/i
					.test(mediainfo_title) && /Writing\s+library\s*:\s*x264/i.test(mediainfo_title))) {
				$('#editor-tooltips').append('可替代：x264 10bit 硬件兼容性较差<br/>');
			}
			//压制
			if (/(hds|hdh|Dream)$/i.test(title_lowercase) && [6, 8, 9, 10].includes(type)) {
				$('#editor-tooltips').append('可替代：不受信小组<br/>');
			}
			//DIY
			if (/(hdhome)$/i.test(title_lowercase) && [1].includes(type)) {
				$('#editor-tooltips').append('可替代：不受信小组<br/>');
			}
			//REMUX
			if (/(HDH|Dream)$/i.test(title_lowercase) && [4].includes(type)) {
				$('#editor-tooltips').append('可替代：不受信小组<br/>');
			}
			//WEB
			if (/(HDHWEB)$/i.test(title_lowercase) && [1].includes(type)) {
				$('#editor-tooltips').append('可替代：不受信小组<br/>');
			}
		}

		//豆瓣判断
		// 函数：获取对应豆瓣内容
		function findDouban(searchText) {
			var result = null; // 存储找到的结果

			// 遍历所有的p元素
			douban_raw.find('p').each(function() {
				// 获取当前.peer元素中的.text-title和.text-content
				var textTitle = $(this).find('.text-title').text().trim();
				var textContent = $(this).find('.text-content').text()
					.trim(); // 使用.html()以保留内部HTML结构，如链接

				// 检查.text-title是否包含搜索的文本
				if (textTitle.includes(searchText)) {
					result = textContent;
					return false; // 找到匹配后退出循环
				}
			});

			return result; // 返回结果，如果没有找到匹配项，则为null
		}


		// 豆瓣判断
		var douban_area, douban_cat;
		var isshow, isdoc, isani;
		if (douban) {

			var douban_genres = findDouban('类别') || '';
			if (douban_genres.includes('真人秀')) {
				isshow = 1;
			}
			if (douban_genres.includes('纪录片')) {
				isdoc = 1;
			}
			if (douban_genres.includes('动画')) {
				isani = true;
			}
			var douban_type = (findDouban('类型') || '').split(" / ")[0];
			var country = (findDouban('产地') || '').split(" / ")[0];
			console.log('country' + country); // 打印找到的内容或null

			// 定义包含所有欧美国家的数组
			const europeanAndAmericanCountries = [
				'阿尔巴尼亚', '爱尔兰', '爱沙尼亚', '安道尔', '奥地利', '白俄罗斯', '保加利亚',
				'北马其顿', '比利时', '冰岛', '波黑', '波兰', '丹麦', '德国', '法国',
				'梵蒂冈', '芬兰', '荷兰', '黑山', '捷克', '克罗地亚', '拉脱维亚', '立陶宛',
				'列支敦士登', '卢森堡', '罗马尼亚', '马耳他', '摩尔多瓦', '摩纳哥', '挪威',
				'葡萄牙', '瑞典', '瑞士', '塞尔维亚', '塞浦路斯', '圣马力诺', '斯洛伐克',
				'斯洛文尼亚', '乌克兰', '西班牙', '希腊', '匈牙利', '意大利', '英国',
				'安提瓜和巴布达', '巴巴多斯', '巴哈马', '巴拿马', '伯利兹', '多米尼加', '多米尼克',
				'格林纳达', '哥斯达黎加', '古巴', '海地', '洪都拉斯', '加拿大', '美国', '墨西哥',
				'尼加拉瓜', '萨尔瓦多', '圣基茨和尼维斯', '圣卢西亚', '圣文森特和格林纳丁斯',
				'特立尼达和多巴哥', '危地马拉', '牙买加', '阿根廷', '巴拉圭', '巴西', '秘鲁',
				'玻利维亚', '厄瓜多尔', '哥伦比亚', '圭亚那', '苏里南', '委内瑞拉', '乌拉圭', '智利', '捷克斯洛伐克'
			];

			if (douban_type === '电视剧') {
				if (isshow) {
					douban_cat = 403;
				} else if (isdoc) {
					douban_cat = 404;
				} else {
					douban_cat = 402;
				}
			} else {
				if (isdoc) {
					douban_cat = 404;
				} else {
					douban_cat = 409;
				}
			}

			if (cat && douban_cat && douban_cat >= 401 && douban_cat <= 408 && douban_cat !== cat) {
				$('#assistant-tooltips').append("豆瓣检测分类为" + cat_constant[douban_cat] + "，选择分类为" + cat_constant[
					cat] + '<br/>');
				error = true;
			}

			if (!isani && is_anime) {
				$('#assistant-tooltips').append('选择「动画」标签，豆瓣未识别到「动画」类别<br/>');
				error = true;
			}
		}

		//显示结果
		if (error) {
			$('#assistant-tooltips').css('background', 'red');
		} else {
			$('#assistant-tooltips').append('此种子未检测到异常');
			$('#assistant-tooltips').css('background', 'green');
		}

	}

	// ---------------------------------------------------
	// 只有种审需要下面的功能捏
	// ---------------------------------------------------
	if (isEditor) {
		// ===========================================
		// 调用函数，移动包含特定文本“相关资源”的tr到表格顶端
		// ===========================================
		function updateRowAndToggleImage(searchText) {
			// 获取页面中所有的tr元素
			const trElements = document.querySelectorAll('tr');

			// 遍历所有tr元素
			trElements.forEach(tr => {
				// 在当前tr中查找所有td元素
				const tdElements = tr.querySelectorAll('td.rowhead.nowrap');

				// 遍历这些td元素
				tdElements.forEach(td => {
					// 检查td元素的文本内容是否为searchText（传入的参数）
					if (td.textContent.trim() === searchText) {
						// 检查是否存在img元素且其类名包含'minus'
						const img = td.querySelector('img.minus');
						if (img) {
							// 将img的类名改为'plus'
							img.className = 'plus';
						}

						// 获取这个tr的父表格
						const table = tr.closest('table');
						if (table) {
							// 将这个tr移动到表格的最顶端
							table.insertBefore(tr, table.firstChild);
						}

						// 找到id为'krelated'的div并清除其style属性
						const relatedDiv = document.getElementById('krelated');
						if (relatedDiv) {
							relatedDiv.style = "display: none;";
						}
					}
				});
			});
		}

		if (window.location.href.includes("/details.php?")) {
			updateRowAndToggleImage("相关资源");
		}
	}


	// ===========================================
	// 2. << 添加隐藏已审按钮和 torrents.php 页面下的功能 >>
	// ===========================================
	// 添加隐藏已审按钮和 torrents.php 页面下的功能
	function enhanceTorrentsPage() {

		let buttonTop = 10; // 初始按钮位置
		const buttonSpacing = 30; // 按钮间隔

		// 按钮配置
		const buttons = [{
				text: '隐藏已审',
				action: () => {
					// 隐藏已审的行
					jQuery('span[title="通过"]').closest('table').closest('tr').hide();
				}
			},
			{
				text: '显示所有',
				action: () => jQuery('table.torrents tr').show()
			},
		];

		// 创建按钮和输入框
		buttons.forEach(btn => createButton(btn.text, btn.action));

		function createButton(text, onClickFunction) {
			const button = document.createElement('button');
			button.textContent = text;
			button.style.cssText = `position:fixed;top:${buttonTop}px;right:10px;z-index:1000;`;
			document.body.appendChild(button);
			button.onclick = onClickFunction;
			buttonTop += buttonSpacing;
		}

		function createInput(placeholder, localStorageKey) {
			const input = document.createElement('input');
			input.type = 'text';
			input.placeholder = placeholder;
			input.style.cssText = `position:fixed;top:${buttonTop}px;right:10px;z-index:1000;width:120px;`;
			document.body.appendChild(input);
			input.value = localStorage.getItem(localStorageKey) || '';
			input.addEventListener('input', () => {
				localStorage.setItem(localStorageKey, input.value);
			});
			buttonTop += buttonSpacing;
			return input;
		}
	}

	if (window.location.href.includes("/torrents.php")) {
		enhanceTorrentsPage();
	}
})();