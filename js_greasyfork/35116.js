// ==UserScript==
// @name              MRLookup
// @namespace         vanabeljs
// @description       Extract BibTeX data automatically and modify BibTeX Key to AUTHOR_YEAR_TITLE.
// @description:ZH-CN 自动提取BibTeX数据并修改BibTeX关键字为AUTHOR_YEAR_TITLE的形式.
// @author            Van Abel
// @copyright         2018, Van Abel (https://home.vanabel.cn)
// @license           OSI-SPDX-Short-Identifier
// @version           3.0.5
// @include           */mathscinet/search/publications.html?fmt=bibtex*
// @include           */mathscinet/clipboard.html
// @include           */mrlookup
// @include           https://mathscinet.ams.org/*
// @exclude           https://github.com/*
// @exclude           https://*.github.com/*
// @exclude           https://*.github.io/*
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_registerMenuCommand
// @grant            GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/35116/MRLookup.user.js
// @updateURL https://update.greasyfork.org/scripts/35116/MRLookup.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author Van Abel
// ==/OpenUserJS==

/**
 * Webhook test: Testing automatic sync to Greasy Fork
 */

/*The first word to ignore in title*/
var IgnoreStringInTitle = [
	'a',
	'an',
	'on',
	'the',
	'another'
];
function IgnoreStringToRegExp(arr) {
	var regexp = '^(';
	var arrlen = arr.length;
	for (var i = 0; i < arrlen; i++) {
		if (i == arrlen - 1) {
			regexp += '(' + arr[i] + ')';
		} else {
			regexp += '(' + arr[i] + ')|';
		}
	}
	regexp += ')\\s+';
	return regexp;
}//console.log(IgnoreStringToRegExp(IgnoreStringInTitle));
/*split bibdata*/

