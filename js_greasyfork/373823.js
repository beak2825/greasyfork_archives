// ==UserScript==
// @name         巴哈姆特通知式信件匣
// @namespace    巴哈姆特通知式信件匣
// @version      20200911
// @description  把巴哈姆特的信件匣變得像通知一樣可展開預覽列表
// @author       johnny860726
// @include      *gamer.com.tw/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373823/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E9%80%9A%E7%9F%A5%E5%BC%8F%E4%BF%A1%E4%BB%B6%E5%8C%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/373823/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E9%80%9A%E7%9F%A5%E5%BC%8F%E4%BF%A1%E4%BB%B6%E5%8C%A3.meta.js
// ==/UserScript==

// -----------------------------------------------
// 信件備份匣切換鈕, true: 啟用, false: 停用
const switch_button = true;

// 讀取間隔（ms）, 若影響到瀏覽器速度請調高至 100
const tick = 50;
// -----------------------------------------------

// functions
String.prototype.format = function () {
    var args = [].slice.call(arguments);
    return this.replace(/(\{\d+\})/g, function (a){
        return args[+(a.substr(1,a.length-2))||0];
    });
};

function timestamp(str){
    var match = str.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/);
    var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
    return (date.getTime() / 1000);
}

var waitForEl = function(selector, callback) {
    if((selector === '' ? document.documentElement.innerText : jQuery(selector)).length !== 0){
        callback();
    }else{
        setTimeout(function(){
            waitForEl(selector, callback);
        }, tick);
    }
};

const css_src = '<head><link href="https://i2.bahamut.com.tw/css/BH.css?v=1515722800" rel="stylesheet" type="text/css" /><link href="https://i2.bahamut.com.tw/css/basic.css?v=1538041157" rel="stylesheet" type="text/css" /><link href="https://i2.bahamut.com.tw/css/font-awesome.css" rel="stylesheet" type="text/css"></head>'

