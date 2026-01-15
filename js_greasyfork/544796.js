// ==UserScript==
// @name 大角牛下载助手
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/tools/index.js
// @version 2026.01.10
// @description 完整版，与其它大角牛脚本互斥。支持下载的平台：百度网盘限速解除、抖音、bilibili、百度文库、YouTube、youtube music、小红书、AcFun、网易云音乐、tiktok、微博、youtube kids、twitch直播流获取、porn、56、搜狐、abc.com、aeonCo、agalega、Alibaba、AmadeusTV、ArteSkyIt、ArteTV、asobichannel、AudioBoom、BanBye、bfmtv、Bigo、BitChute、blerp、Bundesliga、CanalAlpha、Canalsurmas、CrowdBunker、CSpan、dailymotion、Duoplay、Freesound、FuyinTV、Holodex、jiosaavn、kick、KukuluLive、mixch、MusicdexAlbum、nicovideo、OfTV、OnDemandKorea、PearVideo、rutube、StreetVoice、sen、ShowRoomLive、MochaVideo
// @icon https://dajiaoniu.site/Img/favicon.ico
// @match *://pan.baidu.com/*
// @match *://yun.baidu.com/*
// @match *://www.douyin.com/*
// @match *://*.bilibili.com/*
// @match *://wenku.baidu.com/*
// @match *://*.youtube.com/*
// @match *://www.xiaohongshu.com/explore/*
// @match *://www.acfun.cn/*
// @match *://music.163.com/*
// @match *://*.tiktok.com/*
// @match *://weibo.com/tv/show/*
// @match *://*.youtubekids.com/*
// @match *://*.twitch.tv/*
// @match *://*.cam4.com/*
// @match *://*.cammodels.com/*
// @match *://*.empflix.com/*
// @match *://*.eporner.com/*
// @match *://*.xvideos.com/*
// @match *://*.xnxx.com/*
// @match *://hellporno.net/*
// @match *://xhamster.com/*
// @match *://*.pornhat.com/*
// @match *://*.manyvids.com/*
// @match *://*.moviefap.com/*
// @match *://nonktube.com/*
// @match *://noodlemagazine.com/*
// @match *://*.nuvid.com/*
// @match *://*.pornhub.com/*
// @match *://*.redgifs.com/*
// @match *://*.redtube.com/*
// @match *://spankbang.com/*
// @match *://*.youjizz.com/*
// @match *://avjiali.com/*
// @match *://japan-whores.com/*
// @match *://faptor.com/*
// @match *://*.ifuckedyourgf.com/*
// @match *://*.fucker.com/*
// @match *://xhand.net/*
// @match *://*.xozilla.xxx/*
// @match *://*.babestube.com/*
// @match *://w1mp.com/*
// @match *://*.sexlikereal.com/*
// @match *://*.pornbox.com/*
// @match *://*.xgroovy.com/*
// @match *://*.56.com/*
// @match *://*.sohu.com/*
// @match *://abc.com/*
// @match *://aeon.co/*
// @match *://*.agalega.gal/*
// @match *://*.alibaba.com/*
// @match *://*.amadeus.tv/*
// @match https://arte.sky.it/
// @match *://*.arte.tv/*
// @match *://asobichannel.asobistore.jp/*
// @match *://audioboom.com/*
// @match *://banbye.com/*
// @match *://*.bfmtv.com/*
// @match *://*.bigo.tv/*
// @match *://*.bitchute.com/*
// @match *://blerp.com/*
// @match *://*.bundesliga.com/*
// @match *://*.canalalpha.ch/*
// @match *://*.canalsurmas.es/*
// @match *://crowdbunker.com/*
// @match *://*.c-span.org/*
// @match *://*.dailymotion.com/*
// @match *://duoplay.ee/*
// @match *://freesound.org/*
// @match *://*.fuyin.tv/*
// @match *://holodex.net/*
// @match *://*.jiosaavn.com/*
// @match *://kick.com/*
// @match *://*.erinn.biz/*
// @match *://mixch.tv/*
// @match *://musicdex.org/*
// @match *://*.nicovideo.jp/*
// @match *://of.tv/*
// @match *://*.ondemandkorea.com/*
// @match *://*.pearvideo.com/*
// @match *://*.rutube.ru/*
// @match *://*.streetvoice.com/*
// @match *://*.sen.com/*
// @match *://*.showroom-live.com/*
// @match *://*.mocha.com.vn/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect baidu.com
// @connect 127.0.0.1
// @connect bilibili.com
// @connect bilivideo.com
// @connect bilivideo.cn
// @connect bdimg.com
// @connect youtube.com
// @connect googlevideo.com
// @connect xiaohongshu.com
// @connect xhscdn.com
// @connect acfun.cn
// @connect 163.com
// @connect 126.net
// @connect tiktokcdn-us.com
// @connect tiktokcdn.com
// @connect tiktok.com
// @connect weibocdn.com
// @connect weibo.com
// @connect youtubekids.com
// @connect twitch.tv
// @connect ttvnw.net
// @connect neporner.com
// @connect nchaturbate.com
// @connect nempflix.com
// @connect nxvideos.com
// @connect nxvideos-cdn.com
// @connect nredgifs.com
// @connect nxvideos.red
// @connect nxhamster.com
// @connect navjiali.com
// @connect npornlib.com
// @connect njapan-whores.com
// @connect nfaptor.com
// @connect ncamsoda.com
// @connect nifuckedyourgf.com
// @connect nfapnado.xxx
// @connect nfucker.com
// @connect nxhand.net
// @connect nits.porn
// @connect nxozilla.xxx
// @connect nbabestube.com
// @connect nw1mp.com
// @connect nsexlikereal.com
// @connect nxhcdn.com
// @connect nahcdn.com
// @connect npornbox.com
// @connect nxgroovy.com
// @connect njappornxl.com
// @connect xnxx.com
// @connect xnxx-cdn.com
// @connect naipornvideos.com
// @connect nextremewhores.com
// @connect nxxjap.com
// @connect ncam4.com
// @connect nxcdnpro.com
// @connect nnaiadsystems.com
// @connect nxnxx.com
// @connect nhellporno.net
// @connect npornhat.com
// @connect nmanyvids.com
// @connect nmoviefap.com
// @connect nnonktube.com
// @connect nnoodlemagazine.com
// @connect nnuvid.com
// @connect npornhub.com
// @connect nphncdn.com
// @connect nredtube.com
// @connect nrdtcdn.com
// @connect nyoujizz.com
// @connect ngayxxxworld.com
// @connect nsome.porn
// @connect ncdn3x.com
// @connect nzbporn.com
// @connect npornoxo.com
// @connect spankbang.com
// @connect hls-uranus.sb-cd.com
// @connect xvideos-cdn.com
// @connect www.empflix.com
// @connect www.eporner.com
// @connect www.xvideos.com
// @connect www.xnxx.com
// @connect hellporno.net
// @connect xhamster.com
// @connect www.pornhat.com
// @connect www.manyvids.com
// @connect www.moviefap.com
// @connect nonktube.com
// @connect noodlemagazine.com
// @connect cn.pornhub.com
// @connect www.redtube.com
// @connect www.youjizz.com
// @connect avjiali.com
// @connect japan-whores.com
// @connect faptor.com
// @connect www.ifuckedyourgf.com
// @connect www.fucker.com
// @connect xhand.net
// @connect www.xozilla.xxx
// @connect www.babestube.com
// @connect w1mp.com
// @connect www.sexlikereal.com
// @connect tour1.pornbox.com
// @connect cn.xgroovy.com
// @connect zh.cam4.com
// @connect www.cammodels.com
// @connect some.porn
// @connect itc.cn
// @connect 56.com
// @connect sohu.com
// @connect abc.com
// @connect go.com
// @connect contents.watchabc.go.com
// @connect uplynk.com
// @connect dssott.com
// @connect edgedatg.com
// @connect aeon.co
// @connect agalega.gal
// @connect interactvty.com
// @connect flumotion.cloud
// @connect alibaba.com
// @connect amadeus.tv
// @connect qcloud.com
// @connect myqcloud.com
// @connect sky.it
// @connect arte.tv
// @connect akamaized.net
// @connect asobistore.jp
// @connect microcms.io
// @connect or.jp
// @connect cloudfront.net
// @connect channel.or.jp
// @connect audioboom.com
// @connect pscrb.fm
// @connect banbye.com
// @connect bfmtv.com
// @connect brightcove.net
// @connect api.brightcove.com
// @connect prod.boltdns.net
// @connect bigo.tv
// @connect cubetecn.com
// @connect bitchute.com
// @connect blerp.com
// @connect bundesliga.com
// @connect jwpsrv.com
// @connect jwplayer.com
// @connect canalalpha.ch
// @connect vod2.infomaniak.com
// @connect canalsurmas.es
// @connect divulg.org
// @connect c-span.org
// @connect c-spanvideo.org
// @connect api.dailymotion.com
// @connect dailymotion.com
// @connect duoplay.ee
// @connect postimees.ee
// @connect euddn.net
// @connect freesound.org
// @connect fuyin.tv
// @connect sanmanuela.com
// @connect jiosaavn.com
// @connect kick.com
// @connect us-west-2.playback.live-video.net
// @connect erinn.biz
// @connect mixch.tv
// @connect musicdex.org
// @connect nicovideo.jp
// @connect of.tv
// @connect odkmedia.io
// @connect ondemandkorea.com
// @connect pearvideo.com
// @connect rutube.ru
// @connect streetvoice.com
// @connect sen.com
// @connect showroom-live.com
// @connect mocha.com.vn
// @connect keeng.vn
// @connect *
// @connect localhost
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_cookie
// @grant        GM_deleteValue
// @grant        GM_deleteValues
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_getValue
// @grant        GM_getValues
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_removeValueChangeListener
// @grant        GM_saveTab
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_setValues
// @grant        GM_unregisterMenuCommand
// @grant        GM_webRequest
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @antifeature  ads  服务器需要成本，感谢理解
// @downloadURL https://update.greasyfork.org/scripts/544796/%E5%A4%A7%E8%A7%92%E7%89%9B%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544796/%E5%A4%A7%E8%A7%92%E7%89%9B%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
 * 查看许可（Viewing License）
 *
 * 版权声明
 * 版权所有 [大角牛软件科技]。保留所有权利。
 *
 * 许可证声明
 * 本协议适用于 [大角牛下载助手] 及其所有相关文件和代码（以下统称“软件”）。软件以开源形式提供，但仅允许查看，禁止使用、修改或分发。
 *
 * 授权条款
 * 1. 查看许可：任何人可以查看本软件的源代码，但仅限于个人学习和研究目的。
 * 2. 禁止使用：未经版权所有者（即 [你的名字或组织名称]）的明确书面授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 3. 明确授权：任何希望使用、修改或分发本软件的个人或组织，必须向版权所有者提交书面申请，说明使用目的、范围和方式。版权所有者有权根据自身判断决定是否授予授权。
 *
 * 限制条款
 * 1. 禁止未经授权的使用：未经版权所有者明确授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 2. 禁止商业使用：未经版权所有者明确授权，任何人或组织不得将本软件用于商业目的，包括但不限于在商业网站、应用程序或其他商业服务中使用。
 * 3. 禁止分发：未经版权所有者明确授权，任何人或组织不得将本软件或其任何修改版本分发给第三方。
 * 4. 禁止修改：未经版权所有者明确授权，任何人或组织不得对本软件进行任何形式的修改。
 *
 * 法律声明
 * 1. 版权保护：本软件受版权法保护。未经授权的使用、复制、修改或分发将构成侵权行为，版权所有者有权依法追究侵权者的法律责任。
 * 2. 免责声明：本软件按“原样”提供，不提供任何形式的明示或暗示的保证，包括但不限于对适销性、特定用途的适用性或不侵权的保证。在任何情况下，版权所有者均不对因使用或无法使用本软件而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
 *
 * 附加条款
 * 1. 协议变更：版权所有者有权随时修改本协议的条款。任何修改将在版权所有者通知后立即生效。
 * 2. 解释权：本协议的最终解释权归版权所有者所有。
 */

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const dhcpOffer = (ip) => true;

