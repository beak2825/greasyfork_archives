// ==UserScript==
// @name         百度贴吧添加我的回复按钮
// @namespace    http://tampermonkey.net/
// @version      2025.10.16
// @description  消息按钮列表显示我的回复
// @author       AN drew
// @match        https://tieba.baidu.com/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446139/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%B7%BB%E5%8A%A0%E6%88%91%E7%9A%84%E5%9B%9E%E5%A4%8D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/446139/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%B7%BB%E5%8A%A0%E6%88%91%E7%9A%84%E5%9B%9E%E5%A4%8D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

//转换时间
function parseTimeText(timeText) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    // 处理当天时间格式 (如: 10:32)
    if (timeText.includes(':')) {
        const [hours, minutes] = timeText.split(':').map(Number);
        return new Date(currentYear, currentMonth - 1, currentDay, hours, minutes);
    }

    // 处理今年日期格式 (如: 7-12)
    if (timeText.includes('-') && timeText.length <= 5) {
        const [month, day] = timeText.split('-').map(Number);
        return new Date(currentYear, month - 1, day);
    }

    // 处理往年日期格式 (如: 2024-11)
    if (timeText.includes('-') && timeText.length > 5) {
        const [year, month] = timeText.split('-').map(Number);
        return new Date(year, month - 1, 1); // 使用1号作为默认日期
    }
}

//UTC标准时转UTC+8北京时间
function getUTC8(datetime) {
    let month = (datetime.getMonth() + 1) < 10 ? "0" + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
    let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    let hours = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    let minutes = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    let seconds = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return (datetime.getFullYear() + "-" + month + "-" + date + "\xa0\xa0" + hours + ":" + minutes + ":" + seconds);
}

