// ==UserScript==
// @name         [snolab] Google 日历键盘操作增强
// @name:zh      [雪星实验室] Google Calendar with Keyboard Enhanced
// @namespace    https://userscript.snomiao.com/
// @version      0.0.6
// @description  【功能测试中, bug反馈：snomiao@gmail.com】Google日历键盘增强，雪星自用，功能：双击复制日程视图里的文本内容, Alt+hjkl 移动日程
// @author       snomiao@gmail.com
// @match        *://calendar.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429709/%5Bsnolab%5D%20Google%20%E6%97%A5%E5%8E%86%E9%94%AE%E7%9B%98%E6%93%8D%E4%BD%9C%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429709/%5Bsnolab%5D%20Google%20%E6%97%A5%E5%8E%86%E9%94%AE%E7%9B%98%E6%93%8D%E4%BD%9C%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

/* 
    1. event move enhance
        - date time input change
        - event drag
    2. journal view text copy for the day-summary
*/
console.clear();
const debug = false;
const qsa = (sel, ele = document) => [...ele.querySelectorAll(sel)];
const eleVis = (ele) => (ele.getClientRects().length && ele) || null;
const eleSelVis = (sel, ele = document) =>
    (typeof sel === 'string' && qsa(sel, ele).filter(eleVis)[0]) || null;
// const nestList = (e, fn)=>e.reduce
const parentList = (ele) =>
    [
        ele?.parentElement,
        ...((ele?.parentElement && parentList(ele?.parentElement)) || []),
    ].filter((e) => e);
const eleSearchVis = (pattern, ele = document) =>
    ((list) =>
        list?.find((e) => e.textContent?.match(pattern)) ||
        list?.find((e) => e.innerHTML?.match(pattern)))(
        qsa('*', ele).filter(eleVis).reverse()
    ) || null;
const eleSearch = (sel, ele = document) =>
    ((list) =>
        list?.find((e) => e.textContent?.match(sel)) ||
        list?.find((e) => e.innerHTML?.match(sel)))(qsa('*', ele).reverse()) ||
    null;
