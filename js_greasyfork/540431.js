// ==UserScript==
// @name         PikPak 更多交互功能 新标签页打开 复制文件名 统计 More interactive function
// @namespace    https://greasyfork.org/zh-CN/users/722555-vveishu
// @version      2.2.3
// @description  PikePak 为导航和文件列表添加新标签页打开按钮、复制文件/文件夹名按钮 统计文件(夹)数 Open in new tab, Copy file/folder name
// @author       vvei
// @match        https://mypikpak.com/s/*
// @icon         http://mypikpak.com/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540431/PikPak%20%E6%9B%B4%E5%A4%9A%E4%BA%A4%E4%BA%92%E5%8A%9F%E8%83%BD%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%20%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6%E5%90%8D%20%E7%BB%9F%E8%AE%A1%20More%20interactive%20function.user.js
// @updateURL https://update.greasyfork.org/scripts/540431/PikPak%20%E6%9B%B4%E5%A4%9A%E4%BA%A4%E4%BA%92%E5%8A%9F%E8%83%BD%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%20%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6%E5%90%8D%20%E7%BB%9F%E8%AE%A1%20More%20interactive%20function.meta.js
// ==/UserScript==

(function ($) {
	'use strict';

	// 添加 Material Symbols Outlined 样式表
	$('head').append(
		$('<link>', {
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=content_copy,open_in_new'
		})
	);
	// 添加 CSS 样式
	$('<style>').text(`
        .folder-navigator{
            >ul>li>.pp-link-button{
                padding-right: 0;
            }
            .copy-name{
                font-size: 1.5em;
            }
            .open_in_new{
                font-size: 1.5em;
                height: 36px;
                min-width: 1em;
                margin: 0 8px;
                align-items: center;
                line-height: 36px;
                text-decoration: none;
            }
        }
        .custom-alert {
            position: fixed;
            padding: 3px 0.5em;
            background: #333C;
            color: #fff;
            border: 1px solid #5f5;
            border-radius: 5px;
            z-index: 9000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        .grid-operation.folder-CM8m{
            display:block!important;
            >.pp-link-button>.pp-icon{
                color: #000!important;
            }
            >.pp-link-button.pp-link-button.pp-link-button {
                top: 40px;
                background-color: #fff7;
            }
            >.open_in_new {
                position: absolute;
                min-width: 24px;
                height: 24px;
                top: 8px;
                right: 8px;
            }
        }
        #统计 {
            position: fixed;
            left: 500px;
            padding: 0.5em;
            background-color: #FFFD;
            z-index: 1000;
            .统计值 {
                font-size: 2em;
                font-weight: bold;
            }
            ul {
                padding-inline-start: 0.5em;
            }
            li {
                margin: 5px 0;
                list-style-type: none;
            }
        }
    `).appendTo('head');
	// 获取当前页面 url
	const $canonical = $('link[rel="canonical"]').attr('href');
	// 执行时间逻辑
	// 延迟1.5秒执行
	setTimeout(() => {
		// 初始化处理
		const $navLis = $('.folder-navigator > ul').first().children('li')
		const $grids = $('.file-list').first().children('.grid')
		navCopys($navLis);
		fileCopy($grids);
		navAddLink($navLis);
		fileListAddLink($grids);
		统计div();
		// 监听导航列表变化
		new MutationObserver(mutations => {
			mutations.forEach(m => {
				m.addedNodes.forEach(node => {
					navCopy($(node));
					navAddLink($(node));
				});
				m.removedNodes.length && $('.folder-navigator > ul').first().children('li').last().find('.open_in_new').remove();
			});
		}).observe(document.querySelector('.folder-navigator > ul'), { childList: true });
		// 间隔1秒循环执行3次 file-list 添加链接，之后再次 统计div 并开始监听 file-list
		let checkCount = 0;
		const fileListInterval = setInterval(() => {
			fileListAddLink($grids);
			if (++checkCount >= 3) {
				clearInterval(fileListInterval);
				统计div();
				observeFileList();
			}
		}, 1000);
		// 监听 file-list 变化的函数
		function observeFileList() {
			new MutationObserver(mutations => {
				mutations.forEach(m => {
					m.addedNodes.forEach(node => {
						fileCopy($(node));
						fileListAddLink($(node));
					});
					统计div();
				});
			}).observe(document.querySelector('.file-list'), { childList: true });
		}
	}, 1500);
	// 导航添加复制文本按钮
	function navCopys($navLis) {
		// 排除第一个li
		$navLis.slice(1).find('.pp-link-button').each(function () {
			addCopy($(this), 'content_copy');
		});
	}
	function navCopy($navLi) {
		$navLi.find('.pp-link-button').each(function () {
			addCopy($(this), 'content_copy');
		});
	}
	// file-list 添加复制文本按钮
	function fileCopy($grids) {
		$grids.find('.name').each(function () {
			const $ell = $(this).children('.ellipsis').first();
			addCopy($ell, 'content_copy');
		});
	}
	// 模块化添加复制文本按钮的功能
	function addCopy($element, buttonText) {
		$element.after(
			$('<span>', {
				class: 'copy-name material-symbols-outlined',
				text: buttonText,
			}).on('click', function (event) {
				const textToCopy = $element.text();
				navigator.clipboard.writeText(textToCopy).then(() => {
					// 创建自定义的提示框
					const alertBox = $('<div>', {
						class: 'custom-alert',
						text: '已复制文本: ' + textToCopy,
					}).appendTo('body');
					// 设置提示框的位置
					alertBox.css({
						top: event.pageY + parseFloat(getComputedStyle(document.body).fontSize) + 'px',
						left: event.pageX + 'px'
					});
					// 3秒后自动关闭提示框
					setTimeout(function () {
						alertBox.remove();
					}, 3000);
				}).catch(err => console.error('复制失败: ', err)); // 复制失败后的处理，可选
			})
		);
	}
	// 导航添加新标签页打开链接
	function navAddLink($navLis) {
		$navLis.prev().each(function () {
			const $li = $(this);
			$li.append(
				$('<a>', {
					href: $li.children('.pp-link-button').first().attr('href'),
					target: '_blank',
					class: 'open_in_new material-symbols-outlined',
					text: 'open_in_new'
				})
			);
		});
	}
	// file-list 添加新标签页打开链接
	function fileListAddLink($grids) {
		$grids.each(function () {
			const $grid = $(this);
			// 判断 .folder-cover 存在
			if ($grid.has('.folder-cover').length) {
				// .pp-link-button 通过 css 下移
				const $operation = $grid.find('.grid-operation').first();
				$operation.hasClass('folder-CM8m') || $operation.addClass('folder-CM8m');
				// 添加按钮
				const $openInNew = $grid.find('.open_in_new').first();
				if (!$openInNew.length) {
					$operation.append(
						$('<a>', { href: $canonical + '/' + $grid.attr('id'), target: '_blank', class: 'open_in_new' }).append(
							$('<span>', { class: 'material-symbols-outlined', text: 'open_in_new' })
						)
					);
				}
			}
		});
	}
	// 统计文件（夹）数量
	function 统计div() {
		const 总数 = $grids.length;
		let 统计div;
		if (document.querySelector('body > div#统计')) {
			统计div = $('body>div#统计');
			统计div.empty(); // 清空旧统计
		} else {
			统计div = $('<div>', { id: '统计' })
			$('body').append(统计div);
		}
		// 输出统计
		if (总数 === 0) 统计div.text('空文件夹')
		else {
			const 文件夹数 = $grids.has('.folder-cover').length;
			const 文件组 = $grids.has('.file-cover');
			const 文件数 = 文件组.length;
			if (文件夹数 + 文件数 === 总数) {
				统计div.append($('<p>').append('共', $('<span>', { class: '统计值' }).text(总数), '个'))
				if (文件夹数 > 0) 统计div.append($('<p>').append('文件夹', $('<span>', { class: '统计值' }).text(文件夹数), '个'))
				if (文件数 > 0) {
					统计div.append($('<p>').append('文件', $('<span>', { class: '统计值' }).text(文件数), '个'))
					let 加载完成 = true;
					文件组.each(function () {
						const 文件名 = $(this).attract('aria-label');
						if (文件名 === '******') {
							加载完成 = false;
							return false;
						}
					});
					function 分类统计(扩展名) {
						let 计数 = 0;
						文件组.each(function () {
							const 文件名 = $(this).attract('aria-label');
							文件名.endsWith(扩展名) && 计数++;
						});
						return 计数;
					}
					if (加载完成) {
						const 视频扩展名 = ['mp4', '.webm', '.avi', '.mkv', '.wmv', '.flv', '.mov', '.mpg', '.mpeg', '.mpe', '.asf', '.qt', '.rm', '.m4v', '.ogv', '.ogg', '.ts', '.tsv'];
						const 图片扩展名 = ['.png', '.jpg', '.webp', '.gif', '.jpeg', '.svg'];
						const 音频扩展名 = ['.mp3', '.flac', '.ape', '.wma', '.ogg', '.wav', '.aac', '.m4a', '.oga', '.ac3', '.amr'];
						const 视频数 = 分类统计(视频扩展名);
						const 图片数 = 分类统计(图片扩展名);
						const 音频数 = 分类统计(音频扩展名);
						const 其他数 = 文件数 - 视频数 - 图片数 - 音频数;
						return { 视频数, 图片数, 音频数, 其他数 };
					}
					if (加载完成) {
						const 文件ul = $('<ul>');
						统计div.append(文件ul);
						if (视频数 > 0) 文件ul.append($('<li>').append('视频', $('<span>', { class: '统计值' }).text(视频数), '个'))
						if (图片数 > 0) 文件ul.append($('<li>').append('图片', $('<span>', { class: '统计值' }).text(图片数), '个'))
						if (音频数 > 0) 文件ul.append($('<li>').append('音频', $('<span>', { class: '统计值' }).text(音频数), '个'))
						if (其他数 > 0) 文件ul.append($('<li>').append('其他', $('<span>', { class: '统计值' }).text(其他数), '个'))
					}
				}
			} else 统计div.text('页面加载有缺漏<br>请刷新');
		}
	}
})(jQuery);