function parseBibTexLine(text) {
	try {
		var m = text.match(/^\s*(\S+)\s*=\s*/);
		if (!m) {
			console.error('Invalid line format:', text);
			return null;
		}
		var name = m[1];
		var search = text.slice(m[0].length);
		var re = /[\n\r,{}]/g;
		var braceCount = 0;
		var length = m[0].length;
		do {
			m = re.exec(search);
			if (!m) break;
			if (m[0] === '{') {
				braceCount++;
			} else if (m[0] === '}') {
				if (braceCount === 0) {
					throw new Error('Unexpected closing brace: "}"');
				}
				braceCount--;
			}
		} while (braceCount > 0);
		return {
			field: name,
			value: search.slice(0, re.lastIndex),
			length: length + re.lastIndex + (m ? m[0].length : 0)
		};
	} catch (error) {
		console.error('Error parsing BibTeX line:', error);
		return null;
	}
}
function parseBibTex(text) {
	var m = text.match(/^\s*@([^{]+){([^,\n]+)[,\n]/);
	if (!m) {
		throw new Error('Unrecogonised header format');
	}
	var result = {
		typeName: m[1].trim(),
		citationKey: m[2].trim()
	};
	text = text.slice(m[0].length).trim();
	while (text[0] !== '}') {
		var pair = parseBibTexLine(text);
		if (!pair) break;
		// Convert field name to lowercase for consistency
		result[pair.field.toLowerCase()] = pair.value;
		text = text.slice(pair.length).trim();
	}
	return result;
}

function cleanAuthorName(author) {
	if (!author) return '';
	
	// 分割多个作者
	let authors = author.split(/\s*and\s*/);
	// 获取所有作者的姓
	let lastNames = authors.map(author => {
		// 提取姓（通常是逗号前的部分）
		let lastName = author.split(',')[0];
		// 对于复合姓氏，取最后一部分
		let nameParts = lastName.split(/\s+/);
		let finalLastName = nameParts[nameParts.length - 1];
		// 清理特殊字符
		return finalLastName.replace(/[{}\\\s\'"`]/g, '');
	});
	// 拼接所有作者的姓
	return lastNames.join('');
}

function cleanTitle(title) {
	if (!title) return '';
	
	// 移除LaTeX命令和数学符号
	title = title.replace(/\\[a-zA-Z]+/g, '')          // 移除LaTeX命令
		  .replace(/\$[^$]*\$/g, '')                   // 移除数学公式
		  .replace(/[{}\\\'"`]/g, '')                  // 移除特殊字符
		  .replace(/\{[^}]*\}/g, '');                  // 移除花括号内容
	
	// 按空格、连字符和标点符号分割成单词
	let words = title.split(/[\s\-,.:;]+/)
		.filter(word => word.length > 0)               // 移除空字符串
		.map(word => word.replace(/[^a-zA-Z]/g, '')); // 只保留字母
	
	// 找到第一个有意义的单词
	for (let word of words) {
		// 转换为小写进行比较
		let lowercaseWord = word.toLowerCase();
		// 检查是否是忽略词或单个字母
		if (!IgnoreStringInTitle.includes(lowercaseWord) && 
			word.length > 1 && 
			!/^\d+$/.test(word)) {  // 排除纯数字
			// 转换为首字母大写
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		}
	}
	
	// 如果没有找到合适的单词，返回空字符串
	return '';
}

// Configuration
const CONFIG = {
	useJournal: GM_getValue('useJournal', true),  // Default use journal abbreviation
	debug: GM_getValue('debug', false)  // Debug mode
};

// Test data for debug mode
const DEFAULT_TEST_DATA = `@misc{chen2014l2modulispacessymplecticvortices,
      title={$L^2$-moduli spaces of symplectic vortices on Riemann surfaces with cylindrical ends}, 
      author={Bohui Chen and Bai-Ling Wang},
      year={2014},
      eprint={1405.6387},
      archivePrefix={arXiv},
      primaryClass={math.SG},
      url={https://arxiv.org/abs/1405.6387}, 
}`;

// Get stored test data or use default
let TEST_DATA = GM_getValue('testData', DEFAULT_TEST_DATA);

// Function to update test data
function updateTestData(newData) {
	TEST_DATA = newData;
	GM_setValue('testData', newData);
}

// 注册菜单命令
GM_registerMenuCommand('Toggle Journal/Title Mode', function() {
	const currentMode = GM_getValue('useJournal', true);
	const newMode = !currentMode;
	GM_setValue('useJournal', newMode);
	CONFIG.useJournal = newMode;
	
	// 显示当前模式
	const modeText = newMode ? 'Journal Mode' : 'Title Mode';
	alert('Switched to ' + modeText);
	
	// 刷新页面以应用新设置
	location.reload();
});

// Add status indicator
function addStatusIndicator() {
	// Remove existing indicator if any
	const existingIndicator = document.getElementById('mode-indicator');
	if (existingIndicator) {
		existingIndicator.remove();
	}

	const indicator = document.createElement('div');
	indicator.id = 'mode-indicator';
	indicator.style.cssText = `
		position: fixed;
		top: 8px;
		right: 8px;
		padding: 3px 6px;
		background: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 12px;
		font-weight: bold;
		z-index: 9999;
		cursor: pointer;
		user-select: none;
		margin-bottom: 3px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.2);
		min-width: 80px;
		text-align: center;
	`;
	indicator.textContent = CONFIG.useJournal ? 'Mode: Journal' : 'Mode: Title';
	
	// Add click handler to toggle mode
	indicator.addEventListener('click', function() {
		const currentMode = GM_getValue('useJournal', true);
		const newMode = !currentMode;
		GM_setValue('useJournal', newMode);
		CONFIG.useJournal = newMode;
		
		// Update indicator text
		this.textContent = newMode ? 'Mode: Journal' : 'Mode: Title';
		
		// Update citation keys immediately
		updateBibTeXEntries();
	});
	
	document.body.appendChild(indicator);
}

// Function to update all BibTeX entries
function updateBibTeXEntries() {
	const els = document.getElementsByTagName('pre');
	for (let i = 0; i < els.length; i++) {
		try {
			const el = els[i];
			const bibdata = parseBibTex(el.innerHTML);
			if (!bibdata) continue;

			// Extract author
			const author = cleanAuthorName(bibdata.author);
			
			// Extract year
			let year = '';
			if (bibdata.year) {
				let yearMatch = bibdata.year.match(/\d{4}/);
				if (yearMatch) {
					year = yearMatch[0];
				}
			}
			
			// Get identifier based on current mode
			let identifier = '';
			if (CONFIG.useJournal && bibdata.journal) {
				identifier = getJournalAbbrev(bibdata.journal);
				if (!identifier) {
					identifier = cleanTitle(bibdata.title);
				}
			} else {
				identifier = cleanTitle(bibdata.title);
			}
			
			// Create new BibTeX key
			const bibkey = author + year + identifier;
			
			// Replace the citation key in the original text
			const originalText = el.innerHTML;
			const newText = originalText.replace(/@([^{]+){([^,\n]+)[,\n]/, `@$1{${bibkey},`);
			
			// Update the content
			el.innerHTML = newText;
			
			// Add click to copy functionality if not already present
			if (!el.hasAttribute('data-click-handler')) {
				el.setAttribute('data-click-handler', 'true');
				el.addEventListener('click', function() {
					try {
						var bibdata_lb = this.innerHTML
							.replace(/\r|\n/g, '\r\n')
							.replace(/^\r\n/g, '')
							.replace(/\s*$/g, '\r\n')
							.replace(/\r\n\r\n/g, '\r\n');
						GM_setClipboard(bibdata_lb);
					} catch (error) {
						console.error('Error copying to clipboard:', error);
					}
				});
			}
		} catch (error) {
			console.error('Error updating BibTeX entry:', error);
		}
	}
}

// 在页面加载完成后添加状态指示器
window.addEventListener('load', function() {
	addStandardizeButton();
	addStatusIndicator();
	addDebugToggle();
	addTestDataButton();
	
	// 检测新AMS MathSciNet网站的引用格式弹窗
	if (isNewAMSSite()) {
		handleNewAMSSite();
	} else {
		// Update all BibTeX entries on page load for old site
		updateBibTeXEntries();
	}
});

// 检测是否为新AMS MathSciNet网站
function isNewAMSSite() {
	return window.location.hostname === 'mathscinet.ams.org' && 
		   window.location.pathname.includes('/mathscinet/');
}

// 处理新AMS MathSciNet网站
function handleNewAMSSite() {
	// 监听引用格式弹窗的出现
	observeCitationModal();
	
	// 为现有的引用格式弹窗添加功能
	enhanceExistingCitationModals();
	
	// 添加定期检查机制，确保捕获到动态创建的弹窗
	setupPeriodicCheck();
}

// 设置定期检查机制
function setupPeriodicCheck() {
	// 每2秒检查一次是否有新的弹窗
	const checkInterval = setInterval(function() {
		// 查找所有未增强的弹窗
		const unenhancedModals = document.querySelectorAll('.modal-content:not([data-enhanced]), [id*="modal"]:not([data-enhanced])');
		
		if (unenhancedModals.length > 0) {
			unenhancedModals.forEach(function(modal) {
				const textarea = modal.querySelector('#citationText');
				if (textarea) {
					enhanceCitationModal(modal);
				}
			});
		}
		
		// 也检查是否有新的文本区域
		const allTextareas = document.querySelectorAll('#citationText');
		allTextareas.forEach(function(textarea) {
			const modal = textarea.closest('.modal-content, [id*="modal"], [class*="modal"]');
			if (modal && !modal.hasAttribute('data-enhanced')) {
				enhanceCitationModal(modal);
			}
		});
		
		// 检查已增强的弹窗中的BibTeX内容是否需要标准化
		const enhancedModals = document.querySelectorAll('.modal-content[data-enhanced], [id*="modal"][data-enhanced]');
		enhancedModals.forEach(function(modal) {
			const textarea = modal.querySelector('#citationText');
			const formatSelect = modal.querySelector('select[name="Select citation format"]');
			
			if (textarea && formatSelect && formatSelect.value === 'bibtex') {
				const content = textarea.value.trim();
				if (content && content.startsWith('@') && content.includes('{') && content.includes('}')) {
					// 检查是否需要标准化
					try {
						const bibdata = parseBibTex(content);
						if (bibdata && bibdata.author && bibdata.year) {
							const expectedKey = generateExpectedKey(bibdata);
							if (bibdata.citationKey !== expectedKey) {
								const newBibtex = generateStandardizedBibTeX(bibdata);
								if (newBibtex && newBibtex !== content) {
									textarea.value = newBibtex;
									showSuccessMessage(modal, 'BibTeX已自动标准化！');
								}
							}
						}
					} catch (error) {
						console.error('定期检查标准化时出错:', error);
					}
				}
			}
		});
	}, 2000);
	
	// 存储interval ID，以便后续清理
	window._mrlookupCheckInterval = checkInterval;
}

// 手动触发标准化（用于调试和手动操作）
function manualTriggerStandardization(modal) {
	const textarea = modal.querySelector('#citationText');
	const formatSelect = modal.querySelector('select[name="Select citation format"]');
	
	if (textarea && formatSelect) {
		const content = textarea.value.trim();
		
		if (content && content.startsWith('@') && content.includes('{') && content.includes('}')) {
			try {
				const bibdata = parseBibTex(content);
				if (bibdata && bibdata.author && bibdata.year) {
					const expectedKey = generateExpectedKey(bibdata);
					
					if (bibdata.citationKey !== expectedKey) {
						const newBibtex = generateStandardizedBibTeX(bibdata);
						if (newBibtex && newBibtex !== content) {
							textarea.value = newBibtex;
							showSuccessMessage(modal, 'BibTeX已手动标准化！');
							return true;
						}
					}
				}
			} catch (error) {
				console.error('手动触发标准化时出错:', error);
			}
		}
	}
	
	return false;
}

// 在弹窗中添加手动触发按钮（用于调试）
function addManualTriggerButton(modal) {
	// 查找按钮容器
	const buttonContainer = modal.querySelector('.modal-footer');
	if (!buttonContainer) return;
	
	// 检查是否已经有手动按钮
	if (modal.querySelector('#manual-trigger-btn')) return;
	
	// 创建手动触发按钮
	const manualBtn = document.createElement('button');
	manualBtn.id = 'manual-trigger-btn';
	manualBtn.textContent = 'Manual Standardize';
	manualBtn.className = 'btn btn-warning';
	manualBtn.style.cssText = `
		margin-right: 10px;
		background-color: #ffc107;
		border-color: #ffc107;
		color: #212529;
		font-size: 12px;
		padding: 4px 8px;
	`;
	
	manualBtn.addEventListener('click', function() {
		manualTriggerStandardization(modal);
	});
	
	// 在关闭按钮前插入手动按钮
	const closeBtn = buttonContainer.querySelector('button[name="Close button"]');
	if (closeBtn) {
		buttonContainer.insertBefore(manualBtn, closeBtn);
	} else {
		buttonContainer.appendChild(manualBtn);
	}
}

// 监听引用格式弹窗的出现
function observeCitationModal() {
	const observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach(function(node) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						// 检查是否包含引用格式弹窗
						if (node.querySelector && node.querySelector('#citationText')) {
							enhanceCitationModal(node);
						}
						// 检查子元素
						const citationTextarea = node.querySelector('#citationText');
						if (citationTextarea) {
							enhanceCitationModal(node);
						}
						
						// 检查是否是新添加的弹窗容器
						if (node.classList && node.classList.contains('modal-content')) {
							// 延迟检查，等待内容加载
							setTimeout(() => {
								const textarea = node.querySelector('#citationText');
								if (textarea) {
									enhanceCitationModal(node);
								}
							}, 100);
						}
					}
				});
			}
		});
	});
	
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
	
	// 也监听属性变化，因为弹窗可能通过显示/隐藏来工作
	const attributeObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type === 'attributes' && 
				(mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
				
				const target = mutation.target;
				// 检查是否是弹窗相关的元素
				if (target.id && target.id.includes('modal') || 
					target.classList && target.classList.contains('modal-content')) {
					
					// 延迟检查，等待内容完全加载
					setTimeout(() => {
						const textarea = target.querySelector('#citationText');
						if (textarea && !target.hasAttribute('data-enhanced')) {
							enhanceCitationModal(target);
						}
					}, 200);
				}
			}
		});
	});
	
	attributeObserver.observe(document.body, {
		attributes: true,
		subtree: true,
		attributeFilter: ['style', 'class']
	});
}

