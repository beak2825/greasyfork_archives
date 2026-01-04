// ==UserScript==
// @name          More XToys
// @name:zh-CN    XToys 玩具多多
// @namespace     https://github.com/forest-devil/
// @version       1.46
// @description   Takes over XToys's custom serial port toy functionality, replacing it with custom Bluetooth toys (currently supporting Roussan).
// @description:zh-CN 接管XToys的自定义串口功能，替换为通过蓝牙控制玩具（当前支持若仙）。
// @author        forest-devil & Gemini
// @license       Apache
// @match         https://xtoys.app/*
// @grant         unsafeWindow
// @grant         GM_log
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @grant         GM_getValue
// @grant         GM_setValue
// @run-at        document-start
// @icon          https://xtoys.app/icons/favicon-96x96.png
// @downloadURL https://update.greasyfork.org/scripts/541390/More%20XToys.user.js
// @updateURL https://update.greasyfork.org/scripts/541390/More%20XToys.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // --- 配置区域 ---
    /**
     * @type {boolean} 调试模式开关
     * 设置为 true: 启用无设备调试模式。脚本将不会连接真实蓝牙设备，而是将数据流打印到控制台。
     * 设置为 false: 正常模式，脚本将尝试连接真实的蓝牙设备。
     */
    let DEBUG_MODE = GM_getValue("DEBUG_MODE", false);
    // 用于调试模式下生成友好设备名的计数器
    let debugDeviceCounter = 0;

    // --- 模拟 USB ID 常量 ---
    // 这些常量用于为模拟串口设备创建唯一的 USB ID
    const MOCK_USB_VENDOR_ID = 0x1A86;
    // MOCK_USB_PRODUCT_ID_BASE 提供了产品 ID 的起始基数，用于生成唯一 ID
    const MOCK_USB_PRODUCT_ID_BASE = 0x7523;

    /**
     * 切换调试模式并刷新页面。
     */
    function toggleDebugMode() {
        DEBUG_MODE = !DEBUG_MODE;
        GM_setValue("DEBUG_MODE", DEBUG_MODE);
        console.log(`[Xtoys 玩具多多] 调试模式: ${DEBUG_MODE ? '已开启' : '已关闭'}`);
        location.reload();
    }

    // 注册菜单命令来切换调试模式
    GM_registerMenuCommand(
        `切换调试模式 (当前: ${DEBUG_MODE ? '开启' : '关闭'})`, // 菜单项显示的文本
        toggleDebugMode
    );

    // 在这里定义所有支持的蓝牙协议
    const PROTOCOLS = {
        "Roussan": {
            serviceUUID: "fe400001-b5a3-f393-e0a9-e50e24dcca9e",
            writeUUID: "fe400002-b5a3-f393-e0a9-e50e24dcca9e",
            notifyUUID: "fe400003-b5a3-f393-e0a9-e50e24dcca9e",
            /**
             * 将输入的指令转换为蓝牙数据包
             * @param {object} command - 从模拟串口接收到的JSON对象
             * @returns {Uint8Array | null} - 转换后的数据包或在无效输入时返回null
             */
            transform: command => {
                // 优先使用 vibrate，其次是 Speed
                let speed = command.vibrate ?? command.speed ?? null;
                if (speed === null) {
                    console.warn('[Xtoys 玩具多多] 指令对象中不包含 "vibrate" 或 "speed" 键。', command);
                    return null;
                }
                // 确保速度值在 0-100 范围内
                speed = Math.max(0, Math.min(100, parseInt(speed, 10)));
                // 若仙协议只支持30档速度，需要从0~100转换为0~30
                // 将速度值从 0-100 映射到 0-30
                speed = Math.round(speed * 0.3);
                // 封装数据包: 55 AA 03 01 XX 00
                return new Uint8Array([0x55, 0xAA, 0x03, 0x01, speed, 0x00]);
            }
        }
        // 未来可以在这里添加更多协议...
    };

    // --- 脚本核心逻辑 ---

    console.info('[Xtoys 玩具多多] 脚本已加载。正在等待拦截串口请求...');
    if (DEBUG_MODE) {
        console.warn('[Xtoys 玩具多多] 调试模式已启用。将不使用真实蓝牙设备。');
    }

    /**
     * @typedef {Object} BleConnectionState
     * @property {BluetoothDevice} device - 蓝牙设备对象
     * @property {BluetoothRemoteGATTServer} server - GATT 服务器对象
     * @property {BluetoothRemoteGATTCharacteristic} writeCharacteristic - 写入特性
     * @property {BluetoothRemoteGATTCharacteristic | null} notifyCharacteristic - 通知特性 (可能没有)
     * @property {Object} activeProtocol - 当前设备使用的协议配置
     * @property {MockSerialPort} mockPortInstance - 关联的模拟 SerialPort 实例
     * @property {string | null} xtoysDeviceId - XToys 为此设备提供的 'id' 字段 (如果有)。
     * @property {number} usbVendorId - 此设备的模拟 USB 供应商 ID。
     * @property {number} usbProductId - 此设备的设备的模拟 USB 产品 ID。
     */
    const activeConnections = new Map(); // 使用 Map 存储，键可以是 device.id

    /**
     * 重置并移除某个设备的连接状态
     * @param {string} deviceId -设备的ID
     */
    function removeConnectionState(deviceId) {
        if (!activeConnections.has(deviceId)) {
            return;
        }

        const state = activeConnections.get(deviceId);
        // 获取更友好的设备名称，用于日志
        const deviceFriendlyName = state.device?.name || `ID: ${state.device?.id}`;

        if (state.notifyCharacteristic) {
            try {
                state.notifyCharacteristic.removeEventListener('characteristicvaluechanged', handleNotifications);
                state.notifyCharacteristic.stopNotifications();
            } catch (e) {
                // 优化日志信息：根据设备是否已断开来判断是否为预期错误
                if (!state.device?.gatt?.connected) {
                    console.info(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 已断开，停止通知时出现预期错误: ${e.message}`);
                } else {
                    console.error(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 停止通知时出现未知错误: ${e.message}`);
                }
            }
        }
        // 检查 state.device 和 state.device.gatt 是否存在
        if (state.device?.gatt?.connected) {
            // 捕获 disconnect() Promise 的拒绝，避免 Uncaught (in promise) 错误
            state.device.gatt.disconnect().catch(e => {
                console.warn(`[Xtoys 玩具多多] 断开设备 ${deviceFriendlyName} GATT 连接时发生错误 (可能已断开):`, e);
            });
        }

        activeConnections.delete(deviceId);
        console.info(`[Xtoys 玩具多多] 已断开并移除设备 ${deviceFriendlyName} 的连接状态。当前活跃连接数: ${activeConnections.size}`);
    }

    /**
     * 处理来自蓝牙设备的通知
     * @param {Event} event - 特性值改变事件
     */
    function handleNotifications(event) {
        const { value, target: characteristic } = event;
        const { service } = characteristic;
        const { id: deviceId } = service.device;
        const deviceFriendlyName = activeConnections.get(deviceId)?.device?.name || `ID: ${deviceId}`;
        console.debug(`[Xtoys 玩具多多] 收到来自设备 ${deviceFriendlyName} 的通知:`, value);
        // 在这里可以添加对通知数据的处理逻辑，例如推送到对应的 readable stream
        // 由于Xtoys主要使用 writable stream，此处暂时只做日志输出
    }

    /**
     * 伪造的 requestPort 函数，用于替代原始的 navigator.serial.requestPort
     * 每次调用都会尝试连接一个新设备
     */
    async function mockRequestPort() {
        console.info('[Xtoys 玩具多多] 已拦截 navigator.serial.requestPort() 调用。等待设备选择...');

        // 调试模式逻辑
        if (DEBUG_MODE) {
            // 在调试模式下，每次请求都创建一个新的模拟端口
            const defaultProtocolName = Object.keys(PROTOCOLS)[0];
            if (!defaultProtocolName) {
                console.error('[Xtoys 玩具多多 调试模式] 未定义任何协议。无法在调试模式下运行。');
                return Promise.reject(new Error("未定义任何协议。"));
            }
            const activeProtocol = PROTOCOLS?.[defaultProtocolName];

            // 递增计数器，用于生成调试设备的唯一 ID
            debugDeviceCounter++;

            // 为调试设备生成唯一的友好名称和模拟 USB ID
            const debugDeviceId = `debug-device-${Date.now()}-${debugDeviceCounter}`;
            const debugDeviceName = `调试设备 #${debugDeviceCounter}`;
            const mockUsbProductId = MOCK_USB_PRODUCT_ID_BASE + debugDeviceCounter; // 为每个调试设备生成唯一的 Product ID

            console.info(`[Xtoys 玩具多多 调试模式] 正在使用协议 "${defaultProtocolName}" 模拟设备 "${debugDeviceName}"。`);
            console.info(`[Xtoys 玩具多多 调试模式] 生成的设备ID: ${debugDeviceId}, 模拟 USB 产品ID: 0x${mockUsbProductId.toString(16)}`);

            const debugConnectionState = {
                device: { id: debugDeviceId, name: debugDeviceName }, // 模拟 device 对象，包含友好名称
                server: null,
                writeCharacteristic: null, // 在调试模式下不实际使用
                notifyCharacteristic: null, // 不实际使用
                activeProtocol,
                mockPortInstance: null, // 将在 createMockSerialPort 中赋值
                xtoysDeviceId: null, // 调试设备初始没有 XToys Device ID
                usbVendorId: MOCK_USB_VENDOR_ID,
                usbProductId: mockUsbProductId
            };
            activeConnections.set(debugDeviceId, debugConnectionState);
            const mockPort = createMockSerialPort(debugConnectionState);
            debugConnectionState.mockPortInstance = mockPort;

            return mockPort;
        }

        // 真实蓝牙设备连接逻辑
        let device;
        try {
            //let filters = Object.values(PROTOCOLS).map(p => ({ services: [p.serviceUUID] }));
            // 获取所有协议的服务UUID，用于 optionalServices
            let optionalServices = Object.values(PROTOCOLS).map(p => p.serviceUUID);

            console.info('[Xtoys 玩具多多] 正在请求蓝牙设备，搜索条件:', /*filters*/ '所有设备');
            console.info('[Xtoys 玩具多多] 可选服务:', optionalServices); // 新增日志

            device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: optionalServices // 添加 optionalServices
            });
            const deviceFriendlyName = device.name || `ID: ${device.id}`;
            console.info('[Xtoys 玩具多多] 已选择设备: %s', deviceFriendlyName);

            // 检查该设备是否已连接，如果已连接则复用其模拟端口
            if (activeConnections.has(device.id) && activeConnections.get(device.id).device?.gatt?.connected) {
                console.info(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 已连接。正在复用现有模拟端口。`);
                return activeConnections.get(device.id).mockPortInstance;
            }

            // 添加 GATT 断开连接事件监听器
            device.addEventListener('gattserverdisconnected', function() {
                console.warn(`[Xtoys 玩具多多] 蓝牙设备 ${deviceFriendlyName} 已断开连接。`);
                removeConnectionState(device.id); // 移除该设备的连接状态
            });

            console.info(`[Xtoys 玩具多多] 正在连接设备 ${deviceFriendlyName} 的 GATT 服务器...`);
            const server = await device.gatt.connect();

            let activeProtocol = null;
            let writeCharacteristic = null;
            let notifyCharacteristic = null;

            for (const protocolName in PROTOCOLS) {
                const protocol = PROTOCOLS?.[protocolName];
                try {
                    const service = await server.getPrimaryService(protocol.serviceUUID);
                    if (service) {
                        console.info(`[Xtoys 玩具多多] 在设备 ${deviceFriendlyName} 上找到匹配的协议服务: "${protocolName}"`);
                        activeProtocol = protocol;
                        writeCharacteristic = await service.getCharacteristic(protocol.writeUUID);
                        try {
                            notifyCharacteristic = await service.getCharacteristic(protocol.notifyUUID);
                            await notifyCharacteristic.startNotifications();
                            console.info('[Xtoys 玩具多多] 已订阅通知。');
                            notifyCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);
                        } catch (notifyError) {
                            console.warn('[Xtoys 玩具多多] 无法获取或订阅通知特性。', notifyError.message);
                        }
                        break; // 找到一个匹配的协议就停止
                    }
                } catch (serviceError) {
                    // 直接在 serviceError 捕获块中给出用户提示
                    const userMessage = `尝试连接设备 ${deviceFriendlyName} 上的控制服务失败。请检查设备是否已开启且在范围内，并尝试重新连接。\n详细错误: ${serviceError.message}`;
                    showUserMessage('[Xtoys 玩具多多] 连接失败', userMessage); // 显示UI提示
                    console.error(`[Xtoys 玩具多多] ${userMessage}`); // 同时输出到控制台
                    throw serviceError; // 重新抛出错误，让外层catch捕获
                }
            }

            if (!activeProtocol || !writeCharacteristic) {
                // 如果代码执行到这里，说明没有找到匹配的协议或写入特性，
                // 且之前的 try-catch 并没有捕获到错误（例如，getPrimaryService返回null但未抛出错误）。
                // 此时抛出更通用的错误，外层catch会处理。
                const userMessage = `在所选设备 ${deviceFriendlyName} 上找不到匹配的协议或写入特性。请确保设备支持所选协议。`;
                showUserMessage('[Xtoys 玩具多多] 连接失败', userMessage); // 显示UI提示
                console.error(`[Xtoys 玩具多多] ${userMessage}`); // 同时输出到控制台
                throw new Error(userMessage); // 仍然抛出错误以保持Promise链的拒绝
            }

            // 为真实蓝牙设备生成一个唯一的模拟 USB 产品 ID
            // 使用 Date.now() 的一部分，以确保每次连接的 Product ID 都是不同的
            const mockUsbProductId = MOCK_USB_PRODUCT_ID_BASE + (Date.now() % 10000);

            // 存储新的连接状态
            const newConnectionState = {
                device,
                server,
                writeCharacteristic,
                notifyCharacteristic,
                activeProtocol,
                mockPortInstance: null, // 将在 createMockSerialPort 中赋值
                xtoysDeviceId: null, // 真实设备初始没有 XToys Device ID
                usbVendorId: MOCK_USB_VENDOR_ID,
                usbProductId: mockUsbProductId
            };
            activeConnections.set(device.id, newConnectionState); // 将新连接存储到 Map 中

            console.info(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 蓝牙连接成功并准备就绪。模拟 USB 产品ID: 0x${mockUsbProductId.toString(16)}。当前活跃连接数: ${activeConnections.size}`);
            const mockPort = createMockSerialPort(newConnectionState);
            newConnectionState.mockPortInstance = mockPort; // 将模拟端口实例也保存到状态中

            return mockPort;

        } catch (error) {
            const deviceFriendlyName = device?.name || (device?.id ? `ID: ${device.id}` : '未知设备');
            let userMessageTitle = '[Xtoys 玩具多多] 连接失败';
            let userMessage = `尝试连接蓝牙设备 ${deviceFriendlyName} 时发生错误。`;
            let suppressUiMessage = false; // 标记是否抑制UI消息

            // 检查是否是用户取消选择 (NotFoundError)
            if (error.name === 'NotFoundError') {
                userMessage = '蓝牙设备选择已取消。'; // 更精确的控制台消息
                console.info(`[Xtoys 玩具多多] ${userMessage}`); // 记录为 info
                suppressUiMessage = true; // 抑制UI对话框
            }
            // 检查是否是连接或通信失败 (NetworkError 或特定消息)
            else if (error.name === 'NetworkError' || error.message.includes('GATT operation failed') || error.message.includes('Failed to connect')) {
                userMessage = `设备 ${deviceFriendlyName} 连接或通信失败。请检查设备是否已开启且在范围内，并尝试重新连接。`;
                console.error(`[Xtoys 玩具多多] ${userMessageTitle}: ${userMessage}\n原始错误:`, error);
            }
            // 对于 Origin is not allowed to access any service 错误
            else if (error.name === 'SecurityError' && error.message.includes('Origin is not allowed to access any service')) {
                userMessage = `连接设备 ${deviceFriendlyName} 失败：浏览器安全策略限制了对蓝牙服务的访问。请确保所有要访问的服务 UUID 都已添加到 'optionalServices' 中。`;
                console.error(`[Xtoys 玩具多多] ${userMessageTitle}: ${userMessage}\n原始错误:`, error);
            }
            // 对于其他未被内层 serviceError 捕获的通用错误，或内层 serviceError 重新抛出的错误，使用通用提示
            else {
                 userMessage = `连接过程中发生未知错误: ${error.message}。请尝试重新连接。`;
                 console.error(`[Xtoys 玩具多多] ${userMessageTitle}: ${userMessage}\n原始错误:`, error);
            }

            // 只有在不抑制UI消息的情况下才显示
            if (!suppressUiMessage) {
                showUserMessage(userMessageTitle, userMessage);
            }

            // 如果连接失败，并且设备ID已经存在于 Map 中（可能是在选择设备后但在连接前失败），则将其移除
            if (device && activeConnections.has(device.id)) {
                removeConnectionState(device.id);
            }
            return Promise.reject(error); // 仍然拒绝 Promise
        }
    }

    /**
     * 创建一个模拟的 SerialPort 对象，并将其绑定到特定的连接状态
     * @param {BleConnectionState} connectionState - 当前设备的连接状态
     * @returns {object} 一个包含可写流的模拟 Port 对象
     */
    function createMockSerialPort(connectionState) {
        // 获取更友好的设备名称，用于日志和 getInfo().deviceName
        // 优先使用 XToys Device ID，然后是连接状态中的设备名称，最后是通用的蓝牙 ID 字符串
        const deviceFriendlyName = connectionState.xtoysDeviceId || connectionState.device?.name || `蓝牙设备 ${connectionState.device?.id?.substring(0, 8)}`;

        const mockPort = {
            // 这个可写流将作为所有来自 XToys 的传入命令的路由器
            writable: new WritableStream({
                async write(chunk) {
                    try {
                        const commandStr = new TextDecoder().decode(chunk);
                        const command = JSON.parse(commandStr);
                        console.debug(`[Xtoys 玩具多多] 收到原始命令 (来自 ${deviceFriendlyName}):`, command);

                        const incomingCommandId = command.id;

                        // 根据 XToys 的保证：在一次连接中，给设备传输的所有命令的id是一致的。
                        // 因此，如果命令中包含 ID，并且它与当前连接的 xtoysDeviceId 不同，
                        // 我们就更新 xtoysDeviceId。这确保了 xtoysDeviceId 始终是 XToys 正在使用的 ID。
                        if (incomingCommandId && connectionState.xtoysDeviceId !== incomingCommandId) {
                            connectionState.xtoysDeviceId = incomingCommandId;
                            console.info(`[Xtoys 玩具多多] 设备 '${connectionState.device.name}' (内部ID: ${connectionState.device.id}) 现在映射到 XToys Device ID '${incomingCommandId}'。`);
                        }

                        // 使用当前 connectionState 的协议转换命令
                        const dataPacket = connectionState.activeProtocol?.transform(command);

                        if (dataPacket) {
                            const hexString = `${Array.from(dataPacket).map(b => b.toString(16).padStart(2, '0')).join(' ')}`;

                            if (DEBUG_MODE) {
                                // 使用最合适的名称进行调试日志
                                const logDeviceName = connectionState.xtoysDeviceId || connectionState.device?.name || connectionState.device?.id;
                                console.debug(`[Xtoys 玩具多多 调试模式] 正在路由到设备 '${logDeviceName}' (XToys Device ID: ${incomingCommandId || 'N/A'})。发送 HEX 数据: ${hexString}`);
                            } else {
                                if (!connectionState.writeCharacteristic) {
                                    console.error(`[Xtoys 玩具多多] 设备 '${connectionState.device?.name || connectionState.device?.id}' 写入失败: 此端口的蓝牙特性不可用。`);
                                    throw new Error("此端口的蓝牙特性不可用。");
                                }
                                const logDeviceName = connectionState.xtoysDeviceId || connectionState.device?.name || connectionState.device?.id;
                                console.debug(`[Xtoys 玩具多多] 正在路由到设备 '${logDeviceName}' (XToys Device ID: ${incomingCommandId || 'N/A'})。已转换为 HEX ${hexString} 并发送到蓝牙设备...`);
                                await connectionState.writeCharacteristic.writeValueWithoutResponse(dataPacket);
                            }
                        } else {
                            console.warn(`[Xtoys 玩具多多] 设备 '${connectionState.device?.name || connectionState.device?.id}' 未生成数据包，跳过写入操作。`);
                        }
                    } catch (error) {
                        console.error(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 处理和写入数据失败:`, error);
                        // 如果是 JSON 解析错误，则特别记录
                        if (error instanceof SyntaxError && error.message.includes("JSON.parse")) {
                            console.error(`[Xtoys 玩具多多] 可能收到非 JSON 数据: ${new TextDecoder().decode(chunk).substring(0, 100)}...`);
                        }
                        throw error;
                    }
                },
                close: () => {
                    console.info(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 的可写流已关闭。`);
                    if (!DEBUG_MODE && connectionState.device?.gatt?.connected) {
                        removeConnectionState(connectionState.device.id);
                    }
                },
                abort: (err) => {
                    console.error(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 的可写流已中止:`, err);
                    if (!DEBUG_MODE && connectionState.device?.gatt?.connected) {
                        removeConnectionState(connectionState.device.id);
                    }
                }
            }),
            readable: new ReadableStream({
                start: (controller) => { console.info(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 的模拟可读流已启动。`); }
                // TODO: 如果需要从蓝牙设备接收数据并推送到 ReadableStream，需要在这里实现
                // 例如：在 handleNotifications 中将数据 enqueue 到 controller
            }),
            getInfo: () => ({
                usbVendorId: connectionState.usbVendorId,
                usbProductId: connectionState.usbProductId,
                bluetoothServiceClassId: connectionState.activeProtocol?.serviceUUID || '',
                deviceId: connectionState.device?.id,
                // 优先使用 XToys Device ID 作为显示名称，然后是内部设备名称，最后是通用蓝牙 ID
                deviceName: connectionState.xtoysDeviceId || connectionState.device?.name || `蓝牙设备 ${connectionState.device?.id?.substring(0, 8)}`
            }),
            open: async (options) => {
                console.info(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 的模拟端口已使用选项打开:`, options);
                return Promise.resolve();
            },
            close: async () => {
                console.info(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 的模拟端口 close() 方法被调用。`);
                try {
                    if (this.writable && !this.writable.locked) {
                        await this.writable.close();
                    }
                } catch (e) {
                    // 优化：处理预期的 'Cannot close a ERRORED writable stream' 错误
                    if (e.message.includes("Cannot close a ERRORED writable stream")) {
                        console.warn(`[Xtoys 玩具多多] 关闭设备 ${deviceFriendlyName} 的可写流时出错 (预期的错误，流可能已中止): ${e.message}`);
                    } else {
                        // 对于其他非预期错误，仍然作为警告或错误处理
                        console.warn(`[Xtoys 玩具多多] 关闭设备 ${deviceFriendlyName} 的可写流时出错: ${e.message}`);
                    }
                }
            },
            setSignals: async () => {},
            getSignals: async () => ({}),
            forget: async () => {
                console.info(`[Xtoys 玩具多多] 设备 ${deviceFriendlyName} 的 forget 方法被调用。正在断开连接。`);
                await mockPort.close();
            }
        };

        console.info(`[Xtoys 玩具多多] 已为设备 ${deviceFriendlyName} 创建模拟 SerialPort 对象。`, mockPort);
        return mockPort;
    }

    // --- 最终覆盖 ---
    if (unsafeWindow.navigator?.serial) {
        unsafeWindow.navigator.serial.requestPort = mockRequestPort;
        // 覆盖 getPorts 以返回所有当前活跃的模拟端口
        unsafeWindow.navigator.serial.getPorts = async () => {
            return Array.from(activeConnections.values()).map(conn => conn.mockPortInstance).filter(Boolean);
        };
        console.info('[Xtoys 玩具多多] 已成功拦截 navigator.serial.requestPort 和 getPorts。');
    } else {
        // 如果 navigator.serial 不存在，则创建完整的模拟 API
        Object.defineProperty(unsafeWindow.navigator, 'serial', {
            value: {
                requestPort: mockRequestPort,
                getPorts: async () => {
                    return Array.from(activeConnections.values()).map(conn => conn.mockPortInstance).filter(Boolean);
                }
            },
            writable: true
        });
        console.warn('[Xtoys 玩具多多] 未找到 navigator.serial，已创建模拟 API。');
    }

    // --- 前端UI提示框相关变量和函数 ---
    const customDialog = {};

    // 创建并添加对话框UI到DOM
    function createDialogUI() {
        // 创建一个临时的div来解析HTML字符串
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
            <div id="more-xtoys-message-dialog" role="dialog" aria-modal="true" class="q-dialog fullscreen no-pointer-events q-dialog--modal hidden" style="--q-transition-duration: 300ms;">
                <div class="q-dialog__backdrop fixed-full" aria-hidden="true" tabindex="-1" style="--q-transition-duration: 300ms;"></div>
                <div class="q-dialog__inner flex no-pointer-events q-dialog__inner--minimized q-dialog__inner--standard fixed-full flex-center" tabindex="-1" style="--q-transition-duration: 300ms;">
                    <div class="q-card q-card--dark q-dark column no-wrap" style="max-width: 900px; min-width: 400px;">
                        <div class="q-toolbar row no-wrap items-center text-white bg-primary-7" role="toolbar">
                            <div id="more-xtoys-dialog-title" class="q-toolbar__title ellipsis"></div>
                            <button id="more-xtoys-dialog-close-btn" class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" tabindex="0" type="button">
                                <span class="q-focus-helper"></span>
                                <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                    <i class="q-icon fas fa-times" aria-hidden="true" role="img"> </i>
                                </span>
                            </button>
                        </div>
                        <div class="q-card__section q-card__section--vert scroll q-pa-md" style="max-height: 85vh;">
                            <p id="more-xtoys-dialog-message" class="text-white"></p>
                        </div>
                        <div class="q-card__actions justify-end q-card__actions--horiz row">
                            <button id="more-xtoys-dialog-confirm-btn" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-green text-white q-btn--actionable q-focusable q-hoverable" tabindex="0" type="button">
                                <span class="q-focus-helper"></span>
                                <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                                    <span class="block">确认</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 从临时div中获取根对话框元素
        customDialog.messageDialog = tempDiv.firstElementChild;
        document.body.appendChild(customDialog.messageDialog);

        // 重新获取所有内部元素的引用
        customDialog.backdrop = customDialog.messageDialog.querySelector('.q-dialog__backdrop');
        customDialog.titleElement = customDialog.messageDialog.querySelector('#more-xtoys-dialog-title');
        customDialog.messageElement = customDialog.messageDialog.querySelector('#more-xtoys-dialog-message');
        customDialog.closeButton = customDialog.messageDialog.querySelector('#more-xtoys-dialog-close-btn');
        customDialog.confirmButton = customDialog.messageDialog.querySelector('#more-xtoys-dialog-confirm-btn');

        // 重新绑定事件监听器
        customDialog.messageDialog.addEventListener('click', (event) => {
            // Check if the click occurred on the backdrop or the close/confirm buttons
            if (event.target === customDialog.backdrop ||
                event.target === customDialog.closeButton ||
                event.target === customDialog.confirmButton ||
                customDialog.closeButton.contains(event.target) ||
                customDialog.confirmButton.contains(event.target)) {
                customDialog.messageDialog.classList.add('hidden');
                customDialog.messageDialog.classList.add('no-pointer-events'); // 重新添加
            }
        });
    }

    // 显示用户消息的函数
    function showUserMessage(title, message) {
        if (!customDialog.messageDialog || !document.body.contains(customDialog.messageDialog)) {
            createDialogUI(); // 确保对话框存在并已添加到DOM
        }
        customDialog.titleElement.textContent = title;
        customDialog.messageElement.textContent = message;
        // 显示模态对话框
        customDialog.messageDialog.classList.remove('hidden');
        customDialog.messageDialog.classList.remove('no-pointer-events'); // 移除以允许交互
    }

    // 在DOM内容加载完毕后创建UI
    document.addEventListener('DOMContentLoaded', createDialogUI);

})();
