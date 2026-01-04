// ==UserScript==
// @name         工作餐预定
// @namespace    https://oa-portal.eastmoney.com/
// @version      2.1.1
// @description  预定工作餐
// @author       huwei
// @match        https://oa-portal.eastmoney.com/
// @match        https://dongdong-auth.eastmoney.com/*
// @connect      portal-server.eastmoney.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_notification
// @require      https://update.greasyfork.org/scripts/505350/1435418/bootstrapjs%20523.js
// @require      https://update.greasyfork.org/scripts/505351/1435420/jquery%20221.js
// @require      https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js
// @icon         data:image/png;base64,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
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453458/%E5%B7%A5%E4%BD%9C%E9%A4%90%E9%A2%84%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/453458/%E5%B7%A5%E4%BD%9C%E9%A4%90%E9%A2%84%E5%AE%9A.meta.js
// ==/UserScript==
/* globals jQuery, $, echarts */
// 【使用说明】https://vt4qhex413.feishu.cn/docx/doxcnQygCFSZjLDEPBr7y9SH23g
// 自动点餐功能分为两部分：1.新品 2.个人偏好
// 自动点餐功能警告：危险操作，需要自行开启（参考阿里月饼案），在设置中开启或者菜单栏点击开启，页面将在每日0-9点自动预定工作餐，新款工作餐*优先，预定成功有弹窗提醒
// 1.新款工作餐*：不属于下方oldMeals中的工作餐

// @require      https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js
const oldMeals = [
    '馐百味', // 黑名单 臭鸭
    '丽华', '棒约翰', '汉堡王', '德克士', '肯德基', '麦当劳', '松乃家', '米星期', '京城小厨', '老昌兴', '吉野家', '大鼓米线', '汤先生', '80后', '大娘水饺', '耶里夏丽', '健康餐', '喜粤', '南粤小厨', '牛腩之旅', '小满手工粉', '猩轻餐', '米勒堡', '鱼你在一起',
    '赛百味', '荣华基', '九咔米兰', '沙野轻食', '一缦', '沙岸轻卡', '九味煌', '锦霖', '颂饭水饺', '锦霖', '玲珑阁', '亲牟', '领康', '雨爱', '掌上韩品', '健咖', '青爱亭', '莘莘餐饮', '袁记云饺', '森肴', '绕城一粥', 'pupu', '塔斯汀', '粉档',
    '蒙自源', '利客豪', '小锄匠', '隅木', '乐面屋', '酸小七酸汤鱼', '无粉不欢', '天辣', '港芝华','骆驼泉', '燃熊汉堡', '捞蛮米线', '斌斌餐饮', 'Fitbee健康碗',
];
// 2.偏好品牌：个人偏好的工作餐供应商，需要自行开启，英文逗号分隔
// 举个栗子，你喜欢吃汉堡，那么在设置中输入 汉堡王,肯德基,麦当劳，假如你喜欢吃米饭配菜，输入京城小厨,80后,米星期,老昌兴,南粤小厨

const favoutiteMeals = (localStorage.getItem('GZC_FAVOURITEMEALS') || '').split(',');

const icon = {
    favoutite: `<span style="color:red;padding-top:-4px;">♥</span>`,
    // new: `<span style="color:red;font-size:0.8rem;">NEW</span>`,
    new: `<svg xmlns="http://www.w3.org/2000/svg" width="20" fill="currentColor" viewBox="0 0 24 24"><title>new</title><path d="M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z" /></svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" fill="currentColor" viewBox="0 0 24 24"><title>图表</title><path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" /></svg>`,
    setting: `<svg xmlns="http://www.w3.org/2000/svg" width="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16"><title>设置</title><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>`,
    refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="16" fill="currentColor" viewBox="0 0 24 24"><title>刷新</title><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /></svg>`,
};

const autoOrderTimeRange = [15, 900];
const loopLimitDay = 10;
const loopLimitNight = 45;

let baseInfo = {};
let menuList = [];
let userMeal = null;

const WriteLogger = (text = '', level = 'NOTICE') => {
    const date = getDate();
    const datetime = getDatetime();
    const loggerText = `【${level}】${datetime} ${text}`;
    console.log(loggerText);
    // 存在写覆盖的隐患 不care
    const histlog = GM_getValue('GZC_logger', '');
    let loggerList = histlog == '' ? [] : histlog.split('\n');
    loggerList.unshift(loggerText);
    if (loggerList.length > 20) loggerList = loggerList.slice(0, 20);
    GM_setValue('GZC_logger', loggerList.join('\n'));
};

const getDate = () => {
    const now = new Date();
    const date = String(now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate());
    return date;
};

const getHHMM = () => {
    const now = new Date();
    const hhmm = now.getHours() * 100 + now.getMinutes();
    return hhmm;
};

const getDatetime = () => {
    const now = new Date();
    const date = getDate();
    const time = String(1000000 + now.getHours() * 10000 + now.getMinutes() * 100 + now.getSeconds()).slice(1);
    const datetime = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${time.slice(0, 2)}:${time.slice(
        2,
        4
    )}:${time.slice(4, 6)}`;
    return datetime;
};