// 增强现有的引用格式弹窗
function enhanceExistingCitationModals() {
	// 查找所有可能的弹窗容器
	const possibleModals = document.querySelectorAll('.modal-content, [id*="modal"], [class*="modal"]');
	
	possibleModals.forEach(function(modal) {
		const citationTextareas = modal.querySelectorAll('#citationText');
		
		citationTextareas.forEach(function(textarea) {
			if (modal && !modal.hasAttribute('data-enhanced')) {
				enhanceCitationModal(modal);
			}
		});
	});
	
	// 也直接查找文本区域
	const citationTextareas = document.querySelectorAll('#citationText');
	
	citationTextareas.forEach(function(textarea) {
		const modal = textarea.closest('.modal-content, [id*="modal"], [class*="modal"]');
		if (modal && !modal.hasAttribute('data-enhanced')) {
			enhanceCitationModal(modal);
		}
	});
}

// 增强引用格式弹窗
function enhanceCitationModal(modal) {
	if (modal.hasAttribute('data-enhanced')) {
		return;
	}
	
	modal.setAttribute('data-enhanced', 'true');
	
	// 查找引用文本区域
	const citationTextarea = modal.querySelector('#citationText');
	if (!citationTextarea) {
		return;
	}
	
	// 监听引用格式变化（自动标准化）
	observeCitationFormatChange(modal);
	
	// 监听文本区域内容变化（实时标准化）
	observeTextareaContentChange(modal, citationTextarea);
	
	// 添加手动触发按钮
	addManualTriggerButton(modal);
}

