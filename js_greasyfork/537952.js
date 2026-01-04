/**
 * 递归匹配网站配置，找到最适合当前 URL 的配置。
 * @param {string} path - 当前页面的完整 URL。
 * @param {object} node - 当前正在搜索的配置节点。
 * @returns {object | null} - 匹配到的网站配置对象，如果没有则返回 null。
 */
function getSite(path, node) {
    for (const key in node) {
        if (key === 'site') continue;
        if (path.includes(key)) {
            return getSite(path, node[key]);
        }
    }
    return node.site || null;
}

const outputPanel = document.createElement('div');
outputPanel.id = 'output-panel';
outputPanel.className = 'tab-panel';

/**
 * 将字符串消息记录到控制台和菜单的输出面板。
 * @param {string} message - 要记录的字符串消息。
 */
function log(message) {
    console.log(message);
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = message;
    outputPanel.appendChild(logEntry);
    outputPanel.scrollTop = outputPanel.scrollHeight;
}

/**
 * 核心执行函数
 * @param {object} siteConfig - 完整的网站配置对象。
 */
function core(siteConfig) {
    log('学习助手：脚本已启用');
    const site = getSite(window.location.href, siteConfig);

    if (!site) {
        log('学习助手：当前页面没有待执行的脚本');
        return;
    }

    log('学习助手：开始执行当前页面的脚本');

    const onElementAddedConfig = site.onElementAdded || {};
    const onScriptLoadedConfig = site.onScriptLoaded || {};

    if (Object.keys(onElementAddedConfig).length > 0 || Object.keys(onScriptLoadedConfig).length > 0) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType !== Node.ELEMENT_NODE) continue;
                        Object.keys(onElementAddedConfig).forEach((selector) => {
                            if (onElementAddedConfig[selector].times > 0 && addedNode.matches(selector)) {
                                onElementAddedConfig[selector].callback(addedNode, site);
                                onElementAddedConfig[selector].times--;
                            }
                        });
                        Object.keys(onScriptLoadedConfig).forEach((selector) => {
                            if (onScriptLoadedConfig[selector].times > 0 && addedNode.matches(selector)) {
                                addedNode.onload = () => onScriptLoadedConfig[selector].callback(addedNode, site);
                                onScriptLoadedConfig[selector].times--;
                            }
                        });
                    }
                }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    const runOnDOMReady = () => {
        if (site.onPageLoaded) {
            site.onPageLoaded.call(site);
        }
        createMenu(site);
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'loaded') {
        runOnDOMReady();
    } else {
        window.addEventListener('DOMContentLoaded', runOnDOMReady);
    }
}


/**
 * 创建并管理可拖动的侧边栏菜单，并根据配置生成表单。
 * @param {object | null} site - 当前网站的配置对象。
 */
