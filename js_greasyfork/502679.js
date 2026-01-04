// ==UserScript==
// @name         内蒙古人才信息库
// @namespace    http://tampermonkey.net/
// @version      2025.6.10
// @description  调整页面大小
// @author       AN drew
// @match        https://www.nmgrck.cn/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502679/%E5%86%85%E8%92%99%E5%8F%A4%E4%BA%BA%E6%89%8D%E4%BF%A1%E6%81%AF%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/502679/%E5%86%85%E8%92%99%E5%8F%A4%E4%BA%BA%E6%89%8D%E4%BF%A1%E6%81%AF%E5%BA%93.meta.js
// ==/UserScript==

/*
function highlightKeywords(text) {
    // 处理规则1：XX教师（红色），排除“内蒙古自治区”前缀
    text = text.replace(/《.*?》/g, (match) => {
        return match.replace(/(内蒙古自治区|关于[^《》]{0,10}?)?([\u4e00-\u9fa5（）]+教师)/g, (m, prefix, teacher) => {
            return (prefix || '') + `<span class="teacher">${teacher}</span>`;
        });
    });

    // 处理规则2：XX系列（黄色），排除“内蒙古自治区”前缀
    text = text.replace(/《.*?》/g, (match) => {
        // 在书名号内部处理系列高亮
        return match.replace(/(内蒙古自治区)?([^《》]*?)([\u4e00-\u9fa5]+系列)/g, (m, prefix, before, series) => {
            // 跳过包含“内蒙古自治区”前缀的情况，仅高亮其后的系列部分
            return (prefix ? prefix : before) + `<span class="series">${series}</span>`;
        });
    });

    // 处理规则3：XX专业（黄色），排除“内蒙古自治区”前缀
    text = text.replace(/《.*?》/g, (match) => {
        // 在书名号内部处理专业高亮
        return match.replace(/(内蒙古自治区)?([^《》]*?)([\u4e00-\u9fa5、（）]+专业)/g, (m, prefix, before, major) => {
            // 跳过包含“内蒙古自治区”前缀的情况，仅高亮其后的专业部分
            return (prefix ? prefix : before) + `<span class="major">${major}</span>`;
        });
    });

    return text;
}

function highlightKeywords2(text) {
    // 处理规则1：XX教师（红色），排除“内蒙古自治区”和“关于...”前缀
    text = text.replace(/《.*?》/g, (match) => {
        return match.replace(/(内蒙古自治区|关于(?:[^《》教师]{0,10}?))?([\u4e00-\u9fa5（）]*教师)/g, (m, prefix, teacher) => {
            return (prefix || '') + (teacher ? `<span class="teacher">${teacher}</span>` : '');
        });
    });

    // 处理规则2：XX系列（黄色），排除“内蒙古自治区”前缀
    text = text.replace(/《.*?》/g, (match) => {
        return match.replace(/(内蒙古自治区)?([^《》]*?)([\u4e00-\u9fa5]+系列)/g, (m, prefix, before, series) => {
            return (prefix ? prefix : before) + `<span class="series">${series}</span>`;
        });
    });

    // 处理规则3：XX专业（黄色），排除“内蒙古自治区”前缀
    text = text.replace(/《.*?》/g, (match) => {
        return match.replace(/(内蒙古自治区)?([^《》]*?)([\u4e00-\u9fa5、（）]+专业)/g, (m, prefix, before, major) => {
            return (prefix ? prefix : before) + `<span class="major">${major}</span>`;
        });
    });

    return text;
}
*/

