// ==UserScript==
// @name         YM DuoMax Pro
// @namespace    http://tampermonkey.net/
// @version      v1.0.4_PRO
// @description  XP + Gems + Real Streak farming tool for Duolingo with professional UI and neon effects
// @author       ´꒳`ⓎⒶⓂⒾⓈⒸⓇⒾⓅⓉ×͜×
// @match        https://www.duolingo.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://lh3.googleusercontent.com/rd-gg/AIJ2gl8mxY34cAfQqgLAdQs-THRY_DtLfdsGbrtVudQdrmoWs56n5_WYeeQqr_BBzyC2waVURKTYcZYGQ5420K1CmE4N5mK-7S2Pnj_xe_Xveq2FucZyuNnsv-H6LtQ9-waE-xKBtlNOK9we46uPLUSEU2wGv-ebqo6v_8HeBSFTkCc-ZAHG3WMYZHx9ONp-0ulL77tmmmcl1S4HIjZKeERHa2wbfJMWkn04mmNjHiCD06smAkJupd_9ciPhgJ6y44_QrNmAWL6thXHE9VjPAJKndDTxteeL5LdHLiQpEvi81jxRDiZNNfoRh7m9-7QoepugPJqMpiYaXYwr8h_KqfXen9R5L9kJz8prY00Lr6C30q291AM2KS8kIhxphT6Kl-TPAp9hXmWeesJU5RfWzTazruw-puPMthvSb0CeVTfNNKkpAilj9gDDMI48COs8IDJPDLzF0t2asqyqZeVh-VMYxJBUGQ6sMevpgzvHpi2wjofv0wATXRDRHYhRWorz37U7s2SMEtFv9Cy3_4Ruie_tMGDHP4SOU2uuRzUMSKZ13lI5MjTpdOifVBGAPHnOK0sNLfIJ89ULeeoRPJQ7s8TPrUTw3punXL9BoeGUFxn1Z-kFygnJeBDTKjjsXBi2jnjy8Ms5loQe0WY2pI3hK_EYDSv0Tt-5SopycPs1rNa4uoNIB05sHqxVvd_V4LChQE6470iiCq9W78e3vOiQNGRdjalyTaub1uxiG3TY6hmKiflqQymM4KqAQK5wanlujiSn7PLGhDmxHcBeXL-jMW77ZFxG7ex8xppJEJUGr66ygMv6VwEArOzXTZRGsIg6GuCIb2DYHLjeFTKgWxnetkFQPkfo3Imv3aTgkdLTtXSU0P4joHcxiJ9SI5TYUeRrs8rdNvMT99crJP2YX51bVFqaaB0XQvfherhEeYWsTYblkSWf-nZ0EK7IyRSXNqXC-RDgtNvRqH3vDxqL0b5e0BjvbpyMigDFgs1BT8mJDuT1Rt8sEV0z8ZqlQ0Wu53NlKgB4I0zRfvAenopD2W0A28l0HKGqgyUKxibylHZy8NN3TlHaodA2ZlXgre2hkFHg9LgOkP0CqKW7juoIEeXcMr5B3upmhU2mYeVLTwKe_KhxronvqW6YuC0q-0drdFmc5ONvNOXgD5PUXVdgqn7QPzqv2CGF9GYdHhnYELohLeXNZwD0nOW2he07xVSNL06OETB-HaWgSt6plv8Foied0cNBIcyTduwI8FaFZBEDpBzjWVuQJmiHgR3yM9VI7FsV3bI1ODOTRctbJbopnX2XLY_kM2vJMuluuL1cY1J3Nz6NuMRfHHdSzm9YNtzZ2DVi--0-CnkbuDFY-SeIF9sg-G_RgRwd5fApm4qVcZvCYIF7TsL7ntSL5uUErB6dkZz3F-mz-CIKUaClMItTtvNv0C3a61H-wIEVnCN2Icb2=s1024-rj
// @downloadURL https://update.greasyfork.org/scripts/542160/YM%20DuoMax%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/542160/YM%20DuoMax%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SERVER_ID = '1377275722342858973';
    const WIDGET_URL = `https://discord.com/widget?id=${SERVER_ID}&theme=dark`;
    const VERSION = 'v1.0.4_PRO';
    let lang = 'en'; // Mặc định là tiếng Anh

    const LANG = {
        en: {
            header: 'DuoMax PRO',
            farmLabel: 'FARM ENGINE MODE',
            start: '🚀 START FARMING',
            stop: 'STOP FARMING',
            done: 'Farm finished',
            copied: 'Token copied!',
            placeholder: 'Enter target amount',
            settings: 'Settings',
            support: 'Support',
            profile: 'Profile',
            discord: 'Discord',
            version: 'Version',
            madeby: 'Made by',
            loggedIn: 'Logged in',
            notLoggedIn: 'Not logged in',
            loginPrompt: 'Login to sync data',
            current: 'Current',
            target: 'Target',
            days: 'days',
            amountLabel: '🎯 AMOUNT TO FARM',
            activityLog: 'ACTIVITY LOG',
            last: 'Last',
            farmingStatus: 'FARMING STATUS',
            runtime: 'RUNTIME',
            streakDays: 'STREAK DAYS',
            status: 'STATUS',
            idle: 'IDLE',
            running: 'RUNNING',
            notStarted: 'Not started',
            testAPI: 'Test API Connection',
            safeMode: '🛡️ SAFE MODE ACTIVE | DELAY: 3s',
            fastMode: '⚡ FAST MODE ACTIVE | DELAY: 1s',
            superMode: '🚀 SUPER FARM MODE ACTIVE | DELAY: 0.5s',
            switchSafe: '🛡️ SAFE',
            switchFast: '⚡ FAST',
            switchSuper: '🚀 SUPER',
            targetModules: 'TARGET MODULES',
            allIn: '🔥 All-In',
            dailyQuests: 'Complete Daily Quests',
            collapse: 'Collapse/Expand',
            minimize: 'Minimize/Maximize',
            close: 'Close',
            newYear: 'Happy New Year!',
            tetEdition: 'Tết Edition'
        },
        vi: {
            header: 'DuoMax PRO',
            farmLabel: 'CHẾ ĐỘ FARM',
            start: '🚀 BẮT ĐẦU FARM',
            stop: 'DỪNG FARM',
            done: 'Farm hoàn thành',
            copied: 'Đã sao chép Token!',
            placeholder: 'Nhập số lượng mục tiêu',
            settings: 'Cài đặt',
            support: 'Hỗ trợ',
            profile: 'Hồ sơ',
            discord: 'Discord',
            version: 'Phiên bản',
            madeby: 'Tạo bởi',
            loggedIn: 'Đã đăng nhập',
            notLoggedIn: 'Chưa đăng nhập',
            loginPrompt: 'Đăng nhập để đồng bộ dữ liệu',
            current: 'Hiện tại',
            target: 'Mục tiêu',
            days: 'ngày',
            amountLabel: '🎯 SỐ LƯỢNG CẦN FARM',
            activityLog: 'NHẬT KÝ HOẠT ĐỘNG',
            last: 'Lần cuối',
            farmingStatus: 'TRẠNG THÁI FARM',
            runtime: 'THỜI GIAN CHẠY',
            streakDays: 'SỐ NGÀY STREAK',
            status: 'TRẠNG THÁI',
            idle: 'CHỜ',
            running: 'ĐANG CHẠY',
            notStarted: 'Chưa bắt đầu',
            testAPI: 'Kiểm tra kết nối API',
            safeMode: '🛡️ CHẾ ĐỘ AN TOÀN | ĐỘ TRỄ: 3s',
            fastMode: '⚡ CHẾ ĐỘ NHANH | ĐỘ TRỄ: 1s',
            superMode: '🚀 CHẾ ĐỘ SIÊU TỐC | ĐỘ TRỄ: 0.5s',
            switchSafe: '🛡️ AN TOÀN',
            switchFast: '⚡ NHANH',
            switchSuper: '🚀 SIÊU TỐC',
            targetModules: 'MÔ-ĐUN MỤC TIÊU',
            allIn: '🔥 Tất cả',
            dailyQuests: 'Hoàn thành Nhiệm vụ Hàng ngày',
            collapse: 'Thu gọn/Mở rộng',
            minimize: 'Thu nhỏ/Phóng to',
            close: 'Đóng',
            newYear: 'Chúc Mừng Năm Mới!',
            tetEdition: 'Phiên bản Tết'
        }
    };

    const t = k => LANG[lang][k] || k;

    const ICONS = {
        xp: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjkuMzMzNCAxNi42NjY3SDIxLjY2NjZMMjYuNjY2NiA1SDE1TDEwLjY2NjYgMjMuMzMzNEgxOC4zMzM0TDEzLjMzMzQgMzVMMjkuMzMzNCAxNi42NjY3WiIgZmlsbD0iI0ZGQ0MwMCIvPjwvc3ZnPg==",
        gem: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgNUMxNSAyMCAxMCAyMCAxMCAzMEMxMCAzNS41IDE0LjUgNDAgMjAgNDBDMjUuNSA0MCAzMCAzNS41IDMwIDMwQzMwIDIwIDI1IDIwIDIwIDVaIiBmaWxsPSIjMEVBNUU5Ii8+PC9zdmc+",
        streak: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgNUMxNSAyMCAxMCAyMCAxMCAzMEMxMCAzNS41IDE0LjUgNDAgMjAgNDBDMjUuNSA0MCAzMCAzNS41IDMwIDMwQzMwIDIwIDI1IDIwIDIwIDVaIiBmaWxsPSIjRkY5NjAwIi8+PC9zdmc+",
        quest: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwM00wMC9zdmciPjxyZWN0IHg9IjUiIHk9IjEwIiB3aWR0aD0iMzAiIGhlaWdodD0iMjUiIHJ4PSI1IiBmaWxsPSIjOEI1RUVGIi8+PHBhdGggZD0iTTE1IDdIMjVUMTBIMTVDN1oiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=",
        league: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSAyMEwyMCAzNUwzNSAyMFY1SDVWMjBaIiBmaWxsPSIjM0I4MkY2Ii8+PC9zdmc+",
        close: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMTBMMzAgMzBNMzAgMTBMMTAgMzAiIHN0cm9rZT0iIzhhOGE4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+",
        minimize: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bGluZSB4MT0iMTAiIHkxPSIyMCIgeDI9IjMwIiB5Mj0iMjAiIHN0cm9rZT0iIzhhOGE4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+",
        discord: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTggNzVhOSA5IDAgMSAwLTkgOWMwLTMuMDQtMS43My01LjY1LTQgNyAwIDAtLjc1LTEuMTUtMS40LTIuNSAwIDAtLjE3LjA2LS4xNy4wNmEyLjEzIDIuMTMgMCAwIDAgLjI2LTEuMDdjLS41Ny0uNjMtMS4wNy0xLjU3LTEuMy0yLjQgMCAwLS44NC4zMi0yLjc1IDEuMDcgMCAwLTEuNS0yLjktMS43LTMuNCAwIDAtMS4wOC0uMS0yLjM4IDAtMS4zIDAtMi4zOCAwLTIuMzggMFMyLjI1IDguNjcgMiAxMmMwIDIuNS42NCA0LjggMS43IDYuNyAwIDAgMSAzLjQgMi43NSA1LjI1IDEuMDcgMCAwIDIuMTUtLjU3IDIuODUtMS4wN2EyLjEzIDIuMTMgMCAwIDAtLjE3LS4wNmwtLjE3LS4wNmMxLjE1IDIgNC41IDMuMjUgNC41IDMuMjVDMjAuMjcgMjAuMzUgMTggMjEgMTggMjFhOSA5IDAgMCAwIDktOXoiIGZpbGw9IiM1ODY1RjIiLz48L3N2Zz4=",
        collapse: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOCAxMkgyME0zIDEySDUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMTcgNEgyME0xNyA0VjIwTTIwIDhIMTJNMTIgOEw0IDE2IiBzdHJva2U9IiM1ODhjYzAyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==",
        daily: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkEyIDIgMCAwIDEgMTIgMThBMiAyIDAgMCAxIDEyIDJaIiBmaWxsPSIjRkZCNzAwIi8+PHBhdGggZD0iTTEyIDIyQTIgMiAwIDAgMCAxMiA2QTIgMiAwIDAgMCAxMiAyMloiIGZpbGw9IiMwRUE1RTkiLz48cGF0aCBkPSJNMiAxMkgyMiIgc3Ryb2tlPSIjRkY2MDAwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=",
        language: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkE5IDkgMCAxIDEgMiAxMUE5IDkgMCAwIDEgMTIgMnoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTIgMTJIMjJNMTIgMmMxLjY1IDMuMjMgMi41IDYuODQgMi41IDEwLjVTMTMuNjUgMTkuMjMgMTIgMjJjLTEuNjUtMi43Ny0yLjUtNi4zOC0yLjUtMTAuNVMxMC4zNSA0Ljc3IDEyIDJ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg=="
    };

    const style = document.createElement('style');
    style.innerHTML = `
        #duomaxpro-border-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 680px;
            padding: 4px;
            border-radius: 22px;
            z-index: 99999;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 16px 48px rgba(0,0,0,0.7);
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #3b82f6, #2dd4bf, #ef4444);
        }
        #duomaxpro-border-box.minimized {
            width: 160px;
            height: 42px;
            top: 16px;
            left: 16px;
            transform: translate(0, 0);
            border-radius: 10px;
        }
        #duomaxpro-border-box.minimized .hide-on-min {
            display: none !important;
        }
        #duomaxpro-container {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 20px;
            padding: 20px;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            z-index: 2;
            color: #f1f5f9;
            background: #0a0f1c;
            overflow: hidden;
        }
        #duomaxpro-border-box.minimized #duomaxpro-container {
            padding: 8px 12px;
            border-radius: 8px;
        }
        #motion-canvas-bg, #border-canvas-engine {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
        #fireworks-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            position: relative;
            z-index: 3;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 10px;
        }
        #duomaxpro-border-box.minimized .header-top {
            margin-bottom: 0;
            border: none;
            padding-bottom: 0;
        }
        .logo-text {
            font-size: 20px;
            font-weight: 900;
            background: linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
        }
        #duomaxpro-border-box.minimized .logo-text {
            font-size: 15px;
        }
        .nav-controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .nav-icon {
            width: 18px;
            height: 18px;
            cursor: pointer;
            opacity: 0.6;
            transition: 0.2s;
        }
        .nav-icon:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        .language-toggle {
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid rgba(255, 107, 107, 0.5);
            border-radius: 12px;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: bold;
            color: #FFD700;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 4px;
            min-width: 60px;
            justify-content: center;
        }
        .language-toggle:hover {
            background: rgba(255, 107, 107, 0.3);
            transform: scale(1.05);
        }
        .language-toggle.active {
            background: rgba(255, 215, 0, 0.3);
            border-color: #FFD700;
            color: #FFD700;
        }
        .language-toggle .flag {
            font-size: 12px;
        }
        .user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.05);
            padding: 8px;
            border-radius: 16px;
            margin-bottom: 14px;
            border: 1px solid rgba(255, 107, 107, 0.3);
            position: relative;
            z-index: 3;
        }
        .user-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: 2px solid #FFD700;
            object-fit: cover;
            background: linear-gradient(135deg, #FF6B6B, #FFD700);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            color: white;
        }
        .user-info {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .user-info b {
            font-size: 13px;
            color: #FFD700;
            margin-bottom: 2px;
        }
        .user-info span {
            font-size: 10px;
            color: #94a3b8;
        }
        .stats-wrapper {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 14px;
            position: relative;
            z-index: 3;
        }
        .stat-card-new {
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(255, 107, 107, 0.3);
            padding: 10px;
            border-radius: 14px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            transition: transform 0.3s;
        }
        .stat-card-new:hover {
            transform: translateY(-2px);
            border-color: #FFD700;
        }
        .icon-small {
            width: 26px;
            height: 26px;
        }
        .stat-val {
            font-size: 18px;
            font-weight: 800;
        }
        .stat-lbl {
            font-size: 7px;
            text-transform: uppercase;
            color: #94a3b8;
            letter-spacing: 0.5px;
        }
        .section-title {
            font-size: 9px;
            font-weight: 700;
            color: #FFD700;
            text-transform: uppercase;
            margin: 10px 0 6px;
            position: relative;
            z-index: 3;
            display: flex;
            align-items: center;
        }
        .section-title::after {
            content: "";
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, #FFD700, transparent);
            margin-left: 10px;
        }
        .mode-selection, .grid-options {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            position: relative;
            z-index: 3;
            margin-bottom: 10px;
        }
        .grid-options {
            grid-template-columns: repeat(3, 1fr);
        }
        .mode-btn, .option-item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 8px;
            background: rgba(51, 65, 85, 0.4);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            transition: 0.3s;
            color: #cbd5e1;
        }
        .mode-btn.active {
            border-color: #FF6B6B;
            background: rgba(255, 107, 107, 0.2);
            color: #FF6B6B;
        }
        .mode-btn.super {
            border-color: #f59e0b;
            background: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
        }
        .option-item.active {
            border-color: #4ECDC4;
            color: #4ECDC4;
            background: rgba(78, 205, 196, 0.15);
        }
        .amount-input-section {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 12px;
            padding: 10px 12px;
            margin-bottom: 10px;
            position: relative;
            z-index: 3;
        }
        .streak-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        .streak-current {
            font-size: 10px;
            color: #94a3b8;
        }
        .streak-target {
            font-size: 10px;
            color: #FFD700;
            font-weight: bold;
        }
        .amount-label {
            font-size: 9px;
            font-weight: 700;
            color: #FF6B6B;
            text-transform: uppercase;
            margin-bottom: 4px;
            display: block;
        }
        .amount-input {
            width: 100%;
            padding: 8px;
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 8px;
            color: #f1f5f9;
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            outline: none;
            transition: 0.2s;
        }
        .amount-input:focus {
            border-color: #FFD700;
            box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }
        .log-container {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 10px;
            padding: 8px;
            margin: 8px 0;
            position: relative;
            z-index: 3;
        }
        .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }
        .log-title {
            font-size: 9px;
            font-weight: 700;
            color: #FF6B6B;
            text-transform: uppercase;
        }
        .log-status {
            font-size: 9px;
            color: #94a3b8;
        }
        .log-box {
            max-height: 80px;
            overflow-y: auto;
            font-size: 9px;
            font-family: monospace;
            color: #94a3b8;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 6px;
            padding: 6px;
        }
        .log-entry {
            margin: 2px 0;
            padding: 3px 5px;
            border-radius: 4px;
            font-size: 9px;
            line-height: 1.2;
        }
        .log-success {
            background: rgba(34, 197, 94, 0.15);
            color: #86efac;
            border-left: 3px solid #4ade80;
        }
        .log-error {
            background: rgba(239, 68, 68, 0.15);
            color: #fca5a5;
            border-left: 3px solid #f87171;
        }
        .log-info {
            background: rgba(59, 130, 246, 0.15);
            color: #93c5fd;
            border-left: 3px solid #3b82f6;
        }
        .log-warning {
            background: rgba(245, 158, 11, 0.15);
            color: #fcd34d;
            border-left: 3px solid #f59e0b;
        }
        .btn-test {
            margin-top: 8px;
            padding: 7px;
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid #FF6B6B;
            border-radius: 7px;
            color: #FF6B6B;
            cursor: pointer;
            font-size: 10px;
            width: 100%;
            font-weight: 600;
        }
        .btn-test:hover {
            background: rgba(255, 107, 107, 0.3);
            transform: translateY(-1px);
        }
        .farm-mode-indicator {
            background: rgba(78, 205, 196, 0.1);
            border: 1px solid #4ECDC4;
            border-radius: 7px;
            padding: 5px 8px;
            margin: 6px 0;
            font-size: 9px;
            color: #4ECDC4;
            text-align: center;
            font-weight: bold;
        }
        .super-farm-indicator {
            background: rgba(245, 158, 11, 0.2);
            border: 1px solid #f59e0b;
            border-radius: 7px;
            padding: 5px 8px;
            margin: 6px 0;
            font-size: 9px;
            color: #fbbf24;
            text-align: center;
            font-weight: bold;
            animation: superPulse 2s infinite;
        }
        @keyframes superPulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        .data-panel {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 12px;
            padding: 8px 10px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            position: relative;
            z-index: 3;
        }
        .data-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
        }
        .data-item span {
            font-size: 7px;
            color: #64748b;
            margin-bottom: 2px;
        }
        .data-item b {
            font-size: 12px;
        }
        .progress-bar-container {
            height: 4px;
            background: rgba(30, 41, 59, 0.6);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 6px;
            position: relative;
            z-index: 3;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #FF6B6B, #FFD700, #4ECDC4);
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-bar.super {
            background: linear-gradient(90deg, #f59e0b, #ef4444);
        }
        .progress-text {
            font-size: 10px;
            color: #94a3b8;
            margin-top: 2px;
            text-align: center;
            position: relative;
            z-index: 3;
        }
        .btn-main-farm {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #FF6B6B, #FF8E53);
            border: none;
            border-radius: 14px;
            color: white;
            font-weight: 800;
            font-size: 14px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            z-index: 3;
            transition: 0.3s;
            margin-top: 8px;
        }
        .btn-main-farm:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }
        .btn-main-farm.farming {
            background: linear-gradient(135deg, #ef4444, #b91c1c);
            animation: pulse 1.5s infinite;
        }
        .btn-main-farm.super-farming {
            background: linear-gradient(135deg, #f59e0b, #dc2626);
            animation: superPulse 0.8s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
        }
        .external-buttons {
            position: fixed;
            bottom: 12px;
            right: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            z-index: 99998;
        }
        .external-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,.3);
            transition: 0.3s;
            border: none;
        }
        .external-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0,0,0,.4);
        }
        .discord-btn {
            background: #5865F2;
            color: white;
        }
        .notify-btn {
            background: #ffb703;
            color: #000;
        }
        .toggle-btn {
            background: linear-gradient(135deg, #58cc02, #1cb0f6);
            color: white;
            font-size: 20px;
        }
        .daily-btn {
            background: linear-gradient(135deg, #FF6B00, #FFB703);
            color: white;
            font-size: 20px;
        }
        .language-btn {
            background: linear-gradient(135deg, #4ECDC4, #2dd4bf);
            color: white;
            font-size: 20px;
        }
        .version-tag {
            position: fixed;
            bottom: 60px;
            right: 20px;
            background: rgba(0,0,0,.5);
            color: #fff;
            font-size: 8px;
            padding: 1px 4px;
            border-radius: 4px;
            z-index: 10000;
            font-family: monospace;
        }
        .api-test-container {
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            padding: 15px;
            width: 300px;
            z-index: 99996;
            box-shadow: 0 8px 25px rgba(0,0,0,0.5);
            display: none;
        }
        .api-test-container.visible {
            display: block;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .api-test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }
        .api-test-title {
            font-size: 12px;
            font-weight: 700;
            color: #3b82f6;
            text-transform: uppercase;
        }
        .api-test-close {
            color: #94a3b8;
            cursor: pointer;
            font-size: 14px;
        }
        .api-test-result {
            background: rgba(30, 41, 59, 0.6);
            border-radius: 8px;
            padding: 10px;
            margin-top: 10px;
            max-height: 150px;
            overflow-y: auto;
            font-size: 9px;
            font-family: monospace;
        }
        .hidden-message {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FF6B6B, #FFD700);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 100000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: slideDown 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
            display: none;
        }
        @keyframes slideDown {
            from { top: -50px; opacity: 0; }
            to { top: 20px; opacity: 1; }
        }
        @keyframes fadeOut {
            to { opacity: 0; display: none; }
        }

        /* Tết Decorations */
        .tet-decoration {
            position: absolute;
            z-index: 1;
            pointer-events: none;
        }
        .lantern {
            position: absolute;
            width: 20px;
            height: 30px;
            background: linear-gradient(to bottom, #FF6B6B, #FF3333);
            border-radius: 10px 10px 5px 5px;
            animation: swing 3s infinite ease-in-out;
        }
        .lantern::before {
            content: '';
            position: absolute;
            top: -5px;
            left: 5px;
            width: 10px;
            height: 5px;
            background: #FFD700;
            border-radius: 5px 5px 0 0;
        }
        .lantern::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 8px;
            width: 4px;
            height: 10px;
            background: #FFD700;
        }
        @keyframes swing {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
        }
        .firecracker {
            position: absolute;
            width: 4px;
            height: 10px;
            background: #FFD700;
            border-radius: 2px;
        }
        .firecracker::after {
            content: '';
            position: absolute;
            top: -5px;
            left: -1px;
            width: 6px;
            height: 6px;
            background: #FF6B6B;
            border-radius: 50%;
        }

        /* Neon Effects */
        .neon-border {
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg,
                #ff00ff, #00ffff, #ffff00, #ff00ff);
            border-radius: 24px;
            z-index: -1;
            opacity: 0.5;
            animation: neonGlow 3s linear infinite;
            filter: blur(5px);
        }

        .neon-text {
            text-shadow: 0 0 5px #fff,
                         0 0 10px #fff,
                         0 0 15px #fff,
                         0 0 20px #ff00ff,
                         0 0 35px #ff00ff,
                         0 0 40px #ff00ff,
                         0 0 50px #ff00ff,
                         0 0 75px #ff00ff;
            animation: textPulse 2s infinite alternate;
        }

        .neon-button {
            box-shadow: 0 0 5px #FF6B6B,
                        0 0 10px #FF6B6B,
                        0 0 15px #FF6B6B,
                        inset 0 0 10px rgba(255, 107, 107, 0.5);
            animation: buttonGlow 2s infinite alternate;
        }

        @keyframes neonGlow {
            0%, 100% {
                opacity: 0.5;
                filter: blur(5px) brightness(1);
            }
            50% {
                opacity: 0.8;
                filter: blur(8px) brightness(1.2);
            }
        }

        @keyframes textPulse {
            0% {
                text-shadow: 0 0 5px #fff,
                             0 0 10px #fff,
                             0 0 15px #fff,
                             0 0 20px #FF6B6B,
                             0 0 35px #FF6B6B,
                             0 0 40px #FF6B6B;
            }
            100% {
                text-shadow: 0 0 10px #fff,
                             0 0 20px #fff,
                             0 0 30px #fff,
                             0 0 40px #FF6B6B,
                             0 0 70px #FF6B6B,
                             0 0 80px #FF6B6B;
            }
        }

        @keyframes buttonGlow {
            0% {
                box-shadow: 0 0 5px #FF6B6B,
                            0 0 10px #FF6B6B,
                            0 0 15px #FF6B6B,
                            inset 0 0 10px rgba(255, 107, 107, 0.5);
            }
            100% {
                box-shadow: 0 0 10px #FF6B6B,
                            0 0 20px #FF6B6B,
                            0 0 30px #FF6B6B,
                            inset 0 0 20px rgba(255, 107, 107, 0.7);
            }
        }

        /* Collapsed Panel Styles */
        #duomaxpro-collapsed {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: rgba(10, 15, 28, 0.95);
            border-radius: 50%;
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 215, 0, 0.5);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        #duomaxpro-collapsed:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        }

        #duomaxpro-collapsed .collapsed-icon {
            font-size: 24px;
            color: #FFD700;
            text-shadow: 0 0 10px #FFD700;
        }

        .collapsed-stats {
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 15, 28, 0.95);
            padding: 5px 10px;
            border-radius: 10px;
            font-size: 10px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            border: 1px solid rgba(255, 215, 0, 0.3);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            pointer-events: none;
        }

        #duomaxpro-collapsed:hover .collapsed-stats {
            opacity: 1;
        }

        .collapsed-stats div {
            display: flex;
            align-items: center;
            gap: 5px;
            margin: 2px 0;
        }

        .collapsed-stats img {
            width: 12px;
            height: 12px;
        }

        /* Mode button neon effects */
        .mode-btn:hover {
            box-shadow: 0 0 10px currentColor, inset 0 0 5px rgba(255,255,255,0.3);
        }

        .option-item:hover {
            box-shadow: 0 0 10px currentColor, inset 0 0 5px rgba(255,255,255,0.2);
        }

        /* Tết Theme Colors */
        .tet-red { color: #FF6B6B; }
        .tet-gold { color: #FFD700; }
        .tet-green { color: #4ECDC4; }
        .tet-bg { background: rgba(255, 107, 107, 0.1); }
        .tet-border { border-color: #FFD700; }
    `;
    document.head.appendChild(style);

    // === HIDDEN MESSAGE ===
    const hiddenMessage = document.createElement('div');
    hiddenMessage.className = 'hidden-message';
    hiddenMessage.id = 'hidden-message';
    hiddenMessage.textContent = lang === 'en'
        ? `🎉 DuoMax Pro ${VERSION} - Happy New Year! 🎉`
        : `🎉 DuoMax Pro ${VERSION} - Happy New Year! 🎉`;
    document.body.appendChild(hiddenMessage);

    // === API TEST CONTAINER ===
    const apiTestContainer = document.createElement('div');
    apiTestContainer.className = 'api-test-container';
    apiTestContainer.id = 'api-test-container';
    apiTestContainer.innerHTML = `
        <div class="api-test-header">
            <div class="api-test-title">🔧 ${lang === 'en' ? 'API TEST RESULTS' : 'KẾT QUẢ KIỂM TRA API'}</div>
            <div class="api-test-close" id="api-test-close">✕</div>
        </div>
        <div class="api-test-result" id="api-test-result">
            ${lang === 'en' ? 'No tests run yet. Click "Test API Connection" to start.' : 'Chưa chạy kiểm tra. Nhấp "Kiểm tra kết nối API" để bắt đầu.'}
        </div>
    `;
    document.body.appendChild(apiTestContainer);

    // === COLLAPSED PANEL ===
    const collapsedPanel = document.createElement('div');
    collapsedPanel.id = 'duomaxpro-collapsed';
    collapsedPanel.innerHTML = `
        <div class="collapsed-icon">🎉</div>
        <div class="collapsed-stats">
            <div><img src="${ICONS.xp}" style="width:12px;height:12px"> <span id="collapsed-xp">0</span></div>
            <div><img src="${ICONS.gem}" style="width:12px;height:12px"> <span id="collapsed-gems">0</span></div>
            <div><img src="${ICONS.streak}" style="width:12px;height:12px"> <span id="collapsed-streak">0</span></div>
        </div>
    `;
    document.body.appendChild(collapsedPanel);

    // === MAIN UI CONTAINER ===
    const borderBox = document.createElement('div');
    borderBox.id = 'duomaxpro-border-box';

    const borderCanvas = document.createElement('canvas');
    borderCanvas.id = 'border-canvas-engine';

    const container = document.createElement('div');
    container.id = 'duomaxpro-container';
    container.innerHTML = `
        <canvas id="motion-canvas-bg"></canvas>
        <canvas id="fireworks-canvas"></canvas>
        <div class="neon-border"></div>
        <div class="header-top">
            <div class="logo-text neon-text" id="logo-main">🎉 ${lang === 'en' ? 'DuoMax Tet Edition' : 'DuoMax Phiên bản Tết'} <span style="font-size:10px; color:#FFD700" class="hide-on-min">${VERSION}</span></div>
            <div class="nav-controls">
                <div class="language-toggle ${lang === 'en' ? 'active' : ''}" id="language-toggle">
                    <span class="flag">${lang === 'en' ? '🇬🇧' : '🇻🇳'}</span>
                    <span class="lang-text">${lang === 'en' ? 'EN' : 'VI'}</span>
                </div>
                <img src="${ICONS.collapse}" class="nav-icon" id="btn-collapse-toggle" title="${t('collapse')}">
                <img src="${ICONS.minimize}" class="nav-icon" id="btn-minimize-toggle" title="${t('minimize')}">
                <img src="${ICONS.close}" class="nav-icon" id="btn-close-ui" title="${t('close')}">
            </div>
        </div>
        <div class="hide-on-min">
            <div id="user-display" class="user-profile">
                <div class="user-avatar"></div>
                <div class="user-info">
                    <b>${lang === 'en' ? 'Loading User...' : 'Đang tải người dùng...'}</b>
                    <span id="user-status">${t('newYear')}</span>
                </div>
            </div>
            <div class="stats-wrapper">
                <div class="stat-card-new">
                    <img src="${ICONS.xp}" class="icon-small">
                    <span class="stat-val tet-red" id="st-xp">0</span>
                    <span class="stat-lbl">⚡XP</span>
                </div>
                <div class="stat-card-new">
                    <img src="${ICONS.gem}" class="icon-small">
                    <span class="stat-val tet-gold" id="st-gems">0</span>
                    <span class="stat-lbl">GEMS</span>
                </div>
                <div class="stat-card-new">
                    <img src="${ICONS.streak}" class="icon-small">
                    <span class="stat-val tet-green" id="st-streak">0</span>
                    <span class="stat-lbl">🔥STREAK</span>
                </div>
            </div>

            <div class="section-title">${t('farmLabel')}</div>
            <div class="mode-selection">
                <div class="mode-btn active" id="sp-safe">${t('switchSafe')}</div>
                <div class="mode-btn" id="sp-fast">${t('switchFast')}</div>
                <div class="mode-btn" id="sp-super">${t('switchSuper')}</div>
            </div>

            <div class="section-title">${t('targetModules')}</div>
            <div class="grid-options">
                <div class="option-item active" id="opt-xp">
                    <img src="${ICONS.xp}" style="width:12px; height:12px"> XP
                </div>
                <div class="option-item" id="opt-gems">
                    <img src="${ICONS.gem}" style="width:12px; height:12px"> ${lang === 'en' ? 'Gems' : 'Ngọc'}
                </div>
                <div class="option-item" id="opt-streak">
                    <img src="${ICONS.streak}" style="width:12px; height:12px"> ${lang === 'en' ? 'Streak' : 'Chuỗi'}
                </div>
                <div class="option-item" id="opt-league">
                    <img src="${ICONS.league}" style="width:12px; height:12px"> ${lang === 'en' ? 'League' : 'Hạng'}
                </div>
                <div class="option-item" id="opt-quest">
                    <img src="${ICONS.quest}" style="width:12px; height:12px"> ${lang === 'en' ? 'Quests' : 'Nhiệm vụ'}
                </div>
                <div class="option-item" id="opt-all">${t('allIn')}</div>
            </div>

            <div class="amount-input-section">
                <div class="streak-info">
                    <span class="streak-current" id="current-streak-display">${t('current')}: 0 ${t('days')}</span>
                    <span class="streak-target tet-gold" id="target-streak-display">${t('target')}: 0 ${t('days')}</span>
                </div>
                <span class="amount-label">${t('amountLabel')}</span>
                <input type="number" id="targetValue" class="amount-input" placeholder="${lang === 'en' ? 'e.g., 1000 XP' : 'vd: 1000 XP'}" value="1000" min="1" max="999999">
            </div>

            <button class="btn-test" id="btn-test-api">${t('testAPI')}</button>

            <div class="log-container">
                <div class="log-header">
                    <div class="log-title">${t('activityLog')}</div>
                    <div class="log-status" id="log-status">${t('last')}: ${lang === 'en' ? 'System started' : 'Hệ thống khởi động'}</div>
                </div>
                <div class="log-box" id="log-box">
                    <div class="log-entry log-info">🎉 DuoMax Pro ${VERSION} ${t('tetEdition')} ${lang === 'en' ? 'initialized' : 'đã khởi động'}</div>
                    <div class="log-entry log-info">${t('newYear')}! ${lang === 'en' ? 'Ready to start farming' : 'Sẵn sàng bắt đầu farm'}</div>
                </div>
            </div>

            <div class="farm-mode-indicator" id="farm-mode-indicator">
                ${t('safeMode')}
            </div>

            <div class="section-title">${t('farmingStatus')}</div>
            <div class="data-panel">
                <div class="data-item">
                    <span>${t('runtime')}</span>
                    <b id="data-time">00:00:00</b>
                </div>
                <div class="data-item">
                    <span>${t('streakDays')}</span>
                    <b id="data-streak-days">0</b>
                </div>
                <div class="data-item">
                    <span>${t('status')}</span>
                    <b id="data-status" style="color:#FF6B6B">${t('idle')}</b>
                </div>
            </div>
            <div class="progress-bar-container">
                <div id="progressBar" class="progress-bar"></div>
            </div>
            <div class="progress-text" id="progressText">❌ ${t('notStarted')}</div>
            <button class="btn-main-farm neon-button" id="btn-master-farm">${t('start')}</button>
        </div>
    `;

    borderBox.appendChild(borderCanvas);
    borderBox.appendChild(container);
    document.body.appendChild(borderBox);

    // === TẾT DECORATIONS ===
    function createTetDecorations() {
        const container = document.getElementById('duomaxpro-container');

        // Create lanterns
        for (let i = 0; i < 4; i++) {
            const lantern = document.createElement('div');
            lantern.className = 'lantern tet-decoration';
            lantern.style.top = `${20 + i * 80}px`;
            lantern.style.left = i % 2 === 0 ? '10px' : 'auto';
            lantern.style.right = i % 2 === 1 ? '10px' : 'auto';
            lantern.style.animationDelay = `${i * 0.5}s`;
            container.appendChild(lantern);
        }

        // Create firecrackers
        for (let i = 0; i < 8; i++) {
            const firecracker = document.createElement('div');
            firecracker.className = 'firecracker tet-decoration';
            firecracker.style.top = `${40 + i * 40}px`;
            firecracker.style.left = `${30 + (i % 3) * 200}px`;
            container.appendChild(firecracker);
        }
    }

    // === FIREWORKS ANIMATION ===
    class Fireworks {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.fireworks = [];
            this.running = true;

            this.resize();
            window.addEventListener('resize', () => this.resize());

            this.launchFirework();
            setInterval(() => this.launchFirework(), 2000);
            this.animate();
        }

        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        }

        launchFirework() {
            if (!this.running) return;

            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height;
            const targetY = Math.random() * this.canvas.height * 0.3;

            this.fireworks.push({
                x,
                y,
                targetY,
                speed: 2 + Math.random() * 2,
                size: 2 + Math.random() * 2,
                color: `hsl(${Math.random() * 60 + 300}, 100%, 50%)`,
                sparks: []
            });
        }

        createParticles(x, y, color) {
            for (let i = 0; i < 100; i++) {
                this.particles.push({
                    x,
                    y,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 10,
                    speedY: (Math.random() - 0.5) * 10,
                    color,
                    life: 100
                });
            }
        }

        animate() {
            if (!this.running) return;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Update and draw fireworks
            for (let i = this.fireworks.length - 1; i >= 0; i--) {
                const fw = this.fireworks[i];

                // Move firework up
                fw.y -= fw.speed;

                // Draw firework trail
                this.ctx.beginPath();
                this.ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
                this.ctx.fillStyle = fw.color;
                this.ctx.fill();

                // Check if firework reached target
                if (fw.y <= fw.targetY) {
                    this.createParticles(fw.x, fw.y, fw.color);
                    this.fireworks.splice(i, 1);
                }
            }

            // Update and draw particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];

                p.x += p.speedX;
                p.y += p.speedY;
                p.speedY += 0.05; // Gravity
                p.life--;

                // Draw particle
                this.ctx.globalAlpha = p.life / 100;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.fill();

                // Remove dead particles
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            this.ctx.globalAlpha = 1;
            requestAnimationFrame(() => this.animate());
        }

        stop() {
            this.running = false;
        }
    }

    let fireworks;

    // === EXTERNAL BUTTONS (UPDATED WITH DAILY BUTTON) ===
    const externalButtons = document.createElement('div');
    externalButtons.className = 'external-buttons';
    externalButtons.innerHTML = `
        <button class="external-btn daily-btn" id="external-daily" title="${t('dailyQuests')}">📅</button>
        <button class="external-btn discord-btn" id="external-discord" title="Discord">💬</button>
        <button class="external-btn language-btn" id="external-language" title="${lang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}">${lang === 'en' ? '🇻🇳' : '🇬🇧'}</button>
        <button class="external-btn notify-btn" id="external-notify" title="${lang === 'en' ? 'Show Hidden Message' : 'Hiện thông báo ẩn'}">🔔</button>
        <button class="external-btn toggle-btn" id="external-toggle" title="${lang === 'en' ? 'Toggle Panel' : 'Bật/tắt Panel'}">⚙️</button>
    `;
    document.body.appendChild(externalButtons);

    const versionTag = Object.assign(document.createElement('div'), {
        className: 'version-tag',
        textContent: VERSION + ' 🎉'
    });
    document.body.appendChild(versionTag);

    // === DISCORD CHAT IFRAME ===
    const discordChat = document.createElement('div');
    discordChat.className = 'duo-discord-chat';
    discordChat.style.cssText = 'position:fixed;bottom:80px;right:15px;width:300px;height:400px;background:#fff;border:2px solid #5865F2;border-radius:8px;overflow:hidden;z-index:99997;display:none;box-shadow:0 5px 12px rgba(0,0,0,.3);';

    const iframe = document.createElement('iframe');
    iframe.src = WIDGET_URL;
    iframe.style.cssText = 'border:none;width:100%;height:100%;';
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('sandbox', 'allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts');
    discordChat.appendChild(iframe);
    document.body.appendChild(discordChat);

    // === ANIMATION ===
    const ctxB = borderCanvas.getContext('2d');
    const canvasM = document.getElementById('motion-canvas-bg');
    const ctxM = canvasM.getContext('2d');
    let angle = 0;

    function animate() {
        if (!document.getElementById('duomaxpro-border-box')) return;
        borderCanvas.width = borderBox.offsetWidth;
        borderCanvas.height = borderBox.offsetHeight;
        ctxB.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
        ctxB.translate(borderCanvas.width/2, borderCanvas.height/2);
        ctxB.rotate(angle);
        const grad = ctxB.createConicGradient(0, 0, 0);
        grad.addColorStop(0, '#FF6B6B');
        grad.addColorStop(0.2, '#FFD700');
        grad.addColorStop(0.5, '#4ECDC4');
        grad.addColorStop(1, '#FF6B6B');
        ctxB.fillStyle = grad;
        ctxB.fillRect(-borderCanvas.width, -borderCanvas.height, borderCanvas.width*2, borderCanvas.height*2);
        ctxB.resetTransform();

        canvasM.width = container.offsetWidth;
        canvasM.height = container.offsetHeight;
        ctxM.fillStyle = '#0a0f1c';
        ctxM.fillRect(0, 0, canvasM.width, canvasM.height);
        const radial = ctxM.createRadialGradient(canvasM.width/2, canvasM.height/2, 0, canvasM.width/2, canvasM.height/2, 280);
        radial.addColorStop(0, 'rgba(255, 107, 107, 0.1)');
        radial.addColorStop(1, 'transparent');
        ctxM.fillStyle = radial;
        ctxM.fillRect(0, 0, canvasM.width, canvasM.height);
        angle += 0.015;
        requestAnimationFrame(animate);
    }
    animate();

    // === LOG MANAGEMENT ===
    let logCount = 0;
    const MAX_LOGS = 20;

    function addLog(message, type = 'info') {
        const logBox = document.getElementById('log-box');
        const logStatus = document.getElementById('log-status');

        const maxLength = 80;
        const displayMsg = message.length > maxLength ?
            message.substring(0, maxLength) + '...' : message;

        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ${displayMsg}`;

        logEntry.title = message;

        logBox.appendChild(logEntry);
        logCount++;

        if (logCount > MAX_LOGS) {
            logBox.removeChild(logBox.firstChild);
            logCount--;
        }

        logBox.scrollTop = logBox.scrollHeight;

        logStatus.textContent = `${t('last')}: ${type.toUpperCase()}`;
        logStatus.style.color = {
            'success': '#4ade80',
            'error': '#f87171',
            'info': '#60a5fa',
            'warning': '#fbbf24'
        }[type] || '#94a3b8';

        console.log(`[DuoMax Pro ${type.toUpperCase()}] ${message}`);
    }

    // === LANGUAGE SWITCHING FUNCTION ===
    function switchLanguage(newLang) {
        lang = newLang;

        // Update all text elements
        document.getElementById('hidden-message').textContent = lang === 'en'
            ? `🎉 DuoMax Pro ${VERSION} - Happy New Year! 🎉`
            : `🎉 DuoMax Pro ${VERSION} - Chúc Mừng Năm Mới! 🎉`;

        document.getElementById('logo-main').innerHTML = `🎉 ${lang === 'en' ? 'DuoMax Tết Edition' : 'DuoMax Phiên bản Tết'} <span style="font-size:10px; color:#FFD700" class="hide-on-min">${VERSION}</span>`;

        // Update language toggle button
        const langToggle = document.getElementById('language-toggle');
        const extLangBtn = document.getElementById('external-language');

        langToggle.innerHTML = `
            <span class="flag">${lang === 'en' ? '🇬🇧' : '🇻🇳'}</span>
            <span class="lang-text">${lang === 'en' ? 'EN' : 'VI'}</span>
        `;
        langToggle.title = lang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh';

        extLangBtn.innerHTML = lang === 'en' ? '🇻🇳' : '🇬🇧';
        extLangBtn.title = lang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh';

        // Update API test container
        document.querySelector('.api-test-title').textContent = `🔧 ${lang === 'en' ? 'API TEST RESULTS' : 'KẾT QUẢ KIỂM TRA API'}`;
        document.getElementById('api-test-result').innerHTML = lang === 'en'
            ? 'No tests run yet. Click "Test API Connection" to start.'
            : 'Chưa chạy kiểm tra. Nhấp "Kiểm tra kết nối API" để bắt đầu.';

        // Update navigation controls tooltips
        document.getElementById('btn-collapse-toggle').title = t('collapse');
        document.getElementById('btn-minimize-toggle').title = t('minimize');
        document.getElementById('btn-close-ui').title = t('close');

        // Update user display
        const userDisplay = document.getElementById('user-display');
        if (userDisplay.querySelector('.user-info b').textContent === 'Loading User...' ||
            userDisplay.querySelector('.user-info b').textContent === 'Đang tải người dùng...') {
            userDisplay.querySelector('.user-info b').textContent = lang === 'en' ? 'Loading User...' : 'Đang tải người dùng...';
        }

        // Update external buttons tooltips
        document.getElementById('external-daily').title = t('dailyQuests');
        document.getElementById('external-notify').title = lang === 'en' ? 'Show Hidden Message' : 'Hiện thông báo ẩn';
        document.getElementById('external-toggle').title = lang === 'en' ? 'Toggle Panel' : 'Bật/tắt Panel';

        // Update main UI elements
        document.querySelector('.section-title:nth-of-type(1)').textContent = t('farmLabel');
        document.querySelector('.section-title:nth-of-type(2)').textContent = t('targetModules');
        document.querySelector('.section-title:nth-of-type(3)').textContent = t('farmingStatus');

        document.getElementById('sp-safe').textContent = t('switchSafe');
        document.getElementById('sp-fast').textContent = t('switchFast');
        document.getElementById('sp-super').textContent = t('switchSuper');

        // Update option items
        document.getElementById('opt-gems').innerHTML = `<img src="${ICONS.gem}" style="width:12px; height:12px"> ${lang === 'en' ? 'Gems' : 'Ngọc'}`;
        document.getElementById('opt-streak').innerHTML = `<img src="${ICONS.streak}" style="width:12px; height:12px"> ${lang === 'en' ? 'Streak' : 'Chuỗi'}`;
        document.getElementById('opt-league').innerHTML = `<img src="${ICONS.league}" style="width:12px; height:12px"> ${lang === 'en' ? 'League' : 'Hạng'}`;
        document.getElementById('opt-quest').innerHTML = `<img src="${ICONS.quest}" style="width:12px; height:12px"> ${lang === 'en' ? 'Quests' : 'Nhiệm vụ'}`;
        document.getElementById('opt-all').textContent = t('allIn');

        // Update amount input section
        document.querySelector('.amount-label').textContent = t('amountLabel');
        document.getElementById('targetValue').placeholder = lang === 'en' ? 'e.g., 1000 XP' : 'vd: 1000 XP';

        // Update streak info
        const currentStreak = parseInt(document.getElementById('st-streak').innerText) || 0;
        const targetValue = parseInt(document.getElementById('targetValue').value) || 0;
        document.getElementById('current-streak-display').textContent = `${t('current')}: ${currentStreak} ${t('days')}`;
        document.getElementById('target-streak-display').textContent = `${t('target')}: ${currentStreak + targetValue} ${t('days')}`;

        // Update test button
        document.getElementById('btn-test-api').textContent = t('testAPI');

        // Update log container
        document.querySelector('.log-title').textContent = t('activityLog');

        // Update farm mode indicator
        const currentMode = document.querySelector('.mode-btn.active').id;
        if (currentMode === 'sp-safe') {
            document.getElementById('farm-mode-indicator').innerHTML = t('safeMode');
        } else if (currentMode === 'sp-fast') {
            document.getElementById('farm-mode-indicator').innerHTML = t('fastMode');
        } else {
            document.getElementById('farm-mode-indicator').innerHTML = t('superMode');
        }

        // Update data panel
        document.querySelectorAll('.data-item span')[0].textContent = t('runtime');
        document.querySelectorAll('.data-item span')[1].textContent = t('streakDays');
        document.querySelectorAll('.data-item span')[2].textContent = t('status');

        document.getElementById('data-status').textContent = t('idle');

        // Update progress text
        document.getElementById('progressText').textContent = `❌ ${t('notStarted')}`;

        // Update main button
        document.getElementById('btn-master-farm').textContent = t('start');

        // Update log entries
        const logEntries = document.querySelectorAll('.log-box .log-entry');
        if (logEntries.length >= 2) {
            logEntries[0].textContent = `[${new Date().toLocaleTimeString()}] 🎉 DuoMax Pro ${VERSION} ${t('tetEdition')} ${lang === 'en' ? 'initialized' : 'đã khởi động'}`;
            logEntries[1].textContent = `[${new Date().toLocaleTimeString()}] ${t('newYear')}! ${lang === 'en' ? 'Ready to start farming' : 'Sẵn sàng bắt đầu farm'}`;
        }

        addLog(lang === 'en' ? 'Switched to English language' : 'Đã chuyển sang ngôn ngữ Tiếng Việt', 'info');

        // Save language preference to localStorage
        localStorage.setItem('duomax_lang', lang);
    }

    // === PANEL COLLAPSE FUNCTION ===
    let isCollapsed = false;

    function toggleCollapsePanel() {
        isCollapsed = !isCollapsed;

        if (isCollapsed) {
            // Switch to collapsed mode
            borderBox.style.display = 'none';
            collapsedPanel.style.display = 'flex';
            updateCollapsedStats();
            addLog(lang === 'en' ? 'Panel collapsed to mini mode' : 'Panel đã thu gọn', 'info');
        } else {
            // Switch to full mode
            collapsedPanel.style.display = 'none';
            borderBox.style.display = 'flex';
            addLog(lang === 'en' ? 'Panel expanded to full mode' : 'Panel đã mở rộng', 'info');
        }

        navigator.vibrate?.(30);
    }

    function updateCollapsedStats() {
        const xp = document.getElementById('st-xp').innerText;
        const gems = document.getElementById('st-gems').innerText;
        const streak = document.getElementById('st-streak').innerText;

        document.getElementById('collapsed-xp').textContent = xp;
        document.getElementById('collapsed-gems').textContent = gems;
        document.getElementById('collapsed-streak').textContent = streak;
    }

    function updateCollapsedFarmStatus() {
        if (isFarming) {
            collapsedPanel.style.animation = 'superPulse 0.5s infinite';
            collapsedPanel.style.borderColor = '#ef4444';
            collapsedPanel.querySelector('.collapsed-icon').textContent = '🔥';
            collapsedPanel.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.5)';
        } else {
            collapsedPanel.style.animation = '';
            collapsedPanel.style.borderColor = 'rgba(255, 215, 0, 0.5)';
            collapsedPanel.querySelector('.collapsed-icon').textContent = '🎉';
            collapsedPanel.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
        }
    }

    // === UI CONTROLS ===
    document.getElementById('btn-close-ui').onclick = () => {
        if (fireworks) fireworks.stop();
        borderBox.remove();
        externalButtons.remove();
        versionTag.remove();
        discordChat.remove();
        apiTestContainer.remove();
        hiddenMessage.remove();
        collapsedPanel.remove();
    };

    document.getElementById('btn-minimize-toggle').onclick = () => {
        borderBox.classList.toggle('minimized');
        document.getElementById('logo-main').innerHTML = borderBox.classList.contains('minimized')
            ? "🎉 DuoMax Pro"
            : `🎉 ${lang === 'en' ? 'DuoMax Tết Edition' : 'DuoMax Phiên bản Tết'} <span style="font-size:10px; color:#FFD700" class="hide-on-min">${VERSION}</span>`;
        navigator.vibrate?.(30);
    };

    document.getElementById('btn-collapse-toggle').onclick = toggleCollapsePanel;
    collapsedPanel.onclick = toggleCollapsePanel;

    // Language toggle button
    document.getElementById('language-toggle').onclick = () => {
        const newLang = lang === 'en' ? 'vi' : 'en';
        switchLanguage(newLang);
        navigator.vibrate?.(30);
    };

    // External language button
    document.getElementById('external-language').onclick = () => {
        const newLang = lang === 'en' ? 'vi' : 'en';
        switchLanguage(newLang);
        navigator.vibrate?.(30);
    };

    // External buttons control
    let chatVisible = false;
    document.getElementById('external-discord').onclick = () => {
        chatVisible = !chatVisible;
        discordChat.style.display = chatVisible ? 'block' : 'none';
        navigator.vibrate?.(40);
    };

    // Show hidden message when bell icon is clicked
    document.getElementById('external-notify').onclick = () => {
        hiddenMessage.textContent = lang === 'en'
            ? `🎉 DuoMax Pro ${VERSION} - Happy New Year! 🎉`
            : `🎉 DuoMax Pro ${VERSION} - Chúc Mừng Năm Mới! 🎉`;
        hiddenMessage.style.display = 'block';
        setTimeout(() => {
            hiddenMessage.style.display = 'none';
        }, 3000);
        navigator.vibrate?.(40);
    };

    document.getElementById('external-toggle').onclick = () => {
        const isMinimized = borderBox.classList.contains('minimized');
        if (isMinimized) {
            borderBox.classList.remove('minimized');
            borderBox.style.top = '50%';
            borderBox.style.left = '50%';
            borderBox.style.transform = 'translate(-50%, -50%)';
        } else {
            borderBox.style.top = '16px';
            borderBox.style.left = '16px';
            borderBox.style.transform = 'translate(0, 0)';
        }
        navigator.vibrate?.(50);
    };

    // === IMPROVED DAILY QUEST COMPLETION FUNCTION ===
    document.getElementById('external-daily').onclick = async () => {
        addLog(lang === 'en' ? 'Starting daily quest completion...' : 'Đang bắt đầu hoàn thành nhiệm vụ hàng ngày...', 'info');

        const jwt = getJwtToken();
        if (!jwt) {
            alert(lang === 'en' ? '❌ Please log in to Duolingo first!' : '❌ Vui lòng đăng nhập vào Duolingo trước!');
            addLog(lang === 'en' ? 'ERROR: No authentication token' : 'LỖI: Không có token xác thực', 'error');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            addLog(lang === 'en' ? 'ERROR: No user ID' : 'LỖI: Không có ID người dùng', 'error');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };

        try {
            // Hiển thị thông báo đang xử lý
            const dailyBtn = document.getElementById('external-daily');
            const originalText = dailyBtn.innerHTML;
            dailyBtn.innerHTML = '⏳';
            dailyBtn.disabled = true;

            let totalRewards = {
                xp: 0,
                gems: 0
            };

            // Phương pháp 1: Claim daily quest rewards
            const questTypes = [
                { name: lang === 'en' ? 'Complete 3 Lessons' : 'Hoàn thành 3 bài học', xp: 30, gems: 5 },
                { name: lang === 'en' ? 'Perfect Lesson' : 'Bài học hoàn hảo', xp: 40, gems: 8 },
                { name: lang === 'en' ? 'Daily Goal' : 'Mục tiêu hàng ngày', xp: 50, gems: 10 },
                { name: lang === 'en' ? 'Friend Quest' : 'Nhiệm vụ bạn bè', xp: 60, gems: 15 },
                { name: lang === 'en' ? 'Streak Milestone' : 'Cột mốc chuỗi ngày', xp: 80, gems: 20 }
            ];

            for (const quest of questTypes) {
                try {
                    // Tạo reward ID duy nhất
                    const rewardId = `DAILY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                    const payload = {
                        rewardId: rewardId,
                        type: "QUEST_COMPLETION",
                        amount: quest.gems,
                        consumed: false,
                        xp: quest.xp,
                        questName: quest.name,
                        completedAt: new Date().toISOString()
                    };

                    const res = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/rewards`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(payload)
                    });

                    if (res.ok || res.status === 201) {
                        totalRewards.xp += quest.xp;
                        totalRewards.gems += quest.gems;

                        // Cập nhật UI ngay lập tức
                        const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                        const currentGems = parseInt(document.getElementById('st-gems').innerText) || 0;

                        document.getElementById('st-xp').innerText = currentXP + quest.xp;
                        document.getElementById('st-gems').innerText = currentGems + quest.gems;

                        addLog(`✅ ${lang === 'en' ? 'Completed:' : 'Đã hoàn thành:'} ${quest.name} (+${quest.xp} XP, +${quest.gems} ${lang === 'en' ? 'gems' : 'ngọc'})`, 'success');

                        // Hiệu ứng số tăng
                        animateValueIncrease('st-xp', currentXP, currentXP + quest.xp);
                        animateValueIncrease('st-gems', currentGems, currentGems + quest.gems);

                        await new Promise(r => setTimeout(r, 500));
                    }
                } catch (error) {
                    addLog(`⚠️ ${lang === 'en' ? 'Skipped:' : 'Đã bỏ qua:'} ${quest.name}`, 'info');
                }
            }

            // Phương pháp 2: Xp events cho daily activities
            try {
                const xpEvents = [
                    { type: "LESSON_COMPLETED", xp: 25 },
                    { type: "PRACTICE_SESSION", xp: 15 },
                    { type: "STORY_COMPLETED", xp: 20 },
                    { type: "CHALLENGE_COMPLETED", xp: 30 }
                ];

                for (const event of xpEvents) {
                    const eventPayload = {
                        eventType: event.type,
                        language: "en",
                        xp: event.xp,
                        timestamp: Math.floor(Date.now() / 1000)
                    };

                    const eventRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/xp_events`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(eventPayload)
                    });

                    if (eventRes.ok) {
                        totalRewards.xp += event.xp;
                        const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                        document.getElementById('st-xp').innerText = currentXP + event.xp;
                        await new Promise(r => setTimeout(r, 300));
                    }
                }
            } catch (error) {
                // Bỏ qua lỗi
            }

            // Phương pháp 3: Streak bonus
            try {
                const userRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=streak`, { headers });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    const streak = userData.streak || 0;

                    if (streak > 0) {
                        const streakBonus = Math.min(streak * 5, 100); // Tối đa 100 gems

                        const streakPayload = {
                            rewardId: `STREAK_BONUS_${Date.now()}`,
                            type: "STREAK_BONUS",
                            amount: streakBonus,
                            consumed: false,
                            streakDays: streak,
                            completedAt: new Date().toISOString()
                        };

                        const streakRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/rewards`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(streakPayload)
                        });

                        if (streakRes.ok) {
                            totalRewards.gems += streakBonus;
                            const currentGems = parseInt(document.getElementById('st-gems').innerText) || 0;
                            document.getElementById('st-gems').innerText = currentGems + streakBonus;
                            addLog(`🎯 ${lang === 'en' ? 'Streak Bonus:' : 'Thưởng chuỗi ngày:'} +${streakBonus} ${lang === 'en' ? 'gems' : 'ngọc'}`, 'success');
                        }
                    }
                }
            } catch (error) {
                // Bỏ qua lỗi
            }

            // Verify final results với server
            try {
                const verifyRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=totalXp,gems`, { headers });
                if (verifyRes.ok) {
                    const verifyData = await verifyRes.json();

                    // Đồng bộ với server
                    document.getElementById('st-xp').innerText = verifyData.totalXp || 0;
                    document.getElementById('st-gems').innerText = verifyData.gems || 0;
                    updateCollapsedStats();

                    totalRewards.xp = verifyData.totalXp - (parseInt(document.getElementById('st-xp').innerText) || 0) + totalRewards.xp;
                    totalRewards.gems = verifyData.gems - (parseInt(document.getElementById('st-gems').innerText) || 0) + totalRewards.gems;
                }
            } catch (verifyError) {
                // Bỏ qua lỗi verify
            }

            // Tổng kết
            if (totalRewards.xp > 0 || totalRewards.gems > 0) {
                const summary = lang === 'en'
                    ? `🎉 Daily Quests Completed!\n+${totalRewards.xp} XP\n+${totalRewards.gems} Gems`
                    : `🎉 Đã hoàn thành nhiệm vụ hàng ngày!\n+${totalRewards.xp} XP\n+${totalRewards.gems} Ngọc`;

                // Hiển thị thông báo thành công
                hiddenMessage.textContent = summary;
                hiddenMessage.style.display = 'block';
                hiddenMessage.style.background = 'linear-gradient(135deg, #FF6B6B, #FFD700)';

                setTimeout(() => {
                    hiddenMessage.style.display = 'none';
                }, 5000);

                addLog(lang === 'en'
                    ? `Total Rewards: +${totalRewards.xp} XP, +${totalRewards.gems} gems`
                    : `Tổng phần thưởng: +${totalRewards.xp} XP, +${totalRewards.gems} ngọc`, 'success');

                // Hiệu ứng nút thành công
                dailyBtn.innerHTML = '✅';
                dailyBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';

                setTimeout(() => {
                    dailyBtn.innerHTML = originalText;
                    dailyBtn.style.background = '';
                    dailyBtn.disabled = false;
                }, 2000);

                // Play success sound if available
                try {
                    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');
                    audio.volume = 0.3;
                    audio.play().catch(() => {});
                } catch (e) {}

            } else {
                addLog(lang === 'en' ? 'No daily quests completed' : 'Không hoàn thành nhiệm vụ hàng ngày nào', 'warning');
                dailyBtn.innerHTML = '❌';
                setTimeout(() => {
                    dailyBtn.innerHTML = originalText;
                    dailyBtn.disabled = false;
                }, 1000);
            }

        } catch (error) {
            console.error('Daily quest error:', error);
            addLog(lang === 'en'
                ? `❌ Failed to complete daily quests: ${error.message}`
                : `❌ Không thể hoàn thành nhiệm vụ hàng ngày: ${error.message}`, 'error');

            const dailyBtn = document.getElementById('external-daily');
            dailyBtn.innerHTML = '❌';
            setTimeout(() => {
                dailyBtn.innerHTML = '📅';
                dailyBtn.disabled = false;
            }, 1000);

            alert(lang === 'en'
                ? '❌ Failed to complete daily quests. Please try again.'
                : '❌ Không thể hoàn thành nhiệm vụ hàng ngày. Vui lòng thử lại.');
        }
    };

    // Helper function để tạo hiệu ứng số tăng dần
    function animateValueIncrease(elementId, start, end) {
        const element = document.getElementById(elementId);
        const duration = 500;
        const step = (end - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += step;
            if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    // API Test close button
    document.getElementById('api-test-close').onclick = () => {
        apiTestContainer.classList.remove('visible');
    };

    // === UTILITY FUNCTIONS ===
    function getJwtToken() {
        try {
            const state = localStorage.getItem('duo-state');
            if (state) {
                const parsed = JSON.parse(state);
                if (parsed?.user?.jwt) {
                    return parsed.user.jwt;
                }
            }

            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith('jwt_token=')) {
                    return cookie.substring(10);
                }
                if (cookie.startsWith('jwtToken=')) {
                    return cookie.substring(9);
                }
            }

            if (window.duo?.user?.jwt) {
                return window.duo.user.jwt;
            }

            const sessionJwt = sessionStorage.getItem('duolingo_jwt');
            if (sessionJwt) return sessionJwt;

            return null;
        } catch (e) {
            console.error('Error getting JWT:', e);
            return null;
        }
    }

    function getUserId() {
        try {
            const jwt = getJwtToken();
            if (!jwt) return null;

            const payload = jwt.split('.')[1];
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return decoded.sub || decoded.user_id || null;
        } catch (e) {
            return null;
        }
    }

    // === IMPROVED API TEST FUNCTION ===
    document.getElementById('btn-test-api').onclick = async () => {
        addLog(lang === 'en' ? 'Testing API connection...' : 'Đang kiểm tra kết nối API...', 'info');

        // Show API test container
        apiTestContainer.classList.add('visible');
        document.getElementById('api-test-result').innerHTML = `<div style="color:#94a3b8">${lang === 'en' ? 'Running API tests...' : 'Đang chạy kiểm tra API...'}</div>`;

        const jwt = getJwtToken();
        if (!jwt) {
            const errorMsg = lang === 'en' ? 'ERROR: No JWT token found. Please log in to Duolingo.' : 'LỖI: Không tìm thấy token JWT. Vui lòng đăng nhập vào Duolingo.';
            addLog(errorMsg, 'error');
            document.getElementById('api-test-result').innerHTML = `
                <div style="color:#f87171">❌ ${errorMsg}</div>
                <div style="color:#94a3b8; margin-top:8px">${lang === 'en' ? 'Steps to fix:' : 'Các bước khắc phục:'}</div>
                <div style="color:#94a3b8; margin-left:10px">1. ${lang === 'en' ? 'Make sure you are logged into Duolingo' : 'Đảm bảo bạn đã đăng nhập vào Duolingo'}</div>
                <div style="color:#94a3b8; margin-left:10px">2. ${lang === 'en' ? 'Refresh the page' : 'Làm mới trang'}</div>
                <div style="color:#94a3b8; margin-left:10px">3. ${lang === 'en' ? 'Try again' : 'Thử lại'}</div>
            `;
            return;
        }

        // Display token info (partial for security)
        const tokenPreview = jwt.substring(0, 20) + '...' + jwt.substring(jwt.length - 10);
        document.getElementById('api-test-result').innerHTML = `
            <div style="color:#60a5fa">✓ ${lang === 'en' ? 'JWT Token found' : 'Đã tìm thấy token JWT'}</div>
            <div style="color:#94a3b8; font-size:8px; word-break:break-all; margin-top:5px">${tokenPreview}</div>
            <div style="color:#94a3b8; margin-top:10px">${lang === 'en' ? 'Extracting user ID...' : 'Đang trích xuất ID người dùng...'}</div>
        `;

        const userId = getUserId();
        if (!userId) {
            const errorMsg = lang === 'en' ? 'ERROR: Cannot extract user ID from token' : 'LỖI: Không thể trích xuất ID người dùng từ token';
            addLog(errorMsg, 'error');
            document.getElementById('api-test-result').innerHTML += `<div style="color:#f87171">❌ ${errorMsg}</div>`;
            return;
        }

        document.getElementById('api-test-result').innerHTML += `
            <div style="color:#60a5fa">✓ ${lang === 'en' ? 'User ID extracted:' : 'Đã trích xuất ID người dùng:'} ${userId}</div>
            <div style="color:#94a3b8; margin-top:10px">${lang === 'en' ? 'Testing API endpoints...' : 'Đang kiểm tra các endpoint API...'}</div>
        `;

        let successCount = 0;
        let totalTests = 3;

        try {
            const headers = {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            };

            // Test 1: Basic user info
            document.getElementById('api-test-result').innerHTML += `<div style="color:#94a3b8">${lang === 'en' ? 'Test 1: Basic user API...' : 'Kiểm tra 1: API người dùng cơ bản...'}</div>`;
            const test1Res = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=username,streak,totalXp,gems`, { headers });

            if (test1Res.ok) {
                const data = await test1Res.json();
                successCount++;
                document.getElementById('api-test-result').innerHTML += `
                    <div style="color:#86efac">✓ ${lang === 'en' ? 'Basic API SUCCESS' : 'API CƠ BẢN THÀNH CÔNG'}</div>
                    <div style="color:#94a3b8; margin-left:10px">${lang === 'en' ? 'Username:' : 'Tên người dùng:'} ${data.username}</div>
                    <div style="color:#94a3b8; margin-left:10px">${lang === 'en' ? 'Streak:' : 'Chuỗi ngày:'} ${data.streak || 0} ${lang === 'en' ? 'days' : 'ngày'}</div>
                    <div style="color:#94a3b8; margin-left:10px">XP: ${data.totalXp || 0}</div>
                    <div style="color:#94a3b8; margin-left:10px">${lang === 'en' ? 'Gems:' : 'Ngọc:'} ${data.gems || 0}</div>
                `;
                addLog(lang === 'en' ? `✅ API Test 1/3 passed: ${data.username}` : `✅ Kiểm tra API 1/3 thành công: ${data.username}`, 'success');
            } else {
                document.getElementById('api-test-result').innerHTML += `<div style="color:#f87171">❌ ${lang === 'en' ? 'Basic API failed:' : 'API cơ bản thất bại:'} ${test1Res.status}</div>`;
            }

            // Test 2: Session creation
            document.getElementById('api-test-result').innerHTML += `<div style="color:#94a3b8; margin-top:5px">${lang === 'en' ? 'Test 2: Session API...' : 'Kiểm tra 2: API phiên...'}</div>`;
            const sessionPayload = {
                challengeTypes: ['translate'],
                fromLanguage: 'en',
                learningLanguage: 'es',
                type: 'GLOBAL_PRACTICE',
                difficulty: 'EASY'
            };

            const test2Res = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
                method: 'POST',
                headers,
                body: JSON.stringify(sessionPayload)
            });

            if (test2Res.ok) {
                successCount++;
                document.getElementById('api-test-result').innerHTML += `<div style="color:#86efac">✓ ${lang === 'en' ? 'Session API SUCCESS' : 'API PHIÊN THÀNH CÔNG'}</div>`;
                addLog(lang === 'en' ? '✅ API Test 2/3 passed: Session creation' : '✅ Kiểm tra API 2/3 thành công: Tạo phiên', 'success');
            } else {
                document.getElementById('api-test-result').innerHTML += `<div style="color:#f87171">❌ ${lang === 'en' ? 'Session API failed:' : 'API phiên thất bại:'} ${test2Res.status}</div>`;
            }

            // Test 3: Additional endpoints
            document.getElementById('api-test-result').innerHTML += `<div style="color:#94a3b8; margin-top:5px">${lang === 'en' ? 'Test 3: Extended API...' : 'Kiểm tra 3: API mở rộng...'}</div>`;
            const test3Res = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=fromLanguage,learningLanguage,profilePicture`, { headers });

            if (test3Res.ok) {
                const extData = await test3Res.json();
                successCount++;
                document.getElementById('api-test-result').innerHTML += `
                    <div style="color:#86efac">✓ ${lang === 'en' ? 'Extended API SUCCESS' : 'API MỞ RỘNG THÀNH CÔNG'}</div>
                    <div style="color:#94a3b8; margin-left:10px">${lang === 'en' ? 'Learning:' : 'Đang học:'} ${extData.learningLanguage} ${lang === 'en' ? 'from' : 'từ'} ${extData.fromLanguage}</div>
                `;
                addLog(lang === 'en' ? '✅ API Test 3/3 passed: Extended API' : '✅ Kiểm tra API 3/3 thành công: API mở rộng', 'success');
            } else {
                document.getElementById('api-test-result').innerHTML += `<div style="color:#f87171">❌ ${lang === 'en' ? 'Extended API failed:' : 'API mở rộng thất bại:'} ${test3Res.status}</div>`;
            }

            // Summary
            const successRate = Math.round((successCount / totalTests) * 100);
            document.getElementById('api-test-result').innerHTML += `
                <div style="margin-top:15px; padding-top:10px; border-top:1px solid rgba(59,130,246,0.2)">
                    <div style="color:${successRate > 66 ? '#4ade80' : successRate > 33 ? '#fbbf24' : '#f87171'}; font-weight:bold">
                        ✅ ${lang === 'en' ? 'API TEST COMPLETE:' : 'KIỂM TRA API HOÀN TẤT:'} ${successCount}/${totalTests} ${lang === 'en' ? 'tests passed' : 'kiểm tra thành công'} (${successRate}%)
                    </div>
                    <div style="color:#94a3b8; margin-top:5px">${lang === 'en' ? 'Status:' : 'Trạng thái:'} ${successCount === totalTests ? (lang === 'en' ? 'READY TO FARM' : 'SẴN SÀNG FARM') : (lang === 'en' ? 'PARTIAL FUNCTIONALITY' : 'CHỨC NĂNG MỘT PHẦN')}</div>
                </div>
            `;

            if (successCount > 0) {
                // Update UI with user data
                await syncUser();
            }

            if (successCount === totalTests) {
                addLog(lang === 'en' ? '✅ All API tests passed! System ready for farming.' : '✅ Tất cả kiểm tra API thành công! Hệ thống sẵn sàng farm.', 'success');
            } else {
                addLog(lang === 'en' ? `⚠️ ${successCount}/${totalTests} API tests passed. Some features may not work.` : `⚠️ ${successCount}/${totalTests} kiểm tra API thành công. Một số tính năng có thể không hoạt động.`, 'warning');
            }

        } catch (error) {
            const errorMsg = lang === 'en' ? `❌ Network Error: ${error.message}` : `❌ Lỗi mạng: ${error.message}`;
            addLog(errorMsg, 'error');
            document.getElementById('api-test-result').innerHTML += `<div style="color:#f87171">${errorMsg}</div>`;
        }
    };

    // === SYNC USER FUNCTION ===
    async function syncUser() {
        try {
            const jwt = getJwtToken();
            if (!jwt) {
                throw new Error(lang === 'en' ? "Not logged in - No JWT token found" : "Chưa đăng nhập - Không tìm thấy token JWT");
            }

            const userId = getUserId();
            if (!userId) {
                throw new Error(lang === 'en' ? "No user ID found in JWT" : "Không tìm thấy ID người dùng trong token JWT");
            }

            const headers = {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            addLog(lang === 'en' ? `Fetching user data for ID: ${userId}` : `Đang tải dữ liệu người dùng cho ID: ${userId}`, 'info');

            const userRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=username,streak,totalXp,gems,profilePicture,fromLanguage,learningLanguage`, { headers });

            if (!userRes.ok) {
                throw new Error(lang === 'en' ? `API Error: ${userRes.status} ${userRes.statusText}` : `Lỗi API: ${userRes.status} ${userRes.statusText}`);
            }

            const userData = await userRes.json();
            addLog(lang === 'en' ? `User data received: ${userData.username}` : `Đã nhận dữ liệu người dùng: ${userData.username}`, 'success');

            // Update display
            await updateUserDisplayBasic(userData);

            return userData;

        } catch (e) {
            console.error("Sync User Error:", e);
            addLog(lang === 'en' ? `Sync Error: ${e.message}` : `Lỗi đồng bộ: ${e.message}`, 'error');

            document.getElementById('user-display').innerHTML = `
                <div class="user-avatar" style="background:linear-gradient(135deg, #FF6B6B, #FFD700)"></div>
                <div class="user-info">
                    <b>${lang === 'en' ? 'Guest User' : 'Người dùng khách'}</b>
                    <span id="user-status">${t('loginPrompt')}</span>
                </div>
            `;
            document.getElementById('user-status').textContent = lang === 'en' ? '❌ Not logged in • Please log in' : '❌ Chưa đăng nhập • Vui lòng đăng nhập';
            return null;
        }
    }

    async function updateUserDisplayBasic(userData) {
        const userDisplay = document.getElementById('user-display');
        userDisplay.innerHTML = '';

        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'user-avatar';
        avatarContainer.style.background = 'linear-gradient(135deg, #FF6B6B, #FFD700)';
        avatarContainer.style.display = 'flex';
        avatarContainer.style.alignItems = 'center';
        avatarContainer.style.justifyContent = 'center';
        avatarContainer.innerHTML = `<span style="font-weight:bold;color:white">${userData.username.charAt(0).toUpperCase()}</span>`;

        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <b>${userData.username}</b>
            <span id="user-status">@${userData.username} • ${lang === 'en' ? 'Streak:' : 'Chuỗi:'} ${userData.streak || 0} ${lang === 'en' ? 'days' : 'ngày'}</span>
        `;

        userDisplay.appendChild(avatarContainer);
        userDisplay.appendChild(userInfo);

        document.getElementById('st-streak').innerText = userData.streak || 0;
        document.getElementById('st-xp').innerText = userData.totalXp || 0;
        document.getElementById('st-gems').innerText = userData.gems || 0;
        document.getElementById('current-streak-display').textContent = `${t('current')}: ${userData.streak || 0} ${t('days')}`;

        const userStatus = document.getElementById('user-status');
        if (userStatus) {
            userStatus.textContent = `✅ @${userData.username} • ${userData.streak || 0} ${lang === 'en' ? 'day streak' : 'ngày chuỗi'}`;
        }

        // Update collapsed panel stats
        updateCollapsedStats();

        addLog(lang === 'en' ? `User synced: ${userData.username}` : `Đã đồng bộ người dùng: ${userData.username}`, 'success');
    }

    // === IMPROVED GEMS FARMING FUNCTION ===
    async function farmGems_Advanced(amount, mode) {
        addLog(lang === 'en' ? `Starting ADVANCED Gems farm: ${amount} gems` : `Đang bắt đầu farm Ngọc NÂNG CAO: ${amount} ngọc`, 'info');

        const jwt = getJwtToken();
        if (!jwt) {
            addLog(lang === 'en' ? 'ERROR: No authentication token' : 'LỖI: Không có token xác thực', 'error');
            alert(lang === 'en' ? '❌ Please log in to Duolingo first!' : '❌ Vui lòng đăng nhập vào Duolingo trước!');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            addLog(lang === 'en' ? 'ERROR: No user ID' : 'LỖI: Không có ID người dùng', 'error');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };

        let farmed = 0;
        let attempts = 0;
        const maxAttempts = Math.min(amount * 2, 100);

        // Danh sách các phương pháp farm gem
        const gemMethods = [
            // Phương pháp 1: Hoàn thành bài học thông thường
            async () => {
                try {
                    const userInfo = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=fromLanguage,learningLanguage`, { headers });
                    const userData = await userInfo.json();

                    const sessionData = {
                        challengeTypes: ['translate', 'assist', 'listen'],
                        fromLanguage: userData.fromLanguage || 'en',
                        learningLanguage: userData.learningLanguage || 'es',
                        type: 'SKILL_PRACTICE',
                        difficulty: 'MEDIUM',
                        skillId: 'grammar_intro'
                    };

                    const sessionRes = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(sessionData)
                    });

                    if (!sessionRes.ok) throw new Error(`Session: ${sessionRes.status}`);

                    const session = await sessionRes.json();

                    const gemGain = mode === 'super' ? 8 : (mode === 'fast' ? 5 : 3);

                    const completeData = {
                        ...session,
                        heartsLeft: 5,
                        failed: false,
                        maxInLessonStreak: 15,
                        shouldLearnThings: true,
                        xpGain: 25,
                        gemGain: gemGain,
                        startTime: Math.floor(Date.now()/1000) - 120,
                        endTime: Math.floor(Date.now()/1000),
                        perfectLesson: true,
                        skillId: session.skillId || 'grammar_intro'
                    };

                    const completeRes = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(completeData)
                    });

                    if (completeRes.ok) {
                        return { success: true, gems: gemGain, method: 'lesson' };
                    }
                } catch (e) {
                    console.log('Method 1 failed:', e.message);
                }
                return { success: false, gems: 0 };
            },

            // Phương pháp 2: Direct reward claim
            async () => {
                try {
                    const rewardId = `CAPSTONE_COMPLETION-${Date.now()}-${Math.floor(Math.random() * 1000)}-GEMS`;

                    const res = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/rewards/${rewardId}`, {
                        method: 'PATCH',
                        headers: {
                            'accept': 'application/json',
                            'authorization': 'Bearer ' + jwt,
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            amount: mode === 'super' ? 20 : 10,
                            consumed: false,
                            type: 'mission',
                            skillId: 'capstone_' + Date.now()
                        })
                    });

                    if (res.status === 200 || res.status === 201) {
                        const data = await res.json();
                        const gemAmount = data.amount || (mode === 'super' ? 20 : 10);

                        return { success: true, gems: gemAmount, method: 'direct' };
                    }
                } catch (err) {
                    console.log('Method 2 failed:', err.message);
                }
                return { success: false, gems: 0 };
            },

            // Phương pháp 3: Hoàn thành level up
            async () => {
                try {
                    const levelPayload = {
                        eventType: "LEVEL_UP",
                        language: "es",
                        level: Math.floor(Math.random() * 10) + 1,
                        timestamp: Math.floor(Date.now() / 1000)
                    };

                    const levelRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/xp_events`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(levelPayload)
                    });

                    if (levelRes.ok) {
                        const rewardId = `LEVEL_UP_REWARD_${Date.now()}`;
                        const rewardRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/rewards/${rewardId}`, {
                            method: 'PATCH',
                            headers,
                            body: JSON.stringify({
                                amount: mode === 'super' ? 25 : 15,
                                consumed: false,
                                type: 'level_up'
                            })
                        });

                        if (rewardRes.ok) {
                            return { success: true, gems: mode === 'super' ? 25 : 15, method: 'level' };
                        }
                    }
                } catch (e) {
                    console.log('Method 3 failed:', e.message);
                }
                return { success: false, gems: 0 };
            },

            // Phương pháp 4: Streak milestone
            async () => {
                try {
                    const userRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=streak`, { headers });
                    if (!userRes.ok) return { success: false, gems: 0 };

                    const userData = await userRes.json();
                    const currentStreak = userData.streak || 0;

                    const milestonePayload = {
                        rewardId: `STREAK_MILESTONE_${currentStreak}_${Date.now()}`,
                        type: "STREAK_MILESTONE",
                        amount: mode === 'super' ? 30 : 20,
                        consumed: false,
                        streakDays: currentStreak + 7,
                        completedAt: new Date().toISOString()
                    };

                    const milestoneRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/rewards`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(milestonePayload)
                    });

                    if (milestoneRes.ok) {
                        return { success: true, gems: mode === 'super' ? 30 : 20, method: 'milestone' };
                    }
                } catch (e) {
                    console.log('Method 4 failed:', e.message);
                }
                return { success: false, gems: 0 };
            }
        ];

        while (farmed < amount && isFarming && attempts < maxAttempts) {
            attempts++;

            const methodIndex = Math.floor(Math.random() * gemMethods.length);
            const method = gemMethods[methodIndex];

            try {
                addLog(lang === 'en' ? `Attempt ${attempts}: Trying gem farming method...` : `Lần thử ${attempts}: Đang thử phương pháp farm ngọc...`, 'info');

                const result = await method();

                if (result.success) {
                    farmed += result.gems;

                    const currentGems = parseInt(document.getElementById('st-gems').innerText) || 0;
                    document.getElementById('st-gems').innerText = currentGems + result.gems;
                    document.getElementById('progressBar').style.width = `${(farmed/amount)*100}%`;
                    document.getElementById('progressText').textContent = lang === 'en'
                        ? `💎 Farming ${farmed}/${amount} gems (${result.method})`
                        : `💎 Đang farm ${farmed}/${amount} ngọc (${result.method})`;

                    if (result.method === 'lesson') {
                        const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                        document.getElementById('st-xp').innerText = currentXP + 25;
                    }

                    addLog(lang === 'en'
                        ? `✅ +${result.gems} Gems via ${result.method} (Total: ${farmed}/${amount})`
                        : `✅ +${result.gems} Ngọc qua ${result.method} (Tổng: ${farmed}/${amount})`, 'success');

                    let delayTime;
                    if (mode === 'super') {
                        delayTime = 800 + Math.random() * 500;
                    } else if (mode === 'fast') {
                        delayTime = 2000 + Math.random() * 1000;
                    } else {
                        delayTime = 4000 + Math.random() * 2000;
                    }

                    await new Promise(r => setTimeout(r, delayTime));

                } else {
                    addLog(lang === 'en' ? 'Method failed, trying next...' : 'Phương pháp thất bại, đang thử tiếp...', 'warning');
                    await new Promise(r => setTimeout(r, 1000));
                }

            } catch (error) {
                addLog(lang === 'en'
                    ? `Error in gem farming attempt ${attempts}: ${error.message}`
                    : `Lỗi trong lần thử farm ngọc ${attempts}: ${error.message}`, 'error');
                await new Promise(r => setTimeout(r, 2000));
            }

            if (attempts % 5 === 0) {
                try {
                    const verifyRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=gems`, { headers });
                    if (verifyRes.ok) {
                        const verifyData = await verifyRes.json();
                        const serverGems = verifyData.gems || 0;
                        const localGems = parseInt(document.getElementById('st-gems').innerText) || 0;

                        if (Math.abs(serverGems - localGems) > 50) {
                            addLog(lang === 'en'
                                ? `⚠️ Sync discrepancy: Server=${serverGems}, Local=${localGems}. Syncing...`
                                : `⚠️ Chênh lệch đồng bộ: Server=${serverGems}, Local=${localGems}. Đang đồng bộ...`, 'warning');
                            document.getElementById('st-gems').innerText = serverGems;
                            farmed = Math.max(farmed, serverGems - (parseInt(document.getElementById('st-gems').innerText) || 0));
                        }
                    }
                } catch (e) {
                    // Bỏ qua lỗi verify
                }
            }
        }

        if (farmed >= amount) {
            addLog(lang === 'en'
                ? `✅ Gems farming completed: ${farmed} gems gained`
                : `✅ Farm ngọc hoàn thành: Đã nhận ${farmed} ngọc`, 'success');
            document.getElementById('progressText').textContent = lang === 'en' ? '✅ Gems farming completed!' : '✅ Farm ngọc hoàn thành!';

            try {
                const verifyRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=gems`, { headers });
                if (verifyRes.ok) {
                    const verifyData = await verifyRes.json();
                    const finalGems = verifyData.gems || 0;
                    addLog(lang === 'en'
                        ? `Final verification: ${finalGems} gems in account`
                        : `Xác minh cuối: ${finalGems} ngọc trong tài khoản`, 'success');

                    const successMsg = lang === 'en'
                        ? `🎉 SUCCESS! You now have ${finalGems} gems!`
                        : `🎉 THÀNH CÔNG! Bạn hiện có ${finalGems} ngọc!`;
                    alert(successMsg);

                    document.getElementById('st-gems').innerText = finalGems;
                    updateCollapsedStats();
                }
            } catch (verifyError) {
                addLog(lang === 'en'
                    ? 'Note: Could not verify final gems count from server'
                    : 'Lưu ý: Không thể xác minh số ngọc cuối từ server', 'info');
                alert(lang === 'en'
                    ? '✅ Gems farming completed! Check your Duolingo profile.'
                    : '✅ Farm ngọc hoàn thành! Kiểm tra hồ sơ Duolingo của bạn.');
            }
        } else if (attempts >= maxAttempts) {
            addLog(lang === 'en'
                ? `⚠️ Stopped after ${maxAttempts} attempts. Farmed: ${farmed}/${amount} gems`
                : `⚠️ Đã dừng sau ${maxAttempts} lần thử. Đã farm: ${farmed}/${amount} ngọc`, 'warning');
            document.getElementById('progressText').textContent = lang === 'en' ? '⚠️ Max attempts reached' : '⚠️ Đạt giới hạn lần thử';
        }
    }

    // === REAL STREAK FARMING FUNCTION ===
    async function farmStreak(targetDays, mode) {
        const jwt = getJwtToken();
        if (!jwt) {
            addLog(lang === 'en' ? 'ERROR: No authentication token' : 'LỖI: Không có token xác thực', 'error');
            alert(lang === 'en' ? '❌ Please log in to Duolingo first!' : '❌ Vui lòng đăng nhập vào Duolingo trước!');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            addLog(lang === 'en' ? 'ERROR: No user ID' : 'LỖI: Không có ID người dùng', 'error');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        };

        try {
            const userRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=streak,streakData,fromLanguage,learningLanguage`, { headers });
            if (!userRes.ok) {
                addLog(lang === 'en' ? 'Failed to get user streak info' : 'Không thể lấy thông tin chuỗi ngày của người dùng', 'error');
                return;
            }

            const userData = await userRes.json();
            const currentStreak = userData.streak || 0;
            const hasStreak = userData.streakData?.currentStreak;
            const startStreakDate = hasStreak ? userData.streakData.currentStreak.startDate : new Date();
            const startFarmStreakTimestamp = Math.floor(new Date(startStreakDate).getTime() / 1000);
            let currentTimestamp = hasStreak ? startFarmStreakTimestamp - 86400 : startFarmStreakTimestamp;

            addLog(lang === 'en'
                ? `Starting streak farming: Current streak ${currentStreak} days`
                : `Bắt đầu farm chuỗi ngày: Chuỗi hiện tại ${currentStreak} ngày`, 'info');
            addLog(lang === 'en'
                ? `Will simulate sessions starting from ${new Date(currentTimestamp * 1000).toLocaleDateString()}`
                : `Sẽ mô phỏng phiên bắt đầu từ ${new Date(currentTimestamp * 1000).toLocaleDateString()}`, 'info');
            addLog(lang === 'en'
                ? `Target: Add ${targetDays} days (Total: ${currentStreak + targetDays} days)`
                : `Mục tiêu: Thêm ${targetDays} ngày (Tổng: ${currentStreak + targetDays} ngày)`, 'info');

            document.getElementById('progressText').textContent = lang === 'en' ? '🔥 Starting streak farming...' : '🔥 Đang bắt đầu farm chuỗi ngày...';
            document.getElementById('target-streak-display').textContent = `${t('target')}: ${currentStreak + targetDays} ${t('days')}`;

            let streakAdded = 0;

            while (streakAdded < targetDays && isFarming) {
                try {
                    addLog(lang === 'en'
                        ? `Processing streak day ${streakAdded + 1}/${targetDays}`
                        : `Đang xử lý ngày chuỗi ${streakAdded + 1}/${targetDays}`, 'info');

                    const sessionPayload = {
                        challengeTypes: ['translate', 'assist'],
                        fromLanguage: userData.fromLanguage || 'en',
                        learningLanguage: userData.learningLanguage || 'es',
                        type: 'GLOBAL_PRACTICE',
                        difficulty: 'EASY',
                        startTime: currentTimestamp,
                        endTime: currentTimestamp + 300
                    };

                    const sessionRes = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(sessionPayload)
                    });

                    if (!sessionRes.ok) {
                        throw new Error(lang === 'en' ? `Session creation failed: ${sessionRes.status}` : `Tạo phiên thất bại: ${sessionRes.status}`);
                    }

                    const sessionData = await sessionRes.json();

                    const completePayload = {
                        ...sessionData,
                        heartsLeft: 5,
                        failed: false,
                        maxInLessonStreak: 10,
                        shouldLearnThings: true,
                        xpGain: 15,
                        startTime: currentTimestamp,
                        endTime: currentTimestamp + 300
                    };

                    const completeRes = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${sessionData.id}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(completePayload)
                    });

                    if (!completeRes.ok) {
                        throw new Error(lang === 'en' ? `Session completion failed: ${completeRes.status}` : `Hoàn thành phiên thất bại: ${completeRes.status}`);
                    }

                    currentTimestamp -= 86400;
                    streakAdded++;

                    const newStreak = currentStreak + streakAdded;

                    document.getElementById('st-streak').innerText = newStreak;
                    document.getElementById('data-streak-days').innerText = streakAdded;
                    document.getElementById('progressBar').style.width = `${(streakAdded/targetDays)*100}%`;
                    document.getElementById('progressText').textContent = lang === 'en'
                        ? `🔥 Day ${streakAdded}/${targetDays}: Streak at ${newStreak} days`
                        : `🔥 Ngày ${streakAdded}/${targetDays}: Chuỗi ở ${newStreak} ngày`;
                    document.getElementById('current-streak-display').textContent = `${t('current')}: ${newStreak} ${t('days')}`;

                    const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                    document.getElementById('st-xp').innerText = currentXP + 15;

                    addLog(lang === 'en'
                        ? `✅ Streak day ${streakAdded} completed. Total: ${newStreak} days`
                        : `✅ Đã hoàn thành ngày chuỗi ${streakAdded}. Tổng: ${newStreak} ngày`, 'success');

                    let delayTime;
                    if (mode === 'super') {
                        delayTime = 800;
                    } else if (mode === 'fast') {
                        delayTime = 2000;
                    } else {
                        delayTime = 5000;
                    }
                    await new Promise(r => setTimeout(r, delayTime));

                } catch (dayError) {
                    addLog(lang === 'en'
                        ? `⚠️ Session failed for day ${streakAdded + 1}: ${dayError.message}`
                        : `⚠️ Phiên thất bại cho ngày ${streakAdded + 1}: ${dayError.message}`, 'error');
                    await new Promise(r => setTimeout(r, 3000));
                }
            }

            if (streakAdded >= targetDays) {
                addLog(lang === 'en'
                    ? `✅ Streak farming completed! Added ${streakAdded} days`
                    : `✅ Farm chuỗi ngày hoàn thành! Đã thêm ${streakAdded} ngày`, 'success');
                document.getElementById('progressText').textContent = lang === 'en'
                    ? `✅ Streak farming completed! Added ${streakAdded} days`
                    : `✅ Farm chuỗi ngày hoàn thành! Đã thêm ${streakAdded} ngày`;

                try {
                    const verifyRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=streak`, { headers });
                    if (verifyRes.ok) {
                        const verifyData = await verifyRes.json();
                        const finalStreak = verifyData.streak || 0;
                        addLog(lang === 'en'
                            ? `Final streak verification: ${finalStreak} days`
                            : `Xác minh chuỗi ngày cuối: ${finalStreak} ngày`, 'success');

                        if (finalStreak >= currentStreak + streakAdded) {
                            alert(lang === 'en'
                                ? `🎉 SUCCESS! Your streak is now ${finalStreak} days!`
                                : `🎉 THÀNH CÔNG! Chuỗi ngày của bạn hiện là ${finalStreak} ngày!`);
                        } else {
                            alert(lang === 'en'
                                ? `⚠️ Partial success: Streak increased from ${currentStreak} to ${finalStreak} days`
                                : `⚠️ Thành công một phần: Chuỗi ngày tăng từ ${currentStreak} lên ${finalStreak} ngày`);
                        }
                    }
                } catch (verifyError) {
                    addLog(lang === 'en' ? 'Could not verify final streak' : 'Không thể xác minh chuỗi ngày cuối', 'info');
                    alert(lang === 'en'
                        ? '✅ Streak farming completed! Check your Duolingo profile.'
                        : '✅ Farm chuỗi ngày hoàn thành! Kiểm tra hồ sơ Duolingo của bạn.');
                }
            }

        } catch (error) {
            addLog(lang === 'en'
                ? `❌ Streak farming error: ${error.message}`
                : `❌ Lỗi farm chuỗi ngày: ${error.message}`, 'error');
            document.getElementById('progressText').textContent = lang === 'en' ? '❌ Error farming streak!' : '❌ Lỗi farm chuỗi ngày!';
            alert(lang === 'en'
                ? '❌ Error farming streak. Please try again.'
                : '❌ Lỗi farm chuỗi ngày. Vui lòng thử lại.');
        }
    }

    // === XP FARMING FUNCTION ===
    async function farmXP_Simple(amount, mode) {
        addLog(lang === 'en' ? `Starting XP farm: ${amount} XP` : `Bắt đầu farm XP: ${amount} XP`, 'info');

        const jwt = getJwtToken();
        if (!jwt) {
            addLog(lang === 'en' ? 'ERROR: No authentication token' : 'LỖI: Không có token xác thực', 'error');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            addLog(lang === 'en' ? 'ERROR: No user ID' : 'LỖI: Không có ID người dùng', 'error');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        };

        let farmed = 0;
        let batchSize;

        if (mode === 'super') {
            batchSize = 25;
        } else if (mode === 'fast') {
            batchSize = 15;
        } else {
            batchSize = 10;
        }

        while (farmed < amount && isFarming) {
            try {
                const userInfo = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=fromLanguage,learningLanguage`, { headers });
                const userData = await userInfo.json();

                const sessionData = {
                    challengeTypes: ['translate'],
                    fromLanguage: userData.fromLanguage || 'en',
                    learningLanguage: userData.learningLanguage || 'es',
                    type: 'GLOBAL_PRACTICE',
                    difficulty: 'EASY'
                };

                const sessionRes = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(sessionData)
                });

                if (!sessionRes.ok) {
                    addLog(lang === 'en'
                        ? `Session creation failed: ${sessionRes.status}`
                        : `Tạo phiên thất bại: ${sessionRes.status}`, 'error');
                    await new Promise(r => setTimeout(r, 2000));
                    continue;
                }

                const session = await sessionRes.json();

                const xpGain = mode === 'super' ? 25 : (mode === 'fast' ? 15 : 10);

                const completeData = {
                    ...session,
                    heartsLeft: 5,
                    startTime: Math.floor(Date.now()/1000) - 60,
                    endTime: Math.floor(Date.now()/1000),
                    failed: false,
                    maxInLessonStreak: 10,
                    shouldLearnThings: true,
                    xpGain: xpGain
                };

                const completeRes = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(completeData)
                });

                if (completeRes.ok) {
                    farmed += xpGain;

                    const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                    document.getElementById('st-xp').innerText = currentXP + xpGain;
                    document.getElementById('progressBar').style.width = `${(farmed/amount)*100}%`;
                    document.getElementById('progressText').textContent = lang === 'en'
                        ? `🧠 Farming ${farmed}/${amount} XP`
                        : `🧠 Đang farm ${farmed}/${amount} XP`;

                    addLog(lang === 'en'
                        ? `+${xpGain} XP (Total: ${farmed}/${amount})`
                        : `+${xpGain} XP (Tổng: ${farmed}/${amount})`, 'success');

                    let delayTime;
                    if (mode === 'super') {
                        delayTime = 500;
                    } else if (mode === 'fast') {
                        delayTime = 1000;
                    } else {
                        delayTime = 3000;
                    }
                    await new Promise(r => setTimeout(r, delayTime));
                } else {
                    addLog(lang === 'en'
                        ? `Session completion failed: ${completeRes.status}`
                        : `Hoàn thành phiên thất bại: ${completeRes.status}`, 'error');
                }

            } catch (error) {
                addLog(lang === 'en'
                    ? `Error in XP farm: ${error.message}`
                    : `Lỗi trong farm XP: ${error.message}`, 'error');
                await new Promise(r => setTimeout(r, 3000));
            }
        }

        if (farmed >= amount) {
            addLog(lang === 'en'
                ? `✅ XP farming completed: ${farmed} XP gained`
                : `✅ Farm XP hoàn thành: Đã nhận ${farmed} XP`, 'success');
            document.getElementById('progressText').textContent = lang === 'en' ? '✅ XP farming completed!' : '✅ Farm XP hoàn thành!';
        }
    }

    // === SUPER XP FARMING FUNCTION ===
    async function farmXP_Super(amount) {
        addLog(lang === 'en' ? `🚀 Starting SUPER XP farm: ${amount} XP` : `🚀 Bắt đầu farm XP SIÊU TỐC: ${amount} XP`, 'info');

        const jwt = getJwtToken();
        if (!jwt) {
            addLog(lang === 'en' ? 'ERROR: No authentication token' : 'LỖI: Không có token xác thực', 'error');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            addLog(lang === 'en' ? 'ERROR: No user ID' : 'LỖI: Không có ID người dùng', 'error');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        };

        let farmed = 0;
        const batchSize = 50;

        while (farmed < amount && isFarming) {
            try {
                const userInfo = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=fromLanguage,learningLanguage`, { headers });
                const userData = await userInfo.json();

                for (let i = 0; i < 3 && farmed < amount && isFarming; i++) {
                    const sessionData = {
                        challengeTypes: ['translate', 'assist', 'listen'],
                        fromLanguage: userData.fromLanguage || 'en',
                        learningLanguage: userData.learningLanguage || 'es',
                        type: 'GLOBAL_PRACTICE',
                        difficulty: 'HARD'
                    };

                    const sessionRes = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(sessionData)
                    });

                    if (!sessionRes.ok) {
                        addLog(lang === 'en'
                            ? `Session creation failed: ${sessionRes.status}`
                            : `Tạo phiên thất bại: ${sessionRes.status}`, 'error');
                        continue;
                    }

                    const session = await sessionRes.json();

                    const completeData = {
                        ...session,
                        heartsLeft: 5,
                        startTime: Math.floor(Date.now()/1000) - 120,
                        endTime: Math.floor(Date.now()/1000),
                        failed: false,
                        maxInLessonStreak: 20,
                        shouldLearnThings: true,
                        xpGain: batchSize,
                        perfectLesson: true,
                        rankUp: Math.random() > 0.7
                    };

                    const completeRes = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(completeData)
                    });

                    if (completeRes.ok) {
                        farmed += batchSize;

                        const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                        document.getElementById('st-xp').innerText = currentXP + batchSize;
                        document.getElementById('progressBar').style.width = `${(farmed/amount)*100}%`;
                        document.getElementById('progressText').textContent = lang === 'en'
                            ? `🚀 SUPER Farming ${farmed}/${amount} XP`
                            : `🚀 Đang farm SIÊU TỐC ${farmed}/${amount} XP`;

                        addLog(lang === 'en'
                            ? `🚀 +${batchSize} XP via SUPER mode (Total: ${farmed}/${amount})`
                            : `🚀 +${batchSize} XP qua chế độ SIÊU TỐC (Tổng: ${farmed}/${amount})`, 'success');
                    }
                }

                await new Promise(r => setTimeout(r, 800));

            } catch (error) {
                addLog(lang === 'en'
                    ? `Error in SUPER XP farm: ${error.message}`
                    : `Lỗi trong farm XP SIÊU TỐC: ${error.message}`, 'error');
                await new Promise(r => setTimeout(r, 1500));
            }
        }

        if (farmed >= amount) {
            addLog(lang === 'en'
                ? `✅ SUPER XP farming completed: ${farmed} XP gained`
                : `✅ Farm XP SIÊU TỐC hoàn thành: Đã nhận ${farmed} XP`, 'success');
            document.getElementById('progressText').textContent = lang === 'en' ? '✅ SUPER XP farming completed!' : '✅ Farm XP SIÊU TỐC hoàn thành!';
        }
    }

    // === FARMING CONTROL ===
    let isFarming = false;
    let seconds = 0;
    let mult = 1;
    let currentMode = 'safe';

    // Target modules selection
    ['xp', 'gems', 'streak', 'league', 'quest', 'all'].forEach(k => {
        const el = document.getElementById('opt-' + k);
        el.onclick = () => {
            if (k === 'all') {
                ['xp', 'gems', 'streak', 'league', 'quest'].forEach(t => {
                    const item = document.getElementById('opt-' + t);
                    item.classList.toggle('active');
                });
            } else {
                el.classList.toggle('active');
            }

            if (['xp', 'gems', 'streak'].includes(k)) {
                const targetInput = document.getElementById('targetValue');
                switch(k) {
                    case 'xp':
                        targetInput.placeholder = lang === 'en' ? 'e.g., 1000 XP' : 'vd: 1000 XP';
                        targetInput.value = '1000';
                        targetInput.max = '999999';
                        break;
                    case 'gems':
                        targetInput.placeholder = lang === 'en' ? 'e.g., 500 Gems' : 'vd: 500 Ngọc';
                        targetInput.value = '500';
                        targetInput.max = '9999';
                        break;
                    case 'streak':
                        targetInput.placeholder = lang === 'en' ? 'e.g., 30 days' : 'vd: 30 ngày';
                        targetInput.value = '30';
                        targetInput.max = '365';
                        break;
                }
            }
        };
    });

    // Mode selection
    document.getElementById('sp-safe').onclick = function() {
        currentMode = 'safe';
        mult = 1;
        this.classList.add('active');
        document.getElementById('sp-fast').classList.remove('active');
        document.getElementById('sp-super').classList.remove('active');
        document.getElementById('farm-mode-indicator').innerHTML = t('safeMode');
        document.getElementById('farm-mode-indicator').className = 'farm-mode-indicator';
        document.getElementById('progressBar').className = 'progress-bar';
        addLog(lang === 'en' ? 'Switched to Safe Mode' : 'Đã chuyển sang Chế độ An toàn', 'info');
    };

    document.getElementById('sp-fast').onclick = function() {
        currentMode = 'fast';
        mult = 3;
        this.classList.add('active');
        document.getElementById('sp-safe').classList.remove('active');
        document.getElementById('sp-super').classList.remove('active');
        document.getElementById('farm-mode-indicator').innerHTML = t('fastMode');
        document.getElementById('farm-mode-indicator').className = 'farm-mode-indicator';
        document.getElementById('progressBar').className = 'progress-bar';
        addLog(lang === 'en' ? 'Switched to Fast Mode' : 'Đã chuyển sang Chế độ Nhanh', 'info');
    };

    document.getElementById('sp-super').onclick = function() {
        currentMode = 'super';
        mult = 5;
        this.classList.add('active');
        this.classList.add('super');
        document.getElementById('sp-safe').classList.remove('active');
        document.getElementById('sp-fast').classList.remove('active');
        document.getElementById('farm-mode-indicator').innerHTML = t('superMode');
        document.getElementById('farm-mode-indicator').className = 'super-farm-indicator';
        document.getElementById('progressBar').className = 'progress-bar super';
        addLog(lang === 'en' ? 'Switched to SUPER Farm Mode' : 'Đã chuyển sang Chế độ Farm SIÊU TỐC', 'warning');
    };

    // Main farming control
    const masterBtn = document.getElementById('btn-master-farm');
    masterBtn.onclick = async function() {
        if (isFarming) {
            isFarming = false;
            this.innerText = t('start');
            this.classList.remove('farming');
            this.classList.remove('super-farming');
            document.getElementById('data-status').innerText = t('idle');
            document.getElementById('data-status').style.color = "#FF6B6B";
            document.getElementById('progressText').textContent = lang === 'en' ? '⏸️ Farming stopped' : '⏸️ Đã dừng farm';
            updateCollapsedFarmStatus();
            addLog(lang === 'en' ? 'Farming stopped by user' : 'Người dùng đã dừng farm', 'info');
            return;
        }

        const jwt = getJwtToken();
        if (!jwt) {
            alert(lang === 'en'
                ? '❌ Please log in to Duolingo first!\n\n1. Make sure you are on Duolingo website\n2. Log in with your account\n3. Refresh the page'
                : '❌ Vui lòng đăng nhập vào Duolingo trước!\n\n1. Đảm bảo bạn đang ở trang web Duolingo\n2. Đăng nhập bằng tài khoản của bạn\n3. Làm mới trang');
            addLog(lang === 'en' ? 'ERROR: User not logged in' : 'LỖI: Người dùng chưa đăng nhập', 'error');
            return;
        }

        const amount = parseInt(document.getElementById('targetValue').value || '0');
        if (!amount || amount <= 0) {
            alert(lang === 'en' ? '❌ Please enter a valid amount!' : '❌ Vui lòng nhập số lượng hợp lệ!');
            document.getElementById('targetValue').focus();
            return;
        }

        const selectedModules = [];
        ['xp', 'gems', 'streak'].forEach(type => {
            if (document.getElementById('opt-' + type).classList.contains('active')) {
                selectedModules.push(type);
            }
        });

        if (selectedModules.length === 0) {
            alert(lang === 'en' ? '❌ Please select at least one farming module!' : '❌ Vui lòng chọn ít nhất một mô-đun farm!');
            return;
        }

        const modeName = currentMode === 'super' ? (lang === 'en' ? 'SUPER' : 'SIÊU TỐC') : (currentMode === 'fast' ? (lang === 'en' ? 'FAST' : 'NHANH') : (lang === 'en' ? 'SAFE' : 'AN TOÀN'));
        const confirmMsg = lang === 'en'
            ? `Start farming ${amount} ${selectedModules.join(', ').toUpperCase()} in ${modeName} mode?\n\n⚠️ ${currentMode === 'super' ? 'SUPER MODE: Very fast, use with caution!' : 'Make sure you are logged into Duolingo.'}`
            : `Bắt đầu farm ${amount} ${selectedModules.map(m => lang === 'en' ? m.toUpperCase() : (m === 'xp' ? 'XP' : m === 'gems' ? 'NGỌC' : 'CHUỖI NGÀY')).join(', ')} trong chế độ ${modeName}?\n\n⚠️ ${currentMode === 'super' ? 'CHẾ ĐỘ SIÊU TỐC: Rất nhanh, sử dụng cẩn thận!' : 'Đảm bảo bạn đã đăng nhập vào Duolingo.'}`;
        if (!confirm(confirmMsg)) return;

        isFarming = true;
        seconds = 0;
        this.innerText = t('stop');
        if (currentMode === 'super') {
            this.classList.add('super-farming');
        } else {
            this.classList.add('farming');
        }
        document.getElementById('data-status').innerText = t('running');
        document.getElementById('data-status').style.color = currentMode === 'super' ? "#f59e0b" : "#4ECDC4";
        document.getElementById('progressText').textContent = lang === 'en'
            ? `⏳ Starting ${modeName.toLowerCase()} farm...`
            : `⏳ Đang bắt đầu farm ${modeName.toLowerCase()}...`;
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('data-streak-days').innerText = '0';

        updateCollapsedFarmStatus();

        addLog(lang === 'en'
            ? `Starting ${modeName} farming session: ${selectedModules.join(', ')} x${amount}`
            : `Bắt đầu phiên farm ${modeName}: ${selectedModules.map(m => lang === 'en' ? m : (m === 'xp' ? 'XP' : m === 'gems' ? 'ngọc' : 'chuỗi ngày')).join(', ')} x${amount}`, 'info');

        try {
            for (const module of selectedModules) {
                if (!isFarming) break;

                addLog(lang === 'en'
                    ? `Starting ${module.toUpperCase()} farming in ${modeName} mode...`
                    : `Bắt đầu farm ${module === 'xp' ? 'XP' : module === 'gems' ? 'NGỌC' : 'CHUỖI NGÀY'} trong chế độ ${modeName}...`, 'info');

                switch(module) {
                    case 'xp':
                        if (currentMode === 'super') {
                            await farmXP_Super(amount);
                        } else {
                            await farmXP_Simple(amount, currentMode);
                        }
                        break;
                    case 'gems':
                        await farmGems_Advanced(amount, currentMode);
                        break;
                    case 'streak':
                        await farmStreak(amount, currentMode);
                        break;
                }

                if (isFarming && selectedModules.indexOf(module) < selectedModules.length - 1) {
                    document.getElementById('progressText').textContent = lang === 'en' ? '⏭️ Switching to next module...' : '⏭️ Đang chuyển sang mô-đun tiếp theo...';
                    document.getElementById('progressBar').style.width = '0%';
                    document.getElementById('data-streak-days').innerText = '0';
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

        } catch(error) {
            console.error('Farming error:', error);
            addLog(lang === 'en'
                ? `Farming error: ${error.message}`
                : `Lỗi farm: ${error.message}`, 'error');
            document.getElementById('progressText').textContent = lang === 'en' ? '❌ Farming error occurred' : '❌ Đã xảy ra lỗi farm';
        }

        if (isFarming) {
            isFarming = false;
            this.innerText = t('start');
            this.classList.remove('farming');
            this.classList.remove('super-farming');
            document.getElementById('data-status').innerText = t('idle');
            document.getElementById('data-status').style.color = "#FF6B6B";
            updateCollapsedFarmStatus();
            addLog(lang === 'en' ? 'Farming session completed' : 'Phiên farm đã hoàn thành', 'success');
        }
    };

    // Timer for runtime display
    setInterval(() => {
        if (!isFarming) return;
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        document.getElementById('data-time').innerText = `${hrs}:${mins}:${secs}`;
    }, 1000);

    // Enter key support
    document.getElementById('targetValue').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('btn-master-farm').click();
        }
    });

    // === INITIALIZATION ===
    addLog(lang === 'en'
        ? `🎉 DuoMax Pro ${VERSION} Tết Edition initialized with Fireworks and Daily Quests`
        : `🎉 DuoMax Pro ${VERSION} Phiên bản Tết đã khởi động với Pháo hoa và Nhiệm vụ Hàng ngày`, 'info');

    // Load language preference from localStorage
    const savedLang = localStorage.getItem('duomax_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
        lang = savedLang;
        // Apply language immediately
        switchLanguage(lang);
    }

    // Show hidden message on startup
    setTimeout(() => {
        hiddenMessage.style.display = 'block';
        setTimeout(() => {
            hiddenMessage.style.display = 'none';
        }, 3000);
    }, 1500);

    // Start fireworks animation
    setTimeout(() => {
        const fireworksCanvas = document.getElementById('fireworks-canvas');
        if (fireworksCanvas) {
            fireworks = new Fireworks(fireworksCanvas);
        }
    }, 1000);

    // Create Tết decorations
    setTimeout(() => {
        createTetDecorations();
    }, 500);

    // Auto-detect login and sync user data
    setTimeout(async () => {
        const jwt = getJwtToken();
        if (jwt) {
            addLog(lang === 'en' ? 'Auto-detected: User is logged in' : 'Tự động phát hiện: Người dùng đã đăng nhập', 'success');
            document.getElementById('user-status').textContent = `✅ ${t('loggedIn')} • ${t('newYear')}`;

            await syncUser();

            const currentStreak = parseInt(document.getElementById('st-streak').innerText) || 0;
            const targetInput = document.getElementById('targetValue');
            const targetValue = parseInt(targetInput.value) || 30;
            document.getElementById('target-streak-display').textContent = `${t('target')}: ${currentStreak + targetValue} ${t('days')}`;

        } else {
            addLog(lang === 'en' ? 'User not logged in. Please log into Duolingo.' : 'Người dùng chưa đăng nhập. Vui lòng đăng nhập vào Duolingo.', 'error');
            document.getElementById('user-status').textContent = `❌ ${t('notLoggedIn')} • ${t('loginPrompt')}`;
        }
    }, 2000);

    // Update target display when value changes
    document.getElementById('targetValue').addEventListener('input', function() {
        const currentStreak = parseInt(document.getElementById('st-streak').innerText) || 0;
        const targetValue = parseInt(this.value) || 0;
        document.getElementById('target-streak-display').textContent = `${t('target')}: ${currentStreak + targetValue} ${t('days')}`;
    });

    // Auto-update collapsed panel stats every 30 seconds
    setInterval(() => {
        if (isCollapsed) {
            updateCollapsedStats();
        }
    }, 30000);
})();