/*
Created by anonimbiri
*/

var MalayalaKit = (function () {
    const usedClasses = new Set();

    const generateRandomClass = (toLowerCase) => {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const length = Math.floor(Math.random() * 6) + 5;

        let newClass;
        do {
            newClass = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (usedClasses.has(toLowerCase ? newClass.toLowerCase() : newClass));

        usedClasses.add(toLowerCase ? newClass.toLowerCase() : newClass);

        return toLowerCase ? newClass.toLowerCase() : newClass;
    };

    const classList = Object.fromEntries(
        ['menu-list', 'menu-container', 'border', 'tabs-container', 'tab', 'active', 'tab-underline', 'content-container', 'row', 'label', 'button', 'white-border', 'switch-container', 'switch-label', 'inner-circle', 'input', 'menu-title', 'close-button', 'slider-container', 'color', 'color-picker-container', 'color-picker-element', 'circular-area', 'toast-container', 'position', 'top', 'bottom', 'left', 'right', 'center', 'toast', 'info', 'warning', 'error', 'progress'].map(key =>
            [key, key === 'position' ? generateRandomClass(true) : generateRandomClass(false)]
        )
    );

    var cssStyles = `
        .${classList['menu-list']} {
            font-family: Arial, sans-serif;
            align-items: center;
            justify-content: center;
            overflow: hidden auto;
            -webkit-backdrop-filter: blur(2px);
            backdrop-filter: blur(2px);
            position: fixed;
            inset: 0;
            z-index: 1000;
            overflow: auto;
            outline: 0;
            -webkit-overflow-scrolling: touch;
            overflow: hidden;
            user-select: none;
        }

        .${classList['menu-container']} {
            background-color: #121212;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            width: 300px;
            display: flex;
            flex-direction: column;
            position: fixed;
        }

        @keyframes borderAnimation {
            0%{background-position:0% 50%}
            50%{background-position:100% 50%}
            100%{background-position:0% 50%}
        }

        .${classList['border']} {
            background: linear-gradient(268deg, #ff3939, #eeff30, #37ff30, #30ffd6, #ff30f4);
            background-size: 1000% 1000%;
            animation: borderAnimation 30s ease infinite;
            width: calc(101%);
            height: calc(1%);
        }

        .${classList['tabs-container']} {
            display: flex;
            background: linear-gradient(to bottom, #222222, #111111);
            color: #fff;
            cursor: grab;
            padding: 0 24px;
            position: relative;
            background-color: rgba(0,0,0,0.4);
            border-bottom: 1px solid rgba(250, 250, 250, 0.12);
        }

        .${classList['tab']} {
            cursor: pointer;
            padding: 10px;
            margin-right: 10px;
            position: relative;
            transition: background 0.2s;
        }

        .${classList['tab']}:hover {
            color: #ffffff!important;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 5px;
        }

        .${classList['tab-underline']} {
            height: 2px;
            position: absolute;
            background: #eeeeee;
            pointer-events: none;
            bottom: 0;
            box-sizing: border-box;
            display: block;
            white-space: nowrap;
            transition: width 0.3s, left 0.3s, right 0.3s;
        }

        .${classList['tab']}.${classList['active']} .${classList['tab-underline']} {
            transform: scaleX(1);
        }

        .${classList['content-container']} {
            margin: 20px;
            overflow: auto;
            scrollbar-width: thin;
            scrollbar-color: #6b6b6b #f1f1f1;
            padding-right: calc(10px + 5px);
            padding-bottom: 0.9vw;
        }
        
        .${classList['content-container']}::-webkit-scrollbar {
            width: 12px;
            cursor: pointer;
            width: 4px;
            height: 4px;
            background-color: transparent;
        }
        
        .${classList['content-container']}::-webkit-scrollbar-corner {
            display: none;
            width: 0;
            height: 0;
        }
        
        .${classList['content-container']}::-webkit-scrollbar-thumb {
            cursor: pointer;
            background-color: transparent;
            border-radius: 2px;
            transition: background-color 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        
        .${classList['content-container']}:hover::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.16);
        }
        
        .${classList['content-container']}::-webkit-scrollbar-thumb:hover {
            background-color: rgb(255, 255, 255);
        }

        .${classList['row']} {
            align-items: center;
            display: flex;
            padding-left: 10px;
            padding-right: 10px;
            padding-top: 20px;
            justify-content: space-between;
        }

        .${classList['row']} .${classList['label']} {
            display: inline-block;
            color: white;
        }

        .${classList['button']} {
            height: 30px;
            border-radius: 5px;
            color: #fff;
            text-align: center;
            display: inline-block;
            background-color: #111111;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
            position: relative;
            z-index: 0;
        }

        .${classList['button']}:hover {
            background-color: rgba(255, 255, 255, 0.10);
        }

        /*.rgb-style:after { 
            content: '';
            position: absolute;
            background: #111111;
        }*/

        .${classList['white-border']}:before {
            content: '';
            border: 1px solid white;
            border-radius: 5px;
            position: absolute;
            top: -0.9px;
            left: -1.6px;
            z-index: -1;
            width: calc(100% + 1px);
            height: calc(100% + 1px);
        }
        
        /*.rgb-style:before {
            content: '';
            background: linear-gradient(268deg, #ff3939, #eeff30, #37ff30, #30ffd6, #ff30f4);
            position: absolute;
            top: -0.2px;
            left: 0px;
            z-index: -1;
            filter: blur(10px);
            width: calc(100% + 1px);
            height: calc(100% + 1px);
            background-size: 1000% 1000%;
            animation: borderAnimation 30s ease infinite;
            border-radius: 5px;
        }*/

        .${classList['switch-container']} {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .${classList['switch-container']} input {
            display: none;
        }

        .${classList['switch-container']} input + .${classList['switch-label']} {
            transition: background-color 0.2s;
        }

        .${classList['switch-container']} input:checked + .${classList['switch-label']} {
            background: #fff;
        }    

        .${classList['switch-container']} input:checked + .${classList['switch-label']} .${classList['inner-circle']} {
            transform: translateX(20px);
        }

        .${classList['switch-label']} {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            background: #555555;
            border-radius: 100px;
            cursor: pointer;
        }

        .${classList['switch-label']} .${classList['inner-circle']} {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: rgb(17, 17, 17);
            border-radius: 50%;
            transition: transform 0.2s;
        }

        .${classList['input']} {
            position: relative;
            display: inline-flex;
            width: 40%;
            min-width: 0;
            padding: 6px 11px;
            color: #ffffff;
            font-size: 14px;
            line-height: 1.5714285714285714;
            background-color: #111111;
            background-image: none;
            border-width: 1px;
            border-style: solid;
            border-color: #333333;
            border-radius: 5px;
            transition: all 0.2s;
        }

        .${classList['input']}:hover {
            border-color: #eeeeee;
            box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.01);
            outline: 0;
        }

        .${classList['input']}:focus {
            border-color: #eeeeee;
            box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.01);
            outline: 0;
        }

        .${classList['menu-title']} {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #121212;
            color: #fff;
            cursor: grab;
        }

        .${classList['menu-title']} img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
        }

        .${classList['menu-title']} a {
            text-align: center;
            font-size: unset;
            font-weight: unset;
            font-family: revert;
            color: #fff;
            background-color: transparent;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
        }

        .${classList['close-button']} {
            cursor: pointer;
            border: none;
            margin-right: 10px;
            position: relative;
            height: 30px;
            width: 30px;
            border-radius: 8px;
            background: transparent;
            align-items: center;
            transition: background 0.2s;
        }

        .${classList['close-button']}:hover {
            background-color: rgba(255, 255, 255, 0.10);
        }

        .${classList['close-button']} svg {
            width: 100%;
            height: 100%;
        }

        .${classList['slider-container']} {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            margin: 10px 0;
        }
        
        .${classList['slider-container']} .${classList['input']} {
            width: 15%;
        }
        
        .${classList['slider-container']} input[type="range"] {
            width: 50%;
            -webkit-appearance: none;
            appearance: none;
            height: 5px;
            border-radius: 8px;
            outline: none;
            -webkit-transition: opacity 0.2s;
            transition: opacity 0.2s;
            cursor: pointer;
            margin-right: 10px;
        }
        
        .${classList['slider-container']} input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 8px;
            height: 16px;
            border-radius: 2px;
            background: #fff;
            cursor: pointer;
        }
        
        .${classList['slider-container']} input[type="range"]::-moz-range-thumb {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
        }

        .${classList['slider-container']} input[type="range"]::-webkit-slider-thumb:hover,
        .${classList['slider-container']} input[type="range"]::-moz-range-thumb:hover {
            background: #ff0000;
        }

        .${classList['color']} {
            display: none;
        }

        .${classList['color-picker-container']} {
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }

        .${classList['color-picker-container']} .${classList['input']} {
            width: 30%;
        }
        
        .${classList['color-picker-element']},
        .${classList['circular-area']} {
            margin-right: 10px;
        }
        
        .${classList['circular-area']} {
            transition: all 0.2s;
            border-radius: 50%;
            cursor: pointer;
            width: 25px;
            height: 25px;
            background-color: transparent;
        }
        
        .${classList['circular-area']}:hover {
            box-shadow: 0 0 0 2px #ffffff;
        }

        .${classList['toast-container']} {
            position: fixed;
            overflow: hidden;
            z-index: 1000;
        }

        .${classList['toast-container']}[data-${classList['position']}^="${classList['top']}-"] {
            top: 20px;
        }

        .${classList['toast-container']}[data-${classList['position']}^="${classList['bottom']}-"] {
            bottom: 20px;
        }

        .${classList['toast-container']}[data-${classList['position']}$="-${classList['left']}"] {
            left: 20px;
        }

        .${classList['toast-container']}[data-${classList['position']}$="-${classList['right']}"] {
            right: 20px;
        }

        .${classList['toast-container']}[data-${classList['position']}$="-${classList['center']}"] {
            left: 50%;
            transform: translateX(-50%);
        }
        
        .${classList['toast']} {
            position: relative;
            background: #111111;
            color: #fff;
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            font-weight: bold;
            font-family: monospace;
            pointer-events: auto;
            display: flex;
            align-items: center;
            overflow: hidden;
            user-select: none;
            justify-content: space-between;
            transition: opacity 0.3s ease-in-out;
        }

        .${classList['toast']}.${classList['info']} {
            background: #002126;
            color: rgb(138, 232, 255);
        }

        .${classList['toast']}.${classList['warning']} {
            background: #271a00;
            color: rgb(255, 203, 71);
        }

        .${classList['toast']}.${classList['error']} {
            background: #34001d;
            color: rgb(240, 79, 136);
        }

        .${classList['toast']}.${classList['info']} .${classList['close-button']} svg {
            stroke: rgb(138, 232, 255);
        }

        .${classList['toast']}.${classList['warning']} .${classList['close-button']} svg {
            stroke: rgb(255, 203, 71);
        }

        .${classList['toast']}.${classList['error']} .${classList['close-button']} svg {
            stroke: rgb(240, 79, 136);
        }

        .${classList['toast']} .${classList['close-button']} {
            margin-right: 0px;
            margin-left: 10px;
        }

        .${classList['toast-container']}[data-${classList['position']}="${classList['top']}-${classList['left']}"] .${classList['toast']},
        .${classList['toast-container']}[data-${classList['position']}="${classList['bottom']}-${classList['left']}"] .${classList['toast']} {
            animation: slideInLeft 0.3s ease-in-out;
        }

        .${classList['toast-container']}[data-${classList['position']}="${classList['top']}-${classList['center']}"] .${classList['toast']} {
            animation: slideInTopCenter 0.3s ease-in-out;
        }

        .${classList['toast-container']}[data-${classList['position']}="${classList['top']}-${classList['right']}"] .${classList['toast']}, 
        .${classList['toast-container']}[data-${classList['position']}="${classList['bottom']}-${classList['right']}"] .${classList['toast']} {
            animation: slideInRight 0.3s ease-in-out;
        }

        .${classList['toast-container']}[data-${classList['position']}="${classList['bottom']}-${classList['center']}"] .${classList['toast']} {
            animation: slideInBottomCenter 0.3s ease-in-out;
        }

        .${classList['toast']}.${classList['progress']}::before {
            content: "";
            position: absolute;
            height: 2px;
            width: calc(100%* var(--progress));
            background-color: #fff;
            bottom: 0;
            left: 0;
            right: 0;
            margin-right: auto;
        }

        .${classList['toast']}.${classList['info']}.${classList['progress']}::before {
            background-color: rgb(138, 232, 255);
        }

        .${classList['toast']}.${classList['warning']}.${classList['progress']}::before {
            background-color: rgb(255, 203, 71);
        }

        .${classList['toast']}.${classList['error']}.${classList['progress']}::before {
            background-color: rgb(240, 79, 136);
        }

        @keyframes slideInRight {
            from {
                transform: translateX(200%);
            }
            to {
                transform: translateX(0);
            }
        }

        @keyframes slideInLeft {
            from {
                transform: translateX(-200%);
            }
            to {
                transform: translateX(0);
            }
        }

        @keyframes slideInTopCenter {
            from {
                transform: translateY(-200%);
            }
            to {
                transform: translateY(0);
            }
        }

        @keyframes slideInBottomCenter {
            from {
                transform: translateY(200%);
            }
            to {
                transform: translateY(0);
            }
        }
    `;

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssStyles;
    document.head.appendChild(style);

    var menuList = document.createElement('div');
    menuList.className = classList['menu-list'];
    document.body.appendChild(menuList);

    var translations = {
        'en': {
            'pressKey': 'Press a key...',
            'setHotkey': 'Set Hotkey'
        },
        'tr': {
            'pressKey': 'Bir tuşa basın...',
            'setHotkey': 'Kısayol Ayarla'
        },
        'ml': {
            'pressKey': 'ഒരു കീ അമർത്തുക...',
            'setHotkey': 'ഹോട്ട്കീ സജ്ജീകരിക്കുക'
        },
        'ta': {
            'pressKey': 'ஒரு விசில் அழுத்தவும்...',
            'setHotkey': 'ஹாட்கீ அமைக்கவும்'
        },
        'hi': {
            'pressKey': 'एक कुंजी दबाएं...',
            'setHotkey': 'हॉटकी सेट करें'
        },
        'ko': {
            'pressKey': '키를 누르세요...',
            'setHotkey': '단축키 설정'
        },
        'ja': {
            'pressKey': 'キーを押してください...',
            'setHotkey': 'ホットキーを設定'
        },
        'it': {
            'pressKey': 'Premi un tasto...',
            'setHotkey': 'Imposta Hotkey'
        },
        'ar': {
            'pressKey': 'اضغط على مفتاح...',
            'setHotkey': 'تعيين مفتاح الاختصار'
        },
        'fr': {
            'pressKey': 'Appuyez sur une touche...',
            'setHotkey': 'Définir le raccourci'
        },
    };

    var selectedLanguage = navigator.language.split('-')[0];

    function translate(key) {
        return translations[selectedLanguage][key] || key;
    }

    function setLanguage(lang) {
        if (translations[lang]) {
            selectedLanguage = lang;
        } else {
            console.error('Translation not available for the selected language.');
        }
    }

    function CreateMenu(options) {
        this.title = options.title;
        this.icon = options.icon;
        this.isOpen = true;
        this.tabs = [];

        this.render = function () {
            var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            this.container = document.createElement('div');
            this.container.className = classList['menu-container'];
            this.container.style.width = (options.size && options.size.width) ? options.size.width + 'px' : '500px';
            this.container.style.height = (options.size && options.size.height) ? options.size.height + 'px' : '400px';
            this.container.style.top = (options.position && options.position.top) ? options.position.top + 'px' : (windowHeight / 2 - this.container.clientHeight / 2) + 'px';
            this.container.style.left = (options.position && options.position.left) ? options.position.left + 'px' : (windowWidth / 2 - this.container.clientWidth / 2) + 'px';

            this.border = document.createElement('div');
            this.border.className = classList['border'];

            this.tabsContainer = document.createElement('div');
            this.tabsContainer.className = classList['tabs-container'];
            this.tabsContainer.style.cursor = 'grab';

            this.underline = document.createElement('div');
            this.underline.className = classList['tab-underline'];

            this.contentContainer = document.createElement('div');
            this.contentContainer.className = classList['content-container'];

            this.menuTitleContainer = document.createElement('div');
            this.menuTitleContainer.className = classList['menu-title'];
            this.menuIcon = document.createElement('img');
            this.menuIcon.setAttribute('src', this.icon);

            this.menuIcon.addEventListener('error', function () {
                this.menuIcon.setAttribute('src', 'data:image/png;base64,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');
            }.bind(this));

            this.menuTitleContainer.appendChild(this.menuIcon);

            this.menuTitle = document.createElement("a");
            this.menuTitle.textContent = this.title || 'MalayalaKit';
            this.menuTitleContainer.appendChild(this.menuTitle);

            this.menuTitleContainer.addEventListener('mousedown', function (e) {
                isDragging = true;
                offsetX = e.clientX - this.container.offsetLeft;
                offsetY = e.clientY - this.container.offsetTop;
                this.menuTitleContainer.style.cursor = 'grabbing';
            }.bind(this));

            this.menuTitleContainer.addEventListener('mouseup', function () {
                isDragging = false;
                this.menuTitleContainer.style.cursor = 'grab';
            }.bind(this));

            this.closeButton = document.createElement('button');
            this.closeButton.className = classList['close-button'];
            var closeIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="white" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        `;

            this.closeButton.innerHTML = closeIconSvg;
            this.closeButton.addEventListener('click', function () {
                this.toggleMenu();
            }.bind(this));

            this.menuTitleContainer.appendChild(this.closeButton);
            this.container.appendChild(this.border);
            this.container.appendChild(this.menuTitleContainer);
            this.tabsContainer.appendChild(this.underline);
            this.container.appendChild(this.tabsContainer);
            this.container.appendChild(this.contentContainer);

            menuList.appendChild(this.container);

            var isDragging = false;
            var offsetX, offsetY;

            this.tabsContainer.addEventListener('mousedown', function (e) {
                isDragging = true;
                offsetX = e.clientX - this.container.offsetLeft;
                offsetY = e.clientY - this.container.offsetTop;
                this.tabsContainer.style.cursor = 'grabbing';
            }.bind(this));

            document.addEventListener('mousemove', function (e) {
                if (isDragging) {
                    this.container.style.left = e.clientX - offsetX + 'px';
                    this.container.style.top = e.clientY - offsetY + 'px';
                }
            }.bind(this));

            document.addEventListener('mouseup', function () {
                isDragging = false;
                this.tabsContainer.style.cursor = 'grab';
            }.bind(this));

            document.addEventListener('keydown', function (event) {
                if (isHotkeyPressed(options.hotkey, event)) {
                    this.toggleMenu();
                }
            }.bind(this));

            //this.tabsContainer.innerHTML = '';
            this.tabs.forEach(function (tab, index) {
                var tabElement = document.createElement('div');
                tabElement.className = classList['tab'];
                tabElement.textContent = tab.label;

                tabElement.addEventListener('click', function () {
                    this.contentContainer.innerHTML = '';
                    tab.renderContent(this.contentContainer);
                    const containerRect = this.tabsContainer.getBoundingClientRect();
                    const tabElementRect = tabElement.getBoundingClientRect();
                    this.underline.style.width = tabElementRect.width + 'px';
                    this.underline.style.left = tabElementRect.left - containerRect.left + 'px';
                }.bind(this));

                this.tabsContainer.insertBefore(tabElement, this.underline);

                if (index === 0) {
                    tabElement.click();
                }

            }.bind(this));
        }

        function toggleMenuVisibility(isOpen) {
            menuList.style.display = isOpen ? 'none' : 'flex';

            if (options.pointerLock) {
                const pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;

                if (pointerLockElement || !isOpen) {
                    document.exitPointerLock?.();
                } else {
                    document.body.requestPointerLock?.();
                }
            }
        }

        this.toggleMenu = function () {
            this.isOpen = !this.isOpen;
            toggleMenuVisibility(this.isOpen);
        };

        this.hideMenu = function () {
            this.isOpen = false;
            toggleMenuVisibility(false);
        };

        this.showMenu = function () {
            this.isOpen = true;
            toggleMenuVisibility(true);
        };


        function isHotkeyPressed(hotkey, event) {
            return event.keyCode === hotkey.keyCode && event.ctrlKey === hotkey.ctrlKey && event.altKey === hotkey.altKey && event.shiftKey === hotkey.shiftKey;
        }

        this.addTab = function (tab) {
            this.tabs.push(tab);
        };
    }

    function Tab(label) {
        this.label = label;
        this.content = [];

        this.addButton = function (button) {
            this.content.push({ type: 'button', data: button });
        };

        this.addSwitch = function (switchButton) {
            this.content.push({ type: 'switch', data: switchButton });
        };

        this.addInput = function (input) {
            this.content.push({ type: 'input', data: input });
        };

        this.addHotkey = function (hotkey) {
            this.content.push({ type: 'hotkey', data: hotkey });
        };

        this.addSlider = function (hotkey) {
            this.content.push({ type: 'slider', data: hotkey });
        };

        this.addColorPicker = function (hotkey) {
            this.content.push({ type: 'colorPicker', data: hotkey });
        };

        this.renderContent = function (container) {
            this.content.forEach(function (item) {
                var row = document.createElement('div');
                row.className = classList['row'];

                var textElement = document.createElement('span');
                textElement.className = classList['label'];
                textElement.textContent = item.data.label || '';
                row.appendChild(textElement);

                switch (item.type) {
                    case 'button':
                        var buttonElement = document.createElement('button');
                        buttonElement.textContent = item.data.buttonLabel || '';
                        buttonElement.className = classList['button'];
                        if (item.data.style === "border") {
                            buttonElement.classList.add(classList['white-border']);
                        } else if (item.data.style === "rgb") {
                            buttonElement.classList.add('rgb-style');
                        }
                        buttonElement.addEventListener('click', function () {
                            if (item.data.onclick) {
                                item.data.onclick();
                            }
                        });
                        row.appendChild(buttonElement);
                        break;

                    case 'switch':
                        var switchContainer = document.createElement('div');
                        switchContainer.className = classList['switch-container'];

                        var switchElement = document.createElement('input');
                        switchElement.type = 'checkbox';
                        switchElement.checked = item.data.value || false;
                        switchElement.addEventListener('change', function () {
                            item.data.value = switchElement.checked;
                            if (item.data.onchange) {
                                item.data.onchange(switchElement.checked);
                            }
                        });

                        var switchLabel = document.createElement('label');
                        switchLabel.className = classList['switch-label'];

                        var innerCircle = document.createElement('div');
                        innerCircle.className = classList['inner-circle'];

                        switchLabel.addEventListener('click', function () {
                            switchElement.checked = !switchElement.checked;
                            item.data.value = switchElement.checked;
                            if (item.data.onchange) {
                                item.data.onchange(switchElement.checked);
                            }
                        });

                        switchLabel.appendChild(innerCircle);
                        switchContainer.appendChild(switchElement);
                        switchContainer.appendChild(switchLabel);
                        row.appendChild(switchContainer);
                        break;

                    case 'input':
                        var inputElement = document.createElement('input');
                        inputElement.className = classList['input'];
                        inputElement.placeholder = item.data.placeholder || '';
                        inputElement.type = item.data.type || 'text';
                        inputElement.value = item.data.type === 'number' ? (item.data.value || 0) : (item.data.value || '');

                        if (item.data.onchange) {
                            inputElement.addEventListener('change', function () {
                                item.data.value = inputElement.value;
                                item.data.onchange(inputElement.value);
                            });
                        }

                        row.appendChild(inputElement);
                        break;

                    case 'hotkey':
                        var buttonElement = document.createElement('button');
                        buttonElement.className = classList['button'];
                        buttonElement.textContent = item.data.value ? formatHotkey(item.data.value) : translate('setHotkey');

                        if (item.data.style === "border") {
                            buttonElement.classList.add(classList['white-border']);
                        } else if (item.data.style === "rgb") {
                            buttonElement.classList.add('rgb-style');
                        }

                        buttonElement.addEventListener('click', function () {
                            buttonElement.textContent = translate('pressKey');
                            document.addEventListener('keyup', function (event) {
                                event.preventDefault();
                                if (document.activeElement.value !== undefined && document.activeElement !== buttonElement) return;
                                item.data.value = event;
                                buttonElement.textContent = formatHotkey(event);
                                if (item.data.onlistener) {
                                    item.data.onlistener(event);
                                }
                                document.removeEventListener('keyup', arguments.callee);
                            });
                        });

                        row.appendChild(buttonElement);
                        break;

                    case 'slider':
                        var sliderContainer = document.createElement('div');
                        sliderContainer.className = classList['slider-container'];

                        var sliderElement = document.createElement('input');
                        sliderElement.type = 'range';
                        sliderElement.min = item.data.min || 0;
                        sliderElement.max = item.data.max || 100;
                        sliderElement.value = item.data.value || 0;
                        sliderElement.style.background = 'linear-gradient(to right, #fff ' + sliderElement.value + '%, rgba(255, 255, 255, 0.10) ' + sliderElement.value + '%, rgba(255, 255, 255, 0.10) 100%)';

                        var valueElement = document.createElement('input');
                        valueElement.type = 'number';
                        valueElement.className = classList['input'];
                        valueElement.min = item.data.min || 0;
                        valueElement.max = item.data.max || 100;
                        valueElement.value = item.data.value || 0;

                        sliderElement.addEventListener('input', function () {
                            item.data.value = sliderElement.value;
                            valueElement.value = sliderElement.value;
                            sliderElement.style.background = 'linear-gradient(to right, #fff ' + sliderElement.value + '%, rgba(255, 255, 255, 0.10) ' + sliderElement.value + '%, rgba(255, 255, 255, 0.10) 100%)';
                        });

                        sliderElement.addEventListener('change', function () {
                            if (item.data.onchange) {
                                item.data.onchange(sliderElement.value);
                            }
                        });

                        valueElement.addEventListener('input', function () {
                            sliderElement.value = valueElement.value;
                            sliderElement.style.background = 'linear-gradient(to right, #fff ' + sliderElement.value + '%, rgba(255, 255, 255, 0.10) ' + sliderElement.value + '%, rgba(255, 255, 255, 0.10) 100%)';
                        });

                        valueElement.addEventListener('change', function () {
                            if (parseFloat(valueElement.value) < parseFloat(sliderElement.min) || parseFloat(valueElement.value) > parseFloat(sliderElement.max)) {
                                valueElement.value = item.data.value;
                                sliderElement.value = item.data.value;
                                sliderElement.style.background = 'linear-gradient(to right, #fff ' + item.data.value + '%, rgba(255, 255, 255, 0.10) ' + item.data.value + '%, rgba(255, 255, 255, 0.10) 100%)';
                            } else if (!valueElement.value) {
                                valueElement.value = sliderElement.min;
                                sliderElement.value = sliderElement.min;
                                sliderElement.style.background = 'linear-gradient(to right, #fff ' + sliderElement.min + '%, rgba(255, 255, 255, 0.10) ' + sliderElement.min + '%, rgba(255, 255, 255, 0.10) 100%)';
                            } else {
                                item.data.value = valueElement.value;
                            }
                            if (item.data.onchange) {
                                item.data.onchange(valueElement.value);
                            }
                        });

                        sliderContainer.appendChild(sliderElement);
                        sliderContainer.appendChild(valueElement);
                        row.appendChild(sliderContainer);
                        break;

                    case 'colorPicker':
                        var colorPickerContainer = document.createElement('div');
                        colorPickerContainer.className = classList['color-picker-container'];

                        var colorPickerElement = document.createElement('input');
                        colorPickerElement.type = 'color';
                        colorPickerElement.className = classList['color'];
                        colorPickerElement.value = item.data.value || '#000000';

                        var colorCodeElement = document.createElement('input');
                        colorCodeElement.type = 'text';
                        colorCodeElement.className = classList['input'];
                        colorCodeElement.value = item.data.value || '#000000';

                        var circularArea = document.createElement('div');
                        circularArea.className = classList['circular-area'];
                        circularArea.style.backgroundColor = colorPickerElement.value;

                        colorPickerElement.addEventListener('input', function () {
                            item.data.value = colorPickerElement.value;
                            colorCodeElement.value = colorPickerElement.value;
                            circularArea.style.backgroundColor = colorPickerElement.value;
                        });

                        colorPickerElement.addEventListener('change', function () {
                            if (item.data.onchange) {
                                item.data.onchange(colorPickerElement.value);
                            }
                        });

                        colorCodeElement.addEventListener('input', function () {
                            item.data.value = colorCodeElement.value;
                            colorPickerElement.value = colorCodeElement.value;
                            circularArea.style.backgroundColor = colorCodeElement.value;
                        });

                        colorCodeElement.addEventListener('change', function () {
                            if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(colorPickerElement.value)) colorCodeElement.value =
                                colorPickerElement.value;
                            if (item.data.onchange) {
                                item.data.onchange(colorCodeElement.value);
                            }
                        });

                        circularArea.addEventListener('click', function () {
                            colorPickerElement.click();
                        });

                        colorPickerContainer.appendChild(colorPickerElement);
                        colorPickerContainer.appendChild(circularArea);
                        colorPickerContainer.appendChild(colorCodeElement);
                        row.appendChild(colorPickerContainer);
                        break;

                    default:
                        break;
                }

                container.appendChild(row);
            });
        };

        function formatHotkey(event) {
            var modifiers = [];
            if (event.ctrlKey) modifiers.push('Ctrl');
            if (event.altKey) modifiers.push('Alt');
            if (event.shiftKey) modifiers.push('Shift');
            var key = event.key || String.fromCharCode(event.keyCode);

            return modifiers.length > 0 ? modifiers.join('+') + ' + ' + key : key;
        }
    }

    function ToastManager(options) {
        if (options && options.position) this.position = `${classList[options.position.split('-')[0]]}-${classList[options.position.split('-')[1]]}`
        else this.position = `${classList['bottom']}-${classList['right']}`;

        this.toastContainer = document.createElement('div');
        this.toastContainer.className = classList['toast-container'];
        this.toastContainer.dataset[classList['position']] = this.position;
        document.body.appendChild(this.toastContainer);

        this.showToast = function ({ message, duration = 3000, type, showProgress = false }) {
            var toast = document.createElement('div');
            toast.className = `${classList['toast']} ${classList[type]}`;
            toast.classList.toggle(classList['progress'], showProgress);
            toast.style.setProperty("--progress", 1);
            toast.textContent = message;

            var closeButton = document.createElement('button');
            closeButton.className = classList['close-button'];
            var closeIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="white" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        `;
            closeButton.innerHTML = closeIconSvg;
            closeButton.addEventListener('click', function () {
                this.removeToast(toast);
            }.bind(this));

            toast.appendChild(closeButton);

            toast.addEventListener('mouseover', function () {
                this.handleMouseOver(toast);
            }.bind(this));

            toast.addEventListener('mouseout', function () {
                this.handleMouseOut(toast, duration);
            }.bind(this));

            this.toastContainer[options.position.split('-')[0] === 'top' ? 'prepend' : 'appendChild'](toast);

            this.handleMouseOut(toast, duration);

            return toast;
        };

        this.removeToast = function (toast) {
            toast.style.opacity = 0;
            setTimeout(function () {
                this.toastContainer.removeChild(toast);
            }.bind(this), 300);
        };

        this.handleMouseOver = function (toast) {
            clearTimeout(toast.timeoutId);
            clearInterval(toast.intervalId);
        };
        this.handleMouseOut = function (toast, duration) {
            let lastTimeCalled = new Date();
            toast.intervalId = setInterval(() => {
                var timeVisible = + new Date() - lastTimeCalled;
                toast.style.setProperty(
                    "--progress",
                    timeVisible / duration
                );
            }, 10);
            toast.timeoutId = setTimeout(function () {
                this.removeToast(toast);
            }.bind(this), duration);
        };
    }

    return {
        CreateMenu: CreateMenu,
        Tab: Tab,
        ToastManager: ToastManager,
        setLanguage: setLanguage
    };
})();
