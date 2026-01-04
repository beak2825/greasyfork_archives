// ==UserScript==
// @name         木马自动批改
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  务必低调使用，勿公开，勿群发！
// @author       You
// @match        https://muma.com/teacherCenter/teacherManager/correct*
// @match        https://www.muma.com/teacherCenter/teacherManager/correct*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/424146/%E6%9C%A8%E9%A9%AC%E8%87%AA%E5%8A%A8%E6%89%B9%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/424146/%E6%9C%A8%E9%A9%AC%E8%87%AA%E5%8A%A8%E6%89%B9%E6%94%B9.meta.js
// ==/UserScript==

// ********************************************************
// *  请务必低调使用，不要公开发布，也不要发到群里！      *
// *     请务必低调使用，不要公开发布，也不要发到群里！   *
// *        请务必低调使用，不要公开发布，也不要发到群里！*
// *           （如遇脚本未运行，可尝试刷新页面）         *
// ********************************************************

// 相当于主函数
(function() {
    'use strict';
    $(()=>{
        //    参数名      |    值    |        含义
        // -------------------------------------------------------------------------------------------------
        // timeInterval   | 非负整数 |    两次批改之间的间隔时间（单位毫秒）
        //                |    -1    |   采用随机时间间隔
        // -------------------------------------------------------------------------------------------------
        // randTimeMin    |  正整数  |    随机时间下界（单位毫秒），仅当 timeInterval 的值为-1时生效
        // -------------------------------------------------------------------------------------------------
        // randTimeMax    |  正整数  |    随机时间上界（单位毫秒），需大于 randTimeMin
        //                |          |    仅当 timeInterval 的值为-1时生效
        // -------------------------------------------------------------------------------------------------
        // onTimeJudge    |    0     |   不检查学生是否按时提交
        //                |    1     |   学生未按时提交则“优秀”变为“良好”，“良好”变为“合格”
        //                |    2     |   学生未按时提交则“优秀”、“良好”变为“合格”
        // -------------------------------------------------------------------------------------------------
        // rankType       |    0     |   按客观题准确率判等级
        //                |    1     |   全部为优秀(当 onTimeJudge 的值为0时)
        //                |    2     |   全部为良好(当 onTimeJudge 的值为0时)
        //                |    3     |   全部为合格
        // -------------------------------------------------------------------------------------------------
        // rankZhuGuanTi  |          |   因为木马目前的情况是若未布置客观题，则客观题正确率为0%
        //                |          |   ！！！该参数仅当 rankType 的值为0时生效！！！
        //                |    1     |   若未布置客观题，统一批改为优秀(当 onTimeJudge 的值为0时)
        //                |    2     |   若未布置客观题，统一批改为良好(当 onTimeJudge 的值为0时)
        //                |    3     |   若未布置客观题，统一批改为合格

        // 在此处进行参数设置
        pigai.timeInterval=5000
        pigai.randTimeMin=5000
        pigai.randTimeMax=8000
        pigai.onTimeJudge=1
        pigai.rankType=0
        pigai.rankZhuGuanTi=1

        // 开始执行
        pigai.stepJC()
    })
})();

class pigai{
    // 第零步：检测“保存批改内容”按钮
    static stepJC() {
        'use strict';
        let jianceJC = setInterval(() => {
            if($('.operatebar .el-button.el-button--primary').length) {
                clearInterval(jianceJC)
                return pigai.stepDJKGT()
            }
        }, 500);
    }

    // 第一步：如果没有主观题，则点击“客观题”
    //         如果没有客观题，则点击“主观题”
    static stepDJKGT() {
        'use strict';
        if($('.task-list .el-button.el-button--primary').length) {
                return pigai.stepKGT()
        }
        $('.question-type').each(function (index, element) {
            let notactivebutton=$(element).find('.btn:not(.active)')
            $(notactivebutton).click()
            return pigai.stepKGT()
        });
    }

    // 第二步：判断是否有客观题
    static stepKGT() {
        'use strict';
        let jianceKGT = setInterval(() => {
            if($('.out-box').length) {
                clearInterval(jianceKGT)
                $('.out-box').each(function (index, element) {
                    let numOfKeGuanTi=$(element).find('.item.topointer.checked').length
                    if(numOfKeGuanTi>0) {
                        pigai.haveKeGuanTi=1
                    } else {
                        pigai.haveKeGuanTi=0
                    }
                });
                return pigai.stepZQL()
            }
        }, 500);
    }

    // 第三步：获取客观题正确率及等级
    static stepZQL() {
        'use strict';
        let jianceZQL = setInterval(() => {
            if($('.top.clearfix').length) {
                clearInterval(jianceZQL)
                $('.top.clearfix').each(function () {
                    pigai.zql=parseFloat($(this).find('.correct-rate').text())
                    pigai.onTime=$(this).find('.time-out-font').text()
                    if(pigai.zql>=80) {
                        if(pigai.onTimeJudge==0 || pigai.onTime.indexOf("是")>=0) {
                            pigai.dengji = "优秀"
                        } else if(pigai.onTimeJudge==1) {
                            pigai.dengji = "良好"
                        } else {
                            pigai.dengji = " 合格"
                        }
                    } else if(pigai.zql>=60) {
                        if(pigai.onTimeJudge==0 || pigai.onTime.indexOf("是")>=0) {
                            pigai.dengji = "良好"
                        } else {
                            pigai.dengji = " 合格"
                        }
                    } else if(pigai.zql>=33) {
                        pigai.dengji = " 合格"
                    } else {
                        pigai.dengji = "不合格"
                    }
                });
                return pigai.stepWCPG()
            }
        }, 500);
    }

