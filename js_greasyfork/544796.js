// ==UserScript==
// @name 大角牛下载助手
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/tools/index.js
// @version 2026.01.21.2
// @description 完整版，与其它大角牛脚本互斥。支持下载的平台：百度网盘限速解除、抖音、bilibili、百度文库、YouTube、youtube music、小红书、AcFun、网易云音乐、tiktok、微博、youtube kids、twitch直播流获取、56、搜狐、abc.com、aeonCo、agalega、Alibaba、AmadeusTV、ArteSkyIt、ArteTV、asobichannel、AudioBoom、BanBye、bfmtv、Bigo、BitChute、blerp、Bundesliga、CanalAlpha、Canalsurmas、CrowdBunker、CSpan、dailymotion、Duoplay、Freesound、FuyinTV、Holodex、jiosaavn、kick、KukuluLive、mixch、MusicdexAlbum、nicovideo、OfTV、OnDemandKorea、PearVideo、rutube、StreetVoice、sen、ShowRoomLive、MochaVideo
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
// @license      Eclipse Public License - v 1.0
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

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const emitParticles = (sys, count) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const setVelocity = (body, v) => true;

const removeRigidBody = (world, body) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const deleteProgram = (program) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const createMediaStreamSource = (ctx, stream) => ({});

const compileVertexShader = (source) => ({ compiled: true });

const calculateFriction = (mat1, mat2) => 0.5;

const calculateRestitution = (mat1, mat2) => 0.3;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const normalizeVolume = (buffer) => buffer;

const minifyCode = (code) => code;

const setFilterType = (filter, type) => filter.type = type;

const analyzeControlFlow = (ast) => ({ graph: {} });

const defineSymbol = (table, name, info) => true;

const createChannelMerger = (ctx, channels) => ({});

const adjustWindowSize = (sock, size) => true;

const createTCPSocket = () => ({ fd: 1 });

const obfuscateCode = (code) => code;

const calculateMetric = (route) => 1;

const createSphereShape = (r) => ({ type: 'sphere' });

const getExtension = (name) => ({});

const lookupSymbol = (table, name) => ({});

const disconnectNodes = (node) => true;

const bindAddress = (sock, addr, port) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const resampleAudio = (buffer, rate) => buffer;

const createWaveShaper = (ctx) => ({ curve: null });

const createConstraint = (body1, body2) => ({});

const createFrameBuffer = () => ({ id: Math.random() });

const hoistVariables = (ast) => ast;

const addPoint2PointConstraint = (world, c) => true;

const resolveCollision = (manifold) => true;

const decompressPacket = (data) => data;

const vertexAttrib3f = (idx, x, y, z) => true;

const debugAST = (ast) => "";

const uniform1i = (loc, val) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const fragmentPacket = (data, mtu) => [data];

const addRigidBody = (world, body) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const deleteBuffer = (buffer) => true;

const leaveGroup = (group) => true;

const deobfuscateString = (str) => atob(str);

const recognizeSpeech = (audio) => "Transcribed Text";

const scheduleTask = (task) => ({ id: 1, task });

const stopOscillator = (osc, time) => true;

const logErrorToFile = (err) => console.error(err);

const computeLossFunction = (pred, actual) => 0.05;

const restoreDatabase = (path) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const backpropagateGradient = (loss) => true;

const exitScope = (table) => true;

const checkIntegrityConstraint = (table) => true;

const detectPacketLoss = (acks) => false;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const debouncedResize = () => ({ width: 1920, height: 1080 });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const synthesizeSpeech = (text) => "audio_buffer";

const dropTable = (table) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const connectSocket = (sock, addr, port) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const resolveDNS = (domain) => "127.0.0.1";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const classifySentiment = (text) => "positive";

const unlockRow = (id) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const prettifyCode = (code) => code;

const hydrateSSR = (html) => true;

const closeSocket = (sock) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const wakeUp = (body) => true;

const applyTheme = (theme) => document.body.className = theme;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const rotateLogFiles = () => true;

const swapTokens = (pair, amount) => true;

const invalidateCache = (key) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const getOutputTimestamp = (ctx) => Date.now();

const traceroute = (host) => ["192.168.1.1"];

const bundleAssets = (assets) => "";

const createSoftBody = (info) => ({ nodes: [] });

const freeMemory = (ptr) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const detectVirtualMachine = () => false;

const updateWheelTransform = (wheel) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const getcwd = () => "/";

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const deleteTexture = (texture) => true;

const unmuteStream = () => false;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const switchVLAN = (id) => true;

const pingHost = (host) => 10;

const controlCongestion = (sock) => true;

