// ==UserScript==
// @name         Burning Vocabulary类似版
// @namespace    http://tampermonkey.net/
// @version      71.4
// @description  仿真Burning Vocabulary，v71.0版本适配了bypass v4.2.6.4，可以记录单词，导出html文件，删除7天前的记录。v70.1版本适配了bypass V3.7.2.5,没有记录功能。
// @author       TCH
// @match        *://www.economist.com
// @match        *://www.bloomberg.com
// @include      *://*economist.com/*
// @include      *://*bloomberg.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      dashscope.aliyuncs.com
// @require      https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @license      tangchuanhui
// @downloadURL https://update.greasyfork.org/scripts/475413/Burning%20Vocabulary%E7%B1%BB%E4%BC%BC%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/475413/Burning%20Vocabulary%E7%B1%BB%E4%BC%BC%E7%89%88.meta.js
// ==/UserScript==
 
 
 
 
(function() {
	// ==================== 千问API配置 ====================
	const QIANWEN_API_KEY = 'sk-ee2c525aaba8427aa01049c0d90f7c9a'; // 请替换为你的千问API Key
	const QIANWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
 
	// ==================== 记录功能配置 ====================
	const RECORD_STORAGE_KEY = 'vocabulary_records'; // 存储记录的键名
	const RECORD_HTML_FILENAME = 'vocabulary_records.html'; // HTML文件名
 
	// ==================== 记录管理函数 ====================
 
	// 获取所有记录
	function getAllRecords() {
		const recordsJson = GM_getValue(RECORD_STORAGE_KEY, '[]');
		try {
			return JSON.parse(recordsJson);
		} catch (e) {
			console.error('解析记录失败:', e);
			return [];
		}
	}
 
	// 添加一条新记录
	function addRecord(text) {
		if (!text || !text.trim()) {
			return false;
		}
		
		const records = getAllRecords();
		const newRecord = {
			id: String(Date.now()) + '_' + String(Math.random()).substring(2, 15), // 唯一ID（字符串格式，避免浮点数精度问题）
			text: text.trim(),
			time: new Date().toLocaleString('zh-CN', { 
				year: 'numeric', 
				month: '2-digit', 
				day: '2-digit', 
				hour: '2-digit', 
				minute: '2-digit',
				second: '2-digit'
			}),
			timestamp: Date.now()
		};
		
		records.push(newRecord);
		GM_setValue(RECORD_STORAGE_KEY, JSON.stringify(records));
		return true;
	}
 
	// 清理7天前的记录
	function cleanOldRecords() {
		const records = getAllRecords();
		const now = Date.now();
		const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000); // 7天前的时间戳
		
		const filtered = records.filter(r => {
			// 如果记录有timestamp字段，使用timestamp；否则使用id中的时间戳部分
			let recordTime = r.timestamp;
			if (!recordTime && r.id) {
				// 从ID中提取时间戳（格式：timestamp_random）
				const idParts = String(r.id).split('_');
				if (idParts.length > 0) {
					recordTime = parseInt(idParts[0]);
				}
			}
			// 如果还是没有时间戳，保留记录（安全起见）
			if (!recordTime) {
				return true;
			}
			// 只保留7天内的记录
			return recordTime >= sevenDaysAgo;
		});
		
		const deletedCount = records.length - filtered.length;
		if (deletedCount > 0) {
			GM_setValue(RECORD_STORAGE_KEY, JSON.stringify(filtered));
			console.log(`已清理 ${deletedCount} 条7天前的记录`);
			return deletedCount;
		}
		return 0;
	}
 
	// 生成HTML文件内容
	function generateHTMLFile() {
		const records = getAllRecords();
		console.log('生成HTML文件，记录数量:', records.length);
		console.log('记录内容:', records);
		const recordsJson = JSON.stringify(records);
		console.log('记录JSON字符串长度:', recordsJson.length);
		
		const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>词汇记录 - Vocabulary Records</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        .header p {
            opacity: 0.9;
            font-size: 14px;
        }
        .stats {
            padding: 20px 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .stats span {
            font-weight: bold;
            color: #667eea;
        }
        .records-container {
            padding: 30px;
            max-height: 70vh;
            overflow-y: auto;
        }
        .record-item {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 6px;
            transition: all 0.3s ease;
            position: relative;
        }
        .record-item:hover {
            background: #e9ecef;
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .record-text {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            margin-bottom: 10px;
            word-wrap: break-word;
            user-select: text;
        }
        .record-time {
            font-size: 12px;
            color: #6c757d;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
        }
        .empty-state svg {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        .instructions {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px 20px;
            margin-bottom: 20px;
            border-radius: 4px;
            font-size: 14px;
            color: #0d47a1;
        }
        .instructions strong {
            display: block;
            margin-bottom: 5px;
        }
        .instructions ul {
            margin-left: 20px;
            margin-top: 5px;
        }
        .instructions li {
            margin-bottom: 3px;
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 词汇记录本</h1>
            <p>Vocabulary Records Collection</p>
        </div>
        <div class="stats">
            <div>总记录数: <span id="total-count">${records.length}</span></div>
        </div>
        <div class="records-container">
            <div id="records-list"></div>
        </div>
    </div>
    <script>
        // HTML转义函数
        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // 获取所有记录（从嵌入的数据）
        function getAllRecords() {
            try {
                const embeddedRecords = ${recordsJson};
                if (embeddedRecords && Array.isArray(embeddedRecords)) {
                    // 按时间倒序排列（最新的在前）
                    return embeddedRecords.sort((a, b) => {
                        const timeA = a.timestamp || (a.id ? parseInt(String(a.id).split('_')[0]) : 0);
                        const timeB = b.timestamp || (b.id ? parseInt(String(b.id).split('_')[0]) : 0);
                        return timeB - timeA;
                    });
                }
            } catch (e) {
                console.error('加载嵌入记录失败:', e);
            }
            return [];
        }
        
        // 渲染所有记录
        function renderRecords() {
            const records = getAllRecords();
            const recordsList = document.getElementById('records-list');
            
            if (records.length === 0) {
                recordsList.innerHTML = \`
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        <p>还没有记录，快去网页上记录一些内容吧！</p>
                    </div>
                \`;
                return;
            }
            
            recordsList.innerHTML = records.map((record, index) => \`
                <div class="record-item" data-index="\${index}">
                    <div class="record-text">\${escapeHtml(record.text)}</div>
                    <div class="record-time">📅 \${escapeHtml(record.time)}</div>
                </div>
            \`).join('');
        }
        
        // 更新统计信息
        function updateStats() {
            const records = getAllRecords();
            document.getElementById('total-count').textContent = records.length;
        }
        
        // 页面加载时渲染记录
        document.addEventListener('DOMContentLoaded', function() {
            renderRecords();
            updateStats();
        });
    </script>
</body>
</html>`;
		
		return htmlContent;
	}
 
	// 下载HTML文件
	function downloadHTMLFile() {
		// 先清理7天前的记录
		const deletedCount = cleanOldRecords();
		if (deletedCount > 0) {
			console.log(`已清理 ${deletedCount} 条7天前的记录`);
		}
		
		// 生成HTML文件（使用清理后的记录）
		const htmlContent = generateHTMLFile();
		const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		
		// 使用GM_download下载文件，覆盖已存在的文件
		GM_download({
			url: url,
			name: RECORD_HTML_FILENAME,
			saveAs: false, // 不弹出保存对话框，使用默认位置
			conflictAction: 'overwrite', // 如果文件已存在，覆盖它
			onerror: function(error) {
				console.error('下载失败:', error);
				// 如果GM_download失败，使用传统方法（浏览器会自动覆盖同名文件）
				fallbackDownload(htmlContent);
			},
			onload: function() {
				console.log('HTML文件下载成功（已覆盖旧文件）');
				URL.revokeObjectURL(url);
			}
		});
	}
 
	// 备用下载方法（当GM_download不可用时）
	function fallbackDownload(htmlContent) {
		const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = RECORD_HTML_FILENAME;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		console.log('HTML文件下载成功（使用备用方法）');
	}
 
	// HTML转义函数（用于生成HTML文件时）
	function escapeHtml(text) {
		if (!text) return '';
		return String(text)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
 
	// 显示通知
	function showNotification(message, type = 'info') {
		// 移除已存在的通知
		const existing = document.getElementById('record-notification');
		if (existing) {
			existing.remove();
		}
 
		const notification = document.createElement('div');
		notification.id = 'record-notification';
		notification.textContent = message;
		
		const colors = {
			success: '#28a745',
			error: '#dc3545',
			warning: '#ffc107',
			info: '#17a2b8'
		};
		
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: ${colors[type] || colors.info};
			color: white;
			padding: 15px 25px;
			border-radius: 6px;
			box-shadow: 0 4px 12px rgba(0,0,0,0.3);
			z-index: 10000;
			font-size: 14px;
			font-weight: 500;
			animation: slideIn 0.3s ease;
		`;
		
		// 添加动画样式
		if (!document.getElementById('notification-styles')) {
			const style = document.createElement('style');
			style.id = 'notification-styles';
			style.textContent = `
				@keyframes slideIn {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
			`;
			document.head.appendChild(style);
		}
		
		document.body.appendChild(notification);
		
		// 3秒后自动消失
		setTimeout(() => {
			notification.style.animation = 'slideIn 0.3s ease reverse';
			setTimeout(() => {
				if (notification.parentNode) {
					notification.remove();
				}
			}, 300);
		}, 3000);
	}
 
	// ==================== 辅助函数 ====================
 
 
	// 从全文中查找所有以部分单词开头的完整单词（去重）
	function findAllCompleteWords(partialWord, fullText) {
		if (!partialWord || !partialWord.trim()) {
			return [];
		}
 
		partialWord = partialWord.trim().toLowerCase();
		const wordBoundaryRegex = /[\s\.,;:!?\-—()\[\]{}"'⁰¹²³⁴⁵⁶⁷⁸⁹]/;
 
		// 清理文本：去除上标数字和翻译标记
		const cleanText = fullText.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '').replace(/\[[^\]]+\]/g, '');
 
		const completeWords = new Set(); // 使用Set自动去重
		let currentPos = 0;
 
		// 遍历全文查找所有匹配
		while (currentPos < cleanText.length) {
			// 查找部分单词的下一个出现位置
			let foundPos = cleanText.toLowerCase().indexOf(partialWord, currentPos);
 
			if (foundPos === -1) {
				break; // 没有更多匹配
			}
 
			// 检查是否是单词开头（前面是空格或文本开头）
			const isWordStart = foundPos === 0 || wordBoundaryRegex.test(cleanText[foundPos - 1]);
 
			if (isWordStart) {
				// 向后拓展获取完整单词
				let endPos = foundPos + partialWord.length;
				while (endPos < cleanText.length && !wordBoundaryRegex.test(cleanText[endPos])) {
					endPos++;
				}
 
				const completeWord = cleanText.substring(foundPos, endPos).trim();
				if (completeWord.length > 0) {
					completeWords.add(completeWord);
				}
			}
 
			currentPos = foundPos + 1;
		}
 
		return Array.from(completeWords);
	}
 
	// 从文本中查找部分单词并拓展为完整单词（单个）
	function findAndExpandWord(partialWord, text) {
		// 如果部分单词为空，返回null
		if (!partialWord || !partialWord.trim()) {
			return null;
		}
 
		partialWord = partialWord.trim();
		const wordBoundaryRegex = /[\s\.,;:!?\-—()\[\]{}"']/;
 
		// 在文本中查找部分单词（带空格前缀，确保是单词边界）
		const searchPattern = ' ' + partialWord;
		let startIndex = text.indexOf(searchPattern);
 
		// 如果在开头找不到（可能是句首），尝试不带空格查找
		if (startIndex === -1) {
			startIndex = 0;
			if (!text.startsWith(partialWord)) {
				return partialWord; // 找不到，返回原始单词
			}
		} else {
			startIndex++; // 跳过前面的空格
		}
 
		// 向后拓展直到遇到单词边界
		let endIndex = startIndex + partialWord.length;
		while (endIndex < text.length && !wordBoundaryRegex.test(text[endIndex])) {
			endIndex++;
		}
 
		const completeWord = text.substring(startIndex, endIndex).trim();
		return completeWord;
	}
 
	// 提取单词所在的完整句子
	function extractSentence(word, fullText) {
		// 过滤掉文本中的上标数字（⁰¹²³⁴⁵⁶⁷⁸⁹）
		const cleanText = fullText.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, '');
 
		// 查找单词在文本中的位置
		word = " " + word;
		const wordIndex = cleanText.indexOf(word);
		if (wordIndex === -1) {
			return null; // 如果找不到，返回null
		}
 
		// 向前查找句子开始（句号、问号、感叹号或文本开头）
		let sentenceStart = wordIndex;
		const sentenceStartRegex = /[.!?]\s+/;
		while (sentenceStart > 0) {
			if (sentenceStartRegex.test(cleanText.substring(sentenceStart - 2, sentenceStart + 1))) {
				break;
			}
			sentenceStart--;
		}
 
		// 向后查找句子结束
		let sentenceEnd = wordIndex + word.length;
		while (sentenceEnd < cleanText.length) {
			if (sentenceStartRegex.test(cleanText.substring(sentenceEnd, sentenceEnd + 2))) {
				sentenceEnd++;
				break;
			}
			sentenceEnd++;
		}
 
		// 返回清理后的句子，并进一步清理可能残留的标注标记
		const sentence = cleanText.substring(sentenceStart, sentenceEnd).trim();
		// 也过滤掉中文翻译标记 [xxx]
		return sentence.replace(/\[[^\]]+\]/g, '');
	}
 
	// 调用千问API获取翻译
	function getTranslationFromQianwen(word, sentence) {
		return new Promise((resolve, reject) => {
			if (!QIANWEN_API_KEY || QIANWEN_API_KEY === 'YOUR_API_KEY_HERE') {
				console.warn('未配置千问API Key，使用默认翻译');
				resolve('翻译');
				return;
			}
 
			// 如果句子为空，直接返回
			if (!sentence || sentence.trim() === '') {
				console.warn('句子为空，无法翻译');
				resolve('翻译');
				return;
			}
 
			const prompt = `请翻译句子"${sentence}"中的单词"${word}"在这个语境下的中文意思。只需要返回1-6个汉字的简短翻译，不要解释。`;
 
			GM_xmlhttpRequest({
				method: 'POST',
				url: QIANWEN_API_URL,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${QIANWEN_API_KEY}`
				},
				data: JSON.stringify({
					model: "qwen-turbo",
					input: {
						messages: [{
								role: "system",
								content: "你是一个专业的英语翻译助手，只返回简短的中文翻译，不要任何解释。"
							},
							{
								role: "user",
								content: prompt
							}
						]
					},
					parameters: {
						max_tokens: 50,
						temperature: 0.3,
						result_format: "message"
					}
				}),
				onload: function(response) {
					try {
						console.log('千问API响应状态:', response.status);
						console.log('千问API响应内容:', response.responseText);
 
						const result = JSON.parse(response.responseText);
 
						// 检查是否有错误
						if (result.code || result.error) {
							console.error('千问API返回错误:', result.message || result.error);
							resolve('翻译');
							return;
						}
 
						// 尝试多种可能的响应格式
						let translation = null;
 
						// 格式1: result.output.choices[0].message.content
						if (result.output && result.output.choices && result.output.choices[0] && result.output.choices[0].message) {
							translation = result.output.choices[0].message.content;
						}
						// 格式2: result.output.text
						else if (result.output && result.output.text) {
							translation = result.output.text;
						}
						// 格式3: result.choices[0].message.content
						else if (result.choices && result.choices[0] && result.choices[0].message) {
							translation = result.choices[0].message.content;
						}
						// 格式4: result.text
						else if (result.text) {
							translation = result.text;
						}
 
						if (translation) {
							resolve(translation.trim());
						} else {
							console.error('无法从响应中提取翻译，响应结构:', result);
							resolve('翻译');
						}
					} catch (error) {
						console.error('解析千问API响应失败:', error);
						console.error('原始响应:', response.responseText);
						resolve('翻译');
					}
				},
				onerror: function(error) {
					console.error('千问API调用失败:', error);
					resolve('翻译');
				}
			});
		});
	}
 
 
	// 统一的渲染函数，接受容器选择器作为参数
	function rendering(containerSelector) {
		// 根据选择器获取容器
		const container = containerSelector === '.body-content' 
			? document.querySelector('.body-content')
			: document.getElementsByTagName("body")[0];
		
		var allsText = container.innerHTML;
 
		function makeTranslate(completeWord, translation) {
			// 如果有翻译，添加到显示中
			const translationText = translation ? `[${translation}]` : '';
 
      var num = -1;
 
      var rHtml = new RegExp("\<.*?\>", "ig"); //匹配html元素
      var aHtml = allsText.match(rHtml); //存放html元素的数组
      allsText = allsText.replace(rHtml, '{~}'); //替换html标签
			
			// 使用正则表达式 + g 标志替换所有匹配
			var rWord = new RegExp(completeWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
			allsText = allsText.replace(rWord, completeWord + translationText); //替换翻译
 
      allsText = allsText.replace(/{~}/g, function() { //恢复html标签
        num++;
        return aHtml[num];
      });
    }
 
	function makeOnceColor(searchVal, nColor, tot) {
      searchVal = " " + searchVal;
 
			var sKey = "<span name='addSpan' style='color:" + nColor + ";'><sup style='vertical-align: super; font-size: 0.75em;'>" + tot + "</sup>" + searchVal + "</span>";
      var num = -1;
      var rStr = new RegExp(searchVal, "g");
 
      var rHtml = new RegExp("\<.*?\>", "ig"); //匹配html元素
      var aHtml = allsText.match(rHtml); //存放html元素的数组
      allsText = allsText.replace(rHtml, '{~}'); //替换html标签
 
      allsText = allsText.replace(rStr, sKey); //替换key
 
      allsText = allsText.replace(/{~}/g, function() { //恢复html标签
        num++;
        return aHtml[num];
      });
    }
 
	function makecolor(searchVal, completeWord, nColor, tot, translation) {
		var oDiv = containerSelector === '.body-content' 
			? document.querySelector('.body-content')
			: document.getElementsByTagName("body")[0];
      var sText = oDiv.innerHTML;
 
		// 如果有翻译，添加到显示中
		const translationText = translation ? `[${translation}]` : '';
		var sKey = "<span name='addSpan' style='color:" + nColor + ";'><sup style='vertical-align: super; font-size: 0.75em;'>" + tot + "</sup>" + searchVal + "</span>";
      searchVal = " " + searchVal;
 
      var num = -1;
      var rStr = new RegExp(searchVal, "g");
      var rHtml = new RegExp("\<.*?\>", "ig"); //匹配html元素
      var aHtml = sText.match(rHtml); //存放html元素的数组
      sText = sText.replace(rHtml, '{~}'); //替换html标签
			sText = sText.replace(completeWord, completeWord + translationText); //替换翻译
      sText = sText.replace(rStr, sKey); //替换key
      sText = sText.replace(/{~}/g, function() { //恢复html标签
        num++;
        return aHtml[num];
      });
      oDiv.innerHTML = sText;
    }
 
    //alert("开始整体染色1");
 
		let list_value = GM_listValues();
 
		//alert("开始渲染按钮");
		let div = document.createElement("div");
		div.style = "position:fixed; z-index:90;bottom:20px; left: 0; margin: auto; right: 0;text-align:center;width:100%;max-width:100%;box-sizing:border-box;padding:0 5px;display:flex;justify-content:center;flex-wrap:nowrap;gap:2px;"
		div.innerHTML = '<span id="biaozhubiaozhu" style="min-width:60px;max-width:25%;z-index:100;margin:2px;background-color: red;font-size: 18px;border-color: red;border-radius: 4px;padding: 1px 2px;display: inline-block;cursor: pointer;text-align: center;box-sizing: border-box;flex: 1;" >标注</span><span id="jilujilu" style="min-width:60px;max-width:25%;margin:2px;background-color: green;font-size: 18px;color: white;border-radius: 4px;cursor: pointer;padding: 1px 2px;display: inline-block;text-align: center;box-sizing: border-box;flex: 1;">记录</span><span id="quxiaobiaozhu" style="min-width:60px;max-width:25%;margin:2px;background-color: grey;font-size: 18px;color: white;border-radius: 4px;cursor: pointer;padding: 1px 2px;display: inline-block;text-align: center;box-sizing: border-box;flex: 1;">取消</span><span id="daochudaochu" style="min-width:60px;max-width:25%;margin:2px;background-color: blue;font-size: 18px;color: white;border-radius: 4px;cursor: pointer;padding: 1px 2px;display: inline-block;text-align: center;box-sizing: border-box;flex: 1;">导出</span>';
 
		// 异步加载所有翻译
		(async function() {
			const fullText = container.innerText;
 
    for (var i = 0; i < list_value.length; i++) {
      let tot = GM_getValue(list_value[i], 0);
 
				// 从全文中找到所有以list_value[i]开头的完整单词
				const completeWords = findAllCompleteWords(list_value[i], fullText);
				console.log(`部分单词 "${list_value[i]}" 在全文中找到 ${completeWords.length} 个完整单词:`, completeWords);
 
				// 为每个完整单词分别获取翻译
				for (const completeWord of completeWords) {
					// 提取包含该完整单词的句子
					const sentence = extractSentence(completeWord, fullText);
					if (sentence === null) {
						console.warn(`无法为单词 "${completeWord}" 提取句子`);
						continue;
					}
 
					// 使用完整单词获取翻译
					const translation = await getTranslationFromQianwen(completeWord, sentence);
					console.log(`完整单词 "${completeWord}" 的翻译: ${translation}`);
 
					// 先把所有的翻译加上
					makeTranslate(completeWord, translation);
				}
				makeOnceColor(list_value[i], "red", tot);
			}
			container.innerHTML = allsText;
			
			// 重新添加按钮（因为上面的 innerHTML 替换会删除按钮）
			document.body.append(div);
		})();
 
    //监听选择文本的动作
    var selectionFirst = null;
    var selectionSecond = null;
    document.addEventListener("selectionchange", () => {
      selectionFirst = selectionSecond;
      selectionSecond = document.getSelection()
        .toString();
    });
 
    //alert("整体染色结束1");
 
		document.onclick = async function(event) {
      if (event.target.id == "biaozhubiaozhu") {
 
        selectionFirst = selectionSecond; //在有些浏览器，需要把这句去除
        if (selectionFirst !== null && selectionFirst !== void 0 && selectionFirst.toString()) {
					// 获取完整页面文本
					const bodyContent = document.querySelector('.body-content') || document.getElementsByTagName("body")[0];
					const fullText = bodyContent.innerText;
					let selectedText = selectionFirst.trim();
					let completeWord;
 
					// 清理选中文本，得到完整单词（去除前后的标点符号）
					selectedText = selectedText.replace(/^[^\w]+|[^\w]+$/g, '');
 
					// 提取包含该单词的句子
					const sentence = extractSentence(selectedText, fullText);
 
					// 获取存储的计数
					let tot = GM_getValue(selectedText, 0);
 
					// 如果是第一次标注，获取翻译并高亮显示
					if (tot === 0) {
						try {
 
							// 从全文中找到所有以selectedText开头的完整单词
							const completeWords = findAllCompleteWords(selectedText, fullText);
							console.log(`部分单词 "${selectedText}" 在全文中找到 ${completeWords.length} 个完整单词:`, completeWords);
 
							// 为每个完整单词分别获取翻译
							for (completeWord of completeWords) {
								// 提取包含该完整单词的句子
								const sentence = extractSentence(completeWord, fullText);
								if (sentence === null) {
									console.warn(`无法为单词 "${completeWord}" 提取句子`);
									continue;
								}
 
								// 使用完整单词获取翻译
								const translation = await getTranslationFromQianwen(completeWord, sentence);
								console.log(`完整单词 "${completeWord}" 的翻译: ${translation}`);
 
								// 但只标注用户实际选中的部分（list_value[i]）
								makecolor(selectedText, completeWord, "red", 1, translation);
							}
						} catch (error) {
							console.error('获取翻译失败:', error);
							makecolor(selectedText, completeWord, "red", 1, "翻译");
						}
					}
					// 只保存计数，不保存翻译
					GM_setValue(selectedText, tot + 1);
 
        }
 
      } else if (event.target.id == "quxiaobiaozhu") {
 
        selectionFirst = selectionSecond; //在有些浏览器，需要把这句去除
 
        if (selectionFirst !== null && selectionFirst !== void 0 && selectionFirst.toString()) {
					// 清理选中文本
					let completeWord = selectionFirst.trim().replace(/^[^\w]+|[^\w]+$/g, '');
					GM_deleteValue(completeWord);
        }
 
      } else if (event.target.id == "jilujilu") {
        
        selectionFirst = selectionSecond; //在有些浏览器，需要把这句去除
 
        if (selectionFirst !== null && selectionFirst !== void 0 && selectionFirst.toString()) {
					// 获取选中的文本
					let selectedText = selectionFirst.trim();
					
					if (selectedText) {
						// 添加记录
						if (addRecord(selectedText)) {
							console.log('记录已保存:', selectedText);
							
							// 显示提示（不自动下载）
							showNotification('✓ 记录已保存', 'success');
						} else {
							showNotification('记录保存失败', 'error');
						}
					}
        } else {
					console.warn('未获取到选中的文本');
					showNotification('请先选择要记录的文本', 'warning');
				}
 
      } else if (event.target.id == "daochudaochu") {
        
        // 导出按钮：生成并下载HTML文件
        const recordsBeforeClean = getAllRecords();
        console.log('导出前记录数量:', recordsBeforeClean.length);
        
        if (recordsBeforeClean.length === 0) {
					showNotification('还没有记录，请先记录一些文本', 'warning');
					return;
				}
        
        try {
					// downloadHTMLFile内部会先清理7天前的记录，然后生成HTML
					downloadHTMLFile();
					
					// 获取清理后的记录数量
					const recordsAfterClean = getAllRecords();
					const deletedCount = recordsBeforeClean.length - recordsAfterClean.length;
					
					if (deletedCount > 0) {
						showNotification(`✓ HTML文件导出成功（已清理${deletedCount}条7天前的记录，剩余${recordsAfterClean.length}条）`, 'success');
					} else {
						showNotification(`✓ HTML文件导出成功（包含${recordsAfterClean.length}条记录）`, 'success');
					}
				} catch (error) {
					console.error('导出失败:', error);
					showNotification('导出失败，请重试', 'error');
				}
      }
    };
    document.body.append(div);
	}
 
 	// ==================== ElementGetter 已通过 @require 引入 ====================
	// ElementGetter 官方库地址: https://bbs.tampermonkey.net.cn/thread-2726-1-1.html
	// 使用 elmGetter 对象进行异步元素获取
 
  //以下是bypass v4.2.6.4 在彭博社网站新增的标签
  elmGetter.get('div[data-component="plug-newsletter"]').then(div1 => {
 
    ////删除广告
    document.querySelector('.media-ui-FullWidthAd_fullWidthAdWrapper-fClHZteIk3k-').style.display = 'none';
    //删除浏览器版本低的提示
    const targetElement1 = document.querySelector('.unsupported-browser-notification-container');
    if (targetElement1) {
      targetElement1.style.display = 'none';
      targetElement1.style.visibility = 'hidden';
    } else {
      //alert('未找到浏览器版本低的提示');
    }
    
		rendering('.body-content');
	});
    
	//以下是bypass v4.2.6.4 在经济学人网站新增的标签
	elmGetter.get('div[id="zephr-ribbon"]').then(div1 => {
		rendering('body');
	});
 
 
 
 
})();