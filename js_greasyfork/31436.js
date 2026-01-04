// ==UserScript==
// @name         屏蔽前程无忧、智联招聘的虚假招聘广告
// @version      1.2
// @namespace    top.wwjay.js
// @description  内置武汉地区的培训机构公司名称，可以根据需要点击X来屏蔽，
//               如需解除自定义屏蔽的公司请清除浏览器全部缓存,
//               页面改变了下一页的加载方式为滚动到底部，
//               默认屏蔽异地招聘的信息
// @author       wwjay
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @match        http://search.51job.com/*
// @match        http://sou.zhaopin.com/*
// @downloadURL https://update.greasyfork.org/scripts/31436/%E5%B1%8F%E8%94%BD%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E3%80%81%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98%E7%9A%84%E8%99%9A%E5%81%87%E6%8B%9B%E8%81%98%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/31436/%E5%B1%8F%E8%94%BD%E5%89%8D%E7%A8%8B%E6%97%A0%E5%BF%A7%E3%80%81%E6%99%BA%E8%81%94%E6%8B%9B%E8%81%98%E7%9A%84%E8%99%9A%E5%81%87%E6%8B%9B%E8%81%98%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

let blacklist = ['软清科技', '东软软件', '东软睿道', '智递科技', '瑞鑫宝典', '瑞鑫祥云', '科瑞亚', '华信智原',
    '新东网科技', '创优智才', '博创华宇', '夕夕之由', '优才创智', '冲锋互联网', '奋斗者', '伟创聚赢', '美软动力',
    '软帝信息', '新华电脑', '硕彦博创', '卓研云软件', '龙才企业', '千途创造', '杭州东渡', '杰讯智诚', '智动天下',
    '武汉拓福', '欣落雨网络科技', '育豪体育', '中软博创', '时空行者', '百科杰', '创薪梦想', '汇众益智', '极客营信息',
    '源码时代', '瀚途信息', '翰竺科技', '华雪锋软件', '巴迅科技', '知行汇聚', '创智聚合', '恒博软件', '瑞吉诺信息',
    '创搜信息', '万度空间', '海文赢通信', '创码之家', '德善通科技', '海棠仙子', '艺汇创意', '尚云客网络', '国鑫科技',
    '青岛福音网络', '晟乐云科技', '慧炎时代', '惟特信息', '驿动兄弟', '保尔子旭', '智一科技', '亿钜鑫网络', '一代人教育',
    '千硕教育', '软谋教育', '达内', '联合创想', '瑞才教育', '北大青鸟', '软帝联合', '极点创新软件', '上海七圣网络',
    '万维软盟', '华旺达信息', '高鸿兴科', '海度网络', '万维速科', '美约科技', '云客易在线', '品创众智',
    '知行国际经济', '学盟英才', '学思成', '华远时代', '广东会圆宝', '晋佑科技', '华夏天网', '晶美莱特', '麦菲尔膜',
    '海辰科技', '东渡科技', '华育嗨搜', '樱雪科技', '蓝色曙光', '北京邮电大学“互联网+”人才培养基地', '众智动力',
    '湖北省软帝职业', '溢达科技', '阿甲科技', '早稻田鹏翔', '云唯+', '旅烨网络', '软通动力信息技术', '升技使能教育',
    '美言信息', '沃云恒飞', '陕西航新电子', '易通信博信息', '文武远卓文化', '川友网络技术', '中青中关村软件园人才基地',
    '英特威尔', '荣新广育科技', '易思哲科技', '新时代网络', '大福融通', '平乐云网络', '宝赢网络', '素峰炉业', '颢天鸿泰',
    '华奥星空', '智游联动', '优伯立信', '零壹众创', '才信优达', '壹方凌网络', '楚佑科技', '中科腾辉', '羽皓信息', '斯密尔德',
    '羽皓信息', '广恒丰盈', '贝笃网络', '东仁汇义'];
blacklist = blacklist.concat(localStorage.localBl ? JSON.parse(localStorage.localBl) : []);

function rmBl($html) {
    let $list = $html.find('#resultList').find('.el').not('.title');

    let excludeRegion = $(':checkbox[name="exclude-region"]:checked').map(function () {
        return this.value;
    }).get();

    $list = $($.grep($list, function (e, i) {
        let $this = $(e);
        let coName = $this.find('.t2 a').attr('title');

        if (coName !== undefined) {
            for (let key of blacklist) {
                if (coName.indexOf(key) > -1) {
                    $this.remove();
                    return false;
                }
            }
        }

        let region = $this.find('.t3').text();

        if (region === '异地招聘' || excludeRegion.indexOf(region) !== -1) {
            $this.remove();
            return false;
        }

        let post = $this.find('.t1 a').text();
        if (post.indexOf('试用') !== -1 || post.indexOf('体验') !== -1 || post.indexOf('可做') !== -1) {
            $this.remove();
            return false;
        }

        return true;
    }));

    return $list;
}

function zlzpRmBl($html) {
    let $list = $html.find('#newlist_list_content_table').find('table').not(':first');

    let excludeRegion = $(':checkbox[name="exclude-region"]:checked').map(function () {
        return this.value;
    }).get();

    $list = $($.grep($list, function (e, i) {
        let $this = $(e);
        let coName = $this.find('.gsmc a:first').text();

        if (coName !== undefined) {
            for (let key of blacklist) {
                if (coName.indexOf(key) > -1) {
                    $this.remove();
                    return false;
                }
            }
        }

        let region = $this.find('.gzdd').text();

        if (region === '异地招聘' || excludeRegion.indexOf(region) !== -1) {
            $this.remove();
            return false;
        }

        let post = $this.find('.zwmc a').text();
        if (post.indexOf('试用') !== -1 || post.indexOf('体验') !== -1 || post.indexOf('可做') !== -1) {
            $this.remove();
            return false;
        }

        return true;
    }));

    return $list;
}