/*
function convert(title) {
    const replacements = [
        ['工程系列', '<span class="series">工程系列</span>'],
        ['会计系列', '<span class="series">会计系列</span>'],
        ['经济系列', '<span class="series">经济系列</span>'],
        ['档案系列', '<span class="series">档案系列</span>'],
        ['中小学教师系列', '<span class="series"><span class="teacher">中小学教师</span>系列</span>'],
        ['出版系列', '<span class="series">出版系列</span>'],
        ['统计系列', '<span class="series">统计系列</span>'],
        ['审计系列', '<span class="series">审计系列</span>'],
        ['播音主持系列', '<span class="series">播音主持系列</span>'],
        ['新闻系列', '<span class="series">新闻系列</span>'],
        ['自然科学研究系列', '<span class="series">自然科学研究系列</span>'],
        ['翻译系列', '<span class="series">翻译系列</span>'],
        ['公共法律服务系列', '<span class="series">公共法律服务系列</span>'],
        ['哲学社会科学研究系列', '<span class="series">哲学社会科学研究系列</span>'],
        ['文物博物系列', '<span class="series">文物博物系列</span>'],
        ['艺术系列', '<span class="series">艺术系列</span>'],
        ['图书资料系列', '<span class="series">图书资料系列</span>'],
        ['卫生系列', '<span class="series">卫生系列</span>'],
        ['体育系列', '<span class="series">体育系列</span>'],

        ['技工院校教师', '<span class="teacher">技工院校教师</span>'],
        ['中等职业学校教师', '<span class="teacher">中等职业学校教师</span>'],
        ['高等学校教师', '<span class="teacher">高等学校教师</span>'],
        ['党校（行政学院）教师', '<span class="teacher">党校（行政学院）教师</span>'],

        ['电子专业', '<span class="major">电子专业</span>'],
        ['纺织专业', '<span class="major">纺织专业</span>'],
        ['轻工专业', '<span class="major">轻工专业</span>'],
        ['快递专业', '<span class="major">快递专业</span>'],
        ['基层卫生专业', '<span class="major">基层卫生专业</span>'],
        ['农牧业专业', '<span class="major">农牧业专业</span>'],
        ['生态环境专业', '<span class="major">生态环境专业</span>'],
        ['公路汽运轨道交通专业', '<span class="major">公路汽运轨道交通专业</span>'],
        ['化工专业', '<span class="major">化工专业</span>'],
        ['机械专业', '<span class="major">机械专业</span>'],
        ['建筑材料专业', '<span class="major">建筑材料专业</span>'],
        ['劳动安全专业', '<span class="major">劳动安全专业</span>'],
        ['冶金专业', '<span class="major">冶金专业</span>'],
        ['网信专业', '<span class="major">网信专业</span>'],
        ['国土空间规划专业', '<span class="major">国土空间规划专业</span>'],
        ['测绘专业', '<span class="major">测绘专业</span>'],
        ['地质专业', '<span class="major">地质专业</span>'],
        ['水利专业', '<span class="major">水利专业</span>'],
        ['林草专业', '<span class="major">林草专业</span>'],
        ['建设工程专业', '<span class="major">建设工程专业</span>'],
        ['电力专业', '<span class="major">电力专业</span>'],
        ['计量、标准化、质量、特种设备专业', '<span class="major">计量、标准化、质量、特种设备专业</span>'],
        ['蒙古语文翻译专业', '<span class="major">蒙古语文翻译专业</span>'],
        ['药学专业', '<span class="major">药学专业</span>'],
        ['司法鉴定人', '<span class="major">司法鉴定人</span>'],
        ['公证专业', '<span class="major">公证专业</span>'],
        ['群众文化专业', '<span class="major">群众文化专业</span>'],
        ['中医（蒙医）专业', '<span class="major">中医（蒙医）专业</span>'],
        ['信息与通信专业', '<span class="major">信息与通信专业</span>'],
        ['光伏硅基专业', '<span class="major">光伏硅基专业</span>'],
        ['教练员', '<span class="major">教练员</span>'],
        ['工艺美术专业', '<span class="major">工艺美术专业</span>'],
        ['广告创作专业', '<span class="major">广告创作专业</span>'],
        ['文艺评论专业', '<span class="major">文艺评论专业</span>'],
        ['美术、书法、摄影专业', '<span class="major">美术、书法、摄影专业</span>'],
        ['文学创作专业', '<span class="major">文学创作专业</span>'],
        ['大数据专业', '<span class="major">大数据专业</span>']
    ]

    replacements.forEach(([search, repl]) => {
        title = title.replace(search, repl);
    });

    return title;
}

*/

