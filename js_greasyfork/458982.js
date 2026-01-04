// ==UserScript==
// @name         Azure Speech 翻译语音风格列表为中文
// @namespace    https://penicillin.github.io/
// @version      0.1
// @description  翻译语音风格列表
// @author       Penicillinm
// @match        https://azure.microsoft.com/zh-cn/products/cognitive-services/text-to-speech/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458982/Azure%20Speech%20%E7%BF%BB%E8%AF%91%E8%AF%AD%E9%9F%B3%E9%A3%8E%E6%A0%BC%E5%88%97%E8%A1%A8%E4%B8%BA%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/458982/Azure%20Speech%20%E7%BF%BB%E8%AF%91%E8%AF%AD%E9%9F%B3%E9%A3%8E%E6%A0%BC%E5%88%97%E8%A1%A8%E4%B8%BA%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

function TranslationSelect(){
    document.getElementById('voicestyleselect').innerHTML=document.getElementById('voicestyleselect').innerHTML
        .replace('Documentary-narration','纪录片旁白')
        .replace('Narration-relaxed','轻松叙事')
        .replace('Poetry-reading','诗歌朗诵')
        .replace('Customer Service','客户服务部')
        .replace('Sports-commentary-excited','激动的体育评论')
        .replace('Sports-commentary','体育评论')
        .replace('Narration-professional','专业叙事')
        .replace('Newscast-casual','新闻广播休闲')
        .replace('Advertisement-upbeat','广告乐观')

        .replace('General','通用')
        .replace('Assistant','助理')
        .replace('Chat','闲聊')
        .replace('Newscast','新闻广播')
        .replace('Affectionate','充满深情的')
        .replace('Angry','发怒的')
        .replace('Embarrassed','尴尬的')
        .replace('Calm','平静的')
        .replace('Cheerful','令人愉快的')
        .replace('Disgruntled','不满的')
        .replace('Fearful','可怕的')
        .replace('Gentle','温和的')
        .replace('Lyrical','抒情的')
        .replace('Sad','悲哀的')
        .replace('Serious','严肃的')
        .replace('Depressed','沮丧的')
        .replace('Envious','嫉妒的');
}

document.getElementById('voicestyleselect').addEventListener('focus',TranslationSelect);