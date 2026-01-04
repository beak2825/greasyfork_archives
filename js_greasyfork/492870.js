// ==UserScript==
// @name         人教电子教材显示书名
// @namespace    http://tampermonkey.net/
// @version      2025.4.17
// @description  显示书名
// @author       AN drew
// @match        https://jc.pep.com.cn/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492870/%E4%BA%BA%E6%95%99%E7%94%B5%E5%AD%90%E6%95%99%E6%9D%90%E6%98%BE%E7%A4%BA%E4%B9%A6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/492870/%E4%BA%BA%E6%95%99%E7%94%B5%E5%AD%90%E6%95%99%E6%9D%90%E6%98%BE%E7%A4%BA%E4%B9%A6%E5%90%8D.meta.js
// ==/UserScript==

//从后往前查找并替换第一个匹配的子串
function replaceLast1(str, search, replacement) {
    const regex = new RegExp(search, 'g');
    let match;
    let lastMatchIndex = -1;

    // 遍历所有匹配项，记录最后一个匹配的位置
    while ((match = regex.exec(str))  !== null) {
        lastMatchIndex = match.index;
    }

    // 未找到匹配项
    if (lastMatchIndex === -1) return str;

    // 替换最后一个匹配项
    return (
        str.slice(0,  lastMatchIndex) +
        replacement +
        str.slice(lastMatchIndex  + search.length)
    );
}

//从后往前查找并替换第一个匹配的子串
function replaceLast2(str, search, replacement) {

    // 转义搜索字符串中的特殊正则字符
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 构造匹配最后一个子串的正则
    const regex = new RegExp(`(.*)${escapedSearch}`);

    // 替换匹配到的最后一个子串
    return str.replace(regex, (_, p1) => p1 + replacement);
}

//从后往前查找并替换第一个匹配的子串
function replaceLast3(str, search, replacement) {

    // 查找目标子串在原始字符串中的最后一个出现位置
    const index = str.lastIndexOf(search);

    // 如果存在匹配项（index !== -1）
    if (index !== -1) {

        // 拼接三部分：原始字符串前半段 + 替换内容 + 原始字符串后半段
        return (
            str.substring(0, index) +
            replacement +
            str.substring(index + search.length)
        );
    }
    return str;
}


function convert(title) {

    //将(A版)从末尾移动到'数学'之后
    if(title.indexOf('普通高中教科书数学')>-1)
    {
        title = title.replace(/^(普通高中教科书数学)(.*?册)(（.*版）)$/, "$1$3$2");
    }

    //选择性必修[0-9]换行
    if(title.indexOf('选择性必修')>-1)
    {
        title = title.replace(/选择性必修\d?/g, '$&<br>');
    }
    //必修[0-9]换行
    else if(title.indexOf('必修')>-1 && title.indexOf('必修<br>')==-1)
    {
        title = title.replace(/必修\d?/g, '$&<br>');
    }

    //低视力版 信息技术 部分标题缺少'（供低视力学生使用）'
    if(title.indexOf('盲校义务教育实验教科书 信息技术')>-1 && title.indexOf('（盲文版）')==-1&& title.indexOf('（供低视力学生使用）')==-1)
    {
        title += '（供低视力学生使用）';
    }

    //只在'X年级 (上/下)册'加空格，'(X年级起点)'不加
    if(title.indexOf('年级')>-1)
    {
        title = replaceLast3(title, '年级', '年级 ');
    }

    const replacements = [
        ['语文', '语文<br>'],
        ['数学', '数学<br>'],
        ['英语', '英语<br>'],
        ['日语', '日语<br>'],
        ['俄语', '俄语<br>'],
        ['道德与法治', '道德与法治<br>'],
        ['思想政治', '思想政治<br>'],
        ['历史', '历史<br>'],
        ['地理', '地理<br>'],
        ['物理', '物理<br>'],
        ['化学', '化学<br>'],
        ['生物学', '生物学<br>'],
        ['音乐', '音乐<br>'],
        ['美术', '美术<br>'],
        ['艺术', '艺术<br>'],
        ['美工', '美工<br>'],
        ['体育与健康', '体育与健康<br>'],
        ['信息技术', '信息技术<br>'],
        ['通用技术', '通用技术<br>'],
        ['科学', '科学<br>'],
        ['影视', '影视<br>'],
        ['戏剧', '戏剧<br>'],
        ['舞蹈', '舞蹈<br>'],
        ['沟通与交往', '沟通与交往<br>'],
        ['生活适应', '生活适应<br>'],
        ['必修<br>上册', '必修 上册'],
        ['必修<br>中册', '必修 中册'],
        ['必修<br>下册', '必修 下册'],
        ['必修<br>第一册', '必修 第一册'],
        ['必修<br>第二册', '必修 第二册'],
        ['必修<br>第三册', '必修 第三册'],
        ['必修<br>第四册', '必修 第四册'],
        ['中外历史纲要上', '中外历史纲要 上'],
        ['中外历史纲要下', '中外历史纲要 下'],
        ['社会主义思想', '社会主义思想<br>'],
        ['小学低年级', '小学 低年级'],
        ['小学高年级', '小学 高年级'],
        ['影视<br>与数字媒体艺术实践', '影视与数字媒体艺术实践<br>'],
        ['戏剧<br>创编与表演', '戏剧创编与表演<br>'],
        ['舞蹈<br>创编与表演', '舞蹈创编与表演<br>'],
        ['音乐<br>情境表演', '音乐情境表演<br>'],
        ['美术<br>创意实践', '美术创意实践<br>'],
        ['手册', '手册<br>'],
        ['读本', '读本<br>'],
        ['教科书', '教科书<br>'],
        ['教师用书', '教师用书<br>'],
        ['选修课程用书', '选修课程用书<br>'],
        ['低视力版', '低视力版<br>'],
        ['（五线谱）', '<br>（五线谱）'],
        ['（简谱）', '<br>（简谱）'],
        ['起点）', '起点）<br>'],
        ['（精通）', '（精通）<br>'],
        ['（PEP）', '（PEP）<br>'],
        ['（A版）', '（A版）<br>'],
        ['（B版）', '（B版）<br>'],
        ['（上册）', '<br>（上册）'],
        ['（下册）', '<br>（下册）'],
        ['（盲文版）', '<br>（盲文版）'],
        ['（五·四学制）', '（五·四学制）<br>'],
        ['（供低视力学生使用）', '<br>（供低视力学生使用）']
    ];

    replacements.forEach(([search, repl]) => {
        title = title.replace(search, repl);
    });

    return title;
}