const ShowMenusV1 = () => {
    $('.dmd').remove();
    $('.nile-menus').remove();
    let wrap = $("<div class='menus-wrap'></div>");
    let html = $("<tbody class='nile-menus'></tbody>");
    menuList.forEach((menu) => {
        // console.log(menu)
        let row = $(`<tr title='${menu.mealsDesc}' ></tr>`);
        const menuName = menu.menuName;
        const mealSum = menu.mealSum;
        const orderSum = menu.orderSum;

        const supplier = menu.menuName.match(/【.*】/g)[0];
        const isNew = oldMeals.filter((item) => supplier.indexOf(item.length > 0 && item) >= 0).length == 0;
        const isFavourite = favoutiteMeals.filter((item) => supplier.indexOf(item.length > 0 && item) >= 0).length > 0;

        // console.log(menuName, supplier, isNew, isFavourite)
        let text = `${orderSum}/${mealSum} ${menuName}`;
        let count_text = `${orderSum}/${mealSum}`;

        let td_count = $(`<td class='menu-item'>${orderSum}/${mealSum}</td>`);
        let td_name = $(
            `<td class='menu-item' style="display: flex;">${menuName}  ${isFavourite ? icon.favoutite : ''}${
                isNew ? icon.new : ''
            }</td>`
        );

        td_count.attr('onclick', `SwapMeal(${menu.id})`);
        td_name.attr('onclick', `SwapMeal(${menu.id})`);

        if (userMeal && userMeal.menuId == menu.id) {
            td_count.css('color', '#409eff');
            td_name.css('color', '#409eff');
        } else if (menu.mealSum == menu.orderSum) {
            td_count.css('color', '#c3c3c3');
            td_name.css('color', '#c3c3c3');
        } else {
            td_count.css('color', 'black');
            td_name.css('color', 'black');
        }
        if (menu.mealSum == menu.orderSum) {
            td_count.css('text-decoration', 'line-through');
            td_name.css('text-decoration', 'line-through');
        }
        row.append(td_count);
        row.append(td_name);
        // const $a = $(`<a></a>`)
        // $a.html(row.html())
        // row.html($a)
        html.append(row);
    });
    //wrap.append("<a class='no-dian' href='https://oa-portal.eastmoney.com/#/orderMeal/orderInitiate'>今日未点餐</a>")
    //wrap.append(html)
    if (userMeal) {
        let mealName = userMeal.brandName;
        let mealTime = userMeal.mealtime || "";
        let mealsDesc = userMeal.mealsDesc;
        //❤️
        let el = $(
            `<div class="dmd is-dian"><div class="dian-title">【${mealName}】${mealTime}</div> <div class="dian-detail">${mealsDesc}</div>  </div>`
        );
        // el.text(`【${mealName}】${mealTime}`)
        el.attr('onclick', `RevokeMeal(true,GetMenus)`);
        $('body').append(el);
    } else {
        $('body').prepend(
            "<a class='dmd no-dian' href='https://oa-portal.eastmoney.com/#/orderMeal/orderInitiate'>今日未点餐</a>"
        );
    }

    // config-btn
    html.append(
        $(
            `<button type="button" class="config-btn btn btn-link" data-bs-toggle="modal" data-bs-target="#configModal">${icon.setting}</button>`
        )
    );
    html.append(
        $(
            `<button type="button" class="config-btn btn btn-link" style="top:-5px;right:-67px;left:unset;" data-bs-toggle="modal" data-bs-target="#chartModal">${icon.chart}</button>`
        )
    );
    $('body').prepend(html);
    // $(".more_content .more")[0].append("123")
};

const ShowMenus = () => {
    let dataname = '';
    // console.log($(".more_content .more"), $(".more_content .more").dataset)
    Object.keys($('.more_content .more')[0].dataset).forEach((n) => {
        if (n.startsWith('v-')) dataname = `data-${n}=""`;
    });
    // 创建div
    let html = $(`<div ${dataname} id="gzc" style="margin-left: 8px;"></div>`);
    // 创建标题
    let title = '工作餐预定';
    if (userMeal) {
        let mealName = userMeal.brandName;
        let mealTime = userMeal.mealtime || "" // .split('到')[0];
        // let mealsDesc = userMeal.mealsDesc;
        title += `  ${mealName} ${userMeal.workplace}${userMeal.floors} ${mealTime}`;
    }
    let p = $(`<p ${dataname}>${title}</p>`);
    p.append(
        $(
            `<button type="button" style="position: unset; color: #f60; margin-top: -5px;" class="btn btn-link" onclick="GetMenus()" >${icon.refresh}</button>`
        )
    );
    p.append(
        $(
            `<button type="button" style="position: unset; color: #f60; margin-top: -5px; margin-left: -15px;" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#chartModal">${icon.chart}</button>`
        )
    );
    p.append(
        $(
            `<button type="button" style="position: unset; color: #f60; margin-top: -5px; margin-left: -15px;" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#configModal">${icon.setting}</button>`
        )
    );
    html.append(p);

    // 创建一列
    let ul = $(`<ul ${dataname}></ul>`);
    menuList.forEach((menu) => {
        // 创建每一行
        const menuName = menu.menuName;
        const mealSum = menu.mealSum;
        const orderSum = menu.orderSum;
        const supplier = menu.menuName.match(/【.*】/g)[0];
        const isNew = oldMeals.filter((item) => supplier.indexOf(item.length > 0 && item) >= 0).length == 0;
        const isFavourite = favoutiteMeals.filter((item) => supplier.indexOf(item.length > 0 && item) >= 0).length > 0;
        let color = '';
        if (mealSum == orderSum) color = '#c3c3c3';
        if (userMeal && userMeal.menuId == menu.id) color = '#f60';
        let text = `${orderSum}/${mealSum} ${menuName}  ${isFavourite ? icon.favoutite : ''}${isNew ? icon.new : ''}`;
        let li = $(
            `<li ${dataname} title='${menu.mealsDesc}' class='${menu.menuId}' style='cursor: pointer; color: ${color}'><a ${dataname}>${text}</a></li>`
        );
        if (userMeal && userMeal.menuId == menu.id) li.attr('onclick', `RevokeMeal(true,GetMenus)`);
        else li.attr('onclick', `SwapMeal(${menu.id})`);
        ul.append(li);
    });
    html.append(ul);
    setTimeout(() => {
        $('#gzc').remove();
        $('.modal-backdrop').remove()
        $('.header-navigation')[0].style.height = '38px';
        // console.log(html)
        $('.more_content .more').append(html);
        $('.more_content .more')[0].style.width = 'unset';
    }, 500);
};