function createMenu(site) {
    const menuDiv = document.createElement('div');
    menuDiv.id = 'study-tool-menu';

    // 顶部标签栏
    const tabBar = document.createElement('div');
    tabBar.className = 'tab-bar';

    const configButton = document.createElement('div');
    configButton.className = 'tab-button active';
    configButton.textContent = '配置';
    configButton.dataset.tab = 'config-panel';

    const outputButton = document.createElement('div');
    outputButton.className = 'tab-button';
    outputButton.textContent = '日志';
    outputButton.dataset.tab = 'output-panel';

    const buttonBg = document.createElement('div');
    buttonBg.className = 'tab-bg';

    tabBar.append(configButton, outputButton, buttonBg);
    menuDiv.appendChild(tabBar);

    // 内容面板容器
    const contentPanels = document.createElement('div');
    contentPanels.className = 'content-panels';

    // 配置面板
    const configPanel = document.createElement('div');
    configPanel.id = 'config-panel';
    configPanel.className = 'tab-panel active-panel';
    if (site && site.config) {
        const formContainer = document.createElement('div');
        formContainer.className = 'form-container';
        for (const [name, setting] of Object.entries(site.config)) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'form-item';
            const labelEl = document.createElement('label');
            labelEl.textContent = name;
            itemDiv.appendChild(labelEl);

            switch (setting.type) {
                case 'switch':
                    const switchLabel = document.createElement('label');
                    switchLabel.className = 'switch';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = setting.value;
                    labelEl.htmlFor = `config-switch-${name.replace(/\s+/g, '-')}`; // 关联label和checkbox
                    checkbox.id = `config-switch-${name.replace(/\s+/g, '-')}`;
                    checkbox.addEventListener('change', () => {
                        setting.value = checkbox.checked;
                        if (setting.callback) setting.callback(site);
                    });
                    const slider = document.createElement('span');
                    slider.className = 'slider';
                    switchLabel.append(checkbox, slider);
                    itemDiv.appendChild(switchLabel);
                    formContainer.appendChild(itemDiv);
                    break;
                case 'button':
                    const btn = document.createElement('div');
                    btn.className = 'config-button';
                    btn.textContent = name;
                    btn.addEventListener('click', () => {
                        if (setting.callback) setting.callback(site);
                    });

                    const btnBg = document.createElement('div');
                    btnBg.className = 'config-button-bg';
                    btnBg.textContent = '点击';
                    btn.appendChild(btnBg);
                    
                    formContainer.appendChild(btn);
                    break;
            }
        }
        configPanel.appendChild(formContainer);
    } else {
        configPanel.innerHTML = `<div class="panel-info">当前页面无配置项</div>`;
    }

    contentPanels.append(configPanel, outputPanel);
    menuDiv.appendChild(contentPanels);
    document.body.appendChild(menuDiv);

    // 标签页切换逻辑
    const tabButtons = [configButton, outputButton];
    const panels = [configPanel, outputPanel];
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            panels.forEach(panel => panel.classList.remove('active-panel'));
            document.getElementById(button.dataset.tab).classList.add('active-panel');
        });
    });

    // 拖动逻辑
    let isDragging = false, offsetX, offsetY, startX, startY;
    menuDiv.addEventListener('mousedown', (e) => {
        isDragging = true; menuDiv.style.cursor = 'grabbing';
        const divRect = menuDiv.getBoundingClientRect();
        offsetX = e.clientX - divRect.left; offsetY = e.clientY - divRect.top;
        startX = e.clientX; startY = e.clientY;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menuDiv.style.transition = 'none';
            menuDiv.style.left = (e.clientX - offsetX) + 'px';
            menuDiv.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', (e) => {
        
        if (!isDragging) return;
        isDragging = false;
        menuDiv.style.cursor = 'grab';
        menuDiv.style.transition = '0.3s ease-out';
        const windowWidth = window.innerWidth, divRect = menuDiv.getBoundingClientRect();
        
        // 如果是点击
        if (startX == e.clientX) {
            if (menuDiv.classList.contains('collapsed')) {
                if (menuDiv.classList.contains('collapsed-left')) menuDiv.style.left = '20px';
                else if (menuDiv.classList.contains('collapsed-right')) menuDiv.style.left = (window.innerWidth - 235) + 'px';
                menuDiv.classList.remove('collapsed', 'collapsed-left', 'collapsed-right');
                buttonBg.innerText = '';
            }
        }

        // 如果是拖动结束
        else {
            buttonBg.innerText = '';
            menuDiv.classList.remove('collapsed', 'collapsed-left', 'collapsed-right');
            if (divRect.left < 0) {
                menuDiv.classList.add('collapsed', 'collapsed-left');
                menuDiv.style.left = '';
                buttonBg.innerText = '展开';
            } else if (divRect.right > windowWidth) {
                menuDiv.classList.add('collapsed', 'collapsed-right');
                menuDiv.style.left = '';
                buttonBg.innerText = '展开';
            }
        }
        
    });
}
