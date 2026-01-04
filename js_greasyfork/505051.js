// ==UserScript==
// @name         BGM动画条目显示各章节参与制作人员信息
// @namespace    bgmanime
// @version      0.3.12
// @description  匹配章节简介和参与列表，显示章节制作人员
// @author       heybye, hyary
// @include      /^https?://(bangumi|bgm|chii).(tv|in)/
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505051/BGM%E5%8A%A8%E7%94%BB%E6%9D%A1%E7%9B%AE%E6%98%BE%E7%A4%BA%E5%90%84%E7%AB%A0%E8%8A%82%E5%8F%82%E4%B8%8E%E5%88%B6%E4%BD%9C%E4%BA%BA%E5%91%98%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/505051/BGM%E5%8A%A8%E7%94%BB%E6%9D%A1%E7%9B%AE%E6%98%BE%E7%A4%BA%E5%90%84%E7%AB%A0%E8%8A%82%E5%8F%82%E4%B8%8E%E5%88%B6%E4%BD%9C%E4%BA%BA%E5%91%98%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

const svgExpand = `
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1"/>
</svg>
`;

const svgCollapse = `
<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 14h6v6M3 21l6.1-6.1M20 10h-6V4M21 3l-6.1 6.1"/>
</svg>
`;
(function () {
    // 表单提交后刷新缓存
    $("form").each((_, form) => {
        form.addEventListener("submit", () => {
            Object.keys(sessionStorage)
                .filter(key => key.startsWith('epinfo-'))
                .forEach(key => sessionStorage.removeItem(key));
        });
    });
    const url = document.URL;
    const sitePattern = /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\//;
    const site = url.match(sitePattern)?.[0];

    let epUl, epEl, mode;

    if (!site) return;  // 如果不匹配站点，直接返回

    switch (true) {
        case /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/(subject\/\d+)?$/.test(url):
            epUl = $("ul.prg_list").get();
            epEl = $("ul.prg_list > li a").get();
            mode = 0;
            if (epEl.length === 0) return; // 如果没有单集列表，直接返回
            break;

        case /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/subject\/\d+\/ep$/.test(url):
            epEl = $("ul.line_list > li").get();
            mode = 1;
            break;

        case /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\/ep\/\d+$/.test(url):
            mode = 2;
            break;

        default:
            return;
    }
    $("head").append(`<style>
        .epinfo {
            font-size: 12px;
        }
        .epinfo-hidden {
            display: none;
        }
        .subject_ep_section {
            position: relative;
        }
        .epinfo-toggle {
            position: absolute;
            right: 0.5rem;
            top: 0.5rem;
            width: 1.2rem;
            height: 1.2rem;
            color: #aaa;
            cursor: pointer;
            text-align: center;
        }
        .ps{
            padding-left: 1.1rem;
        }
        ul.line_list li.cat {
            padding-left: 5px;
        }
        a.toggle-pointer{
            cursor:pointer;
        }
        .ep-personinfo{
            margin-top: 5px;
            margin-bottom: 5px;
        }
    </style>`);

    //正则表达式匹配单集desc

     const regexes_per = {
        "脚本": /(?<=[\u3040-\u9fa5]*?(脚本|シナリオ|剧本|编剧|プロット|大纲)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "分镜": /(?<=[\u3040-\u9fa5]*?(分镜|コンテ)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "演出": /(?<=[\u3040-\u9fa5]*?(演出)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "构图": /(?<=[\u3040-\u9fa5]*?(レイアウト|构图|layout|レイアウター)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "作画监督":  /(?<=[\u3040-\u9fa5]*?(?<!総|总|アクション|メカ|ニック|エフェクト|动作|机械|特效)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "总作画监督": /(?<=(総|总)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "动作作画监督": /(?<=(アクション|动作)(作監|作画監督|設計|设计|ディレクター|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "机械作画监督": /(?<=(メカ|メカニック|机械)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "特效作画监督": /(?<=(エフェクト|特效|特技)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "原画": /(?<=(原画|作画)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "作画监督助理":  /(?<=[\u3040-\u9fa5]*?(?<!総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "演出助理": /(?<=(演出|(?<!作画)監督)(補佐|补佐|协力|協力|辅佐|辅助|助理|助手)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "剪辑": /(?<=(剪辑|編集)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "CG 导演":/(?<=(3DCGディレクター|CGディレクター|3DCG导演|CG导演)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "美术监督":/(?<=(美術|美术|美術監督|美术监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "背景美术":/(?<=(背景)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|･|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "制作进行":/(?<=(制作进行|制作進行)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "设定制作": /(?<=(设定制作|設定制作)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "制作管理":/(?<=(制作デスク|制作管理|制作主任)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "制作协力": /(?<=[\u3040-\u9fa5]*?(制作協力|制作协力|協力プロダクション)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
         //以下为bangumi没有的职位
        "总作画监督助理":  /(?<=(総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        "色彩演出": /(?<=(カラースクリプト)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,//汉字来自日本制作厨森甲斐的职种确认表。
        "氛围稿": /(?<=(イメージボード)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
     };
    const regexes_role_per = {
        "脚本": /[\u3040-\u9fa5]*?(脚本|シナリオ|剧本|编剧|プロット|大纲)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "分镜": /[\u3040-\u9fa5]*?(分镜|コンテ)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "演出": /[\u3040-\u9fa5]*?(演出)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "构图": /[\u3040-\u9fa5]*?(レイアウト|构图|layout|レイアウター)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "作画监督":  /[\u3040-\u9fa5]*?(?<!総|总|アクション|メカ|ニック|エフェクト|动作|机械|特效)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "总作画监督": /(総|总)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "动作作画监督": /(アクション|动作)(作監|作画監督|設計|设计|ディレクター|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|=|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "机械作画监督": /(メカ|メカニック|机械)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "特效作画监督": /(エフェクト|特效|特技)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|･|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "原画": /(原画|作画)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "作画监督助理":  /[\u3040-\u9fa5]*?(?<!総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|協力|协力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "演出助理": /(演出|(?<!作画)監督)(補佐|补佐|協力|协力|辅佐|辅助|助理|助手)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "剪辑": /(剪辑|編集)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "CG 导演":/(3DCGディレクター|CGディレクター|3DCG导演|CG导演)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "美术监督":/(美術|美术|美術監督|美术监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "背景美术":/(背景)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|、|･|＆|\u0026|•|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "制作进行":/(制作进行|制作進行)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|･|、|＆|\u0026|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "制作管理":/(制作デスク|制作管理|制作主任)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "设定制作": /(设定制作|設定制作)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "制作协力": /[\u3040-\u9fa5]*?(制作協力|制作协力|協力プロダクション)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        //以下为bangumi没有的职位
        "总作画监督助理":  /(総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "色彩演出": /(カラースクリプト)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        "氛围稿": /(イメージボード)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
    };
     const regexes_role = {
        "脚本": /[\u3040-\u9fa5]*?(脚本|シナリオ|剧本|编剧|プロット|大纲)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "分镜": /[\u3040-\u9fa5]*?(分镜|コンテ)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "演出": /[\u3040-\u9fa5]*?(演出)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "构图": /[\u3040-\u9fa5]*?(レイアウト|构图|layout|レイアウター)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "作画监督":  /[\u3040-\u9fa5]*?(?<!総|总|アクション|メカ|ニック|エフェクト|动作|机械|特效)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "总作画监督": /(総|总)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "动作作画监督": /(アクション|动作)(作監|作画監督|設計|设计|ディレクター|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "机械作画监督": /(メカ|メカニック|机械)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "特效作画监督": /(エフェクト|特效|特技)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "原画": /(原画|作画)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "作画监督助理":  /[\u3040-\u9fa5]*?(?<!総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "演出助理": /(演出|(?<!作画)監督)(補佐|补佐|协力|辅佐|辅助|協力|助理|助手)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "剪辑": /(剪辑|編集)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|＆|=|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "CG 导演":/(3DCGディレクター|CGディレクター|3DCG导演|CG导演)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "美术监督":/(美術|美术|美術監督|美术监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "背景美术":/(背景)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|･|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "制作进行":/(制作进行|制作進行)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "制作管理":/(制作デスク|制作管理|制作主任)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "设定制作": /(设定制作|設定制作)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "制作协力": /[\u3040-\u9fa5]*?(制作協力|制作协力|協力プロダクション)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
         //以下为bangumi没有的职位
        "总作画监督助理":  /(総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "色彩演出": /(カラースクリプト)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        "氛围稿": /(イメージボード)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
     };
    const regex_sym = /[\uff1a\u003A【】\/／、、＆\u0026♦◆■=]/g;
    function parsePersonInfo(raw){
        const parser = new DOMParser();
        const doc = parser.parseFromString(raw, 'text/html');
        const col = $("#columnInSubjectA", doc).eq(0);
        return $("> div.light_odd", col).get().flatMap((el) => {
            return $("div div.prsn_info p span.badge_job", el).map((_,role) =>{
                return {
                    "name": $("div h2 a",el).contents().filter((_, el) => el.nodeType === 3).text().trim(),
                    "name_cn": $("div h2 a span.tip",el).text(),
                    "relation": $(role).text(),
                    "eps": $(role).next().text(),
                    "id": $("div.rr a",el).attr("href").split("/").pop(),
                    "comments": parseInt($("div.rr small",el).text().slice(2, -1)),
                };
            }).get();
        });
    }
    async function getPersonInfo(subjectId) {
        const [epRsp, rsp] = await Promise.all([
            fetch(`https://api.bgm.tv/v0/episodes?subject_id=${subjectId}`, { method: 'GET' }),
            fetch(`${site}subject/${subjectId}/persons`, { method: 'GET' })
        ]);

        if (!epRsp.ok || !rsp.ok) {
            console.error('无法获取条目或人物信息');
            return;
        }
        let epRaw = await epRsp.json();
        let raw = await rsp.text();
        //处理章节desc
        let r = new DefaultDict(() => new DefaultDict(() => []));
        for(var ep of epRaw.data){
            let { id, desc } = ep;
            desc = desc.replaceAll("\r","").replaceAll(regex_sym,"、");
            let regexes = Object.entries(regexes_per).sort((a,b) => {
                const posA = desc.search(a[1]);
                const posB = desc.search(b[1]);
                return posA < 0 ? 1 : posB < 0 ? -1 : posA - posB;
            });
            regexes.forEach(([role, regex]) => {
                const matches = desc.match(regex);
                for(var ro in r[id]){
                    r[id][ro].forEach(x => {
                        const replaced = trimCommas( x.name.replaceAll( regexes_role_per[role] ,"" ));
                        if( replaced[0] != x.name[0] ) x.name = trimCommas( x.name.replaceAll( regexes_role[role] ,"" ));
                        else x.name = replaced;
                    });
                }
                r[id][role] = [];
                if (matches) {
                    r[id][role] = matches.map(x => ({ href: [], name: trimCommas(x) }));
                }
            });
            regexes.forEach(([role, regex]) => {
                const matches = desc.match(regex);
                for(var ro in r[id]){
                    r[id][ro].forEach(x => {
                        const replaced = trimCommas( x.name.replaceAll( regexes_role_per[role] ,""));
                        if( replaced[0] != x.name[0] ) x.name = trimCommas( x.name.replaceAll( regexes_role[role] ,""));
                        else x.name = replaced;
                    });
                }
            });
            //过滤重复元素
            for(var ro in r[id]){
                const simplified = r[id][ro].sort((a,b) => b.name - a.name).reduce((p,n) => {
                    if( !p.includes(n.name) && n.name != ' ' ) return p + n.name + '^^^';
                    else return p;
                },'').split("^^^").map( x => ({ href: [], name: trimCommas(x) }));
                if(simplified[simplified.length-1].name == "") simplified.pop();
                r[id][ro] = simplified;
            }
        }
        //处理章节参与
        const doc = $.grep(parsePersonInfo(raw), function(r) {
            return r.eps!="";
        });
        for(var person of doc){
            const eps = person.eps ? parsePageno(person.eps) : [-1];
            eps.forEach(ep => {
                 ["SP", "OP", "ED"].forEach((key, index) => {
                    if (ep[key]) {
                        ep[key].forEach(sort => {
                            const fEp = epRaw.data.find(function(item) {
                                return item.sort == sort && item.type == index + 1;
                            });
                            if (fEp) {
                                const i = r[fEp.id][person.relation].findIndex((x) => {
                                    if(person.name_cn) x.name = x.name.replace(person.name_cn,person.name);
                                    if(x.name.includes(person.name))
                                        return true;
                                    else{
                                        x.name = replaceSpace(x.name,person.name);
                                        if(x.name.includes(person.name))
                                            return true;
                                    }
                                });
                                const [href,name] =[`/person/${person.id}`, `<a href="/person/${person.id}" class="l">${person.name}</a>`];
                                if(i == -1) r[fEp.id][person.relation].push({href,name});
                                else r[fEp.id][person.relation][i].name=r[fEp.id][person.relation][i].name.replace(person.name,name);
                            }
                        });
                    }
                });
                if (!ep.SP && !ep.OP && !ep.ED) {
                    const fEp = epRaw.data.find(function(item) {
                        return item.sort == ep && item.type == 0;
                    });
                    if (fEp) {
                        const i = r[fEp.id][person.relation].findIndex((x) => {
                            if(person.name_cn) x.name = x.name.replace(person.name_cn,person.name);
                            if(x.name.includes(person.name))
                                return true;
                            else{
                                x.name = replaceSpace(x.name,person.name);
                                if(x.name.includes(person.name))
                                    return true;
                            }
                        });
                        const [href,name] =[`/person/${person.id}`, `<a href="/person/${person.id}" class="l">${person.name}</a>`];
                        if(i == -1) r[fEp.id][person.relation].push({href,name});
                        else r[fEp.id][person.relation][i].name=r[fEp.id][person.relation][i].name.replace(person.name,name);
                    }
                }
            });
        }
        return Object.entries(r).sort((a, b) => a[0] - b[0]);
    }
    function formatEpInfo_0(epinfo,epid) {
        return `<div class="epinfo">` + epinfo.map(([role, persons]) => {
            const p = `${persons.map(({ href, name }) => name).join('、')}`;
            return p.replaceAll(/<(\w|\W)*?>/g,"").length>30 ?
                `<span class="epinfo-${epid} epinfo-hidden">`+`<span class="tip">${role}</span>：` + p +`<br /></span>`:
                `<span class="epinfo-${epid} ">`+`<span class="tip">${role}</span>：` + p +`<br /></span>`;
        }).join('') +
            `</div>` + `<hr class="board" />`+
            `<a class="toggle-${epid} l toggle-pointer" hidden>更多制作人员</a>`+
            `<hr class="toggle-${epid} board" hidden/>`;
    }
    function formatEpInfo_1(epinfo,epid) {
        return `<div class="epinfo">` + epinfo.map(([role, persons]) => {
            const p = `${persons.map(({ href, name }) => name).join('、')}`;
            return p.replaceAll(/<(\w|\W)*?>/g,"").length>30 ?
                `<small class="epinfo-${epid} epinfo-hidden grey ps">`+`<small class="grey">${role}</small>：` + p +`<br /></small>`:
                `<small class="epinfo-${epid} grey ps">`+`<small class="grey">${role}</small>：` + p +`<br /></small>`;
        }).join('') +
            `</div>`;
    }
    function formatEpInfo_2(epinfo,epid) {
        return `<div class="epinfo"><hr class="board" /><h2 class="subtitle">参与制作人员</h2><div class="ep-personinfo">` + epinfo.map(([role, persons]) => {
            const p = `${persons.map(({ href, name }) => {
                const namematch = name.match(/<a[\w\W]+?<\/a>/g);
                if(namematch) return namematch.join("、");
                else return '';
            }).filter(x => x!='').join('、')}`;
            if(p) return `<span class="epinfo-${epid} tip">`+`<span class="tip">${role}</span>：` + p +`<br /></span>`;
            else return '';
        }).join('') +
            `</div></div>`;
    }


    async function initEpInfo_0(epEl,sid) {
        let epinfo = sessionStorage.getItem(`epinfo-${sid}`);
        if (!epinfo) {
            epinfo = await getPersonInfo(sid);
            sessionStorage.setItem(`epinfo-${sid}`, JSON.stringify(epinfo));
        } else {
            epinfo = JSON.parse(epinfo);
        }
        if (epinfo){
            if (epinfo.length < 1) return;   //没有任何参与信息
            for (const [ep, roles] of epinfo) {
                if(Object.entries(roles).map( x => x[1]).filter((arr) => arr.length > 0).length == 0) continue;
                const html = formatEpInfo_0(mergeKeys(Object.entries(roles), (ps) => ps.map(p => p.name).join('、')),ep);
                const prgInfoEl = $(`#prginfo_${ep} span.tip`);
                prgInfoEl.find('span.cmt.clearit').before(html);
                if( $( `.epinfo-${ep}.epinfo-hidden` ).get().length > 0 )
                    $(`#prginfo_${ep} span.tip .toggle-${ep}`).removeAttr("hidden");
                prgInfoEl.find(`a.toggle-${ep}`).click(() => {
                    $(`.epinfo-${ep}`).fadeIn();
                    $(`#prginfo_${ep} span.tip .toggle-${ep}`).attr('hidden', true);
                });
            }
        }
    }
    let isEpInit = false;
    async function initEpInfo_1(epEl,sid) {
        if (isEpInit) {
            return;
        }
        isEpInit = true;
        let epinfo = sessionStorage.getItem(`epinfo-${sid}`);
        if (!epinfo) {
            epinfo = await getPersonInfo(sid);
            sessionStorage.setItem(`epinfo-${sid}`, JSON.stringify(epinfo));
        } else {
            epinfo = JSON.parse(epinfo);
        }
        if (epinfo){
            if (epinfo.length < 1) return;   //没有任何参与信息
            for (const [ep, roles] of epinfo) {
                if(Object.entries(roles).map( x => x[1]).filter((arr) => arr.length > 0).length == 0) continue;
                const html = formatEpInfo_1(mergeKeys(Object.entries(roles), (ps) => ps.map(p => p.name).join('、')),ep);
                const prgInfoEl = epEl.find(el => $(`h6 a`,el).attr('href') == '/ep/' + ep);
                if(prgInfoEl!=null) $(html).appendTo(prgInfoEl);
            }
        }
    }
    async function initEpInfo_2(sid,epid) {
        let epinfo = sessionStorage.getItem(`epinfo-${sid}`);
        if (!epinfo) {
            epinfo = await getPersonInfo(sid);
            sessionStorage.setItem(`epinfo-${sid}`, JSON.stringify(epinfo));
        } else {
            epinfo = JSON.parse(epinfo);
        }
        if (epinfo){
            if (epinfo.length < 1) return;   //没有任何参与信息
            const ep = epinfo.find(x => x[0] == epid);
            const html = formatEpInfo_2(mergeKeys(Object.entries(ep[1]), (ps) => ps.map(p => p.name).join('、')),ep[0]);
            $('.singleCommentList').before(html);
        }
    }
    function initToggle_0() {
        async function update(el) {
            if(el.firstElementChild){
                let sid = el.firstElementChild.firstElementChild.getAttribute("subject_id");
                let els = $(`a[subject_id='${sid}']`,el).get();
                if(sid == null){
                    sid = url.split('/').pop();
                    els = epEl;
                }
                await initEpInfo_0(els,sid);
            }
        }
        //鼠标悬停时拉取参与信息
        for(const el of epUl){
            el.addEventListener("mouseenter",()=>{
                if(!el.hasAttribute("isShown")){
                    el.setAttribute("isShown",true);
                    update(el);
                }
            });
        }
    }

    function initToggle_1() {
        let isShown = { [null]: true, 'true': true, 'false': false }[localStorage.getItem('bgm-epinfo-shown')];
        async function update() {
            toggleEl.html(isShown ? svgCollapse : svgExpand);
            if (isShown) {
                const [sid,ep] = url.split('/').slice(-2);
                await initEpInfo_1(epEl,sid);
            }
            $(".epinfo").toggleClass('epinfo-hidden', !isShown);
        }
        $(".line_detail").addClass("subject_ep_section");

        $(".subject_ep_section").append(`<div class="epinfo-toggle"></div>`)
        const toggleEl = $(".epinfo-toggle");
        let longPressTimer;
        toggleEl.click(() => {
            isShown = !isShown;
            update();
        }).on('mousedown touchstart', (e) => {
            e.preventDefault();
            longPressTimer = setTimeout(() => {
                isShown = !isShown;
                if (!confirm(`是否切换默认为${isShown ? '展开' : '收起'}章节参与信息？`)) {
                    return;
                }
                localStorage.setItem('bgm-epinfo-shown', isShown);
                update();
            }, 750);
        }).on('mouseleave mouseup touchend', (e) => {
            e.preventDefault();
            clearTimeout(longPressTimer);
        });
        update();
    }

    function main() {
        if(mode == 0)
            initToggle_0();
        else if(mode == 1)
            initToggle_1();
        else if(mode == 2){
            const [sid] = $('.nameSingle a').attr('href').split('/').slice(-1);
            const epid = url.split('/').pop();
            initEpInfo_2(sid,epid);
        }
    }
    main();

})();

class DefaultDict {
    constructor(defaultInit) {
        return new Proxy({}, {
            get: (target, name) => name in target ? target[name] : (target[name] = defaultInit())
        })
    }
}

/// Merge keys with the same value
function mergeKeys(objEntries, keyFn) {
    const d = objEntries.reduce((acc, [k, v]) => {
        const sk = keyFn(v);
        if(sk!="") acc[sk] = [sk in acc ? acc[sk][0] + '、' + k : k, v];
        return acc;
    }, {});
    return Object.entries(d).map(([sk, kv]) => kv);
}

/// e.g. `1,3-5,7` => [1, 3, 4, 5, 7] `OP1-2` => {OP:[1,2]} `8.5` => {SP:[8.5]}
function parsePageno(pn) {
    return pn.split(',').flatMap(x => {
        for ( var key of ["SP", "OP", "ED"] ) {
            if( x.startsWith(key) ){
                x = x.replaceAll(key,"");
                const [start, end] = x.split('-').map(x => parseFloat(x));
                return {[key]:Array.from({ length: (end || start) - start + 1 }, (_, i) => start + i)};
            }
        }
        if (/[.]/.test(x) && !/[-]/.test(x)) {
            return { "SP":[parseFloat(x)] };
        }
        const [start, end] = x.split('-').map(x => parseFloat(x));
        return Array.from({ length: (end || start) - start + 1 }, (_, i) => start + i);
    });
}
//去除首尾、和空格
function trimCommas(x){
    if (typeof x === 'string'){
        x = x.trim();
        while(x.startsWith("、")){
            x = x.replace("、","").trimStart();
        }
        while(x.endsWith("、")) {
            x = x.split("").reverse().join("").replace("、","").trimStart().split("").reverse().join("");
        }
    }
    return x;
}
//匹配姓名中间带空格的人物名称，并进行替换
function replaceSpace(ori_str, per_str){
    if(typeof ori_str === 'string' && typeof per_str === 'string'){
        for(var i = 1; i < per_str.length ; i++){
            const per_withSpace = `${per_str.slice(0, i)} ${per_str.slice(i)}`;
            if(ori_str.includes(per_withSpace)){
                return ori_str.replace(per_withSpace,per_str);
            }
            const per_withFullSpace = `${per_str.slice(0, i)}　${per_str.slice(i)}`;
            if(ori_str.includes(per_withFullSpace)){
                return ori_str.replace(per_withFullSpace,per_str);
            }
        }
    }
    return ori_str;
}