$(function () {

    let hostname = location.hostname;

    // 修改访问过的链接颜色
    $('head').append('<style>a:visited {color: blue !important;}</style>');

    let excludeCheckbox = '<div style="margin-bottom: 10px"> ' +
        '<span>&nbsp;&nbsp;排除地区：</span> ' +
        '<input type="checkbox" name="exclude-region" value="武汉-江岸区" checked>江岸&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-江汉区" checked>江汉&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-硚口区" checked>硚口&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-汉阳区" checked>汉阳&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-武昌区" checked>武昌&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-青山区" checked>青山&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-洪山区">洪山&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-东西湖区" checked>东西湖&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-汉南区" checked>汉南&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-蔡甸区">蔡甸&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-江夏区">江夏&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-黄陂区" checked>黄陂&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-新洲区" checked>新洲&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-东湖新技术开发区" checked>东湖新技术开发区&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-武汉经济技术开发区" >经济技术开发区&nbsp;&nbsp; ' +
        '<input type="checkbox" name="exclude-region" value="武汉-武汉吴家山经济技术开发区" checked>吴家山经济技术开发区&nbsp;&nbsp; ' +
        '<button type="button" id="deselect-all" style="display: inline;" >取消选中</button>&nbsp;&nbsp;' +
        '<button type="button" style="display: inline;" onclick=localStorage.removeItem("localBl") >清除自定义黑名单</button>' +
        '</div>';

    if (hostname === 'search.51job.com') {

        $('#dw_choice_mk').after(excludeCheckbox);

        rmBl($(document));

        $('#resultList').find('.el .t2 a').after('<a href="javascript:;" class="remove-co" style="color: #e23b1d;">&nbsp;&nbsp;X</a>');

        $('#resultList').on('click', '.remove-co', function () {
            let coName = $(this).siblings().attr('title');
            blacklist.push(coName);
            localStorage.localBl = JSON.stringify(blacklist);
            rmBl($(document));
        });

        let nextUrl = $('#rtNext').attr('href');

        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 700) {
                if (nextUrl !== undefined) {
                    $.ajax({
                        url: nextUrl,
                        async: false,
                        success: function (html) {
                            // ajax获取的页面
                            let $page = $(html);
                            // 更新下一页地址
                            nextUrl = $page.find('#rtNext').attr('href');
                            // 过滤页面
                            let $filterPage = rmBl($page);
                            // 添加页面分割标识
                            $('<div class="el pageNum" style="text-align: center;">第' + $page.find('#resultList').find('.dw_tlc div[class="rt"]:eq(1)').text() + '页</div>').insertAfter($('#resultList').find('.el:last'));
                            // 增加屏蔽按钮
                            $filterPage.find('.t2 a').after('<a href="javascript:;" class="remove-co" style="color: #e23b1d;">&nbsp;&nbsp;X</a>');
                            // 添加到原有列表结尾
                            $filterPage.insertAfter($('#resultList').find('.el:last'));
                            // 修改职位总计为当前页面实际数值
                            $('#resultList').find('div[class="rt"]').text('共' + $('#resultList').find('.el').not('.title,.pageNum').length + '条职位');
                        }
                    });
                }
            }
        });

        // 加载页面后隐藏下一页按钮
        $('#rtPrev').parent().hide();
        $('.dw_page').hide();
    } else if (hostname === 'sou.zhaopin.com') {
        $('.seach_yx').after(excludeCheckbox);

        zlzpRmBl($(document));

        $('#newlist_list_content_table').find('.gsmc').not(':first').append('<a href="javascript:;" class="remove-co" style="color: #e23b1d;">&nbsp;&nbsp;X</a>');

        $('#newlist_list_content_table').on('click', '.remove-co', function () {
            let coName = $(this).siblings().first().text();
            blacklist.push(coName);
            localStorage.localBl = JSON.stringify(blacklist);
            zlzpRmBl($(document));
        });

        let nextUrl = $('.pagesDown-pos a').attr('href');

        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
                if (nextUrl !== undefined) {
                    $.ajax({
                        url: nextUrl,
                        async: false,
                        success: function (html) {
                            // ajax获取的页面
                            let $page = $(html);
                            // 更新下一页地址
                            nextUrl = $page.find('.pagesDown-pos a').attr('href');
                            let $pageNum = $page.find('#goto');
                            let sumPageNum = $pageNum.attr('onkeypress').split(',').pop().slice(0, -1);
                            // 过滤页面
                            let $filterPage = $('<h1 style="text-align: center; font-size: 2em !important;">' + '第' + $page.find('#goto').val() + ' / ' + sumPageNum + '页' + '</h1>').add(zlzpRmBl($page));
                            // 增加屏蔽按钮
                            $filterPage.find('.gsmc').append('<a href="javascript:;" class="remove-co" style="color: #e23b1d;">&nbsp;&nbsp;X</a>');
                            // 添加到原有列表结尾
                            $('#newlist_list_content_table').append($filterPage);
                            // 修改职位总计为当前页面实际数值
                            $('.search_yx_tj').find('em').text($('#newlist_list_content_table').find('.gsmc').not(':first').length);
                        }
                    });
                }
            }
        });

        $('.pagesDown').hide();
    }

    $('#deselect-all').on('click', function () {
        $('[name="exclude-region"]').attr('checked', false);
    });
});
