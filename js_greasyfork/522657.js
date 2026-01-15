/*
 * File: ly-certification.js
 * Project: ly-certification
 * Created: 2025-01-03 10:39:28
 * Author: Victor Cheng
 * Email: hi@victor42.work
 * Description: 瓴羊刷题助手
 */

// 写一个Tampermonkey脚本
// 用在 https://cert.lydaas.com/cert-ly-online/exam/test 开头的网页
// 往页面上增加一个悬浮的 "导出答题记录" 按钮
// 点击这个按钮，查找文字内容为 "考试进度详情" 的div，然后找到它的下一个sibling节点，模拟点击这个节点里所有的子div节点
// 每次模拟点击，都把class名以 "_rightContent" 开头的div里的内容记录下来，具体要记录这些：
// 1. 题型：class名以 "_questionType" 开头的节点里的文本内容
// 2. 题干：class名以 "_questionContent" 开头的节点里的文本内容
// 3. 选项：把class名以 "_optionText" 开头的所有节点里的文本内容拼接在一起，分隔符是 " | "，拼接时，按顺序给每个节点里的文本内容前面加上序号，例如 "A: 文本内容 | B: 文本内容 | C: 文本内容 | D: 文本内容"
// 4. 正确答案：class名以 "_correctAnswers" 开头的节点里的span的文本内容
// 5. 我的答案：class名以 "_selectedAnswer" 开头的节点里的span的文本内容
// 6. 题目解析：内容以 "解析：" 开头的div里的span节点里的文本内容
// 7. 结果：查看class名以 "_selectedAnswer" 开头的节点里的span的文本内容，如果是 "未答题"，结果就是 "未答题"，否则把它与class名以 "_correctAnswers" 开头的节点里的span的文本内容比对，如果相同则结果为 "正确"，否则为 "错误"
// 所有模拟点击都完成后，把采集到的数据以一个csv文件形式存下来，csv的表头如下：题型 | 题干 | 选项 | 正确答案 | 我的答案 | 题目解析 | 结果
// 保存的文件名为当前时间加上 ".csv" 后缀，时间格式为 "ly_exam_YYYYMMDD_HHMMSS"，例如 "ly_exam_20230101_123456.csv"

