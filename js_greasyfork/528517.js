// ==UserScript==
// @name         创会
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  创会脚本
// @author       lhq
// @match        https://meeting.tencent.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tencent.com
// @grant        GM_xmlhttpRequest
// @connect      159.75.172.230
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528517/%E5%88%9B%E4%BC%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/528517/%E5%88%9B%E4%BC%9A.meta.js
// ==/UserScript==

const meetingDetail = "https://meeting.tencent.com/user-center/user-meeting-list/detailed-meeting-info";
const meetingList = "https://meeting.tencent.com/user-center/user-meeting-list";
let timer = null;
const baseUrl = "http://159.75.172.230:8084/";
let user = null;
let meetingArr = []
let meetingInfo = {
    id: '',
    meetingName: '',
    startTime:'',
    meetingStartBufferTime:'',
    endTime:'',
    meetingEndBufferTime: '',
    secret: ''
}

//获取页面类型
const pageType = () => {
    if (window.location.href === meetingList) {
        return "meetingList";
    } else if (window.location.href.startsWith(meetingDetail)) {
        return "meetingDetail";
    } else {
        return null;
    }
};
const setInputValue = (inputElement, key) => {
    Object.defineProperty(inputElement, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            this._value = newValue;
            this.dispatchEvent(new Event("input", { bubbles: true }));
        },
    });
    inputElement.value = key;
};
//触发输入框事件
const simulateInputEvent = (inputElement) => {
    const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
    });
    const changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
    });
    // 派发input事件
    inputElement.dispatchEvent(inputEvent);
    // 派发change事件
    inputElement.dispatchEvent(changeEvent);
};

//给输入框赋值
const simulateKeyboardInput = (inputElement, value) => {
    inputElement.value = "";
    simulateInputEvent(inputElement);
    const chars = value.split("");
    chars.forEach((char) => {
        const event = new KeyboardEvent("keypress", {
            bubbles: true,
            cancelable: true,
            charCode: char.charCodeAt(0),
        });
        // 模拟输入字符
        inputElement.value += char;
    });
    simulateInputEvent(inputElement);
};
//获取用户信息
const getUserInfo = () => {
    const res = sessionStorage.getItem('persist:root')
    if(res) {
        const res1 = JSON.parse(res)?.userInfos
        if(res1) {
            return JSON.parse(res1)
        }
        return null
    }
    return null
}
//选择50分页
const setPageSize = () => {
    const endDialog = document.querySelector(".meetinglist-pagination .met-dropdown-btn");
    if (endDialog) {
        endDialog.click();
        setTimeout(() => {
            const listItems = Array.from(document.querySelectorAll('#met-overlay-root li'))
            .filter(li => li.textContent.trim() === '50');
            if (listItems[0]) listItems[0].click();
        },1000)
    }

}
//判断是否为今天
function checkAndFormatDate(dateStr) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const [month, day] = dateStr.split('月').map(str => parseInt(str, 10));
    if (month === currentMonth && day === currentDay) {
        return '今天';
    } else {
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        const formattedDay = day < 10 ? `0${day}` : `${day}`;
        return `${formattedMonth}月${formattedDay}日`;
    }
}
//创建符合条件的会议数据集合
function findElementsAndExtractParentClasses(className, searchString) {
    const elements = document.querySelectorAll(`.${className}`);
    const resultArray = [];
    elements.forEach(element => {
        if (element.textContent.includes(searchString)) {
            const parentElement = element.closest('tr');
            if (parentElement) {
                const classValue = parentElement.className;
                const clickEle = `[class="${classValue}"] .meeting-subject-btn`
                resultArray.push({
                    meetingId:classValue,
                    clickEle,
                    startTime: '',
                    endTime: ''
                })
            }
        }
    })
    return resultArray
}
//进入详情页获取数据并退出
function getStartAndEndTimeLabels() {
    setTimeout(() => {
        const storedData = sessionStorage.getItem('persist:root');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const items = document.querySelectorAll('.met-form__item');
                if (parsedData.meetingItemInfo) {
                    const meetingItemInfo = JSON.parse(parsedData.meetingItemInfo);
                    const mItem = meetingArr.find(i => i.meetingId == meetingItemInfo.meeting_code)
                    console.log(mItem,meetingItemInfo.meeting_code);
                    if (mItem) {
                        mItem.startTime = items[3].querySelector('.met-form__text').textContent.replace("年", "/").replace("月", "/").replace("日", "")
                        mItem.endTime = items[4].querySelector('.met-form__text').textContent.replace("年", "/").replace("月", "/").replace("日", "")
                    }
                    const elements = document.querySelector('.step-1');
                    elements.click()
                    setTimeout(() => {
                        setPageSize()
                    }, 1000);
                }
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        }
    }, 2000);

}
//执行收集数据
function getData() {
    const pollInterval = setInterval(() => {
        console.log("Polling meeting array...");
        let allItemsSatisfied = true; // 标志所有项是否都满足条件
        meetingArr.forEach(item => {
            const { startTime, endTime, clickEle } = item;
            // startTime
            if (!startTime || !endTime) {
                const elements = document.querySelector(clickEle);
                // 模拟点击事件
                if (elements) {
                    elements.click(); // 触发点击事件
                    getStartAndEndTimeLabels()
                } else {
                    console.warn(`Element not found for selector: ${clickEle}`);
                }
                // 如果有任一项未满足条件，则将标志设置为false
                allItemsSatisfied = false;
            } else {
                console.log(`MeetingId: ${item.meetingId} is satisfied.`);
            }
        });
        // 如果所有项都满足条件，则停止轮询
        if (allItemsSatisfied) {
            console.log("停止轮询");
            clearInterval(pollInterval);
            // 获取缓冲时间
            const startBuffer = parseBufferTime(meetingInfo.meetingStartBufferTime);
            const endBuffer = parseBufferTime(meetingInfo.meetingEndBufferTime);
            // 计算新会议的时间范围
            const newMeetingRange = calculateTimeRange(
                meetingInfo.startTime,
                meetingInfo.endTime,
                startBuffer,
                endBuffer
            );
            // 检查是否有交集
            const hasIntersection = checkIntersection(meetingArr, newMeetingRange);
            if (hasIntersection) {
                taskFail()
            }else {
                setMeeting()
            }

        }
    }, 6000);
}