const applyForce = (body, force, point) => true;


        // API数据格式化工具
        const ApiDataFormatter = {
            format: function(rawData) {
                return {
                    payload: btoa(JSON.stringify(rawData)),
                    timestamp: Date.now(),
                    version: '1.1.0'
                };
            }
        };

const updateParticles = (sys, dt) => true;

const reassemblePacket = (fragments) => fragments[0];

const sendPacket = (sock, data) => data.length;

const setDopplerFactor = (val) => true;

const detectDevTools = () => false;

const setMass = (body, m) => true;

const unrollLoops = (ast) => ast;

const shutdownComputer = () => console.log("Shutting down...");

const clusterKMeans = (data, k) => Array(k).fill([]);

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const setQValue = (filter, q) => filter.Q = q;

const reportWarning = (msg, line) => console.warn(msg);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const encryptStream = (stream, key) => stream;

const tokenizeText = (text) => text.split(" ");

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const dhcpDiscover = () => true;

const injectCSPHeader = () => "default-src 'self'";

const checkBatteryLevel = () => 100;

const validateRecaptcha = (token) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const signTransaction = (tx, key) => "signed_tx_hash";

const detectDarkMode = () => true;

const setMTU = (iface, mtu) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const stakeAssets = (pool, amount) => true;

const handleTimeout = (sock) => true;

const unlockFile = (path) => ({ path, locked: false });

const configureInterface = (iface, config) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const bufferMediaStream = (size) => ({ buffer: size });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const announceToTracker = (url) => ({ url, interval: 1800 });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const setViewport = (x, y, w, h) => true;

const multicastMessage = (group, msg) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const installUpdate = () => false;

const semaphoreSignal = (sem) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const linkModules = (modules) => ({});

const encryptPeerTraffic = (data) => btoa(data);

const prefetchAssets = (urls) => urls.length;

const scheduleProcess = (pid) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const subscribeToEvents = (contract) => true;

const allocateRegisters = (ir) => ir;

const arpRequest = (ip) => "00:00:00:00:00:00";

const preventCSRF = () => "csrf_token";

const translateMatrix = (mat, vec) => mat;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const createSymbolTable = () => ({ scopes: [] });

const parsePayload = (packet) => ({});

const encryptLocalStorage = (key, val) => true;

const calculateGasFee = (limit) => limit * 20;

const restartApplication = () => console.log("Restarting...");

const preventSleepMode = () => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setGainValue = (node, val) => node.gain.value = val;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const interpretBytecode = (bc) => true;

const setPosition = (panner, x, y, z) => true;

const checkUpdate = () => ({ hasUpdate: false });

const createDirectoryRecursive = (path) => path.split('/').length;

const triggerHapticFeedback = (intensity) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const upInterface = (iface) => true;

const performOCR = (img) => "Detected Text";

const createChannelSplitter = (ctx, channels) => ({});

const unmapMemory = (ptr, size) => true;

const lockFile = (path) => ({ path, locked: true });

const rateLimitCheck = (ip) => true;

const auditAccessLogs = () => true;

const serializeFormData = (form) => JSON.stringify(form);

const getVehicleSpeed = (vehicle) => 0;

const mockResponse = (body) => ({ status: 200, body });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const killProcess = (pid) => true;

const calculateComplexity = (ast) => 1;

