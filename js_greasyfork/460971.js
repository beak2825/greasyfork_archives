// ==UserScript==
// @name         抓取微信网页版群信息
// @namespace    http://tampermonkey.net/
// @version      0.2
// @include           *wx2.qq.com*
// @connect           *
// @supportURL        http://www.burningall.com
// @compatible        chrome  完美运行
// @compatible        firefox  完美运行
// @description  抓取微信网页版群员信息
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/460971/%E6%8A%93%E5%8F%96%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%E7%BE%A4%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/460971/%E6%8A%93%E5%8F%96%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%E7%BE%A4%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    function GetQueryString(name, urlParamsStr) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = urlParamsStr.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = decodeURIComponent(r[2]);
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }
    var intId = setInterval(function() {
        var members = $('.scrollbar-dynamic.members_inner.ng-scope.scroll-content')
        var titleWrap = $('.title_wrap')
        var hiddenBtn = $('#hiddenBtn')
        var userData = {}
        if(members[0] && titleWrap[0] && !hiddenBtn[0] && members.children('.member.ng-scope')[0]) {
            titleWrap.append('<button id="hiddenBtn">导出群成员信息</button>')
            $('#hiddenBtn').click(function(event) {
                event.stopPropagation();
                var groupTitleEl = $('.title_name.ng-binding')
                var filename = groupTitleEl.text()
                members.children('.member.ng-scope').each(function(idx, el) {
                    var imgEl = $(el).find('img'),
                        mmSrc = imgEl.attr('mm-src'),
                        imgUrl = imgEl.attr('src');
                    $(imgEl).click()
                    var urlParamsStr = '?' + mmSrc.split('?')[1],
                        userid = GetQueryString('username', urlParamsStr),
                        roomId = GetQueryString('chatroomid', urlParamsStr),
                        skey = GetQueryString('skey', urlParamsStr),
                        seq = GetQueryString('seq', urlParamsStr);
                    var groupName = $(el).find('.nickname.ng-binding').text();
                    userData[userid] = {
                        'roomId': roomId,
                        'skey': skey,
                        'seq': seq,
                        'groupName': groupName,
                        'name': groupName,
                        'area': ''
                    }
                })
                $('.profile_mini').each(function(idx, el) {
                    var hd = $($(el).find('.profile_mini_hd')),
                        bd = $($(el).find('.profile_mini_bd'));
                    var mmSrc = hd.find('img').attr('mm-src')
                    var urlParamsStr = '?' + mmSrc.split('?')[1]
                    var userid = GetQueryString('username', urlParamsStr)
                    if(userData[userid]) {
                        userData[userid]['name'] = $(bd.find('h4')).text()
                        if(bd.find('.value.ng-binding')[0]) {
                            var meta_area = $(bd.find('.meta_area'))
                            $(meta_area.find('.value.ng-binding').each(function(idx, areaEl) {
                                if($(areaEl).attr('class') === 'value ng-binding') {
                                    userData[userid]['area'] = $(areaEl).text()
                                }
                            }))
                        }
                    }

                })
                if(Object.keys(userData).length > 0) {
                    var excelContent = 'seq, 当前会话用户ID,微信昵称,群昵称/备注,地区,群唯一键,skey\n';
                    for (var groupUserId in userData) {
                        var data = userData[groupUserId]
                        excelContent += data.seq + ',' + groupUserId + ',' + data.name + ',' + data.groupName + ',' + data.area +
                        ',' + data.roomId + ',' + data.skey + ',' + '\n';
                    }
                    var file = new File([excelContent], filename + '.csv', {type: "text/plain;charset=utf-8"});
                    saveAs(file);
                }
                if(Object.keys(userData).length === 0) {
                    alert('无群员数据.')
                }
            })
        }
        if(hiddenBtn[0] && !members[0]) {
            $('#hiddenBtn').remove()
        }
        //clearInterval(intId)
    }, 1200)
})();