// ==UserScript==
// @name         瓴羊刷题助手
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  导出瓴羊考试答题记录
// @author       Victor Cheng
// @match        https://cert.lydaas.com/cert-ly-online/exam/test*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522657/%E7%93%B4%E7%BE%8A%E5%88%B7%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522657/%E7%93%B4%E7%BE%8A%E5%88%B7%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加键盘事件监听
    document.addEventListener('keydown', (event) => {
        console.log('键盘事件触发:', event.code);
        
        // 检查是否按下空格键且不是在输入框中
        if (event.code === 'Space' && 
            !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            // 阻止默认的空格滚动行为
            event.preventDefault();
            
            // 查找并点击下一题按钮
            const nextButton = document.querySelector('[class^="ant-btn _next"]');
            console.log('找到下一题按钮:', nextButton);
            
            if (nextButton) {
                console.log('点击下一题按钮');
                nextButton.click();
            } else {
                console.log('没有找到下一题按钮，可能的class名:', 
                    Array.from(document.querySelectorAll('button'))
                        .map(btn => btn.className)
                        .join(', ')
                );
            }
        }
    });

    // 创建悬浮按钮
    const floatingButton = document.createElement('button');
    floatingButton.textContent = '导出答题记录';
    floatingButton.style.cssText = `
        position: fixed;
        left: 16px;
        bottom: 16px;
        z-index: 9999;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
    document.body.appendChild(floatingButton);

    // 点击事件处理
    floatingButton.addEventListener('click', async () => {
        // 禁用按钮，避免重复点击
        floatingButton.disabled = true;
        floatingButton.textContent = '导出中...';
        
        try {
            const records = [];
            
            // 查找考试进度详情div的下一个兄弟节点
            const progressDiv = Array.from(document.querySelectorAll('div')).find(div => div.textContent.trim() === '考试进度详情');
            console.log('找到考试进度详情:', progressDiv);
            if (!progressDiv) {
                throw new Error('未找到考试进度详情');
            }
            
            const questionList = progressDiv.nextElementSibling;
            console.log('题目列表节点:', questionList);
            if (!questionList) {
                throw new Error('未找到题目列表');
            }

            // 修改选择器以匹配实际的题目 div
            const questionDivs = questionList.querySelectorAll('[class^="_sheet_"]');
            const totalQuestions = questionDivs.length;
            console.log('找到题目数量:', totalQuestions);

            // 遍历每个题目
            for (let i = 0; i < totalQuestions; i++) {
                const div = questionDivs[i];
                console.log(`处理第 ${i + 1} 题，class名：${div.className}`);
                
                // 更新按钮文本显示进度
                floatingButton.textContent = `导出中...(${i + 1}/${totalQuestions})`;
                
                // 模拟点击
                div.click();
                console.log('已点击题目');
                
                // 等待内容加载
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 获取题目内容区域
                const rightContent = document.querySelector('[class^="_rightContent"]');
                console.log('题目内容区域:', rightContent);
                if (!rightContent) {
                    console.warn('未找到题目内容区域');
                    continue;
                }

                // 获取各项内容
                const questionType = rightContent.querySelector('[class^="_questionType"]')?.textContent?.trim() || '';
                const questionContent = rightContent.querySelector('[class^="_questionContent"]')?.textContent?.trim() || '';
                console.log('题型:', questionType);
                console.log('题干:', questionContent);
                
                // 获取选项
                const options = Array.from(rightContent.querySelectorAll('[class^="_optionText"]'));
                console.log('选项数量:', options.length);
                const optionsText = options.map((opt, idx) => 
                    `${String.fromCharCode(65 + idx)}: ${opt.textContent.trim()}`
                ).join(' | ');
                console.log('选项内容:', optionsText);

                const correctAnswer = rightContent.querySelector('[class^="_correctAnswers"] span')?.textContent?.trim() || '';
                const myAnswer = rightContent.querySelector('[class^="_selectedAnswer"] span')?.textContent?.trim() || '';
                console.log('正确答案:', correctAnswer);
                console.log('我的答案:', myAnswer);
                
                // 获取解析
                const analysisDiv = Array.from(rightContent.querySelectorAll('div')).find(div => 
                    div.textContent.trim().startsWith('解析：'));
                const analysis = analysisDiv?.querySelector('span')?.textContent?.trim() || '';
                console.log('题目解析:', analysis);

                // 判断结果
                let result = '未答题';
                if (myAnswer && myAnswer !== '未答题') {
                    result = myAnswer === correctAnswer ? '正确' : '错误';
                }

                records.push({
                    题型: questionType,
                    题干: questionContent,
                    选项: optionsText,
                    正确答案: correctAnswer,
                    我的答案: myAnswer,
                    题目解析: analysis,
                    结果: result
                });
            }

            // 生成CSV内容
            const headers = ['题型', '题干', '选项', '正确答案', '我的答案', '题目解析', '结果'];
            const csvRows = [
                headers.join(','),
                ...records.map(record => 
                    headers.map(header => 
                        `"${(record[header] || '').toString().replace(/"/g, '""')}"`
                    ).join(',')
                )
            ];
            
            const csvContent = '\ufeff' + csvRows.join('\n'); // 添加BOM标记以支持中文

            // 下载CSV文件
            const now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000); // 转换为北京时间
            const timestamp = now.toISOString()
                .replace(/[-:]/g, '')
                .replace(/T/, '_')
                .replace(/\..+/, '');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `ly_exam_${timestamp}.csv`;
            link.click();

            // 恢复按钮状态
            floatingButton.textContent = '导出完成';
            setTimeout(() => {
                floatingButton.disabled = false;
                floatingButton.textContent = '导出答题记录';
            }, 2000);

        } catch (error) {
            alert('导出失败: ' + error.message);
            // 恢复按钮状态
            floatingButton.disabled = false;
            floatingButton.textContent = '导出答题记录';
        }
    });
})();