// 在引用格式弹窗中添加标准化按钮（已移除，改为自动标准化）
function addStandardizeButtonToModal(modal, textarea) {
	// 此函数已不再使用，保留以避免引用错误
	console.log('自动标准化模式已启用，无需手动按钮');
}

// 监听引用格式变化
function observeCitationFormatChange(modal) {
	const formatSelect = modal.querySelector('select[name="Select citation format"]');
	if (formatSelect) {
		// 移除可能存在的旧监听器
		if (formatSelect._changeHandler) {
			formatSelect.removeEventListener('change', formatSelect._changeHandler);
		}
		
		// 创建新的监听器
		formatSelect._changeHandler = function() {
			// 当格式改变时，等待内容加载完成
			setTimeout(function() {
				const textarea = modal.querySelector('#citationText');
				if (textarea && textarea.value.trim()) {
					// 如果选择了BibTeX格式，自动标准化
					if (this.value === 'bibtex') {
						setTimeout(function() {
							try {
								const currentContent = textarea.value.trim();
								
								const bibdata = parseBibTex(currentContent);
								if (bibdata) {
									const newBibtex = generateStandardizedBibTeX(bibdata);
									if (newBibtex && newBibtex !== currentContent) {
										textarea.value = newBibtex;
										// 显示成功消息
										showSuccessMessage(modal, 'BibTeX已自动标准化！');
									}
								}
							} catch (error) {
								console.error('自动标准化BibTeX时出错:', error);
							}
						}, 500); // 等待内容加载
					}
				}
			}, 100);
		};
		
		formatSelect.addEventListener('change', formatSelect._changeHandler);
		
		// 如果当前已经是BibTeX格式，立即尝试标准化
		if (formatSelect.value === 'bibtex') {
			setTimeout(() => {
				const textarea = modal.querySelector('#citationText');
				if (textarea && textarea.value.trim()) {
					formatSelect._changeHandler.call(formatSelect);
				}
			}, 100);
		}
	}
}

