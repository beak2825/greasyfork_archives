// ==UserScript==
// @name        SG萨特标记器
// @description SG成份标记助手，可标记成份和萨特
// @author  薅羊毛@SG & kubixb
// @include     http://bbs.sgamer.com/thread-*.html
// @include     http://bbs.sgamer.com/*mod=viewthread*
// @version     1.0.3
// @grant       GM_getValue
// @grant       GM_setValue
// @namespace https://greasyfork.org/users/4074
// @downloadURL https://update.greasyfork.org/scripts/370189/SG%E8%90%A8%E7%89%B9%E6%A0%87%E8%AE%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/370189/SG%E8%90%A8%E7%89%B9%E6%A0%87%E8%AE%B0%E5%99%A8.meta.js
// ==/UserScript==


function updateLayout() {
    let List = document.getElementById('postlist').children;
    for (let i = 2; i < List.length - 1; i++) {
        let post = List[i];//获取本Post
        let postID = post.id.substr(5);//获取该Post的ID
        let UID = getUID(postID);
        appendData(postID, UID);
        appendButton(postID, UID);
    }

}

function getUID(postID) {
    let UID;
    let node = document.getElementById("favatar" + postID).getElementsByClassName("authi")[0];
    let hrefstr = node.firstElementChild.getAttribute('href').substr(10);
    UID = hrefstr.substr(0, hrefstr.length - 5);
    return UID;
}

function appendData(postID, UID) {
    let node = document.getElementById("favatar" + postID).getElementsByClassName("pil cl")[0];
    node.children[10].innerText = '成份';
    if (UID) {
        node.children[11].innerText = GM_getValue('UserCF' + UID, '未标记');
    }
    node.children[12].innerText = '物种';
    if (UID) {
        node.children[13].innerText = GM_getValue('UserWZ' + UID, '未标记');
    }
}

function appendButton(PostID, UID) {
    let node = document.getElementById("pid" + PostID).getElementsByClassName("pob cl")[0].getElementsByTagName('p')[0];
    if (node.lastElementChild.id == 'UserWZ' + UID)
        return;
    let newP1 = document.createElement('a');
    newP1.innerText = '标记成份';
    newP1.href = "javascript:void(0);";
    newP1.id = "UserCF" + UID;
    newP1.onclick = function () {
        let ID = this.id.substr(6);
        let currentdata = GM_getValue('UserCF' + ID, '未标记');
        let data = prompt("请给此SGer标记成份", currentdata);
        if(data===null)
            return;
        if (data === '') {
            data = '未标记';
        }
        GM_setValue('UserCF' + ID, data);
        updateLayout();
    };
    node.appendChild(newP1);

    let newP2 = document.createElement('a');
    newP2.innerText = '标记物种';
    newP2.href = "javascript:void(0);";
    newP2.id = "UserWZ" + UID;
    newP2.onclick = function () {
        let ID = this.id.substr(6);
        let currentdata = GM_getValue('UserWZ' + ID, '未标记');
        let index = select.selectedIndex;
        let data = select.options[index].text;
        if(data===null)
            return;
        if (data==='') {
            data = '未标记';
        }
        GM_setValue('UserWZ' + ID, data);
        updateLayout();
    };
    let select=document.createElement("select");
    var opt = new Option("未标记","wbj");
    select.options.add(opt);
    opt = new Option("龙骑士","DK");
    select.options.add(opt);
    opt = new Option("远古大萨","ygds");
    select.options.add(opt);
    opt = new Option("萨特","st");
    select.options.add(opt);
    opt = new Option("小萨","xs");
    select.options.add(opt);
    opt = new Option("狗头人","gtr");
    select.options.add(opt);
    node.appendChild(select);
    node.appendChild(newP2);
}

setTimeout(updateLayout,200);