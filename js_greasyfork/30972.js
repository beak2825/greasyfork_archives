// ==UserScript==
// @name         BS-Tool
// @namespace    https://bs.to/
// @version      0.26
// @description  Messenger & Shoutbox improvements
// @author       ShafterOne
// @match        https://bs.to/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/30972/BS-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/30972/BS-Tool.meta.js
// ==/UserScript==

var storage = {
    prefix: $('#navigation div strong').html() + "_",
    reset(){
        var storage = GM_listValues();
        for (var key in storage) {
            GM_deleteValue(storage[key]);
        }
    },
    get(key){
        return GM_getValue(this.prefix + key);
    },
    set(key, value){
        GM_setValue(this.prefix + key, value);
    },
    getList(key){
        return GM_getValue(this.prefix + key) || [];
    },
    getListItem(key, index){
        return this.getList(key)[index] || [];
    },
    setList(key, value){
        var list = this.getList(key);
        if (list.indexOf(value) == -1) {
            list.push(value);
            GM_setValue(this.prefix + key, list);
        }
    },
    isInList(key, value){
        var list = this.getList(key);
        return list.indexOf(value) !== -1 ? true : false;
    },
    isInObjectList(list, idx){
        list = this.getList(list);
        return list.hasOwnProperty(idx) ? true : false;
    },
    setObjectListItem(list, key, object){
        var objectList = this.getObjectList(list);
        objectList[key] = object;
        GM_setValue(this.prefix + list, objectList);
    },
    getObjectList(list){
        return GM_getValue(this.prefix + list) || {};
    },
    getObjectListItem(list, key){
        return this.getList(list)[key];
    },


    removeListItem(key, value)
    {
        var list = this.getList(key);
        var idx = list.indexOf(value);
        list.splice(idx, 1);
        GM_setValue(this.prefix + key, list);
    },
};