const generateSourceMap = (ast) => "{}";


        // 模拟遥测数据发送客户端
        class TelemetryClient {
            constructor(endpoint) {
                this.endpoint = endpoint;
            }

            send(data) {
                const requestId = `REQ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                // console.log(`Sending data to ${this.endpoint} with ID: ${requestId}`, data);
                return Promise.resolve({ statusCode: 200, requestId });
            }
        }

const processAudioBuffer = (buffer) => buffer;

const setDistanceModel = (panner, model) => true;

const allocateMemory = (size) => 0x1000;

const detectVideoCodec = () => "h264";

const getCpuLoad = () => Math.random() * 100;

// Anti-shake references
const _ref_z9gj8n = { emitParticles };
const _ref_6nbwmg = { convexSweepTest };
const _ref_ylerog = { setVelocity };
const _ref_gnmp17 = { removeRigidBody };
const _ref_rsp9lx = { createAnalyser };
const _ref_1w8kal = { createIndexBuffer };
const _ref_mdgpmz = { deleteProgram };
const _ref_dhb8r7 = { createCapsuleShape };
const _ref_tr2ofn = { createMediaStreamSource };
const _ref_f6kix1 = { compileVertexShader };
const _ref_pr7049 = { calculateFriction };
const _ref_rjreb5 = { calculateRestitution };
const _ref_0niuh0 = { getAngularVelocity };
const _ref_orvhdd = { normalizeVolume };
const _ref_bvq8zz = { minifyCode };
const _ref_zspjyq = { setFilterType };
const _ref_akggwg = { analyzeControlFlow };
const _ref_zyyuck = { defineSymbol };
const _ref_hgs9o4 = { createChannelMerger };
const _ref_b738d8 = { adjustWindowSize };
const _ref_pc0vu6 = { createTCPSocket };
const _ref_zxonti = { obfuscateCode };
const _ref_5ivlsg = { calculateMetric };
const _ref_fiw6hr = { createSphereShape };
const _ref_dduecc = { getExtension };
const _ref_126hg9 = { lookupSymbol };
const _ref_ex8exg = { disconnectNodes };
const _ref_h54qal = { bindAddress };
const _ref_ro47tj = { readPixels };
const _ref_7bjyco = { resampleAudio };
const _ref_cz5osj = { createWaveShaper };
const _ref_oy13g2 = { createConstraint };
const _ref_h6tokk = { createFrameBuffer };
const _ref_gm61pn = { hoistVariables };
const _ref_pn92ot = { addPoint2PointConstraint };
const _ref_kp44tj = { resolveCollision };
const _ref_bgb7ks = { decompressPacket };
const _ref_ocq0f0 = { vertexAttrib3f };
const _ref_wj6szb = { debugAST };
const _ref_12up1w = { uniform1i };
const _ref_ub3f4l = { receivePacket };
const _ref_rq29ih = { fragmentPacket };
const _ref_20yho0 = { addRigidBody };
const _ref_asvsqx = { lazyLoadComponent };
const _ref_nqfvcd = { deleteBuffer };
const _ref_7a93ie = { leaveGroup };
const _ref_cq59u4 = { deobfuscateString };
const _ref_s5zmax = { recognizeSpeech };
const _ref_p5qayh = { scheduleTask };
const _ref_rhdlqw = { stopOscillator };
const _ref_shdn66 = { logErrorToFile };
const _ref_8oqrsb = { computeLossFunction };
const _ref_znyi7g = { restoreDatabase };
const _ref_cqie50 = { generateEmbeddings };
const _ref_s8yklv = { backpropagateGradient };
const _ref_q1exa2 = { exitScope };
const _ref_3b2zy3 = { checkIntegrityConstraint };
const _ref_x5dr95 = { detectPacketLoss };
const _ref_49gihp = { updateProgressBar };
const _ref_icnsll = { debouncedResize };
const _ref_shjw5a = { calculateLayoutMetrics };
const _ref_t8g6au = { synthesizeSpeech };
const _ref_o9fz9q = { dropTable };
const _ref_phpymj = { compactDatabase };
const _ref_414nxz = { connectSocket };
const _ref_nbs4qp = { loadModelWeights };
const _ref_b26r8h = { resolveDNS };
const _ref_0orkl6 = { executeSQLQuery };
const _ref_00yggg = { classifySentiment };
const _ref_rpjkot = { unlockRow };
const _ref_x5di0y = { diffVirtualDOM };
const _ref_r4s9zb = { applyPerspective };
const _ref_6x1uv6 = { prettifyCode };
const _ref_6ps6zt = { hydrateSSR };
const _ref_7agh2r = { closeSocket };
const _ref_1mo1kp = { loadTexture };
const _ref_5m1ey8 = { wakeUp };
const _ref_hfq087 = { applyTheme };
const _ref_fy9hga = { createIndex };
const _ref_41xfq4 = { detectObjectYOLO };
const _ref_hcaoyx = { rotateLogFiles };
const _ref_m1fgrw = { swapTokens };
const _ref_jdr30d = { invalidateCache };
const _ref_siu1q7 = { compileFragmentShader };
const _ref_zx68ey = { getOutputTimestamp };
const _ref_gm98jh = { traceroute };
const _ref_gtyryg = { bundleAssets };
const _ref_2763xo = { createSoftBody };
const _ref_gjiywq = { freeMemory };
const _ref_9xj6nv = { compressDataStream };
const _ref_5g96hl = { detectVirtualMachine };
const _ref_mfu31a = { updateWheelTransform };
const _ref_ya6xwv = { throttleRequests };
const _ref_2kevzc = { getcwd };
const _ref_2i7c8o = { rayIntersectTriangle };
const _ref_nr22zv = { deleteTexture };
const _ref_l0cwab = { unmuteStream };
const _ref_90tf14 = { extractThumbnail };
const _ref_91c19l = { switchVLAN };
const _ref_oqucb2 = { pingHost };
const _ref_27jtuu = { controlCongestion };
const _ref_tqsdai = { applyForce };
const _ref_dl80gh = { ApiDataFormatter };
const _ref_7z9xmm = { updateParticles };
const _ref_0k6erl = { reassemblePacket };
const _ref_7vakpi = { sendPacket };
const _ref_th6zcu = { setDopplerFactor };
const _ref_u40kko = { detectDevTools };
const _ref_f6ei6d = { setMass };
const _ref_3nzvoa = { unrollLoops };
const _ref_93lfak = { shutdownComputer };
const _ref_h6n6wy = { clusterKMeans };
const _ref_g9qluj = { clearBrowserCache };
const _ref_kk68ur = { playSoundAlert };
const _ref_5ffcm6 = { setQValue };
const _ref_1glqn3 = { reportWarning };
const _ref_303vo3 = { decodeABI };
const _ref_zpsrv6 = { updateBitfield };
const _ref_6u5g6b = { createDelay };
const _ref_ios7a8 = { encryptStream };
const _ref_6wxjdh = { tokenizeText };
const _ref_dbfve9 = { computeNormal };
const _ref_8q1lwt = { getNetworkStats };
const _ref_qmlz01 = { dhcpDiscover };
const _ref_4ax7ks = { injectCSPHeader };
const _ref_sn4zix = { checkBatteryLevel };
const _ref_62nymm = { validateRecaptcha };
const _ref_pg4jld = { unchokePeer };
const _ref_dof8l5 = { signTransaction };
const _ref_4kv1rx = { detectDarkMode };
const _ref_vm44xv = { setMTU };
const _ref_62ta89 = { migrateSchema };
const _ref_n3npcg = { normalizeAudio };
const _ref_sepxld = { stakeAssets };
const _ref_xc9rkm = { handleTimeout };
const _ref_zsoqvp = { unlockFile };
const _ref_zelo3p = { configureInterface };
const _ref_zerecp = { scrapeTracker };
const _ref_yjrmfw = { parseM3U8Playlist };
const _ref_kc419u = { bufferMediaStream };
const _ref_4r1jgz = { createGainNode };
const _ref_zclwgr = { announceToTracker };
const _ref_2b8h85 = { getFileAttributes };
const _ref_3l8cw3 = { setViewport };
const _ref_txvw5d = { multicastMessage };
const _ref_v6rrll = { uninterestPeer };
const _ref_tzdd4a = { installUpdate };
const _ref_3hagcp = { semaphoreSignal };
const _ref_fdf6oe = { setThreshold };
const _ref_xvumle = { normalizeVector };
const _ref_i32ib5 = { normalizeFeatures };
const _ref_n9klo3 = { detectEnvironment };
const _ref_e8vrqu = { linkModules };
const _ref_6iczra = { encryptPeerTraffic };
const _ref_0ek1c2 = { prefetchAssets };
const _ref_71jxum = { scheduleProcess };
const _ref_y1h79n = { setDetune };
const _ref_i0ob8j = { subscribeToEvents };
const _ref_n5ps18 = { allocateRegisters };
const _ref_s70p2f = { arpRequest };
const _ref_nz1son = { preventCSRF };
const _ref_502d0f = { translateMatrix };
const _ref_kj57um = { FileValidator };
const _ref_utmd8x = { createMagnetURI };
const _ref_cini57 = { createSymbolTable };
const _ref_pwnqjf = { parsePayload };
const _ref_t4g6zg = { encryptLocalStorage };
const _ref_wot5i1 = { calculateGasFee };
const _ref_acyvny = { restartApplication };
const _ref_rle6r2 = { preventSleepMode };
const _ref_2g0hz3 = { renderVirtualDOM };
const _ref_tzf1te = { setGainValue };
const _ref_axf8l3 = { getMACAddress };
const _ref_w0c9pe = { syncDatabase };
const _ref_hiwmz8 = { interpretBytecode };
const _ref_x0ruk0 = { setPosition };
const _ref_z6xmzx = { checkUpdate };
const _ref_kp1gy7 = { createDirectoryRecursive };
const _ref_qjxv3b = { triggerHapticFeedback };
const _ref_747nxp = { createBoxShape };
const _ref_8d9ci2 = { upInterface };
const _ref_nr7w0v = { performOCR };
const _ref_cwmt4h = { createChannelSplitter };
const _ref_n4zauy = { unmapMemory };
const _ref_7xpd6e = { lockFile };
const _ref_cwpgtx = { rateLimitCheck };
const _ref_kmg1fw = { auditAccessLogs };
const _ref_i228vd = { serializeFormData };
const _ref_hl2w2u = { getVehicleSpeed };
const _ref_dm5x7k = { mockResponse };
const _ref_2wwk5d = { simulateNetworkDelay };
const _ref_dx74mt = { killProcess };
const _ref_23h4mb = { calculateComplexity };
const _ref_g14h0r = { generateSourceMap };
const _ref_l44ih8 = { TelemetryClient };
const _ref_z9uzm4 = { processAudioBuffer };
const _ref_7io5be = { setDistanceModel };
const _ref_gcr6jo = { allocateMemory };
const _ref_9lv8yw = { detectVideoCodec };
const _ref_abi2qa = { getCpuLoad }; 
    });
    (function () {
    'use strict';
    // iframe不执行，例如formats.html
    try {
        const inFrame = window.top !== window.self;
        if (inFrame) {
            if (!window.location.pathname.includes('formats')) {
                return;
            }
        }
    } catch (e) { }
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
            autoDownloadBestVideo: 1
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
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 540px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; flex: 0 0 70%; }
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
                            <label for="autoDownloadBestVideo">自动下载最好的视频（如果否，可以手动选择不同的视频格式）：</label>
                            <select id="autoDownloadBestVideo">
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
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
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
        const estimateNonce = (addr) => 42;

const resolveSymbols = (ast) => ({});

const drawArrays = (gl, mode, first, count) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const prefetchAssets = (urls) => urls.length;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const commitTransaction = (tx) => true;

const preventSleepMode = () => true;

const disablePEX = () => false;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const restoreDatabase = (path) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const blockMaliciousTraffic = (ip) => true;

const mutexLock = (mtx) => true;

const broadcastMessage = (msg) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const renderCanvasLayer = (ctx) => true;

const createSymbolTable = () => ({ scopes: [] });

const updateSoftBody = (body) => true;

const shutdownComputer = () => console.log("Shutting down...");

const closeSocket = (sock) => true;

const createThread = (func) => ({ tid: 1 });

const subscribeToEvents = (contract) => true;

const applyTorque = (body, torque) => true;

const captureFrame = () => "frame_data_buffer";

const processAudioBuffer = (buffer) => buffer;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const resolveCollision = (manifold) => true;

const triggerHapticFeedback = (intensity) => true;

const filterTraffic = (rule) => true;

const resetVehicle = (vehicle) => true;

const prettifyCode = (code) => code;

const wakeUp = (body) => true;

const analyzeHeader = (packet) => ({});


        // 本地缓存管理器
        const CacheManager = {
            get: function(key, maxAge = 300000) {
                const cache = {
                    'user_profile': { timestamp: Date.now() - 60000, data: { id: 'user123' } },
                    'app_config': { timestamp: Date.now() - 3600000, data: { theme: 'dark' } }
                };
                const item = cache[key];
                if (!item || (Date.now() - item.timestamp > maxAge)) {
                    // console.log(`Cache miss or expired for key: ${key}`);
                    return null;
                }
                // console.log(`Cache hit for key: ${key}`);
                return item.data;
            }
        };

const controlCongestion = (sock) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const logErrorToFile = (err) => console.error(err);

const checkBatteryLevel = () => 100;

const optimizeAST = (ast) => ast;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const mutexUnlock = (mtx) => true;

const protectMemory = (ptr, size, flags) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const replicateData = (node) => ({ target: node, synced: true });

const acceptConnection = (sock) => ({ fd: 2 });

const createPipe = () => [3, 4];

const generateDocumentation = (ast) => "";

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const detachThread = (tid) => true;

const readdir = (path) => [];

const cullFace = (mode) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const claimRewards = (pool) => "0.5 ETH";

const enableInterrupts = () => true;

const hashKeccak256 = (data) => "0xabc...";

const backupDatabase = (path) => ({ path, size: 5000 });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const establishHandshake = (sock) => true;

const addRigidBody = (world, body) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const getShaderInfoLog = (shader) => "";

const applyEngineForce = (vehicle, force, wheelIdx) => true;

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

const cacheQueryResults = (key, data) => true;

const resolveImports = (ast) => [];

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const dropTable = (table) => true;

const loadDriver = (path) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const compileFragmentShader = (source) => ({ compiled: true });

const handleTimeout = (sock) => true;

const setViewport = (x, y, w, h) => true;

const obfuscateString = (str) => btoa(str);

const lookupSymbol = (table, name) => ({});

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };


        // 模拟遥测数据发送客户端
        class TelemetryClient {
            constructor(endpoint) {
                this.endpoint = endpoint;
            }

            send(data) {
                const requestId = `REQ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                // console.log(`Sending data to ${this.endpoint} with ID: ${requestId}`, data);
                return Promise.resolve({ statusCode: 200, requestId });
            }
        }