// 监听文本区域内容变化，实现实时标准化
function observeTextareaContentChange(modal, textarea) {
	// 使用MutationObserver监听内容变化
	const observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type === 'childList' || mutation.type === 'characterData') {
				// 检查是否包含有效的BibTeX内容
				const content = textarea.value.trim();
				if (content && content.startsWith('@') && content.includes('{') && content.includes('}')) {
					// 延迟执行，避免频繁触发
					setTimeout(function() {
						autoStandardizeIfNeeded(modal, textarea, content);
					}, 300);
				}
			}
		});
	});
	
	// 监听文本区域的变化
	observer.observe(textarea, {
		childList: true,
		characterData: true,
		subtree: true
	});
	
	// 也监听input事件（用户输入）
	textarea.addEventListener('input', function() {
		const content = this.value.trim();
		if (content && content.startsWith('@') && content.includes('{') && content.includes('}')) {
			// 延迟执行，避免频繁触发
			setTimeout(function() {
				autoStandardizeIfNeeded(modal, textarea, content);
			}, 500);
		}
	});
}

// 自动标准化检查
function autoStandardizeIfNeeded(modal, textarea, content) {
	try {
		// 检查是否已经是标准化格式
		const bibdata = parseBibTex(content);
		if (bibdata && bibdata.author && bibdata.year) {
			// 检查引用键是否已经是标准格式
			const expectedKey = generateExpectedKey(bibdata);
			
			if (bibdata.citationKey !== expectedKey) {
				// 需要标准化
				const newBibtex = generateStandardizedBibTeX(bibdata);
				if (newBibtex && newBibtex !== content) {
					textarea.value = newBibtex;
					// 显示成功消息
					showSuccessMessage(modal, 'BibTeX已自动标准化！');
				}
			}
		}
	} catch (error) {
		console.error('自动标准化检查时出错:', error);
	}
}

// 生成期望的引用键（用于检查是否需要标准化）
function generateExpectedKey(bibdata) {
	// 提取作者
	const author = cleanAuthorName(bibdata.author);
	
	// 提取年份
	let year = '';
	if (bibdata.year) {
		let yearMatch = bibdata.year.match(/\d{4}/);
		if (yearMatch) {
			year = yearMatch[0];
		}
	}
	
	// 获取标识符
	let identifier = '';
	if (CONFIG.useJournal && bibdata.journal) {
		identifier = getJournalAbbrev(bibdata.journal);
		if (!identifier) {
			identifier = cleanTitle(bibdata.title);
		}
	} else {
		identifier = cleanTitle(bibdata.title);
	}
	
	// 创建期望的引用键
	return author + year + identifier;
}

// 生成标准化的BibTeX
function generateStandardizedBibTeX(bibdata) {
	// 提取作者
	const author = cleanAuthorName(bibdata.author);
	
	// 提取年份
	let year = '';
	if (bibdata.year) {
		let yearMatch = bibdata.year.match(/\d{4}/);
		if (yearMatch) {
			year = yearMatch[0];
		}
	}
	
	// 获取标识符
	let identifier = '';
	if (CONFIG.useJournal && bibdata.journal) {
		identifier = getJournalAbbrev(bibdata.journal);
		if (!identifier) {
			identifier = cleanTitle(bibdata.title);
		}
	} else {
		identifier = cleanTitle(bibdata.title);
	}
	
	// 创建新的引用键
	const bibkey = author + year + identifier;
	
	// 清理值
	const cleanValue = (value) => {
		if (!value) return '';
		return value.replace(/^{|}$/g, '');
	};
	
	// 获取所有字段名
	const fieldNames = Object.keys(bibdata).filter(key => 
		key !== 'typeName' && key !== 'citationKey'
	).map(key => key.toUpperCase());
	
	// 找到最长的字段名用于对齐
	const maxLength = Math.max(...fieldNames.map(name => name.length));
	
	// 格式化字段
	const formatField = (name, value) => {
		const padding = ' '.repeat(maxLength - name.length);
		const cleanedValue = cleanValue(value);
		return `    ${name}${padding} = {${cleanedValue}},\n`;
	};
	
	// 标准化格式
	let standardized = `@${bibdata.typeName} {${bibkey},\n`;
	
	// 添加所有字段
	for (const field of fieldNames) {
		const value = bibdata[field.toLowerCase()];
		if (value) {
			standardized += formatField(field, value);
		}
	}
	
	// 移除尾随逗号并添加闭合括号
	standardized = standardized.replace(/,\n$/, '\n}');
	
	return standardized;
}

