// ==UserScript==
// @name         Plex External Player PotPlayer
// @namespace    https://github.com/Plex-External-Player-PotPlayer
// @version      1.4.5
// @description  插件用于激活本地PotPlayer 播放器使用。
// @author       北京土著 30344386@qq.com
// @include     /^https?://.*:32400/web.*
// @include     http://*:32400/web/index.html*
// @include     https://*:32400/web/index.html*
// @include     https://app.plex.tv/*
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @connect     *
// @require     https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430099/Plex%20External%20Player%20PotPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/430099/Plex%20External%20Player%20PotPlayer.meta.js
// ==/UserScript==

$("head").append(
    '<link href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet" type="text/css">'
);

// 消息设定
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "5000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "color": 'red'
};

// 输出消息
var showToast = function (msg, error) {
    var title = 'Plex External PotPlayer';
    if (error) {
        toastr.error(msg, title, { timeOut: 10000 });
        MSG(msg, 'Error');
    }
    else {
        toastr.success(msg, title);
        MSG(toastr, 'debug', 'xxx')
        //toast toast-success
    }
};

// 控制台输出
var MSG = function (msg, _type, _tag) {
    let did = debugID()
    if (_tag === undefined) {
        _tag = '[' + did + ']'
    }
    else {
        _tag = '[' + _tag + '-' + did + ']'
    }
    _type = '' + _type
    _type = _type.toLowerCase()
    if (_type === 'info') {
        _type = 'INFO'

        let style = 'color: #61afef'
        console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: Bgin ↓', style);
        console.log(msg);
        console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: End ↑', style);
    }
    else if (_type === 'debug') {
        if (toastr.options['debug'] === true) {
            _type = 'DEBUG'
            let style = 'color: #e5c07b'
            console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: Bgin ↓', style);
            console.log(msg);
            console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: End ↑', style);
        }
    }
    else if (_type === 'warn') {
        _type = 'WARN'
        let style = 'color: #e5c07b'
        console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: Bgin ↓', style);
        console.log(msg);
        console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: End ↑', style);
    }
    else if (_type === 'error') {
        _type = 'ERROR'
        let style = 'color: #e06c75'
        console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: Bgin ↓', style);
        console.log(msg);
        console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: End ↑', style);
    }
    else {
        _type = 'LOG'
        let style = 'color: #98c379'
        console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: Bgin ↓', style);
        console.log(msg);
        console.log('%c ' + _tag + '-[Plex External PotPlayer ' + _type + ']: End ↑', style);
    }
};

//得到 Plex Servers
var makeRequest = function (url, serverId) {
    return new Promise(function (resolve, reject) {
        var origAccessToken = localStorage.myPlexAccessToken;
        var serverNode = {};
        if (localStorage.users) {
            serverNode = JSON.parse(localStorage.users);
            MSG(serverNode, 'debug')
        } else {
            MSG(Language.User_details_not_found, 'error')
        }
        var tokenToTry = origAccessToken;
        if (serverNode === undefined) {
            serverNode = {
                users: []
            };
        }

        let tokenFound = false
        if (serverId !== undefined) {
            serverLoop:
            for (var i = 0; i < serverNode.users.length; i++) {
                MSG(getJSLocale(Language.Checking_server_list_for_user, { user: serverNode.users[i].servers.length, server: serverNode.users[i].username }))
                for (var j = 0; j < serverNode.users[i].servers.length; j++) {
                    MSG(getJSLocale(Language.Checking_server_with_id, { id: serverNode.users[i].servers[j].machineIdentifier }), 'debug')
                    if (serverNode.users[i].servers[j].machineIdentifier == serverId) {
                        tokenToTry = serverNode.users[i].servers[j].accessToken;
                        MSG(getJSLocale(Language.Token_found, { token: tokenToTry }), 'debug');
                        tokenFound = true
                        break serverLoop;
                    }
                }
            }
            token = tokenToTry;
            if (!tokenFound) {
                showToast(getJSLocale(Language.No_authentication_information_found), 1);
                reject();
                return;
            }
        }
        var authedUrl = url + '&X-Plex-Token=' + tokenToTry;
        MSG(getJSLocale(Language.Verify_permissions_URL, { authurl: authedUrl }), 'debug');
        GM_xmlhttpRequest({
            method: "GET",

            url: authedUrl,
            onload: function (state) {
                if (state.status === 200) {
                    MSG(Language.Verify_permissions_successfully, 'Log');
                    resolve(state);
                }
            },
            onreadystatechange: function (state) {
                if (state.readyState === 4) {

                    if (state.status === 401) {
                        MSG(Language.unauthorized, 'Error');
                        showToast(Language.unauthorized, 1)
                    } else if (state.status !== 200) {
                        MSG(getJSLocale(Language.Request_return_status, { status: state.status }), 'error');
                        MSG(getJSLocale(Language.Call_error_response_code_message, { url: url, responseText: state.responseText, status: state.status, statusText: state.statusText }), 'error')
                        showToast(getJSLocale(Language.Request_return_status, { status: state.status }), 1);
                    }
                }
            },
        });
    });
};