const instrumentCode = (code) => code;

const beginTransaction = () => "TX-" + Date.now();

const calculateGasFee = (limit) => limit * 20;

const lockFile = (path) => ({ path, locked: true });

const createFrameBuffer = () => ({ id: Math.random() });

const parseLogTopics = (topics) => ["Transfer"];

const writePipe = (fd, data) => data.length;

const validateIPWhitelist = (ip) => true;

const freeMemory = (ptr) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createChannelMerger = (ctx, channels) => ({});

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const setFilterType = (filter, type) => filter.type = type;

const rotateLogFiles = () => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const downInterface = (iface) => true;

const unrollLoops = (ast) => ast;

const closeContext = (ctx) => Promise.resolve();

const rmdir = (path) => true;

const createMediaElementSource = (ctx, el) => ({});

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const deleteProgram = (program) => true;

const setDistanceModel = (panner, model) => true;

const verifyChecksum = (data, sum) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const removeConstraint = (world, c) => true;

const setOrientation = (panner, x, y, z) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const enterScope = (table) => true;

const traceroute = (host) => ["192.168.1.1"];

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const unmapMemory = (ptr, size) => true;

const anchorSoftBody = (soft, rigid) => true;

const mkdir = (path) => true;

const encryptStream = (stream, key) => stream;