(function() {
    'use strict';

    GM_addStyle(`
.page_pc .page_pc_btm .page_pc_btm_period .page_pc_btm_period_body .page_pc_btm_period_body_type:nth-of-type(1) .body_type {
     display: grid;
 }

 .page_pc .page_pc_btm .page_pc_btm_period .page_pc_btm_period_body .page_pc_btm_period_body_type .body_type .item {
     height: 30px;
     margin-bottom: 5px;
 }

 .page_pc_btm_book_body {
     height: auto !important
 }

 .page_pc_btm_book_body .name {
     margin: 0px 14px;
     padding: 8px;
     font-weight: bold;
     font-family: 楷体, 隶书, cursive;
     font-size: 22px;
     text-align: center;
     line-height: 1.5;
 }

 .page_pc_btm_book_body .read {
     margin: 5px 0px 20px 20px !important
 }

 .textbook .item {
     height: auto !important
 }

 .textbook .item .name {
     margin: 0px 14px;
     padding: 8px;
     font-weight: bold;
     font-family: 楷体, 隶书, cursive;
     font-size: 22px;
     text-align: center;
     line-height: 1.5;
 }

 .textbook .item .read {
     margin-top: 5px !important
 }
    `);

    let t=setInterval(function(){
        //PC端
        if($('.page_pc_btm_book_body').length>0)
        {
            $('.page_pc_btm_book_body').each(function(){
                //教材封面存在
                if($(this).find('.imga').length>0)
                {
                    //教材名称不存在，添加名称
                    if($(this).find('.name').length==0)
                    {
                        let title=$(this).find('.imga').attr('title');
                        title=convert(title);
                        $(this).find('.imga').after('<div class="name">'+title+'</div>');
                    }
                    //切换科目时，改变名称
                    else
                    {
                        let old_title=$(this).find('.name').html();
                        let new_title=$(this).find('.imga').attr('title');
                        new_title=convert(new_title);
                        if(old_title != new_title)
                        {
                            $(this).find('.name').html(new_title);
                        }
                    }
                }
            });
        }
        //手机端
        if($('.textbook .item').length>0)
        {
            $('.textbook .item').each(function(){
                //教材封面存在
                if($(this).find('.cover').length>0)
                {
                    //教材名称不存在，添加名称
                    if($(this).find('.name').length==0)
                    {
                        let title=$(this).find('.cover').attr('alt');
                        title=convert(title);
                        $(this).find('.cover').after('<div class="name">'+title+'</div>');
                    }
                    //切换科目时，改变名称
                    else
                    {
                        let old_title=$(this).find('.name').html();
                        let new_title=$(this).find('.cover').attr('alt');
                        new_title=convert(new_title);
                        if(old_title != new_title)
                        {
                            $(this).find('.name').html(new_title);
                        }
                    }
                }
            });
        }
    },1000);

})();