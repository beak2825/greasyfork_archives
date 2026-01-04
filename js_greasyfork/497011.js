// ==UserScript==
// @name         AHTJ1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在网页上插入单选框组，选择后点击按钮读取内容并执行相应的操作，每组两个选项并显示在一行中，默认选中第一个选项，并增加一个按钮用于切换单选框组
// @author       你的名字
// @match        http://117.68.0.190:9090/stj-web/index/inspect/report/toReportInput.do?param=d29ya0lkPVJXRC0yMDI0M*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497011/AHTJ1.user.js
// @updateURL https://update.greasyfork.org/scripts/497011/AHTJ1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个容器用于放置单选框和按钮
    const container = document.createElement('div');
    container.id = 'radio-container';
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.left = '10px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.padding = '10px';
    container.style.zIndex = 10000; // 确保在最上层显示

    // 定义三个单选框组
    const groups1 = [
        {
            name: 'group1',
            options: [
                { id: 'g1-option1', label: '无修改单 ', action: () => {
                    document.getElementById('17026367891076a46').lastElementChild.lastElementChild.innerHTML='/'//旁路（1）
        document.getElementById('17026367891070e74').lastElementChild.lastElementChild.innerHTML='/'//旁路（2）
        document.getElementById('1702636789107fe21').lastElementChild.lastElementChild.innerHTML='/'//旁路（3）
        document.getElementById('17026367891075fa7').lastElementChild.lastElementChild.innerHTML='/'//旁路（4）
        document.getElementById('1702637271087a233').lastElementChild.lastElementChild.innerHTML='/'//抱闸反馈
        document.getElementById('1713594974152179e').lastElementChild.lastElementChild.innerHTML='/'//意外移动（1）
        document.getElementById('1713594974152ef0e').lastElementChild.lastElementChild.innerHTML='/'//意外移动（2）
        document.getElementById('1713594974152c607').lastElementChild.lastElementChild.innerHTML='/'//意外移动（3）
        document.getElementById('1713594974152540d').lastElementChild.lastElementChild.innerHTML='/' } },
                { id: 'g1-option2', label: '有修改单', action: () => {
                    document.getElementById('17026367891076a46').lastElementChild.lastElementChild.innerHTML='√'//旁路（1）
        document.getElementById('17026367891070e74').lastElementChild.lastElementChild.innerHTML='√'//旁路（2）
        document.getElementById('1702636789107fe21').lastElementChild.lastElementChild.innerHTML='√'//旁路（3）
        document.getElementById('17026367891075fa7').lastElementChild.lastElementChild.innerHTML='√'//旁路（4）
        document.getElementById('1702637271087a233').lastElementChild.lastElementChild.innerHTML='√'//抱闸反馈
        document.getElementById('1713594974152179e').lastElementChild.lastElementChild.innerHTML='√'//意外移动（1）
        document.getElementById('1713594974152ef0e').lastElementChild.lastElementChild.innerHTML='√'//意外移动（2）
        document.getElementById('1713594974152c607').lastElementChild.lastElementChild.innerHTML='√'//意外移动（3）
        document.getElementById('1713594974152540d').lastElementChild.lastElementChild.innerHTML='√'} }//意外移动（4）
            ]
        },
        {
            name: 'group2',
            options: [
                { id: 'g2-option1', label: '非超15年', action: () => {
//                    document.getElementById('170486608684702b3').lastElementChild.innerHTML='/'//下次检测日期
        document.getElementById('1700887220897d0b').lastElementChild.innerHTML='/'//接地保护
        document.getElementById('1702639220238f5df').lastElementChild.innerHTML='/'//钢丝绳1
        document.getElementById('1700709338998a55').lastElementChild.innerHTML='/'//钢丝绳2
        document.getElementById('1700887671315b62').lastElementChild.innerHTML='/'//端部固定
        document.getElementById('17007072568871c6').lastElementChild.innerHTML='/'//门间隙1
        document.getElementById('1702640903045fe9a').lastElementChild.innerHTML='/' } },
                { id: 'g2-option2', label: '超15年', action: () => {
                    document.getElementById('170486608684702b3').lastElementChild.innerHTML='/'//下次检测日期
        document.getElementById('1700887220897d0b').lastElementChild.innerHTML='√'//接地保护
        document.getElementById('1702639220238f5df').lastElementChild.innerHTML='√'//钢丝绳1
        document.getElementById('1700709338998a55').lastElementChild.innerHTML='√'//钢丝绳2
        document.getElementById('1700887671315b62').lastElementChild.innerHTML='√'//端部固定
        document.getElementById('17007072568871c6').lastElementChild.innerHTML='√'//门间隙1
        document.getElementById('1702640903045fe9a').lastElementChild.innerHTML='√' } }//门间隙2
            ]
        },
        {
            name: 'group3',
            options: [
                { id: 'g3-option1', label: '有机房    ', action: () => {
        document.getElementById('1702637271088688c').lastElementChild.lastElementChild.innerHTML='/'//动态测试
        document.getElementById('17026372710884f0d').lastElementChild.lastElementChild.innerHTML='/'//1m急停
        document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='√'//盘车（3）
        document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='√'; } },
                { id: 'g3-option2', label: '无机房', action: () => {


        document.getElementById('1702637271088688c').lastElementChild.lastElementChild.innerHTML='√'//动态测试
        document.getElementById('17026372710884f0d').lastElementChild.lastElementChild.innerHTML='√'//1m急停
        document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='/'//盘车（3）
        document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='/' } }//盘车（4）
            ]
        },
        {
            name: 'group4',
            options: [
                { id: 'g4-option1', label: '耗能   ', action: () => { document.getElementById('170263678910675f3').lastElementChild.lastElementChild.innerHTML='√' } },
                { id: 'g4-option2', label: '蓄能', action: () => { document.getElementById('170263678910675f3').lastElementChild.lastElementChild.innerHTML='/' } }
            ]
        },
        {
            name: 'group5',
            options: [
                { id: 'g5-option1', label: '有紧急电动', action: () => { document.getElementById('17026372710875e45').lastElementChild.lastElementChild.innerHTML='√'
                                                                  document.getElementById('17026372710880e9a').lastElementChild.lastElementChild.innerHTML='√' } },
                { id: 'g5-option2', label: '无紧急电动', action: () => { document.getElementById('17026372710875e45').lastElementChild.lastElementChild.innerHTML='/'
                                                                  document.getElementById('17026372710880e9a').lastElementChild.lastElementChild.innerHTML='/' } }
            ]
        },
        {
            name: 'group6',
            options: [
                { id: 'g6-option1', label: '需要拆解 ', action: () => { document.getElementById('17026372710898779').lastElementChild.lastElementChild.innerHTML='√'} },
                { id: 'g6-option2', label: '不需要拆解', action: () => { document.getElementById('17026372710898779').lastElementChild.lastElementChild.innerHTML='/'} }
            ]
        },
        {
            name: 'group7',
            options: [
                { id: 'g7-option1', label: '有盘车  ', action: () => { document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='√'
        document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='√' } },
                { id: 'g7-option2', label: '无盘车', action: () => { document.getElementById('1702639100103ce9e').lastElementChild.lastElementChild.innerHTML='/'
        document.getElementById('17026391001038eb2').lastElementChild.lastElementChild.innerHTML='/' } }
            ]
        },
        {
            name: 'group8',
            options: [
                { id: 'g8-option1', label: '无伸长保护', action: () => { document.getElementById('1702640008268dd6e').lastElementChild.lastElementChild.innerHTML='/' } },
                { id: 'g8-option2', label: '有伸长保护', action: () => { document.getElementById('1702640008268dd6e').lastElementChild.lastElementChild.innerHTML='√' } }
            ]
        },
        {
            name: 'group9',
            options: [
                { id: 'g9-option1', label: '金属反绳轮', action: () => {document.getElementById('1702640008268acd4').lastElementChild.lastElementChild.innerHTML='/'
    document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='/'} },
                { id: 'g9-option2', label: '非金属反绳轮', action: () => { document.getElementById('1702640008268acd4').lastElementChild.lastElementChild.innerHTML='√'
    document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='√'} }
            ]
        },
        {
            name: 'group10',
            options: [
                { id: 'g10-option1', label: '无安全窗 ', action: () => { document.getElementById('17026400082690255').lastElementChild.lastElementChild.innerHTML='/'
              var currentDate = new Date();

    // 格式化日期
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);

    // 生成格式化字符串
    var formattedDate = year + '年' + month + '月' + day + '日';

    // 输出格式化日期（可替换为所需的其他操作）
//    console.log(formattedDate);

    // 在页面上显示（可选）
//    var dateElement = document.createElement('div');
//    dateElement.textContent = formattedDate;
//    document.body.appendChild(dateElement);

    document.getElementById('1581261440012c13e').lastElementChild.innerHTML=formattedDate//
//    document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='/'//
           document.getElementById('1584177803141c102').lastElementChild.innerHTML=formattedDate//

document.getElementById('17014878067399fe6').lastElementChild.innerHTML='/'
document.getElementById('17041912859544faf').lastElementChild.innerHTML='/'

        document.getElementById('170264247697664b1').lastElementChild.lastElementChild.innerHTML='≥7mm'
                                                                   document.getElementById('17041912859544faf').lastElementChild.innerHTML='已按照安徽省市场监督管理局“皖市监办[2023]757号文”要求查验。'
        ;} },
                { id: 'g10-option2', label: '有安全窗', action: () => { document.getElementById('17026400082690255').lastElementChild.lastElementChild.innerHTML='√'
                                                                  var currentDate = new Date();

    // 格式化日期
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);

    // 生成格式化字符串
    var formattedDate = year + '年' + month + '月' + day + '日';

    // 输出格式化日期（可替换为所需的其他操作）
//    console.log(formattedDate);

    // 在页面上显示（可选）
//    var dateElement = document.createElement('div');
//    dateElement.textContent = formattedDate;
//    document.body.appendChild(dateElement);

    document.getElementById('1581261440012c13e').lastElementChild.innerHTML=formattedDate//
//    document.getElementById('1702640008269889c').lastElementChild.lastElementChild.innerHTML='/'//
           document.getElementById('1584177803141c102').lastElementChild.innerHTML=formattedDate//

document.getElementById('17014878067399fe6').lastElementChild.innerHTML='/'
document.getElementById('17041912859544faf').lastElementChild.innerHTML='/'

        document.getElementById('170264247697664b1').lastElementChild.lastElementChild.innerHTML='≥7mm'
     document.getElementById('17041912859544faf').lastElementChild.innerHTML='已按照安徽省市场监督管理局“皖市监办[2023]757号文”要求查验。'} }
            ]
        },
        {
            name: 'group11',
            options: [
                { id: 'g11-option1', label: '重块', action: () => { document.getElementById('1706319611211eddb').lastElementChild.lastElementChild.innerHTML='√' } },
                { id: 'g11-option2', label: '弹簧', action: () => { document.getElementById('1706319611211eddb').lastElementChild.lastElementChild.innerHTML='/' } }
            ]
        }
    ];


    const groups2 =[
        {
            name: 'group1',
            options: [
                { id: 'g1-option1', label: '有机房', action: () => {
                    document.getElementById('1700707229622ab0').lastElementChild.innerHTML='≥1.80';//通道门
document.getElementById('17007072296227ef').lastElementChild.innerHTML='≥0.60';//通道门
document.getElementById('1700707229622857').lastElementChild.innerHTML='√';//通道门
document.getElementById('1700707229622f6d').lastElementChild.innerHTML='√';//通道门
document.getElementById('1700707229623522').lastElementChild.innerHTML='/';//轿顶工作区域
document.getElementById('17007072296237f7').lastElementChild.innerHTML='/';//轿顶工作区域
document.getElementById('1700709297196ca9').lastElementChild.innerHTML='/';//紧急操作屏
document.getElementById('1700709297196eaa').lastElementChild.innerHTML='/';//紧急操作屏
document.getElementById('1700709297197c53').lastElementChild.innerHTML='/';//紧急操作屏
document.getElementById('1700709961943e27').lastElementChild.innerHTML='≦80';//噪声1
document.getElementById('1700709961943d1a').lastElementChild.innerHTML='√';//噪声2
document.getElementById('1700709961943967').lastElementChild.innerHTML='≦55';//噪声3
document.getElementById('1700709961943ec6').lastElementChild.innerHTML='√';//噪声4
document.getElementById('1700709961943eb6').lastElementChild.innerHTML='≦65';//噪声5
document.getElementById('17007099619438ca').lastElementChild.innerHTML='√';//噪声6
document.getElementById('170070996194369d').lastElementChild.innerHTML='/';//噪声7
document.getElementById('1701870691681fd0b').lastElementChild.innerHTML='/';//噪声8
} },
                { id: 'g1-option2', label: '无机房', action: () => {
					document.getElementById('1700707229622ab0').lastElementChild.innerHTML='/';//通道门
document.getElementById('17007072296227ef').lastElementChild.innerHTML='/';//通道门
document.getElementById('1700707229622857').lastElementChild.innerHTML='/';//通道门
document.getElementById('1700707229622f6d').lastElementChild.innerHTML='/';//通道门
document.getElementById('1700707229623522').lastElementChild.innerHTML='√';//轿顶工作区域
document.getElementById('17007072296237f7').lastElementChild.innerHTML='√';//轿顶工作区域
document.getElementById('1700709297196ca9').lastElementChild.innerHTML='√';//紧急操作屏
document.getElementById('1700709297196eaa').lastElementChild.innerHTML='√';//紧急操作屏
document.getElementById('1700709297197c53').lastElementChild.innerHTML='√';//紧急操作屏
document.getElementById('1700709961943e27').lastElementChild.innerHTML='/';//噪声1
document.getElementById('1700709961943d1a').lastElementChild.innerHTML='/';//噪声2
document.getElementById('1700709961943967').lastElementChild.innerHTML='≦55';//噪声3
document.getElementById('1700709961943ec6').lastElementChild.innerHTML='√';//噪声4
document.getElementById('1700709961943eb6').lastElementChild.innerHTML='≦65';//噪声5
document.getElementById('17007099619438ca').lastElementChild.innerHTML='√';//噪声6
document.getElementById('170070996194369d').lastElementChild.innerHTML='≦65';//噪声7
document.getElementById('1701870691681fd0b').lastElementChild.innerHTML='√';//噪声8
                    } }
            ]
        },
        {
            name: 'group2',
            options: [
                { id: 'g2-option1', label: '无平台 ', action: () => {
					document.getElementById('17014988975564d3e').lastElementChild.lastElementChild.innerHTML='/';
} },
                { id: 'g2-option2', label: '有平台', action: () => {
					document.getElementById('17014988975564d3e').lastElementChild.lastElementChild.innerHTML='√';
                     } }
            ]
        },
        {
            name: 'group3',
            options: [
                { id: 'g3-option1', label: '有机械锁', action: () => {

        document.getElementById('1713609754630cca3').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('171360975463082b7').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('17136097546304813').lastElementChild.lastElementChild.innerHTML='√'; } },
                { id: 'g3-option2', label: '无机械锁', action: () => {


        document.getElementById('1713609754630cca3').lastElementChild.lastElementChild.innerHTML='≤0.15';
document.getElementById('171360975463082b7').lastElementChild.lastElementChild.innerHTML='√';
document.getElementById('17136097546304813').lastElementChild.lastElementChild.innerHTML='/';
} }
            ]
        },
        {
            name: 'group4',
            options: [
                { id: 'g4-option1', label: '非同机房', action: () => { document.getElementById('1700709206427acc').lastElementChild.innerHTML='/';//29
				} },
                { id: 'g4-option2', label: '同机房', action: () => { document.getElementById('1700709206427acc').lastElementChild.innerHTML='√';//29
				} }
            ]
        },
        {
            name: 'group5',
            options: [
                { id: 'g5-option1', label: '无自动救援', action: () => { document.getElementById('1700709258672f23').lastElementChild.innerHTML='/';//35
document.getElementById('170070925867271e').lastElementChild.innerHTML='/';//35
document.getElementById('1700709258672aee').lastElementChild.innerHTML='/';//35
 } },
                { id: 'g5-option2', label: '有自动救援', action: () => { document.getElementById('1700709258672f23').lastElementChild.innerHTML='√';//35
document.getElementById('170070925867271e').lastElementChild.innerHTML='√';//35
document.getElementById('1700709258672aee').lastElementChild.innerHTML='√';//35
 } }
            ]
        },
        {
            name: 'group6',
            options: [
                { id: 'g6-option1', label: '有紧急电动', action: () => { document.getElementById('1700709258672302').lastElementChild.innerHTML='√';//37
document.getElementById('1700709258672eb2').lastElementChild.innerHTML='√';//37
} },
                { id: 'g6-option2', label: '无紧急电动', action: () => { document.getElementById('1700709258672302').lastElementChild.innerHTML='/';//37
document.getElementById('1700709258672eb2').lastElementChild.innerHTML='/';//37
} }
            ]
        },
        {
            name: 'group7',
            options: [
                { id: 'g7-option1', label: '有盘车  ', action: () => { document.getElementById('17007092971979e1').lastElementChild.innerHTML='√';//43
document.getElementById('170070929719748b').lastElementChild.innerHTML='√';//43
} },
                { id: 'g7-option2', label: '无盘车', action: () => { document.getElementById('17007092971979e1').lastElementChild.innerHTML='/';//43
document.getElementById('170070929719748b').lastElementChild.innerHTML='/';//43
 } }
            ]
        },
        {
            name: 'group8',
            options: [
                { id: 'g8-option1', label: '钢丝绳', action: () => { document.getElementById('1701778838280007d').lastElementChild.innerHTML='≥90';//44
document.getElementById('1700709338998df7').lastElementChild.innerHTML='√';//44
document.getElementById('1700709338998a55').lastElementChild.innerHTML='√';//44
document.getElementById('17007093389993ec').lastElementChild.innerHTML='/';//44
document.getElementById('1700709338999fbe').lastElementChild.innerHTML='/';//44
document.getElementById('17007093389991ba').lastElementChild.innerHTML='/';//44
document.getElementById('1700709339004aa5').lastElementChild.innerHTML='/';//44
} },
                { id: 'g8-option2', label: '包覆带', action: () => { document.getElementById('1701778838280007d').lastElementChild.innerHTML='/';//44
document.getElementById('1700709338998df7').lastElementChild.innerHTML='/';//44
document.getElementById('1700709338998a55').lastElementChild.innerHTML='/';//44
document.getElementById('17007093389993ec').lastElementChild.innerHTML='√';//44
document.getElementById('1700709338999fbe').lastElementChild.innerHTML='√';//44
document.getElementById('17007093389991ba').lastElementChild.innerHTML='√';//44
document.getElementById('1700709339004aa5').lastElementChild.innerHTML='√';//44
} }
            ]
        },
        {
            name: 'group9',
            options: [
                { id: 'g9-option1', label: '有补偿', action: () => {
					document.getElementById('1700709339004d70').lastElementChild.innerHTML='√';//47
				} },
                { id: 'g9-option2', label: '无补偿', action: () => {
					document.getElementById('1700709339004d70').lastElementChild.innerHTML='/';//47
				} }
            ]
			},
			        {
            name: 'group10',
            options: [
                { id: 'g10-option1', label: '金属反绳轮', action: () => {
					document.getElementById('1700709339004202').lastElementChild.innerHTML='/';//49
document.getElementById('17007093390040be').lastElementChild.innerHTML='/';//49
document.getElementById('170070933900490e').lastElementChild.innerHTML='/';//49
document.getElementById('1700709339004587').lastElementChild.innerHTML='/';//49
				} },
                { id: 'g10-option2', label: '非金属反绳轮', action: () => {
				document.getElementById('1700709339004202').lastElementChild.innerHTML='√';//49
document.getElementById('17007093390040be').lastElementChild.innerHTML='√';//49
document.getElementById('170070933900490e').lastElementChild.innerHTML='/';//49
document.getElementById('1700709339004587').lastElementChild.innerHTML='√';//49
				} }
            ]
			},
			        {
            name: 'group11',
            options: [
                { id: 'g11-option1', label: '无安全窗', action: () => {
					document.getElementById('1700709371213d74').lastElementChild.innerHTML='/';//53
document.getElementById('1700709371213bcd').lastElementChild.innerHTML='/';//53
document.getElementById('170070937121335b').lastElementChild.innerHTML='/';//53
				} },
                { id: 'g11-option2', label: '有安全窗', action: () => {
					document.getElementById('1700709371213d74').lastElementChild.innerHTML='√';//53
document.getElementById('1700709371213bcd').lastElementChild.innerHTML='√';//53
document.getElementById('170070937121335b').lastElementChild.innerHTML='√';//53
				} }
            ]
			},
			        {
            name: 'group12',
            options: [
                { id: 'g12-option1', label: '非金属对重块', action: () => {
					document.getElementById('170701580855783d2').lastElementChild.innerHTML='√';//56
				} },
                { id: 'g12-option2', label: '金属对重块', action: () => {
					document.getElementById('170701580855783d2').lastElementChild.innerHTML='/';//56
				} }
            ]
			},
			        {
            name: 'group13',
            options: [
                { id: 'g13-option1', label: '无IC卡', action: () => {
					document.getElementById('1707015814536089b').lastElementChild.innerHTML='/';//57
				} },
                { id: 'g13-option2', label: '有IC卡', action: () => {
					document.getElementById('1707015814536089b').lastElementChild.innerHTML='√';//57
				} }
            ]
			},
			        {
            name: 'group14',
            options: [
                { id: 'g14-option1', label: '重块', action: () => {
document.getElementById('17007095305957ae').lastElementChild.innerHTML='√';//57
				} },
                { id: 'g14-option2', label: '弹簧', action: () => {
					document.getElementById('17007095305957ae').lastElementChild.innerHTML='/';//57
				} }
            ]
			},
			        {
            name: 'group15',
            options: [
                { id: 'g15-option1', label: '无对重安全钳', action: () => {
					document.getElementById('1700707447003836').lastElementChild.innerHTML='/';
document.getElementById('170070962560227c').lastElementChild.innerHTML='/';
document.getElementById('1700709625603b6d').lastElementChild.innerHTML='/';
document.getElementById('1700709625603274').lastElementChild.innerHTML='/';
				} },
                { id: 'g15-option2', label: '有对重安全钳', action: () => {
					document.getElementById('1700707447003836').lastElementChild.innerHTML='√';
document.getElementById('170070962560227c').lastElementChild.innerHTML='√';
document.getElementById('1700709625603b6d').lastElementChild.innerHTML='√';
document.getElementById('1700709625603274').lastElementChild.innerHTML='/';
				} }
            ]
			},
			        {
            name: 'group16',
            options: [
                { id: 'g16-option1', label: '冗余制动器', action: () => {
					document.getElementById('1700709625603749').lastElementChild.innerHTML='√';
document.getElementById('1700709664136d5b').lastElementChild.innerHTML='√';
				} },
                { id: 'g16-option2', label: '非冗余制动器', action: () => {
					document.getElementById('1700709625603749').lastElementChild.innerHTML='/';
document.getElementById('1700709664136d5b').lastElementChild.innerHTML='/';
				} }
            ]
			},
			        {
            name: 'group17',
            options: [
                { id: 'g17-option1', label: '有其他制动', action: () => {
					document.getElementById('1700709664136131').lastElementChild.innerHTML='√';
				} },
                { id: 'g17-option2', label: '无其他制动', action: () => {
					document.getElementById('1700709664136131').lastElementChild.innerHTML='/';
				} }
            ]
			},
    ];

    const groups3 = [
        {
            name: 'group5',
            options: [
                { id: 'g5-option1', label: '组5-选项1', action: () => { console.log('组5-选项1被选择'); } },
                { id: 'g5-option2', label: '组5-选项2', action: () => { console.log('组5-选项2被选择'); } }
            ]
        },
        {
            name: 'group6',
            options: [
                { id: 'g6-option1', label: '组6-选项1', action: () => { console.log('组6-选项1被选择'); } },
                { id: 'g6-option2', label: '组6-选项2', action: () => { console.log('组6-选项2被选择'); } }
            ]
        }
    ];

    const allGroups = [groups1, groups2, groups3];
    let currentIndex = 0;
    let currentGroups = allGroups[currentIndex];

    // 新按钮和 textBoxLabel 的内容
    const newButtonLabels = ['一键出具复检', '新按钮 - 组3和组4', '新按钮 - 组5和组6'];
    const textBoxLabelContents = ['定期检验', '监督检验', '还没做好'];

    // 创建文本框前的说明文字
    const textBoxLabel = document.createElement('label');
    textBoxLabel.textContent = textBoxLabelContents[currentIndex];
    textBoxLabel.style.display = 'block';
    textBoxLabel.style.marginBottom = '5px';

    // 额外的输入文本框
    const extraTextBox1 = document.createElement('input');
    extraTextBox1.type = 'text';
    extraTextBox1.placeholder = '默认值1';
    extraTextBox1.style.marginLeft = '10px';
    extraTextBox1.style.width = '100px'; // 设置文本框宽度
    extraTextBox1.value = 250

    const extraTextBox2 = document.createElement('input');
    extraTextBox2.type = 'text';
    extraTextBox2.placeholder = '默认值2';
    extraTextBox2.style.marginLeft = '10px';
    extraTextBox2.style.width = '100px'; // 设置文本框宽度
    extraTextBox2.value = 950

    const extraTextBox3 = document.createElement('input');
    extraTextBox3.type = 'text';
    extraTextBox3.placeholder = '默认值3';
    extraTextBox3.style.marginLeft = '10px';
    extraTextBox3.style.width = '100px'; // 设置文本框宽度
    extraTextBox3.value = 1.20

    const extraTextBox4 = document.createElement('input');
    extraTextBox4.type = 'text';
    extraTextBox4.placeholder = '默认值3';
    extraTextBox4.style.marginLeft = '10px';
    extraTextBox4.style.width = '100px'; // 设置文本框宽度
    extraTextBox4.value = 0.50

    const extraTextBox5 = document.createElement('input');
    extraTextBox5.type = 'text';
    extraTextBox5.placeholder = '默认值3';
    extraTextBox5.style.marginLeft = '10px';
    extraTextBox5.style.width = '100px'; // 设置文本框宽度
    extraTextBox5.value = '≥0.70'

    const extraTextBox6 = document.createElement('input');
    extraTextBox6.type = 'text';
    extraTextBox6.placeholder = '默认值3';
    extraTextBox6.style.marginLeft = '10px';
    extraTextBox6.style.width = '100px'; // 设置文本框宽度
    extraTextBox6.value = '≥0.90'

    // 创建额外文本框前的说明文字
    const extraTextBoxLabel1 = document.createElement('label');
    extraTextBoxLabel1.textContent = '层门护脚板高（mm)';
    extraTextBoxLabel1.style.display = 'inline-block';
    extraTextBoxLabel1.style.marginBottom = '5px';

    const extraTextBoxLabel2 = document.createElement('label');
    extraTextBoxLabel2.textContent = '层门护脚板宽（mm) ';
    extraTextBoxLabel2.style.display = 'inline-block';
    extraTextBoxLabel2.style.marginBottom = '5px';

    const extraTextBoxLabel3 = document.createElement('label');
    extraTextBoxLabel3.textContent = '对重护栏宽度（m):  ';
    extraTextBoxLabel3.style.display = 'inline-block';
    extraTextBoxLabel3.style.marginBottom = '5px';

    const extraTextBoxLabel4 = document.createElement('label');
    extraTextBoxLabel4.textContent = '最底部件（m):   ';
    extraTextBoxLabel4.style.display = 'inline-block';
    extraTextBoxLabel4.style.marginBottom = '5px';
    extraTextBoxLabel4.style.minWidth = '130px'; // 设置一个最小宽度以对齐

    const extraTextBoxLabel5 = document.createElement('label');
    extraTextBoxLabel5.textContent = '轿厢护栏（m):   ';
    extraTextBoxLabel5.style.display = 'inline-block';
    extraTextBoxLabel5.style.marginBottom = '5px';

    const extraTextBoxLabel6 = document.createElement('label');
    extraTextBoxLabel6.textContent = '轿厢护脚板（m): ';
    extraTextBoxLabel6.style.display = 'inline-block';
    extraTextBoxLabel6.style.marginBottom = '5px';

    extraTextBoxLabel1.style.minWidth = '130px'; // 设置一个最小宽度以对齐
    extraTextBoxLabel2.style.minWidth = '130px'; // 设置一个最小宽度以对齐
    extraTextBoxLabel3.style.minWidth = '130px'; // 设置一个最小宽度以对齐
    extraTextBoxLabel4.style.minWidth = '130px'; // 设置一个最小宽度以对齐
    extraTextBoxLabel5.style.minWidth = '130px'; // 设置一个最小宽度以对齐
    extraTextBoxLabel6.style.minWidth = '130px'; // 设置一个最小宽度以对齐

    // 用于判断是否需要额外文本框的函数
    function needsExtraTextBoxes() {
        return currentIndex === 1; // 当 currentIndex 为 1 时，显示额外文本框
    }

    // 新按钮函数集合
    const newButtonActions = [
        () => { alert('新按钮 - 组1和组2'); },
        () => { document.getElementById('1581475038385c79e').lastElementChild.innerHTML='安装';
var currentDate = new Date();
var year = currentDate.getFullYear();
var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
var day = ('0' + currentDate.getDate()).slice(-2);
var formattedDate = year + '年' + month + '月' + day + '日';
document.getElementById('1581261440012c13e').lastElementChild.innerHTML=formattedDate;
var formattedDate1 = year+2 + '年' + month + '月' ;
document.getElementById('17059039535637d5d').lastElementChild.innerHTML=formattedDate1;
document.getElementById('1701488356203288f').lastElementChild.lastElementChild.innerHTML='新增';
document.getElementById('17041897957673639').lastElementChild.innerHTML='/';//备注栏
document.getElementById('17014878067399fe6').lastElementChild.innerHTML='/';
document.getElementById('170149150214820be').lastElementChild.lastElementChild.innerHTML='/';//变更设计
document.getElementById('1700808845918a9f1').lastElementChild.innerHTML='/';//改造1
document.getElementById('1700707205556c39').lastElementChild.innerHTML='/';//改造2
document.getElementById('17007072055560d3').lastElementChild.innerHTML='/';//改造3
document.getElementById('17007072055573c1').lastElementChild.innerHTML='/';//改造4
document.getElementById('17007072055579c1').lastElementChild.innerHTML='/';//改造5
document.getElementById('1700707205557b66').lastElementChild.innerHTML='/';//改造6
document.getElementById('17007072055573e7').lastElementChild.innerHTML='/';//改造7
document.getElementById('1700707205557a14').lastElementChild.innerHTML='/';//改造8
document.getElementById('17007072055578d2').lastElementChild.innerHTML='/';//改造9
document.getElementById('170149889755559c3').lastElementChild.lastElementChild.innerHTML='≤4.00';//序号5
//document.getElementById('170149889755754ea').lastElementChild.lastElementChild.innerHTML='/';//10
//document.getElementById('17014988975587576').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('17014988975589e6f').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('17014988975589e6f').lastElementChild.lastElementChild.innerHTML='/';//11
document.getElementById('1713609754629fb86').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713609754629b9e2').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713609754629d54b').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('17136097546304eef').lastElementChild.lastElementChild.innerHTML='/';//12
document.getElementById('1713609754630c002').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713609754630a21d').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713609754630a714').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713609754630fb87').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713609754630438e').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713609754630f680').lastElementChild.lastElementChild.innerHTML='/';//WEIBI
document.getElementById('1713579765611761d').lastElementChild.lastElementChild.innerHTML='/';//安全门
document.getElementById('17135797656125201').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713579765612f08d').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('17135797656125f83').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('17135797656126a31').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('17135797656125f57').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1713579765612cecd').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('171357976561274e9').lastElementChild.lastElementChild.innerHTML='/';
//document.getElementById('1713579765612cc19').lastElementChild.lastElementChild.innerHTML='/';//可进人
//document.getElementById('1702794057657a5dc').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('17027940576584c18').lastElementChild.lastElementChild.innerHTML='/';
document.getElementById('1700709258672417').lastElementChild.innerHTML='/';
document.getElementById('170070766653033c').lastElementChild.innerHTML='≥0.10';
document.getElementById('1701505397192a439').lastElementChild.innerHTML='≥1.00';
document.getElementById('17015056461501f4d').lastElementChild.innerHTML='≥0.10';
document.getElementById('1701505646152d3b7').lastElementChild.innerHTML='≥0.30';
document.getElementById('1701505646153d9b0').lastElementChild.innerHTML='≥0.50';
document.getElementById('1701505646154eea2').lastElementChild.innerHTML='≥0.60';
document.getElementById('1701505646154808d').lastElementChild.innerHTML='≥0.80';
document.getElementById('170070912141620a').lastElementChild.innerHTML='≥0.50';
document.getElementById('17007091214160df').lastElementChild.innerHTML='≥0.60';
document.getElementById('1700709121416357').lastElementChild.innerHTML='≥1.00';
document.getElementById('1700709121416d91').lastElementChild.innerHTML='/';
document.getElementById('1700709121416b86').lastElementChild.innerHTML='/';
document.getElementById('1700709121416d4c').lastElementChild.innerHTML='/';
document.getElementById('1700709206427fdd').lastElementChild.innerHTML='/';//29
document.getElementById('1700709297197fab').lastElementChild.innerHTML='≤1.00';//39
document.getElementById('170070929719722e').lastElementChild.innerHTML='/';//42
document.getElementById('1700709339004133').lastElementChild.innerHTML='/';//47
document.getElementById('170070937121386a').lastElementChild.innerHTML='≥0.10';//52
document.getElementById('1700709371213ce7').lastElementChild.innerHTML='＜0.15';//52
document.getElementById('1700709371213dfb').lastElementChild.innerHTML='≥0.10';//52
document.getElementById('17007094041879c3').lastElementChild.innerHTML='/';//安全门
document.getElementById('1700709404187ab7').lastElementChild.innerHTML='/';//安全门
document.getElementById('1700709404187825').lastElementChild.innerHTML='/';//安全门
document.getElementById('1700709404187097').lastElementChild.innerHTML='/';//安全门
document.getElementById('170070943409427b').lastElementChild.innerHTML='≤6';//门间隙
document.getElementById('17007094340949f0').lastElementChild.innerHTML='≤30';//门间隙
document.getElementById('1700709434094748').lastElementChild.innerHTML='/';//玻璃门
document.getElementById('1700709587630d87').lastElementChild.innerHTML='45';//平衡
document.getElementById('1700709587630fe0').lastElementChild.innerHTML='/';//平衡
document.getElementById('17007095876309ce').lastElementChild.innerHTML='/';//平衡
document.getElementById('17007096256025ec').lastElementChild.innerHTML='/';//平衡

               document.getElementById('170070766653031a').lastElementChild.innerHTML='/';//tongjigndao

              },
        () => { alert('新按钮 - 组5和组6'); }
    ];

    // 每组对应的函数集合
    const groupSpecificActions = [
        () => { var parentElement = document.getElementById('1581261440012c13e');
var dateElement = parentElement.querySelector('.widget-content[default-date="0"]');
var dateStr = dateElement.innerText.trim();
var dateParts = dateStr.match(/(\d{4})年(\d{2})月(\d{2})日/);
var year0 = parseInt(dateParts[1]) ;
var year1 = parseInt(dateParts[1]) + 1;
var year2 = parseInt(dateParts[1]) + 2;
var month = dateParts[2];
var newDateStr0 = year0 + "年" + month + "月";
var newDateStr1 = year1 + "年" + month + "月";
var newDateStr2 = year2 + "年" + month + "月";
var DATE1 = newDateStr1;
var DATE2 = newDateStr2;
document.getElementById('17048660889290048').lastElementChild.innerHTML=DATE2;
document.getElementById('170486608684702b3').lastElementChild.innerHTML=DATE1;
var currentDate = new Date();
var year = currentDate.getFullYear();
var Fmonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
var day = ('0' + currentDate.getDate()).slice(-2);
var formattedDate = year + '年' + Fmonth + '月' + day + '日';
document.getElementById('1581261440012c13e').lastElementChild.innerHTML=formattedDate;
var Str1 = newDateStr0;
var Str2element = document.getElementById('1555403108834bb43');
var Str2 = Str2element.querySelector('.widget-content').textContent.trim();
var Str3element = document.getElementById('17024767427623ef3');
var Str3 = Str3element.querySelector('.widget-content').textContent.trim();
var Str4element = document.getElementById('17024767480702d68');
var Str4 = Str4element.querySelector('.widget-content').textContent.trim();
console.log('本检验机构于'+Str1+'出具了编号为'+Str2+'的《电梯定期检验报告》。按照TSG T7001—2023的规定，本检验机构对该报告所对应的电梯中序号为'+Str3+Str4+'的项目进行了复检，出具本检验记录');
var StrBeizhu = '本检验机构于'+Str1+'出具了编号为'+Str2+'的《电梯定期检验报告》。按照TSG T7001—2023的规定，本检验机构对该报告所对应的电梯中序号为'+Str3+Str4+'的项目进行了复检，出具本检验记录'
document.getElementById('17041912859544faf').lastElementChild.innerHTML=StrBeizhu
document.getElementById('1702476745708a287').lastElementChild.innerHTML='0';
document.getElementById('17024767427623ef3').lastElementChild.innerHTML='/';
document.getElementById('1702476752677dcfe').lastElementChild.innerHTML='0';
document.getElementById('17024767480702d68').lastElementChild.innerHTML='/';
document.getElementById('1563606498846b3e9').lastElementChild.innerHTML='合格';
function replaceXWithCheck() {
        // Select all elements that might contain the value
        const elements = document.querySelectorAll('input, span, div, td'); // Add more selectors if needed

        elements.forEach((element) => {
            if (element.value === '×') {
                element.value = '√';
            } else if (element.textContent === '×') {
                element.textContent = '√';
            }
        });
    }

    // Run the function
    replaceXWithCheck();

    // Optional: Run the function whenever the DOM changes (e.g., if content is loaded dynamically)
    const observer = new MutationObserver(replaceXWithCheck);
    observer.observe(document.body, { childList: true, subtree: true });

               ; },
        () => { console.log('执行组3和组4的特定操作'); },
        () => { console.log('执行组5和组6的特定操作'); }
    ];

    // 函数用于插入单选框到容器
    function insertRadioButtons() {
        container.innerHTML = ''; // 清空容器内容
        container.appendChild(textBoxLabel); // 重新插入说明文字

        if (needsExtraTextBoxes()) {
            const extraContainer1 = document.createElement('div');
            extraContainer1.style.display = 'flex';
            extraContainer1.style.alignItems = 'center';
            extraContainer1.style.marginBottom = '10px';
            extraContainer1.appendChild(extraTextBoxLabel1);
            extraContainer1.appendChild(extraTextBox1);

            const extraContainer2 = document.createElement('div');
            extraContainer2.style.display = 'flex';
            extraContainer2.style.alignItems = 'center';
            extraContainer2.style.marginBottom = '10px';
            extraContainer2.appendChild(extraTextBoxLabel2);
            extraContainer2.appendChild(extraTextBox2);

            const extraContainer3 = document.createElement('div');
            extraContainer3.style.display = 'flex';
            extraContainer3.style.alignItems = 'center';
            extraContainer3.style.marginBottom = '10px';
            extraContainer3.appendChild(extraTextBoxLabel3);
            extraContainer3.appendChild(extraTextBox3);

            const extraContainer4 = document.createElement('div');
            extraContainer4.style.display = 'flex';
            extraContainer4.style.alignItems = 'center';
            extraContainer4.style.marginBottom = '10px';
            extraContainer4.appendChild(extraTextBoxLabel4);
            extraContainer4.appendChild(extraTextBox4);

            const extraContainer5 = document.createElement('div');
            extraContainer5.style.display = 'flex';
            extraContainer5.style.alignItems = 'center';
            extraContainer5.style.marginBottom = '10px';
            extraContainer5.appendChild(extraTextBoxLabel5);
            extraContainer5.appendChild(extraTextBox5);

            const extraContainer6 = document.createElement('div');
            extraContainer6.style.display = 'flex';
            extraContainer6.style.alignItems = 'center';
            extraContainer6.style.marginBottom = '10px';
            extraContainer6.appendChild(extraTextBoxLabel6);
            extraContainer6.appendChild(extraTextBox6);

            container.appendChild(extraContainer1);
            container.appendChild(extraContainer2);
            container.appendChild(extraContainer3);
            container.appendChild(extraContainer4);
            container.appendChild(extraContainer5);
            container.appendChild(extraContainer6);
        }

        currentGroups.forEach(group => {
            const groupContainer = document.createElement('div');
            groupContainer.style.display = 'flex';
            groupContainer.style.alignItems = 'center';
            groupContainer.style.marginBottom = '10px';

            group.options.forEach((option, index) => {
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.id = option.id;
                radio.name = group.name;
                radio.value = option.id;
                if (index === 0) {
                    radio.checked = true; // 设置第一个选项为默认选项
                }

                const label = document.createElement('label');
                label.htmlFor = option.id;
                label.textContent = option.label;
                label.style.marginRight = '10px';
                label.style.minWidth = '100px'; // 设置一个最小宽度以对齐

                groupContainer.appendChild(radio);
                groupContainer.appendChild(label);
            });

            container.appendChild(groupContainer);
        });

        const submitButton = document.createElement('button');
        submitButton.textContent = '智能填充';
        submitButton.style.display = 'inline-block';
        submitButton.style.marginTop = '10px';

        // 提交按钮点击事件
        submitButton.addEventListener('click', () => {
            currentGroups.forEach(group => {
                const selected = document.querySelector(`input[name="${group.name}"]:checked`);
                if (selected) {
                    const option = group.options.find(opt => opt.id === selected.value);
                    if (option && option.action) {
                        option.action(); // 执行对应的操作
                    }
                }
            });
            if (needsExtraTextBoxes()) {
                const extraContent1 = extraTextBox1.value;
                const extraContent2 = extraTextBox2.value;
                const extraContent3 = extraTextBox3.value;
                const extraContent4 = extraTextBox4.value;
                const extraContent5 = extraTextBox5.value;
                const extraContent6 = extraTextBox6.value;
                console.log('额外文本框内容1:', extraContent1);
                console.log('额外文本框内容2:', extraContent2);
                console.log('额外文本框内容3:', extraContent3);
                document.getElementById('1700707447001912').lastElementChild.innerHTML=extraContent1;
                document.getElementById('1700707447001621').lastElementChild.innerHTML=extraContent2;
                document.getElementById('1701505646155e273').lastElementChild.innerHTML=extraContent3;
                document.getElementById('1700709121416087').lastElementChild.innerHTML=extraContent4;
                document.getElementById('170070937121358a').lastElementChild.innerHTML=extraContent5;
                document.getElementById('1700709434094d1e').lastElementChild.innerHTML=extraContent6;

            }
            // 调用新按钮对应的函数
            newButtonActions[currentIndex]();
        });

        // 创建并插入切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '切换选项';
        toggleButton.style.display = 'inline-block';
        toggleButton.style.marginLeft = '10px';
        toggleButton.style.marginTop = '10px';

        // 切换按钮点击事件
        toggleButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % allGroups.length;
            currentGroups = allGroups[currentIndex];
            textBoxLabel.textContent = textBoxLabelContents[currentIndex]; // 更新说明文字
            insertRadioButtons(); // 切换后重新插入单选框和更新文本框内容
        });

        // 创建并插入新按钮
        const newButton = document.createElement('button');
        newButton.textContent = newButtonLabels[currentIndex];
        newButton.style.display = 'inline-block';
        newButton.style.marginLeft = '10px';
        newButton.style.marginTop = '10px';

        // 新按钮点击事件
        newButton.addEventListener('click', () => {
            groupSpecificActions[currentIndex]();
        });

        container.appendChild(submitButton);
        container.appendChild(toggleButton);
        container.appendChild(newButton);
    }

    insertRadioButtons();
    document.body.appendChild(container);
})();