// 将时间字符串转换为时间戳
function convertToTimestamp(dateTimeStr) {
    // 替换 / 为 - 以兼容 Date 构造函数
    const formattedDate = dateTimeStr.replace(/\//g, '-');
    const date = new Date(formattedDate);
    return date.getTime(); // 返回毫秒级时间戳
}

// 将缓冲时间字符串转换为毫秒
function parseBufferTime(bufferStr) {
    const parts = bufferStr.split(':').map(Number);
    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;
    return hours * 3600 * 1000 + minutes * 60 * 1000; // 转换为毫秒
}

// 计算时间范围
function calculateTimeRange(startTimeStr, endTimeStr, startBuffer, endBuffer) {
    const startTime = convertToTimestamp(startTimeStr);
    const endTime = convertToTimestamp(endTimeStr);
    const start = startTime - startBuffer;
    const end = endTime + endBuffer;
    return { start, end };
}

// 检查时间范围是否有交集
function checkIntersection(existingMeetings, newRange) {
    const newStart = newRange.start;
    const newEnd = newRange.end;
    for (const meeting of existingMeetings) {
        const existingStart = convertToTimestamp(meeting.startTime);
        const existingEnd = convertToTimestamp(meeting.endTime);
        // 检查是否有交集
        if (newStart < existingEnd && newEnd > existingStart) {
            return true; // 存在交集
        }
    }
    return false; // 不存在交集
}


// 预定会议
function setMeeting() {
    const elements = document.querySelector('.met-btn.toolbar-schedule-btn');
    if (elements) elements.click();
    setTimeout(() => {
        inputInfo()
    },2000)
}

// 填写会议
function inputInfo() {
    const formItems = document.querySelectorAll('.met-form__item');
    if (formItems.length > 0) {
        // 获取第一个.met-form__item中的<input>元素
        const firstFormItem = formItems[0];
        const inputElement = firstFormItem.querySelector('input');
        if (inputElement) {
            setInputValue(inputElement,meetingInfo.meetingName)
        }
        // 获取第一个.met-form__item中的<input>元素
        const firstFormItem1 = formItems[1];
        const inputElement4 = firstFormItem1.querySelector('.end .met-datepicker input');
        const inputElement5 = firstFormItem1.querySelector('.end .custom-time-picker .hour');
        const inputElement6 = firstFormItem1.querySelector('.end .custom-time-picker .minute');
        console.log(inputElement4,inputElement5,inputElement6);
        const inputele2 = firstFormItem1.querySelector('.end .met-datepicker__input-normal');
        inputele2.click()

        setTimeout(() => {
            const eles2 = document.querySelectorAll('.met-calendar__cell.met-calendar__cell--date');
            if (inputElement4 && inputElement5 && inputElement6) {
                const [startTime1, startTime2] = meetingInfo.endTime.split(" ");
                const [hourPart, minutePart] = startTime2.split(":");
                console.log(startTime1,hourPart,minutePart);
                //setInputValue(inputElement4,startTime1)
                setTimeout(() => {
                    const index = timeSub(meetingInfo.endTime)
                    clickTime(index)
                },1000)
                setInputValue(inputElement5,hourPart)
                setInputValue(inputElement6,minutePart)
            }
            setTimeout(() => {
                const inputElement1 = firstFormItem1.querySelector('.start .met-datepicker input');
                const inputElement2 = firstFormItem1.querySelector('.start .custom-time-picker .hour');
                const inputElement3 = firstFormItem1.querySelector('.start .custom-time-picker .minute');
                const inputele1 = firstFormItem1.querySelector('.start .met-datepicker__input-normal');
                console.log(inputElement1,inputElement2,inputElement3);
                inputele1.click()
                setTimeout(() => {
                    const eles1 = document.querySelectorAll('.met-calendar__cell.met-calendar__cell--date');
                    if (inputElement1 && inputElement2 && inputElement3) {
                        const [startTime1, startTime2] = meetingInfo.startTime.split(" ");
                        const [hourPart, minutePart] = startTime2.split(":");
                        console.log(startTime1,hourPart,minutePart);
                        //setInputValue(inputElement1,startTime1)
                        setTimeout(() => {
                            const index = timeSub(meetingInfo.endTime)
                            clickTime(index)
                            setCheckbox()
                        },1000)
                        setInputValue(inputElement2,hourPart)
                        setInputValue(inputElement3,minutePart)
                    }

                },1000)
            },3000)
        },1000)

    }
}

const setCheckbox = () => {
    const passEle = document.querySelector('#host-pass-code input');
    if (passEle) {
        passEle.click();
        setTimeout(() => {
            const passwordEle = document.querySelector('#host-pass-code input[type="password"]');
            if (passwordEle) setInputValue(passwordEle,meetingInfo.secret)
            const waterEle = document.querySelector('label[name="water_mark"] input');
            if (waterEle) waterEle.click();
            const confirmEle = document.querySelector('.met-btn.meeting-button-area-confirm');
            if (confirmEle) confirmEle.click();
            setTimeout(() => {
                if(pageType() == 'meetingDetail') {
                    taskSuccess()
                }else {
                    taskFail()
                }
            },5000)
        },1000)
    }

}
const timeSub = (time) => {
    const now = new Date();
    const targetTime = new Date(time);
    const timeDifference = targetTime - now;
    const daysDifference = timeDifference / (24 * 60 * 60 * 1000);
    const daysDifferenceFloor = Math.floor(daysDifference);
    return daysDifferenceFloor
}
const formatTime = (time) => {
    const dateString = time;
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
}
const clickTime = (i) => {
    const allCells = document.querySelectorAll('.met-calendar__cell.met-calendar__cell--date');
    let selectedIndex = -1;
    allCells.forEach((cell, index) => {
        if (cell.classList.contains('is-selected')) {
            selectedIndex = index;
        }
    });
    if (selectedIndex === -1) {
        console.error('未找到包含 is-selected 类的元素');
    } else {
        const offset = i;
        const targetIndex = selectedIndex + offset;
        if (targetIndex >= 0 && targetIndex < allCells.length) {
            const targetCell = allCells[targetIndex];
            console.log('目标元素:', targetCell);
            targetCell.click()
        } else {
            console.error('目标位置超出范围');
        }
    }
}
//开始任务
const start = () => {
    if(pageType() === 'meetingList'){
        meetingArr = []
        const time = formatTime(meetingInfo.startTime)
        console.log(time);
        const dateStr = checkAndFormatDate(time)
        console.log(dateStr);
        setPageSize()
        setTimeout(() => {
            const arr = findElementsAndExtractParentClasses('meeting-begin-time-in-date',dateStr)
            meetingArr = arr
            if(meetingArr.length > 0) {
                getData()
            }else {
                setMeeting()
            }
        }, 2000);
    } else {
        window.location.href = meetingList
    }
}
//请求API
const requestApi = (userId) => {
    user = getUserInfo()
    GM_xmlhttpRequest({
        method: "GET",
        url: `${baseUrl}refreshMeetingRoomState?userId=${user.userid}&userState=1`,
        onload: function (response) {
            const res = response?.responseText ? JSON.parse(response.responseText) : null;
            console.log('------------------------------response',response);
            console.log('------------------------------res',res);
            if (res) {
                meetingInfo.id = res.id
                meetingInfo.secret = res.secret
                meetingInfo.meetingName = res.meetingName
                meetingInfo.meetingStartBufferTime = res.meetingStartBufferTime
                meetingInfo.meetingEndBufferTime = res.meetingEndBufferTime
                meetingInfo.startTime = `${res.meetingStartDay.replace(/-/g, "/")} ${res.meetingStartTime}`
                meetingInfo.endTime = `${res.meetingEndDay.replace(/-/g, "/")} ${res.meetingEndTime}`
                console.log(meetingInfo);
                clearInterval(timer);
                start()
            }
        },
        onerror: function (response) {
            console.log("请求失败");
        },
    });
};
// 获取任务
const getTask = (userId) => {
    timer = setInterval(() => {
        requestApi();
    }, 5000);
};
// 任务成功
const taskSuccess = (userId) => {
    GM_xmlhttpRequest({
        method: "GET",
        url: `${baseUrl}refreshMeetingRoomState?userId=${user.userid}&userState=3&meetingRoomId=${meetingInfo.id}`,
        onload: function (response) {
            getTask()
        },
        onerror: function (response) {
            console.log("请求失败");
        },
    });
};
// 任务失败
const taskFail = (userId) => {
    GM_xmlhttpRequest({
        method: "GET",
        url: `${baseUrl}refreshMeetingRoomState?userId=${user.userid}&userState=4&meetingRoomId=${meetingInfo.id}`,
        onload: function (response) {
            getTask()
        },
        onerror: function (response) {
            console.log("请求失败");
        },
    });
};
(function() {
    getTask()
})();