var sb = {
    lastID: 1,
    myUsername: $('#navigation div strong').html(),
    posts: [],
    renderedPost: [],
    mode: 'update',
    buffer: 500,
    box: $('#sbPosts'),
    refreshInterval: 1500,
    scrollDown: true,
    alwaysVisible: false, //true to show Shoutbox on all pages
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Cookie': document.cookie,
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://bs.to/home',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
        'host': 'bs.to',
        'Origin': 'https://bs.to'
    },
    emojiPath: '/public/img/emojis/',
    emojis: [
        {img: 'smiling.png', txt: ':)'},
        {img: 'grinning.png', txt: ':D'},
        {img: 'tongue_out.png', txt: ':P'},
        {img: 'frowning.png', txt: ':('},
        {img: 'speechless.png', txt: ':|'},
        {img: 'surprised.png', txt: ':O'},
        {img: 'angry.png', txt: ':!'},
        {img: 'lips_sealed.png', txt: ':x'},
        {img: 'heart.png', txt: '<3'},
        {img: 'kiss.png', txt: ':*'},
        {img: 'poop.png', txt: '*poop*'},
        {img: 'thumbs_up.png', txt: '(Y)'},
    ],
    init(){
        clearTimeout(Shoutbox.timeout1);
        sb.getPosts();
        sb.updateSbMenu();
        sb.refreshPosts();
        $('#shoutbox form').attr('onsubmit', 'return null');
        var textbox = $('#sbMsg');
        textbox.attr('onkeydown', null);
        textbox.keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                sb.sendMessage();
            }
        });
        $('#sbSubmit').click(function (event) {
            event.preventDefault();
            sb.sendMessage();
        });
    },
    getPosts(){
        var self = this;
        GM_xmlhttpRequest({
            method: "POST",
            data: $.param({last: this.lastID}),
            url: "https://bs.to/ajax/sb-posts.php",
            headers: self.headers,
            onload: function (res) {
                data = JSON.parse(res.responseText);
                self.setPosts(data.posts.reverse());
                self.lastID = data.last > 0 ? data.last : self.lastID;
            }
        });
    },
    sendMessage(){
        var self = this;
        GM_xmlhttpRequest({
            method: "POST",
            data: $.param({last: this.lastID, text: $('#sbMsg').val()}),
            url: "https://bs.to/ajax/sb-send.php",
            headers: self.headers,
            onload: function (res) {
                self.getPosts();
                $('#sbMsg').val('');
            }
        });
    },
    setPosts(posts){
        var startPos = this.getScrollPos();
        for (var idx in posts) {
            this.posts.push(posts[idx]);
            if (this.posts.length > this.buffer) {
                this.posts.shift();
            }
        }
        if (this.mode == 'update') {
            if (this.scrollDown || startPos.sp + 50 >= startPos.ms) {
                this.updatePosts();
                var newPos = this.getScrollPos();
                this.box.scrollTop(newPos.ms);
                this.scrollDown = false;
            } else {
                this.updatePosts();
                this.box.scrollTop(startPos.sp);
            }
        } else {
            this.renderBox();
        }
    },
    refreshPosts(){
        var self = this;
        setInterval(function () {
            self.getPosts();
        }, self.refreshInterval);
    },
    updatePosts(){
        if (this.lastID == 1) {
            this.box.html(this.getPostsHtml());
        } else {
            this.box.append(this.getPostsHtml());
        }
        this.attachUserMenuEvents();
    },
    reRenderPosts(){
        this.renderedPost = [];
        this.box.html('');
        this.updatePosts();
    },
    getScrollPos(){
        var sp = this.box.scrollTop();
        var sh = this.box.prop("scrollHeight");
        var ms = sh - this.box.outerHeight();
        return {sp: sp, sh: sh, ms: ms};
    },
    removeFirstPost(){
        if (this.renderedPost.length > this.buffer) {
            this.renderedPost.shift();
            this.box.find('dt')[0].remove();
            this.box.find('dd')[0].remove();
        }
    },
    getPostsHtml(){
        var html = '';
        for (var idx in this.posts) {
            var post = this.posts[idx];
            if (!storage.isInList('muted', post.user) && this.renderedPost.indexOf(post.id) == -1) {
                var text = post.text.replace(/((?:www\.|https?:\/\/)([^\s]+))/, '<a class="truncate" href="$1" target="_blank">$2</a>', "g");
                for (var i in this.emojis) {
                    var emo = this.emojis[i];
                    text = text.split(emo.txt == '<3' ? '&lt;3' : emo.txt).join(' <img src="' + this.emojiPath + emo.img + '" alt="' + emo.txt + '" title="' + emo.txt + '" class="sb_smiley" />');
                }
                var mark = '<i title="Teilnehmer markieren" class="fa fa-bullseye mark user-option" aria-hidden="true"></i>';
                var mail = '<i title="PM Senden" class="fa fa-envelope send-mail user-option" aria-hidden="true"></i>';
                var pasteName = '<i title="Name in TextBox einfuegen" onclick="Shoutbox.addSmiley(\'@' + post.user + '\')" class="fa fa-clone user-option" aria-hidden="true"></i>';
                var mute = !storage.isInList('friends', post.user) ? '<i title="Mute User" class="fa fa-ban mute-user user-option" aria-hidden="true"></i>' : '';
                var marked = storage.get('marked') == post.user ? ' marked' : '';
                var userOption = post.user != this.myUsername ? '<span class="user-menu" data-user="' + post.user + '">' + pasteName + mark + mail + mute + '<span>' : '';
                var hl = storage.isInList('friends', post.user) ? 'class="highlight' + marked + '"' : 'class="' + marked + '"';
                hl = post.user == this.myUsername ? 'class="highlight-me"' : hl;
                html += '<dt ' + hl + '><a  class="' + post.rank + '" href="https://bs.to/user/' + post.user + '">' + post.user + '</a> <time>' + post.time + '</time>' + userOption + '</dt>';
                html += '<dd>' + text + '</dd>';
                this.renderedPost.push(post.id);
                this.removeFirstPost();
            }
        }
        return html;
    },
    updateSbMenu(){
        var header = $('#shoutbox header');
        var html = '<ul id="sb-menu">';
        var muted = storage.getList('muted');
        if (header.find('#sb-menu').length) {
            header.find('#sb-menu').remove();
        }
        html += this.renderMutedUsers();
        html += '</ul>';
        header.prepend(html);
        this.attachSbMenuEvents();
    },
    attachSbMenuEvents(){
        $("#sb-menu>li").hover(
            function () {
                $(this).find('.sub-menu').removeClass("hidden");
            },
            function () {
                $(this).find('.sub-menu').addClass("hidden");
            }
        );
        $('#sb-menu .reset-mute').click(function () {
            var user = $(this).parent().find('.muted').html();
            storage.removeListItem('muted', user);
            sb.reRenderPosts();
            $(this).parent('li').remove();
            if (!$('.reset-mute').length) {
                $('#sb-menu').remove();
            }
        });
    },
    attachUserMenuEvents(){
        $('.user-option').off();
        $('.user-option.mark').click(function () {
            var user = $(this).parent().attr('data-user');
            var marked = storage.get('marked');
            if (marked == user) {
                storage.set('marked', null);
            } else {
                storage.set('marked', user);
            }
            sb.reRenderPosts();
        });
        $('.user-option.send-mail').click(function () {
            var user = $(this).parent().attr('data-user');
            sidebar.showMessageModal({type: 'new', user: user});
        });
        $('.user-option.mute-user').click(function () {
            var user = $(this).parent().attr('data-user');
            storage.setList('muted', user);
            sb.updateSbMenu();
            sb.reRenderPosts();
        });
    },
    renderMutedUsers(){
        var muted = storage.getList('muted');
        if (muted.length) {
            var html = '<li><i class="fa fa-ban" aria-hidden="true"></i> Muted<ul id="muted" class="sub-menu hidden">';
            for (var idx in muted) {
                html += '<li><span class="muted">' + muted[idx] + '</span> <i class="fa fa-minus-square reset-mute" aria-hidden="true"></i></li>';
            }
            html += '</ul></li>';
            return html;
        }
        return '';
    },
    renderBox(){
        var html = '<section id="shoutbox"><section id="shoutbox"><div><dl id="sbPosts">';
        html += this.getPostsHtml();
        html += '</div></dl></section>';
        return html;
    },
};

