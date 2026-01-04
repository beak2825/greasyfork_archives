// ==UserScript==
// @name         PTESubScore
// @author       小红书743556887
// @version      1.0.0
// @icon         https://mypte.pearsonpte.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/401359
// @description  查看PTEA具体小分以及包含的题型
// @license      MIT
// @match        https://mypte.pearsonpte.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @connect      api.mypte.pearsonpte.com
// @downloadURL https://update.greasyfork.org/scripts/546100/PTESubScore.user.js
// @updateURL https://update.greasyfork.org/scripts/546100/PTESubScore.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function isScorePage() {
        return /^https:\/\/mypte\.pearsonpte\.com\/my-activity\/test-score\/[a-z0-9]+$/.test(location.href);
    }

    function injectScoreButton() {
        const scoreButton = document.createElement('button');
        scoreButton.id = 'pte-score-button';
        scoreButton.innerHTML = '<i class="fas fa-chart-bar"></i> 查看详细小分';
        
        scoreButton.style.position = 'fixed';
        scoreButton.style.bottom = '20px';
        scoreButton.style.left = '50%';
        scoreButton.style.transform = 'translateX(-50%)';
        scoreButton.style.zIndex = '99999';
        scoreButton.style.padding = '10px 20px';
        scoreButton.style.backgroundColor = '#007FA3';
        scoreButton.style.color = 'white';
        scoreButton.style.border = 'none';
        scoreButton.style.borderRadius = '20px';
        scoreButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        scoreButton.style.cursor = 'pointer';
        scoreButton.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        scoreButton.style.fontSize = '14px';
        scoreButton.style.fontWeight = '600';
        scoreButton.style.display = 'flex';
        scoreButton.style.alignItems = 'center';
        scoreButton.style.gap = '8px';
        
        scoreButton.addEventListener('mouseenter', () => {
            scoreButton.style.backgroundColor = '#00698C';
            scoreButton.style.transform = 'translateX(-50%) scale(1.05)';
        });
        scoreButton.addEventListener('mouseleave', () => {
            scoreButton.style.backgroundColor = '#007FA3';
            scoreButton.style.transform = 'translateX(-50%) scale(1)';
        });
        
        scoreButton.addEventListener('click', () => {
            if (window.pteScoreImageData) {
                const previewWindow = window.open('', '_blank');
                previewWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>PTE成绩单预览</title>
                        <style>
                            body { margin:0; background:#f0f2f5; display:flex; justify-content:center; align-items:center; height:100vh; }
                            img { max-width:95%; max-height:95%; box-shadow:0 5px 20px rgba(0,0,0,0.2); border-radius:8px; }
                        </style>
                    </head>
                    <body>
                        <img src="${window.pteScoreImageData}" alt="PTE成绩单">
                    </body>
                    </html>
                `);
                previewWindow.document.close();
            } else {
                alert('成绩单正在生成中，请稍等...');
            }
        });
        document.body.appendChild(scoreButton);
    }

    function main() {

        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._requestUrl = url;
            return originalXHROpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(data) {
            const xhr = this;
            const originalOnReadyStateChange = xhr.onreadystatechange;
            
            xhr.onreadystatechange = function() {
                if (
                    xhr.readyState === 4 && 
                    xhr._requestUrl.includes('https://api.mypte.pearsonpte.com/appointments/api/scorereport/') && !
                    xhr._requestUrl.includes('skills')
                ) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        window.capturedScoreData = data;
                        console.log("✅ 成功拦截 XHR 成绩单数据:", data);
                        const commSkills = data.communicativeSkills || {};
                        const skillsProfile = data.skillsProfile || {};
                        const testDate = data.testDate.replace('T', ' ') || "未知日期";

                        const scores = {
                            overall: data.gseScore || 0,
                            listening: commSkills.listening || 0,
                            reading: commSkills.reading || 0,
                            speaking: commSkills.speaking || 0,
                            writing: commSkills.writing || 0,
                            openResponseSpeakingWriting: skillsProfile.openResponseSpeakingWriting || 0,
                            reproducingSpokenWrittenLanguage: skillsProfile.reproducingSpokenWrittenLanguage || 0,
                            writingExtended: skillsProfile.writingExtended || 0,
                            writingShort: skillsProfile.writingShort || 0,
                            speakingExtended: skillsProfile.speakingExtended || 0,
                            speakingShort: skillsProfile.speakingShort || 0,
                            multipleSkillsComprehension: skillsProfile.multipleSkillsComprehension || 0,
                            singleSkillComprehension: skillsProfile.singleSkillComprehension || 0
                        };

                        generateScoreReportImage(testDate, scores, function(base64Image) {
                            window.pteScoreImageData = base64Image;
                            const Button = document.getElementById('pte-score-button');
                            Button.style.display = 'block'
                        });

                        const event = new CustomEvent('PTEScoreDataCaptured', { detail: data });
                        window.dispatchEvent(event);
                    } catch (e) {
                        console.error("❌ 解析 XHR 响应失败:", e);
                    }
                }
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(xhr, arguments);
                }
            };
            return originalXHRSend.apply(this, arguments);
        };

    }

    // 监听路由变化（SPA跳转）
    function monitorSPARouting() {
        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function() {
            pushState.apply(this, arguments);
            checkPageChange();
        };

        history.replaceState = function() {
            replaceState.apply(this, arguments);
            checkPageChange();
        };

        window.addEventListener('popstate', checkPageChange);
    }

    function checkPageChange() {
        if (isScorePage()) {
            main();
        } else {
            const Button = document.getElementById('pte-score-button');
            Button.style.display = 'none';
        }
    }

    window.pteScoreImageData = null;
    if (isScorePage()) {
        window.addEventListener('DOMContentLoaded', main);
    } else {
        monitorSPARouting();
    }
    injectScoreButton();
    const Button = document.getElementById('pte-score-button');
    Button.style.display = 'none';

    /**
     * 生成PTE成绩单图片
     * @param {string} testDate - 测试日期 (格式: YYYY-MM-DD)
     * @param {object} scores - 包含所有成绩数据的对象
     * @param {function} callback - 处理完成后的回调函数，接收Base64图片数据
     */
    function generateScoreReportImage(testDate, scores, callback) {
        // 确保所有成绩数据存在或使用默认值0
        const safeScores = {
            overall: scores.overall || 0,
            listening: scores.listening || 0,
            reading: scores.reading || 0,
            speaking: scores.speaking || 0,
            writing: scores.writing || 0,
            openResponseSpeakingWriting: scores.openResponseSpeakingWriting || 0,
            reproducingSpokenWrittenLanguage: scores.reproducingSpokenWrittenLanguage || 0,
            writingExtended: scores.writingExtended || 0,
            writingShort: scores.writingShort || 0,
            speakingExtended: scores.speakingExtended || 0,
            speakingShort: scores.speakingShort || 0,
            multipleSkillsComprehension: scores.multipleSkillsComprehension || 0,
            singleSkillComprehension: scores.singleSkillComprehension || 0
        };

        // 创建临时容器
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '1000px';
        container.style.height = 'auto';
        document.body.appendChild(container);

        // 生成成绩单HTML
        container.innerHTML = generateScoreHTML(testDate, safeScores);

        // 使用html2canvas生成图片
        html2canvas(container).then(canvas => {
            // 转换为Base64
            const base64Image = canvas.toDataURL('image/png');

            // 清理临时容器
            document.body.removeChild(container);

            // 返回Base64图片数据
            callback(base64Image);
        });
    }

    /**
     * 生成成绩单HTML内容
     * @param {string} testDate - 日期
     * @param {object} scores - 成绩数据
     * @returns {string} - 成绩单HTML字符串
     */
    function generateScoreHTML(testDate, scores) {
        // 计算进度条宽度（满分90）
        const calculateWidth = (score) => {
            return Math.min(100, (score / 90 * 100)).toFixed(1);
        };

        return `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PTE Academic Score Report</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                body {
                    background: #f0f3f7;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 15px;
                    color: #333;
                }

                .container {
                    width: 1000px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                }

                /* PTE官方主色调 */
                :root {
                    --pte-primary: #007FA3;
                    --pte-primary-dark: #00698C;
                    --pte-accent: #00A3B0;
                    --pte-light: #E6F4F7;
                }

                header {
                    background: linear-gradient(135deg, var(--pte-primary) 0%, var(--pte-primary-dark) 100%);
                    color: white;
                    padding: 12px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .logo-icon {
                    font-size: 20px;
                    background: white;
                    color: var(--pte-primary);
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .logo-text {
                    font-size: 18px;
                    font-weight: 600;
                }

                .user-info {
                    text-align: right;
                    font-size: 12px;
                }

                .overall-container {
                    background: var(--pte-light);
                    padding: 10px 20px;
                    border-bottom: 1px solid #d1e7ed;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .overall-score {
                    background: white;
                    border-radius: 6px;
                    padding: 10px 20px;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
                    text-align: center;
                    min-width: 180px;
                    border: 1px solid #d1e7ed;
                }

                .overall-label {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--pte-primary);
                    margin-bottom: 3px;
                }

                .overall-value {
                    font-size: 34px;
                    font-weight: 700;
                    color: var(--pte-primary);
                    line-height: 1;
                }

                .score-summary {
                    padding: 12px 20px;
                    background: var(--pte-light);
                    border-bottom: 1px solid #d1e7ed;
                }

                .score-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: var(--pte-primary);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .score-title i {
                    font-size: 16px;
                    color: var(--pte-primary);
                }

                .score-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }

                .score-card {
                    background: white;
                    border-radius: 5px;
                    padding: 10px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
                    text-align: center;
                    border: 1px solid #e1f0f4;
                }

                .skill-name {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 6px;
                    color: #2c3e50;
                }

                .score-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--pte-primary);
                    margin-bottom: 3px;
                }

                .sub-skills {
                    padding: 12px 20px;
                    background: white;
                }

                .sub-skills-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .sub-skill-card {
                    background: white;
                    border-radius: 5px;
                    padding: 10px;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
                    border: 1px solid #e1f0f4;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .sub-skill-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    padding-bottom: 6px;
                    border-bottom: 1px solid #e1f0f4;
                }

                .sub-skill-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #2c3e50;
                    flex: 1;
                    padding-right: 8px;
                }

                .score-container {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .skill-icons {
                    display: flex;
                    gap: 3px;
                }

                .skill-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    color: #5a6d79;
                    background: #f0f5f7;
                    border: 1px solid #d1e7ed;
                }

                .sub-skill-score {
                    font-size: 20px;
                    font-weight: 7;
                    color: var(--pte-primary);
                }

                .skill-types {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-bottom: 8px;
                    min-height: 30px;
                }

                .skill-type {
                    background: #e6f4f7;
                    color: var(--pte-primary);
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                    font-weight: 500;
                    white-space: nowrap;
                    border: 1px solid #c5e4ed;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .skill-bar-container {
                    height: 5px;
                    background: #e1f0f4;
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: auto;
                    position: relative;
                }

                .skill-bar {
                    height: 100%;
                    background: linear-gradient(90deg, var(--pte-primary), var(--pte-accent));
                    border-radius: 2px;
                }

                .skill-value {
                    position: absolute;
                    right: 3px;
                    top: -16px;
                    font-size: 10px;
                    font-weight: 600;
                    color: var(--pte-primary);
                }

                footer {
                    background: var(--pte-light);
                    padding: 10px 20px;
                    text-align: center;
                    color: #5a6d79;
                    font-size: 10px;
                    border-top: 1px solid #d1e7ed;
                    display: flex;
                    justify-content: space-between;
                }

                .footer-left {
                    text-align: left;
                }

                .footer-right {
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div class="logo">
                        <div class="logo-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="logo-text">PTE Academic Score Report</div>
                    </div>
                    <div class="user-info">
                        <p>Test Date: ${testDate}</p>
                    </div>
                </header>

                <!-- Overall Score Section -->
                <div class="overall-container">
                    <div class="overall-score">
                        <div class="overall-label">Overall</div>
                        <div class="overall-value">${scores.overall}</div>
                    </div>
                </div>

                <div class="score-summary">
                    <div class="score-title">
                        <i class="fas fa-chart-line"></i>
                        <span>Your PTE Academic score</span>
                    </div>
                    <div class="score-grid">
                        <div class="score-card">
                            <div class="skill-name">Listening</div>
                            <div class="score-value">${scores.listening}</div>
                        </div>
                        <div class="score-card">
                            <div class="skill-name">Reading</div>
                            <div class="score-value">${scores.reading}</div>
                        </div>
                        <div class="score-card">
                            <div class="skill-name">Speaking</div>
                            <div class="score-value">${scores.speaking}</div>
                        </div>
                        <div class="score-card">
                            <div class="skill-name">Writing</div>
                            <div class="score-value">${scores.writing}</div>
                        </div>
                    </div>
                </div>

                <div class="sub-skills">
                    <div class="score-title">
                        <i class="fas fa-list-alt"></i>
                        <span>Sub-Skills Score</span>
                    </div>
                    <div class="sub-skills-grid">
                        <!-- Open Response Speaking and Writing -->
                        <div class="sub-skill-card">
                            <div class="sub-skill-header">
                                <div class="sub-skill-title">Open Response Speaking and Writing</div>
                                <div class="score-container">
                                    <div class="skill-icons">
                                        <div class="skill-icon"><i class="fas fa-comments"></i></div>
                                        <div class="skill-icon"><i class="fas fa-pen-nib"></i></div>
                                    </div>
                                    <div class="sub-skill-score">${scores.openResponseSpeakingWriting}</div>
                                </div>
                            </div>
                            <div class="skill-types">
                                <div class="skill-type">WE</div>
                                <div class="skill-type">DI</div>
                                <div class="skill-type">RL</div>
                                <div class="skill-type">SGD</div>
                                <div class="skill-type">RTS</div>
                                <div class="skill-type">SWT</div>
                                <div class="skill-type">SST</div>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar" style="width: ${calculateWidth(scores.openResponseSpeakingWriting)}%"></div>
                                <div class="skill-value">${scores.openResponseSpeakingWritings}/90</div>
                            </div>
                        </div>

                        <!-- Reproducing Spoken and Written Language -->
                        <div class="sub-skill-card">
                            <div class="sub-skill-header">
                                <div class="sub-skill-title">Reproducing Spoken and Written Language</div>
                                <div class="score-container">
                                    <div class="skill-icons">
                                        <div class="skill-icon"><i class="fas fa-comments"></i></div>
                                        <div class="skill-icon"><i class="fas fa-pen-nib"></i></div>
                                    </div>
                                    <div class="sub-skill-score">${scores.reproducingSpokenWrittenLanguage}</div>
                                </div>
                            </div>
                            <div class="skill-types">
                                <div class="skill-type">RA</div>
                                <div class="skill-type">RS</div>
                                <div class="skill-type">WFD</div>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar" style="width: ${calculateWidth(scores.reproducingSpokenWrittenLanguage)}%"></div>
                                <div class="skill-value">${scores.reproducingSpokenWrittenLanguage}/90</div>
                            </div>
                        </div>

                        <!-- Extended Writing -->
                        <div class="sub-skill-card">
                            <div class="sub-skill-header">
                                <div class="sub-skill-title">Extended Writing</div>
                                <div class="score-container">
                                    <div class="skill-icons">
                                        <div class="skill-icon"><i class="fas fa-pen-nib"></i></div>
                                    </div>
                                    <div class="sub-skill-score">${scores.writingExtended}</div>
                                </div>
                            </div>
                            <div class="skill-types">
                                <div class="skill-type">SWT</div>
                                <div class="skill-type">WE</div>
                                <div class="skill-type">SST</div>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar" style="width: ${calculateWidth(scores.writingExtended)}%"></div>
                                <div class="skill-value">${scores.writingExtended}/90</div>
                            </div>
                        </div>

                        <!-- Short Writing -->
                        <div class="sub-skill-card">
                            <div class="sub-skill-header">
                                <div class="sub-skill-title">Short Writing</div>
                                <div class="score-container">
                                    <div class="skill-icons">
                                        <div class="skill-icon"><i class="fas fa-pen-nib"></i></div>
                                    </div>
                                    <div class="sub-skill-score">${scores.writingShort}</div>
                                </div>
                            </div>
                            <div class="skill-types">
                                <div class="skill-type">WFD</div>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar" style="width: ${calculateWidth(scores.writingShort)}%"></div>
                                <div class="skill-value">${scores.writingShort}/90</div>
                            </div>
                        </div>

                        <!-- Extended Speaking -->
                        <div class="sub-skill-card">
                            <div class="sub-skill-header">
                                <div class="sub-skill-title">Extended Speaking</div>
                                <div class="score-container">
                                    <div class="skill-icons">
                                        <div class="skill-icon"><i class="fas fa-comments"></i></div>
                                    </div>
                                    <div class="sub-skill-score">${scores.speakingExtended}</div>
                                </div>
                            </div>
                            <div class="skill-types">
                                <div class="skill-type">DI</div>
                                <div class="skill-type">RL</div>
                                <div class="skill-type">SGD</div>
                                <div class="skill-type">RTS</div>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar" style="width: ${calculateWidth(scores.speakingExtended)}%"></div>
                                <div class="skill-value">${scores.speakingExtended}/90</div>
                            </div>
                        </div>

                        <!-- Short Speaking -->
                        <div class="sub-skill-card">
                            <div class="sub-skill-header">
                                <div class="sub-skill-title">Short Speaking</div>
                                <div class="score-container">
                                    <div class="skill-icons">
                                        <div class="skill-icon"><i class="fas fa-comments"></i></div>
                                    </div>
                                    <div class="sub-skill-score">${scores.speakingShort}</div>
                                </div>
                            </div>
                            <div class="skill-types">
                                <div class="skill-type">RA</div>
                                <div class="skill-type">RS</div>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar" style="width: ${calculateWidth(scores.speakingShort)}%"></div>
                                <div class="skill-value">${scores.speakingShort}/90</div>
                            </div>
                        </div>

                        <!-- Multiple-skills Comprehension -->
                        <div class="sub-skill-card">
                            <div class="sub-skill-header">
                                <div class="sub-skill-title">Multiple-skills Comprehension</div>
                                <div class="score-container">
                                    <div class="skill-icons">
                                        <div class="skill-icon"><i class="fas fa-headphones"></i></div>
                                        <div class="skill-icon"><i class="fas fa-book-reader"></i></div>
                                    </div>
                                    <div class="sub-skill-score">${scores.multipleSkillsComprehension}</div>
                                </div>
                            </div>
                            <div class="skill-types">
                                <div class="skill-type">RS</div>
                                <div class="skill-type">RL</div>
                                <div class="skill-type">SGD</div>
                                <div class="skill-type">SWT</div>
                                <div class="skill-type">HCS</div>
                                <div class="skill-type">HIW</div>
                                <div class="skill-type">WFD</div>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar" style="width: ${calculateWidth(scores.multipleSkillsComprehension)}%"></div>
                                <div class="skill-value">${scores.multipleSkillsComprehension}/90</div>
                            </div>
                        </div>

                        <!-- Single-Skill Comprehension -->
                        <div class="sub-skill-card">
                            <div class="sub-skill-header">
                                <div class="sub-skill-title">Single-Skill Comprehension</div>
                                <div class="score-container">
                                    <div class="skill-icons">
                                        <div class="skill-icon"><i class="fas fa-headphones"></i></div>
                                        <div class="skill-icon"><i class="fas fa-book-reader"></i></div>
                                    </div>
                                    <div class="sub-skill-score">${scores.singleSkillComprehension}</div>
                                </div>
                            </div>
                            <div class="skill-types">
                                <div class="skill-type">ASQ</div>
                                <div class="skill-type">FIB-D</div>
                                <div class="skill-type">R-MC-MA</div>
                                <div class="skill-type">RO</div>
                                <div class="skill-type">FIB-DD</div>
                                <div class="skill-type">R-MC-SA</div>
                                <div class="skill-type">L-MC-MA</div>
                                <div class="skill-type">L-FIB</div>
                                <div class="skill-type">HCS</div>
                                <div class="skill-type">L-MC-SA</div>
                                <div class="skill-type">SMW</div>
                            </div>
                            <div class="skill-bar-container">
                                <div class="skill-bar" style="width: ${calculateWidth(scores.singleSkillComprehension)}%"></div>
                                <div class="skill-value">${scores.singleSkillComprehension}/90</div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer>
                    <div class="footer-right">
                        <p>Developed by RedNotes 7435568887.</p>
                    </div>
                </footer>
            </div>
        </body>
        </html>
        `;
    }
})();