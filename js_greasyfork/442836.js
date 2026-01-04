// ==UserScript==
// @name         ais_ecs_assistant
// @namespace    https://work.asiainfo-sec.com/
// @version      1.1
// @description  import diners from txt
// @author       jackYu
// @match        https://ecs.asiainfo-sec.com/*
// @icon         https://www.asiainfo.com/static/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_registerMenuCommand
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442836/ais_ecs_assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/442836/ais_ecs_assistant.meta.js
// ==/UserScript==
(function() {
    'use strict';
/*====== 开始：辅助函数 ======*/
/**
 * 查找选择器
 * @param param 选择器参数，格式：1.字符串；2.数组[selector, frameSelector]
 */
function querySelector(selector) {
	if (Object.prototype.toString.call(selector) === '[object Array]' && selector.length == 2) {
		return $(selector[0], selector[1]);
	}
	return $(selector);
}

/**
 * 休眠
 * @param time    休眠时间，单位秒
 * @param desc
 * @returns {Promise<unknown>}
 */
function obsSleep(time, desc = 'obsSleep') {
  return new Promise(resolve => {
    //sleep
    setTimeout(() => {
      resolve(time)
    }, Math.floor(Math.abs(time) * 1000))
  })
}

/**
 * 监测到节点后点击
 * @param selector    CSS选择器
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
function obsClick(selector, time = 0, desc = 'obsClick') {
  return new Promise(resolve => {
    //obs node
    let timer = setInterval(() => {
      let target = querySelector(selector)
      if (!!target.length) {
        clearInterval(timer)
        if (time < 0) {
          setTimeout(() => {
            target.click()
            console.log(desc, selector)
            resolve(selector)
          }, Math.abs(time) * 1000)
        } else if (time > 0) {
          target.click()
          setTimeout(() => {
            console.log(desc, selector)
            resolve(selector)
          }, Math.abs(time) * 1000)
        } else {
          target.click()
          console.log(desc, selector)
          resolve(selector)
        }
      } else {
        return
      }
    }, 100)
  })
}

/**
 * 监测节点是否存在
 * @param parent    jquery对象
 * @param selector    CSS选择器
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
function obsFind(parent, selector, time = 0, desc = 'obsFind') {
  return new Promise(resolve => {
    //obs node
    let timer = setInterval(() => {
      let target = parent.find(selector)
      if (!!target.length) {
        clearInterval(timer)
        if (Math.abs(time) > 0) {
          setTimeout(() => {
            console.log(desc, selector)
            resolve(target)
          }, Math.abs(time) * 1000)
        } else {
          console.log(desc, selector)
          resolve(target)
        }
      } else {
        return
      }
    }, 100)
  })
}

/**
 * 执行函数
 * @param func    函数
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
function obsFunc(func, time = 0, desc = 'func') {
  return new Promise(resolve => {
    if (!!func) {
      if (time < 0) {
        setTimeout(() => {
          func()
          console.log(desc)
          resolve('func')
        }, Math.abs(time) * 1000)
      } else if (time > 0) {
        func()
        setTimeout(() => {
          console.log(desc)
          resolve('func')
        }, Math.abs(time) * 1000)
      } else {
        func()
        console.log(desc)
        resolve('func')
      }
    }
  })
}

/*====== 结束：辅助函数 ======*/

	var iframeDocument = null;
    function init() {
        let boxHtml= '<div id="aisDinnerBoxDiv" style="z-index: 9999999;position: fixed;top: 0;left: 0;background: #eee;width: 100%;height: 100%;padding: 50px;display: none;">';
        boxHtml += '<p><textarea id="dinerDataInput" style="width: 500px; height: 320px;" placeholder="用餐明细，格式：金额,员工姓名或工号(顿号分隔),日期,事由  示例：\r\n60,112、113,2022-04-01,需求开发\r\n30,112,2022-04-02,需求开发"></textarea></p>';
        boxHtml += '<p><textarea id="dinerJobNum" style="width: 500px; height: 90px;" placeholder="员工工号，若用餐明细中填写的是工号，则此处无需填写\r\n格式：员工姓名,工号  示例：\r\n张三,112\r\n李四,113"></textarea></p>';
        boxHtml += '<div><button id="dinerDataSubmit" style="color: #ffffff;background-color: #4662d9;width: 100px;height: 30px;font-size: 17px;border: none;">提交</button>';
        boxHtml += '<button id="dinerDataCancel" style="color: #fff;margin-left: 20px;font-size: 17px;width: 100px;height: 30px;background-color: #cccccc;border: none;">取消</button></div></div>';
        $('body').append(boxHtml);
        $('#dinerDataCancel').on("click", function() {
            $('#aisDinnerBoxDiv').hide();
        });

        if (window.localStorage) {
            // 读取缓存
            let jobNum = localStorage.getItem('ais_dinner_job_num');
            if (jobNum) {
                $('#dinerJobNum').val(jobNum);
            }
        }
    }
    init();

	// 添加菜单项
    GM_registerMenuCommand("录入用餐人员", function(){$('#aisDinnerBoxDiv').show();});

    // 浮点数加法运算
    function FloatAdd(arg1,arg2){
        var r1,r2,m;
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2));
        return (arg1*m+arg2*m)/m;
    }

	// 提交用餐人员数据
    $("#dinerDataSubmit").on("click", function() {
        let dinnerJobNumText = $('#dinerJobNum').val();
        let dinnerJobNumMap = {};
        if (dinnerJobNumText) {
            dinnerJobNumText
                .split(/[(\r\n)\r\n]+/)
                .forEach(data => {
                    let dataArray = data.split(/[\s\t,]+/);
                    dinnerJobNumMap[dataArray[0]] = dataArray[1];
                });
            if (window.localStorage && Object.keys(dinnerJobNumMap).length > 0) {
                // 设置缓存
                localStorage.setItem('ais_dinner_job_num', dinnerJobNumText);
            }
        }

        let dinnerListText = $('#dinerDataInput').val();
		if (!dinnerListText) {
			alert('缺少用餐明细');
			return;
		}

        let dateOption = {year:'numeric', month:'2-digit',day:'2-digit'};
        let jobNumInvalide = false;
        // 顺序：金额、员工、日期、事由
        let dinnerArray = dinnerListText
			.split(/[(\r\n)\r\n]+/)
            .filter(data => !!data)
			.map(data => {
				let dataArray = data.split(/[\s\t,]+/);
                let persons = dataArray[1].split('、');
                for (let i = 0; i < persons.length; i++) {
                    let person = persons[i];
                    // 设置员工工号
                    if (dinnerJobNumMap[person]) {
                        persons[i] = dinnerJobNumMap[person];
                    }
                    // 员工信息为数字
                    if (!/\d+/.test(persons[i])) {
                        jobNumInvalide = true;
                    }
                }
                let dinnerDate = new Date(dataArray[2]);
                let dateStr = dinnerDate.toLocaleString('zh-CN', dateOption).replace(/\//g, '-');
                let dinnerObj = {
					date: dateStr,
					persons: persons,
					account: dataArray[0],
					reason: dataArray[3]
				};
                return dinnerObj;
			});
        let dataInfo = {};
        dinnerArray.forEach((item, index) => {
            let { date } = item
            if (!dataInfo[date]) {
                dataInfo[date] = item;
            } else {
                dataInfo[date].persons = [...dataInfo[date].persons, ...item.persons];
                dataInfo[date].account = FloatAdd(dataInfo[date].account, item.account);
            }
        });
        dinnerArray = Object.values(dataInfo);
        dinnerArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按日期倒序
        if (jobNumInvalide) {
            alert('缺少员工工号');
            return;
        }
        console.log('共' + dinnerArray.length + '条记录', dinnerArray);
        $('#aisDinnerBoxDiv').hide();
        console.log('录入脚本开始执行...');

        async function runAll() {
            iframeDocument = $('#crossDomainIframe').prop('contentWindow').document;
            console.log('loaded crossDomainIframe document', iframeDocument);
            for (let dinnerData of dinnerArray) {
                await addRow(dinnerData);
            }
            console.log('录入脚本执行完毕...');
        }
        runAll();
    });

	// 日期、用餐人、金额、说明
	async function addRow(dinnerData) {
		let blankRow = await addBlankRow();
        await setDinnerDate(blankRow, dinnerData.date);
        await setDinnerPerson(blankRow, dinnerData.persons);
        await setDinnerAccount(blankRow, dinnerData.account);
        await setDinnerReason(blankRow, dinnerData.reason);
	}
	// 增加空白行
	/*async function addBlankRow() {
		// 查找最后一行数据
		let dinnerTable = $('div.ant-table-scroll table.ant-table-fixed span.title-display:contains("选择用餐人")', iframeDocument).parents('div.ant-table-scroll table.ant-table-fixed');
		let lastRow = dinnerTable.find('tbody tr:last');
		let emptyPersons = lastRow.find('td:nth-child(4) span.no_special_readOnly_field_box > p');
		if (emptyPersons.length == 1) {
			// 当前行无用餐人员，直接返回
			return lastRow;
		} else {
			// 点击新增按钮，新增一行
            let rightTable = dinnerTable.parent().parent().parent().find('div.ant-table-fixed-right table.ant-table-fixed');
            getReactHandler(rightTable.find('tbody > tr:last > td:first > span > a:first')[0]).onClick(new Event('click'));
            await obsSleep(0.5);
			return lastRow.next();
		}
	}*/
    async function addBlankRow() {
		// 取空白行返回
		let dinnerTable = $('div.ant-table-scroll table.ant-table-fixed span.title-display:contains("选择用餐人")', iframeDocument).parents('div.ant-table-scroll table.ant-table-fixed');
        for (let currentRow of dinnerTable.find('tbody tr')) {
            let emptyPersons = $(currentRow).find('td:nth-child(4) span.no_special_readOnly_field_box > p');
            if (emptyPersons.length == 1) {
                // 当前行无用餐人员，直接返回
                return $(currentRow);
            }
        }

        // 点击首行新增按钮，新增一行（添加到最后一行有焦点错误问题）
        let rightTable = dinnerTable.parent().parent().parent().find('div.ant-table-fixed-right table.ant-table-fixed');
        getReactHandler(rightTable.find('tbody > tr:first > td:first > span > a:first')[0]).onClick(new Event('click'));
        await obsSleep(0.5);
        return dinnerTable.find('tbody tr:first').next();
	}

	// 设置日期
	async function setDinnerDate(blankRow, dinnerDate) {
		blankRow.find('td:nth-child(1) span.editable-cell-value-wrap').click();
        await obsSleep(0.2);
        // 日历输入框赋值
        $('div.ant-calendar-input-wrap input.ant-calendar-input', iframeDocument).valReact(dinnerDate);
        // 点击确定按钮
        await obsSleep(0.1);
        await obsClick(['#bill_editor div.ant-calendar-footer > span > a.ant-calendar-ok-btn', iframeDocument]);
	}

	// 设置用餐人
	async function setDinnerPerson(blankRow, dinnerPersons) {
		blankRow.find('td:nth-child(3) span:contains("选择用餐人")').click();
        let index = 0;
        for (let person of dinnerPersons) {
            if (index == 0) {
                // 空数据，点击新增按钮
                await obsClick(['div.ant-drawer-body div.ant-table-scroll > div.ant-table-placeholder > div span:contains("新增")', iframeDocument], 0.5);
            } else {
                // 点击最后一行右侧的新增按钮
                getReactHandler($('div.ant-table-fixed-right div.ant-table-body-outer table > tbody > tr:last > td > span > a:first', iframeDocument)[0]).onClick(new Event('click'));
            }
            // 点击最后一行第二列单元格弹出输入框
            await obsSleep(0.5);
            $('div.ant-drawer-body div.ant-table-scroll table tr:last td:nth-child(2) span.editable-cell-value-wrap', iframeDocument).clickReact();
            // 点击输入框
            await obsClick(['div[id^="rc-tree-select-list"] > span.ant-select-dropdown-search > span > input', iframeDocument], 0.5);
            // 查询常用员工
            let usedPersonLi = $('div[id^="rc-tree-select-list"] > span.often.ant-select > span > ul > li[title^="' + person + '"]', iframeDocument);
            if (!!usedPersonLi.length) {
                // 监测到匹配项
                usedPersonLi.click();
            } else {
                // 查询工号
                $('div[id^="rc-tree-select-list"] > span.ant-select-dropdown-search > span > input', iframeDocument).valReact(person);
                await obsSleep(0.8);
                // 选择匹配到的员工
                await obsClick(['div[id^="rc-tree-select-list"] > ul > li > span[title^="' + person + '"]', iframeDocument]);
            }
            await obsSleep(0.5);
            index++;
        }
        // 点击保存按钮(通过mouseDown触发)
        getReactHandler($('div.ant-drawer.ant-drawer-right.ant-drawer-open.sub_table_drawer.ecs_drawer div.ant-drawer-content button.ant-btn-primary', iframeDocument)[0]).onMouseDown();
        await obsSleep(0.2);
	}

	// 设置金额
	async function setDinnerAccount(blankRow, dinnerAccount) {
        blankRow.find('td:nth-child(5) span.currency_container').click();
        await obsFind(blankRow, 'td:nth-child(5) span.currency_container input').then((target) => target.valReact(dinnerAccount));
        await obsSleep(0.1);
	}

	// 设置说明
	async function setDinnerReason(blankRow, dinnerReason) {
        blankRow.find('td:nth-child(6) div.bill_field').click();
        await obsFind(blankRow, 'td:nth-child(6) div.bill_field input').then((target) => target.valReact(dinnerReason));
        await obsSleep(0.5);
	}

    // 模拟react input输入
	jQuery.fn.valReact = function(text) {
		if (!this.is(':focus')) {
			this.focus();
		}
		let input = this[0];
		if (!input) {
			return;
		}
		let lastValue = input.value;
		input.value = text;
		let event = new Event('input', { bubbles: true });
		// hack React15
		event.simulated = true;
		// hack React16 内部定义了descriptor拦截value，此处重置状态
		let tracker = input._valueTracker;
		if (tracker) {
		  tracker.setValue(lastValue);
		}
		input.dispatchEvent(event);
	}

    // 模拟react点击
    jQuery.fn.clickReact = function() {
        if (!this.is(':focus')) {
			this.focus();
		}
        let targetDom = this[0];
		if (!targetDom) {
            console.log('undefined', this);
			return;
		}
        let event = new Event('click', { bubbles: true });
		// hack React15
		event.simulated = true;
        targetDom.dispatchEvent(event);
    }

    // 获取react handler对象
    function getReactHandler(element) {
        for (let key of Object.keys(element)) {
            if (/^__reactEventHandlers/.test(key)) {
                return element[key];
            }
        }
    }
})();