var sidebar = {
    messages: [],
    fullSync: false,
    maxMessages: 100,
    refreshIntervalMessages: 10000,
    refreshIntervalUserOnline: 30000,
    userOnline: {},
    seriesGenre: {},
    series: [],
    init(){
        this.refreshMessages();
        this.refreshUserOnline();
        this.renderSidebar();
    },
    getMessages(page){
        var self = this;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://bs.to/messages/" + page,
            headers: {
                'Cookie': document.cookie,
            },
            onload: function (res) {
                self.extractMessages(res.responseText, page);
            }
        });
    },
    insertShoutbox(){
        var self = this;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://bs.to",
            headers: {
                'Cookie': document.cookie,
            },
            onload: function (res) {
                var shoutbox = $(res.responseText).find('#shoutbox');
                $('body').prepend('<section class="home draggable" style="width:400px"><div class="column"  style="width:100%"><section id="shoutbox">' + shoutbox.html() + '</section></div></section>');
                $('body').find('#sbUser').remove();
                $('.draggable').draggable().css('position', 'fixed').css('left', '9px').css('top', '140px').css('z-index', '11');
                $('#shoutbox header h3').css('cursor', 'move');
                sb.box = $('#sbPosts');
                $('#sbMsg').css('width', '100% !important').css('box-sizing', 'border-box');
                sidebar.init();
                sb.init();
            }
        });
    },
    getUserOnline(page){
        var self = this;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://bs.to/ajax/sb-user.php",
            headers: {
                'Cookie': document.cookie,
            },
            onload: function (res) {
                var data = JSON.parse(res.responseText);
                self.userOnline = data.user;
                self.renderUserOnline();
            }
        });
    },
    getMessage(id){
        var self = this;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://bs.to/messages/read:" + id,
            headers: {
                'Cookie': document.cookie,
            },
            onload: function (res) {
                var messageText = $(res.responseText).find('.message-read p').html();
                var message = storage.getObjectListItem('messages', id);
                //console.log(message);
                message.text = messageText;
                message.status = 'read';
                storage.setObjectListItem('messages', id, message);
                self.showMessageModal(message);
                self.renderMessages();
            }
        });
    },
    getSeries(){
        var self = this;
        if (self.series.length === 0) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://bs.to/andere-serien",
                headers: {
                    'Cookie': document.cookie,
                },
                onload: function (res) {
                    var seriesContainer = $(res.responseText).find('#seriesContainer');
                    seriesContainer.find('.genre').each(function (index) {
                        var genre = $(this).find('span').text();
                        var series = [];
                        $(this).find('li').each(function (index) {
                            var name = $(this).text();
                            var url = 'https://bs.to/' + $(this).find('a').attr('href');
                            series.push({name: name, url: url});
                            self.series.push({name: name, url: url});
                        });
                        self.seriesGenre[genre] = series;
                    });
                    self.renderSeries();
                }
            });
        } else {
            self.renderSeries();
        }

    },
    sendMessage(){
        var self = this;
        var mm = $('#message-modal');
        var text = mm.find('.message').val();
        var subject = mm.find('.subject').val();
        var receiver = mm.find('.receiver').val();
        GM_xmlhttpRequest({
            method: "POST",
            data: $.param({'newmsg[to]': receiver, 'newmsg[subject]': subject, 'newmsg[text]': text}),
            url: "https://bs.to/messages/new",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Cookie': document.cookie,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Referer': 'https://bs.to/messages/new',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.109 Safari/537.36',
                'host': 'bs.to',
                'Origin': 'https://bs.to'
            },
            onload: function (res) {
                $('#message-modal').iziModal('close');
                this.extractMessages(res.responseText, 1);
            }
        });
    },
    extractMessages(html, page){
        var table = $(html).find('table');
        var next = true;
        table.find('tr').each(function (index) {
            var message = {};
            if (index > 0) {
                var cols = $(this).find('td');
                message.status = $(this).attr('class') == 'unread' ? 'unread' : 'read';
                message.id = $(cols[1]).find('a').attr('href').match(/\d+/)[0];
                message.subject = $(cols[1]).text();
                message.sender = $(cols[2]).text();
                message.receiver = $(cols[3]).text();
                message.time = $(cols[4]).text();
                message.type = message.sender == 'Dir' ? 'outgoing' : 'incoming';
                message.archived = false;
                if (storage.isInObjectList('messages', message.id) && !this.fullSync) {
                    next = false;
                }
                storage.setObjectListItem('messages', message.id, message);
            }
        });

        if (!$(html).find('.pages .current').next('.disabled').length && next) {
            this.getMessages(page + 1);
        } else {
            this.renderMessages();
        }
    },
    strMatch(str, search){
        var words = search.toLowerCase().split(' ');
        var count = 0;
        for (var idx in words) {
            var regex = new RegExp(words[idx], 'g');
            if (str.toLowerCase().match(regex)) {
                count++;
            }
        }
        return words.length == count ? true : false;
    },
    refreshMessages(){
        var self = this;
        self.getMessages(1);
        setInterval(function () {
            self.getMessages(1);
        }, self.refreshIntervalMessages);
    },
    refreshUserOnline(){
        var self = this;
        self.getUserOnline();
        setInterval(function () {
            self.getUserOnline();
        }, self.refreshIntervalUserOnline);
    },
    searchSeries(str){
        var results = [];
        for (var idx in this.series) {
            if (this.strMatch(this.series[idx].name, str)) {
                results.push(this.series[idx]);
            }
        }
        return results;
    },
    renderSeries(){
        var selected = storage.get('selectedGenre');
        var search = $('#search-box').val();
        var html = '<div id="series-container" class="scroll-box">';
        var data;
        if (selected || search) {
            if (selected == 'favorites' && !search) {
                data = this.series;
            } else {
                data = search ? this.searchSeries(search) : this.seriesGenre[selected];
            }
            html += `<div class="list-item reset-genre pointer">
    		<span class="item">..</span>
    		</div>`;
            for (var series in data) {
                if (selected == 'favorites' && storage.isInList('favorites', data[series].name) || selected != 'favorites' && selected != 'genre') {
                    var add = '<i title="Zu Favoriten hinzufuegen" class="fa fa-plus-square event" data-action="add" aria-hidden="true"></i>';
                    var remove = '<i title="Aus Favoriten entfernen" class="fa fa-ban event" data-action="remove" aria-hidden="true"></i>';
                    html += `<div class="list-item" data-url="` + data[series].url + `" data-name="` + data[series].name + `">
    				<span class="series item"><a target="_self" href="` + data[series].url + `">` + data[series].name + `</a></span>
    				<span class="action">
    				<i title="Serie in TextBox einfügen" onclick="Shoutbox.addSmiley('` + data[series].url + `')" class="fa fa-clone" aria-hidden="true"></i>
    				` + (storage.isInList('favorites', data[series].name) ? remove : add) + `
    				</span>
    				</div>`;
                }
            }
        } else {
            html += `<div class="list-item genre item" data-genre="favorites">
    		<span class="name item">Favoriten</span> <span class="count">(` + storage.getList('favorites').length + `)</span>
    		</div>`;
            for (var genre in this.seriesGenre) {
                html += `<div class="list-item genre item" data-genre="` + genre + `">
    			<span class="name item">` + genre + `</span><span class="count">(` + this.seriesGenre[genre].length + `)</span>
    			</div>`;
            }
        }
        html += '</div>';
        if (storage.get('content') == 'series') {
            $('#sb-content').html(html);
        }
        this.attachSeriesEvents();
    },
    attachSeriesEvents(){
        $("#series-container .list-item.genre ").click(function () {
            storage.set('selectedGenre', $(this).attr('data-genre'));
            sidebar.renderSeries();
        });
        $("#series-container .reset-genre").click(function () {
            storage.set('selectedGenre', null);
            $('#search-box').val('');
            sidebar.renderSeries();
        });
        $("#series-container .event").click(function () {
            var scrollPos = $('#series-container').scrollTop();
            var action = $(this).attr('data-action');
            var name = $(this).parents('.list-item').attr('data-name');
            if (action == 'add') {
                storage.setList('favorites', name);
            } else {
                if (confirm('Serie ' + name + ' entfernen?')) {
                    storage.removeListItem('favorites', name);
                }
            }
            sidebar.renderSeries();
            $('#series-container').scrollTop(scrollPos);
        });

    },
    renderMessages(){
        var search = $('#search-box').val();
        var messages = storage.getList('messages');
        var scrollPos = $('#message-container').scrollTop();
        var keys = Object.keys(messages).sort().reverse();
        var html = '<div id="message-container" class="scroll-box"><div class="messages">';
        var filter = storage.get('message_filter');
        var counter = 0;
        var newMessages = 0;
        for (var i = 0; i < keys.length; i++) {
            var message = messages[keys[i]];
            if (counter <= this.maxMessages && (!search || this.strMatch(message.subject, search) || message.type == 'incoming' &&
                this.strMatch(message.sender, search) || message.type == 'outgoing' && this.strMatch(message.receiver, search))) {
                var sender = '<span class="sender">' + message.sender + '</span>';
                var receiver = '<span class="receiver">' + message.receiver + '</span>';
                var unread = '<i class="fa fa-envelope" aria-hidden="true"></i>';
                var read = '<i class="fa fa-envelope-open" aria-hidden="true"></i>';
                var status = message.status == 'read' ? read : unread;
                var m = '<div class="message ' + message.status + '" data-id="' + message.id + '"><div class="message-details ' + message.type + '">';
                m += message.type == 'incoming' ? '<span>Von: </span>' + sender : '<span>An: </span>' + receiver;
                m += '<span class="status">' + status + '</span><span class="time">' + message.time + '</span></div>';
                m += '<div class="subject">' + message.subject + '</div></div>';
                html += filter == message.status ? m : '';
                html += filter == message.type ? m : '';
                html += filter === '' ? m : '';
                newMessages += message.type == 'incoming' && message.status == 'unread' ? 1 : 0;
                counter++;
            }
        }
        html += '</div></div>';
        if (storage.get('content') == 'messages') {
            $('#sb-content').html(html);
        }
        $('#sidebar .header #new-messages').html(newMessages);
        if (newMessages === 0) {
            $('#sidebar .header #new-messages').addClass('hidden');
            $('#sidebar #unread').addClass('no-messages');
        } else {
            $('#sidebar .header #new-messages').removeClass('hidden').fadeIn();
            $('#sidebar #unread').removeClass('no-messages');
        }
        $('#message-container').scrollTop(scrollPos);
        this.attachMessageEvents();
    },
    attachMessageEvents(){
        $("#sidebar .messages .subject").click(function () {
            var id = $(this).parent().attr('data-id');
            var message = storage.getListItem('messages', id);
            if (message.text !== undefined) {
                sidebar.showMessageModal(message);
            } else {
                sidebar.getMessage(id);
            }
        });
    },
    renderUserOnline(){
        var search = $('#search-box').val();
        var html = '<div id="user-online" class="scroll-box">';
        var scrollPos = $('#user-online').scrollTop();
        for (var idx in this.userOnline) {
            var user = this.userOnline[idx];
            if (!search || this.strMatch(user.user, search)) {
                var add = !storage.isInList('friends', user.user) ? '<i class="fa fa-user-plus add-friend" aria-hidden="true"></i>' : '';
                var mail = '<i class="fa fa-envelope new-message"  aria-hidden="true"></i>';
                html += '<div class="user-container" data-user="' + user.user + '"><span class="user-name ' + user.rank + '">' + user.user + '</span><span class="action">' + add + mail + '</span></div>';
            }
        }
        if (storage.get('content') == 'user-online') {
            $('#sb-content').html(html);
        }
        $('#user-online').scrollTop(scrollPos);
        this.attachUserOnlineEvents();
    },
    isOnline(user){
        for (var idx in this.userOnline) {
            if (this.userOnline[idx].user == user) {
                return true;
            }
        }
        return false;
    },
    attachUserOnlineEvents(){
        $("#sidebar #user-online .add-friend").click(function () {
            var user = $(this).closest('.user-container').attr('data-user');
            storage.setList('friends', user);
            sidebar.renderUserOnline();
            sb.reRenderPosts();
        });
        $("#sidebar #user-online .new-message").click(function () {
            var user = $(this).closest('.user-container').attr('data-user');
            sidebar.showMessageModal({type: 'new', user: user});
        });
    },
    getSortedFriendList(){
        var online = [];
        var offline = [];
        var friends = storage.getList('friends');
        for (var idx in friends) {
            var friend = friends[idx];
            if (friend !== null && this.isOnline(friend)) {
                online.push(friend);
            } else {
                offline.push(friend);
            }
        }
        return {online: online, offline: offline.sort()};
    },

    renderFriends(){
        var search = $('#search-box').val();
        var friends = this.getSortedFriendList();
        var html = '<div id="friends" class="scroll-box">';
        var scrollPos = $('#friends').scrollTop();
        for (var status in friends) {
            for (var idx in friends[status]) {
                var friend = friends[status][idx];
                if (!search || this.strMatch(friend, search)) {
                    var remove = '<i class="fa fa-ban remove-friend" aria-hidden="true"></i>';
                    var mail = '<i class="fa fa-envelope new-message"  aria-hidden="true"></i>';
                    html += '<div class="user-container ' + status + '" data-user="' + friend + '"><span class="user-name">' + friend + '</span><span class="action">' + remove + mail + '</span></div>';
                }
            }
        }
        if (storage.get('content') == 'friends') {
            $('#sb-content').html(html);
        }
        $('#friends').scrollTop(scrollPos);
        this.attachFriendsEvents();
    }
    ,
    attachFriendsEvents()
    {
        $("#sidebar #friends .remove-friend").click(function () {
            var user = $(this).closest('.user-container').attr('data-user');
            if (window.confirm("Benutzer " + user + ' loeschen?')) {
                storage.removeListItem('friends', user);
                sidebar.renderFriends();
                sb.reRenderPosts();
            }
        });
        $("#sidebar #friends .new-message").click(function () {
            var user = $(this).closest('.user-container').attr('data-user');
            sidebar.showMessageModal({type: 'new', user: user});
        });
    }
    ,
    renderNavigation()
    {
        var filter = storage.get('message_filter');
        var content = storage.get('content');
        var searchBox = '<input type="input" id="search-box" class="search-input" placeholder="Suche:">';
        var mode = `
	<select id="message-filter">
	<option value="incoming" ` + (filter == 'incoming' ? 'selected' : '') + `>Posteingang</option>
	<option value="outgoing" ` + (filter == 'outgoing' ? 'selected' : '') + `>Gesendet</option>
	<option value="unread" ` + (filter == 'unread' ? 'selected' : '') + `>Ungelesen</option>
	<option value="" ` + (filter === '' ? 'selected' : '') + `>Alle</option>
	</select>`;
        var nav = `
	<ul class="nav">
	<!--<li data-content="settings" class="menu-item ` + (content == 'settings' ? 'active' : '') + `"><i class="fa fa-cogs" aria-hidden="true"></i></li>-->
	<li data-content="series" class="menu-item ` + (content == 'series' ? 'active' : '') + `"><i class="fa fa-film" aria-hidden="true"></i></li>
	<li data-content="user-online" class="menu-item ` + (content == 'user-online' ? 'active' : '') + `"><i class="fa fa-users" aria-hidden="true"></i></li>
	<li data-content="friends" class="menu-item ` + (content == 'friends' ? 'active' : '') + `"><i class="fa fa-address-book" aria-hidden="true"></i></li>
	<li data-content="messages" class="menu-item ` + (content == 'messages' ? 'active' : '') + `"><i class="fa fa-envelope" aria-hidden="true"></i></li>
	<li id="filter" style="` + (content != 'messages' ? 'display:none' : '') + `">` + mode + `</li>
	</ul><div style="` + (content == 'settings' ? 'display:none' : '') + `">` + searchBox + `</div>
	<span id="unread" class="no-messages"><span id="new-messages" class="hidden"></span><i class="fa fa-envelope" aria-hidden="true"></i></span>`;
        $('#sidebar .header').html(nav);
        this.attachNavigationEvents();
    }
    ,
    attachNavigationEvents()
    {
        $("#message-filter").change(function () {
            var value = $(this).val();
            storage.set('message_filter', value);
            sidebar.renderMessages();
        });
        $("#sidebar .menu-item").click(function () {
            var value = $(this).attr('data-content');
            storage.set('content', value);
            $("#sidebar .menu-item").removeClass('active');
            $(this).addClass('active');
            sidebar.renderNavigation();
            sidebar.renderContent();
        });
        $("#search-box").keyup(function () {
            var content = storage.get('content');
            if (content == 'messages') {
                sidebar.renderMessages();
            } else if (content == 'user-online') {
                sidebar.renderUserOnline();
            } else if (content == 'friends') {
                sidebar.renderFriends();
            } else if (content == 'series') {
                sidebar.renderSeries();
            }
        });
    }
    ,
    renderContent()
    {
        var content = storage.get('content');
        $('#sb-content .scroll-box').html('');
        if (content == 'messages') {
            this.renderMessages();
        } else if (content == 'user-online') {
            this.getUserOnline();
        } else if (content == 'friends') {
            this.getUserOnline();
            this.renderFriends();
        } else if (content == 'series') {
            this.getSeries();
        }
        $('#sb-content .scroll-box').hide().fadeIn();
    }
    ,
    renderSidebar()
    {
        var html = '<div id="sidebar" class="left"><div class="header"></div><div id="sb-content"></div>';
        $('#sidebar').remove();
        $('body').prepend(html);
        this.renderNavigation();
        this.renderContent();
    }
    ,
    showMessageModal(message)
    {
        var modal = `<div id="message-modal" class="iziModal">
	<div class="content-wrapper">` + (message.text || '') + `</div>
	</div>`;
        var messageInputs = `
	<label>Empfänger:</label>
	<input type="text" class="receiver" placeholder="Empfänger" name="newmsg[to]" value="` + (message.sender || message.user) + `">
	<label>Betreff:</label><input type="text" class="subject" placeholder="Betreff" value="` + (message.subject || '') + `" name="newmsg[subject]">
	<label>Nachricht:</label>
	<textarea class="message" name="newmsg[text]"></textarea>
	<button class="btn-submit" id="send-message" >Absenden</button>`;
        $('#message-modal').iziModal('close');
        $('#message-modal').remove();
        $('.iziModal-overlay').remove();
        $('body').prepend(modal);
        var title = message.subject !== undefined ? message.subject + ', <span>' + message.time + '</span>  <i class="fa fa-reply" aria-hidden="true"></i>' : 'Neue Nachricht verfassen';
        $("#message-modal").iziModal({
            title: title,
            subtitle: message.sender || '',
            headerColor: '#88A0B9',
            width: '50%',
        });
        $('#message-modal').iziModal('open');
        if (message.type !== undefined && message.type == 'new') {
            $('#message-modal .content-wrapper').html(messageInputs);
            $('#send-message').click(function () {
                sidebar.sendMessage();
            });
        } else {
            $('#message-modal .iziModal-header-title').click(function () {
                $('#message-modal .content-wrapper').html(messageInputs);
                $('#send-message').click(function () {
                    sidebar.sendMessage();
                });
            });
        }
    }
    ,
};
$("head").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js"></script>');
$("head").append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">');
$("head").append('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.4.2/js/iziModal.min.js"></script>');
$("head").append('<link href="https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.4.2/css/iziModal.min.css" rel="stylesheet" type="text/css">');
$("head").append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" />');