const RevokeMeal = (conf = false, cb = () => {}) => {
    if (userMeal && conf) if (!confirm('确定退订工作餐')) return;
    if (userMeal) {
        $.ajax({
            url: 'https://portal-server.eastmoney.com/bd-portal-server/portal/meals/revokeMeals',
            type: 'POST',
            data: { mid: userMeal.id },
            xhrFields: {
                withCredentials: true,
            },
            success: function (data) {
                WriteLogger('退餐 ' + data.code);
                GetMenus();
                cb();
            },
        });
    } else cb();
};

const SwapMeal = (id) => {
    // console.warn("OrderMeal", id, userMeal);
    if (userMeal && id == userMeal.menuId) return;
    let orderInfo = Object.assign({}, baseInfo);
    let menuName = '';
    menuList.forEach((menu) => {
        if (menu.id == id) {
            orderInfo.menuId = menu.id;
            orderInfo.scheduledDate = menu.scheduled;
            orderInfo.menuType = menu.menuType;
            menuName = menu.menuName;
        }
    });
    let conf = userMeal ? confirm(`是否切换工作餐为${menuName}`) : true;
    if (!conf) return;
    // console.log(baseInfo,menuList,userMeal)
    RevokeMeal(false, () => OrderMeal(orderInfo));
};

const GetMenus = () => {
    // console.warn("GetMenus")
    const date = getDate();
    const datetime = getDatetime();
    let todayMenus = JSON.parse(localStorage.getItem('GZC_todayMenus') || '{}');
    if (todayMenus.date != date) {
        todayMenus.date = date;
        todayMenus.list = [];
    }
    const url_menu = 'https://portal-server.eastmoney.com/bd-portal-server/portal/meals/getMenu';
    $.ajax({
        url: url_menu,
        type: 'POST',
        xhrFields: {
            withCredentials: true,
        },
        success: function (data) {
            console.log('【查询工作餐】', new Date(), data);
            if (data.code == '200') {
                userMeal = data.data.meals;
                baseInfo = data.data.baseInfo;
                menuList = data.data.menus;
                ShowMenus();
                todayMenus.list.push({
                    datetime,
                    menus: data.data.menus,
                });
                localStorage.setItem('GZC_todayMenus', JSON.stringify(todayMenus));
                Chart();
                RecordMeals(date, menuList, userMeal)
                // console.log(menuList.length, $(".header-navigation")[0], $(".header-navigation")[0].style)
                // console.log($(".header-navigation")[0].style.height)
                // if (menuList.length > 3 ) $(".header-navigation")[0].style.height = "54px"
            }
        },
    });
};

const RecordMeals = (date, menuList, orderInfo) => {
    const recordMeals = GM_getValue('GZC_recordMeals', '{}');
    try {
        let recordMealsData = JSON.parse(recordMeals);
        recordMealsData[date] = {menuList, orderInfo}
        // console.log('RecordMeals', recordMealsData)
        GM_setValue('GZC_recordMeals', JSON.stringify(recordMealsData));
    }
    catch (err){
        console.error('RecordMeals ERROR', err)
        GM_setValue('GZC_recordMeals', '{}');
    }
}

const GetHistoryMeal = () => {
    $.ajax({
        url: 'https://portal-server.eastmoney.com/bd-portal-server/portal/meals/getHistoryMeals',
        type: 'POST',
        xhrFields: {
            withCredentials: true,
        },
        success: function (data) {
            // console.warn(data)
            if (!data.data.list) {
                $(".user-name").html(`请重新登录`)
            }
            if (data.data.list.length) {
                RemarkMeals(data.data.list);
            }
        },
    });
};