var getHosts = function () {
    MSG(Language.Find_server_address)
    makeRequest('https://plex.tv/api/resources?includeHttps=1&X-Plex-Token=' + localStorage.myPlexAccessToken)
        .then(function (response) {
            let parts = response.responseXML.getElementsByTagName('Device');
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].getAttribute('product') == 'Plex Media Server') {
                    let connections = parts[i].getElementsByTagName('Connection');
                    for (let j = 0; j < connections.length; j++) {
                        if (connections[j].getAttribute('local') == parts[i].getAttribute('publicAddressMatches')) {
                            pmsUrls.set(parts[i].getAttribute('clientIdentifier'), 'http://' + connections[j].getAttribute('address') + ':' + connections[j].getAttribute('port'));
                            MSG(getJSLocale(Language.Get_the_server_address, { address: 'http://' + connections[j].getAttribute('address') + ':' + connections[j].getAttribute('port') }))
                            break;
                        }
                    }
                }
            }
        }).catch(function () {
            MSG(Language.Failed_to_get_PMS_URLs, 'error')
            showToast(Language.Failed_to_get_PMS_URLs, 1);
        });
}

var pmsUrls = new Map();
var token = '';
var title = '';
setTimeout(function () {
    getHosts();
}, 1000);


// 单击侦听器
var clickListener = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var subTitleID = jQuery(e.target).closest('button').attr('id')
    var a = jQuery(e.target).closest('a');
    var link = a.attr('href');
    var url = link;
    if (link === '#' || link === undefined || link === 'javascript:void(0)') {
        url = window.location.hash;
    }

    if (url.indexOf('/server/') > -1) {
        var serverId = url.split('/')[2];
    }

    if (url.indexOf('%2Fmetadata%2F') > -1) {
        var idx = url.indexOf('%2Fmetadata%2F');
        var mediaId = url.substr(idx + 14);
        var idToken = mediaId.indexOf('&');
        if (idToken > -1) {
            mediaId = mediaId.substr(0, idToken);
        }
    }

    var metaDataPath = pmsUrls.get(serverId) + '/library/metadata/' + mediaId + '?includeConcerts=1&includeExtras=1&includeOnDeck=1&includePopularLeaves=1&includePreferences=1&includeChapters=1&asyncCheckFiles=0&asyncRefreshAnalysis=0&asyncRefreshLocalMediaAgent=0&X-Plex-Token=' + localStorage.myPlexAccessToken;
    MSG(getJSLocale(Language.Get_Media_address, { mediaaddress: metaDataPath }), 'debug')
    makeRequest(metaDataPath, serverId)
        .then((response) => {
            let mediaurl = '';
            let subtitlelist = [];
            let ratingKey = "";
            let viewOffset = "";
            let Video = response.responseXML.getElementsByTagName('Video');
            for (let i = 0; i < Video.length; i++) {
                if (Video[i].attributes['ratingKey'] !== undefined) {
                    ratingKey = Video[i].attributes['ratingKey'].value;
                    if (Video[i].attributes['viewOffset'] === undefined) {
                        viewOffset = 0;
                    }
                    else {
                        viewOffset = Video[i].attributes['viewOffset'].value;
                    }
                    title = ' [' + Video[i].attributes['title'].value + '] ';
                    break;
                }
            }

            let parts = response.responseXML.getElementsByTagName('Part');
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].attributes['file'] !== undefined) {
                    mediaurl = pmsUrls.get(serverId) + parts[i].attributes['key'].value + '?download=1';
                }
            }

            let Stream = response.responseXML.getElementsByTagName('Stream');
            for (let i = 0; i < Stream.length; i++) {
                if (Stream[i].attributes['key'] !== undefined) {
                    let subtitlekey = Stream[i].attributes['key'].value;
                    if (subtitlekey !== undefined) {
                        subtitlelist.push(subtitlekey);
                    }
                    else {
                        MSG(Language.The_local_external_subtitle_file_was_not_found);
                    }
                }
            }

            let subtitleUrl = '';
            if (subTitleID !== undefined) {
                subtitleUrl = pmsUrls.get(serverId) + '/library/streams/' + subTitleID
            }
            else {
                if (subtitlelist.length > 0) {
                    for (let i = 0; i < subtitlelist.length; i++) {
                        subtitleUrl = pmsUrls.get(serverId) + subtitlelist[0]
                    }
                }
            }
            var authedUrl = mediaurl + '&ratingKey=' + ratingKey + '&X-Plex-Token=' + token;
            if (viewOffset !== 0) {
                viewOffset = parseInt(viewOffset)

                let d = 86400000
                let h = 3600000
                let m = 60000
                let s = 1000
                let H = 0
                let M = 0
                let S = 0

                let _hh = viewOffset % d
                H = Math.trunc(_hh / h)
                let _mm = _hh % h
                M = Math.trunc(_mm / m)
                let _ss = _mm % m
                S = Math.trunc(_ss / s)
                viewOffset = '' + H + ':' + M + ':' + S + '.00'
            }
            else {
                viewOffset = "0:0:0.00"
            }

            if (subtitleUrl !== '') {
                subtitleUrl = " /sub=" + subtitleUrl + '?X-Plex-Token=' + token
            }

            let poturl = "potplayer://" + authedUrl + " /seek=" + viewOffset + subtitleUrl;
            MSG(poturl, 'debug')
            showToast(getJSLocale(Language.Successfully_parsed_the_path_of_the_movie, { mediatitle: title }))
            jQuery(e.target).closest('button').blur()
            window.open(poturl, "_parent");
        });

};

