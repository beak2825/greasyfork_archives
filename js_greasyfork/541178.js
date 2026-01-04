// ==UserScript==
// @name         电子科技大学研究生自动评教脚本  
// @version      1.0
// @description  电子科技大学自动评教脚本,只需要进到评教界面（打星那个界面）点击运行即可,最后要手动点一下提交
// @author       Suzuran
// @match        https://eams.uestc.edu.cn/eams/*
// @license      MIT
// @namespace https://greasyfork.org/users/1490242
// @downloadURL https://update.greasyfork.org/scripts/541178/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541178/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 自动评教脚本 - 选择所有"非常符合"选项并提交
(function() {
    console.log('开始自动评教...');

    // 选择所有"非常符合"选项的函数
    function selectAllVeryGood() {
        let selectedCount = 0;
        
        // 方法1: 查找所有单选按钮组
        const radioGroups = document.querySelectorAll('.ant-radio-group');
        console.log('找到' + radioGroups.length + '个选项组');

        radioGroups.forEach((group, index) => {
            // 在每个组中查找"非常符合"选项（通常value="1"）
            const veryGoodOption = group.querySelector('input[type="radio"][value="1"]');
            if (veryGoodOption && !veryGoodOption.checked) {
                // 先点击label来触发选择
                const label = veryGoodOption.closest('.ant-radio-wrapper');
                if (label) {
                    label.click();
                    selectedCount++;
                    console.log('已选择第' + (index + 1) + '个问题的"非常符合"');
                }
                
                // 备用方法：直接设置checked并触发事件
                setTimeout(() => {
                    veryGoodOption.checked = true;
                    const changeEvent = new Event('change', { bubbles: true });
                    const clickEvent = new Event('click', { bubbles: true });
                    veryGoodOption.dispatchEvent(changeEvent);
                    veryGoodOption.dispatchEvent(clickEvent);
                }, 100);
            } else if (veryGoodOption && veryGoodOption.checked) {
                console.log('第' + (index + 1) + '个问题已经选择了"非常符合"');
            }
        });

        // 方法2: 直接通过文本内容查找"非常符合"选项
        const allRadioLabels = document.querySelectorAll('.ant-radio-wrapper');
        allRadioLabels.forEach((label, index) => {
            const textContent = label.textContent.trim();
            if (textContent.includes('非常符合') && !textContent.includes('非常不符合')) {
                const radioInput = label.querySelector('input[type="radio"]');
                if (radioInput && !radioInput.checked) {
                    label.click();
                    selectedCount++;
                    console.log('通过文本匹配选择了第' + (index + 1) + '个"非常符合"选项');
                }
            }
        });

        return selectedCount;
    }

    // 验证是否所有问题都已选择
    function validateAllSelected() {
        const radioGroups = document.querySelectorAll('.ant-radio-group');
        let unselectedCount = 0;
        
        radioGroups.forEach((group, index) => {
            const selectedRadio = group.querySelector('input[type="radio"]:checked');
            if (!selectedRadio) {
                unselectedCount++;
                console.log('第' + (index + 1) + '个问题未选择');
            }
        });

        console.log('验证结果：共' + radioGroups.length + '个问题，' + unselectedCount + '个未选择');
        return unselectedCount === 0;
    }

    // 处理提交成功后的弹出框
    function handleSuccessModal() {
        console.log('监听提交成功弹出框...');
        
        // 定期检查弹出框是否出现
        const checkModalInterval = setInterval(function() {
            const modal = document.querySelector('.ant-modal-content');
            if (modal && modal.textContent.includes('提交成功')) {
                console.log('✅ 检测到提交成功弹出框');
                clearInterval(checkModalInterval);
                
                // 等待1秒后点击按钮
                setTimeout(function() {
                    const buttons = modal.querySelectorAll('button');
                    console.log('找到' + buttons.length + '个按钮');
                    
                    let targetButton = null;
                    
                    // 遍历所有按钮，找到目标按钮
                    for (let i = 0; i < buttons.length; i++) {
                        const btn = buttons[i];
                        const btnText = btn.textContent.trim();
                        console.log('按钮' + (i + 1) + '：' + btnText);
                        
                        if (btnText.includes('下一位教师') || btnText.includes('下一门课程')) {
                            targetButton = btn;
                            break;
                        }
                    }
                    
                    if (targetButton) {
                        const btnText = targetButton.textContent.trim();
                        console.log('🎯 找到目标按钮："' + btnText + '"，准备点击...');
                        
                        // 滚动到按钮位置
                        targetButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        setTimeout(function() {
                            targetButton.click();
                            console.log('✅ 已成功点击"' + btnText + '"按钮');
                            
                            // 等待页面跳转后重新启动评教流程
                            setTimeout(function() {
                                console.log('🔄 准备处理下一个评教页面...');
                                startEvaluation();
                            }, 3000);
                        }, 500);
                    } else {
                        console.log('❌ 未找到"下一位教师"或"下一门课程"按钮');
                        console.log('可用按钮：');
                        buttons.forEach((btn, index) => {
                            console.log('  ' + (index + 1) + '. ' + btn.textContent.trim());
                        });
                    }
                }, 1000);
            }
        }, 500); // 每500ms检查一次
        
        // 10秒后停止检查
        setTimeout(function() {
            clearInterval(checkModalInterval);
            console.log('⏰ 弹出框检查超时');
        }, 10000);
    }

    // 提交表单的函数
    function submitForm() {
        const submitButton = document.querySelector('.index__submitContext--xZR4w button');
        if (submitButton) {
            console.log('找到提交按钮，准备点击...');
            
            // 先设置弹出框监听
            handleSuccessModal();
            
            // 滚动到提交按钮位置
            submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 等待滚动完成后点击
            setTimeout(function() {
                submitButton.click();
                console.log('已点击提交按钮，等待成功提示...');
            }, 1000);
            return true;
        } else {
            console.log('未找到主提交按钮，尝试备用按钮...');
            // 尝试其他选择器
            const altSubmitButton = document.querySelector('.ant-btn-primary');
            if (altSubmitButton && altSubmitButton.textContent.includes('提交')) {
                console.log('找到备用提交按钮');
                
                // 先设置弹出框监听
                handleSuccessModal();
                
                altSubmitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(function() {
                    altSubmitButton.click();
                    console.log('已点击备用提交按钮，等待成功提示...');
                }, 1000);
                return true;
            }
        }
        return false;
    }

    // 主评教流程函数
    function startEvaluation() {
        console.log('开始评教流程...');
        
        // 检查是否存在评教表单
        const radioGroups = document.querySelectorAll('.ant-radio-group');
        if (radioGroups.length === 0) {
            console.log('当前页面没有找到评教表单，可能已经完成或页面未加载');
            return;
        }
        
        // 第一步：选择所有"非常符合"选项
        const selectedCount = selectAllVeryGood();
        console.log('第一轮选择完成，选择了' + selectedCount + '个选项');

        // 第二步：等待2秒后验证选择结果
        setTimeout(function() {
            console.log('开始验证选择结果...');
            const allSelected = validateAllSelected();
            
            if (allSelected) {
                console.log('✅ 所有问题都已选择，准备提交...');
                setTimeout(function() {
                    const submitted = submitForm();
                    if (!submitted) {
                        console.log('❌ 未找到提交按钮，请手动提交或调用 manualSubmit()');
                    }
                }, 2000);
            } else {
                console.log('⚠️ 仍有问题未选择，尝试第二轮选择...');
                // 第二轮选择
                setTimeout(function() {
                    selectAllVeryGood();
                    setTimeout(function() {
                        const finalCheck = validateAllSelected();
                        if (finalCheck) {
                            console.log('✅ 第二轮选择成功，准备提交...');
                            setTimeout(function() {
                                const submitted = submitForm();
                                if (!submitted) {
                                    console.log('❌ 未找到提交按钮，请手动提交或调用 manualSubmit()');
                                }
                            }, 2000);
                        } else {
                            console.log('❌ 仍有问题未能自动选择，请手动检查后调用 manualSubmit()');
                            console.log('或者刷新页面重新运行脚本');
                        }
                    }, 2000);
                }, 1000);
            }
        }, 2000);
    }

    // 主执行流程
    setTimeout(function() {
        try {
            startEvaluation();
        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }, 2000);

    // 手动选择所有"非常符合"的函数
    window.selectAll = function() {
        console.log('手动执行选择所有"非常符合"...');
        const radioGroups = document.querySelectorAll('.ant-radio-group');
        let count = 0;
        
        radioGroups.forEach((group, index) => {
            const veryGoodOption = group.querySelector('input[type="radio"][value="1"]');
            if (veryGoodOption) {
                const label = veryGoodOption.closest('.ant-radio-wrapper');
                if (label) {
                    label.click();
                    count++;
                }
            }
        });
        
        console.log('手动选择完成，共选择了' + count + '个选项');
        setTimeout(() => {
            const allSelected = document.querySelectorAll('.ant-radio-group').length === 
                              document.querySelectorAll('.ant-radio-group input[type="radio"]:checked').length;
            console.log('验证结果：' + (allSelected ? '✅ 所有选项已选择' : '❌ 仍有选项未选择'));
        }, 1000);
    };

    // 手动验证选择状态的函数
    window.checkStatus = function() {
        console.log('检查当前选择状态...');
        const radioGroups = document.querySelectorAll('.ant-radio-group');
        const checkedGroups = document.querySelectorAll('.ant-radio-group input[type="radio"]:checked');
        
        console.log('总问题数：' + radioGroups.length);
        console.log('已选择问题数：' + checkedGroups.length);
        
        radioGroups.forEach((group, index) => {
            const selectedRadio = group.querySelector('input[type="radio"]:checked');
            if (selectedRadio) {
                const label = selectedRadio.closest('.ant-radio-wrapper');
                const text = label ? label.textContent.trim() : selectedRadio.value;
                console.log('问题' + (index + 1) + '：已选择 - ' + text);
            } else {
                console.log('问题' + (index + 1) + '：❌ 未选择');
            }
        });
        
        return checkedGroups.length === radioGroups.length;
    };

    // 手动处理提交成功弹出框的函数
    window.handleModal = function() {
        console.log('手动处理提交成功弹出框...');
        const modal = document.querySelector('.ant-modal-content');
        if (modal && modal.textContent.includes('提交成功')) {
            console.log('✅ 找到提交成功弹出框');
            const buttons = modal.querySelectorAll('button');
            console.log('弹出框中有' + buttons.length + '个按钮：');
            
            let targetButton = null;
            
            buttons.forEach((btn, index) => {
                const btnText = btn.textContent.trim();
                console.log('  按钮' + (index + 1) + '：' + btnText);
                
                if (btnText.includes('下一位教师') || btnText.includes('下一门课程')) {
                    targetButton = btn;
                }
            });
            
            if (targetButton) {
                const btnText = targetButton.textContent.trim();
                console.log('🎯 找到目标按钮："' + btnText + '"，点击中...');
                targetButton.click();
                console.log('✅ 已点击"' + btnText + '"按钮');
                
                // 等待页面跳转后重新启动评教
                setTimeout(function() {
                    console.log('🔄 重新启动评教流程...');
                    startEvaluation();
                }, 3000);
                
                return true;
            } else {
                console.log('❌ 未找到"下一位教师"或"下一门课程"按钮');
            }
        } else {
            console.log('❌ 未找到提交成功弹出框');
        }
        return false;
    };

    // 重新启动评教流程的函数
    window.restartEvaluation = function() {
        console.log('重新启动评教流程...');
        setTimeout(function() {
            startEvaluation();
        }, 1000);
    };

    // 备用方法：手动提交
    window.manualSubmit = function() {
        console.log('执行手动提交...');
        
        // 先检查是否所有问题都已选择
        const allSelected = window.checkStatus();
        if (!allSelected) {
            console.log('⚠️ 警告：仍有问题未选择，是否继续提交？');
            console.log('如需继续，请再次调用 manualSubmit(true)');
            return;
        }
        
        const submitButton = document.querySelector('.index__submitContext--xZR4w button') || 
                           document.querySelector('.ant-btn-primary');
        if (submitButton) {
            // 先设置弹出框监听
            handleSuccessModal();
            
            submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                submitButton.click();
                console.log('✅ 手动提交完成，等待成功提示...');
            }, 500);
        } else {
            console.log('❌ 未找到提交按钮');
        }
    };

    // 强制提交（跳过验证）
    window.forceSubmit = function() {
        console.log('执行强制提交（跳过验证）...');
        const submitButton = document.querySelector('.index__submitContext--xZR4w button') || 
                           document.querySelector('.ant-btn-primary');
        if (submitButton) {
            submitButton.click();
            console.log('强制提交完成');
        } else {
            console.log('未找到提交按钮');
        }
    };

    console.log('脚本已加载完成！');
    console.log('📋 可用函数：');
    console.log('- selectAll(): 手动选择所有"非常符合"');
    console.log('- checkStatus(): 检查当前选择状态');
    console.log('- manualSubmit(): 验证后提交（包含弹出框处理）');
    console.log('- forceSubmit(): 强制提交（跳过验证）');
    console.log('- handleModal(): 手动处理提交成功弹出框');
    console.log('- restartEvaluation(): 重新启动评教流程');
    console.log('');
    console.log('🚀 脚本将自动执行以下流程：');
    console.log('1. 选择所有"非常符合"选项');
    console.log('2. 验证选择结果');
    console.log('3. 提交表单');
    console.log('4. 自动处理成功弹出框');
    console.log('5. 自动点击"下一位教师"或"下一门课程"');
    console.log('6. 重新开始下一个评教流程');
})();