const OrderMeal = (orderInfo, cb = () => {}) => {
    $.ajax({
        url: 'https://portal-server.eastmoney.com/bd-portal-server/portal/meals/saveMeals',
        type: 'POST',
        data: orderInfo,
        xhrFields: {
            withCredentials: true,
        },
        success: function (data) {
            // console.warn(data)
            WriteLogger(`点餐 ${data.code} ${orderInfo.menuId}`);
            if (data.code != '200') {
                // alert(data.msg)
                window.location.href = 'https://oa-portal.eastmoney.com/#/orderMeal/orderInitiate';
            }
            GetMenus();
            setTimeout(cb, 5000);
        },
    });
};

const RemarkMeals = (meals) => {
    if (new Date().getHours() >= 18 && new Date().getHours() < 23) {
        return;
    }
    console.log('RemarkMeals', meals)
    let autoGrade = localStorage.getItem('GZC_autoGrade');
    if (autoGrade == null) {
        const cf = confirm('是否自动好评已领工作餐（清除缓存即可重置设置）');
        autoGrade = cf ? 'yes' : 'no';
        localStorage.setItem('GZC_autoGrade', autoGrade);
    }
    meals.forEach((meal, index) => {
        setTimeout(() => {
            // console.log(meal)
            // if (meal.enjoyStatus == '1' && meal.remark == null) {
            if (meal.remark == null && (( userMeal && meal.id != userMeal.id) || !userMeal )) {
                if (autoGrade == 'yes') {
                    GradeMeal(meal.id);
                } else {
                    window.location.href = 'https://oa-portal.eastmoney.com/#/orderMeal/orderInitiate';
                }
            }
        }, index * 1000);
    });
};

const AutoOrderMeal = () => {
    // 自动点餐
    // 1.今日未点餐
    // 2.当前时间处于autoOrderTimeRange期间
    // 3.今日从未自动点餐
    // 4.餐品从未出现过
    if (localStorage.getItem('GZC_ALLOWAUTOORDER') != 'yes') return;
    const now = new Date();
    if (GetAutoOrderWeekdays().indexOf(String(now.getDay())) < 0) return; // 今日不在允许的日期
    const date = getDate();
    const hhmm = getHHMM();
    if (userMeal) return;
    if (hhmm < autoOrderTimeRange[0] || hhmm > autoOrderTimeRange[1]) return;
    let lastAutoOrderDate = localStorage.getItem('GZC_autoOrderDate');
    if (date == lastAutoOrderDate) return;

    console.log('AutoOrderMeal', new Date(), menuList);
    let hasAutoOrder = false;
    let selectedId = -1; // (0~length)
    let selectedCma = '自动';

    const OrderNewMeal = () => {
        // 点新品 2.0版本更新为点主力
        if (selectedId >= 0) return;
        let maxOrderSum = 0;
        for (let i = 0; i < menuList.length; i++) {
            const menu = menuList[i];
            // const supplier = menu.menuName.match(/【.*】/g)[0];
            // let isOld = oldMeals.filter((item) => supplier.indexOf(item.length > 0 && item) >= 0).length > 0;
            // if (!isOld) {
            //     selectedId = i;
            //     selectedCma = '新品';
            //     break;
            // }
            if (menu.orderSum > maxOrderSum) {
                maxOrderSum = menu.orderSum;
                selectedId = i;
                selectedCma = `主力的选择`;
            }
        }
    };
    const OrderFavouriteMeal = () => {
        // 点偏好
        for (let mid = 0; mid < favoutiteMeals.length; mid++) {
            if (selectedId >= 0) return;
            const favmealname = favoutiteMeals[mid];
            if (!favmealname) continue;
            for (let i = 0; i < menuList.length; i++) {
                const menu = menuList[i];
                const supplier = menu.menuName.match(/【.*】/g)[0];
                let isFavourite = supplier.indexOf(favmealname) >= 0;
                if (isFavourite) {
                    selectedId = i;
                    selectedCma = '偏好';
                    break;
                }
            }
        }
    };

    if ((localStorage.getItem('GZC_newMealSwitch') || 'yes') == 'yes') {
        OrderNewMeal();
        OrderFavouriteMeal();
    } else {
        OrderFavouriteMeal();
        OrderNewMeal();
    }

    // 剩下的自动点最后一个
    if (selectedId < 0) selectedId = menuList.length - 1;
    const selectedMenu = menuList[selectedId];
    const supplier = selectedMenu.menuName.match(/【.*】/g)[0];
    if (selectedMenu.orderSum ==selectedMenu .mealSum) {
        console.log(supplier, "订满了", selectedMenu)
        return
    }
    let orderInfo = Object.assign({}, baseInfo);
    orderInfo.menuId = selectedMenu.id;
    orderInfo.scheduledDate = selectedMenu.scheduled;
    orderInfo.menuType = selectedMenu.menuType;
    WriteLogger(`自动点餐 ${supplier} 原因:${selectedCma}`);
    OrderMeal(orderInfo, () => {
        DongPush();
    });
    localStorage.setItem('GZC_autoOrderDate', date);
    lastAutoOrderDate = date;
};