GM_addStyle(`
	.truncate {
		display: block;
		white-space: nowrap;
		width: 75%;
		overflow: hidden;
		text-overflow: ellipsis
	}
	#sbPosts .user-menu {
		display:none;
		float: right;
		color: #4376c3;
		padding-right: 10px
	}
	.user-menu .user-option{
		padding-right:10px;
		cursor:pointer;
	}
	#sbPosts dt:hover .user-menu{
		display:inherit;
	}
	#sbPosts .highlight {
		background-color: #ffdfa4 !important
	}
	#sbPosts .highlight-me {
		background-color: #77a2f1 !important
	}
	#sbPosts .marked{
		background-color: #fdb9b9 !important
	}
	.fa-ban,
	.remove-friend {
		color: #ec6060;
	}
	#shoutbox h3 {
		display: inline
	}
	#sb-menu {
		float: right
	}
	#sb-menu>li {
		position: relative
	}
	#sb-menu .sub-menu {
		position: absolute;
		right: 0px;
		min-width: 200px
	}
	#sb-menu .sub-menu li {
		background: #d4d4d5 !important;
		padding: 2px 6px;
		color: #000
	}
	#sb-menu .sub-menu li:hover {
		background: orange !important;
		color: #fff
	}
	#sb-menu .sub-menu li .fa {
		float: right;
		padding-left: 5px;
		padding-top: 3px;
		cursor: pointer
	}`);

