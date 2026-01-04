// ==UserScript==
// @name         Bangumi Great Escape
// @description  注销你的bangumi账户！
// @version      1.1
// @author       1ra
// @include      /^https?://(bgm\.tv|bangumi\.tv|chii\.in)/.*$/
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/797249
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/446153/Bangumi%20Great%20Escape.user.js
// @updateURL https://update.greasyfork.org/scripts/446153/Bangumi%20Great%20Escape.meta.js
// ==/UserScript==
GM_addStyle(`
    .del:hover {
        background-image: linear-gradient(to bottom, #F00 0%, #FA0505 100%) !important;
    }
` );

var uname = $('.avatar').attr('href').split('/').pop();
var userHash = $('#badgeUserPanel li a').last().attr('href').split('/').pop();
var pathType = [
    [`/user/${uname}/mono/.+`, 'mono'],
    [`/anime/list/${uname}/.+`, 'list'],
    [`/user/${uname}/timeline$`, 'timeline'],
    [`/user/${uname}/friends$`, 'friends'],
    [`/user/${uname}/blog$`, 'reviews'],
    [`/user/${uname}/index$`, 'index'],
    [`/user/${uname}/index/collect$`, 'indexCollection'],
    [`/user/${uname}/groups$`, 'groups'],
];
var pageLoader = {
    'mono': () => $('ul.coversSmall').siblings('a'),
    'list': () => $('#browserItemList').siblings('a'),
    'timeline': () => $('#tmlContent #timeline').siblings('a'),
    'friends': () => '',
    'reviews': () => $('#entry_list').siblings('a'),
    'index': () => '',
    'indexCollection': () => $('#timeline ul').siblings('a'),
    'groups': () => '',
};
var content = {
    'mono': () => $('ul.coversSmall').children(),
    'list': () => $('#browserItemList').children(),
    'timeline': () => $('#tmlContent #timeline li'),
    'friends': () => $('#memberUserList li'),
    'reviews': () => $('#entry_list .item'),
    'index': () => $('.line_list').children(),
    'indexCollection': () => $('#timeline li'),
    'groups': () => $('#memberGroupList').children(),
};
var delAPI = {
    'mono': dl => dl.find('a.l').attr('href') + '/erase_collect?gh=' + userHash,
    'list': dl => '/subject/' + dl.attr('id').split('_')[1] + '/remove?gh=' + userHash,
    'timeline': dl => dl.children('.tml_del').attr('href'),
    'friends': dl => '/disconnect/' + dl.find('a.l').first().attr('href').match(/compose\/(.+).chii/)[1] + '?gh=' + userHash,
    'reviews': dl => '/erase/entry/' + dl.find('a.l').first().attr('href').split('/').pop() + '?gh=' + userHash,
    'index': dl => dl.find('a').first().attr('href') + '/erase',
    'indexCollection': dl => dl.find('a.ico_del').first().attr('href'),
    'groups': dl => dl.find('a.avatar').first().attr('href') + '/bye?gh=' + userHash,
};

function run(name, payload, i = 0) {
    let delist = content[name]();
    console.log(name);
    if(delist.length == i) {
        alert('删除成功！');
        return location.reload();
    }
    $('a.del span').text(`正在删除... (${i + 1})`);
    let callback = () => {
        delist.eq(i).hide('fast');
        run(name, payload, i + 1);
    };
    if(payload) $.post(delAPI[name](delist.eq(i)), payload, callback);
    else $.get(delAPI[name](delist.eq(i)), callback);
}

(function() {
    for(let i of pathType)
        if(new RegExp(i[0]).test(location.pathname)) {
            let delType = i[1];
            $(".actions").first().append(`<a href='#' class='chiiBtn del'><span>批量删除</span></a>`);
            $('a.del').click(() => {
                let verf = prompt(`真的要清空本页面所有个人信息吗？（输入“确认”以继续）`);
                if(verf !== '确认' && verf != '確認') return;
                let loader = pageLoader[delType]();
                if(loader.length > 0) loader.last().get(0).onclick();
                // else if(loader !== '') return alert('组件依赖缺失！');
                $('a.del').css('pointer-events', 'none');
                //exception: group unjoin & index uses POST req
                if(delType === 'groups') return run(delType, { 'action': 'join-bye' });
                if(delType === 'index') return run(delType, { 'formhash': userHash, 'submit': '我要删除这个目录' });
                run(delType);
            });
            break;
        }
})();