// let comfirming = false;
// const ConfirmAutoOrder = () => {
//     const now = new Date();
//     const date = String(now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate());
//     const lastAutoOrderDate = localStorage.getItem('GZC_autoOrderDate');
//     if (date != lastAutoOrderDate || !userMeal) return; // 今日未点餐或手动点餐
//     let confirmOrderDate = localStorage.getItem('GZC_confirmOrderDate');
//     if (date != confirmOrderDate && comfirming == false) {
//         setTimeout(() => {
//             comfirming = true;
//             if (confirm('今日已自动点餐，若不加班请自行取消订餐（下午3点未确认自动取消）')) {
//                 localStorage.setItem('GZC_confirmOrderDate', date);
//                 confirmOrderDate = date;
//             }
//             console.log('comfirmed');
//             comfirming = false;
//         }, 100);
//     }
//     if (now.getHours() > 14 && date != confirmOrderDate) {
//         RevokeMeal();
//         console.warn('截止下午3点未确认点餐，已自动取消工作餐');
//         alert('截止下午3点未确认点餐，已自动取消工作餐');
//     }
// };

const DongPush = (account, token) => {
    const userId = baseInfo.empId;
    token = token || localStorage.getItem('GZC_dongToken');
    account = account || localStorage.getItem('GZC_dongAccount');
    let text = [];
    menuList.forEach((menu) => {
        if (userMeal && userMeal.menuId == menu.id) {
            text.push(`<span style="color:#409eff">${menu.menuName}【√】</span>`);
        } else {
            text.push(`<span style="color:black}">${menu.menuName}</span>`);
        }
    });
    const detail = 'surprice';
    let data = JSON.stringify({
        title: '工作餐通知',
        detail: text.join('<br/>'),
        userIds: userId,
    });
    console.log(data);
    if (!token || !account) {
        return;
    }
    WriteLogger(`DongPush ${account}`);
    GM_xmlhttpRequest({
        method: 'post',
        url: 'https://portal-server.eastmoney.com/oa-chat-api/api/msg/broadcast/',
        headers: {
            'Content-Type': 'application/json',
            token: token,
            account: account,
        },
        data: data,
        responseType: 'json',
        onload: (res) => {
            console.log(res);
        },
        onerror: function (err) {
            console.error('DongPush Error', err);
        },
    });
    // GM_notification({
    //     text: data,
    //     title: "工作餐通知",
    //     timeout: 0,
    //     onclick: function() {
    //         console.log("用户点击了系统通知");
    //     }
    // });
};

const GradeMeal = (id) => {
    console.log('GradeMeal', id);
    const mealScore = 8;
    WriteLogger(`评价工作餐 mealId:${id} mealScore:${mealScore}`);
    $.ajax({
        url: 'https://portal-server.eastmoney.com/bd-portal-server/portal/mealComment/create',
        type: 'POST',
        data: {
            mealId: id,
            source: 'WEB',
            mealScore: mealScore,
            fileIds: '',
        },
        xhrFields: {
            withCredentials: true,
        },
        success: function (data) {
            console.log('GradeMeal', id, data);
            WriteLogger(`评价工作餐 ${id} ${mealScore}分`);
        },
    });
};

const MenuAlert = () => {
    const now = new Date();
    const date = getDate();
    const hhmm = getHHMM();
    let alertDate = localStorage.getItem('GZC_afternoonAlertDate');
    if (userMeal && date != alertDate && hhmm >= 1640 && hhmm <= 1730) {
        DongPush();
        localStorage.setItem('GZC_afternoonAlertDate', date);
    }
    alertDate = localStorage.getItem('GZC_morningAlertDate');
    if (userMeal && date != alertDate && hhmm >= 905 && hhmm <= 1200) {
        DongPush();
        localStorage.setItem('GZC_morningAlertDate', date);
    }
};


GM_registerMenuCommand('🗒查看历史记录', () => {
    const recordMeals = GM_getValue('GZC_recordMeals', '{}');
    console.log(JSON.parse(recordMeals))
    alert(recordMeals);
});

GM_registerMenuCommand('🗒查看日志', () => {
    const histlog = GM_getValue('GZC_logger', '');
    alert(histlog);
});

GM_registerMenuCommand('❤️️设置偏好', () => {
    const favoutiteMealsStr = localStorage.getItem('GZC_FAVOURITEMEALS') || '';
    const result = prompt(
        '请输入您的偏好品牌，并使用逗号分隔：（例如：汉堡王,肯德基,麦当劳）',
        favoutiteMealsStr
    ).replaceAll('，', ',');
    localStorage.setItem('GZC_FAVOURITEMEALS', result);
    // WriteLogger(`设置偏好 ${result}`);
    alert(`偏好设置成功：${result}`);
});

// GM_registerMenuCommand("🗒清除日志", ()=>{
//     GM_setValue("GZC_logger", "")
// })

let menuCommand开启自动点餐 = 0;
let menuCommand关闭自动点餐 = 0;

