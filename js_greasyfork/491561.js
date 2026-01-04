// ==UserScript==
// @name         FaceFusion界面汉化
// @namespace    http://tampermonkey.net/
// @version      2024-04-04
// @description  基于FaceFusion 2.4.1
// @author       ssnangua
// @match        http://127.0.0.1:*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491561/FaceFusion%E7%95%8C%E9%9D%A2%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491561/FaceFusion%E7%95%8C%E9%9D%A2%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (!document.head.querySelector('[content="@teamGradio"]')) return;

    const message = {
        DONATE: "捐赠",
        "FRAME PROCESSORS": "帧处理器",
        face_swapper: "人脸替换",
        face_debugger: "人脸调试",
        face_enhancer: "人脸增强",
        frame_enhancer: "画面增强",
        lip_syncer: "口型同步",
        "FACE DEBUGGER ITEMS": "人脸调试项",
        "bounding-box": "边界框",
        "face-landmark-5": "特征标记-5",
        "face-landmark-5/68": "特征标记-5/68",
        "face-landmark-68": "特征标记-68",
        "face-mask": "人脸遮罩",
        "face-detector-score": "人脸检测分数",
        "face-landmarker-score": "特征标记分数",
        age: "年龄",
        gender: "性别",
        "FACE ENHANCER MODEL": "人脸增强模型",
        "FACE ENHANCER BLEND": "人脸增强混合",
        "FACE SWAPPER MODEL": "人脸替换模型",
        "FRAME ENHANCER MODEL": "画面增强模型",
        "FRAME ENHANCER BLEND": "画面增强混合",
        "LIP SYNCER MODEL": "口型同步模型",
        "EXECUTION PROVIDERS": "执行器",
        "EXECUTION THREAD COUNT": "执行线程数",
        "EXECUTION QUEUE COUNT": "执行队列数",
        "VIDEO MEMORY STRATEGY": "显存占用策略",
        strict: "strict（严格，显存资源有限）",
        moderate: "moderate（适中，灵活使用）",
        tolerant: "tolerant（宽松，显存资源充足）",
        "SYSTEM MEMORY LIMIT": "系统内存限制",
        "TEMP FRAME FORMAT": "中间帧格式",
        "OUTPUT PATH": "输出路径",
        "OUTPUT IMAGE QUALITY": "输出图片质量",
        "OUTPUT IMAGE RESOLUTION": "输出图片分辨率",
        "OUTPUT VIDEO ENCODER": "输出视频编码器",
        "OUTPUT VIDEO PRESET": "输出视频预设",
        ultrafast: "ultrafast（极快）",
        superfast: "superfast（超快）",
        veryfast: "veryfast（非常快）",
        faster: "faster（更快）",
        fast: "fast（快）",
        medium: "medium（中速）",
        slow: "slow（慢）",
        slower: "slower（更慢）",
        veryslow: "veryslow（非常慢）",
        "OUTPUT VIDEO QUALITY": "输出视频质量",
        "OUTPUT VIDEO RESOLUTION": "输出视频分辨率",
        "OUTPUT VIDEO FPS": "输出视频帧率",
        SOURCE: "源文件（人声音频、人脸图片）",
        TARGET: "目标文件（要处理的图片、视频）",
        OUTPUT: "输出",
        START: "开始",
        CLEAR: "清除",
        PREVIEW: "预览",
        "PREVIEW FRAME": "预览帧",
        "TRIM FRAME START": "开始帧",
        "TRIM FRAME END": "结束帧",
        "FACE SELECTOR MODE": "人脸检测模式",
        many: "many（多个）",
        one: "one（单个）",
        reference: "reference（参考）",
        "REFERENCE FACE": "参考人脸",
        "REFERENCE FACE DISTANCE": "参考人脸相似度",
        "FACE MASK TYPES": "人脸遮罩类型",
        box: "矩形框",
        occlusion: "识别遮挡",
        region: "特征区域",
        "FACE MASK BLUR": "人脸遮罩模糊",
        "FACE MASK PADDING TOP": "人脸遮罩上边距",
        "FACE MASK PADDING RIGHT": "人脸遮罩右边距",
        "FACE MASK PADDING BOTTOM": "人脸遮罩下边距",
        "FACE MASK PADDING LEFT": "人脸遮罩左边距",
        "FACE MASK REGIONS": "人脸特征区域",
        skin: "皮肤",
        "left-eyebrow": "左眉",
        "right-eyebrow": "右眉",
        "left-eye": "左眼",
        "right-eye": "右眼",
        "eye-glasses": "眼镜",
        nose: "鼻子",
        mouth: "嘴巴",
        "upper-lip": "上唇",
        "lower-lip": "下唇",
        "FACE ANALYSER ORDER": "人脸检测顺序",
        "left-right": "left-right（从左到右）",
        "right-left": "right-left（从右到左）",
        "top-bottom": "top-bottom（从上到下）",
        "bottom-top": "bottom-top（从下到上）",
        "small-large": "small-large（从小到大）",
        "large-small": "large-small（从大到小）",
        "best-worst": "best-worst（质量从高到低）",
        "worst-best": "worst-best（质量从低到高）",
        "FACE ANALYSER AGE": "人脸检测年龄",
        none: "none（不区分）",
        child: "child（小孩）",
        teen: "teen（青少年）",
        adult: "adult（成年人）",
        senior: "senior（老年人）",
        "FACE ANALYSER GENDER": "人脸检测性别",
        female: "female（女性）",
        male: "male（男性）",
        "FACE DETECTOR MODEL": "人脸检测模型",
        "FACE DETECTOR SIZE": "人脸检测大小",
        "FACE DETECTOR SCORE": "人脸检测分数",
        "FACE LANDMARKER SCORE": "特征标记分数",
        OPTIONS: "选项",
        "keep-temp": "保留临时文件",
        "skip-audio": "跳过音频",
        "skip-download": "跳过下载",
    };

    const $ = (s, p) => (p || document).querySelector(s);
    const $$ = (s, p) => (p || document).querySelectorAll(s);

    function t_html(el) {
        const prev = el.previousElementSibling;
        const s = (prev && prev.name) || el.innerHTML.trim();
        if (message[s]) el.innerHTML = message[s];
    }
    function t_text(el) {
        el.childNodes.forEach((el) => {
            if (el.nodeName === "#text") {
                const s = el.textContent.trim();
                if (message[s]) el.textContent = message[s];
            }
        });
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(({ target }) => {
            if (target.tagName === "INPUT") {
                t_html(target.nextElementSibling);
            } else if (target.tagName === "DIV") {
                $$("li", target).forEach(t_text);
            }
        });
    });

    function main() {
        if (!$("#component-0")) return setTimeout(main, 100);
        $$("a,span,button,li").forEach(t_html);
        $$("label").forEach(t_text);
        $$("input", $("fieldset")).forEach((input) => observer.observe(input, { attributes: true }));
        $$("label>.wrap").forEach((el) => observer.observe(el, { childList: true }));
    }
    main();
})();
