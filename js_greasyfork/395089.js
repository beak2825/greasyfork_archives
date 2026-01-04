// ==UserScript==
// @name         Pixiv Additional Navigator
// @name:ja      Pixiv Additional Navigator
// @namespace    https://greasyfork.org/ja/users/166153-hac
// @version      1.1.1
// @description  Add navigation menu.
// @description:ja Pixivにナビゲーションメニューを追加して作品一覧やブックマークへのアクセスをよくします。2019年末のPixivのUI改変にキレて作りました。
// @author       HAC
// @match        https://www.pixiv.net/*
// @grant        none
// @license      MIT License
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/395089/Pixiv%20Additional%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/395089/Pixiv%20Additional%20Navigator.meta.js
// ==/UserScript==

{
    'use strict';

    const userstyle = `
#additional_navigator {
  margin: 4px auto 0;
  padding: 0;
  width: 970px;
  display: flex;
  list-style: none;
  border-bottom: 1px solid #e4e7ee;
  box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
}
#additional_navigator > li {
  border-radius: 5px 5px 0 0;
  background-color: #fbfbfb;
  flex-grow: 1;
}
#additional_navigator > li:not(:last-child) {
  border-right: 1px solid #e4e7ee;
}
#additional_navigator > li > a {
  display: block;
  text-align: center;
  font-size: 14px;
  line-height: 32px;
  color: #258fb8;
  text-decoration: none;
}
#additional_navigator > li > a:hover {
  background: #f2f4f6;
  text-decoration: none;
}
#header-banner.spa {
  margin-top: 32px;
}
`;

    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = userstyle;
    head.appendChild(style);

    const textArray = [
        {title: 'トップ', url: '/'},
        {title: '作品管理', url: '/manage/illusts/'},
        {title: 'ブックマーク', url: '/bookmark.php'},
        {title: '非公開ブックマーク', url: '/bookmark.php?rest=hide'},
        {title: '閲覧履歴', url: '/history.php'},
        {title: 'しおり', url: '/novel/marker_all.php'},
        {title: '設定', url: '/setting_user.php'}
    ];

    const ul = document.createElement('ul');
    ul.id = 'additional_navigator';
    textArray.forEach(({title, url}) => {
        const a = document.createElement('a');
        const li = document.createElement('li');
        a.append(title);
        a.href = url;
        li.append(a);
        ul.append(li);
    });
    const wrapper = document.body.prepend(ul);
}