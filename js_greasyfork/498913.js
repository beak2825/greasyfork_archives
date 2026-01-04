// ==UserScript==
// @name         Hacking Kenite
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Hacking Kenite Simulator
// @match       *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498913/Hacking%20Kenite.user.js
// @updateURL https://update.greasyfork.org/scripts/498913/Hacking%20Kenite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Adiciona o CSS
    GM_addStyle(`
        #ia-hacking-ultra-realista-avancada {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 120px;
    height: 120px;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 30px rgba(0, 255, 0, 0.7);
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    z-index: 9999;
    overflow: hidden;
    font-family: 'Courier New', monospace;
}

#ia-hacking-ultra-realista-avancada.expanded {
    width: 450px;
    height: 650px;
    border-radius: 30px;
}

.ia-content {
    position: relative;
    width: 80px;
    height: 80px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.ia-face {
    position: relative;
    width: 100%;
    height: 100%;
}

.ia-eye {
    position: absolute;
    top: 25%;
    width: 25px;
    height: 25px;
    background-color: #00ff00;
    border-radius: 50%;
    animation: blink 3s infinite;
}

.ia-eye.left {
    left: 20%;
}

.ia-eye.right {
    right: 20%;
}

.ia-mouth {
    position: absolute;
    bottom: 25%;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 10px;
    background-color: #00ff00;
    border-radius: 5px;
    animation: talk 1.9s infinite;
}

.ia-panel {
    display: none;
    flex-direction: column;
    width: 100%;
    height: 700px;
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.95);
    border: 2px solid #00ff00;
    border-radius: 25px;
}

#ia-hacking-ultra-realista-avancada.expanded .ia-content {
    display: none;
}

#ia-hacking-ultra-realista-avancada.expanded .ia-panel {
    display: flex;
}

.ia-header {

    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    border-bottom: 1px solid #00ff00;
    padding-bottom: 10px;
}

.ia-title {
    color: #00ff00;
    font-size: 20px;
    font-weight: bold;
}

.ia-close {
    cursor: pointer;
    font-size: 18px;
}

.ia-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.ia-text {
    color: #00ff00;
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
    height: 40px;
}

.ia-tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.ia-tab-button {
    background-color: #111;
    border: 1px solid #00ff00;
    color: #00ff00;
    padding: 10px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 15px;
}

.ia-tab-button.active {
    background-color: #00ff00;
    color: #000;
}

.ia-code-window {
    background-color: #0a0a0a;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid #00ff00;
}

.ia-code-header {
    background-color: #111;
    padding: 8px 15px;
    color: #00ff00;
    font-size: 14px;
    border-bottom: 1px solid #00ff00;
}

.ia-code-content {
    padding: 15px;
    color: #00ff00;
    font-size: 14px;
    height: 180px;
    overflow-y: auto;
    white-space: pre-wrap;
}

.ia-progress {
    width: 100%;
    height: 12px;
    background-color: #111;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 20px;
}

.ia-progress-bar {
    width: 0%;
    height: 100%;
    background-color: #00ff00;
    transition: width 0.3s ease;
}

.ia-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.ia-button {
    background-color: #111;
    border: 1px solid #00ff00;
    color: #00ff00;
    padding: 12px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    border-radius: 15px;
    transition: all 0.3s ease;
}

.ia-button:hover {
    background-color: #00ff00;
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);
}

.ia-button:active {
    transform: translateY(0);
    box-shadow: none;
}

.ia-tool-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.ia-tool {
    background-color: #111;
    color: #00ff00;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    border-radius: 15px;
    transition: all 0.3s ease;
    border: 1px solid #00ff00;
}

.ia-tool:hover {
    background-color: #00ff00;
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4);
}

.ia-stats {
    color: #00ff00;
}

.ia-stat {
    margin-bottom: 20px;
}

.ia-stat-label {
    display: inline-block;
    width: 60%;
    font-size: 16px;
}

.ia-stat-value {
    display: inline-block;
    width: 40%;
    text-align: right;
    font-size: 16px;
    font-weight: bold;
}

.ia-security-level {
    width: 100%;
    height: 12px;
    background-color: #111;
    border-radius: 6px;
    overflow: hidden;
}

.ia-security-bar {
    width: 0%;
    height: 100%;
    background-color: #00ff00;
    transition: width 0.3s ease;
}

.ia-network-map {
    position: relative;
    width: 100%;
    height: 300px;
    background-color: #0a0a0a;
    border-radius: 15px;
    border: 1px solid #00ff00;
    overflow: hidden;
}

.ia-node {
    position: absolute;
    width: 60px;
    height: 60px;
    background-color: #111;
    border: 2px solid #00ff00;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #00ff00;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
}

.ia-node:hover {
    background-color: #00ff00;
    color: #000;
    transform: scale(1.1);
}

.ia-node-main {
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    font-size: 16px;
    font-weight: bold;
}

.ia-node-1 { top: 20%; left: 20%; }
.ia-node-2 { top: 20%; right: 20%; }
.ia-node-3 { bottom: 20%; left: 20%; }
.ia-node-4 { bottom: 20%; right: 20%; }

.ia-footer {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #00ff00;
    padding-top: 15px;
}

.ia-status {
    color: #00ff00;
    font-size: 16px;
}

.ia-battery {
    width: 60px;
    height: 25px;
    border: 2px solid #00ff00;
    border-radius: 5px;
    padding: 2px;
    position: relative;
}

.ia-battery::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -6px;
    transform: translateY(-50%);
    width: 4px;
    height: 12px;
    background-color: #00ff00;
}

.ia-battery-level {
    width: 100%;
    height: 100%;
    background-color: #00ff00;
    transition: width 0.3s ease;
}

@keyframes blink {
    0%, 45%, 55%, 100% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(0.1);
    }
}

@keyframes talk {
    0%, 100% {
        height: 10px;
    }
    50% {
        height: 5px;
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(0, 255, 0, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
    }
}

#ia-hacking-ultra-realista-avancada {
    --hue: 120;
    filter: hue-rotate(calc(var(--hue) * 1deg));
    transition: filter 2s ease-in-out;
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: #111;
    border-radius: 5px;
}

::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: #00cc00;
}

    `);

    // Cria o elemento da IA
    const ia = document.createElement('div');
    ia.id = 'ia-hacking-ultra-realista-avancada';
    ia.innerHTML = `
        <div class="ia-content">
            <div class="ia-face">
                <div class="ia-eye left"></div>
                <div class="ia-eye right"></div>
                <div class="ia-mouth"></div>
            </div>
        </div>
        <div class="ia-panel">
            <div class="ia-header">
                <span class="ia-title">Kenite  Hacker v6.0</span>
                <span class="ia-close">❌</span>
            </div>
            <div class="ia-body">
                <div class="ia-text">Iniciando sistemas avançados... Aguarde instruções. 🖥️</div>
                <div class="ia-tabs">
                    <button class="ia-tab-button active" data-tab="main">Principal</button>
                    <button class="ia-tab-button" data-tab="tools">Ferramentas</button>
                    <button class="ia-tab-button" data-tab="stats">Estatísticas</button>
                    <button class="ia-tab-button" data-tab="network">Rede</button>
                </div>
                <div class="ia-tab-content" id="main-tab">
                    <div class="ia-code-window">
                        <div class="ia-code-header">
                            <span class="ia-code-title">Terminal Avançado</span>
                        </div>
                        <div class="ia-code-content"></div>
                    </div>
                    <div class="ia-progress">
                        <div class="ia-progress-bar"></div>
                    </div>
                    <div class="ia-buttons">
                        <button class="ia-button" data-action="hack">🔓 Hackear</button>
                        <button class="ia-button" data-action="analyze">🔍 Analisar</button>
                        <button class="ia-button" data-action="protect">🛡️ Proteger</button>
                        <button class="ia-button" data-action="encrypt">🔐 Criptografar</button>
                        <button class="ia-button" data-action="decrypt">🔓 Descriptografar</button>
                        <button class="ia-button" data-action="network">🌐 Varrer Rede</button>
                    </div>
                </div>
                <div class="ia-tab-content" id="tools-tab" style="display:none;">
                    <div class="ia-tool-grid">
                        <div class="ia-tool" data-tool="portscanner">🔌 Port Scanner</div>
                        <div class="ia-tool" data-tool="passwordcracker">🔑 Password Cracker</div>
                        <div class="ia-tool" data-tool="malwaredetector">🦠 Malware Detector</div>
                        <div class="ia-tool" data-tool="vpn">🌍 VPN</div>
                        <div class="ia-tool" data-tool="keylogger">⌨️ Keylogger</div>
                        <div class="ia-tool" data-tool="ddos">💥 DDoS Simulator</div>
                        <div class="ia-tool" data-tool="forensics">🔬 Forensics Tool</div>
                        <div class="ia-tool" data-tool="steganography">🖼️ Steganography</div>
                    </div>
                </div>
                <div class="ia-tab-content" id="stats-tab" style="display:none;">
                    <div class="ia-stats">
                        <div class="ia-stat">
                            <span class="ia-stat-label">Ataques Bem-sucedidos:</span>
                            <span class="ia-stat-value" id="successful-attacks">0</span>
                        </div>
                        <div class="ia-stat">
                            <span class="ia-stat-label">Ameaças Detectadas:</span>
                            <span class="ia-stat-value" id="threats-detected">0</span>
                        </div>
                        <div class="ia-stat">
                            <span class="ia-stat-label">Nível de Segurança:</span>
                            <div class="ia-security-level">
                                <div class="ia-security-bar"></div>
                            </div>
                        </div>
                        <div class="ia-stat">
                            <span class="ia-stat-label">Eficiência do Sistema:</span>
                            <span class="ia-stat-value" id="system-efficiency">100%</span>
                        </div>
                    </div>
                </div>
                <div class="ia-tab-content" id="network-tab" style="display:none;">
                    <div class="ia-network-map">
                        <div class="ia-node ia-node-main">IA</div>
                        <div class="ia-node ia-node-1">Node 1</div>
                        <div class="ia-node ia-node-2">Node 2</div>
                        <div class="ia-node ia-node-3">Node 3</div>
                        <div class="ia-node ia-node-4">Node 4</div>
                    </div>
                </div>
            </div>
            <div class="ia-footer">
                <div class="ia-status">Status: Inicializando sistemas avançados... 🟡</div>
                <div class="ia-battery">
                    <div class="ia-battery-level"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(ia);

    // Funções de animação e interatividade
    function animateFusion() {
        ia.style.setProperty('--hue', Math.random() * 360);
        setTimeout(animateFusion, 3000);
    }

    function toggleExpand() {
        ia.classList.toggle('expanded');
        if (ia.classList.contains('expanded')) {
            typeText('Sistema avançado inicializado. Aguardando comandos...', ia.querySelector('.ia-text'));
        }
    }

    function closePanel() {
        ia.classList.remove('expanded');
    }

    function typeText(text, element, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        return new Promise((resolve) => {
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    function typeCode(code, element) {
        return typeText(code, element, 20);
    }

    async function executeAction(action) {
        const textElement = ia.querySelector('.ia-text');
        const progressBar = ia.querySelector('.ia-progress-bar');
        const statusElement = ia.querySelector('.ia-status');
        const codeElement = ia.querySelector('.ia-code-content');

        await typeText(`Executando: ${action}... 🔄`, textElement);
        statusElement.textContent = 'Status: Processando 🟠';
        progressBar.style.width = '0%';

        let code = '';
        switch(action) {
            case 'Hackear':
                code = `async function hack() {\n  const target = await getRandomTarget();\n  const vulnerabilities = await scanForVulnerabilities(target);\n  if (vulnerabilities.length > 0) {\n    await exploitVulnerabilities(vulnerabilities);\n    const access = await gainAccess(target);\n    if (access) {\n      await extractData(target);\n      await coverTracks();\n    }\n  }\n  return 'Hack concluído';\n}`;
                break;
            case 'Analisar':
                code = `async function analyze() {\n  const data = await collectData();\n  const patterns = await identifyPatterns(data);\n  const risks = await assessRisks(patterns);\n  const report = await generateReport(risks);\n  await encryptReport(report);\n  return 'Análise concluída';\n}`;
                break;
            case 'Proteger':
                code = `async function protect() {\n  const systems = await getSystems();\n  for (const system of systems) {\n    await updateFirewall(system);\n    await patchVulnerabilities(system);\n    await enableEncryption(system);\n    await setupIntrusionDetection(system);\n  }\n  return 'Proteção ativada';\n}`;
                break;
            case 'Criptografar':
                code = `async function encrypt(data) {\n  const key = await generateStrongKey();\n  const encryptedData = await applyAdvancedEncryption(data, key);\n  await storeSecurely(key);\n  await verifyEncryption(encryptedData, key);\n  return encryptedData;\n}`;
                break;
            case 'Descriptografar':
                code = `async function decrypt(encryptedData) {\n  const key = await retrieveKey();\n  const decryptedData = await applyAdvancedDecryption(encryptedData, key);\n  await verifyIntegrity(decryptedData);\n  return decryptedData;\n}`;
                break;
            case 'Varrer Rede':
                code = `async function scanNetwork() {\n  const devices = await discoverDevices();\n  for (const device of devices) {\n    const openPorts = await scanPorts(device);\n    const services = await identifyServices(openPorts);\n    const vulnerabilities = await assessVulnerabilities(services);\n    await logDeviceInfo(device, services, vulnerabilities);\n  }\n  return 'Varredura de rede concluída';\n}`;
                break;
        }

        await typeCode(code, codeElement);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                clearInterval(interval);
                progress = 100;
                typeText(`${action} concluído! ✅`, textElement);
                statusElement.textContent = 'Status: Concluído 🟢';
                updateStats(action);
            }
            progressBar.style.width = `${progress}%`;
        }, 100);
    }

    function updateStats(action) {
        const successfulAttacks = ia.querySelector('#successful-attacks');
        const threatsDetected = ia.querySelector('#threats-detected');
        const securityBar = ia.querySelector('.ia-security-bar');
        const systemEfficiency = ia.querySelector('#system-efficiency');

        if (action === 'Hackear' || action === 'Analisar') {
            successfulAttacks.textContent = parseInt(successfulAttacks.textContent) + 1;
        }

        if (action === 'Proteger' || action === 'Analisar') {
            threatsDetected.textContent = parseInt(threatsDetected.textContent) + Math.floor(Math.random() * 5) + 1;
        }

        const securityLevel = Math.min(100, parseInt(securityBar.style.width || '0') + Math.floor(Math.random() * 20));
        securityBar.style.width = `${securityLevel}%`;

        const efficiency = Math.max(0, parseInt(systemEfficiency.textContent) - Math.floor(Math.random() * 5));
        systemEfficiency.textContent = `${efficiency}%`;
    }

    // Event Listeners
    ia.querySelector('.ia-content').addEventListener('click', toggleExpand);
    ia.querySelector('.ia-close').addEventListener('click', closePanel);

    const buttons = ia.querySelectorAll('.ia-button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.textContent.split(' ')[1];
            executeAction(action);
        });
    });

    const tabButtons = ia.querySelectorAll('.ia-tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            ia.querySelectorAll('.ia-tab-content').forEach(tab => tab.style.display = 'none');
            ia.querySelector(`#${tabName}-tab`).style.display = 'block';
            tabButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    const tools = ia.querySelectorAll('.ia-tool');
    tools.forEach(tool => {
        tool.addEventListener('click', async (e) => {
            const toolName = e.target.dataset.tool;
            const textElement = ia.querySelector('.ia-text');
            await typeText(`Ativando ferramenta avançada: ${toolName}...`, textElement);
            setTimeout(() => typeText(`${toolName} ativado com sucesso! Executando operações...`, textElement), 1500);
        });
    });

    // Iniciar animações
    animateFusion();

    // Simular bateria
    setInterval(() => {
        const batteryLevel = ia.querySelector('.ia-battery-level');
        let currentLevel = parseInt(batteryLevel.style.width || '100%');
        currentLevel = Math.max(0, currentLevel - 1);
        batteryLevel.style.width = `${currentLevel}%`;
        if (currentLevel < 20) {
            batteryLevel.style.backgroundColor = '#ff0000';
        }
    }, 5000);

    // Animar nós da rede
    setInterval(() => {
        const nodes = ia.querySelectorAll('.ia-node');
        nodes.forEach(node => {
            node.style.animation = 'none';
            node.offsetHeight; // Trigger reflow
            node.style.animation = null;
        });
    }, 5000);
})();
