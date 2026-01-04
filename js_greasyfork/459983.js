// ==UserScript==
// @name         个人排期
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  查看个人的排期
// @author       You
// @match        *://pms.zuoyebang.cc/page?groupID=425
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zuoyebang.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459983/%E4%B8%AA%E4%BA%BA%E6%8E%92%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/459983/%E4%B8%AA%E4%BA%BA%E6%8E%92%E6%9C%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var groupId = "425"
    var yourName = "赵五一"
    var yourEmail = "wuyi.zhao@paperang.com"
    var isSelected = false

    async function checkSelected() {
        var names = document.getElementsByClassName('ivu-tag ivu-tag-size-default ivu-tag-primary');
        for (let index = 0; index < names.length; index++) {
            const name = names[index];
            if (name.textContent.indexOf(yourName) !== -1) {
                isSelected = name.children.item(0).className.indexOf('ivu-tag-text ivu-tag-color-white') !== -1;
            }
        }
        console.log(isSelected ? "已经选中自己" : "未选中自己")
    }

    async function selectSelf() {
        console.log('selectSelf')
        var names = document.getElementsByClassName('ivu-tag ivu-tag-size-default ivu-tag-primary');
        for (let index = 0; index < names.length; index++) {
            const name = names[index];
            if (name.textContent.indexOf(yourName) !== -1) {
                await name.click();
            }
        }
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function reverse(isOver) {
        if (isOver) return;

        await selectSelf();
        await sleep(2000);
        await checkSelected();
        await reverse(isSelected);
    }

    async function getSchedule(bid) {
        const dateArr = document.getElementsByClassName('fc-daygrid-day-number')
        const start = dateArr[0].attributes["aria-label"].value.replace(/年|月|日/g, "-").slice(0, -1) + "+00:00:00"
        const end = dateArr[dateArr.length - 1].attributes["aria-label"].value.replace(/年|月|日/g, "-").slice(0, -1) + "+00:00:00"
        var myHeaders = new Headers();
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("content-type", "application/x-www-form-urlencoded");
        myHeaders.append("x-requested-with", "XMLHttpRequest");

        var urlencoded = new URLSearchParams();
        urlencoded.append("users[]", yourEmail);
        urlencoded.append("business_id", bid);
        urlencoded.append("group_id", groupId);
        urlencoded.append("start", start);
        urlencoded.append("end", end);
        urlencoded.append("ctype[]", "schedule");
        urlencoded.append("ctype[]", "programme");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        const source = await fetch("https://pms.zuoyebang.cc/testplatapi/rdtask/GetScheduleGroup", requestOptions)
        return source.json()
    }

    function createList(datas) {
        var myDiv = document.getElementById('myDiv');
        if (myDiv == null) {
            myDiv = document.createElement("div");
            myDiv.setAttribute("id", "myDiv");
            myDiv.setAttribute("style", "position: fixed;top: 0;right: 200px;background-color: #ddd;border: 1px solid #000;padding: 10px;z-index:1000");
            document.body.appendChild(myDiv);
        } else {
            myDiv.innerHTML = ""
        }

		var selectList = document.createElement("select");
		selectList.setAttribute("multiple", "");
        selectList.setAttribute("style", "background-color: white; height:" + datas.length * 25 + "px;");

        const selectedValues = [];
        selectList.addEventListener("change", () => {
            selectedValues.length = 0;
            for (let i = 0; i < selectList.options.length; i++) {
                const option = selectList.options[i];
                if (option.selected) {
                    selectedValues.push(option.value);
                }
            }
        });
		myDiv.appendChild(selectList);

        var buttonDiv = document.createElement("div");
        myDiv.appendChild(buttonDiv);

        var button = document.createElement("button");
        button.textContent = "导出到日历";
        button.style.marginTop = "10px";
        button.onclick = () => {
            var textArr = []
            datas.forEach(e => {
                if (selectedValues.indexOf(e.id + '') === -1) return;

                const id = e.id;
                const title = e.rdtask_summary + "(所属需求: " + e.req_summary + ")";
                const start = e.start;
                const end = e.end;
                const json = { id: id, title: title, start: start, end: end };
                textArr.push(json);
            });

            window.location.href = 'shortcuts://run-shortcut?name=设置需求日程&input=text&text=' + JSON.stringify({ project: textArr })
            console.log(selectedValues);
        };
		buttonDiv.appendChild(button);

        var buttonClose = document.createElement("button");
        buttonClose.textContent = "关闭";
        buttonClose.style.marginLeft = "10px";
        buttonClose.style.marginTop = "10px";
        buttonClose.onclick = () => {
            myDiv.style.display = "none";
        };
		buttonDiv.appendChild(buttonClose);

        var buttonRefresh = document.createElement("button");
        buttonRefresh.textContent = "刷新列表";
        buttonRefresh.style.marginLeft = "10px";
        buttonRefresh.style.marginTop = "10px";
        buttonRefresh.onclick = async () => {
            const result = await getSchedule("MB_MB");
            const result2 = await getSchedule("HARDWAER_HARDWAER");
            let datas = []
            if (result.data.length > 0) {
                datas.push(...result.data)
            }
            if (result2.data.length > 0) {
                datas.push(...result2.data)
            }
            if (datas.length > 0) {
                createList(datas)
            }
        };
		buttonDiv.appendChild(buttonRefresh);

		var options = datas;

		for (var i = 0; i < options.length; i++) {
			var option = document.createElement("option");
			option.setAttribute("value", options[i].id);
			option.text = options[i].title;
			selectList.appendChild(option);
		}
    }

    // Your code here...
    async function startLoad() {
        await sleep(1000);
        await reverse(false);
        await sleep(2000)
        const result = await getSchedule("MB_MB");
        const result2 = await getSchedule("HARDWAER_HARDWAER");
        let datas = []
        if (result.data.length > 0) {
            datas.push(...result.data)
        }
        if (result2.data.length > 0) {
            datas.push(...result2.data)
        }
        if (datas.length > 0) {
            createList(datas)
        }
    }

    // Check if variable is a function
    const isFunction = (variable) => {
        return typeof variable === 'function';
    };
    const bakOnload = window.onload
    window.onload = async () => {
        if (isFunction(bakOnload)) {
            bakOnload()
        }
        startLoad()
    }
})();