    // 第四步：点击“完成批改”
    static stepWCPG() {
        'use strict';
        $('.task-list').each(function (index, element) {
            let pigaibutton=$(element).find('.el-button.el-button--primary')
            $(pigaibutton).each(function (ind, ele) {
                if($(ele).find('span').text() == "完成批改") {
                    $(pigaibutton).click()
                    return pigai.stepQD()
                }
            })
        });
    }

    // 第五步：点击“确定”
    static stepQD() {
        'use strict';
        let jianceQD = setInterval(() => {
            if($('.el-message-box').length) {
                clearInterval(jianceQD)
                $('.el-message-box').each(function () {
                    let quedingbutton=$(this).find('.el-button.el-button--default.el-button--small.el-button--primary')
                    $(quedingbutton).each(function (ind, ele) {
                        if($(ele).find('span').text().indexOf("确定")>=0) {
                            $(quedingbutton).click()
                            if(pigai.haveKeGuanTi==0) {
                                if(pigai.rankZhuGuanTi==1) {
                                    if(pigai.onTimeJudge==0 || pigai.onTime.indexOf("是")>=0) {
                                        return pigai.stepXZDJ("优秀")
                                    } else if(pigai.onTimeJudge==1) {
                                        return pigai.stepXZDJ("良好")
                                    } else {
                                        return pigai.stepXZDJ(" 合格")
                                    }
                                } else if(pigai.rankZhuGuanTi==2) {
                                    if(pigai.onTimeJudge==0 || pigai.onTime.indexOf("是")>=0) {
                                        return pigai.stepXZDJ("良好")
                                    } else {
                                        return pigai.stepXZDJ(pigai.dengji)(" 合格")
                                    }
                                } else if(pigai.rankZhuGuanTi==3) {
                                    return pigai.stepXZDJ(" 合格")
                                }
                            } else if(pigai.rankType==0) {
                                return pigai.stepXZDJ(pigai.dengji)
                            } else if(pigai.rankType==1) {
                                if(pigai.onTimeJudge==0 || pigai.onTime.indexOf("是")>=0) {
                                    return pigai.stepXZDJ("优秀")
                                } else if(pigai.onTimeJudge==1) {
                                    return pigai.stepXZDJ("良好")
                                } else {
                                    return pigai.stepXZDJ(" 合格")
                                }
                            } else if(pigai.rankType==2) {
                                if(pigai.onTimeJudge==0 || pigai.onTime.indexOf("是")>=0) {
                                    return pigai.stepXZDJ("良好")
                                } else {
                                    return pigai.stepXZDJ(" 合格")
                                }
                            } else if(pigai.rankType==3) {
                                return pigai.stepXZDJ(" 合格")
                            }
                        }
                    })
                });
            }
        }, 500);
    }

    // 第六步：选择等级
    static stepXZDJ(Rank) {
        'use strict';
        let jianceXZDJ = setInterval(() => {
            if($('.el-dialog__body').length) {
                clearInterval(jianceXZDJ)
                $('.el-dialog__body').each(function () {
                    let dengjibox=$(this).find('.level-wapper')
                    $(dengjibox).each(function (index, element) {
                        let dengjibutton=$(dengjibox).children()
                        $(dengjibutton).each(function (ind, ele) {
                            if($(ele).text().indexOf(Rank)>=0) {
                                $(ele).click();
                            }
                        })
                        return pigai.stepPGWC()
                    })
                });
            }
        }, 500);
    }

    // 第七步：点击“评估完成”，并返回第零步
    static stepPGWC() {
        'use strict';
        let jiancePGWC = setInterval(() => {
            if($('.el-dialog__footer').length) {
                clearInterval(jiancePGWC)
                $('.el-dialog__footer').each(function () {
                    let pgwcbutton=$(this).find('.el-button.el-button--primary')
                    $(pgwcbutton).each(function (ind, ele) {
                        if($(ele).find('span').text()=="评估完成") {
                            if(pigai.timeInterval==0){
                                $(pgwcbutton).click()
                                return pigai.stepJC()
                            } else if(pigai.timeInterval==-1) {
                                let randTime=Math.floor(Math.random()*(pigai.randTimeMax-pigai.randTimeMin)+pigai.randTimeMin)
                                $(pgwcbutton).click().then(setTimeout(()=>{
                                    return pigai.stepJC()
                                },randTime))
                            } else {
                                $(pgwcbutton).click().then(setTimeout(()=>{
                                    return pigai.stepJC()
                                },pigai.timeInterval))
                            }
                        }
                    })
                });
            }
        }, 500);
    }
}

// 致谢：
// https://blog.csdn.net/Jioho_chen/article/details/86310399
// https://www.bilibili.com/video/BV1UK4y1s7TX