if(location.host === 'mailbox.gamer.com.tw' && (document.location.hash.slice(1) === 'notification' || document.location.hash.slice(1) === 's_notification')){
    function list(){
        let m_data_html = document.createElement('div');
        console.log(document.documentElement.innerText);
        m_data_html.innerHTML = JSON.parse(document.documentElement.innerText).data;
        document.body.innerHTML = css_src;
        let m_data_tr = m_data_html.getElementsByClassName('BH-table')[0].getElementsByTagName('tr');
        let m_data = [];
        let timestamp_now = Math.floor(Date.now() / 1000);
        var unread = 0;
        if (document.location.hash.slice(1) === 'notification') {
            m_data.push(0);
        }else if (document.location.hash.slice(1) === 's_notification') {
            m_data.push(1);
        }
        for(let i=0; i<m_data_tr.length; i++){
            let mail = new Object();
            if(m_data_tr[i].className !== ''){
                mail.status = (m_data_tr[i].className === 'readU') ? 0 : 1;
                mail.sn = m_data_tr[i].id.substring(5);
                mail.title = m_data_tr[i].getElementsByClassName('mailTitle')[0].innerText;
                let tmp = m_data_tr[i].getElementsByClassName('searchUser')[0].parentNode;
                mail.id = tmp.getElementsByTagName('a')[0].innerText;
                if(document.location.hash.slice(1) === 's_notification'){
                    mail.nickname = mail.id;
                }else{
                    mail.nickname = tmp.getElementsByTagName('a')[1].innerText.toLowerCase();
                }
                mail.time = m_data_tr[i].getElementsByTagName('td')[3].innerText;
                m_data.push(mail);
            }
        }
        parent.postMessage(JSON.stringify(m_data), document.referrer.match(/^.+:\/\/[^\/]+/)[0]);
    }
    waitForEl('', list);
}else{
    window.addEventListener('message', function(e) {
        if (event.origin !== "https://mailbox.gamer.com.tw"){
            return;
        }
        var m_data = JSON.parse(e.data);
        let timestamp_now = Math.floor(Date.now() / 1000);
        var parentNode = document.getElementById('topBarMsg_light_3');
        console.log(m_data);
        // list
        let m_list = document.createElement('div');
        m_list.setAttribute('class', 'TOP-msglist');
        m_list.setAttribute('style', 'max-height: calc(95vh - 118px);');
        m_list.setAttribute('style', 'min-width: 360px;');
        m_list.setAttribute('style', 'max-width: 415px;');
        let readU = 0;
        for(let i=1; i<m_data.length; i++){
            let m_div = document.createElement('div');
            let m_link = document.createElement('a');
            let m_nickname = document.createElement('span');
            let m_nickname_outer = document.createElement('p');
            let m_time = document.createElement('span');
            let m_title = document.createElement('span');
            let m_avatar_outer = document.createElement('span');
            let m_avatar = document.createElement('img');
            let time_str = '';
            if(m_data[i].status === 0){
                readU++;
            }
            m_avatar_outer.setAttribute('href', 'https://home.gamer.com.tw/homeindex.php?owner=' + m_data[i].id);
            m_avatar_outer.setAttribute('target', '_blank');
            m_avatar.setAttribute('src', 'https://avatar2.bahamut.com.tw/avataruserpic/{0}/{1}/{2}/{3}_s.png'.format(m_data[i].id.substring(0, 1), m_data[i].id.substring(1, 2), m_data[i].id, m_data[i].id));
            m_avatar.setAttribute('style', 'border-radius: 50%; margin-right: 8px; width: 32px; height: 32px; float: left;');
            m_avatar_outer.appendChild(m_avatar);
            m_link.appendChild(m_avatar_outer);
            m_div.appendChild(m_link);
            m_nickname.innerText = m_data[i].nickname;
            m_nickname_outer.appendChild(m_nickname);
            let s_to = document.createElement('span');
            s_to.setAttribute('style', 'margin-right: 4px;');
            s_to.innerText = '寄給';
            m_link.appendChild(m_nickname_outer);
            m_title.innerText = m_data[i].title;
            m_link.setAttribute('target', '_blank');
            m_link.appendChild(m_title);
            if(m_data[0] === 0){
                m_list.setAttribute('id', 'mailListA');
                m_link.setAttribute('href', 'https://mailbox.gamer.com.tw/read.php?sn=' + m_data[i].sn);
            }else{
                m_nickname_outer.insertBefore(s_to, m_nickname);
                m_list.setAttribute('id', 'mailListB');
                m_list.style.display = 'none';
                m_link.setAttribute('href', 'https://mailbox.gamer.com.tw/send.php?fw=1&t=new&from=sendbox&sn=' + m_data[i].sn);
            }
            if(timestamp_now - timestamp(m_data[i].time) < 60){
                time_str = '1分內';
            }else if(timestamp_now - timestamp(m_data[i].time) < 3600){
                time_str = Math.floor((timestamp_now - timestamp(m_data[i].time)) / 60) + '分前';
            }else if(timestamp_now - timestamp(m_data[i].time) < 86400){
                time_str = Math.floor((timestamp_now - timestamp(m_data[i].time)) / 3600) + '小時前';
            }else if(timestamp_now - timestamp(m_data[i].time) < 2592000){
                time_str = Math.floor((timestamp_now - timestamp(m_data[i].time)) / 86400) + '天前';
            }else{
                time_str = m_data[i].time;
            }
            m_time.innerHTML = '<span class="time">' + time_str + '</span>';
            m_link.appendChild(m_time);
            m_list.appendChild(m_div);
            if(m_data[i].status === 0){
                m_div.setAttribute('class', 'new');
            }
        }
        parentNode.insertBefore(m_list, parentNode.getElementsByClassName("TOP-msgbtn")[0]);
        if(readU !== 0){
            let readUNumber = document.createElement("span");
            readUNumber.innerText = readU;
            document.getElementById("topBar_light_3").appendChild(readUNumber);
        }
    });

    function outer(){

        // outer and title
        var m_outer = document.createElement('div');
        m_outer.setAttribute('id', 'topBarMsg_light_3');
        m_outer.setAttribute('class', 'TOP-msg');
        m_outer.setAttribute('style', 'display: none;');
        let m_title = document.createElement('span');
        m_title.setAttribute('id', 'm_title');
        m_title.innerText = '收信匣';
        m_outer.appendChild(m_title);
        document.getElementsByClassName('TOP-data')[0].insertBefore(m_outer, document.getElementById('topBarMsg_member'));

        // list1 (iframe)
        let m_list = document.createElement('iframe');
        m_list.style = 'display: none;';
        m_list.id = 'mail_list';
        m_list.src = 'https://mailbox.gamer.com.tw/ajax/inboxList.php#notification';
        m_outer.appendChild(m_list);

        if(switch_button){
            // list2 (iframe)
            let ms_list = document.createElement('iframe');
            ms_list.style = 'display: none;';
            ms_list.id = 's_mail_list';
            ms_list.src = 'https://mailbox.gamer.com.tw/ajax/sendboxList.php#s_notification';
            m_outer.appendChild(ms_list);
        }

        // top_buttons
        var m_top_btn = document.createElement('a');
        m_top_btn.setAttribute('href', 'javascript:TopBar.showMenu(\'light_3\', \'topbm\')');
        m_top_btn.setAttribute('id', 'topBar_light_3');
        m_top_btn.setAttribute('class', 'topbm');
        var s0 = document.createElement('style');
        s0.innerHTML = '.TOP-btn a.topbm:before{content:"\\f0e0"; color:#FFFFFF}';
        document.body.appendChild(s0);
        document.getElementsByClassName('TOP-btn')[0].appendChild(m_top_btn);
        document.getElementById('topBar_mailbox').setAttribute('style', 'display: none;');

        // bottom_buttons
        var m_btn = document.createElement('p');
        m_btn.setAttribute('class', 'TOP-msgbtn');
        var m_btns = [];
        for(var i=((switch_button) ? 0 : 1); i<3; i++){
            m_btns[i] = document.createElement('a');
            m_btns[i].innerHTML = '<a href="home.gamer.com.tw/"><i class="fa fa-bars" aria-hidden="true"></i>按鈕</a>';
            m_btns[i].style.width = 'calc( 100%/' + ((switch_button) ? 3 : 2) + ' - 2px)';
            m_btn.appendChild(m_btns[i]);
        }
        if(switch_button){
            m_btns[0].innerText = '看寄件備份匣';
            m_btns[0].setAttribute('id', 'switch_mailbox');
            m_btns[0].style.cursor = 'pointer';
            m_btns[0].href="javascript:;";
            var icon0 = document.createElement('i');
            icon0.setAttribute('class', 'fa fa-envelope-o');
            icon0.setAttribute('aria-hidden', 'true');
            m_btns[0].insertBefore(icon0, m_btns[0].firstChild);
            m_btns[0].onclick = function(){
                let t = document.getElementById('m_title');
                let s_bt = document.getElementById('switch_mailbox');
                let icon0 = document.createElement('i');
                if(s_bt.innerText === '看收信匣'){
                    icon0.setAttribute('class', 'fa fa-envelope-o');
                    icon0.setAttribute('aria-hidden', 'true');
                    document.getElementById('mailListA').style.display = '';
                    document.getElementById('mailListB').style.display = 'none';
                    t.innerText = '收信匣';
                    s_bt.innerText = '看寄件備份匣';
                }else{
                    icon0.setAttribute('class', 'fa fa-envelope-o');
                    icon0.setAttribute('aria-hidden', 'true');
                    document.getElementById('mailListA').style.display = 'none';
                    document.getElementById('mailListB').style.display = '';
                    t.innerText = '寄件備份匣';
                    s_bt.innerText = '看收信匣';
                }
                s_bt.insertBefore(icon0, s_bt.firstChild);
            }
        }
        m_btns[1].innerText = '回傳統介面';
        var icon1 = document.createElement('i');
        icon1.setAttribute('class', 'fa fa-eject');
        icon1.setAttribute('aria-hidden', 'true');
        m_btns[1].setAttribute('href', 'https://mailbox.gamer.com.tw/');
        m_btns[1].insertBefore(icon1, m_btns[1].firstChild);
        m_btns[2].innerText = '寫新信';
        var icon2 = document.createElement('i');
        icon2.setAttribute('class', 'fa fa-pencil');
        icon2.setAttribute('aria-hidden', 'true');
        m_btns[2].insertBefore(icon2, m_btns[2].firstChild);
        m_btns[2].setAttribute('href', 'https://mailbox.gamer.com.tw/send.php');
        m_btns[2].setAttribute('target', '_blank');
        m_outer.appendChild(m_btn);
    }
    waitForEl('#topBarMsg_member', outer);
}