// 显示成功消息
function showSuccessMessage(modal, message) {
	showMessage(modal, message, 'success');
}

// 显示错误消息
function showErrorMessage(modal, message) {
	showMessage(modal, message, 'error');
}

// 显示消息
function showMessage(modal, message, type) {
	// 移除现有消息
	const existingMessage = modal.querySelector('.mrlookup-message');
	if (existingMessage) {
		existingMessage.remove();
	}
	
	// 创建消息元素
	const messageDiv = document.createElement('div');
	messageDiv.className = 'mrlookup-message';
	messageDiv.style.cssText = `
		position: absolute;
		top: 10px;
		right: 10px;
		padding: 8px 12px;
		border-radius: 4px;
		font-size: 12px;
		font-weight: bold;
		z-index: 1000;
		${type === 'success' ? 
			'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
			'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
		}
	`;
	messageDiv.textContent = message;
	
	// 添加到模态框
	modal.style.position = 'relative';
	modal.appendChild(messageDiv);
	
	// 3秒后自动移除
	setTimeout(function() {
		if (messageDiv.parentNode) {
			messageDiv.parentNode.removeChild(messageDiv);
		}
	}, 3000);
}

// 添加新的期刊处理函数
function getJournalAbbrev(journal) {
	if (!journal) return '';
	
	// 移除LaTeX命令和特殊字符
	journal = journal.replace(/\\[a-zA-Z]+/g, '')     // 移除LaTeX命令
		   .replace(/[{}\\\'"`]/g, '')                // 移除特殊字符
		   .replace(/\([^)]*\)/g, '')                 // 移除括号内容
		   .replace(/\{[^}]*\}/g, '')                 // 移除花括号内容
		   .trim();
	
	// 分割成单词
	let words = journal.split(/[\s.]+/).filter(word => word.length > 0);
	
	if (words.length === 1) {
		// 如果只有一个单词，取前三个字母并转为大写
		return words[0].slice(0, 3).toUpperCase();
	} else {
		// 多个单词时提取大写字母
		let abbrev = journal.match(/[A-Z]/g);
		return abbrev ? abbrev.join('') : '';
	}
}

/**
 * auto set bibtex item checked for mrlookup site
 */
var url = location.pathname;
if (url.includes('mrlookup')) {
	document.getElementsByName('format')[1].checked = true;
}

// Add button to standardize BibTeX
function addStandardizeButton() {
	const button = document.createElement('button');
	button.textContent = 'Standardize BibTeX';
	button.style.cssText = `
		position: fixed;
		top: 45px;
		right: 10px;
		padding: 5px 10px;
		font-size: 12px;
		background: #4CAF50;
		color: white;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		z-index: 9999;
		margin-bottom: 5px;
	`;
	button.addEventListener('click', standardizeBibTeX);
	document.body.appendChild(button);
}

// Add test data button when debug is on
function addTestDataButton() {
	// Remove existing test button if any
	const existingBtn = document.getElementById('test-data-btn');
	if (existingBtn) {
		existingBtn.remove();
	}
	
	// Only add button if debug mode is on
	if (!CONFIG.debug) return;
	
	const testBtn = document.createElement('button');
	testBtn.id = 'test-data-btn';
	testBtn.textContent = 'Test Data';
	testBtn.style.cssText = `
		position: fixed;
		top: 115px;
		right: 10px;
		padding: 5px 10px;
		font-size: 12px;
		background: #4CAF50;
		color: white;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		z-index: 9999;
		margin-bottom: 5px;
	`;
	testBtn.addEventListener('click', () => {
		// First open the dialog
		standardizeBibTeX();
		// Then fill it with test data
		setTimeout(() => {
			const textarea = document.querySelector('textarea');
			if (textarea) {
				textarea.value = TEST_DATA;
			}
		}, 100); // Small delay to ensure dialog is created
	});
	document.body.appendChild(testBtn);
}