function convert(title) {
    // 特殊处理：优先替换"中小学教师系列"（避免被后续规则拆分）
    title = title.replace(/中小学教师系列/g,
                          '<span class="series"><span class="teacher">中小学教师</span>系列</span>'
                         );

    // 统一替换所有"系列"关键词
    title = title.replace(/(工程|会计|经济|档案|出版|统计|审计|播音主持|新闻|自然科学研究|翻译|公共法律服务|哲学社会科学研究|文物博物|艺术|图书资料|卫生|体育)系列/g,
                          '<span class="series">$1系列</span>'
                         );

    // 统一替换所有"教师"关键词
    title = title.replace(/(技工院校|中等职业学校|高等学校|党校（行政学院）)教师/g,
                          '<span class="teacher">$1教师</span>'
                         );

    // 统一替换所有"专业"关键词（注意长专业名在前）
    title = title.replace(/(计量、标准化、质量、特种设备|公路汽运轨道交通|美术、书法、摄影|中医（蒙医）|蒙古语文翻译|国土空间规划|群众文化|信息与通信|文学创作|广告创作|文艺评论|光伏硅基|建筑材料|建设工程|生态环境|司法鉴定人|劳动安全|大数据|网信|林草|轻工|纺织|电子|快递|化工|机械|冶金|电力|水利|地质|测绘|公证|药学|工艺美术|农牧业|基层卫生|教练员)专业(?:技术人才|人员)?/g,
                          '<span class="major">$1专业</span>'
                         );

    return title;
}

