// ==UserScript==
// @name         果核音乐搜搜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  果核音乐搜搜下载flac
// @author       meiwenhua
// @match        https://music.ghpym.com
// @grant        none
// @require       http://code.jquery.com/jquery-3.3.1.min.js
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/389556/%E6%9E%9C%E6%A0%B8%E9%9F%B3%E4%B9%90%E6%90%9C%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/389556/%E6%9E%9C%E6%A0%B8%E9%9F%B3%E4%B9%90%E6%90%9C%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    vue.downmusic = function(index, data)
    {
        var play_button = $("div#app > main > div").eq(1).find(".el-table").find(".el-table__row").find(".el-table_1_column_5").eq(index).children().children().eq(1);
        songdata = data;
        this.rowdata = data;
        vue.downurl = ""
        if (play_button.find("span > i > a").length != 0)
        {
            play_button.find("span > i > a").remove();
            play_button.css("background", "#FFFFFF");
        }
        vue.geturl1('flac');
        if (vue.downurl != "" && vue.downurl != "/cdn2/")
        {
            play_button.css("background", "#32CD32");
            play_button.find("span > i").append(function() {
                var link = $('<a/>');
                link.attr('href', vue.downurl);
                link.attr('download', vue.songname+'.flac');
                link.text(vue.songname);
                return link;
            });
        }
        else if (vue.downurl == "/cdn2/")
        {
            alert("api fail")
        }
    }
    vue.geturl1 = function(type)
    {
        var request = $.ajax({
            url: "api/ajax.php",
            method: "POST",
            data: {
                id: songdata.songid,
                site: 'qq',
                fun: 'fun_get_music_url',
                type: type
            },
            async: false,
        }).done(function (data) {
            vue.downurl = data
            vue.songname = songdata.songname
            vue.singername = songdata.songername
        });
    }
    //add clean "play" button in this function.
    vue.search = function(page) {
        var site = this.radio
        var that = this
        var songname = that.songname
        if (songname == '') {
            this.$message('输入歌曲名称再搜索');
            return
        }
        that.loading = true
        //add clean "play" button here.
        $("div#app > main > div").eq(1).find(".el-table").find(".el-table__row").find(".el-table_1_column_5").each(function(i, l){
            var play_button = $(l).children().children().eq(1);
            if (play_button.find("span > i > a").length != 0)
            {
                play_button.find("span > i > a").remove();
                play_button.css("background", "#FFFFFF");
            }
        })
        $.post('api/ajax.php', {
            word: encodeURI(songname),
            page: page,
            fun: 'fun_search',
            site: site
        }, (data) => {
            var dataobj = JSON.parse(data)
            console.log(dataobj.data.list)
            that.decodelist(site, dataobj, that)

        })
    };
})();