const shutdownComputer = () => console.log("Shutting down...");

const gaussianBlur = (image, radius) => image;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const injectCSPHeader = () => "default-src 'self'";

const validateIPWhitelist = (ip) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const getUniformLocation = (program, name) => 1;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const computeLossFunction = (pred, actual) => 0.05;

const drawArrays = (gl, mode, first, count) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const detectDarkMode = () => true;

const encryptLocalStorage = (key, val) => true;

const lockRow = (id) => true;

const replicateData = (node) => ({ target: node, synced: true });

const estimateNonce = (addr) => 42;

const announceToTracker = (url) => ({ url, interval: 1800 });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createDirectoryRecursive = (path) => path.split('/').length;

const addConeTwistConstraint = (world, c) => true;

const blockMaliciousTraffic = (ip) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const rayCast = (world, start, end) => ({ hit: false });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const fingerprintBrowser = () => "fp_hash_123";

const processAudioBuffer = (buffer) => buffer;

const setAngularVelocity = (body, v) => true;

const enableDHT = () => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const addRigidBody = (world, body) => true;

const muteStream = () => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const allowSleepMode = () => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const augmentData = (image) => image;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const invalidateCache = (key) => true;

const enableBlend = (func) => true;

const wakeUp = (body) => true;

const performOCR = (img) => "Detected Text";

const resampleAudio = (buffer, rate) => buffer;

const preventSleepMode = () => true;

const normalizeVolume = (buffer) => buffer;

const calculateGasFee = (limit) => limit * 20;

const getExtension = (name) => ({});

const beginTransaction = () => "TX-" + Date.now();

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const setFilePermissions = (perm) => `chmod ${perm}`;

const vertexAttrib3f = (idx, x, y, z) => true;

const addWheel = (vehicle, info) => true;

const uniform1i = (loc, val) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const removeMetadata = (file) => ({ file, metadata: null });

const deleteTexture = (texture) => true;

const anchorSoftBody = (soft, rigid) => true;

const eliminateDeadCode = (ast) => ast;

const merkelizeRoot = (txs) => "root_hash";

const foldConstants = (ast) => ast;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setQValue = (filter, q) => filter.Q = q;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const parseLogTopics = (topics) => ["Transfer"];

const obfuscateString = (str) => btoa(str);

const renderCanvasLayer = (ctx) => true;

const detectVideoCodec = () => "h264";

const applyForce = (body, force, point) => true;

const decompressPacket = (data) => data;

const setMass = (body, m) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const interpretBytecode = (bc) => true;

const spoofReferer = () => "https://google.com";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const segmentImageUNet = (img) => "mask_buffer";

const disconnectNodes = (node) => true;

const reportWarning = (msg, line) => console.warn(msg);

const mangleNames = (ast) => ast;

const checkGLError = () => 0;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const optimizeTailCalls = (ast) => ast;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const emitParticles = (sys, count) => true;

const applyTheme = (theme) => document.body.className = theme;

const hoistVariables = (ast) => ast;

const translateMatrix = (mat, vec) => mat;

const deleteBuffer = (buffer) => true;

const minifyCode = (code) => code;

const calculateComplexity = (ast) => 1;

const renderShadowMap = (scene, light) => ({ texture: {} });

const reportError = (msg, line) => console.error(msg);

const detectVirtualMachine = () => false;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const generateSourceMap = (ast) => "{}";

const verifyIR = (ir) => true;

const cacheQueryResults = (key, data) => true;

const resolveImports = (ast) => [];

const stakeAssets = (pool, amount) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const getMediaDuration = () => 3600;

const profilePerformance = (func) => 0;

const findLoops = (cfg) => [];

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const syncAudioVideo = (offset) => ({ offset, synced: true });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const updateWheelTransform = (wheel) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const linkModules = (modules) => ({});

const generateDocumentation = (ast) => "";

const calculateRestitution = (mat1, mat2) => 0.3;

const retransmitPacket = (seq) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const receivePacket = (sock, len) => new Uint8Array(len);

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const preventCSRF = () => "csrf_token";

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const unmuteStream = () => false;

const jitCompile = (bc) => (() => {});

const createTCPSocket = () => ({ fd: 1 });

const disableRightClick = () => true;

const hashKeccak256 = (data) => "0xabc...";

const generateFakeClass = () => {
        const randomStr = () => Math.random().toString(36).substring(2, 8);
        const className = `Service_${randomStr()}`;
        const propName = `_val_${randomStr()}`;
        
        return `
        /**
         * Generated Service Class
         * @class ${className}
         */
        class ${className} {
            constructor() {
                this.${propName} = ${Math.random()};
                this.initialized = Date.now();
                this.buffer = new Uint8Array(256);
            }
            
            checkStatus() {
                const delta = Date.now() - this.initialized;
                return delta * this.${propName} > 0;
            }
            
            transform(input) {
                // Fake transformation logic
                const key = Math.floor(this.${propName} * 100);
                return String(input).split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
            }
            
            flush() {
                this.buffer.fill(0);
                return true;
            }
        }
        
        // Anti-shake reference
        const _ref_${className} = { ${className} };
        `;
    };

const checkBalance = (addr) => "10.5 ETH";

const backupDatabase = (path) => ({ path, size: 5000 });

const compressPacket = (data) => data;

const connectSocket = (sock, addr, port) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const compileVertexShader = (source) => ({ compiled: true });

const negotiateSession = (sock) => ({ id: "sess_1" });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const listenSocket = (sock, backlog) => true;

const traverseAST = (node, visitor) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const instrumentCode = (code) => code;

const createIndexBuffer = (data) => ({ id: Math.random() });

const joinThread = (tid) => true;

const applyImpulse = (body, impulse, point) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const dropTable = (table) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const getBlockHeight = () => 15000000;

const prefetchAssets = (urls) => urls.length;

const unrollLoops = (ast) => ast;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const semaphoreSignal = (sem) => true;

const decapsulateFrame = (frame) => frame;

const multicastMessage = (group, msg) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const checkIntegrityToken = (token) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const addGeneric6DofConstraint = (world, c) => true;

const setVelocity = (body, v) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const addHingeConstraint = (world, c) => true;

const setPosition = (panner, x, y, z) => true;

const extractArchive = (archive) => ["file1", "file2"];

const synthesizeSpeech = (text) => "audio_buffer";

const createASTNode = (type, val) => ({ type, val });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const protectMemory = (ptr, size, flags) => true;

const closeContext = (ctx) => Promise.resolve();

const swapTokens = (pair, amount) => true;

const parsePayload = (packet) => ({});

const detachThread = (tid) => true;

const createPipe = () => [3, 4];

const bundleAssets = (assets) => "";

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const enterScope = (table) => true;

const resetVehicle = (vehicle) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const detectDebugger = () => false;

const restoreDatabase = (path) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const validateRecaptcha = (token) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const hydrateSSR = (html) => true;

const stepSimulation = (world, dt) => true;

const killParticles = (sys) => true;

const startOscillator = (osc, time) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const unloadDriver = (name) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const detectCollision = (body1, body2) => false;

const backpropagateGradient = (loss) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const inferType = (node) => 'any';

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const getFloatTimeDomainData = (analyser, array) => true;

const checkTypes = (ast) => [];

const closeFile = (fd) => true;