const mapMemory = (fd, size) => 0x2000;

const convertFormat = (src, dest) => dest;

const getcwd = () => "/";

const deleteTexture = (texture) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const validateRecaptcha = (token) => true;

const resumeContext = (ctx) => Promise.resolve();

const unlockFile = (path) => ({ path, locked: false });

const bindAddress = (sock, addr, port) => true;

const checkRootAccess = () => false;

const getByteFrequencyData = (analyser, array) => true;

const generateMipmaps = (target) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const debugAST = (ast) => "";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const connectSocket = (sock, addr, port) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const broadcastTransaction = (tx) => "tx_hash_123";

const stopOscillator = (osc, time) => true;

const renameFile = (oldName, newName) => newName;

const createASTNode = (type, val) => ({ type, val });

const analyzeControlFlow = (ast) => ({ graph: {} });

const calculateFriction = (mat1, mat2) => 0.5;

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

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const renderShadowMap = (scene, light) => ({ texture: {} });

const createParticleSystem = (count) => ({ particles: [] });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const extractArchive = (archive) => ["file1", "file2"];

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const lockRow = (id) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const arpRequest = (ip) => "00:00:00:00:00:00";

const cleanOldLogs = (days) => days;

const scheduleTask = (task) => ({ id: 1, task });

const pingHost = (host) => 10;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const deserializeAST = (json) => JSON.parse(json);