// 绑定按钮
var bindClicks = function () {
    var hasBtn = false;
    var DisclosureArrowButton_e = ""
    var button_class = ""
    var NewDisclosureArrowButton_e = jQuery("[class^='DisclosureArrowButton-disclosureArrowButton-1ReSRg Link-link-3cHWtJ DisclosureArrowButton-medium-1crRwr DisclosureArrowButton-isSelected-1637uR Link-link-3cHWtJ Link-default-5Qrl3D Link-isSelected-3BPEaB']")
    var OldDisclosureArrowButton_e = jQuery("[class^='DisclosureArrowButton-disclosureArrowButton-17hnir Link-link-CM9nxg DisclosureArrowButton-medium-3V4GGe DisclosureArrowButton-isSelected-2ebs5E Link-link-CM9nxg Link-default-1mYhCE Link-isSelected-1hxmpf']")
    if (NewDisclosureArrowButton_e.length > 0) {
        DisclosureArrowButton_e = NewDisclosureArrowButton_e
        button_class = "ActionButton-actionButton-2ABhR9 ActionButton-labeledActionButton-1rGNFQ ActionButton-medium-1LFys5 Button-button-16qRwa Button-primary-2KRMRA Link-default-tp1vyl Link-link-1Kt-hA"
    }
    if (OldDisclosureArrowButton_e.length > 0) {
        DisclosureArrowButton_e = OldDisclosureArrowButton_e
        button_class = "ActionButton-labeledActionButton-3gloir ActionButton-medium-2--fwJ Button-button-1q7C1V Button-primary-BXmP5W Link-link-2WGTd7"
    }
    if (DisclosureArrowButton_e.length > 0) {
        var toolBar = jQuery("#plex-icon-toolbar-play-560").parent().parent();
        toolBar.children('button').each(function (i, e) {
            if (jQuery(e).hasClass('plexextplayer')) {
                jQuery(e).addClass(button_class)
                hasBtn = true;
            }
        });

        if (!hasBtn) {
            var template = jQuery('<button class="play-btn media-poster-btn btn-link plexextplayer" tabindex="-1" title="外部播放器"><i class="glyphicon play plexextplayer plexextplayerico"></i></button>');
            toolBar.prepend(template);
            template.click(clickListener);
        }
    }
};


// Make buttons smaller
jQuery('body').append('<style>.plexextplayericocover {right: 10px; top: 10px; position:absolute; display:none;font-size:15px;} .glyphicon.plexfolderextplayerico:before {  content: "\\e145";   } .glyphicon.plexextplayerico:before {  content: "\\e161";   }</style>');


// 绑定按钮并每 100 毫秒检查一次新按钮
// 放置脚本最后
setInterval(bindClicks, 100);