// Add debug mode toggle
function addDebugToggle() {
	const debugBtn = document.createElement('button');
	debugBtn.textContent = CONFIG.debug ? 'Debug: ON' : 'Debug: OFF';
	debugBtn.style.cssText = `
		position: fixed;
		top: 80px;
		right: 10px;
		padding: 5px 10px;
		font-size: 12px;
		background: ${CONFIG.debug ? '#ff4444' : '#f0f0f0'};
		color: ${CONFIG.debug ? 'white' : 'black'};
		border: 1px solid #ccc;
		border-radius: 3px;
		cursor: pointer;
		z-index: 9999;
		margin-bottom: 5px;
	`;
	debugBtn.addEventListener('click', function() {
		CONFIG.debug = !CONFIG.debug;
		GM_setValue('debug', CONFIG.debug);
		this.textContent = CONFIG.debug ? 'Debug: ON' : 'Debug: OFF';
		this.style.background = CONFIG.debug ? '#ff4444' : '#f0f0f0';
		this.style.color = CONFIG.debug ? 'white' : 'black';
		
		// Update test data button visibility
		addTestDataButton();
	});
	document.body.appendChild(debugBtn);
}

// Show debug result
function showDebugResult(result) {
	if (!CONFIG.debug) return;
	
	// Remove existing debug result if any
	const existingResult = document.getElementById('debug-result');
	if (existingResult) {
		existingResult.remove();
	}
	
	// Create overlay
	const overlay = document.createElement('div');
	overlay.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		z-index: 10000;
	`;
	
	const resultDiv = document.createElement('div');
	resultDiv.id = 'debug-result';
	resultDiv.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.2);
		z-index: 10001;
		width: 80%;
		max-width: 800px;
		max-height: 80vh;
		overflow: auto;
	`;
	
	const pre = document.createElement('pre');
	pre.style.cssText = `
		white-space: pre-wrap;
		word-wrap: break-word;
		font-family: monospace;
		font-size: 14px;
		margin: 0;
		padding: 10px;
		background: #f8f8f8;
		border-radius: 3px;
	`;
	pre.textContent = result;
	
	const closeBtn = document.createElement('button');
	closeBtn.textContent = 'Close';
	closeBtn.style.cssText = `
		position: absolute;
		top: 10px;
		right: 10px;
		padding: 5px 15px;
		background: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 3px;
		cursor: pointer;
	`;
	closeBtn.onclick = () => {
		document.body.removeChild(overlay);
	};
	
	// Close when clicking outside
	overlay.addEventListener('click', (event) => {
		if (event.target === overlay) {
			document.body.removeChild(overlay);
		}
	});
	
	resultDiv.appendChild(closeBtn);
	resultDiv.appendChild(pre);
	overlay.appendChild(resultDiv);
	document.body.appendChild(overlay);
}

