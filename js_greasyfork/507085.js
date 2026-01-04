// ==UserScript==
// @name         BGM同步章节制作人员信息
// @namespace    bgmanime
// @version      0.1.08
// @description  自动同步章节制作人员信息
// @author       heybye
// @include      /^https?://(bangumi|bgm|chii).(tv|in)/subject/[0-9]+/add_related/person/
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507085/BGM%E5%90%8C%E6%AD%A5%E7%AB%A0%E8%8A%82%E5%88%B6%E4%BD%9C%E4%BA%BA%E5%91%98%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/507085/BGM%E5%90%8C%E6%AD%A5%E7%AB%A0%E8%8A%82%E5%88%B6%E4%BD%9C%E4%BA%BA%E5%91%98%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    $("head").append(`<style>
        .display-inline{
            display: inline-block;
        }
    </style>`);
    const url = document.URL;
    const sitePattern = /^https?:\/\/(bangumi|bgm|chii)\.(tv|in)\//;
    const site = url.match(sitePattern)?.[0];
    const subjectId = url.split('/').slice(-3)[0];
    const subjectName = $("h1.nameSingle a").text();
    let epEl = $("ul#crtRelateSubjects > li").get();
    let persons = epEl.map(x => {
        return {"self" : x,
                "name" : $("p.title a.l",x).text(),
                "name_cn" : $("p.title small.grey",x).text().slice(2),
                "role" : $("select",x).val(),
                "id" : $("p.title a.l",x).attr("href").split('/').pop(),
                "url_mod" : "person",
               }
    });
     const regexes_per = {
        3: /(?<=[\u3040-\u9fa5]*?(脚本|シナリオ|剧本|编剧|プロット|大纲)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        4: /(?<=[\u3040-\u9fa5]*?(分镜|コンテ)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        5: /(?<=[\u3040-\u9fa5]*?(演出)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        9: /(?<=[\u3040-\u9fa5]*?(レイアウト|构图|layout|レイアウター)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        15:  /(?<=[\u3040-\u9fa5]*?(?<!総|总|アクション|メカ|ニック|エフェクト|动作|机械|特效)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        14: /(?<=(総作監|総作画監督|总作监|总作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        77: /(?<=(アクション作監|アクション作画監督|アクションディレクター|动作作监|动作作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        70: /(?<=(メカ作監|メカ作画監督|メカニック作画監督|机械作监|机械作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        88: /(?<=(エフェクト作監|エフェクト作画監督|特效作监|特效作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        20: /(?<=(原画|作画)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        90:  /(?<=[\u3040-\u9fa5]*?(?<!総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        91: /(?<=(演出)(補佐|补佐|协力|協力|辅佐|辅助|助理|助手)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        28: /(?<=(剪辑|編集)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        69:/(?<=(3DCGディレクター|CGディレクター|3DCG导演|CG导演)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        11:/(?<=(美術|美术|美術監督|美术监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        25:/(?<=(背景)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|･|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        56:/(?<=(制作进行|制作進行)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        84: /(?<=(设定制作|設定制作)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        37:/(?<=(制作デスク|制作管理|制作主任)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        76: /(?<=[\u3040-\u9fa5]*?(制作協力|制作协力|協力プロダクション)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
         //以下为bangumi没有的职位，使用>900的数字标注
        900:  /(?<=[\u3040-\u9fa5]*?(総作監|総作画監督|总作监|总作画监督|総作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        901: /(?<=(カラースクリプト)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
        902: /(?<=(イメージボード)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：)))(\W|\w)+?(?=\n|$)/g,
     };
    const regexes_role_per = {
        3: /[\u3040-\u9fa5]*?(脚本|シナリオ|剧本|编剧|プロット|大纲)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        4: /[\u3040-\u9fa5]*?(分镜|コンテ)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        5: /[\u3040-\u9fa5]*?(演出)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        9: /[\u3040-\u9fa5]*?(レイアウト|构图|layout|レイアウター)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        15:  /[\u3040-\u9fa5]*?(?<!総|总|アクション|メカ|ニック|エフェクト|动作|机械|特效)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        14: /(総作監|総作画監督|总作监|总作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        77: /(アクション作監|アクション作画監督|アクションディレクター|动作作监|动作作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|=|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        70: /(メカ作監|メカ作画監督|メカニック作画監督|机械作监|机械作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        88: /(エフェクト作監|エフェクト作画監督|特效作监|特效作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|･|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        20: /(原画|作画)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        90:  /[\u3040-\u9fa5]*?(?<!総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|協力|协力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        91: /(演出)(補佐|补佐|協力|协力|辅佐|辅助|助理|助手)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        28: /(剪辑|編集)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        69:/(3DCGディレクター|CGディレクター|3DCG导演|CG导演)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        11:/(美術|美术|美術監督|美术监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        25:/(背景)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|、|･|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        56:/(制作进行|制作進行)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        84:/(制作デスク|制作管理|制作主任)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        37: /(设定制作|設定制作)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        76: /[\u3040-\u9fa5]*?(制作協力|制作协力|協力プロダクション)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        //以下为bangumi没有的职位
        900:  /[\u3040-\u9fa5]*?(総作監|総作画監督|总作监|总作画监督|総作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        901: /(カラースクリプト)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        902: /(イメージボード)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
     };
     const regexes_role = {
        3: /[\u3040-\u9fa5]*?(脚本|シナリオ|剧本|编剧|プロット|大纲)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        4: /[\u3040-\u9fa5]*?(分镜|コンテ)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        5: /[\u3040-\u9fa5]*?(演出)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        9: /[\u3040-\u9fa5]*?(レイアウト|构图|layout|レイアウター)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        15:  /[\u3040-\u9fa5]*?(?<!総|总|アクション|メカ|ニック|エフェクト|动作|机械|特效)(作監|作画監督|作监|作画监督|作艦)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        14: /(総作監|総作画監督|总作监|总作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        77: /(アクション作監|アクション作画監督|アクションディレクター|动作作监|动作作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        70: /(メカ作監|メカ作画監督|メカニック作画監督|机械作监|机械作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|･|、|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        88: /(エフェクト作監|エフェクト作画監督|特效作监|特效作画监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|・|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        20: /(原画|作画)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        90:  /[\u3040-\u9fa5]*?(?<!総|总)(作監|作画監督|作监|作画监督|作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        91: /(演出)(補佐|补佐|协力|辅佐|辅助|協力|助理|助手)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        28: /(剪辑|編集)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|＆|=|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        69:/(3DCGディレクター|CGディレクター|3DCG导演|CG导演)\s*?(?:\uff1a|\u003A|】|\/|／|·|･|、|=|・|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        11:/(美術|美术|美術監督|美术监督)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        25:/(背景)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|･|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        56:/(制作进行|制作進行)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|･|=|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        84:/(制作デスク|制作管理|制作主任)\s*?(?:\uff1a|\u003A|】|\/|／|=|·|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))(\W|\w)+?(?=\n|$)/g,
        37: /(设定制作|設定制作)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|·|、|=|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        76: /[\u3040-\u9fa5]*?(制作協力|制作协力|協力プロダクション)\s*?(?:\uff1a|\u003A|】|\/|／|·|=|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
         //以下为bangumi没有的职位
        900:  /[\u3040-\u9fa5]*?(総作監|総作画監督|总作监|总作画监督|総作艦)(補佐|补佐|协力|協力|辅佐|辅助|助理)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|=|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        901: /(カラースクリプト)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
        902: /(イメージボード)\s*?(?:\uff1a|\u003A|】|\/|／|·|、|・|、|=|＆|\u0026|、|・|･|、|＆|\u0026|•|♦|◆|■|\s(?!:|：))/g,
     };
    const id_role = {
        3: "脚本",
        4: "分镜",
        5: "演出",
        9: "构图",
        15: "作监",
        14: "总作监",
        77: "动作作监",
        70: "机械作监",
        88: "特效作监",
        20: "原画",
        90: "作监辅",
        91: "演出辅",
        28: "剪辑",
        69: "CG导演",
        11: "美术监督",
        25: "背景美术",
        56: "制作进行",
        84: "设定制作",
        37: "制作管理",
        76: "制作协力",
         //以下为bangumi没有的职位，使用>900的数字标注
        900:  "bug字段",
        901: "bug字段",
        902: "bug字段",
     };
    const regex_sym = /[\uff1a\u003A【】\/／、，,、＆\u0026♦◆■=]/g;
    const regex_sym_div = /[\uff1a\u003A【】\/·・·，,･／、、＆\u0026♦◆■=]/g;
    async function getPersonInfo() {
        const [epRsp] = await Promise.all([
            fetch(`https://api.bgm.tv/v0/episodes?subject_id=${subjectId}`, { method: 'GET' }),
        ]);

        if (!epRsp.ok) {
            console.error('无法获取条目或人物信息');
            return;
        }
        let epRaw = await epRsp.json();
        //处理章节desc
        let r = new DefaultDict(() => new DefaultDict(() => []));
        const epdata = $.grep(epRaw.data, function(r) {
            return r.type == 0;
        });
        $("#epinfo-all").text(Object.entries(epdata).length);
        for(var ep of epdata){
            let desc = ep.desc;
            let id = ep.sort;
            desc = desc.replaceAll("\r","").replaceAll(regex_sym,"、").replaceAll(/[（(][\w\W]+?[）)]/g,"");
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
                        //const sameFamily = persons.filter(person=> person.name[0]==x.name[0]);
                        persons.forEach(person=>{
                            x.name = replaceSpace(x.name,person.name);
                            x.name = replaceSpace(x.name,person.name_cn);
                        });
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
        return Object.entries(r).sort((a, b) => a[0] - b[0]);
    }
    const perSearched = {};
    let available = false;
    async function search(subs,namestr,x,ep){
        for(var s of subs){
            if(s.trim() == "") continue;
            if(perSearched[s] === "") continue;
            let subjects;
            if(perSearched[s]){
                subjects = perSearched[s];
            }
            else{
                const rsp = await fetch(`${site}json/search-person/${encodeURIComponent(s)}`, { method: 'GET' });
                if (!rsp.ok) {
                    console.error('无法获取人物信息');
                    return;
                }
                const raw = await rsp.text();
                await sleep(1000);
                if(!raw||raw.includes("<")||raw=="[]"){
                    perSearched[s] = "";
                    continue;
                }
                subjects = JSON.parse(raw);
                perSearched[s] = subjects;
            }
            subjectList = subjects;
            for(var i in subjects){
                const idel = persons.find(p => p.id == subjects[i].id);
                if(!idel){
                    continue;
                }
                const el = persons.find(p => p.role == x[0]&&p.id == subjects[i].id);
                if(el){
                    const partinfo = $("input.inputtext.medium",el.self);
                    if(!parsePageno(partinfo.val()).includes(ep)){
                        if(partinfo.val()) partinfo.val(parsePageno2(parsePageno(`${partinfo.val()},${ep}`)));
                        else partinfo.val(`${ep}`);
                    }
                    namestr = trimCommas(namestr.replace(s,""));
                    continue;
                }
                const html = genSubjectList(subjects[i], i, 'submitForm');
                $('#subjectList').html(html);
                $(document).on('click', '#subjectList>li>a.avatar.h', function() {
                    $('#crtRelateSubjects li select').eq(0).attr('value', x[0])
                    $('#crtRelateSubjects li input.inputtext').eq(0).attr('value', `${ep}`);
                });
                $('#subjectList>li>a.avatar.h').click();
                $('#subjectList').empty();
                namestr = trimCommas(namestr.replace(s,""));
            }
        }
        return namestr;
    }
    function init() {
        async function update() {
            const epinfo = await getPersonInfo();
            if (!epinfo || epinfo.length < 1) return;
            const firstEp = epinfo[0][0];
            for (const [ep, roles] of epinfo) {
                const r = Object.entries(roles);
                if(r.map( x => x[1]).filter((arr) => arr.length > 0).length == 0) continue;
                for(var x of r){
                    if(x[0]>=900) continue;
                    for(var per of x[1]){
                        let namestr = per.name;
                        const addel = persons.filter(p => p.role == x[0]&&(per.name.includes(p.name) || (per.name.includes(p.name_cn)&&p.name_cn!="")));
                        let idel = persons.filter(p => per.name.includes(p.name) || (per.name.includes(p.name_cn)&&p.name_cn!=""));
                        idel = removeDuplicate(idel);
                        if(addel){
                            addel.forEach(el => {
                                const partinfo = $("input.inputtext.medium",el.self);
                                if(!parsePageno(partinfo.val()).includes(ep)){
                                    if(partinfo.val()) partinfo.val(parsePageno2(parsePageno(`${partinfo.val()},${ep}`)));
                                    else partinfo.val(`${ep}`);
                                }
                                idel = idel.filter(p=> p.name!=el.name);
                                namestr = trimCommas(namestr.replace(el.name,""));
                                namestr = trimCommas(namestr.replace(el.name,"").replace(el.name_cn,""));
                            });
                        }
                        if(idel){
                            for(var el of idel){
                                subjectList = [el];
                                const html = genSubjectList(el, 0, 'submitForm');
                                $('#subjectList').html(html);
                                $(document).on('click', '#subjectList>li>a.avatar.h', function() {
                                    $('#crtRelateSubjects li select').eq(0).attr('value', x[0])
                                    $('#crtRelateSubjects li input.inputtext').eq(0).attr('value', `${ep}`);
                                });
                                $('#subjectList>li>a.avatar.h').click();
                                $('#subjectList').empty();
                                namestr = trimCommas(namestr.replace(el.name,"").replace(el.name_cn,""));
                            }
                        }
                        const subs = namestr.split("、");
                        let ori_namestr = namestr;
                        namestr = await search(subs,namestr,x,ep);
                        if(ori_namestr == namestr){
                            namestr = namestr.replaceAll(regex_sym_div,"、");
                            const jcts = namestr.split("、");
                            ori_namestr = namestr;
                            namestr = await search(jcts,namestr,x,ep);
                            if(ori_namestr == namestr){
                                namestr = namestr.replaceAll(/\s/g,"、");
                                const space = namestr.split("、");
                                namestr = await search(space,namestr,x,ep);
                            }
                        }
                        namestr = namestr.replaceAll(regex_sym_div," ").trim();
                        if(namestr) $("#per-notfound").append(`${namestr} (EP${ep}, ${id_role[x[0]]})<br />`);
                        epEl = $("ul#crtRelateSubjects > li").get();
                        persons = epEl.map(x => {
                            return {"self" : x,
                                    "name" : $("p.title a.l",x).text(),
                                    "name_cn" : $("p.title small.grey",x).text().slice(2),
                                    "role" : $("select",x).val(),
                                    "id" : $("p.title a.l",x).attr("href").split('/').pop(),
                                    "url_mod" : "person",
                                   }
                        });
                    }
                }
                $("#epinfo-complete").text(ep-firstEp+1);
            }
            $(`ul#crtRelateSubjects li`).each((_,x)=>{
                const roleid = $(x).children().eq(2).val();
                if (roleid != 3 && roleid != 4 && roleid != 5) return;
                if ($(x).children().eq(4).val()) return;
                const nameEl = $(x).children().eq(1).children().eq(0);
                const id = `person-${roleid}-${nameEl.attr("href").split("/").pop()}`;
                $(x).prev().attr("id", id);
                $(`#per-empty`).append(`<a onclick="document.querySelector('#${id}').scrollIntoView({behavior: 'smooth'})">${nameEl.text()} (${id_role[roleid]})</a><br />`)
            });
        }
        function jump(id){
            document.querySelector('#'+ id).scrollIntoView({behavior: "smooth"});
        }
        //鼠标悬停时拉取参与信息
        $("#indexCatBox").append(`<hr class="board"/>
                                  <span class="display-inline"><h2 class="subtitle">组件：同步章节制作人员信息</h2></span>
                                  <input type="button" id="ep-btn" class="searchBtnL" value="开始同步" />
                                  <div>
                                      同步进度：
                                      <span id="epinfo-complete">0</span>/<span id="epinfo-all">0</span>。
                                      请参考<a class="l" href="https://ja.wikipedia.org/wiki/${subjectName}#各話リスト" target="_blank">日文维基</a>等网站进行检查。
                                  </div>
                                  <hr class="board" />
                                  <strong id="per-notfound"> 以下人员未找到关联项：<br /></strong>
                                  <br />
                                  <strong id="per-empty"> 以下人员同步后依然为空：<br /></strong>`
                                );

        $("#ep-btn").on("click",() => {
            update();

        });
    }



    function main() {
        init();
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
    }).join(',');
}
function parsePageno2(pn) {
    return pn.split(',').map(Number).reduce((acc, curr, i, arr) => {
        if (i === 0 || curr !== arr[i - 1] + 1) acc.push([curr]);
        else acc[acc.length - 1][1] = curr;

        return acc;
    }, []).map(range => range.length === 1 ? range[0] : range.join('-')).join(',');
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
        while(x.startsWith("・")){
            x = x.replace("・","").trimStart();
        }
        while(x.endsWith("・")) {
            x = x.split("").reverse().join("").replace("・","").trimStart().split("").reverse().join("");
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
function removeDuplicate(arr) {
    let len = arr.length
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[i].name === arr[j].name) {
                arr.splice(j, 1);
                len--;
                j--;
            }
        }
    }
    return arr;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}