var chengeSubtitle = function () {
    var menu = ""
    var menu_item = ""
    var NewMenu = jQuery("div[class^='Menu-menu-3iOTrU Menu-large-MtzjGL']")
    var OldMenu = jQuery("div[class^='Menu-menu-1qURRT Menu-large-3Xoqor']")
    if (NewMenu.length > 0) {
        menu = NewMenu
        menu_item = "[class^='SubtitlesStreamsMenu-menuLabelClassName-34my5L SelectedMenuItem-menuLabel-1VXIKp']"
    }
    if (OldMenu.length > 0) {
        menu = OldMenu
        menu_item = "[class^='SubtitlesStreamsMenu-menuLabelClassName-2ifVd9 SelectedMenuItem-menuLabel-1WTzXp']"
    }

    MSG(menu, 'debug', 'xxx')
    jQuery(menu).css('width', '360px')
    jQuery(menu).each(function (i, l_e) {
        l_e = jQuery(l_e)
        let sublist = l_e.find(menu_item)
        sublist.each(function (i, i_e) {
            i_e = jQuery(i_e)
            if (i_e.find('span').length === 2) {
                i_e.find('span')[1].textContent = ''
            }
            if (i_e.find('span')[0].innerText.split(' ').length > 2) {
                let p_e = jQuery(i_e.parent())
                jQuery(p_e.find('button')).css('margin-right', '10px')
                if (i_e.parent().find('.plexextplayer').length === 0) {
                    let subTitleID = i_e.parent().parent().attr('value')
                    var template = jQuery('<button id="' + subTitleID + '" class="play-btn media-poster-btn btn-link plexextplayer" tabindex="-1" title="外部播放器"><i class="glyphicon play plexextplayer plexextplayerico"></i></button>');
                    p_e.prepend(template)
                    template.click(clickListener);
                }
            }
        })
    });
}
setInterval(chengeSubtitle, 100);

function debugID() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4());
}

function getRow() {
    let err = new Error().stack.split('at')
    err = err[err.length - 1].split(':')
    err = err[err.length - 1].replace(')', '')
    return parseInt(err)
}

function getJSLocale(key, params) {
    var result = ""; 	// 对应的资源的内容
    var paramsObj = {};	// 参数对象
    if (params) paramsObj = params;

    if (typeof (key) != 'undefined' && typeof (Language) != 'undefined') {
        // 根据key取得对应的资源内容，如果没有找到则返回key值
        if (Language[key] != undefined) {
            result = Language[key];
        } else {
            result = key;
        }

        // 替换对应参数为value的值
        var regExp = new RegExp(); //替换资源中参数的正则
        for (var k in paramsObj) {
            regExp = eval("/{{:" + k + "}}/g");
            result = result.replace(regExp, paramsObj[k]);
        }

        // 如果没有找到对应的资源则返回 "No Value"
        if (/{{:[a-zA-Z]+}}/.test(result)) {
            result = result.replace(/{{:[a-zA-Z]+}}/g, "No Value");
        }
    }
    return result;
}

var lang = navigator.language.toLowerCase()
var Language = {}
if (lang === 'zh-cn') {
    Language = {
        User_details_not_found: '未找到用户详细信息',
        Checking_server_list_for_user: '检查第 {{:user}} 个用户的 {{:server}} 服务器列表',
        Checking_server_with_id: '使用服务器ID {{:id}} 检查服务器',
        Token_found: '找到令牌:{{:token}}',
        No_authentication_information_found: '找不到身份验证信息',
        Verify_permissions_URL: '验证权限URL:{{:authurl}}',
        Verify_permissions_successfully: '验证权限成功',
        unauthorized: '未授权',
        Request_return_status: '请求返回状态:{{:status}}',
        Call_error_response_code_message: '调用错误:{{:url}}\n响应:{{:responseText}}代码:{{:status}}消息:{{:statusText}}',
        Find_server_address: '查找服务器地址',
        Get_the_server_address: '得到服务器地址：{{:address}}',
        Failed_to_get_PMS_URLs: '获取服务器地址失败',
        Get_Media_address: '得到媒体地址:{{:mediaaddress}}',
        The_local_external_subtitle_file_was_not_found: '未找到本地外挂字幕文件',
        Successfully_parsed_the_path_of_the_movie: '成功解析电影{{:mediatitle}}的路径，正在激活本地PotPlayer播放器。'
    }
}
if (lang === 'en') {
    Language = {
        User_details_not_found: 'User details not found',
        Checking_server_list_for_user: 'Checking the {{:server}} service list of the {{:user}}th user',
        Checking_server_with_id: 'Check the server with server ID {{:id}}',
        Token_found: 'Token found: {{:token}}',
        No_authentication_information_found: 'No authentication information found',
        Verify_permissions_URL: 'Verification authority URL: {{:authurl}}',
        Verify_permissions_successfully: 'Verify permissions successfully',
        unauthorized: 'unauthorized',
        Request_return_status: 'Request return status: {{:status}}',
        Call_error_response_code_message: 'Call error: {{:url}}\nResponse: {{:responseText}} Code: {{:status}} Message: {{:statusText}}',
        Find_server_address: 'Find server address',
        Get_the_server_address: 'Get the server address:{{:address}}',
        Failed_to_get_PMS_URLs: 'Failed to get PMS URLs',
        Get_Media_address: 'Get media address:{{:mediaaddress}}',
        The_local_external_subtitle_file_was_not_found: 'The local external subtitle file was not found',
        Successfully_parsed_the_path_of_the_movie: 'Successfully parsed the path of the movie {{:mediatitle}}, and the local PotPlayer player is being activated'
    }
}
