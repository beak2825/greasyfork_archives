// ==UserScript==
// @name         下水道发种助手 - 音轨和字幕自动识别
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  自动识别音轨和字幕信息并更新副标题，支持多种MediaInfo格式，增加小语种识别和悬浮框开关
// @author       fnyfree/AI
// @match        https://sewerpt.com/edit.php?id=*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530514/%E4%B8%8B%E6%B0%B4%E9%81%93%E5%8F%91%E7%A7%8D%E5%8A%A9%E6%89%8B%20-%20%E9%9F%B3%E8%BD%A8%E5%92%8C%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/530514/%E4%B8%8B%E6%B0%B4%E9%81%93%E5%8F%91%E7%A7%8D%E5%8A%A9%E6%89%8B%20-%20%E9%9F%B3%E8%BD%A8%E5%92%8C%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 首先定义isEnabled变量
    let isEnabled = localStorage.getItem('scriptEnabled') !== 'false';
    
    // 语言映射表 - 确保每种语言的关键词不会互相干扰
    const languageMap = {
        '粤语': ['粵語', '粤语', 'cantonese', 'yue'],
        '国语': ['汉语普通话', '普通话', '国语', 'mandarin', 'Putonghua'],
        '英语': ['English', '英语', '英文', '英文配音', 'en'],
        '日语': ['Japanese', '日语', '日文', '日本語', 'ja'],
        '韩语': ['Korean', '韩语', '韩文', '한국어', 'ko'],
        '泰语': ['Thai', '泰语', 'th'],
        '西班牙语': ['Spanish', '西班牙语', 'es'],
        '法语': ['French', '法语', 'fr'],
        '德语': ['German', '德语', 'de'],
        '俄语': ['Russian', '俄语', 'ru'],
        '意大利语': ['Italian', '意大利语', 'it'],
        '葡萄牙语': ['Portuguese', '葡萄牙语', 'pt'],
        '阿拉伯语': ['Arabic', '阿拉伯语', 'ar'],
        '印地语': ['Hindi', '印地语', 'hi'],
        '芬兰语': ['Finnish', '芬兰语', 'fi']
    };

    // 字幕语言映射表
    const subtitleLanguageMap = {
        '简体': ['简体', '简中', '简体中文', 'Simplified Chinese'],
        '繁体': ['繁体', '繁中', '繁体中文', 'Traditional Chinese', '中文（繁體'],
        '英语': ['English', '英语', '英文字幕', 'en'],
        '日语': ['Japanese', '日语', '日文字幕', 'ja'],
        '韩语': ['Korean', '韩语', '韩文字幕', 'ko'],
        '泰语': ['Thai', '泰语', 'th'],
        '西班牙语': ['Spanish', '西班牙语', 'es'],
        '法语': ['French', '法语', 'fr'],
        '德语': ['German', '德语', 'de'],
        '俄语': ['Russian', '俄语', 'ru'],
        '意大利语': ['Italian', '意大利语', 'it'],
        '葡萄牙语': ['Portuguese', '葡萄牙语', 'pt'],
        '阿拉伯语': ['Arabic', '阿拉伯语', 'ar'],
        '印地语': ['Hindi', '印地语', 'hi'],
        '芬兰语': ['Finnish', '芬兰语', 'fi']
    };

    // 添加闪烁动画CSS
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes greenFlash {
                0% { background-color: #d4edda; }
                50% { background-color: #8fd19e; }
                100% { background-color: #d4edda; }
            }

            @keyframes redFlash {
                0% { background-color: #f8d7da; }
                50% { background-color: #e77681; }
                100% { background-color: #f8d7da; }
            }

            .green-flash {
                animation: greenFlash 1s ease-in-out 3;
                background-color: #d4edda !important;
            }

            .red-flash {
                animation: redFlash 1s ease-in-out 3;
                background-color: #f8d7da !important;
            }
            
            .script-checkbox {
                margin-right: 8px;
                transform: scale(1.2);
                vertical-align: middle;
            }
            
            .script-label {
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
            }
            
            .manual-button {
                margin-top: 10px;
                padding: 5px 10px;
                width: 100%;
                cursor: pointer;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: bold;
            }
            
            .manual-button:hover {
                background-color: #45a049;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 显示通知
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '9999';
        notification.style.maxWidth = '300px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        notification.style.transition = 'all 0.3s ease';
        notification.innerText = message;

        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
            notification.style.color = 'white';
        } else if (type === 'warning') {
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = 'black';
        }

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // 更新副标题
    function updateSubtitle(audioTracks, subtitleTracks) {
        const subtitleInput = document.querySelector('input[name="small_descr"]');
        if (!subtitleInput) return;

        let audioInfo = "";
        let subtitleInfo = "";
        let audioSuccess = false;
        let subtitleSuccess = false;

        // 分析音轨信息 - 直接检查特定的音轨标题和语言
        const hasCantoneseTrack = audioTracks.some(track => 
            track.includes('粵語') || track.includes('粤语') || track.includes('cantonese') || track.includes('yue')
        );
        
        const hasMandarinTrack = audioTracks.some(track => 
            track.includes('普通话') || track.includes('国语') || track.includes('mandarin') || track.includes('Putonghua') || track.includes('汉语普通话')
        );
        
        const hasEnglishTrack = audioTracks.some(track => 
            track.includes('English') || track.includes('英语') || track.includes('英文') || track.includes('en')
        );
        
        console.log("粤语轨道:", hasCantoneseTrack);
        console.log("国语轨道:", hasMandarinTrack);
        console.log("英语轨道:", hasEnglishTrack);
        
        // 根据检测到的音轨确定音频信息
        if (hasCantoneseTrack && hasMandarinTrack && hasEnglishTrack) {
            audioInfo = "国粤英三语";
            audioSuccess = true;
        } else if (hasCantoneseTrack && hasMandarinTrack) {
            audioInfo = "国粤双语";
            audioSuccess = true;
        } else if (hasCantoneseTrack && hasEnglishTrack) {
            audioInfo = "粤英双语";
            audioSuccess = true;
        } else if (hasMandarinTrack && hasEnglishTrack) {
            audioInfo = "国英双语";
            audioSuccess = true;
        } else if (hasCantoneseTrack) {
            audioInfo = "粤语";
            audioSuccess = true;
        } else if (hasMandarinTrack) {
            audioInfo = "国语";
            audioSuccess = true;
        } else if (hasEnglishTrack) {
            audioInfo = "英语";
            audioSuccess = true;
        } else {
            // 检查其他语言
            for (const [lang, keywords] of Object.entries(languageMap)) {
                if (lang !== '粤语' && lang !== '国语' && lang !== '英语') {
                    if (audioTracks.some(track => keywords.some(keyword => track.toLowerCase().includes(keyword.toLowerCase())))) {
                        audioInfo = lang;
                        audioSuccess = true;
                        break;
                    }
                }
            }
            
            // 如果仍未识别到语言，检查Language字段
            if (!audioSuccess) {
                for (const track of audioTracks) {
                    if (track.toLowerCase() === 'chinese') {
                        audioInfo = "国语"; // 默认Chinese为国语
                        audioSuccess = true;
                        break;
                    } else if (track.toLowerCase() === 'finnish') {
                        audioInfo = "芬兰语";
                        audioSuccess = true;
                        break;
                    }
                    // 可以添加更多语言的检测
                }
            }
        }

        // 分析字幕信息
        const hasSimplifiedSubtitle = subtitleTracks.some(track => 
            track.includes('简体') || track.includes('简中') || track.includes('简体中文') || track.includes('Simplified Chinese')
        );
        
        const hasTraditionalSubtitle = subtitleTracks.some(track => 
            track.includes('繁体') || track.includes('繁中') || track.includes('繁体中文') || track.includes('Traditional Chinese') || track.includes('中文（繁體')
        );
        
        const hasEnglishSubtitle = subtitleTracks.some(track => 
            track.includes('English') || track.includes('英语') || track.includes('英文') || track.includes('en')
        );
        
        console.log("简体字幕:", hasSimplifiedSubtitle);
        console.log("繁体字幕:", hasTraditionalSubtitle);
        console.log("英文字幕:", hasEnglishSubtitle);
        
        // 根据检测到的字幕确定字幕信息
        if (hasSimplifiedSubtitle && hasTraditionalSubtitle && hasEnglishSubtitle) {
            subtitleInfo = "简繁英三语字幕";
            subtitleSuccess = true;
        } else if (hasSimplifiedSubtitle && hasTraditionalSubtitle) {
            subtitleInfo = "简繁双字幕";
            subtitleSuccess = true;
        } else if (hasSimplifiedSubtitle && hasEnglishSubtitle) {
            subtitleInfo = "简英双字幕";
            subtitleSuccess = true;
        } else if (hasTraditionalSubtitle && hasEnglishSubtitle) {
            subtitleInfo = "繁英双字幕";
            subtitleSuccess = true;
        } else if (hasSimplifiedSubtitle) {
            subtitleInfo = "简体字幕";
            subtitleSuccess = true;
        } else if (hasTraditionalSubtitle) {
            subtitleInfo = "繁体字幕";
            subtitleSuccess = true;
        } else if (hasEnglishSubtitle) {
            subtitleInfo = "英语字幕";
            subtitleSuccess = true;
        } else {
            // 检查其他字幕语言
            for (const [lang, keywords] of Object.entries(subtitleLanguageMap)) {
                if (lang !== '简体' && lang !== '繁体' && lang !== '英语') {
                    if (subtitleTracks.some(track => keywords.some(keyword => track.toLowerCase().includes(keyword.toLowerCase())))) {
                        subtitleInfo = lang + "字幕";
                        subtitleSuccess = true;
                        break;
                    }
                }
            }
        }

        // 生成副标题
        let newSubtitle = "";
        if (audioInfo && subtitleInfo) {
            newSubtitle = `[${audioInfo}/${subtitleInfo}]`;
        } else if (audioInfo) {
            newSubtitle = `[${audioInfo}]`;
        } else if (subtitleInfo) {
            newSubtitle = `[${subtitleInfo}]`;
        }

        // 处理当前副标题
        let currentSubtitle = subtitleInput.value.trim();
        
        // 查找最后一个管道符号的位置
        const lastPipeIndex = currentSubtitle.lastIndexOf('|');
        
        if (lastPipeIndex !== -1) {
            // 提取管道符号前后的内容
            const beforePipe = currentSubtitle.substring(0, lastPipeIndex).trim();
            const afterPipe = currentSubtitle.substring(lastPipeIndex + 1).trim();
            
            // 检查管道符号后面是否只有语言信息
            const languageRegex = /^(粤语|国语|英语|日语|韩语|泰语|西班牙语|法语|德语|俄语|意大利语|葡萄牙语|阿拉伯语|印地语|芬兰语|双语|国粤双语|国英双语|粤英双语|粵語|普通话|原音|多语)(\s*\[[^\]]+\])?$/;
            
            if (languageRegex.test(afterPipe)) {
                // 如果管道符号后面只有语言信息，则替换它
                subtitleInput.value = `${beforePipe} | ${newSubtitle}`;
            } else {
                // 如果管道符号后面有其他内容，则保留并添加新的副标题
                // 首先移除现有的语言标记
                const cleanedSubtitle = currentSubtitle.replace(/\[(粤语|国语|英语|日语|韩语|泰语|西班牙语|法语|德语|俄语|意大利语|葡萄牙语|阿拉伯语|印地语|芬兰语|双语|国粤双语|国英双语|粤英双语|粵語|普通话|原音|多语)[^\]]*\]/g, '');
                const cleanedSubtitle2 = cleanedSubtitle.replace(/\[(字幕|中字|简体|繁体|英文|日文|韩文|泰文|西班牙文|法文|德文|俄文|意大利文|葡萄牙文|阿拉伯文|印地文|简繁|双字|多语字幕)[^\]]*\]/g, '');
                
                if (cleanedSubtitle2.includes('[') && cleanedSubtitle2.includes(']')) {
                    // 如果还有其他方括号标记，则添加到最后
                    subtitleInput.value = `${cleanedSubtitle2.trim()} ${newSubtitle}`;
                } else {
                    // 否则替换最后一个管道符号后的内容
                    const beforeLastPipe = cleanedSubtitle2.substring(0, cleanedSubtitle2.lastIndexOf('|')).trim();
                    subtitleInput.value = `${beforeLastPipe} | ${newSubtitle}`;
                }
            }
        } else {
            // 如果没有管道符号，则直接添加新的副标题
            // 首先移除现有的语言标记
            const cleanedSubtitle = currentSubtitle.replace(/\[(粤语|国语|英语|日语|韩语|泰语|西班牙语|法语|德语|俄语|意大利语|葡萄牙语|阿拉伯语|印地语|芬兰语|双语|国粤双语|国英双语|粤英双语|粵語|普通话|原音|多语)[^\]]*\]/g, '');
            const cleanedSubtitle2 = cleanedSubtitle.replace(/\[(字幕|中字|简体|繁体|英文|日文|韩文|泰文|西班牙文|法文|德文|俄文|意大利文|葡萄牙文|阿拉伯文|印地文|简繁|双字|多语字幕)[^\]]*\]/g, '');
            
            subtitleInput.value = `${cleanedSubtitle2.trim()} ${newSubtitle}`;
        }

        subtitleInput.classList.remove('green-flash', 'red-flash');
        void subtitleInput.offsetWidth;

        if (audioSuccess || subtitleSuccess) {
            subtitleInput.classList.add('green-flash');
            let resultMsg = audioSuccess && subtitleSuccess ? `成功识别音轨(${audioInfo})和字幕(${subtitleInfo})!` : audioSuccess ? `成功识别音轨(${audioInfo})，未识别到字幕信息` : `成功识别字幕(${subtitleInfo})，未识别到音轨信息`;
            showNotification(resultMsg, "success");
        } else {
            subtitleInput.classList.add('red-flash');
            showNotification("无法识别音轨和字幕信息，请手动检查！", "error");
        }
    }

    // 分析媒体信息
    function analyzeMediaInfo() {
        console.log("开始分析媒体信息...");
        
        const mediaInfoElement = document.querySelector('.bbcode');
        if (!mediaInfoElement) {
            console.error("未找到MediaInfo元素");
            showNotification("未找到MediaInfo元素", "error");
            return;
        }

        const mediaInfoText = mediaInfoElement.textContent || mediaInfoElement.innerText;
        if (!mediaInfoText) {
            console.error("MediaInfo内容为空");
            showNotification("MediaInfo内容为空", "error");
            return;
        }

        const audioTracks = [];
        const subtitleTracks = [];

        try {
            // 直接输出原始MediaInfo文本的一部分，用于调试
            console.log("MediaInfo文本片段:", mediaInfoText.substring(0, 500));
            
            // 尝试匹配音频信息 - 使用更宽松的正则表达式
            const audioBlockRegex = /Audio[\s\S]*?(?=Audio|Text|Menu|$)/gi;
            const audioBlocks = mediaInfoText.match(audioBlockRegex) || [];
            console.log(`找到 ${audioBlocks.length} 个音轨块`);
            
            for (const block of audioBlocks) {
                console.log("音轨块:", block); // 输出整个音轨块用于调试
                
                // 使用更宽松的正则表达式匹配Title
                const titleMatch = /Title\s*:[ \t]*(.+?)(?=\r?\n|$)/i.exec(block);
                if (titleMatch && titleMatch[1].trim()) {
                    const title = titleMatch[1].trim();
                    console.log("找到音轨标题:", title);
                    audioTracks.push(title);
                }
                
                // 使用更宽松的正则表达式匹配Language
                const langMatch = /Language\s*:[ \t]*(.+?)(?=\r?\n|$)/i.exec(block);
                if (langMatch && langMatch[1].trim()) {
                    const lang = langMatch[1].trim();
                    console.log("找到音轨语言:", lang);
                    audioTracks.push(lang);
                }
            }

            // 尝试匹配字幕信息 - 使用更宽松的正则表达式
            const textBlockRegex = /Text[\s\S]*?(?=Text|Audio|Menu|$)/gi;
            const textBlocks = mediaInfoText.match(textBlockRegex) || [];
            console.log(`找到 ${textBlocks.length} 个字幕块`);
            
            for (const block of textBlocks) {
                console.log("字幕块:", block); // 输出整个字幕块用于调试
                
                // 使用更宽松的正则表达式匹配Title
                const titleMatch = /Title\s*:[ \t]*(.+?)(?=\r?\n|$)/i.exec(block);
                if (titleMatch && titleMatch[1].trim()) {
                    const title = titleMatch[1].trim();
                    console.log("找到字幕标题:", title);
                    subtitleTracks.push(title);
                }
                
                // 使用更宽松的正则表达式匹配Language
                const langMatch = /Language\s*:[ \t]*(.+?)(?=\r?\n|$)/i.exec(block);
                if (langMatch && langMatch[1].trim()) {
                    const lang = langMatch[1].trim();
                    console.log("找到字幕语言:", lang);
                    subtitleTracks.push(lang);
                }
            }

            console.log("最终检测到音轨信息:", audioTracks);
            console.log("最终检测到字幕信息:", subtitleTracks);
        } catch (error) {
            console.error("分析媒体信息时出错:", error);
            showNotification("分析媒体信息时发生错误，请手动检查！", "error");
            return;
        }

        updateSubtitle(audioTracks, subtitleTracks);
    }

    // 创建悬浮框
    function createFloatingBox() {
        const floatingBox = document.createElement('div');
        floatingBox.style.position = 'fixed';
        floatingBox.style.top = '50%';
        floatingBox.style.right = '20px';
        floatingBox.style.transform = 'translateY(-50%)';
        floatingBox.style.padding = '15px';
        floatingBox.style.backgroundColor = '#f0f0f0';
        floatingBox.style.border = '1px solid #ccc';
        floatingBox.style.borderRadius = '5px';
        floatingBox.style.zIndex = '10000';
        floatingBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        const title = document.createElement('h4');
        title.innerText = '发种助手控制';
        title.style.margin = '0 0 15px 0';
        title.style.textAlign = 'center';
        floatingBox.appendChild(title);

        // 创建勾选框
        const label = document.createElement('label');
        label.className = 'script-label';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'script-checkbox';
        checkbox.checked = isEnabled;
        
        const labelText = document.createElement('span');
        labelText.innerText = '启用自动识别';
        
        label.appendChild(checkbox);
        label.appendChild(labelText);
        floatingBox.appendChild(label);
        
        // 添加手动识别按钮
        const manualButton = document.createElement('button');
        manualButton.innerText = '手动识别';
        manualButton.className = 'manual-button';
        floatingBox.appendChild(manualButton);

        document.body.appendChild(floatingBox);

        checkbox.addEventListener('change', () => {
            isEnabled = checkbox.checked;
            localStorage.setItem('scriptEnabled', isEnabled);
            if (isEnabled) {
                showNotification("自动识别已启用", "success");
            } else {
                showNotification("自动识别已禁用", "warning");
            }
        });
        
        // 确保手动识别按钮正确绑定事件
        manualButton.onclick = function() {
            console.log("手动识别按钮被点击");
            // 无论是否启用，手动点击都应该执行识别
            analyzeMediaInfo();
        };
    }

    // 初始化
    function init() {
        console.log("初始化脚本...");
        addStyles();
        createFloatingBox();
        
        // 如果插件已启用，延迟执行分析
        if (isEnabled && document.querySelector('.bbcode') && document.querySelector('input[name="small_descr"]')) {
            console.log("页面加载完成，准备分析媒体信息");
            setTimeout(analyzeMediaInfo, 1000);
        }
    }

    // 确保DOM完全加载后再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
