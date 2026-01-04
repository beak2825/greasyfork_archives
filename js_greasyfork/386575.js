// ==UserScript==
// @name         Showdown Homelnns
// @namespace    http://tampermonkey.net/
// @version      0.1926
// @description  Upload/download your teams
// @author       txfsVGC
// @match        http://china.psim.us/*
// @match        http://47.94.147.145.psim.us/*
// @match        https://play.pokemonshowdown.com/*
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      https://code.jquery.com/ui/1.10.4/jquery-ui.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/386575/Showdown%20Homelnns.user.js
// @updateURL https://update.greasyfork.org/scripts/386575/Showdown%20Homelnns.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log(localStorage.showdown_teams);
    var url = "https://www.sin114514.xyz:5000/teams/";
    function downloadTeams( key ){
        $.ajax({
            url: url + key,
            type: 'get',
            datatype: 'json',
            success:function(data){
                console.log(data)
                if(data.message != "GETDAZE!")
                {
                    if(data.message == "Team is empty!")
                    {
                        alert("所查找的队伍为空，请确认key是否正确");
                    }
                    else
                    {
                        alert("我也不知道出了什么错");
                    }
                    return
                }
                var r = confirm("警告！从服务器下载的队伍将会覆盖当前浏览器本地存储的队伍，一经覆盖无法找回，请提前做好备份工作。\n是否决定将下载的队伍覆盖到本地？")
                if(r == true)
                {
                    localStorage.showdown_teams = data.showdown_teams;
                    alert("下载成功（大概吧）！请刷新页面查看teambuilder");
					return true;
                }
                else
				{
					return false;
				}
            },
        })
    }
    function uploadTeams( key ){
        $.ajax({
            url: url + key,
            type: 'post',
            headers: {"Content-Type": "application/json"},
            data:JSON.stringify({ [key]: localStorage.showdown_teams, ignore_duplication:'false'}),// ignore_duplication:为true时强制覆盖服务器上的队伍
            datatype:'json',
            success:function(data){
                console.log(data)
                if(data.message == "pass" && data.exists == "true")
                {
                    var r = confirm("key已存在，确定要覆盖服务器上的队伍吗？\n（注意！不是您曾使用过的key请不要选确认，否则会覆盖别人的队伍。）")
                    if(r == true)
                    {
                        // 再提交一次
                        $.ajax({
                            url: url + key,
                            type: 'post',
                            headers: {"Content-Type": "application/json"},
                            data:JSON.stringify({ [key]: localStorage.showdown_teams, ignore_duplication:'true'}),
                            datatype:'json',
                            success:function(data){
                                console.log(data);
                                alert("应该是上传成功了");
                            }
                        })
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    alert("应该是上传成功了");
                }
            },
        })
    }
    // 向页面body元素插入两个button，很难看但是能用，以后估计也不会改了
    jQuery('body').append('<button id="downloadbutton" style=position:fixed;top:1%;right:11%;height:2%;width:5%;" >Download Teams</button>');
    jQuery('body').append('<button id="uploadbutton" style=position:fixed;top:1%;right:18%;height:2%;width:5%;" >Upload Teams</button>');
    // 为button绑定事件
    $(function() {
        $( "#downloadbutton" )
            .button()
            .click(function( event ) {
            var key = prompt("请输入保存队伍时的key");
            if(key == "")
            {
                alert("key为空，一无所有");
            }
            else if(key == null)
            {
                return false;
            }
            else
            {
                downloadTeams( key );
            }

        });
    });
    $(function() {
        $( "#uploadbutton" )
            .button()
            .click(function( event ) {
            var key = prompt("请输入一个key标识将要上传的队伍\n（注意！key需尽量独特否则可能会与别人产生冲突）");
			if(key == "")
            {
                alert("key为空，一无所有");
            }
            else if(key == null)
            {
                return false;
            }
            else
            {
                uploadTeams( key );
            }
        });
    });
})();