(function() {
    'use strict';

    GM_addStyle(`
.wrap{
    width:1800px;
    left:30%;
}
.header{
    width:1800px;
}
.footer{
    width:1800px;
}
.breadcrumb{
    width:1620px;
}
.breadcrumb + .content{
    width:1600px;
}
.sui-table.table-vzebra tr{
    cursor:pointer;
}
.ui-jqgrid .ui-jqgrid-btable tr{
    cursor:pointer;
}
    `);

    $('.sui-table.table-vzebra tr').click(function(){
        let a=$(this).find('td:nth-of-type(2) a')
        if(a.length>0)
        {
            a.get(0).click();
        }
        else if($(this).find('td:nth-of-type(2) span').text().indexOf('未开始')>-1)
        {
            alert('尚未开始，请耐心等待')
        }
    })



    setTimeout(function(){
        $('.ui-jqgrid .ui-jqgrid-btable tr').click(function(){
            let a=$(this).find('td:nth-of-type(3) a')
            console.log(a)
            if(a.length>0)
            {
                a.get(0).click();
            }
        })
    },1000)

    setTimeout(function(){
        if($('.box-title').text().indexOf('申请邮寄')>-1)
        {
            $('.ui-jqgrid-labels th:nth-of-type(2)').attr('style', 'width: 68px;'); //年度
            $('.ui-jqgrid-labels th:nth-of-type(5)').attr('style', 'width: 266px;');//身份证
            $('.ui-jqgrid-labels th:nth-of-type(6)').attr('style', 'width: 75px;'); //性别

            $('.ui-jqgrid-bdiv tr td:nth-of-type(2)').attr('style', 'width: 68px;'); //年度
            $('.ui-jqgrid-bdiv tr td:nth-of-type(5)').attr('style', 'width: 266px;');//身份证
            $('.ui-jqgrid-bdiv tr td:nth-of-type(6)').attr('style', 'width: 75px;'); //性别
        }
        else if($('.box-title').text().indexOf('申请管理')>-1)
        {
            $('.ui-jqgrid-labels th:nth-of-type(1)').attr('style', 'width: 20px;'); //序号
            $('.ui-jqgrid-labels th:nth-of-type(2)').attr('style', 'width: 87px;'); //证书类型
            $('.ui-jqgrid-labels th:nth-of-type(3)').attr('style', 'width: 90px;'); //考区
            $('.ui-jqgrid-labels th:nth-of-type(4)').attr('style', 'width: 34px;');  //管理号
            $('.ui-jqgrid-labels th:nth-of-type(5)').attr('style', 'width: 55px;');  //年度
            $('.ui-jqgrid-labels th:nth-of-type(6)').attr('style', 'width: 47px;');  //姓名
            $('.ui-jqgrid-labels th:nth-of-type(7)').attr('style', 'width: 150px;');  //身份证号
            $('.ui-jqgrid-labels th:nth-of-type(8)').attr('style', 'width: 112px;');  //专业类别
            $('.ui-jqgrid-labels th:nth-of-type(9)').attr('style', 'width: 50px;');  //收件人
            $('.ui-jqgrid-labels th:nth-of-type(10)').attr('style', 'width: 200px;');  //收件人省市区
            $('.ui-jqgrid-labels th:nth-of-type(11)').attr('style', 'width: 130px;');  //详细地址
            $('.ui-jqgrid-labels th:nth-of-type(12)').attr('style', 'width: 100px;');  //收件人手机
            $('.ui-jqgrid-labels th:nth-of-type(13)').attr('style', 'width: 170px;');  //申请状态
            $('.ui-jqgrid-labels th:nth-of-type(14)').attr('style', 'width: 120px;');  //更新时间
            $('.ui-jqgrid-labels th:nth-of-type(15)').attr('style', 'width: 65px;');  //操作

            $('.ui-jqgrid-bdiv tr td:nth-of-type(1)').attr('style', 'width: 20px;'); //序号
            $('.ui-jqgrid-bdiv tr td:nth-of-type(2)').attr('style', 'width: 87px;'); //证书类型
            $('.ui-jqgrid-bdiv tr td:nth-of-type(3)').attr('style', 'width: 90px;'); //考区
            $('.ui-jqgrid-bdiv tr td:nth-of-type(4)').attr('style', 'width: 34px;');  //管理号
            $('.ui-jqgrid-bdiv tr td:nth-of-type(5)').attr('style', 'width: 55px;');  //年度
            $('.ui-jqgrid-bdiv tr td:nth-of-type(6)').attr('style', 'width: 47px;');  //姓名
            $('.ui-jqgrid-bdiv tr td:nth-of-type(7)').attr('style', 'width: 150px;');  //身份证号
            $('.ui-jqgrid-bdiv tr td:nth-of-type(8)').attr('style', 'width: 112px;');  //专业类别
            $('.ui-jqgrid-bdiv tr td:nth-of-type(9)').attr('style', 'width: 50px;');  //收件人
            $('.ui-jqgrid-bdiv tr td:nth-of-type(10)').attr('style', 'width: 200px;');  //收件人省市区
            $('.ui-jqgrid-bdiv tr td:nth-of-type(11)').attr('style', 'width: 130px;');  //详细地址
            $('.ui-jqgrid-bdiv tr td:nth-of-type(12)').attr('style', 'width: 100px;');  //收件人手机
            $('.ui-jqgrid-bdiv tr td:nth-of-type(13)').attr('style', 'width: 170px;');  //申请状态
            $('.ui-jqgrid-bdiv tr td:nth-of-type(14)').attr('style', 'width: 120px;');  //更新时间
            $('.ui-jqgrid-bdiv tr td:nth-of-type(15)').attr('style', 'width: 65px;');  //操作
        }
    },1000)


    if(window.location.href.indexOf('https://www.nmgrck.cn/front/readnews?id=86300365') > -1)
    {
        GM_addStyle(`
a.ke-insertfile{font-size:16px; color:#337FE5}
.series { background-color: yellow; }
.major { background-color: #97ff97; }
.teacher { background-color: #ffcaca; }
        `);


        /*
        $('a.ke-insertfile').each(function(){
            $(this).html(highlightKeywords2($(this).text()));
        })
        */


        $('a.ke-insertfile').each(function(){
            $(this).html(convert($(this).text()));
        })
    }

})();