//styles sidebar
GM_addStyle(`
	#sidebar.left{
		width: 350px;
		position: fixed;
		background: #cfcfcf;
		height:34px;
		top: 90px;
		padding:10px 0;
		overflow:hidden;
		left: -265px;
		opacity: .5;
		z-index:9999;
		box-shadow: 0px 0px 6px 0px #000;
	}
	#sidebar #message-filter{
		display: none;
	}
	#sidebar.left:hover #message-filter{
		display:block;
	}
	#sidebar.left:hover,.left.always-visible{
		left:0px;
		height:auto;
		opacity: 1;
		transition: opacity 0.6s;
	}
	#sidebar.left:hover #unread{
		right:10px;
		//display:none;
	}

	#sidebar .header{
		padding: 0px 10px 10px 10px;
		position: relative;
	}
	#sidebar #unread {
		position: absolute;
		font-size: 40px;
		color: #fbab34;
		right: 30px;
		top: -13px;
	}
	#sidebar #unread.no-messages{
		color:#fff;
		right: 25px;
	}
	#sidebar .nav>li{
		display:inline-block;
		font-size:25px;
		color:#094b85;
		margin-right:10px;
		vertical-align: middle;
	}
	#sidebar .nav .menu-item{
		cursor:pointer;reset();
	}
	#sidebar .nav li.active{
		color:#fbab34;
	}
	#sidebar.right{
		border-radius: 5px 0 0 5px;
	}
	#sidebar.left{
		border-radius: 0 5px 5px 0;
	}
	#sidebar.left .action{
		float:right;
		padding-left:5px;
	}
	#sidebar.left .action .fa{
		padding-left:7px;
		cursor:pointer;
	}
	#sidebar.left .action .fa:hover{
		color:orange;
	}
	#sb-content #user-online,#sb-content #friends{
		padding:5px 10px;
	}
	#sb-content .user-container.online{
		background: #dbf5db;
	}
	#sb-content .user-container{
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		margin-bottom: 5px;
		color: gray;
	}
	#sb-content .user-container .mod{
		color:#90d0f5;
	}
	#sb-content .user-container .cmod{
		color:#a363d4;
	}
	#sb-content .user-container .smod{
		color:#a3d4a1;
	}
	#sb-content .user:hover{
		border-color:orange
	}
	#sb-content .scroll-box{
		height:calc(100vh - 350px);
		background: #fff;
		overflow: hidden;
		overflow-y: scroll;
	}
	#message-container .time {
		float: right;
	}
	#message-container .status {
		float: right;
		padding-left: 10px
	}
	#message-container .message-details {
		background: #aec2e1;
		padding: 5px
	}
	#message-container .subject {
		padding: 5px;
		cursor:pointer;
	}
	#message-container .unread .fa {
		color: orange
	}
	#message-container .read .fa {
		color: #fff
	}
	#message-container .message {
		border: 1px solid #ccc;
		border-radius: 5px;
		margin: 7px;
		overflow: hidden;
	}
	#message-container .message:hover {
		box-shadow: 0px 0px 6px 0px #adadad;
	}
	.iziModal-content{
		height:70vh;
	}
	.iziModal-content .content-wrapper{
		padding:15px;
	}
	#message-modal .iziModal-header-title{
		cursor:pointer;
	}
	#message-modal .receiver,#message-modal .subject{
		width:70%;
		margin-bottom:15px;
	}
	#message-modal .message{
		width:100%;
		height:calc(70vh - 270px);
		box-sizing: border-box;
		margin-bottom:15px;
	}
	#message-modal .btn-submit{
		padding: 12px;font-size: 20px;
	}
	#new-messages{
		font-size: 15px;
		font-weight: bold;
		color: white;
		background: #F44336;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: inline-block;
		text-align: center;
		position: absolute;
		right: -8px;
		top: 7px;
	}
	.search-input{
		width:100%;
		margin-top:10px;
		box-sizing: border-box;
	}
	#series-container .item{
		margin:10px;
	}
	#series-container .list-item{
		margin: 10px;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
	#series-container .item a{
		overflow: hidden;
		display:inline-block;
		text-overflow: ellipsis;
		white-space: nowrap;
		width:75%;
	}
	#series-container .list-item.genre:hover{
		cursor:pointer;
		color:orange;
	}
	#series-container .actions{
		float:right
	}
	#series-container .event{
		padding-left:5px;
	}
	#series-container .fa:hover{
		color:orange;
		curor:pointer;
	}
	.hidden{
		display:none !important;
	}
	.pointer{
		cursor:pointer;
	}
	.pointer:hover{
		color:orange;
	}
	`);
//storage.reset();
$(document).ready(function () {
    if ((window.location.href == 'https://bs.to/' || window.location.href == 'https://bs.to/home') && $('#navigation div strong').length) {
        sb.init();
        sidebar.init();
    } else if ($('#navigation div strong').length) {
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js", function () {
            if(sb.alwaysVisible){
                $('#root').css('margin', '10px').css('margin-left', '420px');
                sidebar.insertShoutbox();
            }else{
                sidebar.init();
            }
        });
    }
});