const OpenAutoOrder = (is_alert = true) => {
    localStorage.setItem('GZC_ALLOWAUTOORDER', 'yes');
    RegisterMenuCommandCloseAutoOrder();
    GM_unregisterMenuCommand(menuCommand开启自动点餐);
    if (is_alert) alert('开启成功');
};
const CloseAutoOrder = (is_alert = true) => {
    localStorage.setItem('GZC_ALLOWAUTOORDER', 'no');
    RegisterMenuCommandOpenAutoOrder();
    GM_unregisterMenuCommand(menuCommand关闭自动点餐);
    if (is_alert) alert('关闭成功');
};
const GetAutoOrder = () => {
    return localStorage.getItem('GZC_ALLOWAUTOORDER');
};

const GetAutoOrderWeekdays = () => {
    let days = localStorage.getItem('GZC_AUTOORDERWEEKDAYS') || '1,2,3,4,5';
    return days.split(',');
};
const SetAutoOrderWeekdays = (days) => {
    localStorage.setItem('GZC_AUTOORDERWEEKDAYS', days.join(','));
};
const GetFavoutiteMeals = () => {
    return localStorage.getItem('GZC_FAVOURITEMEALS') || '';
};
const SetFavoutiteMeals = (meals) => {
    localStorage.setItem('GZC_FAVOURITEMEALS', meals);
};

// 🟢🔴
const RegisterMenuCommandOpenAutoOrder = () => {
    menuCommand开启自动点餐 = GM_registerMenuCommand('🔴自动点餐已关闭，点击即可开启', OpenAutoOrder);
};
const RegisterMenuCommandCloseAutoOrder = () => {
    menuCommand关闭自动点餐 = GM_registerMenuCommand('🟢自动点餐已开启，点击即可关闭', CloseAutoOrder);
};

const Config = () => {
    $('#configModal').remove();
    const html = $(`
 <div class="modal fade" id="configModal" tabindex="-1" aria-labelledby="configModalLabel" aria-hidden="true">
   <div class="modal-dialog modal-dialog-centered">
     <div class="modal-content">
       <div class="modal-header">
         <h1 class="modal-title fs-5" id="configModalLabel">设置</h1>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
         <form>
          <label class="form-label fs-6">订餐开关</label>
           <div class="form-check form-switch">
             <input class="form-check-input" type="checkbox" id="autoOrderSwitch">
             <label class="form-check-label" for="flexSwitchCheckDefault">已开启</label>
           </div>
           <div id="otherConfig">
             <label class="form-label fs-6 mt-2">订餐日期</label>
             <div>
               <div class="form-check form-check-inline">
                 <input class="form-check-input weekdays-item" type="checkbox" id="weekday1" value="weekday1">
                 <label class="form-check-label" for="weekday1">周一</label>
               </div>
               <div class="form-check form-check-inline">
                 <input class="form-check-input weekdays-item" type="checkbox" id="weekday2" value="weekday2">
                 <label class="form-check-label" for="weekday2">周二</label>
               </div>
               <div class="form-check form-check-inline">
                 <input class="form-check-input weekdays-item" type="checkbox" id="weekday3" value="weekday3">
                 <label class="form-check-label" for="weekday3">周三</label>
               </div>
               <div class="form-check form-check-inline">
                 <input class="form-check-input weekdays-item" type="checkbox" id="weekday4" value="weekday43">
                 <label class="form-check-label" for="weekday4">周四</label>
               </div>
               <div class="form-check form-check-inline">
                 <input class="form-check-input weekdays-item" type="checkbox" id="weekday5" value="weekday5">
                 <label class="form-check-label" for="weekday5">周五</label>
               </div>
             </div>
             <div>
               <label class="form-label fs-6 mt-2">偏好品牌（选填）<span style="color:#aaa;font-size:12px;margin-left: 0px;" class="ml-2">请使用英文逗号分隔</span>
                  <span class="form-switch">
                   <input class="form-check-input" type="checkbox" id="newMealSwitch" style="margin-top: 7px;">
                   <label class="form-check-label" for="flexSwitchCheckDefault" style="color: #aaa; font-size: 12px; margin-left: 0px;">优先主力</label>
                 </span>
               </label>
               <input type="text" class="form-control" style="width:80%" id="favoutiteMeals" placeholder="例如：汉堡王,米勒堡,赛百味,德克士">
             </div>
             <div>
               <label class="form-label fs-6 mt-3">咚咚推送（选填）<span style="color:#aaa;font-size:12px;margin-left: 0px;cursor: pointer;" class="ml-2" id="testDongPush">测试一下</span></label>
               <div class="row g-3">
                 <div class="col-3">
                   <input name="account" type="password" class="form-control" style="width:85%" placeholder="account" id="dongAccount" aria-label="account">
                 </div>
                 <div class="col-7">
                   <input name="token" type="password" class="form-control" style="width:85%" placeholder="token" id="dongToken" aria-label="token">
                 </div>
               </div>
             </div>

           </div>
         </form>
       </div>
       <div class="modal-footer">
         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cancelonfig">取消</button>
         <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveConfig">保存</button>
       </div>
     </div>
   </div>
 </div>`);
    $('body').append(html);
    var switchElement = $('#autoOrderSwitch');
    var otherElement = $('#otherConfig');
    // 注册change事件监听器
    switchElement.change(function () {
        if ($(this).prop('checked')) {
            // 开启状态，设置其他表项为disabled
            otherElement.removeClass('config-item-disabled');
            // 修改开关按钮文字
            switchElement.next().text('已开启');
        } else {
            // 关闭状态，取消其他表项的disabled状态
            otherElement.addClass('config-item-disabled');
            // 修改开关按钮文字
            switchElement.next().text('已关闭');
        }
    });
    $('#newMealSwitch').change(function () {
        if ($(this).prop('checked')) $('#newMealSwitch').next().text('优先主力');
        else $('#newMealSwitch').next().text('不优先主力(优先偏好)');
    });

    $('#testDongPush').click(() => {
        DongPush($('#dongAccount').val(), $('#dongToken').val());
    });

    // 订餐开关
    if (GetAutoOrder() == 'yes') $('#autoOrderSwitch').prop('checked', true);
    else {
        otherElement.addClass('config-item-disabled');
        $('#autoOrderSwitch').prop('checked', false);
        switchElement.next().text('已关闭');
    }
    // 新品开关
    if ((localStorage.getItem('GZC_newMealSwitch') || 'yes') == 'yes') $('#newMealSwitch').prop('checked', true);
    else {
        $('#newMealSwitch').prop('checked', false);
        $('#newMealSwitch').next().text('不优先主力(优先偏好)');
    }

    // 订餐日期
    const weekdays = GetAutoOrderWeekdays();
    weekdays.forEach((day) => {
        $(`#weekday${day}`).prop('checked', true);
        // console.log($(`#weekday${day}`));
    });
    // 偏好品牌
    $('#favoutiteMeals').val(GetFavoutiteMeals());
    // 咚咚推送
    $('#dongToken').val(localStorage.getItem('GZC_dongToken') || '');
    $('#dongAccount').val(localStorage.getItem('GZC_dongAccount') || '');

    // 保存逻辑
    $('#saveConfig').click(function () {
        const autoOrderSwitch = $('#autoOrderSwitch').prop('checked');
        const selectedWeekdays = $('input[type=checkbox]:checked')
        .filter('.weekdays-item')
        .map(function () {
            return this.id.substring(7);
        })
        .get();
        const favoutiteMeals = $('#favoutiteMeals').val().replaceAll('，', ',');

        if (autoOrderSwitch) OpenAutoOrder(false);
        else CloseAutoOrder(false);
        SetAutoOrderWeekdays(selectedWeekdays);
        SetFavoutiteMeals(favoutiteMeals);
        localStorage.setItem('GZC_dongToken', $('#dongToken').val());
        localStorage.setItem('GZC_dongAccount', $('#dongAccount').val());

        if ($('#newMealSwitch').prop('checked')) {
            localStorage.setItem('GZC_newMealSwitch', 'yes');
        } else {
            localStorage.setItem('GZC_newMealSwitch', 'no');
        }

        console.log('订餐开关', autoOrderSwitch);
        console.log('订餐日期', selectedWeekdays);
        console.log('偏好品牌', favoutiteMeals);

        // setTimeout(()=>{alert('保存成功');}, 750)
        Config();
    });
    $('#cancelonfig').click(function () {
        Config();
    });
};
Config();