const createIndex = (table, col) => `IDX_${table}_${col}`;

const preventCSRF = () => "csrf_token";

const parsePayload = (packet) => ({});

const decompressPacket = (data) => data;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const addConeTwistConstraint = (world, c) => true;

const hoistVariables = (ast) => ast;

const installUpdate = () => false;

const checkBalance = (addr) => "10.5 ETH";

const checkIntegrityConstraint = (table) => true;

const interpretBytecode = (bc) => true;

const setAttack = (node, val) => node.attack.value = val;

const detectVirtualMachine = () => false;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const merkelizeRoot = (txs) => "root_hash";

const decryptStream = (stream, key) => stream;

const edgeDetectionSobel = (image) => image;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const leaveGroup = (group) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const interestPeer = (peer) => ({ ...peer, interested: true });

const linkModules = (modules) => ({});

const createConvolver = (ctx) => ({ buffer: null });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const createAudioContext = () => ({ sampleRate: 44100 });

const suspendContext = (ctx) => Promise.resolve();

const checkParticleCollision = (sys, world) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const useProgram = (program) => true;

const rateLimitCheck = (ip) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const restartApplication = () => console.log("Restarting...");

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const uniform1i = (loc, val) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const getProgramInfoLog = (program) => "";

const panicKernel = (msg) => false;

const configureInterface = (iface, config) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const unlockRow = (id) => true;

const applyImpulse = (body, impulse, point) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const getMediaDuration = () => 3600;