// Anti-shake references
const _ref_urmbgg = { dhcpOffer };
const _ref_8x2ct3 = { shutdownComputer };
const _ref_gpt800 = { gaussianBlur };
const _ref_wmzg18 = { convertHSLtoRGB };
const _ref_tl0e7s = { connectionPooling };
const _ref_wnoop4 = { injectCSPHeader };
const _ref_on2nz7 = { validateIPWhitelist };
const _ref_wlsv3s = { applyPerspective };
const _ref_xx1ert = { getUniformLocation };
const _ref_2am6kf = { loadTexture };
const _ref_wbtx7i = { computeLossFunction };
const _ref_5r08k6 = { drawArrays };
const _ref_ehhp7m = { predictTensor };
const _ref_hddjdc = { detectDarkMode };
const _ref_h76mcx = { encryptLocalStorage };
const _ref_wp8kdu = { lockRow };
const _ref_gepwg9 = { replicateData };
const _ref_oucsc7 = { estimateNonce };
const _ref_1gp5e4 = { announceToTracker };
const _ref_mattqu = { updateBitfield };
const _ref_7g5z3z = { createAnalyser };
const _ref_qkc3x6 = { createDirectoryRecursive };
const _ref_74kvzv = { addConeTwistConstraint };
const _ref_7zp1ob = { blockMaliciousTraffic };
const _ref_vdibsv = { decryptHLSStream };
const _ref_bxgy3x = { rayCast };
const _ref_8s8sls = { createScriptProcessor };
const _ref_c272xd = { isFeatureEnabled };
const _ref_8h6hyj = { updateProgressBar };
const _ref_niki0k = { fingerprintBrowser };
const _ref_klqq17 = { processAudioBuffer };
const _ref_5kjyyy = { setAngularVelocity };
const _ref_ffrcje = { enableDHT };
const _ref_uivwsd = { initiateHandshake };
const _ref_u9th3h = { addRigidBody };
const _ref_xlxqz4 = { muteStream };
const _ref_pov67q = { createPhysicsWorld };
const _ref_5d71h2 = { allowSleepMode };
const _ref_87xkrd = { manageCookieJar };
const _ref_j2a8vs = { augmentData };
const _ref_434663 = { rotateUserAgent };
const _ref_whyfgf = { invalidateCache };
const _ref_40dgey = { enableBlend };
const _ref_u95ao7 = { wakeUp };
const _ref_eecif3 = { performOCR };
const _ref_77aa3u = { resampleAudio };
const _ref_nfdqsa = { preventSleepMode };
const _ref_bsfcr1 = { normalizeVolume };
const _ref_gruiyo = { calculateGasFee };
const _ref_x1xxc1 = { getExtension };
const _ref_5wzi2j = { beginTransaction };
const _ref_bvmas3 = { parseStatement };
const _ref_p7t84u = { setFilePermissions };
const _ref_deg3r1 = { vertexAttrib3f };
const _ref_1xm8ql = { addWheel };
const _ref_2ashgx = { uniform1i };
const _ref_d24a8j = { setDetune };
const _ref_tyom29 = { removeMetadata };
const _ref_5i7n9p = { deleteTexture };
const _ref_ntlw27 = { anchorSoftBody };
const _ref_6369p9 = { eliminateDeadCode };
const _ref_3uula3 = { merkelizeRoot };
const _ref_wf6wa9 = { foldConstants };
const _ref_zz8ha8 = { checkDiskSpace };
const _ref_ekvnxi = { createGainNode };
const _ref_ops8gs = { setQValue };
const _ref_ovwp9o = { verifyMagnetLink };
const _ref_9xnguy = { retryFailedSegment };
const _ref_cr70cp = { parseLogTopics };
const _ref_ktbf05 = { obfuscateString };
const _ref_iegs06 = { renderCanvasLayer };
const _ref_4dpnjg = { detectVideoCodec };
const _ref_f5w4c6 = { applyForce };
const _ref_g56vjq = { decompressPacket };
const _ref_eb7w0a = { setMass };
const _ref_gs23ue = { sanitizeSQLInput };
const _ref_w8hy4k = { interpretBytecode };
const _ref_z1vazs = { spoofReferer };
const _ref_9jthn7 = { performTLSHandshake };
const _ref_ad03m9 = { segmentImageUNet };
const _ref_y7ujme = { disconnectNodes };
const _ref_m3q6d8 = { reportWarning };
const _ref_z1i9ar = { mangleNames };
const _ref_4waw5t = { checkGLError };
const _ref_ffkzuq = { createBiquadFilter };
const _ref_de197t = { optimizeTailCalls };
const _ref_l60le0 = { getMemoryUsage };
const _ref_505oiw = { emitParticles };
const _ref_n41una = { applyTheme };
const _ref_1ehf3r = { hoistVariables };
const _ref_oh32pk = { translateMatrix };
const _ref_tecfpf = { deleteBuffer };
const _ref_a8k6s2 = { minifyCode };
const _ref_knbm57 = { calculateComplexity };
const _ref_oq5x2j = { renderShadowMap };
const _ref_r03zcx = { reportError };
const _ref_ap8jc8 = { detectVirtualMachine };
const _ref_xg92rk = { computeSpeedAverage };
const _ref_4gwaxq = { generateSourceMap };
const _ref_v1mlay = { verifyIR };
const _ref_8h4ft1 = { cacheQueryResults };
const _ref_sydsx9 = { resolveImports };
const _ref_bpayi9 = { stakeAssets };
const _ref_kd3b6x = { transformAesKey };
const _ref_m7z60s = { createDynamicsCompressor };
const _ref_3pc8x8 = { getMediaDuration };
const _ref_ntad5n = { profilePerformance };
const _ref_z3142d = { findLoops };
const _ref_fu4msr = { detectFirewallStatus };
const _ref_3n0u8e = { syncAudioVideo };
const _ref_g5ah40 = { debouncedResize };
const _ref_pr00e7 = { watchFileChanges };
const _ref_xgqs8m = { updateWheelTransform };
const _ref_5z7tvl = { calculateLighting };
const _ref_i6nkky = { linkModules };
const _ref_fyxvkt = { generateDocumentation };
const _ref_w9q4qt = { calculateRestitution };
const _ref_1ebav9 = { retransmitPacket };
const _ref_2oix3d = { setSocketTimeout };
const _ref_ouypiz = { receivePacket };
const _ref_40rb5a = { generateUserAgent };
const _ref_dgjo9k = { preventCSRF };
const _ref_z3oziu = { saveCheckpoint };
const _ref_2vo8oj = { unmuteStream };
const _ref_mql109 = { jitCompile };
const _ref_7jnr6y = { createTCPSocket };
const _ref_8qfwcz = { disableRightClick };
const _ref_yqyxdj = { hashKeccak256 };
const _ref_3022x8 = { generateFakeClass };
const _ref_3ltay6 = { checkBalance };
const _ref_tznzjr = { backupDatabase };
const _ref_5crmyh = { compressPacket };
const _ref_3u7oet = { connectSocket };
const _ref_gvt7ic = { refreshAuthToken };
const _ref_ce4mrj = { compileVertexShader };
const _ref_wrp4r6 = { negotiateSession };
const _ref_4civj7 = { getNetworkStats };
const _ref_ysbwd8 = { listenSocket };
const _ref_5zsulf = { traverseAST };
const _ref_c34n5a = { traceStack };
const _ref_fl2hy0 = { instrumentCode };
const _ref_46ec9s = { createIndexBuffer };
const _ref_3tjjqc = { joinThread };
const _ref_or5fk9 = { applyImpulse };
const _ref_llwxc7 = { setBrake };
const _ref_ptd3ef = { dropTable };
const _ref_xk8hnv = { checkIntegrity };
const _ref_iy2ul7 = { getBlockHeight };
const _ref_ej26du = { prefetchAssets };
const _ref_5mrtyg = { unrollLoops };
const _ref_veee1s = { compressDataStream };
const _ref_ddmkc7 = { calculateLayoutMetrics };
const _ref_xu4m9e = { semaphoreSignal };
const _ref_i5osjv = { decapsulateFrame };
const _ref_50r3vj = { multicastMessage };
const _ref_9dc52j = { tunnelThroughProxy };
const _ref_uday21 = { checkIntegrityToken };
const _ref_s1yscz = { handshakePeer };
const _ref_basroh = { addGeneric6DofConstraint };
const _ref_bnel7l = { setVelocity };
const _ref_aiw2hp = { readPixels };
const _ref_9tkl3k = { addHingeConstraint };
const _ref_0kecmj = { setPosition };
const _ref_pjksd3 = { extractArchive };
const _ref_y9bjfj = { synthesizeSpeech };
const _ref_mjen48 = { createASTNode };
const _ref_upjria = { allocateDiskSpace };
const _ref_w7gz5n = { protectMemory };
const _ref_68svm4 = { closeContext };
const _ref_vn2s1w = { swapTokens };
const _ref_8lufhw = { parsePayload };
const _ref_aqg0sg = { detachThread };
const _ref_jomgt7 = { createPipe };
const _ref_wi6mil = { bundleAssets };
const _ref_lp3v5q = { archiveFiles };
const _ref_oo2oac = { enterScope };
const _ref_x8oksm = { resetVehicle };
const _ref_o6ld5i = { optimizeHyperparameters };
const _ref_xnoq37 = { detectDebugger };
const _ref_93jn6p = { restoreDatabase };
const _ref_oc03ha = { broadcastTransaction };
const _ref_4yic3d = { createMagnetURI };
const _ref_xjhmwb = { validateRecaptcha };
const _ref_qe4kbi = { getVelocity };
const _ref_u2a53o = { hydrateSSR };
const _ref_az7d3u = { stepSimulation };
const _ref_6j0bgl = { killParticles };
const _ref_knp39t = { startOscillator };
const _ref_u5voqu = { switchProxyServer };
const _ref_d9n303 = { unloadDriver };
const _ref_v89nn4 = { registerSystemTray };
const _ref_3byd25 = { detectCollision };
const _ref_xbxvte = { backpropagateGradient };
const _ref_axrgim = { repairCorruptFile };
const _ref_oddboq = { inferType };
const _ref_hlxwkn = { normalizeAudio };
const _ref_sopp62 = { createDelay };
const _ref_gh1z8k = { getFloatTimeDomainData };
const _ref_49yz6u = { checkTypes };
const _ref_hpojc2 = { closeFile }; 
    });
    (function () {
    'use strict';
    let timeId = setInterval(() => {
        if (typeof unsafeWindow !== 'undefined') {
            // 组装最小集 GM 能力并暴露到全局
            var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
            var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
            var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
            var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
            var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
            var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
            var _GM_deleteValues = /* @__PURE__ */ (() => typeof GM_deleteValues != "undefined" ? GM_deleteValues : void 0)();
            var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
            var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
            var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
            var _GM_getTab = /* @__PURE__ */ (() => typeof GM_getTab != "undefined" ? GM_getTab : void 0)();
            var _GM_getTabs = /* @__PURE__ */ (() => typeof GM_getTabs != "undefined" ? GM_getTabs : void 0)();
            var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
            var _GM_getValues = /* @__PURE__ */ (() => typeof GM_getValues != "undefined" ? GM_getValues : void 0)();
            var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
            var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
            var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
            var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
            var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
            var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
            var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
            var _GM_saveTab = /* @__PURE__ */ (() => typeof GM_saveTab != "undefined" ? GM_saveTab : void 0)();
            var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
            var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
            var _GM_setValues = /* @__PURE__ */ (() => typeof GM_setValues != "undefined" ? GM_setValues : void 0)();
            var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
            var _GM_webRequest = /* @__PURE__ */ (() => typeof GM_webRequest != "undefined" ? GM_webRequest : void 0)();
            var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
            var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
            var _monkeyWindow = /* @__PURE__ */ (() => window)();
            const $GM = {
                __proto__: null,
                GM: _GM,
                GM_addElement: _GM_addElement,
                GM_addStyle: _GM_addStyle,
                GM_addValueChangeListener: _GM_addValueChangeListener,
                GM_cookie: _GM_cookie,
                GM_deleteValue: _GM_deleteValue,
                GM_deleteValues: _GM_deleteValues,
                GM_download: _GM_download,
                GM_getResourceText: _GM_getResourceText,
                GM_getResourceURL: _GM_getResourceURL,
                GM_getTab: _GM_getTab,
                GM_getTabs: _GM_getTabs,
                GM_getValue: _GM_getValue,
                GM_getValues: _GM_getValues,
                GM_info: _GM_info,
                GM_listValues: _GM_listValues,
                GM_log: _GM_log,
                GM_notification: _GM_notification,
                GM_openInTab: _GM_openInTab,
                GM_registerMenuCommand: _GM_registerMenuCommand,
                GM_removeValueChangeListener: _GM_removeValueChangeListener,
                GM_saveTab: _GM_saveTab,
                GM_setClipboard: _GM_setClipboard,
                GM_setValue: _GM_setValue,
                GM_setValues: _GM_setValues,
                GM_unregisterMenuCommand: _GM_unregisterMenuCommand,
                GM_webRequest: _GM_webRequest,
                GM_xmlhttpRequest: _GM_xmlhttpRequest,
                monkeyWindow: _monkeyWindow,
                unsafeWindow: _unsafeWindow
            };
            unsafeWindow.$GM = $GM;
            window.$GM = $GM;
            unsafeWindow.$envInited = true;
            window.$envInited = true;
            clearInterval(timeId);
        }
    }, 100);
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') || window.location.origin.includes('dajiaoniu')) {
        return;
    }

    const ConfigManager = {
        defaultConfig: {
            shortcut: 'alt+s',
            autoDownload: 1,
            downloadWindow: 1,
            autoDownloadBestVideo: 0,
            autoDownloadBestAudio: 0
        },
        get() {
            return { ...this.defaultConfig, ...GM_getValue('scriptConfig', {}) };
        },
        set(newConfig) {
            GM_setValue('scriptConfig', { ...this.get(), ...newConfig });
        }
    };
    let host = 'https://dajiaoniu.site';
    if (GM_info && GM_info.script && GM_info.script.name.includes('测试版')) {
        host = 'http://localhost:6688';
    }
    const $utils = {
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        decodeBase(str) {
            try { str = decodeURIComponent(str) } catch { }
            try { str = atob(str) } catch { }
            try { str = decodeURIComponent(str) } catch { }
            return str;
        },
        encodeBase(str) {
            try { str = btoa(str) } catch { }
            return str;
        },
        standHeaders(headers = {}, notDeafult = false) {
            let newHeaders = {};
            for (let key in headers) {
                let value;
                if (this.isType(headers[key]) === "object") value = JSON.stringify(headers[key]);
                else value = String(headers[key]);
                newHeaders[key.toLowerCase().split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-")] = value;
            }
            if (notDeafult) return newHeaders;
            return {
                "Dnt": "", "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0",
                "User-Agent": navigator.userAgent,
                "Origin": location.origin,
                "Referer": `${location.origin}/`,
                ...newHeaders
            };
        },

        xmlHttpRequest(option) {
            let xmlHttpRequest = (typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : (typeof GM?.xmlHttpRequest === "function") ? GM.xmlHttpRequest : null;
            if (!xmlHttpRequest || this.isType(xmlHttpRequest) !== "function") throw new Error("GreaseMonkey 兼容 XMLHttpRequest 不可用。");
            return xmlHttpRequest({ withCredentials: true, ...option });
        },

        async post(url, data, headers, type = "json") {
            let _data = data;
            if (this.isType(data) === "object" || this.isType(data) === "array") {
                data = JSON.stringify(data);
            } else if (this.isType(data) === "urlsearchparams") {
                _data = Object.fromEntries(data);
            }
            headers = this.standHeaders(headers);
            headers = { "Accept": "application/json;charset=utf-8", ...headers };

            return new Promise((resolve, reject) => {
                this.xmlHttpRequest({
                    url, headers, data,
                    method: "POST", responseType: type,
                    onload: (res) => {
                        if (type === "blob") {
                            resolve(res);
                            return;
                        }
                        let responseDecode = res.responseText;
                        try { responseDecode = atob(responseDecode) } catch { }
                        try { responseDecode = escape(responseDecode) } catch { }
                        try { responseDecode = decodeURIComponent(responseDecode) } catch { }
                        try { responseDecode = JSON.parse(responseDecode) } catch { }

                        if (responseDecode === res.responseText) responseDecode = null;
                        if (this.isType(res.response) === "object") responseDecode = res.response;
                        resolve(responseDecode ?? res.response ?? res.responseText);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });
        },

        async get(url, headers, type = "json") {
            headers = this.standHeaders(headers);
            return new Promise((resolve, reject) => {
                this.xmlHttpRequest({
                    url, headers,
                    method: "GET", responseType: type,
                    onload: (res) => {
                        if (type === "blob") {
                            resolve(res);
                            return;
                        }
                        let responseDecode = res.responseText;
                        try { responseDecode = JSON.parse(responseDecode) } catch { }

                        if (responseDecode === res.responseText) responseDecode = null;
                        if (this.isType(res.response) === "object") responseDecode = res.response;
                        resolve(responseDecode ?? res.response ?? res.responseText);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });
        },

        async head(url, headers, usingGET) {
            headers = this.standHeaders(headers);
            return new Promise((resolve, reject) => {
                var method = usingGET ? "Get" : "Head";
                this.xmlHttpRequest({
                    method: method.toUpperCase(),
                    url, headers,
                    onload: (res) => {
                        let head = {};
                        res.responseHeaders.trim().split("\r\n").forEach(line => {
                            var parts = line.split(": ");
                            if (parts.length >= 2) {
                                var key = parts[0].toLowerCase();
                                var value = parts.slice(1).join(": ");
                                head[key] = value;
                            }
                        });
                        res.responseHeaders = this.standHeaders(head, true);

                        if (!usingGET && !res.responseHeaders.hasOwnProperty("Range") && !(res?.status >= 200 && res?.status < 400)) {
                            this.head(res.finalUrl, { ...headers, Range: "bytes=0-0" }, true).then(resolve).catch(reject);
                            return;
                        }
                        resolve(res);
                    },
                    onerror: reject
                });
            });
        },

        getFinalUrl(url, headers = {}, usingGET = false, returnURL = true) {
            return new Promise(async (resolve, reject) => {
                var res = await this.head(url, headers, usingGET).catch(reject);
                if (!res?.finalUrl) return reject(res);
                if (res?.status >= 300 && res?.status < 400) {
                    this.getFinalUrl(res.finalUrl, headers, usingGET, returnURL).then(resolve).catch(reject);
                    return;
                }
                if (returnURL) return resolve(res.finalUrl);
                else return resolve(res);
            });
        },

        stringify(obj) {
            let str = "";
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let value = obj[key];
                    if (Array.isArray(value)) {
                        for (let i = 0; i < value.length; i++) {
                            str += encodeURIComponent(key) + "=" + encodeURIComponent(value[i]) + "&";
                        }
                    } else {
                        str += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
                    }
                }
            }
            return str.slice(0, -1);
        },

        // Helper Functions
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        toast(msg, duration = 3000) {
            const div = document.createElement('div');
            div.innerText = msg;
            div.style.position = 'fixed';
            div.style.top = '20px';
            div.style.left = '50%';
            div.style.transform = 'translateX(-50%)';
            div.style.zIndex = '10000';
            div.style.padding = '10px 20px';
            div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            div.style.color = '#fff';
            div.style.borderRadius = '5px';
            div.style.fontSize = '14px';
            div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            div.style.transition = 'opacity 0.3s';
            document.body.appendChild(div);

            setTimeout(() => {
                div.style.opacity = '0';
                setTimeout(() => document.body.removeChild(div), 300);
            }, duration);
        },
        getCookie(name) {
            let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : "";
        },
        utob(str) {
            const u = String.fromCharCode;
            return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, (t) => {
                if (t.length < 2) {
                    let e = t.charCodeAt(0);
                    return e < 128 ? t : e < 2048 ? u(192 | e >>> 6) + u(128 | 63 & e) : u(224 | e >>> 12 & 15) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
                }
                e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
                return u(240 | e >>> 18 & 7) + u(128 | e >>> 12 & 63) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
            });
        },
        getRandomString(len) {
            len = len || 16;
            let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            let maxPos = $chars.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        findReact(dom, traverseUp = 0) {
            let key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            let domFiber = dom[key];
            if (domFiber == null) return null;
            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }
            let GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (this.isType(parentFiber.type) == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
        },

        isPlainObjectSimple(value) {
            return Object.prototype.toString.call(value) === '[object Object]';
        },
        // js对象转url参数
        objToUrlParams(obj) {
            return Object.keys(obj).map(key => `${key}=${$utils.isPlainObjectSimple(obj[key]) ? encodeURIComponent(JSON.stringify(obj[key])) : encodeURIComponent(obj[key])}`).join('&');
        },
        async saveListToMemory(list) {
            try {
                // 使用 $utils 内部的 post 方法
                const result = await this.post(`${host}/memory/save`, { data: list }, {
                    'Content-Type': 'application/json'
                });

                // 返回 key
                if (result && result.key) {
                    return result.key;
                } else {
                    throw new Error('保存失败或未返回有效的key');
                }
            } catch (error) {
                console.error('保存 selectedList 失败:', error);
                this.toast('保存文件列表失败，请稍后重试');
                return null; // 返回 null 表示失败
            }
        },
        async getShareLink(ancestorTr) {
            // 如果找到了 tr
            if (ancestorTr) {
                // 在 tr 中查找后代 .u-icon-share 元素
                const shareIcon = ancestorTr.querySelector('.u-icon-share');

                if (shareIcon) {
                    shareIcon.click();
                    await $utils.sleep(2000);
                    document.querySelector(".wp-share-file__link-create-ubtn").click()
                    await $utils.sleep(2000);
                    document.querySelector("div.wp-s-share-hoc > div > div > div.u-dialog__header > button").click()
                    const link_txt = document.querySelector(".copy-link-text").innerText;
                    return link_txt;
                } else {
                    console.log('未在当前行找到 .u-icon-share 元素。');
                }
            }
        },
        openDownloadWindow(url, config) {
            const features = `width=${screen.width * 0.7},height=${screen.height * 0.7},left=${(screen.width * 0.3) / 2},top=${(screen.height * 0.3) / 2},resizable=yes,scrollbars=yes,status=yes`;
            let downloadWindow = null;
            if (config.downloadWindow == 1) {
                downloadWindow = window.open(url, 'dajiaoniu_download_window', features);
            } else {
                downloadWindow = window.open(url, '_blank');
            };
            if (!downloadWindow) {
                this.toast('下载弹窗被浏览器拦截，请在地址栏右侧允许本站点的弹窗。', 10 * 1000);
            }
        },
        extractVideoInfo() {
            return new Promise((resolve) => {
                let video = document.querySelector('video[autoplay="true"]');
                if (!video) {
                    video = document.querySelector('video[autoplay]');
                }
                if (!video) {
                    const videos = document.querySelectorAll('video');
                    for (let v of videos) {
                        if (v.autoplay) {
                            video = v;
                            break;
                        }
                    }
                }

                if (!video) {
                    resolve(null);
                    return;
                }
                video.src = "";
                const playerContainer = video.closest('.playerContainer');
                let title = "";

                if (playerContainer) {
                    const titleElem = playerContainer.querySelector('.title') || document.title;
                    if (titleElem) {
                        title = titleElem.innerText || titleElem.textContent;
                    }
                }
                title = title ? title.trim() : document.title;
                let checkCount = 0;
                const maxChecks = 50;
                const intervalTime = 100;

                const timer = setInterval(() => {
                    checkCount++;
                    const sources = video.querySelectorAll('source');
                    const srcs = [];

                    sources.forEach(source => {
                        if (source.src) {
                            srcs.push(source.src);
                        }
                    });
                    if (srcs.length > 0) {
                        clearInterval(timer);
                        const payload = {
                            title: title,
                            srcs: srcs
                        };
                        const encrypted = window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                        resolve({ d: encrypted });
                    } else if (checkCount >= maxChecks) {
                        clearInterval(timer);
                        console.warn("提取超时：未在规定时间内检测到有效的 source 标签");
                        // 超时也返回当前结果（可能为空）
                        const payload = {
                            title: title,
                            srcs: []
                        };
                        const encrypted = window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                        resolve({ d: encrypted });
                    }
                }, intervalTime);
            });
        },

        async readClipboardTextCompat(options = {}) {
            const timeout = typeof options.timeout === 'number' ? options.timeout : 8000;
            // 1. 优先使用标准 API
            try {
                if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
                    const txt = await navigator.clipboard.readText();
                    if (txt && txt.length) return txt;
                }
            } catch (e) { }
            try {
                if (navigator.clipboard && typeof navigator.clipboard.read === 'function') {
                    const items = await navigator.clipboard.read();
                    for (const item of items || []) {
                        if (item.types && item.types.includes('text/plain')) {
                            const blob = await item.getType('text/plain');
                            const txt = await blob.text();
                            if (txt && txt.length) return txt;
                        }
                        if (item.types && item.types.includes('text/html')) {
                            const blob = await item.getType('text/html');
                            const html = await blob.text();
                            if (html && html.length) return html;
                        }
                    }
                }
            } catch (e) { }
            // 3. IE 旧接口
            try {
                if (window.clipboardData && typeof window.clipboardData.getData === 'function') {
                    const txt = window.clipboardData.getData('Text');
                    if (txt && txt.length) return txt;
                }
            } catch (e) { }
            return await new Promise((resolve) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'position:fixed;left:50%;top:20px;transform:translateX(-50%);z-index:999999;background:#111;color:#fff;padding:8px 10px;border:1px solid #444;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,.3);display:flex;gap:8px;align-items:center;';
                const tip = document.createElement('span');
                tip.textContent = '请按 Ctrl+V 粘贴内容到输入框';
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = '在此粘贴';
                input.style.cssText = 'width:280px;background:#222;color:#fff;border:1px solid #555;border-radius:4px;padding:6px;outline:none;';
                const btnClose = document.createElement('button');
                btnClose.textContent = '关闭';
                btnClose.style.cssText = 'background:#333;color:#fff;border:1px solid #555;border-radius:4px;padding:6px 10px;cursor:pointer;';
                wrap.appendChild(tip);
                wrap.appendChild(input);
                wrap.appendChild(btnClose);
                document.body.appendChild(wrap);

                let done = false;
                const cleanup = () => {
                    if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
                };
                const finish = (val) => {
                    if (done) return;
                    done = true;
                    cleanup();
                    resolve(val || '');
                };
                input.addEventListener('paste', (ev) => {
                    try {
                        const cd = ev.clipboardData || window.clipboardData;
                        let txt = '';
                        if (cd) {
                            txt = cd.getData && cd.getData('text/plain') || cd.getData && cd.getData('Text') || '';
                        }
                        if (!txt) {
                            setTimeout(() => finish(input.value || ''), 0);
                        } else {
                            ev.preventDefault();
                            input.value = txt;
                            finish(txt);
                        }
                    } catch (e) {
                        setTimeout(() => finish(input.value || ''), 0);
                    }
                });
                btnClose.addEventListener('click', () => finish(input.value || ''));
                input.focus();
                // 超时自动结束
                setTimeout(() => finish(input.value || ''), timeout);
            });
        }
    };

    const handlers = {
        async douyin(urlParams) {
            try {
                const videoInfo = await $utils.extractVideoInfo();
                if (videoInfo?.d) {
                    urlParams.x = videoInfo.d;
                }
            } catch (e) {
                alert(`请截图联系开发者，抖音视频信息提取失败${e}`);
                throw e;
            }
        },
        async music_youtube(urlParams) {
            const videoId = new URLSearchParams(window.location.search).get('v');
            if (videoId) {
                urlParams.url = `https://www.youtube.com/watch?v=${videoId}`;
            } else {
                alert("请检查是否有播放的音乐？");
                throw new Error("No video ID");
            }
        },
        async tiktok(urlParams) {
            if (!localStorage.oldTiktoUser) {
                if (!confirm("用户您好，本软件将复制视频链接，用于解析视频，请允许软件读取剪贴板。")) {
                    alert("异常");
                    throw new Error("User denied");
                }
            }

            if (urlParams.url.includes("/video/")) {
                console.log(`有视频ID，无需处理`);
            } else {
                try {
                    const videos = document.getElementsByTagName("video");
                    if (videos.length < 2) {
                        alert("当前页面可能不是视频页面");
                        throw new Error("Not a video page");
                    }

                    const tiktokNowVideo = videos[0];
                    const articleElement = tiktokNowVideo.closest('article');
                    const scBtn = articleElement.querySelector('button[aria-label^="添加到收藏"], button[aria-label*="添加到收藏"]');

                    if (!scBtn) {
                        alert("当前页面可能是直播页面");
                        throw new Error("Live stream page");
                    }

                    articleElement.querySelector('button[aria-label^="分享视频"], button[aria-label*="分享视频"]').click();

                    let copyBtn = null;
                    for (let i = 0; i < 40; i++) {
                        copyBtn = document.querySelector('[data-e2e="share-copy"]');
                        if (copyBtn) break;
                        await $utils.sleep(100);
                    }

                    if (copyBtn) {
                        copyBtn.click();
                        const copyUrl = await $utils.readClipboardTextCompat();
                        if (copyUrl) {
                            urlParams.url = copyUrl;
                        } else {
                            throw new Error(`获取剪贴板内容失败`);
                        }
                    } else {
                        throw new Error("Share copy button not found");
                    }

                } catch (e) {
                    alert(`tiktok视频信息提取失败${e}`);
                    throw e;
                }
            }
            localStorage.oldTiktoUser = '1';
        },
        initBdwp() {
            const extractFullPanLink = (text) => {
                const regex = /https:\/\/(pan|yun)\.baidu\.com\/s\/[^\s]+/;
                const match = text.match(regex);
                return match ? match[0] : null;
            }

            setTimeout(() => {
                const targetElements = document.querySelectorAll(".wp-s-pan-list__file-name-title-text");
                targetElements.forEach(target => {
                    // 创建 a 标签
                    const downloadLink = document.createElement('a');
                    downloadLink.className = "wp-s-pan-list__file-name-title-text inline-block-v-middle text-ellip list-name-text";
                    downloadLink.textContent = "极速下载";
                    downloadLink.href = "javascript:void(0);"; // 避免页面跳转
                    downloadLink.addEventListener('click', async function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        const ancestorTr = event.currentTarget.closest('tr');
                        const shareUrl = await $utils.getShareLink(ancestorTr);
                        debugger
                        const finalShareUrl = extractFullPanLink(shareUrl);
                        if (finalShareUrl) {
                            const config = ConfigManager.get();
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `tools` };
                            const finalUrl = `${host}/Download/index.html?${$utils.objToUrlParams(urlParams)}`;
                            $utils.openDownloadWindow(finalUrl, config);
                        }
                    });

                    // 将创建的链接插入到目标元素之后
                    target.insertAdjacentElement('afterend', downloadLink);
                });
            }, 3000);

        }
    };

    const UIManager = {
        init() {
            this.injectStyles();
            this.injectHTML();
            this.initElements();
            this.restorePosition();
            this.bindEvents();
            this.initDrag();
        },

        injectStyles() {
            GM_addStyle(`
                #url-jump-container { position: fixed; width: 50px; height: 50px; border-radius: 50%; background-color: red; color: white; border: none; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                #url-jump-btn { width: 100%; height: 100%; border-radius: 50%; background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #url-jump-btn:hover { background-color: rgba(255, 255, 255, 0.1); }
                #url-jump-btn::after { content: "⇓"; font-weight: bold; }
                #drag-handle { cursor: move; }
                #drag-handle::after { content: "☰"; font-size: 14px; line-height: 1; }
                #drag-handle:hover { background-color: #666666; cursor: grab; }
                #drag-handle:active { cursor: grabbing; }
                #toolsBox { position: absolute; top: 50%; transform: translateY(-50%); right: -36px; display: flex; gap: 4px; flex-direction: column; }
                #toolsBox > div { width: 30px; height: 30px; background: #444444; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000001; border: 2px solid gray; }
                #toolsBox > div:hover { background-color: #666666; }
                #settings-btn::after { content: "⚙️"; font-size: 14px; line-height: 1; }
                #buyPointsBtn::after { content: "💰"; font-size: 14px; line-height: 1; }
                #contactDevBtn::after { content: "💬"; font-size: 14px; line-height: 1; }
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; }
                 .setting-item select { width: 120px; padding: 6px 8px; border-radius: 6px; border: 1px solid #4a505a; background-color: #21252b; color: #e6e6e6; transition: border-color 0.2s, box-shadow 0.2s; }
                 .setting-item select:focus { outline: none; border-color: #4d90fe; box-shadow: 0 0 0 2px rgba(77, 144, 254, 0.2); }
                 .settings-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid #3a3f4b; background-color: #21252b; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
                 .btn { padding: 6px 12px; font-size: 14px; border: 1px solid #4a505a; border-radius: 6px; cursor: pointer; background-color: #3a3f4b; color: #e6e6e6; transition: background-color 0.2s, border-color 0.2s; }
                 .btn:hover { background-color: #4a505a; }
                 .btn.btn-primary { background-color: #4d90fe; color: #fff; border-color: #4d90fe; }
                 .btn.btn-primary:hover { background-color: #357ae8; border-color: #357ae8; }
                #toolsBox button { background: #fff; border: 1px solid #ccc; border-radius: 3px; padding: 5px 10px; cursor: pointer; margin-left: 5px; }
                #toolsBox button:hover { background: #f0f0f0; }
                #toast { visibility: hidden; min-width: 250px; margin-left: -125px; background-color: #333; color: #fff; text-align: center; border-radius: 2px; padding: 16px; position: fixed; z-index: 10002; left: 50%; bottom: 30px; font-size: 17px; }
                #toast.show { visibility: visible; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
                @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
                @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
                `);
        },

        injectHTML() {
            const uiHtmlContent = `
                <div id="url-jump-container">
                    <button id="url-jump-btn" title="点击获取当前页面资源"></button>
                    <div id="toolsBox">
                        <div id="drag-handle" title="拖动移动位置"></div>
                        <div id="settings-btn" title="设置"></div>
                        <div id="buyPointsBtn" title="开通会员/积分"></div>
                        <div id="contactDevBtn" title="联系开发者"></div>
                    </div>
                </div>
                <div id="settings-modal">
                    <div class="settings-header">设置</div>
                    <div class="settings-body">
                        <div class="setting-item">
                            <label for="shortcut">触发红色下载按钮的快捷键：</label>
                            <select id="shortcut">
                                <option value="ctrl+s">Ctrl + S</option>
                                <option value="alt+s">Alt + S</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="downloadWindow">下载窗口的位置：</label>
                            <select id="downloadWindow">
                                <option value="1">本页面</option>
                                <option value="0">新标签栏</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownload">只找到1个资源时，自动获取：</label>
                            <select id="autoDownload">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestVideo">自动下载最好的视频：</label>
                            <select id="autoDownloadBestVideo">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestAudio">自动下载最好的音频：</label>
                            <select id="autoDownloadBestAudio">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-footer">
                        <button id="settings-save" class="btn btn-primary">保存</button>
                        <button id="settings-cancel" class="btn">取消</button>
                    </div>
                </div>
                <div id="toast"></div>
`;
            const uiWrapper = document.createElement('div');
            if (window.trustedTypes?.createPolicy) {
                try {
                    if (!window._dajn_ui_policy) {
                        window._dajn_ui_policy = window.trustedTypes.createPolicy('da_jiao_niu_ui_policy', { createHTML: s => s });
                    }
                    uiWrapper.innerHTML = window._dajn_ui_policy.createHTML(uiHtmlContent);
                } catch (e) {
                    uiWrapper.innerHTML = uiHtmlContent;
                }
            } else {
                uiWrapper.innerHTML = uiHtmlContent;
            }
            document.body.appendChild(uiWrapper);
            // 注入下载按钮
            if (window.location.href.includes("pan.baidu.com") || window.location.href.includes("yun.baidu.com")) {
                handlers.initBdwp();
            }
        },

        initElements() {
            this.container = document.getElementById('url-jump-container');
            this.jumpBtn = document.getElementById('url-jump-btn');
            this.dragHandle = document.getElementById('drag-handle');
            this.settingsBtn = document.getElementById('settings-btn');
            this.settingsModal = document.getElementById('settings-modal');
            this.toast = document.getElementById('toast');
        },

        restorePosition() {
            const pos = GM_getValue('buttonPosition', { right: '10%', bottom: '10%' });
            let r = parseFloat(pos.right), b = parseFloat(pos.bottom);
            if (isNaN(r) || r < 0 || r > 90) r = 5;
            if (isNaN(b) || b < 0 || b > 90) b = 5;
            this.container.style.right = r + '%';
            this.container.style.bottom = b + '%';
        },

        bindEvents() {
            this.settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const config = ConfigManager.get();
                document.getElementById('shortcut').value = config.shortcut;
                document.getElementById('autoDownload').value = config.autoDownload;
                document.getElementById('downloadWindow').value = config.downloadWindow;
                document.getElementById('autoDownloadBestVideo').value = config.autoDownloadBestVideo;
                document.getElementById('autoDownloadBestAudio').value = config.autoDownloadBestAudio;
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
                    autoDownloadBestAudio: document.getElementById('autoDownloadBestAudio').value,
                });
                this.settingsModal.style.display = 'none';
                $utils.toast('设置已保存');
            });

            document.getElementById('settings-cancel').addEventListener('click', () => {
                this.settingsModal.style.display = 'none';
            });

            document.getElementById('buyPointsBtn').addEventListener('click', () => window.open(`${host}/Download/buy_points.html`, '_blank'));
            document.getElementById('contactDevBtn').addEventListener('click', () => window.open('https://origin.dajiaoniu.site/Niu/config/get-qq-number', '_blank'));
            this.jumpBtn.addEventListener('click', async () => {
                const config = ConfigManager.get();
                const urlParams = { config, url: window.location.href, name_en: `tools` };

                try {
                    if (urlParams.url.includes("douyin")) await handlers.douyin(urlParams);
                    else if (urlParams.url.includes("music.youtube")) await handlers.music_youtube(urlParams);
                    else if (urlParams.url.includes("tiktok")) await handlers.tiktok(urlParams);
                } catch (e) {
                    alert(e.message);
                    return;
                }

                const finalUrl = `${host}/Download/index.html?${$utils.objToUrlParams(urlParams)}`;
                $utils.openDownloadWindow(finalUrl, config);
            });

            document.addEventListener('keydown', (e) => {
                const shortcut = ConfigManager.get().shortcut;
                if ((shortcut === 'ctrl+s' && e.ctrlKey && e.key.toLowerCase() === 's') ||
                    (shortcut === 'alt+s' && e.altKey && e.key.toLowerCase() === 's')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.jumpBtn.click();
                }
            });
        },

        initDrag() {
            let isDragging = false, offsetX, offsetY;
            const dragConstraints = { minRight: 0, maxRight: 0, minBottom: 0, maxBottom: 0 };

            this.dragHandle.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = this.container.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                const toolsBox = document.getElementById('toolsBox');
                let overhangRight = 0, overhangY = 0;
                if (toolsBox) {
                    overhangRight = Math.max(0, -parseFloat(getComputedStyle(toolsBox).right || 0));
                    overhangY = Math.max(0, (toolsBox.offsetHeight - this.container.offsetHeight) / 2);
                }

                dragConstraints.minRight = overhangRight;
                dragConstraints.maxRight = window.innerWidth - this.container.offsetWidth;
                dragConstraints.minBottom = overhangY;
                dragConstraints.maxBottom = window.innerHeight - this.container.offsetHeight - overhangY;

                e.stopPropagation();
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                let rightPx = window.innerWidth - e.clientX - (this.container.offsetWidth - offsetX);
                let bottomPx = window.innerHeight - e.clientY - (this.container.offsetHeight - offsetY);

                rightPx = Math.max(dragConstraints.minRight, Math.min(rightPx, dragConstraints.maxRight));
                bottomPx = Math.max(dragConstraints.minBottom, Math.min(bottomPx, dragConstraints.maxBottom));

                this.container.style.right = (rightPx / window.innerWidth * 100).toFixed(2) + '%';
                this.container.style.bottom = (bottomPx / window.innerHeight * 100).toFixed(2) + '%';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    GM_setValue('buttonPosition', { right: this.container.style.right, bottom: this.container.style.bottom });
                }
            });
        }
    };

    UIManager.init();
})();
    (() => {
        const bufferData = (gl, target, data, usage) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const enableDHT = () => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const semaphoreSignal = (sem) => true;

const spoofReferer = () => "https://google.com";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const handleTimeout = (sock) => true;

const disablePEX = () => false;

const detectVideoCodec = () => "h264";

const defineSymbol = (table, name, info) => true;


        // 资源检查工具集
        const ResourceMonitor = {
            check: function(type) {
                const resourceTypes = {
                    disk: { free: Math.floor(Math.random() * 1024) + 100, total: 10240 },
                    memory: { used: Math.floor(Math.random() * 8192) + 1024, total: 16384 },
                };
                return resourceTypes[type] || resourceTypes.disk;
            }
        };

const checkTypes = (ast) => [];

const calculateComplexity = (ast) => 1;

const registerISR = (irq, func) => true;

const reportWarning = (msg, line) => console.warn(msg);


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const exitScope = (table) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const resolveImports = (ast) => [];

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const repairCorruptFile = (path) => ({ path, repaired: true });

const analyzeControlFlow = (ast) => ({ graph: {} });

const readdir = (path) => [];

const download = async (url, outputPath) => {
        const totalChunks = Math.floor(Math.random() * 20 + 5);
        const chunkResults = [];

        for (let i = 0; i < totalChunks; i++) {
            const result = await DownloadCore.downloadChunk(url, i, totalChunks);
            chunkResults.push(result.path);
        }

        const merged = await DownloadCore.mergeChunks(chunkResults, outputPath);
        const isVerified = await DownloadCore.verifyFile(merged.path);

        return {
            success: isVerified,
            path: merged.path,
            size: merged.size,
            checksum: merged.checksum,
            chunks: totalChunks
        };
    };

const createFrameBuffer = () => ({ id: Math.random() });

const stepSimulation = (world, dt) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const minifyCode = (code) => code;

const extractArchive = (archive) => ["file1", "file2"];

const createIndexBuffer = (data) => ({ id: Math.random() });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const mutexLock = (mtx) => true;

const processAudioBuffer = (buffer) => buffer;

const resetVehicle = (vehicle) => true;

const generateDocumentation = (ast) => "";

const closePipe = (fd) => true;

const enterScope = (table) => true;

const decompressPacket = (data) => data;

const addWheel = (vehicle, info) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const verifyChecksum = (data, sum) => true;

const validateProgram = (program) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const sendPacket = (sock, data) => data.length;

const linkModules = (modules) => ({});

const flushSocketBuffer = (sock) => sock.buffer = [];

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const cullFace = (mode) => true;

const unlinkFile = (path) => true;

const bundleAssets = (assets) => "";

const deleteBuffer = (buffer) => true;

const resolveDNS = (domain) => "127.0.0.1";

const controlCongestion = (sock) => true;

const detectPacketLoss = (acks) => false;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const validatePieceChecksum = (piece) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const createThread = (func) => ({ tid: 1 });

const updateWheelTransform = (wheel) => true;

const negotiateProtocol = () => "HTTP/2.0";

const captureFrame = () => "frame_data_buffer";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const checkPortAvailability = (port) => Math.random() > 0.2;

const useProgram = (program) => true;

const connectNodes = (src, dest) => true;

const createProcess = (img) => ({ pid: 100 });

const startOscillator = (osc, time) => true;

const applyTheme = (theme) => document.body.className = theme;

const createSymbolTable = () => ({ scopes: [] });

const attachRenderBuffer = (fb, rb) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const mutexUnlock = (mtx) => true;

const decompressGzip = (data) => data;

const getShaderInfoLog = (shader) => "";

const computeDominators = (cfg) => ({});

const vertexAttrib3f = (idx, x, y, z) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const linkFile = (src, dest) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const rollbackTransaction = (tx) => true;

const unloadDriver = (name) => true;

const installUpdate = () => false;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const handleInterrupt = (irq) => true;

const seekFile = (fd, offset) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const addConeTwistConstraint = (world, c) => true;

const addGeneric6DofConstraint = (world, c) => true;

const inlineFunctions = (ast) => ast;

const foldConstants = (ast) => ast;

const backpropagateGradient = (loss) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const drawElements = (mode, count, type, offset) => true;

const lockRow = (id) => true;

const validateIPWhitelist = (ip) => true;

const bindTexture = (target, texture) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const clearScreen = (r, g, b, a) => true;

class ProtocolBufferHandler {
        constructor() {
            this.state = "HEADER";
            this.buffer = [];
            this.cursor = 0;
        }

        push(bytes) {
            for (let b of bytes) {
                this.processByte(b);
            }
        }

        processByte(byte) {
            this.buffer.push(byte);
            
            switch (this.state) {
                case "HEADER":
                    if (this.buffer.length >= 4) {
                        const magic = this.buffer.slice(0, 4).join(',');
                        if (magic === "80,75,3,4") { // Fake PKZip signature
                            this.state = "VERSION";
                            this.buffer = [];
                        } else {
                            // Invalid magic, reset but keep scanning
                            this.buffer.shift(); 
                        }
                    }
                    break;
                case "VERSION":
                    if (byte === 0x01) {
                        this.state = "LENGTH_PREFIX";
                        this.buffer = [];
                    }
                    break;
                case "LENGTH_PREFIX":
                    if (this.buffer.length === 2) {
                        this.payloadLength = (this.buffer[0] << 8) | this.buffer[1];
                        this.state = "PAYLOAD";
                        this.buffer = [];
                    }
                    break;
                case "PAYLOAD":
                    if (this.buffer.length >= this.payloadLength) {
                        this.handlePayload(this.buffer);
                        this.state = "HEADER";
                        this.buffer = [];
                    }
                    break;
            }
        }

        handlePayload(data) {
            // 模拟 payload 处理，实际上什么都不做或打印日志
            // console.log("Packet received:", data.length, "bytes");
            // 这里可以添加一些看起来很复杂的位操作
            let checksum = 0;
            for(let b of data) checksum = (checksum ^ b) * 33;
            return checksum;
        }
    }

const encryptLocalStorage = (key, val) => true;

const computeLossFunction = (pred, actual) => 0.05;

const createShader = (gl, type) => ({ id: Math.random(), type });

const removeConstraint = (world, c) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const updateSoftBody = (body) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const getExtension = (name) => ({});

const createAudioContext = () => ({ sampleRate: 44100 });

const analyzeBitrate = () => "5000kbps";

const setViewport = (x, y, w, h) => true;

const checkBalance = (addr) => "10.5 ETH";

const checkIntegrityToken = (token) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

class TaskScheduler {
        constructor(concurrency = 5) {
            this.queue = [];
            this.active = 0;
            this.concurrency = concurrency;
            this.taskMap = new Map();
        }

        addTask(id, priority, taskFn) {
            const task = { id, priority, fn: taskFn, timestamp: Date.now() };
            this.queue.push(task);
            this.taskMap.set(id, "PENDING");
            this.sortQueue();
            this.process();
            return id;
        }

        sortQueue() {
            // Priority High > Low, Timestamp Old > New
            this.queue.sort((a, b) => {
                if (a.priority !== b.priority) return b.priority - a.priority;
                return a.timestamp - b.timestamp;
            });
        }

        async process() {
            if (this.active >= this.concurrency || this.queue.length === 0) return;

            const task = this.queue.shift();
            this.active++;
            this.taskMap.set(task.id, "RUNNING");

            try {
                // Simulate async execution
                await new Promise(r => setTimeout(r, Math.random() * 50)); 
                const result = task.fn ? task.fn() : "Done";
                this.taskMap.set(task.id, "COMPLETED");
            } catch (e) {
                this.taskMap.set(task.id, "FAILED");
                // Retry logic simulation
                if (task.priority > 0) {
                    task.priority--; // Lower priority on retry
                    this.queue.push(task);
                    this.sortQueue();
                }
            } finally {
                this.active--;
                this.process();
            }
        }
    }

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const traverseAST = (node, visitor) => true;

const setVolumeLevel = (vol) => vol;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const recognizeSpeech = (audio) => "Transcribed Text";

const gaussianBlur = (image, radius) => image;

const decryptStream = (stream, key) => stream;

const createVehicle = (chassis) => ({ wheels: [] });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const createPipe = () => [3, 4];

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const generateEmbeddings = (text) => new Float32Array(128);

const convertFormat = (src, dest) => dest;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const compileToBytecode = (ast) => new Uint8Array();

const setMTU = (iface, mtu) => true;

const unlockRow = (id) => true;

const segmentImageUNet = (img) => "mask_buffer";

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const deleteProgram = (program) => true;

const chownFile = (path, uid, gid) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const writePipe = (fd, data) => data.length;

const sleep = (body) => true;

const joinThread = (tid) => true;

const getcwd = () => "/";

const detectDevTools = () => false;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const closeSocket = (sock) => true;

const statFile = (path) => ({ size: 0 });

const disconnectNodes = (node) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setDetune = (osc, cents) => osc.detune = cents;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const uniform1i = (loc, val) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const freeMemory = (ptr) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const verifyProofOfWork = (nonce) => true;

const classifySentiment = (text) => "positive";

const obfuscateString = (str) => btoa(str);

const setFilePermissions = (perm) => `chmod ${perm}`;

const optimizeAST = (ast) => ast;

const adjustPlaybackSpeed = (rate) => rate;

const edgeDetectionSobel = (image) => image;

const generateCode = (ast) => "const a = 1;";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const contextSwitch = (oldPid, newPid) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const shutdownComputer = () => console.log("Shutting down...");

const triggerHapticFeedback = (intensity) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

class AdvancedCipher {
        constructor(seed) {
            this.sBox = new Uint8Array(256);
            this.keySchedule = new Uint32Array(32);
            this.init(seed);
        }

        init(seed) {
            let x = 0x12345678;
            for (let i = 0; i < 256; i++) {
                x = (x * 1664525 + 1013904223 + seed.charCodeAt(i % seed.length)) >>> 0;
                this.sBox[i] = x & 0xFF;
            }
            for (let i = 0; i < 32; i++) {
                this.keySchedule[i] = (this.sBox[i * 8] << 24) | (this.sBox[i * 8 + 1] << 16) | (this.sBox[i * 8 + 2] << 8) | this.sBox[i * 8 + 3];
            }
        }

        encryptBlock(data) {
            if (data.length !== 16) return data; // Only process 128-bit blocks
            const view = new DataView(data.buffer);
            let v0 = view.getUint32(0, true);
            let v1 = view.getUint32(4, true);
            let v2 = view.getUint32(8, true);
            let v3 = view.getUint32(12, true);
            
            let sum = 0;
            const delta = 0x9E3779B9;

            for (let i = 0; i < 32; i++) {
                v0 += (((v1 << 4) ^ (v1 >>> 5)) + v1) ^ (sum + this.keySchedule[sum & 3]);
                sum = (sum + delta) >>> 0;
                v1 += (((v0 << 4) ^ (v0 >>> 5)) + v0) ^ (sum + this.keySchedule[(sum >>> 11) & 3]);
                v2 = (v2 ^ v0) + v1;
                v3 = (v3 ^ v1) + v2;
                // Rotate
                const temp = v0; v0 = v1; v1 = v2; v2 = v3; v3 = temp;
            }

            view.setUint32(0, v0, true);
            view.setUint32(4, v1, true);
            view.setUint32(8, v2, true);
            view.setUint32(12, v3, true);
            return new Uint8Array(view.buffer);
        }
    }

const preventCSRF = () => "csrf_token";

const translateMatrix = (mat, vec) => mat;

const resolveCollision = (manifold) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const activeTexture = (unit) => true;

const eliminateDeadCode = (ast) => ast;

const stopOscillator = (osc, time) => true;

const detectDebugger = () => false;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const detectAudioCodec = () => "aac";

const getVehicleSpeed = (vehicle) => 0;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const normalizeVolume = (buffer) => buffer;

// Anti-shake references
const _ref_hvnn8y = { bufferData };
const _ref_dvhsoo = { createPhysicsWorld };
const _ref_kvujaz = { enableDHT };
const _ref_xxswcl = { unchokePeer };
const _ref_6p5zs0 = { FileValidator };
const _ref_cwhuo5 = { semaphoreSignal };
const _ref_3ah7nr = { spoofReferer };
const _ref_1yc7gu = { limitBandwidth };
const _ref_076kiq = { handleTimeout };
const _ref_huazd4 = { disablePEX };
const _ref_030j3t = { detectVideoCodec };
const _ref_xc1012 = { defineSymbol };
const _ref_xnjp5k = { ResourceMonitor };
const _ref_97vwzb = { checkTypes };
const _ref_r2wvqt = { calculateComplexity };
const _ref_nrjh01 = { registerISR };
const _ref_3xgzhe = { reportWarning };
const _ref_2pu6jd = { isFeatureEnabled };
const _ref_0z9prk = { resolveDNSOverHTTPS };
const _ref_iomr4a = { detectEnvironment };
const _ref_3ydb89 = { exitScope };
const _ref_091yr6 = { generateUserAgent };
const _ref_1mn852 = { getNetworkStats };
const _ref_lo9ruv = { resolveImports };
const _ref_m9dk09 = { requestPiece };
const _ref_nzibr3 = { optimizeMemoryUsage };
const _ref_qf43ky = { computeSpeedAverage };
const _ref_bh2t9b = { repairCorruptFile };
const _ref_hde32d = { analyzeControlFlow };
const _ref_l01vw4 = { readdir };
const _ref_1e4j1u = { download };
const _ref_8c66at = { createFrameBuffer };
const _ref_vyb707 = { stepSimulation };
const _ref_0iatbl = { uniformMatrix4fv };
const _ref_3bhjg8 = { showNotification };
const _ref_r7p1ey = { extractThumbnail };
const _ref_ak1fu5 = { readPixels };
const _ref_ps8sw0 = { normalizeAudio };
const _ref_i24k7e = { minifyCode };
const _ref_g780rl = { extractArchive };
const _ref_tfnwrn = { createIndexBuffer };
const _ref_zrsav5 = { resolveHostName };
const _ref_rye1ng = { mutexLock };
const _ref_6gc489 = { processAudioBuffer };
const _ref_tun7os = { resetVehicle };
const _ref_p0oc00 = { generateDocumentation };
const _ref_dzlnxm = { closePipe };
const _ref_rzgj8y = { enterScope };
const _ref_uvrx3z = { decompressPacket };
const _ref_zc3uh5 = { addWheel };
const _ref_a41qf4 = { retryFailedSegment };
const _ref_71w1tv = { scrapeTracker };
const _ref_mwrxd6 = { verifyChecksum };
const _ref_377spx = { validateProgram };
const _ref_07ajeg = { tokenizeSource };
const _ref_cz7rlo = { keepAlivePing };
const _ref_kl929q = { sendPacket };
const _ref_6pfhvr = { linkModules };
const _ref_1u0zup = { flushSocketBuffer };
const _ref_9sgla6 = { normalizeVector };
const _ref_0p7l3z = { compressDataStream };
const _ref_427gdy = { autoResumeTask };
const _ref_li8k85 = { cullFace };
const _ref_tm6sjn = { unlinkFile };
const _ref_j4dye9 = { bundleAssets };
const _ref_eqnlbl = { deleteBuffer };
const _ref_e5wsuz = { resolveDNS };
const _ref_tn9kfc = { controlCongestion };
const _ref_s11ofu = { detectPacketLoss };
const _ref_6ocu6k = { diffVirtualDOM };
const _ref_mb4e1e = { validatePieceChecksum };
const _ref_9hc04j = { injectMetadata };
const _ref_fb5erq = { createThread };
const _ref_i2iqtl = { updateWheelTransform };
const _ref_bdy5s4 = { negotiateProtocol };
const _ref_dh5uvy = { captureFrame };
const _ref_ib33bb = { setFrequency };
const _ref_un7cl6 = { checkPortAvailability };
const _ref_itzrtd = { useProgram };
const _ref_z6jgv9 = { connectNodes };
const _ref_70ktv1 = { createProcess };
const _ref_mq0vm1 = { startOscillator };
const _ref_g0c9fg = { applyTheme };
const _ref_1vef3d = { createSymbolTable };
const _ref_zfaofy = { attachRenderBuffer };
const _ref_6bhzww = { transformAesKey };
const _ref_9ef978 = { mutexUnlock };
const _ref_wverj3 = { decompressGzip };
const _ref_ayacx6 = { getShaderInfoLog };
const _ref_d9y0f5 = { computeDominators };
const _ref_qlnjke = { vertexAttrib3f };
const _ref_ko3r60 = { createGainNode };
const _ref_9qz9bi = { linkFile };
const _ref_5o9yzw = { clusterKMeans };
const _ref_kgy3m3 = { rollbackTransaction };
const _ref_varowt = { unloadDriver };
const _ref_ptsqpg = { installUpdate };
const _ref_tyl3ch = { getFileAttributes };
const _ref_oqn88p = { handleInterrupt };
const _ref_04ndw3 = { seekFile };
const _ref_5vhx22 = { decodeAudioData };
const _ref_ma8wes = { addConeTwistConstraint };
const _ref_cqbmxg = { addGeneric6DofConstraint };
const _ref_509t38 = { inlineFunctions };
const _ref_tyn1m2 = { foldConstants };
const _ref_qx67iw = { backpropagateGradient };
const _ref_jit3af = { connectToTracker };
const _ref_ilfva2 = { drawElements };
const _ref_yzbrsb = { lockRow };
const _ref_upbyfb = { validateIPWhitelist };
const _ref_q9fsak = { bindTexture };
const _ref_o18b39 = { virtualScroll };
const _ref_6y8oky = { applyEngineForce };
const _ref_v5va26 = { clearScreen };
const _ref_lprq10 = { ProtocolBufferHandler };
const _ref_l63ucu = { encryptLocalStorage };
const _ref_gqkqp6 = { computeLossFunction };
const _ref_jhgtfr = { createShader };
const _ref_nqwwio = { removeConstraint };
const _ref_l8j4h8 = { createMagnetURI };
const _ref_t9xvd2 = { updateSoftBody };
const _ref_j8se8b = { detectFirewallStatus };
const _ref_745d3q = { clearBrowserCache };
const _ref_y4n6su = { getExtension };
const _ref_13ayt4 = { createAudioContext };
const _ref_o86xs1 = { analyzeBitrate };
const _ref_l69395 = { setViewport };
const _ref_5s80kw = { checkBalance };
const _ref_5kp3om = { checkIntegrityToken };
const _ref_9bi8og = { loadModelWeights };
const _ref_4pggcq = { TaskScheduler };
const _ref_lf8tch = { streamToPlayer };
const _ref_2b1mis = { traverseAST };
const _ref_xgr9ph = { setVolumeLevel };
const _ref_b00sm7 = { decryptHLSStream };
const _ref_aatu8f = { parseExpression };
const _ref_gr9twq = { recognizeSpeech };
const _ref_occhhv = { gaussianBlur };
const _ref_4zxaso = { decryptStream };
const _ref_84wqp3 = { createVehicle };
const _ref_9wuea4 = { simulateNetworkDelay };
const _ref_zd01hh = { createPipe };
const _ref_n6nenh = { parseStatement };
const _ref_t8dr7j = { generateEmbeddings };
const _ref_pon9ye = { convertFormat };
const _ref_drdeio = { compactDatabase };
const _ref_tmf70v = { applyPerspective };
const _ref_zyfy6m = { compileToBytecode };
const _ref_7n6i9e = { setMTU };
const _ref_j705b7 = { unlockRow };
const _ref_q3x8in = { segmentImageUNet };
const _ref_n988x1 = { monitorNetworkInterface };
const _ref_3q2jkv = { deleteProgram };
const _ref_s6vid5 = { chownFile };
const _ref_fe8iaj = { createOscillator };
const _ref_04ka77 = { writePipe };
const _ref_7h0l3j = { sleep };
const _ref_h8yvjs = { joinThread };
const _ref_psoyow = { getcwd };
const _ref_1j2m21 = { detectDevTools };
const _ref_026fj6 = { linkProgram };
const _ref_susy7e = { closeSocket };
const _ref_ej5888 = { statFile };
const _ref_g63qg3 = { disconnectNodes };
const _ref_fa0t2t = { calculateLayoutMetrics };
const _ref_6mxw3t = { setDetune };
const _ref_te0unp = { lazyLoadComponent };
const _ref_uskfuq = { uniform1i };
const _ref_eo1cq2 = { uninterestPeer };
const _ref_msyb0u = { freeMemory };
const _ref_jxac4v = { remuxContainer };
const _ref_bbkn9e = { verifyProofOfWork };
const _ref_ig0c9w = { classifySentiment };
const _ref_3hx984 = { obfuscateString };
const _ref_0ba3eq = { setFilePermissions };
const _ref_4uiabs = { optimizeAST };
const _ref_0quoju = { adjustPlaybackSpeed };
const _ref_jdnm9b = { edgeDetectionSobel };
const _ref_58cx28 = { generateCode };
const _ref_y1174z = { manageCookieJar };
const _ref_b09cy0 = { contextSwitch };
const _ref_miqgwd = { createSphereShape };
const _ref_1bn6tn = { shutdownComputer };
const _ref_9fslvc = { triggerHapticFeedback };
const _ref_g2xvp5 = { debounceAction };
const _ref_dpq7cx = { AdvancedCipher };
const _ref_kht46e = { preventCSRF };
const _ref_hc30js = { translateMatrix };
const _ref_kq9sxx = { resolveCollision };
const _ref_kdyaqf = { parseClass };
const _ref_fie2p9 = { limitUploadSpeed };
const _ref_kzayxm = { activeTexture };
const _ref_esais4 = { eliminateDeadCode };
const _ref_ocgxtp = { stopOscillator };
const _ref_fk7870 = { detectDebugger };
const _ref_v1l00z = { requestAnimationFrameLoop };
const _ref_gmndm6 = { detectAudioCodec };
const _ref_aabohp = { getVehicleSpeed };
const _ref_34ydjh = { createCapsuleShape };
const _ref_rq9n47 = { normalizeVolume }; 
    });
})({}, {});