const hotkeyNameParse = (event) => {
    const { altKey, metaKey, ctrlKey, shiftKey, key, type } = event;
    const hkName =
        ((altKey && '!') || '') +
        ((ctrlKey && '^') || '') +
        ((metaKey && '#') || '') +
        ((shiftKey && '+') || '') +
        key?.toLowerCase() +
        ({ keydown: '', keypress: ' Press', keyup: ' Up' }[type] || '');
    return hkName;
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const inputValueSet = async (ele, value) => {
    // console.log('inputValueSet', ele, value);
    if (!ele) throw new Error('no element');
    if (undefined === value) throw new Error('no value');
    ele.value = value;
    ele.dispatchEvent(new InputEvent('input', { bubbles: true }));
    ele.dispatchEvent(new Event('change', { bubbles: true }));
    ele.dispatchEvent(
        new KeyboardEvent('keydown', {
            bubbles: true,
            keyCode: 13 /* enter */,
        })
    );
    await sleep(16);
};
const waitFor = async (fn) => {
    let re = null;
    while (!(re = fn())) await sleep(8);
    return re;
};

const mouseEventOpt = ([x, y]) => ({
    isTrusted: true,
    bubbles: true,
    button: 0,
    buttons: 1,
    cancelBubble: false,
    cancelable: true,
    clientX: x,
    clientY: y,
    movementX: 0,
    movementY: 0,
    x: x,
    y: y,
});
const centerGet = (元素) => {
    const { x, y, width: w, height: h } = 元素.getBoundingClientRect();
    return [x + w / 2, y + h / 2];
};
const bottomGet = (元素) => {
    const { x, y, width: w, height: h } = 元素.getBoundingClientRect();
    return [x + w / 2, y + h - 2];
};
const vec2add = ([x, y], [z, w]) => [x + z, y + w];
const vec2mul = ([x, y], [z, w]) => [x * z, y * w];
const eventDragMouseMove = (dx, dy) => {
    // a unit size is 15 min
    const container = document.querySelector(
        '[role="row"][data-dragsource-type="4"]'
    );
    const gridcells = [...container.querySelectorAll('[role="gridcell"]')];
    const containerSize = container.getBoundingClientRect();
    const [w, h] = [
        containerSize.width / gridcells.length,
        containerSize.height / 24 / 4,
    ];
    const [rdx, rdy] = [dx * w, dy * h];
    globalThis.gckDraggingPos = vec2add(globalThis.gckDraggingPos, [rdx, rdy]);
    document.dispatchEvent(
        new MouseEvent('mousemove', mouseEventOpt(globalThis.gckDraggingPos))
    );
};
const eventDragStart = async (
    [dx = 0, dy = 0] = [],
    { expand = false, immediatelyRelease = false } = {}
) => {
    console.log('eventDrag', [dx, dy], expand, immediatelyRelease);
    if (!globalThis.gckDraggingPos) {
        // console.log(eventDrag, dx, dy);
        const floatingBtn = qsa('div[role="button"]').find(
            (e) => getComputedStyle(e).zIndex === '5004'
        );
        if (!floatingBtn) throw new Error('no event selected');
        const dragTarget = expand
            ? floatingBtn.querySelector('*[data-dragsource-type="3"]')
            : floatingBtn;
        // debugger;
        const cPos = centerGet(dragTarget); // !expand ?  : bottomGet(floatingBtn);
        console.log('cpos', cPos);
        // mousedown
        globalThis.gckDraggingPos = cPos;
        dragTarget.dispatchEvent(
            new MouseEvent(
                'mousedown',
                mouseEventOpt(globalThis.gckDraggingPos)
            )
        );
        dragTarget.dispatchEvent(
            new MouseEvent(
                'mousemove',
                mouseEventOpt(globalThis.gckDraggingPos)
            )
        );
    }
    // mousemove
    if (globalThis.gckDraggingPos) {
        eventDragMouseMove(dx, dy);
    }
    // mouseup
    const mouseup = () => {
        globalThis.gckDraggingPos = null;
        document.dispatchEvent(
            new MouseEvent('mouseup', { bubbles: true, cancelable: true })
        );
    };
    const release = (event) => {
        const hkn = hotkeyNameParse(event);
        console.log('hkn', hkn);
        // ;
        if (hkn === '!j Up') eventDragMouseMove(0, +1);
        if (hkn === '!k Up') eventDragMouseMove(0, -1);
        if (hkn === '!h Up') eventDragMouseMove(-1, 0);
        if (hkn === '!l Up') eventDragMouseMove(+1, 0);
        if (hkn === '!+j Up') eventDragMouseMove(0, +1);
        if (hkn === '!+k Up') eventDragMouseMove(0, -1);
        if (hkn === '!+h Up') eventDragMouseMove(-1, 0);
        if (hkn === '!+l Up') eventDragMouseMove(+1, 0);
        if (hkn === 'alt Up') mouseup();
        if (hkn === '+alt Up') mouseup();
        if (hkn === 'alt Up') document.removeEventListener('keyup', release);
        if (hkn === '+alt Up') document.removeEventListener('keyup', release);
    };
    if (immediatelyRelease) {
        mouseup();
        document.removeEventListener('keyup', release);
    } else {
        document.addEventListener('keyup', release);
    }
};
const movHandle = async (e) => {
    const hktb = {
        '!j': async () => {
            let pos = bottomGet(floatingBtn);
            document.addEventListener('keyup');
        },
    };
    const f = hktb[hkName];
    if (f) f();
};
// useHotkey('!j', () => {});
// document.onkeydown = movHandle;
// document.addEventListener('keydown', globalThis.movHandle , false)

const inputDateTimeChange = async (startDT = 0, endDT = 0) => {
    const isoDateInputParse = async (dateEle, timeEle) => {
        // const dateEle = eleSelVis('[aria-label="Start date"]');
        const dataDate = dateEle.getAttribute('data-date');
        const dataIcal = parentList(dateEle)
            .find((e) => e.getAttribute('data-ical'))
            .getAttribute('data-ical');
        const todayDate = new Date().toISOString().slice(0, 10);
        const dateString = (dataDate || dataIcal).replace(
            /(\d{4})(\d{2})(\d{2})/,
            (_, a, b, c) => [a, b, c].join('-')
        );
        const timeString = timeEle?.value || '00:00';
        return new Date(`${dateString} ${timeString} Z`);
    };
    const dateObjParse = (dateObj) => {
        const [date, time] = dateObj
            .toISOString()
            .match(/(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d):\d\d\.\d\d\dZ/)
            .slice(1);
        return [date, time];
    };
    // All day: both dates, no time
    // Date time: start date + start time + end date
    const startDateEleTry = eleSelVis('[aria-label="Start date"]');
    if (!startDateEleTry) {
        const tz = eleSearchVis(/^Time zone$/);
        const editBtn =
            tz &&
            parentList(tz)
                ?.find((e) => e.querySelector('[role="button"]'))
                ?.querySelector('[role="button"]');
        if (!editBtn) {
            throw new Error('No editable input');
            // return 'No editable input';
        }
        editBtn.click();
        await sleep(16);
    }
    const startDateEle =
        startDateEleTry &&
        (await waitFor(() => eleSelVis('[aria-label="Start date"]')));
    const startTimeEle = eleSelVis('[aria-label="Start time"]');
    const endDateEle = eleSelVis('[aria-label="End date"]');
    const endTimeEle = eleSelVis('[aria-label="End time"]');
    const startDateObj = await isoDateInputParse(startDateEle, startTimeEle);
    const endDateObj = await isoDateInputParse(
        endDateEle || startDateEle,
        endTimeEle
    );
    const shiftedStartDateObj = new Date(+startDateObj + startDT);
    const shiftedEndDateObj = new Date(+endDateObj + endDT);
    const [
        originStartDate,
        originStartTime,
        originEndDate,
        originEndTime,
        shiftedStartDate,
        shiftedStartTime,
        shiftedEndDate,
        shiftedEndTime,
    ] = [
        ...dateObjParse(startDateObj),
        ...dateObjParse(endDateObj),
        ...dateObjParse(shiftedStartDateObj),
        ...dateObjParse(shiftedEndDateObj),
    ];
    debug &&
        console.table({
            startDateObj: startDateObj.toISOString(),
            endDateObj: endDateObj.toISOString(),
            shiftedStartDateObj: shiftedStartDateObj.toISOString(),
            shiftedEndDateObj: shiftedEndDateObj.toISOString(),
        });
    debug &&
        console.table({
            startDateEle: !!startDateEle,
            startTimeEle: !!startTimeEle,
            endDateEle: !!endDateEle,
            endTimeEle: !!endTimeEle,
            originStartDate,
            originStartTime,
            originEndDate,
            originEndTime,
            shiftedStartDate,
            shiftedStartTime,
            shiftedEndDate,
            shiftedEndTime,
        });
    startDateEle &&
        shiftedStartDate !== originStartDate &&
        (await inputValueSet(startDateEle, shiftedStartDate));
    endDateEle &&
        shiftedEndDate !== originEndDate &&
        (await inputValueSet(endDateEle, shiftedEndDate));
    startTimeEle &&
        shiftedStartTime !== originStartTime &&
        (await inputValueSet(startTimeEle, shiftedStartTime));
    endTimeEle &&
        shiftedEndTime !== originEndTime &&
        (await inputValueSet(endTimeEle, shiftedEndTime));
};
const timeAdd = async () => {
    parentList(eleSearchVis(/^Add time$/))
        ?.find((e) => e.querySelector('[role="button"]'))
        ?.querySelector('[role="button"]')
        .click();
    await sleep(16);
    return;
};
const gcksHotkeyHandler = (e) => {
    const isInput = ['INPUT', 'BUTTON'].includes(e.target.tagName);
    const hkName = hotkeyNameParse(e);
    console.log(hkName);
    const okay = () => {
        e.preventDefault();
        e.stopPropagation();
    };
    const hkft = {
        '!k': async () => {
            await timeAdd();
            return await inputDateTimeChange(-15 * 60e3).catch(
                async () => await eventDragStart([0, 0], { expand: false })
            );
        },
        '!j': async () => {
            await timeAdd();
            return await inputDateTimeChange(+15 * 60e3).catch(
                async () => await eventDragStart([0, 0], { expand: false })
            );
        },
        '!h': async () =>
            await inputDateTimeChange(-1 * 86400e3).catch(
                async () => await eventDragStart([0, 0], { expand: false })
            ),
        '!l': async () =>
            await inputDateTimeChange(+1 * 86400e3).catch(
                async () => await eventDragStart([0, 0], { expand: false })
            ),
        '!+k': async () => {
            await timeAdd();
            return await inputDateTimeChange(0, -15 * 60e3).catch(
                async () => await eventDragStart([0, 0], { expand: true })
            );
        },
        '!+j': async () => {
            await timeAdd();
            return await inputDateTimeChange(0, +15 * 60e3).catch(
                async () => await eventDragStart([0, 0], { expand: true })
            );
        },
        '!+h': async () =>
            await inputDateTimeChange(0, -1 * 86400e3).catch(
                async () => await eventDragStart([0, 0], { expand: true })
            ),
        '!+l': async () =>
            await inputDateTimeChange(0, +1 * 86400e3).catch(
                async () => await eventDragStart([0, 0], { expand: true })
            ),
    };
    const f = hkft[hkName];
    if (f) {
        okay();
        f();
        // .then(okay());
        // .catch((e) => console.error(e));
    } else {
        debug && console.log(hkName + ' pressed on ', e.target.tagName, e);
    }
    console.log('rd');
};
// await inputDateTimeChange(-15 * 60e3);

globalThis.gcksHotkeyHandler &&
    document.removeEventListener(
        'keydown',
        globalThis.gcksHotkeyHandler,
        false
    );
globalThis.gcksHotkeyHandler = gcksHotkeyHandler;
document.addEventListener('keydown', globalThis.gcksHotkeyHandler, false);
console.log('done');

// 复制日程内容
var cpy = (ele) => {
    ele.style.background = 'lightblue';
    setTimeout(() => (ele.style.background = 'none'), 200);
    return navigator.clipboard.writeText(
        ele.innerText
            // 把时间和summary拼到一起
            .replace(
                /.*\n(.*) – (.*)\n(.*)\n.*/gim,
                (_, a, b, c) => a + '-' + b + ' ' + c
            )
            // 删掉前2行
            .replace(/^.*\n.*\n/, '')
    );
};
const mdHandler = () => {
    const dblClickCopyHooker = (e) => {
        if (!e.flag_cpy_eventlistener) {
            e.addEventListener('dblclick', () => cpy(e), false);
        }
        e.flag_cpy_eventlistener = 1;
    };
    [...document.querySelectorAll('div.L1Ysrb')]?.map(dblClickCopyHooker);
};
document.body.addEventListener('mousedown', mdHandler, true);