(function() {
    'use strict';

    let blacklist = new Set(['tb.1.799c5565.B5RZU87zci5PWiKZuJbB9g',
                             'tb.1.719d1be6.PNFJXEpQCIwE5Y8sxkAh7Q',
                             'tb.1.36af074f.NRi5aqOvEhihsprdx6e1TQ',
                             'tb.1.7924280c.CKQHLFyXmmqrJdbFRluI0Q',
                             'tb.1.640e803c.lHh99VVfkdYCUebspPdYsA',
                             'tb.1.bb33716b.nyYacQlDrbz9u9924XODqQ',
                             'tb.1.4cf0093a.Sw1dSPeXG355_ZhcTg0a8w',
                             'tb.1.d0bd3398.gQv1O3wf86hCI0DmDvEEHA',
                             'tb.1.2ea66754.0t9tFTrX-DRGl0vnuHKLxA',
                             'tb.1.de0c0ab1.LHqkc_B_TbeYBVY-3XBBzA',
                             'tb.1.6ab9c5ed.G2zF0ntB6rKMzCcp1YnzKw',
                             'tb.1.5bb60570.acMsxlOb9RxsW3iXVkCY0g',
                             'tb.1.6391954a.4mvjcTeGl5_ASU09EWQF9g',
                             'tb.1.a25f5416.TDWtwSEqTx4D-gA89h2SZQ',
                             'tb.1.482cf97e.DnVfPNuJv34bzbC9mara2A',
                             'tb.1.b9f5a1f2.oHZgPuOfu-1y7vSltmGv5w',
                             'tb.1.5fe9b34.zOAv2W0h4zw1xyMxK1BA7g',
                             'tb.1.92dda389.XQg2p6DjkC02whcwyaUmEw',
                             'tb.1.6fe622ff.0Y1MOLjrynmQPyi363YYTQ',
                             'tb.1.468e9c56.JXinix0ZssrRF0Ye7q9Ouw',
                             'tb.1.9ccc38e7.CKI3IdyKy-9tLEXo5Z16Ew',
                             'tb.1.8edcafc8.eyJzt5AMwe7uAyCnLJs3OQ',
                             'tb.1.3ca3385e.JZrrzfQy8WRVdCm6GFjQIQ',
                             'tb.1.4be3e18a.SyW8ufq0b_PJjBnODhVj7w',
                             'tb.1.f5662821.B2O_RQbszT2GVhLhnRk5Eg',
                             'tb.1.fe21a830.3wHnvVCbwQ1QJ0zqiMIM_w',
                             'tb.1.c0d521d0.EEB8tYqmj3NV5-_fGkRf6A',
                             'tb.1.cfe88813.OwTUB61qg8JaftKhFwZsjA',
                             'tb.1.87939b92.Wg5zYNHwSexX8ljeCNlIyw',
                             'tb.1.e011a1ec.GWI1LY3_3VILwiInO9429A',
                             'tb.1.9d72ae89.8t_hkvcVcdPWf1jpDO2Ogw',
                             'tb.1.34c54570.lkIEkK1QjsBdZrWhk4f0-Q',
                             'tb.1.13edefc5.BNfBlEgM-de3G4qgNbZi_A',
                             'tb.1.4305f1f4.eKyyq3or9inGCrnTO-Hy4A',
                             'tb.1.5651130d.kupHp9IUw55nNc16h-Gqrw',
                             'tb.1.a411ffb4.JD_TSgpa0aDpWppmiXquGg',
                             'tb.1.e7af89f5.Qrw5I6dN5kNhEaymNdrH8w',
                             'tb.1.5f444a46.RB1UT0UeKiRjNnDr7G3t9A',
                             'tb.1.bb0da7da.vf1-gs2eU8yHVRM7puI-XQ',
                             'tb.1.8791a12f.p7rZG9CC0ljKoXkuLzYpgg',
                             'tb.1.4304c335.QCaDC46Wo8pceKjiyf2Ekw',
                             'tb.1.b1a6ff8e.TYmggHT4CJMFRBEveYzDkA',
                             'tb.1.93f727ac.t5-hPZ-cqBinG988s6p-RQ',
                             'tb.1.e2f03429.Tc8_HuRuIUzAiteggVkPuw',
                             'tb.1.37e5c7f5.WxJJnLTdnbEKdzkaR6ypfQ',
                             'tb.1.7ece3b7.z1VvGrbVKHlNvCpdDrkSKA',
                             'tb.1.1c890d54.okJcEerCwxJ-HOs3e_8VLQ',
                             'tb.1.d45bcf8b.07YGeypkUjkojQ76qxkQ9Q',
                             'tb.1.b06f42db.HGMTYeMotEU3u-mHT2oCmA',
                             'tb.1.665cb449.HRhZvOHE608CVgio1f-KBQ',
                             'tb.1.a02b0853.fjK2Yy2QNylNP1HDsM2Beg',
                             'tb.1.87acc1b7.ARPLfOaXgSekvaghrSG0xQ',
                             'tb.1.3d58c673.iLye1zemT9G_0qrVRppshA',
                             'tb.1.6767f067.TPRTi1Cguzt5ZWvz3vaAlA',
                             'tb.1.fc75c478.1tw9U1jq8G7K75i4yIJ1wQ',
                             'tb.1.7244f745.7m-ZKfCtlFULmEfS5vo-8w',
                             'tb.1.6584136b.kuAwZStxxPdufTbAgsyrYA',
                             'tb.1.863e4793.o1UzECz2R0ImG80TANE3qA',
                             'tb.1.9968eeaa.es-Lk7ffJlT9N8aXQbGBRg',
                             'tb.1.aef2ab74.EI2sEpzEu3rvfkAff-B2zA',
                             'tb.1.205f6f67.0rn-NJW4_UQF4fplLKsp3w',
                             'tb.1.afc52e8e.CjLUdJGrB3NnJd33rewQmg',
                             'tb.1.8a208cae.PJOghaSNOTKY0zYhhgeJTg',
                             'tb.1.54e569bd.0bVbGDm345Zp9x27DyQSGA',
                             'tb.1.c811d402.lQ0cgAVaGRMAmHJQSDsz2A',
                             'tb.1.95764a0d.aYki_aLaw7LKZt41XpHyZw',
                             'tb.1.3d58c673.iLye1zemT9G_0qrVRppshA'
                            ]);

    if (typeof jQuery !== 'undefined')
    {
        //黑名单屏蔽
        if(window.location.href.indexOf('tieba.baidu.com/f') > -1)
        {
            setInterval(function(){
                $('.j_thread_list').each(function(){
                    let author=$.parseJSON($(this).attr('data-field')).author_portrait;
                    if(blacklist.has(author))
                    {
                        $(this).attr('style','background:##ff584d');
                        $(this).addClass('hide');
                    }
                })
            },1000);
        }

        //添加我的回复按钮
        let reply = setInterval(function(){
            if($('#com_userbar ul.sys_notify.j_sys_notify.j_category_list > li:nth-child(2)').length>0)
            {
                $('#com_userbar ul.sys_notify.j_sys_notify.j_category_list > li:nth-child(2)').after('<li class="category_item category_item_empty"><a class="j_cleardata" href="http://tieba.baidu.com/i/i/my_reply" target="_blank" data-type="reply" se_prerender_url="complete">我的回复</a></li>');
            }
            if($('div#u_notify_item > li:nth-child(2)'))
            {
                $('div#u_notify_item > li:nth-child(2)').after('<li class="category_item category_item_empty"><a class="j_cleardata" href="http://tieba.baidu.com/i/i/my_reply" target="_blank" data-type="reply" se_prerender_url="complete">我的回复</a></li>');
            }
            clearInterval(reply);
        },2000);

        //帖子内发帖时间超过七天显示为红色
        if(window.location.href.indexOf('tieba.baidu.com/p/') > -1)
        {
            let timer = setInterval(function(){
                let fa_date;
                $('.p_postlist .l_post:first-child .tail-info, #j_p_postlist > div.l_post.j_l_post.l_post_bright.noborder.wide > div.d_post_content_main.d_post_content_firstfloor > div.core_reply.j_lzl_wrapper > div.core_reply_tail > ul.p_tail > li:nth-child(2) > span').each(function(){
                    if($(this).text().indexOf('-')>-1 && $(this).text().indexOf(':')>-1)
                    {
                        fa_date=new Date($(this).text());
                    }
                })

                let now_date=new Date();
                if(now_date-fa_date>7*24*60*60*1000)
                {
                    GM_addStyle(`#j_core_title_wrap, .core_title_theme_bright,.l_post_bright, .l_post_bright .d_post_content_main, .l_post_bright .d_post_content_main .p_content{background:#ff4639!important}
                    ul.p_tail>li:nth-of-type(2)>span{background:white}
                    `);
                    clearInterval(timer);
                }
            },1000);
        }


        GM_addStyle(`.j_thread_list.red{background:#ff463975!important}
        .j_thread_list.red .pull_right{color:white!important}

        .threadlist_bright .j_thread_list.red .threadlist_author a,
        .threadlist_bright .j_thread_list.red .threadlist_author a:hover,
        .threadlist_bright .j_thread_list.red .threadlist_author a:focus,
        .threadlist_bright .j_thread_list.red .threadlist_author a:Visited
        {color:#f7f9fc!important}

        .j_thread_list.red.top{background:#f7f9fc!important}
        .is_show_create_time{display:block!important}
        `);
        //吧内列表发帖时间超过七天显示为红色
        if(window.location.href.indexOf('tieba.baidu.com/f?') > -1)
        {
            let timer2 = setInterval(function(){
                let fa_date;
                $('.j_thread_list').each(function(){
                    //置顶贴不变
                    if($(this).find('icon-top').length>0)
                    {
                        $(this).addClass('top');
                    }

                    //旧贴变红
                    if($(this).text().indexOf('-')>-1 || $(this).text().indexOf(':')>-1)
                    {
                        fa_date=parseTimeText($(this).find('.is_show_create_time').text());
                        //$(this).find('.is_show_create_time').text(getUTC8(fa_date));
                        let now_date=new Date();
                        if(now_date-fa_date>7*24*60*60*1000)
                        {
                            $(this).addClass('red');
                            clearInterval(timer2);
                        }
                    }
                })


            },1000);
        }

        $('.b_right_up nobr:nth-child(2) .b_reply').each(function(){
            if(!$(this).hasClass('pic') && $(this).text()=='回复')
            {
                $(this).text('【图片回复】');
                $(this).addClass('pic');
            }
        })
    }

    GM_addStyle(`body {overflow-x: auto;}
    .af_container{overflow: auto;}
    .tbui_aside_float_bar{display:none!important}
    .j_thread_list.hide{display:none!important}`);

})();