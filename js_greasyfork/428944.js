// ==UserScript==
// @name         AO3 Post New Work EN/CN 发布新作品页面中文翻译
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adding additional information in CN on Post New Work web page.
// @author       Alice Wandaland
// @match        https://archiveofourown.org/works/new
// @icon         https://www.google.com/s2/favicons?domain=archiveofourown.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428944/AO3%20Post%20New%20Work%20ENCN%20%E5%8F%91%E5%B8%83%E6%96%B0%E4%BD%9C%E5%93%81%E9%A1%B5%E9%9D%A2%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/428944/AO3%20Post%20New%20Work%20ENCN%20%E5%8F%91%E5%B8%83%E6%96%B0%E4%BD%9C%E5%93%81%E9%A1%B5%E9%9D%A2%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout (function () {

        // add user script instruction directly on the web page
        document.querySelector("#work-form > p").insertAdjacentHTML('afterEnd', '<p class="script note"> 用户脚本提示：鼠标悬浮于文字上方有更多中文注释 </p>')

        // selector
        const selector = [
            "#main > h2",
            "#work-form > p",
            "#work-form > fieldset.work.meta > dl > dt.rating.required > label",
            "#work-form > fieldset.work.meta > p",
            "#work-form > fieldset.work.meta > legend",
            "#work_rating_string > option:nth-child(1)",
            "#work_rating_string > option:nth-child(2)",
            "#work_rating_string > option:nth-child(3)",
            "#work_rating_string > option:nth-child(4)",
            "#work_rating_string > option:nth-child(5)",
            "#work-form > fieldset.work.meta > dl > dt.warning.required > label",
            "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(2) > label",
            "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(3) > label",
            "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(4) > label",
            "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(5) > label",
            "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(6) > label",
            "#work-form > fieldset.work.meta > dl > dd.warning.required > fieldset > ul > li:nth-child(7) > label",
            "#work-form > fieldset.work.meta > dl > dt.fandom.required > label",
            "#work-form > fieldset.work.meta > dl > dt.category > label",
            "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(2) > label",
            "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(3) > label",
            "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(4) > label",
            "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(5) > label",
            "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(6) > label",
            "#work-form > fieldset.work.meta > dl > dd.category > fieldset > ul > li:nth-child(7) > label",
            "#work-form > fieldset.work.meta > dl > dt.relationship > label",
            "#work-form > fieldset.work.meta > dl > dt.character > label",
            "#work-form > fieldset.work.meta > dl > dt.freeform > label",
            "#work-form > fieldset.preface > dl > dt.title.required > label",
            "#work-form > fieldset.preface > dl > dt.byline.coauthors > label",
            "#work-form > fieldset.preface > dl > dt.summary > label",
            "#work-form > fieldset.preface > dl > dt.notes",
            "#work-form > fieldset.preface > dl > dd.notes > ul > li.start > label",
            "#work-form > fieldset.preface > dl > dd.notes > ul > li.end > label",
            "#associations > dl > dt.collection > label",
            "#associations > dl > dt.recipient > label",
            "#associations > dl > dd.parent > label",
            "#associations > dl > dd.serial > label",
            "#associations > dl > dd.chaptered.wip > label",
            "#associations > dl > dd.backdate > label",
            "#associations > dl > dt.language.required > label",
            "#associations > dl > dt.skin > label",
            "#work-form > fieldset.privacy > dl > dd.restrict > label",
            "#work-form > fieldset.privacy > dl > dd.moderated.comments > label",
            "#work-form > fieldset.privacy > dl > dt.permissions.comments",
            "#work-form > fieldset.privacy > dl > dd.permissions.comments > fieldset > ul > li:nth-child(1) > label",
            "#work-form > fieldset.privacy > dl > dd.permissions.comments > fieldset > ul > li:nth-child(2) > label",
            "#work-form > fieldset.privacy > dl > dd.permissions.comments > fieldset > ul > li:nth-child(3) > label",
            "#work-form > fieldset.work.text > legend",
            "#work-form > fieldset.work.text > p.rtf-html-instructions.note > span.html-notes",
            "#work-form > fieldset.work.text > ul > li:nth-child(1) > a",
            "#work-form > fieldset.work.text > p.notice"
        ];

        // add html title information
        const _title = {
            "Post New Work": "发布新作品",
            "* Required information": "必填区域的标题为红色字体，并用星号标示",
            "Tags are comma separated, 100 characters per tag.": "标签由逗号隔开，单个标签上限100字",
            "Tags": "标签: 标明与作品相关的主要信息",
            "Rating*": "分级: 必填",
            "Not Rated": "无分级: 如果您不想为作品表明内容分级",
            "General Audiences": "普遍级: 适合所有年龄人群",
            "Teen And Up Audiences": "青少年以上: 不适合13岁以下的观众",
            "Mature": "限制级: 包含成人主题（性交，暴力等)",
            "Explicit": "成人级: 包含露骨的成人主题，例如色情、直白的暴力描写等",
            "Archive Warnings*": "AO3警告: 必填",
            "Choose Not To Use Archive Warnings": "作者选择不使用AO3警告: 如果您不想使用它们",
            "Graphic Depictions Of Violence": "激烈暴力描写: 血腥，激烈而露骨的暴力描写",
            "Major Character Death": "主要角色死亡",
            "No Archive Warnings Apply": "无适用的AO3警告",
            "Rape/Non-Con": "强暴/非自愿",
            "Underage": "未成年人性描写: 作品内容含有关于十八岁以下角色的性描写",
            "Fandoms*": "同人圈: 必填\n原作或原型名称，可多选，建议使用全名而不是缩写\n多个标签请用逗号隔开",
            "Categories": "分类: 恋爱关系或性关系分类",
            "F/F": "女/女: 女性/女性配对",
            "F/M": "男/女: 男性/女性配对",
            "Gen": "通常向: 无恋爱关系或性关系, 或者恋爱关系并非作品重点",
            "M/M": "男/男: 男性/男性配对",
            "Multi": "多配对: 含有一类以上的配对，或者含有数个伴侣的配对",
            "Other": "其他: 其他类型的配对",
            "Relationships": "配对: 作品中的主要配对（可多选）\n请尽可能使用全名\n斜杠（“/”）表示恋爱或性关系，“&”符号表示亲情、友情或柏拉图式关系\n多个标签请用逗号隔开",
            "Characters": "角色: 作品中的主要角色（可多选）\n请尽可能使用全名\n多个标签请用逗号隔开，原创角色可输入“original character”",
            "Additional Tags": "其他标签: 添加没有包括在其它范围内的标签\n请不要在此处输入同人圈、配对或者角色姓名\n多个标签请用逗号隔开",
            "Work Title*": "作品标题: 必填",
            "Add co-creators?": "添加共同作者？\n添加后，共同创作者能够编辑章节",
            "Summary": "梗概: 作品简介",
            "Notes": "作者注明: 勾选此项以添加任何补充信息\n可以添加至作品开端以及/或者结尾",
            "at the beginning": "添加至作品开端",
            "at the end": "添加至作品结尾",
            "Post to Collections / Challenges": "发布至同人作品集/挑战赛",
            "Gift this work to": "将此同人作品赠给: 在此输入接收人的用户名",
            "This work is a remix, a translation, a podfic, or was inspired by another work": "该作品是改编作品、翻译、有声小说或其灵感来源于另一作品\n如果您的作品是根据其他作品创作的，请在勾选此项后填写相关信息。",
            "This work is part of a series": "该作品是某系列中的一部分",
            "This work has multiple chapters": "该作品包含多章节\n如果您的作品将包含数个章节，请勾选此项\n如果您已经知道该作品会包含多少章节，您可以将默认的问号替换为确切的章节总数",
            "Set a different publication date": "设置不同的发布日期: 倒填日期\n不能将发布日期设置于将来的某日",
            "Choose a language*": "选择语言",
            "Select Work Skin": "选择作品界面\n从菜单列表中选择您想使用的界面",
            "Only show your work to registered users": "只向注册用户显示您的作品: 只允许已登录的用户访问您的作品",
            "Enable comment moderation": "开启评论审核: 勾选此项以审核您作品上的评论\n评论必须通过您的批准才会发表",
            "Who can comment on this work ?": "谁可以发表评论？",
            "Registered users and guests can comment": "注册用户与游客均可留言",
            "Only registered users can comment": "只允许注册用户留言",
            "No one can comment": "禁止任何人留言",
            "Work Text*": "作品文本: 必填",
            "Plain text with limited HTML ?": "纯文本输入您的作品并添加部分可用的HTML代码",
            "Rich Text": "富文本编辑器：所见即所得模式",
            "Note: Text entered in the posting form is not automatically saved. Always keep a backup copy of your work.": "该页面并不具有自动保存功能，请将作品备份。"
        };

        // add translation pairs
        const _text = {
            "Post New Work": "发布新作品",
            "* Required information": "* 必填区域的标题为红色字体，并用星号标示",
            "Tags are comma separated, 100 characters per tag.": "标签由逗号隔开，单个标签上限100字",
            "Tags": "标签",
            "Rating*": "分级*",
            "Not Rated": "无分级",
            "General Audiences": "普遍级",
            "Teen And Up Audiences": "青少年以上",
            "Mature": "限制级",
            "Explicit": "成人级",
            "Archive Warnings*": "AO3警告*",
            "Choose Not To Use Archive Warnings": "作者选择不使用AO3警告",
            "Graphic Depictions Of Violence": "激烈暴力描写",
            "Major Character Death": "主要角色死亡",
            "No Archive Warnings Apply": "无适用的AO3警告",
            "Rape/Non-Con": "强暴/非自愿",
            "Underage": "未成年人性描写",
            "Fandoms*": "同人圈*",
            "Categories": "分类",
            "F/F": "女/女",
            "F/M": "男/女",
            "Gen": "通常向",
            "M/M": "男/男",
            "Multi": "多配对",
            "Other": "其他",
            "Relationships": "配对",
            "Characters": "角色",
            "Additional Tags": "其他标签",
            "Work Title*": "作品标题*",
            "Add co-creators?": "添加共同作者?",
            "Summary": "梗概",
            "Notes": "作者注明",
            "at the beginning": "添加至作品开端",
            "at the end": "添加至作品结尾",
            "Post to Collections / Challenges": "发布至同人作品集/挑战赛",
            "Gift this work to": "将此同人作品赠给",
            "This work is a remix, a translation, a podfic, or was inspired by another work": "该作品是改编作品、翻译、有声小说或其灵感来源于另一作品",
            "This work is part of a series": "该作品是某系列中的一部分",
            "This work has multiple chapters": "该作品包含多章节",
            "Set a different publication date": "设置不同的发布日期",
            "Choose a language*": "选择语言*",
            "Select Work Skin": "选择作品界面",
            "Only show your work to registered users": "只向注册用户显示您的作品",
            "Enable comment moderation": "开启评论审核",
//            "Who can comment on this work ?": "谁可以发表评论",
//             "Registered users and guests can comment": "注册用户与游客均可留言",
//            "Only registered users can comment": "只允许注册用户留言",
//            "No one can comment": "禁止任何人留言",
            "Work Text*": "作品文本*",
//            "Plain text with limited HTML ?": "纯文本输入您的作品并添加部分可用的HTML代码",
            "Rich Text": "所见即所得模式",
            "Note: Text entered in the posting form is not automatically saved. Always keep a backup copy of your work.": "注意：该页面并不具有自动保存功能，请将作品备份。"
        };

        // iterate each selector to add translation and explanation
        selector.forEach(item => {
            try {
                document.querySelector(item).setAttribute("title", _title[document.querySelector(item).innerText])
                if (_text[document.querySelector(item).innerText] != undefined) {
                    document.querySelector(item).innerText = _text[document.querySelector(item).innerText]};
            } catch (e) {
                console.log(e);
            };
        });

        // Post buttons
        function checkAndReplace(path, original, title) {
            if (path.value == original) {
                path.value = title;
                return path.setAttribute("title",title)
            };
        };

        checkAndReplace(document.querySelector("#work-form > fieldset.create > ul > li:nth-child(1) > input[type=submit]"), "Preview", "预览作品");
        checkAndReplace(document.querySelector("#work-form > fieldset.create > ul > li:nth-child(2) > input[type=submit]"), "Post", "发布作品");
        checkAndReplace(document.querySelector("#work-form > fieldset.create > ul > li:nth-child(3) > input[type=submit]"), "Cancel", "取消");


},1000);
})();