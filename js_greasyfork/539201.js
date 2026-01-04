// ==UserScript==
// @name Скрипт для ЗГА+
// @namespace https://forum.blackrussia.online
// @version 1.7
// @description Скрипт с готовыми ответами для руководителей игрового проекта.
// @author Rasul (ЗГА-56)
// @match *://*.forum.blackrussia.online/*
// @grant GM_addStyle
// @license MIT
// @icon https://i.postimg.cc/C1bfs7gB/2.jpg
// @downloadURL https://update.greasyfork.org/scripts/539201/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/539201/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%2B.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    GM_addStyle(`
        :root {
            --bg-color-1: #374151;
            --bg-color-2: #4b5563;
            --hover-color-1: #1d4ed8;
            --hover-color-2: #2563eb;
            --hover-color-3: #3b82f6;
            --border-color-1: rgba(255, 255, 255, 0.2);
            --border-color-2: #4b5563;
            --hover-border-color: #60a5fa;
            --text-color-1: white;
            --text-color-2: #d1d5db;
            --divider-color: #6b7280;
            --box-shadow-color: rgba(59, 130, 246, 0.4);
            --dialog-bg: #1f2937;
            --dialog-border: #4b5563;
            --dialog-shadow: rgba(0, 0, 0, 0.5);
            --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --success-color: #10b981;
            --error-color: #ef4444;
            --warning-color: #f59e0b;
        }

        /* Анимации */
        @keyframes bg-pan {
            from { background-position: 0% center; }
            to { background-position: -200% center; }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
        }

        /* Улучшение фона форума */
        body {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #0f172a 100%) !important;
            background-attachment: fixed !important;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }

        /* Улучшение контейнеров */
        .p-body-inner, .p-body-content {
            animation: fadeInUp 0.6s ease-out;
        }

        .block-container {
            background: rgba(31, 41, 55, 0.8) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(59, 130, 246, 0.2) !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
            transition: all 0.3s ease !important;
        }

        .block-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(59, 130, 246, 0.2) !important;
        }

        /* Улучшение карточек тем */
        .structItem {
            background: rgba(31, 41, 55, 0.6) !important;
            backdrop-filter: blur(8px) !important;
            border: 1px solid rgba(75, 85, 99, 0.3) !important;
            border-radius: 8px !important;
            margin-bottom: 8px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            animation: slideIn 0.4s ease-out;
            animation-fill-mode: both;
        }

        .structItem:nth-child(1) { animation-delay: 0.05s; }
        .structItem:nth-child(2) { animation-delay: 0.1s; }
        .structItem:nth-child(3) { animation-delay: 0.15s; }
        .structItem:nth-child(4) { animation-delay: 0.2s; }
        .structItem:nth-child(5) { animation-delay: 0.25s; }

        .structItem:hover {
            transform: translateX(5px);
            background: rgba(59, 130, 246, 0.1) !important;
            border-color: rgba(96, 165, 250, 0.5) !important;
            box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
        }

        /* Улучшение заголовков */
        .p-title, .block-header {
            background: var(--accent-gradient) !important;
            border-radius: 8px 8px 0 0 !important;
            padding: 12px 16px !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .p-title-value {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            font-weight: 600;
        }

        /* Кнопки модерации - уменьшенные */
        .persona-btn {
            border: 1px solid var(--border-color-1);
            border-radius: 5px;
            color: var(--text-color-1);
            padding: 4px 10px;
            margin: 2px 4px !important;
            font-weight: 600;
            font-size: 11px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            background-size: 200% 200%;
            background-image: linear-gradient(90deg, var(--bg-color-1), var(--bg-color-2), var(--bg-color-1));
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            outline: none;
            position: relative;
            overflow: hidden;
        }

        .persona-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .persona-btn:hover::before {
            left: 100%;
        }

        .persona-btn:hover {
            transform: translateY(-2px) scale(1.02);
            color: #fff;
            border-color: var(--hover-border-color);
            background-image: linear-gradient(90deg, var(--hover-color-1), var(--hover-color-2), var(--hover-color-3), var(--hover-color-1));
            box-shadow: 0 6px 20px var(--box-shadow-color);
            ${isMobile ? '' : 'animation: bg-pan 4s linear infinite;'}
        }

        .persona-btn:active {
            transform: translateY(0px) scale(0.98);
            box-shadow: 0 2px 8px var(--box-shadow-color);
        }

        /* Диалоговые окна */
        .select_answer_container .overlay-content {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            animation: fadeInUp 0.3s ease-out;
        }

        .select_answer_container .overlay-title {
            background: var(--accent-gradient);
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            font-weight: 700;
            padding: 16px 20px;
            border-radius: 14px 14px 0 0;
            letter-spacing: 0.5px;
        }

        .select_answer {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            padding: 24px;
            max-height: 70vh;
            overflow-y: auto;
        }

        .select_answer::-webkit-scrollbar {
            width: 8px;
        }

        .select_answer::-webkit-scrollbar-track {
            background: rgba(17, 24, 39, 0.5);
            border-radius: 4px;
        }

        .select_answer::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 4px;
        }

        .persona-answer-btn {
            background: rgba(55, 65, 81, 0.8);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(75, 85, 99, 0.5);
            border-radius: 8px;
            color: var(--text-color-2);
            padding: 10px 16px;
            font-weight: 500;
            font-size: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .persona-answer-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.4s, height 0.4s;
        }

        .persona-answer-btn:hover::before {
            width: 300px;
            height: 300px;
        }

        .persona-answer-btn:hover {
            background: rgba(59, 130, 246, 0.2);
            border-color: var(--hover-border-color);
            color: #ffffff;
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
        }

        .persona-answer-btn .button-text {
            position: relative;
            z-index: 1;
        }

        .persona-answer-divider {
            width: 100%;
            text-align: center;
            color: var(--text-color-1);
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 16px 0 12px 0;
            padding: 12px 0;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
            border-top: 2px solid rgba(59, 130, 246, 0.3);
            border-bottom: 2px solid rgba(59, 130, 246, 0.3);
            cursor: default;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Статистика */
        .mod-stats {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
            backdrop-filter: blur(12px);
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-radius: 16px;
            padding: 16px 20px;
            color: var(--text-color-2);
            font-size: 13px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            min-width: 200px;
            animation: fadeInUp 0.5s ease-out, glow 3s ease-in-out infinite;
        }

        .mod-stats-title {
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--text-color-1);
            border-bottom: 2px solid rgba(59, 130, 246, 0.3);
            padding-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 12px;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .mod-stats-item {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 6px 0;
            transition: all 0.3s ease;
        }

        .mod-stats-item:hover {
            transform: translateX(5px);
        }

        .mod-stats-item span:last-child {
            font-weight: 700;
            font-size: 14px;
        }

        /* Таймер темы */
        .thread-timer {
            display: inline-block;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
            backdrop-filter: blur(8px);
            color: var(--text-color-1);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            margin-left: 12px;
            border: 1px solid rgba(59, 130, 246, 0.3);
            font-weight: 600;
            animation: pulse 2s ease-in-out infinite;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        /* Превью панель */
        .preview-panel {
            background: linear-gradient(135deg, #1f2937, #111827);
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
            max-height: 500px;
            overflow-y: auto;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .preview-panel::-webkit-scrollbar {
            width: 8px;
        }

        .preview-panel::-webkit-scrollbar-track {
            background: rgba(17, 24, 39, 0.5);
            border-radius: 4px;
        }

        .preview-panel::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 4px;
        }

        .preview-title {
            color: var(--text-color-1);
            font-weight: 700;
            margin-bottom: 16px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Уведомления */
        .notification {
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            font-size: 14px;
            z-index: 99999;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: fadeInUp 0.4s ease-out;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .notification::before {
            content: '';
            width: 20px;
            height: 20px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .notification.success {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9));
        }

        .notification.success::before {
            background: white;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .notification.error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
        }

        .notification.error::before {
            background: white;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        /* Улучшение форм и инпутов */
        .input, textarea, select {
            background: rgba(31, 41, 55, 0.8) !important;
            backdrop-filter: blur(8px) !important;
            border: 1px solid rgba(75, 85, 99, 0.5) !important;
            border-radius: 8px !important;
            color: var(--text-color-1) !important;
            transition: all 0.3s ease !important;
        }

        .input:focus, textarea:focus, select:focus {
            border-color: rgba(59, 130, 246, 0.6) !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
        }

        /* Улучшение аватаров */
        .avatar {
            border: 2px solid rgba(59, 130, 246, 0.3) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            transition: all 0.3s ease !important;
        }

        .avatar:hover {
            transform: scale(1.05);
            border-color: rgba(59, 130, 246, 0.6) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
        }

        /* Улучшение ссылок */
        a {
            transition: all 0.3s ease !important;
        }

        a:hover {
            color: #60a5fa !important;
            text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
        }

        /* Декоративные элементы */
        .decorative-corner {
            position: fixed;
            width: 200px;
            height: 200px;
            pointer-events: none;
            z-index: 1;
        }

        .decorative-corner.top-left {
            top: 0;
            left: 0;
            background: radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.15), transparent 70%);
        }

        .decorative-corner.bottom-right {
            bottom: 0;
            right: 0;
            background: radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.15), transparent 70%);
        }

        /* Плавающие частицы */
        .particle {
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(59, 130, 246, 0.4);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: float 6s ease-in-out infinite;
        }
    `);

    const PREFIXES = {
        UNACCEPT: 4, ACCEPT: 8, PIN: 2, COMMAND: 10, WATCHED: 9, CLOSE: 7, GA: 12,
        SPECADM: 11, DECIDED: 6, MAINADM: 12, TECHADM: 13, CHECKED: 9
    };

    const topImage = `[CENTER][IMG]https://i.postimg.cc/tg2f3qFM/1.png[/IMG][/CENTER]`;
    const bottomImage = `[CENTER][IMG]https://i.postimg.cc/tg2f3qFM/1.png[/IMG][/CENTER]`;
    const template = (content) => `${topImage}\n\n[CENTER][FONT=georgia][SIZE=4]${content}[/SIZE][/FONT][/CENTER]\n\n${bottomImage}`;

    const buttons = [
        { title: `Выше +`, content: `[B][FONT=georgia]Выше +,под фрапс, после р/д[/FONT][/B]\n[IMG]https://i.postimg.cc/8PghxPdW/standard-17.gif[/IMG]` },
        {
            "title": "Роспись",
            "content": `[CENTER][IMG]https://i.postimg.cc/5tctzDgF/022-EB1-E9-5-C30-402-A-81-D4-08-C349-A08-FFF.gif[/IMG]<br><br>[COLOR=#F40]Зде[/COLOR][COLOR=#F50]сь[/COLOR] [COLOR=#F50]б[/COLOR][COLOR=#F60]ыл[/COLOR] [COLOR=#F60]Т[/COLOR][COLOR=#F70]от[/COLOR] [COLOR=#F70]с[/COLOR][COLOR=#F80]амы[/COLOR][COLOR=#F90]й[/COLOR] [COLOR=#F90]Ра[/COLOR][COLOR=#FA0]сул.[/COLOR] [COLOR=#FB0]Кто[/COLOR] [COLOR=#FC0]зна[/COLOR][COLOR=#FD0]ет[/COLOR] [COLOR=#FD0]-[/COLOR] [COLOR=#FD0]по[/COLOR][COLOR=#FC0]ймёт.[/COLOR] [COLOR=#FC0]Кт[/COLOR][COLOR=#FC1]о[/COLOR] [COLOR=#FC1]н[/COLOR][COLOR=#FB1]е[/COLOR] [COLOR=#FB1]знает[/COLOR] [COLOR=#FB1]—[/COLOR] [COLOR=#FB1]у[/COLOR][COLOR=#FA2]знает.[/COLOR]<br><br>[IMG align="right" width="150px"]https://i.postimg.cc/wjvfKwYC/Rasul-cocosign-2.png[/IMG][/CENTER]`
        },

        { title: 'Отказы по форме и правилам', isDivider: true },
        { title: `Не указан VK`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br>Ваше обжалование [COLOR=rgb(255, 0, 0)]отклонено[/COLOR], так как не был указан аккаунт VK.<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`) , prefix: PREFIXES.CLOSE, status: false },
        { title: `Жалоба на Администрацию`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Если вы не согласны с выданным наказанием, обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1400/']«Жалобы на Администрацию»[/URL].<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.CLOSE, status: false },
        { title: `Дубликат`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ответ на своё обжалование вы уже получили в предыдущей теме.<br>Напоминаем, при трёх дублированиях форумный аккаунт будет заблокирован.<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.CLOSE, status: false },
        { title: `Технический раздел`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9656-arkhangelsk.2471/']«Жалобы на Технических Специалистов»[/URL].<br><br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.CLOSE, status: false },
        { title: `Ошибка сервера`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Пожалуйста, обратитесь в раздел «Обжалование наказаний» своего сервера.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false },
        { title: `От третьего лица`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение составлено от третьего лица и не подлежит рассмотрению.<br>Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false },
        { title: `Нет скриншота бана`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Для рассмотрения обжалования предоставьте скриншот окна блокировки с сервера.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.CLOSE, status: false },
        { title: `Не по форме`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение составлено не по форме.<br>Создайте новую тему, придерживаясь следующего шаблона:<br>[QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть заявки:<br>5. Доказательство:[/QUOTE]<br>[COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false },
        { title: `Доказательства не приняты`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Доказательства из социальных сетей не принимаются. Вам необходимо загрузить их на сервис [URL='https://imgur.com/']imgur.com[/URL] и создать новую тему.<br><br>Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false },
        { title: `Нет доказательств`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вы не предоставили скриншот выдачи наказания от администратора. Обращение не подлежит рассмотрению.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false },
        { title: `Неработающая ссылка`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Предоставленная вами ссылка недействительна или не работает. Создайте новую тему и убедитесь, что ссылка открывается корректно.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false },
        { title: `Ошибочный раздел`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение не соответствует тематике данного раздела.<br><br>Полезные ссылки:<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1401/']Жалобы на лидеров[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1402/']Жалобы на игроков[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-anapa.1416/']Технический раздел сервера[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1400/']Жалобы на Администрацию[/URL]<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false, },

        { title: 'Отказы по сути', isDivider: true },
        { title: `Не подлежит обжалованию`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>К сожалению, данное наказание не подлежит обжалованию.<br>[COLOR=rgb(255, 0, 0)]Нарушения, по которым заявка не рассматривается:[/COLOR]<br>[QUOTE]4.1. различные формы "слива";<br>4.2. продажа игровой валюты;<br>4.3. махинации;<br>4.4. целенаправленный багоюз;<br>4.5. продажа, передача аккаунта;<br>4.6. сокрытие ошибок, багов системы;<br>4.7. использование стороннего программного обеспечения;<br>4.8. распространение конфиденциальной информации;<br>4.9. обман администрации.[/QUOTE]Рекомендую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/']правилами подачи[/URL] обжалования.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false, },
        { title: `Отказано`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>В обжаловании вашего наказания — [COLOR=red]отказано.[/COLOR] Мы не готовы пойти к вам на встречу.<br><br>Пожалуйста, помните:<br>[QUOTE]• Каждая заявка на обжалование рассматривается индивидуально.<br>• Оформленная заявка не означает гарантированного одобрения со стороны руководства сервера.[/QUOTE]<br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false, },
        { title: `Обжаловалось ранее`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вы уже получили шанс на обжалование своего наказания, срок уже был снижен.<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false, },
        { title: `Наказание выдано верно`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Наказание было выдано верно.<br>В обжаловании вашего наказания — [COLOR=red]отказано.[/COLOR] Мы не готовы пойти к вам на встречу.<br><br>Пожалуйста, помните:<br>[QUOTE]• Каждая заявка на обжалование рассматривается индивидуально.<br>• Оформленная заявка не означает гарантированного одобрения со стороны руководства сервера.[/QUOTE]<br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false, },
        { title: `Минимальное наказание`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Вам уже было выдано минимальное наказание за совершённое нарушение.<br>В обжаловании вашего наказания — [COLOR=red][ICODE]отказано.[/ICODE][/COLOR]`), prefix: PREFIXES.UNACCEPT, status: false, },
        { title: `Обман`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Данное наказание можно обжаловать только при условии выдачи компенсации пострадавшей стороне. Для этого свяжитесь с обманутым игроком и обсудите условия.<br>[U]Примечание:[/U] обманутый игрок должен подтвердить ваши слова в игре.<br>[COLOR=red]Любые попытки обмана администрации будут наказаны блокировкой форумного аккаунта.[/COLOR]<br><br>[COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR]`), prefix: PREFIXES.CLOSE, status: false, },

        { title: 'Одобрения', isDivider: true },
        { title: `Снижено до минимума`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование — [color=lightgreen]одобрено.[/color] Наказание будет снижено до минимальных мер.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.`), prefix: PREFIXES.ACCEPT, status: false, },
        { title: `Полностью снято`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет полностью снято.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`), prefix: PREFIXES.ACCEPT, status: false, },
        { title: `Снижено до 7 дней`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 7 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`), prefix: PREFIXES.ACCEPT, status: false, },
        { title: `Снижено до 15 дней`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 15 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`), prefix: PREFIXES.ACCEPT, status: false, },
        { title: `Снижено до 30 дней`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 30 дней блокировки аккаунта.<br>Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта[/URL], чтобы избежать ошибок в будущем.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`), prefix: PREFIXES.ACCEPT, status: false, },
        { title: `Наказание выдано ошибочно`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше наказание было выдано по ошибке администратора и будет снято.<br>С администратором будет проведена профилактическая беседа. Приношу извинения за доставленные неудобства.<br><br>[COLOR=lightgreen][ICODE]Одобрено.[/ICODE][/COLOR]`), prefix: PREFIXES.ACCEPT, status: false, },

        { title: 'На рассмотрении / Передача', isDivider: true },
        { title: `Обман`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваш аккаунт будет разблокирован для выдачи компенсации пострадавшей стороне. Весь процесс необходимо фиксировать на запись экрана с командой /time. У вас есть 24 часа на ответ после совершения сделки.<br>Напоминаю: попытки передачи имущества на другие аккаунты будут строго наказываться, и вы можете лишиться права на обжалование.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`), prefix: PREFIXES.PIN, status: true, },
        { title: `На рассмотрении`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение находится на рассмотрении администрации сервера.<br>Просим не создавать дубликаты. Ответ будет дан в этой теме, как только это будет возможно. Благодарим за ожидание.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`), prefix: PREFIXES.PIN, status: true, },
        { title: `Нужна ссылка на VK`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение находится на рассмотрении администрации.<br>Пожалуйста, предоставьте ссылку на вашу страницу ВКонтакте.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`), prefix: PREFIXES.PIN, status: true, },
        { title: `Передано Спец. Администрации`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обращение было передано [COLOR=red]Специальной администрации проекта.[/COLOR]<br>Иногда рассмотрение таких обращений занимает больше времени. Настоятельно рекомендуем вам не создавать дубликаты. Ответ будет дан в данной теме, как только это будет возможно.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`), prefix: PREFIXES.SPECADM, status: true, },
        { title: `Передано Руководству`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование было передано [COLOR=yellow]Руководству модерации.[/COLOR]<br>Иногда рассмотрение таких обжалований занимает больше времени, чем 3 дня. Настоятельно рекомендуем вам не создавать дубликаты. Ответ будет дан в данной теме, как только это будет возможно.<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`), prefix: PREFIXES.COMMAND, status: true, },
        { title: `Передано Главному Администратору`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваше обжалование было передано [COLOR=red]Главному администратору.[/COLOR]<br><br>[COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR]`), prefix: PREFIXES.GA, status: true, },
        { title: `Смена никнейма`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Ваш аккаунт будет разблокирован на 24 часа. За это время вам необходимо сменить никнейм. Если вы не выполните это условие, аккаунт будет заблокирован без права на амнистию.<br><br>[COLOR=red][ICODE]На рассмотрении.[/ICODE][/COLOR]`), prefix: PREFIXES.PIN, status: true, },
        { title: `Проверка ППВ`, content: template(`Здравствуйте, [COLOR=#FFD700]{{ user.mention }}[/COLOR].<br><br>Для проверки аккаунта предоставьте следующую информацию:<br>— Город регистрации аккаунта:<br>— Дата регистрации аккаунта:<br>— Сколько донатили на свой аккаунт?<br>— Провайдер интернета при регистрации аккаунта:<br>— Город, в котором проживаете на данный момент:<br><br>[COLOR=orange][ICODE]На рассмотрении.[/ICODE][/COLOR]`), prefix: PREFIXES.PIN, status: true, },
    ];

    const shortcuts = {
        'rps': "[CENTER][IMG]https://i.postimg.cc/5tctzDgF/022-EB1-E9-5-C30-402-A-81-D4-08-C349-A08-FFF.gif[/IMG]\n\n[COLOR=#F40]Зде[/COLOR][COLOR=#F50]сь[/COLOR] [COLOR=#F50]б[/COLOR][COLOR=#F60]ыл[/COLOR] [COLOR=#F60]Т[/COLOR][COLOR=#F70]от[/COLOR] [COLOR=#F70]с[/COLOR][COLOR=#F80]амы[/COLOR][COLOR=#F90]й[/COLOR] [COLOR=#F90]Ра[/COLOR][COLOR=#FA0]сул.[/COLOR] [COLOR=#FB0]Кто[/COLOR] [COLOR=#FC0]зна[/COLOR][COLOR=#FD0]ет[/COLOR] [COLOR=#FD0]-[/COLOR] [COLOR=#FD0]по[/COLOR][COLOR=#FC0]ймёт.[/COLOR] [COLOR=#FC0]Кт[/COLOR][COLOR=#FC1]о[/COLOR] [COLOR=#FC1]н[/COLOR][COLOR=#FB1]е[/COLOR] [COLOR=#FB1]знает—[/COLOR] [COLOR=#FB1]у[/COLOR][COLOR=#FA2]знает.[/COLOR]\n\n[IMG align=\"right\" width=\"150px\"]https://i.postimg.cc/wjvfKwYC/Rasul-cocosign-2.png[/IMG][/CENTER]",
        'ost': "[B][FONT=book antiqua]Оставил[/FONT][/B]",
    };

    // Statistics management
    class ModStats {
        constructor() {
            this.loadStats();
        }

        loadStats() {
            const today = new Date().toDateString();
            const stored = localStorage.getItem('modStats');
            if (stored) {
                const data = JSON.parse(stored);
                if (data.date === today) {
                    this.stats = data.stats;
                } else {
                    this.resetStats();
                }
            } else {
                this.resetStats();
            }
        }

        resetStats() {
            this.stats = { accepted: 0, rejected: 0, pending: 0, total: 0 };
            this.saveStats();
        }

        increment(type) {
            if (this.stats.hasOwnProperty(type)) {
                this.stats[type]++;
                this.stats.total++;
                this.saveStats();
                this.updateDisplay();
            }
        }

        saveStats() {
            const today = new Date().toDateString();
            localStorage.setItem('modStats', JSON.stringify({
                date: today,
                stats: this.stats
            }));
        }

        updateDisplay() {
            const panel = document.getElementById('mod-stats-panel');
            if (panel) {
                panel.innerHTML = `
                    <div class="mod-stats-title">📊 Сегодня</div>
                    <div class="mod-stats-item"><span>✅ Одобрено:</span><span style="color: #10b981">${this.stats.accepted}</span></div>
                    <div class="mod-stats-item"><span>❌ Отказано:</span><span style="color: #ef4444">${this.stats.rejected}</span></div>
                    <div class="mod-stats-item"><span>⏳ На рассм.:</span><span style="color: #f59e0b">${this.stats.pending}</span></div>
                    <div class="mod-stats-item" style="border-top: 2px solid rgba(59, 130, 246, 0.3); padding-top: 8px; margin-top: 8px;"><span><strong>📈 Всего:</strong></span><span><strong>${this.stats.total}</strong></span></div>
                `;
            }
        }

        show() {
            let panel = document.getElementById('mod-stats-panel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'mod-stats-panel';
                panel.className = 'mod-stats';
                document.body.appendChild(panel);
            }
            this.updateDisplay();
            panel.style.display = 'block';
        }

        hide() {
            const panel = document.getElementById('mod-stats-panel');
            if (panel) {
                panel.style.display = 'none';
            }
        }
    }

    const modStats = new ModStats();

    // Thread timer
    function getThreadAge() {
        const timeElement = document.querySelector('.message-attribution-main time');
        if (timeElement) {
            const threadDate = new Date(timeElement.getAttribute('datetime'));
            const now = new Date();
            const diff = now - threadDate;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);

            if (days > 0) return `${days}д ${hours % 24}ч`;
            return `${hours}ч`;
        }
        return 'N/A';
    }

    // Create decorative elements
    function createDecorativeElements() {
        const topLeft = document.createElement('div');
        topLeft.className = 'decorative-corner top-left';
        document.body.appendChild(topLeft);

        const bottomRight = document.createElement('div');
        bottomRight.className = 'decorative-corner bottom-right';
        document.body.appendChild(bottomRight);

        // Create floating particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            document.body.appendChild(particle);
        }
    }

    $(document).ready(() => {
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Create decorative elements
        createDecorativeElements();

        // Add thread timer
        const titleElement = $('.p-title-value');
        if (titleElement.length) {
            const age = getThreadAge();
            titleElement.append(`<span class="thread-timer">⏱ ${age}</span>`);
        }

        // Buttons
        addButton(`Ответы`, `selectAnswer`);
        addButton(`Закрепить`, `pin`);
        addButton(`Одобрить`, `accepted`);
        addButton(`Отказать`, `unaccept`);
        addButton(`КП`, `teamProject`);
        addButton(`Закрыть`, `closed`);
        addButton(`Спец.А`, `specialAdmin`);
        addButton(`Проверено`, `checked`);
        addButton(`Превью`, `preview`);
        addButton(`📊`, `toggleStats`);

        // Event listeners
        $(`#unaccept`).on('click', () => { editThreadData(PREFIXES.UNACCEPT, false); modStats.increment('rejected'); });
        $(`#pin`).on('click', () => { editThreadData(PREFIXES.PIN, true); modStats.increment('pending'); });
        $(`#accepted`).on('click', () => { editThreadData(PREFIXES.ACCEPT, false); modStats.increment('accepted'); });
        $(`#teamProject`).on('click', () => { editThreadData(PREFIXES.COMMAND, true); modStats.increment('pending'); });
        $(`#specialAdmin`).on('click', () => { editThreadData(PREFIXES.SPECADM, true); modStats.increment('pending'); });
        $(`#checked`).on('click', () => editThreadData(PREFIXES.CHECKED, false));
        $(`#closed`).on('click', () => editThreadData(PREFIXES.CLOSE, false));

        $('#toggleStats').on('click', () => {
            const panel = document.getElementById('mod-stats-panel');
            if (panel && panel.style.display !== 'none') {
                modStats.hide();
            } else {
                modStats.show();
            }
        });

        $('#preview').on('click', () => {
            const editorElement = $(`.fr-element.fr-view`);
            const content = editorElement.html();

            XF.alert(`
                <div class="preview-panel">
                    <div class="preview-title">👁️ Предпросмотр сообщения</div>
                    ${content}
                </div>
            `, null, 'Предпросмотр');
        });

        $(`#selectAnswer`).on('click', async () => {
            try {
                const data = await getThreadData();
                XF.alert(buttonsMarkup(buttons), null, `Выберите готовый ответ:`, `select_answer_container`);
                buttons.forEach((btn, id) => {
                    if (btn.isDivider) return;
                    $(`button#answers-${id}`).on('click', () => {
                        pasteContent(id, data, true);
                        $(`a.overlay-titleCloser`).trigger(`click`);

                        // Update statistics based on button type
                        if (btn.prefix === PREFIXES.ACCEPT) modStats.increment('accepted');
                        else if (btn.prefix === PREFIXES.UNACCEPT || btn.prefix === PREFIXES.CLOSE) modStats.increment('rejected');
                        else if (btn.status === true) modStats.increment('pending');
                    });
                });
            } catch (error) {
                console.error("Error getting thread data:", error);
                showNotification('Произошла ошибка при получении данных темы.', 'error');
            }
        });

        // Keyboard shortcuts
        $(document).on('keydown', (e) => {
            // Ctrl+1 = Accept
            if (e.ctrlKey && e.key === '1') {
                e.preventDefault();
                editThreadData(PREFIXES.ACCEPT, false);
                modStats.increment('accepted');
            }
            // Ctrl+2 = Reject
            if (e.ctrlKey && e.key === '2') {
                e.preventDefault();
                editThreadData(PREFIXES.UNACCEPT, false);
                modStats.increment('rejected');
            }
            // Ctrl+3 = Pin
            if (e.ctrlKey && e.key === '3') {
                e.preventDefault();
                editThreadData(PREFIXES.PIN, true);
                modStats.increment('pending');
            }

            // Text shortcuts
            if (e.key === 'rps' || e.key === 'ost') {
                e.preventDefault();
                const editorElement = $(`.fr-element.fr-view`);
                const contentToPaste = shortcuts[e.key];
                if (editorElement.length && contentToPaste) {
                    editorElement.html(contentToPaste);
                }
            }
        });

        // Show stats on load
        modStats.show();
    });

    /**
     * Adds a new button to the page.
     */
    function addButton(name, id) {
        $(`.button--icon--reply`).before(`<button type="button" class="button rippleButton persona-btn" id="${id}">${name}</button>`);
    }

    /**
     * Creates the HTML markup for the button selection menu.
     */
    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons.map((btn, i) =>
            btn.isDivider ? `<div class="persona-answer-divider">${btn.title}</div>` : `<button id="answers-${i}" class="persona-answer-btn"><span class="button-text">${btn.title}</span></button>`
        ).join('')}</div>`;
    }

    /**
     * Pastes the content of the selected button into the text editor.
     */
    function pasteContent(id, data = {}, send = false) {
        const button = buttons[id];
        if (!button || !button.content) {
            console.error("Button content not found.");
            return;
        }

        if (typeof Handlebars === 'undefined') {
            console.warn("Handlebars.js not loaded yet. Retrying...");
            setTimeout(() => pasteContent(id, data, send), 100);
            return;
        }

        try {
            const template = Handlebars.compile(button.content);
            const editorElement = $(`.fr-element.fr-view`);
            editorElement.html(template(data));

            if (send) {
                if (button.prefix) {
                    editThreadData(button.prefix, button.status);
                }
                setTimeout(() => {
                    $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
                }, 250);
            }
        } catch (error) {
            console.error("Error pasting content:", error);
            showNotification('Произошла ошибка при вставке контента.', 'error');
        }
    }

    /**
     * Fetches the thread and user data.
     */
    async function getThreadData() {
        const authorLink = $(`a.username`).first();
        if (authorLink.length === 0) {
            throw new Error("Author link not found.");
        }
        const authorID = authorLink.attr(`data-user-id`);
        const authorName = authorLink.text().trim();
        const hours = new Date().getHours();
        const greeting = hours >= 5 && hours <= 11 ? `Доброе утро`
                                     : hours >= 12 && hours <= 17 ? `Добрый день`
                                     : hours >= 18 && hours <= 22 ? `Добрый вечер`
                                     : `Доброй ночи`;
        return { user: { id: authorID, name: authorName, mention: `[USER=${authorID}]${authorName}[/USER]` }, greeting };
    }

    /**
     * Changes the thread prefix and sticky status.
     */
    function editThreadData(prefix, pin = false) {
        const threadTitleElement = $(`.p-title-value`);
        const threadTitle = threadTitleElement.length > 0 ? threadTitleElement[0].lastChild.textContent.trim() : null;

        if (!threadTitle) {
            showNotification('Название темы не найдено.', 'error');
            return;
        }

        const bodyData = {
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: `json`,
        };
        if (pin) {
            bodyData.sticky = 1;
        }

        fetch(`${document.URL}edit`, { method: `POST`, body: getFormData(bodyData) })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'ok') {
                    showNotification('Статус темы успешно изменен!', 'success');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    showNotification('Произошла ошибка при изменении темы.', 'error');
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                showNotification('Сетевая ошибка или ошибка API.', 'error');
            });
    }

    /**
     * Converts a data object into a FormData object.
     */
    function getFormData(data) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        return formData;
    }

    /**
     * Displays a notification message on the screen.
     */
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
})();