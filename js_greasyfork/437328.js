// ==UserScript==
// @name         网货小助手
// @icon         https://resources.g7s.huoyunren.com/ucenter/img/favicon/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  G7网货系统小工具: 批量添加司机、车辆等
// @author       G7
// @match        https://g7s.huoyunren.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @homepageURL  https://www.g7.com.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437328/%E7%BD%91%E8%B4%A7%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437328/%E7%BD%91%E8%B4%A7%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    class RPA {
        syncCollideTruck() {
            let def = $.Deferred();
            $("body iframe").each(function(){
                $(this).contents().find("button.el-button--primary span").each(function(){
                    if ($(this).html().trim() == "新增车辆") {
                        $(this).click();
                        setTimeout(function(){
                            def.resolve();
                        }, 100);
                        return false;
                    }
                })
            });

            setTimeout(function(){
                def.resolve();
            }, 150);

            return def;
        }
        syncCollideDriver() {
            let def = $.Deferred();
            $("body iframe").each(function(){
                $(this).contents().find("button.el-button--primary span").each(function(){
                    if ($(this).html().trim() == "新增司机") {
                        $(this).click();
                        setTimeout(function(){
                            def.resolve();
                        }, 500);
                        return false;
                    }
                })
            });

            setTimeout(function(){
                def.resolve();
            }, 550);

            return def;
        }
        inputLicenseNumber(licenseNumber) {
            let def = $.Deferred();
            let t = $($("body iframe").contents().find('[for="licenseNumber"]')[0]).parent().find("input")[0];
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true, true);
            t.value = licenseNumber;
            t.dispatchEvent(evt);
            setTimeout(function(){
                def.resolve();
            }, 1000);

            return def;
        }
        inputDriverNameAndCard(driverName, driverCard) {
            let def = $.Deferred();
            let driverCardInput = $($("body iframe").contents().find('[for="driverCard"]')[0]).parent().find("input")[0];
            let evtCard = document.createEvent('HTMLEvents');
            evtCard.initEvent('input', true, true);
            driverCardInput.value = driverCard;
            driverCardInput.dispatchEvent(evtCard);
            let driverNameInput = $($("body iframe").contents().find('[for="driverName"]')[0]).parent().find("input")[0];
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true, true);
            driverNameInput.value = driverName;
            driverNameInput.dispatchEvent(evt);
            setTimeout(function(){
                def.resolve();
            }, 1000);

            return def;
        }
        syncTruckNext() {
            let def = $.Deferred();
            $("body iframe").each(function(){
                $(this).contents().find('[aria-label="新建车辆"]').find("button span").each(function(){
                    if ($(this).html().trim() == "下一步") {
                        let t = $(this).parent().get(0);
                        let evt = document.createEvent('HTMLEvents');
                        evt.initEvent('click', true, false);
                        t.dispatchEvent(evt);
                        setTimeout(function(){
                            let cb = $($("body iframe").contents().find('.el-message-box button'));
                            if (cb.length == 2) {
                                $($($("body iframe").contents().find('.el-message-box button'))[1]).click();
                                $($($($("body iframe").contents().find('[aria-label="新建车辆"]'))[0]).find('[aria-label="Close"]')[0]).click();
                            }
                            let em = $($("body iframe").contents().find('.el-form-item__error'));
                            if (em.length > 1) {
                                $($($($("body iframe").contents().find('[aria-label="新建车辆"]'))[0]).find('[aria-label="Close"]')[0]).click();
                            }
                            def.resolve();
                        }, 1000);
                        return false;
                    }
                })
            });

            setTimeout(function(){
                def.resolve();
            }, 1500);

            return def;
        }
        syncDriverNext() {
            let def = $.Deferred();
            $("body iframe").each(function(){
                $(this).contents().find('[aria-label="新建司机"]').find("button span").each(function(){
                    if ($(this).html().trim() == "下一步") {
                        let t = $(this).parent().get(0);
                        let evt = document.createEvent('HTMLEvents');
                        evt.initEvent('click', true, false);
                        t.dispatchEvent(evt);
                        setTimeout(function(){
                            let cb = $($("body iframe").contents().find('.el-message-box button'));
                            if (cb.length == 2) {
                                cb.each(function(){
                                    if ($($(this).children().get(0)).html().trim() == "我知道了") {
                                        $($($("body iframe").contents().find('.el-message-box button'))[1]).click();
                                        $($($($("body iframe").contents().find('[aria-label="新建司机"]'))[0]).find('[aria-label="Close"]')[0]).click();
                                    }
                                });
                            }

                            let em = $($("body iframe").contents().find('.el-form-item__error'));
                            if (em.length > 1) {
                                $($($($("body iframe").contents().find('[aria-label="新建司机"]'))[0]).find('[aria-label="Close"]')[0]).click();
                            }
                            def.resolve();
                        }, 1000);
                        return false;
                    }
                })
            });

            setTimeout(function(){
                def.resolve();
            }, 1500);

            return def;
        }
        syncOneClickAddTruck() {
            let def = $.Deferred();
            $("body iframe").each(function(){
                $(this).contents().find('[aria-label="该车辆支持快捷添加"]').find("button span").each(function(){
                    if (($(this).html()).trim() == "一键添加") {
                        let t = $(this).parent().get(0);
                        let evt = document.createEvent('HTMLEvents');
                        evt.initEvent('click', true, false);
                        t.dispatchEvent(evt);
                        setTimeout(function(){
                            def.resolve();
                        }, 1000);
                        return false;
                    }
                })
            });

            setTimeout(function(){
                def.resolve();
            }, 1500);

            return def;
        }
        syncOneClickAddDriver() {
            let def = $.Deferred();
            $("body iframe").each(function(){
                $(this).contents().find('[aria-label="该司机支持快捷添加"]').find("button span").each(function(){
                    if (($(this).html()).trim() == "一键添加") {
                        let t = $(this).parent().get(0);
                        let evt = document.createEvent('HTMLEvents');
                        evt.initEvent('click', true, false);
                        t.dispatchEvent(evt);
                        setTimeout(function(){
                            def.resolve();
                        }, 1000);
                        return false;
                    }
                })
            });

            setTimeout(function(){
                def.resolve();
            }, 1500);

            return def;
        }
        async oneClickAddTruck(licenseNumber) {
            await rpa.syncCollideTruck();
            await rpa.inputLicenseNumber(licenseNumber);
            await rpa.syncTruckNext();
            await rpa.syncOneClickAddTruck();
        }
        async oneClickAddDriver(driver) {
            var driverInfo = driver.split('-');
            await rpa.syncCollideDriver();
            await rpa.inputDriverNameAndCard(driverInfo[0], driverInfo[1]);
            await rpa.syncDriverNext();
            await rpa.syncOneClickAddDriver();
        }
        async batchAddTruck(licenseNumbers) {
            let len = licenseNumbers.length;
            let startTime = new Date();
            console.log("开始处理时间：" + startTime.format('yyyy-MM-dd hh:mm:ss'));
            console.log("待碰撞车辆总共：" + len + "辆");
            for (let i = 0; i < licenseNumbers.length; i++) {
                console.log("正在处理第" + (i + 1) + "辆" + ", 已经耗时：" + (new Date().getTime() - startTime.getTime()) / 1000 + "s" +  ", 车牌号：" + licenseNumbers[i]);
                await rpa.oneClickAddTruck(licenseNumbers[i].trim());
            }
            let endTime = new Date();
            console.log("结束处理时间：" + endTime.format('yyyy-MM-dd hh:mm:ss'));
            let totalTime = (endTime.getTime() - startTime.getTime()) / 1000;
            console.log("处理总耗时：" + totalTime + "s, 平均处理耗时：" + totalTime / len + "s");
            console.log("恭喜您，碰撞完成！");
            alert("恭喜您，碰撞完成！批量添加" + len + "辆，处理总耗时：" + totalTime + "s, 平均处理耗时：" + totalTime / len + "s");
        }
        async batchAddDriver(drivers) {
            let len = drivers.length;
            let startTime = new Date();
            console.log("开始处理时间：" + startTime.format('yyyy-MM-dd hh:mm:ss'));
            console.log("待碰撞司机总共：" + len + "个");
            for (let i = 0; i < drivers.length; i++) {
                console.log("正在处理第" + (i + 1) + "个" + ", 已经耗时：" + (new Date().getTime() - startTime.getTime()) / 1000 + "s" + ", 司机姓名和身份证：" + drivers[i]);
                await rpa.oneClickAddDriver(drivers[i].trim());
            }
            let endTime = new Date();
            console.log("结束处理时间：" + endTime.format('yyyy-MM-dd hh:mm:ss'));
            let totalTime = (endTime.getTime() - startTime.getTime()) / 1000;
            console.log("处理总耗时：" + totalTime + "s, 平均处理耗时：" + totalTime / len + "s");
            console.log("恭喜您，碰撞完成！");
            alert("恭喜您，碰撞完成！批量添加" + len + "个司机，处理总耗时：" + totalTime + "s, 平均处理耗时：" + totalTime / len + "s");
        }
        appendLicenseNumbersForm() {
            let licenseNumbers = prompt('请输入自动添加的车牌列表:\n多个使用逗号或空格(包含" ", \\r, \\t, \\n, \\f)分隔，如：\n京AAE116\n京ABF158\n京ADC217\n京ADH763\n京ADR662');
            licenseNumbers = licenseNumbers.trim().split(/\s+/);
            return licenseNumbers;
        }
        appendDriversForm() {
            let drivers = prompt('请输入自动添加的司机列表（司机姓名-司机身份证）:\n多个使用逗号或空格(包含" ", \\r, \\t, \\n, \\f)分隔，如：\n陈洪夏-320826199006091437\n陈海亮-410125196502125513\n陈海平-330721196911031232\n陈玉豪-412727199705293059');
            drivers = drivers.trim().split(/\s+/);
            return drivers;
        }
    }

    Date.prototype.format = function(format)
    {
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(),    //day
            "h+" : this.getHours(),   //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
            "S" : this.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                                                      (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
                                    RegExp.$1.length==1 ? o[k] :
                                    ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    }

    var rpa = new RPA();
    GM_registerMenuCommand('启动碰撞网货车辆库', function() {
        let licenseNumbers = rpa.appendLicenseNumbersForm();
        rpa.batchAddTruck(licenseNumbers);
    }, 'T');

    GM_registerMenuCommand('启动碰撞网货司机库', function() {
        let drivers = rpa.appendDriversForm();
        rpa.batchAddDriver(drivers);
    }, 'D');
})();