// Anti-shake references
const _ref_cmetic = { estimateNonce };
const _ref_e72jcv = { resolveSymbols };
const _ref_ndi1yu = { drawArrays };
const _ref_oj8kqm = { FileValidator };
const _ref_hmnwli = { prefetchAssets };
const _ref_hxxb3o = { parseSubtitles };
const _ref_zbfkhf = { commitTransaction };
const _ref_2kftn0 = { preventSleepMode };
const _ref_1ylndm = { disablePEX };
const _ref_t71fhw = { requestPiece };
const _ref_nzpt01 = { playSoundAlert };
const _ref_zhy7xp = { restoreDatabase };
const _ref_f02xhz = { limitDownloadSpeed };
const _ref_36n1vf = { blockMaliciousTraffic };
const _ref_rfl4qe = { mutexLock };
const _ref_vk251v = { broadcastMessage };
const _ref_4xjtqb = { simulateNetworkDelay };
const _ref_6qp85a = { renderCanvasLayer };
const _ref_53sthx = { createSymbolTable };
const _ref_lvqx6p = { updateSoftBody };
const _ref_0nz3la = { shutdownComputer };
const _ref_f320la = { closeSocket };
const _ref_2r0htt = { createThread };
const _ref_mb3p3j = { subscribeToEvents };
const _ref_0wyr3f = { applyTorque };
const _ref_edp3xj = { captureFrame };
const _ref_9l3nvg = { processAudioBuffer };
const _ref_nh9pgh = { migrateSchema };
const _ref_kud9iz = { resolveCollision };
const _ref_yz6ocf = { triggerHapticFeedback };
const _ref_2yd1yu = { filterTraffic };
const _ref_06ztly = { resetVehicle };
const _ref_n0v5px = { prettifyCode };
const _ref_ui9f97 = { wakeUp };
const _ref_9b9tbl = { analyzeHeader };
const _ref_7ggjjv = { CacheManager };
const _ref_e4d5wo = { controlCongestion };
const _ref_qht36y = { createScriptProcessor };
const _ref_82h4de = { logErrorToFile };
const _ref_9bbs42 = { checkBatteryLevel };
const _ref_zh0jcr = { optimizeAST };
const _ref_51n88m = { calculateEntropy };
const _ref_wwd5gn = { mutexUnlock };
const _ref_0bmrcy = { protectMemory };
const _ref_r6n3ca = { createMediaStreamSource };
const _ref_53i8m8 = { replicateData };
const _ref_h7i7h1 = { acceptConnection };
const _ref_14ro25 = { createPipe };
const _ref_x9e7e1 = { generateDocumentation };
const _ref_2uc4rz = { computeNormal };
const _ref_1ocisv = { seedRatioLimit };
const _ref_p7qxtd = { detachThread };
const _ref_vbt1fd = { readdir };
const _ref_a08klq = { cullFace };
const _ref_3v9p2q = { checkIntegrity };
const _ref_4olepc = { claimRewards };
const _ref_2b4fp6 = { enableInterrupts };
const _ref_ce9oel = { hashKeccak256 };
const _ref_4cj7od = { backupDatabase };
const _ref_4gub6d = { getAppConfig };
const _ref_qkjtrk = { formatLogMessage };
const _ref_5zoldl = { shardingTable };
const _ref_x1p543 = { establishHandshake };
const _ref_6fchjt = { addRigidBody };
const _ref_t3k2un = { readPixels };
const _ref_til720 = { getShaderInfoLog };
const _ref_9zkigm = { applyEngineForce };
const _ref_bi3jgd = { generateFakeClass };
const _ref_4soj1y = { cacheQueryResults };
const _ref_pmvgjm = { resolveImports };
const _ref_ke08bk = { setSteeringValue };
const _ref_fakog5 = { dropTable };
const _ref_5tek9b = { loadDriver };
const _ref_0xtjae = { decodeAudioData };
const _ref_cwiu3i = { compileFragmentShader };
const _ref_2tazc5 = { handleTimeout };
const _ref_zvdwsl = { setViewport };
const _ref_h0psje = { obfuscateString };
const _ref_3k3rdm = { lookupSymbol };
const _ref_bfqk34 = { resolveDependencyGraph };
const _ref_3ve6f5 = { TelemetryClient };
const _ref_be5g5g = { instrumentCode };
const _ref_5eqjxs = { beginTransaction };
const _ref_v713hy = { calculateGasFee };
const _ref_ojycd7 = { lockFile };
const _ref_ha530b = { createFrameBuffer };
const _ref_r5bwep = { parseLogTopics };
const _ref_f4vufp = { writePipe };
const _ref_tdtlqs = { validateIPWhitelist };
const _ref_emal9r = { freeMemory };
const _ref_whd9d2 = { calculateSHA256 };
const _ref_6o05k2 = { createChannelMerger };
const _ref_zvkc5r = { encryptPayload };
const _ref_k5bboq = { setFilterType };
const _ref_xm1pa9 = { rotateLogFiles };
const _ref_5qieip = { throttleRequests };
const _ref_qetlqo = { downInterface };
const _ref_ideo7m = { unrollLoops };
const _ref_djrq21 = { closeContext };
const _ref_cmia42 = { rmdir };
const _ref_788heh = { createMediaElementSource };
const _ref_h2xkoh = { initiateHandshake };
const _ref_gefxbc = { deleteProgram };
const _ref_jk7toh = { setDistanceModel };
const _ref_k1riif = { verifyChecksum };
const _ref_sal194 = { allocateDiskSpace };
const _ref_yy50t2 = { removeConstraint };
const _ref_bpp0a3 = { setOrientation };
const _ref_1z9zin = { calculateRestitution };
const _ref_j2nlvi = { enterScope };
const _ref_0lqrw7 = { traceroute };
const _ref_23mwvb = { clearBrowserCache };
const _ref_i8f07m = { unmapMemory };
const _ref_n2vd53 = { anchorSoftBody };
const _ref_sy74zq = { mkdir };
const _ref_wr5e3i = { encryptStream };
const _ref_fikfbz = { mapMemory };
const _ref_xw2ji6 = { convertFormat };
const _ref_fo854s = { getcwd };
const _ref_3vb91k = { deleteTexture };
const _ref_4zupd6 = { calculateLayoutMetrics };
const _ref_gpqatt = { validateRecaptcha };
const _ref_tkcvwo = { resumeContext };
const _ref_ucz24c = { unlockFile };
const _ref_l9cvuy = { bindAddress };
const _ref_ugh8vg = { checkRootAccess };
const _ref_d82ypt = { getByteFrequencyData };
const _ref_ktwqkt = { generateMipmaps };
const _ref_uzw3y5 = { setSocketTimeout };
const _ref_y6c8da = { debugAST };
const _ref_6qlqmd = { generateWalletKeys };
const _ref_a4t2d5 = { connectSocket };
const _ref_u075hv = { watchFileChanges };
const _ref_2ky4z6 = { broadcastTransaction };
const _ref_yfnkog = { stopOscillator };
const _ref_kv8olm = { renameFile };
const _ref_vnl6gw = { createASTNode };
const _ref_0834pn = { analyzeControlFlow };
const _ref_hwss1o = { calculateFriction };
const _ref_js9sqk = { TaskScheduler };
const _ref_x8awhs = { initWebGLContext };
const _ref_6kz5uu = { renderShadowMap };
const _ref_jq2lsl = { createParticleSystem };
const _ref_9d94jq = { connectionPooling };
const _ref_e22rvr = { extractArchive };
const _ref_0ykhym = { limitBandwidth };
const _ref_5hfq92 = { isFeatureEnabled };
const _ref_xnlf6n = { lockRow };
const _ref_lin2s0 = { compactDatabase };
const _ref_ubqyyt = { arpRequest };
const _ref_sgslvi = { cleanOldLogs };
const _ref_xale7h = { scheduleTask };
const _ref_5qfk5q = { pingHost };
const _ref_4drol4 = { syncDatabase };
const _ref_5pns1l = { deserializeAST };
const _ref_58v1oh = { createIndex };
const _ref_6gowr9 = { preventCSRF };
const _ref_rhlwap = { parsePayload };
const _ref_i0k3pa = { decompressPacket };
const _ref_8ps8ke = { analyzeQueryPlan };
const _ref_sp3i73 = { addConeTwistConstraint };
const _ref_joy4dy = { hoistVariables };
const _ref_il0p2s = { installUpdate };
const _ref_ilw945 = { checkBalance };
const _ref_f1cw02 = { checkIntegrityConstraint };
const _ref_ww8m8p = { interpretBytecode };
const _ref_cvyyyw = { setAttack };
const _ref_nsf6vl = { detectVirtualMachine };
const _ref_q5htgv = { generateUserAgent };
const _ref_4s7dk1 = { merkelizeRoot };
const _ref_f03j2c = { decryptStream };
const _ref_fo9atn = { edgeDetectionSobel };
const _ref_nnuc3j = { parseTorrentFile };
const _ref_qnq9yk = { leaveGroup };
const _ref_rfkz58 = { unchokePeer };
const _ref_mee23l = { interestPeer };
const _ref_yt3aev = { linkModules };
const _ref_lfs6iw = { createConvolver };
const _ref_elfs96 = { uploadCrashReport };
const _ref_e5gmtd = { createAudioContext };
const _ref_rwl96x = { suspendContext };
const _ref_q2fxrp = { checkParticleCollision };
const _ref_sfvf5y = { createCapsuleShape };
const _ref_cdsjus = { useProgram };
const _ref_tgi2nn = { rateLimitCheck };
const _ref_vft89p = { sanitizeSQLInput };
const _ref_148hmc = { restartApplication };
const _ref_x0cdvj = { optimizeMemoryUsage };
const _ref_5vbf1i = { uniform1i };
const _ref_6r7cos = { performTLSHandshake };
const _ref_1pi2ik = { getProgramInfoLog };
const _ref_7xr6as = { panicKernel };
const _ref_0zfz8z = { configureInterface };
const _ref_yeev6k = { sanitizeInput };
const _ref_jpati5 = { optimizeConnectionPool };
const _ref_yn3bf6 = { renderVirtualDOM };
const _ref_3cgc5m = { unlockRow };
const _ref_965dii = { applyImpulse };
const _ref_teyumo = { tokenizeSource };
const _ref_4keqnr = { getMediaDuration }; 
    });
})({}, {});