const Chart = () => {
    // echarts
    $('#chartModal').remove();
    const html = $(`
 <div class="modal fade modal-lg" id="chartModal" tabindex="-1" aria-labelledby="chartModalLabel" aria-hidden="true">
   <div class="modal-dialog modal-dialog-centered">
     <div class="modal-content">
       <div class="modal-header">
         <h1 class="modal-title fs-5" id="chartModalLabel">订餐趋势</h1>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
          <div id="menuChartContainer" style="height:500px;width:770px">111<div>
       </div>
     </div>
   </div>
 </div>`);
    $('body').append(html);
    const todayMenus = JSON.parse(localStorage.getItem('GZC_todayMenus') || '{}');
    if (todayMenus.list.length == 0) return;
    const menus = todayMenus.list[todayMenus.list.length - 1].menus;
    const date = getDate();

    let myChart = echarts.init(document.getElementById('menuChartContainer'));
    // 配置图表选项
    let option = {
        // animationDuration: 3000,
        title: {
            text: '',
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: menus.map((m) => m.menuName),
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        toolbox: {
            feature: {
                // saveAsImage: {}
            },
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            // data: todayMenus.list.map((v) => v.datetime)
        },
        yAxis: {
            type: 'value',
        },
        series: menus.map((m) => {
            const begintime = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} 00:00:00`;
            const endtime = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} 18:00:00`;
            let data = todayMenus.list
            .filter((v) => v.datetime <= endtime)
            .map((v) => {
                const menu = v.menus.filter((vv) => vv.id == m.id)[0];
                return [
                    v.datetime,
                    menu.orderSum, // / nemu.mealSum
                ];
            });
            data.unshift([begintime, 0]);
            const lastMenu = todayMenus.list[todayMenus.list.length - 1];
            if (lastMenu.datetime < endtime) data.push([endtime, NaN]);
            else {
                const d = lastMenu.menus.filter((vv) => vv.id == m.id)[0];
                data.push([endtime, d.orderSum]);
            }
            // console.log(data)
            return {
                name: m.menuName,
                type: 'line',
                symbol: 'none',
                smooth: true,
                data,
            };
        }),
    };
    // myChart.setOption(option);
    const myModalEl = document.getElementById('chartModal');
    myModalEl.addEventListener('shown.bs.modal', (event) => {
        myChart.setOption(option);
    });
};
// Chart();