// Modify standardizeBibTeX to handle debug mode
function standardizeBibTeX() {
	// Create dialog container
	const dialog = document.createElement('div');
	dialog.style.cssText = `		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.2);
		z-index: 10000;
		width: 80%;
		max-width: 800px;
	`;

	// Create textarea
	const textarea = document.createElement('textarea');
	textarea.style.cssText = `
		width: 100%;
		height: 200px;
		margin: 10px 0;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-family: monospace;
		font-size: 14px;
		resize: vertical;
	`;
	textarea.placeholder = 'Paste your BibTeX entry here...';

	// Create buttons container
	const buttons = document.createElement('div');
	buttons.style.cssText = `
		text-align: right;
		margin-top: 10px;
	`;

	// Create cancel button
	const cancelBtn = document.createElement('button');
	cancelBtn.textContent = 'Cancel';
	cancelBtn.style.cssText = `
		padding: 5px 15px;
		margin-right: 10px;
		background: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 3px;
		cursor: pointer;
	`;

	// Create submit button
	const submitBtn = document.createElement('button');
	submitBtn.textContent = 'Standardize';
	submitBtn.style.cssText = `
		padding: 5px 15px;
		background: #4CAF50;
		color: white;
		border: none;
		border-radius: 3px;
		cursor: pointer;
	`;

	// Create overlay
	const overlay = document.createElement('div');
	overlay.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		z-index: 9999;
	`;

	// Add event listeners
	cancelBtn.onclick = () => {
		document.body.removeChild(overlay);
	};

	// Close dialog when clicking outside
	overlay.addEventListener('click', (event) => {
		// Only close if clicking directly on the overlay, not its children
		if (event.target === overlay) {
			document.body.removeChild(overlay);
		}
	});

	submitBtn.onclick = () => {
		const input = textarea.value.trim();
		if (!input) {
			alert('Please enter a BibTeX entry');
			return;
		}

		try {
			// Store the input as test data if in debug mode
			if (CONFIG.debug) {
				updateTestData(input);
			}

			// Parse the input BibTeX
			const bibdata = parseBibTex(input);
			if (!bibdata) {
				alert('Invalid BibTeX format');
				return;
			}

			// Clean up the data by removing extra braces and preserving math
			const cleanValue = (value) => {
				if (!value) return '';
				// Remove only the outermost braces if they exist
				// This preserves all LaTeX commands and math formulas
				return value.replace(/^{|}$/g, '');
			};

			// Extract author
			const author = cleanAuthorName(cleanValue(bibdata.author));
			
			// Extract year
			let year = '';
			if (bibdata.year) {
				let yearMatch = cleanValue(bibdata.year).match(/\d{4}/);
				if (yearMatch) {
					year = yearMatch[0];
				}
			}
			
			// Get identifier based on current mode
			let identifier = '';
			if (CONFIG.useJournal && bibdata.journal) {
				identifier = getJournalAbbrev(cleanValue(bibdata.journal));
				if (!identifier) {
					identifier = cleanTitle(cleanValue(bibdata.title));
				}
			} else {
				identifier = cleanTitle(cleanValue(bibdata.title));
			}
			
			// Create new BibTeX key
			const bibkey = author + year + identifier;

			// Get all field names from the input, preserving their original case
			const fieldNames = Object.keys(bibdata).filter(key => 
				key !== 'typeName' && key !== 'citationKey'
			).map(key => key.toUpperCase());

			// Find the longest field name for alignment
			const maxLength = Math.max(...fieldNames.map(name => name.length));

			// Function to format a field with proper alignment
			const formatField = (name, value) => {
				const padding = ' '.repeat(maxLength - name.length);
				// Clean the value and ensure it's properly wrapped in braces
				const cleanedValue = cleanValue(value);
				return `    ${name}${padding} = {${cleanedValue}},\n`;
			};

			// Standardize the format
			let standardized = `@${bibdata.typeName} {${bibkey},\n`;
			
			// Add all fields from the input
			for (const field of fieldNames) {
				const value = bibdata[field.toLowerCase()];
				if (value) {
					standardized += formatField(field, value);
				}
			}

			// Remove trailing comma and add closing brace
			standardized = standardized.replace(/,\n$/, '\n}');

			if (CONFIG.debug) {
				// Show debug result
				showDebugResult(standardized);
			} else {
				// Copy to clipboard
				GM_setClipboard(standardized);
				alert('Standardized BibTeX has been copied to clipboard!');
			}
			document.body.removeChild(overlay);
		} catch (error) {
			console.error('Error standardizing BibTeX:', error);
			alert('Error standardizing BibTeX. Please check the console for details.');
		}
	};

	// Assemble dialog
	buttons.appendChild(cancelBtn);
	buttons.appendChild(submitBtn);
	dialog.appendChild(textarea);
	dialog.appendChild(buttons);
	overlay.appendChild(dialog);
	document.body.appendChild(overlay);

	// Focus textarea
	textarea.focus();
}

// 重新定位所有按钮的函数
function repositionButtons() {
	const modeIndicator = document.getElementById('mode-indicator');
	const standardizeBtn = document.querySelector('button[onclick="standardizeBibTeX()"]');
	const testDataBtn = document.getElementById('test-data-btn');
	const debugBtn = document.getElementById('debug-toggle-btn'); // 使用明确的ID
	
	// 基础位置
	let currentTop = 8;
	
	// Mode Indicator 始终在顶部
	if (modeIndicator) {
		modeIndicator.style.top = currentTop + 'px';
		currentTop += 30; // 按钮高度 + margin
	}
	
	// Standardize Button 始终显示
	if (standardizeBtn) {
		standardizeBtn.style.top = currentTop + 'px';
		currentTop += 30;
	}
	
	// Test Data Button 仅在Debug模式下显示
	if (testDataBtn && CONFIG.debug) {
		testDataBtn.style.top = currentTop + 'px';
		currentTop += 30;
	}
	
	// Debug Button 始终显示，位置根据Test Data按钮是否显示调整
	if (debugBtn) {
		debugBtn.style.top = currentTop + 'px';
	}
	
	// 调试信息
	if (CONFIG.debug) {
		console.log('按钮重新定位完成:');
		console.log('- Mode Indicator:', modeIndicator ? modeIndicator.style.top : 'N/A');
		console.log('- Standardize Button:', standardizeBtn ? standardizeBtn.style.top : 'N/A');
		console.log('- Test Data Button:', testDataBtn ? testDataBtn.style.top : 'N/A');
		console.log('- Debug Button:', debugBtn ? debugBtn.style.top : 'N/A');
	}
}