const CoreLoop = ()=>{
    console.log('CoreLoop', new Date())
    GetHistoryMeal();
    GetMenus();
    setTimeout(() => {
        AutoOrderMeal();
    }, 2000);
    // ConfirmAutoOrder()
    MenuAlert();

    const hhmm = getHHMM();
    let [baseMinutes, randomMinutes] = [loopLimitDay,loopLimitDay];
    if (hhmm > 2200 || hhmm < 730) [baseMinutes, randomMinutes] = [loopLimitNight, loopLimitNight]
    const nextTimeoutSeconds = Math.ceil((Math.random()*randomMinutes+baseMinutes)*60*1000);
    console.log(`waiting for next loop, duration: ${nextTimeoutSeconds/1000}s (now: ${new Date()})`)
    setTimeout(() => {
        CoreLoop();
    }, nextTimeoutSeconds);
}

(function () {
    'use strict';
    // Check the URL and execute the corresponding function

    let uw = unsafeWindow ? unsafeWindow : window;
    uw.SwapMeal = SwapMeal;
    uw.RevokeMeal = RevokeMeal;
    uw.GetMenus = GetMenus;
    GetMenus();
    GetHistoryMeal();

    if (GetAutoOrder() == 'yes') {
        RegisterMenuCommandCloseAutoOrder();
    } else {
        RegisterMenuCommandOpenAutoOrder();
    }

    CoreLoop();
    setTimeout(() => {
        AutoOrderMeal();
        // ConfirmAutoOrder()
        // DongPush()
    }, 2000);
    let css = `
.menus-wrap {
  display: flex;
  position: absolute;
  top: 0;
  z-index: 100000;
  width: 100%;
  font-size: 1rem;
}
.nile-menus {
  position: absolute;
  font-size: 1rem;
  left: 40vw;
  top: 0;
  margin-left: 5vw;
  z-index: 100;
}
.menu-item {
  cursor: pointer;
}
.is-dian {
  cursor: pointer;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0.6rem;
  left: 20vw;
  line-height: 1.2;
  z-index: 100;
}
.dian-title {
  font-size: 1.5rem;
  color: #409eff;
  display: flex;
  justify-content: center;
}
.dian-detail {
  font-size: 1rem;
  color: orange;
  font-weight: bold;
  display: flex;
  justify-content: center;
  max-width: 400px;
  text-wrap: nowrap;
}
.no-dian {
  cursor: pointer;
  position: absolute;
  display: flex;
  top: 1.1rem;
  left: 30vw;
  font-size: 1.5rem;
  color: red;
  z-index: 100;
}
*, ::after, ::before {
  box-sizing: unset !important;
}
.config-btn {
  position: absolute;
  left: 100%;
  top: -5px;
  color: #409eff;
}
.config-item-disabled {
  color: #aaa;
}
`;
    GM_addStyle(css);
    // let node = document.createElement("style")
    // node.type = "text/css";
    // node.appendChild(document.createTextNode(css))
    // document.getElementsByTagName("head")[0].appendChild(node)

    // 引入 Bootstrap 的 CSS 文件
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.bootcdn.net/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css';
    const head = document.getElementsByTagName('head')[0];
    head.insertBefore(link, head.firstChild.nextSibling);

    // 引入 Bootstrap 的 JavaScript 文件
    // const script = document.createElement('script')
    // script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js'
    // // script.integrity = 'sha384-CijOrBhRd3qQYfG4VZtFbNyy08Eh0eUyFs+MH8MlCYL+H2X6aLzteswTArzG+4sJ'
    // script.crossOrigin = 'anonymous'
    // document.body.appendChild(script)

    // GM_addStyle(GM_getResourceText ("customCSS"));

    window.onload = () => {

        if (window.location.href.includes('dongdong-auth.eastmoney.com')) {
            console.log( document.getElementsByClassName("em-button"))
            console.log( document.getElementsByClassName("em-button")[0])
            document.getElementsByClassName("em-button")[0].click()
            return
        }


        const e2 = $('div.content_position').clone();
        $('div.content_position').remove();
        e2.insertAfter($('.menu-header'));
        $('.content_position')[0].style.display = 'unset';
        $('.content_position')[0].style.position = 'unset';
        $('.more_content')[0].style['box-shadow'] = 'unset';
        $('.more_content')[0].style.height = 'unset';
        // $(".more_content")[0].style.border = 'unset'
        $('.more_content')[0].style['margin-right'] = '30px';
        $('.more_content .more')[0].style.margin = '0px 0 0 50px';
        $('.more_content .more')[0].style['text-wrap'] = 'nowrap';
        $('.more_content .more')[0].style.display = 'flex';
        $('.app .menu')[0].style.margin = '';
        $('li.pointer').remove();
        $('.tip_con').remove();
        // $('.banner').remove();
    };
    setTimeout(()=>location.reload(), 1000*3600*6)
})();
